/* =========================================================================
   DILITECH — petit magasin d'état réactif
   -------------------------------------------------------------------------
   Un Proxy surveille les écritures et prévient les abonnés. Trois propriétés que
   nous voulions et qu'un simple objet ne donne pas :

     1. réactivité      — toute écriture notifie, y compris en profondeur ;
     2. persistance     — l'état survit au rechargement (localStorage) ;
     3. synchronisation — deux onglets ouverts sur le site partagent le même
                          panier de devis, via BroadcastChannel.

   La notification est différée à la microtâche suivante : dix écritures
   d'affilée ne produisent qu'un seul rendu.
   ========================================================================= */

/**
 * @param {object} initial    état de départ
 * @param {object} [options]
 * @param {string} [options.cle]    clé localStorage — active la persistance
 * @param {string} [options.canal]  nom BroadcastChannel — active la synchro
 * @param {(brut:any)=>any} [options.valider] filtre appliqué à l'état relu
 */
export function creerStore(initial, { cle, canal, valider } = {}) {
  const abonnes = new Set();
  let notificationPrevue = false;
  let silencieux = false; // vrai pendant l'application d'un état distant
  let enLot = false;      // vrai pendant une transaction : on diffère tout

  /* --- relecture du stockage ----------------------------------------- */
  let depart = structuredClone(initial);
  if (cle) {
    try {
      const brut = localStorage.getItem(cle);
      if (brut) {
        const relu = JSON.parse(brut);
        depart = valider ? valider(relu) ?? depart : { ...depart, ...relu };
      }
    } catch {
      /* Stockage illisible (navigation privée, quota, données d'une version
         antérieure) : on repart de l'état initial sans casser la page. */
      try { localStorage.removeItem(cle); } catch { /* rien à faire */ }
    }
  }

  const notifier = () => {
    if (enLot || notificationPrevue) return;
    notificationPrevue = true;
    queueMicrotask(() => {
      notificationPrevue = false;
      const instantane = etat;
      for (const fn of abonnes) {
        try { fn(instantane); } catch (e) { console.error('[store] abonné en erreur', e); }
      }
    });
  };

  /* On persiste et on diffuse TOUJOURS `brutEtat`, jamais `etat` : ce dernier
     est un Proxy, et structuredClone refuse de cloner un Proxy. */
  const persister = () => {
    if (enLot || silencieux) return;
    if (cle) {
      try {
        localStorage.setItem(cle, JSON.stringify(brutEtat));
      } catch {
        /* Quota dépassé ou stockage refusé (navigation privée) : le site
           continue de fonctionner, seule la persistance est perdue. */
      }
    }
    try {
      diffusion?.postMessage({ type: 'maj', etat: structuredClone(brutEtat) });
    } catch {
      /* État non clonable : la synchro entre onglets est abandonnée, le
         reste du magasin n'en dépend pas. */
    }
  };

  /* --- Proxy récursif -------------------------------------------------- */
  const enveloppes = new WeakMap();
  function reactif(cible) {
    if (cible === null || typeof cible !== 'object') return cible;
    if (enveloppes.has(cible)) return enveloppes.get(cible);
    const p = new Proxy(cible, {
      get: (o, k, r) => reactif(Reflect.get(o, k, r)),
      set(o, k, v, r) {
        if (Object.is(Reflect.get(o, k, r), v)) return true;
        const ok = Reflect.set(o, k, v, r);
        if (ok) { persister(); notifier(); }
        return ok;
      },
      deleteProperty(o, k) {
        const ok = Reflect.deleteProperty(o, k);
        if (ok) { persister(); notifier(); }
        return ok;
      },
    });
    enveloppes.set(cible, p);
    return p;
  }

  let brutEtat = depart;
  let etat = reactif(brutEtat);

  /* --- synchronisation entre onglets ---------------------------------- */
  let diffusion = null;
  if (canal && 'BroadcastChannel' in globalThis) {
    diffusion = new BroadcastChannel(canal);
    diffusion.addEventListener('message', (e) => {
      if (e.data?.type !== 'maj') return;
      silencieux = true;              // ne pas réémettre ce qu'on vient de recevoir
      brutEtat = e.data.etat;
      etat = reactif(brutEtat);
      silencieux = false;
      notifier();
    });
  }

  return {
    /** L'état réactif : on le lit et on l'écrit comme un objet ordinaire. */
    get etat() { return etat; },

    /** Abonnement ; renvoie la fonction de désabonnement. */
    abonner(fn, { immediat = true } = {}) {
      abonnes.add(fn);
      if (immediat) fn(etat);
      return () => abonnes.delete(fn);
    },

    /**
     * Écriture groupée : une seule écriture disque et une seule notification
     * pour tout le lot, quel que soit le nombre de champs touchés.
     */
    transaction(fn) {
      enLot = true;
      try { fn(etat); } finally {
        enLot = false;
        persister();
        notifier();
      }
    },

    /** Remise à zéro complète. */
    reinitialiser() {
      brutEtat = structuredClone(initial);
      etat = reactif(brutEtat);
      persister();
      notifier();
    },
  };
}

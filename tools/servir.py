#!/usr/bin/env python3
"""
Serveur de développement du site Dilitech.

    python tools/servir.py           # http://127.0.0.1:5610
    python tools/servir.py 8080

Pourquoi un script plutôt que `python -m http.server` :

  1. Il se lie à 127.0.0.1 et NON à `localhost`. Sur les postes où Docker ou
     WSL tourne, `localhost` part en IPv6 vers un autre service et renvoie
     des réponses qui n'ont rien à voir avec ce dossier.
  2. Il sert le bon type MIME pour les modules `.js` et les `.svg`, sans quoi
     le navigateur refuse d'exécuter les modules ES.
  3. Il désactive le cache : on recharge et on voit sa modification.

Le site est 100 % statique : ce serveur ne sert qu'au développement. En
production, n'importe quel hébergement de fichiers convient.
"""
import http.server
import os
import socketserver
import sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5610


class Gestionnaire(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RACINE, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, format, *args):
        # Une ligne par requête, sans l'horodatage verbeux d'origine.
        if not args[0].startswith("GET /favicon"):
            print(f"  {args[0]}  →  {args[1]}")


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Gestionnaire) as httpd:
        print(f"\n  Dilitech — serveur de développement")
        print(f"  {RACINE}")
        print(f"\n  →  http://127.0.0.1:{PORT}/\n")
        print("  (viser 127.0.0.1 et non localhost — voir l'en-tête du script)\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  arrêt\n")

# Klopfan

Fenster-Aufmaß, geführt. Hauseigentümer messen ihre Fenster selbst, Schritt für Schritt erklärt, mit Fotos, 3-D-Modell und allen Wünschen. Fensterbauer bekommen ein vollständiges Aufmaß fürs Angebot, ohne Anfahrt.

**Stand: Pilotphase.** Statische Website ohne eigenen Server: Kundenlinks, Messen, PDF und Code-Übergabe an den Betrieb funktionieren; der Marktplatz im Portal ist eine Vorschau mit Beispieldaten, es wird nichts berechnet. Details und nächste Schritte: [docs/ONLINE-STELLEN.md](docs/ONLINE-STELLEN.md).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `web/` | die Website, so wie sie ausgeliefert wird (Cloudflare Pages: Ausgabeverzeichnis `web`, kein Build-Befehl) |
| `web/index.html` | Portal für Fensterbauer und Hauseigentümer |
| `web/app/` | Mess-App für Kunden, Kundenlinks: `/app/#k-…` |
| `web/assets/` | Programmcode und Gestaltung (`app.*`, `portal.*`, gemeinsam `gemeinsam.*` mit Logo und KI-Anbindung, Rechtsseiten `recht.css`) |
| `web/config.js` | Einstellungen ohne Geheimnisse (Name, Pilotmodus, KI-Adresse) |
| `web/impressum/`, `web/datenschutz/` | Rechtsseiten (Entwürfe mit Platzhaltern) |
| `web/_headers` | Sicherheits-Kopfzeilen, in der Pilotphase `noindex` |
| `web/favicon.svg`, `web/apple-touch-icon.png` | Logo: weiße Faust auf schwarzer Kachel, die anklopft |
| `web/fonts/`, `web/vendor/` | Maven Pro (OFL), jsPDF (MIT) und qrcode-generator (MIT), lokal statt von fremden Servern |
| `functions/api/ki.js` | KI-Auswertung der Fotos (Cloudflare Pages Function), Schlüssel als Secret `ANTHROPIC_API_KEY` |
| `scripts/` | lokaler Testserver, Browser-Prüfung, Umbenennen |
| `docs/ONLINE-STELLEN.md` | Schritt-für-Schritt-Anleitung |
| `docs/ABRECHNUNG.md` | Abrechnungsregeln: was gezählt wird, wo die Zahlung einsetzt, Nachbesserung, Schranken, was der Server später erzwingt |

## Kurz: online stellen

Cloudflare → Workers & Pages → Pages mit GitHub verbinden → dieses Repo, Branch `main`, Framework `None`, Build-Befehl leer, Ausgabeverzeichnis `web`. Alles Weitere in der [Anleitung](docs/ONLINE-STELLEN.md).

## Lokal testen

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs   # http://localhost:8788
```

## Name ändern

```bash
python3 scripts/marke-umbenennen.py NeuerName
```

## Lizenzen

Schrift Maven Pro: SIL Open Font License 1.1 (`web/fonts/OFL.txt`). jsPDF 2.5.1: MIT (`web/vendor/jspdf.LICENSE.txt`). qrcode-generator 2.0.4: MIT (`web/vendor/qrcode.LICENSE.txt`).

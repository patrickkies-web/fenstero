# Fensterino

Die Aufmaß-App für Fenster. Hauseigentümer messen ihre Fenster selbst, Schritt für Schritt erklärt, mit Fotos, 3-D-Modell und allen Wünschen; das fertige Aufmaßblatt als PDF kostet einmal 7,99 €. Fensterbauer laden Kunden per Aufmaß-Link ein und bekommen ein vollständiges Aufmaß fürs Angebot, ohne Anfahrt: 3 Projekte frei, dann 9 € je Projekt, Abo 10 für 49 € oder Plus für 79 € im Monat.

**Stand: Pilotphase, Stufe 2 vorbereitet.** Ohne Schlüssel läuft die Website im Browser: Kundenlinks, Messen, PDF und Code-Übergabe an den Betrieb funktionieren, der Kauf ist ein gekennzeichneter Testkauf, der Bereich für Betriebe zeigt Beispielprojekte. Sobald Supabase und Stripe eingetragen sind (`functions/api/`, `supabase/schema.sql`), gibt es echte Konten, direkte Übertragung, Zahlungen und Abrechnung. Anleitung: [docs/ONLINE-STELLEN.md](docs/ONLINE-STELLEN.md), Regeln: [docs/ABRECHNUNG.md](docs/ABRECHNUNG.md).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `web/` | die Website, so wie sie ausgeliefert wird (statische Dateien, kein Build-Schritt) |
| `wrangler.jsonc`, `worker.js` | Cloudflare Workers: liefert `web/` aus, beantwortet `/api/…` und startet den Abrechnungslauf (Cron); `"name"` muss zum Worker im Dashboard passen |
| `web/index.html` | Startseite und Bereich für Fensterbauer (Projekte, Aufmaß-Links, Einladungslisten, Abrechnung) |
| `web/app/` | Mess-App für Kunden, Kundenlinks: `/app/#k-…` |
| `web/assets/` | Programmcode und Gestaltung (`app.*`, `portal.*`, gemeinsam `gemeinsam.*` mit Logo und KI-Anbindung, Rechtsseiten `recht.css`) |
| `web/assets/blatt.js`, `blatt-schrift.js` | das Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben (für den Kunden, für den Fensterbauer, im Betriebsbereich in dessen Farben), Maven Pro eingebettet (OFL), wird erst beim Erzeugen geladen |
| `web/assets/modell.js` | Abrechnungsregeln und Aufmaß-Modell, im Browser und auf dem Server derselbe Code |
| `web/config.js` | Einstellungen ohne Geheimnisse (Name, Pilotmodus, KI-Adresse, Preise für den Pilot) |
| `web/impressum/`, `web/datenschutz/` | Rechtsseiten (Entwürfe mit Platzhaltern) |
| `web/_headers` | Sicherheits-Kopfzeilen, in der Pilotphase `noindex` |
| `web/favicon.svg`, `web/apple-touch-icon.png` | Logo: weißes Fenster auf schwarzer Kachel, der Flügel kippt kurz |
| `web/fonts/`, `web/vendor/` | Maven Pro (OFL), jsPDF (MIT), qrcode-generator (MIT) und lottie-web light (MIT), lokal statt von fremden Servern |
| `web/assets/lottie/`, `scripts/lottie-erzeugen.py` | fünf gezeichnete Bewegtbilder, aus Code erzeugt (`python3 scripts/lottie-erzeugen.py web/assets/lottie`) |
| `functions/api/` | der Server: `router.js` (Verteiler), `ki.js` (KI-Auswertung), `zahlung.js` (Kauf des Aufmaßblatts, Nachweis, Webhook), `konten.js` (Betriebe, Projekte, Eingang, Tarif, Sammelrechnung), `stripe.js`, `auth.js` (E-Mail-Code über Supabase Auth), `speicher.js` (Supabase oder Attrappe), `umgebung.js` (alle Variablen) |
| `supabase/schema.sql` | die drei Tabellen, einmal im Supabase-Projekt ausführen |
| `scripts/` | lokaler Testserver (mit Attrappen für Datenbank und Kasse), Browser-Prüfung in 8 Abschnitten, Umbenennen |
| `docs/ONLINE-STELLEN.md` | Schritt-für-Schritt-Anleitung |
| `docs/ABRECHNUNG.md` | Preise und Abrechnungsregeln: was gezählt wird, wo die Paywalls sitzen, Nachbesserung, Schranken, was der Server erzwingt |
| `docs/GESTALTUNG.md` | Gestaltungsregeln: Tokens, Schriftrollen, Bedienelemente mit Zuständen, Bewegungskatalog, Rückmeldungen, Entscheidungen, Nachweis |

## Kurz: online stellen

Cloudflare → Workers & Pages → Repository importieren → dieses Repo, Worker-Name `fenstero`, Bereitstellungsbefehl `npx wrangler deploy`, Pfad `/`, Branch `main`. Die Domain hängt am Worker unter Einstellungen → Domains & Routen. Alles Weitere in der [Anleitung](docs/ONLINE-STELLEN.md).

## Lokal testen

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs                                       # Pilot, http://localhost:8788
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 PORT=8789 node scripts/dev-server.mjs   # Stufe 2 nachgestellt: Anmeldecode 123456, Kassen ohne Stripe
node scripts/pruefen.mjs                                                        # Browser-Prüfung (NUR=8 nur den Servermodus)
npx wrangler dev                                                                # wie bei Cloudflare, http://localhost:8787
```

## Name ändern

```bash
python3 scripts/marke-umbenennen.py NeuerName
```

## Lizenzen

Schrift Maven Pro: SIL Open Font License 1.1 (`web/fonts/OFL.txt`). jsPDF 2.5.1: MIT (`web/vendor/jspdf.LICENSE.txt`). qrcode-generator 2.0.4: MIT (`web/vendor/qrcode.LICENSE.txt`). lottie-web 5.12.2 (light): MIT (`web/vendor/lottie.LICENSE.txt`).

# eeziframes

Fensterplanung, easy gemacht: die Aufmaß-App für Fenster. Der Name wird immer kleingeschrieben (Regeln zur Marke und zum Wortspiel mit „eezi“: [docs/GESTALTUNG.md](docs/GESTALTUNG.md)). Hauseigentümer messen ihre Fenster selbst, Schritt für Schritt erklärt, mit Fotos, 3-D-Modell und allen Wünschen – Fenster mit Ober- und Unterlicht, Festverglasungen, Hebe-Schiebe-Türen und Faltschiebewände, Rollladen, Raffstore und Screen, Rollo, Plissee und Jalousie; wo noch kein Fenster ist, zeichnen sie die neue Öffnung auf dem Foto ein; das fertige Aufmaßblatt als PDF kostet einmal 7,99 €. Fensterbauer laden Kunden per Aufmaß-Link ein und bekommen ein vollständiges Aufmaß fürs Angebot, ohne Anfahrt: 3 Projekte frei, dann 9 € je Projekt, Abo 10 für 49 € oder Plus für 79 € im Monat.

**Stand: Pilotphase, Stufe 2 vorbereitet.** Ohne Schlüssel läuft die Website im Browser: Kundenlinks, Messen, PDF und Code-Übergabe an den Betrieb funktionieren, der Kauf ist ein gekennzeichneter Testkauf, Konten von Betrieben liegen im Browser. Zum Kennenlernen ohne Konto gibt es die Führung in der App (`/app/#fuehrung`) und die Tour für Fensterbauer. Sobald Supabase und Stripe eingetragen sind (`functions/api/`, `supabase/schema.sql`), gibt es echte Konten, direkte Übertragung, Zahlungen und Abrechnung. Anleitung: [docs/ONLINE-STELLEN.md](docs/ONLINE-STELLEN.md), Regeln: [docs/ABRECHNUNG.md](docs/ABRECHNUNG.md). Für Suchmaschinen und KI-Assistenten ist alles vorbereitet (Ratgeber, Textfassung, strukturierte Daten, Sitemap, `llms.txt`), aber noch gesperrt, bis Impressum und Datenschutz fertig sind: [docs/SEO.md](docs/SEO.md).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `web/` | die Website, so wie sie ausgeliefert wird (statische Dateien, kein Build-Schritt) |
| `wrangler.jsonc`, `worker.js` | Cloudflare Workers: liefert `web/` aus, beantwortet `/api/…` und startet den Abrechnungslauf (Cron); `"name"` muss zum Worker im Dashboard passen |
| `web/index.html` | Startseite und Bereich für Fensterbauer (Projekte, Aufmaß-Links, Einladungslisten, Abrechnung) |
| `web/app/` | Mess-App für Kunden, Kundenlinks: `/app/#k-…` |
| `web/ratgeber/`, `web/fuer-fensterbauer/` | Ratgeber (Fenster ausmessen, Aufmaßblatt mit Vorlage, Fenster austauschen) und die Seite für Fensterbauer, reines HTML für Menschen, Suchmaschinen und KI-Assistenten (`ratgeber.css`); Startseite und App tragen dieselbe Art Textfassung für Leser ohne JavaScript |
| `web/assets/` | Programmcode und Gestaltung (`app.*`, `portal.*`, gemeinsam `gemeinsam.*` mit Logo und KI-Anbindung, Rechtsseiten `recht.css`) |
| `web/assets/blatt.js`, `blatt-schrift.js` | das Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben (für den Kunden, für den Fensterbauer, im Betriebsbereich in dessen Farben), Maven Pro eingebettet (OFL), wird erst beim Erzeugen geladen |
| `web/assets/modell.js` | Abrechnungsregeln und Aufmaß-Modell, im Browser und auf dem Server derselbe Code |
| `web/config.js` | Einstellungen ohne Geheimnisse (Name, Pilotmodus, KI-Adresse, Preise für den Pilot) |
| `web/impressum/`, `web/datenschutz/` | Rechtsseiten (Entwürfe mit Platzhaltern) |
| `web/_headers` | Sicherheits-Kopfzeilen, in der Pilotphase `noindex` |
| `functions/seo.js` | Auffindbarkeit: `robots.txt`, `sitemap.xml`, `llms.txt` und die Kopfzeilen der Seiten (Canonical, Sicherheit, `noindex` nur in der Pilotphase); Freigabe über die Variable `INDEXIERUNG` |
| `web/favicon.svg`, `web/apple-touch-icon.png` | Logo: weißes Fenster auf schwarzer Kachel, der Flügel kippt kurz |
| `web/fonts/`, `web/vendor/` | Maven Pro (OFL), jsPDF (MIT), qrcode-generator (MIT) und lottie-web light (MIT), lokal statt von fremden Servern |
| `web/assets/lottie/`, `scripts/lottie-erzeugen.py` | fünf gezeichnete Bewegtbilder, aus Code erzeugt (`python3 scripts/lottie-erzeugen.py web/assets/lottie`) |
| `functions/api/` | der Server: `router.js` (Verteiler), `ki.js` (KI-Auswertung der Einbausituation), `zahlung.js` (Kauf des Aufmaßblatts, Nachweis, Webhook), `konten.js` (Betriebe, Projekte, Eingang, Tarif, Sammelrechnung), `stripe.js`, `auth.js` (E-Mail-Code über Supabase Auth), `speicher.js` (Supabase oder Attrappe), `umgebung.js` (alle Variablen) |
| `supabase/schema.sql` | die drei Tabellen, einmal im Supabase-Projekt ausführen |
| `scripts/` | lokaler Testserver (mit Attrappen für Datenbank und Kasse), Browser-Prüfung in 10 Abschnitten, Umbenennen |
| `docs/ONLINE-STELLEN.md` | Schritt-für-Schritt-Anleitung |
| `docs/ABRECHNUNG.md` | Preise und Abrechnungsregeln: was gezählt wird, wo die Paywalls sitzen, Nachbesserung, Schranken, was der Server erzwingt |
| `docs/KI.md` | Die KI-Auswertung: was sie aus den Fotos liest (Einbausituation, nicht das alte Fenster), in welcher Reihenfolge, warum (mit Quellen), Modell und Kosten |
| `docs/SEO.md` | Auffindbarkeit in Suchmaschinen und KI-Assistenten: Recherche mit Quellen, Suchbegriffe für Deutschland, was umgesetzt ist, Freigabe, was danach zu tun ist |
| `docs/GESTALTUNG.md` | Gestaltungsregeln: Tokens, Schriftrollen, Bedienelemente mit Zuständen, Bewegungskatalog, Rückmeldungen, Aufmaßblatt mit Belegen, Führung und Tour mit Fakten und Quellen, Entscheidungen, Nachweis |

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

Das Skript tauscht den Namen in derselben Schreibweise aus. Von Hand bleiben: die Wortmarke (`Marke.wort()` in `web/assets/gemeinsam.js`, `wortmarke()` in `web/assets/blatt.js`), Wortspiele und Versalzeilen (siehe Abschnitt Marke in [docs/GESTALTUNG.md](docs/GESTALTUNG.md)) und die Domain.

## Lizenzen

Schrift Maven Pro: SIL Open Font License 1.1 (`web/fonts/OFL.txt`). jsPDF 2.5.1: MIT (`web/vendor/jspdf.LICENSE.txt`). qrcode-generator 2.0.4: MIT (`web/vendor/qrcode.LICENSE.txt`). lottie-web 5.12.2 (light): MIT (`web/vendor/lottie.LICENSE.txt`).

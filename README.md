# eeziframes

Fensterplanung, easy gemacht: die Aufmaß-App für Fenster. Der Name wird immer kleingeschrieben (Regeln zur Marke und zum Wortspiel mit „eezi“: [docs/GESTALTUNG.md](docs/GESTALTUNG.md)). Hauseigentümer messen ihre Fenster selbst, Schritt für Schritt erklärt, mit Fotos, 3-D-Modell und allen Wünschen – Fenster mit Ober- und Unterlicht, Balkon- und Terrassentüren, Festverglasungen, Hebe-Schiebe-, PSK-Türen und Faltschiebewände, Rollladen, Raffstore und Screen, Rollo, Plissee und Jalousie; was sie noch nicht wissen, lassen sie offen („Weiß ich noch nicht“), schon gespeicherte Gestaltungen übernehmen sie mit einem Tippen; Absturzsicherung, Einbruchschutz, Lüftungskonzept und Förderweg fragt die App dort, wo sie entstehen, und die KI liest aus den Fotos, wofür eigentlich der Fensterbauer zuständig ist (Kasten, Anschlag, Fassade, Fensterbänke, Strom, Erreichbarkeit); der Fensterbauer bekommt eine Liste, was er mit dem Kunden klären muss; wo noch kein Fenster ist, zeichnen sie die neue Öffnung auf dem Foto ein; gemessen wird ohne Konto, gesichert und gekauft mit E-Mail und Code (kein Passwort); das fertige Aufmaßblatt als PDF kostet einmal 7,99 €. Fensterbauer laden Kunden per Aufmaß-Link ein und bekommen ein vollständiges Aufmaß fürs Angebot, ohne Anfahrt: 3 Projekte frei, dann 9 € je Projekt, Abo 10 für 49 € oder Plus für 79 € im Monat.

**Stand: Pilotphase, Stufe 2 vorbereitet.** Ohne Schlüssel läuft die Website im Browser: Kundenlinks, Messen, PDF und Code-Übergabe an den Betrieb funktionieren, der Kauf ist ein gekennzeichneter Testkauf, Konten von Betrieben liegen im Browser. Zum Kennenlernen ohne Konto gibt es die Führung in der App (`/app/#fuehrung`) und die Tour für Fensterbauer. Sobald Supabase und Stripe eingetragen sind (`functions/api/`, `supabase/schema.sql`), gibt es echte Konten, direkte Übertragung, Zahlungen und Abrechnung; für Stripe genügen Geheimschlüssel und Webhook-Geheimnis, Preise und Steuersätze legt der Server selbst an. Anleitung: [docs/ONLINE-STELLEN.md](docs/ONLINE-STELLEN.md), Regeln: [docs/ABRECHNUNG.md](docs/ABRECHNUNG.md). Für dich als Inhaber gibt es die Zentrale unter `/zentrale/` (Betriebe, Sperren, Löschen, Export, Statistik ohne Cookies, Protokoll): [docs/ZENTRALE.md](docs/ZENTRALE.md). Für Suchmaschinen und KI-Assistenten ist alles vorbereitet (Ratgeber, Textfassung, strukturierte Daten, Sitemap, `llms.txt`), aber noch gesperrt, bis Impressum und Datenschutz fertig sind: [docs/SEO.md](docs/SEO.md).

## Aufbau

| Pfad | Inhalt |
|---|---|
| `web/` | die Website, so wie sie ausgeliefert wird (statische Dateien, kein Build-Schritt) |
| `wrangler.jsonc`, `worker.js` | Cloudflare Workers: liefert `web/` aus, beantwortet `/api/…` und startet den Abrechnungslauf (Cron); `"name"` muss zum Worker im Dashboard passen |
| `web/index.html` | Startseite in zwei Ansichten (Hauseigentümer und Fensterbauer, Umschalter oben, Anker `/#hauseigentuemer` und `/#fensterbauer`) und Bereich für Fensterbauer (Projekte, Aufmaß-Links, Einladungslisten, Abrechnung) |
| `web/app/` | Mess-App für Kunden, Kundenlinks: `/app/#k-…` |
| `web/ratgeber/`, `web/fuer-fensterbauer/`, `web/bilder/` | Ratgeber rund ums Fenster-Aufmaß (Fenster ausmessen, Balkontür, Fenster mit Rollladenkasten, Bestellmaß, DIN links oder rechts, Brüstungshöhe, Aufmaßblatt, Fenster austauschen) mit Zeichnungen und die Seite für Fensterbauer, reines HTML für Menschen, Suchmaschinen und KI-Assistenten (`ratgeber.css`; bewusst ohne Vorlagen, Formulare oder Rechner: das Aufmaß entsteht in der App); Startseite und App tragen dieselbe Art Textfassung für Leser ohne JavaScript |
| `web/assets/` | Programmcode und Gestaltung (`app.*`, `portal.*`, gemeinsam `gemeinsam.*` mit Logo und KI-Anbindung, Rechtsseiten `recht.css`) |
| `web/assets/blatt.js`, `blatt-schrift.js` | das Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben (für den Kunden, für den Fensterbauer, im Betriebsbereich in dessen Farben), Maven Pro eingebettet (OFL), wird erst beim Erzeugen geladen |
| `web/assets/modell.js` | Abrechnungsregeln und Aufmaß-Modell, im Browser und auf dem Server derselbe Code |
| `web/config.js` | Einstellungen ohne Geheimnisse (Name, Pilotmodus, KI-Adresse, Preise für den Pilot) |
| `web/impressum/`, `web/datenschutz/`, `web/agb/`, `web/nutzungsbedingungen/`, `web/cookies/`, `web/widerruf/` | Rechtstexte mit den Angaben des Anbieters (Entwürfe, E-Mail und Telefon folgen): Impressum, Datenschutz, AGB für Hauseigentümer mit Widerrufsbelehrung, Nutzungsbedingungen für Fensterbauer mit Vertrag über die Auftragsverarbeitung, Cookies, „Vertrag widerrufen“ (§ 356a BGB, `widerruf.js`); jede Fußzeile hat den Knopf „Vertrag widerrufen“ |
| `web/zentrale/` | Zentrale des Inhabers: Betriebe mit Kennzahlen, Sperren, Löschen, Export, Käufe, eigene Statistik, Protokoll ([docs/ZENTRALE.md](docs/ZENTRALE.md)); nur mit `ZENTRALE_PASSWORT`, nie in Suchmaschinen |
| `web/_headers` | Sicherheits-Kopfzeilen, in der Pilotphase `noindex` |
| `functions/seo.js` | Auffindbarkeit: `robots.txt` (mit Content-Signal), `sitemap.xml` (Stand je Seite), `llms.txt`, IndexNow nach Veröffentlichungen und die Kopfzeilen der Seiten (Canonical, Sicherheit, `noindex` nur in der Pilotphase); Freigabe über die Variable `INDEXIERUNG` |
| `web/favicon.svg`, `web/apple-touch-icon.png` | Logo: Licht fällt durch ein Fenster in einen dunklen Raum; eine Quelle für alle Stellen (`scripts/logo-setzen.py`), Bilder daraus mit `scripts/marke-bilder.mjs` |
| `web/fonts/`, `web/vendor/` | Maven Pro (OFL), jsPDF (MIT), qrcode-generator (MIT) und lottie-web light (MIT), lokal statt von fremden Servern |
| `web/assets/lottie/`, `scripts/lottie-erzeugen.py` | fünf gezeichnete Bewegtbilder, aus Code erzeugt (`python3 scripts/lottie-erzeugen.py web/assets/lottie`) |
| `functions/api/` | der Server: `router.js` (Verteiler), `ki.js` (KI-Auswertung der Einbausituation), `zahlung.js` (Kauf des Aufmaßblatts, Nachweis, Webhook), `konten.js` (Betriebe, Projekte, Eingang, Tarif, Sammelrechnung), `stripe.js`, `auth.js` (Anmeldung per E-Mail mit Link oder Code über Supabase Auth), `speicher.js` (Supabase oder Attrappe), `umgebung.js` (alle Variablen), `zentrale.js` (Zentrale des Inhabers), `statistik.js` (eigene Statistik ohne Cookies, nur Tagessummen), `entwurf.js` (Zwischenstand eines Kundenlinks: jederzeit über den Link weitermachen, Zähler gegen Mehrfachnutzung), `eigene.js` (Konto für Hauseigentümer ohne Link: Aufmaß sichern mit E-Mail und Code, auf jedem Gerät, Kauf nur mit Konto), `post.js` (E-Mails über Resend, ohne Öffnungs- und Klickmessung), `bestaetigung.js` (Vertragsbestätigung nach dem Kauf mit Zustimmung im Wortlaut und AGB samt Widerrufsbelehrung; der tägliche Lauf holt nicht zugestellte nach), `widerruf.js` (Widerrufsfunktion mit Eingangsbestätigung, auch ohne JavaScript; nachgeholt bei Störung des Mailversands), `recht.js` (Stand von AGB und Nutzungsbedingungen, Wortlaut der Zustimmung an der Kasse, was vor dem Verkauf mit echtem Geld fehlt), `anbieter.js` (Name, Anschrift, Telefon für E-Mails) |
| `supabase/schema.sql` | die Tabellen (Betriebe, Käufe, Stripe-Ereignisse, Protokoll, Statistik), im Supabase-Projekt ausführen; erneut ausführen schadet nicht |
| `supabase/vorlagen/` | die Anmelde-E-Mails im Stil der Seite: `anmeldecode.html` für „Magic Link“, `registrierung.html` für „Confirm signup“ (Supabase → Authentication → Emails → Templates), nur mit Code, ohne Bilder und ohne nachgeladene Inhalte |
| `scripts/` | lokaler Testserver (mit Attrappen für Datenbank und Kasse), Browser-Prüfung in 17 Abschnitten (Abschnitt 11 gegen ein nachgestelltes Stripe, `stripe-attrappe.mjs`, Abschnitt 13 die Zentrale, Abschnitt 14 Fortsetzen, Paywall, Grenzen und Zwischenstand, Abschnitt 15 das Konto für Hauseigentümer, Abschnitt 16 das Erstaufmaß: offen lassen, Pflichtthemen, Förderweg, Balkon- und PSK-Tür, KI-Fachangaben, Gestaltung übernehmen, Klärungsliste, Abschnitt 17 Rechtstexte, „Vertrag widerrufen“ auch ohne JavaScript, Nachholen bei Störung, Rechtslinks in der App, Registrierung als Unternehmer), Umbenennen |
| `docs/ONLINE-STELLEN.md` | Schritt-für-Schritt-Anleitung |
| `docs/ABRECHNUNG.md` | Preise und Abrechnungsregeln: was gezählt wird, wo die Paywalls sitzen, Nachbesserung, Schranken, was der Server erzwingt |
| `docs/KI.md` | Die KI-Auswertung: was sie aus den Fotos liest (Einbausituation, nicht das alte Fenster), in welcher Reihenfolge, warum (mit Quellen), Fachangaben für den Fensterbauer, Maße gegen das Foto, Modell und Kosten |
| `docs/SEO.md` | Auffindbarkeit in Suchmaschinen und KI-Assistenten: Recherche mit Quellen, Suchbegriffe für Deutschland, was umgesetzt ist, Freigabe, was danach zu tun ist |
| `docs/ZENTRALE.md` | Die Zentrale des Inhabers: einrichten (Passwort, zweiter Faktor, Tabellen), was sie kann, Sicherheit, Statistik ohne Cookies, rechtlicher Rahmen mit Quellen, was rechtlich noch zu tun ist |
| `docs/GESTALTUNG.md` | Gestaltungsregeln: Tokens, Schriftrollen, Bedienelemente mit Zuständen, Bewegungskatalog, Rückmeldungen, Erstaufmaß (offen lassen, Pflichtthemen, Gestaltung übernehmen, Klärungsliste), Aufmaßblatt mit Belegen, Führung und Tour mit Fakten und Quellen, Entscheidungen, Nachweis |

## Kurz: online stellen

Cloudflare → Workers & Pages → Repository importieren → dieses Repo, Worker-Name `fenstero`, Bereitstellungsbefehl `npx wrangler deploy`, Pfad `/`, Branch `main`. Die Domain hängt am Worker unter Einstellungen → Domains & Routen. Alles Weitere in der [Anleitung](docs/ONLINE-STELLEN.md).

## Lokal testen

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs                                       # Pilot, http://localhost:8788
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 PORT=8789 node scripts/dev-server.mjs   # Stufe 2 nachgestellt: Anmeldecode 123456, Kassen ohne Stripe
node scripts/pruefen.mjs                                                        # Browser-Prüfung (NUR=8 nur den Servermodus, NUR=11 nur die Stripe-Anbindung, NUR=13 nur die Zentrale, NUR=14 Grenzen und Zwischenstand, NUR=15 Konto für Hauseigentümer, NUR=16 Erstaufmaß, NUR=17 Rechtstexte und Widerruf)
npx wrangler dev                                                                # wie bei Cloudflare, http://localhost:8787
```

## Name ändern

```bash
python3 scripts/marke-umbenennen.py NeuerName
```

Das Skript tauscht den Namen in derselben Schreibweise aus. Von Hand bleiben: die Wortmarke (`Marke.wort()` in `web/assets/gemeinsam.js`, `wortmarke()` in `web/assets/blatt.js`), Wortspiele und Versalzeilen (siehe Abschnitt Marke in [docs/GESTALTUNG.md](docs/GESTALTUNG.md)) und die Domain.

## Zeichen und Bilder neu erzeugen

```bash
python3 scripts/logo-setzen.py                         # das Zeichen aus einer Quelle in alle Seiten, Favicon, Zentrale, Logo.svg
PW_PFAD=/opt/node-tools node scripts/marke-bilder.mjs  # Apple-Icon, Vorschaubild (og.png), Bild für die E-Mails (functions/api/marke.js)
PW_PFAD=/opt/node-tools node scripts/tour-bild.mjs     # Ausschnitt des echten Aufmaßblatts für die Tour (web/bilder/tour-aufmassblatt-*.webp)
```

Die Prüfsuite meldet, wenn der Ausschnitt in der Tour nicht mehr zum Aufmaßblatt passt (blatt.js, Schrift, jsPDF, modell.js oder die Daten der Tour geändert); dann das dritte Skript laufen lassen. Für die Punkte des Zeichens im PDF siehe `marke()` in `web/assets/blatt.js`.

## Lizenzen

Schrift Maven Pro: SIL Open Font License 1.1 (`web/fonts/OFL.txt`). jsPDF 2.5.1: MIT (`web/vendor/jspdf.LICENSE.txt`). qrcode-generator 2.0.4: MIT (`web/vendor/qrcode.LICENSE.txt`). lottie-web 5.12.2 (light): MIT (`web/vendor/lottie.LICENSE.txt`).

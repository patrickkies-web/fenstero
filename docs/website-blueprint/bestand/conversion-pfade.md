# Bestand: Conversion-Pfade, Formulare, Interaktionen, Funktionen

Phase A (Bestandsaufnahme) der Neukonzeption nach MASTER-PROMPT V4, Teil „Conversion-Pfade, Formulare, Interaktionen, Funktionen“.
Stand: 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`. Das Repository wurde nur gelesen.

**Lesart.** Fundstellen stehen als `datei:zeile` (Zeilen beim Stand dieses Zweigs) oder `datei` mit Abschnitt. „Attrappe“ heißt: im
Pilot sichtbar, aber ohne echte Wirkung (keine Abbuchung, kein Versand, keine Speicherung auf dem Server). „Reibung“ ist eine Bewertung
dieser Bestandsaufnahme, kein Befund des Inhabers. Die bestehende Gestaltung ist kein Vorbild; beschrieben wird, was die Seiten tun.
Geschäftsangaben (Preise, Fristen, Zusagen) stammen ausschließlich aus den genannten Dateien; Nutzerforschung gibt es im Repository nicht.

---

## 1. Überblick

| Nr | Pfad | Wer | Wirtschaftliche Handlung | Haupteinstieg | Zahlungsweg | Stand laut Code |
|---|---|---|---|---|---|---|
| P1 | Aufmaßblatt kaufen | Hauseigentümer ohne Link | 7,99 € brutto einmalig, bis 17.11.2026; ab 18.11.2026 12,99 € (`docs/ABRECHNUNG.md:11-15`) | Startseite (Ansicht Hauseigentümer), App, Ratgeber | Stripe Checkout, Standard Karte samt Apple/Google Pay (`docs/ABRECHNUNG.md:43`) | Pilot ohne Server: gekennzeichneter Testkauf (`web/assets/app.js:3452-3466`) |
| P2 | Kundenlink eines Betriebs | Betrieb lädt ein, Kunde misst | Betrieb zahlt je Projekt mit eingegangenem Aufmaß (Start: 3 frei, dann 9 € netto), Kunde 0 € (`docs/ABRECHNUNG.md:16-19`) | Betriebsbereich auf `/` | Stripe: Zahlungsart, Sammelrechnung alle zwei Wochen, Abos monatlich (`docs/ABRECHNUNG.md:49`) | Pilot: Übermittlung per Code in WhatsApp oder E-Mail (`web/assets/app.js:6782-6797`) |
| P3 | Konfigurator-Paket bestellen | Fensterbauer und -händler, nur Unternehmer | Einrichtung 99 / 199 / 279 € netto vorab, monatlich 29 / 39 / 64 € netto ab Livegang, Preise vorläufig (`web/assets/pakete.js:15-17, 44, 52, 60`) | `/fuer-fensterbauer/`, Startseite `/#fensterbauer` | Stripe Checkout Einrichtung (Karte, SEPA), Monatsabo ab Live (`docs/BESTELLUNG.md:36-39`) | ohne `PAKETE_OFFEN=1` nur Anfrage (`docs/BESTELLUNG.md:48-57`) |
| P3a | Frage ohne Konto | Interessent für ein Paket | keine; Anfrage an den Inhaber | Verkaufsseite `#bestellen` | – | aktiver Abschluss der Verkaufsseite, solange die Bestellung zu ist |
| P4 | Tour (Betriebe) und Führung (Hauseigentümer) | Interessenten | keine; führt zu Registrierung bzw. Messen | Fußzeile und Anmeldeblatt des Betriebsbereichs, `/#tour`; App-Start, `/app/#fuehrung` | – | Vorführung ohne Speichern |
| P5 | Einführungspreis-Band | alle | Preisanreiz bis 17.11.2026 | Startseite, App, Ratgeber, Betriebsbereich | – | endet am Stichtag von selbst (`functions/api/umgebung.js:72-74`) |
| P6 | Betriebskonten (Altbestand) | Fensterbauer | Tarife Start, Abo 10 (49 €), Plus (79 €) netto (`docs/ABRECHNUNG.md:17-19`) | Ansicht Fensterbauer: „Anmelden“, „Kostenlos starten“, `?von=pdf` | Stripe Setup und Abo (`functions/api/stripe.js:148, 183`) | Pilot: Konto im Browser, Zahlungsart als Attrappe |
| P7 | Widerruf | Verbraucher | Widerruf eines Vertrags (§ 356a BGB) | Fußzeile jeder Seite | – | funktioniert auch ohne JavaScript |
| P8 | Kontakt | alle | – | Impressum, Frageformular, Kundenkonto | – | kein allgemeines Kontaktformular |

## 2. Schalter, die die Pfade umstellen

| Schalter | Wirkung auf die Pfade | Fundstelle |
|---|---|---|
| Pilot (kein Server) / Stufe 2 (Supabase, Stripe) | Pilot: Kauf ist Testkauf, Betriebskonten im Browser, Kundenlink-Aufmaß kommt per Code; Stufe 2: echte Konten, direkte Übertragung, Zahlungen. Die App schaltet nach `/api/status` selbst um | `web/config.js:6`, `docs/ONLINE-STELLEN.md:9-20`, `README.md:5`, `web/assets/app.js:6622, 6811` |
| Datenbank fehlt | Alle Routen unter `/api/konto`, `/api/link`, `/api/kunde`, `/api/aufmass`, `/api/partner`, `/api/instanz` antworten 503 mit „Noch nicht eingerichtet: Die Datenbank fehlt (SUPABASE_URL, SUPABASE_SECRET_KEY).“, auch `POST /api/partner/frage` | `functions/api/router.js:85-86` |
| `PAKETE_OFFEN=1` | ohne: „Vorläufige Preise“, Karten führen zum Anfrageformular, „Bestellung bald möglich“, JSON-LD `PreOrder`; mit: Knöpfe auf `/partner/#bestellen/<paket>`, `InStock` | `docs/BESTELLUNG.md:48-57`, `web/assets/instanzregeln.js:116-120`, `functions/pakete-seite.js:39-43, 109-131, 190-197` |
| Live-Modus von Stripe und `paketVerkaufStand()` | Paket-Kasse mit echtem Geld bleibt zu, bis Mailversand, `MWST`, Datenbank, `SITZUNG_GEHEIMNIS`, platzhalterfreie Rechtstexte und PDFs stehen; im Test- und Attrappenmodus offen | `docs/BESTELLUNG.md:55-57`, `functions/api/recht.js:73` |
| `Pakete.VORLAEUFIG = true` | „Vorläufige Preise“ auf Verkaufsseite und im Bestellformular, auch mit `PAKETE_OFFEN=1` | `web/assets/pakete.js:16-17`, `web/assets/partner.js:179` |
| `PAKETE_DEMOS=1` | Live-Demos auf `demo-<paket>.eeziframes.com`; ohne: „Konfigurator ausprobieren“ führt in die App `/app/` | `functions/pakete-seite.js:166-172`, `docs/INSTANZEN.md:310` |
| `EINFUEHRUNG` (bis 17.11.2026) | Band, Hinweise `<span class="einf">`; danach ersetzt `nachEinfuehrung()` die Preise in den festen Seiten | `functions/api/umgebung.js:72-74`, `functions/seo.js:139-171` |
| `MWST` | „inkl. MwSt.“ bzw. „umsatzsteuerfrei nach § 19 UStG“; ohne `MWST` bleiben im Live-Modus Kassen zu | `docs/ABRECHNUNG.md:25` |

Welche Variablen im Cloudflare-Dashboard tatsächlich gesetzt sind, steht nicht im Repository (`wrangler.jsonc`: `keep_vars: true`, keine
Variablen eingetragen). Siehe offene Frage 1.

---

## 3. P1 – Kauf des Aufmaßblatts durch Hauseigentümer

**Einstiege**
- Startseite, Ansicht Hauseigentümer (Standard): Kopfknopf „Fenster ausmessen“ bzw. „Aufmaß fortsetzen“ (`/app/#ausmessen`), Startbild „Jetzt ausmessen“ und „Führung starten“, Kennzahlenleiste mit Preis (`web/assets/portal.js:449, 852-854`; Textfassung `web/index.html:46, 54, 61`).
- App-Start `/app/`: „Fenster ausmessen“, „Führung starten“, Band zum Einführungspreis (`web/assets/app.js:2768-2775`).
- Ratgeber: Kopfknopf „Fenster ausmessen“ und Handlungsknöpfe führen auf `/app/` (z. B. `web/ratgeber/fenster-ausmessen/index.html`, `rg-nav` und `rg-cta`).
- Einführungsband (P5) führt in die App.

**Schritte und Zustände**
1. Messen ist frei: Fotos, Maße, 3-D-Modell, Wünsche (`docs/ABRECHNUNG.md:43`).
2. „Fürs Angebot“ (optional): Haus, Zeit und Budget, Kontakt (`web/assets/app.js:3241-3275`).
3. Paywall „Fertig gemessen“: Vorschau des Blatts mit Kopf und Positionen, Maße als Platzhalter, Rest verschwommen; Knopf „Freischalten · 7,99 €“ (`web/assets/app.js:3354-3370`).
4. Konto, je nach Server:
   - mit Konten auf dem Server: „Dein Aufmaß sichern“ mit E-Mail und Haken AGB, dann sechs- bis zehnstelliger Code, gültig eine Stunde (`web/assets/app.js:3392-3415`, `6209`);
   - ohne Konten: „Wohin soll die Rechnung?“ nur E-Mail (`web/assets/app.js:3383-3391`).
5. Kasse „Bezahlen“: Posten, MwSt., Zahlungsarten, zwei leere Haken (`web/assets/app.js:3337, 3452-3466`).
6. Stripe Checkout, Knopf „Bezahlen“; Rückkehr mit `?bezahlt=<Sitzung>`, Prüfung `/api/zahlung/pruefen`, Freischalt-Nachweis (`functions/api/stripe.js:128`, `web/assets/app.js:3473-3510`, `docs/ABRECHNUNG.md:45`).
7. „Freigeschaltet.“, danach „Dein Aufmaß, dein Blatt.“: PDF schicken, Herunterladen, Aufmaß-Code (`web/assets/app.js:3363-3380, 3467`).

**Formularfelder**

| Schritt | Feld | Pflicht | Regel |
|---|---|---|---|
| Fürs Angebot | Name, PLZ und Ort, Telefon, E-Mail, „Am besten erreichbar“ | nein | „Alles freiwillig“ (`web/assets/app.js:3264-3270`) |
| Sichern (mit Konten) | E-Mail; Haken „Ich akzeptiere die AGB von eeziframes“ | ja | dann Code 6–10 Ziffern (`web/assets/app.js:3392-3416`) |
| Kasse Schritt 1 (ohne Konten) | E-Mail | ja | Muster `x@y.zz` (`web/assets/app.js:6210`) |
| Kasse Schritt 2 | Haken AGB mit Stand; Haken Zustimmung zum sofortigen Beginn und Verlust des Widerrufsrechts (Wortlaut `ZUSTIMMUNG`) | ja, beide | Haken sind beim Betreten leer (`web/assets/app.js:3337, 6212`) |
| Kasse Schritt 2, nur Pilot | Zahlungsart (PayPal, Kreditkarte, Apple Pay, Google Pay) | ja | Attrappe ohne Zahlung (`web/assets/app.js:3452-3466`) |

**Rechtstexte und Pflichtangaben**: AGB mit Stand (`AGB_STAND = '2026-10-18'`, `functions/api/recht.js:12`), Zustimmung im Wortlaut
(`functions/api/recht.js:19`), Links zu Widerrufsbelehrung, Muster-Formular und Datenschutz an der Kasse, Zahlungsarten vor dem Kauf
(§ 312j BGB, `web/assets/app.js:3333-3335`). Der Server nimmt nur genau diesen Stand und Wortlaut an und speichert beides; die
Vertragsbestätigung per E-Mail mit Haken und AGB samt Widerrufsbelehrung geht nach der Zahlung raus (`docs/ABRECHNUNG.md:43`,
`functions/api/zahlung.js:1-10`).

**Rückmeldungen**: Feldfehler am Haken; „Deine Zahlung ist unterwegs … Bitte nicht noch einmal bezahlen“; „Testbetrieb“ mit Testkarte bei
Stripe-Testschlüssel; Pilot „Pilotphase: Testkauf. Es wird nichts abgebucht, du bekommst das Blatt trotzdem.“ (`web/assets/app.js:3369, 3464`).

**Hürden und Reibungen**
- Bis zu fünf Stationen zwischen „Freischalten“ und Blatt (Sichern mit E-Mail, Code aus dem Postfach, Kasse, Stripe, Rückkehr); der Code verlangt einen Wechsel ins Postfach.
- Zustimmung zu den AGB zweimal: beim Sichern des Kontos und an der Kasse (`web/assets/app.js:3392-3415` und `3452-3466`).
- Der Preis wird oft genannt (Startseite, App, Paywall), die Konto-Pflicht vor dem Kauf erst in der Textfassung der App und im Kaufablauf (`web/app/index.html`, Abschnitt „Was es kostet“; Startseite `web/index.html:62` sagt „Kein Konto zum Messen“).
- Nach dem Kauf zählt jede gespeicherte Änderung, viermal je Fenster; höchstens 50 Fenster je Aufmaß (`docs/ABRECHNUNG.md:61-62, 69`). Die App nennt das vorher (`web/assets/app.js:3369`).
- SEPA und Überweisung bietet diese Kasse nicht an (`docs/ABRECHNUNG.md:43`).
- Uneinheitlicher Einstieg: Startseite springt in den ersten Schritt (`/app/#ausmessen`, `web/assets/portal.js:17`), Ratgeber führen auf die Startseite der App (`/app/`).
- Ansprache wechselt: Website „Sie“, App „du“ (so festgelegt in `docs/INSTANZEN.md:18`); eine Ratgeberkarte der Startseite duzt („woran du ein gutes Fensterangebot erkennst“, `web/assets/portal.js:786`).

**Im Pilot Attrappe**: Kauf als „Testkauf“, Zahlungsart-Chips, keine Rechnung; das Blatt entsteht trotzdem (`web/assets/app.js:6212`).

---

## 4. P2 – Kundenlink eines Betriebs (Altbestand)

**Seite des Betriebs (Betriebsbereich auf `/`)**
1. Projekt anlegen in zwei Schritten: „Für wen ist das Projekt?“ und „Ein paar Eckdaten.“, mit Vorschau der Nachricht im Telefonrahmen (`web/assets/portal.js:1040-1061`).
2. Link verschicken per WhatsApp, SMS oder E-Mail mit vorformuliertem Text in „Sie“ oder „Du“ (`web/assets/portal.js:990-997`); alternativ „Mehrere Kunden einladen“ als Liste (`web/assets/portal.js:1616`).
3. Status im Projekt: Nicht verschickt, Link gesendet, Link geöffnet, Kunde misst, Aufmaß da, Abgelaufen, Deaktiviert (`web/assets/portal.js:975-979`).
4. Eingang mit Klärungsliste, Positionen, PDF; Nachbesserung bis zwei Runden, bis 30 Tage nach Eingang, kostenlos (`docs/ABRECHNUNG.md:72-78`).
5. Abrechnung: drei Projekte frei, das vierte Aufmaß bleibt gesperrt, bis eine Zahlungsart hinterlegt ist (`docs/ABRECHNUNG.md:49`).

**Seite des Kunden (App über `/app/#k-<code>…`)**
1. Einladungsseite: Betrieb vorn, eeziframes klein als Übermittler (`web/assets/einladung.js:1-8`).
2. Messen wie P1, dann „Noch kurz zum Haus.“, „Zeit und Budget.“ mit „Nachricht an …“ (`web/assets/app.js:3241-3262`).
3. „Prüfen“: Knopf „An … senden“, gesperrt, solange kein Fenster vollständig ist (`web/assets/app.js:3287-3302`).
4. Senden: mit Server direkt `POST /api/aufmass` (`web/assets/app.js:6890`); im Pilot „Jetzt abschicken.“ mit „Per WhatsApp senden“ und „Per E-Mail senden“ (`web/assets/app.js:6782-6797`).

**Formularfelder**

| Wo | Feld | Pflicht | Regel |
|---|---|---|---|
| Neues Projekt, Schritt 1 | Name des Kunden | ja | ab 2 Zeichen (`web/assets/portal.js:1849`) |
| | Handynummer oder E-Mail | nein | |
| | Anrede Sie oder Du | Auswahl | „Die Messschritte der App duzen immer“ (`web/assets/portal.js:1048`) |
| Neues Projekt, Schritt 2 | Objektadresse, Gebäude, ungefähre Fensterzahl, Geplantes | nein | Haustür wird als „nicht in der App“ markiert (`web/assets/portal.js:985-986`) |
| Kunde, Anfrage | Gebäude, Baujahr, Fenster im Haus, Zeitraum, Budget, Förderung, Nachricht | nein | „Alles freiwillig“ |

**Rechtstexte**: Für den Betrieb gelten die Nutzungsbedingungen mit Kundenschutz § 11 und Auftragsverarbeitung (`web/assets/portal.js:867-878, 1595`).
Der Kunde zahlt nichts und bekommt keine Kopie mit Maßen von eeziframes (`docs/ABRECHNUNG.md:82`).

**Fristen**: Link öffnen innerhalb von 7, 14 oder 30 Tagen, danach 60 Tage Zeit; Verlängerung um 30 Tage (`docs/ABRECHNUNG.md:67`).

**Hürden und Reibungen**
- Im Pilot erreicht das Aufmaß den Betrieb nur, wenn der Kunde eine Nachricht mit Code abschickt; die Fotos sind dabei nicht enthalten (`web/assets/app.js:6795`).
- Der Kunde bekommt bewusst keine PDF-Kopie (Zusage an den Betrieb); die App verweist auf den Betrieb (`web/assets/app.js:3350`).
- Vierte Aufnahme gesperrt bis zur Zahlungsart: für den Betrieb der Moment mit dem größten Nutzen, aber eine Sperre im Arbeitsfluss (`docs/ABRECHNUNG.md:49`).

**Im Pilot Attrappe**: Konto und Projekte nur im Browser, Anmeldung mit Passwort lokal, Zahlungsart-Formular mit IBAN „Es wird nichts abgebucht; gespeichert wird nur eine gekürzte Angabe in diesem Browser“ (`web/assets/portal.js:1745`), Pilot-Hinweisleiste (`web/assets/gemeinsam.js:344-358`).

---

## 5. P3 – Bestellung eines Konfigurator-Pakets

### 5.1 Verkaufsseite `/fuer-fensterbauer/` (auch eingebettet in `/#fensterbauer`)

Aufbau in Reihenfolge (`web/fuer-fensterbauer/index.html`): Kopf mit „Ratgeber“, „Kundenkonto“ (`/partner/`), „Pakete ansehen“ (Z. 50);
Brotkrumen (Z. 53); Startbild mit Foto, Meldungsstapel als „Beispiel“, h1, vier Haken-Chips, „Kurz gesagt“, Knöpfe „Pakete ansehen“ und
„Konfigurator ausprobieren“ (Z. 54-64); zwei Leisten (Elemente, Kennzahlen, Z. 66-71); „Die Idee“ (Z. 73-82); „So funktioniert es“ mit
Telefonbühne (Z. 84-118); „Was in jeder Anfrage steht“ (Z. 120-146); „Warum Kunden selbst planen“ mit Quellen (Z. 147-157); Kundenschutz
(Z. 158-168); Pakete mit Karten, Vergleich und Rechtshinweis (Z. 170-189); Ablauf bis Live (Z. 191-204); Live-Demos (Z. 206-212);
„Bestellen oder anfragen“ mit Formular (Z. 214-232); Häufige Fragen (Z. 234-246); Wissen für Fensterbauer (Z. 248-257); Quellen (Z. 259-266).

**Handlungsziele auf der Seite**
- ohne `PAKETE_OFFEN`: Paketkarte „… anfragen“ springt zu `#bestellen` und wählt das Paket im Formular vor (`functions/pakete-seite.js:113-115`, `web/assets/verkauf.js:24-35`);
- mit `PAKETE_OFFEN=1`: „… bestellen“ auf `/partner/#bestellen/<paket>`, darunter „Vorher eine Frage?“ mit demselben Formular (`functions/pakete-seite.js:190-195`).
- Rechtshinweis unter den Karten: nur Unternehmer, Einrichtung vorab, Abo ab Livegang, Paketbedingungen mit AV-Vertrag, „Ihr Kunde zahlt nichts“ (`web/fuer-fensterbauer/index.html:188`).

### 5.2 Bestellformular im Kundenkonto `/partner/#bestellen/<paket>`

Eigene Oberfläche mit eigenem Kopf („eeziframes Kundenkonto“), eigenem Stil `partner.css` (`web/partner/index.html:16-27`). Schritte
(`web/assets/partner.js:161-175`):

| Schritt | Inhalt | Pflichtangaben | Fundstelle |
|---|---|---|---|
| 1 Paket | drei Paketkarten mit Monats- und Einrichtungspreis, Merkmale, vorgewählt aus der Adresse | Paket | `partner.js:186-194` |
| 2 E-Mail | „E-Mail bestätigen.“: Adresse, dann Code (6–10 Ziffern, gilt eine Stunde); entfällt, wenn angemeldet | E-Mail, Code | `partner.js:121-150, 619` |
| 3 Unternehmen | Unternehmen, Ansprechpartner, Erreichbarkeit, Angaben für das Impressum | Name, Rechtsform, Bundesland, Straße und Nr., PLZ (5 Ziffern), Ort, Ansprechpartner, Telefon (≥ 6 Ziffern), Tage (Mo–Sa, mind. einer), Von/Bis (6–20 Uhr), Vertreten durch; frei: USt-IdNr. (DE + 9 Ziffern), Website, Funktion, Kanal, Hinweis, Registergericht, Kammer, Berufsbezeichnung | `partner.js:195-220`, `instanzregeln.js:190-223` |
| 4 Konfigurator | Name im Konfigurator, bis 3 Wunsch-Domains mit „Prüfen“ (unverbindlich), „Bitte schlagen Sie mir Namen vor“, bis 3 Empfänger der Anfragen, bei Signature bis 5 Dashboard-Zugänge, Link zum eigenen Impressum | Name (≥ 2), Domain oder Vorschlagswunsch, mind. eine Empfängeradresse, bei Signature mind. ein Zugang | `partner.js:221-246`, `instanzregeln.js:225-245` |
| 5 Gestaltung (nur Pakete mit eigener Gestaltung) | Logo oder Druckvorlage (≤ 1 MB), „Logo reiche ich nach“, bis 3 Farben, bis 6 Fotos, Überschrift (≤ 80), Begrüßung (≤ 400), Foto des Ansprechpartners, Notizen (≤ 1500) | keine | `partner.js:259-273`, `instanzregeln.js:246-257` |
| 6 Prüfen und bestellen | Zusammenfassung mit „Ändern“, „Heute einmalig“ netto und brutto, monatlich ab Livegang, drei Haken | Unternehmer (§ 14 BGB), Paketbedingungen in der Fassung `PAKET_STAND`, AV-Vertrag | `partner.js:274-295`, `instanzregeln.js:258-265` |

Hauptknopf in Schritt 6: „Kostenpflichtig bestellen“ oder, wenn die Kasse zu ist, „Unverbindlich anfragen“ (`web/assets/partner.js:296-300`).

**Speichern unterwegs**: Formular je Bestellung im Browser (`eezi.partner.formular.<id>`), Unternehmen und Bestellentwurf auf dem Server ab
Schritt 3 bzw. 4 (`web/assets/partner.js:72-73, 333-370`). Unbezahlte Entwürfe: Erinnerung nach 3 Tagen, Löschung nach 30 Tagen ohne
Änderung; höchstens drei offene Bestellungen (`docs/BESTELLUNG.md:32`, `functions/api/partner.js:309-310`).

### 5.3 Zahlung

- „Kostenpflichtig bestellen“: Server prüft Fassung und Vollständigkeit, schickt sofort die Eingangsbestätigung mit beiden PDFs und öffnet Stripe Checkout (`functions/api/partner.js:386-412`, `docs/BESTELLUNG.md:23`).
- Stripe: Karte oder SEPA-Lastschrift, Zahlungsmittel wird für das Abo gespeichert, Rechnung von Stripe, Hinweis auf die Paketbedingungen am Zahlknopf (`functions/api/stripe.js:378-396`).
- Rückkehr: `/partner/?kasse=<Sitzung>#bestellung/<id>` → Dankeseite „bezahlt“, „Lastschrift unterwegs“ (2–5 Werktage) oder Fehler; Abbruch: `/partner/#bestellung/<id>` (`functions/api/stripe.js:379`, `web/assets/partner.js:571-580, 779-787`).

### 5.4 Einrichtung bis Live (Kundenkonto `#bestellung/<id>`)

Statusleiste mit denselben sechs Schritten wie die Verkaufsseite: Bestellt, Bezahlt, In Einrichtung, Domain gesichert, Zur Freigabe, Live
(`web/assets/instanzregeln.js:74-77`, `functions/pakete-seite.js:143-164`). Hauptaktion je Status (`web/assets/partner.js:453-470`):

| Status | Text und Knopf | Wer schaltet weiter |
|---|---|---|
| offen | „Bestellung fortsetzen“, „Jetzt bezahlen“ oder „Erneut bezahlen“ | Stripe |
| bezahlt | „Wir melden uns innerhalb eines Werktags zu Ihrer Wunschzeit.“, „Rückruf anfordern“ | Inhaber |
| einrichtung, domain | „Wünsche ergänzen“ (bei eigener Gestaltung) oder „Rückruf anfordern“ | Inhaber |
| freigabe | „Vorschau ansehen“, „Freigeben“, „Änderung wünschen“ | Partner und Inhaber |
| live | „Konfigurator öffnen“, bei Signature „Zum Dashboard“; bei offener Zahlung „Offene Rechnung bezahlen“ | Inhaber |
| pausiert, beendet, storniert | Hinweis, ggf. „Offene Rechnung bezahlen“ | System, Inhaber |

Daneben: Nachrichten, Rückruf, Rechnungen mit Stripe-Kundenportal (frische Anmeldung), Unternehmen, Paketwechsel anfragen, Empfänger
ändern, Schnipsel „Fenster planen“ für die eigene Website nach Live, Storno (offen: verwerfen; bezahlt: Storno mit voller Erstattung)
(`web/assets/partner.js:497-552`, `functions/api/partner.js:432-450`). Dauer bis Live: „meist 3 bis 5 Werktage nach der Zahlung“
(`web/fuer-fensterbauer/index.html:193`).

**Hürden und Reibungen**
- **Zwei Geschäftsmodelle in einer Ansicht.** In `/#fensterbauer` verkauft die eingebettete Seite die Pakete, die Kopfzeile bietet aber „Preise“ (Tarife Start, Abo 10, Plus des Altbestands) und als Cream-Pille „Kostenlos starten“ (Registrierung eines Betriebskontos) an (`web/assets/portal.js:450`); „Preise“ zeigt zusätzlich das Band „Einführungspreise … Abo 10 … Plus“ (`web/assets/portal.js:444-445`, `web/assets/gemeinsam.js:330-341`).
- **Namensgleichheit „Plus“:** Tarif „Plus“ (79 € im Monat, Betriebskonto) und Paket „EEZI Essential Plus“ (39 € im Monat) stehen in derselben Ansicht (`docs/ABRECHNUNG.md:19`, `web/assets/pakete.js:52`).
- **Drei Anmeldungen für Fensterbauer:** Kundenkonto `/partner/` (Pakete, Cookie), „Anmelden“ im Betriebsbereich auf `/` (Altbestand) und `/betrieb/` auf der eigenen Domain (Signature); eine Dashboard-Adresse auf der Hauptdomain bekommt nur einen Verweis „Zu Ihrem Dashboard“ (`docs/INSTANZEN.md:184-202`, `web/assets/portal.js:1596-1606`).
- **Medienbrüche:** Verkaufsseite → eigene Oberfläche des Kundenkontos → Postfach (Code) → Formular → Stripe → zurück.
- **Langes Formular vor der Zahlung:** bis zu sechs Schritte, im Schritt „Unternehmen“ elf Pflichtangaben samt Impressumsangaben (`web/assets/instanzregeln.js:200-223`).
- **Paket doppelt wählen:** auf der Verkaufsseite gewählt, in Schritt 1 erneut gezeigt (vorgewählt) (`web/assets/partner.js:612-616`).
- **Spät erkannt, dass nicht bestellt werden kann:** Ist die Kasse zu, erfährt man es erst in Schritt 6; als offen geführt (Befund 11, `docs/INSTANZEN.md:385`). Der Weg dorthin besteht auch ohne `PAKETE_OFFEN` über „Noch kein Paket? Paket wählen und bestellen“ im Kundenkonto (`web/assets/partner.js:132`).
- **Statusleiste zeigt „Bestellt“ für einen unbezahlten Entwurf:** Status `offen` ist der erste Schritt „Bestellt“, der Text darunter sagt „Ihre Bestellung ist noch nicht abgeschlossen.“ (`web/assets/partner.js:439-451`, `web/assets/instanzregeln.js:74-78`).
- **„Konfigurator ausprobieren“ führt ohne Demos in die App für Hauseigentümer** mit Preis und Paywall; der Text daneben sagt, unter der eigenen Domain zeige der Konfigurator keine Preise (`functions/pakete-seite.js:171`).
- **Ohne Datenbank** zeigt `/partner/` „Gerade nicht erreichbar.“ mit der technischen Meldung des Servers (`web/assets/partner.js:776-777`, `functions/api/router.js:86`).
- **Kennzahl „0 Zeilen Code auf Ihrer Website“** (`web/fuer-fensterbauer/index.html:70`) neben dem HTML-Schnipsel, den der Partner zum Livegang in seine Website einbaut (`docs/BESTELLUNG.md:28`).
- **SEPA verzögert den Start** um 2–5 Werktage (`web/assets/partner.js:294`).

**Im Pilot Attrappe oder Platzhalter**
- Beispielseiten unter den Paketkarten sind Skizzen, bis Bilder vorliegen (`functions/pakete-seite.js:92-108`, `BEISPIEL_BILD` leer).
- Meldungen im Startbild sind als „Beispiel“ beschriftet und `aria-hidden` (`web/fuer-fensterbauer/index.html:55`).
- Telefonbühne „So funktioniert es“ und Blatt „Nr. 0142“ sind Illustrationen (`web/fuer-fensterbauer/index.html:96-116`).
- Live-Demos noch nicht verlinkt (`functions/pakete-seite.js:171`).
- Paketbedingungen sind „Entwurf zur anwaltlichen Prüfung“ mit Platzhaltern; die Live-Kasse bleibt zu (`docs/BESTELLUNG.md:63`, `web/konfigurator-bedingungen/index.html`, `mark.ph`).
- Preise vorläufig (`web/assets/pakete.js:17`).

### 5.5 P3a – Frage ohne Konto (Formular auf der Verkaufsseite)

| Feld | Pflicht | Regel |
|---|---|---|
| Ihr Name | ja | 2–80 Zeichen |
| Firma | nein | bis 100 |
| E-Mail | ja | gültige Adresse, nicht `.invalid` |
| Telefon | nein | bis 40 |
| Paket | Auswahl | „Noch offen“ oder eines der drei |
| Ihre Frage oder Ihr Wunsch | ja | 3–2000 Zeichen |
| Fax (Honigtopf) | unsichtbar | ausgefüllt: freundliches OK, keine Mail |

Fundstellen: `functions/pakete-seite.js:173-189`, `functions/api/partner.js:206-221`. Hinweis „Wir nutzen Ihre Angaben nur, um Ihnen zu
antworten (Datenschutz)“ mit Link `/datenschutz/#pakete`.

**Rückmeldungen**: mit JavaScript Fehler am Feld mit Fokus, „Wird gesendet …“, Dank ersetzt das Formular („Danke, Ihre Frage ist da. Wir
melden uns in der Regel innerhalb eines Werktags“); ohne JavaScript eine eigene Seite mit Dank oder Fehlern und „Zurück zu den Paketen“
(`web/assets/verkauf.js:19-90`, `functions/api/partner.js:223-228, 575-583`). Bremse 5 je Minute und Anschluss, nur auf eeziframes.com.
Ziel: Mail an den Inhaber, bei bestehendem Kundenkonto zusätzlich ein Systemeintrag dort (`docs/BESTELLUNG.md:59`, `docs/INSTANZEN.md:381`).

**Reibung**: Ohne Datenbank antwortet die Route mit 503 und der Meldung „Noch nicht eingerichtet: Die Datenbank fehlt …“; mit JavaScript
erscheint dieser Text unter dem Formular, ohne JavaScript kommt die JSON-Antwort statt der Formularseite, weil die Prüfung im Verteiler vor
der Route greift (`functions/api/router.js:85-86`, `web/assets/verkauf.js:85`). Ob das im Netz zutrifft, hängt von offener Frage 1 ab.

---

## 6. P4 – Tour für Fensterbauer und Führung für Hauseigentümer

**Tour für Fensterbauer** (Betriebsbereich, `web/assets/portal.js:1436-1592`)
- Einstieg: `/#tour`, Fußzeile „Tour für Fensterbauer“, Anmeldeblatt „Erst einmal ansehen?“, „So funktioniert es“ (`portal.js:482, 890, 1605, 1614, 1962-1966`). Keine statische Seite verlinkt `/#tour` (Suche über `web/**/*.html`).
- Acht Schritte: Projekt anlegen, Link schicken, Kunde misst, Aufmaß kommt an, Bestellmaß und PDF, Nachbesserung, Aufmaß per Code, Preise und Start (`portal.js:1442-1443`); Beispielbetrieb „Fensterbau Brandt“, vorgegebene Felder mit Schloss, je Schritt ein Fakt mit Quelle (`portal.js:1444-1459`); Beispiel-PDF zum Herunterladen (`portal.js:1518-1528`).
- Ende: „Kostenlos starten“ (Registrierung Betriebskonto) bzw. „Zu meinen Projekten“ (`portal.js:1585`).
- **Reibung**: Die Tour zeigt das Altbestand-Modell (Aufmaß-Links, Tarife Start, Abo 10, Plus), nicht die Pakete. Für Plus nennt sie „Team mit Rollen und Statistik“ (`portal.js:1579`); `docs/ABRECHNUNG.md:103` führt ein Teamkonto als „bewusst noch nicht gebaut“.

**Führung für Hauseigentümer** (App, `web/assets/app.js:6302-6539`)
- Einstieg: „Führung starten“ auf Startseite und App, `/app/#fuehrung`, Ratgeber „Führung in zwei Minuten“.
- Neun Schritte: Element, Fotos, Messen, Öffnung, Material, Farbe, Glas, Sonnenschutz, Aufmaßblatt; arbeitet an einer Kopie, speichert nichts (`app.js:6302-6310`).
- Ende: „Eigenes Fenster ausmessen“ (`app.js:6539`).

**Im Pilot Attrappe**: beides ist Vorführung; nichts wird gespeichert oder gesendet.

---

## 7. P5 – Einführungspreis-Band

- Inhalt Hauseigentümer: „Einführungspreis bis 17. November: Aufmaßblatt 7,99 € · danach 12,99 €“, Restzeit „Noch n Tage“ bzw. „Nur noch heute“, „Jetzt ausmessen →“; Betrieb: „Einführungspreise bis 17. November: Abo 10 für 49 €, Plus für 79 € im Monat · danach 69 € und 119 €“, „Preise ansehen →“ (`web/assets/gemeinsam.js:326-342`).
- Wo: Startseite, Ansicht Hauseigentümer, mit Link in die App; App-Start; Betriebsbereich für Besucher und für Konten im Tarif Start, nicht in der Tour und nicht über der eingebetteten Verkaufsseite (`web/assets/portal.js:442-445`, `web/assets/app.js:2772`); Ratgeber vom Server eingesetzt, mit Link `/app/` (`functions/seo.js:160-171`). Auf `/fuer-fensterbauer/*` setzt der Server kein Band ein (`functions/seo.js:163-166`).
- Ende: am 17.11.2026, 23:00 UTC; danach ersetzt der Server Preise in festen Seiten und JSON-LD und entfernt die Hinweise, ETag entfällt dafür (`functions/api/umgebung.js:72-74`, `functions/seo.js:122-155`). Kein „statt“-Preis (§ 5 UWG, `docs/ABRECHNUNG.md:11`).
- **Widerspruch**: `docs/ABRECHNUNG.md:11` nennt das Band auch auf den Fensterbauerseiten; der Code setzt es dort nicht.
- **Reibung**: Die Betriebsfassung bewirbt die Altbestand-Tarife in der Fensterbauer-Ansicht, sobald man „Preise“ öffnet.

---

## 8. P6 – Betriebskonten (Altbestand)

**Einstiege**: Ansicht Fensterbauer, Kopfzeile „Anmelden“ und „Kostenlos starten“ (`web/assets/portal.js:450`); Hinweis bei `?von=pdf` „Sie
halten ein eeziframes-Aufmaß in der Hand? … kostenlos registrieren … Die ersten 3 Aufmaße sind frei“ (`portal.js:849, 964-971`); QR-Code und
Werbung im Aufmaßblatt der Hauseigentümer „3 Projekte kostenlos · danach 9 € netto …“ (`web/assets/blatt.js:184, 226-227, 664, 695`);
Teilen-Text der App „Noch kein Zugang? Kostenlos anmelden, die ersten 3 Projekte sind frei“ (`web/assets/app.js:3372`); Ende der Tour.

**Registrierung**
- Mit Server: „Kostenlos starten“ öffnet das Anmeldeblatt „Konto für Ihren Betrieb.“ (E-Mail, Code), dann zwei Schritte (`portal.js:1596-1606, 1789-1791, 931-943`).
- Ohne Server (Pilot): dieselben zwei Schritte mit E-Mail und Passwort im ersten Schritt, Konto nur im Browser (`portal.js:944-963`).

| Schritt | Feld | Pflicht | Regel |
|---|---|---|---|
| 1 Ihr Betrieb | Firma, Ansprechpartner, Telefon | ja | ≥ 2 Zeichen, ≥ 6 Ziffern (`portal.js:911-924`) |
| | E-Mail, Passwort | nur Pilot | Passwort ≥ 8 Zeichen |
| 2 Ihre Einladung | Postleitzahl | ja | 5 Ziffern |
| | Farbe des Zeichens | Auswahl | Vorschau der Einladungsseite |
| | Haken: Unternehmer, Nutzungsbedingungen (Stand) samt AV-Vertrag | ja | Server nimmt nur `NB_STAND` an (`functions/api/konten.js:167-186`) |

**Tarif und Zahlung**: „Preise“ mit Start (0 € Grundgebühr), Abo 10 (empfohlen, Cream), Plus und ROI-Rechner (`portal.js:897-910`); Wechsel
nach oben über Stripe-Abo, Zahlungsart über Stripe Setup (SEPA, Karte); Rückkehr `?zahlungsart=` bzw. `?abo=` (`portal.js:195-205, 243-244`,
`functions/api/stripe.js:148, 183`). „Code vom Kunden einfügen“ übernimmt ein Kunden-Aufmaß als Projekt (`portal.js:1615, 242`).

**Hürden und Reibungen**
- Neue Registrierungen sind weiter möglich, obwohl die Ansicht Fensterbauer seit Bauplan E28 die Pakete verkauft (`docs/GESTALTUNG.md`, Abschnitt „Ansicht“, Punkt „Fensterbauer“; `web/assets/portal.js:845-849`).
- Leistungsbeschreibung uneinheitlich: Preise-Karte „Start“ nennt „Ihre Einladungsseite mit Logo“ (`portal.js:903`), `docs/ABRECHNUNG.md:19` nennt „Logo und Farbe beim Kunden“ bei Plus.
- Fallback-Stand der Nutzungsbedingungen im Browser ist `2026-10-17` (`portal.js:1593`), der Server führt `2026-10-18` (`functions/api/recht.js:18`); sichtbar nur ohne Server.

**Im Pilot Attrappe**: Konto, Projekte, Zahlungsart und Tarifwechsel im Browser; Fußzeile „Pilotphase: Es wird nichts berechnet“ (`portal.js:482`).

---

## 9. P7 – Widerruf

- Einstieg: „Vertrag widerrufen“ in jeder Fußzeile (Startseite, App, Ratgeber, Verkaufsseite, Rechtsseiten, Betriebsbereich) (`web/index.html:97`, `web/assets/portal.js:477-483`).
- Seite `/widerruf/`: drei Felder, alle Pflicht: Ihr Name (≤ 120), Welchen Vertrag widerrufen Sie? (≤ 600, Beispiel mit Rechnungsnummer), E-Mail für die Bestätigung (≤ 160); Knopf „Widerruf bestätigen“ (`web/widerruf/index.html`).
- Rückmeldung: mit JavaScript Bestätigung auf der Seite mit Eingangszeit und Wortlaut, Hinweis, ob die Mail raus ist; ohne JavaScript eine Bestätigungsseite vom Server; Eingangsbestätigung per E-Mail, bei Störung nachgeholt; Kopie an den Betreiber; Protokoll in der Zentrale (`web/assets/widerruf.js`, `functions/api/widerruf.js:1-9`).
- Andere Wege: E-Mail und Brief mit Anschrift, Muster-Formular; Hinweis, dass Unternehmer kein gesetzliches Widerrufsrecht haben.
- **Reibung**: Kopf der Rechtsseiten verlinkt „Für Betriebe“ auf `/`, das ohne gespeicherte Wahl die Ansicht Hauseigentümer öffnet (`web/widerruf/index.html:18`, `web/agb/index.html:17`); eigene Gestaltung über `recht.css`.

---

## 10. P8 – Kontakt

| Weg | Wo | Bedingung | Fundstelle |
|---|---|---|---|
| E-Mail `ask@eeziframes.com`, Telefon | Impressum; JSON-LD der Startseite | – | `web/impressum/index.html:31-33`, `web/index.html:31` |
| Frageformular | Verkaufsseite | Datenbank nötig (s. 5.5) | `functions/pakete-seite.js:173-197` |
| Nachrichten (20 je Stunde, je ≤ 2000 Zeichen) | Kundenkonto `/partner/` | Anmeldung | `functions/api/partner.js:29` |
| Rückruf: Tag (Werktag in den nächsten 10), Zeitfenster 08–10 … 16–18, Telefon, Thema, „Worum geht es?“; einer offen | Kundenkonto | Anmeldung | `functions/api/partner.js:156-157, 538-552`, `web/assets/partner.js:503-517` |
| Antwort auf E-Mails (Vertragsbestätigung, Widerruf) | Postfach | – | `functions/api/anbieter.js:3, 11` |

**Reibungen**: Für Hauseigentümer gibt es kein Kontaktformular, nur Impressum. Die Verkaufsseite verspricht „gern auch am Telefon“, nennt
aber keine Telefonnummer (`functions/pakete-seite.js:194`). Rückruf bietet auch vergangene Zeitfenster und Feiertage an (Befund 15, offen,
`docs/INSTANZEN.md:385`).

---

## 11. Interaktionen ohne eigenen Abschluss, die die Pfade tragen

| Interaktion | Zweck | Fundstelle |
|---|---|---|
| Umschalter „Hauseigentümer · Fensterbauer“ in der Kopfzeile, Anker `#hauseigentuemer`, `#fensterbauer`, `#betriebe`, Wahl im Browser gespeichert, ohne Verlaufseintrag | trennt die Zielgruppen | `web/assets/portal.js:393-406, 1775-1781, 1962-1978`; `docs/GESTALTUNG.md`, Abschnitt „Ansicht“ |
| Kopfknopf wird Ring, solange eine Hauptaktion im Bild ist | eine Cream-Pille je Bildschirm | `web/assets/portal.js:551-562` |
| Paketkarten am Telefon wischen, Leiste „Paket wählen“, „Leistungen ansehen“ | Pakete vergleichen | `functions/pakete-seite.js:123-130`, `web/assets/verkauf.js:342` (Funktion `pakete`) |
| Domain „Prüfen“ (RDAP oder DNS, unverbindlich) | Domainwunsch absichern | `functions/api/partner.js:182-205, 565-572` |
| KI-Auswertung der Fotos nur nach Einwilligung (Dialog) | Datenschutz | `web/assets/gemeinsam.js:36-75` |
| Aufmaß sichern (Konto Hauseigentümer) | Gerätewechsel, Voraussetzung für den Kauf | `web/assets/app.js:3392-3437`, `docs/ABRECHNUNG.md:47` |
| Rückfrage bei fremdem Anmeldelink | Schutz vor untergeschobenen Links | `web/assets/portal.js:224-235`, `web/assets/app.js:3438-3450` |
| Browser-Zurück im Betriebsbereich („Wache“) | Zurück schließt Blatt oder geht einen Schritt zurück | `web/assets/portal.js:346-379` |
| Toasts, `aria-live`-Statuszeilen, Fokus auf Fehler und Dank | Rückmeldung | `web/assets/portal.js:409`, `web/assets/partner.js:30-32`, `web/assets/verkauf.js:64-68` |

---

## 12. Querschnitt: Widersprüche und Reibungen über die Pfade

1. Die Fensterbauer-Ansicht der Startseite führt zwei Geschäftsmodelle nebeneinander (Pakete im Inhalt, Altbestand in Kopfzeile, Preisen, Band, Tour). Das Aufmaßblatt der Hauseigentümer wirbt ebenfalls für den Altbestand (5.4, 7, 8).
2. Drei Anmeldungen und drei Oberflächen für Fensterbauer (5.4).
3. Namensgleichheit „Plus“ (5.4).
4. Leistungsangaben zum Tarif Plus und zum Logo widersprechen sich zwischen Tour, Preise-Karte und `docs/ABRECHNUNG.md` (6, 8).
5. Band auf Fensterbauerseiten: Doku und Code weichen ab (7).
6. Browser-Fallbacks der Rechtsstände weichen vom Server ab: AGB `2026-10-16` (`web/assets/app.js:3330`) und NB `2026-10-17` (`web/assets/portal.js:1593`) gegenüber `2026-10-18` (`functions/api/recht.js:12, 18`).
7. Ohne Datenbank brechen der Abschluss der Verkaufsseite (Frage) und das Kundenkonto mit technischer Meldung ab (5.4, 5.5).
8. Uneinheitliche Einstiege in die App (`/app/#ausmessen` gegenüber `/app/`) (3).
9. Startbild der Startseite nennt „vier Maße“ (`web/assets/portal.js:852`), die Kennzahlenleiste „8 Maße je Fenster“ (`portal.js:854`); die Textfassung nennt drei Breiten und drei Höhen plus Rahmenmaß (`web/index.html:59`). Inhaltlich vereinbar (vier Hauptmaße, vier Ränder), für Besucher aber ungleich formuliert.

---

## 13. Funktionen und Bedingungen, die bei einer Neugestaltung erhalten bleiben müssen

| Nr | Funktion oder Bedingung | Begründung | Fundstelle |
|---|---|---|---|
| 1 | **Einbettung der Verkaufsseite in `/#fensterbauer`**: `portal.js` lädt `main.rg` von `/fuer-fensterbauer/` per `fetch`, entfernt die Brotkrumen, setzt den Inhalt in `section.vk-einbettung` und ruft `Verkauf.auf(behälter, { still })` nach jedem Aufbau | eine Quelle für Suchmaschinen-Seite und Startseite; Vorgabe des Inhabers „Jedes Element muss dort genauso funktionieren, auch nach einem Neuaufbau“ | `web/assets/portal.js:801-843`; `web/assets/verkauf.js:1-11`; SKILL `premium-gestaltung` §3 „Einbettung“; Prüfung `scripts/pruefen.mjs:160-207` |
| 2 | Skripte der Verkaufsseite beziehen sich nur auf ihre Wurzel, binden Zuhörer je Element einmal, lösen Beobachter beim Neuaufbau | sonst doppelte Animationen und Zuhörer in der Einbettung | `web/assets/verkauf.js:1-11, 92-110` |
| 3 | Sprungmarken (`#pakete`, `#bestellen` …) scrollen in der Einbettung, ohne den Anker `#fensterbauer` zu ändern; Abstand zur klebenden Kopfzeile wird gemessen | Hashes steuern auf der Startseite die Ansicht | `web/assets/portal.js:801-815, 831-843`; Prüfung `scripts/pruefen.mjs:175-177` |
| 4 | Rückfall der Einbettung: Karte „Pakete ansehen“ mit Link statt leerer Fläche | Störungsfall | `web/assets/portal.js:818-829`; Prüfung `scripts/pruefen.mjs:198-206` |
| 5 | Genau ein h1 je Ansicht; in der Fensterbauer-Ansicht das h1 der Verkaufsseite | Prüfung und SEO | `docs/GESTALTUNG.md`, Abschnitt „Ansicht“; `scripts/pruefen.mjs:166-172`; `scripts/pruefen-instanzen/29.mjs` (29.3) |
| 6 | Anker `#hauseigentuemer`, `#fensterbauer`, `#betriebe`, `#tour`, `#projekt-<id>`, `?von=pdf`; `/app/#ausmessen`, `/app/#fuehrung`, `/app/#k-<code>` | Verweise aus Mails, PDFs (QR-Code), Ratgebern und Kundenlinks hängen daran | `web/assets/portal.js:1962-1978`; `web/assets/app.js:6560-6612`; `web/assets/blatt.js:226-227` |
| 7 | **Textfassung ohne JavaScript** (`.vorab` in `#app`) auf Startseite und App mit h1, Erklärung, Preisen, Fragen, Links; `noscript`-Hinweis | KI-Crawler führen kein JavaScript aus; Prüfung ohne JavaScript am Telefon | `web/index.html:43-99`; `web/app/index.html`; `docs/SEO.md:16, 101`; Prüfung `scripts/pruefen.mjs:1598-1600` |
| 8 | Verkaufsseite vollständig als statisches HTML: Bausteine `<!--pakete:…-->` mit lesbarer Rückfallfassung, vom Worker je Umgebung ersetzt; Preise auch ohne Worker und JavaScript sichtbar | Suchmaschinen, Ausfall des Workers; Prüfung 29.1 | `functions/pakete-seite.js:6-18, 251-269`; `scripts/pruefen-instanzen/29.mjs:99-104` |
| 9 | Frageformular funktioniert ohne JavaScript (`method="post"`, Server antwortet mit Seite) und mit JavaScript (JSON, Fehler am Feld); Honigtopf `fax` unsichtbar, aber vorhanden; Bremse `RL_FORM`; nur Hauptdomain | Erreichbarkeit, Spam-Schutz; Prüfung 29.2 | `functions/api/router.js:90`; `functions/api/partner.js:206-228, 575-583`; `web/assets/verkauf.js:1-11` |
| 10 | Widerrufsfunktion mit drei Feldern, ohne JavaScript nutzbar, „Vertrag widerrufen“ in jeder Fußzeile als Knopf ab 44 px | § 356a BGB | `web/widerruf/index.html`; `functions/api/widerruf.js:1-9`; Prüfung `scripts/pruefen.mjs:513-514` (Abschnitt 5) und Abschnitt 17 |
| 11 | **CSP ohne fremde Server**: `default-src 'self'`, Skripte und Schriften nur eigene Herkunft, `frame-ancestors 'none'`; Bibliotheken mit Lizenz in `web/vendor/`; `_headers` und `SICHERHEIT` gleich | Datenschutz, Vorgabe des Inhabers; Prüfsuite vergleicht beide und meldet fremde Server | `web/_headers`; `functions/seo.js:64-75`; SKILL §3 „Keine fremden Server“; `scripts/pruefen.mjs:1618, 1654-1656` |
| 12 | **„Weniger Bewegung“**: jede Bewegung mit ruhiger Fassung (`ruhig()` in `verkauf.js`, `Reveal`, `Scroll.binden`, Lottie auf Endbild) | Vorgabe des Inhabers; Barrierefreiheit | `web/assets/verkauf.js:15, 92-110`; `web/assets/gemeinsam.js:160-190, 296-323`; SKILL §3; Prüfungen nur für App und Zentrale gefunden (`scripts/pruefen.mjs:653-657, 880-884, 2455, 4328`), keine für die Verkaufsseite in `scripts/pruefen-instanzen/29.mjs` und `30.mjs` |
| 13 | **Prüfsuite-Abschnitte** für die Verkaufsseite 2, 6, 10, 29, 30; Altbestand 1–22 bleibt grün | Abnahme vor jedem Livegang | SKILL §8; `docs/INSTANZEN.md:11`; `docs/BESTELLUNG.md:73-75` |
| 14 | Schriftgrößen nur 13, 15, 17, 24, 40 (Telefon 32), Ziele ab 44 px, kein Querscrollen; auf Ratgeber und Fensterbauerseiten automatisch geprüft | Markenregel, Prüfsuite lässt nichts anderes durch | `docs/GESTALTUNG.md:29`; SKILL §4; `scripts/pruefen.mjs:1602-1620` |
| 15 | Eine Cream-Pille je Bildschirm, grünes Wort je Überschrift; Kopfknopf als Ring, solange eine Hauptaktion sichtbar ist | Markenregel, Prüfung Abschnitt 6 | `web/assets/portal.js:551-562`; `scripts/pruefen.mjs:943-984` |
| 16 | Marke „eeziframes“ klein; „EEZI“ nur in Paketnamen und „Powered by EEZIframes“ | Markenregel, Prüfung | `docs/GESTALTUNG.md:7`; `scripts/pruefen.mjs:1610-1613` |
| 17 | Eine Stelle je Wahrheit: Preise und Merkmale nur aus `pakete.js`, Status, Fristen, Feldregeln nur aus `instanzregeln.js`; kein Vergleich auf Paketnamen | Seite, Bedingungen, PDFs und Server bleiben gleich; Prüfung 23 | `docs/INSTANZEN.md:12`; `web/assets/pakete.js:1-10`; `web/assets/instanzregeln.js` |
| 18 | Statusleiste im Kundenkonto und Ablauf auf der Verkaufsseite mit denselben sechs Schritten aus `LEISTE` | gleiche Sprache vom Verkauf bis Live | `web/assets/instanzregeln.js:72-77`; `functions/pakete-seite.js:141-164`; `docs/BESTELLUNG.md:19` |
| 19 | Fassungen der Rechtstexte: Server nimmt nur `PAKET_STAND`, `AGB_STAND`, `NB_STAND` und den Wortlaut `ZUSTIMMUNG` an; Haken an Kassen sind leer beim Betreten | Nachweis der Zustimmung, Widerrufsrecht § 356 Abs. 6 BGB | `functions/api/recht.js:12-19`; `functions/api/partner.js:390-391`; `functions/api/konten.js:178`; `web/assets/app.js:3337`; `docs/ABRECHNUNG.md:43` |
| 20 | Zahlungsarten vor dem Kauf genannt, „inkl. MwSt.“ bzw. § 19 UStG, Betriebspreise „netto“ und „nur für Unternehmer“ | § 312j BGB, Preisangaben | `web/assets/app.js:3333-3335`; `functions/pakete-seite.js:44, 122`; `docs/ABRECHNUNG.md:21, 25` |
| 21 | Verkauf an- und ausschalten nur über `Instanzregeln.verkauf()`; Hinweis „Vorläufige Preise“; JSON-LD `PreOrder` bzw. `InStock` | ehrlicher Verkaufsstand, Seite und Kasse stimmen überein | `docs/BESTELLUNG.md:48-57`; `functions/pakete-seite.js:86-91, 198-213` |
| 22 | Einführungspreis: Band und Hinweise enden am Stichtag von selbst; kein „statt“-Preis | § 5 UWG; keine Handarbeit am Stichtag | `functions/seo.js:139-171`; `docs/ABRECHNUNG.md:11` |
| 23 | SEO-Grundlagen: Title ≤ 75, Description 70–170, Canonical, FAQPage gleich der sichtbaren FAQ, Sitemap, `llms.txt`; neue Seitenpfade in `run_worker_first` und `istSeite()` eintragen, sonst fehlen Kopfzeilen und Canonical | Auffindbarkeit; Prüfung 10 und 29.3 | `wrangler.jsonc` (`assets.run_worker_first`); `functions/seo.js:82, 122-137`; `web/fuer-fensterbauer/index.html:26-41` |
| 24 | Rückkehradressen von Stripe: `/partner/?kasse=…#bestellung/<id>`, `/?zahlungsart=`, `/?abo=`, App `?bezahlt=` | Zahlungen werden nur so zugeordnet | `functions/api/stripe.js:128, 148, 183, 379` |
| 25 | Kundenkonto, Zentrale, Dashboard ohne Suchmaschinen und ohne Zwischenspeicher | Datenschutz | `worker.js` (`GESCHUETZT`, `sicher`); `web/_headers` (`/partner/*`) |
| 26 | Altbestand unverändert: Betriebskonten, Kundenlinks, Abrechnung, Einladungsseite; Kundenschutz-Zusagen gleichlautend mit Nutzungsbedingungen § 11 und Paketbedingungen | Zusage auf der Verkaufsseite („Ändert sich etwas? Nein.“), Vertragsinhalt | `docs/INSTANZEN.md:3, 11`; `web/fuer-fensterbauer/index.html:244`; `web/assets/portal.js:867-878` |
| 27 | Keine Gesamtübersicht mit Maßen vor dem Kauf (verschwommene Vorschau, keine Maßlisten) | Entscheidung des Inhabers; sonst ersetzt ein Bildschirmfoto das Blatt | `docs/GESTALTUNG.md`, Abschnitt „Angefangenes Aufmaß, Paywall und Grenzen“; `docs/ABRECHNUNG.md:43` |
| 28 | KI-Auswertung nur mit Einwilligung; Fotos ohne Konto auf dem Gerät | Datenschutzzusage auf Startseite und App | `web/index.html:78`; `web/assets/gemeinsam.js:36-75` |
| 29 | Rückfrage bei fremdem Anmeldelink, frische Anmeldung (15 Min.) für Geld-Aktionen, Code statt Passwort | Sicherheit der Konten | `web/assets/portal.js:224-235`; `docs/INSTANZEN.md:232`; `functions/api/partner.js:5-8` |
| 30 | Ehrliche Kennzeichnung: Beispielmeldungen als „Beispiel“, Fakten mit Quelle, Platzhalter als Skizze statt erfundener Screenshots | Vorgabe des Inhabers „Ehrlich“ | SKILL §2; `web/fuer-fensterbauer/index.html:55, 259-266`; `web/assets/portal.js:1447-1459`; `functions/pakete-seite.js:92-108` |
| 31 | Schleifen laufen nur im Bild (IntersectionObserver), Ersatzfassung ohne Grafikchip | flüssig auf mittlerem Android-Telefon | SKILL §3; `web/assets/verkauf.js:158, 304` (Funktionen `startbild`, `leisten`); `scripts/pruefen.mjs:4321` |
| 32 | Fokusführung und Statusmeldungen in Formularen (`aria-invalid`, `aria-describedby`, `role="status"`, Fokus auf Dank) | Barrierefreiheit, Prüfung 29.2 | `web/assets/verkauf.js:42-68`; `web/assets/partner.js:30-32` |

---

## 14. Offene Fragen

1. **Produktionsstand**: Sind im Cloudflare-Dashboard Supabase, Stripe (Test oder Live), `PAKETE_OFFEN`, `PAKETE_DEMOS`, `MWST` gesetzt? `web/config.js:6` steht auf `pilot: true`, `README.md:5` nennt „Pilotphase, Stufe 2 vorbereitet“. Davon hängt ab, ob Frageformular und Kundenkonto im Netz funktionieren (ohne Datenbank 503).
2. **Altbestand für neue Betriebe**: Sollen Registrierung „Kostenlos starten“, Tarife Start, Abo 10, Plus, die Tour und die Werbung im Aufmaßblatt („3 Projekte kostenlos“, QR-Code `?von=pdf`) für neue Betriebe weiter angeboten werden? SKILL §1 sagt „Kein Thema mehr: eine Plattform, auf der Kunden bei eeziframes Projekte anlegen“; `docs/INSTANZEN.md:3` sagt, Bestandskonten laufen weiter.
3. **„Plus“ doppelt belegt**: Tarif „Plus“ (79 €) und Paket „EEZI Essential Plus“ (39 €). Bleibt das so?
4. **Tarif Plus und Logo**: „Team mit Rollen und Statistik“ (Tour) gegenüber „Teamkonto bewusst noch nicht gebaut“ (`docs/ABRECHNUNG.md:103`); Logo bei Start (Preise-Karte) gegenüber „Logo und Farbe“ bei Plus (`docs/ABRECHNUNG.md:19`). Welche Angabe gilt?
5. **Band auf Fensterbauerseiten**: Doku sagt ja (`docs/ABRECHNUNG.md:11`), Code nein (`functions/seo.js:163-166`). Welche Fassung ist gewollt?
6. **„0 Zeilen Code auf Ihrer Website“** neben dem HTML-Schnipsel zum Livegang: Ist die Kennzahl so gemeint (Konfigurator braucht keine Website) und soll sie bleiben?
7. **Rechtsstände im Browser**: Fallbacks `2026-10-16` (AGB) und `2026-10-17` (NB) gegenüber `2026-10-18` auf dem Server.
8. **Telefon auf der Verkaufsseite**: Zusage „gern auch am Telefon“ ohne Nummer; soll eine Nummer oder der Rückruf ohne Konto angeboten werden?
9. **Statusleiste**: Soll ein unbezahlter Entwurf als „Bestellt“ erscheinen?
10. **Live-Demos**: Wann gehen sie online? Bis dahin führt „Konfigurator ausprobieren“ in die App für Hauseigentümer mit Preis und Paywall.
11. **Preise**: Wann gelten die Paketpreise als bestätigt (`VORLAEUFIG = false`)? Wann sind Paketbedingungen und Rechtsvorlage der Instanzen anwaltlich geprüft?
12. **Kontakt für Hauseigentümer**: Ist das Fehlen eines Kontaktformulars gewollt?
13. **Offene Befunde** 11 (Hinweis „Bestellung bald möglich“ schon in Schritt 1), 13 (Kopf-Pille der Verkaufsseite als Ring), 15 (Rückruf: vergangene Fenster, Feiertage), 17 (Feld „E-Mail im Impressum“): Werden sie in der Neugestaltung mit erledigt? (`docs/INSTANZEN.md:383-385`)
14. **Prüfung „weniger Bewegung“ der Verkaufsseite**: In den Prüfabschnitten 29 und 30 fand sich kein Durchlauf mit `reducedMotion`; ist eine Prüfung an anderer Stelle vorgesehen?

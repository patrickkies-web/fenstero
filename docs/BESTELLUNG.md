# Bestellung, Kundenbereich und Zentrale der Aufträge

Ein Fensterbauer bestellt auf eeziframes.com seine Landingpage mit Fenster-Konfigurator in einem der drei Pakete (**EEZI Essential**, **EEZI Essential Plus**, **EEZI Signature**). Die Seite baust du danach von Hand aus der Vorlage des Pakets, mit einem Prompt, den die Zentrale aus allen Angaben zusammenstellt. Neu gebaut am 27.10.2026; das alte Kundenkonto `/partner/`, die alte Paket-Bestellung und die alte Zentrale-Oberfläche sind gelöscht (Wunsch des Inhabers: „alles von neu aufbauen“).

## Wo was steht

| Was | Stelle |
|---|---|
| Merkmale und Preise je Paket | `web/assets/pakete.js` (einzige Stelle für Preise; `VORLAEUFIG`, `PREIS_STAND`) |
| Regeln der Aufträge: Stationen je Paket, Felder mit Grenzen und Prüfung, Plätze für Dateien, Stände und Übergänge, was ein Paket veränderbar macht, Anreiz zum nächsten Paket | `web/assets/auftragsregeln.js` (Browser `window.Auftrag`, Server `globalThis.Auftrag`) |
| Bestellung `/bestellen/` | `web/bestellen/index.html`, `web/assets/bestellen.js` |
| Kundenbereich `/konto/` (Bereich für Fensterbauer: Anfragen der Vermittlung und Aufträge) | `web/konto/index.html`, `web/assets/konto.js`, Stile der Anfragen `web/assets/konto-anfragen.css` (Präfix `a-an-`); Server der Anfragen `functions/api/vermittlung-partner.js` |
| Zentrale `/zentrale/` | `web/zentrale/index.html`, `web/assets/inhaber.js`, [ZENTRALE.md](ZENTRALE.md) |
| Gemeinsame Bausteine und Stil (Design-DNA, Palette „Task-App dunkel“, App-Rahmen) | `web/assets/auftrag-ui.js`, `web/assets/auftrag.css` (Präfix `a-`) |
| Server: Routen, Mails, Stripe, Daten | `functions/auftrag/index.js`, `mails.js`, `zahlung.js`, `daten.js` |
| Tabellen | `supabase/schema.sql`, Abschnitt „Aufträge“: `kunden`, `anmeldecodes`, `auftraege`, `auftrag_nachrichten`; Dateien im Bucket `auftraege` (privat, legt der Server selbst an) |
| Paketbedingungen mit AV-Vertrag und ihre PDFs | `web/konfigurator-bedingungen/`, `scripts/bedingungen-pdf.mjs`, Fassung `PAKET_STAND` in `functions/api/recht.js` (seit 27.10.2026: `2026-10-27`) |
| Prüfung | `scripts/pruefen-instanzen/26.mjs` (`NUR=26`), dazu 23 und 29 |

## Die Bestellung

Jede Karte auf der Seite für Fensterbauer führt in die Bestellung ihres Pakets (`/bestellen/#essential`, `#plus`, `#signature`). Rahmen nach der Design-DNA: Kopf, Stationen-Band, Bühne mit der Vorschau der eigenen Seite (kleiner Browser mit der künftigen Adresse, Name, Überschrift, Farbe, Porträt, Foto), Frage, weiße Karten, Fuß mit genau einer Pille.

| Station | Was gefragt wird |
|---|---|
| **Paket** | Umschalter Essential, Plus, Signature mit Monatspreis gleich unter der Frage (am Telefon steht nur die gewählte Karte, die Pille nennt Paket und Preis); Karten mit den Seiten von Fensterbau Brandt als Bild, Preis im Monat und Einrichtung (je mit „netto“), KI-Kontingent und Preis jeder weiteren Auswertung, was dazukommt, Hinweis auf eeziframes offen genannt; bei Plus und Signature direkt darunter **„Wer füllt Ihre Seite?“**: *Seite vorschlagen* (wir füllen Texte, Farben und Bilder aus, gern von der bisherigen Website; intern `weg: schnell`) oder *Selbst angeben* (der Kunde gibt Logo, Farben, Fotos und Texte nach der Zahlung im Kundenbereich vor; `ausfuehrlich`); darunter die Pille „Weiter mit …“, danach das Muster-Aufmaßblatt und der Mess-Schritt zum Ansehen |
| **Konto** | E-Mail-Adresse, Code per Mail (zugleich die Registrierung, kein Passwort); danach liegt der Auftrag als Entwurf auf dem Server |
| **Ihr Betrieb** | vor der Kasse nur das Nötigste (`Auftrag.BESTELLUNG_FELDER`): Unternehmen, Name auf der Seite, Ansprechperson, Telefon, E-Mail, bisherige Website (freiwillig) und die Anschrift für Rechnung und Impressum. Name und Rechtsform füllen sich aus dem Unternehmen (die Rechtsform wird gemerkt, das Feld kommt nach der Zahlung). Nach der Zahlung („Seite einrichten“) dazu Einzugsgebiet, Rolle, Erreichbarkeit und das Impressum (Bundesland, Rechtsform, Vertretung; Register, USt-IdNr., Kammer, Beruf aufklappbar); bei *Seite vorschlagen* sind Bundesland, Rechtsform und Vertretung freiwillig (klären wir im Telefonat). Alle Platzhalter beginnen mit „z. B.“ |
| **Adresse** | Essential: Name unter eeziframes.com mit Prüfung „frei/vergeben“. Plus und Signature: *Neue Domain* (bis drei Wünsche oder „Schlagen Sie mir Namen vor“; bis 25 € netto im Jahr im Paket, Paketbedingungen § 6) oder *Meine Domain* (eine Domain, die schon gehört, nach Absprache, § 6 Abs. 3; Hinweis, dass die bisherige Website bleibt). Dazu die Adressen für die Anfragen (bis drei). Die Zugänge zum Dashboard (Signature, bis fünf) erst nach der Zahlung |
| **Auftritt** | nur nach der Zahlung („Seite einrichten“ im Kundenbereich) und nur mit eigener Gestaltung (Plus, Signature). *Seite vorschlagen*: Logo, „von meiner Website übernehmen“, Hinweise. *Selbst angeben*: Logo, bis drei Farben (oder aus Logo/Website), Fotos für Bühne, Werkstatt, Montage, Team, Ausstellung, Referenz (leere Plätze schraffiert), Porträt, Überschrift, Einleitung, Leistungen, bei Signature der Einladungstext, Hinweise |
| **Bestellen** | Lücken mit Sprung zur Station, dort sind die fehlenden Felder rot markiert und das erste hat den Fokus; vor dem Bezahlen die Frage **„Lieber gleich <nächstes Paket>?“** mit den drei wichtigsten Unterschieden, dem Aufpreis und „Zu … wechseln“ (Essential → Plus, Plus → Signature); Preiskachel: Einrichtung als Zahl (netto), „Heute bei Stripe: … inkl. 19 % USt.“, Monatspreis netto und brutto ab Livegang, KI-Kontingent, kostenloses Storno bis Arbeitsbeginn; direkt darunter drei Häkchen mit je einem Satz Alltagsdeutsch (Unternehmer § 14 BGB, Paketbedingungen in der Fassung `PAKET_STAND`, AV-Vertrag) und die Zeile über der Pille („Noch 2 Häkchen setzen“, Koralle nur, solange etwas fehlt); dann „Kostenpflichtig bestellen“ (Stripe) oder, solange die Kasse zu ist, „Unverbindlich anfragen“. Unter der Pille: die vier Schritte bis Live mit der Wunschzeit für den Anruf und „Ihre Angaben“ mit „Ändern“ je Teil |

Meldungen („Code ist unterwegs“, „Gespeichert“) stehen im Fuß über der Pille, nie über einem Knopf oder Feld, und verschwinden mit der Station oder nach vier Sekunden.

**Vor der Kasse nur das Nötigste, alles Weitere danach** (Wunsch des Inhabers, 27.10.2026): Bestellt wird mit Betrieb (das Nötigste), Wunsch-Adresse und Empfängern der Anfragen (`Auftrag.pruefen(…, 'bestellung')`, Server ebenso). Nach der Zahlung führt der Kundenbereich mit „Seite einrichten“ durch, was noch fehlt (Impressum; bei *Selbst angeben* Logo, Fotos, Texte; bei Signature das Team), über dieselben Stationen mit allen Feldern und „Speichern“ (vollständig geprüft). Die Vorschau rechts zeigt immer die echte Startseite, auch bei Signature (nie die persönliche Einladung).

Gespeichert wird nach jeder Eingabe (kurz verzögert, beim Verlassen der Seite noch einmal); ein Entwurf darf Lücken haben, geprüft wird beim Weitergehen und beim Bestellen (Browser und Server mit denselben Regeln). Fotos werden im Browser verkleinert (Fotos bis 2400 px, Porträt 900 px). Paket und Weg lassen sich bis zur Zahlung wechseln.

## Stände eines Auftrags

| Stand | Wer | Was passiert |
|---|---|---|
| `entwurf` | Kunde | füllt aus; nach 30 Tagen ohne Änderung samt Dateien gelöscht |
| `angefragt` | Kunde | unverbindlich angefragt, solange die Kasse zu ist (ohne `PAKETE_OFFEN` im Live-Modus); Mail an dich; Löschfrist wie Entwurf |
| `bezahlt` | Stripe | Einrichtung bezahlt = Vertrag geschlossen (§ 3 Abs. 2); Mails an Kunde („Ihre Zahlung ist da“, mit dem Hinweis aufs Einrichten) und dich; der Kundenbereich zeigt „Jetzt richten Sie Ihre Seite ein“ mit der Pille „Seite einrichten“, solange Impressum, Logo, Fotos, Texte oder Team fehlen; Kunde kann bis Arbeitsbeginn im Kundenbereich stornieren (§ 7 Abs. 2, volle Erstattung, frische Anmeldung nötig) |
| `in_arbeit` | du | „Seite beginnen“: Anruf, Domain sichern, Seite bauen |
| `vorschau` | du | Link zur Vorschau eintragen; Mail mit Link; im Kundenbereich ist „Vorschau öffnen“ die Pille, „Freigeben“ und „Änderungen wünschen“ stehen daneben; fehlen Logo, Fotos oder Porträt, nennt die Freigabe das vorher („Trotzdem freigeben“). Der Kunde gibt frei oder schreibt, was zu ändern ist (dann zurück nach `in_arbeit`) |
| `live` | du | nach Freigabe: Adresse der fertigen Seite eintragen; das Monatsabo startet bei Stripe, Mail mit Link; der Kundenbereich zeigt den Knopf „Fenster planen“ als HTML für die eigene Website |
| `pausiert`, `beendet`, `storniert` | du (oder Stripe, Tageslauf) | Pause, Ende (Abo zum Monatsende oder sofort), Storno mit Erstattung. Pause und Ende schalten den verknüpften Konfigurator mit (Pause: nur Name und Kontakt, Ende: vom Netz; bei „zum Monatsende“ erst nach dem bezahlten Monat). Ablauf bei Nichtzahlung unten |

Übergänge stehen in `Auftrag.UEBERGAENGE` (wer darf was); der Server prüft jeden Schritt. Nach der Zahlung bleibt alles änderbar (Stationen der Bestellung mit „Speichern“), aber nur vollständig; jede Änderung erscheint in der Zentrale als „geändert“. Ein Paketwechsel nach der Zahlung ist eine Anfrage (Differenz der Einrichtung, neuer Monatspreis ab Wechsel, § 7 Abs. 3).

## Kundenbereich `/konto/`: ein Bereich für Fensterbauer

Seit dem 30.10.2026 (Wunsch des Inhabers) ist `/konto/` der gemeinsame Bereich für zwei Arten von Fensterbauern: Betriebe, die über die Vermittlung Anfragen von Hauseigentümern bekommen (docs/VERMITTLUNG.md, Abschnitt 13; Server `functions/api/vermittlung-partner.js`), und Paket-Kunden mit ihren Aufträgen. Eine Anmeldung per Code für beides; das Konto entsteht mit dem ersten Code, nicht erst mit einer Bestellung. Alle Texte siezen.

| Adresse | Was steht da |
|---|---|
| `/konto/` (abgemeldet) | Anmeldeseite: „Für Fensterbauer: Anfragen von Hauseigentümern und Ihr Konfigurator-Paket. *Anmelden mit Code.*“, Feld E-Mail (`[data-k="mail"]`), Pille „Code schicken“, dann Feld Code (`[data-k="code"]`, Attrappe `123456`) und Pille „Anmelden“; Fußzeile „Noch kein Konto? Es entsteht mit dem ersten Code, den Sie anfordern.“ mit Link zur Seite für Fensterbauer |
| `/konto/#zugang/<token>` | Link aus der Mail an den Betrieb (`GET /api/anfrage/:token`, ohne Anmeldung): Bühne mit dem Aufmaßblatt als Papier (`.a-an-buehne .a-an-papier`, gesperrt mit Schloss `.a-an-schloss`), Frage „Anfrage aus <Ort>. *<n> Fenster, <Zeitraum>.*“, Karte **Echtheit** (Chips „Telefonnummer per Code bestätigt“, „Einwilligung des Kunden“, „Ging an n Betriebe“ bzw. „Ging nur an Sie“, „Vom Kunden gewählt“), Karte **Eckdaten** (`dl.a-kv`), darunter die Karte „Anmelden mit Code“: E-Mail vorbelegt, wenn die Sitzung passt (`mailVoll`), sonst leer mit dem Hinweis „Den Zugang haben wir an br•••@… geschickt“. Nach dem Anmelden ruft `zugang()` `POST /api/anfrage/:token/annehmen` und wechselt zu `#anfrage/<id>`; passt die angemeldete Adresse nicht (403 bzw. `passt: false`): Karte „Andere Adresse“ (`.a-an-hinweiskarte`) mit der maskierten Adresse und die Pille „Mit anderer Adresse anmelden“ (meldet ab, zeigt die Anmeldung mit dem Hinweis) |
| `/konto/#anfrage/<id>` | Eine Anfrage (`GET /api/konto/anfragen/:id`). Band „V-2026-0001 · Eingang 30.10.2026“ (+ Chip „Vom Kunden gewählt“), Bühne mit dem Papier, Frage wie oben. **Vor dem Freischalten:** Karten Echtheit, Eckdaten und **Freischalten** (`.a-an-freischalten`: Preis als Zahl „0 € · Ihr erstes Aufmaß“ oder „29 € zzgl. USt“ mit Brutto, Pflicht-Häkchen `[data-k="zustimmung"]` „Ich akzeptiere die Partnerbedingungen (erstes Aufmaß kostenlos, danach 29 € zzgl. USt je freigeschaltetem Aufmaß).“, Link `/partnerbedingungen/`), darunter im Fuß die Zeile `.a-grund` („Kostenlos, ohne weitere Verpflichtung“ bzw. „Weiter zur Zahlung bei Stripe, mit Karte“; ohne Häkchen in Koralle „Bitte die Partnerbedingungen bestätigen“, das Häkchen bekommt `.fehlt`) und die eine Pille **„Kostenlos freischalten“** (`erstesFrei`) bzw. **„Für 29 € zzgl. USt freischalten“**. `POST …/freischalten { zustimmung: true }` → kostenlos: Anzeige wechselt, Meldung „Freigeschaltet. Kontakt und Aufmaßblatt sind offen.“; sonst Weiterleitung auf `kasse`; Rückkehr `/konto/?kasse=<session>#anfrage/<id>` → `GET …/kasse?session=` → Meldung „Danke, Ihre Zahlung ist da. Die Anfrage ist freigeschaltet.“ **Nach dem Freischalten:** Karte **Kontakt des Kunden** (`.a-an-kontakt`: Name `.a-an-name`, Telefon groß als `a.a-anruf[href^="tel:"]`, E-Mail als `mailto:`, Erreichbar, Ort, Hinweis `.a-an-zweck` „Nur für diese Anfrage. …“ mit dem Wortlaut der Einwilligung und dem Löschdatum), Echtheit, Eckdaten; im Fuß die Pille **„Aufmaßblatt (PDF)“** (`a.a-pille[href="/api/konto/anfragen/<id>/pdf"]`, neuer Tab) und der Ring **„Herunterladen“** (`?laden=1`); auf der Papierkante der runde Knopf zum PDF (`.a-an-papier-knopf`). Am Telefon klebt der Fuß unten, am Laptop in der linken Spalte (`main.a-an-unten`). Darunter (`.a-an-drei`) drei Kacheln: **Register und Bereitschaft** (`.a-an-register`: Nutzen „Partner stehen bei Kunden in ihrer Umgebung auf Platz 1 und 2 und bekommen neue Anfragen direkt hier.“, Preis „Das erste Aufmaß ist kostenlos, jedes weitere 29 € zzgl. USt, erst fällig beim Freischalten.“, Betrieb mit Stand-Chip, Schalter `.a-an-schalter[role="switch"]` „Bereitschaft erklären“, Ring „Als Betrieb eintragen“ / „Angaben ändern“), **Echtheit** (Text des Inhabers, Ring „Partnerbedingungen“), **Konfigurator für Ihre Website** (Ring „Pakete ansehen“ → `/fuer-fensterbauer/#pakete`) |
| `/konto/` (angemeldet) | Übersicht `uebersicht()`: Frage „Ihr Bereich *für Anfragen und Ihre Seite.*“; Kachel **Anfragen** (`.a-an-anfragen`: Zahl als Held `.a-an-kennzahl`, Chip „n zum Freischalten“, die letzten fünf als Zeilen `a.a-an-zeile[href="#anfrage/<id>"]` mit Ort bzw. Name, Datum, Nummer, Fenster und Chip „Freischalten“ (Hinweis) / „Freigeschaltet“ (aktiv), Ring „Alle n Anfragen“), Kachel **Ihre Seite mit Konfigurator** (`.a-an-seite`: Aufträge als Zeilen `a.a-an-zeile[href="#auftrag/<id>"]` mit Stand-Chip; ohne Auftrag die Einladung mit Ring „Pakete ansehen“), Karte **Ihr Betrieb** (Register-Eintrag mit Stand-Chip, Schalter, Ring „Angaben ändern“; ohne Eintrag Ring „Als Betrieb eintragen“). Die eine Pille: neueste offene Anfrage („Anfrage aus <Ort> öffnen“), sonst „Als Betrieb eintragen“, sonst „Bereitschaft erklären“, sonst „Neue Bestellung“ (mit Aufträgen) oder „Konfigurator ausprobieren“. Ein einziger Auftrag ohne Anfragen öffnet sich weiter direkt (`route()`) |
| `/konto/#auftrag/<id>` | ein Auftrag der Pakete, unverändert (Stände unten) |

**Register und Bereitschaft:** „Als Betrieb eintragen“ öffnet ein Blatt (`.a-blatt .a-an-formular`) mit Name, PLZ, Ort, Straße, Telefon, Website und den Leistungen als Kapseln (`.a-wahl button[aria-pressed]`, Liste `Kunststoff, Holz, Holz-Alu, Alu, Haustüren, Rollläden, Insektenschutz`), Pille „Eintragen“ bzw. „Speichern“ → `POST /api/konto/betrieb` (Fehler je Feld aus `felder`). Der Schalter „Bereitschaft erklären: Ich möchte Anfragen aus meiner Umgebung erhalten“ öffnet beim Einschalten das Blatt „Bereitschaft erklären?“ mit dem Pflicht-Häkchen Partnerbedingungen (`[data-k="zustimmung"]`) und der Pille „Bereitschaft erklären“ → `POST /api/konto/partner { betrieb, bereit: true, zustimmung: true }` (Stand `partner`, Chip „Partner“); beim Ausschalten die Rückfrage „Bereitschaft zurücknehmen?“ → `bereit: false`. Ohne Eintrag öffnet der Schalter zuerst das Formular. Ist die Vermittlung nicht eingerichtet (`GET /api/konto/anfragen` schlägt fehl), zeigt die Übersicht nur die Kachel der Seite.

Browser-Prüfungen (Abschnitt 26) finden: Anmeldung `[data-k="mail"] input`, `.a-fuss .a-pille` („Code schicken“ → „Anmelden“), `[data-k="code"] input`; Zugang `.a-an-papier`, `.a-an-schloss`, `.a-an-hinweiskarte`; Anfrage `.a-an-freischalten`, `[data-k="zustimmung"] input`, `.a-fuss .a-grund(.offen)`, `.a-an-kontakt`, `.a-anruf`, `.a-fuss .a-pille[href$="/pdf"]`, `.a-fuss .a-ring[href$="?laden=1"]`, `.a-an-papier-knopf`; Übersicht `.a-an-anfragen`, `.a-an-seite`, `.a-an-zeile`, `.a-an-kennzahl`; Register `.a-an-register`, `.a-an-schalter[aria-checked]`, `.a-an-formular`. Je Bildschirm genau eine volle Pille (`.a-pille` außerhalb `.a-blatt`), Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen; Fotos vom 30.10.2026 im Scratchpad des Auftrags.

## Preise und KI-Auswertungen

Preise des Inhabers vom 27.10.2026, Einrichtung Essential Plus seit 28.10.2026 150 € statt 50 € (Stand `2026-10-28`), alle netto, einzige
Stelle `web/assets/pakete.js` (`preis`, `kiMonat`, `PREIS_STAND`):

| Paket | Einrichtung | Monat | KI-Auswertungen im Monat inklusive | jede weitere |
|---|---|---|---|---|
| Essential | 99 € | 39 € | 1.000 (etwa 20 Kundenanfragen mit je 25 Fenstern) | 0,08 € |
| Essential Plus | 150 € | 69 € | 1.500 | 0,08 € |
| Signature | 239 € | 99 € | 2.000 | 0,08 € |

Eine KI-Auswertung ist ein Foto (je Fenster meist zwei). Der Preis jeder weiteren steht im Preisstand des Auftrags (`auftraege.preise.ki`) und gilt für diesen Vertrag.

**So läuft das Kontingent (Wunsch des Inhabers, 27.10.2026):**

1. **Verknüpfen:** Beim Live-Schalten sucht der Server den Konfigurator unter der Adresse der fertigen Seite und hängt ihn an den Auftrag (`auftraege.instanz`: id, id8, host). Findet er keinen, sagt die Zentrale das; verknüpft wird dann in der Karte „KI-Auswertungen“ des Auftrags von Hand.
2. **Zählen:** je Konfigurator und Kalendermonat nur gelungene Auswertungen (`budget:inst:<id8>:kiok` in der Tabelle `statistik`); Versuche zählen getrennt als Bremse (dreifaches Kontingent).
3. **Sehen:** Im Kundenbereich zeigt die Karte „KI-Auswertungen“ den Monat in Prozent (große Zahl bis 100 % und Kapselreihe, „13 von 20 Fotos ausgewertet“), bei Freischaltung eine zweite Reihe für die weiteren mit dem bisherigen Betrag und dem Höchstbetrag netto und mit MwSt. Mails an den Betrieb bei 80 %, bei 100 % und an der Obergrenze; an den Inhaber bei 100 %.
4. **Pause oder freischalten:** Ohne Freischaltung pausiert die KI bei 100 % bis Monatsende; der Konfigurator nimmt weiter Anfragen an, nur ohne KI-Befund. Mit „Weitere Auswertungen freischalten“ (`auftraege.ki.frei`) läuft sie bis zum Doppelten weiter. Die Freischaltung gilt auch in den folgenden Monaten, bis der Betrieb sie mit „Weitere Auswertungen beenden“ zurücknimmt; danach entstehen keine weiteren Kosten, schon genutzte weitere des Monats werden abgerechnet. Karte und Blätter sagen das wörtlich (Vetos des Gremiums, docs/profis/2026-10-27-bestellung.md).
5. **Abrechnen:** Der Tageslauf rechnet am Monatsanfang den Vormonat ab: weitere = genutzt − Kontingent (höchstens das Kontingent), mal Preis; ein Rechnungsposten (`/v1/invoiceitems`, netto mit Steuersatz) am Stripe-Abo, der mit der nächsten Monatsrechnung abgebucht wird. Genau einmal je Monat (`auftraege.ki.abgerechnet['JJJJ-MM']`), mit Eintrag im Verlauf. Geht der Posten nicht (kein Abo), steht „von Hand abrechnen“ in der Zentrale.

Konfiguratoren ohne laufenden Auftrag (Demos, von Hand angelegt, nach dem Vertragsende) pausieren die KI beim Kontingent; über das Kontingent hinaus läuft sie nur mit Freischaltung im Auftrag (seit 28.10.2026). Ist der Vertrag beendet, kommen weitere Auswertungen des letzten Monats als eigene Schlussrechnung (zahlung.js kiPosten). Weitere Bremsen: nur Fotos aus einer Planung mit Code des Betriebs, höchstens 60 je Anfrage, Bremse je Anschluss, Tagesbudget der Konfiguratoren getrennt von der App (`KI_TAG_MAX_INSTANZEN`, `KI_TAG_MAX`); in der Vorschau höchstens 10 Testanfragen am Tag je Konfigurator (`GRENZEN.testJeTag`), ohne KI-Kontingent; Anfragen je Anschluss dauerhaft gezählt (Prüfwert, 2 Tage). Die Kalkulation des Preises steht nur intern in [KI-KOSTEN.md](KI-KOSTEN.md). Ist die Einrichtung des größeren Pakets günstiger (Essential zu Plus), kostet der Wechsel keine Einrichtung; erstattet wird nichts (Paketbedingungen § 7 Abs. 3).

## Geld (Stripe)

- **Einrichtung:** Checkout im Modus `payment` (Karte oder SEPA-Lastschrift), Betrag aus `pakete.js` netto mit Steuersatz 19 % (Metadaten `eeziframes: auftrag-mwst19`, legt der Server an; `MWST=0` ohne), Rechnung von Stripe, Zahlungsmittel bleibt für das Abo hinterlegt. Metadaten `art: auftrag`, `auftrag: <id>`.
- **Gutscheincodes (28.10.2026):** Die Kasse der Einrichtung zeigt das Feld „Gutscheincode hinzufügen“ von Stripe (`allow_promotion_codes`). Codes legt der Inhaber im Stripe-Dashboard an (Produkte → Gutscheine: Gutschein, z. B. 50 %, einmalig; darunter der Aktionscode, den der Kunde eintippt, mit Ablaufdatum und Höchstzahl der Einlösungen). Am Auftrag steht der bezahlte Betrag nach Rabatt (`zahlung.betrag_cent` aus `amount_total`), die Rechnung von Stripe weist den Rabatt aus. Das Monatsabo und die Kasse des Aufmaßblatts nehmen keine Codes an. Die Einrichtung hat kein festes Stripe-Produkt (Preis je Kasse); ein Gutschein darf also nicht auf Produkte beschränkt sein, sonst greift er nicht.
- **Live nur mit Konfigurator (27.10.2026):** „Live schalten“ verlangt einen Konfigurator, der schon verknüpft ist oder unter der eingetragenen Adresse läuft, im Paket des Auftrags und mit keinem anderen laufenden Auftrag verknüpft. Sonst antwortet der Server 409: kein Abo, keine Mail „Ihre Seite ist live“. Dieselbe Prüfung gilt beim Verknüpfen von Hand.
- **Monatsabo ab Live:** Preis über `lookup_key` `eezi-auftrag-<paket>-<cent>` (eine Preisänderung legt einen neuen Preis an, laufende Abos behalten ihren).
- **Kundenportal:** eigene Konfiguration (Metadaten `auftrag-v1`): Rechnungen, Zahlungsmittel, Rechnungsangaben, Kündigung zum Monatsende.
- **Webhook** (`/api/zahlung/webhook`, Ereignisse mit `metadata.art = auftrag`): `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`; dazu `charge.dispute.created` (Rückbuchung: Mail an den Inhaber, Vermerk `zahlung.rueckbuchung` am Auftrag, wenn die Zahlung `metadata.auftrag` trägt; Kunden informieren und pausieren tut der Inhaber). Rückkehr aus der Kasse und Webhook schreiben beide „bezahlt“; Mails gehen nur beim ersten Mal.
- **Attrappe** (`ZAHLUNG_ATTRAPPE=1` ohne Schlüssel): Kassen mit `test_`-Kennung gelten als bezahlt, Abo und Erstattung ohne Stripe.

### Nichtzahlung (Paketbedingungen § 8)

Läuft von selbst; du siehst jeden Schritt im Verlauf des Auftrags und bekommst eine Mail.

1. **Abbuchung fehlgeschlagen** (`invoice.payment_failed`): Abo `zahlung_offen`, `abo.offen_seit`; Mail an den Betrieb (nur beim ersten Fehlschlag, Stripe versucht es mehrfach) und an dich. Der Kundenbereich zeigt oben „Ihr Monatsbeitrag ist offen“ mit der Pille „Zahlungsmittel prüfen“ (Kundenportal von Stripe).
2. **Nach `FRISTEN.kulanzTage` (14) Tagen** pausiert der Tageslauf Auftrag und Konfigurator (`sperre = 'zahlung'`, `pause_seit`); Mails an Betrieb und dich.
3. **Zahlung kommt** (`invoice.paid`): wieder live, Konfigurator nimmt wieder an, Mail an den Betrieb.
4. **Nach `FRISTEN.pauseMaxTage` (60) Tagen Pause** beendet der Tageslauf den Vertrag: Abo sofort beenden, Konfigurator vom Netz, Mails. Offene Beträge bleiben fällig (§ 4 Abs. 6); die Domain bleibt bei dir, bis alles bezahlt ist (§ 6 Abs. 2).
5. **Stripe bricht das Abo selbst ab** (`customer.subscription.deleted` mit `cancellation_details.reason` `payment_failed`, Einstellung „Abo kündigen“ für die Altkonten): Der Vertrag endet nicht sofort, es geht nach 2 und 4 weiter. Zahlt der Betrieb danach, bleibt der Konfigurator pausiert, bis du in der Zentrale „Wieder live schalten“ wählst; das startet ein neues Abo.
6. **Kündigung durch den Betrieb** (Kundenportal, Abo endet zum Monatsende, `customer.subscription.deleted` ohne Zahlungsgrund): Vertrag beendet, Konfigurator vom Netz, Mail.

Von Hand in der Zentrale: „Pausieren“ (`sperre = 'inhaber'`, endet nie von selbst), „Wieder live schalten“, „Vertrag beenden“ (sofort oder zum Monatsende). Prüfung 26.15.

## Mails

Anmeldecode · Eingangsbestätigung mit Paketbedingungen und AV-Vertrag als PDF (Fassung `PAKET_STAND`) · Zahlung da · Vorschau · Live · Pause, Ende, Storno · Nachrichten in beide Richtungen · an dich: neue Bestellung oder Anfrage, Nachrichten, Freigabe, Änderungswunsch, Paketwechsel, Storno, Frage vom Formular der Seite für Fensterbauer (`POST /api/auftrag/frage`, auch ohne JavaScript). Weiße Karte, Systemschrift, eine schwarze Pille, kein Tracking (`functions/auftrag/mails.js`).

## Fristen (Datenschutzerklärung Abschnitt 9, Werte aus `Instanzregeln.FRISTEN`)

Täglicher Lauf `auftraegeLauf`: nicht bezahlte Bestellungen 30 Tage nach der letzten Änderung samt Dateien; nach dem Vertragsende die Dateien nach 30 Tagen, der Auftrag mit Nachrichten nach dem Ende des dritten Jahres; Konten ohne Auftrag 30 Tage nach der letzten Anmeldung; abgelaufene Anmeldecodes nach einem Tag.

## Sicherheit

Anmeldung per Code (6 Ziffern, 15 Minuten, nur als HMAC gespeichert, höchstens fünf Versuche; Bremsen je Adresse und Anschluss), Sitzung `__Host-kunde` (14 Tage) bzw. `__Host-inhaber` (8 Stunden), signiert mit `SITZUNG_GEHEIMNIS`; POST nur mit eigener Herkunft. Jeder Auftrag gehört einem Kunden, fremde antworten 404. Dateityp aus den ersten Bytes, SVG und PDF nur als Anhang mit Sandbox. Bestellung und Zentrale gibt es nur auf der Hauptdomain, nicht auf dem Host einer Instanz.

## Anfragen der Vermittlung im selben Bereich

Seit 30.10.2026 ist `/konto/` der eine Bereich für beide Arten von Fensterbauern (Wunsch des Inhabers): die Aufträge der Pakete und die
Anfragen von Hauseigentümern aus der Vermittlung. Wer kein Paket hat, sieht keine Mahnung, sondern die Pakete als Angebot in einer Karte.

- **Zugang:** Die Zentrale schickt dem Betrieb eine Mail mit einem Link `/konto/#zugang/<token>` (180 Tage gültig; Token in
  `functions/api/sitzung.js`, Zweck `vzugang`). Die Seite zeigt die Anfrage als Vorschau ohne Kundendaten (Ort, Eckdaten, Echtheit) und
  bittet um die Anmeldung per Code mit genau der Adresse, an die der Zugang ging; eine andere Adresse wird abgewiesen (403).
- **Anfrage** (`#anfrage/<id>`): Aufmaßblatt als Objekt auf der Bühne (vor dem Freischalten mit Schraffur statt Kontakt), Echtheit,
  Eckdaten; Pille „Kostenlos freischalten“ oder „Freischalten · 29 € zzgl. USt“, nur mit dem Häkchen zu den Partnerbedingungen. Das
  zweite und jedes weitere Aufmaß führt zur Kasse von Stripe (Rückkehr `/konto/?kasse=<session>#anfrage/<id>`). Danach Kontakt des Kunden
  mit dem Satz „Nur für diese Anfrage“ und dem Wortlaut seiner Einwilligung, Pille „Aufmaßblatt (PDF)“.
- **Übersicht:** Kachel „Anfragen“ (Zahl als Held, Zeilen mit Chip Freigeschaltet/Offen), Kachel „Ihre Seite mit Konfigurator“
  (Aufträge oder das Angebot der Pakete), Karte des Betriebs mit dem Schalter „Bereitschaft erklären“ (Partner, Platz 1 und 2 in der
  Suche) und „Angaben ändern“ (Blatt mit Name, Ort, PLZ, Straße, Telefon, Website, Leistungen).
- **Server:** `functions/api/vermittlung-partner.js` (Routen `/api/anfrage/:token`, `/api/konto/anfragen…`, `/api/konto/partner`,
  `/api/konto/betrieb`), Register `functions/api/vermittlung-register.js`; alles Weitere in docs/VERMITTLUNG.md, Abschnitt 13.
- **Prüfung:** Abschnitt 31, Teil 7 (Schnittstelle) und Teil K (Browser).

## Lokal ausprobieren

```
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 MAIL_ATTRAPPE=1 ZENTRALE_PASSWORT=lokal-zentrale-2026 PORT=8789 node scripts/dev-server.mjs
```

Bestellung `http://localhost:8789/bestellen/#plus`, Code `123456`, Mails unter `/api/test/post`, Zentrale mit dem Passwort oben. Anfragen für den Bereich: `node scripts/dev-vermittlung-anlegen.mjs http://localhost:8789 4`, dann in der Zentrale (`/zentrale/#vermittlung`) bei einem Betrieb „will“ setzen und den Zugang an eine E-Mail-Adresse schicken; der Link `/konto/#zugang/<token>` steht in der Mail der Attrappe. Die Kasse der Attrappe führt sofort zurück und gilt als bezahlt.

## Offen

- **Konfigurator aus dem Auftrag anlegen (blockiert den Livegang):** Die Instanz (Host, Merkmale, Kennzeichnung, Logo, Farbe, Fotos, Startansicht, Suchmaschinen, Empfänger mit Bestätigungslink, Dashboard-Zugänge, Rechtsangaben) entsteht noch nicht aus dem Auftrag; in der Zentrale gibt es dafür keine Karte, `verwalten.js` ruft nur die Testroute auf. Bis dahin lässt sich ein Auftrag nicht live schalten (siehe oben). Prüfung der Abläufe vom 27.10.2026: docs/profis/2026-10-27-ablaeufe.md.
- **Paketwechsel nach der Zahlung ausführen:** Der Kunde kann ihn anfragen, die Zentrale zeigt den Hinweis; ein Weg zum Ausführen (Differenz, Preisstand, Abo, `paketSetzen`) fehlt.
- **Farbwelt im Konfigurator:** `farbwelt` (Plus halb, Signature voll) erreicht nur die Landingpage; der Konfigurator nimmt nur die Akzentfarbe. Klären, ob das so bleiben soll.
- **Essential unter `<name>.eeziframes.com`:** Wildcard-Eintrag und Zuordnung im Worker (`functions/instanz/mandant.js` behandelt `*.eeziframes.com` noch als Hauptdomain).
- **KI-Kontingent im Dashboard von Signature:** Der Stand steht im Kundenbereich auf eeziframes.com; im Dashboard unter der Domain des Betriebs noch nicht.
- **Alte Tabellen** `partner`, `bestellungen`, `partner_nachrichten` und ihre Funktionen in `speicher.js`: ungenutzt; löschen nur auf Wunsch des Inhabers.

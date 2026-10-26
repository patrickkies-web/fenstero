# Profis · Muster-Landingpage des Pakets EEZI Essential Plus nach der Design-DNA · 26.10.2026

Umfang: Groß (ganze Seite, neu gebaut), nach dem Rezept des Begleit-Skills: Gremium eine Runde, vier Detail-Profis und drei Abgleiche parallel (wie im Master-Anhängsel des Inhabers genannt), Muss-Punkte und Vetos umgesetzt, keine zweite Runde. Vorschau als Artefakt, Quelle in docs/profis/essential-plus-vorschau/, nichts online.

## Auftrag

- Bereich: die Muster-Landingpage des zweiten Pakets, EEZI Essential Plus (39 € im Monat, 199 € Einrichtung, web/assets/pakete.js), nach dem Prinzip der Essential-Landingpage (https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM): die Seite eines Fensterbauers unter seiner Domain, auf der seine Kunden Fenster planen und anfragen.
- Wunsch des Inhabers: intuitive Bedienung, visuell sehr ansprechend; die Seite soll zeigen, was Plus gegenüber Essential besser macht (Individualisierung je Betrieb). Mindestanforderung: die Startseite der Hauseigentümer und die Seite für Fensterbauer auf der Hauptseite (beide vom 26.10.2026, Design-DNA). Andere Seiten der Website sind keine Vorbilder.
- Klarstellung des Inhabers im Lauf: Mit „Startseite für Fensterbauer“ ist die DNA-Seite auf der Hauptseite gemeint (/#fensterbauer, /fuer-fensterbauer/), nicht die alte Demo-Instanz mit den Waschbären (web/bilder/beispiel/). Daraus wurde nur der Goldton des Beispielbetriebs abgelesen.
- Erfolg: Ein Fensterbauer sieht in fünf Sekunden, wofür er mehr zahlt (Logo, Farbe, Fotos, eigene Texte, kleiner Hinweis statt „Powered by“, Suchmaschinen); ein Hauseigentümer versteht in drei Sekunden, wer dahintersteht und was er tun soll, und tippt „Fenster planen“.

## Wahl (drei Zeilen)

1. Beispielbetrieb: Fensterbau Brandt, Köln (erfunden, wie auf der Verkaufsseite), Firmenfarbe Gold #d8ad55, Domain fensterbau-brandt.de, Ansprechpartnerin Petra Brandt; Texte der eigenen Startseite aus der Demo-Instanz des Projekts („Neue Fenster, gut geplant.“). Keine erfundenen Kennzahlen, Fotos oder Bewertungen.
2. Richtung: naheliegend auf der Essential-Seite (Bühne mit Gerät, vier Schritte, Weg der Anfrage, Bereit, Kontakt) mit zwei mutigen Teilen: Szene „Der Betrieb“ als Bento mit Fotoplätzen und dem Rendering, das aus der Kachel bricht (G12), und die Kontaktkarte mit dunkler Innenkarte (G8), in der die Telefonnummer der Held ist. Dazu die Muster-Ebene für Fensterbauer: eine Leiste über der Seite mit dem Schalter „Zeigen, was Ihres ist“, der Glas-Chips mit Koralle-Punkt an Domain, Farbe und Zeichen, Bühne, Text, Fotoplätzen und Fußzeile einblendet; Standard aus.
3. Material: Beton im Fensterlicht (bilder/buehne.webp) als Bühne, bis Foto 1 des Betriebs da ist; Renderings des Konfigurators (held, sechs Elemente, Rundbogen, Sprossen, Rollladen, Raffstore, Sprossenmodell, weißes Modell), Foto von innen und Anthrazit-Modell aus den vier Schritten der Essential-Seite. Die sechs Fotoplätze des Betriebs sind gestaltete Leerstellen (Betonboden, Schraffur = „noch nicht“, Chip „Foto n von 6“) und erscheinen nur in der Muster-Ebene; Prompts dazu in essential-plus-vorschau/bilder-prompts.md. Der Bildgenerator des Projekts (bfl.ai) hatte keine Credits.

## Szenen und Gene

1. Dunkel · Empfang: G4 das Gerät des Betriebs als Objekt im Goldlicht, G7 Beton im Fensterlicht, G9 die Domain als Glas-Etikett am Gerät, G10 scharf vor unscharf, G2 Leuchten in der Firmenfarbe als Zustand, G6 eine Pille, G13 runder Knopf „Anrufen“, G14 Lichtkante, Vignette und Kontaktschatten des Geräts, G15 Titel 600.
2. Hell · Der Betrieb: G8 Bento, G12 das Sprossenfenster bricht nach unten aus der Kachel (mit Lichtsaum, Kontaktschatten, kurzem Wurf), G13 weißer Pfeilkreis, G2 Goldkern hinter dem Fenster, G1 Schraffur auf den Fotoplätzen (Muster-Ebene), G10 Chips über der Textur, dazu die Reihe von acht Elementen.
3. Dunkel · So geht es: G5 Stationen (Schritt 1 von 4, Fotos–Messen–Wünsche–Senden), G3 die Zahl 5 als Held (250, 96 px), G9 Maßlinien von den Kanten mit Hilfslinien, G1 Schraffur „noch offen“ in der weißen Karte, G10 Glas-Chip mit Fortschrittsring über dem Foto, G14 keine Fläche flach.
4. Hell · Ihre Daten und Bereit: G5 Stationen von „Sie planen“ bis „Einbau“, G9 jede Rolle an ihrer Station, G2 Leuchten nur am Betrieb, G1 gepunktete Linie, Hinweis als schwarzer Chip mit Koralle-Punkt, G6 schwarze Pille auf Weiß, G4 das weiße Fenster als Objekt mit Kontaktschatten und Etikett „Beispiel · Ihr Fenster nach Ihren Maßen“ (Schreibtisch).
5. Dunkel · Kontakt und Fuß: G3 die Nummer als Held (250, 44–48 px) in der dunklen Innenkarte (G8) mit weißem Rundknopf (G13), G2 Goldlicht aus der Ecke, „Beschriftung — Wert“ für E-Mail und Anschrift, Fuß nur mit dem Betrieb und der Zeile „Konfigurator von eeziframes“ (Kennzeichnung „dezent“ aus pakete.js).

## Ideen und Richtungen

Je Szene die Gen-Fragen: Hero: Gerät auf Betriebsfoto (keins da), Gerät auf Beton mit Goldlicht (gebaut), Etiketten für Logo und Farbe im Hero (verworfen: Kunden lasen sie als Aufforderung; jetzt Muster-Ebene). Betrieb: sechs Fotos als Bento (gebaut als Leerstellen nur im Muster), Kennzahlen des Betriebs (verworfen: erfunden), Produktreihe aus den Konfigurator-Renderings (gebaut). Kontakt: Nummer als Held in Innenkarte (gebaut), Öffnungszeiten (verworfen: erfunden). Drei Richtungen: naheliegend = Essential-Bausteine in der Farbe des Betriebs; mutig = Bento, Rahmenbruch, Innenkarte (gebaut); überraschend = Seite beginnt hell mit dem Betriebstext, das Gerät erst in Szene 2 (nicht gebaut: der Konfigurator ist der Beweis und gehört nach vorn, wie bei Startseite und Fensterbauer-Seite).

## Änderungsliste (Y Plus gegen X Essential)

1. Logo des Betriebs (drei Goldfelder und Wortmarke „FENSTERBAU · KÖLN / Brandt“) statt Initiale; eeziframes nicht im Kopf.
2. Firmenfarbe Gold statt Violett: Leuchten (Kern, Licht, Tiefe), Stationen, gewählte Kachel in der App, Maßlinie, Zeichen.
3. Eigene Domain als Glas-Etikett am Gerät.
4. Eigene Startseite: Kicker, Überschrift, Text, Begrüßung mit Petra Brandt.
5. Runder Knopf „Anrufen“ im Kopf; Leiste beim Hochscrollen mit Marke und Umriss-Pille.
6. Muster-Ebene: Leiste über der Seite mit Schalter, Chips an Domain, Farbe und Zeichen, Bühne, Text, Fotoplätzen, Fußzeile; Standard aus, Zustand bleibt im Browser.
7. Szene „Der Betrieb“: Titel und Text des Betriebs, Kachel „Alles, was Sie planen“ mit Rahmenbruch und Pfeilkreis, Reihe von acht Elementen; fünf Fotoplätze nur in der Muster-Ebene.
8. „So geht es“ als dunkle Szene mit Zeit-Kachel und weißer Karte „Weiß ich noch nicht“.
9. Weg der Anfrage hell, Route als dunkle Karte, eeziframes als Übermittler mit 30-Tage-Frist genannt, Bereit-Karte mit Fenster-Objekt.
10. Kontakt als eigene dunkle Szene mit Innenkarte, Fuß nur mit dem Betrieb und der dezenten Zeile.
11. Seitentitel und Beschreibung für Suchmaschinen.
12. Bewegung wie Essential (Auftritt, Etikett, Vorhang, Leiste); Schalter, Chips und Rückmeldung 220 ms auf, 160 ms ab; Hover nie als zweite volle oder farbige Pille.

## Blickprotokoll der Gestaltungsleitung (Y, 390 × 844, Standard ohne Muster-Ebene)

Sekunde 1: das Gerät im Goldlicht mit „Fensterbau Brandt“ und dem Etikett fensterbau-brandt.de. Sekunde 2: „Neue Fenster, gut geplant.“ Sekunde 3: die weiße Pille „Fenster planen“ bei 670 px. Schieltest: drei Formen (Bühne, Überschrift, Pille). Tab-Weg: Skip-Link, Schalter der Muster-Leiste, Marke, Anrufen, Fenster planen, So geht es.

## Gremium (eine Runde, blind X/Y; Urteile unter docs/profis/gremium/2026-10-26-essential-plus-*.md)

| Gruppe | Fassung | Hände | Median | Vetos | Muss-Punkte (mehrfach genannt) |
| --- | --- | --- | --- | --- | --- |
| Gestalter (G) | Y 6 : 0 | 3, 3, 3, 4, 4, 3 | 3 | keins | Muster-Ebene aus dem Kopf des Betriebs in eine eigene Leiste, weniger Chips, Chips mit Übergang; Rendering am Telefon in der Kachel; „Faltschiebewand“ läuft über; Haken und Pillen auf Weiß schwarz |
| Kunden (K) | Y 4 : 2 | 3, 4, 4, 3, 3, 2 | 3 | keins | Muster-Ebene und Platzhalter nie beim Kunden (mit Chips brechen 4 von 6 ab); Preisfrage beantworten; eeziframes als Übermittler wie in X nennen |
| Fensterbauer (F) | Y 5 : 1 | Median 3; kaufen 3, zeigen 3,5; 5 von 6 kaufen Plus | 3 | keins | „Foto folgt“ nie beim Betrieb; Schalter standardmäßig aus, fester Name; Übermittler und 30-Tage-Frist auf „Ihre Daten“; Hover nicht goldbraun; eine Namensform |

Mehrheiten je Änderung 1–12: alle behalten; „ändern“ bei 6 (alle drei Gruppen), 7 (alle drei) und 9 (G, K). Konsent nach den Regeln des Skills nicht erreicht (Median 3 in allen Gruppen), keine Faust, kein Veto; alle Muss-Punkte sind im Umbau umgesetzt.

## Detail-Profis und Abgleiche (umgesetzt: Muss; Rest als Kann-Liste)

- Bewegung (Brandner): Muss 1 kein Sprung beim Umschalten (kein bedingtes Padding mehr), Muss 2 Chips mit opacity/transform 220 ms auf, 160 ms ab, Muss 3 Hover der leisen Pille als Weiß 6 % mit Ring statt Goldbraun. Kann: Pfeilkreis-Hover, Staffelung der Chips, Leisten-Takt.
- Zeichen: Muss 1 Marke ohne Kachel in Kopf, Leiste, Fuß, Kontakt (Kachel nur als App-Symbol), Muss 2 Fortschrittsring aus den Fotoplatz-Chips, Ring in Schritt 1 1,8 px, Muss 3 Route-Hinweis als schwarzer Chip mit Koralle-Punkt, Muss 4 Maßlinien mit Hilfslinien von den Kanten, Öffnung als Punktlinie, Muss 5 Strichstärken 1,8 px (Pfeilkreis, Telefon, Blatt, Sucher). Kann: Schloss Silbergrau (umgesetzt), Punktmaß 8 px.
- UX (Hartwig): Muss 1 Fotoplätze nicht beim Kunden (nur Muster-Ebene), Muss 2 Schalter mit festem Namen und verstecktem Zusatz „Ihre Kunden sehen diese Etiketten nicht“, Muss 3 Knöpfe ohne Ziel melden „Muster: Das Ziel setzt der Betrieb“ (E-Mail als mailto), Muss 4 Nummer antippbar (Innenkarte als Link, 44 px). Kann: Doppelung Petra Brandt, „Köln“ ohne Vorlage-Attribut.
- Typografie (Roth): Muss 1 „Faltschiebe­wand“ mit Trennfuge, Muss 2 Kacheltitel am Telefon 22 px/500, Muss 3 Wortmarke 600, Versalzeile oben mit .16em, Muss 4 Nummer 250 bei 44–48 px, Muss 5 Kontakt-H2 bricht nach „Rufen Sie an,“. Kann: Zeit-Kachel-Meta (umgesetzt), Kopfzeilen mit Wert (umgesetzt).
- Abgleich Material und Licht: Hebel 1 Lichtteich eng unter dem Gerät und Kontaktschatten (umgesetzt), 2 Fotoplätze mit Lichtkante über der Textur, drei Helligkeiten, Schraffur als Band (umgesetzt), 3 Goldkern-Token ohne braune Gegen-Ecke (umgesetzt), 4 Rahmenbruch mit Lichtsaum, Kontaktschatten, Bruch nach unten am Schreibtisch (umgesetzt), 5 Innenkarte für die Nummer (umgesetzt); „5 Minuten“ in Innenkarte bleibt Kann.
- Abgleich Frontend (Lenz): Hebel 1 lazy unter der Falz (umgesetzt, 0 lazy im Hero), 2 Bildmaße (Modelle 800 px, Reihe 144 px; umgesetzt, 460 → 273 kB), 3 Trennfuge (umgesetzt), 4 Umschalten ohne Sprung (umgesetzt), 5 Backdrop-Blur nur an Leiste, Domain-Etikett, Foto-Chip und Bereit-Etikett (umgesetzt, 17 → 9 Ebenen). Pflichtliste für die Übertragung in web/ (CSP ohne Inline-Skript, Firmenfarbe je Instanz als Datei, data-vorlage-Stellen) steht im Urteil.
- Abgleich Typografie: Hebel 1 Kontaktkarte (umgesetzt), 2 Fotoplatz-Beschriftung einzeilig (umgesetzt), 3 Zeit- und Planen-Kachel (umgesetzt), 4 Wortmarke (umgesetzt), 5 Kopfzeilen mit Wert (umgesetzt); Gruppe→Gruppe 48 px bleibt Kann.

## Umbau nach dem Gremium

1. Muster-Ebene: eigene Leiste über der Seite („Muster · Essential Plus: Ihr Logo, Ihre Farbe, Ihre Texte, bis zu 6 Fotos, Ihr Seitentitel in Suchmaschinen“) mit Schalter „Zeigen, was Ihres ist“, Standard aus; vier Chips im ersten Bild (Domain, Farbe und Zeichen, Foto 1 als Bühne, Text), Chip „Ihr Logo“ entfällt (die Leiste nennt es).
2. Fotoplätze nur in der Muster-Ebene; ohne sie füllt „Alles, was Sie planen“ die Breite, das Rendering bricht unten aus der Kachel. Beim echten Betrieb entfallen leere Plätze (VORLAGE.md).
3. Kunden: „Den Preis Ihrer Fenster nennt das Angebot“ unter der Pille; „Was das Nachmessen kostet, steht im Angebot“; eeziframes als Übermittler mit 30-Tage-Frist in „Ihre Daten“; eine Namensform (GmbH nur im Fuß).
4. Marke ohne Kachel, Wortmarke mit Versalzeile oben; Kontakt mit Innenkarte, Nummer als Link, E-Mail als mailto, Wege E-Mail, Anfahrt, Website.
5. Bewegung: Chips und Rückmeldung 220/160 ms, keine Platzänderung; Hover der leisen Pille und der Rundknöpfe als Weiß 6 % mit Ring.
6. Bilder verkleinert, unter der Falz lazy, Blur nur über Bewegtem; Trennfuge in „Faltschiebewand“.

## Messwerte (werkzeuge/, Fassung Standard ohne Muster-Ebene; mit Muster-Ebene in Klammern, wenn abweichend)

| Messung | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
| --- | --- | --- |
| Pille „Fenster planen“, Oberkante | 670 px (unteres Drittel) | 450 px |
| Volle Pillen je Bildschirm | 1 | 1 |
| Laufende Animationen nach 2,6 s | 0 | 0 |
| Konsolenfehler | 0 | 0 |
| Querscrollen | nein | nein |
| Ladezeit (CPU vierfach gedrosselt) | 719 ms | |
| Layoutsprung (CLS) | 0 | |
| Weichzeichner auf Flächen | 0 (Backdrop-Ebenen 9: Leiste, Domain-Etikett, Foto-Chip, Bereit-Etikett) | |
| Lazy-Bilder in den ersten Szenen | 0 (12 unter der Falz); Bilder 273 kB | |
| Ziele unter 44 px | 0 | |
| Ruhige Fassung, ohne JavaScript | alles steht sofort | |
| Familientest | docs/profis/bilder/2026-10-26-essential-plus-familie.jpg (Startseite, Fensterbauer-Seite, Plus) | |

Farbanteile (farben.py; Gold zählt als „Foto“, Violett und Indigo kommen nicht vor, weil die Firmenfarbe den Akzent ersetzt):

| Bildschirm (Telefon) | Neutral % | Violett | Koralle | Indigo | Gold (Firmenfarbe) | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Empfang | 98,8 (S 67 · A 12 · G 12 · W 7) | 0 | 0,2 (0,3) | 0 | 1,0 | 1,2 |
| 2–3 Der Betrieb | 96,6 (S 1 · A 28 · G 8 · W 59) | 0 | 0,5 | 0 | 2,9 (2,6 / 0,9) | 3,4 |
| 4 So geht es | 98,5 (S 44 · A 40 · G 8 · W 6) | 0 | 0,1 | 0 | 1,4 | 1,5 |
| 5 Zeit und Offen | 93,4 (S 27 · A 39 · G 4 · W 23) | 0 | 0,1 | 0 | 6,6 | 6,6 |
| 6 Ihre Daten | 98,2 (S 2 · A 38 · G 8 · W 50) | 0 | 0,1 | 0 | 1,7 | 1,8 |
| 7 Bereit | 99,8 (S 3 · A 18 · G 8 · W 70) | 0 | 0 | 0 | 0,2 | 0,2 |
| 8–9 Kontakt, Fuß | 95,8 (S 63 · A 27 · G 4 · W 2) | 0 | 0 | 0 | 4,2 | 4,2 |
| Seite (Mittel) | 97,1 (S 30 · A 29 · G 7 · W 31) | 0 | 0,2 | 0 | 2,8 | 2,9 |

Schreibtisch, Mittel: Schwarz 29, Anthrazit 19, Grau 4, Weiß 44, Koralle 0,1, Gold 2,9 %. Wie bei Startseite und Fensterbauer-Seite liegt die Farbe gesamt unter den 7 % der Palette (Pixelzählung); der Eindruck gilt nach der Entscheidung des Inhabers. Kein Bildschirm über 12 %, keiner ganz ohne Farbe, Koralle nie größer als der Hauptakzent.

## Änderungstabelle für den Inhaber

| Wo | Was | Warum |
| --- | --- | --- |
| Ganz oben | Muster-Leiste mit Schalter „Zeigen, was Ihres ist“ (Standard aus) statt Schalter im Kopf des Betriebs | Muss aller drei Gruppen: Kunden sollen die Etiketten nie sehen, Fensterbauer sollen sie finden |
| Hero | Marke ohne Kachel, Wortmarke mit Versalzeile oben, Lichtteich eng unter dem Gerät, Kontaktschatten, Preis-Satz unter der Pille | Zeichen, Typografie, Material und Licht; Kunden (Kostenfrage) |
| Der Betrieb | Fotoplätze nur in der Muster-Ebene; Kachel „Alles, was Sie planen“ mit Rahmenbruch nach unten; Reihe mit Trennfuge | Kunden und Fensterbauer („Foto folgt“ nie beim Betrieb), Gestalter |
| So geht es | Titel 22/500 am Telefon, Maßlinien mit Hilfslinien, Ring 1,8 px, Zahl 5 größer | Typografie, Zeichen |
| Ihre Daten | eeziframes als Übermittler, 30-Tage-Frist, Hinweis als schwarzer Chip mit Koralle-Punkt, Haken schwarz | Kunden, Fensterbauer, Zeichen |
| Kontakt | Innenkarte mit der Nummer als Held und Link, Wege E-Mail (mailto), Anfahrt, Website, „Beschriftung — Wert“ | UX, Material und Licht, Typografie |
| Technik | Bilder 800/144 px, lazy unter der Falz, Blur nur über Bewegtem, Chips und Rückmeldung mit Übergang ohne Sprung | Frontend, Bewegung |

## Offen

- Fotos des Betriebs: sechs Prompts in essential-plus-vorschau/bilder-prompts.md; sobald der Inhaber Bilder liefert oder erzeugt, Foto 1 als Bühne und Foto 2 bis 6 ins Bento (dann auch ohne Muster-Ebene sichtbar).
- Kann-Liste der Profis (oben), nur auf Wunsch.
- Übertragung in web/ (als Vorlage der Instanzen, functions/instanz/seiten.js) nach der Pflichtliste im Frontend-Urteil; die Essential-Vorlage müsste dieselben Korrekturen bekommen (Marke, Innenkarte, Übermittler-Satz), wenn beide als Muster auf der Verkaufsseite verlinkt werden.
- Farbanteile unter den Zielwerten (Pixelzählung), Entscheidung des Inhabers wie bisher.
- Artefakt (privat): https://claude.ai/artifact/Qo299jgiGQZMsAi6pVgCzU; Bilder docs/profis/bilder/2026-10-26-essential-plus-{tel,desk,bild1,muster-tel,muster-desk,familie}.jpg.

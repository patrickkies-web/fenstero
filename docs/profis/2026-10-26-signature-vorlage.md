# Profis · Vorlage der Landingpage für das Paket EEZI Signature · 26.10.2026

Umfang: Groß (ganze Seite, zwei Zustände), nach dem Master-Anhängsel des Inhabers: Gremium eine Runde (drei Agenten blind), vier Detail-Profis parallel, Abgleich mit seinen Vorlagen in drei Perspektiven, alles umgesetzt, keine zweite Runde. Vorschau als Artifact, Quelle in docs/profis/signature-vorschau/, nichts online.

## Auftrag

- Bereich: die beispielhafte Landingpage, die ein Fensterbauer im teuersten Paket EEZI Signature (web/assets/pakete.js: 64 € im Monat, 279 € Einrichtung, netto, vorläufig) unter seiner eigenen Domain bekommt; Schwester der vorhandenen Vorlagen für Essential (https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM) und Essential Plus (https://claude.ai/artifact/Qo299jgiGQZMsAi6pVgCzU).
- Wunsch des Inhabers: „eine visuell stark ansprechende Landingpage und eine intuitive Bedienung“ als Vorlage für sein „non plus ultra Paket“; Mindestmaß die Startseite mit dem Umschalter Hauseigentümer/Fensterbauer und die beiden Vorlagen; Gestaltung nach `design-dna` und dem Begleit-Skill.
- Der Besucher (Kunde des Betriebs) soll in drei Sekunden verstehen: Fenster bei Fensterbau Brandt selbst planen, kostenlos, etwa 5 Minuten je Fenster, danach das Angebot; „Fenster planen“ antippen. Der Fensterbauer, der die Vorlage als Muster sieht, soll in fünf Sekunden sehen, was Signature gegenüber Plus bringt.
- Erfolg: Kunden tippen und fühlen sich beim Betrieb aufgehoben; Fensterbauer sehen den Unterschied und würden Signature nehmen.

## Wahl (drei Zeilen)

1. Lesart: „beispielhafte Vorlage für mein Paket“ ist dieselbe Art Vorlage wie die beiden genannten Artifacts, also die Landingpage, die der Betrieb bekommt (nicht eine Verkaufsseite auf eeziframes.com). Gleicher Beispielbetrieb Fensterbau Brandt in Gold wie auf der Verkaufsseite und in der Plus-Vorlage, damit der Fensterbauer die drei Pakete am selben Betrieb vergleicht.
2. Richtung: naheliegend auf der Plus-Vorlage aufgebaut (gleiche Hand, gleiche Szenen), die Signature-Merkmale aus pakete.js als eigene Bausteine darüber: der Umschalter „Über die Website | Mit Einladungslink“ in der Muster-Leiste (das Prinzip des Umschalters der Startseite), der Einladungszustand mit dem Namen des Kunden als schwerem Element (G15), das Glas-Etikett des persönlichen Links am Gerät (G9, G10), die schwarze Innenkarte mit dem Fortschritt aus dem Dashboard als Kapselreihe (G8, G11), der Fuß ohne eeziframes mit Team-Zugang. Mutig wäre eine zweite Bühne mit dem Dashboard als Tablet (verworfen: am Telefon höchstens ein Gerät je Bühne, und die Seite gehört dem Kunden, nicht dem Betrieb); überraschend ein Hero, der nur aus der Anrede besteht (verworfen: die Website-Besucher brauchen die Bühne).
3. Nichts erfunden: Alle gezeigten Merkmale gibt es im Produkt (Einladungslinks mit Nummer P-JJJJ-NNN und Anrede, Fortschritt eingeladen/in Bearbeitung/eingereicht, Dashboard unter /betrieb/ mit Zugängen, Kennzeichnung „keine“, Nennung als technischer Dienstleister, Aufbewahrung für die Vertragsdauer). Kein Team-Block mit Personen (das Produkt kennt einen Ansprechpartner), keine Gültigkeitstage am Link, keine Bewertungen.

## Ist und Neu

- X (Ist): die Plus-Vorlage, lokal aus dem Artifact gebaut und fotografiert (scratchpad `x/tel-01…09.png`, `x/desk-01…08.png`).
- Y (Neu): docs/profis/signature-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css aus dem Begleit-Skill, dna/bundle.css und bundle.js unverändert, start.css und start.js mit Präfix ez-, Schriften Outfit und Doto in fonts/ mit OFL, Bilder in bilder/ aus der Plus-Vorlage). Bilder: scratchpad `r3/tel-01…10.png`, `r3/desk-01…09.png`, `r3z/*` (Zustände), `bew/*` (Zeitlupe).
- Zwei Zustände (`data-modus` am Hauptelement): `website` und `einladung`; Elemente mit `ez-nur-web` und `ez-nur-einladung`. Beim echten Betrieb liefert der Server genau einen Zustand (`#k-<code>` für Einladungen), die Muster-Leiste und die Etiketten (`ez-muster`) entfallen.

## Szenen und Gene

1. Dunkel · Empfang: G4 der Konfigurator des Betriebs als Gerät im Fensterlicht, G7 Beton als Bühne (Foto 1 des Betriebs), G9 die Domain und der persönliche Link hängen als Etiketten am Gerät, G10 Glas scharf vor weicher Bühne, G2 das Leuchten trägt die Firmenfarbe, G6 eine Pille, G13 runder Anruf-Knopf, G14 Lichtkante und Vignette, G15 ein schweres Element (die Überschrift; im Einladungszustand „Familie Weber.“).
2. Hell · Der Betrieb: G8 Bento aus Fotoplätzen und Konfigurator-Kachel, G12 das Rendering ragt aus der Kachel, G10 Glas-Chips über den Fotos, G1 Schraffur heißt „Foto folgt“, G13 Pfeilkreis.
3. Dunkel · So geht es: G5 Stationen (Schritt 1 von 4), G3 die Zahl als Held (5 Minuten), G1 Schraffur heißt „noch offen“, G10 Glas-Chip mit Fortschrittsring, G9 Maße an der Zeichnung, G14.
4. Hell · Weg der Anfrage und Bereit: G5 Stationen von Ihnen bis zum Einbau, G8 die schwarze Innenkarte mit dem einen Wert (Fortschritt im Dashboard), G11 Kapselreihe (2 von 4 Fenstern), G2 Leuchten nur beim Betrieb, G1 gepunktete Linie gegen Leuchten, G6 schwarze Pille auf Weiß, G13 Zeichen in runden Feldern.
5. Dunkel · Kontakt und Fuß: G3 die Telefonnummer als Held, G2 Leuchten in der Firmenfarbe, G13 runde Wege-Knöpfe, G8 Kontaktkarte mit Innenkarte, G14 Lichtkante; kein Hinweis auf eeziframes.

## Ideenmatrix (je Szene die Gen-Fragen, verworfene Ideen in Klammern)

Empfang: Name des Kunden als Held, Link-Etikett am Gerät, Ich-Form der Geschäftsführerin, Meta-Zeile zum Link (Gültigkeitstage am Link: verworfen, nicht aus dem Produkt belegt; zweites Gerät mit Dashboard: verworfen, ein Gerät je Bühne; Dashboard-Zahl „3 Einladungen“ als Held: verworfen, die Seite gehört dem Kunden). Betrieb: wie Plus (Team-Reihe mit drei Personen: verworfen, das Produkt kennt einen Ansprechpartner). So geht es: Satz je Zustand an der 5-Minuten-Kachel. Weg: Innenkarte Fortschritt (Kapselreihe statt Prozent; Ring: verworfen, Kapseln lesen sich als „Fenster für Fenster“), „technischer Dienstleister“ statt eeziframes, Unterlagen beim Betrieb. Kontakt und Fuß: Team-Zugang als Schloss-Zeile (als Pille: verworfen, zweite Handlung).

## Änderungsliste (Y gegen X)

1. Muster-Leiste mit Umschalter „Über die Website | Mit Einladungslink“ und Schalter „Zeigen, was Ihres ist“ (am Telefon „Muster“, Segment „Website | Einladung“, runder Schalter).
2. Einladungszustand im Hero: Kicker „Persönliche Anfrage von Fensterbau Brandt“, Überschrift „Guten Tag, Familie Weber.“, Brief in der Ich-Form, Meta-Zeile „Ihr persönlicher Link“, Glas-Etikett „Für Familie Weber · Ihr Link · P-2026-001“ am Gerät.
3. Szene 4: schwarze Innenkarte „Im Dashboard von Fensterbau Brandt · In Bearbeitung · 2 von 4 Fenstern“ mit Kapselreihe und Satz zum Berater.
4. Datentexte: technischer Dienstleister, Unterlagen beim Betrieb, Dashboard an der Station des Betriebs und beim Nachmessen.
5. Fuß ohne „Konfigurator von eeziframes“, dafür „Team-Zugang“.
6. Muster-Etiketten für Signature, Etiketten der Bühne am Telefon neu gesetzt.
7. Zeit-Karte und Bereit-Karte mit einem Satz je Zustand.
8. Kontakt-Text je Zustand.
9. Bilder der Szenen 2 und 3 sofort geladen.

## Blickprotokoll der Gestaltungsleitung (Y, 390 × 844)

Website-Zustand: Sekunde 1 das Gerät im Fensterlicht mit „Fensterbau Brandt“, Sekunde 2 „Neue Fenster, gut geplant.“, Sekunde 3 die weiße Pille „Fenster planen“ bei 678 px. Einladungszustand: Sekunde 1 „Familie Weber.“ in Weiß, Sekunde 2 das Link-Etikett am Gerät, Sekunde 3 die Pille bei 702 px. Schieltest: drei Formen (Bühne, Überschrift, Pille), die Pille der hellste kleine Punkt. Tab-Weg: Skip-Link, Umschalter (2), Schalter, Logo, Anrufen, Fenster planen, So geht es, Pfeilkreis, Fenster planen (Bereit), Telefon, E-Mail.

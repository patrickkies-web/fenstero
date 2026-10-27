# Paketstufen: Essential, Plus und Signature fair abgestuft (26.10.2026, abends)

## Auftrag

- **Bereich:** die drei Vorlagen der Landingpage eines Betriebs (Essential, Plus, Signature).
- **Wunsch des Inhabers:** prüfen, ob Aufmachung und Leistung fair nach Paket abgestuft sind; 15 Fensterbauer urteilen lassen; danach
  anpassen. Ein zweiter Beispielbetrieb mit eigener Palette, je Paket eine Seite. Alle Pakete sehr ansprechend, aber wer mehr zahlt,
  soll es sehen (Anreiz zum Aufstieg). Bild-Prompts für morgen.
- **Erfolg:** Jede Vorlage zeigt genau ihr Paket (nicht mehr, nicht weniger als web/assets/pakete.js), der nächste Schritt ist sichtbar,
  und der Fensterbauer wechselt in einem Tipp zwischen den Paketen.

## Wahl in drei Zeilen

1. Eine Familie je Betrieb: drei verlinkte Seiten aus denselben Bausteinen, eine Muster-Leiste mit Paketwechsel, Preis und „Etiketten“.
2. Der Anreiz steht in den Etiketten (nur auf Wunsch eingeblendet), nicht in einer schlechteren Essential-Seite: Essential bleibt
   schön, zeigt aber ehrlich, was erst ab Plus oder Signature kommt.
3. Essential trägt keine Firmenfarbe, weil pakete.js sie dort ausschließt und 12 von 15 Fensterbauern das so wollen; Plus und Signature
   tragen die Palette des Betriebs.

## Merkmal-Abgleich gegen pakete.js (sichtbar in der Vorlage)

| Merkmal | Essential | Plus | Signature |
| --- | --- | --- | --- |
| Adresse | immer firmenname.eeziframes.com (Korrektur 27.10.) | eigene Domain | eigene Domain |
| Gestaltung | eeziframes-Violett, Initiale und Name | Logo, Firmenfarbe | Logo, Firmenfarbe |
| Fotos des Betriebs | nein (mit Etiketten: Rahmen „ab Plus: bis zu 6 Fotos“) | Bühne und Foto-Bento, bis zu 6 | wie Plus |
| Eigene Startansicht und Texte | nein, Standardtext | ja | ja |
| Hinweis auf eeziframes | deutlich (Kopf, Fuß, Daten-Satz) | eine Zeile im Fuß, Daten-Satz nennt „technischer Dienstleister“ | keiner, auch nicht im Aufmaßblatt und in E-Mails |
| Aufbewahrung | 30 Tage nach Zustellung | 30 Tage nach Zustellung | auf der Seite nicht genannt (Korrektur 27.10.) |
| Einladungslinks, Begrüßung mit Namen | nein | nein (Etikett „Erst in Signature“) | ja, Seite öffnet im Einladungszustand |
| Dashboard, Fortschritt, Zugänge | nein | nein | ja, 5 Zugänge (Vorschau mit Etiketten) |
| Preis (netto, vorläufig) | 29 € im Monat, 99 € einmalig | 39 €, 199 € | 64 €, 279 € |

Preise stehen nur in web/assets/pakete.js; der Generator liest sie dort aus.

## Gremium: 15 Fensterbauer in drei Gruppen (simuliert, eine Runde)

Urteile in docs/profis/gremium/2026-10-26-paketstufen-fensterbauer-{klein,mittel,gross}.md. Bewertet wurde der Stand vor dem Umbau.

| Gruppe | fair E / P / S | zeigen E / P / S | Hände (Median) | Vetos | Wechsel E→P · P→S |
| --- | --- | --- | --- | --- | --- |
| F1 kleine Betriebe (1–5) | 4 / 3 / 3 | 3 / 4 / 4 | 3 | Uwe: Aufbewahrung nicht nach Tabelle | 2 von 5 · 2 von 5 |
| F2 mittlere (10–30) | 3 / 3 / 4 | 2 / 4 / 4 | 3 | Klaus: Essential zeigt Begrüßung und eeziframes-Adresse | 4 von 5 · 4 von 5 |
| F3 große (40–85) | 3 / 4 / 4 | 2 / 3 / 4 | 3 | Nadine: Plus nennt eeziframes im Daten-Satz | 5 von 5 · 4 von 5 |

- **F1:** Unten und oben trägt die Abstufung, in der Mitte hängt sie durch: Plus zeigte seinen greifbarsten Vorteil, die Fotos, nicht.
- **F2:** Die Abstufung im Paket trägt, die Vorlagen zeigten sie schief: Essential mehr, als es liefert, Plus weniger.
- **F3:** Corporate Design ist Pflicht, Essential kauft hier keiner, und das ist richtig so; der Schritt Plus→Signature ist echt, war
  aber für Besucher kaum zu sehen.

Alle drei Vetos fallen mit den Änderungen 1, 2 und 6 unten. Die Hände standen vor dem Umbau bei Median 3; eine Abnahme nach dem Umbau gab
es nach der Regel „eine Runde“ nicht.

## Änderungstabelle

| Nr | Wo | Was | Warum | Stimmen | Stand |
| --- | --- | --- | --- | --- | --- |
| 1 | Essential, Bühne und Fuß | Etikett mit eigener Domain und Schloss, Fußsatz „läuft bei eeziframes“ ohne Subdomain | Paket hat eigene Domain | 15 : 0 | umgesetzt |
| 2 | Essential, Hero | Standardtext statt Begrüßung, Ansprechperson und Kontakt bleiben | Server leert die Begrüßung ohne Startansicht | 13 ja, 2 ändern | umgesetzt |
| 3 | alle, Daten-Satz | Satz nach Tabellenzeile: 30 Tage, technischer Dienstleister, Vertragsdauer | Uwes Veto | 14 ja, 1 ändern | umgesetzt |
| 4 | alle, oben | Muster-Leiste: Paketwechsel an derselben Stelle, Preis mit Einrichtung und erstem Jahr | Vergleich in einem Tipp | 13 ja, 2 ändern | umgesetzt |
| 5 | alle | „Etiketten“: grau in allen Paketen, Koralle neu im Paket, Ring erst im nächsten | Anreiz ohne schlechtere Seite | 11 ja, 4 ändern | umgesetzt |
| 6 | Plus, Daten-Satz | eeziframes nur im Fuß, im Text „technischer Dienstleister“ | Nadines Veto | 14 ja, 1 ändern | umgesetzt |
| 7 | Signature, Start | öffnet im Einladungszustand; aus einem anderen Paket kommend im Website-Zustand | Unterschied sofort sichtbar, Vergleich gleich | 10 ja, 1 ändern, 4 nein | umgesetzt |
| 8 | Plus und Signature | Foto-Bento mit 6 Plätzen auch ohne Etiketten | sichtbarster Plus-Vorteil | Muss in allen drei Gruppen | umgesetzt |
| 9 | Signature, Muster-Ebene | Vorschau Dashboard: drei Anfragen in drei Zuständen, „bis zu 5 Zugänge“ | Signature für den Betrieb zeigen | Vorschlag der Sprecher F2 und F3 | umgesetzt |
| 10 | Essential | Firmenfarbe | pakete.js schließt sie aus | 3 ja, 12 nein | nicht umgesetzt, Frage an den Inhaber |
| 10a | Signature | eigene Szene „Ihr Ansprechpartner“ mit Foto und Durchwahl | sichtbarer Vorteil für Besucher | F1 nein, F2 und F3 ja unter Bedingung | nicht gebaut: hängt daran, ob der Absender je Zugang wählbar ist (Frage 3) |
| 11 | Leiste am Telefon | Titel und Preis neben dem Schalter, Legende eigene Zeile | Pille stand bei Signature unter der Falz | Messung | umgesetzt |
| 12 | alle, Skript | Vorhang ordnet nach jeder Höhenänderung neu | mit Etiketten war die Bereit-Pille unerreichbar | Frontend-Abgleich | umgesetzt |
| 13 | Plus und Signature, Kontakt | Telefonnummer an die Kartenbreite gebunden | 12–13 Zeichen liefen in den Knopf | Frontend-Abgleich | umgesetzt |
| 14 | Signature, Wechsel | nur Überschrift, Kicker und Brief blenden; Pille steht | Pille blinkte beim ersten Tipp | Frontend-Abgleich | umgesetzt |
| 15 | Etiketten | Logo-Etikett einzeilig, Ablage-Etikett nur am Schreibtisch, Fuß-Etiketten im Fluss, Foto-Rahmen in Essential | Überdeckungen und Ausbrüche | eigene Prüfung | umgesetzt |
| 16 | Reihe der Elemente | Trennung „Falt-schiebe-wand“ | Bruch mitten im Wort | F1, F2 | umgesetzt |

## Zweiter Beispielbetrieb: Fenster Ostermann, Bremen

| Rolle | Farbe | Wert |
| --- | --- | --- |
| Hauptfarbe (ersetzt Violett als Akzent) | Petrol | #2fa792 |
| Schatten der Hauptfarbe | Tiefsee | #134540 |
| Licht der Hauptfarbe | Gischt | #62d1bc |
| Hinweis | Leuchtturmrot | #e8574a |
| Grund, Text, Flächen | wie die DNA | Schwarz, Weiß, Anthrazit, Silbergrau |

Zeichen: Bogenfenster mit Kämpfer und Pfosten. Inhaber Jonas Ostermann, Am Deich 7, 28199 Bremen, 0421 456789 (Beispieldaten).
Überschrift Plus: „Moin, neue Fenster?“ (zwei Zeilen am Telefon; „Fenster für Bremen, in Ruhe geplant.“ brach in drei und schob die
Pille aus dem ersten Bildschirm). Gebaut mit `python3 docs/profis/werkzeuge/paketvorlagen.py ostermann`; Ergebnis unter
docs/profis/paketvorlagen/ostermann/. Bild-Prompts: docs/profis/2026-10-26-paketvorlagen-bildprompts.md.

## Veröffentlicht (privat)

| Seite | Adresse |
| --- | --- |
| Essential, Fensterbau Brandt | https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM (dieselbe Adresse wie bisher) |
| Plus, Fensterbau Brandt | https://claude.ai/artifact/Qo299jgiGQZMsAi6pVgCzU (dieselbe Adresse wie bisher) |
| Signature, Fensterbau Brandt | https://claude.ai/artifact/8GL1ypE8PwgWYSwY6Dgdms |
| Fenster Ostermann, alle drei Pakete (Start Signature) | https://claude.ai/artifact/XCeRzDoQKx5bNMhoxCZVU8 |

## Messwerte (alle sechs Seiten, 26.10.2026, 22 Uhr)

| Prüfung | Ziel | Ergebnis |
| --- | --- | --- |
| Volle Pille im ersten Bildschirm, Telefon 390 × 844 | genau eine, unteres Drittel | alle sechs, oben bei 709–759 px; mit Etiketten 725–775 px |
| Laufende Animationen nach 2,6 s | 0 | 0 |
| Layoutsprung (CLS), CPU 4× gedrosselt | 0 | 0 |
| Laden bis `load`, gedrosselt | unter 1 s | 308–475 ms |
| Weichzeichner auf Flächen | 0 | 0 (nur Schlagschatten an Objekten, Glas nur über Bild) |
| Lazy-Bilder in den ersten Szenen | 0 | 0 (ein lazy-Bild, nur am Schreibtisch weiter unten) |
| Ziele unter 44 px | 0 | 0 |
| Ruhige Fassung | Endbild sofort | ja, 0 Animationen nach 150 ms |
| Ohne JavaScript | alles sichtbar | ja; Wahl und Schalter ausgeblendet |
| Erreichbarkeit jedes Links und Knopfs | alle | alle, in beiden Zuständen und mit Etiketten (außer dem gewollt versteckten Sprunglink) |
| Konsolenfehler | 0 | 0 |

## Farbtabelle (Mittel der Seite, Prozent der Fläche)

| Seite | Neutral | Violett | Koralle | Indigo | Firmenfarbe und Fotos | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| Essential, Telefon (beide Betriebe) | 96,3 | 1,1 | 0,3 | 2,1 | 0,2 | 3,7 |
| Essential, Schreibtisch | 97,5 | 0,5 | 0,1 | 1,4 | 0,5 | 2,5 |
| Plus Brandt, Telefon / Schreibtisch | 98,3 / 98,1 | 0 | 0,1 | 0 | 1,6 / 1,9 | 1,7 / 1,9 |
| Signature Brandt, Telefon / Schreibtisch | 98,2 / 97,8 | 0 | 0,1 | 0,1 / 0 | 1,7 / 2,2 | 1,8 / 2,2 |
| Plus Ostermann, Telefon / Schreibtisch | 97,8 / 97,5 | 0 | 0,1 | 0 | 2,1 / 2,4 | 2,2 / 2,5 |
| Signature Ostermann, Telefon / Schreibtisch | 97,7 / 97,3 | 0 | 0,1 | 0,1 / 0 | 2,1 / 2,6 | 2,3 / 2,7 |

Die Farbe liegt unter den etwa 7 % der DNA, wie schon bei den bisherigen Vorlagen. Die sechs Fotoplätze sind graue Platzhalter; mit
echten Fotos steigt der Anteil. Ob dann Pixelzählung oder Eindruck gilt, entscheidet der Inhaber.

## Frontend-Abgleich (Tobias Lenz), Stand der Hebel

Urteil: docs/profis/gremium/2026-10-26-signature-vorlage-vorlagen-frontend.md.

- **Umgesetzt:** Hebel 1 (Vorhang nach Höhenänderung), Hebel 2 (Telefonnummer und Kapselreihe an die Breite gebunden), Hebel 5 (beim
  Wechsel nur tauschen, was sich ändert), Etikett ohne Übergang in der ruhigen Fassung, Wahl und Schalter ohne JavaScript ausgeblendet,
  Leistengrenze rechnet die Muster-Leiste mit.
- **Offen, betrifft die echte Instanz, nicht die Vorlage:** Hebel 3 (die Instanz liefert genau einen Zustand, ohne Muster-Ebene, mit
  sauberem Kopf und `js-da.js` statt Inline-Skript) und Hebel 4 (Fotos des Betriebs in zwei Breiten mit Größengrenze in der Zentrale).
  Beides berührt functions/ und web/assets/zentrale.js und wartet auf das Wort des Inhabers.

## Paketvorschläge der Fensterbauer (nicht umgesetzt, Entscheidung des Inhabers)

| Vorschlag | Stimmen |
| --- | --- |
| Wechsel Plus → Signature: Einrichtung nur die Differenz (80 €) | 5 (F3) |
| Einladungslink im Namen des Zugangs, der ihn verschickt (Name, Rolle, Durchwahl) | 4 (F3), dazu Frage aus F2 |
| Plus: Aufbewahrung 90 statt 30 Tage, damit das Blatt bis zum Feinaufmaß reicht | 3 (F1 1, F2 2) |
| Zugänge in Signature zubuchbar, je Filiale | 3 (F3); 10 statt 5 Zugänge: 1 (F2) |
| Signature mit der Hausschrift des Betriebs | 3 (F3) |
| Signature bis 12 Fotos | 3 (F2 1, F3 2) |
| Essential mit Firmenfarbe, Logo bleibt Plus | 3 dafür, 12 dagegen |
| Fortschritt mit Status „geöffnet“ | 1 |
| Einladungslinks schon in Plus | 1 |
| Essential: eeziframes im Aufmaßblatt und in E-Mails nur im Fuß | 1 |
| Signature: nach Kündigung 90 Tage Download, dann gelöscht | 1 |

## Offene Fragen an den Inhaber

1. Essential mit Firmenfarbe? Der Auftrag nannte die Palette des Betriebs für jede Seite; pakete.js und 12 von 15 Fensterbauern sagen
   nein. Umgesetzt ist das Paket. Soll Essential die Farbe bekommen, ist es eine Zeile in pakete.js und eine im Generator.
2. Was gilt nach einer Kündigung für Anfragen und Aufmaßblätter, in allen drei Paketen?
3. Ist der Absender eines Einladungslinks je Zugang wählbar, und läuft das Dashboard am Handy vor Ort?
4. Zeigt das Dashboard „Fenster 2 von 4“ oder nur die drei Zustände (eingeladen, in Bearbeitung, eingereicht)?
5. Darf eines der sechs Fotos die Ansprechperson zeigen?

## Was echt ist und was nicht

Simuliert: alle Urteile des Gremiums und der Profis. Echt: die Messwerte oben. Beispielbetriebe, Namen, Adressen, Telefonnummern und
Dashboard-Einträge sind erfunden und als Muster gekennzeichnet. Fotos fehlen noch (Prompts liegen bereit).

## Bilder

- docs/profis/bilder/2026-10-26-paketstufen-brandt-tel.jpg, -tel-etiketten.jpg, -desk.jpg
- docs/profis/bilder/2026-10-26-paketstufen-ostermann-tel.jpg, -tel-etiketten.jpg, -desk.jpg

## Korrekturen des Inhabers, 27.10.2026

Wortlaut: „Bei essential ist die domain immer firmenname.eeziframes.com außerdem passen da manchen chips nicht. Ich will unten nicht
ausdrücklich den hinweis dass der betrieb nichts von der anfrage sieht sondern einfach unter der nutzung des eeziframes Konfigurator
und dann halt die info dass der fensterbauer das erhält sobald man das verschickt. Unterlagen für vertragsdauer lassen wir raus will
ich in keinem paket irgendwie enthalten haben. Wofür zwei personen bei großen türen den hinweis lässte weg und machst irgendwie was mit
ihre wünsche oderso“

| Wo | Was | Stand |
| --- | --- | --- |
| Essential, Bühne und Fuß | Adresse fensterbau-brandt.eeziframes.com bzw. fenster-ostermann.eeziframes.com; Etikett „Ab Plus: Ihre eigene Domain“ | umgesetzt |
| Essential, Etiketten | Bühnen-Etikett lief aus der Pille, jetzt „Ab Plus: Ihr Foto, Ihr Logo, Ihre Farbe“ einzeilig; Etikett zur Vertragsdauer entfernt; Fuß-Etikett neu; Legende ohne „in allen Paketen“; Adresse im Fuß bricht nicht mehr | umgesetzt |
| Plus | „Ihre Domain“ jetzt als „neu in Plus“ (Koralle) | umgesetzt |
| Daten-Abschnitt, alle | „Sie planen mit dem Konfigurator von eeziframes. Sobald Sie senden, bekommt <Betrieb> Ihre Anfrage mit dem Aufmaßblatt als PDF …“; Signature nennt den Betrieb statt eeziframes und einen technischen Dienstleister | umgesetzt |
| Weg der Anfrage | Satz „Bevor Sie senden, sieht … nichts davon“ gestrichen; Signature-Innenkarte ohne „Keine Maße, keine Fotos“ | umgesetzt |
| Signature | Aufbewahrung, Ablage und „griffbereit“ gestrichen, Etikett „Aufmaßblatt bleibt im Dashboard“ entfernt, Dashboard-Zeile „Aufmaßblatt per E-Mail“ | umgesetzt |
| „Das brauchen Sie“, alle | Kachel „Ihre Wünsche zu Farbe und Glas“ mit Farbpaletten-Zeichen statt „Für große Türen eine zweite Person“ | umgesetzt |

Messwerte danach: Pille im ersten Telefonbildschirm in allen sechs Seiten (709–775 px), Layoutsprung 0, Laden 578–717 ms, jedes Ziel
erreichbar, keine Konsolenfehler.

Offen, Entscheidung des Inhabers: web/assets/pakete.js sagt weiter, dass Essential eine eigene Domain hat und Signature Anfragen bis
zum Vertragsende aufbewahrt (`domain: true`, `aufbewahrung: 'vertrag'`, `pdfAblage: true`). Danach richten sich die Pakettabelle der
Website, die Datenschutztexte der Instanzen (functions/instanz/recht.js), der Löschlauf (functions/api/eingang.js) und die Prüfsuite.
Geändert habe ich nur die Vorlagen (Regel „nur der genannte Bereich“).

## Palette Fensterbau Brandt und Daten-Abschnitt, 27.10.2026

Wortlaut des Inhabers: „Richte bitte für Fensterbau Brand diese farbpalette ein: Reinweiß #FFFFFF 40 %, Eisblau #EEF7F9 25 %,
Schieferblau #233D48 15 %, Tiefes Petrol #0A6774 10 %, Aquatürkis #2AB4BD 7 %, Frisches Mint #D8F1EB 3 %. Bei der teuersten Variante soll
die gesamte seite diesen regeln entsprechen bei essential 50% also es soll sehr in die richtung gehen aber auch was über bleiben von der
farbpalette von eeziframes und bei dem günstigen soll das so bleiben von eeziframes. Ich möchte bei keinem der Pakete diesen Abschnitt
haben, dass die Daten erst noch gar nicht an den Fensterbauer gehen.“

Lesart: Signature ganz in der Palette, Plus zur Hälfte, Essential bleibt eeziframes. „Bei essential 50 %“ ist als Plus gelesen, weil
das günstigste Paket (Essential) bleiben soll, wie es ist.

**Umsetzung.** Farbdatei docs/profis/werkzeuge/farben-brandt.css, vom Generator als farben.css eingebunden. Signature: Hero und „So geht
es“ hell in Eisblau, Betrieb und Weg in Reinweiß, Schrift und dunkle Bausteine in Schieferblau, Karten für Konfigurator, Zeit, Kontakt
und das Fensterbild in Petrol, Kontaktszene in Aquatürkis mit Fuß in Schieferblau, Chips in Mint, Kacheln „Das brauchen Sie“ in Eisblau.
Der Weg der Anfrage ist am Telefon eine helle Karte, am Schreibtisch Schieferblau; nur so treffen beide Breiten die Anteile. Plus:
Karten und Flächen in Schieferblau, Konfigurator und Kontakt in Petrol, Szene „Betrieb“ in Eisblau, Leuchten in Aquatürkis; schwarzer
Grund, Silbergrau und Koralle bleiben von eeziframes. Essential unverändert.

**Farbanteile** (Kundenansicht ohne Bilder und Schriftkanten, gemessen mit palette.mjs und palette.py):

| Farbe | Ziel | Signature Telefon | Signature Schreibtisch | Plus Telefon | Plus Schreibtisch |
| --- | --- | --- | --- | --- | --- |
| Reinweiß | 40 | 41,5 | 40,2 | 20,2 | 28,3 |
| Eisblau | 25 | 23,3 | 26,5 | 12,5 | 15,2 |
| Schieferblau | 15 | 12,4 | 13,2 | 21,8 | 10,9 |
| Tiefes Petrol | 10 | 11,6 | 8,8 | 8,2 | 4,4 |
| Aquatürkis | 7 | 7,1 | 8,7 | 0,7 | 0,4 |
| Frisches Mint | 3 | 2,6 | 1,3 | 0,4 | 0,3 |
| eeziframes (Rest) | 0 in Signature | 1,5 | 1,4 | 36,2 | 40,5 |

Signature liegt in allen Farben innerhalb der Toleranz der DNA; der Rest von 1,5 % sind Schriftkanten. Plus ohne Weiß gerechnet:
Betriebspalette zu eeziframes 55 : 45 am Telefon und 44 : 56 am Schreibtisch, im Mittel halb und halb.

**Daten-Abschnitt.** In allen drei Paketen heißt die Szene jetzt „So geht es weiter“ mit dem Titel „Von Ihrer Planung bis zum Einbau.“
und dem Satz „Mit Ihrem Aufmaßblatt kann <Betrieb> gleich rechnen. Danach sind es drei Schritte bis zu Ihren neuen Fenstern.“ Gestrichen:
„Ihre Daten – vor und nach dem Senden“, „Ihre Anfrage geht nur an …“ als Titel, der Satz zum Senden und Übermitteln, in Essential die
Station „eeziframes übermittelt“, in Signature „sobald Sie senden“. Der Satz „Ihre Anfrage geht nur an …“ steht in Essential weiter unter
der Pille und in allen Paketen im Fuß.

**Nebenbei behoben.** In Signature trugen die Etiketten „Ihr Logo“, „Ihre Domain“, „Ihr Foto 1“ und „Ihr Text“ den Punkt „nur in
Signature“, obwohl sie schon in Plus stecken; jetzt grau („wie Plus“).

**Messwerte.** Pille am Telefon im ersten Bildschirm in allen sechs Seiten, Layoutsprung 0, jedes Ziel erreichbar, ruhige Fassung ohne
Animation, ohne JavaScript alles sichtbar, keine Ziele unter 44 px. Laden bei vierfach gedrosselter CPU heute 0,6 bis 1,2 s, auch bei
der fast unveränderten Essential-Seite; die Umgebung war gestern schneller (0,3 bis 0,5 s).

Bilder: docs/profis/bilder/2026-10-27-brandt-palette-stufen-tel.jpg, -signature-tel.jpg, -signature-desk.jpg, -plus-tel.jpg.

## Schmale Leiste, 27.10.2026

Wortlaut des Inhabers: „Ich hätte gerne, dass der Header ab dem Zeitpunkt, wo er sich jetzt entfernt, sich einfach nur verschmälert.
D.h. dass der Header nicht zu sehen ist, bis auf diesen Knopf jetzt planen.“

Umsetzung in allen drei Vorlagen und beiden Betrieben: dritter Zustand der Leiste `ist-schmal`. Beim Herunterscrollen jenseits des
Seitenkopfs zieht sich die Leiste über einen Zuschnitt auf die Pille „Fenster planen“ zusammen, das Logo blendet aus; beim Hochscrollen
kommt sie ganz zurück, am Seitenanfang ist sie weg. Die Pille bleibt eine leise Pille auf Glas, damit je Bildschirm genau eine volle
Pille bleibt. Bei Brandt (Plus und Signature) ist das Glas Schieferblau. Geprüft: Zustände beim Herunter- und Hochscrollen, Zeitlupe
(docs/profis/bilder/2026-10-27-leiste-schmal.png), Treffer neben dem Knopf gehen an die Seite, ruhige Fassung ohne Bewegung, keine
laufende Animation nach dem Laden, Layoutsprung 0, keine Konsolenfehler.

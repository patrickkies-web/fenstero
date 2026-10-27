# Gremium Gestalter (Gruppe G), Konfigurator Schritt 6 „Wünsche“, 27.10.2026

Grundlage: der Brief, beide Übersichten und alle 20 Einzelbilder (390 × 844), dazu als Maßstab die Untergrenze (konfigurator-raender-bis-ende-tel, startseite-dna-*). Für die Angaben zur Bewegung und Technik habe ich nur gelesen, nichts geändert: wuensche.css und wuensche.js.

Zur Blindheit: Die Änderungsliste beschreibt Y genau (Kapitelband, Chip, Rundknöpfe). Y ist also als Vorschlag erkennbar, X ist die App. Bewertet wurden trotzdem nur die Bilder.

---

### Jonas Veit, 44, Art Director
**Blicke auf 01:**
- X: Bühne, dann Werkzeugknöpfe, dann das grüne „Form?“.
- Y: Fenster, dann Titel, dann die gewählte Kachel „Rechteck“.

**Schieltest:** In X ist der Held da, aber Pille und Bühne sind gleich hell, und drei dunkle Knöpfe stören. In Y sind die drei Formen sauber.

**Besser: Y.** Die randlose Bühne wirkt wie ein Foto. Die Kachel hat Material: Anthrazit, Glanzkante, violettes Licht unten. Das ist eine eigene Idee, die man wiedererkennt. X ist eine Werkzeugleiste mit Fenster.

**Stimmen:**
1. ändern: randlos ja, die Werkzeuge leise unten rechts zurück
2. behalten
3. ändern: Grau ans Satzende
4. ändern: auf 09 die Materialtupfen zurück, sonst stehen da vier gleiche Wörter
5. behalten
6. behalten

**Hand:** 4
- Muss: Flügelmarkierung im Modell auf 03 in Violett #897efc statt Grün.
- Kann: das Bühnenbild je Frage auf den Gegenstand zuschneiden, wie auf 07 beim Griff.
- Veto: keins.

### Lena Hartwig, 38, UX-Research und Barrierefreiheit
**Blicke auf 01:**
- X: Bühne, dann Reiterleiste, dann Pille. Die fünf Formsymbole ohne Wort überspringe ich.
- Y: Fenster, dann Chip „Schritt 6 von 6“, dann Titel.

**Schieltest:** beide bestanden.

**Besser: Y.** Jede Option hat Wort und Unterzeile, in drei Sekunden klar. Aber drei Zähler stehen übereinander: „Schritt 6 von 6“, „2 von 7“, „1 von 11“. „6 von 6“ liest sich wie „fast fertig“.

**Stimmen:**
1. ändern: Chip ohne „von 6“
2. ändern: Das Band ist ein Knopf, sieht aber nicht so aus. Ein Pfeil ⌄ 12 px daneben.
3. ändern: „Üblich“ braucht 44 px Trefferfläche, die Notiz-Beschriftung mindestens 12 px.
4. ändern: i in den Zellen 28 px auf 44 px Trefferfläche. „Weiß ich noch nicht“ liegt auf 04 und 08 unter der Falz, damit ist der Fehlerweg versteckt.
5. ändern: Fuß an fester Stelle.
6. behalten: Die reduzierte Bewegung schaltet die Übergänge ab.

Kontrast Silbergrau auf Schwarz: 8:1, gut.

**Hand:** 3
- Muss: ein Zähler weniger.
- Kann: –
- Veto: keins.

### Noah Brandner, 31, Motion
**Blicke auf 01:**
- X: zuerst die drei dunklen Werkzeugknöpfe (stärkster Kontrast auf Beige), dann Fenster, dann Pille.
- Y: Fenster, dann Titel, dann die gewählte Kachel.

**Schieltest:** X hat die drei Formen plus drei Störer, Y nur die drei Formen.

**Besser: Y.** Die Bewegung erzählt etwas. Die Kachel gibt beim Antippen sofort nach (Skalierung 0,97, ohne Verzögerung). Ring und Licht kommen in 150 bis 220 ms, das Modell blendet in 220 ms um, die Bühne steht. Die Antwort zeigt sich am Gegenstand, nicht am Rahmen. Ruhige Fassung: Übergänge aus, das Bild wechselt hart. Das ist richtig.

**Stimmen:**
1. ändern: Werkzeuge zurück, ohne Auftritt-Animation
2. behalten
3. behalten
4. behalten
5. ändern
6. behalten: Bei schnellem Antippen nur das letzte Bild blenden, nicht stapeln.

Was mich stört, ist keine Animation: Die Pille springt zwischen den Fragen um bis zu 90 px (y 800 → 710). Das ist Bewegung ohne Bedeutung.

**Hand:** 4
- Muss: Pille an fester Stelle.
- Kann: Der Kapitelpunkt gleitet beim Kapitelwechsel 220 ms.
- Veto: keins.

### Tobias Lenz, 35, Frontend
**Blicke auf 01:**
- X: Fenster, dann Zoomknöpfe, dann Pille.
- Y: Fenster, dann Chip, dann Pille.

**Schieltest:** beide bestanden.

**Besser: heute X**, wegen der Regel „Funktionen der App bleiben“. In Y fehlen Drehen, Zoom, das 1:1 am Griff und das Zahnrad. Auf 06 fehlen die Sprossen-Regler im Modell, obwohl der Text „an den Reglern verschieben“ sagt.

Technisch ist Y sauber: kein backdrop-filter, Kacheln nur als Verlauf, Bildwechsel über decode() und Opazität, das nächste Bild vorgeladen. Das trägt ein Mittelklasse-Android.

Layoutsprung: Der Fuß ist sticky in einem zu kurzen Container. Auf 03, 09 und 10 steht die Pille 70 bis 90 px höher.

**Stimmen:**
1. ändern: Live-Modell und Werkzeuge bleiben
2. behalten: öffnet den Kapitelbogen, die Funktion bleibt
3. behalten
4. ändern: „Aufteilung“ liegt auf 02 unter der Falz
5. ändern: min-height: 100svh
6. behalten

**Hand:** 2
- Muss: Werkzeuge und Regler zurück.
- Kann: –
- Veto: gegen Änderung 1, solange Werkzeuge und Regler fehlen.

### Mara Keller, 40, Conversion
**Blicke auf 01:**
- X: Fenster, dann grünes „Form?“, dann Pille.
- Y: Fenster, dann Titel, dann Pille. Der schwarze Pfeilkreis zieht das Auge.

**Schieltest:** Y ist klar. In X konkurrieren zwei gleich helle Flächen.

**Besser: Y.** Y wirkt wie ein Produkt, dem ich mein Haus anvertraue, X wie ein Formularwerkzeug.

**Abbruchstellen in Y:**
- (a) „Schritt 6 von 6“ verspricht das Ende, dann kommen elf Fragen.
- (b) „Weiß ich noch nicht“ ist auf 04 und 08 unsichtbar. Gerade wer unsicher ist, braucht diesen Ausweg.
- (c) „Vertrag widerrufen“ steht auf 03, 09 und 10 direkt unter der Pille, also im Moment der Entscheidung.

**Stimmen:**
1. ändern: wegen (a)
2. behalten
3. ändern: Der Notiz-Knopf auf 10 fällt weg, das Feld ist dort schon die Notiz.
4. ändern: wegen (b)
5. ändern: wegen (c), Pille an fester Stelle
6. behalten

**Hand:** 4
- Muss: (a) bis (c).
- Kann: „Noch offen“ auf 05 als gewählt zeigen (violetter Punkt). Dann ist klar, dass „Weiter“ auch ohne Wahl geht.
- Veto: keins.

### Daniel Roth, 52, Typograf
**Blicke auf 01:**
- X: zuerst die gesperrte grüne Versalzeile „AUFBAU · 1 VON 11“, dann Titel, dann Pille.
- Y: Titel, dann Fenster, dann Kachel.

**Schieltest:** Y bestanden. In X kämpft die Versalzeile mit dem Titel.

**Besser: Y.** 28 px, Gewicht 500, −0,025 em, eine Schrift in zwei Stimmen: Das ist die Familie der Aufmaß-Folien. X ist fett, grün und in gesperrten Versalien gesetzt, das ist Vorlagenoptik eines Baukastens.

Aber Y setzt das Grau mechanisch auf das Wort, das in der App grün war. Dadurch steht in „Sonnenschutz außen?“ und „Fensterbank innen?“ das Schlüsselwort grau am Satzanfang. Die Familie setzt das Grau ans Ende („Höhe links.“, „Dein Aufmaß steht.“).

Zur Ehrlichkeit: 06 nennt Regler, die es nicht gibt.

**Stimmen:**
1. ändern: Chip-Text
2. behalten
3. ändern: Grau ans Ende
4. behalten
5. behalten
6. behalten

**Hand:** 4
- Muss: die Grauregel.
- Kann: Zähler und mm-Werte mit tabular-nums.
- Veto: keins.

---

## Sprecher Gestalter

**Gewinner: Y (Vorschlag), 5 : 1.** Für Y stimmen Jonas, Lena, Noah, Mara und Daniel. Tobias stimmt für X, solange die Werkzeuge fehlen; mit Korrektur K1 geht er zu Y. X verstößt außerdem gegen die Palette: grüner Akzent in Fortschrittsbalken, Titelwort und Versalzeile.

**Mehrheiten je Änderung**

| Nr. | Änderung | behalten | ändern | zurück | Ergebnis |
|---|---|---|---|---|---|
| 1 | Bühne randlos, ohne Werkzeuge, Chips | 0 | 6 | 0 | ändern: randlos bleibt; Werkzeuge, Regler und Chip-Text korrigieren |
| 2 | Kapitelband | 5 | 1 | 0 | behalten, Pfeil als Kann |
| 3 | Frage-Zeile, Titel, Rundknöpfe | 2 | 4 | 0 | ändern: Grauregel, Trefferflächen, Notiz auf 10 |
| 4 | Antworten | 2 | 4 | 0 | ändern: „Weiß ich noch nicht“ über die Falz, i 44 px, Tupfen auf 09 |
| 5 | Fuß | 2 | 4 | 0 | ändern: Form bleibt einstimmig, die Lage wird fest |
| 6 | Überblendung 220 ms | 6 | 0 | 0 | behalten |

**Median der Hand: 4** (Werte 2, 3, 4, 4, 4, 4).

**Vetos: 1.** Tobias legt ein Veto gegen Änderung 1 ein, solange Werkzeuge und Sprossen-Regler fehlen. K1 löst es auf.

### Fünf Korrekturen, nach Wirkung geordnet

**K1. Funktionen zurück (löst das Veto).**
- Die Bühne bleibt randlos, 390 × 272 px, untere Ecken 24 px, mit dem Live-Modell der App.
- Unten rechts eine Werkzeuggruppe wie auf der Folie „Dein Aufmaß steht.“: Zahnrad, −, + und auf der Griff-Frage zusätzlich 1:1.
- Maße der Werkzeugknöpfe: je 40 px sichtbar, 44 px Trefferfläche, 8 px Abstand, 12 px vom rechten und unteren Rand.
- Aussehen der Werkzeugknöpfe: Fläche Anthrazit #202022 mit Glanzkante `inset 0 1px 0 rgba(255,255,255,.16)`, Symbol Weiß 18 px, ohne Auftrittsanimation.
- „Zum Drehen ziehen“ steht als Hinweis-Chip unten links bis zur ersten Drehung, danach der fachliche Chip. Der Chip wird höchstens 205 px breit und überschneidet sich so nicht mit den Werkzeugen.
- 06: Sprossen-Regler im Modell zurück. Schiene Silbergrau #a8a4a9 1,5 px, Griffpunkt 20 px Weiß, Trefferfläche 44 px.
- 03: Flügelmarkierung Violett #897efc 2 px statt Grün.

**K2. Pille an fester Stelle (Konstante des Inhabers).**
- Die Wünsche-Folie wird eine Spalte mit `min-height: 100svh`. Der Fuß bekommt `margin-top: auto` und `position: sticky; bottom: 0`.
- Pille 52 px hoch, Mitte immer bei y = 800 auf 844, Unterkante 18 px + `env(safe-area-inset-bottom)`.
- Zurück rund 52 px, 10 px Abstand zur Pille.
- Verlauf über dem Fuß 24 px, von transparent zu Schwarz #07090a. Der Inhalt bekommt `padding-bottom: 104px`.
- „Vertrag widerrufen“, Impressum, Datenschutz und AGB stehen erst unter der Falz, nie im ersten Bild unter der Pille. Heute springt die Pille auf 03, 06, 09 und 10 zwischen 710 und 800.

**K3. Zähler entwirren.**
- Chip oben links: „Schritt 6 · Wünsche“ statt „Schritt 6 von 6“. Der Ring zeigt den Anteil der beantworteten Fragen, Violett #897efc auf einer Spur aus Silbergrau #a8a4a9 zu 40 %.
- Kleine Zeile: „Frage 1 von 11“ statt „Aufbau · 1 von 11“, 12 px Silbergrau. Das Kapitel steht schon im Band.
- Das Band behält „2 von 7“ und bekommt rechts einen Pfeil ⌄ 12 px in Silbergrau, damit man den Kapitelbogen findet.

**K4. Antworten und Ausweg über der Falz.**
- Ab fünf Optionen drei Spalten: Kachel 114 × 92 px (16 px Rand, 8 px Abstand), Strichzeichnung 28 px, Beschriftung 14 px/500, Unterzeile 12 px Silbergrau.
- Bis vier Optionen zwei Spalten mit 175 × 88 px.
- Damit steht „Weiß ich noch nicht“ (Zeile 56 px) auf 04 und 08 über der Pille. Auf 02 ragt die weiße Karte „Aufteilung“ dann mit Überschrift und Werten etwa 46 px über den Verlauf.
- i in den Listenzellen: 28 px auf 32 px sichtbar, Trefferfläche 44 px.
- 09: Materialtupfen 14 px vor Werzalit, Naturstein und Holz zurück, wie in der App.

**K5. Titel und Frage-Zeile.**
- Die zweite Stimme in Silbergrau #a8a4a9 steht immer am Satzende:
  - 03 „Wie öffnet | Flügel 1?“
  - 05 „Welche Farbe | außen?“
  - 08 „Sonnenschutz | außen?“
  - 09 „Fensterbank | innen?“

  Der Teil nach dem Strich ist grau.
- Der Titel bleibt 28 px/500/−0,025 em in Weiß.
- „Üblich“ bleibt ein Indigo-Chip #3c3a66, 28 px hoch sichtbar, mit 44 px Trefferfläche.
- Notiz-Rundknopf 44 px, Beschriftung mindestens 12 px. Auf Frage 10 fällt er weg, weil das Textfeld dort schon die Notiz ist.

Es wurden keine Dateien geändert, nichts gebaut und keine git-Befehle ausgeführt.

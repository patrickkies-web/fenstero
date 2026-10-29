# Designrichtung eeziframes

Stand 23.10.2026, zweiter Durchgang. Abgeleitet aus 21 Vorbildern des Inhabers, gelesen von zwölf Rollen (Analyse in vorbilder.md,
Rollen in rollen.md), und aus der bisherigen Gestaltung. Gilt für alles Sichtbare auf den Verkaufsflächen (Startseite, Seite für
Fensterbauer, Köpfe der Ratgeber); für die Ansicht der Hauseigentümer gilt zusätzlich 3.9. Die App bleibt bei der strengen Fassung aus
docs/GESTALTUNG.md. Diese Richtung sagt nur, wie etwas aussehen soll; was gebaut wird und wo, bestimmt allein der Inhaber (SKILL.md,
Abschnitt 1). Für Verkaufsflächen erweitert sie docs/GESTALTUNG.md um Licht mit Quelle, Glas über Bildern, Schatten unter Schwebendem
(3.1), Ebenen-Parallaxe und Kapitelanzeige (3.5); GESTALTUNG.md schließt Parallaxe und Lesefortschritt noch aus, wer eines davon baut,
zieht die Doku dort nach. Vorschläge, die docs/GESTALTUNG.md, Inhalte oder Bilder ändern würden, stehen in 2.2 und brauchen sein Ja.

## 1. Leitsatz

**Ruhig wie Apple, präzise wie ein Aufmaß, mit Licht und Tiefe wie in einer Raumstation.**

1. **Ruhige, dunkle Bühne.** Viel Unbunt, viel Luft, kurze Sätze, eine Handlung je Bildschirm.
2. **Ein Held je Bildschirm.** Ein großes Motiv trägt den Bildschirm, alles andere ordnet sich unter.
3. **Licht und Tiefe statt Flächen.** Ebenen hintereinander, Licht aus einer Quelle im Bild, und etwas bricht aus seinem Rahmen.
4. **Präzision im Detail.** Maßlinien, Messraster, Ziffern in Reih und Glied, sauber bis auf den Pixel.
5. **Erst verstehen, dann erleben.** Der erste Bildschirm sagt im Klartext, was es ist, und zeigt die eine Handlung; Szenen und Tiefe
   folgen darunter. Die Vorbilder sind kurz, aber selten klar. Wir wollen beides.
6. **Eigene Zeichen vor Trends.** Maßlinie, Messband, Aufmaßblatt und die Figur mit dem gelben Zollstock im Fensterlicht machen uns ohne
   Logo erkennbar. Trends wie Glas, Pillen und schwebende Dinge nur sparsam (3.8).

**Apple-ähnlich heißt für uns** ein Prinzip, keine Oberfläche: Das Produkt ist der Held, groß und mit Licht modelliert; ein Gedanke je
Bildschirm; kurze, fette Überschrift, grauer Lesetext mit hellen Schlüsselwörtern; Szenen, die am Scrollen hängen; Fakten als Kacheln;
langsame, weiche Auftritte; eine klare Handlung; und Zeichen, die über Jahre gleich bleiben.

## 2. Entscheidungen

### 2.1 Wo die Rollen sich widersprechen

| Spannung | Entscheidung |
|---|---|
| Riesenwort: Art Director, Bewegung und Typograf mögen es leise; Fensterbauer, Hauseigentümerin, Marke und Layouter finden es unlesbar, trendig oder zu groß | Kein Standard mehr. Nur auf ausdrücklichen Wunsch des Inhabers, dann nach 3.2 |
| Szene oder Klartext: Szenen wirken, Einstiege ohne Handlung schrecken Kunden ab | Erster Bildschirm im Klartext mit Pille und Beweis, Szenen ab dem zweiten (3.3) |
| Tiefe oder Ladezeit: Echtzeit-3-D wirkt, kostet aber 3 bis 20 MB, Wärme und Akku | Tiefe aus Freistellern, Ebenen und Licht; Stufe 2 nur nachgeladen, nie als Einstieg (3.6) |
| Zahlen: Sechs Vorbilder beweisen mit Zahlen, verstanden werden zwei; Hochzählen zeigt unterwegs falsche Werte | Eine Zahl nur mit Einheit, Bezug und Quelle; der Endwert steht immer (3.2, 3.5) |
| Menschen: Fensterbauer und Hauseigentümerin wollen Gesichter, die Vorbilder zeigen Schaumuster | Belege nur von echten Menschen; Szenen mit Menschen sind Bildwelt, kein Beleg; der Inhaber selbst ist echt (3.4, 2.2) |
| Glas: Liquid Glass begeistert; Glas ist der Trend von iOS 26, über hellen Bildstellen unlesbar und über Bewegtem teuer | Einmal je Seite, nur über Standbildern, 70 bis 75 % deckend, Dicke nur durch die Lichtkante (3.1) |
| Dunkel oder hell: Kunden trauen hellen Seiten, Fenster heißen Licht; die Marke ist dunkel | Die Oberfläche bleibt dunkel, das Tageslicht kommt durchs Fenster im Bild; Konfiguratoren unter fremder Marke siehe 2.2 |
| Mikrotexte in den Ecken: für den Art Director präzise, für Kunden Kleingedrucktes | Entfällt; Beschriftung nur, wo sie zum Inhalt gehört (Maß, Dateiname) |
| Feste Scroll-Bühne: erzählt, lässt die Seite aber hängen | Höchstens 1,5 Bildschirmhöhen mit sichtbarem Fortschritt, nie in der Ansicht für Hauseigentümer (3.5) |
| Seitwärts: Die Vorbilder bewegen nur Schrift seitwärts, nie den Helden | Seitwärts nur beim Wischen; die Leisten bleiben als Wunsch des Inhabers, mit Halt-Knopf (3.5) |
| Zweiter Satz der Überschrift blasser (Typograf) gegen den Mindestkontrast der Überschrift (Kontrast) | In #c9c8c3 (10,8:1), nicht in #93928d |

### 2.2 Offene Fragen an den Inhaber

Vorschläge der Rollen, die docs/GESTALTUNG.md, Inhalte oder Bilder ändern würden. Bis zu seinem Ja gilt der heutige Stand.

1. Überschrift im Startbild am Telefon 40 statt 32 px (Typograf, Layouter: Telefon-Vorbilder 42 bis 64 px).
2. Rand am Telefon 20 statt 16 px (Layouter: Vorbilder im Mittel 5,1 % der Breite).
3. Eine Linienfarbe mit 3:1 für Eingabefelder und Ring-Knöpfe, heute 1,45:1 und 1,59:1 (Kontrast, WCAG 1.4.11).
4. Grüne Wörter nur im Startbild und höchstens zwei weitere je Seite statt in jeder Überschrift (Marke).
5. Der Pfeil im Kreis wird ein Maßpfeil mit Endstrich, als eigenes Zeichen (Marke).
6. Einführungspreis mit Tageszähler: Für Hauseigentümer ist er Druck „wie an der Haustür“ (Hauseigentümerin).
7. KI-Menschen in Szenen wie dem Familienfoto behalten oder nur Figuren zeigen (Marke rät ab).
8. Feste Besetzung der Figuren: Astronaut für Betriebe, Waschbär für Hauseigentümer, Bär für die Montage (Marke). Den Waschbären nicht
   von außen am offenen Fenster zeigen, das wirkt wie ein Einbrecher (Hauseigentümerin).
9. Der Inhaber mit Foto, Name, Ort und Telefon auf den Seiten (Fensterbauer, Hauseigentümerin).
10. Konfiguratoren unter fremder Marke: immer dunkel oder auch hell, und eine einzige Signatur wie „Aufmaß mit eeziframes“ (Marke).
11. Die Leisten als Laufband behalten (mit Halt-Knopf) oder als Reihe zum Wischen wie bei 21 bauen (Animationsregisseur, Kontrast).

## 3. Die Richtung im Einzelnen

### 3.1 Farbe und Licht

- **Die Tokens bleiben.** Grund #161616, Flächen #1f1f1f und #262626, Text #f3f2ee, Cream für die Hauptaktion, Grün als einziges Signal.
  Neue Farben gibt es nicht.
- **Unbunt mit einem Signal, nie eine Tonwelt.** Von den zwei Farbfamilien der Vorbilder gehören wir zur unbunten (vorbilder.md, 2).
  Farbe kommt aus dem Motiv, nicht aus der Oberfläche; Grün bleibt klein, zusammen etwa 1 % der Fläche.
- **Anteile je Bildschirm** (farbanteil.py): mindestens 80 % unbunt, kräftige Farbe höchstens 5 %, farbig über 0,3 %; Bild, Licht oder
  Signal müssen da sein. Ausnahmen: große Fotos und eine bewusste Markengeste je Seite.
- **Low-key.** Der erste Bildschirm mit Heldbild ist zu 60 bis 85 % dunkel; hell sind nur Überschrift, Cream-Pille und die Lichtquelle
  im Bild, zusammen höchstens 8 %. Draußen in der Sonne wird die dunkle Hälfte schwarz: Die Bildaussage gehört in den hellen Teil (L*
  ab 60).
- **Eine Cream-Fläche je Bildschirm** (docs/GESTALTUNG.md) gilt streng: keine Cream-Leiste und kein Cream-Band im selben Bildschirm wie
  die Cream-Pille.
- **Eine Lichtfarbe: Cream.** Licht ist ein Verlauf mit einer Quelle im Bild (Fenster, Bullauge, Bildschirm), radial und weich, 8 bis
  20 % Deckkraft, nur in Cream. Grün leuchtet nur klein als Signal (ein Punkt), Blau nie, es ist Zeichnungsfarbe. Ein Verlauf ohne
  Quelle bleibt verboten. Dunkle Bühnen bauen Tiefe mit Licht, nicht mit Schatten: hinter dem Helden ein Halo, Cream 10 bis 14 %, 1,2-
  bis 1,5-mal so breit wie das Motiv, zur Quelle hin versetzt.
- **Farbbrücke.** Spitzlichter in Fotos warm-neutral (4800 bis 5800 K), nie bläulich: Dann steht die Pille (#f1f0ea, neutral) im selben
  Licht wie das Bild, so wie in 15 der Knopf im Blau des Vogels.
- **Bedeutungsfarben.** Orange und Blau bleiben Zeichnungsfarben in technischen Darstellungen; nie als Fläche, nie als Licht, nie als
  Farbe einer fremden Marke.
- **Glas** einmal je Seite, nur über Standbildern, nie über Video, Bewegtem oder anderem Glas, höchstens ein Viertel des Bildschirms,
  nie über Gesicht, Händen, Werkzeug oder Details im Bild: #1f1f1f mit 70 bis 75 % Deckkraft, Weichzeichner 20 bis 24 px, Sättigung
  140 %, oben eine Lichtkante (1 px, Weiß 10 %), Schatten `--float`. Schrift darauf nach 3.7. Die Lichtbrechung von Liquid Glass bauen
  wir nicht nach. Ohne `backdrop-filter` und bei `prefers-reduced-transparency` deckend.
- **Schatten** wirft nur, was schwebt: Glas, gedrehte Karten, Geräte. Was schwebt, trägt zur Quelle hin eine Lichtkante (1 px, Weiß
  10 %).
- **Textur.** Messraster wie Millimeterpapier (fein alle 8 px, kräftig alle 40 px, Weiß 3 bis 5 %) in technischen Abschnitten; Korn mit
  2 bis 3 % in großen Lichtflächen.

### 3.2 Schrift

- **Inter und die Größen bleiben:** 13, 15, 17, 24 und 40, am Telefon 32. Keine Antiqua, Display-, Schreib- oder Pixelschrift, keine
  leichten Titel in 200 bis 400.
- **Eine Displaygröße je Bildschirm.** Darunter Lesetext in 17, was direkt an der Displaygröße hängt (Kicker, Einheit, Label), in 13. So
  wird der Sprung groß (32 : 13 = 2,5) ohne neue Größe; die Vorbilder liegen bei 2,7 bis 4,5, wir heute bei 1,9.
- **Bühnenstimme.** Überschriften in Inter 800, höchstens sechs Wörter und im Klartext: Sie sagen, was es ist, nie nur eine Stimmung oder
  einen Namen. Am Telefon höchstens drei Zeilen und 23 Zeichen je Zeile; Stapel aus zwei bis drei Zeilen mit je ein bis drei Wörtern
  wirken am stärksten. Höchstens ein grünes Wort. Ein zweiter Satz darf gleich groß in #c9c8c3 stehen (Ton statt Größe, wie 6 und 10);
  das grüne Wort steht dann im ersten. Schlusspunkt einheitlich auf allen Seiten.
- **Laufweite und Zeilenabstand.** 40 px −0,04 em, 32 px −0,03 em, 24 px −0,02 em, Lesetext 0. Zeilenabstand: Überschrift 1,0 bis 1,05;
  fette Titel, Fragen und Kartennamen 1,25 bis 1,3; Lesetext 1,45 bis 1,5.
- **Technikstimme.** Kicker und Versalzeilen wie in docs/GESTALTUNG.md: 13 px, Inter 800, gesperrt 0,18 em, höchstens 30 Zeichen,
  einzeilig. Ziffern, Maße („1.230 × 1.480 mm“), Dateinamen und Zeitangaben in 13 px, Inter 600, gesperrt 0,02 em; gleich breite
  Ziffern (`tabular-nums`) nur in Spalten und Zählern. Eine Nummernstimme je Bildschirm: Abschnitt und Karte tragen nie gleich gesetzte
  Nummern.
- **Lesetext wie bei Apple.** 17 px in `--text2`, das Entscheidende darin in `--text` und fett, höchstens eine Hervorhebung je Block und
  nie über einen Zeilenumbruch. 35 bis 60 Zeichen je Zeile, Textspalte mindestens 300 px, höchstens drei Zeilen je Block auf
  Verkaufsflächen; Längeres gehört in Ratgeber und Fragen. Kein Lesetext in Versalien. Text über Bildern nur über einer ruhigen Zone.
- **Umbruch.** Kein einzelnes Wort in der letzten Zeile (`text-wrap: pretty` für Lesetext und Kartentitel, `balance` für Überschriften).
  Geschützter Bindestrich (U+2011) in „Fenster‑Konfigurator“, „E‑Mail“, „3‑D“; schmales geschütztes Leerzeichen (U+202F) zwischen Zahl
  und %, €, mm, §; Domains ohne Umbruch. Silbentrennung nur in Spalten unter 38 Zeichen.
- **Zahl als Held.** 40 px, am Telefon 32, in 800; die Einheit in 15 px und `--text2` direkt daneben, nicht in `--muted`: Die Einheit
  gehört zur Aussage. Eine Zahl braucht Einheit, Bezug („97.482 offene Stellen“, nicht „−42“) und eine Quelle oder die
  Paketbedingungen; jede Zahl steht überall gleich.
- **Knöpfe** sprechen mit Verb („Pakete ansehen“), nie leer („Learn more“, „Our Solutions“).
- **Riesenwort** nur auf ausdrücklichen Wunsch des Inhabers (2.1). Dann ein Wort aus der Welt des Aufmaßes als SVG-Pfad aus Inter 800 mit
  `aria-hidden` (kein SVG-Text, die Prüfsuite misst jede Schrift), Versalhöhe 10 bis 20 % der Breite, #262626 auf #161616 (1,20:1),
  vom Motiv zu 15 bis 35 % verdeckt, der Anfang frei, nie in der Ansicht für Hauseigentümer.

### 3.3 Raum und Proportionen

- **Raster.** Am Schreibtisch 12 Spalten à 64 px mit 24 px Abstand (1032 px, Rand 124 px bei 1280, 44 px bei 1024), nur die Teilungen
  6+6, 4+4+4, 7+5 und 8+4. Am Telefon eine Spalte; Rand heute 16 px (20 px siehe 2.2).
- **Der erste Bildschirm** am Telefon (390 × 844, ohne Scrollen): Kicker, Überschrift, ein Satz, die Cream-Pille und ein Beweis aus
  echtem Material. Oberkante der Pille bei 460 bis 600 px, weil Status- und Browserleiste am echten Telefon rund 140 px verdecken; über
  dem Bild höchstens 124 px (Kopf und Brotkrumen). Was nicht hineinpasst (Brotkrumen, „Kurz gesagt“), steht unter den Knöpfen. Keine
  bildschirmfüllende Szene als Einstieg.
- **Startbild am Schreibtisch.** Text über fünf Spalten (416 px), Mitte der Überschrift bei 304 bis 360 px Höhe, Einleitung höchstens 25
  Wörter; das Motiv mit seiner Mitte bei x 704 bis 832 und y 352 bis 408, angeschnitten bis zum Fensterrand.
- **Ein Held je Bildschirm** mit 30 bis 55 % der Fläche; höchstens zwei reine Textbildschirme hintereinander.
- **Dichte.** Am Telefon höchstens 60 Wörter und 25 % Textfläche je Bildschirm, am Schreibtisch höchstens 120 Wörter. Ruhige Fläche 45
  bis 65 %; über 70 % ist zu leer.
- **Ebenen,** von hinten nach vorn: Grund, Halo, Held, Glas, Licht und Staub. Je Seite bricht mindestens einmal etwas aus seinem Rahmen:
  eine Figur über die Bildkante, eine Karte über die Abschnittsgrenze, ein Objekt aus seiner Karte (17). Unschärfe zeigt Tiefe und wird
  ins Bild gerechnet.
- **Figur als Held** (1, 11, 15, 19): nah, als Brustbild, Augenlinie bei 20 bis 40 % der Bühnenhöhe, unten 15 bis 20 % in den Grund
  ausgeblendet. Karten am Rand oder dahinter; Glas nur über dem unteren Drittel und nie über Gesicht, Händen, Werkzeug oder
  Schwebeteilen, auch am Telefon geprüft.
- **Fenster als Held:** das Fenster aus dem Konfigurator nach 3.4, eingebaut mit Kontaktschatten, viel Luft.
- **Kanten.** Höchstens drei Textkanten je Bildschirm, mindestens 8 px auseinander; die Abschnittsnummer steht auf der Kante der
  Überschrift. Höchstens vier Ausrichtungsachsen.
- **Abstände.** Innen nur 8, 12, 16, 20 und 24 px (4-px-Raster). Zwischen Abschnitten 96 px am Telefon und 128 px am Schreibtisch,
  gemessen vom Ende des Inhalts bis zur Abschnittsnummer, danach 12 px bis zur Überschrift. Abstand zwischen Gruppen das 2- bis 4-Fache
  des Abstands innerhalb.
- **Karten.** Format 1:1 bis 2:1 (Zeilenlisten ausgenommen), höchstens 720 px hoch am Telefon und 640 px am Schreibtisch, Innenabstand
  20 px am Telefon und 24 px am Schreibtisch. Radius 24 ab 120 px Höhe, sonst 18, Felder 12; innen gilt Radius innen = Radius außen −
  Abstand.
- **Kacheln für Fakten.** Am Telefon zwei Spalten (eine große über zwei kleinen), am Schreibtisch vier, Abstand 12 px. Eine Kachel hat
  eine Zahl, eine Zeile und eine kleine Anzeige.
- **Anschnitt.** Bilder, Kartenreihen und Leisten laufen bis an den Bildschirmrand und darüber hinaus, Text nie. Was weitergeht, zeigt
  der Anschnitt: Das nächste Element ragt mindestens 48 px ins Bild; kein hüpfender Scrollpfeil.
- **Handlung.** Eine Hauptaktion je Bildschirm, die Cream-Pille: 52 px hoch, am Telefon mindestens 60 % der Spaltenbreite, mit Verb und
  Pfeil im Kreis innen rechts, 8 px Abstand zum nächsten Ziel. Eine Zweitaktion nur als Ring-Knopf, nie zwei gleich starke. Im Kopf am
  Telefon rechts ein Ring-Knopf (44 px) mit demselben Ziel und Wort wie die Pille. Pfeile: → im Kreis ist der nächste Schritt, ↗ öffnet
  ein Beispiel, ‹ › nur an Reihen, zusätzlich zum Wischen.
- **Reihen.** Nachbarn angeschnitten und zurückgenommen (Schrift darauf mindestens 4,5:1), das empfohlene Element vorn; Zähler „02 /
  03“ und Punkte, der aktive grün; natives `scroll-snap`.
- **Kartenreihen.** Um 2 bis 4° gedreht, 8 bis 24 px versetzt, darunter der Dateiname in der Technikstimme, Schatten `--float`.

### 3.4 Bildwelt, Licht und Kamera

- **Figurenwelt** für Gefühl und Humor: fotorealistische Figuren wie der Astronaut, der Waschbär und der Bär in warmem Filmlicht,
  erzeugt vom Inhaber mit Flux und Kling. Eine Figur je Bildschirm, mit einer echten Lichtquelle im Bild. Die Figuren arbeiten: Sie
  messen, planen, wählen aus und bauen ein, mit dem gelben Zollstock als wiederkehrendem Zeichen. Keine Maskottchen ohne Aufgabe, keine
  Bilder von Gefahr oder Einbruch.
- **Menschen.** Belege (Kundenstimme, Gesicht mit Namen) nur von echten Menschen; der Inhaber selbst ist ein echter Mensch (2.2).
  Menschen in Szenen sind Bildwelt, nie Beleg.
- **Echtes Material** als Beweis: echte Bildschirme unserer Oberfläche als Aufnahmen (nicht abgefilmt), das echte Aufmaßblatt, Fotos
  statt Symbolen, Stockfotos oder fremder Bilder.
- **Licht** (messen mit bildlicht.py). Eine Quelle, im Bild oder angeschnitten, schräg von rechts oben (30 bis 50°); Schatten fallen
  nach links unten, dort steht der Text. Andere Leuchten im Bild sind aus. Spitzlichter 4800 bis 5800 K, Kantenlicht nur von derselben
  Quelle. Weich und mit Spot: Die Mitte ist heller als der Rand.
- **Tonwerte.** Schwarz bei Luma 18 bis 24 und neutral, so dunkel wie der Grund, und der Bildrand läuft ohne Kante in #161616 aus.
  Schatten unbunt (C* bis 8), das ganze Bild C* bis 20. Luma p99 höchstens 242, damit die Schrift das Hellste bleibt; Clipping höchstens
  1 %, am Motiv nie.
- **Kamera bei Fotos.** Augenhöhe, 35 bis 50 mm, Blende 2 bis 2,8, Senkrechte höchstens 1° geneigt. Flache Schärfe nur bei Lebewesen,
  Produkte sind ganz scharf. Im Startbild steht das Motiv rechts, das linke Drittel bleibt ruhig (L* bis 12).
- **Material in Nahsicht.** Je Heldbild eine Makrotextur: Fell im Gegenlicht, Tropfen auf Glas, gebürstetes Aluminium, seidenmattes
  Kunststoffprofil mit dünner Glanzkante.
- **Renderings des Fensters.** Kamera auf Höhe der Fenstermitte, nur seitlich um 20 bis 30° gedreht, Neigung 0°, Anmutung ab 85 mm. Eine
  Quelle von rechts oben, Tageslicht durchs Glas oder eine Softbox; an den Profilen 1 bis 2 px Glanzkante, das Glas spiegelt die Quelle.
  Das Fenster sitzt eingebaut: Kontaktschatten in der Laibung und unter der Fensterbank, mindestens 30 % dunkler, Wand #1f1f1f bis
  #262626. Fachlich richtig benannt: Blendrahmen, Flügel, Dreifachglas, Beschlag, Rollladen.
- **Erzeugen** vor #161616, nicht vor Grün (grüne Säume im Fell), oder freigestellt als PNG mit Transparenz.
- **Prompt-Bausteine** für Flux und Kling. Flux kennt keinen Negativprompt, Verbote stehen darum positiv; „golden hour“ macht die
  Bilder orange und entfällt.
  - Licht: `single light source: warm 5000 K daylight from a window at the right edge of the frame, shadows falling lower left, rest of
    the room dark, lamps off`
  - Kamera: `eye-level, 50mm lens, f/2.8, focus on hands and tool, verticals perfectly vertical, subject in the right half, calm dark
    left third`
  - Material: `macro texture, fur rim-lit by the window, satin uPVC profile with a thin specular edge, real glass reflections`
  - Grading: `filmic low-key grade, charcoal blacks, neutral shadows, creamy highlights, moderate saturation, fine 35mm grain`
  - Kling: `locked-off camera, one slow continuous action, constant light, natural motion blur, first frame equals last frame`;
    Negativ: `text, logo, watermark, extra lights, blue light, flicker, camera shake, morphing`
- Strichsymbole nur als Nebensache bis 24 px. Nicht: beliebige 3-D-Objekte, gezeichnete Figuren, Bilder mit Text oder Wasserzeichen,
  Platzhalter auf einer veröffentlichten Seite.

### 3.5 Bewegung

Grundlage ist der Skill „Motion Design“ (LottieFiles, MIT), Persönlichkeit „Premium“.

- **Ruhig.** Flächen schwingen nicht über. Federn nur, wo die Hand direkt führt, mit höchstens 3 % Überschwingen.
- **Richtung.** Bewegung geht in die Tiefe, nach oben, als Drehung oder als Fall; seitwärts nur beim Wischen. Ausnahme sind die Leisten,
  ein Wunsch des Inhabers (2.2). Aufsteigen höchstens 24 px, Größe 0,96 bis 1,06, Drehung höchstens 8°.
- **Kurven und Dauern.** `--e-out` für Auftritte, `--e-io` für Wege auf dem Bildschirm, Abgänge beschleunigen. Nur 220 ms (Rückmeldung),
  320 ms (Karten), 600 ms (Auftritt) und 900 ms (großer Auftritt).
- **Dichte.** Je Bildschirm eine Hauptbewegung und höchstens zwei Nebenbewegungen; Lottie nur im aktiven Schritt. Der Held bewegt sich
  nur geführt (Scrollen, Wischen); von selbst bewegen sich höchstens Trabanten und Licht.
- **Vokabular.** Aufsteigen, Zeilenmaske (die Überschrift tritt zeilenweise aus einer Maske), Ziffernrolle, Zerlegen, Tiefenwechsel,
  Einrasten.
- **Zeitplan Kopf** (Telefon, ms): 0 Foto von 1,06 auf 1 (900, sofort deckend); 100 Kicker (600); 180, 260, 340 Zeilen der Überschrift
  aus der Maske (600); 500 Chips (320, je +40); 660 Pille (600), lesbar bei 1260; 900 Meldung fällt ein (600); 1500 Maßlinie (900), ihr
  Wert läuft mit; 2400 Staub und Licht (900). Meldungen danach alle 4,8 s.
- **Zeitplan Abschnitt** (einmal, wenn 15 % im Bild sind): 0 Haarlinie (600); 80 Nummer (320); 120 Überschrift aus der Maske (600, +80
  je Zeile); 280 Lesetext (600); 400 Karten (600), versetzt nur je Zeile, nicht je Karte.
- **Szene am Scrollen.** Die Bühne hält höchstens 1,5 Bildschirmhöhen mit sichtbarem Fortschritt, höchstens vier Kapitel mit je einer
  Veränderung; der Wechsel liegt in den ersten 15 % des Kapitels (alt 1 auf 0,98, neu 1,02 auf 1), geglättet. Das Scrolltempo wird nie
  verändert.
- **Übergang zwischen Abschnitten** (Tiefenwechsel): Im letzten Fünftel tritt das Medium auf 0,97 und Deckkraft 0,5 zurück; keine
  Wischblende.
- **Schwebeteile.** Trabanten um den ruhenden Helden treiben phasenversetzt, Ausschlag höchstens 6 px und ±1,5°, Periode mindestens 6 s;
  beim Scrollen bleiben sie träge zurück (höchstens 16 px) und kehren in 600 ms ohne Überschwingen zurück, ihr Schatten folgt 50 ms
  später.
- **Ebenen-Parallaxe** (18, erweitert docs/GESTALTUNG.md): Hinten bleibt zurück, vorn eilt voraus, 4 bis 12 % der Bühnenhöhe, am
  Telefon 16 bis 48 px; was hinter Glas liegt, doppelt so weit wie sein Rahmen. Höchstens fünf bewegte Ebenen je Bildschirm, nur um am
  Motiv vorbeizuschauen.
- **Zahlen.** Der Endwert steht immer; beim Auftritt rollen die Ziffern aus einer Maske (600 ms, je Ziffer 30 ms später). Hochgezählt
  wird nur, was einen Vorgang zeigt (die Maßlinie), oder eine Eingabe (vom alten Wert, 320 ms). Kein Zwischenstand zeigt etwas Falsches:
  Ein Bildschirmfoto 1,3 s nach einem Sprung ist vollständig und richtig.
- **Vorgang statt Spektakel** (14, 16). Bewegung zeigt einen Vorgang mit Richtung: Maß nehmen, die Anfrage fällt ins Postfach.
  Bestätigungen (Haken, Erfolg) laufen einmal je Eintritt, nicht als Schleife.
- **Kapitel.** Abschnitte mit einer feinen Anzeige wie ein Maßstab mit Millimeterstrichen, der aktive grün; Füllung per `scaleX`.
- **Mikrointeraktion.** Die Cream-Pille drückt wie in docs/GESTALTUNG.md (0,98), ihr Pfeil rückt bei Berührung 4 px vor und zurück
  (220 ms), ein Plus dreht um 45° (220 ms). Schalter: Der Knopf wächst beim Halten auf 1,12 und rastet mit höchstens 3 % Feder in 320 ms
  ein.
- **Schleifen** nur mit Reaktion (Scrolltempo, Berührung) und nur im Bild. Was länger als fünf Sekunden von selbst läuft, lässt sich auf
  der Seite anhalten (WCAG 2.2.2, Stufe A; „weniger Bewegung“ allein genügt nicht).
- **Ruhige Fassung** zeigt das Endbild jeder Szene, vollständig lesbar: Ebenen stehen, Schweben ist aus, Zahlen stehen, die
  Explosionsansicht offen und beschriftet, die Bildfolge im Schlüsselbild.

### 3.6 Effekte und Technik

16 der 21 Vorbilder ließen sich ohne Video und WebGL nachbauen: Der Glanz steckt im Material. Darum zuerst Stufe 1.

| Effekt | Stufe | Technik | Ersatz |
|---|---|---|---|
| Glas über einem Standbild | 1 | `backdrop-filter`, nie animiert | deckende Fläche |
| Licht mit Quelle, Halo | 1 | radiale Verläufe in Cream, `mix-blend-mode: screen` | ohne Licht |
| Held in Ebenen | 1 | Freisteller als AVIF oder WebP mit Alpha, 780 px breit, höchstens 120 KB je Ebene; `transform` am Scrollfortschritt | ein Bild |
| Schwebeteile | 1 | CSS-Animation über `transform`, Versatz aus dem Scrolltempo | stehen |
| Maßlinie zeichnet sich, Wert läuft mit | 1 | SVG mit `pathLength` und `stroke-dashoffset` | fertige Linie |
| Ziffernrolle | 1 | Ziffern in einer Maske, `translateY`; der Endwert steht im HTML | Endwert |
| Zeilenmaske der Überschrift | 1 | Zeilen mit `overflow: clip`, `translateY` | stehender Text |
| Messraster | 1 | CSS-Hintergrund | gleich |
| Gedrehte Karten mit Scrollversatz | 1 | `transform` am Scrollfortschritt | ruhig gedreht |
| Gewölbte Leiste | 1 | `perspective`, `rotateY` je Abstand zur Mitte; Web-Animation, das Scrolltempo ändert nur `playbackRate` | flache Reihe |
| Explosionsansicht | 1 | Ebenen aus dem Fenstermodell gerendert, `translateY` am Scroll, Führungslinien als SVG, Beschriftung als Text, zusammen höchstens 400 KB | auseinandergezogen und beschriftet |
| Video-Schleife (Kling) | 1 | H.264 720 × 1280, 4 bis 6 s, höchstens 1 MB, `muted playsinline loop preload="none"` ohne `autoplay`; Start per JavaScript nur im Bild, ein Video zugleich, Halt-Knopf; Licht und Glas auf Schwarz erzeugt, mit `screen` über den Grund gelegt | Poster (Endbild) |
| Objekt dreht, öffnet oder zerlegt sich | 2 | Bildfolge auf `<canvas>`: höchstens 60 Bilder à 720 px und 25 KB, `createImageBitmap`, etwa zehn dekodiert; nie `currentTime` eines Videos scrubben | Einzelbild |
| Foto mit Tiefe (2,5-D) | 2 | WebGL mit Tiefenkarte zum Foto | Foto mit Parallaxe |
| Staub im Lichtkegel | 2 | Canvas, höchstens 60 Teilchen | ohne |
| Live-3-D | 2 | nur mit `buehne.js`, nachgeladen | Bildfolge oder Einzelbild |

- **Budget.** Am Telefon höchstens 300 KB bis zum ersten Bild (das Motiv mit `fetchpriority="high"`), je Szene höchstens 1,5 MB,
  nachgeladen, wenn der Abschnitt naht, je Seite höchstens 5 MB.
- **Nur `transform` und `opacity` animieren,** nie `height`, `width`, `top`, `background-size`, `filter` oder `backdrop-filter`;
  Unschärfe wird ins Bild gerechnet. Jedes Bild unter 16 ms, auch mit vierfach gedrosselter CPU.
- **Scrollen.** `animation-timeline: view()`, wo der Browser es kann, sonst `Scroll.binden`. `will-change` nur während der Szene (eine
  Vollbildebene kostet rund 10 MB Grafikspeicher). Abschnitte, aus denen etwas ausbricht, mit `overflow-x: clip`, nicht `hidden` (das
  bricht `position: sticky`). Erst alle Maße lesen, dann alle Stile schreiben.
- **Ersatzfassungen.** Ohne JavaScript Endlage, Text und Poster; bei „weniger Bewegung“ das Endbild; bei `prefers-reduced-transparency`
  deckendes Glas; bei `prefers-contrast: more` Linien und Nebentext eine Stufe heller; bei `forced-colors` bleiben Ränder, Fokus und
  Zustände sichtbar; auf schwachen Geräten (`navigator.deviceMemory` bis 4, `saveData`) Einzelbild statt Bildfolge, Poster statt Video.
- **CSP.** Nur eigene Herkunft: Video aus Blob-URLs, Blob-Worker und WebAssembly sind gesperrt; damit fallen three.js-Lader mit Draco und
  KTX2 weg.

### 3.7 Kontrast und Lesbarkeit

Gemessen wird immer gegen den echten Untergrund, nach WCAG. In der Sonne sinkt jeder Kontrast auf etwa ein Drittel.

| Rolle | Mindestens | Unsere Tokens |
|---|---|---|
| Überschrift | 12:1 | #f3f2ee: 16,2 auf dem Grund, 14,7 auf #1f1f1f |
| Grünes Wort | 7:1 | #8fd694: 10,5 auf dem Grund |
| Lesetext | 9:1, damit er draußen über 3,3:1 bleibt | #c9c8c3: 10,8 auf dem Grund, 9,8 auf #1f1f1f; nie auf #2e2e2e (8,1) |
| Nebentext | 5:1 | #93928d: 5,8 auf dem Grund, 5,3 auf #1f1f1f; nie auf #262626, #2e2e2e oder Glas |
| Pille | 7:1 | #161616 auf Cream: 15,9 |
| Ränder von Eingaben, Zustände, Fokus | 3:1 (WCAG 1.4.11) | Ränder heute zu schwach (2.2) |

- **Was zählt, steht nie in `--muted`:** Preis, Einheit, Bedingung, Frist. Was draußen lesbar sein muss, hat mindestens 7,7:1 und 17 px.
- **Zurückgenommene Schrift** (inaktive Schritte, Nachbarn in Reihen, Ränder von Leisten) bleibt bei mindestens 4,5:1. Mindest-Deckkraft
  auf dem Grund: 0,5 für #f3f2ee, 0,62 für #c9c8c3, 0,9 für #93928d.
- **Schrift auf Glas** hält 4,5:1 gegen die hellste weichgezeichnete Bildstelle dahinter; Nebentext steht nie auf Glas.
- **Bedeutung nie nur über Farbe.** Zustände haben ein Wort oder eine Form: Grün gegen #93928d sind nur 1,8:1, und bei Rot-Grün-Schwäche
  fallen Ok und Fehler fast zusammen.
- **Fokus** bleibt sichtbar (Ring 16:1) und wird von der klebenden Kopfzeile nie verdeckt: `scroll-padding-top` in Höhe der Kopfzeile
  (WCAG 2.4.11).
- **Halt.** Was länger als fünf Sekunden von selbst läuft (Leisten, wechselnde Meldungen, Staub, atmendes Licht, Lottie-Schleifen),
  lässt sich auf der Seite anhalten (Baustein Halt-Knopf).

### 3.8 Markenzeichen und Trendbudget

**Eigene Zeichen** (Markenstratege): Daran erkennt man eeziframes ohne Logo; sie stehen auf allen Seiten, in der App und im PDF gleich.
Wo ein Zeichen heute fehlt, ist das ein Vorschlag an den Inhaber, kein Auftrag.

1. **Maßlinie** in Orange mit Endstrichen und Wert in mm: eine im Startbild am gemessenen Fenster, danach etwa eine je vier
   Bildschirme; nie nur als Farbpille.
2. **Aufmaßblatt** als echtes Dokument mit Dateiname und Kennung, früh auf jeder Verkaufsseite.
3. **Messband** unter dem Kopf, das sich mit dem Lesen grün füllt.
4. **Figur im Fensterlicht mit dem gelben Zollstock.**
5. **Ein Name, eine Stimme:** immer „eeziframes“ klein, die Paketnamen wie vorgegeben („EEZI Essential“), eine Schreibweise
   („Fenster-Konfigurator“), ein Kicker-Stil, ein Schlusspunkt-Stil, eine Anrede je Zielgruppe.
6. **Licht durchs Fenster:** In jedem Foto fällt das Licht durch ein Fenster.

**Trendbudget:** höchstens ein Trendmerkmal je Bildschirm und drei je Seite. Trend sind Glas, Haken-Chips, Pillen-Navigation, schwebende
Dinge, Geräte im Studio und Kachelraster. Glas einmal je Seite, Haken-Chips höchstens eine Reihe mit bis zu vier. Nie: Riesenwort als
Standard, abstraktes 3-D, Verlaufsflecken, Avatarstapel. Probe: Logo verdecken. Ist der Bildschirm noch als eeziframes erkennbar, oder
könnte ein Wettbewerber ihn mit eigenem Logo unverändert nutzen?

**Unter fremder Marke** (Konfigurator des Fensterbauers): Die Farbe gehört dem Fensterbauer, die Handschrift bleibt unsere, so wie
Dropbox bei McLaren (1). Fest in allen Paketen: Maßsprache, Öffnungssymbole, Aufbau des Aufmaßblatts, Kennung, „Weiß ich noch nicht“.
Die Firmenfarbe ersetzt nur das Grün. Blau steht nie für die fremde Marke, es bedeutet in unseren Zeichnungen das Element.

### 3.9 Für Hauseigentümer

Gilt für die Startseite in der Ansicht für Hauseigentümer und für alles, was Kunden des Fensterbauers sehen (Rolle Hauseigentümerin).
Was dafür neu gebaut oder geschrieben werden müsste, ist ein Vorschlag an den Inhaber.

- **Ohne Wischen** sieht sie, was sie tut, was es kostet, was danach passiert, und die Cream-Pille (Oberkante bis 600 px).
- **An der Pille drei Antworten:** Ausprobieren kostet nichts; der Fensterbauer misst vor der Fertigung nach; wohin die Fotos gehen.
- **Drei Schritte mit echten Bildern der App** und der Weg zum Angebot; ein Beispielblatt zum Antippen, bevor sie zahlt.
- **Ihr Zuhause im Bild:** ein bewohnter Raum, ein altes Fenster, Tageslicht. Keine Baustelle, keine Gefahr, kein Tier, das wie ein
  Einbrecher wirkt.
- **Klare Worte:** jedes Fachwort mit einem Alltagswort („Laibung, also die Seitenwand der Maueröffnung“), dieselbe Zahl überall, eine
  Anrede, Textkarten einspaltig.
- **Nichts für Betriebe** bis zum Fuß der Seite: kein Band für Betriebe, keine Cream-Pille zu den Paketen, keine Sätze an Fensterbauer.
- **Ohne Druck:** kein Countdown (2.2, Frage 6), keine Platzhalter, keine Riesenwörter, keine Kleinschrift in den Ecken, keine feste
  Scroll-Bühne.

## 4. Bausteine des Stils

Muster, aus denen sich Elemente zusammensetzen. Welches Element entsteht, sagt der Inhaber. In Klammern die Vorbilder.

**Eigene Zeichen** (3.8):

1. **Maßlinie.** Haarlinie in Orange mit Endstrichen und Schrägstrichen wie in einer Bauzeichnung, der Wert mittig auf dunklem Grund, an
   senkrechten Linien gedreht. Zeichnet sich beim Auftritt, der Wert läuft mit. Nie über Gesicht, Hände oder Details im Bild.
2. **Messband.** Ein Maßstab mit Millimeterstrichen unter dem Kopf, der sich mit dem Lesen grün füllt; dieselbe Form als Kapitelanzeige
   und als Trenner in Leisten. (1, 3, 9)
3. **Aufmaßblatt als Medienkarte.** Das echte Dokument in einem Rahmen aus Fläche 2 (#262626, 6 px), Radius 12, leicht gedreht, Schatten
   `--float`; darunter Dateizeichen und Dateiname. (2)
4. **Figur im Fensterlicht** mit dem gelben Zollstock, Licht von rechts oben, nach 3.4.
5. **Messraster.** Millimeterpapier nach 3.1 unter technischen Abschnitten, zum Rand hin ausgeblendet. (4)
6. **Explosionsansicht.** Höchstens fünf Schichten eines Fensters schweben auseinander, Schicht i wandert i × 44 px auf einer Achse von
   30°; jede trägt ihre Beschriftung 01 bis 05 an einer Führungslinie, die bei 70 % ihres Wegs erscheint, fachlich richtig benannt.
   Hängt am Scrollen, die Bühne höchstens 1,5 Bildschirmhöhen; in der ruhigen Fassung offen und beschriftet. (5)

**Werkzeuge** (Trend, wo vermerkt; zählt zum Trendbudget):

7. **Handlungspille.** Cream, 52 px, Verb, Pfeil im Kreis innen rechts, der bei Berührung vorrückt; daneben höchstens ein Ring-Knopf.
   (8, 11, 12, 15, 16)
8. **Zahlenkachel.** Fläche #1f1f1f mit Ring, große Zahl mit Ziffernrolle, Einheit in `--text2`, eine Zeile, eine kleine Anzeige, die
   denselben Wert zeigt wie die Zahl. (6, 8, 12)
9. **Glas-Nachricht** (Trend). Wie eine Mitteilung auf dem iPhone: Glas nach 3.1, Radius 18, grüner Punkt, Titel 15 px fett in
   `--text`, Zeile 13 px in `--text2`. Gestapelt zeigen die hinteren nur ihre Kante. Nie über Details im Bild.
10. **Geräte-Bühne** (Trend). Telefon vor einem Browserfenster mit echten Bildschirmen, Licht von oben, weicher Bodenschatten. (6, 11)
11. **Leiste.** Kacheln mit echten Bildern statt Strichsymbolen, gewölbt, ein Lichtkegel in der Mitte benennt das Element darunter,
    Tempo reagiert aufs Scrollen, mit Halt-Knopf. (21)
12. **Schwebeteile** (Trend). Kleine echte Dinge um den ruhenden Helden, beim Astronauten Flieger, Handy und Bleistift; Bewegung nach
    3.5. (1, 13, 16, 17)
13. **Paketkarte.** Name, ein Satz bis zehn Wörter, Preis in der Titelrolle, höchstens fünf Haken, Knopf, Beispielbild; alles Weitere
    gehört in den Vergleich. Höchstens 720 px hoch, am Telefon zum Wischen, das empfohlene Paket vorn. (3, 4, 21)
14. **Halt-Knopf.** Ein Ring-Knopf (44 px) „Bewegung anhalten“ bei der ersten Schleife der Seite; er hält alle Schleifen an und merkt
    sich die Wahl.

## 5. Grenzen

Was die Vorbilder zeigen, wir aber nicht übernehmen:

- Keine Tonwelten und fremden Farbwelten (6, 7, 13, 15, 17), keine bunten Verläufe, keine zweite Lichtfarbe (7, 8, 19, 21), kein blaues
  oder kühles Licht (5), keine farbigen Schatten, kein reines Schwarz im Bild, keine helle Bühne.
- Kein Glas ohne Bild dahinter, über Bewegtem oder über Details im Bild; kein Leuchten ohne Quelle.
- Keine weiteren Schriften (Antiqua und Display 14 bis 16, Schreibschrift 17, Pixel 5), keine Größen über 40, keine leichten Titel, kein
  Lesetext in Versalien, keine Mikrotexte in den Ecken.
- Kein Einstieg ohne Handlung oder nur mit Scrollhinweis (5, 9, 13, 14, 17, 21), keine Stimmung und kein bloßer Name als Überschrift,
  keine leeren Knopfwörter, nie zwei gleich starke Knöpfe (7, 11).
- Keine Textwände, kein Inhaltsverzeichnis, kein Blogton auf Verkaufsflächen. Kein Englisch und kein Fachwort ohne Erklärung, KI nicht als
  Schlagwort, keine Angeberei mit Bauzeiten (5, 7, 8, 21).
- Keine Laufschrift ohne Anlass (19), keine kreisenden Ringe (3, 7), kein verändertes Scrolltempo und kein Smooth-Scroll (9, 21); nichts
  blinkt, flackert oder hüpft.
- Keine Echtzeit-3-D-Welten (9, 21), kein Video mit Alphakanal (16), keine Lichtbrechung als Filter (10), kein eigener Mauszeiger, keine
  Zeiger- oder Lageparallaxe (19 bis 21). Keine Partikelströme, berstenden Schirme, zerfallenden Buchstaben (14, 16, 17) und keine
  Geisterbilder (9).
- Keine beliebigen 3-D-Objekte (3, 7), keine gezeichneten Figuren (1, 18), keine Maskottchen ohne Aufgabe (19), keine Bilder von Gefahr
  (4, 8, 9).
- Keine erfundenen Belege: Avatarstapel und „+323“ (15), Sternwertung ohne Quelle (11), anonyme Zitate (7, 20), Schauzahlen (8, 15),
  Zahlen, die der eigenen Anzeige widersprechen (8), fremde Marken (11). Markenvarianten nur als „Beispiel“ beschriftet. Keine
  Tippfehler, auch nicht in Grafiken (6: „Dashbaord“).

## 6. Prüfen gegen die Richtung

Eine fertige Seite prüft die Jury aus allen Rollen (rollen.md, Abschnitt 4). Für ein einzelnes Element reichen diese Fragen.

- **Drei Sekunden am Telefon:** Was ist es, für wen, was kostet es, was tue ich jetzt? Pille mit Oberkante bei 460 bis 600 px? Für
  Hauseigentümer zusätzlich: Was passiert danach, und was, wenn ich mich vermesse?
- **Held und Dichte:** ein Held mit 30 bis 55 % der Fläche, höchstens 60 Wörter (Schreibtisch 120), ruhige Fläche 45 bis 65 %?
- **Raster:** Abstände 8 bis 24 und 96/128 vom Ende des Inhalts, höchstens drei Textkanten, Karten 1:1 bis 2:1, Radius innen = außen −
  Abstand?
- **Schrift:** eine Displaygröße, Überschrift höchstens sechs Wörter im Klartext, Lesetext 35 bis 60 Zeichen und höchstens drei Zeilen,
  kein einzelnes Wort in der letzten Zeile, kein Bruch in Komposita, Domains oder zwischen Zahl und Einheit, Kicker 13 px, 800, +0,18 em?
- **Kontrast:** Überschrift 12:1, Lesetext 9:1, Nebentext 5:1 auf dem echten Untergrund, auch auf Glas und zurückgenommen? Preis,
  Einheit und Bedingung nie in `--muted`? Eingaben und Zustände 3:1 und nicht nur über Farbe? Fokus sichtbar?
- **Farbe und Licht** messen mit `python3 -I .claude/skills/premium-gestaltung/farbanteil.py bild.png` an Bildschirmfotos bei 390 × 844:
  mindestens 80 % unbunt, höchstens 5 % kräftig, farbig über 0,3 %; der erste Bildschirm 60 bis 85 % dunkel und höchstens 8 % hell.
  Eine Cream-Fläche je Bildschirm?
- **Bilder** messen mit `python3 -I .claude/skills/premium-gestaltung/bildlicht.py bild.webp`: Schwarz 18 bis 24 und neutral, Licht 4800
  bis 5800 K, Schatten C* bis 8, Clipping bis 1 %? Eine Quelle von rechts oben, Schatten nach links unten, bei Fenstern Senkrechte
  senkrecht und Kontaktschatten?
- **Bewegung:** eine Haupt- und höchstens zwei Nebenbewegungen, nur 220, 320, 600 und 900 ms, nur `transform` und `opacity`, nichts
  seitwärts ohne Wischen, Halt-Knopf bei Schleifen über fünf Sekunden, kein falscher Zwischenstand 1,3 s nach einem Sprung, ruhige
  Fassung vollständig?
- **Marke:** Logo verdeckt, ist es noch eeziframes (Maßlinie, Messband, Aufmaßblatt, Figur mit Zollstock)? Höchstens ein Trendmerkmal je
  Bildschirm und drei je Seite?
- **Ehrlichkeit und Sorgfalt:** jede Zahl mit Einheit, Bezug und Quelle und überall gleich; keine Platzhalter auf veröffentlichten
  Seiten; kein Tippfehler.
- **Technik:** 300 KB bis zum ersten Bild, 1,5 MB je Szene, 5 MB je Seite? Ersatz ohne JavaScript, bei weniger Bewegung, weniger
  Transparenz, mehr Kontrast und auf schwachen Geräten?

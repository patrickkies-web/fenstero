# Designrichtung eeziframes

Stand 23.10.2026. Abgeleitet aus 21 Vorbildern, die der Inhaber in zwei Runden geschickt hat, verglichen aus fünf Rollen (2.3), und
aus der bisherigen Gestaltung. Gilt für alles Sichtbare auf den Verkaufsflächen (Startseite, Seite für Fensterbauer, Köpfe der
Ratgeber) und ist der Maßstab für das Aussehen jedes neuen Elements. Die App bleibt bei der strengen Fassung aus docs/GESTALTUNG.md.
Diese Richtung sagt nur, wie etwas aussehen soll; was gebaut wird und wo, bestimmt allein der Inhaber (SKILL.md, Abschnitt 1). Für
Verkaufsflächen erweitert sie docs/GESTALTUNG.md um Licht mit Quelle, Glas über Bildern und Schatten unter Schwebendem (3.1) sowie um
Ebenen-Parallaxe und Kapitelanzeige (3.5). GESTALTUNG.md schließt Parallaxe und Lesefortschritt noch aus; wer eines davon baut, zieht
die Doku dort nach.

## 1. Leitsatz

**Ruhig wie Apple, präzise wie ein Aufmaß, mit Licht und Tiefe wie in einer Raumstation.**

1. **Ruhige, dunkle Bühne.** Viel Unbunt, viel Luft, kurze Sätze, eine Handlung je Bildschirm.
2. **Ein Held je Bildschirm.** Ein großes Motiv trägt den Bildschirm, alles andere ordnet sich unter.
3. **Licht und Tiefe statt Flächen.** Ebenen hintereinander, Glas über Bildern, Licht aus einer Quelle im Bild, und etwas bricht aus
   seinem Rahmen.
4. **Präzision im Detail.** Maßlinien, Messraster, Ziffern in Reih und Glied: Details aus der Welt des Aufmaßes, sauber bis auf den
   Pixel.
5. **Erst verstehen, dann erleben.** Der erste Bildschirm sagt im Klartext, was es ist, und zeigt die eine Handlung; Szenen und Tiefe
   folgen darunter. Die Vorbilder sind kurz, aber selten klar. Wir wollen beides.

**Apple-ähnlich heißt für uns:** das Motiv groß und mit Licht modelliert; ein Gedanke je Bildschirm; kurze, fette Überschrift, grauer
Lesetext mit hellen Schlüsselwörtern; Szenen, die am Scrollen hängen (ein Objekt dreht oder öffnet sich, während der Text wechselt);
Kacheln für Fakten; Glas über Bildern; langsame, weiche Auftritte; eine klare Handlung.

## 2. Analyse der Vorbilder

Methode wie im Skill „Design DNA“ (zanwei/design-dna, MIT): je Vorbild drei Ebenen, nämlich Werte (Farbe, Schrift, Raster, Form), Stil
(Wirkung, Komposition, Bild) und Effekte (3-D, Licht, Glas, Bewegung). Farben und Licht werden gemessen, nicht geschätzt
(farbanteil.py). Runde 1 sind die Vorbilder 1 bis 9, Runde 2 die Vorbilder 10 bis 21; die Nummern gelten im ganzen Dokument.

### 2.1 Die Vorbilder

| Vorbild | Was zu sehen ist | Warum es wirkt | Was wir übernehmen |
|---|---|---|---|
| 1 Dropbox Dash × McLaren, Startbild | Gezeichneter Fahrer bricht aus einem dunklen Rahmen; echte Dokumente, Fotos und eine Antwortkarte schweben vor und hinter ihm, am Rand angeschnitten; orange Diagonalen mit Rasterpunkten; harter Schnitt ins Weiß; Zitat in großer Grotesk | Figur und echtes Material in einem Bild, Ebenen, eine große Markengeste | Figuren mit echten Oberflächen um sich; aus dem Rahmen brechen; höchstens eine große Farbgeste je Seite |
| 2 Dropbox Dash, Kartenreihe | Suchfeld in der Mitte, darüber und darunter leicht gedrehte Dateikarten (Foto, Kalender, Video mit Zeitcode, PDF) mit Dateinamen, an beiden Rändern angeschnitten | Eine Funktion wird als Szene gezeigt statt beschrieben | Szenen statt Aufzählungen: das Ergebnis in der Mitte, echtes Material drumherum |
| 3 Skill „Motion Design“ (LottieFiles) | Dunkler Grund, Titel in warmem Weiß, ein Akzent für Punkte und Zähler, Haarlinien, Schrift vor und hinter einem Objekt | Strenge Ordnung, ein Akzent | Bestätigt unsere Basis (dunkel, Cream, ein Signal); Zähler „01 / 04“, Haarlinien; Bewegungsregeln in 3.5 |
| 4 Skill „Design DNA“ | Zwei Webseiten überlappen auf einem Punktraster | Tiefe durch Überlappung, Raster als Technik-Textur | Analysemethode; Überlappung für Tiefe; Messraster |
| 5 textura.eu | Explosionsansicht von Materialschichten, Beschriftung mit Linie, Versalien in Monospace, Zeilenraster wie ein Bildschirm | Technik wird sichtbar und sinnlich | Explosionsansicht für technische Inhalte; Beschriftung an Linien; Technikstimme |
| 6 juicelab, Dashboard | Monitor im hellen Studio mit Bodenschatten, blasses Riesenwort dahinter (mit Tippfehler „Dashbaord“), Kacheln mit großen Zahlen, Verläufe als Licht | Gerät im Studio, die Zahl als Held | Geräte im Studiolicht, Riesenwort als Grafik, Zahlenkacheln. Nicht: Pink, Lila, bunte Verläufe |
| 7 seanaiux, DE</HELPERS | Ganze Seite in einem Violett, 3-D-Ringe mit leuchtender Kugel, Glaskarte mit Kundenstimme über dem Objekt | Licht von innen, Glas über Tiefe | Glas über Bildern, Licht mit Quelle. Nicht: fremde Farbwelt, beliebige 3-D-Objekte |
| 8 viktoroddy, Axle | Kacheln mit 4K, −42 und 88 %, weißes Stadtmodell als Held, zwei kurze Sätze mit Punkt, Navigation aus Pillen | Fakten als Kacheln, ein ruhiges Modell als Held | Kacheln für Zahlen; ein ruhiges Objekt als Held; kurze Sätze |
| 9 kryntix, KAGE | WebGL-Szene mit Tempel, Mond, Gras und Blüten, riesige Buchstaben stehen in der Szene, Kapitel 01 bis 04, „Scroll to enter“ | Der Besuch wird zur Reise, die Schrift gehört zur Welt | Kapitel mit feiner Anzeige; Riesenwort zwischen Ebenen; Staub und Licht sparsam |
| 10 Liquid Glass (Figma) | Dicker Glasschalter und Glaskreis über einem Raster; das Grün dahinter wird an den Rändern gebrochen, helle Lichtkante, weicher Schatten | Glas als Material mit Dicke, nicht nur Weichzeichner | Glas mit Dicke durch die Lichtkante zur Quelle; Schalter mit Feder (3.5). Nicht: die Lichtbrechung als Filter |
| 11 Dentora, Velour | Mehrere Seiten gestaffelt in Perspektive; Foto randlos, Navigation als Glaspillen, weiße Pille mit rundem Pfeil, kleine Glaskarte mit Video | Tiefe durch gestaffelte Seiten, die Handlung ist eine Pille mit Pfeil | Pille mit Pfeil im Kreis; gestaffelte Seiten nur als „Beispiel“ beschriftet. Nicht: Sternwertung ohne Quelle |
| 12 Fahrdienst-App | Große, leichte Begrüßung, dunkle Kartenkachel mit Route im Akzent, riesige Akzentpille mit schwarzem Pfeilkreis, Kacheln mit großen Zahlen, runde Navigation | Ein Akzent trägt alles, die Handlung ist riesig und eindeutig („Auto in 2 Min.“) | Eine Farbe für die Handlung; Zahlen mit Bezug; runde Ziele ab 44 px |
| 13 Freshify | Ganze Seite in Erdbeerrot, die Schale von oben als Held, das Riesenwort „STRAWBERRY“ dahinter, echte Früchte schweben mit weichem Schatten, Pillen-Navigation | Farbe kommt aus dem Produkt, Wort und Objekt sind verschränkt | Riesenwort hinter dem Motiv; Schwebeteile um einen ruhenden Helden. Nicht: Tonwelt |
| 14 POUR/PLAY, Gießen | Warmes Beige, Kaffee rieselt durchs Bild, große Schmuckschrift hinter und vor dem Strahl | Bewegung zeigt den Vorgang selbst | Bewegung erzählt einen Vorgang mit Richtung. Nicht: Schmuckschrift, Partikelstrom |
| 15 Bluebird | Hellblaue Farbwelt aus dem Vogel, Vogel freigestellt in der Mitte, blasses Serifen-Riesenwort dahinter, Glaskarten mit 3-D-Symbol und „42 %“, Avatarreihe „+323“, blaue Pille mit Pfeilkreis | Produkt-Held, Riesenwort und Glas-Fakten in einem Bild; der Knopf steht im Licht des Motivs | Leises Riesenwort; Farbbrücke zwischen Bild und Knopf. Nicht: Serife, Avatarstapel, Schauzahlen |
| 16 POUR/PLAY, Mühle | Kaffeemühle als Held, Bohnen fallen von oben hinein, „GRIND“ und „PLAY“ groß links und rechts, dunkle Pille mit Pfeilkreis | Das Objekt steht vor der Schrift, die Bewegung fällt ins Objekt; Material in Nahsicht | Schrift und Motiv als Ebenen; Bewegung mit Richtung zum Motiv; Nahsicht |
| 17 lightup | 3-D-Lampe bricht oben aus der Karte, Schreibschrift verschränkt mit dem Objekt, Produktreihe mit Pfeilen, Seitenleiste mit Symbolkacheln | Aus dem Rahmen brechen, verspielt, aber geordnet | Ein Motiv ragt über den Kartenrand. Nicht: Schreibschrift, Türkis und Gelb |
| 18 Samurai-Parallaxe (Webflow, Lottie) | Illustration aus getrennten Ebenen (Sterne, Kirschblüten, Burg, Wolke, Samurai, Baum), Lottie vorn und hinten | Ein wenig Tiefe bringt viel: Ebenen bewegen sich verschieden schnell | Motive in Ebenen freistellen, je Ebene eigene Geschwindigkeit. Nicht: gezeichnete Lottie-Landschaft |
| 19 happy lemon | 3-D-Zitrone und Blätter schweben vor einem Kartenraster, riesiges Laufband „happy lemon“ dahinter | Objekt vor Schrift vor Inhalt | Die Reihenfolge der Ebenen. Nicht: Laufband, Witzfigur |
| 20 Dahlia | Schwarzer Grund, Blüte freigestellt im Studiolicht, feine Serifen-Überschrift, Angaben mit Haarlinien, Vorschaubilder rechts, Punkte unten, Ring als Mauszeiger | Ruhe, Luft, ein Objekt, präzise Beschriftung; wirkt teuer | Studiolicht auf dunklem Grund; Haarlinien-Angaben; Seitenpunkte. Nicht: Serife, eigener Mauszeiger |
| 21 Ciao Energy (WebGL) | Dosen schweben als gewölbtes Karussell, die mittlere aufrecht und beleuchtet, darunter eine leuchtende Plattform, „Scrollen zum Entdecken“ | Produkt als 3-D-Held auf einer Lichtbühne | Gewölbte Reihe mit hellem Mittelstück (bei uns die Leiste); Lichtsockel. Nicht: Live-3-D, Gamer-Farben |

### 2.2 Gemessen

Mit farbanteil.py, Anteil der Fläche, gemessen an Ausschnitten ohne Instagram-Rahmen (textura und Axle fehlen, dort ist der Bildschirm
abfotografiert). Dunkel heißt Luma unter 0,15 (dunkler als #262626), hell Luma über 0,8.

| | unbunt | farbig | kräftig | dunkel | hell |
|---|---|---|---|---|---|
| 1 Dropbox, Startbild | 60 % | 27 % | 24 %, Orange als Markengeste | 17 % | 42 % |
| 2 Dropbox, Kartenreihe | 83 % | 12 % | 10 %, fast nur aus den Fotos | 3 % | 78 % |
| 3 Motion Design | 84 % | 6 % | 5 %, nur das Objekt | 86 % | 4 % |
| 4 Design DNA | 78 % | 1 % | unter 1 % | 72 % | 15 % |
| 6 juicelab | 81 % | 16 % | 5 % | 4 % | 64 % |
| 7 seanaiux | 2 % | 25 % | 22 %, eine Farbwelt | 62 % | 1 % |
| 9 KAGE | 23 % | 12 % | 5 % | 55 % | 9 % |
| 10 Liquid Glass | 90 % | 8 % | 2 % | 2 % | 85 % |
| 11 Dentora, Velour | 59 % (Foto) | 17 % | 2 % | 4 % | 33 % |
| 12 Fahrdienst-App | 84 % | 11 % | 10 %, ein Lime als Handlung | 39 % | 56 % |
| 13 Freshify | 6 % | 56 % | 50 %, Farbwelt aus dem Produkt | 23 % | 5 % |
| 14 POUR/PLAY, Gießen | 12 % | 35 % | 6 %, Beige | 6 % | 13 % |
| 15 Bluebird | 53 % | 20 % | 13 %, Blau aus dem Vogel | 0 % | 55 % |
| 16 POUR/PLAY, Mühle | 59 % | 2 % | unter 1 % | 11 % | 51 % |
| 17 lightup | 12 % | 82 % | 13 %, Türkis und Gelb | 1 % | 21 % |
| 18 Samurai-Parallaxe | 23 % | 16 % | 8 % | 72 % | 9 % |
| 19 happy lemon | 55 % | 19 % | 15 % | 35 % | 24 % |
| 20 Dahlia | 66 % | 16 % | 7 %, nur die Blüte | 74 % | 1 % |
| 21 Ciao Energy | 41 % | 7 % | 2 % | 45 % | 2 % |

**Gelesen:** Es gibt zwei Farbfamilien. Unbunt mit einem Akzent (etwa 3, 4, 10, 12, 16, 20, 21: kräftig höchstens 10 %, meist unter
5 %) und Tonwelten aus dem Produkt (7, 13, 14, 15, 17: unbunt unter 55 %). Wir gehören zur ersten. Beim Licht bauen die dunklen
Vorbilder (3, 4, 7, 18, 20: 62 bis 86 % dunkel, meist unter 10 % hell) Tiefe mit Licht, die hellen (2, 6, 10, 15) mit Schatten und
Glas.

### 2.3 Was alle gemeinsam haben: Vergleich aus fünf Rollen

Fünf Rollen haben alle 21 Bilder mit eigenen Prüfkriterien gelesen: **Art Director** (Held, Ebenen, Licht, Farbanteil, Schrift,
Material), **UX und Verkauf** (Fünf-Sekunden-Test, Blickweg, Hauptaktion, Telefon, Beweis, Orientierung), **Bewegung** (Ebenen,
Auslöser, Physik, Erzählung, Mikrointeraktion), **Frontend** (Technik, Ladegewicht, Last auf Android, Barrierearmut, CSP) und **ein
Fensterbauer als Kunde** (drei Sekunden, echtes Ergebnis, wer steht dahinter, ein Knopf, Risiko). Jedes Muster unten haben mehrere Rollen
unabhängig gefunden; dahinter, wie viele der 21 es zeigen.

1. **Ein Held trägt den Bildschirm** (19, nicht 2 und 12). Für den Fensterbauer zählt nur ein Held, der das Ergebnis zeigt.
2. **Ebenen, die sich überdecken** (17): Schrift hinten, Held in der Mitte, Glas oder Bedienung vorn; meist verdeckt das Motiv etwas oder
   bricht aus dem Rahmen. Unschärfe zeigt Tiefe oder Tempo (7, 8, 10, 14 bis 16, 19, 21).
3. **Kurze Überschrift** (17, höchstens fünf Wörter), Text links, Motiv in der Mitte oder rechts (16), höchstens drei Zeilen Lesetext
   (15). Aber nur 7 und 11 nennen die Leistung im Klartext; 13, 14, 17, 19 und 20 zeigen bloß einen Namen.
4. **Freigestelltes Motiv vor ruhigem Grund, Material in Nahsicht** (11: 5, 10, 13 bis 17, 19 bis 21): Tropfen, Federn, Metall, Blüten,
   Stoffschichten. Die teuer wirkenden Vorbilder (1, 16, 20) leben davon.
5. **Licht löst das Motiv vom Grund** (9: 1, 3, 5, 7, 9, 17, 19 bis 21): eine Quelle, oft Oberlicht, bei 3-D-Szenen schräge Kamera.
6. **Anschnitt** (12: 1 bis 3, 9, 11, 14 bis 17, 19 bis 21): Bilder und Bewegung laufen über den Rand, der Rand verspricht, dass es
   weitergeht.
7. **Riesenwort hinter dem Motiv oder zwischen seinen Ebenen** (10: 3, 6, 9, 13 bis 19), leise (6, 15: Kontrast etwa 1,2:1) oder laut
   als zweiter Held (9, 13, 16, 19).
8. **Fakten als Karten und Zahlenkacheln** (12: 1 bis 4, 6 bis 8, 11, 12, 15, 17, 19). Verstanden hat der Fensterbauer nur zwei: „4,9
   Sterne“ (11) und „Auto in 2 Min.“ (12). Eine Zahl ohne Bezug sagt ihm nichts.
9. **Pillen, die Hauptaktion gefüllt und mit Pfeil im Kreis** (Pillen 10, Pfeil im Kreis 6: 2, 8, 11, 12, 15, 16). Bei uns schon
   Standard (Cream-Pille mit `.pf`).
10. **Die Position ist sichtbar** (11: 1 bis 5, 8, 9, 13, 17, 20, 21): Tacho, Zähler „1/6“, Punkte, Kapitel. Reihen zeigen ihre
    Nachbarn angeschnitten oder abgedunkelt (8).
11. **Schwerkraft ist sichtbar** (10: 1, 2, 5, 7, 13, 14, 16, 17, 19, 21): schweben, fallen, hängen. Oft ruht der Held, nur Trabanten
    bewegen sich (1, 13, 16, 17).
12. **Zwei Schriftstimmen** (10: 2 bis 6, 8, 9, 12, 16, 20), dazu Mikrotexte in den Ecken (3, 4, 6, 9, 13, 20).
13. **Ein Gerät oder Bildschirm im Raum** (10: 5, 6, 8, 9, 11, 12, 14, 16, 19, 21). Bei 5, 8, 9, 14, 16, 19 und 21 ist der Bildschirm
    abgefilmt; das Raumlicht stammt aus der Aufnahme.
14. **Menschen mit Gesicht oder Namen** (5: 1, 11, 12, 15, 19). Für den Fensterbauer schlägt ein Zitat mit Name und Betrieb jede
    Animation; bei 7, 11, 15 und 20 sind die Belege aber erkennbar Schaumuster.

**Anfragen würde der Fensterbauer** bei 1, 2, 5, 11, 12, 13, 16 und 20. Teuer wirken 20, 16 und 1, vertrauenswürdig 1, 11 und 12, in
drei Sekunden verstanden hat er 11, 12 und 13.

**In einem Satz je Rolle:**

- Art Director: Tiefe kommt aus Ebenen und Licht, nicht aus Farbe.
- UX und Verkauf: Die Vorbilder sind kurz, aber selten klar; Handwerk übernehmen, Verkaufslogik prüfen.
- Bewegung: Der Held ruht, Trabanten und Ebenen bewegen sich, am Scrollen und mit Schwerkraft.
- Frontend: 16 von 21 kommen ohne Video und WebGL aus; der Glanz steckt im Material.
- Fensterbauer: „Mich überzeugt nicht die Technik. Mich überzeugen Ruhe, ein echtes Ergebnis, ein Mensch und ein Knopf.“

### 2.4 Spannweite

- **Hell oder dunkel.** Zehn sind dunkel (3 bis 5, 7, 9, 13, 18 bis 21), neun hell, 1 und 12 gemischt. Wir bleiben dunkel.
- **Figur oder Produkt als Held.** Die Figur nah, Gesicht frei, Karten am Rand oder dahinter (1, 11, 15, 19); das Produkt symmetrisch,
  im Oberlicht, auf Sockel oder zwischen Teilchen (5, 13, 16, 20, 21). Wir haben beides: Figuren und das Fenster aus dem Konfigurator.
- **Erklären oder Erleben.** Von Klartext mit Handlung (7, 11, 12) bis zur Szene ganz ohne Handlung (5, 9, 13, 14, 17).
- **Temperament.** Ruhig (6, 8, 15, 20) bis verspielt (13, 14, 17, 19).
- **Technik.** CSS, SVG und Freisteller (16 von 21), Lottie und Ebenen-Parallaxe (3, 5, 18), Video oder Bildfolge (7, 14, 16),
  Echtzeit-WebGL (9, 21).
- **Reife.** Fürs Telefon gebaut sind nur 1, 2 und 12, die übrigen sind Schreibtisch-Querformate, mehrere abgefilmt. Erkennbar live und
  auf Abschluss ausgelegt ist nur Dropbox; Shops (5, 13, 14, 16, 17, 21) zeigen nie einen Preis. Die meisten sind Konzeptbilder für
  Reichweite.

### 2.5 Wo die Rollen sich widersprechen

| Spannung | Entscheidung |
|---|---|
| Riesenwort: Art Director und Bewegung wollen es, der Fensterbauer findet Buchstaben quer durchs Bild unlesbar (5, 9, 14, 16) | Leise Grafik, trägt nie eine Information; es spricht die Überschrift (3.2) |
| Szene oder Klartext: Bewegung und Art Director lieben Szenen, UX und Fensterbauer schrecken Einstiege ohne Handlung ab | Erster Bildschirm im Klartext mit Pille und Beweis, Szenen ab dem zweiten (3.3) |
| Tiefe oder Ladezeit: Echtzeit-3-D wirkt, kostet aber 3 bis 20 MB, Wärme und Akku | Tiefe aus Freistellern, Ebenen und Licht; Stufe 2 nur nachgeladen, nie als Einstieg (3.6) |
| Zahlen: Sechs Vorbilder beweisen mit Zahlen, verstanden werden zwei | Eine Zahl nur mit Einheit, Bezug und Quelle (3.2) |
| Menschen: Der Fensterbauer will Gesichter und Namen, die Vorbilder zeigen dafür Schaumuster | Nur echte Menschen; bis es sie gibt, keine (3.4, 5) |
| Glas: Liquid Glass (10) begeistert, die Lichtbrechung läuft nur in Chromium und ruckelt animiert | Glas mit Dicke durch die Lichtkante, ohne Brechungsfilter (3.1) |

### 2.6 Die eigene Seite, gemessen

**Vor dem Umbau** wirkte die Seite für Fensterbauer „nach 2015“: Ab dem zweiten Bildschirm kein Bild und kein Licht (100 % unbunt,
lauter gleich flache Karten), Textblöcke statt Szenen, Strichsymbole als Hauptträger, nur eine Schriftstimme, eine Bewegung, die
gleichförmig durchlief und nichts erzählte. Erster Bildschirm: unbunt 68 % (Foto), farbig 4 %, dunkel 73 %, hell 4 %.

**Nach dem Umbau** (23.10.2026, alle 19 Bildschirme bei 390 × 844): Der erste Bildschirm liegt im Rahmen der dunklen Vorbilder (unbunt
71 %, farbig 3 %, dunkel 70 %, hell 4 %). Offen, gemessen an den Vorbildern:

- Ab Bildschirm 12 (Ablauf, Live-Demos, Bestellen, Fragen, Wissen) wieder Listen, Karten und ein Formular ohne Bild und Licht; das
  einzige Bild dort ist ein Platzhalter. Die Bildschirme 3, 6, 8, 9 und 15 sind ganz ohne Akzent.
- Die Cream-Pille steht erst im zweiten Bildschirm und dort neben der Cream-Leiste (hell 15 %); im ersten zeigt sich die Handlung nur
  als Ring im Kopf.
- Kein Mensch mit Gesicht und Namen; zwei Fotos sind noch Platzhalter (Kundenschutz, Frage).

Was davon geändert wird, entscheidet der Inhaber.

## 3. Die Richtung im Einzelnen

### 3.1 Farbe und Licht

- **Die Tokens bleiben.** Grund #161616, Flächen #1f1f1f und #262626, Text #f3f2ee, Cream für die Hauptaktion, Grün als einziges Signal.
  Neue Farben gibt es nicht.
- **Unbunt mit einem Signal, nie eine Tonwelt.** Von den zwei Farbfamilien (2.2) gehören wir zur unbunten. Farbe kommt aus dem Motiv,
  nicht aus der Oberfläche; Grün bleibt klein, zusammen etwa 1 % der Fläche.
- **Anteile je Bildschirm.** Mindestens 80 % unbunt, kräftige Farbe höchstens 5 %, aber nie ganz ohne Farbe: Bild, Licht oder Signal
  müssen da sein (farbig über 0,3 %). Ausnahmen: große Fotos und eine bewusste Markengeste je Seite, etwa ein Farbband oder ein großes
  Lichtfeld. Unser Grün ist so zart, dass es als farbig zählt, nicht als kräftig.
- **Low-key.** Der erste Bildschirm mit Heldbild ist zu 60 bis 85 % dunkel; hell sind nur Überschrift, Cream-Pille und die Lichtquelle
  im Bild, zusammen höchstens 8 %. So liegen die dunklen Vorbilder (3, 7, 18, 20). Das Heldbild ist zur Hälfte dunkler als #2e2e2e und
  hat eine warme Quelle.
- **Eine Cream-Fläche je Bildschirm** (docs/GESTALTUNG.md) gilt streng: keine Cream-Leiste und kein Cream-Band im selben Bildschirm wie
  die Cream-Pille.
- **Farbbrücke.** Spitzlichter in Fotos cremeweiß (nahe #f1f0ea), nicht bläulich: Dann steht die Pille im selben Licht wie das Bild,
  so wie in 15 der Knopf im Blau des Vogels.
- **Bedeutungsfarben.** Orange und Blau bleiben Zeichnungsfarben (docs/GESTALTUNG.md) und erscheinen nur in technischen Darstellungen wie
  Maßlinien und Skizzen, nie als Schmuck.
- **Licht statt Schmuck.** Ein Verlauf ist erlaubt, wenn er Licht aus einer Quelle im Bild ist: Fenster, Bullauge, Bildschirm, ein
  leuchtendes Signal. Radial und weich, 8 bis 20 % Deckkraft, nur in Cream, Grün oder dem Blau der Zeichnungen. Ein Verlauf ohne
  Quelle bleibt verboten. Dunkle Bühnen bauen Tiefe mit Licht, nicht mit Schatten: hinter dem Helden ein Halo, radial, Cream 10 bis
  14 %, 1,2- bis 1,5-mal so breit wie das Motiv, zur Lichtquelle hin versetzt.
- **Glas** nur über Standbildern, nie über Video oder anderem Glas, höchstens ein Viertel des Bildschirms: #1f1f1f mit 55 bis 65 %
  Deckkraft, Weichzeichner 20 bis 24 px, Sättigung 140 %, oben eine Lichtkante (1 px, Weiß 10 %), Schatten `--float`. Text darauf hält
  4,5:1 gegen die hellste Bildstelle dahinter. Die Dicke zeigt die Lichtkante zur Quelle hin; die Lichtbrechung von Liquid Glass (10)
  bauen wir nicht nach. Ohne `backdrop-filter` und bei `prefers-reduced-transparency` eine deckende Fläche. Auf dem Grund ohne Bild
  bleiben die Karten beim 2-px-Ring.
- **Schatten** wirft nur, was schwebt: Glas, gedrehte Karten, Geräte. Was schwebt, trägt zur Quelle hin eine Lichtkante (1 px, Weiß
  10 %).
- **Textur.** Messraster wie Millimeterpapier (fein alle 8 px, kräftig alle 40 px, Weiß 3 bis 5 %) in technischen Abschnitten. Korn mit
  2 bis 3 % in großen Lichtflächen gegen Streifen.

### 3.2 Schrift

- **Inter und die Größen bleiben:** 13, 15, 17, 24 und 40, am Telefon 32. Serifen (14 bis 16, 20), Schreibschrift (17), Pixelschrift
  (5) und Größen über 40 (7, 9, 12, 16) übernehmen wir nicht.
- **Bühnenstimme.** Überschriften in Inter 800, Laufweite −0,03 em, Zeilenabstand 1,05, am Telefon höchstens drei Zeilen, genau ein
  grünes Wort. Höchstens sechs Wörter und im Klartext: Die Überschrift sagt, was es ist, nie nur eine Stimmung oder einen Namen
  (Gegenbeispiele 8, 9, 13, 15, 17, 19). Der Satz darunter hat höchstens zwölf Wörter. Zwei kurze Sätze mit Punkt sind erlaubt.
- **Technikstimme.** 13 px, Inter 600, Ziffern gleich breit (`font-variant-numeric: tabular-nums`, mit unserer Inter-Datei geprüft).
  Kicker, Kapitel „01 / 04“ und Beschriftungen in Versalien mit Sperrung 0,12 em; Maße („1.230 × 1.480 mm“), Dateinamen und
  Zeitangaben behalten ihre Schreibweise, Sperrung 0,02 em. Farbe `--muted`, aktiv Grün. Die Marke bleibt auch hier klein: eeziframes.
- **Lesetext wie bei Apple.** 17 px in `--text2`, das Entscheidende darin in `--text` und fett. Höchstens drei Zeilen je Block auf
  Verkaufsflächen; Längeres gehört in Ratgeber und Fragen. Kein Lesetext in Versalien, kein Schnitt dünner als 400 (7 und 15 sind am
  Telefon kaum zu lesen). Text über Bildern nur über einer ruhigen Zone.
- **Zahl als Held.** 40 px, am Telefon 32, in 800; die Einheit in 15 px und `--muted` direkt daneben. Eine Zahl braucht Einheit, Bezug
  („97.482 offene Stellen“, nicht „−42“) und eine Quelle oder die Paketbedingungen.
- **Knöpfe** sprechen mit Verb („Pakete ansehen“), nie leer („Learn more“ in 1, „Our Solutions“ in 15).
- **Riesenschrift** nur als Grafik, höchstens einmal je Seite: ein Wort hinter dem Motiv, als SVG-Pfad aus Inter 800 mit `aria-hidden`,
  nicht als SVG-Text (die Prüfsuite misst jede Schrift); die Überschrift bleibt Text. Leise: #262626 auf #161616 (1,20:1 wie 6 und 15),
  #1f1f1f (1,10:1) verschwindet im Tageslicht. Laut als zweiter Held (9, 13, 16, 19) nicht: Bei uns spricht die Überschrift.

### 3.3 Raum und Komposition

- **Der erste Bildschirm** am Telefon (390 × 844, ohne Scrollen): Kicker, Überschrift, ein Satz, die Cream-Pille und ein Beweis aus
  echtem Material (der Konfigurator unter einer Beispielmarke, die Meldung einer Anfrage, das Aufmaßblatt). Die Pille sitzt im
  Daumenbereich, Oberkante zwischen 460 und 600 px: Am echten Telefon verdecken Status- und Browserleiste rund 140 px. Keine
  bildschirmfüllende Szene als Einstieg (9, 18, 21); Tiefe und Szenen ab dem zweiten Bildschirm.
- **Ein Gedanke je Bildschirm** am Telefon: Held, Überschrift, höchstens ein Satz, eine Handlung.
- **Ebenen,** von hinten nach vorn: Grund, Riesenwort, Halo, Held, Glas, Licht und Staub. Je Seite bricht mindestens einmal etwas aus
  seinem Rahmen: eine Figur über die Bildkante, eine Karte über die Abschnittsgrenze, ein Objekt aus seiner Karte (17). Unschärfe zeigt
  Tiefe: Was weit vorn oder hinten liegt, ist unscharf, ins Bild gerechnet.
- **Figur als Held** (1, 11, 15, 19): nah, als Brustbild, Augenlinie bei 20 bis 40 % der Bühnenhöhe, unten 15 bis 20 % in den Grund
  ausgeblendet. Karten am Rand oder dahinter, Glas nur über dem unteren Drittel, nie über Gesicht, Händen oder Werkzeug.
- **Produkt als Held** (5, 13, 16, 20, 21): das Fenster aus dem Konfigurator in Dreiviertelansicht (25 bis 40°), Oberlicht, darunter
  ein Lichtsockel statt eines Schattens, viel Luft.
- **Anschnitt.** Bilder, Kartenreihen und Leisten laufen bis an den Bildschirmrand und darüber hinaus, Text nie. Was weitergeht, zeigt
  der Anschnitt: Das nächste Element ragt mindestens 48 px ins Bild. Kein hüpfender Scrollpfeil.
- **Handlung.** Eine Hauptaktion je Bildschirm, die Cream-Pille: 52 px hoch, am Telefon mindestens 60 % der Spaltenbreite, mit Verb und
  Pfeil im Kreis innen rechts, 8 px Abstand zum nächsten Ziel. Eine Zweitaktion nur als Ring-Knopf, nie zwei gleich starke (7, 11). Im
  Kopf am Telefon rechts ein Ring-Knopf (44 px) mit demselben Ziel und Wort wie die Pille (1, 2). Pfeile sprechen: → im Kreis ist der
  nächste Schritt, ↗ öffnet ein Beispiel oder Detail (6, 15), ‹ › gibt es nur an Reihen, zusätzlich zum Wischen.
- **Kacheln für Fakten.** Am Telefon zwei Spalten (eine große über zwei kleinen), am Schreibtisch vier, Abstand 12 px. Eine Kachel hat
  eine Zahl, eine Zeile und eine kleine Anzeige.
- **Reihen.** Nachbarn angeschnitten und zurückgenommen, das empfohlene Element vorn und hell (21); Zähler „02 / 03“ und Punkte, der
  aktive grün.
- **Kartenreihen.** Um 2 bis 4° gedreht, 8 bis 24 px versetzt, darunter der Dateiname in der Technikstimme, Schatten `--float`.
- **Abstände.** Zwischen Abschnitten am Telefon 96 px, am Schreibtisch 128 px; innen 8, 12, 16 und 24 px wie bisher (4-px-Raster).
- **Schreibtisch.** Text links über fünf Spalten, Held rechts über sieben, angeschnitten bis zum Fensterrand. Höchstmaße wie bisher,
  nichts überdimensionieren. Was dort nebeneinander steht, stapelt das Telefon neu: Motiv oben, Überschrift und Pille im Daumenbereich.

### 3.4 Bildwelt

- **Figurenwelt** für Gefühl und Humor: fotorealistische Figuren wie der Astronaut, der Waschbär und der Bär in warmem Filmlicht,
  erzeugt vom Inhaber mit Flux und Kling. Unser Gegenstück zum gezeichneten McLaren-Fahrer. Eine Figur je Bildschirm, mit einer echten
  Lichtquelle im Bild. Die Figuren arbeiten: Sie schmunzeln, aber sie messen, planen und bauen ein. Keine Witzfiguren (19).
- **Material in Nahsicht.** Je Heldbild eine Makrotextur, höchstens ein Drittel scharf: Fell im Gegenlicht, Tropfen auf Glas,
  gebürstetes Aluminium, Holzmaserung. Davon leben die teuer wirkenden Vorbilder (16, 20); die Zeile gehört in jede Bildanfrage.
- **Echtes Material** als Beweis: echte Bildschirme, Dokumente und Fotos statt Symbolen, Stockfotos oder fremder Bilder. Bildschirme als
  echte Aufnahmen unserer Oberfläche; das Raumlicht abgefilmter Geräte (5, 8, 9, 14, 16, 19, 21) stammt aus der Aufnahme und ist kein
  Effekt für die Seite.
- **Fachlich richtig.** Was ein Fenster zeigt, stimmt und ist richtig benannt: Blendrahmen, Flügel, Dreifachglas, Beschlag, Rollladen.
  Daran misst der Fensterbauer, ob wir etwas von Fenstern verstehen.
- **Menschen.** Ein echter Mensch mit Gesicht, Namen und Betrieb überzeugt den Fensterbauer mehr als jede Animation (1, 11, 12). Nur
  echt: Bis es Kunden gibt, zeigen wir keinen.
- Strichsymbole nur noch als Nebensache bis 24 px, nie als Hauptträger. Nicht: beliebige 3-D-Objekte wie Ringe, Kugeln oder Blasen,
  Bilder mit Text oder Wasserzeichen.

### 3.5 Bewegung

Grundlage ist der Skill „Motion Design“ (LottieFiles, MIT), Persönlichkeit „Premium“.

- **Ruhig.** Flächen schwingen nicht über. Federn nur, wo die Hand direkt führt (Wischen, Ziehen), mit höchstens 3 % Überschwingen.
- **Kurven.** `--e-out` für Auftritte (rund 80 % aller Bewegungen), `--e-io` für Bewegung auf dem Bildschirm, Abgänge beschleunigen.
  Räumliche Bewegung nie linear.
- **Dauern.** 220 ms Rückmeldung (`--t2`), 320 ms Karten (`--t3`), 600 ms Auftritte, 900 ms großer Auftritt. Auftritte sind 30 bis 50 %
  länger als Abgänge.
- **Auftritt.** Aufblenden, 24 px aufsteigen, von 0,98 auf 1 wachsen; versetzt um 60 bis 90 ms, zusammen höchstens 400 ms.
- **Welle statt Gleichtakt.** Viele kleine Teile (Lamellen, Chips, Kacheln) starten nach ihrem Abstand zum Auslöser, 12 bis 20 ms je
  Element, zusammen höchstens 400 ms.
- **Drei Ebenen je Szene.** Hauptbewegung (der das Auge folgt), Nebenbewegung (Schatten und Licht folgen 50 ms später), Umgebung (Licht
  atmet in 6 bis 10 s, Staub treibt). Fehlt eine Ebene, wirkt es flach.
- **Der Held ruht, Trabanten bewegen sich** (1, 13, 16, 17). Schwebeteile treiben phasenversetzt: Ausschlag 6 px und ±1,5°, Periode 7
  bis 9 s. Beim Scrollen bleiben sie träge zurück (Tempo in px/s mal 0,02, höchstens 16 px) und kehren in 800 ms gedämpft zurück, ohne
  Überschwingen; ihr Schatten folgt 50 ms später.
- **Ebenen-Parallaxe** (18, erweitert docs/GESTALTUNG.md): Hinten bleibt zurück, vorn eilt voraus, 4 bis 12 % der Bühnenhöhe, am
  Telefon 16 bis 48 px. Was hinter Glas liegt, etwa die Erde im Bullauge, bleibt doppelt so weit zurück wie sein Rahmen. Höchstens fünf
  bewegte Ebenen je Bildschirm. Nur, um am Motiv vorbeizuschauen, nie als Schmuck.
- **Vorgang statt Spektakel** (14, 16). Bewegung zeigt einen Vorgang mit Richtung: Maß nehmen, die Anfrage fällt ins Postfach.
- **Ein-Drittel-Regel.** Höchstens ein Drittel der Elemente bewegt sich gleichzeitig. Keine Bewegung läuft über mehr als ein Drittel des
  Bildschirms ohne Zwischenschritt.
- **Scrollen erzählt.** Szenen hängen am Fortschritt eines Abschnitts (0 bis 1); am Telefon hält eine feste Bühne bis zu zwei
  Bildschirmhöhen. Eine Objektszene hat höchstens vier Kapitel mit je einer Veränderung. Das Riesenwort wandert am Scrollen 32 px
  seitwärts je Abschnitt. Das Scrolltempo wird nie verändert.
- **Kapitel.** Abschnitte 01 bis 04 mit einer feinen Anzeige wie ein Maßstab mit Millimeterstrichen, der aktive Abschnitt grün. Unser
  Gegenstück zum Tacho bei Dropbox.
- **Mikrointeraktion.** Die Cream-Pille drückt wie in docs/GESTALTUNG.md (0,98), ihr Pfeil rückt bei Berührung 4 px vor und zurück
  (220 ms). Schalter (10): Der Knopf wächst beim Halten auf 1,12, dehnt sich im Zug um 8 % und rastet mit höchstens 3 % Feder in 320 ms
  ein.
- **Schleifen nur mit Reaktion** auf Scrolltempo, Berührung oder Lichtkegel, nie gleichförmig. Was länger als fünf Sekunden läuft, hat
  einen Pause-Knopf (WCAG 2.2.2).
- **Kleine Animationen** wie Haken und Erfolg mit Lottie; lottie_light liegt schon in web/vendor.
- **Ruhige Fassung** zeigt das Endbild jeder Szene, vollständig lesbar: Ebenen stehen, Schweben ist aus, die Explosionsansicht offen und
  beschriftet, die Bildfolge im Schlüsselbild.

### 3.6 Effekte und Technik

16 der 21 Vorbilder kommen ohne Video und WebGL aus: Der Glanz steckt im Material. Darum zuerst Stufe 1.

| Effekt | Stufe | Technik | Ersatz |
|---|---|---|---|
| Glas über Bildern | 1 | `backdrop-filter`, nie animiert | deckende Fläche |
| Licht mit Quelle, Halo | 1 | radiale Verläufe, `mix-blend-mode: screen` | ohne Licht |
| Held in Ebenen | 1 | Freisteller als AVIF oder WebP mit Alpha, 780 px breit, höchstens 120 KB je Ebene; `transform` am Scrollfortschritt | ein Bild |
| Schwebeteile | 1 | CSS-Animation über `transform`, Versatz aus dem Scrolltempo | stehen |
| Maßlinie zeichnet sich, Wert zählt hoch | 1 | SVG `stroke-dashoffset`; die Endzahl steht im HTML | fertige Linie |
| Messraster | 1 | CSS-Hintergrund | gleich |
| Gedrehte Karten mit Scrollversatz | 1 | `transform` am Scrollfortschritt | ruhig gedreht |
| Gewölbte Leiste (Mitte groß, Rand gedreht und unscharf) | 1 | `perspective`, `rotateY` je Abstand zur Mitte | flache Reihe |
| Explosionsansicht | 1 | Ebenen aus dem Fenstermodell gerendert, `translateY` am Scroll, Führungslinien als SVG, Beschriftung als Text, zusammen höchstens 400 KB | auseinandergezogen und beschriftet |
| Video-Schleife (Kling) | 1 | H.264 720 × 1280, 4 bis 6 s, höchstens 1 MB, `muted playsinline loop preload="none"` ohne `autoplay`; Start per JavaScript nur im Bild, ein Video zugleich, Pause-Knopf. Licht und Glas auf Schwarz erzeugt, mit `screen` über den Grund gelegt | Poster (Endbild) |
| Objekt dreht, öffnet oder zerlegt sich | 2 | Bildfolge auf `<canvas>` wie bei Apple: höchstens 60 Bilder à 720 px und 25 KB, `createImageBitmap`, etwa zehn dekodiert halten. Nie `currentTime` eines Videos scrubben, das ruckelt auf Android | Einzelbild |
| Foto mit Tiefe (2,5-D) | 2 | WebGL mit Tiefenkarte zum Foto | Foto mit Parallaxe |
| Staub im Lichtkegel | 2 | Canvas, höchstens 60 Teilchen | ohne |
| Live-3-D | 2 | nur mit `buehne.js`, nachgeladen | Bildfolge oder Einzelbild |

- **Schwere 3-D-Objekte** als vorgerenderte Bildfolge statt als Live-Modell laden, so wie Apple seine Produkte drehen lässt.
- **Budget.** Am Telefon höchstens 300 KB bis zum ersten Bild (das Motiv mit `fetchpriority="high"`), je Szene höchstens 1,5 MB,
  nachgeladen, wenn der Abschnitt naht, je Seite höchstens 5 MB. Schleifen laufen nur, solange sie im Bild sind.
- **Scrollen.** `animation-timeline: view()`, wo der Browser es kann (läuft im Compositor), sonst `Scroll.binden`. `will-change` nur
  während der Szene: Eine Vollbildebene kostet rund 10 MB Grafikspeicher. Abschnitte, aus denen etwas ausbricht, schneiden mit
  `overflow-x: clip` ab, nicht mit `hidden` (das bricht `position: sticky`). Laufbänder sind Web-Animationen, das Scrolltempo ändert
  nur ihre `playbackRate`. Reihen rasten mit `scroll-snap`.
- **Nie animieren:** `filter` und `backdrop-filter`. Unschärfe wird ins Bild gerechnet.
- **Ersatzfassungen.** Ohne JavaScript Endlage, Text und Poster; bei „weniger Bewegung“ das Endbild; bei `prefers-reduced-transparency`
  deckendes Glas; auf schwachen Geräten (`navigator.deviceMemory` bis 4, `saveData`) Einzelbild statt Bildfolge und Poster statt Video.
- **CSP.** Nur eigene Herkunft: Video aus Blob-URLs, Blob-Worker und WebAssembly sind gesperrt. Damit fallen three.js-Lader mit Draco
  und KTX2 weg.

## 4. Bausteine des Stils

Muster, aus denen sich Elemente zusammensetzen. Welches Element entsteht, sagt der Inhaber. In Klammern die Vorbilder.

1. **Glas-Nachricht.** Wie eine Mitteilung auf dem iPhone: Glas nach 3.1, Radius 18 px, links ein grüner Punkt, Titel 15 px fett, Zeile
   13 px, Zeit rechts. Gestapelt zeigen die hinteren nur ihre Kante; eine neue Nachricht schiebt sich oben davor. Licht der Bildquelle
   auf der Kante, die zur Quelle zeigt.
2. **Medienkarte.** Echtes Bild in einem Rahmen aus Fläche 2 (#262626, 6 px), Radius 12 px, gedreht, Schatten `--float`; darunter ein
   kleines Dateizeichen und der Dateiname. Video mit Zeitcode und Abspielknopf. (2)
3. **Zahlenkachel.** Fläche #1f1f1f mit Ring, große Zahl, Einheit, eine Zeile, eine kleine Anzeige (Punktring, Balken, Strichskala).
   Eine Kachel je Reihe darf Licht tragen. (6, 8, 12)
4. **Maßlinie.** Haarlinie mit Endstrichen und Schrägstrichen wie in einer Bauzeichnung, der Wert mittig auf dunklem Glas, an
   senkrechten Linien gedreht. Zeichnet sich beim Auftritt, der Wert zählt mit. Als Detail an Bildern nie über Gesicht oder Hände.
5. **Messraster.** Millimeterpapier nach 3.1 unter technischen Abschnitten, zum Rand hin ausgeblendet. (4)
6. **Explosionsansicht.** Höchstens fünf Schichten eines Objekts schweben auseinander, Schicht i wandert i × 28 px (am Schreibtisch 48)
   auf einer Achse von 30°. Jede trägt ihre Beschriftung 01 bis 05 an einer Führungslinie, die bei 70 % ihres Wegs erscheint, fachlich
   richtig benannt. Hängt am Scrollen, die Bühne höchstens 1,5 Bildschirmhöhen; in der ruhigen Fassung auseinandergezogen und
   beschriftet. (5)
7. **Kapitelanzeige.** Zahlen 01 bis 04 in der Technikstimme über einem Maßstab mit Millimeterstrichen; der Fortschritt wächst grün mit.
   An Reihen der Zähler „02 / 03“ mit Punkten, der aktive grün. (1, 3, 9, 20)
8. **Geräte-Bühne.** Telefon vor einem Browserfenster mit echten Bildschirmen, Studiolicht von oben, weicher Bodenschatten. (6, 11)
9. **Leiste.** Kacheln mit echten Bildern statt Strichsymbolen, gewölbt, ein Lichtkegel in der Mitte benennt das Element darunter,
   Tempo reagiert aufs Scrollen. (21)
10. **Riesenwort.** Ein Wort hinter dem Motiv, 120 bis 200 px, #262626 auf dem Grund, vom Motiv zu 20 bis 40 % verdeckt, der Anfang
    frei. Nur als Grafik, wandert am Scrollen. (6, 13, 15, 16)
11. **Bühnenecken.** Drei Ecken der Bühne tragen Mikrotexte in der Technikstimme: „01 / 04“, ein Maß, das Paket. Nur echte Werte.
    (3, 4, 6, 9, 13, 20)
12. **Handlungspille.** Cream, 52 px, Verb, Pfeil im Kreis innen rechts, der bei Berührung vorrückt; daneben höchstens ein Ring-Knopf.
    (2, 8, 11, 12, 15, 16)
13. **Lichtsockel.** Unter einem freigestellten Produkt ein flaches, weiches Lichtfeld statt eines Schattens, das Motiv darüber im
    Oberlicht. (20, 21)
14. **Schwebeteile.** Kleine echte Dinge um den ruhenden Helden, beim Astronauten Flieger, Handy und Bleistift; Bewegung nach 3.5.
    (1, 13, 16, 17)
15. **Paketkarte.** Name, ein Satz bis zehn Wörter, Preis in der Titelrolle, höchstens fünf Haken, Knopf, Beispielbild; alles Weitere
    gehört in den Vergleich. Am Telefon zum Wischen, das empfohlene Paket vorn, die Nachbarn zurückgenommen. (3, 4, 21)

## 5. Grenzen

Was die Vorbilder zeigen, wir aber nicht übernehmen:

- Keine Tonwelten und fremden Farbwelten (6, 7, 13, 15, 17), keine bunten Verläufe, kein Farbwechsel je Abschnitt, keine helle Bühne.
- Kein Glas ohne Bild dahinter, kein Leuchten ohne Quelle, nicht mehr als eine Lichtfarbe je Bildschirm.
- Keine weiteren Schriften (Serife 14 bis 16 und 20, Schreibschrift 17, Pixelschrift 5), keine Größen über 40; am Schreibtisch nichts
  überdimensionieren.
- Kein Einstieg ohne Handlung oder nur mit Scrollhinweis (5, 9, 13, 14, 17, 21), keine Stimmung und kein bloßer Name als Überschrift,
  keine leeren Knopfwörter, nie zwei gleich starke Knöpfe (7, 11).
- Keine Textwände, kein Inhaltsverzeichnis, kein Blogton auf Verkaufsflächen. Kein Englisch und kein Webdesign-Fachwort, KI nicht als
  Schlagwort, keine Angeberei mit Bauzeiten (5, 7, 8, 21).
- Keine gleichförmigen Laufbänder (19), keine kreisenden Ringe ohne Reaktion (3, 7), kein verändertes Scrolltempo und kein
  Smooth-Scroll (9, 21), nichts blinkt oder hüpft.
- Keine Echtzeit-3-D-Welten (9, 21), kein Video mit Alphakanal (16), keine Lichtbrechung als Filter (10), kein eigener Mauszeiger,
  keine Zeiger- oder Lageparallaxe (19 bis 21; der Lagesensor braucht unter iOS eine Erlaubnis). Keine Partikelströme, berstenden
  Schirme oder zerfallenden Buchstaben (14, 16, 17).
- Keine beliebigen 3-D-Objekte (3, 7), keine gezeichneten Figuren (1, 18), keine Witzfiguren (19).
- Keine erfundenen Belege: Avatarstapel und „+323“ (15), Sternwertung ohne Quelle (11), anonyme Zitate (7, 20), Schauzahlen (8, 15),
  fremde Marken (11). Markenvarianten nur als „Beispiel“ beschriftet; Zitate, Logos und Kundenzahlen erst, wenn es sie wirklich gibt.

## 6. Prüfen gegen die Richtung

- **Drei-Sekunden-Test am Telefon:** Was ist es, für wen, was kostet es, was tue ich jetzt? Ohne Scrollen sichtbar: Kicker,
  Überschrift, ein Satz, Cream-Pille, ein Beweis.
- Ein Held je Bildschirm? Licht nur mit Quelle? Bricht auf der Seite etwas aus seinem Rahmen?
- Messen mit `python3 -I .claude/skills/premium-gestaltung/farbanteil.py bild.png` an Bildschirmfotos bei 390 × 844: mindestens 80 %
  unbunt, höchstens 5 % kräftig, farbig über 0,3 %; der erste Bildschirm 60 bis 85 % dunkel und höchstens 8 % hell. Ein großes Foto
  drückt den unbunten Anteil, dort zählt, dass die Oberfläche selbst unbunt bleibt. Ganz ohne Akzent ist ein Bildschirm meist flach.
- Eine Cream-Fläche je Bildschirm, auch keine Cream-Leiste neben der Pille?
- Zwei Schriftstimmen, Überschrift höchstens sechs Wörter im Klartext, höchstens drei Zeilen Lesetext je Block, genau ein grünes Wort?
- Jede Zahl mit Einheit, Bezug und Quelle? Kein Tippfehler, auch nicht in Grafiken: Das Riesenwort „Dashbaord“ (6) wirkt auf den
  Fensterbauer wie ein schiefer Flügel.
- Echtes Material statt Symbolen, fachlich richtig benannt?
- Bewegung mit drei Ebenen, Ein-Drittel-Regel, höchstens fünf bewegte Ebenen, Pause-Knopf an langen Schleifen, ruhige Fassung
  vollständig?
- Budget eingehalten (300 KB bis zum ersten Bild, 1,5 MB je Szene, 5 MB je Seite)? Ersatz ohne JavaScript, bei weniger Transparenz und
  auf schwachen Geräten?

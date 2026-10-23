# Designrichtung eeziframes

Stand 23.10.2026. Abgeleitet aus neun Vorbildern, die der Inhaber geschickt hat, und aus der bisherigen Gestaltung. Gilt für alles
Sichtbare auf den Verkaufsflächen (Startseite, Seite für Fensterbauer, Köpfe der Ratgeber) und ist der Maßstab für jedes neue Element.
Die App behält die strenge Fassung aus docs/GESTALTUNG.md und übernimmt von hier Schrift und Bewegung. Diese Richtung sagt, wie etwas
aussehen soll. Was gebaut wird, bestimmt weiter der Inhaber (SKILL.md, Abschnitt 1). Eine Stilkachel mit allen Bausteinen liegt in
stilkachel/ neben dieser Datei: die Seite selbst (index.html, wie man sie ansieht, steht in ihrem Kopf) und die Bildschirmfotos 1 bis 7.

## 1. Leitsatz

**Ruhig wie Apple, präzise wie ein Aufmaß, mit Licht und Tiefe wie in einer Raumstation.**

1. **Ruhige, dunkle Bühne.** Viel Unbunt, viel Luft, kurze Sätze, eine Handlung je Bildschirm.
2. **Ein Held je Bildschirm.** Ein großes Motiv trägt den Bildschirm: eine Figur, das Fenster aus unserem Modell oder ein Gerät mit dem
   echten Konfigurator. Alles andere ordnet sich unter.
3. **Licht und Tiefe statt Flächen.** Ebenen hintereinander, Glas über Bildern, Licht aus einer Quelle im Bild, und etwas bricht aus
   seinem Rahmen.
4. **Präzision im Detail.** Maßlinien, Messraster, Ziffern in Reih und Glied, Dateinamen: Details aus der Welt des Aufmaßes, sauber bis
   auf den Pixel.

**Apple-ähnlich heißt für uns:** das Produkt groß und mit Licht modelliert; ein Gedanke je Bildschirm; kurze, fette Überschrift, grauer
Lesetext mit hellen Schlüsselwörtern; Szenen, die am Scrollen hängen (das Fenster dreht sich, öffnet sich, zerlegt sich, während der Text
wechselt); Kacheln für die Fakten; Glas über Bildern; langsame, weiche Auftritte; eine klare Handlung.

## 2. Analyse der Vorbilder

Methode wie im Skill „Design DNA“ (zanwei/design-dna, MIT): je Vorbild drei Ebenen, nämlich Werte (Farbe, Schrift, Raster, Form), Stil
(Wirkung, Komposition, Bild) und Effekte (3-D, Licht, Glas, Bewegung). Farben werden gemessen, nicht geschätzt (farbanteil.py).

| Vorbild | Was zu sehen ist | Warum es wirkt | Was wir übernehmen |
|---|---|---|---|
| Dropbox Dash × McLaren, Startbild | Gezeichneter Fahrer bricht aus einem dunklen Rahmen; echte Dokumente, Fotos und eine Antwortkarte schweben vor und hinter ihm, am Rand angeschnitten; orange Diagonalen mit Rasterpunkten; harter Schnitt ins Weiß; Zitat in großer Grotesk | Figur und echtes Produkt in einem Bild, Ebenen, eine große Markengeste | Figurenwelt mit echten Oberflächen um die Figur; aus dem Rahmen brechen; höchstens eine große Farbgeste je Seite |
| Dropbox Dash, Kartenreihe | Suchfeld in der Mitte, darüber und darunter leicht gedrehte Dateikarten (Foto, Kalender, Video mit Zeitcode, PDF) mit Dateinamen, an beiden Rändern angeschnitten | Die Funktion wird als Szene gezeigt statt beschrieben | „Was in jeder Anfrage steht“ als Szene: die Anfrage in der Mitte, Aufmaßblatt, Fotos und Modell drumherum |
| Skill „Motion Design“ (LottieFiles) | Dunkler Grund, Titel in warmem Weiß, ein Akzent für Punkte und Zähler, Haarlinien, Schrift vor und hinter einem Objekt | Strenge Ordnung, ein Akzent | Bestätigt unsere Basis (dunkel, Cream, ein Signal); Zähler „01 / 04“, Haarlinien; Bewegungsregeln in 3.5 |
| Skill „Design DNA“ | Zwei Webseiten überlappen auf einem Punktraster | Tiefe durch Überlappung, Raster als Technik-Textur | Analysemethode; Geräte-Bühne mit Überlappung; Messraster |
| textura.eu | Explosionsansicht der Jackenschichten, Beschriftung mit Linie, Versalien in Monospace, Zeilenraster wie ein Bildschirm | Technik wird sichtbar und sinnlich | Explosionsansicht dessen, was der Konfigurator erfasst; Beschriftung an Maßlinien; Technikstimme |
| juicelab, Dashboard | Monitor im hellen Studio mit Bodenschatten, blasses Riesenwort dahinter, Kacheln mit großen Zahlen, Verläufe als Licht | Produkt im Studio, die Zahl als Held | Geräte im Studiolicht, Riesenwort als Grafik, Zahlenkacheln. Nicht: Pink, Lila, bunte Verläufe |
| seanaiux, DE</HELPERS | Ganze Seite in einem Violett, 3-D-Ringe mit leuchtender Kugel, Glaskarte mit Kundenstimme über dem Objekt | Licht von innen, Glas über Tiefe | Glas über Bildern, Licht mit Quelle. Nicht: fremde Farbwelt, beliebige 3-D-Objekte |
| viktoroddy, Axle | Kacheln mit 4K, −42 und 88 %, weißes Stadtmodell als Held, zwei kurze Sätze mit Punkt, Navigation aus Pillen | Fakten als Kacheln, ein ruhiges Modell als Held | Kacheln für Zahlen; unser Fenster als ruhiger Held; kurze Sätze |
| kryntix, KAGE | WebGL-Szene mit Tempel, Mond, Gras und Blüten, riesige Buchstaben stehen in der Szene, Kapitel 01 bis 04, „Scroll to enter“ | Der Besuch wird zur Reise, die Schrift gehört zur Welt | Kapitel mit feiner Anzeige; Riesenwort zwischen Ebenen; Staub und Licht sparsam |

**Gemessen** mit farbanteil.py, Anteil der Fläche (textura und Axle fehlen, dort ist der Bildschirm abfotografiert):

| | unbunt | farbig | kräftig |
|---|---|---|---|
| Dropbox, Startbild | 60 % | 27 % | 24 %, Orange als Markengeste |
| Dropbox, Kartenreihe | 83 % | 12 % | 10 %, fast nur aus den Fotos |
| Motion Design | 84 % | 6 % | 5 %, nur das Objekt |
| Design DNA | 78 % | 1 % | unter 1 % |
| juicelab | 81 % | 16 % | 5 % |
| seanaiux | 2 % | 25 % | 22 %, eine Farbwelt |
| KAGE | 23 % | 12 % | 5 % |
| unsere Seite heute, erster Bildschirm | 68 % (Foto) | 4 % | unter 1 % |
| unsere Seite heute, zweiter und dritter Bildschirm | 100 % | 0 % | 0 % |
| Stilkachel, sieben Bildschirme | 68 bis 99 % | 0,4 bis 7,5 % | 0 bis 5,6 % |

**Was alle gemeinsam haben**

1. Ein Held je Bildschirm, groß, mittig oder rechts; Text links oder darunter.
2. Ebenen mit Tiefe; fast immer bricht etwas aus seinem Rahmen oder steht zwischen zwei Ebenen.
3. Echte Oberflächen des Produkts als Beweis, keine Symbole.
4. Viel Unbunt, ein Akzent unter 5 % der Fläche, Licht mit einer Quelle. Große Farbe nur als bewusste Geste.
5. Zwei Schriftstimmen: groß, fett und knapp für die Aussage; klein, gesperrt und technisch für Beschriftungen und Zahlen.
6. Textur im Dunkeln: Raster, Punkte, Zeilen, Korn. Keine Fläche ist nur eine Farbe.
7. Bewegung als Reise: Kapitel, Fortschritt, Szenen, die am Scrollen hängen.
8. Fakten als Kacheln mit einer großen Zahl und einer kleinen Anzeige.

**Warum unsere Seite heute „nach 2015“ wirkt**

- Ab dem zweiten Bildschirm kein Bild, kein Licht, kein Produkt: 100 % unbunt, lauter gleich flache Karten.
- Textblöcke („Kurz gesagt“, „Die Idee“) statt Szenen.
- Strichsymbole tragen die Leiste.
- Nur eine Schriftstimme; die technische fehlt.
- Die Bewegung läuft gleichförmig durch und erzählt nichts.

## 3. Die Richtung im Einzelnen

### 3.1 Farbe und Licht

- **Die Tokens bleiben.** Grund #161616, Flächen #1f1f1f und #262626, Text #f3f2ee, Cream für die Hauptaktion, Grün als einziges Signal.
  Neue Farben gibt es nicht.
- **Anteile je Bildschirm.** Mindestens 80 % unbunt, kräftige Farbe höchstens 5 %, aber nie ganz ohne Farbe: Bild, Licht oder Signal
  müssen da sein (farbig über 0,3 %). Ausnahmen: große Fotos und eine bewusste Markengeste je Seite, etwa das Cream-Band oder ein großes
  Lichtfeld. Unser Grün ist so zart, dass es als farbig zählt, nicht als kräftig.
- **Bedeutungsfarben.** Orange (Maueröffnung) und Blau (Element) nur in technischen Darstellungen und mit derselben Bedeutung wie im
  Konfigurator: Maßlinien, Explosionsansicht, Skizzen. Das ist unser Gegenstück zum McLaren-Orange, Farbe aus dem Produkt.
- **Licht statt Schmuck.** Ein Verlauf ist erlaubt, wenn er Licht aus einer Quelle im Bild ist: Bullauge, Erde, Bildschirm, ein
  leuchtendes Signal. Radial und weich, 8 bis 20 % Deckkraft, nur in Cream (Kabinenlicht), Element-Blau (Erdlicht) oder Grün (Signal).
  Ein Verlauf ohne Quelle bleibt verboten.
- **Glas** nur über Bildern oder 3-D-Szenen: #1f1f1f mit 55 bis 65 % Deckkraft, Weichzeichner 20 bis 24 px, Sättigung 140 %, oben eine
  Lichtkante (1 px, Weiß 10 %), Schatten `--float`. Ohne `backdrop-filter` eine deckende Fläche. Auf dem Grund ohne Bild bleiben die
  Karten beim 2-px-Ring.
- **Schatten** wirft weiter nur, was schwebt: Glas, gedrehte Medienkarten, Geräte.
- **Textur.** Messraster wie Millimeterpapier (fein alle 8 px, kräftig alle 40 px, Weiß 3 bis 5 %) in technischen Abschnitten. Korn mit
  2 bis 3 % in großen Lichtflächen gegen Streifen.

### 3.2 Schrift

- **Inter und die Größen bleiben:** 13, 15, 17, 24 und 40, am Telefon 32.
- **Bühnenstimme.** Überschriften in Inter 800, Laufweite −0,03 em, Zeilenabstand 1,05, am Telefon höchstens drei Zeilen, genau ein
  grünes Wort. Zwei kurze Sätze mit Punkt sind erlaubt.
- **Technikstimme (neu).** 13 px, Inter 600, Ziffern gleich breit (`font-variant-numeric: tabular-nums`, mit unserer Inter-Datei
  geprüft). Kicker, Kapitel „01 / 04“ und Beschriftungen in Versalien mit Sperrung 0,12 em; Maße („1.230 × 1.480 mm“), Dateinamen und
  Zeitangaben behalten ihre Schreibweise, Sperrung 0,02 em. Farbe `--muted`, aktiv Grün. Die Marke bleibt auch hier klein: eeziframes.
- **Lesetext wie bei Apple.** 17 px in `--text2`, das Entscheidende darin in `--text` und fett. Höchstens drei Zeilen je Block auf
  Verkaufsflächen; Längeres gehört in Ratgeber und Fragen.
- **Zahl als Held.** 40 px, am Telefon 32, in 800; die Einheit in 15 px und `--muted` direkt daneben.
- **Riesenschrift** nur als Grafik (SVG-Pfad oder Bild, `aria-hidden`), höchstens einmal je Seite, etwa ein Wort hinter dem Motiv. Vor
  dem ersten Einsatz braucht die Prüfsuite dafür eine Ausnahme, sie misst sonst jede Schrift.

### 3.3 Raum und Komposition

- **Ein Gedanke je Bildschirm** am Telefon (390 × 844): Held, Überschrift, höchstens ein Satz, eine Handlung.
- **Ebenen.** Hintergrund, dann gegebenenfalls das Riesenwort, das Motiv, Glas, zuletzt Licht und Staub. Je Seite bricht mindestens
  einmal etwas aus seinem Rahmen: eine Figur über die Bildkante, eine Karte über die Abschnittsgrenze.
- **Anschnitt.** Bilder, Kartenreihen und Leisten laufen bis an den Bildschirmrand und darüber hinaus, Text nie.
- **Kacheln für Fakten.** Am Telefon zwei Spalten (eine große über zwei kleinen), am Schreibtisch vier, Abstand 12 px. Eine Kachel hat
  eine Zahl, eine Zeile und eine kleine Anzeige.
- **Kartenreihen.** Um 2 bis 4° gedreht, 8 bis 24 px versetzt, darunter der Dateiname in der Technikstimme, Schatten `--float`.
- **Abstände.** Zwischen Abschnitten am Telefon 96 px, am Schreibtisch 128 px; innen 8, 12, 16 und 24 px wie bisher (4-px-Raster).
- **Schreibtisch.** Text links über fünf Spalten, Held rechts über sieben, angeschnitten bis zum Fensterrand. Höchstmaße wie bisher,
  nichts überdimensionieren.

### 3.4 Bildwelt

Drei Quellen mit festen Rollen:

1. **Figurenwelt** für Gefühl und Humor: Astronaut, Waschbär, Bär in warmem Filmlicht, erzeugt mit Flux und Kling. Unser Gegenstück zum
   gezeichneten McLaren-Fahrer. Eine Figur je Bildschirm, mit einer echten Lichtquelle (Bullauge, Fenster, Lampe).
2. **Produkt** als Beweis: echte Bildschirme der App, Renders aus unserer WebGL-Bühne (`/app/?gl=voll`, siehe 3.6), das echte
   Aufmaßblatt (web/bilder/tour-aufmassblatt-*.webp). Produktbilder kommen aus unserem Modell, nie aus fremden Bildern.
3. **Alltag des Fensterbauers** für Nähe: Fotos aus Anfragen, Werkstatt, Baustelle. Fehlt noch, kommt vom Inhaber.

Strichsymbole nur noch als Nebensache bis 24 px, nie als Hauptträger. Nicht: Stockfotos, beliebige 3-D-Objekte wie Ringe, Kugeln oder
Blasen, Bilder mit Text oder Wasserzeichen.

### 3.5 Bewegung

Grundlage ist der Skill „Motion Design“ (LottieFiles, MIT), Persönlichkeit „Premium“.

- **Ruhig.** Flächen schwingen nicht über. Federn nur, wo die Hand direkt führt (Wischen, Ziehen), mit höchstens 3 % Überschwingen.
- **Kurven.** `--e-out` für Auftritte (rund 80 % aller Bewegungen), `--e-io` für Bewegung auf dem Bildschirm, Abgänge beschleunigen.
  Räumliche Bewegung nie linear.
- **Dauern.** 220 ms Rückmeldung (`--t2`), 320 ms Karten (`--t3`), 600 ms Auftritte (neu `--t4`), 900 ms großer Auftritt
  (neu `--t5`). Auftritte sind 30 bis 50 % länger als Abgänge.
- **Auftritt.** Aufblenden, 24 px aufsteigen, von 0,98 auf 1 wachsen; versetzt um 60 bis 90 ms, zusammen höchstens 400 ms.
- **Drei Ebenen je Szene.** Hauptbewegung (der das Auge folgt), Nebenbewegung (Schatten und Licht folgen 50 ms später), Umgebung (Licht
  atmet in 6 bis 10 s, Staub treibt). Fehlt eine Ebene, wirkt es flach.
- **Ein-Drittel-Regel.** Höchstens ein Drittel der Elemente bewegt sich gleichzeitig. Keine Bewegung läuft über mehr als ein Drittel des
  Bildschirms ohne Zwischenschritt.
- **Scrollen erzählt.** Szenen hängen am Fortschritt eines Abschnitts (0 bis 1); am Telefon hält eine feste Bühne bis zu zwei
  Bildschirmhöhen. Das Scrolltempo wird nie verändert.
- **Kapitel.** Abschnitte 01 bis 04 mit einer feinen Anzeige wie ein Maßstab mit Millimeterstrichen, der aktive Abschnitt grün. Unser
  Gegenstück zum Tacho bei Dropbox.
- **Schleifen nur mit Reaktion** auf Scrolltempo, Berührung oder Lichtkegel, nie gleichförmig.
- **Kleine Animationen** wie Haken und Erfolg mit Lottie; lottie_light liegt schon in web/vendor.
- **Ruhige Fassung** zeigt das Endbild jeder Szene, vollständig lesbar.

### 3.6 Effekte und Technik

| Effekt | Stufe | Technik | Ersatz |
|---|---|---|---|
| Glas über Bildern | 1 | `backdrop-filter` | deckende Fläche |
| Licht mit Quelle | 1 | radiale Verläufe, `mix-blend-mode: screen` | ohne Licht |
| Maßlinie zeichnet sich, Wert zählt hoch | 1 | SVG `stroke-dashoffset` | fertige Linie |
| Messraster | 1 | CSS-Hintergrund | gleich |
| Gedrehte Karten mit Scrollversatz | 1 | `transform` am Scrollfortschritt | ruhig gedreht |
| Gewölbte Leiste (Mitte groß, Rand gedreht und unscharf) | 1 | `perspective`, `rotateY` je Abstand zur Mitte | flache Reihe |
| Fenster dreht, öffnet, zerlegt sich | 2 | vorgerenderte Bildfolge aus unserem Modell auf `<canvas>`, wie Apple | Einzelbild |
| Foto mit Tiefe (2,5-D) | 2 | WebGL mit Tiefenkarte zum Foto | Foto mit Parallaxe |
| Staub im Lichtkegel | 2 | Canvas, höchstens 60 Teilchen | ohne |

- **Das Fenster als Held** nicht als Live-Modell laden: app.js allein hat rund 800 KB. Besser eine Bildfolge (etwa 48 Bilder WebP) aus
  der WebGL-Bühne rendern, wie Apple seine Produkte dreht. Einzelbilder und Folgen: `/app/?gl=voll`, Beispielfenster `demoProject()[0]`,
  Blickwinkel über `--rx` und `--ry` an `#w3d` (Vorlage: Abschnitt 20 in scripts/pruefen.mjs).
- **Budget.** Erster Bildschirm am Telefon höchstens 300 KB Bilder; WebGL und Bildfolgen erst laden, wenn der Abschnitt naht; Schleifen
  nur, solange sie im Bild sind.

## 4. Bausteine

1. **Glas-Nachricht.** Wie eine Mitteilung auf dem iPhone: Glas nach 3.1, Radius 18 px, links ein grüner Punkt, Titel 15 px fett, Zeile
   13 px, Zeit rechts. Drei gestapelt; die hinteren zeigen nur ihre Kante (kleiner, ohne Inhalt), eine neue Nachricht schiebt sich
   oben davor. Licht der Bildquelle auf der Kante, die zur Quelle zeigt.
2. **Medienkarte.** Echtes Bild in einem Rahmen aus Fläche 2 (#262626, 6 px), Radius 12 px, gedreht, Schatten `--float`; darunter ein
   Dateizeichen in der Bedeutungsfarbe (PDF Orange, Foto Blau) und der Dateiname („Aufmassblatt_Weber.pdf“). Video mit Zeitcode und
   Abspielknopf.
3. **Zahlenkachel.** Fläche #1f1f1f mit Ring, große Zahl, Einheit, eine Zeile, eine kleine Anzeige (Punktring, Balken, Strichskala).
   Eine Kachel je Reihe darf Licht tragen.
4. **Maßlinie.** Haarlinie mit Endstrichen und Schrägstrichen wie in einer Bauzeichnung, in Orange (Maueröffnung) oder Blau (Element);
   der Wert mittig auf dunklem Glas, an senkrechten Linien gedreht. Zeichnet sich beim Auftritt, der Wert zählt mit. Als Detail an
   Bildern (am Bullauge des Astronauten), nie über Gesicht oder Hände.
5. **Messraster.** Millimeterpapier nach 3.1 unter technischen Abschnitten, zum Rand hin ausgeblendet.
6. **Explosionsansicht.** Die Schichten des Fensters schweben auseinander: Maueröffnung, Element mit Glas, Sonnenschutz, Fensterbank,
   jede mit Beschriftung an einer Führungslinie. Hängt am Scrollen; in der ruhigen Fassung auseinandergezogen und beschriftet.
7. **Kapitelanzeige.** Zahlen 01 bis 04 in der Technikstimme über einem Maßstab mit Millimeterstrichen; der Fortschritt wächst grün mit.
8. **Geräte-Bühne.** Telefon mit dem echten Konfigurator vor einem Browserfenster mit „ihr-name-fenster.de“, Studiolicht von oben,
   weicher Bodenschatten, dahinter gegebenenfalls das Riesenwort.
9. **Leiste, neu gedacht.** Glaskacheln mit Renders aus unserem Modell statt Strichsymbolen, gewölbt, ein Lichtkegel in der Mitte
   benennt das Element darunter, Tempo reagiert aufs Scrollen.
10. **Riesenwort.** Ein Wort hinter dem Motiv, 120 bis 200 px, #1f1f1f bis #262626 auf dem Grund, vom Motiv teilweise verdeckt. Nur als
    Grafik.

## 5. Übertragung auf die Seite für Fensterbauer

Nur Vorschläge. Gebaut wird ein Abschnitt, wenn der Inhaber ihn beauftragt; was er dann beschreibt, geht vor.

| Abschnitt | heute | in der Richtung |
|---|---|---|
| Startbild | Foto, dunkle Nachrichtenkarte, Überschrift, Haken-Chips | Glas-Nachrichten, Licht aus dem Bullauge auf ihren Kanten, eine Maßlinie am Bullauge, feiner Staub im Lichtkegel; auf Wunsch das Riesenwort hinter dem Astronauten |
| Kurz gesagt | Absatz mit rund 60 Wörtern | Zwei Zeilen mit hellen Schlüsselwörtern; der Rest wird zu Bildern in den folgenden Abschnitten |
| Leiste 1 | Strichsymbole mit Namen, gleichförmig | Glaskacheln mit Renders, gewölbt, Lichtkegel in der Mitte |
| Leiste 2 | Cream-Band mit Zahl und Text | Bleibt das Cream-Band als Markengeste; Zahlen als Held mit kleiner Anzeige |
| Die Idee | Textblöcke in gleichen Karten | Geräte-Bühne mit dem echten Konfigurator unter „ihr-name-fenster.de“, darunter drei Zahlenkacheln |
| So funktioniert es | Liste | Kapitel 01 bis 04 mit fester Bühne: das Telefon zeigt den Schritt, der Text wechselt |
| Was in jeder Anfrage steht | Liste | Szene wie bei Dropbox: die Anfrage in der Mitte, Aufmaßblatt, Fotos, Modell und Maße als gedrehte Karten drumherum |
| neu, auf Wunsch | – | Explosionsansicht: was der Konfigurator erfasst, Schicht für Schicht |
| Pakete | Karten zum Wischen mit Beispielseite | Bleiben; Gegenlicht hinter „Empfohlen“, die Beispielseite als gedrehte Medienkarte mit der Domain darunter |

## 6. Grenzen

- Keine fremden Farbwelten (Lila, Pink, bunte Verläufe), keine beliebigen 3-D-Objekte.
- Kein Glas ohne Bild dahinter, kein Leuchten ohne Quelle, nicht mehr als eine Lichtfarbe je Bildschirm.
- Keine Textwände, kein Inhaltsverzeichnis, kein Blogton auf Verkaufsflächen.
- Keine gleichförmigen Laufbänder, kein verändertes Scrolltempo, nichts blinkt oder hüpft.
- Am Schreibtisch nichts überdimensionieren; die Schriftgrößen enden bei 40.
- Keine erfundenen Belege: Zitate, Logos und Kundenzahlen erst, wenn es sie wirklich gibt.

## 7. Prüfen gegen die Richtung

- Ein Held je Bildschirm? Licht nur mit Quelle? Bricht auf der Seite etwas aus seinem Rahmen?
- Mindestens 80 % unbunt, höchstens 5 % kräftig, farbig über 0,3 %? Messen mit
  `python3 -I .claude/skills/premium-gestaltung/farbanteil.py bild.png` an Bildschirmfotos bei 390 × 844. Ein großes Foto drückt den
  unbunten Anteil, dort zählt, dass die Oberfläche selbst unbunt bleibt. Ganz ohne Akzent ist ein Bildschirm meist flach.
- Zwei Schriftstimmen, höchstens drei Zeilen Lesetext je Block, genau ein grünes Wort?
- Echtes Material statt Symbolen?
- Bewegung mit drei Ebenen, Ein-Drittel-Regel, ruhige Fassung vollständig?

## 8. Offen beim Inhaber

1. Riesenwort hinter dem Astronauten: ja oder nein. Dafür braucht es den Astronauten aus dem Sessel-Bild freigestellt (PNG mit
   Transparenz, gleiche Größe 1122 × 1402).
2. Das Fenster als 3-D-Held als vorgerenderte Bildfolge aus unserem Modell (Abschnitt 3.6).
3. Fotos aus dem Alltag eines Fensterbauers im Stil der Figurenwelt.

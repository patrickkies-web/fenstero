# Gestaltung

eeziframes ist ein Präzisionswerkzeug: Schrift führt, das Fenster ist das Bild, alles andere tritt zurück. Diese Seite ist die Regel; die Werte stehen als Tokens in `web/assets/gemeinsam.css` (lädt vor `app.css` und `portal.css`).

## System

**Marke.** eeziframes, immer klein geschrieben: auch am Satzanfang, in Titeln, in Versalzeilen (Eyebrows, Markenstreifen und Eyebrows im PDF) und in Dokumenteigenschaften. „eezi“ spricht sich wie „easy“, „frames“ sind die Rahmen; der Name funktioniert deshalb auch außerhalb Deutschlands. Wortmarke: „eezi“ in Black (900), „frames“ in Medium (500), gleiche Farbe, kein Abstand, nie umbrochen (`Marke.wort()` in `gemeinsam.js`, im PDF `wortmarke()` in `blatt.js`); daneben das Zeichen, weißes Fenster auf schwarzer Kachel. In HTML, das in Versalien stehen kann, steht die Marke in `.mk` (`Marke.klein()`), im PDF setzt `VERSAL()` alles groß außer der Marke; `translate="no"` schützt den Namen vor automatischen Übersetzern. Interne Namen bleiben (Worker und Repo `fenstero`, Speicher `aufmass.…`, Code-Kürzel `AM1`), damit Bereitstellung, gespeicherte Daten und Codes gültig bleiben.

**Wortspiel mit „eezi“.** Sparsam und nur dort, wo es etwas zusammenfasst: Claim und Startbilder, das Ende der Führung, Seitentitel und Vorschautexte, der Markenstreifen im PDF. Nie in Messanleitungen, Fehlermeldungen, Preisen, Rechtstexten, im Kundenlink eines Betriebs (dort steht der Betrieb, nicht wir) und nie zweimal auf einem Bildschirm.

| Stelle | Text |
|---|---|
| Startseite, Hauseigentümer (einziges h1 der Startseite, auch in der Textfassung) | „Fenster ausmessen. Selbst. eezi.“ |
| Startseite, Fensterbauer (Eyebrow) | „Für Fensterbauer · Erstaufmaß, ganz eezi“ |
| App, Startbild und Textfassung der App (Eyebrow) | „Fensterplanung, ganz eezi“ |
| Ratgeber, Übersicht (Eyebrow) | „Ratgeber · Fensterplanung, ganz eezi“ |
| Führung, letzter Schritt | „Fertig. Das war eezi.“ |
| Vorschau beim Teilen (`og:title`) | „eeziframes – Fensterplanung, easy gemacht“, „eeziframes – Fenster ausmessen, ganz eezi“, „Aufmaß ohne Anfahrt: eeziframes für Fensterbauer“ |
| Aufmaßblatt, Markenstreifen | „eeziframes · Fenster ausmessen. Selbst. eezi.“ |

Seitentitel (`<title>`) beginnen mit dem Suchbegriff und enden mit der Marke, ohne Wortspiel („Fenster ausmessen: kostenlose Aufmaß-App im Browser | eeziframes“); wo Hauseigentümer angesprochen sind, heißt es „ausmessen“, nicht „aufmessen“, weil so gesucht wird (docs/SEO.md). Die Ratgeberseiten selbst sind Messanleitungen und bleiben ohne Wortspiel.

**Farbe.** Papier `#f3f2ee`, Fläche `#fff`, Fläche 2/3 `#ecebe6`/`#e1e0da`, Tinte `#141414`, Tinte 2 `#3d3d3a`, Nebentext `#63635e`, Linie `rgba(20,20,20,.09|.17)`. Primär ist Tinte (schwarze Knöpfe, Papier-Schrift). Ein Akzent, Blau `#1d4ed8`, nur für Links, Fokus und das Fensterelement in der Zeichnung; Orange `#c2410c` ist die Maueröffnung. Status: ok `#15733a`, warn `#9a5b00`, bad `#b42318`, immer als Wort mit Punkt oder Symbol, nie als farbige Fläche. Dunkel über `prefers-color-scheme` und `[data-theme="dark"]`. Farben kommen ausschließlich aus Tokens; Verläufe gibt es nicht.

**Schrift.** Maven Pro, sechs Rollen je Oberfläche, nichts unter 13 px.
App: 40 Zahl/Hero · 32 Titel · 24 Zwischentitel · 17 Text · 15 Nebentext · 13 Label.
Betriebsbereich: 44 Hero (36 am Telefon) · 30 Titel (26 am Telefon) · 22 Zwischentitel · 17 Text · 15 Nebentext · 13 Label. Große Zahlen (Kennzahlen, Preise) tragen die Titelrolle.
Ratgeber, Seite für Fensterbauer und Textfassung: 40 Titel (32 am Telefon) · 24 Zwischentitel · 17 Text · 15 Nebentext · 13 Label.

**Fläche, Form, Raum.** Karten liegen mit einem 1-px-Ring auf dem Papier (`--ring`); Schatten wirft nur, was schwebt (`--lift` Hover, `--float` Blätter). Radien 8 · 12 · 18 · 24. Kontrollhöhen 44 (`--h1`: Chips, kleine Knöpfe, Segmente) und 52 (`--h2`: Knöpfe, Segment-Gruppen außen). Raster 4 px, Abstände 8 · 12 · 16 · 20 · 24.

**Bewegung.** Drei Dauern 150 · 220 · 320 ms, zwei Kurven (`--e-out`, `--e-io`). Katalog, mehr gibt es nicht:
1 Erscheinen (8 px aufwärts, gestaffelt nur beim Aufbau) · 2 Wechsel (App gleitet, Betriebsbereich blendet) · 3 Bestätigen (ein Haken wird gezogen) · 4 Fehler (Rütteln, 300 ms) · 5 Fortschritt (Balken, Ringe, Zahlen laufen nach) · 6 Einrasten (eine Zahl setzt sich aus 1,06) · 7 Öffnen/Schließen (Blatt steigt auf, mittig am Schreibtisch) · 8 Laden (ruhige Drehung) · 9 Scrollgebunden (siehe unten). Dazu zwei Rückmeldungen am Objekt: Markieren (Ring läuft um das Neue) und Puls (Ring läuft aus), und die gezeichneten Bewegtbilder (Lottie, siehe unten). Bei „weniger Bewegung“ läuft nichts.

**Scrollgebunden.** `Scroll.binden(el, fn)` (gemeinsam.js) liefert einen Wert 0…1, während ein Element durchs Bild wandert; die Oberfläche liest ihn als `--sp`. Eingesetzt, wo es den Gegenstand zeigt, nicht als Schmuck: das Startbild der App neigt sich um ±3° und die Fensterkarte der Startseite dreht sich um ±7°, als sähe man am Objekt vorbei; Zahlen (Streifen, Rechner) laufen hoch, wenn sie ins Bild kommen, und laufen beim Schieben nach; die Nachrichten der Telefon-Attrappe erscheinen erst, wenn der Block sichtbar ist; die Bühne „So läuft es“ zeigt den Schritt, der gerade daneben steht. Blöcke erscheinen gestaffelt nur beim Aufbau. Parallaxe, Neigen per Maus und Lesefortschritt gibt es nicht.

**Bewegtbilder (Lottie).** Fünf gezeichnete Zeichen in der Sprache der Zeichnung (Tinte auf Papier, Orange für die Maueröffnung, Blau für das Element, Grün für erledigt), aus Code erzeugt (`scripts/lottie-erzeugen.py` → `web/assets/lottie/*.json`, Bodymovin 5.7, nur Formen, keine Ausdrücke). Spieler `web/vendor/lottie_light.min.js` (SVG, MIT, ohne eval, läuft unter der strengen CSP). `Lottie.auf(wurzel)` startet alles mit `data-lottie`; die Farben werden beim Laden gegen die Tokens getauscht, auch im dunklen Modus; gespielt wird nur, was im Bild ist, Schleifen pausieren außerhalb; bei „weniger Bewegung“ steht das Endbild; bis der Spieler da ist, steht das Standbild (`.lottie-still`).

| Zeichen | Dauer | Wo |
|---|---|---|
| `messen` – drei Breiten, das kleinste Maß rastet ein | 3,8 s, Schleife | Glossar „Wie genau ist das Aufmaß?“ und „Öffnung oder Element?“; Betrieb „So funktioniert es“ |
| `fotos` – der Sucher findet das Fenster, eine Linie liest es, drei Treffer | 2,8 s, Schleife | App, über dem Foto, solange die KI liest |
| `senden` – der Flieger steigt am gepunkteten Bogen auf, ein Ring am Ziel | 1,9 s, einmal | App „Jetzt abschicken“ |
| `eingang` – ein Aufmaß fällt in die Ablage, Plakette | 4,4 s, Schleife | Betrieb, leere Zustände (Projekte, Nachrichten) |
| `fertig` – Kreis, Haken, vier kurze Striche | 1,3 s, einmal | App „Freigeschaltet“, „Gesendet“ (direkt), Kundenlink „Fast erledigt“; Betrieb „Projekt angelegt“ |

Regel: ein Bewegtbild erklärt oder bestätigt etwas an genau dieser Stelle; nie zwei auf einem Bildschirm, nie neben dem 3-D-Modell, nie als Füllung.

**Das Modell antwortet auf jede Wahl.** Was gewählt wird, ist am Fenster zu sehen, nicht nur in der Kachel: Formen (Rundbogen, Segmentbogen, Schräg, Rund) sind echte Geometrie – Bogen in der Wand, Laibung aus Streifen, Rahmen, Fuge, Flügel und Glas beschnitten, Oberlicht mit Kämpfer – mit fester Punktzahl, deshalb morpht der Wechsel statt zu springen. Die Öffnungsart wird vorgeführt: Dreh schwingt um das Band, Kipp neigt sich, Dreh-Kipp zeigt beides nacheinander, der Griff dreht vorher mit, Fest lässt einen Glanz übers Glas laufen (1,5–2,9 s, `--e-io`, einmal je Wahl, Haptik-Tipp beim Einrasten). Verglasung und Glas-Extras: zweite und dritte Scheibe in der Profiltiefe, Sonnenschutz tönt, Sichtschutz zeigt das Ornament, dazu die **Lupe** unten rechts (Schnitt durch Glaspaket und Profil: Scheiben, Abstandhalter, Folie, Beschichtung). Einbruchschutz: Pilzköpfe rasten nacheinander ein (RC1 N an den Seiten, RC2 rundum) und der Griff bekommt einen Schließzylinder. Fensterbänke: innen bis vor die Wand mit Stirn und Enden, außen mit Gefälle und Tropfkante, Material als Oberfläche und als Musterpunkt in der Auswahl; die Kamera geht dafür etwas nach oben. Der Hinweis in der Bühne nennt die Wahl in Worten.

**Elementarten.** Der erste Schritt fragt, wo und was: „Fenster ersetzen“ oder „Neue Öffnung“, dazu Fenster, Festverglasung, Hebe-Schiebe-Tür oder Faltschiebewand; die Vorschau darunter zeigt das Element sofort. Jede Art hat ihre eigenen Fragen und ihr eigenes Modell, Titel und Messtexte sprechen von Tür und Schwelle, wo es eine Tür ist (`artSetzen`, `qList`, `w3dCalc`). Übersicht: `docs/gestaltung/elementarten.jpg`.

| Art | Fragen | Im Modell |
|---|---|---|
| Fenster | wie bisher, dazu Unterlicht (Glas oder gedämmtes Paneel, 200 bis 1.200 mm in 5-cm-Schritten) und Griff „ohne“ (verdeckt oder elektrisch) | Unterlicht als festes Feld unter dem Kämpfer, die Flügel werden kürzer; typisch hinter der Küchenzeile |
| Festverglasung | 1 bis 4 Felder, Material, Form | Glas direkt im Blendrahmen, keine Flügelrahmen, Griffe oder Pilzköpfe; Fragen nach Flügeln, Öffnung, Ober-/Unterlicht und Griff entfallen |
| Hebe-Schiebe-Tür | Schema A, 3-teilig, C, D; Seite des Schiebeflügels; Schwelle (flach, barrierefrei, Standard); Hebegriff, abschließbar oder elektrisch | bodentief mit Boden innen und außen, Schwelle statt Fensterbank, tiefer Rahmen mit zwei Laufebenen: Festteil außen, Schiebeflügel innen, langer Hebegriff. Vorführung: Griff dreht, der Flügel hebt sich 7 px, schiebt vor das Festteil und zurück |
| Faltschiebewand | 2 bis 7 Flügel, Paket links, rechts oder beidseitig, Gehflügel, Schwelle | Vorführung je Bild gerechnet: die Flügel falten sich abwechselnd zum Paket und kommen zurück; der Gehflügel am Ende gegenüber dem Paket geht wie eine Tür auf |
| Sonnenschutz außen | Rollladen, Raffstore, Screen; Kasten als Aufsatz oder Vorbau; sieben Farben; Antrieb | Behang zu 42 % herab: Panzer (40-mm-Lamellen), Raffstore (gekantete 80-mm-Lamellen), Screen (Gewebe, durchscheinend); Kasten in derselben Farbe |
| Sicht- und Blendschutz innen | Rollo, Plissee, Jalousie; sieben Farben | raumseitig vor dem Glas, mit Kassette und Endleiste: Stoffbahn, Falten (20 mm), Lamellen mit Lichtspalt (25 mm) |

**Neue Öffnung.** Wo noch kein Fenster ist, fotografiert der Kunde die Wand und zieht das Element auf dem Foto zurecht wie beim Scannen eines Dokuments: vier Ecken als große Griffe, Raster in Dritteln, außen abgedunkelt, eine Lupe (2,6-fach, mit Fadenkreuz) zeigt beim Ziehen die Stelle unter dem Finger, „Rechteck ausrichten“ macht aus dem Viereck ein Rechteck, Innen- oder Außenfoto wählbar. Danach Wunschmaße der Rohbauöffnung (Breite, Höhe, Brüstung, Wandstärke; Vorgabe je Art), das Element rechnerisch 15 mm je Seite kleiner, Hinweis auf Sturz und Statik, ab 5 m² (Tür 14 m², Festverglasung 9 m²) ein Warnhinweis; Montage heißt „Wanddurchbruch samt Sturz“. Die KI beschreibt dann die Wand (Leitungen, Heizkörper, tragend oder nicht) statt ein Fenster zu suchen. Das Foto mit eingezeichneter Lage (JPEG, längste Kante 720 px) steht im Ergebnis und im Aufmaßblatt, bleibt aber auf dem Gerät: Aufmaß-Code und Server bekommen nur die vier Ecken.

**Haptik.** `Haptik.tick()` (Taste, Auswahl, Schalter, Segment), `Haptik.ok()` (ein Schritt ist fertig: alle Maße da, Fenster gespeichert, gesendet, gekauft, Projekt angelegt, Aufmaß eingegangen), `Haptik.fehler()` (Eingabe abgelehnt, Formular rüttelt). Nur bei Berührung (`pointer: coarse`), nur nach einer echten Berührung (Nutzeraktivierung), nie bei „weniger Bewegung“, abschaltbar über `localStorage` `aufmass.haptik = aus`. Android über `navigator.vibrate`; iOS hat dafür nur den Schalter (`input type=checkbox switch`), der beim Umlegen klickt – wo es das nicht gibt, passiert nichts.

## Komponenten

Alle Zustände je Element: Ruhe, Hover (nur bei `hover: hover`), gedrückt (`scale(.98)`), gewählt (Tinte auf Papier), Fokus (2-px-Tintenrahmen, nur Tastatur), nicht verfügbar (40 % Deckkraft), in Führung und Tour gesperrt (grau mit Schloss, siehe unten). Keine Größenänderung beim Wählen, Zielflächen mindestens 44 px, Text in Knöpfen einzeilig (Ellipse) oder bewusst zweizeilig mit fester Höhe.

| Element | Regel |
|---|---|
| Knopf `.btn` | 52 px, Radius 14, 17 px fett. `primary` Tinte, `ghost` Ring, `soft` Fläche 2, `danger`/`ok` als Wort in Statusfarbe. `small` 44, `big` 56. |
| Segmente `.seg` | 2–3 Optionen, gleich breit, außen 52 / innen 44. `.fit`: Inhaltsbreite, wenn Beschriftungen zu verschieden lang sind (Projektfilter). |
| Chips `.chip` | 44 px, Ring, gewählt Tinte. `.grid2`/`.grid3` für gleich breite Reihen. |
| Auswahl in Fragen (App, `auswahl()`) | ≤ 3 kurze Optionen → Segmente · ≤ 6 kurze Optionen → Chips in zwei gleich breiten Spalten (mit Musterpunkt oder Symbol, wenn es eines gibt) · mit Symbol: 2–3 Karten nebeneinander, 4 Karten als 2×2 mit Symbol oben und bis zu zwei Zeilen Name (so passt auch „Festverglasung“ ganz), mehr als 4 als Reihe zum Wischen (112 px), am Start die Elementart als Liste (`.qcards.liste`, Symbol links, Name und Erklärung rechts) · Farben für Sonnenschutz als Tupfen mit Namen (`qSwatch`) · Höhe des Unterlichts als Stufenregler · Formen: fünf gleich große Symbolkacheln in einer Reihe, Name und Kurzbeschreibung der gewählten darunter · lange Beschriftungen → Liste mit Markierungskreis · Farben → Tupfen mit Namen. |
| Karten `.card` | Fläche, Ring, Radius 18; Hervorhebung durch Ring in Tinte (`.hi`), nicht durch Farbe. |
| Status `.badge` | 13 px, Fläche 2, Statusfarbe nur als Punkt oder Symbol. |
| Kennzahl `.stat` | Zahl in Titelrolle, Symbol in Statusfarbe, am Telefon als Zeile. |
| Blatt `.sheet` | Telefon: von unten; Schreibtisch: mittig, Radius 24, `--float`. |
| Eingaben | 48 px, Ring, Fokus Tinte; Messwert 32 px fett. |
| Hinweis `.fx-pilot` | eine Tintenzeile oben, schließbar, verschwindet im Servermodus; am Telefon zwei Zeilen mit „Mehr“. |
| Eigene Farbe `.farbfeld` | unter jeder Farbwahl (Rahmen außen und innen, Griff, Sonnenschutz außen, Sicht- und Blendschutz innen): Textfeld 48 px, Schrift 17 px (kein Zoom auf dem iPhone), links ein Tupfen in der erkannten Farbe. Erkannt werden RAL-Classic-Nummern und -Namen, DB 701–703, Eloxal, Holzdekore, Farbwörter und #hex (`Farbtext` in `gemeinsam.js`); das Modell färbt sich schon beim Tippen, Unbekanntes geht als Wunsch an den Fensterbauer. Eine Farbe aus der Liste hebt die eigene Angabe auf. |
| Gut zu wissen `.tour-fakt` | Fläche mit Ring, links ein 3-px-Strich in Grün; Eyebrow in Grün, die Zahl in der Zwischentitelrolle (24 App, 22 Betrieb), ein Satz, „Mit eeziframes:“ fett, Quelle 13 px. Steht in jedem Schritt von Führung und Tour, liegt wie Inhalt auf dem Papier. |
| Schloss `.schloss` | 22 px, Tinte mit Papier-Symbol (Karten, Farbtupfen), in Chips und Segmenten 18 px gedämpft; das Element trägt `aria-disabled` und einen Namen mit „gesperrt“. |
| Bewegtbild `[data-lottie]` | Behälter gibt die Größe vor (Haken 112, Flieger 176×110, Glossar 150, leer 128, Projektkarte 56), Standbild bis zum Laden. |

## Ansicht: Hauseigentümer oder Fensterbauer

Die öffentlichen Seiten haben zwei Ansichten, nie gemischt: Wer auf „Starten“ drückt, weiß, wofür, und kein Fensterbauer landet versehentlich in der App für Hauseigentümer.

- **Umschalter** „Hauseigentümer | Fensterbauer“ (Segment, die gewählte Seite in Tinte) in der Kopfzeile: am Schreibtisch neben dem Logo, am Telefon und Tablet als eigene, volle Zeile der klebenden Kopfzeile; Ziele 44 px. Er steht auf allen öffentlichen Seiten des Betriebsbereichs, auch bei „So funktioniert es“, Preisen, Registrierung und Tour, und zeigt dort „Fensterbauer“.
- **Anker:** `/#hauseigentuemer` und `/#fensterbauer` (der frühere `/#betriebe` gilt weiter) öffnen die Ansicht; ein Klick auf den Umschalter springt an den Anfang der Ansicht und schreibt den Anker in die Adresse, ohne Verlaufseintrag. Die Wahl bleibt im Browser gespeichert. Ohne Anker und ohne frühere Wahl gilt „Hauseigentümer“; wer über den QR-Code eines Aufmaßblatts kommt (`?von=pdf`), landet bei „Fensterbauer“. Die Abschnitte tragen bewusst keine `id`, damit der Browser beim Laden nicht an den Abschnitt springt und die Kopfzeile den Titel verdeckt.
- **Hauseigentümer:** Hero „Fenster ausmessen. Selbst. eezi.“ (h1), Kennzahlen, „Was im Aufmaß steckt“, Ratgeber als Karten, am Ende die helle Karte „Sie sind Fensterbauer?“. Kopfzeile: „Ratgeber“ und „Fenster ausmessen“ (in die App). Kein „Anmelden“, kein „Starten“.
- **Fensterbauer:** Hero „Aufmaß ohne Anfahrt.“ (h1), „So läuft es“, „Was im Aufmaß steckt“, Beispiel, Vertrauen, Rechner, „Holen Sie es in Ihr Konto“, am Ende die helle Karte „Ihre eigenen Fenster ausmessen?“. Kopfzeile: „Preise“, „Anmelden“, „Kostenlos starten“ (am Telefon „Starten“, der Umschalter darunter zeigt die Zielgruppe).
- **Sprache der Knöpfe:** Kein Knopf ohne klare Zielgruppe. Die Fußzeile sagt „So funktioniert es für Betriebe“ und „Preise für Betriebe“, das Anmeldeblatt „Anmelden für Fensterbauer“; die App verlinkt unten „Sie sind Fensterbauer?“ direkt in deren Ansicht.

## Rückmeldung statt Feier

Konfetti ist vollständig entfernt (`Feier.konfetti`, `.fx-konfetti`, alle Aufrufe, Prüfungen angepasst). Jeder frühere Moment hat eine Rückmeldung am Gegenstand:

| Moment | Vorher | Jetzt |
|---|---|---|
| App · alle vier Maße da | Konfetti | Maßlinien am 3-D-Modell zeichnen sich nacheinander, die vier Werte rasten ein |
| App · Fenster gespeichert | Konfetti | Haken wird gezogen, der Name setzt sich |
| App · Aufmaß abgeschickt / gekauft | Konfetti | Haken bzw. Flieger, ein Ring läuft aus dem Zeichen |
| App · PDF gespeichert | Konfetti | Ring um die Dateikarte |
| App · Kopie geteilt | Konfetti | Ring um den erledigten Weg |
| Betrieb · Projekt angelegt | Konfetti | Haken wird gezogen, Ring um die Karte „Projekt angelegt“ |
| Betrieb · Aufmaß eingegangen | Konfetti | Ring um die Aufmaß-Karte |
| Betrieb · Link gesendet | Puls | Puls am Status |
| Betrieb · Registrierung, Liste angelegt | Konfetti | nichts Zusätzliches: die Seite baut sich gestaffelt auf, der Hinweis nennt die Zahl |

## Aufmaßblatt (PDF)

Das Aufmaßblatt ist das Dokument, das zum Fensterbauer geht. Gelesen wird es vom Fensterbauer, oft ausgedruckt, abgeheftet und beschriftet; der Kunde schickt es weiter. Ein Zeichner (`web/assets/blatt.js`) liefert drei Ausgaben: für den Kunden (Du), wie es an einen Betrieb geht (Sie) und im Betriebsbereich in dessen Farben mit Bestellmaß. Der Aufbau folgt Befunden aus Leseforschung und Gestaltungsrichtlinien (Recherche vom 15.10.2026, Quellen unten).

**Aufbau.** Seite 1: Kopfband mit Kennung (`AM-` und sechs Zeichen aus dem Code) und Datum; Titel und eine Zeile Zusammenfassung (Positionen, Elemente, ausgewertete Fotos, vollständig oder nicht, „alle Maße in mm“); **der Weg** in fünf Schritten – Fotografiert, Gemessen, Wünsche festgelegt, Aufmaßblatt erstellt, jeweils mit Haken und „Erledigt“, der fünfte ist der nächste Schritt („Jetzt senden“ für den Kunden, „Ihr Schritt: Angebot“ für den Fensterbauer); links Eckdaten, rechts die umrandete Box „Für deinen Fensterbauer“ bzw. „Für Sie als Fensterbauer“ mit einer Spitze am fünften Schritt (Kontakt, wie die Maße zu lesen sind, „Code vom Kunden einfügen“ mit Seitenzahl, was danach kommt); darunter **beginnt Position 1** mit Zeichnung, Seite 1 lässt sich also nicht weglassen. Seite 2: was über der Box noch Platz hat (Übersicht, alle Elemente im selben Maßstab), **unten die Box für Fensterbauer**: „Ihre Kunden messen selbst. Sie fahren erst zum Feinaufmaß.“, Ablauf in einem Satz, 3 Projekte kostenlos, danach 9 € netto je Projekt mit eingegangenem Aufmaß, keine Grundgebühr, zum Vergleich die Meisterstunde, QR „Scannen: Projekt anlegen“ und die Kurzadresse. Danach je Position eine Seite, am Ende Übersicht, Ausstattung, Maßstab und der Aufmaß-Code mit Anleitung und QR zur Anmeldung. Auf jeder Seite Kennung, Datum und „Seite x von y“, rechts der senkrechte Markenstreifen. Dokumenteigenschaften: Titel, Sprache `de-DE`, Titel statt Dateiname in der Fensterleiste. Im Betriebsbereich entfallen Weg und Box für Fensterbauer, dafür steht der Kunde oben links.

| Befund | Folgerung im Aufmaßblatt | Quelle |
|---|---|---|
| Leser springen von Überschrift zu Überschrift; oben und links wird am meisten gelesen | Positionsköpfe mit Daten zuerst (Nummer, Raum, Art, Öffnung, Etage, Stückzahl, Fotos), oben links das, was der Fensterbauer braucht | [Pernice, NN/g 2019](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/); [Pernice, NN/g 2017](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) |
| Umgekehrte Pyramide: das Ergebnis zuerst | eine Zeile Zusammenfassung unter dem Titel | [Schade, NN/g 2018](https://www.nngroup.com/articles/inverted-pyramid/); [GOV.UK, klare Struktur](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/) |
| Je näher das Ziel, desto eher wird abgeschlossen; geschenkter Fortschritt wirkt | „4 von 5 Schritten erledigt“, ehrlich gezählt (fehlt ein Maß, steht der Schritt offen da), der fünfte als einzige Handlung. Einschränkung: Belegt an Treueprogrammen, nicht an einem einmaligen „Senden“ | [Kivetz, Urminsky & Zheng 2006](https://business.columbia.edu/faculty/research/goal-gradient-hypothesis-resurrected-purchase-acceleration-illusionary-goal); [Nunes & Drèze 2006](https://doi.org/10.1086/500480) |
| Kein allgemeiner Zeigarnik-Effekt, wohl aber die Neigung, Unterbrochenes wieder aufzunehmen | kein offenes Ende als Kniff, sondern genau eine konkrete nächste Handlung | [Ghibellini & Meier 2025](https://doi.org/10.1057/s41599-025-05000-w) |
| Status als Farbe und Wort, in normaler Schreibweise | Haken und „Erledigt“, Kreis mit Punkt für den nächsten Schritt, nie Farbe allein | [GOV.UK Design System, Task list](https://design-system.service.gov.uk/components/task-list/); [WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) |
| Ein gemeinsamer Rahmen gruppiert, auch über Abstand hinweg | eine umrandete Box für den Fensterbauer, mit Spitze am fünften Schritt angeschlossen | [Palmer 1992](https://pubmed.ncbi.nlm.nih.gov/1516361/); [Harley, NN/g 2020](https://www.nngroup.com/articles/common-region/) |
| Was nach Werbung aussieht, wird übersehen | beide Boxen wie Inhalt gestaltet: Tinte, Papiergrau, keine Farbfläche, keine Plakette | [Pernice, NN/g 2018](https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/); [GOV.UK, Inset text](https://design-system.service.gov.uk/components/inset-text/) |
| Die erste Seite bekommt die meiste Aufmerksamkeit; eine Seite muss allein zuordenbar sein | Seite 1 trägt Inhalt statt Deckblatt; Kennung, Datum und „Seite x von y“ auf jeder Seite wie im Schriftfeld technischer Zeichnungen | [Fessenden, NN/g 2018](https://www.nngroup.com/articles/scrolling-and-attention/); [ISO 7200:2004](https://www.iso.org/standard/35446.html) |
| Kontrast mindestens 4,5:1; Beschriftungen nicht kleiner als der Text; Lesbarkeit bricht unter kleinen Schriften ein | keine hellgrauen Daten (Tinte 2 `#3a3a3f`, Grau nur für Nebensachen), Maßbeschriftung in der Zeichnung 8,2 pt wie der Text der Karten, Orange als Text dunkler (`#b3401e`), „Fußboden“ 7,4 pt | [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum); [UKAAF 2012](https://webs.uab.cat/act/wp-content/uploads/sites/126/2017/03/ukaaf-creating-clear-print-and-large-print-documents.pdf); [Legge & Bigelow 2011](https://doi.org/10.1167/11.5.8) |
| Zugängliches PDF: Titel und Sprache gesetzt | Titel, Sprache `de-DE`, Titel in der Fensterleiste; Text bleibt Text (kopierbar, Code in Courier) | ISO 14289-1 (PDF/UA); [W3C-Techniken PDF16, PDF18](https://www.w3.org/WAI/WCAG22/Techniques/) |
| Eine Legende für alle Maße, Farbe nie allein | an jeder Zeichnung „Alle Maße in mm · Breite × Höhe · Ansicht von innen“; Orange Maueröffnung, Blau Element, jeweils mit Wort, gestrichelt heißt Mittelmaß bzw. öffnet nach außen; etwa 8 % der Männer europäischer Herkunft sind rot-grün-farbenblind | [ISO 129-1](https://www.iso.org/standard/64007.html); [DIN EN ISO 129-1](https://www.dinmedia.de/de/norm/din-en-iso-129-1/314070706); [Birch 2012](https://doi.org/10.1364/JOSAA.29.000313) |
| QR-Codes mindestens 2 × 2 cm mit 4 Modulen Rand, Kurzadresse daneben, sagen, was Scannen tut; gescannt wird selten | QR 25 bzw. 28 mm mit vier Modulen Ruhezone, „Scannen: Anmeldung“ und „Scannen: Projekt anlegen“, Kurzadresse, im PDF anklickbar | [GOV.WALES 2024](https://www.gov.wales/create-and-use-qr-code); [Section508.gov 2024](https://www.section508.gov/blog/accessibility-bytes/qr-codes/); [Ball et al. 2026](https://doi.org/10.3991/ijim.v20i14.61501) |
| PDF taugt zum Drucken, schlecht zum Lesen am Bildschirm | einspaltige Positionsseiten zum Ausdrucken und Abheften; digital übernimmt der Fensterbauer alles per Code | [Nielsen & Kaley, NN/g 2020](https://www.nngroup.com/articles/pdf-unfit-for-human-consumption/) |

**Umbruch.** Position 1 beginnt immer auf Seite 1: Die Nachricht des Kunden steht dort höchstens dreizeilig („… (vollständig nach Pos. 1)“) und folgt ungekürzt nach Position 1; die Zeichnung auf Seite 1 ist so hoch, wie Platz ist (64 bis 108 mm), und ragt nie in den Fuß, auch nicht mit allen Kontaktdaten. Jede weitere Position wird vor dem Zeichnen gemessen: Passt sie mit einer kleineren Zeichnung (mindestens 78 mm) ganz auf ihre Seite, wird die Zeichnung kleiner, statt einen Rest allein auf die nächste Seite zu schieben; muss die Fotoauswertung doch geteilt werden, gehen mindestens zwei Zeilen mit.

Nicht belegt und deshalb nicht behauptet: dass erste Seiten weggeworfen werden (es gibt keine Studie dazu; Seite 1 trägt trotzdem Inhalt, weil das ohnehin der Leserichtung entspricht). Offen für eine rechtliche Prüfung: ob BFSG oder BITV für eeziframes gelten; bis dahin gelten sie als Maßstab.

**Beispiel aus der Führung.** Dieselbe PDF mit `beispiel: true`: Kennung `AM-BEISPIEL`, schräg „BEISPIEL“ über jeder Seite (Rot, 7 % Deckkraft), Kunde „Familie Muster“, statt des Aufmaß-Codes der Hinweis, dass er im echten Blatt dort steht. So geht ein Beispiel nie als echtes Aufmaß durch.

## Führung und Tour statt Demo-Konten

Wer eeziframes kennenlernen will, braucht kein Konto und bekommt keine Beispieldaten in ein echtes Konto: Hauseigentümer starten die **Führung** in der App, Fensterbauer die **Tour** im Betriebsbereich. Beide zeigen die echten Bausteine, jeder Schritt hat einen kurzen Fakt mit Quelle („Gut zu wissen“: eine Zahl, ein Satz, „Mit eeziframes: …“, die Quelle), Vorgegebenes trägt ein Schloss.

**Gesperrt.** Grau (Fläche 2, gestrichelter Rand bei Chips, Symbol auf 35 %), ein Schloss (Tinte auf Papier in Karten und Farbtupfen, gedämpft in Chips und Segmenten), `aria-disabled="true"` und ein Name, der „in der Führung gesperrt“ bzw. „in der Tour vorgegeben“ sagt. Antippen ändert nichts und erklärt kurz: „In der Führung gesperrt. Im eigenen Aufmaß wählst du frei.“ bzw. „In der Tour vorgegeben. In Ihrem Konto tragen Sie alles selbst ein.“ Gesperrt ist, was ein Fenster individuell macht; das Übliche bleibt frei, damit das Modell auf jede Wahl antwortet.

**Führung (App, Du).** Start über „Führung starten“ auf der App-Startseite (unter „Fenster aufmessen“), über die Startseite des Portals (`/app/#fuehrung`) und im Fotoschritt eines echten Aufmaßes, solange noch kein Foto da ist („Nur mal ansehen?“). Die Führung arbeitet an einer Kopie: Fenster, Fotos und Auswahl werden beiseitegelegt und beim Beenden zurückgelegt; gespeichert wird nichts, das eigene Projekt bleibt unberührt. KI-Ergebnisse eines echten Fotos landen immer bei dem Fenster, zu dem das Foto gehört, auch wenn währenddessen die Führung läuft. Kopf: „Beenden“ mit ×, Titel „Führung“, Fortschrittsbalken; unten Zurück und Weiter.

| Schritt | Was man tut | Gesperrt |
|---|---|---|
| 1 Element | Fenster, Festverglasung, Hebe-Schiebe-Tür oder Faltschiebewand, mit passenden Maßen | „Neue Öffnung“ |
| 2 Fotos | Beispielfotos, die KI liest (nachgestellt, feste Ergebnisse), sechs Stichworte | Kamera |
| 3 Messen | die vier Maße tippen sich selbst ein, Maßlinie für Maßlinie; danach „Alle Maße da“ und „Nochmal zeigen“ | Zifferntasten |
| 4 Öffnung | je Art: Flügel antippen und Öffnungsart wählen (der Flügel führt sie vor), Felder, Schema (schiebt), Flügelzahl (faltet) | 3 Flügel; 3 und 4 Felder; Schema 3-teilig und D; 2, 6 und 7 Flügel |
| 5 Material | Kunststoff oder Holz | Holz-Alu, Aluminium |
| 6 Farbe außen | sechs Farben | neun Farben, eigene Farbe |
| 7 Glas | 2- oder 3-fach, Sicherheits- und Sichtschutzglas | Schallschutz, Sonnenschutz |
| 8 Sonnenschutz | Rollladen oder Raffstore, beim ersten Besuch steht ein Raffstore in Anthrazit; drei Farben | Bestehender, Screen; vier Farben, eigene Farbe |
| 9 Aufmaßblatt | Vorschau von Seite 1 (Weg mit 4 von 5, Eckdaten, Box für den Fensterbauer, Position 1 mit Zeichnung, Stempel „Beispiel“, Seite 2 dahinter), „An beliebig viele Fensterbauer“, der Preis offen genannt, „Beispiel als PDF ansehen“; Weiter heißt „Eigenes Fenster aufmessen“ | – |

**Tour (Betriebsbereich, Sie).** Start über „Tour starten“ im Abschnitt für Fensterbauer der Startseite, auf „So funktioniert es“, im Anmeldeblatt, in der Fußzeile, in der leeren Projektliste, in der Seitenleiste und in „Mein Betrieb“. Kopf mit „Tour beenden“ und acht Schrittknöpfen (erledigte mit Haken, am Telefon nur Nummern, der aktuelle mit Namen); links die Bühne, rechts Titel, Text, drei Merkpunkte und der Fakt; Zurück und Weiter bleiben am unteren Rand. Konten und Projekte bleiben unberührt, die Tour wird nicht gespeichert.

| Schritt | Bühne | Zum Ausprobieren |
|---|---|---|
| 1 Projekt anlegen | Formular mit Kunde, Kontakt, Objekt (vorgegeben), Gebäude | Anrede Sie oder Du |
| 2 Link schicken | Telefon mit der vorformulierten Nachricht | Kanal, Gültigkeit 7, 14 oder 30 Tage |
| 3 Kunde misst | Kundenansicht im Telefon, die vier Maße erscheinen; Verlauf wie im Projekt bis „Aufmaß eingegangen“ | Nochmal abspielen |
| 4 Aufmaß kommt an | Positionen zum Aufklappen mit Bestellmaß, Angaben und Fotoauswertung | Aufklappen |
| 5 Bestellmaß und PDF | Rechnung Öffnung → Bestellmaß, PDF-Karte | Abzug 10, 15 oder 20 mm (eigener Wert gesperrt), Beispiel-PDF |
| 6 Nachbesserung | Hinweis an den Kunden (vorgegeben), danach die Nachricht und seine Antwort | Link erneut öffnen |
| 7 Aufmaß per Code | Code vom Kunden (vorgegeben), wo was im Aufmaßblatt steht | Übernehmen |
| 8 Preise und Start | Start, Abo 10, Plus, zum Vergleich die Meisterstunde | Kostenlos starten |

**Fakten.** Jede Zahl wurde am 15.10.2026 an der Quelle gelesen. Nicht verwendet, weil es keine belastbaren Zahlen gibt: Kosten und Dauer eines Aufmaßtermins, Anteil der Fahrzeiten, Quote von Angebot zu Auftrag, Preisunterschiede zwischen Angeboten für dieselben Fenster. Veraltet und deshalb nicht genannt: „bis 12.000 € BAFA-Zuschuss“ (seit 21.07.2026 gibt es den Sanierungsfahrplan-Bonus erst auf Kosten über 30.000 €).

| Wo | Fakt | Quelle |
|---|---|---|
| Führung 1 | 2 bis 3 vergleichbare Angebote einholen | [Verbraucherzentrale NRW, Broschüre „Fenster“, 02/2025](https://verbraucherzentrale.nrw/sites/default/files/2025-03/broschuere_fenster_02_2025.pdf) |
| Führung 2 | 36 % der Eigentümer finden es schwer, passende Handwerker zu finden (501 Befragte) | [ImmoScout24, 06.08.2025](https://www.immobilienscout24.de/unternehmen/news-medien/news/default-title/wirtschaftslage-und-handwerkermangel-daempfen-sanierungsvorhaben/) |
| Führung 3 | Aufträge im Ausbauhandwerk reichen 9,9 Wochen (Glaser, Tischler, Rollladenbauer gehören dazu); gemessen ist der Auftragsbestand, nicht die Wartezeit | [ZDH-Konjunkturbericht 1/2026](https://www.zdh.de/fileadmin/Oeffentlich/Wirschaft_Energie_Umwelt/Themen/Konjunkturberichte/2026/2026-1/ZDH_Konjunkturbericht_Q1_2026.pdf) |
| Führung 4 | mehr als ein Drittel der Fenster getauscht: prüfen, ob ein Lüftungskonzept nach DIN 1946-6 nötig ist (eine Norm, kein Gesetz; Pflicht ist das Konzept nur in manchen Fällen) | [Verbraucherzentrale NRW, Broschüre „Fenster“, 02/2025](https://verbraucherzentrale.nrw/sites/default/files/2025-03/broschuere_fenster_02_2025.pdf) |
| Führung 5 | 3-fach-Fenster 1,3 × 1,3 m mit Montage, ohne Ausbau, inklusive Mehrwertsteuer, Herbst 2023: 598 € (Kunststoff) bis 1.153 € (Alu) | [VFF und Bundesverband Flachglas, Studie 01/2024](https://window.de/wp-content/uploads/2024/03/VFF-BF-Studie-2024-Energetische-Modernisierung-Fenster-ES.pdf) |
| Führung 6, Tour 5 | 87 % der Betriebe: Kunden erwarten individuelle Angebote | [Bitkom, Studienbericht Handwerk, 01/2026](https://www.bitkom.org/sites/main/files/2026-01/bitkom-studienbericht-handwerk.pdf) |
| Führung 7 | neue Fenster sparen typischerweise 10 bis 20 % Heizkosten; 3-fach statt alter Isolierverglasung bis zu 60 % weniger Wärmeverlust durchs Fenster | [Verbraucherzentrale Energieberatung, „Fenstertausch“, 10.03.2026](https://verbraucherzentrale-energieberatung.de/sanieren-bauen/daemmen/fenstertausch/) |
| Führung 8 | BAFA-Zuschuss 15 % für neue Fenster, ein Energieeffizienz-Experte muss eingebunden sein | [BAFA, Gebäudehülle](https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Sanierung_Wohngebaeude/Gebaeudehuelle/gebaeudehuelle_node.html) |
| Führung 9, Tour 2 | 68 % der Betriebe verschicken Angebote digital, 35 % beraten online | [Bitkom, Studienbericht Handwerk, 01/2026](https://www.bitkom.org/sites/main/files/2026-01/bitkom-studienbericht-handwerk.pdf) |
| Tour 1 | 97.482 offene Stellen im Handwerk 2025 rechnerisch nicht passend besetzbar, fast jede zweite | [KOFA/IW, KOFA Kompakt 7/2026](https://www.kofa.de/media/Publikationen/KOFA_Kompakt/KOFA_Kompakt_07.2026_Handwerk.pdf) |
| Tour 3 | ein Kostenanschlag ist im Zweifel nicht zu vergüten | [§ 632 Abs. 3 BGB](https://dejure.org/gesetze/BGB/632.html) |
| Tour 4, Aufmaßblatt Seite 2 | Meisterstunde 65,14 € netto im Schnitt (Umfrage eines Softwareanbieters, 534 Betriebe) | [OneQrew/Taifun, Preisatlas Handwerk 2024](https://taifun-software.de/app/uploads/2025/10/Preisatlas_2024_TAIFUN-komprimiert.pdf) |
| Tour 6 | 76 % der Betriebe nennen Zeitersparnis als Vorteil digitaler Anwendungen | [Bitkom, Studienbericht Handwerk, 01/2026](https://www.bitkom.org/sites/main/files/2026-01/bitkom-studienbericht-handwerk.pdf) |
| Tour 7 | 49 % der Deutschen finden, Handwerksbetriebe arbeiten oft noch zu analog | [Bitkom, 14.03.2025](https://www.bitkom.org/Presse/Presseinformation/Digitale-Services-Handwerk) |
| Tour 8 | Ausbauhandwerk: 9,9 Wochen Auftragsreichweite bei 78 % Auslastung | [ZDH-Konjunkturbericht 1/2026](https://www.zdh.de/fileadmin/Oeffentlich/Wirschaft_Energie_Umwelt/Themen/Konjunkturberichte/2026/2026-1/ZDH_Konjunkturbericht_Q1_2026.pdf) |

**Entfernt.** Die Demo-Konten (Fensterbau Brandt, Glaserei Vogt) samt Anmeldedaten, „Demo ansehen“, „Demo-Ansicht wechseln“, „Oder Demo-Zugang“, „Demo zurücksetzen“, „Nur testen? Beispieldaten einsetzen“, „Beispiel-IBAN einsetzen“, „Demo: Kunde füllt aus“, das Beispielprojekt in der leeren Projektliste und die Beispielfotos im echten Aufmaß (Fotos und KI-Angaben aus Beispielen gehören in kein Aufmaß, das an einen Betrieb geht). Wer zuletzt in einem Demo-Konto war, ist beim nächsten Laden abgemeldet; eigene Betriebe aus der Pilotphase bleiben. Für die automatische Prüfung legt `scripts/pruefen.mjs` die beiden Betriebe selbst im Browser an.

## Ratgeber, Seite für Fensterbauer und Textfassung

Seiten aus reinem HTML für Menschen, Suchmaschinen und KI-Assistenten (`web/ratgeber/`, `web/fuer-fensterbauer/`, Gestaltung `web/assets/ratgeber.css`, Gründe in docs/SEO.md). Sie sprechen dieselbe Sprache wie App und Betriebsbereich, nur als Lesetext: Papier, Tinte, Karten mit Ring, keine Bewegung.

- **Kopf:** Zeichen und Wortmarke links, rechts „Ratgeber“, „Für Fensterbauer“ (am Telefon ausgeblendet) und ein kleiner schwarzer Knopf; klebt oben, halbtransparent wie die App.
- **Spalte:** höchstens 820 px, Rand 16 px. Brotkrumen in 13 px, Augenbraue mit Datum, ein h1.
- **Antwort zuerst:** Karte „Kurz gesagt“ direkt unter dem Titel; die Seite beantwortet die Frage in zwei, drei Sätzen, der Rest vertieft.
- **Schritte:** nummerierte Liste mit schwarzen Ziffernkacheln (32 px, Radius 10), fetter Satzanfang als Schrittname.
- **Tabellen:** Karte mit Ring, Spaltenköpfe als Label (13 px, Versalien). Am Telefon werden sie zu Karten untereinander: erste Spalte als Titel, die übrigen mit ihrem Spaltentitel aus `data-k`; so bricht kein Wort mitten durch. Die Vorlage zum Ausdrucken bleibt eine Tabelle mit Linien.
- **Fragen:** `details` als Karten, 48 px hoch, „+“ und „–“ rechts.
- **Quellen:** nummeriert im Text ([1]), Liste am Ende mit Datum; „Stand“ als letzte Zeile.
- **Druck:** Kopf, Fuß, Knöpfe und Brotkrumen fallen weg; auf der Seite „Aufmaßblatt“ druckt nur Titel und Vorlage, eine A4-Seite.
- **Textfassung von Startseite und App:** dieselben Bausteine innerhalb von `#app`; sichtbar nur ohne JavaScript, mit JavaScript ersetzt sie die App beim ersten Bild, ohne Aufblitzen (`.js .vorab`).

## Entscheidungen

- Marke eeziframes, immer klein, mit einer Wortmarke aus zwei Schnitten statt eines neuen Zeichens: Das Fenster auf der Kachel passt zu „frames“ und bleibt wiedererkennbar; „eezi“ fett macht das Wortspiel lesbar, ohne Farbe oder Schmuck.
- Primärfarbe ist Tinte, nicht Blau. Blau bleibt dem Fensterelement, Orange der Maueröffnung; so liest man die Zeichnung, nicht die Knöpfe.
- Zwei Knopfhöhen (44/52), nicht fünf. Segment-Gruppen sind außen so hoch wie Knöpfe, damit Reihen bündig sind.
- Bedienelemente in Fragen folgen einer Regel nach Anzahl und Länge der Optionen statt je Frage einer Lösung.
- Status als Wort mit Punkt. Farbige Pillen gibt es nicht mehr; Tönung bleibt den beiden Maßfarben und Hinweiskarten vorbehalten.
- Schmuckbewegung entfernt: Neigen der Karte, Magnetknöpfe, Parallaxe, Lesefortschritt. Zahlen zählen beim Aufbau einmal hoch (Katalog 5).
- Blätter am Schreibtisch mittig statt am unteren Rand.
- Die Telefon-Attrappe und die Bühne „So läuft es“ sind Illustration; dort gelten die Rollen sinngemäß (verkleinerte Oberfläche), aber nie unter 13 px.
- Pilot-Hinweis bleibt eine Tintenzeile; am Telefon zwei Zeilen mit „Mehr“, verschwindet im Servermodus. Text unverändert.
- Startbilder: am Telefon steht das Fenster auf dem ersten Bildschirm – Titel, Knopf, Bild, dann der Text (App-Start, Kundenlink, Startseite des Betriebsbereichs).
- Bewegtbilder sind gezeichnet, nicht gekauft: dieselben Linienstärken, Radien und Farben wie die Oberfläche, aus Code erzeugt und jederzeit änderbar.
- Haptik ist leise: ein Tippen von 8 ms, nie als Dauerfeuer; Fehler stoßen einmal.
- Rund heißt fest verglast: die Fragen nach Flügeln, Öffnung, Scharnieren, Oberlicht und Fensterbank entfallen, ein Hinweis sagt warum; was vorher eingestellt war, kommt beim Wechsel zurück wieder.
- Pilzköpfe sitzen in Wirklichkeit im Falz; das Modell zeigt sie auf dem Flügelrahmen, damit der Unterschied zwischen Basis, RC1 N und RC2 sichtbar ist.
- Türen heißen Türen: Titel, Messtexte („bis zur Schwelle bzw. zum fertigen Fußboden“), Ergebnis, Aufmaßblatt und Betriebsbereich sprechen von Tür und Türelement; Schwelle statt Fensterbank, keine Sprossenfrage.
- Festverglasung heißt ohne Griff und ohne Flügelrahmen; der Einbruchschutz zeigt sich dort in Glas und Verglasungssicherung statt in Pilzköpfen.
- Bei „Neue Öffnung“ gibt es nichts Bestehendes zu behalten (Rollladen, Fensterbank), die Maße sind Wunschmaße und so gekennzeichnet; das endgültige Maß legt der Fachbetrieb nach der Statik fest.
- Ältere Aufmaße mit „Rollladen“ werden als Sonnenschutz außen gelesen, damit nichts verloren geht.
- Vorführungen (Drehen, Kippen, Schieben, Falten) laufen einmal, wenn eine Wahl fällt, nie in Schleife, und gar nicht bei „weniger Bewegung“. Sie beginnen, sobald das neue Bild steht (zwei Bildwechsel), der Griff dreht in den ersten 100 ms.
- Flüssig vor prächtig: Die Faltwand läuft als CSS-Animation je Flügel aus berechneten Stützstellen (Compositor bzw. Core Animation, keine Arbeit je Bild im Skript); bei gleicher Struktur geht nur die Hülle der Bühne in den neuen Bildschirm, Flächen werden nur geschrieben, wenn sich etwas ändert, die Größe der Bühne wird einmal gelesen; kein Weichzeichner über dem bewegten Modell, Kantenschatten als Verlauf statt als weicher Innenschatten, unsichtbare Pilzköpfe und Auswahlringe sind keine Ebenen; während sich die Geometrie verwandelt oder etwas vorgeführt wird, steht das sanfte Schwingen still. Gemessen (Telefon, CPU 4-fach gedrosselt): Faltwand von 19 auf 45 Bilder je Sekunde (allein vorgeführt 10 auf 36), längstes Bild von 267 auf 100 ms (allein 600 auf 50 ms); Antwort auf eine Wahl ohne lange Aufgabe.
- Kennenlernen ohne Konto: Führung und Tour statt Demo-Konten. Sie zeigen dieselben Bausteine wie die echten Abläufe, sind aber als Beispiel gekennzeichnet und schreiben nichts in Konten, Projekte oder das eigene Aufmaß.
- Fakten nur mit Quelle und Datum; was sich nicht belegen lässt (Termindauer, Fahrzeiten, Angebotsquoten), wird nicht behauptet.
- Zwei Ansichten statt einer langen Startseite für beide Zielgruppen, mit dem Umschalter in der Kopfzeile: Die Seite zeigt immer nur, was zur gewählten Zielgruppe gehört, und jeder Knopf ist eindeutig.
- Ratgeber als eigene HTML-Seiten statt in der App: KI-Crawler führen kein JavaScript aus, und eine Anleitung soll auch ohne App lesbar, verlinkbar und druckbar sein.
- Bewusst gelassen: Server, Abrechnung, Reihenfolge der übrigen Fragen.

## Nachweis

Gemessen mit Playwright über 264 Bildschirme (105 App am Telefon, darunter alle Fragen jeder Elementart, der Weg „Neue Öffnung“ und die neun Schritte der Führung oben und unten; 37 Betrieb Schreibtisch und 37 Betrieb Telefon, darunter beide Ansichten der Startseite und die acht Schritte der Tour; 85 Ausschnitte der Ratgeberseiten, der Seite für Fensterbauer und der Textfassung von Startseite und App ohne JavaScript, Schreibtisch und Telefon, in Bildschirmhöhen durchgescrollt): kein Umbruch oder Überlauf in Bedienelementen, keine ungleichen Höhen in einer Reihe, keine Zielfläche unter 44 px, keine Schrift unter 13 px, Kontrast ≥ 4,5:1 (≥ 3:1 groß), kein Querscrollen, genau sechs Schriftrollen je Oberfläche (App 13 · 15 · 17 · 24 · 32 · 40; Betriebsbereich 13 · 15 · 17 · 22 · 30 · 44, am Telefon 26 und 36 statt 30 und 44; Ratgeber fünf: 13 · 15 · 17 · 24 · 40, am Telefon 32 statt 40), bei „weniger Bewegung“ keine laufende Animation, auch nicht in Führung und Tour, die Marke nirgends in Versalien und kein alter Name; dieselbe Messung im dunklen Modus ohne Befund. Prüfsuite `scripts/pruefen.mjs`: 377 Prüfungen grün (darunter: Stripe-Anbindung gegen ein nachgestelltes Stripe, Kasse im Testmodus mit Testbetrieb-Hinweis und Testkarte, Zahlung unterwegs mit „bitte nicht noch einmal bezahlen“ und Freischalten beim nächsten Öffnen, Zahlungsart-Blatt mit Test-IBAN nur im Testmodus; Ansicht: Umschalter oben, je Ansicht nur deren Inhalte und Knöpfe, Anker `#hauseigentuemer`, `#fensterbauer` und `#betriebe`, Wahl bleibt nach dem Neuladen, Preise zeigen „Fensterbauer“, QR-Code eines Aufmaßblatts führt zu den Fensterbauern, am Telefon der Umschalter als volle Zeile mit ganz lesbaren Wörtern; Auffindbarkeit: `www.eeziframes.com` zählt als Hauptdomain, die `…workers.dev`-Adresse bleibt gesperrt, jede Seite der Sitemap ohne JavaScript mit genau einem h1, Titel, Beschreibung und lesbaren strukturierten Daten mit absoluten Adressen, Textfassung von Startseite und App ohne JavaScript sichtbar und mit JavaScript ersetzt, Ratgeber am Telefon und am Schreibtisch mit erlaubten Schriftgrößen, Zielen ab 44 px und ohne Querscrollen, Pilotphase gesperrt, Freigabe mit `INDEXIERUNG=1` auf einem eigenen Testserver, Kopfzeilen, Sitemap, Worker-Routen und Preise im Gleichstand; Bewegtbilder laufen in Tokenfarben, stehen bei „weniger Bewegung“ auf dem Endbild, Haptik tippt am Telefon nach Berührung und schweigt sonst, Scroll-Bindung setzt den Wert; Start mit Stelle und Element, Unterlicht, Festverglasung, Hebe-Schiebe-Tür schiebt, Faltschiebewand faltet und kommt zurück, Raffstore und Jalousie im Modell, Einzeichnen mit Lupe und Rechteck, Wunschmaße, Foto bleibt auf dem Gerät, eigene Farben bei jeder Farbwahl, Bühne bleibt bei gleicher Struktur stehen; Führung von der Startseite und über `#fuehrung`, neun Schritte mit Fakt und Quelle, Gesperrtes meldet sich und ändert nichts, Element frei wählbar mit passenden Maßen, Beispiel-PDF mit Wasserzeichen und ohne Code, nach der Führung bleibt das eigene Aufmaß unverändert; Tour mit acht Schritten, Anrede und Abzug rechnen mit, Beispiel-PDF mit Bestellmaß, Tour schreibt kein Konto; keine Demo-Konten, Demo-Zugänge oder Beispieldaten mehr, alte Demo-Sitzungen werden abgemeldet; Aufmaßblatt mit langer Nachricht und allen Kontaktdaten: Position 1 bleibt auf Seite 1, die Zeichnung endet über dem Fuß, die Nachricht folgt ungekürzt; Position 2 steht samt Fotoauswertung auf einer Seite; Marke eeziframes auf jeder Seite klein und mit Wortmarke, im Aufmaßblatt nie in Versalien; KI: eine Anfrage je Foto mit dem Auftrag Einbausituation, kein Altfenster im Befund, Prüfpunkte fürs Feinaufmaß, Wand-Auftrag bei der neuen Öffnung). Vorher/Nachher je Bildschirm liegt dem Pull Request bei (`docs/gestaltung/`).

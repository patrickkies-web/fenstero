# Projektangaben für den Design-Prompt: eeziframes

[← Übersicht](README.md) · Stand 24.10.2026

Der universelle Design-Prompt ([06-design-prompt.md](06-design-prompt.md)) ist absichtlich marken- und farbneutral; Farben, Schriften und Markenregeln kommen über Platzhalter hinein. Dieses Blatt füllt sie für eeziframes aus, mit den heute verbindlichen Werten aus dem Repository. So wird es benutzt:

1. Den Codeblock aus [06-design-prompt.md](06-design-prompt.md) in die KI kopieren.
2. Den Abschnitt `PROJEKTANGABEN` darin durch den Codeblock unten ersetzen (oder den Block direkt darunter einfügen).
3. Bei einer einzelnen Seite oder einem einzelnen Element die Zeile „Inhalte und Bildschirme“ auf diese Aufgabe kürzen.

Die Werte stammen aus [docs/GESTALTUNG.md](../GESTALTUNG.md) (Abschnitt „System“), `web/assets/gemeinsam.css`, der Designrichtung im Skill `premium-gestaltung` (`designrichtung.md`, `SKILL.md`) und `web/assets/pakete.js`. Vorschläge aus dem Website-Blueprint, die noch eine Freigabe brauchen, stehen bewusst **nicht** im Block, sondern unten getrennt.

```text
PROJEKTANGABEN
- Marke: eeziframes – immer klein geschrieben, auch am Satzanfang. Wortmarke: „eezi“ in Inter 900, „frames“ in Inter 500, gleiche Farbe, ohne Abstand, nie umbrochen. Zeichen: Licht fällt durch ein Fenster in einen dunklen Raum (schwarze Kachel, drei weiße Lichtflächen). Name, Wortmarke und Zeichen werden nicht verändert. Ton: sachlich, kurz, ehrlich; das Wortspiel „eezi“ nur sparsam (höchstens einmal je Bildschirm, nie in Preisen, Fehlermeldungen oder Rechtstexten).
- Ziel und Hauptaktion: Fensterbauer und Fensterhändler wählen ein Konfigurator-Paket und fragen es an (Hauptziel). Zweites Ziel: Hauseigentümer starten die Aufmaß-App und messen ihre Fenster selbst.
- Zielgruppe: (1) Fensterbauer und Fensterhändler, die einen hochwertigen Fenster-Konfigurator unter eigener Marke und Domain für ihre Website suchen; (2) Hauseigentümer, die Fenster austauschen oder neu planen.
- Inhalte und Bildschirme: Produkt für Fensterbauer: derselbe Konfigurator als eigener, unter Domain und Marke des Betriebs; jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail. Drei Pakete mit Einrichtung und Monatspreis (netto): EEZI Essential 29 € im Monat, 99 € Einrichtung · EEZI Essential Plus 39 € im Monat, 199 € Einrichtung · EEZI Signature 64 € im Monat, 279 € Einrichtung. Für Hauseigentümer: Fenster selbst ausmessen, Schritt für Schritt, mit Fotos und 3-D-Modell; das Aufmaßblatt als PDF kostet einmal 7,99 € (Einführungspreis bis 17. November 2026, danach 12,99 €). Seiten: Startseite mit zwei Ansichten (Hauseigentümer, Fensterbauer), Seite für Fensterbauer, App-Start, Ratgeber. Keine erfundenen Kundenstimmen, Logos, Kennzahlen, Siegel oder Bewertungen; „Empfohlen“ statt „Beliebt“, solange es keine Kunden gibt.
- Bildmaterial: Foto (fotorealistische Figurenwelt: ein Astronaut oder ein Tier tut etwas Menschliches rund ums Fenster, warmes Filmlicht, modernes Wohnzimmer, eine Figur je Bildschirm, mit echter Lichtquelle im Bild) und Render (das eigene 3-D-Fenstermodell aus dem Konfigurator, echte Bildschirme und das echte Aufmaßblatt als Beweis). Keine Stockfotos, keine fremden Bilder, keine Bilder mit Text oder Wasserzeichen; Strichsymbole nur als Nebensache bis 24 px.
- Farbpalette (feste Rollen, keine weiteren Farben):
  Grund #161616 (immer der Hintergrund) ·
  Fläche #1f1f1f (Karten mit 2-px-Rand), Fläche 2 #262626, Fläche 3 #2e2e2e ·
  Linie #2b2b2b (Kartenrand), Linie 2 #3a3a3a (Hover) ·
  Text #f3f2ee (Überschriften, Bedientext), Text 2 #c9c8c3 (Lesetext), gedämpft #93928d (Labels, Nebenzeilen) ·
  Signal Grün #8fd694 – nur Kicker, Haken, Fortschritt und genau ein Wort je Überschrift; nie Fläche hinter Text, nie Fließtext ·
  Hauptaktion Cream #f1f0ea mit dunkler Schrift – genau eine Cream-Fläche je Bildschirm ·
  Status: Warnung #f0b35a, Fehler #ff7b72 (nur echte Fehler, immer als Wort mit Punkt oder Symbol) ·
  Zeichnungsfarben, keine Oberflächenfarben: Orange #ff8a5b = Maueröffnung, Blau #7aa2ff = Element (nur in Zeichnungen, Maßlinien, 3-D-Modell).
  Eine Stimmung: dunkel; kein Hellmodus. Je Bildschirm mindestens 80 % unbunt, kräftige Farbe höchstens 5 %. Verläufe nur als Licht aus einer Quelle im Bild (radial, weich, 8–20 % Deckkraft, in Cream, Grün oder dem Zeichnungsblau); kein Verlauf ohne Quelle, keine Schatten unter Karten (Schatten nur an Schwebendem).
- Schriften: Inter (variabel, lokal eingebunden, SIL OFL) als einzige Familie. Gewichte: 500 Text, 700 Listen, Chips und Knöpfe, 800 Überschriften. Größen nur 13, 15, 17, 24 und 40 px (am Telefon 32 statt 40); nichts unter 13 px. Überschriften: Inter 800, Laufweite −0,03 em, Zeilenabstand 1,05, mit Punkt am Ende, am Telefon höchstens drei Zeilen, genau ein Wort in Grün. Lesetext 17 px in Text 2, Schlüsselwörter in Text und fett, höchstens drei Zeilen je Block. Zwei Stimmen: Bühnenstimme (groß, fett, knapp) und Technikstimme (13 px, Inter 600, Versalien mit Sperrung 0,12 em, Ziffern tabular-nums; für Kicker, Kapitel „01 / 04“, Maße wie „1.230 × 1.480 mm“). Riesenschrift nur als Grafik (SVG, aria-hidden), höchstens einmal je Seite.
- Formen und Raster (Markenregel, geht vor): Radien 8 · 12 · 18 · 24; Knöpfe, Chips, Segmente und Badges sind Pillen. Kontrollhöhen 44 und 52 px, Ziele mindestens 44 px. Raster 4 px, Abstände 8 · 12 · 16 · 20 · 24, zwischen Abschnitten 96 px (Telefon) bzw. 128 px (Schreibtisch). Hauptknopf: Cream-Pille 52 px mit Pfeil im Kreis; Nebenknopf mit 2-px-Rand.
- Bewegung (Markenregel): Dauern 150 · 220 · 320 ms für Rückmeldungen, 600 ms Auftritte, 900 ms großer Auftritt; Auftritt = aufblenden, 24 px aufsteigen, von 0,98 auf 1; Federn nur, wo die Hand direkt führt, höchstens 3 % Überschwingen; höchstens ein Drittel der Elemente bewegt sich gleichzeitig; Scrolltempo nie verändern; jede Bewegung mit ruhiger Fassung („weniger Bewegung“ zeigt das Endbild).
- Geräte und Breiten: Telefon 390 × 844 zuerst (Hauptansicht), dann Schreibtisch 1280 und 1024. Am Schreibtisch nichts überdimensionieren.
- Technikstufe: 2 für Verkaufsflächen (Echtzeit-3D/WebGL, wo Tiefe, Licht oder Verzerrung den Unterschied machen), immer mit Stufe 0 als Ersatzfassung; ohne JavaScript bleibt alles lesbar und bedienbar. Keine fremden Server: Schriften, Bibliotheken und Bilder liegen lokal. Flüssig auf einem mittleren Android-Telefon; Schleifen laufen nur, solange das Element im Bild ist.
- Stilvariante: B (plastischer Hauptdarsteller im gestalteten Licht: Foto der Figurenwelt im Licht, gerendertes Fenster, Gerät mit echtem Bildschirm).
```

## Woher die Werte stammen

| Angabe | Quelle |
|---|---|
| Marke, Wortmarke, Zeichen, Wortspiel | [GESTALTUNG.md](../GESTALTUNG.md), „System“: Marke, Wortspiel mit „eezi“ |
| Pakete und Preise | `web/assets/pakete.js` (EEZI Essential 29/99, Essential Plus 39/199, Signature 64/279, netto); Aufmaßblatt: README.md |
| Farben | [GESTALTUNG.md](../GESTALTUNG.md), „Farbe“; `web/assets/gemeinsam.css` (Statusfarben) |
| Farbanteile, Licht mit Quelle, Schatten | `designrichtung.md` 3.1 (Skill `premium-gestaltung`) |
| Schrift, Größen, Gewichte | [GESTALTUNG.md](../GESTALTUNG.md), „Schrift“; Technikstimme und Lesetext: `designrichtung.md` 3.2 |
| Radien, Kontrollhöhen, Raster, Abstände | [GESTALTUNG.md](../GESTALTUNG.md), „Fläche, Form, Raum“; Abschnittsabstände: `designrichtung.md` 3.3 |
| Bewegung | `designrichtung.md` 3.5; Dauern 150/220/320 ms: [GESTALTUNG.md](../GESTALTUNG.md), „Bewegung“ |
| Bildwelt | [GESTALTUNG.md](../GESTALTUNG.md), „Bildsprache“; `designrichtung.md` 3.4 |
| Geräte, Technikstufe, keine fremden Server, Ehrlichkeit | `SKILL.md` des Skills `premium-gestaltung`, Abschnitte 1 bis 4 |
| Stilvariante B | [../website-blueprint/02-design-grammatik.md](../website-blueprint/02-design-grammatik.md): Dialekt B als Hausdialekt der Bühnen und der Produktdemonstration |

## Noch nicht im Block: Vorschläge des Blueprints mit offener Freigabe

Das Designsystem des Website-Blueprints ([../website-blueprint/11-designsystem.md](../website-blueprint/11-designsystem.md), 11.3 und 11.4) schlägt einige Änderungen an den heutigen Regeln vor. Sie gelten erst nach deiner Freigabe und sind deshalb oben nicht eingetragen. Beispiele:

- Versalzeilen (Kicker, Kapitelzeilen) einheitlich Inter 600 mit Sperrung 0,12 em statt heute 800 mit 0,18 em (DS-AB-1).
- 13 px nur noch für die Technikstimme; jeder bedeutungstragende Satz mindestens 15 px (DS-AB-2).
- Neue Rollen aus vorhandenen Werten: Papierweiß #ffffff für Blätter und Zeichnungskarten, Zeichnungsorange auf Papier #c2410c, Schrift auf Papier #141414, gedrückte Cream #e2e1db (H5-AB-1, P-AB-2, DS-AB-7).

Nach einer Freigabe werden sie hier in den Block übernommen.

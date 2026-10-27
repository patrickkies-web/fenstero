# Vorlagen-Abgleich „Typografie“ · Variante „große Bühne“ (27.10.2026)

Gelesen: Brief, README der Vorlagen, Bilder 01, 02, 04, 09, 10, 11, 12, Startseite, alle 14 Bilder der Folie, start.css, start.js, index.html, Typografie-Regeln der DNA.

## Wie die Vorlagen setzen

- Zahl und Einheit: „80gr“ (01), „160gr“, „120 °C“ (02), „12.4kWh“ in 300 (10), „22.5°C“ (11). Die Einheit steht auf derselben Grundlinie direkt daneben, ein Drittel bis halb so hoch, heller; nie hochgestellt.
- Etiketten an der Sache: „Solar • 3.8kW“ (11): Name hell in 500, Wert kleiner (etwa 75 %) in Silber; getrennt über zwei Größen, nicht nur zwei Farben.
- Glas-Chips tragen eine Stimme und ein Zeichen; eine Handlung erkennt man am weißen Kreis mit Pfeil (01, 02, 06, 12).
- Überschriften: auf der Startseite der Anfang hell, die zweite Stimme danach in Silbergrau. Titel aufs Bild legen wird hier nicht empfohlen (helle Putzwand, die Bühne braucht jeden Pixel).

## Fünf Hebel nach Wirkung

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | „mm“ steht hochgestellt wie ein Exponent; Ursache `.ez-mass__feld b { align-self: center }`. Proportionalziffern lassen die Pille je Taste unterschiedlich wachsen. | `.ez-mass__feld { padding: 8px 18px 0 }`, `b { align-self: auto; letter-spacing: -.03em; font-variant-numeric: tabular-nums }`, `small` .875rem mit `margin-left: .25em`; klein und groß entsprechend; `.ez-mass__zb` als Label 12/400/.03em. | „1.410 mm“ wie auf dem Aufmaßblatt, Einheit leise (G3), ruhigeres Wachsen beim Tippen. |
| 2 | „Groß ansehen“ sieht aus wie die Lupen-Etiketten (gleicher Verlauf, Schatten, Rundung); 13 px klein. | Zeichen in weißem Pfeilkreis: `.ez-gross-auf svg { width: 36px; height: 36px; padding: 10px; border-radius: 50%; background: var(--weiss); color: var(--schwarz) }`, `.ez-gross-auf { padding: 0 16px 0 4px; gap: 10px; font: 500 .875rem/1 }`. | Unten links sofort „zum Drücken“, oben „zum Lesen“; dasselbe Zeichen wie der Pfeilkreis der Pille. |
| 3 | In den Lupen-Etiketten sind Name und Zusatz gleich groß (13/13), nur die Farbe trennt. | `.ez-mass__text { font: 400 .75rem/1.25; letter-spacing: .01em }`, `b { font: 500 .9375rem/1.15; letter-spacing: -.01em; margin-bottom: 2px }`; klein `b` .875rem, groß `b` 1.0625rem und Zusatz .875rem. | Das Ding ohne Brille lesbar; die Pille wird nicht höher. |
| 4 | (a) Notiz-Knopf: die Regel `.ez-notiz` der Notizspalte greift auch am Knopf (Stift über dem Wort, vom Ring angeschnitten). (b) Zweite Stimme verkehrt: „Höhe der“ grau, aber „Höhe/Breite“ wechselt von Maß 2 zu 3. (c) Großansicht-Titel 600/26 gegen Folie 500/28. | (a) Klasse am Knopf umbenennen oder Regel auf `aside.ez-notiz` begrenzen. (b) „Höhe *der* Öffnung.“, nur das Artikelwort Silbergrau. (c) `.ez-gross__titel { font: 500 1.75rem/1.1; letter-spacing: -.025em }`. | Beide unterscheidenden Wörter hell; Großansicht wie dieselbe Seite vergrößert; Notiz-Knopf wieder sauber. |
| 5 | Die Warnung braucht vier Zeilen (etwa 69 px) in 52 px; „(Maß 1: 1.410 mm).“ steht allein in Zeile 2. | Text: „Größer als die Öffnung. Maß 1 (1.410 mm) prüfen: an der Mauer messen, nicht am Rahmen.“; `zweiStufen()` trennt nach „Öffnung.“ → drei Zeilen, etwa 51 px. | In einem Blick lesbar, nichts überlappt. |

**Zusatz Glas-Chip:** „· Messen“ in derselben Stimme mit Trennpunkt, und der Chip wechselt zwischen Maß 2 und 3 die Länge. Vorschlag: Zusatz Silbergrau 400 ohne Punkt, oder auf dieser Folie immer kurz.

**Bleibt:** Zahl in 300, Titel 500 eng, Unterzeile 14 px Silbergrau, Etiketten zweizeilig, Lupen und Zahl auf der Linie.

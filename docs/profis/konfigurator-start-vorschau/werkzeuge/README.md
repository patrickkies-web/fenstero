# Werkzeuge der Messfolie (Vorschau)

Woraus die Bilder unter `bilder/mess/` und die Lagen in `bilder/mess/lage.json` (eingefügt in start.js als `MESS_LAGE` und
`MESS_RAHMEN`) entstehen. Alles läuft gegen den Dev-Server der App (`KI_ATTRAPPE=1 PORT=8788 node scripts/dev-server.mjs`) mit
`?gl=voll` in Chromium mit SwiftShader (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`). web/assets/buehne.js
bleibt unverändert; für die hohe Auflösung wird die Begrenzung der Pixeldichte nur im Testbrowser umgeschrieben.

- `render-schraeg.mjs`: das Modell der Wünsche in der Messansicht der App (schräg), Leinwand Faktor 6 (2148 × 1404), alle vier Werte gesetzt.
- `render-front.mjs`: dasselbe Modell in der Ansicht „front“ der App (--rx 0, --ry 0) für die waagerechten Maße.
- `lage-front.mjs`: nur die Linienlagen der Frontansicht, mit längerer Wartezeit (die Lagen müssen nach dem Drehen erfasst werden).
- `daten.py`: Bilder beschneiden (2148 × 1400, WebP 78), Lagen in Bildpixel umrechnen, Kanten nach dem Helligkeitsprofil korrigieren,
  `MESS_LAGE` und `MESS_RAHMEN` in start.js schreiben.

Die Pfade der Skripte sind die der Arbeitssitzung (Ordner `mess-render/`); vor dem nächsten Lauf anpassen.

## Ränder und Ergebnis (27.10.2026)

- `lage-rand.mjs`: Lagen der vier Randmaße (Höhe links und rechts, Breite oben und unten) im Modell der App, im selben Zustand wie die
  Messbilder (Lage für die Bühne im Raum gerechnet, dann ohne `raum-licht` aufgenommen, Bühne 358 × 234); `VW=390 VH=418` setzen.
- `rand-daten.py`: rechnet die Lagen in Bildpixel um und schreibt `RAND_LAGE` (Höhen schräg, Breiten von vorn) und `PASST_LAGE`
  (alle sechs Maße der Öffnung von vorn, für „Passt.“) in start.js.
- `render-ergebnis.mjs`: das Modell in der Ansicht „result“ der App (Bühne 358 × 300) mit den Lagen der vier Maße des Ergebnisses;
  `DPR=6` (oder 4, dann von `ergebnis-daten.py` auf 2148 × 1800 gebracht).
- `ergebnis-daten.py`: WebP nach bilder/ergebnis/ und `ERG_LAGE` in start.js.

## Wünsche und Abschluss (27.10.2026)

- `wunsch-render.mjs`: geht die Wünsche der App durch (Fenster, „Üblich“), liest je Frage Texte, Optionen und Erklärungsschlüssel aus dem
  DOM und nimmt das Modell der Bühne auf, bei Auswahlfragen je Option (`DPR=4`; `OHNE_OPT=1` nur Inhalte und ein Bild je Frage).
- `wunsch-gloss.mjs`: die Erklärungen (GLOSS der App) zu allen genannten Schlüsseln.
- `wuensche-daten.py`: Bilder nach bilder/wuensche/ (WebP, 1074 px), Zeichnungen der App als Strichzeichnung, schreibt wuensche-daten.js.
- Die Folien Gespeichert bis Teilen stehen in index.html (ursprünglich als eigenes Fragment gebaut, seit der Übernahme dort gepflegt).
- Die Pfade sind die der Arbeitssitzung (Scratchpad); vor dem nächsten Lauf anpassen.

## Haustür (3.11.2026)

- `render-zustand.mjs`: setzt den Zustand direkt (Elementart, die vier Werte der Balkontür 2150/2110/900/860) statt durch die Folien zu
  tippen, öffnet die alte Messansicht der App (`SCREENS.messenAlt`) und nimmt sie schräg oder von vorn auf. Die Haustür hat dieselbe
  Größe und Kamera wie die Balkontür; messen-dna.js übernimmt deshalb deren Linienlagen. Von vorn mit Knauf statt Stoßgriff gerendert,
  weil die Kante der langen Stange sonst bei Faktor 6 durch die Füllung schimmert (von innen ist der Griff außen ohnehin nicht zu sehen).
- Kontrolle: Die Balkontür auf diesem Weg weicht vom Bild vom 27.10.2026 im Mittel um 6 von 255 ab (Licht und Glas), Lage gleich.

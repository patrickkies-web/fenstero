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

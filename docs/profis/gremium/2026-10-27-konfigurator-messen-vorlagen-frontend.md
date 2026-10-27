# Vorlagen-Abgleich Frontend und Leistung: Konfigurator Schritt 3 „Messen“

Tobias Lenz, 27.10.2026. Ich habe die Folie in Playwright gemessen (360 × 680, 360 × 740, 384 × 700, 390 × 844 und 412 × 780/915), dazu den Code von start.css, start.js, app.js und buehne.js gelesen. Dateien habe ich nicht geändert.

## Wie die Vorlagen ihre Tiefe bauen
- **Eine Lichtrichtung, Flächen werden zur Kante hin dunkler:** Karten der Switch-App (03), Beton im harten Licht (09), Domus (11).
- **Eine zweite Ebene mit Körper:** oben eine 1-px-Lichtkante, der Schatten fällt in Lichtrichtung und ist nach dem Untergrund getönt (01 Glaskarte, 04 Kachel, 03).
- **Die Werte hängen an der Sache** (11 Werte am Haus, 01 Karte am Teller).
- **Echtes Glas nur an einer Stelle,** alles andere ist deckend mit einem Verlauf.

Fast alles davon ist statisch: einmal gemalt, ohne filter. Genau das macht es auf Android billig.

## Vorab: Bei typischen Android-Höhen verschwinden Tasten
- **360 × 680** (üblich für Chrome mit Adressleiste): Die Tastenreihe „0 / ⌫“ liegt ganz unter dem klebenden Fuß.
- **360 × 740:** 6 px der Reihe und der Rand der Karte liegen im Verlauf des Fußes.
- **Ursache:** Die Untergrenze `Math.max(150, …)` in start.js:309 greift. Dazu bricht die Überschrift bei 360 px Breite immer in zwei Zeilen um (66 statt 33 px).
- **Beleg:** Bildschirmfoto `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/tl/v360x680.png`.

Damit ist die feste Regel „nie die Tasten“ verletzt. Das geht vor alle Hebel.

## Fünf Hebel, nach Wirkung geordnet

**1. Licht mit Abfall statt eines hellen Kastens** (Vorlagen 03, 09, 11). Kostet praktisch nichts.
- Ersetzt die Regel in start.css:314 und damit auch die große Innenschatten-Unschärfe von 90 px, die teuer zu rastern ist:
```css
.ez-buehne--mess .ez-buehne__kante { z-index: 2;
  background: linear-gradient(160deg, rgba(255,251,244,.14) 0%, rgba(255,251,244,0) 36%),
    radial-gradient(72% 90% at 55% 44%, rgba(58,46,34,0) 50%, rgba(58,46,34,.16) 76%, rgba(26,20,14,.46) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), inset 0 0 0 1px rgba(7,9,10,.10); }
```
- Die hellste Stelle liegt auf der Mitte des Modells (MESS_LAGE x ≈ 56 %).
- Die Dunkelung ist warm getönt statt schwarz: Auf der Putzfarbe #e9e2d7 wirkt Schwarz schmutzig grau.
- Die Fläche wird einmal gemalt, ohne filter, ohne Blend-Modus, ohne Animation.
- **In der App:** Die Klasse `mess-licht` ersetzt in messOpts und restOpts die Klasse `raum-licht`. Dazu:
  - `.w3d-stage.mess-licht .w3d-gl{z-index:0}`
  - `.w3d-stage.mess-licht::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:<wie oben>}`
  - `.w3d-stage.mess-licht .w3d-cam{z-index:2}`
  - Der Grund: Die Leinwand wird ohne z-index vor `.w3d-cam` eingefügt (buehne.js:345/358). Ohne diese Regeln läge die Fläche unter der Leinwand oder über den Linien.
- **Nicht in den Shader einbauen:** Der Selbsttest (buehne.js:1110–1118) liest die Ecke oben links aus der Leinwand. Eine Fläche aus CSS berührt diesen Test nicht.

**2. Feld und Etiketten mit Körper und Schatten auf der Wand** (Vorlagen 01, 04, 03).
- In den Renderings kommt das Licht von oben links: Die linke Laibung ist hell, die obere verschattet. Die Schatten fallen deshalb nach unten rechts und sind warm getönt.
- start.css:328, das Feld:
  - `background: linear-gradient(180deg,#fff,#f6f3ee)`
  - `box-shadow: 0 0 0 1.5px var(--violett), inset 0 -2px 0 rgba(58,46,34,.07), 0 1px 2px rgba(58,46,34,.30), 2px 12px 22px -10px rgba(58,46,34,.60)`
  - In `.is-fehler` und `.ist-gespeichert` nur den ersten Ring tauschen.
  - Aus der transition `box-shadow 150ms` entfernen: Ein übergehender Schatten mit 22–28 px Unschärfe wird in jedem Bild neu gemalt.
- start.css:327, die Etiketten:
  - `background: linear-gradient(180deg, rgba(52,52,55,.95), rgba(26,26,28,.95))`
  - `box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.05), 1px 8px 16px -8px rgba(40,30,20,.65)`
- Alles bleibt ohne Blur.

**3. Die Bühnenhöhe einmal und stabil rechnen: das Modell so groß wie möglich, die Tasten nie verdeckt.**
- **Untergrenze:** In start.js:309 von 150 auf 112 senken. Unter 150 px bekommt die Bühne die Klasse `ist-flach` mit `.ist-flach .ez-mass__ende .dna-etikett{max-width:none;white-space:nowrap;padding:4px 9px}`.
- **Platz reservieren:** In messZeigen einmal die vier Titel und Unterzeilen setzen, die größte Höhe messen und als `min-height` auf `#mess-h1` und `#mess-unterzeile` schreiben. Das sind acht Messungen, etwa 1 ms, und es springt nichts zwischen den Maßen.
- **Höhe ohne Adressleiste:** H aus einer unsichtbaren Probe mit `position:fixed;height:100svh` lesen statt aus `innerHeight`.
- **resize:** in ein requestAnimationFrame bündeln und nur bei geänderter Breite neu rechnen. Die Adressleiste (etwa 56 px) verschiebt dann nichts mehr.
- **In der App ohne JS-Rechnung:** Die Bühne bekommt `flex:1 1 0;min-height:112px`, die Tastenkarte `flex:none`. Die ResizeObserver der Bühne (buehne.js:357) zeichnet dann nach.

**4. In der App kommen Feld, Linie und Modell aus derselben Matrix** (Werte an der Sache, die mitschwingen; wie Vorlage 11, aber lebendig).
- **Heute:** feldFolgen (app.js:1313) läuft als endlose requestAnimationFrame-Schleife, solange die Bühne im DOM ist, und ruft je Bild dreimal `getBoundingClientRect` auf. Dazu ändert `.w3d-stage.gl .w3d-dim` 0,7 s lang width und height (app.css:459). Bei jedem Tastendruck heißt das 700 ms lang Layout in jedem Bild.
- **Vorschlag:**
  - In `lesen()` (buehne.js ~790) die Matrix der aktiven Linie (`.w3d-dim.mit-feld`) als `B.feldM` behalten, statt sie zu überspringen.
  - In `bild()` nach `B.VP` die beiden Enden projizieren: clip = VP·M·[x,y,0,1]; sx = (x/w+1)/2·cw; sy = (1−y/w)/2·ch.
  - Danach `stage._feld(ax,ay,bx,by)` aufrufen, nur in Bildern, die wirklich gezeichnet werden.
  - Die aktive Linie mit Halo und Kappen flach als SVG in `.w3d-feldlage` zeichnen.
  - feldFolgen bleibt nur für das CSS-Modell und stoppt dort im Ruhezustand.
- **Ergebnis:** Je Bild zwei Projektionen statt Layout. Feld, Linie und Modell laufen synchron, auch im Formwechsel (T_FORM 700 ms, E_FORM).

**5. Kostenbremse: ein Bild je Element, eine Blur-Fläche, kein Blend-Modus.**
- **Bilder:**
  - Je Element sind `-1`, `-2` und `-3` byte-gleich (md5 geprüft); `-4` weicht nur in den untersten Zeilen um höchstens 12/255 ab.
  - Daher nur `bilder/mess/<art>.webp` (6 Dateien, 7,9–11,6 KB), `src` ohne Maßnummer, im Vorladen in messZeigen nur ein Bild. Die Dekodier- und Tauschlogik mit `_nr` entfällt.
  - Ersparnis je Element: 3 Abrufe, 24–33 KB und rund 4 MB dekodierte Bitmaps.
  - index.html:229 lädt `fenster-1` schon beim Seitenstart: `src` erst in messZeigen setzen.
- **Blur:** Gemessen ist `.ez-glaschip` (blur 12px) die einzige Blur-Fläche. In der App über der schwingenden Leinwand würde die Unschärfe in jedem Bild neu gerechnet. Dort deshalb Glas ohne Blur: `linear-gradient(180deg, rgba(44,44,47,.88), rgba(22,22,24,.88))` mit `inset 0 1px 0 rgba(255,255,255,.2)`.
- **Blend-Modus:** `raum-licht::after { mix-blend-mode: screen }` (app.css:1414) fällt mit raum-licht weg und darf mit Hebel 1 nicht zurückkommen.

## Prüfbefunde
- **Bildgewicht und Laden:** Beim Betreten der Folie werden 4 Bilder abgerufen (fenster-1 bis -4). Je Element sind das 31,6–44,7 KB für 6 verschiedene Motive. 716 × 470 entspricht DPR 2 bei 358 × 235. Das passt zur Grenze der Bühne `Math.min(devicePixelRatio, 2)`, also keine schärferen Renderings, als die App zeigen kann.
- **resize:** Jeder Aufruf läuft ohne Bündelung. 20 Ereignisse kosten 6,8–8,3 ms auf einem Desktop-Prozessor, auf einem Mittelklasse-Android etwa vier- bis sechsmal so viel. Schlimmer ist der Sprung: Am Telefon scrollt das Dokument (2086 zu 740 px, wegen der Notizspalte), die Adressleiste klappt und die Bühnenhöhe ändert sich.
- **messBuehneSetzen:** Die Rechnung stimmt: Bildrechteck eingepasst, SVG mit viewBox 100 und non-scaling-stroke, Kappen im selben Rechteck.
  - `legen` liest und schreibt abwechselnd. Das erzwingt etwa 4 Layouts je Aufruf; besser zuerst alle Maße lesen, dann schreiben, wie feldSetzen in der App.
  - Kollidieren alle Kandidaten, nimmt `legen` den ersten, und Überlappung ist erlaubt. Bei 150 px Höhe decken die zweizeiligen Etiketten den Flügel zu.
- **Übertragbarkeit:** Die CSP in web/_headers:7 erlaubt `style-src 'self' 'unsafe-inline'` und `script-src 'self'`. Inline-Styles und `style="--anteil:.5"` gehen also, Inline-Skripte nicht. Nicht 1:1 übertragbar sind:
  - MESS_LAGE: in der App kommen die Lagen aus dem 3-D-Modell;
  - die Hindernisse aus `legen`: feldSetzen kennt den Chip nicht;
  - die Lage des Felds: in der Vorschau links neben der Linie, in der App mittig darauf.

## Risiken bei der Übernahme in die App
1. **raum-licht hängt an vier Stellen:**
   - messOpts (app.js:3358),
   - restOpts (app.js:3404),
   - die Layoutregel `.scr.fit.im-raum > .w3d-stage.raum-licht` mit `min-height:200px` (app.css:1410),
   - die Stile für Feld, Enden und Linie (app.css:1425–1438).

   Ohne Ersatz verlieren Feld und Enden ihren Stil und die Bühne ihre Höhe. Die 200 px müssen auf 112 sinken, sonst gehen bei 680 px wieder Tasten verloren.
2. **`showEl: S.mess.step >= 1` muss `true` werden.** Dann prüfen: Beim Tippen von Maß 1 wird die Öffnung kleiner, während das Element stehen bleibt (zum Beispiel 600 mm bei einem Element von 1.250). Hält w3dCalc das Element in der Öffnung, oder ragt es aus der Wand?
3. **Selbsttest ohne raum-licht:** Dann gilt die strenge Schwelle (alpha ≥ 250, Summe ≥ 60 oben links). Mit HST und FSW bei fitW 0,64 und Versatz über `--dimx` prüfen, ob oben links noch Wand steht.
4. **Fläche aus Hebel 1 im CSS-Modell:** Dort liegt sie unter den Flächen statt darüber, das Bild sieht etwas anders aus. Das ist hinnehmbar.
5. **Leinwand bei jeder Höhenänderung:** `cv.width/height` neu setzen heißt Framebuffer und Schattenkarte neu anlegen. Die stabile Höhe aus Hebel 3 spart also auch WebGL-Kosten.
6. **gl-erbe:** Die Linien stehen beim Wechsel zu WebGL 720 ms auf opacity 0 (app.css:460, buehne.js:322), das Feld steht so lange ohne Linie. Mit der flachen Linie aus Hebel 4 Linie und Feld gemeinsam einblenden.
7. **Glas-Chip mit Blur über der schwingenden Bühne:** kostet in jedem Bild, siehe Hebel 5.

Messskripte und Bildschirmfotos liegen unter `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/tl/`:
- `mess.js`, `hoehe.js`, `shot.js`
- `b360-m1.png`, `v360-m3.png`, `v360x680.png`

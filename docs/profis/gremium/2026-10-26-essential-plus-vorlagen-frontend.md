# Essential Plus (Y), Perspektive Frontend und Leistung · Tobias Lenz · 26.10.2026

Geprüft: Quelle (index.html, start.css, start.js, dna/bundle.js) und im Browser (Chromium, Playwright) unter Telefon 390 × 844 und
320 × 568, Schreibtisch 1000/1024/1100/1280/1600 × 800 und 1280 × 1100, dazu Fast 3G (150 ms, 1,6 Mbit/s) mit CPU 4× gedrosselt,
je drei Läufe. Skripte: scratchpad/frontend-plus.mjs, frontend-plus-2.mjs, start-vergleich.mjs; Bilder und Rohwerte in scratchpad/fe/.
Keine Datei der Vorschau wurde geändert; die verkleinerten Bilder liegen nur in scratchpad/fe/klein/.

## Messwerte

| Was | Y gemessen | Bemerkung |
|---|---|---|
| Querscrollen 390 / 320 | nein / nein | `html { overflow-x: clip }` fängt alles ab |
| Reihe „Faltschiebewand“ | Wort 90 px breit, Kachel innen 72 px (390) bzw. 54 px (320) | läuft 9 bzw. 18 px je Seite über die weiße Kachel in die Nachbarn |
| Rendering „Alles, was Sie planen“ 1280 / 1600 | ragt 59 px rechts aus der Kachel; 29 / 189 px Rest bis zum Fensterrand | im Fenster; 23 px Abstand zu Foto 4/6, 19 px unter die Kachel, 48 px bis zur Reihe: überdeckt nichts |
| dasselbe 1000 / 1024 / 1100 | Rest 0 / −1 / −5 px | am Tablet quer berührt das Rendering den Fensterrand, der Schatten wird beschnitten |
| Muster-Ebene aus → an | Kopf 72 → 88 px, Hero rückt 16 px, Fußzeile 20 → 46 px, Seite +42 px | Chips erscheinen ohne Übergang (`display`) |
| Vorhang 1280 × 1100 | Szenen 605 / 1230 / 1186 / 1444 / 714 px, `--dna-szene-oben` 0 / −130 / −86 / −344 / 0 | kein Loch, kein Sprung; Hero 605 px wie die Startseite (569 px), Szene 2 ab dem ersten Bild sichtbar |
| Bilder | 20 `<img>`, alle mit `width`/`height`, alle `decoding="async"`, 0 lazy, 466 kB | Bühne `fetchpriority="high"` + Preload, gut |
| Bildbytes je Szene | 1: 151 kB (Bühne 102, Gerät 49) · 2: 188 kB (Rendering 107, Reihe 81) · 3: 31 kB · 4: 97 kB (modell-weiss, am Telefon `display: none`, trotzdem geladen) · 5: 0 | Fotoplätze nutzen buehne.webp erneut (Cache) |
| Laden Fast 3G, CPU 4× | LCP 2 404–2 432 ms (Bühne), load 3 130–3 151 ms, Bühne fertig bei 2 350 ms | die 316 kB unter der Falz teilen sich die Leitung mit der Bühne |
| Schrift | outfit.woff2 (32 kB) per Preload, fertig bei 38–52 ms (lokal) bzw. 980 ms (3G); Doto deklariert, nie geladen (`.dna-zahl--punkt` kommt nicht vor) | gut; Doto-Zeile kann raus |
| Backdrop-Filter | 16 Elemente, 15 sichtbar (Muster an), 9 ohne Muster; Startseite: 3 | Scroll-Frames CPU 4×: Mittel 16,8 vs 16,7 ms, Maximum 33 vs 17 ms, 2 vs 0 Frames über 33 ms (ohne GPU, daher nur Tendenz) |
| Filter | 1× `drop-shadow` am Rendering, Wort-Blur nur bis `ist-da` (mit `will-change`) | sauber |
| Konsole | 0 Fehler | |

## Die fünf Hebel nach Wirkung

### 1. Bilder unter der Falz erst beim Scrollen laden
- **Wo:** `index.html`, die acht `<img>` in Szene 2 bis 4: `bilder/so/modell-sprosse.webp`, `bilder/reihe/*.webp` (4), `bilder/so/wand-innen.webp`, `bilder/so/modell-anthrazit.webp`, `bilder/so/modell-weiss.webp`.
- **Was:** Alle 16 Bilder starten bei 17 ms gleichzeitig. Auf Fast 3G ist die Bühne (LCP) erst bei 2 350 ms fertig, LCP 2 404–2 432 ms,
  load 3 130 ms. `fetchpriority="low"` auf den acht Bildern ändert nichts (LCP 2 412–2 428 ms). Mit `loading="lazy"` auf denselben
  acht: LCP 1 440–1 528 ms, load 1 650–1 700 ms, 151 kB statt 466 kB vor dem ersten Scrollen. modell-weiss.webp (97 kB) wird am
  Telefon geladen, obwohl `.ez-bereit__bild { display: none }`.
- **Wie:** `loading="lazy"` auf die acht Bilder (Szene 1 bleibt eager). Für modell-weiss zusätzlich
  `<picture><source media="(min-width: 900px)" srcset="bilder/so/modell-weiss.webp"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" …></picture>`,
  damit das Telefon es nie holt. Die Startseite hat sich für `loading="eager" fetchpriority="low"` entschieden; hier zeigt die Messung,
  dass das nichts bringt, lazy aber 900 ms.
- **Warum:** Das erste Bild ist die Bühne; alles, was mit ihr um die Leitung konkurriert, verschiebt den Moment, in dem der Hauseigentümer
  das Gerät des Betriebs sieht. 38 % kürzeres LCP ohne eine Zeile CSS.

### 2. Renderings und Reihenbilder auf Darstellungsgröße bringen
- **Wo:** `bilder/so/modell-sprosse.webp`, `bilder/so/modell-weiss.webp` (beide 1 398 × 1 425), `bilder/reihe/*.webp` (229–262 × 320),
  `bilder/so/wand-innen.webp` (640 px); Darstellung: `.ez-planen__bild` 193 px (Telefon) / 315 px (Schreibtisch), `.ez-bereit__bild img`
  385 px, `.ez-reihe img` 48–60 px hoch, `.ez-schritt__bild--foto img` 128 px.
- **Was:** modell-sprosse ist 4,4× breiter als nötig (bei 2× Pixeldichte 630 px), die Reihenbilder 2,7× höher als nötig (120 px bei 2×).
  Probe mit Pillow (Qualität 82, Kopien in scratchpad/fe/klein/): modell-sprosse 720 px 104 → 46 kB, modell-weiss 800 px 94 → 49 kB,
  vier Reihenbilder 144 px hoch 77 → 23 kB, wand-innen 320 px 6 → 3 kB. Summe 281 → 121 kB, Seite 466 → 306 kB.
- **Wie:** Die vier Dateien in den genannten Größen neu schreiben (Renderings mit Alphakanal behalten), `width`/`height` im HTML
  anpassen (720 × 734, 800 × 815, 103–118 × 144, 320 × 316). Für die Instanz gilt dieselbe Regel für die sechs Fotos des Betriebs:
  Foto 1 (Bühne) 1 000 px, Fotoplätze 2 bis 6 je 2× Kachelbreite (640 bzw. 1 100 px), beim Hochladen serverseitig verkleinern.
- **Warum:** 160 kB weniger bei identischem Bild; Decode der 2-Megapixel-Renderings (1 398 × 1 425 × 2 = 8 MB Rohdaten im Speicher)
  fällt weg, das zählt auf älteren Telefonen mehr als die Bytes.

### 3. „Faltschiebewand“ in der Reihe umbrechen
- **Wo:** `index.html` Z. 186 (`.ez-reihe li` „Faltschiebewand“), `start.css .ez-reihe li { font: 500 12px/1.15 … }`, Raster
  `repeat(4, minmax(0, 1fr))` mit `gap: 8px`.
- **Was:** Das Wort ist 90 px breit, die Kachel innen 72 px (390) bzw. 54 px (320). Der Text steht 9 bzw. 18 px je Seite über der weißen
  Kachel, bei 320 sichtbar über den Nachbarn „Hebe-Schiebe“ und am Fensterrand abgeschnitten („Faltschiebewa“). „Hebe-Schiebe“ bricht
  am Bindestrich sauber in zwei Zeilen; Faltschiebewand hat keinen.
- **Wie:** `Faltschiebe&shy;wand` im HTML (auch Z. 90 im App-Raster, dort reicht es heute mit 98 px Innenbreite nur knapp) und als
  Sicherung `.ez-reihe li, .ez-app__raster span { overflow-wrap: anywhere; hyphens: manual; }`. Keine Verkleinerung der Schrift,
  12 px ist die Untergrenze.
- **Warum:** Ein über die Kachel laufendes Wort ist der einzige sichtbare Layoutfehler der Seite, und er liegt in der Reihe, die zeigt,
  was der Konfigurator kann.

### 4. Muster-Ebene ohne Layoutsprung umschalten
- **Wo:** `start.css`: `.ez.ist-muster .ez-kopf { padding-bottom: 28px }`, `.ez-muster { display: none }` / `.ez.ist-muster .ez-muster
  { display: inline-flex }`, `.ez-muster--kz { position: static }`; `.ez-fuss__kz`.
- **Was:** Beim Umschalten wächst der Kopf von 72 auf 88 px, der Hero samt Pille rückt 16 px nach unten (Pille 614 → 630 px), die
  Fußzeile von 20 auf 46 px, die Seite um 42 px. Die Chips erscheinen in einem Frame (`display`), der Schalter selbst blendet in 220 ms.
  Bei 320 px liegen „Ihre Farbe, Ihr Zeichen“ (28–182 px) und „Foto 1 von 6: die Bühne“ (138–292 px) 44 px übereinander, und der Schalter
  (115 px) deckt die Wortmarke „Fensterbau · Köln“ im Kopf.
- **Wie:** `.ez-kopf { padding-bottom: 28px }` ohne Bedingung (die Vorlage trägt die Ebene immer, in der Instanz fällt das Muster-CSS ganz
  weg). Fuß: `.ez-fuss__kz { position: relative; margin-top: 20px }`, `.ez-muster--kz { position: absolute; left: 0; bottom: calc(100% + 8px);
  margin: 0 }`. Chips: `.ez-muster { display: inline-flex; opacity: 0; visibility: hidden; transition: opacity 220ms ease-out, visibility 0s
  linear 220ms }`, `.ez.ist-muster .ez-muster { opacity: 1; visibility: visible; transition-delay: 0s }`. Unter 360 px:
  `.ez-muster--geraet { display: none }` und `.ez-kopf .ez-logo__wort small { display: none }`.
- **Warum:** Der Schalter ist das Element, das Fensterbauer auf der Verkaufsseite als Erstes anfassen. Springt dabei die Pille, wirkt
  die Vorlage unfertig; der 220-ms-Übergang gehört zum Schalter (emil-design-eng: Rückweg 220 ms, ease-out).

### 5. Glas-Chips ohne Backdrop-Filter, wo nichts dahinter liegt
- **Wo:** `start.css .ez-glaschip` (6×), `.ez-muster` (7×), `.ez-adresse .dna-etikett`, `.ez-leiste`; `dna/bundle.css .dna-etikett`
  (`.ez-bereit__etikett`): alle `backdrop-filter: blur(12px)` bzw. `blur(16px) saturate(150%)`.
- **Was:** 16 Backdrop-Elemente (15 sichtbar), ohne Muster 9; die Startseite hat 3. Die Chips über den Fotoplätzen liegen auf einer
  unbewegten Fläche (Verlauf + Schraffur + buehne.webp bei Deckkraft .55), der Weichzeichner hat dort nichts zu verwischen. Sie sitzen in
  klebenden Szenen mit `border-radius` und `overflow: hidden`; Safari zeichnet je Chip einen eigenen Backdrop-Wurzelbaum bei jedem
  Vorhang-Frame. Messung ohne GPU: Maximum 33 vs 17 ms, 2 vs 0 Frames über 33 ms, Mittel gleich; die Wirkung zeigt sich erst auf dem
  echten Telefon.
- **Wie:** `.ez-glaschip, .ez-muster { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(32,32,34,.9); }`; Lichtkante
  und Rand bleiben, der Look auf dunklem Grund ist derselbe. Backdrop behalten nur an `.ez-leiste` (bewegter Inhalt darunter), am
  Domain-Etikett auf der Bühne (Foto) und am `.ez-bereit__etikett` (Rendering): 15 → 3 wie die Startseite. Sobald echte Fotos in den
  Plätzen liegen, gilt dasselbe: ein Chip über einem Foto braucht `rgba(32,32,34,.78)` und keinen Blur.
- **Warum:** Backdrop-Filter ist der teuerste Effekt, den CSS kennt; zwölf davon in Szenen, die als Vorhang übereinandergleiten, sind
  der wahrscheinlichste Grund für Stottern auf iPhones, und sie bringen hier keinen sichtbaren Unterschied.

## Beim Übertragen in web/ (kein Hebel, aber Pflicht)

**CSP** (`web/_headers`, `functions/seo.js SICHERHEIT`: `script-src 'self'; style-src 'self' 'unsafe-inline'`):
- Z. 7 `<script>document.documentElement.classList.add("ez-js")</script>` wird blockiert → `<script src="/assets/js-da.js">` wie auf
  /fuer-fensterbauer/ (Datei liegt schon in web/assets/).
- Z. 4 `<style>html,body{background:#07090a}</style>` → raus, `start.css` setzt es in Zeile 9/10 ohnehin (die Datei kommt vor dem ersten
  Bild, wenn sie wie bei der Fensterbauer-Seite als `/assets/essential-plus.css` eingebunden ist).
- Z. 20–26, Block der Firmenfarbe: funktioniert heute nur wegen `'unsafe-inline'`. Sauber: `functions/instanz/seiten.js` liefert je Instanz
  `/firma.css` (vier Variablen, serverseitig gerechnet: `--firma`, `--firma-tief` = 40 % Firma auf #07090a, `--auf-firma` nach Kontrast
  ≥ 4,5:1, `--firma-licht`, `--hinweis` bei Rot/Orange Silbergrau), `Cache-Control: public, max-age=300` wie das favicon.svg, eingebunden vor
  start.css. Ein `style`-Attribut auf `<main>` ginge auch, fällt aber ebenfalls, sobald `'unsafe-inline'` je gestrichen wird.
- 23 `style="…"`-Attribute (`--i` 11×, `--bx/--by/--bz` 5×, `--anteil` 5×, `--farbe` 3×, `--i:0` an den Anker-Linien) → in CSS über die
  vorhandenen Selektoren (`.ez-kicker { --i: 6 }`, `.ez-foto[data-foto="3"] { --bx: 70%; --by: 30%; --bz: 2.2 }`,
  `.ez-foto[data-foto="3"] .ez-ring { --anteil: .5 }`, `.ez-farben i:nth-child(n)`). `bundle.js` setzt `--i` per `style.setProperty`
  (CSSOM), das bleibt unter CSP erlaubt.
- Schriften: `@font-face` mit relativem `fonts/outfit.woff2` → `/fonts/fonts.css` des Projekts (outfit.woff2 und doto.woff2 liegen dort),
  Preload auf `/fonts/outfit.woff2`; Doto-Deklaration in start.css streichen (ungenutzt). tokens.css/bundle.css: wie bei der Fensterbauer-
  Seite nach web/assets/ (dna-bundle.js liegt schon dort; prüfen, ob bundle.css/tokens.css dem Stand von docs/profis entsprechen).
- Fehlende Hülle: index.html ist ein Fragment ohne `<!doctype>`, `<html lang>`, `<meta viewport>`; `lang="de"` sitzt auf `<main>` (für
  `hyphens` reicht das, für Screenreader gehört es auf `<html>`). `<meta name="claude:viewport-fit-sides">` ist Artifact-Technik, raus.

**Instanz** (`functions/instanz/seiten.js`):
- 50 `data-vorlage`-Stellen, 27 Schlüssel: `firma.name` 11×, `ziel.konfigurator` 4×, `firma.zeichen` 3× (SVG, `fill="var(--firma)"`),
  `firma.logo` 3× (Zeichen + Wortmarke), `firma.telefon` 3× (eins ist der Rundknopf mit `href="#"` → `tel:`), `firma.mail` 2× (→ `mailto:`),
  `firma.karte` (→ Kartenlink), `firma.ansprechpartner` und `.bild` 2× (Initialen → `<img>` 72 px), `firma.anschrift` 2×, `firma.ort`,
  `firma.titel`, `firma.text`, `firma.feinaufmass`, `firma.domain`, `firma.website`, `firma.foto.2–6`, `start.kicker/ueberschrift/text`,
  `recht.impressum/datenschutz`. Z. 15 im Kommentar trägt `data-vorlage="…"` als Beispiel, nicht ersetzen.
- Betrieb ohne `data-vorlage`, die der Worker trotzdem ersetzen muss: `<title>`, `<meta description>` (Z. 1–2), `aria-label` Z. 45, 55, 138,
  `figcaption` Z. 106 (Domain im Text), Z. 328 `.ez-url` „fensterbau-brandt.de“ (kein Attribut!), Z. 349 „Büro in Köln“ (Fließtext).
- `data-foto="1"` ist `.ez-buehne__foto` (`src`, 1 000 × 750, `fetchpriority="high"` + Preload-`href` mit ersetzen). `data-foto="2…6"`:
  `.ez-foto__grund` (CSS-Hintergrund buehne.webp), `.ez-foto__schraffur`, `.ez-glaschip--foto` und „Foto folgt“ weg, dafür
  `<img loading="lazy" width height alt>` als erstes Kind; Chip über Foto ohne Blur (Hebel 5). Fehlt ein Foto, bleibt der Platzhalter
  nicht: `grid-template-areas` ist fest (`"g g f3 p" "g g f4 p" "f5 f6 f6 p"`), für 0, 2, 3 oder 4 Fotos braucht es je eine eigene Areas-
  Zeile oder die Kachel „Alles, was Sie planen“ übernimmt die freien Flächen.
- Muster-Ebene weg: Klasse `ist-muster` auf `<main>`, `button#muster-schalter` (Z. 54, `.ez-kopf__rechts` behält den Rundknopf), die sieben
  `.ez-muster`-Spans (Z. 51, 102, 104, 105, 111, 139, 387), in start.css die 23 Zeilen des Blocks „Muster-Ebene“ (Z. 59, 81–101, 121), in
  start.js der Block „Muster-Ebene“ (localStorage-Schlüssel `ez-muster`) und der `a[href="#"]`-Fänger, sobald alle Ziele gesetzt sind.
- Bleibt wie es ist: `defineProperty(innerHeight)` für den Vorhang, Leiste mit `messeGrenze` (rechnet anders als die Startseite mit der
  klebenden Kante der Szene 1, korrekt), Fokus unter dem Vorhang, `prefers-reduced-motion` (0 Animationen, steht sofort).

## Weitere Befunde, kein Hebel
- Rendering am Tablet quer (1 000–1 100 px): Rest zum Fensterrand 0 bis −5 px, der `drop-shadow` wird beschnitten. Eine Zeile:
  `@media (min-width: 760px) and (max-width: 1199px) { .ez-planen__bild { right: -12%; width: 108%; } }` → 26 px Rest bei 1 024.
- 1280 × 1100: Hero 605 px, darunter steht ab dem ersten Bild die weiße Szene 2 mit ihrer runden Kante (die Startseite macht es mit 569 px
  genauso). Keine Technik-Frage; falls das Gremium den Empfang bildschirmfüllend will: `.ez-hero { min-height: calc(100svh - 120px) }`.
- Reihe: `bilder/reihe/balkon|fsw|hst|psk.webp` (95 kB) liegen im Ordner, werden nicht referenziert; vor dem Übertragen löschen.
- Startseite zum Vergleich (gleiche Messung): 3 Backdrop-Elemente, 10 Bilder mit `fetchpriority="low"`, Szenen 569/1186/1695 px bei 1100 Höhe.

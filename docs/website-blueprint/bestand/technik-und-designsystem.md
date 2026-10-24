# Bestand: Technik, Designsystem, Komponenten, Assets

Phase A der Neukonzeption nach MASTER-PROMPT V4, Teil „Technik, Designsystem, Komponenten, Assets“. Grundlage ist der Zweig
`claude/design-dna-styleguide`, Commit `dc130d0` vom 24.10.2026. Das Repository wurde nur gelesen. Fundstellen stehen als
`Datei:Zeile` und beziehen sich auf diesen Stand. Byte-Größen sind ungepackt mit `wc -c` gemessen, wo angegeben zusätzlich mit
`gzip -9`. Pixelmaße stammen aus `identify`, Videodaten aus `ffprobe`. „Wiederverwendbar“ und „geeignet für“ sind Einschätzungen für
die Neugestaltung und keine Geschäftsangaben.

Anforderungen setzen drei Dateien: `.claude/skills/premium-gestaltung/SKILL.md` (Vorstellungen des Inhabers),
`.claude/skills/premium-gestaltung/designrichtung.md` (Aussehen der Verkaufsflächen) und `docs/GESTALTUNG.md` (Markenregeln). Die
heutige visuelle Struktur ist kein Vorbild. Sie wird hier beschrieben, damit klar ist, was vorhanden ist und was eine Neugestaltung
auslöst.

## Kurzfassung

- **Auslieferung.** Ein Cloudflare Worker liefert `web/` ohne Build-Schritt aus und schreibt das HTML beim Ausliefern um: Kopfzeilen,
  Canonical, Paket-Bausteine, Einführungspreis. Die Startseite wird im Browser gerendert (`portal.js`). Die Verkaufsseite
  `/fuer-fensterbauer/` ist statisches HTML. Die Startseite holt sie in der Ansicht „Fensterbauer“ per `fetch` und bettet sie ein.
- **CSP.** Erlaubt ist nur die eigene Herkunft. Inline-Skripte, `eval`, WebAssembly, fremde Schriften, CDNs, Videoplattformen und
  Analyse-Dienste sind ausgeschlossen. `frame-ancestors 'none'` verbietet auch das Einrahmen der eigenen App. Die Prüfsuite meldet
  zusätzlich jede fremde Anfrage als Fehler.
- **Designsystem.** Die Tokens stehen an einer Stelle (`web/assets/gemeinsam.css:9–32`). Die Verkaufsseite nutzt fünf
  Schriftgrößen (13, 15, 17, 24, 40, am Telefon 32), die die Prüfsuite erzwingt. Die Startseite folgt einer zweiten Skala aus dem
  Betriebsbereich mit `clamp()`-Werten, die nicht automatisch geprüft wird.
- **Bewegung.** Es gibt fertige Helfer (`Scroll.binden`, `Reveal.auf`, `Lottie.auf`, `Haptik`, `Feier`) und auf der Verkaufsseite
  sieben der zehn Stilbausteine der Designrichtung, die meisten an genau einer Stelle. Explosionsansicht und Riesenwort fehlen ganz.
  Die Kapitelanzeige ist nur teilweise umgesetzt.
- **WebGL.** Die Bühne (`buehne.js`) zeichnet das Fenstermodell der App sehr detailliert. Sie hängt aber an `app.js` (810 KB) und
  lässt sich nicht neben `portal.js` laden, weil beide dieselben globalen Namen deklarieren.
- **Material.** Es gibt fünf echte Fotos. Weitere sieben Plätze tragen Platzhalter, drei davon sind auf Startseite und Verkaufsseite
  eingebaut (`gross`, `fb-kundenschutz`, `fb-frage`). Dazu kommen ein echtes Aufmaßblatt als Bild, vier Hochformat-Videos (5 bis 8 s),
  rund 40 Bildschirmaufnahmen der App mit dem 3-D-Modell und zehn Lottie-Zeichen, von denen vier derzeit nirgends eingesetzt sind.

## 1. Technik-Stack und Randbedingungen

### 1.1 Auslieferung

| Baustein | Heute | Fundstelle |
|---|---|---|
| Plattform | ein Cloudflare Worker `fenstero`, Einstieg `worker.js` | `wrangler.jsonc:13–15` |
| Dateien | `web/` als statische Assets (Binding `ASSETS`) | `wrangler.jsonc:16–18` |
| Build | keiner; `web/` wird ausgeliefert, wie es liegt; kein `package.json` | `README.md:11` |
| Seiten durch den Worker | `/`, `/app/*`, `/ratgeber/*`, `/fuer-fensterbauer/*`, Rechtsseiten, `/config.js`, Marke, Fehlerseite u. a. (`run_worker_first`); Skripte, Bilder und Schriften kommen direkt | `wrangler.jsonc:24–25` |
| Umschreiben beim Ausliefern | Sicherheitskopfzeilen, Canonical (Kopfzeile und `<link>`), `og:url`, absolute Adressen in JSON-LD und `og:image`, Paket-Bausteine (`paketeSeite`), Banner zum Einführungspreis bzw. Preise nach dem Stichtag, ETag entfernt | `functions/seo.js:113–137`, `139–170`; `functions/pakete-seite.js:5–15` |
| Generierte Bereiche im statischen HTML | Paket-Bausteine zwischen `<!--pakete:NAME-->` (`node scripts/bedingungen-pdf.mjs`); Kopf, Fuß und Leseführung der Ratgeber und Seiten für Fensterbauer (`node scripts/ratgeber-bausteine.mjs`); die Prüfsuite verlangt, dass jede Seite genau so aussieht, wie die Skripte sie bauen | `functions/pakete-seite.js:5–10`; `scripts/ratgeber-bausteine.mjs:1–12`; `scripts/pruefen.mjs:1755–1769` |
| Startseite | Oberfläche im Browser: `portal.js` schreibt `#app` als HTML-Zeichenkette und baut bei Zustandswechseln neu; ohne JavaScript steht eine Textfassung (`.vorab`), die mit JavaScript verschwindet | `web/index.html:43–103`; `web/assets/gemeinsam.css:51`; `docs/GESTALTUNG.md:439` |
| Verkaufsseite | statisches HTML (`web/fuer-fensterbauer/index.html`, 61.433 B) plus `verkauf.js`; dieselbe Seite steht eingebettet auf der Startseite | `web/assets/portal.js:792–837` |
| Fremde Hosts | gehören zu Konfigurator-Instanzen der Betriebe und laufen über einen eigenen Weg | `worker.js:8–12`, `46–51` |
| Zwischenspeicher | Schriften ein Jahr `immutable`, `/bilder/*` einen Tag; `/assets/*` ohne eigene Regel und ohne Versionskennung in Dateiname oder Adresse | `web/_headers:14–15`, `34–36`; Verweise in `web/**/*.html` |
| Lokal | `scripts/dev-server.mjs` ahmt den Worker nach (Port 8788, Attrappen per Variable) | `scripts/dev-server.mjs:1–25` |

### 1.2 CSP und Kopfzeilen

Die Werte stehen gleichlautend in `web/_headers:5–12` und in `functions/seo.js:68–75`. Der Worker setzt sie selbst, weil Cloudflare
`_headers` auf Antworten des Workers nicht verlässlich anwendet (`functions/seo.js:65–67`). Die Prüfsuite vergleicht beide Stellen
(`web/_headers:4`).

| Direktive | Wert | Folge für eine Neugestaltung |
|---|---|---|
| `default-src` | `'self'` | Alles, was nicht eigens genannt ist, kommt nur von der eigenen Herkunft: Video und Audio, iframes und Worker |
| `script-src` | `'self'` | keine Inline-Skripte, keine `on…`-Attribute, kein `eval` oder `new Function` (deshalb `lottie_light` statt des vollen Spielers, `docs/GESTALTUNG.md:43`). WebAssembly ist gesperrt, weil `'wasm-unsafe-eval'` fehlt, ebenso Worker aus `blob:`. JSON-LD bleibt als Datenblock erlaubt |
| `style-src` | `'self' 'unsafe-inline'` | `style`-Attribute und `<style>` sind erlaubt; `verkauf.js` setzt CSS-Variablen auf diesem Weg |
| `img-src` | `'self' data: blob:` | nur eigene Bilder; `data:` und `blob:` (etwa ein Canvas-Export) sind erlaubt |
| `font-src` | `'self'` | nur `web/fonts/`, kein Google Fonts |
| `connect-src` | `'self'` | `fetch` nur gegen die eigene Herkunft (Lottie-JSON, Einbettung, `/api/`); kein Tracking-Dienst, kein CDN |
| `object-src`, `base-uri`, `form-action` | `'none'`, `'self'`, `'self'` | Formulare senden nur an eigene Endpunkte |
| `frame-ancestors` und `X-Frame-Options` | `'none'`, `DENY` | Keine Seite lässt sich einrahmen, auch nicht von der eigenen Herkunft. Die App (`/app/`) kann also nicht als Live-Demo per iframe in die Startseite |
| `Permissions-Policy` | Kamera nur eigene Herkunft; Mikrofon, Standort, Zahlung und USB gesperrt | Bewegungssensoren sind nicht eingeschränkt |
| übrige | HSTS ein Jahr, `nosniff`, `strict-origin-when-cross-origin` | – |
| `X-Robots-Tag` | in der Pilotphase `noindex, nofollow`; Freigabe über `INDEXIERUNG=1` | `functions/seo.js:3–7`, `78` |

Die Prüfsuite geht über die CSP hinaus. Sie zählt jede Anfrage, die nicht mit der Basisadresse, `data:` oder `blob:` beginnt, als
Fehler, dazu jede Antwort ab Status 400 und jeden Konsolenfehler (`scripts/pruefen.mjs:76–84`). Eine gelockerte CSP würde also an der
Suite scheitern.

### 1.3 Was erlaubt ist und was nicht

**Erlaubt oder vorgesehen**

- Stufe 1: CSS und schlankes JavaScript, animiert werden nur `transform` und `opacity` (`SKILL.md:55–59`).
- Stufe 2: Grafikchip (WebGL, 3-D, Shader), immer mit einfacher Ersatzfassung (`SKILL.md:57–59`). Vorgesehene Techniken sind eine
  vorgerenderte Bildfolge auf `<canvas>`, WebGL mit Tiefenkarte zum Foto und Staub auf Canvas mit höchstens 60 Teilchen
  (`designrichtung.md:152–168`).
- Bibliotheken nur lokal in `web/vendor/` mit Lizenzdatei (`SKILL.md:60`).
- Lottie mit `lottie_light` (SVG-Renderer, ohne Ausdrücke) (`docs/GESTALTUNG.md:43`; `designrichtung.md:149`).
- Glas mit `backdrop-filter` nur über Bildern oder 3-D-Szenen. Licht nur als radialer Verlauf mit einer Quelle im Bild, 8 bis 20 %
  Deckkraft, in Cream, Grün oder dem Blau der Zeichnungen. Schatten `--float` nur unter Schwebendem (`designrichtung.md:76–93`).
- Inline-SVG, `style`-Attribute, CSS-Variablen.

**Nicht erlaubt**

- Fremde Server jeder Art (`SKILL.md:60`; CSP; Prüfsuite).
- Inline-Skripte, `eval`, WebAssembly (CSP).
- Auf der Verkaufsseite Schriftgrößen außer 13, 15, 17, 24 und 40, am Telefon 32 statt 40 (`SKILL.md:69`;
  `docs/GESTALTUNG.md:449`).
- Neue Farben, Verläufe ohne Quelle, Glas ohne Bild dahinter, mehr als eine Lichtfarbe je Bildschirm
  (`designrichtung.md:78–79`, `195–196`).
- Gleichförmige Laufbänder, ein verändertes Scrolltempo, Blinken oder Springen (`designrichtung.md:198`; `SKILL.md:43–48`).
- Inhaltsverzeichnis und Lesezeit auf Verkaufsflächen (`SKILL.md:29–30`). Die Verkaufsseite steht dafür in
  `OHNE_INHALTSVERZEICHNIS`, die Prüfsuite verlangt das (`scripts/pruefen.mjs:1765`).
- Auf `/fuer-fensterbauer/` jedes `form`, `input`, `select`, `textarea` und `contenteditable` außer dem einen Anfrageformular
  (`docs/GESTALTUNG.md:434`; `scripts/pruefen.mjs:1789–1797`). Ein interaktiver Rechner oder ein eingebetteter Mini-Konfigurator mit
  Eingabefeldern bräuchte also eine Änderung an der Suite.
- Riesenschrift als echter Text. Sie ist nur als Grafik erlaubt, und vor dem ersten Einsatz braucht die Prüfsuite eine Ausnahme
  (`designrichtung.md:106–107`).

**Pflichten**

- Ruhige Fassung für jede Bewegung. Ohne JavaScript bleibt alles lesbar und bedienbar (`SKILL.md:62`).
- Schleifen laufen nur, solange ihr Element im Bild ist. Die Seite muss auf einem mittleren Android-Telefon flüssig laufen
  (`SKILL.md:61`).
- Jedes Element funktioniert auch eingebettet auf der Startseite und nach einem Neuaufbau (`SKILL.md:63–64`).
- Mobil zuerst: Hauptansicht ist 390 × 844, danach 1280 und 1024 (`SKILL.md:28`).
- Budget: höchstens 300 KB Bilder auf dem ersten Telefon-Bildschirm. WebGL und Bildfolgen laden erst, wenn der Abschnitt naht
  (`designrichtung.md:167–168`).

### 1.4 Ladegewicht heute (gemessen)

| Seite | Skripte | Stile | Weiteres |
|---|---|---|---|
| Startseite `/` | sofort 546.514 B (`einladung.js`, `config.js`, `gemeinsam.js`, `ral.js`, `modell.js`, `portal.js`), dazu mit `defer` 268.081 B (`lottie_light`, `blatt.js`, `verkauf.js`); `portal.js` allein 288.107 B, gepackt 88.797 B | 217.517 B (`fonts.css`, `gemeinsam`, `ratgeber`, `portal`, `einladung`, `verkauf`) | in der Ansicht Fensterbauer zusätzlich das HTML der Verkaufsseite (61.433 B) per `fetch`; Startfoto `start-hauseigentuemer.webp` 180.138 B |
| Verkaufsseite | 238.049 B, alle mit `defer` (`gemeinsam.js`, `lottie_light`, `verkauf.js`); `verkauf.js` gepackt 10.876 B | 107.244 B; `verkauf.css` gepackt 17.999 B | Startfoto `fb-sessel.webp` 82.850 B |
| App `/app/` (falls das Modell gebraucht wird) | 1.414.022 B; `app.js` 809.975 B (gepackt 252.142 B), `buehne.js` 110.398 B (gepackt 37.384 B) | `app.css` 146.285 B | – |
| gemeinsam | Lottie-Dateien zusammen 103.745 B, je Zeichen 4 bis 26 KB, einzeln bei Bedarf geholt | Inter: 48.256 B (latin, vorgeladen) und 85.068 B (latin-ext) | – |

Kritisch: Die Startseite lädt `modell.js` (160.298 B, Fenstermodell und Abrechnungsregeln) und `ral.js` synchron im Kopf
(`web/index.html:37–40`). Sichtbar braucht die Startseite davon nur die SVG-Zeichnung eines Fensters (`portal.js:861–864`). Die
Überschrift des Startbilds erscheint Wort für Wort aus der Deckkraft 0 (`portal.css:232–234`). Sie steht also erst, wenn `portal.js`
gelaufen ist.

### 1.5 Einbettung der Verkaufsseite in die Startseite

- `portal.js` holt `/fuer-fensterbauer/` einmal je Seitenaufruf, nimmt `main.rg` ohne Brotkrumen und setzt es in
  `section.vk-einbettung`. Danach ruft es `Verkauf.auf(behälter, { still })` auf. Fällt das Laden aus, steht eine Karte mit dem Link
  zur Seite (`portal.js:792–837`).
- Sprungmarken wie `#pakete` scrollen innerhalb der Ansicht, ohne den Anker `#fensterbauer` zu ändern. Den Abstand zur klebenden
  Kopfzeile misst das Skript (`portal.js:831–837`).
- `verkauf.css` gleicht die Einbettung an die Spalte und die Kopfzeile der Startseite an. Die Kopfzeile ist dort 60 px hoch, bis
  879 px Breite mit dem Umschalter etwa 122 px (`verkauf.css:636–658`).
- Folgen: Jedes Element der Verkaufsseite muss mit zwei Wurzeln laufen (`document` und Behälter) und Neuaufbauten überstehen. Alle
  Abfragen in `verkauf.js` beziehen sich darum auf die Wurzel, und Beobachter werden je Aufruf neu angelegt (`verkauf.js:1–7`,
  `467–471`). IDs müssen auf der Startseite eindeutig bleiben. In der Ansicht Fensterbauer stehen zwei Schriftskalen untereinander
  (2.2).

## 2. Designsystem heute

### 2.1 Tokens (`web/assets/gemeinsam.css:9–32`)

| Gruppe | Token und Wert | Rolle laut `docs/GESTALTUNG.md:24` |
|---|---|---|
| Grund | `--ground` `#161616` (alt `--paper`, `--bg`) | immer der Hintergrund |
| Flächen | `--surface` `#1f1f1f`, `--surface2` `#262626`, `--surface3` `#2e2e2e` | Karte mit 2-px-Rand; Fläche 2 und 3 für Chips, Segmente, Hover |
| Linien | `--line` `#2b2b2b`, `--line2` `#3a3a3a` | Ring der Karten, Hover und Lift |
| Schrift | `--text` `#f3f2ee`, `--text2` `#c9c8c3`, `--muted` `#93928d` | Überschriften und Namen; Lead und Erklärsätze; Labels und Nebenzeilen |
| Signal | `--accent` `#8fd694`, `--accent-soft` (14 %), `--on-accent` | Kicker, Haken, Fortschritt, genau ein Wort je Überschrift (`.ak`); nie Fließtext, nie Fläche hinter Text |
| Hauptaktion | `--cream` = `--primary` `#f1f0ea`, `--primary-hover` `#fff`, `--on-primary` `#161616` | eine Cream-Fläche je Bildschirm |
| Status | `--ok` `#8fd694`, `--warn` `#f0b35a`, `--bad` `#ff7b72`, je mit `-soft` | als Wort mit Punkt, nie als Fläche |
| Zeichnung | `--mo` `#ff8a5b` (Maueröffnung), `--el` `#7aa2ff` (Element), je mit `-soft` | nur in technischen Darstellungen |
| Tiefe | `--ring` (2-px-Rand), `--lift`, `--float` (Rand plus `0 24px 60px rgba(0,0,0,.6)`) | Schatten nur unter Schwebendem |
| Form | `--r1` 8, `--r2` 12, `--r3` 18, `--r4` 24, `--pill`; `--h1` 44, `--h2` 52 | Radien; Kontrollhöhen |
| Schrift | `--font` Inter mit Systemschriften als Ersatz | – |
| Bewegung | `--t1` 150 ms, `--t2` 220 ms, `--t3` 320 ms; `--e-out` `cubic-bezier(.2,.7,.2,1)`, `--e-io` `cubic-bezier(.45,0,.2,1)` | drei Dauern, zwei Kurven |

Es gibt nur eine Stimmung (`color-scheme: dark`). `prefers-color-scheme` und `data-theme` ändern nichts mehr (`gemeinsam.css:6–8`).
Die Designrichtung lässt die Tokens unverändert und verbietet neue Farben (`designrichtung.md:78–79`). Lottie-Dateien tragen
Markerfarben, die beim Laden gegen die Tokens getauscht werden (`gemeinsam.js:196`, `200–217`).

### 2.2 Schriftrollen

Die Schrift ist Inter, variabel von 100 bis 900, lokal ausgeliefert (`web/fonts/fonts.css:1–5`). Die Gewichte sind 500 für Text, 700
für Listen und Chips, 800 für Überschriften (`docs/GESTALTUNG.md:26`).

| Oberfläche | Rollen in px | Fundstelle | automatisch geprüft |
|---|---|---|---|
| Verkaufsseite, Ratgeber, Textfassung | 40 (Telefon 32) · 24 · 17 · 15 · 13 | `docs/GESTALTUNG.md:29`, `449`; `verkauf.css:1–3`, `503`, `512–515` | ja, bei 390 und 1280 (`scripts/pruefen.mjs:1600–1620`) |
| Startseite, Ansicht Hauseigentümer, sowie Kopf, Wechselkarte und Fuß der Startseite | Startbild-Überschrift `clamp(36px, 5vw, 44px)`, Abschnittskopf 22, Kennzahlen `clamp(26px, 3.4vw, 30px)`, Wechselkarte `clamp(26px, 3.4vw, 30px)`, „Auch ganz groß.“ `clamp(36px, 5vw, 44px)` | `portal.css:71`, `226`, `268`, `275`, `354` | keine Messung gefunden |
| App | 40 · 32 · 24 · 17 · 15 · 13 | `docs/GESTALTUNG.md:27` | ja |
| Betriebsbereich | 44 (36) · 30 (26) · 22 · 17 · 15 · 13 | `docs/GESTALTUNG.md:28` | teilweise |
| Zentrale | 30 (26) · 22 · 17 · 15 · 13 | `docs/GESTALTUNG.md:30` | ja (`scripts/pruefen.mjs:2454–2455`) |

Die Designrichtung fügt zwei Stimmen hinzu (`designrichtung.md:95–107`):

- Bühnenstimme: 800, −0,03 em, Zeilenabstand 1,05, am Telefon höchstens drei Zeilen, genau ein grünes Wort.
- Technikstimme: 13 px, 600, `tabular-nums`, Versalien mit 0,12 em Sperrung.

Umgesetzt ist das bisher nur auf der Verkaufsseite. Dort stehen Abschnittsnummer und Eyebrow mit 600 und 0,12 em
(`verkauf.css:501–505`), die gemeinsame `.eyebrow` steht dagegen auf 800 und 0,18 em (`gemeinsam.css:44`).

Befund: Die `clamp()`-Werte der Startseite ergeben zwischen den Eckbreiten Zwischengrößen (bei 800 px Breite etwa 40 px statt 44 oder
36). Auf der Startseite stehen damit zwei Skalen nebeneinander, in der Ansicht Fensterbauer sogar untereinander.

### 2.3 Form und Raum

- Radien 8, 12, 18 und 24 sowie Pillen. Knöpfe, Chips, Segmente und Badges sind Pillen (`docs/GESTALTUNG.md:32`).
- Kontrollhöhen 44 und 52, dazu 56 für große Knöpfe (`gemeinsam.css:56–63`). Zielflächen mindestens 44 px.
- Raster 4 px, Abstände 8, 12, 16, 20 und 24 (`docs/GESTALTUNG.md:32`).
- Abschnittsabstand der Verkaufsseite 96 px, ab 761 px Breite 128 px (`verkauf.css:501`, `512–513`). Das entspricht der Designrichtung
  (`designrichtung.md:118`).
- Spalten: Ratgeber 820 px (`ratgeber.css:8`), Verkaufsseite 1040 px (`verkauf.css:158`), Startseite `.wrap` 1040 px mit 20 px Rand,
  am Telefon 16 px (`verkauf.css:636–642`).
- Karten liegen mit 2-px-Ring auf dem Grund, Hervorhebung über einen Rand in Schriftfarbe (`docs/GESTALTUNG.md:98`).

### 2.4 Licht, Glas und Textur

Umgesetzt ist das bisher nur auf der Verkaufsseite.

- Glas: die Meldungen im Startbild, `#1f1f1f` zu 60 %, Weichzeichner 24 px, Sättigung 140 %, Lichtkante in Element-Blau zur
  Lichtquelle hin (`verkauf.css:199–203`). Chips über Fotos als Glas (`verkauf.css:520–526`).
- Licht mit Quelle: Erdlicht am Bullauge. Seine Lage wird aus Bildkoordinaten des Fotos berechnet (`verkauf.js:190–254`;
  `verkauf.css:220–221`).
- Weiteres Licht: ein Lichtschlitz mit Kegel in Leiste 1 (`verkauf.css:534–535`) und Studiolicht über der Geräte-Bühne
  (`verkauf.css:554–558`).
- Textur: ein Messraster `.vk-raster`, fein alle 8 px und kräftig alle 40 px (`verkauf.css:518`).
- Befund: Die empfohlene Paketkarte trägt oben einen grünen Schein ohne Lichtquelle im Bild (`verkauf.css:23`). Die Designrichtung
  erlaubt Licht aber nur mit Quelle (`designrichtung.md:85–87`).

### 2.5 Bewegungskatalog

Die Grundlage ist der Katalog aus `docs/GESTALTUNG.md:38–41` und `gemeinsam.css:171–204`. Für Verkaufsflächen kommen Werte aus
`designrichtung.md:130–150` hinzu.

| Nr. | Bewegung | Werte heute | Fundstelle |
|---|---|---|---|
| 1 | Erscheinen | App und Betrieb: 8 px aufwärts, 320 ms, je 50 ms gestaffelt. Verkaufsseite und Einbettung: 24 px und 0,98 → 1, 600 ms, je 70 ms gestaffelt | `gemeinsam.css:181–182`; `verkauf.css:506–507` |
| 2 | Wechsel | Bildschirme gleiten (App) bzw. blenden über (Betrieb) | `gemeinsam.css:173` |
| 3 | Bestätigen | Haken wird gezogen (`stroke-dashoffset`, 0,5 s) | `gemeinsam.css:190–191` |
| 4 | Fehler | Rütteln, 300 ms | `gemeinsam.css:199–200` |
| 5 | Fortschritt | Balken, Ringe und Zahlen laufen nach | `gemeinsam.css:176` |
| 6 | Einrasten | aus 1,06, 220 ms | `gemeinsam.css:188–189` |
| 7 | Öffnen und Schließen | Blatt steigt 320 ms auf | `gemeinsam.css:178` |
| 8 | Laden | ruhige Drehung | `gemeinsam.css:201` |
| 9 | Scrollgebunden | `Scroll.binden(el, fn, {von, bis, wurzel})` liefert 0…1 über `requestAnimationFrame` | `gemeinsam.js:296–324` |
| – | Rückmeldung am Objekt | `.fx-mark` (Ring läuft um das Neue), `.fx-puls` (Ring läuft aus) | `gemeinsam.css:183–187` |

Dauern der Designrichtung: 220 ms Rückmeldung, 320 ms Karten, 600 ms Auftritt, 900 ms großer Auftritt; drei Ebenen je Szene;
höchstens ein Drittel der Elemente bewegt sich gleichzeitig (`designrichtung.md:134–145`).

**Bewegung auf der Verkaufsseite heute**

| Art | Elemente | Fundstelle |
|---|---|---|
| scrollgebunden | Startbild-Tiefe (`--py`, Bild bis 120 px zurück, Meldungen 60 px vor); Bühne „So funktioniert es“ (aktiver Schritt nach Bildschirmmitte); Szene „Was in jeder Anfrage steht“; Zeitleiste des Ablaufs (Linie füllt sich, Symbole werden gezogen); Schub der Leisten (Faktor 0,42); Lesefortschritt als Maßstab unter der Kopfzeile | `verkauf.js:158–166`, `133–150`, `439–447`, `497–511`, `274–301`, `448–465`; `verkauf.css:188`, `614` |
| zeitgesteuert | Meldungsstapel alle 3,4 s; Staub (28 Teilchen, CSS); Maßlinie zeichnet sich in 1,4 s und zählt bis 1.200; Zahlenkacheln zählen 0,9 s hoch; Leisten laufen 30 px/s; Pakete laufen am Telefon einmal als Wisch-Hinweis | `verkauf.js:152–188`, `226–245`, `407–437`, `256–331`, `390–404` |
| Lottie | Schrittkarten am Telefon (`messen`, `senden`, `eingang`, `fertig`), Telefon-Bildschirme der Bühne (`fotos`, `messen`, `senden`), Tisch (`eingang`, `fertig`), Vorspann der Pakete (`farbwechsel`) | `web/fuer-fensterbauer/index.html:84–119`, `170–190` |

**Auf der Startseite** neigt sich die Fensterzeichnung beim Scrollen um ±7° (`portal.js:569`; `portal.css:256`). Kennzahlen zählen
hoch (`portal.js:578–583`), das Startfoto zoomt beim Laden, und Überschrift, Lead und Knöpfe blenden gestaffelt auf
(`portal.css:232–250`).

**Ruhige Fassung:** `gemeinsam.css:206–211`, `verkauf.css:617–632`, `portal.css:702–707`. Jedes Skript fragt dazu `ruhig()` ab.
`Scroll.binden` ruft bei „weniger Bewegung“ einmal `fn(0.5)` auf, also den Mittelstand (`gemeinsam.js:318–320`). Die Designrichtung
verlangt das Endbild (`designrichtung.md:150`). `verkauf.js` setzt dafür eigens den Endstand (`verkauf.js:497–504`).

**Lottie-Zeichen** (`docs/GESTALTUNG.md:43–58`; Dateien in `web/assets/lottie/`):

| Zeichen | Dauer | Eingesetzt heute |
|---|---|---|
| `messen` | 3,8 s, Schleife | App (Glossar), Betrieb, Verkaufsseite (Schritte, Telefon) |
| `fotos` | 2,8 s, Schleife | App, Verkaufsseite (Telefon) |
| `senden` | 1,9 s | App, Verkaufsseite |
| `eingang` | 4,4 s, Schleife | Betrieb, Verkaufsseite |
| `fertig` | 1,3 s | App, Betrieb, Kundenkonto, Verkaufsseite |
| `farbwechsel` | 6 s, Schleife | Verkaufsseite, Vorspann der Pakete |
| `marke`, `domain`, `dashboard` | 2,8 bis 3,0 s | nirgends (Suche über `web/` und `functions/`); `docs/GESTALTUNG.md:52–54` nennt Plätze auf der Verkaufsseite, die es im HTML nicht mehr gibt |
| `konfigurator` | 10 s, Schleife, 480 × 300 | nirgends (`docs/GESTALTUNG.md:55`: „derzeit ohne Platz“) |

Regel: Ein Bewegtbild erklärt oder bestätigt etwas an genau dieser Stelle. Nie stehen zwei auf einem Bildschirm, nie eines neben dem
3-D-Modell (`docs/GESTALTUNG.md:58`).

### 2.6 Bausteine der Designrichtung und ihr Stand im Code

Die Bausteine stehen in `designrichtung.md:170–191`.

| Nr. | Baustein | Umsetzung heute | Fundstelle | Stand |
|---|---|---|---|---|
| 1 | Glas-Nachricht | Meldungsstapel im Startbild der Verkaufsseite, drei Karten, eine neue fällt alle 3,4 s ein | `web/fuer-fensterbauer/index.html:55–64`; `verkauf.css:196–216`; `verkauf.js:152–188` | umgesetzt, eine Stelle |
| 2 | Medienkarte | echtes Aufmaßblatt im Rahmen, gedreht, mit Dateiname | `verkauf.css:567–569`; `index.html:133` | umgesetzt, eine Stelle |
| 3 | Zahlenkachel | „Warum Kunden selbst planen“: Zahl, Einheit, Ring beim Anteil | `verkauf.css:585–598`; `index.html:151–153` | umgesetzt |
| 4 | Maßlinie | Maßlinie am Bullauge im Startfoto | `verkauf.css:226–233`; `verkauf.js:190–254` | umgesetzt, eine Stelle |
| 5 | Messraster | `.vk-raster` und das Raster unter der Geräte-Bühne | `verkauf.css:517–518`, `554–558` | umgesetzt |
| 6 | Explosionsansicht | – | – | fehlt |
| 7 | Kapitelanzeige | Abschnittsnummern 01 bis 11 mit Haarlinie, Lesefortschritt als Maßstab im Kopf, Ablauf-Linie als Maßstab | `verkauf.css:501–502`, `608–614` | teilweise: keine Anzeige „01 / 04“ mit Kapitelfortschritt |
| 8 | Geräte-Bühne | Telefonrahmen mit HTML-Miniaturen und Schreibtischkarte im Studiolicht | `verkauf.css:313–360`, `550–561` | teilweise: kein Browserfenster mit echten Bildschirmen |
| 9 | Leiste | Leiste 1 gewölbt mit Lichtkegel, Leiste 2 als Cream-Band mit Kennzahlen | `verkauf.css:260–312`, `527–542`; `verkauf.js:256–331` | teilweise: 24-px-Zeichnungen statt echter Bilder, Grundlauf gleichmäßig 30 px/s |
| 10 | Riesenwort | – | – | fehlt; die Ausnahme in der Prüfsuite fehlt ebenfalls |

## 3. Komponentenkatalog

Die Einstufung „wiederverwendbar“ hat drei Werte. „ja“ heißt: technisch und gestalterisch ohne Umbau nutzbar. „teilweise“ heißt:
Mechanik oder Daten sind nutzbar, das Aussehen widerspricht der Designrichtung oder hängt an einer Stelle. „nein“ heißt: gehört zu
App, Betrieb oder Recht, oder steht im Widerspruch zu den Anforderungen.

### 3.1 Gemeinsame Grundlagen (`gemeinsam.css`, `gemeinsam.js`)

| Name | Datei | Zweck | Wiederverwendbar |
|---|---|---|---|
| Tokens | `gemeinsam.css:9–32` | Farben, Formen, Höhen, Schrift, Bewegung | ja |
| Knopf `.btn` (primary, ghost, soft, small, big, `.pf` Pfeil im Kreis) | `gemeinsam.css:56–76` | Haupt- und Nebenaktion, Cream-Pille | ja |
| Chips `.chip`, `.chip.haken`, `.chip.weg` | `gemeinsam.css:85–98` | Aufzählung mit Haken, Auswahl | ja |
| Badge `.badge` | `gemeinsam.css:99–105` | Status als Wort mit Punkt | ja |
| Eyebrow und Kicker `.eyebrow`, `.kicker`, `.ak`, `.num` | `gemeinsam.css:44–48` | Kicker, grünes Wort, gleich breite Ziffern | ja (Technikstimme überschreibt Gewicht und Sperrung) |
| Fotokarte `.foto-karte` | `gemeinsam.css:107–115` | Foto in Karte mit Haken-Chips | teilweise (Karte mit Rand statt Glas und Anschnitt) |
| Banner `.einf-bar` / `EinfBanner` | `gemeinsam.css:125–133`; `gemeinsam.js:326–342`; `functions/seo.js:157–170` | Einführungspreis mit Restzeit | teilweise: endet am Stichtag, auf `/fuer-fensterbauer/` ausdrücklich nicht (`functions/seo.js:163–166`) |
| Pilot-Hinweis `.fx-pilot` | `gemeinsam.css:134–143`; `gemeinsam.js:344–356` | Hinweis auf die Pilotphase | teilweise |
| Logo und Marke `Logo.svg()`, `Marke.wort()`, `Marke.klein()` | `gemeinsam.js:121–151`; `gemeinsam.css:159–169` | Zeichen mit Lichtanimation (1,6 s), Wortmarke | ja |
| Reveal `Reveal.auf()` | `gemeinsam.js:175–188` | Erscheinen beim Scrollen | ja |
| Scroll `Scroll.binden()` | `gemeinsam.js:296–324` | Fortschritt 0…1 je Element | ja (ruhige Fassung liefert 0,5, siehe 2.5) |
| Lottie `Lottie.auf()`, `Lottie.spielen()` | `gemeinsam.js:190–260` | Zeichen in Tokenfarben, nur im Bild, Standbild davor | ja |
| Haptik `Haptik.tick()`, `ok()`, `fehler()` | `gemeinsam.js:262–294` | Tippen am Telefon nach Berührung | teilweise (auf der Verkaufsseite heute nicht genutzt) |
| Feier `Feier.markieren()`, `puls()`, `haken()`, `einrasten()` | `gemeinsam.js:153–173` | Rückmeldung am Objekt | teilweise |
| Dialog `.fx-dialog`, Schalter `.switch`, Segmente `.seg`, `KI`, `Farbtext` | `gemeinsam.css:80–84`, `117–122`, `145–157`; `gemeinsam.js:22–119`, `374–415` | Bedienelemente und Logik der App | nein (für die Website) |

### 3.2 Startseite (`portal.js`, `portal.css`)

| Name | Datei | Zweck | Wiederverwendbar |
|---|---|---|---|
| Kopfzeile mit Umschalter „Hauseigentümer · Fensterbauer“ und `kopfCta` | `portal.js:445`, `551–562`; `docs/GESTALTUNG.md:190–193` | Zielgruppe wählen; Kopf-Pille tritt zurück, solange eine Cream-Pille der Seite im Bild ist | teilweise (Logik und Prüfsuite hängen daran) |
| Startbild `.hero.b2c` mit `heroFoto` | `portal.js:777–778`, `852–853`; `portal.css:226–252`, `534–537` | Foto randlos, in den Grund ausgeblendet, Haken-Chips; Wort-für-Wort-Auftritt | teilweise |
| Kennzahlenstreifen `.strip` | `portal.js:854`; `portal.css:264–268` | drei Zahlen, zählen hoch | teilweise (Kartenreihe, `clamp`-Größen) |
| „Was im Aufmaß steckt“ `.caps` und Fensterkarte `.b2c-win` | `portal.js:779–781`, `861–864`; `portal.css:255–282` | Strichsymbole mit Text und SVG-Fenster mit vier Maßen, neigt sich ±7° | teilweise: die Zeichnung aus `AW.svg` ist echtes Material; Strichsymbole als Hauptträger widersprechen `designrichtung.md:127` |
| „Auch ganz groß.“ `.gross` | `portal.js:783–785`; `portal.css:273–278` | Elementarten als Chips mit Fotokarte | nein in dieser Form (Foto ist Platzhalter, siehe 4.1) |
| Ratgeber-Karten `a.tcard` | `portal.js:786`; `portal.css:341–357` | neun Links in den Ratgeber | teilweise |
| Wechselkarte `.owner.wechsel` | `portal.js:787–791` | Weg in die andere Zielgruppe | teilweise (Prüfsuite verlangt sie) |
| Einbettung `.vk-einbettung` und Rückfall | `portal.js:792–837`; `verkauf.css:636–658` | Verkaufsseite auf der Startseite | ja (Mechanik) |
| Fußzeile `footer()` | `portal.js:477–482` | Links, „Vertrag widerrufen“ | teilweise |
| Textfassung `.vorab` | `web/index.html:43–99` | Startseite ohne JavaScript für Suchmaschinen und KI-Assistenten | ja (Pflicht, siehe 5.3) |

### 3.3 Verkaufsseite (`web/fuer-fensterbauer/index.html`, `verkauf.css`, `verkauf.js`)

| Name | Datei | Zweck | Wiederverwendbar |
|---|---|---|---|
| Kopf `.rg-kopf` mit Lesefortschritt | `index.html:48–51`; `ratgeber.css:7–12`; `verkauf.css:614`; `verkauf.js:448–465` | klebender Kopf, Maßstab füllt sich grün | teilweise (generiert, siehe 1.1; widerspricht `GESTALTUNG.md:41`) |
| Startbild `.vk-hero` mit Foto, Tiefe, Licht, Staub, Maßlinie und Meldungsstapel | `index.html:54–65`; `verkauf.css:168–258`; `verkauf.js:152–254` | Held mit Glas-Nachrichten | ja (stärkstes vorhandenes Element im Sinn der Designrichtung) |
| Leisten `.vk-leiste-a` und `.vk-leiste-b` | `index.html:66–72`; `verkauf.css:260–312`, `527–542`; `verkauf.js:256–331` | Elemente des Konfigurators; Kennzahlen | teilweise: Mechanik gut, Inhalt laut `GESTALTUNG.md:451` vorläufig |
| Abschnittsnummer und Haarlinie | `verkauf.css:500–502` | Kapitelzählung in der Technikstimme | ja |
| Kacheln „Die Idee“ `.vk-punkte` | `index.html:73–83`; `verkauf.css:308–311`, `544–548` | vier Kacheln mit Nummer | teilweise |
| Scroll-Bühne „So funktioniert es“ `.vk-buehne`, `.vk-telefon`, `.vk-tisch` | `index.html:84–119`; `verkauf.css:313–407`; `verkauf.js:110–150` | Schritt links, Telefon rechts zeigt ihn | ja (Mechanik); Miniaturen in HTML teilweise |
| Szene „Was in jeder Anfrage steht“ `.vk-anfrage`, `.vk-szene`, `.vk-mk`, `.vk-blatt`, `.vk-klaerung` | `index.html:120–146`; `verkauf.css:408–437`, `563–575` | echtes Aufmaßblatt mit Karten, die gegeneinander laufen | ja |
| Zahlenkacheln `.vk-gruende`, `.vk-zahl` | `index.html:147–157`; `verkauf.css:585–598`; `verkauf.js:407–437` | belegte Zahl als Held | ja |
| Bildband `.vk-band` mit Fotokarte | `index.html:147–169`; `verkauf.css:438–456` | Text neben Foto | teilweise |
| Kundenschutz `.vk-zusagen` | `index.html:158–169`; `verkauf.css:602–606` | vier Zusagen mit Haken | teilweise (Inhalt Pflicht, siehe 5.3) |
| Pakete: Vorspann, Karten `.vk-paket`, „Empfohlen“, Beispielseite `.vk-beispiel`, Wischreihe und `.vk-pakete-nav` | `index.html:170–190`; `verkauf.css:14–118`; `verkauf.js:333–405` | Kaufentscheidung, am Telefon zum Wischen | ja (Karten aus Bausteinen, Preise nur aus `pakete.js`) |
| Vergleich `details.vk-vergleich-auf` mit `table.rg-tab.vk-vergleich` | `index.html` (Baustein `vergleich`) | alle Merkmale | ja (Pflicht) |
| Zeitleiste `ol.rg-schritte.vk-ablauf` | `index.html:191–205`; `verkauf.css:457–480`, `608–613`; `verkauf.js:497–511` | sechs Schritte bis zum Livegang, scrollgebunden | ja |
| Demos | `index.html:206–213` (Baustein `demos`) | Links auf Demo-Instanzen bzw. die App | teilweise |
| Bestellen und Anfrageformular `.vk-bestellen`, `.vk-form`, `.vk-hinweis`, `.vk-bald` | `index.html:214–233`; `verkauf.css:10–12`, `120–148`; `verkauf.js:18–92` | Frage ohne Neuladen, auch ohne JavaScript | ja (Pflicht) |
| Häufige Fragen `details.rg-frage` | `index.html:234–247` | FAQ, wortgleich im JSON-LD | ja (Pflicht) |
| Wissen-Karten `.rg-karte`, Quellen | `index.html:248–268` | Links auf Fachseiten, Belege | teilweise |
| Messraster `.vk-raster` | `verkauf.css:518` | Textur | ja |

### 3.4 Lesetext-Bausteine (`ratgeber.css`)

Die Bausteine sind `.rg-kurz`, `.rg-karte`, `.rg-schritte`, `.rg-tab` (am Telefon als Karten mit `data-k`), `.rg-frage`, `.rg-bild`,
`.rg-pfad`, `.rg-inhalt`, `.rg-weg`, `.rg-weiter`, `.rg-fuss`, `.rg-quellen` und `.rg-stand` (`docs/GESTALTUNG.md:424–439`). Sie sind
für Ratgeberseiten wiederverwendbar. Auf Verkaufsflächen passen sie nur teilweise: `.rg-inhalt` ist dort verboten, und Tabellen und
Absätze widersprechen „Bild statt Text“ (`SKILL.md:29–30`).

### 3.5 App, Daten und Material-Erzeuger

| Name | Datei | Zweck | Wiederverwendbar |
|---|---|---|---|
| Fensterzeichnung `AW.svg(w, size)` | `modell.js:958–995` | SVG eines beliebig konfigurierten Fensters (Form, Teilung, Farbe, Rollladen) | ja; als Bibliothek aber schwer (`modell.js` 160 KB mit Abrechnungsregeln) |
| 3-D-Modell der App `w3dHTML`, `w3dLayout`, `w3dPaint`, `w3dCalc` | `app.js:900–2000` | Beschreibung des Modells als DOM-Flächen, CSS-Rückfall | teilweise (nur über vorgerenderte Bilder oder Herauslösen, siehe 6.1) |
| WebGL-Bühne `Buehne3D` | `buehne.js` (1.301 Zeilen) | zeichnet das Modell mit Tiefenpuffer, Licht, Schatten und Materialien | teilweise (siehe 6.1) |
| Paketdaten `Pakete` | `pakete.js:1–40` | einzige Quelle für Merkmale, Preise und Fristen je Paket | ja (Pflicht: Preise nur von hier) |
| Instanzregeln | `instanzregeln.js` | Statusleiste, Fristen, Verkaufsstand | teilweise (Texte des Ablaufs) |
| RAL-Daten | `ral.js` | 216 RAL-Töne, Holzdekore | teilweise (Farbwechsel-Szenen) |
| Aufmaßblatt-PDF `Blatt` | `blatt.js`; `scripts/tour-bild.mjs` | echtes PDF; Bild des Blatts für die Tour | ja als Materialquelle |
| Einladungsseite und Instanz-Start | `einladung.js`, `einladung.css` | Auftritt eines Betriebs | teilweise (Vorlage für echte Beispielseiten in Paketkarten) |
| Kundenkonto, Zentrale, Rechtsseiten | `partner.*`, `zentrale.*`, `recht.css` | Arbeitswerkzeuge und Recht | nein |

## 4. Asset-Katalog

### 4.1 Fotos (`web/bilder/foto/`, WebP)

Platzhalter sind dunkle Flächen mit Fensterumriss und Lichtfeld, ohne Text, erzeugt von `scripts/fotos.py`. Sie wiegen rund 3,5 KB.

| Datei | Inhalt | Pixel | Größe | Einsatz heute | Geeignet für |
|---|---|---|---|---|---|
| `fb-sessel.webp` | Astronaut in einer Raumstation am Bullauge, misst mit gelbem Zollstock; Papierflieger, Handy und Bleistift schweben; draußen die Erde; links dunkle Wand | 1122 × 1402 | 82.850 B | Startbild der Verkaufsseite | Held mit Licht aus dem Bullauge; Glas-Nachrichten links |
| `fuer-fensterbauer.webp` | derselbe Astronaut wie `fb-sessel` (Sichtprüfung), anderes Format | 1200 × 1500 | 95.172 B | nicht eingebaut | Reserve |
| `fb-kunden-planen.webp` | Vater und Tochter halten abends das Handy zum Fenster; auf der Fensterbank steht ein winziger Fensterbauer mit Zollstock | 1200 × 1500 | 93.480 B | Verkaufsseite, „Warum Kunden selbst planen“ | Bildband, Szene „Kunde plant selbst“ |
| `start-hauseigentuemer.webp` | Waschbär auf einem Tritt, misst mit dem Zollstock an einer Maueröffnung im Rohbau, Handy in der Pfote | 1250 × 1250 | 180.138 B | Startseite, Ansicht Hauseigentümer | Held der Hauseigentümer |
| `app-start.webp` | drei Waschbären im Wohnzimmer (Handy, Sofa) | 1120 × 1400 | 178.488 B | App-Start, Einladung, zwei Ratgeber | Figurenwelt |
| `start-fensterbauer.webp` | Bär in einer Werkstatt mit Tablet, Fensterrahmen im Hintergrund | 1120 × 1400 | 215.490 B | nirgends (Suche über `web/`, `functions/`, `scripts/`) | Figurenwelt Betrieb |
| `gross.webp` | Platzhalter | 1200 × 1500 | 3.950 B | Startseite „Auch ganz groß.“; das `alt` beschreibt einen Oktopus (`portal.js:785`) | – |
| `fb-kundenschutz.webp` | Platzhalter | 1600 × 1000 | 3.494 B | Verkaufsseite, Kundenschutz; das `alt` beschreibt Meister, Familie und Wölfe | – |
| `fb-frage.webp` | Platzhalter | 1600 × 1000 | 3.494 B | Verkaufsseite, Bestellen; das `alt` beschreibt ein springendes Telefon | – |
| `ratgeber.webp`, `weg-*.webp` (6), `fehler.webp` | Platzhalter | 1600 × 1000 | je 3.494 B | Ratgeber, Fehlerseite | – |

Prompts und Plätze stehen in `docs/BILDER.md`. Dort sind weitere Plätze ohne Datei geplant: `fb-anfrage`, `fb-pakete`, `fb-ablauf`,
`partner-*` und `instanz-danke` (`docs/BILDER.md:90–112`). Einen Ordner `web/fuer-fensterbauer/bilder/` gibt es nicht. Die
Verkaufsseite holt ihre Bilder aus `web/bilder/foto/` und `web/bilder/`.

### 4.2 Zeichnungen, Aufmaßblatt, Marke

| Datei oder Ordner | Inhalt | Format | Größe | Geeignet für |
|---|---|---|---|---|
| `web/bilder/*.svg` (25 Dateien) | Zeichnungen der Ratgeber: weiße Fläche, Maueröffnung Orange, Element Blau | SVG | 1,6 bis 5,1 KB | Ratgeber; technische Szenen mit Bedeutungsfarben |
| `web/bilder/tour-aufmassblatt-{10,15,20}.webp` | erste Seite eines echten Aufmaßblatts mit Beispieldaten („Fensterbau Brandt“, „Familie Weber“, Kennung „P-BEISPIEL“), je Abzug 10, 15 oder 20 mm; Stand-Fingerabdruck in `tour-aufmassblatt.json` | WebP 920 × 872 | je rund 50 KB | Medienkarte, Beweis „was ankommt“; nur als Beispiel gekennzeichnet zeigen |
| `web/og.png` | Vorschaubild beim Teilen | PNG 1200 × 630 | 30.615 B | Teilen |
| `web/favicon.svg`, `web/apple-touch-icon.png` | Zeichen | SVG; PNG 180 × 180 | 580 B; 1.915 B | Marke |
| Logo-Quelle | `scripts/logo-setzen.py`, `scripts/marke-bilder.mjs` | – | – | Zeichen in jeder Größe |

### 4.3 Bewegtbilder, Schrift, Bibliotheken

| Datei oder Ordner | Inhalt | Format | Größe | Geeignet für |
|---|---|---|---|---|
| `web/assets/lottie/*.json` (10) | `messen`, `fotos`, `senden`, `eingang`, `fertig`, `marke`, `domain`, `dashboard`, `konfigurator`, `farbwechsel`; aus Code erzeugt (`scripts/lottie-erzeugen.py`) | Bodymovin 5.7.4, nur Formen | 4.446 bis 26.217 B | kleine Erklär- und Bestätigungsmomente; `marke`, `domain`, `dashboard` und `konfigurator` sind ungenutzt und sofort einsetzbar |
| `web/fonts/` | Inter variabel 100 bis 900, latin und latin-ext, `OFL.txt` | WOFF2 | 48.256 B und 85.068 B | alle Flächen |
| `web/vendor/lottie_light.min.js` | Lottie-Spieler 5.12.2, SVG, ohne `eval` | JS, MIT | 168.236 B | Lottie |
| `web/vendor/jspdf.umd.min.js`, `qrcode.js` | PDF und QR-Code, nachgeladen von `blatt.js` | JS, mit Lizenz | 364.463 B; 56.694 B | Aufmaßblatt (nicht für Verkaufsflächen) |

### 4.4 Marketing-Material (`marketing/highlights/`)

| Datei oder Ordner | Inhalt | Format | Größe | Geeignet für |
|---|---|---|---|---|
| `bilder/bar-werkstatt.webp`, `waschbaer-tritt.webp`, `waschbaeren-sofa.webp` | dieselben Motive wie `start-fensterbauer`, `start-hauseigentuemer` und `app-start` (gleiche Byte-Größe und Pixelmaße) | WebP | 178 bis 215 KB | – (Duplikate) |
| `bilder/h03-foto.png` | Bär in der Werkstatt mit Tablet, Hochformat | PNG 1088 × 1920 | 3.145.175 B | Quelle für ein Hochformat-Startbild am Telefon (nach Umwandlung) |
| `videos/h03.mp4`, `h14.mp4`, `h19.mp4` | Bär in der Werkstatt, am Tisch mit Plan und Tablet, am Transporter (Standbild bei 3 s geprüft) | H.264 1088 × 1920, 24 fps, mit AAC-Ton, 5 bis 8 s | 9 bis 18,6 MB | Hochformat-Bewegtbild am Telefon; nur stark komprimiert, als Schleife ohne Ton, und mit Rücksicht auf das 300-KB-Budget des ersten Bildschirms |
| `videos/h07.mp4` | Waschbär in Nahaufnahme hält das Handy an den Zollstock | wie oben, 5 s | 13,4 MB | wie oben |
| `export/*/` | fertige Story-Bildschirme 1080 × 1920 (PNG) und komprimierte Videos | PNG, MP4 | MP4 2,5 bis 11 MB | Instagram; für die Website nur als Bildquelle |
| `aufnahmen/h09-*`, `h11-*`, `h12-*`, `h13-*` | Bildschirmaufnahmen des 3-D-Modells: Maße am Fenster, je Elementart (Fenster, Balkon, Festverglasung, Faltschiebewand, Hebe-Schiebe, PSK), je Form (Rundbogen, Segment, schräg, rund, Stulp, Ober- und Unterlicht), Farben, Sonnenschutz, Insektenschutz, Sprossen, Fensterbank; Modell auf heller Wand; Stand 21.10.2026 | PNG, etwa 1074 × 650 bis 921 | 23 bis 451 KB | echtes Material aus dem eigenen Konfigurator (Leiste mit echten Bildern, Kacheln, Kartenreihen); vor Einsatz gegen den heutigen Stand der Bühne neu aufnehmen |
| `aufnahmen/h04-*`, `h05`, `h06`, `h15`–`h18`, `h20` | Bildschirme des Betriebsbereichs und das Aufmaßblatt mit Beispieldaten | PNG, PDF | 12 bis 300 KB | Geräte-Bühne; nur als Beispiel gekennzeichnet zeigen |
| `screens/`, `vorlage/` | HTML-Vorlagen der Story-Bildschirme mit `vorlage.css` | HTML, CSS | – | Werkzeug, nicht für die Website |

### 4.5 Werkzeuge, die Material erzeugen

- `scripts/fotos.py`: Rohbilder werden zu WebP in Zielgröße, dazu Platzhalter (`docs/BILDER.md:9–20`).
- `scripts/tour-bild.mjs`: Bild des Aufmaßblatts.
- `scripts/lottie-erzeugen.py`: Lottie aus Code.
- `scripts/marke-bilder.mjs`: Apple-Icon, Vorschaubild, Bild für E-Mails.
- `marketing/highlights/render.mjs` und `video.mjs`: Story-Bildschirme und Videos.
- Playwright und Chromium liegen bereit, siehe `SKILL.md:101–116`. Dazu kommt `?gl=voll`, das die WebGL-Bühne auch ohne
  Grafikchip erzwingt (`buehne.js:261`).

## 5. Regeln der Prüfsuite, die eine Neugestaltung treffen würde

Aufruf: `NUR=… PW_PFAD=/opt/node-tools node scripts/pruefen.mjs` (`SKILL.md:114`). Die Abschnitte 23 bis 30 stehen in
`scripts/pruefen-instanzen/`.

### 5.1 Welche Abschnitte welche Seite prüfen

| Abschnitt | Startseite | Verkaufsseite |
|---|---|---|
| 1 Seiten laden (`scripts/pruefen.mjs:119–139`) | Status, Titel, kein alter Name, Marke klein mit `.wm`, Logo mit `.fi-kachel` und `.fi-strahl`, keine Fehler, keine CSP-Verstöße, keine fremden Server, Inter lokal | – |
| 2 Portal (`142–217`) | Pilot-Hinweis, Banner zum Einführungspreis, beide Ansichten, Anker, Einbettung, Rückfall bei Störung, Telefon ohne Querscrollen, Kopf am Telefon | Einbettung: drei Paketkarten, Formular, Ablauf, Sprung zu `#pakete` unter die Kopfzeile |
| 6 Logik (`601–613`) | Inhalte beider Ansichten, kein Marktplatz | Kundenschutz in der Einbettung mit vier Zusagen |
| 9 Führung (`1421–1432`) | „Führung starten“, keine Demo-Konten | – |
| 10 Auffindbarkeit (`1551–1810`) | Textfassung ohne JavaScript, Fußlinks, Einführungspreis im Rohtext | Kopf und Beschreibung, JSON-LD, Schriftgrößen, Ziele, Marke, Querscrollen, kein Band, kein ETag, Stand, FAQ, keine Eingaben, Kopf und Fuß aus dem Generator |
| 14 Fortsetzen (`2675–2678`) | „Aufmaß fortsetzen“ bei angefangenem Aufmaß | – |
| 29 Verkaufsseite (`scripts/pruefen-instanzen/29.mjs`) | – | Preise, Vergleich, JSON-LD, Formular mit und ohne JavaScript, Kopf, Abschnitts-IDs, FAQ |
| 30 Ende zu Ende (`30.mjs:111–118`, `30-welle3.mjs:34–45`, `230–238`) | Wechselkarte zu den Paketen, Einbettung mit drei Karten und einem h1 | „Vorläufige Preise“, „Bestellung bald möglich“, kein Weg in die Kasse ohne `PAKETE_OFFEN`, Bestellweg mit `PAKETE_OFFEN` |

### 5.2 Harte Regeln

1. **Schriftgrößen der Verkaufsseite:** am Telefon (390 × 844) nur 13, 15, 17, 24 und 32 px, am Schreibtisch (1280 × 860) nur 13, 15,
   17, 24 und 40 px. Gemessen wird jeder Textknoten im `body`, auch ausgeblendete, `aria-hidden`-Klone und Text in Inline-SVG
   (`scripts/pruefen.mjs:1606–1616`). Auf der Verkaufsseite gibt es keine globale Regel `button { font-size: inherit }`, deshalb erbt
   ein neuer `<button>` ohne eigene Größe 13,33 px und fällt durch (`SKILL.md:69`; `gemeinsam.css:36`). Die Prüfung misst die
   berechnete Größe. Per `transform` verkleinerte Miniaturen fallen ihr nicht auf, obwohl sie sichtbar unter 13 px liegen.
2. **Zielflächen ab 44 px:** `.rg-kopf a`, `.rg-fuss a`, `.rg-cta a`, `.rg-karte`, `.rg-frage summary` (`1610`). Dazu kommen
   `.vk-paket .btn`, `.rg-cta .btn` und `.vk-form .btn` (`29.mjs:94`).
3. **Kein Querscrollen** bei 390 und 1280, auf Startseite und Verkaufsseite (`pruefen.mjs:211`, `1613`; `29.mjs:82`).
4. **Marke:** Kein „EEZI“ in Versalien, außer in den Paketnamen „EEZI Essential“, „EEZI Signature“ und im zitierten „Powered by
   EEZIframes“. Kein alter Name. `.rg-kopf .wm` muss vorhanden sein (`pruefen.mjs:1611–1613`, `130–131`).
5. **Fremde Anfragen, Antworten ab 400 und Konsolenfehler** gelten auf jeder geprüften Seite als Fehler (`pruefen.mjs:76–85`). Eine
   noch fehlende Lottie-Datei wird deshalb mit `data-lottie-bald` statt `data-lottie` eingebaut (`verkauf.js:106–107`).
6. **Ohne JavaScript:** Startseite und App zeigen eine Textfassung mit h1, ohne Querscrollen (`pruefen.mjs:1576–1577`, `1598–1600`). Auf der
   Verkaufsseite sind die Preise sichtbar, und das Formular sendet als gewöhnliches Formular (`29.mjs:99–105`).
7. **Je Seite der Sitemap** genau ein h1. Der Titel enthält „eeziframes“ und hat höchstens 75 Zeichen, die Beschreibung 70 bis 170
   Zeichen. JSON-LD mit `@context` schema.org und absoluten Adressen, `og:image`. Alle internen Links antworten mit 200
   (`pruefen.mjs:1561–1574`).
8. **Keine Eingaben auf `/fuer-fensterbauer/`** außer `<form class="vk-form" method="post" action="/api/partner/frage" data-vk-frage>`
   (`pruefen.mjs:1789–1797`).
9. **Generierte Bereiche:** Kopf, Fuß und Leseführung müssen dem Ergebnis von `scripts/ratgeber-bausteine.mjs` entsprechen, die
   Verkaufsseite ohne „Auf dieser Seite“ (`pruefen.mjs:1755–1769`). Die Paket-Bausteine müssen dem Ergebnis von `bedingungen-pdf.mjs`
   entsprechen (`29.mjs`, 29.1).
10. **Häufige Fragen:** Jede Frage im JSON-LD steht wortgleich als `<summary>…</summary><div>…</div></details>` auf der Seite
    (`pruefen.mjs:1738–1748`). Die Verkaufsseite braucht mindestens sechs Fragen zu Domain, Kündigung, Datenschutz, Kunde und Website
    (`29.mjs:116–117`).
11. **Einführungspreis:** Die Verkaufsseite hat kein Band, kein ETag und im Rohtext weder „Einführungspreis“ noch `class="einf"`. Die
    Startseite trägt im Rohtext den Hinweis mit `class="einf"` (`pruefen.mjs:1707–1724`).

### 5.3 Feste Erwartungen an Inhalt und Selektoren

| Seite | Erwartung | Fundstelle |
|---|---|---|
| Startseite | Umschalter `.top .ansicht` mit zwei Knöpfen; am Telefon eine eigene Zeile, mindestens 340 px breit, Kopf höchstens 124 px | `pruefen.mjs:163–168`, `211–213` |
| Startseite | `.fx-pilot` sichtbar und schließbar; `.einf-bar` mit „Einführungspreis bis 17. November“ und Restzeit `.rest` | `147–153` |
| Startseite | Eyebrow `.hero.b2c .eyebrow` wörtlich „In Minuten zum Aufmaß für jeden Fensterbauer“; h1 „Fenster ausmessen. Selbst. eezi.“; Knöpfe auf `/app/#ausmessen` und `/app/#fuehrung`; `.wechsel` mit `data-act="ansicht"`; `a.tcard` auf `/ratgeber/fenster-ausmessen/` | `149`, `169`, `605`, `1582` |
| Startseite | Textfassung im Rohtext: `<div class="vorab">`, `<h1>Fenster ausmessen. Selbst. eezi.</h1>`, „Aufmaß-App für Fenster“, „auf einen Blick“ | `1576–1577` |
| Startseite | Fußzeile verlinkt `/impressum/`, `/datenschutz/`, `/ratgeber/`, `/fuer-fensterbauer/` | `155`, `1584` |
| Ansicht Fensterbauer | `.vk-einbettung` mit `.vk-hero`, `.vk-paket` (3), `form[data-vk-frage]`, `.vk-ablauf`, ohne `.rg-pfad`; `#kundenschutz` mit Link auf `/konfigurator-bedingungen/#kundenschutz` und den vier Zusagen „Nur Ihr Betrieb:“, „Nur an Sie:“, „In Ihrem Auftrag:“, „Kein Weiterverkauf:“ | `pruefen.mjs:172–177`, `611` |
| Verkaufsseite | h1 genau `Ihr eigener Fenster-Konfigurator, unter Ihrer <span class="ak">Marke</span>`; h2-IDs `die-idee`, `so-funktioniert-es`, `pakete`, `ablauf`, `demos`, `bestellen`, `haeufige-fragen`; Texte „3 bis 5 Werktage“, „ohne ihn programmieren zu lassen“, „Ihr eigenes Baby“ | `29.mjs:110–114` |
| Verkaufsseite | `article.vk-paket#paket-<name>` mit `<b>{Monat} €</b> im Monat`, „{Einrichtung} € Einrichtung“, „nur für Unternehmer“, „zzgl. MwSt.“; `table.rg-tab.vk-vergleich`; JSON-LD `SoftwareApplication` mit drei `Offer` | `29.mjs:26–39` |
| Verkaufsseite | Formular: `a[data-paket]` wählt `select[name="paket"]` vor; Felder `name`, `mail`, `text`; Fehler `.vk-fehler` mit Fokus; Dank `.vk-danke` mit Fokus; Preise `.vk-paket .vk-preis b` ohne JavaScript | `29.mjs:79–105` |
| Verkaufsseite | keine Links auf `/#tour` oder `/#fensterbauer`, kein „Kostenlos starten“ | `pruefen.mjs:1587–1593` |

### 5.4 Was die Suite nicht prüft

- Die Schriftgrößen der Startseite, auch der eingebetteten Verkaufsseite. Gemessen wird nur `/fuer-fensterbauer/` selbst.
- „Eine Cream-Pille je Bildschirm“ und „genau ein grünes Wort“ auf Startseite und Verkaufsseite. Geprüft werden diese Regeln nur im
  Betriebsbereich und in der App (`pruefen.mjs:958–972`, `4588`).
- Die ruhige Fassung von Startseite und Verkaufsseite. „Weniger Bewegung“ wird nur in App, Zentrale und Betrieb geprüft.
- Farbanteile, Licht mit Quelle und Bildbudget. Das prüft nur `farbanteil.py` von Hand (`designrichtung.md:205–207`).
- Breiten zwischen 390 und 1280, etwa 1024 aus `SKILL.md:28`.

## 6. Technische Chancen und Grenzen

### 6.1 WebGL-Bühne (`web/assets/buehne.js`)

**Was sie kann.** WebGL 2 mit Tiefenpuffer, Kantenglättung und Licht von innen und außen. Weiche Schatten über eine Schattenkarte
von 1024 px, Verschattung in Innenecken, gerundete Profilkanten, Glas mit Spiegelung. Echte Oberflächen: Putz, Klinker im
Läuferverband, Naturstein, Holz mit Gehrung, gebürstetes Aluminium. Formen morphen, und Öffnen, Schieben und Falten werden
vorgeführt (`docs/GESTALTUNG.md:60`, `490–492`; `buehne.js:1–16`, `282–298`). Die Schnittstelle bietet `an`, `anstoss`, `treffer`,
`aktiv`, `unterstuetzt` und Prüfhilfen wie `pixel` (`buehne.js:1257–1300`).

**Rückfall und Schutz.** Ohne WebGL 2, mit Software-Renderer (SwiftShader, llvmpipe), nach Verlust des Zusammenhangs oder bei 25
langsamen Bildern hintereinander geht die Bühne in drei Stufen zurück: erst halbe Auflösung, dann ohne Schatten und Schwingen, zuletzt
zum CSS-Modell. Gezeichnet wird nur, solange die Bühne im Bild ist (`buehne.js:252–281`, `387–416`, `355`). Höchstens drei Leinwände
liegen im Vorrat (`buehne.js:378–385`).

**Grenzen.**

- Die Bühne zeichnet kein eigenes Modell. Sie liest die DOM-Beschreibung, die `app.js` mit `w3dHTML`, `w3dLayout` und `w3dPaint`
  schreibt (`buehne.js:2–10`). Ohne `app.js` (809.975 B, gepackt 252.142 B) hat sie nichts zu zeichnen.
- `app.js` und `portal.js` sind klassische Skripte mit denselben globalen Deklarationen (`const esc`, `function render`, `const S`).
  Beide auf einer Seite brechen mit einem Syntaxfehler ab. Die App lässt sich auch nicht einrahmen (`frame-ancestors 'none'`).
- Live-3-D auf Startseite oder Verkaufsseite hieße also, das Modell aus `app.js` herauszulösen. Gegen das 300-KB-Budget wäre das
  nur mit verzögertem Laden vertretbar (`designrichtung.md:167–168`).
- Auf Geräten ohne Grafikchip läuft immer das CSS-Modell. In der Prüfumgebung ist WebGL nur mit `?gl=voll` aktiv. Wie flüssig es
  wirkt, entscheidet laut `SKILL.md:113` erst der Test am Telefon des Inhabers.

**Chance.** Die Designrichtung sieht für schwere 3-D-Objekte ohnehin eine vorgerenderte Bildfolge vor, „so wie Apple“
(`designrichtung.md:162`, `166`). Mit der vorhandenen Bühne, `?gl=voll` und Playwright (`SKILL.md:109–113`) lassen sich solche Folgen
aus dem eigenen Konfigurator erzeugen, etwa ein Fenster, das sich dreht oder öffnet. Das wäre echtes Material ohne Live-WebGL auf der
Seite. Rechenzeit und Bildqualität ohne Grafikchip im Container sind nicht geprüft.

### 6.2 Lottie

- Chance: Zehn Zeichen liegen in der Zeichensprache der Marke vor und färben sich in Tokenfarben. Sie laufen nur im Bild, stehen bei
  „weniger Bewegung“ auf dem Endbild und zeigen bis zum Laden ein Standbild (`gemeinsam.js:190–260`). Vier davon (`marke`, `domain`,
  `dashboard`, `konfigurator`) sind derzeit ungenutzt. Neue Zeichen entstehen aus Code (`scripts/lottie-erzeugen.py`). Für „Haken und
  Erfolg“ nennt die Designrichtung Lottie ausdrücklich (`designrichtung.md:149`).
- Grenze: Der Spieler hat 168 KB ungepackt (46 KB gepackt). Nur Formen sind möglich, ohne Ausdrücke. Farben wechseln nur als
  Überblendung zweier Formen (`docs/GESTALTUNG.md:43`). Strichzeichnungen sind „flache Symbole“; als Hauptträger widersprechen sie
  „echtes Material statt Symbole“ (`SKILL.md:41`; `designrichtung.md:127`).

### 6.3 Scroll-Bindung und Bewegungshelfer

- Chance: `Scroll.binden` liefert je Element einen Fortschritt von 0 bis 1 mit einstellbarer Spanne und eigener Scrollwurzel. Die
  Funktion rechnet nur, wenn sich etwas bewegt hat, und räumt Bindungen entfernter Elemente selbst ab (`gemeinsam.js:296–324`). Damit
  sind die Szenen der Designrichtung umsetzbar, die am Scrollen hängen: Objekt dreht oder öffnet sich, Kapitel, feste Bühne über zwei
  Bildschirmhöhen (`designrichtung.md:144–147`). Die Bühne „So funktioniert es“ zeigt das Muster schon (`verkauf.js:133–150`).
- Grenzen:
  - Bei „weniger Bewegung“ liefert die Funktion den Mittelstand 0,5 statt des Endbilds. Jedes Element muss seinen Endstand selbst
    setzen.
  - Die Messung läuft über `getBoundingClientRect` je Bindung und Bild. Bei vielen Bindungen kostet das auf schwachen Geräten Zeit.
  - Laut `designrichtung.md:145` darf das Scrolltempo nicht verändert werden. Scroll-Hijacking ist also ausgeschlossen, nur
    `position: sticky` und eine Bindung sind möglich.

### 6.4 Weitere vorhandene Hebel

- `AW.svg` zeichnet jedes Fenster als SVG, in jeder Form, Teilung und Farbe (`modell.js:958–995`). Das ist leicht, scharf und
  echt.
- Das echte Aufmaßblatt lässt sich je Abzug als Bild erzeugen (`scripts/tour-bild.mjs`). Ein Fingerabdruck meldet, wenn es nicht
  mehr zum PDF passt (`docs/GESTALTUNG.md:512`).
- Die Bildschirmaufnahmen des Modells (4.4) bilden einen Grundstock für Leisten und Kartenreihen mit echten Bildern. Vor dem Einsatz
  sind sie neu aufzunehmen.
- Die Hochformat-Videos (4.4) eignen sich als Bewegtbild am Telefon. `media-src` erlaubt eigene MP4-Dateien. Sie müssen stark
  verkleinert und ohne Ton ausgeliefert werden.

### 6.5 Grenzen aus Leistung, CSP und Architektur

- **Leistung:**
  - Die Startseite lädt rund 547 KB Skripte synchron, darunter Abrechnungslogik, die sie nicht anzeigt (1.4).
  - Ihr Inhalt entsteht erst im Browser. Die Überschrift ist bis dahin unsichtbar.
  - Jede neue Bewegung muss Schleifen außerhalb des Bildes anhalten (IntersectionObserver), wie es Leisten, Staub, Stapel und Lottie
    heute tun.
- **CSP:**
  - Kein WebAssembly. Gepackte 3-D-Formate, die einen WASM-Decoder brauchen, und WASM-basierte Animationsspieler scheiden aus.
  - Keine Bibliothek von einem CDN, kein Inline-Skript, kein eingebettetes Video von einer Plattform, keine Schrift von außen.
  - Bibliotheken müssen ohne `eval` auskommen und nach `web/vendor/` mit Lizenz.
- **Architektur:**
  - Startseite und App sind getrennte Oberflächen mit globalen Namen.
  - Die Verkaufsseite muss auf zwei Wurzeln laufen und Neuaufbauten der Startseite überstehen. `portal.js` baut kurz nach dem Laden
    einmal neu auf (`verkauf.js:468–471`).
  - Generierte Bereiche (Kopf, Fuß, Paket-Bausteine) ändert man nur in den Generatoren.
- **Zwischenspeicher:** Skripte und Stile tragen keine Versionskennung. Wie lange Browser alte Fassungen halten, legt nicht das
  Repository fest, sondern Cloudflare. Das bleibt offen (siehe 7).

## 7. Widersprüche und offene Fragen

1. **Lesefortschritt und Parallaxe:** `docs/GESTALTUNG.md:41` und `476` sagen „Parallaxe, Neigen per Maus und Lesefortschritt gibt es
   nicht“ bzw. „entfernt“, ebenso `:448` für die Verkaufsseite. `:447` und `:450` beschreiben auf derselben Seite aber „Tiefe beim
   Scrollen“ und einen Maßstab, „der sich mit dem Lesefortschritt grün füllt“. Beides ist umgesetzt (`verkauf.js:158–166`,
   `448–465`). Welche Regel gilt?
2. **Bewegungsdauern:** `docs/GESTALTUNG.md:38` nennt drei Dauern (150, 220, 320 ms) und „mehr gibt es nicht“.
   `designrichtung.md:137–139` und `verkauf.css:506–507` nutzen 600 und 900 ms, 24 px und 0,98. Die Designrichtung erweitert
   ausdrücklich nur die Farbregel (`designrichtung.md:6–7`). Gilt die Erweiterung der Bewegung auch für die Ansicht Hauseigentümer der
   Startseite?
3. **Zwei Schriftskalen auf der Startseite:** Die Ansicht Hauseigentümer folgt `portal.css` mit `clamp()` (Betriebsbereich-Rollen),
   die eingebettete Verkaufsseite der Skala 13 bis 40. `SKILL.md:69` nennt für alles Sichtbare nur 13, 15, 17, 24 und 40 (32). Welche
   Skala gilt für die Startseite?
4. **Lottie-Plätze:** `docs/GESTALTUNG.md:52–54` nennt `marke`, `domain` und `dashboard` auf der Verkaufsseite. Im HTML kommen sie
   nicht vor.
5. **Bilddokumentation:**
   - `docs/BILDER.md` beschreibt `start-fensterbauer` als „Bär in der Werkstatt“ (Plätze), im Prompt-Teil als Astronauten. Die Datei
     zeigt den Bären und ist nirgends eingebaut.
   - `fuer-fensterbauer` steht einmal als Bernhardiner-Prompt, einmal als „Startbild (Astronaut)“, einmal als „nicht mehr eingebaut“.
     Die Datei zeigt den Astronauten.
6. **Platzhalter mit beschreibendem `alt`:** `gross` (Startseite), `fb-kundenschutz` und `fb-frage` (Verkaufsseite) zeigen
   Platzhalter. Ihr Alternativtext beschreibt aber Motive, die nicht zu sehen sind (`portal.js:785`; `index.html:161`, `217`). Liefert
   der Inhaber diese Bilder, oder sollen die Plätze entfallen?
7. **Wortmarke:** `docs/GESTALTUNG.md:7` nennt „eezi“ in Black (900), `:26` sagt „900 gibt es nicht“. `gemeinsam.css:53` setzt 800.
8. **„3-D-Modell“ auf der Startseite:** `docs/GESTALTUNG.md:480` nennt das 3-D-Modell in „Was im Aufmaß steckt“. Die Startseite lädt
   weder `app.js` noch `buehne.js`. Gezeigt wird eine SVG-Zeichnung, die per CSS geneigt wird (`portal.js:861–864`;
   `portal.css:256`).
9. **Grüner Schein der empfohlenen Paketkarte** ohne Lichtquelle (`verkauf.css:23`), gegen „Licht nur mit Quelle“
   (`designrichtung.md:85–87`, `196`).
10. **Ordner `web/fuer-fensterbauer/bilder/`** aus dem Arbeitsauftrag existiert nicht. Ist ein solcher Ordner geplant?
11. **Bildschirmaufnahmen mit Beispieldaten** (`Fensterbau Brandt`, `Familie Weber`, auch auf der Verkaufsseite im Aufmaßblatt nur mit
    „P-BEISPIEL“ gekennzeichnet): Reicht diese Kennzeichnung für „Ehrlich. Keine erfundenen Belege“ (`SKILL.md:49`)?
12. **Zwischenspeicher der Assets:** Das Repository legt für `/assets/*` keine Cache-Regel fest, und Dateinamen tragen keine Version.
    Wie Cloudflare das ausliefert und ob alte Fassungen nach einer Veröffentlichung hängen bleiben, ist hier nicht feststellbar.
13. **Bewegungssensoren und Haptik auf Verkaufsflächen:** Die Permissions-Policy erlaubt sie, `Haptik` ist geladen, wird auf der
    Verkaufsseite aber nicht genutzt. Ob der Inhaber Haptik auf der Website will, steht nirgends.

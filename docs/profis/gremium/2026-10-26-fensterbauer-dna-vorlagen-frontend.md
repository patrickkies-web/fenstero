# Abgleich Frontend und Leistung (Tobias Lenz): Seite für Fensterbauer

Stand 26.10.2026, Vorschau docs/profis/fensterbauer-vorschau/ vor dem Umbau nach dem Gremium. Simulierte Stimme, Messungen echt (Playwright gegen den Vorschau-Server, Skripte außerhalb des Projekts).

Gesamteindruck: Die Seite steht technisch deutlich über der Startseiten-Vorschau (kein Auftritt unterhalb des Hero, keine Weichzeichner auf Flächen, alle Bilder eager mit Maßen, 0,7 s bei gedrosselter CPU), aber der Vorhang hat zwei messbare Löcher, die genau das Anfrageformular treffen, und die Leiste verliert nach jedem Resize ihren Bezugspunkt.

## Abgleich mit dem Startseiten-Urteil (was dort behoben wurde, gilt hier)

1. Auftritt unter dem Hero: behoben und übertroffen. `data-dna-auftritt` steht nur in Szene 1, dazu die sechs Wörter aus `data-dna-woerter`; unterhalb laufen nur die Anker-Etiketten (`bundle.js anker()`, Schwelle 0,35, Verzögerung 300 ms + i × 140 ms), ein DNA-Baustein, sichtbarkeitsgesteuert, hinnehmbar.
2. Lazy-Bilder: behoben. Alle sieben `<img>` mit width/height, `loading="eager" fetchpriority="low" decoding="async"`, Hero `fetchpriority="high"`; sechs Dateien, 261 kB. `bilder/wand-innen.webp` (19,8 kB) wird nirgends referenziert: Waise, nicht nach web/ mitnehmen. `modell-anthrazit.webp` (981 px) wird höchstens 320 px breit gezeigt; 700 px reichen (−25 kB, klein).
3. Weichzeichner auf Flächen: behoben (`.ez .dna-leucht::before { filter: none; inset: 0 }`, `::after { content: none }`, `.ez-stufe--leucht::before` und `.ez-paket--leucht::before` ohne Filter). Bilanz: `filter: blur(6px)` nur auf den sechs Hero-Wörtern bis `.ist-da`; `backdrop-filter` 12 px auf neun Etiketten, zwei Glaskarten, 16 px auf der Leiste (einzige Fläche); `drop-shadow` 1 px auf drei ganzen Anker-SVGs.
4. Vorhang: Stabilisierung vorhanden (start.js), aber mit Lücken, siehe Hebel 1. Die 60-%-Variante (Kleben erst bei 40 % Überdeckung) wurde nicht übernommen; Entscheidung des Gremiums, kein Einwand.
5. Schriften: Preload für Outfit und Inter vorhanden; Inter weiter 48 kB für neun Zeichen; keine Metrik-Ersatzschrift, siehe Hebel 3.
6. Hero-Choreografie: 6 px Blur, `will-change` auf den Wörtern, Etikett ohne Backdrop-Wanderung, kein Zahlenlauf: wie empfohlen.
7. Bento-FLIP: nicht auf der Seite.
8. Rahmen: `<style>html,body{background:#07090a}</style>` steht vorn, kein weißer Blitz; `html:not(.ez-js)` liefert die ruhige Fassung ohne JavaScript.

## Hebel nach Wirkung

### 1. Vorhang verliert die Höhe der Szenen (hoch)

Wo · `dna/bundle.js vorhang()` (`--dna-szene-oben` nur bei `load` und `resize`), `start.js` (Stabilisierung), Szene 4 mit `<details class="ez-vergleich-auf">` und dem Formular am Szenenende.
Was · Nachgemessen: Tabelle zu → Sendeknopf an 8 (Schreibtisch) bzw. 7 (Telefon) Scrollpositionen sichtbar und oberstes Element. Tabelle auf → Szene 4 wächst von 2380 auf 3100 px (Telefon 4352 → 5855), `--dna-szene-oben` bleibt −1580 px (erwartet −2300), der Knopf ist an **keiner** Scrollposition erreichbar, Szene 5 deckt ihn ab, bevor er ins Bild kommt. Nach einem künstlichen `resize` wieder 8/7. Zweites Loch: beim Wachsen des Viewports (Adressleiste weg, 664 → 740 px) rechnet `ordne()` noch mit dem alten Wert, weil der Bundle-Listener vor dem entprellten Update in start.js läuft; erst das nächste Resize liefert −791 statt −867 px. Drittes: start.js liest `documentElement.clientHeight`; das ist der ICB, den iOS Safari auf der kleinen Höhe hält, die „größte gesehene Höhe“ wächst dort nie. Die Live-Startseite (web/assets/startseite.js) liest richtig den Original-Getter.
Wie · Soll bundle.js unangetastet bleiben: in start.js `new ResizeObserver(function () { w.dispatchEvent(new Event('resize')); })` auf die Szenen (der eigene Entpreller findet dann keine Änderung mehr, keine Schleife); Original-Getter von `innerHeight` lesen. Dazu die Ankersprünge: `#bestellen` landet am Schreibtisch (1280 × 800) mit Szene 4 bereits geklebt, Formular 144–728, Szene-5-Kante bei 657 px: die Datenschutzzeile liegt schon unter dem Vorhang, der Knopf hat 13 px Luft. In start.js Klicks auf `a[href^="#"]` abfangen und `scrollTo(Math.min(zielOben, szeneOben + szene.offsetHeight - H))`, dann landet der Sprung im Moment des Klebens, Formular ganz frei. Die sturere Lösung ist Sache des Gremiums: der Anfrageblock als Anfang von Szene 5 (letzte Szene, wird nie verdeckt).

### 2. Leiste misst ihre Grenze mit dem Sticky-Versatz (hoch am Telefon, klein am Schreibtisch)

Wo · `start.js`: `grenze = kopf.getBoundingClientRect().bottom + scrollY`, aufgerufen bei `resize`; gleich in web/assets/startseite.js.
Was · Liegt die Seite beim Resize unterhalb des Hero, ist Szene 1 geklebt und `getBoundingClientRect()` enthält den Versatz; `grenze` wird zur aktuellen Scrollhöhe plus Kopfhöhe. Gemessen: ohne Resize kommt die Leiste beim Hochscrollen, nach einem Resize bei scrollY 4000 bleibt sie bei 200 px Hochscrollen weg. Am Telefon feuert `resize` bei jeder Adressleiste, also praktisch bei jedem Lesen.
Wie · Grenze versatzfrei messen (Kopf außerhalb der klebenden Szene oder `offsetTop + offsetHeight`). Dazu `.ez-leiste { visibility: hidden; transition: transform 220ms var(--dna-druck), visibility 0s 220ms }` und `.ez-leiste.ist-da { visibility: visible; transition: transform 320ms …, visibility 0s }`: die Backdrop-Ebene entfällt, solange die Leiste oben liegt.

### 3. Schriften: 48 kB Inter für neun Zeichen, kein Ersatz ohne Sprung (mittel)

Wo · index.html (Preload), start.css (`font-display: swap`), `.ez-wm`; bundle.css `text-wrap: balance` auf h1/h2.
Was · Inter (voller Gewichtsbereich) wird mit hoher Priorität vor dem Hero-Bild geladen, gebraucht für „eeziframes“. „Layoutsprung 0“ ist ein Wert vom lokalen Server; im Netz rendert Outfit erst nach dem Tausch, `balance` bricht h1/h2 neu um, der ganze Hero rückt.
Wie · Teilmenge „Inter Wortmarke“ (Zeichen e z i f r a m s, Schnitte 500 und 900, etwa 3 kB) als eigene Familie mit `unicode-range`, nur diese Datei preloaden. Für Outfit eine Metrik-Ersatzschrift als letzte Familie in `--font-sans` (ascent-/descent-/line-gap-override aus hhea von outfit.woff2; Messung auf dem Rechner des Inhabers, fontTools fehlt im Container). Prüfsuite: CLS einmal mit Slow 4G messen. In web/ liegt Outfit doppelt (fonts.css als woff 100–900, dna.css als woff2 200–700): diese Seite lädt nur `/fonts/dna.css` plus die Wortmarken-Teilmenge; /fonts/* ist ein Jahr immutable, neue Datei heißt neuer Name.

### 4. Ebenen und Filter aufräumen (mittel auf schwachen Telefonen, klein am Schreibtisch)

Wo · start.css (`.ez .dna-wort { will-change: filter, transform }`, drop-shadow auf drei Anker-SVGs), index.html (`data-dna="heraustreten"` auf der Glaskarte), bundle.css (`will-change: transform`).
Was · Sechs Wörter bleiben nach dem Auftritt dauerhaft eigene Ebenen; die Glaskarte schreibt bei jedem Scrollbild im Hero eine neue Transform und lässt dabei ihr 12-px-Backdrop neu abtasten; wegen `will-change` rastert Chrome ihren Text bei 1,0 und zeigt ihn bei 1,05, am Schreibtisch sichtbar weich. Die drop-shadow-Filter liegen auf der ganzen SVG-Fläche statt auf den Linien.
Wie · `will-change` nach dem Auftritt freigeben (transitionend), `@media (prefers-reduced-motion: reduce) { .ez .dna-wort { will-change: auto } }`. Glaskarte ohne `heraustreten`, Position statisch (Gen G12 ist die Position, nicht die Bewegung; scharfer Text, null Scrollarbeit). Filter auf `.dna-anker__linien line` (Filterregion = Linienbox).

### 5. CSP und Übertragung nach web/ (hoch für die Übernahme, sonst nichts)

Wo · index.html (`<script>document.documentElement.classList.add("ez-js");</script>`, `claude:viewport-fit-sides`), Preise in Karten, Tabelle, Hero-Chip, Kachel, Abschluss; web/_headers und functions/seo.js (`script-src 'self'`).
Was · Das Inline-Skript wird online blockiert, dann bleibt `[data-dna-auftritt]` zwar sichtbar (ruhige Fassung), aber ohne Auftritt, und die Prüfsuite meldet den CSP-Verstoß. Alles Übrige ist CSP-tauglich: `fetch` und `method="post"` auf `/api/partner/frage` sind same-origin (router.js erkennt urlencoded und antwortet mit HTML, JSON mit JSON), `data:`-Masken deckt `img-src data:`, Inline-Styles deckt `'unsafe-inline'`, kein fremder Server.
Wie · Hash in beide Stellen: `script-src 'self' 'sha256-OI9dXh57IUMoSvC2Z2WVNtCzR11O14DMKmHQVdfav4c='` (über den Skripttext ohne Tags; jede Änderung am Text ändert den Hash). Alternative ohne Policy-Änderung: `/assets/js-da.js` synchron im `<head>` vor den Stylesheets. Meta `claude:viewport-fit-sides` streichen; Pfade absolut; den Kopf der Live-Seite (title, description, og, `<!--pakete:ld-->`, FAQ-JSON-LD) übernehmen. Preise: die Bausteine liefern „29 €“ mit U+202F (`fb-monat-*`, `fb-einr-*`, `fb-ab`), passend für Hero-Chip, Abschluss, Einrichtungszeile, Kacheltext und Tabellenzellen; in `.dna-zahl__wert` steht die Zahl ohne Einheit, dafür in functions/pakete-seite.js neue Bausteine `fb-monat-zahl-<paket>` → `zahl(P().preis(p).monat)` anlegen. `fb-cta-*`, `fb-anfrage-titel`, `fb-anfrage-lede`, `fb-faq-bestellen`, `fb-fuss` erzeugen heute altes Markup (z. B. `<span class="gruen">`), auf `dna-pille`/`em.ez-ak` umstellen, weil sie bei PAKETE_OFFEN=1 die Knöpfe ins Kundenkonto führen. Danach `node scripts/bedingungen-pdf.mjs` und `scripts/pruefen-instanzen/29.mjs`.

## Kleine Notizen ohne Hebelrang

Formular: `aria-pressed` auf `<label>` ist ungültiges ARIA, Stilhaken als Klasse nehmen; `fetch` mit `signal: AbortSignal.timeout(15000)`, sonst bleibt der Knopf bei hängender Verbindung gesperrt. Stationen: Beobachter mit `matchMedia('(min-width: 900px)')` schalten (unter 900 px sind sie `display: none`) und bei zwei Treffern im Band den der Mitte nächsten nehmen. Layoutsprung: alle Bühnen haben `aspect-ratio` oder feste Höhen, Bilder Maße, Leiste fixed; einzige Risiken sind der Schrifttausch (Hebel 3) und `<details>` (nutzerausgelöst, zählt nicht).

## Die drei, die am meisten bringen

1. Vorhang nach Höhenänderung neu ordnen (Hebel 1): sonst ist der Sendeknopf nach dem Öffnen der Vergleichstabelle unerreichbar und der Haupt-CTA landet am Schreibtisch mit 13 px Luft vor dem Vorhang.
2. Leistengrenze versatzfrei messen (Hebel 2): sonst fehlt die Leiste am Telefon nach jeder Adressleistenänderung; derselbe Fehler steht in web/assets/startseite.js.
3. CSP-Hash und Preis-Bausteine (Hebel 5): ohne beides läuft die Seite online entweder ohne Auftritt oder mit festen Zahlen gegen die eine Wahrheit in pakete.js.

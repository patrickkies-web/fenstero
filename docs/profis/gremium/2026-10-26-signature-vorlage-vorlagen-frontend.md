# Abgleich Frontend und Leistung (Tobias Lenz): Vorlage EEZI Signature

Stand 26.10.2026, Vorschau docs/profis/signature-vorschau/ (index.html, start.css, start.js, dna/bundle.*). Simulierte Stimme. Messwerte des Briefs übernommen (0,36 s bei vierfacher CPU-Drossel, Layoutsprung 0, 273 kB Bilder, 0 Animationen nach 2,6 s, keine Konsolenfehler); selbst gemessen: Bildmaße und WebP-Neukodierung (Pillow, im Scratchpad, nichts im Projekt angelegt), Pixelbreiten aus den Bildschirmfotos (r3, r3z, bew), Breiten bei 320/360/1920 px aus dem Code abgeleitet. Die dna-Bausteine (bundle.css, bundle.js) bleiben unverändert; was sie betrifft, steht als „Vorschlag ans Design-System“.

Gesamteindruck: Die Seite steht da, wo die Vorlagen des Inhabers stehen (Telefon auf Beton bei ui.vitali, Zahl als Held bei Heeal, Glas-Etikett auf dem Foto bei der Koch-App): nichts läuft nach dem Hero weiter, nichts rechnet beim Scrollen, Glas nur auf kleinen Chips, die Bühne wird einmal gerastert. Die Lücken liegen nicht in der Leistung, sondern an drei Stellen, die genau die Kaufmomente treffen: der Umschalter der Vorlage reagiert in der falschen Reihenfolge und lässt den Vorhang mit alter Höhe stehen; die zwei Zahlen-Helden (Telefonnummer, Dashboard-Karte) laufen bei 360 px (häufigste Android-Breite) über die Kante; und die Vorlage ist noch nicht so gebaut, dass die Instanz aus ihr sauber einen Zustand ohne Muster-Ebene schneiden kann.

## Was schon gut ist (drei Zeilen)

1. Ladeweg: Bühne per Preload und `fetchpriority="high"`, jedes Bild mit Maßen, Outfit (32 kB) preloaded, kein `filter: blur` auf Flächen (Leuchten ohne Weichzeichner, G14), 0,36 s gedrosselt, Layoutsprung 0, keine fremden Server, nichts außer der einen Inline-Zeile gegen die CSP.
2. Bewegung endet: `will-change` nur bis `.ist-da`, Bühne und Gerät nur 2-D (`scale(1,.81) rotate(-20deg)`, keine 3-D-Ebene), Muster-Etiketten und Toast über `opacity`/`visibility` statt Platz, Druck mit `transition-duration: 0s` sofort, `touchstart`-Lauscher für `:active` auf iOS, nach 2,6 s steht alles.
3. Robustheit: `overflow-x: clip` statt `hidden` (kein Scrollcontainer), `localStorage` in try/catch, Fokus unter dem Vorhang wird geholt, die Leistengrenze wird relativ zur Szene gemessen (der Sticky-Versatz-Fehler des Vorgängers ist weg), Doppelbilder (konfig/*) nur einmal geladen.

## Abgleich mit dem Vorgänger-Urteil (fensterbauer-dna-vorlagen-frontend.md), nur was offen blieb

- Hebel 1 (Vorhang nach Höhenänderung, ResizeObserver, Original-Getter von `innerHeight`): nicht übernommen; `start.js` liest weiter `documentElement.clientHeight`. Auf dieser Seite gibt es kein `<details>`, dafür ändert der Umschalter die Höhe (siehe Hebel 1 unten).
- Hebel 2b (Leiste mit `visibility: hidden`, Backdrop-Ebene weg solange sie oben liegt): nicht übernommen. Gilt weiter, ist aber klein.
- Hebel 3 (Metrik-Ersatzschrift für Outfit, CLS bei Slow 4G messen): gilt weiter. Positiv: Inter ist weg, nur noch Outfit; Doto wird deklariert, aber von keinem Element verlangt und darum nicht geladen (0 Byte).
- Hebel 4 (Glaskarte ohne `heraustreten`): übernommen, nichts auf der Seite ist scrollgebunden. Hebel 5 (CSP-Hash oder js-da.js): nicht übernommen, Inline-Skript steht noch im Kopf (Hebel 3 unten).

## Hebel nach Wirkung

### 1. Umschalter: Bedienfläche vor Inhalt, Doppelklick, Vorhang nach dem Tausch (hoch für den Verkaufsweg)

Wo · `start.js`, Block „Zustand der Vorlage“ (`setzeModus`, `modusUhr`, 160 ms) und Block „Muster-Ebene“ (`schalter`); `start.css` `@media (prefers-reduced-motion: reduce)` und `.ez-link-etikett`.

Was ist · (a) `aria-pressed` wird erst nach 160 ms in `setzeModus` gesetzt, dann läuft die Farbe 220 ms nach; in `bew/modus-mitte-1.png` steht der neue Hero-Text schon, während der Umschalter noch zwischen beiden Knöpfen hängt: die Bedienfläche reagiert nach dem Inhalt statt vor ihm (emil: der Knopf zuerst, der Inhalt folgt). (b) Doppelklick A→B→A innerhalb 160 ms: der zweite Klick vergleicht mit `data-modus`, das noch A ist, und wird verworfen; die Uhr setzt B, obwohl der letzte Klick A war. (c) Nach dem Tausch ändern sich die Höhen von Szene 1, 3, 4 und 5 (Pille 678 → 702 px am Telefon, Brief länger); `bundle.js ordne()` rechnet `--dna-szene-oben` nur bei `load`/`resize`, `messeGrenze` ebenso. Auf jedem Telefon, dessen Sichthöhe unter 834 px liegt (Pixel 7 mit Browserleisten ≈ 780, alle 360 × 800 mit Leisten ≈ 660), klebt Szene 1 danach 24 px zu hoch: die letzte Zeile des Hero („Etwa 5 Minuten je Fenster …“) wird von Szene 2 verdeckt, bevor sie je sichtbar war. Gleiches beim Schalter „Zeigen, was Ihres ist“ (Bento wächst um vier Reihen). (d) Bei „weniger Bewegung“ tauscht `setzeModus` sofort, aber `.ez-link-etikett` fährt per `@starting-style` trotzdem 320 ms ein und `.ez-hero__text` behält seine Transition; beide fehlen in der Ruhig-Regel. (e) Ohne JavaScript: Zustand „website“, Knöpfe tot, sonst nichts kaputt, aber die Muster-Leiste zeigt tote Bedienung.

Wie · `start.js`, Block ersetzen:
```js
var ziel = wurzel.getAttribute('data-modus'), ruhig = function () { return !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); };
var neuOrdnen = function () { w.dispatchEvent(new Event('resize')); };   /* bundle.js ordne(), messeGrenze, plane */
var markiere = function (m) { modusKnoepfe.forEach(function (k) { k.setAttribute('aria-pressed', k.getAttribute('data-modus') === m ? 'true' : 'false'); }); };
try { if (w.localStorage.getItem('ez-modus') === 'einladung') { ziel = 'einladung'; wurzel.setAttribute('data-modus', ziel); markiere(ziel); } } catch (e) {}
modusKnoepfe.forEach(function (k) {
  k.addEventListener('click', function () {
    var m = k.getAttribute('data-modus');
    if (m === ziel) return;
    ziel = m; markiere(m);                                   /* Bedienfläche sofort */
    try { w.localStorage.setItem('ez-modus', m); } catch (e) {}
    clearTimeout(modusUhr);
    if (m === wurzel.getAttribute('data-modus')) { wurzel.classList.remove('ist-wechsel'); return; }   /* zurückgeklickt, bevor getauscht wurde */
    if (ruhig()) { wurzel.setAttribute('data-modus', m); neuOrdnen(); return; }
    wurzel.classList.add('ist-wechsel');
    modusUhr = setTimeout(function () { wurzel.setAttribute('data-modus', ziel); wurzel.classList.remove('ist-wechsel'); neuOrdnen(); }, 160);
  });
});
```
Im Schalter-Block nach `setze(an)` ebenfalls `w.dispatchEvent(new Event('resize'))`. Der eigene Resize-Entpreller in start.js findet dabei keine Breitenänderung und bleibt still, keine Schleife. In `start.css`: `@media (prefers-reduced-motion: reduce) { .ez-leiste, .ez-muster, .ez-toast, .ez-hero__text, .ez-link-etikett { transition: none } }` und `html:not(.ez-js) .ez-modus, html:not(.ez-js) .ez-schalter { display: none }`.

Warum · Der Umschalter ist das Erste, was ein Fensterbauer am Telefon antippt; wenn der Knopf nach dem Text reagiert und danach die letzte Hero-Zeile unter dem Vorhang fehlt, wirkt genau das Spitzenpaket unpräzise. Vier Zeilen, keine Bausteinänderung.

### 2. Zahlen-Helden bei 360 px: Telefonnummer und Dashboard-Karte laufen über (hoch, trifft jede Instanz)

Wo · `start.css` `.ez-kontakt__held-text b` (`font: 250 clamp(36px, 10vw, 44px)`, `white-space: nowrap`), `.ez-kontakt__held` (Grid `1fr 44px`, Lücke 12, Innenabstand 18/14); `.ez-stand__wert` (Flex, `space-between`), `.ez-stand__zahl` (nowrap), `.ez-kapseln`.

Was ist · Aus `bew/detail-kontakt.png` gemessen: „0221 123456“ braucht 254 px bei 48 px, also 0,48 em je Zeichen. Platz für die Nummer am Telefon: Breite − 32 (Hülle) − 48 (Karte) − 32 (Held) − 56 (Knopf + Lücke). Bei 390 px: 222 px Platz, 207 px Nummer (die Vorschau passt, 15 px Luft). Bei 360 px: 192 px Platz, 191 px Nummer, null Luft, und zwar mit der kürzesten denkbaren Nummer. Echte Nummern haben 12 bis 13 Zeichen (`0221 1234567`, `02203 123456`): 12 Zeichen laufen bei 390 px 4 px, bei 360 px 16 px über; 13 Zeichen 22 bzw. 34 px. `.ez-kontakt` schneidet mit `overflow: hidden` ab: die letzte Ziffer fehlt. Dashboard-Karte: „2“ (46 px) + „von 4 Fenstern“ + Kapselreihe (66 px) + Lücke = 207 px, Platz in `.ez-stand` bei 390 px 218, bei 360 px 188, bei 320 px 148: die Kapseln (das Signature-Merkmal) rutschen bei 360 px 19 px in den Rand der Route, bei 320 px werden sie abgeschnitten. In `r3/reihe-tel.jpg` sieht man beide Reihen bei 390 px schon an der Kante.

Wie · Nummer an die Container-Breite binden, die Zeichenzahl schreibt die Instanz (sie kennt die Nummer):
```css
.ez-kontakt__held { container-type: inline-size; }
.ez-kontakt__held-text b { font-size: clamp(36px, 10vw, 44px); font-size: clamp(26px, calc((100cqi - 56px) / (var(--tel-zeichen, 11) * .5)), 44px); }
```
Die erste Deklaration bleibt als Fallback für Browser ohne `cqi` (Chrome < 105, Safari < 16). Im HTML `<a class="ez-kontakt__held" … style="--tel-zeichen: 11">`; der Worker setzt `String(tel).length`. Ergebnis: 390 px → 40 px, 12 Zeichen 37 px, 13 Zeichen 34 px; bei 360 px 35/32/30 px, nie abgeschnitten, die Zahl bleibt der Held. Dashboard-Karte: `.ez-stand__wert { flex-wrap: wrap; gap: 8px 12px; }`, die Kapseln fallen unter 400 px unter die Zahl statt über die Kante.

Warum · 360 CSS-Pixel ist die Breite der Samsung-A-Reihe und der meisten Mittelklasse-Androiden, also des Kunden, den der Brief meint. Die Telefonnummer ist der Held der Kontaktkarte und die Kapselreihe das eine Element, das Signature im Hauptteil zeigt; beide dürfen nicht die ersten sein, die brechen.

### 3. Übernahme in die Instanz: ein Zustand, Muster-Ebene schneidbar, CSP (hoch für die Übertragung, sonst nichts)

Wo · `index.html` (Muster-Leiste, 11 `.ez-muster`-Spans, fünf `.ez-foto`-Platzhalter, `.ez-toast`, beide `h1`, alle `.ez-nur-web`/`.ez-nur-einladung`, `<script>document.documentElement.classList.add("ez-js")</script>`, `meta claude:viewport-fit-sides`); `start.css` (Regel `.ez[data-modus="website"] .ez-nur-einladung, … { display: none !important }`, Abschnitte „Muster-Ebene“, „Muster-Leiste“, `.ez.ist-muster .ez-bento`, `.ez.ist-muster .ez-foto`); `start.js` (Modus, Schalter, Toast); `functions/instanz/seiten.js` (`kopf()`, Ersetzungen mit Funktion nach K1.11).

Was ist · Der Worker ersetzt Zeichenketten, er parst kein HTML. Nach heutigem Stand bekäme die Instanz die Seite mit beiden `h1` (das zweite per `display: none`, bundle.js zerlegt trotzdem beide in Wörter), mit Muster-Leiste, Etiketten und Toast im DOM, und könnte sie nur über Klassen verstecken. Das `!important` ist dabei überflüssig: der Selektor hat (0,3,0) und schlägt `.ez-nur-desk { display: block }` (0,1,0) ohnehin; es verhindert nur, dass die Instanz je etwas anders zeigt. Schärfer: das Bento-Layout mit Fotos hängt an `.ez.ist-muster`, nicht an „Fotos vorhanden“. Eine Instanz mit echten Fotos 2–6 müsste die Muster-Klasse setzen, um sie zu zeigen; für 1 bis 4 Fotos gibt es kein Layout (nur 0 und 5 Kacheln). Das Inline-Skript wird von `script-src 'self'` blockiert, dann fehlt `ez-js`; `web/assets/js-da.js` gibt es genau dafür schon. Und ohne JavaScript (Lesemodus, Skriptfehler) ist die Aussage des Briefs „alles sichtbar“ falsch: ohne `--dna-szene-oben` kleben alle Szenen bei `top: 0`, Szene 3 (1545 px am Telefon) zeigt nur ihre ersten 844 px, der Rest liegt für immer unter Szene 4.

Wie · Marker statt Klassen für alles, was die Instanz wegschneidet oder wählt, je eine Regex im Worker:
```html
<!--vorlage--> … Muster-Leiste, jedes <span class="ez-muster">, Platzhalter-Innenleben der .ez-foto, .ez-toast … <!--/vorlage-->
<!--nur:web--> <h1 class="dna-titel-xl ez-nur-web" …>…</h1> <!--/nur:web-->   <!--nur:einladung--> … <!--/nur:einladung-->
```
```js
const NUR = { website: /<!--nur:einladung-->[\s\S]*?<!--\/nur:einladung-->/g, einladung: /<!--nur:web-->[\s\S]*?<!--\/nur:web-->/g };
html = html.replace(/<!--vorlage-->[\s\S]*?<!--\/vorlage-->/g, '').replace(NUR[zustand], '').replace('data-modus="website"', () => 'data-modus="' + zustand + '"');
```
Die Klassen bleiben für den Umschalter der Vorlage; in `start.css` das `!important` streichen. Muster-CSS (beide Muster-Abschnitte, `.ez-toast`, alle `.ez.ist-muster`-Regeln) nach `vorlage.css`, Modus/Schalter/Toast nach `vorlage.js`; die Instanz lädt beides nicht. Fotos entkoppeln: `.ez.ist-muster .ez-bento, .ez-bento[data-fotos="5"] { … }` und `.ez.ist-muster .ez-foto, .ez-foto.ist-belegt { display: block }`; die Layouts für `data-fotos="1"` bis `"4"` muss die Vorlage noch liefern (Gremium). Kopf: `<script src="/assets/js-da.js"></script>` statt der Inline-Zeile, `claude:viewport-fit-sides` streichen, `lokal.html` nicht mitnehmen (Hülle nur für die Vorschau), Pfade absolut (`/fonts/dna.css` statt eigener `@font-face`, `/assets/dna-bundle.js`). Schutz ohne Skript: `html:not(.ez-js) .dna-szene { position: static }` in `start.css`. Prüfsuite: Instanz-Antwort darf weder `ez-muster`, `ez-toast`, `data-vorlage=` noch ein zweites `<h1` enthalten.

Warum · Die Instanz liefert je Betrieb genau einen Zustand; was sie nicht wegschneiden kann, bleibt im DOM aller Kundenseiten. Mit den Markern ist das drei Regex-Zeilen, die Vorlage behält ihren Umschalter, und die Prüfsuite kann es messen.

### 4. Bilder: Bühne in zwei Breiten, Rendering kleiner (mittel, trifft die schwächsten Geräte)

Wo · `index.html` (`<link rel="preload" href="bilder/buehne.webp">`, `<img class="ez-buehne__foto" … width="1000">`, `<img class="ez-planen__bild" src="bilder/so/modell-sprosse.webp" width="800">`); `start.css` `.ez-planen__bild { width: 46% }` (Telefon) / `23%` (Schreibtisch).

Was ist · `buehne.webp` ist 1000 × 750 bei 102 kB, nahe Qualität 85 (gemessen: q80 97 kB, q75 86 kB, Neukodieren bringt kaum etwas). Gezeigt wird sie am Telefon 358 px breit, am Schreibtisch 541 px (Hülle 1104, Spalte 1,1/2,1). Für 3×-Telefone (1074 px) passt 1000; 2×-Telefone (716 px) laden 62 kB mehr als nötig, und das sind genau die 720p-Androiden (A0x/A1x, Redmi A, Moto E). Gemessen: 720 px bei q80 = 35 kB. `modell-sprosse.webp` (800 px, 53 kB) wird 165 px (Telefon, 3× → 494) bzw. 254 px (Schreibtisch, 2× → 508) breit gezeigt; 520 px reichen, gemessen 32 kB.

Wie · Zwei Dateien (`buehne-720.webp`, `buehne.webp`), im HTML:
```html
<link rel="preload" as="image" imagesrcset="bilder/buehne-720.webp 720w, bilder/buehne.webp 1000w" imagesizes="(min-width: 900px) 541px, (min-width: 760px) calc(100vw - 96px), calc(100vw - 32px)">
<img class="ez-buehne__foto" src="bilder/buehne.webp" srcset="bilder/buehne-720.webp 720w, bilder/buehne.webp 1000w" sizes="(min-width: 900px) 541px, (min-width: 760px) calc(100vw - 96px), calc(100vw - 32px)" width="1000" height="750" alt="" fetchpriority="high" decoding="async">
```
`modell-sprosse.webp` auf 520 × 530 neu schneiden, `width="520" height="530"`. Für die Fotos des Betriebs (Foto 1 wird die Bühne) muss `verkleinern()` in `web/assets/einladung.js` zwei Breiten ablegen (720, 1000), sonst gilt der Gewinn nur für die Vorlage.

Warum · Die Bühne ist das LCP-Element. Auf einem 720p-Android am 4G-Rand sind 62 kB rund 0,2 s bis zum ersten vollen Bild, das die Messung mit vierfacher CPU-Drossel nicht zeigt (sie misst Rechenzeit, nicht Leitung). Bilanz: 273 → 211 kB auf 2×-Telefonen, 252 kB überall.

### 5. Firmenfarbe ohne `color-mix()` (mittel: Robustheit auf älteren Androiden, null Kosten)

Wo · `index.html` `<style>` (Block „VORLAGE: Firmenfarbe“: `--firma-kern: color-mix(in srgb, var(--firma) 45%, #fff)`); `start.css`, 19 Stellen `color-mix(… var(--firma|--firma-tief|--firma-licht|--hinweis|--silbergrau) … transparent)` in `.ez-buehne__schein`, `.ez-planen__schein`, `.ez-senden__schein`, `.ez-kontakt__schein`, `.ez .dna-leucht::before`, `.ez-route__stelle--ziel::before`, `--ez-schraffur`, `.ez-person`, `.ez-dinge__zeichen`, `.ez-kapseln i`, `.ez-fuss`, `.ez-muster::before`, `.ez-schalter`, `.ez-modus`, `.ez-hinweis::before`, `.ez-foto__schraffur`, `.ez-wahl-reihe .offen`.

Was ist · Ohne `color-mix()` (Chrome < 111, Samsung Internet < 21, Safari < 16.2, WebView auf nicht aktualisierten Geräten) wird jede Deklaration, die `var(--firma-kern)` oder einen `color-mix`-Stopp enthält, zur Rechenzeit ungültig und fällt weg: alle Scheine (Bühne, Kachel, Senden, Kontakt, Zeit-Karte, Route), die Schraffur der Kapseln und Fotoplätze, der Ring um die Person, die Zeichenkreise, der Fußstrich. Die Seite steht dann flach schwarz-weiß, die Firmenfarbe nur noch im Logo, und der Fensterbauer sieht sein Paket ohne Licht. Der Anteil ist klein (einstellig), aber es sind genau die alten Mittelklasse-Geräte, und der Worker rechnet die Farben ohnehin schon aus (`--firma-tief` steht als Hex im Block).

Wie · Der Worker schreibt Tripel und Hex statt Mischungen:
```css
.ez { --firma: #d8ad55; --firma-rgb: 216 173 85; --firma-tief: #5b4a26; --firma-tief-rgb: 91 74 38; --firma-licht: #e2bb66; --firma-licht-rgb: 226 187 102; --firma-kern: #eddab2; --hinweis: var(--koralle); --hinweis-rgb: 248 137 98; --auf-firma: #07090a; }
```
In `start.css` jedes `color-mix(in srgb, var(--firma) 55%, transparent)` → `rgb(var(--firma-rgb) / .55)`, entsprechend `--firma-tief-rgb`/`--firma-licht-rgb`/`--hinweis-rgb`; `color-mix(in srgb, var(--firma) 16%, var(--weiss))` → `rgb(var(--firma-rgb) / .16)` (auf Weiß dasselbe Ergebnis); Silbergrau-Mischungen fest: `rgba(168,164,169,.7)` (Schraffur), `.45`, `.55`, `.32`, `.3`. `rgb(r g b / a)` kann jeder Browser seit 2018. Vorschlag ans Design-System: `bundle.css` nutzt `color-mix` nur für die Ringe von `.dna-etikett__punkt::after` und `.dna-anker__punkt`; dort wäre `rgb(var(--signal-rgb) / .35)` mit einem Token `--signal-rgb` in tokens.css derselbe Schritt.

Warum · Das Leuchten in der Firmenfarbe ist das Gen, das Signature vom Rest unterscheidet (G2). Es darf nicht an einer CSS-Funktion hängen, die der Worker in einer Zeile ersetzen kann.

## Die Prüfpunkte im Einzelnen

- Umschalter (`setTimeout` 160 ms, Klassen): siehe Hebel 1. Die Choreografie selbst stimmt (Abgang 160 ms ease, Auftritt 220 ms mit der Auftrittskurve; `.ez-hero__text` wechselt nur `opacity`/`transform`, eine Ebene für 380 ms, danach weg). Die versteckte `h1` bekommt ihre `.ist-da` über `heroAuftritt` (querySelectorAll findet `display: none`), darum erscheint der Einladungstitel beim Tausch ohne Unschärfe: richtig gelöst.
- Zwei `h1` und `!important`: in der Vorlage harmlos (Barrierefreiheitsbaum enthält nur die sichtbare), für die Instanz nicht sauber; Hebel 3.
- `@starting-style` am Link-Etikett: ohne Unterstützung (Safari < 17.5, Firefox < 129) wird der At-Block verworfen, das Etikett steht sofort da; die Transition bleibt gültig. Richtige Verwendung (Übergang aus `display: none`, ohne `allow-discrete`, weil `display` selbst nicht animiert wird). Einzige Lücke: fehlt in der Ruhig-Regel (Hebel 1d).
- `localStorage`: beide Zugriffe in try/catch, Lesen synchron vor dem ersten Bild, Schlüssel `ez-modus`/`ez-muster` kollidieren mit keiner anderen Vorschau (geprüft gegen web/assets und fensterbauer-vorschau). Nur eine Vorliebe, kein Einwilligungsfall. In der Instanz entfällt der Code mit `vorlage.js`.
- Muster-Leiste trennen: heute nur über Klassen; Hebel 3. Dazu zwei kleine Folgen der Leiste: `messeGrenze` rechnet relativ zu Szene 1 und vergisst die 64 px der Muster-Leiste darüber, die Leiste kommt in der Vorlage 64 px zu früh (zwei Logos übereinander, zwischen y 730 und 794 am Telefon); in der Instanz ohne Muster-Leiste stimmt es. Bei 320 px läuft die Muster-Leiste selbst 18 px über (Text 40 + Segment 206 + Schalter 44 + Lücken 16 > 288), weil `.ez-modus.dna-pillen { flex: none; overflow: visible }` das Schrumpfen des Bausteins aufhebt; `flex: 0 1 auto` und das Wort „Muster“ unter 360 px ausblenden.
- Backdrop-Filter (10 gezählt): im Stylesheet stehen fünf Regeln in je zwei Schreibweisen (`.ez-leiste`, `.ez-adresse .dna-etikett`, `.ez-link-etikett`, `.ez-schritt__bild--foto .ez-glaschip`, `.dna-etikett` für das Bereit-Etikett am Schreibtisch); die Glas-Chips der Fotoplätze haben keinen. Je Bildschirm sind im Betrieb höchstens zwei bis drei Chips von rund 200 × 36 px aktiv, plus die Leiste (390 × 60) nur solange sie sichtbar ist. Das trägt ein Mittelklasse-Telefon ohne Einbuße; die einzige nennenswerte Fläche ist die Leiste, dafür die `visibility`-Schaltung des Vorgängers (Hebel 2b dort).
- Bühne (zwei Verläufe mit `mix-blend-mode: screen`, Maske am Gerätelicht): `.ez-buehne` ist `isolation: isolate`, nichts darin animiert nach den ersten 400 ms, keine 3-D-Transform, kein `will-change`. Chrome rastert die Mischung damit einmal in die Kacheln; je Scrollbild kostet die Bühne nichts. Teuerster Moment ist die 400-ms-Einblendung beim Laden (die Bühne wird dafür kurz zur eigenen Ebene, mitsamt Mischungen und den zwei Backdrop-Chips), und der ist in den 0,36 s enthalten. Nicht anfassen: keine scrollgebundene Bewegung, kein `will-change` auf der Bühne.
- `vector-effect: non-scaling-stroke` und Masken: auf den 20-px-Zeichen wirkungslos außer dass `1.8px` zu Bildschirm-Pixeln wird; auf der Zeichnung (viewBox 300 in 128 px) und den Ankerlinien (`preserveAspectRatio="none"`) nötig, sonst 0,8 px dünne oder verzerrte Striche. Kosten: Strichbreite im Geräteraum, einmal beim Rastern. SVG-`<mask>` gibt es nicht; die zwei CSS-Masken (`.ez-ring` 16 px, `.ez-geraet__licht`) sind statisch. Einzige Unschärfe: die Skala im Gerät (`.ez-app__skala`, Strich 1,2 × 0,42 = 0,5 px) wirkt am Schreibtisch bei 1× grau; im Mockup hinnehmbar.
- Bildgrößen und Formate: Hebel 4. Übrige Bilder passen: `modell-anthrazit` 480 px für 97–188 px Anzeige, `wand-innen` 640 px (7 kB), `modell-weiss` nur am Schreibtisch und `loading="lazy"` wie im Brief, `held.webp` 280 px für 69 px im Gerät, alle sechs Konfig-Bilder einmal geladen trotz zweier Verwendungen.
- Schriften: Outfit 32 kB ist der Latein-Teil mit 200–700, preloaded, richtig. Doto wird in `start.css` deklariert, aber kein Element verlangt `--font-punkt` (nur `.dna-zahl--punkt` in bundle.css, hier nicht benutzt); Browser laden Schriften erst bei Gebrauch, also 0 Byte. In der Instanz die Deklarationen aus `/fonts/dna.css` nehmen, nicht doppelt. Metrik-Ersatz: Vorgänger Hebel 3, offen.
- Inline-Skript gegen die CSP: Hebel 3 (`/assets/js-da.js` liegt bereit, es fehlt nur der Verweis).
- 320 px (aus dem Code): Hülle 288 px. Hero-Titel `clamp(44px, 9.5vw, 56px)` = 44 px; „Familie Weber.“ misst bei 390 px 272 px (r3z/tel-oben-einladung-muster.png), passt also auch in 288, die beiden Wörter sind durch `&nbsp;` unzertrennbar (bundle.js zerlegt bei `\s`, hält aber den Knoten dazwischen). Reihe der Elemente: 4 Spalten zu 66 px, „Faltschiebewand“ (12 px) bricht per `overflow-wrap: anywhere` mitten im Wort; unter 360 px drei Spalten (`grid-template-columns: repeat(3, 1fr)`) wären sauberer. Schritte: 128 px Bild + 120 px Text bei 14 px, eng, aber kein Überlauf. Kontaktnummer und Dashboard-Karte: Hebel 2 (bei 320 px 39 bzw. 59 px über). Muster-Leiste: 18 px über, siehe oben. Kein Querscrollen durch `overflow-x: clip`, aber was über ist, wird abgeschnitten statt gescrollt.
- 1920 px (aus dem Code): Hülle bleibt 1200, alle Schriften enden in ihrem `clamp`-Maximum, Bento 4 × 280, Reihe 8 × 129 px, Bühne 541 × 406; nichts wächst unkontrolliert. Zu bedenken für das Gremium, nicht für mich: der Hero ist bei 1920 × 1080 rund 650 px hoch (64 Muster-Leiste + 88 Kopf + 494), die weiße Szene 2 steht schon im ersten Bild (bei 1280 × 800 sind es 143 px, bei 1080 Höhe rund 430). Die Vorlagen des Inhabers füllen den ersten Bildschirm (05-switch-web, 08-crypto-dashboard). Wenn gewollt: `.ez-hero { min-height: calc(100svh - 152px); align-content: center }`, kostet nichts.

## Die drei, die am meisten bringen

1. Umschalter in der richtigen Reihenfolge und `resize` nach dem Tausch (Hebel 1): sonst reagiert der Knopf nach dem Text und die letzte Hero-Zeile verschwindet auf fast jedem Android unter dem Vorhang, genau beim ersten Antippen des Fensterbauers.
2. Telefonnummer und Kapselreihe an die Breite binden (Hebel 2): sonst fehlt bei 360 px und 12 Zeichen die letzte Ziffer der Nummer, und die Kapseln, die Signature zeigen, hängen über der Kante.
3. Marker für Zustand und Muster-Ebene plus js-da.js (Hebel 3): sonst trägt jede Kundenseite zwei `h1`, die Muster-Leiste und den Toast im DOM, läuft online ohne Auftritt und bricht ohne Skript beim Vorhang.

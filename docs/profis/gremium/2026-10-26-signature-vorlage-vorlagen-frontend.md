# Abgleich Frontend und Leistung (Tobias Lenz): Vorlage EEZI Signature, zweite Runde

Stand 26.10.2026, Vorschau docs/profis/signature-vorschau/ nach Gremium und Feinschliff (Commit 31ec201: Radios statt Knöpfe, Stapelung der zwei Hero-Zustände, Link-Etikett mit `@starting-style`). Simulierte Stimme, Messungen echt: Playwright (Chromium headless) gegen http://localhost:8790/lokal.html, Telefon 390 × 844 (dpr 2, Touch), Schreibtisch 1280 × 800, dazu 320, 360, 412 und 1920 px; Drosselung CPU 4× und für das LCP zusätzlich 1,6 Mbit/s bei 150 ms. Skripte und Probe-Korrekturen nur im Scratchpad (Anfragen abgefangen, nichts im Projekt geändert). Das erste Urteil dieser Datei (Stand vor dem Umbau) steht in Commit 31ec201.

Während der Prüfung hat eine andere Sitzung ab 21:27 Uhr die Muster-Ebene umgebaut (muster.css, muster.js, neue Muster-Leiste `.ez-ml`, `.ez-dash`, Startzustand „Einladung“). Hebel 1 habe ich gegen diesen Arbeitsstand nachgemessen; er gilt dort stärker. Was nur den Arbeitsstand betrifft, steht am Ende gesondert.

Gesamteindruck: Laufzeit und Bedienung sind jetzt auf dem Niveau der Vorlagen des Inhabers. Nach dem Laden läuft nichts mehr, Tippen antwortet in 48 bis 80 ms bei vierfach gedrosselter CPU, beim Scrollen wird nichts gerastert, und Glas liegt nur auf kleinen Flächen. Die Lücken sitzen an den Rändern: Der Vorhang kennt die Höhen nach dem Umschalten nicht, die Telefonnummer läuft am Mittelklasse-Android in den Anrufknopf, und für die Übernahme fehlt noch der Schnitt auf genau einen Zustand. Dazu fehlt ein Budget für die echten Fotos des Betriebs.

## Was schon gut ist (drei Zeilen)

1. Umschalter: echte Radios (gewählt im selben Bild, Pfeiltasten gemessen), Tausch über `transitionend` bei 171 ms, Rückfall-Uhr 240 ms, `tausche()` ist idempotent. Schneller Doppelwechsel (40 ms sowie 200/30 ms) endet immer auf dem letzten Klick, mit Deckkraft 1 und ohne hängendes `ist-wechsel`. Bei weniger Bewegung wird sofort getauscht.
2. Stapelung: Die Pille steht in beiden Zuständen gleich (713 px am Telefon, 460 px am Schreibtisch), die Höhe des Hero-Texts ist gleich (485 bzw. 470 px), Layoutsprung 0. Die versteckte Fassung ist per `visibility: hidden` aus dem Baum der Vorleser.
3. Laufzeit: Nach 2,24 s laufen 0 Animationen. Das Skript tut beim Scrollen nichts (ein rAF, keine Scroll-Bausteine). Kein Querscrollen bei 320 und 1920 px. Die Bilder wiegen 273 kB und haben alle Maße; das Desk-Modell lädt am Telefon nie, Inter ist ganz weg.

## Abgleich: was aus Runde 1 und dem Fensterbauer-Urteil noch offen ist (nicht wiederholt, nur Stand)

- Runde 1, Hebel 1 (Umschalter): Reihenfolge, Doppelklick und Regel für weniger Bewegung sind erledigt. Das Neuordnen des Vorhangs nach dem Tausch fehlt weiter, siehe Hebel 1.
- Runde 1, Hebel 2 (Zahlen-Helden bei 360 px): offen, neu gemessen, siehe Hebel 2.
- Runde 1, Hebel 3 (Marker für Zustand und Muster-Ebene, js-da.js): offen, ergänzt in Hebel 3.
- Runde 1, Hebel 4 (Bühne 720/1000): offen. Für die Vorlage ist das klein (1000 px passt zu 412 CSS-Pixeln × dpr 2,625). Entscheidend sind die Fotos der Instanz, siehe Hebel 4.
- Runde 1, Hebel 5 (`color-mix()`): offen, inzwischen drei Hof-Variablen mehr. Die Wirkung bleibt klein.
- Fensterbauer-Urteil: `innerHeight` liest weiter `documentElement.clientHeight`. Die Leiste behält ihr Backdrop, solange sie oben liegt, und es gibt keine Metrik-Ersatzschrift. Alle drei Punkte sind weiter offen und werden hier nicht neu begründet. Erledigt ist die Grenze der Leiste: Sie wird jetzt relativ zu Szene 1 gemessen.

## Hebel nach Wirkung

### 1. Vorhang nach jeder Höhenänderung neu ordnen (hoch, trifft den Kaufknopf)

Wo · `start.js`, neuer Block nach dem `innerHeight`-Block. Ursache ist `dna/bundle.js vorhang()`: `ordne()` läuft nur bei `load` und `resize`.

Was ist · Beide Schalter der Vorlage ändern Szenenhöhen, aber `--dna-szene-oben` bleibt auf dem alten Wert. Die Szene klebt dadurch zu früh, und die nächste deckt ihr Ende zu, bevor es je im Bild war. Gemessen wurde in einem Raster von 10 px über die ganze Seite. Gezählt sind Positionen, an denen das Element voll sichtbar und oberstes ist:
- Telefon, Start „Website“, dann „Einladung“: Szene 4 wächst von 1722 auf 1962 px, der Wert bleibt −878 statt −1118. „Fenster planen“ in der Bereit-Karte ist danach an 0 statt 32 Positionen erreichbar, „Kostenlos und unverbindlich“ an 0 statt 22.
- „Etiketten“ an: Szene 2 wächst um 648 px (Telefon) bzw. 344 px (Schreibtisch). Die Reihe der Elemente und Foto 6 kommen auf beiden Geräten nie ins Bild.
- Im Arbeitsstand von 21:30 Uhr betrifft das jeden, der von Plus herüberwechselt (Start „Website“) und dann „Einladung“ wählt. Mit Etiketten liegt Szene 4 um 718 px (Telefon) bzw. 530 px (Schreibtisch) daneben, die Bereit-Pille ist auf beiden Geräten unerreichbar.

Wie · In `start.js`:
```js
  /* Vorhang neu ordnen, sobald eine Szene ihre Höhe ändert (Umschalter, Etiketten, Schrift, Bilder); bundle.js ordnet nur bei load und resize */
  if ('ResizeObserver' in w) {
    var ordnen = false, hoehen = new ResizeObserver(function () {
      if (ordnen) return; ordnen = true;
      w.requestAnimationFrame(function () { ordnen = false; w.dispatchEvent(new Event('resize')); });
    });
    Array.prototype.forEach.call(d.querySelectorAll('.dna-szene'), function (s) { hoehen.observe(s); });
  }
```
Eingespielt und gemessen: Die Bereit-Pille ist wieder an 32 Positionen erreichbar (Telefon, Einladung), die Reihe an 17 (Telefon) bzw. 26 (Schreibtisch), und nach dem Zurückschalten gilt wieder der Ausgangswert. Eine Schleife entsteht nicht: `ordne()` setzt nur eine Variable, die Höhe der Szene ändert sich dadurch nicht. Vorschlag ans Design-System: Derselbe Beobachter gehört in `vorhang()` und ruft `ordne` direkt auf. Dann braucht es kein künstliches `resize`, und jede Seite mit Vorhang ist geschützt.

Warum · Die Bereit-Karte ist der zweite Kaufknopf der Seite. Der Fensterbauer testet zuerst den Umschalter, scrollt dann nach unten und findet den Knopf nicht: Genau die neue Signature-Funktion lässt die Seite dann kaputt wirken. In der Instanz fängt der Beobachter zusätzlich den Schrifttausch und nachladende Bilder ab.

### 2. Zahlen-Helden an der Kante: Telefonnummer im Anrufknopf, Dashboard-Karte abgeschnitten (hoch, trifft jede Instanz)

Wo · `start.css`: `.ez-kontakt__held-text b` (`clamp(36px, 10vw, 44px)`, `white-space: nowrap`, ab 900 px 56 px), `.ez-kontakt__held` (Spalten `1fr 44px`, Lücke 12) sowie `.ez-stand__wert` (Flex ohne Umbruch).

Was ist · Gemessen wurde die Breite des Nummerntexts gegen die linke Kante des runden Knopfs. Positive Werte heißen, der Text liegt über dem Knopf:

| Breite | Nummer | heute | mit Korrektur |
| --- | --- | --- | --- |
| 320 | 0221 123456 | 44 px über dem Knopf | 26 px Schrift, 14 px Luft |
| 360 | 0221 123456 | 4 px über dem Knopf | 31,7 px, 20 px Luft |
| 360 | 02203 1234567 | 45 px über dem Knopf | 26,9 px, 19 px Luft |
| 390 | 0221 123456 | passt knapp | 36,7 px, 22 px Luft |
| 412 | 02203 1234567 | 28 px über dem Knopf | 34,1 px, 20 px Luft |
| 1280 | 02203 1234567 | 7 px über dem Knopf | 50,9 px, 28 px Luft |

Die Dashboard-Karte (`.ez-stand`, Einladungszustand) ragt bei 320 px 58 px über den Inhaltsrand der Route; 34 px davon schneidet `overflow: hidden` der Route ab. Bei 360 px ragt sie 18 px in den Innenabstand. Echte Nummern haben meist 12 oder 13 Zeichen.

Wie · An das Ende von `start.css`, gemessen wie in der Tabelle:
```css
.ez-kontakt__held { container-type: inline-size; }
.ez-kontakt__held-text b { font-size: clamp(36px, 10vw, 44px); font-size: clamp(26px, calc((100cqi - 56px) / (var(--tel-zeichen, 11) * .55)), 44px); }
@media (min-width: 900px) { .ez-kontakt__held-text b { font-size: 56px; font-size: clamp(26px, calc((100cqi - 56px) / (var(--tel-zeichen, 11) * .55)), 56px); } }
.ez-stand__wert { flex-wrap: wrap; gap: 8px 12px; }
```
Die erste Angabe ist jeweils der Rückfall für Browser ohne `cqi`. Die Instanz setzt `style="--tel-zeichen: 13"` an `<a class="ez-kontakt__held">` (`String(tel).length`; Inline-Stil ist durch `style-src 'unsafe-inline'` gedeckt). 0,55 em je Zeichen ist gemessen: Outfit 250/300 braucht 0,525 bis 0,532 em, der Rest ist Luft.

Warum · 360 bis 412 CSS-Pixel sind die Breiten der Mittelklasse-Androiden, an denen die Vorlage gemessen wird. Die Nummer ist der Held der Kontaktkarte und die Kapselreihe das Signature-Merkmal im Hauptteil; keins von beiden darf als Erstes brechen.

### 3. Genau ein Zustand je Auslieferung, sauberer Kopf, keine Muster-Reste (hoch für die Übernahme)

Wo · `index.html` (alle `.ez-nur-web`/`.ez-nur-einladung`, Muster-Leiste, `.ez-muster`, `.ez-toast`, Kopf), `start.css` (Block „Zwei Zustände“ ab `.ez[data-modus="website"] .ez-nur-einladung:not(…) { display: none !important }`, `.ez.ist-geschaltet`, Muster-Abschnitte), `start.js` (Umschalter, `ZIELE` mit dem Toast), `functions/instanz/seiten.js` (`kopf()` setzt `theme-color` auf `#161616`).

Was ist · Die Vorlage trägt beide Zustände im DOM: zwei `h1`, zwei Kicker, zwei Fakten-Listen und so weiter. Würde der Server nur `data-modus` setzen, stünde im indexierten Website-Zustand „Guten Tag, Familie Weber.“ als versteckte zweite `h1` im HTML. Sechs der 15 Auftritt-Elemente im Hero (vier davon Wörter mit Weichzeichner) laufen dann auf unsichtbaren Knoten. Für die Pille kostet die Stapelung fast nichts: Am Telefon hebt sie sich in der Ein-Zustands-Fassung um 0 px, am Schreibtisch im Einladungszustand um 24 px. Der Grund für den Schnitt sind also DOM, Suchmaschine und die Klarheit des Codes. Das `!important` ist ohnehin überflüssig, weil der Selektor mit (0,4,0) jede andere `display`-Regel der Seite schlägt.

Das größte Risiko ist der Toast: `start.js` fängt jedes `a[href="#"]` ab und zeigt „Muster: Hier öffnet sich die Anfahrt zu Ihrem Betrieb.“. Bleibt bei einem Betrieb ohne Website oder ohne Kartenlink ein `href="#"` stehen, sieht ein echter Kunde diesen Satz.

Zum Kopf: `index.html` ist ein Fragment (kein doctype, kein charset, kein viewport, `lang` an `<main>`). Das Inline-Skript blockiert online `script-src 'self'`; die Instanzen erben das über `SICHERHEIT` aus seo.js. `kopf()` würde `theme-color` auf die alte Farbe `#161616` setzen. Ohne Angabe zeigt Android-Chrome im hellen Modus eine weiße Adressleiste über `#07090a`, und die Seite wirkt dann nicht wie eine App.

Wie · Marker in der Vorlage (wie in Runde 1 benannt): `<!--vorlage-->…<!--/vorlage-->` um Muster-Leiste, jedes `.ez-muster`, `.ez-toast` und die Platzhalter der Fotos; `<!--nur:web-->…<!--/nur:web-->` und `<!--nur:einladung-->…<!--/nur:einladung-->` um jedes zustandsgebundene Element. Im Worker, mit Funktion ersetzt nach K1.11:
```js
/* Landingpage der Instanz: genau ein Zustand, keine Muster-Ebene */
export function landingZustand(html, zustand) {
  const weg = zustand === 'einladung' ? 'web' : 'einladung';
  return String(html)
    .replace(/<!--vorlage-->[\s\S]*?<!--\/vorlage-->\n?/g, () => '')
    .replace(new RegExp('<!--nur:' + weg + '-->[\\s\\S]*?<!--\\/nur:' + weg + '-->\\n?', 'g'), () => '')
    .replace(/<!--\/?nur:(web|einladung)-->/g, () => '')
    .replace(/data-modus="(website|einladung)"/, () => 'data-modus="' + (zustand === 'einladung' ? 'einladung' : 'website') + '"');
}
```
In der Instanz entfallen in `start.css` der Block „Zwei Zustände“ bis einschließlich `.ez.ist-wechsel .ez-hero__text`, alle Regeln mit `.ez.ist-geschaltet`, `.ez[data-modus="website"] .ez-link-etikett` und die Muster-Abschnitte. `data-modus` bleibt als Haken für `.ez-route__stelle--stand`, `@starting-style` am Etikett ebenfalls (Erscheinen nach der Überschrift). In der Vorlage `!important` streichen. In `start.js` laufen in der Instanz der Radio-Block und der `ZIELE`/Toast-Block nicht mit. Der Server entfernt jedes Ziel ohne Wert samt `<li>` (Website, Anfahrt), statt `href="#"` stehen zu lassen.

Kopf:
```html
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#07090a">
<style>html,body{background:#07090a}</style>
<script src="/assets/js-da.js"></script>
```
`js-da.js` liegt bereit und ist auf /fuer-fensterbauer/ schon eingebunden. `claude:viewport-fit-sides` streichen. In `kopf()` die Farbe für diese Seite übergeben (`o.themeFarbe || '#161616'`). Der Einladungszustand bekommt nie `o.index`; `no-store` gilt dort ohnehin. Prüfsuite für die Instanz: genau ein `<h1`, kein `href="#"`, kein `ez-muster`, `ez-ml`, `data-vorlage=` oder `Muster:`.

Warum · Der Inhaber will je Betrieb genau einen Zustand. Was der Worker nicht wegschneidet, landet bei jedem Kunden im DOM, und ein Muster-Satz vor einem echten Kunden kostet mehr Vertrauen als jeder Layoutfehler.

### 4. Fotos des Betriebs: Budget, Breiten, Maße (hoch für echte Betriebe, null für die Vorlage)

Wo · `web/assets/zentrale.js` (Zuschnitt der Startfotos: 16:9, `Math.min(1600, …)`, JPEG 0,8), `functions/instanz/verwalten.js` (`BILD_NAME`, `bildAblegen` bis 2 MB, keine Maße), im Markup die Bühne `img.ez-buehne__foto` (data-foto="1"), das Bento (data-foto="2…6"), das Logo (`data-vorlage="firma.logo"`, heute ein SVG im Markup) und der Preload im Kopf.

Was ist · Die Vorlage misst 273 kB; das LCP-Element ist das Bühnenfoto (100 kB WebP, im gedrosselten Profil bei 2,47 s, FCP 2,14 s). Ein echter Betrieb bekommt `start-1…6` als JPEG mit 1600 × 900 px, je nach Motiv etwa 200 bis 400 kB. Foto 1 ersetzt die Bühne, die Fotos 2 bis 6 würden nach Punkt 9 des Briefs sofort laden; im Arbeitsstand steht das Foto-Bento auch ohne Etiketten. Am Telefon werden höchstens 380 CSS-Pixel gezeigt (rund 1000 Gerätepixel bei dpr 2,625), am Schreibtisch 540. Sechs Fotos zu etwa 300 kB machen rund 1,8 MB statt 273 kB: bei 10 Mbit/s etwa 1,2 s Leitung mehr, im gemessenen 1,6-Mbit-Profil eher 8 s. Das Logo als `<img>` ohne Maße verschiebt Kopf und Leiste, sobald es lädt; heute ist der Layoutsprung 0, weil das Logo ein Inline-SVG ist.

Wie ·
- In zentrale.js den Zuschnitt auf 1200 px begrenzen und zusätzlich eine Fassung mit 720 px ablegen (Name `start-N-720.jpg`; `BILD_NAME` um `start-[1-6](?:-720)?` erweitern, die Startliste ignoriert `-720`). WebP, wo der Browser es kodiert, sonst JPEG 0,78 (`blob.type === 'image/webp'` prüfen).
- Budget in `bildAblegen`, vor `ab.ablegen(…)`: `if (/^start-\d$/.test(name.replace(/\.[a-z]+$/, '')) && u.length > (name.startsWith('start-1.') ? 200000 : 140000)) throw new ApiFehler('Startfoto zu groß für die Startseite (Foto 1 höchstens 200 kB, die übrigen 140 kB).', 413);`
- Bühne (alle Startfotos sind 16:9, die Maße stehen damit fest):
```html
<link rel="preload" as="image" href="/marke/7/start-1.jpg" imagesrcset="/marke/7/start-1-720.jpg 720w, /marke/7/start-1.jpg 1200w" imagesizes="(min-width: 900px) min(540px, 43vw), (min-width: 760px) calc(100vw - 96px), calc(100vw - 32px)" fetchpriority="high">
<img class="ez-buehne__foto" src="/marke/7/start-1.jpg" srcset="/marke/7/start-1-720.jpg 720w, /marke/7/start-1.jpg 1200w" sizes="(min-width: 900px) min(540px, 43vw), (min-width: 760px) calc(100vw - 96px), calc(100vw - 32px)" width="1200" height="675" alt="" fetchpriority="high" decoding="async">
```
- Bento: dieselben zwei Breiten, `width="1200" height="675" loading="eager" fetchpriority="low" decoding="async"`. Kleine Kacheln mit `sizes="(min-width: 760px) min(270px, 23vw), calc(50vw - 22px)"`, große mit `sizes="(min-width: 760px) min(540px, 46vw), calc(100vw - 32px)"`.
- Logo: Die Zentrale macht daraus ein PNG mit bis zu 600 px. Die Maße liest man beim Ablegen aus dem IHDR: `const pngMass = (u) => (u.length > 24 && u[0] === 0x89 && u[1] === 0x50) ? [((u[16] << 24) | (u[17] << 16) | (u[18] << 8) | u[19]) >>> 0, ((u[20] << 24) | (u[21] << 16) | (u[22] << 8) | u[23]) >>> 0] : null;`. Im Entwurf neben `bilder` ablegen, im Markup `<img class="ez-logo__bild" src="/marke/7/logo.png" width="W" height="H" alt="">` und in CSS `.ez-logo__bild { height: 36px; width: auto; }`.

Warum · Mit Platzhaltern ist die Vorlage schnell; mit echten Fotos würde sie es nicht bleiben. Die Bühne ist das LCP-Bild, und am Mittelklasse-Android im Mobilnetz entscheidet sie, ob sich die Seite wie die Vorlagen-Apps anfühlt.

### 5. Beim Umschalten nur tauschen, was sich ändert (mittel, Vorlage)

Wo · `start.css` Zeile 502/503 (`.ez-hero__text { transition … }`, `.ez.ist-wechsel .ez-hero__text { opacity: 0; … }`), dazu `start.js` der `transitionend`-Lauscher am Hero-Text.

Was ist · Beim Wechsel geht der ganze Hero-Text aus, also auch „Fenster planen“, „So geht es“ und die Unterschrift. Gemessen: Deckkraft 0,19 bei 55 ms, 0 bei 155 ms, 0,4 bei 205 ms, voll erst bei etwa 350 ms. Die Pille blinkt, obwohl sie dank Stapelung an derselben Stelle steht und sich nicht ändert. In den Vorlagen (Segment-Schalter in Apps) bleibt die Aktion stehen und nur der Inhalt wechselt. Die Regel aus emil-design-eng lautet: Was sich nicht ändert, wird nicht animiert.

Wie · Die zwei Regeln in Zeile 502/503 streichen und dafür einsetzen:
```css
/* Wechsel: nur, was sich ändert, geht 160 ms aus (6 px tiefer) und kommt 220 ms wieder; Pille, Unterschrift und Bühne stehen */
.ez.ist-geschaltet :is(.ez-hero__text, .ez-brief) > :is(.ez-nur-web, .ez-nur-einladung) { transition: opacity 220ms var(--dna-auftritt), transform 220ms var(--dna-auftritt); }
.ez.ist-wechsel :is(.ez-hero__text, .ez-brief) > :is(.ez-nur-web, .ez-nur-einladung) { opacity: 0; transform: translate3d(0, 6px, 0); transition-duration: 160ms; transition-timing-function: var(--dna-druck); }
```
In den Block für weniger Bewegung: `.ez.ist-geschaltet :is(.ez-hero__text, .ez-brief) > :is(.ez-nur-web, .ez-nur-einladung) { transition: none; }`. In `start.js`:
```js
    heroText.addEventListener('transitionend', function (e) { if (e.propertyName === 'opacity' && e.target.tagName === 'H1') tausche(); });
```
Die Spezifität (0,4,0) schlägt die Auftritts-Übergänge (Verzögerung `--i` × 70 ms), daher kein Nachlauf. Eingespielt und gemessen: Der Hero-Text-Container bleibt bei 1, die `h1` geht von 1 auf 0 (157 ms) und wieder auf 1, getauscht wird bei 174 ms über `transitionend` der `h1`. Die Pille hat weder Bewegung noch Ausblenden, der Doppelwechsel endet sauber.

Warum · Der Umschalter ist das Erste, was der Fensterbauer antippt. Wenn dabei der Kaufknopf mitblinkt, wirkt der Wechsel wie ein Neuladen statt wie ein Zustandswechsel.

## Die Prüfpunkte im Einzelnen

- **Umschalter mit Radios:** siehe „Was schon gut ist“, Zeile 1. Ohne JavaScript zeigt der Commit den Website-Zustand, wie im Brief verlangt. Das Radio „Einladung“ lässt sich aber anwählen und erscheint per `:has()` als gewählt, während die Seite bleibt, wie sie ist. Ein Satz CSS behebt das: `html:not(.ez-js) .ez-modus, html:not(.ez-js) .ez-schalter { display: none; }`.
- **Stapelung in einer Grid-Zeile:** Sie hält, Layoutsprung 0, Pille in beiden Zuständen gleich. `:not()` mit Liste und komplexem Argument läuft ab Chrome 88, Safari 9 und Firefox 84. `visibility: hidden` nimmt die zweite Fassung auch aus dem Baum der Vorleser. `!important` ist unnötig. Für die Instanz siehe Hebel 3.
- **`transition: display … allow-discrete` und `@starting-style`:** Chrome ab 117, Safari 17.4 (`transition-behavior`) bzw. 17.5 (`@starting-style`), Firefox ab 129. Ohne Unterstützung fällt die ganze `transition`-Kurzschrift weg, weil das Schlüsselwort unbekannt ist. Das Etikett erscheint und verschwindet dann hart, ohne Fehler und ohne Sprung (absolut gesetzt); in Safari 17.4 erscheint es ohne Einblenden. Beides ist hinnehmbar.
- **Puls:** einmal 700 ms. Laufende Animationen: 47 bei 283 ms, 0 ab 2,24 s. Nach einem Wechsel bleibt `ez-puls` als „finished“ in `getAnimations()`, weil `both` die Endwerte festhält. Anfangs- und Endbild gleichen dem Grundwert, also `animation: ez-puls 700ms var(--dna-auftritt) 1320ms 1 backwards;`, dann verschwindet sie ganz. Der Puls auf `box-shadow` zeichnet 42 Bilder auf 28 px in der eigenen Backdrop-Ebene des Etiketts, das ist vernachlässigbar.
- **`:has()` an den Radios:** Chrome 105, Safari 15.4, Firefox 121. Ohne `:has()` zeigt das Segment gar keine Wahl, weil das Input auf `opacity: 0` steht. Rückfall (nicht gemessen, kein solcher Browser greifbar): `@supports not selector(:has(*)) { .ez-modus input { position: static; width: 16px; height: 16px; opacity: 1; accent-color: var(--hinweis); } .ez-modus label::before { content: none; } }`. Das betrifft nur die Vorlage.
- **backdrop-filter:** fünf Regeln. Die Leiste hat 12 px, Domain- und Link-Etikett 14 px mit `saturate(160%)`, der Glas-Chip in Szene 3 12 px, das Bereit-Etikett 16 px (nur am Schreibtisch sichtbar). Gleichzeitig sind höchstens drei aktiv (Hero im Einladungszustand plus die Leiste beim Hochscrollen). Bei 412 CSS-Pixeln und dpr 2,625 sind das rund 260 000 Gerätepixel, knapp zwei Drittel davon in der Leiste. Die Muster-Etiketten haben zu Recht kein Glas. Für ein Mittelklasse-Telefon ist das tragbar. Offen bleibt nur die Leiste, solange sie oben liegt (Fensterbauer-Urteil).
- **`mix-blend-mode`:** zwei Stellen im Hero (Schein und Lichtkreuz) und fünf in den Platzhaltern des Bento. Alle liegen in statischen Ebenen ohne eigenes Compositing und werden einmal gerastert. Die Scrollgeste über die ganze Seite bei vierfacher Drossel ergab 398 Bilder, Median 16,7 ms, 0 über 33 ms, mit und ohne Glas gleich. Die Messung ist headless mit Software-Compositing, also nur grob, aber ohne Ausreißer. Daraus folgt eine Regel: In der Bühne nichts animieren, was keine eigene Ebene hat; das Etikett mit Backdrop ist eine.
- **Punktraster mit Maske:** zwei Stellen (Zeit-Kachel, Kontakt), beide statisch und einmal gerastert, mit einer wiederholten Kachel von 9 px. Kein Hebel.
- **Layoutsprung:** Beim Laden 0, lokal wie im gedrosselten Profil. Beim Umschalten springt der Hero um 0 px. Der Rest der Seite ändert seine Höhe außerhalb des Bilds, das betrifft den Vorhang (Hebel 1).
- **Reaktionszeit:** Bei vierfacher Drossel antwortet der Umschalter in 48 ms, „Etiketten“ in 80 ms (Event Timing). Beim Laden gibt es zwei lange Aufgaben (63 und 68 ms), Stil 191 ms, Layout 79 ms, Skript 20 ms.
- **Bilder:** 15 Dateien, 273 kB, alle mit Maßen. `modell-sprosse` hat 800 px für höchstens 190 CSS-Pixel am Telefon; mit 560 px wären es 36 statt 54 kB (klein). Lazy ist nur `modell-weiss`; es steckt am Telefon in `display: none` und lädt dort nie. Für echte Fotos siehe Hebel 4.
- **Inline-Skript gegen die CSP:** wird online blockiert; `/assets/js-da.js`, siehe Hebel 3. Die zwei Inline-`<style>` und die `style="--i"`-Attribute deckt `'unsafe-inline'`.
- **320 px:** kein Querscrollen. Die Pille liegt im Commit bei 669 px, also bei 640 px Höhe unter der Falz; das liegt nur an der Muster-Leiste (128 px), ohne sie wären es 541 px. Nummer und Dashboard-Karte siehe Hebel 2.
- **Etiketten bei 320 px:** „Ihr Logo“ liegt über dem Anrufknopf und „Ihr Text“ über dem Kicker.
- **Etiketten ab 760 px:** „Ihr Logo, Ihre Farbe, Ihr Zeichen“ bricht in drei Zeilen aus dem Chip (26 px Chip, 41 px Inhalt; zu sehen in r5z/desk-oben-einladung-muster.png). Ursache ist `.ez-ab-desk { white-space: normal }` im absolut gesetzten Chip ohne verfügbare Breite. Gemessene Korrektur: einzeilig, keine Überdeckung bei 320; „Ihr Logo“ berührt dort das Domain-Etikett um etwa 4 px.
```css
@media (min-width: 760px) { .ez-ab-desk { white-space: inherit; } }
.ez .ez-muster { width: max-content; gap: 0; }
.ez .ez-muster::before { margin-right: 7px; }
@media (max-width: 419px) { .ez .ez-muster--geraet { left: 46px; top: calc(100% - 4px); translate: none; } .ez .ez-muster--text { top: auto; bottom: -34px; right: 0; } }
```
- **1920 px:** kein Querscrollen, die Hülle hat 1104 von 1200 px, die Pille liegt bei 460 px, nichts wächst ungebremst. Dass Szene 2 ab 706 px im ersten Bild steht, ist eine Frage ans Gremium aus Runde 1 und wird hier nicht wiederholt.

## Arbeitsstand während der Prüfung (21:27 bis 21:45 Uhr, andere Sitzung)

- **Messwerkzeug:** `lokal.html` (21:03) hinkt `index.html` (21:27) hinterher. Wer mit ihr misst, bekommt altes Markup mit neuem start.js; der Schalter „Etiketten“ tut dort nichts mehr, weil seine Logik nach muster.js gewandert ist. `lokal.html` muss neu erzeugt werden, bevor gemessen wird.
- **Ohne JavaScript:** Das Markup startet jetzt mit `data-modus="einladung"`. Ohne JavaScript zeigt die Vorlage damit den Einladungszustand; der Brief verlangt dafür den Website-Zustand.
- **Vorhang:** `.ez-dash` (nur mit Etiketten) verlängert Szene 4 zusätzlich, Hebel 1 wird damit dringender.
- **Muster-Leiste (Stand 21:30):** Sie war am Telefon 226 px hoch, die Pille lag bei 811 bis 863 px und ragte bei 844 px Höhe über den Rand. Ihre zwei Zustandszeilen sind verschieden lang, deshalb sprang die ganze Seite beim Umschalten um 16 px. Dieselbe Stapelung wie im Hero hält sie konstant (gemessen mit der gleichwertigen Fassung über eine angehängte Regel: 246 → 246 px statt 244 → 228 px): in den vier vorhandenen `:is(.ez-hero__text, .ez-brief)` `.ez-ml__text` ergänzen, dazu `.ez-ml__text > * { grid-column: 1; } .ez-ml__text > .ez-ml__zeile { grid-row: 3; } .ez-ml__text > .ez-ml__legende { grid-row: 4; }`.
- **Muster-Leiste (Stand 21:45):** Die Zeile ist am Telefon ausgeblendet. Richtwert für das Telefon: Muster-Leiste höchstens 150 px, damit die Pille im ersten Bild bleibt.

## Vorschläge ans Design-System (bundle.js, nicht selbst geändert)

- **`vorhang()`:** `ResizeObserver` auf jede `.dna-szene`, Rückruf `requestAnimationFrame(ordne)`. Das ist die Wurzel von Hebel 1.
- **`woerter()`:** vor dem Zerlegen `el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim())` und an jedes `span.dna-wort` `aria-hidden="true"`, wie es SplitText (GSAP) von sich aus tut. Inline-Block-Wörter liest VoiceOver sonst teils Wort für Wort als eigene Elemente. Nur für Überschriften (`h1` bis `h3`); an einem `<p>` ist `aria-label` nicht erlaubt.

## Die drei, die am meisten bringen

1. Vorhang nach Höhenänderung neu ordnen (Hebel 1). Sonst ist „Fenster planen“ in der Bereit-Karte nach „Einladung“ oder „Etiketten“ an keiner Scrollposition erreichbar, und das genau beim Fensterbauer, der Signature ausprobiert.
2. Telefonnummer und Dashboard-Karte an die Breite binden (Hebel 2). Sonst liegt bei 360 bis 412 px und einer 13-stelligen Nummer die Zahl 28 bis 45 px im Anrufknopf, und die Kapselreihe wird bei 320 px abgeschnitten.
3. Ein Zustand je Auslieferung samt Kopf und ohne Toast (Hebel 3), danach das Foto-Budget (Hebel 4). Sonst sieht ein echter Kunde „Muster: …“, Suchmaschinen sehen eine versteckte zweite `h1`, und die echten Fotos machen aus 273 kB rund 1,8 MB.

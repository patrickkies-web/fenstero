# Feinschliff Bewegung (Noah Brandner): Vorlage der Landingpage „EEZI Signature“

**Gesamteindruck.** Die Grundlage sitzt: kein `transition: all`, keine Keyframes, kein ease-in, nur Transform, Opazität und Farbe, Hover nur hinter `(hover: hover) and (pointer: fine)`, Druck sofort auf scale(.97)/.94 und 220 ms zurück, Leiste 320 ms hin und 220 ms weg mit 24 px Hysterese, Toast 220 ms auf und 160 ms ab, `will-change` nur, solange die Wörter unscharf sind. Die Zeitlupe des Hero (hero-0000 … 1600, alles CSS, die Verlangsamung greift) zeigt den Takt wie vorgesehen: Bühne 0–400 ms, Punkt und Linie 0–200, Domain-Text 100–400, Kicker und erstes Wort ab 420 (Wörter 420/490/560/630 ms plus 560 ms, aus 6 px Unschärfe), Brief und Meta 700–1260, Pille 840–1320 ms mit 24 px Weg und scale(.985); hero-1400 und hero-1600 sind identisch, ab 1,32 s steht alles, die Pille kommt zuletzt, Domain-Etikett (bis 400) und Überschrift (ab 420) überschneiden sich nicht. Was fehlt, ist die Signature-Schicht selbst: Der Umschalter meldet den gedrückten Zustand erst nach 160 ms, das Link-Etikett verschwindet hart, das Muster-Etikett im Link-Etikett nimmt Platz, und am Telefon springt der Rest der Seite beim Tausch um 24 px.

| Nr | Wo | Was ist | Wie | Warum | Wirkung |
| --- | --- | --- | --- | --- | --- |
| 1 | start.js, Umschalter: `setzeModus` setzt `aria-pressed` erst im `setTimeout(…, 160)` | Nach dem Klick auf „Mit Einladungslink“ bleibt „Über die Website“ 160 ms lang weiß; der gedrückte Knopf bekommt seine Füllung erst, wenn der Hero-Text schon weg ist. Das scale(.97) ist da, der Zustand nicht | `aria-pressed` sofort im Click setzen (Funktion `markiere`), nur `data-modus` bleibt im Timer; Code unter „Werte“ | Rückmeldung am gedrückten Element innerhalb von 100–160 ms; Zustand zeigen, wo gedrückt wurde | hoch |
| 2 | start.css `.ez[data-modus="website"] .ez-nur-einladung { display: none !important }` trifft `.ez-link-etikett`; `@starting-style` nur für den Auftritt | Auftritt 320 ms aus 6 px (richtig eingesetzt, `display: none` → sichtbar löst `@starting-style` aus), Abgang gibt es nicht: beim Wechsel zurück auf „Website“ verschwindet das Glas-Etikett am Gerät im selben Bild. Am Telefon ebenso der Chip `.ez-muster--geraet` (`display: none` im Einladungszustand) | Etikett aus der `!important`-Regel nehmen und `display` mit `allow-discrete` in die Transition: 160 ms aus auf `--dna-druck`, dann erst `display: none`; Chip über Opazität statt `display`; CSS unter „Werte“ | Nichts erscheint aus dem Nichts, nichts verschwindet ins Nichts; Abgang kürzer als Auftritt (160 < 320) | hoch |
| 3 | start.css `.ez-muster--innen { position: static; display: none … }`, `.ez.ist-muster .ez-muster--innen { display: inline-flex }` | Der Chip „Einladungslink · nur Signature“ steht als dritte Zeile im Link-Etikett: Beim Schalter „Zeigen, was Ihres ist“ wächst das Etikett ohne Übergang um 24 px nach oben (muster-mitte: Etikett schon groß, die anderen Chips noch halb), beim Ausschalten springt es zurück; `transition: none` | Chip wie alle anderen absolut setzen, oben rechts am Etikett hängend (`bottom: calc(100% + 6px)`), Auftritt und Abgang über die gemeinsame `.ez-muster`-Regel (220/160 ms); CSS unter „Werte“ | Etiketten nehmen keinen Platz; nur Transform und Opazität, nie Höhe | mittel |
| 4 | start.css Hero-Paare `.ez-nur-web`/`.ez-nur-einladung` in `.ez-hero__text` und `.ez-brief` über `display: none` | Der Hero-Text ist im Einladungszustand 24 px höher (Pille 678 → 702 px, gemessen). Am Telefon rutscht beim Tausch alles unter dem Hero um 24 px, sichtbar an der runden Kante von Szene 2 und bei jeder Höhe über 844 px; am Schreibtisch fängt `align-items: center` es ab | Beide Zustände je Zeile in dieselbe Grid-Zeile legen (`grid-row`), die verborgene Fassung mit `visibility: hidden` statt `display: none`; die Zeile nimmt die höhere Fassung, die Pille steht in beiden Zuständen bei 702 px; CSS unter „Werte“ (die Sätze in Zeit-, Bereit- und Kontakt-Karte dürfen hart tauschen, sie liegen beim Schalten nie im Bild) | Layoutsprung 0, auch beim Wechsel; das gedrückte Element und die Seite darunter bewegen sich nicht | mittel |
| 5 | start.js Umschalter: `setTimeout(…, 160)` neben `transition-duration: 160ms` in start.css; `if (m === wurzel.getAttribute('data-modus')) return;`; Abgang mit `ease` | Zwei Uhren für einen Übergang: Der Tausch hängt am Timer, nicht am Ende des Ausblendens (modus-mitte-1 zeigt deshalb den neuen Text schon voll, während die Knöpfe noch wechseln). Wer binnen 160 ms auf den alten Knopf zurückklickt, wird ignoriert, der Tausch läuft trotzdem. Der Abgang nutzt `ease` statt der Druckkurve | Tausch bei `transitionend` (opacity) mit Rückfall-Timer 240 ms; Ziel in einer Variable merken und gegen sie prüfen; `.ez.ist-wechsel .ez-hero__text { transition-timing-function: var(--dna-druck) }`; Code unter „Werte“ | Transitionen sind unterbrechbar, der Zustand folgt dem letzten Klick; Auftritt und Abgang auf ease-out | mittel |
| 6 | index.html `.ez-meta` (`--i:10`), `.ez-kicker` (`--i:6`) | Meta-Zeile (unter der Pille) steht ab 700 ms, die Pille darüber kommt erst ab 840: hero-0800 zeigt 200 ms lang ein Loch zwischen Unterschrift und „Kostenlos“, in das die Pille von unten einfährt. Kicker und erstes Wort starten gleichzeitig | Meta auf `--i:12` mit `transition-duration: 480ms` (840–1320, im Takt der Pille, ohne Weg), Kicker auf `--i:5` (350–910, eine Stufe vor der Überschrift); Hero steht weiter bei 1,32 s | Stagger folgt der Leserichtung; nichts erscheint unter einer Lücke | klein |
| 7 | start.css `@media (prefers-reduced-motion: reduce) { .ez-leiste, .ez-muster, .ez-toast { transition: none } }` (Zeile 449, vor den Signature-Blöcken) | Leiste, Chips und Toast schnappen hart; das Link-Etikett ist nicht erfasst und gleitet unter „weniger Bewegung“ weiter 6 px und 320 ms; Hover-Skalierung (1.04) und Rückweg der Knöpfe laufen weiter | Block ans Ende der Datei, Opazität behalten, Ort streichen: Leiste über Opazität 220/160 ms, Chips und Toast nur `opacity`+`visibility`, Link-Etikett 160 ms Opazität und `@starting-style` ohne Transform, Knöpfe `transition-duration: 0s`; CSS unter „Werte“ | Reduzierte Bewegung heißt keine Ortsänderung, Opazität bleibt zum Verstehen | klein |
| 8 | start.css `.ez-schalter[aria-pressed="true"] { background: var(--anthrazit); box-shadow: inset 0 0 0 1.5px var(--anthrazit) … }` auf `.ez-musterleiste { background: var(--anthrazit) }` | Der Zustand „an“ wird in 220 ms zur Fläche der Leiste: In muster-ende ist von der Pille nur noch Punkt und Text übrig, der Knopf liest sich als ausgeschaltet. Der Übergang sagt „löst sich auf“, nicht „ist an“ | Füllung Schwarz mit leisem Ring: `background: var(--schwarz); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.18), inset 0 1px 0 rgba(255,255,255,.1)`; der Koralle-Punkt bleibt der Hinweis | Zustandswechsel muss als Zustand lesbar sein, auch nach dem Übergang | klein |
| 9 | start.css `.ez-kontakt__held:hover .ez-kontakt__held-knopf { scale(1.04) }`, `.ez-kontakt__held:active { scale(.985) }` | Beim Drücken der Telefonkarte schrumpft die Karte, der weiße Knopf bleibt auf 1.04 vergrößert: zwei Richtungen im selben Druck | `.ez-kontakt__held:active .ez-kontakt__held-knopf { transform: scale(.96); transition-duration: 0s; }` (hinter die Hover-Regel) | Jedes gedrückte Element antwortet in eine Richtung | klein |
| 10 | start.css `.ez a { -webkit-tap-highlight-color: transparent }` | Nur Links sind abgedeckt; `button.ez-schalter`, `.ez-modus button` und `.ez-rund` (sofern `button`) blitzen auf iOS beim Tippen grau, bevor das scale(.97) kommt | `.ez a, .ez button { -webkit-tap-highlight-color: transparent; }` | Das Druckfeedback ist die Rückmeldung, nicht der Systemblitz | klein |

## Werte zum Übernehmen

**Nr. 1 und 5, start.js (ersetzt den Block „Zustand der Vorlage“):**

```js
var wurzel = d.querySelector('.ez'), modusKnoepfe = Array.prototype.slice.call(d.querySelectorAll('.ez-modus [data-modus]'));
var heroText = d.querySelector('.ez-hero__text');
if (wurzel && modusKnoepfe.length && heroText) {
  var modusUhr = null, ziel = wurzel.getAttribute('data-modus');
  var markiere = function (m) { modusKnoepfe.forEach(function (k) { k.setAttribute('aria-pressed', k.getAttribute('data-modus') === m ? 'true' : 'false'); }); };
  var setzeModus = function (m) { ziel = m; wurzel.setAttribute('data-modus', m); markiere(m); };
  /* Tausch, sobald der Text weg ist (transitionend), Rückfall-Timer für Tabs im Hintergrund */
  var tausche = function () {
    clearTimeout(modusUhr); modusUhr = null;
    if (!wurzel.classList.contains('ist-wechsel')) return;
    wurzel.setAttribute('data-modus', ziel); wurzel.classList.remove('ist-wechsel');
  };
  heroText.addEventListener('transitionend', function (e) { if (e.target === heroText && e.propertyName === 'opacity') tausche(); });
  try { if (w.localStorage.getItem('ez-modus') === 'einladung') setzeModus('einladung'); } catch (e) {}
  modusKnoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      var m = k.getAttribute('data-modus');
      if (m === ziel) return;               /* gegen das Ziel prüfen, nicht gegen den noch alten Zustand */
      ziel = m;
      try { w.localStorage.setItem('ez-modus', m); } catch (e) {}
      markiere(m);                           /* sofort: der Knopf antwortet im selben Bild */
      if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) { wurzel.setAttribute('data-modus', m); return; }
      clearTimeout(modusUhr);
      wurzel.classList.add('ist-wechsel');
      modusUhr = setTimeout(tausche, 240);
    });
  });
}
```

```css
/* Nr. 5, Abgang auf der Druckkurve */
.ez.ist-wechsel .ez-hero__text { opacity: 0; transform: translate3d(0, 6px, 0); transition-duration: 160ms; transition-timing-function: var(--dna-druck); }
```

**Nr. 2, start.css, Block „Signature: zwei Zustände“:**

```css
.ez[data-modus="website"] .ez-nur-einladung:not(.ez-link-etikett), .ez[data-modus="einladung"] .ez-nur-web { display: none !important; }
.ez-link-etikett { transition: opacity 320ms var(--dna-auftritt), transform 320ms var(--dna-auftritt), display 320ms allow-discrete; }
.ez[data-modus="website"] .ez-link-etikett { display: none; opacity: 0; transform: translate3d(0, 6px, 0); transition-duration: 160ms; transition-timing-function: var(--dna-druck); }
@starting-style { .ez-link-etikett { opacity: 0; transform: translate3d(0, 6px, 0); } }   /* bleibt */
/* Telefon: Chip am Gerät über Opazität statt display (ersetzt .ez[data-modus="einladung"] .ez-muster--geraet { display: none }) */
@media (max-width: 899px) {
  .ez[data-modus="einladung"] .ez-muster--geraet { opacity: 0; visibility: hidden; transform: scale(.96); transition: opacity 160ms ease, transform 160ms ease, visibility 0s linear 160ms; }
}
```

(Browser ohne `allow-discrete` schneiden hart wie heute; der Auftritt über `@starting-style` ist davon unabhängig.)

**Nr. 3, start.css, ersetzt die beiden Regeln zu `.ez-muster--innen`:**

```css
.ez-muster--innen { right: -1px; bottom: calc(100% + 6px); height: 20px; padding: 0 8px 0 7px; font-size: 11px; }
/* Bezug ist .ez-link-etikett (position: absolute); position, opacity, visibility, transform und transition erben von .ez-muster,
   die Zeile .ez.ist-muster .ez-muster--innen { display: inline-flex } entfällt */
```

**Nr. 4, start.css, Block „Signature: zwei Zustände“ (ergänzt Nr. 2):**

```css
.ez[data-modus="website"] .ez-nur-einladung:not(.ez-link-etikett, .ez-hero__text > *, .ez-brief > *),
.ez[data-modus="einladung"] .ez-nur-web:not(.ez-hero__text > *, .ez-brief > *) { display: none !important; }
/* Hero: beide Zustände teilen sich die Zeile, die Zeile nimmt die höhere Fassung */
.ez-hero__text > *, .ez-brief > * { grid-column: 1; }
.ez-hero__text > .ez-kicker { grid-row: 1; } .ez-hero__text > h1 { grid-row: 2; } .ez-hero__text > .ez-brief { grid-row: 3; }
.ez-hero__text > .ez-aktionen { grid-row: 4; } .ez-hero__text > .ez-meta { grid-row: 5; }
.ez-brief > .dna-text { grid-row: 1; } .ez-brief > .ez-unterschrift { grid-row: 2; }
.ez[data-modus="website"] :is(.ez-hero__text, .ez-brief) > .ez-nur-einladung,
.ez[data-modus="einladung"] :is(.ez-hero__text, .ez-brief) > .ez-nur-web { visibility: hidden; }
```

**Nr. 6, index.html und start.css:**

```html
<span class="dna-label ez-kicker ez-nur-web" data-dna-auftritt="still" style="--i:5" …>
<span class="dna-label ez-kicker ez-nur-einladung" data-dna-auftritt="still" style="--i:5">
<p class="ez-meta ez-nur-web" data-dna-auftritt="still" style="--i:12" …>
<p class="ez-meta ez-nur-einladung" data-dna-auftritt="still" style="--i:12" …>
```

```css
.ez-hero__text > .ez-meta[data-dna-auftritt] { transition-duration: 480ms; }   /* 840–1320 ms, im Takt der Pille, ohne Weg */
```

**Nr. 7, start.css, ans Ende der Datei (ersetzt Zeile 449):**

```css
@media (prefers-reduced-motion: reduce) {
  .ez-leiste { transform: none; opacity: 0; visibility: hidden; transition: opacity 160ms ease, visibility 0s linear 160ms; }
  .ez-leiste.ist-da { opacity: 1; visibility: visible; transition: opacity 220ms ease, visibility 0s; }
  .ez-muster, .ez-toast { transform: none; transition: opacity 160ms ease, visibility 0s linear 160ms; }
  .ez.ist-muster .ez-muster, .ez-toast.ist-da { transition: opacity 220ms ease, visibility 0s; }
  .ez-link-etikett { transition: opacity 160ms ease; }
  .ez[data-modus="website"] .ez-link-etikett { transform: none; }
  @starting-style { .ez-link-etikett { transform: none; } }
  .ez-hero__text { transition: none; }
  .ez-rund, .ez-schalter, .ez-modus button, .ez-planen__knopf, .ez-kontakt__held, .ez-kontakt__held-knopf, .ez-kontakt__wege .dna-rund-knopf, .ez .dna-pille__pfeil svg, .ez .dna-pille--leise { transition-duration: 0s; }
}
```

**Nr. 8, 9, 10, start.css:**

```css
.ez-schalter[aria-pressed="true"] { background: var(--schwarz); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.18), inset 0 1px 0 rgba(255,255,255,.1); }
.ez-kontakt__held:active .ez-kontakt__held-knopf { transform: scale(.96); transition-duration: 0s; }
.ez a, .ez button { -webkit-tap-highlight-color: transparent; }
```

**Geprüft und für richtig befunden:** Takt des Hero (steht bei 1,32 s, Pille zuletzt mit Weg, alles andere still; Domain-Etikett erst Punkt und Linie, dann Text; keine Überschneidung mit der Überschrift), Leiste (nach 160 ms praktisch am Ziel, Abgang 220 < Auftritt 320, Links darin mit `tabindex="-1"` unerreichbar), Druck (Pillen .97, Rundknöpfe .94, Innenkarte .985, alle sofort und 220 ms zurück), Hover nur mit Farbe, Ring, 2 px Pfeil oder scale(1.04) und nur hinter `(hover: hover) and (pointer: fine)`, Muster-Chips (220 ms auf `--dna-auftritt`, 160 ms `ease` ab, `visibility` erst nach dem Abgang, kein Platz, kein Backdrop-Blur), Toast (gleiches Muster, unterbrechbar über Transition), `will-change` nur bis `.ist-da`, Skip-Link ohne Gleiten, `touchstart`-Lauscher für `:active` auf iOS, kein `transition: all`, keine Keyframes, kein ease-in, ohne JavaScript steht alles.

**Die drei Befunde, die am meisten bringen:** Nr. 1 (der gedrückte Knopf des Umschalters antwortet sofort, nicht nach 160 ms), Nr. 2 (das Link-Etikett bekommt einen Abgang, bis dahin ist es der einzige harte Schnitt auf der Seite), Nr. 3 (das Muster-Etikett hängt am Link-Etikett, statt es wachsen zu lassen).

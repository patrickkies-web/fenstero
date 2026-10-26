# Feinschliff Bewegung: Landingpage Y (Paket Essential Plus)

Prüfer: Noah Brandner, Motion-Designer (Schule Emil Kowalski). Datum: 26.10.2026. Dauer: etwa zehn Minuten.
Fassung Y, Quelle docs/profis/essential-plus-vorschau/ (start.css, start.js, dna/bundle.css, dna/bundle.js).
Grundlage: Brief (Fassungen, Änderung 12, Regeln), Skill emil-design-eng, Design-DNA (Rückmeldung 220 ms, Zustand 320 ms,
Auftritt 700 ms, Hero steht nach 1 s, ruhige Fassung steht sofort, nur transform/opacity, nie ease-in, Hover nur bei Maus).

## Was ich gesehen habe

- Zeitlupe des Hero (bew/hero-reihe.jpg): 0 ms leer, 200 ms Bühne mit Gerät und Domain-Etikett, 400 ms Kicker und „Neue Fenster,“
  scharf, „gut geplant.“ noch in der Unschärfe, 600 ms Text und Petra Brandt stehen, 800 ms die Pille, danach bis 1800 ms Ruhe.
  Das Bild stimmt mit dem Code bis auf den Nullpunkt überein: nach Code endet die Pille erst bei 1320 ms (unten, Befund 4).
- Zustände (bew/zustaende.jpg): Ruhe und Hover der weißen Pille unterscheiden sich nur um den Pfeil (2 px), Druck ist sichtbar kleiner,
  gut. Hover der leisen Pille füllt „So geht es“ goldbraun, damit stehen zwei volle Pillen nebeneinander (Befund 3). Pfeilkreis-Hover
  und Rundknopf-Hover sind lesbar. Im Kopf erscheinen beide Schalterbeschriftungen gleichzeitig („Ihres markiertIhres zeigen“),
  vermutlich die Überlagerung der Aufnahmen an/aus; im Code schließen sich die Zustände aus, aber sie sind verschieden breit (Befund 6).
- Telefon-Streifen (y/tel-streifen-1.jpg): alles unterhalb des Hero steht sofort, kein Auftritt, keine Keyframes in start.css oder
  bundle.css; 0 laufende Animationen nach 2,6 s laut Messung. Richtig so.

Was stimmt und bleibt: Druck sofort (`transition-duration: 0s` auf `:active`), Rückweg 220 ms auf `--dna-druck` (ease-out), alle
Hover hinter `(hover: hover) and (pointer: fine)`, Leiste versteckt sich in 220 ms und kommt in 320 ms (Ausgang schneller als
Eingang), Skip-Link ohne Übergang (Tastatur), `html:not(.ez-js)` zeigt alles ohne Skript, Vorhang rein durch Scrollen, Auftritt der
Wörter aus der Unschärfe als Gen der DNA, unter 20 px.

## Befunde, nach Wirkung geordnet

### 1. Der Kopf springt 28 px, wenn der Schalter umgelegt wird (Muss)
- Wo: start.css, `.ez.ist-muster .ez-kopf { padding-bottom: 28px; }` (Abschnitt Muster-Ebene).
- Was: Beim Umschalten ändert sich das Padding des Kopfs ohne Übergang; Bühne, Überschrift und Pille rücken auf einen Schlag 28 px
  nach unten oder oben. Der Schalter animiert 220 ms, die Seite darunter springt.
- Wie: Das Padding in beiden Zuständen gleich halten: `.ez-kopf { padding-bottom: 28px; }` in der Vorlage (beim echten Betrieb gibt
  es die Muster-Ebene nicht, dort entfällt die Regel). Alternativ den Chip „Ihr Logo“ ohne Platzbedarf über die Bühne legen
  (`z-index: 5` hat er schon) und das Padding ganz streichen.
- Warum: Nur transform und opacity bewegen sich (Layout springt nie); Emil: „Preventing jarring changes“.

### 2. Die Muster-Chips erscheinen und verschwinden als harter Schnitt (Muss)
- Wo: start.css, `.ez-muster { display: none; }` und `.ez.ist-muster .ez-muster { display: inline-flex; }`.
- Was: Sieben Chips (Logo, Text, Domain, Gerät, Bühne, Fotos, Fußzeile) springen gleichzeitig per `display` ein, während der Punkt
  im Schalter 220 ms wechselt. Zwei Takte im selben Klick.
- Wie: `.ez-muster { display: inline-flex; opacity: 0; transform: scale(.96); visibility: hidden; transition: opacity 220ms
  var(--dna-auftritt), transform 220ms var(--dna-auftritt), visibility 0s linear 220ms; }` und `.ez.ist-muster .ez-muster
  { opacity: 1; transform: none; visibility: visible; transition-delay: 0s; }`. Ausschalten darf schneller sein: 160 ms. Kein
  Stagger, das ist ein Zustand und kein Auftritt. Die `translate: -50% 0` des Domain-Chips bleibt davon unberührt.
- Warum: Zustand mit Übergang (Rückmeldung 220 ms, ease-out); Emil: Elemente, die ohne Übergang erscheinen, wirken kaputt; nur
  transform und opacity.

### 3. Hover der leisen Pille macht eine zweite, farbige Pille (Muss)
- Wo: start.css, `@media (hover: hover) … .ez .dna-pille--leise:hover { background: var(--firma-tief); color: var(--weiss);
  box-shadow: none; }` (Abschnitt Bedienung). Gilt auch für die Pille in der Leiste.
- Was: Unter der Maus wird „So geht es“ eine volle goldbraune Fläche neben der weißen Pille „Fenster planen“.
- Wie: `.ez .dna-pille--leise:hover { background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1.5px var(--tinte); }`,
  Übergang bleibt `background-color 220ms ease, box-shadow 220ms ease`. Auf hellen Szenen entsprechend `rgba(7,9,10,.05)`.
- Warum: DNA: genau eine volle Pille je Bildschirm, nie farbig, Farbe nur als Leuchten, Zustand oder Wert; Emil: Hover ist ein
  Farbwechsel mit `ease`, keine Verwandlung.

### 4. Der Hero steht erst nach 1320 ms (Kann)
- Wo: dna/bundle.css `[data-dna-auftritt] { transition-delay: calc(var(--i, 0) * 70ms); }` mit `--i` 6/10/12 aus index.html und
  start.css `.ez .dna-wort` 560 ms, `.ez-hero__text > [data-dna-auftritt="still"]` 560 ms, `.ez-aktionen` 480 ms.
- Was: Kicker 420–980 ms, Wörter 420–1190 ms, Brief und Meta 700–1260 ms, Pille 840–1320 ms. Die DNA will den Hero nach 1 s.
  Der Brief übernimmt diese Zahlen von X, darum nur Kann; im Bild wirkt es bereits ruhig.
- Wie: In start.css `.ez-hero [data-dna-auftritt] { transition-delay: calc(var(--i, 0) * 50ms); }`, Wörter und Stills 480 ms,
  Aktionen 400 ms. Ergebnis: Etikett 100–400, Kicker 300–780, Wörter 300–930 (Stagger 50 ms), Brief 500–980, Pille 600–1000 ms.
  Reihenfolge und „Pille zuletzt“ bleiben.
- Warum: DNA: Auftritt 700 ms, Hero steht nach 1 s; Emil: Stagger 30–80 ms, lange Abstände wirken langsam.

### 5. Das Domain-Etikett hängt am IntersectionObserver statt am Hero-Start (Kann)
- Wo: start.js `heroAuftritt` (setzt `ist-da` nur auf `.ez-hero [data-dna-auftritt]`), dna/bundle.js `anker()` mit Schwelle 0,35.
- Was: Die Adresse ist `[data-dna="anker"]`, kein `[data-dna-auftritt]`. Ihr Auftritt wartet auf den Beobachter; bei verdeckter
  Bühne (Safari-Leisten, Querformat) kommt das Etikett erst beim Scrollen, obwohl der Takt es bei 100–400 ms vorsieht.
- Wie: In `heroAuftritt` den Selektor erweitern: `.ez-hero [data-dna-auftritt], .ez-hero [data-dna="anker"]`.
- Warum: Hero steht nach 1 s, unabhängig vom Scrollen; der Takt im Hero ist eine Choreografie, kein Scroll-Auftritt.

### 6. Die Schalter-Pille ändert beim Klick ihre Breite (Kann)
- Wo: start.css `.ez-schalter__an, .ez-schalter__aus { display: none; }` plus die beiden `display: inline`-Regeln.
- Was: „Ihres markiert“ und „Ihres zeigen“ sind verschieden lang; die Pille wächst und schrumpft ohne Übergang, der Rand springt.
  Keine Animation des Textes ist richtig (Umschalter), der Sprung der Breite nicht.
- Wie: `.ez-schalter__text { display: grid; } .ez-schalter__an, .ez-schalter__aus { grid-area: 1 / 1; display: inline;
  visibility: hidden; }` und je Zustand `visibility: visible`. Breite ist dann immer die der längeren Beschriftung.
- Warum: Emil: Umschalter nicht animieren, aber nichts darf springen; nur transform und opacity bewegen sich.

### 7. Ruhige Fassung lässt noch Bewegung zu (Kann)
- Wo: start.css `@media (prefers-reduced-motion: reduce)` enthält nur `.ez-leiste`; dna/bundle.css deckt `.dna-pille`,
  `.dna-rund-knopf` und die Auftritte ab, nicht `.ez-rund`, `.ez-schalter`, `.ez .dna-pille--leise` und den Hover
  `.ez-planen__knopf:hover { transform: scale(1.04); }`.
- Was: Pfeilkreis wächst unter der Maus auch in der ruhigen Fassung; Rundknopf, Schalter und leise Pille behalten 220 ms transform.
- Wie: Im Block ergänzen: `.ez-rund, .ez-schalter, .ez-schalter__punkt, .ez .dna-pille--leise, .ez .dna-pille__pfeil svg
  { transition: none; } .ez-planen__knopf:hover { transform: none; } .ez .dna-pille:hover .dna-pille__pfeil svg
  { transform: none; }`. Farbwechsel (Hover-Fläche, Punkt im Schalter) bleiben.
- Warum: Ruhige Fassung steht sofort; Emil: Bewegung entfernen, Farbe und Deckkraft als Verständnishilfe behalten.

### 8. Übergänge auf box-shadow (Kann, niedrig)
- Wo: start.css `.ez .dna-pille--leise`, `.ez-rund`, `.ez-schalter`, `.ez-schalter__punkt`, `.ez-kontakt__wege .dna-rund-knopf`
  (jeweils `box-shadow 220ms ease`).
- Was: Der Rand ist als innerer Schatten gebaut und wird mitanimiert; das malt neu statt zu komponieren. Auf 44-px-Elementen
  unmerklich, aber gegen die Regel.
- Wie: Rand als `::after` mit `inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1.5px var(--silbergrau)` und nur
  `opacity 220ms ease` wechseln, oder den Übergang auf `background-color 220ms ease, transform 220ms var(--dna-druck)` kürzen.
- Warum: Nur transform und opacity.

### 9. Rechtslinks im Fuß wechseln die Farbe ohne Übergang (Kann, niedrig)
- Wo: start.css `.ez-fuss__recht a:hover { color: var(--tinte); }`, Basisregel `.ez-fuss__recht a` ohne `transition`.
- Was: Harter Farbschnitt unter der Maus, alle anderen Hover der Seite laufen 220 ms.
- Wie: `.ez-fuss__recht a { transition: color 160ms ease; }`.
- Warum: Emil: Hover ist ein Farbwechsel mit `ease`; eine Seite, ein Takt.

## Pflichttabelle

| Before | After | Why |
| --- | --- | --- |
| `.ez.ist-muster .ez-kopf { padding-bottom: 28px; }` nur im Zustand an | `.ez-kopf { padding-bottom: 28px; }` in beiden Zuständen (oder Chip ohne Platzbedarf, Padding weg) | Layout springt nie; nur transform/opacity bewegen sich |
| `.ez-muster { display: none; }` → `display: inline-flex` | `opacity: 0; transform: scale(.96); visibility: hidden; transition: opacity 220ms var(--dna-auftritt), transform 220ms var(--dna-auftritt), visibility 0s 220ms` → `opacity: 1; transform: none; visibility: visible` | Zustand mit Übergang 220 ms ease-out; Erscheinen ohne Übergang wirkt kaputt |
| `.ez .dna-pille--leise:hover { background: var(--firma-tief); color: var(--weiss); box-shadow: none; }` | `background: rgba(255,255,255,.06); box-shadow: inset 0 0 0 1.5px var(--tinte)`, Übergang 220ms ease | Genau eine volle Pille je Bildschirm, nie farbig |
| Hero-Stagger `calc(var(--i) * 70ms)`, Dauern 560/560/480 ms, Pille endet 1320 ms | `.ez-hero [data-dna-auftritt] { transition-delay: calc(var(--i, 0) * 50ms); }`, Dauern 480/480/400 ms, Pille endet 1000 ms | Hero steht nach 1 s; Stagger 30–80 ms |
| `heroAuftritt` setzt `ist-da` nur auf `.ez-hero [data-dna-auftritt]` | Selektor `.ez-hero [data-dna-auftritt], .ez-hero [data-dna="anker"]` | Takt im Hero unabhängig vom Scrollen |
| Schalterbeschriftung per `display: none/inline`, Breite springt | Beide Beschriftungen in `grid-area: 1 / 1`, Wechsel per `visibility` | Umschalter ohne Animation, aber ohne Sprung |
| Ruhige Fassung: nur `.ez-leiste { transition: none; }` | zusätzlich `.ez-rund, .ez-schalter, .ez-schalter__punkt, .ez .dna-pille--leise, .ez .dna-pille__pfeil svg { transition: none; } .ez-planen__knopf:hover { transform: none; }` | Ruhige Fassung steht sofort; Farbe bleibt, Bewegung geht |
| `transition: … box-shadow 220ms ease` auf Rundknopf, Schalter, leiser Pille | Rand als `::after` mit `opacity 220ms ease`, oder Übergang auf `background-color, transform` kürzen | Nur transform/opacity |
| `.ez-fuss__recht a:hover` ohne Übergang | `.ez-fuss__recht a { transition: color 160ms ease; }` | Hover als Farbwechsel mit ease, ein Takt auf der Seite |

## Muss und Kann

Muss (ohne sie ist die Bewegung fehlerhaft):
1. Befund 1: Kopf springt 28 px beim Umschalten.
2. Befund 2: Muster-Chips erscheinen als harter Schnitt, während der Schalter 220 ms animiert.
3. Befund 3: Hover der leisen Pille erzeugt eine zweite, farbige Pille.

Kann: Befunde 4 bis 9 (Hero-Takt auf 1 s, Etikett am Hero-Start, Breite des Schalters, ruhige Fassung vollständig, box-shadow,
Rechtslinks). Befund 4 nur, wenn der Inhaber den von X übernommenen Takt freigibt; die Zeitlupe wirkt schon jetzt ruhig.

# Feinschliff Zeichen (Elias Lorenz): Vorlage EEZI Signature

**Gesamteindruck:** Die Linienicons sind aus einer Hand, der Ankerpunkt sitzt richtig, die Marke ohne Kachel ist sauber gebaut. Was
die Vorlage noch unter ihrem Niveau hält, sind die Punkte: nicht zu viele Familien (Koralle = Muster und Hinweis, Firmenfarbe = aktiv
und am Etikett, Silbergrau-Ring = noch nicht, 6 px = Legende), aber ein Hof in zwei Rezepten und der Punkt in sechs Größen. Dazu ein
App-Symbol, das nicht dasselbe Zeichen ist wie die Marke, und zwei Schlösser unter der Untergrenze. Die sechs Koralle-Punkte auf dem
Telefon im Einladungszustand gehören alle zur Muster-Ebene, die der Kunde nie sieht; das geht.

**Was gut ist:**
- Telefon, Blatt, Handy, Haken, Pfeil, E-Mail, Anfahrt und Website: alle 1,8 px, runde Enden, currentColor, 14 oder 20 px, mit
  `non-scaling-stroke`; der Pfeil in Pille und Rundknopf ist derselbe Pfad, der Haken in Meta-Zeile und Liste auch.
- Ankerpunkt als weiße Scheibe mit Ring und Hof auf der Blende neben der Notch, Linie 1,2 px gestrichelt mit sechs Strichen; die Marke
  ohne Kachel mit gleichen Fugen (8 von 64) in Kopf, Leiste, Kontakt und Fuß identisch; Stationen, Route-Punkte und inaktiver
  Umschalter teilen den 8-px-Ring in Silbergrau.
- Hinweis-Chip und aktiver Umschalter tragen schon das Soll-Rezept (8 px, Hof 3 px zu 30 %); die Schraffur der Kapseln (1,2 px auf
  5 px) bleibt am Telefon lesbar, die weiße Scheibe im Umschalter sagt „aktiv“ ohne zweites Zeichen.

## Befunde, nach Wirkung

1. **Hof der Firmenpunkte ist eine Vollfarbe, auf Weiß ein brauner Ring** (hoch)
   - Wo: start.css `.ez-bereit__punkt`, `.ez-link-etikett__punkt::after`, `.ez-app__punkt::after`, `.ez-app__band i.ist`,
     `.ez-stationen li.ist::before`, `.ez-kapseln i.ist`
   - Was ist: Hof `0 0 0 3px var(--firma-tief)`, und `--firma-tief` ist #5b4a26 deckend. Auf Schwarz wirkt das als Glut, auf dem weißen
     Glas-Etikett am Modell („Beispiel · Ihr Fenster nach Ihren Maßen“) als brauner Außenring: der Punkt wird zur Zielscheibe. Die
     Koralle-Punkte haben dagegen `color-mix(… 30%, transparent)`.
   - Wie: ein Token in `.ez`: `--firma-hof: color-mix(in srgb, var(--firma) 30%, transparent);` und an allen sechs Stellen
     `box-shadow: 0 0 0 3px var(--firma-hof)` (im App-Band `0 0 0 calc(3px / var(--gs)) var(--firma-hof)`).
   - Warum: ein Hof ist Licht, keine Kontur. Durchscheinend liegt er auf Schwarz wie heute (≈ #46381c) und auf Weiß als zartes Gold;
     ein Rezept für beide Farben.

2. **Der Punkt mit Hof in sechs Größen** (hoch)
   - Wo: start.css `.ez-muster::before` (7 px, Hof 2,5), `.ez-muster--innen::before` (6 px, Hof 2), `.ez-schalter__punkt` (10 px),
     `.ez-stationen li.ist::before` (12 px, Hof 4). Das Soll steht schon in `.ez-hinweis::before` und
     `.ez-modus button[aria-pressed="true"]::before` (8 px, Hof 3 zu 30 %).
   - Was ist: Koralle in 6, 7, 8 und 10 px, Firmenfarbe in 8 und 12 px. Der 12-px-Stationspunkt konkurriert mit der Zahl 5, der
     10-px-Ring im 44-px-Schalter am Telefon ist ein Ring im Ring.
   - Wie: überall 8 px mit Hof 3 px:
     `.ez-muster::before { width: 8px; height: 8px; box-shadow: 0 0 0 3px color-mix(in srgb, var(--hinweis) 30%, transparent); }`
     `.ez-muster--innen::before { width: 8px; height: 8px; box-shadow: 0 0 0 3px color-mix(in srgb, var(--hinweis) 30%, transparent); }`
     `.ez-schalter__punkt { width: 8px; height: 8px; }`
     `.ez-stationen li.ist::before { width: 8px; height: 8px; margin-top: 2px; background: var(--firma); box-shadow: 0 0 0 3px var(--firma-hof); }`
     (margin-top 2 px wie die inaktiven, damit die Mitte auf der gepunkteten Linie bei 6 px bleibt; der Chip „innen“ ist 20 px hoch,
     14 px passen).
   - Warum: ein Zeichen je Bedeutung heißt auch eine Größe. Aktiv ist dann überall dasselbe: 8 px gefüllt mit Hof, noch nicht: 8 px Ring.

3. **App-Symbol: die Fuge des Zeichens ist enger als in der Marke** (hoch)
   - Wo: index.html, die drei SVG `.ez-logo__zeichen` mit Kachel (App-Kopf im Gerät Z. 87, Senden Z. 264, Route-Knoten Z. 334);
     Marke ohne Kachel: Z. 56, 71, 392, 419.
   - Was ist: Marke: Blöcke 24, Fuge 8 (Fuge = ⅓ Block, rx 5). Kachel: Blöcke 16, Fuge 4 (= ¼ Block, rx 3). In der Kachel ist es also
     ein gedrungeneres, zweites Zeichen; der Fensterbauer sieht sein Zeichen auf der Seite in zwei Schnitten.
   - Wie: in allen drei Kachel-SVGs die inneren Rechtecke ersetzen (Innenfeld 36 bleibt, Fuge wieder ⅓):
     `<rect x="14" y="14" width="15.4" height="36" rx="3.2" fill="#07090a"/><rect x="34.6" y="14" width="15.4" height="15.4" rx="3.2" fill="#07090a"/><rect x="34.6" y="34.6" width="15.4" height="15.4" rx="3.2" fill="#07090a"/>`
     Kachel `rx="16"` und Rand 14 bleiben.
   - Warum: Marke und App-Symbol sind ein Zeichen, einmal auf Grund, einmal auf Kachel. Nur so stimmt später auch das Symbol auf dem
     Startbildschirm mit dem Kopf der Seite überein.

4. **Schloss: 12 px bei 1,4 px, zweimal eingebettet, ohne non-scaling-stroke** (mittel)
   - Wo: index.html Z. 119 (Domain-Etikett) und Z. 426 (Fuß „Team-Zugang“); start.css `.ez-adresse__text svg`, `.ez-fuss__team svg`
   - Was ist: an beiden Stellen derselbe Pfad (gut), aber 12 px, 1,4 px, ohne `vector-effect` und `stroke-linejoin`. Neben der
     500er Domain in 13 px wirkt es dünn; unter der Untergrenze 14 px / 1,8 px.
   - Wie: ein Pfad in 14er Box an beiden Stellen:
     `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6.5" width="9" height="6" rx="1.6"/><path d="M4.5 6.5V5a2.5 2.5 0 0 1 5 0v1.5"/></svg>`
     CSS: `.ez-adresse__text svg, .ez-fuss__team svg { width: 14px; height: 14px; } .ez-adresse__text svg *, .ez-fuss__team svg * { vector-effect: non-scaling-stroke; }`
     (die beiden Regeln mit `width: 12px` und `stroke-width: 1.4` raus; die Farbe im Etikett bleibt Silbergrau über `color`).
   - Warum: gleiche Bedeutung, gleiches Zeichen, gleiche Stärke wie alle anderen Icons, gerätunabhängig.

5. **Maßlinien: die Öffnung ist gepunktet statt gestrichelt, so schwer wie der Rahmen, und trägt Koralle** (mittel)
   - Wo: start.css `.ez-zeichnung .mass`, `.ez-zeichnung .mass-oeffnung`, `.ez-mini--oeffnung::before`
   - Was ist: `stroke-dasharray: 0 6` mit runden Enden ergibt eine Punktreihe; gepunktet heißt auf der Seite „Weg“ (Route, Stationen),
     gestrichelt heißt in der DNA „Ankerlinie“ (`3 4`). Beide Maße 1,8 px wie der Rahmen: Objekt und Bemaßung gleich schwer. Koralle
     als Maßfarbe ist die dritte Bedeutung der Farbe (Muster, Hinweis, Öffnung) und das Lauteste in der Kachel.
   - Wie: `.ez-zeichnung .mass { stroke-width: 1.4; }` ·
     `.ez-zeichnung .mass-oeffnung { stroke: var(--silbergrau); stroke-dasharray: 4 5; }` ·
     `.ez-mini--oeffnung::before { background: var(--silbergrau); }` – Fenster bleibt Firmenfarbe durchgezogen. Misst der Konfigurator
     die Öffnung selbst in Koralle, dann nur `stroke-dasharray: 4 5` und `stroke-width: 1.4` übernehmen.
   - Warum: gestrichelt = Öffnung (die Mauer, das Weiche), durchgezogen in der Firmenfarbe = Fenster (das, was der Betrieb baut);
     dünner als der Rahmen, damit die Zeichnung Objekt bleibt und das Maß Anmerkung. Die Hilfslinien (1 px, über das Maß hinaus)
     sind richtig und bleiben.

6. **Kapselreihe: der Hof frisst die Fuge; zwei Schraffur-Raster** (mittel)
   - Wo: start.css `.ez-kapseln` (gap 6), `.ez-kapseln i.ist` (Hof 3 px deckend), `.ez-wahl-reihe .offen`
   - Was ist: Kapseln 12 × 30 px mit 6 px Fuge; der 3-px-Hof der Marke füllt die halbe Fuge beidseits, am Schreibtisch berührt der
     dunkle Goldring die weiße Kapsel, am Telefon werden weiß und gold ein Block. Die Schraffur der Kapseln (1,2 px auf 5 px, 70 %)
     ist lesbar; die Wahl-Reihe schraffiert anders (1 px auf 4 px, 32 %).
   - Wie: `.ez-kapseln { gap: 8px; }`, Hof wie in Befund 1 (`0 0 0 3px var(--firma-hof)`); Wahl-Reihe auf dasselbe Raster:
     `.ez-wahl-reihe .offen { background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--silbergrau) 45%, transparent) 0 1.2px, transparent 1.2px 5px), var(--weiss); }`
   - Warum: erreicht gefüllt, offen schraffiert, eine Marke – das liest sich nur, wenn vier Stäbchen als vier stehen; und „noch offen“
     hat auf der ganzen Seite eine Schraffur.

7. **Sucher-Ecken: eckige Enden, auf der hellen Wand kaum da** (mittel bis klein)
   - Wo: index.html Z. 231 `.ez-sucher` (vier `<i>`), start.css `.ez-sucher i`
   - Was ist: Border-Ecken schneiden an allen acht Enden rechtwinklig ab (kein `linecap`), und Weiß 1,8 px liegt oben links und rechts
     ohne Kontrast auf der cremefarbenen Wand des Kundenfotos.
   - Wie: ein SVG je Ecke statt `<i>`:
     `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 7V5a4 4 0 0 1 4-4h2"/></svg>`,
     die anderen drei per `transform: rotate(90deg / 180deg / 270deg)`; CSS
     `.ez-sucher svg { position: absolute; z-index: 1; width: 14px; height: 14px; color: var(--weiss); filter: drop-shadow(0 0 1.5px rgba(7,9,10,.55)); } .ez-sucher svg * { vector-effect: non-scaling-stroke; }`,
     Lagen wie heute (9 px von den Rändern).
   - Warum: der Sucher ist das einzige Linienzeichen ohne runde Enden; ein Hauch Schatten hält ihn auf jedem Kundenfoto sichtbar.

8. **Fortschrittsring aus conic-gradient: harte Enden, weiche Kante** (klein)
   - Wo: start.css `.ez-ring`; index.html Z. 232 Glas-Chip „Foto 1 von 2“
   - Was ist: Ring 16 px über eine Maske (6,1 → 6,4 px), Stärke ≈ 1,6 px, das weiße Segment endet rechtwinklig: bei 50 % ein Halbmond,
     kein halber Weg. Einziges Zeichen ohne runde Enden und ohne 1,8.
   - Wie: `<svg class="ez-ring" viewBox="0 0 16 16" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" style="--anteil:.5"><circle cx="8" cy="8" r="6.5" stroke="rgba(255,255,255,.22)"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" pathLength="100" transform="rotate(-90 8 8)" style="stroke-dasharray: calc(var(--anteil) * 100) 100"/></svg>`;
     CSS `.ez-ring { width: 16px; height: 16px; flex: none; } .ez-ring * { vector-effect: non-scaling-stroke; }`, Maske und
     conic-gradient raus.
   - Warum: gleiche Sprache wie Haken und Pfeil; mit runden Kappen liest sich 1 von 2 als halber Weg.

9. **Handy zweimal gezeichnet, Zollstock-Teilstriche zu kurz** (klein)
   - Wo: index.html Z. 318 (Route, viewBox 20: Rechteck 9 × 15, rx 2, Leiste 2) und Z. 359 (Dinge, viewBox 24: 11 × 19, rx 2,5,
     Leiste 3); Z. 358 Zollstock.
   - Was ist: zwei Handys mit verschiedenen Proportionen für dieselbe Sache. Die Zollstock-Teilstriche sind 1,6 Einheiten lang,
     1,9 px bei 20 px; mit runden Kappen Kleckse statt Striche (sichtbar in der Bereit-Karte).
   - Wie: Route-Knoten auf dasselbe SVG wie in den Dingen (bleibt 20 px):
     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18h3"/></svg>`.
     Zollstock-Striche auf 2,4 Einheiten, drei von der Vorderkante, zwei von der Hinterkante:
     `<path d="M7 11.5l2.4 2.4M9.8 8.7l2.4 2.4M12.6 5.9l2.4 2.4M11.5 13.2l2.4 2.4M14.3 10.4l2.4 2.4"/>`
   - Warum: ein Ding, ein Zeichen; Teilstriche sind erst ab etwa 3 px Länge Striche.

10. **Kopf des App-Nachbaus: drei Strichstärken, Buch ohne runde Enden** (klein)
   - Wo: index.html Z. 86 (Chevron `stroke-width="2"`, viewBox 16), Z. 88 (Menü 1,8; Buch 1,6 ohne `stroke-linecap`);
     start.css `.ez-app__tipp`
   - Was ist: drei Stärken in einer Zeile. Dazu der Tipp „Wischen zum Wechseln“ als Koralle-Fläche, wo die DNA Koralle nur als Punkt
     kennt. Das Gerät ist Abbild der App, aber in der Vorlage das meistbetrachtete Zeichenfeld.
   - Wie: Chevron `stroke-width="1.8"`, Buch `stroke-width="1.8" stroke-linecap="round"`. Zeigt die App den Tipp wirklich so, bleibt
     er; sonst `.ez-app__tipp { background: var(--anthrazit); color: var(--weiss); } .ez-app__tipp::before { background: var(--hinweis); }`.
   - Warum: der Nachbau wirbt für die App; was dort steht, nimmt der Kunde als Maßstab.

**Die drei, die am meisten bringen:** 1 und 2 zusammen (ein Punkt-Rezept: 8 px, Hof 3 px zu 30 %, für Koralle und Firmenfarbe; damit
erledigen sich auch der Hof in der Kapselreihe aus 6 und der Umschalter-Punkt), 3 (App-Symbol = Marke) und 4 (ein Schloss, 14 px,
1,8 px).

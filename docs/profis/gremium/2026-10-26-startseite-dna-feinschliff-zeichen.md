# Z · Ida Lorenz, Zeichen und Symbole

1. **Wo** start.css `.ez-ratgeber span` (desk-07, tel-09) · **Was stört** Der Pfeil im Rundknopf klebt oben links am Ring: `display: block` für alle `span` schlägt das `display: grid` des Knopfs. · **Beheben** `.ez-ratgeber .dna-rund-knopf { display: grid; }`. · **Warum** Das DNA-Icon; verrutscht wirkt es kaputt.

2. **Wo** index.html `.mass-o`, `.mass-f` (detail-messen) · **Was stört** „Öffnung · Höhe“ misst den Rahmen (62–220) statt der Maueröffnung (54–230); „Fenster · Breite“ misst die Flügel (102–298) statt des Rahmens (92–308). · **Beheben** `d="M70 54V230M66 54h8M66 230h8"` und `d="M92 246H308M92 242v8M308 242v8"`. · **Warum** Ein Maß an der falschen Kante lehrt das Falsche.

3. **Wo** start.css `.ez-liste li::before`, `.ez-frei li::before`, `.ez-ratgeber b::before` · **Was stört** Derselbe violette Punkt mit Hof heißt „du bist hier“, „Messpunkt“, „Listenpunkt“, „kostenlos“ und „Artikel“, Abstände 10/8/12 px. · **Beheben** Violett nur in Umschalter und Etikett. Liste: 6 px in `var(--linie)`, ohne Hof, `margin: 8px 0 0 2px`; Kostenlos: Haken 14 px (`M2.5 7.5l3 3 6-6`, 1,8 px, currentColor); Ratgeber-Punkt streichen. · **Warum** DNA: `signal` höchstens einmal je Bildschirm.

4. **Wo** start.css `.ez-fuss .dna-label` (detail-fuss) · **Was stört** Die Spaltenköpfe tragen dieselbe Indigo-Pille wie „Für Fensterbauer“, „Pilotphase“, der Gerätechip und der gedrückte Farbwähler; sie sehen anklickbar aus. · **Beheben** Regel auf `margin-bottom: 8px` kürzen. · **Warum** Gleiche Form, gleiche Bedeutung.

5. **Wo** start.css `.ez-wahl.dna-pillen [aria-pressed="true"]` (desk-05) · **Was stört** „Anthrazitgrau“ ist gewählt und leuchtet Indigo: Farbpille in der falschen Farbe. · **Beheben** Regel streichen (DNA: `handlung`/`auf-handlung`); je Knopf `::before` 10 px rund mit `--farbe` (#f1f0ea, #383e42, #b8793e) und `box-shadow: inset 0 0 0 1px rgba(0,0,0,.2)`. · **Warum** Ein Farbwähler zeigt die Farbe.

6. **Wo** `.dna-anker__punkt`, `.dna-anker__linien` auf Blatt und Foto-Schritt (detail-blatt, desk-04) · **Was stört** Auf Papier: weißer Ring unsichtbar, Anthrazit-Hof als 24-px-Graufleck über „1.259“, weiße Strichlinie weg. · **Beheben** `.ez-blatt .dna-anker__punkt, .ez-stufe__bild--hell .dna-anker__punkt { background: var(--weiss); box-shadow: 0 0 0 1.5px var(--schwarz), 0 0 0 4px rgba(255,255,255,.75); }` und `.ez-blatt .dna-anker__linien, .ez-stufe__bild--hell .dna-anker__linien { filter: drop-shadow(0 0 1px rgba(7,9,10,.8)); }`. · **Warum** Ankerpunkt wie im Hell-Thema: helle Scheibe, dunkler Ring, kein Fleck auf der Sache.

7. **Wo** start.css `.ez-zeichnung .wand/.rahmen/.mass` · **Was stört** Die Striche skalieren mit der viewBox, die Ankerlinien daneben sind fest 1,2 px. · **Beheben** `vector-effect: non-scaling-stroke` auf alle drei; `.rahmen` 1,8 px, `.mass` 1,2 px, `.wand` 1 px, `stroke-dasharray: 3 4`. · **Warum** DNA: Linien 1,8 px, Feinzeichnung 1,2 px, gerätunabhängig.

8. **Wo** start.css `[data-theme="dunkel"] .dna-etikett` (detail-messen) · **Was stört** Die 26-px-Scheibe hinter dem Punkt hat die Glasfarbe (#202022) und verschwindet; der Punkt schwebt 19 px vom Text, rechts 14 px. · **Beheben** `[data-theme="dunkel"] .dna-etikett__punkt { background: rgba(255,255,255,.08); width: 24px; height: 24px; }`. · **Warum** Optischer Ausgleich; die Scheibe ist das Zeichen.

9. **Wo** start.css `.ez-ansicht a:not([aria-current])::after` (detail-kopf) · **Was stört** Zwei Zeichen im Umschalter: Punkt links („hier“), Chevron rechts („weiter“); das Chevron gehört zur Linkzeile. · **Beheben** `.ez-ansicht` aus dem Selektor nehmen, Punkt bleibt. · **Warum** Ein Umschalter, ein Zeichen.

**Bleiben muss**
- Pfeil im Pillenkreis: 14 px, 1,8 px, mittig, 2 px Hover-Schub.
- Doto-Zahl auf dem Gerät mit Mini-Skala und violettem Zeiger: eine Punktzahl je Bildschirm.
- Stationen: Ring, gefüllter Punkt, großer Punkt mit Hof, Zustandspille „02“ – drei Zustände, ein Zeichen.

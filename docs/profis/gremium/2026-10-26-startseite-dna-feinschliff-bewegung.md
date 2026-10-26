# Bewegung und Rückmeldung (Noah Brandner)

Stand nach den Zwischenänderungen (Hysterese, Ratgeber-Hover, Chevron drin).

1. **Wo** start.js `zahlStart`, hero-0100 · **Was stört** Gerät steht ab 150 ms, Feld bis 450 ms leer („mm“ allein); dann zählt es ab 0, das „mm“ wandert mit der Breite. · **Genau so beheben** `setTimeout(zahlStart, 250)`, `data-von="1000"`, `tabular-nums` auf `.ez-schirm__zahl`; rastet bei 950 ms ein, Punkt 1000 und Etikett 1300 folgen. · **Warum** Rezept 8: einrasten, nicht zählen.

2. **Wo** start.css `.ez-schritte` · **Was stört** „02“ springt sofort in die Pillenform (display, padding, height), die Füllung blendet 320 ms nach; der Punkt animiert width/height. · **Genau so beheben** `.dna-schritte__zustand` immer `display: inline-flex; height: 24px; padding: 0 10px; border-radius: var(--rund-pille)`; Punkt aktiv 9 px mit `transform: scale(1.45); box-shadow: 0 0 0 3.5px`, Transition `transform` statt width/height. · **Warum** Nur transform, opacity und Farbe wechseln weich.

3. **Wo** index.html `.ez-stufe[data-dna-auftritt]` · **Was stört** Karte hebt sich 24 px, gleichzeitig steigt das Etikett im Bild 8 px. · **Genau so beheben** `.ez-stufe[data-dna-auftritt] { transform: none }`, Karte blendet nur (700 ms), das Etikett bleibt der einzige Weg. · **Warum** Je Bildschirm bewegt sich eine Sache von selbst.

4. **Wo** start.css `.ez-ratgeber span`, zustand-ratgeber-hover · **Was stört** Die Regel überschreibt den Knopf (display: block, tinte-2): Pfeil klebt grau oben links; Hover springt, weil der Baustein nur transform animiert. · **Genau so beheben** `.ez-ratgeber .dna-rund-knopf { display: grid; color: var(--tinte); transition: background-color 220ms ease, color 220ms ease, transform 220ms var(--dna-druck) }`. · **Warum** Rückmeldung braucht einen heilen Knopf.

5. **Wo** start.css `.dna-pille--leise:hover` · **Was stört** Ring verschwindet sofort, Indigo blendet 220 ms nach; auf der hellen Karte springt die Schrift auf Weiß. · **Genau so beheben** `.ez .dna-pille--leise` eigene Transition: `background-color, color, box-shadow` je `220ms ease`, `transform 220ms var(--dna-druck)`. · **Warum** Alle Kanäle synchron.

6. **Wo** start.css `.ez-leiste` · **Was stört** Abgang dauert wie der Auftritt 320 ms. · **Genau so beheben** `.ez-leiste { transition-duration: 220ms } .ez-leiste.ist-da { transition-duration: 320ms }`. · **Warum** Abgang 30–40 % kürzer.

7. **Wo** start.css `.ez-ansicht a` · **Was stört** Umschalter ohne Druckzustand, Hover-Farbe 320 ms. · **Genau so beheben** `.ez .dna-pillen a { transition: background-color 320ms var(--dna-druck), color 220ms ease, transform 220ms var(--dna-druck) }`, `:active { transform: scale(.97); transition-duration: 0s }`. · **Warum** Jedes Drückbare drückt; Rückmeldung 220 ms.

8. **Wo** start.js Stationen-`click`, `focusin` · **Was stört** Enter auf der Station und Tab unter dem Vorhang scrollen weich. · **Genau so beheben** Station `behavior: (reduziert || e.detail === 0) ? 'auto' : 'smooth'`; `focusin` immer `'auto'`. · **Warum** Tastatur nie animieren.

9. **Wo** dna/bundle.js `flip()` (Baustein, für die DNA) · **Was stört** Beim Zurückscrollen über die Schwelle wird `b` mit laufender Transformation gemessen, die Kachel springt. · **Genau so beheben** Nach `vorher`: `k.getAnimations().forEach(a => a.cancel())` für Kachel und `firstElementChild`, dann `aenderung()`. · **Warum** Unterbrechbares setzt aus der aktuellen Lage fort.

**Bleiben muss**
- Hero-Takte (Bühne 0/700, Wörter 70er-Staffel, Lead 420, Pille 490, Chips 560, Punkt 1000, Etikett 1300) und der neue z-index auf `.ez-hero__text`: ohne ihn fällt „Fenster“ ab 770 ms unter den Schein (Takte 1000–2000).
- Pille: Druck scale(.97) sofort, Rückkehr 220 ms `--dna-druck`, Pfeil +2 px nur mit Zeiger.
- Reduzierte Bewegung: Endbilder sofort, FLIP aus, Leiste ohne Transition, Zahl steht.

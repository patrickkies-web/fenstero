# Lena Hartwig · Bedienung im Kleinen

1. **Wo** start.js „Stationen anklickbar“, desk-04 · **Was stört** Stationen sind `li[role=link]` ohne Cursor und Hover: niemand erkennt die Sprungmarken, das `ol` verliert die Listenrolle. · **Genau so beheben** Je Station `<a href="#stufe-1">` im `li`, `role`/`tabindex` streichen; `cursor: pointer`, Hover `color: var(--tinte)` 320 ms. · **Warum** Echte Links bringen Rolle, Fokus und Ziel mit.

2. **Wo** start.css `.dna-rund-knopf:hover`, zustand-ratgeber-hover.png · **Was stört** Die ganze Zeile ist der Link, Hover und Druck reagieren nur auf dem Knopf. · **Genau so beheben** `.ez-ratgeber a:hover .dna-rund-knopf { background: var(--indigo); color: var(--weiss) }`, Titel unterstrichen (Abstand 3 px), `a:active .dna-rund-knopf { transform: scale(.94) }`. · **Warum** Rückmeldung gehört auf das ganze Ziel.

3. **Wo** index.html `.ez-wahl`, tel-05 · **Was stört** Drei `<button>` sehen bedienbar aus und tun nichts (Zeiger, toter Tipp); inaktiv 12 px Silbergrau auf Glas über Weiß ≈ 3,9:1. · **Genau so beheben** `<span>` statt `<button>`, `.ez-wahl { pointer-events: none }`, 13 px, inaktiv `color: var(--tinte)`. · **Warum** Was nichts tut, darf nicht nach Knopf aussehen; Text braucht 4,5:1.

4. **Wo** tel-07, Etiketten in `.ez-blatt` · **Was stört** „Öffnung · kleinstes Maß“ und „Bestellmaß“ überlagern sich und ragen aus der Karte. · **Genau so beheben** Unter 760 px: Öffnung `left:36%; top:84%`, Bestellmaß `left:60%; top:96%`, Linien `x2/y2` auf 36/84 und 60/96, `.ez-blatt { padding-bottom: 24% }`. · **Warum** Werte an der Sache bleiben ganz im Bild.

5. **Wo** `.dna-szene` (sticky), Tastatur · **Was stört** Shift+Tab in eine verdeckte Szene: der Fokusring liegt unter dem Vorhang, der Browser scrollt nicht. · **Genau so beheben** start.js bei `focusin`: trifft `elementFromPoint` in der Zielmitte nicht das Ziel, `scrollIntoView({ block: 'center' })`, bei „weniger Bewegung“ ohne smooth. · **Warum** Fokus darf nicht verdeckt sein (WCAG 2.4.11).

6. **Wo** bundle.css `.dna-pillen { overflow-x: auto }`, Umschalter · **Was stört** Polster 4 px, Ring 2 px + 3 px: der Fokusring wird beschnitten und erzeugt Scrollraum. · **Genau so beheben** `.ez-ansicht.dna-pillen { overflow: visible }`. · **Warum** Ein Ring, überall gleich.

7. **Wo** `.ez-marke` in Kopf, Leiste, Fuß · **Was stört** Zielfläche 30 px hoch. · **Genau so beheben** `.ez-marke { min-height: 44px; margin-block: -7px }`. · **Warum** 44 px für jedes Ziel.

8. **Wo** `.ez-fuss .dna-label`, detail-fuss.png · **Was stört** Spaltentitel als Indigo-Pillen, dieselbe Form wie die Badges „Pilotphase“ und „Für Fensterbauer“; keine Überschriften; „Betriebe“ und „Fensterbauer“ gemischt. · **Genau so beheben** `<h3 class="dna-label">` ohne Füllung in `tinte-2`; Spalte „Für Fensterbauer“: „Konfigurator“, „Preise“, „So funktioniert es“, „Tour“. · **Warum** Eine Form, eine Bedeutung.

9. **Wo** Pillen in Kopf, Leiste, Hero, Preis · **Was stört** „Jetzt konfigurieren“ und „Jetzt ausmessen“ führen beide nach /app/#ausmessen. · **Genau so beheben** Überall „Jetzt ausmessen“. · **Warum** Ein Ziel, ein Name; Messen ist der erste, kostenlose Schritt.

10. **Wo** index.html vor `main`, lokal.html `<html>` · **Was stört** Kein Skip-Link; `header`/`footer` liegen in `main`, also keine Landmarken; `lang` fehlt. · **Genau so beheben** `<a class="ez-skip dna-pille" href="#konfigurator">Zum Inhalt springen</a>`, sichtbar nur bei Fokus, fest oben links; `role="banner"` auf `.ez-kopf`, `role="contentinfo"` auf `.ez-fuss`; `<html lang="de">`. · **Warum** Landmarken und Sprache sind Grundausstattung.

## Bleibt

- Druck `scale(.97)` sofort, Rückkehr 220 ms, Pfeil 2 px, Leise-Pille Indigo: genau die DNA.
- Umschalter (Füllung und Punkt gegen Chevron) und Stationen (Form, Gewicht): ohne Farbe lesbar.
- Gerät als `role="img"` mit vollem Text, sprechende Alt-Texte, 44-px-Fußlinks, angeschnittener Chip zeigt das Wischen, Leiste stört nicht.

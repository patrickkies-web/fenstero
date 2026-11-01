# Ratgeber in der DNA, Detail-Profi Bewegung (28.10.2026)

Noah Brandner (Schule Emil Kowalski), getrennter Agent, eine Runde, Fassung X. Marke vor Emil. Zehn Befunde nach Wirkung:

| Vorher | Nachher | Warum |
| --- | --- | --- |
| 1. Fokus kann unter dem Vorhang liegen (Shift+Tab aus der nächsten Szene zurück, am Schreibtisch auch die Pillen im stehenden Einstieg) | `focusin` in ratgeber.js: liegt das Ziel unter einer anderen Szene, um die Überdeckung nach oben scrollen (`behavior: 'auto'`), sonst `scrollIntoView({ block: 'center', behavior: 'auto' })` | Marke: Fokus unter dem Vorhang holt sich ohne Gleiten in die Mitte (WCAG 2.4.11); `scrollIntoView` allein schob im Test das Ziel weiter unter den Vorhang |
| 2. Kein Druckfeedback auf dem iPhone (`:active` braucht in iOS-Safari einen `touchstart`) | leerer passiver `touchstart` an `body` in ratgeber.js; für Rechtstexte und Fehlerseite eine kleine Datei (CSP ohne Inline-Skript) | Druck ohne Verzögerung ist die wichtigste Rückmeldung am Telefon |
| 3. `backdrop-filter` auf der Leiste bei 94 % Deckkraft | Leiste deckend `var(--schwarz)` ohne Filter | Unschärfe unsichtbar, kostet beim Hochscrollen über klebenden Szenen jedes Bild (Mittelklasse-Android); DNA: Glas nur über Bild, Objekt oder Leuchten |
| 4. Leiste gleitet nach Sprüngen (Inhaltsverzeichnis, Belegnummern, Bild-auf) | Sprung größer als 80 % der Bildschirmhöhe setzt den Zustand ohne Übergang; erst lesen, dann schreiben | Marke: Tastatur löst nie Gleiten aus |
| 5. Weggeschobene Leiste bleibt fokussierbar | `.ez-js .rg-kopf:has(:focus-visible) { transform: none; transition-duration: 0s }` | Fokus sofort sichtbar, ohne Bewegung |
| 6. Vorhang-Maß nur bei resize/load; CSS-Variable auf der Lese-Szene | Höhe aus `100lvh`-Sonde, `ResizeObserver` auf beide Szenen, `top` direkt setzen | größte Höhe von Anfang an, nichts springt; Variable am Elternteil berechnet alle Kinder neu |
| 7. „Abschnitt im Blick“ in drei Takten (Punkt 320 ms, Text 220 ms, Gewicht springt und bricht neu um) | nur Farbe 320 ms, kein Gewichtswechsel; Hover 220 ms | Marke: Stationen wechseln nur über Farbe und Skalierung |
| 8. Ruhige Fassung schaltet alles ab, die Leiste steht dauernd | bei „weniger Bewegung“ Leiste nur blenden; Farb- und Füllwechsel bleiben | Marke: ruhige Fassung = nur Überblenden |
| 9. Antwort der Fragen erscheint hart | `.rg-frage[open] > div { animation: rg-antwort 220ms ease-out }` (nur Deckkraft), kein Höhen-Tween, kein `name=` | Marke: Karten blenden nur; Rückmeldung auf einen Tipp |
| 10. „Vertrag widerrufen“ springt beim Hover, kein `:active` | Übergang Hintergrund/Schatten 220 ms, Druck 0,97 ohne Verzögerung (Ratgeber und Rechtstexte) | jede Umriss-Pille reagiert gleich |

Bestanden: Hover nur für Maus; Druck ohne Verzögerung, Rückkehr 220 ms; Leiste 320/220 ms mit 24 px Hysterese; aktiver Punkt 320 ms mit `scale(1.45)`; nur transform, Farbe und Schatten animiert; keine Keyframes, unterbrechbar; kein `scroll-behavior: smooth`; keine Auftritte unterhalb des Einstiegs.
Knapp nicht in der Tabelle: Rundknöpfe auf Hell (Pfeil wechselt beim Hover vor dem Grund), Fokusring der Felder ohne Blende, `summary` im Fokusring der Bausteine ergänzen.

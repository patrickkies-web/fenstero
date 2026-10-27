# Detail-Profi „Bewegung“ (Schule Emil Kowalski) · Variante „große Bühne“ (27.10.2026)

Gelesen: brief.md, emil-design-eng, Zeitfolge, Bilder, start.css, start.js; Kurve `--dna-druck` nachgerechnet.

**Was stimmt:** Tasten drücken sofort auf 0,97 und gehen in 140 ms zurück; Halten 350 ms mit Haken, eine Ziffer oder „Zurück“ bricht es ab, Doppeltipp wirkungslos; keine ease-in; Blende als Transition umlenkbar; Hover nur hinter `(hover: hover)`; Tastatur-Ziffern ohne Übergang; Großansicht schließt sofort; die Linie als `clip-path`-Aufdecken ist zulässig.

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | Maß 2 → 3 dauert länger als 0,8 s (gemessen: Linie bei 910 ms fertig, Etikett A bei 843 ms); Etikett A kommt erst mit B, obwohl die Linie bei A beginnt. | `--verz` 120 → 60 ms; Ende A (Kappe und Etikett) `ez-folgt 160ms` mit Verzug `--verz`, Ende B mit `calc(120ms + --verz)`. Ergebnis 670 ms im Paar, 730 ms beim Wechsel. | Muss erfüllt; „von … bis“ in der richtigen Reihenfolge. |
| 2 | Langer Frame genau beim Wechsel (118 ms ohne Probe); vermutlich erste Dekodierung von `fenster-front.webp` und erzwungene Layouts in `messBuehneSetzen`. | Beide Ansichten in `messZeigen` vorab dekodieren (`img.decode()`); in `lagen.forEach` erst alle Lagen schreiben, dann lesen; auf echtem Telefon nachmessen. | Kein Hänger nach dem Haken. |
| 3 | Die Überblendung hellt in der Mitte auf (zwei Bilder blenden gegeneinander, Deckung nur etwa 75 %); rückwärts blendet die neue unter der alten. | `.ez-mess__bild.ist-an { z-index: 2 }`; `.ez-mess__bild.blendet:not(.ist-an) { transition: opacity 0s linear 220ms }`. | Ein Bild verwandelt sich ohne Aufhellen in das andere. |
| 4 | Die blasse Öffnungslinie wird mitgezogen und am Ende angeschnitten (sie liegt im geclippten SVG). | Geist und Führungslinien in ein zweites SVG ohne Clip; Geist sofort sichtbar, Führungslinien im Takt ihres Etiketts. | Das Alte bleibt stehen, nur das Neue bewegt sich. |
| 5 | Großansicht: Grund springt sofort ins Schwarz, Titel und Tasten rutschen hinter dem Dialog hoch, Lagen werden im skalierten Zustand gerechnet. | Backdrop mitblenden; Platzhalter mit der Höhe der Bühne; Animation erst nach dem Lagerechnen starten (Klasse `kommt`). | Öffnen wirkt wie Vergrößern derselben Bühne. |
| 6 | Die ruhige Fassung schneidet hart (Ansicht springt von schräg auf frontal). | In der ruhigen Fassung Deckkraft behalten: Blende der Ansicht, Feld und Enden 150 ms; nur Clip und Skalierung fallen weg. | Orientierung beim Wechsel bleibt. |
| 7 | Tastatur: Enter auf der fokussierten Pille, „Zurück“ und Großansicht per Tastatur animieren; gehaltenes Enter tippt erneut. | Tastatur am Klick erkennen (`e.detail === 0`) und ohne Übergang; `if (e.repeat) return;` vor `pilleTippen(true)`. | „Tastatur ohne Übergang“ lückenlos. |
| 8 | Die Pille wechselt ihre Bedeutung stumm; die Sperre ist unsichtbar; „Korrigieren“ steht 9 px rechts der Mitte. | Wort in `<span>`, beim Wechsel der Art 160 ms einblenden (nicht ruhig, nicht Tastatur); während der Sperre kein Druck; `#mess-weiter[data-art="korr"] { padding: 0 24px }`. | Bedeutungswechsel sichtbar, „Korrigieren“ mittig. |
| 9 | Ein Tipp aufs Bild während der Haltezeit öffnet die Großansicht mit dem alten Titel. | In `grossAuf` zuerst `if (mess.sperre) naechstes(true);`. | Jede neue Handlung beendet das Halten. |
| 10 | Kleinigkeiten: `.ez-gross-auf:active` drückt in 160 ms statt sofort; Pille federt 220 ms; die Notiz spricht noch von „gleitet in 400 ms“. | `transition-duration: 0s` beim Drücken, Pille 160 ms, Notiztext korrigieren. | Alle Knöpfe gleich, Notiz stimmt. |

Reihenfolge: 1 und 2 zusammen, dann 3 und 4, dann 5 bis 10.

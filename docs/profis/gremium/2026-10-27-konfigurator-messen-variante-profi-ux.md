# Detail-Profi „UX“ · Variante „große Bühne“ (27.10.2026)

Geprüft im Code (start.js, start.css, index.html) und mit Playwright auf lokal.html bei 390 × 844, 375 × 667, 360 × 680, 375 × 812, 414 × 736 und 1280 × 800.

**Was trägt:** alle Ziele ab 44 px (i-Ring über `::after`); Zurück über alle vier Maße bis zu den Fotos mit Ansage; Großansicht: Fokus auf ×, Esc schließt, Tab bleibt im Dialog; Doppeltipp auf „Weiter“ abgefangen; Ziffern während Halten oder Überblendung landen im nächsten Maß; „Groß ansehen“ mit Wort auffindbar; Tipp auf die Zahl tut nichts.

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | Ein Doppeltipp öffnet die Großansicht und schließt sie sofort wieder (120–150 ms); in der Großansicht schließt auch ein Tipp auf die Lupe. In der App heißt Doppeltipp bei „Foto groß ansehen“ Zoom. | Tipp aufs Bild schließt nicht mehr (nur ×, Pille, Esc); `cursor: default` in der Großansicht. Mindestens 600 ms Sperre nach dem Öffnen. | Hoch: Ältere bleiben in der Großansicht. |
| 2 | Die Warnung nennt Maß 1, die Pille „Korrigieren“ leert aber Maß 2. | Bei „Größer als die Öffnung“ heißt die Pille „Maß 1 prüfen“ (bzw. „Maß 3 prüfen“) mit Pfeil nach links und führt dorthin; „Stimmt so“ bleibt klein; bei „Sehr klein …“ bleibt „Korrigieren“. | Hoch: Rat und Handlung widersprechen sich sonst. |
| 3 | Bei Maß 3 und 4 verdeckt das leere Feld auf 375 × 667, 360 × 680, 375 × 812 und 414 × 736 beide Linienenden (die Lage unter der Linie stößt an „Groß ansehen“, der Rückfall ist mittig); bei 360 × 680 liegt es zudem über dem Knopf. | Lage unter der Linie rechts vom Knopf als Kandidat; im Rückfall eine Lage, die die Enden frei lässt; auf kleinen Telefonen „z. B.“ ausblenden. | Hoch: sonst fehlt beim ersten Blick Anfang und Ende. |
| 4 | Nach dem vierten Maß hängt eine neue Ziffer an („11.801“). | Im Zweig `mess.i === 3` `mess.ersetzen = true`. | Mittel bis hoch. |
| 5 | Großansicht während der Haltezeit zeigt Titel und Bühne zweier Maße. | In `grossAuf()` zuerst `if (mess.sperre) naechstes(true);`; Titel und Unterzeile der Großansicht bei jedem Maßwechsel mitsetzen. | Mittel. |
| 6 | Am Rechner öffnet Enter nach dem Schließen wieder die Großansicht (Fokus auf „Groß ansehen“). | Nach dem Schließen Fokus auf die Pille „Weiter“. | Mittel: sonst Schleife, Maß nicht gespeichert. |
| 7 | Keine Falle für die System-Zurück-Taste in der Großansicht. | Bei der Übernahme in `zurueckTaste()` und `escTaste()` der App eintragen. | Mittel bis hoch für die App. |
| 8 | Die Warnzeile ist zu hoch für ihren Platz (69 px in 52–54 px; bei 130 % Schrift überdeckt sie Label und Tasten). | `.ez-zeile.ist-warnung { height: auto; min-height: 52px }`; leiser Satz 14 px. | Mittel. |
| 9 | Screenreader: `#ez-live` ist inert, solange der Dialog offen ist; beim Maßwechsel fehlt, wo gemessen wird. | Eigene Statuszeile im Dialog; beim Maßwechsel die Unterzeile mit ansagen. | Mittel. |
| 10 | Zurück verwirft ein getipptes, noch nicht gespeichertes Maß ohne Hinweis. | Entwurf je Maß merken und beim Wiederkommen einsetzen. | Niedrig bis mittel. |

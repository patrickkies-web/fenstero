# Detail-Profi „Typografie“ · Variante „große Bühne“ (27.10.2026)

Grundlage: alle 14 Bilder, eigene Aufnahmen mit dreifacher Pixeldichte bei 390 × 844, 375 × 812, 375 × 667, 360 × 780 und 360 × 640; jeder Vorschlag im Testbrowser mit eingespritztem CSS oder HTML erprobt.

**Bleibt:** Zahl 36/300 gegen Titel 28/500; „Groß ansehen“ 13/500 in 44 px; Unterzeile 14/1,4; geschützte Leerzeichen fast überall richtig.

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | „mm“ steht oben statt auf der Grundlinie (27 px zu hoch), weil die Zahl `align-self: center` hat. | `.ez-mass__feld b { align-self: baseline }`, Innenabstand oben und unten 8 px (normal, klein, groß). | Hoch: Zahl und Einheit lesen sich als eine Maßangabe. |
| 2 | Warnzeile läuft über (vier Zeilen, 68,8 px in 52 px), weil der Kopf erst nach „).“ endet. | „Größer als die Öffnung. Maß 1 (1.410 mm) an der Mauer messen, nicht am Rahmen.“: Kopf einzeilig, Rest zweizeilig, 51,3 px bei allen Breiten. | Hoch: kritischster Moment, Tasten springen nicht. |
| 3 | Notiz-Knopf zerdrückt: die Regel `.ez-notiz` der Notizspalte trifft auch den Knopf (alle Folien). | `.ez-notiz:not(.dna-pille)`; gestapelt bewusst halten: `display: grid; justify-items: center; align-content: center; gap: 2px`. | Mittel bis hoch: sichtbarer Fehler neben dem Titel. |
| 4 | Bei 360 px ist der Titel zwangsweise zweizeilig (−18 px Bild). | Unter 375 px statt Umbruch Titel 26 px; alle Titel einzeilig erprobt. | Hoch für kleine Androids. |
| 5 | Abstände Bühne → Titel → Unterzeile → Karte: 105 px, davon 70 px Schrift; die 44 px Trefferfläche von „Notiz“ setzt die Untergrenze. | Bei 390 und 375 nicht weiter kürzen; mehr nur, wenn „Notiz“ die Titelzeile verlässt (Entscheidung des Inhabers). | Platz ist am Boden. |
| 6 | Umbrüche der Unterzeile trennen Zusammengehöriges („von Mauer | zu Mauer“, „der | Öffnung“ …). | Geschützte Leerzeichen in „Oberkante der Öffnung“, „samt Schwelle“, „von Mauer zu Mauer“, „von Außenkante zu Außenkante“. | Mittel: die zweite Zeile wird zur Anweisung. |
| 7 | Großansicht-Titel 26/600, auf der Folie 500. | 500. | Mittel: gleicher Satz, gleiche Stimme. |
| 8 | Lupen-Etiketten 13 px knapp für „ohne Brille“; der Zusatz trägt oft das entscheidende Wort. | 14 px, Zeile 1,2, Breite 120 px; klein bleibt 12 px. | Mittel bis niedrig. |
| 9 | (a) Chip „Schritt 3 von 6 ·Messen“ ungleiche Abstände; (b) „Bei 141,5 cm: 1415 tippen“ ohne Tausenderpunkt. | (a) `·&nbsp;Messen` und `margin-left: -3px`; (b) `tausend(cm * 10 + 5)`. | Niedrig. |
| 10 | Kartenlabel „Maß 1 von 4“ 13 px, G15 verlangt 12 px. | Nur für alle Folien zusammen (Schritt 1 ist mit 13 px angenommen). | Niedrig. |

**Hinweis für Zeichen und UX (gemessen):** Bei Maß 3 und 4 verdeckt das Zahlenfeld bei 390 px den unteren Rand beider Lupen (Feld y 178–230, Etiketten y 128–188).

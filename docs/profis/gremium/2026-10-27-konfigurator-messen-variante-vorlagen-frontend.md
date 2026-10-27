# Vorlagen-Abgleich „Frontend und Leistung“ · Variante „große Bühne“ (27.10.2026)

Gemessen mit Playwright/Chromium auf lokal.html bei 390 × 844 (Pixeldichte 3, CPU vierfach gedrosselt), 412 × 915 und 360 × 780.

**In Ordnung:** CLS ohne Eingabe etwa 0,0016, Höhe aus 100svh stabil bei der Adressleiste; Lupen als background-image desselben Bildes kosten keinen zusätzlichen Speicher (je Bild 11,5 MB dekodiert); Großansicht dekodiert nichts neu; 5 bis 8 Ebenen; Bildbytes 2 × 33 KB.

**Abgleich mit den Vorlagen:** Die Vorlagen (11 Domus, 04 Heeal) zeigen immer genau einen scharfen Zustand mit Werten an der Sache; die Folie zeigt beim Ansichtswechsel auf einem gedrosselten Telefon zwei Zustände zugleich.

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | Frontbilder fehlten für 5 von 6 Elementen (404; Bühne bei Maß 3 und 4 leer, Etiketten über dem Feld). Erzeuger nur im Scratchpad. | Nur Elemente mit Frontbild auf `-front` umschalten, sonst Schrägansicht; `onerror` als Rückfall; die fünf Frontansichten rendern; Erzeuger und Lagedaten ins Repo. | Halber Messschritt sonst kaputt; Grundlage für die App. |
| 2 | Großansicht ohne `cancel` geschlossen (Android-Zurückgeste, `close()`), danach ist die Bühne weg und die Tasten wirken nicht. | `gross.addEventListener('close', grossZu)`. | Kein Festfahren auf Android. |
| 3 | Ändert sich nur die Höhe, verrutschen Linien gegen Bild und Kappen (bis 55 px); hinter der Großansicht scrollt die Seite; am Schreibtisch bleibt der Dialog nach Größenänderung neben dem Gerät. | ResizeObserver auf die Bühne (Breite oder 100svh); SVG mit fester Pixelgröße; `html:has(.ez-gross[open]) { overflow: hidden; overscroll-behavior: none }`; Dialogrechteck neu rechnen. | Alles bleibt deckungsgleich, der Fuß sichtbar. |
| 4 | Lange Aufgaben genau zum Start der Bewegungen (Folie öffnen 107 + 115 ms, Maß 2 → 3 116 + 70 ms, Großansicht 95 ms); die Linie läuft über Clip-Pfad auf dem Hauptthread. | Erst lesen, dann schreiben; Lupengröße als Konstante; Lupenmitte rechnen statt messen; Platz für Titel einmal je Element und Breite; Lagen über `translate`; Linie über Compositor (Hülle mit `overflow:hidden` und gegenläufigem `translate`); Animationen erst im nächsten Frame starten. | Rückmeldung auf Mittelklasse-Android sichtbar. |
| 5 | Ansichtswechsel als Doppelbelichtung; Dekodierung startet erst im Wechsel; beide Messbilder laden schon auf Schritt 1. | Neues Bild oben von 0 auf 1, altes bleibt bei 1 bis `transitionend`; vorher `img.decode()` mit höchstens 150 ms; Frontbild im Leerlauf dekodieren; Messbilder erst ab Schritt 2 laden (`data-src`). | Ein Zustand zur Zeit, leichterer Start. |
| 6 | Speicher: beide vollen Dekodierungen (je 11,5 MB) bleiben; sichtbar ist nur ein Ausschnitt von etwa 1600 × 1110. | Auf die Vereinigung aller Kameraausschnitte beschneiden (etwa 1600 × 1330), spart rund 29 %. | Mehr Puffer auf Geräten mit wenig Speicher. |
| 7 | Für die Übernahme nicht robust: globale Listener, Probe-Div, Bühne wird in den Dialog umgehängt; Abweichungen zur App (Zentimeter-Rückfrage wartet in der App bei weniger Bewegung 0 ms; Warntext). | Als Modul mit `zerstoeren()` bauen, Dialog auf App-Ebene, Zustand in `S.mess`, Lage aus JSON; Abweichungen vor der Übernahme entscheiden. | Übernahme ohne Nebenwirkungen. |

**Noch zu korrigieren:** Die Notizspalte nennt „2,4-fach“ und „gleitet in 400 ms“; gebaut sind 2,6-fach und eine Überblendung von 220 ms.

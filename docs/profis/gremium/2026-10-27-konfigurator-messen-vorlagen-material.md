# Vorlagen-Abgleich Material und Licht: Konfigurator Schritt 3 „Messen“

**Was die Folie schon trägt:** Das Modell stammt aus den Wünschen. Gemessen ist die Putzwand #eee7dc gegen #ede5da, die Laibung hat oben ihren Schatten und das Glas seinen Verlauf. Die Maßlinie sitzt an den echten Kanten. Weiße Eingabekarte, Kapselreihe und die eine volle Pille führen Schritt 1 ohne Bruch fort.

**Urteil zur Tiefe:** Die Folie wirkt heute flacher als Schritt 1. Schritt 1 hat eine Mittelebene: die Anthrazit-Kacheln nach G14 mit violettem Licht und dazu das dunkle Foto mit Vignette. Auf der Messfolie gibt es nur hell gegen Schwarz, und zwei flache helle Blöcke (Bühne und Tastenkarte) nehmen gut die Hälfte des Bildschirms ein. Mit den Hebeln 1 bis 4 wäre sie mindestens so tief wie Schritt 1 und die Startseite.

Alle Werte gelten für `/home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.css`, Abschnitt „Schritt 3: Messen“ (ab Zeile 309).

## 1. Übergang Putzbühne zu Schwarz: Rand wie in den Wünschen, Licht nach außen, Kante als Laibung
- **Befund:** Der Putz springt ohne Rand auf #07090a. Gemessen: am linken Rand (213,206,196) und direkt daneben (7,9,10). Die Bühne wirkt dadurch wie ein ausgeschnittener Lichtkasten. Die Bühne der Wünsche hat einen 2 px breiten Ring in #2b2b2b zwischen dem Grund #161616 und dem Putz. In den Vorlagen 09 und 11 liegt eine helle Fläche immer in einem dunklen Rahmen mit Metallkante. Die Lichtkante `inset 0 1px 0 rgba(255,255,255,.55)` bleibt auf Putz wirkungslos.
- **Wie:**
  - `.ez-buehne--mess` (Z. 313) zusätzlich:
    `box-shadow: 0 0 0 2px var(--anthrazit), 0 0 0 3px rgba(255,255,255,.06), 0 0 72px -14px rgba(233,226,215,.14), 0 34px 60px -26px rgba(0,0,0,.9);`
    Damit hat die Bühne den Ring der Wünsche, eine Metallkante, die helle Wand gibt etwas Licht auf das Schwarz ab, und darunter liegt ein Schwebeschatten.
  - `.ez-buehne--mess .ez-buehne__kante` (Z. 314) ersetzen durch:
    `box-shadow: inset 0 0 0 1px rgba(7,9,10,.16), inset 0 12px 14px -12px rgba(7,9,10,.24), inset 0 -56px 64px -56px rgba(7,9,10,.22);`
    Die Bühne liegt dann wie in einer Laibung, mit dem Licht von oben wie im Render. Der obere Schatten reicht etwa 12 px und bleibt damit vor dem Sturz des Modells, der etwa 25 px unter der Oberkante liegt. Das Licht am Modell bleibt also unberührt.

## 2. Tastenkarte und Tasten nach G14: tonaler Abfall, Kante, Druck
- **Befund:** Die Karte ist durchgehend #fff. Die Tasten sind flach #f0f0f0, ohne Kante und ohne Schatten: gemessen 255 über der Taste, 240 auf der Taste, kein Übergang. Das sind elf flache Flächen auf etwa 40 % des Bildschirms. Die Vorlagen 07 (Verlaufskarte mit Innenkarte) und 03 (tonaler Abfall mit Lichtkante) zeigen, dass dort keine Fläche flach ist.
- **Wie:**
  - `.ez-karte--tasten`:
    `background: linear-gradient(180deg, var(--weiss) 0 58%, color-mix(in srgb, var(--silbergrau) 9%, var(--weiss))); box-shadow: inset 0 -1px 0 rgba(7,9,10,.06), 0 30px 56px -22px rgba(0,0,0,.85), 0 2px 6px rgba(0,0,0,.4);`
  - `.ez-taste`:
    `background: linear-gradient(180deg, color-mix(in srgb, var(--silbergrau) 8%, var(--weiss)), color-mix(in srgb, var(--silbergrau) 22%, var(--weiss))); box-shadow: inset 0 1px 0 var(--weiss), inset 0 0 0 1px rgba(7,9,10,.035), 0 1px 0 rgba(7,9,10,.09), 0 8px 14px -10px rgba(7,9,10,.28);`
    Die Tasten bleiben getönt und nie weiß.
  - `.ez-taste:active, .ez-taste.ist-gedrueckt`:
    `background: color-mix(in srgb, var(--silbergrau) 30%, var(--weiss)); box-shadow: inset 0 1px 3px rgba(7,9,10,.16);`
    Die Skalierung auf .97 und die Dauer 0s bleiben.
  - Für das Überfahren mit der Maus, in `@media (hover:hover)`: den Verlauf mit 12 % und 26 % statt der Vollfarbe.
  - `.ez-taste--fn, .ez-taste--leer { box-shadow: none; }`

## 3. Etiketten, Linie und Kappen auf hellem Grund: helles Glas statt dunkler Blöcke
- **Befund:** Auf der Bühne stehen drei dunkle Blöcke: der Chip und zwei Etiketten mit 118 px Breite, zweizeilig, in rgba(32,32,34,.92) und mit `backdrop-filter: none`. Sie wiegen schwerer als das Feld und decken in tel-04 den rechten Rahmen ab. Der dunkle Kranz der Linie (rgba(7,9,10,.6), 4,2 px) macht die Koralle trüb: Auf der Linie misst sie (109,92,87), das liest sich als graue Kette. Vorlage 11 (Domus) zeigt auf hellem Render helle Glas-Chips mit Punkt; Glas über einem Bild ist erlaubt.
- **Wie:**
  - `.ez-buehne--mess .ez-mass__ende .dna-etikett` (ersetzt die Regel in Z. 324):
    `background: rgba(255,255,255,.62); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.8); box-shadow: inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(7,9,10,.08), 0 8px 18px -10px rgba(7,9,10,.38); color: var(--schwarz); font: 500 .75rem/1.25 var(--font-sans); letter-spacing: .01em;`
    `max-width` und Umbruch bleiben wie bisher. Wahlweise ein Punkt von 6 px in Linienfarbe davor (Koralle, bei `[data-wer="el"]` Violett).
  - Der Schritt-Chip bleibt dunkel. Er ist der einzige dunkle Anker auf der Bühne, wie die Bedienknöpfe in den Wünschen.
  - `.ez-mass__halo`: `stroke: rgba(7,9,10,.32); stroke-width: 3.4;`
  - `.ez-mass__linie`: `stroke-width: 2.2;`
  - In beiden Regeln den Strich auf `stroke-dasharray: 6 4`.
  - `.ez-mass__kappe`: `box-shadow: 0 1px 2px rgba(7,9,10,.32);` statt des dunklen Rings.
  - Die Kontraste der Linien gegen den Putz danach mit den Messwerkzeugen aus `design-dna-eeziframes/werkzeuge` nachmessen. Koralle auf Putz hat ohne Kranz nur etwa 2:1.

## 4. Lichtteich hinter Bühne und Karte, damit die Schwebeschatten sichtbar werden
- **Befund:** Der Grund ist überall reines #07090a. Der Kartenschatten verschwindet: unter der Karte gemessen (2,3,3). Die Startseite setzt nach G14 einen Lichtteich #141517 hinter die Bühne (startseite-dna-vorschau/start.css, Z. 120). Schritt 1 hat auf dem Telefon ebenfalls keinen, gemessen (8,9,11). Vorlage 08 zeigt Karten in drei Ebenen vor Licht.
- **Wie:**
  - `.ez-folie[data-folie="messen"] { position: relative; isolation: isolate; }`
  - `.ez-folie[data-folie="messen"]::before { content: ""; position: absolute; inset: 0 -16px; z-index: -1; pointer-events: none; background: radial-gradient(60% 18% at 50% 22%, #141517, transparent 72%), radial-gradient(70% 24% at 50% 70%, #141517, transparent 72%); }`
  - Kein Weichzeichner. Am besten gleich als `.ez-folie::before` für alle Schritte setzen, sonst springt der Grund beim Wechsel der Folie.

## 5. Die Zahl als Held (G15, Vorlagen 04 und 10), mit ruhigerem Schatten auf Putz
- **Befund:** Die Zahl im Feld hat 28 px in 400 und ist damit kleiner als der Titel in 600. So stehen zwei schwere Elemente gegeneinander. Der Schatten in schwarz .75 und .35 legt auf dem warmen Putz einen grauen Schleier. In Heeal steht „3824“ und in Domus „12.4 kWh“ in 300 als Held.
- **Wie:**
  - `.ez-mass__feld`: `height: 54px; padding: 0 18px; gap: 6px; box-shadow: 0 0 0 1.5px var(--violett), 0 14px 26px -12px rgba(7,9,10,.40), 0 2px 4px rgba(7,9,10,.14);`
  - `.ez-mass__feld b`: `font: 300 2.125rem/1 var(--font-sans); letter-spacing: -.02em;`
  - `.ez-mass__feld small`: `margin-top: 10px;` (14 px bleiben).
  - `.ez-mass__marke`: `height: 26px;`
  - `.is-fehler` und `.ist-gespeichert` bekommen dieselben Schattenwerte, nur der Ring wechselt (Koralle 2 px bzw. Schwarz 1,5 px). Der leere Zustand bleibt bei 1rem.
  - `legen()` in `start.js` (Z. 334 ff.) misst `offsetWidth`, das Feld wird also neu gesetzt. Im gespeicherten Zustand (etwa 180 px breit) liegt es wie heute auf der Linie.

**Geprüft:** tel-01, tel-03, tel-04, tel-06, desk-01, vorbild-modell-wuensche.png und das Modellbild `bilder/mess/fenster-1.webp`; aus den Vorlagen 03, 04, 07, 09 und 11; die Untergrenzen Startseite und Schritt 1. Farbwerte habe ich an den Bildschirmfotos gemessen. Keine Dateien geändert; die Ausschnitte für den Vergleich liegen in /tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/jv/.

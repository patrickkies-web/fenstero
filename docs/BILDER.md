# Bilder: die Bildsprache der Beiträge auf der Website

Die Website zeigt an festen Plätzen Fotos in der Bildsprache der Instagram-Beiträge: **ein Tier oder ein Astronaut tut etwas
Menschliches rund ums Fenster**, fotorealistisch, in einem warmen, modernen Wohnraum mit großem Fenster, Licht wie am späten
Nachmittag. Das Bild erzählt die Aussage der Seite (messen, wählen, vergleichen), der Text daneben bleibt sachlich. Jedes Foto
liegt in einer Karte mit Rand, unten eine Reihe Haken-Chips; es liegt nie vollflächig hinter Text (docs/GESTALTUNG.md).

## So kommen die Fotos auf die Seite

1. Bild erzeugen (Prompt unten; Bildgenerator nach Wahl, etwa der, mit dem die Beiträge entstanden sind), mindestens 1.200 × 1.500 px
   (4:5) bzw. 1.600 × 1.000 px (16:10). Das Bild wird mittig auf das Format beschnitten; das Motiv gehört in die Mitte, unten bleibt
   Platz für die Chips.
2. Datei nach `fotos-roh/<name>.jpg` (oder .png, .webp) legen; der Ordner bleibt außerhalb von Git.
3. `python3 scripts/fotos.py` erzeugt `web/bilder/foto/<name>.webp` in der richtigen Größe (WebP, Qualität 82, etwa 100 bis 250 KB).
4. Einchecken und veröffentlichen. Die Seiten verweisen schon auf die Dateien; bis dahin steht dort ein Platzhalter („Foto folgt“).

Die drei Motive aus den Beiträgen können direkt wiederverwendet werden: der Waschbär auf dem Sofa (Beitrag „Wünsche antippen.“)
→ `app-start`, der Astronaut („Aufmaß in 384.400 km.“) → `start-fensterbauer`, der Oktopus mit Kaffee an der Hebe-Schiebe-Tür
(„Auch ganz groß.“) → `gross`, der Oktopus mit Farbfächer (Reel „Acht Arme. Kein Plan.“) → `weg-auswaehlen`.

## Die Plätze

| Name | Format | Wo | Chips auf dem Foto | Priorität |
|---|---|---|---|---|
| `start-hauseigentuemer` | 1200 × 1500 | Startseite, Ansicht Hauseigentümer, Startbild neben der Überschrift (Telefon: unter den Knöpfen) | Maße · Öffnungsart · Farbe · Glas | 1 |
| `start-fensterbauer` | 1200 × 1500 | Startseite, Ansicht Fensterbauer, Startbild | Maße · Fotos · Öffnungsarten · Positionen | 1 |
| `app-start` | 1200 × 1500 | App, Startbild vor dem ersten Fenster | Fotografieren · Messen · Wünschen | 1 |
| `gross` | 1200 × 1500 | Startseite Hauseigentümer, Abschnitt „Auch ganz groß.“ | Elementarten | 1 |
| `fuer-fensterbauer` | 1200 × 1500 | Seite /fuer-fensterbauer/, oben | Maße · Fotos · Positionen · Bestellmaß | 1 |
| `ratgeber` | 1600 × 1000 | Übersicht /ratgeber/, über dem Weg | Prüfen · Entscheiden · Auswählen · Ausmessen · Vergleichen · Einbauen | 2 |
| `weg-pruefen` | 1600 × 1000 | Ratgeber, Schritt 1 (Übersicht; in den Seiten als Bild in „Nächster Schritt“) | – | 2 |
| `weg-entscheiden` | 1600 × 1000 | Ratgeber, Schritt 2 | – | 2 |
| `weg-auswaehlen` | 1600 × 1000 | Ratgeber, Schritt 3 | – | 2 |
| `weg-ausmessen` | 1600 × 1000 | Ratgeber, Schritt 4 | – | 2 |
| `weg-vergleichen` | 1600 × 1000 | Ratgeber, Schritt 5 | – | 2 |
| `weg-einbauen` | 1600 × 1000 | Ratgeber, Schritt 6 | – | 2 |
| `fehler` | 1600 × 1000 | Fehlerseite 404 | – | 3 |

## Prompts

Gemeinsamer Stil für alle Bilder, an jeden Prompt anhängen:

> Photorealistic advertising photograph, cozy modern living room with a large window, warm late-afternoon light, golden hour
> outside, shallow depth of field, 35 mm lens look, subtle film grain, cinematic but natural colour grading, highly detailed fur
> and textures, calm composition with the subject centred and some empty space at the bottom, no text, no logos, no watermark,
> no people. Aspect ratio 4:5. (für breite Plätze: 16:10)

Deutsch dazu, falls der Generator Deutsch besser versteht: „Fotorealistisches Werbefoto, gemütliches modernes Wohnzimmer mit
großem Fenster, warmes Licht am späten Nachmittag, goldene Stunde draußen, geringe Schärfentiefe, 35-mm-Look, leichtes Filmkorn,
natürliche Farben, ruhige Komposition, Motiv mittig, unten etwas Luft, kein Text, keine Logos, keine Menschen.“

| Name | Motiv (deutsch) | Prompt |
|---|---|---|
| `start-hauseigentuemer` | Ein Waschbär steht am Fenster und misst mit einem gelben Zollstock die Breite der Maueröffnung; das Handy lehnt am Fensterbrett. | A raccoon standing on a wooden stool at a living-room window, carefully measuring the width of the window opening with a yellow folding rule, concentrated expression, a smartphone leaning against the windowsill showing nothing in particular, tape of the folding rule stretched across the frame |
| `start-fensterbauer` | Astronaut misst ein Fenster aus, draußen der Mond (vorhandenes Bild) | An astronaut in a white spacesuit measuring a window with a yellow tape measure inside a cosy living room; through the window the grey lunar surface and the Earth rising in a black sky, warm lamp light inside |
| `app-start` | Waschbär auf dem Sofa tippt auf dem Handy (vorhandenes Bild) | A raccoon lounging on a beige sofa, holding a smartphone with both paws and tapping on the screen, relaxed, a big window with a garden behind |
| `gross` | Oktopus mit Kaffeetasse an der offenen Hebe-Schiebe-Tür (vorhandenes Bild) | A friendly orange octopus standing upright beside a wide open lift-and-slide patio door, holding a white coffee cup in one tentacle, another tentacle resting on the door frame, terrace and garden in golden light outside |
| `fuer-fensterbauer` | Ein Bernhardiner als Fensterbauer am Schreibtisch, prüft ein Aufmaß auf dem Tablet, im Hintergrund die Werkstatt mit Fensterrahmen | A Saint Bernard dog sitting at a workshop desk like a craftsman, wearing a work vest, looking at a tablet that shows a simple window drawing with dimensions, pencil behind the ear, window frames leaning against the wall of the bright workshop behind |
| `ratgeber` | Eule mit Lesebrille am Fenster liest auf dem Tablet | An owl wearing small round reading glasses perched on the back of an armchair by a window, reading attentively on a tablet, soft afternoon light, bookshelf blurred in the background |
| `weg-pruefen` | Katze prüft mit Taschenlampe eine beschlagene Scheibe | A tabby cat on a windowsill holding a small flashlight in its paw, inspecting a fogged-up window pane with condensation droplets, curious expression, morning light |
| `weg-entscheiden` | Fuchs am Küchentisch mit Taschenrechner und Fensterprospekt | A red fox sitting at a kitchen table with a calculator and a window brochure, chin resting on one paw, thinking, a window with garden view behind |
| `weg-auswaehlen` | Oktopus mit Farbfächer, Fensterprofilen und Handy (vorhandenes Bild aus dem Reel) | An orange octopus at a table holding a colour fan deck, a white window profile sample, a pencil and a smartphone in different tentacles, slightly overwhelmed but cheerful, bright living room |
| `weg-ausmessen` | Biber misst mit dem Zollstock eine Balkontür | A beaver standing in front of a floor-to-ceiling balcony door, measuring its height with a yellow folding rule, one paw at the top of the frame, concentrated, terrace outside in warm light |
| `weg-vergleichen` | Eule vergleicht mit der Lupe zwei Angebote | An owl at a desk by the window comparing two printed offers side by side through a magnifying glass, one talon on each sheet, serious expression, warm lamp light |
| `weg-einbauen` | Bär in Arbeitskleidung setzt ein Fenster ein | A brown bear in a craftsman's work jacket carefully setting a new white window frame into a brick wall opening from inside the room, a roll of sealing tape nearby, daylight through the opening |
| `fehler` | Katze sitzt in einem Fensterrahmen, der allein auf einer Wiese steht | A cat sitting calmly inside a single freestanding white window frame that stands alone in a green meadow, no wall around it, soft evening light, slightly surreal |

Hinweise zur Auswahl: Das Tier schaut nie in die Kamera wie ein Maskottchen, sondern tut etwas; ein Werkzeug je Bild (Zollstock,
Tablet, Lupe); nichts Gefährliches, keine Baustellenchaos-Szenen; die Fensterrahmen weiß oder anthrazit wie echte Fenster;
nichts, was wie ein Logo oder Text aussieht (der Generator schreibt sonst Kauderwelsch auf Tablets und Prospekte: dann ein Bild
ohne Bildschirm wählen oder den Bildschirm leer lassen).

## Technik

- WebP, 4:5 1.200 × 1.500 px (angezeigt bis 560 px breit, also scharf auf Bildschirmen mit doppelter Dichte), 16:10 1.600 × 1.000 px.
- `<img>` immer mit `width`, `height` und einem beschreibenden `alt` (ein Satz, was auf dem Bild passiert), `decoding="async"`;
  unter dem ersten Bildschirm `loading="lazy"`, das Startbild mit `fetchpriority="high"`.
- `/bilder/*` ist für die Bildersuche freigegeben (kein `noindex`); die Fotos stehen in den strukturierten Daten nicht als `image`,
  dort bleiben die Zeichnungen.
- Die Prüfsuite verlangt für Bilder in Ratgebern Breite, Höhe und einen Alternativtext ab 40 Zeichen; Fotos unter `/bilder/foto/`
  dürfen WebP sein, Zeichnungen bleiben SVG.

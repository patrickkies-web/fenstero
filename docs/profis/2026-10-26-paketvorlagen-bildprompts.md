# Bild-Prompts für die Paket-Vorlagen (26.10.2026)

Für die Fotoplätze der Landingpages in Essential Plus und Signature (Essential hat laut Paket keine Fotos des Betriebs, dort
bleibt die Bühne von eeziframes). Zwei Beispielbetriebe, beide erfunden: **Fenster Ostermann, Bremen** (Palette Petrol, Tiefsee,
Gischt, Leuchtturmrot) und **Fensterbau Brandt, Köln** (Gold). Die Prompts sind für Ostermann geschrieben; für Brandt jeweils die
letzte Zeile „Für Brandt“ statt der Farbzeile einsetzen.

Bildsprache nach der Design-DNA: echtes Material, hartes Licht, fast unbunt, Farbe nur als ein Akzent des Betriebs; keine Figuren,
keine Tiere, keine Astronauten (B2), keine erfundenen Siegel, Firmenschilder oder lesbaren Logos (das Logo setzt die Seite selbst).
Personen nur, wo der Platz sie braucht (Team, Montage, Porträt), natürlich und nicht gestellt, Gesichter nie ganz scharf im Vordergrund
außer beim Porträt. Kein Text im Bild, kein Wasserzeichen.

## Ablage und Formate

| Platz | Datei | Format, mindestens | Was im Bild passiert | Was die Seite darüberlegt |
| --- | --- | --- | --- | --- |
| Foto 1, Bühne im Hero | `bilder/buehne-<betrieb>.webp` | 4 : 3, 2000 × 1500 | dunkler Boden im harten Fensterlicht, das Fensterkreuz fällt schräg auf den Boden | das Telefon mit dem Konfigurator liegt darauf (links unten bis Mitte), oben das Domain-Etikett |
| Foto 2, groß | `bilder/foto-2-werkstatt.webp` | 4 : 3, 1600 × 1200 | Werkstatt | Glas-Chip oben links, unten eine Zeile Text auf dunklem Verlauf |
| Foto 3 | `bilder/foto-3-montage.webp` | 4 : 3, 1200 × 900 | Montage am Haus | Glas-Chip oben links |
| Foto 4 | `bilder/foto-4-team.webp` | 4 : 3, 1200 × 900 | Team | Glas-Chip oben links |
| Foto 5 | `bilder/foto-5-ausstellung.webp` | 4 : 3, 1200 × 900 | Ausstellung | Glas-Chip oben links |
| Foto 6, breit | `bilder/foto-6-referenz.webp` | 3 : 1, 2400 × 800 | fertiges Haus von außen | Glas-Chip oben links |
| Porträt Ansprechpartner | `bilder/person.webp` | 1 : 1, 768 × 768 | Inhaber, Brustbild | rund beschnitten, 36 bis 52 px |

Alle Motive mittig halten; oben links und unten bleibt ruhiger Raum für Chip und Text. Nach dem Erzeugen auf höchstens 1600 px Breite
(Bühne 1000 px wie heute) als WebP mit Qualität 82 speichern; die Vorlagen tauschen dann `bilder/buehne.webp` und die
Platzhalter der Fotokacheln aus.

## Gemeinsamer Stil (an jeden Prompt anhängen)

```
Photorealistic editorial photograph, real materials, hard natural daylight with crisp shadows, almost monochrome palette of charcoal black, anthracite, white plaster and silver grey, one restrained accent colour only, shallow depth of field, 35 mm lens, subtle film grain, calm composition with the subject centred and quiet space at the top left and at the bottom, no text, no logos, no signage, no watermark, no animals, no mascots.
```
Farbzeile Ostermann: `The single accent colour is a deep petrol teal (#2fa792), appearing only on one object.`
Für Brandt: `The single accent colour is a warm muted gold (#d8ad55), appearing only on one object.`

## Prompts

**Foto 1, Bühne (Hero, beide Pakete mit Fotos).** Was es tut: Es ist der Boden, auf dem das Telefon des Betriebs liegt; Licht und
Material, keine Geschichte.
```
Top-down angled view of a dark smoked-oak floor in a quiet living room, hard late-afternoon sunlight falls through a large window and casts the sharp shadow of a window cross (two by two panes, rounded corners) diagonally across the floor from upper left to lower right, the lit panes bright, the rest of the floor deep shadow, fine wood grain visible in the light, the lower left half of the frame stays dark and empty, nothing on the floor. 4:3.
```
(Für Brandt wie heute: dunkler Beton statt Eiche.)

**Foto 2, Werkstatt.**
```
A tidy window workshop, a finished white double-casement window with a petrol-coloured frame edge stands upright on a workbench, aluminium profiles and a cutting table in soft focus behind, a craftsman's gloved hand checks a corner joint with a square, face not visible, hard side light from a high skylight. 4:3.
```

**Foto 3, Montage.**
```
Exterior of a north-German red-brick terraced house, two fitters in dark workwear set a new white window into the opening from a low scaffold, seen from the street at a slight angle, faces turned away, a petrol-coloured transport strap on the frame, clear cold morning light. 4:3.
```

**Foto 4, Team.**
```
Four people of a small window company stand loosely in front of their workshop door in dark workwear, natural poses, talking, faces softly out of focus, one wears a petrol beanie, overcast light, honest documentary feel, not a staged group portrait. 4:3.
```

**Foto 5, Ausstellung.**
```
A small window showroom, three window samples in different frame colours (white, anthracite, oak) mounted side by side on a light grey wall, one sample with a petrol-coloured handle detail, polished concrete floor, hard spot light from above, no people, no price tags. 4:3.
```

**Foto 6, Referenz (breit).**
```
Wide street view of a renovated Bremen town house (Bremer Haus) with tall new white sash-style windows, the front garden fence and pavement in the foreground, low winter sun from the left, calm sky, the house centred, petrol-coloured front door as the only accent. 3:1, wide panorama crop.
```
(Für Brandt: Kölner Altbau mit Stuckfassade, goldfarbener Briefkasten als Akzent.)

**Porträt des Ansprechpartners.**
```
Head-and-shoulders portrait of a friendly window craftsman in his forties, short beard, dark work jacket, standing in a workshop doorway, soft natural light from the side, background dark and blurred, looking slightly past the camera, approachable and calm, square 1:1.
```
(Für Brandt: Inhaberin Mitte fünfzig, kurze graue Haare, dunkle Strickjacke.)

## Was die Seiten schon ohne Fotos zeigen

Bis die Fotos da sind, stehen in der Muster-Ebene schraffierte Plätze mit „Foto folgt“; Kunden sehen Essential und alle Fotoplätze
ohne Foto gar nicht (beim echten Betrieb erscheinen nur Kacheln mit Foto). Die Bühne zeigt bis dahin das neutrale Bild von eeziframes.

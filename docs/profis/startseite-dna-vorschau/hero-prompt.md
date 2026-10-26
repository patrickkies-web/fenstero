# Bildprompt für den Hero der Startseite (Ansicht Hauseigentümer)

Zweck: das Foto als Bühne im Kopf der neuen Startseite. Davor stehen (als Oberfläche, nicht im Bild) das gekippte Handy mit dem Messbildschirm und ein Glas-Etikett „Öffnung · Höhe 1.409 mm“ am Zollstock. Das Foto muss deshalb rechts unten (Schreibtisch) bzw. links unten (Telefon) ruhig sein und das Motiv in der Mitte bis rechts tragen.

- Format: 3:2, mindestens 2400 × 1600 px (Schreibtisch zeigt einen 4:3-Ausschnitt, Telefon 3:2; das Motiv liegt zwischen 35 % und 85 % der Breite, der Zollstock senkrecht bei etwa 75–80 % der Breite, sein oberes Ende bei etwa 35 % der Höhe, dort hängt das Etikett).
- Palette: Das Bild zählt als Farbfläche. Darum fast unbunt: Schwarz und Anthrazit (Raum, Schatten), Weiß und Silbergrau (Wand, Laibung, Rahmen). Ein einziger warmer Fleck ist erlaubt (Koralle): das Streiflicht auf der Hand oder dem Zollstock. Kein Orange, kein Blau, keine „golden hour“.
- Licht: eine Quelle, Tageslicht von rechts oben durch das Fenster, 5000 K, Schatten nach links unten; alle Lampen aus. Schwarz bei Luma 18–24, Bildrand läuft ohne Kante ins Dunkle aus, Clipping höchstens 1 %, nie am Motiv.
- Kamera: Augenhöhe, 50 mm, f/2.8, Senkrechte senkrecht, Fokus auf Hand und Zollstock; das Fenster scharf, der Raum weich.
- Kein Text, kein Logo, kein Wasserzeichen, kein Handy im Bild (das kommt als Oberfläche darüber), keine Baustelle, keine Gefahr.
- Nach dem Erzeugen mit `python3 -I .claude/skills/premium-gestaltung/bildlicht.py bild.webp` messen; Ziel: Schwarz 18–24, Lichtfarbe neutral bis leicht warm, Farbigkeit C* bis 20.

## Prompt (Flux, Englisch, zum Kopieren)

```
Photorealistic editorial photograph, 3:2. Interior of a lived-in German home: a calm room with an old white double-casement window set deep in a plastered wall, the window reveal (Laibung) clearly visible. A homeowner's hand holds a yellow folding rule (Zollstock) vertically against the inner edge of the window reveal, measuring the opening height; only the forearm and hand are in frame, no face. The window sits in the center-right of the frame, the folding rule standing upright at about three quarters of the width, its top end around the upper third. The lower left quarter and the lower right corner of the frame stay quiet and dark, with plain wall and shadow, no objects. Single light source: cool-neutral daylight at 5000 K from the window at the right, falling in from the upper right, shadows dropping to the lower left, every lamp in the room off, the rest of the room fading into deep charcoal black. Almost monochrome palette: charcoal black, anthracite, white plaster, silver grey; the only warm note is a small rim light on the hand and the yellow rule. Eye level, 50 mm lens, f/2.8, verticals perfectly vertical, sharp focus on the hand, the rule and the window frame, the room behind softly out of focus. Macro texture: fine plaster grain on the reveal, satin uPVC profile with a thin specular edge, real glass reflections of the daylight. Filmic low-key grade, charcoal blacks, neutral shadows, creamy highlights, moderate saturation, fine 35 mm grain. No text, no logo, no watermark, no phone, no construction site, no tools other than the folding rule.
```

## Variante mit der Figur des Inhabers (Waschbär, falls gewünscht)

Ersetze im Prompt den Satz mit der Hand durch:

```
A photorealistic raccoon stands on a wooden step stool at the window, reaching up with one paw to hold a yellow folding rule vertically against the inner edge of the window reveal, measuring the opening height; the other paw rests on the sill. The raccoon is in the center-right of the frame, its fur rim-lit by the window.
```

Alles andere (Licht, Kamera, Palette, ruhige Ecken, kein Handy im Bild) bleibt gleich.

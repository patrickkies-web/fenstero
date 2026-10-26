# Bühne der Landingpage: Beton im Fensterlicht

Was das Bild tut: Es ist die Bühne von eeziframes (Licht fällt durch ein Fenster in einen dunklen Raum, wie das Zeichen von
eeziframes). Darauf liegt als Oberfläche, nicht im Bild, das Telefon mit dem Konfigurator des Betriebs (G4, G7, G10). Fast
unbunt, damit die Farbe des Betriebs aus dem Gerät kommt. Erzeugt am 26.10.2026 mit FLUX 1.1 pro Ultra (api.bfl.ai, Modus
„raw“, 4:3, 2368 × 1792), dritter von drei Durchläufen; beschnitten (x 180, y 225, 2089 × 1567, oben links ein Fensterrahmen
entfernt) und auf 1000 × 750 verkleinert (WebP, Qualität 80).

## Prompt

```
Photorealistic still life photograph, 4:3, looking down at a steep angle onto a smooth matte dark charcoal concrete floor in a dim, empty room. Hard late-afternoon sunlight falls through an unseen tall window and projects one large crisp window-shaped patch of light onto the concrete, covering about half of the frame: a long skewed rectangle of light divided into four panes by the thin cross-shaped shadow of the window mullions, running diagonally from the lower left towards the upper right, centred, its edges razor sharp. Everything outside the light patch falls off into deep near-black shadow with a soft vignette. Fine matte concrete texture with tiny pores visible in the light, no reflections, no tiles, no seams. Almost monochrome: black, anthracite, silver grey, the light a neutral white with a barely warm tint. Minimal editorial product photography stage, empty, no objects, no furniture, no phone, no people, no text, no logo, no watermark, no colored light, no blue tint.
```

## Für das nächste Rendering (Abgleich mit den Vorlagen, Material 5, offen)

Das jetzige Bild hat Sprenkel in der Lichtfläche (±25 Tonstufen), zwei Nahtlinien und eine weiche Lichtkante (etwa 20 von 1000 px).
Zusatz für den Prompt: „raking low sunlight at 15° elevation reveals fine sandblasted concrete relief, every pore with its own tiny
shadow; no speckles, no terrazzo flecks, no seams, no lines“. Ziel: Kante höchstens 8 von 1000 px, Streuung höchstens ±10;
Nachbearbeitung hellster Wert #d8d6d7, Schwarzpunkt #07090a, Korn 2 %. Bildschnitt und Lage des Kreuzes gleich halten, sonst
`--k1` und `--k2` in start.css neu rechnen.

# A · Jonas Veit (Art Director)

**Gemeinsamkeit.** In allen zwölf Vorlagen ist keine Fläche flach: Jede dunkle Karte hat einen tonalen Abfall nach unten und eine ein Pixel helle Lichtkante oben, jedes Glas zeigt die Kante, an der Licht bricht. Das Licht ist fotografisch und gerichtet (Streiflicht, Kontaktschatten, Bokeh, Korn), das Gerät ein Körper mit Metallkante und Spiegelung auf einer Bühne aus Beton, Seide oder Lichtabfall, nie auf reinem Schwarz. Bei uns stimmen Konzept, Zahlenkontrast (88/15 px) und Luft; es fehlt die Oberfläche: Anthrazit als Füllung, simples CSS-Handy, gleichmäßig helles Platzhalterfoto, Renderings ohne Boden.

## 1 Gerät und Bühne (Hero)
**Wo:** `.dna-geraet`, `.ez-schein`, `.ez-hero__buehne`.
**Was:** Metallkante: `box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), inset 0 0 0 2.5px rgba(7,9,10,.7), 0 1px 0 rgba(255,255,255,.3), var(--schatten-tief)`; Rahmen `linear-gradient(160deg, #35353a, #141416 25%, #0b0b0c 60%, #222225)`. Spiegelung: `.dna-geraet__schirm::after { background: radial-gradient(90% 60% at 18% 0%, rgba(255,255,255,.12), transparent 60%) }`. Bühne: `.ez-hero__buehne::before { inset: -20%; background: radial-gradient(55% 45% at 68% 45%, #141517, transparent 72%) }` (Grau zwischen Anthrazit und Schwarz); `.ez-schein` auf `opacity: .5; filter: blur(40px)`.
**Warum:** Kante und Spiegelung machen aus dem Rechteck einen Körper; der graue Lichtteich löst es vom Nichts, der violette Fleck wird Lichtabfall statt Klecks.
**DNA/Palette:** ja, nur Tonwerte, Leuchten radial.

## 2 Lichtkante und tonaler Verlauf auf dunklen Karten
**Wo:** `.ez-stufe`, dunkle `.dna-bento__kachel`, `.ez-blatt`, `.ez-schirm__glut`, `.ez-fb`.
**Was:** `background: radial-gradient(120% 90% at 18% 0%, #363638, var(--anthrazit) 55%, #1c1c1e); box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 0 0 1px rgba(255,255,255,.045)` (Anthrazit ±10–15 %).
**Warum:** Switch-Karten und Domus-Kachel wirken wie Material, weil Licht von oben einfällt; unsere Fläche ist eine Füllung.
**DNA/Palette:** ja, Nuancen von Anthrazit.

## 3 Hero-Foto
**Wo:** `bilder/hero.webp`, `.ez-foto::after`.
**Was:** Prompt ergänzen: 50 mm, f/2 (Fenster und Zollstock scharf); Streiflicht von rechts, −0,7 EV, Schatten links unten bis #07090a, hellster Putz höchstens #d8d6d7, Sättigung 15 % außer dem Glint am Zollstock, Korn 2 %, Vignette −1 EV. CSS: `inset 0 1px 0 rgba(255,255,255,.14), inset 0 -90px 120px -60px rgba(7,9,10,.75)`.
**Warum:** Die Koch-App lebt vom Hell-Dunkel; unser Foto ist gleichmäßig hell und bunt, davor glänzt weder Etikett noch Gerät.
**DNA/Palette:** ja (G7, G10, ein warmer Fleck).

## 4 Renderings mit Boden
**Wo:** `bilder/reihe/*.webp`, `.ez-fenster__bild`.
**Was:** Neu rendern: einheitlich 15° Dreiviertelansicht, Key-Light oben rechts, Glanzkante am Profil, Glas spiegelt graues Studio (Silbergrau nach Weiß), nicht Himmelblau. Kontaktschatten: `.ez-fenster__bild::after { inset: auto 12% 4%; height: 12%; border-radius: 50%; background: radial-gradient(rgba(7,9,10,.22), transparent 70%); filter: blur(6px) }`. Kachelrand `color-mix(in srgb, var(--silbergrau) 50%, var(--weiss))`.
**Warum:** Objekte ohne Schatten schweben wie Clipart; das blaue Glas liegt zudem außerhalb der Palette.
**DNA/Palette:** ja, danach sogar strenger.

## 5 Glas mit Lichtkante, Zeichen in Glaskreisen
**Wo:** `.dna-etikett`, `.dna-etikett__punkt`, `.dna-rund-knopf`.
**Was:** `--glas: rgba(32,32,34,.62); border-color: rgba(255,255,255,.18); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(7,9,10,.4), var(--schatten-glas)`. Kreise: `background: radial-gradient(at 30% 20%, rgba(255,255,255,.16), rgba(255,255,255,.04) 70%); box-shadow: inset 0 1px 0 rgba(255,255,255,.22)`.
**Warum:** Bei Domus und der Koch-App sieht man das Foto durch das Glas und die Kante, an der es bricht; unser Etikett ist ein grauer Chip.
**DNA/Palette:** ja, Glas bleibt über Bild und Objekt.

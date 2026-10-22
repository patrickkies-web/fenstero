# Highlights „Für Fensterbauer“: Prompts für Bild, Bewegung und weitere Screens

Stand 21.10.2026. Grundlage: `marketing/highlights/storyboard.json` (20 Screens in 6 Kapiteln), `marketing/highlights/BEITRAGS-LINIE.txt`, `docs/GESTALTUNG.md`, `docs/BILDER.md` und die drei vorhandenen Fotos in `web/bilder/foto/`.

Diese Datei sammelt alle Prompts, mit denen andere KIs Fotos, Bewegung und weitere Screens für die Story-Highlights liefern. Wer einen Prompt ändert, ändert ihn hier. So bleibt die Reihe einheitlich.

Zwei Regeln gelten für jedes Bild und jeden Text:

- Gezeigt und behauptet wird nur, was die App wirklich kann. Belege stehen je Screen in `storyboard.json` unter `belege`.
- Preise nur dauerhaft gültig und netto, nie befristete Einführungspreise oder Stichtage. Die Highlights bleiben dauerhaft stehen.

## Übersicht

| Screen | Kapitel | Headline | Foto-Slot | Prompts |
|---|---|---|---|---|
| h01 | Warum | Aufmaß ohne Anfahrt. | `h01-foto`, vorhanden (start-fensterbauer) | 3.1 |
| h02 | Warum | 975 € oder 108 €. | kein Foto | 4 |
| h03 | Link | In 4 Klicks bereit. | `h03-foto`, neu | 3.2 |
| h04 | Link | Ein Name genügt. | kein Foto | 4 |
| h05 | Link | Absender: Sie. | kein Foto | 4 |
| h06 | Link | Sie sehen, wer misst. | kein Foto | 4 |
| h07 | Kunde misst | Ihr Kunde misst. | `h07-foto`, vorhanden (start-hauseigentuemer) | 3.3 |
| h08 | Kunde misst | Zwei Fotos je Fenster. | kein Foto | 4 |
| h09 | Kunde misst | Das kleinste Maß zählt. | kein Foto | 4 |
| h10 | Alles drin | Bis ins Detail. | `h10-foto`, vorhanden (app-start) | 3.4 |
| h11 | Alles drin | Auch ganz groß. | kein Foto | 4 |
| h12 | Alles drin | Auch rund und schräg. | kein Foto | 4 |
| h13 | Alles drin | Bis zur Fensterbank. | kein Foto | 4 |
| h14 | Ergebnis | Aufmaß kommt sortiert. | `h14-foto`, neu | 3.5 |
| h15 | Ergebnis | Was zu klären ist. | kein Foto | 4 |
| h16 | Ergebnis | Bestellmaß vorgerechnet. | kein Foto | 4 |
| h17 | Ergebnis | Als PDF in Ihrer Farbe. | kein Foto | 4 |
| h18 | Ergebnis | Nachbessern kostenlos. | kein Foto | 4 |
| h19 | Preise | Links kosten nichts. | `h19-foto`, neu | 3.6 |
| h20 | Preise | Link statt Anfahrt. | kein Foto | 4 |

Begleittexte für alle 20 Screens und der Link-Sticker stehen in Abschnitt 6.

## Ablauf

1. **Foto erzeugen** (Abschnitt 3): Nano Banana Pro, Referenzfotos anhängen, Seitenverhältnis 4:5, Auflösung 2K oder 4K. Das Ergebnis muss mindestens 1120 × 1400 px haben, wie die vorhandenen Fotos. Steht im Werkzeug keine Auswahl für das Seitenverhältnis bereit, steht „vertical 4:5“ schon im Prompt. Warum 4:5 und nicht 9:16, steht in Abschnitt 1 unter „Komposition“. Nimmt das Werkzeug kein WebP an, die Referenz vorher umwandeln: `ffmpeg -i web/bilder/foto/start-fensterbauer.webp start-fensterbauer.png`.
2. **Prüfen** (Prüfliste unten). Im Zweifel neu erzeugen, nicht retuschieren.
3. **Ablegen** als PNG unter `/home/user/fenstero/marketing/highlights/bilder/<slot>.png`, also z. B. `bilder/h03-foto.png`. Den Ordner bei Bedarf anlegen. JPG oder WebP vorher umwandeln: `ffmpeg -i ergebnis.jpg marketing/highlights/bilder/h03-foto.png`.
4. **Neu rendern und prüfen** im Repo-Wurzelordner: `cd /home/user/fenstero && RASTER=1 node marketing/highlights/render.mjs`. Das Foto steht randlos oben und läuft weich in #161616 aus, wie `.hero-foto` in `web/assets/portal.css`. Kopfzeile, Kicker, Headline, Lead und Chips stehen erst darunter auf dem dunklen Grund. Ein Slot-Foto steht oben bündig (Ausschnitt `50% 0%`). Das `--ef-fp` im Screen (h14 `50% 22%`, h19 `50% 10%`) gilt nur für das Ersatzfoto und muss nicht geändert werden. `render.mjs` meldet je Foto, welche Zeilen des Fotos in der Gesichtszone liegen. In `out/raster-<screen>.png` ist die Gesichtszone türkis umrandet: Gesicht und Pfote mit Werkzeug müssen darin liegen, nichts davon in den oberen 250 px. Sitzt das Gesicht etwas zu tief, am `<img>` im Screen `data-fp="50% 4%"` setzen (höherer Wert schiebt das Foto nach oben) und noch einmal rendern. Sitzt es zu hoch, neu erzeugen.
5. **Optional bewegen** (Abschnitte 3 und 4): Kling, Bild zu Video, 5 s. Ablage-Vorschlag: `/home/user/fenstero/marketing/highlights/video/<screen>.mp4`.

**Prüfliste vor dem Ablegen**

- Kein Buchstabe, keine Ziffer, kein Logo, kein Wasserzeichen. Auch nicht auf Transporter, Tasse, Papier oder Werkzeug.
- Bildschirme zeigen vom Betrachter weg oder sind dunkel und leer.
- Figur wie im Referenzfoto: Fellfarbe, Gesicht, Latzhose, Gürtel. Pfoten mit Krallen, keine Menschenhände, keine zusätzlichen Finger.
- Format 4:5, mindestens 1120 × 1400 px.
- Oberes Fünftel (bis 19 % der Bildhöhe) nur Raum, Decke und Licht, kein Gesicht. Kopf und Augen bei 19 bis 26 % der Bildhöhe, die Pfote mit dem Werkzeug direkt darunter bis 32 %. Darunter ruhig, ab etwa der Bildmitte dunkel.
- Fertige Fensterrahmen weiß oder anthrazit.
- Keine Menschen, kein Baustellenchaos, nichts Gefährliches.
- Bär und Waschbär nie im selben Bild.

## 1. Stil-Bibel

### Besetzung

**Der Bär ist der Fensterbauer, also der Betrieb.** Referenz: `web/bilder/foto/start-fensterbauer.webp`.

- Großer brauner Grizzly mit dichtem, zotteligem, rotbraunem Fell, im Gegenlicht mit hellen Spitzen. Hellere, sandbraune Schnauze, kleine runde Ohren. Freundlicher, konzentrierter Ausdruck, gern ein leichtes Lächeln. Er steht oder sitzt aufrecht wie ein Handwerker und benutzt die Pranken wie Hände, die Krallen sind sichtbar.
- Kleidung: Arbeitslatzhose aus braunem bis sandfarbenem Canvas mit Gebrauchsspuren, dunkle Gurtbänder mit Metallschnallen, Brusttasche. Darunter kein Hemd, die Arme sind Fell. Breiter Werkzeuggürtel aus Leder mit Hammer im Halter, gelb-schwarzem Maßband, Schraubendrehern mit gelben und roten Griffen.
- Ein Werkzeug je Bild in der Pranke: Tablet (Rückseite zum Betrachter), Smartphone (Display zu ihm), Kaffeebecher ohne Aufdruck. Ein gelber Zollstock darf in der Nähe liegen.
- Orte: helle Holzwerkstatt mit hohen Sprossenfenstern in weißen Rahmen, Lochwand mit Werkzeug, Hobelbank aus hellem Holz, Sägespäne am Boden, Hängelampe mit warmem Licht. Fertige Fenster in weißen und anthrazitfarbenen Rahmen lehnen an der Wand oder liegen auf Böcken. Draußen Nadelbäume und Hügel. Dazu der Hof mit Vordach und einem einfarbigen Transporter ohne Beschriftung und das kleine Büro mit Glasscheibe zur Werkstatt.
- Handlung: Er arbeitet in seiner Werkstatt. Er fährt nicht raus und steht nie beim Kunden.
- Hinweis zu h03: Das Storyboard nennt dort ein „Hemd mit hochgekrempelten Ärmeln“. Damit die Figur gleich bleibt, trägt der Bär wie im Referenzfoto kein Hemd.

**Der Waschbär ist der Hauseigentümer, also der Kunde.** Referenzen: `web/bilder/foto/start-hauseigentuemer.webp` und `web/bilder/foto/app-start.webp`.

- Waschbär mit schwarzer Augenmaske, graubraunem Fell, geringeltem Schwanz und schmalen, dunklen Pfoten mit Fingern. Aufmerksam, ein wenig stolz, nie albern.
- Beim Messen: Werkzeuggürtel aus Leder mit Hammer, gelb-schwarzem Maßband und rotem Stift, ein roter Zimmermannsbleistift hinter dem Ohr, ein schwarzes Smartphone in der Pfote (Display zu ihm), ein gelber Zollstock mit schwarzen Teilstrichen an der Maueröffnung.
- Zu Hause ohne Gürtel: auf einem beigen Sofa mit grünem Strickplaid, Kaffeetasse, Pflanzen, Leselampe.
- Orte: das eigene Haus im Umbau (Maueröffnung mit rohem Ziegel und Putzkanten, Tritt aus Holz mit Farbspritzern, Abdeckvlies, draußen ein Gerüst) oder ein gemütliches Wohnzimmer mit großem Fenster.
- Handlung: misst, fotografiert, tippt Wünsche ein, lehnt sich zurück. Mehrere Waschbären im Bild sind möglich (wie in app-start).

**Regel:** Bär und Waschbär stehen nie gemeinsam im Bild. Das ist die Aussage der Reihe: Es gibt keine Anfahrt. Keine Menschen und keine weiteren Tiere in dieser Reihe.

### Licht

- Warm: goldene Stunde, tief stehende Sonne durch große Fenster oder ein offenes Tor, Gegenlicht im Fell, Sägespäne oder Staub glänzen im Licht.
- Alternativ natürliches, weiches Fenstertageslicht wie in start-hauseigentuemer. Warme Lampen innen als Zweitlicht.
- Schatten weich. Im Motiv nichts abgesoffen, zu den Rändern und nach unten hin tief und dunkel.
- Kein Blitz, kein Studiolicht, keine farbigen Effektlichter.

### Kamera

- 35-mm-Look, offene Blende (etwa f/1.8 bis f/2.8), geringe Schärfentiefe: scharf sind Augen und die Pfote mit dem Werkzeug, Vorder- und Hintergrund weich.
- Kamera auf Augenhöhe der Figur oder knapp darunter, gerade Linien, keine Weitwinkelverzerrung.
- Leichtes Filmkorn, natürliche, leicht gedeckte warme Farben: Honigholz, Ocker, Bernstein, gedämpftes Grün.

### Komposition: Format 4:5, Motiv oben

Neue Fotos im Hochformat 4:5 erzeugen, mindestens 1120 × 1400 px, wie die vorhandenen Fotos in `web/bilder/foto/`. Nicht aus einem Querformat schneiden. Ein 9:16-Foto bringt nichts: Der Screen zeigt ohnehin nur das obere Band.

So zeigt `render.mjs` ein Foto: randlos ab der Oberkante der Bühne, 1080 px breit, über der Kopfzeile (`object-fit: cover`). Ein 4:5-Foto wird dabei 1350 px hoch. Ein Slot-Foto steht oben bündig (Ausschnitt `50% 0%`), seine Zeilen liegen also fast 1:1 auf der Bühne (Faktor 0,96 bei 1120 px Breite). Bis 56 % der Fotofläche ist es voll sichtbar, danach läuft es bis zu deren Ende ganz in #161616 aus. Das Foto liegt nie hinter Text. Die Fotofläche ist je Slot verschieden hoch, weil der Text darunter verschieden lang ist. Gemessen am 21.10.2026 (y in px von oben auf der Bühne 1080 × 1920):

| Slot | Fotofläche | voll sichtbar bis | Deckkraft 72 % bei | ganz ausgeblendet bei | davon gezeigt bei 4:5, oben bündig |
|---|---|---|---|---|---|
| h01 (vorhanden) | y 0 bis 783 | 438 | 542 | 783 | obere 58 % |
| h03 (neu) | y 0 bis 783 | 438 | 542 | 783 | obere 58 % |
| h07 (vorhanden, 1:1) | y 0 bis 703 | 394 | 486 | 703 | obere 52 % (beim vorhandenen 1:1-Foto 65 %) |
| h10 (vorhanden) | y 0 bis 865 | 484 | 598 | 865 | obere 64 % |
| h14 (neu) | y 0 bis 651 | 364 | 450 | 651 | obere 48 % |
| h19 (neu) | y 0 bis 623 | 349 | 431 | 623 | obere 46 % |

Daraus folgt die Komposition. Sie passt in jeden der sechs Slots:

| Bühne (y von oben) | im 4:5-Foto (Anteil der Höhe, Zeilen bei 1120 × 1400) | Was dort liegt | Inhalt im Foto |
|---|---|---|---|
| 0 bis 250 | 0 bis 19 % (0 bis 260) | Bedienleiste von Instagram: Fortschrittsbalken, Profilname | Raum, Decke, Licht; kein Gesicht, keine Pfote |
| 260 bis 350 | 19 bis 26 % (270 bis 363) | in jedem Slot voll sichtbar | Kopf und Augen |
| 350 bis 430 | 26 bis 32 % (363 bis 446) | Ausblendung beginnt, in h19 noch 72 % Deckkraft, sonst mehr | Pfote mit dem einen Werkzeug, die Handlung |
| 430 bis Ende der Fotofläche (623 bis 865) | 32 bis 46 % (h19) bzw. 64 % (h10) | Ausblendung bis ganz durchsichtig | ruhige, dunkler werdende Flächen: Oberkörper, Tischkante, Boden |
| darunter bis 1670 | ab 46 bis 64 % | kein Foto mehr: Kopfzeile, Kicker, Headline, Lead, Chips auf #161616 | wird nicht gezeigt; trotzdem ruhig und dunkel halten, falls ein Text kürzer wird |
| 1670 bis 1920 | entfällt | Bedienleiste von Instagram | entfällt |

- Das Tier ist deshalb von etwas weiter weg zu sehen als in den vorhandenen Fotos (Halbtotale), der Kopf ist klein im Bild. Die Ohren dürfen knapp in die oberen 19 % ragen, Augen und Schnauze nicht.
- Ändert sich ein Text auf einem Foto-Screen, ändert sich die Fotofläche. `render.mjs` meldet die aktuellen Werte bei jedem Lauf, `RASTER=1` zeigt die Gesichtszone.
- Links und rechts fällt das Bild natürlich ins Dunkle (Schatten, Wände). Oben darf Licht sein.
- Eine Handlung je Bild, ein Werkzeug in der Pfote. Das Tier tut etwas und schaut nicht wie ein Maskottchen in die Kamera.
- Keine kräftig grünen und keine großen cremeweißen Flächen im unteren Teil. Sie würden mit dem grünen Signal und der Cream-Pille der Grafik konkurrieren.

### Was nie ins Bild kommt

- Text, Ziffern, Logos, Markennamen, Wasserzeichen, Schilder, Kennzeichen, Beschriftung am Transporter.
- Lesbare Bildschirme oder App-Oberflächen. Bildschirme zeigen vom Betrachter weg oder bleiben dunkel und leer. Der Kamerasucher ohne Schrift im vorhandenen Foto app-start bleibt die einzige Ausnahme.
- Fertige Fensterrahmen in anderen Farben als Weiß oder Anthrazit. Rohes Holz nur als unfertiges Werkstück im Hintergrund.
- Menschen oder Menschenhände, Comic- oder 3-D-Figurenlook.
- Baustellenchaos, laufende Maschinen, Funken, Gefahr.

## 2. Master-Prompt (EN) und Negativliste

Den Master-Prompt jedem neuen Foto-Prompt voranstellen. Die Prompts in Abschnitt 3 enthalten ihn bereits in verdichteter Form und sind auch allein vollständig.

```text
Photorealistic advertising photograph for a calm, premium craft brand. An anthropomorphic animal does a real human task around windows with quiet competence: a brown grizzly bear is the window maker in his own carpentry workshop, a raccoon is the homeowner in his own house. Warm golden-hour sunlight or soft natural window daylight, warm practical lamps as fill light, gentle backlight in the fur, fine sawdust or dust glowing in the light. Shot on a 35 mm lens at f/2, shallow depth of field, focus on the eyes and on the paw holding the one tool, softly blurred foreground and background, subtle film grain, natural, slightly muted warm colours: honey wood, ochre, amber, muted green. Real, highly detailed fur, believable proportions, paws with visible claws. Finished window frames are white or anthracite. Vertical 4:5 composition, medium-wide shot from a little further back, so the animal's head is small in the frame: the top fifth of the frame shows only the room, the ceiling and the light; the head sits just below it, between one fifth and one quarter of the way down from the top edge, and the paw with the one tool directly below the head, so the whole action stays within the upper third; below that the scene becomes calm and low in detail, and from the middle of the frame downward it falls off into deep, warm, near-black shadow; the left and right edges fade into darkness. Any screen faces away from the camera or is dark and blank. No text, no letters, no numbers, no logos, no signage, no watermark, no people.
```

**Negativliste** (für Werkzeuge mit eigenem Feld; bei Nano Banana Pro, das kein Negativfeld hat, die Kurzfassung als „Avoid: …“ an den Prompt hängen, wie in Abschnitt 3):

```text
text, letters, numbers, captions, subtitles, watermark, signature, logo, brand name, lettering on vehicles, license plate, signage, readable screen, user interface on screens, app icons, glowing screen facing the camera, people, human hands, human face, extra limbs, extra fingers, fused paws, deformed claws, duplicated animals, cartoon, 3D render, CGI look, plastic fur, oversaturated colours, neon light, HDR halo, heavy lens flare, fisheye distortion, tilted horizon, motion blur on the subject, head near the top edge, face in the top fifth, close-up, bright or cluttered lower half, white floor, coloured window frames, construction chaos, sparks, running power tools, mascot pose looking into the camera, collage, split screen, border, frame, rounded corners, artificial vignette overlay, gradient overlay
```

## 3. Foto-Slots

Sechs Slots: drei vorhandene Fotos (h01, h07, h10) und drei neue (h03, h14, h19). Für die vorhandenen gilt laut Storyboard das Foto aus `web/bilder/foto/`. Sie brauchen keinen Ausbau: `render.mjs` zeigt ohnehin nur ihr oberes Band (h01 die oberen 58 %, h07 die oberen 65 %, h10 mit Ausschnitt `50% 18%` die Zeilen bei 6 bis 71 % der Höhe), den Auslauf nach unten erzeugt die Ausblendung. Für diese drei Slots steht hier deshalb nur der Kling-Prompt.

Referenzbilder werden in den Prompts nach ihrem Inhalt benannt, nicht nummeriert. Nano Banana Pro kennt keine Reihenfolge.

Für alle Slots gleich:

- **Format:** 4:5, mindestens 1120 × 1400 px, besser 2K oder 4K. PNG. Komposition wie in Abschnitt 1: Kopf bei 19 bis 26 % der Bildhöhe, Handlung bis 32 %.
- **Ablage:** `/home/user/fenstero/marketing/highlights/bilder/<slot>.png`
- **Neu rendern und prüfen:** `cd /home/user/fenstero && RASTER=1 node marketing/highlights/render.mjs`, dann `out/raster-<screen>.png` ansehen (Ablauf, Schritt 4).
- **Kling:** Bild zu Video, 5 s, kein Endbild, Startbild ist das fertig gerenderte PNG des Screens (1080 × 1920). Das Rohfoto im Format 4:5 ergäbe kein Story-Video. Der Prompt lässt den dunklen Teil mit dem Text stillstehen. Negativ-Prompt für alle Foto-Screens:

```text
text changes, morphing letters, new text, warping, wobble, flicker, fast motion, camera shake, zoom out, rotation, scene cut, extra animals, people, human hands, extra limbs, deformed paws, screen turning toward the camera, glowing screen, vehicle moving
```

### 3.1 `h01-foto` · h01 „Aufmaß ohne Anfahrt.“ (vorhanden)

- **Datei, nur für ein anderes Foto:** `h01-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h01-foto.png`
- **Quelle laut Storyboard:** `web/bilder/foto/start-fensterbauer.webp` (1120 × 1400, 4:5), im Screen als Ersatzfoto `bilder/bar-werkstatt.webp`. Kein neues Foto nötig.
- **Im Screen:** Fotofläche y 0 bis 783, voll sichtbar bis 438, Ausschnitt `50% 0%`.
- **Motiv:** Der Bär sitzt in seiner Werkstatt an der Hobelbank und prüft ein Aufmaß auf dem Tablet, hinter ihm lehnen fertige Fensterrahmen im goldenen Abendlicht.

**Kling** (5 s):

```text
Very slow, steady push-in of the camera, about 5 percent over 5 seconds, locked and level, no shake. The bear at the workbench taps once on the tablet with one claw, looks up briefly with a content smile and turns back to the tablet. Sawdust drifts slowly through the golden light, the sun flickers softly through the pine trees outside the windows. Window frames, tools and workbench stay still. The tablet keeps its back to the camera. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

### 3.2 `h03-foto` · h03 „In 4 Klicks bereit.“ (neu)

- **Datei:** `h03-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h03-foto.png`
- **Bis dahin:** h03 zeigt statt des Bärenfotos aus h01 das Link-Icon (`aufnahmen/h03-ersatz-link.svg`). Liegt das Foto in `bilder/`, rendert `render.mjs` es ohne weitere Änderung.
- **Format:** 4:5, mindestens 1120 × 1400 px, besser 2K oder 4K.
- **Im Screen:** Fotofläche y 0 bis 783, voll sichtbar bis 438, ganz ausgeblendet bei 783. Gezeigt werden die oberen 58 % des Fotos. Kopf bei 19 bis 26 %, Smartphone bis 32 % der Bildhöhe.
- **Referenz:** start-fensterbauer.webp für Figur, Kleidung, Werkstatt und Licht.
- **Motiv:** Der Bär steht in seiner Werkstatt neben einem Fensterrahmen auf zwei Böcken und tippt entspannt auf sein Smartphone, durch das offene Tor sieht man den Firmentransporter, der heute stehen bleibt.

**Nano Banana Pro:**

```text
Use the brown grizzly bear from the attached golden-hour workshop photo as the same character: same shaggy reddish-brown fur, same face and lighter muzzle, same tan canvas bib overalls with dark straps, metal buckles and chest pocket, same leather tool belt with hammer, yellow tape measure and screwdrivers, no shirt. Take the bright wooden workshop, the warm light and the colour grading from that photo as well. Vertical 4:5 photograph, medium-wide shot from a little further back. The bear stands upright in his workshop beside a finished white window frame lying flat on two wooden trestles, relaxed, holding a black smartphone at chest height in one paw and tapping it with a claw of the other paw; the phone screen faces him and is turned away from the camera; calm, satisfied expression. Behind him on the right the large workshop door stands open, and outside in the yard a plain white van without any lettering is parked in the evening sun. Warm, low golden-hour light falls in through the open door, backlight in his fur, sawdust floating in the beams. 35 mm lens at f/2, shallow depth of field, focus on his face and paws, subtle film grain, natural warm colours. Composition: the top fifth of the frame shows only the workshop ceiling with its beams and the warm light; his head sits just below it, between one fifth and one quarter of the way down from the top edge, and the phone in his paws directly below his head, so head and phone stay within the upper third of the frame; the open door with the van stands at the same height behind him. Below his chest the scene becomes calm: the trestles and the workshop floor with a little sawdust fall into warm, near-black shadow, and the lower half is an even dark shadow; dark edges left and right. No text, no letters, no numbers, no logos, no people.
Avoid: readable screen, lettering or logo on the van, license plate, human hands, extra fingers, cartoon look, close-up, head near the top edge, bright lower half.
```

**Kling** (5 s):

```text
Very slow push-in toward the bear, locked and level, no shake. The bear taps the phone screen once with a claw as if pressing send, lowers the phone a little, glances toward the open door and the parked van, then gives a small, content nod. Sawdust drifts through the golden light. The van stays parked and does not move. The phone screen stays turned away from the camera. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

### 3.3 `h07-foto` · h07 „Ihr Kunde misst.“ (vorhanden)

- **Datei, nur für ein anderes Foto:** `h07-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h07-foto.png`
- **Quelle laut Storyboard:** `web/bilder/foto/start-hauseigentuemer.webp` (1250 × 1250, quadratisch), im Screen als Ersatzfoto `bilder/waschbaer-tritt.webp`. Kein neues Foto nötig.
- **Im Screen:** Fotofläche y 0 bis 703, voll sichtbar bis 394, Ausschnitt `50% 0%`.
- **Motiv:** Der Waschbär steht auf einem Tritt und misst mit dem gelben Zollstock die Maueröffnung, in der anderen Pfote das Handy.

**Kling** (5 s):

```text
Very slow push-in toward the raccoon, locked and level, no shake. The raccoon slides one paw a little way down along the yellow folding rule, reads the mark, then glances at the phone in its other paw with a small, satisfied twitch of the whiskers. Its ringed tail sways slightly, fine dust floats in the daylight. The folding rule stays straight and rigid, the phone screen stays turned toward the raccoon. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

### 3.4 `h10-foto` · h10 „Bis ins Detail.“ (vorhanden)

- **Datei, nur für ein anderes Foto:** `h10-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h10-foto.png`
- **Quelle laut Storyboard:** `web/bilder/foto/app-start.webp` (1120 × 1400, 4:5), im Screen als Ersatzfoto `bilder/waschbaeren-sofa.webp`. Kein neues Foto nötig.
- **Im Screen:** Fotofläche y 0 bis 865, voll sichtbar bis 484, Ausschnitt `50% 18%`.
- **Motiv:** Drei Waschbären im Wohnzimmer: Einer fotografiert die Maueröffnung samt Zollstock, einer tippt auf dem Sofa seine Wünsche ins Handy, einer lehnt sich zurück.

**Kling** (5 s):

```text
Very slow push-in toward the raccoon on the sofa, locked and level, no shake. That raccoon taps its phone twice with a claw and gives a small, content nod; the raccoon leaning back breathes calmly and its ringed tail twitches once; the raccoon in the foreground holds its phone steady. Warm light shimmers softly through the leaves at the window. No screen changes or brightens. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

### 3.5 `h14-foto` · h14 „Aufmaß kommt sortiert.“ (neu)

- **Datei:** `h14-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h14-foto.png`
- **Format:** 4:5, mindestens 1120 × 1400 px, besser 2K oder 4K.
- **Im Screen:** Fotofläche y 0 bis 651, voll sichtbar bis 364, ganz ausgeblendet bei 651. Gezeigt werden die oberen 48 % des Fotos. Kopf bei 19 bis 26 %, Blatt, Pfote und Tasse bis 32 % der Bildhöhe. Das `--ef-fp: 50% 22%` im Screen gilt nur dem Ersatzfoto, das Slot-Foto steht oben bündig.
- **Referenz:** start-fensterbauer.webp für Figur, Kleidung und Licht.
- **Motiv:** Der Bär sitzt im kleinen Büro seiner Werkstatt am Holzschreibtisch und prüft ein ausgedrucktes Aufmaßblatt mit Fensterzeichnungen, daneben Tablet, Zollstock und Kaffeetasse, hinter der Glasscheibe die Werkstatt mit gestapelten Fensterrahmen.
- **Achtung:** Das Blatt zeigt nur einen blauen Kopfbalken und Linienzeichnungen ohne Schrift und ohne Ziffern. Das Tablet zeigt die Rückseite.

**Nano Banana Pro:**

```text
Use the brown grizzly bear from the attached golden-hour workshop photo as the same character: same shaggy reddish-brown fur, same face and lighter muzzle, same tan canvas bib overalls with dark straps and metal buckles, same leather tool belt, no shirt. Keep the warm light and colour grading of that photo. Vertical 4:5 photograph, medium-wide shot from a little further back. The bear sits at a sturdy wooden desk in the small office of his workshop, leaning forward with a focused, content look, one paw resting on a printed A4 sheet that shows only a plain blue header band and simple line drawings of window outlines with dimension lines, without any letters or numbers. Beside the sheet a tablet stands in a case with its back to the camera, a folded yellow carpenter's folding rule and a plain white coffee mug with a thin wisp of steam. Behind him a large interior glass pane looks into the workshop, where finished white and anthracite window frames stand stacked in warm evening light, softly out of focus. A warm desk lamp as fill light, low golden sun from the workshop windows. 35 mm lens at f/2, slightly high eye-level view onto the desk, shallow depth of field, focus on his eyes and the paw on the sheet, subtle film grain. Composition: the top fifth of the frame shows only the glass pane with the softly lit workshop behind it; his head sits just below it, between one fifth and one quarter of the way down from the top edge, and the desk top with the sheet, his paw and the mug directly below his head, so the whole action stays within the upper third of the frame. Below the desk edge the frame becomes calm and dark: the front of the desk and the floor fall into warm, near-black shadow, and the lower half is an even dark shadow; dark edges left and right. No text, no letters, no numbers, no logos, no people.
Avoid: readable text on the paper, numbers in the drawings, glowing screen facing the camera, printed mug, human hands, extra fingers, cartoon look, close-up, head near the top edge.
```

**Kling** (5 s):

```text
Very slow push-in toward the bear at the desk, locked and level, no shake. The bear runs one claw slowly along a drawn window outline on the sheet, gives a small, satisfied nod and reaches for the coffee mug. Thin steam rises from the mug, the light in the workshop behind the glass shifts very softly. The sheet keeps its plain drawings, no text appears on it, the tablet keeps its back to the camera. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

### 3.6 `h19-foto` · h19 „Links kosten nichts.“ (neu)

- **Datei:** `h19-foto.png` → `/home/user/fenstero/marketing/highlights/bilder/h19-foto.png`
- **Format:** 4:5, mindestens 1120 × 1400 px, besser 2K oder 4K.
- **Im Screen:** Fotofläche y 0 bis 623, voll sichtbar bis 349, ganz ausgeblendet bei 623. Das ist der knappste Slot: Gezeigt werden nur die oberen 46 % des Fotos. Kopf bei 19 bis 26 %, Becher bis 32 % der Bildhöhe. Das `--ef-fp: 50% 10%` im Screen gilt nur dem Ersatzfoto, das Slot-Foto steht oben bündig.
- **Referenz:** start-fensterbauer.webp für Figur, Kleidung und Licht.
- **Motiv:** Der Bär lehnt entspannt am geparkten Firmentransporter im Hof vor seiner Werkstatt, einen Kaffeebecher in der Pranke, das Smartphone in der Brusttasche, unter dem Vordach stehen gestapelte Fensterrahmen.

**Nano Banana Pro:**

```text
Use the brown grizzly bear from the attached golden-hour workshop photo as the same character: same shaggy reddish-brown fur, same face and lighter muzzle, same tan canvas bib overalls with dark straps, metal buckles and chest pocket, same leather tool belt, no shirt. Keep the warm light and colour grading of that photo. Vertical 4:5 photograph, medium-wide shot from a little further back. The bear leans relaxed with one shoulder against a parked plain white van in the gravel yard in front of his wooden workshop, holding a plain white coffee mug in one paw, a black smartphone tucked into the chest pocket of his overalls with only its dark back showing, looking calmly and contentedly into the distance. Under the workshop canopy behind him finished white and anthracite window frames stand stacked, the workshop windows with white frames glow warm. Late afternoon sun low from the side, long soft shadows, backlight in his fur. The van has no lettering, no logo and no visible license plate. 35 mm lens at f/2.2, shallow depth of field, focus on his face and the mug, subtle film grain, natural warm colours. Composition: the top fifth of the frame shows only the edge of the canopy and the warm evening light; his head sits just below it, between one fifth and one quarter of the way down from the top edge, and the mug in his paw directly below his head at chest height, so head and mug stay within the upper third of the frame; the van and the stacked frames under the canopy at the same height around him. Below his chest the scene becomes calm: his legs and the gravel yard fall into warm, near-black shadow, and the lower half is an even dark shadow; dark edges left and right. No text, no letters, no numbers, no logos, no people.
Avoid: lettering on the van, license plate, printed mug, human hands, extra fingers, cartoon look, close-up, head near the top edge, bright lower half.
```

**Kling** (5 s):

```text
Very slow push-in toward the bear, locked and level, no shake. The bear lifts the coffee mug, takes one calm sip, lowers it and looks contentedly toward his workshop. A thin wisp of steam rises from the mug, dust floats in the low sunlight, the long shadows stay still. The van stays parked and does not move. The dark lower part of the frame stays completely still and unchanged; any text in it stays sharp and identical.
```

## 4. Bewegung für die übrigen 14 Screens (optional)

Diese Screens zeigen echte Aufnahmen der App. Jede Ziffer und jedes Wort darin ist ein Beleg; Kling darf nichts davon verändern. Darum gilt:

- **Standard ohne KI:** eine ruhige, gleichmäßige Fahrt mit ffmpeg. Der Text bleibt garantiert gleich.
- **Kling nur, wenn mehr Leben gewünscht ist.** Danach jedes Video gegen das PNG prüfen: erstes, mittleres und letztes Bild. Ändert sich ein Buchstabe, eine Ziffer, ein Haken oder eine Farbe, wird das Video verworfen und die ffmpeg-Fassung genommen.

**ffmpeg** (5 s, 30 Bilder je Sekunde, 3 % Fahrt zur Bildmitte; `<screen>` ersetzen, Pfad zum gerenderten PNG eintragen):

```bash
mkdir -p /home/user/fenstero/marketing/highlights/video
ffmpeg -y -loop 1 -i <gerendertes PNG des Screens> \
  -vf "scale=2160:3840,zoompan=z='1+0.03*on/149':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30,format=yuv420p" \
  -frames:v 150 -c:v libx264 -crf 18 /home/user/fenstero/marketing/highlights/video/<screen>.mp4
```

**Kling-Einstellungen:** Bild zu Video, Startbild ist das gerenderte PNG (1080 × 1920), Länge 5 s, kein Endbild, Relevanz hoch und Kreativität niedrig, Negativ-Prompt für alle 14 Screens:

```text
changing text, morphing letters, new words, blurred text, flickering numbers, warping, wobble, liquid distortion, new objects, particles, light leaks, lens flare, glow, gradient, shadow, colour shift, camera shake, fast zoom, zoom out, rotation, parallax, 3D tilt, scene cut, hands, people, animals
```

Die Prompts unterscheiden sich nur im Ziel der Fahrt. So wirkt die Reihe ruhig und gleich.

**h02 „975 € oder 108 €.“** Ziel: die Karte mit den beiden Kästen.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the card with the two cost boxes in the lower middle, perfectly level. The image itself does not change: every letter, number, check mark, line and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h04 „Ein Name genügt.“** Ziel: der Stapel der Schritt-Karten mit den grünen Marken.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the stack of step cards with the round green markers, perfectly level. The image itself does not change: every letter, number, marker, button and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h05 „Absender: Sie.“** Ziel: die Knopfreihe mit WhatsApp und das Nachrichtenfeld.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the row of share buttons and the message field below it, perfectly level. The image itself does not change: every letter, button, marker and colour stays exactly as it is, sharp and still; the message text stays fully readable. No new elements, no light effects, no particles.
```

**h06 „Sie sehen, wer misst.“** Ziel: die vier Projektkarten der Projektliste.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the four stacked project cards, perfectly level. The image itself does not change: every name, number, ring, status label, icon and colour stays exactly as it is, sharp and still. No new elements, no pop-ups, no light effects, no particles.
```

**h08 „Zwei Fotos je Fenster.“** Ziel: der Telefonrahmen mit den beiden Fotokacheln.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the phone frame with the two photo tiles, perfectly level. The image itself does not change: the tiles, labels, badges, letters and numbers stay exactly as they are, sharp and still. No new elements, no light effects, no particles.
```

**h09 „Das kleinste Maß zählt.“** Ziel: das 3-D-Modell mit den Maßlinien.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the 3D window model with its dimension lines, perfectly level. The image itself does not change: the model does not rotate, every line, number, letter and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h11 „Auch ganz groß.“** Ziel: das Raster der sechs 3-D-Modelle.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the grid of six 3D window and door models, perfectly level. The image itself does not change: no model moves, opens or rotates, every label, line and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h12 „Auch rund und schräg.“** Ziel: das Raster der neun 3-D-Modelle.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the grid of nine 3D window models, perfectly level. The image itself does not change: no model moves, opens or rotates, every label, line and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h13 „Bis zur Fensterbank.“** Ziel: das Raster der Modelle und der Knopf darunter.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the grid of 3D models and the wide button below it, perfectly level. The image itself does not change: no model moves, every label, check mark, colour swatch and letter stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h15 „Was zu klären ist.“** Ziel: die Projektkarte mit der Klärungsliste.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the project card with the list of open points, perfectly level. The image itself does not change: every letter, number, badge and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h16 „Bestellmaß vorgerechnet.“** Ziel: der Kasten mit dem Bestellmaß-Vorschlag oben in der Karte.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the highlighted size box at the top of the upper card, perfectly level. The image itself does not change: every number, unit, letter and colour stays exactly as it is, sharp and still. No new elements, no light effects, no particles.
```

**h17 „Als PDF in Ihrer Farbe.“** Ziel: das Aufmaßblatt.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the printed measurement sheet with the blue header, perfectly level. The sheet stays flat and does not bend, curl or move. Every drawing, line, number, letter and colour stays exactly as it is, sharp and still. No new elements, no shadow, no light effects, no particles.
```

**h18 „Nachbessern kostenlos.“** Ziel: das Textfeld im Blatt.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the text field with the note inside the sheet, perfectly level. The image itself does not change: every letter, number, button and colour stays exactly as it is, sharp and still. No cursor, no typing, no new elements, no light effects, no particles.
```

**h20 „Link statt Anfahrt.“** Ziel: die Cream-Pille unten.

```text
Static graphic design on a flat dark background. The camera makes one very slow, smooth push-in of about 3 percent over 5 seconds toward the light cream pill-shaped button near the bottom, perfectly level. The image itself does not change: every letter, number, check mark, the arrow and every colour stay exactly as they are, sharp and still. No pulsing, no glow, no new elements, no light effects, no particles.
```

## 5. Designbrief-Prompt (DE) für weitere Screens

Für ChatGPT, Claude, Canva oder eine andere KI. Vollständig kopieren und danach die Aufgabe anhängen, etwa „Entwerfen Sie zwei weitere Inhalts-Screens zum Kapitel Ergebnis“.

```text
Sie gestalten Screens für die Instagram-Story-Highlights von eeziframes. Halten Sie sich exakt an die folgende Linie. Wo eine Angabe fehlt, fragen Sie nach, statt etwas zu erfinden.

1. PRODUKT UND HALTUNG
- eeziframes ersetzt die Anfahrt zum Erstaufmaß. Der Fensterbauer schickt seinem Kunden einen Aufmaß-Link. Der Kunde misst selbst, Schritt für Schritt geführt, am 3-D-Modell, im Browser, ohne Konto und ohne App. Der Betrieb bekommt Maße, Fotos, Öffnungsarten, Farben und Ausstattung sortiert nach Positionen, mit Bestellmaß-Vorschlag und Klärungsliste, auch als PDF. Vor der Fertigung misst der Betrieb einmal nach.
- Kernsatz: Aufmaß ohne Anfahrt.
- Die Marke schreibt sich immer klein: eeziframes, auch am Satzanfang. Ein Logo gibt es noch nicht; oben links steht die Wortmarke „eeziframes“ als Schrift.
- Zielgruppe dieser Reihe: Fensterbauer. Sie werden gesiezt.
- Gezeigt und behauptet wird nur, was die App wirklich kann. Jede Aussage braucht einen Beleg aus der App, von der Website oder aus den Nutzungsbedingungen. Keine erfundenen Zahlen, keine Kundenstimmen, keine Zusagen zu Push- oder E-Mail-Benachrichtigungen. Gezeigte Bildschirme sind echte Aufnahmen der App; nichts wird wegretuschiert oder hinzugefügt.
- Preise nur dauerhaft gültig, alle netto: Start mit 0 € Grundgebühr, die ersten 3 Projekte kostenlos, danach 9 € je Projekt mit eingegangenem Aufmaß, eine Zahlungsart erst ab dem 4. Projekt, Nachbesserungen inklusive. Abo 10: 69 € im Monat, 10 Projekte inklusive, jedes weitere 5 €. Plus: 119 € im Monat, Projekte unbegrenzt. Der Kunde zahlt nichts und braucht kein Konto. Nennen Sie nie befristete Einführungspreise oder Stichtage: Die Highlights bleiben dauerhaft stehen.

2. FORMAT UND RASTER
- Story 9:16, 1080 × 1920 px. Oben und unten je 250 px frei lassen, dort liegen die Bedienelemente von Instagram.
- Seitenränder 84 px, Inhaltsbreite 912 px.
- Jeder Screen hat drei Zonen: Kopfzeile (Wortmarke links, Label rechts), Inhalt, Fußzeile. Dazwischen mindestens 48 px.
- Inhalt = Textblock (Kicker, Headline, Lead mit gleichem Abstand dazwischen) plus höchstens eine Karte, 48 px darüber.
- Alles steht linksbündig. Zentriert werden nur Icons in Kacheln und Badges.
- Wird es eng: Text kürzen oder die Karte vereinfachen. Nie die Schrift verkleinern oder die Ränder verringern.

3. FARBEN (nur diese)
- ground #161616: immer der Hintergrund.
- surface #1f1f1f: nur als Karte, immer mit 2 px Rand in line #2b2b2b. Flächen in Karten: #262626 und #2e2e2e. Hervorgehobener Rand: #3a3a3a.
- text #f3f2ee: Headlines, Namen, Listenzeilen.
- text-2 #c9c8c3: Lead, Erklärsätze, Chips.
- muted #93928d: nur Labels und Nebenzeilen.
- accent #8fd694 (Grün, das Signal): Kicker, Haken, Fortschritt und genau ein Wort je Headline. Nie für Fließtext, nie als Fläche hinter Text.
- accent-soft rgba(143, 214, 148, 0.14): hinter grünen Icons und unter positiven Chips. Schrift auf vollem Grün: #161616.
- cream #f1f0ea: nur die eine Hauptaktion (CTA-Pille) und der Avatar des Betriebs. Eine Cream-Fläche je Screen. Schrift darauf #161616.
- Orange #ff8a5b (Maueröffnung) und Blau #7aa2ff (Element) kommen nur in echten Aufnahmen von 3-D-Modell und Zeichnungen vor, nie als Gestaltungsfarbe.
- Keine Verläufe, keine Schatten, keine weiteren Farben. „Nein“ ist nicht rot: Ausschlüsse sind grau und tragen ein Kreuz.
- Einzige Ausnahme: Ein Foto darf randlos oben stehen und weich in #161616 auslaufen. Text steht nie auf dem sichtbaren Teil eines Fotos.

4. SCHRIFT
Eine Familie: Inter (Google Fonts) in 500 bis 800, Fallback Helvetica Neue, Arial.
- display-xl 172 px, 800: Cover-Headline, 3 Zeilen, ein Wort grün.
- display 128 px, 800: Headline auf Inhalts- und Abschluss-Screens, 2 Zeilen.
- title 56 px, 800: Betrieb, Kunde oder Ergebnis in Karten.
- lead 40 px, 500: Kernaussage unter der Headline. list 40 px, 700: Listenzeilen.
- wordmark 38 px, 800: „eeziframes“ oben links.
- button 34 px, 800: CTA-Pille.
- card-body 32 px, item 30 px, meta 28 px: Erklärsatz, Checkliste, Vorzeilen.
- kicker 26 px, Versalien, Sperrung +0,2 em, Grün. chip 26 px.
- label 22 px, 800, Versalien, Sperrung +0,18 em: Thema rechts in der Kopfzeile.
- Headlines: Gewicht 800, Laufweite -0,04 em, eng gesetzt, Punkt am Ende, Zeilen von Hand umbrochen, keine Silbentrennung, genau ein Wort grün.
- Nichts unter 26 px außer label. Zahlen als Ziffern („3 Projekte“, „4 Positionen“).

5. BAUSTEINE
- Karte: #1f1f1f, 2 px Rand #2b2b2b, abgerundete Ecken (radius-card; solange keine tokens.json vorliegt, Richtwert 40 px).
- Chip: Pille mit 2 px Rand #2b2b2b auf #1f1f1f, 26 px, davor ein grüner Haken.
- Klick-Marke: runde Marke in accent-soft mit grüner Ziffer, z. B. für „Klick 4 von 4“.
- CTA-Pille: cream #f1f0ea, Schrift #161616 34 px 800, Pfeil. Nur auf dem Abschluss-Screen.
- Icons: Strich-Icons im 24er-Raster, runde Enden und Ecken, Strichstärke 1,8 in der großen Kachel, 2,1 bis 2,8 in kleinen Badges, Farbe currentColor. Keine Emojis, keine gefüllten oder bunten Icons. Bedeutungen: Schild mit Haken = Kundenschutz, Haken = Zusage oder erledigt, Kreuz = gibt es nicht, Pfeil = weiterwischen, Link = Aufmaß-Link, Schloss = nur für Sie, Dokument = Angebot oder Aufmaßblatt.
- App-Aufnahmen: als Karte mit Rand, Breite 760 bis 912 px. Die Du-Texte der Kunden-App bleiben in der Aufnahme, die Story-Texte siezen.

6. LAYOUTS
- Cover (erster Screen eines Kapitels): optional ein Foto randlos oben, weich in #161616 auslaufend. Darunter auf dem dunklen Grund: Wortmarke, Kicker „Teil n von 6 · Thema“, Headline display-xl in 3 Zeilen, Lead, Haken-Chips.
- Inhalt: Kicker, Headline display in 2 Zeilen, Lead, eine Karte mit echter Aufnahme der App, Chips, bei Klickschritten die Klick-Marke.
- Abschluss: Wortmarke, Kicker, Headline, Lead, eine Karte, darunter die Cream-Pille „Kostenlos starten“ mit Pfeil und „eeziframes.com“ in text-2. Kein Foto.
- Kapitel der Reihe: 1 Warum, 2 Der Link, 3 Ihr Kunde, 4 Alles drin, 5 Ergebnis, 6 Preise.

7. FOTOS UND BESETZUNG
- Fotorealistisch, warmes Licht (goldene Stunde oder Fenstertageslicht), 35-mm-Look, geringe Schärfentiefe, leichtes Filmkorn.
- Bär = Fensterbauer: brauner Grizzly, Arbeitslatzhose aus braunem Canvas ohne Hemd, Werkzeuggürtel aus Leder, in seiner Werkstatt mit Fensterrahmen. Er fährt nie raus.
- Waschbär = Hauseigentümer: Werkzeuggürtel, roter Bleistift hinterm Ohr, Handy, gelber Zollstock, im eigenen Haus.
- Bär und Waschbär nie im selben Bild. Keine Menschen. Kein Text, keine Logos, keine Oberflächen im Bild; Bildschirme zeigen vom Betrachter weg. Fensterrahmen weiß oder anthrazit.
- Format 4:5, mindestens 1120 × 1400 px, nicht 9:16. Der Screen zeigt nur das obere Band: Das Foto steht randlos und oben bündig, 1080 px breit, und reicht je nach Textlänge bis y 620 bis 870 der Bühne. Voll sichtbar ist es bis 56 % dieser Höhe, danach läuft es in #161616 aus. Darunter stehen Kopfzeile und Text auf dem dunklen Grund, nie auf dem Foto.
- Komposition: oberes Fünftel des Fotos (Bühne y 0 bis 250, Bedienleiste von Instagram) nur Raum und Licht, kein Gesicht. Kopf und Augen bei 19 bis 26 % der Fotohöhe (Bühne y 260 bis 350), die Pfote mit dem Werkzeug bis 32 % (y 430). Halbtotale, der Kopf ist klein im Bild. Darunter ruhige, dunkle Flächen.

8. SPRACHE
Deutsch, Sie-Form, sachlich, ruhig, verbindlich. Kurze Sätze. Keine Gedankenstriche als Einschub, keine Ausrufezeichen, keine Emojis, keine Superlative.

9. BEISPIELE AUS DEM STORYBOARD
Cover h01:
  kicker „FÜR FENSTERBAUER · TEIL 1 VON 6“ (grün, Versalien)
  headline „Aufmaß / ohne / Anfahrt.“ (172 px, grün: „Anfahrt.“)
  lead „Sie schicken einen Link. Ihr Kunde misst selbst, Schritt für Schritt geführt.“
  chips „Maße“, „Fotos“, „Öffnungsarten“, „Positionen“
  Foto: Bär an der Hobelbank mit Tablet, randlos oben, auslaufend.
Inhalt h05:
  kicker „LINK SCHICKEN“
  headline „Absender: / Sie.“ (128 px, grün: „Sie.“)
  lead „Die Nachricht ist vorformuliert und trägt Ihren Namen. Sie geht über Ihr WhatsApp, per SMS oder E-Mail.“
  chips „Text änderbar“, „Gültig 7, 14 oder 30 Tage“, „Kein Konto für Ihren Kunden“
  Klick-Marke „Klick 4 von 4“
  Karte: echte Aufnahme der Teilen-Karte mit den Knöpfen WhatsApp, SMS, E-Mail, Text kopieren und der ganzen Nachricht.
Inhalt h16:
  kicker „POSITION 1 · WOHNZIMMER“
  headline „Bestellmaß / schon drin.“ (grün: „Bestellmaß“)
  lead „Als Vorschlag: Öffnung minus Ihr eigener Abzug. Dazu die Einbausituation aus den Fotos.“
  chips „Abzug einstellbar“, „Einbausituation per KI“, „Vor Ort prüfen“
Abschluss h20:
  kicker „FÜR FENSTERBAUER“
  headline „Link statt / Anfahrt.“ (grün: „Link“)
  lead „Testen Sie mit Ihren nächsten 3 Kunden. Ohne Grundgebühr und ohne Zahlungsart.“
  Karte: Tarif Start (0 € Grundgebühr, 3 Projekte kostenlos, danach 9 € je Projekt mit eingegangenem Aufmaß, Nachbesserungen inklusive, Zahlungsart erst ab dem 4. Projekt)
  Cream-Pille „Kostenlos starten“, darunter „eeziframes.com“.

10. AUSGABE
Liefern Sie je neuem Screen die Felder im Format von storyboard.json: id, layout (cover, inhalt oder abschluss), kicker, headline (Zeilen mit \n), gruenes_wort, lead, chips, klick_badge, visual, foto_slot, foto_motiv, belege. Auf Wunsch zusätzlich ein HTML-Entwurf mit 1080 × 1920 px und genau den Werten oben. Prüfen Sie zum Schluss: ein grünes Wort je Headline, höchstens eine Cream-Fläche, kein Text auf dem sichtbaren Foto, nichts unter 26 px außer label, 250 px oben und unten frei, jede Aussage belegt.
```

## 6. Begleittexte und Link-Sticker

Die Begleittexte kommen nie als Text auf die Screens, weder auf das PNG noch ins Video. Dort ist kein Platz frei: Auf den Inhalts-Screens reicht der Inhalt bis y 1533 bis 1582, die Fußzeile liegt bei 1630 bis 1670. Auf den Foto-Covern reicht der Textblock bis 1670, und auf dem Foto steht nie Text. Darüber und darunter liegen die freizuhaltenden 250 px. Der Text-Editor von Instagram bietet Inter außerdem nicht an.

Wofür sie gedacht sind:

- **Alternativtext** beim Hochladen, wo Instagram dafür ein Feld anbietet.
- **Beschreibung unter einem Video**, wenn ein Screen aus Abschnitt 3 oder 4 zusätzlich als Reel oder Beitrag erscheint. Der Satz steht dann in der Beschreibung, nicht im Bild.

In der Story selbst stehen sie nicht. Je Screen höchstens ein Satz.

| Screen | Begleittext |
|---|---|
| h01 | In 6 kurzen Teilen sehen Sie, wie das Erstaufmaß ohne Anfahrt zu Ihnen kommt. |
| h02 | Gespart wird die erste Fahrt, das Feinaufmaß vor der Fertigung machen Sie weiter selbst. |
| h03 | Vom neuen Projekt bis WhatsApp mit fertiger Nachricht sind es 4 Klicks und 1 Eingabe. |
| h04 | Mehr als den Namen Ihres Kunden brauchen Sie für den Link nicht. |
| h05 | Ihr Kunde bekommt den Link von Ihnen, mit Ihrem Namen unter der Nachricht. |
| h06 | Ob Ihr Kunde schon misst, sehen Sie in der Projektliste. |
| h07 | Ihr Kunde öffnet den Link im Browser und legt los. |
| h08 | Aus 2 Fotos je Fenster liest die KI die Einbausituation. |
| h09 | Gemessen wird wie bei Ihnen: 3 Breiten, 3 Höhen, das kleinste Maß zählt. |
| h10 | Jede Frage dreht das 3-D-Modell in die passende Ansicht. |
| h11 | Von der Festverglasung bis zur Faltschiebewand hat jede Art ihre eigenen Fragen. |
| h12 | Auch Bögen, Schrägen und runde Fenster bildet das Modell ab. |
| h13 | Was Ihr Kunde noch nicht weiß, markiert er für Ihre Beratung. |
| h14 | Das Aufmaß kommt nach Positionen sortiert, bereit fürs erste Angebot. |
| h15 | Was mit dem Kunden zu klären ist, steht im Projekt ganz oben. |
| h16 | Den Abzug für das Bestellmaß stellen Sie selbst ein. |
| h17 | Das Aufmaßblatt trägt Ihren Betrieb im Kopf. |
| h18 | Fehlt ein Maß, schicken Sie den Link noch einmal, ohne Aufpreis. |
| h19 | Berechnet wird ein Projekt erst, wenn darin ein Aufmaß eingeht. |
| h20 | Die ersten 3 Projekte sind kostenlos, eine Zahlungsart brauchen Sie dafür nicht. |

**Link-Sticker auf h20**

- Sticker-Text: **Kostenlos starten**
- Link: `https://eeziframes.com/#fensterbauer` (öffnet die Startseite gleich in der Ansicht für Fensterbauer, dort steht der Knopf „Kostenlos starten“)
- Lage: unter der Cream-Pille, oberhalb der unteren 250 px, ohne die Pille zu verdecken. Frei ist dort y 1516 bis 1670. Der Sticker ist ein Instagram-Element, kein Begleittext; seine Schrift gibt Instagram vor.

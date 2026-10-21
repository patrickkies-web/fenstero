# Highlights: Story-Screens für Instagram

Story-Screens 1080 × 1920 px aus HTML und CSS, gerendert mit Playwright. Gestaltung nach `BEITRAGS-LINIE.txt`, Inhalt nach `storyboard.json`.

| Ordner, Datei | Inhalt |
| --- | --- |
| `vorlage/vorlage.css` | alle Werte und Bausteine (`ef-…`), Schrift Inter lokal aus `web/fonts/` |
| `vorlage/muster-*.html` | Muster: `cover` (mit Foto), `inhalt` (Ausschnitte mit Marken), `abschluss` (Karte und Cream-Pille), `telefon` (Telefonrahmen) |
| `screens/<id>.html` | die echten Screens (`h01` … `h20`) und die Highlight-Cover `cover-<kapitel>.html` |
| `bilder/` | Fotos: drei vorhandene (`bar-werkstatt.webp`, `waschbaer-tritt.webp`, `waschbaeren-sofa.webp`) und neue Fotos je Slot |
| `out/` | fertige PNGs |

## Rendern

```
node marketing/highlights/render.mjs                    # alle screens/*.html -> out/<id>.png
NUR=h03,h04 node marketing/highlights/render.mjs        # nur diese (NUR=cover-* für alle Cover)
MUSTER=1 node marketing/highlights/render.mjs           # die Muster aus vorlage/
RASTER=1 node marketing/highlights/render.mjs           # zusätzlich out/raster-<id>.png mit den Sicherheitszonen
```

Die Highlight-Cover `screens/cover-<kapitel>.html` sind fertiges HTML: ein Strich-Icon als SVG im 24er-Raster; ein anderes Icon direkt dort eintragen.

Das Skript wartet auf Inter und alle Bilder und meldet mit `!`, was über die Sicherheitszonen ragt (oben und unten 250 px, links und rechts 84 px), was abgeschnitten ist, wenn die Fotofläche zu klein wird und wenn ein Foto hochgerechnet werden muss. Je Foto-Screen steht eine Zeile `Foto …` mit der Lage des Fotos dabei. Vor dem Hochladen jeden Screen einmal mit `RASTER=1` ansehen. Bei Highlight-Covern zeigt das Raster den Kreis, den Instagram ausschneidet, bei Foto-Screens die Gesichtszone.

## Fotos tauschen

Ein Screen mit Foto trägt einen Slot und ein Ersatzfoto:

```html
<figure class="ef-foto" style="--ef-fp: 50% 0%">
  <img data-slot="h03-foto" data-ersatz="bar-werkstatt.webp" src="../bilder/bar-werkstatt.webp" alt="…">
</figure>
```

Neues Foto als `bilder/h03-foto.png`, `.jpg` oder `.webp` ablegen und mit `RASTER=1` neu rendern, mehr ist nicht nötig. Fehlt die Datei, nimmt `render.mjs` das Ersatzfoto (im Browser sieht man immer das Ersatzfoto).

- **Format:** 4:5, mindestens 1120 × 1400 px, wie die vorhandenen Fotos. Nicht 9:16: Gezeigt wird nur das obere Band, 1080 px breit und je nach Textlänge 620 bis 870 px hoch, voll sichtbar bis 56 % dieser Höhe, danach ausgeblendet.
- **Komposition:** oberes Fünftel nur Raum und Licht (dort liegt die Bedienleiste von Instagram), Kopf und Augen bei 19 bis 26 % der Fotohöhe, die Handlung bis 32 %, darunter ruhig und dunkel. Maße je Slot und die Prompts: `PROMPTS.md`, Abschnitte 1 und 3.
- **Ausschnitt:** `--ef-fp` am `<figure>` (wie `object-position`) gilt nur für das Ersatzfoto. Ein Slot-Foto steht oben bündig (`50% 0%`), so wie `PROMPTS.md` es komponiert. Einen anderen Ausschnitt für das Slot-Foto trägt das `<img>` als `data-fp="50% 4%"`. Die Länge der Ausblendung steuert `--ef-foto-voll` (Standard 56 %).
- **Prüfen:** `render.mjs` meldet je Foto die Fotofläche, wo die Ausblendung beginnt und welche Zeilen des Fotos in der Gesichtszone liegen (y 250 bis Beginn der Ausblendung). `RASTER=1` umrandet diese Zone türkis. Gesicht und Werkzeug müssen darin liegen, nichts davon in den oberen 250 px.

## Neuen Screen anlegen

1. Passendes Muster nach `screens/<id>.html` kopieren und die Pfade anpassen: `../vorlage/vorlage.css`, Fotos `../bilder/…`. Eigene App-Aufnahmen am besten nach `aufnahmen/` legen und als `../aufnahmen/…` einbinden.
2. Texte aus `storyboard.json` direkt ins Markup schreiben. Headline von Hand mit `<br>` umbrechen, genau ein Wort in `<span class="ef-gruen">`. Label rechts oben: Kapitel und Zählung, z. B. `Link · 2/4`.
3. App-Aufnahmen vorher passend zuschneiden (Playwright `locator.screenshot()` oder `clip`, deviceScaleFactor 2 oder 3). Der Telefonrahmen und die Ausschnitt-Karte zeigen das Bild in voller Breite.
4. `NUR=<id> RASTER=1 node marketing/highlights/render.mjs` und beide PNGs ansehen.

Wird es eng: Text kürzen oder das Visual verkleinern, nie die Schrift verkleinern oder die Ränder verringern. Richtwert für einen Inhalts-Screen mit Kopfzeile, Kicker, 2-zeiliger Headline, 2-zeiliger Lead, einer Chip-Reihe und Fußzeile: etwa 650 px Höhe für das Visual. Jede weitere Lead-Zeile kostet 52 px, eine zweite Chip-Reihe 80 px, das Klick-Badge 92 px.

## Bausteine (vorlage.css)

| Klasse | Wofür |
| --- | --- |
| `ef-buehne` | Bühne 1080 × 1920 mit Sicherheitszonen; Kinder `ef-kopf`, `ef-inhalt`, `ef-fuss` verteilen sich über die Höhe. `--foto`: Foto oben randlos, Text darunter. `--cover`: Textblock unten. `--oben`: Inhalt oben statt mittig |
| `ef-kopf`, `ef-wortmarke`, `ef-label` | Kopfzeile: „eeziframes“ links, Kapitel und Zählung rechts |
| `ef-text`, `ef-kicker`, `ef-display-xl`, `ef-display`, `ef-gruen`, `ef-lead` | Textblock: Kicker, Headline 172 px (Cover) oder 128 px, ein grünes Wort, Lead |
| `ef-titel`, `ef-koerper`, `ef-meta`, `ef-zeile` | weitere Textrollen in Karten (56, 32, 28, 40 px) |
| `ef-chips`, `ef-chip` | Chips mit grünem Haken; `--nein` grau mit Kreuz, `--positiv` auf accent-soft, `--ohne` ohne Icon |
| `ef-haken` | Checkliste 30 px mit Haken, Text darf umbrechen (neben einem Telefon) |
| `ef-karte` | Karte: surface, 2px-Rand, Radius 32 |
| `ef-telefon` | Telefonrahmen für echte App-Aufnahmen, Breite `--ef-tel-b`, sichtbare Höhe `--ef-tel-h` |
| `ef-ausschnitt` | echter Bildausschnitt als Karte; `--grund` für Ausschnitte vom App-Grund, `--rand` mit Innenabstand |
| `ef-stapel`, `ef-schritte`, `ef-marke` | Ausschnitte untereinander; mit `ef-schritte` steht links je eine Marke (Ziffer oder `ef-marke--wort`) |
| `ef-klick` | Klick-Badge: Pille auf accent-soft, z. B. „Klick 4 von 4“ |
| `ef-split` | Telefon oder Ausschnitt links, Liste rechts |
| `ef-punkte` | Fortschrittspunkte, `ef-fertig` und `ef-jetzt` in accent |
| `ef-foto` | Foto-Kopf randlos, weich in #161616 auslaufend (die einzige erlaubte Verlaufsform) |
| `ef-cta`, `ef-pf` | Cream-Pille mit Pfeil im Kreis, eine je Screen |
| `ef-fuss`, `ef-fuss-text` | Fußzeile: Fortschritt oder Hauptaktion links, Nebenzeile rechts |
| `ef-hl`, `ef-hl-kreis` | Highlight-Cover: Strich-Icon (24er-Raster, Stärke 1,8) auf accent-soft Kreis |

## Fertige Story-Bilder

`export/` enthält die gerenderten Story-Bilder in Upload-Reihenfolge, je Highlight ein Ordner (`1-warum` bis `6-preise`),
dazu je Highlight `cover.png` für das Highlight-Cover. Nach einem neuen Render (`node render.mjs`) den Ordner mit dem Skript
im Commit „Highlights für Betriebe: fertige Story-Bilder“ neu befüllen oder die PNGs aus `out/` von Hand kopieren.

## Story als Video

Ein KI-Video (z. B. aus Kling, Bild zu Video mit dem Standbild des Foto-Slots) als `videos/<id>.mp4` ablegen, dann
`node marketing/highlights/video.mjs <id>`. Das Video läuft im Foto-Bereich mit derselben Ausblendung wie das Foto, Schrift und
Elemente liegen ruhig und scharf darüber. Ergebnis: `out/<id>.mp4` (1080 × 1920, H.264, mit Ton). Fehlt `bilder/<slot>.png`, wird es
aus dem ersten Videobild erzeugt, sodass `render.mjs` dieselbe Story auch als Bild liefert. Ausschnitt über `data-fp` am `<img>`.

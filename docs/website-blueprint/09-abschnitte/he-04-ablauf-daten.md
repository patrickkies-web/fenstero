# H4 03 · So geht es, und was mit den Daten geschieht

Seite: Startseite `/#hauseigentuemer` (Ansicht Hauseigentümer) · Position: 4 von 7 (nach H3 Aufmaßblatt und Preis, vor H5 Ratgeber-Weg) · Intensitätsstufe: 2 (klar), Typ T8-artig, ohne Signature

Phase I, Stand 24.10.2026, Planungsdokument (Repository nur gelesen). Verbindlich: [08](../08-zielarchitektur.md) 8.3.0, 8.3.4 b, 8.3.11
und Architektur E ([07](../07-expertenvergleich.md) 7.5); E legt H4 nicht fest, 08 übernimmt HB3 aus Konzept B. Kürzel, [V] und [H] wie in 08.
**Textentwurf** = neuer Wortlaut aus belegten Fakten, Freigabe nötig. Vorbehalt: Die Startseite ist noch nicht bewertet (EV W13).

---

## A. Abschnitt und Funktion

| Feld | Festlegung |
|---|---|
| Name, ID | „03 · So geht es, und was mit den Daten geschieht“, `he-04-ablauf-daten`, Anker `#ablauf-daten` |
| Position | H4 von H1–H7; davor H3 (Ergebnis, Preis), danach H5 (Ratgeber-Weg), H6 (Fragen). Telefon ab ≈ 2.515 px (Gewichte H1–H3 = 2,98 BH), bei 664 px realer Höhe Bildschirm 5–6. Rhythmus 3 · 2 · 2 · **2** · 2 · 1 · 2 · 2 |
| Ziel | Aufwand einschätzbar machen; Fragen zu Fotos, KI und Konto vor dem Start beantworten (EA B2, B3) |
| Nutzerfrage | „Wie läuft es ab, was passiert mit den Fotos meines Hauses, brauche ich ein Konto?“ (EA H-03, H-04; H-01 teilweise) |
| Vorbereitete Entscheidung | Vertrauen → jetzt messen (Cream „Fenster ausmessen“ im Kopf, 08 N3) oder erst zusehen (Ring „Führung starten“, EA U4, WH3) |
| Gruppen | vor allem HE-5 (direkt, unsicher), daneben HE-3 |

## B. Konkreter Inhalt

**B.1 Informationen aus dem Repository**

| Fakt | Fundstelle | Verwendung |
|---|---|---|
| „Fotografieren. Messen. Wünschen.“ | `web/assets/app.js:2772` | h2, wörtlich |
| Fotografieren → Messen (Modell wächst mit) → Wünschen → Aufmaßblatt | `app.js:2777-2779`; `web/index.html:58-61` | vier Stationen |
| Unbekanntes bleibt offen; angefangenes Aufmaß im selben Browser fortsetzen | `web/index.html:60`; `README.md:3`; `web/assets/portal.js:852`; `web/datenschutz/index.html:45` | Lesestapel |
| Ohne Konto bleiben Eingaben und Fotos auf dem Gerät | `web/index.html:62`, `:78`; `datenschutz:70` | Haken 1 |
| KI nur mit Einwilligung, sonst Aufmaß vollständig; Anthropic Irland, auch USA, kein Training | `datenschutz:51-53` | Haken 2; Einzelheiten hinter dem Link |
| Konto erst zum Sichern bzw. Kauf, E-Mail und Code, kein Passwort | `datenschutz:70`; `web/app/index.html:81` | Haken 3 |
| Führung mit Beispielfotos, Maße vorgegeben, arbeitet an einer Kopie; neun Schritte | `app.js:2935`, `:2773`, `:6302-6308` | Satz am Ring; Miniaturen |

Nicht verwendet: Dauer- und Maßzahlen („zwei Minuten“, „5 Min.“, „vier Maße“), solange EA O-11 offen ist; „Server in Frankfurt“ neben der
KI (`datenschutz:51`; IA H3); jede Aussage, Betriebe nähmen das Blatt an (EA O-20).

**B.2 Texte (rund 50 Wörter, ohne Anrede bis EA O-13)**

| Element | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „03 · ABLAUF UND DATEN“ | Textentwurf; 08: „03 · DATEN UND KONTO“ benennt nur die zweite Hälfte. Rückfall: 08 |
| h2 | „Fotografieren. Messen. **Wünschen.**“, grün „Wünschen.“ | wörtlich |
| Etikett (Fassung B) | „BEISPIEL · AUS DER FÜHRUNG“ | Textentwurf (G7) |
| Stationen | „01 Fotos“ · „02 Maße“ · „03 Wünsche“ · „04 Blatt“ | Textentwurf; 08: „Foto · Maß · Modell · Blatt“. Jedes Verb der h2 bekommt eine Station; das Modell entsteht beim Messen |
| Lesestapel | „Unklares darf offen bleiben. Weitermachen geht später, im selben Browser.“ | Textentwurf, neu gegenüber 08 |
| Haken 1–3 | „Fotos und Eingaben bleiben **ohne Konto** auf dem Gerät.“ · „Die KI wertet Fotos **nur mit Einwilligung** aus.“ · „Zum Kauf: E-Mail und Code, **kein Passwort**.“ | Textentwurf aus 08 / IA H3, unverändert |
| Link | „Mehr zu Fotos und KI“ → `/datenschutz/#fotos-ki` | Textentwurf, neu gegenüber 08 |
| Ring | „Führung starten“ → `/app/#fuehrung` | wörtlich (`portal.js:852`) |
| Satz am Ring | „Mit Beispielfotos, ohne eigene Maße.“ | Textentwurf |
| Variante [H] | vierter Haken „Keine Vermittlung: Das Blatt geht nur an selbst gewählte Betriebe.“ (AGB:35 § 2 (4); `app.js:3267`) für EA H-07 | nur nach Lesetest |

Eine Zeitangabe bekommt erst nach O-11 einen Platz (13 px rechts am Ende des Maßstabs).

**B.3 Interaktionen.** Ring (Hauptziel), Link (Nebenweg). Maßstab und Miniaturen sind nicht bedienbar.

**B.4 Vorhandene Komponenten.** `.btn.ghost`, `.link`, `.kicker`/`.ak`/`.num`, Hakenform `.chip.haken::before`
(`web/assets/gemeinsam.css:56-98`); `Reveal.auf()`, `ruhig()` (`web/assets/gemeinsam.js:160`, `:175-188`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Satzbau G2: Haarlinie → Kapitelzeile → h2 → Held → Lesestapel → Haken mit Link → Ring. Ebenen: 0 Grund `#161616` →
20 Miniaturen (nur B) → 25 Maßstab → 30 Bedienschicht → 40 Kopf. Alles linksbündig an der Ordnungslinie, asymmetrisch, keine Achse.

- **Fassung A (Start, ohne Material):** Held ist der Maßstab 358 × 64 px.
- **Fassung B (Ziel):** über dem Maßstab vier Miniaturen echter Bildschirme der Führung. 08 sieht sie vor, „sobald App-Bildschirme
  vorliegen“; sie lassen sich im Haus aufnehmen (H).

**Telefon 390 × 844, 4 Spalten** (je 77,5 px, Abstand 16; Spaltenanfänge x 16 · 109,5 · 203 · 296,5); y ab Haarlinie:

| Element | A: y | B: y | Maß, Ausrichtung |
|---|---|---|---|
| Haarlinie | 0 | 0 | 1 px `--line`, x 16–374 |
| Kapitelzeile | 17–33 | 17–33 | Technikstimme Versal 13/16, 600, +0,12 em, `tabular-nums`; Nummer „03“ `--accent`, Punkt und Wort `--muted` (11.3.1, K-16) |
| h2 | 45–112 | 45–112 | 32 px, zwei Zeilen, Umbruch nach „Fotografieren.“ |
| Etikett | – | 137–153 | 13 px `--muted` |
| Miniaturen | – | 161–320 | 4 × 77,5 × 159 auf den Spaltenanfängen; untere 32 px in den Grund ausgeblendet |
| Maßstab | 137–201 | 312–376 | 358 × 64; in B überdeckt er die ausgeblendeten Füße um 8 px |
| Lesestapel | 225–274 | 400–449 | 17 px, zwei Zeilen |
| Haken 1–3 | 298–424 | 473–599 | 15 px, Text ab x 40; Zeilen 2 · 2 · 1, Abstand 8 |
| Link | 432–476 | 607–651 | 15 px fett, Ziel 44 px |
| Ring + Satz | 500–552 | 675–727 | Ring 200 × 52 (x 16–216); Satz 13 px zweizeilig, x 232–374, mittig zum Ring |
| **Ende** | **552 (0,65 BH)** | **727 (0,86 BH)** | 08 plant 0,75; B braucht für das Material 0,11 BH mehr |

**Maßstab.** Oberkante = Grundlinie 1 px `--line2`; daran hängen Striche: fein alle 8 px (1 × 12 px, `--line2`), kräftig alle 40 px (1 × 24 px,
`--muted`). Vier Stationsmarken 2 × 64 px `--text2` auf den Spaltenanfängen; rechts daneben (x + 8) unter der Strichzone die Ziffer 13 px
Technikstimme `--muted` (y 30–46) und das Wort 15 px fett `--text` (y 48–64). Rechts am Ende ein Schrägstrich 45°, 10 px, wie das
Endzeichen einer Maßkette. Er liest sich wie ein bedruckter Zollstock, nicht wie ein Symbol.

**Miniaturen (B).** Seitenverhältnis 390 : 800, Radius 12 px (`--r2`) auf allen Breiten, ohne Verkleinerung am Telefon (11.6.1, K-22), oben eine Lichtkante 1 px Weiß 24 %, kein Schatten, Maske
`linear-gradient(#000 80%, transparent)`, frontal. Folge: Fotos · Messen · eine Wunschwahl (Vorschlag Farbe) · Aufmaßblatt.

**Proportionen** der Abschnittsfläche: B ≈ 30 % Bild, 38 % Text und Bedienung, 32 % frei; A ≈ 15 % Bild, 48 % Text, 37 % frei. A liegt unter
dem Bildanteil der Stufe 2 (20–50 %, DG 2.4.2): Grund, B bald zu bauen.

**Größen [V].** Drei Stufen (DG 2.2.18): h2 32/40 · Klein-Stufe 13–17 · nicht textlicher Held. Der Maßstab ist rund sechsmal so hoch wie
die Versalhöhe der 15-px-Wörter (SG 10.1/4).

**Schreibtisch 1280, 12 Spalten** in 1040 px (Spalte 64,67, Rinne 24, Beginn x 120; 11.2.1, K-12):

- **B (wie 08):** links Spalten 1–5 (x 120–539) der Bedienstapel; rechts Spalten 6–12 (x 563–1160) Etikett, vier Miniaturen 131 × 269 im
  Subraster mit 24 px Abstand, darunter Maßstab 597 × 64; Etikett auf Höhe der Kapitelzeile.
- **A (Abweichung von 08):** Ein 597 px breiter Maßstab ließe die rechte Hälfte zu über vier Fünfteln leer (Mangel aus PA 1.8). Er läuft
  deshalb als Band über alle 12 Spalten (1040 × 64, y 160–224), Stationen auf den Spalten 1, 4, 7, 10 (x 120, 386, 652, 918). Ab y 256 links
  (Spalten 1–5) Lesestapel und Ring, rechts (7–12) Haken und Link: links der Ablauf, rechts die Daten.

**Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Abstände | 96 / 128 px zwischen Abschnitten; innen 8 (Gruppe) · 24 (Blöcke) | G6 |
| h2 | Inter 800, −0,03 em, Zeilenhöhe 1,05 | Bühnenstimme |
| Technikstimme | 13 px, 600, Versalien, +0,12 em, `tabular-nums` | DG 2.2.18 |
| Lesestapel | 17 px, 500, 1,45, `--text2` | G2 |
| Haken | 15 px, 500, 1,45, `--text2`, Schlüsselwörter 700 `--text`; Haken 7 × 12, 2,5 px `--accent` | `gemeinsam.css:97` |
| Ring | 52 px, Pille, innere Kontur 2 px `--muted` (≈ 5,8 : 1), 17 px fett | `.btn.ghost`; 11.6.2, K-1 (H4-AB-4) |
| Radien | 12 (`--r2`, Miniatur auf allen Breiten), Pille | 11.6.1, K-22 (H4-AB-5) |

## D. Anwendung der Design-DNA

| Eigenschaft (Skala 0–4) | Ausgestaltung, Ort | Wirkung, Funktion |
|---|---|---|
| Tiefe (B 2, A 1) | Tiefe nur über Verdeckung: Maßstab (25) vor den Füßen der Miniaturen (20) | Bildschirme stehen auf der Maßkette: Ablauf und Ordnung sind ein Objekt (DNA Nr. 2) |
| Material, Transparenz (B 2, A 0) | echte App-Bildschirme; kein Glas (Glas der Ansicht nur am Umschalter in H1) | Beweis durch das eigene Produkt (SKILL:41) |
| Licht, Schatten (1) | nur die Lichtkante der Miniaturen; kein Lichtfleck, kein Schatten (DNA Nr. 6, 10) | hellster Wert ist das Papierweiß in Miniatur 04, also das Ergebnis |
| Formen (2) | Pille, Haarlinien und Striche als Gegenform; kein Formbruch | Präzision eines Aufmaßes |
| 3-D (B 1, A 0) | nur als Bild: das Modell in Miniatur 02/03 | keine Ladelast |
| Bildintegration (B 2) | ohne Rahmen, in den Grund ausgeblendet (DNA Nr. 4) | ein Raum mit der Seite |
| Oberflächendetails (2) | Strichrhythmus 8/40, Endschrägstrich, Lichtkante | Mikrodetails ohne Fläche (SKILL:47) |
| Animation (B 1, A 0) | nur die Miniaturen einmal über Deckkraft, gestaffelt (F); Bedienschicht und Maßstab stehen ab dem ersten Bild (K-6) | Folge 01 → 04 wird spürbar |
| Typografie (2) | Bühnen- und Technikstimme, Lesetext, ein grünes Wort | zwei Stimmen (DR 3.2) |
| Überlagerungen (1) | nur die 8-px-Verdeckung; nie Text auf Bild | Lesbarkeit (SG 10.1/6) |
| Perspektive (0) | frontal; H3 trägt schon das gedrehte Blatt | keine Wiederholung |
| Interaktive Effekte (1) | nur Zustände von Ring und Link | ruhige Absicherung (DG Dosierregel 1) |

Konstant: Grund, Ordnungslinie, Formfamilie, Satzbau. Betont: Bild (B) bzw. Detail (A). Signature keine; die Abschnittsnummer zählt nicht
ins Budget (8.3.11).

**Bewusst weggelassen:** Lichtraum, Glas, WebGL, Bildfolgen; gekippte Miniaturen; Formanschluss Telefon → Blatt (SKILL:125); grün
wachsende Marken und sich zeichnende Linien (8.3.11, DG T8, Ergebnis B B.3.12); Lottie `fotos`/`messen` (zweiter bewegter Träger); Video
`h07.mp4` (13,4 MB, Ton); Messraster; Zahlen und Zeitangaben (O-11).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**

| Nr. | Regel | Vorschlag | Begründung |
|---|---|---|---|
| H4-AB-1 | GEST:39 Katalog 1: Erscheinen 8 px aufwärts; DR 3.5: Auftritt 24 px und 0,98 → 1; drei Bewegungsebenen je Szene | Bedienschicht und Maßstab ohne Auftritt, auch ohne Deckkraft-Einblenden (K-6); nur die Miniaturen (B) einmal über Deckkraft, eine Ebene | Absicherungsfläche der Stufe 2, ein bewegter Träger je Ansicht (SG 10.7/4); ohne JavaScript sichtbar; = DS-AB-8, erweitert DG-AB-2 |
| H4-AB-2 | DR 4, Baustein 7: „der Fortschritt wächst grün mit“ | Marken neutral, ohne Fortschritt | der Ablauf geschieht in der App, nicht beim Lesen; 8.3.11 |
| H4-AB-3 | GEST:24, :32; DR 4, Baustein 2: Schatten `--float` | Lichtkante statt Schatten | DNA Nr. 6 (= DG-AB-1) |
| H4-AB-4 | GEST:24: `--muted` nur für Labels und Nebenzeilen; `gemeinsam.css:58`: Ghost-Rand `--line2` | Ring-Kontur 2 px `--muted`, Hover → `--text` (K-1) | die Kontur ist die einzige Grenze des Knopfs und braucht 3 : 1 (WCAG 1.4.11); = DS-AB-10 |
| H4-AB-5 | GEST:32: Radien 8 · 12 · 18 · 24 | Miniatur 12 auf allen Breiten statt 8 am Telefon (K-22) | höchstens vier Radien, keine Verkleinerung am Telefon; = DS-AB-5 |

## E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Kontrast, Größe und Lage, nicht gemessen.

- **Primär:** B die Reihe der Miniaturen (größte Bildfläche, Farbe, Papierweiß in 04); A die h2, danach der Maßstab. Dass in A Text den
  Fokus trägt, ist der zweite Mangel der Startfassung (G4 nur formal erfüllt).
- **Sekundär:** die drei grünen Haken an der Ordnungslinie.
- **Reihenfolge B:** Miniaturen → h2 → Stationswörter → Lesestapel → Haken → Ring. **A:** h2 → Maßstab → Haken → Lesestapel → Ring.
- **Kontraste auf `#161616`:** `--text` 16,2 : 1 · `--text2` 10,8 : 1 · `--muted` 5,8 : 1 · Grün 10,5 : 1; Striche `--line2` 1,6 : 1 sind Schmuck.
- **Handlung:** Der Ring ist bewusst zweitrangig (Kontur, nicht volle Breite) und liegt, wenn die Haarlinie am Kopf steht, bei y ≈ 556–608
  (A) bzw. 731–783 (B), im Daumenbereich. Einzige Cream-Fläche ist der Kopfknopf „Fenster ausmessen“; H3 bis H5 tragen keine Cream. Rang:
  messen vor Führung.
- **Ablenkungen:** Miniatur 04 zieht nach rechts außen, der Lesestapel holt den Blick an die linke Kante zurück. Der Link führt von der Seite
  weg; er steht deshalb nach den Haken, 15 px, ohne Fläche.
- **Übergang:** 96 px darunter beginnen Haarlinie und h2 von H5; in A noch im selben Bildschirm (Fortsetzungssignal). Unentschlossene finden
  dort den nächsten Schritt.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Was | Dauer, Kurve | Verfahren | Weniger Bewegung |
|---|---|---|---|---|
| erstes Bild | Bedienschicht (Text, Ring, Link) und Maßstab stehen, kein Auftritt (11.7.2, K-6) | – | kein `Reveal` an diesen Elementen | – |
| 15 % sichtbar, einmal (nur B) | Miniaturen 01–04 Deckkraft, versetzt 0/80/160/240 ms | je 600 ms `--t-motiv`, `--e-out`; ≤ 840 ms | `Reveal.auf`, `transition-delay: calc(var(--i) * 80ms)` | sofort sichtbar |
| Zeiger über Ring / Link | Ring-Kontur `--muted` → `--text`, Unterstrich `--line2` → `--text` | 150 ms `--t1`, `--e-out` | `.btn.ghost:hover`, `.link:hover`, nur `(hover: hover)` | bleibt |
| Ring gedrückt | Füllung `--surface2` | erscheint sofort (0 ms), zurück in 150 ms `--t1` | ohne das geerbte `scale(.98)` (SG 10.7/3) | bleibt |
| Fokus | `outline: 2px solid var(--text)`, Abstand 2 px, folgt der Pille | – | `:focus-visible` | bleibt |
| Tippen | `/app/#fuehrung` bzw. `/datenschutz/#fotos-ki`, gleiche Registerkarte | – | Link | – |

Keine Scroll-Kopplung, Parallaxe, Schleife; kein Hover an den Miniaturen. **Begründung:** Wer hier Vertrauen fasst, soll lesen, nicht
zusehen; Physik hat die Ansicht beim Tippen in H2 und beim Ablegen des Blatts in H3. 80 ms Versatz liegt in DR 3.5 (60–90 ms), zusammen
240 ms (≤ 400 ms, 11.7.1). Liegen die Miniaturen beim Laden schon im Bild, erscheinen sie ohne Übergang. Fassung A hat keinen Auftritt.

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Senkrechter Stapel wie in C. Steht die Haarlinie unter dem Kopf (y 56), passt der ganze Abschnitt auf einen
Bildschirm (A bis 608, B bis 783). Bei realen 664 px passt A; in B fällt der Ring unter den Rand, nichts wird angeheftet. Unter 375 px rutscht
der Satz unter den Ring (`flex-wrap`). Bei 320 px (Spalten 60 px) bleibt „Wünsche“ (≈ 65 px) vor dem nächsten Spaltenanfang (76 px). Bei 200 %
Textgröße wechseln die Stationen per `@container (max-width: 24em)` auf 2 × 2; nichts scrollt quer.

**Schreibtisch 1280 × 800.** B im Split 5 : 7, A als Band mit zwei Spalten darunter (C). h2 40 px zweizeilig (≈ 390 px, passt in 5 Spalten).
Höhe A ≈ 390 px (0,49 BH), B ≈ 460 px; Miniaturen 131 px breit, nichts überdimensioniert.

**Schreibtisch 1024 × 768.** Spalte 960 px (Rand 32), 12 Spalten à 58 px, Rinne 24 (11.2.1). In 5 Spalten (386 px) bräche die h2 dreizeilig,
deshalb **B im Split 6 : 6** (je 468 px, Miniaturen 105 × 215, Abstand 16). A: Band 960 × 64, Stationen auf 1, 4, 7, 10, Haken über 7–12.

**640–1023 px:** Telefonstapel, Inhaltsbreite höchstens 600 px an der linken Ordnungslinie.

## H. Technische Umsetzung

**Bestehend.** `web/assets/portal.js` zeichnet die Ansicht (Aufbau um `:852`): H4 als eigener Baustein, Stil in `web/assets/portal.css`;
Knöpfe, Links, Haken, Technikstimme aus `gemeinsam.css`; Einblenden nur der Miniaturen (B) über `Reveal.auf`. Die Textfassung `web/index.html` (st-05) erhält
denselben Inhalt als h2, `ol`, `ul` und zwei Links, ohne Maßstab und Bilder.

**Neu.**

- `section#ablauf-daten`, `aria-labelledby` auf die h2; Kapitelzeile als `p` davor.
- `.ablauf-massstab`: `ol` mit vier `li` (Ziffer und Wort echter Text). Striche als zwei `repeating-linear-gradient` (1 px auf 8 bzw. 40 px)
  auf einem `aria-hidden`-Element; Marken als `border-left: 2px` der `li`, damit sie bei `forced-colors` bleiben. Raster
  `repeat(4, 1fr)`, Abstand 16; die Miniaturen nutzen dieselben Spalten (`subgrid`).
- `.ablauf-bilder` (B): `img` mit `alt=""` (Inhalt steht im Wort), `width`/`height`, `aspect-ratio: 390 / 800`, `loading="lazy"`,
  `srcset` 260w/520w, `sizes="(min-width: 1280px) 131px, (min-width: 1024px) 105px, 20vw"`.
- `.vertrauen-haken`: `ul`, Haken über `li::before`.
- Bindung idempotent (Merker an der Wurzel), weil `portal.js` die Ansicht beim Umschalten neu aufbaut.
- `web/datenschutz/index.html`: `id="fotos-ki"` an der h2 von Abschnitt 5, ohne Textänderung.

**Assets**

| Asset | Art, Format, Maß | Freistellung | Quelle |
|---|---|---|---|
| Maßstab | CSS | – | neu, ohne Datei |
| Miniaturen 01–04 (B) | Bildschirme der Führung bei 390 × 800 CSS-px, Faktor 2; WebP 260 × 533 (≈ 15 KB) und 520 × 1067 (≈ 40 KB) | keine; Radius und Maske per CSS | im Haus: Vorschau-Server mit `KI_ATTRAPPE=1`, Playwright, `scripts/fotos.py`; Fingerabdruck wie `tour-aufmassblatt.json`; Auswahl gibt der Inhaber frei |

**Animationstechnik.** CSS-Übergänge auf `opacity`, ein vorhandener IntersectionObserver; keine Bibliothek, keine fremden Server.

**Leistungsrisiken.** Gering: A ohne Datei, B ≈ 60 KB verzögert mit reserviertem Platz. Risiko ist die Alterung der Bildschirme bei
App-Änderungen (EV H-E9 sinngemäß); Prüfung über den Fingerabdruck.

**Barrierefreiheit.** Lesereihenfolge = DOM-Reihenfolge, der Held hat keine Fokusziele. Die Ring-Kontur `--muted` erreicht ≈ 5,8 : 1 und
damit die 3 : 1 für die einzige Grenze des Knopfs (WCAG 1.4.11; K-1); bei `prefers-contrast: more` Kontur `--text2`. Ziele ≥ 44 px, `scroll-padding-top` ≥ 56 px. Ohne JavaScript gilt die
Textfassung. Schriftgrößen nur 13, 15, 17, 32, 40; H4 in die Größenprüfung der Prüfsuite aufnehmen, die die Startseite heute auslässt
(TD 5.4).

## I. Conversion-Begründung

**Position.** Nach H3 weiß der Besucher, was er bekommt und was es kostet. Übrig sind Zweifel vor dem ersten Tippen: Aufwand, Fotos des
eigenen Hauses, Konto (B2 → B3 → Z2a). Danach folgen nur Zubringer, Restzweifel und der Abschluss.

**Gestaltung.** Der Maßstab macht aus „wie aufwendig?“ vier überschaubare Stationen; die Miniaturen zeigen, was der Ring öffnet. Die Haken
stehen, wo die Datenfrage entsteht, und verschweigen nichts: Einzelheiten zur KI liegen einen Tipp entfernt, statt die Zeile zu
verlängern. Der Lesestapel ergänzt die zwei aufwandsenkenden Fakten, die H1 bis H3 nicht nennen. Cream im Kopf bleibt der Start, der Ring
der leise Weg für Unsichere.

**Menge.** Rund 50 Wörter, sieben Aussagen, ein Bildschirm; keine Wiederholung aus H1–H3 außer dem Konto, das hier genauer wird.

**Zielhandlung.** Z2a direkt über den Kopfknopf, indirekt über die Führung (WH3).

**Zu testende Annahmen [H]** (ohne Wahrscheinlichkeiten)

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H4-H1 | Der Lesestapel senkt den eingeschätzten Aufwand | Lesetest mit und ohne Zeile | ohne Lesestapel (08) |
| H4-H2 | Wer vorher „Zum Kauf: E-Mail und Code“ liest, bricht seltener an der Kasse ab (EA H-D11) | Tagessummen „Kasse geöffnet“ → „gekauft“ vor und nach (eigene Statistik, `datenschutz:40`) | Zeile bleibt, Lage prüfen |
| H4-H3 | Miniaturen machen den Ring verständlicher als der Maßstab allein | Lesetest „Was passiert nach dem Tippen?“; Führungsstarts zählt die Statistik nicht (Hash), eine Zählung bräuchte einen Satz in der Datenschutzerklärung | Fassung A |
| H4-H4 | „ABLAUF UND DATEN“ trägt besser als „DATEN UND KONTO“ | Sichtprüfung des Inhabers | Wortlaut 08 |
| H4-H5 | Ein vierter Haken zu H-07 nimmt einen weiteren Zweifel | Lesetest | drei Haken |

**Offen:** Textentwürfe und H4-AB-1 bis -5 freigeben; Zeitangabe (O-11); Anrede (O-13); Auswahl der Führungsbildschirme.

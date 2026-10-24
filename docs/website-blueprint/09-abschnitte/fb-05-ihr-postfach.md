# 03 Ihr Postfach (#was-in-jeder-anfrage-steht)

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 5 von 15 (Kapitel 03, nach 02 Ihr Kunde, vor 04.1 Pakete) · Intensitätsstufe: 3 gestaltet (Typ T5 Beweis)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu
BL = `web/assets/blatt.js`, EG = `functions/api/eingang.js`, PK = `web/assets/pakete.js`, TB = `scripts/tour-bild.mjs`. **[V]** verbindlich,
**[H]** Hypothese mit Rückfall. Alle Lagen und Wirkungen sind geplant, nicht gemessen.

## A. Abschnitt und Funktion

- **Name, ID, Anker:** 03 Ihr Postfach, `fb-05-ihr-postfach`, h2 mit `id="was-in-jeder-anfrage-steht"` (Menüanker, Z 8.1.4; nicht in der
  Pflichtliste der Prüfsuite, die ID bleibt trotzdem unverändert).
- **Position:** Telefon ≈ 3,5–4,7 BH, bei 664 px Höhe Bildschirm 5–6. Davor 02 Ihr Kunde (Stufe 3, letzter Lichtort), danach 04.1 Pakete
  (Stufe 2). Rhythmus 4 · 3 · 2 · 3 · **3** · 2: zweiter Abschnitt der Stufe 3 in Folge, das Maximum (DG 2.3.17/6); deshalb hier kein Licht.
- **Zugänge:** Weiterscrollen aus 02, Menü „03“. Der Kopf-Ring „Pakete ansehen“ bleibt sichtbar.
- **Ziel:** EA S3, Produktbeweis am Ergebnis: Das, was im Postfach ankommt, wird als echtes Dokument gezeigt, nicht beschrieben.
- **Beantwortete Nutzerfrage:** „Was landet bei mir im Postfach, und reicht das fürs Angebot?“ (F-15), mit dem Nebenzweifel „Kunden messen
  falsch, und dann hafte ich?“ (F-09).
- **Vorbereitete Entscheidung:** Anfragen über den Konfigurator sind brauchbar und besser als Einzeiler. Daraus folgt die Frage nach Preis und
  Markenstufe, die 04 beantwortet. Gekauft wird hier nichts.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Was in jeder Anfrage steht“, grün „Anfrage“ | VK:121 | wörtlich |
| „Anfragen, mit denen Sie rechnen können: keine Einzeiler aus dem Kontaktformular, sondern Maße, Fotos und Wünsche je Position, mit Klärungsliste.“ | VK:80 | Lead, gekürzt (B.2) |
| Sieben Inhalte mit Titel und Satz (Maueröffnung … Mit dem Kunden zu klären) | VK:124-130 | Begriffe sichtbar, Sätze im Umschalter; die eine Fassung des Katalogs (IA K15) |
| Echtes Aufmaßblatt, Seite 1, Beispiel „Fensterbau Brandt“ / „Familie Weber“, Nr. „P-BEISPIEL“, 920 × 872, mit Alt-Text | `web/bilder/tour-aufmassblatt-15.webp`; VK:133; TB:1-6 | Held |
| Aufbau des PDF: Seite 1 Übersicht und Klärungsliste, je Position Zeichnung, Maße, Wünsche, Einbausituation, Fotos | BL:26-27, :403-425, :567-590 | Quelle der zwei neuen Schichtbilder |
| Klärungsliste mit Kästchen je offenem Punkt; Titel „Mit dem Kunden zu klären“ | BL:404-411 | Schicht 3, Kästchen-Zeichen der Karte |
| Dateiname des Anhangs: `'Aufmass-' + Nr. + '-' + Kunde + '.pdf'` | EG:86-87 | „Aufmass-P-BEISPIEL-Familie-Weber.pdf“ statt „Aufmassblatt_Weber.pdf“ (VK:133) |
| Kopf des Blatts nennt eeziframes je nach Paket deutlich, dezent oder gar nicht; Logo ab Plus | PK:46, :54, :62 (`pdfKennzeichnung`, `logo`); BL:14-15 | Begründung des Textziels |
| „Die Maße im Aufmaßblatt sind Angaben Ihrer Kunden; vor der Fertigung messen Sie selbst nach (Feinaufmaß).“ | PB:44 § 2 (4) | Zeile zu F-09, gekürzt |
| Optionen der Probe in 02: Fenster, Balkontür, Hebe-Schiebe-Tür; Ohne, Raffstore, Weiß ich noch nicht | Z 8.3.2 b (02) mit `README.md:3`, `web/assets/app.js:1368` | Werte der Karte „Aus Ihrer Probe“ |
| „Weiß ich noch nicht“ landet in der Klärungsliste | VK:130 | Logik der Karte |

Entfällt gegenüber heute: Bestellmaß-Karte „1.229 × 1.424“ (VK:134) und die abgehakte Klärungs-Karte (VK:135-144), ersetzt durch die echte
Schicht und die Karte „Aus Ihrer Probe“ (Z 8.4.1, Zeile 6).

**B.2 Texte**

| Element | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „03 · IHR POSTFACH“ | Textentwurf (Z 8.2.6) |
| h2 | „Was in jeder Anfrage steht“, grün „Anfrage“ | Bestand VK:121 |
| Lead | „Statt eines Einzeilers: Maße, Fotos und Wünsche je Position, mit Klärungsliste.“ | Textentwurf aus VK:80 |
| Einzeiler-Karte | Kicker „KONTAKTFORMULAR“, rechts „Beispiel“; Zeile „Was kosten 5 neue Fenster?“ | Textentwurf; „5“ = „Fenster im Haus: 5 von 11 werden getauscht“ im selben Blatt |
| Beschriftungen | „KLÄRUNG“, „FOTOS“, „MASSE“ | Textentwurf |
| Karte „Aus Ihrer Probe“ ohne Tipp in 02 | Kicker „PROBE · BEISPIEL“; „Balkontür“; Kästchen + „Sonnenschutz: zu klären“ | Textentwurf |
| … nach Tipp in 02 | Kicker „AUS IHRER PROBE“; Element wie gewählt; „Sonnenschutz: ohne“ · „Sonnenschutz: Raffstore“ · Kästchen + „Sonnenschutz: zu klären“ | Textentwurf |
| Bildunterschrift | „Aufmass-P-BEISPIEL-Familie-Weber.pdf“ | aus EG:87 |
| Umschalter | „Alle Angaben im Einzelnen“ / offen „Weniger zeigen“ | Textentwurf |
| Feinaufmaß | „Die Maße sind Angaben Ihrer Kunden; vor der Fertigung messen Sie selbst nach (Feinaufmaß).“ | Textentwurf aus PB:44 |
| Textziel | „Wie sehr soll es Ihre Marke tragen?“ → `#pakete` | Textentwurf; „es“ statt „er“ (Z 8.2.6), weil der Satz direkt unter dem Blatt steht |

Der eingegebene Firmenname aus 01 erscheint weder im Blatt noch in der Karte (E-12): Das Blatt gehört dem Beispielbetrieb, ein zweiter Name
wäre uneinheitliches Beispielmaterial (DG T5 „Nicht“). „Pos. 1“ aus Z entfällt in der Karte, weil Pos. 1 im sichtbaren Blatt „Wohnzimmer“ ist.

**B.3 Interaktionen:** zwei, beide leise: der Umschalter (zeigt die sieben Sätze) und das Textziel zu `#pakete`. Dazu ohne Bedienung die
scrollgeführte Explosionsansicht und die Übernahme der Wahl aus 02 in die Karte. Kein Hotspot, kein Vergrößern, kein Senden (E-7).

**B.4 Vorhandene Komponenten:** Abschnittsrahmen `.vk-teil` mit Haarlinie (`web/assets/verkauf.css:500-502`); Liste `.vk-inhalt`
(VK:123-131, `verkauf.css:412-416`) als Ausgangspunkt; `Verkauf.auf(wurzel, o)`, `beobachten()`, `ruhig()`, `kannIO`
(`web/assets/verkauf.js:1-16`); `window.Scroll.binden` (`web/assets/gemeinsam.js:296-324`); Tokens `gemeinsam.css:9-31` (`--ground`,
`--surface`, `--line`, `--line2`, `--text`, `--text2`, `--muted`, `--r2`, `--r3`, `--t1`–`--t3`, `--e-out`); Fokusrahmen aus `gemeinsam.css`;
Bildpipeline TB (Fingerabdruck, Prüfung `scripts/pruefen.mjs:1465-1467`).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Telefon: eine Spalte, Satzbau Haarlinie → Kapitelzeile → h2 → Lead → Szene (Held) → Begriffe → Umschalter →
Feinaufmaß → Textziel (G2). Die Szene ist ein Split im Kleinen: links eine Beschriftungsspalte an der Ordnungslinie x = 16, rechts der
Papierstapel. Asymmetrisch, schwer nach rechts oben; die freie linke Spalte und der Raum unter dem Einzeiler sind der Negativraum.

**C.2 Telefon 390 × 844, Lagen relativ zur Haarlinie (y = 0); 4 Spalten à 77,5 px, Abstand 16**

| y | Element | Breite · x | Maß, Schrift |
|---|---|---|---|
| 0 | Haarlinie 1 px `--line` | 358 · 16–374 | 96 px Abstand zu 02 |
| 16–33 | Kapitelzeile | links | 13/17, 600, .12em, `--accent` |
| 45–115 | h2, zwei Zeilen („Was in jeder Anfrage“ / „steht“) | 358 | 32/35, 800 |
| 127–178 | Lead, zwei Zeilen | 358 | 17/25,5, 500, `--text2` |
| 202–670 | Szene (C.3) | 358 · 16–374 | 468 hoch |
| 694–870 | Begriffe, Raster 2 × 3 + eine volle Zeile, je 44 | Spalten 1–2 und 3–4 | 15/18, 700, `--text` |
| 870–914 | Umschalter, Trefferfläche 358 × 44 | 16–374 | 15, 700, `--text2`, „+“ 15 rechts |
| 930–974 | Feinaufmaß, zwei Zeilen | 358 | 15/22, 500, `--text2`; „Feinaufmaß“ `--text` |
| 990–1034 | Textziel mit Pfeil 16 px | links, Trefferfläche 358 × 44 | 17, 700, Unterstreichung 1 px `--muted`, Versatz 6 |

Gesamthöhe ≈ 1.034 px = 1,23 BH (Z plant 1,20; +20 px). Offen wächst der Umschalter-Inhalt um ≈ 560 px nach unten.

**C.3 Die Szene (Szenenkoordinaten: x 0 = Seite x 16, y 0 = Seite y 202).** Blattbreite b = 256, Blatthöhe h = 243 (920 : 872).

| Element | x | y | Maß | Z |
|---|---|---|---|---|
| Messraster (Grund) | −16 bis 374 (randlos) | −24 bis 492 | fein 8, kräftig 40 px | 0 |
| Einzeiler-Karte | 112–354 | 0–150 | 242 × 150, Radius 18, Textband y 0–56 | 5 |
| Schicht 3 „Klärung“ (L3) | 102–358 (Ruhe 84–340) | 64–307 (Ruhe 113–356) | b × h, Versatz +7,2 % · −20 % | 20, hinten |
| Schicht 2 „Fotos“ (L2) | 93–349 (Ruhe 84–340) | 89–332 (Ruhe 113–356) | b × h, Versatz +3,6 % · −10 % | 20, Mitte |
| Blatt (Maße), Seite 1 | 84–340 | 113–356 | b × h, Gruppe um −2° gedreht | 20, vorn |
| Beschriftung „KLÄRUNG“ | 0–67 | 68–84 | Linie y 76 bis Kante L3 | 30 / Linie 25 |
| Beschriftung „FOTOS“ | 0–48 | 93–109 | Linie y 101 bis Kante L2 | 30 / 25 |
| Beschriftung „MASSE“ | 0–48 | 302–318 | Linie y 310 bis Klammer x 76, y 280–339 (Tabellenzeilen) | 30 / 25 |
| Karte „Aus Ihrer Probe“ | 122–358 | 340–436 | 236 × 96, Radius 12; liegt ≈ 14 px auf der Blattunterkante | 25 |
| Dateiname | 0–290 | 452–468 | Zeichen 12 × 14 + Text | 30 |

Sichtbar bleiben von L3 und L2 nur die Bänder über dem Blatt (25 bzw. 24 px) und je ein Streifen rechts (9 px). Die Bänder zeigen den Anfang
der Schichtbilder: L3 beginnt am Kicker „Mit dem Kunden zu klären“ mit der ersten Kästchenzeile, L2 am Kicker „Einbausituation aus den Fotos“.
Beide sind Ausschnitte aus weißem Papier, nie mit dem dunklen Kopfband einer Seite, das auf `#161616` verschwinden würde.

**C.4 Verhältnisse.** Im Endzustand (Blattmitte bei 45 % der Höhe) steht die ganze Szene im Bild. Blatt 256 × 243 = 19 % der
Bildschirmfläche, Szene mit Karten ≈ 40 % Bildanteil (Stufe 3: 30–60 %); Text ≈ 12 %, frei ≈ 48 %. Maßstabssprung Blatt 243 px gegen
Bedienschrift 13 px ≈ 19-fach (≥ 3, SG 10.1/4). Das Blatt verdeckt den Einzeiler vor der Explosion zu ≈ 25 %, danach zu ≈ 57 %; der Satz
des Einzeilers liegt im Textband und bleibt immer ganz lesbar (SG 10.1/6). Die Karte verdeckt ≈ 5 % des Blatts: nur Fußnote und Rand,
nicht die Tabelle mit Öffnung, Element und Bestellmaß.

**C.5 Ebenen:** 0 Grund mit Messraster → 5 Einzeiler (Inhaltsfläche unter dem Fokusträger, SG-Token `--z-inhalt`) → 20 L3, L2, Blatt →
25 Karte „Aus Ihrer Probe“, Führungslinien → 30 Beschriftungen, Dateiname, Bedienschicht → 40 Kopf. Fünf Stufen, Tiefe nur über Verdeckung
und Tonwert: L2 trägt eine feste Abdunklung von 6 %, L3 von 12 % (statisches `::after`, kein `filter`).

**C.6 Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Kapitelzeile, h2 | wie `fb-03` C.6; Markup genau `<h2 id="was-in-jeder-anfrage-steht">Was in jeder <span class="ak">Anfrage</span> steht</h2>`; `scroll-margin-top: 116px` | ein Muster für alle Kapitel |
| Blattbreite | Telefon `--b: clamp(180px, calc((100vw - 116px) / 1.072), 330px)`; ab 761 px `clamp(300px, calc((Szenenspalte - 120px) / 1.072), 400px)`; `--h: calc(var(--b) * .9478)` | Beschriftungsspalte und Versatz brauchen 116 px neben dem Blatt |
| Versatz der Schichten | L2 `translate(3.6%, -10%)`, L3 `translate(7.2%, -20%)`, Prozent der eigenen Größe | DG T5 (≤ 20 % der Blatthöhe); skaliert ohne Pixelwerte |
| Drehung | `rotate(-2deg)` an der Stapelgruppe, ab 761 px ebenso | Z; leicht, keine Kippung (SG 10.7/1) |
| Papier | Radius 3 px; Bild `display:block`, `width:100%`, `height:auto` | Dokument, nicht Karte |
| Lichtkante am Blatt | 1 px oben und an den Seiten des Kopfbands, `rgba(243,242,238,.24)`, seitlich `.14` | Kopfband ist `#161616` wie der Grund (BL:33, `BUEHNE`); ohne Kante verschwindet die Oberkante |
| Einzeiler-Karte | `--surface`, Ring 2 px `--line`, Radius `--r3`, Innenabstand 16; Kicker 13/16 600 .06em `--muted`, Zeile 15/22 500 `--text2`, eine Zeile, `white-space: nowrap` | hintere Ebene leiser als das Blatt |
| Karte „Aus Ihrer Probe“ | `--surface`, Ring 2 px `--line2`, innen 1-px-Lichtkante oben `.24`; Begleitschatten `0 4px 16px -4px rgb(22 22 22 / .06)` | Schatten nur auf Papier sichtbar (DG 2.2.4; SG 10.4/11) |
| Karteninhalt | Kicker 13/16 600 .08em `--muted` · Element 15/22 700 `--text` · Zeile 15/22 500 `--text2` mit Kästchen 14 px, Rand 2 px `--text2`, Radius 3 | Kästchen wie in der Klärungsliste (BL:408-409) |
| Beschriftungen | 13/16, 600, Versalien, .08em, `--text2`, `aria-hidden` | Technikstimme (DG-E-6) |
| Führungslinien | SVG 1 px `--muted`, Endpunkt Ø 4 px `--text2` auf der Papierkante; Klammer mit 4-px-Enden | haarfeine Annotation (DNA 5.4) |
| Messraster | `linear-gradient`-Raster, fein `rgba(255,255,255,.035)`, kräftig `.05`; Maske: radial um die Blattmitte, links unter den Beschriftungen und unter dem Dateinamen auf 0 | ≤ 1,3 : 1, nie unter Text (DG 2.2.13) |
| Begriffe | `ul` mit 7 `li`; Raster `repeat(2, minmax(0,1fr))`, Abstand 16; 7. Eintrag über beide Spalten; Haarlinie 1 px `--line` über jeder Zeile; Satz `span` im Kurzzustand verborgen | eine Fassung des Katalogs |
| Umschalter | `<button type="button">` mit `font-size: 15px` ausdrücklich gesetzt | Prüfsuite: Knöpfe erben sonst 13,33 px (SKILL:70) |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung und Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | fünf Stufen; Einzeiler hinter dem Blatt, Schichten gestaffelt dahinter, Karte davor | 3 | Gegenüberstellung als Verdeckung statt zweier Spalten |
| Material, Transparenz | echtes Papier aus dem PDF-Code; matte opake Karten; kein Glas | 3 (Material als Thema, DG T5) | Glaubwürdigkeit durch das Original |
| Licht, Schatten | kein Lichtraum; Lichtkante am Kopfband und an der Karte; Begleitschatten nur auf Papier | 1 | Lichtbudget lag bei V1 und 02 |
| Formen | Papier 3 px gegen Karten 18 und 12 px | – | Dokument und Oberfläche bleiben unterscheidbar |
| 3D-Objekte, Perspektive | keine; Ebenen frontal, Drehung −2° in der Ebene | 0–1 | Lesbarkeit der Tabelle |
| Bildintegration | drei Ausschnitte desselben Beispiel-PDF, Beispielbetrieb und -familie durchgehend | 3 | einheitliches Beispielmaterial (G7) |
| Oberflächendetails | Messraster, Führungslinien mit Endpunkt und Klammer, Kästchen, echter Dateiname | 2 | präzise wie ein Aufmaß (DR 4) |
| Animation | Auftritt des Blatts, scrollgeführte Explosion mit Trägheit, Linien zeichnen sich | 3 | Bewegung erzählt: ein Blatt, darin Schichten |
| Typografie | Größen 32 · 17 · 15 · 13 (17 und 15 als eine Stufe); Technikstimme an Kapitelzeile, Kicker, Beschriftungen, Dateiname | – | höchstens drei Stufen je Ansicht |
| Überlagerungen | Blatt über Einzeiler ≈ 25 % → 57 %; Karte über Blattrand ≈ 5 % | – | Tiefe ohne Schlagschatten |
| Interaktive Effekte | nur Zustände an Umschalter und Textziel | 0 | ruhige Bedienschicht (G1) |

**Signature:** inszenierend 1: Material-Explosionsansicht mit Annotation (DR Baustein 6; Z 8.3.11); informierend: Messraster. Budget der
Stufe 3 damit voll.
**Bewusst weggelassen:** Glas (Budget; Text auf Glas über Weiß verfehlt 4,5 : 1), Lichtraum und Lichtfleck, Schatten unter dem Blatt und der
dunkle Rahmen `.vk-mk-rahmen` mit `--float`, Bestellmaß-Karte, hochzählende Zahlen, Hotspots an den Schichten, Parallaxe des Rasters,
Anheften, Reveal-Staffel der Liste, das orange Dateizeichen (Orange gehört nur zur Maueröffnung, `gemeinsam.css:17`).
**Abweichungen von bestehender Regel – Freigabe durch den Inhaber nötig:** Szene ohne „gedreht im Rahmen“ und ohne Bestellmaß- und
Klärungs-Karte, die gegeneinander laufen (GEST:450; folgt Z 8.4.1, Zeile 6); kein Schatten am Schwebenden (DR 3.3, Baustein 2; DG-AB-1, EA
AB-7); Liste ohne 24-px-Auftritt (GEST:447 „Bewegung“; DG-AB-2); Kapitelzeile mit Kapitelwort (E-AB-10).
**Abweichungen von Z (Festlegungen dieser Spezifikation):** Blatt am Telefon 256 statt 330 px, weil die Beschriftungen links neben dem
Anker stehen müssen (SG 10.1/5) und der Versatz 7,2 % braucht; Fokusträger bleibt mit 19 % in der Spanne der Stufe 3 (15–35 %). Einzeiler
rechts oben statt links, weil links die Beschriftungen stehen. Karte „Aus Ihrer Probe“ am Blattrand statt über dem unteren Drittel, weil dort
die Tabelle mit den Maßen liegt. Lead gekürzt, weil VK:80 bei 358 px vier Zeilen hätte (G2: höchstens drei). Ein Umschalter für alle sieben
Sätze statt sieben Aufklapper, damit die Begriffe ohne Tippen sichtbar bleiben.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primärer Fokus:** das Blatt. Papierweiß ist die einzige große helle Fläche (≈ 18 : 1 zum Grund) und bewegt sich als einziges.
- **Sekundär:** h2, danach der Satz des Einzeilers, danach die Karte „Aus Ihrer Probe“ (heller Text auf dunkler Fläche vor Weiß).
- **Erwartete Reihenfolge beim Scrollen:** h2 → Einzeiler allein („Was kosten 5 neue Fenster?“) → das Blatt erscheint darüber → die Bänder
  steigen hinter dem Blatt auf → Beschriftungen → Karte → Dateiname → Begriffe → Textziel. Das Vorher-Nachher entsteht in der Zeit, ohne
  zweite Spalte.
- **Kontraste:** Blatt ≈ 18 : 1, Kartentext ≈ 15 : 1, Einzeiler und Beschriftungen `--text2` ≈ 10–11 : 1, Raster ≤ 1,3 : 1.
- **CTA:** keine Hauptaktion und keine Cream-Fläche. Das Textziel steht links unten im Daumenbereich, leise als unterstrichener Text; der Kaufweg
  liegt im Kopf-Ring.
- **Ablenkungen und Gegenmittel:** Die Tabelle ist bei 256 px nicht lesbar (Beschriftungen und Begriffe übernehmen das Lesen); der Einzeiler
  könnte als Kundenzitat gelesen werden (Kicker „KONTAKTFORMULAR“, „Beispiel“); das Kästchen der Karte wirkt antippbar (14 px, kein Zeiger,
  keine Trefferfläche).
- **Übergang zu 04:** Das Textziel fragt nach der Marke; nach 96 px folgt „04 · IHRE MARKE“. Der Kopf des Blatts („übermittelt mit
  eeziframes“) findet sich in den Anmerkungen der Karten wieder („Hinweis auf eeziframes: dezent im Fuß“, Z 04.1).

## F. Interaktions- und Bewegungsverhalten

Ein bewegter Träger: erst Auftritt, dann Explosion, dann Linien; nie gleichzeitig (SG 10.7/4, E-2). Die Bedienschicht bewegt sich nicht.

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Blattoberkante erreicht 72 % der Bildhöhe (IntersectionObserver, `rootMargin: 0px 0px -28% 0px`) | Wrapper mit Stapel und Karte: Deckkraft 0 → 1, `translateY(-24px → 0)`; Dateiname nur Deckkraft | 600 ms, `--e-out` | Motiv-Auftritt aus der Lichtrichtung (Licht von oben) |
| Blattmitte wandert von 70 % auf 45 % der Bildhöhe | Zielwert p steigt von 0 auf 1, nur vorwärts (`p = max(p, neu)`); bis zum Ende des Auftritts bleibt p = 0 | ≈ 210 px Scrollweg bei 844 | scrollgeführt (DG T5), ohne Anheften (E-8) |
| jedes Bild, solange sich etwas bewegt | `q += (p − q) · (1 − e^(−dt/τ))`, τ = 140 ms für L2, 200 ms für L3; Transform direkt setzen; Schleife endet bei \|p − q\| < 0,002 | – | Trägheit, reagiert auf das Scrolltempo, kommt gestaffelt ohne Überschwingen zur Ruhe (DG 2.2.16) |
| Scrollen ruht 200 ms bei 0,35 ≤ p < 1 | p = 1 | ≈ 600 ms über τ | Endzustand ist immer komponiert (SG 10.7/6), auch nach einem Menüsprung |
| q von L3 ≥ 0,98 | Beschriftungen Deckkraft 0 → 1; Linien zeichnen sich (`stroke-dashoffset`), Klärung, Fotos, Maße je 60 ms versetzt | 160 ms bzw. 320 ms, `--e-out` | Text bewegt sich nicht, er erscheint |
| Rückwärtsscrollen | nichts; der Stapel bleibt auseinander | – | kein Flackern beim Lesen |
| Wahl in 02 (`vk:probe`) | Karte ändert Kicker und Werte; steht sie im Bild, Überblendung nur des Textes | 220 ms | eine Rückmeldung am Objekt |
| Tipp auf Umschalter | Sätze erscheinen unter den Begriffen, Liste wird einspaltig; Höhe springt, Inhalt blendet ein; `aria-expanded` | 220 ms, nur Deckkraft | keine Höhenanimation (SG 10.10) |
| Textziel | nativer Sprung zu `#pakete` | – | E-4: nur in Leserichtung |
| Hover (nur `hover: hover`) | Textziel Unterstreichung `--muted` → `--text`; Umschalter `--text2` → `--text` | 150 ms | Zustand über Farbe (G1) |
| Fokus | 2-px-Kontur `--ink`, Versatz 2 | – | SG 10.9 |
| weniger Bewegung | Endbild ab dem ersten Bild: Schichten auseinander, Beschriftungen und Linien sichtbar, kein Auftritt, Umschalter ohne Einblenden | 0 | SG 10.7/7 |
| ohne JavaScript | dasselbe Endbild (CSS-Grundzustand); alle sieben Sätze sichtbar, Umschalter `hidden`; Karte mit Beispielwerten | – | SKILL:62; DR Baustein 6 |
| Neuaufbau (`o.still`) | steht die Szene im Bild oder darüber: sofort Endbild; darunter: wie beim ersten Mal; Wahl aus `wurzel.__vkProbe` | – | SKILL:63-64 |

Charakter: ruhig, gleitend, ohne Federn und ohne Abprallen; Papier hebt ab, als würde man einen Stapel auffächern.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Komposition C.2 und C.3. Im Endzustand stehen bei 844 Lead, ganze Szene und die erste
Begriffszeile zusammen im Bild, bei 664 die ganze Szene. Textziel und Umschalter liegen im unteren Drittel, wenn man weiterscrollt.
360 px: b ≈ 228, die Szene schrumpft proportional, Schriften bleiben. 320 px: b ≈ 190; der Einzeiler darf zweizeilig werden, das
Textband wächst auf 76 px, alle Lagen darunter rücken mit (`--band`). 471–760 px: b = 330 (Obergrenze), Szene links an der Ordnungslinie,
rechts frei. 200 % Textgröße: Beschriftungsspalte `max-content`, b rechnet sich aus der Restbreite (Container-Einheiten), kein Querscrollen
(`overflow-x: clip` am Abschnitt fängt die gedrehten Ecken ab).

**Schreibtisch 1280 × 800.** Spalte 1040 (x 120–1160), 12 Spalten à 57,3 px, Abstand 32; Kopf 64 px.

- Kopfzone: Haarlinie über alle 12 Spalten, Kapitelzeile, h2 40/44 in einer Zeile über die Spalten 1–8.
- Ab y 121: links Spalten 1–5 (x 120–535) Lead (zwei Zeilen), 32 px tiefer die Begriffe 2 × 199 px, Umschalter, Feinaufmaß, Textziel
  (endet bei y ≈ 545); rechts Spalten 6–12 (x 567–1160) die Szene, Oberkante auf Höhe des Leads.
- Szene: Beschriftungen x 567–667; b = 400, h = 379; Blatt x 700–1100, L2 +14/−38, L3 +29/−76; Einzeiler 300 × 200 bei x 825–1125, y 0–200
  (Szenenkoordinaten), Blatt ab y 142; „KLÄRUNG“ y 77–93, „FOTOS“ y 115–131, „MASSE“ y 441–457 mit Klammer y 403–495; Karte 280 × 100 bei
  x 849–1129, y 507–607; Dateiname y 623–639. Szenenhöhe 639, Abschnitt ≈ 760 px = 0,95 BH.
- Ohne Anheften (Festlegung 8, Z 8.3.2 c), damit die Pakete bei ≈ 4,0 BH beginnen. Die linke Spalte endet ≈ 215 px vor der Szene; der Raum
  bleibt frei.

**Schreibtisch 1024.** Inhalt 992 px (x 16–1008), Spalten 60,7 px, Abstand 24. Text Spalten 1–5 (x 16–415), Szene Spalten 6–12 (x 439–1008):
Beschriftungen 96 px, b = 400, Stapel bis x 988; sonst wie 1280, um 128 px nach links. Zwischen 761 und 1023 px rechnet b nach C.6, alle Lagen
der Szene folgen aus b und h.

## H. Technische Umsetzung

**Bestehend (Datei):** `web/fuer-fensterbauer/index.html:120-147` wird ersetzt (h2 mit ID bleibt); `web/assets/verkauf.css:410-435` und
`:562-578` (`.vk-anfrage`, `.vk-szene`, `.vk-mk*`) werden ersetzt; `.vk-blatt` bleibt nur, solange 02 es noch nutzt; `web/assets/verkauf.js:436-445`
(`szene()`) wird ersetzt, und in `:477-479` fallen `.vk-inhalt > li`, `.vk-anfrage .vk-szene` und `.vk-anfrage .vk-blatt` aus dem Reveal;
`gemeinsam.js` (`Scroll.binden`, `ruhig`); `gemeinsam.css` (Tokens, Fokus).

**Neu:**

1. **Markup** `<figure class="vk-pf">`: Einzeiler `<p class="vk-pf-einzeiler">`, Stapel `<div class="vk-pf-stapel">` mit zwei Schichtbildern
   (`alt=""`, `aria-hidden="true"`) und dem Blatt (`<img>` mit Alt-Text aus VK:133, Breite und Höhe gesetzt), Karte `<p class="vk-pf-probe"
   data-vk-probe>`, Beschriftungen und Linien in `<div class="vk-pf-notiz" aria-hidden="true">` mit einem SVG, `<figcaption>` mit Dateiname.
   Danach `<ul class="vk-inhalt" id="vk-inhalt">`, `<button class="vk-umschalter" aria-expanded="false" aria-controls="vk-inhalt" hidden>`,
   Feinaufmaß `<p>`, Textziel `<a class="vk-textziel" href="#pakete">`. Keine `.btn.primary` (`portal.js:554` zählt sie als Cream), kein `input`.
2. **JS-Modul `postfach(wurzel, o)`** in `verkauf.js`, aufgerufen aus `Verkauf.auf`: Bindung je Element einmal (`__vkAn`); ein Beobachter für
   den Auftritt; Fortschritt aus `Scroll.binden` (Standardspanne, daraus die Lage der Blattmitte zurückrechnen); eigene rAF-Schleife nur
   während Bewegung, `will-change: transform` nur dann; Umschalter setzt `.kurz` an der Liste (ohne JS fehlt die Klasse, alles ist sichtbar).
   Karte liest `wurzel.__vkProbe` bzw. `sessionStorage` `vk-probe` (in `try/catch`) und hört auf `vk:probe`. Umfang ≈ 2 KB.
3. **Schnittstelle zu `fb-04`:** 02 veröffentlicht seine Wahl als Ereignis `vk:probe` an der Wurzel mit `{ element, sonnenschutz, beruehrt }`,
   legt sie in `wurzel.__vkProbe` und `sessionStorage` ab; ohne `beruehrt: true` zeigt die Karte die Beispielwerte. In der Spezifikation von
   02 ist das zu übernehmen.
4. **Bildskript:** TB erhält einen zweiten Ausgang für die Schichten: dasselbe Beispiel-PDF (`window.TourBeispiel.blatt(15, 'eeziframes.com',
   false)`), daraus zwei Ausschnitte mit eigenem Fingerabdruck in `web/bilder/fb-schichten.json`; `scripts/pruefen.mjs` prüft ihn wie
   :1465-1467. Die Tour-Bilder bleiben unverändert. Das Skript meldet die Zahl offener Klärungspunkte; die Meldung in V1 („Klärungsliste · 2
   Punkte offen“, Z V1) muss dazu passen.
5. **Prüfsuite:** Schriftgrößen der neuen Elemente nur 13, 15, 17, 32/40; keine weitere Cream; Text der sieben Begriffe gleich VK:124-130.

**CSS:** Telefon eine Spalte, Szene als Raster `grid-template-columns: max-content 1fr` mit `container-type: inline-size` an der Stapelzelle;
Schichten `position: absolute; inset: 0; aspect-ratio: 920 / 872`; Einzeiler, Karte und Bänder über `calc()` aus `--b`, `--h`, `--band`; ab
761 px `display: grid; grid-template-columns: repeat(12, minmax(0, 1fr))`, Text `grid-column: 1 / 6`, Szene `6 / 13`; animiert werden nur
`transform` und `opacity`; `contain: layout paint` an der Szene; kein `backdrop-filter`.

**Assets:**

| Asset | Art, Format, Maß | Quelle |
|---|---|---|
| Blatt `tour-aufmassblatt-15.webp` | WebP 920 × 872, nicht freigestellt, `loading="lazy"`, `decoding="async"` (Dichte 3,6× am Telefon, 2,3× am Schreibtisch) | vorhanden |
| `fb-schicht-klaerung.webp` | WebP 920 × 230, Ausschnitt Seite 1 ab Kicker „Mit dem Kunden zu klären“, weißes Papier, ≤ 20 KB; der Rest der Schicht ist Papierweiß aus CSS | per Skript aus BL, keine Anfrage |
| `fb-schicht-fotos.webp` | WebP 920 × 230, Ausschnitt der Positionsseite 1 ab Kicker „Einbausituation aus den Fotos“, ≤ 20 KB | per Skript; Grundfassung ohne Fotos (die Tourdaten haben keine Bilder, BL:578) |
| Zwei Beispielfotos für die Fotos-Schicht (optional) | JPEG 1600 × 1200, je ein Fenster eines Einfamilienhauses Baujahr 1978 von innen und von außen, frontal, Tageslicht, ohne Menschen, ohne Text und Wasserzeichen; erscheinen nur klein im Beispiel-PDF | beim Inhaber anzufragen (Flux) |
| Dateizeichen, Kästchen, Pfeil | Inline-SVG 12 × 14, 14 × 14, 16 × 16, `currentColor` | neu, im Code |

**Leistung:** unterhalb des ersten Bildschirms, ohne Einfluss auf LCP; feste Maße (CLS 0); ≈ 90 KB Bild, ≈ 2 KB JS; drei Ebenen nur während der
Bewegung als eigene Schicht; Schleife läuft nur bei Bewegung und nur im Bild. Risiko: veraltete Ausschnitte bei Änderungen an BL, abgefangen
über den Fingerabdruck; das gedrehte Bild kann auf schwachen Geräten weich wirken (Abnahme am Telefon des Inhabers).

**Barrierefreiheit:** h2 als Anker; Blatt mit Alt-Text, Einzeiler und Karte als lesbarer Text in der Leserichtung; Beschriftungen, Linien,
Raster und Schichten `aria-hidden`, ihr Inhalt steht in der Liste; Umschalter mit `aria-expanded` und `aria-controls`; Ziele ≥ 44 px;
Kontraste ≥ 4,5 : 1 für Text, ≥ 3 : 1 für Linien und Kästchen; keine Information nur in der Bewegung.

## I. Conversion-Begründung

- **Position:** Nach 02 weiß der Besucher, was sein Kunde tut; 03 zeigt, was bei ihm ankommt. Erst danach fragt 04 nach Preis und Marke.
  Die Folge Kundensicht → Ergebnis → Preis folgt der Kette S3 → S4 (EA 4.4).
- **Gestaltung:** Der Beweis ist das echte Blatt aus demselben Code, der die Anfragen erzeugt. Der Einzeiler macht den Unterschied in einem
  Bild sichtbar, ohne Behauptung über andere Anbieter. Die Karte „Aus Ihrer Probe“ verbindet die eigene Wahl aus 02 mit dem Ergebnis, und
  das Kästchen zeigt, dass „Weiß ich noch nicht“ kein Fehler ist, sondern ein Punkt zum Klären (F-14 teilweise, ohne Sortiment zu
  versprechen).
- **Informationsmenge:** ≈ 30 Wörter bis zur Szene, ≈ 25 in der Szene, ≈ 40 darunter; die sieben Sätze (≈ 120 Wörter) nur auf Wunsch. Heute
  ≈ 150 Wörter sichtbar (BD 3, Bildschirm 7).
- **Beitrag zur Zielhandlung:** Wer die Anfragen für brauchbar hält, bewertet die Pakete als Preis für ein Werkzeug, nicht für ein Formular.
  Das Textziel führt in Leserichtung zu den Paketen, ohne Cream zu verbrauchen. Das ist eine Hypothese, keine gemessene Wirkung.
- **Zu testende Annahmen [H]:**
  - DG-H-5: Die Explosionsansicht macht „was ankommt“ schneller verständlich als eine Liste. Prüfweg: Lesetest „Was steht in jeder Anfrage?“
    nach 20 Sekunden. Rückfall: stehendes Endbild ohne Explosion.
  - Der Einzeiler wird als „so kommen Anfragen heute“ gelesen und nicht als Herabsetzung der Kunden. Prüfweg: Gespräch mit zwei bis drei
    Fensterbauern. Rückfall: ohne Einzeiler, Blatt allein.
  - Die Karte wird mit der Probe in 02 verbunden. Prüfweg: Frage „Woher kommt ‚Balkontür‘?“. Rückfall: ohne Karte.
  - Drei Beschriftungen reichen, obwohl die Tabelle nicht lesbar ist. Prüfweg: Telefon-Video. Rückfall: Blatt 330 px, Beschriftungen unter
    der Szene als Legende.
  - Die Höhe von 1,23 BH verschiebt die Pakete nicht über Bildschirm 5 bei 844 (EA H-D2). Prüfweg: Bildschirmzählung am Prototyp. Rückfall:
    Begriffe nur im Umschalter (−176 px).
- **Vorschlag, nicht Teil der Grundfassung:** ein Link „Ganzes Beispiel-PDF“, erzeugt mit TB, für Fensterbauer, die das Blatt lesen wollen.
  Entscheidet der Inhaber (SKILL:26).

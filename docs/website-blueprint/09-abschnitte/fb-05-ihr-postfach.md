# 03 Ihr Postfach (#was-in-jeder-anfrage-steht)

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 5 von 15 (Kapitel 03, nach 02 Ihr Kunde, vor 04.1 Pakete) · Intensitätsstufe: 3 gestaltet (Typ T5 Beweis)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu
BL = `web/assets/blatt.js`, EG = `functions/api/eingang.js`, PK = `web/assets/pakete.js`, TB = `scripts/tour-bild.mjs`. **[V]** verbindlich,
**[H]** Hypothese mit Rückfall. Alle Lagen und Wirkungen sind geplant, nicht gemessen.

## A. Abschnitt und Funktion

- **Name, ID, Anker:** 03 Ihr Postfach, `fb-05-ihr-postfach`, h2 mit `id="was-in-jeder-anfrage-steht"` (Menüanker, Z 8.1.4; keine
  Pflicht-ID der Prüfsuite, bleibt trotzdem unverändert).
- **Position:** Telefon ≈ 3,5–4,7 BH, bei 664 px Höhe Bildschirm 5–6. Davor 02 Ihr Kunde (Stufe 3, letzter Lichtort), danach 04.1 Pakete
  (Stufe 2). Rhythmus 4 · 3 · 2 · 3 · **3** · 2: zweiter Abschnitt der Stufe 3 in Folge, das erlaubte Maximum (DG 2.3.17/6); deshalb kein Licht.
- **Zugänge:** Weiterscrollen aus 02, Menü „03“. Der Kopf-Ring „Pakete ansehen“ bleibt sichtbar.
- **Ziel:** EA S3, Produktbeweis am Ergebnis: Was im Postfach ankommt, wird als echtes Dokument gezeigt, nicht beschrieben.
- **Beantwortete Nutzerfrage:** „Was landet bei mir im Postfach, und reicht das fürs Angebot?“ (F-15), dazu „Kunden messen falsch, und dann
  hafte ich?“ (F-09).
- **Vorbereitete Entscheidung:** Anfragen über den Konfigurator sind brauchbar und besser als Einzeiler; daraus folgt die Frage nach Preis
  und Markenstufe, die 04 beantwortet. Gekauft wird hier nichts.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Was in jeder Anfrage steht“, grün „Anfrage“ | VK:121 | wörtlich |
| „Anfragen, mit denen Sie rechnen können: keine Einzeiler aus dem Kontaktformular, sondern Maße, Fotos und Wünsche je Position, mit Klärungsliste.“ | VK:80 | Lead, gekürzt |
| Sieben Inhalte, je Titel und Satz | VK:124-130 | Titel sichtbar, Sätze im Umschalter; die eine Fassung des Katalogs (IA K15) |
| Echtes Aufmaßblatt, Seite 1, „Fensterbau Brandt“ / „Familie Weber“, Nr. „P-BEISPIEL“, 920 × 872, Alt-Text | `web/bilder/tour-aufmassblatt-15.webp`; VK:133; TB:1-6 | Held |
| Aufbau des PDF: Seite 1 Übersicht und Klärungsliste, je Position Zeichnung, Maße, Wünsche, Einbausituation, Fotos | BL:26-27, :404-415, :567-590 | Quelle der zwei Schichtbilder |
| Klärungspunkt mit leerem Kästchen, Titel „Mit dem Kunden zu klären“ | BL:404, :413-415 | Schicht 3; Kästchen der Karte |
| Anhangname `'Aufmass-' + Nr. + '-' + Kunde + '.pdf'` | EG:86-87 | „Aufmass-P-BEISPIEL-Familie-Weber.pdf“ statt „Aufmassblatt_Weber.pdf“ (VK:133) |
| Nennung von eeziframes im Blatt deutlich, dezent oder keine; Logo ab Plus | PK:46, :54, :62 (`pdfKennzeichnung`, `logo`); BL:14-15 | Grund des Textziels |
| „Die Maße im Aufmaßblatt sind Angaben Ihrer Kunden; vor der Fertigung messen Sie selbst nach (Feinaufmaß).“ | PB:44 § 2 (4) | Zeile zu F-09, gekürzt |
| Optionen der Probe: Fenster, Balkontür, Hebe-Schiebe-Tür; Ohne, Raffstore, Weiß ich noch nicht | Z 8.3.2 b (02); `README.md:3`, `web/assets/app.js:1368` | Werte der Karte |
| „Weiß ich noch nicht“ landet in der Klärungsliste | VK:130 | Logik der Karte |

Entfällt: Bestellmaß-Karte (VK:134) und abgehakte Klärungs-Karte (VK:135-144); an ihre Stelle treten die echte Schicht und die Karte „Aus
Ihrer Probe“ (Z 8.4.1, Zeile 6).

**B.2 Texte**

| Element | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „03 · IHR POSTFACH“ | Textentwurf (Z 8.2.6) |
| h2 | „Was in jeder Anfrage steht“, grün „Anfrage“ | Bestand VK:121 |
| Lead | „Statt eines Einzeilers: Maße, Fotos und Wünsche je Position, mit Klärungsliste.“ | Textentwurf aus VK:80 |
| Einzeiler-Karte | Kicker „KONTAKTFORMULAR“, rechts „Beispiel“; Zeile „Was kosten 5 neue Fenster?“ | Textentwurf; „5“ wie „5 von 11 werden getauscht“ im selben Blatt |
| Beschriftungen | „KLÄRUNG“, „FOTOS“, „MASSE“ | Textentwurf |
| Karte ohne Tipp in 02 | Kicker „PROBE · BEISPIEL“; „Balkontür“; Kästchen + „Sonnenschutz: zu klären“ | Textentwurf |
| Karte nach Tipp in 02 | Kicker „AUS IHRER PROBE“; gewähltes Element; „Sonnenschutz: ohne“ · „Sonnenschutz: Raffstore“ · Kästchen + „Sonnenschutz: zu klären“ | Textentwurf |
| Bildunterschrift | „Aufmass-P-BEISPIEL-Familie-Weber.pdf“ | aus EG:87 |
| Umschalter | „Alle Angaben im Einzelnen“, offen „Weniger zeigen“ | Textentwurf |
| Feinaufmaß | „Die Maße sind Angaben Ihrer Kunden; vor der Fertigung messen Sie selbst nach (Feinaufmaß).“ | Textentwurf aus PB:44 |
| Textziel | „Wie sehr soll es Ihre Marke tragen?“ → `#pakete` | Textentwurf; „es“ (das Blatt) statt „er“ (Z 8.2.6), weil der Satz unter dem Blatt steht |

Der Firmenname aus 01 erscheint weder im Blatt noch in der Karte (E-12): Ein zweiter Name neben „Fensterbau Brandt“ wäre uneinheitliches
Beispielmaterial (DG T5 „Nicht“). Aus demselben Grund entfällt „Pos. 1“ aus Z in der Karte; Pos. 1 ist im Blatt „Wohnzimmer“.

**B.3 Interaktionen:** zwei leise: Umschalter (zeigt die sieben Sätze) und Textziel zu `#pakete`. Ohne Bedienung: die scrollgeführte
Explosionsansicht und die Übernahme der Wahl aus 02 in die Karte. Kein Hotspot, kein Vergrößern, kein Senden (E-7).

**B.4 Vorhandene Komponenten:** `.vk-teil` mit Haarlinie (`web/assets/verkauf.css:500-502`); Liste `.vk-inhalt` (VK:123-131,
`verkauf.css:412-416`); `Verkauf.auf`, `beobachten()`, `ruhig()`, `kannIO` (`web/assets/verkauf.js:1-16`); `window.Scroll.binden`
(`web/assets/gemeinsam.js:296-324`); Tokens und Fokus aus `gemeinsam.css:9-31`; Bildpipeline TB mit Fingerabdruck (`scripts/pruefen.mjs:1465-1467`).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Telefon: eine Spalte, Haarlinie → Kapitelzeile → h2 → Lead → Szene (Held) → Begriffe → Umschalter → Feinaufmaß →
Textziel (G2). Die Szene ist ein kleiner Split: links eine Beschriftungsspalte an der Ordnungslinie x = 16, rechts der Papierstapel.
Asymmetrisch, schwer nach rechts oben; Beschriftungsspalte und der Raum neben dem Einzeiler bleiben Negativraum.

**C.2 Telefon 390 × 844, Lagen relativ zur Haarlinie (y = 0); 4 Spalten à 77,5 px, Rinne 16; Abschnittskopf nach K-15**

| y | Element | Breite · x | Schrift |
|---|---|---|---|
| 0 | Haarlinie 1 px `--line` | 358 · 16–374 | 96 px Abstand zu 02 |
| 16–32 | Kapitelzeile, 16 px unter der Haarlinie | links | Technikstimme Versal 13/16, 600, +0,12 em, `tabular-nums`; „03“ `--accent`, „· IHR POSTFACH“ `--muted` (K-16) |
| 44–112 | h2, zwei Zeilen, 12 px unter der Kapitelzeile | 358 | 32/34, 800, −0,03 em (K-18) |
| 124–175 | Lead, zwei Zeilen | 358 | 17/25,5, 500, `--text2` |
| 199–667 | Szene (C.3) | 358 | – |
| 691–867 | Begriffe: 3 Zeilen à zwei (Spalten 1–2 und 3–4), der 7. über die volle Breite, je 44 | 358 | 15/18, 700, `--text` |
| 867–911 | Umschalter, Trefferfläche 358 × 44, „+“ rechts | 16–374 | 15, 700, `--text2` |
| 927–971 | Feinaufmaß, zwei Zeilen | 358 | 15/22, 500, `--text2`, „Feinaufmaß“ `--text` |
| 987–1031 | Textziel mit Pfeil 16 px, Trefferfläche 358 × 44 | links | 17, 700, Unterstreichung 1 px `--muted`, Versatz 6 |

Gesamthöhe ≈ 1.031 px = 1,22 BH (Z: 1,20). Offen wächst die Liste um ≈ 560 px.

**C.3 Szene (x 0 = Seite x 16, y 0 = Seite y 199); Blatt b = 256, h = 243 (920 : 872)**

| Element | x | y | Maß | Z |
|---|---|---|---|---|
| Messraster | −16 bis 374, randlos | −24 bis 492 | fein 8, kräftig 40 px | 0 |
| Einzeiler-Karte | 112–354 | 0–150 | 242 × 150, Radius 24 (`--r4`, Karte mit Ring, K-22); Textband y 0–56 | 5 |
| Schicht 3 „Klärung“ (L3) | 102–358 (Ruhe 84–340) | 64–307 (Ruhe 113–356) | b × h, Versatz +7,2 % / −20 % | 20 hinten |
| Schicht 2 „Fotos“ (L2) | 93–349 (Ruhe 84–340) | 89–332 (Ruhe 113–356) | b × h, Versatz +3,6 % / −10 % | 20 Mitte |
| Blatt, Seite 1 („Maße“) | 84–340 | 113–356 | b × h; Stapelgruppe um −2° gedreht | 20 vorn |
| „KLÄRUNG“ | 0–71 | 68–84 | Linie auf y 76 bis zur Kante von L3 | 30, Linie 25 |
| „FOTOS“ | 0–51 | 93–109 | Linie auf y 101 bis zur Kante von L2 | 30, Linie 25 |
| „MASSE“ | 0–51 | 302–318 | Linie auf y 310 zur Klammer x 76, y 280–339 (Tabellenzeilen) | 30, Linie 25 |
| Karte „Aus Ihrer Probe“ | 122–358 | 340–436 | 236 × 96, Radius 12 (`--r2`, Etikett auf Papier, K-22); liegt ≈ 14 px auf der Blattunterkante | 25 |
| Dateiname | 0–290 | 452–468 | Zeichen 12 × 14, Text ab x 20 | 30 |

Von L3 und L2 sind nur die Bänder über dem Blatt (25 bzw. 24 px) und je ein 9-px-Streifen rechts sichtbar. Die Schichtbilder beginnen
deshalb mit ihrem Kicker auf weißem Papier: L3 bei „Mit dem Kunden zu klären“ samt erster Kästchenzeile, L2 bei „Einbausituation aus den
Fotos“. Nie mit dem dunklen Kopfband einer PDF-Seite, das auf `#161616` verschwinden würde.

**C.4 Verhältnisse.** Endzustand (Blattmitte bei 45 % der Höhe): ganze Szene im Bild; Blatt 19 % der Bildschirmfläche (Stufe 3: 15–35 %),
Szene ≈ 40 % Bildanteil, Text ≈ 12 %, frei ≈ 48 %. Maßstabssprung Blatt 243 px zu Bedienschrift 13 px ≈ 19-fach (SG 10.1/4). Das Blatt
verdeckt den Einzeiler vor der Explosion zu ≈ 25 %, danach zu ≈ 57 %; dessen Satz liegt im Textband und bleibt ganz lesbar (SG 10.1/6). Die
Karte verdeckt ≈ 5 % des Blatts (Fußnote, Rand), nie die Tabelle mit Öffnung, Element und Bestellmaß.

**C.5 Ebenen:** 0 Grund mit Messraster → 5 Einzeiler (Inhaltsfläche unter dem Fokusträger, SG `--z-inhalt`) → 20 L3, L2, Blatt → 25 Karte,
Führungslinien → 30 Beschriftungen, Dateiname, Bedienschicht → 40 Kopf. Tiefe nur über Verdeckung und Tonwert: L2 mit 6 %, L3 mit 12 %
fester Abdunklung (statisches `::after`, kein `filter`).

**C.6 Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| h2 | genau `<h2 id="was-in-jeder-anfrage-steht">Was in jeder <span class="ak">Anfrage</span> steht</h2>`; `scroll-margin-top: 116px`, ab 1024 px `124px` (`scroll-padding-top` 72/80 px seitenweit) | K-15: nach dem Sprung steht die Haarlinie 16 px unter dem Kopf |
| Blattbreite | Telefon und Zwischengröße `--b: clamp(180px, calc((100vw - 116px) / 1.072), 330px)`; ab 1024 px `clamp(300px, calc((Szenenspalte - 120px) / 1.072), 400px)` (bei 1024: (550 − 120) / 1,072 → 400); `--h: calc(var(--b) * .9478)` | 116 px für Beschriftungen und Versatz; Umbruchpunkte nach K-11 |
| Versatz, Drehung | L2 `translate(3.6%, -10%)`, L3 `translate(7.2%, -20%)` (Prozent der eigenen Größe); `rotate(-2deg)` an der Stapelgruppe; Papier Radius 3 px (Motivradius, zählt nach K-22 nicht) | DG T5 (≤ 20 % der Blatthöhe); keine Kippung (SG 10.7/1) |
| Lichtkante am Blatt | 1 px oben `rgba(243,242,238,.24)`, an den Seiten des Kopfbands `.14` | Kopfband ist `#161616` wie der Grund (BL:34 `BUEHNE`); sonst verschwindet die Oberkante |
| Einzeiler-Karte | `--surface`, Ring 2 px `--line`, Radius `--r4` (24 px, K-22), Innenabstand 16; Kicker 13/16 600 +0,12 em `--muted` (K-17); Zeile 15/22 500 `--text2`, `white-space: nowrap` | hintere Ebene leiser als das Blatt |
| Karte „Aus Ihrer Probe“ | `--surface`, Ring 2 px `--line2`, innen 1-px-Lichtkante oben `.24`; Begleitschatten nach K-25: Telefon (Höhe 96, v = 9,6) `box-shadow: -5.8px 7.7px 24px -2.4px rgb(22 22 22 / .06)`, Schreibtisch (Höhe 100, v = 10) `-6px 8px 25px -2.5px rgb(22 22 22 / .06)` | Begleitschatten nur auf Papier sichtbar (DG 2.2.4; SG 10.4/11); K-25: v = 10 % der Kartenhöhe in Lichtrichtung, x = −0,6 · v, y = 0,8 · v, Weichzeichnung 2,5 × v, Ausdehnung −25 % von v, `--ground` 6 % |
| Karteninhalt | Kicker 13/16 600 +0,12 em `--muted` (K-17); Element 15/22 700 `--text`; Zeile 15/22 500 `--text2`; Kästchen 14 px, Rand 2 px `--text2`, Radius 3 (Motivradius wie im Blatt, zählt nach K-22 nicht) | Kästchen wie in der Klärungsliste (BL:415) |
| Beschriftungen | 13/16, 600, Versalien, +0,12 em (K-17), `--text2` | Technikstimme (DG-E-6) |
| Führungslinien | SVG 1 px `--muted`, Endpunkt Ø 4 px `--text2` auf der Papierkante; Klammer mit 4-px-Enden | haarfeine Annotation (DNA 5.4) |
| Messraster | Verläufe, fein `rgba(255,255,255,.035)`, kräftig `.05`, Linien an der Ordnungslinie ausgerichtet (Telefon x = 16, Zwischengröße x = 24); Maske radial um die Blattmitte, unter Beschriftungen und Dateiname 0 | ≤ 1,3 : 1, nie unter Text (DG 2.2.13) |
| Begriffe | `ul` mit 7 `li` (`b` Titel, `span` Satz); Raster `repeat(2, minmax(0,1fr))`, Abstand 16; 7. Eintrag `grid-column: 1 / -1`; Haarlinie `--line` über jeder Zeile | eine Fassung des Katalogs |
| Umschalter | `<button type="button">` mit ausdrücklich `font-size: 15px` | Knöpfe erben sonst 13,33 px (SKILL:70) |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung und Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | fünf Stufen; Einzeiler hinter dem Blatt, Schichten dahinter gestaffelt, Karte davor | 3 | Gegenüberstellung als Verdeckung statt zweier Spalten |
| Material, Transparenz | echtes Papier aus dem PDF-Code; opake, matte Karten; kein Glas | 3 (Material als Thema, DG T5) | Glaubwürdigkeit durch das Original |
| Licht, Schatten | kein Lichtraum; Lichtkanten an Kopfband und Karte; Begleitschatten nur auf Papier | 1 | Lichtbudget lag bei V1 und 02 |
| 3D-Objekte, Perspektive | keine; Ebenen frontal, −2° in der Ebene | 0–1 | Tabelle bleibt gerade lesbar |
| Bildintegration | drei Ausschnitte desselben Beispiel-PDF | 3 | einheitliches Beispielmaterial (G7) |
| Oberflächendetails | Messraster, Linien mit Endpunkt und Klammer, Kästchen, echter Dateiname | 2 | präzise wie ein Aufmaß (DR 4) |
| Animation | Auftritt, scrollgeführte Explosion mit Trägheit, Linien zeichnen sich | 3 | erzählt: ein Blatt, darin Schichten |
| Typografie | 32 · 17/15 · 13 (17 und 15 als eine Stufe); Technikstimme an Kapitelzeile, Kickern, Beschriftungen, Dateiname | – | höchstens drei Stufen je Ansicht |
| Überlagerungen | Blatt über Einzeiler 25 % → 57 %; Karte über Blattrand ≈ 5 % | – | Tiefe ohne Schlagschatten |
| Interaktive Effekte | nur Zustände an Umschalter und Textziel | 0 | ruhige Bedienschicht (G1) |

**Signature:** inszenierend 1: Material-Explosionsansicht mit Annotation (DR Baustein 6; Z 8.3.11); informierend: Messraster. Das Budget der
Stufe 3 ist damit voll.
**Bewusst weggelassen:** Glas (Budget; Text auf Glas über Weiß verfehlt 4,5 : 1), Lichtraum, Schatten und Rahmen `.vk-mk-rahmen` mit
`--float`, Bestellmaß-Karte, Hotspots, Parallaxe des Rasters, Anheften, Reveal-Staffel der Liste, das orange Dateizeichen (Orange gehört der
Maueröffnung, `gemeinsam.css:17`).
**Abweichungen von bestehender Regel – Freigabe durch den Inhaber nötig:** Szene ohne „gedreht im Rahmen“ und ohne Bestellmaß- und
Klärungs-Karte, die gegeneinander laufen (GEST:450; folgt Z 8.4.1, Zeile 6); kein Schatten am Schwebenden (DR 3.3, Baustein 2; DG-AB-1,
EA AB-7); Liste ohne 24-px-Auftritt (GEST:447; DG-AB-2); Kapitelzeile mit Kapitelwort (E-AB-10); Versalzeilen (Kapitelzeile, Kicker,
Beschriftungen) 600 und +0,12 em statt 800 und .18em, weil eine Sperrung für die ganze Technikstimme gilt und die Zeilen einzeilig bleiben
(GEST:26; K-17, DS-AB-1); Text und Szene bis 1023 px untereinander, Split erst ab 1024 statt ab 761 px, weil zwei Umbruchpunkte die Zahl
der Kompositionen prüfbar halten (GEST:462; K-11, DS-AB-6). Die Radien 24 und 12 stehen auch in GEST:32.
**Abweichungen von Z (Festlegungen dieser Spezifikation):** Blatt am Telefon 256 statt 330 px, weil die Beschriftungen neben dem Anker stehen
müssen (SG 10.1/5) und der Versatz 7,2 % braucht; mit 19 % bleibt es in der Spanne der Stufe 3. Einzeiler rechts oben statt links, weil links
die Beschriftungen stehen. Karte am Blattrand statt über dem unteren Drittel, weil dort die Tabelle mit den Maßen liegt. Lead gekürzt, weil
VK:80 bei 358 px vier Zeilen hätte (G2: höchstens drei). Ein Umschalter statt sieben Aufklapper, damit die Begriffe ohne Tippen sichtbar sind.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primärer Fokus:** das Blatt; Papierweiß ist die einzige große helle Fläche (≈ 18 : 1 zum Grund) und das einzige, was sich bewegt.
- **Sekundär:** h2, dann der Satz des Einzeilers, dann die Karte „Aus Ihrer Probe“ (heller Text auf dunkler Fläche vor Weiß).
- **Erwartete Reihenfolge:** h2 → Einzeiler allein („Was kosten 5 neue Fenster?“) → das Blatt erscheint darüber → Bänder steigen hinter dem
  Blatt auf → Beschriftungen → Karte → Dateiname → Begriffe → Textziel. Das Vorher-Nachher entsteht in der Zeit, ohne zweite Spalte.
- **Kontraste:** Blatt ≈ 18 : 1, Kartentext ≈ 15 : 1, Einzeiler und Beschriftungen ≈ 10–11 : 1, Raster ≤ 1,3 : 1.
- **CTA:** keine Hauptaktion, keine Cream-Fläche. Das Textziel steht links unten im Daumenbereich, leise; der Kaufweg liegt im Kopf-Ring.
- **Ablenkungen und Gegenmittel:** Die Tabelle ist bei 256 px nicht lesbar (Beschriftungen und Begriffe übernehmen das Lesen); der Einzeiler
  könnte als Kundenzitat wirken (Kicker „KONTAKTFORMULAR“, „Beispiel“); das Kästchen wirkt antippbar (14 px, keine Trefferfläche).
- **Übergang zu 04:** Das Textziel fragt nach der Marke, nach 96 px folgt „04 · IHRE MARKE“. Der Kopf des Blatts („übermittelt mit
  eeziframes“) kehrt in den Anmerkungen der Karten wieder („Hinweis auf eeziframes: dezent im Fuß“, Z 04.1).

## F. Interaktions- und Bewegungsverhalten

Ein bewegter Träger: erst Auftritt, dann Explosion, dann Linien, nie gleichzeitig (SG 10.7/4, E-2). Die Bedienschicht bewegt sich nicht.
Charakter: ruhig, gleitend, ohne Feder und Abprallen, wie ein Stapel Papier, der sich auffächert. Physik nach K-37, Modell Trägheit
(kritisch gedämpft, ζ = 1, kein Überschwingen); die Feder bleibt fingergeführten Bildebenen vorbehalten.

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Blattoberkante erreicht 72 % der Bildhöhe (`IntersectionObserver`, `rootMargin: 0px 0px -28% 0px`) | Wrapper mit Stapel und Karte: Deckkraft 0 → 1, `translateY(-24px → 0)`; Dateiname nur Deckkraft | 600 ms, `--e-out` | Auftritt aus der Lichtrichtung (oben) |
| Blattmitte wandert von 70 % auf 45 % der Bildhöhe | Zielwert p von 0 auf 1, nur vorwärts (`p = max(p, neu)`); bis zum Ende des Auftritts p = 0 | ≈ 210 px Scrollweg bei 844 | scrollgeführt (DG T5), ohne Anheften (E-8) |
| jedes Bild, solange sich etwas bewegt | Trägheit nach K-37 als gestaffelte Glättung erster Ordnung: `q += (p − q) · (1 − e^(−dt/τ))`, τ = 140 ms für L2, 200 ms für L3; Transform direkt setzen; Schleife endet bei \|p − q\| < 0,002 | – | Trägheit nach Scrolltempo, gestaffelte Ruhe ohne Überschwingen (DG 2.2.16; K-37) |
| Scrollen ruht 200 ms bei 0,35 ≤ p < 1 | p = 1 | ≈ 600 ms | Endzustand immer komponiert (SG 10.7/6), auch nach Menüsprung |
| q von L3 ≥ 0,98 | Beschriftungen Deckkraft 0 → 1; Linien zeichnen sich (`stroke-dashoffset`), Klärung, Fotos, Maße je 60 ms versetzt | 160 bzw. 320 ms, `--e-out` | Text bewegt sich nicht, er erscheint |
| Rückwärtsscrollen | nichts; der Stapel bleibt offen | – | kein Flackern beim Lesen |
| Wahl in 02 (`vk:probe`) | Kicker und Werte der Karte wechseln; steht sie im Bild, Überblendung nur des Textes | 220 ms | eine Rückmeldung am Objekt |
| Tipp auf Umschalter | Liste einspaltig, Sätze erscheinen; `aria-expanded` | 220 ms, nur Deckkraft | keine Höhenanimation (SG 10.10) |
| Textziel | nativer Sprung zu `#pakete` | – | nur in Leserichtung (E-4) |
| Hover (`hover: hover`), Fokus | Unterstreichung bzw. Text `--muted`/`--text2` → `--text`; Fokus 2-px-Kontur `--ink`, Versatz 2 | 150 ms | Zustand über Farbe (G1); SG 10.9 |
| weniger Bewegung | Endbild ab dem ersten Bild: Schichten offen, Beschriftungen und Linien sichtbar, kein Auftritt | 0 | SG 10.7/7 |
| ohne JavaScript | dasselbe Endbild als CSS-Grundzustand; alle sieben Sätze sichtbar, Umschalter `hidden`; Karte mit Beispielwerten | – | SKILL:62; DR Baustein 6 |
| Neuaufbau (`o.still`) | Szene im Bild oder darüber: sofort Endbild; darunter: wie beim ersten Mal; Wahl aus `wurzel.__vkProbe` | – | SKILL:63-64 |

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Komposition C.2 und C.3. Im Endzustand stehen bei 844 Lead, ganze Szene und die erste
Begriffszeile zusammen im Bild, bei 664 die ganze Szene. 360 px: b ≈ 228, Szene proportional kleiner, Schriften gleich. 320 px: b ≈ 190;
der Einzeiler darf zweizeilig werden (Containerabfrage an der Stapelzelle, nicht am Bildschirm; K-11), das Textband wächst auf 76 px, die
Lagen darunter rücken über `--band` mit. 471–639 px: b = 330, Szene links an der Ordnungslinie. 200 % Textgröße: Beschriftungsspalte `max-content`, b aus der Restbreite (Container-Einheiten); kein
Querscrollen, `overflow-x: clip` am Abschnitt fängt die gedrehten Ecken ab.

**Schreibtisch 1280 × 800.** Spalte 1040 (x 120–1160), 12 Spalten à 64,67 px, Rinne 24 (K-12); Kopf 64 px.

- Kopfzone (K-15): Haarlinie über 12 Spalten, Kapitelzeile y 16–32, h2 40/42 (K-18) einzeilig y 44–86 über die Spalten 1–8.
- Ab y 118 links Spalten 1–5 (x 120–539): Lead zweizeilig, 32 px tiefer Begriffe 2 × 201,7 px (Abstand 16), Umschalter, Feinaufmaß,
  Textziel (Ende y ≈ 542). Rechts Spalten 6–12 (x 563–1160): Szene, Oberkante auf Höhe des Leads.
- Szene (eigene Koordinaten): Beschriftungen x 563–663; b = 400, h = 379; Blatt x 696–1096, ab y 142; L2 +14/−38, L3 +29/−76; Einzeiler
  300 × 200 bei x 821–1121, y 0–200; „KLÄRUNG“ y 77–93, „FOTOS“ y 115–131, „MASSE“ y 441–457 mit Klammer y 403–495; Karte 280 × 100 bei
  x 845–1125, y 507–607; Dateiname y 623–639. Abschnitt ≈ 760 px = 0,95 BH.
- Ohne Anheften (Festlegung 8, Z 8.3.2 c), damit die Pakete bei ≈ 4,0 BH beginnen; unter der linken Spalte bleiben ≈ 215 px frei.

**Schreibtisch 1024.** Rand 32, Spalte 960 (x 32–992), 12 Spalten à 58 px, Rinne 24 (K-13). Text Spalten 1–5 (x 32–418), Szene Spalten
6–12 (x 442–992): Beschriftungen 96 px (x 442–538), b = 400 (Formel C.6), Blatt x 562–962, Stapel bis x 991, die gedrehte Ecke ragt ≈ 7 px
in den Rand; h2 40/42, sonst wie 1280.

**Zwischengröße 640–1023 px.** Rand 24, 8 Spalten, Rinne 16 (K-11, K-13): Komposition des Telefons ohne Split, Ordnungslinie x = 24,
b = 330, Szene links an der Ordnungslinie, h2 32/34; alle Lagen aus b und h wie C.3.

## H. Technische Umsetzung

**Bestehend (Datei):** `web/fuer-fensterbauer/index.html:120-147` wird ersetzt (h2 mit ID bleibt). In `web/assets/verkauf.css` werden
`:410-435` und `:562-578` (`.vk-anfrage`, `.vk-szene`, `.vk-mk*`) ersetzt; `.vk-blatt` bleibt nur, solange 02 es nutzt. In
`web/assets/verkauf.js` wird `szene()` (`:436-445`) ersetzt, und `.vk-inhalt > li`, `.vk-anfrage .vk-szene`, `.vk-anfrage .vk-blatt` fallen
aus dem Reveal (`:477-479`). Dazu `gemeinsam.js` (`Scroll.binden`, `ruhig`) und `gemeinsam.css`.

**Neu:**

1. **Markup** `<figure class="vk-pf">`: Einzeiler als `<p>`; Stapel mit zwei Schichtbildern (`alt=""`, `aria-hidden="true"`) und dem Blatt
   (`<img>` mit Alt-Text aus VK:133, `width`/`height` gesetzt); Karte `<p data-vk-probe>`; Beschriftungen und Linien in einem
   `aria-hidden`-Block mit einem SVG; `<figcaption>` mit Dateiname. Danach `<ul class="vk-inhalt" id="vk-inhalt">`, Umschalter
   `<button aria-expanded="false" aria-controls="vk-inhalt" hidden>`, Feinaufmaß, Textziel `<a href="#pakete">`. Keine `.btn.primary`
   (`portal.js:554` zählt sie als Cream), kein `input`.
2. **JS-Modul `postfach(wurzel, o)`** in `verkauf.js`, aus `Verkauf.auf`: Bindung je Element einmal (`__vkAn`); ein Beobachter für den
   Auftritt; Fortschritt aus `Scroll.binden` (Standardspanne, daraus die Lage der Blattmitte); eigene rAF-Schleife nur während Bewegung,
   `will-change: transform` nur dann; Umschalter setzt `.kurz` an der Liste (ohne JS fehlt die Klasse). Karte liest `wurzel.__vkProbe` bzw.
   `sessionStorage` `vk-probe` (in `try/catch`) und hört auf `vk:probe`. Umfang ≈ 2 KB.
3. **Schnittstelle zu `fb-04`:** 02 sendet `vk:probe` an der Wurzel mit `{ element, sonnenschutz, beruehrt }` und legt die Wahl in
   `wurzel.__vkProbe` und `sessionStorage` ab; ohne `beruehrt: true` zeigt die Karte die Beispielwerte. In die Spezifikation von 02 übernehmen.
4. **Bildskript:** TB bekommt einen zweiten Ausgang: dasselbe Beispiel-PDF (`window.TourBeispiel.blatt(15, 'eeziframes.com', false)`), zwei
   Ausschnitte, eigener Fingerabdruck in `web/bilder/fb-schichten.json`, geprüft wie `scripts/pruefen.mjs:1465-1467`; die Tour-Bilder bleiben
   unverändert. Das Skript meldet die Zahl offener Klärungspunkte; die Meldung in V1 („Klärungsliste · 2 Punkte offen“) muss dazu passen.
5. **Prüfsuite:** neue Elemente nur in 13, 15, 17, 32/40 px; keine weitere Cream; die sieben Titel gleich VK:124-130.

**CSS:** Szene `grid-template-columns: max-content 1fr`, Stapelzelle `container-type: inline-size`, Schichten absolut in einem Kasten mit
`aspect-ratio: 920 / 872`; Lagen per `calc()` aus `--b`, `--h`, `--band`; ab 1024 px 12-Spalten-Raster mit Rinne 24 (K-11, K-12), Text
`1 / 6`, Szene `6 / 13`, darunter einspaltig (640–1023 px Rand 24); nur
`transform` und `opacity` animiert; `contain: layout paint`; kein `backdrop-filter`.

**Assets:**

| Asset | Art, Format, Maß | Quelle |
|---|---|---|
| `tour-aufmassblatt-15.webp` | WebP 920 × 872, nicht freigestellt, `loading="lazy"`, `decoding="async"` (3,6-fach am Telefon, 2,3-fach am Schreibtisch) | vorhanden |
| `fb-schicht-klaerung.webp` | WebP 920 × 230, Seite 1 ab Kicker „Mit dem Kunden zu klären“, ≤ 20 KB; der Rest der Schicht ist Papierweiß aus CSS | per Skript aus BL |
| `fb-schicht-fotos.webp` | WebP 920 × 230, Positionsseite 1 ab „Einbausituation aus den Fotos“, ≤ 20 KB; Grundfassung ohne Fotos, weil die Tourdaten keine Bilder enthalten (BL:501, :580) | per Skript aus BL |
| zwei Beispielfotos (optional) | JPEG 1600 × 1200: ein Fenster eines Einfamilienhauses, Baujahr 1978, einmal von innen, einmal von außen; frontal, Tageslicht, ohne Menschen, Text und Wasserzeichen; erscheinen nur klein im Beispiel-PDF | beim Inhaber anzufragen (Flux) |
| Dateizeichen, Kästchen, Pfeil | Inline-SVG 12 × 14, 14 × 14, 16 × 16, `currentColor` | neu, im Code |

**Leistung:** unter dem ersten Bildschirm, ohne Einfluss auf LCP; feste Maße (CLS 0); ≈ 90 KB Bild, ≈ 2 KB JS; drei Ebenen nur während der
Bewegung auf eigener Schicht; Schleife nur bei Bewegung im Bild. Risiken: veraltete Ausschnitte nach Änderungen an BL (Fingerabdruck fängt
das ab); das gedrehte Bild kann auf schwachen Geräten weich wirken (Abnahme am Telefon des Inhabers).

**Barrierefreiheit:** h2 als Anker; Blatt mit Alt-Text; Einzeiler und Karte als Text in Leserichtung; Beschriftungen, Linien, Raster und
Schichten `aria-hidden`, ihr Inhalt steht in der Liste; Umschalter mit `aria-expanded`/`aria-controls`; Ziele ≥ 44 px; Text ≥ 4,5 : 1,
Linien und Kästchen ≥ 3 : 1; keine Information nur in der Bewegung.

## I. Conversion-Begründung

- **Position:** 02 zeigt, was der Kunde tut, 03, was beim Betrieb ankommt; erst danach fragt 04 nach Preis und Marke (Kette S3 → S4, EA 4.4).
- **Gestaltung:** Der Beweis ist das echte Blatt aus dem Code, der die Anfragen erzeugt. Der Einzeiler macht den Unterschied als Bild
  sichtbar, ohne Behauptung über andere Anbieter. Die Karte verbindet die eigene Wahl aus 02 mit dem Ergebnis; das Kästchen zeigt, dass
  „Weiß ich noch nicht“ ein Klärungspunkt ist, kein Fehler (F-14 teilweise, ohne ein Sortiment zu versprechen).
- **Informationsmenge:** ≈ 30 Wörter bis zur Szene, ≈ 25 in ihr, ≈ 40 darunter; die sieben Sätze (≈ 120 Wörter) nur auf Wunsch. Heute sind
  ≈ 150 Wörter sichtbar (BD 3, Bildschirm 7).
- **Beitrag zur Zielhandlung:** Wer die Anfragen für brauchbar hält, bewertet die Pakete als Preis eines Werkzeugs, nicht eines Formulars.
  Das Textziel führt in Leserichtung zu den Paketen, ohne eine Cream-Fläche zu verbrauchen. Hypothese, nicht gemessen.
- **Zu testende Annahmen [H]:**
  - DG-H-5: Die Explosionsansicht macht „was ankommt“ schneller verständlich als eine Liste. Prüfweg: Lesetest „Was steht in jeder
    Anfrage?“ nach 20 Sekunden. Rückfall: stehendes Endbild.
  - Der Einzeiler wird als „so kommen Anfragen heute“ gelesen, nicht als Herabsetzung von Kunden. Prüfweg: Gespräche mit zwei bis drei
    Fensterbauern. Rückfall: Blatt allein.
  - Die Karte wird mit der Probe in 02 verbunden. Prüfweg: Frage „Woher kommt ‚Balkontür‘?“. Rückfall: ohne Karte.
  - Drei Beschriftungen genügen, obwohl die Tabelle nicht lesbar ist. Prüfweg: Telefon-Video. Rückfall: Blatt 330 px, Beschriftungen als
    Legende unter der Szene.
  - 1,22 BH verschieben die Pakete nicht über Bildschirm 5 bei 844 (EA H-D2). Prüfweg: Bildschirmzählung am Prototyp. Rückfall: Begriffe nur
    im Umschalter (−176 px).
- **Vorschlag, nicht Teil der Grundfassung:** ein Link „Ganzes Beispiel-PDF“, erzeugt mit TB, für Fensterbauer, die das Blatt lesen wollen;
  entscheidet der Inhaber (SKILL:26).

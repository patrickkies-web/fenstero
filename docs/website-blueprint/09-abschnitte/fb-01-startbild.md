# V1 Startbild

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 1 von 15, erster Bildschirm (`fb-01-startbild`) · Intensitätsstufe: 4 inszeniert, Typ T1 Bühne

Phase I des Website-Blueprints (MASTER-PROMPT V4), Stand 24.10.2026. Planungsdokument: Das Repository wurde nur gelesen. Kürzel wie in
[08-zielarchitektur.md](../08-zielarchitektur.md) (VK = `web/fuer-fensterbauer/index.html`; DG, EA, RE, EV, SG, DR, GEST, SKILL).
**[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I** = Entscheidung dieser Spezifikation mit Begründung. Lagen sind
geplant, nicht gemessen; **Textbreiten sind gemessen** (Inter-Datei des Projekts `web/fonts/inter-latin-wght-normal.woff2` in Chromium).
`10-paketentscheidung.md` liegt nicht vor; der Preis kommt allein aus `web/assets/pakete.js`.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name, Lage | V1 Startbild. Darüber nur der Kopf `rh-01` (56 px Telefon, 64 px Schreibtisch, flächenlos über Scrim, 08 8.2.2). Darunter V2 Leiste Elementarten (`fb-02`, im Anschnitt), danach 01 „Ihr Name“ `#die-idee` |
| Gewicht | 0,82 Bildschirmhöhen bei 844 px, Bildschirm 1 bei 664 px (08 8.3.2 a) |
| Ziel | Zuordnen (EA S1): Zielgruppe, Hauptaussage, Preisniveau und zwei Wege ohne Scrollen, auch bei 390 × 664 ([V] E-1) |
| Nutzerfrage | „Ist das für Betriebe wie meinen, worum geht es, was kostet es ungefähr?“ |
| Vorbereitete Entscheidung | direkt zu den Paketen (Cream → `#pakete`, Schnellweg W2; FB-2, FB-3) oder erst selbst ausprobieren (Ring → `#die-idee`, W1; FB-5, FB-1) |
| Nicht Aufgabe | erklären (01–03), vergleichen (04), absichern (06). Deshalb kein Lesetext |

## B. Konkreter Inhalt

### B.1 Bedienschicht (Z 30), 30 Wörter

| Element | Wortlaut | Herkunft |
|---|---|---|
| Kicker | „Für Fensterbauer und Fensterhändler“ | wörtlich VK:56 |
| h1 | „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“, „Marke“ grün (`<span class="ak">`) | wörtlich VK:57. Der Quelltext bleibt Zeichen für Zeichen gleich: Die Prüfsuite prüft ihn per Regex im HTML (`scripts/pruefen-instanzen/29.mjs:110`), also kein `<br>`, `<wbr>` oder Tag darin |
| drei Haken-Chips | „Ihre Domain“ · „Ihre Marke“ · „PDF per E-Mail“ | „Ihre Domain“ und „PDF per E-Mail“ wörtlich VK:58; „Ihre Marke“ **Textentwurf**, gekürzt aus VK:58. **Festlegung I:** 08 plant „Anfrage als PDF“; damit misst die Reihe 359 px bei 358 px Platz, mit dem Bestandswort 351 px. Rückfall: „Anfrage als PDF“ mit 8 px Innenabstand der Chips |
| Preiszeile | **Textentwurf** „Ab 29 € im Monat netto, plus Einrichtung · vorläufig“ | 29 € ist der kleinste Monatspreis (`web/assets/pakete.js:44`), serverseitig aus dieser Quelle gesetzt (neuer Baustein in `functions/pakete-seite.js`, damit Seite, JSON-LD und `llms.txt` eine Quelle behalten). „· vorläufig“ nur solange `VORLAEUFIG` (`pakete.js:17`). **Festlegung I:** 08 schreibt „… · vorläufige Preise“ (392 px, passt nicht in eine Zeile); gekürzt auf 336 px. Rückfall: zweizeilig, alle Lagen darunter + 17 px |
| Cream | „Pakete ansehen“ mit Pfeil im Kreis → `#pakete` | wörtlich VK:63 |
| Ring | **Textentwurf** „Selbst ausprobieren“ → `#die-idee` | E-AB-3 (I.4) |

Entfällt gegenüber heute: Kasten „Kurz gesagt“ (VK:59–62; der Pflichtsatz „… ohne ihn programmieren zu lassen“ steht in 01), Chip „Kunden
planen selbst“ (SKILL:24), Brotkrumen über dem Bild (wandern über den Fuß, 08 8.2.5), Ring „Konfigurator ausprobieren“ → `#demos`.

### B.2 Bildschicht (Z 0–25)

- **Foto** Astronaut am Bullauge, `web/bilder/foto/fb-sessel.webp` (1122 × 1402, 83 KB); am Telefon ein eigener Zuschnitt (C.3). `alt`
  wörtlich wie VK:55. Alles Übrige der Bildschicht ist `aria-hidden`.
- **Erdlicht** aus dem Bullauge und **Lichtkeil** (Lichtübertrag) Richtung Leiste.
- **Maßlinie** am Bullauge, Wert „1.200 mm“ (wie VK:55).
- **Meldungsstapel** mit Kennzeichnung „BEISPIEL“ (G7). **Textentwurf** nach dem Paketweg (KD, E-AB-4), gegliedert nach dem Format der
  echten Dashboard-Meldung (`functions/api/eingang.js:217`: Titel, darunter Positionen):
  1. „Neue Anfrage“ / „Familie Weber · 4 Positionen“
  2. „Aufmaßblatt als PDF“ / „im Postfach“
  3. „Klärungsliste“ / „2 Punkte offen“

  Ohne Zeitangaben: Die längste Zeile misst 176 px und füllt die Textspalte einer 220-px-Meldung (178 px). „Familie Weber“ ist die eine
  Beispielfamilie der Website (G7).

### B.3 Interaktionen

Zwei Links, sonst nichts Bedienbares; Foto, Stapel, Licht und Maßlinie haben `pointer-events: none`. Der Kopf-Ring „Pakete ansehen“
erscheint erst, wenn die Cream unter dem Kopf verschwunden ist (N4).

### B.4 Nutzbare vorhandene Komponenten

`.vk-hero` mit Foto, Stapel, Licht und Maßlinie (VK:54–64; `web/assets/verkauf.css:167–255`), `startbild()` und `bullauge()` mit `ERDE`
und `punkt()` (`web/assets/verkauf.js:152–262`), `Scroll.binden` (`web/assets/gemeinsam.js:297–324`), `.btn.primary` mit `.pf`,
`.btn.ghost`, `.chip.haken` (`web/assets/gemeinsam.css:57–76, :97`), Tokens (`gemeinsam.css:9–31`), `kopfCta()`
(`web/assets/portal.js:551`), Einbettung über `Verkauf.auf` (`verkauf.js:513`).

## C. Exakte Layoutkomposition

### C.1 Grundstruktur

Eine Bühne: `display: grid`, alle Bildebenen in einer Zelle, `isolation: isolate`. Asymmetrische Diagonale: Anker oben rechts (Bullauge mit
Erdlicht), Lesestapel unten links an der Ordnungslinie x = 16. Die Diagonale folgt der Lichtrichtung (Haus-Token `--licht-x: -0.6;
--licht-y: 0.8`, DG 2.2.0) und wird vom Lichtkeil nachgezeichnet. Vier Ebenen [V]: Grund mit Keil (Z 0) → Foto (Z 20) → Glas (Z 25) →
Bedienschicht (Z 30); dazu Scrim (Z 28) und Kopf (Z 40). Verdeckungen: Kicker und h1 im Fotoauslauf, Glas über der Stationsdecke, die Leiste
schneidet unten an.

### C.2 Telefon 390 × 844 (4 Spalten, Rand 16, Rinne 16, Spalte 77,5 px)

| Z | Element | x | y | Maß, Regel |
|---|---|---|---|---|
| 0 | Grund `#161616` | 0–390 | 0–690 | – |
| 0 | Lichtkeil | Ursprung Mitte Ausblick, Ende Mitte Leiste (195 / ≈ 762) | sichtbar ab ≈ 330 bis 72 px in V2 | Breite 120 → 200 px, `--el` (#7aa2ff) 12 % → 6 %, Ränder weich |
| 20 | Foto | 0–390 | 0–420 | 50 % der Höhe bei 844, 63 % bei 664; ab y 315 (75 %) linear in den Grund; Kopfzone dunkel (DG-E-11) |
| 20 | Erdlicht | Zentrum Ausblick | – | radial, Radius 1,5 × Bullauge, `--el` 16 % → 0, `mix-blend-mode: screen`, steht still |
| 20 | Maßlinie | rechter Rand des Ausblicks | Ober- bis Unterkante der Öffnung | 1,5 px `--mo`, Endstriche 18 px, Wert mittig, −90° |
| 25 | „BEISPIEL“ | 18 | 72–88 | 13 px, 600, Versalien, Sperrung 0,12 em, `--text2` |
| 25 | Glas-Stapel | 16–236 | vorn 94–158, Kanten bis ≈ 177 | Meldung 220 × 64, Radius 18; Spalte 1 bis Mitte 3 |
| 28 | Scrim | 0–390 | 0–96 | `#161616` 60 % → 0 |
| 30 | Kicker | 16–358 | 320–336 | 13 px, 600, Versalien 0,12 em, `--accent`; eine Zeile (342 px) |
| 30 | h1 | 16–374 | 344–445 | 32 px, 800, Zeilenhöhe 1,05, −0,03 em, `text-wrap: balance`; drei Zeilen wie heute: „Ihr eigener Fenster-“ / „Konfigurator,“ / „unter Ihrer Marke“ |
| 30 | Chips | 16–367 | 461–497 | 36 px, 13 px 700, Innenabstand 10, Haken 6 × 10, Abstand 6; flach `#262626` ohne Rand (kein Bild darunter) |
| 30 | Preiszeile | 16–352 | 509–526 | 13 px 600, 0,02 em, `tabular-nums`; „Ab 29 € im Monat“ in `--text`, Rest `--muted` |
| 30 | Cream | 16–228 | 541–593 | 52 px, 17 px 700, mindestens 212 px breit |
| 30 | Ring | 16–228 | 605–657 | 52 px, Rand 2 px `--muted` (≈ 5,9 : 1, DG-E-10), gleich breit |
| – | Leiste V2 | 0–390 | 690–834 | Anschnitt 17 % (DG 2.3.17/2: 8–25 %) |
| 40 | Kopf | 0–390 | 0–56 | Logo links, Menü rechts; Ring verborgen |

**Verhältnisse.** Foto 50 % der Fläche; Figur samt Bullauge ≈ 210 × 300 px = 19 % bei 844, 24 % bei 664 (SG 10.1: 15–35 %; DG T1 nennt
25–35 %, am Zuschnitt prüfen); Textfläche (Begrenzungsrahmen) ≈ 12 % (≤ 15 %); Cream 3,4 % (Akzent ≤ 5 %); frei ≈ 35–40 % mit den ruhigen
Bildzonen (≥ 33 %, Schätzung, am Bildschirmfoto prüfen). Abstände 8 · 16 · 12 · 15 · 12 · 33 px (4-px-Raster, Gruppe : Zone ≈ 1 : 4).
Bei 664 stehen Preiszeile, Cream und Ring ganz im Bild (besser als „knapp“ in 08); die Leiste nicht, das Fortsetzungssignal trägt dort der
Lichtkeil über der Unterkante. **Größenhierarchie** [V]: Figur ≈ 300 px hoch → h1 32 → Klein-UI 13–17; drei Stufen (32 · 17 · 13; der
Meldungstitel 15 gehört zur Klein-Stufe, 15/13 = 1,15). Sprung Hauptelement zu Bedienschrift ≫ 3 (SG 10.1/4).

### C.3 Telefonzuschnitt des Fotos (Voraussetzung)

Mit dem heutigen Foto überdeckt jeder 220-px-Stapel Gesicht, Handy oder Papierflieger (nachgerechnet bei 390 × 420; EV X6, SKILL:87).
Gebraucht wird ein eigener Zuschnitt. Anforderungen in Koordinaten des Bildfelds 390 × 420 (darüber 52 px Kopfraum für die Einbettung, F.5):

- y 0–56 und der Kopfraum: dunkle, ruhige Decke mit leiser Struktur (Leuchtdichte ≤ 15 %; in der Einbettung liegt der Glas-Umschalter darauf).
- **Stapelzone x 0–252, y 60–190:** Stationsinnenraum mit leiser Struktur (Leitungen, Paneele), mittlere Leuchtdichte 10–25 %, kein Lichter
  über 50 %, keine Figur- oder Schwebeteile. Glas braucht sichtbaren Bildinhalt darunter (SG 10.3/6), Text darauf 4,5 : 1.
- **Anker:** Bullauge mit Erde, Mitte x ≈ 345, y ≈ 155, sichtbarer Durchmesser 160–180 px, vom rechten Rand um etwa ein Fünftel
  angeschnitten; das Erdblau ist die einzige gesättigte Fläche; Ausblick ≥ 60 px breit sichtbar (Maßlinie).
- **Figur:** Gesicht x ≈ 220–295, y ≈ 200–270, Blick nach rechts oben zum Bullauge; Hände mit gelbem Zollstock am Bullaugenrand
  (x ≈ 270–340, y ≈ 110–250).
- **Schwebendes:** Papierflieger, Handy, Bleistift links der Figur, x 30–190, y 200–300, nie in der Stapelzone, nie unter dem Kicker.
- **Auslauf y 315–420:** dunkel und detailarm (Sitz, Boden), damit Kicker und h1 ohne Textschatten 4,5 : 1 halten.

**Platzhalter bis dahin** (SKILL 5): heutiges Foto, `object-position: 74% 0%`, Stapel wie geplant; die Verdeckung von Handy und Hinterkopf
ist bekannt. Nur für Vorschau und Telefon-Video, nicht für `main`.

### C.4 Schreibtisch 1280 × 800 (12 Spalten in 1040 px, x 120–1160, Rinne 32)

| Element | x | y | Regel |
|---|---|---|---|
| Foto (vorhandenes `fb-sessel.webp`) | 553 (Mitte Rinne 5/6) bis 1280, randlos | 0–760 | Zoom 1,1 (Bildbreite 800 px), rechts und oben verankert; Maske links 0 → 100 % über 40 % der Breite, unten ab 74 % aus; Bullauge x ≈ 1136–1280 |
| Stapel | ≈ 900–1120 (Spalten 10–12) | „BEISPIEL“ 76–92, vorn 98–162 | über der Stationsdecke rechts vom Papierflieger, über dem Kopf der Figur; Bildzone `STAPEL = {x0: 589, y0: 107, x1: 898, y1: 254}` im Original |
| Kicker | 120 | 241–257 | Textblock senkrecht mittig zwischen Kopf und Leiste |
| h1 40 px | 120–703 | 269–353 | zwei Zeilen „Ihr eigener Fenster-“ / „Konfigurator, unter Ihrer Marke“ (`max-width: 640px`, `balance`); die zweite Zeile liegt über der dunklen Wand im Fotoauslauf, 60 px links vom Handy |
| Chips | 120–471 | 377–413 | eine Zeile |
| Preiszeile | 120–456 | 429–446 | eine Zeile |
| Cream · Ring | 120–332 · 344–556 | 470–522 | nebeneinander, Abstand 12 |
| Leiste V2 | 0–1280 | ab ≈ 700 | Anschnitt 12,5 %; schiebt sich über den ausgeblendeten Fotofuß (DG 2.3.17/4) |

Text 5 Spalten : Bild 7 Spalten plus Randanschnitt (≈ 43 : 57); Textfläche ≈ 11 %, Foto ≈ 54 %, frei ≈ 40 %. Nichts überdimensioniert:
h1 40 px, Knöpfe 52 px wie am Telefon (SKILL:28).

### C.5 Technische Startwerte

| Wert | Start | Begründung |
|---|---|---|
| Glas | `rgba(31,31,31,.60)`, `backdrop-filter: blur(24px) saturate(100%)`, Radius 18, oben 1 px Weiß 10 %, rechts 1 px `--el` 24 %, kein Schatten | DG T1; DG-AB-17 (Sättigung), DG-AB-1 (Lichtkante statt `--float`); rechte Kante zeigt zur Quelle (DR Baustein 1) |
| hintere Meldungen | `translateY(10px) scale(.94)` Deckkraft .85; `translateY(19px) scale(.88)` .6; Füllung `rgba(31,31,31,.80)` ohne Weichzeichner, Text ausgeblendet | Bestand `verkauf.css:210–211`; nur die vordere mit Live-Unschärfe (≤ 2 Glasflächen am Telefon, SG 10.8) |
| Meldung | Innenabstand 10/12, Punkt 8 px `--ok` mit 4-px-Ring `--ok-soft`, ohne Schein; Titel 15/800 `--text`, Zeile 13/500 `--text2` | Bestand ohne Leuchten (DR 5) |
| Maßwert | Pille 13/600 `tabular-nums`, `rgba(22,22,22,.62)`, Weichzeichner 12 px, Ring 1 px `--mo` 50 % | Bestand `verkauf.css:232`; zweite Glasfläche |
| Foto-Tiefe | Faktor 0,88, höchstens 32 px | DG-AB-15; Spanne SG 0,8–1,0 |
| Fokus | `outline: 2px solid var(--text)`, Abstand 3 px | 3 : 1 auf Grund und neben Cream (SG 10.7/8) |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung in V1 | Intensität 0–4 | Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | vier Ebenen, Verdeckung (Text im Fotoauslauf, Glas über Decke, Leiste über Fotofuß); Bildgruppe 0,88 gegen Bedienschicht 1,0 | 3 | Raum ohne Schatten (DNA Nr. 2, 6) |
| Material, Transparenz | Material nur im Foto (Anzug, Metall, Erde); Glas als einzige vermittelnde Schicht; Bedienschicht matt und flach | 2 | Ein Materialträger (SG 10.3/5) |
| Licht, Schatten | Quelle im Bild: Erdlicht; eine Lichtfarbe (Blau), eine Richtung (oben rechts → unten links), ein Helligkeitszentrum am Anker; keine Schatten, kein Textschatten (heute `verkauf.css:178`) | 3 | Licht führt den Blick zum Anker und weiter zur Leiste |
| Formen | Pillen für Chips und Knöpfe, Radius 18 für Glas; Organik nur in der Figur | 2 | geschlossenes Formsystem (Nr. 5) |
| 3-D-Objekte | keine; Foto statt Echtzeit-3-D, 2,5-D bewusst nicht (EV 7.5.5) | 0 | Ladebudget |
| Bildintegration | randlos, unteres Viertel in den Grund, Text im Auslauf | 3 | „Ein Raum“ (Nr. 4) |
| Oberflächendetails | Maßlinie mit Endstrichen (informierende Signature), Technikstimme, Haken | 2 | Präzision wie ein Aufmaß (DR 1) |
| Animation | Ladeauftritt nacheinander, endet nach 4,1 s | 3 | zeigt den Nutzen als Szene |
| Typografie | Bühnenstimme (h1 800) und Technikstimme (13/600); ein grünes Wort | 2 | zwei Stimmen (DR 3.2) |
| Überlagerungen | Glas über Bild; Lichtkeil über die Abschnittskante (der eine Rahmenbruch der Seite, DG-E-4 A) | 3 | Übergang zu V2 |
| Perspektive | nur im Foto; Bedienschicht frontal | 1 | Nr. 1 |
| Interaktive Effekte | nur Zustände über Kontur, Füllung, Deckkraft | 1 | G1 |

**Signature-Budget** [V]: inszenierend 2 am selben Fokusträger (Glas, Lichtübertrag), informierend 1 (Maßlinie); Stufe 4 ausgeschöpft.
**Bewusst weggelassen:** Staub (nur als Variante anstelle des Keils), atmendes Licht (`vk-atmen`), Meldungen in Schleife, WebGL und
Tiefenkarte, „Kurz gesagt“, vierter Chip, Lesefortschritt, Riesenwort, Messraster, Flug des Telefons, Kennzahlen-Leiste, Schatten.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Primärer Fokus:** Erdlicht im Bullauge, einziger gesättigter Reiz und Helligkeitszentrum des Bildes, oben rechts.
2. **Sekundär:** die erste Meldung bei 0,9 s neben dem Anker (Bewegungsbeginn), dann das Gesicht, das zum Bullauge blickt.
3. **Leseeinstieg:** h1, größte Schrift, höchster Kontrast; der Kicker darüber ordnet zu.
4. Chips → Preiszeile → **Cream** als zweiter Pol auf der Diagonale (größter Hellwert der Bedienschicht, ohne Farbreiz, DG G3); Ring als
   Kontur darunter, klar nachrangig.
5. Lichtkeil und Leistenanschnitt ziehen den Blick nach unten in V2.

Kontraste: Erdblau gegen Dunkel; Cream gegen `#161616`; Grün nur im Kicker, in „Marke“ und an den Haken. **Mögliche Ablenkungen:** der
Text der Meldungen (nur die vordere lesbar, Bewegung endet bei 2,9 s), die zählende Maßzahl (endet bei 4,1 s), der Kopf (Ring verborgen,
solange die Cream sichtbar ist). Im Blinzeltest sollen zwei Flecken bleiben, Erde und Cream, wobei nur die Erde Farbe trägt (DG-H-12).

## F. Interaktions- und Bewegungsverhalten

### F.1 Ladeauftritt (nur Bildschicht; die Bedienschicht steht ab dem ersten Bild) [V] E-2

| Zeit | Träger | Bewegung | Dauer, Kurve |
|---|---|---|---|
| 0–0,9 s | Foto | Deckkraft 0,2 → 1 (nicht ab 0, damit das LCP sofort zählt; prüfen), Zoom 1,04 → 1 am `img` | 900 ms, `--e-out` (großer Motiv-Auftritt) |
| 0,15–0,9 s | Erdlicht, Keil | Deckkraft 0 → 1 | folgt dem Foto (Nebenbewegung) |
| 0,9 / 1,6 / 2,3 s | Meldung 1, 2, 3 | fällt von −16 px, Zoom 1,02 → 1, Deckkraft 0 → 1; die vordere rückt nach hinten (Text 220 ms aus); blaue Kante 50 ms später | je 600 ms, `--e-out` hinein, `--e-io` nach hinten; kein Abprallen |
| 0,9 s | „BEISPIEL“ | Deckkraft | 320 ms |
| 2,9–4,1 s | Maßlinie | zeichnet sich von oben (`scaleY` 0 → 1), Wert zählt 0 → 1.200 mit, Wertpille blendet in den ersten 400 ms ein | 1.200 ms, `1 − (1 − t)³` wie Bestand |
| ab 4,1 s | – | Stand, keine Schleife | autonome Bewegung < 5 s (WCAG 2.2.2, DG-AB-5) |

Immer nur ein Träger zugleich. Start erst nach `img.decode()` und nur, wenn V1 beim Laden im Bild ist; wer per Anker (`#pakete`) oder mitten
in der Seite einsteigt, sieht den Endzustand. **Erste Nutzereingabe** (Scrollen > 4 px, Wischen, Rad, Taste): Laufendes und Ausstehendes
geht in 220 ms per Deckkraft in den Endzustand. Präzisierung von E-2 („springt“), damit nichts ruckt (SKILL:48).

### F.2 Scrollen

- **Foto-Tiefe:** Die Bildgruppe (Foto, Erdlicht, Maßlinie, **auch der Stapel**) folgt mit 0,88; die Bedienschicht mit 1,0. Versatz =
  0,12 × Scrollweg, höchstens 32 px, `translate3d`, direkt am Scrollwert ohne Glättung. **Festlegung I:** DG T1 lässt das Glas mit 1,0
  laufen; am Telefon wäre das Glas über bewegtem Motiv (SG 10.8, Mobil). In der Gruppe ändert sich unter dem Glas nichts, und Text und Bild
  trennen sich trotzdem in der Tiefe. Gilt an allen Breiten (ein Code-Weg).
- **Ende der Tiefe:** sobald die Oberkante der Leiste die Bildschirmmitte erreicht (844: nach 268 px; 664: nach 358 px), über die letzten
  48 px weich auslaufend; danach bewegt sich nur die Leiste (Übergabe an V2, EV 7.5.3).
- Kein Anheften, natives Scrollen, keine Scrollsteuerung.

### F.3 Hover, Klick, Fokus (Bedienschicht: nur Zustände) [V] G1

- **Hover** nur mit `@media (hover: hover)`, 150 ms: Cream bekommt eine 2-px-Kontur `--text` im Abstand 2 px (DG 2.4.1: Hover = Kontur,
  statt heute Weiß `--primary-hover`); Ring: Rand `--muted` → `--text`. Der Pfeil wandert nicht.
- **Gedrückt:** Füllung (Cream Deckkraft .88, Ring Füllung `--surface2`), keine Skalierung.
- **Fokus:** C.5, sofort; nie unter dem Kopf (`scroll-padding-top: 72px`).
- **Klick:** Ankersprung zu `#pakete` bzw. `#die-idee`; `scroll-behavior: smooth` nur ohne „weniger Bewegung“. Fokusstart wandert ans Ziel.
- **Kopf-Ring:** Deckkraft 0 → 1 in 220 ms, aus in 165 ms; im verborgenen Zustand `visibility: hidden` (nicht fokussierbar).

### F.4 Ruhige Fassungen

- **Weniger Bewegung:** Endbild sofort: drei Meldungen (Meldung 3 vorn), Maßlinie fertig mit „1.200 mm“, Licht und Keil stehen, keine
  Foto-Tiefe, kein Zoom. Deckkraftwechsel des Kopf-Rings bleiben.
- **Ohne JavaScript:** dieselbe Endfassung aus dem HTML (die Reihenfolge im HTML ist der Endzustand); Maßlinie entfällt (braucht die
  Lagerechnung), Stapel an der CSS-Ersatzlage.
- **Reduzierte Transparenz, mehr Kontrast, ohne `backdrop-filter`:** Glas `rgba(31,31,31,.95)` bzw. `.80` ohne Weichzeichner.

### F.5 Einbettung `/#fensterbauer`

- Telefon: Der Glas-Umschalter 260 × 44 (x 16–276, y 68–112, `st-02`) liegt über dem Foto. **Festlegung I:** Das Bildfeld wächst dafür um
  52 px nach oben und zeigt den Kopfraum des Zuschnitts; alles darunter rückt um 52 px (Stapel 124–229, Preiszeile 561–578, Cream 593–645,
  Ring 657–709). E-1 hält bei 664. Grund: Die Komposition von Figur und Stapel bleibt identisch, statt den Stapel in die Figur zu schieben.
- Glasflächen dort: Umschalter und vordere Meldung = 2; die Maßwertpille verliert den Weichzeichner (Füllung .85).
- `?von=pdf`: Der Hinweis `st-03` ersetzt den Stapel an seinem Ort (eigene Spezifikation).
- Neuaufbau (`Verkauf.auf` mit `still`): kein zweiter Ladeauftritt; Zustand je Wurzel, Merker in `sessionStorage` mit `try/catch`;
  Bindungen idempotent (`fig.__vkAn` wie heute).

## G. Responsive Design

### G.1 Telefon (zuerst)

- **390 × 844 und 390 × 664:** C.2. Bis 760 px Breite gilt diese Komposition, das Bildfeld wächst nur in der Breite.
- **360 px:** Kicker mit Sperrung 0,08 em (passt in 328 px), Chips und Preiszeile dürfen umbrechen; dafür Bildfeld 380 px hoch, damit die
  Cream bei 360 × 640 im Bild bleibt (Prüfpunkt).
- **320 px, 200 % Text:** alles bricht um, kein Querscrollen, Stapel 200 px breit, Meldungszeilen mit Auslassungspunkten.

### G.2 Schreibtisch 1280 (≥ 1200 px)

C.4. Split 5 : 7, h1 40 px zweizeilig bis 640 px Breite; Cream und Ring nebeneinander; Kopf-Ring wie am Telefon.

### G.3 1024 (761–1199 px)

Bildfeld ab 44 % der Breite (GEST:447), bei 1024 x 450–1024, y 0–720, Zoom 1,25 rechts und oben verankert. h1 bleibt in der Textspalte
(x 32–418, drei Zeilen), weil eine breitere zweite Zeile hier das Handy im Foto träfe. Stapel 220 px bei x ≈ 670–890, „BEISPIEL“ ab
y 72, vorn 88–152 (Haaransatz bei ≈ 182). Knöpfe nebeneinander, der Ring endet über dem ausgeblendeten Fotorand.

## H. Technische Umsetzung

### H.1 Bestehendes, das umgebaut wird

| Datei | Änderung |
|---|---|
| VK:53–64 | Brotkrumen oben raus; `<picture>` mit Telefonquelle (`media="(max-width: 760px)"`); drei Chips als `<ul>`; Preiszeile `<p class="vk-preiszeile">` aus dem Baustein; Ring `#die-idee`; „Kurz gesagt“ raus; drei Meldungen in Endreihenfolge |
| `verkauf.css:167–255` | Lagen nach C; Glaswerte nach C.5; `saturate(100%)`; Schatten unter Meldungen und h1-Textschatten raus; `.vk-staub` und `vk-atmen` raus; neue `.vk-keil` |
| `verkauf.js:152–262` | `startbild()`: einmalige Folge statt `setInterval(…, 3400)`; Abbruch auf erste Eingabe; `bullauge()`: `ERDE_TEL` für den Zuschnitt, Zeichnen bei 2,9 s statt 1,7 s, ohne Staub; Stapel-Lage aus `STAPEL` über `punkt()`; Foto-Tiefe nach F.2; Keilwinkel aus Bullauge und Leistenmitte |
| `functions/pakete-seite.js` | Baustein `ab-preis` aus `pakete.js` (kleinster Monatspreis, Zusatz bei `VORLAEUFIG`); danach `node scripts/bedingungen-pdf.mjs` (SKILL 8) |
| `web/assets/portal.js:551` | `kopfCta()` richtet sich nach der Cream des Startbilds (N4), auch in der Einbettung |

### H.2 Neu

- `.vk-keil` (Z 0, `aria-hidden`): Element mit linearem Verlauf `--el` 12 % → 6 % längs und weichen Rändern quer (`mask-image`), um den
  berechneten Winkel gedreht (Telefon ≈ 14° gegen die Senkrechte), ragt 72 px unten aus V1 (`overflow: visible`); V2 schneidet nicht ab.
  Zeigt der Verlauf Streifen: als WebP mit eingebackenem Dithering (± 1–2 Tonwerte, ≤ 8 KB).
- Kennzeichnung „BEISPIEL“ als eigenes Element über dem Stapel.

### H.3 Assets

| Asset | Art, Maß | Freistellung | Quelle |
|---|---|---|---|
| `fb-sessel-telefon.webp` | Foto 780 × 944 px (2×: 390 × 420 Bildfeld + 52 px Kopfraum), WebP, ≤ 140 KB | keine, deckend | **beim Inhaber anzufragen** (Flux, aus `fb-sessel` erweitert); Vorgaben C.3; ohne Text, Wasserzeichen, Logos; Licht wie im Original: kühles Erdlicht von rechts oben, warmes Filmlicht im Gesicht |
| `fb-sessel.webp` | 1122 × 1402, 83 KB | – | vorhanden, Schreibtisch |
| Keil | CSS, notfalls WebP ≤ 8 KB | Alpha | selbst |

Umrechnung der Lagen aus C.3 in Bildpixel: x · 2, y · 2 + 104 (Kopfraum oben).

### H.4 Animationstechnik

CSS-Übergänge auf `transform` und `opacity`, ausgelöst über Klassen aus `verkauf.js` (Zeitgeber ab `decode()`); Maßlinie per
`requestAnimationFrame` wie heute (`scaleY` und `textContent`, nur Bildschicht, DG-AB-3); Foto-Tiefe über `Scroll.binden` bzw. einen
passiven Scroll-Hörer mit `translate3d`, `will-change` nur solange V1 im Bild ist. Keine Bibliothek, keine fremden Server (SKILL:60).

### H.5 Leistung

Bilder im ersten Telefon-Bildschirm ≤ 300 KB (Zuschnitt ≤ 140 KB; den Rest teilt sich V2), bis LCP ≤ 350 KB, JavaScript im ersten
Bildschirm ≤ 100 KB (SG 10.8); Foto per `<link rel="preload" as="image" … fetchpriority="high">` je `media`. Feste Bildhöhe gegen CLS.
Eine Live-Unschärfe auf 220 × 64 px, Radius nie animiert. Risiko Einbettung: `portal.js` lädt heute ≈ 547 KB Skript synchron (TD 1.4),
das LCP auf `/` hängt daran, nicht an V1. Flüssigkeit entscheidet der Test am Telefon des Inhabers (SKILL 8).

### H.6 Barrierefreiheit

Ein h1; Kicker als `<p>`; DOM-Folge Kicker, h1, Chips, Preiszeile, Cream, Ring. Foto mit `alt`, alles Übrige der Bildschicht
`aria-hidden`. Kontraste: Text auf Glas ≥ 4,5 : 1 gegen die hellste Stelle der Stapelzone; `--muted` auf dem Keil ≥ 4,8 : 1 (an der
Preiszeile ≤ 9 % Blau); Ring-Rand und Fokus ≥ 3 : 1. Ziele 52 px. Reflow bis 320 px, 200 % Text. Unter `forced-colors` behalten Knöpfe
eine Systemkontur. Keine automatische Bewegung über 5 s, daher kein Pausenknopf.

## I. Conversion-Begründung

### I.1 Warum an dieser Position, warum so wenig

V1 ist der einzige Bildschirm, den jeder Besucher sieht (EV 7.4 Nr. 8). Er beantwortet die drei Fragen von S1 und öffnet zwei klar
gewichtete Wege. 30 Wörter plus eine lesbare Meldung bleiben unter 40 (SG 10.1); Erklärung folgt in 01 bis 03 (SKILL:29–30).

### I.2 Wie die Gestaltung trägt

Das Foto zeigt Anspruch ohne Behauptung (SKILL:38); die Meldungen zeigen den Nutzen als Szene, als Beispiel gekennzeichnet (SKILL:49); die
Preiszeile nimmt die Preisfrage vorweg (RE R12, T1), „netto“ und „vorläufig“ sichtbar. Cream führt Kaufbereite in einem Tipp zu den Paketen
(FB-2, FB-3), der Ring Unsichere ins Produkt (Leitidee E); der Kopf-Ring hält den Schnellweg danach offen.

### I.3 Zu testende Annahmen [H]

| Nr. | Annahme | Prüfweg | Rückfall |
|---|---|---|---|
| T1 | Das Preissignal im ersten Bildschirm erhöht den Anteil, der `#pakete` erreicht und anfragt | vorher/nachher; Erfassung fehlt (EA O-2), nur eigene Statistik | Preiszeile unter die Knöpfe |
| H-E7 | 420 px Foto tragen die Wirkung bei 844 und 664 | Telefon-Video, Urteil des Inhabers | 480 px, Preiszeile über den Chips |
| DG-H-12 | Die Cream konkurriert nicht mit dem Anker | Blinzeltest bei 390 × 844 | Erdlicht bis 20 % (DR 3.1), Cream unverändert |
| H-E5 | Der Lichtkeil wirkt als Markenfaden | Telefon-Video | Keil entfällt, Licht nur im Foto |
| I-H-1 | Die Meldungen werden als „Anfragen kommen bei mir an“ gelesen, nicht als Plattform | 5-Sekunden-Lesetest mit Fensterbauern | zwei Meldungen statt drei |
| I-H-2 | „Selbst ausprobieren“ → `#die-idee` wird verstanden und nicht als App-Start erwartet | Gespräche, Klickziel | „Kundensicht ansehen“ → 02 (E-AB-3) |
| DG-H-4 | Lichtkante statt Schatten lässt das Glas genug schweben | zwei Fassungen im Video | Lichtkante 1,5-fach |

### I.4 Freigaben

Jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Name, Wortmarke und Logo bleiben.

| Nr. | bestehende Regel | hier | Begründung |
|---|---|---|---|
| E-AB-1 | Startfoto Telefon 540–640 px (GEST:447) | 420 px, eigener Zuschnitt | E-1 bei 664 px |
| E-AB-3 | Ring „Konfigurator ausprobieren“ → `#demos` (GEST:447) | „Selbst ausprobieren“ → `#die-idee` | kein Irrweg in Paywall und App (PAK B7) |
| E-AB-4, DG-AB-5 | Meldungen „Neue Anfrage → Projekt angelegt → Bereit fürs Angebot“ alle 3,4 s (GEST:447) | Paketweg, einmal, Ende nach 2,9 s | SKILL:25; WCAG 2.2.2 |
| E-AB-5 | „Kurz gesagt“ und vier Chips (GEST:447) | drei Chips, kein Kasten | Platz bei 664; SKILL:24 |
| I-AB-1 (neu) | Zeile „Während Sie unterwegs sind · Beispiel“ ab 1200 px, Zeitangaben in den Meldungen (GEST:447) | nur „BEISPIEL“, ohne Zeiten | gemessene Breite; die lange Zeile läge am Schreibtisch über dem Bullauge |
| I-AB-2 (neu) | Kicker gesperrt 0,18 em (GEST:26) | 0,12 em | DR 3.2; passt einzeilig in 358 px |
| DG-AB-1, -15, -17 | `--float` unter Glas; keine Parallaxe; Sättigung 140 % (GEST:32, :41; DR 3.1) | Lichtkante; Tiefe 0,88 der Bildgruppe; 100 % | DG 2.5.3 |

Weitere offene Punkte: 13 px für die Preiszeile oder 15 px (DG-E-6); Nettopreise im ersten Bildschirm der Einbettung auf `/` rechtlich
klären (EA O-25); Telefonzuschnitt anfragen (H.3).

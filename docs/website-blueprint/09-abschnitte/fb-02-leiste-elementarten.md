# V2 Leiste Elementarten

Seite: `/fuer-fensterbauer/`, eingebettet auch in `/#fensterbauer` · Position: 2 von 15 (nach V1 Startbild, vor 01 Ihr Name) · Intensitätsstufe: 3 (gestaltet), Typ T2 Leiste

ID `fb-02-leiste-elementarten` · Phase I · Stand 24.10.2026 · Planungsdokument, nichts gebaut. Kürzel und Kennzeichnungen wie in
[08-zielarchitektur.md](../08-zielarchitektur.md): **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung V2-n** =
Entscheidung dieser Spezifikation, wo 08 offen ist oder sich widerspricht. VK = `web/fuer-fensterbauer/index.html`.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Leiste Elementarten (V2); ohne Anker, Kapitelnummer und Überschrift |
| Position | zwischen V1 Startbild und 01 Ihr Name. Telefon 390 × 844: y 690–834, bei Ankunft ganz sichtbar (17 % der Höhe); bei 664 px Höhe erst ab Scrollstand 26. Schreibtisch 1280 × 800: y 704–880, 96 px angeschnitten (12 %) |
| Ziel | die Breite des Konfigurators ohne Lesen zeigen (EA S1 → S3); zugleich Fortsetzungssignal des ersten Bildschirms und Endpunkt des Lichtübertrags aus V1 (DG-E-4 A) |
| Nutzerfrage | „Kann der Konfigurator, was meine Kunden brauchen?“ (F-14, teilweise) |
| vorbereitete Entscheidung | „Das Sortiment passt grundsätzlich“ – weiterlesen in 01 statt abspringen |
| Grenze [V] | Die Leiste zeigt, was der Konfigurator erfasst, kein Sortiment je Betrieb (nicht gebaut, BAUPLAN:717; EA F-14). Haustür und Dachfenster gibt es nicht (`docs/SEO.md:47`); sie erscheinen nicht |

## B. Konkreter Inhalt

**Einträge.** Grundfassung sind die 14 Namen der heutigen Leiste, wörtlich und in dieser Reihenfolge (VK:66); jede Art ist in der App
belegt. Die Folge läuft vom Alltäglichen zum Besonderen; beim Laden steht Nr. 1 unter dem Kegel (**Festlegung V2-1**). Die Renderings
zeigen das echte Produkt, keine erfundenen Daten; ein Hinweis „Beispiel“ entfällt.

| Nr. | Name (VK:66) | Beleg | Vorlage für Kamera und Licht (`marketing/highlights/aufnahmen/`) |
|---|---|---|---|
| 1 | Dreh-Kipp-Fenster | GEST:70 | `h12-kipp.png` |
| 2 | Zweiflügelig | GEST:153 | `h12-stulp.png` |
| 3 | Balkontür | GEST:70 | `h11-balkon.png` |
| 4 | Hebe-Schiebe-Tür | GEST:70 | `h11-hst.png` |
| 5 | PSK-Tür | GEST:70 | `h11-psk.png` |
| 6 | Faltschiebewand | GEST:70 | `h11-fsw.png` |
| 7 | Festverglasung | GEST:70 | `h11-fest.png` |
| 8 | Rundbogen | `web/assets/app.js:302` | `h12-rundbogen.png` |
| 9 | Oberlicht | GEST:97 | `h12-oberlicht.png` |
| 10 | Rollladen | `README.md:3` | `h13-sonne-aussen.png` |
| 11 | Raffstore | `README.md:3` | `h13-sonne-aussen.png` |
| 12 | Insektenschutz | GEST:129 | `h13-insekt.png` |
| 13 | Wiener Sprossen | GEST:129 | `h13-sprossen.png` |
| 14 | Schräge Fenster | `web/assets/app.js:302` | `h12-schraeg.png` |

Welche Liste endgültig gilt, ist offen (PA-Frage 29): `README.md:3` nennt zusätzlich Screen, Rollo, Plissee und Jalousie,
`web/assets/portal.js:783` eine Liste mit zehn Einträgen. Die Mechanik trägt 12 bis 20 Einträge (weniger: R4 in H).

**Überschriften und Botschaften.** Keine; die Botschaft „kann vieles“ trägt die Menge der Bilder. Sichtbar ist nur der Name unter dem
Kegel. Der zugängliche Name der Region bleibt „Elemente und Ausstattung im Konfigurator“ (VK:66). Kein Textentwurf nötig.

**Interaktionen.** Scrollkopplung mit Trägheit, Wischen, Tippen, Pfeiltasten (F). Keine Navigation, kein Link, keine Handlung (08).

**Vorhandene Komponenten.** `web/assets/verkauf.js:256–331` (`leisten`: Satz klonen, Klone `aria-hidden`, IntersectionObserver,
Schleife nur im Bild, Messung nach `resize` und `document.fonts.ready`, Idempotenz `__vkAn`, Filter `document.body.contains` für die
Einbettung), `ruhig()` (:15), `beobachten()` (:110), `Verkauf.auf` (:515); `web/assets/verkauf.css:260–312` und `:527–542`
(Haarlinien, Randmaske, Lichtschlitz, Kegel, Wölbung); die Zeichnungen in VK:66 als Rückfall R2. **Entfällt:** Leiste B (VK:69–71,
`.vk-leiste-b`), Grundlauf 30 px/s, Verlangsamung bei Hover, Wiegen (`vk-wiegen`), Trennpunkte, Drehung der Namen.

## C. Exakte Layoutkomposition

**Grundstruktur.** Ein randloses Band über die volle Fensterbreite, außerhalb der Spalte: eine waagerechte Reihe freigestellter
Renderings, das mittlere 1,25-fach und scharf unter einem Lichtkegel, darunter ein einziger feststehender Namensplatz. Symmetrisch um die
senkrechte Bildschirmachse; zulässig, weil das Motiv mittig steht (G5). Die Ordnungslinie x = 16 bleibt unberührt, weil das Band keinen
Lesetext trägt. **Rasterbezug:** Telefon 4 Spalten in 358 px (Rinne 16): Mittelkachel x 150–240 symmetrisch über der Fuge zwischen Spalte
2 und 3. Zwischengröße (640–1023 px, K-11) 8 Spalten, Rinne 16, Rand 24: bei 768 Mittelkachel x 339–429 über der Fuge zwischen
Spalte 4 und 5. Schreibtisch breit (ab 1104 px) 12 Spalten in 1040 px (bei 1280 x 120–1160): Mittelkachel x 580–700 über der Fuge
zwischen Spalte 6 und 7; bei 1024 (Spalte 960, x 32–992) x 452–572. Die übrigen Kacheln folgen der Teilung des Bandes, nicht den Spalten.

| Maß (px) | Telefon und Zwischengröße (bis 1023 px Breite) | Schreibtisch (ab 1024 px) | Begründung |
|---|---|---|---|
| Bandhöhe | 144 | 176 | DG T2 |
| Haarlinien | 1 px `--line` bei y 0 und y 143, volle Breite | y 0 und y 175 | DG T2 |
| Kachel · Abstand · Teilung | 72 · 24 · 96 | 96 · 32 · 128 | DG T2; Abstand = ⅓ Kachel |
| Mittelkachel | 90 × 90, Bildzone y 14–104 | 120 × 120, y 16–136 | 1,25-fach (DG T2) |
| Namensplatz | y 112–132, Inter 15/20, 700, `--text`, mittig, ≤ 240 breit | y 144–168, 17/24 | DG T2; längster Name „Hebe-Schiebe-Tür“ ≈ 140 px |
| Lichtschlitz | 120 × 1 in der oberen Haarlinie, x 135–255 | 160 × 1, x 560–720 | 1,33 × Mittelkachel |
| Kegel | radialer Verlauf, Halbachsen 68 × 150, Mitte im Schlitz, um 10° nach links unten geneigt | 90 × 184 | Lichthof 1,5 × Fokusträger (SG 10.9); Richtung wie K-24 (oben rechts → links unten), die flachere Neigung folgt dem Keil aus V1 als eigener sichtbarer Quelle |
| Unschärfe am Rand | 2 (0,51 % von 390; Zwischengröße 0,20–0,31 %, unter der Spanne, Prüfpunkt Bild bei 768) | 4 (0,31 % von 1280, 0,39 % von 1024) | DG 2.2.4: 0,3–0,6 % |
| Wölbung | `perspective: 700px`, bis ±36° | 900px, bis ±36° | Bestand ±40°; bei 36° bleiben 81 % der Breite, die Form bleibt lesbar |
| Randmaske | äußere 24 blenden aus | äußere 64 | DG T2 |
| sichtbar | 4 Kacheln ganz, 2 angeschnitten (768: 7 ganz, 2 angeschnitten) | 9–10 (1024: 8) | – |
| Abstand bis Haarlinie von 01 | 96 | 128 | Festlegung V2-2 nach K-14 (11.1.6); Rückfall [H] 48/64 |

**Verhältnisse.** Im Band am Telefon ≈ 42 % Bild, 5 % Text, 53 % frei; am Schreibtisch ≈ 43 %, 1 %, 56 %. Größenhierarchie:
Mittelkachel > übrige Kacheln (1,25 : 1) > Name. Die Mittelkachel bleibt mit 90 px weit unter dem Fokusträger von V1 (Foto 420 px hoch),
damit das Band im ersten Bildschirm als Fortsetzung liest, nicht als zweiter Held.

**Ebenen [V].** 0 Grund `#161616`, deckend, mit beiden Haarlinien → 20 Reihe der Renderings (Bildschicht: Wölbung, Größe, Deckkraft,
Schärfe) → 25 Lichtschlitz und Kegel, `mix-blend-mode: screen`, ohne Trefferfläche → 30 Namensplatz (Bedienschicht: frontal, nur
Deckkraft) → 40 Kopf läuft darüber. Am Schreibtisch überdeckt das deckende Band den ausgeblendeten Fuß des Startfotos auf 56 px (y 704–760;
DG 2.3.17/4).

**Festlegung V2-2** (an K-14 angeglichen). 08 und EV planen 01 fast ohne Abstand unter der Leiste (≈ 24 px), G6 verlangt 96/128 px
zwischen Abschnitten. Nach Festlegung K-14 (11.1.6) folgt der Abstand der Überschriftenebene: Vor der Haarlinie von 01, die eine h2
eröffnet, stehen 96 px (Schreibtisch 128), auch direkt nach dem Band; die frühere Ausnahme von 48/64 px für das Band als Übergang entfällt.
Der Abstand trennt die volle Haarlinie des Bandes klar von der Spalten-Haarlinie von 01 (x 16–374). Kosten gegenüber 48 px ≈ 0,06 BH;
die Pakete bleiben bei 844 px auf Bildschirm 5. Rückfall [H] (DS-H-4): 48/64 px, wenn das Telefon-Video zwischen Band und 01 ein Loch
zeigt.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität | Wirkung und Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | vier Ebenen wie in C; Tiefe aus Wölbung, Größe, Deckkraft und Schärfe zur Mitte hin; Verdeckung: Kegel über Mittelkachel, Band über Fotofuß (Schreibtisch) | 2 | die Mitte liegt vorn, der Rand hinten: eine Rolle, kein Laufband |
| Material, Transparenz | echtes Material nur im Render (Profile, Glas mit Spiegelung, Lamellen); Band ohne Eigenmaterial, kein Glas | 2 | „Echtes Material statt Symbole“ (SKILL:41) |
| Licht, Schatten | eine Quelle: Lichtschlitz in der Haarlinie als Ende des Erdlicht-Keils aus V1, Zeichnungsblau `--el`; Schlitz in der Mitte 50 %, Kegel 12 % → 5 % → 0 (3 Stopps), höchstens halb so hell wie der Lichtkern im Bullauge; kein Schatten; keine Lichtkante, weil im Band nichts schwebt (K-24, 11.5.4); Renders im Haus-Licht nach K-24 | 1 | V1 und V2 werden ein Lichtweg (H-E5); das Licht markiert die Mitte |
| Formen | Renderings rechtwinklig und technisch; keine Kachelflächen, Ringe oder Radien um die Bilder | 2 | Formkontrast zur runden Bedienschicht; Bilder lesen als Objekte, nicht als Knöpfe |
| 3D-Objekte | vorgerenderte Standbilder aus der eigenen Bühne, frontal; keine Echtzeit-3D (DG 2.2.7 [V]) | 2 | Leistungsbeweis aus dem eigenen Produkt |
| Bildintegration | freigestellt mit Alphakanal auf `#161616`, Kante 1–2 px ohne Saum | 2 | Bild und Seite ein Raum |
| Oberflächendetails | 1-px-Haarlinien; der Schlitz als hellerer Abschnitt der oberen Haarlinie | 1 | Präzision; Detail am Fokus, nie in der Fläche |
| Animation | Versatz nach Scrolltempo mit Trägheit, Bilder wölben sich; Name nur über Deckkraft (F) | 1–2 | Physik mit Sinn: Scrollen deckt weitere Arten auf |
| Typografie | eine Größe (15 bzw. 17 px), eine Zeile, Inter 700 | – | der Name benennt, erklärt nicht |
| Überlagerungen | nur Kegel über Bild; die Bedienschicht liegt auf keinem Bild | – | Lesbarkeit |
| Perspektive | nur im Bild: Wölbung über `rotateY` je Abstand; Render frontal mit leichter Aufsicht | 2 | Rolle statt flacher Reihe |
| interaktive Effekte | Wischen, Tippen, Tasten (F) | 1 | Selbst-Bedienen im Kleinen, Vorgriff auf die Leitidee von E |

**Signature [V].** Genau eine inszenierende: Schärfestaffelung an den Rändern, höchstens drei Schärfezonen, Mitte und Name immer scharf
(DG 2.4.3). Der Kegel zählt als Ende des Lichtübertrags von V1, nicht als zweites Mittel (DG-E-4 A); gilt diese Auslegung nicht, entfallen
Schlitz und Kegel (R1).

**Bewusst weggelassen.** Kennzahlen-Leiste und Cream-Band (E-AB-6, DG-AB-7), Grundlauf und Hover-Verlangsamung (DG-AB-5), Wiegen, Glas,
Staub, Schatten, Karten oder Ringe um die Bilder, Trennpunkte, ein Zeigerstrich unter der Mitte (der Kegel markiert sie schon),
Maßlinien, jeder Knopf.

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit.

- **Erster Bildschirm (844).** Die Leiste ist Fortsetzungssignal, kein Ziel. Erwartete Folge: Bullauge → h1 → Cream „Pakete ansehen“ →
  Chips und Preiszeile → Leiste. Dafür bleibt der hellste Wert jedes Renders ≤ `--text2` (`#c9c8c3`), der Kegel unter dem Erdlicht und
  nichts im Band heller als die Cream-Pille.
- **Zweiter Bildschirm (Scrollstand ≈ 200–460).** Primärer Fokus: die Mittelkachel, weil Größe, Licht, Schärfe und volle Deckkraft dort
  zusammentreffen. Sekundär: der Name darunter. Danach die Nachbarn, zuletzt die weichen Ränder, die „es geht weiter“ sagen.
- **Kontraste.** 90 gegen 72 px; scharf gegen 2 px weich; 100 gegen 40 % Deckkraft; Licht nur in der Mitte. Name `--text` auf höchstens
  `#20242d` ≈ 14 : 1.
- **CTA.** Keiner im Band. Bis Scrollstand ≈ 540 ist die Cream von V1 im Bild, danach erscheint der Kopf-Ring „Pakete ansehen“ (08).
- **Ablenkungen und Gegenmittel.** Flackernde Namen (Name blendet bei Tempo aus, F); grelle Rahmen (Belichtungsgrenze, H); doppelte
  Elemente am Schreibtisch (≥ 12 Einträge); der Keil über dem Text von V1 (regelt fb-01).
- **Übergang.** Untere Haarlinie → 96 px (K-14) → Spalten-Haarlinie und Kapitelzeile „01 · IHR NAME“. Die Bewegung geht erst an den
  Gerätebildschirm von 01 über, wenn die Leiste ruht (E-2).

## F. Interaktions- und Bewegungsverhalten

**Kopplungsfenster (Festlegung V2-3).** Nach 08 endet die Foto-Tiefe von V1, „sobald die Leiste die untere Bildschirmhälfte erreicht“,
und die Leiste steht, „sobald das Gerät aus 01 den unteren Rand erreicht“. Mit den Lagen aus 08 (Kopf von 01 ≈ 210 px) erreicht das Gerät
bei 844 px den Rand bei Scrollstand ≈ 250, die Leiste die Mitte erst bei ≈ 270: Wörtlich bewegte sie sich am Telefon nie. Daher:

1. Die Kopplung beginnt mit dem ersten Scrollschritt, bei dem das Band im Bild ist; die Foto-Tiefe von V1 endet in diesem Moment (genau ein
   Träger, E-2 [V]). Bei 844 bzw. 800 px Höhe läuft die Foto-Tiefe damit nicht; das entspricht ihrem Rückfall „ohne Foto-Tiefe“
   (DG-AB-15). Mit fb-01 abzustimmen.
2. Sie endet, wenn das Gerät von 01 (Schreibtisch: dessen Bühne) zu 50 % im Bild ist. Das Gerät tritt ohne eigene Bewegung ein (08) und
   ist kein zweiter Träger; sein Bildschirm geht erst nach dem Ereignis `vk:leiste-ruht` an.
3. Ergebnis bei 390 × 844 (96 px bis 01 nach K-14): Fenster 0 bis ≈ 510 px, ≈ 215 px Versatz, zwei Wechsel unter dem Kegel
   (Dreh-Kipp-Fenster → Zweiflügelig → Balkontür) plus Auslauf; bei 664 px Höhe ≈ 2,9 Wechsel. Zurückscrollen in das Fenster koppelt wieder.

| Verhalten | Verfahren und Werte | Begründung |
|---|---|---|
| Laden | keine eigene Bewegung; Schlitz und Kegel erscheinen mit dem Foto von V1 (0–0,9 s, Deckkraft); Nr. 1 steht unter dem Kegel | das Licht geht einmal an, als ein Lichtweg; autonome Bewegung bleibt bei V1 (≤ 5 s) |
| Scrollen | Ziel += −0,42 · Δy je Bild (abwärts wandert die Reihe nach links); Sprünge über 600 px ohne Schub (Bestand `verkauf.js:276`); Ziel höchstens 2 Teilungen vor der Lage | Faktor DG T2; links: die nächste Art kommt von rechts wie beim Blättern (**Festlegung V2-4**) |
| Trägheit | die Lage folgt dem Ziel nach dem Modell Trägheit (K-37, 11.7.5): kritisch gedämpft, ζ = 1, ω = 9 s⁻¹; bei gleichmäßigem Scrollen ≈ 0,22 s Nachlauf, nach dem Loslassen ≈ 0,5 s Auslauf, kein Überschwingen; keine Feder (sie bleibt fingergeführten Bildebenen vorbehalten) | Trägheit statt linearem Gleiten (SKILL:43); ruhig (SKILL:48); K-37 |
| Einrasten | ruht die Eingabe 150 ms, wird das Ziel die nächste Kachelmitte (dieselbe Trägheit, ohne Überschwingen); spätestens 1,2 s nach der letzten Eingabe steht die Reihe exakt | die Mitte steht nie halb im Licht; Auslauf ≤ 1,2 s (DG T2) |
| je Kachel | d = Abstand Kachelmitte–Bandmitte ÷ halbe Bandbreite (−1…1), u = Abstand in Teilungen. Größe 0,8 + 0,2 · max(0, 1 − \|u\|); `rotateY(d · −36°)`, die äußere Kante weicht zurück; Deckkraft 1 − 0,6 · d²; weiche Fassung mit Deckkraft smoothstep(0,25; 0,75; \|d\|) | drei Schärfezonen; nur `transform` und `opacity` (SG 10.7) |
| Name | gilt für die Kachel mit kleinstem \|u\|; Wechsel als Überblendung am selben Ort: alt 150 ms aus (`cubic-bezier(.4, 0, 1, 1)`), neu 220 ms ein (`--e-out`) nach 60 ms; über 2,5 Teilungen/s blendet der Name in 150 ms aus und kehrt beim Abklingen zurück | Bedienschicht nur Deckkraft (G1); nichts blinkt |
| Wischen, Ziehen | `touch-action: pan-y`; waagerecht ab 8 px, wenn \|Δx\| > 1,5 · \|Δy\|; die Reihe folgt 1 : 1; beim Loslassen Abwurf nach K-37: Tempo der letzten 80 ms (≤ 1.200 px/s), Abklingen τ = 0,3 s, dann Einrasten mit Trägheit, kein Federn beim Zurückschnappen; auch außerhalb des Kopplungsfensters | direkte Manipulation (SG 10.7) |
| Tippen, Klicken | eine seitliche Kachel gleitet in 480 ms (`--e-io`) unter den Kegel; die Mittelkachel reagiert nicht; kein Zeiger-Cursor | Zugang für die Maus ohne Wischen |
| Tastatur | Reihe `tabindex="0"`; ← → eine Teilung (320 ms, `--e-io`), Pos1/Ende erste/letzte Art; Fokus 2 px `--text`, 2 px innen | WCAG 2.1.1, 2.4.7 |
| Hover | keiner | kein Zustand am Hover |
| Ruhe | beim Einrasten und am Fensterende Ereignis `vk:leiste-ruht` am Band | Übergabe an 01 (E-2) |

**Weniger Bewegung und ohne JavaScript [V].** `.vk-still` bzw. `html:not(.js)`: keine Kopplung, Wölbung, Skalierung, weiche Fassung oder
Klone; alle Kacheln 72 bzw. 96 px, Deckkraft 1. Die Reihe ist ein nativer Bildlaufbereich (`overflow-x: auto`, `scroll-snap-type: x
proximity`, Innenabstand 16 px) und beginnt mit Nr. 1 an x = 16; unter jeder Kachel ihr Name 15 bzw. 17 px in `--text2`, der Namensplatz
entfällt; Schlitz und Kegel stehen als stilles Licht. Bandhöhe gleich, kein Layoutsprung.

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition).** Das Band steht bei Ankunft im unteren Fünftel, 33 px unter dem Ring „Selbst
ausprobieren“ (y 657). Sichtbar: Mittelkachel x 150–240, je eine ganze Nachbarkachel (x 54–126, 264–336), außen je eine angeschnittene
unter der Maske. Das Band liegt im Daumenbereich; Wischen dort stört das senkrechte Scrollen nicht (`pan-y`). Bei 360 px Breite gelten dieselben
Werte (3,75 Kacheln, Unschärfe 0,56 %). **Zwischengröße 640–1023 px (K-11):** Telefonwerte wie die gestapelte Komposition von V1
(`fb-01` G.1); das Band wächst nur in der Breite, bei 768 Mittelkachel x 339–429, sieben ganze und zwei angeschnittene Kacheln. Die
Bandmaße wechseln mit Titel und Abständen erst bei 1024 px.

**Schreibtisch 1280 × 800.** Volle Fensterbreite, 176 px, Oberkante y ≈ 704 unter Cream und Ring, 96 px im ersten Bildschirm, überdeckt den
ausgeblendeten Fotofuß auf 56 px. Mittelkachel 120 px bei x 580–700, je Seite vier bis fünf Kacheln, die äußeren unter der Maske; Name
17 px. **1024 × 768:** dieselben Werte, acht Kacheln sichtbar; die Oberkante folgt V1, der Anschnitt bleibt 8–25 %. Nichts wächst über
120 px (SKILL:28); über 1440 px bleiben die Maße, es werden nur mehr Kacheln sichtbar.

## H. Technische Umsetzung

**Umbau.** Markup VK:66–72 (Leiste B entfällt); `verkauf.css:260–312` und `:527–542` ersetzen; in `leisten()` Grundlauf, Hover, Wiegen
und `vk-leiste-b` heraus, Kopplungsfenster, Trägheit (K-37), Einrasten, Wischen, Tasten, Namensplatz und Ruhe-Ereignis neu. Die Schleife läuft nur,
solange das Band im Bild ist und sich etwas bewegt (Start durch passives `scroll` oder Zeiger, Stopp nach dem Einrasten). Je
Kachel `style.transform` und `style.opacity` direkt schreiben, Lagen einmal messen (wie heute), Kacheln außerhalb überspringen,
`will-change: transform` nur während der Bewegung.

```html
<section class="vk-leiste" data-vk-leiste aria-label="Elemente und Ausstattung im Konfigurator">
  <div class="vk-leiste-reihe" tabindex="0"><ul class="vk-leiste-satz">
    <li><span class="vk-el-bild"><img src="/bilder/elementarten/dreh-kipp-fenster-180.webp"
      srcset="/bilder/elementarten/dreh-kipp-fenster-180.webp 180w, /bilder/elementarten/dreh-kipp-fenster.webp 240w"
      sizes="(max-width: 1023px) 90px, 120px" width="90" height="90" alt="" decoding="async" fetchpriority="low"></span>
      <span class="vk-el-name">Dreh-Kipp-Fenster</span></li>
    <!-- Nr. 2 bis 14 -->
  </ul></div>
  <p class="vk-leiste-name" aria-hidden="true"></p>
</section>
```

Die weiche Fassung (`…-weich.webp`) setzt das Skript nach `load` als zweites Bild in `.vk-el-bild`; beide Bilder liegen in einem gedrehten
Träger. `.vk-el-name` ist in der bewegten Fassung nur für Screenreader da, aber mit 15 px gesetzt, weil die Prüfsuite Schriftgrößen auch
versteckt misst (SKILL:69–70). Klone tragen `aria-hidden` und `inert`. Band: `position: relative; z-index: 1; overflow: clip; contain:
layout paint; background: var(--ground)`; die Bandmaße wechseln über `@media (min-width: 1024px)` (Layout-Umbruchpunkt K-11),
ohne eigene Schwelle. Schlitz und Kegel als `::before`/`::after` mit `pointer-events: none`; die Neigung ist ein festes
`skewX(-10deg)`, nicht animiert.

**Assets (selbst erzeugbar, Freigabe durch den Inhaber).**

| Art | Format, Maß | Vorgaben | Quelle |
|---|---|---|---|
| 14 Renderings, scharf | WebP mit Alpha, 240 × 240 und 180 × 180 px, je ≈ 6–12 KB | das Element allein, ohne Wand, Boden, Schatten, Text; frontal, Kamera auf Elementmitte, leichte Aufsicht, Sichtfeld 15–40°; längere Seite = 80 % der Kachel; Licht nach Haus-Token K-24 (`--licht-x: -0.6; --licht-y: 0.8`, von oben rechts nach links unten; DG 2.2.0), wie alle Renders aus derselben Bühne; Glas mit blauer Spiegelung; hellster Wert ≤ `#c9c8c3`; Farbe und Ausstattung wie die Voreinstellung der App, für alle gleich; Kante 1–2 px ohne Saum | eigene Bühne (`web/assets/buehne.js`), Aufnahmeweg wie `marketing/highlights/aufnahmen/h11-*` bis `h13-*` (Stand 21.10.2026 veraltet, neu aufnehmen) |
| 14 weiche Fassungen | gleiche Maße; Unschärfe eingebacken, 10 px bei 240, 5 px bei 180 | ergibt 4 bzw. 2 px in der Darstellung | aus den scharfen erzeugt |

Erster Bildschirm am Telefon: Foto 82 KB plus sechs sichtbare Renderings ≈ 50 KB, unter 300 KB (DR 3.6); LCP bleibt das Foto.

**Leistungsrisiken.** Bis zu zwölf gedrehte Ebenen am Schreibtisch; Median-Bildzeit über 25 ms für 2 s → flache Fassung ohne `rotateY`
(Größe, Deckkraft, Schärfe bleiben). Kein animiertes `filter`, `backdrop-filter` oder Schatten. Einbettung: Bindung idempotent in
`Verkauf.auf`, Beobachter über `beobachten()`, Index der Mitte in einer Modulvariable, damit ein Neuaufbau nicht springt.

**Barrierefreiheit.** Region mit Namen; Liste der 14 Namen für Screenreader, Bilder `alt=""`, Namensplatz `aria-hidden`; Fokus sichtbar;
volle Bedienung per Tastatur und Touch; ruhige Fassung vollständig. Prüfung: Prüfsuite Abschnitte 2, 6, 10, 29, 30; Telefon-Video
390 × 844, Bilder bei 390 und 1280, „weniger Bewegung“, ohne JavaScript, `/#fensterbauer` mit Neuaufbau.

**Rückfälle.** R1 Kegel-Auslegung abgelehnt: Schlitz und Kegel entfallen, die Mitte wirkt über Größe und Tonwert (D-AB-6). R2 Renderings
fehlen: Zeichnungen aus VK:66 mit 24 px (Mitte 30 px), ohne weiche Fassung; nur als Übergang, dann Stufe 2. R3 Leistung: flache Fassung.
R4 weniger als 12 Einträge: Teilung am Schreibtisch 160 px, damit kein Element doppelt zu sehen ist.

## I. Conversion-Begründung

- **Position.** Nach V1 kennt der Besucher Zuordnung und Preisniveau. Bevor er in 01 Zeit investiert, beantwortet die Leiste in ≈ 0,17 BH
  (1 % der Seite) eine Ausschlussfrage. **[H]** Wer sein Sortiment wiedererkennt, liest weiter.
- **Gestaltung.** Bild statt Text (SKILL:29), echtes Material aus dem eigenen Produkt (SKILL:41), eine Leiste „wie die Logoleisten
  anderer Seiten, aber hochwertig“ (SKILL:121); Scrollen deckt buchstäblich weitere Arten auf. Der Lichtfaden Bullauge → Kegel →
  Bildschirmlicht in 02 bindet Startbild und Produkt (H-E5).
- **Informationsmenge.** 14 Namen mit ein bis drei Wörtern, immer nur einer sichtbar; die ganze Liste ist über Wischen erreichbar.
- **Zielhandlung.** Indirekt: Sie hält FB-2 und FB-6 auf dem Weg über 01–03 zu den Paketen; ohne eigenen Knopf bleibt die Cream in V1
  die einzige Hauptaktion.

| zu testende Annahme | Prüfung | Rückfall |
|---|---|---|
| Renderings sind bei 72 px als Art erkennbar | Kontaktbogen bei 390 px, Urteil des Inhabers | engerer Ausschnitt je Art |
| Scrollkopplung allein wirkt lebendig genug (DG-H-9) | Telefon-Video, Test des Inhabers am eigenen Telefon | Faktor 0,6 nach Freigabe |
| der Lichtfaden liest als Markenfaden (H-E5) | Telefon-Video | R1 |
| zwei Wechsel im Kopplungsfenster reichen | Video bei 844 und 664 | Fensterende bei 70 % Gerätesichtbarkeit |
| die Leiste kostet keinen Weg zu den Paketen | nach dem Start Scrolltiefe bis `#pakete` mit und ohne Leiste vergleichen | Leiste entfällt am Telefon |

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST:450–451; Punkt 6 GEST:462):

1. Nur noch eine Leiste; die Cream-Kennzahlen-Leiste entfällt (E-AB-6). Grund: offene Zahlen (EA O-10, O-11), zweite Cream-Fläche
   (DG-AB-7).
2. Kein Grundlauf von 30 px/s, keine Hover-Verlangsamung, kein Wiegen (EA AB-8, DG-AB-5). Grund: Dauerbewegung ohne Reaktion,
   WCAG 2.2.2.
3. Die Namen drehen nicht mit; nur die Bilder wölben sich, sichtbar ist nur der Name unter dem Kegel (DG-AB-6). Grund: frontale
   Bedienschicht.
4. Renderings statt 24-px-Zeichnungen (KA-AB-4). Grund: echtes Material (SKILL:41).
5. Abwärts läuft die Reihe nach links statt „von links nach rechts“, ohne Trennpunkte (Festlegung V2-4). Grund: Blätterrichtung, ruhigeres
   Bild.
6. Die Bandmaße wechseln bei 1024 px statt bei 760/761 px; bis 1023 px gelten die Telefonwerte (K-11, DS-AB-6; GEST:462 „eine Spalte bis
   760 px“). Grund: zwei Layout-Umbruchpunkte, 640 und 1024 px, halten die Zahl der Kompositionen prüfbar (SG 10.9).

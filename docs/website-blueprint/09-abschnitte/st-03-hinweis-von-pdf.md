# Hinweis zum Aufmaßblatt bei ?von=pdf im Startbild der Einbettung

Seite: Startseite `/`, Ansicht Fensterbauer (Rahmen, nur mit `?von=pdf`) · Position: 3 (Rahmenteil R3; liegt im Startbild V1 der Einbettung an der Stelle des Meldungsstapels) · Intensitätsstufe: 4 als Teil von V1; die Karte selbst Stufe 1, ohne eigene Signature

ID `st-03-hinweis-von-pdf` · Phase I, Planung, nichts gebaut · [V] verbindlich, [H] Hypothese mit Rückfall · Lagen in CSS-Pixeln ab
Oberkante der Seite; Telefon in der Einbettung, deren Bildfeld um 52 px Kopfraum wächst (`fb-01-startbild` F.5) · abgestimmt mit
`fb-01-startbild` und `st-02-umschalter`; angeglichen an DS 11 (K-22, K-29, K-31, K-39) · „Festlegung I“ = Entscheidung dieser Phase.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Hinweis zum Aufmaßblatt (`st-03-hinweis-von-pdf`) |
| Position | Kein eigener Abschnitt, keine eigene Höhe: ein Zustand von V1 (`fb-01`) in der Einbettung auf `/`. Darüber Kopf (`rh-01`, y 0–56) und Umschalter (`st-02`, y 68–112), darunter der Lesestapel von V1 (Kicker ab y 372), danach V2. |
| Bedingung [V] | Ansicht Fensterbauer, `?von=pdf`, kein Merker `aufmass.vonpdf.zu` (`vonPdf()`, `web/assets/portal.js:964-966`; Ansichtswahl `:1976`). Sonst V1 unverändert mit Stapel. |
| Ziel | FB-4 (Aufmaßblatt eines Kunden in der Hand; EA 4.2: „hoch für Aufmaß übernehmen, offen für ein Paket“) bestätigen, dass er richtig ist; den Code-Weg auffindbar halten, den das Aufmaßblatt Käufern verspricht (AGB:33 § 2 (2)); Preiszeile und Cream im ersten Bildschirm lassen (E-1). |
| Nutzerfrage | „Was mache ich mit diesem Blatt, bekomme ich solche Anfragen auch unter meinem Namen?“ (08, R3). Die Karte beantwortet die erste Hälfte; h1, Chips und Cream von V1 direkt darunter die zweite. |
| Vorbereitete Entscheidung | Aufmaß per Code übernehmen (Service) oder weiter zur Seite und zu den Paketen (Cream). |

**Festlegung I zu EV 7.5.4.** Konzept C sah zwei Antwortzeilen vor. Die zweite („Solche Anfragen unter meinem Namen“) wäre ein zweiter Weg
zu `#pakete` neben der Cream im selben Bildschirm; sie entfällt, die Cream trägt sie.

## B. Konkreter Inhalt

| Element | Inhalt | Herkunft |
|---|---|---|
| Titel | „Sie halten ein eeziframes-Aufmaß in der Hand?“ | wörtlich `portal.js:849`; die Prüfsuite erwartet ihn (`scripts/pruefen.mjs:596`) |
| Handlung | **Textentwurf** „Per Code übernehmen“, zugänglicher Name „Aufmaß per Code übernehmen“ | gekürzt aus 08 und IA 5.4.4 a; Wortfeld des PDF „Aufmaß digital übernehmen.“ (`web/assets/blatt.js:664`) und des Betriebsbereichs „Code vom Kunden einfügen“ (`portal.js:1029`, `:1615`) |

- **Ziel der Handlung [V]:** Ohne Sitzung die vorhandene Aktion `data-act="reg" data-v="betrieb"` (`portal.js:1789-1791`: bestehende
  Sitzung → Anmeldung; mit Server → Anmeldeblatt mit Zweck Registrierung, `:1613`; Pilot → Registrierung). Mit Betriebssitzung direkt
  „Code vom Kunden einfügen“ (`data-act="sheet" data-v="linkimport"`, `:1615`). Wohin und in welchem Ton das Ziel führt, entscheidet
  EA O-4 (08 8.4.7 Nr. 6); die Karte bleibt dabei gleich, geändert wird eine Stelle in `portal.js`.
- **Entfällt gegenüber dem Bestand (`portal.js:849`):** „So holen Sie es in Ihr Konto: kostenlos registrieren …“, „Die ersten 3 Aufmaße
  sind frei“, Knöpfe „Kostenlos registrieren“ und „Später“. Kosten nennt das Anmeldeblatt (`:1613`) vor jeder Bindung; die Karte wirbt
  nicht für das Aufmaß-Link-Modell (SKILL:25). „Später“ braucht es nicht mehr, weil die Karte keinen Platz vor dem Inhalt belegt; der
  Merker aus dem Betriebsbereich (`:970`, `:1871`) gilt weiter.
- **Entfällt gegenüber 08 (Festlegung I):** die Zeile **Textentwurf** „Das Blatt ist ein PDF, lesbar ohne Konto. Das Feinaufmaß bleibt bei
  Ihnen.“ (391 px in Inter 13, also zwei Zeilen); sie passt nicht in die Stapelzone (C). Das Feinaufmaß steht in 03 (PB:44), das FB-4 auf
  seinem Weg erreicht. Variante bei 22 px mehr Ruhezone: **Textentwurf** „Lesbar für jeden Betrieb, ohne Konto.“ (197 px; aus
  `portal.js:852` „für jeden Fensterbauer lesbar“).
- **Ersetzt:** Meldungsstapel samt „BEISPIEL“ (FB-4 hält das echte Blatt, 08). Der Ring „Selbst ausprobieren“ ist in diesem Zustand
  ausgeblendet (Begründung C).
- **Nicht in der Karte:** Preise, Etikett „Beispiel“ (kein erfundenes Material), Überschrift (h1 bleibt die einzige; die Prüfsuite zählt
  h2), QR-Symbol, Grün.
- **Vorhandene Bausteine:** Kanten der Meldungen (`web/assets/verkauf.css:199-203`, Werte nach fb-01 C.5), Ersatzfüllung des Umschalters
  (st-02 C.2), Chevron `CHEV` (`portal.js:261`), `einbettungAuf()` (`portal.js:822-830`), Herkunftszählung „Aufmaßblatt (QR-Code)“
  (`functions/api/statistik.js:142`).

## C. Exakte Layoutkomposition

**Grundstruktur.** Eine Karte, zwei Teile: Frage oben, Handlung unten, getrennt durch eine Haarlinie. Sie steht links oben an der
Ordnungslinie x 16 unter dem Umschalter; rechts und darunter bleibt der Held frei (Bullauge rechts, Figur ab y 252). Asymmetrisch:
links eine Spalte Bedienung auf ruhiger Wand, rechts das Bild.

**Telefon 390 × 844, Einbettung, 4 Spalten (77,5 px, Rinne 16)**

| Z | Element | x | y | Maß |
|---|---|---|---|---|
| 40 | Kopf | 0–390 | 0–56 | flächenlos |
| 20 | Bildfeld (Foto) | 0–390 | 0–472 | 52 Kopfraum + 420, unteres Viertel ausgeblendet (fb-01) |
| 22 | Scrim | 0–390 | 0–96 | `#161616` 60 % → 0 (st-02 C.1) |
| 25/30 | Umschalter (Fläche/Inhalt und Trefferflächen, K-39) | 16–300 | 68–112 | 284 × 44 (K-29), Ersatzfüllung 80 % (st-02 C.4) |
| 25/30 | **Karte** (Fläche/Inhalt und Trefferfläche, K-39) | 16–252 | 136–242 | 236 × 106, Radius 18 (`--r3`, Glas, K-22); Spalte 1 bis gut Mitte 3 |
| 30 | Kicker · h1 · Chips · Preiszeile · Cream | 16–374 | 372–645 | unverändert (fb-01 F.5) |
| – | Platz des Rings | 16–228 | 657–709 | leer; V1 behält seine Höhe, V2 bleibt ab ≈ 742 |

**Karte innen:** Innenabstand oben 12, seitlich 16. Titel 15/700, Zeilenhöhe 20, zwei Zeilen „Sie halten ein eeziframes-“ / „Aufmaß in
der Hand?“ (in Inter gemessen 163 und 141 px bei 204 px Satzbreite) → 12–52. Abstand 10. Handlungszeile 62–106: 44 px hoch, volle
Kartenbreite, Oberkante als 1-px-Haarlinie, Beschriftung 15/700 ab x + 16 (≈ 144 px), Chevron 8 × 14 `--muted` rechts mit 16 px
Randabstand, kein Pfeilkreis (der gehört nur der Cream, K-31).

**Begründung der Maße [V].** Die Karte füllt die Stapelzone, die fb-01 C.3 vom Zuschnitt verlangt (Bildfeld x 0–252, y 60–190 = Seite
y 112–242), abzüglich der 24 px Abstand zum Umschalter, die st-02 C.4 fordert (bei 12 px läsen sich beide als eine Gruppe). 08 erlaubte
≤ 260 × 168 ab y 124; das träfe nach fb-01 C.3 die Hände (ab x 270) sowie Gesicht und Schwebendes (ab y 252). Die schmalere Breite
(236 gegen 284) hebt die Karte zusätzlich vom Umschalter ab.

**Verhältnisse.** Karte ≈ 25.000 px² = 7,6 % des ersten Bildschirms, 13,6 % des Bildfelds (Stapel samt „BEISPIEL“ ≈ 23.000 px²; der
Ring gibt ≈ 11.000 px² frei, die freie Fläche wächst um ≈ 3 %; ≥ 33 % [V] am Bildschirmfoto messen). Größen in V1 bleiben
32 · 17 · 15/13 (15 gehört wie der Meldungstitel zur Klein-Stufe, fb-01 C.2). Wörter im ersten Bildschirm: V1 ohne Ring 28 + Karte 11 = 39 (SG 10.9: höchstens etwa 40). Handlungsaufrufe: Cream primär, Code-Zeile sekundär;
ein dritter ist nicht erlaubt (SG 10.9; Ergebnis B, B.3.7). **Deshalb entfällt der Ring** in diesem Zustand (Festlegung I, in fb-01
nachzutragen).

**Interaktive Lage.** Code-Zeile y 198–242 im oberen Viertel, Cream y 593–645 im Daumenbereich: Die Hauptaktion bleibt, wo der Daumen
liegt; die Code-Zeile ist eine gezielte Zweithandlung für den, der sie sucht.

**Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Fläche Telefon | `rgba(31,31,31,.85)`, kein `backdrop-filter` | wie der Umschalter in V1 (st-02 C.4): das Foto wandert mit 0,88 unter der Karte (fb-01 F.2), darunter liegt dunkle Wand; obere Grenze der Ersatzfüllung (SG 10.9: 65–85 %), weil zwei Zeilen Text auf leiser Struktur stehen |
| deckend | `.95` bei `prefers-reduced-transparency` oder `prefers-contrast: more` | SG 10.9 |
| Kante | innen 1 px `--text` 14 %; rechts 1 px `--el` 24 % | st-02 C.2; fb-01 C.5; Licht von rechts (Bullauge) |
| Haarlinie | 1 px `--text` 14 % | wie Kante |
| Radius | 18 (`--r3`) auf allen Breiten; Handlungszeile unten 18 | K-22 (11.6.1): voll · 24 · 18 · 12 ohne Verkleinerung, Glas 18; wie die ersetzten Meldungen; 18 und 12 stehen auch in GEST:32, kein Bruch |
| Schrift | Titel und Beschriftung `--text` #f3f2ee; Chevron `--muted` (K-31) | Schrift ≥ 12 : 1 auf der Ersatzfüllung auch über 50-%-Lichtern; Chevron ≈ 4,3 : 1 (Grafik, ≥ 3 : 1) |
| Schatten, Schein | keine | DG-AB-1; DNA Nr. 6, 10 |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | Fläche Z 25 über dem Foto (20), Inhalt und Trefferfläche 30 (K-39), Kopf 40; sichtbare Verdeckung der Wand; V1 bleibt bei vier Ebenen | 1 | gehört in die Szene, nicht davor |
| Material, Transparenz | Ersatzfüllung ohne Live-Unschärfe, Wand scheint zu 15 % durch | 1 | eine Familie mit dem Umschalter; Glasbudget von V1 bleibt bewusst ungenutzt |
| Licht, Schatten | keine Quelle; rechte Kante nimmt das Erdlicht auf | 1 | verankert die Karte im Licht des Ankers |
| Formen | Rechteck Radius 18 wie die Meldungen (Familie Glas, K-22), keine Pille | 1 | Pillen bleiben Cream und Umschalter |
| Bildintegration | im Foto, Foto randlos; kein Bild des Blatts (das zeigt 03) | – | keine Doppelung |
| Oberflächendetails | Lichtkante, Haarlinie, Chevron | 1 | Präzision ohne Zierrat |
| Typografie | Lesestimme fett 15; keine Technikstimme, kein Grün | – | die Frage ordnet selbst ein |
| Überlagerungen | nur über der Stapelzone | – | SKILL:87 |
| Animation, Perspektive, 3-D | keine; frontal [V] | 0 | Bedienschicht steht (G1, SG 10.9) |
| Interaktive Effekte | Zustände über Kontur und Füllung | 1 | G1 |

**Signature:** keine eigene. In V1 bleiben in diesem Zustand Lichtübertrag (inszenierend) und Maßlinie (informierend); das Glas mit
Unschärfe entfällt am Telefon mit dem Stapel. **Bewusst weggelassen:** Live-Unschärfe, Einblenden, Cream, Grün, QR-Symbol, Miniatur des
Blatts, zweite Antwortzeile, Schließen-Knopf, wandernder Pfeil.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Salienz:** Erdlicht im Bullauge oben rechts, einziger farbiger und hellster Reiz (fb-01 E); die Maßlinie (0,9–2,1 s) hält den Blick
   kurz dort.
2. **Aufgabe [H]:** FB-4 liest vermutlich früh den Kartentitel, weil er seine Lage benennt (EA S0 „Bin ich da, wo mein Link
   hinzeigte?“). Für ihn ist die Karte der primäre Aufgabenfokus; der Held bleibt primärer Blickfokus.
3. h1 (32 px, höchster Schriftkontrast) → Chips → Preiszeile → Cream.
4. Code-Zeile nur bei Bedarf; sie liegt dort, wo der Blick in Schritt 2 schon war.

**Kontraste:** Die Karte ist flächig kaum heller als die Wand, damit im Blinzeltest weiter nur Erde und Cream als Flecken bleiben
(DG-H-12; DG 2.4.4 Nr. 1); die Schrift darin ist hell. **CTA-Gewicht:** Cream gefüllt, 52 px, größter Hellwert der Bedienschicht;
Code-Zeile ungefüllt, 15 px, ohne Farbe, klar zweitrangig. **Ablenkungen:** der Umschalter 24 px darüber im gleichen Material – Form
(Pille gegen Rechteck) und Breite trennen; die Maßlinie zieht nach rechts und endet nach 2,1 s. **Übergang:** Die Karte scrollt mit der
Seite weg; der Kopf-Ring „Pakete ansehen“ erscheint, sobald die Cream aus dem Bild ist (`kopfCta`, `portal.js:551`); Lichtkeil und
Leiste führen in V2. FB-4 erkennt sein Blatt in 03 wieder.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Laden | Karte steht ab dem ersten Bild, ohne Einblenden | – | Bedienschicht ohne Auftritt (DG T1, DG-AB-2; IA 5.4.4 a) |
| Ladeauftritt V1 | Foto 0–0,9 s wie fb-01 F.1; ohne Meldungen und „BEISPIEL“ zeichnet sich die Maßlinie schon 0,9–2,1 s statt 2,9–4,1 s | 1.200 ms, Kurve wie Bestand | sonst 2 s Leerlauf; weiter nur ein Träger zugleich (E-2) |
| erste Eingabe | Laufendes in 220 ms in den Endzustand | 220 ms, Deckkraft | fb-01 F.1; E-2 |
| Scrollen | Karte 1 : 1 mit der Seite, Bildgruppe 0,88 (fb-01 F.2); kein Materialwechsel nötig, weil ohne Unschärfe | – | Bedienschicht ohne Versatz (G1) |
| Zeiger über der Handlungszeile (`hover: hover`) | 1-px-Kontur `--text` 40 % innen, Chevron `--muted` → `--text` (K-31) | 150 ms, `--e-out` | Hover = Kontur (DG 2.4.1) |
| Drücken | Füllung `--surface2` | 150 ms | aktiv = Füllung, keine Skalierung (SG 10.9) |
| Fokus | 2-px-Kontur `--text`, Abstand −3 px (innen, weil die Zeile an der Kartenkante liegt), Radius 12 (`--r2`, Fokus von Zeilen, K-22; liegt innerhalb der 18er-Kartenecke) | sofort | ≥ 3 : 1 |
| Auslösen | vorhandenes Blatt öffnet (Anmelden/Registrieren bzw. Code einfügen) | wie heute | keine neue Mechanik |
| Karte höher als 120 px (Textgröße, 320 px Breite) | Wechsel in den Rückfall „Zeile“ (G) | Schnitt | nichts überdeckt Gesicht oder Lesestapel |

**Weniger Bewegung:** Karte identisch; V1 ohne Zoom und Tiefe, Maßlinie fertig. **Ohne JavaScript:** keine Einbettung, also kein
Hinweis; die Übernahme per Code braucht selbst JavaScript (`web/index.html:99`), die Textfassung (`web/index.html:65-67`) bleibt.
**Richtung, räumliche Transformation:** keine; an der Karte bewegt sich nichts.

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Komposition C. Bei 390 × 664 stehen Karte, Preiszeile (561–578) und Cream (593–645) ganz im Bild [V] E-1.
Bei 360 px bleibt die Karte 236 px breit (204 px Satzbreite tragen beide Titelzeilen); Lage an der Stapelzone des 360er-Ausschnitts
prüfen (fb-01 G.1). Bis 760 px gilt diese Fassung, Ordnungslinie ab 640 px x 20 (st-02 G.2).

**Rückfall „Zeile“** – zugleich Testvariante und Fassung bei Ladefehler der Einbettung (`vkRueckfall()`, `portal.js:818`; dort vor der
Ersatzkarte): im Platz des Rings, x 16–374, y 657–701, flächenlos: „Aufmaß in der Hand?“ 15/500 `--text2` (davor unsichtbar „Sie halten
ein eeziframes-“), dann Knopf „Per Code übernehmen“ 15/700 `--text` mit Chevron 8 × 14 `--muted` (K-31), Ziel 44 px, zusammen ≈ 300 px. V1 bleibt unverändert,
E-1 hält; bei 664 liegt die Zeile knapp unter dem Rand (H-ST3-3). **Abweichung von 08** (dort: „eigene Zeile über dem Foto ≤ 96 px, Foto
360 px“): Nachgerechnet senkt eine Zeile unter dem Kopf die Fotounterkante um 92 px statt 36; E-1 hielte nur, wenn der Lesestapel 152 px
ins Foto griffe, und dem Helden blieben neben dem Umschalter ≈ 120 px.

**Schreibtisch 1280 × 800 (eigenständig, ab 1200 px).** Die Karte liegt oben in der Textspalte, nicht im Foto: Bedienschicht an der
Ordnungslinie (G5), Glas nur über Bild, und die Stapelzone am Schreibtisch (fb-01 C.4, ≈ 220 × 64 über dem Kopf der Figur) trüge 86 px
nicht; E-1 drückt hier nicht. Opake Fassung des Glas-Bausteins: `#1f1f1f`, 2-px-Ring `--line`, Radius 18 (`--r3`) wie am Telefon – sie
ersetzt die Glas-Meldung und bleibt in der Familie Glas, wird also nicht zur Karte mit 24 (K-22, 11.6.1); ohne Lichtkante (keine Quelle daneben). Breite nach
Inhalt ≈ 336 px (Titel einzeilig 304 px + 2 × 16), höchstens 5 Spalten (x 120–533); Höhe 86 (12 · 20 · 10 · 44). Der Textblock bleibt
senkrecht mittig zwischen Kopf und Leiste (fb-01 C.4), verlängert um Karte und 48 px Zonenabstand: Karte y ≈ 175–261, Kicker ≈ 309,
h1 337–421, Chips 445–481, Preiszeile 497–514, Cream 538–590. Foto (x 553–1280) ohne Stapel und ohne Karte; Umschalter im Kopf (st-02
G.3); Ring ausgeblendet wie am Telefon; Maßwert behält sein Glas (eine Glasfläche, ≤ 3).

**1024 × 768 (761–1199 px).** Textspalte x 32–418 (fb-01 G.3); Karte ≈ 336 px wie bei 1280, Block senkrecht mittig; weil die h1 hier drei
Zeilen hat, ist zu prüfen, ob die Cream im ersten Bildschirm bleibt (Überschlag: Unterkante ≈ 630).

## H. Technische Umsetzung

**Bestehend:** die Bausteine aus B; dazu `web/assets/verkauf.js` (Startbild ab :152, die Stapelschleife bricht ohne `.vk-stapel` schon
ab, :167-168) und das Startbild-Markup `web/fuer-fensterbauer/index.html:54-64` in der Fassung von fb-01 H.

**Neu**

1. `vonPdfHinweis(wurzel)` in `portal.js`, aufgerufen in beiden Zweigen von `einbettungAuf()` (Speicher und Abruf) direkt nach dem
   Einsetzen und vor `vkStarten()`, im selben Task: entfernt `.vk-eingang`, setzt `data-vonpdf` an `.vk-hero`, fügt die Karte als erstes
   Kind von `.vk-hero` ein. Kein gezeichnetes Bild mit Stapel, keine Verschiebung; idempotent nach Neuaufbau.
2. Markup (Klasse `vonpdf` bleibt für die Prüfsuite; mit Betriebssitzung `data-act="sheet" data-v="linkimport"`):

   ```html
   <aside class="vonpdf vk-vonpdf" aria-labelledby="vonpdf-t">
     <p id="vonpdf-t" class="vk-vonpdf-t">Sie halten ein eeziframes-Aufmaß in der Hand?</p>
     <button type="button" class="vk-vonpdf-los" data-act="reg" data-v="betrieb"
             aria-label="Aufmaß per Code übernehmen">Per Code übernehmen<!-- CHEV --></button>
   </aside>
   ```

3. CSS in `verkauf.css` (nur `.vk-einbettung`): Telefonfassung `position: absolute; top: 136px; left: 16px; width: 236px` ohne eigenen
   `z-index`; Fläche und Kante nach C als `::before` mit `z-index: var(--z-vermittelnd)` (25), Titel und Knopf `position: relative;
   z-index: var(--z-ui)` (30), wie `st-02` (K-39); Haarlinie nach C; `.vk-hero[data-vonpdf] .rg-cta .btn.ghost { display: none }` bei unveränderter Mindesthöhe von V1.
   Splitfassung (ab 761 px): `position: static`, erstes Element der Textspalte im Raster von V1, `width: fit-content; max-width: 413px;
   margin-bottom: 48px`, opak. `portal.css:139` (`.banner.vonpdf`) entfällt.
4. `verkauf.js`: bei `[data-vonpdf]` Maßlinie ab 0,9 s; `ResizeObserver` an der Karte, Höhe > 120 px → `data-fassung="zeile"`.
5. `vonPdf()` robuster: Wirft `sessionStorage` (gesperrter Speicher), gilt nur der Parameter, statt den Hinweis zu unterdrücken (heute
   `catch → false`, `:965`).
6. Prüfsuite: `scripts/pruefen.mjs:195` und `:596` prüfen `.banner.vonpdf`, künftig `.vonpdf`; `[data-act="reg"]` und der Titeltext bleiben
   erfüllt; `:598-600` (Betriebsbereich mit „Später“) unberührt.

**Assets:** keine neuen für die Karte. Voraussetzung ist der Telefonzuschnitt aus fb-01 C.3 und H.3 (beim Inhaber anzufragen; EV X6;
08 8.4.7 Nr. 10) mit der dort genannten Stapelzone; dieser Abschnitt braucht keine größere. Bis dahin Platzhalter wie fb-01 (heutiges
Foto, nur Vorschau und Telefon-Video, nicht `main`); die Karte verdeckt dann Handy und Arm, nachgemessen bei 390 × 420.

**Animation und Leistung:** an der Karte nur `transition` von Kontur und Füllung (SG 10.9 erlaubt das an kleinen Bedienelementen); kein
Bild, ≈ 1 KB CSS und JavaScript, kein `backdrop-filter` am Telefon; CLS 0 (absolut, vor dem ersten Zeichnen eingefügt); LCP unverändert.

**Barrierefreiheit:** `aside` mit Namen aus dem Titel, keine Überschrift; DOM-Folge Kopf → Umschalter → Karte → Foto → Kicker, h1;
`button`, weil ein Blatt öffnet; der zugängliche Name enthält den sichtbaren Text (WCAG 2.5.3); Ziel 236 × 44; Text ≥ 4,5 : 1 gegen die
hellste Stelle der Stapelzone (Lichter ≤ 50 %, fb-01 C.3), auch in der deckenden Fassung; Fokus ≥ 3 : 1; `forced-colors`: Rand
`CanvasText`, Beschriftung `ButtonText`; 200 % Text über den Rückfall „Zeile“ ohne Überdeckung; Reflow bis 320 px.

**Abweichungen**

1. Hinweis im Startbild statt davor (GEST:193; Z-AB-1). **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Grund: E-1.
2. Wortlaut und Knöpfe des Bestands (`portal.js:849`) entfallen, darunter „Später“ und „Die ersten 3 Aufmaße sind frei“. **Abweichung von
   bestehender Regel – Freigabe durch den Inhaber nötig.** Grund: SKILL:25, EA O-4; die Kosten nennt das Ziel.
3. Kein Schatten unter der schwebenden Fläche (designrichtung.md:91; DG-AB-1). **Abweichung von bestehender Regel – Freigabe durch den
   Inhaber nötig.**
4. Gegenüber 08 (Festlegung I): Karte 236 × 106 ab y 136 statt ≤ 260 × 168 ab 124, ohne 13-px-Zeile; Ring in diesem Zustand ausgeblendet
   (in fb-01 nachzutragen); Schreibtisch in der Textspalte; Rückfall im Platz des Rings. Gründe in C und G.
5. Prüfsuite-Selektor: Freigabe nach 08 8.4.7 Nr. 9.

## I. Conversion-Begründung

- **Position:** ganz oben, weil FB-4 vom QR-Code kommt und zuerst wissen will, ob er richtig ist (EA S0); im Foto, damit Preiszeile und
  Cream bei 664 px sichtbar bleiben – ein Band davor schöbe sie hinaus (08).
- **Gestaltung:** eine Frage im Wortlaut seiner Lage, eine Handlung; materiell Teil der Szene (Umschalter-Familie, Erdlicht-Kante) statt
  Fremdband; geringes Flächengewicht, damit Held und Cream ihren Rang behalten.
- **Informationsmenge:** 11 Wörter. Kosten und Ablauf nennt das Ziel, das Feinaufmaß 03, den Nutzen V1 darunter; V1 bleibt bei rund
  40 Wörtern und zwei Handlungen.
- **Beitrag zur Zielhandlung:** Der Service-Weg ist einen Tipp entfernt (Zusage aus AGB:33); der Paketweg (Z1a) läuft unverändert über
  die Cream. Die Karte ersetzt Stapel und Ring, statt etwas hinzuzufügen.
- **Zu prüfende Annahmen [H]** – Messgrund: Herkunft „Aufmaßblatt (QR-Code)“ (`statistik.js:142`) mit den Vorgängen der Zentrale; bei
  kleinen Zahlen Gespräche mit drei bis fünf Fensterbauern (EA O-2). Keine Aussage über tatsächliche Wirkung.

| Nr. | Annahme | Prüfweg | Rückfall |
|---|---|---|---|
| H-ST3-1 | Der Titel ganz oben bestätigt FB-4 die Ankunft; er verlässt die Seite seltener als beim heutigen Band | Absprünge mit Herkunft QR vor und nach dem Umbau | Titel zusätzlich als Kicker 13 über der Karte |
| H-ST3-2 | Die ungefüllte Code-Zeile wird gefunden, obwohl sie leiser ist als der heutige Knopf | Registrierungen bzw. Code-Übernahmen mit Herkunft QR; beobachtete Aufgabe | Code-Zeile als Ring-Knopf 44 px |
| H-ST3-3 | Die Karte im Foto führt eher zur Übernahme als die Zeile im Platz des Rings | Vergleich beider Fassungen | „Zeile“ als Grundfassung |
| H-ST3-4 | Ohne Werbung für das Aufmaß-Link-Modell erreicht FB-4 häufiger `#pakete` und das Formular (IA-H-8, EA H-D6) | Trichter ab Herkunft QR | keiner nötig, Lernwert |

Offen: EA O-4 (Ziel und Ton der Handlung), Telefonzuschnitt (fb-01 H.3), Freigaben 1–5.

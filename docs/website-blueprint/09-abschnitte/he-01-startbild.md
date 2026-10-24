# H1 Startbild

Seite: Startseite `/`, Ansicht Hauseigentümer `/#hauseigentuemer` (Standardansicht) · Position: 1 von 7 (nach Kopf und Umschalter, vor H2 `he-02-probemessung`) · Intensitätsstufe: 3 „gestaltet“ (Typ T1 Bühne)

ID `he-01-startbild`. Phase I, Stand 24.10.2026; Planung, nichts gebaut. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md).
**[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Textentwurf** = neuer Wortlaut zur Freigabe, **Festlegung I-n** = Entscheidung dieser
Spezifikation, wo 08 offen ist. Alle Lagen sind geplant, nicht gemessen.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Startbild der Hauseigentümer, Bühne T1 (DG 2.3.3) |
| Position | erster Abschnitt der Standardansicht von `/`; darüber Kopf (56 px) und Glas-Umschalter, danach H2 „01 · Probemessung“ (08, 8.3.4) |
| Ziel | zuordnen, Zutrauen geben, Start und Preis ohne Scrollen, auch bei 390 × 664 ([V] E-1; EA B1; RE R12, R13) |
| Nutzerfrage | „Ist das für mich, und schaffe ich das?“ (EA H-01) |
| vorbereitete Entscheidung | jetzt messen (Z2a, Cream) oder erst zusehen (Führung, U4, Ring); nebenbei: falsche Ansicht → Fensterbauer |
| Gewicht | 0,92 BH bei 844 px, ganz in Bildschirm 1 |

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Element | Inhalt | Fundstelle |
|---|---|---|
| Eyebrow | „In Minuten zum Aufmaß für jeden Fensterbauer“ (wörtlich, Prüfsuite) | `web/assets/portal.js:852`; `scripts/pruefen.mjs:148` |
| h1 | „Fenster ausmessen. Selbst. eezi.“, grün „eezi.“ (wörtlich, einziges h1) | `portal.js:852`; `web/index.html:50` |
| Preise | Messen kostenlos, kein Konto zum Messen; Aufmaßblatt 7,99 € bis 17.11.2026, danach 12,99 € | `web/index.html:61-62`; `functions/api/umgebung.js` (`EINFUEHRUNG`) |
| Aktionen | „Jetzt ausmessen“ → `/app/#ausmessen`, mit angefangenem Aufmaß „Aufmaß fortsetzen“ → `/app/` und Zeile „… Fenster erfasst, gespeichert in diesem Browser“; „Führung starten“ → `/app/#fuehrung` | `portal.js:16-20`, `:852` |
| Foto | `start-hauseigentuemer.webp`, 1250 × 1250, 180 KB: Waschbär auf einem Tritt misst mit gelbem Zollstock an der Laibung einer Maueröffnung im Rohbau, Handy in der Pfote, Tageslicht von rechts | `web/bilder/foto/`; alt-Satz `portal.js:853` |
| Umschalter | „Hauseigentümer · Fensterbauer“, Anker, gespeicherte Wahl | `portal.js:398-402`; GEST:188-191 |

**B.2 Texte (rund 40 Wörter)**

- Eyebrow und h1 wörtlich.
- Lead, **Textentwurf** (IA H1, gekürzt aus `web/index.html:58`): „Zwei Fotos und die Maße mit dem Zollstock, jeder Schritt erklärt.“
  „Etwa fünf Minuten je Fenster“ erst nach EA O-11.
- Preiszeile, **Textentwurf** (aus `web/index.html:61-62`), Umbruch nur am Punkt: „Messen kostenlos, ohne Konto“ · „Aufmaßblatt 7,99 € bis
  17.11.2026, danach 12,99 €“; ab 18.11.2026 von selbst „Aufmaßblatt 12,99 €“.
- Zustand „fortsetzen“ (**Festlegung I-1**): Teil 1 der Preiszeile wird **Textentwurf** (aus `portal.js:852`) „2 Fenster erfasst, gespeichert
  in diesem Browser“ (326 px), die Cream „Aufmaß fortsetzen“; Zeilenzahl und E-1 bleiben.
- Knöpfe „Jetzt ausmessen“ (Cream mit Pfeil im Kreis), „Führung starten“ (Ring). Ohne Anrede (EA O-13).

**B.3 Interaktionen:** Cream → App; Ring → Führung; Umschalter → Ansicht Fensterbauer (Anker `#fensterbauer`, kein Verlaufseintrag, Wahl
gespeichert, Sprung an den Anfang, GEST:191); Logo → `/`; Menü (`rh-02-menue`). Der Kopfknopf „Fenster ausmessen“ erscheint erst, wenn die
Cream das Bild verlassen hat (**Festlegung I-2**, nach IA N4 [H]; heute steht dasselbe Ziel dreimal im Bildschirm, PA 1.8).

**B.4 Entfällt gegenüber heute:** Lead aus fünf Zeilen, Zeile „Führung: ein Fenster in zwei Minuten …“, Haken-Chips im Foto (als
Elementarten nach H3; KA-AB-6), Überschrift Wort für Wort (`portal.js:768`; DG 2.2.8), Einführungsband (IA-AB-6), Kennzahlenleiste
(IA-AB-5), Umschalter-Zeile im Kopf (IA-AB-3).

**B.5 Vorhandene Komponenten:** `.btn.primary` mit `.pf`, `.btn.ghost`, `.seg` (`web/assets/gemeinsam.css:56-81`); `heroFoto()`
(`portal.js:777`); `appEinstieg()`, `eigenesAufmass()`, `ansicht()`; `kopfCta` (GEST:399); `Abrechnung.einfText()` (`web/assets/modell.js:1127`);
Stichtagstausch `functions/seo.js:139-171`.

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Eine Bühne als Rasterzelle, alle Ebenen in `grid-area: 1 / 1` (SG B.2). Telefon: 4 Spalten à 77,5 px, Rand und
Abstand 16 px; Foto randlos über die volle Breite; Lesestapel und Knöpfe über Spalte 1–4 an der Ordnungslinie x = 16 (G5); Umschalter über
Spalte 1–3. Asymmetrisch-diagonal: Anker (Waschbär an der Öffnung) oben rechts, zweiter Pol (Cream) unten links (G3; SG 10.1/2).

**C.2 Telefon 390 × 844** (mit Telefonzuschnitt nach H.4)

| Element | Z | x | y | Maß, Stil |
|---|---|---|---|---|
| Kopf: Logo, Menü | 40 | 16–146, 330–374 | 0–56 | Ziele 44 × 44, flächenlos über Scrim |
| Scrim | 28 | 0–390 | 0–120 | `#161616` 64 % bis y 56, dann bis 0 |
| Foto | 20 | 0–390 | 0–420 | opak bis y 276, Auslauf bis y 396 |
| Umschalter (Glas) | 30 | 16–276 | 68–112 | 260 × 44, Segmente 142 und 118 px |
| Eyebrow | 30 | 16–≈ 320 | 320–355 | 13/600, Versalien, zwei Zeilen, `--accent` |
| h1 | 30 | 16–320 | 363–430 | 32/800, −0,03 em, Zeilenhöhe 1,05, zwei Zeilen, „eezi.“ `--accent` |
| Lead | 30 | 16–374 | 442–490 | 17/500, Zeilenhöhe 24 px, `--text2` |
| Preiszeile | 30 | 16–≈ 340 | 506–542 | 13/600, `tabular-nums`, 0,02 em, Zeilenhöhe 18 px, `--text2`, Beträge `--text` |
| Cream | 30 | 16–374 | 550–602 | 358 × 52 |
| Ring | 30 | 16–374 | 614–666 | 358 × 52, 2-px-Kontur `--line2` |
| Anschnitt H2 | – | 16–374 | ab 776 | Abschnittsende 680 + 96 px (G6); Haarlinie und „01 · PROBEMESSUNG“, 8 % |

Abstände 8 (Eyebrow → h1, Preiszeile → Cream), 12 (h1 → Lead, Cream → Ring), 16 (Lead → Preiszeile): Botschaft und Handlung sind zwei
Gruppen, die Preiszeile steht über den Knöpfen (EV 7.5.10).

**C.3 Verhältnisse.** Foto 50 % der Höhe bei 844 (63 % bei 664), davon opak 33 %; Lesestapel und Handlung 41 %; Überlappung mit dem Auslauf
y 320–396, Fotodeckkraft hinter der Eyebrow ≤ 25 %. Waschbär ≈ 170 px hoch (Ohren y ≈ 120, Füße ≤ 290); Waschbär, Laibung und Öffnung
≈ 240 × 190 px = 28 % der Fotofläche. Sprung Anker : Versalhöhe der Bedienschrift ≈ 18-fach (SG 10.1/4); h1 : Lead = 1,9 liegt unter dem
SG-Vorschlag 2,25, bindend ist die Skala des Inhabers (SKILL:69), der Sprung entsteht über das Foto (G4). Frei ≈ 37 % (Schätzung, ≥ ⅓);
Text als Begrenzungsrahmen ≈ 17 %, Prüfpunkt gegen den SG-Vorschlag 15 %. Größenstufen 32 · 17 · 13 (15 im Umschalter zählt zur Klein-Stufe,
DG 2.2.18).

**C.4 Ebenen.** Z0 Grund → Z20 Foto → Z28 Scrim → Z30 Bedienschicht mit Umschalter → Z40 Kopf. Vordergrund: Bedienschicht und Glas;
Mittelgrund: Waschbär an der Laibung; Hintergrund: Raum und Tageslicht. **Festlegung I-3:** Umschalter in Z30 statt Z25 (08), weil
Bedienziele nicht zur Bildschicht gehören (G1); Glas ist die zulässige Materialausnahme der Bedienschicht (SG 10.3/1, /6).

**C.5 Technische Startwerte**

| Wert | Startwert | Begründung |
|---|---|---|
| Fotorahmen | 390 × 420, `object-fit: cover`, `object-position: 50% 0` | E-1; E-AB-1 sinngemäß |
| Auslauf | `mask-image: linear-gradient(#000 0 276px, rgb(0 0 0/.5) 298px, rgb(0 0 0/.22) 318px, rgb(0 0 0/.07) 350px, transparent 396px)` | Auslauf über das untere Drittel (DG 2.2.11); Eyebrow 4,5:1 |
| Scrim | `linear-gradient(rgb(22 22 22/.64) 0 56px, transparent 120px)` | **Festlegung I-4:** DG T0 (60 % → 0 über 96 px) hielte die Kopfelemente über heller Decke nicht bei 4,5:1 |
| Glas | Füllung `rgb(31 31 31/.6)`, bis .65 falls nötig; `backdrop-filter: blur(24px)` ohne Sättigung; Kante 1 px `rgb(243 242 238/.14)`, oben und rechts .24; Pille; kein Schatten | DG-AB-17; SG 10.3; Licht aus der Öffnung rechts (DG-E-8) |
| Segmente | 15/600 `--text`; gewählt: 2-px-Kontur `--text` mit 4 px Einzug, Text 700; Trefferfläche je 44 px hoch | „in Tinte“ (IA K03); Zustand 3:1 |
| Eyebrow | Sperrung 0,12 em | DG 2.2.18; **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST: 0,18 em): SG-Spanne 0,06–0,12 em; Rückfall 0,18 em, ebenfalls zweizeilig |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | vier Ebenen; Verdeckung: Lesestapel über dem Auslauf, Glas über dem Raum; Schärfentiefe im Foto | 2 | Raum ohne Schatten (DNA Nr. 2, 6) |
| Material, Transparenz | Material nur im Foto (Putz, Ziegel, Holz, Fell); Glas nur im Umschalter; Knöpfe flach | 2 / Glas 1 | Wert über echtes Bild (DNA Nr. 9; SKILL:41) |
| Licht, Schatten | Licht nur aus der Öffnung im Foto, keine CSS-Lichtfläche (DG T1); Lichtsaum am Glas zur Öffnung; beim Laden „geht das Foto an“ | 2 | Leitmotiv des Zeichens (DG 2.2.0) |
| Formen | Vollrundung (Umschalter, Knöpfe, Pfeilkreis); Foto ohne Radius | – | formstabil (DNA Nr. 5) |
| 3-D-Objekte | keine | 0 | Ladelast; das Modell gehört in die App |
| Bildintegration | randlos, Auslauf unten, am Schreibtisch auch links | 3 | „ein Raum“ (DNA Nr. 4) |
| Oberflächendetails | 1-px-Kanten am Glas, Pfeil im Kreis, Fokuskontur | 1 | Präzision ohne Dekor |
| Animation | ein Auftritt des Fotos, danach Ruhe | 1 | Ankommen statt Vorführung |
| Typografie | Bühnenstimme (h1), Technikstimme (Eyebrow, Preiszeile), Lesetext (Lead), ein grünes Wort | 2 | Etikett neben dem Motiv |
| Überlagerungen | Text nur über dem Auslauf; nichts über Gesicht, Händen, Zollstock, Öffnung (SKILL:87) | – | Motiv bleibt Held |
| Perspektive | nur im Foto; Bedienschicht frontal | – | DNA Nr. 1 |
| Interaktive Effekte | Zustände über Füllung und Kontur; keine Skalierung beim Drücken (SG 10.7/3; heute `gemeinsam.css:65`) | 1 | ruhig |

**Budget:** inszenierend 1 (Glas), informierend 0 (DG 2.4.2). **Bewusst weggelassen:** Maßlinien im Foto (EV 7.5.10: H2 trägt die Messung),
Lichtübertrag und Rahmenbruch (B-AB-9), Glas-Meldungen, Partikel, Raumschrift, Parallaxe am Telefon, Echtzeit-3D, Haken-Chips, Kennzahlen.

## E. Visual Attention Architecture

Erwartet aus Kontrast, Größe und Lage, nicht gemessen.

- **Primär:** Gesicht des Waschbären mit Handy, daneben Zollstock und helle Laibung (höchster Detail- und Hell-Dunkel-Kontrast).
- **Sekundär:** h1 (größter Text, hell auf dunklem Auslauf), dann die Cream als einzige große helle Fläche der unteren Hälfte.
- **Reihenfolge:** Figur → h1 → Lead → Preiszeile → Cream → Ring; Umschalter peripher (oben links, ohne Füllung).
- **Kontraste:** Tageslicht oben rechts und Cream unten links bilden eine Diagonale vom Motiv zur Handlung; Grün < 1 % der Fläche.
- **CTA:** Cream 358 × 52 = 5,6 % der Fläche, y 550–602 = 65–71 % der Höhe bei 844, 83–91 % bei 664; Daumenbereich.
- **Ablenkungen:** Glas neben dem Kopf (Schutzabstand ≥ 16 px); helle Decke (Scrim); „für jeden Fensterbauer“ kann Fensterbauer ansprechen
  (Umschalter sichtbar); Kopfknopf mit gleichem Ziel (I-2); keine weiße Karte von H2 im ersten Bildschirm.
- **Übergang:** Haarlinie und Kapitelzeile bei y 776 schneiden 8 % an; vom warmen Foto zur weißen Zeichnung in H2 als Wechsel ohne Bewegung.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Verhalten | Dauer, Kurve | „Weniger Bewegung“ | Begründung |
|---|---|---|---|---|
| Laden | Foto Deckkraft 0,35 → 1, Maßstab 1,03 → 1, Ursprung 70 % 30 %: die Kamera „setzt sich“ zur Öffnung; Text steht ab dem ersten Bild | 900 ms, `cubic-bezier(.2, 0, 0, 1)`, verzögernd | Foto sofort voll | ein Träger (E-2); Start bei 0,35, damit das Foto sofort als LCP zählt |
| ab 900 ms | Licht im Logo geht an (GEST:7) | 1,6 s | ruhig | **Festlegung I-5:** nacheinander (SG 10.7/4), Ende nach 2,5 s |
| erstes Scrollen im Auftritt | Endzustand | sofort | – | E-2 |
| Scrollen | Telefon: keine Bewegung. Schreibtisch [H]: Foto bleibt zurück, Faktor 0,9, bis H1 endet | scrollgekoppelt | keine | kein Glas über bewegtem Motiv (SG 10.8); Tiefe (SKILL:43) |
| Hover (`hover: hover`) | Cream → `--primary-hover`; Ring-Kontur → `--text`; Segment-Füllung `rgb(243 242 238/.08)` | 160 ms, wie oben | bleibt | Zustand über Füllung, Kontur (SG 10.7/8) |
| Drücken | Füllung dunkler, keine Skalierung | 120 ms | bleibt | SG 10.7/3 |
| Fokus | 2-px-Kontur `--text`, Abstand 2 px, unverdeckt | sofort | bleibt | WCAG 2.4.7, 2.4.11 |
| Umschalter | Überblendung der Ansicht; Kopf und Umschalter stehen; Sprung an den Anfang ohne Scroll-Animation | 240 ms Deckkraft | Schnitt | SG 10.7/5; Variante [H]: Foto blendet 700 ms zum Astronauten (KA-IA-9) |
| Cream verlässt das Bild | Kopfknopf erscheint, bei Rückkehr weg | 220 / 165 ms Deckkraft | ohne Übergang | I-2 |

Bewegung nur zur Ruhe hin, keine Schleife, Bedienschicht ohne Versatz. Variante [H] nach DR 3.5 („drei Ebenen je Szene“): das Tageslicht als
aus dem Foto geschnittene Ebene folgt 50 ms später; braucht ein Masken-Asset, Rückfall Grundfassung.

## G. Responsive Design

**Telefon 390 × 844 (zuerst):** wie C.2, einhändig bedienbar, Ziele 44–52 px.

- **390 × 664:** Preiszeile und Cream ganz im Bild, Ring zu 96 %; Fortsetzungssignal sind angeschnittener Ring und Auslauf. Mit Pilotleiste
  (40 px, nur ohne Server) liegt die Cream bei 590–642, noch im Bild.
- **360 px:** h1-Zeile 1 (304 px) und Preiszeile Teil 2 (323 px) passen in 328 px; Foto verliert seitlich je 15 px.
- **320 px:** h1 dreizeilig, kein Querscrollen, E-1 nicht zugesichert; bei 200 % Text fließt der Stapel nach unten (Mindesthöhen).
- **640–1023 px:** Telefonkomposition, Text ≤ 560 px, Foto volle Breite × 520 px aus dem Schreibtisch-Asset; ab 768 px Umschalter im Kopf.

**Schreibtisch 1280 × 800:** Split 5 : 7 (12 Spalten à 64,7 px, Abstand 24, Spalte 1040 px ab x 120).

| Element | Lage |
|---|---|
| Kopf 64 px | Logo ab x 120; Umschalter x ≈ 266–526 als flaches `.seg` auf dem Grund (kein Bild dahinter, kein Glas, DG-AB-10); „Ratgeber“, „Für Fensterbauer“ 15 px; Kopfknopf nach I-2 |
| Foto | x 552–1280 (57 %), y 0–760; Bestandsfoto fast vollständig; links über 552–700, unten über 600–760 ausgeblendet |
| Lesestapel | Spalte 1–5 (x 120–539): Eyebrow 232–267, h1 40 px zweizeilig 279–363, Lead 379–427, Preiszeile 451–487 |
| Handlung | Cream x 120–342, Ring x 354–531, nebeneinander y 499–551 |
| Anschluss | Abschnittsende 576; Haarlinie H2 bei y 704 über dem Auslauf, Anschnitt 12 % |

**1024 × 768:** Rand 48; Text über Spalte 1–6 (x 48–452); Foto ab x 450 (44 %, DG T1), links über 120 px ausgeblendet; h1 zweizeilig
(380 px); Knöpfe nebeneinander (403 px), sonst Umbruch; Anschnitt H2 ≈ 12 %.

## H. Technische Umsetzung

**H.1 Bestehende Dateien:** `web/assets/portal.js:851-853` (Zweig `kunde` in `SCREENS.landing`), `:768` (`worte()` entfällt für die h1),
`:777` (`heroFoto()` ohne Chips); `web/assets/portal.css:231-252` (`.hero-foto`, Animation `fotoin` wird ersetzt); `web/assets/gemeinsam.css:10-30`
(Tokens); `web/index.html:44-54` (Textfassung).

**H.2 Neu**

- Startbild als **statisches HTML** am Anfang von `#app` in `web/index.html`, gleich mit und ohne JavaScript; `portal.js` übernimmt den Knoten.
  Grund: Heute erscheint das Startbild erst nach rund 547 KB synchronen Skripts (TD 1.4); Ziel LCP ≤ 2,5 s, ≤ 100 KB Skript im ersten
  Bildschirm (SG 10.8). `.hero.b2c`, `p.eyebrow` und die h1 bleiben (Prüfsuite).
- `.seg.glas` für das Telefon; ohne JavaScript zwei Links auf `#hauseigentuemer` und `#fensterbauer`.
- `Startbild.auf(wurzel)` (≤ 2 KB): Auftritt nach `img.decode()`, Abbruch beim ersten Scrollen, Kopfknopf über IntersectionObserver;
  idempotent bei Neuaufbau (SKILL:63-64).

**H.3 CSS:** Bühne `display: grid; isolation: isolate; overflow: clip`; `<picture>` mit `media="(max-width: 639px)"` für den Zuschnitt,
`width`/`height`, `fetchpriority="high"`, Preload mit `media`; `mask-image` nie animiert; Glas mit `@supports`-Rückfall `rgb(31 31 31/.8)`,
deckend `.95` bei `prefers-reduced-transparency` und `prefers-contrast: more`; Auftritt nur unter `.js` und
`prefers-reduced-motion: no-preference`; Schreibtisch-Parallaxe über `animation-timeline: scroll()` in `@supports`, sonst statisch.

**H.4 Assets**

| Asset | Art, Maß | Quelle |
|---|---|---|
| `start-hauseigentuemer-telefon.webp` | Foto, Zielmaß 390 × 420, Lieferung 1170 × 1260; ausgeliefert 780 × 840 ≤ 110 KB und 1170 × 1260 ≤ 170 KB | **beim Inhaber anfragen** (Flux) |
| Platzhalter bis dahin | dieselbe Datei, per Skript aus dem Bestandsfoto: Quadrat 280 px (Zielmaß) bei x 110–390, y 88–368 auf `#161616`, links 56 px und oben 40 px eingeblendet (Ohren dann y ≈ 129, 17 px unter dem Umschalter; Füße ≈ 295); Umschalter dann mit Ersatzfüllung ohne Unschärfe (kein Bild darunter, SG 10.3/6) | vorhanden, lokal erzeugt |
| Schreibtisch | `start-hauseigentuemer.webp`; optional 2000 × 2000 ≤ 400 KB für Pixeldichte 2 | vorhanden; optional anfragen |

**Warum ein Zuschnitt:** Im Bestandsfoto liegen Ohren und Augen des Waschbären bei 420 px Höhe auf y ≈ 60–125, x ≈ 180–245; der Umschalter
(16–276 × 68–112) verdeckte das Gesicht (SKILL:87, geprüft am Modellbild). Vorgaben in Anteilen des Bildes: Ruhezone x 0–79 %, y 0–28 % nur
Decke und Wand mit weichem Tonwertverlauf; Ohren ab 29 %, Füße bis 69 %, Kopf x 38–62 %; erhobene Pfote über 28 % nur rechts von 79 %;
Öffnung mit Tageslicht x ≥ 77 %; Tritt und Boden unter 66 % verschattet, detailarm; Licht von rechts; kein Text, kein Wasserzeichen. Prompt:
„Same scene as the reference photo, camera pulled back and up: calm plaster ceiling above, raccoon smaller and right of centre, window opening
with daylight at the right edge, stool and floor in soft shadow. Photorealistic, warm daylight from the right, no text, no watermark.“

**H.5 Leistung:** LCP (H.2); `backdrop-filter` nur auf 260 × 44 px; `decoding="async"`, Start erst nach `decode()`; `will-change` nur während
der 900 ms; CLS ≤ 0,1 über feste Maße; bis LCP ≤ 350 KB.

**H.6 Barrierefreiheit:** DOM-Folge Umschalter → Eyebrow → h1 → Lead → Preiszeile → Cream → Ring; Umschalter als Gruppe „Ansicht“ mit
`aria-pressed`; Kontrast gegen die ungünstigste Fotostelle (Text 4,5:1, h1 3:1, Segmentkontur 3:1); ausgeblendeter Kopfknopf `inert`;
`forced-colors`: Konturen bleiben.

**H.7 Prüfsuite** (`scripts/pruefen.mjs`): anpassen `:147-148` (Band, Kennzahlkachel), `:169` (Kopfknopf), `:213` (Umschalter als Kopfzeile);
neu: Cream-Unterkante ≤ 602 px bei 390 × 664; Umschalter schneidet die Schutzfläche des Motivs nicht.

## I. Conversion-Begründung

**Position und Gestaltung.** H1 ist der Ort der Zuordnung (EA B1): Foto und h1 beantworten „Ist das für mich?“, der Lead „Schaffe ich das?“,
die Preiszeile „Was kostet es, brauche ich ein Konto?“ vor dem Tippen (RE R13, Hypothese). Die Cream liegt im Daumenbereich, der Ring bietet
einen Weg ohne eigene Maße; der Umschalter sortiert Fensterbauer aus, ohne Hauseigentümer abzulenken.

**Informationsmenge.** Rund 40 Wörter, eine Haupt- und eine Nebenhandlung (SG 10.1). Messprinzip steht in H2, Ergebnis und Preis im Detail in
H3, Daten und Konto in H4; weniger nähme H-01 oder H-02 aus dem ersten Bildschirm.

**Verbindlich [V]:** E-1; Eyebrow und h1 wörtlich; eine Cream; nichts über dem Motiv; ein bewegter Träger; ruhige Fassung als Standbild;
keine fremden Server.

**Zu testen [H]** (keine Aussage über Wirkung auf Käufe)

| Nr. | Annahme | Prüfweg | Rückfall |
|---|---|---|---|
| H-he01-1 | Foto 420 px mit kleinerem Waschbären trägt die Wirkung (H-E7) | Telefon-Video bei 844 und 664, Urteil des Inhabers | Foto 460 px, Lead entfällt (Aussage in H2) |
| H-he01-2 | Der Auftritt wirkt als „Licht geht an“, nicht als Verzögerung | Telefon-Video | nur Deckkraft, 600 ms |
| H-he01-3 | „Führung starten“ wird ohne Erklärzeile als „erst zusehen“ verstanden | Lesetest | Zeile 13 px „ein Fenster in zwei Minuten, ohne eigene Maße“ (`portal.js:852`) |
| H-he01-4 | Die Preiszeile über den Knöpfen hält nicht vom Start ab | Gespräche; später Trichter (EA O-2) | Preiszeile unter die Knöpfe |
| H-he01-5 | Fensterbauer finden den Umschalter oben links (IA-H-4) | Gespräche | Zeile über dem Foto, Foto 376 px |
| H-he01-6 | Parallaxe 0,9 am Schreibtisch gibt Tiefe ohne Unruhe | Video 1280 | statisch |

**Freigaben:** Telefonzuschnitt (H.4); Sperrung der Eyebrow (C.5); I-2 Kopfknopf ausgeblendet statt Ring: **Abweichung von bestehender Regel
– Freigabe durch den Inhaber nötig** (GEST:192, :399 `kopfCta`; Grund: dasselbe Ziel nicht zweimal im ersten Bildschirm); gewähltes Segment
als Kontur statt Cream: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST „Farbe“; Grund: eine Cream je
Bildschirm, IA K03); dazu die geführten IA-AB-3, IA-AB-5, IA-AB-6, KA-AB-6 und E-AB-1 sinngemäß.

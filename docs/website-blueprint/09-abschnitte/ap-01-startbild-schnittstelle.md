# Startbild der App

Seite: App `/app/`, Startbild (Schnittstelle zur App) · Position: 1 von 1 (erster Bildschirm der App-Startseite; darunter App-Bestand: 3-D-Modell, Lead, „Dein Projekt.“, „So funktioniert's“, Fußlinks) · Intensitätsstufe: 2 „klar“ (Typ T14 App-Einstieg)

ID `ap-01-startbild-schnittstelle`. Phase I, Stand 24.10.2026; Planung, nichts gebaut. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md).
**[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Textentwurf** = neuer Wortlaut zur Freigabe, **Festlegung I-n** = Entscheidung dieser
Spezifikation, wo 08 offen ist. Alle Lagen sind geplant, nicht gemessen. Alle Konzepte A–D führen `/app/` „wie IA“ (KA:97, KB:105, KC:99,
KD:123); maßgeblich sind deshalb IA 5.4.4 f, DG T14 (2.3.16) und 08, 8.3.10.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Startbild der App, Bühne T14 (DG 2.3.16) |
| Position | erster Bildschirm von `/app/` ohne angefangenes Aufmaß und ohne Kundenlink (`web/assets/app.js:2768-2770`); darüber der eigene App-Kopf (52 px, nicht Gegenstand, 08 8.2.2), darunter die Modellkarte des App-Bestands |
| Ziel | Start ins Messen (Z2a) mit Preis und Konto-Hinweis **vor** dem ersten Schritt (RE R13; EA H-D11); Anmeldung für gesicherte Aufmaße (HE-7); Rückweg „Sie sind Fensterbauer?“ → `/fuer-fensterbauer/` (IA-AB-4) |
| Nutzerfrage | „Was kostet es, brauche ich ein Konto, bin ich hier richtig?“ (08 AP-1; EA H-02, H-03) |
| vorbereitete Entscheidung | jetzt messen (Cream) oder erst zusehen (Führung, U4); wiederkehrend: anmelden; falsche Zielgruppe: zur Seite für Fensterbauer |
| Gewicht | 0,85 BH (y 52–720 bei 844), ganz in Bildschirm 1 |

Wer hier ankommt: Ratgeber und Suche (HE-1 bis HE-3, Titel „Fenster ausmessen: kostenlose Aufmaß-App im Browser“, `web/app/index.html:6`),
Menü und Fuß „Gesichertes Aufmaß öffnen“ (HE-7, IA-AB-10), 404 „Zur App“, Fensterbauer über die Live-Demos (`fb-12`, Zustand A).
`/app/#ausmessen` überspringt das Startbild (`app.js:6560-6562`); diese Besucher haben Preis und Konto-Hinweis in `he-01` und `he-04` gesehen.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Element | Inhalt | Fundstelle |
|---|---|---|
| Eyebrow | „Fensterplanung, ganz eezi“, „eezi“ klein (`.mk`), wörtlich | GEST:15; `app.js:2772` |
| h1 | „Fotografieren. Messen. Wünschen.“, grün „Wünschen.“, wörtlich | `app.js:2772` |
| Preise | Messen, Fotos, 3-D-Modell kostenlos, ohne Konto; Aufmaßblatt 7,99 € bis 17.11.2026, danach 12,99 € | `web/app/index.html:63`; `functions/api/umgebung.js` (`EINFUEHRUNG`); `web/assets/modell.js:1118-1130` |
| Konto | Zum Freischalten E-Mail und Code, kein Passwort; ohne Konten nur E-Mail für die Rechnung | `web/app/index.html:63`, `:81`; `app.js:3385`, `:3394` |
| Aktionen | „Fenster ausmessen“ (`data-act="new"`), „Führung starten“ (`tour-start`), „Schon ein Aufmaß gesichert? Anmelden“ bzw. „Angemeldet als … · Dein Konto“ | `app.js:2773` |
| Foto | `app-start.webp`, 1120 × 1400, 178 KB: drei Waschbären im Wohnzimmer, einer hält das Handy mit Bild von Maueröffnung und Zollstock hoch, einer tippt auf dem Sofa, einer lehnt mit Tasse zurück; Lampe und Fenster mit warmem Licht; alt-Satz vorhanden | `web/bilder/foto/`; `app.js:2767` |
| Fußlinks | „Anleitung: Fenster ausmessen ›“, „Sie sind Fensterbauer? ›“ (heute → `/#fensterbauer`), „Zur Startseite ›“ | `app.js:2308`, `:2781` |

**B.2 Texte (37 Wörter im ersten Bildschirm, ≤ 40 nach SG B.3.6)**

- Eyebrow, h1, Knopftexte und Anmelde-Zeile wörtlich aus dem Bestand.
- Konditionsblock, drei Zeilen, **Textentwurf** (wortgleich mit `he-01` und `he-04`, eine Quelle je Wahrheit):
  1. „Messen kostenlos, ohne Konto“
  2. „Aufmaßblatt 7,99 € bis 17.11.2026, danach 12,99 €“; ab 18.11.2026 von selbst „Aufmaßblatt 12,99 €“
  3. „Zum Kauf: E-Mail und Code, kein Passwort“
- Zeile 3 je Zustand (**Festlegung I-1**): ohne Konten auf dem Server (`kontoBereit()` falsch, `app.js:5260`) **Textentwurf** „Zum Kauf: nur
  deine E-Mail-Adresse“; angemeldet (`KS`) Bestand „Angemeldet als … · Dein Konto“, die Anmelde-Zeile entfällt dann (Höhe bleibt).

**B.3 Interaktionen:** Cream → Schritt 1 von 6; Ring → Führung; „Anmelden“ → Anmeldung mit Code (`app.js:3394`); „Dein Konto“ → `meinkonto`;
Logo im App-Kopf → `/`. Fußlinks am Seitenende: „Sie sind Fensterbauer? ›“ → `/fuer-fensterbauer/` (IA-AB-4).

**B.4 Entfällt im ersten Bildschirm:** Einführungsband mit „Noch n Tage“ und doppeltem Ziel „Jetzt ausmessen →“ (`app.js:2772`; RE R13 „ohne
laufenden Countdown“; DG T14 „Nicht: Preiskasten vor dem Foto“); Haken-Chips im Foto (**Festlegung I-2**: wiederholen die h1, tragen Glas
mit Unschärfe, das 8.3.11 hier nicht vorsieht). Die Zeile „Zwei Minuten, ohne eigene Maße · Wie genau ist das?“ wandert an das Ende des Leads
unter der Modellkarte (**Festlegung I-3**: Wortbudget; `scripts/pruefen.mjs:654` findet den Glossar-Knopf dort weiterhin).

**B.5 Vorhandene Komponenten:** `.btn.primary` mit `.pf`, `.btn.ghost`, `.ulink`, `.eyebrow.kicker`, `.mk` (`web/assets/gemeinsam.css:44-76`);
`FOTO_START` (`app.js:2767`); `SCREENS.home` (`:2768-2777`); `kontoBereit()`, `KS`; `Abrechnung.preise()`, `.einfuehrung()`
(`modell.js:1118-1130`); `Logo.bewegen()` (`gemeinsam.js:127-136`).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Eine Bühne als Rasterzelle (SG B.2): Foto und Lesestapel in `grid-area: 1 / 1`, der Stapel beginnt im Auslauf des
Fotos (GEST:34). Telefon: 4 Spalten à 77,5 px, Rand und Abstand 16 px; Foto randlos über 390 px; Stapel und Knöpfe über Spalte 1–4 an der
Ordnungslinie x = 16 (G5). Vertikal geschichtet und asymmetrisch: Motiv oben mit Schwerpunkt Mitte/rechts (mittlerer Waschbär, Fensterlicht),
Handlung unten links bündig.

**C.2 Telefon 390 × 844**

| Element | Z | x | y | Maß, Stil |
|---|---|---|---|---|
| App-Kopf (Bestand) | 40 | 0–390 | 0–52 | unverändert |
| Foto | 20 | 0–390 | 52–412 | 360 px, `object-position: 50% 20%`; deckend y 76–262, Auslauf bis 412 |
| Eyebrow | 30 | 16–≈ 250 | 343–361 | 13/600, Versalien 0,12 em, Zeilenhöhe 18 px, `--accent` |
| h1 | 30 | 16–≈ 250 | 369–470 | 32/800, −0,03 em, Zeilenhöhe 1,05, drei Zeilen, „Wünschen.“ `--accent` |
| Konditionsblock | 30 | 16–≈ 350 | 486–540 | `<ul>`, drei Zeilen 13/600, Zeilenhöhe 18 px, `tabular-nums`, `--text2`; Beträge 700 `--text` |
| Cream | 30 | 16–374 | 548–600 | 358 × 52, Pfeil im Kreis 28 px |
| Ring | 30 | 16–374 | 612–664 | 358 × 52, Kontur 2 px `--line2` |
| Anmelde-Zeile | 30 | 16–≈ 290 | 676–720 | Zeile 44 px, Text 15/500 `--muted`, „Anmelden“ 15/800 `--text`, Unterstrich `--line2` |
| Anschnitt Modellkarte | – | 16–374 | ab 772 | 72 px = 8,5 % (**Festlegung I-4**: 52 px Abstand statt 96 nach G6, sonst nur 3 % Anschnitt) |

Abstände 8 (Eyebrow → h1, Konditionsblock → Cream), 12 (Knopf → Knopf → Anmelde-Zeile), 16 (h1 → Konditionsblock): Botschaft, Bedingungen und
Handlung sind drei Gruppen; die Bedingungen stehen direkt über der Cream, damit sie vor dem Tippen gelesen werden (EV 7.5.10 sinngemäß).

**C.3 Motiv in der Bühne (Telefon).** Mittlerer Waschbär, Kopf x 156–215, y 158–236; sein Handy x 210–240, y 211–240; erhobenes Handy mit
Zollstock-Bild links x 57–99, y 148–221; rechter Waschbär x 265–328, y 192–236; Fensterlicht x 289–348, y 52–197. Alles liegt im deckenden Teil;
der Rücken des vorderen Waschbären (x 0–115, ab y 221) ist Repoussoir und läuft unter Eyebrow und h1 aus (Deckkraft dort ≤ 17 %).

**C.4 Verhältnisse.** Foto 43 % der Höhe bei 844 (54 % bei 664), deckend 22 %; Stapel und Handlung 45 %; Überlappung y 343–412. Motiv
(Figuren, Handys, Fenster) ≈ 390 × 160 px. Frei ≈ 45 % (Schätzung, ≥ ⅓ nach SG 10.1/3). Text als Begrenzungsrahmen ≈ 16 %, Prüfpunkt gegen
15 %. Sprung Anker (mittlerer Waschbär ≈ 150 px) : Versalhöhe der Knopfschrift (≈ 12 px) ≈ 12-fach (≥ 3). Größenstufen: 32 und die
Klein-Stufe 13 · 15 · 17 (DG 2.2.18) neben dem Foto.

**C.5 Ebenen.** Z0 Grund `#161616` → Z20 Foto → Z30 Bedienschicht → Z40 App-Kopf. Kein Scrim: Kein Text liegt auf dem deckenden Foto, der
Kopf ist zu 86 % deckend (`app.css:76`). Vordergrund im Bild: Rücken des vorderen Waschbären, unscharf; Mittelgrund: Sofa mit den Figuren;
Hintergrund: Raum, Lampe, Fenster, unscharf. Die Bedienschicht verdeckt nur den Auslauf.

**C.6 Technische Startwerte**

| Wert | Startwert | Begründung |
|---|---|---|
| Fotohöhe | `--foto-h: clamp(296px, 92.3vw, 360px)`, unter 1024 px zusätzlich `min(…, 62svh)` | E-1 bei 664 und 360 px; Querformat |
| Auslauf Telefon | `mask-image: linear-gradient(transparent 0, #000 24px, #000 210px, rgb(0 0 0/.5) 250px, rgb(0 0 0/.22) 280px, rgb(0 0 0/.07) 310px, transparent 360px)` (Stopps mit `--foto-h` skaliert) | Auslauf über das untere Drittel (DG 2.2.11); weicher Anschluss an die Kopflinie oben |
| Stapelbeginn | `padding-top: calc(var(--foto-h) - 69px)` | Eyebrow im Auslauf (GEST:34) |
| Eyebrow | 13/600, 0,12 em | DG 2.2.18; **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST:26, `gemeinsam.css:44`: 800, 0,18 em); Grund: Technikstimme der Grammatik, wie `he-01`; Rückfall 0,18 em, passt einzeilig |
| h1 | 32 px bis 1023 px, 40 px ab 1024 | DG T14; **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST:27 „App: 40 Zahl/Hero“; heute `app.css:171` 40 px); Grund: E-1, 34 px Gewinn; Rückfall 40 px mit Foto 326 px |
| Konditionsblock | `list-style: none; margin: 0; padding: 0`; Zeilen ohne Punkt; Platz für Zeile 3 und Anmelde-Zeile immer reserviert | Höhe stabil, bevor `/api/status` antwortet (`app.js:6804`; CLS) |

## D. Anwendung der Design-DNA

Ausdrucksträger ist die Plastik der Figuren im Foto (DG 2.2.19, Spalte AP: D7 = 3), alle anderen Mittel stehen eine Stufe darunter.

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen plus Kopf; Verdeckung: Stapel über dem Auslauf; im Foto Repoussoir vorn, Schärfe in der Mitte, Unschärfe hinten | 2 | Raum ohne Schatten (DNA Nr. 2, 6) |
| Material, Transparenz | Material nur im Foto (Fell, Strick, Holz, Glas des Handys); kein Glas in der Bedienschicht; Knöpfe flach | 2 / Glas 0 | Wert über echtes Bild (SKILL:41) |
| Licht, Schatten | Licht nur im Foto: Lampe und Fenster, warm (08 8.3.11); keine CSS-Lichtfläche, kein Schatten | 2 | Quelle im Bild (DR) |
| Formen | Vollrundung (Knöpfe, Pfeilkreis); Foto ohne Radius | 2 | eine Formfamilie (DNA Nr. 5) |
| 3-D-Objekte | keine in der Bühne; das 3-D-Modell folgt darunter als App-Bestand | 0 | ein Held je Bildschirm (G3) |
| Bildintegration | randlos, Auslauf unten, am Schreibtisch nach links, oben, unten, rechts | 3 | „ein Raum“ (DNA Nr. 4) |
| Oberflächendetails | Ziffern `tabular-nums`, Beträge fett, Pfeil im Kreis, 2-px-Fokuskontur | 1 | Präzision wie ein Aufmaß |
| Animation | ein Auftritt des Fotos, danach Ruhe | 1 | Ankommen |
| Typografie | Bühnenstimme (h1), Technikstimme (Eyebrow, Konditionsblock), ein grünes Wort | 2 | Etikett neben dem Motiv |
| Überlagerungen | Text nur im Auslauf; nichts über Gesichtern, Handys, Fenster (SKILL:87) | – | Motiv bleibt Held |
| Perspektive | nur im Foto (leichte Aufsicht, Schärfentiefe); Bedienschicht frontal | 1 | DNA Nr. 1 |
| Interaktive Effekte | Zustände über Füllung, Kontur, Unterstrich | 1 | ruhig |

**Budget:** inszenierend 0, informierend 0 (08 8.3.11; Dosierregel: Arbeitsfläche, Stufe 2). **Bewusst weggelassen:** Glas (Chips),
Band mit Restzeit, Maßlinien im Foto, Haarlinie (erster Abschnitt), Parallaxe und jede Scroll-Kopplung (DG AP: D9 = 0), Lichtfleck,
Partikel, Raumschrift, Echtzeit-3D in der Bühne.

## E. Visual Attention Architecture

Erwartet aus Kontrast, Größe und Lage, nicht gemessen.

- **Primär:** Gesicht des mittleren Waschbären mit Handy im Lampenlicht; daneben das leuchtende Handy mit Zollstock-Bild links (höchster
  Hell-Dunkel- und Detailkontrast der oberen Hälfte).
- **Sekundär:** h1 (größter Text, hell auf dunklem Auslauf, Treppe aus drei Wörtern), dann die Cream als einzige große helle Fläche der unteren
  Hälfte.
- **Reihenfolge:** Figuren → h1 → Konditionsblock (die fetten Beträge als Ankerpunkte) → Cream → Ring → Anmelde-Zeile.
- **Kontraste:** warmes, farbiges Foto oben gegen unbunten Grund unten; Diagonale vom Fensterlicht oben rechts zur Cream unten links; Grün
  ≤ 1 % (Eyebrow, „Wünschen.“).
- **CTA:** Cream 358 × 52 = 5,6 % der Fläche, y 548–600 = 65–71 % der Höhe bei 844, 83–90 % bei 664; Daumenbereich.
- **Ablenkungen:** leuchtendes Handy links (Abstand zur Eyebrow ≥ 120 px); „Begriffe“ im Kopf (Bestand); Anschnitt der hellen Modellkarte
  unten (deshalb nur 8,5 %, und unter der Anmelde-Zeile, nicht neben der Cream).
- **Übergang:** Die Modellkarte mit Maßschild „1.370 mm“ schneidet bei 844 an und führt vom Foto zum Messen; bei 664 endet der Bildschirm am
  Ring (siehe H-ap01-5).

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Verhalten | Dauer, Kurve | „Weniger Bewegung“ | Begründung |
|---|---|---|---|---|
| Laden | Foto Deckkraft 0,35 → 1 (600 ms) und Maßstab 1,03 → 1 (900 ms), Ursprung 45 % 35 %: Die Kamera „setzt sich“ auf die Figuren; Text steht ab dem ersten Bild | `--kurve-ein` `cubic-bezier(.2, 0, 0, 1)` | Foto sofort voll | DG T14 (600 ms Deckkraft); Bestand `fotoin` (`app.css:183`, 1,6 s) verkürzt; Start bei 0,35 hält das Foto als LCP-Kandidat |
| Foto spät dekodiert (> 1.000 ms nach Aufbau) | ohne Auftritt, nur Deckkraft 0 → 1 | 200 ms | Schnitt | kein verspätetes Theater |
| ab Ende Foto | Licht im Logo des App-Kopfs einmal (`Logo.bewegen`) | 1,6 s, Bestand | ruhig (`gemeinsam.css:208`) | **Festlegung I-5:** nacheinander (SG 10.7/4; E-2), Ende ≈ 2,5 s |
| erstes Scrollen oder Tippen im Auftritt | Endzustand | sofort | – | E-2 |
| erster Aufbau der Seite | `.scr` gleitet nicht ein | – | – | **Festlegung I-6:** Bedienschicht ohne Versatz (G1); Wechsel aus anderen App-Bildschirmen zurück zur Startseite gleitet weiter (App-Regel GEST:39 Nr. 2) |
| Neuaufbau durch `render()` | Foto im Endzustand, kein zweiter Auftritt | – | – | Auftritt einmal je Seitenaufruf |
| `/api/status` beantwortet | Zeile 3 und Anmelde-Zeile blenden ein | 160 ms, `--kurve-ein` | sofort | Zustand, kein Träger |
| Scrollen | keine Bewegung | – | – | Stufe 2 |
| Hover (`hover: hover`) | Cream → `--primary-hover`; Ring-Kontur → `--text`; Unterstrich „Anmelden“ → `--text` | 160 ms | bleibt | SG 10.7/8 |
| Drücken | Cream `color-mix(in srgb, var(--primary) 90%, #000)`, Ring Füllung `rgb(243 242 238/.08)`; keine Skalierung | 120 ms | bleibt | G1; SG 10.7/3 (heute `gemeinsam.css:65` `scale(.98)`, in der Bühne aufgehoben) |
| Fokus | 2-px-Kontur `--text`, Abstand 2 px | sofort | bleibt | WCAG 2.4.7, 2.4.11 |
| Klick Cream, Ring, Anmelden | App-Wechsel nach App-Regel | 320 ms | App-Regel | DG T14: App außerhalb |

Anschlussbedingung an den App-Bestand: Das Schwingen des Modells (`app.css:331`, 9 s Schleife) startet erst, wenn die Modellkarte zu ≥ 50 %
sichtbar ist, und pausiert außerhalb (SKILL:61; **Festlegung I-7**); so bewegt sich im ersten Bildschirm nur das Foto. Ohne JavaScript steht
die Textfassung `.vorab` (`web/app/index.html:41-85`), unverändert.

## G. Responsive Design

**Telefon 390 × 844 (zuerst):** wie C.2, einhändig, Ziele 44–52 px.

- **390 × 664:** Konditionsblock (486–540) und Cream (548–600) im Bild (E-1), Ring ganz (612–664); Anmelde-Zeile unter der Kante.
- **360 px:** Foto 332 px, alles 28 px höher; Zeile 2 (≈ 323–336 px) bricht gegebenenfalls um, Cream-Unterkante dann ≤ 590.
- **320 px:** Foto 296 px; Konditionsblock bis fünf Zeilen; E-1 nicht zugesichert; kein Querscrollen. Bei 200 % Text wächst die Bühne, keine
  festen Texthöhen.
- **640–1023 px** (App-Spalte 640 px): Telefonkomposition; Foto 640 × 460 (`object-position: 50% 25%`), Stapel ≤ 560 px, Knöpfe 400 px
  breit, linksbündig; h1 32 px. Querformat: Foto ≤ 62 svh.

**Schreibtisch 1280 × 800:** App-Kopf 48 px (`app.css:224`), Inhaltsspalte 752 px (x 264–1016, `app.css:227`), darin 12 Spalten à 48 px,
Abstand 16. Split 6 : 6 plus Bildüberstand.

| Element | Lage |
|---|---|
| Foto | x 648–1230 (bis an den Rand der App, `.app` max. 1180 px), y 52–692 (582 × 640), `object-position: 50% 30%`; Auslauf links 648–740, rechts 1166–1230, oben 52–92, unten 572–692; mittlerer Waschbär x 881–968, y 222–339 |
| Eyebrow | x 264, y 196–213 |
| h1 | 40/800, drei Zeilen, y 225–351 |
| Konditionsblock | y 371–425 (eine Zeile je Bedingung) |
| Cream | x 264–632, y 437–489 |
| Ring | x 264–632, y 501–553 |
| Anmelde-Zeile | y 561–605 |
| Anschluss | Modellkarte ab y 712, Anschnitt 88 px = 11 % |

Lesezone 368 px = 29 % der Breite (SG 25–42 %); Stapel neben dem Anker, nie darauf. **1024 × 768:** Spalte x 136–888; Text x 136–504; Foto
x 520–1024 bis an den Bildschirmrand (504 × 600, kein Auslauf rechts); Eyebrow ab y 166, Cream 407–459; Modellkarte ab 672 (12,5 %).

## H. Technische Umsetzung

**H.1 Bestehende Dateien:** `web/assets/app.js:2767` (`FOTO_START` ohne Chips, mit `srcset`), `:2768-2777` (`SCREENS.home`: Bühne, kein
`EinfBanner`, Konditionsblock, `cta-zeile` in den Lead), `:2308` (`FB_URL = new URL('fuer-fensterbauer/', PORTAL_URL).href`), `:2781`, `:2810`
(Fußlinks); `web/assets/app.css:170-196` (`.hero.start`, `.hero-foto`, `fotoin`, Raster ab 640 px werden ersetzt), `:331` (Schwingen);
`web/assets/gemeinsam.css:44`, `:56-76`; `web/app/index.html` (Kopf: Vorladen).

**H.2 Neu**

- `apKonditionen()` in `app.js`: liefert die drei Zeilen aus `Abrechnung.preise().aufmass`, `Abrechnung.einfuehrung()` (Datum aus
  `EINF.bis` als TT.MM.JJJJ), `kontoBereit()` und `KS`; keine fest geschriebenen Beträge.
- CSS-Block `.ap-buehne` (≤ 2 KB): `display: grid; isolation: isolate; overflow: clip; margin-inline: -16px`; `.ap-foto { grid-area: 1/1;
  height: var(--foto-h); z-index: 20 }`, `.ap-stapel { grid-area: 1/1; z-index: 30; padding: calc(var(--foto-h) - 69px) 16px 0 }`.
  Ab 1024 px: `.scr` `position: relative`, Foto `position: absolute; right: calc((800px - min(100vw, 1180px)) / 2)`, Maske mit
  `mask-composite: intersect` (wie heute `app.css:191`).
- `startAuftritt(wurzel)` (≤ 1 KB): `img.decode()`, Zeitgrenze 1.000 ms, Klasse `.auftritt` nur unter `prefers-reduced-motion:
  no-preference`; Abbruch bei `scroll` und `pointerdown`; danach `Logo.bewegen()`; Merker gegen Wiederholung nach `render()`; erster
  Aufbau mit `.erstaufbau` (ohne `scr-in`). IntersectionObserver für das Schwingen der Modellkarte (I-7).

**H.3 Assets**

| Asset | Art, Maß | Quelle |
|---|---|---|
| `app-start.webp` | Foto 1120 × 1400, 178 KB; Schreibtisch und Telefon mit Pixeldichte 3 | vorhanden |
| `app-start-780.webp` | 780 × 975, ≤ 95 KB, für Telefon mit Pixeldichte 2 | vorhanden, lokal aus `app-start.webp` erzeugt (Weg nach docs/BILDER.md) |
| optional `app-start-1600.webp` | 1600 × 2000, ≤ 300 KB, für Schreibtisch mit Pixeldichte 2 (582 px CSS-Breite braucht 1164 px) | **beim Inhaber anfragen** (Flux, gleiche Szene, kein Text, kein Wasserzeichen); bis dahin genügt 1120 |

Kein Telefonzuschnitt nötig: Anders als in `he-01` liegt nichts über dem deckenden Foto, `object-position` reicht.
`srcset="…-780.webp 780w, ….webp 1120w"`, `sizes="(min-width: 1024px) 582px, (min-width: 640px) 640px, 100vw"`, `width`/`height`,
`fetchpriority="high"`; im Kopf von `web/app/index.html` `<link rel="preload" as="image" imagesrcset=… imagesizes=…>`.

**H.4 Leistung:** Heute entsteht das Startbild erst nach den synchronen Skripten am Ende von `web/app/index.html:87-92`; das Vorladen holt das
Foto parallel (Ziel LCP ≤ 2,5 s, R11). Bilder im ersten Bildschirm ≤ 180 KB. Mit den Chips entfällt eine Unschärfe-Ebene über dem Foto.
`mask-image` nie animiert; `will-change` nur während 900 ms; CLS ≤ 0,1 über feste Fotohöhe und reservierte Zeilen. Statisches Startbild
in der HTML-Datei bleibt eine spätere Option (Konflikt mit der Textfassung `.vorab`, Prüfsuite `:1595`, `:1599`).

**H.5 Barrierefreiheit:** DOM-Folge Eyebrow → h1 → Konditionsblock → Cream → Ring → Anmelde-Zeile → Foto (Lesefolge vor Stapelfolge, SG
B.2); Kontrast gegen die ungünstigste Auslaufstelle (Eyebrow 4,5:1, h1 3:1; geschätzt > 7:1); `--muted` auf Grund 5,8:1; Ziele ≥ 44 px;
`scroll-padding-top: 60px` unter dem App-Kopf; `forced-colors`: Konturen bleiben.

**H.6 Prüfsuite** (`scripts/pruefen.mjs`): `:1595` von `a[href$="/#fensterbauer"]` auf `a[href$="/fuer-fensterbauer/"]`; `:227` („Erstes Fenster
ausmessen“) und `:654` bleiben erfüllt; neu: bei 390 × 664 Cream-Unterkante ≤ 600 px und Konditionsblock darüber; kein `.einf-bar` auf `/app/`;
genau ein `.btn.primary` im ersten Bildschirm; keine Schriftgröße außerhalb 13 · 15 · 17 · 32 · 40.

## I. Conversion-Begründung

**Position und Gestaltung.** Das Startbild ist die letzte Stelle vor dem ersten Messschritt. Foto und h1 beantworten „Bin ich hier richtig?“
für Hauseigentümer; der Konditionsblock beantwortet „Was kostet es?“ und „Brauche ich ein Konto?“, bevor Aufwand entsteht (RE R13; EA H-02,
H-03, H-D11). Der Bestand nennt die Konto-Pflicht erst im Kaufablauf (CP 3, Hürden); der Block holt sie wortgleich mit `he-04` nach vorn. Die
Cream liegt im Daumenbereich direkt unter den Bedingungen; die Anmelde-Zeile bedient HE-7, ohne als dritter Handlungsaufruf zu wirken.

**Informationsmenge.** 37 Wörter, eine Haupt- und eine Nebenhandlung. Genauigkeit, Ablauf und Daten stehen darunter im App-Bestand und in der
Textfassung; weniger nähme H-03 aus dem ersten Bildschirm, mehr verdrängte die Cream aus den oberen 600 px.

**Verbindlich [V]:** E-1; Eyebrow und h1 wörtlich; eine Cream; nichts über dem Motiv; ein bewegter Träger; ruhige Fassung als Standbild;
Beträge nur aus `Abrechnung`; kein Countdown; keine fremden Server.

**Zu testen [H]** (keine Aussage über Wirkung auf Käufe)

| Nr. | Annahme | Prüfweg | Rückfall |
|---|---|---|---|
| H-ap01-1 | Die Konto-Zeile vor dem Start senkt Abbrüche an der Kasse, ohne Starts zu verhindern (EA H-D11) | eigene Tagessummen „App geöffnet → Kasse → gekauft“ vor und nach (wie `he-04` H4-H2) | Zeile 3 entfällt hier, bleibt in Textfassung und `he-04` |
| H-ap01-2 | Der statische Preis ersetzt das Band mit Restzeit, ohne den Start zu bremsen | Gespräche; Trichter (EA O-2) | Band oben ohne „Noch n Tage“, Foto 300 px |
| H-ap01-3 | „Führung starten“ ist ohne Erklärzeile verständlich | Lesetest | 13-px-Zeile „Zwei Minuten, ohne eigene Maße“ unter dem Ring |
| H-ap01-4 | Fensterbauer finden „Sie sind Fensterbauer?“ am Seitenende (IA-AB-4) | Gespräche mit Fensterbauern | Zeile 15 px `--muted` in der Bühne unter der Anmelde-Zeile |
| H-ap01-5 | Foto 360 px trägt die Wirkung; bei 664 stört das Ende am Ring nicht | Telefon-Video bei 844 und 664, Urteil des Inhabers | Foto 330 px, dann ragt die Anmelde-Zeile ins Bild |

**Freigaben:** **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:** Einführungsband in der App entfällt, Preis statisch im
Startbild (docs/ABRECHNUNG.md:11 „ganz oben ein schwarzes Band“; GEST:14 sinngemäß; Ausdehnung von IA-AB-6 auf `/app/`; Grund: R13 ohne
Countdown, DG T14); Eyebrow-Sperrung und h1 32 px (C.6); dazu IA-AB-4 (08 8.4.5). Selbst entschieden: I-1 bis I-7.

# Handlungsbaustein (nach „Kurz gesagt“ und am Ende)

Seite: Fachartikel und Ratgeber (Muster: 5 Fachartikel `/fuer-fensterbauer/<thema>/`, 23 Ratgeber `/ratgeber/<thema>/`, dazu „Selbst messen“ auf `/ratgeber/`) · Position: 2 (A-2, direkt nach „Kurz gesagt“) und 6 (A-6, nach „Weiterlesen“, vor „Quellen“) · Intensitätsstufe: 1 (Komponente K36 im Typ T13, Fließtext)

Kürzel wie in `he-07` (ZA = 08, EV = 07, DG = 02, EA = 04, IA = 05, SI = bestand/seiten-und-inhalte, SG/DNA-B = design-dna/04 und 05,
GEST, SKILL, DR). **[V]** verbindlich, **[H]** Hypothese. Lagen an einem Modell nachgemessen (echte Artikel, Inter aus `web/fonts/`,
Chromium bei 320–1280 px), nicht an Besuchern. `10-paketentscheidung.md` liegt nicht vor; der Baustein nennt keine Paketpreise.

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | Handlungsbaustein, `ar-02-handlungsbaustein`, zweimal je Artikel (ZA 8.3.5 A-2, A-6; IA K36) |
| Lage | A-2 zwischen „Kurz gesagt“ (`ar-01`) und „Auf dieser Seite“ (`ar-03`); A-6 zwischen „Weiterlesen“ (`ar-04`) und „Quellen“ (`ar-03`). Nachbarn haben Stufe 1–2; Rhythmus 2 · 1 · 1 |
| Ziel | Brücke vom Wissen zum Angebot: Fachartikel → Seite für Fensterbauer, Ratgeber → App, mit einem Ziel je Artikelart (ZA 8.3.5; IA 5.4.4 e) |
| Nutzerfrage | Fachartikel: „Gibt es dafür eine Lösung für meinen Betrieb?“ Ratgeber: „Kann ich das selbst messen?“ (ZA 8.3.5) |
| vorbereitete Entscheidung | Fachartikel: Seite für Fensterbauer öffnen (Weg FB-1, Z1a später; ZA 8.2.8). Ratgeber: Messen beginnen (Z2a); in „Prüfen“ nur Angebot für später (HE-1, U5) |
| bewusst nicht | Paketpreise (vorläufig, netto, nur für Unternehmer; die Zielseite zeigt das Preissignal in den oberen 600 px, EV E-1), zweiter Knopf, Führung, Bild, Eingabe (GEST:434), Countdown (RE R13) |

**Vier Fassungen aus einer Quelle [V]**

| Fassung | Seiten | Knopf | Ziel | Begründung |
|---|---|---|---|---|
| F | 4 Fachartikel (Erstaufmaß, Haftung, Aufmaß kostenpflichtig, geplatzter Termin) | Cream | `/fuer-fensterbauer/` (Seitenanfang) | W5: erst das Produkt, dann die Pakete |
| F-P | `/fuer-fensterbauer/fensterbau-software/` | Cream | `/fuer-fensterbauer/#pakete` | W5, Ausnahme: Leser vergleichen Software |
| R | 20 Ratgeber der Schritte 2–6 (`schrittVon(pfad) ≥ 1`) | Cream | `/app/#ausmessen` | EA 4.3.4/7 |
| R-P | 3 Ratgeber „Prüfen“ (Alter, beschlagen, undicht) | Ring | `/app/#ausmessen` | niedrige Absicht (EA 4.3.4/7, HE-1) |

**Festlegung ar-02 zu IA-O-7:** Alle App-Knöpfe der Ratgeber zielen auf `/app/#ausmessen`. Kopf (`rh-01`) und Abschluss `he-07` nutzen dasselbe
Ziel. Die App setzt dort ein angefangenes Fenster fort (`web/assets/app.js:6560-6618`). Weil `#ausmessen` das Startbild der App mit dem Preis
überspringt, steht der Preis im Baustein (RE R13). Rückfall: `/app/` (H-AR2-2).

## B. Konkreter Inhalt

| Element | F, F-P | R | R-P | Fundstelle |
|---|---|---|---|---|
| Haarlinie | 1 px `--line` | gleich | gleich | DG G2; Ratgeber tragen nur die Haarlinie, keine Nummer (DG 2.3.17/1) |
| Kicker 13, grün | „Eigener Fenster-Konfigurator“ | „Selbst messen“ | „Selbst messen“ | Kurzname von `/fuer-fensterbauer/` (`scripts/ratgeber-bausteine.mjs:42`); h2 `web/ratgeber/index.html:103` |
| Satz 17 | **Textentwurf** „**Ihre Kunden planen unter Ihrer Domain.** Jede Anfrage kommt als Aufmaßblatt-PDF in Ihr Postfach.“ | **Textentwurf** „**Mit der App**, jeder Schritt erklärt: zwei Fotos und die Maße mit dem Zollstock.“ | **Textentwurf** „**Wenn es neue Fenster werden**, misst du sie mit der App aus, jeder Schritt erklärt.“ | Domain in allen Paketen (`web/assets/pakete.js:45`, `:53`, `:61`); Postfach `pakete.js:76`; „Zwei Fotos und die Maße mit dem Zollstock, jeder Schritt erklärt“ `web/index.html:57` |
| Preiszeile 13 | – | **Textentwurf**, wortgleich mit H1/H7: „Messen **kostenlos**, ohne Konto“ / „Aufmaßblatt **7,99 €** bis 17.11.2026, danach 12,99 €“ | gleich | `web/index.html:60-61`; `web/config.js:12-14`; `he-07` B |
| Knopf | F: **Textentwurf** „Konfigurator für Fensterbauer“; F-P: „Pakete ansehen“ | „Fenster ausmessen“ | „Fenster ausmessen“ (Ring, ohne Pfeil) | IA 5.4.4 e; `web/fuer-fensterbauer/index.html:63`; Kopf `rh-01` B |
| Zustand „angefangen“ | – | „Aufmaß fortsetzen“ → `/app/` | gleich | `appEinstieg()`, `eigenesAufmass()` (`web/assets/portal.js:16-20`) |

Rund 25 Wörter je Block. Anrede: Fachartikel Sie, Ratgeber du (SI 3.8). Nach dem 17.11.2026 entfernt der Server den Zusatz und setzt
12,99 € ein (`functions/seo.js:139-147`), die Zeile heißt dann „Aufmaßblatt **12,99 €**“.

**Abweichungen von ZA, begründet.** (1) Der IA-Satz „Ihr eigener Fenster-Konfigurator: Ihre Kunden planen unter Ihrer Domain, Sie
bekommen jede Anfrage als Aufmaßblatt-PDF.“ läuft bei 358 px über vier Zeilen (Modell), G2 erlaubt drei; der Produktname wandert in den
Kicker. (2) Preiszeile zusätzlich zu „Satz und Knopf“ wegen R13 (A). (3) Kicker, weil der Bildschirm um den Baustein im Fachartikel sonst
0,0 % Farbe hat, mit ihm 0,4 % (`farbanteil.py`; G8: > 0,3 %); Vorbild ist der grüne Eyebrow in „Gut zu wissen“ (`ratgeber.css:85`).

**Interaktion:** ein Link je Block; bei angefangenem Aufmaß tauscht `Kopf.auf` Text und Ziel.

**Entfällt:** der erste `.rg-cta` aller 28 Artikel samt Zweitknöpfen („Führung in zwei Minuten“, „Anleitung: Fenster ausmessen“,
Sprünge wie `#bestimmen`, die das Inhaltsverzeichnis darunter abdeckt); in Fachartikeln auch die Zwischenknöpfe (ZA 8.4.3).

**Nutzbar vorhanden:** `.btn`, `.btn.primary`, `.btn.ghost`, `.pf` (`web/assets/gemeinsam.css:56-76`), `.eyebrow.kicker` (`:44-46`),
Tokens (`:9-32`), Generator `scripts/ratgeber-bausteine.mjs`, Stichtagslogik `functions/seo.js`.

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Linksbündiger Stapel ohne Kartenfläche unter einer Haarlinie: Kicker → Satz → (Preiszeile) → Pille (G2 ohne Held;
DG-E-1 Fassung C, Hierarchie über Gewicht und Tonwert). Ohne Fläche, weil darüber „Kurz gesagt“ und darunter „Auf dieser Seite“ Karten
sind; drei Karten untereinander wären ein Feld gleichrangiger Flächen (SG 10.10 Nr. 11). Takt: Karte · offen · Karte. Asymmetrisch auf
der Ordnungslinie (G5), rechts bleibt Luft.

**Telefon 390 × 844, 4 Spalten à 77,5 px, Fuge 16, alle Elemente über 4 Spalten (x 16–374)**

| y im Block | R / R-P | F / F-P |
|---|---|---|
| 0 | Haarlinie 358 × 1 | gleich |
| 17–34 | Kicker, eine Zeile | gleich |
| 42–93 | Satz, 2 Zeilen à 25,5 | 42–119: 3 Zeilen |
| 101–137 | Preiszeile, 2 Zeilen à 18 | – |
| 153–205 | Pille 358 × 52 | 135–187 |
| Höhe | 205 px = 0,24 BH; mit 2 × 32 px Rand 0,32 BH | 186 px = 0,22 BH |

Lage im Artikel (Ratgeber „Fenster ausmessen“): „Kurz gesagt“ endet bei y 696, Haarlinie 728, Pille 881–933, Inhaltsverzeichnis ab 965;
Fachartikel „Erstaufmaß“: Haarlinie 861, Pille 996–1048. A-2 liegt am Übergang zum zweiten Bildschirm, gewollt: Antwort zuerst (ZA A-1).

**Verhältnisse (R, 390, mit Rand).** Text 39 %, Pille 19 %, Bild 0 %, Freiraum 42 %. Hierarchie: Pille (Cream 358 × 52, ≈ 5,7 % des
Bildschirms) > fetter Satzanfang (17/700 `--text`) > Satzrest (17/500 `--text2`) > Kicker (13/800 Versal, grün) > Preiszeile (13/500
`--muted`, Beträge 700 `--text`). Zwei Schriftgrößen, eine Formfamilie (Vollrundung plus radienlose Linie).

**Ebenen [V].** Z 0 Grund `#161616` → Z 30 Bedienschicht (alle Elemente) → Z 40 Kopf (klebt, opak). Interaktiv ist nur die Pille; beim
Lesen liegt sie im unteren Drittel, im Daumenbereich.

**Schreibtisch 1280 × 800.** Artikelspalte 788 px (x 246–1034), 12 Spalten à 43,7 px, Fuge 24. Haarlinie über 12 Spalten; Kicker, Satz,
Preiszeile über Spalte 1–8 (517 px ≈ 60 Zeichen); Pille in eigener Breite ab Spalte 1; Spalte 9–12 frei. Lagen R: Haarlinie 502, Satz
544–595, Preis 603–639, Pille 663–715 (237 × 52), Inhaltsverzeichnis ab 755, also im ersten Bildschirm. F: Pille 323 × 52, Block 169 px.
Text : Pille : Freiraum ≈ 23 : 5 : 72.

**Technische Startwerte**

| Wert | Startwert | Begründung |
|---|---|---|
| Außenabstand | 32 px, ab 1024 40 px (fällt mit den Rändern der Nachbarn zusammen) | wie h2 im Artikel (`ratgeber.css:21`, `:163`); DG G6 (96/128) würde die Handlung von ihrer Antwort lösen: **funktional begründete Abweichung von DG G6** |
| Innen | Haarlinie → Kicker 16, Kicker → Satz → Preis 8/8, → Pille 16 (ab 1024: 24) | G2, G6 (1 : 3) |
| Satz | 17/1,5, `max-width: 517px`, `text-wrap: pretty`; ≤ 3 Zeilen ab 328 px | G2; DNA-B B.3.6; gemessen |
| Preiszeile | 13 px, Zeilenhöhe 18, zwei Zeilen | wie H1/H7; bei 15 px bricht Zeile 2 schon bei 358 px um (DG-E-6) |
| Pille | 52 px, Polster 10 × 22, Telefon 100 %, ab 640 eigene Breite, `white-space: normal` | bei 320 px liefe „Konfigurator für Fensterbauer“ 3 px über; bei 200 % Zoom zweizeilig statt abgeschnitten |
| Ring (R-P) | Kontur 2 px `--muted` (5,8 : 1) statt `--line2` (1,6 : 1) | DG-E-10 |

## D. Anwendung der Design-DNA

Ansichtstyp Arbeitsansicht (DNA-B B.1). Pflicht sind Regel 3, 7–12, die Linie aus 4 und kein tragender Schatten. Variable Merkmale stehen
auf Stufe 1. Es gibt keine Signature (ZA 8.3.11 „Ratgeber, Fachartikel: sonst 1“).

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | eine Ebene; nur der klebende Kopf überdeckt beim Scrollen | 0 | Ruhe neben Lesetext |
| Material, Transparenz | keines, keine Fläche | 0 | hebt sich von den Karten ober- und unterhalb ab |
| Licht, Schatten | keines (DG-AB-1) | 0 | – |
| Formen | Pille in Vollrundung, Haarlinie radienlos | 1 | eine Formfamilie (B.1/8) |
| 3-D, Bildintegration, Überlagerung, Perspektive | keine | 0 | Stufe 1 hat 0–20 % Bild; hier 0 |
| Oberflächendetails | Haarlinie, Pfeil im Kreis auf der Cream (B.3.7), gleich breite Ziffern im Preis | 1 | Präzision statt Schmuck |
| Typografie | Lesestimme 17 mit fettem Anfang in `--text` (DR 3.2), Kicker als einziges Signal | 2 | Satzanfang beantwortet die Nutzerfrage in drei bis fünf Wörtern |
| Animation | keine (GEST:426) | 0 | siehe F |
| interaktive Effekte | Zustände über Füllung und Kontur | 1 | Rückmeldung ohne Bewegung |

**Bewusst weggelassen:** Kartenfläche, Bild (Variante nur als H-AR2-6), Maßlinie, Glas, Licht, Auftritt beim Scrollen, Hover-Wanderpfeil,
Skalieren beim Drücken (B.3.7 „zerstört durch“), zweiter Aufruf, Abschnittsnummer, h2 (der Kicker ist ein `p`, damit das generierte
Inhaltsverzeichnis keinen Eintrag bekommt).

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Einstieg:** der grüne Kicker, einziges farbiges Element um A-2; er markiert die Stelle als Angebot.
2. **Primärer Fokus:** die Cream-Pille, hellste und größte Bedienfläche (Fläche und Schrift je 15,9 : 1 gegen den Grund).
3. **Sekundärer Fokus:** der fette Satzanfang (16,2 : 1); Satzrest `--text2` 10,8 : 1.
4. **Gestreift:** die Preiszeile (`--muted` 5,8 : 1, Beträge in `--text`) auf dem Weg zur Pille.

R-P: Der Ring nimmt Gewicht heraus, der fette Satzanfang wird Primärfokus; danach zieht der grüne Eintrag „Dein Weg: Schritt 1 von 6“ im
Inhaltsverzeichnis zum Weg (gewollt, U5).

**Ablenkungen und Gegenmittel.** Der Kopfknopf (Cream, gleiches Ziel) schaltet auf Ring, solange die Pille im Bild ist (`data-kopf-cream`,
`rh-01`); im Fachartikel ist er immer Ring. „Kurz gesagt“ trennen 32 px Luft und die Haarlinie; das Inhaltsverzeichnis darunter liegt
tonal unter der Pille. Am Ende steht die Cream-Kachel „Du bist hier“ des Wegs (`ratgeber.css:115`) nur 536 px (1280) bzw. 761 px
(RAL-Montage, 390) über der Pille, also im selben Bildschirm: Bedingung an `ar-04` in H.

**Übergang:** A-2 → Inhaltsverzeichnis (Weiterlesen als gleichwertige zweite Wahl); A-6 → „Quellen“. Nichts zeigt zurück nach oben.

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Scrollen, Erscheinen | natives Scrollen, kein Auftritt, kein Scrollbezug | – | T13 „keine“; EV E-13; GEST:426 |
| Hover (`hover: hover`) | Cream `--primary` → `--primary-hover`; Ring-Kontur `--muted` → `--text` | 150 ms (`--t1`), `--e-out` | Zustand über Füllung bzw. Kontur (G1) |
| Drücken | Cream bleibt `--primary-hover`, Ring füllt `--surface2`; `transform: none` gegen `gemeinsam.css:65` | sofort | formstabile Bedienschicht (SG 10.7/3) |
| Fokus | 2 px `--ink`, Abstand 2 px (`gemeinsam.css:38`) | sofort | ≥ 3 : 1 |
| Klick | Seitenwechsel ohne Übergang; `#pakete` springt auf der Zielseite mit `scroll-padding-top` unter den Kopf | – | gleiche Herkunft |
| angefangenes Aufmaß | Text und `href` werden vor dem ersten Zeichnen getauscht (Skript `defer`); am Telefon ändert sich keine Höhe | – | wie Kopf und H7 |
| weniger Bewegung | identisch | – | ruhige Fassung = Endbild |

Zum Wunsch nach Tiefe und Physik (SKILL:43): Ratgeber sind Leseflächen der Stufe 1. Bewegung tragen dort Kopf und App, nicht der Text.

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Komposition nach C; bei 390 × 664 liegt A-2 ganz im zweiten Bildschirm. 360 px: Satz R 2, R-P 3 (Block
230), F 3 Zeilen. 320 px: Kicker F und Pille F zweizeilig (63 px), Preiszeile dreizeilig; Block R 248, F 203; kein Querscrollen durch den
Baustein (das heutige bei 320 px kommt vom Kopf, `rh-01`). 200 % Zoom: alles bricht um, nichts wird abgeschnitten.

**640–1023 px.** Spalte wächst bis 788 px; ab 640 px eigene Pillenbreite, Satz endet bei 517 px.

**Schreibtisch 1280.** Wie C: Satz zweizeilig, Pille links, rechtes Drittel frei; Größen 17/13, nichts überdimensioniert.

**Schreibtisch 1024.** Spalte x 118–906, gemessen identisch mit 1280 (Zeilen, Höhen); Außenabstand 40 px.

## H. Technische Umsetzung

**Bestehend:** `scripts/ratgeber-bausteine.mjs` (Generator, idempotent; Prüfsuite Abschnitt 10 vergleicht), `web/assets/ratgeber.css`,
`web/assets/gemeinsam.css`, `functions/seo.js:139-147` (Stichtag), `web/config.js:12-14` (Preis, Einführung).

**Neu im Generator**

1. Preis und Stichtag aus `web/config.js` lesen (wie `scripts/pruefen.mjs:1681`); der Zusatz steht in `<span class="einf">`.
2. `HANDLUNG` mit den Texten der vier Fassungen; `variante(pfad)`: `fensterbau-software` → F-P, übrige `/fuer-fensterbauer/…/` → F,
   `schrittVon(pfad) === 0` → R-P, sonst R; `/ratgeber/` → R ohne Kicker, ein Block unter der bestehenden h2 „Selbst messen“.
3. `baue()`: Blöcke zwischen `<!--handlung oben|ende-->` und `<!--/handlung-->` entfernen; beim ersten Lauf den ersten `.rg-cta`
   entfernen, in Fachartikeln alle. A-2 nach `<div class="rg-kurz">…</div>`, A-6 vor `<h2 id="quellen">` einsetzen (alle 28 Artikel haben
   beide). „Auf dieser Seite“ folgt auf A-2 (heute auf den ersten `.rg-cta`, `:148`). `pfeil()` bleibt für das Startbild von
   `/fuer-fensterbauer/`; dessen `.rg-cta` und `scripts/pruefen.mjs:175` sind nicht betroffen.

**Markup (Fassung R, Lesefolge = DOM-Folge)**

```html
<!--handlung oben-->
<div class="rg-handlung" data-variante="r" data-lage="oben">
  <p class="eyebrow kicker">Selbst messen</p>
  <p class="satz"><b>Mit der App</b>, jeder Schritt erklärt: zwei Fotos und die Maße mit dem Zollstock.</p>
  <p class="preis"><span>Messen <b>kostenlos</b>, ohne Konto</span><span>Aufmaßblatt <b>7,99&nbsp;€</b><span class="einf"> bis 17.11.2026, danach 12,99&nbsp;€</span></span></p>
  <a class="btn primary" href="/app/#ausmessen" data-kopf-cream data-fortsetzen>Fenster ausmessen<span class="pf" aria-hidden="true"></span></a>
</div>
<!--/handlung-->
```

R-P: `class="btn ghost"`, ohne `.pf` und ohne `data-kopf-cream`. F/F-P: ohne Preiszeile und ohne `data-fortsetzen`. Kein `id` am Block, kein
Landmark.

**CSS (in `ratgeber.css`, ersetzt dort für Artikel die Rolle von `.rg-cta`)**

```css
.rg-handlung { margin: 32px 0; padding-top: 16px; border-top: 1px solid var(--line) }
.rg .rg-handlung p { margin: 0; max-width: 517px }
.rg .rg-handlung .kicker { margin: 0 0 8px }
.rg .rg-handlung .satz { font-size: 17px; line-height: 1.5; color: var(--text2); text-wrap: pretty }
.rg .rg-handlung .satz b { color: var(--text); font-weight: 700 }
.rg .rg-handlung .preis { margin-top: 8px; font-size: 13px; line-height: 18px; color: var(--muted) }
.rg .rg-handlung .preis > span { display: block }
.rg .rg-handlung .preis b { color: var(--text); font-weight: 700; font-variant-numeric: tabular-nums }
.rg .rg-handlung .btn { margin-top: 16px; width: 100%; padding: 10px 22px; white-space: normal; text-wrap: balance; line-height: 1.25;
  text-decoration: none; transition: background var(--t1) var(--e-out), box-shadow var(--t1) var(--e-out) }
.rg .rg-handlung .btn.primary { color: var(--on-primary) }
.rg .rg-handlung .btn.ghost { color: var(--text); box-shadow: inset 0 0 0 2px var(--muted) }
.rg .rg-handlung .btn:active { transform: none }
.rg .rg-handlung .btn.primary:active { background: var(--primary-hover) }
.rg .rg-handlung .btn.ghost:active { background: var(--surface2) }
@media (hover: hover) { .rg .rg-handlung .btn.ghost:hover { box-shadow: inset 0 0 0 2px var(--text) } }
@media (min-width: 640px) { .rg .rg-handlung .btn { width: auto } }
@media (min-width: 1024px) { .rg-handlung { margin: 40px 0 } .rg .rg-handlung .btn { margin-top: 24px } }
@media (forced-colors: active) { .rg-handlung .btn { border: 2px solid ButtonText } }
@media print { .rg-handlung { display: none } }
```

**Skript:** kein eigenes. `Kopf.auf` (`rh-01`, `web/assets/kopf.js`) beobachtet `[data-kopf-cream]` (IntersectionObserver) für Cream ↔
Ring im Kopf und tauscht `[data-fortsetzen]` auf „Aufmaß fortsetzen“ → `/app/`, wenn `eigenesAufmass()` > 0 (nach `gemeinsam.js`
verlegt, `rh-01` H.6).

**Prüfsuite (`scripts/pruefen.mjs`):** `.rg-handlung a` in die Zielprüfung `:1610`. Neu: genau zwei `.rg-handlung` je Artikel an den
genannten Stellen; in `main` der Ratgeber kein `href="/app/"`; Fachartikel ohne `.rg-cta`; F-P → `#pakete`; R-P mit `.btn.ghost`; bei
390 × 844 und 1280 × 800 zwei Cream-Flächen in `main` mindestens eine Bildschirmhöhe auseinander. Die Stichtagsprüfung greift über die
Preiszeile von selbst.

**Schnittstellen**

- `ar-01`: empfohlene Folge h1 → Zeichnung → „Kurz gesagt“ → A-2 (G2: Handlung zuletzt); A-2 folgt in jedem Fall direkt auf „Kurz gesagt“.
- `ar-03`: Zwischenknöpfe der Ratgeber bleiben, mit Ziel `/app/#ausmessen` und als Ring (Festlegung ar-02: Cream nur in A-2/A-6).
  Rückfall: Cream, wo ≥ 844 px zur nächsten Cream bleiben.
- `ar-04`: Kachel „Du bist hier“ als `--surface` mit 2-px-Ring `--text` und grünem „Du bist hier“ statt Cream-Fläche; Karte „Alles
  geplant?“ → `/app/#ausmessen` (`ratgeber-bausteine.mjs:125`). **Abweichung von bestehender Gestaltung (ratgeber.css:115, keine Regel in
  GEST) – Freigabe durch den Inhaber nötig.** Rückfall: A-6 in Ratgebern als Ring.
- Einführungsband (`functions/seo.js:169`, bis 17.11.2026): Ziel ebenfalls `/app/#ausmessen`.

**Assets:** keine. Nur Variante H-AR2-6 bräuchte Ausschnitte aus vorhandenen Fotos (`fb-sessel.webp`, `start-hauseigentuemer.webp`),
je 144 × 144 WebP für 72 CSS-px über `scripts/fotos.py`; beim Inhaber ist nichts anzufragen.

**Animation, Leistung:** CSS-Übergang 150 ms, Technikstufe „Leicht“ (SKILL:56); ≈ 0,5 KB HTML je Block, ≈ 1 KB CSS, kein Bild, kein
eigenes Skript, CLS 0.

**Barrierefreiheit:** Lesefolge Kicker → Satz → Preis → Link; Linktexte allein verständlich, gleiche Texte mit gleichen Zielen (WCAG
2.4.4, 3.2.4); Ziele 52 px; Kontraste wie in E; ohne JavaScript vollständig; im Druck ausgeblendet.

## I. Conversion-Begründung

**Position.** A-2 steht dort, wo die Frage beantwortet ist („Kurz gesagt“) und bevor 5–10 Bildschirme Fließtext beginnen. Wer nur die
Antwort wollte, sieht den nächsten Schritt, bevor er geht. A-6 fängt alle ab, die bis zum Ende gelesen haben, also die mit der meisten
Information (EA 4.3.4/7; ZA A-6). Dazwischen liegt kein weiterer Cream-Aufruf; so bleibt es bei einer klaren Handlung je Lesephase.

**Gestaltung.** Der fette Satzanfang antwortet in drei bis fünf Wörtern auf die Nutzerfrage. Die Preiszeile nimmt die Preisfrage vorweg,
bevor die App ohne eigenes Startbild direkt mit dem Messen beginnt (R13). Ein Ziel je Artikelart beendet die heutige Streuung (`/app/`,
`/app/#ausmessen`, Anker, Nachbarartikel; CP 3, SI 3.8).

**Informationsmenge.** Rund 25 Wörter. Der Artikel liefert das Argument, der Baustein nur den Übergang. Ein zweiter Knopf würde die
Entscheidung wieder öffnen; Weiterlesen bleibt über das Inhaltsverzeichnis direkt darunter möglich.

**Beitrag zur Zielhandlung:** FB-1 → Seite für Fensterbauer (Weg zu Z1a), FB-2 → `#pakete`, HE-2 bis HE-4 → Z2a, HE-1 → späterer
Wiedereinstieg über den Weg.

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| H-AR2-1 | Ein Satz mit Knopf führt mehr Fachartikel-Leser zur Seite für Fensterbauer als heute zwei Knöpfe ohne Satz | Aufrufe von `/fuer-fensterbauer/` aus Fachartikeln. Heute zählt die Statistik interne Herkunft nicht (`functions/api/statistik.js:149`); möglich wäre ein Zähler `?von=artikel-oben|-ende` nach dem Muster von `?von=pdf` (`:142`), Entscheidung des Inhabers (EA O-2) | heutiger Doppelknopf |
| H-AR2-2 | Leser, die mit sichtbarem Preis direkt in den ersten Messschritt springen, brechen nicht häufiger ab als über das App-Startbild | Vorgänge „Kasse geöffnet“ je Woche vorher und nachher | Ziel `/app/` |
| H-AR2-3 | Der Ring in „Prüfen“ wirkt nicht aufdringlich und kostet keine späteren Starts | Lesetest, Urteil des Inhabers | Cream wie R oder Ziel `/app/#fuehrung` |
| H-AR2-4 | Ein einheitlicher Satz trägt so gut wie themenbezogene Knopftexte („Öffnungsart am 3-D-Modell wählen“) | Lesetest | dritte Spalte in `SEITEN_INFO` für einen eigenen Satz (≤ 20 Wörter, belegt) |
| H-AR2-5 | Der grüne Kicker wird als Angebot gelesen, nicht als Teil des Artikels | Lesetest | Kicker **Textentwurf** „In eigener Sache“ |
| H-AR2-6 | Ein Bildausschnitt des Ziels (72 × 72, Radius 12, links neben dem Kicker) erhöht die Wiedererkennung auf der Zielseite | Telefon-Video, Urteil des Inhabers | ohne Bild (Grundfassung) |

**Freigaben und offene Punkte**

- Kicker, geänderter Fachartikel-Satz und Preiszeile sind Textentwürfe gegen den Wortlaut von ZA/IA; sie brauchen die Freigabe des Inhabers.
- `ar-04`, Cream-Kachel: **Abweichung von bestehender Gestaltung – Freigabe durch den Inhaber nötig** (siehe H).
- Ohne Freigabe, funktional begründet: Außenabstand 32/40 statt DG G6; Drücken ohne `scale(.98)`; Ring-Kontur `--muted` (DG-E-10).
- Offen: Preiszeile 13 oder 15 px (DG-E-6; bei 15 px bricht Zeile 2 bei 390 px um); Text „Aufmaß fortsetzen“ hängt an `rh-01` H.6.

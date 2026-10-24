# Artikelkopf

Seite: Fachartikel und Ratgeber (Muster für 23 Ratgeber und 5 Fachartikel) · Position: 1 (A-1, direkt unter dem Kopf `rh-01`, vor `ar-02-handlungsbaustein`) · Intensitätsstufe: 2 klar (Typ T13 Kopf; SG-Ansichtstyp Arbeitsansicht mit Fixationsanker)

ID `ar-01-artikelkopf`, Phase I, Stand 24.10.2026; das Repository wurde nur gelesen. Kürzel wie in
[08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu SG = `docs/design-dna/04-styleguide.md`, DNA-B = `…/05-ergebnis-b-styleguide.md`,
DR = `.claude/skills/premium-gestaltung/designrichtung.md`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Textentwurf** braucht
Freigabe, **Festlegung I** = Entscheidung dieses Dokuments. Lagen in CSS-px, geplant, nicht gemessen. `10-paketentscheidung.md` berührt den
Abschnitt nicht (keine Pakete, keine Preise). Referenzartikel: `/ratgeber/fenster-ausmessen/` (h1 56 Zeichen, Zeichnung 480 × 400,
„Kurz gesagt“ 476 Zeichen).

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | Artikelkopf, `ar-01-artikelkopf` (Z 8.3.5, Zeile A-1) |
| Lage | Erster Abschnitt jedes Artikels. Davor nur der Kopf (`rh-01`, 56/64 px, opak) und auf Ratgebern bis 17.11.2026 das Einführungsband (`functions/seo.js:160-171`). Danach `ar-02` (Handlungsbaustein 1), dann `ar-03` (Inhaltsverzeichnis, Fließtext). Rhythmus Kopf **2** → 1 → 1 (DG 2.3.18) |
| Gewicht | Telefon ≈ 0,95–1,4 Bildschirmhöhen (BH), Referenz 1,11 BH (Z: ≈ 1 BH); Schreibtisch 1280 × 800 ≈ 0,67 BH |
| Ziel | Antwort zuerst: Der Besucher sieht in Sekunden, dass die Seite seine Frage behandelt, und hat die Antwort als Bild und in drei bis fünf Sätzen |
| Nutzerfrage | „Steht hier die Antwort auf meine Frage?“ (Z 8.3.5) |
| Gruppen | Ratgeber: HE-1 bis HE-4 aus der Suche (EA :145–148), Anrede du. Fachartikel: FB-1 (Fachfrage), beim Artikel „Fensterbau-Software“ FB-2 (Z :450–451), Anrede Sie |
| vorbereitete Entscheidung | weiterlesen statt zur Suche zurück (U5, EA :86); unmittelbar danach die Brücke in `ar-02` (App bzw. Seite für Fensterbauer) |
| ausdrücklich nicht | keine Handlung, keine Cream, keine Bewegung, keine Signature (Z 8.3.5), kein Inhaltsverzeichnis im Kopf, kein Platzhalter |

## B. Konkreter Inhalt

### B.1 Verwendete Bestandsinformationen

| Element | Inhalt | Fundstelle |
|---|---|---|
| Brotkrumen | „Startseite › Ratgeber › {Kurzname}“ bzw. „Startseite › Für Fensterbauer › {Kurzname}“; JSON-LD `BreadcrumbList` bleibt | `web/ratgeber/fenster-ausmessen/index.html:46`, `:36`; `web/fuer-fensterbauer/erstaufmass-feinaufmass/index.html:40`; Kurznamen `scripts/ratgeber-bausteine.mjs:19-48` |
| Eyebrow | „Ratgeber · Stand 21. Oktober 2026“ bzw. „Für Fensterbauer · Stand 23. Oktober 2026“ | `…/fenster-ausmessen/index.html:47`; `…/erstaufmass-feinaufmass/index.html:41`; Datum = `dateModified` im JSON-LD (`:27`) = Zeile „Stand“ am Artikelende |
| h1 | Wortlaut je Artikel, 34–71 Zeichen; letztes Wort grün | `:48`; Generator `gruenesWort` (`ratgeber-bausteine.mjs:104-107`); Längen gemessen an allen 28 Dateien |
| führende Zeichnung | je Artikel genau eine SVG in `web/bilder/`, 480 breit, 330–440 hoch, 1,6–5,1 KB, weißer Grund im Bild, Beschriftung ≥ 18 Einheiten; mit `alt` (≥ 40 Zeichen) und Unterschrift | `:55`; Tabelle SI 3.8; GEST:433 |
| Kurz gesagt | 65–115 Wörter (391–724 Zeichen); jede Fassung endet mit „Unten: …“ als Vorschau | `:49-52`; gemessen an allen 28 Dateien |

### B.2 Texte

Alle Texte bleiben wörtlich, mit zwei Ausnahmen:

| Stelle | heute | neu | Grund |
|---|---|---|---|
| „Kurz gesagt“, `/ratgeber/fenster-ausmessen/` | „Unten: die sechs Messpunkte als Skizze, ein durchgerechnetes Beispiel und die fünf typischen Fehler, die ein Angebot verfälschen.“ | **Textentwurf** „Unten: ein durchgerechnetes Beispiel und die fünf typischen Fehler, die ein Angebot verfälschen.“ | Die Skizze steht künftig über dem Satz. Kein anderer der 28 Texte verweist auf die Zeichnung (geprüft) |
| Unterschrift, `/ratgeber/aufmassblatt-fenster/` | „Je Fenster ein Blatt: Skizze, zwei Fotos, drei Breiten, drei Höhen.“ | **Textentwurf** „Beispiel · je Fenster ein Blatt: Skizze, zwei Fotos, drei Breiten, drei Höhen.“ | Die Zeichnung zeigt erfundene Maße (1.232 · 1.230 · 1.229 mm) ohne Kennzeichnung; als Held gilt DG G7 [V]. `geplatzter-termin.svg` („Beispiel: …“) und `angebote-vergleichen.svg` („(Beispiel)“ im Bild) sind schon gekennzeichnet |

**Hinweis an den Inhaber, keine Änderung:** Vier Titel mit 67–71 Zeichen (`aufmass-kostenpflichtig`, `uw-wert-fenster`,
`fenstertausch-altbau`, `fensterbau-software`) brechen am Telefon wie heute auf vier Zeilen (SG 10.9 erlaubt bei Titeln bis fünf, DR:98
nennt drei). Kürzen wäre eine redaktionelle Entscheidung, auch wegen der Suche.

### B.3 Interaktionen und Bausteine

Zwei Ziele: die Elternglieder der Brotkrumen. Die Zeichnung ist kein Ziel; Zoomen mit zwei Fingern bleibt möglich
(`…/fenster-ausmessen/index.html:5`). Kein JavaScript. Bausteine: `nav.rg-pfad` (`rh-03`), `.eyebrow.kicker`, `.ak`
(`web/assets/gemeinsam.css:45-47`), `figure.rg-bild` (`web/assets/ratgeber.css:78-80`), `.rg-kurz` (`:43-46`), Generator (H).

## C. Exakte Layoutkomposition

**Grundstruktur.** Satzbau nach DG G2 [V]: Kopf (Brotkrumen, Eyebrow, h1) → Held (Zeichnung) → Lesestapel („Kurz gesagt“). Die Handlung
folgt in `ar-02`. Z verlangt `ar-02` „direkt nach ‚Kurz gesagt‘“; die Zeichnung steht deshalb davor (Telefon) oder daneben (Schreibtisch),
nie zwischen Antwort und Handlungsbaustein. **Festlegung I:** DOM-Folge = Folge am Telefon (Eyebrow, h1, Zeichnung, „Kurz gesagt“).
Linksbündig an der Ordnungslinie (G5), asymmetrisch mit Flatterrand; am Telefon eine Spalte, am Schreibtisch Text links, Blatt rechts.

**Der Held** ist die führende Zeichnung als weißes Blatt: Papierweiß `--papier` (`#ffffff`, 11.4.1) ist der einzige Fokusreiz (G3). Die Blattkante ist die
Objektkante, ohne Ring oder Rahmen; kein gerahmtes Bild neben Text (SG 10.6/1), sondern ein Gegenstand auf dem Grund wie in `he-02`.

### C.1 Telefon 390 × 844 (4 Spalten à 77,5 px, Abstand 16, Rand 16; alles über Spalten 1–4, x 16–374)

| y (Seite) | Element | Maß | Satz |
|---|---|---|---|
| 0–56 | Kopf `rh-01` | opak, Haarlinie unten | – |
| 60–104 | Brotkrumen | Zeile 44, Text bei 74–90 | 13/16 (Technikstimme einzeilig, K-19), 600; Links `--muted`, Trenner „›“ `--line2` |
| 112–128 | Eyebrow | eine Zeile (Fachartikel: zwei à 18, Umbruch nach „·“; alles darunter rückt um 20 px) | Technikstimme Versal 13/16, zweizeilig 13/18 (K-19), 600, +0,12 em, `--accent`; Datum in eigener Schreibweise +0,02 em, `tabular-nums` (DR:100) |
| 140–241 | h1 | 3 Zeilen à 33,6 (2–4 je Titel) | Bühnenstimme 32/1,05, 800, −0,03 em, `text-wrap: balance`; letztes Wort `--accent` |
| 265–563 | Blatt (Held) | 358 × 298 (je Zeichnung 246–328), Radius 24 (auf allen Breiten, K-22) | `--papier` (`#ffffff`), keine Kontur, kein Schatten |
| 571–615 | Unterschrift | 1–2 Zeilen à 22 | Nebentext 15/22, 500, `--muted` |
| 639–655 | „KURZ GESAGT“ | eine Zeile | Technikstimme Versal 13/16, `--muted` |
| 663–987 | Antwort | 12 Zeilen à 27 (10–18 je Artikel), 358 breit, ≈ 42 Zeichen je Zeile | Fließtext lang 17/27 (K-19), 500, `--text2`; `strong` in `--text`, 700 |
| ab 1.019 | `ar-02` | Abstand 32, Haarlinie (Festlegung in `ar-02`) | – |

Bei 664 px realer Höhe sind Blatt, Unterschrift und „KURZ GESAGT“ vollständig im Bild, die Antwort schneidet an (Fortsetzungssignal, DG
2.3.17/2). Bei 844 px stehen sechs Zeilen der Antwort im Bild. Mit vierzeiligem Titel und der höchsten Zeichnung (440) endet das Blatt bei
y 627, also ebenfalls im ersten Bildschirm.

### C.2 Schreibtisch 1280 × 800 (Spalte 1040, x 120–1160; 12 Spalten à 64,67, Abstand 24)

| y | Element | Spalten, x | Satz |
|---|---|---|---|
| 0–64 | Kopf `rh-01` | 1–12 | – |
| 72–116 | Brotkrumen | ab 1, x 120 | wie Telefon, ganzer Pfad |
| 140–156 | Eyebrow | 1–6, x 120–628 | wie Telefon, einzeilig 13/16 |
| 168–294 | h1 | 1–6 | 40/1,05; 3 Zeilen bei ≈ 25 Zeichen je Zeile |
| 318–334 | „KURZ GESAGT“ | 1–6 | 13/16 |
| 342–585 | Antwort | 1–6, 508 px, ≈ 60 Zeichen je Zeile | 9 Zeilen à 27 (17/27) |
| 140–489 | Blatt | 8–12, x 741–1160, 419 × 349 (288–384), Radius 24 | Oberkante fluchtet mit der Eyebrow |
| 497–541 | Unterschrift | 8–12 | 2 Zeilen |
| ab 625 | `ar-02` (Abstand 40) | ab 1, x 120 | im ersten Bildschirm angeschnitten (175 px ≈ 22 %) |

Spalte 7 (x 652–717) bleibt Luft zwischen Text und Papier: Text : Luft : Blatt = 6 : 1 : 5. Mit 419 px bleibt das Blatt unter seiner
Ausgangsbreite 480, die Beschriftung bei 15,7 px; nichts ist überdimensioniert (SKILL:28; GEST:433). **Festlegung I:** Ordnungslinie
x 120 wie Kopf (`rh-01`) und Fuß (`rh-03`), Spalte 1040 nach DG G6; bei 1024 px x 32 (Rand 32, Spalte 960, K-13). **Schnittstelle zu `ar-02` und `ar-03`:** Beide übernehmen
diese Linie; empfohlen Spalten 1–7 (597 px, ≤ 75 Zeichen). `ar-02` rechnet bisher mit der 820er-Spalte (x 118–906 bei 1024) und mit
„Kurz gesagt“ als Karte; beides ist an diese Spezifikation anzugleichen. Die Haarlinie von `ar-02` trennt dann Antwort und Handlung.

### C.3 Verhältnisse

- **Flächen bei 390 × 844** (Schätzung, Text als Tintenfläche ≈ 60 % der Zeilenkästen wie in `he-02`): Blatt ≈ 32 %, Text ≈ 21 %,
  Kopf ≈ 3 %, frei ≈ 44 % (Stufe 2: ≥ 33 %). Mit Kartenfläche um „Kurz gesagt“ wären es ≈ 32 % frei (AR1-AB-2). Schreibtisch: Blatt
  ≈ 14 % (Untergrenze SG 15–35 %, wegen SKILL:28 bewusst klein), Text ≈ 17 %, frei ≈ 69 %.
- **Größenhierarchie:** Blatt (298 px hoch) ≫ h1 32/40 > Antwort 17 > Klein-Stufe 13/15 (Spreizung 1,15 ≤ 1,25). Drei Stufen. Sprung
  Blatt zur Versalhöhe der 13-px-Schrift ≈ 31×, am Schreibtisch ≈ 37× (SG: ≥ 3). h1 : Antwort 1,88 bzw. 2,35: Ausnahme für Titel aus
  Inhaltsdaten (SG 10.9: einmalig ≥ 1,75); G4 ist erfüllt, weil der Held nicht textlich ist.
- **Ebenen:** Hintergrund Z 0 Grund `#161616` → Mittelgrund Z 20 Blatt (Bildschicht, Bild mit `alt`) → Vordergrund Z 30 Bedienschicht
  (Brotkrumen, Eyebrow, h1, Unterschrift, Antwort) → Z 40 Kopf. Drei sichtbare Ebenen (Stufe 2: 3–4).
- **Interaktive Komponenten:** nur die Brotkrumen oben links. Im Daumenbereich liegt bewusst nichts; die erste Handlung liegt nach dem
  Scrollen in `ar-02`.

### C.4 Startwerte mit Begründung

| Wert | Start | Grund |
|---|---|---|
| Abstände | Brotkrumen → Eyebrow 8 · Eyebrow → h1 12 · h1 → Blatt 24 · Blatt → Unterschrift 8 · Unterschrift → „Kurz gesagt“ 24 · Label → Antwort 8 | G2; Verhältnis 1 : 3 (G6). Die 44-px-Zeile der Brotkrumen bringt 14 px Luft mit, sichtbar wirken ≈ 22 |
| Radius des Blatts | 24 auf allen Breiten (`--r4`) | K-22 (11.6.1): Papierkarte 24, keine Verkleinerung am Telefon (DG-AB-8: voll · 24 · 18 · 12); DNA-B B.5 (`--radius-l` mobil 18) ist damit überholt. Die SVG-Inhalte beginnen 16 Einheiten (≥ 11,9 px bei 358, ≥ 10,9 px bei 328 Breite) vom Rand; ein Eckradius 24 schneidet erst ab 7 px diagonal und trifft keinen Inhalt |
| Blattbreite Telefon | volle 358 px | GEST:433: Beschriftung bei 358 px ≥ 13 px (18 × 358/480 = 13,4) |
| Antwort | höchstens `68ch`, Zeilenhöhe 27 px | SG 45–75 Zeichen; K-19 (11.3.1): Fließtext lang 17/27 auf Ratgebern und Fachartikeln, weil „Kurz gesagt“ 10–18 Zeilen hat und Lesetext 17/26 auf drei Zeilen je Block begrenzt ist (Bestand `ratgeber.css:6`: 1,6 = 27,2) |
| Bild laden | `fetchpriority="high"`, nie `loading="lazy"` | am Telefon das größte Element (LCP) |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung und Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen; Verdeckung nur durch den klebenden Kopf beim Scrollen. Eine gestellte Verdeckung (Antwort über dem Blattfuß) entfällt, weil die Zeichnungen bis an ihren Rand Inhalt tragen (SG 10.1/6) | 1 | flach mit Absicht: Lesefläche |
| Material, Transparenz | Papier als einziges Material, deckend; kein Glas (Stufe 2: 0) | 1 | „präzise wie ein Aufmaß“ (DR 1): ein Blatt, kein Bild |
| Licht, Schatten | keines. Keine Lichtquelle im Bild, also kein Licht (DG 2.4.1); kein Schatten auf dunklem Grund, keine Lichtkante, weil nichts schwebt | 0 | Kontrast 18 : 1 statt Effekt |
| Formen | ein Rechteck mit Radius 24 auf allen Breiten (K-22); keine Pillen im Abschnitt; die Haarlinie gibt der Kopf | 1 | ruhige, geschlossene Form |
| 3D-Objekte | keine (das 3-D-Modell aus `web/assets/buehne.js` würde mit dem Lesen konkurrieren und braucht eine Signature) | 0 | – |
| Bildintegration | Blatt mit eigener Kante; Weiß des SVG (`<rect fill="#ffffff">`) und Kartengrund `--papier` (`#ffffff`) sind gleich, also keine innere Naht | – | kein Grundsprung, kein Saum (SG 10.6/2) |
| Oberflächendetails | Mikroschicht aus der Zeichnung (Maßpfeile; Orange `--mo-papier` = Maueröffnung, Schrift `--tinte-papier`; Blau = Element nur als Bestandswert der SVG, siehe H „Zeichnungsfarben“; GEST:433); gleich breite Ziffern im Datum; Trenner „›“ | 2 im Bild, 1 sonst | Präzision als Inhalt, keine Signature (DG 2.3.15) |
| Animation | keine | 0 | Z 8.3.5; GEST:426 |
| Typografie | Bühnenstimme h1, Technikstimme Eyebrow und Label, Lesetext 17 „wie bei Apple“ (DR:103) | – | zwei Stimmen, drei Größenstufen |
| Farbe | ≥ 95 % unbunt; Grün nur Eyebrow und ein Wort (G8); Orange und Blau nur als Linien im Blatt (≤ 2 %); keine Cream | – | Signal ohne Lärm; `farbanteil.py` > 0,3 % farbig durch das Grün |
| Überlagerungen | keine; kein Text auf dem Blatt, die Unterschrift steht darunter | 0 | Zeichnung bleibt vollständig lesbar |
| Perspektive | frontal; die Zeichnung ist eine Ansicht von innen | 0 | messbar, nicht inszeniert |
| interaktive Effekte | nur Zustände der Brotkrumen (F) | 0 | – |

**Bewusst weggelassen:** Glas, Lichtraum, Messraster unter dem Blatt (zweite informierende Signature, Raster nie unter Lesetext),
Drehung des Blatts (DG-AB-12 erlaubt sie nur für Bildkarten; eine Zeichnung muss gerade stehen), Ladeauftritt, Parallaxe, Lottie-Zeichen
`messen` (gegen Z 8.3.5 und das LCP), Lesefortschritt (DG-AB-15), Fotokarte und Platzhalter (DG-AB-9, DG 2.4.1), Cream. Die
Ausdruckslast trägt ein Träger (DNA Nr. 7): die Zeichnung.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primärer Fokus:** das weiße Blatt. Es ist die einzige große Hellfläche und im Blinzeltest der eine Fleck (DG 2.4.4/1).
- **Sekundär:** die h1 direkt darüber (32 px, ≈ 16 : 1, grünes Endwort), danach das Label „KURZ GESAGT“ als Einstieg in die Antwort.
- **Reihenfolge am Telefon:** Blatt als Blickfang → h1 (richtige Seite?) → Zeichnung im Einzelnen → Unterschrift → Label und erste
  Zeilen der Antwort → Scrollen → `ar-02`. Brotkrumen und Eyebrow werden eher gestreift.
- **Reihenfolge am Schreibtisch:** Eyebrow → h1 → Blatt rechts → zurück links zur Antwort (Z-Weg) → `ar-02` unter der Antwort.
- **Kontraste auf `#161616`:** Blatt ≈ 18 : 1, h1 ≈ 16 : 1, Antwort `--text2` ≈ 11,4 : 1, Grün ≈ 10,5 : 1, `--muted` ≈ 5,8 : 1, Trenner
  ≈ 1,6 : 1 (nur Schmuck).
- **Handlung:** Der Abschnitt hat keine. Im ersten Bildschirm steht nur der Kopfknopf, klein oben rechts. Auf Ratgebern ist er Cream
  „Fenster ausmessen“, solange keine Cream im Inhalt sichtbar ist; in der Stufe „Prüfen“ und auf Fachartikeln ist er ein Ring (`rh-01`).
  Das ist gewollt: Erst kommt die Antwort, dann das Angebot (EA 4.3.4/7).
- **Mögliche Ablenkungen:** das Einführungsband mit grüner Pille über dem Kopf (bis 17.11.2026); eine Cream im Kopf als zweiter Hellpol
  auf der Diagonale zum Blatt (DG-H-12); zwei grüne Stellen (Eyebrow, Endwort), beide klein. Das Blatt blendet bei geringer Helligkeit
  möglicherweise (H-AR1-3).
- **Übergang:** Die Antwort endet mit „Unten: …“ und weist damit selbst weiter. Darunter steht der Handlungsbaustein mit der ersten
  Cream der Seite (Fachartikel, Ratgeber außer „Prüfen“).

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Element | Verhalten | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|---|
| Laden | ganzer Abschnitt | steht sofort, kein Auftritt. Das Kopf-Logo leuchtet einmal (`rh-01`), und damit bewegt sich nur ein Träger (SG 10.7/4) | – | gleich |
| Scrollen | ganzer Abschnitt | natives Scrollen; der Kopf klebt und verdeckt; keine Kopplung | – | gleich |
| Hover (`@media (hover: hover)`) | Brotkrumen-Links | `--muted` → `--text` | 150 ms `--e-out` (`--t1`; DG-AB-16 Zustand) | gleich |
| Fokus | Brotkrumen-Links | 2-px-Kontur `--text`, Abstand 2 (`gemeinsam.css:38`); nie unter dem Kopf (`scroll-padding-top` 56/64 aus `rh-01`) | sofort | gleich |
| Tippen, Klicken | Brotkrumen | Navigation | – | – |
| Tippen, Spreizen | Blatt | kein Ziel; Zoomen mit zwei Fingern (Browser) | – | – |

Begründung: Ratgeber sind Lesetext ohne Bewegung (GEST:426; DG 2.3.15; Z 8.3.5). Ein Auftritt würde die Antwort verzögern (RE E16);
„Bewegung mit Sinn“ (SKILL:45) gehört dorthin, wo sie etwas erklärt. Ohne JavaScript ist der Abschnitt vollständig.

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition):** wie C.1: eine Spalte, Blatt über die volle Breite zwischen Titel und Antwort.
- **Brotkrumen [H, Festlegung I]:** Unter 640 px ist das letzte Glied (die eigene Seite) nur für Vorleser da. Es wiederholt die h1, die
  32 px darunter steht. Sichtbar bleibt „Startseite › Ratgeber“ in einer 44-px-Zeile. Ganz gezeigt bräche der Pfad bei allen fünf
  Fachartikeln um, etwa „Startseite › Für Fensterbauer › Erstaufmaß und Feinaufmaß“ (≈ 410 px; Schätzung bei 13 px, 600), bei den
  Ratgebern knapp nicht. Rückfall: Umbruch in eine zweite Zeile (13/18 mehrzeilig, K-19).
- **Einführungsband** (nur Ratgeber, bis 17.11.2026): ≈ 96 px über dem Kopf (Bildschirmfoto `bestand/screens/mobil-ratgeber-01.jpg`).
  Alles rückt um 96 px nach unten, das Blatt endet bei y ≈ 659 und bleibt bei 664 gerade noch ganz im Bild.
- **360–389 px:** Das Blatt wird 328 px breit, die Beschriftung 12,3 px (unter GEST:433). Das ist eine bekannte Grenze der Zeichnungen; die
  Abhilfe ist Zoomen, kein Eingriff. **320 px:** kein seitliches Scrollen; h1 bricht mit `overflow-wrap: break-word`, Brotkrumen ebenso.
- **200 % Text:** Die Antwort fließt um, das Blatt bleibt unverändert, nichts wird abgeschnitten.

**640–1023 px (8 Spalten, Rinne 16, Rand 24 nach K-13):** Stapel wie am Telefon. Das Blatt nimmt die Spalten 1–6 ein, höchstens 480 px,
mit Radius 24; die Antwort höchstens `68ch`. Das Telefon quer (844 × 390) fällt in diese Stufe.

**Schreibtisch 1024 × 768 (Spalte 960, Rand 32 nach K-13; 12 Spalten à 58, Rinne 24):** Text in den Spalten 1–6 (x 32–500, 468 px),
Blatt in 8–12 (x 606–992, 386 × 322, je Zeichnung 265–354, Beschriftung 14,5 px). h1 3 Zeilen 168–294, Antwort 10 Zeilen bis y 612, Blatt
bis 462, Unterschrift bis 514. `ar-02` beginnt bei y 652 und ist 116 px (15 %) angeschnitten.

**Schreibtisch 1280 × 800:** wie C.2. **Ab 1440:** Die Spalte bleibt 1040 und steht mittig.

**Druck:** Kopf und Brotkrumen entfallen (Bestand `ratgeber.css:168`), der Kopf wird gestapelt (`display: block`), das Blatt höchstens
110 mm breit, die Antwort ohne Fläche.

## H. Technische Umsetzung

**Bestand und Umgang**

| Datei | Umgang |
|---|---|
| 23 + 5 Artikel `web/ratgeber/*/index.html`, `web/fuer-fensterbauer/*/index.html` | Kopf neu geordnet (Markup unten). Die Inhalte bleiben, bis auf die zwei Textentwürfe |
| `scripts/ratgeber-bausteine.mjs` | neue idempotente Funktion `artikelkopf(pfad, html)`: setzt `nav.rg-pfad` als `ol` vor `<main>` (Regel 6 in `rh-03`), fasst Eyebrow, h1, die erste `figure.rg-bild` und `.rg-kurz` in `header.rg-artikelkopf` (Zeichnung vor „Kurz gesagt“), setzt `<time datetime>` aus `dateModified`, `fetchpriority="high"` und die Body-Klasse `rg-artikel`. Die Kicker-Regel (`:103`) sucht künftig `<header class="rg-artikelkopf">\s*<p class="eyebrow">`. Das Inhaltsverzeichnis wird weiter nach dem ersten `.rg-cta` eingesetzt (`:148`), also nach `ar-02`. Danach `node scripts/ratgeber-bausteine.mjs` (SKILL:107-108) |
| `web/assets/ratgeber.css` | neuer Block „Artikelkopf“ (≈ 1,5 KB). `.rg-kurz` (`:43-46`) wird im Kopf überschrieben; `.rg-bild img` (`:79`) gilt für spätere Zeichnungen im Fließtext weiter |
| `web/assets/rahmen.css` (neu aus `rh-03`) | Brotkrumen, ergänzt um die Telefonregel für das letzte Glied |

**Markup (Referenzartikel)**

```html
<nav class="rg-pfad" aria-label="Brotkrumen"><ol><li><a href="/">Startseite</a></li><li><a href="/ratgeber/">Ratgeber</a></li><li aria-current="page">Fenster ausmessen</li></ol></nav>
<main class="rg">
  <header class="rg-artikelkopf">
    <p class="eyebrow kicker">Ratgeber · <span class="nw">Stand <time datetime="2026-10-21">21. Oktober 2026</time></span></p>
    <h1>Fenster ausmessen: so geht das Aufmaß für neue <span class="ak">Fenster</span></h1>
    <figure class="rg-bild"><img src="/bilder/messpunkte.svg" width="480" height="400" alt="…(Bestand)…" fetchpriority="high" decoding="async"><figcaption>Je drei Breiten und Höhen der Maueröffnung, dazu die Brüstungshöhe.</figcaption></figure>
    <div class="rg-kurz"><p class="eyebrow">Kurz gesagt</p><p>…</p></div>
  </header>
  <div class="rg-cta">…</div><!-- ar-02 -->
```

`<figure class="rg-bild"><img ` bleibt genau so stehen, weil die Prüfsuite danach sucht (`scripts/pruefen.mjs:1781`). Gestaltet wird über
den Elternteil, nicht über eine Zusatzklasse. „Kurz gesagt“ bleibt ein `p`, keine h2, sonst nähme der Generator es ins
Inhaltsverzeichnis auf. `header` innerhalb von `main` ist keine Banner-Landmarke.

**CSS (Startwerte)**

```css
body.rg-artikel { --rand: 16px }
@media (min-width: 640px) { body.rg-artikel { --rand: 24px } }
@media (min-width: 1024px) { body.rg-artikel { --rand: 32px } }
body.rg-artikel main.rg, body.rg-artikel .rg-pfad { max-width: calc(1040px + 2 * var(--rand)); margin: 0 auto; padding-inline: var(--rand) }
body.rg-artikel .rg-pfad { padding-top: 4px }
@media (max-width: 639px) { body.rg-artikel .rg-pfad li[aria-current] { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap } }
.rg .rg-artikelkopf { display: grid; grid-template-columns: minmax(0, 1fr); margin-top: 8px }
.rg .rg-artikelkopf > .eyebrow, .rg .rg-kurz .eyebrow { margin: 0; font: 600 13px/16px var(--font); letter-spacing: .12em }
.rg .rg-artikelkopf > .eyebrow { color: var(--accent) }
@media (max-width: 639px) { body.rg-artikel:has(.rg-pfad a[href="/fuer-fensterbauer/"]) .rg-artikelkopf > .eyebrow { line-height: 18px } }
.rg-artikelkopf time { text-transform: none; letter-spacing: .02em; font-variant-numeric: tabular-nums }
.rg-artikelkopf .nw { white-space: nowrap }
.rg .rg-artikelkopf h1 { margin: 12px 0 0; font-size: 32px; line-height: 1.05; letter-spacing: -.03em; text-wrap: balance; overflow-wrap: break-word }
.rg .rg-artikelkopf .rg-bild { margin: 24px 0 0 }
.rg .rg-artikelkopf .rg-bild img { width: 100%; max-width: 480px; border-radius: var(--r4); background: var(--papier); box-shadow: none }
.rg .rg-artikelkopf figcaption { margin-top: 8px; font-size: 15px; line-height: 22px }
.rg .rg-artikelkopf .rg-kurz { margin: 24px 0 0; padding: 0; background: none; border-radius: 0; box-shadow: none }
.rg .rg-artikelkopf .rg-kurz .eyebrow { margin-bottom: 8px; color: var(--muted) }
.rg .rg-artikelkopf .rg-kurz p + p { max-width: 68ch; line-height: 27px }
@media (min-width: 1024px) {
  body.rg-artikel .rg-pfad { padding-top: 8px }
  .rg .rg-artikelkopf { grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: auto auto 1fr; column-gap: 24px; margin-top: 24px }
  .rg .rg-artikelkopf > .eyebrow, .rg .rg-artikelkopf h1, .rg .rg-artikelkopf .rg-kurz { grid-column: 1 / 7 }
  .rg .rg-artikelkopf > .eyebrow { grid-row: 1 }
  .rg .rg-artikelkopf h1 { grid-row: 2; font-size: 40px }
  .rg .rg-artikelkopf .rg-kurz { grid-row: 3; align-self: start }
  .rg .rg-artikelkopf .rg-bild { grid-column: 8 / 13; grid-row: 1 / 4; align-self: start; margin-top: 0 }
}
@media print { .rg .rg-artikelkopf { display: block } .rg .rg-artikelkopf .rg-bild img { max-width: 110mm } }
```

Die Zeile `1fr` nimmt die Höhe des Blatts auf, Eyebrow und h1 werden nicht gedehnt. Die Selektoren beginnen mit `.rg`, damit sie die
Vorlage (`ratgeber.css:18-33`, `:161-164`) sicher überschreiben. Der Rand folgt K-13 (11.2.1): 640–1023 → 24 px, 1024 → x 32–992
(Spalte 960, wie der Kopf in `rh-01`), ab 1104 mittig, 1280 → x 120–1160. Die zweizeilige Eyebrow der Fachartikel (nur unter 640 px)
bekommt 13/18 über `:has()`; ohne `:has()` bleibt sie bei 16 px Zeilenabstand, sonst unverändert. Die Telefonregel für das letzte Brotkrumenglied gilt nur auf Artikeln; auf `/fuer-fensterbauer/` (Brotkrumen über
dem Fuß, `rh-03`) bleibt der Pfad vollständig.

**Prüfsuite (IA-O-9):** `pruefen.mjs:1610` um `.rg-pfad a` erweitern (44-px-Ziele). Neu in Abschnitt 10: Jeder Artikel hat
`header.rg-artikelkopf` mit der Folge Eyebrow → h1 → `figure.rg-bild` → `.rg-kurz`; das Kopfbild ohne `loading="lazy"`;
`time[datetime]` = `dateModified` = Datum in „Stand“; erfundene Werte in der Kopfzeichnung haben „Beispiel“ in Bild oder Unterschrift.

**Zeichnungsfarben auf Papier (11.4.1):** Der Kartengrund ist der Rollen-Token `--papier` (`#ffffff`, neu in `gemeinsam.css`). Die 28
SVG werden als `<img>` geladen und tragen ihre Farben selbst, CSS wirkt nicht hinein. Ihr Orange `#c2410c` (23 Dateien) und ihre Schrift
`#141414` (alle 28) sind genau `--mo-papier` und `--tinte-papier`; `--mo` `#ff8a5b` steht auf Papier nirgends (auf Weiß nur ≈ 2,3 : 1).
Blau: 27 Dateien (alle außer `messpunkte.svg`) zeichnen das Element in `#1d4ed8`; ein Blau auf Papier legt 11.4.1 nicht fest. Der
Artikelkopf setzt selbst kein Blau und färbt die Bestandszeichnungen nicht um: Fünf davon (`din-links-rechts`, `fenster-oeffnungsarten`,
`fensterbank`, `geplatzter-termin`, `verglasung`) haben kein Orange und verlören ohne Blau ihre einzige Bedeutungsfarbe. **Offen für das
Designsystem:** ein Token für Blau auf Papier, naheliegend der Bestandswert `#1d4ed8`. Die Rollen-Tokens sind eine **Abweichung von
bestehender Regel (GEST:24 „keine weiteren Farben“) – Freigabe durch den Inhaber nötig** (DS-AB-7; = H5-AB-1, P-AB-2).

**Assets:** keine neuen. Die 28 SVG liegen vor (480 × 330–440, weißer Grund eingebaut, keine Freistellung nötig). Fassung „Foto“
(Z 8.3.5: „oder ein echtes Foto randlos“) nur, wenn der Inhaber für einen Artikel ein echtes Foto der Bildwelt liefert: WebP 1600 × 1000,
am Telefon randlos 390 × 244, unten über 96 px in `#161616` ausgeblendet, an der Stelle des Blatts. Die Zeichnung wandert dann an den
Anfang von `ar-03`. Platzhalter (`ratgeber.webp`, `weg-*.webp`) stehen nie hier. Anfrage derzeit nicht nötig.

**Animation:** keine. **Leistung:** kein Skript, SVG 1,6–5,1 KB mit hoher Priorität, `width`/`height` reservieren die Fläche (keine
Verschiebung); Risiko gering, einzige Falle wäre `loading="lazy"` (Prüfsuite). Keine fremden Server (SKILL:60). **Einbettung:** Artikel
werden nicht eingebettet; die Regeln hängen an `body.rg-artikel` und wirken weder auf `/fuer-fensterbauer/` noch auf die Textfassungen.

**Barrierefreiheit:** eine h1; `nav` mit Namen, `ol`, `aria-current="page"`, der Trenner über `content: "›" / ""` für Vorleser stumm
(`rh-03`); `alt` ≥ 40 Zeichen plus `figcaption`; DOM-, Fokus- und Lesefolge am Telefon gleich, am Schreibtisch liest der Vorleser die
Zeichnung vor der Antwort (sinnvolle Folge nach WCAG 1.3.2, kein fokussierbares Element dazwischen); Kontraste nach E; Ziele ≥ 44 px;
`<time datetime>` für Maschinen; `lang="de"`; unter `forced-colors` bleibt das Bild, Text in Systemfarben.

## I. Conversion-Begründung

- **Position:** Wer aus der Suche kommt, prüft zuerst, ob er richtig ist (RE E1: Aufmerksamkeit liegt in den ersten zwei Bildschirmen;
  E2: der erste Eindruck entsteht in Sekundenbruchteilen). Die h1 bestätigt das Thema, das Blatt zeigt die Antwort als Sache und nicht
  als Schmuck (RE E3), „Kurz gesagt“ sagt sie in Sätzen.
- **Gestaltung:** Der stärkste Reiz der Seite trägt Inhalt, also bleibt der Blick bei der Frage. Datum und genaue Zeichnung sind prüfbare
  Zeichen von Sorgfalt (RE E14) und zeigen, dass eeziframes genau arbeitet (SKILL:38), ohne Belege, Zahlen oder Siegel (SKILL:49).
- **Menge:** nur Vorhandenes: Pfad, Datum, Titel, eine Zeichnung, 65–115 Wörter Antwort. Auf Ratgeberseiten ist das erlaubt
  (IA 5.4.4 e; SKILL:29-30 gilt für Verkaufsflächen). Die Handlung fehlt mit Absicht; sie steht in `ar-02` direkt nach der Antwort.
- **Beitrag zur Zielhandlung:** Erst Antwort, dann Brücke. Weiterlesen (U5) ist die Voraussetzung für Z2a (App) bzw. für den Weg W5
  zur Seite für Fensterbauer; der Kopf hält beide Wege durch den Kopfknopf offen.

| Annahme [H] | Prüfweg | Rückfall |
|---|---|---|
| H-AR1-1: Am Telefon beantwortet die Zeichnung vor „Kurz gesagt“ die Frage nicht schlechter als Text zuerst | Lesetest am Telefon des Inhabers mit drei Artikeln; später eigene Statistik: Anteil, der `ar-02` erreicht | AR1-AB-1 Rückfall |
| H-AR1-2: Die Antwort ohne Kartenfläche wird als Antwort erkannt | Sichtprüfung, Blinzeltest bei 390 × 844 | Karte `--surface` mit Ring, Radius 24 (K-22) |
| H-AR1-3: Das weiße Blatt blendet bei geringer Helligkeit nicht | Telefon des Inhabers, Dunkelmodus des Geräts, abends | Papierton `#f5f4ef` im ersten `rect` der 28 SVG und als Kartengrund statt `--papier` (neuer Farbton, Freigabe nötig) |
| H-AR1-4: Am Schreibtisch wird die Antwort links trotz des Blatts rechts gelesen | Sichtprüfung bei 1280 und 1024 | Stapel wie am Telefon, Blatt 480 px links |
| H-AR1-5: Das verborgene letzte Brotkrumenglied stört nicht | Sichtprüfung, Vorleser | zweite Zeile |
| H-AR1-6: Die Unterschrift zwischen h1 und Antwort ändert die Suchergebnis-Ausschnitte nicht nachteilig | Search Console über vier Wochen, Ausschnitte der Referenzartikel | DOM-Folge Antwort vor Zeichnung, Telefon-Reihenfolge über `grid-template-areas` |

**Abweichungen.** Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**.

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall |
|---|---|---|---|---|
| AR1-AB-1 | „Karte ‚Kurz gesagt‘ direkt unter dem Titel“ (GEST:430) | am Telefon Zeichnung zwischen h1 und „Kurz gesagt“; am Schreibtisch steht die Antwort weiter direkt unter dem Titel | G4 [V am Telefon]: Hauptelement nicht textlich; G2; Z: `ar-02` direkt nach der Antwort. Heute steht die Zeichnung erst nach Knöpfen und Inhaltsverzeichnis, bei y ≈ 1.390 (Schätzung mit Band), also im zweiten bis dritten Bildschirm | „Kurz gesagt“ direkt unter der h1, Zeichnung nach `ar-02` (Held nicht im ersten Bildschirm) |
| AR1-AB-2 | „Kurz gesagt“ als Karte (GEST:430; `ratgeber.css:43`) | Lesestapel auf dem Grund mit Label, ohne Fläche und Ring | DNA Nr. 9 (Bedienschicht ohne opakes Eigenmaterial), Nr. 8 (frei ≈ 44 % statt ≈ 32 %); 32 px mehr Zeilenbreite, etwa 10 % weniger Zeilen; ein Held | Karte wie heute |
| AR1-AB-3 | Zeichnung als „Karte mit Ring“ (GEST:433) | im Kopf ohne Ring, die Blattkante ist die Objektkante | SG 10.6/1 (kein gerahmtes Hauptbild); gleiche Lösung wie `he-02` | Ring 2 px `--line` |
| AR1-AB-4 | „Spalte höchstens 820 px“ (GEST:429) | Kopf im 1040er-Raster: Text 508 px, Blatt 419 px rechts; Lesetext bleibt schmaler als 820 | DG G6 [V] (Spalte 1040); gleiche Linie wie Kopf und Fuß; Antwort und Blatt zusammen im ersten Bildschirm | 820er-Spalte, Text und Blatt je 6 von 12 Spalten (398 px, Beschriftung 14,9 px) |

**Hinweis ohne eigene Abweichung:** Die Technikstimme mit 600 und +0,12 em folgt DR:100, die laut DR:4 für die Köpfe der Ratgeber gilt.
GEST:26 nennt für Kicker noch +0,18 em. Dieser Widerspruch zwischen zwei bestehenden Regeln wird im Designsystem bereinigt.

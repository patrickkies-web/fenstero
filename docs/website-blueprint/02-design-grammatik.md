# 2. Design-DNA-Interpretation und Website Design Grammar

Ergebnis 2 des Website-Blueprints (MASTER-PROMPT V4), Phase B. Stand 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`, gelesen
bis Commit `9624bb1`. Planungsdokument: Das Repository wurde nur gelesen, gebaut und geändert wurde nichts. Dieses Kapitel übersetzt
die Design-DNA in eine Grammatik, nach der jeder Abschnitt der neuen Website gestaltet wird. Es legt fest, **wie** etwas aussieht und
in welcher Intensität, nicht **welche** Inhalte wo stehen; die Ordnung der Inhalte liegt in
[04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md) und [05-informationsarchitektur.md](05-informationsarchitektur.md),
die parallel entstanden sind und hier nur abgeglichen werden (2.5.4).

**Grundlage**

| Kürzel | Datei | Rolle in diesem Dokument |
|---|---|---|
| DNA | `docs/design-dna/03-design-dna.md` (Kapitel 5) | verbindliche gestalterische Grundlage: Konstruktionsformel 5.1, Prinzipien Nr. 1–11 (5.2), Stellschrauben und Dialekte 5.3, Signature-Effekte 5.4, Abgrenzung 5.5, Dimensionen 5.6.1–5.6.18 |
| SG | `docs/design-dna/04-styleguide.md` (Kapitel 6, 10.1–10.10) | prüfbare Regeln; „SG 10.4/3“ = Abschnitt 10.4, Regel 3; Zahlen nach 10.9; gilt bei Abweichung von DNA-B |
| DNA-A, DNA-B | `docs/design-dna/05-ergebnis-a-gesamtdefinition.md`, `…/05-ergebnis-b-styleguide.md` | Gesamtdefinition; Arbeitsfassung mit Regeln B.1, Ebenen B.2, Bausteinen B.3, Tokens B.5, Abnahme B.8 |
| PROMPT | `docs/design-dna/06-design-prompt.md` | universeller Design-Prompt (Ergebnis C), Abgleich |
| VGL | `docs/design-dna/02-vergleich.md` (Kapitel 4) | Statistik 4.1, Kategorien 4.2, Stilcluster 4.3, Leitfragen 4.4, Grundprinzipien 4.5 |
| SKILL | `.claude/skills/premium-gestaltung/SKILL.md` | Vorstellungen und Mindestanforderungen des Inhabers: **Anforderung** |
| DR | `.claude/skills/premium-gestaltung/designrichtung.md` | heutige Designrichtung: **Regel, darf hinterfragt werden** |
| GEST | `docs/GESTALTUNG.md` | heutige Markenregeln: **Regel, darf hinterfragt werden**; Name, Wortmarke und Zeichen bleiben |
| PA, TD | [01-projektanalyse.md](01-projektanalyse.md), [bestand/technik-und-designsystem.md](bestand/technik-und-designsystem.md) | Bestand, Material, Technik |
| EA, IA, RE | [04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md), [05-informationsarchitektur.md](05-informationsarchitektur.md), [03-recherche.md](03-recherche.md) | Abgleich; „IA V4“ = Abschnitt V4 der Verkaufsseite in IA 5.4.2 |

**Kennzeichnungen**

- **[V]** verbindliche Designregel. Sie folgt entweder (a) aus einem DNA-Prinzip (5.2), einer [Pflicht]-Regel des SG, einer
  Mindestanforderung des Inhabers (SKILL), aus Recht oder Prüfsuite, oder (b) sie legt innerhalb eines variablen oder optionalen
  DNA-Spielraums eine Wahl fest, die dann überall gleich gilt (SG „Regelmarken“: je Produkt eine Wahl), meist eine beibehaltene Regel aus
  GEST oder DR. Nur im Fall (a) ist die Regel selbst DNA-verbindlich; im Fall (b) ist sie Hausregel, und das zugrunde liegende Merkmal
  bleibt in der DNA variabel oder optional (etwa Vollrundung, Fortsetzungssignal, Abschnittsnummern, Lichtquelle je Bühne). Eine
  [V]-Regel, die einer heutigen Regel aus GEST oder DR widerspricht, trägt zusätzlich die Formel unten und gilt erst nach Freigabe.
- **[H]** experimentelle Gestaltungshypothese. Plausibel, nicht belegt; sie wird erst nach Prüfung (Telefon-Video, Sichtprüfung durch
  den Inhaber, Lesetest mit Fensterbauern) zur Regel. Aussagen über Wirkung sind immer [H]; Wahrscheinlichkeiten werden nicht genannt.
- *Neuentwurf*: ohne Beleg in den 15 Referenzen. Das betrifft alles zum Telefon (0 von 15 Mobilansichten), zu Folgeabschnitten und zu
  Bewegung (auswertbar 1 bis 5 Referenzen je zeitlicher Dimension).
- **Textentwurf**: neuer Wortlaut; braucht die Freigabe des Inhabers.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: markiert jeden Vorschlag gegen eine Regel in GEST oder DR;
  gesammelt in 2.5.3 als DG-AB-1 bis DG-AB-19. Offene Entscheidungen mit einer Option gegen GEST oder DR (DG-E-1 B, DG-E-2 A,
  DG-E-6) tragen dieselbe Formel. Offene Entscheidungen heißen DG-E-n, Hypothesen DG-H-n (2.6).
- Zwei Skalen, nicht verwechseln: **Intensität 0–4** ist die Skala der DNA-Analyse (Konsens-Mediane; Prüfmaß nach SG 10.9, kein
  Token). **Stufe 1–4** ist die Intensitätsstufe dieser Grammatik (2.4.2).
- Telefon 390 × 844 ist die Hauptansicht (SKILL:28); „Bildschirm n“ = y von (n − 1) × 844 bis n × 844. Schreibtisch 1280 × 800,
  Stichprobe 1024 × 768. Alle Lagen und Maße sind geplant, nicht gemessen.
- Schriftgrößen nur 13, 15, 17, 24, 40, am Telefon 32 statt 40 (SKILL:69). Wo die Grammatik daran rührt, steht es als offene
  Entscheidung (DG-E-1, DG-E-2, DG-E-6).

**Methode.** Die DNA beruht auf 15 Standbildern, die acht **simulierte** Expertenrollen bewertet haben; „Konsenssicherheit hoch“ heißt
reproduzierbare Methode, nicht unabhängige Bestätigung (VGL 4.6, DNA-A „Grenzen“). Im Repository gibt es keine Nutzerforschung,
Besucherzahlen oder Konversionsraten (PA, „Was es nicht gibt“). Die Grammatik übernimmt deshalb die Zahlen der DNA unverändert, trennt
belegte Prinzipien von Ableitungen und Neuentwürfen und prüft jede Übersetzung gegen die Vorgaben des Inhabers. Vorgehen je Dimension:
DNA-Aussage → Bedeutung für ein Produkt aus Fenster-Konfigurator, Aufmaß, „Licht durch ein Fenster“ und Präzision → Intensität je
Seitenbereich → was bewusst nicht übernommen wird.

---

## 2.1 Die DNA in ihrer Gesamtheit

### 2.1.1 Konstruktionsformel und Datengrundlage

> **Grund → (Schrift- oder Kulissenebene) → ein Fokusträger → flache Bedienschicht**, an einer Linie geordnet, durch einen Sprung
> gestuft, zu einem Raum verbunden (DNA 5.1).

Die sieben Bausätze der Formel (DNA 5.1): (1) Stapeln statt dekorieren, mindestens drei Ebenen, Tiefe aus Verdeckung oder Bildoptik,
nie aus tragendem Schlagschatten; (2) Bedienschicht flach, frontal, ohne Perspektive, Schatten, Eigenmaterial und Leuchten, in einem
geschlossenen Formsystem; (3) ein Anker, eine Linie, viel Luft (35–40 % bis 70–75 % freier Grund, geschätzt); (4) Sprung statt Stufe,
kleinste belegte Sprünge etwa dreifach; (5) Bild und Seite bilden einen Raum, Text ohne deckende Box; (6) Grund unterordnen, höchstens
ein Helligkeitszentrum hinter dem Anker; (7) ein Ausdrucksträger als Dialekt (Raumschrift, Objekt im Licht, Bildoptik oder Material);
Bewegung, wenn überhaupt, im Motiv.

**Worauf das beruht** (DNA, Einleitung; DNA-A; VGL 4.1, 4.6):

- 15 Referenzbilder, 11 davon Website-Heros; Ref 04 und 07 sind zwei Standbilder desselben Designs, die Gegenprobe zählt 14 Designs.
- Je Bild 18 Dimensionen × 8 simulierte Rollen, Skala 0–4; maßgeblich ist „deutlich ausgeprägt“ (Median ≥ 2).
- **Verbindlich** heißt: ≥ 75 % deutlich (oder universell nach VGL 4.5) bei Konsenssicherheit mindestens „mittel“. **Variabel**:
  40–74 % oder ein häufiges Prinzip mit wechselnder Technik. **Optional (Signature)**: < 40 % oder Einzelreferenz.
- Grenzen: 0 von 15 Mobilansichten; keine Referenz aus Fenster-, Bau- oder Handwerksbranche; 14 von 15 Quellen aus Instagram;
  9 von 15 perspektivisch verzerrt; eine Referenz = 6,7 Prozentpunkte; vier der acht universellen Prinzipien hängen an einer
  Referenz; die zeitlichen Dimensionen D8, D9, D10, D16, D17 sind mit 4, 5, 1, 1, 3 auswertbaren Referenzen nie verbindlich.

### 2.1.2 Verbindliche Kernmerkmale

Die elf Prinzipien der DNA (5.2). Nr. 1–8 sind die universellen Grundprinzipien aus VGL 4.5, Nr. 9–11 begründete Aufnahmen.

| Nr. | Prinzip | Beleg | Gegenprobe | Konsens­sicherheit | Anmerkung |
|---|---|---|---|---|---|
| 1 | Frontale Bedienschicht, Perspektive nur im Bild | 15 von 15 | 14 von 14 | hoch | unabhängig vom Grundton: 6/6 hell, 7/7 dunkel, 2/2 gemischt |
| 2 | Tiefe als Ebenenordnung, vorrangig über Verdeckung | D1 deutlich 15 von 15; ≥ 3 Ebenen 15 von 15; Verdeckung primär 12 von 15 = 80 % | 14/14; 11/14 = 79 % | hoch | Verdeckung ist Schwellenfall; Ersatz Bildoptik (Ref 02, 09, 14) |
| 3 | Eindeutiger Fixationsanker und strenge Ordnungslinie | D6 deutlich 15 von 15; ohne Ordnungslinie 0 von 15 | 14/14 | hoch | der eine Anker hat Ausnahmen (Ref 13, 14) |
| 4 | Bild und Seite bilden einen Raum | D11 14 von 15 = 93 %; Bild als Bühne 13 von 15 = 87 %; Website-Heros 11 von 11 | 13/14; 12/14 | hoch | Text ohne deckende Box |
| 5 | Ein geschlossenes, formstabiles Formsystem | D5 14 von 15 = 93 %; konsistent 13 von 13; fluide Bedienelemente 0 von 15 | 13/14 | hoch (Formstabilität mittel) | ≤ 4 Radienwerte, ≤ 1 Formbruch je Ansicht (Ableitung) |
| 6 | Kein Schlagschatten als tragendes Tiefenmittel | 12 von 15 = 80 %; Website-Heros 11 von 11 | 11/14 = 79 % | mittel | Schwellenfall; die drei Ausnahmen weich und auf heller Fläche |
| 7 | Hierarchie als großer Maßstabssprung ohne Zwischenstufen | 12 von 15 = 80 % | 11/14 = 79 % | hoch | Schwellenfall (ohne Ref 15: 73 %); Sprung ≥ etwa 3× (Ableitung) |
| 8 | Großzügiger Negativraum | 12 von 15 = 80 %; frei 35–40 % bis 70–75 % (geschätzt) | 11/14 | hoch | unter etwa ⅓ frei nicht belegt |
| 9 | Bedienschicht ohne opakes Eigenmaterial | 13 von 15 = 87 % | 12/14 = 86 % | hoch | Glas fällt nicht darunter |
| 10 | Kein Licht als Flächenmittel der Bedienschicht | 14 von 15 = 93 % | 13/14 | hoch | Saum an genau einem aktiven Element zulässig |
| 11 | Grund dem Fokusträger untergeordnet (Obergrenze) | D13 stark 0 von 15; Mesh-Verläufe 0 von 15; ruhiger Grund 11 von 15 | 10/14 | mittel | 1 Helligkeitszentrum hinter dem Anker, ≤ 3 Zonen, keine Partikel und kein Muster unter Lesetext |

**Pflichtregeln aus Kapitel 6, die zusätzlich gelten** (SG [Pflicht], DNA-B B.1; Nutzbarkeitsvorgaben und Ableitungen):

- Hauptelement bei jeder Breite ≥ 3 × Bedienschrift, dazwischen höchstens eine Headline, **höchstens drei Größenstufen je Ansicht**
  (SG 10.1/4); mindestens ⅓ des ersten Bildschirms frei (SG 10.1/3).
- Lesestapel und Bedienschicht neben dem Anker, nie auf ihm; Verdeckung trifft nur Bild, Kulisse und Inhaltsflächen (SG 10.1/5, /6).
- Höchstens sechs Ebenen, jedes Element in genau einer Ebene (SG 10.2/1; 10.10 Nr. 6).
- Konturen der Bedienschicht haarfein, keine vollflächige Textur unter Lesetext, Fixationspunkt und Schrift nie weichgezeichnet
  (SG 10.3/2–4).
- Keine Elevationsskala, höchstens eine Schattenstufe je Ansicht, keine leuchtende UI-Fläche, kein Glanz an Bedienelementen
  (SG 10.4/1–5).
- Höchstens vier Radienwerte als Tokens, formstabile Bedienelemente auch im Hover und Laden (SG 10.5/1–4).
- **Keine Bewegung der Bedienschicht über Zustandswechsel hinaus**, kein zweiter bewegter Träger, kein springender Rahmen, kein
  Ruhezustand ohne volle Komposition (SG 10.10 Nr. 14; Ableitung aus Nr. 1 und 3, nicht beobachtet). Zustandsfeedback ohne
  Schlagschatten, leuchtende Fläche, zweite Akzentfarbe und Skalierung (SG 10.7/3).
- Bedienschicht als DOM, leichtestes ausreichendes Verfahren, jede Fassung (ohne JavaScript, ohne WebGL, „weniger Bewegung“) als
  Standbild vollständig, LCP-Element nie Canvas (SG 10.8/1–5).
- WCAG 2.2 AA: Text 4,5:1, groß 3:1, Konturen und Fokus 3:1 gegen die ungünstigste Bildstelle; Fokus ≥ 2 px, unverdeckt; Ziele
  ≥ 24 × 24 px, empfohlen 44; eigene Komposition ab 360 px, kein Querscrollen bis 320 px; „weniger Bewegung“ zeigt Endzustände,
  Selbstlauf über 5 s pausierbar (SG 10.10 Nr. 15–20).

### 2.1.3 Wiederkehrende Muster und variable Ausprägungen

**Stellschrauben** (DNA 5.3; alle unter Einhaltung von Nr. 1–11; „je Produkt oder Ansicht eine Wahl, die dann überall gleich gilt“,
SG „Regelmarken“):

| Stellschraube | belegter Spielraum | Rahmen |
|---|---|---|
| Tiefenmittel | Verdeckung einseitig oder beidseitig (Sandwich 6 von 15); Bildoptik statt Verdeckung 3 von 15; 3–6 Ebenen | eindeutige Reihenfolge |
| Plastischer Körper | deutlich 11 von 15; freigestelltes Einzelobjekt 7 von 15; Vitrine 6 von 15 | ein Körper als Fokus; Render der Stufe 4 nur mit gestaltetem Licht (6 von 6) |
| Material | deutlich 11 von 15; Gefälle „Plastik nur im Motiv“ streng 7, weit 11 von 15 | ein Materialträger |
| Transluzente UI | 6 von 15 | mindestens eine Glasfläche über gesättigtem Bildinhalt (Regel Ref 03); kein Schatten |
| Licht | deutlich 11 von 15 (Gegenprobe 11/14, Grenzfall); am Hauptmotiv konzentriert 10 von 15; Intensität 1–3 | keine mehreren gleich hellen Lichtkerne |
| Fokusmechanismus | einzigartiger Reiz 10 von 15 (Schärfe, Wärme, Sättigung, Tonwert, Helligkeit) | verbindlich ist der Anker, nicht der Mechanismus |
| Unschärfe | deutlich 11 von 15 (Glas, Tiefe, Bewegung, Verlauf) | Schrift weichgezeichnet in 0 von 7 |
| Verankerung | ohne Kontaktschatten 7 von 15 (Anschnitt, Überdeckung, Licht, Grundgleichheit) | – |
| Formfamilie | Vollrundung 11 von 13 (Pille i. e. S. 9 von 13); radienlos Ref 10, 15 | ≤ 4 Radienstufen |
| Form und Motiv | Formkontrast organisch gegen geometrisch 6 von 15; Formreim 3 von 15 | organische Form bleibt im Motiv |
| Ordnungsfigur | Achse 8 von 15, Diagonale 7 von 15, Achsenkreuz 6 von 15, Karten- oder Kachelraster 6 von 15 | eine Figur je Ansicht |
| Fortsetzungssignal | Randanschnitt oder Rahmenbruch 8 von 15 | erster Bildschirm vollständig komponiert |
| Bildfassung | streng kantenlos 10 von 15; Grundgleichheit 6 von 15; Typo-Bild-Sandwich 7 von 15 | Nr. 4 |
| Feindetail | deutlich 10 von 15; Lichtkante statt Schatten 6 von 15 | Detail besetzt den Fokus, nie die Fläche |
| Grund | ruhig 11 von 15; Ton, Verlaufsart, Medium frei | Nr. 11 |
| Bildperspektive | deutlich 7 von 15; moderat | Textzone frei |
| Rolle der Schrift | D18 deutlich 9 von 15; Raumschrift 7 von 15, nur mit plastischem Gegenüber (7 von 7) | bedeutungstragender Text nie kontrastarm |
| Zustandscodierung | Rang und Zustand ohne Zusatzfarbe ≥ 7 von 15; Pfeil im Kreis 6 von 15 | keine zweite Akzentfarbe |
| Bewegung | Ort: Motiv, Bedienschicht ruht (zwei Designs, n = 4) | jeder Ruhezustand trägt als Standbild |

**Dialekte** (DNA 5.3, VGL 4.3, DNA-B B.4). Die Cluster sortieren vor allem nach der Plastizität des Motivs (D7) und sind zulässige
Ausprägungen derselben Konstruktion; A und B trennen sich schwach (Verschmelzung bei 0,77), deutlich ist nur die Abspaltung von {C, Ref 01}
bei 1,03. Gemeinsames Fundament: D5 Median 2, D6 Median 3, D13 Median 1.

| Dialekt | Referenzen | Ausdrucksträger | Clustermediane | Bedeutung für eeziframes |
|---|---|---|---|---|
| A Typo-Bild-Sandwich | Ref 03, 04, 07, 08, 13 | Raumschrift | D18 3, D7 3, D11 3, D1 3, D2 2, D3 2, D15 1, D12 1 | höchstens einmal je Seite (Riesenwort, DR 3.2), DG-E-3 |
| B Plastischer Hauptdarsteller im Licht | Ref 05, 09, 10, 12, 14, 15 | Objekt oder Szene im Licht | D7 4, D3 3, D2 3, D1 3, D15 2,25, D11 2,5, D12 2, D18 1,5 | Hausdialekt der Bühnen und der Produktdemonstration (Foto im Licht, gerendertes Fenster, Gerät) |
| C Flache Lösung | Ref 02, 06, 11 | Bildoptik oder Kulissenschichtung | D7 0,5, D2 1, D3 1, D12 0,5, D18 1,5, D1 2, D11 2 | Entscheidungs-, Lese- und Arbeitsflächen |
| Ref 01 Materialstudie | Ref 01 | Glas über gesättigtem Grund | D2 4, D4 3 | nur als Glasschicht innerhalb von B (Glas-Nachricht) |

Mischen ist belegt (Ref 03 Sandwich + Glas, Ref 12 Vitrine + Glas + Kamera, Ref 15 Kamera + Sandwich + Kulisse); Glas zusammen mit
Raumschrift nur in Ref 03. Ein Dialekt rechtfertigt keine Abweichung von 5.2.

### 2.1.4 Optionale Signature-Effekte

Signature-Effekte gehören nicht zur DNA, können sie aber unter Bedingung ergänzen (DNA 5.4). Nach Herkunft:

- **Raum und Bild:** Schärfestaffelung an Begleitelementen (Ref 02, 04, 08, 13, 14; 5 von 15); Glas mit Hintergrundunschärfe
  (Ref 01, 03, 12, 14; 4 von 15); abgestufte Glasunschärfe (Ref 12); Dunst mit Partikeln (Ref 14, 15); fünf bis sechs Ebenen (Ref 15);
  Rahmenbruch über eine Containerkante (Ref 05; 1 von 15); gerichteter Auslauf statt Bildkante (Ref 03); Bildpanel im gerundeten
  Container (Ref 02, 14); Punze als Bildfenster (Ref 15).
- **Material, Licht, Schatten:** Material als Thema (Ref 01, 10); Teilüberdeckung als Vorher-nachher-Vergleich, Farbübertrag (Ref 01);
  Material-Explosionsansicht mit HUD-Annotation (Ref 10); selbstleuchtende Quelle mit Bloom (Ref 05, 09, 12, 14, 15; 5 von 15);
  zonierter Lichtraum hinter dem Fokusträger (Ref 03, 09, 12, 15; 4 von 15); Kantenlicht an dunklen Körpern (Ref 09, 10); Low-Key-Szene
  mit Leuchtinseln (Ref 15); weicher, blasser Begleitschatten nur auf heller Fläche (Ref 01, 05, 11); Objektschatten (Ref 05);
  Bewegungsunschärfe im Motiv (Ref 04/07).
- **Form und Komposition:** gestufte Radien (Ref 05, 08, 11, 14); Formreim Objekt → UI (Ref 07, 09, 12); Laschenkarte mit inversem
  Radius (Ref 03); Haarlinienbox mit Klammernotation (Ref 10); eingefrorene Verformung im Exponat (Ref 05, 10); Bento-Raster nur mit
  Anker (Ref 13, 14); Kennzahl-Kachel (Ref 03, 13, 14; 3 von 15); sichtbares Konstruktionsraster (Ref 01).
- **Detail und Schrift:** technische Mikroschicht aus Punktraster, Monospace, Drahtgitter, Index (Ref 01, 10, 11, 13, 14; 5 von 15);
  Schein als Zustand an genau einem aktiven Element (Ref 13; Ansätze 05, 09); Bild-Wort-Ergänzung (Ref 03, 05, 07, 08; 4 von 15);
  Deckkraftverlauf der Kulissenschrift (Ref 03, 13); Strahlenstriche (Ref 05); Schrift als Objekttextur (Ref 09); zerlegte Lettern (Ref 04).
- **Kamera und 3D:** 3D-Szene mit Kamera und Lichtraum (Ref 09, 12, 14, 15); Raumszene als Hauptmittel (Ref 14, 15); Repoussoir
  (Ref 02, 06, 13, 14, 15); perspektivischer Objektbogen und Levitationsklammer (Ref 09).
- **Zeitlich (n = 1 bis 5):** Szenenwechsel unter stehender Kopfzeile (Ref 04/07); Parallax-Ebenen (nur Struktur, Ref 06);
  Scroll-Hinweis mit Fortschrittslinie (Ref 09, 15); Kapitelziffern (Ref 15); Partikel im Motiv (Ref 07); Schwebeschleife,
  scrollgekoppelte Kamerafahrt, Hotspot mit Annotation, eigener Cursor sind Neuentwurf.
- **Belegt, aber nicht DNA-konform:** Glow- und Verlaufskacheln (Ref 13), weil sie Licht und Material zum Flächenmittel der
  Bedienschicht machen. Ohne jeden Beleg: animiertes Morphing, kinetische Schrift, bewegter Grund, Interface-Physik, Echtzeit-3D.

### 2.1.5 Charakteristische Kompositionsregeln

Werte nach SG 10.9 (Vorschläge; maßgeblich ist die Regel dahinter):

| Regel | Wert | Herkunft |
|---|---|---|
| Ordnungslinien | 1 primäre, höchstens 1 eingerückte Zweitlinie (2–4 % der Breite) | Regeln Ref 03, 11 |
| Kopfzeile | höchstens 8 % der Viewporthöhe (Telefon ≈ 67 px) | Ref 03, 12, 14 |
| Lesezone | 25–42 % der Breite (3–5 von 12 Spalten), mobil volle Breite | Ref 02, 03, 15 |
| Freie Fläche, erster Bildschirm | Ziel 40–60 %, mindestens 33 % | Spanne Ref 01, 03, 07, 10, 12, 15 |
| Fokusträger | Objekt 15–35 %, Szene 60–100 % der Fläche | Ref 03, 07, 08, 10; Ref 14, 15 |
| Textfläche ohne Kulisse | höchstens 15 % | Ref 04, 10, 12 |
| Textmenge erster Bildschirm | Headline ≤ 3 Zeilen, ≤ etwa 40 Wörter, 1 primärer und ≤ 1 sekundärer Handlungsaufruf | Neuentwurf |
| Maßstabssprung | ≥ 3× bei jeder Breite, Desktop 5–12×; Versalhöhe zu Versalhöhe bzw. Objekthöhe zu Versalhöhe | Ref 02, 04, 06, 07 |
| Größenstufen | 2–3 je Ansicht; Spreizung innerhalb der Klein-UI ≤ 1,25× (Vorschlag) | Nr. 7 |
| Headline : Fließtext | Desktop 3–4,5×, mobil ≥ 2,25× (Vorschlag); mit der Markenskala nicht erreicht: 40/17 = 2,35×, 32/17 = 1,88× (DG-E-1) | Ref 02, 06, 11 |
| Ebenen | 3–4; 5–6 nur bei eindeutiger Reihenfolge, vorzugsweise in einer Kamera-Szene | Ref 15 |
| Überlappung von Flächen | 5–15 % | Ref 11 |
| Objektüberstand beim Rahmenbruch | Körper ≤ 10 %, schmale Teile ≤ 20 % der Containerhöhe, eine Kante | Ref 05 |
| Anschnitt der Folgesektion | 8–25 % der Viewporthöhe | Ref 12 |
| Abstände | Basis 4 px; Gruppe : zwischen Gruppen : zwischen Zonen ≈ 1 : 3 : 6+ | Ableitung aus Nr. 7, 8 |
| Einmal-Elemente je Ansicht | je höchstens 1: Anker, Fokusträger, Formbruch, Rahmenbruch, dominanter Lichtkern, Helligkeitszentrum, Schein-Saum, bewegter Träger, Schattenstufe | Nr. 3, 5, 6, 11 |

### 2.1.6 Räumliche und materielle Prinzipien

- **Ebenen als feste Stufen** (SG 10.2, DNA-B B.2): Grund 0 → Kulisse 10 → Fokusträger 20 → Vordergrund oder vermittelnde Schicht 25 →
  Bedienschicht 30 → Navigation und Overlays 40; Reihenfolge belegt (Ref 03, 04, 05, 07, 13, 15), Zahlen Neuentwurf. Das DOM folgt der
  Lesefolge, nicht der Stapelfolge.
- **Materialgefälle:** Material sitzt im Fokusträger oder in einer vermittelnden Glasschicht; die Bedienschicht bleibt matt (Nr. 9).
- **Glas:** halbtransparente Füllung, Hintergrundunschärfe, helle 1-px-Kante (lichtzugewandt 1,5–2-fach), kein Schatten; über
  gesättigtem Inhalt; Unschärfe leicht 8–16 px, stark 24–40 px; Füllung über Bild 15–30 %, unter Kleintext 40–65 %; ohne
  `backdrop-filter` nicht deckende Ersatzfüllung 65–85 %; deckend 90–100 % nur bei reduzierter Transparenz oder erhöhtem Kontrast;
  Sättigung 90–100 %; gleichzeitig ≤ 2 Glasflächen am Telefon, ≤ 3 am Schreibtisch (SG 10.3, 10.9).
- **Licht:** gehört dem Motiv; ein dominanter Lichtkern, weitere ≤ halb so hell; Lichthof 1–1,5 × Breite des Fokusträgers; ≤ 3
  Verlaufsstopps; **eine Lichtrichtung je Ansicht**, der Lichtkanten und Schatten folgen (`--licht-x`, `--licht-y`; SG 10.4/9).
- **Figur-Grund-Trennung folgt dem Grundton:** auf heller Fläche Begleitschatten oder Kantensaum, **auf dunkler Fläche Licht, nie
  Schatten** (SG 10.4/7). Begleitschatten nur auf heller Fläche, dunkelste Stelle ≤ etwa 8 von 255 Tonwerten unter dem Umfeld,
  4–8 % Deckkraft.
- **Bild ohne Kante:** Asset-Grund zu Seitengrund ΔE00 ≤ 1 oder Alphakanal mit 1–2 px Übergang ohne Farbsaum; gerichteter Auslauf über
  das untere Viertel bis Drittel; kein Saum, Hof oder Grundsprung (SG 10.6/2).
- **Verankerung ohne Kontaktschatten:** Anschnitt, Überdeckung durch die Folgesektion, Vordergrund, Lichtsaum, Grundgleichheit.

### 2.1.7 Typische Intensitäten (DNA-Skala 0–4)

Aus VGL 4.1; „deutlich“ = Median ≥ 2, „stark“ = Median ≥ 3.

| Dimension | Typ | deutlich | stark | typische Intensität | Konsens­sicherheit | Einordnung |
|---|---|---|---|:-:|:-:|---|
| D1 Räumliche Tiefe | statisch | 15/15 = 100 % | 11 | 3 | hoch | verbindlich |
| D2 Materialität | statisch | 11/15 = 73 % | 6 | 2 | hoch | variabel; UI ohne Eigenmaterial verbindlich |
| D3 Lichtgestaltung | statisch | 11/15 = 73 % (14 Designs 79 %) | 6 | 2 | hoch | variabel (Grenzfall); kein UI-Licht verbindlich |
| D4 Schatten und Unschärfe | statisch | 11/15 = 73 % | 3 | 2 | mittel | variabel; kein tragender Schatten verbindlich |
| D5 Geometrie | statisch | 14/15 = 93 % | 2 | 2 | hoch | verbindlich als Formsystem |
| D6 Komposition | statisch | 15/15 = 100 % | 13 | 3 | hoch | verbindlich |
| D7 3D-Integration | statisch | 11/15 = 73 % | 9 | 3 (zweigipflig 0–4) | hoch | variabel; frontale UI verbindlich |
| D8 Animation | zeitlich | 4/4 (n. b.) | 1 | 2 | niedrig | nicht verbindlich; Ort Motiv |
| D9 Scroll-Inszenierung | zeitlich | 5/5 (n. b.) | 0 | 2 | niedrig | nicht verbindlich |
| D10 Mikrointeraktionen | zeitlich | 0/1 | 0 | 1 | niedrig | nicht verbindlich |
| D11 Bildintegration | statisch | 14/15 = 93 % | 7 | 2 | hoch | verbindlich |
| D12 Oberflächendetails | statisch | 10/15 = 67 % | 1 | 2 | mittel | variabel |
| D13 Dynamische Hintergründe | gemischt | 4/15 = 27 % | 0 | 1 | mittel | Obergrenze verbindlich |
| D14 Morphing | gemischt | 1/15 = 7 % (14 Designs 0 %) | 0 | 1 | mittel | Formstabilität der UI verbindlich |
| D15 Perspektive | gemischt | 7/15 = 47 % | 2 | 1 / 1,5 | hoch | variabel; UI orthogonal verbindlich |
| D16 Physik | zeitlich | 0/1 | 0 | 1 | niedrig | nicht verbindlich |
| D17 Übergänge | zeitlich | 2/3 (n. b.) | 1 | 2 | niedrig | nicht verbindlich |
| D18 Dynamische Typografie | gemischt | 9/15 = 60 % | 7 | 2 | hoch | variabel; Maßstabssprung verbindlich |

### 2.1.8 Zusammenhänge und Zielkonflikte

Spearman-ρ bei n = 15, Hinweise, kein Beweis (VGL 4.1, 4.4 Frage 4 und 6):

- **Render-Kette** D3 · D7 · D12 · D2 · D15: Licht + Plastik 0,76; Licht + Detail 0,65; Plastik + Kamera 0,65; Material + Detail 0,61.
  Folgerung für eeziframes: Wo ein gerendertes Fenster oder eine Figur trägt, kommen Licht und Detail mit; ein plastischer Körper ohne
  gestaltetes Licht ist ausgeschlossen (SG 10.10 Nr. 9).
- **Glas-Paar** Material + Unschärfe 0,55; **Lichtraum** Grund + Kamera 0,54.
- **Konflikte:** Raumschrift gegen Material −0,26 (Riesenwort nie neben der Material-Szene des Aufmaßblatts); Formsystem gegen
  Typo-Bühne −0,38; fluide Form gegen Kamera-Szene −0,56 (kein Formwechsel des Fensters während einer Kamerafahrt); Unschärfe gegen
  Kamera −0,26.
- **Eine Ausdruckslast, ein Träger** als überwiegende Tendenz (VGL 4.4 Frage 7); zwei gleichrangige Träger nur in Ref 03, 05, 15.
  Vorschlag SG 10.9: Ausdrucksträger mindestens eine Stufe über allen übrigen Mitteln, höchstens ein zweiter gleichauf.

### 2.1.9 Technisch reproduzierbare Mechanismen

Nach der Effekt-Technik-Matrix (SG 10.8, „erforderlich“ = leichtestes Verfahren, das den Effekt vollständig trägt), abgeglichen mit dem
Bestand (TD).

| Effekt | erforderlich | optional, nur wenn … | Ersatz | im Repository |
|---|---|---|---|---|
| Ebenenstapel | Z-Tokens 0/10/20/25/30/40, `isolation: isolate`, Ebenen in einer Rasterzelle (`grid-area: 1 / 1`), Alpha-AVIF/WebP per `<picture>` | `mask-image` für Ausläufe | statisch | freie `z-index`-Werte (TD 2); Foto-Ausläufe vorhanden |
| Glas | `backdrop-filter`, halbtransparente Füllung, 1-px-Kante, `@supports`-Ersatz, deckend bei `prefers-reduced-transparency`/`prefers-contrast: more` | – | Ersatzfüllung | Meldungsstapel `verkauf.css:196–216` |
| Lichtraum, Lichtübertrag | radialer Verlauf ≤ 3 Stopps, Zentrum als `--anker-x/-y` je Breakpoint, oder im Asset | Shader nur in Echtzeitszene | statisch | Erdlicht aus Bildkoordinaten `verkauf.js:190–254` |
| Licht, Schatten, Glanz am Objekt | im Render eingebacken | – | eingebacken | WebGL-Bühne mit Licht, Schattenkarte, Glas, Putz, Klinker, Holz, Aluminium (TD 6.1) |
| Motivbewegung | Videoschleife stumm, `playsinline`, Poster = Endbild; Bildfolge auf `<canvas>` | Lottie für kleine Zeichen | Poster | `Lottie.auf`, 10 Zeichen, 4 ungenutzt (TD 2.5) |
| scrollgekoppelte Szene | `Scroll.binden` (0…1) bzw. IntersectionObserver + CSS-Übergang; `animation-timeline` mit `@supports` | Bibliothek nur lokal in `web/vendor/` (SKILL:60) | Endzustand | `gemeinsam.js:296–324`; bei „weniger Bewegung“ liefert es 0,5 statt Endbild (TD 2.5) → Endstand setzen |
| Zustandswechsel | CSS-Übergang auf Deckkraft, Füllung, Kontur, Farbe | – | sofort | `.btn`, `.chip`, `--lift` |
| Wischreihe | `scroll-snap`, native Trägheit | – | Liste untereinander | `verkauf.js:333–405` |
| Objekt dreht oder öffnet sich | vorgerenderte Bildfolge, ≤ 60 Bilder und ≤ 3 MB am Telefon | Echtzeit-3D nur, wenn Nutzer stetig steuern (SG 10.8/9) | Einzelbild | Bildfolgen aus `buehne.js` mit `?gl=voll` und Playwright möglich, ungeprüft (TD 6.1) |

**Ersatzstufen** (SG 10.8): Stufe 0 statisch (ohne JavaScript, „weniger Bewegung“, `Save-Data`, vor dem Nachladen); Stufe 1 Standard
(Videoschleifen, CSS-Scroll-Animationen; Voreinstellung am Telefon); Stufe 2 Echtzeit erst nach dem LCP mit
`failIfMajorPerformanceCaveat` und Rückfall bei Median-Framezeit über 25 ms für 2 s. Zuordnung zu den zwei Technikstufen des Inhabers:
„Leicht“ (CSS und schlankes JavaScript, nur `transform` und `opacity`, SKILL:56) = SG-Stufe 0/1; „Premium“ (Grafikchip: WebGL, 3-D,
Shader, SKILL:57) = SG-Stufe 2. DR 3.6 rechnet zusätzlich vorgerenderte Bildfolgen auf `<canvas>` und Staub (Canvas) zur Stufe 2; nach
SG sind das schwerere Verfahren der Stufe 1 mit Poster. **Zielkonflikt, offen benannt:** SKILL:59 macht Stufe 2 zum Standard, sobald der
Inhaber mit modernen Seiten vergleicht (das tut er, SKILL:123–124); SG 10.8/2 verlangt das leichteste ausreichende Verfahren, SG 10.8
(Mobil) Stufe 2 am Telefon erst nach bestandener Leistungsprüfung. Die Grammatik löst das je Element in DG-E-13 und 2.4.2, nicht pauschal.
Glas hängt nicht an den Stufen.

**Budgets** (SG 10.8, DR 3.6): LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 am 75. Perzentil mobil; ≤ 350 KB bis LCP; JavaScript im ersten
Bildschirm ≤ 100 KB; erster Telefon-Bildschirm ≤ 300 KB Bilder (DR:167); Fokus-Asset ≤ 200 KB Telefon, ≤ 400 KB Schreibtisch;
Videoschleife 4–10 s, ≤ 1,5 MB Telefon; 3D-Paket ≤ 1,5 MB, erst nach dem LCP. Schleifen nur im Bild (SKILL:61).

**Codesperre** [H] (SG 10.10, Umsetzung 5): Stylelint-Regeln gegen `perspective`, `rotateX/Y`, `skew`, `box-shadow` in UI-Komponenten
außer den Tokens, `transition: all` und animiertes `width`, `height`, `top`, `left`; ergänzt die Prüfsuite (`scripts/pruefen.mjs`),
die heute weder Cream-Pille noch grünes Wort noch ruhige Fassung der Verkaufsseite prüft (TD 5.4).

### 2.1.10 Was die DNA nicht ist und wo sie endet

Keine Farbe und kein Grundton; kein Motiv; kein „3D-Look“ (Echtzeit-WebGL 0 von 15); kein Glassmorphism (Glas mit Unschärfe 4 von 15);
kein Bento (2 von 15); keine Riesenschrift-Pflicht; keine Bewegungs-, Scroll- oder Morphing-Show; kein auffälliger Hintergrund; keine
Pillenpflicht; kein Elevationsstil; kein Lesbarkeitsverzicht (Kontrastrisiken in 12 von 15 Profilen sind ein Zielkonflikt, kein Prinzip);
kein Trendabbild; **keine Mobilvorlage** (DNA 5.5). Die Prinzipien verbinden die Konstruktion, nicht das Erscheinungsbild. Alles zum
Telefon, zu Folgeabschnitten, Unterseiten und Bewegung ist in diesem Dokument Neuentwurf auf Grundlage der Prinzipien.

---

## 2.2 Die 18 Dimensionen für eeziframes

**Seitenbereiche** für die Intensitätsangaben (Abschnittsnummern nach IA 5.4; ändert IA die Folge, folgt die Zuordnung dem Inhalt):

| Kürzel | Bereich | Abschnitte |
|---|---|---|
| BÜ | Bühne | Startbild der Verkaufsseite V1 (auch eingebettet in `/#fensterbauer`), Startbild der Ansicht Hauseigentümer H1 |
| LE | Leiste | Elementarten V2, Kennzahlen V7 |
| NU | Nutzen | Die Idee V3 |
| DE | Produktdemonstration | So funktioniert es V4, Bildfolge für Hauseigentümer H2, Demo-Zugang V6 |
| BE | Beweis | Was in jeder Anfrage steht V5 |
| EN | Entscheidung und Abschluss | Pakete V8, Kosten H3, Abschluss-Paketwahl V14, Messaufforderung H6, Wechselkarte H7 |
| VA | Vertrauen und Ablauf | Kundenschutz V9, Risikoblock, Ablauf und Anbieter V10 |
| LA | Lese- und Arbeitsflächen | Formular V11, Häufige Fragen V12, H5, Hintergrund V13 |
| RU | Ratgeber und Unterseiten | Ratgeber, Fachartikel, Paketbedingungen, Rechtsseiten, Kundenkonto, 404 |
| AP | App-Einstieg | Startbild der App `/app/` |

### 2.2.0 Leitmotiv: Das Zeichen ist die DNA im Kleinen

Das Zeichen von eeziframes zeigt Licht, das durch ein Fenster in einen dunklen Raum fällt: schwarze Kachel, drei weiße Lichtflächen
(Decke, Fenster, Lichtstreifen am Boden), der Streifen verlässt die Kachel unten links; beim Laden geht das Licht einmal an (1,6 s),
danach nur bei Berührung, bei „weniger Bewegung“ ruhig (GEST:7). Diese Konstruktion ist die DNA in einem Bild:

| Im Zeichen | DNA | Regel für die Website |
|---|---|---|
| dunkle Kachel | ruhiger Grund, Nr. 11; dunkle Lichtbühne (Ref 09, 12) | **[V]** Grund `#161616`, nie Eigenmittel |
| das Fenster als einzige Lichtquelle | Licht am Motiv (10 von 15), ein Lichtkern, Nr. 3, 10 | **[V]** Jede Bühne hat ihre Lichtquelle als Öffnung im Bild: Bullauge, Fenster, Maueröffnung, Bildschirm. Licht ohne Öffnung gibt es nicht (DR 3.1, DR:196) |
| Decke und Boden hell, Rest dunkel | zonierter Lichtraum, ≤ 3 Zonen (Ref 03, 09, 12, 15) | **[V]** höchstens ein Helligkeitszentrum, hinter dem Anker |
| der Streifen verlässt die Kachel | Rahmenbruch und Fortsetzungssignal (8 von 15; Ref 05) | **[H]** der eine Rahmenbruch je Seite folgt dieser Logik: Licht oder ein Objekt im Licht tritt über eine Kante in den nächsten Abschnitt (DG-E-4) |
| Licht geht einmal an, dann nur auf Berührung | Bewegung im Motiv, einmalig; Schleifen nur mit Reaktion (DR 3.5) | **[V]** autonome Bewegung endet; danach reagiert das Motiv nur auf Scrollen oder Berührung (DG-AB-5) |
| Licht fällt nach links unten | eine Lichtrichtung je Ansicht (SG 10.4/9) | **[H]** Hausvoreinstellung `--licht-x: -0.6; --licht-y: 0.8` (Licht fällt aus einer Öffnung oben rechts nach links unten); Lichtkanten an Ober- und rechter Kante. Hat ein Foto eine andere echte Lichtquelle, gilt dessen Richtung für die Ansicht (DG-E-8) |

Das zweite Motiv ist **Präzision wie ein Aufmaß** (DR 1): Maßlinien mit Endstrichen, Messraster, gleich breite Ziffern, Haarlinien. In
der DNA ist das die technische Mikroschicht (Signature, 5 von 15, Bedingung „technikbetonter Inhalt“) und das Feindetail (variabel,
10 von 15). Ein Aufmaß-Werkzeug erfüllt die Bedingung; trotzdem bleibt die Mikroschicht dosiert (2.4.3).

### 2.2.1 Räumliche Tiefe (D1)

- **DNA.** Deutlich 15 von 15, typische Intensität 3, stark 11 von 15; Verdeckung primär 12 von 15; Sandwich 6 von 15; 3–6 Ebenen;
  Bildoptik als Ersatz (Ref 02, 09, 14); Tiefe nie über tragenden Schlagschatten (DNA 5.6.1).
- **Übersetzung.** **[V]** Jede Ansicht ist ein Stapel nach 2.3.1: Grund mit optionalem Lichtraum oder Messraster (0) → Riesenwort-Grafik
  (10, höchstens einmal je Seite) → Fokusträger: Foto der Figurenwelt, gerendertes Fenster, Aufmaßblatt oder Gerät (20) → vermittelnde
  Schicht: Glas-Nachrichten, Bestellmaß-Karte, Staub (25) → Bedienschicht (30) → Kopf, Menü (40). **[V]** Mindestens eine sichtbare
  Verdeckung je Ansicht: Kicker und Überschrift liegen im Auslauf des Fotos, die Bestellmaß-Karte überdeckt etwa ein Drittel des
  Aufmaßblatts, das Telefon steht vor dem Browserfenster, die Folgesektion schneidet den Fuß des Startbilds an. Nie verdeckt werden
  Gesicht, Hände, Zollstock, Papierflieger (SKILL:87), Navigation, Hauptaktion, Lesetext, Fokusrahmen (SG 10.1/6). **[V]** Am Telefon
  3–4 Ebenen. Gezählt wird wie in DNA 5.1 und SG 10.2/1: Bedienschicht (Z 30) und Kopf (Z 40) bilden zusammen die eine Bedienschicht;
  die Z-Stufen sind Stapeltokens, keine Ebenenzahl.
- **Intensität.** BÜ 3 · LE 2 · NU 3 · DE 3 · BE 3 · EN 2 · VA 2 · LA 2 · RU 2 · AP 2. Nie unter 2: Auch Lese- und Arbeitsflächen sind
  ein flacher Stapel aus Grund, Karte und Schrift (wie Ref 01, 11).
- **Nicht übernommen.** Tiefe über `--float`-Schatten (DG-AB-1); fünf bis sechs Ebenen außer in einer echten Kamera-Szene; Dunst
  (Ref 14, 15), weil keine Kamera-Szene geplant ist; Parallaxe der Bedienschicht.

### 2.2.2 Materialität (D2)

- **DNA.** Deutlich 11 von 15, typische Intensität 2; verbindlich: Bedienschicht ohne opakes Eigenmaterial (13 von 15); Vitrine 6 von 15;
  transluzente UI 6 von 15, Glas mit Unschärfe 4 von 15; ein Materialträger (DNA 5.6.2).
- **Übersetzung.** Material ist das Material des Produkts, nicht der Oberfläche: Papier und Druck des echten Aufmaßblatts
  (`web/bilder/tour-aufmassblatt-{10,15,20}.webp`), Fotos und Figuren, die Oberflächen der WebGL-Bühne (Putz, Klinker, Naturstein, Holz
  mit Gehrung, gebürstetes Aluminium, Glas mit Spiegelung; TD 6.1), Geräte mit echten Bildschirmen. **[V]** Ein Materialträger je
  Ansicht; Glas daneben nur vermittelnd. **[V]** Karten `#1f1f1f` flach mit Ring, Pillen flach in Cream, Chips flach oder als Glas über
  Bildinhalt; kein Glanz, kein Relief, keine Bildtextur als Füllung (SG 10.3/1). Material macht sichtbar, was der Fensterbauer bekommt:
  „echtes Material statt Symbole“ (SKILL:41) ist hier dieselbe Regel wie das Materialgefälle der DNA.
- **Intensität.** BÜ 2 · LE 1 · NU 2 · DE 3 · BE 3 · EN 1 · VA 1 · LA 1 · RU 1 · AP 2. Spitze in DE (Fensterrender) und BE (Papier).
- **Nicht übernommen.** Material als Thema mit Intensität 4 außer in der Explosionsansicht; Farbübertrag und Randbrechung (Ref 01), weil
  die Marke keine gesättigten Farbfelder hat; Glas über leerem Grund (DG-AB-10); Sättigungsanhebung im Glas (DG-AB-17).

### 2.2.3 Lichtgestaltung (D3)

- **DNA.** Deutlich 11 von 15 (Grenzfall), typische Intensität 2; Licht am Hauptmotiv 10 von 15; verbindlich: kein Licht als
  Flächenmittel der Bedienschicht (14 von 15); stärkster Zusammenhang Licht + Plastik ρ = 0,76 (DNA 5.6.3).
- **Übersetzung.** Das Markenbild „Licht durch ein Fenster“ ist eine Low-Key-Lichtbühne mit einer Quelle (2.2.0). **[V]** Quelle im Bild:
  Erdlicht aus dem Bullauge (`fb-sessel.webp`), Tageslicht durch die Maueröffnung im Rohbau (`start-hauseigentuemer.webp`), Licht durch
  das gerenderte Fenster, das als Streifen auf den Boden fällt, der Bildschirm des Telefons. **[V]** Lichtfarben nur Cream, Grün oder
  das Blau der Zeichnungen, eine Lichtfarbe je Bildschirm, Verlauf radial und weich mit 8–20 % Deckkraft (DR 3.1); höchstens ein
  Helligkeitszentrum, hinter dem Anker (Nr. 11). **[V]** Gerenderte Fenster (Plastik-Intensität 4) stehen immer in gestaltetem Licht.
  **[V]** Keine Bedienfläche leuchtet. **[H]** Lichtrichtung als Haus-Token (2.2.0).
- **Intensität.** BÜ 3 · LE 1 · NU 1 · DE 3 · BE 2 · EN 1 · VA 1 · LA 1 · RU 1 · AP 2. Außerhalb von Bühne und Produktdemonstration
  trägt kein Abschnitt eigenes Licht; das hält den Lichtkern der Bühnen konkurrenzlos.
- **Nicht übernommen.** Grüner Schein ohne Quelle an der empfohlenen Paketkarte (DG-AB-14); mehrere Leuchtinseln (Ref 14, 15); Licht,
  das „atmet“, ohne Reaktion (DG-AB-5); Licht an Knöpfen; Bloom als CSS-Effekt auf Text.

### 2.2.4 Schatten und Unschärfe (D4)

- **DNA.** Kein Schlagschatten als tragendes Mittel 12 von 15 (verbindlich, Schwellenfall, Konsenssicherheit mittel); alle belegten
  Schatten weich und auf heller Fläche (3 von 3); Unschärfe deutlich 11 von 15; Schrift weichgezeichnet 0 von 7 (DNA 5.6.4).
- **Übersetzung.** Die Website steht auf dunklem Grund. **[V]** Dort trennt Licht, nie Schatten: Schwebendes (Glas-Nachricht, Medienkarte,
  Gerät, Menüblatt) bekommt eine 1-px-Lichtkante (8–20 % Weiß, an der lichtzugewandten Seite 1,5–2-fach) und wird über Verdeckung
  verankert, nicht über `--float` (DG-AB-1). **[H]** Einzige zulässige Schattenstelle: auf dem **weißen Papier** des Aufmaßblatts darf
  die darüberliegende Bestellmaß-Karte einen blassen Begleitschatten werfen (≤ 8 von 255 Tonwerten, 4–8 %, Versatz 10 % der Kartenhöhe
  in Lichtrichtung), weil dort eine helle Fläche liegt (Ref 01-Maß). **[V]** Unschärfe nur an drei Orten: hinter Glas (stark 24 px unter
  Text), an Begleitelementen (nur die Ränder der Leiste V2: 0,3–0,6 % der Bühnenbreite; Schärfestaffelung ist Signature, 2.4.3), im
  Foto eingebacken. Fokusträger und Schrift bleiben scharf.
- **Intensität.** BÜ 2 · LE 2 · NU 2 · DE 2 · BE 2 · EN 1 · VA 1 · LA 1 · RU 1 · AP 1.
- **Nicht übernommen.** Objektschatten (Ref 05); Bewegungsunschärfe als Effekt; animierter Unschärferadius; weichgezeichnete Überschrift
  im Übergang; Elevationsskala.

### 2.2.5 Geometrie und Formgebung (D5)

- **DNA.** Geschlossenes Formsystem 14 von 15 (verbindlich); Vollrundung 11 von 13; ≤ 4 Radienstufen; ≤ 1 Formbruch; organische Form nur
  im Motiv; typisch 2, stark nur mit konventioneller Headline (DNA 5.6.5).
- **Übersetzung.** **[V]** Vollrundung bleibt die Familie: Knöpfe, Chips, Segmente, Badges als Pillen (GEST:32), Kreis-Button so hoch wie
  die Pille, Pfeil im Kreis `.pf` in der Hauptaktion (belegt 6 von 15). **[V]** Vier Radienwerte statt heute fünf bis sechs: voll · 24 ·
  18 · 12 (DG-AB-8); Außenradius minus Innenabstand ≈ Innenradius. **[V]** Formkontrast statt Formreim: Fenster, Aufmaßblatt und
  Zeichnungen sind rechtwinklig und technisch, die Bedienschicht rund; Figuren (Astronaut, Waschbär, Bär) tragen die organische Form.
  Haarlinien, Maßlinien und Raster zählen als Gegenform, nicht als Bruch (SG 10.5/5). **[V]** Kein Formbruch geplant.
- **Intensität.** 2 in allen Bereichen (Fundament wie in allen Clustern).
- **Nicht übernommen.** Radienloses Haarliniensystem (Ref 10, 15), obwohl es „präzise“ wirken würde: Es würde die Pillen der Marke
  ersetzen und damit eine zweite Familie neben die App stellen; Laschenkarte (Ref 03); Squircle-Mischung; Radius 10 an Ziffernkacheln.

### 2.2.6 Komposition (D6)

- **DNA.** Anker und Ordnungslinie 15 von 15, Maßstabssprung 12 von 15, Negativraum 12 von 15; Achse 8 und Diagonale 7 von 15;
  Fortsetzungssignal 8 von 15; Kachelraster 6 von 15 (DNA 5.6.6).
- **Übersetzung.** **[V]** Ordnungslinie ist die linke Spaltenkante (Telefon x = 16 px; Schreibtisch Beginn der 12-Spalten-Spalte),
  „linksbündig“ wie heute (GEST:36). **[V]** Ordnungsfigur am Telefon: senkrechter Stapel an der linken Kante, Held oben, Lesestapel
  darunter, erste Handlung ohne Scrollen sichtbar (SG 10.1, Mobil). Am Schreibtisch Split 5 : 7, Text links, Held rechts bis an den
  Fensterrand (DR 3.3). Achse nur, wo das Motiv mittig steht (Gerät, Riesenwort). **[V]** Freie Fläche ≥ 33 %, Ziel 40–60 %; dunkle Wand
  und Ausläufe im Foto zählen als frei. **[V]** Ein Held je Bildschirm (DR 1) = ein Fixationsanker. **[V]** Fortsetzungssignal am Fuß jedes
  ersten Bildschirms: die Folgesektion schneidet 8–25 % (67–211 px) an; Leisten laufen über den Rand.
  **Maßstabssprung und Markenskala:** Mit 32 px als größter Schrift am Telefon erreicht Text gegen 13-px-Labels nur 2,46× (Schreibtisch
  40/13 = 3,08×). **[V]** Am Telefon muss das Hauptelement jeder Ansicht deshalb ein Bild, Objekt, eine Zeichnung oder eine Grafik sein;
  reine Textansichten sind offen (DG-E-1).
- **Intensität.** 3 in allen Bereichen (verbindlich, Fundament).
- **Nicht übernommen.** Bento und gleichrangige Kachelfelder (DG-AB-11); zentrierter Lesetext; Achsenkreuz als Standard; gleichmäßige
  Größenleiter.

### 2.2.7 3D-Integration (D7)

- **DNA.** Plastischer Körper deutlich 11 von 15, zweigipflig; verbindlich: frontale, nie räumlich transformierte Bedienschicht
  (15 von 15); Render der Stufe 4 immer mit gestaltetem Licht (6 von 6); vorgerendert als naheliegende Technik (Hypothese in 8 von 15,
  SG 10.8), Echtzeit-WebGL in 0 von 15 (DNA 5.6.7).
- **Übersetzung.** Drei Arten Körper, je Ansicht genau einer: (1) Figuren der Bildwelt im Foto (Plastik etwa 3), (2) **das Fenster aus dem
  eigenen Konfigurator** als vorgerenderte Bildfolge oder Alpha-Bild (Plastik 4, Vitrine wie Ref 05, 10), (3) ein Gerät mit echten
  Bildschirmen (Geräte-Bühne, DR Baustein 8). **[V]** Keine Echtzeit-Fensterbühne der App auf Verkaufsflächen: Die Bühne hängt an `app.js` (810 KB)
  und kollidiert mit `portal.js` (TD 6.1); Echtzeit-3D wäre nur gerechtfertigt, wenn Besucher das Objekt stetig steuern (SG 10.8/9).
  Grafikchip-Verfahren der Premium-Stufe im Motiv (Foto mit Tiefenkarte, Shader für Licht) bleiben mit Ersatzfassung möglich und sind
  nach SKILL:57–59 sogar Standard, wo Tiefe oder Licht den Unterschied machen (DG-E-13). **[V]** Gerätebildschirme
  sind echte Aufnahmen (neu aufzunehmen, PA 1.7), keine verkleinerten HTML-Miniaturen; sonst fallen sichtbare Schriften unter 13 px, die
  die Prüfsuite nicht misst (TD 5.2 Nr. 1).
- **Intensität.** BÜ 3 · LE 2 · NU 2 · DE 4 · BE 2 · EN 2 · VA 1 · LA 0 · RU 1 · AP 3.
- **Nicht übernommen.** Beliebige 3D-Objekte (Ringe, Kugeln; DR:127, DR:195); gekippte Mockups mit Bedientext; Levitationsklammer
  (Ref 09); 3D-Transformation von Karten.

### 2.2.8 Animation und Bewegung (D8)

- **DNA.** n = 4, Konsenssicherheit niedrig; belegt ist nur der Ort: Bewegung im Motiv, Bedienschicht ruht (DNA 5.6.8). Kapitel 6 macht
  daraus die Pflicht „keine Bewegung der Bedienschicht über Zustandswechsel hinaus“ (SG 10.10 Nr. 14, Ableitung).
- **Übersetzung.** Der Inhaber verlangt „Bewegung mit Tiefe und Physik … Trägheit und Federn statt linearem Gleiten, Reaktion auf die
  Scrollgeschwindigkeit, Ebenen in verschiedener Tiefe“ (SKILL:43–44) und „Bewegung mit Sinn“ (SKILL:45). Die Grammatik erfüllt beides,
  indem sie **die ganze Physik in die Bildschicht legt** (2.3.1): **[V]** Bildschicht bewegt sich (Fotozoom und Tiefe beim Scrollen,
  Bildfolge, Explosionsansicht, Beispielbild mit Nachlauf, Glas-Nachrichten, Staub); Bedienschicht blendet einmal über Deckkraft ein
  (320 ms) und ändert danach nur Zustände (150/220 ms). **[V]** Drei Ebenen je Szene (DR 3.5) liegen alle im Motiv: Hauptbewegung, Licht und
  Schatten folgen 50 ms später, Umgebung reagiert auf Scrolltempo. Alle drei gehören zum selben Fokusträger; eine Umgebung, die als
  eigener Blickfang neben dem Motiv läuft, wäre ein zweiter bewegter Träger und ist ausgeschlossen (SG 10.7/4, 10.10 Nr. 14). **[V]** Ein-Drittel-Regel (DR 3.5); ein bewegter Träger je Ansicht;
  autonome Bewegung endet nach höchstens 5 s (WCAG 2.2.2; DG-AB-5). **[V]** Ruhige Fassung zeigt das Endbild.
- **Intensität.** BÜ 2 · LE 1 · NU 1 · DE 3 · BE 2 · EN 1 · VA 1 · LA 0 · RU 0 · AP 1.
- **Nicht übernommen.** 24 px Aufsteigen und Wachsen von Karten (DG-AB-2); Rütteln bei Fehlern, Einrasten aus 1,06, hochzählende Zahlen in
  der Bedienschicht (DG-AB-3); Wort-für-Wort-Auftritt der Startbild-Überschrift (heute `portal.css:232–234`, macht die h1 bis zum Lauf
  von `portal.js` unsichtbar, TD 1.4); zerlegte Lettern (Ref 04).

### 2.2.9 Scroll-Inszenierung (D9)

- **DNA.** n = 5; belegt ist nur die Ankündigung (Scroll-Hinweis mit Linie, Kapitelziffern), statisch das Fortsetzungssignal 8 von 15;
  Mechanik Neuentwurf; Scrollen transformiert nie die Bedienschicht; der erste Bildschirm ist ohne Scrollen vollständig (DNA 5.6.9).
- **Übersetzung.** **[V]** Natives Scrollen, Scrolltempo nie verändert (DR 3.5). **[V]** Scrollgekoppelt sind nur Bildebenen: Tiefe im
  Startbild (Foto Faktor 0,85–0,9, Glasschicht 1,0), Stationen der Produktdemonstration, Schichten der Explosionsansicht, Versatz der
  Leiste nach Scrolltempo. **[V]** Am Telefon keine Anheftstrecke (DG-AB-13); am Schreibtisch ≤ 1,5 Bildschirmhöhen, davon ≥ ⅓ Ruhe im
  Endzustand. **[V]** Abschnittsnummern 01 bis n in der Technikstimme an jeder Abschnitts-Haarlinie der Verkaufsseite (GEST:450) und der
  Ansicht Hauseigentümer sind die Kapitelstruktur (in der DNA Signature, Ref 15; Einsatz nur dort, 2.3.17);
  ein fortlaufend wachsender Lesefortschritt im Kopf ist eine bewegte Bedienlinie und bleibt Hypothese (DG-E-7, DG-AB-15).
- **Intensität.** BÜ 2 · LE 2 · NU 1 · DE 3 · BE 2 · EN 1 · VA 2 · LA 0 · RU 0 · AP 0.
- **Nicht übernommen.** Scroll-Hinweis als Text („Scrollen“), weil der Anschnitt das Fortsetzungssignal trägt; Einrasten der Seite
  (Snap-Scrolling); Parallaxe von Text.

### 2.2.10 Mikrointeraktionen (D10)

- **DNA.** n = 1; belegt ist die statische Grammatik: Rang und Zustand ohne Zusatzfarbe (≥ 7 von 15) über Deckkraft, Sättigung,
  Füllung gegen Kontur, Glas gegen opak; Pfeil im Kreis 6 von 15 (DNA 5.6.10).
- **Übersetzung.** **[V]** Ein Kanal für „aktiv“: **Füllung** (gewählt = Cream gefüllt, sonst Ring; so schon in Segmenten und Chips,
  GEST:24). Ein Kanal für Hover: **Kontur** hellt auf (`--lift` `#3a3a3a`, GEST:32). Fokus getrennt: formfolgende Kontur 2 px mit 3:1,
  nie verdeckt. **[V]** Drücken ohne Skalierung (DNA-B B.3.7). **[V]** Wischreihe der Pakete: Karten folgen dem Finger, native Trägheit,
  `scroll-snap`, kein Überschwingen (DG-AB-4). **[H]** Haptik-Tipp beim Einrasten (`Haptik.tick`, vorhanden, TD 3.1) ist offen (DG-E-9).
- **Intensität.** 1 überall, EN 2 (Namensleiste mit gleitendem Zeiger, Wischreihe).
- **Nicht übernommen.** Schein als Zustand; Hover-Tilt; magnetische Knöpfe; eigener Cursor (Ref 12, unsicher); Pfeil, der beim Hover
  wandert (DNA-B B.3.7).

### 2.2.11 Bildintegration (D11)

- **DNA.** Bild und Seite ein Raum 14 von 15 (verbindlich); Bild als Bühne 13 von 15; streng kantenlos 10 von 15; Grundgleichheit 6 von 15;
  Container mit komponiertem Bild 2 von 15 (DNA 5.6.11).
- **Übersetzung.** **[V]** Fotos laufen randlos aus und blenden in `#161616` aus (gerichteter Auslauf über das untere Viertel bis Drittel),
  am Schreibtisch rechts bis an den Bildschirmrand (GEST:34). Bei eeziframes ist der Auslauf keine Zugabe, sondern das Regelmittel für
  Nr. 4, weil Fotos mit Aufnahmegrund nicht freigestellt vorliegen. Einordnung: DNA 5.4 führt den gerichteten Auslauf als Signature
  (Ref 03, dort als Verlaufs-Blur am Freisteller); SG 10.6/7 nennt ihn als frei wählbares Übergangsmittel. Die Grammatik wählt ihn nach
  SG 10.6/7 als Hausregel (Fall b), nicht als Signature-Effekt. **[V]** Renderings auf exakt `#161616` (ΔE00 ≤ 1) oder mit Alphakanal.
  **[V]** Das Aufmaßblatt ist ein Objekt in der Szene: Seine Papierkante ist Objektkante, kein Bildrahmen. **[V]** Hauptbild nie als
  gerahmte Fotokarte neben dem Text (DG-AB-9). **[V]** Text auf Bildern nur in ruhigen Zonen oder im Auslauf, Fließtext nie auf Bilddetail
  (GEST:34), Kontrast gegen die ungünstigste Stelle. **[V]** Platzhalter sind nie Hauptbild; ein Bildplatz ohne echtes Bild entfällt
  (PA 1.9/2; IA-AB-8).
- **Intensität.** BÜ 3 · LE 2 · NU 3 · DE 3 · BE 3 · EN 2 · VA 1–2 · LA 1 · RU 2 · AP 3.
- **Nicht übernommen.** Bildpanel mit Bedienschicht darauf (Ref 02, 14) für Bühnen; Punze als Bildfenster (Ref 15); Stockfotos;
  sichtbare Freistellsäume.

### 2.2.12 Oberflächendetails (D12)

- **DNA.** Deutlich 10 von 15; Detail am Fokusträger oder an UI-Kanten, nie Fläche; Lichtkante statt Schatten 6 von 15; Mikroschicht
  5 von 15 bei technikbetontem Inhalt; Körnung 0 von 15 belegt (DNA 5.6.12).
- **Übersetzung.** Der Inhaber verlangt „Detailreichtum. Mikrodetails in den Farben der Marke: Schatten, Ränder, Glanz, Übergänge,
  ausgefallene Anzeigen“ (SKILL:47). Ränder, Übergänge und Anzeigen übernimmt die Grammatik ganz (Lichtkante und Ring, 2.3.17,
  Maßlinie und Maßstab); **Schatten und Glanz nur im Motiv** (Render, Foto, Begleitschatten auf dem weißen Blatt), nicht an
  Bedienelementen, weil DNA Nr. 6 und 9 und SG 10.4/1, /4 das ausschließen. Ob dem Inhaber das genügt, prüft DG-H-4. Im Übrigen wird
  Detail zur Präzision des Aufmaßes: **[V]** Maßlinie mit
  Endstrichen und Schrägstrichen (Orange = Maueröffnung, Blau = Element; GEST:24), Wert auf dunklem Glas, an senkrechten Linien gedreht
  (DR Baustein 4); Ziffern gleich breit (`tabular-nums`); Haken der Klärungsliste; Profilkanten im Render. An UI-Kanten: 1-px-Lichtkante
  an Glas, 2-px-Ring an Karten (`#2b2b2b` auf `#161616` ≈ 1,3:1, wirkt als Kante, nicht als Rahmen). **[V]** Korn nur als eingebackenes
  Dithering (± 1–2 von 255) in großen Lichtflächen gegen Streifen, nie auf UI-Flächen, nie unter Lesetext (DR 3.1 eingeschränkt durch
  SG 10.3/2).
- **Intensität.** BÜ 2 · LE 1 · NU 2 · DE 2 · BE 3 · EN 2 · VA 2 · LA 1 · RU 1 · AP 1.
- **Nicht übernommen.** Punktziffern (Ref 13), Drahtgitter, Pixelsymbole (Ref 10) als Dekor; Monospace als dritte Familie (Inter mit
  `tabular-nums` trägt die Rolle); sichtbares Korn.

### 2.2.13 Dynamische Hintergründe (D13)

- **DNA.** Deutlich 4 von 15 (individuell), stark 0 von 15; ruhiger Grund 11 von 15; verbindliche Obergrenze; bewegter Grund unbelegt
  (DNA 5.6.13).
- **Übersetzung.** **[V]** Grund `#161616` als Vollfläche. **[V]** Lichtraum nur in Bühne und Produktdemonstration, Zentrum am Anker, ≤ 3
  Stopps; **[V]** Messraster wie Millimeterpapier (fein 8 px, kräftig 40 px, Weiß 3–5 %, also ≤ 1,3:1; DR 3.1) nur unter technischen
  Szenen, zum Rand **und unter jedem Lesetext** ausgeblendet (SG 10.3/12). **[V]** Kein Abschnitt in anderer Grundfarbe, kein Cream-Band
  (DG-AB-7). **[V]** Der Grund bewegt sich nicht von selbst.
- **Intensität.** BÜ 2 · LE 1 · NU 1 · DE 2 · BE 2 · EN 1 · VA 1 · LA 1 · RU 1 · AP 1. Nie 3.
- **Nicht übernommen.** Mesh- und Blob-Verläufe; Partikel im Grund; Dunst; Glow-Kacheln (Ref 13).

### 2.2.14 Morphing und Formtransformation (D14)

- **DNA.** Deutlich 1 von 15, Gegenprobe 0 von 14; fluide Bedienelemente 0 von 15; eingefrorene Verformung nur im Exponat; Kamera und
  fluide Form schließen sich tendenziell aus (ρ −0,56) (DNA 5.6.14).
- **Übersetzung.** **[V]** Bedienelemente verformen sich nie, auch nicht Pille zu Kreis (Formwechsel als sofortiger Wechsel, SG 10.5).
  **[H]** Im Motiv darf das Fenster seine Form wechseln, wie es die WebGL-Bühne mit fester Punktzahl tut (Rechteck → Rundbogen, GEST:60),
  als Bildfolge mit lesbarem Endzustand, nur in der Produktdemonstration und nicht gleichzeitig mit einer Kamerabewegung.
- **Intensität.** 0 überall, DE 1.
- **Nicht übernommen.** Flüssiges Glas, Blob-Knöpfe, sich verformende Karten, fluide Glyphen.

### 2.2.15 Perspektive und Kameraführung (D15)

- **DNA.** Deutlich 7 von 15; UI orthogonal 15 von 15; nur moderate Optik belegt (SG 10.9 übersetzt das als Neuentwurf in 15–40°
  Sichtfeld); Kameraachse auf der Layoutachse in Achsenentwürfen; Textzone frei; Kamerafahrt Neuentwurf (DNA 5.6.15).
- **Übersetzung.** **[V]** Perspektive gibt es nur im Bild: fotografischer Standpunkt der Figurenwelt; gerendertes Fenster frontal oder in
  leichter Dreiviertelansicht, damit Profiltiefe und Laibung sichtbar sind (Sichtfeld 25–35°, Neuentwurf innerhalb 15–40°). **[V]** Die
  Kamera verbaut keine Textzone: am Telefon steht das Objekt oben, der Text darunter. **[H]** Eine leichte, scrollgekoppelte Drehung des
  Fensters (≤ 15°) ist eine Kamerafahrt im Bild (Neuentwurf), nur in der Produktdemonstration und nur am Schreibtisch; am Telefon wird
  sie zum Standbild (SG 10.7, Mobil).
- **Intensität.** BÜ 2 · LE 1 · NU 1 · DE 2 · BE 1 · EN 1 · VA 0 · LA 0 · RU 0 · AP 1.
- **Nicht übernommen.** Raumszene als Hauptmittel (Ref 14, 15); Repoussoir; extreme Weitwinkel; gekippte Browserfenster mit lesbarem Text.

### 2.2.16 Physikbasierte Interaktionen (D16)

- **DNA.** n = 1; belegt nur Physik im Motiv (Ref 07); plausible Ruhelagen (lotrecht, gleichmäßig gestaffelt); Interface-Physik unbelegt;
  Kapitel 6: Bedienelemente federn nicht nach (SG 10.7/2) (DNA 5.6.16).
- **Übersetzung.** **[V]** Physik mit Sinn im Motiv: Die Schichten der Explosionsansicht gleiten mit Trägheit auseinander und kommen
  gleichmäßig gestaffelt zur Ruhe (wie Ref 10); das Beispielbild einer Paketkarte bleibt beim Wischen bis 24 px hinter der Karte zurück und
  holt mit einer Feder auf (Überschwingen ≤ 3 %, DR 3.5); die Lamellen eines Raffstores folgen beim Herunterfahren um je 12 ms versetzt
  (wie in der App, GEST:64); Staub treibt mit dem Scrolltempo und kommt in ≤ 3 s zur Ruhe (nur in der Variante von V1, 2.3.3); Glas-Nachrichten fallen mit `--e-out` ein,
  ohne Abprallen. **[V]** Bedienschicht: native Scroll-Trägheit, kein Überschwingen.
- **Intensität.** BÜ 1 · LE 1 · NU 0 · DE 2 · BE 2 · EN 1 · VA 0 · LA 0 · RU 0 · AP 0.
- **Nicht übernommen.** Federnde Knöpfe, elastische Karten, Gummiband an Überschriften, Schleifen ohne Reaktion.

### 2.2.17 Übergänge und Szenenwechsel (D17)

- **DNA.** n = 3, effektiv zwei Belege; belegt: stehender Rahmen (Kopfzeile, Achse) bei wechselndem Inhalt; jede Szene mit lesbarem
  Endzustand; Fassung mit reduzierter Bewegung; statisch: überdeckende Folgesektion (Ref 12), farbgleicher Anschluss (Ref 06) (DNA 5.6.17).
- **Übersetzung.** **[V]** Abschnitte schließen über drei Mittel an (2.3.17): Haarlinie mit Nummer, Anschnitt der Folgesektion,
  farbgleicher Grund. **[V]** Szenenwechsel innerhalb der Produktdemonstration als Überblendung des Motivs (500–900 ms), Kopf, Stationsliste
  und Ordnungslinie stehen. **[V]** Seitenwechsel ohne Animation oder als Überblendung mit stehender Kopfzeile (View Transitions optional).
- **Intensität.** BÜ 1 · LE 1 · NU 1 · DE 2 · BE 1 · EN 1 · VA 1 · LA 0 · RU 0 · AP 0.
- **Nicht übernommen.** Seiten-Flip, 3D-Übergänge, zerlegte Lettern, Masken-Reveals über Text.

### 2.2.18 Dynamische Typografie (D18)

- **DNA.** Deutlich 9 von 15; verbindlich: Maßstabssprung und frontale Bedienschrift; Rolle Kulisse oder Etikett; Raumschrift nur mit
  plastischem Gegenüber (7 von 7); höchstens drei weit gespreizte Stufen; kontrastarm nur Kulissenschrift (DNA 5.6.18).
- **Übersetzung.** **[V]** Etikett ist die Regelrolle: **Bühnenstimme** Inter 800, −0,03 em, Zeilenabstand 1,05, 32/40 px, höchstens drei
  Zeilen, genau ein grünes Wort (DR 3.2); **Technikstimme** 13 px, 600, `tabular-nums`, Versalien 0,12 em für Kicker, Nummern,
  Beschriftungen, Maße in eigener Schreibweise mit 0,02 em; **Lesetext** 17 px in `--text2`, Schlüsselwörter fett in `--text`, höchstens
  drei Zeilen je Block. Das entspricht der DNA-Regel „expressive Stimme plus sachliche Grotesk“ (Regel Ref 07) und „feste Rolle je
  Gattung“ (Ref 10, 11) ohne dritte Familie. **[V]** Höchstens drei Größenstufen je Ansicht (SG 10.1/4): Headline-Stufe (32/40), eine
  Klein-Stufe (13–17; Spreizung 1,31 liegt über dem SG-Vorschlag 1,25, DG-E-6), dazu das nicht-textliche Hauptelement; 24 px nur, wo keine 32/40 in derselben Ansicht steht (DG-E-2). **[V]**
  Riesenwort höchstens einmal je Seite als Grafik (`aria-hidden`, SVG-Pfad), 120–200 px, `#1f1f1f` bis `#262626`, mit plastischem Gegenüber
  davor; das Wort steht zusätzlich als lesbarer Text in der Überschrift (DR 3.2; SG 10.2/9). Damit weicht die Grammatik von der
  Empfehlung in SG 10.8 (Mobil: „Riesenwort und Headline bleiben Live-Text“) ab; Grund ist die Prüfsuite, die auch ausgeblendete Texte
  außerhalb der Schriftskala ablehnt (SKILL:69–70). Die [Pflicht] aus SG 10.10 Nr. 16 bleibt erfüllt, weil die Überschrift Live-Text ist.
- **Intensität.** BÜ 2 · LE 1 · NU 2 (3 mit Riesenwort) · DE 2 · BE 1 · EN 2 · VA 2 · LA 1 · RU 1 · AP 2.
- **Nicht übernommen.** Kinetische Schrift; Deckkraftverlauf an bedeutungstragendem Text; Strahlenstriche (Ref 05); Riesenwort als
  Live-Text (die Prüfsuite misst auch `aria-hidden`-Text, TD 5.2 Nr. 1); Schriftgrößen außerhalb der Skala im Bedientext.

### 2.2.19 Intensitätsmatrix

Ziel-Intensität je Dimension und Bereich auf der DNA-Skala 0–4 (Prüfmaß nach SG 10.9; Bereiche wie oben). Fett: Ausdrucksträger des
Bereichs; nach SG 10.9 liegt er eine Stufe über den übrigen Mitteln, höchstens ein zweiter gleichauf.

| Dimension | BÜ | LE | NU | DE | BE | EN | VA | LA | RU | AP |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| D1 Tiefe | 3 | 2 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 2 |
| D2 Material | 2 | 1 | 2 | 3 | **3** | 1 | 1 | 1 | 1 | 2 |
| D3 Licht | **3** | 1 | 1 | 3 | 2 | 1 | 1 | 1 | 1 | 2 |
| D4 Schatten, Unschärfe | 2 | 2 | 2 | 2 | 2 | 1 | 1 | 1 | 1 | 1 |
| D5 Form | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| D6 Komposition | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| D7 Plastik | **3** | **2** | 2 | **4** | 2 | 2 | 1 | 0 | 1 | **3** |
| D8 Animation | 2 | 1 | 1 | 3 | 2 | 1 | 1 | 0 | 0 | 1 |
| D9 Scroll | 2 | 2 | 1 | 3 | 2 | 1 | 2 | 0 | 0 | 0 |
| D10 Mikrointeraktion | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 1 |
| D11 Bild | 3 | 2 | **3** | 3 | 3 | 2 | 1–2 | 1 | 2 | 3 |
| D12 Detail | 2 | 1 | 2 | 2 | **3** | 2 | **2** | 1 | 1 | 1 |
| D13 Grund | 2 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 1 |
| D14 Morphing | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| D15 Perspektive | 2 | 1 | 1 | 2 | 1 | 1 | 0 | 0 | 0 | 1 |
| D16 Physik | 1 | 1 | 0 | 2 | 2 | 1 | 0 | 0 | 0 | 0 |
| D17 Übergänge | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 0 | 0 | 0 |
| D18 Typografie | 2 | 1 | 2 (**3**) | 2 | 1 | 2 | 2 | 1 | 1 | 2 |
| Dialekt | B | B (Reihe) | C oder A | B (Vitrine/Gerät) | B (Vitrine) | C | C | C | C | B |

Lesart: NU trägt in Fassung A (Gegenüberstellung) die Last über Bild und Verdeckung (Dialekt C, D11 3), in Fassung B über das Riesenwort
(Dialekt A, D18 3). LA, RU und EN tragen keinen Ausdrucksträger im Sinne von SG 10.9; dort arbeitet nur die verbindliche DNA. In EN
stehen Plastik, Detail und Typografie gleichauf bei 2, kein Mittel liegt eine Stufe darüber; das passt zu Dialekt C (Clustermedian
D7 0,5) und zu Dosierregel 1 (2.4.2): Preis und Beispielbild sind Hauptelement, keine Ausdruckslast. Als konkurrierende Mittel nicht
gezählt werden die verbindlichen Grundlagen D1, D5, D6 und D11 (Prinzipien Nr. 2–5), außer D11 dort, wo es selbst Ausdrucksträger ist
(NU Fassung A); so liest auch SG 10.9 die Clustermediane („B Körper 4 gegen Licht und Material 3“, obwohl D1 dort 3 ist).

---

## 2.3 Website Design Grammar

### 2.3.1 Grundregeln

**G1 Zwei Schichten, zwei Gesetze** [V]. Jedes Element gehört entweder zur **Bildschicht** oder zur **Bedienschicht** (DNA 5.1, Nr. 1).

| | Bildschicht (Z 0–25) | Bedienschicht (Z 30–40) |
|---|---|---|
| gehört dazu | Grund, Lichtraum, Messraster (0); Riesenwort-Grafik (10); Foto, Render, Bildfolge, Aufmaßblatt, Gerät, Beispielbild, Bilder der Leiste, Maßlinie samt Wert (20); Glas-Nachrichten, Bestellmaß-Karte als Illustration, Staub (25). Alles ohne Funktion, `aria-hidden` oder als Bild mit `alt` | Überschriften, Lesetext, Kicker, Abschnittsnummern, Haken-Chips, Preise, Knöpfe, Karten mit Inhalt, Namensleiste, Formular, Kopf, Menü, Fuß (30, 40) |
| darf | Perspektive, Drehung, Material, Licht, Unschärfe, Bewegung, Physik, Federn bis 3 % Überschwingen | Zustandswechsel über Füllung, Kontur, Farbe, Deckkraft (150/220 ms); einmaliges Einblenden über Deckkraft (320 ms) |
| darf nicht | Text tragen, der zum Verstehen nötig ist (er steht zusätzlich in der Bedienschicht); Bedienziele enthalten | Versatz, Skalierung, Drehung, Perspektive, Schatten, Glanz, Leuchten, Verformung, Zählen, Laufen |

**G2 Satzbau eines Abschnitts** [V]. Kopf → Held → Lesestapel → Handlung.

- *Kopf:* Haarlinie 1 px über die volle Spaltenbreite, darunter im Abstand 16 px die Abschnittsnummer in der Technikstimme (13 px, grün,
  „03“; nur auf Verkaufsseite und Ansicht Hauseigentümer, 2.3.17), darunter mit 12 px Abstand die h2 in der Bühnenstimme (32 px Telefon, 40 px Schreibtisch, höchstens zwei Zeilen, ein grünes Wort).
- *Held:* das Hauptelement der Ansicht, nicht textlich (G4); am Telefon direkt unter dem Kopf, in Bühnen über dem Kopf.
- *Lesestapel:* höchstens drei Zeilen 17 px je Block, höchstens zwei Blöcke je Bildschirm.
- *Handlung:* höchstens eine Cream-Pille je Bildschirm (SKILL:71), sonst Ring-Knöpfe; Ziel 52 px hoch, mindestens 44 px.

**G3 Ein Held je Ansicht** [V]. Er trägt als Einziger den Fokusreiz: farbiges Licht (Erdblau, warmes Filmlicht), Papierweiß auf dunklem
Grund oder Plastik. Cream ist neutraler Hellwert und steht als zweiter Pol auf der Diagonale (Lesestapel), nie auf dem Held; zulässig nach
SG 10.1/2, weil die Pille den Reiz des Ankers nicht teilt (Ref 01). Grün ist Signal in Kleinstmengen (Kicker, Haken, ein Wort, aktive
Marke) und steht nie am Held.

**G4 Hauptelement nicht textlich** [V am Telefon]. Weil 32/13 = 2,46 < 3 (2.2.6), ist das Hauptelement jeder Ansicht am Telefon ein Bild,
Objekt, eine Zeichnung, ein Maßstab oder eine Riesenwort-Grafik. Ausnahme nur nach DG-E-1.

**G5 Ordnungslinie** [V]. Linke Spaltenkante; Text, Knöpfe, Nummern und Haarlinien fluchten darauf. Achse nur bei mittigem Motiv.

**G6 Abstände** [V]. Zwischen Abschnitten 96 px Telefon, 128 px Schreibtisch (DR 3.3); innen 8, 12, 16, 24 px; Verhältnis innerhalb einer
Gruppe : zwischen Gruppen : zwischen Zonen ≈ 1 : 3 : 6 (8 / 24 / 48 px). Seitenrand 16 px am Telefon, Spalte 1040 px am Schreibtisch.

**G7 Beispiel kennzeichnen** [V]. Jedes illustrierende Material mit erfundenen Werten (Meldungen, Aufmaßblatt, Gerätebildschirme,
Beispielseiten) trägt oben links „Beispiel“ in der Technikstimme; eine Beispielfirma, eine Beispielfamilie, eine Beispieldomain auf der
ganzen Website (EA S3; PA-Frage 25).

**G8 Farbe als Funktion** [V]. Fokusreiz = farbiges Licht im Bild; Hauptaktion = Cream; Signal = Grün; Bedeutung = Orange (Maueröffnung)
und Blau (Element) nur in Zeichnungen und Maßlinien; Status nur als Wort mit Punkt (GEST:24). Je Bildschirm ≥ 80 % unbunt, kräftig ≤ 5 %,
farbig > 0,3 % (DR 3.1, gemessen mit `farbanteil.py` bei 390 × 844).

**G9 Mindestanforderungen vor Effekt** [V]. Kontrast, Fokus, Ziele, Reflow, ruhige Fassung, Budgets (SG 10.10 Nr. 15–20). Fehlt Platz,
entfällt der Effekt, nicht der Negativraum.

### 2.3.2 T0 Rahmen: Kopf, Menü, Fuß

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | Kopf und Menü in Z 40; auf Bühnen liegt der Kopf flächenlos über dem dunklen oberen Bildrand, mit einem Scrim aus `#161616` (60 % → 0 über 96 px) als eigener Ebene; über Inhalt opak `#161616` mit Haarlinie unten (DG-AB-10). |
| Held | keiner; der Kopf ist Klein-UI. |
| Typografie | Wortmarke klein (`Marke.wort()`), Links 15 px, Kopfknopf 15 px fett; Menü-Gruppenköpfe 13 px Technikstimme, Einträge 17 px in 52-px-Zeilen. |
| Material, Licht | keines; Menüblatt opak `#1f1f1f` mit 1-px-Lichtkante oben, Scrim dahinter, kein Schatten (DG-AB-1). |
| Bewegung | Menüblatt blendet 220 ms über Deckkraft ein (Austritt 165 ms); kein Gleiten, wenn der Inhaber nicht anders entscheidet (IA K02 plant ein Blatt von unten: als Bewegung der Bedienschicht DG-E-12). Kopf springt bei Übergängen nie. |
| Intensität | Stufe 1 überall. |
| Telefon | Kopf 56 px (≤ 8 %); Kopfknopf als Ring, Cream nur, wenn keine Cream-Pille im Bild ist (heute `kopfCta`, GEST:193). |
| Schreibtisch | Kopf 64 px; Links rechts; Spalte 1040 px. |
| Fuß | ruhig, Haarlinie oben, Gruppen in Spalten bzw. untereinander; „Vertrag widerrufen“ als 44-px-Ring (GEST:438). |
| Nicht | halbtransparenter Kopf über Text; Schatten unter dem Kopf; Kulissenschrift oder Objekte in der Kopfzone (Regel Ref 04). |

### 2.3.3 T1 Bühne (Hero)

Einsatz: V1 (Verkaufsseite und Einbettung `/#fensterbauer`), H1 (Ansicht Hauseigentümer). Aufgabe: Zuordnen und Weg zu den Paketen bzw.
in die App in den ersten 844 px (RE R12).

| Merkmal | V1 Fensterbauer (Stufe 4) | H1 Hauseigentümer (Stufe 3) |
|---|---|---|
| Ebenenaufbau | 0 Grund mit Lichtübertrag des Erdlichts über die Bildkante (radial, Zeichnungsblau ≤ 12 %) → 20 Foto `fb-sessel.webp`, links und unten in den Grund ausgeblendet → 25 Glas-Nachrichten (3 im Stapel, „Beispiel“) → 30 Kicker, h1, Haken-Chips, Cream-Pille, Ring-Knopf, Preiszeile → 40 Kopf flächenlos. 4 Ebenen (Grund, Foto, Glas, Bedienschicht; Zählung 2.2.1). | 0 Grund → 20 Foto `start-hauseigentuemer.webp` (Waschbär an der Maueröffnung im Rohbau) → 25 Umschalter als Glas-Segment über dem Foto (IA K03) → 30 Eyebrow, h1, Preiszeile, Cream-Pille, Ring → 40 Kopf. 4 Ebenen. |
| Held | Astronaut am Bullauge; Anker = Bullauge mit Erdlicht; Fokusträger 25–35 % der Fläche (am Foto zu prüfen) | Waschbär an der Maueröffnung; Anker = Licht in der Öffnung |
| Typografie | Kicker 13 Technikstimme grün; h1 32/40 Bühnenstimme, wörtlich nach Prüfsuite mit grünem „Marke“; Chips 13/700; Knopftexte 17 fett; Preiszeile 13 Technikstimme. Größen 32 · 17 · 13 = zwei Textstufen (Headline, Klein-Stufe) neben dem Foto. ≤ 40 Wörter. | Eyebrow und h1 wörtlich (Prüfsuite); sonst wie V1 |
| Material | Foto trägt Material; Glas als einzige vermittelnde Schicht: `#1f1f1f` 60 %, Unschärfe 24 px, Sättigung 100 % (DG-AB-17), Radius 18, 1-px-Kante in Zeichnungsblau an der dem Bullauge zugewandten Kante. Gleichzeitig höchstens zwei Glasflächen am Telefon, drei am Schreibtisch (SG 10.9): Nur die vorderste Meldung trägt Live-Unschärfe, die zwei hinteren, nur als Kante sichtbaren tragen die nicht deckende Ersatzfüllung; der Wert der Maßlinie auf dunklem Glas ist die zweite Fläche | Foto; Glas nur im Umschalter |
| Licht | Intensität 3: Quelle Bullauge; Lichtfarbe Blau einzig im Bildschirm; Lichtrichtung des Fotos gilt für die Ansicht | Intensität 2: Tageslicht in der Öffnung, warm aus dem Foto; keine zusätzliche CSS-Lichtfläche |
| Bewegung | Laden nacheinander, nie zwei Träger zugleich (SG 10.8: gleichzeitig bewegte Träger 1; SG 10.10 Nr. 14): Foto 0–0,9 s (Deckkraft, Zoom 1,04 → 1); Glas-Nachrichten fallen bei 0,9 / 1,6 / 2,3 s ein (je 600 ms); danach zeichnet sich die Maßlinie in 1,2 s, Wert zählt mit (Bildschicht); Stand nach 4,1 s (< 5 s). Scrollen: Foto bleibt zurück (Faktor 0,85–0,9), Glasschicht 1,0; am Telefon nur, solange die Meldungen dabei ohne Live-Unschärfe stehen (Ersatzfüllung) oder nachdem der Stapel den Bildschirm verlassen hat, weil Glas über bewegtem Motiv am Telefon entfällt (SG 10.8 und 10.10, Mobil). Bedienschicht: steht ab dem ersten Bild (LCP) ohne Einblenden; das einmalige Einblenden über Deckkraft gilt erst für Folgeabschnitte. | Foto 900 ms; sonst keine Bewegung |
| Signature | inszenierend: Glas mit Hintergrundunschärfe und Lichtübertrag des Erdlichts (beide am Fokusträger; damit ist das Budget der Stufe 4 von zwei ausgeschöpft, 2.4.2); informierend: Maßlinie. Staub im Lichtkegel (Partikel im Motiv) nur als Variante **anstelle** des Lichtübertrags, im Telefon-Video zu prüfen | inszenierend: Glas des Umschalters; informierend: keine |
| Telefon 390 × 844 | Kopf 0–56 über dem Foto; Foto y 0–556 (66 % der Höhe; IA plant y 56–556, DG-E-11); Glas-Stapel rechts oben y ≈ 72–160, Breite ≈ 220 px (56 %), Papierflieger links bleibt frei (GEST:447); Kicker y ≈ 456 im Auslauf; h1 drei Zeilen y ≈ 476–577; Chips eine Zeile y ≈ 593–629, flach `#262626`, wo kein Bild darunter liegt; Cream-Pille + Ring y ≈ 645–697 (Daumenbereich); Preiszeile y ≈ 709–725; Leiste ab y ≈ 760 angeschnitten (≈ 10 %). | Foto y 0–520; Eyebrow y ≈ 420; h1 y ≈ 440–541; Preiszeile y ≈ 560; Cream-Pille y ≈ 600–652; Ring daneben; Folgesektion ab y ≈ 760 |
| Schreibtisch 1280 | Kopf 64; Text über 5 von 12 Spalten (x ≈ 120–533), Foto ab x ≈ 553 bis an den Bildschirmrand (≈ 57 % Breite), y 0–760; h1 40 px; Pille im ersten Bildschirm; 1024: Foto ab 44 % (GEST:447) | entsprechend; Foto rechts randlos |
| Ruhig, ohne JS | Endbild: drei Meldungen stehen, Maßlinie fertig, kein Staub, kein Zoom, keine Tiefe; ohne JavaScript: Foto, Text, Knöpfe, Preise, statischer Stapel, keine Maßlinie | Foto, Text, Knöpfe |
| Nicht | Kasten „Kurz gesagt“; Schatten unter Glas; Glas über leerem Grund; Wort-für-Wort-Überschrift; zweite Lichtfarbe; Meldungen in Endlosschleife (DG-AB-5) | Kennzahlenleiste mit offenen Zahlen (IA-AB-5); Bänder vor dem Foto |

### 2.3.4 T2 Leiste (Band)

Einsatz: V2 Elementarten direkt unter dem Startbild; V7 Kennzahlen vor den Paketen (IA). Der Inhaber mag Leisten „wie die
Partner-Logoleisten anderer Seiten, aber hochwertig“ (SKILL:121). **V2 Stufe 3**: Versatz nach Scrolltempo mit Trägheit ist
scrollgekoppelte Motivbewegung mit Physik, die Unschärfe zum Rand (SKILL:44) eine inszenierende Signature; beides liegt nach 2.4.2
über Stufe 2. **V7 Stufe 2**: Die Kennzahlen-Reihe steht, ist wischbar, ohne Unschärfe und ohne Scrollversatz.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund mit Haarlinien oben und unten → 20 Reihe aus echten Bildern der Elementarten (Bildschirmaufnahmen des Modells je Art, neu aufzunehmen; TD 4.4), Ränder zum Grund ausgeblendet → 25 Lichtschlitz mit Kegel in der Mitte (Quelle sichtbar) → 30 Name des Elements unter dem Kegel. 4 Ebenen. |
| Held | das Bild in der Mitte unter dem Lichtkegel (1,25 × größer als die übrigen, scharf); die übrigen kleiner, 40 % Deckkraft am Rand, Tiefenunschärfe 2 px. |
| Typografie | nur der Name des mittleren Elements, 15 px fett (Schreibtisch 17), frontal; V7: Zahl in der Headline-Stufe (32/40) mit Einheit 15 px `--muted`, Beschriftung 13 px. |
| Material | echte Oberflächen im Bild (Holz, Alu, Glas); keine Strichzeichnungen als Hauptträger. |
| Licht | Lichtkegel höchstens halb so hell wie der Lichtkern der Bühne darüber, gleiche Lichtfarbe. |
| Bewegung | keine Dauerschleife. Die Reihe versetzt sich beim Scrollen proportional zum Scrolltempo (Faktor 0,42 wie heute) und läuft mit Trägheit aus (≤ 1,2 s); die Bilder wölben sich zum Rand weg (Bildschicht); die Namen wechseln nur über Deckkraft. Mit dem Finger wischbar. |
| Signature | V2: Schärfestaffelung an Begleitelementen (inszenierend; die eine der Stufe 3); V7: Kennzahl-Kachel (informierend). |
| Telefon | Höhe 144 px; Bilder 72 × 72 px, Abstand 24 px; mittleres 90 px; Name darunter; läuft über beide Bildschirmränder. |
| Schreibtisch | Höhe 176 px, Bilder 96 px; volle Fensterbreite. |
| Ruhig, ohne JS | steht, wischbar; alle Namen sichtbar. |
| Nicht | gleichförmiges Laufband (SKILL:44); gedrehte Namen (DG-AB-6); Cream-Band (DG-AB-7); Zahlen, die hochzählen (DG-AB-3); Kennzahlen ohne Beleg („0 Zeilen Code“, „5 Minuten“ sind offen, EA O-10, O-11). |

### 2.3.5 T3 Nutzen

Einsatz: V3 „Die Idee“. Aufgabe: verstehen, was der Fensterbauer bekommt (EA S2). Zwei Fassungen; je Seite genau eine.

| Merkmal | Fassung A Gegenüberstellung (Stufe 2, Dialekt C) | Fassung B Riesenwort (Stufe 3, Dialekt A) |
|---|---|---|
| Ebenenaufbau | 0 Grund → 20 hinten: Kontaktformular-Einzeiler als Bildkarte („Beispiel“; **Textentwurf** aus EA S2: „Bitte um Angebot für 3 Fenster“) → 20 vorn: erste Seite des Aufmaßblatts, überdeckt die Einzeiler-Karte zu ≤ ⅓, Anfang und Ende des Einzeilers lesbar → 30 Kopf, Lesestapel | 0 Grund → 10 Riesenwort-Grafik (**Textentwurf**: ein vorhandenes Wort der Seite, „Marke“ oder „Domain“; DG-E-3) → 20 freigestelltes gerendertes Fenster, verdeckt ≤ ¼ der Buchstaben, nie den ersten oder letzten → 30 Kopf, Lesestapel |
| Held | Aufmaßblatt (Papierweiß ist der Fokusreiz) | Fenster vor dem Wort |
| Typografie | 32 · 17 · 13; Satz „ohne ihn programmieren zu lassen. Jede Anfrage kommt als Aufmaßblatt-PDF“ eröffnet (VK:61; IA) | Riesenwort 120–200 px Grafik, 90–100 % der Breite am Telefon; Text 32 · 17 · 13 |
| Material | Papier, flach | Fenster matt, Licht 2 (Zielkonflikt Schrift gegen Material, ρ −0,26) |
| Licht | keines außer dem Hellwert des Papiers | Studiolicht im Asset, Richtung nach Haus-Token |
| Bewegung | die vordere Ebene blendet einmal ein (600 ms Deckkraft, 24 px aus Lichtrichtung; Bildschicht) | Fenster dreht sich nur am Schreibtisch beim Durchscrollen um ≤ 8° als Überblendung zweier Bilder, nicht als Bildfolge (die eine Bildfolge der Seite gehört V4, und das Budget der Stufe 3 trägt schon die Bild-Wort-Ergänzung); am Telefon Standbild (SG 10.7, Mobil) |
| Signature | keine (Verdeckung ist verbindlich, kein Effekt) | Bild-Wort-Ergänzung (inszenierend) |
| Telefon | Einzeiler-Karte 70 % Breite oben links; Aufmaßblatt 80 % Breite, 48 px nach rechts unten versetzt; darunter Lesestapel | Wort y-mittig hinter dem Fenster (Fenster 60 % Breite); Lesestapel darunter |
| Schreibtisch | Bild rechts über 7 Spalten, Text links | Achse: Wort über die Spaltenbreite, Fenster mittig, Text darunter links |
| Ruhig, ohne JS | beide Ebenen stehen | Endbild ohne Drehung |
| Nicht | Strichsymbole, vier Kacheln mit Nummer als Hauptträger (heute `.vk-punkte`, TD 3.3) | Riesenwort ohne Gegenüber; Riesenwort neben dem Aufmaßblatt |

### 2.3.6 T4 Produktdemonstration

Einsatz: V4 „So funktioniert es“ (Stufe 4), H2 Bildfolge für Hauseigentümer (Stufe 3), V6 Demo-Zugang (Anhang, Stufe 1). Aufgabe: zeigen,
was der Kunde sieht und was beim Betrieb ankommt (EA S3); hier soll ein Fensterbauer merken, dass eeziframes Digitales beherrscht
(SKILL:38).

| Merkmal | V4 (Stufe 4, Dialekt B) | H2 (Stufe 3) |
|---|---|---|
| Ebenenaufbau | 0 Grund mit Messraster (zum Rand und unter Text ausgeblendet) und Lichtraum hinter dem Gerät → 20 Browserfenster mit der Startseite des Konfigurators unter der Beispieldomain, scharf, tritt über Verdeckung und Tonwert zurück → 20 Telefon davor (Fokusträger; Verdeckung) → 30 Kopf, Stationsliste (5), Lesesatz → 40 Kopf. 4 Ebenen (Grund, Browser, Telefon, Bedienschicht). | 0 Grund → 20 eine Bühne 358 × 420 px mit vier Stationen: Foto → Maß → Modell → Blatt → 30 je Station eine Zeile 17 px |
| Held | Telefon mit echten Bildschirmen; in Station 3 zeigt sein Bildschirm das Fenstermodell, das sich öffnet oder dessen Raffstore herunterfährt (Bildfolge aus der eigenen Bühne) | die Bildfolge |
| Typografie | Stationsnummer 13 Technikstimme, Stationswort 17 fett, ein Satz 15 `--text2`; aktive Station `--text`, übrige `--muted` (Zustand über Tonwert) | 32 · 17 · 13 |
| Material | Gerät mit Glasfront; im Bildschirm Putz, Holz, Alu, Glas des Modells | Foto, Modell, Papier |
| Licht | Bildschirm als Quelle mit Lichtraum hinter dem Gerät; am dunklen Gerät eine 1-px-Lichtkante statt Schatten (2.2.4), kein breites Kantenlicht; Licht durch das gerenderte Fenster als Streifen am Boden in der Bildfolge (Echo des Zeichens) | Licht der jeweiligen Station |
| Bewegung | scrollgekoppelt: Stationen wechseln, während der Abschnitt durch den Bildschirm zieht; der Gerätebildschirm blendet 220 ms über; Lamellen folgen um je 12 ms versetzt (Physik im Motiv, in der Bildfolge eingebacken). Schreibtisch: angeheftet ≤ 1,5 Bildschirmhöhen, ≥ ⅓ Ruhe im Endzustand; Telefon: kein Anheften. | scrollgekoppelt ohne Anheften |
| Signature | inszenierend: scrollgekoppelte Bildfolge im Motiv, Lichtquelle mit Lichtraum (Bildschirm); damit ist das Budget der Stufe 4 von zwei ausgeschöpft (2.4.2). Kantenlicht als Signature und Schärfestaffelung am Browserfenster entfallen. Informierend: Messraster | inszenierend: Bildfolge |
| Telefon | Abschnitt ≈ 1,3 Bildschirme; Kopf y 0–120; Telefon 220 × 450 px mittig (≈ 30 % der Fläche) y 140–590; Stationsliste darunter in fünf Zeilen à 44 px; aktive Station zusätzlich als Satz | Bühne 358 × 420; vier Zeilen |
| Schreibtisch | Split: Stationsliste links über 5 Spalten (je ≈ 60 px), rechts Browserfenster (7 Spalten) mit Telefon davor, das die linke untere Ecke des Browsers überdeckt | Bühne rechts, Zeilen links |
| Ruhig, ohne JS | fünf Standbilder untereinander (Station und Bild), Endbild der Bildfolge | 2 × 2 Standbilder |
| Nicht | Bühne über 3,3 Bildschirme (PA 1.8; EA AB-10); HTML-Miniaturen mit Schrift unter 13 px; Strichzeichen als Hauptträger; „Handy zu Briefumschlag“ (SKILL:125) | Kartenraster mit Strichsymbolen |

**V6 Demo-Zugang** (Stufe 1): zwei Zeilen und ein Ring-Knopf; mit `PAKETE_DEMOS` drei Zeilen à 56 px mit Miniatur je Paket (IA K16). Kein
Effekt.

### 2.3.7 T5 Beweis

Einsatz: V5 „Was in jeder Anfrage steht“. Aufgabe: das Ergebnis in der Hand (EA S3). Stufe 3, Dialekt B (Vitrine), Ausdrucksträger Material
und Detail.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund mit Messraster → 20 Aufmaßblatt `tour-aufmassblatt-15.webp` (Fokusträger, um −2° gedreht, „Beispiel“) → 20 seine Schichten Maße · Fotos · Klärungsliste als eigene Ebenen derselben Stufe → 25 Bestellmaß-Karte opak `#1f1f1f` mit Lichtkante, überdeckt das untere Drittel des Blatts → 30 Beschriftungen 13 px mit 1-px-Führungslinien, Liste der sieben Inhalte, Kopf. 4 Ebenen. |
| Held | das Blatt; Papierweiß auf dunklem Grund ist der einzige große Hellwert der Ansicht. |
| Typografie | Beschriftungen 13 Technikstimme; Liste 15 (eine Fassung des Katalogs, SI 5.3); h2 32/40. Größen 32 · 15 · 13 (Headline- und Klein-Stufe). |
| Material | Papier, Druck, Haken; Explosionsansicht als Material-Thema (Intensität 3). |
| Licht | kein eigenes; Kontrast über Hellwert. Blasser Begleitschatten der Bestellmaß-Karte nur auf dem weißen Blatt (2.2.4). |
| Bewegung | scrollgekoppelt: die drei Schichten lösen sich mit dem Fortschritt des Abschnitts (0 → 1) um 0 / 28 / 56 px nach oben und 0 / 12 / 24 px nach rechts (≤ 20 % der Blatthöhe), gleiten mit Trägheit und kommen gleichmäßig gestaffelt zur Ruhe; Führungslinien zeichnen sich mit (Bildschicht). |
| Signature | inszenierend: Material-Explosionsansicht mit HUD-Annotation (Ref 10; DR Baustein 6, heute nicht umgesetzt); informierend: Messraster. Glas hier nicht (Glasbudget, und Text auf Glas über Weiß verfehlt 4,5:1). |
| Telefon | Blatt 330 px breit (85 %, ≈ 313 px hoch); Beschriftungen an der linken Kante mit Führungslinien zur Schicht; Liste darunter. Kein Anheften: die Schichten lösen sich, während das Blatt durch den Bildschirm zieht (EA S3). |
| Schreibtisch | Liste links (5 Spalten), Szene rechts; angeheftet ≤ 1,5 Bildschirmhöhen. |
| Ruhig, ohne JS | auseinandergezogenes, beschriftetes Endbild (DR Baustein 6). |
| Nicht | Schlagschatten unter dem Blatt auf dunklem Grund; zweite Fassung der Inhaltsliste; uneinheitliche Beispieldaten; Riesenwort in derselben Ansicht. |

### 2.3.8 T6 Vertrauen und Absicherung

Einsatz: V9 Kundenschutz, Risikoblock unter den Paketen (IA K22), Anbieterblock (IA K28). Aufgabe: Risiko senken mit belegten Fakten
(EA S5; RE R7, R8). Stufe 2, Dialekt C.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 Held (s. u.) → 30 Kacheln `#1f1f1f` mit 2-px-Ring, Haken, Text → 40 Kopf. 3–4 Ebenen. |
| Held | **[H]** Bildschirmaufnahme der Startansicht einer Instanz unter der Beispieldomain, die nur den Beispielbetrieb zeigt („Nur Ihr Betrieb“, „Beispiel“; Material aus `einladung.js`, DG-H-7). Ohne dieses Bild ist die erste Kachel die Ankerkachel (volle Breite, zwei Zeilen), die übrigen drei kleiner; dann gilt DG-E-1. |
| Typografie | vier Zusagen im Wortlaut der Prüfsuite („Nur Ihr Betrieb:“, „Nur an Sie:“, „In Ihrem Auftrag:“, „Kein Weiterverkauf:“), 15 px, Kennwort fett; h2 32/40 wörtlich; Link 44 px auf `/konfigurator-bedingungen/#kundenschutz`. Größen 32 · 15 · 13 (Headline- und Klein-Stufe). |
| Material, Licht | keines. |
| Bewegung | Haken werden einmal gezogen (Lottie-Haken bzw. `stroke-dashoffset` 500 ms, GEST:39 Katalog 3; Zeichnung in der Bildschicht der Kachel); sonst ruhig. |
| Signature | keine. |
| Telefon | Held 358 × 240 px; darunter Ankerkachel, dann drei Kacheln untereinander (je 2 Zeilen). |
| Schreibtisch | Held rechts über 6 Spalten, Kacheln links 2 × 2 mit Ankerkachel oben über beide Spalten. |
| Ruhig, ohne JS | Haken stehen. |
| Nicht | Platzhalterbild über halbe Bildschirmhöhe (PA 1.8); Stimmen, Zähler, Logos, Siegel (SKILL:49); vier gleiche Kacheln ohne Anker. |

### 2.3.9 T7 Paketentscheidung

Einsatz: V8 Pakete, H3 Kosten. Aufgabe: Preis und Paket bewerten (EA S4). Stufe 2, Dialekt C, **keine inszenierende Signature** (EA H-D10).

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 Beispielbild je Karte im Browserrahmen (Bildschicht) → 30 Karte `#1f1f1f` mit 2-px-Ring, Inhalt, Knopf; Namensleiste → 40 Kopf. Verdeckung: der untere Kartenrand überdeckt den Fuß des Beispielbilds (Anschnitt). |
| Held | je Karte das Beispielbild (einziger Bildträger, ≥ ⅓ der Kartenhöhe; EA nennt die Hälfte, IA ein Drittel; IA-H-14); Headline-Stufe der Ansicht ist der Monatspreis („Zahl als Held“, DR 3.2). |
| Typografie | Preis 32/40 mit „im Monat“ 15 `--muted`; Einrichtung 15 mit einem Satz; Steuerzeile 13; Unterschiede als drei bis vier Haken 15; Paketname nach DG-E-2 (heute 24); „Empfohlen“ als Kontur-Pille in Cream, Text 13 (nicht gefüllt, damit die Cream-Pille des Knopfs die einzige Cream-Fläche bleibt). |
| Material | Beispielbild zeigt das echte Ergebnis je Paket (fehlt, EA O-12; bis dahin Skizze ohne Text). |
| Licht | keines; der grüne Schein entfällt (DG-AB-14). |
| Bewegung | Wischreihe nativ mit `scroll-snap`, ohne Überschwingen (DG-AB-4); das Beispielbild bleibt bis 24 px zurück und holt mit Feder auf (≤ 3 %, Bildschicht); Namensleiste: Zeiger folgt dem Wischen (Zustand). Kein Einlauf-Hinweis mit Federn. |
| Signature | keine inszenierende; informierend höchstens die Kennzahl-Leiste davor (V7, eigene Ansicht). |
| Telefon | h2 + Leitsatz; Namensleiste über der Reihe (3 Segmente ≥ 44 px, Kurzname 13 + Preis 15; EA AB-11); Karte 310 × ≤ 640 px (Bildschirm 80 px breiter), Nachbarn schauen je 40 px herein, treten über Deckkraft zurück (nicht skaliert); Beispielbild ≈ 278 × 210 px unten in der Karte; Reihe beginnt bei Essential Plus. |
| Schreibtisch | drei Karten nebeneinander in 1040 px, Zeilen über `subgrid` auf gleicher Höhe; Preis und Knopf jeder Karte in einem 800-px-Bildschirm. |
| Ruhig, ohne JS | Karten untereinander mit Preisen (Prüfsuite 29.1); Beispielbild ohne Nachlauf. |
| Nicht | grüner Schein; „Vorläufige Preise“ als Kasten größer als die Preise (EA AB-4); Karten, die beim Einlaufen federn; Skalierung der Nachbarkarten; Countdown, „Beliebt“. |

**H3 Kosten** (Stufe 2): drei Zeilen, Preis 24 px an gemeinsamer linker Kante, Beschriftung 15 px; Held ist das Aufmaßblatt aus H2 im
Anschnitt am oberen Rand oder eine Zeile mit dem Startbild der App (IA K25); kein Countdown (RE R13).

### 2.3.10 T8 Ablauf

Einsatz: V10 Ablauf bis Live mit Anbieterblock. Stufe 2 mit einer informierenden Signature.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 senkrechter Maßstab mit Millimeterstrichen (Bildschicht, Hauptelement) → 30 Schritte → 40 Kopf. |
| Held | der Maßstab: Strichskala 1 px, alle 8 px ein feiner, alle 40 px ein kräftiger Strich, sechs Marken mit Ziffern 01–06; am Telefon ≈ 480 px hoch (Hauptelement weit über 3 × Bedienschrift). |
| Typografie | Ziffer 13 Technikstimme; Schrittwort 17 fett in den sechs Wörtern der Statusleiste (`instanzregeln.js:74–77`); ein Satz 15; „meist 3 bis 5 Werktage“ (Prüfsuite). |
| Material, Licht | keines. |
| Bewegung | erreichte Marken werden grün, sobald ihr Schritt die Bildschirmmitte passiert (Zustandswechsel über Farbe, 220 ms); kein fortlaufend wachsender Strich (DNA-B B.3.12: animierte Fortschrittslinie nur mit begründeter Ausnahme; DG-AB-15). |
| Signature | informierend: Fortschritts-Maßstab (Ref 09, 15; DR Baustein 7). |
| Telefon | Maßstab an der linken Kante x 16–40; Schritte rechts davon ab x 56; Abstand der Marken ≈ 88 px; Anbieterblock darunter (eine Zeile Anbieter, E-Mail; Telefon nach EA O-9). |
| Schreibtisch | Maßstab links, Schritte über 7 Spalten. |
| Ruhig, ohne JS | alle Marken grün bzw. neutral, Liste vollständig. |
| Nicht | Symbole als Hauptträger; laufender Strich ohne Ausnahme; Zahlen, die hochzählen. |

### 2.3.11 T9 Häufige Fragen

Einsatz: V12 (acht Fragen), H5 (vier), Ratgeber. Stufe 1, Lese- und Arbeitsfläche.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 30 `details`-Zeilen mit Haarlinien statt Karten (DG-AB-19) → 40 Kopf (3 Ebenen über Grund, Linie, Text). |
| Held | keiner; DG-E-1 (Maßstabssprung am Telefon 2,46×). |
| Typografie | Zusammenfassung 17 fett, Antwort 17 `--text2`, höchstens fünf Zeilen; „+“/„–“ 24 px Strich rechts; Zeilen 52 px. JSON-LD wortgleich. |
| Material, Licht | keines. |
| Bewegung | Öffnen: Antwort blendet 220 ms über Deckkraft ein. Die Höhe ändert sich ohne Höhenanimation (SKILL:56 „nur transform und opacity“, SG-Codesperre); das kollidiert mit „nichts blinkt, ruckelt oder springt“ (SKILL:48) und ist offen (DG-E-14). |
| Signature | keine. |
| Telefon, Schreibtisch | volle Spaltenbreite; Schreibtisch höchstens 820 px Zeilenbreite (45–75 Zeichen). |
| Nicht | Wissenskarten und Quellenlisten im Fluss (zugeklappt in V13, IA); Kacheln. |

### 2.3.12 T10 Anfrage

Einsatz: V11 Formular mit Dank. Stufe 1, Lese- und Arbeitsfläche; die einzige Eingabe der Seite (GEST:455).

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 30 Formular, Hinweis zum Verkaufsstand (ein Satz, kleiner als Preise; EA AB-4) → 40 Kopf. |
| Held | keiner (Platzhalter `fb-frage` entfällt; IA-AB-8); DG-E-1. |
| Typografie | Beschriftung 15 fett, Feld 17, „(freiwillig)“ 15 `--muted`, Fehlersatz 15 in Fehlerfarbe mit Punkt. |
| Material, Licht | keines; Feldumrisse ≥ 3:1 (RE R10). |
| Bewegung | Fehler: Rand in Fehlerfarbe, Satz darunter, Fokus auf das erste Feld, kein Rütteln (DG-AB-3); Dank ersetzt das Formular, Lottie-Haken einmal (Bildschicht), Fokus auf den Dank. |
| Signature | keine. |
| Telefon | eine Spalte, Felder 52 px, Cream „Frage senden“ volle Breite. |
| Schreibtisch | zwei Spalten; Hinweis links. |
| Nicht | Schatten an Feldern; Platzhalterbild; zweite Cream-Fläche im Bildschirm. |

### 2.3.13 T11 Abschluss

Einsatz: V14 kompakte Paketwahl; H6 Messaufforderung; H7 Wechselkarte. Stufe 2.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 Held → 30 drei Zeilen à 56 px (Kurzname, Monatspreis, Einrichtung, Knopf) bzw. Satz und Pille. |
| Held | **[H]** derselbe Ausschnitt des Startbilds (Bullauge mit Erdlicht bzw. Öffnung im Rohbau) als ruhige Klammer am Seitenende, 100 % Breite, 240 px hoch, ausgeblendet (DG-H-8). H7: die helle Wechselkarte ist der Held ihrer Ansicht. |
| Typografie | h2 32/40; Zeilen 17 fett und 15; H7 Kicker 13, Satz 17. |
| Licht | aus dem Bildausschnitt, ohne zusätzliche CSS-Lichtfläche. |
| Bewegung | keine außer Zustand. |
| Signature | keine. |
| Telefon | Held oben, Zeilen darunter; eine Cream-Pille am empfohlenen Paket; Ring „Frage stellen“. |
| Nicht | Seitenende mit Quellen und Linkliste (PA 1.9/4); zweite Cream-Pille in der hellen Karte (IA-AB-9). |

### 2.3.14 T12 Unterseite

Einsatz: Paketbedingungen, Rechtsseiten, Kundenkonto `/partner/`, 404. Stufe 1; nur die konstante Ebene (2.4.1).

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 Karten mit Ring → 30 Text, Tabellen, Formulare → 40 Kopf opak. |
| Held | keiner; 404 mit echter Figur aus der Bildwelt, sobald vorhanden (heute Platzhalter `fehler.webp`). |
| Typografie | Rechtsseiten 40/32 · 24 · 17 · 15 · 13 (GEST:29); Kundenkonto behält die Skala des Betriebsbereichs (GEST:458), außerhalb dieser Grammatik. |
| Material, Licht, Bewegung | keine; Zustände wie überall. |
| Nicht | Glas, Licht, Signature; halbtransparenter Kopf. |

### 2.3.15 T13 Ratgeber und Fachartikel

Einsatz: 23 Ratgeber, 5 Fachartikel. Kopf Stufe 2, Fließtext Stufe 1.

| Merkmal | Kopf (erster Bildschirm) | Fließtext |
|---|---|---|
| Ebenenaufbau | 0 Grund → 20 echtes Foto randlos oder die führende Zeichnung des Artikels als weiße Karte (Papierweiß als Fokusreiz) → 30 Brotkrumen (nach IA unten), Eyebrow mit Datum, h1, „Kurz gesagt“ → 40 Kopf opak | 0 Grund → 20 Zeichnungen `figure.rg-bild` in Karten (Abbildung im Text, außerhalb der Bühnenlogik) → 30 Text, Schritte, Tabellen |
| Typografie | h1 32/40, Eyebrow 13, „Kurz gesagt“ 17 | 17 Text, 24 Zwischentitel, 15 Bildunterschrift, 13 Label (GEST:29) |
| Bewegung | keine | keine (GEST:426) |
| Signature | keine; Maßlinien und Orange/Blau in Zeichnungen sind Inhalt, keine Signature | keine |
| Nicht | Platzhalter als größte Fläche (PA 1.8); Cream-Pille im Kopf, wenn eine im Inhalt steht (IA-AB-9) | Ziffernkacheln mit Radius 10 (DG-AB-8) |

### 2.3.16 T14 App-Einstieg

Einsatz: Startbild der App `/app/`. Stufe 2. Die App selbst bleibt bei der strengen Fassung aus GEST (DR, Einleitung); geregelt ist nur der
Einstieg als Bühne.

| Merkmal | Regel |
|---|---|
| Ebenenaufbau | 0 Grund → 20 Foto `app-start.webp` randlos, unten ausgeblendet → 30 Eyebrow, Überschrift, Preiszeile, Cream-Pille, „Schon ein Aufmaß gesichert? Anmelden“ → 40 Kopf. |
| Held | die Figuren im Wohnzimmer; Anker = Licht im Raum. |
| Typografie | App-Skala 40 · 32 · 24 · 17 · 15 · 13 (GEST:27); in dieser Ansicht Größen 32 · 17 · 13 (Headline- und Klein-Stufe neben dem Foto). |
| Bewegung | Foto 600 ms Deckkraft; Bedienschicht ohne Versatz (App-Katalog „Erscheinen 8 px“ hier offen: DG-E-12). |
| Telefon | Foto, Überschrift, Pille auf einem Bildschirm (heute erfüllt, PA 1.8); Pille im Daumenbereich. |
| Nicht | Preiskasten vor dem Foto (PA 1.8); Glas ohne Bild. |

### 2.3.17 Übergänge und Anschlüsse zwischen Abschnitten

1. **[V] Haarlinie mit Nummer** eröffnet jeden Abschnitt der Verkaufsseite (GEST:450) und der Ansicht Hauseigentümer und ist der
   stehende Rahmen dieser Seiten. Kapitelziffern sind in der DNA ein Signature-Effekt (Ref 15; Index als Teil der technischen
   Mikroschicht, 5 von 15); die Grammatik setzt sie deshalb nicht pauschal, sondern nur auf diesen zwei Seiten, die als Abschnittsfolge
   gelesen werden, ruhend und als Klein-UI an der Ordnungslinie (Bedingung DNA 5.4). Ratgeber, Unterseiten und App-Einstieg tragen nur
   die Haarlinie. Zum Budget siehe 2.4.2.
2. **[V] Anschnitt:** Der erste Bildschirm jeder Seite und jeder Abschnitt der Stufe ≥ 3 lässt die Folgesektion 8–25 % anschneiden.
3. **[V] Farbgleicher Grund:** Alle Abschnitte stehen auf `#161616`; es gibt keine Bänder in anderer Grundfarbe.
4. **[H] Überdeckung:** Die Leiste V2 schiebt sich beim Scrollen über den ausgeblendeten Fuß des Startbilds (Ref 12, statisch belegt).
5. **[H] Lichtübertrag als Rahmenbruch:** Das Erdlicht der Bühne fällt als schwacher Streifen über die Abschnittskante in die Leiste,
   wie der Streifen des Zeichens die Kachel verlässt; höchstens einmal je Seite (DG-E-4).
6. **[V] Rhythmus:** höchstens zwei Abschnitte der Stufe ≥ 3 hintereinander, danach mindestens einer der Stufe ≤ 2; nie zwei Abschnitte
   der Stufe 4 direkt hintereinander.

### 2.3.18 Satzbau der Seiten

**Verkaufsseite `/fuer-fensterbauer/`** (Folge nach IA 5.4.2):

| V1 | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9 | V10 | V11 | V12 | V13 | V14 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T1 · 4 | T2 · 3 | T3 A · 2 | T4 · 4 | T5 · 3 | T4-Anhang · 1 | T2 · 2 | T7 · 2 | T6 · 2 | T8 · 2 | T10 · 1 | T9 · 1 | T9-artig · 1 | T11 · 2 |

Prüfung: zwei Stufe-4-Abschnitte (V1, V4), getrennt durch V2 und V3; V1 und V2 sowie V4 und V5 sind je zwei Abschnitte der Stufe ≥ 3 in
Folge, danach folgt Ruhe (V3 bzw. V6); die Entscheidungsflächen V8, V11, V14 bleiben bei Stufe ≤ 2. Wählt der Inhaber für V3 die
Fassung B (Stufe 3), stünden V1 bis V5 als fünf Abschnitte der Stufe ≥ 3 hintereinander; das bricht 2.3.17/6, deshalb bleibt V3 in
Fassung A, oder das Riesenwort wandert an eine andere Stelle (DG-E-3).

**Startseite, Ansicht Hauseigentümer** (IA 5.4.3): H1 T1 · 3 → H2 T4 · 3 → H3 T7 · 2 → H4 Ratgeber-Weg (sechs Kacheln 2 × 3, „Ausmessen“
als Ankerkachel; Stufe 2) → H5 T9 · 1 → H6 T11 · 2 → H7 T11 · 2.

**Ansicht Fensterbauer auf `/`:** dieselbe Folge wie die Verkaufsseite (Einbettung, SKILL:63–64); jedes Element funktioniert mit zwei Wurzeln
und nach Neuaufbau.

**Ratgeber und Fachartikel:** Kopf Stufe 2 → Fließtext Stufe 1 → Handlungsbaustein (Satz 17, eine Cream-Pille) → Fuß.
**Unterseiten:** Stufe 1 durchgehend. **App-Einstieg:** Stufe 2.

---

## 2.4 Drei Ebenen der Konsistenz

### 2.4.1 (a) Über die ganze Website konstant

Jede Zeile ist **[V]**; „neu“ markiert Regeln, die heute nicht in GEST oder DR stehen.

| Bereich | Konstante |
|---|---|
| Konstruktion | Grund → (Kulisse) → ein Fokusträger → flache Bedienschicht; Z-Stufen 0/10/20/25/30/40 (neu); 3–6 Ebenen, am Telefon 3–4; mindestens eine Verdeckung; Bildschicht und Bedienschicht nach G1 (neu) |
| Farbe | Tokens aus `gemeinsam.css:9–32`, keine neuen Farben; Grund `#161616`; Cream nur Hauptaktion, eine Cream-Fläche je Bildschirm; Grün nur Signal, ein Wort je Überschrift; Orange/Blau nur in Zeichnungen; ≥ 80 % unbunt, ≤ 5 % kräftig, > 0,3 % farbig je Bildschirm |
| Licht | nur mit Quelle im Bild; eine Lichtfarbe und eine Lichtrichtung je Bildschirm (neu: Richtung als Token); ein Helligkeitszentrum hinter dem Anker; keine leuchtende Bedienfläche |
| Schatten | keiner auf dunklem Grund; Lichtkante 1 px statt `--float` (neu, DG-AB-1); Begleitschatten nur auf heller Fläche |
| Schrift | Inter; Skala 13, 15, 17, 24, 40 (Telefon 32); Bühnenstimme, Technikstimme, Lesetext; ≤ 3 Größenstufen je Ansicht (neu); Headline ≤ 3 Zeilen; Lesetext ≤ 3 Zeilen je Block auf Verkaufsflächen |
| Form | Vollrundung; Pillen für Knöpfe, Chips, Segmente, Badges; vier Radien voll · 24 · 18 · 12 (neu, DG-AB-8); Karten mit 2-px-Ring; kein Formbruch |
| Raum | linke Spaltenkante als Ordnungslinie; Seitenrand 16 px, Spalte 1040 px; Abschnittsabstand 96/128 px; ≥ 33 % frei im ersten Bildschirm; ein Held je Bildschirm; Fortsetzungssignal am Fuß jedes ersten Bildschirms |
| Bild | randlos auslaufend oder freigestellt; nie Fotokarte als Hauptbild (neu, DG-AB-9); kein Platzhalter als Hauptbild; Text nur in ruhigen Zonen; „Beispiel“ an jedem erfundenen Material |
| Glas | nur über Bildinhalt; Füllung 55–65 % unter Kleintext, Unschärfe 24 px, Sättigung 100 % (neu), 1-px-Kante, kein Schatten; gleichzeitig ≤ 2 Flächen am Telefon, ≤ 3 am Schreibtisch (gestapelte Meldungen zählen einzeln); am Telefon kein Glas über bewegtem Motiv; Ersatz und deckende Fassung nach SG 10.3 |
| Bedienschicht | frontal, flach, matt, formstabil; Zustände: aktiv = Füllung, Hover = Kontur, Fokus = 2-px-Kontur 3:1; Einblenden nur über Deckkraft (neu, DG-AB-2); keine Skalierung, kein Versatz, kein Zählen (neu) |
| Bewegung | Physik nur in der Bildschicht; ein bewegter Träger je Ansicht, auch beim Laden nacheinander statt gleichzeitig; Ein-Drittel-Regel; autonome Bewegung endet ≤ 5 s (neu, DG-AB-5); natives Scrollen; Schleifen nur im Bild; ruhige Fassung = Endbild; Kurven der Bedienschicht `--e-out`/`--e-io` ohne Überschwingen (Federn bis 3 % nur in der Bildschicht) |
| Dauern | Zustand 150 ms (Rückmeldung 220 ms), Panel und Einblenden 320 ms, Motiv-Auftritt 600 ms, großer Motiv-Auftritt 900 ms, Szenenwechsel im Motiv 500–900 ms (DG-AB-16) |
| Technik | keine fremden Server, Bibliotheken mit Lizenz in `web/vendor/`; leichtestes Verfahren; Ersatzstufen 0/1/2; ohne JavaScript lesbar und bedienbar; Budgets nach 2.1.9 |
| Zugang | Text 4,5:1, groß 3:1, Konturen und Fokus 3:1 gegen die ungünstigste Bildstelle; Ziele ≥ 44 px; kein Querscrollen; 200 % Text; Dekorebenen `aria-hidden` und `pointer-events: none` |
| Ehrlichkeit | keine Stimmen, Zähler, Logos, Siegel; „Empfohlen“ statt „Beliebt“; jede Zahl mit Beleg (SKILL:49; RE R7) |

### 2.4.2 (b) Intensität je Bereich: Skala Stufe 1 bis 4

Zwei Klassen von Signature-Effekten machen die Dosierung prüfbar (neu in dieser Grammatik): **informierende** Signaturen tragen Information
und ziehen wenig Blick (Maßlinie, Messraster, Fortschritts-Maßstab, Kennzahl-Kachel); **inszenierende** Signaturen tragen Wirkung (Glas mit
Unschärfe, Explosionsansicht, Bildfolge, Lichtquelle mit Lichtraum, Kantenlicht, Partikel, Bild-Wort-Ergänzung, Rahmenbruch,
Schärfestaffelung).

| Parameter | Stufe 1 ruhig | Stufe 2 klar | Stufe 3 gestaltet | Stufe 4 inszeniert |
|---|---|---|---|---|
| Abschnittstypen | T9 FAQ, T10 Anfrage, T12 Unterseite, T13 Fließtext, V6 | T2 Kennzahlen V7, T3 A, T6 Vertrauen, T7 Pakete, T8 Ablauf, T11 Abschluss, T13 Kopf, T14 App-Einstieg | T1 Bühne H1, T2 Leiste V2, T3 B, T4 H2, T5 Beweis | T1 Bühne V1, T4 Produktdemonstration V4 |
| Ebenen | 3, flach (Grund, Fläche, Schrift) | 3–4 | 4, mit Verdeckung | 4–5 (6 nur in einer Kamera-Szene) |
| Hauptelement | Typografie (DG-E-1) | Bild, Objekt, Maßstab, Beispielbild | Objekt oder Materialszene, 15–35 % der Fläche | Figur, Render oder Gerät im Licht, 25–35 % (Szene bis 100 %) |
| Licht (Intensität 0–4) | 0–1 | 1, nur im Bild | 2, am Motiv mit sichtbarer Quelle | 3, Quelle im Bild, Lichtraum oder Lichtübertrag |
| Material | – | 1 | 2–3 | 2–3, Glas vermittelnd |
| Glasflächen | 0 | 0 (Glas-Chips nur über Foto) | ≤ 1 | ≤ 2 Telefon, ≤ 3 Schreibtisch |
| Bewegung | Zustand; Einblenden über Deckkraft | + nutzergeführt (Wischen) und einmalige Motivbewegung | + scrollgekoppelte Motivbewegung, Physik im Motiv | + Ladeauftritt 900 ms, Tiefe der Bildebenen (0,8–1,0), reaktive Umgebung |
| informierende Signaturen | 0 | ≤ 1 | ≤ 1 | ≤ 1 |
| inszenierende Signaturen | 0 | 0 | 1 | ≤ 2, am selben Fokusträger (belegt: Ref 03, 12) |
| Technikstufe (SKILL:55–59) | 1 | 1 | 1; 2 mit Ersatz möglich | 2 als Standard, wo Tiefe oder Licht den Unterschied machen (SKILL:59), immer mit Ersatzfassung; am Telefon erst nach bestandener Leistungsprüfung (SG 10.8, Mobil) |
| freie Fläche | ≥ 33 % | ≥ 33 % | 40–60 % | 40–60 %, ruhige Bildzonen zählen |
| Bildanteil am Bildschirm | 0–20 % | 20–50 % | 30–60 % | 50–100 % |
| Ruhige Fassung | identisch | Endbild | Endbild der Szene | Endbild; Glas bleibt |

**Abschnittsnummern und Budget.** Die Abschnittsnummer an der Haarlinie (2.3.17/1) ist in der DNA eine informierende Signature
(Kapitelziffern, Ref 15). Sie steht nur auf Verkaufsseite und Ansicht Hauseigentümer und zählt dort als ruhender Teil des Abschnittskopfs
außerhalb des Budgets der Tabelle; das ist eine bewusste Ausnahme von der Dosierung, die als Hypothese geprüft wird (DG-H-1). Auf
Seiten der Stufe 1 ohne Abschnittsfolge (Unterseiten, Ratgeber-Fließtext) entfällt sie.

**Dosierregeln je Seite**

1. **[V]** Entscheidungs- und Arbeitsflächen (T7, T10, T11) nie über Stufe 2 und ohne inszenierende Signature (EA H-D10 als Grundlage; hier
   verbindlich gesetzt, weil jedes zusätzliche Blickziel mit Preis und Knopf konkurriert, RE E2, E3).
2. **[V]** Höchstens zwei Abschnitte der Stufe 4 je Seite, nie direkt hintereinander; höchstens zwei Abschnitte der Stufe ≥ 3 in Folge.
3. **[V]** Jede inszenierende Signature höchstens einmal je Seite; Ausnahmen: Glas mit Unschärfe und Lichtquelle mit Lichtraum an je
   höchstens zwei Orten, nie in zwei aufeinanderfolgenden Abschnitten (Lichtraum in V1 und V4, weil das Licht durch ein Fenster das
   Leitmotiv ist, 2.2.0).
4. **[V]** Der erste Bildschirm einer Verkaufsfläche ist Stufe 3 oder 4; Ratgeber-Kopf Stufe 2; Unterseiten Stufe 1.
5. **[H]** Startseite für Hauseigentümer eine Stufe unter der Verkaufsseite (Höchststufe 3), weil das Messen der zweite Weg ist (PA 1.4) und
   die Startseite die schwerste Ladelast trägt (TD 1.4).

### 2.4.3 (c) Spezialeffekte nur gezielt

| Effekt | DNA-Herkunft | Klasse | Einsatzort | Bedingung | Höchstzahl | Ersatz | Technik |
|---|---|---|---|---|---|---|---|
| Glas mit Hintergrundunschärfe | Ref 01, 03, 12, 14 (4/15) | inszenierend | V1 Glas-Nachrichten (vorhanden); H1 Umschalter-Segment (IA K03) | über Bildinhalt, Haarkante, kein Schatten, Text 4,5:1 gegen die ungünstigste Stelle; am Telefon nicht über bewegtem Motiv | 2 Orte je Website-Bereich; gleichzeitig ≤ 2 Flächen am Telefon, ≤ 3 am Schreibtisch (im Meldungsstapel nur die vorderste mit Live-Unschärfe) | Ersatzfüllung 80 %; deckend bei reduzierter Transparenz | Stufe 1 |
| Partikel im Motiv (Staub im Lichtkegel) | Ref 07; Ref 15 | inszenierend | nur V1, als Variante **anstelle** des Lichtübertrags (Budget Stufe 4, 2.3.3) | reagiert auf Scrolltempo, ≤ 60 Teilchen (DR 3.6), nie unter Lesetext; am Telefon ≤ 30 oder entfällt | 1 | ohne | Stufe 2 nach DR 3.6 (Canvas) |
| Lichtquelle mit Lichtraum bzw. Lichtübertrag | Ref 03, 09, 12, 15; Ref 05, 09, 12, 14, 15 | inszenierend | V1 (Erdlicht), V4 (Licht durch das Fenster) | Quelle im Bild, eine Lichtfarbe, Lichthof 1–1,5 × Fokusträger, ≤ 3 Stopps | 1 je Ansicht, 2 je Seite, nie in Folge (Dosierregel 3) | statischer Verlauf | Stufe 1 |
| Kantenlicht an dunklen Körpern | Ref 09, 10 | inszenierend | in der ersten Fassung keiner; Variante für V4 nur anstelle des Lichtraums (Budget Stufe 4) | dunkler Körper auf dunklem Grund | 1 | eingebacken | im Asset |
| Scrollgekoppelte Bildfolge (Objekt öffnet, Lamellen fahren, Form wechselt) | Neuentwurf; DR 3.6 | inszenierend | V4, H2 | ≤ 60 Bilder, ≤ 3 MB Telefon, erst bei Annäherung; lesbarer Endzustand | 1 je Seite | Poster | Stufe 2 |
| Material-Explosionsansicht mit Annotation | Ref 10 | inszenierend | V5 | ein Objekt mit Schichten, haarfeine Annotation | 1 | auseinandergezogenes Endbild | Stufe 1 |
| Bild-Wort-Ergänzung mit Riesenwort | Ref 03, 05, 07, 08 (4/15) | inszenierend | V3 Fassung B oder H2, dort nur ohne Bildfolge (Budget Stufe 3; DG-E-3) | plastisches Gegenüber, Wort lesbar, Grafik `aria-hidden`, Text doppelt; Prüfsuite braucht eine Ausnahme (DR 3.2) | 1 je Seite | steht | Stufe 1 |
| Rahmenbruch | Ref 05 (1/15) | inszenierend | eine Stelle je Seite, nur Verkaufsseite und Ansicht Hauseigentümer (DG-E-4, DG-AB-18) | genau ein Objekt über genau eine Kante, Körper ≤ 10 %, schmale Teile ≤ 20 % | höchstens 1 je Seite; zählt im Budget des Abschnitts, aus dem er ausbricht | im Rahmen | Stufe 1 |
| Schärfestaffelung an Begleitelementen | Ref 02, 04, 08, 13, 14 (5/15) | inszenierend | nur V2 Ränder | Fokus und Schrift scharf, ≤ 3 Schärfestufen | 1 je Seite | ohne Unschärfe | eingebacken |
| Maßlinie mit Wert | Mikroschicht (5/15); DR Baustein 4 | informierend | V1 am Bullauge; Zeichnungen der Ratgeber | nie über Gesicht oder Hände; Orange = Öffnung, Blau = Element | 1 je Ansicht | fertige Linie | Stufe 1 (SVG) |
| Messraster | Ref 01, 11; DR Baustein 5 | informierend | V4, V5 | ≤ 1,3:1, zum Rand und unter Text ausgeblendet | 1 je Ansicht | gleich | CSS |
| Fortschritts-Maßstab, Abschnittsziffern | Ref 09, 15 | informierend | V10; Nummern an jeder Haarlinie nur auf Verkaufsseite und Ansicht Hauseigentümer (2.3.17, außerhalb des Budgets nach 2.4.2) | Klein-UI; Marken wechseln als Zustand | 1 Maßstab je Seite | alle Marken stehen | CSS |
| Kennzahl-Kachel | Ref 03, 13, 14 (3/15) | informierend | V7 | nur belegte Zahlen; kleiner als das Hauptelement; zählt nicht hoch | 1 Reihe je Seite | gleich | CSS |

**Bewusst nicht eingesetzt:** Dunst, Repoussoir, Raumszene als Hauptmittel (keine Kamera-Szene geplant); Laschenkarte, Formreim, gestufte
Radien als Ordnungsmittel; Punze als Bildfenster (Riesenschrift nur einmal, und das Fenster in einem Buchstaben wäre ein Wortspiel auf der
Bildebene, das GEST:9 nur sparsam erlaubt); Schein als Zustand; Teilüberdeckung mit Farbübertrag (keine gesättigten Farbfelder);
Objektschatten; Bewegungsunschärfe; zerlegte Lettern; eigener Cursor; Echtzeit-3D auf Verkaufsflächen; Glow-Kacheln (nicht DNA-konform).

### 2.4.4 Prüffragen je Ansicht

1. Lässt sich die linke Ordnungslinie einzeichnen, und bleibt im Blinzeltest bei 390 × 844 genau ein Fleck, der Held?
2. Gehört jedes Element zur Bild- oder Bedienschicht, und bewegt sich in der Bedienschicht nichts außer Zuständen?
3. Ist das Hauptelement am Telefon nicht textlich (G4), mit höchstens drei Größenstufen?
4. Hat das Licht eine Quelle im Bild, eine Farbe, eine Richtung, ein Helligkeitszentrum?
5. Liegt kein Schatten auf dunklem Grund, und ist Glas nur über Bildinhalt?
6. Stimmen Stufe und Signature-Budget mit 2.4.2 überein, und hält die Seite den Rhythmus aus 2.3.17?
7. Ist genau eine Cream-Fläche im Bildschirm, ein grünes Wort je Überschrift, ≥ 80 % unbunt?
8. Endet jede autonome Bewegung nach höchstens 5 s, und zeigt „weniger Bewegung“ das Endbild?
9. Ist die Ansicht ohne JavaScript, eingebettet in `/#fensterbauer` und nach Neuaufbau vollständig?
10. Ist jedes erfundene Material als „Beispiel“ gekennzeichnet und jede Zahl belegt?

---

## 2.5 Verhältnis zu den heutigen Markenregeln

### 2.5.1 Was bleibt

| Heutige Regel | Quelle | DNA-Bezug |
|---|---|---|
| Dunkle Bühne `#161616`, Tokens, keine neuen Farben | GEST:24; DR 3.1 | Grundton frei (DNA 5.5); dunkle Lichtbühne in B (Ref 09, 12) |
| Inter, Skala 13–40 (32), Gewichte 500/700/800 | GEST:26; SKILL:69 | Schriftgattung frei; Skala trägt den Sprung nur mit Bild (2.2.6) |
| Bühnenstimme und Technikstimme | DR 3.2 | zwei Stimmen (Regel Ref 07), feste Rolle je Gattung (Ref 10, 11) |
| Eine Cream-Pille je Bildschirm, ein grünes Wort je Überschrift | SKILL:68–71; GEST:24 | Einmal-Elemente; Akzentrolle an der Hauptaktion (SG 10.9) |
| Pillen für Knöpfe, Chips, Segmente, Badges; Pfeil im Kreis | GEST:32, :36 | Vollrundung 11/13; Pfeil im Kreis 6/15 |
| Glas nur über Bildern, Licht nur mit Quelle, keine Verläufe als Schmuck | DR 3.1, DR 5; GEST:24 | Regel Ref 03; Nr. 10, 11 |
| Ein Held je Bildschirm, echtes Material, Ebenen | DR 1, 2; SKILL:41 | Nr. 2, 3; Vitrine; Materialgefälle |
| Anschnitt bis an den Rand, Text nie | DR 3.3 | Fortsetzungssignal 8/15; SG 10.5/7 |
| Linksbündiges Startbild mit Kicker → Headline → Lead → Pille | GEST:36 | Ordnungslinie, Lesestapel (Regel Ref 02) |
| Randlose Fotos, in den Grund ausgeblendet | GEST:34 | Nr. 4, gerichteter Auslauf |
| Abschnittsnummer mit Haarlinie in der Technikstimme | GEST:450 | in der DNA Signature (Kapitelziffern Ref 15, Mikroschicht 5/15); bleibt auf der Verkaufsseite, kommt auf die Ansicht Hauseigentümer, nicht auf Ratgeber und Unterseiten (2.3.17) |
| Riesenschrift nur als Grafik, einmal je Seite | DR 3.2 | Raumschrift variabel, Kulissenschrift dekorativ und doppelt (SG 10.2/9) |
| Ruhige Fassung mit Endbild; Schleifen nur im Bild; keine fremden Server | SKILL:60–62; DR 3.5 | SG 10.7/6–7; 10.8 |
| Lottie: ein Bewegtbild erklärt an genau dieser Stelle, nie zwei auf einem Bildschirm | GEST:58 | ein bewegter Träger je Ansicht |
| Abstände 96/128 px, innen 4-px-Raster | DR 3.3; GEST:32 | Abstandsverhältnis 1 : 3 : 6 |
| Ziele ab 44 px, kein Querscrollen | SKILL:71 | WCAG 2.5.8, 1.4.10 |
| Name, Wortmarke, Zeichen | GEST:7 | unverändert; das Zeichen wird Leitmotiv (2.2.0) |

### 2.5.2 Was die DNA erweitert

| Erweiterung | Inhalt | Quelle |
|---|---|---|
| Ebenen-Tokens und G1 | Z 0/10/20/25/30/40; Bild- und Bedienschicht mit getrennten Gesetzen | DNA 5.1; SG 10.2 |
| Flächenregeln | ≥ 33 % frei; Fokusträger 15–35 %; Textfläche ≤ 15 %; ≤ 40 Wörter; Kopf ≤ 8 % | SG 10.1, 10.9 |
| Maßstabssprung | ≥ 3×; am Telefon nicht-textliches Hauptelement (G4); ≤ 3 Größenstufen | Nr. 7; SG 10.1/4 |
| Licht-Token | eine Lichtrichtung je Ansicht, Lichtkanten folgen ihr | SG 10.4/9 |
| Zustandskanäle | aktiv = Füllung, Hover = Kontur, Fokus getrennt | DNA 5.6.10; SG 10.7/8 |
| Kontrast gegen Bild | 4,5:1 / 3:1 an der ungünstigsten Stelle, bei Video je Frame | SG 10.6/6 |
| Ersatzstufen und Budgets | Stufe 0/1/2, LCP, INP, CLS, Asset-Größen | SG 10.8 |
| Intensitätsskala und Signature-Klassen | Stufe 1–4; informierend/inszenierend; Dosierregeln | diese Grammatik, auf DNA 5.3/5.4 gestützt |
| Korn und Raster eingeschränkt | Korn nur eingebacken; Raster nie unter Lesetext | SG 10.3/2, /12 |
| Kopf und Glas | Glas nie ohne gefilterten Bildinhalt | SG 10.3/6 |

### 2.5.3 Wo die DNA widerspricht

Jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | Bestehende Regel | Vorschlag | Begründung | Abgleich |
|---|---|---|---|---|
| DG-AB-1 | „Schatten wirft nur, was schwebt: Glas, gedrehte Karten, Geräte“, Schatten `--float` (DR 3.1, DR Bausteine 1, 2, 8); `--float` an Blättern und Dialogen (GEST:24, :32) | Auf dunklem Grund kein Schlagschatten; Schwebendes bekommt eine 1-px-Lichtkante in Lichtrichtung und wird über Verdeckung verankert; blasser Begleitschatten nur auf heller Fläche (Bestellmaß-Karte auf dem weißen Blatt) | Nr. 6 (12/15, Website-Heros 11/11); Figur-Grund-Trennung auf dunkler Fläche über Licht (SG 10.4/7); `0 24px 60px rgba(0,0,0,.6)` auf `#161616` ist kaum sichtbar und widerspricht dem Prinzip | EA AB-7, hier auf Glas-Nachricht und Menüblatt erweitert |
| DG-AB-2 | Auftritt: „Aufblenden, 24 px aufsteigen, von 0,98 auf 1 wachsen“ (DR 3.5); Karten und Bänder erscheinen so (GEST:448); Katalog 1 „Erscheinen 8 px aufwärts“ (GEST:39) für Website-Flächen | Bedienschicht blendet einmal nur über Deckkraft ein (320 ms); Versatz und Wachsen nur für Bildebenen (Foto, Medienkarte, Beispielbild) | SG 10.10 Nr. 14 und DNA-B B.1/3: keine Bewegung der Bedienschicht über Zustandswechsel hinaus; Tiefe und Physik bleiben in der Bildschicht (SKILL:43) | neu |
| DG-AB-3 | Katalog 4 „Fehler (Rütteln, 300 ms)“, 5 „Zahlen laufen nach“, 6 „Einrasten aus 1,06“ (GEST:39); „Zahlen laufen hoch“ (GEST:41); Zahlenkacheln zählen hoch (GEST:450) | Auf der Website: Fehler über Rand, Satz und Fokus; Zahlen in der Bedienschicht stehen; Zählen nur in der Bildschicht (Wert der Maßlinie). Die App behält ihren Katalog | SG 10.7/1–3; DNA-B B.3.10 („hochzählender Kennzahl-Zähler“ zerstört die Kachel) | neu |
| DG-AB-4 | „Federn nur, wo die Hand direkt führt, mit höchstens 3 % Überschwingen“ (DR 3.5) für Bedienelemente; Paketreihe „läuft ein Stück nach links und federt zurück“ (GEST:452) | Paketkarten folgen dem Finger mit nativer Trägheit und `scroll-snap`, ohne Überschwingen und ohne Einlauf-Hinweis; Federn mit ≤ 3 % sitzen im Beispielbild | SG 10.7/2; DNA Nr. 5; „Trägheit und Federn“ (SKILL:43) bleibt über Motivphysik erfüllt, ob ihm das genügt, entscheidet der Inhaber (DG-H-2) | EA AB-9 |
| DG-AB-5 | Umgebung „Licht atmet in 6 bis 10 s, Staub treibt“ (DR 3.5); Meldungen fallen alle 3,4 s neu ein (GEST:447); Leisten laufen dauernd mit 30 px/s (GEST:451) | Autonome Bewegung endet nach höchstens 5 s (drei Meldungen in < 5 s, dann Stand); Umgebung und Leisten bewegen sich nur mit Scrolltempo oder Berührung und laufen mit Trägheit aus | WCAG 2.2.2 (RE R2; SG 10.10 Nr. 18); ein bewegter Träger (SG 10.7/4); „Schleifen nur mit Reaktion“ (DR 3.5) und „Reaktion auf die Scrollgeschwindigkeit“ (SKILL:44) | erweitert EA AB-8 |
| DG-AB-6 | „Gewölbte Leiste (Mitte groß, Rand gedreht und unscharf)“ mit `rotateY` je Abstand (DR 3.6); „Leiste 1 gewölbt (Einträge drehen zum Rand weg)“ (GEST:450) | Nur die Bilder wölben sich (Bildschicht); Namen bleiben frontal und wechseln über Deckkraft, sichtbar nur unter dem Lichtkegel | keine perspektivische Bedienschrift (Nr. 1; SG 10.2/4); entspricht DR Baustein 9 („ein Lichtkegel in der Mitte benennt das Element darunter“) | neu |
| DG-AB-7 | „Die zweite [Leiste] direkt darunter in Cream mit dunkler Schrift“ (GEST:451) | Kennzahlen-Leiste auf dunklem Grund, Zahlen in `--text`; Cream bleibt der einen Hauptaktion je Bildschirm | eine Cream-Fläche je Bildschirm (GEST:24); großer Hellwert konkurriert mit dem Anker (Nr. 3; SG 10.10 Nr. 5); kein Abschnitt in anderer Grundfarbe | ergänzt IA-AB-7 (Lage) um die Farbe |
| DG-AB-8 | Radien 8 · 12 · 18 · 24 und Pille (GEST:32); Ziffernkacheln mit Radius 10 (GEST:431) | Vier Werte auf Website-Flächen: voll · 24 (Container, Paketkarte, Bildcontainer) · 18 (Glas-Nachricht, Menüblatt) · 12 (Medienkarte, Felder, Kacheln innen, Ziffernkacheln) | höchstens vier Radienwerte einschließlich „voll“ (SG 10.5/2, Ableitung aus Ref 14) | neu; App unverändert |
| DG-AB-9 | „Überall sonst steht das Foto in einer Fotokarte (Karte mit Rand und Radius 24, unten Haken-Chips)“ (GEST:34) | Hauptbild jeder Ansicht als Bühne: randlos auslaufend, freigestellt oder als Objekt der Szene; Fotokarte nur noch als Abbildung im Ratgeber-Fließtext | Nr. 4: Hauptbild als gerahmte Beigabe neben dem Text unzulässig (SG 10.6/1; 10.10 Nr. 7) | neu |
| DG-AB-10 | Kopf „klebt oben, halbtransparent wie die App“ (GEST:428) | Über Bildern flächenlos mit Scrim, über Inhalt opak mit Haarlinie | Glas ohne sichtbar gefilterten Bildinhalt ausgeschlossen (SG 10.3/6); „Kein Glas ohne Bild dahinter“ (DR:196) | neu |
| DG-AB-11 | „Kacheln für Fakten … am Schreibtisch vier, Abstand 12 px“ (DR 3.3) | Am Schreibtisch eine Ankerkachel über zwei Spalten plus zwei kleinere, oder eine große und drei kleine | kein Feld gleichrangiger Kacheln ohne Anker (SG 10.10 Nr. 11); DR verlangt selbst „Eine Kachel je Reihe darf Licht tragen“ | neu |
| DG-AB-12 | „Kartenreihen. Um 2 bis 4° gedreht, 8 bis 24 px versetzt … Schatten `--float`“ (DR 3.3) | Drehung nur für reine Bildkarten ohne Bedienelemente (`aria-hidden` oder Bild mit `alt`), mit Lichtkante statt Schatten | keine räumlich transformierte Bedienschicht (Nr. 1); Nr. 6 | neu |
| DG-AB-13 | „Am Telefon hält eine feste Bühne bis zu zwei Bildschirmhöhen“ (DR 3.5) | Am Telefon keine Anheftstrecke; am Schreibtisch ≤ 1,5 Bildschirmhöhen mit ≥ ⅓ Ruhe | SG 10.7, Mobil (Neuentwurf); kürzere Wege zu den Paketen (EA H-D2) | EA AB-10 |
| DG-AB-14 | empfohlene Karte mit „einem leichten grünen Schein oben“ (GEST:452) | entfällt; Hervorhebung über Cream-Ring, Kontur-Pille „Empfohlen“ und den einzigen Cream-Knopf | kein Leuchten ohne Quelle (DR:196); Nr. 10 | EA AB-5 |
| DG-AB-15 | „Parallaxe, Neigen per Maus und Lesefortschritt gibt es nicht“ (GEST:41, :448) | Parallaxe der Bildebenen (Faktor 0,8–1,0) zulässig, Bedienschicht ohne Versatz; Lesefortschritt nur als Zustand (Abschnittsnummer aktiv) oder nach Freigabe als begründete Ausnahme (DG-E-7); Neigen per Maus bleibt ausgeschlossen | Tiefe beim Scrollen und Lesefortschritt sind heute schon gebaut (`verkauf.js:158–166`, `:448–465`; PA-Frage 27); SG 10.7/13 lässt Bildparallaxe zu, DNA-B B.3.12 verlangt für eine laufende Linie eine Ausnahme | löst PA-Frage 27 |
| DG-AB-16 | „Drei Dauern 150 · 220 · 320 ms … Katalog, mehr gibt es nicht“ (GEST:38) | Website: Zustand 150, Rückmeldung 220, Panel und Einblenden 320 ms; Motiv 600 und 900 ms; Szenenwechsel im Motiv 500–900 ms | DR 3.5 nutzt 600/900 ms schon; SG 10.7 trennt UI-Dauern von Motivdauern | löst PA-Frage 27 |
| DG-AB-17 | Glas mit „Sättigung 140 %“ (DR 3.1) | Sättigung 100 % | SG 10.3 und 10.9: 90–100 %, keine Anhebung (Ref 01 zeigt eher Entsättigung); DNA-B B.3.9 und PROMPT nennen die Anhebung als Fehler. In SG ist der Wert ein Vorschlag, daher Empfehlung | neu |
| DG-AB-18 | „Je Seite bricht mindestens einmal etwas aus seinem Rahmen“ (DR 3.3; DR 6 als Prüffrage) | Rahmenbruch höchstens einmal je Seite und nur auf Verkaufsseite und Ansicht Hauseigentümer; Ratgeber, Unterseiten und App-Einstieg ohne | Der Rahmenbruch ist in der DNA ein Signature-Effekt aus einer Referenz (Ref 05, 1 von 15; SG 10.6/12 [Optional]); als Pflicht je Seite stünde er pauschal überall, auch in Abschnitten der Stufe 1 und 2 ohne inszenierende Signature (2.4.2) | neu |
| DG-AB-19 | Fragen als „`details` als Karten, 48 px hoch“ (GEST, Ratgeber) | Fragen als Zeilen mit Haarlinien ohne Kartenfläche, 52 px hoch (Kontrollhöhe `--h2`) | acht gleich große Karten untereinander sind ein Feld gleichrangiger Flächen ohne Anker (SG 10.10 Nr. 11); Haarlinien ordnen ohne Fläche (SG 10.5/5); Stufe 1 bleibt ein flacher Stapel (2.4.2) | neu |

### 2.5.4 Abgleich mit Entscheidungs- und Informationsarchitektur

- **Übereinstimmend übernommen:** EA AB-4 (Verkaufsstand als Satz), AB-5 (= DG-AB-14), AB-7 (in DG-AB-1), AB-8 (in DG-AB-5), AB-9 (= DG-AB-4),
  AB-10 (= DG-AB-13), AB-11 (Namensleiste über der Reihe); IA-AB-8 (Platzhalter-Bildplätze entfallen), IA-AB-12 (kürzeres Startbild).
- **Präzisiert:** IA K15 plant die Bestellmaß-Karte als Glas; die Grammatik setzt sie opak mit Lichtkante, weil Text auf Glas über weißem
  Papier 4,5:1 verfehlt und das Glasbudget bei V1 und H1 liegt (2.3.7). IA 5.5.7 nennt in V3 die „Teilüberdeckung als Vorher-nachher-
  Vergleich“ als Signature; ohne Glas und Farbübertrag ist sie verbindliche Verdeckung, keine Signature, und V3 bleibt Stufe 2 (2.3.5).
- **Offen gelassen:** Paketname 24 px in IA K19 gegen höchstens drei Größenstufen (DG-E-2); Menü als Blatt von unten (IA K02) als Bewegung
  der Bedienschicht (DG-E-12); Beispielbild ein Drittel (IA-H-14) oder die Hälfte (EA S4) der Karte.

---

## 2.6 Offene Gestaltungsentscheidungen und Hypothesen

### 2.6.1 Offene Entscheidungen

| Nr. | Frage | Optionen | Empfehlung | Betrifft |
|---|---|---|---|---|
| DG-E-1 | Maßstabssprung in reinen Textansichten am Telefon: 32/13 = 2,46× unterschreitet die 3× der DNA (SG 10.1/4); dazu verfehlt die Markenskala den SG-Vorschlag Headline : Fließtext (Desktop 3–4,5×, mobil ≥ 2,25×) mit 40/17 = 2,35× bzw. 32/17 = 1,88× | A jede Ansicht bekommt ein nicht-textliches Hauptelement; B Abschnittsüberschrift 40 px auch am Telefon, wo kein Bild steht (Abweichung von bestehender Regel GEST Rollen und SKILL:69 – Freigabe durch den Inhaber nötig); C Lese- und Arbeitsflächen als dokumentierte Ausnahme mit Hierarchie über Gewicht und Tonwert (Ref 01, 14) | A für Verkaufsabschnitte (Vertrauen mit Instanz-Bild, Ablauf mit Maßstab), C für FAQ, Formular, Unterseiten; B nur, falls C nicht freigegeben wird | T6, T9, T10, T12 |
| DG-E-2 | Paketkarte: Name 24, Preis 32, Klein-UI 13–15 ergeben vier Stufen neben dem Beispielbild | A Paketname 17 fett (Abweichung von bestehender Regel GEST:449, „24 Zwischentitel und Paketname“ – Freigabe durch den Inhaber nötig); B Name 24 und Preis 24 (Preis verlässt die Titelrolle 40/32, ebenfalls Abweichung von GEST:449); C Ausnahme für die Karte | A: Der Preis ist die Headline-Stufe, der Name Klein-UI | T7; IA K19 |
| DG-E-3 | Ob und wo das eine Riesenwort steht, welches Wort | V3 Fassung B („Marke“ oder „Domain“, **Textentwurf**); H2 (dann ohne Bildfolge, weil Stufe 3 nur eine inszenierende Signature trägt); keines | Erste Fassung ohne Riesenwort auf der Verkaufsseite (Rhythmus 2.3.18, Zielkonflikt mit V5, Prüfsuite-Ausnahme nötig); Prüfung als Variante in Phase F | T3, D18 |
| DG-E-4 | Welcher Rahmenbruch je Seite | A Lichtübertrag aus der Bühne in die Leiste; B Fenster-Render bricht in V4 über die Oberkante seines Bildbereichs; C Aufmaßblatt ragt in V5 über die Abschnittskante | A, weil sie das Zeichen zitiert, ohne neues Material auskommt und als Teil des Lichtübertrags von V1 kein zusätzliches Budget braucht; B und C überschreiten das Signature-Budget von V4 (Bildfolge, Lichtraum) bzw. V5 (Explosionsansicht) nach 2.4.2 | 2.3.17 |
| DG-E-5 | Glas-Nachricht: Füllung 60 % und Unschärfe 24 px (heute) bestätigen? | bleiben; Unschärfe 32 px nach SG-Startwert | bleiben (liegt in beiden Spannen) | T1 |
| DG-E-6 | Kleinste Schrift: Marke 13 px; SG und DNA-B schlagen ≥ 14 px und ≥ Fließtext ÷ 1,25 (13,6 px) vor | 13 behalten; 13 nur für Versal-Mikrolabels (Kicker, Nummern), sonst 15 (Abweichung von bestehender Regel GEST, etwa Steuerzeile „netto zzgl. MwSt. · nur für Unternehmer“ in 13 px – Freigabe durch den Inhaber nötig) | 13 nur für Versal-Mikrolabels der Technikstimme, bedeutungstragende Kleintexte in 15 | alle; bei Freigabe ändern sich die 13-px-Angaben in T1 (Chips, Preiszeile), T5 (Beschriftungen), T7 (Steuerzeile, Kurzname, „Empfohlen“), T10 und T11 |
| DG-E-7 | Lesefortschritt im Kopf: laufende 2-px-Linie (heute) oder Zustand je Abschnitt | A laufende Linie als begründete Ausnahme von SG 10.10 Nr. 14; B Abschnittsnummer im Kopf wechselt als Zustand; C ohne | B | T0 |
| DG-E-8 | Lichtrichtung als Haus-Token aus dem Zeichen oder je Foto | Haus-Token mit Ausnahme je Foto; nur je Foto | Haus-Token, Foto geht vor | 2.2.0 |
| DG-E-9 | Haptik-Tipp beim Einrasten der Paketreihe am Telefon | ja; nein | Inhaber entscheidet (nirgends festgelegt, TD 7 Nr. 13) | T7 |
| DG-E-10 | 2-px-Ring der Karten gegen „haarfeine Kontur“ der DNA | 2 px behalten (≈ 1,3:1, wirkt als Kante); 1 px | 2 px behalten; Ring-Knöpfe und Felder brauchen als einzige Grenze 3:1 (z. B. `--muted` ≈ 5,9:1) | alle |
| DG-E-11 | Startbild am Telefon: Foto ab y = 0 unter flächenlosem Kopf oder ab y = 56 (IA) | je nach oberem Bildrand | am echten Foto prüfen; nur mit ruhigem, dunklem oberem Rand ab y = 0 | T1 |
| DG-E-12 | Bewegungen der Bedienschicht, die IA oder App vorsehen: Menüblatt von unten (IA K02), App-Katalog „Erscheinen 8 px“ im App-Startbild | als Ausnahme freigeben; nur Deckkraft | Website: nur Deckkraft; App-Startbild nach App-Regeln, bis der Inhaber anders entscheidet | T0, T14 |
| DG-E-13 | Technikstufe des Startbilds V1: Foto mit Tiefenkarte (2,5-D, WebGL) oder Parallaxe in Stufe 1 | Stufe 2 mit Ersatz; Stufe 1 | Stufe 2 als Standard, weil der Inhaber mit modernen Seiten vergleicht (SKILL:59, :123–124), mit Stufe 1 (Foto mit Parallaxe) als Ersatzfassung; am Telefon erst nach bestandener Leistungsprüfung auf einem mittleren Android-Telefon (SG 10.8, Mobil; SKILL:61); Entscheidung im Telefon-Test des Inhabers (SKILL:113). Zielkonflikt mit SG 10.8/2 („leichtestes ausreichendes Verfahren“) offen, Begründung nach SG 10.8/2 zu dokumentieren | T1 |
| DG-E-14 | Öffnen der Fragen: Höhenwechsel ohne Animation wirkt als Sprung, der Inhaber will „nichts … springt“ (SKILL:48) | A Höhe wechselt sofort, Antwort blendet 220 ms ein; B Höhe über `grid-template-rows` 0fr → 1fr in 220 ms (Layout-Animation gegen SKILL:56 „nur transform und opacity“ und die Codesperre gegen animierte Höhe, SG 10.10 Umsetzung 5); C Folgezeilen gleiten per `transform` nach (Versatz der Bedienschicht, gegen G1 und SG 10.8) | A gegen B im Telefon-Video vergleichen, Inhaber entscheidet; C nicht | T9 |

### 2.6.2 Hypothesen

Prüfwege wie in EA 4.7.1: Telefon-Video bei 390 × 844 (SKILL:109–113), Sichtprüfung durch den Inhaber, Lesetest mit Fensterbauern,
Bildschirmfotos mit `farbanteil.py`. Vergleichstests sind nicht eingerichtet.

| Nr. | Hypothese | Grundlage | Gegenrisiko | Prüfweg |
|---|---|---|---|---|
| DG-H-1 | Die Trennung in informierende und inszenierende Signaturen hält die Seite ruhig und lässt sie trotzdem hochwertig wirken | DNA 5.3 „eine Ausdruckslast“; SKILL:48 | wirkt zu sparsam | Sichtprüfung beider Stufen-Folgen als Video |
| DG-H-2 | Physik nur in der Bildschicht erfüllt „Trägheit und Federn“ (SKILL:43) für den Inhaber | SG 10.7/2; Motivphysik | Inhaber vermisst federnde Karten | Telefon-Video: Karte mit und ohne Federn im Beispielbild |
| DG-H-3 | Die Lichtrichtung aus dem Zeichen verbindet Marke und Szenen erkennbar | GEST:7 | Fotos haben andere Lichtquellen | Sichtprüfung je Bühne |
| DG-H-4 | Lichtkante statt `--float` wirkt auf dunklem Grund mindestens so hochwertig | Nr. 6; SG 10.4/7 | Schweben wird weniger deutlich | zwei Fassungen der Glas-Nachricht im Video |
| DG-H-5 | Die Explosionsansicht macht „was ankommt“ schneller verständlich als eine Liste | E6 (RE): Animation, die den Gegenstand zeigt | Ablenkung vom Inhalt | Lesetest: „Was steht in jeder Anfrage?“ |
| DG-H-6 | Eine vorgerenderte Bildfolge aus der eigenen WebGL-Bühne (Fenster öffnet, Raffstore fährt) ist in tragbarer Qualität erzeugbar | TD 6.1; `?gl=voll`, Playwright | Rechenzeit und Bildqualität ohne Grafikchip ungeprüft | Probeaufnahme von 60 Bildern |
| DG-H-7 | Ein Bild der Instanz-Startseite, die nur den Beispielbetrieb zeigt, belegt „Nur Ihr Betrieb“ stärker als Text | R7 (RE); echtes Material | wirkt wie Werbung für Essential | Lesetest |
| DG-H-8 | Der Ausschnitt des Startbilds als Klammer am Seitenende bindet den Abschluss an den Anfang | Rhythmus | Wiederholung wirkt leer | Sichtprüfung |
| DG-H-9 | Leisten, die nur auf Scrolltempo reagieren, wirken lebendig genug | SKILL:44; DG-AB-5 | wirken stehend | Telefon-Video beim Scrollen |
| DG-H-10 | Ein opaker Kopf über Inhalt wirkt ruhiger als ein halbtransparenter | SG 10.3/6 | weniger „App-Gefühl“ | Sichtprüfung |
| DG-H-11 | Vier statt fünf bis sechs Radienwerte fallen nicht auf und vereinheitlichen | SG 10.5/2 | Glas-Nachricht wirkt weniger wie iPhone | Sichtprüfung der Glas-Nachricht mit 18 px |
| DG-H-12 | Die Cream-Pille als zweiter Pol auf der Diagonale konkurriert nicht mit dem Lichtanker | SG 10.1/2 (Ref 01) | Blinzeltest zeigt zwei Flecken | Blinzeltest bei 390 × 844 |

### 2.6.3 Material, das fehlt (anfragen, nicht erfinden)

Nach SKILL 7 mit Zweck, Format, Pixelmaß, Freistellung, Licht und Blickrichtung anzufragen:

- Beispielbilder je Paket (EA O-12; heute Skizzen, `functions/pakete-seite.js:92–108`).
- Neue Bildschirmaufnahmen des Konfigurators unter der Beispieldomain (Stand 21.10.2026 veraltet, PA 1.7) für V4 und die Leiste V2.
- Vorgerenderte Bildfolge eines Fensters (öffnen, Raffstore, Formwechsel) aus der eigenen Bühne (DG-H-6).
- Bild der Instanz-Startseite für V9 (DG-H-7).
- Bild der Person für den Anbieterblock, falls gewünscht (EA O-9).
- Echte Figur für die Fehlerseite und die Ratgeber-Köpfe statt der Platzhalter (PA 1.9/2).

### 2.6.4 Grenzen dieses Dokuments

- Die DNA ist aus Desktop-Standbildern gewonnen; jede Regel zum Telefon, zu Folgeabschnitten und zu Bewegung ist hier Neuentwurf auf
  Grundlage der Prinzipien und als solcher zu prüfen.
- Alle Pixellagen sind geplant, nicht gemessen; maßgeblich sind die Regeln, aus denen sie folgen (SG 10.9).
- Die Intensitätswerte der Matrix sind Ziele auf einer ordinalen Skala, deren Konsenswerte aus simulierten Rollen stammen; sie sind Prüfmaß,
  keine Messung.
- Inhalte, Reihenfolge und Wortlaut entscheiden EA, IA und der Inhaber; diese Grammatik regelt nur, wie sie aussehen.

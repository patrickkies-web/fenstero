# 16. Abschlussdokumentation: verbindliche Gesamtspezifikation

[← Übersicht](README.md)

Ergebnis 13 des Website-Blueprints (MASTER-PROMPT V4), Phase N. Stand 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`.
Planungsdokument: Das Repository wurde nur gelesen; gebaut, geändert oder eingecheckt wurde nichts. Dieses Kapitel enthält keinen Code.

**Was dieses Dokument ist.** Die eine Datei, mit der ein erfahrener Frontend-Entwickler die neue Website baut, ohne grundlegende
Gestaltungsentscheidungen neu zu treffen. Es fasst die Entscheidungen aus den Kapiteln 01 bis 15 zusammen, nennt für jede Seite und jeden
Abschnitt die maßgebliche Spezifikation, legt Tokens, Komponenten, Assets, Bewegungs- und Responsive-Regeln und die Abnahme je Seite an
einer Stelle ab und trennt das von dem, was der Inhaber noch freigeben oder entscheiden muss. Es trifft **keine neue
Gestaltungsentscheidung**. Wo Dokumente einander widersprechen, nennt es die Stelle, die nach der bestehenden Rangfolge gilt (16.1.7).
Pixellagen, Wortlaute und Zustände einzelner Abschnitte stehen weiter in den Spezifikationen; hier stehen sie nur, wo Systemregeln oder
Abnahme sie brauchen.

**So wird gebaut**

1. Dieses Dokument lesen: Entscheidungen (16.1), Seiten (16.2), Tokens (16.3), Komponenten (16.4), Bewegung (16.6), Responsive (16.7).
2. Je Abschnitt die Spezifikation in [09-abschnitte/](09-abschnitte/) mit den Teilen A bis I lesen (A Funktion, B Inhalt, C Layout,
   D DNA, E Blickfolge, F Bewegung, G Responsive, H Technik, I Begründung und Freigaben); wo dieses Dokument oder
   [11-designsystem.md](11-designsystem.md) einen Wert anders setzt, gilt der Wert nach 16.1.7.
3. Dateien, Schnittstellen, Prüfsuite und Reihenfolge stehen in [15-implementierung.md](15-implementierung.md).
4. Jede Abweichung von einer bestehenden Regel (16.9) wird hinter einem Schalter gebaut, der bis zur Freigabe den Bestandswert trägt
   (Festlegung 15-2).
5. Abnahme je Seite nach 16.8; Prüfung mit Menschen nach [14-realitaetspruefung.md](14-realitaetspruefung.md), Abschnitt 14.5.

**Grundlage**

| Kürzel | Datei |
|---|---|
| PA, Bestand | [01-projektanalyse.md](01-projektanalyse.md), [bestand/](bestand/) |
| DG | [02-design-grammatik.md](02-design-grammatik.md): G1–G9, T0–T14, Stufen 1–4, DG-AB-n, DG-E-n, DG-H-n |
| RE | [03-recherche.md](03-recherche.md), [recherche/](recherche/): E1–E19, R1–R14, T1–T19 |
| EA | [04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md): Z1, Z1a, Z1+, Z2a, Z2; FB-n, HE-n, M-n; AB-n; O-n |
| IA | [05-informationsarchitektur.md](05-informationsarchitektur.md): K01–K37, IA-AB-n, IA-O-n |
| KA–KD | [06-konzepte/](06-konzepte/) |
| EV | [07-expertenvergleich.md](07-expertenvergleich.md): Architektur E, E-1 bis E-13, H-E1 bis H-E10, E-AB-n, C′, B′, T-1 bis T-7 |
| ZA | [08-zielarchitektur.md](08-zielarchitektur.md): Sitemap S1–S32, Navigation N1–N13, Abschnittsfolgen, Festlegung 8 |
| Spezifikation `xx-nn` | [09-abschnitte/](09-abschnitte/) (33 Dateien); „`fb-06` C“ = dort Teil C |
| PE | [10-paketentscheidung.md](10-paketentscheidung.md): P1, Festlegungen 10-1 bis 10-4, J-R-n, J-H-n, J-AB-n, J-O-n |
| DS | [11-designsystem.md](11-designsystem.md): K-1 bis K-40, DS-AB-n, DS-H-n |
| ST | [12-storyboard.md](12-storyboard.md): Szenen FS, HA, SR; Festlegung 12-1; ST-H-n |
| WF | [13-wireframes.md](13-wireframes.md), [wireframes/](wireframes/) |
| RP | [14-realitaetspruefung.md](14-realitaetspruefung.md): RP-01 bis RP-65, Festlegungen 14-1 bis 14-23, 14-AB-n, V-1 bis V-12, 14-O-n |
| IM | [15-implementierung.md](15-implementierung.md): Festlegungen 15-1 bis 15-15, 15-AB-1, N1–N12, S0–S9, R1–R19, 15-O-n |
| DNA, SG, DNA-B, PROMPT, VGL | [../design-dna/03-design-dna.md](../design-dna/03-design-dna.md), [04-styleguide.md](../design-dna/04-styleguide.md) (10.1–10.10), [05-ergebnis-b-styleguide.md](../design-dna/05-ergebnis-b-styleguide.md), [06-design-prompt.md](../design-dna/06-design-prompt.md), [02-vergleich.md](../design-dna/02-vergleich.md) |
| SKILL, DR, GEST | `.claude/skills/premium-gestaltung/SKILL.md` (Anforderungen des Inhabers, verbindlich), `…/designrichtung.md`, `docs/GESTALTUNG.md` (heutige Regeln, dürfen hinterfragt werden) |
| Code | PS `functions/pakete-seite.js` · RB `scripts/ratgeber-bausteine.mjs` · PR `scripts/pruefen.mjs` · P29 `scripts/pruefen-instanzen/29.mjs` · VK `web/fuer-fensterbauer/index.html` · VJ/VC `web/assets/verkauf.js`/`.css` · PJ/PC `web/assets/portal.js`/`.css` · GJ/GC `web/assets/gemeinsam.js`/`.css` · RC `web/assets/recht.css` · RGC `web/assets/ratgeber.css` · PB `web/konfigurator-bedingungen/index.html` |

**Kennzeichnungen**

- **[V]** verbindlich: Anforderung des Inhabers, DNA-Prinzip, Pflichtregel des SG, Recht, Prüfsuite oder Festlegung eines Kapitels
  innerhalb eines DNA-Spielraums. **[H]** experimentelle Gestaltungshypothese mit Rückfall; sie wird erst nach Prüfung (16.11) zur Regel.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: Vorschlag gegen eine Regel aus GEST oder DR; gesammelt in
  16.9. Name, Wortmarke und Logo bleiben unverändert (GEST:7).
- **Textentwurf**: Wortlaut, der noch nicht im Bestand steht und die Freigabe des Inhabers braucht. Dieses Kapitel schreibt keine neuen
  Texte für die Website; es zitiert die Entwürfe aus Spezifikationen und Kapiteln mit derselben Kennzeichnung.
- **BH** = Bildschirmhöhe bei 390 × 844. **Stufe** = Intensitätsstufe der Design-Grammatik (1 ruhig, 2 klar, 3 gestaltet, 4 inszeniert).
- Alle Maße sind geplant, nicht gemessen, außer wo eine Spezifikation „gemessen“ angibt (Textbreiten in Chromium mit Inter).

**Methode und Grenzen.** Das Dokument ist eine Zusammenführung, keine neue Analyse. Simulierte Expertenperspektiven, auf denen Konzepte,
Bewertungen und Spezifikationen beruhen, sind eine Analysemethode, keine Nutzerstudie. Im Repository gibt es keine Nutzerforschung,
Besucherzahlen, Geräteanteile oder Konversionsraten (PA, „Was es nicht gibt“). Aussagen über Wirkung sind Hypothesen; dieses Dokument
nennt keine Conversion-Wahrscheinlichkeiten und keine erwarteten Steigerungen. Die Realitätsprüfung (RP) ist eine Prüfung am Papier durch
dasselbe Modell, das die Dokumente geschrieben hat; ob ihre Befunde Besucher treffen, klärt erst der Validierungsplan (RP 14.5).

---

## 16.0 Kurzfassung

1. **Bevorzugte Architektur E** (vorläufig, EV 7.5): Der Fensterbauer bedient sein künftiges Produkt, bevor er die Pakete sieht (Name im
   eigenen Konfigurator, zwei Griffe der Kundensicht, das echte Aufmaßblatt); der Unterschied der Pakete ist ein Zustand derselben
   Startansicht. **Testalternative C′** „Die Seite fragt“ (Paketberater mit zwei Fragen, keine Probe), **Rückfall B′** „Angebot zuerst“,
   falls das Material nicht trägt (EV 7.6).
2. **Sitemap unverändert:** alle 39 Adressen und alle Anker bleiben, keine neue indexierbare Seite; die Seite für Fensterbauer steht an
   zwei Orten (`/fuer-fensterbauer/` und eingebettet in `/#fensterbauer`); drei Kopf-Kontexte, Menü-Blatt am Telefon, ein Fuß aus einer
   Quelle (ZA 8.1, 8.2).
3. **Seite für Fensterbauer:** Startbild, Leiste, sechs Kapitel „01 Ihr Name“ bis „06 Ihr Start“, vier Anhänge; 13,8 BH statt heute
   ≈ 19; die Haarlinie der Pakete steht bei 844 px in Bildschirm 5, bei 664 px in Bildschirm 6, die ersten Preise bei 664 px in
   Bildschirm 7 (RP-31).
4. **Paketwahl P1 „Wischreihe mit Markenbild“:** Namensleiste mit drei Preisen über der Reihe, Karte mit „Wenn“-Satz, Preisblock, Knopf,
   Beispielbild der Markenstufe und Datenblatt; Formular direkt nach den Paketen (PE 10.4; E-AB-7).
5. **Startseite:** öffnet weiter mit der Ansicht Hauseigentümer; H1 bis H7 mit Probemessung, Aufmaßblatt mit Preisetikett, Ablauf und
   Daten, Ratgeber-Weg; Höchststufe 3 (ZA 8.3.4).
6. **Ein Designsystem:** Bildschicht (Perspektive, Licht, Material, Bewegung, Physik) getrennt von einer flachen, frontalen
   Bedienschicht; eine Cream-Fläche je Bildschirm; vier Radien; zwei Umbruchpunkte (640, 1024); 40 Festlegungen K-n (DS).
7. **Bewegung:** ein bewegter Träger je Ansicht, autonome Bewegung endet nach höchstens 5 s, Bedienschicht ohne Auftritt, Physik nur im
   Bild, ruhige Fassung = Endbild = Fassung ohne JavaScript; die Foto-Tiefe des Startbilds ist gestrichen (Festlegung 14-16).
8. **Technik:** keine neue Bibliothek, kein Build, CSP unverändert; neu `web/assets/rahmen.css`, `kopf.js`, `fuss.js`,
   `aufmass-inhalt.js`; geänderte Regeln nur im Website-Bereich `.web`; jede Freigabe als Schalter (IM 15.1).
9. **Vor dem Bau:** Gate G0 (Grundsatzfreigabe und Materialprobe) vor den Schritten S4 und S5; S1 bis S3 sind davon unabhängig
   (Festlegung 14-18). **Vor dem Livegang kritisch:** Umsatzsteuerzeile (RP-20) und die Frage-Route, die ohne Datenbank mit 503 antwortet
   (RP-29).
10. **Validierung:** zwölf Prüfungen V-1 bis V-12 in fünf Runden, Kern ist ein moderierter Test mit 6–8 Fensterbauern; A/B-Tests erst
    nach dem Livegang und nur unter festen Bedingungen (RP 14.5).

---

## 16.1 Getroffene Entscheidungen

### 16.1.1 Architektur, Seiten, Navigation

| Nr. | Entscheidung | Art | Verweis |
|---|---|---|---|
| A-1 | Architektur E als Grundfassung der Seite für Fensterbauer; C′ als Testalternative, B′ als Rückfall | [V] vorläufig, an Grundsatzfreigabe gebunden | EV 7.5.1, 7.6; ZA 8.3.2 g |
| A-2 | Alle öffentlichen Adressen und Anker bleiben; keine Umbenennung, keine Weiterleitung, keine neue indexierbare Seite | [V] | ZA 8.1.1 Nr. 1, 8.1.4 |
| A-3 | Eine Quelle, zwei Orte: `/fuer-fensterbauer/` und `/#fensterbauer`; jedes Element funktioniert an beiden Orten und nach Neuaufbau | [V] | ZA 8.1.1 Nr. 2; SKILL, Abschnitt 3; IM 15.7 |
| A-4 | Altbestand (Tarife, Tour, Registrierung) bleibt erreichbar, wird an keiner öffentlichen Stelle beworben | [V], Umfang hängt an OE-28 | ZA 8.1.1 Nr. 4; IA-AB-1 |
| A-5 | Alle eigenen Einstiege zeigen auf `/fuer-fensterbauer/` (Fachartikel, Anzeigen, App, Rechtsseiten, 404) | [H] | ZA 8.1.5 |
| A-6 | Abschnittsfolge der Seite für Fensterbauer: V1 → V2 → 01 → 02 → 03 → 04.1 → 04.2 → 04.3 → 05 → 06.1 → 06.2 → A1 → A2 → A3 → A4 → Brotkrumen → Fuß | [V] nach Freigabe E-AB-7 | ZA 8.3.2 a; IM 15.3.2 |
| A-7 | Formular direkt nach den Paketen; Lage als Option in PS, Rückfall „Formular nach 06“ | Abweichung E-AB-7 | EV 7.5.9; IM 15-2 |
| A-8 | Startseite öffnet weiter mit der Ansicht Hauseigentümer; Umschalter als Glas-Segment über dem Foto | [V] bis OE-12; IA-AB-3 | ZA 8.3.3; RP-16 |
| A-9 | Ansicht Hauseigentümer H1–H7 mit Probemessung (H2) und Aufmaßblatt mit Preisetikett (H3); keine scrollgekoppelte Bildfolge | [V] (Festlegung 8) | ZA 8.3.4 |
| A-10 | Drei Kopf-Kontexte (Hauseigentümer, Fensterbauer, neutral) plus Konto und App; ein dauerhafter Handlungsträger (Kopf-Ring), keine Kaufleiste, keine Kapitelanzeige, kein Lesefortschritt | [V] | ZA 8.2.1 N1–N13, 8.2.2 |
| A-11 | Menü am Telefon als `<dialog>`-Blatt im Daumenbereich; ohne JavaScript ist „Menü“ ein Link auf `#navigation` im Fuß | [V] | ZA 8.2.3; `rh-02` |
| A-12 | Menü trägt bis zum Baumtest die Aufgabenwörter („01 Die Idee“ … „04 Pakete“); das Ergebnis von V-7 gilt danach für Menü und Kapitelzeile | [H] | Festlegung 14-3 |
| A-13 | Kapitelzeilen „01 · IHR NAME“ bis „06 · IHR START“ (**Textentwurf**), Anhänge ohne Nummer; Kapitelwort 05 „05 · IHRE FRAGE“ (**Textentwurf**) | Abweichung E-AB-10; [H] | ZA 8.2.6; K-16; Festlegung 14-1 |
| A-14 | Fuß aus einer Quelle in zwei Längen (kurz, lang); Brotkrumen auf der Seite für Fensterbauer über dem Fuß, auf Ratgebern oben | [V] | ZA 8.2.5; `rh-03` |
| A-15 | Was die Seite weiterträgt: Firmenname aus 01 (freiwillig) und Paket aus dem Kartenknopf, nur ins Formular und in den Abschluss; „gewählt“ heißt auf einen Kartenknopf getippt | [V] | E-3; E-10; ZA 8.2.6 |
| A-16 | Messplan ohne fremde Server: zwölf Ereignisse auf eigenem Server, ohne Kennung, ohne Eingaben, ab dem Livegang | [V] | Festlegung 14-11; RP 14.5.5 |
| A-17 | Gate G0: S4 und S5 werden nicht gebaut, bevor Grundsatzfreigabe und Materialprobe entschieden sind | [V] | Festlegung 14-18 |

### 16.1.2 Paketentscheidung

| Nr. | Entscheidung | Verweis |
|---|---|---|
| 10-P1 | Konzept P1 „Wischreihe mit Markenbild“: Namensleiste mit Kurznamen und Monatspreisen über der Reihe, Karten 310 px mit Beispielbild in der Karte, das mitwischt; drei Karten nebeneinander ab Behälterbreite 900 px | PE 10.4; E-5 |
| 10-1 | Die Entscheidungshilfe in drei Zeilen entfällt; ihr Inhalt steht als „Wenn“-Satz in jeder Karte (**Textentwurf**) | PE 10.3 |
| 10-2 | Die Unterschiedszeile („+10 € gegenüber Essential …“) ist nur Variante (J-H5) | PE 10.4 B |
| 10-3 | Das Lottie-Zeichen `farbwechsel` vor den Paketen entfällt | PE 10.4 B; J-AB-10 |
| 10-4 | Grenze Reihe → drei Spalten über die Behälterbreite 900 px (heute 760 px) | PE 10.4 C; IM 15.3.2 |
| K-38 | Maße der Karte nach `fb-06` (gemessen): 310 × 877, Nachbarn je 28 px angeschnitten, Pille 122 × 28, Datenblattzeilen 48 px, Bildfenster 306 × 230 | DS 11.6.4; `fb-06` C |

### 16.1.3 Designsystem (Festlegungen K-1 bis K-40)

Volltext in DS; hier eine Zeile je Festlegung.

| Nr. | Inhalt | DS |
|---|---|---|
| K-1 | Ring-Kontur 2 px `--muted` (≈ 5,8 : 1) an jedem Ring-Knopf | 11.6.2 |
| K-2 | Cream-Hover = innere 2-px-Kontur `--on-primary` 24 %; Druck = Füllung `--primary-druck`, keine Skalierung | 11.6.2 |
| K-3 | gewählt = `--surface3` mit innerer 2-px-Kontur `--text`, Schrift 700; nie Cream | 11.6.3 |
| K-4 | Dauern und Kurven: Bestand `--t1`–`--t3`, `--e-out`, `--e-io`, dazu `--t2-aus`, `--t-motiv`, `--t-buehne`, `--t-mass`, `--e-in` | 11.7.1 |
| K-5 | Ansichtswechsel auf `/`: Segment 150 ms, dann Neuaufbau, Sprung an den Anfang ohne Gleiten, neue Ansicht blendet in 220 ms ein | 11.7.6 |
| K-6 | Bedienschicht ohne Auftritt; Einblenden nur für Inhalte, die nach einer Eingabe neu erscheinen | 11.7.2 |
| K-7 | Foto-Auftritt jeder Bühne: Deckkraft 0,35 → 1 und Maßstab 1,03 → 1 in 900 ms nach `decode()`; erste Eingabe führt in 220 ms in den Endzustand | 11.7.3 |
| K-8 | Logo-Licht beim Laden nur auf Seiten ohne Bühnen-Ladeauftritt | 11.7.3 |
| K-9 | Tiefe der Bildebenen nur in Stufe 4; durch Festlegung 14-16 in der Grundfassung nirgends | 11.7.4 |
| K-10 | Ankersprünge sofort, Fokus auf das Ziel-h2; glatt nur ohne scrollgekoppelte Szene dazwischen | 11.7.6 |
| K-11 | Umbruchpunkte 640 und 1024 px; Komponenten mit eigener Schwelle fragen ihre Behälterbreite ab | 11.2.1 |
| K-12 | Rinne am Schreibtisch 24 px | 11.2.1 |
| K-13 | Seitenrand bei 1024 px: 32 px, Spalte 960 | 11.2.1 |
| K-14 | Vor jeder Haarlinie, die eine h2 eröffnet, 96 px (Schreibtisch 128), auch nach dem Band | 11.1.6 |
| K-15 | `scroll-padding-top` = Kopf + 16 (72/80 px); `scroll-margin-top` am nummerierten h2 116/124 px, ohne Kapitelzeile 96/104 px | 11.2.2 |
| K-16 | Kapitelzeile 13/16, 600, +0,12 em, `tabular-nums`; nur die Nummer `--accent`, Punkt und Wort `--muted` | 11.3.1 |
| K-17 | jede Versalzeile 600, +0,12 em; Rückfall +0,08 em nur bei 360 px | 11.3.1 |
| K-18 | Titel 32/34 px, ab 1024 px 40/42 px | 11.3.1 |
| K-19 | Lesetext 17/26 auf Verkaufsflächen, 17/27 für lange Texte | 11.3.1 |
| K-20 | 13 px nur für die Technikstimme, Sätze 15 px (nach Freigabe DS-AB-2) | 11.3.3 |
| K-21 | 24 px nie neben 32/40; Kennwort der Ankerkachel `fb-11` 17/700; Paket- und Kurznamen 17/700 | 11.3.2 |
| K-22 | vier Radien `--pill` · `--r4` 24 · `--r3` 18 · `--r2` 12 auf allen Breiten; `--r1` nur App | 11.6.1 |
| K-23 | ein Gerätebaustein: 300 px, Rand 10 px `--surface`, Radien 44/34, Lichtkante, unten über 48 px in den Grund ausgeblendet, kein Schatten | 11.5.2 |
| K-24 | Lichtrichtung oben rechts als Haus-Token (`--licht-x` −0,6, `--licht-y` 0,8); Fotos mit eigener Quelle setzen ihre Richtung | 11.5.4 |
| K-25 | Begleitschatten nur auf Papier: Versatz 10 % der Kartenhöhe in Lichtrichtung, Weichzeichnung 2–3 × v, `--ground` 6 % | 11.5.5 |
| K-26 | Kopf-Scrim auf Bühnen: 96 px, Stopps 0/24/48/72/96 px mit 100/75/45/15/0 %, Start 60 % (bis 75 %) | 11.6.7 |
| K-27 | Kopf wird opak, sobald das erste Element der Bedienschicht unter dem Kopf dessen Unterkante + 8 px erreicht; 150 ms ein, 110 ms aus, Hysterese 24 px | 11.6.7 |
| K-28 | Kopf-Ring: erscheint, wenn die Startbild-Cream mit gleichem Ziel unter dem Kopf verschwindet; aus über Namensleiste und Kartenreihe; danach in Zustand A „Paket anfragen“; aus, solange 05 ≥ 120 px über dem unteren Rand steht | 11.6.7 |
| K-29 | Umschalter 284 × 44, Segmente 150 und 126 × 36, Lage x 16–300, y 68–112 | 11.6.3 |
| K-30 | Knöpfe in Bühnen nach Inhalt, mindestens 212 px, untereinander, linksbündig; volle Spaltenbreite nur in Formularen und Abschlüssen | 11.6.2 |
| K-31 | Pfeilkreis 28 px nur an der Cream; Zeilen mit Ziel tragen Chevron 8 × 14 px oder „↗“ 16 px ohne Kreis | 11.6.2 |
| K-32 | Anzeige-Chip: `--surface2` ohne Rand, 36 px, 13/700, innen 10 mit Haken, Abstand 8 | 11.6.4 |
| K-33 | Haarlinien in Zeilen `--line` auf `--ground`, `--line2` auf `--surface`; Hover Linie → `--line2`, Zeichen → `--text` | 11.6.8 |
| K-34 | Fokus `outline: 2px solid var(--text)`, Abstand 2 px, formfolgend; −2 px nur an Gruppen- oder Containerkanten | 11.9.1 |
| K-35 | Feld 52 px, Radius 12, Fläche `--ground`, Rand 1 px `--muted`, Schrift 17/24 500 | 11.6.9 |
| K-36 | „Beispiel“-Kennzeichnung in genau einer von zwei Formen: Etikett „BEISPIEL“ oben links oder „· Beispiel“ in der Adresszeile | 11.6.6 |
| K-37 | Physik: Trägheit ζ = 1, ω = 9 s⁻¹; Feder ζ = 0,75, f = 2 Hz, ≤ 24 px, Überschwingen ≤ 3 %; Abwurf ≤ 1.200 px/s, τ = 0,3 s | 11.7.5 |
| K-38 | Paketkarte nach `fb-06` (gemessen), Browserleiste `--surface2` | 11.6.4 |
| K-39 | interaktives Glas: Fläche auf Z 25, Inhalt und Trefferfläche auf Z 30 | 11.5.1 |
| K-40 | Flächen über Grundniveau sind `--surface`; Papierweiß nur für Papier und nach Freigabe H5-AB-1 die Ankerkachel in H5 | 11.4.2 |

### 16.1.4 Storyboard

| Nr. | Entscheidung | Verweis |
|---|---|---|
| 12-1 | Die Leiste V2 reagiert ab dem ersten Scrollschritt auf das Scrolltempo, bis das Gerät aus 01 zu 50 % im Bild ist; die Foto-Tiefe des Startbilds läuft nicht (seit Festlegung 14-16 ganz gestrichen) | ST 12.9 Nr. 1 |
| ST-3 | Kartenknopf → `#frage`: glattes Rollen (keine Szene dazwischen), ruhige Fassung ohne Glätten | ST 12.9 Nr. 3 |
| ST-4 | Fuß-Link „Konfigurator-Pakete“ springt sofort (dazwischen liegen die Ablauf-Marken) | ST 12.9 Nr. 4 |
| ST-5 | Titel des Festblocks nach `fb-08` | ST 12.9 Nr. 5 |
| ST-6 | Haken in 06.2 je 320 ms, zusammen ≤ 1,3 s | ST 12.9 Nr. 6 |
| ST-13 | Zeichnungen in H2 und H5 laufen 600 ms (statt 640/650 ms) | ST 12.9 Nr. 13 |
| [H] | Vorschläge ST 12.9 Nr. 8 (Kopfknopf zwischen H1 und H2 gleich im Endzustand), Nr. 10 (03 bei Ankunft von unten als Endbild), Nr. 11 (Glas des Umschalters in V1 der Einbettung klärt nach dem Foto bzw. nach der Maßlinie) | ST 12.9 |

### 16.1.5 Realitätsprüfung (Festlegungen 14-1 bis 14-23)

Was Sichtbares ändert, ist ein Vorschlag zur Freigabe und hängt an einem Schalter mit dem Bestandswert als Rückfall (RP 14.3).

| Nr. | Inhalt | Art | gilt für |
|---|---|---|---|
| 14-1 | Kapitelwort 05 „05 · IHRE FRAGE“ (**Textentwurf**); das Substantiv „Anfrage“ bleibt der Kundenanfrage vorbehalten | [H] | `fb-09`, `rh-02` |
| 14-2 | Satz „Ihr Kunde plant ohne Preise, das Angebot machen Sie.“ (**Textentwurf**) nur, wenn V-2 die Erwartung „Preisrechner“ bei ≥ 2 von 6–8 zeigt | [H] | `fb-06` |
| 14-3 | Menü mit Aufgabenwörtern bis zum Baumtest | [H] | `rh-02` |
| 14-4 | h2 von 05 in Zustand A „Paket anfragen“ (**Textentwurf**), `id="bestellen"` bleibt | [V nach Freigabe] | `fb-09` |
| 14-5 | Fokusträger der Bühnen am Telefon ab 19 % als begründete Ausnahme (ein Anker, Freifläche ≥ 33 %, kein weiteres Element im ersten Bildschirm, Blinzeltest) | [H] | `fb-01` |
| 14-6 | Zeiger der Namensleiste als Unterstrich 2 px `--text`, falls V-4 die Leiste für die Wahl hält | [H] | `fb-06` |
| 14-7 | Kopf-Ring bleibt zwischen zwei Sperrzonen aus, wenn sie weniger als eine halbe Bildschirmhöhe trennt (14-AB-2) | Abweichung | `rh-01` |
| 14-8 | „meist 3 bis 5 Werktage nach der Zahlung“ als Lesetext 17 px statt Kennzahl 32 px, solange OE-19 offen ist | [V nach Freigabe] | `fb-10` |
| 14-9 | Fußsatz des Vergleichs ohne zweites „Vorläufige Preise.“: „Alle Preise netto zzgl. MwSt., nur für Unternehmer.“ (**Textentwurf**) | [V nach Freigabe] | `fb-07` |
| 14-10 | Datenblattzeile „HINWEIS AUF EEZIFRAMES“ nennt App und Blatt (**Textentwurf**); `pdfKennzeichnung` mit `vergleich: true`; Textziel in 03 mit „es“ | [V nach Freigabe] | `fb-06`, `fb-07`, `pakete.js` |
| 14-11 | Messplan mit S3 bauen, ab dem Livegang zählen | [V] | System |
| 14-12 | Fotohöhe der Bühnen = min(420 px, 100svh − a − 8 px), mindestens 300 px (14-AB-1) | Abweichung | `fb-01`, `he-01` |
| 14-13 | Achsensperre der Leiste: übernimmt erst, wenn nach 8 px \|Δx\| ≥ 2 · \|Δy\|; `touch-action: pan-y` | [V] | `fb-02` |
| 14-14 | Tabellenkopf klebt nur ab 500 px sichtbarer Höhe | [V] | `fb-07`, `pb-02` |
| 14-15 | Umbruch statt Abschneiden; einzeilig gemessene Elemente brauchen ≥ 8 px Reserve | [V] | `fb-01`, `st-02`, `fb-06` |
| 14-16 | Foto-Tiefe entfällt aus der Grundfassung | [V] | `fb-01` |
| 14-17 | Wortlaute und Maße nach der Abschnitts-Spezifikation; ein Textregister als einzige Freigabevorlage | [V] | alle |
| 14-18 | Gate G0 vor S4 und S5 | [V] | IM 15.12 |
| 14-19 | „↗“ und Chevron als Inline-SVG mit `aria-hidden` (liegen nicht im Inter-Teilsatz) | [V] | DS K-31 |
| 14-20 | Leiste lädt sofort nur die sichtbaren Kacheln (Mitte ± 2), die übrigen `loading="lazy"` | [V] | `fb-02` |
| 14-21 | Ansichtswechsel: erst den Zustand des Segments malen, dann den Neuaufbau in einer späteren Aufgabe | [V] | `st-02`, `st-04`, `rh-02` |
| 14-22 | Ersatzschrift mit angeglichenen Metriken (`size-adjust`, `ascent-override`, `descent-override`, lokale Systemschrift) | [H] | Schrift |
| 14-23 | Feldumrisse ≥ 3 : 1 unabhängig vom Ausgang von DS-AB-10 | [V] | Formulare |

### 16.1.6 Umsetzung (Festlegungen 15-1 bis 15-15)

| Nr. | Inhalt | IM |
|---|---|---|
| 15-1 | Website-Bereich = Element mit Klasse `web` (statische Seiten am `body`, auf `/` an `.main` in öffentlichen Ansichten, in der App nur `.ap-buehne`); geänderte Regeln in `rahmen.css` unter `.web`, GC bekommt nur neue Tokens | 15.1.4 |
| 15-2 | Jede wertändernde Abweichung hängt an genau einem Schalter-Token; strukturelle Abweichungen als Option in PS bzw. `kopf.js` | 15.1.4, 15.5.4 |
| 15-3 | Ereignisse `vk:name`, `vk:probe`, `vk:wahl`, `vk:gesendet` an der Wurzel; Speicher `sessionStorage` `aufmass.vk.*`, jeder Zugriff in `try/catch`; Zustand im Modulspeicher von VJ | 15.4.5 |
| 15-4 | Alle `a[data-paket]` behalten `href="#bestellen"`; mit JavaScript landet der Fokus auf dem h3 `#frage` | 15.1.4 |
| 15-5 | Ein Sprung-Helfer `Sprung.zu` in GJ für alle Orte | 15.4.2 |
| 15-6 | Ein Helfer `Auftritt` in GJ für Foto-Auftritt und erste Eingabe | 15.4.2 |
| 15-7 | `Lottie.laden()` fügt den Spieler nur bei Bedarf ein; auf der Website nur der Haken im Dank | 15.4.2 |
| 15-8 | Miniatur im Abschluss als Rasterbild je Stufe (270 × 558, ≤ 25 KB), ohne eingegebenen Namen; HTML-Miniatur nur nach OE-23 | 15.1.4 |
| 15-9 | Codesperre als Teil von PR, kein Stylelint | 15.6.3 N9 |
| 15-10 | `/` bekommt ein statisches Startbild (15-AB-1); die App behält ihr gerendertes Startbild | 15.1.4 |
| 15-11 | Je Motiv eine Vorlage für beide Telefonfassungen (Astronaut ≥ 1170 × 1416, Waschbär ≥ 1170 × 1260) | 15.11.1 |
| 15-12 | Klassenname `kopf`: alte RC-Regeln `.kopf`, `.marke` entfallen; Marke-Prüfung sucht `.kopf .wm` | 15.1.4 |
| 15-13 | `<b>Vorläufige Preise.</b>` und „Bestellung bald möglich“ bleiben im Wortlaut | 15.1.4 |
| 15-14 | Alle Website-Seiten laden GC und `rahmen.css`; RC behält seinen Namen, führt Tokennamen von GC und Aliasse | 15.1.4 |
| 15-15 | Zeichnungsfarben mit Präfix `--zeichnung-`; `--papier`, `--tinte-papier`, `--mo-papier` wie DS 11.4.1 | 15.1.4 |

### 16.1.7 Rangfolge und maßgebliche Stellen bei Widerspruch

**Rangfolge** (DS, Einleitung; ergänzt um die späteren Kapitel):

1. Mindestanforderungen: WCAG 2.2 AA, Leistungsbudgets, Prüfsuite, Recht.
2. DNA-Prinzipien Nr. 1–11 und [Pflicht]-Regeln des SG.
3. Anforderungen des Inhabers (SKILL).
4. DS mit K-n; die Festlegungen 14-n und 15-n stehen auf dieser Stufe und gehen DS vor, wo sie eine DS-Stelle ausdrücklich ändern
   (sie nennen die Stelle unter „nachzuziehen in DS …“).
5. DG, ZA, PE, ST.
6. Einzelne Abschnitts-Spezifikation; **Ausnahme:** Wortlaute und Maße der Spezifikation gehen ZA, PE und ST vor, weil dort gemessen
   wurde (Festlegung 14-17; DS K-38).

**Überholte Stellen.** Die folgenden Aussagen stehen noch in älteren Dokumenten; gebaut wird die rechte Spalte.

| Gegenstand | steht noch in | maßgeblich |
|---|---|---|
| Foto-Tiefe 0,88 im Startbild, „Foto-Tiefe endet vor der Leiste“ | ZA 8.3.2 V1; `fb-01` F.2; DS 11.1.6, 11.7.4; IM 15.3.2 (`fb-01`), 15.4.3 (`startbild`), 15.12 S4 Umfang und Abnahme | entfällt (14-16); `Scroll.binden` wird im Startbild nicht gebraucht |
| Kopf-Ring zwischen Reihe und 05 kurz sichtbar | DS K-28; `rh-01` F; ST 12.5.3 | aus, wenn weniger als 0,5 BH zwischen den Sperrzonen liegt (14-7, Freigabe 14-AB-2) |
| Kopf-Ring ausblenden nur über `opacity` | PE F; DS K-28 | zusätzlich `visibility: hidden` und `inert` (`rh-01`) |
| Paketkarte 310 × ≈ 640, Nachbarn 40 px, Empfehlungsgrund, Unterschiedszeile, Paketname 24 | ZA 8.3.2 (04.1) | 310 × 877, Nachbarn 28 px, „Wenn“-Satz, Unterschiedszeile nur Variante, Name 17/700 (`fb-06`; K-38; 10-2; J-AB-1) |
| Entscheidungshilfe in drei Zeilen | ZA 8.3.2 (04.2); H-E3 | entfällt (10-1); H-E3 lautet „Bild, ‚Wenn‘-Satz und Datenblatt“ |
| Chips „Ihre Domain · Ihre Marke · Anfrage als PDF“ | ZA 8.3.2 V1 | „Ihre Domain · Ihre Marke · PDF per E-Mail“ (`fb-01` B.1, gemessen 355 von 358 px) |
| Preiszeile „… · vorläufige Preise“ | ZA 8.3.2 V1 | „Ab 29 € im Monat netto, plus Einrichtung · vorläufig“ (**Textentwurf**, `fb-01` B.1) |
| Festblock: Kennwort „VERTRAG IN KÜRZE“, sechs Zeilen in anderer Folge | PE 10.4 B; `fb-07` C | Titel und fünf Zeilen nach `fb-08` B (Vertrag → Storno → Freigabe → Abo → kündbar) |
| Gesprächsweg „Unsicher, welches Paket passt? …“ | ZA, PE | Ring nach `fb-08`; solange OE-20 (Telefon, Rückruf) offen ist, Rückfall „Frage stellen“ (**Textentwurf**, RP-19) |
| Einzeiler, Textziel „er“, Lead in 03 | ZA 8.3.2 (03); `fb-06` | `fb-05` B: Textziel „Wie sehr soll es Ihre Marke tragen?“ (**Textentwurf**) |
| Lead und h2 von 05 | ZA 8.3.2 (05) | Lead nach `fb-09` B; h2 in Zustand A nach 14-4 |
| Verkaufsstand „Vorläufige Preise, Stand 22.10.2026. …“ | ZA, PE | `fb-07`: „<b>Vorläufige Preise.</b> Preisstand 22. Oktober 2026. …“ (P29:46) |
| Kapitelzeile H4 „03 · DATEN UND KONTO“ | ZA 8.3.4 | „03 · ABLAUF UND DATEN“ (**Textentwurf**, `he-04` B) |
| Lottie-Haken in 06.2 | ZA 8.4.3 | Haken als CSS-Abdeckung (`scaleX`, 320 ms); Lottie nur im Dank (15-7; IM 15.3.2 `fb-11`) |
| Einblenden der Bedienschicht in H2 | `he-02` F | keines (K-6; ST 12.9 Nr. 2) |
| Beispielbild je Paket 660 × 495 (Aufnahme 1280 × 960) | PE 10.4 H; DS 11.8.4 | 708 × 460, Aufnahme 1480 × 960, AVIF ≤ 40 KB, WebP ≤ 55 KB (`fb-06` C Festlegung I-2; IM 15.11.2) |
| Licht der Fotos des Beispielbetriebs „oben links“ | PE 10.4 H; `fb-06` H | oben rechts (K-24; IM 15.11.1 A3) |
| Überdeckung des Browsers durch das Telefon in 01 am Schreibtisch ≈ 30 % | ZA 8.3.2 (01); DS 11.1.4 K2 | ≈ 14 % (`fb-03`, FS3) |
| Fokusträger V1 25–35 % | ZA 8.3.2 V1; DS 11.2.4 | ab 19 % unter Bedingungen (14-5) |
| Seitenlänge 11,8 BH, Formular Bildschirm 9 (664), Pakete am Schreibtisch 4,0 BH | ZA 8.3.2 | 13,8 BH; h3 `#frage` Bildschirm 10, „Frage senden“ Bildschirm 11 (664); Schreibtisch ≈ 4,3 BH (ST 12.9 Nr. 12; RP-31); am Prototyp messen |
| Startfoto 420 px fest | ZA, `fb-01`, `he-01` | Formel nach 14-12 nach Freigabe 14-AB-1; bis dahin 420 px (E-AB-1) |

---

## 16.2 Seiten und Abschnitte

### 16.2.1 Seiten im Überblick

Vollständige Tabelle S1–S32 mit Zweck, Zielgruppe und Herkunft: ZA 8.1.3. Bauschritt nach IM 15.12.

| Seite | Adresse | Kopf-Kontext | Spezifikationen | Schritt |
|---|---|---|---|---|
| Startseite, Rahmen | `/` | je Ansicht | `rh-01`, `st-02`, `st-03`, `st-04`, `rh-03`; Muster `st-01`, `st-05` | S2, S4, S7 |
| Ansicht Hauseigentümer (Standard) | `/#hauseigentuemer` | Hauseigentümer | `he-01` bis `he-05`, `he-07`; `he-06` nach `fb-13` | S7 |
| Ansicht Fensterbauer | `/#fensterbauer` (alt `#betriebe`), `/?von=pdf` | Fensterbauer | wie Seite für Fensterbauer, dazu `st-03` | S3–S5 |
| Seite für Fensterbauer | `/fuer-fensterbauer/` | Fensterbauer | `fb-01` bis `fb-13`, `fb-15`; `fb-14` nach `fb-13` | S3–S6 |
| Fachartikel (5) | `/fuer-fensterbauer/<artikel>/` | Fensterbauer | `ar-01`, `ar-02`; Bestand `ar-03`, `ar-04` | S2, S8 |
| Ratgeber-Übersicht und 23 Ratgeber | `/ratgeber/`, `/ratgeber/<artikel>/` | Hauseigentümer | `ar-01`, `ar-02`; Muster `ar-05` | S2, S8 |
| Paketbedingungen | `/konfigurator-bedingungen/` | Fensterbauer | `pb-02`; Muster `pb-01`, `pb-03` (nach `re-01`) | S2, S8 |
| Rechtsseiten (6) | `/impressum/`, `/datenschutz/`, `/cookies/`, `/agb/`, `/nutzungsbedingungen/`, `/widerruf/` | neutral | `re-01` | S2, S5 (Cookies), S8 |
| Kundenkonto | `/partner/` | Konto (Bestand) | `pa-01` | S8 |
| Fehlerseite | 404 | neutral | `nf-01` | S8 |
| App-Startbild (Schnittstelle) | `/app/` | App (Bestand) | `ap-01` | S8 |
| Demo-Konfiguratoren, Dashboard, Betriebsbereich, Zentrale, System | Subdomains, `/betrieb/`, `/` angemeldet, `/zentrale/`, `sitemap.xml`, `llms.txt` | – | unverändert; Vorschaubild der Seite für Fensterbauer neu (IM 15.3.9) | S9 |

### 16.2.2 Rahmen auf allen Seiten

| ID | Inhalt | Telefon 390 | Schreibtisch 1280 | Muster, Stufe | Spezifikation |
|---|---|---|---|---|---|
| `rh-01-kopf` | Logo links (Ziel 44 × 44), rechts Handlungsknopf ≈ 150 × 44 (15/700) und Menü 44 × 44; auf Bühnen flächenlos über Scrim (K-26), sonst opak `#161616` mit Haarlinie unten; klebt, springt nie; Kopf-Ring nach K-28 und 14-7 | 56 px | 64 px; Textlinks 15 px je Kontext (ZA 8.2.2) | 1 · T0 | [rh-01-kopf.md](09-abschnitte/rh-01-kopf.md) |
| `rh-02-menue` | `<dialog>`, opak `--surface`, Radius 18 oben, Lichtkante oben, Scrim `--scrim-blatt`, ≤ 85 dvh; Zeilen 52 px, Unterzeilen 44 px; Segment „Hauseigentümer · Fensterbauer“; Schließen per Knopf, Escape, Wischen, Rand; 220 ms ein, 165 ms aus über Deckkraft | Blatt im Daumenbereich | entfällt (Textlinks im Kopf) | K6 · 1 · T0 | [rh-02-menue.md](09-abschnitte/rh-02-menue.md) |
| `rh-03-brotkrumen-fuss` | Fuß kurz oder lang aus `fuss.js`; „Vertrag widerrufen“ als 44-px-Ring in jedem Fuß; Brotkrumen 13/600 mit 44-px-Zielen | Listen 15/20, Zeilen ≥ 44 px | gleiche Folge | 1 · T0 | [rh-03-brotkrumen-fuss.md](09-abschnitte/rh-03-brotkrumen-fuss.md) |

Kopfknopf je Kontext: Hauseigentümer „Fenster ausmessen“ → `/app/#ausmessen` (mit angefangenem Aufmaß „Aufmaß fortsetzen“), Cream nur,
wenn im Inhalt keine Cream sichtbar ist; Fensterbauer Ring „Pakete ansehen“ → `#pakete`, in Zustand A ab der Reihe „Paket anfragen“
(**Textentwurf**) → `#frage`; neutral kein Knopf. Konto und App behalten ihren Kopf.

### 16.2.3 Seite für Fensterbauer `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`)

**Ziel:** Z1a in Zustand A, Z1 in Zustand B, Z1+ über Empfehlung, Markenbild und Team-Zeile. **Hauptgruppen:** FB-2, FB-6, dann FB-3,
FB-4, FB-5, FB-1. **Länge:** Telefon 11.620 px = 13,8 BH (ST, aus den gemessenen Spezifikationen). Muster nach DS 11.1.4 (16.4.3).

| Pos. | ID, Spezifikation | Abschnitt, Anker | Stufe · Typ | Muster | Held am Telefon | Handlung | Signature | Schritt |
|---|---|---|---|---|---|---|---|---|
| – | `rh-01` | Kopf, Kontext Fensterbauer | 1 · T0 | – | – | Ring „Pakete ansehen“ / „Paket anfragen“ | – | S2 |
| V1 | [fb-01-startbild](09-abschnitte/fb-01-startbild.md) | Startbild | 4 · T1 | K1 | Foto Astronaut am Bullauge, 390 × 420 (nach Freigabe 14-AB-1 300–420 px), Figur und Bullauge ≈ 210 × 300 (19 % bei 844, 24 % bei 664) | Cream „Pakete ansehen“ → `#pakete` (y 542–594); Ring „Selbst ausprobieren“ → `#die-idee` (y 606–658) | Glas der Meldungen; Lichtübertrag (einziger Rahmenbruch); informierend Maßlinie | S4 |
| V2 | [fb-02-leiste-elementarten](09-abschnitte/fb-02-leiste-elementarten.md) | Leiste Elementarten | 3 · T2 | K9 | 14 Renderings; Mitte 90 × 90 (1,25-fach) scharf unter dem Kegel, übrige 72 × 72, Leiste 144 px über beide Ränder | keine (Name der Mitte 15/700) | Schärfestaffelung; Kegel als Ende des Lichtübertrags | S4, S6 |
| 01 | [fb-03-ihr-name](09-abschnitte/fb-03-ihr-name.md) | Ihr Name `#die-idee` | 2 · T3 | K2 | Gerät 300 × 420 auf der Mittelachse (≈ 38 %), Startansicht Essential von „Fensterbau Brandt“ | Textziel „Mit Ihrem Namen ansehen“ (**Textentwurf**) öffnet das Feld „Ihr Firmenname“ 358 × 52 | – | S5 |
| 02 | [fb-04-ihr-kunde](09-abschnitte/fb-04-ihr-kunde.md) | Ihr Kunde `#so-funktioniert-es` | 3 · T4 | K2 | dasselbe Gerät, untere 240 px, Render „Vitrine“ | zwei Wahlgruppen, Zeilen 171 × 52 mit `aria-pressed` | Lichtraum (Lichtfleck Cream ≤ 12 %) | S5, S6 |
| 03 | [fb-05-ihr-postfach](09-abschnitte/fb-05-ihr-postfach.md) | Ihr Postfach `#was-in-jeder-anfrage-steht` | 3 · T5 | K3 | Aufmaßblatt 330 px, −2°, ≈ 35 %, Schichten Maße · Fotos · Klärungsliste; Karte „Aus Ihrer Probe“ | Textziel „Wie sehr soll es Ihre Marke tragen?“ → `#pakete` | Explosionsansicht mit Annotation; informierend Messraster | S5 |
| 04.1 | [fb-06-pakete-karten](09-abschnitte/fb-06-pakete-karten.md) | Ihre Marke `#pakete`, `#paket-essential`, `#paket-plus`, `#paket-signature` | 2 · T7 | K5 | Beispielbild je Karte im Browserrahmen, Bildfenster 306 × 230; Monatspreis 32 als Zahl-Held | Kartenknopf „… anfragen“ (A) bzw. „… bestellen“ (B); Cream an der empfohlenen, nach einem Tipp an der gewählten Karte (J-AB-8) | – | S3, S6 |
| 04.2 | [fb-07-entscheidungshilfe-vergleich](09-abschnitte/fb-07-entscheidungshilfe-vergleich.md) | Verkaufsstand und Vergleich `#vergleich` | 1 · T7 | K6 | – | `details` „Alle Merkmale im Vergleich“ | – | S3 |
| 04.3 | [fb-08-festblock-gespraechsweg](09-abschnitte/fb-08-festblock-gespraechsweg.md) | Festblock, Gesprächsweg, Rechtshinweis | 1 · T6 | K6 | – | Ring Gesprächsweg → `#frage` mit „Noch offen“; Link „Paketbedingungen mit AV-Vertrag“ | – | S3 |
| 05 | [fb-09-anfrage](09-abschnitte/fb-09-anfrage.md) | Ihre Frage `#bestellen`, `#frage`, Dank | 1 · T10 | K10 | – | Cream „Frage senden“ über die volle Breite | – | S3 |
| 06.1 | [fb-10-ablauf](09-abschnitte/fb-10-ablauf.md) | Ablauf `#ablauf` | 2 · T8 | K4 (senkrecht) | Maßstab x 16–40, ≈ 480 px hoch, sechs Marken 01–06 | Link → `/konfigurator-bedingungen/#laufzeit` | informierend Fortschritts-Maßstab | S3 |
| 06.2 | [fb-11-kundenschutz](09-abschnitte/fb-11-kundenschutz.md) | Kundenschutz `#kundenschutz` | 2 · T6 | K7 | Ankerkachel 358 × ≈ 120, drei Kacheln 358 × ≈ 96 | Link „Paketbedingungen § 10“ → `/konfigurator-bedingungen/#kundenschutz` | – | S3 |
| A1 | [fb-12-live-demos](09-abschnitte/fb-12-live-demos.md) | Live-Demos `#demos` | 1 · T4-Anhang | K6 | – | Zustand A: Ring „App für Hauseigentümer öffnen“ (**Textentwurf**, neuer Tab); mit Demos drei Zeilen 56 px | – | S3 |
| A2 | [fb-13-haeufige-fragen](09-abschnitte/fb-13-haeufige-fragen.md) | Häufige Fragen `#haeufige-fragen` | 1 · T9 | K6 | – | acht `details`-Zeilen, JSON-LD wortgleich | – | S3 |
| A3 | `fb-14-hintergrund` (Muster `fb-13`) | Hintergrund `#warum-kunden-selbst-planen`, `#quellen`, `#wissen-fuer-fensterbauer` | 1 · T9-artig | K6 | – | drei zugeklappte Zeilen, öffnen sich beim Ansprung | – | S3 |
| A4 | [fb-15-abschluss](09-abschnitte/fb-15-abschluss.md) | Abschluss: kompakte Paketwahl | 2 · T11 | K8 | Mini-Vorschau 96 × 192 als Rasterbild der Markenstufe (15-8) | drei Zeilenknöpfe 250 × 56, Cream an der gewählten bzw. empfohlenen Zeile | – | S3, S6 |
| – | `rh-03` | Brotkrumen, Fuß kurz | 1 · T0 | – | – | – | – | S2 |

In der Einbettung folgt nach A4 die Wechselkarte (`st-04`); bei `?von=pdf` ersetzt der Hinweis (`st-03`) den Meldungsstapel. Eine
Cream-Fläche steht in V1, an der empfohlenen bzw. gewählten Karte, an „Frage senden“ und im Abschluss; der Kopf trägt in diesem Kontext
nur einen Ring.

**Rhythmus und Dosierung** (DS 11.1.5; ZA 8.3.2 e):

```
Stufe  4  ██
       3  ██ ██    ██ ██
       2  ██ ██ ██ ██ ██ ██          ██ ██          ██
       1  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██
          V1 V2 01 02 03 4a 4b 4c 05 6a 6b A1 A2 A3 A4 Fu
Licht     Bl Bl    Cr
Glas      ●
```

Licht nur in den ersten vier Bildschirmhöhen (Erdlicht, Keil und Kegel in Zeichnungsblau, Lichtfleck in Cream); ab den Paketen kein
eigenes Licht. Entscheidungs- und Arbeitsflächen (04 bis A4) höchstens Stufe 2, ohne inszenierende Signature.

### 16.2.4 Startseite `/` und Ansicht Hauseigentümer `/#hauseigentuemer`

**Rahmen der Startseite** (ZA 8.3.3)

| ID | Inhalt | Stufe | Spezifikation | Schritt |
|---|---|---|---|---|
| `st-01-baender` | höchstens die Pilotleiste ohne Server (40 px), ohne den Satz zur Tour; kein Einführungsband auf `/` | 1 | Muster (IM 15.3.3) | S7 |
| `rh-01` + `st-02-umschalter` | Kopf 56 px; Glas-Segment 284 × 44 über dem Foto (x 16–300, y 68–112), scrollt mit, steht zusätzlich im Menü; am Schreibtisch neben dem Logo | 1 (Glas zählt im Budget von H1) | [st-02-umschalter](09-abschnitte/st-02-umschalter.md) | S2 |
| `st-03-hinweis-von-pdf` | nur Ansicht Fensterbauer mit `?von=pdf`: Glas-Karte ≤ 260 × 168 an Stelle des Meldungsstapels; Titel „Sie halten ein eeziframes-Aufmaß in der Hand?“ (`portal.js:849`), eine Zeile (**Textentwurf**), Link-Zeile „Aufmaß per Code übernehmen“; keine Cream | Teil von V1 | [st-03-hinweis-von-pdf](09-abschnitte/st-03-hinweis-von-pdf.md) | S4 |
| `st-04-wechselkarte` | Karte `--surface` mit Ring 2 px `--line`, 358 × ≈ 200; Ring „Zur Seite für Fensterbauer“ (**Textentwurf**) bzw. „Zur Ansicht für Hauseigentümer“; keine Cream | 2 · T11 | [st-04-wechselkarte](09-abschnitte/st-04-wechselkarte.md) | S7 |
| `rh-03` | Fuß kurz, ohne Brotkrumen | 1 | `rh-03` | S2 |
| `st-05-textfassung` | Textfassung ohne JavaScript in der Folge H1–H7, Steckbrief „eeziframes auf einen Blick“, Block „Für Fensterbauer“; generierte Teile aus RB | 1 | Muster (IM 15.3.3, 15.8) | S7 |

**Ansicht Hauseigentümer** (Länge 5.736 px = 6,8 BH; Höchststufe 3; Cream in H1, H2 und H7)

| Pos. | ID, Spezifikation | Abschnitt | Stufe · Typ | Muster | Held am Telefon | Handlung | Signature |
|---|---|---|---|---|---|---|---|
| H1 | [he-01-startbild](09-abschnitte/he-01-startbild.md) | Startbild | 3 · T1 | K1 | Foto Waschbär an der Maueröffnung 390 × 420, Anker Tageslicht in der Öffnung | Cream „Jetzt ausmessen“ → `/app/#ausmessen` (mit Aufmaß „Aufmaß fortsetzen“); Ring „Führung starten“ → `/app/#fuehrung` | Glas des Umschalters |
| H2 | [he-02-probemessung](09-abschnitte/he-02-probemessung.md) | 01 · Probemessung | 2 · T4 | K3 (Zeichnungskarte) | weiße Zeichnungskarte 358 × 300 (≈ 32 %), drei orange Breiten | Messknöpfe „Oben“, „Mitte“, „Unten“ 114 × 44; Cream „Jetzt ausmessen“ nur bei ≥ 844 px Abstand zur Cream von H1, sonst Ring | informierend Maßlinie mit Wert |
| H3 | [he-03-aufmassblatt-preis](09-abschnitte/he-03-aufmassblatt-preis.md) | 02 · Das Aufmaßblatt | 2 · T5-artig | K3 | Aufmaßblatt 290 px, −2°, Preisetikett 152 × 76 (≤ 15 % Überdeckung) | keine eigene; Kopfknopf | – |
| H4 | [he-04-ablauf-daten](09-abschnitte/he-04-ablauf-daten.md) | 03 · Ablauf und Daten | 2 · T8-artig | K4 (waagerecht) | Maßstab 358 × 64 mit vier Marken; Fassung B vier Miniaturen 80 × 164 | Ring „Führung starten“; Link „Mehr zu Fotos und KI“ → `/datenschutz/#fotos-ki` (**Textentwurf**) | – |
| H5 | [he-05-ratgeber-weg](09-abschnitte/he-05-ratgeber-weg.md) | Aus dem Ratgeber | 2 · K35 | K7 | Raster 2 × 3 Kacheln 171 × 88, Ankerkachel „4 Ausmessen“ | Kacheln → `/ratgeber/#schritt-1` … `-6`; „Alle Ratgeber ›“ | – |
| H6 | `he-06-haeufige-fragen` (Muster `fb-13`) | Häufige Fragen | 1 · T9 | K6 | – | vier Fragen, gleich in Ansicht und Textfassung, ohne `id="haeufige-fragen"` | – |
| H7 | [he-07-abschluss](09-abschnitte/he-07-abschluss.md) | Abschluss | 2 · T11 | K8 | Bildband 390 × 200 aus dem Startfoto | Cream „Jetzt ausmessen“ | – |
| WK | `st-04` | Wechselkarte | 2 · T11 | – | – | Ring | – |

### 16.2.5 Fachartikel und Ratgeber (Muster)

| Pos. | ID, Spezifikation | Abschnitt | Stufe | Regel in Kürze |
|---|---|---|---|---|
| A-1 | [ar-01-artikelkopf](09-abschnitte/ar-01-artikelkopf.md) | Brotkrumen, Eyebrow mit Datum, h1, führende Zeichnung, „Kurz gesagt“ | 2 · T13 | am Telefon Zeichnung zwischen h1 und „Kurz gesagt“ (AR1-AB-1); Zeichnung als Papierkarte ohne Ring oder echtes Foto randlos; kein Platzhalter als Hauptbild |
| A-2 | [ar-02-handlungsbaustein](09-abschnitte/ar-02-handlungsbaustein.md) | Handlungsbaustein nach „Kurz gesagt“ | 1 · K36 | Fachartikel: Cream „Konfigurator für Fensterbauer“ (**Textentwurf**) → `/fuer-fensterbauer/`, beim Artikel „Fensterbau-Software“ „Pakete ansehen“ → `#pakete`; Ratgeber: „Fenster ausmessen“ in die App, in der Stufe „Prüfen“ als Ring |
| A-3 | `ar-03-fliesstext` (Bestand) | Inhaltsverzeichnis, Fließtext, Kästen, Zeichnungen | 1 | Vorlage bleibt (17 · 24 · 15 · 13); keine Bewegung; Fotokarte nur hier (DG-AB-9) |
| A-4 | `fb-13` (Muster) | Häufige Fragen | 1 | Fragenzeile nach `fb-13` |
| A-5 | `ar-04-weg-block` (Bestand) | „Dein Weg zu neuen Fenstern“ (nur Ratgeber) | 1 | `weg-*.webp` nicht als Hauptbild, bis Material vorliegt; Kachel „Du bist hier“ ohne Cream-Fläche |
| A-6 | `ar-02` | Handlungsbaustein am Ende | 1 | wie A-2; zwei statt heute vier bis sechs Knöpfe |
| A-7 | `ar-03` | Quellen, Stand | 1 | Stand in Text, JSON-LD und `SEITEN` gleich |
| Übersicht | `ar-05-ratgeber-uebersicht` (Muster) | `/ratgeber/` | Kopf 2, sonst 1 | Kopf nach `ar-01`, sechs Schritte, „Für Fensterbauer“, Handlungsbaustein, Fuß lang |

### 16.2.6 Paketbedingungen, Rechtsseiten, Kundenkonto, Fehlerseite, App-Startbild

| Seite | ID, Spezifikation | Inhalt in Kürze | Stufe |
|---|---|---|---|
| Paketbedingungen | `pb-01` (Muster) | Kopf Kontext Fensterbauer mit Ring „Pakete ansehen“ → `/fuer-fensterbauer/#pakete`; h1, Stand, PDF-Zeile, Hinweis „Entwurf zur anwaltlichen Prüfung“, solange er zutrifft | 1 · T12 |
| | [pb-02-merkmalstabelle](09-abschnitte/pb-02-merkmalstabelle.md) | Telefon: fester Kopf aus drei Kurznamen, je Merkmal Zeilenüberschrift über die volle Breite, darunter drei Wertspalten à ≈ 114 px, kein Querscrollen; Wortlaut ist Vertragstext; Anker `#merkmale` | 1 · T12 |
| | `pb-03` (Muster `re-01`) | Paragraphen, Anker `#kundenschutz` (§ 10), `#laufzeit` | 1 · T12 |
| Rechtsseiten | [re-01-rechtsseite](09-abschnitte/re-01-rechtsseite.md) | Kopf neutral; h1 32/40, Zwischentitel 24, Text 17, Nebentext 15, Label 13; Spalte ≤ 820 px; `/widerruf/` mit Formular nach K10, ohne JavaScript nutzbar | 1 · T12 |
| Kundenkonto | [pa-01-anmelde-weiche](09-abschnitte/pa-01-anmelde-weiche.md) | Anmeldung mit Code (Bestand), darunter Weiche aus drei Zeilen: „Zum Betriebskonto“, Hinweis auf `/betrieb/`, in Zustand A „Pakete ansehen“ → `/fuer-fensterbauer/#pakete` (**Textentwürfe**); Skala des Betriebsbereichs | 1 · T12 |
| Fehlerseite | [nf-01-fehlerseite](09-abschnitte/nf-01-fehlerseite.md) | Kicker „Fehler 404“, h1 „Diese Seite gibt es nicht.“, Satz zu Kundenlinks; drei Ring-Knöpfe „Zur Startseite“, „Zur App“, „Für Fensterbauer“, keine Cream; Figur erst mit Material (Fassung B) | 1 · T12 |
| App-Startbild | [ap-01-startbild-schnittstelle](09-abschnitte/ap-01-startbild-schnittstelle.md) | Foto `app-start` nach K1, Eyebrow, h1 und Knopftexte wörtlich aus dem Bestand, Konditionsblock aus `Abrechnung`, Fußlink „Sie sind Fensterbauer? ›“ → `/fuer-fensterbauer/`; App selbst unverändert | 2 · T14 |

### 16.2.7 Anker, die erhalten bleiben [V]

`#hauseigentuemer`, `#fensterbauer`, `#betriebe`, `#tour`, `#projekt-<id>`, `?von=pdf` auf `/`; `/app/#ausmessen`, `#fuehrung`, `#k-…`;
auf der Seite für Fensterbauer die Pflicht-h2 `die-idee`, `so-funktioniert-es`, `pakete`, `ablauf`, `demos`, `bestellen`,
`haeufige-fragen` (jeweils als `<h2 id="…">` ohne weitere Attribute, P29:110-114) sowie `was-in-jeder-anfrage-steht`,
`paket-essential`, `paket-plus`, `paket-signature`, `vergleich`, `frage`, `kundenschutz`, `warum-kunden-selbst-planen`, `quellen`,
`wissen-fuer-fensterbauer`; `/konfigurator-bedingungen/#kundenschutz`, `#laufzeit`, neu `#merkmale`; `/datenschutz/#pakete`, neu
`#fotos-ki`; `/partner/#bestellen/<paket>`, `#bestellung/<id>`, neu `#anmelden` (PA 1.10 Nr. 2; ZA 8.1.4; IM R15).

### 16.2.8 Verkaufszustände der Seite für Fensterbauer

| Ort | Zustand A (heute, Anfrage) | Zustand B (`PAKETE_OFFEN=1`) | zusätzlich mit `PAKETE_DEMOS=1` |
|---|---|---|---|
| V1 | Cream „Pakete ansehen“, Ring „Selbst ausprobieren“, Preiszeile mit „vorläufig“, solange `VORLAEUFIG` | gleich | gleich |
| Kopf-Ring | ab der Reihe „Paket anfragen“ → `#frage` | bleibt „Pakete ansehen“ | – |
| 04.1 Karten | „<Kurzname> anfragen“ → `#bestellen` mit `data-paket`, Fokus auf `#frage` | „<Kurzname> bestellen“ → `/partner/#bestellen/<paket>`; Satz „Erst Ihre Angaben, bezahlt wird im letzten Schritt.“ (**Textentwurf**, [H] J-H6) | kleiner Link „Demo ansehen“ je Karte [H] |
| 04.2 Verkaufsstand | „<b>Vorläufige Preise.</b> Preisstand …“ | entfällt mit `VORLAEUFIG = false` | – |
| 05 | h2 „Paket anfragen“ (14-4), Satz mit „Bestellung bald möglich“ (15-13), Formular als Abschluss | h2 „Bestellen oder anfragen“, Block „Für die Bestellung brauchen Sie …“, Formular als „Vorher eine Frage?“ | – |
| A1 | zwei Zeilen, Ring zur App in neuem Tab | gleich | drei Demo-Zeilen mit Miniatur |
| A4 | „… anfragen“ | „… bestellen“ | – |
| JSON-LD | `PreOrder` | `InStock` | – |

Vorbehalte stehen dort, wo sie wirken, als Satz in Nebengröße, nie als Kasten und nie größer als ein Preis (EA AB-4), je Ort einmal
(14-9).

---

## 16.3 Design-Tokens

### 16.3.1 Ort und Geltungsbereich

- Alle Tokens stehen in `:root` von `web/assets/gemeinsam.css` (eine Stelle). Neue Tokens sind zusätzliche Namen; App und
  Betriebsbereich sehen nichts davon (IM 15.5.1).
- Geänderte Werte bestehender Rollen und geänderte Komponentenregeln gelten nur im Website-Bereich `.web` und stehen in
  `web/assets/rahmen.css` (15-1).
- Jede Abweichung mit Freigabe hängt an einem Schalter, der bis zur Freigabe den Bestandswert trägt (16.3.9).

### 16.3.2 Farbe

| Token | Wert | einzige Rolle auf der Website | Kontrast |
|---|---|---|---|
| `--ground` | `#161616` | Grund aller Seiten, Kopf opak, Scrim, Feldfläche | – |
| `--surface` | `#1f1f1f` | Karten, Kacheln, Menüblatt, opake Etiketten, Glasfüllung (60 %) | – |
| `--surface2` | `#262626` | Anzeige-Chips, Browserleiste, gedrückt (Ring, Zeile), Kreisknopf | – |
| `--surface3` | `#2e2e2e` | gewählt (mit Tintenkontur, K-3) | – |
| `--line` | `#2b2b2b` | Kartenring 2 px, Haarlinien auf `--ground` | ≈ 1,3 : 1 (Trenner) |
| `--line2` | `#3a3a3a` | Haarlinien auf `--surface`, Unterstreichung, Spur von Segmentgruppen; nie einzige Grenze eines Knopfs | ≈ 1,6 : 1 |
| `--text` | `#f3f2ee` | Überschriften, Bedientext, Fokus, Kontur „gewählt“ | 16,2 : 1 auf Grund |
| `--text2` | `#c9c8c3` | Lesetext, nicht gewählte Segmente | 10,8 : 1 |
| `--muted` | `#93928d` | Technikstimme ohne Signal, Hinweise, Kontur von Ring-Knöpfen und Feldern (nach Freigabe DS-AB-10) | 5,8 : 1 |
| `--accent` | `#8fd694` | Signal: Kicker, Kapitelnummer, ein Wort je Überschrift, Haken, aktive Marke | 9,6 : 1 auf Fläche |
| `--accent-soft`, `--ok-soft` | `rgba(143,214,148,.14)` | Medaillon hinter einem Haken (`fb-11`), Ring am Punkt der Glas-Meldung | – |
| `--cream` = `--primary` | `#f1f0ea` | genau eine Hauptaktion je Bildschirm | `--on-primary` darauf 15,8 : 1 |
| `--on-primary` | `#161616` | Schrift auf Cream, Pfeilkreis | – |
| `--mo`, `--el` | `#ff8a5b`, `#7aa2ff` | Orange = Maueröffnung, Blau = Element; nur in Zeichnungen, Maßlinien, Render-Spiegelung; `--el` zusätzlich Lichtfarbe des Erdlichts | – |
| `--bad` | `#ff7b72` | nur Fehlerzustand, immer mit Satz und Punkt | 7,2 : 1 |
| `--warn`, `--ok` | `#f0b35a`, `#8fd694` | auf der Website nur Status in Formularen | – |
| neu `--papier` | `#ffffff` (Wert von `--primary-hover`) | Papierweiß von Blatt, Zeichnungskarte, Ankerkachel H5 | Freigabe H5-AB-1, DS-AB-7 |
| neu `--tinte-papier` | `#141414` | Schrift auf Papier | Freigabe P-AB-2 |
| neu `--mo-papier` | `#c2410c` | Zeichnungsorange auf Papier (`--mo` auf Weiß nur ≈ 2,3 : 1) | Freigabe P-AB-2 |
| neu `--zeichnung-wand`, `--zeichnung-glas`, `--zeichnung-rahmen` | Werte aus `web/bilder/messpunkte.svg` | Zeichnungsflächen auf Papier (`he-02`, `he-05`) | 15-15 |
| neu `--primary-druck` | `#e2e1db` | gedrückte Cream (K-2) | Freigabe DS-AB-7 |
| neu `--scrim-blatt` | `rgb(0 0 0 / .6)` | Scrim hinter dem Menüblatt (Wert aus `portal.css:194`) | – |
| auf der Website nicht genutzt | `--float`, `--primary-hover` (als Hover), `--r1` | Schatten entfällt (DG-AB-1), Hover über Kontur (K-2), Radius 8 nur App (K-22) | – |

**Akzentregel [V]:** eine Cream-Fläche je Bildschirm, auch Bild-Cream zählt mit (dann kleiner als ¼ der Bedien-Cream); ein grünes Wort
je Überschrift, Grün nie als Fläche, nie am Held, nie für Fließtext, Rechtsseiten ohne grünes Wort (RE-AB-2); Papierweiß nie neben einer
zweiten Papierfläche im selben Bildschirm; Rang und Zustand nie über eine zweite Akzentfarbe. Anteile je Bildschirm ≥ 80 % unbunt,
≤ 5 % kräftig, > 0,3 % farbig, gemessen mit `farbanteil.py` bei 390 × 844 (DS 11.4.2).

**Lichtfarben [V]:** eine je Bildschirm. Zeichnungsblau `--el` (Erdlicht 16 % → 0, Keil 12 % → 6 %, Kegel 12 % → 5 % → 0, Schlitz 50 %
als 1-px-Linie; `fb-01`, `fb-02`); Cream ≤ 12 % als Ellipse 360 × 192 (`fb-04`); warmes Tageslicht nur im Foto (`he-01`, `he-07`,
`ap-01`). Radial, höchstens drei Verlaufsstopps, `mix-blend-mode: screen` nur in der Bildschicht, eingebackenes Dithering ± 1–2 von 255.
Grün ist keine Lichtfarbe.

### 16.3.3 Typografie

Eine Familie: Inter, lokal aus `web/fonts/`. Größen nur 13, 15, 17, 24, 32 (Telefon) bzw. 40 (ab 1024 px); die Prüfsuite misst auch
verborgene Elemente, jeder `<button>` bekommt eine eigene Größe (SKILL, Abschnitt 4).

| Rolle | Telefon | ab 1024 | Zeile | Gewicht | Laufweite | Farbe | Einsatz |
|---|---|---|---|---|---|---|---|
| Titel (h1, h2) | 32 | 40 | 34 / 42 px | 800 | −0,03 em | `--text`, ein Wort `--accent` | h1 höchstens drei Zeilen, h2 höchstens zwei; `text-wrap: balance` |
| Zahl als Held | 32 | 40 | 34 / 42 px | 800 | −0,03 em, `tabular-nums` | `--text`, Einheit 15 `--muted` | Monatspreis `fb-06`, Preis im Etikett `he-03` |
| Zwischentitel | 24 | 24 | 30 px | 800 | −0,03 em | `--text` | nur Ratgeber, Rechtsseiten, Paketbedingungen; nie in einer Ansicht mit 32/40 |
| Lesetext | 17 | 17 | 26 px | 500 | 0 | `--text2`, Schlüsselwort 700 `--text` | Verkaufsflächen, höchstens drei Zeilen je Block |
| Fließtext lang | 17 | 17 | 27 px | 500 | 0 | `--text2` | Ratgeber, Rechtsseiten |
| Bedientext | 17 | 17 | 22 px | 700 | −0,005 em | `--text` | Knöpfe, Fragen, Paket- und Kurznamen, Menüzeilen, h3 |
| Nebentext | 15 | 15 | 22 px | 500 (Kennwort 700) | 0 | `--text2`, Hinweis `--muted` | Datenblattwerte, Hakenzeilen, Feldbeschriftungen (700), Textziele (700) |
| Technikstimme Versal | 13 | 13 | 16 / 18 px | 600 | +0,12 em | Kicker und Kapitelnummer `--accent`, sonst `--muted`, auf Bild `--text2` | Kicker, Kapitelzeile, Kennwörter, Etiketten, „BEISPIEL“ |
| Technikstimme Zahl | 13 | 13 | 18 px | 600 | +0,02 em, `tabular-nums` | `--text2`, Beträge `--text` | Preiszeile, Maße, Dateinamen, Datum |

Höchstens drei Textstufen je Ansicht (Titel · Lesen 15–17 · Technik 13); das nicht-textliche Hauptelement ist die größte Stufe. Am
Telefon trägt immer ein Bild, Gerät, Blatt oder Maßstab den Maßstabssprung; Arbeitsflächen ohne Held ordnen über Gewicht und Tonwert
(DS 11.3.2). Riesenschrift wird in der ersten Fassung nicht eingesetzt (DS 11.3.4).

### 16.3.4 Raster, Abstände, Kontrollhöhen

| Bereich | Breite | Spalten | Rinne | Seitenrand | Inhaltsbreite |
|---|---|---|---|---|---|
| Telefon | < 640 px | 4 (77,5 px bei 390) | 16 | 16 | 358 px bei 390, 328 bei 360 |
| Zwischengröße | 640–1023 px | 8 | 16 | 24 | Breite − 48 |
| Schreibtisch | 1024–1103 px | 12 (58 px bei 1024) | 24 | 32 | 960 bei 1024 |
| Schreibtisch breit | ≥ 1104 px | 12 (64,67 px) | 24 | mittig | 1040 (bei 1280: x 120–1160) |

| Token (neu) | Telefon | ab 1024 | Rolle |
|---|---|---|---|
| `--a-haar` | 4 | 4 | Kennwort → Satz |
| `--a-gruppe` | 8 | 8 | innerhalb einer Gruppe |
| `--a-nah` | 12 | 12 | Kapitelzeile → h2, h2 → Lead, Cream → Ring, Kachelfuge, Kartenabstand |
| `--a-kopf` | 16 | 16 | Haarlinie → Kapitelzeile |
| `--a-karte` | 20 | 24 | Innenabstand von Karten |
| `--a-gruppen` | 24 | 24 | zwischen Gruppen; Haarlinie → h2 ohne Kapitelzeile |
| `--a-zone` | 48 | 64 | zwischen Zonen; Block im selben Kapitel ohne h2 |
| `--a-abschnitt` | 96 | 128 | zwischen Abschnitten |

Basis 4 px; Gruppe : Gruppen : Zone ≈ 1 : 3 : 6. Komponentenmaße außerhalb der Leiter: Kachel innen 16, Glas-Meldung innen 10/12, Feld
innen 0 16, Segment-Einzug 4. **Sprungziele (K-15):** `scroll-padding-top` 72/80 px; `scroll-margin-top` am nummerierten h2 116/124 px,
ohne Kapitelzeile 96/104 px; neu `--kopf-h` 56 px, ab 1024 px 64 px.

| Token | Wert | Einsatz |
|---|---|---|
| `--h1` (Bestand) | 44 px | kleine Knöpfe in Kopf und Menü, Textziele, Segmente, Brotkrumen-Zeilen, Menü-Unterzeilen |
| `--h2` (Bestand) | 52 px | Knöpfe, Felder, Fragenzeilen, Menüzeilen, Namensleiste |
| `--h-zeile` (neu) | 56 px | Zeilenknöpfe mit zwei Textzeilen (`fb-15`), Demo-Zeilen (`fb-12`) |
| Mindestziel | 44 × 44 px | jede Trefferfläche (SKILL:71) |

**Proportionen [V]** (DS 11.2.4): Kopf 56 px (6,6 % bei 844); erster Bildschirm ≥ 33 % frei, Ziel 40–60 %; Fokusträger 15–35 % (Bühnen
der Stufe 4 am Telefon ab 19 % nach 14-5); Textfläche ohne Kulisse ≤ 15 % des ersten Bildschirms; Lesezone am Schreibtisch 5 von 12 Spalten;
Zeilenlänge 45–75 Zeichen, Telefon ≥ 35, Fließtext ≤ 820 px; Split 5 : 7; Anschnitt der Folge 8–25 % der Bildschirmhöhe; Überdeckung
im Motiv: Etikett ≤ 15 %, aufliegende Karte ≤ ⅓; Hauptelement ≥ 3 × Versalhöhe der Bedienschrift.

### 16.3.5 Radien

| Token | Wert | Wofür |
|---|---|---|
| `--pill` | 999 px | Knöpfe, Chips, Segmente, Spuren, Kreise |
| `--r4` | 24 px | Karte, Paketkarte, Papierkarte, Wechselkarte, Hervorhebungskarte |
| `--r3` | 18 px | Glas (Meldung, PDF-Hinweis), Menüblatt oben |
| `--r2` | 12 px | Kachel, Bildfenster, Browserrahmen, Feld, Miniatur, Etikett auf Papier, Druckfläche und Fokus von Zeilen |

Gleich auf allen Breiten; Motivradien (Gerät 44/34) gehören zum Bild. Kundenkonto bleibt in der Skala des Betriebsbereichs.

### 16.3.6 Ebenen

| Token (neu) | Z | Inhalt | zählt als Ebene |
|---|---|---|---|
| `--z-grund` | 0 | Grund, Lichtraum, Lichtkeil, Messraster | ja |
| `--z-kulisse` | 10 | Riesenwort (derzeit leer) | ja |
| `--z-bild` | 20 | Foto, Render, Bildfolge, Gerät, Blatt, Zeichnung, Beispielbild, Maßstab, Maßlinie, Bildband | ja |
| `--z-vermittelnd` | 25 | Glasflächen, aufliegende Bildkarten, Leitlinien, Lichtschlitz und Kegel | ja |
| `--z-scrim` | 28 | Scrim unter dem Kopf auf Bühnen | nein |
| `--z-ui` | 30 | Bedienschicht | ja (eine Ebene mit 40) |
| `--z-kopf` | 40 | Kopf, Menüblatt, Overlays | – |

Am Telefon 3–4 sichtbare Ebenen, Stufe 4 höchstens 5. Mindestens eine sichtbare Verdeckung je Bühne; nie verdeckt: Gesicht, Hände,
Zollstock, Papierflieger, Navigation, Hauptaktion, Lesetext, Fokusrahmen (DS 11.5.1).

### 16.3.7 Glas, Licht, Kante, Schatten, Scrim

| Token (neu) | Wert | Regel |
|---|---|---|
| `--glas-fuellung` | `rgb(31 31 31 / .60)`, bis .65 wenn der Kontrast es verlangt | nur über Bildinhalt |
| `--glas-blur` | 24 px, Sättigung 100 % | Unschärferadius wird nie animiert |
| `--glas-ersatz` | .80 ohne Weichzeichner, .85 am Telefon über bewegtem Foto | Rückfall ohne `backdrop-filter` |
| `--glas-deckend` | .95 | bei `prefers-reduced-transparency` oder `prefers-contrast: more` |
| `--kante-alpha` | `rgb(243 242 238 / .14)` | 1 px rundum an allem, was schwebt |
| `--kante-licht` | `rgb(243 242 238 / .24)` | Ober- und rechte Kante |
| `--kante-quelle` | Lichtfarbe der Quelle mit 24 % | Kante zur farbigen Quelle (Meldungen, PDF-Hinweis rechts `--el`) |
| `--licht-x`, `--licht-y` | −0,6, 0,8 | Lichtrichtung oben rechts (K-24) |
| Scrim | 96 px, Stopps 100/75/45/15/0 % von 60 % (bis 75 %) | K-26 |
| Begleitschatten | Versatz 10 % der Kartenhöhe in Lichtrichtung, Weichzeichnung 2–3 × v, Ausdehnung −25 % von v, `--ground` 6 % | nur opake Karte auf Papier (K-25) |

Glas gleichzeitig höchstens 2 am Telefon, 3 am Schreibtisch; im Meldungsstapel trägt nur die vorderste Live-Unschärfe; Radius 18,
Umschalter als Pille; kein Schatten. Am Telefon kein Glas über bewegtem Motiv. Karten, Kacheln, Zeilen und Felder auf dem Grund bekommen
keine Lichtkante. Auf dunklem Grund gibt es keinen Schatten. Unschärfe nur hinter Glas (24 px), an Begleitelementen der Leiste (2 px
Telefon, 4 px Schreibtisch) und eingebacken im Bild. Messraster (fein 8 px, kräftig 40 px, Weiß 3–5 %) nur unter `fb-05`.

### 16.3.8 Bewegung

| Token | Wert | Einsatz |
|---|---|---|
| `--t1` | 150 ms | Zustand: Hover, Farbe, Kontur, Druck zurück |
| `--t2` | 220 ms | Rückmeldung nach Eingabe, Kopf-Ring, Menüblatt, Ansichtswechsel, Endzustand nach erster Eingabe |
| `--t2-aus` (neu) | 165 ms | Austritt zu `--t2` |
| `--t3` | 320 ms | Glas klärt sich, Detailzeichnung (Haken), Gleiten im Seitenübergang |
| `--t-motiv` (neu) | 600 ms | Meldung fällt ein, Blatt legt sich, Gerätebildschirm geht an, Maßlinie auf Tippen |
| `--t-buehne` (neu) | 900 ms | Foto-Auftritt jeder Bühne |
| `--t-mass` (neu) | 1.200 ms | zählende Maßlinie im Ladeauftritt, einmalige Bildfolge |
| Szenenwechsel | 500–900 ms | Bildwechsel im Motiv (500 ms auf Tippen) |
| Staffelung | 60–90 ms Versatz, zusammen ≤ 400 ms | gestaffelte Bildelemente |
| Druck | 0 ms | erscheint im selben Bild, geht mit `--t1` zurück |
| `--e-out` | `cubic-bezier(.2,.7,.2,1)` | Auftritt, Zustand |
| `--e-io` | `cubic-bezier(.45,0,.2,1)` | Bewegung auf dem Bildschirm, Szene |
| `--e-in` (neu) | `cubic-bezier(.4,0,1,1)` | Austritt beschleunigt |

| Physik (K-37) | Parameter | Einsatz | nie |
|---|---|---|---|
| Trägheit | ζ = 1, ω = 9 s⁻¹ (≈ 0,22 s Nachlauf, ≈ 0,5 s Auslauf); gestaffelte Schichten τ = 140/200 ms | scrollgekoppelte Bildebenen (`fb-02`, `fb-05`) | Überschwingen |
| Feder | ζ = 0,75, f = 2 Hz, Überschwingen ≈ 2,8 %, Ausschlag ≤ 24 px, Einschwingen ≈ 420 ms; Ziel x* = clamp(8 · v, −24, 24) | Beispielbild in der Paketreihe (`fb-06`) | Bedienelemente, Karten, Knöpfe |
| Abwurf | Tempo der letzten 80 ms, ≤ 1.200 px/s, τ = 0,3 s, dann Einrasten mit Trägheit | Wischen der Leiste; Menüblatt | Federn beim Zurückschnappen |

### 16.3.9 Schalter für Freigaben (Festlegung 15-2)

| Regel heute | Website nach Freigabe | Schalter (Bestandswert bis zur Freigabe) | Abweichung |
|---|---|---|---|
| Kicker 800, +0,18 em | Versalzeilen 600, +0,12 em | `--versal-gewicht`, `--versal-sperrung` | DS-AB-1 |
| 13 px auch für Sätze | Sätze 15 px | `--satz-klein` | DS-AB-2 |
| Cream-Hover Weiß, Druck `scale(.98)` | Hover innere Kontur, Druck `--primary-druck` | `--cream-hover`, `--druck-skala` | DS-AB-3 |
| gewählt = Cream | `--surface3` mit 2-px-Kontur `--text` | `--gewaehlt-flaeche`, `--gewaehlt-schrift` | DS-AB-4 |
| Radien 8 · 12 · 18 · 24 | voll · 24 · 18 · 12 | keiner nötig | DS-AB-5 |
| Erscheinen 8 bzw. 24 px, 0,98 → 1 | Bedienschicht ohne Auftritt | `--auftritt-weg`, `--auftritt-dauer` (0 = aus) | DS-AB-8 |
| Logo-Licht beim Laden | nur ohne Bühnen-Ladeauftritt | Option in `Kopf.auf` | DS-AB-9 |
| Ghost-Rand `--line2` | Ring-Kontur `--muted` | `--ring-kontur` | DS-AB-10 |
| eine Spalte bis 760 px | 640 und 1024 px | Medienabfragen in `rahmen.css` (kein Token) | DS-AB-6 |
| Formular nach dem Ablauf (heutige Folge) | Formular direkt nach den Paketen | Option in PS | E-AB-7 |
| keine Eingabe außer dem Formular | Namensfeld in 01 | Option in PS, Ausnahme in PR:1789-1797 | E-AB-2 |
| ein Ring-Knopf im Kopf, dauerhaft | aus über der Reihe (J-AB-9) und zwischen nahen Sperrzonen (14-AB-2) | Option in `kopf.js` | J-AB-9, 14-AB-2 |
| Startfoto 540–640 px | 420 px bzw. Formel nach 14-12 | ein Schalter nach 15-2 (Name beim Bau) | E-AB-1, 14-AB-1 |

---

## 16.4 Komponenten

### 16.4.1 Bedienkomponenten (Bedienschicht, Z 30)

| Familie | Komponente | Maße, Form | Zustände | Einsatz |
|---|---|---|---|---|
| Knöpfe | **Cream** (Hauptaktion) | Pille 52 px, 17/700 `--on-primary`, Innenabstand 22, Pfeilkreis 28 px rechts (8 px vom Rand) | Hover innere Kontur `--on-primary` 24 %; Fokus 2 px `--text`, Abstand 2; Druck `--primary-druck`; Senden ab 300 ms `aria-busy`, Ring im Pfeilkreis 1,2 s je Umdrehung, `aria-disabled` | V1, Kartenknopf, „Frage senden“, A4, H1, H2, H7, Handlungsbausteine |
| | **Ring** (Nebenhandlung) | Pille 52 px (Kopf, Menü 44 px, 15/700), innere Kontur 2 px `--muted`, kein Pfeilkreis | Hover Kontur → `--text`; Druck `--surface2` | Kopf, Startbild, Gesprächsweg, 404, Wechselkarte |
| | **Textziel** | 15/700 `--text`, Unterstreichung 1,5 px `--line2` mit 4 px Abstand, Ziel 44 px | Hover Unterstreichung → `--text`; Druck `--surface2` | „Mit Ihrem Namen ansehen“, Textziel in 03 |
| | **Zeilenknopf** | 56 px, Radius voll, zwei Zeilen (17/700, darunter 13 oder 15), Cream oder Ring | wie Cream bzw. Ring | `fb-15`, `fb-12` |
| | **Kreisknopf** | 44 px, `--surface2`, Kreuz 16 px aus 2-px-Strichen `--text2` | Kreuz → `--text`; Druck `--surface3` | Menü schließen |
| Auswahl | **Umschalter** | Spur 284 × 44 Glas, Segmente 150 und 126 × 36, Einzug 4, 15/20 | gewählt K-3; Hover Kontur `--line2` am nicht gewählten Segment | `st-02` |
| | **Menü-Segment** | 52 hoch, Segmente nach Wortbreite, Spur 2-px-Innenkontur `--line2` | wie Umschalter | `rh-02` |
| | **Namensleiste** | 358 × 52, drei Segmente 116 × 52, Zeiger 108 × 44, Kurzname 13/600, Preis 15/700 | Zeiger folgt dem Wischen 1 : 1; Rückfall Unterstrich (14-6) | `fb-06` |
| | **Wahlzeile** | 171 × 52, Abstand 8 senkrecht, 16 waagerecht, Ring nach K-1, `aria-pressed`, Gruppe mit „eine Auswahl“ im `aria-label` | gewählt K-3 | `fb-04` |
| | **Messknopf** | 114 × 44 in einer Zeile, Abstand 8, Ring | erledigt = Haken 12 px `--accent` vor dem Wort | `he-02` |
| Flächen | **Karte** | `--surface`, Ring 2 px `--line` innen, Radius 24, innen 20/24 | nur als Ganzes bedienbar: Hover Ring → `--muted` | Wechselkarte, Paketkarte |
| | **Paketkarte** | wie Karte, 310 × 877; empfohlen Ring 2 px Cream und Pille „Empfohlen“ 122 × 28 als Kontur 2 px `--primary` auf `--ground`, 13/700 Versal | Cream-Knopf folgt der Wahl (J-AB-8) | `fb-06` |
| | **Kachel**, **Ankerkachel** | `--surface`, Ring 2 px `--line`, Radius 12, innen 16 (Anker 20) | Hover Ring → `--line2`; Druck `--surface2` | `fb-11`, `he-05` |
| | **Anzeige-Chip** | `--surface2` ohne Rand, 36 px, 13/700, innen 10 mit Haken 6 × 10, Abstand 8 | nicht bedienbar | `fb-01`, `he-03` |
| Formular | **Feld** (K-35) | 52 px, Radius 12, `--ground`, Rand 1 px `--muted`, 17/24 500, innen 0 16; Beschriftung darüber 15/20 700, „(freiwillig)“ 500 `--muted` | Hover Umriss → `--text2`; Fokus 2 px `--text`; Fehler Rand 2 px `--bad`, Satz 15/21 700 mit Punkt 8 px, Fokus auf das erste fehlerhafte Feld, kein Rütteln | `fb-09`, `re-01`, `pa-01` |
| | **Hinweis**, **Dank** | Hinweis 8 px unter dem Feld 15/21 `--muted`; Dank ersetzt das Formular, `role="status"`, Fokus auf den Dank | – | `fb-09` |
| Zeilen | **Fragenzeile** | `details`, 52 px einzeilig, 74 px zweizeilig, Frage 17/22 700, Antwort 17/26 `--text2`, „+“ aus zwei 14 × 2-px-Strichen in 24-px-Feld rechts, offen `--accent` | Haarlinien K-33; Höhe springt, Antwort blendet 220 ms ein (DG-E-14 A, Vergleich mit B offen) | alle Fragenlisten |
| | **Hakenliste** | Haken 16 × 16 (Strich 2,5) `--accent` links, Text ab x 48, 15/22; ehrliche Grenze ohne Haken in `--text2`, eingerückt | – | `fb-08`, `he-04` |
| | **Datenblatt** | `dl`, Kennwort 13/600 Versal `--muted`, Wert 15/500 `--text`, Haarlinien `--line2`, vier gleiche Zeilen je Karte | – | `fb-06` |
| | **Tabelle** | Telefon ohne Querscrollen: Zeilentitel über die volle Breite, darunter drei Wertspalten à ≈ 114 px; Kopf aus drei Kurznamen klebt ab 500 px Höhe | – | `fb-07`, `pb-02` |
| Navigation | **Kopf**, **Scrim**, **Menüblatt**, **Kapitelzeile**, **Brotkrumen**, **Fuß** | nach 16.2.2, K-16, K-26 bis K-28 | – | Rahmen |

### 16.4.2 Bildbausteine (Bildschicht, Z 0–25)

| Baustein | Regel | Einsatz |
|---|---|---|
| Foto-Bühne | randlos, Auslauf über das untere Viertel bis Drittel mit fünfstufiger Maske in `#161616`; Telefon eigener Zuschnitt per `<picture>`; Schreibtisch ab Spalte 6 randlos bis zum Fensterrand | `fb-01`, `he-01`, `ap-01` |
| Bildband | 390 × 200, oben und unten ausgeblendet; h2 darf den Bandfuß um 24 px überdecken | `he-07` |
| Gerät (K-23) | 300 px, Rand 10 px `--surface`, Radien 44/34, Lichtkante, unten über 48 px ausgeblendet; verkleinert proportional (96 px: 14/11; 160 px: 23/18) | `fb-03`, `fb-04`, `fb-15` |
| Browserrahmen mit Beispielbild | Radius 12, Leiste 24 px `--surface2`, Adresspille 18 px mit Schloss und „ihr-name-fenster.de · Beispiel“; Lichtkante oben | `fb-03` (Schreibtisch), `fb-06` |
| Blatt | Papier `--papier`, −2°, Lichtkante oben am Kopfband, Schichten als eigene Bildebenen; aufliegende Karte opak `--surface` mit Lichtkante und Begleitschatten | `fb-05`, `he-03` |
| Papierkarte (Zeichnung) | `--papier`, Radius 24, ohne Ring, ohne Schatten; Farben `--mo-papier`, `--tinte-papier` | `he-02`, `ar-01` |
| Miniatur | Radius 12, 1-px-Kontur `--line2` oder Lichtkante oben, Maske unten über 32 px | `fb-12`, `fb-15`, `he-04` |
| Maßlinie | Haarlinie 1,5 px mit Endstrichen, Wert mittig auf dunklem Glas (Pille 13/600 `tabular-nums`, Füllung `rgb(22 22 22 / .62)`, Weichzeichner 12 px, Ring 1 px `--mo` 50 %); Orange = Öffnung, Blau = Element; nie über Gesicht oder Hände | `fb-01`, `he-02` |
| Glas-Meldung | 220 × 64, Radius 18; Stapel aus drei, hintere nur als Kante (`translateY` 10/19 px, `scale` .94/.88); grüner Punkt 8 px, Titel 15/700, Zeile 13/500 `--text2`; Etikett „BEISPIEL“ darüber | `fb-01` |
| PDF-Hinweis | ≤ 260 × 168, Radius 18, Titel 15/700, Zeile 15, Handlungszeile 44 px mit Chevron; Fläche Z 25, Inhalt Z 30 | `st-03` |
| Leistenkachel | Rendering mit Alphakanal, scharf und weich; Wölbung nur am Bild, Namen frontal über Deckkraft | `fb-02` |
| Maßstab | Strichskala 1 px, fein alle 8 px, kräftig alle 40 px, Marken in der Technikstimme; Marke wird grün als Zustand | `fb-10`, `he-04` |
| Lichtkeil, Kegel, Lichtfleck, Messraster | nach 16.3.2 und 16.3.7, nur an den Orten aus 16.6.5 | `fb-01`, `fb-02`, `fb-04`, `fb-05` |

„Beispiel“-Kennzeichnung (K-36) an jedem erfundenen Material in genau einer Form; eine Beispielfirma „Fensterbau Brandt“, eine
Beispielfamilie „Familie Weber“, eine Beispieldomain; keine Stimmen, Zähler, Siegel (SKILL:49).

### 16.4.3 Kompositionsmuster (DS 11.1.4)

| Muster | Telefon 390 × 844 | Schreibtisch | Stufe, Dialekt | Einsatz |
|---|---|---|---|---|
| K1 Bühnen-Diagonale | Foto randlos 390 × 420 (y 0–420), Anker im rechten oberen Viertel, unteres Viertel ausgeblendet; Lesestapel links unten y ≈ 320–660: Kicker 13 → h1 32 → Chips oder Lead → Preiszeile 13 → Cream 52 → 12 → Ring 52; Folgeabschnitt schneidet ab y ≈ 690–776 an | Text Spalten 1–5 senkrecht mittig, Foto ab Spalte 6 randlos, y 0–760 | 3–4, B | `fb-01`, `he-01`, `ap-01`, `st-03` |
| K2 Gerät auf der Achse | Telefon 300 px auf der Mittelachse; 01 zeigt die oberen 420 px, 02 die unteren 240 px desselben Geräts | Browserfenster 560 × 360 rechts, Telefon 220 × 450 überdeckt dessen linke untere Ecke zu ≈ 14 % (`fb-03`) | 2–3, B | `fb-03`, `fb-04`, verkleinert `fb-15` |
| K3 Blatt-Vitrine | Papier 290–330 px, −2°, einziger großer Hellwert; eine aufliegende opake Karte | Liste links über 5, Szene rechts über 7 | 2–3, B | `fb-05`, `he-03`; Zeichnungskarte `he-02`, `ar-01` |
| K4 Maßstab mit Schritten | senkrecht an der linken Kante (x 16–40, Schritte ab x 56) oder waagerecht 358 × 64 | Maßstab links, Schritte über 7 Spalten | 2, C | `fb-10`, `he-04` |
| K5 Kartenreihe | Karte 310 px mittig eingerastet, Nachbarn je 28 px angeschnitten, Namensleiste 358 × 52 darüber | drei Karten in 1040 px mit `subgrid` | 2, C | `fb-06` |
| K6 Zeilenliste | Zeilen 44/52/56 px zwischen Haarlinien, Text ab x 16, Zeichen rechts im 24-px-Feld (x 350–374), keine Kartenfläche | Liste rechts über 7, h2 links über 5 | 1, C | `fb-07`, `fb-08`, `fb-12`, `fb-13`, `he-06`, `pa-01`, `rh-02`, `re-01` |
| K7 Kachelfeld mit Anker | eine Ankerkachel (volle Breite oder hervorgehoben im 2 × 3), übrige leiser; Fuge 12 | Ankerkachel über zwei Spalten | 2, C | `fb-11`, `he-05` |
| K8 Klammer am Seitenende | Bildband 390 × 200 mit h2 im Auslauf und Cream über die volle Breite, oder Mini-Vorschau 96 × 192 links neben drei Zeilenknöpfen 250 × 56 | Band ab Spalte 6 randlos bzw. Vorschau 160 × 320 über 3 Spalten, Zeilen über 6 | 2, C | `he-07`, `fb-15` |
| K9 Band | 144 px (Schreibtisch 176), randlos, Haarlinien oben und unten, Mitte 1,25-fach unter einem Lichtkegel | volle Fensterbreite | 3, B | `fb-02` |
| K10 Formular | Feldsäule 358 px, Felder 52 px, Beschriftung 15/700 darüber, Cream über die volle Breite am Ende | Hinweis links über 5, Formular rechts über 7 | 1, C | `fb-09`, `re-01`, `pa-01` |

Jeder Abschnitt folgt der Formel **Grund → (Kulisse) → genau ein Held → flache Bedienschicht** und dem Satzbau Haarlinie 1 px über die
Spalte → 16 px → (Kapitelzeile 13/16) → 12 px → h2 → Held → Lesestapel (höchstens drei Zeilen je Block, höchstens zwei Blöcke je
Bildschirm) → Handlung im Daumenbereich (DS 11.1.1).

### 16.4.4 Code-Bausteine und Schnittstellen

Schnittstellen im Einzelnen: IM 15.4. Übersicht:

| Ort | Bausteine |
|---|---|
| Server, PS (danach immer `node scripts/bedingungen-pdf.mjs`) | neu `ab-preis`, `geraet`, `preisstand`, `festblock`, `abschluss`; geändert `karten`, `vergleich`, `bestellen`, `ablauf`, `demos`, `leistungen`, `beispiel`, `punkte`, `hinweis`, `formular` |
| Generator RB (idempotent, von PR verglichen) | Kopf, Menü, Fuß und Brotkrumen aller statischen Seiten; `artikelkopf()`; Handlungsbausteine (`HANDLUNG`, `variante()`); Rechtsseiten-Gliederung; generierte Teile der Textfassung von `/` |
| Neue Browser- und Node-Module | `web/assets/kopf.js` (`Kopf.html`, `Kopf.menue`, `Kopf.auf`), `web/assets/fuss.js` (`Fuss.html`, `GRUPPEN`, `RECHT`, `KONTAKT`), `web/assets/aufmass-inhalt.js` (`AufmassInhalt.LISTE`), `web/assets/rahmen.css`; nur Fassung B der Fehlerseite `web/assets/fehler.js` |
| Hilfen in GJ | `Sprung.zu`, `Auftritt.foto`/`Auftritt.ersteEingabe`, `Lottie.laden`, `eigenesAufmass` |
| Module in VJ (alle aus `Verkauf.auf(wurzel, o)`, idempotent, Beobachter über `beobachten()`) | `zustand`, `startbild`, `bullauge`, `leiste`, `ihrName`, `probe`, `postfach`, `pakete`, `formular`, `ablauf`, `zusagen`, `abschluss` |
| PJ (Startseite) | `umschalter(ort)`, `vonPdfHinweis(wurzel)`, `wechsel(zu)`, Startbild-Übernahme, `probeMessung()`, `aufmassBlattPreis()`, Ablauf und Daten, `RATGEBER_WEG`, `abschlussHE()`, `preiszeileHE()` |
| App, Kundenkonto | `apKonditionen()`, `startAuftritt()`; `weiche()`; Bestätigung in Schritt 1 nur nach OE-34 |
| Ereignisse | `vk:name` `{ name }`, `vk:probe` `{ element, sonnenschutz, beruehrt }`, `vk:wahl` `{ paket }`, `vk:gesendet` |
| Speicher (`sessionStorage`, Cookies-Seite nennt sie) | `aufmass.vk.name`, `aufmass.vk.probe`, `aufmass.vk.wahl`, `aufmass.vk.gesendet` (nur Merker); nichts verlässt den Browser außer dem Formular beim Absenden |
| Datenattribute (Vertrag zwischen Abschnitten und Kopf) | `data-kopf-buehne-ende`, `data-kopf-start`, `data-kopf-wechsel`, `data-kopf-ziel`, `data-zustand="a\|b"`, `data-kopf-cream`, `data-fortsetzen`, `data-sprung="direkt"`, `data-abschnitt="<id>"` |
| Rückbau | in VJ `zahlen()`, `szene()`, `buehne()`, `fortschritt()`, Meldungsschleife, Leiste B, Reveal-Block, Zeitleisten-Bindung; in VC Staub, Atmen, Telefonbühne, Schein, Wisch-Hinweis, Lesefortschritt; Lottie `messen`, `senden`, `eingang`, `fotos`, `farbwechsel` auf der Website (IM 15.3.2) |

---

## 16.5 Assets

### 16.5.1 Beim Inhaber anzufragen

Vollständige Vorgaben mit Zonen, Licht und englischem Prompt (**Anfrageentwürfe**): IM 15.11.1. Anfragen nach SKILL, Abschnitt 7.
Videos sind nicht eingeplant.

| Nr. | Asset | Format, Lieferung | Zweck, Bedingung | für | Status |
|---|---|---|---|---|---|
| A1 | Telefonzuschnitt des Startfotos (Astronaut am Bullauge) | Hochformat, Bildfeld 390 × 472 (420 Foto + 52 Kopfraum der Einbettung); Lieferung ≥ 1170 × 1416, besser 1560 × 1888; Ausgabe 780 × 944, WebP ≤ 140 KB plus AVIF | freie Stapelzone x 0–65 %, y 24–51 %; Gesicht, Bullauge, Hände, Zollstock, Papierflieger auch bei 300 px Bildhöhe im Bild (14-12) | `fb-01`, `st-02`, `st-03` | fehlt |
| A2 | Telefonzuschnitt des Startfotos der Startseite (Waschbär) | 13 : 14, Bildfeld 390 × 420; Lieferung ≥ 1170 × 1260, besser 1560 × 1680; Ausgabe 780 × 840 (≤ 110 KB) und 1170 × 1260 (≤ 170 KB) | ruhige Wand unter dem Glas-Umschalter (x 0–81 %, y 0–28 %) | `he-01`, `st-02` | fehlt |
| A3 | Fotos des Beispielbetriebs „Fensterbau Brandt“ (bis 6) | 4 : 3, 1200 × 900, JPEG oder WebP; Licht warm von oben rechts | erkennbar erfunden, keine Personen, keine Logos, keine Herstellermarken | Beispielbilder Plus und Signature (`fb-06`), Miniatur `fb-15` | fehlt |
| A4 | zwei Fensterfotos (optional) | JPEG 1600 × 1200, frontal, Tageslicht | nur klein in der Schicht „Fotos“ des Beispiel-Aufmaßblatts | `fb-05` | optional |
| A5 | Figur der Fehlerseite (nur Fassung B) | PNG mit Transparenz oder grünem Grund, 1.200 × 1.500, warme Quelle oben rechts; Motiv nach Wahl des Inhabers | ohne Text und „404“ | `nf-01` | optional |
| A6 | `app-start-1600`; Original von `start-hauseigentuemer` ≥ 2.000 px | 1600 × 2000 | Schreibtisch mit Pixeldichte 2 | `ap-01`, `he-01`, `he-07` | optional |

**Freigaben ohne neues Material:** Look „Vitrine“ der Renderings, Auswahl der vier Führungsbildschirme, Liste der 14 Elementarten
(PA-Frage 29), neutrales Monogramm „Beispiel“ statt eines erfundenen Logos, „Fensterbau Brandt“ als einzige Beispielfirma (IM 15.11.1).

### 16.5.2 Im Haus erzeugbar (Freigabe des Ergebnisses durch den Inhaber)

| Asset | Format, Maß, Budget | Freistellung | Werkzeug | für |
|---|---|---|---|---|
| 14 Renderings der Elementarten, scharf und weich | WebP mit Alpha, 240 × 240 und 180 × 180, je ≈ 6–12 KB, hellster Wert ≤ `#c9c8c3`, Licht oben rechts | Alpha, Kante 1–2 px ohne Saum | `scripts/buehne-bilder.mjs` (neu) | `fb-02` |
| 6 Standbilder der Probe | WebP 600 × 640, ≤ 35 KB | Grund exakt `#161616` (ΔE00 ≤ 1) | `buehne-bilder.mjs` | `fb-04` |
| 3 Bildfolgen Raffstore | je 30 × 450 × 480, je Bild ≤ 15 KB, ≤ 450 KB je Folge | wie oben | `buehne-bilder.mjs` | `fb-04` |
| Standardbild-Ausschnitt im Gerät | WebP 500 × 281 und 750 × 422, ≤ 45 KB | – | aus `app-start.webp` | `fb-03` |
| Schichten des Aufmaßblatts | 2 × WebP 920 × 230, ≤ 20 KB, Fingerabdruck | – | `scripts/tour-bild.mjs` | `fb-05` |
| Beispielbild je Paket | 708 × 460, AVIF ≤ 40 KB, WebP ≤ 55 KB (Aufnahme 1480 × 960) | rechteckig | `scripts/website-bilder.mjs` (neu) | `fb-06` |
| Demo-Miniaturen (nur mit Demos) | 3 × WebP 192 × 144, ≤ 8 KB | rechteckig | `website-bilder.mjs` | `fb-12` |
| Auswahl-Miniatur | 96 × 72 | rechteckig | `website-bilder.mjs` | `fb-09` (Variante) |
| Abschluss-Miniaturen | 3 × WebP 270 × 558, ≤ 25 KB | rechteckig | `website-bilder.mjs` | `fb-15` |
| Kundenfassung des Aufmaßblatts | WebP 600/920/1240, je ≤ 80 KB, Fingerabdruck | – | `tour-bild.mjs` Variante `kunde` | `he-03` |
| Probemessung | SVG 358 × 300, ≤ 4 KB, Systemschrift | – | aus Code | `he-02`, `st-05` |
| Führungsbildschirme | 4 × WebP 260 × 533 und 520 × 1067 | – | `website-bilder.mjs` mit `KI_ATTRAPPE=1` | `he-04` (Fassung B) |
| Bildband H7 | WebP 1100 × 564, ≈ 75 KB | – | `scripts/fotos.py` | `he-07` |
| App-Start klein | WebP 780 × 975, ≤ 95 KB | – | `fotos.py` | `ap-01` |
| Platzhalter der Telefonzuschnitte | wie A1/A2 aus den Bestandsfotos | – | `fotos.py` | nur Vorschau und Telefon-Video |
| Vorschaubild der Seite für Fensterbauer | PNG 1200 × 630 | – | `scripts/marke-bilder.mjs` | System |

**Voraussetzung: Materialprobe der Bühne** (S0): ein Rendering „Dreh-Kipp-Fenster“ 240 × 240 mit Alphakanal und eine Bildfolge
„Fenster mit Raffstore“ (30 Bilder) aus `/app/?gl=voll` ohne Grafikchip, ohne Änderung an `app.js` und `buehne.js`; vorgelegt mit Zeit je
Bild, Dateigröße, Kantenqualität, Alphakanal ja/nein; entschieden wird Bildfolge oder Standbilder (IM 15.11.2; ZA 8.3.2 g).

### 16.5.3 Vorhanden, nicht mehr eingebunden, Regeln

- **Wiederverwendet:** `fb-sessel.webp` (Schreibtisch), `start-hauseigentuemer.webp`, `app-start.webp`, `tour-aufmassblatt-15.webp`,
  `web/bilder/messpunkte.svg` und die Zeichnungen der Ratgeber, `lottie/fertig.json`, Inter.
- **Nicht mehr eingebunden (Dateien bleiben):** `gross.webp`, `fb-kundenschutz.webp`, `fb-frage.webp`, `fb-kunden-planen.webp`,
  `fuer-fensterbauer.webp`, `start-fensterbauer.webp` (Einsatz offen, PA-Frage 24), Marketing-Videos.
- **Platzhalter** zeigen den Effekt nur in Vorschau und Telefon-Video, nie auf `main`; ein Bildplatz ohne echtes Bild entfällt
  (IM U8; IA-AB-8). Fehlende Assets werden nie angefragt (PR zählt jede Antwort ab 400).
- **Formate und Budgets:** 2 × Darstellungsbreite, 3–4 `srcset`-Stufen, feste `width`/`height` oder `aspect-ratio`; AVIF mit
  WebP-Rückfall, SVG für Zeichnungen; Fokus-Asset ≤ 200 KB Telefon (≤ 400 KB Schreibtisch), nie verzögert, `fetchpriority="high"`;
  Bilder im ersten Telefon-Bildschirm ≤ 300 KB; Bildfolge ≤ 60 Bilder und ≤ 3 MB, erst bei Annäherung, Pixeldichte im Canvas ≤ 1,5
  (DS 11.8.3). Kein Text und kein Wasserzeichen im Bild; jede Information im Bild steht zusätzlich in der Bedienschicht; keine
  Stockfotos, keine Echtzeit-3D auf Verkaufsflächen.

---

## 16.6 Bewegungsregeln

### 16.6.1 Verbindliche Regeln [V]

1. **Ort:** Bewegung, Physik, Licht und Unschärfe nur in der Bildschicht (Z 0–25). Die Bedienschicht ändert nur Füllung, Kontur, Farbe,
   Deckkraft; kein Auftritt, kein Versatz, keine Skalierung (K-6; DNA Nr. 1, 9, 10).
2. **Ein Träger je Ansicht**, auch beim Laden und im Übergang; jede Szene endet, bevor die nächste beginnt. Farb- und Deckkraftwechsel
   (Kopf, Marken, Zustände) zählen nicht als Träger. Höchstens ein Drittel der Elemente bewegt sich gleichzeitig.
3. **Ende:** autonome Bewegung endet nach ≤ 5 s; keine Schleife ohne Reaktion; Schleifen und `requestAnimationFrame`-Arbeit nur,
   solange die Szene im Bild ist; Pause in verborgenen Tabs.
4. **Erste Eingabe** (Scrollen über 4 px, Wischen, Rad, Taste) führt Laufendes in 220 ms per Deckkraft in den Endzustand (K-7).
5. **Natives Scrollen:** kein Anheften am Telefon, keine Scrollsteuerung, kein Einrasten der Seite; am Schreibtisch höchstens eine Szene
   je Kapitel angeheftet, ≤ 1,2 BH mit ≥ ⅓ Ruhe (derzeit nur die Geräte-Bühne in 01, ≤ 1,1 BH).
6. **Jede Szene trägt als Standbild:** Endbild = ruhige Fassung = Fassung ohne JavaScript.
7. **Animierte Eigenschaften:** Motiv, Ebenen, große Flächen nur `transform` und `opacity`; kleine Bedienelemente zusätzlich Farbe,
   Kontur, Füllung; nie Unschärferadius, Schatten oder Layout; kein `transition: all` (Codesperre N9).
8. **Licht nur vorne:** Erdlicht, Keil, Kegel und der Lichtfleck in 02 sind die einzigen Lichtquellen der Seite für Fensterbauer.
9. **Sprünge sofort**, glatt nur ohne Szene dazwischen; Fokus danach auf dem Ziel-h2 bzw. der h3 `#frage` (K-10, 15-5).
10. **Einbettung gleich:** dieselben Szenen in `/#fensterbauer`, kein zweiter Ladeauftritt nach Neuaufbau (`still`).
11. Jede Bewegung ist **Neuentwurf** (die DNA stammt aus Standbildern); verbindlich sind ihr Ort und die tragfähigen Standbilder, ihre
    Wirkung prüft der Inhaber im Telefon-Video (ST, Kennzeichnungen).

### 16.6.2 Szenen der Seite für Fensterbauer (Telefon)

| Szene | Abschnitt | Auslöser | Ablauf | Ende, ruhige Fassung |
|---|---|---|---|---|
| Ladeauftritt | V1 | Laden, Bühne im Bild | Foto 0–0,9 s (Deckkraft 0,35 → 1, Maßstab 1,03 → 1, nach `decode()`); Meldungen bei 0,9 / 1,6 / 2,3 s je 600 ms ohne Abprallen; Maßlinie 2,9–4,1 s, Wert zählt in der Bildschicht | Stand ab 4,1 s; erste Eingabe → Endzustand in 220 ms; ruhig: Endbild mit gezeichneter Maßlinie |
| Leiste | V2 | ab dem ersten Scrollschritt | Versatz nach Scrolltempo (Faktor 0,42), Trägheit (K-37); Bilder wölben sich, Namen wechseln über Deckkraft; wischbar mit Achsensperre (14-13), Abwurf | 150 ms Ruhe → Einrasten auf die Kachelmitte, spätestens 1,2 s nach der letzten Eingabe; steht, sobald das Gerät aus 01 zu 50 % im Bild ist (12-1); Rückfall flache Leiste bei Median-Bildzeit > 25 ms für 2 s; ruhig: stehende Reihe, Mitte scharf |
| Gerät geht an | 01 | Gerät ≥ 60 % im Bild und Leiste steht | Bildschirm des Geräts geht einmal an (600 ms); Name erscheint nach „Fertig“ (Überblendung 220 ms) | ruhig: Name ohne Überblendung |
| Probe | 02 | Tipp auf eine Wahlzeile | Bildwechsel 500 ms, Licht 50 ms später, höchstens zwei Reaktionen je Tipp; bei „Raffstore“ Bildfolge einmal 1,2 s auf `<canvas>` | ruhig/ohne JavaScript: zwei Standbilder; Rückfall Einzelbild bei Median-Bildzeit > 25 ms |
| Blatt und Explosion | 03 | Blatt-Oberkante y ≈ 600, dann Blattmitte = Bildschirmmitte | Blatt legt sich einmal (600 ms, 24 px aus Lichtrichtung); Schichten 0 / 28 / 56 px nach oben, 0 / 12 / 24 px nach rechts, mit Trägheit; Führungslinien zeichnen sich mit | 200 ms Ruhe bei p ≥ 0,35 → p = 1; ruhig/ohne JavaScript: auseinandergezogenes Endbild |
| Wischreihe | 04.1 | Finger | nativ mit `scroll-snap`, ohne Überschwingen; Beispielbild läuft ≤ 24 px nach und holt mit Feder auf; Zeiger der Namensleiste folgt 1 : 1 | ruhig: kein Nachlauf |
| Formular, Dank | 05 | Eingabe, Senden | Rückmeldung 220 ms; Fehler über Rand, Satz, Fokus; Dank ersetzt das Formular, Lottie-Haken einmal (bei Bedarf geladen) | ruhig: Dank ohne Haken-Animation |
| Ablauf-Marken | 06.1 | Schritt passiert die Bildschirmmitte | Marke wird grün als Zustand (220 ms, `border-color`/`color`) | ruhig/ohne JavaScript: alle Marken erreicht |
| Haken | 06.2 | Kachel zu 60 % im Bild | Haken je 320 ms als Abdeckung `scaleX`, nacheinander, zusammen ≤ 1,3 s | ruhig: Haken stehen |
| Abschluss | A4 | `vk:wahl`, `vk:gesendet` | Cream wechselt an die gewählte Zeile; Miniatur blendet 220 ms über | ruhig: ohne Überblendung |
| Kopf | Rahmen | Schwellen aus Datenattributen | opak 150 ms ein / 110 ms aus (Hysterese 24 px); Ring 220 / 165 ms Deckkraft, Textwechsel 100 + 120 ms | Zustände ohne Bewegung |

### 16.6.3 Szenen der Startseite und Rahmenszenen

| Szene | Ort | Ablauf |
|---|---|---|
| Foto-Auftritt H1 | `he-01` | wie V1 (K-7), Überschrift steht ab dem ersten Bild; Glas des Umschalters klärt sich nach dem Foto (Ersatzfüllung .80 → Glas, 320 ms); sonst Ruhe |
| Probemessung | `he-02` | Tipp zeichnet die Maßlinie (600 ms), Wert zählt mit (1.236 / 1.231 / 1.234 mm, „Beispiel“); nach dem dritten Wert Etikett „kleinstes Maß“ 1.231 mm; Einrasten des Endstrichs 0,6 → 1,03 → 1 in 220 ms [H], Rückfall ohne Überschwingen; ohne JavaScript alle drei Linien mit Werten |
| Blatt H3 | `he-03` | Blatt legt sich einmal (600 ms, 24 px aus Lichtrichtung); Bedienschicht ohne Einblenden |
| H4, H5, H7 | `he-04`, `he-05`, `he-07` | H4 ohne Bewegung (Fassung B: Miniaturen einmal über Deckkraft); H5 Zeichnung 600 ms; H7 keine |
| Ansichtswechsel | `st-02`, `st-04`, `rh-02` | Segment malt seinen Zustand (150 ms), Neuaufbau in einer späteren Aufgabe (14-21), Sprung an den Anfang ohne Gleiten, neue Ansicht blendet in 220 ms ein, dann ihr Foto-Auftritt (K-5); Kopf und Umschalter stehen |
| Menüblatt | `rh-02` | 220 ms ein, 165 ms aus über Deckkraft; Einfahren in der Ebene nur als Variante (DG-E-12) |
| Seitenwechsel | alle | ohne Animation; als Verbesserung View Transitions zwischen Dokumenten mit 220 ms Überblendung, ein gemeinsames Element darf 320 ms gleiten (J-H10) |

### 16.6.4 Ruhige Fassung, ohne JavaScript, Einbettung [V]

- `prefers-reduced-motion: reduce`: Endbild jeder Szene ab dem ersten Bild; keine Schleife, keine Tiefe, keine Scrollkopplung, kein
  Versatz; Farb- und Deckkraftwechsel bleiben; Ansichts- und Seitenwechsel als Schnitt; Sprünge immer sofort.
- Ohne JavaScript: die Reihenfolge im HTML ist der Endzustand; Bedienschicht vollständig; Szenen als Standbilder; Formular sendet als
  gewöhnliches Formular (`method="post"`); „Menü“ springt zu `#navigation` (IM 15.8).
- Eingebettet: jede Bindung idempotent in `Verkauf.auf`, Zustand im Modulspeicher mit Spiegel in `sessionStorage`, Zustand nach Neuaufbau
  ohne Bewegung wiederhergestellt (Name, Probe, Wahl, Dank), kein zweiter Ladeauftritt (IM 15.7 E1–E12).
- `prefers-reduced-transparency` und `prefers-contrast: more`: Glas deckend .95; `forced-colors`: Konturen als `border`/`outline`.

### 16.6.5 Signature-Effekte: Ort im Code

Verbindliche Merkmale gelten überall, variable je Abschnitt dosiert, Signature-Effekte nur gezielt (DNA 5.2–5.4; DS 11.1.2–11.1.5). Die
Umsetzung bindet jede Signature an ihren Ort, damit sie nicht unbemerkt an eine zweite Stelle wandert (IM 15.1.3).

| Art | Merkmal | Ort | Kontrolle |
|---|---|---|---|
| verbindlich | Grund `#161616`, Ordnungslinie, Raster, Abstände, Typorollen, Radien, Knopf- und Zustandsfamilien, Fokus, Kopf, Fuß | Tokens in GC, Regeln in `rahmen.css` unter `.web` | Codesperre, Schriftgrößen, Cream- und Grün-Prüfung |
| variabel | Stufe, Art des Helden, Ordnungsfigur, Bildanteil, Lichtfleck | Block mit `data-abschnitt="<id>"` in VC bzw. PC | Telefon-Video, `farbanteil.py` |
| Signature, inszenierend | Glas mit Hintergrundunschärfe | nur `fb-01` (Meldungen), `st-02` (Umschalter), `st-03` (Hinweis) | `backdrop-filter` nur in diesen Blöcken |
| Signature, inszenierend | Lichtübertrag (Rahmenbruch), Lichtraum | `.vk-keil` in `fb-01`, Kegel in `fb-02`, Lichtfleck in `fb-04` | `mix-blend-mode` und Lichtverläufe nur dort |
| Signature, inszenierend | Schärfestaffelung | nur `leiste()` in `fb-02` | – |
| Signature, inszenierend | Explosionsansicht mit Annotation | nur `postfach()` in `fb-05` | – |
| Signature, informierend | Maßlinie mit Wert, Messraster, Fortschritts-Maßstab | `fb-01`, `he-02`; `.vk-raster` nur unter `fb-05`; `fb-10`, Maßstab `he-04` | – |
| bewusst nicht eingesetzt | Riesenwort, Staub, scrollgekoppelte Bildfolge, Kantenlicht, Kapitelanzeige im Kopf, Lesefortschritt, Foto-Tiefe, Flug des Telefons, Formanschluss Telefon → Blatt | – | Codesperre meldet Staub und Lesefortschritt |

Dosierregeln [V]: höchstens zwei Abschnitte der Stufe 4 je Seite, nie hintereinander; höchstens zwei Abschnitte der Stufe ≥ 3 in Folge;
Entscheidungs- und Arbeitsflächen ≤ Stufe 2 ohne inszenierende Signature; erster Bildschirm einer Verkaufsfläche Stufe 3 oder 4; jede
inszenierende Signature höchstens einmal je Seite, Glas und Lichtort höchstens an zwei Orten, nie in aufeinanderfolgenden Abschnitten;
Kapitelnummern zählen außerhalb des Budgets (Auslegung, OE-4). Die Budgets von V1, V2 und 02 halten nur unter den Auslegungen „Kegel als
Ende des Lichtübertrags“ und „Bildfolge auf Tippen = Antwort“ (RP-44); ihre Rückfälle stehen in 16.10.

### 16.6.6 Leistung der Bewegung

Rückfallstufen: 0 statisch (ohne JavaScript, weniger Bewegung, `Save-Data`), 1 Standard (CSS, Bildfolgen mit Poster), 2 Grafikchip nur
mit Ersatzfassung und nach bestandener Prüfung auf einem mittleren Android-Telefon (in dieser Planung nicht eingesetzt). Median-Bildzeit
> 25 ms → flache Leiste, Einzelbild statt Bildfolge, kein Seitenübergang; `Save-Data` → keine Bildfolgen; ohne `backdrop-filter`
Ersatzfüllung; `will-change` nur während der Bewegung; Tipp-Handler schreiben nur Zustand, Bildarbeit danach (INP) (IM 15.10.3).

---

## 16.7 Responsive-Regeln

### 16.7.1 Prüfansichten

| Ansicht | Größe | Zweck |
|---|---|---|
| Telefon, Hauptansicht | 390 × 844 | alle Kompositionen, Telefon-Video (SKILL:28) |
| Telefon, reale Höhe | 390 × 664 | E-1: Preissignal und Cream im ersten Bildschirm |
| kleines Telefon | 375 × ≈ 553 (Schätzung, Safari mit Leisten) | Cream im Bild nach 14-12 |
| Umbruch | 320 und 360 px Breite | kein Querscrollen, 200 % Text, Textabstände nach WCAG 1.4.12 |
| Querformat | sichtbare Höhe ≈ 300–340 px | klebender Tabellenkopf nur ab 500 px Höhe (14-14) |
| Schreibtisch | 1280 × 800, 1024 × 768 | Split 5 : 7, nichts überdimensioniert |

### 16.7.2 Regeln [V]

1. **Telefon zuerst:** jede Komposition ist eine eigene Telefon-Komposition, keine verkleinerte Schreibtisch-Fassung (WF 13.3).
2. **Zwei Umbruchpunkte 640 und 1024 px** (K-11); Komponenten mit eigener Schwelle fragen ihre Behälterbreite ab (Container-Abfragen):
   Paketreihe → drei Spalten ab Behälterbreite 900 px (10-4).
3. **Schrift:** h1/h2 32 px bis 1023 px, 40 px ab 1024 px; zwischen 640 und 1023 px stehen Text und Bild im Stapel, nicht im Split.
4. **Schreibtisch:** Split 5 : 7 (Text links über 5 Spalten, Held rechts über 7, randlos bis zum Fensterrand); 6 : 6 nur zwischen 1024 und
   1103 px, wenn die h2 in fünf Spalten dreizeilig bräche; Kopf 64 px; Hover nur unter `@media (hover: hover)`; Browserfenster mit Domain
   in 01 nur am Schreibtisch; Anheften nur in 01 (≤ 1,1 BH); in 04 drei Karten nebeneinander, Preis und Knopf jeder Karte im ersten
   800-px-Bildschirm des Abschnitts; Formular zweispaltig; Fließtext ≤ 820 px.
5. **Erster Bildschirm (E-1):** Preissignal und Cream in den oberen ≈ 600 px bei 390 × 664; Fotohöhe der Bühnen nach Freigabe 14-AB-1
   min(420 px, 100svh − a − 8 px), mindestens 300 px, mit a = Abstand Fotounterkante → Unterkante der Cream (`fb-01` 174 px, eingebettet
   226 px; `he-01` 182 px; `ap-01` behält `min(…, 62svh)`); ohne `svh`-Unterstützung 420 px; gekürzt wird der dunkle Auslauf unten.
6. **Umbruch statt Abschneiden** (14-15): `white-space: normal`, `min-height` statt `height`, Pfeilkreis rechts mittig; einzeilig gemessene
   Elemente brauchen ≥ 8 px Reserve, sonst darf die Chip-Zeile zweizeilig werden (E-1 bei 664 prüfen) und der Umschalter in der Höhe
   wachsen; Kartenknopf bei 320–360 px Breite mit Innenabstand 16 und Umbruch.
7. **Tabellen ohne Querscrollen**: Zeilentitel über die volle Breite, Werte in drei Spalten; Kopf klebt nur ab 500 px Höhe.
8. **Ziele ≥ 44 px**, Hauptaktionen im Daumenbereich (untere Bildschirmhälfte); Menüblatt öffnet unten.
9. **Kein Querscrollen** bei 320, 360 und 390 px; die Kartenreihe bricht bewusst über beide Ränder (Anschnitt), die Seite selbst scrollt
   nicht quer.

### 16.7.3 Muster je Breite

Die Spalten „Telefon“ und „Schreibtisch“ in 16.4.3 gelten; die Zwischengröße 640–1023 px übernimmt die Telefon-Komposition mit 8 Spalten,
Rand 24 und Inhaltsbreite Breite − 48. Abweichungen je Abschnitt stehen in Teil G jeder Spezifikation (Telefon, 1280, 1024).

---

## 16.8 Abnahmekriterien je Seite

Abnahme heißt: Kriterium am Arbeitszweig erfüllt, mit grüner Prüfsuite, Bildern bei 390 und 1280 (bei Bewegung zusätzlich 1024) und einem
Telefon-Video bei 390 × 844 (SKILL, Abschnitte 5 und 8; IM 15.12). Wirkungskriterien mit Menschen stehen in 16.11 und RP 14.5.3; sie sind
keine Bauabnahme.

### 16.8.0 Für jede Seite

| Nr. | Kriterium | Prüfung |
|---|---|---|
| G-1 | Prüfsuite grün für die betroffenen Abschnitte; volle Suite am Ende jedes Bauschritts und vor dem Livegang | PR, P29, `30*.mjs`, `27.mjs` |
| G-2 | keine fremde Anfrage, keine Antwort ab 400, kein Konsolenfehler; CSP unverändert | PR:76-85; IM 15.9 |
| G-3 | Schriftgrößen nur 13/15/17/24/32 (Telefon) bzw. 13/15/17/24/40 (Schreibtisch), auch in verborgenen Elementen | PR:1606-1616; N1 |
| G-4 | eine Cream-Fläche je Bildschirm und ein grünes Wort je h1/h2, Bildschirm für Bildschirm bei 390 × 844 und 1280 × 800 | N2 |
| G-5 | Farbanteile ≥ 80 % unbunt, ≤ 5 % kräftig, > 0,3 % farbig | `farbanteil.py` |
| G-6 | kein Querscrollen bei 320, 360, 390 px; 200 % Text ohne Verlust; Ziele ≥ 44 px | Labor; WCAG 1.4.4, 1.4.10, 2.5.8 |
| G-7 | Kontrast Text ≥ 4,5 : 1 (groß ≥ 3 : 1) gegen die ungünstigste Stelle des Untergrunds; Konturen, Zustände, Fokus ≥ 3 : 1; Feldumrisse ≥ 3 : 1 (14-23) | Messung je Zuschnitt |
| G-8 | Fokus sichtbar (K-34) und nie unter dem klebenden Kopf; Tastaturreihenfolge = DOM = Lesefolge; Zustand nie nur über Farbe | WCAG 2.4.7, 2.4.11, 1.4.1 |
| G-9 | „weniger Bewegung“: keine laufende Animation, Endzustände stehen | N3 (`document.getAnimations()`) |
| G-10 | ohne JavaScript lesbar und bedienbar | N4 |
| G-11 | Bedienschicht ohne Auftritt; ein bewegter Träger je Ansicht; autonome Bewegung ≤ 5 s | Telefon-Video |
| G-12 | Prüfliste DS 11.10.1 Nr. 1–20 ohne Verstoß; Prüfpunkte der Designrichtung (DR 6) | Sichtprüfung |
| G-13 | kein Platzhalter auf `main`; jedes erfundene Material mit „Beispiel“ (K-36); keine Stimmen, Zähler, Siegel | Sichtprüfung |
| G-14 | Codesperre: kein `perspective`, `rotateX/Y`, `skew` an Bedienelementen, kein `transition: all`, kein animiertes `width`/`height`/`top`/`left`, `box-shadow` nur `none` oder Tokens, `backdrop-filter` nur in den Glas-Blöcken | N9 |
| G-15 | Stand der Seite in Text, JSON-LD und `SEITEN` gleich; Titel, Beschreibung, Canonical nach SEO-Regeln | PR:1735-1737; PA 1.10 |
| G-16 | Urteil des Inhabers am eigenen Telefon: jede Szene „passt“ | V-9 |

### 16.8.1 Rahmen (`rh-01`, `rh-02`, `rh-03`, Schritt S2)

- PR 1, 2, 5, 10, 17, P29 29.3 und `30.mjs` grün mit den Anpassungen aus IM 15.6.1.
- Kopf 56 px am Telefon und 64 px am Schreibtisch auf allen öffentlichen Seiten; kein `backdrop-filter` im Kopf; Kopf springt nie.
- Kopf auf Bühnen flächenlos über Scrim; Logo ≥ 4,5 : 1, Menüzeichen ≥ 3 : 1 über dem hellsten Fotorand (sonst Scrim bis 75 %); opak nach
  K-27 mit Hysterese 24 px.
- Kopf-Ring: erscheint erst, wenn die Startbild-Cream unter dem Kopf ist; ausgeblendet über der Reihe und vor 05 mit `visibility: hidden`
  und `inert` (nicht fokussierbar); nach Freigabe 14-AB-2 kein Aufblitzen zwischen nahen Sperrzonen; Name gleich sichtbarem Text.
- Menü öffnet und schließt mit Knopf, Escape, Wischen und Rand, hält den Fokus im Blatt und gibt ihn an den Menü-Knopf zurück; ohne
  JavaScript springt „Menü“ zu `#navigation`; IDs mit Vorsatz `m-`, auf `/` keine doppelte ID.
- RB ändert bei einem zweiten Lauf nichts (N10); Fußreihenfolge auf allen Seiten gleich; „Vertrag widerrufen“ in jedem Fuß.
- Auf `/fuer-fensterbauer/` in Menü und Fuß kein Link auf `/#fensterbauer` oder `/#tour`, kein „Kostenlos starten“.

### 16.8.2 Seite für Fensterbauer (Schritte S3 bis S6)

**Prüfsuite und Inhalt**
- P29 29.1 bis 29.4, `30.mjs`, PR 2, 6 und 10 grün in Zustand A, in Zustand B (`PAKETE_OFFEN`) und mit `PAKETE_DEMOS` (IM R16).
- Feste Zeichenfolgen aus Anhang A.1 vorhanden; acht Fragen wortgleich im JSON-LD `FAQPage`; Namensleiste nennt drei Preise, jede Karte
  hat dieselben vier `dt` (N12); Gruppenköpfe und „In allen Paketen“ im Vergleich (N12).
- Preise aus `pakete.js`, Ablauf aus `instanzregeln.js`, Inhaltskatalog aus `aufmass-inhalt.js` (eine Quelle je Wahrheit).

**Erster Bildschirm (V1)**
- Bei 390 × 664 Preiszeile und Cream ganz im Bild, statisch und eingebettet (Cream-Unterkante ≤ 593 px; N6); nach Freigabe 14-AB-1 auch
  bei 375 × 553.
- Frei ≥ 33 %; Fokusträger ≥ 19 % mit den Bedingungen von 14-5; ≤ 40 Wörter; höchstens zwei Glasflächen gleichzeitig (eingebettet
  Umschalter und vorderste Meldung).
- Meldungsstapel bzw. Hinweis bei `?von=pdf` verdecken weder Gesicht noch Handy noch Papierflieger; `?von=pdf` zeigt den Hinweis statt
  des Stapels, im selben Task vor `vkStarten()` (kein Aufblitzen).
- Ladeauftritt endet nach 4,1 s; erste Eingabe führt in ≤ 220 ms in den Endzustand; keine Foto-Tiefe (14-16); LCP-Element ist das Foto
  (`img`, nie `canvas`).

**Leiste (V2)**
- Zehn senkrechte Daumenwische über das Band ohne ungewolltes Wischen (14-13); sofort geladen werden nur die sichtbaren Kacheln
  (Mitte ± 2, 14-20); Rückfall flache Leiste greift bei Median-Bildzeit > 25 ms; Tasten ← → bedienen die Leiste.

**Produktkapitel (01–03)**
- Haarlinie von 04 bei 844 px in Bildschirm 5, bei 664 px in Bildschirm 6 (gemessen); zusätzlich gemessen und berichtet: Lage der
  Namensleiste und von „Frage senden“ (RP-31).
- Beim Tippen ins Namensfeld keine Netzwerkanfrage; der Name erscheint im Gerät nach „Fertig“; die Ausnahme der Eingabeprüfung greift nur
  für `div.vk-name` mit `input#vk-name-feld` ohne `name`.
- Probe mit zwei Griffen, INP ≤ 200 ms im Labor; Explosion ohne JavaScript als Endbild; Fingerabdruck der Schichten passt (N8).

**Entscheidungsstrecke (04–A4)**
- Nach dem Sprung auf `#pakete` bei 390 × 664 Preisblock und Knopf der empfohlenen Karte bis y ≤ 651 (N6).
- Kartenknopf wählt das Paket im Formular vor, zeigt die Auswahlzeile, setzt den Fokus auf `#frage`; ohne JavaScript landet er auf dem
  h2 von 05 (15-4).
- Vorbefüllung der Firma nur aus `vk:name`, gekennzeichnet und mit „entfernen“; Pflicht nur nach `fb-09`; Fehler am Feld mit Satz und
  Fokus auf dem ersten fehlerhaften Feld.
- Dank ersetzt das Formular, `role="status"`, Fokus auf dem Dank; steht nach dem Neuaufbau auf `/` wieder (N5); kein Server-Text bei
  503, feste Sätze ab Status 500 (N12).
- Eine Cream je Bildschirm in 04 bis A4; Kopf-Ring über der Reihe ausgeblendet; Ablauf-Marken als Zustand; Haken in 06.2 ≤ 1,3 s.
- Merkmalstabelle und Vergleich ohne Querscrollen bei 320 und 390 px.

**Einbettung, ohne JavaScript, Material, Leistung**
- N5: `render()` zweimal, danach ändert ein Tipp den Zustand genau einmal; Name, Probe, Wahl und Dank kommen nach dem Neuaufbau wieder;
  keine doppelte `id` auf `/`.
- N4: Preise sichtbar, Formular sendet, Standbilder der Probe, Feld `hidden`, alle Ablauf-Marken erreicht.
- S6: Budgets je Asset (16.5.2), Fingerabdrücke, Text auf Glas und Foto ≥ 4,5 : 1 gegen die ungünstigste Stelle (auch bei 300 px
  Fotohöhe), kein Platzhalter auf `main`.
- Labor (390 × 844, CPU-Drosselung ×4, gedrosseltes Mobilnetz): LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, Übertragung bis LCP ≤ 350 KB,
  Bilder im ersten Bildschirm ≤ 300 KB, Skripte im ersten Bildschirm ≤ 100 KB gepackt (Ziel 35–40 KB), Bildfolge ≤ 60 Bilder und
  ≤ 3 MB.
- Cookies-Seite nennt `aufmass.vk.*` (N11).

### 16.8.3 Startseite und Ansicht Hauseigentümer (Schritte S2, S4, S7)

- Labor: LCP ≤ 2,5 s bei 390 × 844 mit Drosselung; vor dem Startbild laufen nur `config.js` und GJ synchron (Stufe A); das Startbild ist
  statisches HTML am Anfang von `#app` (nach Freigabe 15-AB-1); Stufe B vor jeder Werbung, die auf `/` zeigt (RP-55).
- PR 2, 6, 9, 10, 14 grün mit Anpassungen; N1 für beide Ansichten; Eyebrow und h1 wörtlich (Anhang A.1); `.hero.b2c` mit den Zielen
  `/app/#ausmessen` und `/app/#fuehrung`.
- Bei 390 × 664 Preiszeile und Cream von H1 im Bild (Cream-Unterkante ≤ 602 px; N6).
- Umschalter 284 ± 4 px breit, Oberkante ≥ Kopfunterkante + 12, Kopf ≤ 67 px, Foto ab y 0 (neue Erwartung an PR:211-213); Glas mit
  Ersatzfüllung ohne `backdrop-filter`, deckend bei „weniger Transparenz“; verdeckt weder Figur noch Öffnung.
- Ansichtswechsel: Zustand des Segments vor dem Neuaufbau gemalt (14-21), INP ≤ 200 ms mit CPU-Drosselung, Fokus und Statusmeldung
  danach; Wechsel ohne Verlaufseintrag; Wahl gespeichert.
- Textfassung in derselben Folge H1–H7; Einführungspreis vor und nach dem Stichtag 17.11.2026 richtig (PR:1700-1726); Werte der
  Probemessung gleich im SVG; Abstand der Cream von H1 zu H2 ≥ 844 px (sonst Ring); Anker `/datenschutz/#fotos-ki` vorhanden;
  `RATGEBER_WEG` gleich `WEG`; genau ein Link auf `/ratgeber/fenster-ausmessen/`; H6 ohne `id="haeufige-fragen"`.
- Wechselkarte in beiden Richtungen mit Fokus auf dem h1 der Zielansicht; Vorabladen der Einbettung nur einmal und nicht bei `saveData`.
- Höchststufe 3; kein CSS-Licht; Cream nur in H1, H2 (Bedingung), H7 und im Kopf nur, wenn im Inhalt keine sichtbar ist.

### 16.8.4 Fachartikel und Ratgeber (Schritt S8)

- RB bei zweitem Lauf ohne Änderung; PR 5, 10, 17 grün; `<figure class="rg-bild"><img ` unverändert (PR:1781).
- Zwei Handlungsbausteine je Artikel (N12); im Kopf keine Cream, wenn im Inhalt eine steht; „Fensterbau-Software“ führt auf `#pakete`.
- Brotkrumen oben mit 44-px-Zielen; Fragen nach dem Muster `fb-13`; kein Platzhalter als Hauptbild; keine Bewegung außer Zuständen;
  Fuß lang aus einer Quelle.

### 16.8.5 Paketbedingungen (Schritte S2, S8)

- Merkmalstabelle bei 320 und 390 px ohne Querscrollen; Spaltenköpfe kleben ab 500 px sichtbarer Höhe (14-14); Präfix „EEZI “ für
  Vorleser, `th scope="row"`.
- `wertText()` unverändert (Vertragstext); `node scripts/bedingungen-pdf.mjs --pruefen` grün; P29:135, :141 auf Text ohne Tags umgestellt.
- Kopf-Ring „Pakete ansehen“ → `/fuer-fensterbauer/#pakete`; Anker `#merkmale`, `#kundenschutz`, `#laufzeit`; Entwurfshinweis sichtbar,
  solange er zutrifft.

### 16.8.6 Rechtsseiten (Schritte S2, S5, S8)

- Genau ein `main`; `meta name="stand"`; Skala 32/40 · 24 · 17 · 15 · 13; kein `backdrop-filter`; Lesespalte ≤ 820 px; Tabellen ohne
  Querscrollen; Anker bleiben (`/datenschutz/#pakete`).
- `/widerruf/`: Formular `method="post" action="/api/widerruf"` ohne JavaScript nutzbar; `erfolgHtml()` angeglichen; bei Erfolg blendet
  `widerruf.js` auch `[data-wr-vorher]` aus.
- Cookies-Seite nennt die neuen Speichereinträge (Rechtstext nach OE-29); `RC` behält seinen Dateinamen.

### 16.8.7 Kundenkonto (Schritt S8)

- `27.mjs` grün: abgemeldet `.p-weiche` mit drei Einträgen, zwei Links, Ziel je Zustand; `noscript`-Liste in Zustand A.
- Fokus auf das fehlerhafte Feld; Code darf eingefügt werden, `autocomplete="one-time-code"` (RP-64); noindex, kein Zwischenspeicher.

### 16.8.8 Fehlerseite (Schritt S8)

- Drei Ring-Knöpfe „Zur Startseite“, „Zur App“, „Für Fensterbauer“, keine Cream; kein Platzhalterbild; Fuß kurz; noindex; lädt GC und
  `rahmen.css`; Fassung B nur mit Figur A5 und `fehler.js` als Datei (kein Inline-Skript).

### 16.8.9 App-Startbild (Schritt S8)

- App verlinkt `/fuer-fensterbauer/` (neue Erwartung an PR:1595); kein `.einf-bar` auf `/app/` (N12); bei 390 × 664 Cream-Unterkante
  ≤ 600 px (N6); Bilder im ersten Bildschirm ≤ 180 KB; App-Prüfabschnitte 3 bis 22 grün; `app.js` und `buehne.js` bis auf die
  Schnittstelle unverändert.

### 16.8.10 Gesamtabnahme und Livegang (Schritt S9, Gate G3)

- Volle Prüfsuite einmal grün; Telefon-Videos aller Seitentypen bei 390 × 844; Bilder bei 390, 1024, 1280; `farbanteil.py`; Test des
  Inhabers am eigenen Telefon; Liste „gebaut, selbst entschieden, brauche ich von dir“ (SKILL, Abschnitt 5).
- **Kein Livegang**, solange RP-20 (Steuerzeile, OE-15) und RP-29 (Frage-Route ohne Datenbank, OE-21) offen sind; Widersprüche zu den
  Paketbedingungen (OE-16, OE-17) entschieden; Versionierung der Assets geklärt (OE-10); Messplan läuft (14-11).
- Online (`main`) nur auf ausdrücklichen Wunsch des Inhabers; danach Cloudflare-Build und Kopfzeilen der Produktion prüfen.

---

## 16.9 Abweichungen von bestehenden Regeln – Freigabe durch den Inhaber nötig

Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Name, Wortmarke und Logo bleiben unverändert
(GEST:7). Bis zur Freigabe wird der Bestandswert gebaut und die neue Fassung hinter einem Schalter gehalten (15-2). „gleich mit“ nennt
Nummern, die dieselbe Abweichung in einem anderen Kapitel führen; sie werden mit der Hauptzeile entschieden. „Status“: **offen** =
Freigabe ausstehend; **gegenstandslos** = durch eine spätere Festlegung ohne Gegenstand; **nur Rückfall** bzw. **nur Variante** = in der
Grundfassung nicht gebraucht. Die vier Tabellen führen 93 Zeilen: 86 offen, sieben gegenstandslos, nur Rückfall oder nur Variante; alle
übrigen Nummern aus den Kapiteln stehen als „gleich mit“ bei ihrer Hauptzeile. Abweichungen aus den Konzepten, die E nicht übernimmt
(etwa KA-AB-7), sind nicht aufgeführt.

### 16.9.1 Website-weite Systemregeln

| Nr. | bestehende Regel | Vorschlag | Rückfall | gleich mit | Status |
|---|---|---|---|---|---|
| DS-AB-1 | Kicker in Versalien, .18 em, 800 (GEST:26; GC:44) | jede Versalzeile 600, +0,12 em (K-17) | 800 / 0,18 em | fb-01 I-AB-2, RE-AB-1, NF-AB-3 | offen |
| DS-AB-2 | „13 Label“, Steuerzeile 13 px (GEST:26, :449, :452) | 13 px nur Technikstimme, Sätze 15 px (K-20) | 13 px wie heute | DG-E-6 | offen |
| DS-AB-3 | Cream hellt beim Überfahren auf Weiß auf, Druck `scale(.98)` (GC:15, :65) | Hover innere Kontur, Druck `--primary-druck` (K-2) | Weiß | – | offen |
| DS-AB-4 | gewählt in Cream (GEST:24; GC:82, :90) | `--surface3` mit 2-px-Kontur `--text` (K-3) | Füllung `--muted` | ST2-AB-1, P-AB-1 | offen |
| DS-AB-5 | Radien 8 · 12 · 18 · 24 (GEST:32) | voll · 24 · 18 · 12 auf allen Breiten (K-22) | – | DG-AB-8, H4-AB-5 | offen |
| DS-AB-6 | eine Spalte bis 760 px (GEST:462) | Umbruchpunkte 640 und 1024 (K-11) | 760 als dritte Schwelle | – | offen |
| DS-AB-7 | keine neuen Farben (GEST:24; DR 3.1) | `--primary-druck` `#e2e1db`; Rollen `--papier`, `--mo-papier`, `--tinte-papier` aus vorhandenen Werten | Druck über `--primary-hover` | H5-AB-1, P-AB-2 | offen |
| DS-AB-8 | Erscheinen 8 px aufwärts (GEST:39); Karten und Bänder 24 px, 0,98 → 1 (GEST:448) | Bedienschicht ohne Auftritt, auch ohne Deckkraft-Einblenden (K-6) | Einblenden 220 ms über Deckkraft | DG-AB-2, F10-AB-4, H4-AB-1 | offen |
| DS-AB-9 | „beim Laden geht das Licht einmal an“ (GEST:7) | Logo-Licht nur auf Seiten ohne Bühnen-Ladeauftritt (K-8) | Licht nach dem Foto | – | offen |
| DS-AB-10 | `--muted` nur für Labels und Nebenzeilen (GEST:24); Ghost-Rand `--line2` (GC:58) | Kontur von Ring-Knöpfen und Feldern `--muted` (K-1, K-35) | `--line2` (Felder dann trotzdem ≥ 3 : 1, 14-23: eigenes Linien-Token, das wiederum „keine neuen Farben“ berührt) | NF-AB-2, H4-AB-4, fb-09-AB-1 | offen |
| `he-03` (Chips) | Kontrollhöhe 44 px (GEST:32) | nicht bedienbare Anzeige-Chips 36 px, damit sie nicht wie Knöpfe wirken (K-32; gilt auch für `fb-01`) | 44 px | – | offen |
| DG-AB-1 | Schatten `--float` für Schwebendes (DR 3.1; GEST:24, :32) | 1-px-Lichtkante, Verankerung über Verdeckung; Begleitschatten nur auf Papier | – | EA AB-7, H4-AB-3 | offen |
| DG-AB-3 | Zahlen laufen hoch, Fehler rüttelt, Einrasten aus 1,06 (GEST:39, :41, :450) | Zählen nur in der Bildschicht; Fehler über Rand, Satz, Fokus | – | – | offen |
| DG-AB-5 | Licht atmet, Staub treibt, Meldungen alle 3,4 s, Leisten dauernd 30 px/s (DR 3.5; GEST:447, :451) | autonome Bewegung ≤ 5 s; Leisten nur mit Scrolltempo oder Finger | – | EA AB-8 | offen |
| DG-AB-9 | Foto in einer Fotokarte (GEST:34) | Hauptbild als randlose Bühne; Fotokarte nur im Ratgeber-Fließtext | – | NF-AB-1 | offen |
| DG-AB-10 | Kopf halbtransparent wie die App (GEST:428) | über Bildern flächenlos mit Scrim, über Inhalt opak mit Haarlinie | – | – | offen |
| DG-AB-11 | Kacheln am Schreibtisch vier gleichrangige (DR 3.3) | Ankerkachel über zwei Spalten plus kleinere | – | – | offen |
| DG-AB-12 | Kartenreihen gedreht, versetzt, mit Schatten (DR 3.3) | Drehung nur für reine Bildkarten, Lichtkante statt Schatten | – | – | offen |
| DG-AB-16 | drei Dauern 150 · 220 · 320 ms, „mehr gibt es nicht“ (GEST:38) | zusätzlich Motivdauern 600, 900, 1.200 ms (K-4) | – | – | offen |
| DG-AB-17 | Glas mit Sättigung 140 % (DR 3.1) | Sättigung 100 % | – | – | offen |
| DG-AB-18 | je Seite bricht mindestens einmal etwas aus dem Rahmen (DR 3.3) | höchstens einmal je Seite, nur Verkaufsseite und Ansicht Hauseigentümer | – | PA-AB-2 | offen |
| DG-AB-19 | Fragen als `details`-Karten 48 px (GEST:435) | Zeilen mit Haarlinien, 52 px | – | fb-07 I-AB-2 | offen |
| DG-AB-15 | „Parallaxe … und Lesefortschritt gibt es nicht“ (GEST:41) | Foto-Tiefe in V1 | ohne Foto-Tiefe | – | gegenstandslos (14-16; Lesefortschritt entfällt wie GEST:41) |
| DG-E-14 B (`fb-13`) | nur `transform` und `opacity` animieren (SKILL:56; Codesperre) | Höhe der Fragen 0 → `auto` in 220 ms, nur unter `@supports selector(::details-content)`, zum Vergleich im Telefon-Video | Grundfassung A: Höhe sofort, Antwort blendet ein | – | nur Variante |
| DG-E-1 B (`nf-01`) | Titel am Telefon 32 px (GEST:449; SKILL:69) | h1 40 px auch am Telefon in reinen Textansichten | – | – | nur Rückfall, falls DG-E-1 C (Arbeitsflächen als dokumentierte Ausnahme) nicht freigegeben wird |

### 16.9.2 Seite für Fensterbauer und Paketentscheidung

| Nr. | bestehende Regel | Vorschlag | Rückfall | gleich mit | Status |
|---|---|---|---|---|---|
| E-AB-1 | Startfoto am Telefon 540–640 px (GEST:447) | 420 px, eigener Telefonzuschnitt | 480 px, Preiszeile über den Chips | ersetzt IA-AB-12 | offen |
| 14-AB-1 | wie E-AB-1 | Fotohöhe min(420 px, 100svh − a − 8 px), mindestens 300 px | 420 px fest | – | offen |
| E-AB-2 | Anfrageformular als einzige Eingabe (GEST:455; PR:1789-1797) | Namensfeld in 01 ohne `form` und Versand; Ausnahme genau für dieses Feld | ohne Feld | – | offen |
| E-AB-3 | Ring „Konfigurator ausprobieren“ → `#demos` (GEST:447; VK:63) | Ring „Selbst ausprobieren“ (**Textentwurf**) → `#die-idee` | Ring „Kundensicht ansehen“ → 02 | KA-AB-3, D-AB-4, B-AB-4 | offen |
| E-AB-4 | Meldungen „Neue Anfrage → Projekt angelegt → Bereit fürs Angebot“ (GEST:447) | Meldungen nach dem Paketweg, enden nach der dritten | – | – | offen |
| E-AB-5 | „Kurz gesagt“ als Lead, vier bis fünf Chips (GEST:447; VK:58-61) | ohne Kasten, drei Chips | „Kurz gesagt“ als eine Zeile 15 px statt der Chips | IA-AB-2 (Teil) | offen |
| E-AB-6 | zwei Leisten unter dem Startbild, die zweite mit Kennzahlen (GEST:451) | nur die Leiste Elementarten | Leiste 2 als Stufe 2 direkt darunter | ersetzt IA-AB-7; macht DG-AB-7 gegenstandslos | offen |
| KA-AB-4 | Leiste mit Zeichnungen 24 px (GEST:451) | Renderings der Elementarten aus der eigenen Bühne | Zeichnungen 24 px (nur Stufe 2) | – | offen |
| DG-AB-6 | gewölbte Leiste mit `rotateY` je Abstand (DR 3.6; GEST:450) | nur die Bilder wölben sich, Namen frontal über Deckkraft | – | – | offen |
| E-AB-7 | Folge Pakete → Ablauf → Demos → Bestellen (GEST:447) | Pakete → Formular → Ablauf mit Kundenschutz → Demos | Formular nach 06 | EA AB-3 | offen |
| E-AB-8 | „Die Idee“ als vier Karten (GEST:447, :450) | Gerät mit Startansicht und drei Punkten; VK:80 als Lead in 03 | vier Kacheln unter dem Gerät | – | offen |
| E-AB-9 | grüner Schein an der empfohlenen Karte (GEST:452) | entfällt | – | DG-AB-14, EA AB-5, J-AB-4 | offen |
| E-AB-10 | Nummern 01 bis 11 an jeder Haarlinie (GEST:450) | 01 bis 06 mit Kapitelwort, Anhänge ohne Nummer | Nummern ohne Kapitelwort | – | offen |
| DG-AB-13 | feste Telefon-Bühne bis zwei BH (DR 3.5) | am Telefon kein Anheften; Schreibtisch ≤ 1,2 BH je Szene | – | EA AB-10 | offen |
| IA-AB-2 | „Warum Kunden selbst planen“, Wissen und Quellen als Abschnitte im Fluss (GEST:447) | zugeklappt im Hintergrund (A3) | – | – | offen |
| IA-AB-8 | Bildplätze `fb-kundenschutz`, `fb-frage`, `gross`; Demos als Karten; Wissen als fünf Karten (GEST:447) | entfallen; Demos als Zeilen; Wissen als Linkzeile | – | – | offen |
| fb-01 I-AB-1 | Zeile „Während Sie unterwegs sind · Beispiel“, Zeitangaben in den Meldungen (GEST:447) | nur „BEISPIEL“, ohne Zeiten | – | – | offen |
| J-AB-1 | Paketname 24 (GEST:449) | 17/700 (K-21) | Name 24 als dokumentierte Ausnahme | DG-E-2 A | offen |
| J-AB-2 | Nachbarkarten bis 5 % kleiner, blasser (GEST:452) | nur Deckkraft | – | – | offen |
| J-AB-3 | Karten laufen einmal ein und federn zurück (GEST:452) | entfällt; Anschnitt zeigt das Wischen; Feder nur im Bild | – | DG-AB-4, EA AB-9 | offen |
| J-AB-5 | „Vorläufige Preise“ als Kasten über den Karten (GEST:453) | ein Satz unter der Reihe, ohne „bleibt für Ihren Vertrag fest“ bis OE-17 | Kasten, kleiner | EA AB-4 | offen |
| J-AB-6 | Namensleiste unter der Reihe (GEST:452) | über der Reihe, mit Monatspreisen | – | EA AB-11 | offen |
| J-AB-7 | Vergleich ungegliedert mit allen Merkmalen (GEST:454) | gruppiert, gleiche Zeilen zusammengefasst; volle Tabelle in den Paketbedingungen | ungegliedert | EA AB-6 | offen |
| fb-07 I-AB-1 | Tabelle mit `data-k` wie im Ratgeber (GEST:454) | Telefon: klebender Kopf, Werte in drei Spalten | `data-k`-Liste | – | offen |
| J-AB-8 | Cream am Knopf des empfohlenen Pakets (GEST:456) | nach einem Tipp trägt das gewählte Paket die Cream in Reihe und Abschluss | Cream bleibt am empfohlenen Paket | – | offen |
| J-AB-9 | im Kopf ein Ring-Knopf (GEST:456) | Ring aus, solange Namensleiste oder Reihe das Band unter dem Kopf schneidet; danach in Zustand A „Paket anfragen“ | Ring bleibt sichtbar | – | offen |
| 14-AB-2 | wie J-AB-9, dauerhaft sichtbar | zusätzlich aus, solange zwei Sperrzonen weniger als 0,5 BH trennen | Zustände nach K-28 | – | offen |
| J-AB-10 | Vorspann der Pakete mit dem Zeichen `farbwechsel` (GEST:447) | entfällt | Zeichen als Standbild | – | offen |
| `fb-15` (Seitenende) | Abschnittsfolge endet mit Wissen und Quellen (GEST:447) | die Seite endet mit dem Abschluss (kompakte Paketwahl) | – | – | offen |
| F10-AB-1 | Ablauf als Zeitleiste mit Symbolen, Linie füllt sich scrollgebunden (GEST:447, :448) | Maßstab ohne Symbole, Marken wechseln als Zustand | – | – | offen |
| F10-AB-2 | „der Fortschritt wächst grün mit“ (DR Baustein 7) | kein wachsender Strich | – | – | offen |
| F10-AB-3 | grüner Schein am gefüllten Strich (`verkauf.css:610`) | entfällt | – | – | offen |
| EA AB-2 | Kopf der Ansicht Fensterbauer mit „Preise“, „Anmelden“, „Kostenlos starten“ (GEST:193) | Kontext Fensterbauer: Ring „Pakete ansehen“, „Anmelden“ leise | – | – | offen, hängt an OE-28 |
| DG-AB-7 | zweite Leiste in Cream mit dunkler Schrift (GEST:451) | Kennzahlen-Leiste auf dunklem Grund | – | – | gegenstandslos (E-AB-6), nur im Rückfall von E-AB-6 |
| IA-AB-7 | zwei Leisten unter dem Startbild (GEST:451) | Leiste Kennzahlen vor die Pakete | – | – | gegenstandslos (E-AB-6) |
| IA-AB-11 | Paketkarten mit allen Leistungen als Haken (GEST:452) | nur drei bis vier Unterschiede als Haken | – | – | nur Rückfall (J-H1) |
| IA-AB-12 | Startfoto 540–640 px (GEST:447) | 500 px | – | – | gegenstandslos (E-AB-1, 14-AB-1) |

### 16.9.3 Startseite, Ansicht Hauseigentümer, Rahmen

| Nr. | bestehende Regel | Vorschlag | Rückfall | gleich mit | Status |
|---|---|---|---|---|---|
| IA-AB-1 | Fuß mit „So funktioniert es für Betriebe“, „Preise für Betriebe“, Tour (GEST:194; `portal.js:482`) | diese Links entfallen in allen Fußfassungen | – | – | offen, hängt an OE-28 |
| IA-AB-3 | Umschalter am Telefon als volle Zeile des klebenden Kopfs (GEST:190) | Glas-Segment über dem Foto, scrollt weg, im Menü | – | – | offen |
| ST2-AB-2 | Umschalter auch auf Tour, Preisen, Registrierung (GEST:190) | dort am Telefon nur im Menü | – | – | offen |
| IA-AB-5 | Ansicht Hauseigentümer: Hero, Kennzahlen, „Was im Aufmaß steckt“, Ratgeber als Karten, helle Karte (GEST:192) | H1–H7 nach ZA 8.3.4 | – | KA-AB-6 | offen |
| IA-AB-6 | Einführungspreis nur im Band (GEST:14) | Preiszeile im Startbild; Band entfällt auf `/` | entfällt nach dem 17.11.2026 von selbst | – | offen |
| IA-AB-9 | Kopf der Fachartikel mit Cream; Startseiten-Karte „Pakete ansehen“ in Cream (GEST:192) | Ring | – | – | offen |
| IA-AB-10 | Ansicht Hauseigentümer „Kein Anmelden“ (GEST:192) | leise „Gesichertes Aufmaß öffnen“ (**Textentwurf**) in Menü und Fuß | – | – | offen |
| IA-AB-4 | App verlinkt „Sie sind Fensterbauer?“ in deren Ansicht (GEST:194) | → `/fuer-fensterbauer/` | – | – | offen |
| `he-01` I-2 | Kopfknopf nach `kopfCta` sichtbar (GEST:192, :399) | Kopfknopf im ersten Bildschirm ausgeblendet, solange die Cream mit gleichem Ziel sichtbar ist | Ring | – | offen |
| `ap-01` (Band) | Einführungsband ganz oben (`docs/ABRECHNUNG.md:11`; GEST:14 sinngemäß) | in der App entfällt das Band, der Preis steht statisch im Startbild (Ausdehnung von IA-AB-6) | Band | – | offen |
| `ap-01` (h1) | App: 40 px für Zahl und Hero (GEST:27) | h1 des App-Startbilds 32 px bis 1023 px, 40 px ab 1024 | 40 px mit Foto 326 px | – | offen |
| rh-02-AB-1 | Menüblatt steigt auf (GEST:39; GC:178, 320 ms) | erscheint über Deckkraft 220/165 ms ohne Versatz | Einfahren in der Ebene (DG-E-12) | – | offen |
| Z-AB-1 | Hinweis bei `?von=pdf` steht vor dem Startbild (GEST:193) | Hinweis im Startbild an Stelle des Meldungsstapels, ≤ 260 × 168 | eigene Zeile über dem Foto ≤ 96 px, Foto 360 px | – | offen |
| 15-AB-1 | Textfassung von `/` nur ohne JavaScript, ersetzt beim ersten Bild (GEST:439) | Startbild der Ansicht Hauseigentümer als statisches HTML, gilt mit und ohne JavaScript | Startbild aus `portal.js`, übrige Skripte mit `defer`, Foto vorgeladen | – | offen |
| H4-AB-2 | „der Fortschritt wächst grün mit“ (DR 4, Baustein 7) | Marken in H4 neutral, ohne Fortschritt | – | – | offen |
| H5-AB-1 | Flächen `#1f1f1f` mit Ring, Cream einziger Hellwert (GEST:24, :32) | Ankerkachel in H5 in Papierweiß `--papier` ohne Ring | `--surface` mit Ring 2 px `--muted` | DS-AB-7 | offen |
| P-AB-1 | gewählt in Cream (GEST:24) | „erledigt“ = Haken `--accent` vor dem Wort, nie Cream | – | DS-AB-4 | offen |
| P-AB-2 | keine weiteren Farben (GEST:24) | Rollen `--papier`, `--mo-papier`, `--tinte-papier`; kein Blau auf Papier | Zeichnung als externes SVG ohne Bedienung | DS-AB-7 | offen |

### 16.9.4 Unterseiten

| Nr. | bestehende Regel | Vorschlag | Rückfall | gleich mit | Status |
|---|---|---|---|---|---|
| AR1-AB-1 | Karte „Kurz gesagt“ direkt unter dem Titel (GEST:430) | am Telefon Zeichnung zwischen h1 und „Kurz gesagt“ | – | – | offen |
| AR1-AB-2 | „Kurz gesagt“ als Karte (GEST:430; RGC:43) | Lesestapel auf dem Grund mit Label, ohne Fläche und Ring | Karte wie heute | – | offen |
| AR1-AB-3 | Zeichnung als Karte mit Ring (GEST:433) | im Kopf ohne Ring, Blattkante ist Objektkante | Ring 2 px `--line` | – | offen |
| AR1-AB-4 | Spalte höchstens 820 px (GEST:429) | Kopf im 1040er-Raster: Text 508 px, Blatt 419 px rechts; Lesetext bleibt schmaler als 820 | 820er-Spalte, je 6 von 12 Spalten | – | offen |
| ar-03 | Kachel „Du bist hier“ mit Cream-Fläche (RGC:115) | ohne Cream-Fläche | – | – | offen |
| PB-AB-1 | Tabellen als Karte mit Ring, am Telefon Karten mit `data-k` (GEST:432) | keine Karte, am Telefon drei Spalten unter klebendem Kopf | heutige Kartenform | – | offen |
| PB-AB-2 | Spaltenköpfe in Versalien (GEST:419, :432) | Paketnamen in ihrer Schreibweise, Sperrung .02 em | Versalien, zweizeiliger Kopf | – | offen |
| RE-AB-2 | Überschriften mit Punkt und einem grünen Wort (GEST:26) | Rechtsseiten ohne grünes Wort und ohne Schlusspunkt | grünes Wort nur im h1, wo eines trägt | – | offen |
| RE-AB-3 | Grün nur als Kicker, Haken, ein Wort (SKILL:68) | grüne Haarlinie am Sprungziel (`:target`) | Haarlinie in `--text` | – | offen |
| R3-AB-1 | Fußfolge „Ratgeber-Links, dann AGB, Nutzungsbedingungen, Datenschutz, Cookies, Impressum“ (GEST:438) | Impressum als erster Rechtslink unter Marke und E-Mail; auf Fachartikeln „Für Fensterbauer“ vor den Ratgeber-Links | Folge aus GEST:438 | – | offen |
| PA-AB-1 | ein Held je Bildschirm (DR:14, :57, :204) | Kundenkonto ohne Held, die Karte ist Anker | – | – | offen |
| PA-AB-2 | je Seite ein Rahmenbruch (DR:112) | nicht auf dieser Seite | – | DG-AB-18 | offen |
| NF-AB-1 | Foto in einer Fotokarte (GEST:34) | Figur freigestellt, ohne Karte | – | DG-AB-9 | offen |

**Keine Abweichung, aber Änderung der heutigen Umsetzung:** h1/h2 32 px bis 1023 px statt ab 761 px 40 px (DS 11.2.1); Cream-Hover statt
`--primary-hover` (in DS-AB-3); Lesefortschritt entfällt (deckt sich mit GEST:41); Startseite öffnet weiter mit der Ansicht
Hauseigentümer (EA AB-1, keine Abweichung). **Freigabe der Prüfsuite-Änderungen:** IM 15.6.1 nennt 23 Prüfstellen, an 18 ändert sich die
Erwartung, die Spalte „Freigabe“ sagt, wo eine Aussage entfällt; entschieden als Block (OE-5).

---

## 16.10 Offene Entscheidungen des Inhabers

Zusammengeführt aus PA 1.11, EA 4.7.3, IA 5.7.3, ZA 8.4.7, PE 10.5.1, DG 2.6.1, RP 14.4 und 14.6, IM 15.14. Dieselbe Frage steht in
mehreren Kapiteln; die Spalte „Quellen“ nennt alle Nummern. Die Nummern OE-n gelten nur in diesem Dokument.

### 16.10.1 Blockierend, in der Reihenfolge, in der der Bau sie braucht

| Nr. | Entscheidung | bis | löst, betrifft | Quellen |
|---|---|---|---|---|
| OE-1 | **Grundsatzfreigabe:** Soll die Seite für Fensterbauer das Produkt selbst vorführen (Architektur E)? | S0 (G0) | alles in 01–03; RP-48 | ZA 8.4.7 Nr. 1; EV 7.5.11 Nr. 1; SKILL:27 |
| OE-2 | Freigabeliste: jede Abweichung aus 16.9 mit Ja, Nein oder Rückfall | S0 | Schalter 16.3.9 | ZA 8.4.5; PE 10.4 H (J-O-12); DS 11.B; 14-O-7; 15-AB-1 |
| OE-3 | **Materialprobe:** Bildfolge oder Standbilder („E mit Standbildern“), sonst B′ | S0 (G0) | `fb-02`, `fb-04`; T-1, V-10 | ZA 8.4.7 Nr. 10; IM 15.11.2; EV 7.5.11 Nr. 3 |
| OE-4 | Auslegungen der Dosierung: Kegel als Ende des Lichtübertrags (DG-E-4 A), Bildfolge auf Tippen als Antwort, Cream und Grün im Gerätebild als Produktinhalt, Kapitelnummern außerhalb des Budgets; Rückfälle: Kegel entfällt, Überblendung zweier Standbilder, Gerätebild ohne Cream im Ausschnitt, Nummern ohne Grün | S0 | RP-44 | ZA 8.3.2 e; DG-H-1 |
| OE-5 | Textregister und Prüfsuite-Änderungen als Block freigeben, einschließlich der wörtlich geprüften Zeichenfolgen | S0 | RP-46, RP-49 | 14-17; 15-O-8; IA-O-9; ZA 8.4.7 Nr. 9 |
| OE-6 | Materialanfragen A1–A6 auslösen; „Fensterbau Brandt“ als einzige Beispielfirma, Monogramm statt Logo, Look „Vitrine“, Liste der 14 Elementarten, Führungsbildschirme | S0 | 16.5 | J-O-8; PA-Fragen 24, 25, 29; EA O-12; IA-O-13 |
| OE-7 | Lage des Formulars: direkt nach den Paketen (E) oder nach dem Ablauf | S3 | E-AB-7; H-E6 | ZA 8.4.7 Nr. 2; EV 7.5.11 Nr. 2 |
| OE-8 | Empfohlenes Paket und Grund; tragen die „Wenn“-Sätze als Grund? | S3 | Karten, Abschluss | J-O-1; EA O-5; ZA 8.4.7 Nr. 5 |
| OE-9 | Ziel und Wortlaut des Rings im Startbild | S4 | E-AB-3 | ZA 8.4.7 Nr. 3 |
| OE-10 | Versionierung der Assets: Cache-Regel für `/assets/*` oder Versionskennung durch den Worker | S1 | RP-51; IM R8 | 15-O-1 |
| OE-11 | Testgerät und Browser des Inhabers; kleines Telefon und mittleres Android-Telefon verfügbar? | S2 | R7, R17; V-10 | 15-O-10; 14-O-6 |
| OE-12 | Öffnet `/` weiter mit der Ansicht Hauseigentümer? Bleibt „Hauseigentümer“ vorn im Umschalter? | S2/S7 | RP-16 | EA O-23; PA-Frage 2; IA-O-10 |
| OE-13 | Seite für Fensterbauer dauerhaft an zwei Orten oder nur unter eigener Adresse? | S2 | Einbettung; RP-21 | IA-O-1; ZA 8.4.7 Nr. 13 |
| OE-14 | Fußgruppe „Für Hauseigentümer“ und Ratgeber-Links auf `/fuer-fensterbauer/` (Kunden von Essential-Betrieben landen dort) | S2 | `rh-03` | IA-O-16; EA O-27 |
| OE-15 | **Umsatzsteuer:** 19 % oder Kleinunternehmerregelung; danach die Steuerzeile aus einer Quelle | S3, kritisch vor Livegang | RP-20 | J-O-3; EA O-6; PA-Frage 16 |
| OE-16 | Wortlaut der Kündigung: „zum Ende des Abrechnungsmonats“ (PB:69) oder „zum Monatsende“ (VK:243); Wechsel nach unten | S3 | RP-23 | J-O-6; EA O-7 |
| OE-17 | Preisbindung „für Ihren Vertrag fest“ oder Änderungsvorbehalt (PB:55) | S3 | RP-23; J-AB-5 | J-O-2; EA O-7 |
| OE-18 | Wird die Einrichtung erstattet, wenn der Betrieb die Vorschau nicht freigibt? | S3, vor Livegang | RP-22; Festblock | J-O-5; EA O-16 |
| OE-19 | Sind „in der Regel innerhalb eines Werktags“ und „meist 3 bis 5 Werktage“ gemessen oder Ziele? | S3, vor Livegang | RP-25; 14-8 | EA O-8; PA-Frage 10 |
| OE-20 | Telefonnummer oder Rückruf ohne Konto auf der Seite; darf der Gesprächsweg „Rückruf“ nennen? | S3 | RP-19; Gesprächsweg, Anbieterzeile, Fuß | J-O-10; EA O-9; IA-O-4; PA-Frage 13 |
| OE-21 | Datenbank der Frage-Route vor dem Livegang; HTML-Antwort für das Formular ohne JavaScript | S3, kritisch vor Livegang | RP-29; IM R10 | EA O-3; 15-O-4; PA-Frage 8 |
| OE-22 | Ereignisse (und optional Web Vitals) anonym auf eigenem Server zählen; Satz in Datenschutzerklärung und Cookies-Seite; Zähler `ereignis:paket_frage` | S3 | RP-30, RP-60; Messplan | 14-O-4; 15-O-5; EA O-2; PA-Frage 5 |
| OE-23 | Miniatur im Abschluss als Rasterbild ohne Namen oder als HTML-Miniatur mit Namen | S3 | 15-8 | 15-O-3 |
| OE-24 | Zeile „Im ersten Jahr“ (447 / 667 / 1.047 € netto) im Vergleich? | S3 | J-H4 | J-O-11 |
| OE-25 | Hinweis auf den späteren Wechsel nach oben an den Karten oder nur in den Fragen? | S3 | Karten | J-O-7; EA O-26 |
| OE-26 | Sagt der Festblock in Zustand A, dass die Paketbedingungen ein Entwurf sind? | S3 | `fb-08` | J-O-14 |
| OE-27 | Wann werden `PAKETE_OFFEN` und `PAKETE_DEMOS` gesetzt? | S3 | Zustände; V-5 in R3 | J-O-9; EA O-3; PA-Frage 8 |
| OE-28 | **Altbestand und QR-Weg:** Wird das Aufmaß-Link-Modell neuen Betrieben noch angeboten? Ziel und Ton von `st-03`, Weiche, Kopf, Fuß, Werbeblock im PDF | S4 | RP-17; EA AB-2; IA-AB-1 | EA O-4; IA-O-2; PA-Frage 3; ZA 8.4.7 Nr. 6 |
| OE-29 | Wortlaut der Cookies-Seite für `aufmass.vk.*`; braucht die Datenschutzerklärung einen Satz zur Namensvorschau? | S5 | RP-53; IM R11 | 15-O-7; ZA 8.4.7 Nr. 12 |
| OE-30 | Freigabe 15-AB-1 (statisches Startbild auf `/`); Stufe B der Startseite als eigener Schritt | S7 | RP-55 | 15-O-2; 15-O-6 |
| OE-31 | Anrede der Hauseigentümer: Sie oder du | S7 | H1–H7, Textentwürfe | EA O-13; IA-O-5; PA-Frage 21 |
| OE-32 | Ziel der App-Knöpfe in Ratgebern: `/app/` oder `/app/#ausmessen` | S8 | `ar-02` | IA-O-7 |
| OE-33 | Darf Schritt 1 im Kundenkonto die Wahl bestätigen statt sie erneut abzufragen? | S8 | J-H9 | J-O-13 |
| OE-34 | Fehlerseite Fassung B: Figur und Motiv (Katze im Fensterrahmen oder Astronaut) | S8 | `nf-01` | IM 15.11.1 A5 |
| OE-35 | Darf `designrichtung.md` nach den Freigaben nachgezogen werden, oder trägt GEST die neuen Regeln? | S9 | Doku | 15-O-9 |
| OE-36 | Nettopreise in der Einbettung auf einer Seite, die sich zuerst an Verbraucher richtet (anwaltlich) | vor Zustand B und vor Werbung auf `/#fensterbauer` | RP-21 | J-O-4; EA O-25; ZA 8.4.7 Nr. 12 |
| OE-37 | Wie beantwortet die Seite den Kundenschutz neben dem Aufmaßblatt für Hauseigentümer, das an beliebig viele Betriebe geht? | vor Zustand B | RP-24; `fb-11`, A2 | EA O-15; IA-O-14 |
| OE-38 | Anzeigen und Instagram künftig auf `/fuer-fensterbauer/`? Folgt die Instagram-Linie den Paketen? | vor Werbung | ZA 8.1.5 | IA-O-3; PA-Frage 26 |
| OE-39 | Testpersonen, Aufwandsentschädigung, Aufzeichnung, externe Testwerkzeuge, geschäftlich relevanter Mindestunterschied Δ | R0–R4 | RP 14.5 | 14-O-1, 14-O-2, 14-O-3, 14-O-5 |
| OE-40 | Gilt das Barrierefreiheitsstärkungsgesetz für den Verkauf des Aufmaßblatts? (anwaltlich) | vor Livegang | RP-65 | 14-O-8; PA-Frage 19 |

### 16.10.2 Weitere offene Fragen (nicht blockierend)

| Thema | Frage | Quellen |
|---|---|---|
| Ausrichtung | Rangfolge der Ziele; Plattform-Satz in `docs/ONLINE-STELLEN.md:3`; Zielzahlen | PA-Fragen 1, 4, 5; EA O-1 |
| Inhalt | Bleibt „Warum Kunden selbst planen“ nur zugeklappt; dürfen frei werdende Fotos anderswo stehen? | PA-Frage 6; IA-O-15 |
| Angebot | Sind die Paketpreise endgültig; Pilotbetriebe nennbar; „0 Zeilen Code“; Statusleiste „Bestellt“ für unbezahlte Entwürfe | PA-Fragen 7, 11, 12, 15; EA O-10, O-21 |
| Zielgruppe | Fensterhändler als eigene Gruppe; nur Deutschland? | PA-Frage 14; EA O-22; IA-O-12 |
| Recht | Freigabe der Suchmaschinen; Termin der anwaltlichen Prüfung von Paketbedingungen und AV-Vertrag | PA-Fragen 17, 18; EA O-24 |
| Wortlaut | Maß- und Zeitangaben („vier Maße“, „8 Maße“, „5 Minuten“); Schreibweisen „Powered by EEZIframes“, Kurznamen; „Plus“ doppelt (Tarif und Paket) | PA-Fragen 20, 22, 23; EA O-11 |
| Inhalt | Sortiment-Frage F-14, PDF beim Endkunden F-13, Kontaktweg für Hauseigentümer, Beleg für „das jeder Fensterbauer lesen kann“ | EA O-17, O-18, O-19, O-20 |
| Weitergabe | Kurzfassung der Pakete als PDF für Mitentscheider | J-O-15; IA-O-6; RP-34 |
| SEO | eigene Recherche zu „Fenster-Konfigurator“; Motiv des Vorschaubilds | PA-Frage 28; IA-O-11; IA-O-8 |
| Wettbewerb | Abgrenzung gegenüber kostenlosen Widgets; ist „eigene Domain“ eine Alleinstellung? | EA O-14 |
| Gestaltung | Haptik-Tipp beim Einrasten der Reihe | J-O-16; DG-E-9 |
| Gestaltung | Öffnen der Fragen: Höhe sofort mit Einblenden (A) oder Höhenanimation (B), Video-Vergleich | DG-E-14 |
| Gestaltung | Startbild ab y = 0 unter flächenlosem Kopf nur mit ruhigem, dunklem oberem Bildrand (am Zuschnitt prüfen) | DG-E-11 |
| Gestaltung | Riesenwort später als Variante? (erste Fassung ohne) | DG-E-3 |
| Gestaltung | Lesefortschritt als Ausnahme (Grundfassung ohne) | PA-Frage 27; DG-E-7; ZA 8.4.7 Nr. 8 |
| Wortlaut | Eyebrow der Ansicht Hauseigentümer „In Minuten zum Aufmaß für jeden Fensterbauer“ nur nach Test (V-3, V-1) und mit Anpassung der Prüfsuite ändern | RP-04 |

Entschieden durch DS und hier nicht mehr offen, aber freigabepflichtig: DG-E-1 (C für Arbeitsflächen), DG-E-2 (A, J-AB-1), DG-E-5 (Glas 60 %,
24 px), DG-E-6 (DS-AB-2), DG-E-8 (Haus-Token K-24), DG-E-10 (2-px-Ring der Karten, `--muted` für Knöpfe und Felder), DG-E-12 (nur
Deckkraft), DG-E-13 (keine Echtzeit-3D auf Verkaufsflächen; Foto ohne Tiefenkarte).

---

## 16.11 Hypothesen mit Testplan-Verweis

Jede Hypothese hat einen Rückfall und wird erst nach Prüfung zur Regel. Prüfungen V-n, Methoden, Teilnehmende und Erfolgskriterien:
RP 14.5.3; Runden und Gates: RP 14.5.4; Messung nach dem Livegang: RP 14.5.5. Erfolgskriterien sind vorab festgelegte
Entscheidungsschwellen, berichtet als „x von n“, keine Vorhersagen.

### 16.11.1 Architektur und Seite für Fensterbauer

| Nr. | Hypothese (kurz) | Rückfall | Prüfung | Runde |
|---|---|---|---|---|
| H-E1 | zwei Griffe genügen, die Probe kostet keinen spürbaren Weg zu den Paketen | Probe als zwei Standbilder | V-2, V-8; Bildschirmzählung | R2 |
| H-E2 | das Namensfeld wird geöffnet und hilft der Hauptaussage | ohne Feld (E-AB-2 entfällt) | V-8; Ereignis `name` | R2, R4 |
| H-E3 | Bild in der Karte, „Wenn“-Satz und Datenblatt beantworten „Was bekomme ich mit Plus zusätzlich?“ schneller als eine Hakenliste | zwei bis drei Haken je Karte | V-4 | R2 |
| H-E4 | die Gruppe „Für Ihr Team“ macht Signature bewertbar | Team-Zeile zweizeilig | V-4 | R2 |
| H-E5 = ST-H-6 | Lichtfaden Erdlicht → Kegel → Bildschirmlicht wirkt als Markenfaden | Kegel entfällt, Licht nur in V1 und 02 | V-9 | R1, R2 |
| H-E6 | Formular direkt nach den Paketen schadet Unentschlossenen nicht | Formular nach 06 | V-5, V-11; Ereignis `formular` | R2, R4 |
| H-E7 | 420 px Startfoto tragen die Wirkung auch bei 844 px | 480 px, Preiszeile über die Chips | V-1, V-9 | R1 |
| H-E8 | Kapitelwörter wirken nicht wie ein Inhaltsverzeichnis | nur Nummern | V-7, V-9 | R1 |
| H-E9 | Startansicht im Gerät bleibt nah am Produkt und aktuell | Aufnahmen per Skript ohne Namen | Fingerabdruck gegen `Einladung.html` (N8) | S5 |
| H-E10 | die Probemessung nimmt Hauseigentümern den Zweifel „Schaffe ich das?“ | Zeichnung als Standbild mit Satz | V-12 | R3 |
| 14-1 | „05 · IHRE FRAGE“ trennt Senden und Empfangen | „05 · IHRE ANFRAGE“ | V-7 (Aufgaben 5 und 6) | R1 |
| 14-2 | Erwartung „Preisrechner“ tritt auf | Satz entfällt, wenn nicht | V-2 (Erwartungsfrage) | R2 |
| 14-3 | Aufgabenwörter im Menü finden besser als Kapitelwörter | Kapitelwörter, falls V-7 sie vorn sieht | V-7 | R1 |
| 14-5 | Fokusträger ab 19 % trägt die Bühne | Material A1 mit größerer Figur | V-9 (Blinzeltest), V-1 | R1 |
| I-H-1 (`fb-01`) | drei Meldungen konkurrieren nicht mit dem h1 | zwei Meldungen; erste Meldung erst bei 1,6 s | V-1 („Was haben Sie zuerst angesehen?“) | R0, R1 |
| RP-28-Variante | Preiszeile mit Betrag der Einrichtung | Preiszeile nach `fb-01` | V-1 | R1 |
| ST-H-1 | der Objektfaden wird als eine Geschichte gelesen | Kapitelzeilen allein; „E mit Standbildern“, C′ | V-2, V-8, V-9 | R2 |
| ST-H-2 | Schnitt 01 → 02 liest sich als Fortsetzung | Probe als zwei Standbilder ohne Gerät | V-8 („dasselbe Telefon?“) | R2 |
| ST-H-3 | Leiste ab dem ersten Scrollschritt wirkt lebendiger als eine Foto-Tiefe | DS 11.7.4 wörtlich | V-9 | R1 |
| ST-H-4 = DS-H-1 | lange ruhige Strecke ab den Paketen wirkt verlässlich, nicht leer; Richtwert ≤ 60 Wörter je Bildschirm ohne Held | 01 als Stufe 3, 03 als Stufe 2 | V-9 | R2 |
| ST-H-5 = DS-H-8 | sofortige Sprünge verlieren die Orientierung nicht | glattes Rollen mit pausierten Szenen | V-4 („Wo sind Sie jetzt?“), V-7 | R1, R2 |
| E gegen C′ | Architektur E trägt besser als C′ | Berater als zugeklappte Hilfe über den Karten; bei schwachem V-2/V-8 C′ oder B′ | V-11 Stufe 1 (qualitativ), Stufe 2 (A/B nach Bedingungen 14.5.7) | R2, R4 |

### 16.11.2 Paketentscheidung

| Nr. | Hypothese (kurz) | Rückfall | Prüfung | Runde |
|---|---|---|---|---|
| J-H1 | vier Textbausteine plus Datenblatt genügen | zwei bis drei Haken je Karte | V-4 | R2 |
| J-H2 | „ab Livegang, monatlich kündbar“ am Preis beantwortet die Bindungsfrage | nur im Festblock | V-6 | R2 |
| J-H3 | gruppierter Vergleich wird am Telefon schneller und richtiger gelesen | ungegliedert | V-4; Ereignis `vergleich` | R2 |
| J-H4 | „Im ersten Jahr“ senkt Rückfragen zu Kosten | Zeile entfällt | Messplan vorher/nachher (nur nach OE-24) | R4 |
| J-H5 | Unterschiedszeile mit beiden Differenzen hebt den Anteil höherer Pakete | ohne Zeile | V-11 Stufe 2; Paketfeld, Bestellungen je Paket | R4 |
| J-H6 | Satz unter dem Knopf in Zustand B senkt die Scheu vor „bestellen“ | ohne Satz | V-5 in Zustand B | R3 |
| J-H7 | Demo-Link je Karte hilft | Demos nur in A1 | Ereignis `demo` (ab `PAKETE_DEMOS`) | R4 |
| J-H8 | Cream folgt der Wahl, ohne den Anteil höherer Pakete zu senken | Cream am empfohlenen Paket | V-11; Ereignis `karte` | R2, R4 |
| J-H9 | Bestätigung mit Zahlen in Schritt 1 senkt Abbrüche | Schritt 1 wie heute | V-5 Zustand B (nach OE-33) | R3 |
| J-H10 | Seitenübergang mit gleitendem Beispielbild wirkt als Fortsetzung | nur Überblendung, dann ohne | V-9, V-10 | R3 |
| J-H11 | Bilder von 306 × 230 machen die Markenstufe erkennbar | Konzept P2 als Variante; Datenblatt standardmäßig zu | V-4 | R2 |
| J-H12 | Leitlinien des Datenblatts erklären „Powered by“ schneller | ohne Leitlinien | V-4 | R2 |
| J-H13 = DS-H-10 | Feder im Bild erfüllt „Trägheit und Federn“ für den Inhaber | Gegenlauf ohne Feder | V-9 (Video mit und ohne Feder) | R2 |
| J-H14 | ausgeblendeter Kopf-Ring nimmt Konkurrenz ohne Orientierungsverlust | Ring bleibt | V-3 b, V-9 | R1 |
| J-H15 | „Wenn“-Sätze werden als Grund der Empfehlung verstanden | `kurzText()` plus Empfehlungsgrund | V-4 | R2 |
| J-H16 | Namensleiste wird als Überblick verstanden, nicht als Wahl | Leiste unter der Reihe, Preise im Lead; Zeiger als Unterstrich (14-6) | V-4 | R2 |

### 16.11.3 Designsystem, Grammatik, Startseite, Technik

| Nr. | Hypothese (kurz) | Rückfall | Prüfung | Runde |
|---|---|---|---|---|
| DS-H-2 | „gewählt“ in Tinte wird so sicher erkannt wie Cream | Füllung `--muted` | Fünf-Sekunden-Frage „Welche Option ist gewählt?“ (mit V-1/V-3) | R1 |
| DS-H-3 | innere Kontur als Cream-Hover ist am Schreibtisch wahrnehmbar | `--primary-hover` | V-9 (Bildschirmvideo mit Maus) | R1 |
| DS-H-4 | 96 px zwischen Band und 01 sind Atempause, kein Loch | 48/64 px | V-9 | R1 |
| DS-H-5 | Bühnenknöpfe nach Inhalt halten die Diagonale und bleiben daumengerecht | volle Breite 358 px | V-9 (Daumentest) | R1 |
| DS-H-6 | gemeinsamer Foto-Auftritt wirkt ruhig und zählt sofort als LCP | Startdeckkraft 0,5 | V-9, V-10 (LCP) | R1 |
| DS-H-7 = DG-H-3 | eine Lichtrichtung verbindet Szenen mit dem Zeichen | Richtung je Foto | V-9 | R2 |
| DS-H-9 = ST-H-7 | Ansicht Hauseigentümer wirkt ohne Einblenden nicht starr | Einblenden 320 ms nur in H3 | V-9 | R3 |
| DS-H-11 | zwei Formen von „Beispiel“ werden als ein Signal gelesen | nur Etikett „BEISPIEL“ | V-1, V-4 (Lesetest) | R1, R2 |
| DS-H-12 | 13 px in der Technikstimme bleibt lesbar | 15 px auch für Versalzeilen | V-10 (Lesetest Android) | R1 |
| DG-H-1 | informierende und inszenierende Signaturen getrennt halten die Seite ruhig und hochwertig; Nummern stören nicht | – | V-9 (Video mit und ohne Nummern) | R1 |
| DG-H-2, DG-H-9 | Physik nur im Bild und scrollgekoppelte Leiste wirken lebendig genug | – | V-9 | R1 |
| DG-H-4, DG-H-10, DG-H-11 | Lichtkante statt Schatten, opaker Kopf, vier Radien wirken mindestens so hochwertig | Schatten, halbtransparenter Kopf | V-9 | R1 |
| DG-H-5 | Explosionsansicht macht „was ankommt“ schneller verständlich als eine Liste | Liste | V-2 | R2 |
| DG-H-6 | Bildfolge aus der eigenen Bühne ist in tragbarer Qualität erzeugbar | Standbilder, B′ | Materialprobe (V-10) | R0 |
| DG-H-8, DG-H-12 | Klammer am Seitenende bindet an den Anfang; Cream und Lichtanker konkurrieren nicht | – | V-9 (Blinzeltest: Erde und Cream als die zwei stärksten Flecken bei ≥ 4 von 5) | R1, R2 |
| V-3 | Paketauswahl wird gefunden, auch von `/` aus | Lage und Wortlaut der Cream; Eyebrow, Umschalter, Standardansicht | V-3 | R0, R1, R3 |
| V-6 | Risiko und Vertrauen werden ohne falsche Zusagen eingeschätzt; Vorbehalte wirken nicht unfertig | Entscheidungen OE-16 bis OE-18, OE-37 vorziehen; Vorbehalte bündeln | V-6 | R2 |
| 14-22 | angeglichene Ersatzschrift verhindert Verschieben beim Schrifttausch | – | V-10 (CLS mit gedrosseltem Netz) | R1 |
| Technik | Budgets halten unter realen Bedingungen, Achsensperre wirkt, Ansichtswechsel bleibt unter 200 ms INP | Rückfälle der Spezifikationen; Stufe B | V-10 | R0, R1, R3 |

Spezifikationsbezogene Hypothesen in Teil I.3 jeder Spezifikation (`I-H-n`) prüft V-9, soweit sie nicht oben stehen. Was die Prüfungen
nicht ersetzen: das Gestaltungsurteil des Inhabers (SKILL:78) und Rechtsfragen.

---

## 16.12 Reihenfolge der Umsetzung, Gates, Runden

Einzelheiten je Schritt (Umfang, Dateien, Voraussetzungen, Abnahme): IM 15.12; Abnahme hier in 16.8.

| Schritt | Inhalt | Voraussetzung | Runde, Gate |
|---|---|---|---|
| S0 | Freigaben (OE-1 bis OE-6), Materialanfragen, Materialprobe | – | R0: Baseline V-1, V-3 a/c am Bestand, Materialprobe → **G0** |
| S1 | Fundament ohne sichtbare Änderung: `.web`, Tokens, `rahmen.css` mit Schaltern im Bestandswert, Helfer in GJ, Codesperre, Cookies-Prüfung, Versionierung | OE-10 | – |
| S2 | Rahmen und Umschalter (`rh-01` bis `rh-03`, `st-02`, `pb-01`) | Freigaben EA AB-2, IA-AB-1, -3, -9, -10; Schalter DS-AB-3, -9, -10 | – |
| S3 | Entscheidungs- und Abschlussstrecke `fb-06` bis `fb-15`, Messplan | E-AB-7 (sonst Option), J-AB-1 bis -10, EA AB-4, -6, IA-AB-2, -8, DG-AB-19; OE-15 bis OE-27 | – |
| S4 | Startbild und Leiste (`fb-01`, `fb-02`, `st-03`) | **G0**; A1 oder Platzhalter nur in Vorschau; E-AB-1, -3 bis -6, DG-AB-5, -6, -17, Z-AB-1; OE-28 | R1 → **G1** |
| S5 | Produktkapitel `fb-03` bis `fb-05` | **G0**; E-AB-2, E-AB-8, EA AB-10, DG-AB-13; OE-29 | – |
| S6 | Material einsetzen (parallel, sobald es da ist) | Assets 16.5 | R2 → **G2** |
| S7 | Startseite (`st-01`, `st-04`, `st-05`, `he-01` bis `he-07`) | 15-AB-1, IA-AB-5, -6, H5-AB-1, P-AB-1, -2, ST2-AB-1; A2; Ansicht Hauseigentümer eigens bewertet (ZA 8.4.7 Nr. 7) | – |
| S8 | Unterseiten (`ar-01`, `ar-02`, `pb-02`, `pb-03`, `re-01`, `nf-01`, `pa-01`, `ap-01`) | IA-AB-4, -9, RE-AB-n, NF-AB-n, PB-AB-n; OE-32 bis OE-34 | R3 → **G3** |
| S9 | Doku und Gesamtabnahme; Livegang nur auf Wunsch | OE-35 | R4 nach dem Livegang: Messplan acht Wochen |

Jeder Schritt endet auf dem Arbeitszweig mit grüner Prüfsuite. Die Gates: **G0** Grundsatzfreigabe und Materialprobe entschieden;
**G1** Startbild (Meldungen, Chips, Preiszeile, Fotohöhe) und Benennung freigegeben; **G2** Grundfassung und Rückfälle der Seite für
Fensterbauer entschieden (Feld, Standbilder, Formularlage, Berater, Datenblatt), bei schwachem V-2/V-8 C′ oder B′; **G3** Livegang auf
ausdrücklichen Wunsch des Inhabers (RP 14.5.4).

**Risiken** mit Gegenmaßnahme und Rückfall: IM 15.13 (R1–R19). Die mit der höchsten Bedeutung: Wirkung von Änderungen an GC/GJ auf App
und Betriebsbereich (R1), Bindung der Prüfsuite an Wortlaute (R2), Zustand in der Einbettung (R3), Assets ohne Versionskennung (R8),
Frage-Route ohne Datenbank (R10).

---

## 16.13 Was nachzuziehen bleibt

1. **Abgleich der älteren Kapitel:** ZA, PE und ST auf die Werte der Spezifikationen ziehen (14-17); die Festlegungen 14-n in DS und in die
   Spezifikationen eintragen, die sie unter „nachzuziehen in“ nennen; die Foto-Tiefe aus IM 15.3.2, 15.4.3 und 15.12 S4 streichen. Für den
   Bau ist das nicht nötig, weil 16.1.7 die maßgeblichen Stellen nennt.
2. **Textregister:** Festlegung 14-17 verlangt ein Register aller Textentwürfe (ID, Ort, Wortlaut, Beleg, Bindung an die Prüfsuite,
   Zustand A/B, Freigabe) als einzige Freigabevorlage für S0. Anhang A enthält die wörtlich geprüften Zeichenfolgen und die
   Handlungstexte; die übrigen Wortlaute stehen je Abschnitt in Teil B der Spezifikationen. Das vollständige Register steht noch aus.
3. **Nach den Freigaben:** `docs/GESTALTUNG.md` und `docs/BILDER.md` nur für freigegebene Punkte nachziehen; `designrichtung.md` nur nach
   OE-35 (IM 15.12 S9).
4. **Validierung:** Ergebnisse jeder Runde in einem eigenen Dokument im Blueprint-Ordner; die Spezifikationen übernehmen nur entschiedene
   Änderungen (RP 14.5.8).
5. **Übersicht:** [README.md](README.md) liegt jetzt vor; die Verweise „← Übersicht“ in ST und WF führen damit nicht mehr ins Leere
   (RP-47 erledigt).

---

## Anhang A. Feste Zeichenfolgen und Handlungstexte

### A.1 Zeichenfolgen, die die Prüfsuite wörtlich prüft (bleiben, Änderung nur mit Freigabe der Suite)

| Ort | Zeichenfolge, Markup | Beleg |
|---|---|---|
| h1 Seite für Fensterbauer | „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“, grün „Marke“ (`<span class="ak">`), ohne `<br>` oder `<wbr>` | P29:110; `fb-01` B.1 |
| Pflicht-h2 | `<h2 id="die-idee">`, `so-funktioniert-es`, `pakete`, `ablauf`, `demos`, `bestellen`, `haeufige-fragen`, jeweils ohne weitere Attribute | P29:110-114 |
| 01 | „ohne ihn programmieren zu lassen“; „Ihr eigenes Baby“ | P29:113-114 |
| 06.1 | „3 bis 5 Werktage“ zusammenhängend; sechs Statuswörter „Bestellt“, „Bezahlt“, „In Einrichtung“, „Domain gesichert“, „Zur Freigabe“, „Live“ als `<b>…</b>` in dieser Reihenfolge | P29:113-114 |
| 04 | `<b>39 €</b> im Monat` je Paket; „<Betrag> Einrichtung“; `href="#bestellen" data-paket="<paket>"` je Paket; `<b>Vorläufige Preise.</b>` einmal; Satz zur Steuer | P29:46, :55, 29.1; 15-4; 15-13 |
| 05 | „Bestellung bald möglich“; „Danke, Ihre Frage ist da.“; Start-Tag des Formulars Byte für Byte | P29:46, 29.1; `30.mjs:117`; PR:1793 |
| 06.2 | `<h2 id="kundenschutz">Ihre Kunden bleiben Ihre Kunden</h2>`; „Nur Ihr Betrieb:“, „Nur an Sie:“, „In Ihrem Auftrag:“, „Kein Weiterverkauf:“ (in der Einbettung genau vier); genau ein Link auf `/konfigurator-bedingungen/#kundenschutz` | PR:611, :1691 |
| A2 | mindestens sechs Fragen mit Domain, kündigen, Datenschutz, Kunde, Website; `<summary>` wortgleich im JSON-LD | P29:116-117; PR:1738-1748 |
| `/fuer-fensterbauer/` | kein Link auf `/#tour` oder `/#fensterbauer`, kein „Kostenlos starten“, kein „Einführungspreis“, kein `class="einf"` (auch in Menü und Fuß) | PR:1587-1593; P29 29.1 |
| Einbettung | `.vk-einbettung .rg-cta a[href="#pakete"]` als Cream im Startbild | PR:175 |
| Startseite | Eyebrow „In Minuten zum Aufmaß für jeden Fensterbauer“; h1 „Fenster ausmessen. Selbst. eezi.“, grün „eezi.“; `.hero.b2c` mit `/app/#ausmessen` und `/app/#fuehrung`; in der Textfassung „Aufmaß-App für Fenster“ und „auf einen Blick“; Einführungspreis in `<span class="einf">` ohne verschachtelte `span` | PR:149, :169, :605, :1576-1577, :1721 |
| Ratgeber | `<figure class="rg-bild"><img ` genau so; Stand in Text und JSON-LD | PR:1781, :1735 |

### A.2 Handlungstexte je Abschnitt (Wortlaut nach Teil B der Spezifikation)

| Abschnitt | Element | Wortlaut | Art | Ziel |
|---|---|---|---|---|
| `fb-01` | Cream | „Pakete ansehen“ (mit Pfeil im Kreis) | Bestand VK:63 | `#pakete` |
| `fb-01` | Ring | „Selbst ausprobieren“ | **Textentwurf** | `#die-idee` |
| `fb-03` | Textziel | „Mit Ihrem Namen ansehen“ | **Textentwurf** | öffnet das Feld „Ihr Firmenname“ |
| `fb-04` | Wahlzeilen | „Fenster“, „Balkontür“, „Hebe-Schiebe-Tür“ · „Ohne“, „Raffstore“, „Weiß ich noch nicht“; Gruppenbeschriftungen „ELEMENT“, „SONNENSCHUTZ“ | Wahlzeilen Bestand (`README.md:3`, `app.js:1368`), Beschriftungen **Textentwurf** | Zustand |
| `fb-05` | Textziel | „Wie sehr soll es Ihre Marke tragen?“ | **Textentwurf** | `#pakete` |
| `fb-06` | Kartenknopf | „Essential anfragen“, „Essential Plus anfragen“, „Signature anfragen“ (A); „… bestellen“ (B) | Bestand PS:113-115 | `#bestellen` mit `data-paket` (A); `/partner/#bestellen/<paket>` (B) |
| `fb-06` | Umschalter | „Leistungen ansehen“ / „Leistungen ausblenden“ | Bestand PS:123 | Liste |
| `fb-07` | Zusammenfassung | „Alle Merkmale im Vergleich“ | Bestand VK:182 | `details` |
| `fb-08` | Link | „Paketbedingungen mit AV-Vertrag“ | Bestand, gekürzt | `/konfigurator-bedingungen/` |
| `fb-08` | Ring Gesprächsweg | „Rückruf oder Nachricht“; bis OE-20 „Frage stellen“ | **Textentwurf** | `#frage`, Paket „Noch offen“ |
| `fb-09` | h3 | „Paket unverbindlich anfragen“ | Bestand VK:221 | Sprungziel `#frage` |
| `fb-09` | Cream | „Frage senden“ | Bestand | `POST /api/partner/frage` |
| `fb-09` | Dank | Ring „Zurück zu den Paketen“, Link „Paketbedingungen“ | Bestand bzw. ZA | `#pakete`; `/konfigurator-bedingungen/` |
| `fb-11` | Link | „Paketbedingungen § 10“ | ZA | `/konfigurator-bedingungen/#kundenschutz` |
| `fb-12` | Ring (Zustand A) | „App für Hauseigentümer öffnen“ | **Textentwurf** | `/app/`, neuer Tab |
| `fb-15` | Zeilenknöpfe | Kurzname · Monatspreis / Einrichtung „… € einmalig“ | Werte aus `pakete.js`, „einmalig“ **Textentwurf** | `#bestellen` mit `data-paket`, Fokus `#frage` (A); `/partner/#bestellen/<paket>` (B) |
| `rh-01` | Kopfknopf | Fensterbauer „Pakete ansehen“ / „Paket anfragen“ (**Textentwurf**); Hauseigentümer „Fenster ausmessen“ / „Aufmaß fortsetzen“; „Anmelden“; „Menü“ | Bestand bzw. Textentwurf | nach 16.2.2 |
| `st-03` | Link-Zeile | „Aufmaß per Code übernehmen“ | Bestand | Betriebsbereich, Ziel nach OE-28 |
| `st-04` | Ring | „Zur Seite für Fensterbauer“ (**Textentwurf**) bzw. „Zur Ansicht für Hauseigentümer“ (Bestand `portal.js:791`) | – | schaltet die Ansicht |
| `he-01` | Cream, Ring | „Jetzt ausmessen“ (mit Aufmaß „Aufmaß fortsetzen“), „Führung starten“ | Bestand `portal.js:852` | `/app/#ausmessen` bzw. `/app/`; `/app/#fuehrung` |
| `he-02` | Messknöpfe, Cream | „Oben“, „Mitte“, „Unten“; „Jetzt ausmessen“ | **Textentwurf** (Knöpfe), Bestand (Cream) | Zustand; App |
| `he-04` | Ring, Link | „Führung starten“; „Mehr zu Fotos und KI“ | Bestand; **Textentwurf** | `/app/#fuehrung`; `/datenschutz/#fotos-ki` |
| `he-05` | Linkzeile | „Alle Ratgeber ›“ | Bestand `portal.js:857` | `/ratgeber/` |
| `he-07` | Cream | „Jetzt ausmessen“ / „Aufmaß fortsetzen“ | Bestand | App |
| `ar-02` | Knopf | Fachartikel „Konfigurator für Fensterbauer“ (**Textentwurf**), „Fensterbau-Software“ „Pakete ansehen“; Ratgeber „Fenster ausmessen“ | – | `/fuer-fensterbauer/`, `#pakete`, App nach OE-32 |
| `pb-01` | Kopf-Ring | „Pakete ansehen“ | Bestand | `/fuer-fensterbauer/#pakete` |
| `pa-01` | Cream, Weiche | „Code schicken“, „Bestätigen“; „Zum Betriebskonto“, „Pakete ansehen“ (**Textentwürfe** der Weiche) | Bestand bzw. Textentwurf | `/#anmelden`; `/fuer-fensterbauer/#pakete` |
| `nf-01` | Ringe | „Zur Startseite“, „Zur App“, „Für Fensterbauer“ | Bestand, dritter neu | `/`, `/app/`, `/fuer-fensterbauer/` |
| `ap-01` | Fußlink | „Sie sind Fensterbauer? ›“ | Bestand `app.js:2781` | `/fuer-fensterbauer/` |

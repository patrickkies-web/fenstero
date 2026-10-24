# 12. Scroll Experience Storyboard

[← Übersicht](README.md)

Ergebnis 9 des Website-Blueprints (MASTER-PROMPT V4): die visuelle Dramaturgie der bevorzugten Architektur E vom ersten Seitenaufruf
bis zur gewünschten Handlung. Stand 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`. Planungsdokument: Das Repository wurde nur
gelesen; gebaut oder geändert wurde nichts.

**Was dieses Kapitel leistet.** Die Abschnitts-Spezifikationen in [09-abschnitte/](09-abschnitte/) beschreiben jeden Abschnitt für sich.
Dieses Kapitel legt sie hintereinander und beschreibt, was der Besucher beim Scrollen tatsächlich nacheinander sieht: welche Szene wann
beginnt, welches Objekt sie trägt, wie die Bewegung von einer Szene an die nächste übergeben wird und wo die Handlung liegt. Die Seite für
Fensterbauer ist vollständig erzählt (Szenen FS1 bis FS15, dazu die Sprünge in 12.3), die Startseite `/` und der Einstieg der
Hauseigentümer in ihren wesentlichen Szenen (HA1 bis HA6, Rahmenszenen SR1 bis SR4). Die Scroll Experience Timeline steht getrennt für
Telefon (12.5) und Schreibtisch (12.6), die ruhige Fassung je Szene in jedem Steckbrief und gesammelt in 12.7. Die Bildfassung der
wesentlichen Übergänge ist in [13-wireframes.md](13-wireframes.md), Abschnitt 13.7, vorgesehen.

**Grundlage**

| Kürzel | Datei | Rolle hier |
|---|---|---|
| ZA | [08-zielarchitektur.md](08-zielarchitektur.md) | Abschnittsfolge, Stufen, Ziele, Nutzerfragen (8.3.2, 8.3.3, 8.3.4) |
| IDs | [09-abschnitte/](09-abschnitte/) `fb-01` … `fb-15`, `he-01` … `he-07`, `st-02` … `st-04`, `rh-01` … `rh-03`, `ap-01` | alle Lagen, Bewegungen, ruhigen Fassungen; jede Szene nennt ihre ID |
| PE | [10-paketentscheidung.md](10-paketentscheidung.md) | Konzept P1 „Wischreihe mit Markenbild“, Festlegungen 10-1 bis 10-4, J-R- und J-H-Nummern |
| DS | [11-designsystem.md](11-designsystem.md) | Festlegungen K-1 bis K-40, Dauern und Kurven (11.7.1), Bewegungsregeln (11.7.2), Szenen (11.7.4), Physik (11.7.5), Sprünge (11.7.6), Rhythmus (11.1.5) |
| WF | [13-wireframes.md](13-wireframes.md), `wireframes/mobil-*.svg`, `wireframes/desktop-*.svg` | Seitenlängen und Abschnittslagen aus den gemessenen Spezifikationen |
| EA | [04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md) | Entscheidungsstufen S0–S8 (Fensterbauer), B1–B5 (Hauseigentümer), Gruppen FB-n, HE-n, Zweifel F-nn, H-nn |
| DNA, SG, DNA-B | `docs/design-dna/03-design-dna.md` (5.1–5.5), `04-styleguide.md` (10.7 Motion), `05-ergebnis-b-styleguide.md` | verbindliche Prinzipien Nr. 1–11, Signature-Effekte, Motion-Regeln |
| SKILL | `.claude/skills/premium-gestaltung/SKILL.md` | Anforderungen des Inhabers: Telefon 390 × 844 zuerst, Bewegung mit Tiefe und Physik, ruhige Fassung, ehrlich, kurze Texte, keine fremden Server |
| GEST, DR | `docs/GESTALTUNG.md`, `.claude/skills/premium-gestaltung/designrichtung.md` | heutige Regeln; dürfen hinterfragt werden |

**Kennzeichnungen**

- **[V]** verbindlich (Anforderung des Inhabers, DNA-Prinzip, Pflichtregel des SG, Festlegung K-n, Prüfsuite, Recht). **[H]** Hypothese
  oder experimentelle Gestaltungsentscheidung mit Rückfall.
- **Textentwurf**: Wortlaut aus den Spezifikationen, der noch nicht im Bestand steht und die Freigabe des Inhabers braucht. Dieses Kapitel
  schreibt selbst keine neuen Texte für die Website; es zitiert die Entwürfe der Spezifikationen und kennzeichnet sie.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: Das Storyboard setzt Abweichungen voraus, die in ZA 8.4.5,
  DS 11.B und den Spezifikationen geführt sind; 12.10.3 sammelt die, die die Dramaturgie tragen. Name, Wortmarke und Logo bleiben.
- **Festlegung 12-n**: Entscheidung dieses Kapitels, wo zwei Spezifikationen für denselben Moment Verschiedenes sagen (12.9).
- **Neuentwurf**: Die DNA stammt aus Standbildern (DNA 5.5, SG 10.7): Jede Bewegung, jeder Zeitwert und jede Scrollmechanik hier ist
  Neuentwurf, nicht beobachtet. Verbindlich ist nur ihr Ort (Bildschicht) und dass jeder Ruhezustand als Standbild die volle Komposition
  trägt.

**Rangfolge.** Bei Widerspruch gilt die Rangfolge aus DS (Einleitung): Mindestanforderungen → DNA und SG-Pflicht → SKILL → DS → ZA, PE →
einzelne Spezifikation. Ein Wert einer Spezifikation, den eine Festlegung K-n ersetzt, steht hier mit dem K-Wert; 12.9 nennt jede Stelle.

**Methode und Grenzen.** Die Szenen folgen der Abschnittsfolge der Zielarchitektur. Lagen und Scrollstände sind aus den geplanten Maßen
der Spezifikationen gerechnet (Telefon-Längen wie in den Wireframes: Seite für Fensterbauer 11.620 px = 13,8 Bildschirmhöhen, Ansicht
Hauseigentümer 5.736 px = 6,8 BH); sie sind geplant, nicht gemessen. Aufmerksamkeitsfolgen sind erwartet, nicht beobachtet. Die
simulierten Expertenperspektiven, auf denen Konzepte und Architektur beruhen, sind eine Analysemethode, keine Nutzerstudie; im Repository
gibt es keine Nutzerforschung, Besucherzahlen oder Konversionsraten. Aussagen über Wirkung sind Hypothesen; dieses Kapitel nennt keine
Wahrscheinlichkeiten.

**Wie die Scrollwerte gerechnet sind.** `scrollY` ist die Seitenzeile am oberen Bildschirmrand. *Eintritt* = Oberkante des Abschnitts
erreicht den unteren Rand (`y_oben − 844`). *Ruhelage* = Haarlinie 16 px unter dem Kopf, also genau dort, wo ein Sprung über Menü, Kopf
oder Textziel ankommt (K-15; Telefon `y_oben − 72`, Schreibtisch `y_oben − 80`). *Austritt* = Unterkante verschwindet unter dem Kopf
(`y_unten − 56`, Schreibtisch `− 64`). *Bildschirm n* = das n-te Seitenstück von 844 px (bzw. 664 px für die reale Höhe mit
Browserleisten; Schreibtisch 800 px) ab Seitenanfang, wie in ZA und WF.

---

## 12.1 Dramaturgie auf einen Blick

### 12.1.1 Leitidee

Die Seite für Fensterbauer erzählt eine einzige Bewegung: **vom Ankommen über das eigene Produkt zum Ergebnis, dann zur Marke und zur
Anfrage.** Der Besucher bedient das verkaufte Produkt, bevor er die Pakete sieht; der Unterschied der Pakete ist ein Zustand derselben
Startansicht (EV 7.5.1, ZA 8.3.2). Das Hauptobjekt wandert dabei sichtbar weiter, statt in jedem Abschnitt neu zu beginnen:

> Figur im Licht (V1) → Renderings unter dem Lichtkegel (V2) → das Gerät, oben (01) → dasselbe Gerät, unten im Lichtraum (02) → das
> Aufmaßblatt, das aus dieser Wahl entsteht (03) → das Beispielbild in der Paketkarte (04) → Formular ohne Bild, Cream als einziger
> Hellwert (05) → Maßstab (06) → das kleine Gerät neben der Paketwahl (Abschluss).

Die Ansicht Hauseigentümer erzählt kürzer: **Ich kann das (Foto, Probemessung) → das bekomme ich und das kostet es (Blatt mit Preisetikett)
→ so läuft es und meine Daten bleiben bei mir (Maßstab, Haken) → anfangen (Bildband, Cream).**

### 12.1.2 Spannungsbogen der Seite für Fensterbauer (Telefon 390 × 844)

Zwei Wellen nach DS 11.1.5: Bühne und Beweis vorne, danach eine lange ruhige Strecke, in der sich nur bewegt, was der Finger führt.

| Phase | Szenen | Bildschirmhöhen (844) | Stufen | Hauptobjekt | Licht | Bewegung (ein Träger) | Cream im Bild |
|---|---|---|---|---|---|---|---|
| 1 Bühne | FS1, FS2 | 0–0,99 | 4 · 3 | Astronaut am Bullauge, Rendering in der Mitte der Leiste | Erdlicht, Lichtkeil, Kegel (Zeichnungsblau) | Ladeauftritt 0–4,1 s, dann Leiste nach Scrolltempo | „Pakete ansehen“ (y 542) |
| 2 Atempause | FS3 | 1,10–2,20 | 2 | Gerät, obere 420 px | nur 1-px-Lichtkante | Gerätebildschirm geht einmal an | – |
| 3 Beweis | FS4, FS5 | 2,31–4,47 | 3 · 3 | Gerät unten mit Render; Aufmaßblatt | Lichtfleck Cream in 02, danach kein Licht | Antwort auf Tippen; Blatt-Auftritt, Explosion | – |
| 4 Entscheidung | FS6–FS10 | 4,59–8,26 | 2 · 1 · 1 · 1 | Beispielbild in der Karte, dann keines | keines | nur fingergeführt (Feder im Bild), Rückmeldungen | Kartenknopf (y 4.399), „Frage senden“ (y 6.818) |
| 5 Absicherung | FS11, FS12 | 8,37–10,44 | 2 · 2 | Maßstab, Ankerkachel | keines | Marken als Zustand, Haken einmal | – |
| 6 Restzweifel | FS13 | 10,55–12,13 | 1 · 1 · 1 | keines (Zeilen) | keines | nur Aufklappen | – |
| 7 Klammer | FS14, FS15 | 12,24–13,77 | 2 · 1 | Mini-Gerät neben drei Zeilenknöpfen | keines | keine | Cream-Zeile (y 10.576) |

Kopf und Ordnungslinie stehen auf der ganzen Seite (SG 10.7/5). Es gibt keine Kapitelanzeige und keinen Lesefortschritt im Kopf (ZA N6,
8.2.2).

### 12.1.3 Fünf Fäden, die die Szenen verbinden

| Faden | Verlauf | Regel |
|---|---|---|
| **Objekt** | Figur → Rendering → Gerät oben → Gerät unten → Blatt → Beispielbild → Mini-Gerät. 01 und 02 zeigen denselben Gerätebaustein auf derselben Achse in zwei Kadrierungen; der Wechsel liest sich wie ein Blick am Gerät abwärts, ohne dass sich etwas bewegt (EV W11; K-23) | ein Held je Bildschirm (DG G3; DNA Nr. 3) |
| **Licht** | Erdlicht im Bullauge → Lichtkeil über die Unterkante von V1 (einziger Rahmenbruch der Website) → Kegel in der Leiste → Pause in 01 → Lichtfleck in Cream unter dem Gerät in 02 → ab 03 kein Licht mehr; dort übernimmt Papierweiß, ab 04 die Cream den einzigen Hellwert | Licht nur mit Quelle, an höchstens zwei Orten, nie in Folge (DS 11.1.5; Dosierregel 3) |
| **Bewegung** | Foto → Meldungen → Maßlinie (Zeit) → Leiste (Scrolltempo) → Gerätebildschirm (Eintritt) → Licht und Bildwechsel in 02 (Tippen) → Blatt, Explosion, Linien in 03 (Eintritt, Scrollweg) → Bild mit Feder in 04 (Finger) → Marken in 06.1 (Zustand) → Haken in 06.2 (Eintritt). Jede Szene endet, bevor die nächste beginnt | ein bewegter Träger je Ansicht, Bedienschicht ohne Auftritt (K-6; SG 10.7/4) |
| **Handlung** | Cream nur an vier Stellen (V1, Karte, Formular, Abschluss), immer mindestens eine Bildschirmhöhe auseinander; dazwischen trägt der Kopf-Ring den Schnellweg mit Zielwechsel | eine Cream je Bildschirm (SKILL:71); ein dauerhafter Handlungsträger (ZA N5) |
| **Ruhe und Text** | höchstens ≈ 40 Wörter im ersten Bildschirm; Lesestapel höchstens drei Zeilen; lange Inhalte (Vergleich, sieben Inhalte des Blatts, Leistungslisten, Fragen) nur auf Tippen | Bild statt Text, kurze Abschnitte (SKILL:29–30) |

### 12.1.4 Ansicht Hauseigentümer auf einen Blick

| Phase | Szenen | BH (844) | Stufen | Hauptobjekt | Bewegung | Cream im Bild |
|---|---|---|---|---|---|---|
| Ankommen | HA1 | 0–0,81 | 3 | Waschbär an der Maueröffnung (Foto) | Foto setzt sich, Glas klärt sich (≈ 1,2 s) | „Jetzt ausmessen“ (y 550) |
| Zutrauen | HA2 | 0,92–1,75 | 2 | weiße Zeichnungskarte | Maßlinie auf Tippen | „Jetzt ausmessen“ (y 1.422) |
| Ergebnis und Preis | HA3 | 1,86–3,01 | 2 | Aufmaßblatt mit Preisetikett | Blatt legt sich ab | nur Kopfknopf |
| Ablauf und Daten | HA4 | 3,13–3,78 | 2 | waagerechter Maßstab | keine (Fassung A) | nur Kopfknopf |
| Unentschlossene | HA5 | 3,89–4,94 | 2 · 1 | Ankerkachel „Ausmessen“ | Maßlinien in der Kachel [H] | nur Kopfknopf |
| Anfangen | HA6 | 5,06–6,80 | 2 · 2 · 1 | Bildband aus dem Startfoto | keine | „Jetzt ausmessen“ (y 4.587) |

Eine Welle: Bühne (3), vier klare Abschnitte mit je einem Bildträger, Fragen (1), Klammer (2), Wechselkarte (2). Kein CSS-Licht; Licht nur
in den Fotos von H1 und H7 (DS 11.1.5).

---

## 12.2 Seite für Fensterbauer `/fuer-fensterbauer/`: alle Szenen

Jede Szene hat denselben Steckbrief. „Sichtbar“ beschreibt den Bildschirm 390 × 844 in der genannten Lage von oben nach unten, mit
Bildschirm-y. Eingebettet in `/#fensterbauer` gilt dieselbe Folge, um 52 px nach unten versetzt (SR2).

### Szene FS1 · Ankunft und Weiche (V1 `fb-01-startbild`, Stufe 4, T1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 0–690 · scrollY 0 (Ruhelage) bis 634 (Austritt) · Bildschirm 1 bei 844 und 664 · Schreibtisch y 0–704 |
| Sichtbar (scrollY 0) | Kopf 56 px flächenlos über dem Scrim (`#161616` 60 % → 0 über 96 px): Logo links, Menü rechts, Ring verborgen. Foto 390 × 420 (y 0–420, 50 % der Höhe, ab y 315 in den Grund ausgeblendet): oben rechts das Bullauge mit Erde (Mitte x ≈ 345, y ≈ 155, sichtbarer Ø 160–180 px, vom rechten Rand angeschnitten), davor der Astronaut (Gesicht x 220–295, y 200–270), die Hände mit gelbem Zollstock am Bullaugenrand; am rechten Rand des Ausblicks die Maßlinie „1.200 mm“. Oben links über der Stationsdecke das Etikett „BEISPIEL“ (y 72–88) und der Glas-Stapel 220 × 64 (x 16–236, vorn y 94–158) mit drei Meldungen (Textentwurf): „Neue Anfrage / Familie Weber · 4 Positionen“, „Aufmaßblatt als PDF / im Postfach“, „Klärungsliste / 2 Punkte offen“. Unten links die Bedienschicht: Kicker „Für Fensterbauer und Fensterhändler“ 13 (y 320–336), h1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“ 32/34 in drei Zeilen, grün „Marke“ (y 344–446), drei Chips 36 px „Ihre Domain“ · „Ihre Marke“ (Textentwurf) · „PDF per E-Mail“ (y 462–498), Preiszeile 13 „Ab 29 € im Monat netto, plus Einrichtung · vorläufig“ (Textentwurf, y 510–527), Cream 212 × 52 „Pakete ansehen“ (y 542–594), Ring 212 × 52 „Selbst ausprobieren“ (Textentwurf, y 606–658). Ganz unten die Leiste V2 im Anschnitt (y 690–834, 17 %), über ihre Oberkante läuft der Lichtkeil |
| Hauptobjekt | Astronaut am Bullauge; Figur samt Bullauge ≈ 210 × 300 px = 19 % der Fläche bei 844 (24 % bei 664). Anker ist das Erdlicht, einziger gesättigter Reiz und Helligkeitszentrum. Größenfolge Figur ≈ 300 px → h1 32 px → Klein-UI 13–17 px |
| Kamera, Komposition | feststehende, frontale Fotokamera; beim Laden „setzt sie sich“ (Maßstab 1,03 → 1, Ursprung am Bullauge). Asymmetrische Diagonale: Anker oben rechts, Lesestapel und Cream unten links an der Ordnungslinie x 16; der Lichtkeil (`--el` 12 % → 6 %, 120 → 200 px breit, ≈ 14° gegen die Senkrechte) zeichnet die Diagonale nach und ragt 72 px in V2. Ebenen: Z 0 Grund mit Keil → Z 20 Foto, Erdlicht, Maßlinie → Z 25 Etikett und Glas → Z 28 Scrim → Z 30 Bedienschicht → Z 40 Kopf. Flächen: Foto 50 %, Text ≈ 12 %, Cream 3,4 %, frei ≈ 35–40 % |
| Bewegung | Ladeauftritt nur in der Bildschicht, ein Träger nacheinander (K-7; E-2): 0–0,9 s Foto (Deckkraft 0,35 → 1, Maßstab 1,03 → 1, 900 ms `--e-out`), Erdlicht und Keil folgen ab 0,15 s; bei 0,9 / 1,6 / 2,3 s je eine Meldung (fällt von −16 px, 1,02 → 1, 600 ms, ohne Abprallen; die vordere rückt nach hinten, ihr Text geht in 220 ms aus); 0,9 s „BEISPIEL“ (320 ms); 2,9–4,1 s Maßlinie zeichnet sich von oben, Wert zählt in der Bildschicht 0 → 1.200 (1.200 ms); ab 4,1 s Stand, keine Schleife. Start erst nach `img.decode()` und nur, wenn V1 beim Laden im Bild ist. Erste Eingabe (Scrollen > 4 px, Wischen, Rad, Taste): Laufendes und Ausstehendes geht in 220 ms per Deckkraft in den Endzustand. Die Bedienschicht steht ab dem ersten Bild. Foto-Tiefe 0,88 läuft nach Festlegung 12-1 nur, solange die Leiste nicht im Bild ist, bei 844 also nicht (12.9) |
| Übergang | drei Ausgänge: (1) Scrollen – die Leiste reagiert ab dem ersten Scrollschritt (FS2); bei scrollY ≈ 256 erreicht der Kicker die Kopfkante + 8 px, der Kopf wird opak (150 ms); bei ≈ 538 ist die Cream unter dem Kopf verschwunden, der Kopf-Ring „Pakete ansehen“ blendet ein (220 ms). (2) Cream – sofortiger Sprung auf `#pakete` (FS6). (3) Ring – sofortiger Sprung auf `#die-idee` (FS3) |
| Informationshierarchie | 1 Erdlicht im Bullauge · 2 erste Meldung (Bewegungsbeginn), dann das Gesicht, das zum Bullauge blickt · 3 h1 mit grünem „Marke“, darüber der Kicker · 4 Chips → Preiszeile → Cream (größter Hellwert der Bedienschicht) · 5 Ring · 6 Keil und Leistenanschnitt ziehen nach unten. ≈ 30 Wörter plus eine lesbare Meldung |
| Handlungsaufforderung | Cream „Pakete ansehen“ → `#pakete` (Schnellweg W2; FB-2, FB-3); Ring „Selbst ausprobieren“ → `#die-idee` (W1; FB-5, FB-1). Preiszeile, Cream und Ring stehen auch bei 390 × 664 ganz im Bild (E-1) |
| Funktion im Kaufentscheidungsprozess | S0 Ankommen und S1 Zuordnen: Zielgruppe, Hauptaussage, Preisniveau und zwei gewichtete Wege ohne Scrollen. Die Meldungen zeigen den Nutzen als Szene („Anfragen kommen bei mir an“), als Beispiel gekennzeichnet; die Preiszeile nimmt die Preisfrage vorweg (RE R12, T1; Hypothese) |
| Ruhige Fassung | Endbild ab dem ersten Bild: drei Meldungen (Meldung 3 vorn), Maßlinie fertig mit „1.200 mm“, Licht und Keil stehen, kein Zoom, keine Foto-Tiefe; die Deckkraftwechsel des Kopfs bleiben. Ohne JavaScript dieselbe Endfassung ohne Maßlinie |
| Schreibtisch | Split 5 : 7: Text x 120–539 senkrecht mittig (h1 40/42 zweizeilig, y 269–353), Foto ab x 563 randlos bis 1280 (y 0–760), Stapel x ≈ 900–1120; Cream und Ring nebeneinander (y 470–522); Leiste ab y 704 (96 px im Bild, überdeckt den ausgeblendeten Fotofuß um 56 px) |
| Material, Hypothesen | Telefonzuschnitt `fb-sessel-telefon.webp` beim Inhaber anzufragen (Stapel verdeckt sonst Gesicht, Handy oder Papierflieger); bis dahin Platzhalter nur für Vorschau. H-E7 (420 px tragen die Wirkung), DG-H-12 (Blinzeltest: zwei Flecken, Erde und Cream), I-H-1, I-H-2 |

### Szene FS2 · Die Leiste dreht sich mit dem Scrollen (V2 `fb-02-leiste-elementarten`, Stufe 3, T2)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 690–834; bei 844 ab dem Laden ganz sichtbar · Kopplungsfenster scrollY 0 → ≈ 495–510 (bis das Gerät aus 01 zu 50 % im Bild ist); bei 664 scrollY 26 → ≈ 675 · Austritt 778 · Bildschirm 1 (844), 2 (664) · Schreibtisch y 704–880, Fenster ≈ 0 → 680 |
| Sichtbar (scrollY ≈ 300) | oben noch Cream und Ring von V1; dann das Band 144 px über die volle Breite zwischen zwei Haarlinien: in der Mitte eine Kachel 90 × 90 (x 150–240) scharf unter dem Lichtschlitz (120 × 1 in der oberen Haarlinie) und dem Kegel (Halbachsen 68 × 150, um 10° nach links unten geneigt); je eine ganze Nachbarkachel 72 × 72 (x 54–126 und 264–336), außen je eine angeschnitten unter der 24-px-Randmaske; darunter ein einziger Namensplatz 15/700, z. B. „Zweiflügelig“. Unter dem Band 96 px Grund, dann die Haarlinie und die Kapitelzeile von 01 |
| Hauptobjekt | Rendering der Elementart in der Mitte (1,25-fach, scharf, volle Deckkraft); zum Rand 40 % Deckkraft und 2 px Unschärfe. Mit 90 px bleibt es weit unter dem Fokusträger von V1 (Foto 420 px), damit das Band als Fortsetzung liest, nicht als zweiter Held |
| Kamera, Komposition | die Reihe ist eine Rolle: `perspective: 700px`, jede Kachel um bis zu ±36° gedreht, Größe 0,8 + 0,2 · Nähe zur Mitte, Deckkraft 1 − 0,6 · d²; nur die Bilder wölben sich, der Name bleibt frontal. Symmetrisch um die Bildschirmachse (mittiges Motiv, G5). Ebenen: Z 0 Grund mit Haarlinien → Z 20 Renderings → Z 25 Schlitz und Kegel (`screen`, höchstens halb so hell wie der Lichtkern im Bullauge) → Z 30 Name → Z 40 Kopf. Band: ≈ 42 % Bild, 5 % Text, 53 % frei |
| Bewegung | scrollgekoppelt mit Trägheit (K-37): Ziel += −0,42 · Δy, abwärts wandert die Reihe nach links, die nächste Art kommt von rechts; kritisch gedämpft (ζ = 1, ω = 9 s⁻¹: ≈ 0,22 s Nachlauf bei gleichmäßigem Scrollen, ≈ 0,5 s Auslauf), kein Überschwingen; ruht die Eingabe 150 ms, rastet die nächste Kachelmitte ein, spätestens 1,2 s nach der letzten Eingabe. Im Fenster bei 844 ≈ 215 px Versatz: zwei Wechsel (Dreh-Kipp-Fenster → Zweiflügelig → Balkontür), bei 664 ≈ 2,9. Name: alt 150 ms aus, neu 220 ms ein; schneller als 2,5 Teilungen/s blendet er aus und kehrt beim Abklingen zurück. Mit dem Finger 1 : 1 (waagerecht ab 8 px), Abwurf mit dem Tempo der letzten 80 ms (≤ 1.200 px/s, τ = 0,3 s), dann Einrasten. Tippen auf eine seitliche Kachel: 480 ms unter den Kegel. Keine Dauerschleife. Beim Laden kein eigener Auftritt: Schlitz und Kegel gehen mit dem Foto an (0–0,9 s) |
| Übergang | beim Einrasten bzw. am Fensterende meldet das Band `vk:leiste-ruht`; erst danach geht der Gerätebildschirm in 01 an (Übergabe des einen Trägers). Bildlich: untere Haarlinie → 96 px Grund (K-14) → Spalten-Haarlinie und „01 · IHR NAME“. Der Lichtweg aus V1 endet im Kegel; 01 ist die Ruhestelle ohne Licht. Zurückscrollen in das Fenster koppelt wieder |
| Informationshierarchie | 1 Mittelkachel · 2 Name · 3 Nachbarn · 4 weiche Ränder („es geht weiter“). Im ersten Bildschirm ist das Band Fortsetzungssignal, kein Ziel |
| Handlungsaufforderung | keine im Band; die Cream von V1 ist bis scrollY ≈ 538 im Bild, danach trägt der Kopf-Ring „Pakete ansehen“ den Schnellweg |
| Funktion im Kaufentscheidungsprozess | S1 → S3: beantwortet ohne Lesen die Ausschlussfrage „Kann der Konfigurator, was meine Kunden brauchen?“ (F-14, teilweise; kein Sortiment je Betrieb). Hypothese: Wer sein Sortiment wiedererkennt, liest weiter |
| Ruhige Fassung | keine Kopplung, Wölbung, Skalierung oder weiche Fassung; die Reihe ist ein nativer Wischbereich (`scroll-snap-type: x proximity`) ab x 16, alle Kacheln 72 px, jeder Name 15 px `--text2` unter seiner Kachel, Schlitz und Kegel als stilles Licht, Bandhöhe gleich. Ohne JavaScript identisch |
| Schreibtisch | 176 px hoch, Mittelkachel 120 px (x 580–700), 9–10 Kacheln sichtbar, Name 17 px; Fenster bis die Geräte-Bühne von 01 zur Hälfte im Bild ist |
| Material, Hypothesen | 14 Renderings aus der eigenen Bühne (selbst erzeugbar, Freigabe); bis dahin Zeichnungen 24 px (Rückfall R2, dann Stufe 2). DG-H-9 (Scrollkopplung allein wirkt lebendig genug), H-E5 (Lichtfaden als Markenfaden) |

### Szene FS3 · 01 Ihr Name: der eigene Konfigurator geht an (`fb-03-ihr-name`, Stufe 2, T3)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 930–1.854 · Eintritt 86 · Ruhelage 858 (= Sprungziel des Rings „Selbst ausprobieren“) · Austritt 1.798 · Bildschirm 2–3 (844 und 664) · Schreibtisch ≈ 1.008–1.828 |
| Sichtbar (Ruhelage) | Haarlinie y 72, Kapitelzeile „01 · IHR NAME“ (Textentwurf; „01“ grün, Rest `--muted`, y 88–104), h2 „Die Idee: der Fenster-Konfigurator Ihrer Wahl“ zweizeilig, grün „Wahl“ (y 116–184), Lead 17 „So begrüßt Ihr Konfigurator Ihre Kunden, unter Ihrer Domain.“ (Textentwurf, y 196–247), Gerät 300 × 420 auf der Mittelachse (x 45–345, y 271–691), Textziel 44 px „Mit Ihrem Namen ansehen“ (Textentwurf, y 699–743), darunter angeschnitten die drei Punkte mit Haarlinien |
| Hauptobjekt | Gerät (Gerätebaustein K-23: Rand 10 px `--surface`, Radien 44/34, keine Kamera-Insel), ≈ 38 % der Fläche. Sein Bildschirm 280 × 410 zeigt die Startansicht der Stufe Essential: Adresspille „ihr-name-fenster.de · Beispiel“, Absender „Fensterplaner von / Fensterbau Brandt“ mit Initiale „B“, Standardbild 248 × 140, „Ihre neuen Fenster, Ihr Angebot.“ (24 px, grün „Angebot“), Pillen 36 px als Bild ohne Trefferfläche |
| Kamera, Komposition | frontal, ohne Perspektive und ohne Eintrittsdrehung: der bewusste Gegensatz zur Fototiefe in V1. Das Gerät steht oben vollständig und läuft unten über 48 px in den Grund aus. Achse nur für das Gerät, Text an x 16. Ebenen: Z 0 → Z 20 Gerät → Z 30 → Z 40; kein Lichtraum, nur die 1-px-Lichtkante (oben und rechts 24 %, Haus-Lichtrichtung K-24). Im Bildschirm mit ganzem Gerät: Gerät 38 %, Text ≈ 15 %, frei ≈ 47 % |
| Bewegung | einmal je Seitenaufruf geht der Gerätebildschirm an: Inhalt Deckkraft 0 → 1 und Maßstab 1,015 → 1 (600 ms `--e-out`), sobald das Gerät zu ≥ 60 % im Bild ist (844: scrollY ≈ 537) und die Leiste ruht (höchstens 1,2 s warten). Sonst keine Scrollkopplung und kein Anheften. Freiwillige Nebenszene: Tipp auf das Textziel → an derselben Stelle erscheint die Feldgruppe „Ihr Firmenname“ (358 × 52) mit dem Hinweis „Nur eine Vorschau auf diesem Gerät. Nichts wird gesendet.“ (beides Textentwurf; 220 ms Deckkraft), der Fokus geht ins Feld; „Fertig“ → liegt die Absenderzeile außerhalb, rollt die Seite nativ dorthin, dann alter Name aus (165 ms), neuer ein (220 ms) |
| Übergang | 96 px Grund → Haarlinie von 02: dasselbe Gerät auf derselben Achse, jetzt oben angeschnitten. 01 zeigt das obere, 02 das untere Ende; der Schnitt wirkt wie ein Blick am Gerät abwärts (andere Kadrierung statt Wiederholung) |
| Informationshierarchie | 1 Gerätebildschirm (einzige helle Fläche, wechselt beim Anschalten die Helligkeit) · 2 h2 · 3 Adresszeile · 4 Absender mit Namen · 5 Textziel · 6 drei Punkte „Kein Programmierauftrag“, „Ihr eigenes Baby“, „Ihr Werkzeug“ (Textentwürfe mit den Pflichtwörtern aus VK:61, :79) |
| Handlungsaufforderung | keine Hauptaktion und keine Cream (Cream und Grün im Gerät sind Produktinhalt; Auslegung zu bestätigen); leises Textziel unten links; der Kaufweg liegt im Kopf-Ring „Pakete ansehen“ |
| Funktion im Kaufentscheidungsprozess | S2 Verstehen: eigener Konfigurator unter eigener Domain und eigenem Namen, ohne Programmierauftrag (F-01, F-02, F-08). Hypothese H-E2: Der eigene Name im Gerät macht die Pakete später als Markenstufen derselben Startansicht lesbar |
| Ruhige Fassung | Bildschirm von Anfang an an; Name ohne Überblendung; Feld ohne Einblenden; Rollen zur Absenderzeile ohne Glätten. Ohne JavaScript: Textziel und Feld `hidden`, Bildschirm an, „Fensterbau Brandt“ |
| Schreibtisch | Text Spalten 1–5; rechts die Geräte-Bühne 597 × 660: Browserfenster 560 × 360 mit Adresspille, davor das Telefon 220 × 450, das die linke untere Browser-Ecke zu ≈ 14 % überdeckt; beide Bildschirme gehen gleichzeitig an (ein Träger). Kein wirksames Anheften; `sticky` nur als Sicherung bei 1024 px und 200 % Text (≤ 1,1 BH) |

### Szene FS4 · 02 Ihr Kunde: zwei Griffe im Lichtraum (`fb-04-ihr-kunde`, Stufe 3, T4)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 1.950–2.646 · Eintritt 1.106 · Ruhelage 1.878 · Austritt 2.590 · Bildschirm 3–4 (844 und 664) · Schreibtisch ≈ 1.956–2.396 |
| Sichtbar (Ruhelage) | Kapitelzeile „02 · IHR KUNDE“ (Textentwurf, y 89–105), h2 „So funktioniert es“ einzeilig, grün „funktioniert“ (y 117–151), Lead „Zwei Griffe wie bei Ihrem Kunden. Fotos und Maße kommen dort dazu.“ (Textentwurf, y 163–215), das Gerät oben angeschnitten, sichtbar die unteren 240 px (x 45–345, y 239–479), darin das gerenderte Fenster mit Etikett „BEISPIEL“; der Lichtfleck als Ellipse 360 × 192 hinter und unter dem Gerät (y 359–551); Beschriftungen „ELEMENT“ und „SONNENSCHUTZ“ (y 503–519); zwei Spalten mit je drei Wahlzeilen 171 × 52 (y 527–699): „Fenster“, „Balkontür“, „Hebe-Schiebe-Tür“ · „Ohne“, „Raffstore“, „Weiß ich noch nicht“ mit Unterzeile „für die Klärungsliste“ (Textentwurf); Schlusszeile 15 „Ihr Kunde sieht nur Ihren Betrieb: keine Preise, keine Werbung, keine anderen Betriebe.“ (y 723–767). Voreinstellung „Fenster“ und „Weiß ich noch nicht“ |
| Hauptobjekt | das Fenster im Gerätebildschirm (Render aus der eigenen Bühne, Voreinstellung „Vitrine“); das Fensterglas ist der hellste Wert. Gerät 26 % der Fläche, sichtbares Licht ≈ 10 % |
| Kamera, Komposition | dieselbe Achse und derselbe Gerätebaustein wie in 01, Ausschnitt tiefer (Maske oben 48 px). Im Render: Kamera frontal auf die Elementmitte, lange Brennweite, Licht von oben rechts. Darunter ein symmetrischer Bedienblock in zwei Spalten mit gemeinsamer Mittelkante. Ebenen: Z 0 Grund und Lichtfleck (Cream 12 % → 5 % → 0, Zentrum 24 px über der Geräteunterkante) → Z 20 Gerät mit Render bzw. Bildfolge → Z 30 Bedienblock (nie auf dem Gerät) → Z 40 Kopf. Arbeitslage: Gerät und beide Gruppen umfassen 460 px und stehen bei 844 und 664 zusammen im Bild, die Gruppen im Daumenbereich |
| Bewegung | einmalig, wenn das Gerät zu ≥ 50 % sichtbar ist und beim Aufruf unterhalb lag (844: scrollY ≈ 1.393): das Licht geht an (Deckkraft 0 → Lichtwert, 900 ms). Danach nur Antworten auf Tippen, höchstens zwei Reaktionen je Tipp: die Zeile wechselt den Zustand (150 ms), das Bild blendet über (500 ms `--e-io`), das Licht folgt 50 ms später auf den Lichtwert des neuen Bilds (6–12 %); „Raffstore“: die Bildfolge fährt einmal herunter (30 Bilder, 1,2 s, Lamellen um 12 ms versetzt, eingebacken), das Licht sinkt mit; zurück läuft sie rückwärts; ein Tipp während der Fahrt hält sie an und überblendet in 220 ms zum neuen Ziel. „Ohne“ ↔ „Weiß ich noch nicht“ ändert das Bild nicht (ein offener Sonnenschutz wird in der App nicht gezeichnet). Keine Scrollkopplung |
| Übergang | Das Licht endet hier; es ist der zweite und letzte Lichtort der Seite. Die Wahl wandert unsichtbar weiter: Sie steht in 03 als Karte „Aus Ihrer Probe“ auf dem Aufmaßblatt (Ereignis `vk-probe`). 96 px → „03 · IHR POSTFACH“ |
| Informationshierarchie | 1 Fensterglas im Gerät · 2 die zwei gewählten Zeilen (Füllung `--surface3`, innere 2-px-Kontur `--text`, 700) · 3 Unterzeile „für die Klärungsliste“ · 4 Schlusszeile |
| Handlungsaufforderung | keine, keine Cream; der Kopf-Ring „Pakete ansehen“ bleibt einen Tipp entfernt |
| Funktion im Kaufentscheidungsprozess | S3 Sehen: „Wie sieht das für meinen Kunden aus, und taugt das?“ (F-34 teilweise, F-10). Das verkaufte Produkt beweist sich selbst, ohne Stimmen oder Siegel. Hypothesen H-E1, H-04-1 bis H-04-4 |
| Ruhige Fassung | Licht steht; Bildwechsel 120 ms oder Schnitt; Raffstore als Schnitt aufs Endbild (120 ms), Licht sofort; die Bedienung bleibt. Ohne JavaScript: zwei Standbilder „Fenster, ohne Sonnenschutz“ und „Dasselbe Fenster mit Raffstore“ (Textentwurf), Gruppen `hidden` |
| Schreibtisch | Split 5 : 7: Gruppen links (Zeilen 197,5 × 52), Gerät 320 × 448 rechts (sichtbar unten 320), Geräteunterkante und letzte Wahlzeile auf einer Bodenlinie; ≈ 440 px, ganz in einem Bildschirm, nicht angeheftet |
| Material, Auslegung | Materialprobe der Bildfolgen aus `buehne.js` in „Vitrine“ (sechs Standbilder, drei Folgen; Mindestumfang „Fenster“); bis dahin Aufnahmen des CSS-Modells ohne Bildfolge. Auslegung „Bildfolge auf Tippen = Antwort, keine zweite inszenierende Signature“ zu bestätigen, sonst immer Überblendung |

### Szene FS5 · 03 Ihr Postfach: das Blatt deckt den Einzeiler, die Schichten lösen sich (`fb-05-ihr-postfach`, Stufe 3, T5)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 2.742–3.776 · Eintritt 1.898 · Auftritt bei scrollY ≈ 2.446 · Ruhelage 2.670 · Explosion ≈ 2.585 → 2.796 · Austritt 3.720 · Bildschirm 4–5 (844), 5–6 (664) · Schreibtisch ≈ 2.524–3.284 |
| Sichtbar (Endzustand, Blattmitte bei 45 % der Höhe, scrollY ≈ 2.796) | oben der Lead „Statt eines Einzeilers: Maße, Fotos und Wünsche je Position, mit Klärungsliste.“ (Textentwurf); die Szene über die volle Spalte (y ≈ 145–613): rechts oben die Einzeiler-Karte 242 × 150 mit „KONTAKTFORMULAR“, „Beispiel“ und „Was kosten 5 neue Fenster?“ (Textentwurf), davor das Blatt 256 × 243 um −2° gedreht, dahinter nach oben und rechts versetzt zwei Bänder (Schicht „Fotos“, Schicht „Klärung“); links an x 16 die Beschriftungen „KLÄRUNG“, „FOTOS“, „MASSE“ mit 1-px-Führungslinien und Klammer; auf der Blattunterkante die Karte „Aus Ihrer Probe“ 236 × 96 (ohne Tipp in 02: „PROBE · BEISPIEL“, „Balkontür“, Kästchen „Sonnenschutz: zu klären“, Textentwurf); darunter der Dateiname „Aufmass-P-BEISPIEL-Familie-Weber.pdf“; unten die erste Begriffszeile. Grund mit Messraster (fein 8, kräftig 40 px, ≤ 1,3 : 1, unter Text ausgeblendet) |
| Hauptobjekt | das echte Aufmaßblatt aus dem eigenen PDF-Code (Seite 1, „Fensterbau Brandt“ / „Familie Weber“, Nr. P-BEISPIEL), 19 % der Bildschirmfläche; Papierweiß ist die einzige große Hellfläche (≈ 18 : 1 zum Grund) |
| Kamera, Komposition | Aufsicht auf einen Papierstapel, frontal, Drehung nur in der Ebene, keine Kippung. Kleiner Split: Beschriftungsspalte links an x 16, Stapel rechts, schwer nach rechts oben. Ebenen: Z 0 Grund mit Raster → Z 5 Einzeiler → Z 20 Schicht „Klärung“, Schicht „Fotos“, Blatt (6 % bzw. 12 % fest abgedunkelt) → Z 25 Karte (Begleitschatten nur auf Papier, K-25) und Führungslinien → Z 30 Beschriftungen, Dateiname, Bedienschicht → Z 40 Kopf. Das Blatt verdeckt den Einzeiler vor der Explosion zu ≈ 25 %, danach zu ≈ 57 %; dessen Satz bleibt ganz lesbar. Endzustand: Szene ≈ 40 % Bild, Text ≈ 12 %, frei ≈ 48 % |
| Bewegung | ein Träger in drei Phasen, nie gleichzeitig. (a) Auftritt: Erreicht die Blattoberkante 72 % der Bildhöhe (844: scrollY ≈ 2.446), blenden Stapel und Karte ein (Deckkraft 0 → 1, `translateY` −24 → 0 aus der Lichtrichtung, 600 ms `--e-out`); bis dahin steht der Einzeiler allein. (b) Explosion, scrollgeführt ohne Anheften: Wandert die Blattmitte von 70 % auf 45 % der Höhe (≈ 210 px Scrollweg), lösen sich die Schichten (+3,6 % / −10 % und +7,2 % / −20 % der eigenen Größe) mit gestaffelter Trägheit (τ = 140 / 200 ms), nur vorwärts; ruht das Scrollen 200 ms bei p ≥ 0,35, läuft sie zu Ende (≈ 600 ms). (c) Annotation: Steht die hintere Schicht bei ≥ 98 %, erscheinen die Beschriftungen (160 ms), die Linien zeichnen sich je 60 ms versetzt (320 ms). Rückwärts geschieht nichts, der Stapel bleibt offen. Eine Wahl in 02 wechselt nur den Text der Karte (220 ms) |
| Übergang | Textziel „Wie sehr soll es Ihre Marke tragen?“ (Textentwurf) → `#pakete`; sonst 96 px Grund → „04 · IHRE MARKE“. Der Kopf des Blatts („übermittelt mit eeziframes“) kehrt in den Datenblattzeilen der Karten wieder („HINWEIS AUF EEZIFRAMES“). Ab hier trägt kein Abschnitt mehr eigenes Licht oder eine scrollgekoppelte Szene außer dem Zustand der Ablauf-Marken |
| Informationshierarchie | h2 „Was in jeder Anfrage steht“ (grün „Anfrage“) → der Einzeiler allein → das Blatt erscheint darüber → die Bänder steigen hinter dem Blatt auf → Beschriftungen → Karte → Dateiname → Begriffe (sieben Titel; Sätze im Umschalter „Alle Angaben im Einzelnen“, Textentwurf) → Zeile zum Feinaufmaß → Textziel. Das Vorher-Nachher entsteht in der Zeit, ohne zweite Spalte |
| Handlungsaufforderung | keine Cream; Textziel unten links im Daumenbereich; Kopf-Ring „Pakete ansehen“ |
| Funktion im Kaufentscheidungsprozess | S3 Produktbeweis am Ergebnis: „Was landet bei mir im Postfach, und reicht das fürs Angebot?“ (F-15), dazu die Haftungsfrage (F-09) über die Zeile zum Feinaufmaß. Hypothese DG-H-5: Wer die Anfragen für brauchbar hält, bewertet die Pakete als Preis eines Werkzeugs |
| Ruhige Fassung | Endbild ab dem ersten Bild: Schichten offen, Beschriftungen und Linien sichtbar, kein Auftritt; der Kartentext wechselt ohne Überblendung. Ohne JavaScript dasselbe Endbild aus CSS, alle sieben Sätze sichtbar, Karte mit Beispielwerten |
| Schreibtisch | Liste links Spalten 1–5, Szene rechts Spalten 6–12 (Blatt 400 × 379, Einzeiler 300 × 200, Karte 280 × 100); ohne Anheften (ZA Festlegung 8); Auftritt und Explosion nach denselben Schwellen in 800 px Höhe |

### Szene FS6 · 04.1 Ihre Marke: Namensleiste und Wischreihe (`fb-06-pakete-karten`, Stufe 2, T7)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 3.872–5.008 (1,35 BH) · Eintritt 3.028 · Ruhelage = Sprungziel `#pakete` 3.800 · Austritt 4.952 · Haarlinie in Bildschirm 5 (844), h2 in Bildschirm 6 (664) · Schreibtisch 3.417–≈ 5.042 |
| Sichtbar (nach dem Sprung; bis zum Knopf auch bei 664) | Kopf ohne Ring; Haarlinie y 72, Kapitelzeile „04 · IHRE MARKE“ (Textentwurf, y 88–104), h2 „Die Pakete“ (grün „Pakete“, y 116–150), Lead 17 dreizeilig „Ein Konfigurator, drei Stufen Ihrer Marke. In allen: eigene Domain, jede Anfrage als PDF, keine Gebühr je Anfrage.“ (Textentwurf, y 162–240); Namensleiste 358 × 52 (y 255–307) mit drei Segmenten „Essential · 29 €“, „Essential Plus · 39 €“, „Signature · 64 €“, der Zeiger auf Plus; Pille „Empfohlen“ als Cream-Kontur auf dem Kartenrand (y 317–345); die Karte Essential Plus 310 breit ab y 331 mit Ring in Cream, die Nachbarn je 28 px angeschnitten (Deckkraft 0,66); in der Karte „EEZI Essential Plus“ 17/700, „Wenn“-Satz zweizeilig „Wenn Ihre Kunden Ihr Logo, Ihre Farbe und Ihre Fotos sehen sollen.“ (Textentwurf), „39 €“ 32/800 mit „im Monat“, „ab Livegang, monatlich kündbar“ (Textentwurf), „199 € Einrichtung, einmalig vorab: Anruf, Domain, Gestaltung, Vorschau“ (Textentwurf), Steuerzeile „netto zzgl. MwSt. · nur für Unternehmer“, Cream-Knopf 270 × 52 „Essential Plus anfragen“ (y 599–651); bei 844 darunter die Browserleiste und 177 von 254 px des Beispielbilds |
| Hauptobjekt | je Karte das Beispielbild im Browserrahmen (Bildfenster 306 × 230; Startansicht des Beispielbetriebs „Fensterbau Brandt“ in der Markenstufe des Pakets, Adresspille „ihr-name-fenster.de · Beispiel“). Die Headline-Stufe der Ansicht trägt der Monatspreis 32 („Zahl als Held“); das Bild ist mit 254 px das 27-Fache der Versalhöhe der Bedienschrift |
| Kamera, Komposition | frontal und flach (Dialekt C), keine Perspektive, kein Licht. Die Karte sitzt durch das Einrasten mittig, die Reihe bricht über beide Ränder; das Bild liegt unter dem Kartenring (Ring als Ebene darüber). Ebenen: Z 0 Grund → Z 20 Browserleiste und Bildfenster (Bildebene 354 × 230 mit 24 px Rand je Seite für den Nachlauf) → Z 25 Leitlinien und Marker des Datenblatts → Z 30 Karte, Text, Pille, Namensleiste, Knopf → Z 40 Kopf. In der Karte: Preisblock mit Knopf ≈ 36 %, Bild 29 %, Datenblatt 29 %. Erster Bildschirm nach dem Sprung: Bild ≈ 16 %, Text und Bedienung ≈ 34 %, ruhig ≈ 50 % |
| Bewegung | beim Scrollen nichts (kein Auftritt, kein Wisch-Hinweis, kein Einlauf der Reihe). Nur nutzergeführt: Die Karte folgt dem Finger 1 : 1 und rastet mittig ein (`scroll-snap`, ohne Überschwingen), die Nachbarn wechseln über Deckkraft (1 → 0,66); die Bildebenen aller drei Karten laufen entgegen der Wischrichtung nach (x* = clamp(8 · v, −24, 24) px) und kehren als Feder zurück (ζ = 0,75, 2 Hz, Überschwingen ≈ 2,8 %, Einschwingen ≈ 420 ms; K-37), die Leitlinien wandern mit; der Zeiger der Namensleiste folgt 1 : 1. Tipp auf ein Segment: Die Reihe rollt waagerecht glatt zur Karte, die Seite bleibt stehen (navigiert, wählt nicht). „Leistungen ansehen“: Listen aller drei Karten öffnen, Inhalt 220 ms. Druck auf den Kartenknopf: Füllung `--primary-druck`, sofort, ohne Skalierung |
| Übergang | 24 px unter der Kartenunterkante folgt der Verkaufsstand (FS7), ohne Bühne dazwischen. Kopf-Ring: ausgeblendet, solange Namensleiste oder Kartenreihe das Band vom Kopf bis 60 % der Höhe schneidet (844: scrollY ≈ 3.549–4.952); danach in Zustand A „Paket anfragen“ → `#frage`, in Zustand B wieder „Pakete ansehen“. Kartenknopf in Zustand A → glattes Rollen ins Formular (FS9). Zustand B: „… bestellen“ → `/partner/#bestellen/<paket>` im selben Tab; die Seite blendet über (220 ms), das getippte Beispielbild gleitet als einziges gemeinsames Element in die Miniatur von Schritt 1 (320 ms) [H, J-H10], nur wo View Transitions zwischen Dokumenten unterstützt werden |
| Informationshierarchie | h2 mit grünem Wort → Namensleiste (drei Preise als Band) → Pille und Cream-Ring → „39 €“ → Bindung, Einrichtung → Cream-Knopf → Oberkante des Bilds → Anschnitt der Nachbarn (Wisch-Hinweis ohne Bewegung) → Datenblatt (GESTALTUNG, HINWEIS AUF EEZIFRAMES, IN SUCHMASCHINEN, FÜR IHR TEAM) |
| Handlungsaufforderung | eine Cream: der Knopf der empfohlenen Karte, nach einem Tipp auf einen Kartenknopf der des gewählten Pakets (J-AB-8); Nachbarn mit Ring; der Kopf-Ring ist ausgeblendet |
| Funktion im Kaufentscheidungsprozess | S4 Bewerten: Monats- und Einmalpreis, Markenstufe als Bild, eine Karte vom Namen bis zum Knopf. Paketwahl heißt Tipp auf einen Kartenknopf (E-3). Z1+ über den „Wenn“-Satz, die Team-Zeile mit „nicht enthalten“ bei Essential und Plus und das Bild der höheren Stufe direkt nebenan (J-H11 bis J-H16) |
| Ruhige Fassung | kein Nachlauf des Bilds (keine Feder); Wischen bleibt nativ, der Zeiger folgt; Tipp auf ein Segment ohne Glätten; Listen sofort; Kopf-Ring ohne Übergang. Ohne JavaScript: Reihe nativ wischbar (wo unterstützt Start an Plus), Listen offen, Knöpfe springen zu `#bestellen` |
| Schreibtisch | drei Karten nebeneinander (je 330,7 px, `subgrid`), Preise und Knöpfe y 324–534, alle drei Bilder bis y 794 im ersten Bildschirm nach dem Sprung, Leistungslisten offen; keine Namensleiste, kein Wischen; Hover: Kartenring `--muted`, eine Datenblattzeile hebt ihre Marke im Bild von 40 auf 100 % |
| Material | Beispielbilder je Markenstufe per Skript aus `web/assets/einladung.js`, Monogramm „Beispiel“ statt eines erfundenen Logos; Fotos des Beispielbetriebs beim Inhaber anzufragen; bis dahin Skizzen, die Nachlauf und Leitlinien schon zeigen |

### Szene FS7 · 04.2 Verkaufsstand und Vergleich (`fb-07-entscheidungshilfe-vergleich`, Stufe 1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 5.008–5.154 zugeklappt (0,17 BH; aufgeklappt ≈ 1.810 px statt 146) · Eintritt 4.164 · Austritt 5.098 · Bildschirm 6–7 (844), 8 (664) · Schreibtisch ≈ 5.042–5.187 |
| Sichtbar | oben das Kartenende (Datenblatt, „Leistungen ansehen“); 24 px darunter der Verkaufsstand 15 zweizeilig „**Vorläufige Preise.** Preisstand 22. Oktober 2026. Es gilt der Preis, den Sie beim Bestellen sehen.“ (Textentwurf, nur solange `VORLAEUFIG`); 24 px tiefer zwischen zwei Haarlinien die Zeile „Alle Merkmale im Vergleich“ 17/700 mit „+“ aus zwei 2-px-Strichen rechts (52 px); 48 px darunter beginnt der Festblock. Bei 664 stehen Kartenende, Block und Festblock-Anfang zugleich im Bild |
| Hauptobjekt | keines (Text- und Arbeitsfläche nach DG-E-1 C); Blickziel ist die Zusammenfassung |
| Kamera, Komposition | flach, linksbündig an x 16. Aufgeklappt eine Tabelle direkt auf dem Grund: klebender Kopf aus drei Kurznamen (116 × 44, deckungsgleich mit den Segmenten der Namensleiste) bei `top: 56px`, je Zeile der Titel über die volle Breite und drei Werte darunter, sieben Gruppen, kein Querscrollen. Ebenen Z 0 → Z 30 (Tabellenkopf eine Stufe über den Zeilen) → Z 40 |
| Bewegung | keine beim Scrollen; Öffnen: Höhe sofort, Inhalt Deckkraft 220 ms, „+“ wird „–“ (senkrechter Strich 150 ms, ohne Drehen); geöffnet klebt der Tabellenkopf |
| Übergang | untere Haarlinie → 48 px Grund → Titel „VERTRAG UND KÜNDIGUNG“ in derselben Technikstimme → grüne Haken (FS8) |
| Informationshierarchie | Zusammenfassung → „Vorläufige Preise.“ → Haken des Festblocks; geöffnet: Kopf → Gruppenkopf → Titel → Werte, „nicht enthalten“ grau gegen helle Werte |
| Handlungsaufforderung | keine im Block; der Kopf-Ring „Paket anfragen“ (Zustand A) erscheint wieder, sobald die Kartenreihe das Band verlassen hat |
| Funktion im Kaufentscheidungsprozess | S4 bei unsicherer Präferenz (F-23, F-24, F-26); der Preisvorbehalt steht ehrlich und kleiner als jeder Preis (J-R18). Die frühere Entscheidungshilfe in drei Zeilen entfällt, ihr Inhalt steht als „Wenn“-Satz in jeder Karte (Festlegung 10-1) |
| Ruhige Fassung | Öffnen sofort, ohne Einblenden. Ohne JavaScript `details` nativ, Kopf klebt per CSS |
| Schreibtisch | Verkaufsstand Spalten 1–8, Zeile über 1–12, vierspaltige Tabelle mit 44-px-Zeilen, Kopf klebt bei 64 |

### Szene FS8 · 04.3 Festblock und Gesprächsweg (`fb-08-festblock-gespraechsweg`, Stufe 1, T6)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 5.154–5.712 · Eintritt 4.310 · Austritt 5.656 · Bildschirm 7 (844), 8–9 (664) · Schreibtisch ≈ 5.187–5.597 |
| Sichtbar | Titel „VERTRAG UND KÜNDIGUNG“ 13 (Textentwurf); fünf Zeilen 15 mit grünem Haken (Haken auf x 16, Text ab x 48), zeitlich geordnet: „Vertrag erst mit Eingang Ihrer Zahlung.“ · „Bis zum Beginn der Einrichtung stornieren Sie mit voller Erstattung.“ und direkt darunter, ohne Haken in `--text2`, die Grenze „Danach wird die Einrichtungsgebühr nicht erstattet.“ · „Live erst mit Ihrer Freigabe der Vorschau.“ · „Monatsabo erst ab dem Livegang.“ · „Monatlich kündbar, ohne Mindestlaufzeit.“ (alle Textentwurf); Link 44 px „Paketbedingungen mit AV-Vertrag“ mit Standzeile 13 „Entwurf zur anwaltlichen Prüfung · Fassung vom 23. Oktober 2026“; Frage „Unsicher, welches Paket passt?“ und Ring 52 „Rückruf oder Nachricht“ (Textentwurf; „Frage stellen“, falls der Inhaber keinen Rückruf bestätigt); Rechtshinweis 13 dreizeilig. Bei 664 steht der ganze Block in einem Bildschirm |
| Hauptobjekt | keines; typografischer Anker ist die senkrechte Reihe der fünf grünen Haken an der linken Kante, der einzige Farbreiz |
| Kamera, Komposition | flacher Stapel mit einer eingerückten Zweitlinie (x 48); keine Kartenfläche; zwei Ebenen plus Kopf; Freiraum rechts der kurzen Zeilen ≈ 50 % |
| Bewegung | keine; Zustände am Ring (Kontur `--muted` → `--text`, Druck Füllung `--surface2`) und am Link |
| Übergang | Rechtshinweis → 96 px → „05 · IHRE ANFRAGE“: Wer weiterscrollt, kommt ohne Sprung ans selbe Ziel wie mit dem Ring. Ring: setzt das Paket auf „Noch offen“ und springt zu `#frage` |
| Informationshierarchie | Titel → Zeile 1 → Bruch im Hakenrhythmus an der Grenze (gewollt) → Zeilen 3–5 → Link → Frage → Ring → Rechtshinweis |
| Handlungsaufforderung | Ring als leiser zweiter Weg (W4); keine Cream (sie gehört dem Kartenknopf darüber und „Frage senden“ darunter) |
| Funktion im Kaufentscheidungsprozess | S5-Kern Absichern am Ort der Entscheidung (RE R8): Preis → Risiko → Handlung ohne Umweg; Gespräch statt Entscheidung für Unsichere (H-D14) |
| Ruhige Fassung | identisch, denn nichts bewegt sich; der eingebettete Sprung des Rings ist sofort. Ohne JavaScript steht alles, der Ring springt nativ |
| Schreibtisch | Festblock Spalten 1–6 mit Paragrafenspalte in 7 [H], Gesprächsweg Spalten 9–12 oben bündig mit dem Titel (das „oder“ auf einen Blick), Rechtshinweis Spalten 1–8; ≈ 410 px |

### Szene FS9 · 05 Ihre Anfrage (`fb-09-anfrage`, Stufe 1, T10)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 5.808–6.972, h3 `#frage` bei 6.041 · Eintritt 4.964 · Ruhelage 5.736 · Sprungziel `#frage` scrollY 5.969 · Austritt 6.916 · Bildschirm 7–9 (844; h3 in 8), 9–11 (664; h3 in 10) · Schreibtisch ≈ 5.725–6.445 |
| Sichtbar (nach dem Kartenknopf, scrollY 5.969) | h3 „Paket unverbindlich anfragen“ bei y 72; darunter „Paket“ mit dem gewählten Paket und dem Hinweis „bei den Paketen gewählt“ (Textentwurf, y 88–197); „Ihr Name“, „Firma (freiwillig)“ (nur vorbefüllt, wenn in 01 eingegeben, mit „aus Ihrer Vorschau übernommen“ und „entfernen“, Textentwurf), „E-Mail“, „Telefon für Rückruf (freiwillig)“ (Textentwurf), „Ihre Frage oder Ihr Wunsch“ (Feld 120 px), Datenschutzsatz; die Cream „Frage senden“ 358 × 52 liegt bei 844 knapp unter der Kante und kommt beim Ausfüllen ins Bild. Wer von oben scrollt, sieht zuerst Haarlinie, „05 · IHRE ANFRAGE“ (Textentwurf), h2 „Bestellen oder anfragen“ (grün „anfragen“) und den Lead „Bestellen können Sie in Kürze. Bis dahin fragen Sie unverbindlich an; wir antworten in der Regel innerhalb eines Werktags.“ (Textentwurf; Werktag ungemessen) |
| Hauptobjekt | keines (Arbeitsfläche); einziger Hellwert ist die Cream (≈ 5,7 % der Fläche) |
| Kamera, Komposition | flache Feldsäule an x 16, Felder 358 × 52 mit Beschriftung 15/700 darüber; kein Kasten, kein Bild, kein Licht; zwei Ebenen plus Kopf; Text ≈ 30 %, Felder und Knöpfe ≈ 30 %, frei ≈ 40 % |
| Bewegung | beim Scrollen nichts. Ankunft vom Kartenknopf: glattes Rollen (K-10 erlaubt es, weil zwischen Karte und Formular keine scrollgekoppelte Szene liegt; ≈ 2,6 BH), Paket gesetzt, Hinweis blendet 220 ms ein, Fokus auf die h3, Ansage „EEZI Essential Plus ausgewählt“. Vom A4-Zeilenknopf, vom Kopf-Ring und vom Gesprächsweg sofortiger Sprung (12.3). Rückmeldungen 150 / 220 ms; Fehler: Rand 2 px `--bad`, Satz am Feld, Fokus auf das erste fehlerhafte Feld, kein Rütteln; Senden: ab 300 ms dreht im Pfeilkreis ein 2-px-Ring (1,2 s je Umdrehung) |
| Übergang | Senden → FS10 (Dank am selben Ort). Weiterscrollen: Steht die Cream in der Bildschirmmitte, schneiden Haarlinie und Kapitelzeile von 06.1 unten ≈ 11 % an |
| Informationshierarchie | grüne „05“ (erster Farbpunkt nach dem ruhigen Festblock) → h2 → Lead → h3 → Paket → Feldsäule → Datenschutzsatz → Cream → Anbieterzeile „Es antwortet eeziframes, Patrick Kies, Herzebrock-Clarholz“ (Textentwurf) mit `ask@eeziframes.com` |
| Handlungsaufforderung | Cream „Frage senden“ über die volle Spaltenbreite, im Daumenbereich; der Kopf-Ring ist ausgeblendet, solange mindestens 120 px von 05 im Bild sind |
| Funktion im Kaufentscheidungsprozess | S6 Handeln. Zustand A: Z1a, unverbindlich anfragen. Zustand B: Block „Für die Bestellung brauchen Sie:“ mit drei Haken (Textentwurf), Link „Schon bestellt? Zum Kundenkonto“, das Formular eingeklappt hinter „Vorher eine Frage?“ (Ring ≈ 205 × 52); „Frage senden“ bleibt Cream, weil in 05 keine Bestell-Pille steht. Hypothese H-E6: Das Formular direkt nach den Paketen schadet Unentschlossenen nicht (Rückfall: Formular nach 06) |
| Ruhige Fassung | Hinweise ohne Einblenden; Sprünge und Rollen ohne Glätten; der Wartering steht. Ohne JavaScript: normales Absenden, Dankesseite des Servers |
| Schreibtisch | Hinweis links Spalten 1–5, Formular rechts Spalten 6–12, Felder zweispaltig, Cream nach Inhalt (≈ 190 × 52); nach dem Sprung steht alles bis zur Anbieterzeile im 800-px-Bildschirm |

### Szene FS10 · Dank: die Zielhandlung ist erreicht (`fb-09-anfrage`, Zustand „gesendet“)

| Feld | Inhalt |
|---|---|
| Scrollbereich | am Ort des Sprungziels `#frage` (Telefon y 72, Schreibtisch y 124); Bildschirm 8 (844), 10 (664) |
| Sichtbar | „Danke, Ihre Frage ist da.“ und „Wir melden uns in der Regel innerhalb eines Werktags und sagen Bescheid, sobald Sie bestellen können.“ (zweiter Satz Textentwurf), davor der grüne Haken; Ring „Zurück zu den Paketen“, Link „Paketbedingungen“; darunter bleibt die Anbieterzeile stehen |
| Hauptobjekt | der Haken als kleine Bildschicht im Dank |
| Kamera, Komposition | unverändert flach an x 16 |
| Bewegung | h3 und Formular blenden aus (165 ms `--e-io`); solange nichts zu sehen ist, springt die Seite so, dass der Dank am Sprungziel steht; der Dank blendet ein (220 ms), danach läuft der Haken einmal (Lottie, 1,3 s). Liest sich als ruhige Überblendung. Ereignis `vk:gesendet`: Der Kopf-Ring zeigt für den Rest des Aufrufs wieder „Pakete ansehen“, der Abschluss A4 zeigt statt der Zeilen den Dank |
| Übergang | Ring → `#pakete` (sofort); sonst weiter zu 06.1 |
| Informationshierarchie | Haken → Satz → Ring |
| Handlungsaufforderung | bewusst keine weitere Aufforderung; nur der Rückweg |
| Funktion im Kaufentscheidungsprozess | S7 Bestätigung; Z1a erreicht. Der Satz sagt, wer sich wann meldet |
| Ruhige Fassung | Schnitt statt Überblendung, der Haken als Endbild. Ohne JavaScript die Dankesseite des Servers |

### Szene FS11 · 06.1 Ihr Start: der Ablauf als Maßstab (`fb-10-ablauf`, Stufe 2, T8)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 7.068–7.957 · Eintritt 6.224 · Ruhelage 6.996 · Austritt 7.901 · Marken schalten bei scrollY ≈ 6.904 (01), 7.008, 7.160, 7.264, 7.336, 7.440 (06) · Bildschirm 9–10 (844), 11–12 (664) · Schreibtisch ≈ 6.573–7.257 |
| Sichtbar (Ruhelage) | Kapitelzeile „06 · IHR START“ (Textentwurf), h2 „Von der Bestellung bis zum Livegang“ zweizeilig (grün „Livegang“), Kennzahl „3 bis 5 Werktage“ 32/34, Begleitsatz 15 „Meist, nach der Zahlung. Es hängt vor allem an der Domain und an Ihrer Freigabe.“ (Textentwurf); darunter der senkrechte Maßstab (x 16–48, 640 px) und an der Zweitlinie x 56 die Schritte 01 bis 05 samt Fakt: „Bestellt“, „Bezahlt“, die Grenzlinie mit „§ 7 (2)“, „In Einrichtung“, „Domain gesichert“, „Zur Freigabe“ |
| Hauptobjekt | der Maßstab: Achse 1 px, Feinstriche alle 8 px, kräftige alle 40 px, sechs Marken 14 × 2 px, Ziffern 01–06 in der Technikstimme mit Aussparung wie die Zahl auf einem Zollstock, Endzeichen 45°; zwischen 02 und 03 die Strich-Punkt-Grenzlinie. Anker ist die Kennzahl, die einzige große Zahl der zweiten Seitenhälfte |
| Kamera, Komposition | flach; Ordnungslinie x 16, Schritte an der eingerückten Zweitlinie; der Maßstab trägt 72 % der Abschnittshöhe bei ≈ 7 % der Fläche; ≈ 38 % Text, ≈ 55 % frei |
| Bewegung | Zustand statt Bewegung: Passiert die Mitte einer Wortzeile abwärts die Bildschirmmitte, werden Marke und Ziffer grün (220 ms `--e-out`), aufwärts wieder neutral (165 ms `--e-in`). Nach einem Sprung oder Neuaufbau steht der Zustand sofort. Kein wachsender Strich, keine Kopplung von Längen |
| Übergang | Erreicht Schritt 06 die Mitte, erscheint unten die Haarlinie von 06.2; das untere Endzeichen schließt die Maßkette. 06.2 trägt keine eigene Nummer |
| Informationshierarchie | h2 → Kennzahl → Begleitsatz → Wort 01 → Fakten mit Haken → Grenzlinie („Bis hierhin: Storno mit voller Erstattung.“ / „Ab hier: keine Erstattung der Einrichtung.“, Textentwurf) → Wörter 03–06. Wer überfliegt, liest die sechs Statuswörter und die Haken-Zeilen |
| Handlungsaufforderung | keine im Abschnitt; der Kopf-Ring „Paket anfragen“ (Zustand A) oben rechts; die Fundstelle „§ 7 (2)“ als leiser Prüfweg |
| Funktion im Kaufentscheidungsprozess | S5 Absichern: Aufwand (fette „Sie“ und „Wir“), Dauer, Rücktrittsgrenze (F-19, F-07); dieselben sechs Wörter sieht der Betrieb später im Kundenkonto (S8) |
| Ruhige Fassung | alle Marken erreicht (grün), ohne Übergang. Ohne JavaScript ebenso (CSS-Standard) |
| Schreibtisch | Split 5 : 7, Kennzahl 40/42 links, Maßstab rechts ab Höhe der h2; der ganze Abschnitt steht in einem Bildschirm (≈ 684 px) |

### Szene FS12 · 06.2 Ihre Kunden bleiben Ihre Kunden (`fb-11-kundenschutz`, Stufe 2, T6)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 8.053–8.812 · Eintritt 7.209 · Ruhelage (Menü-Sprung) 7.981 · Austritt 8.756 · Haken ab scrollY ≈ 7.427 · Bildschirm 10–11 (844), 13–14 (664) · Schreibtisch ≈ 7.385–7.917 |
| Sichtbar (Ruhelage; der ganze Abschnitt in einem Bildschirm bei 844) | h2 „Ihre Kunden bleiben Ihre Kunden“ zweizeilig (wörtlich, ohne grünes Wort); Ankerkachel 358 × 170 mit Medaillon ⌀ 40 in `--accent-soft` und Haken, „Nur Ihr Betrieb:“ 17/700, Satz 17 dreizeilig; drei Kacheln (358 × 102, 124, 146) mit „Nur an Sie:“, „In Ihrem Auftrag:“, „Kein Weiterverkauf:“ (der Zusatz zu den Unterauftragnehmern ist Textentwurf); Link „Zugesagt in den Paketbedingungen, § 10“ (Textentwurf) |
| Hauptobjekt | die Ankerkachel; das Medaillon ist die einzige grüne Fläche des Abschnitts |
| Kamera, Komposition | flach, alle Kacheln an x 16 untereinander, Fuge 12; kein Bild, kein Licht, keine Verdeckung |
| Bewegung | Ist eine Kachel zu ≥ 60 % im Bild, wird ihr Haken einmal gezogen (Abdeckung `scaleX` 1 → 0, Ursprung rechts); Warteschlange in Lesefolge, nie zwei zugleich; je 320 ms nach K-4 (12.9), zusammen ≤ 1,3 s. Kein Auftritt der Kacheln |
| Übergang | Link links unten → 96 px → Haarlinie der Anhänge an derselben Ordnungslinie |
| Informationshierarchie | h2 → Ankerkachel (Medaillon, Haken als einzige Bewegung) → Kennwörter → Sätze → Link |
| Handlungsaufforderung | keine; Kopf-Ring; der Link als Weg zum Beleg |
| Funktion im Kaufentscheidungsprozess | S5 Vertrauen in den Anbieter (F-11, F-10) mit dem, was vertraglich zugesagt ist (PB § 10); „Zusage“, nie „Garantie“ |
| Ruhige Fassung | Haken stehen, keine Abdeckung. Ohne JavaScript ebenso |
| Schreibtisch | h2 links Spalten 1–5, Kacheln rechts gestapelt Spalten 6–12, Link auf der Bodenlinie der letzten Kachel; ganz in einem Bildschirm (532 px) |

### Szene FS13 · Anhänge: Live-Demos, Häufige Fragen, Hintergrund (`fb-12`, `fb-13`, `fb-14`, Stufe 1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | A1 8.908–9.126 · A2 9.222–9.898 · A3 9.994–10.234 · zusammen scrollY ≈ 8.064 (Eintritt) bis 10.178 (Austritt) · Bildschirm 11–13 (844), 14–16 (664) · Schreibtisch ≈ 8.045–9.279 |
| Sichtbar | drei gleich gebaute ruhige Blöcke an x 16, je Haarlinie ohne Nummer → h2. A1 „Live-Demos“ (grün „Demos“); in Zustand A ein Satz dreizeilig mit fettem Schluss „Unter Ihrer Domain: Ihr Name, keine Preise.“ und ein Ring ≈ 290 × 52 „App für Hauseigentümer“ mit ↗ (beides Textentwurf; öffnet einen neuen Tab); mit `PAKETE_DEMOS` drei Zeilen à 56 px mit Miniatur 48 × 36. A2 „Häufige Fragen“ (grün „Fragen“): acht Zeilen 52 bzw. 74 px zwischen Haarlinien, „+“ rechts, darunter der Weiterweg „Ihre Frage ist nicht dabei? Fragen Sie uns“ (Textentwurf). A3 „Hintergrund“ (Textentwurf): drei zugeklappte Zeilen „Zahlen zum Handwerk“, „Quellen“, „Wissen für Fensterbauer“ |
| Hauptobjekt | keines; Typografie und Haarlinien (mit Demos: drei Miniaturen als einzige Bildreize) |
| Kamera, Komposition | Zeilenlisten (Muster K6), flach, Textzeilen ≈ 35 %, frei ≈ 65 % |
| Bewegung | keine beim Scrollen; eine Frage öffnen: Höhe sofort, Antwort Deckkraft 220 ms, „+“ wird „–“ (150 ms), das Zeichen wird offen grün. Ein Sprung auf `#hf-…` öffnet die Frage |
| Übergang | nach A3 96 px → A4 |
| Informationshierarchie | je Block h2 → Zeilenanfänge („Was kostet …“, „Brauche ich …“) → Zeichen → offen das fette „Ja.“, „Nein.“, „Sie.“ |
| Handlungsaufforderung | Ring in A1 (Nebenweg, neuer Tab), Weiterweg in A2 (→ `#frage`, Paket „Noch offen“); keine Cream; Kopf-Ring |
| Funktion im Kaufentscheidungsprozess | U1 Probieren (F-22), S5 Restzweifel (F-02, F-04, F-05, F-06, F-09, F-10, F-16, F-25, F-31), Prüfbarkeit (R7); die Zahlen mit Quellen bleiben für Suchmaschinen und KI-Zitate auf der Seite |
| Ruhige Fassung | Öffnen ohne Einblenden. Ohne JavaScript `details` nativ, Links |
| Schreibtisch | h2 links Spalten 1–5, Listen rechts Spalten 6–12; die rechten Spalten fluchten über alle Anhänge |

### Szene FS14 · A4 Abschluss: die kompakte Paketwahl (`fb-15-abschluss`, Stufe 2, T11)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 10.330–10.755 · Eintritt 9.486 · Ruhestand scrollY ≈ 10.030 (Haarlinie bei y ≈ 300) · Austritt 10.699 · Bildschirm 13 (844), 16–17 (664) · Schreibtisch ≈ 9.407–9.899 |
| Sichtbar (Ruhestand) | Haarlinie (y ≈ 300), h2 „Aus der Probe wird Ihr Konfigurator.“ (Textentwurf, grün „Konfigurator“), Lead „Paket wählen und unverbindlich anfragen.“ (Textentwurf), Spaltenköpfe „BEISPIEL“ und „IM MONAT“; links die Vorschau 96 × 192 (y ≈ 478–670), rechts drei Zeilenknöpfe 250 × 56: „Essential 29 € / 99 € einmalig“, „Essential Plus 39 € / Empfohlen / 199 € einmalig“, „Signature 64 € / 279 € einmalig“ (Zählwort „einmalig“ Textentwurf); die Cream-Zeile (ohne Wahl Plus, y ≈ 546–602) mit Pfeilkreis, die anderen als Ring; ein 12-px-Anschlussstrich von der Vorschau zur Cream-Zeile; Steuerzeile 13; unten schneidet die Brotkrumen-Haarlinie an (y ≈ 818) |
| Hauptobjekt | Mini-Vorschau (Gerätebaustein 96 × 192 mit der Startansicht in der Markenstufe des Cream-Pakets, mit dem Namen aus 01, falls eingegeben); sie schließt den Bogen 01 → 04 → Ende |
| Kamera, Komposition | frontal; kleines hohes Objekt links an x 16, breite Handlungsmasse rechts; Diagonale von der h2 oben links zur Cream rechts in der Mitte. Vorschau ≈ 12 %, Zeilen ≈ 28 %, Text ≈ 29 %, frei ≈ 31 % im Abschnitt, ≥ 40 % im Bildschirm |
| Bewegung | keine beim Scrollen und kein Auftritt. Wechselt die Wahl (Kartenknopf, A4-Zeile, Paketfeld; der Gesprächsweg setzt zurück), tauschen Cream und Vorschau außerhalb des Bilds (0 ms). Schreibtisch [H]: Zeiger oder Fokus auf einer Zeile überblendet die Vorschau zu deren Stufe (220 ms) |
| Übergang | Tipp → sofortiger Sprung zu `#frage` mit vorgewähltem Paket (FS9; ≈ 4 BH zurück, weiches Rollen ließe Marken und Anhänge vorbeiziehen) bzw. in Zustand B ins Kundenkonto. Wer nicht tippt: 96 px → Brotkrumen, eingebettet die Wechselkarte |
| Informationshierarchie | h2 → Cream-Zeile → Vorschau auf derselben Achse → Preisspalte 29 · 39 · 64 → Ring-Zeilen → Steuerzeile → Kopf-Ring |
| Handlungsaufforderung | Cream-Zeile: das gewählte Paket, sonst „Empfohlen“ |
| Funktion im Kaufentscheidungsprozess | S6 zweite Gelegenheit (EA H-D7): endgültige Paketwahl, ohne fünf Bildschirme zu den Karten zurück; Z1a bzw. Z1; Z1+ über die Cream an „Empfohlen“. Nach dem Senden steht hier der Dank statt der Zeilen (keine zweite Aufforderung) |
| Ruhige Fassung | Überblendung der Vorschau als Schnitt, sonst identisch. Ohne JavaScript: Cream an „Empfohlen“, Vorschau Plus, Zeilen → `#frage`, Paket „Noch offen“ |
| Schreibtisch | h2 einzeilig (Spalten 1–9), Vorschau 160 × 320 in Spalten 1–3, Zeilen 508 × 64 in Spalten 4–9, Anschlussstrich 106 px; Spalten 10–12 frei |

### Szene FS15 · Ende: Brotkrumen und Fuß (`rh-03-brotkrumen-fuss`, Stufe 1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 10.851–11.620 · Eintritt 10.007 · größter Scrollstand 10.776 (664: 10.956) · Bildschirm 13–14 (844), 17–18 (664) · Schreibtisch ≈ 10.027–10.526; eingebettet steht davor die Wechselkarte, die Brotkrumen entfallen (SR2) |
| Sichtbar | Brotkrumen 13 px „Startseite › Für Fensterbauer“ mit 44-px-Zielen und Haarlinie oben; Fuß kurz mit den Gruppen „Für Fensterbauer“ (Konfigurator-Pakete, Paketbedingungen, fünf Fachartikel, Anmelden), „Für Hauseigentümer“, „eeziframes“ (Anbieter, E-Mail), Recht; Ring 44 „Vertrag widerrufen“ |
| Hauptobjekt | keines |
| Kamera, Komposition | flache Spalten an der Ordnungslinie, eine Ebene über dem Grund; am Telefon zwei Spalten, unter 360 px eine |
| Bewegung | keine; das Zeichen leuchtet nur bei Berührung (1,6 s), Hover nur als Farbe |
| Übergang | Seitenende |
| Informationshierarchie | Brotkrumen → Gruppenköpfe → Rechtszeile → Widerruf-Knopf |
| Handlungsaufforderung | keine Cream; „Konfigurator-Pakete“ führt zurück zu `#pakete` |
| Funktion im Kaufentscheidungsprozess | Anbieter und Kleingedrucktes prüfen, Kontakt, Wechsel der Zielgruppe |
| Ruhige Fassung | identisch; Zeichen ruhig |

---

## 12.3 Sprünge und Abkürzungen der Seite für Fensterbauer

Senkrechte Sprünge sind sofort (`behavior: 'auto'`), danach liegt der Fokus auf dem Ziel-h2 (K-10). Glatt gerollt wird nur, wo zwischen
Start und Ziel keine scrollgekoppelte Szene liegt; sonst spielten Leiste, Lichtraum und Explosion nacheinander ab, also mehrere bewegte
Träger. Was ein Sprung überspringt, läuft nicht ab und wird beim Zurückscrollen nach den Regeln der jeweiligen Szene behandelt.

| Auslöser | Ort | Ziel, Ankunft (scrollY bei 844) | Art | Übersprungen | Ankunftsbild | Ruhige Fassung |
|---|---|---|---|---|---|---|
| Cream „Pakete ansehen“ | V1 | `#pakete`, 3.800 | sofort; Fokus h2 „Die Pakete“ | Leiste, 01, 02, 03 | Kapitelkopf, Namensleiste, empfohlene Karte bis zum Knopf (bei 664 ganz) | gleich |
| Ring „Selbst ausprobieren“ | V1 | `#die-idee`, 858 | sofort; Fokus h2 | Leiste (kein Schub bei Sprüngen über 600 px) | Gerät zu 94 % (664) bzw. ganz (844); der Gerätebildschirm geht an (600 ms), weil das Gerät ≥ 60 % im Bild ist und die Leiste ruht | Bildschirm von Anfang an an |
| Kopf-Ring „Pakete ansehen“ | ab scrollY ≈ 538 | `#pakete`, 3.800 | sofort | was dazwischen liegt | wie oben | gleich |
| Kopf-Ring „Paket anfragen“ (Zustand A) | nach der Kartenreihe | `#frage`, 5.969 | sofort | 04.2, 04.3 bzw. Ablauf und Anhänge | Formular; das Paket bleibt, wie es ist (getippte Wahl oder „Noch offen“) | gleich |
| Menü-Sprungmarken „01“ bis „06“, „Fragen“ | überall | Kapitelanfang, Haarlinie 16 px unter dem Kopf | sofort unter dem noch deckenden Blatt, dann Blatt aus (165 ms) | alles dazwischen | Ruhelage der Szene | Blatt nur über Deckkraft |
| Textziel „Wie sehr soll es Ihre Marke tragen?“ | 03 | `#pakete`, 3.800 | nativer Sprung in Leserichtung | 96 px Grund | wie Cream V1 | gleich |
| Kartenknopf „… anfragen“ (Zustand A) | 04.1 | `#frage`, 5.969 | **glatt** (K-10; dazwischen nur 04.2 und 04.3, ≈ 2,6 BH); Fokus h3 | – (Verkaufsstand und Festblock ziehen sichtbar vorbei) | Paketfeld mit Hinweis „bei den Paketen gewählt“ | Sprung ohne Glätten |
| Segment der Namensleiste | 04.1 | Karte, waagerecht | glatt in der Reihe, die Seite steht | – | Karte mittig | ohne Glätten |
| Ring „Rückruf oder Nachricht“ | 04.3 | `#frage`, Paket „Noch offen“ | eigenständig nativ, eingebettet über den Handler | 96 px | Formular ohne Hinweis | sofort |
| Weiterweg „Fragen Sie uns“ | A2 | `#frage`, „Noch offen“ | sofort (dazwischen die Ablauf-Marken) | 06, A1 | Formular | gleich |
| Zeile der Paketwahl | A4 | `#frage` mit Paket | sofort (`data-sprung="direkt"`) | Anhänge, 06.2, 06.1 (≈ 4 BH) | Paketfeld mit Hinweis | gleich |
| Ring „Zurück zu den Paketen“ | Dank | `#pakete` | sofort | – | Karten | gleich |
| Fuß „Konfigurator-Pakete“ | Fuß | `#pakete` | sofort (K-10; 12.9 Nr. 4) | alles bis 04 | Karten | gleich |
| Einstieg von außen mit Anker (Fachartikel „Fensterbau-Software“, Paketbedingungen, Kundenkonto, Mitentscheider) | – | `/fuer-fensterbauer/#pakete` | Seitenaufruf | V1 ist nicht im Bild: kein Ladeauftritt, V1 steht im Endzustand | Karten | gleich |

**Zurückscrollen nach einem Sprung.** Die Leiste koppelt wieder, sobald ihr Fenster erreicht ist (`fb-02`). Der Gerätebildschirm in 01
geht einmal je Seitenaufruf an, auch von unten (`fb-03`). Das Licht in 02 geht nur an, wenn das Gerät beim Aufruf unterhalb lag; wer über
`#pakete` eingestiegen ist, findet es stehend (`fb-04`). Für 03 legt die Spezifikation das Verhalten von unten nicht fest; Vorschlag in
12.9 Nr. 10.

---

## 12.4 Startseite `/`: Einstieg der Hauseigentümer und Rahmen (wesentliche Szenen)

Standardansicht von `/` ist „Hauseigentümer“. Die Szenen HA1 bis HA6 erzählen sie bis zum Übergang in die App; SR1 bis SR4 beschreiben,
was nur auf `/` geschieht: Ansichtswechsel, Einbettung der Seite für Fensterbauer, Hinweis bei `?von=pdf`, Menü.

### Szene HA1 · Ankunft auf `/`: das Foto setzt sich, das Glas klärt sich (`he-01-startbild` + `st-02-umschalter`, Stufe 3, T1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 0–680 · scrollY 0 bis 624 (Austritt) · Bildschirm 1 (844), 1–2 (664) · Schreibtisch y 0–576 |
| Sichtbar (scrollY 0) | Kopf 56 px flächenlos über dem Scrim (Logo, Menü; Kopfknopf verborgen); Glas-Umschalter 284 × 44 (x 16–300, y 68–112) mit „Hauseigentümer“ gewählt (Füllung `--surface3`, Tintenkontur) und „Fensterbauer“; Foto 390 × 420 (opak bis y 276, Auslauf bis 396): Waschbär auf einem Tritt misst mit gelbem Zollstock an der Laibung einer Maueröffnung im Rohbau, Handy in der Pfote, Tageslicht oben rechts. Bedienschicht: Eyebrow „In Minuten zum Aufmaß für jeden Fensterbauer“ 13 zweizeilig (y 320–355), h1 „Fenster ausmessen. Selbst. eezi.“ 32 zweizeilig, grün „eezi.“ (y 363–430), Lead 17 „Zwei Fotos und die Maße mit dem Zollstock, jeder Schritt erklärt.“ (Textentwurf, y 442–490), Preiszeile 13 zweizeilig „Messen kostenlos, ohne Konto · Aufmaßblatt 7,99 € bis 17.11.2026, danach 12,99 €“ (Textentwurf; nach dem Stichtag „Aufmaßblatt 12,99 €“, y 506–542), Cream 222 × 52 „Jetzt ausmessen“ (y 550–602), Ring 222 × 52 „Führung starten“ (y 614–666); unten ab y 776 der Anschnitt von H2 (Haarlinie und „01 · PROBEMESSUNG“, 8 %) |
| Hauptobjekt | Waschbär an der Laibung (≈ 170 px hoch; Figur, Laibung und Öffnung ≈ 240 × 190 px = 28 % der Fotofläche); Anker ist das Gesicht mit Handy neben der hellen Laibung |
| Kamera, Komposition | frontal; die Fotokamera „setzt sich“ (Maßstab 1,03 → 1, Ursprung am Waschbären an der Öffnung, ≈ 70 % / 30 %); keine Tiefe beim Scrollen (Stufe 3, K-9). Diagonale: Tageslicht oben rechts → Cream unten links. Ebenen: Z 0 Grund → Z 20 Foto → Z 25 Glasfläche des Umschalters → Z 28 Scrim → Z 30 Bedienschicht samt Wörtern und Trefferflächen des Umschalters → Z 40 Kopf. Foto 50 % der Höhe, Lesestapel und Handlung 41 %, frei ≈ 41 % |
| Bewegung | Laden: Foto Deckkraft 0,35 → 1 und Maßstab 1,03 → 1 gemeinsam (900 ms `--e-out`, Start nach `img.decode()`); der Umschalter steht ab dem ersten Bild mit Ersatzfüllung 80 % und klärt sich nach dem Foto zum Glas (320 ms, also 0,9–1,22 s); der Text steht ab dem ersten Bild; kein Logo-Licht (K-8). Erste Eingabe: alles in 220 ms in den Endzustand. Scrollen: keine Bewegung. Der Kopf wird opak, sobald die Oberkante des Umschalters die Kopfkante + 8 px erreicht (nach 4 px Scrollweg, 150 ms), flächenlos wieder nur ganz oben |
| Übergang | Weiterscrollen: vom warmen Foto zur weißen Zeichnung in H2, als Wechsel ohne Bewegung; bei scrollY ≈ 546 ist die Cream unter dem Kopf verschwunden, der Kopfknopf „Fenster ausmessen“ erscheint (220 ms). Cream → Seitenwechsel in die App (`/app/#ausmessen`), Ring → `/app/#fuehrung`, Umschalter → SR1 |
| Informationshierarchie | Figur (Gesicht, Handy, Zollstock, helle Laibung) → h1 → Lead → Preiszeile → Cream → Ring; der Umschalter peripher oben links |
| Handlungsaufforderung | Cream „Jetzt ausmessen“ (mit angefangenem Aufmaß „Aufmaß fortsetzen“, dazu die Zeile „2 Fenster erfasst, gespeichert in diesem Browser“, Textentwurf) bei 65–71 % der Höhe, im Daumenbereich; Ring „Führung starten“ |
| Funktion im Kaufentscheidungsprozess | B1 Zuordnen: „Ist das für mich, und schaffe ich das?“ (H-01); Start, Preis und „ohne Konto“ vor dem ersten Tipp (RE R12, R13); der Umschalter sortiert Fensterbauer aus, ohne Hauseigentümer abzulenken. Gruppen HE-3, HE-5 |
| Ruhige Fassung | Foto sofort voll, Glas sofort, keine Übergänge außer Deckkraft am Kopf. Ohne JavaScript dasselbe statische Startbild; der Umschalter sind zwei Links |
| Schreibtisch | Split 5 : 7, Foto x 552–1280 (y 0–760), Umschalter als flaches Segment im Kopf neben dem Logo (kein Glas, kein Bild darunter), Cream und Ring nebeneinander (y 499–551); H2 schneidet bei y 704 an (12 %) |
| Material | Telefonzuschnitt `start-hauseigentuemer-telefon.webp` beim Inhaber anzufragen; mit dem Bestandsfoto läge der Umschalter über dem Gesicht. Hypothesen H-he01-1 bis -5 |

### Szene HA2 · 01 Probemessung: dreimal messen, das kleinste zählt (`he-02-probemessung`, Stufe 2, T4 interaktiv)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 776–1.474 · ab dem Laden angeschnitten · Karten-Auftritt bei scrollY ≈ 107 · Ruhelage 704 · Austritt 1.418 · Bildschirm 1–2 (844), 2–3 (664) · Schreibtisch ≈ 704–1.220 |
| Sichtbar (Ruhelage; Haarlinie bis Cream auf einem Bildschirm) | Kapitelzeile „01 · PROBEMESSUNG“ (Textentwurf, y 88–104), h2 „Dreimal messen. / Das kleinste zählt.“ (Textentwurf, grün „zählt.“, y 116–184), weiße Karte 358 × 300 mit Radius 24 (y 208–508): Maueröffnung von innen, links Wand mit den Stellenwörtern „OBEN“, „MITTE“, „UNTEN“, Altfenster, drei orange gestrichelte Hilfslinien, „BEISPIEL“ oben links; Legende „BREITE MESSEN“ · „0 / 3“ (Textentwurf, y 524–541); drei Knöpfe 114 × 44 „Oben“, „Mitte“, „Unten“ (y 549–593); Satz 17 dreizeilig „Je Fenster drei Breiten und drei Höhen der Maueröffnung, dazu das Rahmenmaß. Abweichungen werden markiert.“ (Textentwurf, gekürzt aus `web/index.html:59`, y 617–694); Cream nach Inhalt ≈ 200 × 52 „Jetzt ausmessen“ (y 718–770) |
| Hauptobjekt | die Zeichnungskarte, ≈ 32 % der Fläche; Papierweiß ist der einzige große Hellwert, Orange nur als Linie |
| Kamera, Komposition | frontaler Blick von innen auf die Maueröffnung, keine Perspektive; Stapel an x 16, in der Karte links Wand, rechts Öffnung; die Cream unten links als zweiter, kleinerer Hellpol. Ebenen: Z 0 Grund → Z 20 Karte (innen Wand → Öffnung → Hilfslinien → Maßlinien → Pillen und Etikett) → Z 30 Bedienschicht → Z 40 Kopf |
| Bewegung | einmal, wenn der Abschnitt zu 25 % sichtbar ist: die Karte blendet ein (Deckkraft, `translateY` 16 → 0, 600 ms `--e-out`); die Bedienschicht steht ab dem ersten Bild (K-6; 12.9 Nr. 2). Tipp auf einen Knopf: Haken 12 px vor dem Wort (150 ms, kein „gewählt“, nie Cream), die Hilfslinie geht aus, die Maßlinie wächst von der linken Laibung (`scaleX` 0 → 1, 600 ms nach K-4), der Wert zählt in der Bildschicht mit (Beispielwerte 1.236, 1.231, 1.234 mm), der Endstrich rastet mit Feder ≤ 3 % ein [H] (220 ms; Rückfall ohne Überschwingen). Nach dem dritten Wert +120 ms treten die längeren Linien zurück (320 ms), die Pille „Mitte“ wird dunkel, das Etikett „KLEINSTES MASS“ erscheint (320 ms). Ein Tipp auf einen gedrückten Knopf nimmt die Linie zurück (220 ms). Nichts läuft länger als 0,8 s, keine autonome Bewegung, keine Scrollkopplung |
| Übergang | vom Papier der Zeichnung zum Papier des Aufmaßblatts („so misst man“ → „das kommt heraus“); 96 px → „02 · DAS AUFMASSBLATT“. Beim Übergang können zwei Papierflächen mit ≈ 460 px Grund dazwischen im Bild stehen (Prüfpunkt) |
| Informationshierarchie | Karte → h2 → Knopfreihe (Daumenbereich) → nach dem dritten Tipp das dunkle Etikett → Satz → Cream |
| Handlungsaufforderung | Cream „Jetzt ausmessen“, 872 px unter der Cream von H1, also nie im selben Bildschirm; der Kopfknopf ist Ring, solange diese Cream im Bild ist |
| Funktion im Kaufentscheidungsprozess | B1 Zutrauen: den Zweifel „Schaffe ich das?“ durch einen Handgriff nehmen (H-E10); zweite Gelegenheit für Z2a |
| Ruhige Fassung | Karte und Text stehen sofort; ein Tipp zeigt Linie, Endstriche und Endwert als Schnitt; Rücktritt und Etikett nur über Deckkraft ≤ 150 ms; kein Versatz, kein Maßstab, kein Zählen. Die Bedienung bleibt, denn der Handgriff ist die Funktion. Ohne JavaScript die Textfassung mit allen drei Werten und markiertem kleinstem Maß |
| Schreibtisch | Karte 597 × 500 rechts (Spalten 6–12), Kapitelzeile, h2, Legende, Knöpfe, Satz und Cream links (Spalten 1–5); die Linien liegen auf Höhe von Legende, Satz und Cream |

### Szene HA3 · 02 Das Aufmaßblatt legt sich mit seinem Preis ab (`he-03-aufmassblatt-preis`, Stufe 2, T5-artig)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 1.570–2.542 · Eintritt 726 · Blatt-Auftritt bei scrollY ≈ 1.167 · Ruhelage 1.498 · Austritt 2.486 · Bildschirm 2–4 (844), 3–4 (664) · Schreibtisch ≈ 1.348–2.124 |
| Sichtbar (Ruhelage) | Kapitelzeile „02 · DAS AUFMASSBLATT“ (Textentwurf), h2 „Was im Aufmaß steckt.“ (grün „Aufmaß“) mit Zusatz „je Fenster, wie beim Termin vor Ort“, Etikett „BEISPIEL“; das Blatt (Kundenfassung, Familie Weber) 290 × 275 um −2° gedreht, unten in den Grund ausgeblendet (y ≈ 260–535); darauf das Preisetikett 152 × 76, opak, „EINMALIG“ und „7,99 €“ 32 px (Textentwurf; ab 18.11.2026 „12,99 €“), ragt 40 px über die rechte Blattkante; drei Preiszeilen „0 € Messen, Fotos, 3-D-Modell“ · „7,99 € Aufmaßblatt als PDF, einmalig / bis 17.11.2026, danach 12,99 €“ · „0 € über den Link eines Fensterbauers“ und die Zeile zum Endpreis (Textentwürfe); darunter beginnen „JE POSITION IM BLATT“ und der Katalog |
| Hauptobjekt | Blatt mit Preisetikett, ein Gegenstand (Szene ≈ 41 % bei 664); das Etikett gehört zum selben Fokusträger |
| Kamera, Komposition | Aufsicht, frontal, Drehung nur in der Ebene; Blatt links an x 16, Etikett nach rechts über die Kante. Ebenen: Z 0 → Z 20 Blatt → Z 25 Etikett (1-px-Lichtkante, Begleitschatten nur auf dem Papier [H]) → Z 30 Bedienschicht neben der Szene, nie auf ihr → Z 40 |
| Bewegung | Erreicht die Blattoberkante 70 % der Höhe (844: scrollY ≈ 1.167), legt sich das Blatt aus der Lichtrichtung ab (von 24 px oben rechts und −3,2° auf −2°, 600 ms `--e-out`, Deckkraft 320 ms), 280 ms später folgt das Etikett (8 px, 320 ms), zusammen 600 ms. Papier prallt nicht. Die Bedienschicht steht ab dem ersten Bild (K-6). Die Chip-Zeile der Elementarten folgt dem Finger |
| Übergang | H3 endet leise mit „Grundlage für Angebote, kein Bestellmaß: Vor der Fertigung misst der Fachbetrieb selbst nach.“ (Textentwurf); nach 96 px dunklem Grund setzt H4 mit einem dunklen Maßstab neu an: hell → dunkel trennt die Kapitel |
| Informationshierarchie | Papierweiß → Etikett mit Preis → Betragsspalte „0 € · 7,99 € · 0 €“ → Katalog (sieben Zeilen, dieselbe Fassung wie in 03 der Seite für Fensterbauer) → Chips → Grenze |
| Handlungsaufforderung | keine eigene; der Kopfknopf „Fenster ausmessen“ ist hier Cream, weil keine Cream im Inhalt steht |
| Funktion im Kaufentscheidungsprozess | B2 Verstehen: „Was bekomme ich am Ende, und was kostet es?“ (H-02, H-06); Preis mit Datum, ohne Countdown (R13) |
| Ruhige Fassung | Endbild ohne Übergänge (Blatt bei −2°, Etikett liegt). Ohne JavaScript die Textfassung |
| Schreibtisch | Szene rechts (Blatt 420 × 398, Etikett 184 × 92), Preisblock und Katalog links; [H] die Szene läuft neben dem Katalog mit (`sticky`, ≈ 0,39 BH, ohne Animation), Rückfall oben bündig |

### Szene HA4 · 03 Fotografieren, Messen, Wünschen – und die Daten (`he-04-ablauf-daten`, Stufe 2, T8-artig)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Seiten-y 2.638–3.190 (Fassung A) · Eintritt 1.794 · Ruhelage 2.566 · Austritt 3.134 · Bildschirm 4 (844), 4–5 (664) · Schreibtisch ≈ 2.252–2.642 |
| Sichtbar (Ruhelage) | Kapitelzeile „03 · ABLAUF UND DATEN“ (Textentwurf), h2 „Fotografieren. Messen. Wünschen.“ (grün „Wünschen.“), waagerechter Maßstab 358 × 64 mit vier Marken „01 Fotos“, „02 Maße“, „03 Wünsche“, „04 Blatt“ (Textentwurf); Lesestapel „Unklares darf offen bleiben. Weitermachen geht später, im selben Browser.“ (Textentwurf); drei grüne Haken „Fotos und Eingaben bleiben ohne Konto auf dem Gerät.“, „Die KI wertet Fotos nur mit Einwilligung aus.“, „Zum Kauf: E-Mail und Code, kein Passwort.“ (Textentwurf); Link „Mehr zu Fotos und KI“; Ring „Führung starten“ mit Satz „Mit Beispielfotos, ohne eigene Maße.“ (Textentwurf); unten schon die Haarlinie von H5 |
| Hauptobjekt | Fassung A: der Maßstab (liest sich wie ein bedruckter Zollstock); Fassung B, sobald App-Bildschirme vorliegen: vier Miniaturen 77,5 × 159 über dem Maßstab |
| Kamera, Komposition | flach, linksbündig; in B stehen die Bildschirme auf der Maßkette (Maßstab überdeckt ihre ausgeblendeten Füße um 8 px) |
| Bewegung | A: keine. B: die Miniaturen blenden einmal über Deckkraft ein, versetzt 0 / 80 / 160 / 240 ms (je 600 ms), wenn der Abschnitt zu 15 % sichtbar ist. Bedienschicht und Maßstab stehen ab dem ersten Bild (K-6) |
| Übergang | 96 px → H5; in Fassung A noch im selben Bildschirm |
| Informationshierarchie | A: h2 → Maßstab → Haken → Lesestapel → Ring; B: Miniaturen → h2 → Stationswörter → Lesestapel → Haken → Ring |
| Handlungsaufforderung | Ring „Führung starten“ (U4), bewusst zweitrangig; die einzige Cream ist der Kopfknopf |
| Funktion im Kaufentscheidungsprozess | B2 und B3: Aufwand einschätzbar, Fragen zu Fotos, KI und Konto vor dem Start beantwortet (H-03, H-04) |
| Ruhige Fassung | Miniaturen sofort sichtbar; sonst identisch |
| Schreibtisch | A: Maßstab als Band über alle 12 Spalten, darunter links Ablauf, rechts Daten; B: Split 5 : 7 |

### Szene HA5 · Aus dem Ratgeber, dann die Fragen (`he-05-ratgeber-weg`, `he-06-haeufige-fragen`, Stufe 2 · 1)

| Feld | Inhalt |
|---|---|
| Scrollbereich | H5 Seiten-y 3.286–3.716, H6 3.812–4.172 · Eintritt 2.442 · Austritt 4.116 · Bildschirm 4–5 (844), 5–7 (664) · Schreibtisch ≈ 2.770–3.349 |
| Sichtbar | h2 „Aus dem Ratgeber.“ (grün „Ratgeber.“), ein Raster 2 × 3 aus Kacheln 171 × 88 („Schritt 1 / Prüfen / 3 Ratgeber“ … „Schritt 6 / Einbauen / 2 Ratgeber“, Zählwort Textentwurf), die Ankerkachel „Schritt 4 / Ausmessen / Messanleitung“ (Textentwurf) hervorgehoben (Papierweiß nach Freigabe H5-AB-1, sonst `--surface` mit Ring), Link „Alle Ratgeber ›“; danach H6 mit vier Fragen-Zeilen wie A2 der Seite für Fensterbauer |
| Hauptobjekt | die Ankerkachel; in ihr ein kleiner Messausschnitt |
| Kamera, Komposition | Kachelfeld mit Anker (Muster K7), flach, Fuge 12 |
| Bewegung | Ist die Ankerkachel zur Hälfte im Bild, zeichnen sich ihre drei Maßlinien nacheinander zur Laibung (zusammen ≈ 600 ms nach K-4) [H]; Fragen öffnen über Deckkraft 220 ms |
| Übergang | 96 px → H7 |
| Informationshierarchie | Ankerkachel → h2 → übrige Kacheln → Link; dann Fragen |
| Handlungsaufforderung | keine Cream (die Kacheln sind Links in den Ratgeber); der Kopfknopf bleibt Cream |
| Funktion im Kaufentscheidungsprozess | Unentschlossene in den Weg in sechs Schritten führen (U5 statt Absprung); Restzweifel (H6) |
| Ruhige Fassung | Maßlinien stehen; Fragen öffnen sofort |

### Szene HA6 · Anfangen: Bildband, Messaufforderung, Übergang in die App (`he-07-abschluss`, `st-04-wechselkarte`, `ap-01`)

| Feld | Inhalt |
|---|---|
| Scrollbereich | H7 Seiten-y 4.268–4.639, Wechselkarte 4.735–4.908, Fuß 5.004–5.736 · Eintritt 3.424 · Ruhestand scrollY ≈ 3.987 (Bildband bei y 281–481) · größter Scrollstand 4.892 · Bildschirm 6 (844), 7–8 (664) · Schreibtisch ≈ 3.477–4.111 |
| Sichtbar (Ruhestand) | Bildband 390 × 200 aus dem Startfoto (Waschbär mit Zollstock, Laibung aus Ziegeln, Tageslicht in der Öffnung), oben und unten in den Grund ausgeblendet; h2 „Das erste Fenster ausmessen.“ (Textentwurf, grün „erste“) im Auslauf, 24 px über dem Bandfuß; Preiszeile wie H1; Cream 358 × 52 „Jetzt ausmessen“ über die volle Breite (y ≈ 600–652); ab y ≈ 748 der Anschnitt der Wechselkarte (dunkel, opak, Ring) |
| Hauptobjekt | das Bildband: die Klammer zum Anfang (Band 24 % der Bildschirmhöhe) |
| Kamera, Komposition | randloses Band oben, Lesestapel links, Pille als breiter Riegel unten; Diagonale vom Gesicht und Tageslicht oben zur Pille unten. Ebenen: Z 0 → Z 20 Band → Z 30 → Z 40 |
| Bewegung | keine; kein Auftritt, kein Scrollbezug |
| Übergang | Tipp auf die Cream: Seitenwechsel in die App (gleiche Herkunft) ohne Übergangsanimation; als Verbesserung dürfen View Transitions mit 220 ms Überblendung laufen, Kopf und Ordnungsachse stehen (DS 11.7.6). `/app/#ausmessen` überspringt das Startbild der App und öffnet die Messung. Wer über `/app/` kommt (Ratgeber, Menü „Gesichertes Aufmaß öffnen“, 404), sieht `ap-01`: eigener Foto-Auftritt 900 ms mit Ursprung am Kopf des mittleren Waschbären, Cream „Fenster ausmessen“, „Schon ein Aufmaß gesichert? Anmelden“, unten „Sie sind Fensterbauer?“ → `/fuer-fensterbauer/`. Die Wechselkarte darunter: Kicker „Für Fensterbauer“, Satz „Dieses Werkzeug, unter Ihrer Marke.“ (Textentwurf, grün „Marke.“), Ring „Zur Seite für Fensterbauer“ (Textentwurf) → SR1 |
| Informationshierarchie | Bildband → h2 → Cream → Preiszeile → Wechselkarte (sekundär) |
| Handlungsaufforderung | Cream „Jetzt ausmessen“; der Kopfknopf ist Ring, solange sie im Bild ist |
| Funktion im Kaufentscheidungsprozess | B4 Handeln (EA H-D12): Die Ansicht endet mit dem Start, nicht mit dem Wechsel → Z2a; danach Z2 in der App (B5 außerhalb dieser Planung) |
| Ruhige Fassung | identisch, nichts bewegt sich; Seitenwechsel ohne Übergang |
| Schreibtisch | Abschnitt 320 px: Text links (h2 40/42, Pille 218 × 52), Band rechts 717 × 320 bis an den Rand; Wechselkarte 419 × 186 über Spalten 1–5 |

### Rahmenszene SR1 · Ansichtswechsel (Umschalter, Wechselkarte, Menü; `st-02`, `st-04`, `rh-02`, K-5)

| Feld | Inhalt |
|---|---|
| Scrollbereich | Auslöser an jeder Stelle der Ansicht: Umschalter (Telefon als Glas über dem Startfoto bei y 68–112, scrollt mit weg; Schreibtisch als flaches Segment im Kopf), Ring der Wechselkarte am Ende der Ansicht, Segment im Menü. Ankunft immer bei scrollY 0 der neuen Ansicht |
| Sichtbar | während des Wechsels stehen Kopf und Umschalter; die neue Ansicht (H1 bzw. V1 der Einbettung) blendet über dem Grund ein, ihr Foto zunächst bei 35 % Deckkraft |
| Hauptobjekt | das Startfoto der neuen Ansicht (Waschbär an der Maueröffnung bzw. Astronaut am Bullauge) |
| Kamera, Komposition | ein Szenenwechsel unter stehender Bedienung: Die Bewegung trägt das Foto der neuen Ansicht, nicht ein Gleiten der Seite (SG 10.7/5); keine Richtung, keine räumliche Transformation |
| Bewegung | 1. das Segment wechselt den Zustand bzw. der Ring zeigt den Druck (150 ms) · 2. Anker `#hauseigentuemer` bzw. `#fensterbauer` ohne Verlaufseintrag, Wahl gespeichert, Neuaufbau und `scrollTo(0, 0)` ohne Gleiten · 3. die neue Ansicht blendet von 0 auf 1 ein (220 ms `--e-out`), die alte wird nicht ausgeblendet · 4. danach läuft der Foto-Auftritt der neuen Bühne (900 ms; in V1 mit Meldungen und Maßlinie bis 4,1 s) · 5. Fokus auf das h1. Der Umschalter zeigt die neue Wahl ohne Übergang |
| Übergang | → HA1 bzw. FS1 (in der Einbettung SR2) |
| Informationshierarchie | 1 das Segment mit dem neuen Zustand · 2 das Foto der neuen Ansicht · 3 ihr h1 |
| Handlungsaufforderung | die Cream der neuen Ansicht („Jetzt ausmessen“ bzw. „Pakete ansehen“) |
| Funktion im Kaufentscheidungsprozess | Zielgruppe wählen (Nutzerfrage „Bin ich in der richtigen Ansicht?“): FB-5 kommt über den Umschalter in die eingebettete Seite für Fensterbauer (W6), Hauseigentümer kommen über die Wechselkarte zurück; Vorstufe zu Z1a bzw. Z2a |
| Ruhige Fassung | Schnitt, ohne Einblenden und ohne Foto-Auftritt (Endbild). Ohne JavaScript: zwei Links auf die Anker |

### Rahmenszene SR2 · Die Seite für Fensterbauer eingebettet in `/#fensterbauer`

| Feld | Inhalt |
|---|---|
| Scrollbereich | die ganze Ansicht `/#fensterbauer`: Seiten-y 0–11.904 (14,1 BH), alle Lagen der Timeline 12.5.2 um 52 px tiefer; Bildschirm 1 bis 15 (844) |
| Sichtbar (scrollY 0) | wie FS1, dazu über dem Foto der Glas-Umschalter 284 × 44 (y 68–112) mit „Fensterbauer“ gewählt; das Bildfeld wächst um 52 px nach oben und zeigt den Kopfraum des Zuschnitts, alles darunter rückt um 52 px (Stapel y 124–229, Preiszeile 562–579, Cream 594–646, Ring 658–710; E-1 hält bei 664) |
| Hauptobjekt | wie in FS1 bis FS14; die Komposition von Figur und Stapel bleibt identisch, der Stapel rückt nicht in die Figur |
| Kamera, Komposition | wie FS1 bis FS14; zwei Glasflächen zugleich (Umschalter und vordere Meldung, die Grenze am Telefon), die Maßwertpille verliert dafür den Weichzeichner |
| Bewegung | dieselben Szenen aus derselben Quelle; der Kopf wird schon nach 4 px opak (erstes Element unter dem Kopf ist der Umschalter); Sprünge scrollen innerhalb der Ansicht, ohne den Anker `#fensterbauer` zu ändern. Neuaufbau: kein zweiter Ladeauftritt, Szenen im Bild oder darüber stehen im Endzustand; Bindungen idempotent in `Verkauf.auf`, Zustand je Wurzel, `sessionStorage` nur in `try/catch` |
| Übergang | nach A4 folgt die Wechselkarte (y 10.903–11.076): dunkle, opake Karte 358 × ≈ 200, Satz „Ihre eigenen Fenster ausmessen?“ (grün „ausmessen?“), Ring „Zur Ansicht für Hauseigentümer“ → SR1; danach der Fuß kurz ohne Brotkrumen |
| Informationshierarchie | wie FS1 bis FS14; der Umschalter bleibt peripher oben links |
| Handlungsaufforderung | wie FS1 bis FS14; die Wechselkarte ist neben der Cream-Zeile von A4 sekundär (Ring, keine Cream) |
| Funktion im Kaufentscheidungsprozess | dieselbe Kette S1 bis S7 für FB-5 (über den Umschalter) und FB-4 (über den QR-Code, SR3); der leise Rückweg für Besucher, die eigentlich eigene Fenster messen wollen |
| Ruhige Fassung | wie FS1 bis FS14; Ansichtswechsel als Schnitt |

### Rahmenszene SR3 · Hinweis zum Aufmaßblatt bei `?von=pdf` (`st-03-hinweis-von-pdf`)

| Feld | Inhalt |
|---|---|
| Scrollbereich | erster Bildschirm der Ansicht Fensterbauer auf `/` mit `?von=pdf` (QR-Code im Aufmaßblatt, Gruppe FB-4), solange der Hinweis nicht geschlossen wurde; kein eigener Platz, ein Zustand von V1; Bildschirm 1 (844 und 664) |
| Sichtbar | Kopf, Glas-Umschalter (y 68–112); an Stelle des Meldungsstapels eine Glas-Karte ≤ 260 × 168 (y ≈ 124–292): Titel 15 fett zweizeilig „Sie halten ein eeziframes-Aufmaß in der Hand?“, eine Zeile 13 „Das Blatt ist ein PDF, lesbar ohne Konto. Das Feinaufmaß bleibt bei Ihnen.“ (Textentwurf), Link-Zeile 44 px „Aufmaß per Code übernehmen“; darunter unverändert Kicker, h1, Chips, Preiszeile (y ≈ 561–578), Cream (y ≈ 593–645) und Ring von V1 |
| Hauptobjekt | weiterhin der Astronaut am Bullauge; die Karte liegt als vermittelnde Glasschicht über der Stationsdecke und verdeckt weder Gesicht noch Bullauge |
| Kamera, Komposition | wie FS1 in der Einbettung; Glasfläche auf Z 25, Titel, Zeile und Link-Zeile samt Trefferfläche auf Z 30; zwei Glasflächen (Umschalter und Karte) |
| Bewegung | die Karte steht ab dem ersten Bild; der Ladeauftritt wird kürzer: Foto 0–0,9 s, ohne Meldungen zeichnet sich die Maßlinie schon 0,9–2,1 s; erste Eingabe → 220 ms Endzustand; die Karte scrollt 1 : 1 mit der Seite, die Bildgruppe wie in FS1 |
| Übergang | Link-Zeile → vorhandenes Blatt im Betriebsbereich (Anmelden bzw. Code einfügen); Scrollen → FS2 ff. in der Einbettung; Cream → `#pakete` |
| Informationshierarchie | 1 Erdlicht · 2 Kartentitel (er spricht das Blatt in der Hand an) · 3 h1 · 4 Preiszeile → Cream · 5 Link-Zeile |
| Handlungsaufforderung | Cream „Pakete ansehen“ bleibt die eine Cream; die Link-Zeile „Aufmaß per Code übernehmen“ ist ein Service-Weg ohne Fläche |
| Funktion im Kaufentscheidungsprozess | S0 Ankommen für FB-4: bestätigen, dass er richtig ist, und den Code-Weg auffindbar halten, den das Aufmaßblatt Käufern verspricht; die Cream darunter beantwortet die zweite Hälfte der Frage („solche Anfragen unter meinem Namen?“) |
| Ruhige Fassung | Karte identisch; V1 ohne Zoom und Tiefe, Maßlinie fertig. Ohne JavaScript keine Einbettung und kein Hinweis; die Textfassung bleibt |

### Rahmenszene SR4 · Menü-Blatt am Telefon (`rh-02-menue`)

| Feld | Inhalt |
|---|---|
| Scrollbereich | auf Abruf an jeder Stelle (Menü-Knopf 44 × 44 im Kopf); die Seite darunter ist gesperrt |
| Sichtbar | opakes Blatt `#1f1f1f` im unteren Bereich bis ≈ 85 % der Höhe, Einträge im Daumenbereich, 1-px-Lichtkante oben, Scrim dahinter; Schließen 44 × 44 oben rechts im Blatt; im Kontext Fensterbauer das Segment „Hauseigentümer · Fensterbauer“, die Sprungmarken „01 Die Idee“ … „06 Ablauf“, „Fragen“ (Kurzbezeichnungen Textentwurf), „Paketbedingungen“, „Wissen für Fensterbauer“, „Anmelden“, Kontakt; Zeilen 17 px in 52-px-Zeilen zwischen Haarlinien |
| Hauptobjekt | keines; die Liste der Wege |
| Kamera, Komposition | ein flaches Blatt in der Ebene über der Seite (Z 40), Gruppenköpfe in der Technikstimme, Kapitelnummern 13 px vor den Sprungmarken; kein Schatten |
| Bewegung | öffnen: Blatt und Scrim gemeinsam über Deckkraft 220 ms; schließen 165 ms; Wischen nach unten folgt dem Finger 1 : 1, beim Loslassen über 25 % der Blatthöhe oder 0,5 px/ms läuft es mit dem Abwurftempo aus (120–220 ms), sonst kehrt es ohne Überschwingen zurück (165 ms). Ein Einfahren in der Ebene bleibt Variante (DG-E-12) |
| Übergang | Sprung: sofort unter dem noch deckenden Blatt, dann Ausblenden, Fokus auf das Ziel-h2 (12.3); Segment: Ansichtswechsel (SR1); Schließen ohne Ziel: Fokus zurück auf den Menü-Knopf |
| Informationshierarchie | 1 Segment · 2 Sprungmarken mit Nummern · 3 Nebenwege (Paketbedingungen, Wissen) · 4 Anmelden und Kontakt |
| Handlungsaufforderung | keine Cream; die Sprungmarke „04 Pakete“ ist der Schnellweg zur Entscheidung |
| Funktion im Kaufentscheidungsprozess | Orientierung für Wiederkehrende und Prüfer (FB-6): jeder Kapitelanfang in einem Tipp, ohne Kapitelanzeige im Kopf |
| Ruhige Fassung | Deckkraft bleibt, das Wischen folgt weiter dem Finger, nach dem Loslassen nur Ausblenden. Ohne JavaScript ist „Menü“ ein Link auf die Navigation im Fuß |

---

## 12.5 Scroll Experience Timeline – Telefon 390 × 844

### 12.5.1 Zeitachse der ersten Sekunden (vor der ersten Eingabe)

| Zeit | `/fuer-fensterbauer/` (FS1) | `/#fensterbauer` (SR2) | `/?von=pdf` (SR3) | `/` Hauseigentümer (HA1) | `/app/` (`ap-01`) |
|---|---|---|---|---|---|
| 0 | Bedienschicht und Kopf stehen; Foto bei 35 % Deckkraft | wie links; Umschalter mit Ersatzfüllung 80 % | wie links; Hinweiskarte steht | Bedienschicht steht; Umschalter mit Ersatzfüllung 80 % | Bedienschicht steht |
| 0–0,9 s | Foto 0,35 → 1 und 1,03 → 1; Erdlicht, Keil, Schlitz und Kegel der Leiste ab 0,15 s | wie links | wie links | Foto 0,35 → 1 und 1,03 → 1 | Foto 0,35 → 1 und 1,03 → 1 |
| 0,9 s | Meldung 1 (600 ms), „BEISPIEL“ (320 ms) | wie links; Glas des Umschalters: Zeitpunkt offen (12.9 Nr. 11) | Maßlinie beginnt (bis 2,1 s) | Glas klärt sich (bis 1,22 s) | Stand |
| 1,6 s | Meldung 2 | wie links | Maßlinie, Wert zählt | Stand | – |
| 2,3 s | Meldung 3 | wie links | Stand ab 2,1 s | – | – |
| 2,9–4,1 s | Maßlinie zeichnet sich, Wert 0 → 1.200 | wie links | – | – | – |
| Ende | 4,1 s | 4,1 s | 2,1 s | ≈ 1,22 s | 0,9 s |
| erste Eingabe | Laufendes und Ausstehendes in 220 ms per Deckkraft in den Endzustand | wie links | wie links | wie links | wie links |
| weniger Bewegung | Endbild ab 0 | Endbild ab 0 | Endbild ab 0 | Endbild ab 0 | Endbild ab 0 |

Autonome Bewegung endet überall nach ≤ 5 s (WCAG 2.2.2); deshalb gibt es keinen Pausenknopf.

### 12.5.2 Seite für Fensterbauer `/fuer-fensterbauer/`

Länge 11.620 px = 13,8 BH; größter Scrollstand 10.776 (664: 10.956). Pakete in Bildschirm 5 (844) bzw. 6 (664), Formular-Überschrift
`#frage` in Bildschirm 8 (844) bzw. 10 (664).

| Szene | Abschnitt | Seiten-y | scrollY Eintritt · Ruhelage · Austritt | Bildschirm 844 · 664 | bewegter Träger: Auslöser → Verlauf | Licht · Glas | Handlung im Bild |
|---|---|---|---|---|---|---|---|
| FS1 | V1 `fb-01` | 0–690 | – · 0 · 634 | 1 · 1 | Laden → Foto, Meldungen, Maßlinie bis 4,1 s; erste Eingabe → 220 ms Endzustand | Erdlicht, Keil · Glas-Stapel | Cream „Pakete ansehen“, Ring „Selbst ausprobieren“ |
| FS2 | V2 `fb-02` | 690–834 | ab 0 sichtbar · – · 778 | 1 · 2 | Scrollen 0 → ≈ 495 (664: 26 → 675) → Reihe 0,42 · Δy mit Trägheit, Einrasten ≤ 1,2 s; Wischen, Abwurf | Kegel (Ende des Lichtübertrags) | Cream V1 bis ≈ 538 |
| FS3 | 01 `fb-03` | 930–1.854 | 86 · 858 · 1.798 | 2–3 · 2–3 | Gerät ≥ 60 % und Leiste ruht (≈ 537) → Bildschirm geht an, 600 ms; Textziel → Feld 220 ms | 1-px-Lichtkante | Textziel |
| FS4 | 02 `fb-04` | 1.950–2.646 | 1.106 · 1.878 · 2.590 | 3–4 · 3–4 | Gerät ≥ 50 % (≈ 1.393) → Licht an, 900 ms; Tippen → Bild 500 ms bzw. Bildfolge 1,2 s, Licht + 50 ms | Lichtfleck Cream | sechs Wahlzeilen |
| FS5 | 03 `fb-05` | 2.742–3.776 | 1.898 · 2.670 · 3.720 | 4–5 · 5–6 | ≈ 2.446 Auftritt 600 ms → ≈ 2.585–2.796 Explosion mit Trägheit → Linien 320 ms | – | Textziel → `#pakete` |
| FS6 | 04.1 `fb-06` | 3.872–5.008 | 3.028 · 3.800 · 4.952 | 5–6 · 6–8 | Wischen → Karte 1 : 1, Bild mit Feder ≈ 420 ms; Segment → Reihe waagerecht glatt | – | Cream am Kartenknopf (y 4.399) |
| FS7 | 04.2 `fb-07` | 5.008–5.154 | 4.164 · – · 5.098 | 6–7 · 8 | Tipp → Tabelle 220 ms | – | Zeile „Alle Merkmale im Vergleich“ |
| FS8 | 04.3 `fb-08` | 5.154–5.712 | 4.310 · – · 5.656 | 7 · 8–9 | – | – | Ring „Rückruf oder Nachricht“ |
| FS9 | 05 `fb-09` | 5.808–6.972 | 4.964 · 5.736 (`#frage` 5.969) · 6.916 | 7–9 · 9–11 | Kartenknopf → glattes Rollen; Eingabe → Hinweise 220 ms; Senden → Wartering | – | Cream „Frage senden“ (y 6.818) |
| FS10 | Dank | am Ort von `#frage` | – · 5.969 · – | 8 · 10 | Senden → Formular aus 165 ms, Dank ein 220 ms, Haken 1,3 s | – | Ring „Zurück zu den Paketen“ |
| FS11 | 06.1 `fb-10` | 7.068–7.957 | 6.224 · 6.996 · 7.901 | 9–10 · 11–12 | Wortzeile passiert die Mitte (≈ 6.904 … 7.440) → Marke grün, 220 ms (Zustand) | – | Fundstelle „§ 7 (2)“ |
| FS12 | 06.2 `fb-11` | 8.053–8.812 | 7.209 · 7.981 · 8.756 | 10–11 · 13–14 | Kachel ≥ 60 % (ab ≈ 7.427) → Haken nacheinander je 320 ms | – | Link „§ 10“ |
| FS13 | A1–A3 | 8.908–10.234 | 8.064 · – · 10.178 | 11–13 · 14–16 | Tipp → Antwort 220 ms | – | Ring A1, Weiterweg A2 |
| FS14 | A4 `fb-15` | 10.330–10.755 | 9.486 · ≈ 10.030 · 10.699 | 13 · 16–17 | – (Wahlwechsel außerhalb des Bilds) | – | Cream-Zeile (y 10.576) |
| FS15 | Brotkrumen, Fuß | 10.851–11.620 | 10.007 · – · Ende | 13–14 · 17–18 | – | – | – |

### 12.5.3 Kopf entlang der Seite für Fensterbauer

| scrollY (844) | scrollY (664) | Zustand A (heute) | Zustand B (`PAKETE_OFFEN=1`) | Übergang |
|---|---|---|---|---|
| 0 – ≈ 256 | 0 – ≈ 256 | flächenlos über dem Scrim, Ring verborgen | gleich | – |
| ≈ 256 | ≈ 256 | opak mit Haarlinie (Kicker erreicht Kopfkante + 8 px, K-27) | gleich | 150 ms ein, 110 ms aus, Hysterese 24 px |
| ≈ 538 | ≈ 538 | Ring „Pakete ansehen“ (Cream von V1 unter dem Kopf) | gleich | 220 ms ein, 165 ms aus |
| ≈ 3.549 – 4.952 | ≈ 3.657 – 4.952 | Ring ausgeblendet (Namensleiste oder Kartenreihe im Band bis 60 % der Höhe) | gleich | wie oben |
| ≈ 4.952 – 5.084 | ≈ 4.952 – 5.264 | Ring „Paket anfragen“ → `#frage` (12.9 Nr. 7) | Ring „Pakete ansehen“ bis zum Seitenende | Textwechsel im ausgeblendeten Zustand |
| ≈ 5.084 – 6.800 | ≈ 5.264 – 6.800 | Ring ausgeblendet (mindestens 120 px von 05 im Bild) | – | 165 ms aus |
| ab ≈ 6.800 | ab ≈ 6.800 | Ring „Paket anfragen“ bis zum Seitenende; nach dem Dank „Pakete ansehen“ | – | 220 ms ein |

Weniger Bewegung: dieselben Zustände; Deckkraftwechsel bleiben (sie sind keine Bewegung). Ohne JavaScript ist der Kopf opak und der
Ring „Pakete ansehen“ sichtbar.

### 12.5.4 Ansicht Hauseigentümer `/#hauseigentuemer`

Länge 5.736 px = 6,8 BH; größter Scrollstand 4.892 (664: 5.072).

| Szene | Abschnitt | Seiten-y | scrollY Eintritt · Ruhelage · Austritt | Bildschirm 844 · 664 | bewegter Träger: Auslöser → Verlauf | Handlung im Bild | Kopfknopf „Fenster ausmessen“ |
|---|---|---|---|---|---|---|---|
| HA1 | H1 `he-01` + `st-02` | 0–680 | – · 0 · 624 | 1 · 1–2 | Laden → Foto 900 ms, dann Glas 320 ms; erste Eingabe → 220 ms | Cream „Jetzt ausmessen“ (y 550), Ring „Führung starten“, Umschalter | verborgen; Kopf ab ≈ 4 opak |
| HA2 | H2 `he-02` | 776–1.474 | ab 0 angeschnitten · 704 · 1.418 | 1–2 · 2–3 | 25 % sichtbar (≈ 107) → Karte 600 ms; Tippen → Maßlinie 600 ms, Etikett nach drei Werten | Cream „Jetzt ausmessen“ (y 1.422) | erscheint ≈ 546; Ring ≈ 578 – 1.418 |
| HA3 | H3 `he-03` | 1.570–2.542 | 726 · 1.498 · 2.486 | 2–4 · 3–4 | Blattoberkante bei 70 % (≈ 1.167) → Blatt 600 ms, Etikett + 280 ms | – | Cream ab ≈ 1.418 |
| HA4 | H4 `he-04` | 2.638–3.190 | 1.794 · 2.566 · 3.134 | 4 · 4–5 | Fassung A: keiner; B: Miniaturen 600 ms, gestaffelt | Ring „Führung starten“ | Cream |
| HA5 | H5, H6 | 3.286–4.172 | 2.442 · 3.214 · 4.116 | 4–5 · 5–7 | Ankerkachel halb im Bild → Maßlinien ≈ 600 ms [H]; Fragen 220 ms | Kacheln (Links) | Cream bis ≈ 3.743 |
| HA6 | H7, Wechselkarte | 4.268–4.908 | 3.424 · ≈ 3.987 · Ende | 6 · 7–8 | – | Cream „Jetzt ausmessen“ (y 4.587), Ring der Wechselkarte | Ring ≈ 3.743 – 4.583, danach Cream |
| – | Fuß | 5.004–5.736 | 4.160 · – · Ende | 6–7 · 8–9 | – | – | Cream |

### 12.5.5 Einbettung und Hinweis zum Aufmaßblatt

| Ort | Unterschied zur Timeline 12.5.2 |
|---|---|
| `/#fensterbauer` | alle Seiten-y und scrollY + 52 px; Kopf opak ab scrollY ≈ 4; Kopf-Ring ab ≈ 590; nach A4 die Wechselkarte (y 10.903–11.076) statt der Brotkrumen; Ende y 11.904; Sprünge ohne Ankerwechsel |
| `/?von=pdf#fensterbauer` | wie oben; Hinweiskarte y ≈ 124–292 statt des Stapels; Ladeauftritt endet nach 2,1 s; sonst unverändert |

---

## 12.6 Scroll Experience Timeline – Schreibtisch 1280 × 800

Lagen als Überschlag aus den Spezifikationen (wie in WF: Seite für Fensterbauer ≈ 10.526 px = 13,2 BH, Ansicht Hauseigentümer ≈ 4.652 px
= 5,8 BH). Ruhelage `y − 80` (Haarlinie 16 px unter dem 64-px-Kopf), Eintritt `y − 800`, Austritt `y_unten − 64`.

### 12.6.1 Seite für Fensterbauer

| Szene | Abschnitt | Seiten-y (≈) | scrollY Eintritt · Ruhelage · Austritt | Bildschirm 800 | bewegter Träger, Unterschied zum Telefon | Handlung im Bild | Kopf |
|---|---|---|---|---|---|---|---|
| FS1 | V1 | 0–704 | – · 0 · 640 | 1 | Ladeauftritt wie am Telefon; Split 5 : 7, Stapel rechts über der Stationsdecke | Cream und Ring nebeneinander (y 470–522) | flächenlos bis ≈ 169, Ring ab ≈ 458 |
| FS2 | V2 | 704–880 | ab 0 sichtbar · – · 816 | 1–2 | Scrollen 0 → ≈ 680, Faktor 0,42; Band 176 px, 9–10 Kacheln | – | Ring „Pakete ansehen“ |
| FS3 | 01 | 1.008–1.828 | 208 · 928 · 1.764 | 2–3 | Bühne ≥ 60 % und Leiste ruht → Browser- und Telefonbildschirm gehen gemeinsam an (600 ms); `sticky` nur als Sicherung | Textziel bzw. Feld 419 × 52 | Ring |
| FS4 | 02 | 1.956–2.396 | 1.156 · 1.876 · 2.332 | 3 | Gerät ≥ 50 % → Licht 900 ms; Tippen wie Telefon; Hover auf Zeilen = Kontur | Wahlzeilen 197,5 × 52 | Ring |
| FS5 | 03 | 2.524–3.284 | 1.724 · 2.444 · 3.220 | 4–5 | Auftritt und Explosion nach denselben Schwellen (72 %, 70 → 45 % von 800 px); ohne Anheften | Textziel | Ring |
| FS6 | 04.1 | 3.417–5.042 | 2.617 · 3.337 · 4.978 | 5–7 | kein Wischen; drei Karten, alle Bilder im ersten Bildschirm nach dem Sprung; Hover hebt Marke im Bild | Cream an der Mittelkarte, zwei Ringe gleicher Größe daneben | aus ≈ 3.065 – 4.978 |
| FS7 | 04.2 | 5.042–5.187 | 4.242 · – · 5.123 | 7 | Tipp → vierspaltige Tabelle, Kopf klebt bei 64 | Zeile | „Paket anfragen“ (A) |
| FS8 | 04.3 | 5.187–5.597 | 4.387 · – · 5.533 | 7 | – | Ring rechts oben neben den Fakten | aus ab ≈ 5.045 |
| FS9 | 05 | 5.725–6.445 | 4.925 · 5.645 · 6.381 | 8–9 | Kartenknopf → glattes Rollen; Formular zweispaltig | Cream nach Inhalt ≈ 190 × 52 | aus bis ≈ 6.261 |
| FS10 | Dank | an `#frage` (y 124) | – · 5.645 · – | 8 | wie Telefon | Ring zurück | „Pakete ansehen“ |
| FS11 | 06.1 | 6.573–7.257 | 5.773 · 6.493 · 7.193 | 9–10 | Marken an der Bildschirmmitte; ganzer Abschnitt in einem Bildschirm | Fundstelle | „Paket anfragen“ |
| FS12 | 06.2 | 7.385–7.917 | 6.585 · 7.305 · 7.853 | 10 | Haken nacheinander; mehrere Kacheln zugleich im Bild → Warteschlange | Link | „Paket anfragen“ |
| FS13 | A1–A3 | 8.045–9.279 | 7.245 · – · 9.215 | 11–12 | Aufklappen 220 ms | Ring A1, Weiterweg | „Paket anfragen“ |
| FS14 | A4 | 9.407–9.899 | 8.607 · 9.327 · 9.835 | 12–13 | Zeiger oder Fokus auf Zeile → Vorschau 220 ms [H] | Cream-Zeile 508 × 64 | „Paket anfragen“ |
| FS15 | Fuß | 10.027–10.526 | 9.227 · – · Ende (größter Stand 9.726) | 13–14 | – | – | „Paket anfragen“ |

Kopf am Schreibtisch: 64 px; Sprungmarken „So funktioniert es“, „Ablauf“, „Fragen“, rechts „Anmelden“ und der Ring. Die Pakete beginnen
bei ≈ 4,3 BH (ZA plante ≈ 4,0; 12.9 Nr. 12).

### 12.6.2 Ansicht Hauseigentümer

| Szene | Abschnitt | Seiten-y (≈) | scrollY Eintritt · Ruhelage · Austritt | Bildschirm 800 | bewegter Träger, Unterschied zum Telefon | Handlung im Bild | Kopfknopf |
|---|---|---|---|---|---|---|---|
| HA1 | H1 | 0–576 | – · 0 · 512 | 1 | Foto 900 ms; Umschalter flach im Kopf, kein Glas; keine Tiefe (K-9) | Cream und Ring nebeneinander (y 499–551) | verborgen; Kopf opak ab ≈ 160 |
| HA2 | H2 | 704–1.220 | ab 0 angeschnitten · 624 · 1.156 | 1–2 | Karte 597 × 500 rechts; Tippen wie Telefon | Cream (y ≈ 1.066) | erscheint ≈ 487 als Ring (H2-Cream schon im Bild) |
| HA3 | H3 | 1.348–2.124 | 548 · 1.268 · 2.060 | 2–3 | Blatt legt sich; [H] Szene `sticky` ≈ 0,39 BH | – | Cream ab ≈ 1.054 |
| HA4 | H4 | 2.252–2.642 | 1.452 · 2.172 · 2.578 | 3–4 | Fassung A als Band über 12 Spalten | Ring „Führung starten“ | Cream |
| HA5 | H5, H6 | 2.770–3.349 | 1.970 · 2.690 · 3.285 | 4–5 | Kacheln in einer Reihe, Anker 1,5-fach breit | Kacheln | Cream |
| HA6 | H7, Wechselkarte | 3.477–4.111 | 2.677 · 3.397 · 4.047 | 5–6 | – | Cream 218 × 52 (y ≈ 3.691) | Ring ≈ 2.891 – 3.679, danach Cream |
| – | Fuß | 4.239–4.652 | 3.439 · – · Ende (größter Stand 3.852) | 6 | – | – | Cream |

### 12.6.3 Was am Schreibtisch anders ist

- **Split 5 : 7 an derselben Ordnungslinie** in jedem Abschnitt mit Held (Text Spalten 1–5, Held Spalten 6–12); bei 1024 × 768 Rand 32,
  Spalte 960, 12 Spalten à 58 px; 6 : 6 nur, wo eine h2 in fünf Spalten dreizeilig bräche (`he-04`, `he-07` bei 1024).
- **Kein Wischen, mehr Hover:** Paketkarten nebeneinander, Hover über Kontur und Farbe; Leiste und Reihe der Leiste bleiben scrollgekoppelt.
- **Angeheftet wird nichts Wirksames:** `fb-03` hält `sticky` nur als Sicherung (≤ 1,1 BH), `he-03` als Hypothese (≈ 0,39 BH); keine Bühne
  klebt über zwei Kapitel (E-8).
- **Nichts wächst:** h1 und h2 40 px, Knöpfe 52 px wie am Telefon, Spalte 1040 px (SKILL:28).
- **Kopf-Ring** nach denselben Regeln; weil am Schreibtisch keine Namensleiste steht, schneidet nur die Kartenreihe das Band.

---

## 12.7 Ruhige Fassung je Szene („weniger Bewegung“), ohne JavaScript, Neuaufbau

`prefers-reduced-motion: reduce` zeigt das Endbild jeder Szene ab dem ersten Bild: keine Schleife, keine Tiefe, kein Anheften, keine
Scrollkopplung, kein Versatz; Farb- und Deckkraftwechsel bleiben; Ansichts- und Seitenwechsel als Schnitt (DS 11.7.7, SG 10.7/7).

| Szene | normal bewegt sich | weniger Bewegung | ohne JavaScript | Neuaufbau in `/#fensterbauer` |
|---|---|---|---|---|
| FS1 V1 | Foto, Meldungen, Maßlinie (0–4,1 s) | Endbild: drei Meldungen, Maßlinie „1.200 mm“, Licht steht, kein Zoom | Endbild ohne Maßlinie, Stapel an der CSS-Lage | kein zweiter Ladeauftritt |
| FS2 V2 | Reihe nach Scrolltempo, Wölbung, Namen | native Wischreihe, Kacheln 72 px, Namen unter jeder Kachel, stilles Licht | wie weniger Bewegung | Index der Mitte bleibt |
| FS3 01 | Gerätebildschirm geht an; Name blendet über | Bildschirm an; Name ohne Überblendung; Feld ohne Einblenden | Bildschirm an, „Fensterbau Brandt“, kein Feld | Name aus dem Zustand, Bildschirm an |
| FS4 02 | Licht geht an; Bild 500 ms; Bildfolge 1,2 s | Licht steht; 120 ms oder Schnitt; Raffstore als Schnitt | zwei Standbilder mit je einer Zeile | Wahl aus dem Zustand, ohne Bewegung |
| FS5 03 | Auftritt, Explosion, Linien | Endbild: Schichten offen, Linien da | Endbild aus CSS, sieben Sätze offen | im Bild oder darüber: Endbild |
| FS6 04.1 | Bild mit Feder beim Wischen | kein Nachlauf; Wischen nativ; Segment ohne Glätten | Reihe nativ, Listen offen, Knöpfe zu `#bestellen` | Wahl je Wurzel |
| FS7 04.2 | Inhalt blendet ein | Öffnen sofort | `details` nativ | offen oder zu wird nicht gespeichert |
| FS8 04.3 | – | identisch; Sprung des Rings sofort | identisch, nativer Sprung | – |
| FS9 05 | Hinweise, glattes Rollen, Wartering | Hinweise sofort, Sprung ohne Glätten, Ring steht | normales Absenden | Werte aus der Modulvariable |
| FS10 Dank | Überblendung, Haken 1,3 s | Schnitt, Haken als Endbild | Dankesseite des Servers | Merker: sofort Dank ohne Haken-Lauf |
| FS11 06.1 | Marken werden grün | alle Marken grün | alle Marken grün | Zustand sofort |
| FS12 06.2 | Haken werden gezogen | Haken stehen | Haken stehen | nie ein zweites Mal |
| FS13 A1–A3 | Antworten blenden ein | sofort | `details` nativ | – |
| FS14 A4 | Vorschau-Überblendung am Schreibtisch | Schnitt | Cream an „Empfohlen“, Vorschau Plus | Wahl und Merker aus dem Zustand |
| FS15 Fuß | – | identisch | identisch | – |
| HA1 H1 | Foto, Glas | Foto sofort voll, Glas sofort | statisches Startbild, Umschalter als zwei Links | – |
| HA2 H2 | Karte, Maßlinie, Zählen, Feder [H] | Karte steht; Tipp zeigt Endwert als Schnitt; Rücktritt ≤ 150 ms Deckkraft | Endbild in der Textfassung | Zustand wiederhergestellt, ohne Animation |
| HA3 H3 | Blatt legt sich, Etikett folgt | Endbild | Textfassung | einmal je Aufbau |
| HA4 H4 | Miniaturen (Fassung B) | sofort sichtbar | Textfassung ohne Maßstab und Bilder | – |
| HA5 H5, H6 | Maßlinien in der Ankerkachel [H] | Endbild | Links | – |
| HA6 H7, WK | – | identisch; Seitenwechsel ohne Übergang | identisch | – |
| SR1 Wechsel | Einblenden 220 ms, Foto-Auftritt | Schnitt ohne Foto-Auftritt | Anker-Links | – |
| SR3 `?von=pdf` | kürzerer Ladeauftritt | Karte identisch, V1 als Endbild | keine Einbettung, Textfassung | – |
| SR4 Menü | Blatt blendet, Wischen, Abwurf | Deckkraft, Wischen 1 : 1, kein Weiterlaufen | Link zur Navigation im Fuß | – |

---

## 12.8 Prüfung gegen die Regeln

| Regel | Quelle | Prüfung im Storyboard | Ergebnis |
|---|---|---|---|
| ein bewegter Träger je Ansicht, auch beim Laden | SG 10.7/4; K-6; E-2 | Übergaben: Ladeauftritt → erste Eingabe beendet ihn → Leiste (0 → ≈ 495) → Gerätebildschirm erst nach `vk:leiste-ruht` (≈ 537) → Licht 02 (≈ 1.393) → Blatt-Auftritt (≈ 2.446), Explosion erst danach (≈ 2.585) → ab 04 nur fingergeführt; Ansicht Hauseigentümer: Foto → Glas → Karte H2 (≈ 107) → Blatt H3 (≈ 1.167) | erfüllt unter Festlegung 12-1; Prüfpunkt Marke 06 und Ankerhaken (12.9 Nr. 9) |
| Bedienschicht ohne Auftritt | K-6; DS-AB-8 | in keiner Szene blendet Text, Knopf oder Karte beim Eintritt ein; Einblenden nur nach Eingabe (Feld, Hinweis, Dank, Tabelle, Kopf-Ring) | erfüllt; `he-02` F weicht ab (12.9 Nr. 2) |
| autonome Bewegung ≤ 5 s, keine Schleife | WCAG 2.2.2; DG-AB-5 | V1 4,1 s; `?von=pdf` 2,1 s; H1 ≈ 1,2 s; `ap-01` 0,9 s; Haken 06.2 ≤ 1,3 s | erfüllt |
| jede Szene endet in einem komponierten Ruhebild; ruhige Fassung vollständig | SG 10.7/6, /7; DNA 5.5 | 12.7 je Szene | erfüllt |
| Physik nur in der Bildschicht; keine Feder an Bedienelementen | DG G1; SG 10.7/2; K-37 | Trägheit: Leiste, Explosion; Feder: Beispielbild 04.1, Endstrich H2 [H]; Abwurf: Leiste, Menüblatt; Karten, Knöpfe, Zeiger, Segmente ohne Überschwingen | erfüllt |
| Tiefe der Bildebenen nur in Stufe 4 | K-9 | nur V1 (und dort nach 12-1 praktisch nicht bei 844) | erfüllt |
| am Telefon kein Anheften; Schreibtisch ≤ 1,2 BH | SG 10.7 Mobil; E-8 | Telefon keine; Schreibtisch `fb-03` Sicherung ≤ 1,1 BH, `he-03` [H] ≈ 0,39 BH | erfüllt |
| senkrechte Sprünge sofort, glatt nur ohne Szene dazwischen | K-10 | 12.3; Ausnahme glatt nur Kartenknopf → `#frage` und Segment → Karte | erfüllt; `fb-09`, `rh-03` anzugleichen (12.9 Nr. 3, 4) |
| Licht an höchstens zwei Orten, nie in Folge; nur in den ersten vier BH | Dosierregel 3; DS 11.1.5 | V1 (mit Kegel in V2) und 02, dazwischen 01 | erfüllt |
| Glas ≤ 2 gleichzeitig am Telefon, nie über bewegtem Motiv | DS 11.10.1 Nr. 11 | V1: Stapel (vordere Meldung); Einbettung: Umschalter + vordere Meldung = 2; Glas des Umschalters in H1 erst nach dem Foto | erfüllt; Zeitpunkt in V1 der Einbettung offen (12.9 Nr. 11) |
| eine Cream je Bildschirm | SKILL:71 | Seite für Fensterbauer: y 542, 4.399, 6.818, 10.576 (Abstände ≥ 2.367 px); Hauseigentümer: y 550, 1.422, 4.587; der Kopf trägt im Kontext Fensterbauer nie Cream, im Kontext Hauseigentümer nur ohne Cream im Inhalt | erfüllt; Prüfpunkt 32-px-Fenster am Kopfknopf (12.9 Nr. 8) |
| Preissignal und Cream im ersten Bildschirm bei 390 × 664 | E-1 | V1: Preiszeile y 510–527, Cream 542–594; Einbettung 562–579 und 594–646; H1: 506–542 und 550–602 | erfüllt (geplant) |
| Pakete am Telefon spätestens Bildschirm 5 bis 6 | EA H-D2 [H] | Bildschirm 5 (844), 6 (664) | erfüllt |
| ein Held je Bildschirm, nicht textlich außer in Arbeitsflächen | DG G3, G4; DNA Nr. 3 | Hauptobjekt je Szene benannt; ohne Held nur 04.2, 04.3, 05, Anhänge (DG-E-1 C) | erfüllt |
| ehrlich gekennzeichnet | SKILL:49; K-36 | „Beispiel“ an Meldungen, Gerät, Render, Blatt, Beispielbildern, Zeichnung, Vorschau; eine Beispielfirma, eine Beispielfamilie, eine Beispieldomain; keine Stimmen, Zähler, Siegel | erfüllt |
| keine fremden Server | SKILL:60 | alle Bewegungen mit CSS, schlankem JavaScript, Lottie aus `web/vendor/`, View Transitions des Browsers | erfüllt |
| Einbettung und Neuaufbau | SKILL:63–64 | SR2; 12.7 letzte Spalte | geplant, zu prüfen |

---

## 12.9 Abgleich mit den Abschnitts-Spezifikationen

Beim Hintereinanderlegen der Spezifikationen fallen Stellen auf, an denen zwei Dokumente für denselben Moment Verschiedenes sagen oder ein
Moment nicht festgelegt ist. Das Storyboard folgt der Rangfolge aus DS; wo die nicht entscheidet, steht eine Festlegung 12-n.

| Nr. | Stelle | Widerspruch oder Lücke | im Storyboard | nachzuziehen |
|---|---|---|---|---|
| 1 | **Festlegung 12-1** Foto-Tiefe V1 und Leiste V2 | `fb-01` F.2 und DS 11.7.4 / 11.1.6: Foto-Tiefe bis die Leiste die Bildschirmmitte erreicht (844: scrollY 268), die Leiste steht, sobald das Gerät aus 01 den unteren Rand erreicht (≈ 285); wörtlich bewegte sich die Leiste am Telefon nur ≈ 17 px. `fb-02` (Festlegung V2-3): Kopplung ab dem ersten Scrollschritt, bis das Gerät zu 50 % im Bild ist; die Foto-Tiefe endet, sobald das Band im Bild ist | `fb-02` V2-3: Die Leiste reagiert ab dem ersten Scrollschritt (scrollY 0 → ≈ 495; 664: 26 → 675). Die Foto-Tiefe läuft nur, solange das Band nicht im Bild ist, bei 844 und 800 also nicht (ihr Rückfall „ohne Foto-Tiefe“, DG-AB-15). Grund: genau ein Träger [V]; die scrolltempo-geführte Leiste ist die Reaktion auf die Scrollgeschwindigkeit, die der Inhaber verlangt (SKILL:44); eine sichtbar stehende Leiste beim ersten Scrollen widerspräche dem. Rückfall [H]: DS 11.7.4 wörtlich mit dem Ende aus V2-3 (Foto-Tiefe 0 → 268, Leiste 268 → ≈ 495, dann ≈ eine Kachel Versatz) | `fb-01` F.2, DS 11.7.4 und 11.1.6 |
| 2 | Einblenden der Bedienschicht in H2 | `he-02` F: Bedienschicht blendet beim Eintritt 320 ms ein; K-6 schließt das aus (Anhang 11.A Nr. 6 nennt nur `he-03`, `he-04`) | K-6: Bedienschicht steht, nur die Karte hat ihren Motiv-Auftritt | `he-02` F |
| 3 | Kartenknopf → `#frage` | `fb-06` F, PE F und K-10: glattes Rollen zulässig; `fb-09` F: Sprung `behavior: 'auto'` | glatt (keine Szene dazwischen), ruhige Fassung ohne Glätten | `fb-09` F |
| 4 | Fuß „Konfigurator-Pakete“ | `rh-03` F: `scroll-behavior: smooth` ohne reduzierte Bewegung; K-10: dazwischen liegen die Ablauf-Marken (DS 11.7.4) | sofort | `rh-03` F |
| 5 | Titel des Festblocks | `fb-07` C, E: Kennwort „VERTRAG IN KÜRZE“; `fb-08` B.2: h3 „Vertrag und Kündigung“ (Textentwurf) | `fb-08` (der Block besitzt seinen Titel) | `fb-07` C, E |
| 6 | Haken in 06.2 | `fb-11` F: Anker 500 ms, übrige 320 ms; DS 11.7.1 setzt die 500 ms auf 320 ms | 320 ms je Haken, zusammen ≤ 1,3 s | `fb-11` F |
| 7 | Kopf-Ring zwischen Kartenreihe und 05 (Zustand A) | K-28 ergibt eine kurze Sichtbarkeit von „Paket anfragen“: Telefon 844 ≈ 132 px Scrollweg (scrollY ≈ 4.952–5.084), 664 ≈ 312 px, Schreibtisch ≈ 67 px; bei zügigem Scrollen ein Aufblitzen (SKILL:48 „nichts blinkt“) | Zustände wie K-28 in 12.5.3, als Prüfpunkt markiert. Vorschlag [H]: Der Ring bleibt ausgeblendet, wenn zwischen dem Ende der Reihen-Sperre und dem Beginn der 05-Sperre weniger als eine halbe Bildschirmhöhe liegt | DS K-28, `rh-01` F (nach Freigabe) |
| 8 | Kopfknopf der Hauseigentümer zwischen H1 und H2 | `rh-01` F: Knopf erscheint, sobald die H1-Cream unter dem Kopf ist (≈ 546), Ring erst, wenn die H2-Cream ins Bild kommt (≈ 578); dazwischen 32 px in Cream. Die Hysterese von 24 px fängt das nicht | Prüfpunkt. Vorschlag [H]: Der Knopf erscheint gleich im Zustand, der nach der Hysterese gälte (hier Ring) | `rh-01` F (nach Freigabe) |
| 9 | Marke 06 (06.1) und Ankerhaken (06.2) | beide setzen bei 844 fast gleichzeitig ein (scrollY ≈ 7.440 und ≈ 7.427) | zulässig, weil der Markenwechsel ein Farbwechsel ist und keine Bewegung (SG 10.7); Prüfpunkt im Telefon-Video. Rückfall [H]: der erste Haken startet 220 ms nach dem letzten Markenwechsel | `fb-11` F (nur bei Rückfall) |
| 10 | 03 bei Ankunft von unten | `fb-05` F legt Neuaufbau und Rückwärtsscrollen fest, nicht die Ankunft nach einem Sprung über 03 mit anschließendem Zurückscrollen | Vorschlag [H]: Endbild ohne Auftritt, wie `fb-01` F.1 (Einstieg mitten in der Seite) und `he-03` F (Blatt schon über dem Bild) | `fb-05` F |
| 11 | Glas des Umschalters in V1 der Einbettung | `st-02` F legt das Klären (Ersatz 80 % → Glas, 320 ms nach dem Foto) nur für H1 fest; in V1 fiele es in Meldung 1 (0,9 s) | Vorschlag [H]: als Deckkraftwechsel gleich nach dem Foto (0,9–1,22 s); zeigt das Telefon-Video Konkurrenz mit Meldung 1, nach der Maßlinie (4,1–4,42 s) | `st-02` F, `fb-01` F.5 |
| 12 | Längen und Lagen | aus den gemessenen Spezifikationen (WF) ergeben sich: Formular-Überschrift bei 664 in Bildschirm 10 (Abschnitt beginnt in 9; ZA plante 9), Abschluss bei 664 in Bildschirm 16–17 (ZA 14), Pakete am Schreibtisch bei ≈ 4,3 BH (ZA ≈ 4,0) | Werte aus WF übernommen | Bildschirmzählung am Prototyp (EV X9); EA H-D2 |
| 13 | Dauern der Zeichnungen | `he-02` 640 ms, `he-05` 650 ms; DS 11.7.1 setzt beide auf 600 ms | 600 ms | `he-02` F, `he-05` F |

---

## 12.10 Verbindliche Regeln und Hypothesen des Storyboards

### 12.10.1 Verbindliche Regeln [V]

1. **Ein Träger, eine Übergabe.** Jede Szene endet, bevor die nächste beginnt; die Reihenfolge der Träger steht in 12.1.3 und 12.8.
   Farb- und Deckkraftwechsel (Kopf, Marken, Zustände) zählen nicht als Träger (SG 10.7; K-6).
2. **Die Bedienschicht bewegt sich nie.** Kein Auftritt, kein Versatz, keine Skalierung; Einblenden nur nach einer Eingabe (K-6; DNA Nr. 1).
3. **Jede Szene trägt als Standbild.** Endbild = ruhige Fassung = Fassung ohne JavaScript, soweit die Funktion kein Skript braucht
   (SG 10.7/6, /7; DNA 5.5).
4. **Sprünge sofort, glatt nur ohne Szene dazwischen** (K-10); nach jedem Sprung liegt der Fokus auf dem Ziel-h2 bzw. der h3 `#frage`.
5. **Natives Scrollen:** kein Anheften am Telefon, keine Scrollsteuerung, keine Veränderung des Scrolltempos (DS 11.7.2; SG 10.7).
6. **Licht nur vorne:** Erdlicht, Keil, Kegel und der Lichtfleck in 02 sind die einzigen Lichtquellen der Seite für Fensterbauer; ab 03
   kein Licht (Dosierregel 3).
7. **Eine Cream je Bildschirm** an den in 12.8 genannten Stellen; der Kopf im Kontext Fensterbauer nur als Ring.
8. **Autonome Bewegung ≤ 5 s, keine Schleife;** Schleifen und rAF-Arbeit nur, solange die Szene im Bild ist (SKILL:61).
9. **Kopf und Ordnungslinie stehen;** keine Kapitelanzeige, kein Lesefortschritt (ZA N6, 8.2.2).
10. **Einbettung gleich:** dieselben Szenen in `/#fensterbauer`, kein zweiter Ladeauftritt nach Neuaufbau (SKILL:63–64).

### 12.10.2 Experimentelle Gestaltungshypothesen [H]

Prüfwege: Telefon-Video bei 390 × 844 und 664 (SKILL, Abschnitt 8), Test des Inhabers am eigenen Telefon, Lesetests mit Fensterbauern.
Vergleichstests sind nicht eingerichtet; über Wirkung auf Anfragen sagt keine Zeile etwas aus.

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| ST-H-1 | Der Objektfaden (Figur → Rendering → Gerät oben → Gerät unten → Blatt → Beispielbild → Mini-Gerät) wird als eine Geschichte gelesen: „mein Konfigurator, was mein Kunde tut, was bei mir ankommt, was es kostet“ | Video der ganzen Seite; Lesetest „Was haben Sie gerade gesehen?“ nach dem Scrollen bis 04 | Kapitelzeilen allein tragen die Folge (ZA H-E8); bei Material-Engpass die Alternativen „E mit Standbildern“ bzw. C′ (ZA 8.3.2 g) |
| ST-H-2 | Der Schnitt 01 → 02 (dasselbe Gerät, tiefere Kadrierung) liest sich als Fortsetzung, nicht als Wiederholung | Video; Frage „Ist das dasselbe Telefon?“ | Rückfall von `fb-04`: Probe als zwei Standbilder ohne Gerät (H-E1) |
| ST-H-3 | Die Leiste ab dem ersten Scrollschritt (Festlegung 12-1) wirkt lebendiger als eine Foto-Tiefe im Startbild und ersetzt sie | Video bei 844 und 664, Urteil des Inhabers | DS 11.7.4 wörtlich (12.9 Nr. 1) |
| ST-H-4 | Die lange ruhige Strecke ab den Paketen (≈ 6 BH ohne Bildbewegung außer am Finger) wirkt nicht leer, sondern verlässlich (= DS-H-1) | Video der ganzen Seite | 01 als Stufe 3, 03 als Stufe 2 (DS-H-1) |
| ST-H-5 | Sofortige Sprünge verlieren die Orientierung nicht, weil der Fokus am Ziel landet (= DS-H-8) | Video, Lesetest „Wo bin ich jetzt?“ | glattes Rollen mit pausierten Szenen |
| ST-H-6 | Der Lichtfaden Bullauge → Kegel → Lichtfleck wird als Markenfaden gelesen (= H-E5) | Video | Keil und Kegel entfallen, Licht nur im Foto und in 02 |
| ST-H-7 | Die Ansicht Hauseigentümer wirkt ohne Einblenden der Bedienschicht nicht starr (= DS-H-9) | Video H2 bis H4 | Einblenden 320 ms nur in H3 |

### 12.10.3 Abweichungen von bestehenden Regeln, die die Dramaturgie voraussetzt

Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Alle sind bereits in ZA 8.4.5, DS 11.B oder
den Spezifikationen geführt; hier steht, wofür das Storyboard sie braucht. Name, Wortmarke und Logo bleiben unverändert.

| Nr. | bestehende Regel | im Storyboard | Begründung für die Dramaturgie |
|---|---|---|---|
| E-AB-4, EA AB-8, DG-AB-5 | Meldungen im Startbild fallen alle 3,4 s neu ein (GEST:447) | drei Meldungen einmal, Ende nach 2,9 s, Stand ab 4,1 s | autonome Bewegung ≤ 5 s (WCAG 2.2.2); die Bühne endet, bevor die Leiste übernimmt |
| DG-AB-5 | Leisten laufen dauernd mit 30 px/s, Hover verlangsamt (GEST:451) | Leiste nur nach Scrolltempo und Finger, mit Trägheit | „Laufband reicht nicht“ (SKILL:44); Reaktion auf den Besucher statt Selbstlauf |
| DS-AB-8, DG-AB-2 | Karten und Bänder erscheinen 24 px aufwärts, 0,98 → 1; Blöcke 8 px aufwärts (GEST:39, :448) | Bedienschicht ohne Auftritt, auch ohne Deckkraft-Einblenden | sonst liefe neben jedem Motiv-Auftritt ein zweiter Träger; ohne JavaScript sofort sichtbar |
| DS-AB-9 | „Beim Laden geht das Licht einmal an“ (GEST:7) | Logo-Licht nur auf Seiten ohne Bühnen-Ladeauftritt | ein Auftritt im ersten Bildschirm |
| EA AB-10, DG-AB-13 | feste Telefon-Bühne bis zwei Bildschirmhöhen (DR 3.5) | am Telefon nichts angeheftet | natives Scrollen, Szenen enden über Ereignisse statt über Anheftstrecken |
| J-AB-3, DG-AB-4 | Paketreihe läuft einmal ein und federt zurück (GEST:452) | kein Einlauf; der Anschnitt der Nachbarn zeigt das Wischen; Feder nur im Bild | Bedienelemente federn nicht (SG 10.7/2) |
| F10-AB-1, F10-AB-2 | Ablauf als Zeitleiste, deren Linie scrollgebunden grün wächst (GEST:447, :448; DR Baustein 7) | Marken wechseln als Zustand, keine wachsende Linie | nach den Paketen keine weitere Scrollszene; ein Farbwechsel statt einer Bewegung |
| DS-AB-8 (Ansichtswechsel, `st-04`) | Bildschirmwechsel `.scr.anim` mit 6 px Versatz (`portal.css:210-211`; GEST:39) | Ansichtswechsel als Einblenden über Deckkraft 220 ms, dann Foto-Auftritt der neuen Bühne | Szenenwechsel unter stehender Bedienung (SG 10.7/5) |
| DG-AB-15 | „Parallaxe … und Lesefortschritt gibt es nicht“ (GEST:41) | Lesefortschritt entfällt (deckt sich mit GEST:41); die Foto-Tiefe in V1 läuft nach Festlegung 12-1 am Telefon und bei 800 px Höhe praktisch nicht | Die Abweichung DG-AB-15 wird nur gebraucht, wenn der Rückfall zu 12-1 gewählt wird |

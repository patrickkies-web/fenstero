# 06.1 Ihr Start: Ablauf-Maßstab (#ablauf)

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 10 von 15 (Kapitel 06, Block 06.1; nach 05 Ihre Anfrage, vor 06.2 Kundenschutz) · Intensitätsstufe: 2 klar (Typ T8, eine informierende Signature)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Verbindlich: Zielarchitektur ([08](../08-zielarchitektur.md) 8.3.2 b
„06.1“, 8.3.0, 8.3.11) und Architektur E ([07](../07-expertenvergleich.md) 7.5.3 „06 Ihr Start“, 7.5.4); Herkunft Konzept C, C8
([konzept-c.md:351-366](../06-konzepte/konzept-c.md)). Kürzel wie in 08, dazu PS = `functions/pakete-seite.js`, IR =
`web/assets/instanzregeln.js`, PJ = `web/assets/partner.js`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall. **Textentwurf** = neuer
Wortlaut nur aus belegten Fakten, Freigabe nötig. Alle Lagen sind geplant, nicht gemessen; Textbreiten sind mit der Schrift des Projekts
(`web/fonts/inter-latin-wght-normal.woff2`) vermessen. Eine Paketentscheidung (10) liegt nicht vor; dieser Abschnitt nennt keine Pakete
und Preise.

## A. Abschnitt und Funktion

| Feld | Festlegung |
|---|---|
| Name, ID, Anker | „06.1 Ihr Start: Ablauf“, `fb-10-ablauf`, Pflicht-h2 `#ablauf` (`scripts/pruefen-instanzen/29.mjs:112`) |
| Position | Block 1 von Kapitel 06. Davor 05 Ihre Anfrage (Stufe 1, Formular), danach 06.2 Kundenschutz (Stufe 2), dann die Anhänge. Telefon ab ≈ 7,8 BH (Ende von 05 nach [fb-09](fb-09-anfrage.md) plus 96 px), bei 664 px Höhe Bildschirm 10–11 (08). Rhythmus … 1 · 1 · **2** · 2 · 1 … |
| Ziel | Aufwand, Dauer und Rücktrittsgrenze zeigen (EA S5): ein senkrechter Maßstab mit den sechs Statuswörtern, Risikofakten an den Marken, „3 bis 5 Werktage“ als einzige große Zahl |
| Beantwortete Nutzerfrage | „Wie viel Arbeit habe ich, wann geht es los, bis wann kann ich zurück?“ (F-19, F-07) |
| Vorbereitete Entscheidung | Zeitplan und Mitwirkung sind tragbar → anfragen (Kopf-Ring „Paket anfragen“ → `#frage`) oder weiter zur kompakten Paketwahl A4 |
| Gruppen | FB-6 (Prüfer kurz vor dem Kauf), FB-4 und FB-5 (Unentschlossene nach dem Formular) |

**Festlegungen dieser Spezifikation** (Abweichung von 08 nur in der Form, nicht im Inhalt):

- **F10-F1** Der Block „Sie brauchen …“ (08, aus EA 4.3.1) wird nicht als eigener Block gesetzt. Was beim Bestellen einzugeben ist, steht
  an Marke 01, wie die Risikofakten an ihren Marken (EV Ü6). Grund: Kürze (≈ 35 Wörter weniger) und keine Doppelung mit dem Block „Für die
  Bestellung brauchen Sie …“, den 05 in Zustand B trägt (abgestimmt mit [fb-09](fb-09-anfrage.md)). Rückfall: Block unter dem
  Maßstab (+ ≈ 100 px).
- **F10-F2** Der Inhalt der Frage „Wie schnell ist mein Konfigurator online?“ (VK:242), die nach 08 (A2) aus den Fragen entfällt, zieht in
  den Begleitsatz der Kennzahl (abgestimmt mit [fb-13](fb-13-haeufige-fragen.md)).
- **F10-F3** Gewicht ≈ 1,05 BH statt 0,90: Die Risikofakten brauchen sechs Zeilen mehr, als 08 überschlagen hat. Der Abschnitt liegt hinter
  dem Formular und verschiebt keine Lage, an der E-1 oder EA H-D2 hängt.

## B. Konkreter Inhalt

**B.1 Verwendete Informationen**

| Fakt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Von der Bestellung bis zum Livegang“, grün „Livegang“ | VK:192; Prüfsuite 29.3 | wörtlich |
| „Meist sind es 3 bis 5 Werktage nach der Zahlung.“ | VK:193; Prüfsuite (`/3 bis 5 Werktage/`) | Kennzahl und Begleitsatz |
| Dauer hängt vor allem an Domain und Freigabe | VK:242 | Begleitsatz |
| sechs Statuswörter in fester Folge | IR:74-77; Prüfsuite 29.3 | Schrittwörter |
| Inhalt der Schritte | PS:143-150 (`ABLAUF`); docs/BESTELLUNG.md:19-26 | Sätze, gekürzt |
| Eingangsbestätigung ist keine Annahme, Vertrag mit Zahlungseingang | PB:47-48 § 3 | Fakt an 01 |
| Karte bestätigt sofort, Lastschrift 2 bis 5 Werktage | PJ:294 | Hinweis an 02 |
| Storno bis zum Beginn der Einrichtung mit voller Erstattung, danach keine | PB:70 § 7 (2) | Grenze zwischen 02 und 03 |
| Live erst mit Freigabe oder nach Absprache | PB:60 § 5 (3) | Fakt an 05 |
| Abo ab Livegang; monatlich kündbar ohne Mindestlaufzeit | PB:54 § 4 (3); PB:69 § 7 (1) | Fakten an 06 |
| Anker `#laufzeit` | PB:68 | Ziel der Fundstelle |

Nicht verwendet: Erstattung bei Nichtfreigabe (offen, EA O-16); Domainpreis bis 25 € und Domaininhaberschaft (Fragen „Domain“, Festblock 04.3);
Knopf „Fenster planen“ (Frage „Website“, VK:239); Anbieterzeile (steht nach 08 am Formular in 05); die sechs Strichsymbole (PS:153-160).

**B.2 Texte (≈ 110 Wörter)**

| Element | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „06 · IHR START“ | Textentwurf (08 8.2.6) |
| h2 | „Von der Bestellung bis zum **Livegang**“ | wörtlich |
| Kennzahl | „3 bis 5 Werktage“, davor nur für Vorleseprogramme „Dauer bis zum Livegang:“ | wörtlich (VK:193); Vorspann Textentwurf |
| Begleitsatz | „Meist, nach der Zahlung. Es hängt vor allem an der Domain und an Ihrer Freigabe.“ | Textentwurf aus VK:193, :242 |
| 01 | **Bestellt** · „**Sie** wählen Paket, Domain und Postfach.“ · ✓ „Vertrag erst mit Eingang Ihrer Zahlung.“ | Textentwurf |
| 02 | **Bezahlt** · „**Sie** zahlen die Einrichtung vorab.“ · Hinweis „Eine Lastschrift braucht 2 bis 5 Werktage.“ (PJ:294 wörtlich) · ✓ „Bis hierhin: Storno mit voller Erstattung.“ | Textentwurf |
| Fundstelle | „§ 7 (2)“, zugänglicher Name „Paketbedingungen § 7 (2): Storno“ → `/konfigurator-bedingungen/#laufzeit` | Textentwurf |
| 03 | **In Einrichtung** · „**Wir** rufen Sie an und richten alles ein.“ · Grenze „Ab hier: keine Erstattung der Einrichtung.“ | Textentwurf |
| 04 | **Domain gesichert** · „**Wir** sichern Ihre Domain, samt Zertifikat.“ | Textentwurf |
| 05 | **Zur Freigabe** · „**Sie** prüfen die Vorschau und geben frei.“ · ✓ „Live nur mit Ihrer Freigabe oder Absprache.“ | Textentwurf |
| 06 | **Live** · „Ihr Konfigurator ist öffentlich.“ (PS:149, Anfang) · ✓ „Erst jetzt beginnt das Monatsabo.“ · ✓ „Ohne Mindestlaufzeit, monatlich kündbar.“ | Textentwurf |

Die Fakten wiederholen den Festblock 04.3 im Inhalt, nicht im Wortlaut (EV 7.5.4). Die fetten Subjekte „Sie“ und „Wir“ zeigen den Aufwand:
drei Schritte erledigt der Betrieb, zwei eeziframes. „Postfach“ greift das Kapitelwort von 03 auf (= die Adressen für die Anfragen, PS:144).

**B.3 Interaktionen.** Keine Handlung des Abschnitts außer der Fundstelle (Textlink). Der Maßstab ist nicht bedienbar; seine Marken folgen
dem Scrollen als Zustand. Der Weg zur Anfrage bleibt der Kopf-Ring (08 8.3.2 d); kein Rücklink nach oben (E-4).

**B.4 Vorhandene Komponenten.** Abschnittsrahmen `.vk-teil` mit Haarlinie (`web/assets/verkauf.css:501`), Kapitelzeile wie in
[fb-03](fb-03-ihr-name.md) (E-AB-10), `.link` (`web/assets/gemeinsam.css:67-69`), Hakengeometrie von `.chip.haken::before`
(`gemeinsam.css:97`), `ruhig()` (`web/assets/gemeinsam.js:160`), Baustein `<!--pakete:ablauf-->` (PS:162-164), Statuswörter aus IR.

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Satzbau G2 ohne Lesestapel: Haarlinie → Kapitelzeile → h2 → Held (Kennzahl als Kopf des Maßstabs, darunter der
Maßstab mit den Schritten). Ebenen: 0 Grund `#161616` → 20 Maßstab (Achse, Striche, Marken, Ziffern, Endzeichen, Grenzlinie) → 30 Texte,
Haken, Fundstelle → 40 Kopf. Linksbündig, asymmetrisch, keine Achse. Ordnungslinie x = 16; die Schritte stehen an einer eingerückten
Zweitlinie x = 56 (SG 10.1/1 erlaubt eine) und liegen bewusst nicht auf dem 4-Spalten-Raster, weil der Maßstab ein festes 40-px-Band ist.

**Telefon 390 × 844, Lagen relativ zur Haarlinie (y = 0)**

| y | Element | x | Maß |
|---|---|---|---|
| 0 | Haarlinie 1 px `--line` | 16–374 | 96 px nach 05 |
| 16–32 | Kapitelzeile | 16 | 13/16, Abstand 16 (K-15) |
| 44–112 | h2, zwei Zeilen „Von der Bestellung“ (283 px) / „bis zum Livegang“ (262 px) | 16–374 | 32/34 (K-18), Abstand 12 (K-15), `text-wrap: balance` |
| 136–170 | Kennzahl „3 bis 5 Werktage“ (251 px) | 16–267 | 32/34 (K-18), Abstand 24 |
| 174–222 | Begleitsatz, zwei Zeilen (335 / 244 px) | 16–374 | 15/24, Abstand 4 |
| 246–886 | Maßstab, 640 px hoch | 16–48 | Abstand 24 |
| 246–326 | 01: Wort 246–270, Satz 270–294, Fakt 302–326 | ab 56 | Block 80 |
| 350–454 | 02: Wort, Satz, Hinweis 406–430, Fakt 430–454 | ab 56 | Block 104 |
| 478 | Grenzlinie; Fundstelle „§ 7 (2)“ mit Ziel 456–500 | 16–317; 325–374 | Lücke 48 statt 24 |
| 502–582 | 03: Wort, Satz, Grenze 558–582 | ab 56 | 80 |
| 606–654 | 04: Wort, Satz | ab 56 | 48 |
| 678–758 | 05: Wort, Satz, Fakt 734–758 | ab 56 | 80 |
| 782–886 | 06: Wort, Satz, Fakten 838–886 | ab 56 | 104 |
| 886 | Ende, ≈ 1,05 BH | | dann 96 px bis 06.2 |

Alle Zeilen 24 px hoch, alle Lücken 8, 24 oder 48 px: Jeder Block ist ein Vielfaches von 8, jede Marke liegt bei 12 + 8n px unter der
Oberkante des Maßstabs und damit auf einem Feinstrich.

**Der Maßstab (Bildschicht).** Achse 1 px `--line2` bei x 40 über die volle Höhe. Feinstriche alle 8 px (Phase 4 px), 1 × 6 px, x 34–40,
`--line2`. Kräftige Striche alle 40 px, 1 × 12 px, x 28–40, `--muted` mit 55 % Deckkraft. Sechs Marken 14 × 2 px, x 34–48 (sie kreuzen die
Achse und weisen zum Wort), auf Höhe der Mitte der Wortzeile; Farbe `--text2`, erreicht `--accent`. Ziffern 01–06 13 px links neben der
Marke (x 16–32), auf gleicher Mitte, mit Aussparung in `--ground` (2 px Rand), die die Striche dahinter unterbricht wie die Zahl auf einem
Zollstock; Farbe `--muted`, erreicht `--accent`. Oben und unten ein Endzeichen der Maßkette: Schrägstrich 45°, 10 px, 1,5 px `--text2`,
mittig auf der Achse.

**Die Rücktrittsgrenze.** In der 48-px-Lücke zwischen 02 und 03 läuft eine Strich-Punkt-Linie 1 px `--muted` (Strich 10, Lücke 3, Punkt
2, Lücke 3) von x 16 quer über die Achse bis x 317, die Linienart der Grenze in technischen Zeichnungen. Rechts daneben die Fundstelle
„§ 7 (2)“, 15 px fett, unterstrichen, mittig zur Linie. Darüber steht der letzte Fakt von 02 („Bis hierhin …“), darunter der erste Hinweis
von 03 („Ab hier …“): Die Grenze ist ein Ort auf dem Maßstab, nicht ein Satz in einer Liste.

**Schritte.** Wort 17/24 fett `--text`; Satz 15/24 `--text2`, Subjekt „Sie“/„Wir“ fett `--text`; Fakt mit Haken 15/24 `--text`, Haken
7 × 12 px, Strich 2,5 px `--accent`, hängend bei x 45–52 zwischen Achse und Text, damit alle Texte an x 56 fluchten; Hinweis und Grenze
ohne Haken in `--text2` (EA S5: „die Grenze ohne Haken“).

**Proportionen** (Abschnittsfläche 390 × 886): ≈ 38 % Textflächen, ≈ 7 % Maßstab und Grenzlinie, ≈ 55 % frei. Der Maßstab ist schmal,
trägt aber 72 % der Abschnittshöhe; der Bildanteil der Stufe 2 (20–50 %, DG 2.4.2) wird über die Ausdehnung, nicht die Fläche erreicht,
wie DG T8 es mit dem Maßstab als Held vorsieht.

**Größenhierarchie [V].** Drei Stufen: 32 (h2, Kennzahl) · Klein-Stufe 13–17 · Held (640 px Maßstab, mehr als das 50-Fache der Versalhöhe
der 15-px-Schrift; SG 10.1/4). Anker ist die Kennzahl mit dem Maßstabskopf darunter: die einzige Zahl in Titelgröße, die einzige senkrechte
Struktur; die h2 ist die eine erlaubte Headline davor.

**Schreibtisch 1280, 12 Spalten** (1040 px ab x 120; Spalte 64,67, Rinne 24, K-12), Split 5 : 7 (08 8.3.2 c):

- Spalten 1–5 (x 120–539): Kapitelzeile 13/16 y 16–32, h2 40/42 zweizeilig y 44–128 (353 px; Abstände 16 und 12 nach K-15, Zeile nach
  K-18), Kennzahl 40/42 y 160–202 (314 px), Begleitsatz 15/24 zweizeilig y 210–258. Darunter bleibt die Spalte frei.
- Spalten 6–12 (x 563–1160): Maßstab x 563–595 (Achse x 587), Texte ab x 603 (557 px, alle Sätze und Fakten einzeilig). Oberkante des
  Maßstabs auf Höhe der h2 (y 44). Blöcke 80 · 104 · Grenze 48 · 80 · 48 · 80 · 104; Ende y ≈ 684 (0,86 BH bei 800, ganz in einem Bildschirm
  unter dem 64-px-Kopf). Grenzlinie x 563–1103, Fundstelle x 1111–1160.

**Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Abstand zwischen Abschnitten | 96 / 128 px | G6 |
| Abstände innen | 4 (Kennzahl–Satz) · 8 (Satz–Fakt) · 24 (Blöcke) · 48 (Grenze) | 1 : 3 : 6 (SG-Rahmenmaße) |
| h2 | Inter 800, −0,03 em, 32/34 px (Telefon und Zwischengröße), 40/42 px ab 1024 | K-18 (11.3.1): 1,05 auf ganze Pixel |
| Kennzahl | 32/34 bzw. 40/42 (ab 1024), 800, −0,03 em, `tabular-nums`, `white-space: nowrap` | Titelrolle (GEST:451); Zahl als Held nach 11.3.1, K-18 |
| Technikstimme | 13 px, 600, Versalien, +0,12 em, `tabular-nums` (Kapitelzeile, Ziffern) | K-20 (11.3.3; DG-E-6): 13 nur Technikstimme, jeder Satz 15 px; die Sätze stehen schon in 15, keine Umstellung nötig (DS-AB-2) |
| Wort / Satz / Fakt | 17 fett, Zeilenhöhe 24/17; 15, Zeilenhöhe 1,6 (= 24 px) | 8-px-Takt; DNA Zeile 1,5–1,6 |
| Maßstabsband | 40 px (x 16–56) | 08 („x 16–40“, Texte „ab x 56“) |
| Radien | keine | Formfamilie radienlos-rechtwinklig im ganzen Abschnitt |

## D. Anwendung der Design-DNA

| Eigenschaft (Intensität 0–4) | Ausgestaltung, Ort | Wirkung, Beitrag zur Funktion |
|---|---|---|
| Tiefe, Z-Achse (1) | vier Ebenen; Verdeckung nur, wo die Ziffern die Striche aussparen und die Grenzlinie die Achse quert | Ordnung statt Raum; Absicherungsflächen bleiben flach (DG Dosierregel 1 sinngemäß) |
| Material, Transparenz (0) | kein Glas, keine Fläche, keine Karte | nichts steht zwischen Leser und Fakt |
| Licht, Schatten (0) | kein Lichtfleck, kein Schlagschatten; der heutige grüne Schein am Strich entfällt | DNA Nr. 6, 10; Licht hat seine zwei Orte in V1 und 02 (8.3.11) |
| Formen (2) | Haarlinien, Striche, 45°-Endzeichen, Strich-Punkt-Linie, Haken | die Sprache eines Aufmaßes (DR: „präzise wie ein Aufmaß“) |
| 3-D-Objekte (0) | keine | – |
| Bildintegration (0) | kein Bild; kein Platzhalter | der Maßstab ist der Held (DG T8) |
| Oberflächendetails (3) | Strichtakt 8/40 auf Phase, Ziffern-Aussparung, Endzeichen, Grenzlinie, hängende Haken, Fundstelle | Detailreichtum in Markenfarben (SKILL:47) ohne zusätzliche Fläche |
| Animation (1) | Marken und Ziffern wechseln die Farbe, wenn ihr Schritt die Bildschirmmitte passiert | zeigt Leserichtung und Fortschritt, ohne die Bedienschicht zu bewegen |
| Typografie (2) | Bühnenstimme (h2, Kennzahl), Technikstimme (Kapitelzeile, Ziffern), Lesestimme; ein grünes Wort | zwei Stimmen plus Technik-Etikett (DR 3.2) |
| Überlagerungen (1) | nur Ziffer vor Strichen | Text liegt nie auf Linien (SG 10.1/6) |
| Perspektive (0) | frontal | – |
| Interaktive Effekte (1) | Zustände der Fundstelle | keine Effekte an einer Absicherungsfläche |

Verbindliche Merkmale gelten unverändert (Grund, Ordnungslinie, Formfamilie, flache Bedienschicht). Betont ist das variable Merkmal
**Detail**, Bild und Licht stehen auf 0. **Signature:** informierend 1 (Fortschritts-Maßstab, DG 2.4.3; Budget Stufe 2 ≤ 1), inszenierend 0;
die Kapitelzeile zählt außerhalb des Budgets.

**Bewusst weggelassen:** die sechs Strichsymbole (Strichzeichen nur als Nebensache, SKILL:41; DG T8 „nicht“); die sich füllende Linie und
der grüne Schein; jeder Auftritt (24 px, 0,98 → 1); Lottie; Foto oder Platzhalterbild; Messraster (steht in 03); Hochzählen der Kennzahl;
Parallaxe; Lesefortschritt im Kopf (DG-AB-15); Anbieterblock (in 05).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**

| Nr. | Regel | Vorschlag | Begründung |
|---|---|---|---|
| F10-AB-1 | Ablauf als Zeitleiste mit gezeichneten Symbolen, Linie füllt sich scrollgebunden (GEST:447, :448) | Maßstab ohne Symbole, Marken wechseln als Zustand | SKILL:41; SG 10.10/14 und DNA-B B.3.12 (laufende Linie nur als begründete Ausnahme); bereits 8.4.1 Nr. 10, DG-AB-15 |
| F10-AB-2 | DR Baustein 7: „der Fortschritt wächst grün mit“ | kein wachsender Strich | wie F10-AB-1 |
| F10-AB-3 | grüner Schein am gefüllten Strich (`verkauf.css:610`) | entfällt | DNA Nr. 10, SG 10.10/3 |
| F10-AB-4 | Schritte erscheinen 24 px aufwärts (GEST:448) | kein Auftritt, auch kein Einblenden über Deckkraft | ein bewegter Träger je Ansicht (SG 10.7/4); Teil von DG-AB-2; Bedienschicht ohne Auftritt nach K-6 (11.7.2), gebündelt in DS-AB-8 |

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primärer Fokus:** die Kennzahl „3 bis 5 Werktage“, nach der h2 die größte helle Form und die einzige große Zahl der zweiten Seitenhälfte.
- **Sekundärer Fokus:** die Grenzlinie, die einzige Strich-Punkt-Form der Seite, die den Strichtakt unterbricht; danach die grün werdenden
  Marken.
- **Erwartete Reihenfolge:** h2 → Kennzahl → Begleitsatz → Wort 01 → Fakten mit Haken an der Zweitlinie → Grenzlinie mit „Bis hierhin / Ab hier“
  → Wörter 03 bis 06. Wer nur überfliegt, liest die sechs Wörter und die Haken-Zeilen.
- **Kontraste:** `--text` 16,8 : 1, `--text2` 10,9 : 1, `--muted` 5,8 : 1, Grün 10,5 : 1 auf `#161616`; Grenzlinie 5,8 : 1 (Grafik ≥ 3 : 1);
  Striche 1,6 bis ≈ 2,7 : 1 als Schmuck.
- **Handlung:** keine Cream im Abschnitt; die nächste steht in A4. Dauerhaft erreichbar ist der Kopf-Ring „Paket anfragen“ oben rechts. Die
  Fundstelle ist bewusst leise (rechts, 15 px, ohne Fläche) und ein Prüfweg, kein Ziel.
- **Mögliche Ablenkungen:** der Farbwechsel der Marken beim Lesen (Gegenmittel: nur Farbe, 220 ms, keine Bewegung); die Fundstelle führt
  von der Seite weg (Gegenmittel: Lage am Rand der Linie, nach dem Fakt); zwei Werktagsspannen (3–5 groß, 2–5 klein, Hypothese F10-H4).
- **Übergang:** Bei 844 px Höhe erscheint die Haarlinie von 06.2 im Bild, sobald Schritt 06 die Mitte erreicht; das untere Endzeichen schließt
  die Maßkette davor ab. 06.2 trägt keine eigene Nummer: Beide Blöcke bilden Kapitel 06.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Was | Dauer, Kurve | Verfahren | Weniger Bewegung |
|---|---|---|---|---|
| Abschnitt kommt ins Bild | nichts; alles steht ab dem ersten Bild, kein Einblenden (K-6, 11.7.2) | – | `.vk-ablauf > li` aus der Reveal-Liste nehmen (`verkauf.js:477`) | gleich |
| Mitte der Wortzeile passiert die Bildschirmmitte abwärts | Marke `--text2` → `--accent`, Ziffer `--muted` → `--accent` | 220 ms `--t2`, `--e-out` | IntersectionObserver auf jedes `b`, `rootMargin: 0px 0px -50% 0px` | alle Marken erreicht, ohne Übergang |
| dieselbe Mitte aufwärts | zurück auf neutral | 165 ms `--t2-aus`, `--e-in` (Austritt ≈ ¾, K-4) | derselbe Beobachter | – |
| erster Aufruf des Beobachters, Sprung über Anker, Neuaufbau mit `o.still` | Zustand sofort, ohne Übergang | 0 | Klasse `vk-still` für zwei Frames | – |
| Zeiger über Fundstelle | Unterstrich `--line2` → `--ink` | 150 ms `--t1`, `--e-out` (K-4; heute `--t2` in `gemeinsam.css:67`) | `.link:hover`, nur `(hover: hover)` | bleibt |
| Fokus | Kontur 2 px `--ink`, Abstand 2 px | – | `:focus-visible` | bleibt |
| Tippen auf Fundstelle | gleiche Registerkarte, `/konfigurator-bedingungen/#laufzeit` | – | normaler Link | – |

Erreicht heißt: Die Wortzeile steht über der Bildschirmmitte (`isIntersecting` oder Oberkante über dem Wurzelrand). Der Zustand folgt der
Lage, auch rückwärts; bei schnellem Scrollen schalten mehrere Marken ohne Staffel. Keine Scrollkopplung von Längen, keine Parallaxe,
keine Schleife, kein Hover am Maßstab.

**Begründung.** Hier wird geprüft, nicht gestaunt: Stufe 2, eine informierende Signature, Farbwechsel als einziger Kanal (SG 10.7/3, /8).
Bewegung mit Tiefe und Physik (SKILL:44) liegt in V1, V2, 02, 03 und am Wischen der Karten; eine weitere Bewegung hinter dem Formular
würde Ruhe gegen Effekt tauschen. 220 ms folgen DG T8 und GEST (die DNA nennt 120–200 ms; Dauern nach DG-AB-16); Dauern und Kurven
nur aus den Tokens nach K-4 (11.7.1), keine SG-Kurve. Ruhige Fassung und
Fassung ohne JavaScript zeigen das Endbild: alle Marken grün (DG T8).

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Eine Spalte wie in C. Nach dem Sprung über Menü oder Kopf (`scroll-margin-top: 116px` am h2 = Kopf 56
+ 16 + 16 + 16 + 12, K-15) steht die Haarlinie bei y = 72, 16 px unter dem Kopf: Bei 844 px sind h2, Kennzahl und die Schritte 01 bis 05
samt Fakt im Bild, Marke 01 ist sofort erreicht; bei 664 px reicht der erste Bildschirm bis zum Grenzsatz von 03, die Grenzlinie
(Bildschirm-y ≈ 550) ist dabei. Nichts klebt, nichts scrollt quer.
**360 px:** Texte 288 px breit; „Live nur mit Ihrer Freigabe oder Absprache.“ und der Begleitsatz brechen eine Zeile mehr, die Marken
folgen ihren Wörtern, weil sie am Schritt hängen, nicht an festen y. **320 px:** Grenzlinie verkürzt sich auf x 16–247. **200 % Text:**
Zeilenhöhen ohne Einheit, Lagen in `lh`; der Maßstab wächst mit.

**Schreibtisch 1280 × 800.** Split 5 : 7 wie in C; der Abschnitt steht ganz in einem Bildschirm; `scroll-margin-top: 124px` (Kopf 64,
K-15), die Haarlinie steht nach dem Sprung bei y = 80.

**Schreibtisch 1024 × 768.** Rand 32 px, Spalte 960 px (x 32–992, 12 Spalten à 58, Rinne 24; K-12, K-13). Split **5 : 7** wie bei 1280:
Fünf Spalten sind jetzt 386 px breit, „Von der Bestellung“ braucht in 40 px 353 px, die h2 bleibt also zweizeilig, und die Bedingung für
6 : 6 (11.1.3: nur wenn die h2 in fünf Spalten dreizeilig bräche) ist nicht erfüllt. Links x 32–418, rechts Maßstab x 442–474 (Achse
x 466), Texte ab x 482 (510 px, alles einzeilig), Grenzlinie x 442–935, Fundstelle x 943–992. Höhe ≈ 684 px (0,89 BH);
`scroll-margin-top: 124px`.

**640–1023 px (Zwischengröße):** Telefonkomposition in einer Spalte an der Ordnungslinie x = 24 (Rand 24, Rinne 16; 11.2.1), Maßstab
x 24–64, Texte ab x 64, Inhalt höchstens 600 px breit; h2 und Kennzahl bleiben 32/34; `scroll-margin-top: 116px`. **Unter 640 px:**
Telefonkomposition wie in C. Der Split beginnt erst am Umbruchpunkt 1024 px; weitere Bildschirm- oder Containerschwellen hat der Abschnitt
nicht (K-11).

## H. Technische Umsetzung

**Bestehend (Datei).** `web/fuer-fensterbauer/index.html:191-205` (Abschnitt, Satz VK:193, Baustein), neu erzeugt mit
`node scripts/bedingungen-pdf.mjs` (SKILL:107); PS:141-164 (`ABLAUF`, `SYMBOLE`, `symbol()`, `ablauf()`); IR:74-77 (`LEISTE`,
unverändert, eine Quelle je Wahrheit); `web/assets/verkauf.css:461-477`, `:609-611`, `:626-631` (ersetzt); `web/assets/verkauf.js:477-479`
(Reveal-Liste), `:496-509` (heutige Scroll-Bindung, ersetzt); `gemeinsam.css` (Tokens `:10-15`, `--t2`/`--e-out` `:30`, `.link`).

**Neu**

1. **Markup** (PS erzeugt alles zwischen den Markern; Kennzahl und Begleitsatz stehen statisch davor):
   `<h2 id="ablauf">Von der Bestellung bis zum <span class="ak">Livegang</span></h2>` ·
   `<p class="vk-dauer"><span class="vk-sr">Dauer bis zum Livegang: </span><span class="vk-dauer-zahl">3 bis 5 Werktage</span>
   <span class="vk-dauer-satz">…</span></p>` · `<ol class="vk-ablauf" role="list">` mit je
   `<li><span class="vk-ziffer" aria-hidden="true">01</span><b>Bestellt</b><p class="vk-satz"><strong>Sie</strong> …</p><p class="vk-fakt ja">…</p></li>`;
   Schritt 02 trägt `class="vk-bis"` und am Ende `<a class="link vk-quelle" href="/konfigurator-bedingungen/#laufzeit" aria-label="Paketbedingungen § 7 (2): Storno">§ 7 (2)</a>`.
   `ABLAUF` wird zu `{ satz, fakten: [{ art: 'ja' | 'hinweis', text }] }` je Status; `SYMBOLE` und `symbol()` entfallen; die Klasse
   `rg-schritte` entfällt (sonst zeichnet `ratgeber.css:53-56` Zählerkreise).
2. **CSS** (`verkauf.css`, ersetzt den Ablauf-Teil): `ol` mit `padding-left: 40px`, `position: relative`. `::before` = Achse und Striche als
   drei Hintergrundschichten (`linear-gradient` für die Achse, zwei `repeating-linear-gradient` mit 8 bzw. 40 px Periode, Startversatz 4 px);
   `::after` = zwei Endzeichen. Marke als `li::before` mit `border-top: 2px solid var(--marke)`, `left: -22px`, `top: calc(.5lh - 1px)`,
   `transition: border-color var(--t2) var(--e-out)`, ohne `.erreicht` (Rückweg) `var(--t2-aus) var(--e-in)` (beide Tokens neu in
   `gemeinsam.css` nach 11.7.1, K-4); Ziffer absolut bei `left: -40px`, `background: var(--ground)`. Standard (ohne JS):
   `--marke: var(--accent)`; mit `.vk-aktiv` am `ol` und ohne `.erreicht` am `li`: `--marke: var(--text2)`, Ziffer `--muted`. Haken als
   `.vk-fakt.ja::before` bei `left: -11px`. Grenzlinie als `.vk-bis::after` (`left: -40px; right: 57px; bottom: -24px; height: 1px`,
   Strich-Punkt als `repeating-linear-gradient(90deg, …)` mit 18 px Periode), Fundstelle absolut `right: 0; bottom: -46px; min-height: 44px`;
   `.vk-bis` mit `margin-bottom: 48px`; `b` als Block 17/24 fett (die Regel aus `ratgeber.css:56` entfällt mit der Klasse). Split über `display: grid` ab `@media (min-width: 1024px)`
   (Spalten 1–5 und 6–12, `column-gap: 24px`, Rand 32 px bis 1103 px; K-11 bis K-13), darunter eine Spalte mit Rand 16 bzw. 24 px.
3. **JS** `ablauf(wurzel, o)` in `verkauf.js`, aufgerufen aus `Verkauf.auf` statt `:496-509`: einmal je `ol` (`__vkAblauf`), vorigen
   Beobachter trennen (Einbettung baut neu auf, SKILL:63-64); bei `ruhig()` oder ohne IntersectionObserver nichts tun (CSS-Standard =
   Endbild); sonst `.vk-aktiv` setzen, `b` jedes Schritts beobachten, `.erreicht` setzen bzw. entfernen; erster Aufruf unter `vk-still`.
   ≈ 0,6 KB. `Scroll.binden` wird hier nicht mehr gebraucht.

**Feste Erwartungen der Prüfsuite [V].** `<h2 id="ablauf">` ohne weitere Attribute (Regex `29.mjs:112`); zwischen
`<!--pakete:ablauf-->` und `<!--/pakete:ablauf-->` die sechs Wörter als `<b>Bestellt</b>` … `<b>Live</b>` in Reihenfolge, `b` ohne
Attribute (`29.mjs:113-114`), deshalb Subjekte als `strong`; „3 bis 5 Werktage“ zusammenhängend im Quelltext, normale Leerzeichen, kein
`&nbsp;` (Umbruch verhindert CSS); Schriftgrößen nur 13, 15, 17, 32, 40, auch in `.vk-sr`.

**Assets.** Keine. Alles ist CSS und Text; keine Datei, keine fremden Server (SKILL:60).

**Animationstechnik.** Ein IntersectionObserver, Übergänge nur auf `border-color` und `color` kleiner Elemente (SG 10.7, Leistung). Keine
Bibliothek.

**Leistungsrisiken.** Gering: sechs beobachtete Elemente, keine Messung je Frame (die heutige Bindung liest bei jedem Scrollen sieben
Rechtecke), keine Bilder, keine Layoutverschiebung.

**Barrierefreiheit.** Lesefolge = DOM-Folge; `role="list"`, weil `list-style: none` in Safari die Listensemantik nimmt; Ziffern, Achse,
Striche, Marken und Grenzlinie sind `aria-hidden` bzw. Pseudo-Elemente, die Bedeutung tragen die Sätze („Bis hierhin …“, „Ab hier …“). Der
Erreicht-Zustand wird nicht angesagt (reine Leseführung). Kontraste wie in E; Fundstelle ≥ 44 px hoch, zugänglicher Name enthält den
sichtbaren Text (WCAG 2.5.3). `forced-colors`: Marken als Rahmen bleiben sichtbar, die Grenzlinie fällt auf `border-top: 1px dashed
CanvasText` zurück. `prefers-contrast: more`: kräftige Striche `--muted`, Sätze `--text`.

## I. Conversion-Begründung

**Warum hier.** Nach Paketen, Festblock und Formular sind die Besucher übrig, die noch nicht gefragt haben oder die Zusagen prüfen wollen
(EA S5; Lage nach E-AB-7, Rückfall „Formular nach 06“ in 08 g). Sie suchen keine neuen Vorteile, sondern Antworten auf Aufwand, Dauer und
Ausstieg. Danach folgen Kundenschutz, Restzweifel und die kompakte Paketwahl.

**Wie die Gestaltung hilft.** Die Kennzahl beantwortet „wann?“ in einem Blick und nennt, wovon es abhängt: von der Domain und von der
eigenen Freigabe. Die fetten „Sie“ und „Wir“ machen den Aufwand zählbar. Die Grenzlinie macht die folgenreichste Bedingung zu einem Ort:
Bis hierhin ist der Weg ohne Verlust, ab hier nicht, mit der Fundstelle daneben. Jeder Fakt steht an dem Schritt, an dem er gilt, und die
sechs Wörter sind dieselben, die der Betrieb später im Kundenkonto sieht: Die Seite zeigt vorab, was nach dem Kauf geschieht.

**Menge.** ≈ 110 Wörter in sieben kurzen Blöcken statt heute ≈ 150 Wörtern in sechs langen Sätzen mit Symbolen; jeder Fakt ist eine Zeile,
die Grenze ehrlich ohne Haken.

**Beitrag zur Zielhandlung.** Z1a über den Kopf-Ring und A4, in Zustand B Z1; mittelbar Z1+, weil die Grenze für alle Pakete gleich ist.

**Zu testende Annahmen [H]** (keine Wahrscheinlichkeiten)

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| F10-H1 | Fakten an den Marken werden besser behalten als im Block (KC-H-9) | Lesetest „Bis wann stornieren Sie? Ab wann zahlen Sie monatlich?“ | Marken nur mit Satz, Fakten nur im Festblock |
| F10-H2 | Die Strich-Punkt-Linie wird ohne Legende als Grenze verstanden | Lesetest „Zeigen Sie, wo die volle Erstattung endet“ | durchgezogene Linie `--text2` |
| F10-H3 | Grüne Marken gelten nicht als „schon erledigt“ | Telefon-Video im Gespräch | Marken statisch neutral, Signature entfällt |
| F10-H4 | Der Lastschrift-Hinweis klärt; die Spannen 3–5 und 2–5 werden nicht verwechselt | Lesetest „Wie lange bis live, wenn Sie per Lastschrift zahlen?“ | Hinweis nur im Bestellschritt (PJ:294) |
| F10-H5 | „Sie“/„Wir“ fett macht den Aufwand schneller einschätzbar | Lesetest „Welche Schritte erledigen Sie selbst?“ | ohne Hervorhebung |
| F10-H6 | Marke 01 ersetzt den Block „Sie brauchen …“ (F10-F1) | Lesetest „Was müssen Sie bereithalten?“ | Block nach 08 unter dem Maßstab |

**Offen:** Freigabe der Textentwürfe und von F10-AB-1 bis -4; ob „meist 3 bis 5 Werktage“ gemessen ist (EA O-8); Erstattung bei
Nichtfreigabe (O-16); die Fakten folgen der geprüften Fassung der Paketbedingungen (PB:28, Entwurf); Wortlaut „Postfach“ an Marke 01.

# 06.2 Ihr Start: Kundenschutz (#kundenschutz)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 11 von 15 (Kapitel 06, Block 06.2, nach 06.1 `fb-10-ablauf`, vor A1 `fb-12-live-demos`) · Intensitätsstufe: 2 klar (Typ T6 Vertrauen und Absicherung)

Phase I, Stand 24.10.2026, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md),
dazu VK = `web/fuer-fensterbauer/index.html`, PB = `web/konfigurator-bedingungen/index.html`, GEST = `docs/GESTALTUNG.md`, SG =
`docs/design-dna/04-styleguide.md`, DNA-B = `docs/design-dna/05-ergebnis-b-styleguide.md`, DS = [11-designsystem.md](../11-designsystem.md)
(seine Festlegungen K-n gehen dieser Spezifikation vor). **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I** =
Entscheidung dieser Spezifikation, wo 08 offen ist oder anders lautet. Textmaße mit Inter aus `web/fonts/` in Chromium gemessen; Lagen
geplant, nicht am gebauten Abschnitt gemessen.

---

## A. Abschnitt und Funktion

- **Name, Anker:** Block 06.2 von Kapitel 06 „Ihr Start“; h2 „Ihre Kunden bleiben Ihre Kunden“ mit `id="kundenschutz"` (Menüziel, 08 8.1.4;
  Prüfsuite `scripts/pruefen.mjs:611`, `:1691`). Keine eigene Abschnittsnummer, weil Teil von Kapitel 06 (08 Festlegung 8).
- **Position:** elfter von 15 Abschnitten, bei 664 px Höhe Bildschirm 11–12 (08). Davor 06.1 Ablauf (Stufe 2, Maßstab mit grünen Marken,
  Risikofakten mit Haken, die Grenze ohne Haken), danach A1 Live-Demos (Stufe 1, flach). Rhythmus 2 · **2** · 1: keine Folge von
  Stufen ≥ 3, Dosierregeln 2 und 3 unberührt.
- **Ziel:** Loyalität des Anbieters belegen, und zwar mit dem, was vertraglich zugesagt ist (PB § 10), nicht mit Bild, Stimme oder Zahl.
- **Beantwortete Nutzerfrage:** „Spricht eeziframes meine Kunden an oder verkauft meine Anfragen?“ (F-11, PB:85-86), dazu F-10 „Sehen meine
  Kunden Preise, Werbung oder andere Betriebe?“ (PB:84). F-10 ist in 02 schon als Schlusszeile beantwortet; hier wird daraus eine Zusage.
- **Vorbereitete Entscheidung:** Vertrauen in den Anbieter (EA S5). Danach bleibt nur Restzweifel (Demos, Fragen) und die Paketwahl im
  Abschluss A4; die Anfrage ist über den Kopf-Ring „Paket anfragen“ (Zustand A) einen Tipp entfernt.
- **Grenzen [V]:** keine Aussage zu F-12 (Aufmaßblatt für Hauseigentümer) vor EA O-15 und zu F-13 vor O-18; „Zusage“, nie „Garantie“
  (GEST:379); keine Siegel, Stimmen, Zähler, Logos (SKILL:49); nichts, was über PB § 10 hinausgeht.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Ihre Kunden bleiben Ihre Kunden“ | VK:159; Prüfsuite `pruefen.mjs:1691` (Rohtext ohne Kindelemente) | wörtlich, ohne Punkt, ohne grünes Wort (GEST:450: „die Kundenschutz-Überschrift bleibt wörtlich“) |
| vier Zusagen mit Kennwort und Doppelpunkt | VK:163-166; Kennwörter Prüfsuite `:611`, `:1691` | wörtlich, Kachel 4 mit Zusatz (B.2) |
| § 10 (1) nur Ihr Betrieb, keine Werbung, keine Preise | PB:84 | deckt Kachel 1 |
| § 10 (2) nur bestätigte Adressen, keine Ansprache, kein Verkauf, „außer an die Unterauftragnehmer aus der Anlage“ | PB:85 | deckt Kacheln 2 und 4 |
| Anlage „Vertrag zur Auftragsverarbeitung“ | PB:109 (`#avv`) | deckt Kachel 3 |
| „verbindlich zu“; „Zusage“, nicht „Garantie“ | VK:160; GEST:379 | Gehalt und Wortwahl des Links (B.2) |

**B.2 Texte** (sichtbar ≈ 95 Wörter, davon tragen die vier Kennwörter mit 9 Wörtern die Aussage beim Überfliegen)

| Ort | Wortlaut | Status |
|---|---|---|
| h2 | „Ihre Kunden bleiben Ihre Kunden“ | wörtlich VK:159 |
| Ankerkachel | **„Nur Ihr Betrieb:“** „Ihr Konfigurator zeigt nur Ihren Namen, keine anderen Betriebe, keine Werbung und keine Preise von uns.“ | wörtlich VK:163 |
| Kachel 2 | **„Nur an Sie:“** „Jede Anfrage geht ausschließlich an die E-Mail-Adressen, die Sie bestätigt haben.“ | wörtlich VK:164 |
| Kachel 3 | **„In Ihrem Auftrag:“** „Wir verarbeiten die Anfragen nur nach dem Vertrag zur Auftragsverarbeitung und löschen sie nach den vereinbarten Fristen.“ | wörtlich VK:165 |
| Kachel 4 | **„Kein Weiterverkauf:“** „Wir sprechen Ihre Kunden nicht an, verkaufen keine Anfragen und geben ihre Daten an niemanden weiter, außer an die Unterauftragnehmer aus dem AV-Vertrag.“ | VK:166 wörtlich bis „weiter“; **Textentwurf** für den Zusatz nach PB:85 – Festlegung I-6 |
| Link | „Zugesagt in den Paketbedingungen, § 10“ | **Textentwurf** (VK:160, GEST:379; 08: „Paketbedingungen § 10“) |
| entfällt | Lead VK:160, Fotokarte `fb-kundenschutz.webp` mit Chips „Ihre Marke · Ihre Domain · Ihre Daten“ (VK:161) | 08: Bedienschicht ohne Lead, kein Bild (IA-AB-8) |
| später | eine Zeile 15 px zu F-12 zwischen Kachel 4 und Link, erst nach EA O-15; bis dahin kein Platzhalter, kein Leerraum | 08 |

**B.3 Interaktionen:** nur der Link (gleiche Registerkarte, Ziel `/konfigurator-bedingungen/#kundenschutz`). Die Kacheln sind keine
Bedienelemente: kein Zeiger, kein Hover, kein Aufklappen.

**B.4 Vorhandene Komponenten:** Haarlinie und Abschnittsabstand aus `.vk-teil` (`web/assets/verkauf.css:501`, `:513`), ohne den
Nummernzähler (`:502`); Kachelklasse `.vk-zusagen` (`verkauf.css:602-606`, neu gefasst); Textlink `.link` (`web/assets/gemeinsam.css:67`,
44 px hoch, 700, Unterstrich `--line2`); Tokens `--surface`, `--ring`, `--accent`, `--accent-soft`, `--text`, `--text2`, `--r2`,
`--t2`, `--e-out` (`gemeinsam.css:10-13`, `:23`, `:26`, `:30`); `ruhig()`, `beobachten()`, `Verkauf.auf` (`web/assets/verkauf.js:15`,
`:110`, `:513-519`). **Nicht verwendet:** `kundenschutz()` und `KS_PUNKTE` aus `web/assets/portal.js:867-876` (anderes Produkt,
Nutzungsbedingungen § 11, andere Zusagen; eine Vermischung würde zwei Vertragswerke verwechseln); die Keyframes `vk-haken`
(`verkauf.css:436`, animieren `stroke-dashoffset`, F).

## C. Exakte Layoutkomposition

**Grundstruktur:** Satzbau G2 mit der Ankerkachel als Held: Haarlinie → h2 → Ankerkachel → drei Kacheln → Link. Alles an der
Ordnungslinie x = 16, keine Achse (G5), asymmetrisch. Ansichtstyp nach DNA-B B.1 „Arbeitsansicht“ (Textabschnitt ohne Bühne): Pflicht
sind Regeln 3 und 7–12 und die Linie; Anker, Luft und Sprung sind Ziel und werden erreicht (unten). DG-E-1 ist damit ohne 40-px-h2 am
Telefon gelöst: Hauptelement ist die Ankerkachel als Fläche mit Haken-Medaillon.

**Telefon 390 × 844** – 4 Spalten à 77,5 px, Rand 16, Spaltenabstand 16; alles über 4 Spalten; y ab der Haarlinie.

| Element | x | y | Maß | Ebene |
|---|---|---|---|---|
| Abstand zu 06.1 | – | −96 bis 0 | 96 (G6) | – |
| Haarlinie 1 px `--line` | 16–374 | 0 | 358 × 1 | 30 |
| h2 32/34, 800, −0,03 em, `--text`, zwei Zeilen („Ihre Kunden bleiben“ 298 px gemessen); 24 px unter der Haarlinie (DS K-15, K-18) | 16–314 | 24–92 | 68 hoch | 30 |
| **Ankerkachel** `--surface`, Ring 2 px `--line`, Radius 12 (`--r2`), Innenabstand 20 (DS K-22, 11.6.4) | 16–374 | 116–286 | 358 × 170 | 30 |
| – Medaillon Kreis 40, `--accent-soft`; Haken 20 × 20, Strich 2,5 px `--accent` | 36–76 | 136–176 | ⌀ 40 | 30 (Bildschicht der Kachel) |
| – Kennwort 17/22, 700, −0,005 em, `--text`, Mitte auf Medaillonmitte (DS K-21) | 88–213 | 145–167 | 125 × 22 gemessen | 30 |
| – Satz 17/26, 500, `--text2`, drei Zeilen (DS K-19) | 36–354 | 188–266 | 318 × 78 gemessen | 30 |
| Kachel 2 `--surface`, Ring, Radius 12, Innenabstand 16 | 16–374 | 298–400 | 358 × 102 | 30 |
| – Haken 16 × 16 `--accent`, Mitte auf der Kennwortzeile | 32–48 | 317–333 | – | 30 (Bildschicht) |
| – Kennwort 15/22, 700, `--text` | 56– | 314–336 | eine Zeile | 30 |
| – Satz 15/22, 500, `--text2`, 4 px unter dem Kennwort | 32–358 | 340–384 | 326 × 44 (2 Zeilen, gemessen) | 30 |
| Kachel 3, Aufbau wie 2 | 16–374 | 412–536 | 358 × 124 (Satz 3 Zeilen) | 30 |
| Kachel 4, Aufbau wie 2 | 16–374 | 548–694 | 358 × 146 (Satz 4 Zeilen; ohne Zusatz 3 Zeilen, 124) | 30 |
| Link `.link` 15, 700, `--text`, Unterstrich 1,5 px `--line2` | 16–313 | 710–754 | 297 × 44 gemessen | 30 |
| Abstand zu A1 | – | 754–850 | 96 (G6) | – |

**Größenhierarchie [V]:** drei Stufen nach DS 11.3.2 (Festlegung K-21): Titel (h2 32) · Lesen 17/15 (Kennwort und Satz der Ankerkachel 17,
in den übrigen Kacheln 15; Spreizung 1,13 ≤ 1,25, SG 10.9) · Technik 13 entfällt: keine 13 px in diesem Abschnitt, jeder Satz steht in
15 px oder größer (DS K-20). 24 px steht nicht neben der h2 (DG 2.2.18). Ankerkachel zu kleiner Kachel in der Fläche 1,7 : 1 (170 zu
102 px) bis 1,2 : 1 (zu Kachel 4, 146 px); der Rang entsteht daher nicht über die Höhe, sondern über Kennwort und Satz 17 statt 15, den
Innenabstand 20 statt 16, die erste Stelle und das Medaillon als einzige grüne Fläche. Sprung (Ziel): Medaillon 40 px zur Versalhöhe der
15-px-Schrift (≈ 10,9 px) = 3,7-fach, Ankerkachel 170 px ≈ 15,6-fach.

**Verhältnisse:** Abstände 4 (Kennwort → Satz) : 12 (zwischen Kacheln, Designrichtung 3.3) : 16–24 (Kacheln → Link, h2 → Held) : 96
(zwischen Abschnitten). Fläche im Bildschirm 390 × 788 unter dem Kopf: Textflächen ≈ 44 %, Bild 0 %, frei ≈ 56 % nach DNA-Zählung (Kachelflächen
mit 1,1 : 1 gegen den Grund sind weder Text noch Bedienelement noch Motiv); zählt man die Kachelflächen als belegt, bleiben ≈ 27 % frei.
Beides am Bildschirmfoto prüfen. **Ebenen:** Hintergrund Z 0 (Grund `#161616`, kein Licht, kein Raster) → Bedienschicht Z 30 (Kacheln,
Text, Link; Haken als Bildschicht der Kachel, nur sie bewegen sich) → Kopf Z 40. Keine Verdeckung (Arbeitsansicht). **Arbeitslage:**
Nach dem Menü-Sprung (`scroll-margin-top: 96px`, Schreibtisch 104 px, nach DS K-15) liegt die Haarlinie bei y 72 (Kopf 56 + 16), der Link
endet bei y 826: der ganze Abschnitt steht bei 844 in einem Bildschirm; bei 664 schneidet der Bildschirm in Kachel 4.

**Schreibtisch 1280 × 800** – 12 Spalten à 64,67 px, Rinne 24 (DS K-12), Spalte x 120–1160, Split 5 : 7 an der Ordnungslinie der Seite
(Text x 120–539, Kacheln ab x 563).

| Element | x | y | Maß |
|---|---|---|---|
| Haarlinie | 120–1160 | 0 | 12 Sp. |
| h2 40/42, zwei Zeilen („Ihre Kunden bleiben“ 372 px gemessen) | 120–539 | 24–108 | Sp. 1–5 |
| Ankerkachel, Innenabstand 20, Radius 12 (`--r2`) wie am Telefon; Medaillon 40 bei x 583–623, y 44–84; Satz 17/26 in 557 px, zwei Zeilen (gemessen) | 563–1160 | 24–168 | Sp. 6–12, 597 × 144 |
| Kachel 2, Innenabstand 16, Radius 12; Satz 15/22 in 565 px, zwei Zeilen (gemessen) | 563–1160 | 180–282 | 597 × 102 |
| Kachel 3, zwei Zeilen | 563–1160 | 294–396 | 597 × 102 |
| Kachel 4, drei Zeilen (ohne Zusatz zwei) | 563–1160 | 408–532 | 597 × 124 |
| Link, Unterkante bündig mit Kachel 4 | 120–417 | 488–532 | Sp. 1–5 |

Abschnitt 532 px hoch, mit 128 px Abstand ≈ 0,83 BH; alles steht in einem 800-px-Bildschirm (736 px unter dem 64-px-Kopf). Links bleibt
unter der h2 ein freies Feld von ≈ 419 × 380 px: Negativraum (DNA Nr. 8), der die Liste rechts als einzigen Gegenstand stehen lässt.
Frei ≈ 41 % der Abschnittsfläche, wenn die Kachelflächen als belegt zählen. Zeilenlänge 15 px in 565 px höchstens 74 Zeichen (gemessen,
≤ 75).

**Festlegungen I gegenüber 08:**

1. **Kachelhöhen gemessen statt „zwei Zeilen“.** Mit dem Wortlaut aus VK:163-166 braucht die Ankerkachel in 318 px drei Zeilen, die
   übrigen zwei bis vier. Der Abschnitt wird am Telefon 754 px statt ≈ 506 px (0,60 BH) hoch; die Mehrlänge von ≈ 0,3 BH verschiebt nur
   die Anhänge, nicht Pakete (Bildschirm 5–6) und Formular (Bildschirm 9). Kürzen hieße, Vertragszusagen umzuformulieren.
2. **Kein Lead.** 08 sieht keinen vor; die h2 trägt die Aussage, „verbindlich zugesagt“ wandert in den Linktext. So bleibt es bei genau
   einem Link auf `/konfigurator-bedingungen/#kundenschutz`, den die Prüfsuite in der Einbettung verlangt (`pruefen.mjs:611`).
3. **Schreibtisch gestapelt.** 08 nennt „Ankerkachel über zwei Spalten, die drei übrigen darunter“. Drei Kacheln in zwei Spalten lassen
   eine verwaist; drei nebeneinander (je ≈ 330 px) brauchen vier Zeilen und bilden eine gleichrangige Kartenreihe (SG 10.10 Nr. 11), und
   eine Ankerkachel über die volle Spalte von 1040 px überschreitet mit 17 px die 75 Zeichen. Deshalb: alle Kacheln in Spalten 6–12, die
   Ankerkachel zuerst.
4. **Anker über Schriftstufe.** 08 setzt alle Kennwörter in 15 px. Am Telefon sind alle Kacheln gleich breit; ohne Stufe entstünden
   „vier gleiche Kacheln ohne Anker“ (DG T6 „Nicht“). Darum Kennwort und Satz 17 statt 15 nur in der Ankerkachel; das Kennwort bleibt
   17/700 und wird nicht 24/800, weil 24 px nie neben der h2 32/40 steht (DS K-21, DG 2.2.18).
5. **Haken nacheinander** und per `transform` statt `stroke-dashoffset` (F).
6. **Zusatz in Kachel 4** (B.2): VK:166 sagt „an niemanden“, PB:85 nennt die Unterauftragnehmer als Ausnahme. Die Kachel darf nicht mehr
   versprechen als der Vertrag (SKILL:49). Freigabe durch den Inhaber nötig, rechtlich mit der Prüfung der PB (PB:28, Entwurf); ohne Freigabe
   bleibt VK:166 und Kachel 4 wird 124 / 102 px hoch.

## D. Anwendung der Design-DNA

Budget Stufe 2: keine inszenierende Signature, informierend 0 von ≤ 1, eine einmalige Motivbewegung (die Haken), Licht 0.

| Eigenschaft | Ausgestaltung | Intensität | Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | zwei Ebenen plus Kopf; keine Verdeckung, kein Schatten (DNA Nr. 2, 6) | D1 0 | Ruhe als Glaubwürdigkeit nach drei bewegten Kapiteln |
| Material, Transparenz | Kacheln opak `--surface` mit 2-px-Ring (GEST:24, DG-E-10); kein Glas (kein Bild darunter) | D2 0 | Vertragsklauseln als feste Gegenstände |
| Licht, Schatten | keines; auch keine Lichtkante, weil keine Quelle im Bild steht (Designrichtung „Licht nur mit Quelle“) | D3 0 | kein Werbeglanz |
| Formen | Formsystem nach DS K-22: Kacheln Radius 12 (`--r2`) auf allen Breiten, Medaillon als Kreis; kein Bruch (12 steht auch in GEST:32; das Streichen von 8 auf der Website ist DS-AB-5) | D5 1 | dieselbe Kachelfamilie wie `he-05`; Karten wie die Paketkarten tragen 24 |
| 3-D-Objekte, Bildintegration | keine (EV 7.4 Nr. 14: kein Geräte-Held; Platzhalter entfällt) | – | Negativraum statt Platzhalter |
| Oberflächendetails | Haarlinie oben; Medaillon `--accent-soft` hinter dem grünen Haken (GEST:24); Haken mit runden Enden | D12 1 | Mikrodetail in Markenfarbe (SKILL:47) |
| Animation | jeder Haken wird einmal gezogen (F) | D8 1 | „zugesagt, abgehakt“ – Katalog 3 „Bestätigen“ (GEST:39) |
| Typografie | Bühnenstimme h2 32/34 und 40/42, 800; Kennwörter 700 `--text` (15/22, im Anker 17/22); Sätze 500 `--text2` (15/22, im Anker 17/26) (DS K-18, K-19, K-21) | D18 0 | Kennwörter als überfliegbare Spalte |
| Überlagerungen, Perspektive | keine; alles frontal (SG 10.10 Nr. 1) | – | – |
| Interaktive Effekte | nur Unterstrich und Fokus am Link | – | eine klare Weiterführung |

**Zusammenspiel:** Die grünen Haken greifen die Haken der Risikofakten in 06.1 auf: Grün mit Haken heißt auf dieser Seite „zugesagt“,
die ehrliche Grenze steht ohne Haken. Das Medaillon ist die einzige grüne Fläche des Abschnitts und damit der Fixationsanker.

**Bewusst weggelassen:** Bild und Gerät, Licht, Glas, Schatten, Parallaxe, Auftritt der Kacheln, Zähler, grünes Wort in der h2, Cream,
Abschnittsnummer, Schild- und Siegeloptik (ein Schild oder ein Medaillon auf der Kachelkante läse sich als Gütesiegel und als Garantie,
SKILL:49, GEST:379), Kundenstimmen, Logos, Kennzahlen.

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:**

| bestehende Regel | hier | Begründung | geführt als |
|---|---|---|---|
| Bildband „Ihre Kunden bleiben Ihre Kunden“ mit `fb-kundenschutz` 16:10 links, vor den Paketen (GEST:447) | ohne Bild, nach Formular und Ablauf | Platzhalter mit Motiv, das nicht zu sehen ist (PA 1.9); Kette S5; Gerät nicht fünfmal | IA-AB-8, E-AB-7 |
| Karten und Bänder erscheinen 24 px aufwärts, 0,98 → 1 (GEST:448); Erscheinen 8 px aufwärts (GEST:39 Katalog 1) | kein Auftritt und kein Einblenden über Deckkraft; bewegt sind nur die Haken in der Bildschicht der Kacheln | SG 10.7/1–2, 10.10 Nr. 14; DS 11.7.2 Festlegung K-6 | DG-AB-2, DS-AB-8 |
| Kacheln „am Telefon zwei Spalten, am Schreibtisch vier“ (Designrichtung 3.3), zwei Spalten ab 601 px (`verkauf.css:606`) | eine Spalte, Ankerkachel zuerst; Abstand 12 bleibt | Satzlänge der Zusagen; kein gleichrangiges Feld | DG-AB-11 |
| jeder Abschnitt mit Haarlinie und Nummer (GEST:450) | Haarlinie ohne Nummer | Block von Kapitel 06 | 08 Festlegung 8 |

Keine Abweichung: h2 ohne Punkt und ohne grünes Wort (GEST:450 nimmt diese Überschrift ausdrücklich aus).

## E. Visual Attention Architecture

Erwartete, **nicht gemessene** Aufmerksamkeit:

1. Beim Hereinscrollen die h2 an der Ordnungslinie (größte Schrift, 16 : 1 gegen den Grund).
2. **Primär:** die Ankerkachel – das Medaillon als einzige grüne Fläche, der Haken, der sich als einzige Bewegung zieht, daneben
   „Nur Ihr Betrieb:“ in 17 px statt 15.
3. **Sekundär:** die Kennwörter der drei Kacheln als linke Spalte („Nur an Sie:“, „In Ihrem Auftrag:“, „Kein Weiterverkauf:“) in `--text`
   700 gegen die Sätze in `--text2` 500 – wer überfliegt, liest nur sie.
4. Die Sätze für Zweifelnde, zuletzt der unterstrichene Link als Weg zum Beleg.

**Handlungsaufruf:** keiner im Abschnitt, keine Cream im Bildschirm; dauerhafter Träger ist der Kopf-Ring („Paket anfragen“ in Zustand A,
→ `#frage`). Der Link ist bewusst ein Textlink, damit er nicht mit Kopf-Ring und Abschluss konkurriert. **Ablenkungen:** vier Haken
gleichzeitig (darum nacheinander und klein, 16 gegen 20 px im Medaillon); Kacheln, die wie austauschbare Funktionskarten wirken (dagegen:
Doppelpunkt-Kennwörter im Vertragston und der Paragraf im Link); die grünen Marken des Ablaufs direkt davor (sie stehen links am Maßstab,
die Haken innen in den Kacheln). **Übergang:** Der Link schließt am Telefon links unten ab, am Schreibtisch auf der Unterkante der letzten
Kachel; danach 96 / 128 px Ruhe und die Haarlinie von A1 an derselben Ordnungslinie.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|
| Kachel zu ≥ 60 % im Bild (ein IntersectionObserver für alle vier) | Haken wird gezogen: eine Abdeckung über dem Haken schrumpft `transform: scaleX(1 → 0)`, Ursprung rechts; der Haken erscheint von links nach rechts (kurzer Abstrich, dann langer Aufstrich) | Anker 500 ms, übrige 320 ms, `--e-out` | Haken stehen, keine Abdeckung |
| mehrere Kacheln zugleich sichtbar (Schreibtisch, Sprung) | Warteschlange in DOM-Folge, der nächste beginnt, wenn der vorige endet; nie zwei gleichzeitig | gesamt 500 + 3 × 320 = 1,46 s | – |
| Kachel verlässt das Bild, bevor ihr Haken dran ist | Haken steht sofort | – | – |
| Neuaufbau in `/#fensterbauer` (`o.still`) oder Haken schon gezogen | Haken stehen; nie ein zweites Mal | – | – |
| Hover über eine Kachel | nichts (kein Bedienelement) | – | – |
| Hover Link (`hover: hover`) | Unterstrich `--line2` → `--text` | 220 ms `--t2` | gleich |
| Fokus Link | Kontur 2 px `--text`, Abstand 3 px, Radius 4, nur `:focus-visible` | sofort | gleich |
| Tipp oder Klick Link | gleiche Registerkarte, PB an § 10; „Zurück“ führt an dieselbe Stelle | – | – |
| Menü-Sprung auf `#kundenschutz` | `scroll-margin-top` am h2 96 px, Schreibtisch 104 px (ohne Kapitelzeile, DS K-15); die Haarlinie steht danach 16 px unter dem Kopf; Glätten wie die Seite | nativ | ohne Glätten |

**Begründung:** 500 ms übernimmt 08 und DG T6 für den Anker; 320 ms für die übrigen, weil vier Haken à 500 ms nacheinander 2 s dauerten.
Die Folge bleibt unter 5 s autonomer Bewegung (SG 10.7) und hat je Moment genau einen bewegten Träger (SG 10.7/4). `--e-out`
(`cubic-bezier(.2, .7, .2, 1)`) setzt schnell an und läuft weich aus wie ein gezogener Strich, ohne Überschwingen (SG 10.7/2). Verfahren
`transform` statt `stroke-dashoffset`, weil die leichte Technikstufe nur `transform` und `opacity` animiert (SKILL:56). Die Bedienschicht
bewegt sich nicht: kein Auftritt, kein Einblenden, keine Staffelung, sofort lesbar (DS 11.7.2, Festlegung K-6). Ohne JavaScript und bei „weniger Bewegung“ ist der Endzustand die volle
Komposition (SG 10.7/6).

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigenständig):** eine Spalte nach C; Folge h2 → Ankerkachel → drei Kacheln → Link; der ganze Abschnitt passt
nach dem Menü-Sprung in einen Bildschirm, der Link liegt im Daumenbereich unten links. **360 px:** Inhaltsbreite 328; h2 bleibt zweizeilig
(298 px), Ankersatz vier Zeilen, Kachel 2 drei, Kachel 3 vier, Kachel 4 fünf Zeilen (gemessen); Abschnitt 846 px. **200 % Text, 320 px:**
Kacheln wachsen, das Kennwort bricht in seiner Rasterspalte neben Haken bzw. Medaillon um, kein Querscrollen (SG 10.10 Nr. 19).
**640–1023 px** (Zwischengröße, DS K-11, K-13): wie Telefon gestapelt; Rand 24 px, 8 Spalten, Rinne 16; h2 bleibt 32/34 (40 erst ab
1024); h2, Kacheln und Link linksbündig an der Ordnungslinie x = 24, höchstens 560 px breit, nicht mittig; h2 einzeilig (485 px), Ankersatz,
Kachel 2 und 3 je zwei Zeilen, Kachel 4 drei (gemessen); Abschnitt 650 px.

**Schreibtisch 1280:** Split 5 : 7 nach C; h2 40 links, Kacheln rechts gestapelt, Link links unten auf der Bodenlinie der letzten
Kachel; nichts angeheftet, nichts größer als am Telefon außer der h2 (SKILL:28). **1024** (DS K-13): Rand 32, Spalte x 32–992, 12 Spalten
à 58 px, Rinne 24; links Spalten 1–5 x 32–418 (h2 zwei Zeilen, 372 von 386 px), Kacheln Spalten 6–12 x 442–992 (550 px): Ankersatz,
Kachel 2 und 3 je zwei Zeilen, Kachel 4 drei (gemessen); Abschnitt 532 px wie bei 1280.

## H. Technische Umsetzung

**Bestehend:** siehe B.4. **Neu:** HTML in VK an Stelle von Zeile 158-168; CSS-Block `.vk-schutz` in `verkauf.css` an Stelle von
`:602-606` und der `.vk-band-um`-Regel (`:443`); Funktion `zusagen(wurzel, still)` in `verkauf.js`, aufgerufen in `Verkauf.auf` neben
`buehne()`/`leisten()`. Aus den Reveal-Listen `verkauf.js:477` und `:479` werden `.vk-zusagen > li` und `.vk-zusagen` gestrichen.

```html
<section class="vk-teil vk-teil-block vk-schutz" aria-labelledby="kundenschutz">
  <h2 id="kundenschutz">Ihre Kunden bleiben Ihre Kunden</h2>
  <ul class="vk-zusagen">
    <li class="vk-zusage-anker"><span class="vk-zusage-haken" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><strong>Nur Ihr Betrieb:</strong> <span class="vk-zusage-text">Ihr Konfigurator zeigt …</span></li>
    <li><span class="vk-zusage-haken" aria-hidden="true">…</span><strong>Nur an Sie:</strong> <span class="vk-zusage-text">…</span></li>
    <!-- „In Ihrem Auftrag:“, „Kein Weiterverkauf:“ ebenso -->
  </ul>
  <a class="link vk-schutz-link" href="/konfigurator-bedingungen/#kundenschutz">Zugesagt in den Paketbedingungen, § 10</a>
</section>
```

**Prüfsuite-Grenzen [V]:** h2 genau `<h2 id="kundenschutz">Ihre Kunden bleiben Ihre Kunden</h2>` ohne Klasse und ohne Kindelement
(`pruefen.mjs:1691`); jedes Kennwort mit Doppelpunkt im Text, in der Einbettung genau viermal im Seitentext (`:611`) – also keine
Wiederholung in `sr-only`-Text, Ansage, `noscript` oder Fragen; genau ein Link mit diesem `href` in `.vk-einbettung` (`:611`; der Festblock
verlinkt `/konfigurator-bedingungen/`, `fb-08`); nur Schriftgrößen 15, 17, 32/40 ausdrücklich gesetzt, auch am Link (Prüfung
Abschnitt 10); Ziele ≥ 44 px. Das Leerzeichen zwischen `</strong>` und `<span>` bleibt, damit der Seitentext „Nur an Sie: Jede …“ lautet.

**CSS (Startwerte):**

- `.vk-teil-block { counter-increment: none; padding-top: 24px }`, `.vk-teil-block::before { content: none }`; `.vk-schutz h2 { scroll-margin-top: 96px }`,
  ab 1024 px `104px` (DS K-15); h2 `line-height: 34px`, ab 1024 px `42px` (DS K-18).
- `.vk-zusagen { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 12px }`.
- `li { display: grid; grid-template-columns: 16px minmax(0, 1fr); column-gap: 8px; row-gap: 4px; align-items: center; padding: 16px;
  border-radius: var(--r2); background: var(--surface); box-shadow: var(--ring); font-size: 15px; line-height: 22px; font-weight: 500;
  color: var(--text2) }`; `strong { font-size: 15px; font-weight: 700; color: var(--text) }`; `.vk-zusage-text { grid-column: 1 / -1 }`.
- `.vk-zusage-anker { grid-template-columns: 40px minmax(0, 1fr); column-gap: 12px; row-gap: 12px; padding: 20px }`, Kennwort 17/22,
  700, −0,005 em (DS K-21); Satz 17/26 (DS K-19); Medaillon `width: 40px; aspect-ratio: 1; border-radius: 50%; background: var(--accent-soft)`, Haken 20 px.
- Haken: `fill: none; stroke: var(--accent); stroke-width: 2.5px; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round`.
- Abdeckung nur mit `.vk-zusagen--zieht`: `.vk-zusage-haken { position: relative }`, `::after` deckt genau das Haken-Feld (kleine
  Kacheln `inset: 0` mit `var(--surface)`; im Medaillon `inset: 10px`, also das 20-px-Feld innerhalb des Kreises, deckend mit
  `linear-gradient(var(--accent-soft), var(--accent-soft)), var(--surface)`); `transform-origin: right; transition: transform 320ms
  var(--e-out)` (Anker 500 ms); `.vk-gezogen .vk-zusage-haken::after { transform: scaleX(0) }`; `will-change` nur während des Laufs.
  Eine Abdeckung über den ganzen Kreis ginge nicht: Beim Schrumpfen ragten ihre Ecken als Fläche aus dem Medaillon.
- `@media (min-width: 1024px)`: `.vk-schutz { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px }`, h2
  `grid-column: 1 / 6; grid-row: 1`, Liste `grid-column: 6 / 13; grid-row: 1 / 3; margin-top: 0`, Link `grid-column: 1 / 6; grid-row: 2;
  align-self: end; justify-self: start`; Radius und Innenabstände der Kacheln bleiben wie am Telefon (12; 16, Anker 20; DS K-22).
  `@media (min-width: 640px) and (max-width: 1023px)`: `.vk-schutz > * { max-width: 560px }`, linksbündig ohne `margin-inline: auto`; der
  Rand 24 px kommt aus dem Seitenraster (DS K-11, K-13).
- `@media (prefers-reduced-motion: reduce)`: Abdeckung `display: none`. `@media (forced-colors: active)`: Kacheln `outline: 2px solid
  CanvasText` statt Ring, Haken `stroke: CanvasText`, Abdeckung `display: none`.

**JavaScript `zusagen(wurzel, still)`:** bindet einmal (`data-an` an der Liste); bricht ab bei `ruhig()`, `still` oder fehlendem
`IntersectionObserver` – dann stehen die Haken. Sonst setzt es `.vk-zusagen--zieht`, beobachtet die vier `li` mit `threshold: 0.6`
(registriert über `beobachten()`, damit der Neuaufbau aufräumt), reiht sichtbare Kacheln in DOM-Folge ein und setzt `.vk-gezogen`
nacheinander (`transitionend`, ersatzweise Zeitgeber Dauer + 50 ms). Eine Kachel, die vor ihrem Haken aus dem Bild geht, bekommt
`.vk-gezogen` ohne Übergang. Nach dem letzten Haken trennt sich der Beobachter. Nichts wird gespeichert oder gezählt.

**Assets:** keine. `fb-kundenschutz.webp` wird nicht mehr eingebunden; Eintrag in `scripts/fotos.py:42` und Bildplatz in
`docs/BILDER.md:104`, `:136`, `:155` als entfallen nachziehen. Vom Inhaber wird kein Material gebraucht, nur die Freigaben (D, C Nr. 6).

**Leistung:** ≈ 1,5 KB HTML und CSS, ein Beobachter, vier Transforms auf 20 × 20 bzw. 16 × 16 px; kein Bild, kein LCP-Bezug; keine
Layoutverschiebung (feste Medaillongröße, kein Reveal). **Barrierefreiheit:** `section` mit `aria-labelledby`; `ul` mit vier `li`
(„Liste, 4 Einträge“); Haken `aria-hidden`; Kontraste gegen `#1f1f1f`: `--text` 14,7 : 1, `--text2` 9,8 : 1, Haken `--accent` 9,6 : 1
(im Medaillon 7,0 : 1); h2 und Link gegen den Grund 16,2 : 1; Kachelring 1,3 : 1 ist Zierde, weil die Kacheln nichts bedienen; der Link ist
als allein stehende, fette, unterstrichene Zeile erkennbar; Fokus 2 px mit 16 : 1; Linkname beschreibt das Ziel; Fokusfolge = DOM.

## I. Conversion-Begründung

- **Position:** Wer nach Paketen und Formular weiterliest, sucht Absicherung (EA S5). Loyalität ist der letzte grundsätzliche Zweifel vor
  Demos, Fragen und der zweiten Gelegenheit im Abschluss (EA 4.3.2/7; E-AB-7). Wer gezielt sucht, kommt über das Menü direkt hierher.
- **Gestaltung:** Der Beleg ist der Vertrag, nicht eine Behauptung: wörtliche Zusagen, ein Paragraf im Link, keine Stimmen oder Siegel
  (SKILL:49). Ruhe und Opazität grenzen den Abschnitt bewusst von den inszenierten Kapiteln ab; der gezogene Haken übersetzt „zugesagt“
  in eine Geste. Der Zusatz zu den Unterauftragnehmern macht die Zusage prüfbar statt absolut [H].
- **Informationsmenge:** ≈ 95 Wörter, aber gestuft: 9 Wörter Kennwörter für Überfliegende, die Sätze für Zweifelnde, § 10 für Prüfende.
  Mehr Text als die ≈ 40 Wörter je Bühne (DNA-B B.3.6) ist hier zulässig, weil es eine Arbeitsansicht mit Vertragswortlaut ist; weniger
  hieße umformulieren.
- **Beitrag zur Zielhandlung:** indirekt Z1a/Z1: Der Vertrauenszweifel sinkt (Hypothese), die Anfrage bleibt über Kopf-Ring und Abschluss
  einen Tipp entfernt; der Abschnitt lenkt nicht mit einer eigenen Handlung ab.
- **Zu testen [H]:** H-11-1 Die vier Kennwörter allein vermitteln die Zusagen (Fünf-Sekunden-Lesetest am Telefon: „Was sagt eeziframes
  über Ihre Kunden zu?“; Rückfall: Kennwörter als Satzanfang im Fließtext) · H-11-2 Die Ankerkachel wird zuerst gesehen (Telefon-Video,
  Urteil des Inhabers; Rückfall: Medaillon 48 px) · H-11-3 Der Link auf § 10 stärkt Vertrauen, statt Misstrauen zu wecken (grober Hinweis:
  Seitenaufrufe der PB je Tag in der eigenen Statistik ohne Cookies, die innerhalb der Website keine Herkunft trägt,
  `functions/api/statistik.js:12`; dazu Gespräche; keine Klickzählung im Browser) · H-11-4 Der Zusatz „außer an die
  Unterauftragnehmer“ senkt die Glaubwürdigkeit nicht (Lesetest; Rückfall: VK:166 nach rechtlicher Freigabe) · H-11-5 Eine
  Bildschirmaufnahme der Instanz, die nur den Beispielbetrieb zeigt, belegt „Nur Ihr Betrieb“ stärker (DG-H-7; erst prüfbar mit den Demos,
  `PAKETE_DEMOS=1`) · H-11-6 Die Lage nach dem Formular kostet keine Anfragen gegenüber der Lage vor den Paketen (IA-H-7; Erfassung fehlt).

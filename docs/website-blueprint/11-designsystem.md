# 11. Page Composition System und übergreifendes Designsystem

Ergebnis 11 des Website-Blueprints (MASTER-PROMPT V4), Phase K „Gestalterische Konsistenz der gesamten Website“. Stand 24.10.2026,
Arbeitszweig `claude/design-dna-styleguide`. Planungsdokument: Das Repository wurde nur gelesen; gebaut oder geändert wurde nichts.

**Was dieses Kapitel leistet.** Die 33 Abschnitts-Spezifikationen in [09-abschnitte/](09-abschnitte/) sind einzeln entstanden. Jede hält
die Design-Grammatik ein, aber zusammen nennen sie für dieselbe Sache oft verschiedene Werte: drei Kurven für denselben Zustandswechsel,
neun Seitenränder bei 1024 px, vier Arten, „gewählt“ zu zeigen. Dieses Kapitel legt fest, was über die ganze Website gleich ist, was je
Aufgabe eines Abschnitts variieren darf, und gibt jedem wiederkehrenden Wert genau einen Token. Wo die Spezifikationen voneinander
abweichen, entscheidet es mit **Festlegung K-n** und Begründung; die vollständige Liste der Widersprüche steht in Anhang 11.A.

**Grundlage**

| Kürzel | Datei | Rolle |
|---|---|---|
| DNA | `docs/design-dna/03-design-dna.md` (Kapitel 5) | verbindliche gestalterische Grundlage: Formel 5.1, Prinzipien Nr. 1–11 (5.2), Stellschrauben und Dialekte 5.3, Signature-Effekte 5.4, Abgrenzung 5.5 |
| SG | `docs/design-dna/04-styleguide.md` (10.1–10.10) | prüfbare Regeln und Werte; „SG 10.9“ ist die Wertesammlung, die bei Abweichung gilt |
| DNA-B | `docs/design-dna/05-ergebnis-b-styleguide.md` | Arbeitsfassung: Regeln B.1, Ebenen B.2, Bausteine B.3, Tokens B.5, Bewegung B.6, Abnahme B.8 |
| PROMPT, VGL | `docs/design-dna/06-design-prompt.md`, `…/02-vergleich.md` | Begriff „Größenstufe“, Ansichtstypen; Statistik und Stilcluster |
| DG | [02-design-grammatik.md](02-design-grammatik.md) | Schichtregeln G1–G9, Typen T0–T14, Stufen 1–4, Dosierregeln, DG-AB-1 bis -19, DG-E-n, DG-H-n |
| ZA | [08-zielarchitektur.md](08-zielarchitektur.md) | Sitemap, Abschnittsfolgen, Stufen je Abschnitt, E-AB-n |
| PE | [10-paketentscheidung.md](10-paketentscheidung.md) | Paketwahl, J-AB-n, J-H-n |
| Abschnitts-IDs | [09-abschnitte/](09-abschnitte/) | `fb-01` … `fb-15`, `he-01` … `he-07`, `rh-01` … `rh-03`, `st-02` … `st-04`, `ar-01`, `ar-02`, `ap-01`, `nf-01`, `pa-01`, `pb-02`, `re-01` |
| SKILL | `.claude/skills/premium-gestaltung/SKILL.md` | Anforderungen des Inhabers (verbindlich) |
| DR, GEST | `.claude/skills/premium-gestaltung/designrichtung.md`, `docs/GESTALTUNG.md` | heutige Regeln, dürfen hinterfragt werden; Name, Wortmarke und Zeichen bleiben |
| Bestand | `web/assets/gemeinsam.css:9-31` | vorhandene Tokens (Farben, Radien, Kontrollhöhen, Dauern, Kurven) |

**Kennzeichnungen**

- **[V]** verbindliche Designregel: aus einem DNA-Prinzip, einer [Pflicht]-Regel des SG, einer Anforderung des Inhabers, Recht, Prüfsuite
  oder einer Festlegung dieses Kapitels innerhalb eines DNA-Spielraums (dann Hausregel; das DNA-Merkmal bleibt variabel).
- **[H]** experimentelle Gestaltungshypothese mit Rückfall; wird erst nach Prüfung (Telefon-Video, Sichtprüfung des Inhabers, Lesetest
  mit Fensterbauern) zur Regel. Aussagen über Wirkung sind immer [H]; dieses Kapitel nennt keine Wahrscheinlichkeiten.
- **Festlegung K-n**: Entscheidung dieses Kapitels, wo Spezifikationen sich widersprechen oder DG offen lässt.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: Vorschlag gegen eine Regel aus GEST oder DR (gesammelt in
  11.B als DS-AB-n; die älteren DG-AB-, E-AB- und J-AB-Nummern gelten weiter).
- Alle Maße sind geplant, nicht gemessen, außer wo eine Spezifikation „gemessen“ angibt. Telefon 390 × 844 ist die Hauptansicht
  (SKILL:28), die reale Höhe ≈ 664 px wird mitgeprüft; danach Schreibtisch 1280 × 800 und 1024 × 768.
- Simulierte Expertenperspektiven, auf denen DNA und Konzepte beruhen, sind eine Analysemethode, keine Nutzerstudie. Im Repository gibt es
  keine Nutzerforschung, Besucherzahlen oder Konversionsraten (PA, „Was es nicht gibt“).

**Rangfolge bei Widerspruch.** (1) Mindestanforderungen (WCAG 2.2 AA, Leistungsbudgets, Prüfsuite, Recht) · (2) DNA-Prinzipien Nr. 1–11
und [Pflicht]-Regeln des SG · (3) Anforderungen des Inhabers (SKILL) · (4) dieses Kapitel · (5) DG, ZA, PE · (6) einzelne
Abschnitts-Spezifikation. Ein Wert aus 09-abschnitte, der einer Festlegung hier widerspricht, wird beim Bau auf den Wert dieses Kapitels
gesetzt; die Begründung der Spezifikation bleibt als Hinweis stehen.

---

## 11.1 Page Composition System

### 11.1.1 Die Formel eines Abschnitts

Jeder Abschnitt jeder Seite entsteht aus derselben Konstruktion (DNA 5.1; DG G1, G2):

> **Grund → (Kulisse) → genau ein Held → flache Bedienschicht**, an der linken Kante geordnet, durch einen Sprung gestuft, über
> Verdeckung zu einem Raum verbunden.

| Baustein | Telefon 390 × 844 | Schreibtisch 1280 × 800 | Herkunft |
|---|---|---|---|
| Rahmen | Kopf 56 px, klebt; Fuß am Seitenende | Kopf 64 px | `rh-01`, `rh-03` |
| Abstand davor | 96 px (Abschnitt), 48 px (Block im selben Kapitel ohne h2) | 128 / 64 px | DG G6; K-14 |
| Kopf des Abschnitts | Haarlinie 1 px über die Spalte (x 16–374) → 16 px → Kapitelzeile 13/16 (nur nummerierte Abschnitte) → 12 px → h2 32/34, höchstens zwei Zeilen; ohne Kapitelzeile Haarlinie → 24 px → h2 | dieselben Abstände; h2 40/42; Haarlinie über 1040 px | DG G2; K-15 |
| Held | nicht textlich (Bild, Gerät, Blatt, Maßstab, Beispielbild), direkt unter dem Kopf; in Bühnen über dem Kopf | rechts über 7 Spalten (Split 5 : 7) | DG G3, G4 |
| Lesestapel | Lead 17/26 in `--text2`, höchstens drei Zeilen je Block, höchstens zwei Blöcke je Bildschirm | links über 5 Spalten | DR 3.2; DG G2 |
| Handlung | höchstens eine Cream-Pille je Bildschirm, sonst Ring oder Textziel; im Daumenbereich (untere Bildschirmhälfte) | im ersten 800-px-Bildschirm des Abschnitts | SKILL:71; DG G2 |

**Bildschicht und Bedienschicht** [V] (DG G1, DNA Nr. 1, 9, 10): Alles, was Perspektive, Licht, Material, Unschärfe, Physik und Bewegung
trägt, liegt in der Bildschicht (Z 0–25). Die Bedienschicht (Z 30–40) ist frontal, matt, formstabil und ändert nur Zustände über Füllung,
Kontur, Farbe und Deckkraft. Diese eine Trennung ist der Grund, warum die Website trotz verschiedener Szenen als ein System wirkt: Jeder
Knopf, jede Karte und jede Überschrift verhält sich an jeder Stelle gleich, nur die Bilder unterscheiden sich.

### 11.1.2 Was überall gilt [V]

| Bereich | Regel, die auf jeder Seite und in jedem Abschnitt gleich ist | Quelle |
|---|---|---|
| Ordnung | linke Spaltenkante als einzige Ordnungslinie (Telefon x = 16, Schreibtisch x = 120 bei 1280, x = 32 bei 1024); Achse nur bei mittigem Motiv (Gerät, Band) | DNA Nr. 3; DG G5 |
| Grund | `#161616` als Vollfläche überall; kein Abschnitt in anderer Grundfarbe, kein Cream-Band | DNA Nr. 11; DG-AB-7 |
| Ebenen | Z-Stufen 0 · 10 · 20 · 25 · 28 · 30 · 40 (11.5); Telefon 3–4 sichtbare Ebenen, nie mehr als 6 | SG 10.9; DG 2.2.1 |
| Held | genau ein Fixationsanker je Bildschirm; am Telefon nie reiner Text, außer in Arbeitsflächen nach DG-E-1 C | DR 1; DG G3, G4 |
| Freifläche | erster Bildschirm jeder Seite ≥ 33 %, Ziel 40–60 %; dunkle Wand und Fotoausläufe zählen als frei | DNA Nr. 8; SG 10.1 |
| Größen | höchstens drei Textstufen je Ansicht (11.3); Hauptelement ≥ 3 × Versalhöhe der Bedienschrift | DNA Nr. 7; SG 10.1/4 |
| Farbe | eine Cream-Fläche je Bildschirm, ein grünes Wort je Überschrift, ≥ 80 % unbunt, ≤ 5 % kräftig, > 0,3 % farbig | SKILL:68–71; DR 3.1; DG G8 |
| Licht | nur mit Quelle im Bild, eine Lichtfarbe und eine Lichtrichtung je Bildschirm, kein Schatten auf dunklem Grund | DNA Nr. 6, 10; DG 2.2.0 |
| Form | Vollrundung für alles Bedienbare; vier Radien voll · 24 · 18 · 12 | DNA Nr. 5; DG-AB-8 |
| Bewegung | ein bewegter Träger je Ansicht; autonome Bewegung endet nach ≤ 5 s; ruhige Fassung = Endbild; Bedienschicht ohne Auftritt | SG 10.10 Nr. 14; DG 2.4.1; K-6 |
| Ehrlichkeit | „Beispiel“ an jedem erfundenen Material; eine Beispielfirma („Fensterbau Brandt“), eine Beispielfamilie („Familie Weber“), eine Beispieldomain; keine Stimmen, Zähler, Siegel | SKILL:49; DG G7 |
| Technik | keine fremden Server; Bibliotheken nur in `web/vendor/`; ohne JavaScript lesbar und bedienbar; eingebettet in `/#fensterbauer` gleich | SKILL:60–64 |

### 11.1.3 Was je Aufgabe variieren darf

Variabel ist nur, was die DNA als Stellschraube führt (DNA 5.3) oder ein Signature-Effekt mit erfüllter Bedingung (DNA 5.4). Die Aufgabe
des Abschnitts (Abschnittstyp T0–T14 nach DG 2.3) entscheidet, wie weit eine Stellschraube aufgedreht wird.

| Stellschraube | Spielraum | Wovon die Wahl abhängt | Beispiele aus den Spezifikationen |
|---|---|---|---|
| Intensitätsstufe | 1 ruhig bis 4 inszeniert (DG 2.4.2) | Aufgabe: Bühne 3–4, Demonstration und Beweis 3, Leiste 3, Entscheidung, Vertrauen, Ablauf 1–2, Lese- und Arbeitsflächen 1 | `fb-01` 4, `fb-04` 3, `fb-06` 2, `fb-09` 1 |
| Dialekt | B (Objekt im Licht) für Bühne, Demonstration, Beweis; C (flach) für Entscheidung, Lesen, Arbeiten; A (Riesenwort) derzeit nirgends | Plastizität des verfügbaren Materials (DNA 5.3, Dialekte) | B: `fb-01`, `fb-04`, `fb-05`; C: `fb-06` bis `fb-15` |
| Art des Helden | Foto der Figurenwelt · Gerät mit echtem Bildschirm · Blatt (Papier) · Maßstab · Beispielbild · Kachel mit Anker · keiner (DG-E-1 C) | was die Nutzerfrage des Abschnitts beantwortet | Foto `he-01`, Gerät `fb-03`, Blatt `he-03`, Maßstab `fb-10`, Kachel `fb-11` |
| Ordnungsfigur | Diagonale (Bühne), Achse (Gerät, Band), Stapel an der linken Kante (alle übrigen) | Lage des Motivs | Diagonale `fb-01`, Achse `fb-03`, Stapel `fb-13` |
| Bildanteil am Bildschirm | Stufe 1: 0–20 %, 2: 20–50 %, 3: 30–60 %, 4: 50–100 % (DG 2.4.2) | Stufe | `fb-06` ≈ 16 % nach dem Sprung (begründete Ausnahme PE C) |
| Signature | inszenierend 0 / 0 / 1 / ≤ 2, informierend 0 / ≤ 1 / ≤ 1 / ≤ 1 je Stufe 1–4 | Stufe; Dosierregeln DG 2.4.2 | Glas `fb-01`, Explosionsansicht `fb-05`, Maßlinie `he-02` |
| Bewegung | Stufe 1: nur Zustände · 2: + fingergeführt, einmalige Motivbewegung · 3: + scrollgekoppelte Motivbewegung · 4: + Ladeauftritt der Szene, Tiefe der Bildebenen | Stufe | Feder im Beispielbild `fb-06`, Explosion `fb-05`, Foto-Tiefe `fb-01` |
| Licht | Lichtfleck oder Lichtraum nur in Stufe 3–4 und höchstens an zwei Orten je Seite | Dosierregel 3 | Erdlicht `fb-01`, Lichtfleck `fb-04` |
| Knopfbreite | in Bühnen nach Inhalt, in Arbeitsflächen und Abschlüssen volle Spaltenbreite (K-30) | Aufgabe | `fb-01` 212 px, `fb-09` 358 px |
| Split am Schreibtisch | 5 : 7; 6 : 6 nur zwischen 1024 und 1103 px, wenn die h2 in fünf Spalten dreizeilig bräche | Länge der h2 | `fb-10`, `he-04`, `he-07` bei 1024 |

### 11.1.4 Wiederkehrende Kompositionsmuster

Zehn Muster tragen alle 33 Abschnitte. Ein neuer Abschnitt wählt eines davon, statt eine eigene Komposition zu erfinden.

| Muster | Komposition am Telefon (390 × 844) | Schreibtisch | Stufe, Dialekt | eingesetzt in |
|---|---|---|---|---|
| **K1 Bühnen-Diagonale** | Foto randlos 390 × 420 (y 0–420, 50 % der Höhe), Anker im rechten oberen Viertel, unteres Viertel in den Grund ausgeblendet; Lesestapel links unten von y ≈ 320 bis ≈ 660: Kicker 13 → h1 32 (2–3 Zeilen) → Chips oder Lead → Preiszeile 13 → Cream 52 → 12 px → Ring 52; der Folgeabschnitt schneidet ab y ≈ 690–776 an (8–18 %) | Text Spalten 1–5 senkrecht mittig, Foto ab Spalte 6 randlos bis zum Fensterrand, y 0–760 | 3–4, B | `fb-01`, `he-01`, `ap-01`, `st-03` (im Foto von `fb-01`) |
| **K2 Gerät auf der Achse** | Telefon 300 px breit auf der Mittelachse (x 45–345); 01 zeigt die oberen 420 px, 02 die unteren 240 px desselben Geräts („andere Kadrierung statt Wiederholung“); Bedienschicht über und unter dem Gerät an der linken Kante | Browserfenster 560 × 360 rechts, das Telefon 220 × 450 überdeckt dessen linke untere Ecke zu ≈ 30 % | 2–3, B | `fb-03`, `fb-04`; verkleinert `fb-15` |
| **K3 Blatt-Vitrine** | Papier 290–330 px breit (75–85 %), um −2° gedreht, Papierweiß als einziger großer Hellwert; genau eine aufliegende opake Karte überdeckt das Blatt (Etikett ≤ 15 %, Karte ≤ ⅓); Text darunter | Liste links über 5 Spalten, Szene rechts über 7 | 2–3, B (Vitrine) | `fb-05`, `he-03`; als Zeichnungskarte `he-02`, `ar-01` |
| **K4 Maßstab mit Schritten** | Strichskala 1 px, fein alle 8 px, kräftig alle 40 px, Marken 01–0n in der Technikstimme; senkrecht an der linken Kante (x 16–40, Schritte ab x 56) oder waagerecht 358 × 64 | Maßstab links, Schritte über 7 Spalten | 2, C | `fb-10` (senkrecht), `he-04` (waagerecht) |
| **K5 Kartenreihe** | Karte 310 px mittig eingerastet, Nachbarn je 28 px angeschnitten, Namensleiste 358 × 52 über der Reihe | drei Karten in 1040 px mit `subgrid` | 2, C | `fb-06` |
| **K6 Zeilenliste** | Zeilen 44 / 52 / 56 px zwischen Haarlinien, Text links ab x 16, Zeichen rechts in einem 24-px-Feld (x 350–374), keine Kartenfläche | Liste rechts über 7 Spalten, h2 links über 5 | 1, C | `fb-07`, `fb-08`, `fb-12`, `fb-13`, `he-06`, `pa-01`, `rh-02`, `re-01` (Abschnittsliste) |
| **K7 Kachelfeld mit Anker** | eine Ankerkachel (volle Breite oder hervorgehoben im 2 × 3), übrige Kacheln kleiner oder leiser; Fuge 12 | Ankerkachel über zwei Spalten, übrige darunter | 2, C | `fb-11`, `he-05` |
| **K8 Klammer am Seitenende** | ein Bildband 390 × 200 aus dem Startfoto mit der h2 im Auslauf und einer Cream über die volle Breite, oder eine Mini-Vorschau 96 × 192 links neben drei Zeilenknöpfen 250 × 56 | Band ab Spalte 6 randlos, Text links | 2, C | `he-07`, `fb-15` |
| **K9 Band** | 144 px hoch (Schreibtisch 176), randlos über beide Ränder, Haarlinien oben und unten über die volle Fensterbreite, Mitte 1,25-fach unter einem Lichtkegel | volle Fensterbreite | 3, B (Reihe) | `fb-02` |
| **K10 Formular** | Feldsäule 358 px, Felder 52 px, Beschriftung 15/700 darüber, Cream über die volle Breite am Ende | Hinweis links über 5, Formular rechts über 7 | 1, C | `fb-09`, `re-01` (Widerruf), `pa-01` (Kontoskala) |

### 11.1.5 Rhythmus der Intensitätsstufen über die Seiten

**Dosierregeln** [V] (DG 2.4.2, 2.3.17/6): höchstens zwei Abschnitte der Stufe 4 je Seite, nie direkt hintereinander; höchstens zwei
Abschnitte der Stufe ≥ 3 in Folge; Entscheidungs- und Arbeitsflächen nie über Stufe 2 und ohne inszenierende Signature; erster Bildschirm
einer Verkaufsfläche Stufe 3 oder 4; jede inszenierende Signature höchstens einmal je Seite, Glas und Lichtort höchstens an zwei Orten,
nie in aufeinanderfolgenden Abschnitten.

**Seite für Fensterbauer** `/fuer-fensterbauer/` (auch eingebettet in `/#fensterbauer`), Telefon ≈ 12 Bildschirmhöhen:

```
Stufe  4  ██
       3  ██ ██    ██ ██
       2  ██ ██ ██ ██ ██ ██          ██ ██          ██
       1  ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██
          V1 V2 01 02 03 4a 4b 4c 05 6a 6b A1 A2 A3 A4 Fu
Licht     Bl Bl    Cr
Glas      ●
Bewegung  L  S  E  T  S  F           Z  E
```

Legende: 4a, 4b, 4c = Blöcke 04.1, 04.2, 04.3; 6a, 6b = Blöcke 06.1, 06.2; Fu = Fuß. Bl = Lichtfarbe Zeichnungsblau (Erdlicht, Kegel als Ende des Lichtübertrags), Cr = Lichtfleck in Cream; L = Ladeauftritt der
Szene, S = scrollgekoppelte Bildebene, E = einmalige Motivbewegung beim Eintritt, T = Antwort auf Tippen, F = Feder beim Wischen,
Z = Zustandswechsel am Maßstab.

- Zwei Wellen: Bühne und Band (4 · 3) → Ruhe (01, Stufe 2) → Beweis (02 · 03, je 3) → lange ruhige Strecke der Entscheidung (04.1 bis 05,
  2 · 1 · 1 · 1) → Absicherung (06, 2 · 2) → Anhänge (1) → Abschluss (2).
- Licht steht nur in den ersten vier Bildschirmhöhen; ab den Paketen trägt kein Abschnitt eigenes Licht (DG 2.2.3), damit Preis und
  Knopf keinen Lichtreiz neben sich haben.
- Glas nur im Startbild (und in der Einbettung im Umschalter darüber).

**Ansicht Hauseigentümer** `/#hauseigentuemer` (Höchststufe 3, DG Dosierregel 5 [H]):

```
Stufe  3  ██
       2  ██ ██ ██ ██ ██    ██ ██
       1  ██ ██ ██ ██ ██ ██ ██ ██ ██
          H1 H2 H3 H4 H5 H6 H7 WK Fuß
```

Eine Welle: Bühne (3) → vier klare Abschnitte mit je einem Bildträger (Zeichnung, Blatt, Maßstab, Kacheln) → Fragen (1) → Klammer (2) →
Wechselkarte (2). Kein CSS-Licht; das Licht steht nur in den Fotos von H1 und H7.

**Ratgeber und Fachartikel:** Kopf 2 → Handlungsbaustein 1 → Fließtext 1 → Fragen 1 → Weg-Block 1 → Handlungsbaustein 1 → Quellen 1 → Fuß 1.
**Paketbedingungen, Rechtsseiten, Kundenkonto, 404:** durchgehend 1. **App-Einstieg:** 2.

### 11.1.6 Übergänge zwischen Abschnitten

| Mittel | Regel [V] | Einsatz |
|---|---|---|
| Haarlinie mit Kapitelzeile | eröffnet jeden nummerierten Abschnitt der Seite für Fensterbauer (01–06) und der Ansicht Hauseigentümer (01–03); Anhänge, Ratgeber, Unterseiten tragen die Haarlinie ohne Kapitelzeile | DG 2.3.17/1; E-AB-10 |
| Abstand nach Überschriftenebene | neue h2 = Abschnitt: Haarlinie und 96/128 px davor; neuer Block ohne h2 im selben Kapitel: 48/64 px, keine Haarlinie; Gruppe unter einer Karte: 24 px (**Festlegung K-14**) | `fb-07` (24 nach der Reihe), `fb-08` (48), `fb-11` (eigene h2, 96) |
| Anschnitt | der erste Bildschirm jeder Seite und jeder Abschnitt der Stufe ≥ 3 lässt den folgenden um 8–25 % der Bildschirmhöhe anschneiden | DG 2.3.17/2 |
| Farbgleicher Grund | Bänder und Abschnitte stehen auf demselben `#161616`; Übergänge entstehen über Haarlinien und Abstand, nie über Farbwechsel | DG 2.3.17/3 |
| Überdeckung | das Band `fb-02` schiebt sich über den ausgeblendeten Fuß des Startfotos (am Schreibtisch 56 px) | `fb-02` |
| Lichtübertrag | der Lichtkeil des Erdlichts läuft über die Unterkante von V1 bis in den Kegel von V2: der einzige Rahmenbruch der Website | `fb-01`, `fb-02`; DG-E-4 A |
| Übergabe der Bewegung | eine Szene endet, bevor die nächste beginnt: Foto-Tiefe endet, wenn die Leiste die Bildschirmmitte erreicht; die Leiste steht, sobald das Gerät aus 01 den unteren Rand erreicht; in 03 erst Blattauftritt, dann Explosion | `fb-01` F.2, `fb-02`, `fb-05` |

**Festlegung K-14** (Abstand vor Kapitel-Haarlinien): Vor jeder Haarlinie, die eine h2 eröffnet, stehen 96 px (Schreibtisch 128), auch
direkt nach dem Band. `fb-02` (Festlegung V2-2: 48/64 px) und `fb-03` (96 px) widersprechen sich; eine Ausnahme nur für das Band würde
die Regel „Abstand folgt der Überschriftenebene“ brechen. Kosten: ≈ 0,06 Bildschirmhöhen, die Pakete bleiben bei 844 px auf Bildschirm 5.
Rückfall [H]: 48/64 px, wenn das Telefon-Video zwischen Band und 01 ein Loch zeigt.

### 11.1.7 Kontinuität auf Unterseiten

Unterseiten (Ratgeber, Fachartikel, Paketbedingungen, Rechtsseiten, Kundenkonto, 404, App-Einstieg) sprechen dieselbe Sprache mit weniger
Stimme: dieselbe Kopfzeile in einem ihrer drei Kontexte (`rh-01`), dasselbe Raster und dieselbe Ordnungslinie, dieselbe Haarlinie vor jeder
h2, dieselben Knöpfe, Felder, Zeilen und Zustände, derselbe Fuß (`rh-03`). Was entfällt: Kapitelnummern, Glas, CSS-Licht, Signature,
Rahmenbruch, scrollgekoppelte Bewegung. Was sich ändert:

| Seite | Kopf | Held | Schrift | Besonderheit |
|---|---|---|---|---|
| Ratgeber, Fachartikel | opak, Brotkrumen oben (44-px-Ziele) | führende Zeichnung als Papierkarte oder echtes Foto randlos (`ar-01`) | 40/32 · 24 · 17 · 15 · 13 (GEST:29) | Inhaltsverzeichnis, „Kurz gesagt“, lange Fragen bleiben (SKILL:29 gilt Verkaufsflächen) |
| Paketbedingungen | Kontext Fensterbauer, Ring „Pakete ansehen“ | keiner | wie Ratgeber | Merkmalstabelle ohne Querscrollen (`pb-02`) |
| Rechtsseiten | neutral | keiner | wie Ratgeber, Lesespalte ≤ 820 px | Widerrufsformular nach K10 (`re-01`) |
| Kundenkonto | Konto-Kopf (Bestand) | keiner | Skala des Betriebsbereichs (GEST:458), außerhalb dieser Grammatik | `pa-01` |
| 404 | neutral | Figur der Bildwelt, sobald vorhanden; bis dahin keiner | Website-Skala | drei Ring-Knöpfe, keine Cream (`nf-01`) |
| App-Einstieg | App-Kopf | Foto `app-start.webp` nach K1 | App-Skala 40 · 32 · 24 · 17 · 15 · 13 | App-Wechsel nach App-Regel (`ap-01`) |

---

## 11.2 Raster, Abstände, Proportionen

### 11.2.1 Umbruchpunkte, Spalten, Ränder

**Festlegung K-11** (Umbruchpunkte): zwei Layout-Umbruchpunkte, 640 und 1024 px, dazu die Höchstbreite der Spalte. Die Spezifikationen
nennen heute 600/601, 640, 760/761, 768, 880, 900, 960, 1024 und 1200 px, übernommen aus dem gewachsenen Bestand (`verkauf.css` 601, 761,
901, 1199; `portal.css` 520, 880). SG 10.9 nennt 640 und 1024; zwei Punkte halten die Zahl der Kompositionen prüfbar. Komponenten mit
eigener Schwelle (etwa die Paketreihe) fragen ihre Containerbreite ab, nicht den Bildschirm. Abweichung von bestehender Regel (GEST:462
„eine Spalte bis 760 px“) – Freigabe durch den Inhaber nötig (DS-AB-6).

| Bereich | Breite | Spalten | Spaltenbreite | Rinne | Seitenrand | Inhaltsbreite |
|---|---|---|---|---|---|---|
| Telefon | < 640 px | 4 | 77,5 px bei 390 | 16 px | 16 px | 358 px bei 390, 328 px bei 360 |
| Zwischengröße | 640–1023 px | 8 | (Breite − 48 − 112) ÷ 8, bei 768: 76 px | 16 px | 24 px | Breite − 48 |
| Schreibtisch | 1024–1103 px | 12 | 58 px bei 1024 | 24 px | 32 px | 960 px bei 1024 |
| Schreibtisch breit | ≥ 1104 px | 12 | 64,67 px | 24 px | mittig | 1040 px (bei 1280: x 120–1160) |

- **Festlegung K-12** (Rinne am Schreibtisch): 24 px. Elf Spezifikationen rechnen mit 24 px (`fb-04`, `fb-06`, `fb-07`, `fb-08`, `fb-11`,
  `fb-12`, `fb-13`, `he-01`, `he-02`, `he-03`, `he-05`), sieben mit 32 px (`fb-01`, `fb-03`, `fb-05`, `fb-09`, `fb-10`, `fb-15`, `he-04`).
  24 px liegt in der SG-Spanne 16–32 px, gibt breitere Spalten (64,67 statt 57,3 px) und entspricht PE C. Split 5 : 7 bei 1280: Text
  x 120–539, Bild ab x 563.
- **Festlegung K-13** (Rand bei 1024): 32 px, Spalte 960. Die Spezifikationen nennen 16, 20, 32, 40, 48, 51, 118, 136 und 148 px; `rh-01`
  legt für den Kopf 32 px fest, und der Kopf ist das einzige Element auf jeder Seite. Text über Spalten 1–5 bei 1024: x 32–418.
- **Telefon-Schrift bis 1023 px:** h1/h2 bleiben 32 px bis 1023 px und werden ab 1024 px 40 px (heute ab 761 px in `fb-03`, `fb-15` und `verkauf.css`, ab 640 px in `re-01`).
  Grund: Bei 768 px stehen Text und Bild im Stapel, nicht im Split, und 40 px wären dort überdimensioniert (SKILL:28). Abweichung von der
  heutigen Umsetzung, nicht von einer GEST-Regel (GEST:26 sagt nur „32 am Telefon“).

### 11.2.2 Abstands-Tokens

Basis 4 px (DR 3.3; GEST:32). Die Abstände sind nach Rolle benannt, nicht als gleichmäßige Leiter: innerhalb einer Gruppe : zwischen
Gruppen : zwischen Zonen ≈ 1 : 3 : 6 (SG 10.9; DG G6).

| Token | Telefon | ab 1024 | Rolle | Beispiel |
|---|---|---|---|---|
| `--a-haar` | 4 px | 4 px | Kennwort → Satz, Fakt → Grenze | `fb-08`, `fb-11` |
| `--a-gruppe` | 8 px | 8 px | innerhalb einer Gruppe: Kicker → Satz, Knöpfe einer Wahlgruppe, Feld → Hinweis | `st-04`, `fb-04` |
| `--a-nah` | 12 px | 12 px | Kapitelzeile → h2, h2 → Lead, Cream → Ring, Kachelfuge, Kartenabstand in der Reihe | DR 3.3; `fb-06` |
| `--a-kopf` | 16 px | 16 px | Haarlinie → Kapitelzeile, Abstand zwischen Gruppen in kurzen Listen | DG G2 |
| `--a-karte` | 20 px | 24 px | Innenabstand von Karten | GEST:32; `fb-06`, `re-01` |
| `--a-gruppen` | 24 px | 24 px | zwischen Gruppen; Haarlinie → h2 ohne Kapitelzeile; Lead → Held | DG G6; `fb-11` |
| `--a-zone` | 48 px | 64 px | zwischen Zonen; Block im selben Kapitel ohne h2 | `fb-08` |
| `--a-abschnitt` | 96 px | 128 px | zwischen Abschnitten | DR 3.3; DG G6 |

Weitere Werte nur als Komponentenmaß: Kachel innen 16 px, Glas-Meldung innen 10/12 px, Feld innen 0 16 px, Segment-Einzug 4 px.

**Anker und Sprungziele:** `scroll-padding-top` = Kopfhöhe + 16 px (72 / 80 px). Am h2 eines nummerierten Abschnitts `scroll-margin-top`
= Kopf + 16 + 16 + 16 + 12 = 116 px (Schreibtisch 124 px), ohne Kapitelzeile Kopf + 16 + 24 = 96 px (Schreibtisch 104 px). So steht nach
jedem Sprung die Haarlinie 16 px unter dem Kopf (**Festlegung K-15**; heute 72, 76, 96, 112 und 116 px in verschiedenen Spezifikationen).

### 11.2.3 Kontrollhöhen und Ziele

| Token | Wert | Einsatz |
|---|---|---|
| `--h1` (Bestand) | 44 px | kleine Knöpfe im Kopf und Menü, Textziele, Segmente des Umschalters, Zeilen der Brotkrumen, Unterzeilen im Menü |
| `--h2` (Bestand) | 52 px | Knöpfe, Felder, Fragenzeilen, Menüzeilen, Namensleiste |
| `--h-zeile` (neu, Bestand `.btn.big`) | 56 px | Zeilenknöpfe mit zwei Textzeilen (`fb-15`), Demo-Zeilen (`fb-12`) |
| Mindestziel | 44 × 44 px | jede Trefferfläche auf der Website (SKILL:71); WCAG 2.5.8 verlangt 24 px |

### 11.2.4 Proportionen

| Maß | Wert [V] | Herkunft |
|---|---|---|
| Kopfzeile | 56 px Telefon (6,6 % bei 844, 8,4 % bei 664; zulässig, weil die Zielgröße vorgeht), 64 px Schreibtisch | SG 10.9 ≤ 8 %; `rh-01` |
| Freifläche erster Bildschirm | ≥ 33 %, Ziel 40–60 % | DNA Nr. 8 |
| Fokusträger (Objekt) | 15–35 % der Fläche; Bühnen der Stufe 4: 25–35 % | SG 10.9; DG 2.4.2 |
| Textfläche ohne Kulisse | ≤ 15 % des ersten Bildschirms | SG 10.9 |
| Lesezone Schreibtisch | 5 von 12 Spalten (419 px bei 1280 = 33 %) | SG 10.9 25–42 % |
| Zeilenlänge | 45–75 Zeichen; Telefon ≥ 35 Zeichen; Schreibtisch Fließtext ≤ 820 px | SG 10.9; DG T9 |
| Split | 5 : 7 (Text : Bild), Bild randlos bis zum Fensterrand | DR 3.3 |
| Anschnitt der Folge | 8–25 % der Bildschirmhöhe (67–211 px bei 844) | SG 10.9 |
| Überdeckung im Motiv | Etikett ≤ 15 %, aufliegende Karte ≤ ⅓, Rahmenbruch Körper ≤ 10 %, schmale Teile ≤ 20 % | SG 10.9; `he-03`, `fb-05` |
| Sprung | Hauptelement ≥ 3 × Versalhöhe der Bedienschrift (bei 13 px ≈ 9,5 px) | DNA Nr. 7 |
| Held zu Nebenkörper | ≥ 3 × Höhe oder einziger Fokusreiz; Band: Mitte 1,25-fach, aber einziger scharfer und beleuchteter Körper | SG 10.9; `fb-02` |

---

## 11.3 Typografie

### 11.3.1 Rollen

Eine Familie: Inter, lokal in `web/fonts/` (GEST:26). Zwei Stimmen (DR 3.2): die Bühnenstimme für Aussagen und Zahlen, die Technikstimme für
Beschriftungen, Nummern und Maße; dazwischen Lese- und Bedientext. Größen nur 13, 15, 17, 24, 32, 40 (SKILL:69).

| Rolle | Telefon | ab 1024 | Zeile | Gewicht | Laufweite | Farbe | Einsatz |
|---|---|---|---|---|---|---|---|
| Titel (h1, h2) | 32 | 40 | 34 / 42 px (1,05) | 800 | −0,03 em | `--text`, genau ein Wort `--accent` | Bühnenstimme; höchstens drei Zeilen (h1), zwei Zeilen (h2); `text-wrap: balance` |
| Zahl als Held | 32 | 40 | 34 / 42 px | 800 | −0,03 em, `tabular-nums` | `--text`; Einheit 15 `--muted` auf der Grundlinie | Monatspreis `fb-06`, Kennzahl `fb-10`, Preis im Etikett `he-03` |
| Zwischentitel | 24 | 24 | 30 px | 800 | −0,03 em | `--text` | nur Ratgeber, Rechtsseiten, Paketbedingungen; nie in derselben Ansicht wie 32/40 |
| Lesetext | 17 | 17 | 26 px | 500 | 0 | `--text2`; Schlüsselwort 700 `--text` | Lead, Antworten, Sätze auf Verkaufsflächen; höchstens drei Zeilen je Block |
| Fließtext lang | 17 | 17 | 27 px | 500 | 0 | `--text2`, `strong` 700 `--text` | Ratgeber, Rechtsseiten |
| Bedientext | 17 | 17 | 22 px | 700 | −0,005 em | `--text` | Knöpfe, Fragen, Paket- und Kurznamen, Zeilenknöpfe, Menüzeilen, h3 |
| Nebentext | 15 | 15 | 22 px | 500; Kennwort 700 | 0 | `--text2`, Hinweis `--muted` | Datenblattwerte, Hakenzeilen, Beschriftungen von Feldern (700), Hinweise, Textziele (700) |
| Technikstimme Versal | 13 | 13 | 16 px (einzeilig), 18 px (mehrzeilig) | 600 | +0,12 em | Kicker und Kapitelnummer `--accent`, sonst `--muted`, auf Bild `--text2` | Kicker, Kapitelzeile, Kennwörter, Gruppenköpfe, Etiketten, „BEISPIEL“ |
| Technikstimme Zahl | 13 | 13 | 18 px | 600 | +0,02 em, `tabular-nums` | `--text2`, Beträge `--text` | Preiszeile, Maße („1.230 × 1.480 mm“), Dateinamen, Datum |

**Festlegung K-18** (Zeilenhöhen): Titel 34/42 px statt 1,05 als Bruchzahl, weil die Spezifikationen 1,05, 32/34, 32/35, 40/42 und 40/44
nebeneinander nennen und ganze Pixel die Lagen in den Tabellen von 09-abschnitte reproduzierbar machen. **Festlegung K-19** (Lesetext):
17/26 auf Verkaufsflächen, 17/27 für lange Texte; heute stehen 17/24 bis 17/27 und 1,4 bis 1,6 nebeneinander.

**Festlegung K-16** (Kapitelzeile): „01 · IHR NAME“ in der Technikstimme Versal, 13/16, 600, +0,12 em, `tabular-nums`, die Nummer
`--accent`, Punkt und Wort `--muted`, `aria-hidden` nur, wenn die Nummer zusätzlich im Menü steht. Heute ist die Zeile in `fb-03`, `fb-04`,
`fb-05`, `fb-09` ganz grün, in `fb-06`, `he-02`, `he-04` nur die Nummer, in `he-03` 800 mit 0,18 em, und `he-05` trägt eine Kapitelzeile
ohne Nummer. Grün nur an der Nummer hält das Signal in Kleinstmengen (GEST:24) und macht die Nummer zum Zeiger; Abschnitte ohne Nummer
tragen keine Kapitelzeile (`he-05` entfällt die Zeile „SECHS SCHRITTE …“, die h2 folgt 24 px unter der Haarlinie).

**Festlegung K-17** (Versalzeilen): Jede Versalzeile der Website hat 600 und +0,12 em; einzige Ausnahme ist der Rückfall +0,08 em bei
360 px Breite, wenn die Zeile sonst umbricht (`fb-01` G.1). Heute stehen 0,06 (`fb-05`), 0,08, 0,12 und 0,18 em mit 800 (`he-03`, Kicker in
`ar-02`) nebeneinander. Abweichung von bestehender Regel (GEST:26: „Kicker in Versalien mit Sperrung .18em“; `gemeinsam.css:44` 800) –
Freigabe durch den Inhaber nötig (DS-AB-1; in den Spezifikationen als I-AB-2, RE-AB-1, NF-AB-3 und in `ap-01`, `he-01` geführt).

### 11.3.2 Größenstufen je Ansicht

[V] Je Ansicht höchstens drei Textstufen (SG 10.1/4; PROMPT: eine Stufe spreizt höchstens 1,25-fach): **Titel** (32/40, auch Zahl als
Held) · **Lesen** (15–17, Spreizung 1,13) · **Technik** (13). Das nicht-textliche Hauptelement zählt als eigene, größte Stufe. Daraus folgt:

- 24 px steht nie in einer Ansicht mit 32/40 (DG 2.2.18). **Festlegung K-21:** Das Kennwort der Ankerkachel in `fb-11` (heute 24/800
  neben der h2 32) wird 17/700; der Rang der Kachel entsteht über volle Breite, Medaillon und Satz 17 statt 15.
- Paket- und Kurznamen sind Bedientext 17/700, nicht 800 (`fb-06` nennt 17/800, `fb-12`, `fb-15` und PE 17/700). 800 bleibt Titel und
  Zahl vorbehalten. Der Paketname 24 (GEST:449) wird 17 (J-AB-1, DG-E-2 A; Freigabe weiter offen).
- Maßstabssprung am Telefon: Titel 32 zu Technik 13 ergibt nur 2,46-fach; deshalb trägt am Telefon immer ein Bild, Gerät, Blatt oder
  Maßstab den Sprung (DG G4). Arbeitsflächen ohne Held (Fragen, Formular, Unterseiten) ordnen über Gewicht und Tonwert (DG-E-1 C).

### 11.3.3 13 px nur in der Technikstimme

**Festlegung K-20** [V nach Freigabe]: 13 px nur für die Technikstimme (Versalzeilen, Zahlen und Maße in `tabular-nums`, also auch die
Preiszeile); jeder bedeutungstragende Satz steht in 15 px (DG-E-6, Empfehlung dort; SG 10.9 schlägt ≥ 14 px vor). Heute setzen `fb-03`
(Hinweis unter dem Feld), `fb-06` (Steuerzeile), `fb-08` (Rechtshinweis, Standzeile) und `fb-12` (Satz in den Demo-Zeilen) Sätze in 13 px,
während `fb-09`, `fb-10` und `fb-11` schon 15 px verwenden. Bis der Inhaber DG-E-6 freigibt, gilt GEST (13 px zulässig); die Umstellung
erfolgt dann in einem Schritt für alle Abschnitte. Abweichung von bestehender Regel (GEST:26 „13 Label“; GEST:449, :452) – Freigabe
durch den Inhaber nötig (DS-AB-2).

### 11.3.4 Riesenschrift als Ebene

Die Riesenschrift ist in der DNA variabel (Raumschrift 7 von 15, nur mit plastischem Gegenüber, DNA 5.3) und in der ersten Fassung der
Website **nirgends eingesetzt** (DG-E-3; ZA 8.3.11). Für einen späteren Einsatz gelten [V]:

- Ebene Z 10 (Kulisse) zwischen Grund und Held; höchstens einmal je Seite; nur mit plastischem Gegenüber davor (Render des Fensters).
- 120–200 px, Farbe `#1f1f1f` bis `#262626` auf `#161616`, also rein dekorativ unter 3 : 1; als Grafik (SVG-Pfad) mit `aria-hidden`,
  das Wort steht zusätzlich als Live-Text in der Überschrift (DR 3.2; SG 10.10 Nr. 16).
- Verdeckt werden höchstens ¼ der Buchstaben, nie der erste oder letzte; am Telefon 90–100 % der Breite (SG 10.9).
- Nie neben der Material-Szene des Aufmaßblatts (Zielkonflikt Schrift gegen Material, ρ = −0,26) und nie in einer Folge, die dadurch drei
  Abschnitte der Stufe ≥ 3 hintereinander hätte (DG 2.3.18).
- Die Prüfsuite braucht vorher eine Ausnahme, sie misst auch ausgeblendete Schrift (SKILL:69–70).

---

## 11.4 Farbe als Funktion

### 11.4.1 Markenpalette und Rollen

Keine neuen Farbtöne (DR 3.1). Die Tabelle nennt die vorhandenen Tokens (`web/assets/gemeinsam.css:9-31`) mit ihrer einzigen Rolle auf
der Website; Kontraste wie in den Spezifikationen angegeben.

| Token | Wert | Rolle auf der Website | Kontrast |
|---|---|---|---|
| `--ground` | `#161616` | Grund aller Seiten, Kopf opak, Scrim | – |
| `--surface` | `#1f1f1f` | Karten, Kacheln, Menüblatt, opake Etiketten, Glasfüllung (60 %) | – |
| `--surface2` | `#262626` | Anzeige-Chips, Browserleiste, gedrückt (Ring, Zeile), Zeiger | – |
| `--surface3` | `#2e2e2e` | gewählt (mit Tintenkontur, K-3) | – |
| `--line` | `#2b2b2b` | Kartenring 2 px, Haarlinien auf `--ground` (≈ 1,3 : 1, Trenner) | 1,3 : 1 |
| `--line2` | `#3a3a3a` | Haarlinien auf `--surface`, Unterstreichung, Spur von Segmentgruppen, Hover von Haarlinien; nie einzige Grenze eines Knopfs | 1,6 : 1 |
| `--text` | `#f3f2ee` | Überschriften, Bedientext, Fokus, gewählt (Kontur) | 16,2 : 1 auf Grund, 14,7 : 1 auf Fläche |
| `--text2` | `#c9c8c3` | Lesetext, nicht gewählte Segmente | 10,8 : 1 / 9,8 : 1 |
| `--muted` | `#93928d` | Technikstimme ohne Signal, Hinweise, Kontur von Ring-Knöpfen und Feldern | 5,8 : 1 / 5,3 : 1 |
| `--accent` | `#8fd694` | Signal: Kicker, Kapitelnummer, ein Wort je Überschrift, Haken, aktive Marke | 9,6 : 1 auf Fläche |
| `--cream` = `--primary` | `#f1f0ea` | genau eine Hauptaktion je Bildschirm | `--on-primary` darauf 15,8 : 1 |
| `--mo`, `--el` | `#ff8a5b`, `#7aa2ff` | Bedeutung: Orange = Maueröffnung, Blau = Element; nur in Zeichnungen, Maßlinien, Render-Spiegelung; `--el` zusätzlich als Lichtfarbe des Erdlichts | – |
| `--bad` | `#ff7b72` | nur im Fehlerzustand, immer mit Satz und Punkt | 7,2 : 1 |

**Rollen aus vorhandenen Werten** (neu als Token, kein neuer Farbton außer `--primary-druck`):

| Token | Wert | Rolle | Status |
|---|---|---|---|
| `--papier` | `#ffffff` (= `--primary-hover`) | Papierweiß von Blatt, Zeichnungskarte, Ankerkachel H5 | Abweichung (H5-AB-1), Freigabe nötig |
| `--mo-papier` | `#c2410c` (aus `web/bilder/messpunkte.svg`) | Zeichnungsorange auf Papier; `--mo` erreicht auf Weiß nur ≈ 2,3 : 1 | Abweichung (P-AB-2), Freigabe nötig |
| `--tinte-papier` | `#141414` (aus `messpunkte.svg`) | Schrift auf Papier | wie oben |
| `--primary-druck` | `#e2e1db` | gedrückte Cream (K-2) | neuer Wert, Freigabe nötig (DS-AB-7) |
| `--scrim-blatt` | `rgb(0 0 0 / .6)` | Scrim hinter dem Menüblatt (Bestand `portal.css:194`) | Bestand |

Ein Blau auf Papier ist nicht festgelegt; bis zur Freigabe zeigen Papierflächen nur die Maueröffnung (Orange), wie `he-02` und `he-05`.

### 11.4.2 Akzentregel

- **Cream** [V]: genau eine Cream-Fläche je Bildschirm (SKILL:71), immer die Hauptaktion. Cream in Bildern (etwa der Startknopf in einer
  Bildschirmaufnahme) zählt mit, sobald im selben Bildschirm eine Cream der Bedienschicht steht; dann ist die Bild-Cream kleiner als ¼ ihrer
  Fläche (PE E, Ablenkung 1). Nie Cream an einem Held (DG G3), nie Cream für „gewählt“ (K-3), nie eine helle Karte als zweiter Hellwert (K-40).
- **Grün** [V]: Signal in Kleinstmengen: Kicker, Kapitelnummer, genau ein Wort je Überschrift, Haken, aktive Marke (offene Frage, erreichte
  Ablaufmarke, aktuelle Nummer im Menü), Medaillon `--accent-soft` hinter einem Haken (`fb-11`). Nie als Fläche hinter Text, nie am Held,
  nie für Fließtext (GEST:24). Rechtsseiten tragen kein grünes Wort (RE-AB-2).
- **Papierweiß**: nur Papier (Blatt, Zeichnungskarte) und die Ankerkachel in `he-05` nach Freigabe H5-AB-1. Papierweiß ist dort der
  Fokusreiz und steht deshalb nie neben einer zweiten Papierfläche im selben Bildschirm (`he-03` prüft das gegen die Karte aus `he-02`).
- **Anteile je Bildschirm** [V]: ≥ 80 % unbunt, ≤ 5 % kräftig, > 0,3 % farbig, gemessen mit `farbanteil.py` bei 390 × 844 (DR 3.1).
- **Zustand ohne Zusatzfarbe** [V]: Rang und Zustand laufen über Füllung, Kontur, Tonwert und Gewicht, nie über eine zweite Akzentfarbe;
  einzige Ausnahme ist `--bad` im Fehlerzustand mit Symbol und Text (SG 10.10 Nr. 5).

### 11.4.3 Lichtfarben

[V] Licht ist Bildschicht und hat eine Quelle im Bild (DR 3.1; DG 2.2.0). Drei Lichtfarben sind zulässig, eine je Bildschirm:

| Lichtfarbe | Quelle | Deckkraft | Einsatz |
|---|---|---|---|
| Zeichnungsblau `--el` | Erdlicht im Bullauge | Erdlicht 16 % → 0, Keil 12 % → 6 %, Kegel 12 % → 5 % → 0, Schlitz 50 % als 1-px-Linie | `fb-01`, `fb-02` |
| Cream | Bildschirm des Geräts | ≤ 12 %, Ellipse 360 × 192 px (1,2 × Gerätebreite) | `fb-04` |
| warmes Tageslicht | nur im Foto, ohne CSS-Lichtfläche | – | `he-01`, `he-07`, `ap-01` |

Radial und weich, höchstens drei Verlaufsstopps, ein Helligkeitszentrum hinter dem Anker, `mix-blend-mode: screen` nur in der Bildschicht,
eingebackenes Dithering ± 1–2 von 255 gegen Streifen (SG 10.9). Grün ist keine Lichtfarbe auf der Website (kein Schein, DG-AB-14).

---

## 11.5 Materialien, Licht, Schatten, Tiefe

### 11.5.1 Ebenen-Tokens

| Token | Z | Inhalt | zählt als Ebene |
|---|---|---|---|
| `--z-grund` | 0 | Grund, Lichtraum, Lichtkeil, Messraster | ja |
| `--z-kulisse` | 10 | Riesenwort (derzeit leer) | ja |
| `--z-bild` | 20 | Foto, Render, Bildfolge, Gerät, Blatt mit Schichten, Zeichnung, Beispielbild, Maßstab, Maßlinie samt Wert, Bildband | ja |
| `--z-vermittelnd` | 25 | Glasflächen (Meldungen, Umschalter, PDF-Hinweis, Maßwert), aufliegende Bildkarten (Etikett, Karte „Aus Ihrer Probe“, Einzeiler-Karte), Leitlinien, Lichtschlitz und Kegel | ja |
| `--z-scrim` | 28 | Scrim unter dem Kopf auf Bühnen | nein |
| `--z-ui` | 30 | Bedienschicht: Text, Knöpfe, Karten mit Inhalt, Felder, Zeilen | ja (eine Ebene mit 40) |
| `--z-kopf` | 40 | Kopf, Menüblatt, Overlays | – |

**Festlegung K-39** (interaktives Glas): Die Glasfläche liegt auf Z 25, ihr Inhalt und ihre Trefferfläche auf Z 30. `he-01` setzt den
Umschalter ganz auf Z 30 (Festlegung I-3), `st-02` und `st-03` trennen Fläche (25) und Inhalt (30), ZA nennt 25. Die Trennung hält G1
ein (Glas ist vermittelnde Bildschicht, Bedienung ist Z 30) und ändert die Zählung nicht.

Zählung [V] (SG 10.9): sichtbare Bildebenen plus Bedienschicht als eine Ebene; Scrim und Lichtraum zählen nicht. Am Telefon 3–4, Stufe 4
höchstens 5. Mindestens eine sichtbare Verdeckung je Bühne (Kicker im Fotoauslauf, Telefon vor dem Browser, Karte auf dem Blatt, Pille über
dem Kartenrand, Folgesektion über dem Fotofuß). Nie verdeckt: Gesicht, Hände, Zollstock, Papierflieger (SKILL:87), Navigation, Hauptaktion,
Lesetext, Fokusrahmen.

### 11.5.2 Materialien

[V] Material sitzt im Held, nie in der Bedienschicht (DNA Nr. 9). Fünf Materialien, je Ansicht genau ein Materialträger, Glas daneben nur
vermittelnd:

| Material | Erscheinung | Regel |
|---|---|---|
| Foto der Figurenwelt | warmes Filmlicht, fotorealistisch, randlos auslaufend | Auslauf über das untere Viertel bis Drittel mit mehrstufiger Maske (fünf Stopps wie `he-01` C.5), nie harte Kante |
| Render aus der eigenen Bühne | Putz, Klinker, Holz mit Gehrung, Aluminium, Glas mit blauer Spiegelung | immer in gestaltetem Licht (6 von 6, DNA 5.3); Grund exakt `#161616` (ΔE00 ≤ 1) oder Alphakanal mit 1–2 px Übergang |
| Gerät | abstrahiertes Telefon ohne Kamera-Insel, echte Bildschirme | ein Baustein (K-23, unten) |
| Papier | Aufmaßblatt, Zeichnungskarte | Papierweiß `--papier`; Blattkante ist Objektkante, kein Rahmen; −2° gedreht im Beweis, frontal in Zeichnungen |
| Glas | Meldung, Umschalter, PDF-Hinweis, Maßwert | nur über Bildinhalt; Werte 11.5.3 |

**Festlegung K-23** (Gerät): ein Gerätebaustein nach `fb-03` C.3: 300 px breit, Rand 10 px `--surface`, Außenradius 44 px,
Bildschirmradius 34 px (Außen − Rand), Lichtkante nach 11.5.4, unten über 48 px in den Grund ausgeblendet, kein Schatten. `fb-04` nennt
für „dasselbe Gerät“ Radius 40/32, Körper `--ground` und einen 1-px-Ring `--line2`; das bräche den Formanschluss zwischen 01 und 02, der
gerade die Wiedererkennung tragen soll. Verkleinert proportional (Mini-Vorschau `fb-15`: 96 px breit, 14/11 px; Schreibtisch 160 px, 23/18 px).
Browserfenster: Radius 12, Leiste 24 px `--surface2` (statt `#222` in `fb-06`), Adresspille 18 px hoch mit Schloss 10–11 px und „· Beispiel“.

### 11.5.3 Glas-Tokens

| Token | Wert | Herkunft |
|---|---|---|
| `--glas-fuellung` | `rgb(31 31 31 / .60)`, bis .65 wenn der Kontrast es verlangt | DG 2.4.1 (55–65 % unter Kleintext) |
| `--glas-blur` | 24 px, Sättigung 100 % (keine Anhebung) | DG-AB-17; SG 10.9 |
| `--glas-ersatz` | .80 ohne Weichzeichner; .85 am Telefon über bewegtem Foto | SG 10.9 (65–85 %); `st-03` |
| `--glas-deckend` | .95 bei `prefers-reduced-transparency` oder `prefers-contrast: more` | SG 10.9 |
| Radius | 18 px; Umschalter als Pille | DG-AB-8 |
| Kante | 1 px nach 11.5.4 | SG 10.9 |
| Schatten | keiner | DNA Nr. 6 |
| Anzahl | gleichzeitig ≤ 2 am Telefon, ≤ 3 am Schreibtisch; im Meldungsstapel trägt nur die vorderste Live-Unschärfe | SG 10.9; DG 2.4.1 |

Am Telefon kein Glas über bewegtem Motiv (SG 10.10, Mobil): Die Foto-Tiefe in `fb-01` nimmt deshalb den Stapel mit in die Bildgruppe
(`fb-01` F.2), der PDF-Hinweis nutzt dort die Ersatzfüllung (`st-03`).

### 11.5.4 Licht-Tokens, Lichtkante

**Festlegung K-24** (Lichtrichtung): Haus-Token `--licht-x: -0.6; --licht-y: 0.8` (Licht fällt von oben rechts nach links unten, wie der
Lichtstreifen des Zeichens; DG 2.2.0, DG-E-8). Ein Foto mit eigener sichtbarer Quelle setzt seine Richtung für die Ansicht. `fb-03`, `fb-04`
und `fb-06` arbeiten mit „Licht von oben“ (`--licht-y: 1`), PE und `fb-06` fragen Fotos des Beispielbetriebs mit „Licht warm von oben
links“ an, `fb-02` fragt Renders mit „Licht von oben rechts“ an. Damit hätten die Renders der Leiste und des Geräts aus derselben Bühne
verschiedene Lichtrichtungen. Ab jetzt: alle Renders, alle angefragten Fotos ohne eigene Quelle und alle Lichtkanten folgen dem Haus-Token.

| Token | Wert | Einsatz |
|---|---|---|
| `--kante-alpha` | `rgb(243 242 238 / .14)` | 1 px rundum an allem, was schwebt: Glas, Gerät, Etikett, Karte auf Papier, Menüblatt, Bildrahmen im Browser |
| `--kante-licht` | `rgb(243 242 238 / .24)` | Ober- und rechte Kante (lichtzugewandt) |
| `--kante-quelle` | Lichtfarbe der Quelle mit 24 % | statt `--kante-licht` an der Kante, die zur farbigen Quelle zeigt (Meldungen und PDF-Hinweis rechts `--el`) |
| Lichthof | 1–1,5 × Breite des Fokusträgers, ≤ 3 Stopps | SG 10.9 |

Karten, Kacheln, Zeilen und Felder auf dem Grund bekommen keine Lichtkante, weil sie nicht schweben (`fb-07`, `fb-11`, `re-01`, `st-04`).
Heute nennen die Spezifikationen für die Kante 10 % oben (`fb-01`), 14/24 % (`he-03`, `st-02`, `he-01`), rundum 14 % (`fb-04`) und nur oben
24 % (`rh-02`); alle werden auf die Tabelle gesetzt.

### 11.5.5 Schatten

[V] Auf dunklem Grund gibt es keinen Schatten; Schwebendes trennt sich über Lichtkante und Verdeckung (DNA Nr. 6; DG-AB-1). Einzige
Schattenstelle ist der Begleitschatten einer opaken Karte, die auf Papier liegt.

**Festlegung K-25** (Begleitschatten): Versatz v = 10 % der Kartenhöhe in Lichtrichtung, also x = −0,6 · v, y = 0,8 · v; Weichzeichnung
2–3 × v; Ausdehnung −25 % von v; Farbe `--ground` mit 6 % (SG 10.9: 4–8 %, dunkelste Stelle ≤ 8 von 255 Tonwerten unter dem Papier). Für
die Karte „Aus Ihrer Probe“ in `fb-05` (heute `0 4px 16px -4px`, senkrecht) und das Etikett in `he-03` (−5/6 px) gilt derselbe Satz.

### 11.5.6 Unschärfe, Textur, Tiefe in Bewegung

- Unschärfe nur an drei Orten [V]: hinter Glas (24 px), an Begleitelementen der Leiste (2 px Telefon, 4 px Schreibtisch, 0,3–0,6 % der
  Breite), im Bild eingebacken. Fokusträger und Schrift bleiben scharf; der Unschärferadius wird nie animiert (SG 10.9).
- Messraster wie Millimeterpapier (fein 8 px, kräftig 40 px, Weiß 3–5 %, ≤ 1,3 : 1) nur unter `fb-05`, zum Rand und unter jedem Lesetext
  ausgeblendet. Korn nur als eingebackenes Dithering.
- Tiefe der Bildebenen beim Scrollen (Parallaxe) nur in Stufe 4 (K-9, 11.7.4).

---

## 11.6 Formensprache und Komponentenfamilien

### 11.6.1 Radien

**Festlegung K-22** [V]: vier Werte auf allen Breiten, keine Verkleinerung am Telefon (DG-AB-8; SG 10.10 Nr. 4 „höchstens vier“).
Abweichung von bestehender Regel (GEST:32 „Radien 8 · 12 · 18 · 24“) – Freigabe durch den Inhaber nötig (DS-AB-5).

| Token | Wert | Wofür |
|---|---|---|
| `--pill` | 999 px | Knöpfe, Chips, Segmente, Spuren, Pillen, Kreise (`50 %`) |
| `--r4` | 24 px | Karte (mit Ring), Paketkarte, Papierkarte (Zeichnung, `he-02`, `ar-01`), Wechselkarte, Hervorhebungskarte (`re-01`) |
| `--r3` | 18 px | Glas (Meldung, PDF-Hinweis), Menüblatt (oben) |
| `--r2` | 12 px | Kachel, Bildfenster und Browserrahmen, Feld, Miniatur, Etikett auf Papier, Druckfläche von Zeilen, Fokus von Zeilen |

`--r1` (8 px) bleibt der App vorbehalten. Motivradien (Gerät 44/34, Kästchen im Aufmaßblatt) gehören zum Bild und zählen nicht. Heute
stehen Karten mit 18 px (`pa-01`, `fb-11`, `st-03` am Schreibtisch) neben solchen mit 24 px, Kacheln mit 18 px (`fb-11`) neben 12 px
(`he-05`), Miniaturen mit 8 px (`he-04`) neben 12 px (`fb-12`), und `ar-01` und `he-02` verkleinern die Papierkarte am Telefon auf 18 px.
`st-03` behält 18 px auch als opake Karte am Schreibtisch, weil der Baustein dort die Glas-Meldung ersetzt (Familie Glas). `pa-01` liegt in
der Kontoskala (GEST:458) und bleibt bei GEST.

### 11.6.2 Knöpfe

| Familie | Ruhe | Hover (nur `hover: hover`) | Fokus | Gedrückt | Laden, Fehler |
|---|---|---|---|---|---|
| **Cream** (Hauptaktion) | Pille 52 px, `--primary`, Schrift 17/700 `--on-primary`, Innenabstand 22 px, Pfeilkreis 28 px rechts (`--on-primary`, Pfeil `--primary`, 8 px vom Rand) | innere 2-px-Kontur `--on-primary` 24 % | `outline: 2px solid var(--text)`, Abstand 2 px | Füllung `--primary-druck`, sofort | Senden: ab 300 ms `aria-busy`, im Pfeilkreis dreht ein 2-px-Ring (1,2 s je Umdrehung), `aria-disabled` statt `disabled` (`fb-09`) |
| **Ring** (Nebenhandlung) | Pille 52 px (im Kopf und Menü 44 px, 15/700), transparent, innere Kontur 2 px `--muted`, Schrift 17/700 `--text`, kein Pfeilkreis | Kontur → `--text` | wie oben | Füllung `--surface2` | – |
| **Textziel** | 15/700 `--text`, Unterstreichung 1,5 px `--line2` mit 4 px Abstand, Ziel 44 px hoch | Unterstreichung → `--text` | wie oben | Füllung `--surface2` in der Zielfläche | – |
| **Zeilenknopf** | 56 px, Radius voll, zwei Zeilen (17/700, darunter 13 oder 15); Cream oder Ring wie oben | wie Cream bzw. Ring | wie oben | wie Cream bzw. Ring | – |
| **Kreisknopf** | 44 px, `--surface2`, Kreuz 16 px aus 2-px-Strichen `--text2` | Kreuz → `--text` | wie oben | `--surface3` | – |

- **Festlegung K-1** (Ring-Kontur): 2 px `--muted` (≈ 5,8 : 1) für jeden Ring, auch den Kopf-Ring. Die Kontur ist die einzige Grenze des
  Knopfs und braucht 3 : 1 (WCAG 1.4.11; DG-E-10). `fb-04`, `he-01`, `he-04`, `ap-01`, `rh-01`, `rh-02` nennen heute `--line2` (1,6 : 1)
  mit Hover `--line2` → `--muted`; `fb-01`, `fb-03`, `fb-08`, `fb-12`, `fb-15`, `ar-02`, `nf-01`, `st-04` nennen `--muted` → `--text`.
  Abweichung von bestehender Regel (GEST:24 „`--muted` nur für Labels und Nebenzeilen“; `gemeinsam.css:58` Ghost-Rand `--line2`) –
  Freigabe durch den Inhaber nötig (= NF-AB-2, DS-AB-10).
- **Festlegung K-2** (Cream-Hover und Druck): Hover ist überall Kontur (DG 2.4.1); an der Cream ist das eine innere 2-px-Kontur
  `--on-primary` 24 % (`fb-06`). Die äußere Kontur `--text` (`fb-01` F.3) wäre vom Fokusring nicht zu unterscheiden; Weiß `--primary-hover`
  (`ap-01`, `ar-02`, `fb-09`, `fb-15`, `he-01`, `rh-01`) ist ein Füllungswechsel und damit der Kanal von „aktiv“. Druck ist Füllung:
  `--primary-druck` an der Cream, `--surface2` am Ring; keine Deckkraftänderung (heute `.88` in `fb-01`, `.86` in `rh-01`, Weiß in `he-07`,
  `color-mix` in `ap-01`), keine Skalierung (`scale(.98)` aus `gemeinsam.css:65` entfällt auf der Website). Abweichung von bestehender
  Umsetzung (`--primary-hover`) – Freigabe durch den Inhaber nötig (DS-AB-3).
- **Festlegung K-30** (Breite am Telefon): In Bühnen (K1) stehen Cream und Ring untereinander, gleich breit nach dem längeren Text plus
  Innenabstand und Pfeilkreis, mindestens 212 px, linksbündig (`fb-01`); das hält die Diagonale und die Freifläche. Volle Spaltenbreite
  (358 px) nur in Formularen (K10) und Abschlüssen (`he-07`). `he-01` und `ap-01` (heute 358 px) übernehmen die Bühnenregel. Einzelne Ringe
  im Fluss (`fb-08`, `fb-12`, `he-04`) haben ihre eigene Breite.
- **Festlegung K-31** (Pfeilkreis): gefüllter Pfeilkreis 28 px (Bestand `.pf`) nur an der Cream, auch in der Paketkarte (`fb-06` nennt
  36/32 px). Zeilen mit Ziel tragen rechts einen Chevron 8 × 14 px `--muted` (intern) oder „↗“ 16 px ohne Kreis (neuer Tab); der
  Kontur-Kreis 32 px mit „↗“ in `fb-12` entfällt, damit der Pfeil im Kreis das Zeichen der Hauptaktion bleibt (DNA-B B.3.7).

### 11.6.3 Auswahl: Segmente, Wahlzeilen, Namensleiste

**Festlegung K-3** (gewählt) [V]: gewählt = Füllung `--surface3` plus innere 2-px-Kontur `--text`, Schrift 700 `--text`; nicht gewählt =
ohne Fläche, Schrift 500 `--text2`. Nie Cream (SKILL:71: eine Cream je Bildschirm). Die Kontur in Tinte trägt die 3 : 1 gegen jeden
Untergrund (auch über Glas, `st-02`), die Füllung ist der Kanal „aktiv“ (DG 2.2.10). Heute zeigen fünf Spezifikationen „gewählt“ auf vier
Arten: opak `#161616` mit 1-px-Tinte (`st-02`), 2-px-Tinte mit 4 px Einzug ohne Füllung (`he-01`), `--surface3` ohne Kontur (`rh-02`),
Füllung `--muted` mit dunkler Schrift (`fb-04`), Zeiger `--surface2` (`fb-06`); DG 2.2.10 nennt noch Cream. Der Zustand „erledigt“ (eine
Probemessung ist gemacht, `he-02`) ist kein „gewählt“: Er zeigt einen Haken 12 px `--accent` vor dem Wort, die Fläche bleibt. Abweichung von
bestehender Regel (GEST:24, `gemeinsam.css:82`, `:90`: gewählt in Cream) – Freigabe durch den Inhaber nötig (DS-AB-4; = ST2-AB-1, P-AB-1).

| Baustein | Maße | Spur | Zustände außer „gewählt“ |
|---|---|---|---|
| Umschalter (`st-02`) | Spur 284 × 44, Segmente 150 und 126 × 36, 4 px Einzug, Schrift 15/20 | Glasfläche (11.5.3), auf V1 Ersatzfüllung | Hover: Kontur `--line2` am nicht gewählten Segment; Finger: Vorschau 50 % |
| Menü-Segment (`rh-02`) | Gruppe 52 hoch, Segmente nach Wortbreite | 2-px-Innenkontur `--line2` | wie oben |
| Namensleiste (`fb-06`) | 358 × 52, drei Segmente 116 × 52, Zeiger 108 × 44, zwei Zeilen (Kurzname 13/600, Preis 15/700) | 2-px-Innenkontur `--line` | Zeiger folgt dem Wischen 1 : 1 (Zustand) |
| Wahlzeilen (`fb-04`) | 171 × 52, Abstand 8 senkrecht, 16 waagerecht, `aria-pressed` | jede Zeile ein Ring nach K-1 (2 px `--muted`), weil die Kontur ihre einzige Grenze ist | Hover Kontur → `--text`; Druck `--surface2` |
| Messknöpfe (`he-02`) | 114 × 44 in einer Zeile, Abstand 8 | Ring nach K-1 | erledigt: Haken `--accent` vor dem Wort |

**Festlegung K-29** (Umschalter): Maße nach `st-02` (gemessen: „Hauseigentümer“ 122 px und „Fensterbauer“ 98,4 px in 15/700 brauchen
284 px); `he-01` und `fb-01` F.5 rechnen noch mit 260 × 44 und übernehmen 284. Lage bleibt x 16–300, y 68–112.

### 11.6.4 Karten, Kacheln, Chips

| Baustein | Fläche | Radius | Innenabstand | Zustände |
|---|---|---|---|---|
| Karte | `--surface`, Ring 2 px `--line` (innen) | 24 | 20 / 24 | nur bedienbar als Ganzes (Paketkarte am Schreibtisch): Hover Ring → `--muted` |
| Paketkarte | wie Karte; empfohlen Ring 2 px Cream und Pille „Empfohlen“ als Kontur 2 px `--primary` auf Füllung `--ground`, 13/700 Versal | 24 | 20 / 24 | Maße nach `fb-06` C (Karte 310 × 877, Pille 122 × 28); PE C wird nachgezogen (K-38) |
| Kachel | `--surface`, Ring 2 px `--line` | 12 | 16 | Hover Ring → `--line2`; Druck Füllung `--surface2` |
| Ankerkachel | wie Kachel, über die volle Spaltenbreite (Telefon) bzw. zwei Spalten; in `he-05` nach Freigabe Papierweiß ohne Ring | 12 | 20 | wie Kachel |
| Anzeige-Chip (nicht bedienbar) | `--surface2` ohne Rand, 36 px hoch, 13/700 (nach DG-E-6 15/700), innen 12 (10 mit Haken 6 × 10), Abstand 8 | voll | – | keine; sieht bewusst nicht wie ein Knopf aus (keine Kontur, 36 statt 44 px) |

**Festlegung K-32** (Chips): `fb-01` (13/700, innen 10, Abstand 6, `--surface2` ohne Rand) und `he-03` (15/500, innen 14, Abstand 8,
`--surface` mit Ring) beschreiben denselben nicht bedienbaren Chip verschieden; die Tabelle gilt für beide. Der Ring fällt weg, weil eine
umrandete Pille wie ein Ring-Knopf aussähe.

### 11.6.5 Glas-Bausteine

| Baustein | Maße | Inhalt | Ebene |
|---|---|---|---|
| Glas-Meldung (`fb-01`) | 220 × 64, Radius 18; Stapel aus drei, die hinteren nur als Kante (`translateY` 10/19 px, `scale` .94/.88) | grüner Punkt 8 px mit 4-px-Ring `--ok-soft`, Titel 15/800 → **15/700** (Bedientext-Gewicht; K-21), Zeile 13/500 `--text2`; Etikett „BEISPIEL“ darüber | 25 |
| PDF-Hinweis (`st-03`) | ≤ 260 × 168, Radius 18 | Titel 15/700, Zeile 15, Handlungszeile 44 px mit Chevron | 25 / 30 |
| Umschalter (`st-02`) | 11.6.3 | – | 25 / 30 |
| Maßwert (`fb-01`) | Pille 13/600 `tabular-nums`, Füllung `rgb(22 22 22 / .62)`, Weichzeichner 12 px, Ring 1 px `--mo` 50 % | Wert der Maßlinie | 20 (Teil der Maßlinie) |

### 11.6.6 Medien

| Baustein | Regel |
|---|---|
| Foto-Bühne | randlos, Auslauf unteres Viertel bis Drittel (fünfstufige Maske), Telefon eigener Zuschnitt per `<picture>`, Schreibtisch ab Spalte 6 bis zum Fensterrand |
| Bildband | 390 × 200 (Telefon), oben und unten ausgeblendet, h2 darf den Bandfuß um 24 px überdecken (`he-07`) |
| Browserrahmen mit Beispielbild | Radius 12, Leiste 24 px `--surface2`, Adresspille „ihr-name-fenster.de · Beispiel“; Bild 4 : 3; Lichtkante oben `--kante-alpha` (Licht von oben rechts) |
| Gerät | K-23 |
| Blatt | Papier, −2°, Lichtkante oben am Kopfband `--kante-licht`, Schichten als eigene Bildebenen; aufliegende Karte opak `--surface` mit Lichtkante und Begleitschatten K-25 |
| Papierkarte (Zeichnung) | `--papier`, Radius 24, ohne Ring und ohne Schatten; Zeichnungsfarben `--mo-papier`, `--tinte-papier` |
| Miniatur | Radius 12, 1-px-Kontur `--line2` oder Lichtkante oben, Maske unten über 32 px |
| Maßlinie | Haarlinie 1,5 px mit Endstrichen und Schrägstrichen, Wert mittig auf dunklem Glas, an senkrechten Linien gedreht; Orange = Öffnung, Blau = Element; nie über Gesicht oder Hände (DR Baustein 4) |

**„Beispiel“-Kennzeichnung** (**Festlegung K-36**): genau eine von zwei Formen je Material. (a) Etikett „BEISPIEL“ oben links am Material
in der Technikstimme Versal 13/16, `--text2` auf Bild, `--muted` auf Fläche (`fb-01`, `fb-04`, `fb-15`, `he-02`, `he-03`); (b) in der
Adresszeile von Browser oder Gerät „· Beispiel“ in `--muted` hinter der Domain (`fb-03`, `fb-06`). Heute mischen die Spezifikationen
beide Farben und Schreibweisen ohne Regel.

### 11.6.7 Navigation

| Baustein | Regel |
|---|---|
| Kopf (`rh-01`) | 56 / 64 px; auf Bühnen flächenlos über Scrim, sonst opak `#161616` mit Haarlinie unten; ein Handlungsträger rechts (Ring bzw. Cream nach `kopfCta`) |
| Scrim auf Bühnen | **Festlegung K-26:** eine Form, 96 px hoch, Stopps bei 0 / 24 / 48 / 72 / 96 px mit 100 / 75 / 45 / 15 / 0 % der Startdeckkraft; Startdeckkraft 60 % (`rh-01`), bis 75 %, wenn Logo oder Menüzeichen über einem hellen Fotorand sonst 4,5 : 1 bzw. 3 : 1 verfehlen (heute `he-01`: 64 % bis y 56, aus bei 120 px) |
| Wechsel flächenlos → opak | **Festlegung K-27:** sobald das erste Element der Bedienschicht unter dem Kopf (auf `/` der Umschalter, sonst der Kicker) dessen Unterkante + 8 px erreicht; Deckfläche ein in 150 ms `--e-out`, aus in 110 ms `--e-in`; Hysterese 24 px (heute `rh-01`: Kicker − 64 px; `st-02`: `scrollY ≥ 12`) |
| Kopf-Ring | **Festlegung K-28:** erscheint, wenn die Startbild-Cream mit gleichem Ziel unter dem Kopf verschwindet (220 / 165 ms Deckkraft); ausgeblendet, solange Namensleiste oder Kartenreihe das Band unter dem Kopf bis 60 % der Bildhöhe schneidet, in Zustand A und B (`fb-06`, J-AB-9); danach in Zustand A „Paket anfragen“ (Textwechsel 100 + 120 ms, `rh-01`); ausgeblendet, solange 05 ≥ 120 px über dem unteren Rand steht; Kontur nach K-1 |
| Menüblatt (`rh-02`) | `<dialog>`, `--surface` opak, Radius 18 oben, Lichtkante oben `--kante-licht`, Scrim `--scrim-blatt`, ≤ 85 dvh; Zeilen 52 / Unterzeilen 44; Gruppenköpfe Technikstimme; aktuelle Nummer `--accent`; Haarlinien `--line2` |
| Kapitelzeile | K-16 |
| Brotkrumen | 13/600, Ziel 44 px, Trenner „›“ `--line2`; Ratgeber oben, Seite für Fensterbauer über dem Fuß (ZA 8.2.5) |
| Fuß (`rh-03`) | Haarlinie oben, Listen 15/20 `--text2`, Zeilen ≥ 44 px, „Vertrag widerrufen“ als 44-px-Ring |

### 11.6.8 Listen und Zeilen

| Baustein | Regel |
|---|---|
| Fragenzeile (`fb-13`, Muster für alle Fragenlisten) | `details`, 52 px einzeilig, 74 px zweizeilig, Frage 17/22 700, Antwort 17/26 `--text2`, Zeichen „+“ aus zwei 14 × 2-px-Strichen in einem 24-px-Feld rechts, offen `--accent` |
| Haarlinie in Zeilen | **Festlegung K-33:** `--line` auf `--ground`, `--line2` auf `--surface`; Hover: Linie unter der Zeile → `--line2`, Zeichen → `--text` (`fb-13`). `fb-07` (Ruhe `--line2`, Hover `--muted`) übernimmt das, weil es ausdrücklich „wie die Fragen“ sein soll |
| Hakenliste | Haken 16 × 16 (Strich 2,5 px) `--accent` an der linken Kante, Text ab x 48, 15/22; die ehrliche Grenze ohne Haken in `--text2`, eingerückt |
| Datenblatt (`fb-06`) | `dl`, Kennwort 13/600 Versal `--muted`, Wert 15/500 `--text`, Haarlinien `--line2` auf der Karte |
| Tabelle (`fb-07`, `pb-02`) | Telefon ohne Querscrollen: Zeilentitel über die volle Breite, darunter drei Wertspalten à ≈ 114 px; Kopf mit drei Kurznamen klebt unter dem Kopf |

### 11.6.9 Formulare

| Teil | Regel |
|---|---|
| Beschriftung | über dem Feld, 15/20 700 `--text`; „(freiwillig)“ 500 `--muted` |
| Feld | **Festlegung K-35:** 52 px, Radius 12, Fläche `--ground`, `border: 1px solid var(--muted)` (bleibt in `forced-colors`), Schrift 17/24 500 (verhindert Zoom auf iOS), Innenabstand 0 16 (`fb-09`); `fb-03` und `re-01` nennen 2 px und übernehmen 1 px |
| Hover | Umriss → `--text2` |
| Fokus | `outline: 2px solid var(--text)`, Abstand 2 px, Radius 12 |
| Fehler | Rand 2 px `--bad`, Satz 15/21 700 `--bad` mit Punkt 8 px davor, Fokus auf das erste fehlerhafte Feld, kein Rütteln (DG-AB-3) |
| Hinweis | 8 px unter dem Feld, 15/21 `--muted` |
| Dank | ersetzt das Formular, `role="status"`, Fokus auf den Dank, Lottie-Haken einmal (Bildschicht) |

---

## 11.7 Bewegung und Interaktion

### 11.7.1 Dauern

**Festlegung K-4** (Dauern und Kurven): Die Website nutzt die Bestands-Tokens `--t1` bis `--t3`, `--e-out` und `--e-io` und ergänzt drei
Motivdauern und eine Austrittskurve. Die SG-Vorschläge (`--dauer-zustand` 160 ms, `--kurve-ein` `cubic-bezier(.2,0,0,1)`) werden nicht
verwendet; heute rechnen `ap-01`, `fb-06`, `fb-07`, `fb-10`, `he-01`, `he-03`, `he-04`, `nf-01` und `rh-01` damit, alle übrigen mit
`--t1`/`--e-out`. Beide Kurven haben Stützwerte zwischen 0 und 1 (kein Überschwingen, SG 10.9); die Bestandskurve ist die, die der Inhaber
heute sieht.

| Token | Wert | Einsatz |
|---|---|---|
| `--t1` | 150 ms | Zustand: Hover, Farbe, Kontur, Druck zurück |
| `--t2` | 220 ms | Rückmeldung und Einblenden nach Eingabe: Antwort, Auswahlzeile, Kopf-Ring, Menüblatt, Ansichtswechsel, Endzustand nach der ersten Eingabe |
| `--t2-aus` | 165 ms | Austritt zu `--t2` (≈ ¾) |
| `--t3` | 320 ms | Glasschicht klärt sich, Detailzeichnung (Haken, kurze Linien), Gleiten im Seitenübergang |
| `--t-motiv` | 600 ms | Motiv-Auftritt: Meldung fällt ein, Blatt legt sich, Gerätebildschirm geht an, Maßlinie auf Tippen |
| `--t-buehne` | 900 ms | Foto-Auftritt jeder Bühne |
| `--t-mass` | 1.200 ms | zählende Maßlinie im Ladeauftritt, einmalige Bildfolge (Raffstore) |
| Szenenwechsel | 500–900 ms | Bildwechsel im Motiv (500 ms als Antwort auf Tippen, `fb-04`) |
| Staffelung | 60–90 ms | Versatz gestaffelter Bildelemente, zusammen ≤ 400 ms (DR 3.5) |
| Druck | 0 ms | Druckzustand erscheint im selben Bild, geht mit `--t1` zurück |
| `--e-out` | `cubic-bezier(.2,.7,.2,1)` | Auftritt, Zustand (Bestand) |
| `--e-io` | `cubic-bezier(.45,0,.2,1)` | Bewegung auf dem Bildschirm, Szene (Bestand) |
| `--e-in` (neu) | `cubic-bezier(.4,0,1,1)` | Austritt beschleunigt (DR 3.5; SG `--kurve-aus`) |

Detailwerte der Spezifikationen werden auf diese Stufen gesetzt: 160 → 150 ms, 240 → 220 ms (Umschalter `he-01`, Seitenübergang `fb-06`,
`pa-01`), 400 → 320 ms (`nf-01`) bzw. 600 ms (Miniaturen `he-04`), 500 ms als Hakenzeichnung (`fb-11`) → 320 ms, 640/650/680 ms
(`he-02`, `he-05`, `he-03`) → 600 ms, 120 ms Druck → 0 ms.

### 11.7.2 Bewegungsregeln [V]

- **Ort:** Bewegung, Physik und Federn nur in der Bildschicht (DG G1; SG 10.10 Nr. 14). Die Bedienschicht ändert nur Zustände.
- **Ein Träger:** Höchstens ein bewegter Träger je Ansicht, auch beim Laden: Foto, dann Meldungen, dann Maßlinie (`fb-01` F.1). Drei Ebenen je
  Szene (Hauptbewegung, Licht und Schatten 50 ms später, Umgebung nach Scrolltempo) gehören zum selben Fokusträger (DG 2.2.8). Höchstens ein
  Drittel der Elemente bewegt sich gleichzeitig (DR 3.5).
- **Ende:** Autonome Bewegung endet nach ≤ 5 s (WCAG 2.2.2; DG-AB-5); keine Schleife ohne Reaktion.
- **Erste Eingabe:** Scrollen über 4 px, Wischen, Rad oder Taste führt Laufendes und Ausstehendes in 220 ms per Deckkraft in den Endzustand
  (Teil von **Festlegung K-7**, 11.7.3; `fb-01` präzisiert so E-2, `he-01`, `ap-01` und `st-02` springen heute sofort, was „nichts springt“ widerspräche,
  SKILL:48).
- **Bedienschicht ohne Auftritt** (**Festlegung K-6**): Text, Knöpfe und Karten stehen ab dem ersten Bild, auf jeder Seite. Einblenden über
  Deckkraft (220 ms) gibt es nur für Inhalte, die nach einer Eingabe neu erscheinen (Antwort, Auswahlzeile, Codefeld, Dank, Kopf-Ring).
  `he-03` und `he-04` blenden heute ihre Bedienschicht beim Eintritt 320 ms ein, alle Abschnitte der Seite für Fensterbauer, die Ratgeber,
  `st-03`, `st-04`, `he-07` und `re-01` nicht. Ein Einblenden beim Scrollen wäre neben dem Motiv-Auftritt ein zweiter Träger und ohne
  JavaScript ein Risiko. Abweichung von bestehender Regel (GEST:39 Katalog 1 „Erscheinen 8 px aufwärts“; erweitert DG-AB-2) – Freigabe durch
  den Inhaber nötig (DS-AB-8).
- **Scrolltempo** wird nie verändert; natives Scrollen, kein Einrasten der Seite (DR 3.5).

### 11.7.3 Ladeauftritt

**Festlegung K-7** (Foto-Auftritt): Jede Bühne mit Foto (`fb-01`, `he-01`, `ap-01`) hat genau einen Foto-Auftritt: Deckkraft 0,35 → 1 und
Maßstab 1,03 → 1 gemeinsam in 900 ms `--e-out`, Ursprung am Anker; Start erst nach `img.decode()` und nur, wenn die Bühne beim Laden im Bild
ist. Die Startdeckkraft 0,35 hält das Foto als LCP-Kandidat (`he-01`, `ap-01`); `fb-01` (0,2 und 1,04) und `ap-01` (Deckkraft 600 ms,
Maßstab 900 ms) übernehmen die gemeinsamen Werte. In Stufe 4 folgen danach die Szenen des Motivs (Meldungen 0,9 / 1,6 / 2,3 s, je
600 ms; Maßlinie 2,9–4,1 s); Stand nach ≤ 5 s.

**Festlegung K-8** (Logo-Licht): Das Licht im Zeichen geht beim Laden nur auf Seiten ohne Bühnen-Ladeauftritt einmal an (1,6 s), wie
`rh-01` festlegt; danach nur bei Berührung, bei „weniger Bewegung“ ruhig. `he-01` und `ap-01` lassen es heute nach dem Foto laufen (Ende
nach 2,5 s); das wäre ein zweiter Auftritt im ersten Bildschirm. Abweichung von bestehender Regel (GEST:7 „beim Laden geht das Licht einmal
an“) – Freigabe durch den Inhaber nötig (DS-AB-9).

### 11.7.4 Scroll-Szenen

[V] Szenen hängen am Fortschritt eines Abschnitts (0 … 1, `Scroll.binden`), laufen nur, solange der Abschnitt im Bild ist, bewegen nur
Bildebenen und haben einen lesbaren Endzustand. Am Telefon wird nichts angeheftet (DG-AB-13); am Schreibtisch höchstens 1,2
Bildschirmhöhen mit ≥ ⅓ Ruhe im Endzustand (E-8), derzeit nur die Geräte-Bühne in 01 (≤ 1,1).

| Szene | Abschnitt | Mechanik | Ende |
|---|---|---|---|
| Foto-Tiefe | `fb-01` | Bildgruppe (Foto, Erdlicht, Maßlinie, Stapel) mit Faktor 0,88, höchstens 32 px, direkt am Scrollwert | sobald die Leiste die Bildschirmmitte erreicht, über 48 px weich |
| Leiste | `fb-02` | Versatz nach Scrolltempo (Faktor 0,42), Trägheit; Bilder wölben sich (Bildschicht), Namen wechseln über Deckkraft | 150 ms Ruhe → Einrasten auf die Kachelmitte, spätestens 1,2 s nach der letzten Eingabe; steht, sobald das Gerät aus 01 den unteren Rand erreicht |
| Explosion | `fb-05` | Schichten 0 / 28 / 56 px nach oben, 0 / 12 / 24 px nach rechts, wenn die Blattmitte die Bildschirmmitte erreicht; Führungslinien zeichnen sich mit | 200 ms Ruhe bei p ≥ 0,35 → p = 1 |
| Ablauf-Marken | `fb-10` | Marke wird grün, sobald ihr Schritt die Bildschirmmitte passiert (Zustand, 220 ms) | – |

**Festlegung K-9** (Tiefe der Bildebenen): nur in Stufe 4 (DG 2.4.2), also nur in `fb-01`, dort auf allen Breiten (ein Code-Weg). `he-01`
(Stufe 3) verzichtet auf die geplante Schreibtisch-Parallaxe (Faktor 0,9 [H]); sie stünde in einem Abschnitt, dessen Stufe sie nicht trägt.

### 11.7.5 Physik

**Festlegung K-37** (zwei Modelle, eine Notation):

| Modell | Parameter | Einsatz | nie |
|---|---|---|---|
| Trägheit | kritisch gedämpft (ζ = 1), ω = 9 s⁻¹ (≈ 0,22 s Nachlauf bei gleichmäßigem Scrollen, ≈ 0,5 s Auslauf); gestaffelte Schichten als Glättung erster Ordnung mit τ = 140 / 200 ms | scrollgekoppelte Bildebenen (`fb-02`, `fb-05`) | Überschwingen |
| Feder | ζ = 0,75, f = 2 Hz (ω ≈ 12,6 s⁻¹), Überschwingen ≈ 2,8 % (≤ 3 %), Ausschlag ≤ 24 px, Einschwingen ≈ 420 ms; Ziel x* = clamp(8 · v, −24, 24) | fingergeführte Bildebene (Beispielbild in der Paketreihe, `fb-06`) | Bedienelemente, Karten, Knöpfe (SG 10.7/2) |
| Abwurf | Tempo der letzten 80 ms, ≤ 1.200 px/s, Abklingen τ = 0,3 s, dann Einrasten mit Trägheit | Wischen der Leiste; Menüblatt läuft mit Abwurftempo aus (120–220 ms) | Federn beim Zurückschnappen |

PE nennt für die Feder „≈ 450 ms“, `fb-06` rechnet 420 ms; es gilt `fb-06`. Das Einrasten des Endstrichs in `he-02` (Maßstab 0,6 → 1,03 → 1
in 220 ms) ist eine Feder in der Bildschicht als Antwort auf einen Tipp und bleibt [H] (DR 3.5 erlaubt Federn nur, „wo die Hand direkt
führt“); Rückfall ohne Überschwingen.

### 11.7.6 Sprünge, Ansichts- und Seitenwechsel

- **Festlegung K-10** (Ankersprünge): Senkrechte Sprünge sind sofort (`behavior: 'auto'`), danach Fokus auf das Ziel-h2 (`tabindex="-1"`).
  Glattes Rollen nur, wenn zwischen Start und Ziel keine scrollgekoppelte Szene liegt (Kartenknopf → `#frage` über `fb-07`, `fb-08`;
  Segment → Karte waagerecht in der Reihe). `fb-01` plant für „Pakete ansehen“ `scroll-behavior: smooth`; der Weg führt über Leiste,
  Explosion und Lichtraum und spielte sie nacheinander ab, mehrere bewegte Träger (`rh-01`, `rh-02` begründen genau das).
- **Festlegung K-5** (Ansichtswechsel auf `/`): Segment wechselt den Zustand (150 ms), dann Neuaufbau und Sprung an den Anfang ohne Gleiten;
  die neue Ansicht blendet in 220 ms ein; danach läuft ihr eigener Foto-Auftritt (K-7). Kopf und Umschalter stehen. Gleich für Umschalter
  (`st-02`), Wechselkarte (`st-04`) und Menü (`rh-02`); `he-01` (240 ms Überblendung) und `st-02` (Schnitt) übernehmen das.
- **Seitenwechsel:** ohne Animation; als Verbesserung View Transitions zwischen Dokumenten mit 220 ms Überblendung, ein gemeinsames Element
  darf in 320 ms `--e-out` gleiten (Beispielbild → Miniatur im Kundenkonto, J-H10). Kopfzeile und Ordnungsachse stehen.
- **Menüblatt:** 220 ms ein, 165 ms aus über Deckkraft (`rh-02`); das Einfahren in der Ebene (240/180 ms) bleibt Variante nach DG-E-12.

### 11.7.7 Ruhige Fassung, ohne JavaScript, Einbettung [V]

- `prefers-reduced-motion: reduce`: Endbild jeder Szene ab dem ersten Bild; keine Schleife, keine Tiefe, kein Anheften, keine
  Scrollkopplung, kein Versatz; Farb- und Deckkraftwechsel bleiben; Ansichts- und Seitenwechsel als Schnitt (SG 10.9).
- Ohne JavaScript: dieselbe Endfassung aus dem HTML (die Reihenfolge im HTML ist der Endzustand); Bedienschicht vollständig; Szenen als
  Standbilder (`fb-04`: zwei Standbilder, `fb-05`: auseinandergezogenes Blatt, `fb-10`: alle Marken).
- Eingebettet in `/#fensterbauer`: jede Bindung idempotent in `Verkauf.auf`, Zustand je Wurzel, `sessionStorage` in `try/catch`, kein
  zweiter Ladeauftritt nach Neuaufbau (SKILL:63–64).

---

## 11.8 Bild- und 3D-Richtlinien

### 11.8.1 Grundsätze [V]

- **Echtes Material statt Symbole** (SKILL:41): Fotos der Figurenwelt, Renderings aus dem eigenen Konfigurator, echte Bildschirmaufnahmen
  unter der Beispieldomain, das echte Aufmaßblatt. Strichsymbole nur als Nebensache bis 24 px. Keine Stockfotos, keine beliebigen
  3-D-Objekte (DR 3.4).
- **Kein Platzhalter als Hauptbild:** Ein Bildplatz ohne echtes Bild entfällt (IA-AB-8); bis das Material kommt, zeigt ein Platzhalter den
  Effekt nur in Vorschau und Telefon-Video, nicht auf `main` (SKILL, Abschnitt 5).
- **Kein Text, kein Wasserzeichen im Bild;** jede Information im Bild steht zusätzlich in der Bedienschicht (DG G1).
- **Eine Lichtquelle je Bild,** Richtung nach K-24, wenn sie frei wählbar ist; ein Render der Stufe 4 immer in gestaltetem Licht.
- **Keine Echtzeit-3D auf Verkaufsflächen** (DG 2.2.7): Die WebGL-Bühne der App hängt an `app.js` (810 KB); Bewegung eines Objekts als
  vorgerenderte Bildfolge aus `web/assets/buehne.js` (`?gl=voll`, Playwright), Poster = Endbild, Canvas nie LCP.

### 11.8.2 Freistellung und Übergang

| Fall | Regel |
|---|---|
| Foto mit Aufnahmegrund | randlos, über eine mehrstufige Maske in `#161616` auslaufend (unteres Viertel bis Drittel); Text nur im Auslauf oder in ruhigen Zonen |
| Render, Gerät, Element | Alphakanal (AVIF, Rückfall WebP, `<picture>`), 1–2 px Übergang ohne Farbsaum, oder gerendert auf exakt `#161616` (ΔE00 ≤ 1) |
| Bildschirmaufnahme | rechteckig im Browserrahmen oder Gerät, nicht freigestellt |
| Zeichnung | SVG auf `--papier`, Zeichnungsfarben auf Papier |

### 11.8.3 Formate und Budgets

| Maß | Wert | Quelle |
|---|---|---|
| Auflösung | 2 × Darstellungsbreite, 3–4 `srcset`-Stufen, feste `width`/`height` oder `aspect-ratio` | SG 10.9 |
| Format | AVIF mit WebP-Rückfall; SVG für Zeichnungen | SG 10.8 |
| Fokus-Asset | ≤ 200 KB Telefon, ≤ 400 KB Schreibtisch; nie verzögert geladen, `fetchpriority="high"` | SG 10.9 |
| erster Telefon-Bildschirm | ≤ 300 KB Bilder | DR 3.6 |
| Bildfolge | ≤ 60 Bilder und ≤ 3 MB Telefon, erst bei Annäherung; Rückfall Einzelbild bei Median-Bildzeit über 25 ms; Pixeldichte im Canvas ≤ 1,5 | SG 10.9; `fb-04` |
| Videoschleife | 4–10 s, ≤ 1,5 MB Telefon, Poster als Endzustand (derzeit keine eingesetzt) | SG 10.9 |

### 11.8.4 Material, das gebraucht wird

Anfragen nach SKILL, Abschnitt 7 (Zweck, Format und Pixelmaß, Freistellung, Licht und Blickrichtung, was nicht drin sein darf).

| Material | für | Format laut Spezifikation | Licht | Status |
|---|---|---|---|---|
| Telefonzuschnitt des Startfotos (Astronaut am Bullauge) mit Stapelzone x 0–252, y 60–190 und dunklem Auslauf y 315–420 | `fb-01` C.3 | Bildfeld 390 × 420 (+ 52 px Kopfraum für die Einbettung), 2-fach | Erdlicht aus dem Bullauge, rechts | fehlt (Flux) |
| 14 Renderings der Elementarten | `fb-02` | WebP mit Alpha, 240 × 240 und 180 × 180, je ≈ 6–12 KB, hellster Wert ≤ `#c9c8c3` | oben rechts | fehlt (eigene Bühne) |
| Fenster als Vitrine, Bildfolge Raffstore (30 Bilder) | `fb-04` | nach Materialprobe (EV Ü7, DG-H-6) | oben rechts (K-24) | fehlt (eigene Bühne) |
| Startansicht der Stufe Essential im Gerät | `fb-03` | HTML-Miniatur oder Aufnahme (H-E9) | – | im Haus erzeugbar |
| Beispielbild je Paket (3) | `fb-06` | Aufnahme 1280 × 960, Ausgabe 660 × 495, AVIF ≤ 35 KB, WebP ≤ 50 KB | – | per Skript aus `web/assets/einladung.js` |
| Fotos des Beispielbetriebs (bis 6) | `fb-06`, `fb-15` | 1200 × 900, WebP | warm, oben rechts (K-24; heute „oben links“ angefragt) | fehlt (Flux) |
| Miniaturen der Führung (4) | `he-04` | WebP 260 × 533 und 520 × 1067 | – | im Haus erzeugbar |
| Figur der Bildwelt für 404 | `nf-01` | nach `nf-01` H | warme Quelle oben rechts durch die Rahmenöffnung | fehlt (Flux) |
| Aufmaßblatt, Startfotos Hauseigentümer und App, `messpunkte.svg` | `fb-05`, `he-01`, `he-03`, `he-07`, `ap-01`, `he-02` | vorhanden | – | vorhanden |

---

## 11.9 Barrierefreiheit und Leistung als Systemregeln

### 11.9.1 Barrierefreiheit [V]

| Regel | Wert | Quelle |
|---|---|---|
| Kontrast Text | ≥ 4,5 : 1, groß (ab 24 px oder 18,66 px fett) ≥ 3 : 1, gegen die ungünstigste Stelle des Untergrunds, bei Video je Stichbild (0,5 s), in jedem Zuschnitt | WCAG 1.4.3; SG 10.10 Nr. 15 |
| Kontrast Konturen, Zustände, Fokus | ≥ 3 : 1; einzige Grenze eines Knopfs oder Felds `--muted`, nie `--line2` | WCAG 1.4.11; K-1, K-35 |
| Fokus | **Festlegung K-34:** `outline: 2px solid var(--text)`, Abstand 2 px, formfolgend (Radius des Elements); Abstand −2 px nur, wo das Element an eine Gruppen- oder Containerkante stößt (Segment, Zeile über volle Breite, Menüzeile); nie verdeckt, `scroll-padding-top` 72/80 px (heute 3, 2, 0 und −2 px gemischt) | WCAG 2.4.7, 2.4.11 |
| Ziele | ≥ 44 × 44 px | SKILL:71 |
| Zustand nie nur Farbe | gewählt mit Kontur und Gewicht, Fehler mit Satz und Punkt, erledigt mit Haken | WCAG 1.4.1 |
| Text bleibt Text | Überschriften und Bedienschrift als Live-Text; Dekorebenen `aria-hidden` und `pointer-events: none`; Riesenwort doppelt | SG 10.10 Nr. 16 |
| Tastatur | jede Funktion erreichbar, Reihenfolge = DOM = Lesefolge; nichts hängt am Überfahren (Hover nur `@media (hover: hover)`) | SG 10.10 Nr. 17 |
| Reflow | ab 360 px eigene Komposition, bis 320 px kein Querscrollen, 200 % Text ohne Verlust | WCAG 1.4.10, 1.4.4 |
| Weniger Bewegung, weniger Transparenz, mehr Kontrast | 11.7.7; Glas deckend .95 | SG 10.9 |
| `forced-colors` | Konturen als `border` bzw. `outline`, damit sie bleiben; Cream-Zeilen mit sichtbarer Kontur | SG 10.9; `fb-15` |
| Prüfsuite | Schriftgrößen nur 13 / 15 / 17 / 24 / 32 / 40, auch in verborgenen Elementen; Knöpfe ausdrücklich 15 bzw. 17 px setzen (sonst 13,33 px) | SKILL:69–70 |

### 11.9.2 Leistung [V]

| Regel | Wert | Quelle |
|---|---|---|
| Core Web Vitals | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 am 75. Perzentil mobil | SG 10.9 |
| Übertragung bis LCP | ≤ 350 KB Telefon; JavaScript im ersten Bildschirm ≤ 100 KB | SG 10.9 |
| LCP-Element | statisches Foto oder Poster, nie Canvas, nie verzögert | SG 10.8 |
| animierte Eigenschaften | Motiv, Ebenen, große Flächen nur `transform` und `opacity`; kleine Bedienelemente zusätzlich Farbe, Kontur, Füllung; nie Unschärferadius, Schatten oder Layout (Ausnahme nur nach DG-E-14 B) | SKILL:56; SG 10.9 |
| Schleifen | nur, solange das Element im Bild ist (IntersectionObserver), Pause in verborgenen Tabs | SKILL:61 |
| Ersatzstufen | 0 statisch (ohne JS, weniger Bewegung, `Save-Data`), 1 Standard (CSS, Bildfolgen mit Poster), 2 Grafikchip nur mit Ersatzfassung und erst nach bestandener Leistungsprüfung auf einem mittleren Android-Telefon | SKILL:55–61; SG 10.8 |
| `backdrop-filter` | nur auf kleinen Flächen (Meldung 220 × 64, Umschalter 284 × 44), nie animiert; Rückfall Ersatzfüllung | `he-01` H.5; `st-02` |
| Codesperre | Stylelint gegen `perspective`, `rotateX/Y`, `skew`, `box-shadow` in Bedienkomponenten außer den Tokens, `transition: all`, animiertes `width`, `height`, `top`, `left`, `scale` an Bedienelementen | SG 10.10, Umsetzung 5 |

---

## 11.10 Verbindliche Regeln und experimentelle Hypothesen

### 11.10.1 Verbindliche Designregeln [V]

1. Jeder Abschnitt folgt der Formel Grund → (Kulisse) → ein Held → flache Bedienschicht und dem Satzbau Haarlinie → (Kapitelzeile) → h2 →
   Held → Lesestapel → Handlung (11.1.1).
2. Bildschicht (Z 0–25) trägt Perspektive, Licht, Material, Unschärfe, Bewegung und Physik; die Bedienschicht (Z 30–40) nur Zustände über
   Füllung, Kontur, Farbe und Deckkraft (DNA Nr. 1, 9, 10; DG G1).
3. Linke Spaltenkante als einzige Ordnungslinie; Achse nur bei mittigem Motiv (DNA Nr. 3).
4. Ein Held je Bildschirm, am Telefon nicht textlich außer in Arbeitsflächen nach DG-E-1 C; Hauptelement ≥ 3 × Versalhöhe der Bedienschrift
   (DNA Nr. 7).
5. Erster Bildschirm ≥ 33 % frei (DNA Nr. 8).
6. Raster und Umbruchpunkte nach 11.2.1 (K-11 bis K-13); Abstände nach Rolle (11.2.2); Abstand folgt der Überschriftenebene (K-14).
7. Höchstens drei Textstufen je Ansicht; 24 px nie neben 32/40 (11.3.2).
8. Typografische Rollen, Zeilenhöhen, Kapitelzeile und Versalzeilen nach 11.3.1 (K-16 bis K-19).
9. Eine Cream-Fläche je Bildschirm, ein grünes Wort je Überschrift, Grün nur als Signal; ≥ 80 % unbunt, ≤ 5 % kräftig, > 0,3 % farbig
   (11.4.2).
10. Licht nur mit Quelle im Bild, eine Lichtfarbe und Lichtrichtung je Bildschirm, Haus-Token oben rechts (K-24); kein Schatten auf dunklem
    Grund, Begleitschatten nur auf Papier (K-25).
11. Glas nur über Bildinhalt, Werte nach 11.5.3, gleichzeitig ≤ 2 am Telefon, nie über bewegtem Motiv am Telefon.
12. Vier Radien voll · 24 · 18 · 12 an allen Breiten (K-22); eine Formfamilie, formstabil, keine Skalierung beim Drücken.
13. Knopf- und Zustandsfamilien nach 11.6.2 und 11.6.3: Ring-Kontur `--muted` (K-1), Hover = Kontur, Druck = Füllung (K-2), gewählt =
    `--surface3` mit Tintenkontur (K-3), Fokus 2 px `--text` (K-34).
14. Dauern und Kurven nach 11.7.1 (K-4); ein bewegter Träger je Ansicht; autonome Bewegung ≤ 5 s; Bedienschicht ohne Auftritt (K-6).
15. Foto-Auftritt 0,35 → 1 und 1,03 → 1 in 900 ms (K-7); erste Eingabe führt in 220 ms in den Endzustand.
16. Tiefe der Bildebenen nur in Stufe 4 (K-9); am Telefon kein Anheften; Ankersprünge sofort (K-10).
17. Dosierregeln und Rhythmus nach 11.1.5.
18. Bildmaterial nach 11.8; kein Platzhalter als Hauptbild; keine Echtzeit-3D auf Verkaufsflächen.
19. Barrierefreiheit und Leistung nach 11.9; im Konflikt weicht der Effekt.
20. Ehrlichkeit: „Beispiel“ an jedem erfundenen Material in einer der zwei Formen (K-36); keine Stimmen, Zähler, Siegel.

Regeln 8 (Kicker, 13 px), 12 (Radius 8 entfällt), 13 (Ring `--muted`, gewählt ohne Cream, Cream-Hover), 14 (kein Erscheinen) und 15
(Logo-Licht) berühren GEST oder DR und gelten erst nach Freigabe (11.B); bis dahin bleibt die bestehende Regel, und der Bau hält beide
Fassungen über Tokens umschaltbar.

### 11.10.2 Experimentelle Gestaltungshypothesen [H]

Prüfwege: Telefon-Video bei 390 × 844 (SKILL, Abschnitt 8), Sichtprüfung durch den Inhaber, Lesetests mit Fensterbauern, Bildschirmfotos
mit `farbanteil.py`. Vergleichstests sind nicht eingerichtet.

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| DS-H-1 | Die zwei Wellen der Seite für Fensterbauer (4 · 3 → 2 → 3 · 3 → lange Ruhe) wirken hochwertig, ohne die Pakete zu überlagern | Video der ganzen Seite, Urteil des Inhabers | 01 als Stufe 3, 03 als Stufe 2 |
| DS-H-2 | „Gewählt“ in Tinte (`--surface3` + Kontur `--text`) wird so sicher erkannt wie heute die Cream | Fünf-Sekunden-Test „Welche Ansicht, welche Option ist gewählt?“ (H-ST2-1) | Füllung `--muted` mit dunkler Schrift (`fb-04`) |
| DS-H-3 | Die innere Kontur als Hover der Cream ist am Schreibtisch wahrnehmbar | Bildschirmvideo mit Maus | `--primary-hover` (Bestand) |
| DS-H-4 | 96 px zwischen Band und 01 lesen sich als Atempause, nicht als Loch | Telefon-Video | 48/64 px (`fb-02` V2-2) |
| DS-H-5 | Bühnen-Knöpfe nach Inhalt (≥ 212 px) halten die Diagonale besser als volle Breite und bleiben mit dem Daumen gut erreichbar | Video, Daumentest des Inhabers | volle Breite 358 px |
| DS-H-6 | Ein gemeinsamer Foto-Auftritt (0,35 / 1,03 / 900 ms) wirkt auf allen drei Bühnen ruhig genug und zählt sofort als LCP | Video; LCP-Messung | Startdeckkraft 0,5 |
| DS-H-7 | Eine Lichtrichtung (oben rechts) in Renders, Lichtkanten und Fotos verbindet die Szenen erkennbar mit dem Zeichen | Sichtprüfung aller Bühnen nebeneinander (DG-H-3) | Richtung je Foto, Kanten nur oben |
| DS-H-8 | Ankersprünge ohne Gleiten verlieren die Orientierung nicht, weil der Fokus auf dem Ziel-h2 landet | Video, Lesetest „Wo bin ich jetzt?“ | glattes Rollen mit pausierten Szenen |
| DS-H-9 | Ohne Einblenden der Bedienschicht wirkt die Ansicht Hauseigentümer nicht starr | Video H3, H4 | Einblenden 320 ms nur in H3 |
| DS-H-10 | Die Feder im Beispielbild (ζ 0,75, 2 Hz) erfüllt „Trägheit und Federn“ (SKILL:43) für den Inhaber | Video mit und ohne Feder (J-H13, DG-H-2) | Gegenlauf ohne Feder |
| DS-H-11 | Zwei Formen der Kennzeichnung „Beispiel“ werden als dasselbe Signal gelesen | Lesetest | nur Etikett „BEISPIEL“ |
| DS-H-12 | 13 px in der Technikstimme bleibt lesbar, wenn alle Sätze 15 px tragen (DG-E-6) | Lesetest auf einem mittleren Android-Telefon | 15 px auch für Versalzeilen |

Weiter offen und unverändert: DG-H-1 bis DG-H-12, J-H1 bis J-H16, H-E1 bis H-E10 sowie die offenen Entscheidungen DG-E-1 bis DG-E-14.

---

## Anhang 11.A Inkonsistenzen zwischen den Abschnitts-Spezifikationen

Gefunden beim Abgleich aller 33 Dateien in [09-abschnitte/](09-abschnitte/) mit PE, ZA und DG. Jede Zeile nennt die Festlegung, die ab jetzt
gilt; die betroffenen Spezifikationen werden beim Bau auf diesen Wert gesetzt.

| Nr. | Thema | betroffene Dateien | Widerspruch | Festlegung |
|---|---|---|---|---|
| 1 | Ring-Kontur | `fb-04`, `he-01`, `he-04`, `ap-01`, `rh-01`, `rh-02` gegen `fb-01`, `fb-03`, `fb-08`, `fb-12`, `fb-15`, `ar-02`, `nf-01`, `st-04` | `--line2` (1,6 : 1) gegen `--muted` (5,8 : 1), Hover verschieden | K-1 (11.6.2) |
| 2 | Cream-Hover und Druck | `fb-01`, `fb-06`, `fb-15`, `ap-01`, `ar-02`, `fb-09`, `he-01`, `he-07`, `rh-01` | Hover als äußere Kontur, innere Kontur oder Weiß; Druck als Deckkraft, `#e2e1db`, Weiß oder `color-mix` | K-2 (11.6.2) |
| 3 | Zustand „gewählt“ | `st-02`, `he-01`, `rh-02`, `fb-04`, `fb-06`, `he-02`; DG 2.2.10 | vier Darstellungen, DG nennt Cream | K-3 (11.6.3) |
| 4 | Zustandsdauer und Kurven | `ap-01`, `fb-06`, `fb-07`, `fb-10`, `he-01`, `he-03`, `he-04`, `nf-01`, `rh-01` gegen übrige | 160 ms mit SG-Kurve gegen 150 ms `--e-out`; Druck 120 ms | K-4 (11.7.1) |
| 5 | Ansichtswechsel | `st-02`, `he-01`, `st-04` | Schnitt, 240 ms Überblendung, 220 ms Einblenden | K-5 (11.7.6) |
| 6 | Einblenden der Bedienschicht | `he-03`, `he-04` gegen `fb-03` … `fb-15`, `ar-01`, `ar-02`, `st-03`, `st-04`, `he-07`, `re-01` | 320 ms beim Eintritt gegen kein Auftritt | K-6 (11.7.2) |
| 7 | Foto-Auftritt, erste Eingabe | `fb-01`, `he-01`, `ap-01`, `st-02` | Startdeckkraft 0,2 / 0,35, Maßstab 1,04 / 1,03, Kurven und Dauern verschieden; Endzustand in 220 ms oder sofort | K-7 (11.7.3) |
| 8 | Logo-Licht beim Laden | `he-01`, `ap-01` gegen `rh-01` | nach dem Foto gegen entfällt auf Seiten mit Ladeauftritt | K-8 (11.7.3) |
| 9 | Tiefe der Bildebenen | `fb-01`, `he-01`; DG 2.4.2 | Telefon mit Tiefe gegen ohne; Stufe 3 mit Schreibtisch-Parallaxe | K-9 (11.7.4) |
| 10 | Ankersprünge | `fb-01`, PE F gegen `rh-01`, `rh-02` | glattes Rollen über Szenen gegen sofortigen Sprung | K-10 (11.7.6) |
| 11 | Umbruchpunkte | alle mit eigenen Schwellen (600/601, 640, 760/761, 768, 880, 900, 960, 1024, 1200) | neun verschiedene Grenzen | K-11 (11.2.1) |
| 12 | Rinne am Schreibtisch | `fb-01`, `fb-03`, `fb-05`, `fb-09`, `fb-10`, `fb-15`, `he-04` gegen elf andere | 32 px gegen 24 px | K-12 (11.2.1) |
| 13 | Rand bei 1024 | fast alle | 16 bis 148 px | K-13 (11.2.1) |
| 14 | Abstand Band → Kapitel | `fb-02`, `fb-03` | 48/64 px gegen 96 px | K-14 (11.1.6) |
| 15 | Abschnittskopf und Sprungziele | `fb-04`, `fb-06`, `he-02` gegen `fb-09`, `fb-10`; `fb-11` gegen `fb-12`, `fb-13`; `fb-01`, `fb-05`, `fb-06`, `fb-09`, `fb-12`, `fb-13` | Haarlinie → Kapitelzeile 16 oder 24 px; Haarlinie → h2 24 oder 32 px; `scroll-margin` 72 bis 116 px | K-15 (11.2.2) |
| 16 | Kapitelzeile | `fb-03`, `fb-04`, `fb-05`, `fb-09` gegen `fb-06`, `he-02`, `he-04`; `he-03`, `he-05` | ganz grün gegen nur Nummer; 800/0,18 em; Zeile ohne Nummer | K-16 (11.3.1) |
| 17 | Versalzeilen, Kicker | `fb-05`, `he-03`, `ar-02`, übrige | 0,06 / 0,08 / 0,12 / 0,18 em, 600 oder 800 | K-17 (11.3.1) |
| 18 | Titel-Zeilenhöhe | `fb-03`, `fb-05`, `fb-15` gegen `fb-10`, `nf-01`, `re-01` gegen übrige | 32/35, 32/34, 1,05; 40/44 gegen 40/42 | K-18 (11.3.1) |
| 19 | Lesetext-Zeilenhöhe | `st-04`, `fb-11`, `fb-13`, `ar-01`, `re-01` u. a. | 17/24 bis 17/27, 1,4 bis 1,6 | K-19 (11.3.1) |
| 20 | 13 px für Sätze | `fb-03`, `fb-06`, `fb-08`, `fb-12` gegen `fb-09`, `fb-10`, `fb-11` | Sätze in 13 gegen 15 px (DG-E-6) | K-20 (11.3.3) |
| 21 | Größenstufen, Gewicht der Namen | `fb-11`; `fb-06` gegen `fb-12`, `fb-15`, PE | 24 neben 32; Paketname 800 gegen 700 | K-21 (11.3.2) |
| 22 | Radien | `pa-01`, `fb-11`, `st-03`, `re-01`, `st-04`, `he-05`, `he-04`, `fb-12`, `ar-01`, `he-02`, `fb-05` | Karten 18 oder 24, Kacheln 12 oder 18, Miniaturen 8 oder 12, Verkleinerung am Telefon; Kachel-Innenabstand 12 (`he-05`) gegen 16 (`fb-11`) | K-22 (11.6.1), Innenabstände 11.6.4 |
| 23 | Gerät | `fb-03`, `fb-04` | Radius 44/34 gegen 40/32, Körper, Ring, Lichtkante | K-23 (11.5.2) |
| 24 | Lichtrichtung, Lichtkante | `fb-03`, `fb-04`, `fb-06`, PE gegen `fb-01`, `fb-02`, `he-03`, `rh-02`, `nf-01` | oben, oben rechts, oben links; Kante 10 / 14 / 24 % | K-24 (11.5.4) |
| 25 | Begleitschatten | `fb-05`, `he-03` | senkrecht gegen in Lichtrichtung | K-25 (11.5.5) |
| 26 | Kopf-Scrim | `rh-01`, `fb-01` gegen `he-01` | 60 % über 96 px gegen 64 % bis 56 px, aus bei 120 px | K-26 (11.6.7) |
| 27 | Kopf wird opak | `rh-01`, `st-02` | Wächter am Kicker gegen `scrollY ≥ 12` | K-27 (11.6.7) |
| 28 | Kopf-Ring | `rh-01` gegen `fb-06`, PE J-AB-9, `fb-01` | dauerhaft mit Zielwechsel gegen ausgeblendet an der Reihe; Kontur `--line2` gegen `--muted`; Druck über Deckkraft | K-28 (11.6.7), K-1 |
| 29 | Umschalter | `st-02`, `he-01`, `fb-01` | 284 gegen 260 px, Segmentzustand, Gewicht 500 gegen 600 | K-29, K-3 (11.6.3) |
| 30 | Knopfbreite in Bühnen | `fb-01` gegen `he-01`, `ap-01` | 212 px nach Inhalt gegen 358 px | K-30 (11.6.2) |
| 31 | Pfeilkreis, Zeilenzeichen | `fb-06`, `fb-12` gegen `ap-01`, `fb-15`, `he-07`, `pa-01`, `nf-01`, `st-03` | 36/32 gegen 28 px; Kontur-Kreis mit ↗ gegen Chevron | K-31 (11.6.2) |
| 32 | Anzeige-Chip | `fb-01`, `he-03` | Größe, Abstand, Fläche und Ring verschieden | K-32 (11.6.4) |
| 33 | Haarlinien in `details`-Zeilen | `fb-07`, `fb-13` | `--line2` → `--muted` gegen `--line` → `--line2` | K-33 (11.6.8) |
| 34 | Fokus-Abstand | `fb-01`, `pa-01`, `fb-12`, `rh-02`, `st-02`, `fb-06` gegen übrige | 3, 2, 0, −2 px | K-34 (11.9.1) |
| 35 | Feldumriss | `fb-09` gegen `fb-03`, `re-01` | 1 px gegen 2 px `--muted` | K-35 (11.6.9) |
| 36 | „Beispiel“-Kennzeichnung | `fb-01`, `fb-03`, `fb-04`, `fb-06`, `fb-15`, `he-02`, `he-03` | Versal-Etikett oder Adresszeile, `--text2` oder `--muted`, ohne Regel | K-36 (11.6.6) |
| 37 | Physik-Parameter | `fb-02`, `fb-05`, `fb-06`, PE, `he-02` | drei Notationen; Einschwingen 420 gegen 450 ms | K-37 (11.7.5) |
| 38 | Paketkarte | `fb-06`, PE 10.4 C | Karte 877 gegen 824 px, Pille 122 gegen 104 px, Datenblattzeilen 48 gegen ≈ 37 px, Browserleiste `#222` | K-38: `fb-06` (gemessen) gilt, Leiste `--surface2` (11.6.4, 11.5.2) |
| 39 | Ebene interaktiver Glasflächen | `he-01` gegen `st-02`, `st-03`, ZA | Z 30 gegen Fläche 25 / Inhalt 30 | K-39 (11.5.1) |
| 40 | helle Karte | `st-04` gegen ZA 8.3.3, DG T11; `he-05` | Wechselkarte dunkel gegen „hell“; Papierweiß als Ankerkachel | K-40: Flächen über Grundniveau sind `--surface`; Papierweiß nur Papier und H5-AB-1 (11.4.2) |
| 41 | Zeichnungsfarben auf Papier | `he-02`, `he-05` | `#c2410c` lokal definiert, kein Token, kein Blau | Rollen `--mo-papier`, `--tinte-papier` (11.4.1) |

---

## Anhang 11.B Abweichungen von bestehenden Regeln

Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Name, Wortmarke und Logo bleiben unverändert.
Die älteren Abweichungen DG-AB-1 bis -19, E-AB-1 bis -10, J-AB-1 bis -10 und die Abweichungen der Spezifikationen gelten weiter; hier stehen
nur die, die dieses Kapitel für die ganze Website festlegt oder bündelt.

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall | gebündelt aus |
|---|---|---|---|---|---|
| DS-AB-1 | Kicker in Versalien mit Sperrung .18em, 800 (GEST:26; `gemeinsam.css:44`) | jede Versalzeile 600, +0,12 em | Technikstimme (DR 3.2); SG-Spanne 0,06–0,12 em; Zeilen bleiben einzeilig | 800 / 0,18 em | I-AB-2 (`fb-01`), RE-AB-1, NF-AB-3, `ap-01`, `he-01` |
| DS-AB-2 | „13 Label“ (GEST:26), Steuerzeile in 13 px (GEST:452) | 13 px nur Technikstimme, Sätze 15 px | SG ≥ 14 px; Lesbarkeit bedeutungstragender Texte | 13 px wie heute | DG-E-6 |
| DS-AB-3 | Cream hellt beim Überfahren auf Weiß auf (`--primary-hover`, `gemeinsam.css:15`); Druck `scale(.98)` (`:65`) | Hover innere Kontur, Druck `--primary-druck`, keine Skalierung | ein Kanal für Hover (DG 2.4.1); Bedienschicht formstabil (SG 10.7/3) | Weiß | `fb-06`, `fb-15` |
| DS-AB-4 | gewählt in Cream (GEST:24; `gemeinsam.css:82`, `:90`) | `--surface3` mit 2-px-Kontur `--text` | eine Cream je Bildschirm (SKILL:71) | Füllung `--muted` | ST2-AB-1, P-AB-1 |
| DS-AB-5 | Radien 8 · 12 · 18 · 24 (GEST:32) | voll · 24 · 18 · 12 auf der Website, auf allen Breiten | höchstens vier Werte (SG 10.10 Nr. 4) | – | DG-AB-8 |
| DS-AB-6 | „eine Spalte bis 760 px“ (GEST:462); Schwellen 761/880/900/1200 im Bestand | Umbruchpunkte 640 und 1024 | prüfbare Zahl von Kompositionen; SG 10.9 | 760 als dritte Schwelle | – |
| DS-AB-7 | keine neuen Farben (GEST:24; DR 3.1) | `--primary-druck` `#e2e1db`; Rollen `--papier`, `--mo-papier`, `--tinte-papier` aus vorhandenen Werten | Druck ohne Deckkraftverlust; `--mo` auf Weiß nur ≈ 2,3 : 1 | Druck über `--primary-hover` | H5-AB-1, P-AB-2 |
| DS-AB-8 | Erscheinen 8 px aufwärts (GEST:39 Katalog 1); Karten und Bänder 24 px, 0,98 → 1 (GEST:448) | Bedienschicht ohne Auftritt, auch ohne Deckkraft-Einblenden | ein Träger je Ansicht; E-13; ohne JavaScript sichtbar | Einblenden 220 ms über Deckkraft | DG-AB-2, F10-AB-4, H4-AB-1 |
| DS-AB-9 | „beim Laden geht das Licht einmal an“ (GEST:7) | nur auf Seiten ohne Bühnen-Ladeauftritt | ein Auftritt im ersten Bildschirm | Licht nach dem Foto | `rh-01` |
| DS-AB-10 | `--muted` „nur für Labels und Nebenzeilen“ (GEST:24); Ghost-Rand `--line2` (`gemeinsam.css:58`) | Kontur von Ring-Knöpfen und Feldern `--muted` | 3 : 1 für die einzige Grenze (WCAG 1.4.11; DG-E-10) | `--line2` | NF-AB-2 |

Weitere Punkte, die die ganze Website betreffen, sind schon früher geführt und hier nicht wiederholt: Fotokarte nur noch im Ratgeber
(DG-AB-9), Parallaxe und Lesefortschritt (DG-AB-15), Fragen als Zeilen (DG-AB-19), Lichtkante statt `--float` (DG-AB-1).

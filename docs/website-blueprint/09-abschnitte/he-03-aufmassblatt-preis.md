# H3 02 · Was im Aufmaß steckt: Aufmaßblatt und Preis

Seite: Startseite `/#hauseigentuemer` (Ansicht Hauseigentümer) · Position: 3 von 7 (nach H2 Probemessung, vor H4 Ablauf und Daten) · Intensitätsstufe: 2 klar (Typ T5-artig, statisch)

Phase I, Section-by-Section Visual Design Specification. Stand 24.10.2026. Planungsdokument: Das Repository wurde nur gelesen. Kürzel und
Kennzeichnungen wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (**[V]** verbindlich, **[H]** Hypothese mit Rückfall,
**Textentwurf**, `Datei:Zeile` als Beleg). `10-paketentscheidung.md` liegt nicht vor; dieser Abschnitt nennt keine Paketpreise (IA 5.6;
EA O-25). Alle Lagen und Wirkungen sind geplant, nicht gemessen.

**Festlegungen gegenüber 08 (mit Begründung):**

- **F-1 Bild.** 08 setzt `web/bilder/tour-aufmassblatt-15.webp`. Das ist die **Betriebsfassung** (`variante: 'betrieb'`,
  `web/assets/portal.js:1504`) mit „Fensterbau Brandt · Aufmaß Ihres Kunden“, Spalte „Bestellmaß“ und „Budget 10.000 bis 20.000 €“.
  Hauseigentümer kaufen die **Kundenfassung** (`variante: 'kunde'`, `web/assets/blatt.js:8-12`). Neben „kein Bestellmaß“ (AGB:35)
  widerspräche das Bild dem Text, und das Etikett läge auf der Bestellmaß-Spalte. H3 nutzt deshalb einen Ausschnitt der Kundenfassung, den
  der eigene Code mit denselben Beispieldaten erzeugt (H.4). Material vom Inhaber ist dafür nicht nötig.
- **F-2 Etikett.** „AUFMASSBLATT · PDF“ (KB-4) ist in der Technikstimme ≈ 200 px breit, im Etikett sind 128 px frei. Es trägt deshalb
  „EINMALIG“ und den Preis. „Aufmaßblatt als PDF“ steht in Preiszeile 2.
- **F-3 Höhe.** ≈ 1,27 BH statt 1,20 BH, wegen der Zeile zum Endpreis und lesbarer Zeilenhöhen. Die Ansicht wächst von ≈ 7,1 auf
  ≈ 7,15 BH.

---

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | 02 · Was im Aufmaß steckt: Aufmaßblatt und Preis, `he-03-aufmassblatt-preis` |
| Position | H3 von H1 bis H7. Telefon: Seite y ≈ 1.502–2.570 (einschließlich 96 px Abstand), Bildschirm 3–4 bei realen 664 px. Davor H2 mit der Cream „Jetzt ausmessen“ bei y ≈ 1.410–1.462, danach H4 „03 · Daten und Konto“ |
| Ziel | Ergebnis mit Preisschild zeigen (EA B2). Zu sehen sind das echte Dokument, sein Preis, die kostenlosen Teile, sein Inhalt und seine Grenze |
| Nutzerfrage | „Was bekomme ich am Ende, und was kostet es?“ (H-02, H-06), nebenbei „Geht das auch für Haustür oder Dachfenster?“ (H-11) |
| vorbereitete Entscheidung | Preis und Ergebnis sind akzeptabel. Weiter geht es zu H4 oder über den Kopfknopf „Fenster ausmessen“ (Z2a) |
| Gruppen, Kette | HE-5 und HE-3. B2 Verstehen, nach dem Zutrauen aus H2 und vor dem Absichern in H4 (B3) |

## B. Konkreter Inhalt

| Nr. | Element | Wortlaut | Status, Fundstelle |
|---|---|---|---|
| 1 | Kapitelzeile | „02 · DAS AUFMASSBLATT“ | **Textentwurf** (08) |
| 2 | h2 | „Was im Aufmaß steckt.“, das Wort „Aufmaß“ grün | wörtlich, `web/assets/portal.js:779` (`akSatz(…, 2)`) |
| 3 | Zusatz | „je Fenster, wie beim Termin vor Ort“ | wörtlich, `portal.js:779` |
| 4 | Kennzeichnung | „BEISPIEL“ | G7 |
| 5 | Blatt | Seite 1 der Kundenfassung mit Kopfband und Marke, „Dein Fenster-Aufmaß“, „Familie Weber.“, Haken-Chips, Weg „4 von 5“, Eckdaten | `web/assets/blatt.js:319-343`; Beispieldaten `portal.js:1504` |
| 6 | Etikett | „EINMALIG“ / „7,99 €“, ab 18.11.2026 „12,99 €“ | **Textentwurf** nach AGB:55, `web/assets/app.js:3368`. Der Preis kommt aus `Abrechnung.preise().aufmass` (`web/assets/modell.js:1117`; `web/config.js:12`, `:14`) |
| 7 | Preiszeile 1 | „0 €“ · „Messen, Fotos, 3-D-Modell“ | **Textentwurf**, `web/index.html:61`; AGB:32 |
| 8 | Preiszeile 2 | „7,99 €“ · „Aufmaßblatt als PDF, einmalig“ / „bis 17.11.2026, danach 12,99 €“. Nach dem Stichtag nur „12,99 €“ · „Aufmaßblatt als PDF, einmalig“ | **Textentwurf**, AGB:33, :55; `einfText('aufmass')` (`modell.js:1119`) |
| 9 | Preiszeile 3 | „0 €“ · „über den Link eines Fensterbauers“ | nahezu wörtlich AGB:34; hängt an EA O-4 |
| 10 | Endpreis | „Endpreise inkl. MwSt., ohne weitere Kosten.“ Bei `mwst: false` lautet die Zeile „Endpreise, ohne weitere Kosten.“ | **Textentwurf**, AGB:55; `app.js:3323`; der Wortlaut ist rechtlich zu bestätigen |
| 11 | Katalogkopf | „JE POSITION IM BLATT“ | **Textentwurf** nach AGB:33 |
| 12 | Katalog, 7 Zeilen | Maueröffnung · Fensterelement · Fotos und Einbausituation · Teilung und Öffnung · Material, Farbe, Glas · Sonnenschutz und Montage · Was noch zu klären ist | Zeilen 1–6 wörtlich VK:124-129. Zeile 7 ist **Textentwurf**: die Fassung für Hauseigentümer zu VK:130, nach `blatt.js:404`. Die eine Fassung K15 (SI 5.3) |
| 13 | Elementarten | Fenster · Balkontür · Festverglasung · Hebe-Schiebe-Tür · PSK-Tür · Faltschiebewand | wörtlich `blatt.js:39` (`ARTNAME`); `web/index.html:72`. Endgültige Liste nach PA-Frage 29. `portal.js:783` nennt zusätzlich Rollladen, Raffstore, Screen und Insektenschutz, die in Zeile 6 stecken |
| 14 | Grenze | „Grundlage für Angebote, kein Bestellmaß: Vor der Fertigung misst der Fachbetrieb selbst nach.“ | **Textentwurf** nach AGB:35 § 2 (4) |
| 15 | Alt-Text | „Beispiel: Seite 1 eines Aufmaßblatts für Familie Weber, mit vier Positionen, dem Weg zu neuen Fenstern und den Eckdaten zum Projekt.“ | **Textentwurf** |

Insgesamt sind es ≈ 75 Wörter. Die Entwürfe sind ohne Anrede formuliert (EA O-13).

**Entfällt aus dem Bestand:** die acht Kacheln mit Strichsymbolen (`portal.js:615-624`), die Fensterzeichnung mit vier Maßen und Plaketten
(`:861-865`), „Auch ganz groß.“ mit dem Platzhalter `gross.webp` (`:784`) und die Zahlenleiste (`:854`). Die Messangabe steht schon in H2.

**Interaktionen:**

- Die Chip-Zeile lässt sich wischen.
- Die Handlung übernimmt der Kopfknopf „Fenster ausmessen“. Er ist Cream, solange keine Cream im Inhalt sichtbar ist (N3, N4).
- H3 hat keinen eigenen Knopf (Cream nur in H1, H2 und H7).
- Variante V-2 [H]: Textlink „Beispiel als PDF ansehen“ (H.4).

**Nutzbare Komponenten:** siehe H.1, dazu `akSatz` (`portal.js:314`) und `Blatt.pdf` (`blatt.js`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Das Telefon zeigt einen senkrechten Stapel an der Ordnungslinie x = 16: Kopf, Szene (Held), Preisblock, Katalog,
Chips, Grenze. Die Komposition ist asymmetrisch: Das Blatt sitzt links an der Linie, das Etikett ragt nach rechts über die Blattkante.
Raster am Telefon: 4 Spalten zu je 77,5 px mit 16 px Abstand. Der Betrag belegt Spalte 1 (x 16–93), die Beschriftung die Spalten 2–4
(x 110–374, 264 px).

**Telefon 390 × 844, Lagen innerhalb des Abschnitts (y = 0 an der Haarlinie):**

| y | Element | Maß, Satz |
|---|---|---|
| 0 | Haarlinie | 1 px `--line2`, x 16–374 |
| 16–32 | Kapitelzeile | 13/16, 800, Versalien, .18em, `--accent` |
| 44–116 | h2 | 32/36, 800, `--text`, zwei Zeilen („Was im Aufmaß / steckt.“) |
| 120–140 | Zusatz | 15/20, 500, `--text2` |
| 164–464 | Szene 358 × 300 | Bühne mit gestapelten Ebenen (H.3) |
| 164–180 | „BEISPIEL“ | 13/16 Technikstimme, `--muted`, x 16 |
| 188–463 | Blatt | 290 × 275 (81 % der Inhaltsbreite), x 16–306, um −2° um seine Mitte gedreht; Auslauf über das untere Viertel (y 395–463) |
| 360–436 | Etikett | 152 × 76, x 194–346: oberer Rand bei 62,5 % der Blatthöhe, ragt 40 px (26 % seiner Breite) über die rechte Blattkante |
| 488–512 | Preiszeile 1 | Betrag 17/24, 800, `tabular-nums`; Beschriftung 15/24 `--text` |
| 520–564 | Preiszeile 2 | zweite Zeile 15/22 `--text2` |
| 572–596 | Preiszeile 3 | wie Zeile 1 |
| 604–624 | Endpreis | 15/20 `--muted`, x 16, volle Breite |
| 656–672 | Katalogkopf | 13/16 Technikstimme, `--muted` |
| 680–848 | Katalog | 7 Zeilen zu 24 px. Haken 16 px bei x 16, Name 15/20, 700, bei x 40. 1-px-Haarlinien `--line` dazwischen |
| 872–908 | Chips | Pillen 36 px hoch, 15 px, innen 14 px, Abstand 8, `--surface` mit 2-px-Ring. Wischzeile von x 16 bis zum Rand, die letzten 24 px ausgeblendet |
| 932–972 | Grenze | 15/20 `--text2`, zwei Zeilen |
| 972–1.068 | Abstand zu H4 | 96 px |

**Hierarchie [V]:** Drei Größenstufen. Oben steht das Blatt (275 px hoch, Sprung zur Bedienschrift weit über 3-fach, SG 10.1/4), darunter
die Headline-Stufe mit h2 und Etikettpreis (je 32 px), dann die Klein-Stufe von 13 bis 17 px (DG Z. 599; DG-E-6).

**Anteile und Ebenen:** Bei 664 px Höhe nimmt die Szene ≈ 41 % des Bildschirms ein, Text ≈ 20 %, frei bleiben ≈ 39 % (Stufe 2: Bild
20–50 %, frei ≥ 33 %). Ebenen: Z 0 Grund `#161616` (Hintergrund) → Z 20 Blatt (Mittelgrund) → Z 25 Etikett (Vordergrund der Bildschicht) →
Z 30 Bedienschicht neben der Szene, nie auf ihr → Z 40 Kopf.

**Startwerte und Begründung:**

| Wert | Begründung |
|---|---|
| Blatt 290 px | 08. Szene und drei Preiszeilen enden bei y 596, also bei 664 − 56 = 608 im selben Bildschirm (SKILL:86) |
| −2° | 08 und fb-05: ein Gegenstand, der auf dem Tisch liegt. Die Drehung bleibt in der Ebene, ohne Perspektive (SG 10.6/4) |
| Etikett 152 × 76, Radius 12 | KB-4; Radius aus DG-AB-8. Überdeckung ≈ 112 × 76 = 8.500 px² = 10,7 % des Blatts, also ≤ 15 %. Es überdeckt weder das Kopfband noch Maßzahlen (Prüfpunkt am Asset) |
| Betragsspalte 1 von 4 | „12,99 €“ in 17 px fett ≈ 70 px. Beträge fluchten untereinander |
| Gruppe : Gruppe : Zone = 8 : 24 : 32 | G6; 32 statt 48 vor dem Katalog wegen F-3 |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung, Lage | Intensität (0–4) | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | Vier Ebenen. Das Etikett verdeckt das Blatt, das Blatt läuft in den Grund aus | D1 2 | Preis und Ergebnis lesen sich als ein Gegenstand |
| Material, Transparenz | Papier und Druck aus dem echten PDF-Zeichner; Etikett opak `#1f1f1f`, ohne Glas | D2 2 | echtes Material statt Symbole (SKILL:41) |
| Licht, Schatten | Kein eigenes Licht. Am Etikett eine 1-px-Lichtkante (Weiß 14 %, an Ober- und rechter Kante 24 %; Hausrichtung oben rechts, DG 2.2.0). Darunter ein blasser Begleitschatten nur auf dem Papier [H] (−5 / 6 px, Unschärfe 16, 7 %; DG 2.2.4) | D3 1, D4 1 | Kontrast über das Papierweiß. Das Licht bleibt den Bühnen H1 und V1 vorbehalten |
| Formen | Papier rechtwinklig; Etikett Radius 12; Chips als Pillen; Preise ohne Kacheln | D5 2 | Formkontrast: technisches Objekt gegen runde Bedienschicht |
| 3D-Objekte | keine; das Blatt ist ein flaches Objekt, nur in der Ebene gedreht | D7 1 | ruhige Stufe 2 nach der Zeichnung in H2 |
| Bildintegration | Das Blatt ist Objekt der Szene; die Papierkante ist Objektkante, ohne Fotokarte. Unten läuft es aus | D11 3 (Ausdrucksträger) | ein Raum (DNA Nr. 4) |
| Oberflächendetails | Haken in den Farben des PDFs, Haarlinien wie die Tabelle im Blatt, `tabular-nums` | D12 2 | Präzision wie ein Aufmaß, Wiedererkennung von Blatt und Liste |
| Animation | Das Blatt legt sich einmal ab, danach folgt das Etikett (F) | D8 1, D16 1 | Bewegung mit Sinn: zuerst das Produkt, dann das Preisschild |
| Typografie | Inter; ein grünes Wort; Technikstimme für Kapitel, Kennzeichnung und Katalogkopf | D18 2 | |
| Überlagerungen | nur das Etikett über dem Blatt (≤ 15 %) | – | |
| Perspektive | keine; die Bedienschicht bleibt frontal | D15 0 | |
| Interaktive Effekte | keine am Motiv; die Chips folgen dem Finger | D10 1 | |

**Bewusst weggelassen:** Explosionsansicht und Messraster (Signature von fb-05; Stufe 2 trägt keine inszenierende Signature), Glas,
Lichtraum, Maßlinie (steht in H2), Scroll-Kopplung, Countdown (R13), Strichsymbole, 3-D-Modell, Kennzahlen, Formanschluss Telefon → Blatt
und „Handy zu Briefumschlag“ (SKILL:125).

**Verbindlich [V]:** G1–G9; das Etikett gehört zur Bildschicht (`aria-hidden`), der Preis steht zusätzlich als Text; eine Fassung des
Katalogs; „Beispiel“ am Material; Bewegung nur im Motiv; ruhige Fassung = Endbild.
**Experimentell [H]:** Begleitschatten, Ablegen mit nachfolgendem Etikett, mitlaufende Szene am Schreibtisch, Varianten V-1 bis V-3.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Primärer Fokus:** das Papierweiß, die größte helle Fläche auf dunklem Grund.
2. **Sekundärer Fokus:** das Etikett, ein dunkler Fleck auf Weiß mit 32-px-Preis. Es gehört zum selben Fokusträger und ist kein zweiter
   Held.
3. Danach folgt der Blick der linken Kante: h2, falls noch nicht gelesen, dann die Betragsspalte „0 € · 7,99 € · 0 €“ (Ziffern
   untereinander, 17 px fett), Katalog, Chips, Grenze.

**Kontraste:** Papier gegen Grund ≈ 18 : 1, Etikett gegen Papier ≈ 16 : 1; die Texte liegen bei ≥ 5,9 : 1 (`--muted`).

**Handlung:** Der Kopfknopf „Fenster ausmessen“ (≈ 150 × 44, oben rechts, Cream) ist auf jedem Bildschirm von H3 die einzige Cream.
Er ist klein und liegt außerhalb der Daumenzone; im Daumenbereich führen danach H4 (Ring) und H7 (Cream) weiter.

**Mögliche Ablenkungen:** Die Schrift im Blatt ist unlesbar und lädt zum Zoomen ein (Rückfall V-2). Am Übergang von H2 können zwei
Papierweiß-Flächen zugleich im Bild stehen, die Zeichnungskarte aus H2 und das Blatt, mit ≈ 460 px Grund dazwischen (Prüfpunkt im
Telefon-Video). „Familie Weber“ wirft die Frage auf, wer das ist; die Kennzeichnung „BEISPIEL“ beantwortet sie.

**Übergang:** H3 endet leise mit „misst der Fachbetrieb selbst nach“. Nach 96 px dunklem Grund setzt H4 mit „03 · Daten und Konto“ und
einem dunklen Maßstab neu an; der Wechsel von hell zu dunkel trennt die Kapitel.

## F. Interaktions- und Bewegungsverhalten

| Element | Auslöser | Verlauf | Dauer, Kurve | Begründung |
|---|---|---|---|---|
| Blatt (Bildschicht) | Die Oberkante erreicht 70 % der Fensterhöhe (IntersectionObserver, `rootMargin 0 0 -30% 0`) | Bewegung aus der Lichtrichtung: von `translate(14px,-19px) rotate(-3.2deg)` nach `rotate(-2deg)`, also 24 px entlang (0,6 / −0,8). Deckkraft 0 → 1 | 600 ms, Deckkraft 300 ms; `cubic-bezier(.2,0,0,1)` | Motiv-Auftritt (DG-AB-16). Die Kurve verzögert stark und setzt weich auf. Das Ablegen zeigt Trägheit ohne Federn: Papier prallt nicht |
| Etikett (Bildschicht) | 360 ms nach dem Blatt, wenn das Blatt ≈ 90 % seines Wegs hinter sich hat | 8 px entlang derselben Richtung, Deckkraft 0 → 1 | 320 ms, gleiche Kurve; Ende bei 680 ms | Teil desselben Trägers, nacheinander statt gleichzeitig (SG 10.7/4) |
| Text (Bedienschicht) | beim Eintritt ins Bild (`Reveal.auf`) | nur Deckkraft, einmal | 320 ms, `--e-out` | DG-AB-2. Der Preisblock kommt erst nach dem Blatt ins Bild (bei 844 und 664) und folgt so von selbst |
| Chips | Wischen | Der Finger führt 1 : 1, native Trägheit, `scroll-snap-type: x proximity` | – | ohne Überschwingen und ohne automatischen Einlauf (DG-AB-4) |

- **Hover und Klick:** keine am Blatt und am Etikett. Neigen per Maus bleibt ausgeschlossen (DG-AB-15), und die Bildschicht trägt keine
  Bedienziele (G1). Die Chips sind keine Knöpfe.
- **Schnelles Scrollen:** Liegt das Blatt beim Auslösen schon über dem Bild, steht sofort der Endzustand. Jede Animation läuft einmal je
  Aufbau. Nach einem Wechsel der Ansicht wird neu gebunden, idempotent je Wurzel (SKILL:63-64).
- **„Weniger Bewegung“ und ohne JavaScript:** Endbild ohne Übergänge (Blatt bei −2°, Etikett liegt). Ohne JavaScript steht die
  Textfassung (K08).

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst):** wie in C.

- Bei 664 px realer Höhe und Scrollstand ≈ 1.446 steht die Haarlinie direkt unter dem Kopf. Dann sind Szene, Etikett und alle drei
  Preiszeilen zusammen sichtbar (Ende bei Fenster-y 652).
- Bei 360 px: Blatt `min(290px, 81%)` = 266 × 252, das Etikett bleibt 152 × 76 (Überdeckung 12,7 %). Preiszeile 3 darf zweizeilig werden.
- Von 640 bis 1023 px gilt dieselbe Stapelfolge, die Szene höchstens 420 px breit, linksbündig.

**Schreibtisch 1280 × 800:**

- Spalte 1040 px (x 120–1160), 12 Spalten, Abstand 24. Split 5 : 7 (EV 7.5.6), die Haarlinie läuft über die volle Breite.
- **Links (Spalten 1–5, x 120–539):** Kapitelzeile, h2 40/44 in zwei Zeilen, Zusatz, Preisblock (Betragsspalte 80 px, Beschriftung ab
  x 208), Endpreis, Katalog mit Zeilen zu 28 px, Chips umbrochen in zwei Reihen ohne Wischen, Grenze. Höhe ≈ 780 px.
- **Rechts (Spalten 6–12):** Szene. Das Blatt ist 420 × 398 bei x 611, seine Oberkante liegt auf Höhe der h2. Das Etikett misst 184 × 92
  (Preis 40) und liegt in denselben Verhältnissen (oben bei 62,5 %, 26 % Überstand).
- [H] Die Szene läuft mit `position: sticky; top: 112px` neben dem Katalog mit (≈ 310 px ≈ 0,39 BH, ohne Animation, E-8). Rückfall:
  die Szene steht oben bündig.
- Der Abschnitt ist ≈ 0,97 BH hoch.

**Schreibtisch 1024:** Inhalt 922 px (Rand 51). Links 370 px, h2 40 passt mit „Was im Aufmaß“ in die erste Zeile. Rechts 528 px, Blatt
360 × 342, Etikett 184 × 92 (Überdeckung ≈ 8 %).

## H. Technische Umsetzung

**H.1 Bestehende Komponenten:** `web/assets/portal.js` (Aufbau der Ansicht `:851-858`; `aufmassInhalt`, `CAPS`, `grossSection`,
`b2cVisual` werden ersetzt); `web/assets/gemeinsam.js:178` (`Reveal`, mit einer Klasse nur für Deckkraft nach DG-AB-2);
`web/assets/gemeinsam.css` (Tokens, `.eyebrow`, `.chip`); `web/assets/modell.js:1117-1130` (Preise, Stichtag);
`functions/seo.js:138-150` (Textfassung wechselt am Stichtag von selbst); `web/index.html:61`, `:72` (Textfassung).

**H.2 Neue Komponenten:** `aufmassBlattPreis()` in `portal.js`; CSS in `web/assets/portal.css` (`.he3-szene`, `.he3-objekt`,
`.he3-blatt`, `.he3-etikett`, `.he3-preise` als `dl`, `.he3-inhalt` und `.he3-arten` als `ul`, `.he3-grenze`). Dazu eine Quelle für den
Katalog, z. B. `web/assets/aufmass-inhalt.js` mit `{ name, nameKunde, text }`. Sie speist `portal.js`, VK:123-131 und `web/index.html`
(erzeugt nach dem Muster von `scripts/ratgeber-bausteine.mjs`); die Prüfsuite vergleicht die drei Stellen.

**H.3 Layout und Bewegung (Startwerte):**

```css
.he3-szene { position: relative; height: 300px; }
.he3-objekt { position: absolute; left: 0; top: 24px; width: min(290px, 81%); }
.he3-blatt { display: block; width: 100%; height: auto; transform: rotate(-2deg); outline: 1px solid transparent;
  -webkit-mask-image: linear-gradient(#000 75%, transparent); mask-image: linear-gradient(#000 75%, transparent); }
.he3-etikett { position: absolute; left: calc(100% - 0.74 * 152px); top: 62.5%; width: max-content; min-width: 152px; min-height: 76px;
  padding: 12px 16px; border-radius: 12px; background: var(--surface);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .24), inset -1px 0 0 rgb(255 255 255 / .24),
              inset 0 0 0 1px rgb(255 255 255 / .14), -5px 6px 16px -2px rgb(22 22 22 / .07); }
.he3-szene.rev:not(.in) .he3-blatt { opacity: 0; transform: translate(14px, -19px) rotate(-3.2deg); }
.he3-szene.rev:not(.in) .he3-etikett { opacity: 0; transform: translate(5px, -6px); }
.he3-szene.in .he3-blatt { transition: transform 600ms cubic-bezier(.2,0,0,1), opacity 300ms cubic-bezier(.2,0,0,1); }
.he3-szene.in .he3-etikett { transition: transform 320ms cubic-bezier(.2,0,0,1) 360ms, opacity 320ms cubic-bezier(.2,0,0,1) 360ms; }
@media (prefers-reduced-motion: reduce) { .he3-szene * { transition: none !important; } }
```

Animiert werden nur `transform` und `opacity`; `will-change` gilt nur während des Übergangs. Die Maske sitzt am Bild und dreht mit (Auslauf
um 2° geneigt). `.rev` setzt erst das Skript, ohne JavaScript bleibt das Endbild.

**H.4 Assets:**

| Asset | Art, Format, Maß | Quelle |
|---|---|---|
| `web/bilder/he-aufmassblatt-kunde-{600,920,1240}.webp` plus `.json` mit Fingerabdruck | Ausschnitt von Seite 1 der Kundenfassung. Oben bis Unterkante der Boxen „Eckdaten“ und „Für deinen Fensterbauer“, Seitenverhältnis ≈ 1 : 0,95. WebP mit Qualität 82, je Stufe ≤ 80 KB. Keine Freistellung: Das weiße Papier ist die Objektfläche | **aus dem Repository erzeugbar:** `scripts/tour-bild.mjs` um `variante: 'kunde'` erweitern, mit den Beispieldaten aus `portal.js:1504`, `projekt.name 'Familie Weber'`, `ort 'Köln'`, `budget` leer (kein Euro-Betrag im Bild) und `beispiel: false` (Kennzeichnung im HTML). Die Prüfsuite prüft den Fingerabdruck wie bei den Tour-Bildern. **Abnahme:** unter dem Etikett keine Maßzahl und kein Kopfband |
| [H] `web/bilder/beispiel-aufmassblatt.pdf` (V-2) | ganzes Beispiel-PDF der Kundenfassung mit `beispiel: true` (Wasserzeichen) | dasselbe Skript |

Einbindung: `srcset` mit 600w/920w/1240w, `sizes="(min-width:1024px) 420px, 290px"`, `width`/`height` gesetzt, `loading="lazy"`,
`decoding="async"`. Material vom Inhaber ist nicht nötig.

**H.5 Leistung:** keine neue Bibliothek; das Bild liegt weit unter dem LCP. Ein eigener IntersectionObserver
(`rootMargin: 0px 0px -30% 0px`) wird nach dem ersten Auslösen getrennt. Kein `filter`, kein `backdrop-filter`; CLS 0 durch feste Maße.

**H.6 Barrierefreiheit:** Das Blatt ist ein `img` mit Alt-Text (B 15); Etikett und „BEISPIEL“ tragen `aria-hidden`. Die Preise stehen
in einer `dl`, im DOM erst die Leistung, dann der Betrag, visuell der Betrag zuerst (Grid-Bereiche). Die Wischzeile ist eine `ul` in einem
Bereich mit `tabindex="0"` und `aria-label="Elementarten"`; am Schreibtisch wird umbrochen. Kontraste ≥ 4,5 : 1. Bei 200 % Text wächst
das Etikett mit (`min-height`, Breite `max-content`); unter `forced-colors` bekommt es eine Kontur.

**H.7 Prüfsuite und Prüfpunkte:** `scripts/pruefen.mjs:148-149` erwartet heute `.einf-bar` und `.strip .einf`; die Erwartung wandert
auf Preiszeile 2 (IA-O-9). Das Blatt enthält „8 Maße je Fenster“ (`blatt.js:337`; EA O-11) und den Hinweis „die ersten 3 Projekte“
(EA O-4): bei 290 px unlesbar, in V-2 lesbar. Die App-Vorschau nennt „Familie Muster“ (`app.js:6457`) statt der einen Beispielfamilie (G7).

**H.8 Abweichungen von bestehenden Regeln:** Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**.

| bestehende Regel | hier | Begründung | Sammlung |
|---|---|---|---|
| „Was im Aufmaß steckt“ mit Kacheln; Bildplatz `gross` (GEST:192) | echtes Blatt mit Liste | SKILL:41; Platzhalter | IA-AB-5, IA-AB-8 |
| Einführungspreis nur im Band (GEST:14) | Stichtag in Preiszeile 2 | R13 | IA-AB-6, auf H3 erweitert |
| Kontrollhöhe 44 für Chips (GEST:32) | 36 px | nicht bedienbar, soll nicht wie ein Knopf wirken; Rückfall 44 | neu |
| `--float`, Erscheinen 8 px, drei Dauern (GEST:24, :38, :39) | Lichtkante, nur Deckkraft, 600 ms im Motiv | DNA Nr. 1, 6 | DG-AB-1, -2, -16 |
| Fotokarte, Kartendrehung ±7° beim Scrollen (GEST:34, :41) | Blatt als Objekt, statisch | DNA Nr. 4 | DG-AB-9, IA-AB-5 |

## I. Conversion-Begründung

**Warum an dieser Position:** H2 hat den Zweifel „Schaffe ich das?“ genommen. Die nächste Frage auf dem Weg zum Messen ist „Was bekomme
ich, was kostet es?“ (EA B2). H1 nennt den Preis nur als Zeile, H3 zeigt, wofür er gezahlt wird. Danach sichert H4 Daten und Konto ab.

**Wie die Gestaltung unterstützt:** Das Preisschild liegt auf dem Gegenstand und verbindet Preis und Gegenwert in einem Blick. Die
Beträge stehen in einer Spalte, „kostenlos“ und „einmalig“ lesen sich sofort. Die Grenze „kein Bestellmaß“ verspricht nichts, was der
Fachbetrieb leisten muss.

**Informationsmenge:** ≈ 75 Wörter auf ≈ 1,3 Bildschirmen; Katalog nur mit Namen (die Erklärungen stehen in fb-05 und in der
Textfassung); kein Satz wiederholt H2.

**Beitrag zu Z2a:** H3 räumt den Preis- und Wertzweifel aus; der Start bleibt über den Kopfknopf einen Tipp entfernt. Aussagen über
Konversionsraten sind nicht möglich (EA O-2).

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H3-H1 | Blatt mit Etikett beantwortet „Was bekomme ich für 7,99 €?“ schneller als Symbolkacheln (B-H-13) | Lesetest mit 5 s Sicht | Blatt ohne Etikett, Preis nur in den Zeilen |
| H3-H2 | Die Kundenfassung verhindert die Fehlannahme „ich bekomme ein Bestellmaß“ bzw. „das Blatt gehört einem Betrieb“ | Lesetest: „Für wen ist das Blatt?“ | – (F-1 ist Pflicht für Ehrlichkeit) |
| H3-H3 | Die 0-€-Zeilen rund um den Preis senken die Hemmung, mit dem Messen anzufangen | später Trichter App → Kasse (O-2) | nur Preiszeile 2 |
| H3-H4 | Das Ablegen mit nachfolgendem Etikett wirkt „mit Sinn“ und nicht verspielt | Telefon-Video, Urteil des Inhabers | Blatt und Etikett blenden nur ein |
| V-1 | Eine leere Seite 2 hinter dem Blatt zeigt „je Position eine Seite“ (wie die Vorschau in der App, `app.js:6450`) | Sichtprüfung | ohne |
| V-2 | Textlink „Beispiel als PDF ansehen“ (`app.js:6536`; GEST:321) unter dem Katalog stillt den Wunsch zu zoomen (+52 px) | Telefon-Test: tippen Besucher auf das Blatt? | ohne Link |
| V-3 | Zeile „Nicht dabei: Haustüren und Dachfenster.“ (**Textentwurf** nach `docs/SEO.md:47`) beantwortet H-11 | Lesetest | entfällt |

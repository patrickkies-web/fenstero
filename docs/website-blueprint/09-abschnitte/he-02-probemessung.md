# H2 01 · Probemessung

Seite: Startseite `/#hauseigentuemer` (Ansicht Hauseigentümer) · Position: 2 von 7 (nach H1 Startbild, vor H3 Aufmaßblatt und Preis) · Intensitätsstufe: 2 (Typ T4, interaktiv)

Kürzel wie in 08: GEST = docs/GESTALTUNG.md, DG = 02-design-grammatik.md, EA = 04, EV = 07, KD = 06-konzepte/konzept-d.md,
SG = design-dna/04-styleguide.md, DNA-B = design-dna/05-ergebnis-b-styleguide.md, DR = premium-gestaltung/designrichtung.md.
[V] verbindlich, [H] Hypothese mit Rückfall. Alle Lagen in CSS-px; y bezieht sich auf die Haarlinie des Abschnitts (Seite: + 776).

## A. Abschnitt und Funktion

- **Name, ID:** „01 · Probemessung“, `he-02-probemessung`.
- **Lage:** zweiter Abschnitt der Ansicht. Davor H1 (Stufe 3, Cream „Jetzt ausmessen“ bei Seiten-y ≈ 550–602, Ring „Führung starten“),
  danach H3 „Was im Aufmaß steckt“ (Stufe 2, statisch). Rhythmus 3 · **2** · 2 (08, 8.3.4 a).
- **Ziel:** den Zweifel „Schaffe ich das?“ durch einen Handgriff nehmen: drei Breiten antippen, das kleinste Maß wird markiert; danach
  Cream in die App (08; EV 7.5.10; KD).
- **Beantwortete Nutzerfrage:** „Schaffe ich das, und worauf kommt es beim Messen an?“ (H-01, Stufe B1; EA 4.6.2).
- **Vorbereitete Entscheidung:** Zutrauen → Messen beginnen (Z2a, `/app/#ausmessen`). Gruppen HE-3 und HE-5.
- **Gewicht:** Telefon ≈ 0,83 Bildschirmhöhen, mit Abschnittsabstand 0,94 (08: 0,86), Bildschirm 2; Schreibtisch ≈ 0,6.

## B. Konkreter Inhalt

**Bestehende Informationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| „Je Fenster drei Breiten und drei Höhen der Maueröffnung, dazu das Rahmenmaß. Es zählt das kleinste Maß, Abweichungen werden markiert.“ | `web/index.html:59` | Satz (gekürzt, s. u.); Textfassung wörtlich |
| Regel „kleinstes von drei Maßen“ | `web/assets/app.js:673-679` (`derive`) | Logik der Probe |
| Abweichung erst über 5 mm genannt, Warnung über 10 mm | `web/assets/modell.js:449`; `app.js:3157`; Ratgeber `fenster-ausmessen` Schritt 3 | Beispielwerte mit 5 mm Spanne liegen bewusst darunter: keine Abweichungsmarke, nur das kleinste Maß |
| Zeichnung „Messpunkte“ (Maueröffnung von innen, Orange `#c2410c` auf Weiß) | `web/bilder/messpunkte.svg` | Geometrie, Farben, Stellenwörter |
| Zeichen `messen`: längere Maße treten auf 28 % zurück, das kürzeste bleibt | `scripts/lottie-erzeugen.py:86-107` | Zustandssprache nach dem dritten Wert |
| Beispielwerte 1.236 / 1.231 / 1.234 mm | KD (Z. 416); 08 | Werte mit „Beispiel“ (DG G7) |
| Ziel und Wortlaut der Hauptaktion | `web/assets/portal.js:16-20` (`APP_START`, `appEinstieg`, `eigenesAufmass`), `:852` | Cream |

Abgleich: Das Beispiel im Ratgeber nennt 1.236 / 1.233 / 1.230 mm (`web/ratgeber/fenster-ausmessen/index.html:93`). Eine gemeinsame
Beispielreihe für die Website (G7) entscheidet der Inhaber; bis dahin gelten die Werte aus 08.

**Texte** (ohne Anrede, EA O-13)

| Element | Text | Herkunft |
|---|---|---|
| Kapitelzeile | „01 · PROBEMESSUNG“ | **Textentwurf** (KD) |
| h2 | „Dreimal messen.“ / „Das kleinste zählt.“, grün „zählt.“ | **Textentwurf** (KD) |
| Karte | „BEISPIEL“; „OBEN“, „MITTE“, „UNTEN“; Werte; Etikett „KLEINSTES MASS“ | G7; `messpunkte.svg`; KD |
| Legende | „BREITE MESSEN“ links, „0 / 3“ rechts | **Textentwurf** |
| Knöpfe | „Oben“, „Mitte“, „Unten“ | 08 |
| Satz 17 | „Je Fenster drei Breiten und drei Höhen der Maueröffnung, dazu das Rahmenmaß. Abweichungen werden markiert.“ | **Textentwurf**, gekürzt aus `web/index.html:59` |
| Cream | „Jetzt ausmessen“, mit angefangenem Aufmaß „Aufmaß fortsetzen“ | `portal.js:852` |
| Statuszeile (nur Vorleser) | „Oben: 1.236 Millimeter, Beispiel.“ … „Kleinstes Maß: 1.231 Millimeter. Dieses Maß zählt.“ | **Textentwurf** |

Kürzung des Satzes: Wörtlich läuft er bei 358 px und 17 px auf vier Zeilen (DG G2: höchstens drei), und „Es zählt das kleinste Maß“
steht schon in der h2. Abweichung vom Wortlaut in 08, keine Markenregel. Bedienschicht ≈ 34 Wörter (SG: ≤ 40).

**Interaktionen:** drei Umschaltknöpfe (`aria-pressed`); ein Tipp zeichnet die Linie, ein zweiter nimmt sie zurück; nach dem dritten Wert
erscheint das Etikett; Cream führt in die App. **Nicht hier:** Höhen, Rahmenmaß, Preis (H1, H3), „Führung starten“ (H1, H4), Link zum
Ratgeber (H5). **Vorhandene Komponenten:** siehe H.

## C. Exakte Layoutkomposition

**Grundstruktur Telefon:** senkrechter Stapel an der linken Kante x 16 (Ordnungslinie, DG G5): Kopf → Held → Bedienung → Handlung (G2).
Raster 4 Spalten à 77,5 px, Abstand 16; Karte, Haarlinie und Satz über alle vier. Die Knopfreihe teilt die volle Breite in drei gleiche
Ziele (114 + 8 + 114 + 8 + 114 = 358), weil drei gleichrangige Ziele gleich breit sein müssen.

| y (Abschnitt) | Element | Maß | Wert |
|---|---|---|---|
| 0 | Haarlinie | 358 × 1 | `--line2` |
| 16–33 | Kapitelzeile | 13/17 | „01“ `--accent`, Rest `--muted`; Technikstimme (600, Versalien, 0,12 em, `tabular-nums`) |
| 45–112 | h2 | 32/1,05, 800, −0,03 em | jeder Satz eine eigene Zeile (Block-Span), sonst rutscht „Das“ am Schreibtisch nach oben |
| 136–436 | Karte (Held) | 358 × 300, Radius 18 | Papierweiß `#ffffff`, ≈ 32 % der Fläche bei 390 × 844 |
| 452–469 | Legende | 13/17 | links „BREITE MESSEN“, rechts „0 / 3“, beide `--muted` |
| 477–521 | Knopfreihe | 3 × 114 × 44 | x 16–130, 138–252, 260–374 |
| 545–622 | Satz | 17/1,5, drei Zeilen | `--text2`, „drei Breiten und drei Höhen“ fett in `--text` |
| 646–698 | Cream | 52 hoch, Breite nach Inhalt (≈ 200) | linksbündig; Seiten-y ≈ 1.422–1.474, also 872 px unter der Cream von H1 (≥ 844, 08) |

Abstände 16 / 12 / 24 / 16 / 8 / 24 / 24 folgen G2 und dem Verhältnis 1 : 3 : 6 (SG 10.9). Abschnittsabstand danach 96 (G6).

**Zeichnung in der Karte** (SVG `viewBox="0 0 358 300"`, am Schreibtisch skaliert; Linien mit `vector-effect: non-scaling-stroke`):

| Teil | Lage | Ausführung |
|---|---|---|
| „BEISPIEL“ | x 16, y 14–30 | HTML-Etikett 13 px, `#3d3d3a` (11 : 1) |
| Wand | x 16–342, y 40–268 | `#ecebe6` |
| Stellenwörter | rechtsbündig an x 92, auf Höhe jeder Linie | HTML 13 px, `#3d3d3a` (≈ 9 : 1 auf der Wand) |
| Maueröffnung | y 58–234; linke Laibung x 100 / 103 / 101, rechte x 330 / 327 / 329 (oben / Mitte / unten) | Umriss 2 px `#c2410c`; Laibung in der Mitte bewusst überzeichnet eingezogen (Beispiel, nicht maßstäblich) |
| Altfenster | x 111–319, y 66–226, Pfosten x 215 | Rahmen 2 px `#3d3d3a`, Glas `#dceaf7` |
| Fensterbank | x 92–338, y 234–242 | `#a8a79f`, Radius 2 |
| Hilfslinien (Ruhe) | y 82 / 146 / 210, Laibung zu Laibung | 1 px gestrichelt 4/3, `#c2410c` bei 30 %; Punkt Ø 6 an der linken Laibung |
| Maßlinien | wie Hilfslinien; Längen 228 / 224 / 227 | 2 px `#c2410c`; Endstrich 10 px senkrecht plus Schrägstrich 45°, 8 px, 1,5 px |
| Wert-Pillen | mittig auf der Linie, x 173–257 | 84 × 24, Radius voll, Papierweiß, Tinte `#141414` 13 px; Zahl in fester Breite (5 ch, rechtsbündig), „ mm“ steht still |
| Etikett | x 136–294, y 162–186, unter der Pille „Mitte“ | 158 × 24, `--ground` mit `--text`, „KLEINSTES MASS“ 13 px Technikstimme |

Die Längen ordnen sich wie die Werte (oben > unten > Mitte). Stellenwörter und Werte sind HTML über dem SVG (Lage in % der Karte), damit
sie bei jeder Kartengröße genau 13 px bleiben (Schriftskala, SKILL:69).

**Ebenen:** Z 0 Grund `#161616` → Z 20 Karte (innen: Wand → Öffnung mit Altfenster → Hilfslinien → Maßlinien → Pillen und Etikett) →
Z 30 Bedienschicht → Z 40 Kopf. Drei Ebenen (Stufe 2: 3–4).

**Verhältnisse bei 390 × 844:** Karte ≈ 32 %, Text ≈ 15 %, freier Grund ≈ 38 % (≥ 33 %, SG 10.1/3). Größenhierarchie: Karte 300 hoch =
24-fach zur Versalhöhe des Satzes (SG: ≥ 3) > h2 32 > Klein-Stufe 13–17; drei Stufen. Asymmetrie: linksbündiger Stapel, in der Karte die
Öffnung rechts, links Wand mit Stellenwörtern; die Cream unten links ist der zweite, kleinere Hellpol (G3).

**Schreibtisch (Startwerte):** siehe G.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität | Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen; Wert-Pillen verdecken die Linien (Verdeckung, DNA-Pflicht) | niedrig | erst Zeichnung, dann Zahl |
| Material, Transparenz | Papier als einziges Material; kein Glas (Stufe 2: 0) | 1 | kündigt das Blatt in H3 an |
| Licht, Schatten | keines; kein Schatten auf dunklem Grund (DG 2.4.1); Papierweiß ist der Fokusreiz (G3) | 0 | Kontrast statt Effekt |
| Formen | Radius 18/24, Pillen voll; Laibung als einzige unregelmäßige Linie | – | begründet die Regel „kleinstes Maß“ |
| 3D-Objekte | keine | 0 | – |
| Bildintegration | Kartenkante ist Objektkante; „Beispiel“ oben links (G7) | – | ehrlich gekennzeichnet |
| Oberflächendetails | Endstriche mit Schrägstrich, `tabular-nums`, Hilfslinien, Messpunkte (DG 2.2.12) | mittel | „präzise wie ein Aufmaß“ (DR 1) |
| Animation | Linie wächst auf Tipp, Wert zählt in der Bildschicht mit, Endstrich rastet mit Feder ≤ 3 % ein (G1) | nutzergeführt | Physik ohne Dauerbewegung |
| Typografie | Bühnenstimme h2; Technikstimme für Nummer, Legende, Werte, Etikett; Lesetext 17 | – | zwei Stimmen (DR 3.2) |
| Überlagerungen | nur in der Karte; nichts über Knöpfen, Text, Cream (SG 10.1/6) | – | – |
| Perspektive | frontal | 0 | Zeichnung bleibt messbar |
| Interaktive Effekte | Hover und Fokus heben die zugehörige Hilfslinie von 30 auf 70 %; nach dem dritten Wert treten die längeren Linien zurück | Zustand | verbindet Knopf und Stelle |

**Signature:** informierend „Maßlinie mit Wert“ (1 von ≤ 1); inszenierend keine; Abschnittsnummer außerhalb des Budgets (DG 2.4.2).
**Bewusst weggelassen:** Lichtraum, Glas, Messraster unter der Karte (zweite Informationssignatur), Scrollkopplung, Parallaxe, Foto,
Höhenmaße, gerenderter Zollstock (fremdes Objekt, Material fehlt), Zählen in der Bedienschicht (DG-AB-3).

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Primärer Fokus:** die weiße Karte, einzige große Hellfläche, ≈ 32 % des Bildschirms.
2. **Sekundär:** h2 darüber (32 px, grünes „zählt.“), dann die Knopfreihe direkt unter der Karte im Daumenbereich (bei 844 und
   Abschnittsanfang am Kopf: y ≈ 533–577).
3. **Nach dem dritten Tipp:** das dunkle Etikett, einziges dunkles Element auf dem Papier; die zurückgetretenen Linien lenken den Blick
   auf 1.231 mm.
4. **Danach** Satz und Cream (unten links, Diagonale zur Karte). Die Cream ist mit ≈ 10.000 px² viel kleiner als die Karte (≈ 107.000 px²)
   und konkurriert vor der Interaktion nicht mit ihr.

**Kontraste:** Papier 18 : 1 zum Grund; Cream gleich hell, aber Pillenform; Orange nur als Linie (≤ 2 % kräftig). **Mögliche Ablenkung:**
Versuch, auf die Linie in der Karte zu tippen (Bildschicht ohne Ziel, H2-H1); grünes „01“ klein gehalten. Der Kopfknopf wird Ring, solange
die Cream sichtbar ist (08 N3, `kopfCta`). **Übergang:** vom Papier der Zeichnung zum Papier des Aufmaßblatts in H3 („so misst man“ →
„das kommt heraus“), Haarlinie „02“ nach 96 px.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Element (Schicht) | Veränderung | Dauer, Kurve | Grund |
|---|---|---|---|---|
| Abschnitt zu 25 % sichtbar, einmal | Karte (Bild) | Deckkraft 0 → 1, `translateY` 16 → 0 | 600 ms, `--e-out` | Motiv-Auftritt (DG 2.4.1), einziger bewegter Träger (E-2) |
| dasselbe | Bedienschicht | Deckkraft 0 → 1, gemeinsam, kein Versatz | 320 ms, `--e-out` | G1; DG-AB-2 statt `.rv` mit 8 px |
| Tipp | Knopf | `aria-pressed="true"`, Fläche `--surface3`, Haken 12 px `--accent` erscheint | 150 ms | Zustand über Füllung, ohne Skalierung |
| Tipp | Hilfslinie | Deckkraft 0,3 → 0 | 150 ms | – |
| Tipp | Maßlinie | `scaleX` 0 → 1 von der linken Laibung | 640 ms, `--e-out` | bremst an der Laibung wie ein angelegter Zollstock |
| Tipp | Wert-Pille | Deckkraft 0 → 1 (150 ms); Zahl = Endwert × Fortschritt, ganze mm | 640 ms, wie Linie | Wert zählt nur in der Bildschicht (DG-AB-3) |
| Tipp, ab 560 ms | Endstrich rechts | Deckkraft 0 → 1, Maßstab 0,6 → 1,03 → 1 | 220 ms, Feder ≤ 3 % | Einrasten (G1; DR 3.5) |
| dritter Wert fertig + 120 ms | längere Linien, ihre Pillen | Deckkraft 1 → 0,35 bzw. 0,6 (Text bleibt ≈ 4,8 : 1) | 320 ms, `--e-io` | Sprache des Zeichens `messen` |
| + 120 ms | Pille „Mitte“ | weiß → `--ground` (Überblendung zweier Pillen) | 220 ms | Rang über Füllung |
| + 240 ms | Etikett | Deckkraft 0 → 1, `translateY` 4 → 0 | 320 ms, `--e-out` | Abschluss ≤ 600 ms |
| Tipp auf gedrückten Knopf | Linie, Pille, ggf. Etikett | `scaleX` 1 → 0 zur linken Laibung, Deckkraft → 0, übrige Linien zurück auf 1 | 220 ms, `--kurve-aus` | Abgang kürzer als Auftritt (DR 3.5); wiederholbar |

- **Richtung:** links nach rechts (Lese- und Messrichtung); nur die Linie selbst wächst über mehr als ein Drittel der Breite.
- **Reihenfolge frei;** Tipps werden nie gesperrt oder gepuffert, die Rückmeldung am Knopf kommt im nächsten Bild (INP < 200 ms). Ein Tipp
  während des Zeichnens kehrt die Linie ab ihrem Stand um.
- **Legende:** „0 / 3“ springt ohne Zählanimation; bei „3 / 3“ wechselt sie auf `--text`.
- **Hover** (nur `@media (hover: hover)`): Ring des Knopfs auf `--ink` (vorhanden, `gemeinsam.css:66`) und Hilfslinie auf 70 %, 150 ms;
  ebenso bei `:focus-visible`.
- **Haptik [H]:** `Haptik.tick()` beim Einrasten des Endstrichs nur nach Freigabe DG-E-9.
- **Scrollen:** keine Kopplung, kein Anheften, natives Scrollen. Autonome Bewegung gibt es nicht; nichts läuft länger als 0,8 s.
- **Weniger Bewegung:** Karte und Text stehen sofort; ein Tipp zeigt Linie, Endstriche und Endwert als Schnitt; Rücktritt und Etikett über
  Deckkraft ≤ 150 ms; kein Versatz, kein Maßstab, kein Zählen, keine Haptik. Die Bedienung bleibt, denn der Handgriff ist die Funktion;
  das Endbild aus 08 („ohne JavaScript, ruhig“) gilt für die Fassung ohne JavaScript.
- **Ohne JavaScript:** Textfassung mit dem Endbild (H), Satz wörtlich aus `web/index.html:59`.

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigenständig):** Komposition wie C. Steht die Haarlinie am Kopf (56 px), liegen Haarlinie bis Cream in
y 56–754, also alles Wichtige auf einem Bildschirm. Bei 390 × 664 bleiben Karte und Knöpfe zusammen sichtbar (bis y 577), der Satz zum Teil;
die Cream folgt nach ≈ 90 px Scrollen. Anschnitt: H1 zeigt ab Seiten-y 776 Haarlinie, „01 · PROBEMESSUNG“ und den Kopf von „Dreimal
messen.“ (8 %, 08). Bei 320 px: Karte 288 × 241 (`aspect-ratio: 358 / 300`), Knöpfe je ≈ 91 breit, nichts quer; bei 200 % Text dürfen die
Knöpfe auf zwei Zeilen umbrechen. 640–1023 px: Telefonkomposition, Karte höchstens 560 breit, links an der Ordnungslinie.

**Schreibtisch 1280:** Spalte 1040 (x 120–1160), 12 Spalten à ≈ 64,7, Abstand 24; Split 5 : 7 an derselben Ordnungslinie wie H1.

- Haarlinie über die vollen 1040.
- Links (Spalten 1–5, 419 breit): Kapitelzeile y 16–33, h2 40/1,05 in zwei Zeilen y 45–129, Legende y 161–178, Knopfreihe 358 breit
  linksbündig y 186–230, Satz y 254–331 (`max-width` 419, zwei bis drei Zeilen), Cream y 363–415. Unter der Cream bleiben ≈ 70 px Luft.
- Rechts: Karte 560 × 470, Radius 24, rechtsbündig an x 1160 (x 600–1160, ≈ 61 px Luft zur Textspalte), oberkantenbündig mit der
  Kapitelzeile (y 16–486). Linien liegen dann bei y ≈ 144 / 244 / 344, also neben Knopfreihe und Satz.
- Etiketten bleiben 13 px; Pillen und Etikett behalten ihre Pixelmaße und werden relativ kleiner (gewollt, nichts überdimensionieren).
- Abschnittsabstand 128; Höhe mit Abstand ≈ 614.

**Schreibtisch 1024:** Seitenrand 32, Spalte 960, Spalte ≈ 58, Abstand 24. Links 386 breit (h2 „Das kleinste zählt.“ ≈ 335 px passt in
eine Zeile), Karte 550 × 461 über alle sieben Spalten (x 442–992). Satz drei Zeilen. Sonst wie 1280.

## H. Technische Umsetzung

**Bestehend (Datei):** `web/assets/portal.js` – `SCREENS.landing` (Abschnitt nach dem Startbild einsetzen), `akSatz`, `appEinstieg`,
`eigenesAufmass`, `kopfCta` (beobachtet `.scr .btn.primary` von selbst), Klickverteiler `root` mit `data-act`; `web/assets/gemeinsam.css` –
`.btn.small.ghost`, `.btn.primary`, `.pf`, `.eyebrow`, `:focus-visible` (2 px `--ink`); `web/assets/gemeinsam.js` – `Haptik`;
`web/bilder/messpunkte.svg` als Vorlage der Geometrie; `scripts/lottie-erzeugen.py` (`messen`) als Vorlage der Zustände.

**Neu:**

1. `probeMessung()` in `portal.js`: `<section class="probe" data-abschnitt="he-02-probemessung" aria-labelledby="probe-h">` mit
   Kapitelzeile, h2, `<figure class="probe-karte">` (SVG und HTML-Etiketten `aria-hidden="true"`, unsichtbare `figcaption` mit
   Beschreibung und Stand), `role="group"` mit der Legende als Name (unsichtbar ergänzt um „, Beispiel“), drei `<button type="button"
   class="btn small ghost" aria-pressed="false" data-act="probe" data-v="oben|mitte|unten">`, Satz, Cream `<a class="btn primary"
   href="${appEinstieg()}">`, `<p class="vh" role="status">`.
2. Fall `probe` im Klickverteiler: ändert nur den Abschnitt, ruft **kein** `render()` (sonst bricht die Animation ab). Zustand in einer
   Modulvariablen `{oben, mitte, unten}`, nach Neuaufbau ohne Animation wiederhergestellt (`afterRender`).
3. Fortschreitende Verbesserung: HTML im Endzustand (`probe--fertig`); `probeAuf()` setzt den Anfangszustand im selben Task wie das
   Einsetzen, damit nichts aufblitzt. Fällt das Binden aus, steht das Endbild.
4. CSS `.probe` in `web/assets/portal.css`: Karte `aspect-ratio: 358 / 300`, `contain: layout paint`; Etiketten `position: absolute` in %;
   Pille `contain: size layout`; `.probe .btn:active { transform: none }` gegen `gemeinsam.css:65` (DG 2.2.10); unter `forced-colors`
   Linien `CanvasText`, Kartenrand 1 px.
5. Zeichnungsfarben auf Papier als Tokens (`--papier`, `--z-wand`, `--z-glas`, `--z-rahmen`, `--z-tinte`, `--mo-papier: #c2410c`) in
   `gemeinsam.css`, Werte aus `messpunkte.svg` (P-AB-2).
6. Asset `web/bilder/probemessung.svg` (neu, aus Code): Endbild, `viewBox` 358 × 300, Systemschrift wie `messpunkte.svg` (`<img>` lädt
   keine Webfonts), ≤ 4 KB; Alt-Text **Textentwurf** „Beispiel: Maueröffnung von innen mit drei gemessenen Breiten, oben 1.236 mm, Mitte
   1.231 mm, unten 1.234 mm; das kleinste Maß, 1.231 mm, ist markiert.“ Für die Textfassung `web/index.html` (st-05). Vom Inhaber wird kein
   Material gebraucht.

**Animationstechnik:** Stufe 1 (SKILL:56). Linien über `transform: scaleX()` mit `transform-box: fill-box; transform-origin: left center`
statt `stroke-dashoffset`, damit nur `transform` und `opacity` animiert werden; Web Animations API für Linie, Endstrich (Feder als
Keyframes 0,6 → 1,03 → 1) und Etikett; Zahl per `requestAnimationFrame` nur während der 640 ms. Auftritt einmal per
`IntersectionObserver` (Schwelle 0,25), nur mit Klasse `.js`; ohne Observer sofort sichtbar.

**Leistung:** ≈ 4 KB SVG, ≈ 3 KB JavaScript, keine Bibliothek, kein Bild; Platz reserviert (CLS 0); keine Schleife. Einziges Risiko: Text
der Pille ändert sich je Bild, deshalb feste Breite und `contain`.

**Barrierefreiheit:** Ziele 114 × 44; Fokus 2 px, 3 : 1; Status höflich angesagt; Zustand nie nur über Farbe (Haken, Füllung, Etikett mit
Wort); Kontraste: Tinte auf Papier 18 : 1, `#3d3d3a` auf Wand 9 : 1, Linie `#c2410c` auf Glas ≈ 4,2 : 1; Tab-Folge h2 → Knöpfe → Cream;
`scroll-padding-top` ≥ 56; keine Eingabe, kein Formular.

**Prüfpunkte für `scripts/pruefen.mjs`:** drei `[data-act="probe"][aria-pressed]`; nach drei Klicks Etikett sichtbar und Status enthält
„1.231“; Schriftgrößen nur 13/15/17/32 bzw. 40; höchstens eine sichtbare `.btn.primary` je Bildschirm; bei „weniger Bewegung“ keine
laufende Animation; Werte im SVG-Asset gleich den Werten in `portal.js`.

**Abweichungen von bestehenden Regeln**

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall |
|---|---|---|---|---|
| P-AB-1 | Gewählt ist Cream (GEST:24; `gemeinsam.css:82`, `:90`) | Gedrückt = `--surface3` mit grünem Haken | „Gemessen“ ist Fortschritt (Grün erlaubt, GEST:24); drei Cream-Knöpfe neben Cream-Pille und Papier ergäben vier Hellpole und brächen „eine Cream je Bildschirm“ | gedrückt Cream, Hauptaktion in H2 dann Ring (08: „sonst Ring“) |
| P-AB-2 | Keine weiteren Farben, nur Tokens (GEST:24) | Zeichnungsfarben auf Papier als Tokens, `#c2410c` statt `--mo` | `--mo` `#ff8a5b` erreicht auf Weiß nur ≈ 2,3 : 1 (WCAG 1.4.11 verlangt 3 : 1); die Werte stehen schon in `web/bilder/*.svg` | Zeichnung als externes SVG ohne Bedienung (Standbild) |

Jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Bereits anderswo geführt und hier angewandt: E-AB-10
(Nummer mit Kapitelwort), DG-AB-2 (Einblenden nur über Deckkraft), DG-AB-3 (kein Zählen in der Bedienschicht).

## I. Conversion-Begründung

- **Position:** H1 behauptet „Selbst.“; H2 löst die Behauptung sofort ein, bevor Preis (H3) und Daten (H4) gelesen werden. Das folgt der
  Stufenfolge B1 → B2 → B3 (EA 4.4.3): Wer zweifelt, ob er es kann, bewertet noch keinen Preis.
- **Gestaltung:** Der Beweis ist das Produkt selbst, keine fremde Stimme (EV 7.5.1, Nr. 1; SKILL:49). Die Regel wird erlebt statt erklärt
  (03-recherche E6, Lernkontext); die Cream steht dort, wo das Zutrauen entsteht.
- **Informationsmenge:** eine Regel, drei Knöpfe, ein Satz, eine Handlung; Höhen, Rahmenmaß und Sonderfälle bleiben in App und Ratgeber;
  alles auf einem Bildschirm (G).
- **Beitrag zur Zielhandlung:** zweite Gelegenheit für Z2a, mit Zutrauen statt mit Neugier; der Ring „Führung starten“ bleibt in H1 und H4
  für die, die erst zusehen wollen.

**Verbindlich in diesem Abschnitt [V]:** Stufe 2 mit einer informierenden Signatur; ein Held; eine Cream je Bildschirm; Werte nur in der
Bildschicht zählend und zusätzlich im DOM; „Beispiel“ an der Karte; Bedienschicht ohne Versatz, Skalierung, Schatten; ruhige Fassung und
Fassung ohne JavaScript vollständig.

**Zu testende Annahmen [H]** (keine Messung vorhanden; keine Aussage über Wirkung auf Starts oder Käufe):

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H-E10 / D-H-13 | Die Probe nimmt den Zweifel „Schaffe ich das?“ und wirkt nicht wie Hausaufgabe | Lesetest mit fünf Personen aus HE-3/HE-5: „Welches Maß zählt?“ nach 30 s, dazu Beobachtung, ob sie zur Cream gehen; Telefon-Video, Urteil des Inhabers | Zeichnung als Standbild mit Satz (Endbild, ohne Knöpfe) |
| H2-H1 | Die Knopfreihe unter der Karte wird ohne Hinweis verstanden; niemand tippt vergeblich auf die Linien | Beobachtung im Lesetest | kurzer Puls am nächsten offenen Knopf bei Tipp auf die Karte (Rückmeldung „Puls“, GEST:39) |
| H2-H2 | Der mitzählende Wert stützt das Bild „Länge wächst“ und lenkt nicht ab | Telefon-Video, Lesetest | Wert erscheint fertig nach der Linie |
| H2-H3 | Die überzeichnete Laibung wird als Beispiel gelesen, nicht als Messfehler | Lesetest | gerade Laibung, Unterschied nur in den Werten |
| H2-H4 | Die Cream in H2 bringt zusätzliche Starts neben H1 | heute nicht messbar (der Trichter zählt jeden Aufruf von `/app/`, EA 4.1); eigenes Ereignis in der eigenen Statistik nach Freigabe, ohne fremde Server | Ring statt Cream |

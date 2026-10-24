# Vollständige Merkmalstabelle § 2 (2)

Seite: `/konfigurator-bedingungen/` (Paketbedingungen) · Position: 2 (P-2 nach `pb-01-kopf-pdf-zeile`, im Vertragsfluss in § 2 nach Absatz (2)) · Intensitätsstufe: 1 ruhig (Typ T12; Ansichtstyp „Arbeitsansicht“ nach SG)

ID `pb-02-merkmalstabelle`. Phase I, Stand 24.10.2026. Reine Planung: Das Repository wurde gelesen, nichts gebaut oder geändert.
Kennzeichnungen wie in 08 (**[V]**, **[H]**, **Textentwurf**, **Festlegung I**, **Abweichung … Freigabe nötig**). Grundlage: 08 8.3.6,
EV 7.5.8, EA AB-6, IA K20, DG 2.3.14 (T12), 2.4, DG-E-1, SG 10.1, 10.5, 10.10, Ergebnis B, SKILL, GEST:419, :432. `PB` =
`web/konfigurator-bedingungen/index.html`. `10-paketentscheidung.md` (verbindlich für Pakete) berührt den Abschnitt dreimal:
`web/assets/pakete.js` bleibt unverändert (10.4 H); der Vergleich in `fb-07` bekommt denselben klebenden Kopf aus drei Kurznamen mit
Zellen à 114 px (J-R7, 10.4 G), dem diese Tabelle folgt; „nicht enthalten“ statt „nein“ gilt nur dort, nicht im Vertrag (H.1). Preise
enthält die Tabelle nicht (`functions/pakete-seite.js:217` filtert `name` und `preis`).

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Vollständige Merkmalstabelle § 2 (2): alle 25 Merkmale der drei Pakete im Vertragswortlaut |
| Position | zweites gestaltetes Element der Seite: nach `pb-01` (h1, Stand, PDF-Zeile, Entwurfshinweis), vor dem übrigen Vertragstext `pb-03`. Physisch zwischen § 2 (2) (PB:39) und § 2 (3) (PB:43) |
| Ziel | jedes Merkmal je Paket nachlesbar; am Telefon mit festem Kopf aus drei Kurznamen, ohne Querscrollen, Wortlaut unverändert (08 8.3.6) |
| Nutzerfrage | „Was genau ist in welchem Paket?“ (08) |
| vorbereitete Entscheidung | Detailprüfung der Wahl (FB-6); Freigabe im Betrieb durch Mitentscheider (M-1, M-4, M-5). Beantwortet F-23, F-24, F-26, F-28, F-35 (EA 4.5) |
| Einstieg | aus `fb-07` (gruppierter Vergleich mit ≈ 12 Zeilen, „volle Tabelle in den Paketbedingungen“, EA AB-6), aus dem Festblock `fb-08`, aus Fuß und Menü |
| Länge Telefon | ≈ 2.350–2.450 px ≈ 3,5–3,7 BH bei 664 px (Schätzung aus 25 Zeilen, nicht gemessen; 08 schätzt ≈ 2 BH, Begründung in C.2) |

**Festlegung I-1: Die Tabelle bleibt in § 2.** 08 setzt sie auf Position 2. Sie vor § 1 zu ziehen, hieße den Vertrag umzustellen:
Absatz (2) kündigt sie als „die folgende Übersicht“ an (PB:39), § 9 (1) verweist auf die „Übersicht in § 2“ (PB:80), und die Prüfsumme
der PDFs läuft über die Reihenfolge aller Blöcke (`scripts/bedingungen-pdf.mjs:77`). Jede Umstellung erzwänge eine neue Fassung
`PAKET_STAND` und eine erneute anwaltliche Prüfung. „Position 2“ entsteht deshalb über den Weg, nicht über die Lage: neuer Anker
`id="merkmale"` am Absatz (2), Sprungmarke in `pb-01`, Ziel des Links aus `fb-07`. Ohne Sprung beginnt die Tabelle am Telefon bei
≈ y 1.850–1.950 (Ende Bildschirm 3); mit `#merkmale` steht ihr Kopf bei ≈ y 320 im ersten Bildschirm.

## B. Konkreter Inhalt

**B.1 Bestand (Wortlaut unverändert [V]).** Kopfzeile „Leistung · EEZI Essential · EEZI Essential Plus · EEZI Signature“ und 25 Zeilen
(PB:41, Baustein `<!--pakete:leistungen-->` PB:40–42), erzeugt von `leistungen()` (`functions/pakete-seite.js:215-221`) aus `MERKMALE`
(`web/assets/pakete.js:71-99`) und `PAKETE` (`:42-67`) über `wertText()` (`functions/pakete-seite.js:47-57`), in der Reihenfolge von
`MERKMALE` von „Eigene Domain“ bis „Anfragen am Tag (Richtwert)“. Neun Zeilen tragen eine Erläuterung (`<br><span class="klein">`):
Domain, Konfigurator, Anfrage per E-Mail, Logo, Fotos, Startseite, Dashboard, Einladungslinks, Fortschritt.

Kurznamen „Essential“, „Essential Plus“, „Signature“ sind Bestand: `kurzname()` (`functions/pakete-seite.js:31`), schon im Vergleich der
Verkaufsseite (`:135`) und im Vertragstext selbst („bei Essential deutlich …“, PB:80). Rahmen: h2 „§ 2 Leistungen“ `#leistungen` (PB:37)
und Absatz (2) mit dem Richtwert-Vorbehalt (PB:39), der für die letzten zwei Zeilen gilt.

Zeilen, die die Maße bestimmen (Telefon, Wertspalte 114 px, 15 px):

| Zeile | längster Wert (Bestand) | Zeilen |
|---|---|---|
| Absender der E-Mails | „neutrales Postfach ohne eeziframes, sobald eingerichtet; bis dahin das Konfigurator-Postfach“ | 8 |
| Gestaltung · Rahmen der E-Mails | „eeziframes-Design mit Ihrem Namen“ · „Ihr Logo, Fußzeile von eeziframes“ | 3 |
| eeziframes in Datenschutz … | „als technischer Dienstleister“ | 3 |
| Aufbewahrung der Anfragen | „30 Tage nach Zustellung“, „für die Vertragsdauer“ | 2 |
| längstes Einzelwort | „Vertragsdauer“ ≈ 101 px, „Konfigurator-“ ≈ 96 px | passt |

**B.2 Überschriften und Botschaften.** Keine eigene Überschrift [V]: Jeder neue Satz in `<main>` als `p`, `h`, Liste oder Tabellenzeile
ginge ins PDF und änderte die Fassung (`bloecke()`, `scripts/bedingungen-pdf.mjs:42-61`). Benannt wird die Tabelle ohne neuen Text:
`aria-labelledby="leistungen"`, `aria-describedby="merkmale"`. Die Botschaft trägt die Form: drei Pakete nebeneinander, jedes Merkmal,
verbindlicher Wortlaut.

**B.3 Textentwurf.** In der Tabelle keiner. An den Schnittstellen (dort zu entscheiden): `pb-01` **Textentwurf** Sprungmarke „Alle
Merkmale je Paket (§ 2)“ → `#merkmale`, als `a` in der Zeile `p.klein`, die `vertraege()` aus dem PDF ausnimmt (`:66`); `fb-07` verlinkt
`/konfigurator-bedingungen/#merkmale`.

**B.4 Interaktionen.** Nur Scrollen. Kopf klebt, solange die Tabelle im Bild ist. Rückweg über den Kopf-Ring „Pakete ansehen“ →
`/fuer-fensterbauer/#pakete` (`rh-01`). Kein JavaScript.

**B.5 Vorhandene Komponenten.** `leistungen()`, `wertText()`, `kurzname()`, `bausteineEinsetzen()` (`functions/pakete-seite.js:252-258`);
`.tabelle` (`web/assets/recht.css:55-70`, wird für diese Tabelle ersetzt); Schwestertabelle `fristen()` (`functions/pakete-seite.js:238-242`,
AV-Vertrag, ebenfalls drei Paketspalten); PDF-Bau `scripts/bedingungen-pdf.mjs` (Tabelle `:125-145`); Prüfung 29.4
(`scripts/pruefen-instanzen/29.mjs:119-144`).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Ein Kopfband (Spaltenköpfe) über 25 gleichrangigen Merkmalszeilen, durch Haarlinien getrennt; keine Karte, kein
Bild. Ordnungslinie ist die linke Textkante der Seite (x 16 bzw. x 120), an der h2, Absätze, Zeilenköpfe und erste Wertspalte fluchten
[V] (SG 10.1/1). Die drei Paketspalten sind gleich breit: Im Vertrag ist kein Paket hervorgehoben.

**C.2 Telefon 390 × 844 (Inhalt x 16–374, 358 px).**

| Element | Lage und Maß |
|---|---|
| Kopfband | volle Inhaltsbreite, 40 px hoch (13/18 + 11 + 11), klebt bei `top: var(--kopf-h)` = 56 → Band y 56–96; Unterkante 1 px `--line2` über x 16–374 |
| Spaltenköpfe | „Essential“ ab x 16, „Essential Plus“ ab x 138, „Signature“ ab x 260, je 114 px breit, linksbündig; „Essential Plus“ ≈ 90 px, einzeilig. „Leistung“ und das Präfix „EEZI “ visuell verborgen, im DOM und für Vorleser vorhanden |
| Merkmalszeile | Polster 12 oben, 12 unten; Zeilenkopf über volle 358 px; Erläuterung direkt darunter (gleiche Zelle); 6 px Abstand; drei Werte in 3 × 114 px mit 8 px Rinne, Spalten bündig mit den Köpfen; Unterkante 1 px `--line` |
| Höhen | Grundzeile 72 px (Kopf 21 + 6 + Wert 21 + 24); + 21 je Erläuterungs- oder Wertzeile; Absender 219 px; 5–7 Zeilen je Bildschirm (664 − 56 − 40 = 568 px) |

Die drei Spalten teilen die vier Telefonspalten in Drittel (je 1⅓), weil drei gleichrangige Pakete gleich breit sein müssen; 114 px bei
8 px Rinne wie in 08 und im Vergleich von `fb-07` (10.4 G), damit beide Tabellen dasselbe Raster zeigen. Die längsten Wörter passen
(B.1). Die Länge übersteigt die ≈ 2 BH aus 08, weil 25 Zeilen mit drei Werten ohne Streichung nicht kürzer werden; heute
(`recht.css:60-70`, jeder Wert mit eigenem Etikett) sind es nach den CSS-Werten geschätzt ≈ 5.500 px ≈ 8 BH.

**C.3 Schreibtisch 1280 × 800.** Spalte 1040 (x 120–1160), 12 Spalten à 64,7 px, Rinne 24, Kopf 64 px. Die Breite gibt die Seite vor
(`re-01`, parallel in Phase I entstanden); die Tabelle wählt ihre Form selbst nach der Breite ihres Containers:

- **Vier Spalten (08), Tabelle ≥ 700 px:** ohne die Abschnittsliste aus `re-01` [H] Spalten 1–9 wie dort die Cookie-Tabelle
  (x 120–894; 9 × 64,7 + 8 × 24 = 774 px). Spaltenstarts auf dem Raster: Merkmal Spalte 1 (x 120, Text 242 px), Essential Spalte 4 (x 386), Plus Spalte 6
  (x 563), Signature Spalte 8 (x 741), Werte je 153 px Text. `table-layout: fixed`, `col` 34,4 % · 23 % · 23 % · 19,6 %, Zellpolster
  rechts 24 px außer in der letzten Spalte; Kopfband 44 px.
- **Festlegung I-2, Tabelle < 700 px:** Steht rechts die klebende Abschnittsliste (`re-01` [H] ab acht h2; die Paketbedingungen haben
  15), bleibt nur die Lesespalte 1–7 (x 120–717, 597 px). Vier Spalten drückten die Werte dort auf ≈ 107 px Text, schmaler als am
  Telefon. Deshalb gilt die Telefonkomposition, nur breiter: Zeilenkopf über 597 px, drei Wertspalten à 194 px (Rinne 8, Starts x 120,
  322, 523), Kopfband 44 px. Abweichung von 08 („Schreibtisch: vier Spalten“) aus Platzgründen.

Volle Paketnamen ab 480 px Tabellenbreite („EEZI Essential Plus“ ≈ 122 px, einzeilig).

**C.4 Größenhierarchie und Schrift.** In der Tabelle zwei Größen; Rang über Gewicht und Tonwert (DG-E-1, Lösung C für Unterseiten).

| Element | Satz | Farbe | Kontrast auf `#161616` |
|---|---|---|---|
| Spaltenkopf | 13/18, 600, `tabular-nums`, Sperrung .02 em, eigene Schreibweise | `--muted` `#93928d` | 5,8 : 1 |
| Zeilenkopf (Merkmal) | 15/21, 700 | `--text` `#f3f2ee` | 16,2 : 1 |
| Erläuterung | 15/21, 500 | `--muted` | 5,8 : 1 |
| Wert | 15/21, 500, `tabular-nums` | `--text2` `#c9c8c3` | 10,8 : 1 |

Am Übergang stehen § 2 (2) in 17/27 und die Tabelle in 15 und 13 gemeinsam im Bild: drei Stufen (SG 10.1/4); die h2 in 24 ist dann schon
oben hinausgescrollt.

**C.5 Verhältnisse und Ebenen.** Bild 0 %; Text deckt je Bildschirm geschätzt 30–40 % der Fläche, ≥ 60 % bleiben frei (kurze Werte wie
„ja“, Flattersatz), über der Grenze von 33 % für Stufe 1. Asymmetrisch an der linken Kante, symmetrisch nur zwischen den drei Paketen.
Ebenen: 0 Grund `#161616` → 30 Tabellentext → Kopfband über den Zeilen (lokal `z-index: 1`, deckend) → 40 Seitenkopf. Ebene 20 (Karte)
bleibt leer. Keine interaktive Komponente im Abschnitt; die einzige Handlung ist der Ring im Seitenkopf oben rechts.

**C.6 Technische Startwerte.**

| Wert | Start | Begründung |
|---|---|---|
| Klebekante | `top: var(--kopf-h)` (56 / ab 1024: 64) | sitzt bündig unter dem opaken Kopf (`rh-01` C.6) |
| Kopfband | 40 px unter 480 px Tabellenbreite, sonst 44 px; Hintergrund `--bg` deckend | Zeilen verschwinden sauber darunter; T12 verbietet halbtransparente Köpfe |
| Formgrenzen | Container ≥ 480 px → volle Namen; ≥ 700 px → vier Spalten | Wertspalte ≥ 140 px Text, Merkmal ≥ 220 px |
| Zeilenabstand | 21 px (1,4) | kurze Phrasen in schmalen Spalten; Fließtext bleibt 1,6 |
| Silbentrennung | `hyphens: auto`, `overflow-wrap: break-word` | 200 % Text und 320 px ohne Überlauf (`lang="de"`, PB:2) |
| Linien | `border` 1 px, nicht `box-shadow` | bleibt unter `forced-colors` sichtbar |

## D. Anwendung der Design-DNA

Ansichtstyp Arbeitsansicht: Pflicht sind flache Bedienschicht, Formfamilie, ruhiger Grund, unverdeckt und scharf, Bewegung nur im Motiv,
Mindestanforderungen und die Linie (Ergebnis B, B.1); Stapel, Anker, Luft und Sprung sind Ziel. „Listen gleichrangiger Zeilen sind
erlaubt.“

| Eigenschaft | Ausgestaltung | Intensität | Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | genau eine Verdeckung: Zeilen gleiten beim Scrollen unter das deckende Kopfband | 1 | erfüllt Nr. 2 funktional; die Kante zeigt, wo die Spaltenzuordnung herkommt |
| Material, Transparenz | keines; Kopfband deckend in Grundfarbe | 0 | Ruhe über Vertragstext (T12; Nr. 9) |
| Licht, Schatten | keines; Kante 1 px `--line2` statt Schatten | 0 | Nr. 6, Nr. 10; DG 2.4.1 „keiner auf dunklem Grund“ |
| Formen | rechtwinkliges Haarliniengitter ohne Flächen und Radien | – | Präzision „wie ein Aufmaß“ (SKILL:13); kein Formbruch, weil keine Form |
| 3D, Bild, Perspektive | keine | 0 | – |
| Oberflächendetails | gleich breite Ziffern; Köpfe und Werte exakt auf denselben x; Kopfkante eine Stufe heller als die Zeilenlinien | 1 | Mikrodetail, das man erst beim Lesen bemerkt |
| Animation | keine | 0 | E-13; „Text bewegt sich nicht, solange er gelesen werden soll“ (B.3.6) |
| Typografie | Technikstimme im Kopf, Zeilenkopf fett, Werte leiser | 1 | Lesefolge Merkmal → drei Werte |
| Überlagerung | nur Kopfband über Zeilen | 1 | – |
| Interaktive Effekte | keine | 0 | nichts in der Tabelle ist bedienbar, also reagiert nichts |

**Bewusst weggelassen:** Karte mit Ring (kostet am Telefon ≥ 24 px Breite); Färbung von „ja“/„nein“ und grüne Haken (Wertung im
Vertrag; „Originalfotos per Link: nein“ sähe bei Signature wie ein Mangel aus, obwohl dort Unterlagen gespeichert werden); Spalte
„Empfohlen“ (gehört zu `fb-06`); Gruppentitel (neuer Vertragstext); Filter „nur Unterschiede“ (leistet `fb-07`); Zebrastreifen; Hover;
eine Kopfkante erst beim Kleben (bräuchte Skript). Glas, Licht und Signature schließt T12 aus.

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig (PB-AB-1):** GEST:432 verlangt Tabellen als „Karte mit Ring“ und am
Telefon „Karten untereinander … Spaltentitel aus `data-k`“. Hier: keine Karte, am Telefon drei Spalten unter klebendem Kopf. Grund: 08
verlangt den festen Kopf; der direkte Vergleich in einer Zeile ist der Zweck; die Länge sinkt geschätzt von ≈ 8 auf ≈ 3,6 BH. Rückfall:
heutige Kartenform (`data-k` bleibt im Markup). In 08 8.4.5 nachtragen.

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig (PB-AB-2):** GEST:419 und :432 setzen Spaltenköpfe in Versalien.
Hier: Paketnamen in ihrer Schreibweise (SKILL:71), Sperrung .02 em wie „Maße und Dateinamen“ der Technikstimme (DR:100-101). Grund:
„ESSENTIAL PLUS“ braucht bei 13/600 ≈ 118–125 px und bräche in 114 px um; der Kopf würde 57 statt 40 px hoch. Rückfall: Versalien,
zweizeiliger Kopf.

E-8 („am Telefon keine Anheftstrecke“) betrifft Bühnenszenen mit scrollgekoppelter Bewegung (SG 10.7); der klebende Spaltenkopf ist eine
Beschriftung ohne Bewegung, von 08 8.3.6 ausdrücklich verlangt, und klebt nur über der eigenen Tabelle.

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit.

1. **Primärer Fokus:** der Zeilenkopf der obersten Zeile (15/700, `--text`, hellster und fettester Reiz), Anker jeder Zeile.
2. **Sekundärer Fokus:** die drei Werte darunter, links nach rechts; dann kurz ins Kopfband, um die Spalte zu bestätigen. Das Band ist
   leise (`--muted`, 13), damit es nicht mit den Werten konkurriert.
3. **Folge beim Eintritt:** Absatz (2) → Kopfband → erste Zeile → Rhythmus der Haarlinien.
4. **Kontraste:** 16,2 : 1 (Merkmal), 10,8 : 1 (Wert), 5,8 : 1 (Kopf, Erläuterung); nur Grautöne.
5. **CTA:** keiner im Abschnitt; einzige Handlung ist der Ring „Pakete ansehen“ im Seitenkopf oben rechts (≈ 150 × 44). Keine Cream.
6. **Ablenkungen:** Platzhalter `mark.ph` (Orange) stehen in anderen Paragraphen; der lange Absender-Wert zieht Blick in die
   Signature-Spalte, ohne Hervorhebung bleibt das neutral.
7. **Übergang:** Mit der letzten Zeile schiebt sich das Band nach oben weg (Klebebereich = Tabelle); nach 24 px folgt § 2 (3) wieder in
   17/27. Der Größensprung zum Fließtext markiert das Ende.

## F. Interaktions- und Bewegungsverhalten

| Fall | Verhalten |
|---|---|
| Scrollen | nativ, ohne Kopplung. Kopfband klebt bei `--kopf-h`, solange der Tabellenkörper darunter liegt, und verlässt das Bild mit dem Tabellenende (CSS `position: sticky`, keine Dauer, keine Kurve) |
| Niedriges Fenster | in der Vier-Spalten-Fassung klebt der Kopf nur ab 600 px Fensterhöhe; die Telefonfassung klebt immer, weil ohne Kopf die Spalten nicht zuzuordnen sind |
| Hover, Klick, Tipp | keine Wirkung; Text markier- und kopierbar, Kopieren liefert die volle Tabelle mit „EEZI …“ |
| Sprung `#merkmale` | landet über `scroll-padding-top: calc(var(--kopf-h) + 12px)` (`rh-01`); Absatz (2) oben, Kopfband ≈ 250 px darunter |
| Weniger Bewegung | identisch, es bewegt sich nichts |
| Ohne JavaScript | identisch |
| Drucken | Form nach Druckbreite, Kopf nicht klebend; das verbindliche Druckstück bleibt das PDF |

Begründung: Arbeitsfläche ohne Auftritt (E-13). „Bewegung mit Tiefe und Physik“ (SKILL:43) gilt den Bildträgern der Verkaufsflächen;
im Vertrag stört jede Bewegung das Lesen.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, eigene Komposition).** Wie C.2. Bei 360: Spalten 104 px, „Vertragsdauer“ passt knapp, sonst trennt
`hyphens`. Bei 320 (WCAG 1.4.10): Spalten 91 px, Silbentrennung greift, kein Querscrollen [V]. Bei 200 % Text bricht „Essential Plus“
zweizeilig, das Band wächst auf ≈ 58 px (zusammen mit dem Kopf 114 px = 17 % von 664). Telefon quer (844 × 390): Container ≈ 812 px
→ vier Spalten; Kopf klebt nicht (Fenster < 600 px).

**Schreibtisch 1280.** Wie C.3. Kopfband bei y 64–108, also 13,5 % der Höhe. Tabelle ≈ 1.900–2.200 px hoch (Schätzung): in vier Spalten
laufen die Erläuterungen in 242 px zwei- bis dreizeilig, in der Lesespalte die Werte in 194 px bis fünfzeilig (Absender).

**Schreibtisch 1024.** Rand 32, Spalte 960, Spalten ≈ 58, Rinne 24. Mit Abschnittsliste Lesespalte 1–7 = 550 px → Telefonkomposition,
Werte je 178 px. Ohne Liste Spalten 1–9 = 714 px → vier Spalten, Merkmal 222 px Text, Werte je 140 px; Prozentwerte wie bei 1280
(Abweichung vom Raster ≤ 2 px).

## H. Technische Umsetzung

**H.1 Geänderte Dateien.**

- `functions/pakete-seite.js` `leistungen()`: Klasse `merkmale` statt `tabelle`, `colgroup`, ARIA-Rollen (sonst verliert Safari bei
  geändertem `display` die Tabellenrollen), erste Zelle `th scope="row"`, Präfix `<span class="eezi">EEZI </span>`; `data-k` bleibt
  (Rückfall PB-AB-1). Danach `node scripts/bedingungen-pdf.mjs`.
- `wertText()` (`:47-57`) bleibt für `leistungen()` unverändert [V]. Die von 10.4 H verlangte Fassung „nicht enthalten“ statt „nein“
  bei Zahlen (Zeile 51) gilt nur in `vergleich()`, als Parameter oder eigene Hilfsfunktion. Sonst änderte sich der Vertragstext (Fotos
  bei Essential, Zugänge bei Essential und Plus), die Prüfsumme bräche, und `PAKET_STAND` bräuchte eine neue, geprüfte Fassung.
- PB:39: `id="merkmale"` am Absatz (2). `bloecke()` liest nur Text: Prüfsumme und PDFs bleiben gültig.
- `web/assets/recht.css` (oder die Unterseiten-CSS aus `re-01`): Block `.merkmale` ohne `overflow-x: auto` (`recht.css:55`), sonst wird
  der Rahmen Scrollcontainer und `sticky` wirkt nicht (SG 10.5). `fristen()` kann dieselbe Klasse bekommen (Entscheidung in `pb-03`).

**H.2 Markup (Kern).**

```html
<div class="merkmale"><table role="table" aria-labelledby="leistungen" aria-describedby="merkmale">
<colgroup><col><col><col><col></colgroup>
<thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">Leistung</th>
  <th role="columnheader" scope="col"><span class="eezi">EEZI </span>Essential</th>…</tr></thead>
<tbody role="rowgroup"><tr role="row"><th role="rowheader" scope="row">Eigene Domain<br><span class="klein">Ihr Konfigurator …</span></th>
  <td role="cell" data-k="EEZI Essential">ja</td>…</tr>…</tbody></table></div>
```

**H.3 CSS (Kern, Telefon zuerst).**

```css
.merkmale{container-type:inline-size;margin:16px 0 24px}
.merkmale table{display:block;width:100%;font-size:15px;line-height:21px;font-variant-numeric:tabular-nums}
.merkmale th,.merkmale td{text-align:left;font-weight:500;color:var(--fg2);hyphens:auto;-webkit-hyphens:auto;overflow-wrap:break-word;padding:0}
.merkmale tbody th{color:var(--fg);font-weight:700}
.merkmale tbody th .klein{color:var(--muted);font-weight:500}
.merkmale thead{display:block;position:sticky;top:var(--kopf-h);z-index:1;background:var(--bg);border-bottom:1px solid var(--line2)}
.merkmale thead th{font-size:13px;line-height:18px;font-weight:600;letter-spacing:.02em;color:var(--muted);padding:11px 0}
.merkmale tbody{display:block}
.merkmale tr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:8px}
.merkmale tbody tr{row-gap:6px;padding:12px 0;border-bottom:1px solid var(--line)}
.merkmale tbody th{grid-column:1/-1}
.merkmale thead th:first-child,.merkmale .eezi{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@container (min-width:480px){
  .merkmale .eezi{position:static;width:auto;height:auto;overflow:visible;clip-path:none}
  .merkmale thead th{padding-block:13px}
}
@container (min-width:700px){
  .merkmale table{display:table;table-layout:fixed;border-collapse:separate;border-spacing:0}
  .merkmale thead{display:table-header-group;position:static;border:0}
  .merkmale tbody{display:table-row-group} .merkmale tr{display:table-row;padding:0;border:0}
  .merkmale th,.merkmale td{display:table-cell;padding:14px 24px 14px 0;border-bottom:1px solid var(--line)}
  .merkmale tr>:last-child{padding-right:0}
  .merkmale thead th{padding-block:13px;background:var(--bg);border-bottom-color:var(--line2)}
  .merkmale thead th:first-child,.merkmale .eezi{position:static;width:auto;height:auto;overflow:visible;clip-path:none}
  .merkmale col:nth-child(1){width:34.4%} .merkmale col:nth-child(2),.merkmale col:nth-child(3){width:23%}
}
@media (min-height:600px){@container (min-width:700px){.merkmale thead th{position:sticky;top:var(--kopf-h);z-index:1}}}
@media print{.merkmale thead,.merkmale thead th{position:static}}
```

`border-collapse: separate` hält die Kopfkante an der klebenden Zelle; bei `collapse` bliebe sie stehen. Verborgene Texte erben 13 px und
bestehen die Größenprüfung (SKILL:69-70).

**H.4 Prüfsuite.** `scripts/pruefen-instanzen/29.mjs:135` (`<tr><td>Absender der E-Mails</td>`) und `:141` (`'<th>' + Name + '</th>'`)
auf Text ohne Tags umstellen. Neu: auf `/konfigurator-bedingungen/` bei 390 und 320 kein Querscrollen; beim Scrollen in die Tabellenmitte
liegen drei Spaltenköpfe sichtbar bei `top = --kopf-h`; Schriftgrößen nur aus der Skala; `node scripts/bedingungen-pdf.mjs --pruefen`
meldet „aktuell“. Die Gestaltungsprüfung (`scripts/pruefen.mjs:1602-1620`) um die Seite erweitern, sobald der Kopf aus `rh-01` dort steht.

**H.5 Assets.** Keine.

**H.6 Leistung.** Kein Skript, kein Bild, ≈ 1,5 KB CSS; `sticky` läuft im Compositor. Risiko: Container-Query mit klebendem Kind in
Chrome, Safari, Firefox prüfen; Rückfall: dieselben zwei Grenzen als Media Queries auf die Seitenbreite, je nach Lage der Abschnittsliste.

**H.7 Barrierefreiheit.** Kopfzellen mit `scope`, ausdrückliche Rollen, Name und Beschreibung über vorhandene Texte; Vorleser hören „EEZI
Essential Plus, ja“. Keine Information nur über Farbe. Keine fokussierbaren Elemente in der Tabelle, also verdeckt das Band keinen Fokus
(2.4.11). Keine festen Höhen (1.4.12). Linien als `border` (forced colors).

## I. Conversion-Begründung

- **Position:** dort, wo der Vertrag sie ankündigt; schnell erreichbar über `#merkmale` (Festlegung I-1). Wer kommt, prüft (FB-6) oder
  gibt frei (M-1, M-4, M-5) und erwartet Vollständigkeit, nicht Verkauf (SKILL:29-30).
- **Gestaltung:** ein Merkmal, drei Werte nebeneinander, Unterschiede ohne Hin- und Herscrollen sichtbar; der leise Kopf ersetzt 75
  wiederholte Etiketten. Ohne Wertung und Hervorhebung wirkt die Tabelle als Vertragsdokument glaubwürdig (SKILL:49).
- **Informationsmenge:** alle 25 Zeilen, weil § 2 (2) sie festlegt und § 9 darauf verweist; die Verdichtung auf ≈ 12 Zeilen leistet
  `fb-07` (EA AB-6).
- **Zielhandlung:** U3 räumt F-23, F-24, F-26, F-28, F-35 aus; zurück zur Paketwahl führt der Ring im Seitenkopf. Ob das wirkt, ist eine
  Hypothese; Besucherzahlen oder Trichter gibt es nicht (EA O-2).

| Nr. | Hypothese [H] | Prüfweg | Rückfall |
|---|---|---|---|
| PB-H1 | Klebender Kopf und drei Spalten beantworten Detailfragen am Telefon schneller und richtiger als die heutige Kartenfolge | Lesetest bei 390: „Ab welchem Paket steht Ihr Logo im Aufmaßblatt?“, „Wie lange gilt der Fotolink bei Plus?“, „Wo nennt eeziframes sich nur technischer Dienstleister?“; Zeit und richtige Antworten | heutige Kartenform mit `data-k` |
| PB-H2 | Kurznamen ohne „EEZI“ werden eindeutig den vollen Namen zugeordnet | Lesetest, Frage nach dem vollen Namen | volle Namen, zweizeiliger Kopf |
| PB-H3 | Paketnamen in eigener Schreibweise lesen sich ruhiger als Versalien | Sichtprüfung des Inhabers bei 390 | Versalien (PB-AB-2) |
| PB-H4 | Wer über `#merkmale` aus `fb-07` kommt, findet über den Kopf-Ring zurück | Beobachtung in Gesprächen | **Textentwurf** Link „Zurück zu den Paketen“ unter der Tabelle als `nav` außerhalb der PDF-Blöcke |

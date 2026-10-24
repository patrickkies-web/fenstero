# 04.2 Entscheidungshilfe, Vergleich, Verkaufsstand (#vergleich)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 7 von 15 (Block 04.2, nach `fb-06-pakete-karten`, vor `fb-08-festblock-gespraechsweg`) · Intensitätsstufe: 1 ruhig (Typ T7, Textteil)

Phase I, Stand 24.10.2026, Planungsdokument (nichts gebaut). Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) und
[10-paketentscheidung.md](../10-paketentscheidung.md); VK = `web/fuer-fensterbauer/index.html`, PB = `web/konfigurator-bedingungen/index.html`.
**[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I-n** = Entscheidung dieser Spezifikation. Für Pakete, Preise und Paketwahl
gilt 10 vor ZA. Alle Pixellagen sind geplant, nicht gemessen.

---

## A. Abschnitt und Funktion

- **Name:** Block 04.2 in Kapitel 04 „Ihre Marke“, ohne eigene Überschrift: der **Verkaufsstand** (ein Satz) und der **Vergleich** als
  `details` mit dem bestehenden Anker `#vergleich` (VK:182).
- **Festlegung I-1 (folgt Festlegung 10-1):** Die Entscheidungshilfe in drei Zeilen aus ZA 04.2 entfällt hier; ihr Inhalt steht als
  „Wenn“-Satz in jeder Karte (`fb-06`). Gründe: ein Mechanismus statt zwei (EV 7.5.4); die drei Zeilen aus ZA verlinken zurück auf die Karten,
  also gegen die Leserichtung (E-4); Platz am Telefon. Ohne JavaScript bleibt die Hilfe erhalten, weil die Karten dort untereinander mit ihren
  Sätzen stehen. Der Name bleibt wegen der Nummerierung in ZA.
- **Position:** direkt unter der Kartenreihe, Telefon ≈ 1.180 px unter dem Sprungziel `#pakete` (bei 664 px Bildschirm 7–8). Davor die
  Kartenreihe (Stufe 2), danach der Festblock (Stufe 1). Rhythmus 2 · 1 · 1 (DG 2.3.17/6).
- **Ziel:** Wer zwischen zwei Paketen schwankt, liest die genauen Unterschiede auf Abruf; wer entschieden ist, geht an einer zugeklappten
  Zeile vorbei. Der Preisvorbehalt steht ehrlich und kleiner als jeder Preis (J-R18).
- **Nutzerfragen:** „Was unterscheidet die Pakete genau?“ (F-23) · „Sieht mein Kunde eeziframes?“ (F-24) · „Wie viele Anfragen und
  KI-Auswertungen sind drin?“ (F-26) · „Sind die Preise endgültig?“
- **Vorbereitete Entscheidung:** Paketwahl bei unsicherer Präferenz; danach geht es in Leserichtung weiter zu Festblock, Gesprächsweg
  („Noch offen“) oder Formular (`fb-08`, `fb-09`), nie zurück nach oben (E-4).

## B. Konkreter Inhalt

| Element | Inhalt | Fundstelle | Art |
|---|---|---|---|
| Verkaufsstand, solange `VORLAEUFIG` | „**Vorläufige Preise.** Preisstand 22. Oktober 2026. Es gilt der Preis, den Sie beim Bestellen sehen.“ | `web/assets/pakete.js:15-17`; PB:52; J-R18; Datum über `standText()` (`functions/api/recht.js:23-26`) | **Textentwurf**; Punkt nach „Vorläufige Preise“, weil Prüfsuite 29.2 `<b>Vorläufige Preise.</b>` verlangt (`scripts/pruefen-instanzen/29.mjs:46`) |
| ohne `VORLAEUFIG` | Satz entfällt samt Abstand | ZA 8.3.2 d) | – |
| „bleibt für Ihren Vertrag fest“ | entfällt bis J-O-2; sonst Widerspruch zu PB:55 | `functions/pakete-seite.js:89` | gestrichen |
| Zusammenfassung | „Alle Merkmale im Vergleich“ | VK:182; J-R19 | Bestand |
| Tabellenkopf | „Essential“ · „Essential Plus“ · „Signature“, davor versteckt „EEZI “ | `kurzname()`, `functions/pakete-seite.js:31` | Bestand |
| Tabellentitel (versteckt) | „Die drei Pakete im Vergleich“ | – | **Textentwurf** |
| Gruppenköpfe | „Kosten“ · „In allen Paketen“ · „Ihre Marke“ · „Gefunden werden“ · „Für Ihr Team“ · „Daten“ · „Richtwerte“ | J-R7; „Richtwerte“ aus ZA 04.2 | **Textentwurf** |
| Zeilentitel | wörtlich `MERKMALE[s].titel` | `web/assets/pakete.js:74-98`; Prüfsuite 29.1 | Bestand |
| Werte | aus `PAKETE` über `wertText()` mit den Anzeigeregeln unten | `web/assets/pakete.js:43-66`; `functions/pakete-seite.js:47-57` | Anzeige **Textentwurf** |
| Satz zu den Richtwerten | „Richtwerte je Konfigurator. Erst bei deutlicher Überschreitung (KI das Doppelte, Anfragen das Vierfache) dürfen wir vorübergehend begrenzen; wir sprechen Sie darauf an.“ | PB:39 § 2 (2) | **Textentwurf** |
| Fußsatz | „Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.“ (ohne `MWST` Fassung nach § 19 UStG) | `functions/pakete-seite.js:139`; Prüfsuite 29.1 | Bestand wörtlich |

**Zeilen in dieser Reihenfolge** („n. e.“ steht hier für „nicht enthalten“; mit „·“ verbundene Titel sind getrennte Zeilen)

| Gruppe | Zeilentitel | Essential | Plus | Signature |
|---|---|---|---|---|
| Kosten | Monatlich, netto | 29 € | 39 € | 64 € |
| | Einrichtung, einmalig vorab | 99 € | 199 € | 279 € |
| | Erstes Jahr: Einrichtung und 12 Monate **[H]** (J-H4) | 447 € | 667 € | 1.047 € |
| In allen Paketen | Eigene Domain · Voller Konfigurator · Anfrage per E-Mail mit PDF | je eine Zelle über drei Spalten: „in allen drei“ | | |
| Ihre Marke | Gestaltung | eeziframes-Design mit Ihrem Namen | in Ihrem Design | in Ihrem Design |
| | Ihr Logo · Ihre Firmenfarbe · Eigene Startseite | n. e. | ja | ja |
| | Fotos Ihres Betriebs | n. e. | bis 6 | bis 6 |
| | Hinweis auf eeziframes in der App | „Powered by EEZIframes“ | kleiner Hinweis im Fuß | keiner |
| Gefunden werden | In Suchmaschinen | nein | Startseite | Startseite |
| Für Ihr Team | Dashboard unter Ihrer Domain · Persönliche Einladungslinks · Fortschritt sehen | n. e. | n. e. | ja |
| | Zugänge zum Dashboard | n. e. | n. e. | 5 |
| Daten | Aufbewahrung der Anfragen | 30 Tage nach Zustellung | 30 Tage nach Zustellung | für die Vertragsdauer |
| Richtwerte | Anfragen am Tag · KI-Auswertungen im Monat | 50 · 600 | 50 · 1.000 | 100 · 2.000 |

20 Zeilen: die 17 des Bestands (zwei Preiszeilen, 15 Merkmale mit `vergleich: true`), zwei Richtwerte und „Erstes Jahr“. Diese Zeile wird aus
`preis()` gerechnet (Einrichtung + 12 × Monat); Grundfassung an, weil 10.1.4 sie vorsieht; der Schalter `ERSTES_JAHR` nimmt sie ohne Lücke
heraus, wenn der Inhaber J-O-11 verneint.

**Anzeigeregeln** (neue Funktion `vglText()`; `wertText()` bleibt für die Paketbedingungen): (1) ja/nein-Merkmal falsch und Zahl 0 → „nicht
enthalten“ (J-R7); der Auswahlwert „nein“ bei „In Suchmaschinen“ bleibt wie im Datenblatt der Karte (10.4 B). (2) `fotos` n → „bis n“ wie in
`punkte()` (`functions/pakete-seite.js:71`). (3) Zahlen ab 1.000 mit Tausenderpunkt; `geld()` setzt ihn heute nicht. (4) In „Richtwerte“
entfällt der Titelzusatz „ (Richtwert)“, weil der Gruppenkopf ihn trägt.

- **Festlegung I-2 – Gruppe „Richtwerte“:** ZA 04.2 nennt sie und ordnet F-26 diesem Block zu; J-R7 schließt weitere Gruppen nicht aus.
- **Festlegung I-3 – keine weiteren zusammengelegten Zellen:** Ein über Plus und Signature gezogenes „ja“ stünde links in der Plus-Spalte,
  die leere Signature-Spalte läse sich als fehlender Wert. Den Unterschied trägt der Tonwert.
- **Festlegung I-4 – „Bestellung bald möglich“ gehört zu `fb-09`** (EA:325; ZA 05). `fb-09` muss das Literal tragen, das Prüfsuite 29.2 in
  Zustand A verlangt, sonst ist 29.2 anzupassen.

**Interaktionen:** Zusammenfassung öffnen und schließen; Lesen mit klebendem Tabellenkopf; Öffnen über einen Link auf `#vergleich`. In der
Tabelle keine Links, Knöpfe oder Auswahl.

**Vorhandene Komponenten:** `vergleich()`, `hinweis()`, `wertText()`, `kurzname()`, `geld()`, `steuerText()`, Bausteine `<!--pakete:NAME-->`
mit `BLOECKE` (`functions/pakete-seite.js:30-57`, `:86-91`, `:133-140`, `:255-258`); `details.rg-frage` und `.rg-tab`
(`web/assets/ratgeber.css:59-74`, `:128-133`); `.vk-vergleich-auf` (`web/assets/verkauf.css:453-454`).

## C. Exakte Layoutkomposition

**Grundstruktur.** Lesestapel → Handlung (G2 ohne eigenen Kopf und Held). Ein Satz, darunter eine Zeile, die aufklappt; geöffnet eine Tabelle
direkt auf dem Grund, ohne Karte. Ordnungslinie ist die linke Spaltenkante (G5); asymmetrisch, alles linksbündig, nur das Zustandszeichen
„+“ sitzt am rechten Rand.

**Ebenen.** Z 0 Grund `#161616` → Z 30 Satz, Haarlinien, Zeile, Tabelle; der klebende Tabellenkopf liegt eine Stufe über den Zeilen
(`z-index: 1`) → Z 40 Seitenkopf. Einzige Verdeckung: Der Tabellenkopf überdeckt die durchlaufenden Zeilen (DNA Nr. 2).

**Telefon 390 × 844, zugeklappt** (x 16–374, über alle 4 Spalten; y ab der Kartenunterkante)

| y (px) | Element | Maß | Schrift, Farbe |
|---|---|---|---|
| 24–68 | Verkaufsstand, zwei Zeilen | 358 × 44 | 15/22 `--text2`; „Vorläufige Preise.“ 700 `--text` |
| 92 | Haarlinie | 358 × 1 | `--line2` |
| 93–145 | Zusammenfassung, Text ab x 16; „+“ 24 × 24 bei x 350–374 | 358 × 52 | 17/700 `--text`; Zeichen `--text2` |
| 145 | Haarlinie | 358 × 1 | `--line2` |
| 194 | Kennwort „VERTRAG IN KÜRZE“ (`fb-08`) | – | – |

Zugeklappt ≈ 146 px ≈ 0,17 BH (ZA plant 0,25). Bei 390 × 664 stehen Kartenende, Block und Anfang des Festblocks zugleich im Bild.

**Telefon, aufgeklappt** (y ab der unteren Haarlinie der Zusammenfassung)

| y (px) | Element | Maß |
|---|---|---|
| 16–60 | Tabellenkopf: drei Zellen 116 × 44, Abstand 5, deckungsgleich mit den Segmenten der Namensleiste (10.4 C); Kurzname 15/700 `--text`, links, senkrecht mittig; Grund `--ground` deckend; Haarlinie unten `--line2`; klebt bei `top: 56px` | 358 × 44 |
| 76–94 | Gruppenkopf „KOSTEN“: Technikstimme 13/600, Versalien, Sperrung 0,12 em, `--muted` | 358 × 18 |
| 102–164 | Zeile: 8 oben; Titel 15/600 `--text` über die volle Breite; 2 px; Werte 15/500 in drei Spalten (Text bis 108 px); 8 unten; Haarlinie `--line` | 358 × 62 |
| – | mehrzeilige Werte wachsen um je 22 px (Gestaltung 106 px; Hinweis und Aufbewahrung 84 px); zwischen Gruppen 24 px | – |
| – | „In allen Paketen“ einzeilig: Titel in Spalte 1–2 (237 px), „in allen drei“ 15 `--text2` in Spalte 3; 9/9 | 358 × 40 |
| – | nach den Richtwerten deren Satz, 15 `--muted`, drei Zeilen | 358 × 66 |
| Ende | 24 px, Fußsatz 15 `--muted`, zwei Zeilen; 48 px bis `fb-08` | 358 × 44 |

Aufgeklappt ≈ 1.810 px ≈ 2,1 BH (Kopf 60, Gruppenköpfe ≈ 350, 20 Zeilen ≈ 1.260, Richtwerte-Satz 74, Fußsatz 68): lang, aber auf Abruf,
gegliedert, und der Kopf hält die Spaltenzuordnung.

**Größenhierarchie.** Nur die Klein-Stufe 13–17 (DG 2.2.18): Zusammenfassung 17, Satz, Titel und Werte 15, Gruppenköpfe 13. Abstufung über
Gewicht (700 / 600 / 500) und Tonwert (`--text` / `--text2` / `--muted`), als Lese- und Arbeitsfläche nach DG-E-1 C; kein nicht-textliches
Hauptelement (ZA: „Held: keiner“). Darüber steht meist noch das Kartenende mit Datenblatt oder Beispielbild.

**Verhältnisse.** Zugeklappt, Bildschirm 844 mit Kartenende, Block und Festblock-Anfang: Text ≈ 20 %, Linien und Zeile ≈ 7 %, freier Grund
≥ 60 %. Abstände 8 : 24 : 48 = 1 : 3 : 6 (G6).

**Schreibtisch 1280 × 800** (12 Spalten zu 64,67 px, Abstand 24, Spalte 1040 ab x 120)

| y (px) | Element | Spalten (x) |
|---|---|---|
| 24–68 | Verkaufsstand, `max-width: 64ch` | 1–8 (120–805) |
| 92–145 | Zusammenfassung zwischen zwei Haarlinien, „+“ rechts | 1–12 (120–1160) |
| aufgeklappt +16 | Kopf 44 px, klebt bei `top: 64px`: erste Zelle leer (versteckt „Merkmal“), dann Kurznamen 15/700 | 1–3 · 4–6 · 7–9 · 10–12 (120 · 386 · 652 · 918) |
| danach | Gruppenköpfe über 1–12; Zeilen 44 px (11/11), Titel 15/600 in 1–3, Werte 15/500 je 3 Spalten; „in allen drei“ über 4–12; Richtwerte-Satz und Fußsatz in 1–8 | – |

Aufgeklappt ≈ 1.430 px ≈ 1,8 BH. Die Paketspalten fluchten nicht mit den Karten (je 4 Spalten), weil die Beschriftung drei Spalten braucht
(10.4 C); die Reihenfolge ist dieselbe. **1024 × 768:** Spalte 944 ab x 40, Beschriftung und Pakete je 218 px, Kopf klebt bei 64.

**Interaktive Komponente.** Genau eine: die Zusammenfassung, volle Breite, 52 px, Text an der Ordnungslinie, Zeichen rechts im mittleren
Daumenbereich, wenn der Block in der Bildschirmmitte steht.

**Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Tabelle unter 640 px | `table`, `thead`, `tbody` als Block; `tr` als Raster `repeat(3, minmax(0, 1fr))`, `column-gap: 5px`; Titel und `colspan="3"` über `1 / -1`; in „In allen Paketen“ Titel `1 / 3`, Wert `3` | drei Pakete, drei Spalten, kein Querscrollen (R9); funktionale Abweichung vom 4-Spalten-Raster, das als Außenmaß (358 px) bleibt |
| Tabelle ab 640 px | `repeat(4, minmax(0, 1fr))`, `column-gap: 24px` | 242 px bei 1040, 218 px bei 944 = 3 von 12 Spalten |
| Zeilen | Telefon 8/8, Schreibtisch 11/11, Zeilenhöhe 22 | kompakt am Telefon, 44 px am Schreibtisch |
| Klebender Kopf | `position: sticky; top: var(--kopf-h)` (56 / 64), Grund `--ground` | Kopfhöhe nach `rh-01-kopf` |
| Zusammenfassung | `min-height: var(--h2)`, links ohne Innenabstand, Haarlinien `--line2` | T9; DG-AB-19 |
| Zustandszeichen | 24 × 24, zwei Striche 14 × 2 px als `border` in `currentColor` | Bestand ist ein grünes Schriftzeichen (`ratgeber.css:131`); Grün bleibt Signal (G8) |
| Umbruch | `hyphens: auto; overflow-wrap: break-word` (`lang="de"` vorhanden) | 116-px-Zellen, 200 % Text |
| Ziffern | `font-variant-numeric: tabular-nums` | „Ziffern in Reih und Glied“ (DR 1) |
| Überlauf | kein `overflow: hidden` an Tabelle und Vorfahren, wo nötig `overflow: clip` | sonst klebt der Kopf nicht; `.rg-tab` setzt heute `overflow: hidden` (`ratgeber.css:59`) |

Gegenüber der DNA keine Abweichung: Stufe 1 erlaubt 0–20 % Bild bei ≥ 33 % freier Fläche (DG 2.4.2).

## D. Anwendung der Design-DNA

Stufe 1 „ruhig“, Dialekt C (flach); keine Signature, weder informierend noch inszenierend (DG 2.4.2; Dosierregel 1).

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achse | drei Ebenen; Verdeckung nur durch den klebenden Tabellenkopf, darüber der Seitenkopf | 1 | Spaltenzuordnung bleibt beim Lesen sichtbar |
| Material, Transparenz | keines; Kopf deckend, kein Glas (Glas nur über Bildinhalt, DG 2.4.1) | 0 | Lesbarkeit vor Wirkung |
| Licht, Schatten | keines, auch keine Lichtkante | 0 | Licht gehört V1 und 02; nichts konkurriert mit der Entscheidung |
| Formen | Haarlinien 1 px; Zeile ohne Fläche und Rundung; Fokusrahmen Radius 12 (DG-AB-8) | 1 | Linie ordnet ohne Fläche (SG 10.5/5) |
| 3D-Objekte, Perspektive | keine | 0 | frontal (DNA Nr. 1) |
| Bildintegration | keine Bilder; das Beispielbild der Karte steht darüber | 0 | Bild zeigt (`fb-06`), Tabelle benennt |
| Oberflächendetails | Technikstimme für Gruppenköpfe, gleich breite Ziffern, Zeichen aus zwei 2-px-Strichen | 1 | „präzise wie ein Aufmaß“ (DR 1) |
| Animation | Öffnen über Deckkraft 220 ms; „+“ wird „–“ über Deckkraft 150 ms | 1 | Rückmeldung ohne Bewegung der Bedienschicht (G1) |
| Typografie | Klein-Stufe 13–17, Stufen über Gewicht und Tonwert | 1 | überfliegbar (Q34); Unterschiede über Tonwert lesbar |
| Überlagerungen | nur der klebende Kopf | 1 | Orientierung |
| Interaktive Effekte | Hover = Kontur und Farbe, aktiv = Füllung `--surface`, Fokus 2 px | 1 | ein Kanal je Zustand wie überall (SG 10.7/8) |

**Verbindlich erfüllt:** frontale, flache, matte Bedienschicht ohne Licht (Nr. 1, 9, 10), ein Formsystem (Nr. 5), Ordnungslinie (Nr. 3), kein
Schatten (Nr. 6), Negativraum (Nr. 8), ruhiger Grund (Nr. 11), Tiefe über Verdeckung (Nr. 2). **Variabel:** Hierarchie über Tonwert statt
Maßstab (Ausnahme zu Nr. 7 wie Ref 01).

**Bewusst weggelassen:** Kartenfläche um den Vergleich; Kasten oder Warnfarbe am Verkaufsstand (J-AB-5); grünes „+“; Hervorhebung der
empfohlenen Spalte (die Empfehlung lebt in der Karte, J-R8; ein zweites Signal wäre ein zweiter Mechanismus); Haken-Grafiken in Zellen;
weitere zusammengelegte Zellen (I-3); Maßkette über Spalten (informierende Signature, Stufe 1 erlaubt keine); Höhenanimation (DG-E-14);
Auftritt beim Scrollen (E-13); Zebrastreifen und Hover-Füllung von Zeilen (nicht bedienbar).

## E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Komposition und Forschung (RE E1–E3; Q34), nicht gemessen.

- **Primärer Fokus:** die Zusammenfassung (größte Schrift des Blocks, 17/700, einzige bedienbare Zeile, zwischen zwei Haarlinien).
- **Sekundärer Fokus:** „Vorläufige Preise.“ am Satzanfang (fett, `--text` gegen `--text2`).
- **Reihenfolge am Telefon:** Kartenende → Verkaufsstand → Zusammenfassung mit „+“ → Kennwort und grüne Haken des Festblocks. Geöffnet: Kopf
  → Gruppenkopf → Titel → Werte von links nach rechts; das Auge springt über den Tonwert („nicht enthalten“ grau, Werte hell). So werden die
  zwei Achsen sichtbar: Essential fällt bei „Ihre Marke“ ab, Signature hebt sich bei „Für Ihr Team“ und „Daten“ ab.
- **Schreibtisch:** Verkaufsstand links unter den Karten → Zeile über die volle Breite → geöffnet Spaltenköpfe → Zeilen.
- **Kontraste:** `--text` auf `--ground` ≈ 16 : 1, `--text2` ≈ 11 : 1, `--muted` ≈ 5,8 : 1, Zeichen (2 px `--text2`) ≥ 3 : 1; Haarlinien sind
  Schmuck, die Bedienbarkeit tragen Text und Zeichen.
- **CTA:** Der Block hat keinen und keine Cream-Fläche (die nächste: „Frage senden“ in `fb-09`). Ist die Reihe zu weniger als 50 % im Bild,
  erscheint der Kopf-Ring „Paket anfragen“ wieder (J-AB-9): einziger Knopf im Bildschirm, als Ring, in Leserichtung zum Formular.
- **Ablenkungen:** (1) Die grünen Haken des Festblocks ziehen stärker als die Zeile, gewollt: Risiko vor Detail. (2) Geöffnet schiebt die
  Länge Festblock und Gesprächsweg weit nach unten; Gruppen, Kopf und Fußsatz als klares Ende mildern das. (3) Der Verkaufsstand kann
  überlesen werden (H-07-2).
- **Übergang:** untere Haarlinie → 48 px Grund → Kennwort „VERTRAG IN KÜRZE“ in derselben Technikstimme wie die Gruppenköpfe → Haken.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Verfahren | Weniger Bewegung |
|---|---|---|---|---|
| Scrollen | keine Bewegung; geöffnet klebt der Tabellenkopf | – | CSS `position: sticky` | gleich |
| Tipp, Klick, Enter, Leertaste auf die Zusammenfassung | öffnet; Höhe sofort, Inhalt Deckkraft 0 → 1 (wie die Fragen, DG-E-14 A) | 220 ms (`--t2`), `cubic-bezier(.2, 0, 0, 1)` (`--kurve-ein`) | `details`; `@keyframes` auf `.vk-vgl-inhalt` unter `[open]` | sofort |
| dito | „+“ wird „–“: senkrechter Strich Deckkraft 1 → 0, kein Drehen (G1) | 150 ms (`--t1`) | Übergang auf `opacity` | sofort |
| Schließen | Inhalt weg, „–“ wird „+“; Seite bleibt stehen (Scroll-Verankerung) | 150 ms | nativ | gleich |
| Hover (`pointer: fine`) | untere Haarlinie `--line2` → `--muted`, Zeichen `--text2` → `--text` | 160 ms, `--kurve-ein` | Übergang auf Farbe | gleich |
| Drücken | Fläche `--surface`; keine Skalierung (SG 10.7/3) | 150 ms | `:active` | gleich |
| Fokus | 2 px `--text`, Abstand 2, Radius 12 | – | `:focus-visible` | gleich |
| Link auf `#vergleich` in der Wurzel | öffnen, dann die Zeile an den Bildschirmanfang rollen, Hash unverändert (in `/#fensterbauer` gehört er der Ansicht) | Browser-Glättung | `scrollIntoView({block: 'start'})` in `Verkauf.auf`, Merker `det.__vkAn` | `behavior: 'auto'` |
| Adresse mit `#vergleich` (eigenständige Seite) | beim Binden öffnen | – | dito | – |

**Charakteristik.** Still: Nichts bewegt sich ohne Tipp, die Bedienschicht wechselt nur Zustände; Trägheit und Feder bleiben dem Beispielbild
in `fb-06`. Kein Selbstlauf. **Ohne JavaScript:** `details` nativ, Kopf klebt per CSS, alles lesbar; nur das Öffnen per Link entfällt.

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition).** Titel über die volle Breite, Werte darunter in drei 116-px-Spalten unter einem klebenden
Kopf aus drei Kurznamen, deckungsgleich mit der Namensleiste; kein Querscrollen, auch geöffnet. **360 px:** Spalten ≈ 106 px; „nicht
enthalten“ (≈ 104 px bei 15/500, geschätzt) passt knapp, sonst bricht es sauber um. **Höhe 664:** zugeklappt steht der ganze Block mit
Kartenende und Festblock-Anfang im Bild; geöffnet bleiben 564 px für Zeilen. **Querformat 844 × 390:** vierspaltige Tabelle, Kopf bei 56.

**Schreibtisch 1280 × 800.** Verkaufsstand in Spalten 1–8, Zeile über 1–12, vierspaltige Tabelle mit 44-px-Zeilen; nichts größer als 17 px
(SKILL:28). **1024 × 768:** dieselbe Struktur in 944 px, Werte bei Bedarf zweizeilig. **640–1023 px:** vierspaltig, Kopf bei 56.

**Einbettung `/#fensterbauer`.** Identisch; Kopfhöhe aus `--kopf-h`; Bindung idempotent bei jedem `Verkauf.auf`; offen oder zu wird nicht
gespeichert. **200 % Text, 400 % Zoom:** Zellen brechen um, der Kopf darf zweizeilig werden, kein Querscrollen.

## H. Technische Umsetzung

| Datei | Teil | Änderung |
|---|---|---|
| `functions/pakete-seite.js` | `hinweis()` 86–91, `karten()` 130 | teilen: `preisstand(v)` liefert nur den Satz aus B als `<p class="vk-preisstand">` (leer ohne `VORLAEUFIG`), nicht mehr vor der Reihe; `bald(v)` geht an `fb-09` (I-4) |
| | `vergleich()` 133–140 | Konstante `GRUPPEN`; Restgruppe „Weitere“ für künftige Merkmale mit `vergleich: true`, damit nie ein Pflichttitel fehlt; `vglText()`; versteckte `<caption>`; Kopf `<th scope="col" id="vgl-…">`; je Gruppe ein `<tbody>` mit `<th scope="rowgroup" colspan="4">`; Zeilentitel `<th scope="row">`; Werte `<td headers="…">`; „In allen Paketen“ `<td colspan="3">`; Schalter `ERSTES_JAHR`; Fußsatz wörtlich; ohne `data-k` |
| | `BLOECKE` | Baustein `preisstand` (der Name `stand` ist in den Paketbedingungen belegt) |
| `web/fuer-fensterbauer/index.html` | 174, 182–187 | Kasten entfernen; `<!--pakete:preisstand-->…<!--/pakete:preisstand-->` zwischen `<!--/pakete:karten-->` und `<details>`; `details.vk-vergleich-auf` ohne `rg-frage`; Inhalt in `div.vk-vgl-inhalt`; danach `node scripts/bedingungen-pdf.mjs` |
| `web/assets/verkauf.css` | 114, 453–454 | Regeln nach C und F; `.rg .rg-tab.vk-vergleich` hebt `ratgeber.css:59-74` auf (Hintergrund, Ring, Radius, `overflow: hidden`, `data-k`-Liste) |
| `web/assets/verkauf.js` | `Verkauf.auf` | Öffnen per Link und Adresse; im Rückfall die Rollen |
| `scripts/pruefen-instanzen/29.mjs` | 29.1 (31–33), 29.2 | zwei Muster anpassen (unten); neu: Gruppenköpfe vorhanden, „In allen Paketen“ in allen drei gleich, Telefon ohne Querscrollen mit geöffnetem Vergleich |

**Anpassung der Prüfsuite – Freigabe durch den Inhaber nötig.** `/<table class="rg-tab vk-vergleich">/` wird `/<table
class="rg-tab vk-vergleich"[^>]*>/`, und `'<td>' + t + '</td>'` wird ein Muster auf `<th scope="row"…>t</th>`. Grund: Als Raster dargestellt,
braucht die Tabelle echte Zeilenköpfe und Rollen (`table`, `rowgroup`, `row`, `columnheader`, `rowheader`, `cell`) im ausgelieferten HTML.
**Rückfall bis zur Freigabe:** Bestandsmarkup (Tabelle ohne weiteres Attribut, Zeilentitel als `<td>`), die Rollen setzt `verkauf.js`.

**CSS-Techniken.** Grid für `tr`; `position: sticky` am `thead`; Umbruch bei 640 px; `@media (pointer: fine)`; `prefers-reduced-motion: reduce`
(keine Einblendung); `prefers-contrast: more` (Haarlinien `--muted`); `forced-colors: active` (Striche als `border` in `CanvasText`); Tokens mit
Rückfallwert, z. B. `var(--kurve-ein, cubic-bezier(.2, 0, 0, 1))`, solange B.5 nicht in `gemeinsam.css` steht.

**Assets.** Keine; nur Variante H-07-5 nutzt die Miniatur 96 × 72 aus 10.4 H (per Skript aus dem Beispielbild).

**Animationstechnik.** Stufe 1 „Leicht“ (SKILL, Abschnitt 3): ein Keyframe auf `opacity`, Übergänge auf Farbe, wenige Zeilen JavaScript nur
für das Öffnen per Link. Grund: Entscheidungsfläche der Stufe 1 (Dosierregel 1).

**Leistung.** ≈ 20 Tabellenzeilen, zugeklappt nicht gerendert, keine Bilder, keine Schleifen; INP: Umschalten ohne Skript; CLS: Öffnen ist
nutzerausgelöst. Risiko: In der Einbettung klebt der Kopf nicht, wenn ein Vorfahr in `portal` `overflow` setzt; prüfen, sonst `overflow: clip`.

**Barrierefreiheit.** `details`/`summary` nativ; Zeichen als Pseudo-Element ohne Text; Spaltenköpfe mit verstecktem „EEZI “ ergeben den vollen
Paketnamen; Zeilen- und Gruppenköpfe; „nicht enthalten“ als Text, nicht nur Farbe; Fokus nie unter dem Seitenkopf (`scroll-padding-top:
calc(var(--kopf-h) + 12px)`); die Tabelle hat keine Fokusziele, der klebende Kopf verdeckt also keinen Fokus; Ziel 52 px.

**Abweichungen** – jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall | geführt als |
|---|---|---|---|---|---|
| J-AB-5 | „Vorläufige Preise“ als Kasten mit Warnstrich über den Karten (GEST:453) | ein Satz 15 unter der Reihe | Vorbehalt kleiner als die Preise (AB-4); Widerspruch zu PB:55 | Kasten, kleiner | 10.4 H |
| J-AB-7 | Vergleich ungegliedert (GEST:454) | sieben Gruppen, „in allen drei“, „nicht enthalten“ | Überfliegbarkeit (Q34); Pflichtzeilen bleiben | ungegliedert | 10.4 H |
| I-AB-1 | Tabelle „mit `data-k` wie im Ratgeber“ (GEST:454) | Telefon: klebender Kopf, Werte in drei Spalten | Werte einer Zeile nebeneinander statt dreimal untereinander; etwa halb so lang; R9 | `data-k`-Liste | neu |
| I-AB-2 | `details` „als Karten, 48 px“ (GEST:435) | Zeile mit Haarlinien, 52 px | wie bei den Fragen | Karte | DG-AB-19 |

Das Erscheinen beim Scrollen (GEST:451) entfällt nach E-13 (DG-AB-2).

## I. Conversion-Begründung

- **Position.** Die Frage „welches genau?“ entsteht an den Karten; die Antwort steht direkt darunter, vor Risiko (Festblock) und Handlung
  (Formular), alles in Leserichtung (E-4). Wer entschieden ist, überspringt ≈ 146 px.
- **Gestaltung.** Zugeklappt kostet der Vergleich eine Zeile; der Vorbehalt ist ehrlich, aber kleiner als jeder Preis (J-R18). Geöffnet machen
  Gruppen und Tonwert die zwei Achsen des Angebots sichtbar (J-R10), ohne eine Spalte hervorzuheben; „Für Ihr Team“ zeigt bei Essential und
  Plus „nicht enthalten“ und führt so ehrlich zum höheren Paket (SKILL:50).
- **Informationsmenge.** Zugeklappt etwa 20 Wörter, geöffnet 20 Zeilen auf Abruf. Merkmalsfülle verstärkt bei unklarer Präferenz die
  Überforderung (Q3), deshalb gegliedert, das Gemeinsame in einer Zelle, Werte kurz; Pflichtangaben bleiben vollständig (Prüfsuite 29.1).
- **Zielhandlung.** Z1a bzw. Z1 über Festblock und Formular direkt darunter; Z1+ über die sichtbare Team- und Datenachse; keine Lockvögel, keine
  Knappheit (R7). Wer unsicher bleibt, trifft darunter auf den Gesprächsweg.
- **Zu testende Annahmen** (Prüfwege nach 10.5.2; keine erwarteten Größen):

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H-07-1 (= J-H3) | Der gruppierte Vergleich wird am Telefon schneller und richtiger gelesen | Lesetest „Was bekommen Sie mit Signature zusätzlich?“ | ungegliedert, Gruppen als Zwischenzeilen |
| H-07-2 | Der Verkaufsstand unter der Reihe wird vor der Wahl bemerkt | Lesetest „Sind die Preise endgültig?“ | „· vorläufig“ zusätzlich in der Steuerzeile jeder Karte |
| H-07-3 | „Richtwerte“ beantwortet F-26, ohne abzuschrecken | Gespräche; Fragen im Formular nach Thema | Gruppe entfällt, nur PB § 2 (2) |
| H-07-4 | Der klebende Kopf hält die Spaltenzuordnung bis zur letzten Zeile | Lesetest „Was gilt bei Plus für die Aufbewahrung?“ | Kurzname 13 über jedem Wert |
| H-07-5 | Miniaturen der Beispielbilder (48 × 36) im Kopf am Schreibtisch verbinden Tabelle und Karten | Sichtprüfung des Inhabers | ohne (Grundfassung) |
| H-07-6 | Wer unsicher ist, findet und öffnet die zugeklappte Zeile | Telefon-Video mit Aufgabe „Unterschied Plus und Signature“ | Hinweis 15 „Unterschiede in sieben Gruppen“ in der Zeile (**Textentwurf**) |
| J-H4 | „Erstes Jahr“ senkt Rückfragen zu Kosten, ohne Anfragen zu senken | vorher/nachher: Anfragen je Aufruf, Rückfragen | `ERSTES_JAHR` aus |

**Offen beim Inhaber:** J-O-2, J-O-11, J-AB-5, J-AB-7, I-AB-1, I-AB-2, die Anpassung der Prüfsuite und die Gruppe „Richtwerte“ (I-2).

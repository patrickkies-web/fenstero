# 04.2 Entscheidungshilfe, Vergleich, Verkaufsstand (#vergleich)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 7 von 15 (Block 04.2, nach `fb-06-pakete-karten`, vor `fb-08-festblock-gespraechsweg`) · Intensitätsstufe: 1 ruhig (Typ T7, Textteil)

Phase I, Stand 24.10.2026, Planungsdokument (nichts gebaut). Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) und
[10-paketentscheidung.md](../10-paketentscheidung.md); VK = `web/fuer-fensterbauer/index.html`, PB = `web/konfigurator-bedingungen/index.html`.
**[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I-n** = Entscheidung dieser Spezifikation mit Begründung. Für Pakete,
Preise und Paketwahl gilt 10 vor ZA. Alle Pixellagen sind geplant, nicht gemessen.

---

## A. Abschnitt und Funktion

- **Name:** Block 04.2 in Kapitel 04 „Ihre Marke“, ohne eigene Überschrift. Zwei Elemente: der **Verkaufsstand** (ein Satz) und der
  **Vergleich** als `details` mit dem bestehenden Anker `#vergleich` (VK:182).
- **Festlegung I-1 (folgt Festlegung 10-1):** Die Entscheidungshilfe in drei Zeilen aus ZA 04.2 entfällt in diesem Block; ihr Inhalt steht
  als „Wenn“-Satz in jeder Karte (`fb-06`). Gründe: ein Mechanismus statt zwei (EV 7.5.4); die drei Zeilen aus ZA verlinken zurück auf die
  Karten, also gegen die Leserichtung (E-4); jede Zeile kostet am Telefon 44 px. Ohne JavaScript bleibt die Hilfe erhalten, weil die Karten
  dort untereinander mit ihren Sätzen stehen. Der Abschnittsname bleibt, damit die Nummerierung von ZA gilt.
- **Position:** direkt unter der Kartenreihe, Telefon ≈ 1.180 px unter dem Sprungziel `#pakete` (bei 664 px Bildschirm 7–8), Schreibtisch
  ≈ 1.200 px darunter (Leistungslisten offen, geschätzt). Davor die Kartenreihe (Stufe 2, Beispielbilder), danach der Festblock (Stufe 1,
  grüne Haken). Rhythmus 2 · 1 · 1 (DG 2.3.17/6).
- **Ziel:** unsichere Präferenz auflösen, ohne zweiten Mechanismus: Wer zwischen zwei Paketen schwankt, liest die genauen Unterschiede auf
  Abruf; wer entschieden ist, geht an einer zugeklappten Zeile vorbei. Der Preisvorbehalt steht ehrlich und kleiner als jeder Preis (J-R18).
- **Beantwortete Nutzerfragen:** „Was unterscheidet die Pakete genau?“ (F-23) · „Sieht mein Kunde eeziframes?“ (F-24, Zeile „Hinweis auf
  eeziframes in der App“) · „Wie viele Anfragen und KI-Auswertungen sind drin?“ (F-26, Gruppe „Richtwerte“) · „Sind die Preise endgültig?“
- **Vorbereitete Entscheidung:** Paketwahl bei unsicherer Präferenz. Die Handlung danach liegt in Leserichtung: Festblock, Gesprächsweg mit
  Paket „Noch offen“ oder Formular (`fb-08`, `fb-09`); kein Weg zurück nach oben (E-4).

## B. Konkreter Inhalt

**Verwendete Inhalte**

| Element | Inhalt | Fundstelle | Art |
|---|---|---|---|
| Verkaufsstand, solange `VORLAEUFIG` | „**Vorläufige Preise.** Preisstand 22. Oktober 2026. Es gilt der Preis, den Sie beim Bestellen sehen.“ | `web/assets/pakete.js:15-17` (`PREIS_STAND`, `VORLAEUFIG`); PB:52; J-R18; Datum über `standText()` (`functions/api/recht.js:23-26`) | **Textentwurf**; Punkt statt Komma nach „Vorläufige Preise“, weil Prüfsuite 29.2 `<b>Vorläufige Preise.</b>` verlangt (`scripts/pruefen-instanzen/29.mjs:46`) |
| Verkaufsstand, `VORLAEUFIG = false` | entfällt samt Abstand | ZA 8.3.2 d) | – |
| Zusage „bleibt für Ihren Vertrag fest“ | entfällt, bis J-O-2 sie bestätigt; sonst Widerspruch zum Änderungsvorbehalt PB:55 | `functions/pakete-seite.js:89` | Bestand gestrichen |
| Zusammenfassung | „Alle Merkmale im Vergleich“ | VK:182; J-R19 | Bestand |
| Tabellenkopf | „Essential“ · „Essential Plus“ · „Signature“, davor jeweils versteckt „EEZI “ | `kurzname()`, `functions/pakete-seite.js:31` | Bestand |
| Tabellentitel für Vorleseprogramme | „Die drei Pakete im Vergleich“ | – | **Textentwurf** |
| Gruppenköpfe | „Kosten“ · „In allen Paketen“ · „Ihre Marke“ · „Gefunden werden“ · „Für Ihr Team“ · „Daten“ · „Richtwerte“ | J-R7; „Richtwerte“ aus ZA 04.2 (Festlegung I-2) | **Textentwurf** |
| Zeilentitel | wörtlich `MERKMALE[s].titel` | `web/assets/pakete.js:74-98`; Prüfsuite 29.1 verlangt jeden Titel mit `vergleich: true` | Bestand |
| Werte | aus `PAKETE` über `wertText()` mit den Anzeigeregeln unten | `web/assets/pakete.js:43-66`; `functions/pakete-seite.js:47-57` | Bestand, Anzeige **Textentwurf** |
| Satz zu den Richtwerten | „Richtwerte je Konfigurator. Erst bei deutlicher Überschreitung (KI das Doppelte, Anfragen das Vierfache) dürfen wir vorübergehend begrenzen; wir sprechen Sie darauf an.“ | PB:39 § 2 (2) | **Textentwurf** |
| Fußsatz | „Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.“ (ohne `MWST` die Fassung nach § 19 UStG, Bestand) | `functions/pakete-seite.js:139`; Prüfsuite 29.1 | Bestand wörtlich |

**Zeilen und Werte in dieser Reihenfolge** (Essential · Plus · Signature; „n. e.“ steht hier für „nicht enthalten“)

| Gruppe | Zeilentitel | Essential | Plus | Signature |
|---|---|---|---|---|
| Kosten | Monatlich, netto | 29 € | 39 € | 64 € |
| | Einrichtung, einmalig vorab | 99 € | 199 € | 279 € |
| | Erstes Jahr: Einrichtung und 12 Monate **[H]** (J-H4, Schalter `ERSTES_JAHR`) | 447 € | 667 € | 1.047 € |
| In allen Paketen | Eigene Domain · Voller Konfigurator · Anfrage per E-Mail mit PDF | je eine Zelle über drei Spalten: „in allen drei“ | | |
| Ihre Marke | Gestaltung | eeziframes-Design mit Ihrem Namen | in Ihrem Design | in Ihrem Design |
| | Ihr Logo · Ihre Firmenfarbe · Eigene Startseite | n. e. | ja | ja |
| | Fotos Ihres Betriebs | n. e. | bis 6 | bis 6 |
| | Hinweis auf eeziframes in der App | „Powered by EEZIframes“ | kleiner Hinweis im Fuß | keiner |
| Gefunden werden | In Suchmaschinen | nein | Startseite | Startseite |
| Für Ihr Team | Dashboard unter Ihrer Domain · Persönliche Einladungslinks · Fortschritt sehen | n. e. | n. e. | ja |
| | Zugänge zum Dashboard | n. e. | n. e. | 5 |
| Daten | Aufbewahrung der Anfragen | 30 Tage nach Zustellung | 30 Tage nach Zustellung | für die Vertragsdauer |
| Richtwerte | Anfragen am Tag | 50 | 50 | 100 |
| | KI-Auswertungen im Monat | 600 | 1.000 | 2.000 |

Jede mit „·“ verbundene Titelgruppe sind getrennte Zeilen: 19 Zeilen, davon 16 Merkmale mit `vergleich: true`, die zwei Preiszeilen, zwei
Richtwerte und optional „Erstes Jahr“. Die Zeile „Erstes Jahr“ wird aus `preis()` gerechnet (Einrichtung + 12 × Monat), nie eingetragen;
Grundfassung an, weil 10.1.4 sie vorsieht; sie entfällt mit dem Schalter ohne Lücke, wenn der Inhaber J-O-11 verneint.

**Anzeigeregeln** (neue Funktion `vglText()`; `wertText()` bleibt unverändert für die Paketbedingungen):
1. ja/nein-Merkmal falsch und Zahl 0 → „nicht enthalten“ (J-R7). Der Auswahlwert „nein“ bei „In Suchmaschinen“ bleibt „nein“, wie im
   Datenblatt der Karte (10.4 B).
2. `fotos` mit Wert n → „bis n“, wie in `punkte()` (`functions/pakete-seite.js:71`).
3. Zahlen und Beträge ab 1.000 mit Tausenderpunkt („1.000“, „1.047 €“); `geld()` setzt ihn heute nicht.
4. Gruppe „In allen Paketen“: eine Zelle über drei Spalten mit „in allen drei“. Gruppe „Richtwerte“: der Zusatz „ (Richtwert)“ im Titel
   entfällt, weil der Gruppenkopf ihn trägt.

**Festlegung I-2 – Gruppe „Richtwerte“.** ZA 04.2 nennt sie und ordnet F-26 diesem Block zu; J-R7 zählt die Gruppen für die Pflichtzeilen
der Prüfsuite auf und schließt weitere nicht aus. Rückfall: Gruppe entfällt, Richtwerte nur in PB § 2 (2) (H-07-3).

**Festlegung I-3 – keine weiteren zusammengelegten Zellen.** Ein über Plus und Signature gezogenes „ja“ steht links in der Plus-Spalte;
die leere Signature-Spalte daneben läse sich als fehlender Wert. Den Unterschied trägt der Tonwert („nicht enthalten“ grau, Werte hell).

**Festlegung I-4 – „Bestellung bald möglich“ gehört zu `fb-09`.** EA:325 und ZA 05 setzen diesen Satz an das Formular. `hinweis()` wird
deshalb geteilt (H); `fb-09` muss das Literal tragen, das Prüfsuite 29.2 in Zustand A verlangt (`29.mjs:46`), sonst ist 29.2 anzupassen.

**Nicht in diesem Block:** Laufzeit, Storno, Vertrag ab Zahlung (Festblock `fb-08`, J-R16); Gesprächsweg (`fb-08`); Leistungsliste je Karte
(`fb-06`); Empfehlung (nur in der Karte, J-R8).

**Erforderliche Interaktionen:** Zusammenfassung öffnen und schließen (Tipp, Klick, Enter, Leertaste); lesen mit klebendem Tabellenkopf;
Öffnen über einen Link auf `#vergleich`. In der Tabelle gibt es keine Links, Knöpfe oder Auswahl.

**Nutzbare vorhandene Komponenten:** `vergleich()` (`functions/pakete-seite.js:133-140`), `hinweis()` (86-91), `wertText()` (47-57),
`kurzname()` (31), `geld()` (30), `steuerText()` (44), `verkaufFuer()` (40-43), Baustein-Mechanik `<!--pakete:NAME-->` mit `BLOECKE`
(255-258); `details.rg-frage` (`web/assets/ratgeber.css:128-133`) als Ausgangspunkt, `.rg-tab` (59-74, wird überschrieben),
`.vk-vergleich-auf` (`web/assets/verkauf.css:453-454`); Daten `PREIS_STAND`, `VORLAEUFIG`, `PAKETE`, `MERKMALE` (`web/assets/pakete.js`).

## C. Exakte Layoutkomposition

**Grundstruktur.** Lesestapel → Handlung (G2 ohne eigenen Kopf und Held; der Kopf ist der von Kapitel 04). Ein Satz, darunter eine Zeile,
die aufklappt; geöffnet eine Tabelle direkt auf dem Grund, ohne Karte. Ordnungslinie ist die linke Spaltenkante (G5). Asymmetrisch, alles
linksbündig; einzige Marke am rechten Rand ist das Zustandszeichen „+“.

**Ebenen.** Z 0 Grund `#161616` → Z 30 Satz, Haarlinien, Zeile, Tabelle; der klebende Tabellenkopf liegt innerhalb von Z 30 eine Stufe über
den Zeilen (`z-index: 1`) → Z 40 Seitenkopf. Drei unterscheidbare Ebenen (Grund, Linie, Schrift), wie T9. Verdeckung: Der klebende
Tabellenkopf überdeckt die durchlaufenden Zeilen; der Seitenkopf liegt über beidem (DNA Nr. 2).

**Telefon 390 × 844, zugeklappt** (x 16–374, über alle 4 Spalten; y ab der Unterkante der Karte)

| y (px) | Element | Maß | Schrift, Farbe |
|---|---|---|---|
| 0 | Unterkante der Karte (`fb-06`) | – | – |
| 24–68 | Verkaufsstand, zwei Zeilen | 358 × 44 | 15/22 `--text2`; „Vorläufige Preise.“ 700 `--text` |
| 92 | Haarlinie | 358 × 1 | `--line2` |
| 93–145 | Zusammenfassung; Text ab x 16; „+“ 24 × 24 bei x 350–374, Mitte y 119 | 358 × 52 | 17/700 `--text`; Zeichen `--text2` |
| 145 | Haarlinie | 358 × 1 | `--line2` |
| 194 | Kennwort „VERTRAG IN KÜRZE“ von `fb-08` | – | – |

Zugeklappt ≈ 146 px ≈ 0,17 BH (ZA plant 0,25). Bei 390 × 664 stehen Kartenende, der ganze Block und der Anfang des Festblocks zugleich im
Bild, sobald die Kartenunterkante bei y ≈ 250 liegt.

**Telefon, aufgeklappt** (y ab der unteren Haarlinie der Zusammenfassung)

| y (px) | Element | Maß |
|---|---|---|
| 16–60 | Tabellenkopf: drei Zellen 116 × 44 mit 5 px Abstand, deckungsgleich mit den Segmenten der Namensleiste (10.4 C); Kurzname 15/700 `--text`, links in der Zelle, senkrecht mittig; Grund `--ground` deckend; Haarlinie unten `--line2`; klebt bei `top: 56px` | 358 × 44 |
| 76–94 | Gruppenkopf „KOSTEN“, Technikstimme 13/600, Versalien, Sperrung 0,12 em, `--muted` | 358 × 18 |
| 102–164 | Zeile: Innenabstand 8 oben; Titel 15/600 `--text` über die volle Breite; 2 px; Werte 15/500 in den drei Spalten (Textbreite 108 px, 8 px frei rechts); 8 unten; Haarlinie `--line` unten | 358 × 62 |
| – | weitere Zeilen; mehrzeilige Werte wachsen um je 22 px (Gestaltung dreizeilig: 106 px; Hinweis, Aufbewahrung zweizeilig: 84 px) | – |
| – | zwischen Gruppen 24 px, Gruppenkopf, 8 px | – |
| – | „In allen Paketen“: Zeile einzeilig, Titel in Spalte 1–2 (237 px), „in allen drei“ 15 `--text2` in Spalte 3; Innenabstand 9/9 | 358 × 40 |
| – | nach den Richtwerten der Satz dazu, 15 `--muted`, drei Zeilen, 8 px Abstand | 358 × 66 |
| Ende | 24 px, Fußsatz 15 `--muted`, zwei Zeilen; danach 48 px bis `fb-08` | 358 × 44 |

Aufgeklappt ≈ 1.830 px ≈ 2,2 BH (Kopf 60, sieben Gruppenköpfe ≈ 350, 19 Zeilen ≈ 1.290, Richtwerte-Satz 74, Fußsatz 68). Das ist lang,
steht aber nur auf Abruf, ist gegliedert, und der Kopf hält die Spaltenzuordnung.

**Größenhierarchie.** Nur die Klein-Stufe 13–17 (DG 2.2.18): Zusammenfassung 17, Satz, Titel und Werte 15, Gruppenköpfe 13. Abstufung über
Gewicht (700 / 600 / 500) und Tonwert (`--text` / `--text2` / `--muted`), als Lese- und Arbeitsfläche nach DG-E-1 C. Kein 24, 32 oder 40;
ein nicht-textliches Hauptelement fehlt bewusst (ZA: „Held: keiner“). Im selben Bildschirm steht meist noch das Ende der Karte mit
Datenblatt oder Beispielbild darüber.

**Verhältnisse.** Zugeklappt, Bildschirm 844 mit Kartenende oben, Block und Festblock-Anfang: Text ≈ 20 %, Zeile und Haarlinien ≈ 7 %, freier
Grund ≥ 60 %. Abstände 8 (in der Gruppe) : 24 (zwischen Elementen) : 48 (zum nächsten Block) = 1 : 3 : 6 (G6).

**Schreibtisch 1280 × 800** (12 Spalten zu 64,67 px, Abstand 24, Spalte 1040 ab x 120; y ab der Unterkante der Kartenreihe)

| y (px) | Element | Spalten | x |
|---|---|---|---|
| 24–68 | Verkaufsstand (bei 1280 meist zweizeilig), `max-width: 64ch` | 1–8 | 120–805 |
| 92–145 | Zusammenfassung zwischen zwei Haarlinien; „+“ rechts | 1–12 | 120–1160; Zeichen 1136–1160 |
| aufgeklappt +16 | Kopf 44 px, klebt bei `top: 64px`: erste Zelle leer (versteckt „Merkmal“), dann Kurznamen 15/700 | 1–3 · 4–6 · 7–9 · 10–12 | 120 · 386 · 652 · 918 |
| danach | Gruppenköpfe über 1–12; Zeilen 44 px (Innenabstand 11/11), Titel 15/600 in 1–3, Werte 15/500 je 3 Spalten; „in allen drei“ über 4–12; Richtwerte-Satz und Fußsatz in 1–8 | – | – |

Aufgeklappt ≈ 1.350 px ≈ 1,7 BH. Die Paketspalten fluchten nicht mit den Karten (je 4 Spalten), weil die Beschriftung drei Spalten braucht
(10.4 C); die Reihenfolge von links nach rechts ist dieselbe.

**1024 × 768.** Spalte 944 ab x 40, Spalten 56,67 px; Beschriftung und Pakete je 218 px; Kopf klebt bei 64; „eeziframes-Design mit Ihrem
Namen“ zweizeilig.

**Position interaktiver Komponenten.** Genau eine: die Zusammenfassung über die volle Breite, 52 px hoch, Text an der Ordnungslinie, Zeichen
rechts. Steht der Block in der Bildschirmmitte, liegt die Zeile im mittleren Daumenbereich.

**Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Tabelle unter 640 px | `table`, `thead`, `tbody` als Block, `tr` als Raster `repeat(3, minmax(0, 1fr))`, `column-gap: 5px`; Titel `grid-column: 1 / -1`; Zelle mit `colspan="3"` `grid-column: 1 / -1` bzw. bei „In allen Paketen“ Titel `1 / 3`, Wert `3` | drei Pakete, drei Spalten; deckungsgleich mit der Namensleiste; kein Querscrollen (R9) |
| Tabelle ab 640 px | `tr` als Raster `repeat(4, minmax(0, 1fr))`, `column-gap: 24px` | ergibt 242 px bei 1040 und 218 px bei 944, je 3 von 12 Spalten |
| Abweichung vom 4-Spalten-Raster (Telefon) | Werte in drei Spalten zu 116 px | funktional: drei Pakete; das Raster bleibt Außenmaß (358 px) |
| Zeilen | Telefon 8/8, Schreibtisch 11/11, Zeilenhöhe 22 | ≥ 44 px am Schreibtisch, kompakt am Telefon |
| Klebender Kopf | `position: sticky; top: var(--kopf-h)` (56 / 64), Grund `--ground`, Haarlinie `--line2` | Kopfhöhe nach `rh-01-kopf` |
| Zusammenfassung | `min-height: var(--h2)` (52), links ohne Innenabstand, Haarlinien `--line2` oben und unten | T9; DG-AB-19 |
| Zustandszeichen | 24 × 24, zwei Striche 14 × 2 px als `border` in `currentColor` (`--text2`) | Bestand ist ein grünes Schriftzeichen (`ratgeber.css:131`); Grün bleibt Signal (G8) |
| Abstände | 24 / 24 / 48 | 10.4 C |
| Verkaufsstand | 15/22, `max-width: 64ch` | ≤ 75 Zeichen je Zeile |
| Umbruch in Zellen | `hyphens: auto; overflow-wrap: break-word` (Seite hat `lang="de"`) | 116-px-Zellen, 200 % Text |
| Ziffern | `font-variant-numeric: tabular-nums` | „Ziffern in Reih und Glied“ (DR 1, Nr. 4) |
| Überlauf | kein `overflow: hidden` an Tabelle und Vorfahren; wo nötig `overflow: clip` | sonst klebt der Kopf nicht; `.rg-tab` setzt heute `overflow: hidden` (`ratgeber.css:59`) |

Gegenüber der DNA keine Abweichung: Stufe 1 erlaubt 0–20 % Bild und verlangt ≥ 33 % freie Fläche (DG 2.4.2).

## D. Anwendung der Design-DNA

Stufe 1 „ruhig“, Dialekt C (flach); keine Signature, weder informierend noch inszenierend (DG 2.4.2; Dosierregel 1).

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Position | Wirkung und Beitrag zur Funktion |
|---|---|:-:|---|---|
| Tiefe, Z-Achse | drei Ebenen; einzige Verdeckung: klebender Tabellenkopf über den Zeilen, Seitenkopf darüber | 1 | Tabellenkopf | Spaltenzuordnung bleibt beim Lesen sichtbar; Raum ohne Effekt |
| Material, Transparenz | keines; Kopf deckend, kein Glas (Glas nur über Bildinhalt, DG 2.4.1) | 0 | – | Lesbarkeit vor Wirkung |
| Licht, Schatten | keines, auch keine Lichtkante | 0 | – | das Licht gehört V1 und 02; nichts konkurriert mit der Entscheidung |
| Formen | Haarlinien 1 px; Zeile ohne Fläche und Rundung; Fokusrahmen Radius 12 (DG-AB-8) | 1 | Zeile, Tabelle | eine Linie ordnet ohne Fläche (SG 10.5/5) |
| 3D-Objekte | keine | 0 | – | – |
| Bildintegration | keine Bilder im Block; das Beispielbild der Karte steht darüber | 0 | – | Bild zeigt (fb-06), Tabelle benennt |
| Oberflächendetails | Technikstimme für Gruppenköpfe, gleich breite Ziffern, Zustandszeichen aus zwei 2-px-Strichen | 1 | Tabelle, Zeile | „präzise wie ein Aufmaß“ (DR 1) |
| Animation | Öffnen über Deckkraft 220 ms; „+“ wird „–“ über Deckkraft 150 ms | 1 | Zeile | Rückmeldung ohne Bewegung der Bedienschicht (G1) |
| Typografie | Klein-Stufe 13–17, Gewicht und Tonwert als Stufen | 1 | ganze Fläche | überfliegbar (Q34); Unterschiede über Tonwert lesbar |
| Überlagerungen | nur der klebende Kopf | 1 | Tabellenkopf | Orientierung |
| Perspektive | keine | 0 | – | frontal (DNA Nr. 1) |
| Interaktive Effekte | Hover = Kontur und Farbe, aktiv = Füllung `--surface`, Fokus 2 px | 1 | Zeile | ein Kanal je Zustand wie überall (SG 10.7/8) |

**Verbindliche Merkmale:** frontale, flache, matte Bedienschicht ohne Licht (Nr. 1, 9, 10), ein Formsystem (Nr. 5), Ordnungslinie (Nr. 3),
kein Schatten (Nr. 6), Negativraum (Nr. 8), ruhiger Grund (Nr. 11), Tiefe über Verdeckung (Nr. 2). **Variable Merkmale:** Zustandskanal
Kontur/Füllung, Hierarchie über Tonwert statt Maßstab (DNA Nr. 7, Ausnahme wie Ref 01).

**Bewusst weggelassen:** Kartenfläche um den Vergleich (DG-AB-19); Kasten oder Warnfarbe am Verkaufsstand (J-AB-5); grünes „+“; Hervorhebung
der empfohlenen Spalte (die Empfehlung lebt in der Karte, J-R8; ein zweites Signal wäre ein zweiter Mechanismus); Haken-Grafiken in Zellen
(Grün bleibt Signal, Text trägt); zusammengelegte Zellen außer „in allen drei“ (Festlegung I-3); Maßkette über Spalten (wäre eine
informierende Signature, Stufe 1 erlaubt keine); Miniaturen im Kopf (nur Variante H-07-5); Höhenanimation (DG-E-14); Auftritt beim Scrollen
(E-13); Zebrastreifen oder Hover-Füllung von Zeilen (Zeilen sind nicht bedienbar).

## E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Komposition und Forschung (RE E1–E3; Q34), nicht gemessen.

- **Primärer Fokus:** die Zusammenfassung „Alle Merkmale im Vergleich“ (größte Schrift des Blocks, 17/700, einzige bedienbare Zeile,
  zwischen zwei Haarlinien).
- **Sekundärer Fokus:** „Vorläufige Preise.“ am Satzanfang (fett, `--text` gegen `--text2`).
- **Erwartete Reihenfolge am Telefon:** Kartenende (Datenblatt, „Leistungen ansehen“) → Verkaufsstand → Zusammenfassung mit „+“ → Kennwort und
  grüne Haken des Festblocks. Geöffnet: Kopf mit drei Namen → Gruppenkopf → Titel → Werte von links nach rechts; das Auge springt über den
  Tonwert („nicht enthalten“ grau, Werte hell). Dadurch werden zwei Achsen erwartet sichtbar: Essential fällt bei „Ihre Marke“ ab, Signature
  hebt sich bei „Für Ihr Team“ und „Daten“ ab.
- **Schreibtisch:** Verkaufsstand links unter den Karten → Zeile über die volle Breite → geöffnet Spaltenköpfe → Zeilen.
- **Kontraste:** `--text` auf `--ground` ≈ 16 : 1, `--text2` ≈ 11 : 1, `--muted` ≈ 5,8 : 1; Zustandszeichen `--text2` (2 px) ≥ 3 : 1;
  Haarlinien sind Schmuck, die Bedienbarkeit tragen Text und Zeichen.
- **CTA:** Der Block hat keinen; keine Cream-Fläche (die nächste ist „Frage senden“ in `fb-09`). Sobald die Reihe zu weniger als 50 % im Bild
  ist, erscheint der Kopf-Ring „Paket anfragen“ wieder (J-AB-9): einziger Knopf im Bildschirm, als Ring, und er führt vorwärts zum Formular.
- **Mögliche Ablenkungen:** (1) die grünen Haken des Festblocks ziehen stärker als die Zeile – gewollt, Risiko vor Detail; (2) der
  Kopf-Ring; (3) geöffnet schiebt die Länge (≈ 2,2 BH) Festblock und Gesprächsweg weit nach unten, gemildert durch Gruppen, klebenden Kopf
  und den Fußsatz als klares Ende; (4) der Verkaufsstand kann überlesen werden (H-07-2).
- **Übergang:** untere Haarlinie der Zeile → 48 px Grund → Kennwort „VERTRAG IN KÜRZE“ in derselben Technikstimme wie die Gruppenköpfe →
  Haken. Geöffnet endet die Tabelle mit dem Fußsatz, danach dieselben 48 px.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Verfahren | Weniger Bewegung | Begründung |
|---|---|---|---|---|---|
| Scrollen | keine Bewegung; geöffnet klebt der Tabellenkopf | – | CSS `position: sticky` | gleich | E-13 |
| Tipp, Klick, Enter, Leertaste auf die Zusammenfassung | öffnet; Höhe sofort, Inhalt blendet ein (Deckkraft 0 → 1) | 220 ms (`--t2`), `cubic-bezier(.2, 0, 0, 1)` (`--kurve-ein`) | `details`; `@keyframes` auf `.vk-vgl-inhalt` unter `[open]` | sofort | ZA 04.2; DG-E-14 A wie die Fragen |
| dito | „+“ wird „–“: senkrechter Strich Deckkraft 1 → 0 | 150 ms (`--t1`) | Übergang auf `opacity` | sofort | kein Drehen der Bedienschicht (G1) |
| Schließen | Inhalt weg; „–“ wird „+“ in 150 ms; die Seite bleibt stehen (Scroll-Verankerung des Browsers) | – | nativ | gleich | – |
| Hover (`pointer: fine`) | untere Haarlinie `--line2` → `--muted`, Zeichen `--text2` → `--text` | 160 ms, `--kurve-ein` | Übergang auf Farbe | gleich | Hover = Kontur (DG 2.4.1) |
| Drücken | Fläche `--surface` | 150 ms | `:active` | gleich | aktiv = Füllung; keine Skalierung (SG 10.7/3) |
| Fokus | 2 px `--text`, Abstand 2, Radius 12 | – | `:focus-visible` | gleich | SG 10.9 |
| Link auf `#vergleich` in der Wurzel | öffnen, dann die Zeile an den Bildschirmanfang rollen, ohne den Hash zu ändern | Browser-Glättung | `scrollIntoView({block: 'start'})` in `Verkauf.auf`, Merker `det.__vkAn` | `behavior: 'auto'` | in `/#fensterbauer` gehört der Hash der Ansicht (portal.js) |
| Aufruf mit `#vergleich` in der Adresse (eigenständige Seite) | beim Binden öffnen | – | dito | – | Anker funktioniert wie erwartet |

**Charakteristik.** Still: Nichts bewegt sich ohne Tipp, die Bedienschicht wechselt nur Zustände; Trägheit und Feder bleiben dem
Beispielbild in `fb-06` vorbehalten. Kein Selbstlauf, keine Pausenschaltfläche nötig. **Ohne JavaScript:** `details` arbeitet nativ, der Kopf
klebt per CSS, alles ist lesbar; nur das Öffnen per Link entfällt (der Anker springt dann zur zugeklappten Zeile).

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition).** Titel über die volle Breite, Werte darunter in drei 116-px-Spalten unter einem klebenden
Kopf aus drei Kurznamen, deckungsgleich mit der Namensleiste; Zusammenfassung 52 px; kein Querscrollen, auch geöffnet. **360 px:** Spalten
≈ 106 px; „nicht enthalten“ (≈ 104 px bei 15/500, geschätzt) passt knapp und bricht sonst sauber um; Kurznamen 15/700 (≈ 99 px) passen.
**Höhe 664:** zugeklappt steht der ganze Block mit Kartenende und Festblock-Anfang im Bild; geöffnet bleiben 664 − 56 − 44 = 564 px für Zeilen.
**Querformat 844 × 390:** ab 640 px Breite die vierspaltige Tabelle, Kopf klebt bei 56.

**Schreibtisch 1280 × 800.** Verkaufsstand in Spalten 1–8, Zeile über 1–12; vierspaltige Tabelle mit 44-px-Zeilen, geöffnet ≈ 1,7 BH; nichts
größer als 17 px (SKILL:28). **1024 × 768:** dieselbe Struktur in 944 px, Werte bei Bedarf zweizeilig. **640–1023 px:** vierspaltig in der
Inhaltsbreite, Kopf klebt bei 56.

**Einbettung `/#fensterbauer`.** Identisch; Kopfhöhe aus `--kopf-h` der Startseite; Bindung idempotent bei jedem `Verkauf.auf`; der Zustand
offen oder zu wird nicht gespeichert (nach Neuaufbau zu). **200 % Text und 400 % Zoom:** Zellen brechen um, kein Querscrollen; der Kopf darf
zweizeilig werden.

## H. Technische Umsetzung

**Bestehende Komponenten**

| Datei | Teil | Änderung |
|---|---|---|
| `functions/pakete-seite.js` | `hinweis()` 86–91 | teilen: `preisstand(v)` liefert nur den Satz aus B als `<p class="vk-preisstand">` (leer ohne `VORLAEUFIG`); `bald(v)` mit „Bestellung bald möglich“ geht an `fb-09` (Festlegung I-4) |
| | `karten()` 130 | gibt den Hinweis nicht mehr vor der Reihe aus |
| | `vergleich()` 133–140 | neu nach B: Konstante `GRUPPEN` mit Merkmalschlüsseln; eine Restgruppe „Weitere“ nimmt künftige Merkmale mit `vergleich: true` auf, damit nie ein Pflichttitel fehlt; `vglText()`; `<caption>` versteckt; Kopf `<th scope="col" id="vgl-…">`; je Gruppe ein `<tbody>` mit `<tr><th scope="rowgroup" colspan="4">`; Zeilentitel `<th scope="row">`; Werte `<td headers="…">`; „In allen Paketen“ `<td colspan="3">`; Schalter `ERSTES_JAHR`; Fußsatz wörtlich; ohne `data-k` |
| | `BLOECKE` | neuer Baustein `preisstand` (der Name `stand` ist in den Paketbedingungen belegt) |
| `web/fuer-fensterbauer/index.html` | 174, 182–187 | Kasten entfernen; `<!--pakete:preisstand-->…<!--/pakete:preisstand-->` zwischen `<!--/pakete:karten-->` und `<details>`; `details` mit Klasse `vk-vergleich-auf` ohne `rg-frage`; Inhalt in `<div class="vk-vgl-inhalt">`; danach `node scripts/bedingungen-pdf.mjs` |
| `web/assets/verkauf.css` | 114, 453–454 | Regeln nach C und F; `.rg .rg-tab.vk-vergleich` überschreibt `ratgeber.css:59-74`: kein Hintergrund, kein Ring, kein Radius, `overflow: visible`, keine `data-k`-Liste |
| `web/assets/verkauf.js` | `Verkauf.auf` | Öffnen per Link und Adresse; im Rückfall setzt es die Rollen (unten) |
| `scripts/pruefen-instanzen/29.mjs` | 29.1 (Zeilen 31–33), 29.2 | zwei Muster anpassen (unten); ergänzen: sieben Gruppenköpfe; jede Zeile in „In allen Paketen“ in allen drei Paketen gleich; Telefon ohne Querscrollen auch mit geöffnetem Vergleich; Verkaufsstand kleiner als jeder Preis |

**Anpassung der Prüfsuite – Freigabe durch den Inhaber nötig.** (1) `/<table class="rg-tab vk-vergleich">/` wird `/<table
class="rg-tab vk-vergleich"[^>]*>/`; (2) `'<td>' + t + '</td>'` wird ein Muster auf `<th scope="row"…>t</th>`. Grund: Weil die Tabelle am
Telefon als Raster dargestellt wird, braucht sie echte Zeilenköpfe und Rollen (`table`, `rowgroup`, `row`, `columnheader`, `rowheader`,
`cell`) im ausgelieferten HTML. **Rückfall bis zur Freigabe:** Bestandsmarkup (`<table class="rg-tab vk-vergleich">` ohne weiteres Attribut,
Zeilentitel als `<td>`); die Rollen setzt `verkauf.js` beim Binden.

**Neue Bausteine.** `preisstand`; Raster der Vergleichstabelle (CSS); Zustandszeichen; Öffnen per Link.

**CSS- und Layouttechniken.** Grid für `tr`, `position: sticky` am `thead`, Medienabfragen bei 640 px, `@media (pointer: fine)`,
`prefers-reduced-motion: reduce` (keine Einblendung, Zeichen sofort), `prefers-contrast: more` (Haarlinien `--muted`), `forced-colors: active`
(Striche als `border`, damit sie in `CanvasText` erscheinen), `hyphens: auto`, `tabular-nums`; Tokens mit Rückfallwert, z. B.
`var(--kurve-ein, cubic-bezier(.2, 0, 0, 1))`, solange B.5 nicht in `gemeinsam.css` steht.

**Benötigte Assets.** Keine. Nur Variante H-07-5 nutzt die Miniatur 96 × 72 aus 10.4 H (aus dem Beispielbild per Skript abgeleitet).

**Animationstechnik.** Stufe 1 „Leicht“ (SKILL, Abschnitt 3): ein CSS-Keyframe auf `opacity`, Übergänge auf Farbe und Deckkraft, wenige Zeilen
JavaScript nur für das Öffnen per Link. Begründung: Lese- und Entscheidungsfläche der Stufe 1; jede Wirkung würde mit Preis und Knopf
konkurrieren (Dosierregel 1).

**Leistungsrisiken.** Gering: ≈ 19 Tabellenzeilen im HTML, zugeklappt nicht gerendert, keine Bilder, keine Schleifen. INP: Umschalten ohne
Skript. CLS: Öffnen ist nutzerausgelöst. Risiko: In der Einbettung klebt der Kopf nicht, wenn ein Vorfahr in `portal` `overflow` setzt;
prüfen, sonst `overflow: clip`.

**Barrierefreiheit.** `details`/`summary` nativ (Zustand „erweitert“); Zustandszeichen als Pseudo-Element ohne Text; versteckter
Tabellentitel; Spaltenköpfe mit verstecktem „EEZI “ ergeben den vollen Paketnamen; Zeilen- und Gruppenköpfe; „nicht enthalten“ als Text,
nicht nur als Farbe; Fokus nie unter dem Seitenkopf (`scroll-padding-top: calc(var(--kopf-h) + 12px)`); die Tabelle hat keine Fokusziele,
also verdeckt der klebende Kopf keinen Fokus; Ziel 52 px; Kontraste nach E; Tab erreicht im Block nur die Zusammenfassung.

**Abweichungen von bestehenden Regeln** – jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall | geführt als |
|---|---|---|---|---|---|
| J-AB-5 | „Vorläufige Preise“ als Kasten mit Warnstrich über den Karten (GEST:453) | ein Satz 15 unter der Reihe, ohne „bleibt für Ihren Vertrag fest“ | Vorbehalt kleiner als die Preise (AB-4); Widerspruch zu PB:55 | Kasten, kleiner gesetzt | 10.4 H |
| J-AB-7 | Vergleich mit allen Merkmalen ungegliedert (GEST:454) | sieben Gruppen, „In allen Paketen“ als eine Zelle, „nicht enthalten“ | Überfliegbarkeit (Q34); Pflichtzeilen bleiben | ungegliedert | 10.4 H |
| I-AB-1 | Tabelle „mit `data-k` wie im Ratgeber“ (GEST:454) | Telefon: klebender Kopf aus drei Kurznamen, Werte in drei Spalten | Werte einer Zeile nebeneinander statt dreimal untereinander mit Wiederholung des Namens; etwa halb so lang; R9 | `data-k`-Liste wie heute | neu |
| I-AB-2 | `details` „als Karten, 48 px“ (GEST:435), heute auch beim Vergleich | Zeile mit Haarlinien, 52 px | wie bei den Fragen | Karte | DG-AB-19 |

Das Erscheinen beim Scrollen („24 px aufwärts … in 600 ms“, GEST:451) entfällt hier nach E-13; geführt als DG-AB-2.

## I. Conversion-Begründung

- **Warum an dieser Position.** Die Frage „welches genau?“ entsteht an den Karten; die Antwort steht direkt darunter, vor Risiko (Festblock)
  und Handlung (Formular): Detail → Risiko → Handlung, alles in Leserichtung (E-4). Wer entschieden ist, überspringt ≈ 146 px.
- **Wie die Gestaltung unterstützt.** Zugeklappt kostet der Vergleich am Telefon eine Zeile; der Vorbehalt ist ehrlich, aber kleiner als jeder
  Preis (J-R18). Geöffnet machen Gruppen und Tonwert die zwei Achsen des Angebots sichtbar (Marke, Team; J-R10), ohne Hervorhebung einer
  Spalte. Die Zeile „Für Ihr Team“ zeigt bei Essential und Plus „nicht enthalten“ und führt so ehrlich zum höheren Paket (SKILL:50).
- **Warum die Informationsmenge angemessen ist.** Zugeklappt etwa 20 Wörter. Geöffnet 19 Zeilen auf Abruf: Wer öffnet, sucht Detail; gerade
  bei unklarer Präferenz verstärkt Merkmalsfülle aber Überforderung (Q3), deshalb gegliedert, das Gemeinsame in einer Zelle, Werte kurz.
  Pflichtangaben bleiben vollständig (Prüfsuite 29.1; § 5a UWG, Q51).
- **Beitrag zur Zielhandlung.** Z1a bzw. Z1 über Festblock und Formular direkt darunter; Z1+ über die sichtbare Team- und Datenachse; keine
  Lockvögel, keine Knappheit (R7). Wer unsicher bleibt, trifft 48 px tiefer auf den Gesprächsweg.
- **Zu testende Annahmen** (Prüfwege nach 10.5.2: Telefon-Video, Lesetests und Gespräche mit Fensterbauern, Paketfeld im Formular; keine
  erwarteten Größen):

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H-07-1 (= J-H3) | Der gruppierte Vergleich wird am Telefon schneller und richtiger gelesen | Lesetest „Was bekommen Sie mit Signature zusätzlich?“, Zeit und richtige Antworten | ungegliedert, Gruppen als Zwischenzeilen |
| H-07-2 | Der Verkaufsstand unter der Reihe wird vor der Wahl bemerkt | Lesetest „Sind die Preise endgültig?“ | zusätzlich „· vorläufig“ in der Steuerzeile jeder Karte (`fb-06`) |
| H-07-3 | Die Gruppe „Richtwerte“ beantwortet F-26, ohne abzuschrecken | Gespräche; Fragen im Formular nach Thema | Gruppe entfällt, nur PB § 2 (2) |
| H-07-4 | Der klebende Kopf hält die Spaltenzuordnung bis zur letzten Zeile | Lesetest an Zeile 17: „Was gilt bei Plus für die Aufbewahrung?“ | Kurzname 13 über jedem Wert (wie `data-k`) |
| H-07-5 | Miniaturen der drei Beispielbilder (48 × 36) im Kopf am Schreibtisch verbinden Tabelle und Karten | Sichtprüfung des Inhabers, Lesetest | ohne Miniaturen (Grundfassung) |
| J-H4 | „Erstes Jahr“ senkt Rückfragen zu Kosten, ohne Anfragen zu senken | vorher/nachher: Anfragen je Aufruf, Rückfragen zu Kosten | Zeile entfällt (`ERSTES_JAHR`) |
| H-07-6 | Wer unsicher ist, findet und öffnet die zugeklappte Zeile | Telefon-Video mit Aufgabe „Unterschied Plus und Signature“ | Zusammenfassung mit Hinweis 15 „Unterschiede in sieben Gruppen“ (**Textentwurf**) |

**Offen beim Inhaber:** J-O-2 (Preis fest für den Vertrag?), J-O-11 (Zeile „Erstes Jahr“), J-O-12 mit J-AB-5 und J-AB-7, dazu I-AB-1, I-AB-2,
die Anpassung der Prüfsuite und die Gruppe „Richtwerte“ (Festlegung I-2).

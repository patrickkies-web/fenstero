# Live-Demos (#demos)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 12 von 15 (Anhang A1, nach 06.2 `fb-11-kundenschutz`, vor A2 `fb-13-haeufige-fragen`) · Intensitätsstufe: 1 ruhig (Typ T4-Anhang)

Phase I, Stand 24.10.2026. Planungsdokument: Das Repository wurde nur gelesen, gebaut wurde nichts. Kürzel, **[V]**, **[H]** und
**Textentwurf** wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (ZA); PE = [10-paketentscheidung.md](../10-paketentscheidung.md)
(verbindlich für alles zu Paketen). **Festlegung I** = Entscheidung dieser Spezifikation, wo ZA offen ist. Alle Lagen und
Aufmerksamkeitsfolgen sind geplant bzw. erwartet, nicht gemessen.

## A. Abschnitt und Funktion

- **Name, ID:** Live-Demos, `fb-12-live-demos`, Pflicht-h2 `#demos` (`scripts/pruefen-instanzen/29.mjs:112`).
- **Position:** erster von vier Anhängen, ohne Kapitelnummer (E-AB-10); davor Kapitel 06 (endet mit dem Link „Paketbedingungen § 10“),
  danach Häufige Fragen, Hintergrund und Abschluss (`fb-15`, Cream). Gewicht 0,25 BH, bei 390 × 664 Bildschirm 12 (ZA 8.3.2 a).
- **Ziel:** Probieren als Nebenweg, ohne den Weg zur Anfrage zu verlieren (EA W3). Die Vorführung des verkauften Produkts steht schon in 02
  (`fb-04`); A1 ist der Weg zur ganzen App bzw. zu den Demo-Instanzen.
- **Beantwortete Nutzerfrage:** „Kann ich das vorher ausprobieren?“ (EA F-22).
- **Vorbereitete Entscheidung:** Probieren vor dem Kauf (U1), mit klarer Erwartung, was sich öffnet; danach zurück zur Paketwahl (Kopf-Ring,
  `fb-15`).
- **Zwei Fassungen (serverseitig, `functions/pakete-seite.js:42`):** ohne `PAKETE_DEMOS` (Zustand A und B) ehrlicher Satz und Ring zur App
  in neuem Tab [H]; mit `PAKETE_DEMOS=1` drei Demo-Zeilen (ZA 8.3.2 d).

## B. Konkreter Inhalt

**Verwendete Bestandsinformationen**

| Bestand | Fundstelle | Verwendung |
|---|---|---|
| h2 „Live-Demos“ mit `id="demos"`, Baustein zwischen `<!--pakete:demos-->` und `<!--/pakete:demos-->` | VK:207-211; Prüfsuite `29.mjs:112` | bleibt; h2 exakt `<h2 id="demos">` |
| Baustein `demos(o, v)`: Satz „Die Live-Demos je Paket schalten wir in Kürze frei. … Unter Ihrer Domain trägt sie Ihren Namen, zeigt keine Preise und schickt jede Anfrage an Sie.“, Karte „Konfigurator ausprobieren“ → `/app/` | `functions/pakete-seite.js:165-172`; VK:209-210 | Fakten bleiben, Satz gekürzt, Karte wird Ring |
| Fassung mit Demos: „So sieht der Konfigurator bei Ihren Kunden aus, je Paket mit einem erfundenen Betrieb. Anfragen dort gehen an uns und verschwinden nach einem Tag.“; Links `https://demo-<paket>.eeziframes.com/` | `functions/pakete-seite.js:168-169`; `docs/INSTANZEN.md:310` | gekürzt; Ziele bleiben |
| Frist für Demo-Anfragen: `FRISTEN.testTage = 1`; Demo-Anfragen gehen an `MAIL_KONTAKT` | `web/assets/instanzregeln.js:60`; `functions/api/eingang.js:54`, `:163`; GM (AVV § 11) | Zahl im Satz aus der Variable |
| Paketnamen, Merkmale `gestaltung`, `fotos`, `kennzeichnung`; Wortlaut „eeziframes-Design mit Ihrem Namen“, „Ihr Logo, Ihre Farbe, bis 6 Fotos“ | `web/assets/pakete.js:42-67`; PE Fakten, 10.4 B | Zeilentext aus Merkmalen, gleiche Wörter wie in 04 |
| Beispielbild 4 : 3, aufgenommen bei 1280 × 960 | PE 10.4 C; Platz `BEISPIEL_BILD` leer (`functions/pakete-seite.js:96`) | Quelle der Miniaturen |
| App für Hauseigentümer: Preis für das Aufmaßblatt, Paywall, Du-Anrede; Preis wechselt am 18.11.2026 von selbst | PA 1.9/4; `web/config.js:12-14`; AGB:55 | nur „mit Preisen“ nennen, keine Zahl |
| Demo-Link je Karte „Demo ansehen“ (nur mit Demos), Rückfall „Demos nur im Anhang A1“ | PE 10.4 B, J-H7 | Zusammenspiel (H, Navigation) |

**Texte**

| Element | Zustand A und B (ohne Demos) | mit `PAKETE_DEMOS=1` |
|---|---|---|
| h2, 32/40 | „Live-Demos“ (VK:207), grün „Demos“ | gleich |
| Satz 15 | **Textentwurf** „Demos je Paket folgen in Kürze. Bis dahin: die App für Hauseigentümer, mit Preisen. **Unter Ihrer Domain: Ihr Name, keine Preise.**“ (aus VK:209; R14; ZA A1) | **Textentwurf** „Je Paket ein erfundener Betrieb. Anfragen dort gehen an uns und verschwinden nach einem Tag.“ (gekürzt aus `pakete-seite.js:168`) |
| Handlung | Ring **Textentwurf** „App für Hauseigentümer“ mit ↗ → `/app/`, neuer Tab | drei Zeilen: Paketname 17/700 wörtlich (K-21), Satz 13 (nach Freigabe von DG-E-6 15, K-20) **Textentwurf** aus Merkmalen: „eeziframes-Design mit Ihrem Namen“ · „Ihr Logo, Ihre Farbe, bis 6 Fotos“ · „Ihr Design, ohne eeziframes-Hinweis“ |
| nur für Vorleser | „ öffnen, neuer Tab“ | „, Demo, neuer Tab“ |

- **Festlegung I-1 (grünes Wort):** „Demos“ in Grün, „Live-“ in `--text`. Ein grünes Wort je Überschrift (GEST:24); „Live“ grün zu setzen, während
  es noch keine Demos gibt, wäre ein falsches Signal. Rückfall: h2 ohne grünes Wort (Bestand).
- **Festlegung I-2 (Ringtext):** ZA nennt „App für Hauseigentümer öffnen“. Ohne „öffnen“ misst der Ring ≈ 290 statt ≈ 350 px und steht in
  eigener Breite statt als Balken über die volle Breite: weniger Gewicht für einen Nebenweg. Das Verb trägt der Pfeil, der Vorlesename
  enthält es (WCAG 2.5.3 erfüllt, weil der sichtbare Text am Anfang des Namens steht).
- **Festlegung I-3 (Zeilentext):** abgeleitet aus Merkmalen, nie aus dem Paketschlüssel (Regel in `web/assets/pakete.js:4-5`):
  `gestaltung === 'standard'` → Essential-Satz; `gestaltung === 'eigen'` mit Hinweis → Satz mit `m.fotos`; `kennzeichnung === 'keine'` →
  Signature-Satz. Keine Preise in A1; sie stehen in 04 und `fb-15`.

**Erforderliche Interaktionen:** genau ein Link (Zustand A) bzw. drei Zeilenlinks; alle öffnen einen neuen Tab. Kein Formular, kein
JavaScript.

**Nutzbare Komponenten:** `demos()`, `verkaufFuer()`, `esc()` in `functions/pakete-seite.js`; `P().LISTE`, `P().PAKETE[p].name`,
`P().merkmale(p)`; `R().FRISTEN`; `.btn.ghost` und `.ak` (`web/assets/gemeinsam.css:47`, `:58`); Pfeil nach dem Muster von `ICONS.ext`
(`web/assets/portal.js:279`); unsichtbarer Text wie `.p-sr` (`web/assets/partner.css:6`).

## C. Exakte Layoutkomposition

**Grundstruktur:** Satzbau nach G2 ohne Held (DG 2.4.2 Stufe 1, Hauptelement Typografie nach DG-E-1 C): Haarlinie → h2 → Lesestapel →
Handlung bzw. Zeilenliste. Ein senkrechter Stapel an der Ordnungslinie x = 16 (G5), asymmetrisch; rechts nur die Zeichen ↗ (16 px ohne
Kreis, Festlegung K-31) als ruhige Senkrechte. Ansichtstyp „Arbeitsansicht“ (DNA-B B.1): Verdeckung, Anker und Maßstabssprung sind Ziel, nicht Pflicht.

**Telefon 390 × 844** (4 Spalten, Rand 16, alles über 4 Spalten; y ab der Haarlinie)

| Element | x | y | Maß | Ebene |
|---|---|---|---|---|
| Abstand zu `fb-11` | – | −96 bis 0 | 96 (G6) | – |
| Haarlinie `--line` | 16–374 | 0 | 358 × 1 | 30 |
| h2 32/1,05, 800, −0,03 em | 16–≈ 186 | 24–58 | eine Zeile | 30 |
| **Zustand A:** Satz 15/1,5, `--text2`, letzter Satz `--text` 700 | 16–374 | 74–142 | drei Zeilen, ≤ 46 ch | 30 |
| Ring 52, innere Kontur 2 px `--muted` (K-1), Text 17/700, ↗ 16 px | 16–≈ 306 | 166–218 | ≈ 290 × 52 | 30 |
| **mit Demos:** Satz 15 | 16–374 | 74–119 | zwei Zeilen | 30 |
| Zeilenliste, Haarlinie über jeder Zeile und unter der letzten | 16–374 | 143–315 | 3 × (1 + 56) | 30 |
| je Zeile: Miniatur 48 × 36, Radius 12, 1-px-Kontur `--line2` | 16–64 | 10–46 in der Zeile | 4 : 3 | 20 |
| je Zeile: Paketname 17/22 700 `--text` (K-21), darunter Satz 13/1,3 `--muted` (nach Freigabe von DG-E-6: 15/22, K-20) | 76–338 | ≈ 8–49 (mit 15 px: 6–50) | 262 breit | 30 |
| je Zeile: ↗ 16 px `--muted` ohne Kreis (K-31), im 24-px-Feld x 350–374 | 354–370 | 20–36 | 16 × 16 | 30 |
| Abstand zu `fb-13` | – | +96 | G6 | – |

Abschnittshöhe: Zustand A 218 px (0,26 BH, wie geplant); mit Demos 315 px (0,37 BH). **Festlegung I-4:** Die 0,12 BH Mehrlänge mit Demos
werden hingenommen; die Zeilen sind dann selbst der Beweis, und der Abschnitt steht weiter ganz in einem Bildschirm (auch bei 664).
Nach dem Sprung auf `#demos` liegt die Haarlinie bei y = 72, also 16 px unter dem 56-px-Kopf (Festlegung K-15: `scroll-margin-top` am h2
ohne Kapitelzeile 96 px, ab 1024 px unter dem 64-px-Kopf 104 px; seitenweit `scroll-padding-top` = Kopf + 16 = 72/80 px).

**Verhältnisse:** Abstände 8 (innerhalb einer Gruppe) : 16 (h2 → Satz) : 24 (zwischen Gruppen) : 96 (zwischen Abschnitten). Zustand A:
Text ≈ 38 %, Ring ≈ 19 %, frei ≈ 43 % der Abschnittsfläche, Bild 0 %. Mit Demos: Text ≈ 47 %, Miniaturen ≈ 5 %, frei ≈ 45 %; Bildanteil am
Bildschirm ≈ 1,6 % (Stufe 1: 0–20 %). **Größenhierarchie:** drei Stufen wie in PE 10.4 C: h2 32 · Lesestufe 17/15 · Mikrostufe 13
(K-21; nach Freigabe von DG-E-6 entfällt die Mikrostufe in A1, weil der Zeilensatz 15 wird, K-20). Maßstabssprung 32 : 13 = 2,46 < 3, zulässig nur unter DG-E-1 C.

**Ebenen:** 0 Grund `#161616`, ohne Licht und Raster → 20 Miniaturen (nur mit Demos, Bildschicht, `alt=""`) → 30 Haarlinien, Text, Ring,
Zeilen, Zeichen ↗ → 40 Kopf beim Durchscrollen. Keine Verdeckung (Arbeitsansicht).

**Schreibtisch 1280 × 800** (12 Spalten à 64,67 px, Abstand 24, Spalte 1040 ab x = 120)

| Element | Spalten, x | y | Maß |
|---|---|---|---|
| Haarlinie | 1–12, 120–1160 | 0 | 1040 × 1 |
| h2 40 (Haarlinie → 24 → h2 wie am Telefon, K-15) | 1–5, 120–539 | 24–66 | eine Zeile |
| Satz 15 | 1–5 | 86–154 (Zustand A, drei Zeilen) bzw. 86–131 (mit Demos) | ≤ 419 breit |
| Ring (Zustand A) | 1–5, ab 120 | 178–230 | eigene Breite ≈ 290 |
| Spalten 6–12 in Zustand A | leer, Negativraum | – | – |
| Zeilenliste (mit Demos) | 6–12, 563–1160 | 24–220 | 3 × 64; Miniatur 64 × 48, ↗ 16 im 24-px-Feld (K-31), Text 477 breit |

Abstand 128 oben und unten. **Festlegung I-5:** Split 5 : 7 nur mit Demos (ZA 8.3.2 c), weil dann rechts ein Gegenstück steht; in Zustand A
bliebe ein einzelner Ring in sieben Spalten verloren, er steht unter dem Satz.

**Technische Startwerte** (nur vorhandene Tokens aus `web/assets/gemeinsam.css:9-31`)

```css
.vk-anhang { margin-top: 96px; padding-top: 24px; border-top: 1px solid var(--line); }   /* ohne Zähler, E-AB-10; Haarlinie → 24 → h2 auf allen Breiten (K-15) */
.vk-anhang > h2 { margin: 0 0 16px; font-size: 32px; line-height: 1.05; font-weight: 800; letter-spacing: -.03em; scroll-margin-top: 96px; }
.vk-demos-satz { margin: 0; max-width: 46ch; font-size: 15px; line-height: 1.5; color: var(--text2); }
.vk-demos-satz strong { color: var(--text); font-weight: 700; }
.btn.ghost.vk-demos-app { margin-top: 24px; white-space: normal; box-shadow: inset 0 0 0 2px var(--muted); outline: 2px solid transparent; outline-offset: -2px; }   /* K-1 */
@media (hover: hover) { .btn.ghost.vk-demos-app:hover { box-shadow: inset 0 0 0 2px var(--text); } }
.btn.ghost.vk-demos-app:active { transform: none; background: var(--surface2); }   /* Druck = Füllung --surface2 (K-1) */
.btn.ghost.vk-demos-app:focus-visible { outline-color: var(--text); outline-offset: 2px; }   /* K-34 */
.vk-demo-liste { list-style: none; margin: 24px 0 0; padding: 0; max-width: 560px; border-bottom: 1px solid var(--line); }
.vk-demo-liste li { border-top: 1px solid var(--line); }
.vk-demo-zeile { display: grid; grid-template-columns: 48px minmax(0, 1fr) 24px; column-gap: 12px; align-items: center; min-height: 56px;
  padding: 6px 0; font-size: 17px; color: var(--text); text-decoration: none; border-radius: var(--r2); transition: background var(--t1) var(--e-out); }
.vk-demo-zeile.ohne-bild { grid-template-columns: minmax(0, 1fr) 24px; }
.vk-demo-zeile img { width: 48px; height: 36px; object-fit: cover; object-position: top; border-radius: var(--r2); box-shadow: 0 0 0 1px var(--line2); }
.vk-demo-text b { display: block; font-size: 17px; line-height: 22px; font-weight: 700; }   /* K-21 */
.vk-demo-text span { display: block; margin-top: 2px; font-size: 13px; line-height: 1.3; color: var(--muted); }   /* nach Freigabe DG-E-6: 15px/22px, margin-top 0 (K-20) */
.vk-demo-pfeil { width: 24px; height: 24px; display: grid; place-items: center; color: var(--muted); transition: color var(--t1) var(--e-out); }   /* ↗ 16 px ohne Kreis (K-31) */
@media (hover: hover) { .vk-demo-zeile:hover .vk-demo-pfeil { color: var(--text); } }
.vk-demo-zeile:active { background: var(--surface); }
.vk-demo-zeile:focus-visible { outline: 2px solid var(--text); outline-offset: -2px; }   /* Zeile über volle Listenbreite (K-34) */
@media (min-width: 761px) { .vk-anhang { margin-top: 128px; }
  .vk-anhang > h2 { font-size: 40px; margin-bottom: 20px; } }
@media (min-width: 1024px) {
  .vk-anhang > h2 { scroll-margin-top: 104px; }   /* Kopf 64 + 16 + 24 (K-15) */
  .vk-demos-teil { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: start; }
  .vk-demos-teil > h2, .vk-demos-satz, .vk-demos-app { grid-column: 1 / span 5; justify-self: start; }
  .vk-demo-liste { grid-column: 6 / span 7; grid-row: 1 / span 2; margin-top: 0; max-width: none; }
  .vk-demo-zeile { grid-template-columns: 64px minmax(0, 1fr) 24px; column-gap: 16px; min-height: 64px; }
  .vk-demo-zeile img { width: 64px; height: 48px; } }
```
Dazu `.vk-extern` (16 × 16, `stroke: currentColor`, 1,75 px, ohne Füllung; im Ring und in `.vk-demo-pfeil`) und `.vk-sr` als Kopie von `.p-sr`.

Begründungen: Ringkontur 2 px `--muted` (≈ 5,8 : 1) statt `--line2` (≈ 1,6 : 1), Hover → `--text`, Druck Füllung `--surface2`, weil die
Kontur die einzige Grenze des Knopfs ist (Festlegung K-1; DG-E-10; SG 10.9; Abweichung 4 in D). Selektor `.btn.ghost.vk-demos-app`, weil
sonst `.btn.ghost` (`gemeinsam.css:58`, höhere Spezifität) die Kontur auf `--line2` zurücksetzt, `.btn:active` (`:65`) skaliert und die
transparente Ersatzkontur für `forced-colors` den Fokusring aus `:38` verdeckte; der Fokus steht deshalb ausdrücklich 2 px außen (K-34).
Die Zeile behält −2 px, weil sie über die volle Listenbreite an die Haarlinien stößt (Ausnahme „Zeile über volle Breite“ in K-34).
Radius 12 an der Miniatur ist der kleinste Website-Radius (DG-AB-8; Festlegung K-22: voll · 24 · 18 · 12 auf allen Breiten, 8 px bleibt
der App). Zeilenzeichen ↗ 16 px ohne Kreis (Festlegung K-31): Der Pfeil im Kreis bleibt das Zeichen der Cream; ↗ in `--muted` wie das
„+“ der Fragenzeilen in `fb-13`. Zeilensatz 13 px bleibt bis zur Freigabe von DG-E-6 zulässig; danach in einem Schritt mit allen
Abschnitten 15/22 ohne Abstand darüber (Festlegung K-20), die Zeile bleibt 56 px (6 + 22 + 22 + 6), bricht ein Satz um, wächst sie über
`min-height`. Miniatur 48 × 36 statt 48 × 30 (**Festlegung I-6**): Das Beispielbild ist
4 : 3 (PE 10.4 C); ein 16 : 10-Ausschnitt schnitte Kopf und Namen der Startansicht ab. Zeilen 56 px wie in `fb-15` (Fragen: 52), weil zwei
Textzeilen und die Miniatur hineinpassen müssen. `font-size: 17px` an der Zeile, damit der unsichtbare Text keine fremde Größe
erbt (Prüfsuite misst alle Schriftgrößen, SKILL:70).

## D. Anwendung der Design-DNA

| DNA-Eigenschaft | Ausgestaltung, Position | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achsen | zwei bzw. drei Ebenen (Grund, Miniaturen, Bedienschicht) | 0–1 | Ruhe nach den Kacheln von `fb-11` (DNA-B B.1 Regel 1) |
| Material, Transparenz | opak, matt; kein Glas (kein Bild dahinter, DR 5) | 0 | Bedienschicht ohne Eigenmaterial (B.1 Regel 3) |
| Licht, Schatten | keines, keine Lichtkante (DG-AB-1) | 0 | Licht bleibt V1 und 02 vorbehalten (Dosierregel 3) |
| Formen | Pille (Ring), Radius 12 (Miniatur, Druckfläche und Fokus der Zeile; K-22); kein Kreis (K-31); Formfamilie Vollrundung | 1 | wie alle Knöpfe der Seite (B.1 Regel 8) |
| 3D-Objekte, Perspektive | keine, frontal | 0 | – |
| Bildintegration | nur mit Demos: echte Startansichten als Miniatur, gleiche Bilder wie die Karten in 04 | 1 | Wiedererkennen der Markenstufe; echtes Material statt Symbol (SKILL:41) |
| Oberflächendetails | Haarlinien 1 px `--line` als Zeilenordnung (DG-AB-19), Pfeil ↗ als Mikroschicht-Signal | 1 | präzise wie ein Aufmaß, ohne Fläche |
| Animation | keine; nur Zustände 150 ms | 0 | Stufe 1; E-2 |
| Typografie | Bühnenstimme nur im h2; Lesetext 15; Zeilennamen 17/700 (K-21); Mikrostufe 13, nach Freigabe von DG-E-6 Zeilensatz 15 (K-20) | 1 | Hierarchie über Gewicht und Tonwert (DG-E-1 C) |
| Überlagerungen | keine; kein Rahmenbruch | 0 | der eine Rahmenbruch bleibt V1 → V2 |
| Interaktive Effekte | Kontur (Ring) bzw. Farbe des ↗ (Zeile) als Hover, Füllung als Druck, Fokus 2 px (K-1, K-34) | 1 | Rang ohne Bewegung der Bedienschicht (SG 10.10 Nr. 14) |

Signature-Effekte: keine, weder informierend noch inszenierend (ZA 8.3.11: `fb-11` bis `fb-15` ≤ 2, ohne Signature). Den variablen
Baustein B.3.7 („Kreis-Button für Einzelaktionen, etwa ↗“) nutzt A1 nicht: Nach Festlegung K-31 bleibt der Pfeil im Kreis das Zeichen der
Cream, die Zeilen tragen ↗ 16 px ohne Kreis.

**Bewusst weggelassen:** Karten in Paketfarbe mit grünem Akzentstrich (`web/assets/verkauf.css:482-484`); Auftritt beim Scrollen
(**Festlegung I-7**: Wer über `#demos` aus Lesezeichen oder alten Links der Fachartikel springt, sähe sonst 320 ms eine leere Stelle);
eingebettete Live-Vorschau (CSP `frame-ancestors 'none'`, dazu Ladelast einer ganzen App); Bildschirmaufnahme der App für Hauseigentümer
(zeigte Preis und Paywall als Werbung für den falschen Weg); Messraster (nur V4/V5); Cream und Pfeilkreis `.pf` (gehören der einen
Hauptaktion je Bildschirm, SKILL:71), auch kein Kontur-Kreis um ↗ (K-31); Preise in den Zeilen.

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:**
1. GEST:447 „Demos als Karten in Paketfarbe (Essential dunkel, Plus und Signature mit Akzentstrich)“ → Zeilen mit Haarlinien ohne
   Akzentstrich (IA-AB-8, ZA 8.4.5). Grund: Grün ist Signal in Kleinstmengen, nicht Kartenschmuck (G8); drei gleichrangige Karten sind ein
   Feld ohne Anker (SG 10.10 Nr. 11); Zeilen sind halb so hoch.
2. GEST:450 Nummern an jeder Haarlinie → Anhang ohne Nummer (E-AB-10).
3. GEST:39 und :448 Erscheinen mit Versatz → kein Auftritt (DG-AB-2 und Festlegung I-7); Druck ohne `scale(.98)` (`gemeinsam.css:65`;
   DNA-B B.3.7 „Zerstört durch Skalieren beim Drücken“).
4. GEST:24 („`--muted` nur für Labels und Nebenzeilen“) und `gemeinsam.css:58` (Ghost-Rand `--line2`) → Ring-Kontur 2 px `--muted`,
   Hover `--text`, Druck `--surface2` (Festlegung K-1; DS-AB-10). Grund: Die Kontur ist die einzige Grenze des Knopfs und braucht 3 : 1
   (WCAG 1.4.11); `--line2` erreicht ≈ 1,6 : 1.
5. GEST:26 („nichts unter 13 px“), :449 („13 Label“) und :452 (Zusatzzeile in 13 px), die 13 px auch für Sätze zulassen → Satz der
   Demo-Zeilen 15 px nach Freigabe von DG-E-6 (Festlegung K-20;
   DS-AB-2). Grund: 13 px bleibt der Technikstimme; bis zur Freigabe gilt GEST, die Umstellung erfolgt in einem Schritt für alle Abschnitte.

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit; Prüfung im Blinzeltest bei 390 × 844 (DG-H-12).

- **Bildschirm mit A1 in der Mitte (Haarlinie y ≈ 300):** oben das Ende der Kundenschutz-Kacheln mit grünen Haken, unten der Kopf von A2.
  Erwartete Folge Zustand A: (1) h2 als größte Schrift mit dem grünen „Demos“ → (2) der fette Satz „Unter Ihrer Domain: Ihr Name, keine
  Preise.“ als einziger heller Fettsatz → (3) Ring mit ↗ → (4) Kopf-Ring „Paket anfragen“ oben rechts. Mit Demos: (1) h2 → (2) die drei
  Miniaturen als einzige Bildreize → (3) Paketnamen → (4) Zeichen ↗.
- **Primärer Fokus:** das h2; **sekundär:** Ring bzw. erste Zeile. Kein Held: A1 soll nicht stärker wirken als der Hauptweg.
- **Kontraste:** h2 ≈ 16 : 1, Grün ≈ 10,5 : 1, Satz `--text2` ≈ 10,8 : 1, Zeilensatz `--muted` ≈ 5,8 : 1, Zeichen ↗ `--muted` ≈ 5,8 : 1, Ringkontur ≈ 5,8 : 1 (K-1), Haarlinie
  ≈ 1,3 : 1 (Ordnung, kein Bedienelement).
- **Gewicht der Handlung:** Ring ≈ 290 × 52 ≈ 4,6 % des Bildschirms, ungefüllt; kein Cream im Abschnitt. Der Kopf-Ring (≈ 2 %) bleibt der
  dauerhafte Weg zur Anfrage (ZA N5).
- **Ablenkungen:** Die Demo-Zeilen ähneln den Fragezeilen von A2; Unterscheidung über Miniatur und ↗ statt „+“ und über 96 px Abstand. Zwei
  h2 gleicher Größe (A1, A2) können im selben Bildschirm stehen; die Haarlinien trennen sie.
- **Übergang:** Wer aus dem neuen Tab zurückkehrt, steht wieder an A1; nächste Handlungsträger sind der Kopf-Ring und die Cream-Zeile in
  `fb-15` ≈ 1,2 BH tiefer. Kein Rücklink nach oben (ZA N10 sinngemäß).

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Begründung | weniger Bewegung |
|---|---|---|---|---|
| Scrollen | nativ, kein Auftritt, keine Kopplung | – | Stufe 1; Festlegung I-7 | gleich |
| Sprung auf `#demos` (Lesezeichen, alter Link) | Haarlinie unter dem Kopf; in der Einbettung ohne Änderung von `#fensterbauer` (GEST:193) | wie die Sprungmarken in `rh-02` | ZA N12 | ohne weiches Scrollen |
| Hover (`hover: hover`) | Ring: Kontur `--muted` → `--text` (K-1); Zeile: ↗ `--muted` → `--text` (K-31) | 150 ms (`--t1`), `--e-out` | ein Kanal (DG 2.2.10); SG 10.9 Zustand 120–200 ms | gleich |
| Druck | Füllung `--surface2` (Ring, K-1) bzw. `--surface` (Zeile), keine Skalierung | 150 ms | DNA-B B.3.7 | gleich |
| Fokus (Tastatur) | `outline` 2 px `--text`; am Ring Abstand 2 px außen, formfolgend als Pille; an der Zeile −2 px innen, Radius 12, weil sie über die volle Listenbreite an die Haarlinien stößt (K-34) | sofort | SG 10.10 Nr. 17; Haarlinien bleiben sichtbar, Fokus nie verdeckt | gleich |
| Klick, Enter | neuer Tab (`target="_blank" rel="noopener"`); die Seite bleibt unverändert an ihrer Stelle | – | „ohne den Weg zu verlieren“ (ZA 8.2.7) [H] | gleich |

Keine räumliche Transformation, keine Richtung, keine Feder: Der Abschnitt ist bewusst die ruhige Stelle zwischen Kundenschutz und Abschluss.
Die von SKILL:43 verlangte Tiefe und Physik tragen V1, V2, 02 und 03.

## G. Responsive Design

**Telefon 390 × 844 (zuerst):** wie in C; eine Spalte, Abschnitt ganz in einem Bildschirm, Ring und Zeilen im Daumenbereich der unteren
Bildschirmhälfte, sobald die Haarlinie die Mitte passiert. **390 × 664:** passt (Abschnitt ≤ 315 von 608 px Inhaltshöhe).
**360:** Satz drei bis vier Zeilen, nichts gekürzt; Zeilentext 232 px breit, der Signature-Satz darf zweizeilig werden, die Zeile wächst
über 56 px (`min-height`); mit 15 px nach K-20 kann das schon bei 390 geschehen (Zeile ≈ 78 px, Abschnitt ≈ 337 px, weiter in einem
Bildschirm). **320:** kein Querscrollen; Ringtext bricht um (`white-space: normal`). **640–1023:** Aufbau wie am Telefon,
Seitenrand 24 px (K-13), h2 ab 761 px 40; Satz ≤ 46 ch, Zeilenliste ≤ 560 px, damit Name und Pfeil nicht 700 px auseinanderliegen.

**Schreibtisch 1280:** wie in C; Zustand A nur in den Spalten 1–5, mit Demos Split 5 : 7. Nichts wird vergrößert (SKILL:28): Schrift wie am
Telefon außer h2 40, Miniatur 64 × 48.

**Schreibtisch 1024:** Seitenrand 32 px, Inhalt 960 px (x 32–992), 12 Spalten à 58 px mit 24 px Rinne, wie der Kopf in `rh-01`
(Festlegung K-13). Spalten 1–5 = 386 px (x 32–418), Spalten 6–12 = 550 px (x 442–992); Zeilentext 430 px, alle Sätze einzeilig. Zustand A: Satz drei Zeilen, Ring darunter.

## H. Technische Umsetzung

- **Bestehend, umzubauen:** `demos(o, v)` in `functions/pakete-seite.js:165-172` liefert beide Fassungen (Markup unten); danach
  `node scripts/bedingungen-pdf.mjs`, damit die Rückfallfassung zwischen den Markierungen in `web/fuer-fensterbauer/index.html` steht
  (SKILL:107). Der Abschnitt wechselt von `<section class="vk-teil">` (Zähler, `verkauf.css:501-502`) zu
  `<section class="vk-anhang vk-demos-teil" aria-labelledby="demos">`; `.vk-anhang` ist gemeinsam mit A2 und A3.
- **Entfällt:** `.rg-karten.vk-demos`, `.rg-karte.vk-demo*` und `verkauf.css:482-484`.
- **Neu:** `demoZeile(m)` (Festlegung I-3), Zuordnung `BEISPIEL_MINI = { essential, plus, signature }` wie `BEISPIEL_BILD`
  (`pakete-seite.js:96`); fehlt ein Bild, Zeile mit Klasse `ohne-bild`. Frist im Satz aus `R().FRISTEN.testTage` („einem Tag“ bzw.
  „<n> Tagen“), nicht fest geschrieben.
- **Markup:** h2 genau `<h2 id="demos">Live-<span class="ak">Demos</span></h2>`, ohne weitere Attribute (die Prüfsuite sucht
  `<h2 id="demos">` wörtlich). Zustand A: `p.vk-demos-satz` mit `<strong>` für den letzten Satz; `a.btn.ghost.vk-demos-app` mit
  `href="/app/" target="_blank" rel="noopener"`, darin Text, `svg.vk-extern` (`aria-hidden`, Pfad `M8 16 16 8M9 8h7v7`) und
  `span.vk-sr` „ öffnen, neuer Tab“. Ziel `/app/` (Startbild), nicht `#ausmessen`: Eine Messung beginnt erst, wenn der Besucher sie startet.
  Mit Demos: `ul.vk-demo-liste` mit drei `a.vk-demo-zeile` (`target="_blank" rel="noopener"`), je `img` (48 × 36, `alt=""`,
  `loading="lazy"`), `span.vk-demo-text` mit `b` und `span`, `span.vk-demo-pfeil` (`aria-hidden`, 24-px-Feld ohne Kreis mit `svg.vk-extern` 16 × 16, K-31) und
  `span.vk-sr` „, Demo, neuer Tab“.
- **Assets:** nur mit Demos: drei Rasterbilder `web/bilder/demo-essential.webp`, `demo-plus.webp`, `demo-signature.webp`, je 192 × 144 px
  (4 : 3; reicht für 64 × 48 bei Pixeldichte 3), WebP, ≤ 8 KB, ohne Freistellung, ohne Text außer dem Bildinhalt. Quelle: per Skript
  verkleinert aus der Aufnahme des Beispielbilds je Markenstufe (PE 10.4 C, 1280 × 960; Playwright aus `/opt/node-tools`), oder aus der
  Startansicht der Demo-Instanz, wenn sie davon abweicht. Nicht beim Inhaber anzufragen. Keine HTML-Miniatur: Schrift unter 13 px
  verbietet die Prüfsuite (DG T4 „Nicht“). Zustand A braucht kein Asset.
- **Animationstechnik:** CSS-Übergänge auf Farbe, Kontur und Füllung kleiner Bedienelemente (SG 10.9 erlaubt das dort); kein
  JavaScript, keine Bibliothek.
- **Leistung:** 0 KB JavaScript; mit Demos ≈ 20 KB Bilder, verzögert, mit festen Maßen (kein CLS); kein Vorladen der Demo-Hosts.
  Nebenwirkung: Probiert ein Fensterbauer in der App (gleicher Ursprung), kann der Kopf der Ansicht Hauseigentümer später „Aufmaß
  fortsetzen“ zeigen (`rh-01`); hingenommen.
- **Barrierefreiheit:** benannte Region; echte Links mit Ziel ≥ 52 px; neuer Tab sichtbar (↗) und vorgelesen; Kontraste wie in E; Fokus
  sichtbar und unverdeckt; 200 % Text ohne Verlust; `forced-colors`: die transparente Kontur des Rings wird sichtbar, der Pfeil bleibt
  (`currentColor`). Ohne JavaScript vollständig.
- **Einbettung `/#fensterbauer`:** identisch, weil der Worker die Fassung je Umgebung schon in das ausgelieferte HTML setzt; nichts in
  `Verkauf.auf` zu binden; prüfen, dass `id="demos"` im Dokument einmalig ist.
- **Navigation (Festlegung I-8):** kein Menüeintrag, weder in Zustand A (verspräche, was es nicht gibt, R14) noch mit Demos, solange der
  Demo-Link je Karte gilt (PE J-H7). Fällt J-H7 auf „Demos nur im Anhang A1“ zurück, bekommt `rh-02` die Zeile „Live-Demos“ ohne Nummer
  zwischen „06 Ablauf“ und „Fragen“. ZA 8.1.4 („künftig Menü und Fluss“) ist damit für Zustand A überholt; 8.2.3 führt keinen Eintrag.
- **Prüfpunkte:** `29.mjs:112` grün; Schriftgrößen-Prüfung; Bilder bei 390 × 844 und 1280 × 800 in beiden Fassungen; `farbanteil.py`
  für den Bildschirm mit A1.

## I. Conversion-Begründung

- **Warum hier:** Probieren vor den Paketen hätte Besucher in einen neuen Tab geschickt, bevor sie Preis und Paket gesehen haben; die
  Vorführung des Verkauften steht schon in 02 (E-AB-3, E-AB-7). Nach Ablauf und Kundenschutz ist A1 die Stelle für den Prüfer FB-6, der vor
  der Anfrage die ganze App sehen will (ZA 8.2.8).
- **Wie die Gestaltung hilft:** Der Satz sagt vor dem Tippen, was sich öffnet und was beim eigenen Konfigurator anders ist; das nimmt
  die Enttäuschung vorweg, die heute hinter „Konfigurator ausprobieren“ wartet (PAK B7). Ring statt Cream und kein Bild halten den
  Nebenweg leiser als den Hauptweg; der neue Tab lässt die Seite an ihrer Stelle.
- **Informationsmenge:** 20 Wörter und ein Knopf bzw. drei Zeilen. Mehr gehört nicht auf eine Verkaufsfläche (SKILL:29-30); die
  Unterschiede der Pakete stehen in 04.
- **Beitrag zur Zielhandlung:** mittelbar zu Z1a/Z1, indem Zweifel F-22 beantwortet wird, ohne dass der Besucher die Seite verliert; mit Demos
  zusätzlich Z1+, weil die Zeilen die Markenstufen als echtes Bild zeigen.

| Nr. | Hypothese | Gegenrisiko | Prüfweg | Rückfall |
|---|---|---|---|---|
| H-LD-1 | Der neue Tab hält den Weg: Besucher kehren zur Seite zurück | am Telefon bemerkt man den Tabwechsel kaum und findet nicht zurück | Telefon-Video, Beobachtung mit drei bis fünf Fensterbauern | gleicher Tab; „Zurück“ stellt die Lage wieder her |
| H-LD-2 | Der Satz verhindert Enttäuschung, wenn die App Preise und die Ansprache für Hauseigentümer zeigt | Satz wird überlesen | Lesetest „Was erwarten Sie nach dem Tippen?“ | Zustand A ohne App-Link, nur der Satz |
| H-LD-3 | Miniaturen 48 × 36 machen die Markenstufe wiedererkennbar | zu klein, wirken wie Rauschen | Sichtprüfung, Blinzeltest | Zeilen ohne Miniatur |
| H-LD-4 | Die Lage als Anhang kostet keine Probierwilligen vor der Paketwahl | Probierwillige verlassen die Seite vor 04 | Gespräche; später Zählung | Demo-Link je Karte (PE J-H7) bzw. Menüzeile |

Messung nur nach Entscheidung des Inhabers (EA O-2): Vorgang „Demo geöffnet“ je Ziel in der eigenen Statistik der Zentrale, ohne fremde
Server und ohne Cookies. Bis dahin ist jede Aussage über die Nutzung eine Annahme.

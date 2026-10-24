# Fehlerseite mit drei Wegen

Seite: 404 (`web/404.html`, noindex) · Position: 1 (einziger Inhaltsabschnitt zwischen `rh-01-kopf` und `rh-03-brotkrumen-fuss`) · Intensitätsstufe: 1 ruhig (Typ T12; Ansichtstyp „Arbeitsansicht“ nach DNA-B B.1)

ID `nf-01-fehlerseite`. Phase I, Stand 24.10.2026. Reine Planung: Das Repository wurde gelesen, gebaut oder geändert wurde nichts.
Kennzeichnungen wie in 08: **[V]**, **[H]** (Hypothese mit Rückfall), **Textentwurf**, **Festlegung I** (Entscheidung dieser
Spezifikation). Grundlage: 08 8.3.9, 8.3.11; IA 5.3.6; DG T12, G1–G9, 2.4; SG 10.1, 10.7, 10.10; DNA-B B.1–B.6; `rh-01`, `rh-03`.
`10-paketentscheidung.md` liegt vor; der Abschnitt nennt weder Pakete noch Preise.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name, Lage | Fehlermeldung mit drei Wegen (08 N-1). Darüber `rh-01-kopf` im Kontext „neutral“: am Telefon Logo und Menü, am Schreibtisch zusätzlich „Für Fensterbauer“ und „Fenster ausmessen“. Darunter folgt nach 96 bzw. 128 px `rh-03-brotkrumen-fuss`, kurz und ohne Brotkrumen. Es gibt keinen weiteren Abschnitt |
| Geltung | nur Hauptdomain; der Worker liefert die Seite mit Status 404 und `X-Robots-Tag` (`worker.js:25-41`). Instanzen haben eine eigene neutrale Fehlerseite ohne eeziframes und ohne diese Wege (`functions/instanz/seiten.js:4`, `:65`) |
| Ziel | zurückführen statt verlieren (08 8.3.9) |
| Nutzerfrage | „Wo bin ich gelandet, wohin jetzt?“ |
| vorbereitete Entscheidung | Zielgruppe wählen: unklar → Startseite, Hauseigentümer → App, Fensterbauer → Seite für Fensterbauer (Weg zu Z1; heute fehlt dieser Link, IA 5.2.2 A10) |
| Gewicht (Telefon) | Abschnitt ohne Figur ≈ 0,49 BH, mit Figur ≈ 0,68 BH (08: ≈ 1 BH); Seite mit Fuß ≈ 1,5 bzw. 1,7 BH |
| Fassungen [V] | **A** ab sofort ohne Bild; **B**, sobald die echte Figur geliefert ist (08; DG T12). Der Text bleibt in beiden an derselben Stelle |

Wer hier landet, ist unbekannt; die Statistik zählt 404-Aufrufe nicht (`worker.js:63`, `functions/api/statistik.js:165`). Plausibel
**[H]**: vertippte Adressen, abgeschnittene Kundenlinks (PA H7) und alte Links.

## B. Konkreter Inhalt

**B.1 Bestand und Umgang**

| Element | Wortlaut | Fundstelle | Umgang |
|---|---|---|---|
| Seitentitel | „Seite nicht gefunden · eeziframes“ | `web/404.html:6` | bleibt; die Prüfsuite verlangt „nicht gefunden“ (`scripts/pruefen.mjs:124`) |
| Robots | `noindex, nofollow` | `web/404.html:7` | bleibt [V] |
| Kicker | „Fehler 404“ | `:19` | bleibt, in der Technikstimme |
| h1 | „Diese Seite gibt es **nicht.**“, „nicht.“ grün (`.ak`) | `:20` | bleibt [V] (08) |
| Satz | „Vielleicht ist der Link unvollständig. Kundenlinks sehen so aus: …/app/#k-…“ | `:21` | bleibt wörtlich, gesetzt als zwei Zeilen (C) |
| Knöpfe | „Zur Startseite“ (Cream), „Zur App“ (Rand) | `:22`; `web/assets/recht.css:48-49` | drei gleichrangige Ringe ohne Cream (08); neu „Für Fensterbauer“ → `/fuer-fensterbauer/` (IA 5.3.6; Wortlaut des neutralen Kopfs) |
| Bild | Platzhalter `fehler.webp` in Fotokarte | `:23`; `docs/BILDER.md:44` | entfällt; sein Alt-Text beschreibt, was nicht zu sehen ist (PA 1.9/2) |
| Bildunterschrift | „Ein Fenster ohne Haus: Hier gibt es nichts zu sehen.“ | `:23` | entfällt, weil sie die h1 wiederholt (Festlegung I). Das Motiv „Fenster ohne Haus“ trägt die Figur in Fassung B |
| Fuß | sieben Links ohne „Für Fensterbauer“, Nutzungsbedingungen, Cookies | `:25` | ersetzt durch den kurzen Fuß (`rh-03`) |

**B.2 Textentwürfe**

- Name der Wegegruppe für Hilfstechnik: `aria-label` **Textentwurf** „Wege von hier“.
- Alt-Text der Figur in Fassung B, erst nach Lieferung, beschreibt das echte Motiv. Bei der Katze **Textentwurf** „Eine Katze sitzt in einem
  Fensterrahmen, der allein steht“ (nach `web/404.html:23`).

Sichtbar stehen ≈ 23 Wörter: 2 im Kicker, 5 in der h1, 10 im Satz, 6 auf den Ringen. Das liegt unter der Grenze von 40 Wörtern (DNA-B B.2).

**B.3 Interaktionen:** drei normale Links, ohne JavaScript voll nutzbar. Keine Suche (gibt es im Repository nicht), keine
Weiterleitung nach Zeit (WCAG 2.2.1; nähme die Wahl).

**B.4 Nutzbare Komponenten:** `.btn.ghost` (52 px, Pille, 17 px fett, `web/assets/gemeinsam.css:56-58`), Tokens `gemeinsam.css:9-31`,
`.ak` (`:47`), Kopf und Fuß aus einer Quelle nach `rh-01` und `rh-03` (`scripts/ratgeber-bausteine.mjs`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Linksbündiger Lesestapel an der Ordnungslinie (G5): Kicker → h1 → Satz → drei Ringe untereinander (08),
asymmetrisch. In Fassung B steht die Figur als einziger Held rechts, am Telefon über dem Text (Spalten 3–4), am Schreibtisch daneben
(Spalten 8–11); Licht und Blick fallen nach links unten zum Text. Keine eigene Haarlinie: Oben schließt die des Kopfs (y 55–56), unten die
des Fußes.

**Raster.** Telefon: 4 Spalten à 77,5 px, Abstand 16, Rand 16. Schreibtisch: 12 Spalten à 64,67 px, Abstand 24, Spalte x 120–1160.
Pixeltabellen stehen in G.

**Verhältnisse.** Die drei Ringe sind gleich breit und gleich hoch. Am Telefon füllen sie die ganze Spaltenbreite (358 × 52), am
Schreibtisch die Spalten 1–4 (331 × 52). Abstände nach G6 im Verhältnis 1 : 3 : 6: Kicker → h1 8, h1 → Satz 16, Satz → Ringe 24, zwischen
den Ringen 12, Abschnitt → Fuß 96/128. Die Figur misst am Telefon 171 × 214 (11 % des Bildschirms), am Schreibtisch 331 × 414 (13 %). Beide
Werte liegen unter dem Bildanteil von höchstens 20 %, den Stufe 1 erlaubt (DG 2.4.2). Fläche im ersten Telefon-Bildschirm (Fassung B):
Text ≈ 9 %, Ringe ≈ 17 %, Figur 11 %, Kopf 7 %, frei ≈ 56 % (Soll ≥ 33 %).

**Größenhierarchie.** Figur (214 px hoch, ≥ 3 × Bedienschrift; G4, DNA-B Regel 6) > h1 32/40 > Ringtext und Satz 17 > Kicker 13. Das
ergibt eine Headline-Stufe und eine Klein-Stufe, dazu das nicht-textliche Hauptelement (DG 2.2.18). Die Ringe tragen ihr Gewicht über
die Kontur, die h1 über Größe und Helligkeit.

**Ebenen.** Z 0 Grund `#161616` → Z 20 Figur (nur B, freigestellt, `pointer-events: none`) → Z 30 Text und Ringe → Z 40 Kopf. Die Figur
verdeckt nichts und wird von nichts verdeckt.

**Technische Startwerte** (in `recht.css`, nur Tokens aus `gemeinsam.css`)

```css
.nf { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 16px;
  max-width: none; margin: 0; padding: 48px 16px 96px; }               /* überschreibt main in recht.css:26 */
.nf.mit-figur { padding-top: 16px; }
.nf-text { display: contents; }                                         /* Kicker teilt am Telefon die Zeile der Figur */
.nf-kicker { grid-column: 1 / 3; grid-row: 1; align-self: end; margin: 0; font-size: 13px; line-height: 17px;
  font-weight: 600; letter-spacing: .12em; text-transform: uppercase; font-variant-numeric: tabular-nums; color: var(--accent); }
.nf h1, .nf-satz, .nf-wege { grid-column: 1 / -1; }
.nf h1 { margin: 8px 0 0; font-size: 32px; line-height: 34px; font-weight: 800; letter-spacing: -.03em;   /* K-18 */
  color: var(--text); text-wrap: balance; }
.nf-satz { margin: 16px 0 0; font-size: 17px; line-height: 26px; font-weight: 500; color: var(--text2); }
.nf-satz > span { display: block; }
.nf-satz code { font: inherit; color: var(--text); white-space: nowrap; }  /* statt code 15 px, recht.css:71 */
.nf-wege { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 12px; }
.nf-wege .nf-weg { width: 100%; justify-content: space-between; padding: 0 20px; white-space: normal; text-align: left;
  box-shadow: inset 0 0 0 2px var(--muted);              /* K-1; schlägt .btn.ghost (--line2), weil recht.css nach gemeinsam.css lädt */
  transition: box-shadow var(--t1) var(--e-out), background-color var(--t1) var(--e-out); }
.nf-wege .nf-weg:active { background-color: var(--surface2); transform: none; transition-duration: 0s; }  /* K-4: Druck sofort, zurück mit --t1 */
.nf-weg svg { flex: none; width: 8px; height: 14px; color: var(--muted); transition: color var(--t1) var(--e-out); }   /* Chevron K-31 */
.nf-figur { grid-column: 3 / 5; grid-row: 1; margin: 0; aspect-ratio: 4 / 5; pointer-events: none; }
.nf-figur img { display: block; width: 100%; height: 100%; object-fit: contain; }
@media (min-width: 1024px) {
  .nf { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; max-width: 1040px; margin: 0 auto;
    padding: 96px 0 128px; align-items: center; }
  .nf.mit-figur { padding-top: 96px; }
  .nf-text { display: block; grid-column: 1 / 7; grid-row: 1; }
  .nf h1 { font-size: 40px; line-height: 42px; }
  .nf-wege { width: calc((100% - 5 * 24px) / 6 * 4 + 3 * 24px); }      /* Spalten 1–4 */
  .nf-figur { grid-column: 8 / 12; }
}
@media (min-width: 1024px) and (max-width: 1087px) { .nf { padding-inline: 32px; } }
```

Begründungen: Titel 32/34 und 40/42 px, also 1,05 auf ganze Pixel (Bühnenstimme, K-18; DG 2.2.18), Satz 1,55 (DNA-B). Kicker 600
und +0,12 em wie jede Versalzeile (K-17); „FEHLER 404“ (94 px) bleibt auch bei 360 und 320 px einzeilig, der Rückfall +0,08 em wird nicht
gebraucht. Ringkontur `--muted` (5,81 : 1) statt `--line2` (1,59 : 1), weil sie die einzige Grenze des Ziels ist (3 : 1; K-1, DG-E-10).
Hover über `.btn.ghost:hover` (`gemeinsam.css:66`, Kontur → `--ink` = `--text`). Fester Abstand statt `8vh` (`recht.css:46`), damit
die Lage auf jedem Telefon gleich ist. Zwei Blockzeilen, weil beide Sätze bei 390 px einzeln passen (287 und 323 px, gemessen mit Inter
aus `web/fonts/`) und `…/app/#k-…` nie zerrissen wird.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung (A / B) | Intensität 0–4 | Wirkung, Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achsen | A: Grund und Bedienschicht, flach. B: Figur als dritte Ebene neben dem Text, ohne Verdeckung (Arbeitsansicht: Verdeckung ist Ziel, nicht Pflicht) | 1 | Ruhe; nichts lenkt von den Wegen ab |
| Material, Transparenz | Bedienschicht opak und matt, kein Glas (DG 2.4.1). B: einziges Material ist die fotorealistische Figur | 0 / 1 | echtes Material statt Symbol (SKILL:41) |
| Licht, Schatten | A: keines. B: nur im Bild eingebacken; Quelle ist die Öffnung des freistehenden Rahmens, Richtung nach Haus-Token oben rechts → links unten (`--licht-x` −0,6, `--licht-y` 0,8; K-24, DG 2.2.0, DG-E-8); ein Lichtfleck am Boden statt Schlagschatten (DG-AB-1); kein CSS-Licht, keine Lichtkante, weil weder Figur noch Ringe schweben (K-24) | 0 / 1 | zitiert das Zeichen: Licht fällt durch ein Fenster in einen dunklen Raum |
| Formen | Pillen mit voller Rundung, innere 2-px-Kontur `--muted` (K-1); keine Karte, kein Radius am Bild; eine Formfamilie | 1 | dieselben Ringe wie im Kopf und auf allen Seiten |
| 3D-Objekte, Perspektive | keine, frontal (Nr. 1) | 0 | – |
| Bildintegration | B: freigestellt, rahmenlos, läuft in den Grund; keine Fotokarte (DG-AB-9) | 0 / 1 | Ein Raum statt Bild in der Box (DNA-B Regel 7) |
| Oberflächendetails | 8 × 14 px großer Chevron in `--muted` je Ring als Zeichen eines internen Ziels (K-31), `tabular-nums` im Kicker | 1 | Präzision als Feindetail |
| Animation | nur Zustände; B: Figur blendet einmal über Deckkraft ein (F) | 1 | ein bewegter Träger je Ansicht (E-2) |
| Typografie | Bühnenstimme h1, Technikstimme Kicker, Lesetext 17; ein grünes Wort | 1 | Hierarchie über Größe und Tonwert (DG-E-1 C) |
| Überlagerungen | keine | 0 | – |
| Interaktive Effekte | Hover: Kontur hellt auf; Druck: Füllung; Fokus: eigene Kontur; kein Skalieren, kein Magnet, kein wandernder Pfeil (DNA-B B.3.7) | 1 | eindeutige Rückmeldung ohne Bewegung der Bedienschicht |

Signature-Effekte: keine, weder informierende noch inszenierende (08 8.3.11: 404 Stufe 1, Budget 0).

**Bewusst weggelassen:** Cream (keine Zielhandlung, 08); Glas; Lichtraum; Messraster, Maßlinie; Riesenwort „404“ (nur Verkaufsflächen,
Prüfsuite); Rahmenbruch (DG-AB-18); Video oder Schleife der Figur; Parallaxe; großes Zeichen als Ersatzheld (steht schon im Kopf); Liste
„beliebte Seiten“ (steht im Fuß); Pfeilkreis `.pf` (gefüllt, 28 px, nur an der Cream; K-31).

**Abweichungen von bestehenden Regeln** – jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**

| Nr. | bestehende Regel | hier | Begründung |
|---|---|---|---|
| NF-AB-1 | „Überall sonst steht das Foto in einer Fotokarte“ (GEST:34); heute `.foto-karte` (`recht.css:86-88`) | Figur freigestellt, ohne Karte | DG-AB-9; DNA Nr. 4 |
| NF-AB-2 | `--muted` „nur für Labels und Nebenzeilen“ (GEST:24); Ghost-Rand `--line2` (GEST:93, `gemeinsam.css:58`) | Ringkontur `--muted`, Hover `--text`, Druck `--surface2` (K-1) | 3 : 1 für die einzige Grenze (WCAG 1.4.11; DG-E-10); gebündelt als DS-AB-10 |
| NF-AB-3 | Kicker 800 mit Sperrung .18em (GEST:26; `gemeinsam.css:44`) | Technikstimme 600 mit Sperrung .12em (K-17) | DR 3.2; DG 2.2.18; gebündelt als DS-AB-1 |

## E. Visual Attention Architecture

Die Angaben beschreiben die erwartete Aufmerksamkeit aus der Komposition. Gemessen ist nichts.

- **Fassung A:** primär die h1 (größte, hellste Schrift, 16,2 : 1), dann die Wegegruppe als größte Bedienmasse (≈ 17 % des Bildschirms);
  sekundär Kicker und „nicht.“ in Grün (10,5 : 1, klein). Den Satz (10,8 : 1) lesen nur, die ihn brauchen.
- **Fassung B:** primär die Figur, einziger warmer Fleck, oben rechts; dann diagonal nach links unten über die h1 zu den Ringen, gestützt
  von Lichtfall und Blick der Figur **[H]**. Blinzeltest: genau ein Fleck (DG 2.4.4/1).
- **CTA:** drei gleich schwere Ringe, Rang nur über die Reihenfolge; der Besucher ordnet sich selbst zu. Keine Cream konkurriert.
- **Ablenkungen:** am Schreibtisch die Kopflinks „Für Fensterbauer“ und „Fenster ausmessen“ (doppeln Ring 3 und 2, gewollt: der Kopf ist
  überall gleich); am Telefon das Menüzeichen; der Fußanschnitt 96 px tiefer ist Fortsetzungssignal (8–25 %).
- **Übergang:** nativ in den Fuß; seine Haarlinie trennt Inhalt und Kleingedrucktes.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Begründung | weniger Bewegung |
|---|---|---|---|---|
| Laden (A) | Text steht sofort, kein Auftritt. Das Zeichen im Kopf leuchtet einmal (1,6 s, GEST:7) | – | T12 „Bewegung keine“; Seite ohne Ladeauftritt (`rh-01` D) | Zeichen ruhig |
| Laden (B) | Figur blendet nach `img.decode()` über Deckkraft ein; unter 100 ms sofort, nach 1,5 s spätestens ohne Animation. Das Zeichen leuchtet hier nur bei Berührung | 320 ms `--t3`, `--e-out` (K-4; die SG-Werte 400 ms und `--kurve-ein` entfallen) | ein Träger (E-2); nichts springt (SKILL:48); Stufe 1 ohne Versatz | sofort sichtbar |
| Scrollen | nativ, nichts gekoppelt | – | Stufe 1 | gleich |
| Hover (`hover: hover`) | Kontur und Chevron `--muted` → `--text` (K-1) | `--t1` 150 ms, `--e-out` (K-4) | ein Hover-Kanal (DNA-B B.3) | gleich |
| Druck | Füllung `--surface2`, keine Skalierung (`gemeinsam.css:65` hier aufheben; K-1, K-2) | sofort; zurück mit `--t1` 150 ms, `--e-out` (K-4) | DNA-B B.3.7 | gleich |
| Fokus | 2-px-Kontur `--text`, Abstand 2 px, Radius bleibt Pille (gegen `:focus-visible { border-radius: var(--r1) }`, `gemeinsam.css:38`) | sofort | SG 10.10 Nr. 17 | gleich |
| Klick | normaler Seitenwechsel; eine Überblendung zwischen Seiten entscheidet die ganze Website, nicht dieser Abschnitt | – | – | – |

Es gibt keine räumliche Transformation und keine Richtung; die Bedienschicht bewegt sich nicht (G1). Ohne JavaScript ist die Figur
sofort sichtbar, weil nur das Skript die Klasse `html.js` setzt, an der die Ausblendung `.js .nf-figur img:not(.da)` hängt.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Eigenständige Komposition, geplant auch für die reale Höhe von 664 px. Alle drei Ringe
liegen in beiden Fassungen über y 664 und sind mit dem Daumen erreichbar.

| y (A) | y (B) | Element | x, Maß |
|---|---|---|---|
| 0–56 | 0–56 | Kopf neutral | `rh-01` |
| – | 72–286 | Figur | x 203–374, 171 × 214 |
| 104–121 | 269–286 | Kicker | x 16–110, in B unten bündig mit der Figur |
| 129–197 | 294–362 | h1, zwei Zeilen „Diese Seite“ / „gibt es nicht.“ (`text-wrap: balance`) | x 16, 166 bzw. 193 px breit |
| 213–265 | 378–430 | Satz, zwei Zeilen | x 16, 287 bzw. 323 px |
| 289–341 | 454–506 | Ring „Zur Startseite“ | x 16–374, Label links ab x 36, Chevron bei x 346–354 |
| 353–405 | 518–570 | Ring „Zur App“ | wie oben |
| 417–469 | 582–634 | Ring „Für Fensterbauer“ | wie oben |
| 565 | 730 | Haarlinie des Fußes | `rh-03` |

**360 px:** Figur 156 × 195, Satz zweizeilig. **320 px:** Satz dreizeilig (Umbruch vor `…/app/#k-…`), Figur 136 × 170, kein Querscrollen.
**640–1023 px:** 8 Spalten, Abstand und Rand 24; Text in den Spalten 1–6, Ringe 1–4, Figur 6–8 in Zeile 1. **200 % Text:** Ringe wachsen,
Labels brechen um.

**Schreibtisch 1280 × 800.** Kopf 64 px, Text in den Spalten 1–6 (x 120–628), Ringe in den Spalten 1–4 (x 120–451). Nichts wird
vergrößert; die Schrift endet bei 40 (SKILL:28).

| y (A) | y (B) | Element |
|---|---|---|
| – | 160–574 | Figur, Spalten 8–11, x 741–1071, 331 × 414 |
| 160–177 | 198–215 | Kicker (B: Textblock senkrecht mittig zur Figur) |
| 185–227 | 223–265 | h1 einzeilig, 456 px |
| 243–295 | 281–333 | Satz, zwei Zeilen |
| 319–499 | 357–537 | drei Ringe 331 × 52, Abstand 12 |
| 627 | 702 | Haarlinie des Fußes; in B sind 98 px sichtbar (12 %) |

In Fassung A bleiben die Spalten 7–12 frei; die Figur kommt später dorthin, ohne dass sich der Text verschiebt.

**Schreibtisch 1024 × 768.** Rand 32, Spalte x 32–992, Spalten à 58 px. Text in den Spalten 1–6 (x 32–500); die h1 (456 px) passt in eine
Zeile, sonst bricht sie zweizeilig um (+42 px). Ringe 304 × 52 (Spalten 1–4). Figur in den Spalten 8–11, x 606–910, 304 × 380, y 160–540.
Haarlinie des Fußes bei y 668, sichtbar sind 100 px (13 %).

## H. Technische Umsetzung

**Bestehend (Datei):** `web/404.html` (neues Markup; Titel, `lang`, Robots, Font-Preload bleiben); `web/assets/recht.css` (`.mitte`,
`.foto-karte` entfallen, `.knopf` bleibt fürs Widerrufsformular); `web/assets/gemeinsam.css` (Tokens, `.btn.ghost`, `.ak`; künftig auch
hier geladen, vor `recht.css`, weil `rh-01` den Kopf dort ablegt); `scripts/ratgeber-bausteine.mjs` (Kopf und Fuß); `worker.js:33-41` unverändert.

**Markup (neu)**

```html
<main id="inhalt" class="nf">            <!-- in Fassung B: class="nf mit-figur" -->
  <div class="nf-text">
    <p class="nf-kicker">Fehler 404</p>
    <h1>Diese Seite gibt es <span class="ak">nicht.</span></h1>
    <p class="nf-satz"><span>Vielleicht ist der Link unvollständig.</span>
      <span>Kundenlinks sehen so aus: <code>…/app/#k-…</code></span></p>
    <nav aria-label="Wege von hier"><ul class="nf-wege">
      <li><a class="btn ghost nf-weg" href="/">Zur Startseite <svg viewBox="0 0 8 14" aria-hidden="true" focusable="false">
        <path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a></li>
      <!-- ebenso /app/ „Zur App“ und /fuer-fensterbauer/ „Für Fensterbauer“ -->
    </ul></nav>
  </div>
  <figure class="nf-figur"><img src="/bilder/foto/fehler-figur-800.webp" srcset="… 480w, … 800w"
    sizes="(min-width: 1088px) 331px, (min-width: 1024px) 304px, (min-width: 640px) 33vw, calc(50vw - 24px)"
    width="800" height="1000" alt="…" fetchpriority="high" decoding="async"></figure>   <!-- nur Fassung B -->
</main>
```

Das DOM folgt der Lesefolge (DNA-B B.2); die Figur ist nicht fokussierbar.

**CSS:** Startwerte aus C, dazu `@media (forced-colors: active) { .nf-wege .nf-weg { border: 2px solid ButtonText; box-shadow: none } }`, denn
`box-shadow` verschwindet in diesem Modus. **Skript (nur Fassung B):** `web/assets/fehler.js`, etwa zehn Zeilen, im `<head>` ohne
`defer`. Inline geht nicht, denn die CSP erlaubt nur `script-src 'self'` (`functions/seo.js:69`). Das Skript setzt `html.js`, ruft bei
`DOMContentLoaded` `img.decode()` auf, setzt dann `.da` und hat einen Zeitgeber von 1,5 s.

**Assets.** Fassung A braucht keine. Fassung B braucht die Figur. Zweck: kleiner, ruhiger Held der Fehlerseite in Stufe 1. Sie ist
beim Inhaber anzufragen (SKILL 7):

| Feld | Vorgabe |
|---|---|
| Format | PNG mit Transparenz, ersatzweise einfarbig grüner Hintergrund zum Freistellen; 1.200 × 1.500 px (4:5). Figur und freistehender Fensterrahmen ganz im Bild, unten etwa 8 % Luft, nichts angeschnitten |
| Motiv | Inhaber wählt: (a) Katze im freistehenden Fensterrahmen (`docs/BILDER.md:73`); (b) Astronaut (`docs/BILDER.md:23`; SKILL:120) |
| Licht, Blick | eine warme Quelle von oben rechts nach Haus-Token (`--licht-x` −0,6, `--licht-y` 0,8; K-24), die durch die Rahmenöffnung als Lichtfleck nach links unten auf den Boden fällt; kein Schlagschatten; Blick der Figur nach links unten |
| Nicht drin | Text, „404“, Zahlen, Logos, Wasserzeichen, Wand, Wiese bis zum Rand, Hintergrund |
| Prompt (Englisch, für [a]) | „A cat sitting calmly inside a single freestanding white window frame, no wall around it, isolated on a plain solid green background, warm late-afternoon light from the upper right falling through the frame onto the ground towards the lower left, the cat looking down to the left, photorealistic, highly detailed fur, subtle film grain, full figure and frame visible with empty space at the bottom, no text, no numbers, no logos, no watermark, aspect ratio 4:5“ |

Verarbeitung: `scripts/fotos.py` schreibt heute nur RGB (`im.convert('RGB')`). Der neue Platz `fehler-figur` braucht WebP mit Alphakanal
in 480 × 600 und 800 × 1.000 (Schätzung 40–140 KB, zu messen). Danach `docs/BILDER.md:44` nachziehen. Der Platzhalter `fehler.webp` bleibt
ungenutzt liegen.

**Animationstechnik:** CSS-Übergänge auf `opacity` und Farbe; keine Bibliothek, kein WebGL (Technikstufe 1, SKILL:56).
**Leistung:** Fassung A hat kein Bild, das LCP ist die h1, kein Layoutsprung. Fassung B hat feste Maße (`width`/`height`, `aspect-ratio`),
`fetchpriority="high"`, CLS 0 und keine Schleife.
**Barrierefreiheit:** eine h1; `main#inhalt` als Ziel von „Zum Inhalt“; `nav` mit Namen; Ziele 52 px hoch; Kontraste wie in E; Fokus
sichtbar mit Pillenradius; Reflow bei 320 px; 200 % Text; Chevron `aria-hidden`.
**Prüfsuite** (`scripts/pruefen.mjs:124-131` erweitern): Status 404, Titel und Logo wie bisher; dazu drei Links mit `/`, `/app/`,
`/fuer-fensterbauer/`, kein `.btn.primary`, nur Schriftgrößen 13/17/32 bzw. 40, kein Verweis auf `fehler.webp`; ein Bild nur, wenn die
Datei nicht der Platzhalter ist (3.494 B).

## I. Conversion-Begründung

- **Warum hier:** Die Fehlerseite ist ein Ende ohne Inhalt; wer keinen Weg sieht, geht. Erklärung und Wege stehen deshalb zusammen im
  ersten Bildschirm.
- **Wie die Gestaltung hilft:** Die h1 sagt in fünf Wörtern, was passiert ist; die drei Ringe entsprechen den drei Gruppen (EA 4.1). Neu
  führt ein Weg zur Seite für Fensterbauer und damit zur einzigen Kaufhandlung (Z1). Ohne Cream wird keine Gruppe vorgezogen. Die Figur
  bringt den Humor der Bildwelt (DR 3.4) und nimmt dem Fehler die Härte **[H]**.
- **Informationsmenge:** ≈ 23 Wörter, ein Satz Hilfe für den Sonderfall Kundenlink; mehr Text drückte die Ringe unter den ersten
  Bildschirm, weitere Links stehen im Fuß.
- **Beitrag zur Zielhandlung:** indirekt; Besucher, die sonst verloren wären, kommen auf ihren Weg zurück.

**Zu testende Annahmen** (keine Messung vorhanden; Prüfwege nach DG 2.6.2)

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| NF-H-1 | Die Reihenfolge Startseite → App → Fensterbauer passt zu den Besuchern | Zähler `aufruf:404` ohne Pfad in `statistik.js` (Vorschlag, nicht Teil dieser Spezifikation), dann Herkunft prüfen | Reihenfolge nach Daten |
| NF-H-2 | Linksbündige Labels mit Chevron lesen sich schneller als „Wege“ als mittige | Sichtprüfung des Inhabers, Telefon-Video | mittige Labels ohne Chevron |
| NF-H-3 | Die Figur macht den Fehler freundlicher, ohne von den Ringen abzulenken | Blinzeltest, Lesetest: „Wohin würden Sie tippen?“ | Fassung A bleibt |
| NF-H-4 | Der Satz zu Kundenlinks hilft Hauseigentümern mit abgeschnittenem Link | Lesetest mit einem gekürzten Link | Satz entfällt; „Zur App“ trägt allein |

Fassung A setzt die Ausnahme DG-E-1 C voraus (reine Textansicht als dokumentierte Ausnahme). Lehnt der Inhaber C ab, gilt bis zur Figur
DG-E-1 B: h1 40 px auch am Telefon. Sie bleibt zweizeilig (207 bzw. 241 px), die Ringe enden dann bei y 485. Das ist ebenfalls eine
**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (GEST:449, SKILL:69).

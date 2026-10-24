# H7 Abschluss: Messaufforderung

Seite: Startseite `/#hauseigentuemer` (Ansicht Hauseigentümer) · Position: 7 von 7, nach H6 Häufige Fragen, vor `st-04-wechselkarte` · Intensitätsstufe: 2 (Typ T11 Abschluss)

Kürzel: ZA = 08-zielarchitektur, EV = 07-expertenvergleich, DG = 02-design-grammatik, EA = 04-entscheidungsarchitektur, IA =
05-informationsarchitektur, PA = 01-projektanalyse, SG = design-dna/04-styleguide, DNA-B = design-dna/05-ergebnis-b-styleguide, GEST =
docs/GESTALTUNG.md, SKILL und DR = premium-gestaltung/SKILL.md und designrichtung.md. **[V]** verbindlich, **[H]** Hypothese. Alle Lagen
sind geplant und an einem Modell im Arbeitsverzeichnis nachgemessen, nicht an Besuchern.

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | Abschluss: Messaufforderung, `he-07-abschluss`; T11, Stufe 2 (ZA 8.3.4) |
| Lage | letzter Inhaltsabschnitt der Ansicht; Telefon Bildschirm 7–8 bei 664 px, 0,45 BH (≈ 380 px, 6 % der Ansicht). Davor H6 (Stufe 1, Fragenliste ohne Bild), danach Wechselkarte (Stufe 2, Ring) und Fuß. Rhythmus 1 · 2 · 2 |
| Ziel | Die Ansicht endet mit dem Start statt mit dem Wechsel (EA H-D12). Heute ist die letzte starke Handlung die Cream „Pakete ansehen“ der Fensterbauer-Karte (`web/assets/portal.js:787-790`; bestand/browser-mobil.md S8; PA 1.9/4) |
| beantwortete Frage | „Fange ich jetzt an?“ (EA B4 Handeln) |
| vorbereitete Entscheidung | Z2a: Messen beginnen über `/app/#ausmessen`, danach Z2 in der App; Gruppen HE-3, HE-5 (ZA 8.2.8) |
| bewusst nicht | keine neuen Argumente (H1–H6 haben sie), keine Führung (Ring in H1, H4 und im Menü), keine Pakete, keine Pakete­preise (IA 5.6; EA O-25) |

## B. Konkreter Inhalt

| Element | Inhalt | Fundstelle |
|---|---|---|
| Bildband (Held) | Ausschnitt des Startfotos: Waschbär mit Zollstock, Handy in der Pfote, Laibung aus Ziegeln, Tageslicht in der Öffnung, Gerüst | `web/bilder/foto/start-hauseigentuemer.webp` (1250 × 1250); docs/BILDER.md:30; Einsatz in H1 `portal.js:852-853` |
| h2 | **Textentwurf** „Das erste Fenster ausmessen.“, grün „erste“ [H, I] | IA H6; ZA 8.3.4 H7 |
| h2, angefangenes Aufmaß | **Textentwurf** „Das nächste Fenster ausmessen.“, grün „nächste“ | Zustand aus `eigenesAufmass()` (`portal.js:20`) |
| Preiszeile, 2 Zeilen | **Textentwurf**, wortgleich mit H1: „Messen **kostenlos**, ohne Konto“ / „Aufmaßblatt **7,99 €** bis 17.11.2026, danach 12,99 €“; nach dem Stichtag nur „Aufmaßblatt **12,99 €**“. Kein Countdown (R13) | ZA 8.3.4 H1; `web/index.html:61-62`; Werte `web/config.js:12-14`, `Abrechnung.preise()` und `.einfuehrung()` (`web/assets/modell.js:1112-1122`) |
| Cream-Pille | „Jetzt ausmessen“ → `appEinstieg()` = `/app/#ausmessen`; mit angefangenem Aufmaß „Aufmaß fortsetzen“ → `/app/` | `portal.js:17-18`, `:852`; GEST:192 |
| Zeile unter der Pille (nur Fortsetzen) | **Textentwurf** „2 Fenster erfasst, gespeichert in diesem Browser.“ (Zahl aus `eigenesAufmass()`; ohne Anrede, EA O-13) | gekürzt aus `portal.js:852` („Ihr Aufmaß ist angefangen: …“) |

Rund 20 Wörter. Eine Interaktion: der Link der Pille. Nutzbar vorhanden: `.btn.primary` mit Pfeil im Kreis `.pf` (`web/assets/gemeinsam.css:62-76`),
`akSatz(satz, i)` für das grüne Wort (`portal.js:314`), `eur2()` (`portal.js:10`), `kopfCta()` (`portal.js:551`), Tokens
(`gemeinsam.css:9-32`), die Auslauf-Maske von `.hero-foto` als Vorbild (`web/assets/portal.css:243-247`, `:536`).

## C. Exakte Layoutkomposition

**Grundstruktur Telefon [V].** Eine Spalte über alle 4 Rasterspalten, Ordnungslinie x = 16. Bühnenfolge nach DG G2 („Held über dem
Kopf“): Bildband randlos oben, h2 im Auslauf des Bands, darunter Preiszeile, darunter die Pille. Asymmetrie als Diagonale: Bildgewicht
(Gesicht, Öffnung mit Tageslicht) oben Mitte bis rechts, Lesestapel links, Pille als breiter Riegel unten.

| y im Abschnitt (390 × 844) | Element | Maß |
|---|---|---|
| 0 | Haarlinie 1 px `--line`, x 16–374 (ohne Nummer, Anhänge tragen keine, E-AB-10) | – |
| 0–200 | Bildband, x 0–390 (randlos), Z 20 | 390 × 200; Maske: 0–24 einblenden, 24–128 voll, 128–200 ausblenden |
| 176–243 | h2, zwei Zeilen „Das erste Fenster“ / „ausmessen.“, Zeile 1 ≈ 261 px breit; überdeckt den Bandfuß um 24 px | 32 / 1,05 |
| 259–295 | Preiszeile, zwei Zeilen, Zeile 2 ≈ 307 px | 13 / 18 |
| 319–371 | Cream-Pille, volle Spaltenbreite | 358 × 52 |
| 383–401 | nur bei angefangenem Aufmaß: Zeile 13 / 18 | ≈ 313 px |
| Ende | 371 bzw. 401 px = 0,44–0,48 BH; danach 96 px bis zur Wechselkarte (DG G6) | – |

**Verhältnisse Telefon.** Band = 24 % der Bildschirmhöhe (Stufe 2: 20–50 %). Innerhalb des Abschnitts Bild ≈ 54 %, Text und Pille ≈ 34 %,
reiner Grund ≈ 12 %; im Bildschirm mit den 96-px-Abständen und dem Anschnitt der Wechselkarte bleiben geschätzt ≥ 40 % ruhig. Größenhierarchie:
Kopf des Waschbären ≈ 78 px hoch > h2-Versalhöhe ≈ 23 px > Kleinschrift-Versalhöhe ≈ 9,5 px (Sprung ≥ 3, DNA-B Regel 6); drei
Schriftgrößen 32 · 17 · 13.

**Ebenen [V].** 0 Grund `#161616` → 20 Bildband (Bildschicht, `aria-hidden`) → 30 Bedienschicht (Haarlinie, h2, Preiszeile, Pille,
Fortsetzen-Zeile) → 40 Kopf (klebt, opak). Drei Bildebenen plus Kopf, eine Verdeckung (h2 über dem Bandfuß). Interaktiv ist nur die Pille,
unten im Daumenbereich.

**Grundstruktur Schreibtisch.** Spiegel des Startbilds (DR 3.3; ZA H1 „Split 5 : 7“) als Klammer: 1280 = Text über Spalte 1–5 (x 120–539),
Band ab Spalte 6 (x 563) randlos bis zum Fensterrand; 1024 = 6 : 6 (Begründung in G).

**Technische Startwerte**

| Wert | Startwert | Begründung |
|---|---|---|
| Bandhöhe Telefon | `clamp(160px, 51.3vw, 240px)` → 200 bei 390 | ZA 390 × 200; skaliert bis 320 px ohne Querscrollen |
| Ausschnitt Telefon | x 150–1250, y 120–684 des Startfotos (1100 × 564, Seitenverhältnis 1,95 = 390 : 200) | Kopf und Handy liegen bei y ≈ 21–121, bis auf die Ohrspitzen in der vollen Zone (24–128); die Öffnung am rechten Rand; 2,8 Bildpunkte je CSS-Pixel |
| Maske Telefon | `linear-gradient(to bottom, transparent 0, #000 12%, #000 64%, transparent 100%)` | drei Stopps; kurzer oberer Auslauf, weil darüber nur Grund und Haarlinie liegen |
| Versatz h2 | `margin-top: -24px` | am Modell gemessen: schlechteste Stelle hinter der h2 6,4 : 1 (große Schrift braucht 3 : 1); ab −32 px fällt sie auf 4,0 : 1, ab −50 px auf 2,1 : 1, deshalb nie höher als −32 px |
| Abstände | h2 → Preiszeile 16, Preiszeile → Pille 24, Pille → Fortsetzen-Zeile 12 | GEST-Raster 4 px; Gruppe : Gruppe ≈ 1 : 3 (DG G6) |
| Bühnenstimme | Inter 800, 32 / 40 px, Zeilenabstand 1,05, Laufweite −0,03 em, `text-wrap: balance` | DG 2.2.18 |
| Preiszeile | 13 px, 500, `--muted`, Beträge und „kostenlos“ 700 in `--text`, `tabular-nums` | wie H1 (ZA); DG-E-6 offen |
| Pille | `--h2` 52 px, Schrift 17 / 700, `.pf` 28 px | GEST Kontrollhöhen; DG G2 |

## D. Anwendung der Design-DNA

Verbindlich gelten alle zwölf Regeln aus DNA-B B.1 (Bühnenansicht). Variable Merkmale sind auf Stufe 2 und T11 gedrosselt; Signature-Effekte
gibt es keine (DG Dosierregel 1: Entscheidungsflächen ohne inszenierende Signature; ZA 8.3.11 „`he-03` bis `he-07` ≤ 2“).

| Eigenschaft | Ausgestaltung, Position | Intensität 0–4 | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen, Verdeckung h2 über Bandfuß | 2 | Text liegt im Bild, nicht daneben: Raum statt Kasten |
| Material, Transparenz | nur das Foto (Putz, Ziegel, Fell, Papier des Zollstocks); kein Glas | 1 | echtes Material statt Symbol (SKILL:41) |
| Licht, Schatten | Tageslicht aus der Öffnung rechts, nur im Foto; keine CSS-Lichtfläche, kein Schatten | 1 | eine Lichtrichtung wie in H1; Licht trägt den Fokusreiz (DG G3) |
| Formen | Pille in Vollrundung, Haarlinie; Band ohne Radius | 2 | eine Formfamilie (DNA-B Regel 8) |
| 3-D-Objekte | keine | 0 | – |
| Bildintegration | randlos, kantenlos, oben und unten in den Grund auslaufend; am Schreibtisch auch nach links | 2 | Klammer zum Startbild (DG-H-8); kein Grundsprung |
| Oberflächendetails | Haarlinie, Pfeil im Kreis, gleich breite Ziffern im Preis | 1 | Präzision ohne Schmuck |
| Animation | keine | 0 | siehe F |
| Typografie | Bühnenstimme mit einem grünen Wort, sonst Klein-Stufe | 2 | „erste“ trägt das einzige Signal |
| Überlagerung | h2 24 px im Auslauf | 1 | Verankerung ohne Schatten |
| Perspektive | nur im Foto; Bedienschicht frontal | 1 | – |
| interaktive Effekte | nur Zustände der Pille | 1 | Ruhe neben der Entscheidung |

**Bewusst weggelassen:** Maßlinie am Zollstock (eine informierende Signature je Ansicht steht in H2), Glas, Lichthof, Parallaxe, Zoom
des Fotos, Auftritt, Chips auf dem Foto, Ring „Führung starten“, „Beispiel“-Marke (das Foto zeigt keine erfundenen Werte), zweite Fotokarte.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Primärer Fokus:** Gesicht und Handy des Waschbären im Band, gestützt vom hellsten Bildteil (Tageslicht, Wand). Er wiederholt den ersten
   Eindruck der Seite.
2. **h2** als größte Schrift direkt darunter; das grüne „erste“ ist der einzige Farbreiz der Bedienschicht.
3. **Sekundärer Fokus, Handlung:** Cream-Pille, größte Bedienfläche des Bildschirms (358 × 52, ≈ 5,6 % der Fläche), Kontrast der Fläche zum Grund
   ≈ 16 : 1; im Telefon-Ruhestand (Pille bei y ≈ 600–650) im Daumenbereich.
4. **Preiszeile** liegt auf dem Weg von 2 nach 3 und wird beim Abwärtslesen gestreift; geringes Gewicht (13 px), Beträge fett.

**Kontraste:** h2 ≥ 6,4 : 1 gegen die ungünstigste Bandstelle (Modell), Preiszeile `--muted` 5,8 : 1, Pillenschrift ≈ 16 : 1. Farbanteile
am Modell bei 390 × 844: unbunt 83 %, farbig 6,9 %, kräftig 1,8 % (`farbanteil.py`; Richtwerte erfüllt).

**Mögliche Ablenkungen und Gegenmittel:** Kopfknopf „Fenster ausmessen“ mit gleichem Ziel, als Ring zurückgenommen (ZA N3; `kopfCta()`
erfasst die Pille automatisch); helle Wand und Himmel im Band, durch den Auslauf begrenzt; Werkzeuggürtel hinter der h2, auf ≤ 33 %
Deckkraft ausgeblendet; orange Streifen des Gerüsts (klein, am Rand). **Schnittstelle zu `st-04`:** Die Wechselkarte steht 96 px darunter
im selben Bildschirm. Wird sie als helle Fläche gebaut („einzige helle Fläche“, ZA 8.3.3), wäre sie heller und größer als die Pille und
zöge den Blick vom Start weg. Bedingung dieses Abschnitts: Die Karte bleibt `--surface` mit 2-px-Ring und Ring-Knopf, ohne helle Füllung;
abzustimmen in der Spezifikation `st-04`.

**Übergang:** Nach der Pille führt der Blick über 96 px Grund zur Wechselkarte, die bei Pille im Daumenbereich unten ≈ 96 px angeschnitten
ist, dann in den Fuß. Kein Element zeigt zurück nach oben (E-4 sinngemäß).

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Scrollen | natives Scrollen; Band und Text stehen still, keine Parallaxe, kein Scrollbezug | – | T11 „keine außer Zustand“; E-13; GEST:41 |
| Erscheinen | kein Auftritt; der Abschnitt ist von der Klasse `.rv` ausgenommen (`portal.js:575`) | – | DG Dosierregel 1; DG-AB-2 |
| Laden des Bands | `loading="lazy"`; der Browser lädt mit seinem Vorlauf lange vor Sichtkontakt; bis dahin Grund in reservierter Höhe | – | kein Sprung (CLS) |
| Hover (Zeiger) | Füllung der Pille → `--primary-hover` | 150 ms, `--e-out` | Zustand über Füllung (DG G1) |
| Fokus | 2-px-Kontur `--ink`, Abstand 2 px (`gemeinsam.css:41`), sofort | 0 ms | sichtbar 3 : 1 |
| Drücken | Füllung `--primary-hover`, **keine** Skalierung: `transform: none` gegen `gemeinsam.css:65` | sofort | Bedienschicht formstabil (G1) |
| Klick | Seitenwechsel in die App (gleiche Herkunft), keine Übergangsanimation | – | die App übernimmt den Ladezustand |
| Kopf | `kopfCta()` schaltet den Kopfknopf auf Ring, solange die Pille im Bild ist | wie Bestand | ZA N3 |
| weniger Bewegung | identisch (es bewegt sich nichts) | – | ruhige Fassung = Endbild |

Zum Wunsch nach Tiefe und Physik (SKILL:43): Diese Ansicht hat ihre Bewegung im Fotoauftritt von H1 und in der Maßlinie von H2. H7 ist eine
Entscheidungsfläche; Tiefe entsteht hier aus Ebenen und Auslauf, nicht aus Bewegung (DG 2.2.8: Physik nur in der Bildschicht, ein bewegter
Träger je Ansicht).

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Komposition wie C. Ruhestand beim Scrollen: Band ≈ y 281–481, h2 ≈ 457, Pille ≈ 600–652, Anschnitt der
Wechselkarte ab ≈ 748. Bei 360 px: Band 185 px, h2 bleibt zweizeilig (261 < 328). Bei 320 px: Band 164 px, Maske prozentual, h2 zweizeilig
(261 < 288). Bei 390 × 664 ändert sich nur der Ausschnitt des Bildschirms; die Folge bleibt. 200 % Textzoom: h2 bis vier Zeilen, nichts
wird abgeschnitten, das Band behält seine Höhe.

**640–1023 px.** Telefonkomposition mit 8 Rasterspalten: Band randlos 240 px hoch (`object-position: 50% 40%`), Text links ab Seitenrand
32 px über höchstens 560 px, Pille in eigener Breite (≈ 218 px).

**Schreibtisch 1280.** Abschnitt 320 px hoch, 12 Spalten à ≈ 64,7 px, Abstand 24 px, Spalte 1040 px (x 120–1160). Haarlinie über alle 12
Spalten. Text über Spalte 1–5, senkrecht mittig: h2 40 / 42 in zwei Zeilen (y 54–138), Preiszeile (y 154–190), Pille 218 × 52 (y 214–266).
Band rechts 717 × 320 (x 563–1280), Startfoto ohne Zuschnitt, Maßstab 0,574, `object-position: 50% 0` (zeigt Bildzeilen 0–558: Kopf, Handy,
Zollstock, Öffnung). Maske links 0 → 40 % der Bandbreite, oben 0 → 16 %, unten 70 → 100 %. Das Band ist höchstens 920 px breit wie
`.hero-foto`; auf breiteren Fenstern beginnt es weiter rechts. Text : Bild : Grund ≈ 30 : 55 : 15 der Abschnittsfläche.

**Schreibtisch 1024.** Seitenrand 32, Spalte 960 px. Text über Spalte 1–6 (468 px), Band ab Spalte 7 (x 524–1024, 500 × 280), Abschnitt 280 px.
Grund für 6 : 6 statt 5 : 7: Die Fortsetzen-Überschrift „Das nächste Fenster“ ist bei 40 px 381 px breit; fünf Spalten (386 px) ließen
keinen Puffer und erzwängen eine dritte Zeile.

## H. Technische Umsetzung

**Bestehend:** `web/assets/portal.js` (`SCREENS.landing`, Ansicht Hauseigentümer `:851-858`; `appEinstieg`, `eigenesAufmass`, `akSatz`,
`eur2`, `kopfCta`, `afterRender`), `web/assets/modell.js` (`Abrechnung`), `web/assets/gemeinsam.css` (Tokens, `.btn.primary`, `.pf`,
`:focus-visible`), `web/assets/portal.css` (`.main { overflow-x: clip }` `:240`, Auslauf-Maske `:243-247`).

**Neu:**
- `abschlussHE()` in `portal.js`: liefert den Abschnitt; Aufruf nach H6, vor `wechsel('betrieb')`.
- `preiszeileHE()` als eine Quelle für H1, H7 und die Textfassung `st-05`: zwei Zeilen, Beträge aus `Abrechnung.preise().aufmass`,
  Einführung aus `.einfuehrung()`; Datum als „17.11.2026“ aus `einfuehrung().bis`.
- CSS-Block `.he-abschluss` in `portal.css`; Ausnahme in `afterRender`: Elemente mit `data-ruhig` erhalten kein `.rv`.
- `scripts/fotos.py`: Eintrag „Ausschnitt“ mit relativem Rechteck, Quelle das Original in `fotos-roh/`, sonst die Website-Datei; Eintrag in
  docs/BILDER.md.

**Markup (Reihenfolge = Lesefolge)**

```html
<section class="he-abschluss" data-abschnitt="he-07-abschluss" data-ruhig aria-labelledby="he07-titel">
  <div class="band" aria-hidden="true"><picture>
    <source media="(min-width: 1024px)" srcset="/bilder/foto/start-hauseigentuemer.webp" width="1250" height="1250">
    <img src="/bilder/foto/start-hauseigentuemer-band.webp" width="1100" height="564" alt="" loading="lazy" decoding="async">
  </picture></div>
  <div class="text">
    <h2 id="he07-titel">Das <span class="ak">erste</span> Fenster ausmessen.</h2>
    <p class="preis"><span>Messen <b>kostenlos</b>, ohne Konto</span><span>Aufmaßblatt <b>7,99 €</b> bis 17.11.2026, danach 12,99 €</span></p>
    <a class="btn primary" href="/app/#ausmessen">Jetzt ausmessen<span class="pf" aria-hidden="true"></span></a>
  </div>
</section>
```

Keine `id` am Abschnitt (GEST:191, Sprung beim Laden); die Fortsetzen-Zeile ist ein `<p class="hinweis" id="he07-stand">`, verbunden über
`aria-describedby` an der Pille.

**CSS-Startwerte (Kern)**

```css
.he-abschluss { position: relative; isolation: isolate }
.he-abschluss::before { content: ''; position: absolute; inset: 0 0 auto; height: 1px; background: var(--line); z-index: 30 }
.he-abschluss .band { position: relative; z-index: 20; height: clamp(160px, 51.3vw, 240px); margin-inline: calc(50% - 50vw); pointer-events: none }
.he-abschluss .band img { display: block; width: 100%; height: 100%; object-fit: cover;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 12%, #000 64%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, #000 12%, #000 64%, transparent 100%) }
.he-abschluss .text { position: relative; z-index: 30; margin-top: -24px }
.he-abschluss .btn { width: 100%; margin-top: 24px } .he-abschluss .btn:active { transform: none }
@media (min-width: 1024px) {
  .he-abschluss { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: center; min-height: 280px }
  .he-abschluss .text { grid-column: 1 / span 6; margin: 0 }
  .he-abschluss .band { position: absolute; inset: 0 calc(50% - 50vw) 0 auto; height: auto; margin: 0;
    width: min(calc(50vw + 50% - (100% + 24px) * 6 / 12), 920px) }
  .he-abschluss .band img { object-position: 50% 0; /* Maske nach rechts und senkrecht, mask-composite: intersect wie portal.css:246-247 */ }
  .he-abschluss .btn { width: auto }
}
@media (min-width: 1280px) { .he-abschluss { min-height: 320px } .he-abschluss .text { grid-column: 1 / span 5 }
  .he-abschluss .band { width: min(calc(50vw + 50% - (100% + 24px) * 5 / 12), 920px) } }
```

**Assets**

| Asset | Art, Format, Maß | Freistellung | Quelle |
|---|---|---|---|
| `start-hauseigentuemer-band.webp` (bis 1023 px) | Ausschnitt des Startfotos, relativ x 12 %, y 9,6 %, Breite 88 %, Höhe 45,1 %; WebP 1100 × 564, Qualität 82, ≈ 75 KB (am Modell) | keine, Auslauf per Maske | aus vorhandenem Material erzeugt |
| `start-hauseigentuemer.webp` (ab 1024 px) | vorhanden, 1250 × 1250 | – | vorhanden, aus H1 im Cache |
| Original des Startfotos, ≥ 2.000 px breit | für scharfe Darstellung bei doppelter Pixeldichte (717 CSS-px × 2 = 1.434 > 1.250) | – | beim Inhaber anfragen (optional) |
| Variante [H]: dieselbe Öffnung mit eingesetztem Fenster (KA-IA-11) | 1250 × 1250 WebP, gleiche Kamera, Figur und Lichtrichtung, ohne Text und Wasserzeichen | – | beim Inhaber (Flux), nur nach Freigabe |

**Animationstechnik:** keine; CSS-Übergang `background-color` 150 ms an der Pille (Technikstufe „Leicht“, SKILL:56).

**Leistung:** kein JavaScript außer dem Erzeugen des HTML; Band lazy und am Schreibtisch aus dem Cache; Maske auf einem 390 × 200 großen
Element ist billig, kein `filter: blur()`; feste Höhen gegen Layoutverschiebung. **Datenrisiko:** Ohne Server bleibt `aufmass: 7.99` nach dem
17.11.2026 in `web/config.js:12` stehen, die Zeile zeigte dann 7,99 € ohne Zusatz. Prüfpunkt: Wert zum Stichtag umstellen oder vom Server
(`/api/status`) beziehen, in H1 und H7 gleich.

**Barrierefreiheit:** `section` mit `aria-labelledby`; Band `aria-hidden`, `alt=""` (das Motiv ist in H1 beschrieben, SG 10.6); Lesefolge
h2 → Preis → Link → Stand; Ziel 52 px; `scroll-padding-top` ≥ Kopfhöhe + 12 px, damit der Fokus nicht unter dem Kopf liegt (ZA N12);
erzwungene Farben: Pille behält Systemkontur. Ohne JavaScript übernimmt die Textfassung `st-05` den Block (h2, Preissatz, Link
`/app/#ausmessen`) vor „Für Fensterbauer“.

**Prüfpunkte:** Prüfsuite-Schriftgrößen (32/40, 17, 13); eine Cream-Pille je Bildschirm (Abstand zur Cream von H2 ≥ 844 px); h2 nicht höher
als −32 px ins Band; Gesicht und Handy unverdeckt (SKILL:87); `.rv` greift nicht; `farbanteil.py` bei 390 × 844; Bilder bei 390 und 1280.

## I. Conversion-Begründung

**Position.** Wer bis H7 scrollt, hat Ergebnis, Preis, Datenfrage und Restzweifel gesehen. An der Stelle mit der meisten Information fehlt
heute die Handlung; die Ansicht endet mit dem Weg zu den Fensterbauern (PA 1.9/4). H7 setzt den Start dorthin, die Wechselkarte bleibt
als leiser Ring danach.

**Gestaltung.** Das Band holt den ersten Eindruck zurück und rahmt die Ansicht (DG-H-8). Die Preiszeile nennt den kostenlosen, kontofreien
Einstieg unmittelbar vor der Pille; dadurch steht die Entscheidung ohne Preisüberraschung (R13). Eine einzige Handlung erspart die Wahl
zwischen zwei Wegen; Unsichere finden die Führung in H1, H4 und im Menü.

**Informationsmenge.** Rund 20 Wörter, keine neue Aussage: Alles Begründende steht in H1–H6. Mehr Text würde die Entscheidung erneut öffnen.

**Beitrag zur Zielhandlung:** direkter Weg zu Z2a; mit angefangenem Aufmaß zurück in die eigene Arbeit (Z2).

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| H7-H1 | Eine Messaufforderung am Ende führt mehr Hauseigentümer in die App als das Ende mit dem Wechsel (= EA H-D12) | Zählung der App-Starts je Herkunft (H1, H2, H7, Kopf) in der eigenen Statistik, z. B. Merkmal `einstieg=he-07` in `sessionStorage` vor dem Seitenwechsel; erst nach Entscheidung EA O-2 | Abschnitt bleibt, Kosten gering |
| H7-H2 | Das Band wirkt als Klammer, nicht als Wiederholung (DG-H-8) | Telefon-Video, Urteil des Inhabers | ohne Band (Stufe 1: h2, Preis, Pille) oder Variante „eingesetztes Fenster“ |
| H7-H3 | Grünes „erste“ senkt die gefühlte Schwelle (ein Fenster statt des ganzen Hauses) stärker als grünes „ausmessen.“ | Lesetest, Urteil des Inhabers | grün „ausmessen.“ |
| H7-H4 | Ohne Ring „Führung starten“ gehen Unsichere nicht verloren | Zählung `/app/#fuehrung` je Herkunft (O-2) | Textlink 15 px **Textentwurf** „Erst zusehen: Führung starten“ unter der Pille, keine zweite Pille |

**Freigaben**

- GEST:192: Die Ansicht endet mit der hellen Karte; H7 steht davor (IA-AB-5). **Abweichung von bestehender Regel – Freigabe durch den Inhaber
  nötig.** Begründung: Ende mit Start statt Wechsel (EA H-D12).
- GEST:34: Außerhalb der Startbilder stehen Fotos in einer Fotokarte; das Band läuft randlos aus (DG-AB-9). **Abweichung von bestehender
  Regel – Freigabe durch den Inhaber nötig.** Begründung: SG 10.6 Regel 1 (Bild als Raum, keine gerahmte Beigabe).
- GEST:38: Blöcke erscheinen 8 px aufwärts; H7 erscheint nicht (DG-AB-2, E-13). **Abweichung von bestehender Regel – Freigabe durch den Inhaber
  nötig.** Begründung: Neben Preis und Knopf beginnt keine Bewegung.
- Ohne Freigabe nötig, funktional begründet: Auslauf per `mask-image` statt eingebackenem Alpha (SG 10.6, Umsetzung), weil am Schreibtisch
  dieselbe Datei aus dem Cache dient und der Auslauf je Breite verschieden ist; Drücken ohne `scale(.98)` (G1), site-weit mit DG zu klären.
- Offen: Preiszeile 13 px oder 15 px (DG-E-6; Zeile 2 passt auch in 15 px mit ≈ 354 px); Anrede (EA O-13).

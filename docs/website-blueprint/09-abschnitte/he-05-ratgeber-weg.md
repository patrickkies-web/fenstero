# H5 Aus dem Ratgeber: Weg in sechs Schritten

Seite: Startseite `/`, Ansicht Hauseigentümer (`/#hauseigentuemer`) · Position: 5 von 7 (nach H4 `he-04-ablauf-daten`, vor H6 `he-06-haeufige-fragen`) · Intensitätsstufe: 2 (klar), Typ K35

Phase I (MASTER-PROMPT V4), Stand 24.10.2026; das Repository wurde nur gelesen. Kürzel wie in
[08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu DNA-B = `docs/design-dna/05-ergebnis-b-styleguide.md`, SG =
`docs/design-dna/04-styleguide.md`, DR = `.claude/skills/premium-gestaltung/designrichtung.md`. **[V]** verbindlich, **[H]** Hypothese mit
Rückfall, **Textentwurf** braucht Freigabe, **Festlegung I** = Entscheidung dieses Dokuments. Maße und Lagen sind geplant, Wirkung ist
erwartet, nichts davon gemessen.

---

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | „Aus dem Ratgeber: Weg in sechs Schritten“, `he-05-ratgeber-weg` (`08-zielarchitektur.md:959`) |
| Lage | Telefon 451 px ≈ 0,53 Bildschirmhöhen (BH), ab y ≈ 3.550: Bildschirm 6 bei realen 664 px, Bildschirm 5 bei 844 px. Davor H4 mit Ring „Führung starten“, danach H6 (Fragen, Stufe 1) und H7 (Cream „Jetzt ausmessen“) |
| Ziel | Unentschlossene in den Weg der Ratgeber führen statt an die Suche verlieren (U5 statt Absprung, `04-entscheidungsarchitektur.md:86`) |
| Nutzerfrage | „Ich bin noch nicht so weit, wo fange ich an?“ (Z :959) |
| Gruppen | HE-1, HE-2, HE-4 (EA :145–148); HE-5, die vor dem Messen lesen wollen (Z :464) |
| vorbereitete Entscheidung | „Ich lese bei meinem Schritt weiter“ (U5); an Schritt 4: „Ich lese, wie man misst, dann starte ich die App“ (U5 → Z2a über den App-Knopf des Artikels, `web/ratgeber/fenster-ausmessen/index.html:53`) |
| ausdrücklich nicht | keine Cream, kein direkter Sprung in die App, keine Artikelteaser, keine Fotos |

## B. Konkreter Inhalt

| Element | Wortlaut | Herkunft | Ziel |
|---|---|---|---|
| Kapitelzeile | „SECHS SCHRITTE ZU NEUEN FENSTERN“ | **Textentwurf** aus h1 und `og:title` der Übersicht (`web/ratgeber/index.html:68`, `:11`) | – |
| h2 | „Aus dem Ratgeber.“, grün „Ratgeber.“ | Bestand `web/assets/portal.js:857` (`akSatz`, `:314`) | – |
| Kachel, Zeile 1 | „Schritt 1“ … „Schritt 6“ | Bestand `scripts/ratgeber-bausteine.mjs:120` | – |
| Kachel, Zeile 2 | Prüfen · Entscheiden · Auswählen · Ausmessen · Vergleichen · Einbauen | Bestand `WEG`, `ratgeber-bausteine.mjs:51-58` | – |
| Kachel 1–3, 5, 6, Zeile 3 | „3 Ratgeber“ · „3 Ratgeber“ · „6 Ratgeber“ · „1 Ratgeber“ · „2 Ratgeber“ | Zahl = Länge von `WEG[i].seiten`; Zählwort **Textentwurf** (dasselbe Wort wie „Alle Ratgeber“) | `/ratgeber/#schritt-n` (ids `web/ratgeber/index.html:75`–`:95`) |
| Ankerkachel 4, Zeile 3 | „Messanleitung“ | **Textentwurf**; die Ratgeber sind Messanleitungen (GEST:22) | `/ratgeber/fenster-ausmessen/` (= `WEG[3].seiten[0]`) |
| Linkzeile | „Alle Ratgeber ›“ | Bestand `portal.js:857` | `/ratgeber/` |

Rund 25 Wörter statt heute ≈ 135 in neun Karten (`bestand/seiten-und-inhalte.md:226`). Ohne Anrede, weil sie offen ist (EA O-13); die
heutigen Karten mischen „du“ und „Sie“ (`bestand/browser-mobil.md:128`).

**Festlegung I-1: Die Ankerkachel führt auf die Messanleitung, nicht auf `#schritt-4`** (Z nennt `#schritt-1` bis `-6` und „sie führt zur
App“, `08-zielarchitektur.md:1035-1037`). Gründe: Der Artikel ist das Ziel des Schritts in `WEG` (`ratgeber-bausteine.mjs:50`) und trägt
gleich nach „Kurz gesagt“ den Knopf in die App, „führt zur App“ gilt also in einem Schritt, ohne Unentschlossene in die App zu werfen; die
Prüfsuite verlangt genau einen Link auf `/ratgeber/fenster-ausmessen/` (`scripts/pruefen.mjs:169`); die Startseite behält ihren internen
Link auf den wichtigsten Suchartikel (Risiko in IA-H-15, `05-informationsarchitektur.md:1077`). Die dritte Zeile sagt deshalb, wohin der
Tipp führt. **Rückfall:** `#schritt-4` mit „8 Ratgeber“ und angepasster Prüfsuite (IA-O-9).

**Interaktionen:** Tippen oder Klicken auf Kachel oder Linkzeile; Hover, Fokus, Tastatur nach F. Keine Eingabe, kein Zustand.

**Vorhandene Komponenten:** `ol.rg-weg-liste` mit `span.n`, `b`, `span.t` (`web/assets/ratgeber.css:108-125`, gebaut von
`ratgeber-bausteine.mjs:118-127`; `ratgeber.css` lädt auf `/`, `web/index.html:24`); `.linkbtn` (`portal.css:83`); `section.sec`
(`portal.css:69`); Fokus `gemeinsam.css:38`; Zeichnungssprache aus `web/bilder/messpunkte.svg`. Entfallen: `RATGEBER` (`portal.js:786`),
`.grid.c3.trust` mit `a.tcard` (`portal.css:341-357`).

## C. Exakte Layoutkomposition

**Grundstruktur [V]:** Kopf (Haarlinie, Kapitelzeile, h2) → Held (Kachelfeld 2 × 3, genau eine Ankerkachel) → Handlung (Linkzeile), nach
G2 (`02-design-grammatik.md:656`). Kein Lesestapel; die Kacheln sind die Antwort. Ordnungsfigur: Kachelraster an der linken Kante, „eine
Kachel ist Anker, alle anderen sind Klein-UI“ (SG 10.1/11, `04-styleguide.md:100`).

**Telefon 390 × 844: 4 Spalten zu 80,5 px, Fuge 12, Rand 16** (y relativ zur Haarlinie)

| Element | x | y | Breite × Höhe | Satz |
|---|---|---|---|---|
| Haarlinie | 16–374 | 0 | 358 × 1 | `--line` `#2b2b2b` |
| Kapitelzeile | 16 | 17–33 | eine Zeile | 13/16, Inter 600, Versalien, Sperrung 0,12 em, `--muted` (Technikstimme, DR:100) |
| h2 | 16 | 45–79 | eine Zeile, ≈ 305 px | 32/1,05, Inter 800, −0,03 em, `--text`, „Ratgeber.“ `--accent` |
| Reihe 1: Kachel 1, 2 | 16 · 201 | 103–191 | je 173 × 88 (Spalten 1–2, 3–4) | – |
| Reihe 2: Kachel 3, **4 (Anker)** | 16 · 201 | 203–291 | je 173 × 88 | – |
| Reihe 3: Kachel 5, 6 | 16 · 201 | 303–391 | je 173 × 88 | – |
| Linkzeile | 16 | 407–451 | Ziel 44 hoch | 17, Inter 700, Unterstreichung 1,5 px `--line2` |

**Kachel innen.** Polsterung 12; „SCHRITT n“ 13/16 Technikstimme mit `tabular-nums`; 4 px; Name 17/22 Inter 700; 2 px; dritte Zeile 13/16
Inter 500. `min-height: 88px`, nie feste Höhe.

| | Kachel 1–3, 5, 6 | Ankerkachel 4 |
|---|---|---|
| Fläche | `--surface` `#1f1f1f`, Ring 2 px `--line` | Papierweiß `#ffffff`, ohne Ring (H5-AB-1) |
| Zeile 1 und 3 | `--muted` `#93928d`, 5,3 : 1 | `#161616` bei Deckkraft 0,72 (≈ `#575757`), 7,2 : 1 |
| Zeile 2 | `--text` `#f3f2ee`, 14,7 : 1 | `#161616`, 18,1 : 1 |
| Bild | – | Messausschnitt rechts randlos, 56 × 88; Text rechts auf 64 px Abstand begrenzt |

**Messausschnitt** (Bildebene in der Ankerkachel, `aria-hidden`). Inline-SVG `viewBox="0 0 72 96"`, `preserveAspectRatio="xMaxYMid slice"`,
von der Kachelrundung beschnitten. Nach `messpunkte.svg:5-12`: rechts Wandstreifen `#ecebe6` (x 54–72), an seiner Kante die Laibung,
Linie `#c2410c` 2,5 px; drei Maßlinien `#c2410c` 2 px bei y 30 / 48 / 66 bis an die Laibung, Pfeilspitze rechts, linkes Ende über 14 px
ausgeblendet. Ohne Schrift und Zahl. Lesart: drei Breiten bis an die Laibung, der Gedanke der Probemessung aus H2.

**Verhältnisse.** Kachelfeld 64 % der Abschnittshöhe; Fläche: Kacheln ≈ 57 %, Kopf und Link ≈ 10 %, frei ≈ 33 %. Ankerkachel = ⅙ des
Felds, ≈ 4,6 % des Bildschirms; ihr Bild misst das 9-Fache der Versalhöhe der Bedienschrift (SG 10.1/4). Genau drei Größenstufen
32 · 17 · 13 [V]; die Linkzeile trägt deshalb 17 statt der 15 von `.linkbtn`.

**Ausrichtung, Symmetrie.** Alles fluchtet auf x = 16 (G5). Das Feld ist symmetrisch; die helle Kachel rechts in der Mitte bricht die
Symmetrie über den Tonwert, nicht über die Größe, damit die Lesefolge 1 2 / 3 4 / 5 6 bleibt.

**Ebenen.** Z 0 Grund `#161616` → Z 30 Kopf, Kacheln, Link → in der Ankerkachel die beschnittene Zeichnung (Text daneben, nie darauf) →
Z 40 klebender Seitenkopf. **Bedienung:** jede Kachel ist ganz Ziel (173 × 88); steht die h2 oben im Bild, liegen Reihe 2, 3 und Link im
unteren Drittel, im Daumenbereich.

| Startwert | Begründung |
|---|---|
| Fuge 12 px in beiden Richtungen | DR 3.3 (`designrichtung.md:115`); Reihenabstand = Spaltenabstand (DNA-B B.3.10). **Festlegung I-2:** Z rechnet mit 16 px (171 px Breite); 12 px spart 8 px Höhe |
| Radius 12 (`--r2`) | Kacheln nach DG-AB-8 (`02-design-grammatik.md:1136`); heute 18 in `.rg-weg-liste` |
| innen 16 · 12 · 24 · 16 | Verhältnis innerhalb : zwischen Gruppen ≈ 1 : 3 (G6); 24 px vor dem Held |
| Abschnittsabstand 96 / 128 px | G6 [V] |
| Kapitelzeile ohne Nummer | **Festlegung I-3:** H2–H4 tragen „01“–„03“ (Z :992, :1010, :1026); H5 ist Zubringer, kein Kapitel der Messgeschichte, daher wie die Anhänge ohne Nummer (E-AB-10 sinngemäß) und ohne Grün |

## D. Anwendung der Design-DNA

Ansichtstyp **Arbeitsansicht** (DNA-B B.1, `05-ergebnis-b-styleguide.md:31`: Linkliste ohne Bühne), dosiert als Stufe 2. Pflicht bleiben
flache Bedienschicht, eine Formfamilie, ruhiger Grund, Unverdecktheit, Bewegung nur im Motiv und die Mindestanforderungen.

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achse | Grund und eine Bedienebene; einzige Verdeckung: die Kachelkante beschneidet den Messausschnitt, die Wand läuft hinter der Kachel weiter | 1 | Blick durch einen Ausschnitt, ohne Schatten (DNA-B B.1/2) |
| Material, Transparenz | keines; kein Glas ohne Bild darunter (DNA-B B.3.9) | 0 | Ruhe nach drei Bildabschnitten |
| Licht, Schatten | keine; Kontrast nur über Papierweiß auf `#161616` | 0 | Papierweiß ist der einzige Fokusreiz (G3, `02-design-grammatik.md:664`) |
| Formen | Radius 12, Ring 2 px, Link ohne Fläche; kein Formbruch | 1 | Klein-UI neben dem Anker (SG 10.5/1–4) |
| 3D-Objekte | keine | 0 | – |
| Bildintegration | nur der Messausschnitt, in der Sprache der Anleitung (weiße Karte, Orange = Maueröffnung, GEST:24, :34) | 1 | Held nicht rein textlich (G4); Reim auf H2 |
| Oberflächendetails | Haarlinie, Versalien mit Sperrung, gleich breite Ziffern, Unterstreichung 1,5 px | 1 | Präzision im Kleinen |
| Animation | einmal die drei Maßlinien zeichnen [H] | 1 | führt den Blick zum Anker; Endbild trägt allein |
| Typografie | Bühnenstimme h2, Technikstimme Kapitel- und Kachelzeilen, Namen 17/700 | 2 | ein grünes Wort, drei Stufen |
| Überlagerungen | keine über Text oder Ziel | 0 | DNA-B B.1/10 |
| Perspektive | frontal | 0 | SG 10.7/1 |
| interaktive Effekte | Hover = Kontur, gedrückt = Füllung, Fokus = 2-px-Kontur | 1 | Rückmeldung ohne Bewegung (DG 2.4.1) |

**[V]:** ein Anker, fünf gleichrangige Klein-Kacheln; keine Bewegung der Bedienschicht außer Zustand (SG 10.7/1–3); drei Größenstufen; ein
grünes Wort; ohne JavaScript vollständig. **[H]:** Messausschnitt und einmaliges Zeichnen. Zählt man den Messausschnitt als informierende
Signature „Maßlinie“ (`02-design-grammatik.md:1009`), weicht er von „keine Signature“ ab (Z :1038), bleibt aber im Budget der Stufe 2
(≤ 1 informierend); Rückfall: Ankerkachel ohne Bild.

**Bewusst weggelassen:** Fotos `weg-*.webp` (Platzhalter zu je 3.494 B, `bestand/technik-und-designsystem.md:389`; nicht als Hauptbild,
Z :1085), ein Bild je Kachel (sechs Reize), Glas, Licht, Schweben, Parallaxe, Scrollkopplung, Kachelauftritt, Lottie, ein Maßstab (H4
direkt davor hat einen), Kurztexte je Schritt (H5-H5).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig (H5-AB-1).** Regel: Flächen sind `#1f1f1f` mit Ring; der einzige
Hellwert der Bedienung ist Cream für die Hauptaktion (GEST:24, :32). Vorschlag: Ankerkachel in Papierweiß `#ffffff` als Rollen-Token
`--blatt` (vorhandener Wert `--primary-hover`, `gemeinsam.css:15`; Zeichnungskarten `ratgeber.css:79`). Begründung: Cream bleibt allein
„Jetzt ausmessen“ (H1, H2, H7); die Kachel führt zum Lesen; Cream am Held schließt G3 aus; Papierweiß ist die Farbe der Ratgeber-Zeichnungen.
**Rückfall:** Cream wie `li[aria-current]` (`ratgeber.css:115`); auf Bildschirm 6 steht keine andere Cream, die von H7 ≈ 1.100 px tiefer
(Prüfpunkt).

## E. Visual Attention Architecture

Erwartet, nicht gemessen.

1. **Beim Hereinscrollen** zuerst die h2: größte Schrift, grünes Wort, kommt zuerst ins Bild.
2. **Primärer Fokus: Ankerkachel**, der einzige helle Fleck des Bildschirms (Leuchtdichtekontrast zum Grund ≈ 18 : 1, dunkle Kacheln
   ≈ 1,1 : 1 plus Ring). Im Blinzeltest bleibt genau dieser Fleck (DNA-B B.8 Nr. 2).
3. **Sekundär:** Kachel 1 „Prüfen“ oben links als Beginn der Lesefolge, dann 2, 3, 5, 6.
4. **Tertiär:** „Alle Ratgeber ›“ für alle, die ihren Schritt nicht finden.

**CTA:** keine Cream; Gewicht Ankerkachel > fünf Kacheln > Link. **Ablenkungen:** Ring „Führung starten“ von H4, 96 px darüber und bei
664 px mit im Bild (Ring, kein Hellwert); Orange des Messausschnitts (≈ 0,1 % der Fläche, nur im Anker); fünf gleich laute Kacheln
(gewollt). **Farbanteil:** Grün und Orange ≈ 0,5 % (Ziel > 0,3 %, G8); heute „unbunt 100 %“ (`bestand/browser-mobil.md:136`).
**Übergang:** 96 px Grund, dann die Haarlinie von H6; kein Rahmenbruch, kein Anschnitt nötig (Stufe 2, DG 2.3.17/2).

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve, Verfahren | weniger Bewegung | Begründung |
|---|---|---|---|---|
| Scrollen | nativ; nichts heftet, koppelt oder tritt auf | – | gleich | ein Träger je Ansicht (E-2); GEST:39 |
| Ankerkachel zu ≥ 50 % im Bild [H] | die drei Maßlinien zeichnen sich nacheinander zur Laibung, dann die Pfeilspitzen | je Linie 320 ms, Versatz 90 ms, Spitze 150 ms Deckkraft, gesamt ≈ 650 ms, Start 200 ms nach Eintritt, `--e-out`; `stroke-dashoffset` 1 → 0 bei `pathLength="1"`, ein `IntersectionObserver`, einmal je Aufruf | Endbild sofort | Motiv-Auftritt in der Bildschicht (DG 2.4.1); erzählt „messen“ (SKILL:45) |
| Hover (`hover: hover`) | dunkle Kachel: Ring `--line` → `--line2`; Anker: innerer Ring 2 px `rgba(22,22,22,.28)` | 150 ms, `--e-out` | gleich | Hover = Kontur; ohne das `translateY` von `portal.css:357` (SG 10.7/1) |
| Drücken (`:active`) | `--surface` → `--surface2`; Anker `#ffffff` → `--cream` | 150 ms | gleich | aktiv = Füllung, keine Skalierung |
| Fokus | 2 px `--ink`, Abstand 2, folgt dem Radius | `:focus-visible` (`gemeinsam.css:38`) | gleich | ≥ 3 : 1 auf beiden Grundtönen |
| Klick | Navigation; `#schritt-n` springt in der Übersicht | `<a href>` | Sprung ohne Glätten | ohne JavaScript bedienbar |

Physik, Federn und Tiefenbewegung entfallen bewusst: Ohne Bildmotiv gibt es nichts, das sie tragen dürfte (G1); „fein, nicht laut“
(SKILL:48) heißt hier Ruhe nach drei Bildabschnitten. Läuft beim Eintritt noch das Einblenden von H4, entfällt das Zeichnen (Prüfpunkt im
Telefon-Video).

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition).** Wie C. Bei realen 664 px steht der ganze Abschnitt in einem Bildschirm. Unter 168 px
Kachelbreite (Viewport < 360 px) entfällt der Messausschnitt per Container-Abfrage, der Anker trägt dann Tonwert und Text; bei 320 px
messen die Kacheln 142 px, „Entscheiden“ (≈ 106 px) passt. Bei 200 % Text wachsen die Kacheln in der Höhe, nichts wird abgeschnitten.

**Schreibtisch 1280 × 800.** Spalte 1040, 12 Spalten zu 64,7 px, Fuge 24. Kapitelzeile und h2 40/1,05 über Spalten 1–8, „Alle Ratgeber ›“
rechtsbündig an Spalte 12 auf der Grundlinie der h2 (wie heute `.sec-head`). 24 px darunter eine Reihe über Spalten 1–12, Fuge 12, im
Verhältnis 1 : 1 : 1 : 1,5 : 1 : 1: fünf Kacheln 151 × 96, Anker 226 × 96, Polsterung 16, Messausschnitt 72 × 96. Der breitere Anker folgt
DG-AB-11 (`02-design-grammatik.md:1139`); Z (:1039) sagt nur „eine Reihe aus sechs Kacheln“. Höhe ≈ 207 px ≈ 0,26 BH (SKILL:28).

**Schreibtisch 1024 × 768.** Inhalt 984 px (Rand 20 wie `.wrap`): Kacheln 142 × 96, Anker 213 × 96. Zwischen 600 und 900 px Containerbreite
3 × 2 gleich breit, darunter 2 × 3.

## H. Technische Umsetzung

**Bestehend:** siehe B; Quelle der Daten ist `WEG` (`scripts/ratgeber-bausteine.mjs:51-58`), Abschnitt in `SCREENS.landing`
(`portal.js:857`), Tokens `gemeinsam.css:10-30`. **Neu:** Modifikator `.rg-weg-liste.weg-start` mit `li.anker` in `portal.css`; Konstante
`RATGEBER_WEG` statt `RATGEBER` in `portal.js`; Token `--blatt`; Inline-SVG `messausschnitt` (≈ 0,6 KB). Kein `aria-current`, denn auf der
Startseite ist kein Schritt der aktuelle.

```html
<section class="sec he-weg" aria-labelledby="he-weg-h">
  <p class="kapitel">Sechs Schritte zu neuen Fenstern</p>
  <h2 id="he-weg-h">Aus dem <span class="ak">Ratgeber.</span></h2>
  <ol class="rg-weg-liste weg-start">
    <li><a href="/ratgeber/#schritt-1"><span class="n">Schritt 1</span><b>Prüfen</b><span class="t">3 Ratgeber</span></a></li>
    <!-- 2, 3 -->
    <li class="anker"><a href="/ratgeber/fenster-ausmessen/"><span class="n">Schritt 4</span><b>Ausmessen</b>
      <span class="t">Messanleitung</span><svg class="messausschnitt" viewBox="0 0 72 96" aria-hidden="true" focusable="false">…</svg></a></li>
    <!-- 5, 6 -->
  </ol>
  <a class="linkbtn" href="/ratgeber/">Alle Ratgeber ›</a>
</section>
```

```css
.he-weg { container: weg / inline-size; border-top: 1px solid var(--line); padding-top: 16px; }
.weg-start { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
@container weg (min-width: 600px) { .weg-start { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@container weg (min-width: 900px) { .weg-start { grid-template-columns: 1fr 1fr 1fr 1.5fr 1fr 1fr; } }
.weg-start li { container-type: inline-size; }
.weg-start a { position: relative; overflow: clip; min-height: 88px; padding: 12px; border-radius: var(--r2); background: var(--surface); box-shadow: var(--ring); }
.weg-start .n { font-weight: 600; letter-spacing: .12em; color: var(--muted); font-variant-numeric: tabular-nums; } /* statt Grün 800, ratgeber.css:112 */
.weg-start .t { font-size: 13px; color: var(--muted); }
.weg-start .anker a { background: var(--blatt); box-shadow: none; color: var(--on-primary); padding-right: 64px; }
.weg-start .anker .n, .weg-start .anker .t { color: var(--on-primary); opacity: .72; }
.messausschnitt { position: absolute; inset: 0 0 0 auto; width: 56px; height: 100%; pointer-events: none; }
@container weg (min-width: 900px) { .weg-start a { min-height: 96px; padding: 16px; } .weg-start .anker a { padding-right: 88px; } .messausschnitt { width: 72px; } }
@container (max-width: 167px) { .messausschnitt { display: none; } .weg-start .anker a { padding-right: 12px; } }
@media (forced-colors: active) { .weg-start a { border: 2px solid CanvasText; } }
```

**Daten, Textfassung, Prüfsuite.** `ratgeber-bausteine.mjs` schreibt die sechs Einträge aus `WEG` auch in die Textfassung
`web/index.html:82-90` (heute sechs Artikelkarten), damit Ansicht und Textfassung gleich sind (Z :933). Die Prüfsuite (Abschnitt 10)
vergleicht Namen, Folge, Zahlen und Ziele mit `WEG`; ihre Erwartung `a.tcard[href="/ratgeber/fenster-ausmessen/"]` (`pruefen.mjs:169`) wird
zu `.he-weg a[href="/ratgeber/fenster-ausmessen/"]` (IA-O-9). Begleitend `scroll-margin-top: 72px` an `.rg h2[id]`, damit der klebende
Kopf der Übersicht den angesprungenen Schritt nicht verdeckt (die Regel fehlt heute in `ratgeber.css`).

| Asset | Art, Format, Maß | Freistellung | Quelle |
|---|---|---|---|
| Messausschnitt | Inline-SVG, `viewBox 0 0 72 96`, ohne Text | transparent, Wand als Fläche | vorhanden, abgeleitet aus `web/bilder/messpunkte.svg` |
| Fotos | keine | – | nichts beim Inhaber anzufragen |

**Animation:** CSS-Übergang auf `stroke-dashoffset` und `opacity`. JavaScript setzt die Startklasse nur, wenn die Kachel beim Aufbau
unter dem Bild liegt und keine reduzierte Bewegung verlangt ist; sonst steht das Endbild. **Leistung:** kein Bild, ≈ 2 KB HTML und SVG,
≈ 1 KB CSS, neun Karten entfallen; kein Einfluss auf LCP, keine Layoutverschiebung. **Barrierefreiheit:** `ol` meldet „Liste, 6
Einträge“; Linkname etwa „Schritt 4 Ausmessen Messanleitung“; Tab-Folge h2 → Kacheln 1–6 → Link; Ziele ≥ 142 × 88; der Anker unterscheidet
sich auch durch Wortlaut und Bild; der Ring der dunklen Kacheln ist Schmuck, erkennbar sind sie am Text; Fokus ≈ 16 : 1.

## I. Conversion-Begründung

**Position.** Nach H2 bis H4 hatten Entschlossene drei Wege in die App (Cream in H1 und H2, Ring in H4); wer weiterscrollt, ist eher
unentschlossen. H5 bietet ihm einen eigenen Weg statt des Absprungs, danach schließen Fragen (H6) und Messaufforderung (H7) die Ansicht,
sie endet also mit dem Start (EA H-D12). **Gestaltung.** Ein heller Anker auf dem Schritt, an dem eeziframes ansetzt; die anderen fünf
zeigen, dass der Weg vorher beginnt und danach weitergeht, ohne zu werben. **Menge.** Sechs Ziele zu drei kurzen Zeilen, 0,53 BH statt
neun Karten auf ≈ 1,5 Bildschirmen, die „wie eine Blog-Übersicht“ wirken (`bestand/browser-mobil.md:135-136`; SKILL:29). **Beitrag.** U5,
über den App-Knopf des Artikels mittelbar Z2a (HE-2: „U5, dann Z2a“, EA :146).

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| H5-H1 | Der Weg führt mehr Unentschlossene in die Ratgeber als neun Karten (= IA-H-15) | eigene Statistik, Seitenaufrufe `/ratgeber/` und `/ratgeber/fenster-ausmessen/` je Tag vorher und nachher (`functions/api/statistik.js:19`); die Herkunft innerhalb der Website wird nicht gezählt, also nur Näherung | Wischzeile aus sechs Pillen (KB HB5, `konzept-b.md:565-567`) |
| H5-H2 | Der Anker auf die Messanleitung verkürzt den Weg zum Messen gegenüber `#schritt-4` | Lesetest „Wo tippst du, wenn du messen, aber erst wissen willst wie?“; Aufrufe `/app/` | `#schritt-4` mit „8 Ratgeber“ |
| H5-H3 | H5 zieht niemanden ab, der sonst in H7 gestartet hätte | Vorgänge „Kasse geöffnet“, Aufrufe `/app/` vorher und nachher | H5 hinter H7, vor der Wechselkarte |
| H5-H4 | Das einmalige Zeichnen lenkt, ohne als Schmuck zu wirken | Telefon-Video bei 844 und 664, Urteil des Inhabers | statisch |
| H5-H5 | Zahlen genügen zur Selbstverortung; Kurztexte aus `WEG.text` („Beschlagen, undicht, wie alt?“) wären nicht klarer | Lesetest mit beiden Fassungen | Kurztext statt Zahl, Kacheln ≈ 112 px hoch |

**Freigaben:** H5-AB-1, Festlegungen I-1 bis I-3, Textentwürfe (Kapitelzeile, „n Ratgeber“, „Messanleitung“), Prüfsuite (IA-O-9).

# Wechselkarte am Ende jeder Ansicht

Seite: Startseite `/` (Rahmen, beide Ansichten) · Position: 4 (Rahmenteil R5, `st-04-wechselkarte`) · Intensitätsstufe: 2 (klar), Typ T11

Phase I des Website-Blueprints, Stand 24.10.2026. Planungsdokument; das Repository wurde nur gelesen. Kürzel, **[V]**, **[H]** und
**Textentwurf** wie in [08-zielarchitektur.md](../08-zielarchitektur.md). **Festlegung I** = Entscheidung dieser Spezifikation, wo 08
offen ist. Alle Lagen, Wirkungen und Aufmerksamkeitsfolgen sind geplant bzw. erwartet, nicht gemessen.

## A. Abschnitt und Funktion

- **Name, ID:** Wechselkarte, `st-04-wechselkarte` (08 8.3.3 R5; IA K06).
- **Position:** letzter Inhalt jeder Ansicht von `/`, direkt vor dem Fuß `rh-03`.
  - Ansicht Hauseigentümer: nach H7 `he-07-abschluss` (Bildband, h2, Cream „Jetzt ausmessen“, Preiszeile); 0,30 BH · 4 % ·
    Bildschirm 8 bei 390 × 664 (08 8.3.4 a).
  - Ansicht Fensterbauer (eingebettete Seite für Fensterbauer): nach A4 `fb-15-abschluss` (kompakte Paketwahl mit einer Cream-Zeile),
    Bildschirm ≈ 14 (08 8.3.2 a). Fällt die Einbettung aus, nach der Rückfallkarte „Pakete ansehen“ (`web/assets/portal.js:818`).
  - Nicht auf `/fuer-fensterbauer/` (dort Brotkrumen und Fuß, 08 N8) und nie in der Instanz eines Betriebs: Dort ist `landing` gesperrt
    (`portal.js:1755-1757`); Kunden eines Betriebs sehen kein Angebot von eeziframes (Kundenschutz, GEST:370-379).
- **Ziel:** zweiter, leiser Wechsel zwischen den Zielgruppen neben dem Umschalter `st-02`, der am Telefon mit dem Startbild wegscrollt
  (08 8.2.4). Die Karte schaltet die Ansicht und springt an ihren Anfang [V] (GEST:191).
- **Nutzerfrage:** Ansicht Hauseigentümer: „Ich bin Fensterbauer – wo geht es weiter?“ Ansicht Fensterbauer: „Ich will eigentlich meine
  eigenen Fenster ausmessen.“ (08 R5).
- **Vorbereitete Entscheidung:** Ansicht wechseln oder bleiben; keine Zielhandlung, aber Vorstufe zu Z1a/Z1 (Fensterbauer landen in V1)
  bzw. Z2a (Hauseigentümer landen in H1). Bestandsbetriebe (FB-7) nutzen „Anmelden“ in Kopf und Fuß (08 8.2.8).
- **Was sie nicht tut:** nicht verkaufen, nicht aus `/` hinausführen, nicht mit H7 bzw. A4 konkurrieren (EA H-D12; IA 5.4.3 H7).

## B. Konkreter Inhalt

**Verwendete Bestandsinformationen**

| Bestand | Fundstelle | Verwendung |
|---|---|---|
| Baustein `wechsel(zu)`: `section.owner.wechsel` mit Kicker, h2 (`clamp(26px, 3.4vw, 30px)`, außerhalb der Skala), Lead, Knöpfen | `portal.js:787-791`; `web/assets/portal.css:353-355`, `:574` | umgebaut; Klasse `.wechsel` bleibt, `.owner` entfällt hier |
| Ansicht Hauseigentümer: Kicker „Für Fensterbauer“, h2 „Ihr eigener Fensterkonfigurator.“, Lead „Unter Ihrer Domain …“, Cream „Pakete ansehen“ → `/fuer-fensterbauer/`, Ring „Zur Ansicht für Fensterbauer“ | `portal.js:790` | Kicker bleibt; Satz neu; Lead, Cream und Ziel außerhalb von `/` entfallen; ein Ring |
| Ansicht Fensterbauer: Kicker „Für Hauseigentümer“, h2 „Ihre eigenen Fenster ausmessen?“, Lead „Messen geht kostenlos …“, Ring „Zur Ansicht für Hauseigentümer“ mit Pfeilkreis | `portal.js:791` | Kicker, Satz, Ringtext bleiben; Lead und Pfeilkreis entfallen |
| Verhalten: Anker `#hauseigentuemer`/`#fensterbauer`, ohne Verlaufseintrag (`history.replaceState`), Wahl gespeichert, Sprung an den Anfang | `portal.js:399-402`, `:1775-1781`; GEST:190-191 | bleibt [V] |
| Beleg des neuen Satzes: Fensterbauer „bekommen denselben Konfigurator als ihren eigenen, unter ihrer Domain und ihrer Marke“ | `web/index.html:52` | Grundlage des Textentwurfs |
| Prüfsuite: genau ein `.wechsel [data-act="ansicht"][data-v="betrieb"]` bzw. `[data-v="kunde"]`; danach `scrollY === 0`; Karte auch im Rückfall | `scripts/pruefen.mjs:169`, `:173`, `:202` | Selektoren und Verhalten bleiben |

**Texte** (rund neun Wörter je Richtung; mehr würde den ersten Bildschirm der Zielansicht vorwegnehmen)

| Element | Hauseigentümer → Fensterbauer | Fensterbauer → Hauseigentümer |
|---|---|---|
| Kicker 13, Technikstimme | „Für Fensterbauer“ (`portal.js:790`) | „Für Hauseigentümer“ (`:791`) |
| Satz 17 fett, `h2` | **Textentwurf** „Dieses Werkzeug, unter Ihrer Marke.“, grün „Marke.“ (KD R5; 08 8.2.4) | „Ihre eigenen Fenster ausmessen?“ (`:791`), grün „ausmessen?“ |
| Ring 52 | **Textentwurf** „Zur Seite für Fensterbauer“ (08 8.2.4) | „Zur Ansicht für Hauseigentümer“ (`:791`) |
| Rückfall des Satzes | „Ihr eigener Fenster-Konfigurator.“ (`:790` in der Schreibweise der Seite, IA R5, **Textentwurf**), wenn H-WK-3 nicht trägt | **Textentwurf** „Eigene Fenster ausmessen?“ (ohne Anrede), falls EA O-13 so entscheidet |

**Festlegung I (grünes Wort):** Ein grünes Wort je Überschrift bleibt (GEST:24). „Marke.“ ist dasselbe grüne Wort, das der Besucher nach
dem Sprung im h1 der Seite für Fensterbauer liest (Prüfsuite 29: grünes „Marke“); „ausmessen?“ nimmt das Verb des Knopfs „Jetzt
ausmessen“ in H1 auf. Die Karte kündigt so an, was oben wartet.

**Interaktion:** genau ein Ziel, der Ring; die Karte selbst ist nicht klickbar (Festlegung I), damit kein auslaufender Wischer am
Seitenende die ganze Ansicht austauscht.

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig (IA-AB-9, GEST:192):** Cream „Pakete ansehen“ mit Ziel
`/fuer-fensterbauer/` und der Satz „Ihr eigener Fensterkonfigurator.“ entfallen zugunsten eines Rings, der die Ansicht schaltet.
Begründung: eine Cream-Fläche je Bildschirm neben H7 (SKILL:71); die Ansicht endet mit dem Start (EA H-D12); beide Zielgruppen bleiben
unter einer Adresse (GEST:188).

## C. Exakte Layoutkomposition

**Grundstruktur:** eine opake Karte als senkrechter Stapel Kicker → Satz → Ring, linksbündig an der Ordnungslinie (G5); innen keine
Spalten. Asymmetrisch: am Schreibtisch bleibt rechts der Karte bewusst Leere.

**Telefon 390 × 844** (4 Spalten à 77,5 px, Fugen 16 px, Rand 16 px; Karte über alle 4 Spalten; y relativ zur Kartenoberkante)

| Element | x | y | Maß | Anteil |
|---|---|---|---|---|
| Abstand zu H7 bzw. A4 | – | −96 bis 0 | 96 px (G6) | – |
| Karte | 16–374 | 0–173 (Satz einzeilig) bzw. 0–197 (zweizeilig) | 358 × 173–197, Radius 24 | 18,8–21,4 % der Bildschirmfläche |
| Kicker | ab 40 | 24–41 | 13/1,3; 156 bzw. 179 px breit (gemessen mit Inter) | – |
| Satz | 40–350 | 49–73 | 17/1,4; 304 bzw. 279 px breit, passt in 310 px | – |
| Ring | 40–350 | 97–149 | 310 × 52, Text zentriert | 4,9 % des Bildschirms |
| Abstand zum Fuß | – | 173–269 | 96 px bis zur Haarlinie des Fußes | – |

Innere Abstände 8 (Kicker → Satz, innerhalb der Gruppe) : 24 (Satz → Ring, zwischen Gruppen) : 96 (zwischen Abschnitten), also 1 : 3 : 12
(G6). In der Karte: Text ≈ 16 %, Ring ≈ 26 %, frei ≈ 58 %, Bild 0 %. Größenhierarchie: Satz und Ringtext 17 fett, Kicker 13; der Satz
führt über Helligkeit (`--text`, ohne Rahmen), der Ring über seine Kontur. Ebenen: Grund `#161616` (Z 0) → Karte als „Karte mit Inhalt“ der
Bedienschicht (Z 30, G1) mit Text und Ring in derselben Ebene → Kopf (Z 40) beim Durchscrollen darüber.

**Schreibtisch 1280 × 800** (12 Spalten in 1040 px, Fuge 24 px, Spalte 64,7 px): Karte über die Spalten 1–5, x 120–539 (419 px = 40 %
der Spalte), Innenabstand 32, Höhe 189 px (Kicker y 32–49, Satz 57–81 einzeilig, Ring 105–157 mit eigener Breite 263 bzw. 312 px,
linksbündig). Spalten 6–12 bleiben leer. Abstand 128 px oben und unten (G6). Die Kante x = 120 fluchtet mit der Textspalte von H7 (5 von
12 Spalten, DG T1 am Schreibtisch).

**Technische Startwerte** (nur vorhandene Tokens aus `web/assets/gemeinsam.css:9-31`)

```css
.wechsel { padding: 24px; border-radius: var(--r4); background: var(--surface); box-shadow: var(--ring);
  display: flex; flex-direction: column; align-items: flex-start; }
.wechsel .kicker { margin: 0; font-size: 13px; line-height: 1.3; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--accent); }
.wechsel h2 { margin: 8px 0 0; font-size: 17px; line-height: 1.4; font-weight: 700; color: var(--text); max-width: 34ch; }
.wechsel .btn { margin-top: 24px; width: 100%; padding-inline: 16px; white-space: normal; text-wrap: balance;
  box-shadow: inset 0 0 0 2px var(--muted); }
@media (max-width: 379px) { .wechsel .btn { font-size: 15px; } }
@media (min-width: 640px) { .wechsel { width: calc((100% - 7 * 24px) / 8 * 6 + 5 * 24px); } }
@media (min-width: 1024px) { .wechsel { width: calc((100% - 11 * 24px) / 12 * 5 + 4 * 24px); padding: 32px; }
  .wechsel .btn { width: auto; padding-inline: 22px; } }
```

Begründungen: Radius 24 = Container (DG-AB-8; der SG-Mobilwert 16–20 px gilt hier nicht, weil DG vier Werte festlegt). Ring-Kontur
`--muted` statt `--line2`, weil die Kontur die einzige Grenze des Knopfs ist und 3:1 braucht (`--line2` auf `#1f1f1f` ≈ 1,45:1; `--muted`
≈ 5,3:1; SG 10.9; DG-E-10). 15 px unter 380 px, weil „Zur Ansicht für Hauseigentümer“ 268 px misst und bei 360 px Breite nur 248 px
Inhalt bleiben. `white-space: normal` nur für 200 % Text (SG 10.10 Nr. 19).

## D. Anwendung der Design-DNA

**Festlegung I („helle Karte“):** In GEST:192-193 und IA K06 heißt die Karte „hell“; gebaut ist sie seit der dunklen Bühne als Fläche
`#1f1f1f` mit 2-px-Ring (`portal.css:353`; Bildschirmfoto `bestand/screens/mobil-startseite-08.jpg`). „Einzige helle Fläche“ bedeutet
hier: die einzige Fläche über Grundniveau in ihrem Bildschirm. Eine wirklich helle Karte (Papierweiß, Cream-nah) ist verworfen: Sie wäre
neben der Cream von H7 bzw. A4 ein zweiter großer Hellwert (DG-AB-7; SG 10.10 Nr. 5), nähme den Fokusreiz für sich (G3) und wäre das
Gegenteil von leise.

| DNA-Eigenschaft | Ausgestaltung, Position | Intensität 0–4 | Beabsichtigte Wirkung, Beitrag |
|---|---|---|---|
| Tiefe, Z-Achsen | zwei Ebenen: Grund und Karte; Tiefe nur als Kante der Fläche, keine Verdeckung. Ansichtstyp „Arbeitsansicht“ (DNA-B B.1): Stapel und Anker sind Ziel, nicht Pflicht | 1 | ruhiger Ausklang nach dem Bildband von H7, der die Tiefe des Bildschirms trägt |
| Material, Transparenz | opak, matt, flach; kein Glas (kein Bildinhalt dahinter, DG 2.4.1) | 1 | Bedienschicht ohne Eigenmaterial (Nr. 9) |
| Licht, Schatten | kein Licht, kein Schatten, keine Lichtkante (die Karte schwebt nicht) | 0 | Lichtkern bleibt im Foto von H7 bzw. im Bildschirm der Mini-Vorschau von A4 (Nr. 6, 10) |
| Formen | Radius 24 außen, Pille innen; eine Formfamilie, kein Bruch | 2 | Wiedererkennung von Karten und Knöpfen der ganzen Seite |
| 3D-Objekte, Perspektive | keine; frontal | 0 | Nr. 1 |
| Bildintegration | keine | 0 | ein Held je Bildschirm (G3) |
| Oberflächendetails | nur der 2-px-Ring `--line` (≈ 1,3:1 zum Grund) als Kante | 1 | präzise Begrenzung statt Schatten |
| Animation | keine eigene; nur Zustände und die Überblendung der Zielansicht (F) | 1 | „Bewegung keine außer Zustand“ (DG T11) |
| Typografie | Technikstimme für den Kicker, Satz 17 fett; keine Bühnenstimme (32/40) | 1 | keine zweite Überschrift neben der h2 von H7 bzw. A4 im selben Bildschirm |
| Überlagerungen | keine; kein Rahmenbruch | 0 | Rahmenbruch bleibt V1 → V2 vorbehalten (08 8.3.11) |
| Interaktive Effekte | Hover = Kontur hellt auf, Druck = Füllung, Fokus = 2-px-Kontur | 1 | Rang über Kontur gegen Füllung (DG 2.2.10) |

Signature-Effekte: keine, informierende wie inszenierende (Budget „≤ 2, keine Signature“, 08 8.3.11).

**Bewusst weggelassen:** Pfeilkreis `.pf` im Ring (er gehört der einen Hauptaktion, DNA-B B.3.7); Ausschnitt des Startbilds der
Zielansicht in der Karte (zweiter Held neben dem Bildband von H7 bzw. der Mini-Vorschau von A4); Glas; Lichtkante; Auftritt beim
Scrollen; gleitender Segmentzeiger im Umschalter nach dem Wechsel (Versatz der Bedienschicht, G1); Lead-Absatz.

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit; Prüfung im Blinzeltest bei 390 × 844 (DG-H-12).

- **Bildschirm mit H7 (Karte mittig, y ≈ 352–548):** darüber Cream „Jetzt ausmessen“ (≈ 15,8:1, gefüllt) und Preiszeile, darunter ab
  y ≈ 644 die Haarlinie des Fußes. Erwartete Folge: (1) Cream von H7 als hellste Fläche, (2) grüner Kicker als einziger Farbpunkt der
  unteren Hälfte, (3) Satz, (4) Ring, (5) Fuß. Primärer Fokus des Bildschirms bleibt die Messaufforderung; die Karte ist sekundär.
- **Bildschirm ohne H7 (Karte oben):** Die Karte ist die einzige Fläche über Grundniveau und damit primär; Kicker → Satz → Ring.
- **Kontraste:** Kartenfläche zum Grund 1,10:1, Kartenring 1,3:1 (Kante, kein Bedienelement), Satz 14,7:1, Kicker 9,6:1, Ringkontur 5,3:1,
  Ringtext 14,7:1. Der Ring wiegt bei 4,9 % Fläche ohne Füllung weniger als die gefüllte Cream (≈ 5,7 %).
- **Filterwirkung [H]:** Der Kicker in Versalien sortiert vor: Die angesprochene Gruppe erkennt sich, die andere liest darüber hinweg.
- **Ablenkungen:** die Linkgruppen des Fußes (96 px Abstand trennt sie); der Kopfknopf (Ring, solange eine Cream im Inhalt sichtbar ist,
  N3).
- **Übergang:** Die Leserichtung endet im Fuß. Nach dem Tippen zeigt der Glas-Umschalter am Anfang der Zielansicht die neue Wahl
  (Bestätigung ohne zusätzliches Element).

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Begründung | weniger Bewegung |
|---|---|---|---|---|
| Scrollen | Karte scrollt nativ, kein Auftritt: von `.rv` ausnehmen (heute 8 px Versatz und 320 ms, `gemeinsam.css:181`; `portal.js:575-578`) | – | DG T11; DG-AB-2 | gleich |
| Hover (`hover: hover`) | Ringkontur `--muted` → `--text` | 150 ms (`--t1`), `--e-out` | ein Kanal für Hover (DG 2.2.10) | gleich |
| Druck | Füllung `--surface3`, keine Skalierung (heute `scale(.98)`, `gemeinsam.css:65`, hier aufheben) | 150 ms | DNA-B B.3.7 | gleich |
| Fokus (Tastatur) | 2-px-Kontur `--text`, Abstand 2 px, formfolgend (`gemeinsam.css:38`) | sofort | SG 10.10 Nr. 17 | gleich |
| Klick, Enter, Leertaste | 1. Druckzustand im selben Bild; 2. `ansichtMerken` (Anker, ohne Verlaufseintrag), Neuaufbau, `scrollTo(0, 0)` ohne Gleiten; 3. die neue Ansicht blendet von 0 auf 1 ein; 4. Fokus auf das h1 der neuen Ansicht | Einblenden 220 ms (`--t2`), `--e-out`; kein Ausblenden der alten Ansicht | Seitenwechsel als Überblendung 200–300 ms (SG 10.9); ohne Ausblenden kein Zwischenzustand zweier überlagerter Ansichten (SG 10.10 Nr. 14); kein Scrollen über ≈ 6.000 px | Schnitt, ohne Einblenden |

Richtung und Raum: keine räumliche Transformation, keine Richtung; der Kopf steht (SG 10.7/5). Die heutige Überblendung `.scr.anim`
(320 ms mit 6 px Versatz, `portal.css:210-211`) wird für diesen Wechsel auf reine Deckkraft 220 ms gesetzt: **Abweichung von bestehender
Regel – Freigabe durch den Inhaber nötig** (DG-AB-2 zu GEST:39 „Erscheinen 8 px aufwärts“). Grund: Bedienschicht ohne Versatz (SG 10.10
Nr. 14); 220 ms liegt in der Spanne der SG und ist ein vorhandenes Token (Festlegung I).

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst):** eigenständige Komposition wie in C, Karte über alle vier Spalten, Ring in voller Breite für
beide Daumen. Satz einzeilig (304 von 310 px); bricht er um, wächst die Karte auf 197 px, nichts wird gekürzt. **360 px:** Karte 328 px,
Satz zweizeilig, Ringtext 15 px. **320 px:** kein Querscrollen; der Ring darf zweizeilig werden. **640–1023 px:** Karte über 6 von 8
Spalten, Aufbau wie am Telefon.

**Schreibtisch 1280:** Karte 419 × 189 px über Spalten 1–5, Ring mit eigener Breite linksbündig, Spalten 6–12 leer, Abstände 128 px.
Nichts wird vergrößert (SKILL:28): Schrift 13/17 wie am Telefon.

**Schreibtisch 1024:** Inhalt heute 984 px (`.wrap`, `portal.css:61`), Spalte 60 px; Karte über Spalten 1–5 = 396 px, x 20–416, Innenraum
332 px: Satz (304 px) und längster Ringtext (312 px) passen einzeilig; Höhe 189 px.

## H. Technische Umsetzung

- **Bestehende Bausteine:** `wechsel(zu)` (`portal.js:787-791`) umbauen; Aktion `ansicht` (`:1775-1781`), `ansichtMerken`
  (`:399-402`), `nav` (`:342`) und die Klickdelegation an `#app` (`:1940-1948`) unverändert nutzen; Knopfklassen `.btn.ghost`
  (`gemeinsam.css:56-66`), Kicker `.eyebrow.kicker` (`:44-46`).
- **Markup:** `<aside class="wechsel" aria-labelledby="wk-kicker wk-satz">` mit `<p class="kicker" id="wk-kicker">`, `<h2 id="wk-satz">`
  (grünes Wort in `.ak`) und `<button type="button" class="btn ghost" data-act="ansicht" data-v="betrieb|kunde">`. Ein Knopf, kein Link:
  Ein Link auf `#fensterbauer` erzeugte einen Verlaufseintrag (gegen GEST:191).
- **Neu:** (1) Fokus nach dem Wechsel auf das h1 der Zielansicht (`tabindex="-1"`, `focus({ preventScroll: true })`); solange die
  Einbettung lädt, auf `.vk-einbettung` (hat `aria-label`, `portal.js:820`), danach auf das h1. (2) Vorabladen: In der Ansicht
  Hauseigentümer beobachtet ein IntersectionObserver die Karte (`rootMargin: 0px 0px 100% 0px`) und ruft einmal `vkLaden()` (`:803-816`;
  ≈ 61 KB, komprimiert ≈ 16 KB, gleiche Herkunft); nicht bei `navigator.connection.saveData`; der Observer wird bei jedem Neuaufbau
  getrennt und neu gesetzt (idempotent, SKILL:63-64). (3) Ladezustand: `.vk-einbettung[aria-busy="true"]` hält `min-height: calc(100svh -
  56px)`, und `.vk-einbettung[aria-busy="true"] + .wechsel { visibility: hidden }`; sonst stünde nach dem Wechsel die Karte „Ihre eigenen
  Fenster ausmessen?“ oben im leeren Bild. Rückfall und Prüfsuite (`:202`) bleiben erfüllt, weil `aria-busy` danach entfällt.
- **CSS:** Startwerte aus C; `.owner`-Regeln gelten hier nicht mehr; `.wechsel` ohne `.rv`; `.wechsel .btn:active { transform: none;
  background: var(--surface3) }`; Einblenden der Ansicht über eine eigene Klasse am `.scr` (`opacity` 0 → 1, 220 ms), damit andere
  Bildschirmwechsel des Betriebsbereichs unverändert bleiben; unter `prefers-reduced-motion: reduce` keine Animation (`portal.css:704`).
- **Assets:** keine; nichts beim Inhaber anzufragen.
- **Animationstechnik:** CSS-Übergänge und eine Keyframe-Animation nur auf `opacity`; kein JavaScript-Animationscode, keine Bibliothek.
- **Leistung:** Risiko ist der Neuaufbau der Ansicht Fensterbauer beim Tippen (Einbettung plus `Verkauf.auf`): Druckzustand zuerst malen,
  Neuaufbau im nächsten Bild (`requestAnimationFrame`), Ziel INP ≤ 200 ms (SG 10.9).
- **Barrierefreiheit:** benannte Region; Ziele ≥ 44 px; Kontraste wie in E; der Ring trägt kein `aria-pressed` (kein Umschalter); 200 %
  Text ohne Verlust; ohne JavaScript ersetzt der Block „Für Fensterbauer“ der Textfassung die Karte (`web/index.html:65-67`, `st-05`).
- **Prüfpunkte:** `scripts/pruefen.mjs:169`, `:173`, `:202` bleiben grün; Telefon-Video beider Richtungen, auch mit „weniger Bewegung“.

## I. Conversion-Begründung

- **Warum hier:** Wer das Ende einer Ansicht erreicht, ohne zu handeln, ist unentschlossen (dafür stehen H7 bzw. A4 davor) oder in der
  falschen Ansicht. Google rendert die Ansicht Hauseigentümer (IA 5.1.2); ein Fensterbauer sieht dort den Umschalter nur im ersten
  Bildschirm. Die Karte ist sein Ausgang am Ende, ohne den Weg der Hauseigentümer zu stören (EA 4.1.5; WH6).
- **Wie die Gestaltung hilft:** Ring statt Cream lässt H7 bzw. A4 die eine Hauptaktion (SKILL:71); der Kicker filtert die Zielgruppe; der
  Sprung führt Fensterbauer in V1, wo Preiszeile und „Pakete ansehen“ ohne Scrollen stehen (08 E-1), Hauseigentümer in H1 mit „Jetzt
  ausmessen“; `/` wird nicht verlassen, die Wahl bleibt gespeichert.
- **Informationsmenge:** neun Wörter und ein Knopf. Was die andere Gruppe wissen muss, steht einen Tipp weiter im ersten Bildschirm ihrer
  Ansicht; jeder weitere Satz verlängert das Seitenende für die Mehrheit, die nicht wechselt.
- **Beitrag zur Zielhandlung:** mittelbar zu Z1a/Z1 und Z2a über richtig geleitete Besucher; zu Z2a auch, weil die Karte die
  Messaufforderung nicht überstrahlt (EA H-D12).
- **Zu testende Annahmen** (Prüfwege nach EA 4.7.1; Vergleichstests sind nicht eingerichtet):

| Nr. | Hypothese | Gegenrisiko | Prüfweg | Rückfall |
|---|---|---|---|---|
| H-WK-1 | Ein Ring statt Cream genügt Fensterbauern, die am Ende angekommen sind, und lässt H7 als Hauptaktion stehen | Karte wird übersehen | Blinzeltest, Telefon-Video | Pfeilkreis `.pf` im Ring |
| H-WK-2 | Der Kicker „Für Fensterbauer“ lässt die richtige Gruppe anhalten und die andere weiterlesen | Hauseigentümer zweifeln, ob sie richtig sind | Fünf-Sekunden-Lesetest mit beiden Gruppen | – |
| H-WK-3 | „Dieses Werkzeug, unter Ihrer Marke.“ wird als eigener Konfigurator verstanden, nicht als Aufmaß-App | „Werkzeug“ bleibt unklar | Lesetest mit Fensterbauern | Satz aus `portal.js:790` |
| H-WK-4 | Der Sprung an den Anfang orientiert besser als ein Sprung zu den Paketen | Umweg von einem Tipp | Sichtprüfung des Wegs | bleibt [V] (GEST:191) |
| H-WK-5 | Ohne Verlaufseintrag verlässt niemand die Seite mit „Zurück“, weil der Umschalter oben sichtbar ist | Absprung über „Zurück“ | Beobachtung im Lesetest | Vorschlag `pushState` nur nach Freigabe |

Messung nur nach Entscheidung des Inhabers (EA O-2): ein Vorgang „Ansicht gewechselt“ mit Quelle (Umschalter, Karte, Menü) in der
eigenen Statistik der Zentrale (`docs/ZENTRALE.md`), ohne fremde Server und ohne Cookies. Bis dahin bleibt jede Aussage über die Nutzung
der Karte eine Annahme.

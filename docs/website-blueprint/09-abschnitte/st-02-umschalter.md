# Kopf mit Glas-Umschalter Hauseigentümer · Fensterbauer

Seite: Startseite `/` (Rahmen, beide Ansichten) · Position: 2 (nach `st-01-baender`, über `he-01` bzw. `fb-01`) · Intensitätsstufe: 1 ruhig, Typ T0; das Glas zählt als inszenierende Signature im Budget von H1 (Stufe 3)

Phase I, Planungsdokument, nichts gebaut. Grundlage: 08 (8.2.2–8.2.4, 8.3.3, H1 in 8.3.4, 8.3.11), EV 7.5.10, IA 5.3.4 und K03, DG 2.2.10
und 2.3.3, SG 10.3 und 10.9; angeglichen an DS 11 (K-3, K-5, K-7, K-11, K-24, K-27, K-29, K-34, K-39). **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I** = Entscheidung dieser Spezifikation, wo
08 offen ist oder nicht aufgeht. Aufmerksamkeit ist erwartet, nicht gemessen. Pakete und Preise kommen nicht vor.

## A. Abschnitt und Funktion

- **Name, Position:** `rh-01-kopf` + `st-02-umschalter`, oberstes Element unter dem Kopf in beiden Ansichten von `/`. Unter 1024 px
  (Telefon und Zwischengröße, K-11) als Segment über dem Startfoto (Glas in H1, Ersatzfüllung in V1), scrollt weg, steht zusätzlich im Menü
  (IA-AB-3); ab 1024 px im Kopf neben dem Logo (GEST:190). Kopf und Menü selbst regeln `rh-01` und `rh-02`.
- **Ziel:** Zielgruppe wählen ohne eigene klebende Zeile. Heute ist der Kopf am Telefon 117 px hoch, das Foto beginnt bei y = 268 (PA 1.8).
- **Nutzerfrage:** „Bin ich in der richtigen Ansicht?“ · **Entscheidung:** Ansicht wechseln oder bleiben. Für FB-5 Einstieg in die
  eingebettete Seite für Fensterbauer (W6); FB-4 kommt über `?von=pdf` schon in „Fensterbauer“ an; Hauseigentümer bleiben ungestört.
- **Kein Handlungsaufruf.** Der zweite, leise Wechsel ist die Wechselkarte (`st-04`).

## B. Konkreter Inhalt

| Inhalt | Wortlaut / Verhalten | Fundstelle |
|---|---|---|
| Wörter | „Hauseigentümer“, „Fensterbauer“, Reihenfolge bis IA-O-10 | `web/assets/portal.js:405`; GEST:190 |
| Gruppe, Zustand | `role="group"`, „Ansicht wählen“; `aria-pressed` je Knopf | `portal.js:405`; `scripts/pruefen.mjs:163` |
| Anker, Speicher | `#hauseigentuemer`, `#fensterbauer`, alt `#betriebe`, per `replaceState`; Wahl in `aufmass.portal.v1` | `portal.js:21`, `:397-402`, `:1962-1978`; GEST:191 |
| Standard | „Hauseigentümer“; `?von=pdf` öffnet „Fensterbauer“ | `portal.js:398`, `:1976` |
| Wechsel | Sprung an den Anfang der Ansicht; gleiche Wahl scrollt nur nach oben | `portal.js:1775-1781` |
| Statusmeldung | **Textentwurf** „Ansicht für Fensterbauer geöffnet.“ / „Ansicht für Hauseigentümer geöffnet.“ (nur Screenreader) | neu |
| Ohne JavaScript | zwei Links „Hauseigentümer“ (`aria-current="page"`) und „Fensterbauer“ → `/fuer-fensterbauer/` | IA K03; 8.1.1 Nr. 5 |

Keine Überschrift, kein Symbol, keine Zahl. **Vorhandene Bausteine:** `umschalter()` (`portal.js:403-406`), `.seg`
(`web/assets/gemeinsam.css:80-84`), Glas der Meldungen (`web/assets/verkauf.css:199-201`), Beobachter von `kopfCta` (`portal.js:551-562`).

## C. Exakte Layoutkomposition

### C.1 Telefon 390 × 844

| Z | Ebene | Lage |
|---|---|---|
| 0 | Grund `#161616` | ganze Fläche |
| 20 | Startfoto, eigener Telefonzuschnitt | x 0–390, y 0–420, unteres Viertel ausgeblendet |
| 22 | Scrim `#161616` 60 % → 0 | y 0–96; **Festlegung I:** in der Bühne unter dem Glas, sonst wäre das Glas oben dunkler |
| 25 | **Umschalter**, Glasfläche der Spur samt Lichtkante | x 16–300, y 68–112 |
| 30 | **Umschalter**, Wörter, Segmente und Trefferflächen (K-39) | x 16–300, y 68–112 |
| 30 | Bedienschicht H1 bzw. V1 | ab y ≈ 324 |
| 40 | Kopf 56 px, flächenlos: Logo x 16, Menü x 330–374 | y 0–56 |

- **Struktur:** keine Zeile, ein schwebender Baustein am oberen Rand der Bühne; das Foto beginnt bei y 0 unter dem Kopf (Kopf mit
  `margin-bottom: -56px`, Voraussetzung aus `rh-01`).
- **Ausrichtung:** linksbündig an der Ordnungslinie x 16 wie Logo, Kicker, h1 und Knöpfe; asymmetrisch, rechts bleiben 90 px über Öffnung
  bzw. Bullauge frei. Im Vier-Spalten-Raster (77,5 px, Rinne 16) Spalten 1–3.
- **Abstände:** Logo-Unterkante (y ≈ 44) bis Umschalter 24 px (Gruppe zu Gruppe, SG 10.9); darunter ≈ 218 px reines Bild bis zur
  Bedienschicht.
- **Verhältnisse:** 73 % der Breite, 5,2 % der Höhe, 3,8 % der Fläche; Kopf 6,6 % der Höhe (SG: ≤ 8 %). Größenfolge: Figur ≈ 300 px ≫
  h1 32 ≫ Wortmarke 17 > Umschalter 15.

### C.2 Baustein und Startwerte

| Teil | Wert | Begründung |
|---|---|---|
| Spur | 284 × 44 px, Radius 22 | Kontrollhöhe 44 (GEST:32). **Festlegung I** (übernommen als K-29, 11.6.3) gegen 260 px aus 08 („≈ 260“ in IA): eigene Messung in Inter 15 px „Hauseigentümer“ 118,6 / 122,0 px, „Fensterbauer“ 95,6 / 98,4 px (500 / 700); 260 ließe 8,7 px Luft je Wortseite |
| Segmente | 150 und 126 × 36 px, 4 px vom Spurrand, nach Wortbreite | 14 px Luft je Seite; 22 − 4 = 18 = Segmentradius (SG 10.5); gleiche Hälften bräuchten 304 px |
| Tippfläche | volle Spurhöhe, 154 × 44 und 130 × 44 | SKILL:71; Prüfsuite misst Knopfhöhe |
| Schrift | Inter 15/20; nicht gewählt 500 `--text2` (`#c9c8c3`), gewählt 700 `--text` (`#f3f2ee`) | K-3, K-29; Bedienschrift ≥ 14 (SG 10.9); Skala SKILL:69 |
| Glas (H1) | `#1f1f1f` 60 %, Unschärfe 24 px, Sättigung 100 % | DG 2.3.3, DG-AB-17 |
| Ersatz (V1, ohne Filter) | `#1f1f1f` 80 % | SG 10.3/9; C.4 |
| Kante | 1 px rundum `--kante-alpha` (Tinte 14 %), Ober- und rechte Kante `--kante-licht` (24 %); auf V1 die rechte Kante zum Erdlicht `--kante-quelle` (`--el` 24 %) | K-24 (11.5.4): Licht von oben rechts (`--licht-x` −0,6, `--licht-y` 0,8); im Foto Öffnung bzw. Bullauge rechts |
| gewählt | Füllung `--surface3` (`#2e2e2e`) opak, innere 2-px-Kontur `--text`, Schrift 700 `--text`; nicht gewählt ohne Fläche | K-3 (11.6.3), D; Abweichung ST2-AB-1 (= DS-AB-4) |
| Schatten, Glanz, Schein | keine | DNA Nr. 6, 9, 10 |

### C.3 Freizone im Foto [V]

Prüfpunkt aus 08 und SKILL:87: Das Glas verdeckt weder Figur noch Öffnung. **Am heutigen Foto hält er nicht.** Eigene Messung im
Standardzuschnitt 390 × 420: Kopf des Waschbären x ≈ 180–245, y ≈ 60–125, Arm bis x ≈ 290; Kopf des Astronauten x ≈ 195–260, y ≈ 68–125.
Beide Telefonzuschnitte brauchen: **Umschalterzone** x 0–312, y 56–124 ohne Figur, Gesicht, Öffnung, Werkzeug, Papierflieger;
**Kopfzone** y 0–56 ohne Hauptdetail; **Figur** ab y 136 (≥ 32 % der Fotohöhe), Öffnung bzw. Bullauge ganz rechts von x 312; **Tonwert**
unter dem Glas nach 24 px Unschärfe ≤ 164 von 255, damit die nicht gewählte Schrift `--text2` (K-3) auf Glas 4,5:1 hält (Glasgrund dann
≤ `#545454`; mit Glasfüllung .65 nach 11.5.3 ≤ 183; `--text` allein hielte bis 225). Heute unter dem Segment: Mittel 136, 90 % ≤ 193 (H1),
damit nicht erfüllt; bis zum neuen Zuschnitt gilt der Rückfall aus H.4 (Ersatz auch in H1); Mittel 42 (V1).

### C.4 Ansicht Fensterbauer

Gleiche Lage und Größe, damit der Umschalter beim Wechsel stillsteht. **Festlegung I:** Ersatzfüllung statt Live-Unschärfe, weil das Foto
von V1 mit Tiefe 0,88 unter dem Segment wandert (kein Glas über bewegtem Motiv, SG 10.8), darunter dunkle, kaum gesättigte Wand liegt
(SG 10.3, Mobil) und das Glasbudget von V1 bei der vordersten Meldung bleibt. Meldungsstapel und `?von=pdf`-Hinweis beginnen bei y ≥ 136
statt 124 (08 8.3.3): 12 px läsen sich als eine Gruppe. Abstimmung mit `fb-01`, `st-03`.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung, Intensität | Beitrag |
|---|---|---|
| Tiefe | Glasfläche Z 25 zwischen Foto und Bedienschicht, Wörter und Trefferflächen Z 30 (K-39), nur Verdeckung und Unschärfe; 1 von 4 | Schicht über dem Bild statt Kopfzeile |
| Material | Glas, einziges UI-Material in H1; 2 | Signature von H1; das Foto bleibt sichtbar |
| Licht, Schatten | kein Schatten (DG-AB-1); Lichtkante nach K-24: rundum 14 %, oben und rechts 24 %, auf V1 rechts `--el` 24 % | verankert im Licht des Fotos, ohne zu leuchten |
| Form | Vollrundung 22 / 18 | dieselbe Familie wie alle Knöpfe (DNA Nr. 5) |
| 3D, Perspektive | keine, frontal | DNA Nr. 1 |
| Bildintegration | in geplanter Freizone (C.3) | Bild und Seite ein Raum (DNA Nr. 4) |
| Oberflächendetail | Haarkante; Tintenkontur wie eine Linie im Aufmaßblatt | „präzise wie ein Aufmaß“ (DR) |
| Animation | Zustand; Glas klärt sich einmal nach dem Fotoauftritt | Material erscheint, wenn das Bild steht |
| Typografie | 15 px, kein Grün, keine Versalien | Grün bleibt beim einen Wort der h1 |

**Zustand [V] nach K-3 (11.6.3):** gewählt = Füllung `--surface3` (opak gegen Glas, SG 10.3/7) plus innere 2-px-Kontur `--text`, Schrift
700 `--text`; nicht gewählt ohne Fläche, Schrift 500 `--text2`. Die Füllung ist der Kanal „aktiv“ (DG 2.2.10), die Tintenkontur gehört
dazu: Die Füllung allein erreicht über dunklem Foto keine 3:1 zum Glas, die Kontur über jedem zulässigen Glasgrund ≥ 4,5:1 (WCAG 1.4.11).
Hover = Kontur `--line2` (`#3a3a3a`). Nie Cream (SKILL:71; IA K03; PA F1). **Weggelassen:** gleitender oder federnder Zeiger, Skalierung beim Drücken (heute
`gemeinsam.css:83`), Schein, Sättigungsanhebung, Parallaxe des Segments, Symbole, Überblenden vom alten ins neue Foto (KA-AB-7, nicht in E), Haptik.

## E. Visual Attention Architecture

Erwartet, nicht gemessen (RE E1–E3).

- **Primär (Hauseigentümer):** Waschbär → h1 → Cream „Jetzt ausmessen“ (y 550–602). Der Umschalter ist für Hauseigentümer vierter Halt,
  für Fensterbauer zweiter: Sie tasten die erwartbare Zone oben links ab (E2) und finden nach dem Logo das Wort „Fensterbauer“.
- **Kontraste:** Hellstes am Segment sind Schrift und 2-px-Kontur des gewählten Segments; die Spur liegt im Tonwert nah am Foto. Im Kopf stehen auf Bühnen nur
  Logo und Menü (N4).
- **CTA:** keiner. Die Cream des Startbilds bleibt die einzige helle Fläche; heute ist das gewählte Segment eine zweite Cream-Pille
  (`bestand/browser-mobil.md`, Abschnitt 8 Nr. 3).
- **Ablenkungen:** Kontur nahe am Gesicht (12 px Abstand, C.3); Glas, das während des Fotoauftritts rechnet (wartet, F); zu helle Kante
  über hellem Foto (höchstens 24 %, K-24).
- **Übergang:** Beim ersten Scrollen wandert der Umschalter mit dem Foto, der Kopf wird opak; danach führt H1 bzw. V1. Oben links liegt
  außerhalb des Daumenbereichs (E18); dieselbe Wahl steht im Menü-Blatt unten.

## F. Interaktions- und Bewegungsverhalten

Dauern nach DG-AB-16, Kurve `--e-out` = `cubic-bezier(.2,.7,.2,1)` ohne Überschwingen (`gemeinsam.css:30`).

| Ereignis | Verhalten | Dauer | Weniger Bewegung |
|---|---|---|---|
| Laden H1 | Umschalter steht ab dem ersten Bild mit Ersatz 80 %; nach dem Foto-Auftritt (K-7: Deckkraft 0,35 → 1 und Maßstab 1,03 → 1 gemeinsam in 900 ms `--e-out`, Ursprung am Anker, Start nach `img.decode()`) blendet die Glasschicht ein, die Ersatzschicht aus | 320 ms nach Ende des Foto-Auftritts | Glas sofort |
| Erste Eingabe im Auftritt (Scrollen > 4 px, Wischen, Rad, Taste) | Laufendes und Ausstehendes (Foto-Auftritt, Klären des Glases) per Deckkraft in den Endzustand; nichts springt (K-7, 11.7.2) | 220 ms `--t2` | – |
| Scrollen | Umschalter 1 : 1 mit der Seite. Erreicht seine Oberkante die Kopfunterkante + 8 px (y 64, nach 4 px Scrollweg; K-27), wird der Kopf opak `#161616` mit Haarlinie; flächenlos wieder bei Oberkante ≥ y 88 (Hysterese 24 px), auf `/` also erst ganz oben (`scrollY` 0), weil der Umschalter in Ruhe bei y 68 steht | Deckfläche ein 150 ms `--e-out`, aus 110 ms `--e-in` | ohne Übergang |
| Finger auf nicht gewähltem Segment | Vorschau: Füllung und Kontur dort 50 % | 0; zurück 150 ms | ohne Übergang |
| Tippen, Klick, Leertaste, Eingabe | Segment wechselt (Füllung, Kontur, Gewicht); nach 150 ms Wechsel der Ansicht (K-5): Anker, Speicher, Neuaufbau und Sprung an den Anfang ohne Gleiten; die neue Ansicht blendet über Deckkraft ein, danach läuft ihr eigener Foto-Auftritt (K-7); Umschalter und Kopf stehen | 150 ms `--t1`, dann 220 ms `--t2` `--e-out` | ohne Übergang, Schnitt |
| Hover (`hover: hover`) | nicht gewähltes Segment: Kontur `#3a3a3a` | 150 ms | ohne Übergang |
| Fokus | `outline: 2px solid var(--text)`, Abstand −2 px, weil das Segment an die Gruppenkante stößt (K-34), Radius voll (22) wie die Spur, liegt auf Z 30 über Glas, nie verdeckt | 0 | gleich |
| Wahl im Menü | Blatt schließt (`rh-02`), Wechsel wie oben, Fokus auf den Menü-Knopf | – | ohne Übergang |

**Begründung:** Die Bedienschicht bewegt sich nicht (SG 10.7; DNA 5.1 Nr. 7). Tiefe und Bewegung trägt beim Wechsel das Foto der neuen
Ansicht, während Umschalter und Kopf stehen: ein Szenenwechsel unter stehender UI mit einem Träger (E-2). Das Glas wartet auf das stehende
Foto, weil Unschärfe über bewegtem Bild am Telefon ruckeln kann (SG 10.8). Ruhige Fassung nach GEST:38 und `gemeinsam.css:210`.

## G. Responsive Design

### G.1 Telefon 390 × 844 (zuerst)

Wie C; bei 390 × 664 unverändert. 360 px: rechts 60 px frei; 320 px: passt in 288 px; 430 px: bleibt 284 px. Ab 200 % Text dürfen die
Wörter umbrechen, die Spur wächst in der Höhe. Bildschirme ohne Bühne auf `/` (Tour, Preise, Registrierung, „So funktioniert es“): Umschalter
nur im Menü. Einbettung lädt noch oder fällt aus (`aria-busy`, `.vk-rueckfall`): Fassung „Fläche“ an gleicher Stelle.

### G.2 Zwischengröße 640–1023 (K-11)

Wie Telefon, x 24 (Seitenrand 24 px), y 68. Freizone im Zuschnitt bei 768 px prüfen, `object-position` je Breite.

### G.3 Schreibtisch 1280 × 800

Zwölf Spalten in 1040 px ab x 120. Kopf 64, Umschalter y 10–54, x 284–568 (24 px nach der Wortmarke, Logo x 120–260), Fassung „Fläche“:
`#1f1f1f`, Kante 14 / 24 %, kein Glas, weil kein Bild darunter (DR:196). Er endet 15 px hinter der 5 : 7-Teilung über dem ausgeblendeten
Fotorand. Kontext Hauseigentümer: „Ratgeber“, Knopf. **Festlegung I:** „Für Fensterbauer“ (08 8.2.2) entfällt auf `/`, weil der Umschalter
dasselbe Ziel trägt (8.1.1 Nr. 5). Kontext Fensterbauer: Sprungmarken x ≈ 600–868, „Anmelden“, Ring bis x 1160.

### G.4 Schreibtisch 1024

Rand 32 (K-11, K-13): Logo x 32–172, Umschalter x 196–480. **Festlegung I:** Die Sprungmarken stehen nur im Kopf, wenn seine
Inhaltsbreite Umschalter, Sprungmarken, „Anmelden“ und Ring fasst (≈ 1.022 px); das prüft eine Containerabfrage am Kopf, keine eigene
Bildschirmschwelle (K-11). Bei 1024 (Inhaltsbreite 960) stehen sie im Menü, ab ≈ 1.086 px Fensterbreite im Kopf; der Umschalter weicht nie.
Abstimmung mit `rh-01`.

## H. Technische Umsetzung

### H.1 Bestehendes und Änderungen

- `portal.js:403-406` `umschalter()`: eine Funktion für drei Orte (Kopf ab 1024, Bühne darunter, Menü); `data-act="ansicht"` bleibt.
- `portal.js:445`: im Kopf nur ab 1024 (K-11); zusätzlich `div.ums-ort` als erstes Kind eines Bühnen-Behälters (`position: relative`, beginnt an der
  Oberkante der Ansicht; in der Einbettung vor `section.vk-einbettung`).
- `portal.js:1775-1781`: 150 ms Verzögerung vor `nav('landing')`, Sprung ohne Gleiten, neue Ansicht blendet in 220 ms über Deckkraft ein
  (K-5), danach Fokus auf den gewählten Knopf, Statusmeldung in einer Live-Region.
- `portal.css:50-56`: Zeile bis 879 px entfällt; `.story-stage { top: 122px }` und `verkauf.css:658` `--vk-kopf: 122px` → 56 px.
- `verkauf.css:199-201`: Glas der Meldungen auf gemeinsame Tokens (100 %, Ersatz 80 %; DG-AB-17).
- Kopf opak nach K-27: zwei `IntersectionObserver`-Ränder am Umschalter wie in `rh-01` (`rootMargin: -64px 0 0 0` schaltet ein,
  `-88px` schaltet aus, Hysterese 24 px), dazu ein Wächter am Seitenanfang für die Ruhelage auf `/`; Schwelle 1, nach `portal.js:551-562`.
- `web/index.html`: Zeile mit zwei Links unter `.rg-kopf`, 15 px, Ziele 44 px; Lage mit `st-05`.

### H.2 Aufbau und CSS-Kern

```html
<div class="ums ums--glas" role="group" aria-label="Ansicht wählen">
  <span class="ums-glas" aria-hidden="true"></span><span class="ums-ersatz" aria-hidden="true"></span>
  <button type="button" data-act="ansicht" data-v="kunde" aria-pressed="true"><span data-w="Hauseigentümer">Hauseigentümer</span></button>
  <button type="button" data-act="ansicht" data-v="betrieb" aria-pressed="false"><span data-w="Fensterbauer">Fensterbauer</span></button>
</div>
```

```css
.ums { position: relative; display: inline-flex; height: 44px; border-radius: 22px; }
.ums-glas, .ums-ersatz, .ums::after { content: ""; position: absolute; inset: 0; z-index: var(--z-vermittelnd); border-radius: inherit; pointer-events: none; } /* Fläche Z 25, K-39 */
.ums-glas { background: rgb(31 31 31 / .6); backdrop-filter: blur(24px); opacity: 0; transition: opacity 320ms var(--e-out); }
.ums-ersatz { background: rgb(31 31 31 / .8); transition: opacity 320ms var(--e-out); }
.ums.klar .ums-glas { opacity: 1; } .ums.klar .ums-ersatz { opacity: 0; }
.ums::after { box-sizing: border-box; border: 1px solid var(--kante-alpha); border-top-color: var(--kante-licht); border-right-color: var(--kante-licht); } /* K-24 */
.ums--ersatz::after { border-right-color: rgb(122 162 255 / .24); } /* V1: --kante-quelle, Erdlicht --el 24 % */
.ums button { position: relative; z-index: var(--z-ui); height: 44px; padding: 0 14px; border: 0; background: none; color: var(--text2); font: 500 15px/20px var(--font); } /* Inhalt und Trefferfläche Z 30, K-39 */
.ums button:first-child { padding-left: 18px; } .ums button:last-child { padding-right: 18px; }
.ums button > span { display: inline-grid; position: relative; z-index: 1; }
.ums button > span::after { content: attr(data-w); font-weight: 700; height: 0; visibility: hidden; } /* hält die fette Breite frei */
.ums button::after { content: ""; position: absolute; inset: 4px 0; border-radius: 18px; background: var(--surface3);
  box-shadow: inset 0 0 0 2px var(--text); opacity: 0; transition: opacity 150ms var(--e-out); } /* gewählt nach K-3 */
.ums button:first-child::after { left: 4px; } .ums button:last-child::after { right: 4px; }
.ums [aria-pressed="true"] { font-weight: 700; color: var(--text); } .ums [aria-pressed="true"]::after { opacity: 1; }
.ums button:not([aria-pressed="true"]):active::after { opacity: .5; transition: none; }
.ums button:focus-visible { outline: 2px solid var(--text); outline-offset: -2px; border-radius: 22px; } /* K-34: Segment an der Gruppenkante */
.ums--flaeche .ums-ersatz { background: #1f1f1f; }
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) { .ums-glas { display: none; } .ums .ums-ersatz, .ums.klar .ums-ersatz { opacity: 1; background: rgb(31 31 31 / .95); } }
@media (prefers-reduced-motion: reduce) { .ums *, .ums *::after { transition: none; } }
@media (forced-colors: active) { .ums { border: 1px solid ButtonText; } .ums [aria-pressed="true"] { background: Highlight; color: HighlightText; } }
```

`.klar` setzt das Skript nach dem Foto-Auftritt (bei weniger Bewegung sofort; bei der ersten Eingabe während des Auftritts sofort mit
220 ms statt 320 ms, K-7) und nur, wenn `CSS.supports('backdrop-filter', 'blur(1px)')`; `.ums--ersatz` und
`.ums--flaeche` bekommen es nie. Hover: `@media (hover: hover)` nicht gewähltes `::after` mit `opacity: 1; background: none;
box-shadow: inset 0 0 0 1px #3a3a3a`. Im Code als Tokens in `gemeinsam.css`.

### H.3 Assets

| Asset | Art, Maß | Quelle |
|---|---|---|
| `start-hauseigentuemer`, Telefonzuschnitt | Foto, randlos, Vorlage 1560 × 1680 px (13 : 14), WebP 390 / 585 / 780 px breit, ≤ 200 KB bei 780 | **beim Inhaber anzufragen** (SKILL Abschnitt 7) |
| `fb-sessel`, Telefonzuschnitt | wie oben; schon für `fb-01` angefragt (EV X6), Freizone aus C.3 ergänzen | beim Inhaber anzufragen |

**Anfrage (Entwurf, SKILL Abschnitt 7):** Zweck Startfoto am Telefon mit Freizone nach C.3; gleiches Motiv, nach oben erweitert; Licht
von oben rechts (K-24: `--licht-x` −0,6, `--licht-y` 0,8); kein Text, kein Wasserzeichen, keine Logos. Prompt: „Vertical 13:14 photo, 1560 × 1680 px. A raccoon standing on a wooden step stool
in a raw-construction room, measuring the width of a window opening with a yellow folding rule, smartphone in the other paw. Camera slightly
further back: the upper third shows a calm, warm plaster wall and ceiling with no objects, not pure white; the raccoon's ears no higher than
one third of the image height; the window opening with daylight fully visible in the right fifth; daylight falling from the upper right; photorealistic.
No text, no watermark, no logos.“ Bis dahin: heutiges Foto, `object-position` mit geringster Verdeckung, Prüfpunkt offen.

### H.4 Animation, Leistung, Barrierefreiheit

Nur `opacity` wird animiert, nie der Unschärferadius. Eine Glasfläche 284 × 44 rechnet erst nach dem Fotoauftritt und nie über bewegtem
Bild; Risiko bleibt `backdrop-filter` beim Scrollen auf schwachen Android-Geräten (Test am Telefon des Inhabers; Rückfall Ersatz auch in H1).
Absolut gelegt, kein Layoutsprung. Kontraste: `--text2` auf Glas ≥ 4,5:1 bei Tonwert ≤ 164 (Füllung .65: ≤ 183);
`--text` auf `--surface3` 12,1:1; Kontur `--text` zum Glas ≥ 4,5:1; Ersatz: `--text2` ≥ 5,1:1, `--text` ≥ 7,6:1 über jedem Tonwert. Name gleich sichtbarem Wort; DOM-Folge Kopf → Umschalter → Startbild; `scroll-padding-top` ≥ 56; Zustand über Füllung,
Kontur, Gewicht und `aria-pressed`, nie nur Farbe.

### H.5 Prüfsuite

`scripts/pruefen.mjs:211-213` erwartet eine eigene Zeile ≥ 340 px und Kopf ≤ 124 px. Neu bei 390 × 844: Umschalter außerhalb von `.top`,
Oberkante ≥ Kopfunterkante + 12, Breite 284 ± 4, Knöpfe ≥ 44 px hoch und ganz lesbar, Kopf ≤ 67 px, Foto ab y 0. `:160-191` (1280 px)
bleibt. Freigabe IA-O-9 (08 8.4.7 Nr. 9).

### H.6 Abweichungen und Festlegungen

| Nr. | bestehende Regel | hier |
|---|---|---|
| IA-AB-3 | eigene, volle Zeile der klebenden Kopfzeile (GEST:190) | Glas über dem Foto, scrollt weg, im Menü. **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (08 8.4.5) |
| ST2-AB-1 (= DS-AB-4) | gewählt in Segmenten Cream (GEST:24); „aktiv = Cream gefüllt“ (DG 2.2.10) | Füllung `--surface3` mit innerer 2-px-Kontur `--text`, Schrift 700 `--text`; nicht gewählt ohne Fläche, 500 `--text2` (K-3). **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: eine Cream je Bildschirm (SKILL:71), PA F1, IA K03. Rückfall nach DS-AB-4: Füllung `--muted`, nie Cream |
| DS-AB-6 | Schwellen 880 (`portal.css`) und 1199 px (`verkauf.css`) im Bestand | Umbruchpunkte 640 und 1024 (K-11); Sprungmarken im Kopf per Containerabfrage (G.4). **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (11.2.1) |
| ST2-AB-2 | Umschalter auch auf Tour, Preisen, Registrierung (GEST:190) | dort am Telefon nur im Menü. **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: kein Glas ohne Bild (DR:196) |
| DG-AB-1, -17 | Schatten, Sättigung 140 %, Ersatz deckend (DR 3.1) | wie DG 2.5.3 |
| Festlegung I | Breite 260; Stapel ab y 124; „Für Fensterbauer“ im Kopf auf `/` | 284 (C.2; = K-29); y 136 (C.4); entfällt (G.3) |

## I. Conversion-Begründung

- **Position:** Oben links erwartet man Navigation (RE E2); in den ersten zwei Bildschirmen liegt die meiste Betrachtungszeit (E1). Ohne
  eigene Zeile beginnt das Foto bei y 0 statt 268, und Preiszeile und Cream von H1 stehen bei 664 px im Bild (E-1), während der Wechsel im
  ersten Bildschirm bleibt.
- **Gestaltung:** wenig Gewicht für die Mehrheit (keine Cream, Tonwert nah am Foto), ein klares Wort für die Minderheit. Der stehende
  Umschalter zeigt beim Wechsel: dieselbe Seite, zweite Ansicht, nichts verloren.
- **Informationsmenge:** zwei Wörter; jede Zusatzzeile kostet im Ersturteil (E2, E3).
- **Zielhandlung:** Z1a über W6 (FB-5 auf `/` → V1 → Pakete); Z2a bleibt geschützt, weil die Cream nicht verdoppelt und das Foto nicht
  abgedeckt wird.

| Nr. | Hypothese [H] | Prüfweg | Rückfall |
|---|---|---|---|
| H-ST2-1 | Die gewählte Ansicht wird an Füllung und Kontur so sicher erkannt wie heute an der Cream | Fünf-Sekunden-Test „Welche Ansicht ist offen?“ mit beiden Fassungen; Sichtprüfung des Inhabers | ST2-AB-1 Rückfall |
| H-ST2-2 | Fensterbauer auf `/` finden den Wechsel ohne eigene Zeile, auch nachdem er weggescrollt ist | beobachtete Aufgabe mit drei bis fünf Fensterbauern (Zählungen gibt es nicht, EA O-2) | Textlink „Für Fensterbauer“ im Kopf am Telefon |
| H-ST2-3 | Das Glas zieht Hauseigentümer nicht von h1 und Cream ab | Blinzeltest am Telefonbild; „Was kann man hier tun?“ | Ersatz auch in H1, dann ohne Signature |
| H-ST2-4 | Das Klären des Glases wirkt hochwertig, nicht wie Flackern | Telefon-Video, Urteil des Inhabers | Glas ab dem ersten Bild oder dauerhaft Ersatz |

Offen beim Inhaber: Reihenfolge der Wörter (IA-O-10), ST2-AB-1 (= DS-AB-4), ST2-AB-2, DS-AB-6, beide Telefonzuschnitte, Prüfsuite (IA-O-9).

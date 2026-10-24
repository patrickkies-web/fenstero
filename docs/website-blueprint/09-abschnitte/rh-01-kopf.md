# Kopfzeile in drei Kontexten (Hauseigentümer, Fensterbauer, neutral) mit Ring und Zielwechsel

Seite: Rahmen (alle Seiten außer App und Kundenkonto) · Position: 1 (`rh-01-kopf`, vor jedem Abschnitt, klebt) · Intensitätsstufe: 1 (T0)

Grundlagen: ZA 8.2.1–8.2.2, 8.3.1; EV 7.5.2, 7.5.4 (W9); DG 2.3.2 (T0), G1, G6; SG 10.1, 10.3/6, 10.7, 10.10 Nr. 14–20; DNA-B B.3.5,
B.3.7. `10-paketentscheidung.md` liegt nicht vor; der Kopf nennt weder Preis noch Paket, nur den Weg. **[V]** verbindlich, **[H]**
Hypothese mit Rückfall.

## A. Abschnitt und Funktion

- **Name, Lage:** Kopfzeile `rh-01-kopf`, erstes Element jeder Seite, nur eine optionale Pilotleiste (`st-01-baender`, 40 px, nur ohne
  Server) steht darüber und scrollt weg. Darunter folgen je Seite `fb-01-startbild` (V1), auf `/` H1 mit Glas-Umschalter
  (`st-02-umschalter`), `ar-01-artikelkopf` oder `pb-01-kopf-pdf-zeile`. Der Kopf öffnet `rh-02-menue`; ohne JavaScript führt er zur
  Navigation im Fuß (`rh-03-brotkrumen-fuss`, `#navigation`).
- **Ziel:** Orientierung (wer, wo) und **genau ein dauerhafter Handlungsträger** (N5). Es gibt keine Kaufleiste, keine Kapitelanzeige
  (N6), keinen Lesefortschritt und kein Ausblenden beim Scrollen.
- **Beantwortete Nutzerfrage:** „Wo bin ich, und wie komme ich von hier aus am schnellsten zum Wichtigsten?“
- **Vorbereitete Entscheidung:** Fensterbauer kommen von jeder Stelle zu den Paketen, in Zustand A ab den Paketen zur Anfrage;
  Hauseigentümer in die App. Entschieden wird im Inhalt (04, 05, H1); der Kopf ist nur der Schnellweg.

## B. Konkreter Inhalt

| Kontext und Seiten (8.2.2) | Telefon (< 1024) | Schreibtisch (≥ 1024) | Handlungsknopf |
|---|---|---|---|
| **Fensterbauer:** `/fuer-fensterbauer/`, 5 Fachartikel, `/konfigurator-bedingungen/`, `/` Ansicht Fensterbauer | Logo, Ring, Menü | Logo · auf `/` Umschalter · Sprungmarken „So funktioniert es“, „Ablauf“, „Fragen“ · Textlink „Anmelden“ · Ring | Ring „Pakete ansehen“ → `#pakete` (sonst `/fuer-fensterbauer/#pakete`); Zustand A ab der Namensleiste **Textentwurf** „Paket anfragen“ → `#frage` |
| **Hauseigentümer:** `/` Ansicht Hauseigentümer, `/ratgeber/` und 23 Artikel, Textfassungen von `/` und `/app/` | Logo, Knopf, Menü | Logo · auf `/` Umschalter · „Ratgeber“, „Für Fensterbauer“ · Knopf | „Fenster ausmessen“ bzw. „Aufmaß fortsetzen“ → `/app/#ausmessen`; Cream nur ohne sichtbare Cream im Inhalt, sonst Ring |
| **neutral:** 6 Rechtsseiten, 404 | Logo, Menü | Logo · „Für Fensterbauer“ → `/fuer-fensterbauer/` · „Fenster ausmessen“ → `/app/` | keiner |

**Bestehende Inhalte mit Fundstelle**

- Zeichen und Wortmarke: `Logo.svg(px)` und `Marke.wort()` (`web/assets/gemeinsam.js:121-137`, `:144`). Lichtanimation `.fi-logo.leuchtet`
  (`web/assets/gemeinsam.css:162-168`). Eine Quelle: `scripts/logo-setzen.py` (GEST:7).
- „Pakete ansehen“ als Ring → `#pakete` (`web/fuer-fensterbauer/index.html:50`). „Fenster ausmessen“/„Aufmaß fortsetzen“ und
  Cream-Ring-Logik `kopfCta()` (`web/assets/portal.js:449`, `:551-562`; GEST:192, :399). „Anmelden“ (`portal.js:450`). Umschalter
  „Hauseigentümer“/„Fensterbauer“ (`portal.js:403-406`). „Ratgeber“, „Für Fensterbauer“ (Kopf der Ratgeber, SI 2.1).
- Anker gibt es schon: `#so-funktioniert-es`, `#pakete`, `#ablauf`, `#bestellen`, `#frage`, `#haeufige-fragen`
  (`web/fuer-fensterbauer/index.html:85-235`).
- aria-label des Logos „eeziframes, zur Startseite“ (`web/fuer-fensterbauer/index.html:50`).

**Neue Texte (alle Textentwurf)**

- Ring nach dem Zielwechsel: „Paket anfragen“ (Wortlaut aus 08, passt zu den Kartenknöpfen „… anfragen“, `functions/pakete-seite.js:115`).
- Kurzformen für schmale Telefone (G): „Ausmessen“ (unter 390 px, in beiden Zuständen des Knopfs für Hauseigentümer), „Pakete“ und
  „Anfragen“ (unter 360 px).
- Logo im Kontext Fensterbauer: aria-label „eeziframes, zur Seite für Fensterbauer“; auf `/` „eeziframes, zum Anfang der Ansicht“.
- Menü-Knopf: zugänglicher Name „Menü“. Sprunglink als erstes fokussierbares Element: „Zum Inhalt“ (nur bei Fokus sichtbar).

**Interaktionen:** Logo (Ziel je Kontext, IA-H-5), Sprungmarken, „Anmelden“ (auf `/` Anmeldeblatt mit Zeile „Konfigurator-Paket
bestellt? Zum Kundenkonto“, sonst `/partner/`; IA 5.3.2), Handlungsknopf (F), Menü, Umschalter (nur `/`, Schreibtisch).

**Nutzbare Komponenten:** `.btn.small.ghost` als Ring (44 px, 15 px, 2-px-Kontur `--line2`, `web/assets/gemeinsam.css:58`, `:62`),
`.btn.primary`, `Logo`, `Marke`, die Beobachterlogik aus `kopfCta()`, der Sprung-Handler der Einbettung (`portal.js:835-843`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Eine Zeile mit drei Zonen: links die Marke (Ordnungslinie), rechts bündig die Handlung, am Schreibtisch dazwischen
rechtsbündig die Navigation. Die Zeile ist asymmetrisch, die Marke steht allein links. Am Schreibtisch richtet der Kopf nur seine
Außenkanten am 12-Spalten-Raster aus (Spalte 1 links, Spalte 12 rechts). Innen fließen die Elemente mit festen Abständen, weil die
Kontexte unterschiedlich viele Einträge haben. Am Telefon gilt die volle Breite des 4-Spalten-Rasters (x 16–374).

**Telefon 390 × 844, Kopf 56 px (6,6 %; bei 664 px 8,4 %, zulässig, weil die Zielgröße vorgeht, SG 10.1)**

| Element | x | y | Größe | Anteil |
|---|---|---|---|---|
| Logo-Link | 16–140 | 6–50 | Ziel 124 × 44; Zeichen 28 × 28 (x 16–44, y 14–42), Abstand 8, Wortmarke 17 px (88 px breit) | 32 % der Breite |
| Ring Fensterbauer | 176–326 | 6–50 | 150 × 44 fest, für beide Texte gleich breit (116 px Text + 2 × 16) | 38 % |
| Knopf Hauseigentümer | 154–326 | 6–50 | 172 × 44 fest („Fenster ausmessen“ 143 px + 2 × 14) | 44 % |
| Menü | 330–374 | 6–50 | Ziel 44 × 44; Zeichen zwei Linien 18 × 2 px mit 8 px Abstand (x 343–361, y 22–34) | 11 % |
| freier Raum | 140–176 (Fensterbauer) bzw. 140–154 | – | 36 bzw. 14 px, mindestens 12 px | – |
| Scrim (nur Bühne) | 0–390 | 0–96 | ragt 40 px unter den Kopf | – |
| Haarlinie (nur opak) | 0–390 | 55–56 | 1 px `--line` | – |

Zwischen Knopf und Menü-Ziel liegen 4 px. Weil das Menüzeichen in seinem 44-px-Ziel mittig steht, wirkt der Abstand wie 17 px.

**Schreibtisch 1280 × 800, Kopf 64 px (8 %), Spalte x 120–1160, 12 Spalten à ≈ 64,7 px mit 24 px Rinne**

| Kontext | Belegung von links nach rechts (x), alle Ziele y 10–54 |
|---|---|
| Fensterbauer, eigene Seite | Logo 120–250 (Zeichen 32, Abstand 10, Wortmarke 88) · „So funktioniert es“ 569–723 · „Ablauf“ 727–800 · „Fragen“ 804–879 · 24 px · „Anmelden“ 903–1002 · 8 px · Ring 1010–1160 (150) |
| Fensterbauer auf `/` | wie oben, dazu Umschalter 274–545 (Segment 271 × 44, 24 px nach dem Logo) |
| Hauseigentümer, Ratgeber | Logo · „Ratgeber“ 716–807 · „Für Fensterbauer“ 811–961 · 24 px · Knopf 985–1160 (175 × 44, Polster 16) |
| Hauseigentümer auf `/` | Logo · Umschalter 274–545 · „Ratgeber“ 870–961 · 24 px · Knopf 985–1160 |
| neutral | Logo · „Für Fensterbauer“ 839–989 · „Fenster ausmessen“ (Textlink) 993–1160 |

Textlinks haben 44 px hohe Ziele mit 12 px Polster, untereinander 4 px Abstand. Zwischen Gruppen liegen 24 px, innerhalb einer Gruppe 8 px
(G6, Verhältnis 1 : 3). **Festlegung:** Auf `/` entfällt in der Ansicht Hauseigentümer am Schreibtisch der Link „Für Fensterbauer“, den 8.2.2
nennt. Der Umschalter direkt daneben tut dasselbe, und zwei Bedienelemente mit gleicher Wirkung in einer Zeile wären doppelt.

**Größenhierarchie:** Wortmarke 17 px > Knopf 15 px fett = Links 15 px (600). Der Kopf trägt kein Hauptelement (T0: „keiner; Klein-UI“).
Das Hauptelement des Inhalts ist am Telefon mindestens 3 × so groß wie die Kopfschrift.
**Verhältnis Text/Bild/Freiraum:** 0 % Bild; am Telefon sind ≥ 50 % der Kopffläche frei (im ersten Bildschirm von V1 ohne Ring ≈ 55 %).

**Ebenen [V]:** Der Kopf liegt als Ganzes in Z 40 (`--z-overlay`). Innen hat er drei Lagen: (1) Deckfläche `--ground` mit Haarlinie,
Deckkraft 0 oder 1; (2) Scrim, Deckkraft 1 nur auf der Bühne; (3) Inhalt. Darunter scrollt die Seite (Z 0–30) hindurch. Der Kopf verdeckt
also den Inhalt, und das ist sein einziges Tiefenmittel.

**Technische Startwerte**

| Token oder Eigenschaft | Wert | Begründung |
|---|---|---|
| `--kopf-h` | 56 px (< 1024), 64 px (≥ 1024) | N2; 44-px-Ziel + 2 × 6 bzw. 2 × 10 |
| Höhe bei niedrigem Fenster | bleibt 56 px | Wechselnde Höhe beim Ein- und Ausfahren der Browserleiste ließe den Kopf springen (SG 10.7/5) |
| Seitenrand | 16 px (< 640), 24 px (640–1023), Spalte 1040 px bzw. 32 px Rand bei 1024–1087 | G6 |
| `scroll-padding-top` | `calc(var(--kopf-h) + 12px)` | N12; gleicher Abstand wie `portal.js:840` |
| Scrim | `linear-gradient(#161616 60 % 0, 45 % 24px, 27 % 48px, 9 % 72px, 0 96px)` | DG T0 (60 % → 0 über 96 px), weich auslaufend, damit die Oberkante des Glas-Stapels in V1 (y 72) höchstens 9 % Abdunklung bekommt |
| Radien | Pille (`--pill`) für Knopf, Segment, Linkfläche | eine Formfamilie (SG 10.5/1) |
| Schatten, `backdrop-filter` | keine | DG T0 „Nicht“; DG-AB-10 |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung im Kopf | Intensität (0–4) | Wirkung und Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achse | Z 40 über allem; Tiefe nur durch Verdeckung des darunter scrollenden Inhalts (Nr. 2) | 1 | Der Kopf wirkt als feste Ebene vor dem Raum, nicht als Teil der Bühne |
| Material, Transparenz | über Inhalt opak und matt `#161616`; auf Bühnen ganz ohne Fläche, nur Scrim. Kein Glas: ohne gefiltertes Bild darunter ausgeschlossen (SG 10.3/6; Nr. 9) | 0 | Ruhe über Text; auf der Bühne bilden Bild und Seite einen Raum (Nr. 4) |
| Licht, Schatten | kein Licht, kein Schatten (Nr. 6, 10); einzige Lichtquelle ist das Fenster im Zeichen | 0 | Die Lichtquelle des Startbilds (Bullauge, Maueröffnung) bleibt der einzige Lichtkern |
| Formen | Pillen und 2-px-Kontur wie im Inhalt, Vollrundung | 1 | Der Knopf im Kopf ist als derselbe Ring wie im Inhalt erkennbar |
| 3D-Objekte, Perspektive | keine, die Bedienschicht ist frontal (Nr. 1) | 0 | – |
| Bildintegration | nur auf V1/H1: Der Kopf liegt flächenlos auf dem dunklen oberen Bildrand | 1 | Das Foto beginnt bei y = 0, und der erste Bildschirm gewinnt 56 px Bild |
| Oberflächendetails | Haarlinie 1 px unten; Menüzeichen aus zwei 2-px-Linien („präzise wie ein Aufmaß“); Zeichen mit `.fi-rand` | 1 | Feindetail an der Kante, nicht in der Fläche |
| Animation | nur Zustände über Deckkraft, Kontur, Füllung (G1); Lichtanimation des Zeichens nur auf Berührung, beim Laden nur auf Seiten ohne Ladeauftritt | 1 | Am Telefon bewegt sich je Ansicht genau ein Träger (E-2) |
| Typografie | Bühnenstimme Inter: Wortmarke 17, Links 15/600, Knopf 15/700; keine Technikstimme | 1 | Der Kopf fügt der Ansicht keine neue Größenstufe hinzu |
| Überlagerungen | Scrim als eigene Lage nur auf Bühnen | 1 | Die Wortmarke bleibt über dem Foto lesbar |
| Interaktive Effekte | Hover hellt die Kontur auf, Fokus als eigene Kontur; kein Tilt, kein Magnet, kein Skalieren | 1 | DNA-B B.3.7 |

**Bewusst weggelassen:** Glas und Unschärfe (heute `saturate(160%) blur(14px)`, `web/assets/ratgeber.css:7`), Schatten, Lesefortschritt
(`web/assets/verkauf.js:448-465`), Kapitelanzeige, grünes Signal im Kopf (Grün gehört Kicker, Haken und dem einen Wort), Leuchten an der
Pille, Ausblenden beim Scrollen, Kaufleiste.

## E. Visual Attention Architecture

Die Angaben beschreiben erwartete Aufmerksamkeit aus der Komposition, keine Messung.

- **Ankunft auf V1/H1:** Der Kopf soll kaum auffallen. Der Blick gehört dem Anker des Startbilds (Bullauge, Maueröffnung), dann der
  Cream im Lesestapel. Im Kopf stehen nur Logo und Menü, der Knopf ist noch ausgeblendet (N4). Das Logo oben links ist der erwartete
  Leseanfang (RE E2) und beantwortet „wer?“.
- **Nach dem Startbild:** Der Ring blendet einmal ein, sobald die Cream des Startbilds hinter dem Kopf verschwindet. Die einsetzende
  Bewegung zieht einen Blick an (RE E5) und zeigt, wo der Schnellweg ab jetzt liegt. Danach tritt der Ring zurück: Text `#f3f2ee`
  (≈ 16 : 1), Kontur `#3a3a3a` nur ≈ 1,6 : 1. Er steht also sichtbar unter jeder Cream im Inhalt; seine Fläche (6.600 px²) ist ≈ 35 %
  der Startbild-Cream (358 × 52).
- **Zielwechsel (Zustand A):** zweiter und letzter gewollter Blickanlass.
- **Hauseigentümer:** Die Cream im Kopf ist dort der hellste Wert. Sie erscheint nur, wenn im Inhalt keine Cream sichtbar ist (N3).
- **Ablenkungen und Gegenmittel:** Flackern an Schwellen (Hysterese 24 px); Lichtanimation des Logos während des Ladeauftritts (entfällt
  dort); Sprungmarken in `--text2`, nicht heller als Lesetext.
- **Übergang:** Den Austritt aus der Bühne markiert der Wechsel von Scrim auf Deckfläche mit Haarlinie.

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Weniger Bewegung |
|---|---|---|---|
| Laden | Der Kopf steht im Endzustand. Auf Bühnen ist er flächenlos (`data-flaeche="buehne"` im Markup). Das Zeichen leuchtet beim Laden nur auf Seiten ohne Ladeauftritt einmal auf (1,6 s) | – | Zeichen ruhig (`gemeinsam.css:208`) |
| Bühne → opak | Deckfläche 0 → 1, Scrim 1 → 0, sobald der Wächter (Oberkante Kicker − 64 px) die Unterkante des Kopfs erreicht; zurück entsprechend | 150 ms, `cubic-bezier(.2,0,0,1)` zurück `(.4,0,1,1)` | bleibt (nur Deckkraft) |
| Knopf erscheint (N4) | Deckkraft 0 → 1, wenn die Unterkante der Startbild-Cream mit gleichem Ziel über der Kopf-Unterkante liegt. Der Platz bleibt reserviert, nichts verschiebt sich. Ausgeblendet gilt `visibility: hidden` und `inert` | 220 ms ein, 165 ms aus | bleibt |
| Zielwechsel (nur Zustand A) | Erreicht die Oberkante der Namensleiste den Kopf, Text aus (100 ms), dann Text und `href` auf `#frage`, Text ein (120 ms); kein Überblenden zweier Texte (SG 10.10 Nr. 14). Oberhalb der Namensleiste wieder „Pakete ansehen“; der Zustand folgt der Lage, nicht dem Verlauf | 100 + 120 ms | bleibt |
| Ausblenden am Ziel | Zustand A: solange der Abschnitt 05 mindestens 120 px über dem unteren Rand steht. Zustand B: solange die Kartenreihe im Bild ist (N4) | 165 ms | bleibt |
| Anfrage gesendet | Nach dem Dank zeigt der Ring für den Rest des Seitenaufrufs wieder „Pakete ansehen“ (Ereignis aus `verkauf.js`) | wie Zielwechsel | bleibt |
| Hauseigentümer Cream ↔ Ring | Füllung und Kontur wechseln, sobald eine Cream im Inhalt ins Bild kommt oder es verlässt (Logik `kopfCta`). Auf Ratgebern der Stufe „Prüfen“ immer Ring [H], passend zum leisen Handlungsbaustein (EA 4.3.4/7) | 150 ms | bleibt |
| Hover (nur `hover: hover`) | Ring: Kontur `--line2` → `--muted`; Cream → `--primary-hover`; Links `--text2` → `--text`; Logo leuchtet einmal | 150 ms | Logo ruhig |
| Drücken | keine Skalierung (DNA-B B.3.7), Deckkraft 0,86 sofort | – | gleich |
| Fokus | Kontur 2 px `--text` mit 2 px Abstand, nie unter dem Kopf verdeckt | sofort | gleich |
| Klick Ring, Sprungmarke | Sofortiger Sprung (`behavior: 'auto'`), danach Fokus auf die Ziel-Überschrift (`tabindex="-1"`). Weiches Scrollen über 4–6 Bildschirme zöge Leiste, Lichtraum und Explosionsansicht nacheinander durch ihre scrollgekoppelten Bewegungen, also mehrere bewegte Träger | – | gleich |
| Ring in Zustand A | führt zu `#frage` ohne Paketwahl; das Formular behält die getippte Wahl oder „Noch offen“ (E-3) | – | – |
| Menü | öffnet `rh-02-menue` (Blatt, 220/165 ms Deckkraft); `aria-expanded`; während es offen ist, ist der Kopf `inert` unter dem Scrim; das Zeichen verformt sich nicht | 8.2.3 | nur Deckkraft |
| Scrollen | Kopf klebt (`position: sticky; top: 0`) und springt nie; keine scrollgekoppelte Veränderung außer den genannten Schwellen | – | – |

**Hysterese [V]:** Jede Schwelle schaltet erst, wenn sie um 24 px überschritten ist. Umgesetzt wird das mit zwei
IntersectionObserver-Rändern (Kopfhöhe und Kopfhöhe + 24 px), ohne Scroll-Handler.
**Ohne JavaScript:** Der Kopf ist opak (`<noscript><style>` setzt die Deckfläche, erlaubt durch `style-src 'unsafe-inline'`,
`functions/seo.js:69`). Der Ring ist sichtbar und führt zu `#pakete`. Der Knopf für Hauseigentümer steht als Ring da, so bleibt es auch ohne
Messung bei einer Cream je Bildschirm. „Menü“ ist ein Link auf `#navigation`.

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Komposition wie in C. Phasen auf der Seite für Fensterbauer: y 0 – ≈ 260 flächenlos mit Logo und Menü über
dem Foto; ab ≈ 260 px Scrollweg opak; ab ≈ 537 px (Unterkante der Cream bei 593 − 56) erscheint der Ring „Pakete ansehen“. Ab der
Namensleiste (Bildschirm 5) heißt er „Paket anfragen“ (Zustand A). Während 05 im Bild ist, ist er weg, danach erscheint er wieder als
„Paket anfragen“. Der Knopf steht oben rechts und damit außerhalb der bequemen Daumenzone. Das ist bewusst so: Die Hauptaktionen liegen im
Inhalt im Daumenbereich, der Kopf ist nur der Schnellweg (W9). **390 × 664:** gleiche Werte, der Kopf belegt 8,4 %.

| Breite | Ring Fensterbauer | Knopf Hauseigentümer |
|---|---|---|
| ≥ 390 | „Pakete ansehen“ / „Paket anfragen“, 15 px, 150 px fest | „Fenster ausmessen“ / „Aufmaß fortsetzen“, Polster 14, 172 px fest |
| 360–389 | gleiche Texte, Polster 12, 141 px fest | „Ausmessen“, 115 px |
| 320–359 | „Pakete“ / „Anfragen“, 15 px, 93 px fest | „Ausmessen“ 13 px, 99 px |

Die Mindestlücke zwischen Logo und Knopf beträgt in jeder Stufe 12 px. Bis 320 px gibt es kein Querscrollen (SG 10.10). **640–1023
(Tablet):** Telefonkomposition, Rand 24 px.

**Schreibtisch 1280.** Zeile nach C, 64 px. Es gibt kein Menü, alle übrigen Wege stehen im Fuß. Über V1 liegen Sprungmarken und „Anmelden“
im Scrim über dem oberen Bildrand des Fotos (Foto ab x ≈ 553). Prüfpunkt: Die Zone y 0–96 des Schreibtisch-Zuschnitts ist ruhig, und die
Links erreichen dort 4,5 : 1.
**Schreibtisch 1024.** Rand 32 px, Spalte x 32–992. Eigene Seite: Logo 32–162, Sprungmarken 401–711, „Anmelden“ 735–834, Ring 842–992. Auf
`/` (Umschalter 186–457) entfällt unter 1200 px die Sprungmarke „So funktioniert es“. Die Seite führt beim Scrollen ohnehin dorthin, und
sonst bliebe zwischen Umschalter und Navigation keine Lücke von 24 px.

## H. Technische Umsetzung

**Bestehend (Datei):** `Logo`, `Marke` (`web/assets/gemeinsam.js`); `.btn`, `.btn.small`, `.btn.ghost`, `.btn.primary`
(`web/assets/gemeinsam.css:56-62`); `kopfCta()` und `render()` mit `.top` (`web/assets/portal.js:445-450`, `:551-562`); Sprung-Handler der
Einbettung (`portal.js:835-843`); `Verkauf.auf` (`web/assets/verkauf.js`). Heute sind die Köpfe von Hand geschrieben: `.rg-kopf`
(Ratgeber, Seite für Fensterbauer), `.kopf` (Recht, 404, Paketbedingungen), `.top` (Portal).

**Neu**

1. `web/assets/kopf.js`, nach dem Muster von `pakete.js` (Browser `window.Kopf`, Server `globalThis.Kopf`, Import wie
   `functions/pakete-seite.js:19`): `Kopf.html(kontext, { seite, ansicht })` liefert das Markup aus einer Quelle. `Kopf.auf(kopf, { inhalt })`
   bindet das Verhalten. Es ist idempotent, trennt alte Beobachter wie `kopfCta()` und funktioniert nach jedem Neuaufbau der Einbettung.
2. `scripts/ratgeber-bausteine.mjs` schreibt den Kopf aller statischen Seiten zwischen `<!--kopf-->`-Marken. `portal.js` ruft für `.top`
   dieselbe Funktion auf (`class="top kopf"`). Prüfsuite Abschnitt 10: jede Seite gleich dem Generator.
3. Markup: `<header class="kopf" data-kontext="fensterbauer|hauseigentuemer|neutral" data-flaeche="buehne|inhalt">` mit
   `a.kopf-sprung`, `a.kopf-marke`, `nav.kopf-nav[aria-label="Hauptnavigation"]`, `a.kopf-knopf.btn.small` (Klasse `primary` bleibt beim
   Knopf für Hauseigentümer, der Ring-Zustand liegt in `data-rang="ring"`, damit `scripts/pruefen.mjs:169` weiter greift) und
   `a.kopf-menue[href="#navigation"]`; `Kopf.auf` setzt `aria-expanded` und `aria-controls`.
4. Schwellen als Datenattribute der Nachbarabschnitte: `data-kopf-buehne-ende` (fb-01, H1), `data-kopf-start` (Cream des Startbilds),
   `data-kopf-wechsel` (Namensleiste, fb-06), `data-kopf-ziel` (05 in A, Kartenreihe in B). Der Zustand kommt aus `functions/pakete-seite.js`
   als `data-zustand="a|b"` an `[data-vk-pakete]` (dort ist `v.bestellen` bekannt, Zeile 113). Ereignis `vk:gesendet` aus `verkauf.js`.
5. Der Sprung-Handler wird zusätzlich an `.top` gebunden, sonst greift der Ring auf `/` nicht. Für Sprünge aus dem Kopf gilt
   `behavior: 'auto'`.
6. „Aufmaß fortsetzen“ auf statischen Seiten: Die Prüfung `eigenesAufmass()` wandert nach `gemeinsam.js`. Ohne sie bleibt „Fenster
   ausmessen“.

**CSS:** Block `.kopf` in `gemeinsam.css`: Flex-Zeile, `position: sticky`, Deckfläche und Scrim als `::before`/`::after` (nur
`opacity`), Zustände über Datenattribute, Medienabfragen 360/390/640/1024/1200. `button`-Elemente bekommen ausdrücklich `font-size: 15px`
(sonst 13,33 px, Prüfsuite). Rückbau: `backdrop-filter` in `.rg-kopf`/`.top` und der Lesefortschritt (`verkauf.js:448-465`,
`verkauf.css:614`).

**Assets:** keine neuen. Das Zeichen ist vorhanden (`scripts/logo-setzen.py`), das Menüzeichen ist Inline-SVG (18 × 12, `aria-hidden`).
Beim Inhaber ist nichts anzufragen.
**Leistung:** nur IntersectionObserver, kein Scroll-Handler. Ohne `backdrop-filter` kostet das Mitzeichnen auf schwachen Android-Geräten
weniger. Reservierter Knopfplatz, daher kein Layoutsprung (CLS 0). Der Kopf ist nie LCP.
**Barrierefreiheit:** Landmarke `header`, `nav` mit Namen; „Zum Inhalt“; Ziele ≥ 44 × 44; Fokus 2 px, 3 : 1; `scroll-padding-top`;
ausgeblendeter Knopf ist `inert`; Textwechsel ohne Live-Region; zugänglicher Name gleich sichtbarem Text; Kontrast der Wortmarke und des
Menüzeichens über dem Foto mindestens 4,5 : 1 bzw. 3 : 1 an der hellsten Stelle von y 0–56 messen, sonst Scrim oben auf 75 % (Rückfall:
Foto ab y = 56, DG-E-11).

**Abweichungen.** Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**:

| Bestehend | Neu | Begründung |
|---|---|---|
| Kopf „halbtransparent wie die App“, „kleiner schwarzer Knopf“ (GEST:428) | flächenlos auf Bühnen, sonst opak; Ring oder Cream | DG-AB-10; SG 10.3/6 |
| Logo leuchtet beim Laden einmal (GEST:7) | auf Seiten mit Ladeauftritt (V1, H1) nur bei Berührung | ein bewegter Träger je Ansicht (E-2; SG 10.7/4) |
| Kopfknopf „Fenster ausmessen“/„Aufmaß fortsetzen“ (GEST:192) | unter 390 px „Ausmessen“ | Platz; Vorbild „Starten“ (`portal.js:450`). Rückfall: volle Texte ab 375 px mit Polster 12 |
| Kopf Fensterbauer „Preise“, „Anmelden“, „Kostenlos starten“ (GEST:193) | Ring, „Anmelden“ als Textlink | EA AB-2 |
| Umschalter als Zeile der klebenden Kopfzeile (GEST:190; `pruefen.mjs:211-213`) | Glas im Foto, Kopf 56 px | IA-AB-3; Prüfsuite anpassen (IA-O-9) |

## I. Conversion-Begründung

- **Position:** Oben links und rechts sind die erwarteten Orte für Marke und Schnellweg (RE E2, R6). Weil der Kopf klebt, sind die Pakete
  von jedem der rund 12 Bildschirme einen Tipp entfernt, ohne zweite Leiste (W9).
- **Gestaltung:** Der Ring rangiert immer unter der Cream im Inhalt und lenkt nicht von empfohlener Karte, „Frage senden“ oder Abschluss
  ab. Er fängt Prüfer (FB-6) und Rückkehrer ab, die nicht linear lesen. Der Zielwechsel verhindert, dass er auf die Stelle zeigt, an der
  der Besucher schon ist (Festlegung 8).
- **Informationsmenge:** Am Telefon höchstens drei Elemente mit zwei Wörtern Text; alles Weitere steht im Menü.
- **Beitrag zur Zielhandlung:** Z1a für FB-2 und FB-6: Kopf-Ring → 04 → Kartenknopf bzw. „Paket anfragen“ → 05. Z2a: ein Tipp aus jedem
  Ratgeber in die App.
- **Zu testende Annahmen (Hypothesen, keine Wirkungsaussage):**
  - **H-K1:** Ein erst nach dem Startbild erscheinender Ring wird als Schnellweg verstanden (IA-H-12, N4). Prüfung: Gespräche, Telefon-Video.
    Rückfall: Ring von Anfang an sichtbar.
  - **H-K2:** Der Wechsel an der Namensleiste wird bemerkt und nicht als Sprung empfunden. Prüfung: anonyme Zählung der Ring-Tipps je
    Zustand, nur in der eigenen Statistik (7.5.7 Nr. 17). Rückfall: Wechsel erst nach der Kartenreihe (EV 7.5.2).
  - **H-K3:** Ein Ring oben rechts genügt am Telefon ohne untere Leiste (W9). Rückfall: Testvariante B′.
  - **H-K4:** Das Logo → `/fuer-fensterbauer/` hält Fensterbauer im Pfad (IA-H-5). Rückfall: Logo → `/`.
  - **H-K5:** Der opake Kopf wirkt ruhiger als der halbtransparente (DG-H-10). Prüfung: Sichtprüfung des Inhabers.
  - **H-K6:** „Ausmessen“ wird auf schmalen Telefonen verstanden. Rückfall: volle Texte mit kleinerem Polster.

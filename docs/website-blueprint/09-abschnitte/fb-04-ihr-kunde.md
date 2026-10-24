# 02 Ihr Kunde (#so-funktioniert-es)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 4 von 15 (Kapitel 02, nach `fb-03-ihr-name`, vor `fb-05-ihr-postfach`) · Intensitätsstufe: 3 gestaltet (Typ T4 Produktdemonstration)

Phase I, Stand 24.10.2026, Planungsdokument (nichts gebaut). Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md); VK =
`web/fuer-fensterbauer/index.html`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Festlegung I** = Entscheidung dieser
Spezifikation, wo 08 offen ist oder anders lautet (mit Begründung).

---

## A. Abschnitt und Funktion

- **Name:** Kapitel 02 „Ihr Kunde“; h2 mit Pflichtanker `#so-funktioniert-es` (`scripts/pruefen-instanzen/29.mjs:112`).
- **Position:** vierter Abschnitt; Telefon ≈ 2,10–3,04 BH, bei 664 px Bildschirm 3–4. Davor 01 „Ihr Name“ (dasselbe Gerät 300 × 420 ganz,
  Stufe 2, ohne Licht), danach 03 „Ihr Postfach“ (Aufmaßblatt, Stufe 3). Rhythmus 2 · 3 · 3 · 2 (DG 2.3.17/6).
- **Ziel (EA S3 „Sehen“):** selbst bedienen, was der Kunde erlebt: zwei Wahlgruppen ändern das gerenderte Fenster im oben angeschnittenen
  Gerät im Lichtraum. Kein Senden ([V] E-7), kein „Weiter“, keine Schrittanzeige.
- **Nutzerfrage:** „Wie sieht das für meinen Kunden aus, und taugt das?“ – F-34 „Kommen meine Kunden damit zurecht, auch am Handy?“ (teilweise;
  keine Daten zur Bedienbarkeit, EA:635), F-10 „Sehen meine Kunden Preise, Werbung oder andere Betriebe?“ (VK:240, PB:84 § 10 (1)).
- **Vorbereitete Entscheidung:** „gut genug für meine Kunden“ → weiter zu 03 (was ankommt), dann Pakete.
- **Grenze [V]:** Die Probe legt nicht nahe, der Betrieb könne das Sortiment einschränken (nicht gebaut: F-14, O-17, BAUPLAN:717).

## B. Konkreter Inhalt

**Bestehende Informationen**

| Inhalt | Fundstelle |
|---|---|
| h2 „So funktioniert es“ (Pflicht-h2) | VK:85; `29.mjs:112` |
| „Er sieht keine Preise, keine Werbung und keine anderen Betriebe.“ | VK:240; PB:84 § 10 (1) |
| Kunde plant im Browser ohne Konto: Fotos, Maße, Wünsche am 3-D-Modell | VK:89 |
| Fenster, Balkontür, Hebe-Schiebe-Tür | `README.md:3`; `web/assets/modell.js:111` |
| Raffstore | `web/assets/app.js:1368`; `README.md:3` |
| „Weiß ich noch nicht“, Offenes in der Klärungsliste | `web/index.html:60`; VK:130 |
| offener Sonnenschutz wird im Modell nicht gezeichnet | `web/assets/app.js:1095` (`sonneAktiv`), :701 |
| Sonnenschutz fährt 1,8 s, Lamellen je 12 ms versetzt | `web/assets/buehne.js:14`; GEST:64 |

**Texte** (sichtbar ≈ 47 Wörter)

| Ort | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „02 · IHR KUNDE“ | Textentwurf (EV 7.5.2) |
| h2 | „So **funktioniert** es“, grün „funktioniert“ | wörtlich VK:85; grünes Wort Festlegung I: genau die Behauptung, die der Abschnitt belegt |
| Lead | „**Zwei Griffe** wie bei Ihrem Kunden. **Fotos und Maße** kommen dort dazu.“ | Textentwurf (08) |
| Beschriftungen | „ELEMENT“, „SONNENSCHUTZ“ | Textentwurf (08) |
| Wahlzeilen | „Fenster“, „Balkontür“, „Hebe-Schiebe-Tür“ · „Ohne“, „Raffstore“, „Weiß ich noch nicht“ | Bestand |
| Unterzeile an „Weiß ich noch nicht“ | „für die Klärungsliste“ | Textentwurf (VK:130), Festlegung I |
| im Gerätebildschirm | „BEISPIEL“ | G7 |
| Schlusszeile | „Ihr Kunde sieht nur Ihren Betrieb: keine Preise, keine Werbung, keine anderen Betriebe.“ | gekürzt VK:240 (08) |
| Ansage (nur Vorlesen) | „Vorschau: Balkontür mit Raffstore.“ · „Vorschau: Fenster. Sonnenschutz offen, steht beim Betrieb auf der Klärungsliste.“ | Textentwurf |
| ohne JavaScript | „Fenster, ohne Sonnenschutz · Beispiel“ · „Dasselbe Fenster mit Raffstore“ | Textentwurf |

**Interaktion:** zwei Gruppen à drei Knöpfe mit `aria-pressed`; ein Tipp ändert sofort das Bild. Voreinstellung „Fenster“ und „Weiß ich
noch nicht“ (Festlegung I: In der App bleibt eine Frage ohne Wahl offen, `app.js:701`; 03 zeigt so auch ohne Bedienung „mit dem Kunden zu
klären“). Die Wahl geht an die Karte „Aus Ihrer Probe“ in 03.

**Vorhandene Komponenten:** Gerätekörper `.vk-telefon` (`web/assets/verkauf.css:346-347`, ohne den Schatten aus :559), `Verkauf.auf`
(`verkauf.js:513-519`), `beobachten()` (:110), `ruhig()` (:15), Haarlinie und Kapitelzeile (GEST:450), Tokens (`gemeinsam.css:9-32`).
**Entfallen:** `.vk-buehne`, `.vk-schritte` (VK:84-119), `schrittSetzen`/`schrittRechnen`/`buehne()` (`verkauf.js:115-150`), die
Lottie-Zeichen dieses Abschnitts, Flieger, Puls, Konfetti (GEST:448). Die fünf heutigen Schritte verteilen sich nach 08 8.4.1 Nr. 5.

## C. Exakte Layoutkomposition

**Grundstruktur:** Achse nur für das mittige Gerät (G5); Kopf, Gruppen und Schlusszeile an der Ordnungslinie x = 16; darunter ein
zweispaltiger Bedienblock, dessen Mittelkante die einzige eingerückte Zweitlinie ist (SG 10.1/1). Oben asymmetrisch, unten symmetrisch.

**Telefon 390 × 844** – 4 Spalten à 77,5 px, Rand 16, Spaltenabstand 16; y ab der Haarlinie.

| Element | x | y | Maß |
|---|---|---|---|
| Haarlinie 1 px `--line` | 16–374 | 0 | 4 Sp. |
| Kapitelzeile 13 px | 16 | 17–33 | – |
| h2 32 px, eine Zeile (gemessen 224,5 px breit) | 16 | 45–79 | – |
| Lead 17 px, zwei Zeilen | 16–374 | 91–144 | 4 Sp. |
| Gerät 300 × 420, sichtbar die unteren 240 px | 45–345 | 168–408 | ≈ 3,5 Sp., Achse |
| Lichtfleck, Ellipse 360 × 192 | 15–375 | 288–480 | Zentrum (195, 384) |
| Beschriftungen 13 px | 16 / 203 | 432–448 | je 2 Sp. |
| Wahlzeilen 171 × 52, Abstand 8 | 16–187 / 203–374 | 456–628 | je 2 Sp. |
| Schlusszeile 15 px, zwei Zeilen | 16–374 | 652–696 | 4 Sp. |
| Abstand zu 03 | – | 696–792 | 96 (G6) |

**Größenhierarchie [V]:** Gerät 240 px = 16 × Bedienschrift (≥ 3×, SG 10.1/4); h2 32; Lead 17; Klein-UI 15 und 13 (Spreizung 1,15 ≤ 1,25, SG
10.1 Tabelle) – drei Stufen. **Flächen (Überschlag):** Bild ≈ 36 % (Gerät 26 %, sichtbares Licht ≈ 10 %), Bedienung und Text ≈ 24 %,
frei ≈ 40 % (Untergrenze Stufe 3; am Bildschirmfoto prüfen). **Ebenen:** Hintergrund Z 0 (Grund `#161616`, Lichtfleck) → Mittelgrund Z 20
(Gerät mit Render und Bildfolge) → Vordergrund Z 30 (Bedienschicht, nie auf dem Gerät, SG 10.1/5) → Seitenkopf Z 40. Verdeckungen: Der
Körper verdeckt die obere Hälfte des Lichts, die Maske das obere Gerät (Anschnitt als Verankerung, B.3.2). **Arbeitslage:** Gerät und beide
Gruppen umfassen 460 px (y 168–628) und stehen auch bei 390 × 664 (608 px unter dem Kopf) zusammen im Bild, die Gruppen im Daumenbereich;
bei 844 schneidet 03 dann ≈ 90 px an (11 %, DG 2.3.17/2).

**Schreibtisch 1280 × 800** – 12 Spalten à 64,7 px, Abstand 24, Spalte x 120–1160, Split 5 : 7.

| Element | x | y | Maß |
|---|---|---|---|
| Haarlinie | 120–1160 | 0 | 12 Sp. |
| Kapitelzeile, h2 40 px (eine Zeile), Lead | 120–539 | 17–152 | Sp. 1–5 |
| Gruppen, Zeilen 197,5 × 52 | 120–317 / 342–539 | 176–372 | je 2,5 Sp. |
| Schlusszeile | 120–539 | 396–440 | Sp. 1–5 |
| Gerät 320 × 448, sichtbar unten 320 | 702–1022 | 52–372 | Achse Sp. 6–12 |
| Lichtfleck 384 × 256 | 670–1054 | 218–474 | Zentrum (862, 346) |

Geräteunterkante und letzte Wahlzeile fluchten auf y 372: Bedienung und Gegenstand stehen auf einer Bodenlinie. Abschnitt ≈ 440 px hoch,
kein Anheften (E-8); Gerät nur 7 % größer als am Telefon (SKILL:28).

**Weitere Startwerte:** Maske oben `mask-image` 48 px (1280: 56) statt harter Kante · Licht drei Stopps: Cream 12 %, 5 % bei 45 %, 0 % (≤ 12 %,
08; SG 10.4/5) · Lichtfleck = 1,2 × Gerätebreite (SG 10.4: 1–1,5 ×) · Zeile `min-height` 52, Pille, Innenabstand 12, Text 15/600 · Innenabstände
16 · 12 · 12 · 24 · 24 · 8 · 24 (1 : 3 : 6, G6) · Abschnittsabstand 96 / 128.

**Abweichungen von 08 (Festlegung I):**

1. **Gruppen nebeneinander** statt untereinander à 358 × 52. Untereinander reichen Gerät und zweite Gruppe 680 px weit; bei 664 px Höhe
   fehlt beim Tipp auf „Raffstore“ ein Drittel des Geräts, die Antwort geschieht außerhalb des Blicks (SKILL:86). Gemessen: „Weiß ich noch
   nicht“ ist bei 15/600 127 px breit, verfügbar 147 px (bei 360 px Breite 132). Rückfall: untereinander (G).
2. **Lichtzentrum 24 px über der Geräteunterkante** statt 30–40 % der Gerätehöhe darunter: SG 10.4/5 [Pflicht] verlangt das
   Helligkeitszentrum hinter dem Fokusträger, und `--muted` (13 px) hätte im Kern nur ≈ 4,2 : 1. Sichtbar bleibt das Licht unter und vor dem
   Gerät, wie X6 es wollte.

## D. Anwendung der Design-DNA

Budget Stufe 3: eine inszenierende Signature = Lichtraum (zweiter und letzter Lichtort der Seite, DG Dosierregel 3); informierend 0 von ≤ 1.

| Eigenschaft | Ausgestaltung | Intensität | Beitrag |
|---|---|---|---|
| Tiefe | drei Ebenen plus Kopf; Gerät verdeckt Licht; Anschnitt oben | D1 2 | Gerät steht im Raum, nicht auf einer Karte |
| Material | nur im Render: Putz, Profil, Glas, Alu-Lamellen; Körper matt `--ground`, 1-px-Ring `--line2`; kein Glas, kein Eigenmaterial an Knöpfen (Nr. 9) | D2 3 im Bild | echtes Produkt als Beweis (SKILL:41) |
| Licht, Schatten | Quelle Bildschirm; Lichtfleck Cream vorn und unten; rundum 1-px-Lichtkante `--kante-alpha` .14; kein Schatten (Nr. 6); Lichtwert je Bild (F) | D3 2 | Licht antwortet auf die Wahl |
| Formen | Zeilen `--pill`; Gerät Radius 40, Bildschirm 32 als Teil des Motivs | D5 2 | ein Formsystem |
| 3-D-Objekte | vorgerenderte Standbilder und Bildfolge aus `buehne.js`, Voreinstellung „Vitrine“ (EV X6); kein Echtzeit-3-D, getippte Wahl ist keine stetige Steuerung (SG 10.8/9) | D7 2 im Bild | Realismus der Lamellen (SKILL:122) |
| Bildintegration | Render als Bildschirminhalt, Gerät frei auf dem Grund (Nr. 4) | – | ein Raum |
| Oberflächendetails | Lichtkante, Haarlinie, „BEISPIEL“ 13 px oben links im Bildschirm, 12 px unter dem Maskenende | D12 1 | ehrlich (G7) |
| Animation | Überblendung, Raffstore-Fahrt, Licht folgt (F) | D8 2 | nur als Antwort (SKILL:45) |
| Typografie | Bühnenstimme 32/800, −0,03 em, 1,05; Technikstimme 13/600 Versalien 0,12 em, grün nur die Kapitelzeile; Lesetext 17/500 `--text2`, Schlüsselwörter `--text`; Zeilen 15/600 | D18 0 | zwei Stimmen, drei Stufen |
| Überlagerungen | nur Gerät über Licht, nichts auf dem Gerät | – | Anker frei |
| Perspektive | Gerät frontal 0°; im Render Kamera frontal auf die Elementmitte, lange Brennweite, Licht von oben (`--licht-y` 1) | D15 0 | Bilder vergleichbar |
| Interaktive Effekte | Knopf → Bild und Licht; Gerät ohne Trefferfläche (KD [V] 6) | D10 1 | Ursache und Wirkung getrennt |

**Bildfeld im Render:** Element samt Kasten im Rechteck x 10–90 %, y 42–94 % des Bilds, proportional, unten bündig – am Telefon liegen die
oberen 39,8 % des Bilds verdeckt oder in der Maske. Farben wie die Voreinstellung der App; eine Farbe als dritter Griff entfällt (H-E1).

**Bewusst weggelassen:** Glas, Messraster, Maßlinie, Explosion (03), Schritt- und Kapitelanzeige, Lottie, Flieger, Konfetti, Puls,
Parallaxe, Scrollkopplung, Anheften, Bodenschatten, Staub, Echtzeit-3-D, Selbstvorführung, „Setzen um 8 px“ (KD; höchstens zwei Reaktionen je
Tipp), Cream. Die Ausdruckslast liegt bei der Reaktion des Produkts (RE E3).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:**

| bestehende Regel | hier | Begründung | geführt als |
|---|---|---|---|
| scrollgebundene Telefon-Bühne, fünf Schritte, Lottie, Flieger, Konfetti (GEST:448) | Probe mit zwei Griffen, ≈ 0,9 BH | heute 3,3 BH für fünf Sätze (PA 1.8); SKILL:45 | EA AB-10; 08 8.4.1 Nr. 5 |
| feste Bühne am Telefon bis zwei BH (DR 3.5) | kein Anheften | SG 10.7 Mobil | DG-AB-13 |
| Geräte-Bühne mit Bodenschatten (DR 4 Nr. 8, 3.1; `verkauf.css:559`) | Lichtkante und Lichtfleck | DNA Nr. 6 | DG-AB-1 |
| Auftritt 24 px aufwärts, 0,98 → 1 (GEST:448) | Bedienschicht ohne Auftritt | SG 10.7/1–2 | DG-AB-2 |
| „Licht atmet in 6 bis 10 s“ (DR 3.5) | Licht ändert sich nur auf Eingabe | autonome Bewegung ≤ 5 s | DG-AB-5 |

Keine Abweichung von GEST:455: `button` ist keine Eingabe; `scripts/pruefen.mjs:1789-1797` sucht nur `form`, `input`, `select`, `textarea`.

## E. Visual Attention Architecture

Erwartete, **nicht gemessene** Aufmerksamkeit:

1. Beim Hereinscrollen grüne Kapitelzeile und h2 an der Ordnungslinie, dann der Lead.
2. **Primär:** das Fensterglas im unteren Drittel des Gerätebildschirms – hellster Wert der Ansicht (Spitzlichter im Render); der
   Lichtfleck erreicht höchstens `#303030`. Gerät und Licht bilden das einzige Helligkeitszentrum.
3. **Sekundär:** die zwei gewählten Zeilen, Füllung `--muted` (5,8 : 1 gegen den Grund); die vier übrigen nur Kontur `--line2` (1,6 : 1) mit
   Text `--text2`. Die Füllung zeigt den Zustand und lädt zum Umschalten ein.
4. Unterzeile „für die Klärungsliste“, Schlusszeile.

**Handlungsaufruf:** bewusst keiner, keine Cream im Bild; einziger dauerhafter Handlungsträger ist der Kopf-Ring „Pakete ansehen“ (8.2.2),
einen Tipp entfernt (KD [V] 4). **Ablenkungen:** sechs gleichartige Ziele (beruhigt über Kontur statt Fläche); Licht heller als der Render
(gedeckelt bei 12 %); Maske, die wie ein Ladefehler wirkt (darum 48 statt 12 px lang). **Übergang:** Das Licht endet hier, kein weiterer
Lichtraum; die Wahl kehrt in 03 als Karte „Aus Ihrer Probe“ wieder – die Probe wird zur Anfrage im Postfach, ohne Senden.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|
| Scrollen | nichts scrollgekoppelt; einmalig, wenn das Gerät ≥ 50 % sichtbar ist und beim Aufruf unterhalb lag: Licht geht an (`opacity` 0 → Lichtwert, IntersectionObserver) | 900 ms `--e-out` | Licht steht |
| andere Elementart | Zeile wechselt Zustand; Bild blendet über, sobald dekodiert (zwei gestapelte `img`, `decode()`); Licht folgt 50 ms später | 150 ms `--t1`; 500 ms `--e-io` | 120 ms oder Schnitt, Licht sofort |
| „Raffstore“ aus „Ohne“/„Weiß ich noch nicht“ | Bildfolge fährt einmal herunter (30 Bilder, Canvas, `requestAnimationFrame`, Zeitachse linear – die Kurve steckt in den Bildern); Licht sinkt 50 ms später mit; am Ende ersetzt das Standbild die Leinwand | 1,2 s | 120 ms auf das Endbild |
| zurück aus „Raffstore“ | Bildfolge rückwärts (Hochfahren) | 1,2 s | wie oben |
| „Ohne“ ↔ „Weiß ich noch nicht“ | kein Bildwechsel (ehrlich: offener Sonnenschutz wird nicht gezeichnet, `app.js:1095`); Zeile und Ansage antworten | 150 ms | gleich |
| Elementart bei Raffstore | Überblendung der Raffstore-Standbilder | 500 ms | 120 ms |
| Tipp während der Fahrt | Fahrt hält, Überblendung zum neuen Ziel; der letzte Tipp gilt | 220 ms `--t2` | Schnitt |
| Abschnitt verlässt das Bild | Sprung ins Endbild, Schleife stoppt | – | – |
| Hover (`hover: hover`) | Kontur `--line2` → `--muted`, Hand-Zeiger | 150 ms | gleich |
| Drücken / Fokus | Füllung `--surface2`, keine Skalierung (SG 10.7/3) / Kontur 2 px `--text`, Abstand 2, `:focus-visible` | sofort | gleich |

**Lichtwert je Bild:** mittlere Helligkeit des Standbilds, linear auf 6–12 % abgebildet, beim Erzeugen per Skript berechnet, als `data-licht`
hinterlegt (mehr Glas = mehr Licht, Lamellen = weniger); umgesetzt als `opacity` der Lichtebene (Wert ÷ 12). Startwerte für Platzhalter:
Fenster 10, Balkontür 11, Hebe-Schiebe-Tür 12 %, mit Raffstore je −4.

**Begründung:** 500 ms ist das untere Ende für Szenenwechsel im Motiv (DG 2.4.1), weil es eine Antwort auf einen Tipp ist. 1,2 s kürzt die
echte Fahrt (1,8 s, `buehne.js:14`) wie in 08 und behält den Versatz von 12 ms als Masse. 50 ms Nachlauf ist die Nebenbewegung nach DR 3.5.
Höchstens zwei Reaktionen je Tipp (Bild, Licht). Richtung: Raffstore oben → unten und zurück; Überblendung und Licht ohne Richtung. Die
Bedienschicht bewegt sich nie (G1), hat keinen Auftritt und ist von `Reveal` ausgenommen – sofort bedienbar.

**Ohne JavaScript:** Gerät mit „Fenster, ohne Sonnenschutz · Beispiel“; an Stelle der Gruppen eine zweite Abbildung 171 × 138 (Radius 18,
2-px-Ring) „Dasselbe Fenster mit Raffstore“ – zwei Standbilder mit je einer Zeile (08); Gruppen `hidden`. **Rückfall der Bildfolge:**
Überblendung 500 ms bei fehlender Bildfolge, `Save-Data` oder Median-Bildzeit über 25 ms. **Auslegung zu bestätigen:** Bildfolge auf Tippen
= Antwort, keine zweite inszenierende Signature (08); sonst immer Überblendung.

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigenständig):** Komposition nach C, Folge Kopf → Held → Bedienblock → Schlusszeile; Gerät und beide Gruppen
stehen in 460 px bei 844 und 664 zusammen im Bild, bedient mit dem Daumen in der unteren Hälfte. Bei 360 px Breite Spalten à 156 px, alles
einzeilig. Ist der Bedienblock schmaler als `20em` (Inhalt unter 320 px, also Bildschirm unter ≈ 352 px, und bei 200 % Text), untereinander wie 08
(358 × 52, Abstand 8); dann darf das Gerät beim Tippen oben herauslaufen (Reflow vor Effekt, G9). Zeilen wachsen mit dem Text, kein
Querscrollen. **640–1023 px:** wie Telefon, Spalte höchstens 560 px, mittig.

**Schreibtisch 1280:** Split 5 : 7 nach C; alles in einem 800-px-Bildschirm, 03 schneidet in der Arbeitslage ≈ 168 px an (21 %); h2 40,
nichts angeheftet. **1024:** Spalte x 48–976; links 5 Spalten (x 48–421), Gruppen à 178 px; Gerät 300 × 420, sichtbar 300, Mitte x 710,
y 72–372; Lichtfleck 360 × 240, Zentrum (710, 348).

## H. Technische Umsetzung

**Bestehend:** Gerätekörper aus `verkauf.css:346-347`, mit 01 geteilt als `.vk-geraet`; `Verkauf.auf`/`bewegung()`, `beobachten()`,
`ruhig()` aus `verkauf.js`; Tokens `--t1`, `--t2`, `--e-out`, `--e-io`, `--pill`, `--line2`, `--muted`, `--surface2` (keine neuen).
**Neu:** HTML in VK an Stelle von Zeile 84–119, Block `.vk-probe*` in `verkauf.css`, Funktion `probe(wurzel, still)` in `verkauf.js` an
Stelle von `buehne()`. Kein `input`. Die h2 trägt nur `id`, weil `29.mjs:112` genau `<h2 id="so-funktioniert-es">` sucht.

```html
<section class="vk-teil vk-probe" data-probe>
  <p class="vk-kapitel">02 · Ihr Kunde</p>
  <h2 id="so-funktioniert-es">So <span class="ak">funktioniert</span> es</h2>
  <p class="vk-lead">…</p>
  <figure class="vk-probe-buehne">
    <div class="vk-probe-licht" aria-hidden="true"></div>
    <div class="vk-probe-ausschnitt"><div class="vk-geraet">
      <img class="vk-probe-bild" src="/bilder/probe/fenster-ohne.webp" width="600" height="640" alt="…" decoding="async" loading="lazy">
      <canvas class="vk-probe-folge" aria-hidden="true" hidden></canvas></div></div>
    <figcaption class="vk-probe-ohnejs">Fenster, ohne Sonnenschutz · Beispiel</figcaption>
  </figure>
  <div class="vk-probe-gruppen" hidden>
    <div role="group" aria-labelledby="probe-element"><p id="probe-element">Element</p>
      <button type="button" aria-pressed="true" data-element="fenster">Fenster</button> …</div>
    <div role="group" aria-labelledby="probe-sonne"><p id="probe-sonne">Sonnenschutz</p> …
      <button type="button" aria-pressed="true" data-sonne="offen">Weiß ich noch nicht<small>für die Klärungsliste</small></button></div>
  </div>
  <figure class="vk-probe-ohnejs">…mit Raffstore…</figure>
  <p class="vk-probe-status sr-only" role="status"></p>
  <p class="vk-probe-zeile">Ihr Kunde sieht nur Ihren Betrieb: …</p>
</section>
```

**CSS:** Bedienblock `display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px` (Schreibtisch 24); jede Gruppe `grid-row: span 4;
grid-template-rows: subgrid; row-gap: 8px` (gleich hohe Zeilen über beide Gruppen); `container-type: inline-size`, `@container (inline-size <
20em)` → eine Spalte. Ausschnitt `height: 240px; overflow: clip; mask-image: linear-gradient(#0000, #000 48px)`, Gerät unten bündig.
Licht als eigenes Element 360 × 192, mittig, Oberkante 120 px (= 240 − 24 − 96), `radial-gradient(closest-side, rgb(241 240 234 / .12),
rgb(241 240 234 / .05) 45%, transparent)`, `pointer-events: none`, ragt in den Bedienblock. Zeigt das Telefon-Video Streifen: als WebP mit
±1 Tonwert Rauschen einbacken (B.2). Zeile nicht gewählt `background: none; box-shadow: inset 0 0 0 2px var(--line2); color: var(--text2)`,
gewählt `background: var(--muted); color: var(--ground)`. Schrift ausdrücklich 15 px, `small` 13 px (sonst 13,33 bzw. 12,5 px, SKILL:69).

**JavaScript:** `probe()` bindet je Element einmal (`data-probe-an`), entfernt `hidden`, setzt `.vk-probe--an`, liest den Zustand aus
`sessionStorage` `vk.probe` (`try/catch`); mit `o.still` ohne Bewegung (Neuaufbau in `/#fensterbauer`, SKILL:63-64). Jede Wahl schreibt
zurück, aktualisiert `alt` und Ansage und löst `CustomEvent('vk-probe', {bubbles: true, detail: {element, sonnenschutz}})` aus; 03 hört an der
Wurzel. Der Handler setzt nur den Zustand synchron, Bildarbeit danach (INP ≤ 200 ms). Nichts verlässt den Browser ([V] E-10); keine
Zählung im Browser, die eigene Statistik arbeitet ohne Skript (`functions/api/statistik.js:1-3`). **Laden:** sechs Standbilder per
IntersectionObserver mit `rootMargin: "100% 0px"`; Bildfolge der aktuellen Elementart bei Annäherung, die übrigen nach Tipp auf ihre
Elementart; bei `Save-Data` keine. Pfade absolut (`/bilder/probe/…`), damit die Einbettung sie findet.

| Asset | Format, Maß | Freistellung | Quelle |
|---|---|---|---|
| 6 Standbilder `probe/{fenster,balkontuer,hst}-{ohne,raffstore}.webp` | WebP 600 × 640 (2× von 300 × 320), ≤ 35 KB | keine; Render-Grund gleich `#161616` (ΔE ≤ 1) | aus der eigenen Bühne zu erzeugen (Materialprobe EV 7.5.11 Nr. 3; Playwright mit `?gl=voll`, SKILL:109-113) |
| 3 Bildfolgen `probe/{…}-raffstore-01…30.webp` | 30 × 450 × 480 (Pixeldichte 1,5), je ≤ 15 KB, ≤ 450 KB je Folge | wie oben | wie oben; Mindestumfang nur „Fenster“ |
| Platzhalter bis dahin | Aufnahmen des CSS-Modells der App, ohne Bildfolge | – | eigene Aufnahme |
| Gerät, Licht | CSS (Licht wahlweise WebP 720 × 384, ≤ 8 KB) | – | – |

Vom Inhaber nötig: Freigabe des Looks „Vitrine“ und Test am eigenen Telefon (SKILL:113); generierte Bilder nicht, das Produkt beweist sich
selbst (SKILL:41). Bildplätze in `docs/BILDER.md` nachtragen.

**Leistung:** höchstens ± 6 Bilder der Folge dekodiert (`createImageBitmap`, `close()` danach): ≈ 11 MB statt 26 MB; Canvas-Pixeldichte ≤ 1,5;
bei Median-Bildzeit über 25 ms für die Sitzung nur Überblendung (KA). Feste Maße gegen Layoutverschiebung; LCP unberührt (Bildschirm 3–4).
Last ≈ 200 KB Standbilder plus 450 KB je geladener Folge, innerhalb SG 10.8 (≤ 60 Bilder, ≤ 3 MB). **Barrierefreiheit:** zwei benannte
`role="group"`, Knöpfe `type="button"` mit `aria-pressed`; höfliche Ansage `role="status"`; `alt` beschreibt den Zustand; Fokusfolge =
DOM; Ziele 171 × 52; Kontraste `--text2` auf Grund 10 : 1, `--muted` 5,8 : 1, gewählt `--ground` auf `--muted` 5,8 : 1, Füllung gegen Grund
5,8 : 1 (WCAG 1.4.11); Zustand über Form (Fläche gegen Kontur), nicht nur Farbe; `forced-colors`: gewählt `Highlight`/`HighlightText`;
`scroll-padding-top` ≥ 56 px.

## I. Conversion-Begründung

- **Position:** Nach 01 weiß der Besucher, *was* er bekommt; der nächste Zweifel vor dem Preis ist „taugt das für meine Kunden?“ (S3 vor S4,
  EA 4.4). Dasselbe Gerät auf derselben Achse verbindet „Ihr Name“, „Ihr Kunde“ und „Ihr Postfach“ (EV W11).
- **Gestaltung:** Das verkaufte Produkt beweist sich selbst, ohne Stimmen oder Siegel (EV 7.5.1 Nr. 1; SKILL:49); die Lamellenfahrt zeigt
  den Realismus, den der Inhaber mag (SKILL:122); die Probe läuft auf einem Telefon (F-34 ohne Worte), die Schlusszeile beantwortet F-10;
  „Weiß ich noch nicht“ zeigt, dass Kunden nicht alles entscheiden müssen und der Betrieb das Offene als Liste bekommt.
- **Informationsmenge:** ≈ 47 Wörter, sechs Optionen, ≈ 0,9 BH statt heute 3,3 BH (PA 1.8). Zwei Griffe sind das Minimum, an dem „eine Wahl
  ändert das Produkt“ erkennbar wird; einer wäre ein Schalter, drei ein Assistent (EV 7.4, Punkt 5).
- **Zielhandlung:** indirekt Z1/Z1a – der Zweifel sinkt (Hypothese), 03 zeigt die eigene Wahl; Pakete bleiben einen Tipp entfernt.
- **Zu testen [H]:** H-E1 zwei Griffe genügen, kein spürbarer Umweg (Lesetest, beobachteter Weg bis `#pakete`; Rückfall Standbilder) ·
  H-04-1 nebeneinander schneller und sicherer, Gerät beim Tippen im Blick (Telefon-Video bei 664, Fehltipps; Rückfall untereinander) ·
  H-04-2 Voreinstellung „Weiß ich noch nicht“ und Unterzeile werden verstanden („Was passiert, wenn Ihr Kunde das wählt?“; Rückfall
  Voreinstellung „Ohne“) · H-04-3 die Fahrt wirkt als Qualität, nicht als Spielerei (Urteil des Inhabers am Telefon; Rückfall Überblendung) ·
  H-04-4 das mitgehende Licht wirkt ruhig, nicht flackernd (Rückfall konstant 10 %). Freigaben: Auslegung „Bildfolge = Antwort“ und die
  Abweichungen in D.

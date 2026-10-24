# Abschluss: kompakte Paketwahl

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 15 von 15 (Anhang A4, nach A3 Hintergrund, vor Brotkrumen und Fuß, in der Einbettung vor `st-04-wechselkarte`) · Intensitätsstufe: 2 klar (Typ T11 Abschluss)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu
PK = `web/assets/pakete.js`, PS = `functions/pakete-seite.js`, VJ = `web/assets/verkauf.js`, VC = `web/assets/verkauf.css`, GC =
`web/assets/gemeinsam.css`, EIN = `web/assets/einladung.js`, VK = `web/fuer-fensterbauer/index.html`. **[V]** verbindlich, **[H]** Hypothese
mit Rückfall, **Festlegung I** = Entscheidung dieser Spezifikation, wo Z offen ist. Lagen sind geplant; Textbreiten sind mit der Inter-Datei
der Website in Chromium gemessen, nicht an Besuchern. `10-paketentscheidung.md` liegt nicht vor: Pakete, Preise und Empfehlung stammen aus
PK und PS:33; sobald das Kapitel vorliegt, gilt es.

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | Abschluss: kompakte Paketwahl, `fb-15-abschluss`; T11, Stufe 2 (Z 8.3.2 A4) |
| Lage | letzter Inhaltsabschnitt; Telefon ≈ 10,35–10,85 BH, Bildschirm 14 bei 664 px, 0,50 BH (Z). Davor A1–A3 (je Stufe 1, Zeilen ohne Bild), danach Fuß bzw. Wechselkarte. Rhythmus 1 · 1 · 1 · **2** |
| Ziel | mit einer Handlung enden (EA H-D7). Heute endet die Seite mit Quellen und Linkliste (VK:259; PA 1.9) |
| Nutzerfrage | „Ich habe genug gesehen, wie geht es weiter?“ (EA S6, zweite Gelegenheit) |
| vorbereitete Entscheidung | endgültige Paketwahl und Z1a (Zustand A) bzw. Z1 (Zustand B); Z1+ über die Cream an „Empfohlen“, solange nicht gewählt |
| bewusst nicht | keine neuen Argumente, keine Merkmale (stehen in 04), kein Rücklink nach oben (E-4), kein zweites Formular |

## B. Konkreter Inhalt

**B.1 Bestand**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| Reihenfolge Essential, Essential Plus, Signature; Preise 29/99, 39/199, 64/279 € netto | PK:18, :43-66 | Zeilen, nur aus PK |
| Kurzname ohne „EEZI“, `geld()` mit schmalem Leerzeichen, Empfehlung = mittleres Paket | PS:30-33 | Zeilen; Cream ohne Wahl |
| Knopfziele: A `#bestellen` mit `data-paket`, B `/partner/#bestellen/<paket>`; „Empfohlen“ | PS:113-117 | Ziel je Zustand (A: `#frage`, fb-09 B.4) |
| „Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.“; `steuerText()` | PS:139, :44 | Steuerzeile |
| „Paket unverbindlich anfragen“; „Wählen Sie Ihr Paket. Im Kundenkonto …“ | VK:221; PS:192 | Grundlage der Leads |
| Dank „Danke, Ihre Frage ist da. Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.“ | VJ:65 | Zustand „gesendet“ |
| Startansicht: „Fensterplaner von“, Zeichen mit Initiale (ohne Farbe Cream), Kennzeichnung „Powered by EEZIframes“ bzw. „Konfigurator von eeziframes“ | EIN:139, :160-176, :198-205 | Inhalt der Vorschau |
| Merkmale je Stufe: Logo, Firmenfarbe als `--accent`, Fotos, Kennzeichnung | PK:24-28, :46, :54, :62 | Unterschied der drei Vorschauen |
| Produktpalette, erste Farbe `#0071e3` | EIN:31 | Beispielfarbe Plus und Signature |

**B.2 Texte**

| Element | Wortlaut | Status |
|---|---|---|
| h2 | „Aus der Probe wird Ihr Konfigurator.“, grün „Konfigurator“ | Textentwurf (KD; EV 7.5.3) |
| h2, Rückfall ohne bedienbare Probe (C′, B′, „E mit Standbildern“) | „Ihr Konfigurator, Ihr Paket.“, grün „Paket“ | Textentwurf |
| Lead A / B | „Paket wählen und unverbindlich anfragen.“ / „Paket wählen, im Kundenkonto bestellen.“ | Textentwurf aus VK:221, PS:192 |
| Spaltenköpfe | „BEISPIEL“ über der Vorschau, „IM MONAT“ über den Preisen | Textentwurf |
| Zeile | Kurzname · Monatspreis / („Empfohlen“) · „199 € einmalig“ | Werte aus PK; „einmalig“ Textentwurf (Karte: „Einrichtung, einmalig vorab“) |
| Steuerzeile | „Einrichtung einmalig vorab. Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.“ | erster Satz Textentwurf, Rest PS:139 |
| Zugänglicher Name je Zeile | „Essential Plus, 39 € im Monat, 199 € einmalig, empfohlen, anfragen“ (B: „bestellen“) | Textentwurf |
| Vorlesetext der Vorschau | „Beispiel: Startansicht in EEZI Essential Plus, Fensterplaner von Fensterbau Brandt, mit Zeichen und Farbe des Betriebs.“ (je Stufe angepasst, mit dem Namen aus 01) | Textentwurf |

Rund 30 Wörter plus Zahlen.

**B.3 Interaktionen:** Tipp auf eine von drei Zeilen (A: Paket ins Formular, Sprung zu `#frage`; B: ins Kundenkonto). Am Schreibtisch
[H]: Zeiger oder Fokus auf einer Zeile zeigt deren Markenstufe in der Vorschau.

**B.4 Vorhandene Komponenten:** `.btn` mit `.big` (56 px), `.primary`, `.ghost`, `.pf` (GC:56-76); `.ak`, `.num` (GC:47-48);
Abschnittsrahmen `.vk-teil` (VC:501-502); Paketvorwahl über `a[data-paket]` (VJ:28-36, erweitert in fb-09); Zustand „gewählt“ je Wurzel
(fb-06 H); Gerät-Baustein `<!--pakete:geraet-->` mit `data-vk-name`/`data-vk-initiale` (fb-03 H.1); Sprung-Handler der Einbettung
(`web/assets/portal.js:835-843`); `.p-sr` als Vorbild für versteckten Text (`web/assets/partner.css:6`).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Satzbau Haarlinie → h2 → Lead → Spaltenköpfe → [Vorschau | Zeilenstapel] → Steuerzeile. Der Lead steht vor dem
Held, weil er das Verb der Zeilen trägt (Abweichung von G2 wie in fb-03). Raster am Telefon: 4 Spalten à 77,5 px, Rinne 16 px (K-12);
die Wahl bildet darin ein eigenes Komponentenraster aus fester Bildspalte 96 px, Fuge 12 px (`--a-nah`) und Handlungsspalte 250 px. Asymmetrisch: kleines, hohes Objekt an der Ordnungslinie x = 16, breite Handlungsmasse
rechts; die Cream liegt rechts in der Mitte, so dass der Blick diagonal von der h2 (oben links) zur Handlung läuft.

**C.2 Telefon 390 × 844, Lagen relativ zur Haarlinie**

| y | Element | x · Breite | Maß |
|---|---|---|---|
| 0 | Haarlinie 1 px `--line`, ohne Nummer (Anhang, E-AB-10) | 16–374 | 96 px nach A3 |
| 24–92 | h2 32/34 (K-18), zwei Zeilen „Aus der Probe wird“ (287 px) / „Ihr Konfigurator.“ (246 px) | 16 | – |
| 104–130 | Lead 17/26, eine Zeile (341 px; B 332 px) | 16 | Abstand 12 |
| 154–170 | „BEISPIEL“ (68 px) links; „IM MONAT“ (80 px) rechtsbündig bis x 324; Technikstimme 13/16 | 16 · 324 | Abstand 24 |
| 178–370 | Vorschau 96 × 192 | 16–112 | Abstand 8 |
| 178–234 · 246–302 · 314–370 | drei Zeilen 250 × 56, Abstand 12 (3 × 56 + 2 × 12 = 192) | 124–374 | – |
| 386–422 | Steuerzeile 13/18, zwei Zeilen | 16–374 | Abstand 16 |
| 422 | Ende: 0,50 BH; danach 96 px | – | – |

**Ruhestand:** Steht die Haarlinie bei y ≈ 300, liegen die Zeilen bei y 478–670, die Cream-Zeile (Plus) bei 546–602, also in der unteren
Hälfte im Daumenbereich; unten schneidet die Brotkrumen-Haarlinie bzw. die Wechselkarte bei y ≈ 818 an. Bei 390 × 664 passt der ganze
Abschnitt mit Haarlinie bei y ≈ 200.

**C.3 Zeile (Festlegung I-1)**

| Teil | Wert |
|---|---|
| Form | `.btn.big`-Pille 250 × 56, Radius voll; Innenabstand links 22, rechts 14 |
| Raster | Spalten `minmax(0,1fr) auto 28px`, Abstand 8; Zeilen 20 + 16, Abstand 2, senkrecht mittig |
| oben links | Kurzname 17/20, 700 („Essential Plus“ 116 px); Bedientext, nicht 800 (K-21) |
| oben rechts | Monatspreis 17/20, 700, `tabular-nums`, rechtsbündig (36 px) |
| unten links | nur Plus: „Empfohlen“ 13/16, 700 (68 px); bleibt an Plus, auch wenn die Cream wandert (wie fb-06, J-AB-8) |
| unten rechts | „99 € einmalig“ … „279 € einmalig“ 13/16, 500, rechtsbündig (≤ 92 px) |
| rechts | gefüllter Pfeilkreis 28 px (`.pf`) nur an der Cream-Zeile (K-31; GEST:93); die Ring-Zeilen tragen weder Pfeilkreis noch Chevron (Zeilenknopf der Ring-Familie nach 11.6.2, kein Listenziel) und halten den Platz frei, damit die Preisspalte über alle drei fluchtet |
| Breitenbudget | 250 − 22 − 14 − 28 − 16 = 170 px für Name + Preis (152) bzw. Marke + Einrichtung (160) |
| Cream | Fläche `--primary`, Schrift `--on-primary` (15,8 : 1), untere Zeile `rgba(22,22,22,.72)` = #535351 (6,8 : 1), `.pf` wie GC:74; Hover innere 2-px-Kontur `--on-primary` 24 %, Druck Füllung `--primary-druck` (K-2) |
| Ring | transparent, Innenkontur 2 px `--muted` (5,8 : 1; K-1, DNA-B Regel 12, DG-E-10) als einzige Grenze, Hover → `--text`, Druck Füllung `--surface2`; Schrift `--text`, untere Zeile `--text2` (10,8 : 1) |

Warum so: Mit „im Monat“ und „Einrichtung“ in der Zeile passen Name, Preise und „Empfohlen“ nicht in 170 px (gemessen ≈ 210–240 px).
Spaltenkopf und „einmalig“ tragen dieselbe Information; die Steuerzeile nennt „Einrichtung“.

**C.4 Vorschau (Bildschicht)**

- **Körper:** Gerätebaustein nach K-23 (fb-03 C.3), proportional verkleinert: 96 × 192 (1 : 2), Rand 3 px `--surface`, Radius 14 außen
  und 11 innen (44/34 auf 300 px; SG 10.5); Lichtkante 1 px rundum `--kante-alpha` (.14), Ober- und rechte Kante `--kante-licht` (.24)
  nach K-24 (wie fb-03 C.6); unten über 15 px in den Grund ausgeblendet (48 px × 96/300; Schreibtisch 26 px), die Lichtkante läuft mit der
  Maske aus; kein Schatten.
- **Bildschirm:** 90 × 186. Darin die Startansicht aus dem Gerät von 01 (fb-03 C.3, y 10–406) als Box 280 × 579, ergänzt um den Fuß bei
  y 470–502 (über der Maske: im Körper y 154–164, am Schreibtisch 257–274), `transform: scale(.3214)`. Die Adresszeile der Miniatur steht
  ohne „· Beispiel“, weil das Etikett „BEISPIEL“ darüber die Kennzeichnung trägt (K-36, je Material eine Form). Dieselbe Box dient am
  Schreibtisch mit `.5357`. Die Schrift darin ist Bildinhalt (≈ 4 px), lesbar bleibt nur die Gestalt.
- **Markenstufen (Festlegung I-4, I-5):**

| Stelle | Essential | Essential Plus | Signature |
|---|---|---|---|
| Zeichen | Initiale auf Cream | Initiale auf Beispielfarbe `#0071e3` | wie Plus |
| grünes Wort „Angebot“ | `--accent` | Beispielfarbe | wie Plus |
| Bild | Standardbild (`app-start`, fb-03) | erstes Foto des Beispielbetriebs (fb-06 Assets); bis dahin Verlauf wie `.sk-foto` (VC:66-67) | wie Plus |
| Fuß | „Powered by EEZIframes“ mit Zeichen | „Konfigurator von eeziframes“ | leer |

  Alle drei auf dunklem App-Grund, weil eine Instanz die Firmenfarbe nur als Akzent trägt (PK:24); die helle Skizzenpalette (VC:78)
  zeigte eine Gestaltung, die es nicht gibt, und wäre neben der Cream ein zweiter Hellwert. Eine Beispielfarbe, weil es einen
  Beispielbetrieb gibt (G7); fb-06 nutzt dieselbe.
- **Anschlussstrich:** 12 × 1 px `--muted` von der Vorschau (x 112) zur Zeile, deren Stufe sie zeigt, auf halber Zeilenhöhe; ohne Wahl
  bei y 274, der Mitte der Vorschau: Objekt und Handlung auf einer Achse.

**C.5 Verhältnisse.** Im Abschnitt (358 × 422): Vorschau ≈ 12 %, Zeilen ≈ 28 %, Text ≈ 29 %, frei ≈ 31 %; im Ruhestand-Bildschirm frei
geschätzt ≥ 40 % (SG 10.1/3). Größenhierarchie: Vorschau 192 px gegen Versalhöhe der Bedienschrift (≈ 12,4 px bei 17 px) ≈ 15-fach, h2 32
als einzige Zwischenstufe; drei Größen 32 · 17 · 13 (DNA-B Regel 6). Bildanteil am Bildschirm ≈ 5,6 %, unter dem Stufe-2-Richtwert 20–50 %:
Die Stufe folgt hier aus dem Typ T11 und Dosierregel 1, das Objekt ist Maßstab, keine Bühne. Ansichtstyp nach DNA-B B.1: Arbeitsansicht mit
kleinem Fokusträger.

**C.6 Ebenen [V].** 0 Grund `#161616` → 20 Vorschau (nur die sichtbare Stufe als `role="img"`, die anderen `hidden`; `pointer-events: none`) →
30 Bedienschicht (Haarlinie, h2, Lead, Köpfe, Zeilen, Steuerzeile) → 40 Kopf. Vorschau und Zeilen überdecken sich nie (12 px Fuge).

**C.7 Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Abschnittsabstand | 96 Telefon, 128 Schreibtisch | G6 |
| Rahmen | `.vk-teil` mit `counter-increment: none`, `::before { content: none }`, `padding-top: 24px` | Anhang ohne Nummer (E-AB-10) |
| h2 | 32/34 px (40/42 ab 1024 px), 800, −.03em, `text-wrap: balance` | SKILL:69; Zeilenhöhe K-18, Umbruch 1024 nach 11.2.1; wie fb-03 |
| Lead | 17/26, 500, `--text2` | Lesestapel |
| Technikstimme | 13/16, 600, Versalien, +0,12 em, `--muted` (auf Fläche), `aria-hidden`; „BEISPIEL“ oben links an der Vorschau ist deren einzige Kennzeichnung | K-36 Form (a), 11.3.1; grau statt grün: ein grünes Wort |
| Steuerzeile | 13/18, 500, `--muted` (5,8 : 1) | Nebengröße, kleiner als Preise (EA AB-4) |

## D. Anwendung der Design-DNA

Verbindlich gelten DNA-B Regeln 3 und 7–12 (Arbeitsansicht); 1, 2, 4–6 sind erfüllt, ohne Pflicht zu sein. Variable Merkmale sind auf
Stufe 2 gedrosselt.

| Eigenschaft | Ausgestaltung, Position | Intensität 0–4 | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen; Tiefe über Bildoptik im Gerät (Bildschirm im Rand, Lichtkante oben rechts nach K-24, Auslauf unten nach K-23), keine Verdeckung | 1 | Ruhe am Ende, nichts konkurriert mit der Zeile |
| Material, Transparenz | Gehäuse matt `--surface`; Material nur im Bildschirm (echtes Bild, echte Startansicht); kein Glas | 1 | Produkt als Beleg (SKILL:41) |
| Licht, Schatten | Bildschirm ist der Lichtkern (st-04 D); keine CSS-Lichtfläche, kein Schatten (DNA Nr. 6; DG-AB-1) | 1 | Lichtbudget bleibt bei V1 und 02 |
| Formen | Zeilen Vollrundung wie alle Knöpfe (DNA-B Regel 8; DG-AB-8); Gerät 14/11 als Motiv außerhalb der UI-Radien | 2 | eine Formfamilie; Pillen unterscheiden sich von den eckigen Aufklappzeilen in A2/A3 |
| 3D-Objekte, Perspektive | keine; Gerät frontal wie in 01 | 0 | Leitobjekt bleibt dasselbe |
| Bildintegration | HTML-Miniatur der Startansicht (H-E9), „BEISPIEL“ als Etikett oben links (K-36 a), Adresszeile der Miniatur ohne „· Beispiel“ | 2 | schließt den Bogen 01 → 04 → Ende |
| Oberflächendetails | Anschlussstrich, Technikstimme, rechtsbündige Ziffernspalte, Pfeilkreis (informierende Mikroschicht, DNA-B B.3.13) | 2 | „präzise wie ein Aufmaß“ |
| Animation | keine außer Zustand; Überblendung der Vorschau nur nutzergeführt [H] | 1 | siehe F |
| Typografie | Bühnenstimme h2 mit einem grünen Wort; Zeilen 17 fett; Technikstimme 13 | 2 | „Konfigurator“ ist das einzige Signal |
| Überlagerungen | keine | 0 | – |
| interaktive Effekte | Zustände über Füllung und Kontur; Vorschau folgt Zeiger oder Fokus [H] | 1 | Rückmeldung ohne Ablenkung |

**Signature:** keine inszenierende (Dosierregel 1); informierend nur der Anschlussstrich (≤ 1).
**Bewusst weggelassen:** Bullauge-Band (DG T11; EV 7.5.5: zweiter Held), Vorschau je Zeile (Z Festlegung 8), Karte um den Abschluss
(KD), Ring „Anderes Paket wählen“ (E-4), Ring „Frage stellen“ (DG T11; Z: kein zusätzlicher Ring), Auftritt, Glas, Lichtraum,
Parallaxe, Merkmale (stehen in 04), Etikett „Ihre Wahl“ (wer getippt hat, weiß es).
**Auslegung zu bestätigen:** Cream und Grün im Bildschirm der Vorschau sind Produktinhalt (wie fb-03 D); ihre Cream-Fläche (≈ 80 × 12 px)
ist ein Fünfzehntel der Cream-Zeile. Rückfall bei zwei Flecken im Blinzeltest: Bildschirminhalt mit 80 % Deckkraft.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **h2** als größte Schrift, das grüne „Konfigurator“ als einziger Farbreiz der Bedienschicht.
2. **Primärer Fokus, Handlung:** die Cream-Zeile, größte helle Fläche (250 × 56 ≈ 4,3 % des Bildschirms, 15,8 : 1), im Ruhestand in der
   unteren Hälfte.
3. **Sekundärer Fokus:** der Bildschirm der Vorschau links daneben, auf derselben Achse; der Anschlussstrich verbindet beide.
4. Preisspalte 29 · 39 · 64 von oben nach unten, dann die Ring-Zeilen; zuletzt Steuerzeile und Kopf-Ring.

**Kontraste:** Cream-Zeile 15,8 : 1, Zeile 2 darauf 6,8 : 1; Ring-Zeilen Schrift 16,2 : 1, Zeile 2 10,8 : 1; Köpfe und Steuerzeile 5,8 : 1;
Ring-Kontur `--muted` 5,8 : 1 statt `--line2` 1,6 : 1 (Konturen 3 : 1, DNA-B Regel 12; K-1).
**Mögliche Ablenkungen:** Kopf-Ring „Paket anfragen“ mit verwandtem Ziel, als Ring zurückgenommen und ohne Paketvorwahl (rh-01 I, fb-09
F); A3-Zeilen darüber (eckig mit „+“, keine Pille); in der Einbettung die Wechselkarte, dunkel mit Ring (st-04 Festlegung „helle Karte“);
das Zeichen im Fuß (rh-03 E); die Mini-Cream im Gerät (Auslegung in D).
**Übergang:** Die Handlung selbst führt aus dem Abschnitt: zum Formular (Z 8.2.9, „ABS ⇒ F05“) bzw. ins Kundenkonto. Wer nicht tippt, sieht
nach 96 px Grund die Brotkrumen-Haarlinie bzw. die Wechselkarte. Nichts sonst zeigt zurück (E-4).

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Scrollen, Erscheinen | kein Scrollbezug, kein Auftritt, auch kein Deckkraft-Einblenden: die Bedienschicht steht ab dem ersten Bild; `.vk-abschluss` kommt nicht in die Reveal-Liste (VJ:477) | – | K-6; E-13; DG-AB-2 |
| Wahl ändert sich: Kartenknopf, A4-Zeile, Gesprächsweg (= keine Wahl, fb-08 F), Paketfeld `change` | `abschlussSetzen()`: Cream-Klassen tauschen, `hidden` der Vorschau-Stufen, Anschlussstrich; ohne Wahl Cream an „Empfohlen“ | 0 ms (geschieht außerhalb des Bildes) | Festlegung I-2: eine Quelle |
| Hover (`hover: hover`) | Cream: innere 2-px-Kontur `--on-primary` 24 %, Füllung bleibt `--primary`; Ring: Kontur `--muted` → `--text` | 150 ms `--e-out` | Hover = Kontur (K-1, K-2; DG 2.4.1) |
| Zeiger oder Fokus auf Zeile [H] | Vorschau zeigt deren Stufe (Deckkraft-Überblendung), Strich folgt; Verlassen der Liste: nach 150 ms zurück zur Cream-Zeile | 220 ms `--e-out` | Bildschicht, nutzergeführt (E-13) |
| Fokus | `outline: 2px solid var(--text)`, Abstand 2 px, folgt der Pille (formfolgend), nie verdeckt | sofort | K-34; SG 10.9 |
| Drücken | Cream Füllung `--primary-druck` (#e2e1db), Ring Füllung `--surface2`; keine Deckkraftänderung, keine Skalierung (`transform: none` gegen GC:65) | sofort, zurück 150 ms `--e-out` | K-2; DNA-B B.3.7 |
| Tipp, Zustand A | Paket setzen, Sprung `behavior: 'auto'` zu `#frage`, Fokus auf die h3, Hinweis am Paketfeld (fb-09 F); eigenständig nativer Ankersprung, „Zurück“ führt in den Abschluss (Z 8.2.7) | sofort | ≈ 4 BH: weiches Scrollen ließe Ablauf-Marken und Anhänge vorbeiziehen |
| Einbettung | `data-sprung="direkt"`, weil der Handler (portal.js:841) sonst `smooth` scrollt; Anker `#fensterbauer` bleibt | – | GEST:193 |
| Tipp, Zustand B | Seitenwechsel `/partner/#bestellen/<paket>`; der Name aus 01 geht nicht mit (Z 8.3.2 d) | – | – |
| Gesendet (A; `vk:gesendet`, Merker `vk-anfrage-gesendet`, fb-09) | Lead und Zeilen `hidden`, Dank-Satz 17 (VJ:65) sichtbar, Vorschau zeigt das gesendete Paket (Festlegung I-3) | 0 ms (der Wechsel geschieht außerhalb des Bildes, am Formular; das Einblenden 220 ms nach K-6 entfällt deshalb) | keine zweite Aufforderung nach dem Senden |
| Neuaufbau (`o.still`) | Wahl aus dem Zustand je Wurzel, Merker aus `sessionStorage` (`try/catch`) | sofort | SKILL:63-64 |
| weniger Bewegung | Überblendung wird Schnitt; sonst identisch | 0 ms | SG 10.7/7 |
| ohne JavaScript | Cream an „Empfohlen“, Vorschau Plus; Zeilen springen zu `#frage`, Paketfeld bleibt „Noch offen“ | – | SKILL:62 |

Charakter: still. Tiefe und Physik (SKILL:43) tragen V1 bis 04; dies ist eine Entscheidungsfläche (Dosierregel 1).

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Komposition C.2. **360 px:** Zeilen 220 px; unter 250 px Zeilenbreite entfällt der Pfeilkreis
(`@container`), Budget 168 px ≥ 160. **Unter 352 px:** Vorschau entfällt, Zeilen über die volle Breite (Festlegung I-7). **200 % Text:**
Zeilen wachsen in der Höhe (`min-height` 56), Vorschau bleibt oben bündig. **390 × 664:** nur der Ausschnitt ändert sich.

**640–1023 px:** Telefonkomposition (Rinne 16 px, K-12), Block höchstens 560 px breit (Zeilen bis 452 px); h2 bleibt 32/34 und wird erst
ab 1024 px 40/42 (K-18; 11.2.1).

**Schreibtisch 1280 × 800.** Spalte 1040 (x 120–1160), 12 Spalten à 64,67 px, Rinne 24 px (K-12).

| y | Element | x · Breite |
|---|---|---|
| 0 | Haarlinie über 12 Spalten | 120–1160 |
| 32–74 | h2 40/42 einzeilig (677 px), Spalte 1–9 (Festlegung I-6) | 120 |
| 90–116 | Lead 17/26 | 120 |
| 148–164 | „BEISPIEL“; „IM MONAT“ rechtsbündig bis x 840 | 120 · 840 |
| 172–492 | Vorschau 160 × 320 (Rand 5, Radius 23/18, Maske unten 26, Box 280 × 579 mit `.5357`), Spalte 1–3 linksbündig | 120–280 |
| 172–396 | drei Zeilen 508 × 64, Abstand 16, Innenabstand 0 18 0 28, Spalte 4–9 | 386–894 |
| 412–448 | Steuerzeile, zwei Zeilen, Spalte 4–9 | 386–894 |

Die Vorschau ist höher als der Zeilenstapel (Maßstabssprung), die Steuerzeile steht neben ihrem unteren Teil. Anschlussstrich 106 px als
Führungslinie wie in 03 (halbe Zeilenbreite − 148 px = drei Spalten und drei Rinnen − 160 px Vorschau); Spalten 10–12 bleiben frei;
Abschnitt 492 px (0,62 BH); Überblendung bei Zeiger [H] aktiv.

**Schreibtisch 1024.** Inhalt x 32–992, Spalten à 58, Rinne 24. h2 einzeilig über Spalte 1–10; Vorschau 160 × 320 bei x 32; Zeilen
Spalte 4–9 (x 278–746, 468 × 64); Strich 86 px.

## H. Technische Umsetzung

**Bestehend:** wie B.4, dazu PS `verkaufFuer`, VJ `Verkauf.auf`, EIN `initiale`, `kennzeichnung`.

**Neu:**

1. **Baustein `<!--pakete:abschluss-->`** in PS, Funktion `abschluss(o, v)`: Zeilen aus `P().LISTE`, `P().preis(p)`, Cream an
   `EMPFOHLEN`, Ziel und Verb nach `v.bestellen` (wie PS:113-115), Steuerzeile aus `steuerText(v)` und `v.vorlaeufig`; Vorschau je Stufe
   aus dem Gerät-Baustein von fb-03 (`geraetSchirm(m, { mini: true })`) mit Fuß aus `kennzeichnung()`; `mini` lässt „· Beispiel“ in der
   Adresszeile weg (K-36) und setzt den Fuß bei y 470 über die Maske (K-23). Steht als letzter Abschnitt in
   `main.rg`, damit die Einbettung ihn übernimmt (portal.js:808-811). Danach `node scripts/bedingungen-pdf.mjs`.
2. **VJ `abschluss(wurzel, o)`**, aus `Verkauf.auf`, Bindung je Element einmal (`__vkAn`): liest und schreibt den Zustand „gewählt“ je
   Wurzel (fb-06, fb-09); hört auf `click` `a[data-paket]`, `change` am Paketfeld, `vk:gesendet`; Überblendung nur bei `hover: hover`
   und `:focus-visible`. ≈ 1,2 KB.
3. **VC** Block `.vk-abschluss` ≈ 2,5 KB; `.vk-sr` wie `.p-sr`.
4. **portal.js:841:** `behavior: 'auto'`, wenn `a.dataset.sprung === 'direkt'` (eine Bedingung).
5. **Prüfsuite 29.2:** Zeile `a[data-paket="essential"]` im Abschluss wählt vor; nach `#paket-signature a[data-paket]` trägt die
   Signature-Zeile `.btn.primary`; Zeilen ≥ 44 px.

**Markup (Reihenfolge = Lesefolge)**

```html
<section class="vk-teil vk-abschluss" data-abschnitt="fb-15-abschluss" aria-labelledby="vk-abschluss-titel">
  <h2 id="vk-abschluss-titel">Aus der Probe wird Ihr <span class="ak">Konfigurator</span>.</h2>
  <p class="vk-abschluss-lead">Paket wählen und unverbindlich anfragen.</p>
  <div class="vk-wahl">
    <p class="vk-tech vk-wahl-bsp" aria-hidden="true">Beispiel</p>
    <p class="vk-tech vk-wahl-monat" aria-hidden="true">im Monat</p>
    <div class="vk-mini">
      <div class="vk-mini-stufe" data-stufe="essential" role="img" aria-label="…" hidden><div class="vk-mini-box">…</div></div>
      <div class="vk-mini-stufe" data-stufe="plus" role="img" aria-label="…"><div class="vk-mini-box">…</div></div>
      <div class="vk-mini-stufe" data-stufe="signature" role="img" aria-label="…" hidden><div class="vk-mini-box">…</div></div>
    </div>
    <ul class="vk-zeilen" role="list">
      <li><a class="btn big ghost vk-zeile" href="#frage" data-paket="essential" data-sprung="direkt">
        <b class="vk-z-name">Essential</b><span class="vk-z-preis num">29 €<span class="vk-sr"> im Monat</span></span>
        <span class="vk-z-einr num">99 € einmalig</span><span class="vk-sr">, anfragen</span><i class="vk-z-pf" aria-hidden="true"></i></a></li>
      <!-- Plus: class="btn big primary vk-zeile" data-zeigt, <span class="vk-z-marke">Empfohlen</span>, <span class="pf"> -->
    </ul>
    <p class="vk-abschluss-steuer">Einrichtung einmalig vorab. Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.</p>
  </div>
  <p class="vk-abschluss-dank" hidden>Danke, Ihre Frage ist da. …</p>
</section>
```

Die Vorschau enthält keine `.btn`, keine IDs und kein `h1` (Knöpfe der Miniatur sind `span`, fb-03 C.3), sonst zählten `kopfCta()` bzw.
`Kopf.auf` sie als Cream und die Prüfsuite fände Doppelungen. Keine Klassen `.vk-paket`/`.vk-preis` (Prüfsuite 29.1 liest
`.vk-paket .vk-preis b`).

**CSS-Startwerte (Kern)**

```css
.vk-abschluss { counter-increment: none; padding-top: 24px }
.vk-abschluss::before { content: none }
.vk-tech { margin: 0; font-size: 13px; line-height: 16px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--muted) }
.vk-wahl { display: grid; grid-template-columns: 96px minmax(0, 1fr); column-gap: 12px; row-gap: 8px; margin-top: 24px }
.vk-mini { grid-area: 2 / 1; position: relative; width: 96px; height: 192px; border-radius: 14px; padding: 3px; background: var(--surface);
  mask-image: linear-gradient(#000 calc(100% - 15px), transparent) }
.vk-mini::after { content: ''; position: absolute; inset: 0; border-radius: inherit; border: 1px solid var(--kante-alpha);
  border-top-color: var(--kante-licht); border-right-color: var(--kante-licht); pointer-events: none }
.vk-mini-stufe { position: absolute; inset: 3px; overflow: clip; border-radius: 11px; background: var(--ground); transition: opacity var(--t2) var(--e-out) }
.vk-mini-box { width: 280px; height: 579px; transform: scale(.3214); transform-origin: 0 0; pointer-events: none }
.vk-zeilen { grid-area: 2 / 2; display: grid; grid-template-rows: repeat(3, 56px); gap: 12px; margin: 0; padding: 0; list-style: none; container-type: inline-size }
.vk-zeile { display: grid; grid-template: "n p f" 20px "m e f" 16px / minmax(0, 1fr) auto 28px; gap: 2px 8px; align-content: center;
  justify-content: stretch; width: 100%; padding: 0 14px 0 22px; text-align: left; outline: 2px solid transparent; outline-offset: -2px; transition: background-color var(--t1) var(--e-out), box-shadow var(--t1) var(--e-out) }
@media (hover: hover) { .vk-zeile.primary:hover:not([disabled]) { background: var(--primary); box-shadow: inset 0 0 0 2px rgb(22 22 22 / .24) }
  .vk-zeile.ghost:hover { box-shadow: inset 0 0 0 2px var(--text) } }
.vk-zeile:active:not([disabled]) { transform: none; transition-duration: 0s }
.vk-zeile.primary:active:not([disabled]) { background: var(--primary-druck) } .vk-zeile.ghost:active:not([disabled]) { background: var(--surface2) }
.vk-zeile:focus-visible { outline: 2px solid var(--text); outline-offset: 2px }
.vk-z-name { grid-area: n } .vk-z-preis { grid-area: p } .vk-z-marke { grid-area: m } .vk-z-einr { grid-area: e } .vk-zeile .pf, .vk-z-pf { grid-area: f; margin: 0 }
.vk-z-preis, .vk-z-einr { justify-self: end } .vk-z-einr, .vk-z-marke { font-size: 13px; line-height: 16px }
.vk-zeile.ghost { box-shadow: inset 0 0 0 2px var(--muted) }
.vk-wahl-bsp { grid-area: 1 / 1 } .vk-wahl-monat { grid-area: 1 / 2; justify-self: end; margin-right: 50px }
.vk-zeile.primary .vk-z-einr, .vk-zeile.primary .vk-z-marke { color: rgba(22, 22, 22, .72) }
.vk-zeile[data-zeigt]::before { content: ''; position: absolute; left: calc(-1 * var(--strich, 12px)); top: 50%; width: var(--strich, 12px); height: 1px; background: var(--muted) }
.vk-abschluss-steuer { grid-column: 1 / -1; margin: 8px 0 0; font-size: 13px; line-height: 18px; color: var(--muted) }
@container (max-width: 249px) { .vk-zeile { grid-template-columns: minmax(0, 1fr) auto 0 } .vk-zeile .pf { display: none } }
@media (max-width: 351px) { .vk-mini, .vk-wahl-bsp { display: none } .vk-wahl { grid-template-columns: minmax(0, 1fr) } .vk-zeilen { grid-column: 1 } }
@media (min-width: 1024px) {
  .vk-wahl { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; row-gap: 8px; --strich: calc(50% - 148px) }
  .vk-mini { grid-area: 2 / 1 / 4 / 4; width: 160px; height: 320px; padding: 5px; border-radius: 23px;
    mask-image: linear-gradient(#000 calc(100% - 26px), transparent) } .vk-mini-stufe { inset: 5px; border-radius: 18px }
  .vk-mini-box { transform: scale(.5357) } .vk-wahl-bsp { grid-column: 1 / 4 } .vk-wahl-monat, .vk-zeilen, .vk-abschluss-steuer { grid-column: 4 / 10 }
  .vk-zeilen { grid-template-rows: repeat(3, 64px); gap: 16px } .vk-zeile { padding: 0 18px 0 28px } .vk-wahl-monat { margin-right: 54px }
  .vk-abschluss-steuer { grid-row: 3; align-self: start } .vk-abschluss h2 { max-width: none } }
@media (prefers-reduced-motion: reduce) { .vk-mini-stufe { transition: none } }
```

Die transparente Kontur (`outline`) macht die Cream-Zeile in erzwungenen Farben als Knopf sichtbar, ohne die Maße zu ändern, ebenso die
Ring-Zeilen, deren Kontur als `box-shadow` dort entfällt; der Abstand −2 px gilt nur für diese Ruhekontur, der Fokus überschreibt sie mit
Abstand 2 px nach K-34 (die Regel steht nach GC:38 und braucht deshalb die eigene `:focus-visible`-Zeile). `--strich` als
`calc(50% - 148px)` bezieht sich auf die Zeilenbreite und ergibt 86 px bei 1024 und 106 px ab 1104 px, ohne eigene Stufe je Breite.

**Assets**

| Asset | Art, Format, Maß | Freistellung | Quelle |
|---|---|---|---|
| Standardbild 16 : 9 (Essential) | WebP 500 × 281 | keine | vorhanden über fb-03 (aus `web/bilder/foto/app-start.webp`), aus dem Cache |
| Foto des Beispielbetriebs (Plus, Signature) | erstes der Fotos aus fb-06: Werkstatt oder Musterfenster, 1200 × 900 WebP, in der Vorschau als 16 : 9-Ausschnitt | keine | beim Inhaber anzufragen (Flux, gemeinsam mit fb-06; ohne Text, Logos, Wasserzeichen, Personen; Licht warm von oben links) |
| Zeichen „Powered by“ | Inline-SVG `Logo.svg(18)` | – | vorhanden (EIN:200) |
| Rückfall H-E9 | Aufnahme je Stufe 270 × 558 (3×), WebP ≤ 25 KB | – | per Playwright aus `Einladung.html` erzeugen, ohne Namen |

**Animationstechnik:** Stufe 1 „Leicht“ (SKILL Abschnitt 3): CSS-Übergänge auf Farbe, Kontur, Deckkraft; kein `requestAnimationFrame`.
**Leistung:** weit unter dem ersten Bildschirm; ≈ 120 zusätzliche Knoten (drei Miniaturen), statische `transform` ohne Animation, Bilder
`loading="lazy"`, feste Maße (keine Layoutverschiebung); keine fremden Server.
**Barrierefreiheit:** `section` mit `aria-labelledby`; Liste aus drei Links mit vollständigem Namen; sichtbare Stufe als `role="img"`,
verborgene über `hidden`; Ziele 56 px; Fokus 2 px `--text`, Abstand 2 (K-34); Lesefolge h2 → Lead → Zeilen → Steuerzeile; nichts nur über Farbe („Empfohlen“ als
Text).
**Prüfpunkte:** Schriftgrößen 32/40 · 17 · 13 (in der Miniatur 13 · 15 · 24 berechnet); eine Cream je Bildschirm (Abstand zu „Frage
senden“ ≈ 3 BH); kein Querscrollen bei 320–390 px; Einbettung, ohne JavaScript, weniger Bewegung; `farbanteil.py` bei 390 × 844.

## I. Conversion-Begründung

**Position.** Wer bis hier liest, hat Probe, Preise, Risiko, Ablauf, Kundenschutz und Fragen gesehen (S1–S5); gerade dort fehlt heute die
Handlung (PA 1.9). Der Abschluss fängt Besucher auf, die nach S5 entschieden haben (EA H-D7 [H]), ohne sie fünf Bildschirme zurück zu den
Karten zu schicken.
**Gestaltung.** Dieselben Preise und dieselbe Empfehlung wie in 04 öffnen keine neue Entscheidung. Die Cream folgt der ausdrücklichen Wahl
(E-3) und sonst „Empfohlen“; die Vorschau holt das Gerät aus 01 zurück und zeigt die Markenstufe als Ergebnis. Ein Tipp setzt das Paket ins
Formular.
**Informationsmenge.** Rund 30 Wörter, drei Zahlenpaare, ein Bild. Merkmale und Begründungen stehen in 04 und den Fragen; mehr Text würde die
Entscheidung wieder öffnen.
**Beitrag.** Z1a mit vorgewähltem Paket (A), Z1 (B); Z1+ über die Cream an Plus ohne Wahl.

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| A4-H1 | = H-D7: Die Paketwahl am Ende erzeugt Anfragen mit Paket, die sonst ausblieben | Gespräche; Anteil Anfragen mit Paket und Herkunft nur über die eigene Statistik nach EA O-2 | Abschnitt bleibt, Kosten gering |
| A4-H2 | Die wandernde Cream wird verstanden und nicht als Fehler gelesen | Telefon-Video, Lesetest | Cream fest an „Empfohlen“ (DG T11 wörtlich) |
| A4-H3 | „IM MONAT“ und „einmalig“ werden richtig gelesen | Lesetest „Was zahlen Sie für Plus im ersten Monat?“ (39 € + 199 €) | „+ 199 € Einrichtung“ in der Zeile, „Empfohlen“ als Kontur-Pille auf dem Zeilenrand, Abstand 16, Vorschau 100 × 200 |
| A4-H4 | Die Vorschau wird als „mein Konfigurator in diesem Paket“ erkannt (H-E9) | Lesetest | ohne Vorschau, Zeilen volle Breite (Stufe 1) |
| A4-H5 | Der direkte Sprung hält die Orientierung besser als weiches Scrollen | Beobachtung am Telefon | `smooth` |
| A4-H6 | Die Überblendung am Schreibtisch hilft beim Vergleich und lenkt nicht ab | Sichtprüfung des Inhabers | Vorschau fest |

**Festlegungen I:** I-1 Zeilenaufbau (C.3); I-2 die Wahl ist das zuletzt ausdrücklich gesetzte Paket (Kartenknopf, A4-Zeile, Paketfeld;
Gesprächsweg setzt zurück), nie das zuletzt angesehene: erweitert E-3 um zwei ausdrückliche Handlungen, erfüllt fb-08; I-3 Zustand
„gesendet“; I-4, I-5 Vorschau und Beispielfarbe (C.4); I-6 Schreibtisch (G); I-7 unter 352 px ohne Vorschau; I-8 kein Ring „Frage
stellen“ (Unentschlossene: Gesprächsweg in 04.3, Kopf-Ring). Ohne Empfehlung (EA O-5) gibt es vor einer Wahl keine Cream.

**Freigaben**

- GEST:447 (Abschnittsfolge endet mit Wissen und Quellen): Die Seite endet mit dem Abschluss. **Abweichung von bestehender Regel – Freigabe
  durch den Inhaber nötig.** Begründung: Ende mit Handlung (EA H-D7; PA 1.9).
- GEST:38-39 (Katalog 1, Blöcke erscheinen 8 px aufwärts): Der Abschluss erscheint ohne Auftritt, auch ohne Deckkraft-Einblenden (K-6;
  DS-AB-8). **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Begründung: keine Bewegung neben Preis und Knopf,
  ein bewegter Träger je Ansicht, ohne JavaScript sichtbar (DG-AB-2, E-13).
- GEST:452, :456 und DG T11 (Cream am empfohlenen Paket): Cream an der gewählten Zeile. **Abweichung von bestehender Regel – Freigabe durch
  den Inhaber nötig.** Begründung: wie fb-06 J-AB-8, Folge der Absicht (E-3).
- GEST:24 und GEST:93 (`--muted` nur für Labels und Nebenzeilen; `ghost` mit 2-px-Rand, gebaut in `--line2`, GC:58): Ring-Zeilen mit
  innerer Kontur `--muted`, Hover `--text`, Druck `--surface2` (K-1; DS-AB-10). **Abweichung von bestehender Regel – Freigabe durch den
  Inhaber nötig.** Begründung: Die Kontur ist die einzige Grenze des Knopfs und braucht 3 : 1 (WCAG 1.4.11; DNA-B Regel 12; DG-E-10); gilt
  für jeden Ring der Website. Bis zur Freigabe bleibt `--line2` über das Token umschaltbar (11.10.1).
- GC:15, :65, :66 (Cream hellt beim Überfahren auf Weiß `--primary-hover` auf; Druck `scale(.98)`): Hover als innere 2-px-Kontur
  `--on-primary` 24 %, Druck Füllung `--primary-druck` (#e2e1db) sofort, keine Deckkraftänderung, keine Skalierung (K-2; DS-AB-3, neuer
  Wert DS-AB-7). **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.** Begründung: Hover ist überall Kontur (DG 2.4.1),
  Weiß wäre ein Füllungswechsel und damit der Kanal von „aktiv“; Bedienschicht formstabil (SG 10.7/3). Rückfall `--primary-hover` (DS-H-3).
- Ohne Freigabe: Ring-Zeilen ohne Pfeilkreis und ohne Chevron; der gefüllte Pfeilkreis 28 px bleibt das Zeichen der Cream (K-31).
- Offen: DG-E-6 (13 oder 15 px für Zeile 2; bei 15 px passen „Empfohlen“ und Einrichtung nicht mehr in 170 px, dann gilt der Rückfall von
  A4-H3); Beispielfarbe `#0071e3` gemeinsam mit fb-06 bestätigen.

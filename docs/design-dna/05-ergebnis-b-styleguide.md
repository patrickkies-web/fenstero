# Ergebnis B – Reproduzierbarer Design-Styleguide

[← Übersicht](README.md)

Arbeitsfassung des technischen Styleguides. Kapitel 6 ist nach Fachgebieten gegliedert; Ergebnis B folgt dem Arbeitsablauf (Regeln, Ebenenaufbau, Bausteine, Dialekte, Tokens, Bewegung, Ablauf, Abnahme), damit ein neuer Bildschirm Schritt für Schritt entsteht. Es fügt der DNA nichts hinzu und lockert nichts. Alle Umsetzungswerte stammen aus 10.9, Zählungen und Clustermediane aus Kapitel 4 und 5; weicht ein Wert ab, gilt 10.9.

**Kennzeichnung.** *Beobachtet* steht nur mit Referenz („Ref 03“) und Zählung („12 von 15“); Proportionen sind geschätzt, weil 9 von 15 Quellen perspektivisch verzerrt sind. *Vorschlag* sind Umsetzungswerte (*abgeleitet*: aus geschätzten Verhältnissen gerundet; *Neuentwurf*: ohne Beleg). *Neuentwurf (nicht beobachtet)* kennzeichnet jedes Zeitverhalten. *Norm* meint WCAG 2.2 AA und Core Web Vitals. Regelmarken wie in Kapitel 6: **[Pflicht]**, **[Variabel]** (Stellschraube mit belegtem Spielraum), **[Optional]** (Signature-Effekt mit Bedingung).

**Geltung.** Belegt sind erste Bildschirme in der Desktopansicht; Mobilfassung (0 von 15), Folgeabschnitte und Bewegung sind Ableitung oder Neuentwurf. Farbe erscheint nur als Rolle (Grund, Text, Akzent, Glaston, Schattenton) und als Funktion (Anteil, Kontrast, Rang); Farbwerte, Schriften und Motive liefert eine austauschbare Markenschicht (B.5).

## B.1 Die Regeln auf einen Blick

Alle zwölf Regeln sind [Pflicht], und zwar im Umfang, den der Ansichtstyp festlegt (unter der Liste); in Klammern die Herkunft.

1. **Stapel.** Jede Ansicht ist ein eindeutiger Stapel aus drei bis sechs Ebenen (Grund, optional Kulisse, genau ein Fokusträger, Bedienschicht), und jedes Element gehört genau einer Ebene an (Nr. 2; 15 von 15).
2. **Verdeckung.** Die Tiefe ist an mindestens einer sichtbaren Verdeckung ablesbar, ersatzweise an der Bildoptik, nie an einem tragenden Schlagschatten (Nr. 2, 6; 12 von 15).
3. **Flache Bedienschicht.** Text und Bedienelemente liegen als echte DOM-Elemente frontal und unverzerrt über dem Bild, ohne opakes Eigenmaterial, ohne leuchtende Fläche und ohne Bewegung über Zustandswechsel hinaus; ausgenommen sind direkte Manipulation und das plattformübliche Sheet nach B.6 (Nr. 1, 9, 10; 15 von 15).
4. **Linie und Anker.** Text und Bedienelemente fluchten auf einer Achse oder gemeinsamen Kante, und genau ein Fixationsanker trägt den einzigen Fokusreiz (Nr. 3; Linie 15 von 15, einzigartiger Reiz 10 von 15).
5. **Luft.** Mindestens 33 % des ersten Bildschirms bleiben frei von Text, Bedienelementen und dominanten Motivteilen, Ziel 40–60 % (Nr. 8; 12 von 15).
6. **Sprung.** Das Hauptelement ist bei jeder Breite mindestens dreimal so groß wie die Bedienschrift, ohne Obergrenze (gemessen zur Versalhöhe der Bedienschrift: bei Schrift die Versalhöhe, bei einem Objekt die Objekthöhe, bei einer Szene die Höhe des Ankers in der Szene), dazwischen steht höchstens eine Headline, insgesamt gibt es höchstens drei Größenstufen (Nr. 7; 12 von 15).
7. **Ein Raum.** Das Hauptbild ist kantenlos oder ein für die Bedienschicht komponierter Container, und Text liegt ohne deckende Box darauf (Nr. 4; 13 von 15).
8. **Eine Formfamilie.** Die Bedienschicht spricht Vollrundung oder radienlos-rechtwinklig, mit höchstens vier Radien-Tokens und höchstens einem Formbruch je Ansicht (Nr. 5; 13 von 13 auswertbaren).
9. **Ruhiger Grund.** Der Grund hat höchstens ein Helligkeitszentrum, und zwar hinter dem Anker, höchstens drei Verlaufszonen und kein Muster unter Lesetext (Nr. 11; stark in 0 von 15).
10. **Unverdeckt und scharf.** Verdeckung trifft nur Bild, Kulisse und Inhaltsflächen; Navigation, Hauptaktion, Lesetext und Fokus bleiben unverdeckt, Fokusträger und Schrift scharf (10.1, Regel 6; 10.3, Regel 4).
11. **Bewegung im Motiv.** Bewegt sich etwas, dann höchstens ein Träger im Motiv, und jeder Ruhezustand einschließlich der Fassung „weniger Bewegung“ trägt als Standbild die volle Komposition (10.7, Regeln 4, 6, 7).
12. **Mindestanforderungen zuerst.** Text erreicht 4,5:1 (groß 3:1) gegen die ungünstigste Stelle, Fokus und Konturen 3:1, Ziele mindestens 24 × 24 px, ab 360 px gilt eine eigene Komposition, die Budgets aus 10.8 gelten; im Konflikt weicht der Effekt (10.10, Nr. 15–20).

**Ansichtstypen** (wie Kapitel 6, „Wofür er gilt“, und Ergebnis C; Neuentwurf nach dem Praxistest). Jeder Bildschirm und Abschnitt erhält genau einen Typ. Die DNA ist nur an Bühnen belegt; die Einteilung lockert sie deshalb nicht, sondern begrenzt ihren Geltungsbereich.

- **Bühnenansicht** (Hero, Start, Detail, Folgeabschnitt mit Bühne): alle zwölf Regeln.
- **Arbeitsansicht** (Liste, Suche, Formular, Einstellungen, Textabschnitt ohne Bühne): Pflicht sind Regel 3 und 7–12, von Regel 4 die Linie und von Regel 2 der Verzicht auf tragende Schlagschatten. Stapel (1), sichtbare Verdeckung (2), der eine Anker (4), Luft (5), Sprung (6) und die Fläche des Fokusträgers sind Ziel, nicht Pflicht. Listen gleichrangiger Zeilen sind erlaubt; zeitkritische Inhalte (etwa eine Frist) gehen dem Anker vor und stehen ohne Scrollen.
- **Vorübergehender Zustand** (Panel, Sheet, Dialog, offene Tastatur, Laden, Leer, Fehler): Pflicht sind Regel 3, 8, 11 und 12 und von Regel 2 der Verzicht auf tragende Schlagschatten.

In jedem Typ gilt von jedem Einmal-Element (10.9) höchstens eines. Die Ausschlüsse aus 10.10 gelten, soweit sie die verbindlichen Regeln des Typs betreffen. In der Abnahme (B.8) wird ein Ziel mitgeprüft; dort genügt ein begründetes Nein.

## B.2 Aufbau eines Bildschirms

Gebaut wird von hinten nach vorn. Die Bühne ist eine Rasterzelle, in der alle Ebenen übereinanderliegen. Die Reihenfolge ist belegt (Grund → Schrift → Freisteller → Bedienschicht in Ref 03, 04, 05, 07, 13, 15), die Z-Zahlen sind Neuentwurf. Das DOM folgt der Lesefolge, nicht der Stapelfolge. Gezählt werden die sichtbaren Bildebenen (Grund, Kulisse, Motiv, Vordergrund) plus die Bedienschicht als eine Ebene: Navigation und Overlays gehören zur Bedienschicht, Nebenkörper zur Motivebene, Karten unter dem Motiv zählen als eigene Ebene, Scrim und Lichtraum zählen nicht mit.

| Z | Ebene | Funktion | Mittel | Werte (Vorschlag, 10.9) | Belege |
|---|---|---|---|---|---|
| 0 | Grund | trägt, ordnet sich unter; als Lichtraum mit einem Zentrum hinter dem Anker | Vollton, Verlauf (keiner, linear, radial, zoniert), Bild- oder 3D-Umgebung; optional Haarlinienraster | Intensität ≤ 2 (Skala 0–4); 1 Helligkeitszentrum; ≤ 3 Verlaufsstopps; Lichthof 1–1,5 × Breite des Fokusträgers; Raster 1 px, ≤ 1,3:1; Dithering ± 1–2 von 255 Tonwerten, eingebacken | ruhig 11 von 15; Lichtraum Ref 03, 09, 12, 15; Raster Ref 01, 11 |
| 5 | Inhaltsflächen (optional) | Karten, die der Fokusträger überdecken darf; eigene Ebene unter Kulisse und Motiv, nicht Teil der Bedienschicht | Karte oder Kartenreihe als Träger | Bedienziele und Fokusrahmen auf der Karte bleiben unverdeckt; Rahmenbruch: Körper ≤ 10 %, schmale Teile ≤ 20 % der Kartenhöhe | Ref 05 (Karte → Schriftzug → Leuchte), Ref 08 (Karten → Zitrone → Großschrift) |
| 10 | Kulisse (optional) | zweite Tiefenebene; als Raumschrift Ausdrucksträger | ein Wort als Live-Text; gestaffelte Kulissen in Vektor, Foto oder Render | Wort über 75–100 % der Bühnenbreite; Versalhöhe 15–33 % der Bühnenhöhe; ≤ ¼ der Buchstaben wesentlich verdeckt | Raumschrift 7 von 15; Kulissen Ref 04, 06, 15 |
| 20 | Fokusträger | Fixationsanker; trägt Material, Licht, Feindetail | Freisteller (Alphakanal oder Grundgleichheit) oder Kamera-Szene | Objekt 15–35 %, Szene 60–100 % der Fläche; Haupt- zu Nebenkörper ≥ 3 × Höhe oder einziger Fokusreiz | Freisteller als Fokus 7 von 15; plastischer Körper 11 von 15 |
| 25 | Vordergrund (optional) | rahmt, verankert, staffelt | Repoussoir, Dunst, Überdeckung des Objektfußes | Randstreifen ≤ 25 % der Höhe oder Breite, nie über Text | Repoussoir Ref 02, 06, 13, 14, 15 |
| 28 | Scrim (optional) | Lesehilfe; eigene Stufe zwischen Bild und Text, zählt bei der Ebenenzahl nicht mit | kantenloser Verlauf | 35–50 % der Bildbreite, Startdeckkraft 40–70 %; Parallax 1,0 wie der Text | Ref 02 |
| 30 | Bedienschicht | lesen und handeln | Lesestapel, Handlungsaufrufe, Karten (überdeckbare auf 5), optional Glas | Lesezone 25–42 % der Breite; Textfläche ≤ 15 %; ≤ 40 Wörter | frontal 15 von 15 |
| 40 | Navigation, Overlays | orientieren; Menüs, Dialoge | Kopfzeile in schmaler Randzone | Kopfzeile ≤ 8 % der Viewporthöhe; die Zielgröße geht vor | Ref 03, 12, 14; Regel Ref 04 |

**Was die Tabelle nicht sagt.**

- **Grund.** Die Figur-Grund-Trennung folgt dem Grundton: auf heller Fläche Begleitschatten oder Kantensaum, auf dunkler Fläche Licht, nie Schatten (10.4, Regel 7). Der Lichtraum endet, wo Lesetext unter 4,5:1 fiele.
- **Kulisse.** Nur mit plastischem Gegenüber (7 von 7 Raumschriften bei D7 ≥ 2). Unter 3:1 ist sie rein dekorativ (`aria-hidden="true"`) und ihr Inhalt steht zusätzlich als Text da. Ausblenden über `mask-image`, nie über `filter: blur()`. Steht die Schrift vor dem Objekt (Ref 08), tauschen Kulisse und Motiv die Stufen; überdeckbare Karten bleiben auf 5 unter beiden.
- **Fokusträger.** Verankert ohne Kontaktschatten (7 von 15). Er darf vor Karten und Kulissenschrift treten (Ref 05, 08), nie vor Navigation, Hauptaktion, Lesetext oder Fokus; überdeckte Karten liegen dann auf Stufe 5. Er wird vorrangig geladen (`fetchpriority="high"`, feste Abmessungen).
- **Bedienschicht und Navigation.** Lesestapel und Bedienelemente stehen neben dem Anker, nie auf ihm; die Navigationszone bleibt frei von Kulissenschrift und Objekt (Regel Ref 04) und steht bei Übergängen still (Ref 04/07).

**Rahmenmaße (Vorschlag).** Seitenrand `clamp(1rem, 5vw, 6rem)`, unter 640 px 16 oder 20 px (Startwert 20 px, auf der 4-px-Basis). Raster mit 12 Spalten ab 1024 px, 8 ab 640 px, 4 darunter, Spaltenabstand 16–32 px. Abstände auf Basis 4 px im Verhältnis innerhalb einer Gruppe : zwischen Gruppen : zwischen Zonen von etwa 1 : 3 : 6 und mehr (z. B. 8 / 24 / 48–128 px), keine gleichmäßig gestufte Skala. Abschnittsabstand `clamp(4rem, 2rem + 8vw, 10rem)`. Fortsetzungssignal: Randanschnitt oder Rahmenbruch (8 von 15) oder eine Folgesektion, die 8–25 % der Viewporthöhe anschneidet (Ref 12).

```css
.buehne { display: grid; isolation: isolate; overflow: clip; container-type: inline-size; }
.buehne > * { grid-area: 1 / 1; }
.grund       { z-index: var(--z-grund); }
.inhalt      { z-index: var(--z-inhalt); }
.kulisse     { z-index: var(--z-kulisse);     pointer-events: none; }
.motiv       { z-index: var(--z-motiv);       pointer-events: none; }
.vordergrund { z-index: var(--z-vordergrund); pointer-events: none; }
.scrim       { z-index: var(--z-scrim);       pointer-events: none; }
.ui          { z-index: var(--z-ui); }
.kopf        { z-index: var(--z-overlay); }
```

## B.3 Bausteine

Aufgenommen ist nur, was mindestens eine Referenz zeigt. Belegt sind nur statische Zustände; jedes Zeitverhalten ist Neuentwurf (nicht beobachtet).

**Gemeinsame Zustandsregeln** für jeden bedienbaren Baustein:

- **Kanäle.** Je Produkt ein Kanal für „aktiv“ und einer für Hover, überall gleich. Statisch belegt sind Deckkraft (Ref 02), Glas gegen opak (Ref 03), Sättigung (Ref 12) und Füllung gegen Kontur (Ref 14); Rang und Zustand ohne Zusatzfarbe in mindestens 7 von 15.
- **Fokus.** Formfolgende Kontur von mindestens 2 px mit 3:1 gegen beide Untergründe, unverdeckt, nie Schein allein (Norm; in 0 von 15 sichtbar).
- **Zeit.** 160 ms (120–200 ms) mit `--kurve-ein`; nur Deckkraft, Sättigung, Farbe, Füllung, Kontur. Keine Skalierung, auch nicht beim Drücken, kein Versatz, kein Schatten, keine Verformung, kein Überschwingen.
- **Ziel und Signal.** Trefferfläche mindestens 24 × 24 px, empfohlen 44 × 44 px. Farbe ist nie einziges Signal, eine zweite Akzentfarbe gibt es nicht. Einzige Ausnahme ist eine Signalfarbe nur für Fehler und Warnung (10.10, Nr. 5): Sie erscheint nur im betroffenen Zustand, nie in der Ruhekomposition, immer zusammen mit Symbol und Text und mit mindestens 4,5:1. Deaktiviert und Laden sind nicht belegt; sie nutzen denselben Kanal und verformen nichts.

### B.3.1 Kulissenwort (Raumschrift) [Variabel]

- **Zweck.** Tiefenebene und Ausdrucksträger: Das Wort wird Kulisse, der Fokusträger steht davor.
- **Aufbau.** Ein Wort als Live-Text in Stufe 10; das Objekt verdeckt Binnenbuchstaben oder Buchstabenteile; Anschnitt per `overflow: clip` an der Bühne.
- **Werte.** Wort über 75–100 % der Bühnenbreite: Grad = Zielbreite ÷ Wortbreite in em, etwa `max(4rem, calc(0.85 * 100cqi / 4.5))` bei 4,5 em Wortbreite; Versalhöhe 15–33 % der Bühnenhöhe; Zeilenhöhe 0,8–1,0; Kulisse zu Headline mindestens 1,5-fach, typisch 2–8-fach. Höchstens etwa ¼ der Buchstaben wesentlich verdeckt, erster und letzter höchstens teilweise, an der Unterkante höchstens das untere Viertel der Versalhöhe; Randanschnitt nur am Wortende, höchstens ein Glyph teilweise.
- **Zustände.** Keine; ausgeblendet wird über Deckkraft (Ref 03, 13).
- **Varianten.** Objekt vor Schrift (Ref 03, 04, 05, 07, 13, 15) oder Schrift vor Objekt (Ref 08); Laufband mit beidseitigem Anschnitt (Ref 08); Bild-Wort-Ergänzung (Ref 03, 05, 07, 08); Punze als Bildfenster (Ref 15). Mobil (Neuentwurf): 90–100 % der Breite oder einseitig randabfallend.
- **Belege.** Ref 03, 04, 05, 07, 08, 13, 15 (7 von 15); weichgezeichnet in 0 von 7.
- **Zerstört durch.** Raumschrift ohne plastisches Gegenüber; ein unlesbar verdecktes oder angeschnittenes Wort; Weichzeichnung; Grade nur in `vw`; horizontalen Seitenscroll.

### B.3.2 Freisteller als Fokusträger (Vitrine) [Variabel]

- **Zweck.** Einziger Körper der Fläche; Material, Licht und Detail sitzen nur hier.
- **Aufbau.** Asset mit Alphakanal (AVIF, Rückfall WebP, per `<picture>`) oder auf exakt dem Seitengrund gerendert; Kanten mit Farbdekontamination exportiert.
- **Werte.** Fläche 15–35 %; Alpha-Übergangszone 1–2 px ohne Farbsaum; bei Grundgleichheit ΔE00 ≤ 1; gerichteter Auslauf über das untere Viertel bis Drittel der Objekthöhe; ≤ 5 Oberflächen; ein dominanter Leuchtkern, weitere höchstens halb so hell; Rahmenbruch: Körper ≤ 10 %, schmale Teile ≤ 20 % der Containerhöhe, an genau einer Kante. Asset ≤ 200 KB mobil, ≤ 400 KB Desktop, bis 2 × Darstellungsbreite in 3–4 `srcset`-Stufen.
- **Zustände.** Statisch; Bewegung nur als Motivbewegung (B.6).
- **Varianten.** Verankerung über Anschnitt (Ref 07), Überdeckung durch die Folgesektion (Ref 12), defokussierten Vordergrund (Ref 13), Levitationsklammer (Ref 09), Grundgleichheit (Ref 07, 10) oder Lichtsaum (Ref 08); weicher Objektschatten nur auf hellem Grund (Ref 05); Explosionsansicht mit Annotation (Ref 10).
- **Belege.** Freisteller zwischen Schrift- und UI-Ebene in Ref 03, 04, 05, 07, 08; Vitrine in Ref 05, 07, 08, 09, 10, 12.
- **Zerstört durch.** Rest des Aufnahmegrunds als Saum oder Halo; sichtbaren Grundsprung; tragenden Schlagschatten; einen zweiten gleichrangigen Körper; einen Render der Stufe 4 ohne gestaltetes Licht.

### B.3.3 Kamera-Szene [Optional]

- **Zweck.** Raum statt Objekt: Die Szene ist Bühne und Fokusträger zugleich.
- **Aufbau.** Vollflächiges Bild, Video oder Echtzeitszene mit virtueller Kamera; darüber eine HTML-Bedienschicht als flächenlose Rand-UI oder in einer freigehaltenen Textzone.
- **Werte.** Fläche 60–100 %, Textzone im Bild frei; vertikales Sichtfeld 15–40° (etwa 33–90 mm Kleinbild); in Achsenentwürfen Kameraachse auf der Layoutachse; 5–6 Ebenen nur bei eindeutiger Reihenfolge; fernste Ebene höchstens etwa halber Kontrast der Fokusebene.
- **Zustände.** Keine in der UI; Kamerafahrt ist Neuentwurf (B.6).
- **Varianten.** Dunkle Lichtbühne (Ref 09, 12), Raum statt Objekt (Ref 14, 15), Low-Key-Szene mit Leuchtinseln (Ref 15), Glas über der Szene (Ref 12, 14). Mobil eigener Hochformatausschnitt, der die Textzone freihält (Neuentwurf).
- **Belege.** Ref 09, 12, 14, 15 (4 von 15); Raumszene als Hauptmittel Ref 14, 15.
- **Zerstört durch.** Eine Kamera, die die Textzone verbaut; extreme Optik; fluide Formen (Kamera-Szenen sind formstarr, ρ D14 + D15 = −0,56); Partikel unter Lesetext; einen Canvas als LCP-Element.

### B.3.4 Bildpanel im gerundeten Container [Optional]

- **Zweck.** Bild als Bühne, wenn eine kantenlose Fassung nicht passt.
- **Aufbau.** Container mit `--radius-l`, `overflow: clip`, `object-fit: cover`, `object-position` je Breakpoint; Scrim zwischen Bild und Text; Navigation auf dem Bild (Ref 02) oder außerhalb auf dem Seitengrund (Ref 14).
- **Werte.** `--radius-l` 24–32 px, unter 640 px 16–20 px; Scrim 35–50 % der Bildbreite, kantenlos, Startdeckkraft 40–70 %, maßgeblich ist der gemessene Kontrast.
- **Zustände.** Keine.
- **Varianten.** Fotografische Schärfentiefe als Tiefenmittel (Ref 02); Kamerastandpunkt mit freier Bodenzone statt Scrim (Ref 14).
- **Belege.** Ref 02, 14 (2 von 15).
- **Zerstört durch.** Ein Bild ohne komponierte Textzone; eine deckende Textbox; einen Scrim mit harter Kante; einen Hochformatzuschnitt, der das Motiv unter den Text schiebt.

### B.3.5 Kopfzeile und Navigation [Pflicht für die Lage, Variabel in der Form]

- **Zweck.** Orientierung, die ruhig bleibt.
- **Aufbau.** Schmaler Streifen mit Wortmarke, wenigen Einträgen und höchstens einem Handlungsaufruf.
- **Werte.** Höhe ≤ 8 % der Viewporthöhe; Bedienschrift ≥ 14 px und ≥ Fließtext ÷ 1,25; Versal-Mikrolabel mit Laufweite +0,06 bis +0,12 em.
- **Zustände.** Aktiver Eintrag über den Produktkanal: deckend gegen halbtransparent (Ref 02), Kontur (Ref 12), Füllung gegen Kontur (Ref 14), dezente Pillenmarkierung (Ref 03); ohne sichtbare Markierung (Ref 15) trägt `aria-current` den Zustand.
- **Varianten.** Einzelne Pillen (Ref 02, 03, 12, 14); flächenlose Textnavigation (Ref 08, in Versalien Ref 15); radienlos mit Klammernotation „[ 0 ]“ (Ref 10); senkrechte Icon-Leiste (Ref 05; Icons mit sichtbarem Label oder zugänglichem Namen).
- **Belege.** Kopfzeile etwa 6 % der Fläche (Ref 03), etwa 5 % der Höhe (Ref 12), unter einem Zehntel (Ref 14); Navigation unter 3 % (Ref 04).
- **Zerstört durch.** Kulissenschrift oder Objekt in der Navigationszone; eine Kopfzeile, die beim Szenenwechsel springt; Icons ohne zugänglichen Namen; Menüs nur per Hover.

### B.3.6 Lesestapel [Pflicht für die Lage, Variabel im Satz]

- **Zweck.** Kernaussage und Handlung in kurzer Folge.
- **Aufbau.** „Versprechen, Begründung, Aktion, Beleg“ (Regel Ref 02): Headline, Subline, ein primärer und höchstens ein sekundärer Handlungsaufruf, optional ein Beleg; neben dem Anker an der Ordnungslinie.
- **Werte.** Headline `clamp(calc(2.25 * var(--grad-text)), 1.5rem + 3vw, 4.5rem)`, höchstens 3 Zeilen, Zeilenhöhe 1,05–1,2; Headline zu Fließtext Desktop 3–4,5-fach, mobil ≥ 2,25-fach; Headline aus Inhaltsdaten (Titel, Namen) bis 5 Zeilen oder einmalig ≥ 1,75-fach, eine Größenstufe, nie gekürzt oder abgeschnitten; Fließtext 16–18 px, Zeilenhöhe 1,5–1,6, 45–75 Zeichen, unter 640 px mindestens 35; Spreizung unterhalb der Headline ≤ 1,25-fach; höchstens etwa 40 Wörter außerhalb der Navigation; Lesezone 25–42 % der Breite, mobil volle Inhaltsbreite.
- **Zustände.** Keine; Text bewegt sich nicht, solange er gelesen werden soll.
- **Varianten.** Ein-, zwei- oder dreizeilig (Ref 07, 08 / 01, 02, 14 / 10, 12, 15); Treppensatz (Ref 02) mit einer Zweitlinie bei 2–4 % der Breite (abgeleitet aus Ref 11); vom Objekt geteilte Headline (Ref 07), die im DOM eine Überschrift bleibt; Etikett neben dem Objekt (Ref 10, 12, 14).
- **Belege.** Lesezone etwa ¼ (Ref 03) bis 40 % der Breite (Ref 02).
- **Zerstört durch.** Einen Stapel auf dem Anker; eine vierte Größenstufe; eine deckende Box; Text über Partikeln, Raster oder Lichthof ohne freie Bildzone, Scrim, flächenlose Rand-UI oder Luminanzkontrast.

### B.3.7 Handlungsaufruf: Pille, Kreis-Button, Pfeil im Kreis [Variabel]

- **Zweck.** Eine Hauptaktion, eindeutig, ohne mit dem Anker zu konkurrieren.
- **Aufbau.** Pille mit Label; der primäre Aufruf trägt einen eingesetzten Pfeil- oder Chevron-Kreis (Ref 02, 03, 14); Kreis-Button für Einzelaktionen, etwa „↗“ in Karten (Ref 03, 13).
- **Werte.** `--radius-full`; `min-height` ≥ 44 px; Kreisdurchmesser gleich Pillenhöhe (Ref 01); Einzug des Pfeilkreises 4–6 px. Die Akzentrolle sitzt nur hier und am aktiven Zustand, höchstens etwa 5 % der Ansicht. Rang über Deckkraft: primär 100 %, sekundär 10–25 % Füllung, Text in beiden ≥ 4,5:1.
- **Zustände.** Über den Produktkanal; kleine Pfeilkreise erhalten eine vergrößerte Trefferfläche.
- **Varianten.** Radienlos als Haarlinienbox (Ref 10) oder unterstrichener Textlink (Ref 08); Schein als Zustand an genau einem aktiven Element (Ref 13, Ansätze Ref 05, 09): 4–12 px, Deckkraft ≤ 35 %, nie einziges Signal; Formreim mit dem Objekt (Ref 07, 09, 12).
- **Belege.** Pfeil im Kreis 6 von 15 (Ref 02, 03, 05, 07, 13, 14); Vollrundung 11 von 13.
- **Zerstört durch.** Glanz, Relief, Schlagschatten oder flächigen Glow; eine zweite Akzentfarbe; Skalieren beim Drücken; einen Pfeil, der beim Hover wandert; mehr als zwei Handlungsaufrufe.

### B.3.8 Auswahlgruppe: Reiter, Pillenreihe, Avatarreihe [Variabel]

- **Zweck.** Auswahl aus wenigen gleichartigen Optionen; die aktive über einen Kanal.
- **Aufbau.** Reihe gleich hoher Pillen oder Kreise (`50%`, `aspect-ratio: 1`) an der Ordnungslinie, genau eine aktiv.
- **Werte.** Trefferfläche ≥ 44 px; ein Abstand je Reihe; aktive Füllung 100 %, inaktive 10–25 %; Text in beiden Zuständen ≥ 4,5:1.
- **Zustände.** Deckkraft (Ref 02), Kontur (Ref 12, Pille „About“), Füllung gegen Kontur (Ref 14) oder Sättigung (Ref 12: ein Avatar farbig mit hellem Ring, drei entsättigt); dazu `aria-selected` bzw. `aria-current`.
- **Varianten.** Schein-Saum am aktiven Reiter (Ref 13) unter den Bedingungen aus B.3.7.
- **Belege.** Ref 02, 03, 12, 13, 14.
- **Zerstört durch.** Eine größer skalierte aktive Option; Zustand nur über Farbe (WCAG 1.4.1); leuchtende Kacheln (Ref 13, nicht DNA-konform).

### B.3.9 Glaskarte und Glaspanel [Optional]

- **Zweck.** Der UI eine Fläche geben, ohne den Bildraum abzudecken; Glas vermittelt zwischen Motiv und Bedienschicht.
- **Aufbau.** Halbtransparente Füllung im Glaston, `backdrop-filter: blur()`, 1-px-Kante, lichtzugewandt stärker, kein Schatten; Text im Glaselement über dem Filter. Bedingung: mindestens eine Glasfläche direkt über gesättigtem Bildinhalt (Regel Ref 03).
- **Werte.** Unschärfe leicht 8–16 px, stark 24–40 px (mindestens doppelt so groß), ≤ 2 Stufen; Füllung über Bild 15–30 %, unter Kleintext 40–65 % bis 4,5:1; ohne `backdrop-filter` 65–85 % (nicht deckend); deckend 90–100 % nur bei reduzierter Transparenz oder erhöhtem Kontrast; Sättigung 90–100 %; Kante 8–20 % auf dunklem, 40–70 % auf hellem Grund, lichtzugewandt 1,5–2-fach; gleichzeitig ≤ 2 Glasflächen mobil, ≤ 3 am Desktop.
- **Zustände.** Rang über Glas gegen opak (Ref 03: opake Mittelkarte zwischen Glaskarten; Ref 14: Wechsel von Vollton und Glas); der Unschärferadius wird nie animiert.
- **Varianten.** Abgestufte Unschärfe (Ref 12: leicht, wo das Objekt erkennbar bleibt, stark unter Text); Randbrechung und Farbübertrag (Ref 01) nur mit Rückfall auf reinen Blur.
- **Belege.** Glas mit Unschärfe Ref 01, 03, 12, 14 (4 von 15); transluzent ohne belegte Unschärfe zusätzlich Ref 02, 13.
- **Zerstört durch.** Glas, unter dem nirgends sichtbar gefilterter Inhalt liegt; Schatten, Glanz oder Sättigungsanhebung; kontrastarmen Kleintext (Risiko Ref 02, 03, 12); Glas über bewegtem Motiv am Telefon; verformtes Glas.

### B.3.10 Inhaltskarte, Kartenreihe, Kennzahl-Kachel [Variabel; Kennzahl-Kachel Optional]

- **Zweck.** Belege, Projekte und Folgeinhalte als Klein-UI neben dem Anker.
- **Aufbau.** Karte opak und flach oder als Glas, rahmenlos oder mit Haarlinie; Reihe an der Ordnungslinie; Handlung über einen Pfeilkreis.
- **Werte.** Außen `--radius-l` 24–32 px (unter 640 px 16–20 px), innen `--radius-s` 8–12 px, optional `--radius-m` 14–18 px; Außenradius minus Innenabstand ≈ Innenradius; Fuge der geteilten Silhouette 4–8 px; Überlappung 5–15 %; Reihenabstand gleich Spaltenabstand; Kachel 1:1 bis 4:3.
- **Zustände.** Rang über opak gegen Glas (Ref 03) oder Deckkraft; Hover ohne Anheben, Versatz oder Tilt.
- **Varianten.** Geteilte Silhouette mit Einzelradien je Ecke (Ref 05); beidseitig angeschnittene Reihe (Ref 08); diagonal überlappendes Kartenpaar (Ref 11, etwa 10 %); Laschenkarte mit inversem Radius als der eine Formbruch (Ref 03; Inline-SVG oder `mask`, Fokus auf innerem Element, normale Karte als Ersatzform); Kennzahl-Kachel (Ref 03, 13, 14): großer Wert in einer vorhandenen Größenstufe, kleiner als das Hauptelement, Label in Bedienschrift, Punktziffern (Ref 13) nur als feste Rolle einer dritten Familie.
- **Belege.** Karten- oder Kachelraster als Träger in Ref 03, 05, 08, 11, 13, 14 (6 von 15).
- **Zerstört durch.** Elevationsschatten; kissenartige Wölbung (schwache Ausnahme Ref 05); Glow-Kacheln (Ref 13); ein gleichrangiges Kachelfeld ohne Anker (Bento wie Ref 13, 14); einen hochzählenden Kennzahl-Zähler (Bewegung in der UI).

### B.3.11 Objektreihe und Karussell [Variabel]

- **Zweck.** Nebenobjekte zeigen, ohne dem Fokusträger Konkurrenz zu machen.
- **Aufbau.** Reihe untergeordneter Objekte oder Karten in gleichen Abständen; Steuerung über Pfeilkreise oder Chevrons in der Bedienschicht; nativ scrollbar mit `scroll-snap`.
- **Werte.** Hauptkörper ≥ 3 × Höhe der Nebenkörper oder einziger Fokusreiz (Ref 05 rund vierfach; Ref 09 etwa 1,2-fach mit Tonwertumkehr); ein Abstand je Reihe (Ref 05 etwa ⅕ der Kartenbreite).
- **Zustände.** Per Tastatur und Touch bedienbar; Wechsel ohne Feder; kein Selbstlauf über 5 s ohne sichtbare Pause.
- **Varianten.** Frontal über die Kartenfuge (Ref 05); perspektivischer Bogen mit der Kameraachse auf der Layoutachse (Ref 09); angeschnittene Kartenreihe (Ref 08).
- **Belege.** Ref 05, 08, 09.
- **Zerstört durch.** Ein Nebenobjekt mit dem Reiz des Fokusträgers; Chevrons nur per Zeiger (Risiko laut Profil Ref 09); Federphysik.

### B.3.12 Scroll-Hinweis und Kapitelziffern [Optional]

- **Zweck.** Ankündigen, dass die Seite als Szenenfolge weitergeht.
- **Aufbau.** Klein-UI an der Ordnungslinie: kurzer Text mit einer 1-px-Linie, optional eine Ziffernleiste.
- **Werte.** Größe der Bedienschrift, Laufweite +0,06 bis +0,12 em; Haarlinie 1 px; an der Ordnungslinie; ruhend.
- **Zustände.** Klickbare Ziffern sind Ziele ≥ 24 px mit Fokus; ein aktives Kapitel nutzt den Produktkanal (Neuentwurf).
- **Varianten.** Kleine Versalien mit Haarlinie, flächenlos (Ref 15); kurze Aufforderung in einer gerundeten Fläche am Ende der Mittelachse mit dünner Linie (Ref 09); Kapitelziffern 01–04 als Ankündigung einer Szenenfolge (Ref 15).
- **Belege.** Ref 09, 15 (2 von 15).
- **Zerstört durch.** Eine animierte Fortschrittslinie ohne begründete Ausnahme (10.10, Nr. 14); einen Hinweis über Bedienschriftgröße; einen Hinweis statt eines vollständig komponierten ersten Bildschirms.

### B.3.13 Technische Mikroschicht und Annotation [Optional]

- **Zweck.** Technische Präzision belegen, an Objekt oder UI-Kanten.
- **Aufbau.** Haarfeine Linien, Punkte und Bezeichner an Objekt oder UI-Kanten, nie als Fläche.
- **Werte.** Linien 1 px; Raster ≤ 1,3:1, nie unter Fließtext; Monospace nur als feste Rolle einer dritten Familie (Ref 10, 11); Annotationstext ≥ 14 px und 4,5:1.
- **Zustände.** Ein Hotspot mit angedockter Annotation ist Neuentwurf (Hypothese zu Ref 10): ohne neue Farbe, ohne Kippung, per Tastatur erreichbar.
- **Varianten.** Punkt- oder Haarlinienraster (Ref 01, 11); Monospace-Bezeichner (Ref 10, 11); Annotation an einem Objektpunkt und Haarlinienbox mit Klammernotation (Ref 10); Punktringe (Ref 14); Punktziffern (Ref 13); Konstruktionsraster mit Hilfskreis (Ref 01).
- **Belege.** Ref 01, 10, 11, 13, 14 (5 von 15).
- **Zerstört durch.** Flächige statt haarfeiner Ausführung; Einsatz ohne technikbetonten Inhalt; eine Mikroschicht unter Lesetext.

## B.4 Stilvarianten

Die Stilcluster sind Dialekte derselben Konstruktion, keine getrennten Stile (A und B verschmelzen bei 0,77, kaum später als Ref 15 in B aufgenommen wird, 0,72; in der rechnerisch gleichwertigen zweiten Lösung mit Ref 13 in B bei 0,79 gegen 0,69). Ein Dialekt stellt mehrere Stellschrauben gemeinsam ein und rechtfertigt keine Abweichung von B.1. Die Zahlen sind Clustermediane auf der Skala 0–4 und dienen als Intensitätsziel.

| Stellschraube | A – Typo-Bild-Sandwich | B – Plastischer Hauptdarsteller im Licht | C – Flache Lösung |
|---|---|---|---|
| Referenzen | Ref 03, 04, 07, 08, 13 (4 Designs; Ref 13 rechnerisch nicht eindeutig, auch B möglich) | Ref 05, 09, 10, 12, 14, 15 | Ref 02, 06, 11 |
| Ausdrucksträger | Raumschrift | Objekt oder Szene im Licht | Bildoptik oder Kulissenschichtung |
| Schrift (D18) | 3: Riesenwort als Ebene, mit dem Freisteller verschränkt | 1,5: Etikett neben (Ref 10, 12, 14) oder auf dem Objekt (Ref 09); Raumschrift nur Ref 05, 15 | 1,5: Etikett, etwa im Treppensatz (Ref 02) |
| Plastizität (D7) | 3: Freisteller mittlerer Stufe | 4: Render (6 von 6) | 0,5: Foto oder Vektor |
| Licht (D3) | 2: Studiolicht im Asset | 3: Lichtkern, Lichtraum, Kantenlicht | 1: Tonwert statt Licht |
| Material (D2) | 2: am Freisteller | 3: Hauptträger (Ausnahme Ref 15, matt) | 1: keines |
| Tiefe (D1) | 3: Verdeckung, oft beidseitig | 3: Objekt oder Kamera-Szene | 2: Schärfentiefe (Ref 02), Vektorkulissen (Ref 06), Überlappung (Ref 11) |
| Kamera (D15) | 1: frontal | 2,25: moderate virtuelle Kamera | 1 |
| Bildintegration (D11) | 3: kantenlos, oft Grundgleichheit | 2,5: kantenlos oder gemeinsame Lichtstimmung | 2: Bildpanel (Ref 02), Kulissenbühne (Ref 06) |
| Feindetail (D12) | 1 | 2: am Objekt | 0,5 |
| Maßstabssprung | extrem (Ref 03, 04, 07, 08) | Objekt dominiert, Headline als Etikett | kleinste belegte (Ref 06 rund 3-fach, Ref 02 3–4-fach) |
| Grundton (Tendenz, keine Regel) | überwiegend hell (4 von 5) | überwiegend dunkel (4 von 6) | gemischt |
| Kernbausteine | B.3.1, B.3.2, B.3.10; Glas nur Ref 03 | B.3.2 oder B.3.3, B.3.11, B.3.12; Glas Ref 12, 14 | B.3.4, B.3.6, Kulissenebenen |
| Bewegungsansatz (Neuentwurf) | Schrift- und Objektebene; Szenenwechsel (Aufbau belegt, Ref 04/07) | Körper oder Kamera | Kulissen-Parallax (nur Struktur belegt, Ref 06) |
| Voraussetzung | plastisches Gegenüber (D7 ≥ 2) | Render der Stufe 4 nur mit gestaltetem Licht | das Bildmedium trägt die Staffelung |

**Fundament.** Formsystem (D5), Komposition (D6) und Grund (D13) haben in A, B und C denselben Median (2, 3, 1); kein Dialekt ändert sie. **Teilgruppen von B:** Vitrine (Ref 05, 10), dunkle Lichtbühne (Ref 09, 12), Raum statt Objekt (Ref 14, 15). **Glas als Zusatzmodul:** Ref 01 ist kein Dialekt (keine Website; weicht bei Nr. 4, 6 und 7 ab), liefert aber die Glasschicht, die in A (Ref 03) und B (Ref 12, 14) als Nebenschicht auftritt.

**Mischen.** Belegt sind Sandwich mit Glas (Ref 03), Sandwich mit Vitrine (Ref 05, 07, 08), Vitrine mit Glas und Kamera-Szene (Ref 12), Kamera-Szene mit Sandwich und Kulisse (Ref 15). Vorschlag (10.9): Der Ausdrucksträger liegt mindestens eine Stufe über allen übrigen Mitteln, höchstens ein zweiter steht gleichauf (wie Ref 03, 05, 15). Zielkonflikte (ρ bei n = 15, Hinweise): Raumschrift gegen Material (−0,26); starkes Formsystem gegen Typo-Bühne (−0,38), Formsystem 3 deshalb nur mit konventioneller Headline; fluide Form gegen Kamera-Szene (−0,56); Unschärfe gegen Kamera (−0,26, außer Glas über der Szene wie Ref 12, 14). Budget in jedem Dialekt: Material 1–4, Licht 1–3, Unschärfe 1–3, Grund höchstens 2, Verformung der Bedienschicht 0.

## B.5 Design-Tokens

Drei Schichten wie in 10.9. Die **Markenschicht** liefert Farbwerte als RGB-Tripel, Schriften und Motive; sie ist austauschbar und nicht Teil dieses Styleguides. Die **Rollen- und Basisschicht** hält die Zahlen und Farbrollen, die nur auf die Markenschicht zeigen; Farbton und Deckkraft bleiben getrennt, damit Rangstufen ohne neue Farbwerte entstehen. Die **Komponentenschicht** liest nur Rollen-Tokens; Einzelwerte in Komponenten sind gesperrt. „Ergänzung“ markiert Tokens, die im Block von 10.9 fehlen; ihre Werte liegen in den Bereichen der 10.9-Tabellen.

| Gruppe | Tokens | Startwert | Bereich (10.9) |
|---|---|---|---|
| Farbrollen | `--farbe-grund`, `--farbe-grund-zentrum`, `--farbe-grund-rand`, `--farbe-text`, `--farbe-akzent`, `--glas-ton`, `--kante-ton`, `--schattenton`; `--farbe-signal` (Ergänzung, optional) | aus der Markenschicht | Text ≥ 4,5:1; genau eine Akzentrolle, ≤ etwa 5 % der Ansicht, nur Hauptaktion und aktiver Zustand; Signalfarbe nur für Fehler und Warnung, nie in der Ruhekomposition, immer mit Symbol und Text, ≥ 4,5:1 (10.10, Nr. 5) |
| Abstand | `--abstand-1` … `--abstand-6`; `--rand`; `--abstand-sektion` | .25 / .5 / 1 / 1.5 / 3 / 6 rem; `clamp(1rem, 5vw, 6rem)`, unter 640 px 1.25rem; `clamp(4rem, 2rem + 8vw, 10rem)` | Skala 4–128 px auf Basis 4; Gruppen ≈ 1 : 3 : 6+; Rand unter 640 px 16 oder 20 px |
| Schriftgrad | `--grad-text`, `--grad-ui`, `--grad-headline`, `--grad-kulisse` (Ergänzung) | 1rem; .875rem; `clamp(…)`; `max(…)` | 16–18 px; ≥ 14 px und ≥ Text ÷ 1,25; 36–72 px; 75–100 % der Bühne |
| Zeile, Laufweite (Ergänzung) | `--zeile-text`, `--zeile-headline`, `--zeile-kulisse`, `--laufweite-versal` | 1.55; 1.1; .9; .08em | 1,5–1,6; 1,05–1,2; 0,8–1,0; 0,06–0,12 em |
| Radius | `--radius-full`, `--radius-l`, `--radius-m` (Ergänzung, optional), `--radius-s` | 9999px; 1.75rem (mobil 1.125rem); 1rem; .625rem | ≤ 4 Werte; l 24–32 (16–20) px; m 14–18; s 8–12 |
| Ebene | `--z-grund` … `--z-overlay` | 0 / 5 / 10 / 20 / 25 / 28 / 30 / 40 | Reihenfolge belegt; `--z-inhalt` (5) nur für Karten, die das Motiv überdecken darf (Ref 05, 08) |
| Glas | `--blur-leicht`, `--blur-stark`; `--glas-fuellung`, `--fuellung-text`, `--fuellung-ersatz`, `--fuellung-deckend`; `--fuellung-sekundaer` (Ergänzung) | 12px; 32px; .2; .55; .8; .95; .15 | 8–16; 24–40; 15–30 %; 40–65 %; 65–85 %; 90–100 %; 10–25 % |
| Licht | `--kante-alpha`, `--kante-licht`, `--licht-x`, `--licht-y`, `--schatten-alpha` | .14; .24; 0; 1; .06 | 8–20 % dunkel, 40–70 % hell, lichtzugewandt 1,5–2-fach; eine Richtung; 4–8 % |
| Zugang (Ergänzung) | `--fokus-breite`, `--ziel-min` | 2px; 2.75rem | ≥ 2 px; ≥ 24 px, empfohlen 44 px |
| Zeit | `--dauer-zustand`, `--dauer-panel`, `--dauer-abschnitt`, `--dauer-szene`; `--faktor-aus` (Ergänzung); `--kurve-ein`, `--kurve-aus`, `--kurve-szene` | 160, 240, 400, 700 ms; .75 | 120–200; 200–300; 300–500; 500–900 ms; Austritt etwa ¾; Stützwerte 0–1 |

Elementabhängige Größen rechnet die Komponente: Schattenversatz 10–25 % der Elementhöhe, Weichzeichnung 2–3 × Versatz, Ausdehnung −25 % des Versatzes. Flächenanteile, Größenstufen, Maßstabssprung, Ebenenzahl und Intensitäten sind Prüfmaße ohne Token (B.8).

```css
:root {
  /* Rollen zeigen auf die Markenschicht (RGB-Tripel) */
  --farbe-grund: var(--marke-grund);  --farbe-grund-zentrum: var(--marke-grund-zentrum);
  --farbe-grund-rand: var(--marke-grund-rand);  --farbe-text: var(--marke-text);
  --farbe-akzent: var(--marke-akzent);  --glas-ton: var(--marke-hell);
  --kante-ton: var(--marke-hell);  --schattenton: var(--marke-tief);
  --farbe-signal: var(--marke-signal);   /* optional, nur Fehler und Warnung (10.10, Nr. 5) */

  --abstand-1: .25rem; --abstand-2: .5rem; --abstand-3: 1rem;
  --abstand-4: 1.5rem; --abstand-5: 3rem; --abstand-6: 6rem;
  --rand: clamp(1rem, 5vw, 6rem);  --abstand-sektion: clamp(4rem, 2rem + 8vw, 10rem);

  --grad-text: 1rem;  --grad-ui: .875rem;
  --grad-headline: clamp(calc(2.25 * var(--grad-text)), 1.5rem + 3vw, 4.5rem);
  --grad-kulisse: max(4rem, calc(.85 * 100cqi / 4.5));   /* bei 4,5 em Wortbreite */
  --zeile-text: 1.55; --zeile-headline: 1.1; --zeile-kulisse: .9; --laufweite-versal: .08em;

  --radius-full: 9999px; --radius-l: 1.75rem; --radius-m: 1rem; --radius-s: .625rem;
  --z-grund: 0; --z-inhalt: 5; --z-kulisse: 10; --z-motiv: 20;
  --z-vordergrund: 25; --z-scrim: 28; --z-ui: 30; --z-overlay: 40;

  --blur-leicht: 12px; --blur-stark: 32px; --glas-blur: var(--blur-leicht);
  --glas-fuellung: .2; --fuellung-text: .55; --fuellung-ersatz: .8;
  --fuellung-deckend: .95; --fuellung-sekundaer: .15;
  --kante-alpha: .14; --kante-licht: .24;             /* dunkler Grund; hell .4–.7 */
  --licht-x: 0; --licht-y: 1; --schatten-alpha: .06;  /* Licht von oben */

  --fokus-breite: 2px; --ziel-min: 2.75rem;
  --dauer-zustand: 160ms; --dauer-panel: 240ms; --dauer-abschnitt: 400ms; --dauer-szene: 700ms;
  --faktor-aus: .75;
  --kurve-ein: cubic-bezier(.2, 0, 0, 1);
  --kurve-aus: cubic-bezier(.4, 0, 1, 1);
  --kurve-szene: cubic-bezier(.65, 0, .35, 1);
}
@media (max-width: 639px) { :root { --radius-l: 1.125rem; --rand: 1.25rem; } }
@media (prefers-reduced-motion: reduce) { :root { --dauer-szene: 200ms; } }
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  :root { --blur-leicht: 0px; --blur-stark: 0px;
          --glas-fuellung: var(--fuellung-deckend); --fuellung-text: var(--fuellung-deckend); }
}
```

Schleifen, Parallax und Anheften schalten die Komponenten unter `prefers-reduced-motion: reduce` selbst ab; ein Token beendet keine laufende Animation. Unter `forced-colors: active` bleiben Konturen als Grenzen sichtbar.

## B.6 Bewegung

### Belegt

Auswertbar sind für Animation 4, für Scrollen 5 und für Übergänge 3 von 15 Referenzen, Konsenssicherheit niedrig; Ref 04 und 07 sind ein Design.

- **Ort.** Bewegung zeigt sich nur im Motiv: Doppelkonturen allein an den Dosen (Ref 09), fallende Bohnen mit Bewegungsunschärfe (Ref 07), zerlegte Lettern bei stehender Kopfzeile (Ref 04). Die Bedienschicht bewegt sich in 0 von 4.
- **Szenenwechsel.** Kopfzeile und Headline-Position stehen, Motiv und Riesenwort werden Ebene für Ebene getauscht (Ref 04/07); der stehende Zwischenzustand macht die Schrift unlesbar (Ref 04).
- **Ankündigung.** Scroll-Hinweis mit Haarlinie (Ref 09, 15), Kapitelziffern (Ref 15), statisches Fortsetzungssignal in 8 von 15; Parallax-Gruppe aus sechs Ebenen nur als Struktur (Ref 06).
- **Nicht belegt.** Dauer, Kurve, Weite, Auslöser, Feder, kinetische Schrift, Morphing, bewegter Grund, Echtzeit-3D. Eine Fassung mit reduzierter Bewegung verlangen die Profile Ref 04 und 06.

### Neuentwurf (nicht beobachtet)

Grundsatz: Bedienschicht kurz und klein, Motiv langsam.

| Bewegung | Standard | Kurve | „Weniger Bewegung“ |
|---|---|---|---|
| Zustandswechsel | 160 ms (120–200); Deckkraft, Sättigung, Farbe, Füllung, Kontur | `--kurve-ein` | bleibt |
| Menü, Panel | 240 ms (200–300), Austritt etwa ¾; nur Deckkraft | ein `--kurve-ein`, aus `--kurve-aus` | bleibt (Deckkraft) |
| Sheet (plattformüblich; Ausnahme zu 10.10, Nr. 14) | 240 ms (200–300), Austritt etwa ¾; fährt in der Ebene ein, ohne Feder und Überschwingen | ein `--kurve-ein`, aus `--kurve-aus` | nur Deckkraft |
| Direkte Manipulation (Ziehen, Wischen, Sheet, Karussell mit `scroll-snap`) | folgt dem Finger 1:1 in der Ebene, ohne Kippung, Skalierung, Feder oder Überschwingen; gilt nicht als Bewegung der Bedienschicht | – | bleibt |
| Seitenwechsel (Ausnahme zu 10.10, Nr. 14) | Überblendung 240 ms (200–300); nur der Fokusträger darf als gemeinsames Element gleiten und gleichmäßig skalieren (Bewegung im Motiv), ohne Überschwingen; Kopfzeile und Achse stehen | `--kurve-ein` | Überblendung ≤ 200 ms oder Schnitt |
| Folgeabschnitt einblenden | 400 ms (300–500), nur Deckkraft, einmalig; Inhalt ohne Skript sichtbar | `--kurve-ein` | bleibt (Deckkraft) |
| Szenenwechsel im Motiv | 700 ms (500–900), ohne stehenden Zwischenzustand | `--kurve-szene` | Überblendung ≤ 200 ms oder Schnitt |
| Motivschleife (Schweben, Drehen) | Periode 6–10 s; Schweben ≤ 2 % der Objekthöhe; sichtbare Pause | `--kurve-szene` | Poster, keine Schleife |
| Materialstrom, Partikel | Videoschleife 4–10 s, nie unter Lesetext | – | Poster als Endzustand |
| Kulissen-Parallax | Bildebenen 0,8–1,0 der Scrollgeschwindigkeit, Vordergrund 1,0–1,2; Text, Scrim und UI 1,0; mobil höchstens eine Ebene | an den Scroll gekoppelt | keine |
| Angeheftete Szene, Kamerafahrt | ≤ 1,5 Viewporthöhen, davon ≥ ⅓ Ruhe im Endzustand; mobil keine | an den Scroll gekoppelt | Szenen als Abschnitte im Endzustand |

**Scroll-Szenen nach Dialekt.**

1. **Überdeckung (alle).** Die Folgesektion schneidet 8–25 % der Viewporthöhe an und überdeckt beim nativen Scrollen den Fuß des Fokusträgers (statisch belegt in Ref 12). Nichts wird angeheftet.
2. **Szenenwechsel (A).** Ein IntersectionObserver löst den Tausch aus; Wort und Motiv wechseln gemeinsam per Deckkraft. Kopfzeile, Achse und Lesestapel stehen; jede Szene endet lesbar.
3. **Kamerafahrt oder Objektdrehung (B).** Scrollgekoppelt über CSS `animation-timeline` mit `@supports`, Rückfall per IntersectionObserver; eine Bildfolge nur, wenn Video nicht reicht (≤ 60 Bilder und ≤ 3 MB mobil, ≤ 120 Bilder am Desktop); GSAP ScrollTrigger nur zum Anheften mehrerer Ebenen. Kein Scroll-Hijacking.
4. **Kulissen-Parallax (C und Kulissenbühnen wie Ref 04, 06, 15).** Nur Bildebenen verschieben sich; die Bedienschicht hat keinen Versatz.

**Ruhige Fassung.** Unter `prefers-reduced-motion: reduce` laufen keine Schleifen, kein Parallax, kein Anheften, keine Scroll-Kopplung und kein Versatz; Szenen und Seiten wechseln per Überblendung ≤ 200 ms oder Schnitt, Sheets erscheinen nur über Deckkraft; Farb- und Deckkraftwechsel bleiben. Das ist eine eigene Vorgabe über AA hinaus (Profilregeln Ref 04, 06; WCAG 2.3.3, Stufe AAA). Unabhängig davon hat jede Bewegung über 5 s eine sichtbare Pause, und nichts blitzt öfter als dreimal pro Sekunde (WCAG 2.2.2, 2.3.1).

**Technik.** Erforderlich sind nur CSS-Übergänge und die Abfrage `prefers-reduced-motion`. Motiv, Ebenen und große Flächen animieren nur `transform` und `opacity`, nie `backdrop-filter`, `filter`, Schatten oder Layout-Eigenschaften. Schleifen pausieren außerhalb des Viewports und in verborgenen Tabs; das LCP-Element ist das statische Motiv oder sein Poster.

## B.7 Arbeitsablauf für einen neuen Bildschirm

1. **Auftrag festhalten.** Kernaussage in höchstens drei Headline-Zeilen, eine Hauptaktion, höchstens eine Nebenaktion, höchstens etwa 40 Wörter außerhalb der Navigation.
2. **Dialekt und Ausdrucksträger wählen** (B.4) und die Voraussetzungen prüfen: Raumschrift nur mit plastischem Gegenüber, Render der Stufe 4 nur mit gestaltetem Licht, Glas nur mit gesättigtem Inhalt darunter. Intensitätsziele 0–4 je Mittel notieren.
3. **Ordnungsfigur festlegen.** Achse, Achsenkreuz, Split oder Diagonale; eine primäre Linie, höchstens eine eingerückte Zweitlinie (2–4 % der Breite); Raster und Seitenrand aus B.2 anlegen.
4. **Anker und Fokusreiz bestimmen.** Genau ein Fokusträger und ein Reiz (Größe, Schärfe, Helligkeit, Sättigung, Wärme oder Tonwert), der sonst nirgends vorkommt.
5. **Flächenplan skizzieren.** Frei ≥ 33 % (Ziel 40–60 %), Fokusträger 15–35 % (Szene 60–100 % mit freier Textzone), Lesezone 25–42 % neben dem Anker, Kopfzeile ≤ 8 %, Textfläche ≤ 15 %; Blinzeltest an der Skizze.
6. **Ebenen von hinten nach vorn bauen** (B.2) und ein Ebeneninventar schreiben: Z-Stufe, Inhalt, Funktion; 3–4 Ebenen, 5–6 nur bei eindeutiger Reihenfolge.
7. **Verdeckung setzen.** Mindestens eine sichtbare Verdeckung; Kulissenwort lesbar; nichts Bedienbares und kein Lesetext verdeckt.
8. **Maßstab festlegen.** Höchstens drei Größenstufen; Sprung Hauptelement zu Bedienschrift messen (Versalhöhe zu Versalhöhe bzw. Objekthöhe zu Versalhöhe), mindestens 3-fach bei jeder Breite.
9. **Bausteine einsetzen** (B.3), nur mit Tokens (B.5): eine Formfamilie, höchstens vier Radienwerte, höchstens ein Formbruch.
10. **Licht, Material und Glas einstellen.** Eine Lichtrichtung (`--licht-x`, `--licht-y`); Material nur am Fokusträger oder im Glas; Begleitschatten nur auf heller Fläche; Effekte gegen die Intensitätsziele aus Schritt 2 prüfen.
11. **Zustände festlegen.** Je einen Kanal für „aktiv“ und Hover dokumentieren; Fokuskontur 2 px; Trefferflächen 44 px.
12. **Mobilfassung komponieren** (Neuentwurf). Ab 360 px eigener Bildausschnitt per `<picture>`; Achsenkreuz und Split werden zum senkrechten Stapel (Anker oben, Lesestapel darunter, erster Handlungsaufruf ohne Scrollen sichtbar); Verschränkung neu setzen statt verkleinern (Regel Ref 08); bei Platzmangel entfällt der Effekt, nicht der Negativraum.
13. **Bewegung planen, falls gewünscht** (B.6): erst jedes Standbild fertig, dann genau einen bewegten Träger im Motiv, dann die ruhige Fassung.
14. **Barrierefreiheit herstellen.** Tab-Reihenfolge entlang des Lesestapels; Dekorebenen `aria-hidden="true"` und `pointer-events: none`; verdeckte Wörter vollständig als Text; Kontrast von Hand mit Pipette gegen die ungünstigste Stelle messen, bei Video an Stichbildern etwa alle 0,5 s, in jedem Zuschnitt.
15. **Leistung absichern.** Platz reservieren (`aspect-ratio`, Schriftersatz mit `size-adjust`); Ersatzfassungen prüfen: Stufe 0 (ohne JavaScript, „weniger Bewegung“, `Save-Data`), Stufe 1 (Video, CSS-Scroll-Animation), Stufe 2 (Echtzeit nur nach 10.8, Regel 9).
16. **Abnahme** (B.8) auf 360, 390, 768, 1280 und 1440 px, bei 200 % und 400 % Zoom und auf einem Mittelklasse-Android-Telefon im gedrosselten Mobilnetz.

## B.8 Abnahme-Checkliste

Jede Frage wird mit Ja oder Nein beantwortet; abgenommen ist ein Bildschirm erst, wenn alle mit Ja beantwortet sind. Scheitert eine Mindestanforderung an einem Effekt, weicht der Effekt.

**Komposition**

1. Lässt sich eine Achse oder gemeinsame Kante einzeichnen, auf der Text und Bedienelemente fluchten?
2. Bleibt im Blinzeltest (Graustufen, stark weichgezeichnet) genau ein dominanter Fleck, und ist es der Anker?
3. Sind mindestens 33 % des ersten Bildschirms frei?
4. Ist das Hauptelement bei jeder Prüfbreite mindestens dreimal so groß wie die Bedienschrift, bei höchstens drei Größenstufen?
5. Bleibt der erste Bildschirm bei höchstens drei Headline-Zeilen (aus Inhaltsdaten höchstens fünf), etwa 40 Wörtern und höchstens zwei Handlungsaufrufen?
6. Ist der erste Bildschirm ohne Scrollen vollständig und zeigt am Rand ein Fortsetzungssignal?

**Raum und Bedienschicht**

7. Gehört jedes Element genau einer von drei bis sechs Ebenen in eindeutiger Reihenfolge an?
8. Ist mindestens eine Verdeckung (oder Staffelung durch Bildoptik) sichtbar, ohne tragenden Schlagschatten?
9. Ist die Bedienschicht in jedem Zustand frontal, ohne Eigenmaterial, nicht leuchtend (außer höchstens einem Schein-Saum) und formstabil?
10. Gibt es genau eine Formfamilie, höchstens vier Radienwerte aus Tokens und höchstens einen Formbruch?
11. Hat der Grund höchstens ein Helligkeitszentrum hinter dem Anker und höchstens drei Zonen?
12. Bildet das Hauptbild den Raum, ohne Saum, Halo oder Grundsprung, mit Text ohne deckende Box?
13. Hat die Ansicht höchstens zwei Signature-Effekte, jeden mit erfüllter Bedingung, und liegt bei Glas mindestens eine Glasfläche über gesättigtem Bildinhalt, jede mit Haarkante und ohne Schatten?

**Lesbarkeit und Kontrast**

14. Erreicht jeder bedeutungstragende Text 4,5:1 (ab 24 px oder 18,66 px fett 3:1) gegen die ungünstigste Stelle, in jedem Zuschnitt und jedem Frame?
15. Erreichen Konturen von Bedienelementen und die Fokusanzeige 3:1?
16. Ist kontrastarme Kulissenschrift rein dekorativ, und steht ihr Inhalt zusätzlich als lesbarer Text da?
17. Ist ein verdecktes oder angeschnittenes Kulissenwort ohne Kontext lesbar?
18. Misst Fließtext 16–18 px und Bedienschrift mindestens 14 px, und sind Fixationspunkt und Schrift scharf?

**Bedienung**

19. Ist jede Funktion per Tastatur erreichbar, in der Reihenfolge des Lesestapels?
20. Ist der Fokus eine sichtbare Kontur von mindestens 2 px, die keine Ebene verdeckt?
21. Messen alle Ziele mindestens 24 × 24 px, und hängt kein Zustand allein am Überfahren?
22. Sind Zustände ohne Farbe als einziges Signal erkennbar, bei genau einer Akzentrolle?

**Mobil**

23. Hat die Ansicht ab 360 px eine eigene Komposition mit eigenem Bildausschnitt?
24. Entsteht bis 320 px kein horizontales Scrollen, und bleibt 200 % Textgröße ohne Verlust?
25. Ist der erste Handlungsaufruf bei 360 px ohne Scrollen sichtbar?
26. Sind Anschnitte und Verdeckungen bei 360 px neu geprüft, und liegt nichts Bedienbares außerhalb des Viewports?

**Bewegung und „weniger Bewegung“**

27. Bewegt sich höchstens ein Träger, und ist es das Motiv?
28. Trägt jeder Ruhezustand als Standbild die volle Komposition, auch ohne JavaScript?
29. Schaltet `prefers-reduced-motion: reduce` Schleifen, Parallax, Anheften und Scroll-Kopplung ab und zeigt lesbare Endzustände?
30. Hat jede Bewegung über 5 s eine sichtbare Pause, blitzt nichts öfter als dreimal pro Sekunde, und gibt es keinen stehenden Zwischenzustand mit unlesbarer Schrift?

**Leistung**

31. Liegen LCP ≤ 2,5 s, INP ≤ 200 ms und CLS ≤ 0,1 (75. Perzentil, mobil)?
32. Bleiben Übertragung bis LCP ≤ 350 KB mobil bzw. ≤ 600 KB am Desktop, JavaScript im ersten Bildschirm ≤ 100 KB und das Fokus-Asset ≤ 200 KB mobil bzw. ≤ 400 KB am Desktop?
33. Ist das LCP-Element Text oder Bild, nie Canvas und nie Video ohne Poster?
34. Animieren Motiv und große Flächen nur `transform` und `opacity`, bei höchstens zwei gleichzeitig sichtbaren Blur-Flächen mobil (drei am Desktop)?
35. Ist jedes Verfahren jenseits der Spalte „erforderlich“ der Matrix in 10.8 begründet, und greift bei einem gerissenen Budget die Ersatzfassung?

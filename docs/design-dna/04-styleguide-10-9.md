## 10.9 Technische Designparameter

### Grundsatz

Dieser Abschnitt führt alle Zahlen des Styleguides an einer Stelle zusammen. Gemessen ist keine davon: Die Referenzen sind Standbilder, 9 von 15 Quellen sind perspektivisch verzerrt, 0 von 15 zeigen eine Mobilansicht. Belegt sind Verhältnisse, Reihenfolgen und Obergrenzen, keine Pixel. Jeder Vorschlag ist deshalb ein Startwert, den man am eigenen Bildschirm gegen die Regel prüft, aus der er stammt; maßgeblich ist die Regel, nicht die Zahl. Farbe erscheint nur als Funktion (Anteil, Kontrast, Akzentrolle), nie als Farbton. Kollidiert ein Effektwert mit einer Mindestanforderung (WCAG 2.2 AA, Leistungsbudget), weicht der Effekt. Weicht ein Abschnitt von dieser Sammlung ab, gilt 10.9; die Abschnitte 10.1 bis 10.8 und 10.10 sind auf diesen Stand angeglichen.

**Lesehinweis.** „Beobachtet“ enthält nur Qualitatives oder ausdrücklich geschätzte Verhältnisse mit Referenz; „Näherung“ heißt geschätzt am unverzerrten Bildschirmfoto Ref 01. „Vorschlag“ ist der Umsetzungswert in CSS-Pixeln (px) bzw. rem (1rem = 16 px). In der Spalte „Ableitung“ heißt *abgeleitet*: aus geschätzten Verhältnissen gerundet; *Ableitung*: aus einem Prinzip geschlossen; *Neuentwurf*: ohne Beleg, eigene Entscheidung; *Neuentwurf (nicht beobachtet)*: zeitliches Verhalten, das Standbilder nicht zeigen; *Norm*: WCAG 2.2 oder Core Web Vitals. „Ergänzt in 10.9“ markiert Werte, die nur hier stehen. Die Werte setzen keine besondere Technik voraus; was für einen Effekt erforderlich und was optional ist, regelt die Matrix in 10.8.

### Fläche und Komposition

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Ordnungslinien je Ansicht | eine primäre in 15 von 15; eingerückte Zweitlinie Ref 02, 03, 11 | 1 primäre, höchstens 1 eingerückte | Regeln Ref 03, 11 | 10.1 |
| Einzug der Zweitlinie | etwa 2–3 % der Breite (Ref 11, geschätzt) | 2–4 % der Breite (etwa eine halbe Rasterspalte) | abgeleitet aus Ref 11 | 10.1 |
| Seitenrand | gemeinsame Außenkante bei etwa 7 % der Breite (Ref 11, Folie, geschätzt) | `clamp(1rem, 5vw, 6rem)`: rund 18 px bei 360 px, 5 % am Desktop | Neuentwurf, angelehnt an Ref 11 (etwa 7 %); mobil Neuentwurf; ergänzt in 10.9 | 10.9 |
| Spaltenraster | nicht messbar | 12 Spalten ab 1024 px, 8 ab 640 px, 4 darunter; Spaltenabstand 16–32 px | Neuentwurf | 10.1 |
| Kopfzeile | dünner Streifen: etwa 5 % der Höhe (Ref 12), etwa 6 % der Fläche (Ref 03), unter einem Zehntel (Ref 14), geschätzt | höchstens 8 % der Viewporthöhe; die Zielgröße der Bedienelemente geht vor | abgeleitet aus Ref 03, 12, 14 | 10.1 |
| Breite der Lesezone | etwa ¼ (Ref 03), ⅓ (Ref 15) bis 40 % (Ref 02) der Breite, geschätzt | 25–42 % (3–5 von 12 Spalten); mobil volle Inhaltsbreite | abgeleitet aus Ref 02, 03, 15; mobil Neuentwurf | 10.1 |
| Freie Fläche, erster Bildschirm | 35–40 % (Ref 03), rund 40 % (Ref 12), 40–45 % (Ref 15), über die Hälfte (Ref 07), 55–60 % (Ref 01), 70–75 % (Ref 10), geschätzt | Ziel 40–60 %, mindestens 33 % | Spanne der Belege; Untergrenze Ableitung (Nr. 8) | 10.1, 10.10 |
| Fläche des Fokusträgers (Objekt) | etwa ⅛ (Ref 08), 12–15 % (Ref 10), 20–25 % (Ref 03), ¼ bis knapp ⅓ (Ref 07), geschätzt | 15–35 % | abgeleitet aus Ref 03, 07, 08, 10 | 10.1, 10.6 |
| Fläche einer Szene | rund ⅔ (Ref 14), vollflächig (Ref 15), geschätzt | 60–100 %, Textzone im Bild frei | Ref 14, 15 | 10.6 |
| Textfläche ohne Kulissenschrift | Headline 6–8 % (Ref 10), Headline-Block etwa ein Zwanzigstel (Ref 12), Navigation unter 3 % (Ref 04), geschätzt | höchstens 15 % | Summe aus Ref 04, 10, 12, aufgerundet | 10.1 |
| Textmenge erster Bildschirm | Kernaussage ein- (Ref 07, 08), zwei- (Ref 01, 02, 14) oder dreizeilig (Ref 10, 12, 15); ein bis zwei Handlungsaufrufe | Headline höchstens 3 Zeilen; höchstens etwa 40 Wörter außerhalb der Navigation; 1 primärer, höchstens 1 sekundärer Handlungsaufruf | Zeilenzahl aus den Belegen; Wortzahl Neuentwurf | 10.1 |
| Zeilenlänge Fließtext | nicht messbar | 45–75 Zeichen (`max-width` in `ch`) | Neuentwurf (Konvention) | 10.1 |
| Anschnitt der Folgesektion | im unteren Viertel (Ref 12, geschätzt) | 8–25 % der Viewporthöhe | Ref 12; Untergrenze Neuentwurf | 10.1 |

### Abstände und Überlagerung

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Abstandsskala | nicht messbar | Basis 4 px; Stufen 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px, in rem geführt | Neuentwurf; ergänzt in 10.9 | 10.9 |
| Verhältnis innerhalb einer Gruppe : zwischen Gruppen : zwischen Zonen | kleine Elemente mit viel Abstand (Kopfzone Ref 02); großer Leerraum zwischen Headline und Erklärtext (Ref 10); etwa ein Zehntel der sichtbaren Höhe zwischen Illustration und Headline (Ref 06, geschätzt) | etwa 1 : 3 : 6 und mehr, z. B. 8 / 24 / 48–128 px; keine gleichmäßig gestufte Abstandsskala | Ableitung aus Maßstabssprung (Nr. 7) und Negativraum (Nr. 8); Werte Neuentwurf; ergänzt in 10.9 | 10.9 |
| Abstände in Reihen und Rastern | gleichmäßig: fünf Lagen mit annähernd gleichen Abständen (Ref 10), gleichmäßige Modulabstände (Ref 14), Karussellobjekte im Abstand von etwa ⅕ der Kartenbreite (Ref 05), geschätzt | ein Wert je Reihe aus der Skala; Rasterabstand gleich Spaltenabstand | abgeleitet aus Ref 05, 10, 14; ergänzt in 10.9 | 10.9 |
| Abschnittsabstand | nicht beobachtet (nur erste Bildschirme) | `clamp(4rem, 2rem + 8vw, 10rem)` | Neuentwurf; ergänzt in 10.9 | 10.9 |
| Fuge der geteilten Silhouette | schmal (Ref 05) | 4–8 px | Neuentwurf | 10.5 |
| Einzug des Pfeilkreises in der Pille | eingesetzter Kreis (Ref 02, 03) | 4–6 px | Neuentwurf | 10.5 |
| Überlappung von Flächen | etwa ein Zehntel (Ref 11, geschätzt) | 5–15 % | abgeleitet aus Ref 11 | 10.1 |
| Objektüberstand über eine Containerkante | Körper 4–5 %, Kabel rund ⅕ der Kartenhöhe (Ref 05, geschätzt) | Körper ≤ 10 %, schmale Teile ≤ 20 % der Containerhöhe, an genau einer Kante | Ref 05; Obergrenze Körper Neuentwurf | 10.1, 10.6 |

### Schrift und Größenverhältnisse

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Größenstufen je Ansicht | zwei (Ref 07) oder drei weit gespreizte (Ref 04, 15); Ref 15 zusätzlich mit den Kapitelziffern als Zwischenstufe (Definitionsfrage, 4.4, Frage 1) | 2–3 | Ableitung aus Nr. 7 | 10.1 |
| Hauptelement : Bedienschrift | rund dreifach (Ref 06) bzw. drei- bis vierfach (Ref 02) als kleinste Sprünge; fünf- bis zehnfach (Ref 07); Navigation rund 2 %, Riesenlettern 15–20 % der Höhe (Ref 04); geschätzt | mindestens 3-fach bei jeder Breite, Desktop etwa 5–12-fach; gemessen Versalhöhe zu Versalhöhe (ist das Hauptelement ein Objekt, Objekthöhe zu Versalhöhe; dann gilt nur die Untergrenze) | Ref 02, 04, 06, 07; Obergrenze Neuentwurf; Messregel ergänzt in 10.9 | 10.1, 10.10 |
| Kulissenschrift : Headline | Riesenlettern 15–20 % gegen Headline rund 10 % der Höhe (Ref 04); Wortmarke etwa fünffache Headline-Versalhöhe (Ref 03); Headline ⅐ bis ⅛ der Buchstabenhöhe (Ref 15); geschätzt | mindestens 1,5-fach, typisch 2–8-fach | abgeleitet aus Ref 03, 04, 15; ergänzt in 10.9 | 10.9 |
| Headline : Fließtext | rund dreifach (Ref 06), drei- bis vierfach (Ref 02), vier- bis fünffach (Ref 11), geschätzt | Desktop 3–4,5-fach, mobil mindestens 2,25-fach | Ref 02, 06, 11; mobil Neuentwurf | 10.1 |
| Spreizung unterhalb der Headline | eine sachliche Stufe für alles Funktionale (Regel Ref 07) | kleinster zu größtem Grad höchstens 1,25-fach | Nr. 7; Faktor Neuentwurf | 10.1 |
| Fließtext | nicht messbar | 16–18 px | Neuentwurf | 10.1, 10.10 |
| Bedienschrift und Mikrolabel | Bedienschrift „winzig“; Scroll-Hinweis in kleinen Versalien (Ref 09, 15) | mindestens 14 px und mindestens Fließtext ÷ 1,25; Versal-Mikrolabel mit Laufweite +0,06 bis +0,12 em | Neuentwurf; Laufweite ergänzt in 10.9 | 10.1, 10.10 |
| Headline-Grad | nicht messbar | `clamp(2.25rem, 1.5rem + 3vw, 4.5rem)`, also 36–72 px | Neuentwurf, auf die Verhältnisse oben abgestimmt | 10.1 |
| Grad der Kulissenschrift | ein Wort über ¾ bis fast volle Breite (Ref 03, 05, 15) | Zielbreite 75–100 % der Bühnenbreite ÷ Wortbreite in em, etwa `max(4rem, calc(0.85 * 100cqi / 4.5))` bei 4,5 em Wortbreite | abgeleitet aus Ref 03, 05, 15; Formel Neuentwurf | 10.1, 10.2 |
| Versalhöhe der Raumschrift | 15–20 % (Ref 04), rund ⅕ (Ref 08), rund ⅓ (Ref 15) der Bildschirmhöhe, geschätzt | 15–33 % der Bühnenhöhe (Desktop); mobil 90–100 % der Breite oder einseitig randabfallend | Spanne der Belege; mobil Neuentwurf | 10.2 |
| Zeilenhöhe | nicht messbar | Fließtext 1,5–1,6; Headline 1,05–1,2; Kulissenwort 0,8–1,0 | Neuentwurf; ergänzt in 10.9 | 10.9 |
| Schriftfamilien | Display-Stimme plus sachliche Grotesk (Regel Ref 07); feste Rolle je Gattung: Monospace (Ref 10, 11), Punktziffern (Ref 13) | 1–2; eine dritte nur mit fester, wiederkehrender Rolle | Regeln Ref 07, 11 | 10.1 |
| Verdeckung des Kulissenworts | 1 Buchstabe plus Teile zweier von 8 (Ref 03), Teil eines Buchstabens (Ref 07), 2 von 7 fragmentarisch (Ref 05); Wort lesbar (Regeln Ref 05, 07, 15), Anfang und Ende lesbar (Regel Ref 05) | höchstens etwa ¼ der Buchstaben wesentlich verdeckt; Wortanfang und Wortende bleiben erkennbar, erster und letzter Buchstabe höchstens teilweise verdeckt (z. B. Fuß oder Randpartie); an der Unterkante höchstens das untere Viertel der Versalhöhe | Ref 03, 05, 07, 15; Unterkante Neuentwurf | 10.1, 10.2 |
| Randanschnitt des Kulissenworts | an Viewport- und Bühnenrändern (Ref 04, 08, 15) | nur am Wortende, höchstens ein Glyph teilweise; Ausnahme: das Wort wiederholt sich vollständig (Ref 08) | Ableitung aus Ref 05, 15; Schwelle Neuentwurf | 10.2, 10.5 |

### Ebenen und Tiefe

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Ebenen je Ansicht | drei bis sechs; mindestens drei in 15 von 15; sechs nur Ref 15 | 3–4; 5–6, wenn die Reihenfolge eindeutig bleibt (vorzugsweise in einer Kamera-Szene); mehr als 6 ausgeschlossen | Beleg (5.4, Ref 15); „Kamera-Szene“ Ableitung aus Ref 15; > 6 Ableitung | 10.1, 10.2, 10.10 |
| Stapelfolge (Z-Stufen) | Grund → Schrift → Freisteller → (Vordergrund) → Bedienschicht (Ref 03, 04, 05, 07, 13, 15); Schrift vor Objekt nur Ref 08 | 0 Grund, 10 Kulisse, 20 Motiv, 25 Vordergrund, 30 Bedienschicht, 40 Navigation und Overlays; für Ref-08-Fälle tauschen Kulisse und Motiv | Reihenfolge belegt; Zahlen Neuentwurf | 10.1, 10.2 |
| Sichtbare Verdeckungen | primäres Tiefenmittel in 12 von 15 | mindestens 1 je Ansicht; ersatzweise Bildoptik (Ref 02, 09, 14) | Nr. 2 | 10.2 |
| Schärfestufen | bis drei (Ref 02, 08) | höchstens 3; Fokusträger und Schrift immer scharf | Ref 02, 08 | 10.2, 10.3 |
| Tiefenunschärfe an Begleitelementen | Schärfestaffelung in 5 von 15 (Ref 02, 04, 08, 13, 14); Radien nicht messbar | leicht etwa 0,3–0,6 %, stark etwa 1–2 % der Bühnenbreite; im Asset eingebacken, auf kleinen Ebenen optional `filter: blur()` | Stufen Ref 02, 08; Radien Neuentwurf; ergänzt in 10.9 | 10.9 |
| Atmosphärische Staffelung | Kontrast und Helligkeit nehmen mit der Entfernung ab (Regel Ref 15); Dunst nur Ref 14, 15 | nur in Kamera-Szenen; fernste Ebene höchstens etwa halber Kontrast der Fokusebene | Richtung Ref 15; Wert Neuentwurf; ergänzt in 10.9 | 10.9 |
| Vordergrund (Repoussoir) | unteres Fünftel bis Viertel (Ref 15, geschätzt) | Randstreifen bis 25 % der Höhe oder Breite, nie über Text | Ref 15 | 10.2 |
| Vertikales Sichtfeld der Bildkamera | „moderat“ (Ref 09, 10, 12, 15), nur qualitativ; extreme Optik nicht belegt | 15–40° (etwa 33–90 mm Kleinbild-Brennweite) | Neuentwurf: übersetzt „moderat“ | 10.2 |
| Kameraachse | auf der Layoutachse (Ref 09, 15); Standpunkt hält Textzone frei (Ref 14) | Fluchtpunkt auf der Ordnungslinie, Textzone frei | Beleg | 10.2 |
| Räumliche Transformation der Bedienschicht | 0 von 15 | keine, auch nicht in Zwischenzuständen | Nr. 1 | 10.2, 10.10 |

### Form und Radien

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Formfamilien der Bedienschicht | eine (13 von 13 auswertbaren); Vollrundung 11 von 13, radienlos Ref 10, 15 | genau 1: Vollrundung oder radienlos-rechtwinklig | Nr. 5 | 10.5 |
| Radienwerte | höchstens vier Rundungsstufen (Ref 14) | 3, höchstens 4 einschließlich „voll“, alle als Token | Ableitung aus Ref 14 | 10.5, 10.10 |
| `--radius-full` (Pille, Kapsel, Kreis) | Radius gleich halber Höhe (Ref 01, 02) | `9999px`; Kreis `50%` mit `aspect-ratio: 1` | Ref 01, 02 | 10.5 |
| `--radius-l` (Container, Bilder, Kacheln) | „groß“, nur qualitativ (Ref 02, 03, 08, 12, 13, 14) | 24–32 px Desktop, 16–20 px unter 640 px | Neuentwurf | 10.5 |
| `--radius-m` (optional) | Kachel als eigene Stufe (Ref 14) | 14–18 px | Neuentwurf | 10.5 |
| `--radius-s` (innen, Fugen) | „innen kleiner“ (Ref 05, 08, 11) | 8–12 px | Relation belegt, Wert Neuentwurf | 10.5 |
| Verschachtelung | außen groß, innen kleiner (Ref 05, 08, 11) | Außenradius − Innenabstand ≈ Innenradius; nie Innen- über Außenradius | Neuentwurf | 10.5 |
| Pille und Kreis-Button | Kreis-Button so hoch wie die Pille daneben (Ref 01, geschätzt) | Kreisdurchmesser gleich Pillenhöhe; Trefferfläche ≥ 44 px, mindestens 24 px | Ref 01; Norm WCAG 2.5.8; 44 px Neuentwurf | 10.5 |
| Haarlinie, Kontur | haarfein in 6 von 15 (Ref 01, 03, 10, 11, 12, 14); 1-px-Rahmen (Ref 10, Hypothese) | 1 px; als einzige Begrenzung eines Bedienelements ≥ 3:1 | Ref 10; Norm WCAG 1.4.11 | 10.3, 10.5 |
| Kachelseitenverhältnis | teils nahezu quadratisch (Ref 13, geschätzt) | 1:1 bis 4:3 | Neuentwurf | 10.5 |

### Material, Glas und Transparenz

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Glasflächen mit Unschärfe, gleichzeitig sichtbar | höchstens zwei (Ref 01, 03, 12) | ≤ 2 mobil, ≤ 3 Desktop | 2 belegt; 3 Neuentwurf | 10.3, 10.8 |
| Stufen der Glasunschärfe | zwei (Ref 12) | ≤ 2; die starke mindestens doppelt so groß wie die leichte | Stufenzahl Ref 12; Verhältnis Neuentwurf | 10.3 |
| `--blur-leicht` (Motiv bleibt erkennbar) | Ring als weiche Form erkennbar (Ref 12) | 8–16 px | Neuentwurf | 10.3 |
| `--blur-stark` (Text auf Glas) | nur Farbflecken (Ref 12); feine Linien um etwa 85 % gedämpft (Ref 01, Näherung) | 24–40 px; feine Strukturen unter Text um mindestens 80 % gedämpft | Dämpfung aus Ref 01; Radius Neuentwurf | 10.3 |
| Glasfüllung über Bildinhalt | Aufhellung etwa 20–30 % (Ref 01, Näherung) | 15–30 % Deckkraft | aus Ref 01 | 10.3 |
| Glasfüllung unter Kleintext | dunklere Panelfüllung (Ref 12) | 40–65 %, bis 4,5:1 erreicht ist | Neuentwurf nach WCAG 1.4.3 | 10.3 |
| Ersatzfüllung ohne `backdrop-filter` | nicht beobachtet | 65–85 %, nicht deckend (wie ein Scrim); so hoch, dass Text 4,5:1 ohne Unschärfe erreicht | Neuentwurf; ergänzt in 10.9 | 10.3, 10.8 |
| Deckende Ersatzfüllung | nicht beobachtet | 90–100 %, nur bei reduzierter Transparenz oder erhöhtem Kontrast (Ausnahme zu 10.6, Regel 6, und 10.10, Nr. 7); Text erreicht 4,5:1 ohne Unschärfe | Neuentwurf; ergänzt in 10.9 | 10.3 |
| Sättigung im Glas | leicht entsättigt (Ref 01) | 90–100 %, keine Anhebung | Ref 01 | 10.3 |
| Glaskante, Lichtkante | haarfein, hell, oben stärker (Ref 01, 03, 12, 14) | 1 px; Deckkraft 8–20 % auf dunklem, 40–70 % auf hellem Grund; Oberkante 1,5- bis 2-fach, höchstens 100 % | Richtung Ref 01; Deckkraft Neuentwurf; Faktor Oberkante ergänzt in 10.9 | 10.3, 10.4 |
| Abhebung des Glases vom Grund | etwa 1,05–1,1:1 heller (Ref 01, Näherung) | frei, wenn der Inhalt das Element erkennbar macht; sonst Kante ≥ 3:1 | Ref 01; Norm WCAG 1.4.11 | 10.3 |
| Schatten unter Glas | keiner (Ref 03, 12, 14) | `none` | Nr. 6 | 10.3 |
| Rang über Deckkraft | aktive Pille deckend, inaktive halbtransparent (Ref 02); Glas gegen opak (Ref 03) | Füllung aktiv 100 %, sekundär 10–25 %; Text in beiden Zuständen ≥ 4,5:1 | Prinzip Ref 02; Werte Neuentwurf; ergänzt in 10.9 | 10.7 |
| Hintergrundraster | etwa 1,2:1 (Ref 01, Näherung); Ref 11 | 1 px, ≤ 1,3:1, nie unter Fließtext | Ref 01, 11 | 10.3 |
| Oberflächen an einem Objekt | bis fünf (Ref 10) | ≤ 5, nur am Fokusträger | Ref 10 | 10.3 |
| Korn | 0 von 15 belegt (Kompression verdeckt es) | kein sichtbares Korn; gegen Streifen in Verläufen Dithering ± 1–2 von 255 Tonwerten, eingebacken | Neuentwurf | 10.3 |

### Licht und Schatten

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Schattenstufen je Ansicht | keine Elevation; Schatten nur auf heller Fläche (3 von 3: Ref 01, 05, 11) | 1, nur auf heller Fläche; sonst `none` | Nr. 6; Ableitung | 10.4 |
| Stärke des Begleitschattens | etwa 5–7 Tonwerte dunkler (Ref 01, Näherung) | dunkelste Stelle ≤ etwa 8 von 255 Tonwerten unter dem Umfeld; Startwert 4–8 % Deckkraft im abgedunkelten Grundton | aus Ref 01 | 10.4 |
| Versatz | weit nach unten, stärkste Abdunklung etwa ¼–⅓ der Formhöhe unter der Form (Ref 01, Näherung); gering (Ref 11) | x = 0; y = 10–25 % der Elementhöhe | Ref 01, 11; Werte Neuentwurf | 10.4 |
| Weichzeichnung des Schattens | großer Radius, keine Kontaktkante (Ref 01, 11) | 2–3 × y | Verhältnis aus Ref 01, 11 | 10.4 |
| Ausdehnung (spread) | nicht beobachtet | −25 % von y | Neuentwurf | 10.4 |
| Objektschatten | bis etwa 40 % dunkler als das Umfeld (Ref 05, geschätzt), Einzelfall | Obergrenze; nur im Asset, nur auf hellem Grund | Ref 05 | 10.4, 10.6 |
| Lichtrichtung | je Referenz eine, sonst frei: oben, seitlich, aus dem Motiv, diffus (Konfidenz niedrig) | genau eine je Ansicht; Schatten, Kantensaum und Glanz widersprechen sich nicht | Ableitung aus Ref 01 | 10.4 |
| Helligkeitszentren des Grundes | eines, hinter dem Anker (Ref 03, 09, 12, 15) | 1 | Nr. 11 | 10.4, 10.10 |
| Lichtzonen | höchstens drei (Ref 03, 09, geschätzt) | ≤ 3 Verlaufsstopps | Nr. 11 | 10.4, 10.10 |
| Lichthof | hinter dem Motiv (Ref 03, 12) | 1–1,5 × Breite des Fokusträgers | Neuentwurf | 10.4 |
| Leuchtkerne | einer dominant (Ref 12); mehrere schwächere (Ref 14, 15) | 1; weitere höchstens halb so hell | Ableitung; Wert Neuentwurf | 10.4 |
| Schein als Zustand | Saum am aktiven Reiter (Ref 13); Ansätze Ref 05, 09 | 1 Element; Ausdehnung 4–12 px; Deckkraft ≤ 35 %; nie einziges Zustandssignal | Neuentwurf | 10.4 |

### Bild- und Objektintegration

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Hauptkörper zu Nebenkörper | rund vierfach so hoch (Ref 05); nur etwa 1,2-fach, dafür Tonwertumkehr (Ref 09); geschätzt | ≥ 3 × Höhe oder einziger Fokusreiz | Ref 05, 09 | 10.6 |
| Farbabstand Asset-Grund zu Seitengrund | „identisch“ (Ref 07, 10), nicht messbar | ΔE00 ≤ 1 | Neuentwurf (Wahrnehmungsschwelle) | 10.6 |
| Alpha-Übergangszone der Freistellkante | nicht messbar (Kompression) | 1–2 px, ohne Farbsaum | Neuentwurf | 10.6 |
| Gerichteter Auslauf | Unterkörper verwischt nach unten (Ref 03) | unteres Viertel bis Drittel der Objekthöhe | Neuentwurf | 10.6 |
| Scrim | Lesezone rund 40 % der Breite über dem Bild (Ref 02, geschätzt); Deckkraft nicht messbar | Breite 35–50 % der Bildbreite, kantenlos auslaufend; Startwert 40–70 % am Textrand, maßgeblich ist der gemessene Kontrast | Ref 02; Deckkraft Neuentwurf | 10.6 |
| Rahmenbrüche je Ansicht | einer (Ref 05) | höchstens 1 | Ref 05; Ableitung aus Nr. 3 | 10.6 |

### Bewegung und Interaktion

Belegt sind nur der Ort der Bewegung und die Zahl der bewegten Träger (Ref 04/07 als ein Design, Ref 09; auswertbar 1 bis 5 von 15, Konsenssicherheit niedrig). Dauer, Kurve, Weite, Auslöser und Physik zeigt keine Referenz; diese Werte sind Neuentwurf (nicht beobachtet) und folgen aus dem Grundsatz „Bedienschicht kurz und klein, Motiv langsam“ (10.7).

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Ort der Bewegung | nur im Motiv; Bedienschicht in 0 von 4 auswertbaren bewegt (Ref 04/07, 09) | nur Motivebenen; Grund und Bedienschicht stehen still | Beleg; Nr. 1 | 10.7, 10.8 |
| Dauerbewegte Träger je Ansicht | je Beleg einer (Ref 04/07, 09) | höchstens 1 | Nr. 3 | 10.7, 10.8 |
| Zustandswechsel (Hover, Fokus, aktiv) | statische Kanäle belegt: Deckkraft (Ref 02), Glas gegen opak (Ref 03), Sättigung (Ref 12), Füllung gegen Kontur (Ref 14); Verhalten nicht belegt | 120–200 ms (Standard 160 ms); nur Deckkraft, Sättigung, Farbe, Füllung, Kontur | Kanäle belegt; Dauer Neuentwurf (nicht beobachtet) | 10.7, 10.8 |
| Ein- und Ausblenden (Menü, Panel) | nicht beobachtet | 200–300 ms; nur Deckkraft, kein Versatz | Neuentwurf (nicht beobachtet); 10.10, Nr. 14 | 10.7 |
| Austritt | nicht beobachtet | etwa ¾ der Eintrittsdauer | Neuentwurf (nicht beobachtet); ergänzt in 10.9 | 10.9 |
| Einblenden eines Folgeabschnitts | nicht beobachtet | 300–500 ms, nur Deckkraft, einmalig | Neuentwurf (nicht beobachtet) | 10.7 |
| Druckrückmeldung | nicht beobachtet | keine Skalierung; Rückmeldung über die Zustandskanäle (Deckkraft, Sättigung, Farbe, Füllung, Kontur) | Neuentwurf (nicht beobachtet); 10.10, Nr. 14 | 10.7, 10.8 |
| Überschwingen, Feder | 0 von 15 fluide Bedienelemente; Interface-Physik ohne Beleg | keines: Bezier-Stützwerte zwischen 0 und 1, keine Feder | Nr. 5 | 10.7 |
| Kurve für Eintritt und Zustand | nicht beobachtet | `cubic-bezier(0.2, 0, 0, 1)` | Neuentwurf (nicht beobachtet) | 10.7 |
| Kurve für Austritt | nicht beobachtet | `cubic-bezier(0.4, 0, 1, 1)` | Neuentwurf (nicht beobachtet) | 10.7 |
| Kurve für Szene und Schweben | nicht beobachtet | `cubic-bezier(0.65, 0, 0.35, 1)` | Neuentwurf (nicht beobachtet) | 10.7 |
| Szenenwechsel im Motiv | Aufbau belegt: Kopfzeile steht, Wort und Motiv werden getauscht (Ref 04/07); stehender Zwischenzustand unlesbar (Ref 04) | 500–900 ms, ohne stehenden Zwischenzustand | Dauer Neuentwurf (nicht beobachtet); Lesbarkeit aus Ref 04 | 10.7 |
| Motivschleife (Schweben, Drehen) | Hypothese zu Ref 09 | Periode 6–10 s; Schweben ≤ 2 % der Objekthöhe | Neuentwurf (nicht beobachtet) | 10.7, 10.8 |
| Parallax-Faktor | sechs Ebenen ohne Werte, nur als Struktur (Ref 06) | Bildebenen 0,8–1,0 der Scrollgeschwindigkeit; Text und Bedienschicht 1,0; mobil höchstens eine Ebene | Neuentwurf (nicht beobachtet) | 10.2, 10.7 |
| Anheftstrecke je Szene | nicht beobachtet | ≤ 1,5 Viewporthöhen, davon ≥ ⅓ Ruhe im Endzustand; mobil keine | Neuentwurf (nicht beobachtet) | 10.7 |
| Scroll-Hinweis | Klein-UI in Versalien mit Haarlinie (Ref 09, 15) | ruhend, in Größe der Bedienschrift, an der Ordnungslinie | Beleg; Nr. 7 | 10.7 |
| Fassung „weniger Bewegung“ | gefordert (Profilregeln Ref 04, 06); in Ref 04, 06, 07, 09, 15 fehlend oder nicht prüfbar | keine Schleife, kein Parallax, kein Anheften, keine Scroll-Kopplung, kein Versatz; Szenen als Überblendung ≤ 200 ms oder Schnitt; Farb- und Deckkraftwechsel bleiben | Profilregeln Ref 04, 06; WCAG 2.3.3 (Stufe AAA), eigene Vorgabe über AA hinaus | 10.7 |
| Selbstlauf und Blitze | nicht beobachtet | jede Bewegung, die länger als 5 s läuft, also jede Schleife, hat eine sichtbare Pause; höchstens 3 Blitze je Sekunde | Norm WCAG 2.2.2, 2.3.1 | 10.7, 10.10 |

### Effektbudget, Zählgrenzen und Farbe als Funktion

Die Intensitäten stehen auf der Skala 0–4 der Analyse (Kapitel 4 und 5). Sie sind ein Prüfmaß für Entwürfe, kein Token.

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Ausdrucksträger | eine Ausdruckslast auf einem Träger als Tendenz (4.4, Frage 7); Clustermediane: B Körper 4 gegen Licht und Material 3; A Raumschrift und Plastik je 3 gegen Material und Licht 2; zwei Träger zudem in Ref 03, 05, 15 | Ausdrucksträger mindestens eine Stufe über allen übrigen Mitteln; höchstens ein zweiter Träger auf gleicher Stufe | Tendenz belegt; Schwelle Ableitung; ergänzt in 10.9 | 10.9 |
| Material | Intensität 1–4, Höchstwert Ref 01, 10 | frei 1–4, nur am Fokusträger oder in der Glasschicht; Bedienschicht ohne Eigenmaterial | 5.3; Nr. 9 | 10.3 |
| Licht | Intensität 1–3 | frei 1–3, am Hauptmotiv; Bedienschicht leuchtet nicht (außer Schein als Zustand) | 5.3; Nr. 10 | 10.4 |
| Unschärfe | Intensität 1–3, stark nur Ref 01, 03, 12 | frei 1–3; Fixationspunkt und Schrift ohne Unschärfe | 5.3 | 10.3 |
| Grund | deutlich in 4 von 15, stark in 0 von 15 | höchstens Stufe 2 | Nr. 11 | 10.4, 10.10 |
| Formsystem | typisch 2; 3 nur Ref 06, 14 | 2; 3 nur mit konventioneller Headline | Zielkonflikt ρ D5 + D18 = −0,38 | 10.5 |
| Verformung | deutlich 1 von 15 (Übergangsframe Ref 04), Gegenprobe 0 von 14 | Bedienschicht 0; im Motiv eingefroren | 5.6.14 | 10.5 |
| Einmal-Elemente je Ansicht | Fixationsanker und Fokusträger (Ausnahmen Ref 13, 14); ein Formbruch (Ref 03); ein Rahmenbruch (Ref 05); ein Helligkeitszentrum; ein aktiver Schein-Saum (Ref 13) | je genau bzw. höchstens 1: Anker, Fokusträger, Formbruch, Rahmenbruch, dominanter Lichtkern, Helligkeitszentrum, Schein-Saum, bewegter Träger, Schattenstufe | Nr. 3, 5, 6, 11; Ableitung | 10.1–10.7 |
| Akzentrolle | Fokus über einen einzigartigen Reiz in 10 von 15; Farbe oder Farbtemperatur als dieser Reiz in Ref 01, 03, 05, 08, 10 | genau eine Akzentrolle; der Fokusreiz (Sättigung, Wärme, Helligkeit oder Tonwert) liegt allein am Fixationsanker | Nr. 3; 5.5 | 10.7, 10.10 |
| Anteil der Akzentrolle in der Bedienschicht | punktuell, wenige Prozent (Ref 14, geschätzt); ein einziger gesättigter Akzent (Ref 01) | höchstens etwa 5 % der Ansicht, auf Hauptaktion und aktiven Zustand begrenzt | abgeleitet aus Ref 01, 14; Wert Neuentwurf; ergänzt in 10.9 | 10.9 |
| Rang und Zustand | ohne Zusatzfarbe in mindestens 7 von 15 | über Deckkraft, Sättigung, Füllung gegen Kontur oder Glas gegen opak; keine zweite Akzentfarbe; Farbe nie einziges Signal | Beleg; Norm WCAG 1.4.1 | 10.7 |
| Grundton | hell 6, dunkel 7, fotografisch gemischt 2 von 15 | frei; Figur-Grund-Trennung folgt ihm: hell Begleitschatten oder Kantensaum, dunkel Licht | 5.5 | 10.4 |

### Barrierefreiheit

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Kontrast bedeutungstragender Text | Kontrastrisiken in 12 von 15 Profilen; Profilregeln: 4,5:1 für Kleintext (Ref 03, 05), mindestens 3:1 für Tonwertstufen (Ref 01) | ≥ 4,5:1; großer Text (ab 24 px oder 18,66 px fett) ≥ 3:1; gegen die ungünstigste Stelle des Untergrunds, bei Video gegen den ungünstigsten Frame, in jedem Zuschnitt | Norm WCAG 1.4.3 | 10.1–10.10 |
| Kontrast Kulissenschrift | etwa 1,3:1 (Ref 03, geschätzt) | unter 3:1 nur rein dekorativ: `aria-hidden="true"`, Inhalt zusätzlich als lesbarer Text | 5.5; Norm WCAG 1.4.3 | 10.2, 10.10 |
| Kontrast von Konturen, Bedienelementen, Fokus | nicht beobachtet | ≥ 3:1 | Norm WCAG 1.4.11 | 10.3, 10.4, 10.5 |
| Fokusanzeige | in 0 von 15 sichtbar | Kontur ≥ 2 px, formfolgend, unverdeckt; nie Schein allein | Neuentwurf; Norm WCAG 2.4.7, 2.4.11 | 10.4, 10.5, 10.10 |
| Zielgröße | nicht beobachtet | ≥ 24 × 24 px, empfohlen 44 × 44 px | Norm WCAG 2.5.8 | 10.1, 10.5 |
| Kleinste Breite, Umfließen | 0 von 15 Mobilansichten | eigene Komposition ab 360 px; kein horizontales Scrollen bis 320 px | Neuentwurf; Norm WCAG 1.4.10 | 10.1, 10.10 |
| Textvergrößerung, Textabstände | nicht beobachtet | 200 % ohne Verlust; Grade mit rem-Anteil, nie nur `vw`; erweiterte Abstände ohne Abschneiden | Norm WCAG 1.4.4, 1.4.12 | 10.1 |
| Prüfbreiten und Zoomstufen | nicht beobachtet | 360, 390, 768, 1280, 1440 px; Zoom 200 % und 400 % | Neuentwurf | 10.10 |

### Leistung

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| LCP / INP / CLS (75. Perzentil, mobil) | nicht beobachtbar | ≤ 2,5 s / ≤ 200 ms / ≤ 0,1 | Norm Core Web Vitals | 10.8, 10.10 |
| Übertragung bis LCP, komprimiert | nicht beobachtbar | ≤ 350 KB mobil | Neuentwurf | 10.8 |
| Fokus-Asset | nicht beobachtbar | ≤ 200 KB mobil, ≤ 400 KB Desktop; bis 2 × Darstellungsbreite in 3–4 `srcset`-Stufen; nie verzögert geladen | Neuentwurf | 10.6 |
| JavaScript erster Bildschirm, komprimiert | nicht beobachtbar | ≤ 100 KB, ohne 3D-Bibliothek | Neuentwurf | 10.8 |
| Videoschleife im Hero | nur Hypothese (Ref 04/07, 09); Poster nötig (Profile Ref 04, 07) | 4–10 s; ≤ 1,5 MB mobil, ≤ 4 MB Desktop; Poster als Endzustand | Neuentwurf | 10.8 |
| Bildfolge für Scroll-Kopplung | Hypothese Ref 04; Speicherrisiko laut Profil | ≤ 60 Bilder und ≤ 3 MB mobil, ≤ 120 Bilder Desktop | Neuentwurf | 10.8 |
| Nachgeladenes 3D-Paket | Echtzeit-3D in 0 von 15 belegt | ≤ 1,5 MB mobil, ≤ 3 MB Desktop; erst nach dem LCP | Neuentwurf | 10.8 |
| Pixeldichte im Canvas | nicht beobachtbar | ≤ 1,5 mobil, ≤ 2 Desktop | Neuentwurf | 10.8 |
| Bildrate Echtzeit | nicht beobachtbar | Ziel 60 fps; Rückfall bei Median-Framezeit über 25 ms für 2 s | Neuentwurf | 10.8 |
| Animierte Eigenschaften | Backdrop-Blur als GPU-Risiko (Profile Ref 01, 02, 03, 12, 13) | Motiv, Ebenen, große Flächen: nur `transform` und `opacity`; kleine Bedienelemente zusätzlich Farbe, Füllung, Kontur, Sättigung; nie Unschärferadius, Schatten oder Layout-Eigenschaften | Neuentwurf; Risiko laut Profilen | 10.3, 10.7, 10.8 |

### Werte als Design-Tokens

Die Werte werden als CSS-Custom-Properties in drei Schichten geführt. Die **Markenschicht** liegt außerhalb dieses Styleguides: Sie liefert Farbwerte (als RGB-Tripel), Schriftfamilien und Motive und ist austauschbar. Die **Rollen- und Basisschicht** hält die Zahlen dieses Abschnitts (Abstand, Radius, Grad, Ebene, Unschärfe, Deckkraft, Dauer, Kurve) und Farbrollen, die nur auf die Markenschicht zeigen (Grund, Text, Akzent, Glaston, Schattenton); Farbton und Deckkraft bleiben getrennte Tokens, damit Rangstufen ohne neue Farbwerte entstehen. Die **Komponentenschicht** liest nur Rollen-Tokens, wie `.glas` in 10.3 und die Schattenklassen in 10.4; Einzelwerte in Komponenten sind gesperrt (10.10). Elementabhängige Größen (Schattenversatz, Lichthof, Grad der Kulissenschrift) rechnet die Komponente aus den Verhältnissen der Tabellen. Die Namen sind deutsch und folgen den Abschnitten (`--z-*`, `--radius-*`, `--blur-*`, `--schatten-*`); Grade und Abstände stehen in rem, Haarlinien, Unschärfe und Versatz in px. Breiten und Systemeinstellungen überschreiben Tokens an genau einer Stelle; Breakpoints stehen als feste Zahlen in den Media Queries, weil Custom Properties dort nicht wirken. Erforderlich sind nur Custom Properties, `clamp()` und Media Queries. Optional sind `@property` (nur wenn ein Token selbst animiert wird, und nur für Werte am Motiv; die Ankerposition des Lichtraums gehört zum Grund und wird nur je Breakpoint gesetzt, ohne Animation), Containereinheiten (`cqi`; ohne Container wirken sie wie Viewporteinheiten) und ein Austauschformat für Tokens mit Build-Werkzeug, wenn mehrere Plattformen dieselben Werte brauchen.

```css
:root {
  /* Markenschicht (nicht Teil des Styleguides) liefert RGB-Tripel:
     --marke-grund, --marke-grund-zentrum, --marke-grund-rand,
     --marke-text, --marke-hell, --marke-tief, --marke-akzent */
  --farbe-grund: var(--marke-grund);
  --farbe-grund-zentrum: var(--marke-grund-zentrum);  /* Helligkeitszentrum des Lichtraums (10.4) */
  --farbe-grund-rand: var(--marke-grund-rand);
  --farbe-text: var(--marke-text);
  --farbe-akzent: var(--marke-akzent);       /* genau eine Akzentrolle */
  --glas-ton: var(--marke-hell);
  --kante-ton: var(--marke-hell);
  --schattenton: var(--marke-tief);          /* abgedunkelter Grundton */

  --abstand-1: .25rem; --abstand-2: .5rem; --abstand-3: 1rem;
  --abstand-4: 1.5rem; --abstand-5: 3rem;  --abstand-6: 6rem;
  --rand: clamp(1rem, 5vw, 6rem);
  --abstand-sektion: clamp(4rem, 2rem + 8vw, 10rem);

  --grad-text: 1rem;                         /* 16–18 px */
  --grad-ui: .875rem;                        /* ≥ 14 px und ≥ Text ÷ 1,25 */
  --grad-headline: clamp(2.25rem, 1.5rem + 3vw, 4.5rem);

  --radius-full: 9999px; --radius-l: 1.75rem; --radius-s: .625rem;
  --z-grund: 0; --z-kulisse: 10; --z-motiv: 20;
  --z-vordergrund: 25; --z-ui: 30; --z-overlay: 40;

  --blur-leicht: 12px; --blur-stark: 32px;
  --glas-blur: var(--blur-leicht);           /* .glas--text setzt --blur-stark */
  --glas-fuellung: .2; --fuellung-text: .55;
  --fuellung-ersatz: .8; --fuellung-deckend: .95;
  --kante-alpha: .14; --kante-oben: .24;     /* dunkler Grund; heller Grund .4–.7 */
  --schatten-alpha: .06;

  --dauer-zustand: 160ms; --dauer-panel: 240ms;
  --dauer-abschnitt: 400ms; --dauer-szene: 700ms;
  --kurve-ein: cubic-bezier(.2, 0, 0, 1);
  --kurve-aus: cubic-bezier(.4, 0, 1, 1);
  --kurve-szene: cubic-bezier(.65, 0, .35, 1);
}
@media (max-width: 639px) {
  :root { --radius-l: 1.125rem; }
}
@media (prefers-reduced-motion: reduce) {
  :root { --dauer-szene: 200ms; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  :root { --blur-leicht: 0px; --blur-stark: 0px;
          --glas-fuellung: var(--fuellung-deckend); --fuellung-text: var(--fuellung-deckend); }
}
```

Schleifen, Parallax und Anheften schalten die Komponenten unter `prefers-reduced-motion: reduce` selbst ab (10.7); ein Token kann eine laufende Animation nicht beenden. Unter `forced-colors: active` bleiben nur Konturen als Grenzen sichtbar (10.3, 10.4).

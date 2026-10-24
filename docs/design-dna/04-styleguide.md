# 6. Technischer Styleguide

[← Übersicht](README.md)

Dieses Kapitel übersetzt die gemeinsame Design-DNA aus Kapitel 5 in prüfbare Regeln, Werte und Techniken. Kapitel 5 sagt, was die Richtung ausmacht; dieses Kapitel sagt, wie man eine Oberfläche in dieser Richtung baut und prüft: Ordnung, Ebenen, Material, Licht, Form, Bild, Bewegung, Technik und Grenzen.

## Wofür er gilt

- **Gegenstand.** Oberflächen, die nach der DNA gestaltet werden: erste Bildschirme (Hero) von Websites und Landingpages, ihre Folgeabschnitte und App-Ansichten mit einer Bühne. Belegt sind nur Desktop-Heros. Folgeabschnitte, Mobilfassung (0 von 15 Referenzen), Bewegung und Interaktion sind Ableitung oder Neuentwurf und als solche gekennzeichnet.
- **Marken- und farbneutral.** Der Styleguide schreibt keine Farbtöne, Schriftarten, Marken oder Motive vor. Farbe erscheint nur als Funktion: Anteil, Kontrast, Akzentrolle, Rang. Die Werte einer Marke liegen in einer eigenen Token-Schicht, die austauschbar bleibt (10.9).
- **Mindestanforderungen für jede Variante.** WCAG 2.2 AA für Text, Bedienelemente und Fokus; eine eigene Komposition ab 360 px und Umfließen bis 320 px; die Leistungsbudgets aus 10.8. Eindrucksvolle Gestaltung darf Nutzbarkeit nicht verhindern: Im Konflikt weicht der Effekt, nie die Mindestanforderung (10.10).
- **Nicht Gegenstand.** Inhalte, Texte, Informationsarchitektur, Markenwerte und einzelne Seiten.
- **Leser.** Gestaltung arbeitet vor allem mit 10.1 bis 10.6 und 10.10, Entwicklung mit 10.7 bis 10.9, Prüfung mit den Prüffragen jedes Abschnitts und den Prüfverfahren in 10.10.

## Wie er zu lesen ist

**Aufbau.** Jeder Abschnitt folgt demselben Raster: Grundsatz, Beobachtet in den Referenzen, Regeln, Umsetzung (Vorschlag), Mobil und Barrierefreiheit, Prüffragen. 10.9 sammelt stattdessen alle Zahlen in Tabellen und zeigt, wie sie als Design-Tokens organisiert werden; 10.10 führt Ausschlüsse statt Regeln.

**Regelmarken.**

| Marke | Bedeutung | Herkunft |
|---|---|---|
| **[Pflicht]** | gilt für jede Variante; wer abweicht, verlässt die Richtung oder unterschreitet eine Mindestanforderung | verbindliche DNA (5.2, Nr. 1–11), Rahmen der Stellschrauben (5.3) oder Nutzbarkeitsvorgabe (WCAG 2.2 AA, Core Web Vitals) |
| **[Variabel]** | Stellschraube mit belegtem Spielraum; je Produkt oder Ansicht eine Wahl, die dann überall gleich gilt | variable Ausgestaltung und Dialekte (5.3) |
| **[Optional]** | Signature-Effekt; nur unter der genannten Bedingung, nie Pflicht | Signature-Effekte (5.4) |

**Beobachtet und vorgeschlagen.** Beides ist strikt getrennt.

- *Beobachtet* steht nur, was die Referenzen zeigen, mit Beleg („Ref 03“) und Zählung („12 von 15“). Die Gegenprobe zählt 14 unabhängige Designs, weil Ref 04 und Ref 07 zwei Standbilder desselben Designs sind („Gegenprobe 11 von 14“). Proportionen sind geschätzt: 9 von 15 Quellen sind perspektivisch verzerrt, Pixelwerte aus fotografierten Bildschirmen werden nicht verwendet. „Näherung“ heißt geschätzt am unverzerrten Bildschirmfoto Ref 01. Die Konsenssicherheit (hoch, mittel, niedrig) ist eine Obergrenze, weil die acht Expertenrollen simuliert sind (4.6).
- *Vorschlag* sind Umsetzungswerte und Techniken. Ihre Herkunft ist jeweils benannt:
  - *abgeleitet*: aus geschätzten Verhältnissen der genannten Referenzen gerundet;
  - *Ableitung*: aus einem belegten Prinzip geschlossen, selbst nicht beobachtet;
  - *Neuentwurf*: ohne Beleg in der Sammlung, also eine eigene Gestaltungsentscheidung;
  - *Neuentwurf (nicht beobachtet)*: Bewegung, Scrollen, Mikrointeraktion, Physik und Übergänge, die Standbilder nicht zeigen;
  - *Hypothese*: technische Vermutung zu einer Referenz;
  - *Norm*: externe Vorgabe, vor allem WCAG 2.2 und Core Web Vitals.
- *Technik* wird nie verlangt, weil sie verbreitet ist. „Erforderlich“ ist das leichteste Verfahren, das den Effekt vollständig trägt; „optional“ ist ein schwereres Verfahren mit Bedingung und Begründung (Matrix in 10.8).

**Verweise.** „Nr. 6“ meint Prinzip 6 der verbindlichen DNA (5.2), „5.6.12“ eine Dimension in Kapitel 5, „D4“ die Dimension 4 der Bewertung, „4.4, Frage 5“ eine Leitfrage in Kapitel 4. Alle Zahlen stehen gesammelt in 10.9; weicht ein Abschnitt davon ab, gilt 10.9.

## Verhältnis zu Kapitel 5

- **Kapitel 5 ist die Quelle.** Es nennt die Konstruktionsformel (5.1), die elf verbindlichen Prinzipien (5.2), Stellschrauben und Dialekte (5.3), Signature-Effekte (5.4), häufige Fehldeutungen (5.5) und die 18 Dimensionen im Einzelnen (5.6). Dieses Kapitel fügt der DNA nichts hinzu und lockert nichts.
- **Zuordnung.** Jede [Pflicht]-Regel lässt sich auf ein Prinzip aus 5.2, auf einen Rahmen aus 5.3 oder auf eine Mindestanforderung zurückführen; [Variabel] und [Optional] übernehmen Spielraum und Bedingungen aus 5.3 und 5.4. Die Fehldeutungen aus 5.5 kehren in 10.10 als Ausschlüsse wieder. Was über Kapitel 5 hinausgeht (Zahlenwerte, Mobilfassung, Zeitverhalten, Technik, Barrierefreiheit, Leistung), ist als Neuentwurf, Hypothese oder Norm gekennzeichnet.
- **Dialekte.** A Typo-Bild-Sandwich, B plastischer Hauptdarsteller im gestalteten Licht und C flache Lösung sind zulässige Ausprägungen derselben Konstruktion; Ref 01 taugt nur als Glasschicht innerhalb von A oder B. Ein Dialekt rechtfertigt keine Abweichung von einer [Pflicht]-Regel.
- **Rangfolge im Konflikt.** Für die Richtung gilt Kapitel 5, für die Nutzbarkeit gelten die Mindestanforderungen; der Styleguide wird dann angepasst, nicht die Quelle.

## Übersicht der Abschnitte

| Abschnitt | Regelt | Prinzipien und Dimensionen |
|---|---|---|
| 10.1 Layout und Komposition | Ordnungslinie, Fixationsanker, Negativraum, Maßstabssprung, Raster, Schriftgrade, Textmenge | Nr. 3, 7, 8; D6, D18 |
| 10.2 Räumliche Gestaltung | Ebenenfolge, Verdeckung, Raumschrift, Bildperspektive, Stapelstufen | Nr. 1, 2; D1, D15, D18 |
| 10.3 Materialien und Oberflächen | Materialgefälle, Glas, Unschärfe, Kanten, Textur | Nr. 9; D2, D4, D12 |
| 10.4 Licht und Schatten | Lichtkern, Lichtraum, Begleitschatten, Lichtkante, Schein als Zustand | Nr. 6, 10, 11; D3, D4, D13 |
| 10.5 Geometrie und Formensprache | Formfamilie, Radienstufen, Formbruch, Anschnitt, Masken | Nr. 5; D5, D14 |
| 10.6 Bild- und Objektintegration | Bild als Raum, Freisteller, Übergang Bild–Grund, Verankerung, Text auf dem Bild | Nr. 1, 3, 4, 6; D7, D11 |
| 10.7 Motion und Interaktion | Ort der Bewegung, Zustandskanäle, Scrollen, Übergänge, Fassung „weniger Bewegung“ | Nr. 1, 3, 5; D8, D9, D10, D16, D17 (nicht belastbar) |
| 10.8 Rendering- und Frontend-Techniken | Effekt-Technik-Matrix, Ersatzfassungen, Leistungsbudgets | Nr. 1, 5; Hypothesen aus 4.4, Frage 4 |
| 10.9 Technische Designparameter | alle Zahlen und Wertebereiche, Design-Tokens | alle |
| 10.10 Gestalterische Ausschlussregeln | Verbote aus 5.2 und 5.5, Nutzbarkeitsvorgaben, Prüfverfahren | Nr. 1–11; WCAG 2.2 AA, Core Web Vitals |


## 10.1 Layout und Komposition

### Grundsatz

Jede Ansicht ordnet sich um genau einen Fixationsanker an einer strengen Ordnungslinie und lässt ihm viel freie Fläche. Die Hierarchie ist ein Sprung, keine Stufenleiter: ein sehr großes Hauptelement, eine kleine, ruhige Bedienschicht, dazwischen höchstens eine Headline. Die Komposition ist das feste Gerüst, auf dem die wechselnden Ausdrucksträger sitzen (5.6.6).

### Beobachtet in den Referenzen

Alle Proportionen sind Schätzungen: 9 von 15 Quellen sind perspektivisch verzerrt, Mobilansichten fehlen (0 von 15).

- **Ordnungslinie.** D6 ist deutlich ausgeprägt in 15 von 15, stark in 13 von 15, Gegenprobe 14 von 14, Konsenssicherheit hoch. Ohne Achse oder gemeinsame Kante: 0 von 15. Ordnungsfigur: senkrechte Achse 8 von 15 (Ref 03, 04, 07, 08, 09, 12, 13, 15; Gegenprobe 7 von 14), davon Achsenkreuz mit waagerechtem Schrift- oder Objektband 6 von 15 (Ref 03, 04, 07, 08, 09, 15); asymmetrisch-diagonale Balance 7 von 15 (Ref 01, 02, 05, 06, 10, 11, 14). Gemeinsame Außenkante mit höchstens einer eingerückten Zweitlinie: Ref 02, 03, 11, 12 (Einzug in Ref 11 etwa 2–3 % der Breite).
- **Raster und Zonen.** Ein Spaltenraster ist nicht messbar. Belegt sind Band- und Zonenraster (Ref 01, 03, 08, 11), die Teilung Textspalte gegen Bildbühne (Ref 02, 10, 14) und ein Karten- oder Kachelraster als Träger in 6 von 15 (Ref 03, 05, 08, 11, 13, 14); Bento im engeren Sinn nur in Ref 13 und 14, beide ohne großzügigen Negativraum. Die Lesezone ist schmal: etwa ein Viertel (Ref 03), ein Drittel (Ref 15) bis 40 % der Breite (Ref 02). Die Kopfzeile ist ein dünner Streifen (Ref 12 etwa 5 % der Höhe, Ref 14 unter einem Zehntel).
- **Visueller Schwerpunkt.** Der eine Anker ist ein Prinzip mit Ausnahmen: Ref 13 (verteilte Salienz) und Ref 14 (drei Pole) haben keinen, Ref 11 ist Grenzfall. In 10 von 15 setzt ein einzigartiger Reiz den Fokus (Gegenprobe 10 von 14). Achsenentwürfe legen den Anker auf oder nahe die Mittelachse (Ref 03, 07, 08, 09, 12, 15), Split-Entwürfe in die Bildzone gegenüber dem Textstapel (Ref 02, 10). Zwei Gewichtspole auf einer Diagonale kommen vor (Ref 01, 04, 06, 11).
- **Flächenanteile.** Großzügiger Negativraum in 12 von 15 (Gegenprobe 11 von 14; Ausnahmen Ref 09, 13, 14), ein Schwellenfall. Freier Grund: 35–40 % (Ref 03), rund 40 % (Ref 12), 40–45 % (Ref 15), über die Hälfte (Ref 07), 55–60 % (Ref 01), 70–75 % (Ref 10). Der Fokusträger ist oft klein und dominiert über seinen Reiz: 12–15 % (Ref 10), etwa ein Achtel (Ref 08), 20–25 % (Ref 03), ein Viertel bis ein Drittel (Ref 07), rund 40 % (Ref 02). Textflächen bleiben klein: Headline 6–8 % (Ref 10), Headline-Block etwa ein Zwanzigstel (Ref 12), Navigation unter 3 % (Ref 04).
- **Ebenen und Überlagerung.** Mindestens drei Ebenen in 15 von 15, belegt sind drei bis sechs. Die Bedienschicht liegt meist obenauf; nur in Ref 05 und 08 tritt das Objekt vor Teile der UI. Überlagerungen sind knapp: Das Kulissenwort bleibt lesbar (Regeln Ref 05, 07, 15), laut Regel Ref 05 über Wortanfang und Wortende; Bildkarten überlappen um etwa ein Zehntel (Ref 11), der Leuchtenschirm überragt die Kartenkante um 4–5 % der Kartenhöhe (Ref 05). Randanschnitt oder Rahmenbruch als Fortsetzungssignal in 8 von 15 (Ref 04, 05, 06, 07, 08, 09, 12, 15); in Ref 12 liegt die Folgesektion im unteren Viertel. Tiefenmittel und Verdeckungsrichtung: siehe 10.2.
- **Typografische Hierarchie.** Maßstabssprung ohne Zwischenstufen in 12 von 15 = 80 % (Gegenprobe 11 von 14; Schwellenfall, hängt an Ref 15), Konsenssicherheit hoch. Belegte Sprünge: Ref 04 Navigation rund 2 %, Headline rund 10 %, Riesenlettern 15–20 % der Höhe; Ref 07 Riesenschrift das Fünf- bis Zehnfache der Kleintexte; Ref 03 Wortmarke etwa fünffache Headline-Versalhöhe; Ref 11 Titel vier- bis fünffach; kleinste Sprünge Ref 02 (drei- bis vierfach) und Ref 06 (rund dreifach). Belegt sind zwei (Ref 07) oder drei weit gespreizte Stufen (Ref 04, 15); Ref 15 hat zusätzlich die Kapitelziffern als Zwischenstufe (Definitionsfrage, 4.4, Frage 1). Andere Sprungachsen: Tonwert (Ref 01), Gewicht (Ref 14). Schrift ist Kulisse (Raumschrift 7 von 15) oder Etikett neben dem Motiv (Ref 01, 02, 06, 10, 12, 14).
- **Schriftstimmen und Textmenge** (nicht ausgezählt). Belegt sind eine expressive Display-Stimme plus eine sachliche Grotesk (Regel Ref 07) und feste Rollen je Gattung: Monospace für Bezeichner (Ref 10, 11), Punktziffern für Kennzahlen (Ref 13). Die Gattung ist frei. Erste Bildschirme tragen kurze Stapel: Kernaussage einzeilig (Ref 07, 08), zweizeilig (Ref 01, 02, 14) oder dreizeilig (Ref 10, 12, 15), dazu kurze Subline, ein bis zwei Handlungsaufrufe, Folge „Versprechen, Begründung, Aktion, Beleg“ (Regel Ref 02).
- **Zielkonflikt.** Kontrastrisiken nennen 12 von 15 Profilen (Gegenprobe 11 von 14), meist bei winziger Bedienschrift auf dem Bild: ein Mangel der Sammlung, keine DNA.

### Regeln

1. **[Pflicht]** Jede Ansicht ordnet sich an einer Achse oder gemeinsamen Kante; Text und Bedienelemente fluchten darauf (Nr. 3). Der Fokusträger sitzt nur in Achsenentwürfen auf dieser Linie; in Split-Entwürfen liegt er in der Bildzone gegenüber dem Textstapel (Ref 02, 10). Weitere Fluchtlinien sind belegt (Ref 03: linke und rechte Außenkante, Mittelachse, eingerückte Zweitlinie); als Vorschlag gilt höchstens eine eingerückte Zweitlinie (Regel Ref 11, siehe Tabelle).
2. **[Pflicht]** Jede Ansicht hat genau einen Fixationsanker; nur er trägt seinen Reiz (Größe, Schärfe, Helligkeit, Sättigung oder Tonwert). Ein zweiter Gewichtspol auf der Diagonale ist erlaubt, wenn er diesen Reiz nicht teilt (Ref 01).
3. **[Pflicht]** Mindestens ein Drittel des ersten Bildschirms bleibt freier, ruhiger Grund (Nr. 8): frei von Text, Bedienelementen und dominanten Motivteilen; ruhige Szenenflächen (Himmel, Boden, Dunst) zählen als frei (Ref 15: 40–45 %).
4. **[Pflicht]** Das Hauptelement (Kulissenschrift, Objekt oder Szene) ist bei jeder Breite mindestens dreimal so groß wie die Bedienschrift. Dazwischen steht höchstens eine Headline; je Ansicht gibt es höchstens drei Größenstufen (Ableitung).
5. **[Pflicht]** Lesestapel und Bedienschicht liegen neben dem Anker, nie auf ihm. Die Navigation sitzt in einer schmalen Randzone, die frei von Kulissenschrift und Objekt bleibt (Regel Ref 04).
6. **[Pflicht]** Verdeckung trifft nur Bild, Kulisse und Inhaltsflächen (Karten; Ref 05, 08). Navigation, Hauptaktion, bedeutungstragender Text sowie Bedienziele samt Trefferfläche und Fokusrahmen bleiben unverdeckt; ein verdecktes Kulissenwort bleibt über Anfang und Ende lesbar (5.6.18).
7. **[Variabel]** Ordnungsfigur: Achse, Achsenkreuz, Split oder Diagonale, gleichwertig; Band-, Zonen- oder Kartenraster als Träger. Spielraum: eine Figur je Ansicht.
8. **[Variabel]** Schrift als Kulisse oder Etikett, zwei oder drei Größenstufen; innerhalb einer Stufe zusätzliche Abstufung über Tonwert (Ref 01) oder Gewicht (Ref 14).
9. **[Variabel]** Eine oder zwei Schriftfamilien; eine dritte nur mit fester, wiederkehrender Rolle (Bezeichner, Kennzahlen).
10. **[Variabel]** Fortsetzungssignal über Randanschnitt, Rahmenbruch oder angeschnittene Folgesektion; der erste Bildschirm ist ohne Scrollen vollständig komponiert.
11. **[Optional]** Bento- oder Kachelraster (Ref 13, 14), nur wenn Regel 2 und 3 erfüllt bleiben: Eine Kachel ist Anker, alle anderen sind Klein-UI.
12. **[Optional]** Kennzahl-Kachel mit großem Wert und kleinem Label (Ref 03, 13, 14), wenn der Wert kleiner bleibt als das Hauptelement.
13. **[Optional]** Treppensatz der Headline (Ref 02) oder durch das Objekt geteilte Headline (Ref 07), wenn Einzug oder Teilung die Ordnungslinie aufnimmt.

### Umsetzung (Vorschlag)

Alle Werte sind Vorschläge. „Abgeleitet“ heißt: aus den geschätzten Proportionen der genannten Referenzen gerundet. „Neuentwurf“ heißt: ohne Beleg in der Sammlung.

- **Raster.** Erforderlich für den Effekt ist nur, dass Ordnungslinie, Textkanten und Bedienschicht auf denselben Linien liegen. Ein Spaltenraster ist dafür Werkzeug, kein Stilmerkmal (Neuentwurf): 12 Spalten ab 1024 px, 8 ab 640 px, 4 darunter; CSS Grid mit benannten Linien, `subgrid` optional. Der Fokusträger liegt als eigene Ebene im selben Grid-Bereich (`grid-area`), damit er beim Umbruch mitwandert.
- **Ebenen.** Feste Stapelwerte (Neuentwurf): Grund 0, Kulisse 10, Fokusträger 20, Vordergrund 25 (siehe 10.2), Bedienschicht 30, Navigation und Overlays 40; der Hero erhält `isolation: isolate`. Dekorebenen bekommen `pointer-events: none` (Regel Ref 06).
- **Schriftgrade.** Fließende Grade per `clamp()` mit rem-Anteil, damit sie zoombar bleiben (Werte in der Tabelle); Zeilenlänge über `max-width` in `ch`.
- **Prüfverfahren.** Blinzeltest (Screenshot stark weichgezeichnet) für Anker und freie Fläche; Flächenanteile über Begrenzungsrahmen am eigenen Screenshot schätzen.

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Ordnungslinien je Ansicht | 1 primäre in 15 von 15; Zweitlinie Ref 02, 03, 11 | 1 primäre + höchstens 1 eingerückte | Regeln Ref 03, 11 |
| Einzug der Zweitlinie | Ref 11 etwa 2–3 % der Breite | 2–4 % der Breite (etwa eine halbe Rasterspalte) | abgeleitet aus Ref 11 |
| Spaltenraster | nicht messbar | 12 / 8 / 4 Spalten, Abstand 16–32 px | Neuentwurf |
| Kopfzeile | Ref 12 etwa 5 % der Höhe, Ref 14 unter 10 % | höchstens 8 % der Viewporthöhe | abgeleitet aus Ref 12, 14 |
| Breite der Lesezone | etwa ¼ (Ref 03) bis 40 % (Ref 02) | 25–42 % (3–5 von 12 Spalten); mobil volle Breite | abgeleitet aus Ref 02, 03, 15; mobil Neuentwurf |
| Freie Fläche, erster Bildschirm | 35–40 % (Ref 03) bis 70–75 % (Ref 10) | Ziel 40–60 %, mindestens 33 % | Spanne Ref 01, 03, 07, 10, 12, 15; Untergrenze Ableitung (5.6.6) |
| Fläche des Fokusträgers | etwa ⅛ (Ref 08) bis rund 40 % (Ref 02) | 15–35 % | abgeleitet aus Ref 03, 07, 08, 10 |
| Textfläche ohne Kulisse | Headline 5–8 % (Ref 10, 12), Navigation unter 3 % (Ref 04) | höchstens 15 % | Summe aus Ref 04, 10, 12, aufgerundet |
| Größenstufen | 2 (Ref 07) bis 3 (Ref 04, 15) | 2–3; Grade innerhalb der Klein-UI höchstens 1,25-fach gespreizt | 5.6.18; Faktor Neuentwurf |
| Sprung Hauptelement : Bedienschrift | rund 3-fach (Ref 06) bis 5–10-fach (Ref 04, 07) | mindestens 3-fach; Desktop etwa 5–12-fach | Ref 04, 06, 07; Obergrenze Neuentwurf |
| Headline : Fließtext | 3-fach (Ref 06) bis 4–5-fach (Ref 11) | Desktop 3–4,5-fach, mobil mindestens 2,25-fach | Ref 02, 06, 11; mobil Neuentwurf |
| Grad der Kulissenschrift | Wort über ¾ bis volle Breite (Ref 03, 05, 15) | Wort über 75–100 % der Bühnenbreite: Grad = Zielbreite ÷ Wortbreite in em (etwa `calc(0.85 * 100cqi / 4.5)` bei 4,5 em Wortbreite, Rückfall `vw`), mindestens 4rem; Versalhöhe höchstens ⅓ der Bühnenhöhe (10.2) | abgeleitet aus Ref 03, 05, 15; Formel Neuentwurf |
| Headline-Grad | nicht messbar | `clamp(calc(2.25 * var(--grad-text)), 1.5rem + 3vw, 4.5rem)`: Untergrenze an den Fließtextgrad gekoppelt, damit mobil 2,25-fach auch bei 18 px Fließtext gilt | Neuentwurf, auf obige Verhältnisse abgestimmt |
| Fließtext / Bedienschrift und Mikrolabel | nicht messbar | 16–18 px / mindestens 14 px und mindestens Fließtext ÷ 1,25 | Neuentwurf; wie 10.10 und 10.9 |
| Schriftfamilien | 2 Rollen (Ref 07); feste Rolle je Gattung (Ref 10, 11, 13) | 1–2, dritte nur mit fester Rolle | Regeln Ref 07, 11 |
| Headline-Zeilen | 1 (Ref 07, 08) bis 3 (Ref 10, 12, 15) | höchstens 3 | Ref 07, 08, 10, 12, 15 |
| Textmenge erster Bildschirm | kurze Stapel, nicht gezählt | höchstens etwa 40 Wörter außerhalb der Navigation; 1 primärer, höchstens 1 sekundärer Handlungsaufruf | Neuentwurf |
| Zeilenlänge Fließtext | nicht messbar | 45–75 Zeichen | Neuentwurf (Konvention) |
| Ebenen | 3–6 (mindestens 3 in 15 von 15) | 3–4; 5–6, wenn die Reihenfolge eindeutig bleibt (vorzugsweise in einer Kamera-Szene) | 5.6.1, 5.4, Ref 15; „Kamera-Szene“ Ableitung aus Ref 15 |
| Verdeckung des Kulissenworts | Wort lesbar (Regeln Ref 05, 07, 15), Anfang und Ende lesbar (Regel Ref 05) | höchstens etwa ein Viertel der Buchstaben wesentlich verdeckt; Wortanfang und Wortende bleiben erkennbar, erster und letzter Buchstabe höchstens teilweise verdeckt (z. B. Fuß oder Randpartie); Randanschnitt siehe 10.5 | Bedingung abgeleitet (Regel Ref 05); Anteil aus Ref 03, 05, 07 (wie 10.2) |
| Überlappung von Flächen | etwa 10 % (Ref 11) | 5–15 % | abgeleitet aus Ref 11 |
| Objektüberstand über eine Containerkante | 4–5 % bzw. etwa ⅕ der Kartenhöhe (Ref 05) | Körper höchstens 10 %, schmale Teile (Kabel, Stiel) höchstens 20 % der Containerhöhe, an genau einer Kante | Ref 05; Obergrenze Körper Neuentwurf (wie 10.6) |
| Anschnitt der Folgesektion | unteres Viertel (Ref 12) | 8–25 % der Viewporthöhe | Ref 12; Untergrenze Neuentwurf |

### Mobil und Barrierefreiheit

- **Neuentwurf.** Die Sammlung zeigt 0 von 15 Mobilansichten. Ref 08 verlangt, die Ebenenverschränkung für schmale Breiten neu zu planen statt herunterzuskalieren; Ref 02 hängt am Desktop-Bildausschnitt. Vorschlag: eigener Bildausschnitt je Breite (`<picture>`, `object-position`). Ab 360 px werden Achsenkreuz und Split zu einem senkrechten Stapel an linker Kante oder Mittelachse: Anker oben, Lesestapel darunter, erster Handlungsaufruf ohne Scrollen sichtbar.
- **Reflow und Zoom.** Kein horizontales Scrollen bis 320 CSS-px (WCAG 1.4.10), 200 % Textzoom (1.4.4) und erweiterte Textabstände (1.4.12) ohne Abschneiden. Schriftgrade nie nur in `vw`.
- **Kontrast.** Bedeutungstragender Text mindestens 4,5:1, große Schrift (ab 24 px oder 18,66 px fett) mindestens 3:1, gemessen gegen die ungünstigste Bildstelle dahinter (Regel Ref 12). Kontrastarm darf nur Kulissenschrift sein (Ref 03 etwa 1,3:1); sie ist dann dekorativ (`aria-hidden="true"`), und ihr Inhalt steht zusätzlich als lesbarer Text da. Der Maßstabssprung entsteht durch Vergrößern des Hauptelements, nie durch Unterschreiten der Mindestgrade.
- **Tastatur.** DOM- und Tab-Reihenfolge folgen dem Lesestapel, nicht der Ebenenfolge. Kein Fokusrahmen wird von Fokusträger oder Kulisse verdeckt (WCAG 2.4.11). Zielgröße mindestens 24 × 24 px (2.5.8), Vorschlag 44 × 44 px.
- **Weniger Bewegung.** Die Komposition ist als Standbild vollständig; Layout und Lesbarkeit hängen nie an einer Animation (siehe 10.7).
- **Leistung.** Fokusträger und Kulissenschrift reservieren ihren Platz (`aspect-ratio` bzw. Abmessungen, Schriftersatz mit `size-adjust`), damit keine Layoutverschiebung entsteht (Vorschlag: CLS unter 0,1). Das größte Element des ersten Bildschirms wird vorrangig geladen; Verfahren und Budget siehe 10.8.

### Prüffragen

1. Lässt sich in jeder Ansicht eine Achse oder gemeinsame Kante einzeichnen, an der Text und Bedienelemente fluchten (in Achsenentwürfen auch der Fokusträger)?
2. Bleibt im Blinzeltest genau eine Stelle dominant, und trägt nur sie den Fokusreiz?
3. Ist mindestens ein Drittel des ersten Bildschirms frei, und ist das Hauptelement bei jeder Breite mindestens dreimal so groß wie die Bedienschrift, bei höchstens drei Größenstufen?
4. Trifft Verdeckung nur Bild, Kulisse und Inhaltsflächen wie Karten, bleiben Navigation, Hauptaktion, alle bedeutungstragenden Texte, Bedienziele samt Trefferfläche und Fokusrahmen unverdeckt, und sind die Texte mit mindestens 4,5:1 (große Schrift 3:1) gegen die ungünstigste Hintergrundstelle lesbar?
5. Funktioniert die Ansicht bei 360 px und 320 px ohne horizontales Scrollen und bei 200 % Zoom, mit Tab-Reihenfolge entlang des Lesestapels?
6. Kommt der erste Bildschirm mit höchstens zwei Schriftfamilien (dritte nur mit fester Rolle) und einem kurzen Textstapel aus?


## 10.2 Räumliche Gestaltung

### Grundsatz

Tiefe ist Ebenenordnung, kein Oberflächeneffekt. Jede Ansicht ist ein eindeutiger Stapel aus Grund, optionaler Schrift- oder Kulissenebene, genau einem Fokusträger und einer flachen, frontalen Bedienschicht; die Tiefe entsteht vorrangig durch Verdeckung zwischen diesen Ebenen. Perspektive und Kamera gehören allein dem Bild.

### Beobachtet in den Referenzen

Die Konsenssicherheit ist eine Obergrenze (simulierte Expertenrollen, 4.6). 9 von 15 Quellen sind perspektivisch verzerrt; alle Größen sind geschätzt.

- **Ebenenordnung.** Räumliche Tiefe ist in 15 von 15 = 100 % deutlich ausgeprägt (stark in 11 von 15), Gegenprobe 14 von 14, Konsenssicherheit hoch. Belegt sind drei bis sechs Ebenen (sechs nur in Ref 15). Häufigste Folge von hinten nach vorn: Grund → Schrift → Freisteller → Bedienschicht (Ref 03, 04, 05, 07, 13, 15).
- **Verdeckung.** Primäres Tiefenmittel in 12 von 15 = 80 % (alle außer Ref 02, 09, 14), Gegenprobe 11 von 14 = 79 %, ein Schwellenfall; mitwirkend in 14 von 15. Beidseitig (Sandwich) in 6 von 15 = 40 % (Ref 03, 04, 06, 08, 13, 15). Ohne Verdeckung staffelt die Bildoptik: Schärfezonen (Ref 02), Größenabnahme im perspektivischen Bogen (Ref 09), Schärfe und Dunst (Ref 14). Schärfestaffelung an Begleitelementen zeigen 5 von 15 (Ref 02, 04, 08, 13, 14), Dunst 2 von 15 (Ref 14, 15).
- **Z-Lage der Bedienschicht.** Frontal und unverzerrt in 15 von 15 = 100 %, Gegenprobe 14 von 14, unabhängig vom Grundton, Konsenssicherheit hoch. Meist liegt sie obenauf. Das Objekt tritt vor Karte und Schriftzug (Ref 05) bzw. vor die Projektkarten (Ref 08); in Ref 12 überdeckt die Folgesektion den Objektfuß.
- **Perspektive.** Deutlich nur in 7 von 15 = 47 % (Ref 02, 09, 10, 12, 13, 14, 15), Gegenprobe 7 von 14 = 50 %, Konsenssicherheit hoch. Drei Stufen: frontal (Ref 01, 04, 05, 06, 07, 08), fotografischer Standpunkt (Ref 02, 03, 11), virtuelle Kamera mit moderatem Sichtfeld (Ref 09, 10, 12, 14, 15). Extreme Optik ist nicht belegt. Die Kameraachse liegt auf der Layoutachse (Ref 09, 15), der Standpunkt hält eine Textzone frei (Ref 14).
- **Vorder- und Hintergrund.** Rahmender Vordergrund (Repoussoir) in 5 von 15 = 33 % (Ref 02, 06, 13, 14, 15). Verankerung ohne Kontaktschatten in 7 von 15 (Ref 07, 08, 09, 10, 12, 13, 15). Ruhiger Grund in 11 von 15 = 73 %, stark ausgeprägt in 0 von 15.
- **Räumliche Dominanz.** Der Fokusträger dominiert über Lage und Ausschließlichkeit (einzigartiger Reiz in 10 von 15), nicht über Fläche: Er belegt etwa ein Achtel (Ref 08) bis knapp ein Drittel der Fläche (Ref 07).
- **Schrift als Tiefenebene.** Raumschrift in 7 von 15 = 47 % (Ref 03, 04, 05, 07, 08, 13, 15), Gegenprobe 6 von 14 = 43 %, Konsenssicherheit hoch. Das Objekt steht vor der Schrift, außer in Ref 08. Raumschrift kommt nur mit plastischem Gegenüber vor (D7 ≥ 2: 7 von 7; D7 ≤ 1: 0 von 4). Die Verdeckung bleibt so klein, dass das Wort lesbar bleibt (Regeln Ref 05, 07, 15); Bild-Wort-Ergänzung in 4 von 15 (Ref 03, 05, 07, 08), Randanschnitt in Ref 04, 08, 15. Die Schriftebene ist in 0 von 7 weichgezeichnet; ausgeblendet wird sie über Deckkraft (Ref 03, 13). Schrift im Raum bleibt kameraparallel (Ref 15) oder wird Objekttextur (Ref 09). Größen und Verdeckungsanteile stehen in der Tabelle unten.
- **Zeit.** Parallaxe ist nirgends als Verhalten belegt, nur als Struktur (Ref 06: sechs Ebenen in einem Parallax-Wrapper); Kamerafahrten: 0 Belege.

### Regeln

1. **[Pflicht]** Jede Ansicht hat mindestens drei Ebenen in eindeutiger Stapelfolge: Grund, gegebenenfalls Schrift oder Kulisse, genau ein Fokusträger, Bedienschicht. Jedes Element gehört genau einer Ebene an.
2. **[Pflicht]** Die Tiefe ist vorrangig an mindestens einer sichtbaren Verdeckung ablesbar (Ausnahme: Regel 3); ein Schlagschatten trägt sie nie (siehe 10.4).
3. **[Variabel]** Statt Verdeckung darf die Bildoptik (Schärfezonen, Größenabnahme, Dunst) staffeln, wenn das Bildmedium sie liefert (Ref 02, 09, 14). Drei bis vier Ebenen; Verdeckung einseitig oder beidseitig, Richtung frei.
4. **[Pflicht]** Die Bedienschicht ist frontal und orthogonal: keine 3D-Transformation, keine Kippung, keine perspektivische Schrift, kein Tilt bei Hover oder Zeigerbewegung.
5. **[Variabel]** Ein Bildobjekt darf vor Inhaltsflächen treten (Karten, Kulissenschrift; Ref 05, 08), nie vor Navigation, Hauptaktion, Lesetext oder ein fokussiertes Element (Ableitung aus der Regel in Ref 04, die Navigationszone freizuhalten).
6. **[Variabel]** Bildperspektive frontal, fotografisch oder als virtuelle Kamera mit moderatem Sichtfeld. In Achsenentwürfen liegt die Kameraachse auf der Layoutachse (Ref 09, 15); sonst ist der Standpunkt frei, die Textzone bleibt frei (5.3).
7. **[Pflicht]** Genau ein Fokusträger bildet den räumlichen Schwerpunkt; kein Begleitelement konkurriert mit ihm um Lage oder Reiz. Wie er dominiert (Lage, Reiz, Schärfe), ist frei. Der Grund bleibt untergeordnet (siehe 10.4).
8. **[Variabel]** Raumschrift nur mit plastischem Gegenüber (Rahmen aus 5.3; als Ausschluss 10.10, Nr. 9), als ein Wort im Riesengrad. Verdeckung trifft nur Binnenbuchstaben oder Buchstabenteile; Anschnitt am Rand höchstens an einem Wortende, außer der Schriftzug wiederholt sich als Band, sodass das Wort aus den Fragmenten erkennbar bleibt (Ref 08: Name als Laufband „…ppy lemon happ…“, an beiden Rändern angeschnitten, kein Exemplar vollständig).
9. **[Pflicht]** Fokusträger und Schriftebenen bleiben scharf. Kontrastarme Kulissenschrift trägt nie allein Bedeutung; ihr Inhalt steht zusätzlich als lesbarer, zugänglicher Text bereit (5.5; WCAG 2.2, 1.4.3).
10. **[Optional]** Bild-Wort-Ergänzung (Ref 03, 05, 07, 08), Deckkraftverlauf der Kulissenschrift (Ref 03, 13), Punze als Bildfenster (Ref 15). Bedingung: Regeln 8 und 9 sind erfüllt.
11. **[Optional]** Schärfestaffelung an Begleitelementen, Repoussoir, Dunst mit zur Ferne abnehmendem Kontrast (nur in Kamera-Szenen, Regel Ref 15), fünf bis sechs Ebenen, wenn die Reihenfolge eindeutig bleibt (Ref 15; Vorschlag: vorzugsweise in einer Kamera-Szene, Ableitung aus Ref 15). Bedingung: Kein Vordergrund verdeckt Text.
12. **[Optional]** Bewegte Tiefe (Parallaxe, Kamerafahrt) ist Neuentwurf (nicht beobachtet): Sie bewegt nur Bildebenen, die Bedienschicht ruht, und der Ruhezustand trägt als Standbild die volle Komposition (siehe 10.7).

### Umsetzung (Vorschlag)

Alle Werte sind Vorschläge; „Neuentwurf“ heißt ohne Beleg.

- **Ebenen als Z-Tokens.** Feste Stufen statt freier `z-index`-Werte, abgestimmt auf 10.1: `--z-grund: 0`, `--z-kulisse: 10`, `--z-motiv: 20`, `--z-vordergrund: 25`, `--z-ui: 30`, `--z-overlay: 40`. Die Reihenfolge folgt Ref 03, 04, 05, 07, 13, 15, der Vordergrund Ref 13 und 15; die Zahlen sind Neuentwurf. Für Schrift vor Objekt (Ref 08) tauschen Kulisse und Motiv. Die Bühne erhält `isolation: isolate`, die Ebenen liegen in einer Rasterzelle (`grid-area: 1 / 1`).
- **Verdeckung.** Freisteller mit Alphakanal über Live-Text (Hypothese aus den Profilen; Formate siehe 10.6, 10.8). Ebenen über der UI erhalten `pointer-events: none` (Regel Ref 06).
- **Raumschrift.** Ein Wort als Live-Text, Größe aus der Bühnenbreite (`clamp()` mit `vw`); Anschnitt per `overflow: clip` an der Bühne, nie am Dokument; Ausblendung per `mask-image`, nie per `filter: blur()`.

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Ebenen je Ansicht | 3–6; mindestens 3 in 15 von 15 | 3–4; 5–6, wenn die Reihenfolge eindeutig bleibt (vorzugsweise in einer Kamera-Szene) | Ref 15, 5.4; „Kamera-Szene“ Ableitung aus Ref 15; über 6 nicht belegt |
| Z-Stufen | Grund → Schrift → Freisteller → (Vordergrund) → UI | 0 / 10 / 20 / 25 / 30 / 40 | Reihenfolge belegt, Zahlen Neuentwurf (wie 10.1, plus Vordergrund) |
| Sichtbare Verdeckungen | primär in 12 von 15 | mindestens 1 je Ansicht | Prinzip Nr. 2 |
| 3D-Transformation der UI | 0 von 15 | keine | Prinzip Nr. 1 |
| Vertikales Sichtfeld der Bildkamera | „moderat“ (Ref 09, 10, 12, 15), „eher lang“ (Ref 05), nur qualitativ | 15–40° (≈ 33–90 mm Kleinbild) | Neuentwurf: übersetzt „moderat“ in eine Zahl |
| Schärfestufen | bis 3 (Ref 02, 08) | höchstens 3, Fokus und Schrift scharf | Ref 02, 08 |
| Versalhöhe der Raumschrift | 15–20 % (Ref 04), rund 1/5 (Ref 08), rund 1/3 (Ref 15) der Bildschirmhöhe | 15–33 % der Bühnenhöhe (Desktop) | Spanne der Belege |
| Breite der Raumschrift | fast volle Breite (Ref 03, 15), 3/4 der Kartenbreite (Ref 05) | 75–100 % der Bühnenbreite oder randabfallend | Ref 03, 05, 15 |
| Verdeckter Anteil am Wort | 1 Buchstabe plus Teile zweier von 8 (Ref 03), Teil eines Buchstabens (Ref 07), 2 von 7 fragmentarisch (Ref 05) | höchstens etwa ein Viertel der Buchstaben wesentlich verdeckt; Wortanfang und Wortende bleiben erkennbar, erster und letzter Buchstabe höchstens teilweise verdeckt (z. B. Fuß oder Randpartie) | Ref 03, 05, 07; Anfang und Ende aus der Regel Ref 05 |
| Verdeckung an der Unterkante | Gras über den Buchstabenfüßen (Ref 15) | höchstens unteres Viertel der Versalhöhe | Neuentwurf, angelehnt an Ref 15 |
| Vordergrund (Repoussoir) | unteres Fünftel bis Viertel (Ref 15) | Randstreifen bis 25 % der Höhe oder Breite | Ref 15 |
| Kontrast der Kulissenschrift | etwa 1,3:1 (Ref 03) | unter 3:1 nur redundant und `aria-hidden`; als Überschrift mindestens 3:1 (großer Text) | Ref 03; WCAG 1.4.3 |
| Mobil ab 360 px | 0 von 15 belegt | 3–4 Ebenen; Raumschrift 90–100 % Breite oder einseitig randabfallend | Neuentwurf |
| Parallaxe | nicht belegt (nur Struktur, Ref 06) | nur Bildebenen, Bedienschicht ohne Versatz; Faktoren siehe 10.7; bei „weniger Bewegung“ keine | Neuentwurf (nicht beobachtet) |

### Mobil und Barrierefreiheit

- **Mobil ist Neuentwurf** (0 von 15 Mobilansichten). Die Ebenenverschränkung wird für schmale Viewports eigens geplant, nicht nur verkleinert (Regel Ref 08). Ab 360 px: drei bis vier Ebenen, Raumschrift als kurzes Wort mit 90–100 % Breite oder einseitig randabfallend; ohne freie Bildzone steht der Text unter der Bühne. Kamera-Szenen erhalten einen eigenen Hochformat-Ausschnitt (`<picture>`), der die Textzone freihält. Bis 320 px Breite entsteht kein horizontaler Seitenscroll (WCAG 1.4.10).
- **Kontrast.** Lesetext mindestens 4,5:1, großer Text 3:1, Bedienelemente und Fokusanzeige 3:1 (1.4.11), jeweils gegen die ungünstigste Bildpartie dahinter (Regel Ref 12).
- **Reihenfolge und Tastatur.** Das DOM folgt der Lesefolge, nicht der Stapelfolge; dekorative Ebenen sind `aria-hidden="true"`. Keine Bildebene verdeckt ein fokussiertes Element (2.4.11). Tippziele mindestens 24 × 24 CSS-px (2.5.8), besser 44 × 44.
- **Weniger Bewegung.** Bei `prefers-reduced-motion: reduce` entfallen Parallaxe und Kamerafahrt; die Ansicht bleibt als Standbild vollständig.
- **Leistung.** Fokusträger und LCP-Element werden vorrangig geladen, das LCP-Element auch dann, wenn es eine Kulisse ist (Kulissenbühne, Ref 04); nachrangig laden nur übrige Kulissen und Vordergründe sowie Ebenen außerhalb des ersten Bildschirms. Keine Live-Unschärfe auf vollflächigen Ebenen beim Scrollen; Echtzeit-3D nur mit statischem Ersatzbild (siehe 10.8).

### Prüffragen

1. Gehört jedes Element genau einer von mindestens drei Ebenen an, und ist deren Reihenfolge eindeutig?
2. Ist die Tiefe an einer Verdeckung (oder an der Bildoptik) ablesbar, ohne tragenden Schlagschatten?
3. Ist die Bedienschicht frontal, und bleiben Navigation, Hauptaktion, Lesetext und Fokus unverdeckt?
4. Ist ein verdecktes Kulissenwort ohne Kontext lesbar, und steht sein Inhalt zusätzlich als zugänglicher Text mit ausreichendem Kontrast bereit?
5. Liegt in Achsenentwürfen die Kameraachse auf der Layoutachse, und bleibt bei jedem Standpunkt die Textzone frei?
6. Trägt die Ansicht bei 360 px Breite und mit „weniger Bewegung“ als Standbild die volle Ebenenordnung?


## 10.3 Materialien und Oberflächen

### Grundsatz

Material ist ein Gefälle: Es sitzt im Fokusträger oder in einer vermittelnden Glasschicht, die Bedienschicht bleibt matt, glatt und ohne Eigenmaterial. Detail besetzt den Fokus und die Kante, nie die Fläche. Unschärfe trennt Ebenen; Fixationspunkt und Schrift bleiben scharf.

### Beobachtet in den Referenzen

Die Konsenssicherheit ist eine Obergrenze (simulierte Expertenrollen, 4.6). Radien, Deckkraft und Konturstärken sind in keiner Referenz messbar; Zahlen aus Ref 01 stammen aus einem unverzerrten Bildschirmfoto und gelten als Näherung.

- **Materialität.** D2 deutlich in 11 von 15 = 73 % (Gegenprobe 10 von 14 = 71 %), stark in 6 von 15, Höchstwert 4 nur Ref 01 und 10; Konsenssicherheit hoch. Ohne Materialanmutung: Ref 02, 06, 11, 15. Mit Raumschrift konkurriert Material (ρ = −0,26, Hinweis bei n = 15).
- **Ort.** Material im Bildobjekt vor materialloser UI: Ref 04, 05, 07, 08, 09, 10, 12. Materialgefälle „Plastik nur im Motiv“ weit 11 von 15 = 73 %, streng 7 von 15 = 47 %. Opakes UI-Material fehlt in 13 von 15 = 87 % (Gegenprobe 12 von 14); schwache Ausnahmen: kissenartige Kacheln (Ref 05), Glow-Kacheln (Ref 13, nicht DNA-konform).
- **Materialarten am Motiv.** Glas (Ref 03, 05, 07), Metall (Ref 04, 07, 09, 12), Hochglanz-Lack bzw. Kunststoff (Ref 09, 10), Matt (Ref 04, 05, 13, 15), organisch (Ref 08); in Ref 10 fünf Oberflächen an einer Grundform. Glanz und Spiegelung am Motiv: siehe 10.4.
- **Glas.** Transluzente UI in 6 von 15 = 40 % (Ref 01, 02, 03, 12, 13, 14; Gegenprobe 6 von 14 = 43 %), mit belegter Hintergrundunschärfe nur 4 von 15 = 27 % (Ref 01, 03, 12, 14), über einem Bildmotiv nur Ref 03, 12, 14. Bauweise: halbtransparente Füllung, Unschärfe, helle Haarkante, kein Schlagschatten (Ref 03, 12, 14; Ref 01 mit blassem Begleitschatten). In Ref 03 wirkt das Glas nur über dem Motiv, über leerem Verlauf kaum. Ref 12 stuft zwei Unschärfen: leicht, wo das Objekt erkennbar bleibt, stark unter Text. Ref 01: Untergrund aufgehellt und leicht entsättigt, Rasterlinien von gut 20 auf etwa 3 Tonwerte gedämpft, Glasfläche nur 1,05–1,1:1 heller als der Grund. Höchstens zwei Glasflächen mit Unschärfe je Ansicht (Ref 01, 03, 12).
- **Rangcode.** Glas gegen opak (Ref 03), Deckkraft (Ref 02), Wechsel von Vollton und Glas (Ref 14).
- **Unschärfe.** D4 deutlich in 11 von 15 = 73 % (Gegenprobe 10 von 14 = 71 %), Konsenssicherheit mittel. Orte: Glas, Tiefe (siehe 10.2), Bewegung im Motiv (siehe 10.7), gerichteter Verlaufs-Blur statt Bildkante (Ref 03). Schrift weichgezeichnet in 0 von 7 Typo-Bild-Sandwich-Referenzen. Unschärfe ist von Kompression nicht sicher zu trennen (Ref 04, 07, 09, 15).
- **Reflexion und Kanten in der UI.** Nur heller Kantensaum (Ref 01, 03, 12), Farbübertrag und Randbrechung am gekrümmten Glasrand (Ref 01). Haarfeine Lichtkante oder Kontur statt Schatten in 6 von 15 = 40 % (Ref 01, 03, 10, 11, 12, 14), oben stärker (Ref 01); Stärken geschätzt.
- **Textur, Korn, Raster.** Feindetail deutlich in 10 von 15 = 67 % (Gegenprobe 10 von 14 = 71 %), Konsenssicherheit mittel; es sitzt am Objekt oder an UI-Kanten, Grundflächen sind glatt. Technische Mikroschicht in 5 von 15 = 33 % (Ref 01, 10, 11, 13, 14). Raster als Grund nur Ref 01 (etwa 1,2:1, Näherung) und Ref 11. Körnung in 0 von 15 belegt (Ref 11 unsicher); wegen Kompression kein Befund dagegen.
- **Lesbarkeit.** Kontrastarmer Kleintext auf Glas ist in Ref 02, 03 und 12 als Risiko benannt.

### Regeln

1. **[Pflicht]** Buttons, Karten, Navigation und Felder tragen kein opakes Eigenmaterial: kein Metall, kein Relief, keine Prägung, keine Kissenform, keinen Glanz, keine Spiegelung und keine Bildtextur als Füllung (Nr. 9). Glas fällt nicht darunter (Regel 6).
2. **[Pflicht]** Keine vollflächige Textur (Korn, Rauschen, Papier, Stoff, Ornament) auf der Bedienschicht oder unter Lesetext; Grund- und UI-Flächen bleiben glatt. Ausgenommen ist sichtbares Korn als Neuentwurf: Körnung ist nicht belegt, wegen Kompression aber auch kein Befund dagegen (5.6.12); sie liegt nie auf UI-Flächen und nie unter Lesetext (Nr. 9 und 11).
3. **[Pflicht]** Konturen der Bedienschicht sind haarfein und wirken als Kante, nie als Rahmen; Figur-Grund-Kanten entstehen ohne tragenden Schlagschatten (Nr. 6; Rahmen aus 5.3).
4. **[Pflicht]** Fixationspunkt, Schriftebene und Lesetext werden nie weichgezeichnet; Unschärfe liegt nur hinter Glas, an Begleitelementen oder in Motivteilen abseits des Fixationspunkts (Rahmen aus 5.3).
5. **[Variabel]** Material als Ausdrucksträger ist frei (11 von 15). Wird es eingesetzt, hat es einen Hauptträger, den Fokusträger oder die Glasschicht; Art (Glas, Metall, Lack/Kunststoff, Matt, organisch), Medium (Render, Foto) und Intensität 1–4 sind frei. Zwei gleichrangige Materialträger sind ausgeschlossen (Ableitung).
6. **[Variabel]** UI-Flächen sind opak und flach oder transluzent (6 von 15). Glas braucht mindestens eine Fläche direkt über gesättigtem Bildinhalt (Regel in Ref 03); Glas ganz ohne sichtbar gefilterten Inhalt ist ausgeschlossen (Ableitung). Jede Glasfläche hat eine helle Haarkante und keinen Schlagschatten.
7. **[Variabel]** Material darf Rang codieren: opak für Rang oder aktiv, transluzent für sekundär (Ref 02, 03, 14). Je Produkt gilt ein Kanal für Rang bzw. „aktiv“ und einer für Hover, jeder überall gleich; der Fokus ist davon getrennt immer eine Kontur (siehe 10.7, Regel 8).
8. **[Variabel]** Art (Glas, Tiefe, Verlauf) und Intensität der Unschärfe sind frei; Glasunschärfe hat höchstens zwei Stufen je Ansicht, die stärkere liegt unter Text (Ref 12). Unschärfe trennt Ebenen und verwischt nie die ganze Fläche (Ableitung; Schärfestufen der Tiefe siehe 10.2).
9. **[Optional]** Glas mit Hintergrundunschärfe (Ref 01, 03, 12, 14), abgestuft auf mehreren Ebenen (Ref 12). Bedingung: Regel 6; ohne `backdrop-filter` eine nicht deckende Ersatzfüllung wie ein Scrim, deckend nur bei reduzierter Transparenz oder erhöhtem Kontrast.
10. **[Optional]** Material als Thema, Explosionsansicht (Ref 01, 10), Farbübertrag oder Randbrechung (Ref 01). Bedingung: ein Objekt bzw. Glas über gesättigter Fläche; Verzerrung nur am Rand; die Bedienschicht bleibt materiallos.
11. **[Optional]** Gerichteter Verlaufs-Blur statt Bildkante (Ref 03). Bedingung: Freisteller auf gleichem Grund, Fixationspunkt scharf.
12. **[Optional]** Technische Mikroschicht und kontrastarmes Raster (Ref 01, 10, 11, 13, 14). Bedingung: technikbetonter Inhalt, haarfein, nie unter Fließtext.

### Umsetzung (Vorschlag)

Alle Werte sind Vorschläge. Belegt sind Bauweise und Verhältnisse, kaum Zahlen; „Neuentwurf“ heißt ohne Beleg.

- **Glas:** `backdrop-filter: blur()`, halbtransparente Füllung, 1-px-Kante (Hypothese der Profile Ref 01, 03, 12, 14). Text liegt im Glaselement über dem Filter, nie unter `filter: blur()`. Sättigungsanhebung ist verbreitet, aber nicht erforderlich; Ref 01 zeigt eher Entsättigung. Randbrechung ist optional (SVG-Filter oder Shader, siehe 10.8).
- **Motivmaterial:** im Render oder Foto eingebacken (PBR mit Transmission, Clearcoat, Iridescence; Hypothese zu Ref 05, 09, 10, 12), als Bild mit Alphakanal; Glanz nie per CSS an UI-Flächen.
- **Raster:** CSS-Verlaufsmuster mit 1-CSS-px-Linien oder Punkten, Maß aus dem Layoutraster (siehe 10.1).
- **Korn gegen Streifen** (Neuentwurf, kein Signature-Effekt): nur als unsichtbares Dithering in großen Verläufen, ins Verlaufsbild einbacken, nicht als Overlay-Ebene (Streifen in dunklen Verläufen zeigt Ref 12, wahrscheinlich Kompressionsartefakt).

```css
.glas {
  background: rgb(var(--glas-ton) / var(--glas-fuellung));
  -webkit-backdrop-filter: blur(var(--glas-blur));
  backdrop-filter: blur(var(--glas-blur));
  border: 1px solid rgb(var(--kante-ton) / var(--kante-alpha));
  box-shadow: inset calc(var(--licht-x) * 1px) calc(var(--licht-y) * 1px) 0 rgb(var(--kante-ton) / var(--kante-licht)); /* Saum an der lichtzugewandten Seite stärker (10.4, Regel 9); Ref 01: oben */
}
.glas--text { --glas-blur: var(--blur-stark); --glas-fuellung: var(--fuellung-text); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glas { background: rgb(var(--glas-ton) / var(--fuellung-ersatz)); } /* nicht deckend, wie ein Scrim; Text erreicht 4,5:1 */
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glas { -webkit-backdrop-filter: none; backdrop-filter: none;
          background: rgb(var(--glas-ton) / var(--fuellung-deckend)); }
}
```

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Opakes UI-Material | fehlt in 13 von 15 | keines | Nr. 9 |
| Material-Hauptträger je Ansicht | einer oder keiner; Glas plus Materialmotiv nur Ref 03, 12, 14 | ≤ 1, Glas daneben nur vermittelnd | Ableitung aus 5.3 |
| Oberflächen an einem Objekt | bis 5 (Ref 10) | ≤ 5, nur am Fokusträger | Ref 10 |
| Glasflächen mit Unschärfe, gleichzeitig sichtbar | ≤ 2 (Ref 01, 03, 12) | ≤ 2 mobil, ≤ 3 Desktop | wie 10.8 |
| Stufen der Glasunschärfe | 2 (Ref 12) | ≤ 2; stark ≥ 2 × leicht | Stufenzahl Ref 12, Verhältnis Neuentwurf |
| Blur leicht (Motiv erkennbar) | Ring als weiche Form erkennbar (Ref 12), Radius nicht messbar | 8–16 px | Neuentwurf |
| Blur stark (Text auf Glas) | nur Farbflecken (Ref 12); Raster um etwa 85 % gedämpft (Ref 01) | 24–40 px; feine Strukturen unter Text ≥ 80 % gedämpft | Dämpfung aus Ref 01, Radius Neuentwurf |
| Füllung über Bildinhalt | Aufhellung rechnerisch etwa 20–30 % Weiß, aus den Näherungswerten des Profils, Unschärfe eingeschlossen (Ref 01) | 15–30 % Deckkraft | aus Ref 01 |
| Füllung unter Kleintext | dunklere Panelfüllung (Ref 12) | 40–65 %, bis 4,5:1 erreicht ist | Neuentwurf nach WCAG |
| Sättigung im Glas | leicht entsättigt (Ref 01) | 90–100 %, keine Anhebung | Ref 01 |
| Glaskante, Kontur | haarfein, hell, oben stärker (Ref 01, 03, 12, 14); Stärke geschätzt | 1 CSS-px (Fokusring ausgenommen), Deckkraft wie Lichtkante in 10.4, an der lichtzugewandten Seite stärker | Neuentwurf; Richtung nach 10.4, Regel 9 (Ref 01: oben) |
| Schatten unter Glas | keiner (Ref 03, 12, 14) | `none` | Nr. 6 |
| Abhebung Glas vom Grund | 1,05–1,1:1 (Ref 01) | frei, wenn Inhalt das Element erkennbar macht; sonst Kante ≥ 3:1 | Ref 01; WCAG 1.4.11 |
| Hintergrundraster | etwa 1,2:1 (Ref 01, Näherung) | 1 CSS-px, ≤ 1,3:1, nie unter Fließtext | Ref 01, 11 |
| Sichtbares Korn | 0 von 15 belegt (wegen Kompression kein Befund dagegen) | Neuentwurf; nie auf UI-Flächen, nie unter Lesetext | 5.6.12; Grenze aus Nr. 9 und 11 |
| Dithering in Verläufen | nicht beobachtet | ± 1–2 von 255 Tonwerten, eingebacken | Neuentwurf |
| Materialbewegung (Glanz, Brechung, Glasverformung) | nicht belegt | Ruhezustand statisch (siehe 10.7); Glas der Bedienschicht verformt sich nie, auch nicht animiert | Neuentwurf (nicht beobachtet); 10.5, Regel 3 |

### Mobil und Barrierefreiheit

- **Mobil ist Neuentwurf** (0 von 15 Mobilansichten). Ab 360 px wird geprüft, ob im Hochformatschnitt noch gesättigter Inhalt unter dem Glas liegt; sonst entfällt das Glas (Regel 6) zugunsten einer nicht deckenden Lösung: Scrim oder nicht deckende Ersatzfüllung, oder der Text steht über bzw. unter dem Bild (wie 10.6, Mobil). Deckend wird die Fläche nur bei reduzierter Transparenz oder erhöhtem Kontrast (Regel 9). Kein Blur über bewegtem Motiv (siehe 10.8); Raster und Mikroschicht dünnen aus oder entfallen.
- **Kontrast:** Text auf Glas erreicht 4,5:1, großer Text 3:1, gegen die ungünstigste Partie des ungefilterten Untergrunds (Regel Ref 12). Ist eine Kante die einzige Grenze eines Bedienelements, braucht sie 3:1 (1.4.11). Transparenz ist nie das einzige Zustandssignal (1.4.1).
- **Systemeinstellungen:** Bei `prefers-reduced-transparency` (wo unterstützt) und `prefers-contrast: more` wird Glas deckend; unter `forced-colors: active` bleibt die 1-px-Kante als Grenze sichtbar.
- **Tastatur:** Der Fokusring liegt über Glas und Grund, hat gegen beide 3:1 und wird von keiner Ebene verdeckt (2.4.7, 2.4.11).
- **Weniger Bewegung:** Materialien sind statisch. Wandernde Glanzlichter oder zeigergeführte Brechung sind Neuentwurf (nicht beobachtet) und entfallen unter `prefers-reduced-motion: reduce`. Glas der Bedienschicht verformt sich nie, auch nicht animiert (10.5, Regel 3; 10.10, Nr. 4).
- **Leistung:** `backdrop-filter` kostet GPU-Leistung (Profile Ref 01, 02, 03, 12, 13): Glasflächen klein halten, Blur-Radius nie animieren, Material und Glanz ins Asset backen, Korn nicht als große Overlay-Datei laden.

### Prüffragen

1. Ist die Bedienschicht frei von Metall, Relief, Glanz, Kissenform und vollflächiger Textur, mit Glas als einziger Ausnahme?
2. Hat die Ansicht höchstens einen Material-Hauptträger (Fokusträger oder Glasschicht), und tritt eine Glasschicht neben einem Materialmotiv nur vermittelnd hinzu?
3. Falls Glas eingesetzt wird: Liegt mindestens eine Glasfläche direkt über gesättigtem Bildinhalt, und hat jede Glasfläche Haarkante, keinen Schlagschatten und eine Ersatzfüllung (ohne `backdrop-filter` nicht deckend, bei reduzierter Transparenz oder erhöhtem Kontrast deckend)?
4. Sind Fixationspunkt, Schriftebene und Lesetext scharf, und erreicht Text auf Glas 4,5:1 gegen die ungünstigste Partie des Untergrunds?
5. Sind Konturen, Raster und Mikroschicht haarfein, liegt kein Raster unter Fließtext, und liegt kein Korn auf UI-Flächen oder unter Lesetext?
6. Bleibt die Ansicht ohne `backdrop-filter`, mit reduzierter Transparenz und unter `forced-colors` lesbar und bedienbar?


## 10.4 Licht und Schatten

### Grundsatz

Licht gehört dem Motiv und bündelt den Fokus über Ausschließlichkeit: ein Lichtkern, ein Helligkeitszentrum hinter dem Fixationsanker, eine Richtung je Ansicht. Die Bedienschicht bleibt unbeleuchtet, glanzlos und ohne tragenden Schatten. Schatten ist höchstens ein weicher, blasser Begleiter auf heller Fläche; auf dunklem Grund trennt Licht statt Schatten.

### Beobachtet in den Referenzen

- **Schatten.** Ein Schlagschatten als tragendes Tiefenmittel fehlt in 12 von 15 = 80 % (Gegenprobe 11 von 14; Konsenssicherheit D4 mittel, Schwellenfall). Die Ausnahmen Ref 01, 05 und 11 setzen ihn weich und nur auf heller Fläche (3 von 3). Maßstab ist Ref 01 (unverzerrter Screenshot): großflächig, weit nach unten versetzt, etwa 5–7 Tonwerte dunkler (Näherung). Der Objektschatten in Ref 05 (bis etwa 40 % unter dem Umfeld, geschätzt) bleibt Einzelfall. Sonst erscheint Schatten als Eigenschatten im Render (Ref 09, 10, 12, 14) oder gezeichnet (Ref 06). Verankert wird ohne Kontaktschatten in 7 von 15 = 47 % (Ref 07, 08, 09, 10, 12, 13, 15).
- **Streuung und Weichheit.** Alle belegten Schlagschatten sind weich, großflächig nur in Ref 01 und 05; Ref 11 zeigt einen schmalen, weichen Schatten mit geringem Versatz (Abfall über etwa 10–15 px, nur auf dem hellen Screenshot messbar). Einen harten Schatten zeigt keine Referenz (eigene Durchsicht). Radien sind nicht messbar. D4 (deutlich 11 von 15) speist sich überwiegend aus Unschärfe (siehe 10.2, 10.3); Expertenspannweite Ø 0,73, die höchste der statischen Dimensionen, niedrige Konfidenz 28 %.
- **Licht am Motiv.** D3 deutlich 11 von 15 = 73 % (Gegenprobe 11 von 14 = 79 %, Grenzfall); Konsenssicherheit hoch. Licht ist in 10 von 15 auf das Hauptmotiv beschränkt oder dort am stärksten (Ref 02, 03, 05, 07, 08, 09, 10, 12, 14, 15). Stufen: eingebackenes Studiolicht (Ref 04, 07, 08, 10), Kantenlicht an dunklen Körpern (Ref 09, 10), selbstleuchtende Quelle mit Lichthof (5 von 15: Ref 05, 09, 12, 14, 15). Ein zonierter Lichtraum mit einem Zentrum und höchstens drei Zonen steht in 4 von 15 hinter dem Motiv (Ref 03, 09, 12, 15; geschätzt). Licht als Fokusreiz: Wärme (Ref 03, 05), Tonwertumkehr (Ref 09), Helligkeit (Ref 12, 15).
- **Leuchten in der Bedienschicht.** Kein Licht als UI-Flächenmittel in 14 von 15 = 93 %; die Ausnahme, die Glow-Kacheln in Ref 13, führt Kapitel 5 als nicht DNA-konform. Belegt sind nur kleine Säume: Ref 05 (Aktivquadrat), Ref 09 (Pille, evtl. Hover-Zustand), Ref 13 (aktiver Reiter), Ref 10 (Headline, evtl. Kamera-Überstrahlung). Emissives Licht steht überwiegend auf dunklem Grund (3 von 7 gegen 1 von 6; Ref 14 fotografisch gemischt), ohne Regel zu sein (Ref 05, 13).
- **Figur-Grund-Trennung.** Hell über weichen Schatten oder Kantensaum (Ref 01, 05, 11), dunkel über Kantenlicht, Lichtkante oder Lichtsaum (Ref 08, 09, 10, 12). Haarfeine Lichtkante oder Kontur statt Schatten in 6 von 15 = 40 % (Ref 01, 03, 10, 11, 12, 14; Konsenssicherheit D12 mittel).
- **Beleuchtungsrichtung** (eigene Zuordnung aus den D3/D4-Beobachtungen, Konfidenz niedrig). Eine gemeinsame Richtung gibt es nicht: von oben Ref 01, 06, 08, 09 (Ref 10 Hypothese), seitlich Ref 02, 03, 05, 07, aus dem Motiv Ref 12, 15, diffus Ref 04, 11, 13, 14. Die Richtung sitzt im Asset; nur Ref 01 gibt UI-Elementen eine (Saum oben heller, Schatten senkrecht darunter). Umgebungslicht und Displayspiegelung verfälschen Ref 04, 07, 09, 14, 15.
- **Reflexion.** Glanz- und Spitzlichter oder Spiegelungen liegen am Motiv in 10 von 15 (Ref 02, 03, 04, 05, 07, 08, 09, 10, 12, 14; eigene Zählung). In der UI erscheint Reflexion nur als heller Glaskantensaum (Ref 01, 03, 12) und Farbübertrag (Ref 01); Glanz an opaker UI fehlt in 13 von 15 (Nr. 9). Bloom ist von Kamera-Überstrahlung nicht zu trennen (Ref 08, 09, 10).
- **Lichtbewegung.** Nicht belegt; 10 Profile vermerken sie als nicht prüfbar (Ref 01, 03, 05, 07, 09, 10, 12, 13, 14, 15).

### Regeln

1. **[Pflicht]** Karten, Buttons, Navigation und Objekte tragen keinen Schlagschatten als Tiefenmittel; Tiefe entsteht über Verdeckung, Unschärfe, Licht oder haarfeine Kante (Nr. 6).
2. **[Pflicht]** Keine Elevationsskala, kein Neumorphismus (5.5); je Ansicht höchstens eine Schattenstufe (Ableitung).
3. **[Pflicht]** Keine Fläche der Bedienschicht leuchtet: kein flächiger Glow, kein Leuchtverlauf als Füllung von Buttons, Karten oder Text (Nr. 10).
4. **[Pflicht]** Bedienelemente tragen keinen Glanz, keine Spiegelung und keinen Metallreflex (Nr. 9). Eine haarfeine Glaskante ist zulässig.
5. **[Pflicht]** Der Grund hat höchstens ein Helligkeitszentrum, und zwar hinter dem Fokusträger, und höchstens drei Lichtzonen (Nr. 11).
6. **[Variabel]** Gestaltetes Licht ist frei in Quelle (Studio im Asset, emissiv, gezeichnet, fotografisch) und Intensität (1–3). Wird es eingesetzt, sitzt es am Hauptmotiv; mehrere gleich helle Lichtkerne sind ausgeschlossen (Ableitung). Ein Render der Stufe 4 bekommt gestaltetes Licht (6 von 6 mit D3 ≥ 2; Rahmen aus 5.3, als Ausschluss 10.10, Nr. 9).
7. **[Variabel]** Die Figur-Grund-Trennung folgt dem Grundton: auf heller Fläche Begleitschatten oder Kantensaum, auf dunkler Fläche Licht (Kantenlicht, Lichtkante, Lichtsaum), nie Schatten.
8. **[Variabel]** Eine haarfeine Lichtkante oder Kontur darf den Schatten ersetzen (6 von 15); sie bleibt Kante, nie Rahmen.
9. **[Variabel]** Die Lichtrichtung ist frei, je Ansicht aber genau eine: Schatten, Kantensaum und Glanzlichter widersprechen sich nicht (Ableitung aus Ref 01).
10. **[Variabel]** Verankert wird ohne Kontaktschatten; das Mittel ist frei (7 von 15; siehe 10.6).
11. **[Optional]** Weicher, blasser Begleitschatten (Ref 01, 05, 11): nur auf heller Fläche, so zurückgenommen wie in Ref 01 und neben Verdeckung oder Bildoptik.
12. **[Optional]** Selbstleuchtende Quelle mit Bloom (5 von 15): ein dominanter Lichtkern am Fixationsanker, weitere Leuchtinseln deutlich schwächer.
13. **[Optional]** Zonierter Lichtraum hinter dem Fokusträger (4 von 15), innerhalb von Regel 5.
14. **[Optional]** Kantenlicht (Ref 09, 10) nur bei dunklem Körper auf dunklem Grund; Low-Key-Szene mit Leuchtinseln (Ref 15) nur als Kamera-Szene mit flächenloser Rand-UI.
15. **[Optional]** Schein als Zustand (Ref 13; Ansätze Ref 05, 09): nur als Saum an genau einem aktiven Element, nie als einziges Zustandssignal.

### Umsetzung (Vorschlag)

Alle Werte sind Vorschläge. Radien, Deckkraft und Stärken sind in den Referenzen nicht messbar; abgeleitet ist meist nur das Verhältnis.

- **Lichtrichtung als Token:** `--licht-x` und `--licht-y` geben je Ansicht die Richtung an, in die das Licht fällt (Anteile von −1 bis 1; Licht von oben: 0 und 1). Schattenversatz und Lichtkante lesen beide daraus, damit sie dem Motivlicht nicht widersprechen (Regel 9; Neuentwurf).
- **Begleitschatten:** ein einziger `box-shadow`, Versatz in Lichtrichtung (bei Licht von oben x = 0), Radius deutlich größer als der Versatz, negative Ausdehnung. Schattenton ist der abgedunkelte Grundton statt Neutralschwarz (Neuentwurf). Am Bildschirm gegen das Maß aus Ref 01 prüfen.
- **Lichtkante:** `inset box-shadow` oder `border`, 1 CSS-px, an der lichtzugewandten Seite stärker (bei Licht von oben die Oberkante, wie Ref 01).
- **Lichtraum:** `radial-gradient` mit Zentrum am Fixationsanker, höchstens drei Stopps; sein Helligkeitsumfang endet, wo Lesetext unter 4,5:1 fiele.
- **Bloom, Glanz, Objektschatten:** im Render-Asset eingebacken (Hypothese aus Ref 05, 09, 12, 15); CSS-Ersatz für den Lichthof ist ein radialer Verlauf hinter dem Freisteller (Hypothese aus Ref 03, 12). `filter` auf großen Ebenen ist nicht erforderlich (siehe 10.8).
- **Schein als Zustand:** farbiger Außenschatten in der Akzentrolle (Hypothese aus Ref 13), stets mit Kontur- oder Füllungswechsel.

```css
.flaeche-hell   { box-shadow: calc(var(--licht-x) * var(--schatten-y)) calc(var(--licht-y) * var(--schatten-y)) var(--schatten-r) var(--schatten-spread) rgb(var(--schattenton) / var(--schatten-alpha)); }
.flaeche-dunkel { box-shadow: inset calc(var(--licht-x) * 1px) calc(var(--licht-y) * 1px) 0 rgb(var(--kante-ton) / var(--kante-alpha)); border: 1px solid transparent; }
.grund-licht    { background: radial-gradient(circle at var(--anker-x) var(--anker-y), rgb(var(--farbe-grund-zentrum)), rgb(var(--farbe-grund)) 45%, rgb(var(--farbe-grund-rand))); }
```

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Schattenstufen je Ansicht | keine Elevation (5.5); Schatten nur auf heller Fläche (3 von 3) | 1, nur auf heller Fläche; sonst `none` | Nr. 6, Ableitung |
| Stärke des Begleitschattens | etwa 5–7 Tonwerte dunkler (Ref 01, Näherung) | dunkelste Stelle ≤ etwa 8 von 255 Tonwerten unter dem Umfeld; Deckkraft 4–8 % | aus Ref 01 |
| Versatz | senkrecht, weit nach unten, stärkste Abdunklung etwa ¼–⅓ der Formhöhe unter der Form (Ref 01, Näherung); gering (Ref 11); nach rechts unten, passend zum Flächenlicht (Ref 05) | in Lichtrichtung (`--licht-x`, `--licht-y`; bei Licht von oben x = 0); Versatzlänge y = 10–25 % der Elementhöhe (aufliegende Karte eher 10 %, schwebende Form bis 25 %) | Obergrenze aus Ref 01, Untergrenze aus Ref 11; Richtung an Regel 9 gekoppelt; Werte Neuentwurf |
| Weichzeichnung | großer Radius (Ref 01, 11); Radien nicht messbar | 2–3 × y-Versatz | Neuentwurf (das Verhältnis ist in Ref 01 und 11 nicht messbar; Ref 11 zeigt geringen Versatz bei großem Radius) |
| Ausdehnung (spread) | nicht beobachtet | −25 % des y-Versatzes | Neuentwurf |
| Objektschatten | Ref 05 bis etwa 40 % dunkler (geschätzt) | Obergrenze, nur im Asset | Einzelfall |
| Lichtkante | haarfein (6 von 15) | 1 CSS-px; Aufhellung 8–20 % auf dunkler, 40–70 % auf heller Fläche; an der lichtzugewandten Seite stärker (bei Licht von oben die Oberkante) | Stärke aus 5.6.12, Richtung aus Ref 01, an Regel 9 gekoppelt; Deckkraft Neuentwurf |
| Helligkeitszentren des Grundes | 1, hinter dem Anker | 1 | Nr. 11 |
| Lichtzonen | ≤ 3 (Ref 03, 09, geschätzt) | ≤ 3 Verlaufsstopps | Nr. 11 |
| Ausdehnung des Lichthofs | hinter dem Motiv (Ref 03, 12) | 1–1,5 × Breite des Fokusträgers | Neuentwurf |
| Leuchtkerne | einer dominant (Ref 12); mehrere schwächere (Ref 14, 15) | 1; weitere ≤ halbe Helligkeit | Ableitung, Wert Neuentwurf |
| Schein als Zustand | Ref 13; Ansätze Ref 05, 09 | 1 Element; Ausdehnung 4–12 px; Deckkraft ≤ 35 % | Neuentwurf |
| Lichtbewegung | nicht belegt | Ruhezustand statisch (siehe 10.7) | Neuentwurf (nicht beobachtet) |
| Text über Licht | Kontrastrisiken in 12 von 15 Profilen (allgemein) | ≥ 4,5:1, großer Text ≥ 3:1, an der ungünstigsten Stelle | WCAG 2.2 AA |

### Mobil und Barrierefreiheit

- **Datenlage:** 0 von 15 Mobilansichten; alles hier ist Neuentwurf.
- **Ab 360 px:** Der Lichtraum folgt dem Fokusträger im einspaltigen Fluss (Ankerposition als Custom Property je Breakpoint). Text im Lichthof wird außerhalb gesetzt oder über Scrim und freie Bildzone gesichert (siehe 10.6), nie über einen Glow am Text.
- **Kontrast:** Text über Verlauf, Bloom oder Vignette erreicht an der ungünstigsten Stelle 4,5:1 (großer Text 3:1). Ist eine Lichtkante oder ein Schatten die einzige Grenze eines Bedienelements oder Zustands, braucht sie 3:1 (WCAG 1.4.11). Schein ist nie das einzige Zustandssignal (1.4.1).
- **Tastatur:** Der Fokus ist eine sichtbare Kontur mit mindestens 3:1, kein Schein allein, und keine Ebene verdeckt ihn (2.4.7, 2.4.11).
- **Systemeinstellungen:** Unter `forced-colors: active` entfällt `box-shadow`; die transparente 1-px-Kontur hält die Grenze sichtbar. `prefers-contrast: more` verstärkt die Lichtkante zur Kontur und flacht den Lichtraum ab. Im Dunkelmodus entfällt der Begleitschatten, die Lichtkante übernimmt (Regel 7).
- **Weniger Bewegung:** Unter `prefers-reduced-motion: reduce` pulsiert kein Licht, folgt keinem Zeiger und ändert sich nicht beim Scrollen. Jede Lichtbewegung ist Neuentwurf (nicht beobachtet).
- **Leistung:** Licht und Bloom ins Asset backen; Schatten werden nicht animiert; am Telefon schwächere Leuchtinseln weglassen, den Kern behalten.

### Prüffragen

1. Trägt kein Bedienelement einen Schlagschatten als Tiefenmittel, und liegt jeder vorhandene Schatten weich und blass auf heller Fläche?
2. Gibt es genau ein Helligkeitszentrum bzw. einen dominanten Lichtkern, und fällt er mit dem Fixationsanker zusammen?
3. Leuchtet und glänzt keine Fläche der Bedienschicht, abgesehen von höchstens einem Saum an genau einem aktiven Element?
4. Folgen Schatten, Kantensaum und Glanzlichter je Ansicht einer Lichtrichtung?
5. Erreicht jeder Text über Lichtraum, Bloom oder Vignette an der ungünstigsten Stelle 4,5:1 (großer Text 3:1), und sind Zustand und Fokus ohne Schein mit mindestens 3:1 erkennbar?
6. Ist die Ansicht ohne jede Lichtbewegung vollständig, auch unter `prefers-reduced-motion` und `forced-colors`?


## 10.5 Geometrie und Formensprache

### Grundsatz

Konsequenz vor Form: Die Bedienschicht spricht genau eine geschlossene, formstabile Formfamilie mit wenigen Radienstufen. Ob Vollrundung oder rechter Winkel, ist eine Stilentscheidung. Freie, organische und verformte Form gehört dem Motiv, der Kulissenschrift oder der Illustration.

### Beobachtet in den Referenzen

- **Geschlossenes Formsystem.** D5 ist in 14 von 15 = 93 % deutlich ausgeprägt (nur Ref 11 darunter, Gegenprobe 13 von 14), konsistent in 13 von 13 auswertbaren Referenzen (nicht beurteilbar: Ref 04, 06). Regellos gemischte Familien: 0 von 13. Konsenssicherheit hoch. Typisch 2 (Q1–Q3 2–2): Form ordnet, prägt aber selten; stark nur in Ref 06 und 14.
- **Vollrundung als häufigste Familie.** Kreis, Pille, Kapsel und große Containerradien zeigen 11 von 13 = 85 % (Ref 01, 02, 03, 05, 07, 08, 09, 11, 12, 13, 14), die Pille im engeren Sinn 9 von 13 = 69 %. In Ref 01 ist der Radius gleich der halben Höhe, Kreis-Button und Pille sind gleich hoch (geschätzt). Radienlose Systeme mit Haarlinien (Ref 10, 15) erzeugen dieselbe Geschlossenheit (4.4, Frage 5). Einzige Gegenform zur Vollrundung sind gerade Haarlinien, Raster und Trenner (Ref 01, 07, 09).
- **Radienstaffel.** Außen groß, an Fugen und innen klein, Aktionen voll gerundet: Ref 05, 08, 11, 14 (4 von 15 = 27 %). Ref 14 kommt mit höchstens vier Rundungsstufen aus; mehr sind nirgends belegt. Ref 05 teilt eine Fläche über Einzelradien je Ecke in zwei Karten mit gemeinsamer Silhouette und schmaler Fuge. Exakte Radien sind wegen Schrägaufnahme und Auflösung nirgends messbar.
- **Organische Form nur im Motiv.** Formkontrast organisch gegen geometrisch in 6 von 15 = 40 % (Ref 04, 05, 06, 08, 10, 15; ohne Gegenprobe), Formreim vom Objekt in die UI in 3 von 15 = 20 % (Ref 07, 09, 12). Organische Konturen liegen im Objekt (Ref 05, 10), in der Display-Schrift (Ref 04, 07) oder in der Illustration (Ref 06). Fluid verformte Bedienelemente: 0 von 15 (Konsenssicherheit D14 mittel). Kamera-Szenen sind formstarr (Ref 09, 12, 14, 15; ρ D14 + D15 = −0,56, Tendenz).
- **Asymmetrische Formen.** In der Bedienschicht ist Asymmetrie konstruiert: Einzelradien je Ecke (Ref 05) und, als einziger belegter Bruch, die Laschenkarte mit inversem Radius (Ref 03, 1 von 15), zugleich die opake Fokuskarte einer Glasreihe. Freie asymmetrische Konturen gibt es nur im Motiv (Ref 06). Asymmetrie der Anordnung: siehe 10.1.
- **Kacheln und Masken.** Kacheln sind stark gerundet, teils nahezu quadratisch (Ref 05, 13, 14); ob Superellipse oder Kreisbogen, ist nicht prüfbar. Masken bleiben geometrisch: runde Avatare (Ref 03, 12), gerundete Bildcontainer (Ref 02, 14). Organische Konturen stammen aus dem Freisteller (Ref 08) oder aus Tiefenverdeckung (Ref 15).
- **Anschnitte.** Randanschnitt oder Rahmenbruch in 8 von 15 = 53 % (Ref 04, 05, 06, 07, 08, 09, 12, 15; Gegenprobe 7 von 14): Riesenschrift (Ref 04, 08, 15), Objekte (Ref 07, 09, 12) und Inhaltsreihen (Ref 08). Angeschnittene Wörter bleiben über Anfang, Ende und Gestaltschließung lesbar (Regeln in Ref 05, 15).
- **Zielkonflikt.** Trägt Schrift die Bühne, tritt das Formsystem zurück (Ref 04, 15); ordnet ein starkes Formsystem, bleibt die Headline konventionell (Ref 06, 14); ρ D5 + D18 = −0,38.

### Regeln

1. **[Pflicht]** Die gesamte Bedienschicht (Buttons, Navigation, Karten, Labels, Eingaben, Avatare) folgt genau einer Formfamilie: Vollrundung oder radienlos-rechtwinklig.
2. **[Pflicht]** Höchstens vier Radienwerte einschließlich „voll“, alle als Tokens, keine Einzelwerte (Obergrenze abgeleitet aus Ref 14).
3. **[Pflicht]** Bedienelemente sind formstabil: keine organische Kontur, keine freie Maske, keine fluide Verformung, auch nicht im Hover- oder Ladezustand.
4. **[Pflicht]** Höchstens ein bewusster Formbruch je Ansicht (Ableitung; belegt ist einer, Ref 03). Er wird aus der Familie konstruiert und markiert ein Fokuselement.
5. **[Variabel]** Vollrundung ist Voreinstellung (Aktionen und Labels als Pille oder Kreis, Container groß, Innenflächen kleiner). Radienlos ist gleichwertig, dann mit Haarlinien statt Füllflächen (Ref 10, 15). Haarlinien, Trenner und Raster zählen als Gegenform, nicht als Bruch.
6. **[Variabel]** Motiv und UI stehen im Formkontrast oder neutral zueinander; organische Form sitzt vorzugsweise in einem Träger.
7. **[Variabel]** Anschnitt als Fortsetzungssignal (siehe 10.1) an Riesenschrift, Objekten und Inhaltsreihen. Navigation, Aktionen und bedeutungstragender Text werden nicht angeschnitten (Ableitung); ein angeschnittenes Wort bleibt an Anfang und Ende erkennbar.
8. **[Variabel]** Geometrische Masken nur aus dem Formsystem (Kreis, Containerradius); organische Konturen entstehen im Asset (siehe 10.6).
9. **[Optional]** Radienstaffel nach Rang mit geteilter Silhouette (Ref 05, 08, 11, 14), wenn höchstens vier Stufen bleiben und kein Innenradius seinen Außenradius übersteigt.
10. **[Optional]** Formreim vom Objekt in die UI (Ref 07, 09, 12), wenn das Motiv eine klare Grundform hat (Zylinder, Kreis, Ring).
11. **[Optional]** Laschenkarte mit inversem Radius (Ref 03), nur als der eine Bruch und mit normaler Karte als Ersatzform.
12. **[Optional]** Haarlinienbox mit Klammernotation (Ref 10) im radienlosen System; stark ausgeprägte Form (Ref 06, 14) nur mit konventioneller Headline.
13. **[Optional]** Eingefrorene Verformung im Exponat (Ref 05, 10) oder fluide Glyphen in lesbarer Kulissenschrift (Ref 07), eher in frontalen Entwürfen als in Kamera-Szenen. Animiertes Morphing ist Neuentwurf (nicht beobachtet), siehe 10.7.

### Umsetzung (Vorschlag)

Alles Folgende ist Vorschlag. Belegt sind nur Relationen; absolute Pixelwerte sind Neuentwurf, weil die Bildschirme schräg und komprimiert fotografiert sind.

- **Tokens.** `--radius-full: 9999px` ergibt für Pille und Kapsel bei jeder Höhe Radius gleich halber Höhe; Kreise mit `border-radius: 50%` und `aspect-ratio: 1`. Dazu `--radius-l` (Container, Bilder, Kacheln), `--radius-s` (Innenflächen, Fugenecken), optional `--radius-m`. Radienlose Familie: `0` plus 1-px-Haarlinie.
- **Verschachtelung.** Tokens so wählen, dass Außenradius minus Innenabstand ungefähr den Innenradius ergibt; so bleibt die Staffel konzentrisch ohne Einzelwerte (Handwerksregel, Neuentwurf).
- **Geteilte Silhouette (Ref 05).** Grid mit schmaler Lücke, je Zelle Einzelradien: außen `--radius-l`, an der Fuge `--radius-s`.
- **Inverser Radius (Ref 03).** Erforderlich ist eine Kontur jenseits von `border-radius`: Inline-SVG mit `viewBox` oder `mask` aus radialen Verläufen; `clip-path: path()` skaliert nicht mit.
- **Squircle.** `corner-shape: squircle` ist optional (progressive Verbesserung, Rückfall Kreisbogen), da die Referenzen beides nicht unterscheiden lassen.
- **Organische Konturen.** Erforderlich: Asset mit Alphakanal (AVIF/WebP) oder SVG-Pfad (Ref 06, 08). `mask-image` ist optional (siehe 10.6).
- **Anschnitt.** Bühne mit `overflow: clip` statt `hidden` (kein Scrollcontainer, `position: sticky` bleibt nutzbar), Riesenschrift per `clamp()` größer als die Bühne; kein horizontaler Seitenscroll.

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Formfamilien in der Bedienschicht | eine (13 von 13 auswertbar) | 1 | Pflicht, 5.2 Nr. 5 |
| Radienwerte | höchstens vier Rundungsstufen (Ref 14) | 3, höchstens 4 inkl. „voll“ | Ableitung aus Ref 14 |
| Pille, Kapsel | Radius gleich halber Höhe (Ref 01, 02) | `9999px` | Ref 01, 02 |
| Kreis-Button | so hoch wie die Pille daneben (Ref 01, geschätzt) | `50%`, Durchmesser = Pillenhöhe | Ref 01 |
| Höhe Pille/Kreis (Trefferfläche) | nicht messbar | ≥ 44 px; Untergrenze 24 px | WCAG 2.5.8; 44 px Neuentwurf |
| Containerradius `--radius-l` | „groß“, qualitativ (Ref 02, 03, 08, 12, 13, 14) | 24–32 px Desktop, 16–20 px unter 640 px | Neuentwurf |
| Innenradius `--radius-s` | „innen kleiner“ (Ref 05, 08, 11) | 8–12 px | Relation belegt, Wert Neuentwurf |
| vierte Stufe `--radius-m` | Kachel als eigene Stufe (Ref 14) | 14–18 px, optional | Neuentwurf |
| Verschachtelung | außen groß, innen kleiner (Ref 05, 08, 11) | Außenradius − Innenabstand ≈ Innenradius | Neuentwurf |
| Fuge geteilte Silhouette | schmal (Ref 05) | 4–8 px | Neuentwurf |
| Einzug Pfeilkreis in der Pille | eingesetzter Kreis (Ref 02, 03) | 4–6 px | Neuentwurf |
| Haarlinie radienlos | 1-px-Rahmen (Ref 10, Hypothese) | 1 px, ≥ 3:1 als einzige Begrenzung | Ref 10; WCAG 1.4.11 |
| Formbrüche je Ansicht | einer (Ref 03) | ≤ 1 | Ableitung |
| organische Konturen in der UI | 0 von 15 | 0 | Pflicht |
| Kachelseitenverhältnis | teils nahezu quadratisch (Ref 13, geschätzt) | 1:1 bis 4:3 | Spanne Neuentwurf |
| Anschnitt Riesenschrift | an Rändern (Ref 04, 08, 15), Anfang und Ende lesbar (Ref 05, 15) | Wortanfang vollständig, je Rand höchstens ein Glyph teilweise | Ableitung aus Ref 05, 15; Schwelle Neuentwurf |

### Mobil und Barrierefreiheit

- **Unter 640 px.** `--radius-l` sinkt auf 16–20 px, Pillen bleiben voll gerundet. Radien nie größer als die halbe kürzere Seite planen, sonst verkleinert der Browser alle Ecken. Die Laschenform skaliert per SVG oder fällt auf schmalen Karten auf die normale Karte zurück (in Ref 03 nicht belegt).
- **Trefferfläche und Zoom.** WCAG 2.2 AA verlangt mindestens 24 × 24 CSS-px (2.5.8), vorgeschlagen sind 44 px. Kleine Pfeilkreise in Karten (wie Ref 03) bekommen eine vergrößerte Trefferfläche. Pillen wachsen mit dem Text (`min-height` statt fester Höhe) für 200 % Zoom und Umfließen bei 320 CSS-px (1.4.4, 1.4.10).
- **Fokus und Kontur.** Der Fokusring folgt der Form (`outline` folgt in aktuellen Browsern dem `border-radius`) und hat mindestens 3:1 (2.4.7, 1.4.11). `clip-path` und `mask` schneiden ihn ab; bei der Laschenkarte liegt er daher auf einem inneren Element. Ist ein Element nur über seine Kontur erkennbar (Haarlinienbox, Glaspille), braucht sie mindestens 3:1 gegen den Grund; bei `forced-colors: active` erhalten Pillen und Karten einen Rahmen.
- **Anschnitt.** Bei 360 px neu prüfen: Wort erkennbar, nichts Bedienbares außerhalb.
- **Weniger Bewegung.** Formwechsel zwischen Zuständen (etwa Pille zu Kreis) sind Neuentwurf (nicht beobachtet) und geschehen immer als sofortiger Wechsel ohne Interpolation, nicht erst bei `prefers-reduced-motion: reduce`. Eine animierte Verformung von Bedienelementen oder UI-Glas ist ausgeschlossen (Regel 3; 10.7, Regel 2; 10.10, Nr. 4).
- **Leistung.** `border-radius` ist praktisch kostenlos; `clip-path`, `mask` und `corner-shape` nur auf wenigen Elementen je Ansicht; organische Formen im Asset vorrendern statt zur Laufzeit berechnen (siehe 10.8).

### Prüffragen

1. Lässt sich jedes Bedienelement genau einer Formfamilie zuordnen, und kommen höchstens vier Radienwerte vor, alle aus Tokens?
2. Liegt jede organische, verformte oder frei maskierte Kontur im Motiv, in der Kulissenschrift oder in einer Illustration und keine in einem Bedienelement?
3. Gibt es je Ansicht höchstens einen bewussten Formbruch mit Ersatzform?
4. Bleiben angeschnittene Wörter bei 360 px und auf dem Desktop erkennbar, sind Navigation, Aktionen und bedeutungstragender Text vollständig sichtbar, und entsteht kein horizontaler Scroll?
5. Haben alle Pillen und Kreisbuttons mindestens 24 × 24 CSS-px Trefferfläche und einen formfolgenden Fokusring mit mindestens 3:1, den weder `clip-path` noch eine Maske beschneidet?


## 10.6 Bild- und Objektintegration

### Grundsatz

Das Bild wird nicht eingesetzt, es bildet den Raum, in dem die Oberfläche steht. Motiv und Seite teilen Grund, Licht und Ebenenfolge, ohne sichtbare Kante, Freistellsaum oder deckende Textbox. Plastik, Material und Licht sind frei; wo sie eingesetzt werden, trägt sie genau ein Körper oder eine Szene, Material auch eine Glasschicht. Die Bedienschicht liegt flach und lesbar darüber.

### Beobachtet in den Referenzen

Die Konsenssicherheit ist eine Obergrenze (simulierte Expertenrollen, 4.6). 9 von 15 Quellen sind perspektivisch verzerrt; Flächen und Größen sind geschätzt, Technikangaben Hypothesen.

- **Bild als Raum.** Bildintegration ist in 14 von 15 = 93 % deutlich ausgeprägt (alle außer Ref 01), Gegenprobe 13 von 14, Konsenssicherheit hoch. Bild als Bühne statt gerahmter Beigabe: 13 von 15 = 87 % (nicht Ref 01, 11), Gegenprobe 12 von 14, unter den Website-Heros 11 von 11. Streng ohne Bildkante: 10 von 15 = 67 % (Gegenprobe 9 von 14). Gerundeter Bildcontainer mit UI direkt auf dem Bild: nur Ref 02, 14.
- **Freigestellte Objekte (cut-outs).** Freisteller als Fokus in 7 von 15 = 47 % (Gegenprobe 7 von 14), zwischen Schrift- und UI-Ebene in Ref 03, 04, 05, 07, 08. Er dominiert über Ausschließlichkeit, nicht über Fläche: etwa ein Achtel (Ref 08), 12–15 % (Ref 10), 20–25 % (Ref 03), bis knapp ein Drittel (Ref 07). Nebenkörper bleiben untergeordnet, in Ref 05 über die Größe (Hero rund viermal so hoch), in Ref 09 über Tonwertumkehr bei nur etwa 1,2-facher Größe.
- **3D-Modelle und Szenen.** Plastischer Hauptkörper deutlich in 11 von 15 = 73 % (Gegenprobe 10 von 14), Konsenssicherheit hoch. Renderstufe 4 zeigen Ref 05, 09, 10, 12, 14, 15, alle mit gestaltetem Licht (6 von 6). Szenen füllen rund zwei Drittel (Ref 14) bis den ganzen Viewport (Ref 15). Vorgerenderte Alpha-Assets sind die naheliegende Hypothese in 8 von 15, Echtzeit-WebGL ist in 0 von 15 belegt. Räumlich transformierte UI: 0 von 15.
- **Übergang Bild–Grund.** Grundgleichheit in 6 von 15 = 40 % (Ref 04, 07, 08, 09, 10, 12; Gegenprobe 5 von 14, Grenzfall): identischer Vollton (Ref 07, 10), dunkler Grund verschluckt die Freistellkante, ein Farbsaum ersetzt sie (Ref 08), Reflexfarben greifen die Umgebung auf (Ref 09), Render in der Lichtstimmung des Grundes (Ref 12). Ref 03 ersetzt die Bildkante durch einen gerichteten Auslauf nach unten. Glas vermittelt zwischen UI und Motiv in Ref 03, 12, 14 (siehe 10.3). Laut Profil Ref 05 wirkt ein Leuchtobjekt ohne Lichtübertrag auf die Fläche montiert.
- **Verankerung.** Ohne Kontaktschatten in 7 von 15 = 47 % (Ref 07, 08, 09, 10, 12, 13, 15; Konsenssicherheit D4 mittel): Anschnitt (Ref 07), Überdeckung durch Folgesektion oder Gras (Ref 12, 15), defokussierter Vordergrund (Ref 13), Klammer aus Emitter und Sockel (Ref 09), Grundgleichheit (Ref 10). Einen Objektschatten setzt nur Ref 05, auf hellem Grund.
- **Maskierung.** Geometrisch: gerundete Bildcontainer (Ref 02, 14), Kreismasken für Porträts (Ref 03, 12, 13). Organische Konturen stammen aus dem Freisteller (Ref 08) oder aus Tiefenverdeckung (Ref 15); an Bedienelementen ist keine freie Maske beschrieben (5.6.5).
- **Rahmen durchbrechen.** Randanschnitt oder Rahmenbruch in 8 von 15 = 53 % (Gegenprobe 7 von 14). Über eine Containerkante bricht nur Ref 05: Der Schirm überragt die Kartenkante um etwa 4–5 % der Kartenhöhe, das Kabel um rund ein Fünftel; die Leuchte liegt vor Karte und Schriftzug.
- **Text auf dem Bild.** Lesbar ohne Box über Scrim im Negativraum (Ref 02, Lesezone rund 40 % der Breite, gekipptes Mockup), Kamerastandpunkt mit freier Bodenzone (Ref 14), flächenlose Rand-UI (Ref 15) oder Luminanzkontrast (Ref 04). Kontrastrisiken nennen 12 von 15 Profilen.
- **Zeit.** Bewegung ist nur am Motiv belegt (Ref 04/07, 09; n = 4, Konsenssicherheit niedrig). Bild-Reveals und Maskenübergänge sind nicht beobachtet.

### Regeln

Regeln 1, 2, 4 und 5 setzen DNA-Prinzip Nr. 1, 4 und 6 um; Regel 3 übernimmt den Rahmen „ein Körper als Fokus“ aus 5.3; Regel 6 ist Nutzbarkeitsvorgabe.

1. **[Pflicht]** Das Hauptbild bildet den Raum der Ansicht: kantenlos (Freisteller, vollflächige Szene) oder in einem Container, dessen Bild für die Bedienschicht komponiert ist. Ein gerahmtes Bild neben dem Text ist als Hauptbild unzulässig.
2. **[Pflicht]** Zwischen Asset und Seite ist kein Grundsprung sichtbar und kein Rest des Aufnahmegrunds als Saum, Hof oder Halo. Ausgenommen sind gestaltete Lichtsäume, Lichthöfe und Lichtübertrag nach 10.4 (Ref 08; Regel Ref 05).
3. **[Variabel]** Ein plastischer Körper oder eine Szene ist frei (11 von 15; Ref 02 und 06 kommen ohne aus). Wird einer eingesetzt, dann genau einer als Fokus; Nebenkörper sind über Größe oder Tonwert untergeordnet. Material, Licht und Feindetail sitzen, wo eingesetzt, an diesem Fokusträger; Material darf stattdessen in einer Glasschicht sitzen (10.3, Regel 5).
4. **[Pflicht]** Perspektive und Plastik bleiben im Bild; die Bedienschicht wird nie mit dem Objekt gedreht, gekippt oder verformt (siehe 10.2).
5. **[Pflicht]** Kein Objekt wird über einen tragenden Schlagschatten verankert (siehe 10.4).
6. **[Pflicht]** Text liegt ohne deckende Box auf dem Bild und erreicht 4,5:1 (große Schrift 3:1) gegen die ungünstigste Bildpartie dahinter, über freie Bildzone, Scrim, flächenlose Rand-UI oder Luminanzkontrast. Ausnahme: Unter reduzierter Transparenz oder erhöhtem Kontrast darf Glas deckend werden (10.3); dort geht die Mindestanforderung vor.
7. **[Variabel]** Das Übergangsmittel ist frei: Grundgleichheit, gemeinsame Lichtstimmung, Reflexfarben oder gerichteter Auslauf. Kantenlos ist Voreinstellung, der gerundete Container die seltenere Fassung (Radius aus dem Formsystem, siehe 10.5).
8. **[Variabel]** Medium (Foto, Render, Vektor) und Plastizität sind frei, ebenso ein bewegtes Motiv (siehe 10.7, Regel 9: belegt ist nur der Ort, Ref 04/07, 09; Art, Medium und Auslöser sind Neuentwurf, nicht beobachtet). Ein Render der Stufe 4 steht nur in gestaltetem Licht (Rahmen aus 5.3, als Ausschluss 10.10, Nr. 9); Lichtrichtung und Farbstimmung des Assets passen zum Grund (Ref 06, 09, 12).
9. **[Variabel]** Das Verankerungsmittel ist frei: Anschnitt, Überdeckung, Vordergrund, Lichtsaum, Klammer oder Grundgleichheit. Ein weicher Objektschatten ist nur auf heller Fläche als Begleitmittel zulässig (Ref 05).
10. **[Variabel]** Masken sind geometrisch und stammen aus dem Formsystem; organische Konturen entstehen im Alphakanal des Assets oder durch Verdeckung.
11. **[Variabel]** Das Objekt darf vor Karten und Kulissenschrift treten (Ref 05, 08), nie vor Navigation, Hauptaktion, Lesetext oder ein fokussiertes Element.
12. **[Optional]** Rahmenbruch über eine Containerkante (Ref 05). Bedingung: genau ein Objekt an genau einer Kante, Bedienelemente bleiben im Rahmen.
13. **[Optional]** Gerichteter Auslauf statt Bildkante (Ref 03). Bedingung: Freisteller auf gleichem oder lichtgleichem Grund, Fokuspunkt scharf.
14. **[Optional]** Bildpanel im gerundeten Container (Ref 02, 14) oder Punze als Bildfenster (Ref 15). Bedingung: Die Textzone ist im Bild freigehalten.

Ein Bild-Reveal per Maske ist kein Signature-Effekt, sondern Neuentwurf (nicht beobachtet; 5.6.17); er ist ohne Regelmarke unter 10.7, Regel 9 geführt.

### Umsetzung (Vorschlag)

Alle Werte sind Vorschläge; „Neuentwurf“ heißt ohne Beleg.

- **Freisteller.** Erforderlich ist entweder ein Alphakanal (AVIF, Rückfall WebP, per `<picture>`) oder Grundgleichheit: Asset auf exakt dem Seitengrund gerendert, Seitenfarbe als aus dem Asset abgeleitetes Token (Hypothese aus Ref 07, 10). Kanten mit Farbdekontamination (color decontamination) exportieren, damit kein Rest des Aufnahmegrunds als Saum bleibt. Asset und CSS in sRGB; Video auf Zielgeräten gegen den CSS-Grund prüfen, weil Farbumfang und Gamma abweichen können.
- **Auslauf.** Erforderlich ist ein im Asset eingebackener Alpha-Verlauf; `mask-image: linear-gradient(…)` ist optional.
- **Container.** `border-radius` aus dem Formsystem, `overflow: clip`, `object-fit: cover`, `object-position` je Breakpoint so, dass die Textzone frei bleibt (Hypothese Ref 02, 14).
- **Scrim.** Linearer Verlauf als eigene Ebene zwischen Bild und Text, ohne harte Kante; `backdrop-filter` ist nicht erforderlich.
- **Rahmenbruch.** Das Objekt ist Geschwister des Containers, nicht Kind des beschneidenden Elements; Bildebenen erhalten `pointer-events: none` (Hypothese Ref 05, 06). Z-Stufen nach 10.2.
- **3D-Modelle.** Offline-Render als Standard, Hintergrund transparent oder exakt Seitengrund; Schattenfänger (shadow catcher) nur auf hellem Grund; leuchtende Objekte werfen einen Schein auf die Fläche (Regel im Profil Ref 05). Echtzeit nur nach 10.8, Regel 9.
- **Laden.** Das Fokus-Asset nie lazy, mit `fetchpriority="high"`, festen Abmessungen und `srcset`; Nebenbilder lazy.

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Fläche des Freistellers | ⅛ (Ref 08) bis knapp ⅓ (Ref 07) | 15–35 % (wie 10.1) | Ref 03, 07, 08, 10 |
| Fläche einer Szene | rund ⅔ (Ref 14), vollflächig (Ref 15) | 60–100 %, Textzone frei | Ref 14, 15 |
| Hauptkörper zu Nebenkörper | rund 4× (Ref 05); rund 1,2× mit Tonwertumkehr (Ref 09) | ≥ 3× Höhe oder einziger Fokusreiz | Ref 05, 09; 3× = kleinster belegter Maßstabssprung |
| Farbabstand Asset-Grund zu Seitengrund | „identisch“ (Ref 07, 10), nicht messbar | ΔE00 ≤ 1 | Neuentwurf (Wahrnehmungsschwelle) |
| Alpha-Übergangszone der Kante | nicht messbar (Kompression) | 1–2 CSS-px, ohne Farbsaum | Neuentwurf |
| Gerichteter Auslauf | Unterkörper verwischt nach unten (Ref 03) | unteres Viertel bis Drittel der Objekthöhe | Neuentwurf; Ref 03 zeigt den Effekt, nicht das Maß |
| Scrim-Breite | Lesezone rund 40 % der Breite (Ref 02) | 35–50 % der Bildbreite, kantenlos auslaufend | Ref 02, grob geschätzt |
| Scrim-Deckkraft | nicht messbar | Startwert 40–70 % am Textrand; maßgeblich ist der gemessene Kontrast | Neuentwurf; WCAG 1.4.3 |
| Überstand beim Rahmenbruch | Körper 4–5 %, Aufhängung rund 20 % der Containerhöhe (Ref 05) | Körper ≤ 10 %, schmale Teile ≤ 20 % | Ref 05; Obergrenze Körper Neuentwurf |
| Rahmenbrüche je Ansicht | 1 (Ref 05) | höchstens 1 | Ref 05; Ableitung aus Nr. 3 |
| Dateigröße Fokus-Asset | nicht beobachtet | ≤ 200 KB mobil, ≤ 400 KB Desktop | Neuentwurf, innerhalb des Budgets in 10.8 |
| Auflösung Fokus-Asset | nicht beobachtet | bis 2× Darstellungsbreite, 3–4 `srcset`-Stufen | Neuentwurf |
| Mobiler Zuschnitt | 0 von 15 | eigener Ausschnitt per `<picture media>` | Neuentwurf |

### Mobil und Barrierefreiheit

- **Mobil ist Neuentwurf** (0 von 15). Ab 360 px erhält jedes Hauptbild einen eigenen Zuschnitt; die Verschränkung wird neu gesetzt statt verkleinert (Regel Ref 08). Fehlt eine freie Bildzone in Textgröße, steht der Text über oder unter dem Bild. Ein Rahmenbruch bleibt im Viewport oder entfällt; kein horizontaler Seitenscroll (WCAG 1.4.10).
- **Kontrast.** Text 4,5:1, große Schrift 3:1, Bedienelemente und Fokusanzeige 3:1 (1.4.11), gegen die ungünstigste Bildpartie, bei Video gegen den ungünstigsten Frame, in jedem Zuschnitt.
- **Alternativtext.** Ein Motiv mit Aussage erhält einen kurzen Alternativtext; Kulissen, Vordergründe und doppelte Ebenen sind `alt=""` bzw. `aria-hidden="true"`. Ein vom Motiv verdecktes Wort steht vollständig als Text im DOM.
- **Tastatur.** Keine Bildebene verdeckt ein fokussiertes Element (2.4.11) oder fängt Zeiger- und Tippereignisse ab.
- **Weniger Bewegung.** Bei `prefers-reduced-motion: reduce` zeigt ein bewegtes Motiv sein Poster; Reveals (10.7, Regel 9) entfallen.
- **Leistung.** Kein `filter: blur()` oder `drop-shadow()` auf großen Bildebenen; Unschärfe, Auslauf und Schatten werden ins Asset gebacken.

### Prüffragen

1. Bildet das Hauptbild den Raum der Ansicht, statt als gerahmte Beigabe neben dem Text zu stehen?
2. Ist zwischen Asset und Seite bei 100 % und 200 % Zoom und am Telefon kein Grundsprung und kein Rest des Aufnahmegrunds als Saum oder Halo sichtbar (gestaltetes Licht nach 10.4 ausgenommen)?
3. Gibt es höchstens einen plastischen Körper oder eine Szene als Fokus, mit untergeordneten Nebenkörpern, verankert ohne tragenden Schlagschatten?
4. Erreicht jeder Text auf dem Bild ohne deckende Box 4,5:1 (große Schrift 3:1) gegen die ungünstigste Bildpartie?
5. Bleiben Navigation, Hauptaktion, Lesetext und Fokus unverdeckt, und sind Bildebenen für Zeiger durchlässig?
6. Hat jedes Hauptbild bei 360 px einen eigenen Zuschnitt ohne horizontalen Scroll, und hält das Fokus-Asset sein Budget?


## 10.7 Motion und Interaktion

### Grundsatz

Bewegung ist eine Zugabe und trägt die Gestaltung nie. Wenn sich etwas bewegt, dann das Motiv am Fokusträger; die Bedienschicht ruht frontal und formstabil und reagiert nur über die Kanäle ihrer statischen Zustandscodierung. Jeder Ruhezustand muss als Standbild die volle Komposition tragen, weil die DNA aus Standbildern stammt (Ableitung aus 5.2 Nr. 1, 3, 5).

### Beobachtet in den Referenzen

**Datenlage.** Auswertbar sind für Animation 4 von 15 Referenzen, für Scrollen 5 von 15, für Mikrointeraktion und Physik je 1 von 15 und für Übergänge 3 von 15. Die Konsenssicherheit ist überall niedrig. Quoten bis 100 % ergeben sich aus der Belegregel und sind kein Befund. Ref 04 und 07 stammen aus einem Reel und zählen als ein Design; ob eine Bewegung zur Website gehört oder erst im Reel-Schnitt entsteht, ist nicht trennbar. Kurven (easing), Dauer, Auslöser und Pfade erkennt man in keiner Referenz.

- **Ort der Bewegung (belegt, niedrig).** Bewegung zeigt sich nur im Motiv. In Ref 09 haben allein die Dosen Doppelkonturen, während Wortmarke, Sockel und Chevrons scharf bleiben. Ref 07 zeigt fallende Bohnen mit Bewegungsunschärfe, Ref 04 zerlegte Lettern bei unveränderter Kopfzeile. Ref 06 hat Lottie-Motivebenen vor und hinter dem Titel, aber nur als Struktur. In der Bedienschicht bewegt sich nichts (0 von 4).
- **Scrollen (nur die Ankündigung belegt, niedrig).** Belegt sind ein Scroll-Hinweis in kleinen Versalien mit Haarlinie (Ref 09, 15; 2 von 15), Kapitelziffern 01–04 (Ref 15) und eine Parallax-Gruppe aus sechs Ebenen (Ref 06, nur Struktur). Indirekt belegt ist ein Szenenwechsel bei stehender Kopfzeile (Ref 04/07). Ein statisches Fortsetzungssignal zeigen 8 von 15 = 53 %, in der Gegenprobe 7 von 14.
- **Übergänge (effektiv ein Beleg, niedrig).** Die Kopfzeile steht, Motiv und Riesenwort werden Ebene für Ebene getauscht (Ref 04/07). Der stehende Zwischenzustand macht die Schrift unlesbar („Pyr…vrg“, Ref 04). Statische Anschlüsse: Überdeckung durch die Folgesektion (Ref 12), farbgleicher Anschluss (Ref 06).
- **Mikrointeraktionen (Verhalten nicht belegt).** Zu sehen ist nur ein Hand-Zeiger ohne Zustandsänderung (Ref 09). Belegt ist die statische Grammatik: Rang und Zustand ohne Zusatzfarbe in mindestens 7 von 15, etwa über Deckkraft (Ref 02), Glas gegen opak (Ref 03), Sättigung (Ref 12) oder Füllung gegen Kontur (Ref 14).
- **Physik (n = 1).** Belegt sind Fall und Schüttung im Motiv (Ref 07). Feder oder Trägheit an Bedienelementen: kein Beleg.
- **Statische Grenzen (hohe Sicherheit).** Die Bedienschicht ist in 15 von 15 frontal (Gegenprobe 14 von 14). Fluid verformte Bedienelemente: 0 von 15. Kinetische Schrift, animiertes Morphing und bewegter Grund: kein Beleg.
- **Barrierefreiheit.** Das Profil von Ref 04 fordert als Regel eine Variante mit reduzierter Bewegung. In Ref 04, 06, 07, 09 und 15 ist sie als fehlend oder nicht prüfbar vermerkt.

### Regeln

1. **[Pflicht]** Kein Zustand (Hover, Fokus, Scrollen, Übergang) verändert die Bedienschicht räumlich: kein Kippen, Drehen, 3D-Flip, Tilt (Nr. 1).
2. **[Pflicht]** Bedienelemente verformen sich nicht und federn nicht nach (kein overshoot) (Nr. 5; 0 von 15).
3. **[Pflicht]** Zustandsfeedback nutzt keinen Schlagschatten, keine leuchtende Fläche, keine zweite Akzentfarbe und keine Skalierung auf Zwischengrößen (Nr. 3, 6, 7, 10).
4. **[Pflicht]** Dauerbewegung (Schleife, Strom, Schweben) hat je Ansicht höchstens einen Träger, und das ist das Motiv. Die Bedienschicht steht still. Ein Szenenwechsel darf die Ebenen eines Sandwichs gemeinsam tauschen (Nr. 3, 11). Ein bewegter Grund ist Neuentwurf (nicht beobachtet) und nur zulässig, wenn er nicht mit dem Motiv als zweiter bewegter Träger konkurriert (Nr. 3) und die Obergrenzen aus Nr. 11 hält.
5. **[Pflicht]** Bei Übergängen bleiben Kopfzeile und Ordnungsachse stehen (Ref 04/07; Nr. 3).
6. **[Pflicht]** Der Start, der Endzustand jeder Szene und die Fassung für „weniger Bewegung“ sind vollständig komponiert und lesbar. Kein Inhalt ist nur über Bewegung erreichbar (Ableitung).
7. **[Pflicht]** Jede Bewegung jenseits von Farb- oder Deckkraftwechseln hat eine Fassung für „weniger Bewegung“ (Profilregel Ref 04; Nutzbarkeitsanforderung).
8. **[Variabel]** Der Kanal für Zustandswechsel ist frei: Deckkraft, Sättigung, Füllung gegen Kontur oder Glas gegen opak. Je Produkt gibt es einen Kanal für „aktiv“ und einen für Hover, beide überall gleich (statische Codierung: siehe 10.9, „Rang und Zustand“ und „Rang über Deckkraft“, sowie 10.3, Regel 7). Der Fokus ist davon getrennt: immer eine formfolgende, unverdeckte Kontur von mindestens 2 px mit 3:1 (10.9, „Fokusanzeige“).
9. **[Variabel]** Art, Medium (Video, Bildsequenz, Echtzeit) und Auslöser (Zeit, Scrollen, Zeiger) der Motivbewegung sind frei. Sie setzt am Ausdrucksträger des Dialekts an: in A an Schrift- und Objektebene, in B an Körper oder Kamera, in C an den Kulissen. Belegt ist nur der Ort, alles Weitere ist Neuentwurf (nicht beobachtet). Dazu gehört ein Bild-Reveal per Maske (kein Signature-Effekt, 5.6.17): nur am Fokusträger, mit dem Standbild als Endzustand (siehe 10.8).
10. **[Variabel]** Die erste Ansicht ist ohne Scrollen vollständig und zeigt am Rand ein Fortsetzungssignal (Anschnitt, Überdeckung oder Hinweis).
11. **[Optional]** Ein Scroll-Hinweis mit Fortschrittslinie oder Kapitelziffern (Ref 09, 15) passt zu Seiten, die als Szenenfolge gebaut sind. Er bleibt Klein-UI an der Ordnungslinie.
12. **[Optional]** Ein Szenenwechsel durch Tausch von Wort und Motiv (Ref 04/07) ist nur im Typo-Bild-Sandwich zulässig und darf keinen stehenden Zwischenzustand haben.
13. **[Optional]** Parallax der Kulissen (Ref 06, nur Struktur), eine an den Scroll gekoppelte Kamerafahrt (scroll-linked) oder eine Schwebeschleife (Neuentwurf, nicht beobachtet) sind zulässig, wenn sie nur das Bild bewegen und die Textzonen frei bleiben.
14. **[Optional]** Partikel oder ein Materialstrom im Motiv (Ref 07) sind zulässig, aber nie unter Lesetext.

### Umsetzung (Vorschlag)

Alle Verhaltensvorgaben dieses Abschnitts (Technik, Scrollen, Motiv, Übergänge und Physik) und alle Werte für Zeit, Kurve und Weite sind **Neuentwurf (nicht beobachtet)**, denn die Standbilder enthalten keine; belegt ist nur, was die Tabelle als „Beleg“ führt. Sie folgen aus dem Grundsatz „Bedienschicht ruhig, Motiv trägt“: In der UI sind Bewegungen kurz und klein, im Motiv langsam.

- **Technik.** Erforderlich sind nur CSS-Übergänge auf `opacity`, `transform` und Farbe sowie die Abfrage `prefers-reduced-motion`. GSAP, Lottie, WebGL, View Transitions und `animation-timeline: view()` sind optional; die DNA braucht keine davon.
- **Scrollen.** Die Seite scrollt nativ, ohne übernommene Scrollsteuerung (scroll hijacking). Eine angeheftete Szene (pinning) rastet in ihrem Endzustand ein, bevor sie die Seite freigibt. Inhalte sind auch ohne Skript sichtbar.
- **Motiv.** Eine vorgerenderte Schleife oder Bildsequenz mit dem Ruhezustand als Poster hat Vorrang vor Echtzeit-3D, denn Echtzeit ist nicht belegt.
- **Übergänge und Physik.** Seitenwechsel laufen höchstens als Überblendung (crossfade), und die Kopfzeile bekommt einen eigenen `view-transition-name`. Die UI hat keine Feder (spring); Karussells nutzen `scroll-snap`.

Werte für die Sammlung in 10.9:

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Ort der Bewegung | Motiv; UI 0 von 4 (Ref 04/07, 09) | nur Motivebenen | Beleg; Nr. 1 |
| Dauerbewegte Träger je Ansicht | je Beleg einer | ≤ 1 | Nr. 3 |
| Räumliche Transformation der UI | 0 von 15 | keine | Nr. 1 |
| Überschwingen der UI | 0 von 15 fluide UI | keines (Bezier-Werte 0–1) | Nr. 5 |
| Skalierung der UI | nicht beobachtet | keine (1,0), auch nicht beim Drücken | Nr. 7; Regel 3; 10.10, Nr. 14 |
| Versatz beim Einblenden der UI | nicht beobachtet | keiner; Ein- und Ausblenden nur über Deckkraft | Grundsatz; 10.10, Nr. 14 |
| Dauer des Zustandswechsels | nicht beobachtet | 120–200 ms (160) | Neuentwurf |
| Ein- und Ausblenden (Menü, Panel) | nicht beobachtet | 200–300 ms | Neuentwurf |
| Einblenden eines Folgeabschnitts | nicht beobachtet | 300–500 ms, nur Deckkraft, einmalig | Neuentwurf |
| Szenenwechsel im Motiv | Aufbau Ref 04/07, Dauer nicht | 500–900 ms | Neuentwurf; Lesbarkeit aus Ref 04 |
| Motivschleife (Schweben, Drehen) | Hypothese zu Ref 09 | Periode 6–10 s; Schweben ≤ 2 % der Objekthöhe | Neuentwurf; Obergrenze wie Videoschleife in 10.8 |
| Kurve für Eintritt und Zustand | nicht beobachtet | `cubic-bezier(0.2, 0, 0, 1)` | Neuentwurf |
| Kurve für Austritt | nicht beobachtet | `cubic-bezier(0.4, 0, 1, 1)` | Neuentwurf |
| Kurve für Szene und Schweben | nicht beobachtet | `cubic-bezier(0.65, 0, 0.35, 1)` | Neuentwurf |
| Parallax-Faktor (Anteil der Scrollgeschwindigkeit) | 6 Ebenen ohne Werte (Ref 06) | 0,8–1,0; Text und UI 1,0 | Neuentwurf |
| Anheftstrecke je Szene | nicht beobachtet | ≤ 1,5 Viewporthöhen, ≥ ⅓ davon Ruhe | Neuentwurf; Ref 04 |
| Scroll-Hinweis | Klein-UI mit Haarlinie (Ref 09, 15) | ruhend, in Größe der Bedienschrift | Beleg; Nr. 7 |
| Selbstlauf ohne Pause | nicht beobachtet | ≤ 5 s | WCAG 2.2.2 |
| Fassung „weniger Bewegung“ | gefordert (Ref 04) | Überblendung ≤ 200 ms oder Schnitt | Profilregel Ref 04, 06; WCAG 2.3.3 (Stufe AAA), eigene Vorgabe über AA hinaus |

### Mobil und Barrierefreiheit

- **Mobil (0 von 15 belegt, Neuentwurf).** Ab 360 px Breite gibt es kein Parallax über eine Ebene hinaus und keine Anheftstrecken. Eine Kamerafahrt wird zum Standbild. Motivvideos sind komprimiert, haben ein Poster und werden erst nach dem ersten Rendern geladen. Kein Zustand hängt am Hover. Ziele messen mindestens 24 × 24 CSS-px (WCAG 2.5.8), empfohlen sind 44 px.
- **Weniger Bewegung.** Unter `prefers-reduced-motion: reduce` laufen keine Schleifen, kein Parallax, kein Anheften und keine Scroll-Kopplung. Szenenwechsel werden zur kurzen Überblendung oder zum Schnitt; Farb- und Deckkraftwechsel bleiben. Unabhängig davon ist selbstlaufende Bewegung über 5 s pausierbar (2.2.2), und nichts blitzt öfter als dreimal pro Sekunde (2.3.1).
- **Lesbarkeit.** Bedeutungstragender Text bewegt sich nicht, solange er gelesen werden soll, und unterschreitet in keinem Zwischenzustand 4,5:1 (großer Text 3:1). Ausgenommen ist nur die Kulissenschrift.
- **Tastatur.** Jede Zeigeraktion (Chevron, Hotspot, Karussell) ist per Tastatur erreichbar; Ref 09 benennt das als Risiko. Der Fokus ist unabhängig vom Hover-Kanal eine formfolgende Kontur von mindestens 2 px mit mindestens 3:1 (1.4.11), unverdeckt (2.4.11). Dekorebenen bekommen `pointer-events: none` und `aria-hidden`.
- **Leistung.** Motiv, Ebenen und große Flächen animieren nur `transform` und `opacity`, nie `backdrop-filter`, `filter` oder Schatten. Zustandswechsel kleiner Bedienelemente dürfen zusätzlich Farbe, Füllung, Kontur und `filter` (Sättigung) überblenden (siehe 10.8). Bewegung außerhalb des Sichtbereichs hält an. Animationen verschieben kein Layout, das LCP-Element ist das statische Motiv oder Poster, und das INP bleibt unter 200 ms.

### Prüffragen

1. Bleibt die Bedienschicht in jedem Zustand frontal und formstabil, ohne Anhebung per Schatten?
2. Bewegt sich je Ansicht höchstens ein Träger, und ist es das Motiv?
3. Trägt jeder Ruhezustand die volle Komposition mit lesbarem Text, auch in der Fassung „weniger Bewegung“?
4. Schaltet `prefers-reduced-motion: reduce` Schleifen, Parallax, Anheften und Scroll-Kopplung ab, und lässt sich Selbstlauf über 5 s pausieren?
5. Ist jede Interaktion per Tastatur und Touch erreichbar, mit sichtbarem Fokus und ohne Abhängigkeit vom Hover?
6. Animieren Motiv, Ebenen und große Flächen nur `transform` und `opacity` (kleine Bedienelemente zusätzlich Farbe, Füllung, Kontur, Sättigung), und bleiben LCP und Inhalte ohne Skript intakt?


## 10.8 Rendering- und Frontend-Techniken

### Grundsatz

Die Technik folgt dem Effekt, nicht der Verbreitung eines Werkzeugs. Jede Ansicht ist ein Ebenenstapel aus Grund, optionaler Schriftebene, einem Fokusträger und einer HTML-Bedienschicht (5.1); was sich mit HTML, CSS, Bild und Video bauen lässt, wird so gebaut. Laufzeit-Rendering (WebGL, Shader, Animationsbibliotheken) bleibt dem Motiv vorbehalten, braucht einen Grund, den kein leichteres Verfahren erfüllt, und hat immer eine statische Ersatzfassung mit voller Komposition.

### Beobachtet in den Referenzen

- **Verfahren nirgends belegt.** In 0 von 15 Referenzen ist das Rendering-Verfahren sichtbar; alle Technikangaben in Kapitel 4 und 5 sind Hypothesen, gemeinsam ist die eines Stapels aus Hintergrund, Live-Text, Freisteller oder Render und HTML-Bedienschicht (4.4, Frage 4).
- **Bedienschicht flach.** Frontal und unverzerrt in 15 von 15 (Gegenprobe 14 von 14, Konsenssicherheit hoch). Für Ref 09 und 15 nehmen die Profile eine HTML-Schicht über einem Canvas an (Hypothese).
- **Vorgerendert vor Echtzeit.** Vorgerenderte Assets mit Alphakanal (Bild oder Video) sind die naheliegende Hypothese in 8 von 15 (Ref 03, 04, 05, 07, 08, 10, 12, 14). Echtzeit-WebGL ist in 0 von 15 belegt, am ehesten plausibel in Ref 09 und 15 (4.2.7); für Cluster B (6 von 6) halten die Profile fest, dass beides am Standbild nicht unterscheidbar ist. Für Ref 07 und 10 kommt statt Alpha ein farbgleich eingebackener Grund in Frage; Grundgleichheit zeigen 6 von 15 (5.3).
- **Glas.** Hintergrundunschärfe in 4 von 15 (Ref 01, 03, 12, 14; Hypothese `backdrop-filter`), mit höchstens zwei Glasflächen je Ansicht (Ref 01, 03, 12). Die Randbrechung in Ref 01 geht über reinen Blur hinaus; laut Profil braucht sie SVG-Filter (nur Chromium) oder WebGL.
- **Animationswerkzeuge.** Lottie erscheint nur als Ebenenname im Webflow-Navigator von Ref 06, neben einem Parallax-Wrapper mit sechs Ebenen (1 von 15; ob es echte Lottie-Elemente sind, ist offen). GSAP, Rive und Spline sind in 0 von 15 belegt; GSAP und Spline nennen nur spekulative Profilhypothesen zu Ref 15 bzw. 12.
- **Bewegung.** Belegt ist nur ihr Ort, das Motiv (Ref 04/07 als ein Design, Ref 09); D8, D9 und D17 sind mit n = 4, 5 und 3 nicht belastbar, Konsenssicherheit niedrig.
- **Benannte Risiken.** Backdrop-Blur kostet GPU-Leistung (Profile Ref 01, 02, 03, 12, 13); Bildfolgen und Alpha-Video belasten LCP, Speicher und Akku, Alpha-Formate unterscheiden sich je Browser, ein Poster ist nötig (Ref 04, 07); eine Variante für reduzierte Bewegung fehlt oder ist nicht prüfbar (Ref 04, 06, 07). Mobilansichten: 0 von 15.

### Regeln

Regeln 1 und 3 setzen DNA-Prinzip Nr. 1 und 5 um; Regeln 2, 4 und 5 sind Nutzbarkeitsvorgaben dieses Styleguides und gelten für jede Variante.

1. **[Pflicht]** Die Bedienschicht ist DOM: echter Text und fokussierbare Elemente, nie in Canvas, Video oder Bild gerendert, nie mit `perspective` oder 3D-Transformation.
2. **[Pflicht]** Leichtestes ausreichendes Verfahren: Jeder Effekt nutzt die Spalte „erforderlich“ der Matrix; ein schwereres Verfahren braucht eine dokumentierte Begründung (Interaktion oder Zustandszahl, die vorgerendert nicht abbildbar ist).
3. **[Pflicht]** Laufzeit-Rendering wirkt nur in Motiv und Grund, Bewegung nur im Motiv, außer einem bewegten Grund als Neuentwurf (nicht beobachtet) nach 10.7, Regel 4; die Bedienschicht wird davon nicht mitbewegt, gekippt oder verformt, ihre Zustandswechsel nutzen nur die Kanäle der Tabelle (5.6.8, 5.6.10).
4. **[Pflicht]** Jede Fassung, auch ohne JavaScript, ohne WebGL und bei „weniger Bewegung“, zeigt dieselbe Ebenenfolge mit Anker und Maßstabssprung als Standbild (Ableitung, 5.3 „Bewegung“).
5. **[Pflicht]** Das LCP-Element ist Text oder Bild, nie ein Canvas und nie ein Video ohne Poster; die Budgets der Tabelle gelten.
6. **[Variabel]** Medium des Fokusträgers: Standbild, Videoschleife, Bildfolge oder Echtzeit-3D. Spielraum: Standbild ist Voreinstellung; Bewegtmedium nur an genau einem Träger je Ansicht (Nr. 3). Echtzeit-3D ist eine Technikwahl, Neuentwurf (nicht beobachtet) und kein Signature-Effekt (5.4, 5.6.7); es gilt nur unter den Bedingungen von Regel 9.
7. **[Variabel]** Freistellung über Alphakanal oder über Grundgleichheit (Asset auf exakt dem Seitengrund gerendert). Bei Video auf einfarbigem Grund ist Grundgleichheit vorzuziehen; Farbgleichheit von Video und CSS-Grund auf Zielgeräten prüfen.
8. **[Optional]** Glas per `backdrop-filter` (Ref 01, 03, 12, 14), mindestens eine Fläche direkt über gesättigtem Inhalt (Regel in Ref 03), mit nicht deckender Ersatzfüllung über `@supports` (deckend nur bei reduzierter Transparenz oder erhöhtem Kontrast, siehe 10.3). Randbrechung (Ref 01) nur mit Rückfall auf reinen Blur.
9. Bedingungen für Echtzeit-3D als Medium nach Regel 6 (ohne Regelmarke; WebGL, etwa Three.js oder eine Spline-Laufzeitszene; Neuentwurf, nicht beobachtet): nur, wenn Nutzer Objekt oder Kamera stetig steuern (Drehen, Konfigurieren, Kamerafahrt mit vielen Zwischenzuständen); nachgeladen nach LCP, abgeschaltet bei zu geringer Bildrate.
10. **[Optional]** Scrollgekoppelte Szenen, Parallax und Vektoranimation (Neuentwurf; Ankündigung belegt in Ref 09, 15, Ebenenstruktur in Ref 06): zuerst CSS, Bibliothek nur nach Matrix; jede Szene endet in einem lesbaren Ruhezustand (Ref 04).

### Umsetzung (Vorschlag)

Alle Zuordnungen und Werte sind Vorschläge; außer den genannten Belegen ist alles Neuentwurf (nicht beobachtet).

**Effekt-Technik-Matrix.** „Erforderlich“ ist das Verfahren, das den Effekt vollständig trägt; „optional“ sind schwerere Verfahren mit Bedingung.

| Effekt (Beleg) | Erforderlich | Optional, nur wenn … | Ersatzfassung |
|---|---|---|---|
| Ebenenstapel, Typo-Bild-Sandwich (Ref 03, 04, 05, 07, 08, 13, 15) | Live-Text, Alpha-Bild (AVIF/WebP), CSS-Stapel (`z-index`, `overflow: clip`) | `mask-image` nur für den Deckkraftverlauf der Kulissenschrift (Ref 03, 13) | entfällt (statisch) |
| Glas mit Unschärfe (Ref 01, 03, 12, 14) | `backdrop-filter`, halbtransparente Füllung, 1-px-Kante | SVG-Filter oder Shader für Randbrechung | nicht deckende Ersatzfüllung ohne Unschärfe; deckend nur bei reduzierter Transparenz oder erhöhtem Kontrast (10.3) |
| Fokusträger, Vitrine (Ref 05, 07, 08, 09, 10, 12) | Offline-Render als Standbild | Video mit Alpha (zwei Kodierungen, je Browser prüfen); Echtzeit-3D nach Regel 9 | Standbild bzw. Poster |
| Lichtraum, Lichthof (Ref 03, 09, 12, 15) | CSS-Verläufe oder im Asset eingebacken | Shader-Fläche in einer Echtzeitszene | Verlauf statisch |
| Emissives Licht mit Bloom (Ref 05, 09, 12, 14, 15) | im Render eingebacken | Nachbearbeitung (Post-Processing) nur in Echtzeitszene | eingebacken |
| Bewegung im Motiv (Ort belegt: Ref 04/07, 09) | Videoschleife, stumm, `playsinline` | Bildfolge auf Canvas für Scroll-Kopplung; Lottie für Vektorkulissen; Rive bei interaktiven Zuständen | Poster = Endzustand |
| Szenenwechsel, Kamerafahrt (Hypothese Ref 04, 15) | ausgelöster Wechsel: IntersectionObserver plus CSS-Übergang; scrollgekoppelt: CSS `animation-timeline` mit `@supports`, Rückfall per IntersectionObserver | GSAP ScrollTrigger beim Anheften (Pinning) mehrerer Ebenen; Echtzeit-Kamera nach Regel 9 | Szenen als Abschnitte im Endzustand |
| Zustandswechsel (statisch: Ref 02, 03, 12, 14) | CSS-Übergang auf `opacity`, `filter`, Füllung | – | sofortiger Wechsel |
| Scroll-Hinweis mit Linie (Ref 09, 15) | HTML/CSS, statische Linie | – (eine Fortschrittsanimation wäre Neuentwurf, nicht beobachtet, und bräuchte eine begründete Ausnahme von 10.10, Nr. 14) | entfällt (statisch) |

**Ersatzfassungen in drei Stufen** (Neuentwurf):

- *Stufe 0, statisch:* HTML, CSS, Bilder; gilt ohne JavaScript, bei `prefers-reduced-motion: reduce`, bei `Save-Data` und vor dem Nachladen (Regel 4).
- *Stufe 1, Standard:* zusätzlich Videoschleifen und CSS-Scroll-Animationen; Voreinstellung am Telefon.
- *Glas* hängt nicht an den Stufen: Es gilt auch in Stufe 0 und bei „weniger Bewegung“ und wird nur bei `prefers-reduced-transparency`, `prefers-contrast: more` oder fehlendem `backdrop-filter` ersetzt (siehe 10.3).
- *Stufe 2, Echtzeit:* WebGL nach dem LCP, nur wenn ein Kontext mit `failIfMajorPerformanceCaveat` entsteht und die gemessene Bildrate die Schwelle hält; sonst Rückfall auf Stufe 1 mit dem Poster des aktuellen Zustands. `deviceMemory` und `hardwareConcurrency` taugen nur als Vorfilter (nicht in jedem Browser).

**Laufzeit.** Schleifen und Render-Loops pausieren außerhalb des Viewports (IntersectionObserver) und in verborgenen Tabs (`visibilitychange`); Medien reservieren ihren Platz (`aspect-ratio`); Bibliotheken werden selbst ausgeliefert und erst in ihrer Stufe geladen (dynamischer Import).

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Echtzeit-3D | 0 von 15 belegt | nur nach Regel 9 | 5.5 „Kein 3D-Look“ |
| LCP / INP / CLS (75. Perzentil, mobil) | nicht beobachtet | ≤ 2,5 s / ≤ 200 ms / ≤ 0,1 | Schwellen „gut“ der Core Web Vitals (externe Norm) |
| Übertragung bis LCP, komprimiert | nicht beobachtet | ≤ 350 KB mobil | Neuentwurf |
| JavaScript erster Bildschirm, komprimiert | nicht beobachtet | ≤ 100 KB, ohne 3D-Bibliothek | Neuentwurf |
| Nachgeladenes 3D-Paket (Bibliothek, Modell, Texturen) | nicht beobachtet | ≤ 1,5 MB mobil, ≤ 3 MB Desktop | Neuentwurf |
| Videoschleife im Hero | nur Hypothese (Ref 04/07, 09) | 4–10 s (Strom und Partikel ab 4 s, Schweben und Drehen 6–10 s wie 10.7); ≤ 1,5 MB mobil, ≤ 4 MB Desktop | Neuentwurf |
| Bildfolge für Scroll-Kopplung | Hypothese Ref 04 | ≤ 60 Bilder und ≤ 3 MB mobil, ≤ 120 Bilder Desktop | Neuentwurf; Speicherrisiko laut Profil Ref 04 |
| Gleichzeitig sichtbare Blur-Flächen | höchstens 2 (Ref 01, 03, 12) | ≤ 2 mobil, ≤ 3 Desktop | 2 belegt (Ref 01, 03, 12), 3 am Desktop Neuentwurf; GPU-Risiko laut Profilen |
| Gleichzeitig bewegte Träger | 1 (Ref 04/07, 09) | 1 je Ansicht | Nr. 3 |
| Pixeldichte im Canvas | nicht beobachtet | ≤ 1,5 mobil, ≤ 2 Desktop | Neuentwurf |
| Bildrate Echtzeit | nicht beobachtet | Ziel 60 fps; Rückfall bei Median-Framezeit > 25 ms über 2 s | Neuentwurf |
| Animierte Eigenschaften der UI | Zustandskanäle statisch belegt (5.6.10) | Zustand: `opacity`, `filter` (Sättigung), Farbe, Füllung, Kontur; Ein- und Austritt nur über `opacity`; kein `transform` (kein Versatz, keine Skalierung, auch nicht beim Drücken), kein `perspective`, keine 3D-Funktionen | Nr. 1, 5, 7; wie 10.7 und 10.10, Nr. 14 |

Die Tabelle geht in die Zahlensammlung 10.9 ein.

### Mobil und Barrierefreiheit

- **Mobil ist Neuentwurf** (0 von 15). Ab 360 px gilt Stufe 1, Stufe 2 nur nach bestandener Leistungsprüfung.
- **Eigene Zuschnitte.** Poster, Video und Bildfolge erhalten per `<picture>` bzw. `media`-Quelle einen Hochformatschnitt; die Verdeckung im Sandwich wird je Breakpoint neu gesetzt (Profilrisiko Ref 03, 04).
- **Kein Blur über bewegtem Motiv am Telefon.** Er wird je Frame neu gerechnet (Profil Ref 12); dann Bewegung anhalten oder Unschärfe ins Asset backen.
- **Text.** Riesenwort und Headline bleiben Live-Text. Doppelte Dekorschrift erhält `aria-hidden`; eine auf zwei Elemente verteilte Headline bleibt eine Überschrift (Profile Ref 07, 08). Dekorebenen sind für Zeiger durchlässig (`pointer-events: none`, Hypothese Ref 06, 08).
- **Kontrast.** Bedeutungstragender Text erreicht 4,5:1, große Schrift 3:1, gegen den ungünstigsten Frame von Video, Bildfolge oder Szene, nicht nur gegen das Poster.
- **Tastatur.** Was im Canvas per Zeiger steuerbar ist, hat ein DOM-Bedienelement mit Tastaturbedienung (Profil Ref 09). Die Fokusreihenfolge folgt dem DOM, nicht der Stapelfolge.
- **Weniger Bewegung.** `prefers-reduced-motion: reduce` schaltet Schleifen, Scroll-Kopplung, Parallax und Kamerafahrten ab und zeigt die Endzustände (Regel in den Profilen Ref 04 und 06). Automatische Bewegung über 5 s hat eine sichtbare Pause (WCAG 2.2.2); Lichteffekte blitzen höchstens dreimal pro Sekunde (WCAG 2.3.1).
- **Leistung** wird auf einem Mittelklasse-Android-Telefon im gedrosselten Mobilnetz geprüft.

### Prüffragen

1. Ist die Seite ohne JavaScript und WebGL lesbar, bedienbar und als Komposition (Ebenenfolge, Anker, Maßstabssprung) erkennbar?
2. Liegen alle Texte und Bedienelemente im DOM, und bleiben sie bei jeder Animation frontal und formstabil?
3. Ist jedes Verfahren jenseits der Spalte „erforderlich“ mit einer Begründung dokumentiert?
4. Hält der erste Bildschirm auf einem Mittelklasse-Android-Telefon die Budgets für LCP, INP, CLS, JavaScript und Übertragung ein?
5. Schaltet „weniger Bewegung“ alle Schleifen, Scroll-Kopplungen und Parallaxen ab und zeigt lesbare Endzustände, und hat Bewegung über 5 s eine Pause?
6. Erreicht bedeutungstragender Text 4,5:1 (große Schrift 3:1) auch gegen den ungünstigsten Frame bewegter Hintergründe?


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
| Headline-Grad | nicht messbar | `clamp(calc(2.25 * var(--grad-text)), 1.5rem + 3vw, 4.5rem)`, also 36–72 px bei 16 px Fließtext, 40,5–72 px bei 18 px; die Untergrenze hält mobil das 2,25-Fache | Neuentwurf, auf die Verhältnisse oben abgestimmt | 10.1 |
| Grad der Kulissenschrift | ein Wort über ¾ bis fast volle Breite (Ref 03, 05, 15) | Zielbreite 75–100 % der Bühnenbreite ÷ Wortbreite in em, etwa `max(4rem, calc(0.85 * 100cqi / 4.5))` bei 4,5 em Wortbreite | abgeleitet aus Ref 03, 05, 15; Formel Neuentwurf | 10.1, 10.2 |
| Versalhöhe der Raumschrift | 15–20 % (Ref 04), rund ⅕ (Ref 08), rund ⅓ (Ref 15) der Bildschirmhöhe, geschätzt | 15–33 % der Bühnenhöhe (Desktop); mobil 90–100 % der Breite oder einseitig randabfallend | Spanne der Belege; mobil Neuentwurf | 10.2 |
| Zeilenhöhe | nicht messbar | Fließtext 1,5–1,6; Headline 1,05–1,2; Kulissenwort 0,8–1,0 | Neuentwurf; ergänzt in 10.9 | 10.9 |
| Schriftfamilien | Display-Stimme plus sachliche Grotesk (Regel Ref 07); feste Rolle je Gattung: Monospace (Ref 10, 11), Punktziffern (Ref 13) | 1–2; eine dritte nur mit fester, wiederkehrender Rolle | Regeln Ref 07, 11 | 10.1 |
| Verdeckung des Kulissenworts | 1 Buchstabe plus Teile zweier von 8 (Ref 03), Teil eines Buchstabens (Ref 07), 2 von 7 fragmentarisch (Ref 05); Wort lesbar (Regeln Ref 05, 07, 15), Anfang und Ende lesbar (Regel Ref 05) | höchstens etwa ¼ der Buchstaben wesentlich verdeckt; Wortanfang und Wortende bleiben erkennbar, erster und letzter Buchstabe höchstens teilweise verdeckt (z. B. Fuß oder Randpartie); an der Unterkante höchstens das untere Viertel der Versalhöhe | Ref 03, 05, 07, 15; Unterkante Neuentwurf | 10.1, 10.2 |
| Randanschnitt des Kulissenworts | an Viewport- und Bühnenrändern (Ref 04, 08, 15) | nur am Wortende, höchstens ein Glyph teilweise; Ausnahme: der Schriftzug wiederholt sich als Band, sodass das Wort aus den Fragmenten erkennbar bleibt (Ref 08: „…ppy lemon happ…“, beidseitig angeschnitten, kein Exemplar vollständig) | Ableitung aus Ref 05, 15; Schwelle Neuentwurf | 10.2, 10.5 |

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
| Kameraachse | auf der Layoutachse (Ref 09, 15); Standpunkt hält Textzone frei (Ref 14) | in Achsenentwürfen auf der Layoutachse, sonst Standpunkt frei; Textzone frei | Beleg nur für Achsenentwürfe (Ref 09, 15); Textzone 5.3 | 10.2 |
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
| Glaskante, Lichtkante | haarfein, hell, oben stärker (Ref 01, 03, 12, 14) | 1 px; Deckkraft 8–20 % auf dunklem, 40–70 % auf hellem Grund; lichtzugewandte Kante (bei Licht von oben die Oberkante) 1,5- bis 2-fach, höchstens 100 % | Richtung Ref 01, an die Lichtrichtung gekoppelt (10.4, Regel 9); Deckkraft Neuentwurf; Faktor ergänzt in 10.9 | 10.3, 10.4 |
| Abhebung des Glases vom Grund | etwa 1,05–1,1:1 heller (Ref 01, Näherung) | frei, wenn der Inhalt das Element erkennbar macht; sonst Kante ≥ 3:1 | Ref 01; Norm WCAG 1.4.11 | 10.3 |
| Schatten unter Glas | keiner (Ref 03, 12, 14) | `none` | Nr. 6 | 10.3 |
| Rang über Deckkraft | aktive Pille deckend, inaktive halbtransparent (Ref 02); Glas gegen opak (Ref 03) | Füllung aktiv 100 %, sekundär 10–25 %; Text in beiden Zuständen ≥ 4,5:1 | Prinzip Ref 02; Werte Neuentwurf; ergänzt in 10.9 | 10.7 |
| Hintergrundraster | etwa 1,2:1 (Ref 01, Näherung); Ref 11 | 1 px, ≤ 1,3:1, nie unter Fließtext | Ref 01, 11 | 10.3 |
| Oberflächen an einem Objekt | bis fünf (Ref 10) | ≤ 5, nur am Fokusträger | Ref 10 | 10.3 |
| Korn | 0 von 15 belegt (Kompression verdeckt es) | sichtbares Korn nur als Neuentwurf, nie auf UI-Flächen, nie unter Lesetext; gegen Streifen in Verläufen Dithering ± 1–2 von 255 Tonwerten, eingebacken | Neuentwurf; Grenze aus Nr. 9 und 11 | 10.3 |

### Licht und Schatten

| Parameter | beobachtet in den Referenzen | Vorschlag (Wert/Bereich) | Ableitung | Abschnitt |
|---|---|---|---|---|
| Schattenstufen je Ansicht | keine Elevation; Schatten nur auf heller Fläche (3 von 3: Ref 01, 05, 11) | 1, nur auf heller Fläche; sonst `none` | Nr. 6; Ableitung | 10.4 |
| Stärke des Begleitschattens | etwa 5–7 Tonwerte dunkler (Ref 01, Näherung) | dunkelste Stelle ≤ etwa 8 von 255 Tonwerten unter dem Umfeld; Startwert 4–8 % Deckkraft im abgedunkelten Grundton | aus Ref 01 | 10.4 |
| Versatz | weit nach unten, stärkste Abdunklung etwa ¼–⅓ der Formhöhe unter der Form (Ref 01, Näherung); gering (Ref 11) | in Lichtrichtung (`--licht-x`, `--licht-y`; bei Licht von oben x = 0); Versatzlänge y = 10–25 % der Elementhöhe | Ref 01, 11; Richtung an 10.4, Regel 9 gekoppelt; Werte Neuentwurf | 10.4 |
| Weichzeichnung des Schattens | großer Radius, keine Kontaktkante (Ref 01, 11); Radien nicht messbar | 2–3 × y | Neuentwurf (Verhältnis in Ref 01, 11 nicht messbar) | 10.4 |
| Ausdehnung (spread) | nicht beobachtet | −25 % von y | Neuentwurf | 10.4 |
| Objektschatten | bis etwa 40 % dunkler als das Umfeld (Ref 05, geschätzt), Einzelfall | Obergrenze; nur im Asset, nur auf hellem Grund | Ref 05 | 10.4, 10.6 |
| Lichtrichtung | je Referenz eine, sonst frei: oben, seitlich, aus dem Motiv, diffus (Konfidenz niedrig) | genau eine je Ansicht; Schatten, Kantensaum und Glanz widersprechen sich nicht; Schattenversatz und Lichtkante folgen ihr über `--licht-x`, `--licht-y` | Ableitung aus Ref 01; Token Neuentwurf | 10.4 |
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
| Ort der Bewegung | nur im Motiv; Bedienschicht in 0 von 4 auswertbaren bewegt (Ref 04/07, 09) | nur Motivebenen; Bedienschicht steht still; bewegter Grund nur als Neuentwurf, ohne Konkurrenz zum Motiv und innerhalb von Nr. 11 | Beleg; Nr. 1; bewegter Grund Neuentwurf (nicht beobachtet), Nr. 3 und 11 | 10.7, 10.8 |
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
  --grad-headline: clamp(calc(2.25 * var(--grad-text)), 1.5rem + 3vw, 4.5rem);

  --radius-full: 9999px; --radius-l: 1.75rem; --radius-s: .625rem;
  --z-grund: 0; --z-kulisse: 10; --z-motiv: 20;
  --z-vordergrund: 25; --z-ui: 30; --z-overlay: 40;

  --blur-leicht: 12px; --blur-stark: 32px;
  --glas-blur: var(--blur-leicht);           /* .glas--text setzt --blur-stark */
  --glas-fuellung: .2; --fuellung-text: .55;
  --fuellung-ersatz: .8; --fuellung-deckend: .95;
  --kante-alpha: .14; --kante-licht: .24;    /* dunkler Grund; heller Grund .4–.7 */
  --licht-x: 0; --licht-y: 1;                /* Lichtrichtung je Ansicht (10.4): Licht von oben */
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


## 10.10 Gestalterische Ausschlussregeln

### Grundsatz

Ausgeschlossen ist, was die Konstruktion aus Kapitel 5 umkehrt: eine räumliche, schattengetragene, leuchtende oder fluide Bedienschicht, ein Grund oder Raster, das den einen Anker verdrängt, und Bewegung im Rahmen statt im Motiv. Unabhängig von der DNA darf kein Effekt Lesbarkeit, Bedienbarkeit, Responsivität oder Leistung unter die Mindestwerte drücken; im Konflikt weicht der Effekt, nie die Mindestanforderung.

### Beobachtet in den Referenzen

- **Räumliche Bedienschicht:** 0 von 15 (Gegenprobe 0 von 14), Konsenssicherheit hoch.
- **Tragender Schlagschatten:** 0 von 11 Website-Heros; 12 von 15 ohne (Gegenprobe 11 von 14), die Ausnahmen Ref 01, 05, 11 weich und auf hellen Flächen; mittel, Schwellenfall.
- **UI-Material und UI-Licht:** opakes Eigenmaterial nur angedeutet (Ref 05, 13), flächiges Leuchten nur Ref 13 (in 5.4 als nicht DNA-konform geführt); hoch.
- **Form:** fluide Bedienelemente 0 von 15; regellos gemischte Formfamilien 0 von 13 auswertbaren; mehr als vier Radienstufen nicht belegt (Ref 14 als Obergrenze); ein bewusster Bruch nur in Ref 03. Konsenssicherheit hoch (D5), für die Formstabilität mittel (D14).
- **Grund und Morphing:** Grund stark ausgeprägt 0 von 15, Mesh- oder Blob-Verläufe 0 von 15; Morphing deutlich 1 von 15, Gegenprobe 0 von 14; mittel.
- **Ordnung:** keine Ordnungslinie in 0 von 15. Dichte Raster ohne Negativraum und Einzelanker nur in Ref 13 und 14 (Bento im engeren Sinn 2 von 15). Maßstabssprung in 12 von 15; Sprünge unter etwa dem Dreifachen sind nicht belegt (Ref 06, 02, geschätzt).
- **Bild:** gerahmte Bildbeigabe nur Ref 01 und 11 (keine Website-Heros), Bild als Bühne 13 von 15, hoch. Raumschrift ohne plastisches Gegenüber 0 von 4, Render der Stufe 4 ohne Licht 0 von 6, weichgezeichnete Schriftebene 0 von 7.
- **Lesbarkeit:** Kontrastrisiken in 12 von 15 Profilen benannt (Gegenprobe 11 von 14), als Zielkonflikt der Sammlung, nicht als Prinzip (4.4, Frage 6). Kulissenschrift in Ref 03 etwa 1,3:1 (geschätzt). Profilregeln fordern 4,5:1 für Kleintexte (Ref 03, 05), mindestens 3:1 für Tonwertstufen (Ref 01) und Text zur Icon-Navigation (Ref 05).
- **Zeitlich (n ≤ 5, Konsenssicherheit niedrig):** Bewegung der Bedienschicht in 0 von 4 auswertbaren; ein stehender Zwischenzustand macht Schrift unlesbar (Ref 04); eine Fassung mit reduzierter Bewegung verlangen die Profile Ref 04 und 06. Fokuszustände sind in keiner Referenz sichtbar; Tastaturbedienung, Mobilverhalten (0 von 15 Mobilansichten) und Leistung sind nicht beobachtbar.

### Ausschlüsse

Nr. 1–8 und 11–13 setzen die verbindliche DNA (5.2) als Verbot um, Nr. 14 ist eine Ableitung aus Nr. 1 und 3 (zeitliche Dimensionen sind in Kapitel 5 nie verbindlich), Nr. 9 und 10 setzen Rahmen aus 5.3 um; Nr. 15–20 sind Nutzbarkeitsvorgaben dieses Styleguides, gestützt auf WCAG 2.2 AA und Core Web Vitals statt auf die Referenzen. Nr. 18 geht mit der Fassung „weniger Bewegung“ als eigene Vorgabe über AA hinaus (Profilregeln Ref 04, 06; WCAG 2.3.3, Stufe AAA).

1. **[Pflicht]** Keine räumliche Transformation der Bedienschicht: keine Kippung, kein Tilt beim Überfahren, kein 3D-Flip, keine perspektivische Bedienschrift, auch nicht in Zwischenzuständen. *Grund:* 15 von 15 frontal (Nr. 1).
2. **[Pflicht]** Kein Schlagschatten als Elevation oder Tiefenträger, kein Neumorphismus. *Spielraum:* **[Optional]** ein weicher, blasser Begleitschatten auf heller Fläche neben Verdeckung (siehe 10.4). *Grund:* Nr. 6.
3. **[Pflicht]** Keine Bedienelemente aus Metall, Relief, Glanz oder Kissenform und keine leuchtenden Flächen in der Bedienschicht. *Spielraum:* **[Optional]** ein Leuchtsaum an genau einem aktiven Element. *Grund:* Nr. 9 und 10; Ref 13 als Gegenbeispiel.
4. **[Pflicht]** Keine fluiden, federnden oder sich dehnenden Bedienelemente, keine zweite Formfamilie, höchstens vier Radienstufen, höchstens ein bewusster Bruch je Ansicht. *Grund:* Nr. 5; Obergrenzen als Ableitung (siehe 10.5).
5. **[Pflicht]** Kein zweiter Akzentreiz, der mit dem Fixationsanker konkurriert; Zustände laufen über Deckkraft, Sättigung, Füllung gegen Kontur oder Glas gegen opak. *Grund:* Fokus über einen einzigartigen Reiz in 10 von 15; Ableitung aus Nr. 3.
6. **[Pflicht]** Keine einschichtige Fläche, keine Ebenen ohne eindeutige Stapelfolge, höchstens sechs Ebenen. *Grund:* Nr. 2; mehr als sechs Ebenen nicht belegt (siehe 10.2).
7. **[Pflicht]** Kein Hauptbild als gerahmte Beigabe neben dem Text, keine deckende Box hinter Text auf dem Bild. Ausgenommen ist die deckende Glasfüllung bei reduzierter Transparenz oder erhöhtem Kontrast (10.3); dort geht die Mindestanforderung vor. *Grund:* Nr. 4.
8. **[Pflicht]** Kein dominanter Grund: keine Mesh- oder Blob-Verläufe, kein zweites Helligkeitszentrum, höchstens drei Verlaufszonen, keine Partikel und kein kontraststarkes Muster unter Lesetext. *Grund:* Nr. 11.
9. **[Pflicht]** Keine Raumschrift ohne plastisches Gegenüber, kein Render der Stufe 4 ohne gestaltetes Licht. *Grund:* Rahmen aus 5.3 („Rolle der Schrift“, „Plastischer Körper“); 7 von 7 bzw. 6 von 6 (5.6.7).
10. **[Pflicht]** Kein weichgezeichneter Fixationspunkt, keine weichgezeichnete Schriftebene, keine Unschärfe als gleichmäßige Flächenstimmung. *Grund:* Rahmen aus 5.3 („Unschärfe“); 0 von 7 (5.6.4).
11. **[Pflicht]** Kein Layout ohne Ordnungslinie und kein Feld gleichrangiger Kacheln ohne Anker. *Spielraum:* **[Optional]** Bento-Raster nur mit erhaltenem Anker und Negativraum. *Grund:* Nr. 3 und 8; Ref 13 und 14 erfüllen die Bedingung nicht.
12. **[Pflicht]** Keine gleichmäßige Größenskala und keine Zwischengrößen; zwischen Hauptelement und Klein-UI steht höchstens eine Headline. *Grund:* Nr. 7.
13. **[Pflicht]** Keine Bühne mit deutlich weniger als etwa einem Drittel freier Fläche. *Grund:* Nr. 8 (Ableitung aus geschätzten Werten).
14. **[Pflicht]** Keine Bewegung der Bedienschicht über Zustandswechsel hinaus, kein stehender Zwischenzustand mit unlesbarer Schrift (belegt: Ref 04/07, 09 bzw. Ref 04); kein zweiter bewegter Träger (auch kein bewegter Grund, der mit dem Motiv konkurriert; ein bewegter Grund ist sonst Neuentwurf nach 10.7, Regel 4), kein springender Rahmen, kein Ruhezustand ohne volle Komposition (Ableitung aus Nr. 1 und 3; siehe 10.7).
15. **[Pflicht]** Kontrast: Bedeutungstragender Text erreicht 4,5:1, großer Text 3:1, Bedienelementkonturen und Fokusanzeige 3:1 (WCAG 1.4.3, 1.4.11), jeweils gegen die ungünstigste Stelle des Untergrunds. Nur rein dekorative Kulissenschrift ist ausgenommen.
16. **[Pflicht]** Text bleibt Text: Bedienschrift und Headline stehen als Live-Text im DOM, Dekorschrift ist für Hilfstechnik verborgen, reine Icons haben einen zugänglichen Namen oder ein sichtbares Label.
17. **[Pflicht]** Tastatur: Jede Funktion ist per Tastatur erreichbar, der Fokus sichtbar und unverdeckt (2.4.7, 2.4.11), und nichts hängt allein am Überfahren. Dekorebenen fangen keine Zeigerereignisse.
18. **[Pflicht]** Weniger Bewegung: `prefers-reduced-motion: reduce` zeigt Endzustände (eigene Vorgabe über AA hinaus: Profilregeln Ref 04, 06; WCAG 2.3.3, Stufe AAA); Selbstlauf über 5 s ist pausierbar, nichts blitzt öfter als dreimal pro Sekunde (2.2.2, 2.3.1, beide Stufe A; siehe 10.7).
19. **[Pflicht]** Responsivität: Ab 360 px gilt eine eigene Komposition; bis 320 CSS-px gibt es kein horizontales Scrollen (1.4.10), 200 % Textgröße bleibt verlustfrei (1.4.4), Ziele messen mindestens 24 × 24 px (2.5.8).
20. **[Pflicht]** Leistung: Die Budgets aus 10.8 gelten. Ein Effekt, der sie reißt, fällt auf seine Ersatzfassung zurück.

### Umsetzung (Vorschlag)

Die Prüfverfahren sind Neuentwurf (nicht beobachtet); die Referenzen liefern nur die Schwellen, gegen die geprüft wird.

1. **Ebeneninventar je Ansicht:** Ebenen in Stapelfolge, Fokusträger und Ausdrucksträger auflisten; prüft Nr. 6, 9 und 13.
2. **Standbildprobe:** Bildschirmfotos jedes Ruhezustands, ohne JavaScript und mit `prefers-reduced-motion: reduce`; Anker, Ordnungslinie und Maßstabssprung müssen in jedem Bild erkennbar sein (Nr. 11–14).
3. **Unschärfeprobe:** Ansicht in Graustufen stark weichzeichnen. Es bleibt genau ein dominanter Fleck, der Anker (Nr. 5, 8, 11).
4. **Kontrastmessung:** von Hand mit Pipette, denn automatische Prüfer erfassen Text auf Bildern nicht: gegen die ungünstigste Bildpartie unter jeder Glyphe, bei Glas dahinter (Profilregel Ref 12), bei Video an Stichbildern etwa alle 0,5 s.
5. **Codesperre:** Stylelint-Regeln gegen `perspective`, `rotateX/Y`, `skew` und gegen `box-shadow` in UI-Komponenten außer `none` und den Tokens aus 10.4 (Begleitschatten, Lichtkante, Schein als Zustand), gegen `transition: all` und gegen animiertes `width`, `height`, `top` und `left` (Nr. 1–4).
6. **Tastatur- und Breitendurchlauf:** Tabulator durch die ganze Seite; Breiten 360, 390, 768, 1280 und 1440 px; Zoom 200 % und 400 %.
7. **Leistung:** wie 10.8, Labor- und Feldwerte.

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Räumliche Transformation der UI | 0 von 15 | keine | Nr. 1 |
| Tragender Schlagschatten an UI | 0 von 11 Website-Heros | keiner; Begleitschatten siehe 10.4 | Nr. 6 |
| Leuchtende UI-Flächen | 1 von 15 (Ref 13), nicht konform | 0; Saum an ≤ 1 Element | Nr. 10 |
| Radienstufen der UI | ≤ 4 (Ref 14) | ≤ 4 | Beleg; Ableitung |
| Ebenen je Ansicht | 3–6 | 3–4; 5–6, wenn die Reihenfolge eindeutig bleibt (vorzugsweise in einer Kamera-Szene); > 6 ausgeschlossen | Beleg (wie 10.1, 10.2); > 6 Ableitung |
| Helligkeitszentren / Verlaufszonen im Grund | höchstens 1 / 3 (Ableitung aus D13 < 3) | 1 hinter dem Anker / ≤ 3 | Nr. 11 |
| Freie Fläche im Hero | 35–40 % bis 70–75 % (geschätzt) | ≥ 33 % | Untergrenze Ref 03, gerundet |
| Maßstabssprung Hauptelement : Bedienschrift | ab etwa 3× (Ref 06, 02, geschätzt) | ≥ 3× | Ableitung |
| Kontrast bedeutungstragender Text | Profilregel 4,5:1 (Ref 03, 05) | ≥ 4,5:1; groß (≥ 24 px oder ≥ 18,66 px fett) ≥ 3:1 | WCAG 1.4.3 |
| Kontrast Kulissenschrift | etwa 1,3:1 (Ref 03, geschätzt) | frei, nur wenn rein dekorativ | 5.5 |
| Kontrast Konturen und Fokus | nicht beobachtet | ≥ 3:1 | WCAG 1.4.11 |
| Fokusanzeige | in 0 von 15 sichtbar | Kontur ≥ 2 px, unverdeckt | Neuentwurf; WCAG 2.4.7, 2.4.11 |
| Kleinste Schrift | Bedienschrift „winzig“ (Maßstabssprung) | Fließtext ≥ 16 px; Bedienschrift und Mikrolabel ≥ 14 px und ≥ Fließtext ÷ 1,25 | Neuentwurf; wie 10.1 und 10.9 |
| Zielgröße | nicht beobachtet | ≥ 24 × 24 px, empfohlen 44 px | WCAG 2.5.8; wie 10.7 |
| Kleinste Breite | 0 von 15 mobil | Komposition ab 360 px, Reflow bis 320 px | Neuentwurf; WCAG 1.4.10 |
| Textvergrößerung | nicht beobachtet | 200 % ohne Verlust | WCAG 1.4.4 |
| Selbstlauf ohne Pause / Blitze | nicht beobachtet | ≤ 5 s / ≤ 3 je Sekunde | WCAG 2.2.2, 2.3.1 |
| LCP / INP / CLS (mobil, 75. Perzentil) | nicht beobachtet | ≤ 2,5 s / ≤ 200 ms / ≤ 0,1 | Core Web Vitals; wie 10.8 |

### Mobil und Barrierefreiheit

- **Keine Lockerung am Telefon.** Mobil ist Neuentwurf (0 von 15); die Ausschlüsse 1–14 gelten ab 360 px unverändert. Fehlt Platz, entfällt der Effekt, nicht der Negativraum.
- **Zuschnitt neu prüfen.** Ein Hochformatzuschnitt verschiebt Bildpartien unter den Text. Deshalb wird der Kontrast je Zuschnitt neu gemessen, und die Sandwich-Verdeckung darf kein Wort unlesbar machen (Profilregeln Ref 05, 07).
- **Überfahren gibt es nicht.** Jeder Zustand ist per Tippen und per Tastatur erreichbar.
- **Weniger Bewegung und Leistung** wie 10.7 und 10.8. Glas über bewegtem Motiv entfällt am Telefon.

### Prüffragen

1. Ist die Bedienschicht in jedem Zustand frontal, schattenfrei als Tiefenträger, ohne Eigenmaterial, nicht leuchtend und formstabil?
2. Bleibt bei der Unschärfeprobe genau ein Anker, und hat der Grund höchstens ein Helligkeitszentrum?
3. Erreicht jeder bedeutungstragende Text 4,5:1 (groß 3:1) gegen die ungünstigste Stelle seines Untergrunds, in jedem Zuschnitt und jedem Frame?
4. Ist alles per Tastatur bedienbar, mit sichtbarem, unverdecktem Fokus, und ohne Abhängigkeit vom Überfahren?
5. Funktioniert die Seite ab 360 px ohne horizontales Scrollen und bei 200 % Text, und zeigt `prefers-reduced-motion` lesbare Endzustände?
6. Hält der erste Bildschirm auf einem Mittelklasse-Telefon die Leistungsbudgets aus 10.8 ein?


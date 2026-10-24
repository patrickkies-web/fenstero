## 10.4 Licht und Schatten

### Grundsatz

Licht gehört dem Motiv und bündelt den Fokus über Ausschließlichkeit: ein Lichtkern, ein Helligkeitszentrum hinter dem Fixationsanker, eine Richtung je Ansicht. Die Bedienschicht bleibt unbeleuchtet, glanzlos und ohne tragenden Schatten. Schatten ist höchstens ein weicher, blasser Begleiter auf heller Fläche; auf dunklem Grund trennt Licht statt Schatten.

### Beobachtet in den Referenzen

- **Schatten.** Ein Schlagschatten als tragendes Tiefenmittel fehlt in 12 von 15 = 80 % (Gegenprobe 11 von 14; Konsenssicherheit D4 mittel, Schwellenfall). Die Ausnahmen Ref 01, 05 und 11 setzen ihn weich und nur auf heller Fläche (3 von 3). Maßstab ist Ref 01 (unverzerrter Screenshot): großflächig, weit nach unten versetzt, etwa 5–7 Tonwerte dunkler (Näherung). Der Objektschatten in Ref 05 (bis etwa 40 % unter dem Umfeld, geschätzt) bleibt Einzelfall. Sonst erscheint Schatten als Eigenschatten im Render (Ref 09, 10, 12, 14) oder gezeichnet (Ref 06). Verankert wird ohne Kontaktschatten in 7 von 15 = 47 % (Ref 07, 08, 09, 10, 12, 13, 15).
- **Streuung und Weichheit.** Alle belegten Schlagschatten sind weich und großflächig; einen harten Schatten zeigt keine Referenz (eigene Durchsicht). Radien sind nicht messbar. D4 (deutlich 11 von 15) speist sich überwiegend aus Unschärfe (siehe 10.2, 10.3); Expertenspannweite Ø 0,73, die höchste der statischen Dimensionen, niedrige Konfidenz 28 %.
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

- **Begleitschatten:** ein einziger `box-shadow`, x = 0, Radius deutlich größer als der Versatz, negative Ausdehnung. Schattenton ist der abgedunkelte Grundton statt Neutralschwarz (Neuentwurf). Am Bildschirm gegen das Maß aus Ref 01 prüfen.
- **Lichtkante:** `inset box-shadow` oder `border`, 1 CSS-px, oben stärker (aus Ref 01).
- **Lichtraum:** `radial-gradient` mit Zentrum am Fixationsanker, höchstens drei Stopps; sein Helligkeitsumfang endet, wo Lesetext unter 4,5:1 fiele.
- **Bloom, Glanz, Objektschatten:** im Render-Asset eingebacken (Hypothese aus Ref 05, 09, 12, 15); CSS-Ersatz für den Lichthof ist ein radialer Verlauf hinter dem Freisteller (Hypothese aus Ref 03, 12). `filter` auf großen Ebenen ist nicht erforderlich (siehe 10.8).
- **Schein als Zustand:** farbiger Außenschatten in der Akzentrolle (Hypothese aus Ref 13), stets mit Kontur- oder Füllungswechsel.

```css
.flaeche-hell   { box-shadow: 0 var(--schatten-y) var(--schatten-r) var(--schatten-spread) rgb(var(--schattenton) / var(--schatten-alpha)); }
.flaeche-dunkel { box-shadow: inset 0 1px 0 rgb(var(--kante-ton) / var(--kante-alpha)); border: 1px solid transparent; }
.grund-licht    { background: radial-gradient(circle at var(--anker-x) var(--anker-y), rgb(var(--farbe-grund-zentrum)), rgb(var(--farbe-grund)) 45%, rgb(var(--farbe-grund-rand))); }
```

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Schattenstufen je Ansicht | keine Elevation (5.5); Schatten nur auf heller Fläche (3 von 3) | 1, nur auf heller Fläche; sonst `none` | Nr. 6, Ableitung |
| Stärke des Begleitschattens | etwa 5–7 Tonwerte dunkler (Ref 01, Näherung) | dunkelste Stelle ≤ etwa 8 von 255 Tonwerten unter dem Umfeld; Deckkraft 4–8 % | aus Ref 01 |
| Versatz | senkrecht, weit nach unten, stärkste Abdunklung etwa ¼–⅓ der Formhöhe unter der Form (Ref 01, Näherung); gering (Ref 11) | x = 0; y = 10–25 % der Elementhöhe (aufliegende Karte eher 10 %, schwebende Form bis 25 %) | Obergrenze aus Ref 01, Untergrenze aus Ref 11; Werte Neuentwurf |
| Weichzeichnung | großer Radius (Ref 01, 11) | 2–3 × y-Versatz | Verhältnis aus Ref 01/11, Werte Neuentwurf |
| Ausdehnung (spread) | nicht beobachtet | −25 % des y-Versatzes | Neuentwurf |
| Objektschatten | Ref 05 bis etwa 40 % dunkler (geschätzt) | Obergrenze, nur im Asset | Einzelfall |
| Lichtkante | haarfein (6 von 15) | 1 CSS-px; Aufhellung 8–20 % auf dunkler, 40–70 % auf heller Fläche; oben stärker | Stärke aus 5.6.12, Richtung aus Ref 01, Deckkraft Neuentwurf |
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

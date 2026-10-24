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

Nr. 1–8 und 11–14 setzen die verbindliche DNA (5.2) als Verbot um, Nr. 9 und 10 Rahmen aus 5.3; Nr. 15–20 sind Nutzbarkeitsvorgaben dieses Styleguides, gestützt auf WCAG 2.2 AA und Core Web Vitals statt auf die Referenzen. Nr. 18 geht mit der Fassung „weniger Bewegung“ als eigene Vorgabe über AA hinaus (Profilregeln Ref 04, 06; WCAG 2.3.3, Stufe AAA).

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
14. **[Pflicht]** Keine Bewegung der Bedienschicht über Zustandswechsel hinaus, kein stehender Zwischenzustand mit unlesbarer Schrift (belegt: Ref 04/07, 09 bzw. Ref 04); kein zweiter bewegter Träger, kein bewegter Grund, kein springender Rahmen, kein Ruhezustand ohne volle Komposition (Ableitung; siehe 10.7).
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

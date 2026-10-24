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
15. **[Optional]** Bild-Reveal per Maske: Neuentwurf (nicht beobachtet), nur am Fokusträger, Standbild als Endzustand (siehe 10.7, 10.8).

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
- **Weniger Bewegung.** Bei `prefers-reduced-motion: reduce` zeigt ein bewegtes Motiv sein Poster; Reveals entfallen.
- **Leistung.** Kein `filter: blur()` oder `drop-shadow()` auf großen Bildebenen; Unschärfe, Auslauf und Schatten werden ins Asset gebacken.

### Prüffragen

1. Bildet das Hauptbild den Raum der Ansicht, statt als gerahmte Beigabe neben dem Text zu stehen?
2. Ist zwischen Asset und Seite bei 100 % und 200 % Zoom und am Telefon kein Grundsprung und kein Rest des Aufnahmegrunds als Saum oder Halo sichtbar (gestaltetes Licht nach 10.4 ausgenommen)?
3. Gibt es höchstens einen plastischen Körper oder eine Szene als Fokus, mit untergeordneten Nebenkörpern, verankert ohne tragenden Schlagschatten?
4. Erreicht jeder Text auf dem Bild ohne deckende Box 4,5:1 (große Schrift 3:1) gegen die ungünstigste Bildpartie?
5. Bleiben Navigation, Hauptaktion, Lesetext und Fokus unverdeckt, und sind Bildebenen für Zeiger durchlässig?
6. Hat jedes Hauptbild bei 360 px einen eigenen Zuschnitt ohne horizontalen Scroll, und hält das Fokus-Asset sein Budget?

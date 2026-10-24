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
3. **[Pflicht]** Laufzeit-Rendering und Bewegung wirken nur in Motiv und Grund; die Bedienschicht wird davon nicht mitbewegt, gekippt oder verformt, ihre Zustandswechsel nutzen nur die Kanäle der Tabelle (5.6.8, 5.6.10).
4. **[Pflicht]** Jede Fassung, auch ohne JavaScript, ohne WebGL und bei „weniger Bewegung“, zeigt dieselbe Ebenenfolge mit Anker und Maßstabssprung als Standbild (Ableitung, 5.3 „Bewegung“).
5. **[Pflicht]** Das LCP-Element ist Text oder Bild, nie ein Canvas und nie ein Video ohne Poster; die Budgets der Tabelle gelten.
6. **[Variabel]** Medium des Fokusträgers: Standbild, Videoschleife, Bildfolge oder Echtzeit-3D. Spielraum: Standbild ist Voreinstellung; Bewegtmedium nur an genau einem Träger je Ansicht (Nr. 3); Echtzeit-3D nur nach Regel 9.
7. **[Variabel]** Freistellung über Alphakanal oder über Grundgleichheit (Asset auf exakt dem Seitengrund gerendert). Bei Video auf einfarbigem Grund ist Grundgleichheit vorzuziehen; Farbgleichheit von Video und CSS-Grund auf Zielgeräten prüfen.
8. **[Optional]** Glas per `backdrop-filter` (Ref 01, 03, 12, 14), mindestens eine Fläche direkt über gesättigtem Inhalt (Regel in Ref 03), mit deckender Ersatzfüllung über `@supports`. Randbrechung (Ref 01) nur mit Rückfall auf reinen Blur.
9. **[Optional]** Echtzeit-3D (WebGL, etwa Three.js oder eine Spline-Laufzeitszene; Neuentwurf, nicht beobachtet) nur, wenn Nutzer Objekt oder Kamera stetig steuern (Drehen, Konfigurieren, Kamerafahrt mit vielen Zwischenzuständen); nachgeladen nach LCP, abgeschaltet bei zu geringer Bildrate.
10. **[Optional]** Scrollgekoppelte Szenen, Parallax und Vektoranimation (Neuentwurf; Ankündigung belegt in Ref 09, 15, Ebenenstruktur in Ref 06): zuerst CSS, Bibliothek nur nach Matrix; jede Szene endet in einem lesbaren Ruhezustand (Ref 04).

### Umsetzung (Vorschlag)

Alle Zuordnungen und Werte sind Vorschläge; außer den genannten Belegen ist alles Neuentwurf (nicht beobachtet).

**Effekt-Technik-Matrix.** „Erforderlich“ ist das Verfahren, das den Effekt vollständig trägt; „optional“ sind schwerere Verfahren mit Bedingung.

| Effekt (Beleg) | Erforderlich | Optional, nur wenn … | Ersatzfassung |
|---|---|---|---|
| Ebenenstapel, Typo-Bild-Sandwich (Ref 03, 04, 05, 07, 08, 13, 15) | Live-Text, Alpha-Bild (AVIF/WebP), CSS-Stapel (`z-index`, `overflow: hidden`, `mask-image`) | – | entfällt (statisch) |
| Glas mit Unschärfe (Ref 01, 03, 12, 14) | `backdrop-filter`, halbtransparente Füllung, 1-px-Kante | SVG-Filter oder Shader für Randbrechung | deckende Füllung |
| Fokusträger, Vitrine (Ref 05, 07, 08, 09, 10, 12) | Offline-Render als Standbild | Video mit Alpha (zwei Kodierungen, je Browser prüfen); Echtzeit-3D nach Regel 9 | Standbild bzw. Poster |
| Lichtraum, Lichthof (Ref 03, 09, 12, 15) | CSS-Verläufe oder im Asset eingebacken | Shader-Fläche in einer Echtzeitszene | Verlauf statisch |
| Emissives Licht mit Bloom (Ref 05, 09, 12, 14, 15) | im Render eingebacken | Nachbearbeitung (Post-Processing) nur in Echtzeitszene | eingebacken |
| Bewegung im Motiv (Ort belegt: Ref 04/07, 09) | Videoschleife, stumm, `playsinline` | Bildfolge auf Canvas für Scroll-Kopplung; Lottie für Vektorkulissen; Rive bei interaktiven Zuständen | Poster = Endzustand |
| Szenenwechsel, Kamerafahrt (Hypothese Ref 04, 15) | CSS `animation-timeline` mit `@supports`, Rückfall per IntersectionObserver | GSAP ScrollTrigger beim Anheften (Pinning) mehrerer Ebenen; Echtzeit-Kamera nach Regel 9 | Szenen als Abschnitte im Endzustand |
| Zustandswechsel (statisch: Ref 02, 03, 12, 14) | CSS-Übergang auf `opacity`, `filter`, Füllung | – | sofortiger Wechsel |
| Scroll-Hinweis mit Linie (Ref 09, 15) | HTML/CSS, Linie per `scaleX` | – | statische Linie |

**Ersatzfassungen in drei Stufen** (Neuentwurf):

- *Stufe 0, statisch:* HTML, CSS, Bilder; gilt ohne JavaScript, bei `prefers-reduced-motion: reduce`, bei `Save-Data` und vor dem Nachladen (Regel 4).
- *Stufe 1, Standard:* zusätzlich Videoschleifen, CSS-Scroll-Animationen, Glas; Voreinstellung am Telefon.
- *Stufe 2, Echtzeit:* WebGL nach dem LCP, nur wenn ein Kontext mit `failIfMajorPerformanceCaveat` entsteht und die gemessene Bildrate die Schwelle hält; sonst Rückfall auf Stufe 1 mit dem Poster des aktuellen Zustands. `deviceMemory` und `hardwareConcurrency` taugen nur als Vorfilter (nicht in jedem Browser).

**Laufzeit.** Schleifen und Render-Loops pausieren außerhalb des Viewports (IntersectionObserver) und in verborgenen Tabs (`visibilitychange`); Medien reservieren ihren Platz (`aspect-ratio`); Bibliotheken werden selbst ausgeliefert und erst in ihrer Stufe geladen (dynamischer Import).

| Parameter | beobachtet | Vorschlag | Ableitung |
|---|---|---|---|
| Echtzeit-3D | 0 von 15 belegt | nur nach Regel 9 | 5.5 „Kein 3D-Look“ |
| LCP / INP / CLS (75. Perzentil, mobil) | nicht beobachtet | ≤ 2,5 s / ≤ 200 ms / ≤ 0,1 | Schwellen „gut“ der Core Web Vitals (externe Norm) |
| Übertragung bis LCP, komprimiert | nicht beobachtet | ≤ 350 KB mobil | Neuentwurf |
| JavaScript erster Bildschirm, komprimiert | nicht beobachtet | ≤ 100 KB, ohne 3D-Bibliothek | Neuentwurf |
| Nachgeladenes 3D-Paket (Bibliothek, Modell, Texturen) | nicht beobachtet | ≤ 1,5 MB mobil, ≤ 3 MB Desktop | Neuentwurf |
| Videoschleife im Hero | nur Hypothese (Ref 04/07, 09) | 4–10 s; ≤ 1,5 MB mobil, ≤ 4 MB Desktop | Neuentwurf |
| Bildfolge für Scroll-Kopplung | Hypothese Ref 04 | ≤ 60 Bilder und ≤ 3 MB mobil, ≤ 120 Bilder Desktop | Neuentwurf; Speicherrisiko laut Profil Ref 04 |
| Gleichzeitig sichtbare Blur-Flächen | höchstens 2 (Ref 01, 03, 12) | ≤ 2 mobil, ≤ 3 Desktop | Ref 01/03/12; GPU-Risiko laut Profilen |
| Gleichzeitig bewegte Träger | 1 (Ref 04/07, 09) | 1 je Ansicht | Nr. 3 |
| Pixeldichte im Canvas | nicht beobachtet | ≤ 1,5 mobil, ≤ 2 Desktop | Neuentwurf |
| Bildrate Echtzeit | nicht beobachtet | Ziel 60 fps; Rückfall bei Median-Framezeit > 25 ms über 2 s | Neuentwurf |
| Animierte Eigenschaften der UI | Zustandskanäle statisch belegt (5.6.10) | `opacity`, `filter`, Farbe, Füllung; keine Zwischengrößen, kein `perspective` | Nr. 1, 5, 7 |

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

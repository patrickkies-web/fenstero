# Gruppe G – Gestalter: Konfigurator Schritt 1 „Was planst du?“, X gegen Y

Blind: X und Y, welche neu ist, nicht bekannt. Gesehen: X tel-01 und desk-01; Y tel-01 bis tel-06 und desk-01. Bewegung nur nach dem Brief. Lösungsschlüssel: Küchenfenster, zwei Flügel, ersetzen.

## Jonas Veit, Art Director

**Blickprotokoll.** X: Sekunde 1 das Fenster im Lichtkegel; Sekunde 2 das große weiße „Fenster“; Sekunde 3 das grüne „planst“. Die Hauptaktion: keine. Y: Sekunde 1 das Fenster auf der Bühne; Sekunde 2 die Koralle-Marke „Wischen zum Wechseln“, das einzige Warme; Sekunde 3 die violette Kachel. Pille beim vierten Blick, weil die weiße Karte darüber größer ist.

**Schieltest.** X: Held ja, Überschrift ja, Hauptaktion fehlt. Y: Bühne, weiße Karte, weiße Pille, drei Formen, Pille auf der Achse; die Bühne säuft im Schwarz ab, die Karte wird zur Hauptform.

**Bewertung.** Y hat einen Helden mit Material: Rendering, Lichtkante, Maßstab, Etikett an der Sache, Violett als Licht. Eigene Idee, nicht Vorlage. Aber das Element hängt über die Bühnenkante statt auf dem Maßstab zu stehen, das Licht liegt hinter ihm statt darunter. X: schönes Licht, kein Weg. Y.

**Abstimmung.** 1 behalten · 2 ändern: Wortmarke klein, der Kopf gehört dem Schritt · 3 ändern: Element steht auf dem Maßstab, kein Überhang, Leuchten als Bodenfleck darunter · 4 behalten · 5 ändern: Koralle-Marke nur einmal, dann weg · 6 behalten · 7 ändern: Karte flacher, Kacheln kleiner, sechs erkennbar verschiedene Renderings · 8 behalten · 9 behalten · 10 behalten · 11 ändern: echte Schreibtischbühne, Bühne links, Karte rechts · 12 behalten.

**Hand: 4.** Muss: Element steht auf der Bühne. Kann: Karte flacher. Veto: nein.

## Lena Hartwig, UX-Research und Barrierefreiheit

**Blickprotokoll.** X: Sekunde 1 Fenster; Sekunde 2 „Fenster“; Sekunde 3 die kleinen grauen Zeichnungen, kaum lesbar. „Weiter“ nicht gefunden. Y: Sekunde 1 die Koralle-Marke, ein Befehl vor der Frage; Sekunde 2 Fenster mit Etikett „Fenster“; Sekunde 3 „Weiter zu den Fotos“.

**Schieltest.** Y: drei Formen, Pille auf der Achse, Fokus ja. X: kein Fokus unten.

**Bewertung.** Y verstehen Senioren in drei Sekunden: Fenster, gewählt, weiter. Gut: Unterzeile „Nimm, was heute eingebaut ist“, Rückweg links, Hinweis bei „Neue Öffnung“. Schlecht: Silbergrau auf Weiß („Element antippen“, „Die Stelle“, „Dort war noch keins“) liegt um 2,5:1, fällt durch. Zwei Punktreihen, Stationen oben und Zähler auf der Bühne, verwechselt man. Beide i-Knöpfe unter 44 px. In 05 und 06 verschwinden Hinweis und Kacheln unter dem Fuß. Vier Renderings sehen gleich aus, der Fehlerweg Fenster/Festverglasung ist offen. Y, mit Nacharbeit.

**Abstimmung.** 1 behalten · 2 behalten · 3 behalten · 4 ändern: i 44 px · 5 ändern: Marke einmal, Zähler weg · 6 ändern: i 44 px · 7 ändern: Feldköpfe Anthrazit auf Weiß, Renderings unterscheidbar · 8 ändern: Hinweis zwei Zeilen · 9 behalten · 10 behalten · 11 ändern · 12 behalten.

**Hand: 2.** Muss: Kontrast der Feldköpfe, Inhalt nicht unter dem Fuß. Kann: Zähler streichen. Veto: nein.

## Noah Brandner, Motion-Designer

**Blickprotokoll.** X: Sekunde 1 Fenster, Sekunde 2 „Fenster“, Sekunde 3 „planst“; mit dem Hüpfen und Wiegen bliebe der Blick am Modell kleben. Y: Sekunde 1 Fenster, Sekunde 2 Koralle, Sekunde 3 Pille.

**Schieltest.** Y: drei Formen, Fokus Pille. X: Held, Wort, nichts.

**Bewertung nach Brief.** X: 720 ms Hüpfen und ein Dauerwiegen ohne Bedeutung, Spielzeug. Y: Wechsel 220 ms mit 14 px, Leuchten gleitet mit, nichts läuft von selbst, bei weniger Bewegung steht alles, das ist die Schule. Die eine inszenierte Stelle stimmt: das Licht folgt dem Element. Zwei Fehler: Kacheln 320 ms Farbwechsel ist für einen Zustand zu träge, 150 ms; der Versatz muss in Wischrichtung laufen, sonst widerspricht die Bewegung dem Daumen. Die Koralle-Marke steht still und schreit; eine Geste einmal zeigen, dann weg. Y.

**Abstimmung.** 1 behalten · 2 behalten · 3 ändern: Leuchten muss unter dem Element liegen, sonst gleitet nichts „unter“ · 4 behalten · 5 ändern: Marke einmal 1,2 s, dann ausblenden · 6 behalten · 7 behalten · 8 behalten · 9 behalten · 10 behalten · 11 ändern · 12 ändern: Kacheln und Schalter 150 ms, Versatz in Wischrichtung, Leuchten und Element kommen gleichzeitig an.

**Hand: 4.** Muss: Zustände 150 ms. Kann: Wischrichtung. Veto: nein.

## Tobias Lenz, Frontend-Ingenieur

**Blickprotokoll.** X: Fenster, „Fenster“, Zeichnungen. Y: Fenster, Koralle, Pille.

**Schieltest.** Y drei Formen, Fokus Pille. X ohne Aktion.

**Bewertung.** Sichtbare Fehler in Y: in 05 und 06 liegt der Inhalt unter dem klebenden Fuß, es fehlt padding-bottom in Fußhöhe. Das Etikett bricht bei „Hebe-Schiebe-Tür“ auf zwei Zeilen und überdeckt das Rendering, feste Etikettbreite oder min-height. Sieben Renderings je Bildschirm: nur als WebP/AVIF mit festen Maßen, sonst Layoutsprung beim Wechsel. Wechsel per opacity und transform, gut; der gestrichelte Rahmen muss dieselbe Box wie das Bild sein, kein Messen per JS. Der Überhang über die Rundung ist overflow visible, billig. X: Dauerwiegen heißt Dauer-rAF, Akku. Schreibtisch Y ist eine Vorschau, keine App; die App braucht ein Desktop-Layout. Y nach zwei Fixes.

**Abstimmung.** 1 behalten · 2 behalten · 3 ändern: Etikett feste Breite · 4 behalten · 5 behalten · 6 ändern: Erklärung darf Karte nicht unter den Fuß schieben · 7 ändern: Bilder mit Maßen und modernen Formaten · 8 ändern: Hinweis nie unter dem Fuß · 9 behalten · 10 behalten · 11 ändern: zwei Spalten ab 900 px · 12 behalten.

**Hand: 3.** Muss: Inhalt frei vom Fuß. Kann: Bildformate. Veto: nein.

## Mara Keller, Conversion und Marketing

**Blickprotokoll.** X: Fenster, „Fenster“, „Was ist das?“; „Weiter“ fehlt, Abbruch. Y: Fenster, Koralle, „Weiter zu den Fotos“.

**Schieltest.** Y: Hauptaktion auf der Achse, immer sichtbar, ein Fokus. X: keine.

**Bewertung.** Y löst die Aufgabe: Fenster vorgewählt, „Fenster ersetzen“ steht, Pille da, der Küchenkunde tippt einmal. Vertrauen stiftet „Unsicher? Nimm, was heute eingebaut ist“ und „Sturz und Statik prüft der Fachbetrieb“. Abbruchstellen: vier Kacheln zeigen dasselbe Bild, der Kunde zweifelt an sich; die Koralle-Marke nimmt den ersten Blick und verkauft nichts; „Begriffe“ ist nur ein Buch-Symbol. Hebe-Schiebe gegen PSK: die Erklärung unter den Kacheln in 05 ist genau richtig. X: Hauptaktion unter der Falte, grauer Text auf Schwarz, der Kunde sucht. Y.

**Abstimmung.** 1 behalten · 2 ändern: Buch mit Wort „Begriffe“ · 3 behalten · 4 behalten · 5 ändern: Marke einmal, dann Platz für den Helden · 6 behalten · 7 ändern: Renderings unterscheidbar, Tür hoch, Schiebetür mit Spalt, Faltwand gefaltet · 8 behalten · 9 behalten · 10 behalten · 11 ändern · 12 behalten.

**Hand: 4.** Muss: sechs erkennbar verschiedene Kacheln. Kann: „Begriffe“ beschriften. Veto: nein.

## Daniel Roth, Typograf und Markenstratege

**Blickprotokoll.** X: Fenster, „Fenster“ in Inter fett, grünes „planst“. Y: die Wortmarke, dann das Fenster, dann die Koralle; die Frage erst danach.

**Schieltest.** Y: drei Formen, Pille auf der Achse; die Überschrift ist zu leicht, um Form zu sein. X: zwei Überschriften, keine Aktion.

**Bewertung.** Y: Outfit 30/500 mit zweiter Stimme ist Wiedererkennung, der Schritt-Kopf mit Band ruhig und eigen. Aber die Wortmarke ist das lauteste Wort auf dem Bildschirm; die Regel sagt klein in Inter, hier ist sie groß und fett, Markeneitelkeit über der Frage. Die zweite Stimme dimmt „planst“, das tragende Wort; „du?“ wäre ehrlicher. Drei Namen für eine Sache: „Hebe-Schiebe“, „Hebe-Schiebe-Tür“. Der Maßstab ohne Zahlen ist Kulisse. Gleiche Renderings in der Kachelreihe sind Unehrlichkeit. X: Vorlagenoptik mit Lichtkegel. Y.

**Abstimmung.** 1 ändern: zweite Stimme auf „du?“ · 2 ändern: Wortmarke klein, Inter, Regelgröße · 3 ändern: Maßstab entweder mit Zahlen oder weg · 4 behalten · 5 ändern: Marke weg · 6 behalten · 7 ändern: Renderings unterscheidbar, Namen gleich wie im Etikett · 8 behalten · 9 behalten · 10 behalten · 11 ändern · 12 behalten.

**Hand: 3.** Muss: Wortmarke nach Regel. Kann: zweite Stimme. Veto: nein.

## Sprecher Gruppe G

**Gewinner: Y**, sechs von sechs, Hände 4 · 2 · 4 · 3 · 4 · 3.

**Mehrheit je Änderung.**
1 behalten 5:1 · 2 ändern 4:2 (Wortmarke klein nach Regel; „Begriffe“ beschriften) · 3 ändern 4:2 (Element steht auf dem Maßstab, kein Überhang; Leuchten unter dem Element; Etikett feste Breite) · 4 behalten 4:2 (i auf 44 px) · 5 ändern 6:0 (Koralle-Marke einmal zeigen, dann aus; Zähler auf der Bühne streichen, das Stationen-Band reicht) · 6 behalten 4:2 (i 44 px; Erklärung darf Karte nicht unter den Fuß drücken) · 7 ändern 6:0 (sechs erkennbar verschiedene Renderings; Feldköpfe Anthrazit statt Silbergrau auf Weiß) · 8 behalten 4:2 (Hinweis kürzer, nie unter dem Fuß) · 9 behalten 6:0 · 10 behalten 6:0, auf den Bildern nicht gesehen · 11 ändern 6:0 (echtes Desktop-Layout, zwei Spalten; der Telefonrahmen bleibt Vorschau des Inhabers) · 12 behalten 5:1 (Noah: Zustände 150 ms, Versatz in Wischrichtung).

**Minderheit.** Jonas: Karte flacher, Bühne größer. Daniel: zweite Stimme auf „du?“, Maßstab mit Zahlen oder weg. Lena: Hand 2 wegen Kontrast und verdecktem Inhalt, kein Veto.

**Vetos.** Keine.

**Drei wichtigste Korrekturen nach Wirkung.**
1. Sechs unterscheidbare Renderings in den Kacheln (Fenster zwei Flügel, Balkontür hoch, Festverglasung ohne Flügel, Hebe-Schiebe mit Spalt, PSK mit Kippstellung, Faltwand gefaltet); sonst wählt der Kunde falsch und der Fensterbauer bekommt das falsche Element.
2. Koralle-Marke „Wischen zum Wechseln“ nur einmal, dann aus, und den zweiten Punktezähler streichen; der erste Blick gehört dem Element, nicht einem Befehl.
3. Inhalt frei vom klebenden Fuß (padding-bottom in Fußhöhe) und Feldköpfe auf der weißen Karte in Anthrazit; ohne das fallen Hinweis und Schalter aus dem Bild oder sind unlesbar.

**Muss-Liste (ohne das lehnt die Gruppe ab).**
- Sechs erkennbar verschiedene Renderings in den Kacheln.
- Silbergrau auf Weiß ersetzen: Feldköpfe und Unterzeilen der Karte in Anthrazit, Kontrast über 4,5:1.
- Nichts liegt unter dem Fuß: Hinweis, Schalter und Kacheln in 04 bis 06 bleiben erreichbar.
- Koralle-Marke nicht dauerhaft; Zähler auf der Bühne weg.
- Element steht auf dem Maßstab, Leuchten darunter; Etikett bricht nicht über das Rendering.
- Wortmarke klein in Inter nach Markenregel.
- Beide i-Knöpfe 44 px.
- Zustandsfarben 150 ms; Pille, Rückweg und Bewegung bei „weniger Bewegung“ wie im Brief.

Hinweis: Keine Dateien geändert; Formatvorlage war /home/user/fenstero/docs/profis/gremium/2026-10-26-fensterbauer-dna-gestalter.md, Bilder aus /tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/gremium/.

# Lage, Planungstiefe und Glas in den Wünschen (30.10.2026)

## Auftrag des Inhabers

> „Du schaust dir die Folie in meiner Hauptseite und die Seite an, wenn man auf den Toggle für Fensterbauer stellt, und überprüfst da
> die Design-Einrichtung und änderst dann entsprechend die beiden Folien […] Mir gefällt das nämlich nicht mit diesen komischen Linien
> vom Haus und auch nicht diese Leuchten, die da so wie Neonlicht leuchten. Außerdem ist im nächsten Schritt, wo man die Form auswählt,
> das 3-D-Modell so gestaltet, dass die Fenster so ausgegraut aussehen, das möchte ich bitte auch, dass du das überarbeitest. […] den
> wesentlichen Punkt herausarbeiten, welcher das Modell noch ein wenig unrealistischer darstellen lässt.“

Dazu drei Bildschirmfotos von seinem iPhone: „Wo ist das Fenster?“, „Wie genau möchtest du planen?“ und „Welche Form?“ (Wünsche).

## Bestand und Vorbild

- **Startseite und Seite für Fensterbauer** (die Vorbilder):
  - echte Dinge auf dunkler Bühne: Renderings aus dem App-Modell, sein Hausfoto, Geräte;
  - Licht als weicher Schein (weiß unter dem Hero-Fenster, violett aus der Ecke der Kachel „RAL-Farben“), radial, ohne Weichzeichner;
  - Etiketten mit violettem Punkt, Strichskala unter dem Hero-Fenster;
  - Kacheln nach G14 (tonaler Abfall, Lichtkante).
- **Lage:**
  - Haus als Strichzeichnung (Umriss, gestrichelte Decken und Dachlinien);
  - am Fenster ein Korallen-Fleck mit `filter: blur(7px)`;
  - Bühne flach in Anthrazit.
- **Planungstiefe:** ein violetter und ein Korallen-Fleck, beide mit `filter: blur(12–14px)`, sie liegen über den Punkten.
- **Wünsche, Glas von innen:**
  - Die Scheibe ist eine halb durchsichtige, gleichmäßig getönte Fläche, hinter der im Modell nichts liegt.
  - Was durchscheint, hängt am Gerät: im Testbrowser milchiges Hellgrau, auf seinem iPhone ein flaches Taupe ((145, 135, 121), siehe sein Bildschirmfoto).
  - Beides liest sich als „ausgegraut“, nicht als Glas. Das ist der wesentliche Punkt: Ein echtes Fenster zeigt von innen den Blick nach draußen, der beim Bewegen hinter dem Rahmen wandert. Das Modell zeigte eine Farbfläche.

## Umsetzung

| Wo | Was | Warum |
| --- | --- | --- |
| Lage, Bühne (app.js `lageDna`, app.css) | Das Haus als Körper in der Dämmerung, das gewählte Stockwerk innen erleuchtet, die übrigen dunkel (siehe Liste unter der Tabelle) | „komische Linien vom Haus“; Zustand über Helligkeit (28.10.2026), wie der weiße Schein der Startseite |
| Lage, Licht | Korallen-Fleck mit Weichzeichner weg; weißer Schein radial, auf das Haus begrenzt (`clipPath`) | „Leuchten wie Neonlicht“; G14: Leuchten nie als Weichzeichner |
| Lage, Skala | Striche des gewählten Stockwerks in Violett (aktiver Zustand), Skala reicht bis zum First | Farbe zeigt Zustand; die Folie hat sonst fast keine Farbe (0,4 %) |
| Lage, Etikett | Linie zum Fenster durchgezogen statt gestrichelt, Etikett breiter („Wohnzimmer“ passt ganz) | keine gestrichelten Linien mehr am Haus |
| Lage und Tiefe, Bühne | Bühne nach G14: radialer Abfall von oben links, Lichtkante oben | keine flache Fläche, wie die Kacheln der Startseite |
| Planungstiefe | zwei Flecken mit Weichzeichner weg; ein ruhiges violettes Licht aus der Ecke unten links, radial, ohne Bewegung; Koralle nur noch in der Zahl „plant dein Fensterbauer“ | „Neonlicht“; wie die Kachel „RAL-Farben“; Zustand zeigen die Punkte |
| buehne.js, Glas von innen | Klarglas zeigt die Aussicht und ist deckend, Sonnenschutzglas getönt; Ornament- und Vogelschutzglas, Türen mit Terrasse und Messen im dunklen Raum bleiben wie bisher (siehe Liste unter der Tabelle) | „ausgegraut“; der wesentliche Unterschied zu einem echten Fenster |

So sieht das Haus der Lage jetzt aus:

- Fassade, Walmdach mit Gaube, Keller im Erdreich, in jedem Stockwerk Fenster.
- Flächen in Nuancen von Anthrazit mit Lichtkante an der Geländekante und Schatten unter Traufe und Gesims.
- Im gewählten Stockwerk sind die Scheiben weiß, darüber liegt ein weicher weißer Schein.

So wird die Aussicht durchs Klarglas gemalt:

- Himmel, eine unscharfe Baumreihe in der Ferne und Rasen, entsättigt.
- Die Höhe ergibt sich aus der Lage in der Öffnung, durchgehend über alle Scheiben, und aus der Blickrichtung der Kamera. Beim Drehen wandert die Aussicht hinter dem Rahmen.
- Die Scheibe ist deckend, so malt kein Gerät mehr Grau oder Taupe darunter.

## Gremium, eine Runde (simuliert, keine Marktforschung)

**Gestalter (Jonas Veit):** Die Lage hat jetzt ein Objekt statt eines Plans. Das Haus in der Dämmerung mit dem einen erleuchteten
Stockwerk trägt den Zustand über Helligkeit, das ist dieselbe Hand wie der weiße Schein im Hero. Die Planungstiefe ist ruhig geworden, die
Zahl ist wieder der Held. Das Glas ist der größte Gewinn: Erst jetzt sieht das Modell aus wie ein Fenster und nicht wie ein Kasten.
Kann: Das Etikett deckt im gewählten Stockwerk die linken Fenster ab, man sieht das Licht vor allem um das Fensterbild.

**Kunden (Renate Vogel):** „Jetzt sehe ich ein Haus, und das Stockwerk, das ich angetippt habe, ist hell. Vorher waren das nur Striche.“
Bei der Form sagt sie: „Das ist ein Fenster, da guckt man raus.“ Kai Hofmann sucht den Haken und findet keinen. Er fragt nur, ob der
Garten seiner sei; die Aussicht ist unscharf und allgemein, er versteht sie als Blick nach draußen.

**Fensterbauer (Klaus Brandt):** Die Aussicht verändert nichts an der Aussage des Modells: Ornamentglas bleibt matt, Sonnenschutzglas
getönt, Türen zeigen weiter die Terrasse. „Wenn das Glas aussieht wie Glas, fragt der Kunde nicht, warum seine Scheiben grau sind.“
Tobias Reuter: Das erleuchtete Stockwerk hilft beim Wiederfinden vor Ort.

| Änderung | Urteil | Hand |
| --- | --- | --- |
| Haus als Körper statt Strichzeichnung | behalten | 4–5 |
| Weißer Schein im gewählten Stockwerk statt Korallen-Fleck | behalten | 4–5 |
| Skala des gewählten Stockwerks in Violett | behalten | 4 |
| Planungstiefe: ein ruhiges Licht statt zwei Flecken | behalten | 4–5 |
| Aussicht durchs Glas von innen | behalten | 5 |
| Kann: Etikett so setzen, dass die erleuchteten Fenster frei bleiben | offen, nicht umgesetzt | – |

Muss-Punkte und Vetos: keine.

## Messung

Farbanteile je Bildschirm mit `werkzeuge/farben.py`; Telefon 390 × 844, Laptop 1280 × 800.

| Bildschirm | Neutral % | Violett | Indigo | Koralle | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| Lage, Telefon | 99,6 | 0,1 | 0,0 | 0,1 | 0,3 | 0,4 |
| Planungstiefe, Telefon | 96,5 | 1,4 | 0,1 | 2,0 | 0,0 | 3,5 |
| Lage, Laptop | 99,7 | 0,0 | 0,0 | 0,0 | 0,2 | 0,3 |
| Planungstiefe, Laptop | 97,2 | 0,5 | 0,0 | 2,3 | 0,0 | 2,8 |

Die Lage ist fast ohne Farbe: Der Inhaber hat am 28.10. das violette Leuchten und jetzt den Korallen-Fleck zurückgenommen. Violett steht
nur noch am Etikett und in der Skala des gewählten Stockwerks.

## Prüfungen

- Abschnitt 16, Lage: keine gestrichelten Linien, kein Weichzeichner, nur das gewählte Stockwerk erleuchtet.
- Abschnitt 20, Glas von innen:
  - Klarglas oben Himmel und unten Rasen, deckend;
  - Sonnenschutzglas getönt;
  - Ornamentglas wie gemalt.
- Abschnitt 21, Planungstiefe: ruhiges Licht ohne Weichzeichner, ohne Korallen-Fleck, steht still.
- Die Hero-Bildfolgen der Startseite sind mit dem neuen buehne.js neu gerendert, weil der Fingerabdruck daran hängt. Die Außenansicht ändert sich durch die Aussicht nicht.

## Offen

- Im CSS-Ersatzmodell, also auf Geräten ohne schnelle Grafik, bleibt das Glas eine getönte Fläche. Die Aussicht gibt es nur in WebGL.
- Wie es auf seinem iPhone aussieht, zeigt erst sein iPhone. Der Testbrowser malt ohne Grafikchip (SwiftShader).

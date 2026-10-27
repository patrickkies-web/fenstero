# Gruppe G (Gestalter) · Variante „große Bühne“, eine Runde, blind (X = Variante, Y = Fassung vom 27.10.2026 vormittags)

Jede Person hat für sich geurteilt (simuliert). Grundlage waren alle 17 Bilder; die Bühnen wurden vergrößert nebeneinandergelegt und die Abstände in Pixeln nachgemessen.

**Jonas Veit, 44, Art Director**
Blicke X: 1. Zahlenfeld mit violettem Ring mitten auf der Bühne, 2. obere Lupe, 3. weiße Tastenkarte. Y: 1. Zahlenfeld links, es verdeckt das halbe Fenster, 2. Etikett „Oberkante“, 3. Tastenkarte.
Aufgabe: Im Schieltest zeigt X drei Formen: Bühne, Karte, Pille. Die randlose Bühne ist endlich ein Held. Y wirkt wie ein Vorschaubildchen im Rahmen. Lupe und Maßzahl auf der Linie sind eine eigene Idee, Handwerk statt Vorlage. Aber bei X-4 und X-5 klebt die Kamera am Glas. Ich sehe Griffe, Streifen und eine schräge Linie, aber kein Fenster in einer Wand. Da sterben Material und Licht.
Wahl: X. 1 behalten · 2 ändern: waagerechte Maße weiter weg und frontal, das ganze Fenster mit beiden Laibungen zeigen · 3–6 behalten.
Hand: 4. Muss: Bei Maß 3 und 4 erkenne ich ein Fenster in einer Wand. Kann: Lupenring silbergrau statt fast weiß. Veto: nein.

**Lena Hartwig, 38, UX-Research und Barrierefreiheit**
Blicke X: 1. Zahlenfeld, 2. Lupe „Oberkante der Öffnung“, 3. Lupe „Fensterbank innen“. Der Blick läuft die Linie entlang, und so soll es sein. Y: 1. Zahlenfeld, 2. Etikett oben, 3. Titel.
Aufgabe: Bei den senkrechten Maßen erkennt meine 70-Jährige in X Anfang und Ende: Strichmarke in der Lupe plus Wort. Bei den waagerechten nicht. In X-4 kippt die „waagerechte“ Linie sichtbar, und die Lupe „Mauer“ zeigt hellen Brei. Maß 3 und 4 liegen pixelgleich übereinander. Um den Unterschied zwischen Mauer und Rahmen dreht sich „Nicht am Rahmen messen“, und genau den sieht niemand. Die Großansicht hilft sehr, aber ihr Knopf ist nur ein Pfeilsymbol, das Senioren nicht lesen. Ziele ab 44 px erfüllt, Kontraste gut.
Wahl: X. 1 behalten · 2 ändern: eine Ansicht je Paar (1+2, 3+4), waagerecht frontal · 3, 4 behalten · 5 ändern: sichtbares Wort „Größer“ am Knopf · 6 behalten.
Hand: 3. Muss: Maß 3 und 4 sind unterscheidbar, und die Linie sieht waagerecht aus. Kann: Wort am Knopf. Veto: nein.

**Noah Brandner, 31, Motion-Designer**
Blicke X: 1. Zahlenfeld, 2. obere Lupe, 3. Tastenkarte. Y: 1. Zahlenfeld, 2. Etikett oben, 3. Titel.
Aufgabe: Die ruhige Fassung ist da. Taste auf 0,97 und Ziffer sofort stimmen. Nach „Weiter“ zieht X den Blick aber dreimal: Haken 0,35 s, Fahrt 0,4 s, Linie 0,32 s plus Lupen. Über eine Sekunde, viermal hintereinander, mit dem Zollstock in der Hand. Die Fahrt hat Bedeutung, aber von Maß 1 zu 2 ändert sich der Ausschnitt kaum: 0,4 s Warten für nichts. Die Großansicht mit 0,24 s und 0,97 → 1 ist richtig.
Wahl: X. 1 behalten · 2 ändern: Fahrt startet mit dem Haken, Linie ab etwa 70 % der Fahrt, ease-in-out; keine Fahrt, wenn der Ausschnitt fast gleich bleibt · 3 behalten, Lupen kommen mit den Linienenden · 4–6 behalten.
Hand: 4. Muss: Die ganze Folge nach „Weiter“ dauert höchstens 0,8 s. Kann: Großansicht schließt schneller, als sie öffnet (etwa 0,18 s). Veto: nein.

**Tobias Lenz, 35, Frontend-Ingenieur**
Blicke X: 1. Zahlenfeld, 2. obere Lupe, 3. Tastenkarte. Y: 1. Zahlenfeld, 2. Etikett, 3. Tastenkarte.
Aufgabe: Ein WebP mit 2148 × 1400 und 30–40 KB für Bühne, Lupen und Großansicht ist vorbildlich: ein Download, einmal dekodiert (rund 12 MB), für Mittelklasse-Android kein Problem. Bedingung: Die Fahrt läuft nur über transform, nie über background-position oder die Breite. Die Lupen vergrößern 2,4-fach einen schon nahen Ausschnitt; bei DPR 3 werden sie weich, die Strichmarke als Vektor rettet das. Hängt die Bühnenhöhe an der Fensterhöhe, springt sie beim Ein- und Ausblenden der Adressleiste über die 200-px-Schwelle, und der Chip flackert.
Wahl: X. 1 behalten · 2 behalten, wenn als transform gebaut · 3–5 behalten · 6 ändern: die Schwelle an svh messen.
Hand: 4. Muss: Fahrt und Großansicht nur über transform und opacity, die Bühnenhöhe fest reserviert. Kann: eine frontale Ansicht für die waagerechten Maße als zweites WebP; 35 KB mehr sind vertretbar. Veto: nein.

**Mara Keller, 40, Conversion und Marketing**
Blicke X: 1. Zahlenfeld, 2. obere Lupe, 3. Tastenkarte. Y: 1. Zahlenfeld, 2. Titel, 3. Tastenkarte.
Aufgabe: Die Pille liegt in beiden Fassungen unten in der Mitte, auf der Blickachse; in X 13 px tiefer und bei 375 × 667 ganz sichtbar. Fokus: die Zahl auf der Linie. Abbruchstellen: Das Zahlenfeld sieht aus wie ein Eingabefeld mit Cursor und liegt auf dem Bild; wer es antippt, landet in der Großansicht. Weil Maß 3 und 4 in X gleich aussehen, tippt mancher zweimal dieselbe Zahl: Mülldaten für den Fensterbauer. Der Rückweg per Pille ist sauber.
Wahl: X. 1 behalten · 2 ändern: eine Ansicht je Paar · 3, 4 behalten · 5 ändern: ein Tipp aufs Zahlenfeld öffnet nichts · 6 behalten.
Hand: 4. Muss: Ein Tipp aufs Zahlenfeld führt nicht in die Großansicht. Kann: Der bemängelte Abstand Bühne–Karte ist praktisch gleich geblieben (rund 117 statt 119 px); dort straffen. Veto: nein.

**Daniel Roth, 52, Typograf und Markenstratege**
Blicke X: 1. Zahlenfeld, 2. Titel „Höhe der Öffnung.“, 3. obere Lupe. Y: 1. Zahlenfeld, 2. Titel, 3. Etikett.
Aufgabe: Die Skala in X stimmt: Zahl 36 über Titel 28 über Fließtext. Die Maßzahl auf der Maßlinie ist die Sprache der technischen Zeichnung. Zur Ehrlichkeit: In X sind Öffnung und Rahmen gleich lang gezeichnet (X-1/X-3, X-4/X-5), die Kamera normiert das Verhältnis weg. In der Großansicht läuft die Linie durch den linken Flügel. Auf dem kleinen Telefon (X-7) rutscht die Zahl neben die Linie.
Wahl: X. 1 behalten · 2 ändern: eine Ansicht je Paar · 3 behalten · 4 ändern: die Zahl überall auf der Linie, auf kleinen Telefonen mit 32 px · 5, 6 behalten.
Hand: 3. Muss: Die Öffnung ist sichtbar größer als der Rahmen. Kann: die Linie in die Mitte der Öffnung legen. Veto: nein.

## Sprecher Gruppe G

**Gewinner:** X mit 6 von 6.

**Blickführung:** X zeigt im Schieltest drei klare Formen (randlose Bühne, weiße Tastenkarte, weiße Pille); Fokus ist das Zahlenfeld auf der Linie, danach wandert der Blick die Linie entlang zu den Lupen. Bühne und Karte sind fast gleich hell und konkurrieren leicht. In Y beherrscht das Zahlenfeld die kleine Bühne. Nach „Weiter“ zieht X den Blick dreimal (Haken, Fahrt, Linie), das ist zu viel.

| Nr. | Änderung | behalten | ändern | zurück |
|---|---|---|---|---|
| 1 | Bühne randlos, 262 px, Titel 28 px | 6 | 0 | 0 |
| 2 | Kamera je Maß, Fahrt 0,4 s | 1 (nur mit transform) | 5 (4× eine Ansicht je Paar und waagerecht frontal, 1× Zeitfolge) | 0 |
| 3 | Lupen-Etiketten | 6 | 0 | 0 |
| 4 | Zahl auf der Linie, 36 px | 5 | 1 | 0 |
| 5 | Großansicht | 4 | 2 (Wort am Knopf; Tipp aufs Zahlenfeld öffnet nichts) | 0 |
| 6 | Kleine Telefone ohne Chip, Lupen 40 px | 5 | 1 (Schwelle an svh) | 0 |

**Hände:** 4 · 3 · 4 · 4 · 4 · 3, Median 4. Keine Faust, niemand unter 3. **Vetos:** keine.

**Muss-Punkte:** Maß 3 und 4 unterscheidbar, Öffnung sichtbar größer als der Rahmen, Linie waagerecht, ein Fenster in einer Wand erkennbar (Jonas, Lena, Daniel); Folge nach „Weiter“ höchstens 0,8 s (Noah); nur transform und opacity, Bühnenhöhe fest (Tobias); Tipp aufs Zahlenfeld öffnet keine Großansicht (Mara).

**Die drei wichtigsten Korrekturen:**
1. Eine Kamera je Paar statt je Maß; waagerechte Maße weiter weg und frontal mit dem ganzen Fenster und beiden Laibungen (zweites WebP von rund 35 KB vertretbar).
2. Großansicht auffindbar und ohne Fehlweg: sichtbares Wort am Knopf, Tipp aufs Zahlenfeld öffnet nichts.
3. Zeitfolge nach „Weiter“ höchstens 0,8 s; keine Fahrt, wenn der Ausschnitt fast gleich bleibt; nur transform und opacity.

**Kleinere Punkte:** Zahl auch auf kleinen Telefonen auf der Linie (32 px); senkrechte Linie in die Mitte der Öffnung; Schwelle an svh; Abstand Bühne–Karte straffen; Lupenring silbergrau.

**Abgleich mit dem Lösungsschlüssel:** In beiden Fassungen sitzen die Linienenden an den richtigen Stellen; Abweichungen: die senkrechte Linie liegt nicht ganz in der Mitte, und in X lassen sich Maß 3 und 4 optisch nicht unterscheiden.

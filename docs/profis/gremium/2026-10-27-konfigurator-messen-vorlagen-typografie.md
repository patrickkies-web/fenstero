# Vorlagen-Abgleich Typografie: Konfigurator Schritt 3 „Messen“

Grundlage: die Bilder 01, 02, 04, 10 sowie die Startseite („219 Töne“, „7,99 €“, Chip „Öffnung · Höhe 1.409 mm“) und Schritt 1. Dazu tel-01 bis tel-07 und desk-01 sowie `start.css` ab Zeile 309, `start.js` und `index.html`. Ich habe keine Dateien geändert.

## Wie die Vorlagen setzen und wo die Folie zurückbleibt

| | Vorlagen | Folie |
| --- | --- | --- |
| Zahl | Domus „12.4“ dünn (200–300) und etwa 2,3-mal so groß wie der Titel. Koch „80“/„160“ in etwa 300 und etwa 1,8-mal so groß wie der Name. Startseite 250/200. Laufweite eng. | 28 px/400, −.01em. Damit ist sie kleiner als die Frage (30/500) und kaum größer als die Tasten (24/400). Die Zahl ist nicht der Held. |
| Einheit | Klein auf der Grundlinie, dicht an der Zahl: „kWh“ ca. .1em, „gr“ fast anliegend, Startseite .25em bei 14 px. Bei Heeal steht die Einheit im Chip. | 14 px Textgrau, aber mittig ausgerichtet und mit `margin-top: 7px` nach unten geschoben. Abstand zur Zahl 5 px plus Cursor. Die Einheit schwebt. |
| Label | 12–13 px in 400, grau, eine Zeile. Die Startseite setzt den Namen in 500 Weiß und den Zusatz in 400 Silbergrau. | Die End-Etiketten sind 13/500 in Weiß, als Rechtecke mit 12 px Radius, auf 118 px begrenzt und zweizeilig umbrochen („Oberkante / der Öffnung“). |
| Überschrift | Bei Domus und Koch leichter als die Zahl. | 30/500 ist fest. Die Zahl muss also über die Größe gewinnen. |
| Werte | Paare aus Label und Wert. Der Wert steht dunkler bzw. heller als das Label (Koch „Oven temp … 120 °c“, Startseite-Chip). | Die Warnung steht als dreizeiliger Fließtext in 13 px ohne Kopf, der Vergleichswert ist darin versteckt. |

## Fünf Hebel, nach Wirkung

**1. Die Zahl im Feld zum Helden machen (G3, G15)**
- `start.css` `.ez-mass__feld b`: `font: 300 2.625rem/1 var(--font-sans); letter-spacing: -.03em;`. Also 42 px in 300, `tabular-nums` bleibt. Damit ist sie 1,4-mal so groß wie die Frage und 1,75-mal so groß wie die Tasten.
- Kein Schnitt 200–250: Bei Gegenlicht am Fenster brechen die Striche weg. Mit 300 ist der Strich bei 42 px etwa 3 px stark, Schwarz auf Weiß gibt einen Kontrast von 19,8:1.
- `.ez-mass__feld`: `height: 60px; padding: 0 18px;`.
- Platz: Links von der Linie bleiben bei 390 px nur etwa 177 px, das Feld braucht im Zustand mit Haken etwa 195 px. Deshalb das Feld mittig auf die Linie setzen, wie eine Maßzahl nach DIN, die Linie läuft hinter dem weißen Feld. Dafür in `start.js:346` als ersten Kandidaten `mx - w / 2` nehmen.
- Das behebt nebenbei einen Fehler von heute: Das Feld wird mit der Breite des Platzhalters platziert und wächst beim Tippen nach rechts. In tel-03 liegt der Haken deshalb etwa 6 px auf der Linie.

**2. Der Leerzustand zeigt schon die Heldengröße**
- In tel-01, tel-04 und tel-07, also im ersten Bild jedes Maßes, ist der Held heute ein graues „z. B. 1.250“ in 16 px.
- Markup in `index.html:236`: `<span class="ez-mass__zb">z.&nbsp;B.</span><b id="mess-zahl">1.250</b>`.
- `start.js:366`: `messZahl.textContent = tausend(leer ? ueblich(st.r)[2] : v)`.
- CSS: `.ez-mass__feld.is-leer b { color: var(--silbergrau); }`. Dort `font-size: 1rem` und `letter-spacing: 0` streichen.
- `.ez-mass__zb { display: none }`, `.is-leer .ez-mass__zb { display: block; align-self: center; margin-right: 8px; font: 500 13px/1 var(--font-sans); letter-spacing: .03em; color: var(--textgrau); }`.
- Die geisterhafte Zahl hat nur 2,4:1 Kontrast. Das ist vertretbar: Das Feld ist `aria-hidden`, und die Zeile nennt denselben Wert lesbar.
- Gewinn: Beim ersten Ziffernwechsel ändert sich nur die Farbe, nicht die Breite. Kein Sprung, die Platzierung bleibt stabil.

**3. Die Einheit auf die Grundlinie, dicht an die Zahl**
- `.ez-mass__feld`: `align-items: baseline; gap: 0;`.
- `.ez-mass__feld small`: `margin: 0 0 0 4px; font: 400 14px/1 var(--font-sans); color: var(--textgrau);`. Das sind 14 px nach G15 für kleine Zahlen und 5,5:1 auf Weiß.
- `margin-top: 7px` und `.is-leer small { margin-top: 3px }` streichen.
- `.ez-mass__marke`: `align-self: center; height: 30px; margin: 0 0 0 3px;`. Die Höhe entspricht der Versalhöhe bei 42 px.
- `.ez-mass__haken`: `align-self: center; margin-left: 10px; width: 18px; height: 18px;`.

**4. Die End-Etiketten einzeilig und zweistufig wie auf der Startseite**
- `.ez-mass__ende .dna-etikett`: `max-width: none; white-space: nowrap; border-radius: var(--rund-pille); padding: 6px 12px; font: 400 13px/1.2 var(--font-sans); color: var(--silbergrau);`.
- Neu: `.ez-mass__ende .dna-etikett b { font-weight: 500; color: var(--weiss); margin-right: 4px; }`.
- Texte in `start.js:264–267` (`enden`) und Ausgabe in `start.js:329–330` (zwei Knoten statt `textContent`): „**Oberkante**“, „**Fensterbank** innen“, „**Rahmen** außen“, „**Fußboden** innen“, „**Mauer**“. Die Öffnung nennt schon der Titel.
- Gewinn: Die Etiketten verdecken etwa die Hälfte weniger vom Modell und gehören zur selben Familie wie der Schritt-Chip und der Chip „Öffnung · Höhe 1.409 mm“. Silbergrau auf dem dunklen Etikett hat etwa 6,6:1 und ist bei Tageslicht lesbar.

**5. Die Warnung mit Kopf und hervorgehobenem Wert**
- Heute (tel-05) drei Zeilen Fließtext in 13 px Schwarz ohne Rangfolge, und das im wichtigsten Moment.
- Die Texte in `start.js:295–296` als Objekt aufteilen:
  - `{ kopf: 'Größer als die Öffnung', text: 'Öffnung <span class="ez-zeile__wert">1.410&nbsp;mm</span>. An der Mauer messen.' }`
  - bzw. „Sehr klein für diese Öffnung“ / „Bis zur Außenkante des Rahmens messen.“
- `start.js:382`: `'<p class="ez-zeile__text"><b class="ez-zeile__hinweis">' + m.kopf + '</b>' + m.text + '</p>'`. Den Kopf setzt die bestehende Regel `.ez-zeile__hinweis` in 15/500 mit Koralle-Punkt.
- CSS: `.ez-zeile.ist-warnung .ez-zeile__text { font-size: 13px; color: var(--textgrau); padding-left: 0; }` und `.ez-zeile.ist-warnung .ez-zeile__text::before { content: none; }`. Sonst stehen zwei Punkte da.
- Neu: `.ez-zeile__wert { font-weight: 500; color: var(--schwarz); font-variant-numeric: tabular-nums; }`.
- Das Ganze passt in die feste Zeile von 60 px (19,5 + 2 × 17 px).

## Was sie schon trägt

Die Frage in 30/500 mit silbergrauem Vorsatz und die Unterzeile in 16 px sitzen genau wie in Schritt 1. Ebenso tragen das Kartenlabel in 13/400/.03em mit der Kapselreihe, die Zeile in 15/500 über 13–14/400 Textgrau, die Tasten in 24/400 tabellarisch und die Pille „Ja, 1.410 mm“. Vor mm und cm steht fast überall ein geschütztes Leerzeichen (U+00A0). Nur „Maß 1 von 4“ hat noch normale Leerzeichen, in `start.js:410` und `index.html:249`.

Dateien:
- /home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.css
- /home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.js
- /home/user/fenstero/docs/profis/konfigurator-start-vorschau/index.html

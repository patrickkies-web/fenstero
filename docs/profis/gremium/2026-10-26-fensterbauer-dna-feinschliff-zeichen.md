# Feinschliff Zeichen (Anna Lorenz): Seite für Fensterbauer

**Gesamteindruck:** Die Zeichen sind aus einer Hand: Chevron, Pfeil im Pfeilkreis, ↗ im Rundknopf, Plus und Haken alle 14 px mit 1,8 px und runden Enden, Wortmarke und Zeichen in Kopf, Leiste und Fuß identisch mit der Startseite, Etiketten, Glas, Website-Skizzen und Gerät sauber. Was die Seite noch unter ihrem Niveau hält, sind zwei Etiketten an der falschen Stelle (Blatt doppelt, Weg verdeckt die Domain), zwei violette Flächen, die die DNA nicht kennt, und der violette Punkt in fünf Größen.

1. **Aufmaßblatt: sechs Ankerpunkte statt drei ab 760 px** (hoch): `.ez-blatt .ez-nur-tel { display: block }` steht später als die Media-Regel und gewinnt → Zeile streichen.
2. **Weg: Etikett verdeckt Schloss und Domain, Punkt auf der Platzhalterzeile** (hoch): Schreibtisch Punkt `27 % / 38 %` (rechtes Ende des Knopfs), Linie nach `44 / 40`, Etikett `64 % / 40 %`; Telefon bleibt.
3. **Formular-Umschalter: violette Füllung ohne Punkt** (mittel) → Füllung `handlung` plus violetter Punkt wie im Kopf.
4. **Offener Rundknopf: Violett als dritte Füllung** (mittel) → Indigo mit Weiß, Drehung des Plus trägt „offen“.
5. **Ein violetter Punkt, ein Koralle-Punkt** (mittel): 8 px mit Hof 3 px zu 35 %; aktiver Stationspunkt mit violettem Hof statt Indigo-Ring; Klärungs- und Fehlerpunkt 8 px mit Hof.
6. **Schritt 2: Höhe ist eine Strecke** (mittel): Maßlinie links neben dem Rahmen (durchgezogen 1,2 px mit Endstrichen), Ankerpunkt in der Mitte der Maßlinie; „Wunsch“ bleibt ein Punkt.
7. **Gleiche Maße für gleiche Zeichen** (klein): Chevron 14 px, Schloss mit `vector-effect="non-scaling-stroke"`, Punktraster überall Silbergrau.
8. **Anfrage-Karte klebt am Bildschirmrand** (klein): unter 900 px nicht bis 0 px, mindestens 8 px Luft.
9. **Hero: Ankerpunkt auf der Blende, Linie mit zwei Strichen** (klein): Punkt auf die Schirmkante neben der Notch (Telefon 63 % / 24 %, Schreibtisch 62 % / 22 %), Linie mit vier bis fünf Strichen.

Die drei, die am meisten bringen: 1, 2, 3 und 4 zusammen (keine violetten Flächen; Umschalter und offener Knopf tragen Füllung und Punkt beziehungsweise Indigo).

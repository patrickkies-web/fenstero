# Designrat · Maßeingabe (Maß 1 von 4 · Öffnung, Höhe in der Mitte) · 25.10.2026

Umfang: Express (Befund und Bewertung in einem Agentenaufruf je Gruppe, blind, drei Varianten). Vorschau: Design-Canvas „Maße neu gedacht“, Board „Runde 3“.

## Auftrag

- Bereich: `SCREENS.messen` in web/assets/app.js, Schritt „Maß 1 von 4 · Öffnung“.
- Wunsch des Inhabers: Der Nutzer sieht nicht eindeutig, welches Maß er gerade eingibt; das Bild ist zu klein, die Eingabefelder sind sofort offen. Ältere Menschen fragen sich: „Was soll ich jetzt eintragen?“
- Der Nutzer soll: wissen, wo er den Zollstock anlegt (Laibung, Oberkante bis Fensterbank, mittig), und die Zahl in Millimetern tippen.
- Erfolg: Die Zahl ist für den Fensterbauer verwertbar, ohne Rückfrage.

## Varianten (blind)

- A = Runde 2 (dunkle Bühne, Zahl als Kontur neben der Linie, Etikett „Oberkante“).
- B = heute (helle Karte mit Modell, Plus/Minus, Erklärabsatz, Feld „0 | mm“).
- C = Runde 1 (helles Foto groß, Linie mit „Oberkante der Öffnung“ und „Fensterbank“, Pille „? mm“ auf der Linie).

## Lösungsschlüssel (Gruppe B)

Zollstock senkrecht in der Mitte der Öffnung, unten auf die Fensterbank, oben an die Unterkante des Sturzes, am Putz der Laibung, nicht am Blendrahmen. Typische Fehler: Rahmen oder Scheibe gemessen, seitlich oder schräg, bis zum Boden; Einheit (141 statt 1410). Erwartet bei 141 cm: 1410.

## Ergebnis

| | A (Runde 2) | B (heute) | C (Runde 1) |
| --- | --- | --- | --- |
| Endkunden messen richtig (von 11) | 6 | 9 | 10 |
| Vetos Endkunden | 4 + Fehlleser | 1 | 0 |
| Fensterbauer, Hände (von 30) | 14 | 13 | 26 |
| Fensterbauer, Median „kaufen“ | 2 | 2 | 4 |
| Experten, Median Hand | 2 | 1 | 4 |

Rote Punkte: A „mm“ abgeschnitten, Hinweis etwa 3:1, Vignette verschluckt die Laibung, „Oberkante“ ohne Bezug. B „Weiter“ unter der Browserleiste, Modell winzig, „0“ als Platzhalter. C kein sichtbares Eingabefeld, kein Beispielwert, keine Live-Region.

Forderungen: Endkunden „= 141 cm neben der Zahl“ oder cm annehmen. Fensterbauer „Linie sichtbar an der Laibung, Etikett ‚Oberkante der Öffnung‘, 141 abfangen“. Experten „Zahl mit Einheit in der Pille als echtes, fokussierbares Eingabefeld, Leerzustand ‚z. B. 1.250 mm‘“.

## Entscheidung (Vorrangregel: Verstehen vor Daten vor Eindruck)

C als Grundlage. Die dunkle Bühne aus A fällt, weil sie Renate die Laibung nimmt; die Markenregel „Oberfläche dunkel, Tageslicht durchs Fenster“ bleibt erfüllt, weil nur das Foto hell ist. Dazu: Fenster im Foto schwach, Laibung und Fensterbank sichtbar; Etiketten „Oberkante der Öffnung“, „Fensterbank“, „Nicht am Rahmen“; Pille als Eingabefeld mit „z. B. 1.250 mm“, nach dem Tippen „1.410 mm“ und „= 141 cm“; 141 löst „Zeigt der Zollstock 141 cm?“ aus (wie `checkValue`); „Üblich sind 600 bis 2.400 mm“; „Weiter“ erst ab 250 mm aktiv; Plus/Minus entfallen.

Bewegung (emil-design-eng, impeccable animate): Linie zeichnet sich 500 ms (cubic-bezier(.16,1,.3,1)), Etiketten 180 ms mit 60 ms Versatz, Tasten 120 ms auf 96 %, Zahl sofort; bei „weniger Bewegung“ alles still.

Regelwerk: `impeccable detect` ohne Befund außer „Inter“ (Markenregel). Kicker bleibt trotz impeccables Verbot: er trägt Fortschritt und Farbe des Maßes.

## Offen

- Live-Region für die getippte Zahl (Lena).
- Linie und Etiketten als ein SVG mit viewBox über dem Modell, damit sie je Elementart mitskalieren (Tobias).
- Tausender: Punkt (App) gegen schmales Leerzeichen (Daniel); mit „= 141 cm“ entschärft.
- Realitäts-Check mit zwei echten Menschen steht aus.

## Antwort des Inhabers

Noch keine.

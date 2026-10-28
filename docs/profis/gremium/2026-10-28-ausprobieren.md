# Gremium: Ausprobieren über die Beispielseite von Fensterbau Brandt (28.10.2026, nachmittags)

Das Gremium ist simuliert: eine Runde, drei getrennte Agenten, blind X/Y. Echte Stimmen gab es nicht.

- **X:** neu. Beispielseite Signature mit Kästchen, erste Folie, Fensterliste im Look der DNA, Kontakt, Versandmeldung, Auswahl in den
  Farben von Fensterbau Brandt, Startseite nach dem Senden im Look der DNA.
- **Y:** bisher. Gleich die erste Folie, Fensterliste im früheren Look, Auswahl in Anthrazit mit violettem Licht.

## Änderungsliste

1. Einstieg über die Beispielseite mit Kästchen.
2. Zurück aus der ersten Folie auf die Beispielseite.
3. Fensterliste im neuen Look.
4. Auswahl am Ende in den Farben des Betriebs.
5. Startseite nach dem Senden im neuen Look.

## Gestalter (Gruppe G)

| Person | Hand | Kernsatz |
| --- | --- | --- |
| Jonas Veit | 4 | Die Auswahl ist dreifach gerahmt (Fläche, Karte, Kreis). Eine Petrol-Fläche, nur „Pakete ansehen“ gefüllt, die anderen als Zeilen. |
| Lena Hartwig | 3 | Das Kästchen ist zu lang. Der Punkt am Etikett bleibt violett. Grautexte auf Petrol messen, unter 4,5:1 wäre eine Faust. |
| Noah Brandner | 4 | Die Staffel ist zu lang. Der Pfeilkreis wirkt im Auftritt grau und gesperrt. |
| Tobias Lenz | 4 | Das Kästchen darf nicht auf Bilder warten. LCP und CLS bei 390 px messen. |
| Mara Keller | 4 | Ein Preis, der zum gezeigten Paket passt, sonst wirkt „ab 39 €“ wie ein Lockangebot. |
| Daniel Roth | 3 | Der Name im Kopf ist abgeschnitten („Fensterbau Br…“), und im Kästchen steht ein Kommafehler. |

- Ergebnis: X gewinnt 6:0, Median der Hand 4, keine Faust.
- Änderungen:
  - 1 ändern (Text und Laden)
  - 2, 3 und 5 behalten
  - 4 ändern (Form, Staffel, Preis, Punkt)

## Kunden (Gruppe K)

| Person | Hand | Kernsatz |
| --- | --- | --- |
| Renate Vogel | 4 | „Weiteres Fenster“ und „Weiter zum Absenden“ klingen gleich. Muss ich noch etwas tun? |
| Murat Demir | 4 | Die Pille unten zeigt immer, wie es weitergeht. |
| Sabine Kraus | 3 | Ein Satz, dass der Betrieb die Maße prüft, würde mich beruhigen. |
| Thomas Berger | 4 | Das Blatt nach dem Senden zeigt zwei Zeilen, ich habe ein Fenster geschickt. Das stimmt nicht. |
| Gisela Pohl | 3 | Der türkise Kasten mit Preis sieht aus, als wollte Brandt mir ein Abo verkaufen. |
| Kai Hofmann (Gegenspieler) | 2 | Er liest „Weiteres Fenster“ als „weiter“. |

- Ergebnis: X 5:1.
- Verstanden haben:
  - angekommen: 5 von 6
  - was kommt: 3 von 6
  - was zu tun ist: 4 von 6
- Median 3,5, keine Faust.

## Fensterbauer (Gruppe F)

| Person | Hand | Kernsatz |
| --- | --- | --- |
| Klaus Brandt | 2 | Veto Datenqualität: Das Blatt nach dem Senden zeigt zwei Positionen, gesendet war eine. |
| Sarah Kranich | 4 | Die echte Firmenseite zeigt, was ich kaufe. Das Kästchen darf das Wow nicht verdecken. |
| Deniz Yilmaz | 3 | Kästchen kürzen. Das Paket am Einstieg wählen statt fest Signature. |
| Tobias Reuter | 3 | „Vollständig“ grün wie in Y. |
| Michael Sonntag | 3 | Ein Zeigemodus ohne Preisleiste für den Küchentisch. |
| Petra Lindqvist | 3 | Der Preis am Ende soll zum gezeigten Paket passen. Ein Satz zu Serverstandort und KI. |

- Ergebnis: X 5:1.
- Median: Hand 3, „kaufen“ 3, „zeigen“ 3.
- Ein Veto (Klaus Brandt, Datenqualität).

## Umgesetzt (Muss-Punkte und Vetos)

1. Das Blatt nach dem Senden zeigt die gesendete Anzahl an Fenstern („1 Position“, eine Zeile), damit ist das Veto erledigt. Maße, Name
   und Kontakt bleiben vom Gerät gelöscht. Auf dem Gerät bleibt nur die Anzahl, sie ist keine personenbezogene Angabe.
2. Das Kästchen ist kürzer (zwei Absätze mit je zwei Sätzen, ohne Kommafehler). Am Telefon sitzt es unten, oben bleibt die Seite des
   Betriebs zu sehen. Es erscheint, sobald das Skript läuft, ohne auf Bilder zu warten.
3. Die Auswahl am Ende ist eine Fläche. Nur „Pakete ansehen“ ist gefüllt, die beiden anderen Wege stehen als Zeilen mit Trennlinie
   darunter. Der Punkt am Etikett bleibt violett, die Staffel dauert 360 ms (80 ms Versatz). Alle Texte auf Petrol und Schiefer
   haben mindestens 5,2:1.
4. Der Preis passt zum gezeigten Paket: „Im Paket Signature 99 € im Monat, netto; ab 39 € mit Essential.“ (aus pakete.js).
5. In der Fensterliste der Instanz heißt der Knopf „Noch ein Fenster hinzufügen“ statt „Weiteres Fenster“.
6. Die Bestätigung und die Startseite nach dem Senden sagen „Du musst nichts weiter tun.“
7. Der Name des Betriebs steht im Kopf ganz: Bis 430 px ist „Übersicht“ dort nur ein Zeichen. Den Namen behält der Knopf für Vorleser.

## Nicht übernommen, mit Grund

- Auswahl nicht in Betriebsfarben (Gisela Pohl): Der Inhaber will sie ausdrücklich in den Farben des Betriebs. Echte Kunden sehen die
  Auswahl nie, sie gibt es nur in der Testansicht.
- Paket am Einstieg wählbar statt Signature (Deniz Yilmaz): Der Inhaber will Signature. Die Muster-Leiste wechselt das Paket und bleibt
  dabei in der Testansicht.
- „Vollständig“ in Grün (Tobias Reuter): Grün gehört nicht zur Palette der DNA. „Vollständig“ steht mit Punkt und Wort da, nicht nur
  über die Farbe.
- Ein Satz zu Serverstandort und KI (Petra Lindqvist) und ein Hinweis „Brandt prüft die Maße“ (Sabine Kraus): Dafür fehlen gesicherte
  Angaben, erfunden wird nichts. Beides ist offen für das Wort des Inhabers.
- Zeigemodus ohne Preisleiste (Michael Sonntag): eine neue Funktion, offen.
- „EEZI Essential Plus gibt es nicht“ (Petra Lindqvist, Daniel Roth): Das Paket heißt in pakete.js und auf der Seite für Fensterbauer
  so.

## Messung (Beispielseite, 390 px, vierfach gedrosselte CPU)

- LCP 0,6 bis 1,3 s.
- Das Kästchen steht beim Ereignis `load`.
- CLS 0 in 7 von 10 Läufen. In 3 Läufen springt der Hero-Text (0,10 bis 0,17), auch ohne Testansicht. Das bestand schon vorher im
  Aufbau des Hero und ist offen.

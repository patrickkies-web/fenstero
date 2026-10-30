# Weiche, Betriebe sofort, Kontakt danach (30.10.2026)

## Auftrag des Inhabers

Er schickte ein Bildschirmfoto der Weiche „Wie geht es weiter?“ und wünschte sich:

- **Untertitel:** „Wähle, wie du fortfahren möchtest.“
- **Im weißen Feld:** „Gestatte uns das Aufmaßblatt an von dir ausgewählte Betriebe zu schicken (auch nur diese)“, grammatikalisch richtig.
- **Daten-Garantie darunter**, als Chip oder Feld, mit seinem Hinweis. Danach „Warum kostenlos?“ zum Aufklappen.
- **Neue Reihenfolge:** „Wie erreichen dich die Betriebe“ erst, nachdem die Betriebe gewählt sind. Die Maske „Betriebe finden“ kommt nach vorn, dort steht nur die Postleitzahl.
- **Tempo:** „ich will, dass der Nutzer sofort Betriebe findet“, „gerne auch die anliegenden Postleitzahlen“.

## Umsetzung

| Wo | Was | Warum |
| --- | --- | --- |
| Weiche, Text | Untertitel „Wähle, wie du fortfahren möchtest.“; im weißen Feld „Gestatte uns, das Aufmaßblatt an von dir ausgewählte Betriebe zu schicken (und nur an diese).“ | sein Wortlaut, mit Komma vor dem Infinitiv und „und nur an diese“ statt „auch nur diese“ |
| Weiche, Karten | untereinander statt nebeneinander | Der Satz braucht die ganze Breite. In halber Breite wäre die Karte acht Zeilen hoch geworden. |
| Weiche, Daten-Garantie | Feld nach G14 mit Chip in Indigo („Daten-Garantie“, Schild), darunter die Zusage; das Wichtigste weiß | sein Wunsch „Chip beziehungsweise noch mal so ein Feld“; Indigo, weil Chips für Zustände Indigo sind |
| Weiche, Wortlaut der Garantie | siehe Liste unter der Tabelle | Sein Text hätte zweierlei versprochen, was nicht stimmt (siehe Liste). |
| Weiche, „Warum kostenlos?“ | zum Aufklappen wie „Falls zur Hand“ beim Messen; die Pille heißt „Betriebe finden“ | sein Wunsch |
| Betriebe | erster Schritt auf Weg A: nur das Feld Postleitzahl (aus „PLZ und Ort“ vorbelegt). Mit der fünften Ziffer schließt die Tastatur und die Liste steht da. Unbekannte PLZ werden am Feld gemeldet. | „wirklich nur die Postleitzahl“ |
| Kontakt | nach den Betrieben: Name, Telefon, E-Mail freiwillig, Erreichbarkeit, Einwilligung. Kein Feld „PLZ und Ort“, der Ort kommt aus der Suche. | „erst, nachdem ausgewählt wurde“; die Einwilligung nennt die gewählten Betriebe, deshalb steht sie hier |
| Einwilligung | ohne den Satz zur Rückfrage nach zwei Tagen; sie nennt jetzt, was die Betriebe bekommen (Name, Ort, Telefon, falls angegeben E-Mail); Fassung `2026-10-30` | Die Rückfrage widerspricht der Daten-Garantie und war nie gebaut. Die E-Mail steht so in Datenschutz 6a. |
| Server | sofort aus den gespeicherten Suchen im Umkreis von 25 km, Vorrat für ganz Deutschland, neue KI-Suche nur, wenn nichts da ist (siehe Liste unter der Tabelle) | „sofort“, „anliegende Postleitzahlen“ |

So steht die Daten-Garantie jetzt in der App:

> Außer den Fensterbauern, die dein Aufmaß bekommen, meldet sich niemand bei dir, weder per E-Mail noch per Telefon noch auf anderen
> Wegen. Von uns bekommst du nur den Code und Nachrichten zu deiner Anfrage. Deine Daten geben wir nur an die Fensterbauer weiter, die du
> auswählst (oder uns für dich aussuchen lässt), so wie du es vermutlich auch selbst tun würdest. Kein versteckter Verkauf und keine
> versteckte Speicherung deiner Daten.

Diese zwei Stellen weichen von seinem Wortlaut ab:

- **„Wir und andere Unternehmen kontaktieren dich nicht“:** Die gewählten Betriebe melden sich, das ist ja der Zweck. Von uns kommen der Code und die Nachrichten zur Anfrage.
- **„Nur die von dir ausgewählten“:** Ergänzt um „Sucht ihr für mich aus“, denn dann suchen wir die Betriebe aus.

So kommt die Liste sofort:

- **Umgebung:**
  - Der Server liest alle gültigen Suchen im Umkreis von 25 km mit einer Abfrage.
  - Die Entfernung jedes Betriebs zum Kunden rechnet er neu: aus der PLZ des Betriebs, die die KI jetzt mitliefert, sonst aus seinem Ort.
  - Gemessen: 11 bis 56 ms bis zur Liste.
- **Vorrat:**
  - 483 Stützpunkte; jede PLZ liegt höchstens 20 km von einem entfernt.
  - Gesucht wird alle 10 Minuten eine, nur mit `VERMITTLUNG_VORRAT`. Vorgabe ist aus, weil es Geld kostet.
- **Neue KI-Suche:** Nur wenn weniger als drei Betriebe da sind, und dann knapp (Aufwand low, höchstens 4 Websuchen).

## Gremium, eine Runde (simuliert, keine Marktforschung)

**Gestalter (Jonas Veit):** Die Weiche hat jetzt drei Teile mit klarer Rangfolge: die weiße Karte mit dem Satz und der Null, darunter
die Garantie als ruhiges Feld, ganz unten die Frage zum Aufklappen. Untereinander liest sich das besser als die halben Karten. Die
Postleitzahl als großes Feld ist der Held der Folie, die Liste kommt ohne Ladebild. Kann: Die Garantie ist lang für ein Feld; ein
Absatz in einer Fläche widerspricht der DNA, ist hier aber der Wunsch des Inhabers.

**Kunden (Renate Vogel):** „Nur die Postleitzahl, und dann stehen die Betriebe da. Das ist angenehm.“ Die Garantie liest sie ganz; der
Satz „meldet sich niemand bei dir“ beruhigt sie mehr als der alte Text. Kai Hofmann tippt „Warum kostenlos?“ auf und findet die Antwort
ehrlich. Er fragt, ob er die Betriebe vor dem Kontakt sieht; ja, genau so ist es jetzt.

**Fensterbauer (Klaus Brandt):** Dass der Kunde erst wählt und dann seine Nummer gibt, ist für ihn kein Nachteil: Die Nummer wird
weiter per Code bestätigt. Tobias Reuter: Die Entfernung aus dem Ort des Betriebs ist für ihn plausibler als eine geschätzte Zahl.

| Änderung | Urteil | Hand |
| --- | --- | --- |
| Satz des Inhabers im weißen Feld, Karten untereinander | behalten | 4–5 |
| Daten-Garantie als Feld mit Chip | behalten | 4–5 |
| „Warum kostenlos?“ zum Aufklappen | behalten | 4 |
| Betriebe zuerst, nur Postleitzahl, Liste sofort | behalten | 5 |
| Kontakt danach, mit der Einwilligung | behalten | 4–5 |
| Kann: Garantie kürzen | offen, Wortlaut des Inhabers | – |

Muss-Punkte und Vetos: keine.

## Messung

Farbanteile je Bildschirm mit `werkzeuge/farben.py`; Telefon 390 × 844, Laptop 1280 × 800.

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt |
| --- | --- | --- | --- | --- | --- |
| Weiche, Telefon | 98,7 | 0,7 | 0,5 | 0,1 | 1,3 |
| Betriebe, Telefon | 99,9 | 0,0 | 0,0 | 0,1 | 0,1 |
| Kontakt, Telefon | 99,8 | 0,1 | 0,1 | 0,0 | 0,2 |
| Weiche, Laptop | 99,2 | 0,2 | 0,2 | 0,4 | 0,8 |
| Betriebe, Laptop | 99,9 | 0,0 | 0,0 | 0,1 | 0,1 |
| Kontakt, Laptop | 99,9 | 0,0 | 0,1 | 0,0 | 0,1 |

Bilder: `bilder/2026-10-30-vermittlung-weiche.jpg`, `-betriebe.jpg`, `-kontakt.jpg` (Telefon, ganze Folie).

## Prüfungen

Abschnitt 31 (alle bestanden):

- **Weiche:**
  - Karten untereinander, Wortlaut, Daten-Garantie mit Chip.
  - „Warum kostenlos?“ ist zugeklappt und klappt auf.
- **Betriebe:**
  - nur ein Feld;
  - ohne PLZ, mit unbekannter PLZ und mit der fünften Ziffer.
- **Kontakt danach:**
  - ohne „PLZ und Ort“;
  - Einwilligung ohne Rückfrage;
  - zurück zu den Betrieben, die Wahl bleibt.
- **Server:**
  - Umgebung;
  - Entfernung aus dem Ort;
  - Tabelle ohne Großkunden;
  - Vorrat;
  - unbekannte PLZ ohne KI-Suche.

# Testansicht für Fensterbauer und „Danke, gesendet“ (28.10.2026)

## Auftrag

- Bereich: „Selbst ausprobieren“ auf eeziframes.com/fuer-fensterbauer und alle anderen Wege dorthin, die in den Editor führen.
- Wunsch des Inhabers:
  - Kein Einstieg in die Führung und kein Ende mit „an beliebig viele“. Stattdessen der Ablauf, wie ihn die Kunden eines Betriebs
    mit gebuchtem Paket auf dessen Website erleben.
  - Am Anfang ein Hinweis, dass man in der Testansicht ist: „einfach ein Infobereich in der ersten Folie“. Die Karte über der alten
    Startseite fand er hässlich.
  - Am Ende wird das Senden an Fensterbau Brandt simuliert.
  - „Danke, gesendet“ überarbeiten.
  - Kontakt im neuen Design („Das passt ja nicht überein. Nimm das neue Design“).
- Ziel für den Nutzer: Der Fensterbauer merkt sofort, dass er testet, misst und wählt wie ein Kunde und sieht am Ende den Abschluss
  seiner Kunden.
- Woran man den Erfolg merkt:
  - Kein Server-Aufruf außer dem Lesen der KI-Bereitschaft.
  - „Testansicht“ auf jeder Folie.
  - Die Bestätigung im Look der DNA.

## Wahl

- Einstieg über `/app/?ausprobieren[=essential|plus|signature]`. Beispielbetrieb ist Fensterbau Brandt aus den Paket-Beispielen,
  die Merkmale kommen aus pakete.js, die Anrede ist „du“ wie in den Folien. Es geht gleich mit der Folie „Was planst du?“ los.
- Hinweise stehen in der Folie selbst:
  - Infobereich auf der ersten Folie
  - „Testansicht“ im Kopf jeder Folie
  - eine Zeile bei den Kontaktdaten
  - Infobereich „Testansicht · Ende“ auf der Bestätigung
- Kontakt (Instanz) und „Prüfen und senden“ (Instanz) im Rahmen der Abschluss-Folien. Die Bestätigung ist eine eigene DNA-Folie für
  alle Instanzen.
- Die Startseiten der Instanz und der Einladung sowie die Fensterliste der Instanz überarbeitet der Inhaber später („erst danach“).

## Änderungstabelle

| Wo | Was | Warum | Gremium | Stand |
| --- | --- | --- | --- | --- |
| Seite für Fensterbauer, Ratgeber, Paket-Beispiele | Alle Wege zum Ausprobieren führen auf `/app/?ausprobieren`, „Fenster planen“ in den Beispielen auf das jeweilige Paket | Verständnis | – | bleibt |
| Erste Folie | Infobereich „Testansicht für Fensterbauer“ mit „Zurück“, kurz: ein Satz mit Betrieb und Paket | Verständnis | G 4:2 ändern (kürzen), F 5:1 ändern | geändert: eine Zeile Etikett mit „Zurück“, ein Satz |
| Kopf jeder Folie | „● Testansicht“ unter dem Namen des Betriebs | Verständnis | G 6:0, F 6:0 behalten | bleibt |
| Kontakt (Instanz) | Folie im Look der DNA: Blatt mit dem Namen des Betriebs, Pflichtfelder mit Fehler am Feld, Zeile „Testansicht“ | Marke, Wunsch des Inhabers | – | neu |
| Prüfen und senden (Instanz) | Rahmen der Abschluss-Folien auch auf Instanzen | Marke | – | neu |
| Bestätigung | Bühne mit dem Blatt (Maße als ruhige Balken), Chip „Gesendet“, Nummer einmal, „Danke, gesendet.“ | Marke, Vertrauen | G 4:2 behalten, K 5 ändern, F 4:2 behalten | geändert: Etikett mit Nummer weg, Balken statt Punkte |
| Bestätigung | Durchschrift als PDF mit der einen vollen Pille, Stationen, Fragen, „Auf diesem Gerät“, „Fertig“ | Blickführung | G 4:2 ändern, K 6 ändern, F 5:1 behalten | geändert: „Fertig“ nicht mehr angeheftet, am Ende; „Jetzt von diesem Gerät löschen“ mit „Deine Anfrage bei … bleibt bestehen.“; Schritt 1 nicht gefüllt |
| Bestätigung, Testansicht | Infobereich „Testansicht · Ende“: zuerst „So käme die Anfrage bei Ihnen an“, dann „Pakete ansehen“, „Noch einmal ausprobieren“; „Fertig“ führt zur Seite für Fensterbauer | Verkauf | G 5:1 behalten, F 4:2 behalten (Inhaber: Betriebsansicht zuerst) | geändert: Reihenfolge |
| Testansicht | Anrede „du“ wie in den Folien | Seriosität | Veto F (Petra Lindqvist: du und Sie gemischt) | umgesetzt für die Testansicht |

## Nachtrag: Kontakt als letzte Folie, Versandmeldung, Auswahl für Fensterbauer

Inhaber (12:47): „Eigentlich ist das hier die letzte Folie, und da sollte stehen: an Fensterbauer schicken. Und dann sollte da diese
Benachrichtigung stehen, dass es versandt wurde, und dann diese ganzen Sachen wie Danke, gesendet etc. Mit Auswahlmöglichkeiten, wie man
jetzt weitermacht, visuell ansprechend, dass die Fensterbauer animiert werden, zu der Paketeansicht zu kommen.“

| Wo | Was | Warum | Stand |
| --- | --- | --- | --- |
| Kontakt (Website einer Instanz) | Pille „An <Betrieb> senden“ sendet direkt; Hinweise aus „Prüfen“ (fehlende Maße, angefangenes Fenster, was danach kommt) stehen auf der Folie | Wunsch des Inhabers; DNA: keine Zwischenschritte, die nur bestätigen | neu |
| Nach dem Senden | „Wird gesendet …“ auf der Pille, dann Versandmeldung „An <Betrieb> gesendet“ als Glas-Chip oben, drei Sekunden | Rückmeldung | neu |
| Bestätigung, Testansicht | „Ihr Konfigurator. Ihre Anfragen.“: große Karte „Pakete ansehen“ (#pakete, ab … im Monat aus pakete.js, keine Mindestlaufzeit), „So kommt die Anfrage bei Ihnen an“, „Noch einmal ausprobieren“; treten einmal nacheinander auf | Verkauf, Wunsch des Inhabers | neu |
| Bestätigung, Testansicht | „Fertig“ führt zu den Paketen | Verkauf | geändert |

## Gremium (eine Runde, drei Agenten, blind X/Y)

- **Gestalter:**
  - Y gewinnt beide Folien 6:0, Median der Hand 4, keine Faust.
  - Muss: Infobereich kürzen; „Fertig“ nicht angeheftet; Nummer nur einmal.
- **Kunden:**
  - Y gewinnt 4:2, Median 2,5.
  - Faust von Gisela Pohl: Sie las „Familie Berger“ auf dem Blatt als fremden Namen. Das waren die Testdaten der Bilder; das Blatt zeigt
    immer den eigenen Namen, die Bilder zeigen jetzt „Familie Vogel“, wie eingegeben.
  - Muss: PDF vor „Fertig“; Löschsatz entschärfen; Schritt 1 nicht als erledigt zeigen.
  - Offen: Zum Kontakt (Telefon und E-Mail) wollten sie einen echten Weg. In der Testansicht hat der erfundene Betrieb keine Nummer,
    damit niemand einen echten Anschluss anruft; auf echten Instanzen stehen Telefon und E-Mail mit runden Knöpfen.
- **Fensterbauer:**
  - Y vor X, Median der Hand 4, „kaufen“ 3,5, „zeigen“ 3.
  - Veto Seriosität (du und Sie gemischt): in der Testansicht gelöst.
  - Muss: Infobereich kürzen; Betriebsansicht im Ende zuerst.
  - Kann: Vorschaubild der E-Mail; Preis im Ende-Kasten (Preise nur aus pakete.js, nicht umgesetzt); Name im Kopf nicht abschneiden.

Die Urteile stehen unter docs/profis/gremium/2026-10-28-testansicht.md.

## Farbanteile (Telefon, gemessen mit werkzeuge/farben.py)

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| Erste Folie | 90,0 | 0,0 | 0,0 | 0,0 | 10,0 (Fensterbild) | 10,0 |
| Kontakt | 99,5 | 0,1 | 0,1 | 0,0 | 0,3 | 0,5 |
| Prüfen | 99,5 | 0,0 | 0,0 | 0,0 | 0,5 | 0,5 |
| Bestätigung | 99,0 | 0,1 | 0,1 | 0,5 | 0,3 | 1,0 |

## Messwerte

- Je Bildschirm eine volle Pille.
- Kein Ziel unter 44 px.
- Kein waagrechter Scroll bei 320, 390, 768 und 1440 px.
- Keine Konsolenfehler.
- In der Testansicht nur `GET /api/ki` an den Server.

## Bilder

- docs/profis/bilder/2026-10-28-testansicht-telefon.jpg (erste Folie, Kontakt, Prüfen, Bestätigung)
- docs/profis/bilder/2026-10-28-testansicht-laptop.jpg
- docs/profis/bilder/2026-10-28-danke-gesendet-telefon-ganz.jpg

## Offen (Wort des Inhabers)

- Startseiten (Einladung, Instanz) und die Fensterliste der Instanz im neuen Design.
- Anrede auf echten Instanzen: Die Folien sagen „du“, Instanzen mit „Sie“ sprechen auf Kontakt und Bestätigung „Sie“.

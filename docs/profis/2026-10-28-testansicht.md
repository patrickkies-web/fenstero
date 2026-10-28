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

## Nachtrag 2: Ausprobieren über die Beispielseite von Fensterbau Brandt (nachmittags)

Inhaber: „… dass wenn auf der Seite für Fensterbauer jemand auf den Knopf ausprobieren drückt, dass er dann sozusagen die Seite sieht wie
in dem Beispiel von Fensterbau Brand. Aber in der teuersten Fassung. … die Seite dann sozusagen im Hintergrund so ein bisschen ausgegraut
… und im Vordergrund so ein Kästchen …“ und „… diesen gesamten Workflow ausprobieren kann … und danach wieder abgeholt wird, um zu meiner
Seite zu gelangen … Einflüsse … von meiner vorherigen Geschäftsausrichtung und dessen Design … möcht ich halt nicht in diesen Schritten sehen.“

| Wo | Was | Warum | Stand |
| --- | --- | --- | --- |
| Seite für Fensterbauer, Ratgeber | „Selbst ausprobieren“ und „Konfigurator ausprobieren“ öffnen `/vorschau/paket-beispiel/signature.html?ausprobieren` | Wunsch des Inhabers | neu |
| Beispielseite Signature | Abgedunkelt, davor das Kästchen „So sieht Ihre Seite aus. Im Paket Signature.“ (angepasst mit Bildern, Logo, Farben, Ansprechpartnern, Texten; „Seite ansehen“, „Gleich Fenster planen“), einmal je Tab; Weg „Über die Website“; Paketwechsel bleibt in der Testansicht | Verständnis, Verkauf | neu |
| Erste Folie | „Zurück“ (Kopf, Fuß und Infobereich) führt auf die Beispielseite; eine Testansicht ohne Fenster kehrt dorthin zurück statt auf die alte Startseite | Ein Ablauf, ein Look | neu |
| Fensterliste (alle Instanzen) | Im Look der DNA wie die Liste des eigenen Aufmaßes: Bühne mit den Fenstern, „Deine Fenster.“ mit Stand, Karten, „Fragen?“, Pille „Weiter zum Absenden“ | Wunsch des Inhabers | neu |
| Startseite nach dem Senden (alle Instanzen) | Im Look der DNA: Blatt mit der Anfragenummer (Maße und Kontakt sind vom Gerät gelöscht), „Danke, gesendet.“, „Von diesem Gerät löschen“ mit „… bleibt bestehen.“, „Weitere Anfrage starten“ | Wunsch des Inhabers | neu |
| Ende der Testansicht | Auswahl in den Farben von Fensterbau Brandt (Signature ganz, Plus zur Hälfte, Essential eeziframes) | Wunsch des Inhabers | neu |
| Kontakt, Fußleiste | Passt „An <Betrieb> senden“ nicht neben „Zurück“ (Laptop-Spalte, Telefon unter 390 px), weicht der runde Knopf (Rückweg im Kopf); bei sehr langen Namen „Anfrage senden“ | Bedienung (vorher lag der Knopf am Laptop über dem letzten Feld) | neu |
| Paket-Beispiele | Preise in der Muster-Leiste aus pakete.js (39, 69, 99 €) | Ehrlichkeit | korrigiert |

Farbanteile (Telefon, werkzeuge/farben.py): Beispielseite mit Kästchen 99,9 % neutral; Fensterliste 98,9 % neutral (Violett 0,7);
Kontakt 99,8 %; Ende mit Auswahl 66,1 % neutral, 33,7 % Brandt-Palette (zählt im Werkzeug als „Foto“, gewollt); Auswahl im Bild 57 %
Brandt-Palette. Bilder: docs/profis/bilder/2026-10-28-ausprobieren-telefon.jpg und -laptop.jpg.

Noch im früheren Look und nicht im Testablauf: die Startseite einer Instanz vor dem ersten Fenster und die Einladungsseite („kümmern
wir uns erst danach“).

Gremium, eine Runde, blind X/Y (Urteile unter docs/profis/gremium/2026-10-28-ausprobieren.md):

- Gestalter: X 6:0, Median 4.
- Kunden: X 5:1, Median 3,5.
- Fensterbauer: X 5:1, Median 3. Veto Datenqualität: Das Blatt nach dem Senden zeigte zwei Zeilen statt einer Position.

Umgesetzt:

| Wo | Was | Gremium | Stand |
| --- | --- | --- | --- |
| Startseite nach dem Senden | Blatt mit der gesendeten Anzahl an Fenstern | Veto F, Muss K | geändert |
| Kästchen | kürzer, am Telefon unten (Seite oben sichtbar) | Muss G, F | geändert |
| Auswahl am Ende | eine Fläche, nur „Pakete ansehen“ gefüllt, Zeilen darunter, Punkt violett, Staffel 360 ms, Kontrast ab 5,2:1 | Muss G | geändert |
| Auswahl am Ende | Preis des gezeigten Pakets, „ab …“ mit dem kleinsten Paket | Muss G, F | geändert |
| Fensterliste | „Noch ein Fenster hinzufügen“ | Muss K | geändert |
| Bestätigung | „Du musst nichts weiter tun.“ | Muss K | neu |
| Kopf | Name ganz, „Übersicht“ bis 430 px als Zeichen | Muss G | geändert |
| Beispielseiten | Seitensymbol (kein 404 auf /favicon.ico) | Prüfsuite | neu |

Nicht übernommen, weil es dem Wort des Inhabers widerspricht: Auswahl ohne Betriebsfarben (K) und Paket am Einstieg wählbar (F).
Offen: Satz zu Serverstandort und KI, Hinweis „der Betrieb prüft die Maße“, Zeigemodus ohne Preisleiste, gelegentlicher Sprung im Hero
der Beispielseite (bestand schon vorher).

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

- Startseiten (Einladung, Instanz vor dem ersten Fenster) im neuen Design. Die Fensterliste der Instanz ist seit Nachtrag 2 umgestellt.
- Anrede auf echten Instanzen: Die Folien sagen „du“, Instanzen mit „Sie“ sprechen auf Kontakt und Bestätigung „Sie“.

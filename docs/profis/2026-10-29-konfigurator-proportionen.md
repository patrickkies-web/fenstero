# Konfigurator: Proportionen (29.10.2026)

Bilder: docs/profis/bilder/2026-10-29-konfigurator-proportionen-tel.jpg und -laptop.jpg (Vorher/Nachher der Beispielfolie „Welches
Material?“), docs/profis/bilder/2026-10-29-konfigurator-proportionen-ueberblick-*.jpg (alle Folien nach der Übernahme). Werkzeuge:
docs/profis/werkzeuge/proportionen/ (nachher.css ist der Vorschlag, wie er dem Inhaber gezeigt wurde; shot.mjs und ueberblick.mjs nehmen
die Bilder gegen den Dev-Server auf Port 8789 auf).

## Auftrag

Wunsch des Inhabers: Das Feld, in dem das Element steht (die helle Bühne), am Telefon etwa 20 % größer; Knöpfe und Chips wirken klobig
und haben zu viel Luft, die Schrift darin ist zu groß; gewählte Auswahlmöglichkeiten sollen kein violettes Licht mehr tragen, sondern
einfach weiß sein. Am Design, am Konfigurator selbst und am 3-D-Modell sonst nichts ändern; Ziel ist eine exklusivere Optik allein über
die Proportionen. Erst ein Bild (Vorher/Nachher einer Folie), nach seinem Ja die Übernahme auf den ganzen Konfigurator.

Korrektur nach dem ersten Bild: Die Vergrößerung der Bühne gilt nur fürs Telefon („zum Beispiel auf dem iPhone“); am Laptop ist kein
Platzproblem, dort bleibt die Bühne, und nur die Bedienelemente werden kompakter. Danach: „Passt“.

## Umsetzung (ein Block am Ende von web/assets/app.css, „Proportionen des Konfigurators“)

| Bereich | Vorher | Nachher |
|---|---|---|
| Bühne Wünsche (Telefon) | 220–272 px | 264–326 px, das Modell wächst mit (Maßstab aus der Bühnenhöhe) |
| Bühne Fotos (Telefon) | 250 px | 300 px |
| Bühne Ergebnis (Telefon) | 390–460 px | 420–520 px (bei 844 px Höhe: 444 statt 390) |
| Bühne Messen, Ränder, Start, Lage | | unverändert: Messen und Ränder füllen den Bildschirm schon (Regel „Bildfläche vor Dichte“), Start und Lage sind keine Element-Bühne |
| Bühne am Laptop | | unverändert (Container mit 12,5 % Rand bleibt) |
| Kacheln der Wünsche | 76 px hoch, Symbol 40, Name 15, Zeile 13, Rundung 20, Fuge 10 | 62 px, Symbol 30, Name 14, Zeile 12, Rundung 16, Fuge 8 |
| Chips und Segmente auf Weiß | 44 px, Schrift 15, Innenrand 4 | 44 px (Ziel bleibt), Schrift 14, Innenrand 3 |
| Listen, Zähler, Schalter | Zeilen 52, Schrift 15, Rundknöpfe 44 | Zeilen 46, Schrift 14, Rundknöpfe 44 mit kleinerer Zahl; Schalter unverändert |
| Farbtupfen | 38 px, Namen 12 | 34 px, Namen 11 |
| „Weiß ich noch nicht“, „Mehr zu …“ | 56 px, Schrift 15/13 | 48 px, Schrift 14/12 |
| Frage der Wünsche | Titel 28, Unterzeile 14 | Titel 26, Unterzeile 13 |
| Fuß (alle Folien) | Pille 52, Pfeilkreis 40, Zurück 52, Schrift 15 | Pille 48, Pfeilkreis 36, Zurück 48, Schrift 14 |
| Lage | Titel 30, Chips und Stockwerk 44 mit Schrift 15, Plus/Minus 48 | Titel 28, Chips und Stockwerk 44 mit Schrift 14, Plus/Minus 44 |
| Start | Kacheln 64, Stelle 44 mit Schrift 14 | Kacheln 58, Stelle 44 mit Schrift 13 |
| Ergebnis, Abschluss, Liste, Gespeichert, Führung, Blätter | Knöpfe 48–52, Schrift 15 | Knöpfe 44–48, Schrift 14; Chips bleiben 44 |
| Gewählte Kachel | Anthrazit mit violettem Ring, Punkt hinter dem Namen und violettem Licht unten | Weiß mit schwarzer Schrift, ohne Ring, Punkt und Licht |
| Gewählter Farbtupfen (Wünsche, Farbblatt) | violetter Ring | weißer Ring |

Nicht geändert: Zustand der Chips auf Weiß (gewählt schwarz mit violettem Punkt), Segmente auf der Lage-Karte (gewählt Violett mit
schwarzer Schrift, Regel der DNA), Werkzeugknöpfe am Modell, Kopfzeile, Stationen-Band, Messen-Folie, 3-D-Modell und Kamera.

## Prüfung

- Prüfsuite Abschnitte 16 (Erstaufmaß, Gestaltung der neuen Schritte) und 22 (Konfigurator ohne Hürden) gegen einen Testserver mit
  KI-Attrappe: 145 Prüfungen bestanden, keine Fehlschläge. Gegen den Server mit Daten-Attrappe (Port 8789) schlagen zwei Kundenlink-
  Prüfungen fehl (404 auf /api/link/k2m8q), unabhängig von dieser Änderung.
- Bilder aller Folien nach der Übernahme: docs/profis/bilder/2026-10-29-konfigurator-proportionen-ueberblick-*.jpg (Telefon 390 × 844,
  Laptop 1440 × 900).

## Offene Punkte

- Ziele bleiben 44 px: Das gezeigte Nachher hatte Chips, Segmente und Rundknöpfe mit 40 px. Die Prüfsuite (Abschnitt 16, „Ziele ab
  44 px“) und die DNA verlangen 44 px; übernommen wurden deshalb 44 px mit Schrift 14 und engeren Innenrändern. Der sichtbare
  Unterschied zum Bild sind 4 px je Chip. Will der Inhaber die 40 px trotzdem, muss die Prüfung mitgeändert werden.
- Ergebnis am Telefon: unter der Karte mit den Maßen steht der Hinweis „Am Modell die Mitte …“ jetzt hinter dem Fuß und erst nach dem
  Scrollen sichtbar (vorher auf dem ersten Bildschirm). Gewollt zugunsten der größeren Bühne; ist es zu viel, `--bh` der Folie
  `.dna.er` auf `calc(100svh - 420px)` setzen.

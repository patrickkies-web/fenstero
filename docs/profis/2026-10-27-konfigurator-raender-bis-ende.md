# Konfigurator, Schritt 4 bis zum letzten Schritt (27.10.2026)

Vorschau: docs/profis/konfigurator-start-vorschau/ (Artifact „Konfigurator“, dieselbe Adresse wie Schritt 1 bis 3). Bilder:
docs/profis/bilder/2026-10-27-konfigurator-raender-bis-ende-tel.jpg und -desk.jpg. Urteile und Berichte:
docs/profis/gremium/2026-10-27-konfigurator-raender-bis-ende-*.md.

## Auftrag

- Bereich: alle Folien nach „Messen“: Ränder mit „Passt.“, Ergebnis, Wünsche (Lage, Tiefe, Fragen), Gespeichert, Fürs Angebot 1 bis 3,
  Aufmaßblatt, E-Mail, Kasse, Freigeschaltet, Teilen.
- Wunsch des Inhabers: „Überarbeite so bitte den Konfigurator bis zum letzten Schritt weiter durch.“ Die Menüführung der bisherigen Folien
  (Kopf, Bühne, Frage mit i und Notiz, weiße Karte, Fuß mit rundem Zurück und einer Pille) ist gesetzt; Anpassungen und Bewegung erlaubt.
- Der Nutzer soll: die vier Ränder messen, sein Aufmaß lesen, Wünsche wählen und das Aufmaßblatt freischalten und teilen.
- Erfolg: jede Folie in der Familie von Schritt 1 bis 3, eine Pille im unteren Drittel, keine Funktion der App verloren.

## Wahl (drei Zeilen)

1. Ränder auf derselben Folie wie die Maße (gleiche Bühne, Lupen, Tasten); „Passt.“ zeigt alle sechs Maße der Öffnung am Modell.
2. Ergebnis als Modell mit den vier Maßen an den Kanten, darunter die Öffnung als Leuchtkachel; Wünsche mit den Lage- und Tiefe-Folien der
   App (fix) und einem Fragenrahmen nach der DNA, je Option ein Modellbild aus der App.
3. Abschluss mit dem Aufmaßblatt als durchgehendem Objekt im Fensterlicht (vorher gesperrt, nachher offen); Preis 7,99 € als Zahl.

## Gremium (eine Runde, blind; X = Vorschlag, Y = App heute)

| Gruppe | Gewinner | Hände | Vetos |
|---|---|---|---|
| Kunden | X in allen vier Bereichen | 2, 3, 3, 4, 4, 4 (Median 3,5) | Thomas: „15 % Zuschuss vom BAFA“ ohne Bedingung |
| Gestalter | X | Median 3,5, keine Faust | Lena: Werte und Linien nicht an den Kanten („Passt.“, Ergebnis); Tobias: Drehen, Zoom, Zahnrad fehlten im Ergebnis |
| Fensterbauer | X 6:0 in allen vier Bereichen; kaufen/zeigen 4/4 (Abschluss 3,5/4) | 3, 5, 4, 3, 4, 3 (Median 3,5) | Petra: 15 % ohne Bedingung |

Keine Änderung mit Mehrheit „zurück“. Alle Vetos sind umgesetzt (Förderung nur mit „bis zu … nur unter Bedingungen“, Linien an den Kanten,
Rundknöpfe −, +, Zahnrad und „Zum Drehen ziehen“ im Ergebnis). Muss-Punkte umgesetzt: „Überspringen“ auf allen drei Seiten „Fürs Angebot“,
„Speichern kostet nichts, das Blatt kostet einmalig 7,99 €“ auf „Gespeichert“, Rückfrage „Alle vier genau wie die Mitte?“ bei viermal
„Hier auch …“, Ränder mit zweiter Stimme („Höhe <em>links.</em>“), cm-Wert in „Hier auch … gemessen?“.

## Detail-Profis und Vorlagen-Abgleich (umgesetzt)

| Herkunft | Befund | Umsetzung |
|---|---|---|
| Zeichen 1 | Ergebnis: alle vier Linien neben den Kanten (Kamera beim Auslesen noch in Fahrt) | Lagen neu ausgelesen (Kamera steht), Öffnung an den im Bild abgelesenen Ecken, Element an den Rahmenkanten; alle sechs Elemente |
| Zeichen 2, UX 3 | Rand 3: Feld über den Lupen | neue Lage unter den Lupen links vom Knopf; passt keine, die mit der kleinsten Überdeckung (Enden zählen sechsfach) |
| Zeichen 3–5 | „Passt.“ und Ränder: Enden 2–31 px neben der Mauerkante | Fenster nachgemessen: Breiten 667 → 1.480, Höhen an der Mauer, Rand 1/2 oben auf der Kante, Höhe rechts an der Raumecke |
| Zeichen 6, 7 | Schilder auf Linien, keine Kappen, Strichelung endet in einer Lücke | Schild nie auf einer Linie der anderen Richtung; Kappen 14 × 1,8 (blass 10 × 1,2); Strichelung passend zur Länge; Legenden 6/4 und 4/4 |
| Zeichen 8–10 | Haken, Zustände, Kleinzeichen | Haken auf Violett schwarz, Ring 1,8; „Fürs Angebot 3“ zeigt das Blatt gesperrt; Einführungspreis mit Listenpunkt; Papier 1,2 mit 4/4; „WhatsApp“ ohne „›“ |
| Bewegung 1–3 | Mitte doppelt belichtet, Bild springt zwischen Rändern, alter Haken im neuen Feld | Mitte blendet mit dem Bild; Kamerawechsel gleiten 200 ms nur über transform; Haken geht sofort |
| Bewegung 4 | Tastatur löst Gleiten aus | zentral in zeigeFolie und in den Wünschen: nach Tastendruck kein Einfahren; Kassenfehler per Tastatur ohne weiches Scrollen |
| Bewegung 5–10 | Welle bei jedem Tipp, Haken schnappt, Punkt eilt voraus, Druck uneinheitlich, Hinweis springt, Zustand läuft nach | Welle nur beim Hinkommen, sonst nur die neue Kapsel; Haken ab 12 Uhr nach dem Folienwechsel; Punkt nach dem Balken; überall 0,97; Hinweis mit @starting-style; Zustand vor dem Einfahren |
| UX 1, 2 | Doppeltipp überspringt Folien, „Hier auch …“ speichert den nächsten Rand | Fuß und Kacheln 450 ms nach jedem Wechsel taub für Zeigerklicks (Tastatur geht durch); „Hier auch …“ im nächsten Rand 700 ms taub und blendet erst dann ein. Nachgestellt: kein Sprung mehr |
| UX 4–10 | Beispielzahl im leeren Rand-Feld, AGB-Link im Haken, tote Kopfknöpfe, Rückwege, Vorlesen, „Mehr erfahren“, E-Mail doppelt | Ränder ohne Beispiel; AGB unter den Haken; Kopfknöpfe sagen, was die App tut; Ergebnis zurück zu „Gespeichert“, „Zurück: Fenster“, Freigeschaltet ohne Kopf-Zurück; Hinweis nur einmal vorgelesen, Zahlungsart mit Fehlerbezug, „Gespeichert: “ vor dem Namen; 44 px; E-Mail aus „Fürs Angebot 3“ vorbelegt |
| Typografie 1–10 | Leerzeichen, Datum, Umbrüche, zwei Stimmen, Etiketten, Notiz 12 px, Platzhalter 2,5:1, Absätze in Karten, Kassenzahl | geschützte Leerzeichen bei Preis, Datum, Spannen; „Bis zum 3. November“; „Hier auch …“ unter 390 px einzeilig; Unterzeile 14/1,4 überall; Etiketten 12 px; Notiz 13 px; Platzhalter 3,6:1; Karten in drei Ebenen; Kasse 48/300 mit Einheit 14 |
| Frontend 1 | Ergebnis: Modell kommt nach der Folie, Bild 3,7-mal zu groß, Faltschiebewand ohne Bild | Bild wird vor dem Wechsel geladen und dekodiert (höchstens 150 ms); Standard 1.320 × 1.106, die 2.148-px-Fassung erst beim Zoom; Faltschiebewand mit Bild und Lagen |
| Frontend 2, 4–6 | „Passt.“ in vier Lagen, bleibende Ebenen, Höhe nach dem Drehen, Wünsche unscharf | „Passt.“ als ein Zustand (180 ms, nur die Kapselreihe füllt sich); `backwards` statt `both`; Höhe ohne alte Bühne; Wünsche-Bilder 1.170 px, erste Frage vorgeladen |
| Material 1–4 | Fürs Angebot ohne Objekt, Werte ohne Licht, Preis schwach, Blatt flach | Boden aus Seite 3 unter Schleier, Kapseln und Stationen mit Lichtkante; Leuchtkachel im Ergebnis, Licht und Raster auf „Passt.“; Preis zuerst und mit Licht; Blatt mit hartem Schatten |
| Typografie (Vorlagen) 1–5 | Heldenzahlen in sieben Stimmen, Luft | Öffnung 300/48 als Kachel über die volle Breite, Element 400/20; Preis 200/64; Titel → Text 12 px, Text → Karte 24–32 px |
| eigene Prüfung | „Welche Form?“ und „Öffnet nach innen oder außen?“ ohne Antworten (Auslese aus der App leer) | Auslese repariert (werkzeuge/wunsch-render.mjs), je Form und Richtung ein Modellbild |
| eigene Prüfung | Ergebnis: unterer Wert unter den Rundknöpfen | Bühne 320 px, Modell zwischen Chip und Knopfleiste in gleicher Größe |

Nicht umgesetzt, mit Grund: Blickwechsel Rand 2 → 3 hart schneiden (Frontend 2) – der Bewegungs-Profi bestätigt die Überblendung „neu über
alt“, die Mitte blendet jetzt mit; Stil- und Layoutlesungen bündeln und Bühnenmaße zwischenspeichern (Frontend 3) und Folien ab Schritt 6
nachladen (Frontend 7) – Umbau der Vorschau-Seite ohne sichtbaren Gewinn, gehört in die Übernahme in die App (dynamischer Import je
Schritt); Material 5 Schreibtisch-Licht nur auf das Wort des Inhabers.

## Messwerte (390 × 844 und 1280 × 800)

- Ablauf Start bis Teilen mit Fenster: keine Konsolenfehler, Layoutsprung 0 (mit echten Klicks und Tipps; mit Skriptklicks ohne Eingabe
  zählt Chromium die Lagewechsel der Bühne nach 350 ms Halten mit).
- Je Folie genau eine volle Pille, im unteren Drittel, 52 px hoch; keine Animation nach 2,6 s; kein `filter: blur` auf Flächen; 0 lazy-Bilder;
  alle Ziele ab 44 px.
- Doppeltipp (Touch, 150 ms): „Passt.“ → Ergebnis, „Gespeichert“ → Fürs Angebot 1; „Hier auch …“ zweimal in 450 ms speichert nur einen Rand.
- Bildbytes: Ergebnis 17–27 KB (Zoom 32–56 KB), Wünsche 2,0 MB für 109 Bilder, je Frage 10–25 KB.

| Bildschirm (Telefon) | Neutral % | Violett | Koralle | Indigo | Foto/Modell | Farbe gesamt |
|---|---|---|---|---|---|---|
| Passt. | 98,1 | 1,5 | 0,3 | 0,0 | 0,0 | 1,9 |
| Ergebnis | 95,1 | 0,9 | 0,3 | 3,1 | 0,6 | 4,9 |
| Lage | 95,8 | 2,2 | 0,1 | 1,6 | 0,3 | 4,2 |
| Tiefe | 90,3 | 5,2 | 1,4 | 3,0 | 0,2 | 9,7 |
| Gespeichert | 99,0 | 0,1 | 0,0 | 0,0 | 0,9 | 1,0 |
| Fürs Angebot 1 | 98,6 | 0,5 | 0,0 | 0,8 | 0,0 | 1,4 |
| Fürs Angebot 2 | 99,9 | 0,1 | 0,0 | 0,0 | 0,0 | 0,1 |
| Fürs Angebot 3 | 100,0 | 0,0 | 0,0 | 0,0 | 0,0 | 0,0 |
| Aufmaßblatt | 96,3 | 1,4 | 0,0 | 2,2 | 0,0 | 3,7 |
| E-Mail | 99,9 | 0,0 | 0,0 | 0,0 | 0,0 | 0,1 |
| Kasse | 100,0 | 0,0 | 0,0 | 0,0 | 0,0 | 0,0 |
| Freigeschaltet | 98,9 | 0,3 | 0,1 | 0,7 | 0,0 | 1,1 |
| Teilen | 99,8 | 0,2 | 0,1 | 0,0 | 0,0 | 0,2 |
| **Mittel Start bis Teilen** | 97,7 | 0,9 | 0,1 | 0,8 | 0,5 | 2,3 |

Die Tiefe-Folie ist die der App (fix); Violett liegt dort im Kapitelraster und im Licht. Abschlussfolien bleiben bewusst fast farblos
(Violett nur als Akzent, Regel des Inhabers); der Vorlagen-Abgleich hatte 3–7 % je Bildschirm empfohlen.

## Änderungstabelle für den Inhaber

| Änderung | Zweck | Gremium | Stand |
|---|---|---|---|
| Ränder auf der Maß-Folie, „Hier auch … gemessen?“ mit cm, Rückfrage bei viermal gleich | Verständnis, Datenqualität | behalten / ändern (umgesetzt) | bleibt |
| „Passt.“ mit allen sechs Maßen am Modell, Karte mit Kapselreihen | Blickführung, Vertrauen | ändern (Werte an ihre Linie, umgesetzt) | bleibt |
| Ergebnis: Modell mit vier Maßen an den Kanten, Drehen/Zoom/Zahnrad, Öffnung als Leuchtkachel | Verständnis, Funktionen der App | ändern (umgesetzt) | bleibt |
| Wünsche: Lage und Tiefe der App, Fragen mit Modellbild je Option | Marke, Verständnis | – (siehe Nachtrag) | bleibt |
| Gespeichert: „Speichern kostet nichts“, Karte in drei Ebenen | Vertrauen | behalten / ändern (umgesetzt) | bleibt |
| Fürs Angebot 1–3: „Überspringen“, Förderung nur mit Bedingung, Boden im Licht | Vertrauen, Abbruch vermeiden | ändern (umgesetzt) | bleibt |
| Aufmaßblatt bis Teilen: Blatt als Objekt, Preis zuerst, AGB unter den Haken | Vertrauen, Recht | behalten / ändern (umgesetzt) | bleibt |

Neue Wortlaute zur Freigabe: „Speichern kostet nichts. Das Aufmaßblatt als PDF kostet einmalig 7,99 €.“, „Überspringen“, „Alle vier
genau wie die Mitte? Das ist selten. Bitte einmal nachmessen.“, „bis zu 15 % · Zuschuss vom BAFA, nur unter Bedingungen“.

## Offen

- Ränder und „Passt.“ der fünf übrigen Elemente sind nicht im Bild nachgemessen (nur das Fenster); Rand-Unterzeilen für Türen und die
  Brüstung bei Türen wie in der App.
- Wünsche zeigen den Weg „Fenster, Üblich“; „Kurz“ und „Alles“ ändern nur die Zahl, „Mehr zu …“ und „Alle Farben“ melden nur den Stand.
- Ergebnis ist ein Standbild je Element (Drehen zeigt in der Vorschau keine neue Ansicht).
- Kasse ist ein Testkauf; live gilt § 312j BGB („Zahlungspflichtig bestellen · 7,99 €“). blatt.js (PDF) unberührt.
- Budget ist wie in der App vorausgewählt („Weiß ich noch nicht“); Gremium K wünschte keine Vorauswahl – Entscheidung des Inhabers.
- Frühere Commits dieses Zweigs (z. B. f70002e) tragen noch eine Zeile mit Modellnamen; die Geschichte wird nicht umgeschrieben.

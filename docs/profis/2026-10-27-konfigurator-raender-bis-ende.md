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
| Ergebnis: feste Ansicht je Element mit vier Maßen an den Kanten, Zoom/Zahnrad, Öffnung als Leuchtkachel | Verständnis, Ruhe | ändern (umgesetzt); Drehen auf Wort des Inhabers wieder heraus | bleibt |
| Wünsche: Lage und Tiefe der App, Fragen mit der echten 3-D-Bühne der App | Marke, Verständnis, Funktionen der App | Y gewinnt 4:2 / 5:1 / 5:1, ändern (umgesetzt, siehe Nachtrag) | bleibt |
| Gespeichert: „Speichern kostet nichts“, Karte in drei Ebenen | Vertrauen | behalten / ändern (umgesetzt) | bleibt |
| Fürs Angebot 1–3: „Überspringen“, Förderung nur mit Bedingung, Boden im Licht | Vertrauen, Abbruch vermeiden | ändern (umgesetzt) | bleibt |
| Aufmaßblatt bis Teilen: Blatt als Objekt, Preis zuerst, AGB unter den Haken | Vertrauen, Recht | behalten / ändern (umgesetzt) | bleibt |

Neue Wortlaute zur Freigabe: „Speichern kostet nichts. Das Aufmaßblatt als PDF kostet einmalig 7,99 €.“, „Überspringen“, „Alle vier
genau wie die Mitte? Das ist selten. Bitte einmal nachmessen.“, „bis zu 15 % · Zuschuss vom BAFA, nur unter Bedingungen“.

## Offen

- Ränder und „Passt.“ der fünf übrigen Elemente sind nicht im Bild nachgemessen (nur das Fenster); Rand-Unterzeilen für Türen und die
  Brüstung bei Türen wie in der App.
- Die Wünsche laufen seit dem Nachtrag mit der App selbst; offen sind dort nur „Notiz“, „Alle Farben“ und das Eintippen einer
  Flügelbreite (die Vorschau sagt, was die App öffnet; der Inhaber braucht sie in der Vorschau nicht).
- Kasse ist ein Testkauf; live gilt § 312j BGB („Zahlungspflichtig bestellen · 7,99 €“). blatt.js (PDF) unberührt.
- Budget ist wie in der App vorausgewählt („Weiß ich noch nicht“); Gremium K wünschte keine Vorauswahl – Entscheidung des Inhabers.
- Frühere Commits dieses Zweigs (z. B. f70002e) tragen noch eine Zeile mit Modellnamen; die Geschichte wird nicht umgeschrieben.

## Nachtrag: Wünsche und Ergebnis mit der echten 3-D-Bühne (27.10.2026, Nachmittag)

**Anlass.** Der Inhaber: „Was aber in der Vorschau in dem Artefakt von dir nicht funktioniert hat, ist die Detailtiefe und die Bewegung und
die Einstellung des Blattes beziehungsweise die Auswahl ob man Klinke hat oder nicht also die komplette 3-D Ansicht in der Detailtiefe wie
ich sie eigentlich in den Konfigurator eingestellt habe. Hast du gegebenenfalls an der Qualität jetzt gespart beziehungsweise da durch deine
Folien etwas über gespeichert was ich nicht haben wollte?“ Antwort: In web/ ist nichts überschrieben (geprüft, `git diff HEAD -- web/` leer);
die Vorschau hatte Standbilder aus der App gezeigt. Regel dazu im Begleit-Skill, Abschnitt 4 („Echte 3-D-Bühne statt Standbilder“).

**Was jetzt läuft.** app/buehne.html lädt die Dateien der App unverändert (app.js, buehne.js, modell.js, ral.js, gemeinsam.js, einladung.js,
app.css) und zeigt nur ihre Bühne; ez-vorab.js lenkt /api/ und Bildpfade um, ez-bruecke.js liest Frage, Optionen und Stand und tippt in der
App, ez-buehne.css färbt die Bühne nach der DNA. Die Folie „Wünsche“ zeichnet Frage und Antworten aus dem Stand der App, jeder Tipp geht an
die App (Planungstiefe, „Mehr zu …“, Folgefragen bei drei Flügeln, Regler, Zähler, Schalter, Notizfeld inklusive). Lädt das
Bühnenfenster nicht, stehen die Bilder je Frage und Option da.

**Klarstellung des Inhabers (danach):** „Nein ich brauch das jetzt nicht für die Vorschau. Es geht mir einfach nur darum, dass die Kunden
natürlich am Anfang nicht eine 3-D Ansicht haben, wo die ihre Maße eingeben sollen, weil das einfach nur Unruhe stiftet, sondern es war
eine vorgegebene Ansicht auf die jeweiligen Elemente geben aber es geht mir darum, dass sie dann nachher in der [den Wünschen] auf jeden
Fall sehr stark herausgearbeitete Fassung haben.“ Folge: Das Ergebnis, das kurz die Ansicht „result“ der App zum Drehen zeigte, steht
wieder als feste Ansicht je Element mit den vier Maßen an den Kanten (ohne „Zum Drehen ziehen“; −, + und Zahnrad bleiben). Messen und
Ränder hatten schon feste Ansichten. Die Wünsche behalten die Bühne der App. Regel im Begleit-Skill, Abschnitt 4 („Beim Messen kein
3-D, in den Wünschen das ausgearbeitete 3-D“).

### Gremium Wünsche (eine Runde, blind; X = App heute, Y = Vorschlag)

| Gruppe | Gewinner | Hände | Vetos und Fäuste | Stand |
|---|---|---|---|---|
| Kunden | Y 4:2 | 3, 4, 3, 2, 3, Faust (Median 3) | Kai (Faust): „Schritt 6 von 6“ liest sich wie fertig; Thomas: Regler der App fehlen | Chip „Schritt 6 · Wünsche“ mit Anteilsring; Bühne ist die App mit allen Reglern |
| Gestalter | Y 5:1 | 2, 3, 4, 4, 4, 4 (Median 4) | Tobias: Werkzeuge und Sprossen-Regler fehlen | Werkzeuge als Glasleiste rechts, Regler der App auf der Bühne |
| Fensterbauer | Y 5:1; seriös, verständlich, zeigen, kaufen je 4 (zumuten 3) | 3, 4, 2, 3, 3, 3 (Median 3) | Deniz: „Weiß ich noch nicht“ verdeckt; Tobias: Sprossenfrage ohne Sprossen; Petra: drei Zähler | klebt über dem Fuß (ab 740 px Höhe); Live-Modell; ein Zähler je Ebene („Frage 1 von 11“) |

Keine Änderung mit Mehrheit „zurück“. Muss-Punkte umgesetzt: Pille auf jeder Frage an derselben Stelle (774 px), Rechtslinks am Ende des
Inhalts mit 48 px Abstand, „Fragen: Üblich ▾“ öffnet die drei Stufen der App, gefragtes Wort weiß und „innen“/„außen“ immer weiß, Notiz
auf der Notizfrage weg, Materialtupfen bei der Fensterbank, markierter Flügel violett. Konsent ist nach der Regel des Inhabers (eine Runde)
nicht erneut geprüft; die Hände steigen erst mit dem Realitäts-Check.

Nicht umgesetzt, mit Grund: niedrigere Kacheln mit dem Zeichen links (G K4, F 1) – die Strichzeichnung über dem Namen ist die Form aus
Schritt 1, die der Inhaber angenommen hat, und der Grund (verdeckter Ausweg) ist mit der klebenden Zeile behoben; zweite Stimme immer am
Satzende („Welche Farbe | außen?“, G K5) – widerspricht „innen/außen immer weiß“ von Kunden und Fensterbauern, Vorrang Kunde.

### Detail-Profis und Vorlagen-Abgleich Wünsche (umgesetzt)

Berichte: docs/profis/gremium/2026-10-27-konfigurator-wuensche-profis.md und -vorlagen.md.

| Herkunft | Befund | Umsetzung |
|---|---|---|
| Bewegung 1, 2; Frontend 1 | Bühne bei jedem Weiter 200–500 ms schwarz, Antworten doppelt eingeblendet | nur Frage und Antworten blenden ein, ab Deckkraft 0,4 in 160 ms (WAAPI); die Bühne bleibt bei 1,00 |
| Bewegung 3; Frontend 2 | Jeder Tipp zeichnet alle Antworten neu, Ring und Licht laufen nicht | gleiche Frage: Elemente bleiben, nur Attribute, Texte und Werte gleichen sich an; Ring sofort, die App rechnet nach dem nächsten Bild |
| Bewegung 4; Typografie (Vorlagen) 1 | Punkt schiebt den Namen 15 px | Punkt absolut hinter dem Namen, Punkt, Ring und Licht 150 ms |
| Bewegung 5 | kein Druckgefühl an Liste, „Üblich“, Band, i, Kapitel, Breiten | scale(.97) in 0 s, zurück in 160 ms; Listenzeilen tönen sich beim Drücken |
| Bewegung 7 | Ersatzbild bricht bei schnellen Tipps ab | laufende Überblendung wird sauber beendet |
| Zeichen 1, 2 | vier Zeichen für „gewählt“, zwei Ringe nebeneinander | Einfachwahl Punkt, Mehrfachwahl Haken; i direkt hinter dem Wort, Wahlzeichen allein am Rand |
| Zeichen 3, 4, 6 | i-Ringe in drei Stärken, Sonnenschutz ohne Hauptstrich, Plus-Ring größer | alle i 1,5 px (28/22 px); Kasten und Rahmen 1,8; „Mehr zu …“ 24 px |
| Zeichen 5 | Kapitel-Bogen ohne die Punkte des Bands | dieselben drei Punkte (fertig, jetzt, offen) |
| UX 1 | 375 × 667: Antworten unsichtbar | Bühne `clamp(184px, 100svh − 470px, 272px)`, „Weiß ich noch nicht“ klebt erst ab 740 px Höhe, `scroll-padding-bottom` 168 px |
| UX 2 | Doppeltipp auf Zurück springt zwei Fragen | Zurück 450 ms gesperrt, Zeigerklicks in den Antworten 450 ms nach jedem Wechsel verworfen |
| UX 3 | Fokus geht nach „Alles klar“ verloren | der Bogen merkt sich den Knopf, der ihn geöffnet hat; `aria-expanded` stimmt |
| UX 4 | Vorlesen: Gruppen ohne Namen, doppelte Ansage | Radiogruppen mit dem Titel als Namen, Pfeiltasten wählen; h1 mit `aria-describedby` auf die Stelle, keine zweite Ansage |
| UX 5, 6 | Zellen-i 40 px, Breiten ohne Funktion | Zellen-i 44 px Ziel; Breiten bleiben Knöpfe wie in der App („Antippen zum Eintippen“) und sagen in der Vorschau, was die App öffnet |
| Typografie 1–4; Vorlagen Typo 2 | graue Titel, graues „?“, Zebra-Titel, Titel zu schmal, 24-px-Stufe | ein weißer Abschnitt je Titel, Satzzeichen und „1“ gehören dazu; Notiz als Rundknopf in der Etikettenzeile, i am letzten Wort; überall 28 px |
| Typografie 5–8; Vorlagen Typo 3–5 | Abstände, Rohwerte unter Tupfen, Leerzeichen, Zwischenetikett | Etikett 6 px über dem Titel, Unterzeile 6 px, Antworten 20 px; „Weiß, Silber …“; geschützte Leerzeichen; Etikett 12/400; Meta 13 px, Zeilen 15 px; „492 mm“ mit kleiner Einheit |
| Material 1–4 | Werkzeuge verdecken den Rahmen, harte Kante, „noch nicht“ in Violett, schwaches Licht | Werkzeuge als senkrechte Glasleiste rechts; dunkle Kante unten; „Weiß ich noch nicht“ gewählt schraffiert (G1); Licht und getöntes Glas wie Schritt 1 |
| Frontend 3, 4; Stationen | 1,67 MB beim Eintritt, Startfoto unsichtbar geladen, Optionsbilder nicht vorgeladen, Stationen wachsen | Bühnenfenster lädt im Leerlauf des Ergebnisses, Startfoto der App nicht mehr; Optionsbilder im Leerlauf; aktive Station über `scale` |
| eigene Prüfung | Maße nach dem Laden geändert (zurück zu Schritt 4) | Bühnenfenster wird mit neuen Maßen neu gesetzt, bei gleicher Art mit den Wünschen von vorher; Fehlerseite im Bühnenfenster bricht nichts |

Selbst entschieden, mit Grund: Das sanfte Schwingen des Modells (`w3dsway`, 9 s) läuft wie in der App weiter, weil der Inhaber ausdrücklich
die Bewegung des Konfigurators sehen will (Bewegung 6 schlug vor, es nach einem Durchlauf anzuhalten). Etikett mit Anker am Flügel
(Material 5) nicht gebaut: Das Modell dreht sich, das Etikett müsste jedem Bild folgen; das gehört in buehne.js und damit in die App.
Doppelte Ersatzbilder zusammenlegen und neu rendern (Frontend 4) nicht gemacht: Sie sind nur noch Rückfall.

### Messwerte Wünsche (live, 390 × 844, 375 × 667, 1280 × 800)

- Alle 28 Fragen live durchgetippt bis „Fenster speichern“ → „Gespeichert“: keine Konsolenfehler, Pille auf jeder Frage bei 774 px (667: 597).
- Ablauf Start bis Teilen: keine Fehler, Layoutsprung 0.
- Bühne beim Weiter: Deckkraft 1,00 in allen zwölf Proben (vorher bis 0,00).
- Tipp bei vierfach gedrosselter CPU: Ring sichtbar nach 26–59 ms (vorher 107–207 ms); danach rechnet die App 93–123 ms.
- Getippte Kachel bleibt dasselbe Element, Übergänge laufen (9 je Tipp); Pfeiltaste wählt die Nachbarkachel.
- Doppeltipp auf Zurück (250 ms): eine Frage zurück. Fokus nach „Alles klar“: am i, `aria-expanded="false"`.
- Startfoto der App: 0 Anfragen; Bühnenfenster beim Eintritt in die Wünsche schon geladen.
- Nach 2,6 s: außen 0 laufende Animationen, im Bühnenfenster 1 (`w3dsway`, die App).
- Rückfall ohne Bühnenfenster: alle 28 Fragen mit Bildern, keine Fehler.

| Bildschirm (Telefon, live) | Neutral % | Violett | Koralle | Indigo | Modell | Farbe gesamt |
|---|---|---|---|---|---|---|
| Welche Form? | 95,7 | 0,6 | 0,0 | 1,5 | 2,2 | 4,3 |
| Welches Material? | 95,8 | 0,6 | 0,0 | 1,4 | 2,2 | 4,2 |
| Welche Farbe außen? | 96,5 | 0,1 | 0,1 | 0,9 | 2,4 | 3,5 |
| Extras fürs Glas? | 96,5 | 0,1 | 0,0 | 0,9 | 2,6 | 3,5 |
| Sonnenschutz außen? | 96,0 | 0,6 | 0,1 | 1,5 | 1,8 | 4,0 |
| Was soll der Fensterbauer übernehmen? | 96,9 | 0,1 | 0,0 | 0,9 | 2,1 | 3,1 |

Bilder: docs/profis/bilder/2026-10-27-konfigurator-wuensche-live-tel.jpg (acht Fragen), -live-desk.jpg, -klein-tel.jpg (375 × 667),
-zustaende-tel.jpg (Ergebnis mit fester Ansicht, „Weiß ich noch nicht“ gewählt, Kapitel-Bogen).

### Änderungstabelle Wünsche

| Änderung | Zweck | Gremium | Stand |
|---|---|---|---|
| Bühne ist die App selbst (Modell, Drehen, Zoom, Haus, Regler, Hinweise) | Funktionen der App, Verständnis | ändern 6:0 / 6:0 / 5:1 (Werkzeuge und Regler zurück) | umgesetzt |
| Kapitelband mit Stationen, Bogen „Direkt zu einem Thema“ | Blickführung | behalten 4:2 / 5:1 / 5:1 | bleibt, Bogen mit denselben Punkten |
| Frage: „Frage 1 von 11“, „Fragen: Üblich ▾“, Notiz-Rundknopf, Titel mit weißem Wort, i am Wort | Verständnis, Marke | ändern 4 / 4 / 4 | umgesetzt |
| Antworten: Anthrazit-Kacheln, Weiß für Eingaben, Punkt/Haken, „Weiß ich noch nicht“ schraffiert und sichtbar | Verständnis, Datenqualität | ändern 4 / 4 / 4 | umgesetzt |
| Fuß fest an derselben Stelle | Blickführung, Abbruch vermeiden | ändern 5:1 / 4 / 5:1 | umgesetzt |
| Antippen zeigt die Wahl am Modell | Verständnis | behalten 4:2 / 6:0 / 5:1 | bleibt, jetzt live |

Neue Wortlaute zur Freigabe: „Schritt 6 · Wünsche“ (Chip ohne Endzahl), „Frage 1 von 11“, „Fragen: Üblich“.

### Offen (Wünsche)

- Das Schwingen des Modells in den Wünschen läuft endlos (App); der Inhaber braucht dazu in der Vorschau nichts.
- Etikett mit Anker am markierten Flügel: Vorschlag für buehne.js (App), nicht in der Vorschau.
- `<em>` heißt in den Wünschen „laut“ (gefragtes Wort weiß), in Messen und Ergebnis „leise“ (zweite Stimme grau, „Höhe <em>links.</em>“);
  einmal entscheiden.
- Farbanteile: Der warme Putz des Modells zählt teils als Koralle (Vorlagen-Abgleich: 9 % auf „Farbe außen“ im alten Stand); ob Pixel oder
  Eindruck zählen, entscheidet der Inhaber.
- Ersatzbilder (nur Rückfall): 21 doppelte Dateien, Markierung dort noch grün.
- Für den Verkauf an Betriebe (Fensterbauer, außerhalb der Liste): Logo des Betriebs im Kopf, in der Anfrage „gewählt“ und „Standard“
  unterscheiden.


## Übernahme in die App: Wünsche (27.10.2026, abends)

Auftrag des Inhabers: „Stell mal den überarbeiteten Konfigurator endlich mal online.“ Entscheidung (die Rückfrage wurde nicht
beantwortet): die Vorschau als Link online (`/vorschau/konfigurator-5269b7215a/`), dann die Folien Abschnitt für Abschnitt in die echte
App, jeder Abschnitt online, sobald die Prüfsuite grün ist. Erster Abschnitt: die Wünsche, weil sie im Live-Betrieb am längsten dauern.

- Rahmen neu (web/assets/app.js, `frageDna`): Kopf der DNA, Kapitelband mit Stationen als Knopf („Kapitel 3 von 7: Material und Farbe.
  Direkt zu einem Thema“), darunter die echte 3-D-Bühne mit Chip „Schritt 6 · Wünsche“, Kopfzeile „Frage 1 von 11“ mit „Fragen: Üblich“
  und Notiz-Rundknopf, Titel 28 px mit weißem Wort und i, Antworten, fester Fuß mit rundem Zurück und einer weißen Pille
  („Weiter“, am Ende „Fenster speichern“). Der Kapitel-Bogen ersetzt die Reiterleiste, Esc und Zurück schließen ihn.
- Antworten nur neu gekleidet (web/assets/app.css, Abschnitt „Wünsche im Look der Design-DNA“): Anthrazit-Kacheln mit den
  Strichzeichnungen der App, gewählt mit violettem Ring, Punkt und Licht; Umschalter, Listen, Zähler und Notiz auf Weiß; Farbtupfen
  44 px; „Weiß ich noch nicht“ schraffiert. Alle `data-act` bleiben, damit Verhalten, Speichern, Preise und Blatt unverändert sind.
- Zifferntasten (eigene Maße in den Wünschen) im selben Rahmen; das Modell bleibt dabei stehen.
- Bühne mit Sonnenschutz: Hinweis und Chip weichen den Sonnenschutz-Knöpfen aus (320 und 390 px geprüft).
- Prüfsuite angepasst, wo sie das alte Markup abfragte (Formen, Kapitel, Kopfzeile, Dock, Zoom); keine Prüfung gestrichen.

Bild: docs/profis/bilder/2026-10-27-app-wuensche-dna-tel.jpg (acht Fragen der echten App, 390 × 844). Alle 46 Fragen in DNA, Pille bei
774 px, kein Querscrollen, keine Konsolenfehler.

Prüfsuite: Abschnitte 20 und 22 (Wünsche, Sonnenschutz) 63 von 63, danach die ganze Suite auf dem mit main zusammengeführten Stand
1.459 von 1.459. Online seit main 1dc67b9. Bekannt und nicht von diesem Abschnitt: „Lamellen wenden“ (WebGL in SwiftShader) schwankt.

## Übernahme in die App: Schritt 1 „Was planst du?“ (27.10.2026, abends)

Die vom Inhaber angenommene Folie (26.10.2026, „Find ich gut“) ersetzt die bisherige Startbühne mit dem schwebenden 3-D-Element; nach
seiner Regel gibt es beim Messen kein 3-D, sondern eine feste Ansicht je Element.

- app.js: `startDna` (Bühne, Frage, Kacheln, Stelle, Fuß), `stZeigen` (Anker, Linie, Licht, Schatten und Rahmen aus den Maßen des
  Bilds), Wischen und Pfeiltasten; die alte Startbühne (`startBuehne`, `startReihe`, `startStelle`, `startWischen`, `START_MASS`) ist
  entfernt, weil sie nirgends mehr gebraucht wird. Aktionen wie bisher: `art`, `situation`, `gloss`, Notiz, `go fotos`.
- app.css: Abschnitt „Start im Look der Design-DNA“; die Regeln der alten Startbühne sind entfernt.
- Bilder: web/bilder/konfigurator/ (Betonbühne und die sechs Renderings als WebP, zusammen etwa 240 KB).
- Wechsel des Elements wie in der Vorschau: Element aus der Wischrichtung, Anker und Etikett blenden (220 und 150 ms), das Licht
  gleitet nach, Tastatur und „weniger Bewegung“ ohne Übergang.
- 320 px: Name am Etikett mit Trennstellen und etwas kleinerem Element; im Kopf „Übersicht“ nur als Zeichen, Zurück und Pille in einer
  Zeile (gilt für alle DNA-Bildschirme, auch Lage und Wünsche).
- Prüfsuite: Start-Prüfungen auf Radiokacheln, Pille und feste Ansicht umgestellt (Abschnitte 3, 6, 16, 20, 22), keine gestrichen.

Bild: docs/profis/bilder/2026-10-27-app-start-dna-tel.jpg.

Prüfsuite: Abschnitte 1 bis 22 grün; „Lamellen wenden“ (WebGL) einmal wiederholt, dann grün. Online seit main d9adb06.

## Übernahme in die App: Schritt 2 „Fotos“ (27.10.2026, abends)

- app.js: `fotosDna` mit `ftPlatz`; Aktionen wie bisher (Foto aufnehmen, `foto-gross` mit Zoom, Neu aufnehmen und Löschen, `ohne-foto`
  mit dem Bogen und „Nicht mehr anzeigen“, `go`); neu nur `foto-auf` (Bühne mit Beispiel öffnet die Kamera für innen) und
  `foto-weg-platz` (Entfernen am Platz, wie in der Vorschau). Die alte Kachel (`photoTile`) ist entfernt.
- app.css: Abschnitt „Fotos im Look der Design-DNA“; Bild `web/bilder/konfigurator/beispiel-innen.webp`.
- Wortlaut wie in der Vorschau: unten immer „Weiter zum Messen“ (neue Öffnung: „Weiter zum Einzeichnen“); ohne Foto kommt erst der
  Bogen. Die Neigung aus der KI steht im Tipp („Dein Foto ist mit 0,8° fast waagerecht. Passt.“).
- Prüfsuite angepasst (Abschnitte 3, 6, 16, 18, 19: 299 von 299).
- Offen: Der Bogen „Mit Foto wird dein Aufmaß besser.“ und die übrigen Bögen tragen noch den alten Look (grünes Wort, Cream-Pille); sie
  folgen als eigener Schritt für alle DNA-Bildschirme.

Bild: docs/profis/bilder/2026-10-27-app-fotos-dna-tel.jpg.

Offen: Messen, Ränder, Ergebnis, Bögen und Abschluss folgen in derselben Weise.

## Schritt 1 neu, Folie für Folie mit dem Inhaber (27.10.2026, spät)

Nach der ersten Übernahme in die App war der Inhaber „überhaupt nicht zufrieden“ (Bühne am Laptop winzig, graue Streifen links und
rechts, Knöpfe zu groß, alte und neue Folien durcheinander). Seitdem gehen wir jede Folie einzeln durch: Er beschreibt, ich zeige ein
Bild ohne Programmierung, erst nach seinem Ja wird gebaut (Regel in .claude/skills/design-dna-eeziframes/SKILL.md, Abschnitt 4).

Seine Wünsche zu Schritt 1, in der Reihenfolge: Kopfzeile, Chip und Hintergrund bleiben; das Element mittig und schwebend, deutlich
größer, zweimal noch größer; „Was planst du?“ in derselben Schrift unter dem Chip; Kacheln kleiner, ohne Lila, minimalistisch; kein
schwarzer Rand („Warum sind die Ränder schwarz?“); der Hintergrund nicht in einem Container, sondern hinter den Kacheln weiter bis in
die weiße Karte. Dazu seine Bilder der sechs Elemente (Fenster, Balkontür, Festverglasung, Hebe-Schiebe-Tür, PSK-Tür,
Faltschiebewand); freigestellt und als WebP unter web/bilder/konfigurator/element/ (die früheren Renderings sind entfernt).

Sein Ja: „Wenn du dann soweit bist stelle das online im aktuellen konfigurator mit allen links auf der folie die passen im echten
konfigurator“. Gebaut genau wie das Bild; was die App dort an Bedienung hat, bleibt: zurück im Kopf, Übersicht, Begriffe, i an der Frage
(„Welches Element passt zu mir?“), Notiz, i am Namen je Element, Kacheln (auch mit Pfeiltasten und Wischen auf der Bühne), die Stelle
mit „Mehr erfahren“ bei „Neue Öffnung“, rechtliche Verweise, zurück und „Weiter zu den Fotos“. Alle einmal angetippt, Telefon und Laptop.

Abweichungen vom Bild, mit Grund: Unter dem Element steht bei der Balkon- oder Terrassentür „Balkontür“ (sonst passen Name, Zusatz und
i nicht in eine Zeile); auf Telefonen unter 375 px fällt der Zusatz weg und die Frage ist 26 px groß.

Am Laptop füllt nur diese Folie den ganzen Bildschirm (`voll` an der Ansicht, Klasse `dna-voll` an html); die übrigen Folien sind
unverändert und kommen einzeln dran.

Bilder: docs/profis/bilder/2026-10-27-app-start-neu-tel.jpg, docs/profis/bilder/2026-10-27-app-start-neu-laptop.jpg.

## Schritt 2 und 3, Folie für Folie (27.10.2026, nachts)

Der Inhaber zu Schritt 2: „die zweite Folie kann genauso wie in diesem Artefakt bleiben“. Die Folie in der App entsprach dem Artefakt
bis auf die Überschrift; jetzt steht wie dort das i neben der zweizeiligen Überschrift und die Notiz rund mit dem Zeichen über dem Wort.

Zu Schritt 3 („Messen“) beschrieb er die Folie so: Überschrift oben in der Bühne wie auf Folie 1; das Element mindestens so groß wie auf
Folie 1; Einzeichnungen und Linien bleiben; der Chip für den Wert unter dem Element; Notiz und die kleine graue Schrift unter der
Bühne; keine Tastatur von Anfang an, erst Antippen des Chips holt die Systemtastatur; mit einem Wert erscheint „Weiter zu Maß 2“, die
Folie bleibt und zeigt das nächste Maß mit neuem Feld. Dazu sein Wort: „Wenn du das verändert hast, dann stellst du das auch online“.

Gebaut auf dem Modul web/assets/messen-dna.js (bisher nur auf dem Arbeitszweig) mit diesen Änderungen; Prüfungen, Rückfragen
(Zentimeter, Warnungen), Großansicht, Lupen und Wege der App bleiben. Die Ränder (Schritt 4) sind nicht Teil seiner Beschreibung und
bleiben, wie sie online sind, bis er die Folie durchgesehen hat. Was ohne echtes Telefon nicht geprüft werden konnte: die Lage der
Pille über der Systemtastatur (iOS und Android rechnen den sichtbaren Bereich verschieden; gebaut mit `visualViewport`).

Bilder: docs/profis/bilder/2026-10-27-app-messen-neu-tel.jpg, docs/profis/bilder/2026-10-27-app-messen-neu-laptop.jpg.

## Schritt 4 „Ränder“ und der Bogen ohne Foto (28.10.2026)

Der Inhaber: „Höhe links, Höhe rechts etc., die anderen ganzen Maße können auch in der Ansicht erstellt werden. Außerdem diese Meldung
‚Mit Foto wird dein Aufmaß besser‘ bitte auch aus dem Artefakt holen.“ Die Ränder laufen jetzt durch dieselbe Folie wie Messen
(Überschrift in der Bühne, Feld unter dem Element mit Systemtastatur, „Hier auch … gemessen?“ unter der Bühne), danach „Passt.“ mit
allen sechs Maßen. Der Bogen ohne Foto ist der des Artefakts (dunkles Blatt, Haken, Häkchen, zwei leise Pillen); seine Funktionen
(Foto machen, ohne Foto weiter, Hinweis abschalten) sind dieselben.

## Schritt 5 „Ergebnis“ (28.10.2026)

Der Inhaber (zum Bildschirmfoto der bisherigen Folie): „Verändere die Ansicht visuell. Ziel ist eine intuitive Darstellung und
Übersichtlichkeit der Eingaben. Fenster darf nicht kleiner werden und die Folie soll ähnlich der Folien sein, in welchen man die Maße
eingeben kann.“ Gebaut wie Messen: Chip und Überschrift in der Bühne, das 3-D-Modell der App unverändert und größer als bisher,
Unterzeile und Notiz unter der Bühne, die Eingaben als weiße Karte, unten zurück und „Weiter: Wünsche“. Gremium eine Runde
(docs/profis/gremium/2026-10-28-konfigurator-ergebnis.md): X gewinnt in allen drei Gruppen; zwei Vetos der Kunden gegen die dunklen
Maßschilder. Umgesetzt: Muss-Punkte und Vetos; offen als Kann: Fenster noch größer (verlangt eine Änderung an der Einpassung des
Modells, die nicht beauftragt ist), Wort „Öffnung“/„Fenster“ im Schild (Schilder würden breiter als das Modell sie einplant), Satz zur
Einbaufuge, Halbsatz, wer die Fotos sieht, Schild „1.760“ unter die Fensterbank.

| Änderung | Zweck | Gremium | Stand |
| --- | --- | --- | --- |
| Überschrift und Chip in der Bühne, wie Messen | Verständnis, Ähnlichkeit | behalten (alle) | bleibt |
| Bühne randlos, 390–460 px nach Bildschirmhöhe, Szene 54 px tiefer | Fenster nicht kleiner, Karte sichtbar | ändern: Karte ganz über dem Fuß | geändert |
| Maßschilder in der Farbe ihrer Linie (Koralle, Violett), Linien 3 px mit Saum | Zuordnung Linie ↔ Maß | 2 Vetos gegen dunkle Kapseln | geändert |
| Werkzeuge dunkel und deckend wie „Groß ansehen“ | Erkennbar drückbar | ändern 4:2 (Gestalter) | geändert |
| Karte: Kopf mit Name und Chip, Zahlen mit „Breite“/„Höhe“ darunter, beide 32 px | Übersicht der Eingaben | ändern (Kunden), gleich groß (Typograf) | geändert |
| Zeile „Am Modell die Mitte; es zählt das kleinste.“ | Kein Zweifel 1.790 gegen 1.788 | Muss (Kunden, Fensterbauer) | neu |
| „Breite und Höhe vertauscht?“ über der Karte | Datenqualität, Pille steht schon oben | eigene Entscheidung | neu |
| „Aus deinen Fotos“ als Zeile, „Falls zur Hand“ als Anthrazit-Karte | Ruhe | behalten | bleibt |
| Fuß mit runder Zurück-Taste und Pille, fest unten | Hauptaktion in der Daumenzone | behalten (alle) | bleibt |
| Laptop: Bühne links über die ganze Höhe, stehend beim Scrollen | Schreibtisch | behalten | bleibt |

## Lage ohne Schraffur (28.10.2026)

Der Inhaber (zu zwei Bildschirmfotos der Folie „Wo ist das Fenster?“): „Hier die gestrichelten Linien weg, dann diese lilanen Leuchten
weg und den Knopf mit der Auswahl in welchem Geschoss nicht weiß.“ Auf Nachfrage: gemeint ist die Schraffur (schräge Streifen), der
gewählte Knopf soll weiß gefüllt sein. Umgesetzt: keine Schraffur im Haus und in der Karte „Genau gleiche Fenster“, kein violettes
Leuchten (Bühne und Anzahl), das gewählte Stockwerk leicht aufgehellt, die Erde dunkler, der gewählte Stockwerk-Knopf (und „1. OG“ usw.)
weiß mit schwarzer Schrift. Das Koralle-Licht am Fenster bleibt (es ist nicht violett); „bodentief“ in der weißen Brüstungskarte bleibt
violett, weil Weiß dort verschwände.

## „Gespeichert“ (28.10.2026)

Der Inhaber (zum Bildschirmfoto der bisherigen Seite): „Auch diese Seite sollst du visuell verbessern. Ziel ist eine intuitive Ansicht
und einfache Bedienbarkeit für Nutzer. Die Menüführung der vorherigen Folien dient als Anlehnung.“ Wahl: Kopf, Chip, Überschrift mit
zweiter Stimme und Fuß wie die Folien davor; der Boden im Fensterlicht vom Start als Bühne (Anfang und Ende eines Fensters auf demselben
Boden); die beiden Wege nach vorn als Zeilen in einer Karte, alles zu diesem Fenster als Kacheln darunter. Keine Gesamtübersicht (Regel
des Inhabers): die Aufteilung als Symbol, keine Maße, keine Wünsche. Gremium eine Runde (docs/profis/gremium/2026-10-28-konfigurator-
gespeichert.md): X gewinnt in allen drei Gruppen, drei Vetos, alle aufgelöst.

| Änderung | Zweck | Gremium | Stand |
| --- | --- | --- | --- |
| Kopf, Chip „✓ Gespeichert · Position n“, „Küche gespeichert.“ | Menüführung wie die vorigen Folien | behalten (alle) | bleibt |
| Bühne: Boden im Fensterlicht, gespeicherte Aufteilung als Strichzeichnung | „gespeichert“ auf einen Blick, das eigene Fenster | Veto gegen das Musterfenster | geändert |
| Dunkler Verlauf hinter der Schrift, Spalte am Laptop deckend | Kontrast 4,5 : 1 | Veto (Gestalter) | neu |
| „Wie geht es weiter?“: Weiteres Fenster (+), Alle Fenster ansehen | die zwei Wege ohne Scrollen | behalten | bleibt, Texte geschärft |
| „Alle Fenster im Haus erfasst?“ über der Pille, „Zum Aufmaßblatt · n Fenster“ | keine halben Häuser | Veto (Fensterbauer) | neu |
| Maße/Wünsche als Kacheln, Kopieren breit „nur für baugleiche Fenster“ | einfache Bedienung, Datenqualität | Muss (Fensterbauer) | geändert |
| „Fenster löschen“ abgesetzt als leise Pille | niemand löscht aus Versehen | Muss (Kunden) | geändert |
| Änderungsgrenze als Zeile, zählt sie: über den Kacheln in Koralle | Frist klar | behalten | bleibt |
| Themen als leise Chips | Sprung zum Kapitel | behalten | bleibt |
| Laptop: Bühne links stehend, Spalte rechts, Pille unten fest | Schreibtisch | ändern: Spalte deckend | geändert |

## Laptop wie die Start-Folie (28.10.2026)

Der Inhaber: „Außerdem musst du die Browseransicht bei allen Folien verbessern. Als Vorbild nimmst du die Folie, wo man das Element
auswählt, welches man konfigurieren will.“ Bestand am Laptop (1440 × 900): Start, Messen, Ränder, „Passt.“, Ergebnis und Gespeichert
füllten den Bildschirm schon; Fotos, Lage, „Wie genau planen?“ und die Wunsch-Fragen standen als schmale Telefonspalte in der Mitte.
Umgesetzt für diese vier: Kopf 60 px fest, links die Bühne über die ganze Höhe (Foto füllt, Haus wächst mit, Punktraster 1,45-fach,
3-D-Modell füllt), rechts die Spalte von 380 px mit Frage, Karten und fester Pille. Am Telefon pixelgleich (Bildvergleich vorher/nachher
bei 390 × 844: 0 Pixel Unterschied). Noch nicht so: die Liste der Fenster und die Anfrage-Seiten; sie sind noch nicht überarbeitet und
bekommen die Ansicht mit ihrer Überarbeitung.


## Restliche Folien und Bögen (28.10.2026)

Der Inhaber: „Die anderen Bereiche machst du auch. Musst selber gucken, welche Folien da noch fehlen.“ Bestand: Alle Schritte des
Konfigurators waren neu, nicht aber, was davor und danach kommt. Gefunden und in vier Paketen umgesetzt (Bilder:
docs/profis/bilder/2026-10-28-app-restliche-folien-tel-a.jpg, -tel-b.jpg, -laptop-a.jpg, -laptop-b.jpg):

| Nr. | Folie | Was neu ist | Zweck |
| --- | --- | --- | --- |
| 1 | Deine Fenster | Bühne mit den Fenstern als Strichzeichnungen, Titel, Stand mit Balken, Karten auf Anthrazit, eine Pille | Blickführung, Marke |
| 2–4 | Fürs Angebot 1–3 | Haus mit Kapselreihe der getauschten Fenster; Zeitleiste und Budget; Aufmaßblatt, das sich beim Tippen füllt | Verständnis |
| 5, 9 | Aufmaßblatt | Blatt im Fensterlicht als Bühne, gesperrt mit Schloss und Preis, nach dem Kauf offen | Vertrauen |
| 6–8, 10 | E-Mail, Kasse, Freigeschaltet, Sichern, Konto, Anmeldelink, Gesendet | Gemeinsamer Rahmen um den bisherigen Inhalt (Rechtstexte, Felder, Häkchen unverändert) | Vertrauen, Technik |
| 11 | Wunschmaße (neue Öffnung) | Rahmen der Ergebnis-Folie, Maße auf weißer Karte, − / + als Rundknöpfe | Verständnis |
| 12 | Einzeichnen | Foto im eigenen Format als Bühne, Rahmen und Ecken violett, Werkzeuge als leise Pillen | Blickführung |
| 13 | App-Start ohne Fenster | Foto der Waschbären mit Glas-Chips, ein Titel, Führung als leise Pille, Modell, drei Stationen | Marke, Blickführung |
| 14–16 | Führung | Bühne mit Modell, Fotos oder Aufmaßblatt; Auswahl wie die Wünsche; „Gut zu wissen“ auf Anthrazit | Marke |
| 17–18 | Bögen (Übersicht, Begriffe, Erklärung, Notiz, Verlassen, Großansicht) | nur CSS: Palette, Etikett mit Punkt, zweite Stimme Silbergrau, weiße Pille | Marke |

Alle mit Laptop-Raster wie die Start-Folie; am Laptop rechnen die Chips mit der rechten Spalte (380 px), sonst wurden Beschriftungen
abgeschnitten. Grün kommt nicht mehr vor (Haken violett). Bewusst nicht angefasst: die Einladungsseite eines Betriebs im Kundenlink
und die Bildschirme in Instanzen auf der Website eines Fensterbauers (eigene Marke des Betriebs); das Aufmaßblatt selbst (blatt.js).

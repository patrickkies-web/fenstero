# Ratgeber, Wissen für Fensterbauer, Rechtstexte und Fehlerseite in der Design-DNA, 28.10.2026

## Auftrag

- **Bereich:** alle Seiten, die die Bestandsaufnahme (docs/profis/2026-10-28-altes-design.md) als altes Design führt, soweit sie nicht
  zum Konfigurator gehören: 24 Ratgeber, 5 Seiten Wissen für Fensterbauer, 7 Rechtstexte und die Fehlerseite (37 Seiten).
- **Wunsch des Inhabers:** „visuell stark ansprechend“ und intuitiv; Ratgeber einheitlich, Inhalte so lassen, wie sie sind; Links und
  Wege prüfen. Konfigurator und Seiten im neuen Design bleiben, wie sie sind.
- **Was der Besucher tun soll:** die Antwort lesen und dann messen (Hauseigentümer) bzw. die Pakete ansehen (Fensterbauer).
- **Erfolg:** eine volle Pille je Bildschirm, am Telefon im unteren Drittel; Text Wort für Wort gleich; alle Wege führen auf Seiten im
  neuen Look; Prüfsuite grün.

**Wahl (drei Zeilen):** Eine Vorlage für alle Leseseiten, gebaut wie die Startseite (drei Szenen mit Vorhang, dunkel, hell, dunkel),
weil der Inhaber genau diese Seite mag. Gepflegt aus zwei Generatoren (`scripts/ratgeber-bausteine.mjs`, `scripts/recht-bausteine.mjs`),
damit die Seiten einheitlich bleiben und die Prüfsuite jede Seite gegen ihren Bau prüfen kann. Die Zeichnungen der Seiten tragen die
Bühne; Fotos und Platzhalter der früheren Bildsprache fallen weg.

## Ablauf

1. Bestand: alle 37 Seiten in voller Länge (Telefon 390 × 844, Schreibtisch 1280 × 800), Inhalte und Links aufgenommen.
2. Vorschau gebaut (docs/profis/ratgeber-vorschau/), in die Website übertragen, Rechtstexte und Fehlerseite umgebaut.
3. Gremium `profis` eine Runde, drei getrennte Agenten, blind X/Y (gelost: X = neu, Y = alt), 18 Änderungen zur Abstimmung.
4. Vier Detail-Profis (Bewegung, Zeichen, UX, Typografie) und der Abgleich mit den zwölf Vorlagen in drei Perspektiven (Material und
   Licht, Typografie, Frontend und Leistung), je ein getrennter Agent.
5. Alles umgesetzt in einem Durchgang (Master-Anhängsel: „Alles umsetzen, keine zweite Runde“); wo sich Urteile widersprechen,
   entscheidet die Vorrangregel (Kunde vor Fensterbauer vor Gestaltern), sonst die DNA. Danach gemessen und die Prüfsuite.

Hinweis: Der Begleit-Skill nennt seit dem 26.10.2026 „Detail-Profis und Vorlagen-Abgleich entfallen, sofern er sie nicht nennt“. Der
Inhaber hat sie in diesem Auftrag ausdrücklich verlangt (Master-Anhängsel), deshalb liefen sie.

Alle Stimmen sind simuliert; es ist keine Marktforschung. Echte Antworten bringt erst der Realitäts-Check unten.

## Urteile

| Gruppe | Gewinner | Hände | Median | Faust, Veto | Muss-Punkte |
| --- | --- | --- | --- | --- | --- |
| Gestalter | X 6:0 | 4, 3, 4, 4, 4, 4 | 4 | keine | „Du bist hier“ nicht als weiße Pille; Weichzeichner der Leiste raus; Outfit in den Zeichnungen; Fokusring mit Bild belegen |
| Kunden | X 5:1 (Kai, Störrolle, Y) | 3, 4, 3, 4, 3, Faust | 3 | Kai: Faust und Veto zu 11 (drei Preise ohne Erklärung) | Preis neben „kostenlos“ (Renate, Gisela); Verzeichnis nummeriert (Murat, Thomas); Warnung unterscheidbar (Sabine) |
| Fensterbauer | X 6:0 | 4, 5, 4, 3, 4, 4 | 4 | Tobias Reuter: bedingtes Veto (8 und 9) | Fehler lauter; „Für Fensterbauer“ im Fuß zuerst; Messskizze gerade |

Verständnis der Kunden bei X: Was ist das 5/6, was kostet es 3/6, was tue ich 5/6 (Y: 5/6, 2/6, 4/6). Fensterbauer (Median):
seriös 4, verständlich 4, Kunden zumuten 4, Weg zu „Für Fensterbauer“ 3, zeigen 3,5, kaufen 3.

Mehrheit „ändern“: Nr. 6 (Verzeichnis, Kunden), 8 und 9 (Hinweise, Tabellen und Listen, Fensterbauer), 11 (Weg, Gestalter und Kunden),
13 (Fuß, Fensterbauer). Keine Änderung hatte eine Mehrheit „zurück“.

Einzelberichte: docs/profis/gremium/2026-10-28-ratgeber-dna-{gestalter,kunden,fensterbauer}.md, Detail-Profis
`-bewegung`, `-zeichen`, `-ux`, `-typografie`, Vorlagen `-vorlagen-material`, `-vorlagen-typografie`, `-vorlagen-frontend`.

## Änderungstabelle (Umbau nach dem Gremium)

| Wo | Was | Warum |
| --- | --- | --- |
| Einstieg aller 23 Ratgeber im Weg und Übersicht | Preis direkt unter der ersten Pille: „Messen ist kostenlos; das Aufmaßblatt als PDF kostet 7,99 €, über den Link deines Fensterbauers nichts.“ (Satz aus den Ratgebern, Betrag aus `web/config.js`; nach dem Stichtag setzt `functions/seo.js` 12,99 € ein) | Kunden: „Was kostet es?“ nur 3/6; Faust von Kai; Muss von Renate und Gisela |
| Titel | zweite Stimme ab „: “ oder „? “ (sonst das letzte Wort), Text gleich; Übersicht „In sechs“ gebunden | Typografie: das Suchwort steht vorn in Weiß, die zweite Stimme trifft kein Zufallswort |
| Kopf und Leiste | deckend Schwarz ohne `backdrop-filter`; nach Sprüngen und mit Tastaturfokus ohne Gleiten; ruhige Fassung blendet; Rundknopf „Auf dieser Seite“ in der zurückkehrenden Leiste unter 1024 px | Muss von Tobias Lenz; Bewegung; UX: am Telefon kein Weg zurück zum Verzeichnis |
| Szenen (ratgeber.js) | Vorhang-Höhe aus 100lvh-Sonde und ResizeObserver, `top` am Element; Lesen klebt erst eine Bildschirmhöhe vor dem Ende; überholte Szene mit Deckkraft 0 (nicht `visibility`, damit Tastatur und Bildschirmleser sie behalten); Fokus unter dem Vorhang rückt frei; `touchstart` für `:active` auf dem iPhone | Frontend: Zeichenzeit beim Scrollen etwa −85 %; Bewegung und UX: WCAG 2.4.11 |
| Lesetext | auf Hell ein dunkler Ton aus Textgrau und Schwarz (etwa 10:1 statt 5,5:1), Prosa 33em (etwa 74 Zeichen), Zeilenabstand 1,55/1,6, `text-wrap: pretty`, Silbentrennung in Titeln | UX, Typografie, Kunden (Fließtext dunkler), Fensterbauer |
| Schriftskala | Etiketten 14 px (vorher 12); Zwischentitel und Ende eine Größe 30/40 (vorher 28/38 gegen 30/40); Hinweis und Antwort 17; Tabellenziffern | Kunden (Etiketten zu klein, Vorrang Kunde vor DNA-Wert 12); Typografie |
| „Auf dieser Seite“ | Abschnitte nummeriert wie „Abschnitt N von M“, Fragen und Weg nach Haarlinie ohne Nummer; Einträge dunkler, 17/16 px; kein Gewichtswechsel | Kunden Nr. 6 (Mehrheit „ändern“), Thomas: 8 gegen 10; Bewegung |
| Etikett je Abschnitt | „Abschnitt N von M“ als Chip in Indigo mit violettem Punkt | Zeichen (zu viele violette Punkte), Material (Zustand als Material, Farbe in der Lesestrecke) |
| Hinweise | Kachel mit Licht von unter der Kachel statt Eckfleck; Text heller Ton; „Häufiger Fehler“: weißes Etikett, größerer Punkt in Koralle, erster Satz kräftig | Veto Tobias Reuter (8), Muss Sabine; Typografie (Text über dem Leuchten 3:1) |
| „Typische Fehler“ | Liste mit Kreuz im dunklen Ton der Koralle, Zeilen in Tinte | Veto Tobias Reuter (9) |
| Schritte, Selbstcheck | Ziffer im Ring statt schwarzer Scheibe; Selbstcheck mit Listenpunkten statt Ringen | Zeichen, Typografie (G13, G15); Kunden und UX: Ringe sahen aus wie Ankreuzfelder |
| Tabellen | Zahlzellen in Tinte mit kleiner Einheit, Ergebnis („es zählt“) als Zahl 300 in 28 px; am Telefon Spaltentitel und Wert in einer Zeile | Typografie-Vorlagen: die Antwort wird als Zahl sichtbar, Tabellen etwa 40 % kürzer |
| Fragen | Plus-Knopf auf Anthrazit, Fokusring an `summary`, Antwort blendet in 220 ms ein; im Druck offen | Zeichen, UX, Bewegung, Frontend |
| Weg | alle Stationen gleich (kein „erledigt“), „Du bist hier“ als Indigo-Marke ohne Link auf sich selbst, `aria-current` am Ziel | Mehrheit „ändern“ (Gestalter und Kunden), Muss Jonas; Kai: „grau heißt erledigt? Hab nichts gemacht“ |
| „Nächster Schritt“ | Blatt tritt oben aus der Karte, Licht darunter, Pfeilkreis auf der Kartenecke, Etikett mit offenem Ring; Chip „Beispiel“ in Koralle über Zeichnungen mit Beträgen; Linkname Etikett und Titel; Bild ohne `lazy` | Kai (Pflicht für Konsent), Material, Zeichen, UX |
| Weiterlesen, Belege | gerader Pfeil statt schrägem; Belegnummern 14 px mit Polster (etwa 24 px Ziel); in den Quellen „zurück zum Text“ zur ersten Stelle | UX (schräger Pfeil heißt „andere Seite“), Kai |
| Volle Pillen im Text | jede volle Pille mit Pfeilkreis | Mara: Pillen in der hellen Szene sahen nach Nebensache aus |
| Fuß | „Für Fensterbauer“ als erste Gruppe (auch in der Reihenfolge für Tastatur und Bildschirmleser); in Rechtstexten und Fehlerseite ergänzt, eigene Seite markiert; Druck 0,97 auf „Vertrag widerrufen“ | Mehrheit „ändern“ (Fensterbauer), Muss Sarah und Petra |
| Zeichnungen | gerade (0°) und am Telefon größer; Outfit als eingebettete Teilmenge je Datei (vorher Arial); Kleinbilder ohne Schrift mit kräftigen Strichen für die Übersicht, dort 96 px | Muss Klaus und Daniel; Frontend (grauer Brei bei 76 px) |
| Übersicht | Ziffer als einziger Held mit „von 6“, Titel 500, Etikett „Schritt N von 6“ fällt weg (Bildschirmleser hören es weiter) | Typografie (zwei schwere Elemente) |
| Schriften und CSS | Outfit und Wortmarke (Teilmenge von Inter, 2,3 KB statt 48 KB) direkt in der Gestaltung, Ersatzschrift in Outfit-Maßen; aus `bundle.css` nur, was gebraucht wird, ohne Kommentare (68 KB → 44 KB, gzip 9 KB); Prüfsumme in der Adresse und ein Jahr Zwischenspeicher | Frontend: Pille sprang beim Schriftwechsel 24 px (CLS 0,162), zwei blockierende Anfragen weniger |
| Druck | Einstieg ohne Mindesthöhe, Fragen offen, Adressen der Quellen | Frontend |
| Rechtstexte | Spalte 580 px, Lesetext dunkel und 17 px, Haarlinie statt Punkt über den Abschnitten, Etikett 6 px über dem Titel, „Kurz gesagt“ als dunkle Kachel mit Licht von unten, am Schreibtisch liegt das Blatt auf der Bühne; „Auf dieser Seite“ bei AGB, Datenschutz, Paketbedingungen (Text wörtlich gleich) | Zeichen, UX, Typografie, Material; Gisela fand in den AGB, was sie suchte |
| Widerruf | Feldrand in Textgrau (3:1 statt 2,5:1), Fokus 2 px mit Abstand, Fehlermeldungen per `aria-describedby` am Feld | UX (WCAG 1.4.11; gesetzliche Funktion § 356a BGB) |
| Fehlerseite | gerades Sprossenfenster statt Trapez; am Telefon erst Etikett und Titel, dann Bild (kleiner), dann Text und Pillen; Punkt in Koralle; Abstände 6/12/32 | Klaus, Jonas („wie Pfusch“, „wie ein Renderfehler“); Kunden: Satz zuerst; UX: Handlung auf kleinen Telefonen |
| Prüfsuite | Schriftskala neu (13–120, ohne 12 und 38); Preisprüfung und Tabellenprüfung lassen das geschützte Leerzeichen zu; neue Prüfung: Rechtstexte und Fehlerseite so, wie `recht-bausteine.mjs` sie baut | Werte geändert, keine Prüfung abgeschaltet |

### Bewusst anders entschieden

- **Leiste 320/220 ms** bleibt (DNA), nicht 240 ms (Noah als Gestalter); der Detail-Profi Bewegung hat 320/220 bestanden.
- **Zeichnung gerade** statt schräg: Fensterbauer (Muss) vor Gestaltern und Material (Vorrangregel).
- **Kein Pfeilkreis „Zeichnung groß“** am Einstiegsbild (Material): er hätte die rohe SVG-Datei geöffnet; stattdessen ist die Zeichnung
  am Telefon größer.
- **Kein „erledigt“ im Weg** und keine grau gefüllten gelesenen Abschnitte (Zeichen): Kunden lasen grau als „schon getan“.
- **Etiketten 14 px** statt 12 (Typografie): Kunden zuerst.
- **Ausgeblendete Szene mit Deckkraft 0** statt `visibility: hidden` (Frontend): sonst fehlten Titel und Pillen für Bildschirmleser.

## Messwerte (nach dem Umbau)

| Messung | Ergebnis |
| --- | --- |
| Erste volle Pille am Telefon (mit Band, 30 Seiten) | 583–785 px oben, unten höchstens 837 px: alle im unteren Drittel (ab 563) und im ersten Bildschirm |
| Volle Pillen je Telefon-Bildschirm | höchstens eine (Artikel, Übersicht, Uw-Wert, Erstaufmaß, AGB, Widerruf, Fehlerseite) |
| Layoutsprung (CLS), 4× gedrosselt | 0 auf Artikel, Übersicht, AGB, Fehlerseite |
| Laden Artikel, 4× gedrosselt | 345 ms; eine lange Aufgabe (148 ms); zwei Schriften (Outfit, Wortmarke) |
| Filter auf Flächen, lazy Bilder im Einstieg | 0 / 0 |
| Animationen nach 2,6 s | 0 |
| Ruhige Fassung, ohne JavaScript | Titel, Pillen, Zeichnung und Text stehen sofort, kein Querscrollen |
| Ziele unter 44 px | 0 (Links im Fließtext ausgenommen, WCAG 2.5.8) |
| Konsolenfehler | 0 |
| Fokus | Ring 2 px sichtbar an Pille, Frage, Verzeichnis; Umschalt+Tab unter den Vorhang legt das Ziel frei (gemessen) |
| Inhalt gegen den Stand vor dem Umbau | 28 von 37 Seiten mit identischem Wortbestand plus Navigation; bei 9 ändern sich nur erzeugte Zahlen (Lesezeit, Zähler) und die Navigation der Übersicht; kein Wort des Textes fehlt |
| Links | 43 interne Ziele und alle Sprungmarken in Ordnung; 124 externe Quellen: 122 erreichbar, 2 sperren Prüfprogramme (TÜV Süd 403, dejure.org 503) und sind von Hand zu prüfen |

### Farbtabelle (nächste der acht Farben, Telefon)

| Seite | Neutral | Violett | Koralle | Indigo | Foto | Farbe gesamt | vorher |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fenster ausmessen | 99,2 | 0,1 | 0,2 | 0,6 | 0,0 | **0,8** | 0,2 |
| Übersicht | 99,4 | 0,2 | 0,1 | 0,3 | 0,0 | **0,6** | 0,2 |
| AGB | 100,0 | 0,0 | 0,0 | 0,0 | 0,0 | **0,0** | 0,0 |
| Fehlerseite | 98,9 | 0,0 | 0,0 | 0,0 | 1,0 | **1,1** | 4,6 (Trapezfenster, Rahmen und Himmel) |

Je Bildschirm im Artikel: Lesebildschirme 1–2,3 %, sieben von 16 Bildschirmen ohne Farbe. Die DNA nennt etwa 7 %; auf Leseseiten ist
das nur mit Farbfläche oder Leuchten hinter dem Text erreichbar, beides verbietet sie. **Abweichung, Entscheidung beim Inhaber** (siehe
offene Punkte).

## Prüfsuite

`node scripts/pruefen.mjs` vollständig: Ergebnis im Abschnitt „Stand der Prüfsuite“ unten.

## Offene Punkte

1. **Konfigurator beim Fensterbauer** (Startbildschirm in drei Paketen, „So funktioniert es“, Impressum und Datenschutz des Betriebs,
   Fehler- und Zustandsseiten, Signature-Dashboard) bleibt im alten Look, wie beauftragt („den Konfigurator … lässt du, wie sie sind“).
   Die Bestandsaufnahme führt ihn als größten offenen Bereich; die Instanz-Rechtsseiten tragen die neutrale DNA-Form schon.
2. **E-Mails** (Supabase-Vorlagen, Mails des Servers) und die **zwei alten Vorschauen** unter /vorschau/ sind nicht berührt.
3. **Farbanteil** unter dem Ziel der DNA (siehe Farbtabelle): Ausnahme „Lesestrecke 1–2 %, Seitenmittel um 1 %“ freigeben oder mehr
   Licht in Einstieg und Ende wünschen.
4. **Maßzeichen der Zeichnungen** vereinheitlichen (Zeichen-Profi): ein Zeichen mit Endstrichen; Farbregel Öffnung Koralle / Fenster
   Violett wie Startseite, oder umgekehrt wie Aufmaßblatt und DNA Abschnitt 9. Braucht sein Wort.
5. **Fehlerseite „Zum Ratgeber“** als dritter Knopf und **eine Beschriftung für „ausmessen“** (heute fünf Fassungen) sind neuer Text:
   nur auf sein Wort.
6. **Zwei externe Quellen** (TÜV Süd, dejure.org) sperren Prüfprogramme; im Browser von Hand öffnen.
7. **Realitäts-Check** (unten) mit zwei, drei echten Menschen.
8. Online geht nichts ohne sein Ja; alles liegt auf dem Arbeitszweig `claude/bestand-altes-design`.

## Realitäts-Check (Fragekarte)

Zwei bis drei echte Menschen (ideal über 65 ohne Technikgewohnheit, dazu ein Fensterbauer), fünf Minuten, keine Hilfe. Am Telefon
die Seite „Fenster ausmessen“ öffnen:

1. „Was würdest du jetzt tun?“ (wörtlich notieren)
2. „Was kostet das?“
3. „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“
4. „Wo legst du den Zollstock an?“ (nach dem Abschnitt „Schritt für Schritt“)
5. Fensterbauer: „Würdest du diese Seite deinem Kunden schicken?“

Kalibrierung: Weicht eine Person des Gremiums dreimal gleichgerichtet von den echten Antworten ab, wird ihre Eigenart im Skill angepasst.

## Bilder

- Telefon, erste Bildschirme (Artikel, Übersicht, AGB, Fehlerseite): `docs/profis/bilder/2026-10-28-ratgeber-dna-telefon.jpg`
- Schreibtisch, erste Bildschirme: `docs/profis/bilder/2026-10-28-ratgeber-dna-schreibtisch.jpg`
- Artikel am Telefon ganz: `docs/profis/bilder/2026-10-28-ratgeber-dna-artikel-telefon-ganz.jpg`
- AGB am Telefon: `docs/profis/bilder/2026-10-28-ratgeber-dna-agb-telefon.jpg`
- Vorschau zum Durchklicken (privat): https://claude.ai/artifact/SBbZTRC2rT29e1hDRLZXFo

## Antwort des Inhabers

(offen)

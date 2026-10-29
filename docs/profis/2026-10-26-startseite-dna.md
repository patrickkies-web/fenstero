# Profis · Startseite (Ansicht Hauseigentümer) nach Design-DNA und Palette „Task-App dunkel“ · 26.10.2026

Umfang: Groß (ganze Seite vom Kopf bis zum Fuß): Gremium, Umbau, Abnahme. Drei Agenten je Runde, blind (X = heute, Y = neu). Vorschau als Artefakt, Quelle in docs/profis/startseite-dna-vorschau/, nichts online.

## Auftrag

- Bereich: Startseite https://eeziframes.com, Ansicht Hauseigentümer (Kunden), Kopf, Hero, alle Abschnitte, Fuß. Die Ansicht Fensterbauer bleibt unberührt.
- Wunsch des Inhabers: intuitive Bedienung, visuell ansprechend, gestalterisch nach dem Skill `design-dna` (Schnitt aus seinen Vorlagen) und mit der Farbpalette „Task-App dunkel“ (acht Farben, Anteile vorgegeben, Violett führt, eine volle Pille je Bildschirm nie farbig, Leuchten nur radial, Szenen im Wechsel dunkel/hell). Vorerst als Vorschau. Dazu ein Prompt für ein KI-Foto im Hero.
- Der Besucher soll in drei Sekunden verstehen: Fenster selbst ausmessen, Messen kostet nichts, Aufmaßblatt 7,99 €; „Jetzt konfigurieren“ antippen. Fensterbauer finden ihre Ansicht.
- Erfolg: Kunden tippen; Fensterbauer trauen der Firma den Konfigurator zu.

Modus: Persuade. Referenz: die Seite für Fensterbauer (Anmutung ruhig, präzise, lichtvoll) und die Musterseite der Design-DNA (Familientest).

## Ist und Neu

- X (heute): scratchpad `ist/tel-01…07.png`, `ist/desk-01…07.png` (Fassung 5 „Startseite neu gedacht“, online).
- Y (Runde 1): scratchpad `neu/r4/tel-01…11.png`, `neu/r4/desk-01…10.png`, `tel-leiste.png`. Quelle: docs/profis/startseite-dna-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css mit der Palette, dna/bundle.css und bundle.js unverändert aus dem Design-System, start.css und start.js mit Präfix ez-).
- Material: Foto des Inhabers (`web/bilder/foto/start-hauseigentuemer.webp`, als Platzhalter für das neue Hero-Foto nach `hero-prompt.md`), Renderings aus dem 3-D-Modell (`web/bilder/startseite/reihe/`, `so/`), Aufmaßblatt Weber (`web/bilder/fensterbauer/aufmassblatt-weber.webp`), Foto von innen aus der Vorschau vom 25.10. Schriften Outfit und Doto (OFL) nur für die Vorschau in `fonts/`, die Wortmarke bleibt Inter.

## Befund (ultimativ-webdesign, Schritt 3)

1. Muss · Farbe: Die Palette des Inhabers ersetzt #161616, Cream und Grün; Violett wird Hauptwert, Koralle zweiter Wert, Indigo Chip und Hover.
2. Muss · Blickführung: Der Held im Kopf war das Foto allein; nach der DNA trägt das Gerät als Objekt die Szene, Werte hängen an der Sache (G4, G9).
3. Muss · Handlung: eine volle Pille je Bildschirm, nie farbig; Kopfzeilen-Pille Umriss (Gremium 25.10.).
4. Muss · Bewegung: die Endlos-Laufbänder (44 s, 60 s) verstoßen gegen „nichts läuft länger als 5 s“; Ersatz durch ein lebendes Bento (G8), das am Scrollen hängt.
5. Muss · Hierarchie: Pilotphase-Band und Preis-Zeile konkurrieren auf Bildschirm eins; Kunden hatten es am 25.10. abgelehnt.
6. Kann · Szenen: Die Seite wird eine Folge aus fünf Szenen mit Vorhang, dunkel/hell im Wechsel (DNA, Bewegungs-Gen 3).
7. Kann · Zahl als Held: 7,99 € groß im dünnen Schnitt in einer Leuchtkachel (G3), 219 RAL-Farben als Leuchtkachel im Bento.
8. Kann · Feinzeichnung: Messband, Schraffur in der Zeichnung, Punktraster auf der Preiskachel, gestrichelte Etikettlinien (G1, G5).
9. Kann · Schrift: Outfit für alles, Doto für die eine Punktzahl je Bildschirm (Messwert auf dem Handy); Wortmarke bleibt Inter (Marke vor DNA).
10. Kann · Schriftfenster „eeziframes“ als Pause vor der Karte für Fensterbauer (Bewegungs-Gen 10); in designrichtung.md nur auf Wunsch, hier durch den DNA-Auftrag gedeckt, leicht zu streichen.

## Ideenmatrix und Richtungen

Je Szene die Gen-Fragen (weich/präzise, welcher Wert leuchtet, welche Zahl, worauf sieht man es, was misst man, welche Handlung, welches Material, welche Teile, wo gehört der Wert hin, was ist Fakt):
- Hero: Handy auf dem Foto, Etikett am Zollstock, Bildpille im Satz, Schein als Licht des Bildschirms, Messband, Chips der Wünsche.
- Konfigurator: Bento aus Renderings, 219 als Leuchtkachel, Punktraster für Formen, lebendes Raster, Rundfenster als Kreis, Holz als Material.
- So geht es: Stationen, Zeichnung mit Etiketten, Farbwahl als Pillen, Blatt mit Etikett, Skala zum Ziehen (verworfen: die App fragt Zahlen ab, ein Band täuscht), Foto mit Sucherrahmen.
- Aufmaß und Preis: Blatt gekippt mit drei Etiketten, 7,99 € dünn und groß, Chip Einführungspreis in Indigo, Punktraster, 0 € als Koralle (verworfen: zwei Zahlen konkurrieren).
- Schluss: Schriftfenster, weiße Karte in der dunklen Szene mit schwarzer Pille, Fuß in drei Spalten.

Drei Richtungen: naheliegend = Musterseite der DNA auf eeziframes übertragen (Gerätebühne, Bento, Stationen); mutig = das Fenster als einziges Objekt, an dem alle Werte hängen, die Seite scrollt durch ein Fenster; überraschend = 1.409 mm als Riesenzahl über dem Foto, der Preis als Punktzahl. Gebaut: die naheliegende mit den stärksten Teilen der anderen (Werte an der Sache im Hero und am Blatt, Bildpille im Satz, Schriftfenster). Die beiden anderen stehen dem Inhaber als Wahl offen.

## Szenen und Gene

1. Dunkel · Kopf und Hero: G4 Gerät als Objekt, G9 Wert an der Sache, G10 scharf vor unscharf, G1 weich (Schein, Foto) gegen präzise (Strichlinie, Messband), G6 eine Pille.
2. Hell · Konfigurator: G8 zerlegen und neu ordnen (lebendes Bento), G3 Zahl als Held (219), G2 Leuchten als Wert, G7 echtes Produkt.
3. Dunkel · So geht es und Aufmaß: G5 Strichmarken und Schraffur, G9 Werte an der Zeichnung und am Blatt, G4 Blatt als Objekt, G2 Leuchten am Messwert.
4. Hell · Preis: G3 Zahl als Held (7,99), G2 Leuchten, G1 Punktraster gegen Leuchten, G6 eine schwarze Pille.
5. Dunkel · Ratgeber, Schriftfenster, Fensterbauer, Fuß: Schrift als Fenster, G6 schwarze Pille auf heller Karte, Haarlinien.

## Änderungsliste (Y gegen X)

1. Pilotphase-Band oben entfernt; Satz bleibt im Fuß.
2. Kopfzeile: Logo, Umschalter als Pillen (aktiv mit violettem Punkt), Umriss-Pille „Jetzt konfigurieren“; Glasleiste kehrt beim Hochscrollen zurück.
3. Hero: Foto als Bühne, gekipptes Handy mit echtem Messbildschirm (1409 mm in Doto), Etikett „Öffnung · Höhe 1.409 mm“ am Zollstock, violetter Schein, Bildpille in der Überschrift, „eezi.“ in Violett, Lead und Pillen wie heute, Chips der Wünsche, Messband.
4. Konfigurator: Laufbänder → Bento (sechs Renderings, 219 RAL-Farben leuchtend, 15 Holzdekore), große Kachel wandert beim Scrollen.
5. So geht es: Zeitbühne → vier Kacheln (Foto mit Etikett, Zeichnung mit zwei Etiketten, Modell mit Farbwahl, Blatt mit Etikett), Stationenliste am Schreibtisch folgt dem Scrollen.
6. Was im Aufmaß steckt: in die dunkle Szene, Blatt gekippt auf Anthrazit mit drei Etiketten, Liste mit violetten Punkten; Nachmess-Satz und „beide erfunden“ bleiben.
7. Preis: eigene helle Szene, 7,99 € als Zahl-Held in Leuchtkachel mit Punktraster, Chip Einführungspreis, „bis 17. November, danach 12,99 €“, Pille „Jetzt ausmessen“.
8. Ratgeber: drei Zeilen mit Rundknopf.
9. Schriftfenster „eeziframes“.
10. Für Fensterbauer: weiße Karte, schwarze Pille, Umriss zur Ansicht.
11. Fuß in drei Spalten mit Pilotphase-Satz.
12. Palette, Outfit/Doto, fünf Szenen mit Vorhang.
13. Bewegung: Auftritt aus der Unschärfe (fertig nach 1,3 s), Etiketten, Vorhang, lebendes Bento, Stationen, Schriftfenster, Leiste; ruhige Fassung sofort; nach 2,6 s 0 Animationen; ohne JavaScript alles sichtbar.

## Blickprotokoll der Gestaltungsleitung (Y, 390 × 844)

Sekunde 1: Foto mit Handy und Etikett „1.409 mm“. Sekunde 2: „Fensterplanung ganz [Fenster] eezi.“. Sekunde 3: weiße Pille „Jetzt konfigurieren“ bei 555 px. Schieltest (Graustufen, 8 px): drei Formen (Bühne, Überschrift, Pille), die Pille der hellste kleine Punkt. Tab-Weg: Logo, Hauseigentümer, Fensterbauer, Jetzt konfigurieren (Kopf), Jetzt konfigurieren (Hero), Mehr erfahren. Eine volle Pille je Bildschirm (gemessen). Kontraste: Weiß/Schwarz 20:1, Silbergrau/Schwarz 8,1:1, Silbergrau/Anthrazit 6,6:1, Violett/Schwarz 6,1:1, Textgrau/Weiß 5,6:1, Weiß/Indigo 10,6:1, Violett/Weiß 3,3:1 (nur ab 30 px). Ziele ab 44 px. Kein Querscrollen (390 px). `impeccable detect`: Violett auf Weiß (Akzentwort ab 30 px, Regel des Inhabers), Schriftfenster als „Gradient text“ (DNA-Baustein), Rest Scheinbefunde.

## Hinweis des Inhabers während des Durchlaufs

Nach der ersten Fassung (Fassung Y, scratchpad `neu/r4`) sagte der Inhaber: Gestaltung nur nach `design-dna`, nicht nach `premium-gestaltung` und `ultimativ-webdesign`; `profis` nur kurz (eine Runde, etwa zehn Minuten je Seite). Aus den alten Skills waren eingeflossen und wurden entfernt: die Pillen-Regel 460–600 px (jetzt DNA: unteres Drittel, gemessen 597 px), das eine violette Wort je Überschrift (DNA: zweite Stimme in `tinte-2`, Leuchtfarben nie als Text), das Messband unter dem Hero (altes Markenzeichen), Licht- und Kameravorgaben im Bildprompt (jetzt nach den Genen G4, G7, G10). Die Befundliste oben ist entsprechend nur noch nach der DNA zu lesen; CLAUDE.md wurde auf dem Arbeitszweig angepasst. Das Gremium lief einmal; eine zweite und dritte Runde entfallen.

## Runde 2: Gremium (Y = `neu/r4` gegen X = heute), eine Runde

| Gruppe | Fassung | Hände für Y | Median | Vetos |
| --- | --- | --- | --- | --- |
| Gestalter | Y 6:0 | 4, 3, 4, 3, 4, 3 | 3,5 | keine |
| Kunden | Y 4:2; verstehen (X/Y): was es ist 5/5, was es kostet 5/5, was sie tun 4/4; Abbruch Bildschirm eins: X Hofmann (und Demir fast, Pilotband), Y nur Hofmann | Faust, 2, 2, 3, 3, 4 | 2,5 | Hofmann (Gegenspieler): Handy widerspricht sich („Maß 1 von 4“ mit vier Werten), Mieter fehlen |
| Fensterbauer | Y 5:1; Median X→Y: seriös 3→4, verständlich 4→4, zumuten 3→4, Weg 4→4, zeigen 3→4, kaufen 2→3 | Faust, 3, 3, 3, 4, 4 | 3 | Brandt: „219“ abgeschnitten, „1409“ ohne Punkt, Etiketten über dem Blatt |

Mehrheiten je Änderung (alle 18): behalten 1, 2, 5, 7, 10, 11, 12, 13 (Bewegung, mit Auflage Bento ruhiger); ändern 3 (Handy widerspruchsfrei, 1.409, Etikett am Zollstock, Bildpille raus: Gestalter 4:2, drei Kunden lesen sie als „Kästchen“), 4 („219“ ganz, Raster gleitet seltener), 6 (Etiketten neben das Blatt, „15 mm Abzug“ erklären oder weg), 8 (Rundknöpfe sichtbar); zurück 9 (Schriftfenster: Kunden 5:1 zurück, Fensterbauer 3:3, Gestalter wollten es ändern).

Weitere Forderungen mit Wirkung: Jahr an „17. November“ (Berger, Pohl); „über den Link des Fensterbauers kostenlos“ beim Preis (Pohl); Pilotphase-Satz im Fuß auf den Bereich für Betriebe eingrenzen (Berger, Pohl); Nachmess-Satz am Messen-Schritt (Kraus, Reuter); Karte für Fensterbauer mit Satz zu Paketen, Pilotphase und Daten (Yilmaz, Lindqvist); Preisziffern kräftiger (Hartwig, Keller, Roth); Wortmarke überall Inter (Roth); Schriften selbst hosten, Doto subsetten (Lenz); Chips nicht wie Knöpfe (Hartwig); Handy am Telefon größer, kleine Werte weg (Vogel, Hartwig, Veit).

## Umbau (nach der einen Runde)

Umgesetzt: Bildpille aus der Überschrift; Handy „Maß 1 von 4“ mit 1.409 mm, die drei weiteren Maße leer, am Telefon größer und ohne die kleinen Zeilen, die Zahl rollt einmal ein (DNA-Rezept 8); Etikett am Zollstock auch am Schreibtisch (Gerät links); „219 Töne“ ganz in der Kachel; Bento mit nur noch zwei Kandidaten (ein Gleiten); Etiketten in den Rändern der Blatt-Kachel, „Bestellmaß · Feinaufmaß folgt“; Nachmess-Satz am Messen-Schritt; Preis: Ziffern in 250 (obere Grenze der DNA), Punktraster nur rechts oben, Beschriftung „Kostenlos“ über den vier Punkten, Jahr, Fensterbauer-Link-Satz, Chip „Einführungspreis“ in Koralle (Hinweis); Rundknöpfe mit Ring, Punkte vor den Ratgeber-Titeln; Schriftfenster entfernt; Karte für Fensterbauer mit Satz zu Paketen, Pilotphase und Daten und Indigo-Chip; Fuß mit Chip „Pilotphase“ und dem genauen Wortlaut des Hinweises; Chips im Hero getönt statt Umriss; Auftritt ohne Unschärfe auf Lead, Pillen und Chips (nur die Überschrift kommt aus der Unschärfe); ohne JavaScript alles sichtbar; Ziele ab 44 px.

Nicht übernommen, dem Inhaber vorgelegt: Waschbär als Platzhalter (das neue Foto kommt nach `hero-prompt.md`); „Jetzt konfigurieren“ gegen „Jetzt ausmessen“ (Vogel, Hofmann; Wortlaut des Inhabers); Ansicht „Mieter“ (Hofmann; Produkt); Maße auch in Zentimetern (Vogel; App); dünne graue Lesetexte (Vogel, Pohl; DNA-Lesetext 16 px in `tinte-2`); Kicker in Versalien (Roth; DNA-Label); „Mehr erfahren“ als Textlink (Keller; DNA-Pille leise); Unschärfe-Filter der Überschrift und Glas-Etiketten (Lenz; DNA-Rezepte; Prüfung auf einem Mittelklasse-Android steht aus); Betriebspreis auf der Karte (Lindqvist; Ansicht Fensterbauer); Blatt am Telefon antippbar groß (Brandt, Sonntag; in der echten Seite verlinkt das Blatt das PDF).

## Prüfung nach der DNA-Prüfliste (Endfassung, scratchpad `neu/r9`, Bilder in docs/profis/bilder/2026-10-26-startseite-dna-*.jpg)

- Familientest: Gerätebühne, Leuchtkacheln, Etiketten, Bento, Stationen, Szenen mit Vorhang wie auf der Musterseite; Palette des Inhabers statt der Musterfarben.
- Grund farblos (Schwarz, Weiß); Farbe nur als Leuchten (Schein, 219, Messen-Kachel, Preis), Punkt, Chip; höchstens zwei Leuchtpaare je Bildschirm (Violett+Indigo, Koralle allein).
- Vier Gene je Szene benannt (oben). Je Datenabschnitt eine Zahl als Held (1.409 mm, 219, 7,99 €), Einheit klein in `tinte-2`.
- Feinzeichnung (gestrichelte Linien, Schraffur, Punktraster), Gerät im Raum, Werte an der Sache: vorhanden.
- Genau eine volle Pille je Bildschirm (gemessen, Telefon und Schreibtisch); am Telefon Oberkante 597 px (unteres Drittel), 52 px hoch.
- Kontraste: Weiß/Schwarz 20:1, Silbergrau/Schwarz 8,1:1, Silbergrau/Anthrazit 6,6:1, Textgrau/Weiß 5,6:1, Weiß/Indigo 10,6:1, Schwarz/Koralle 8,3:1; Fokusring 2 px; nichts nur über Farbe (Öffnung/Fenster auch im Text).
- Telefon 390 px: kein Querscrollen, keine Überschrift bricht im Wort, Etiketten bleiben im Bild.
- Bewegung: Hero steht nach 1,3 s, nach 2,6 s laufen 0 Animationen, nichts läuft von selbst, Bento gleitet einmal, bei „weniger Bewegung“ steht alles sofort, ohne JavaScript alles sichtbar. Ziele ab 44 px (Wortmarke 30 px hoch ist ein Link im Kopf).
- „Nie“-Liste: kein linearer Verlauf, kein Neon, keine Emoji, keine Statistikreihe, keine erfundenen Zahlen, keine frontalen Bildschirmfotos, kein Hero mit Text links und Foto rechts ohne Bühne, kein Ladebildschirm; Inter nur für die Wortmarke (Marke vor DNA).

## Farbanteile nach der Palette „Task-App dunkel“ (Endfassung, je Pixel der nächsten Farbe zugeordnet)

Neutral = Schwarz (S), Anthrazit (A), Silbergrau mit Textgrau (G), Weiß (W). „Foto“ = andere Töne aus Foto und Renderings (zählen als Farbe, Regel 6). Vorgabe Seite: S 42, W 26, A 16, G 9 (±3), Violett 3,5, Koralle 2, Indigo 1,5 (±1), Farbe gesamt 7, je Bildschirm höchstens 12, kein Bildschirm ohne Farbe.

Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Hero | 87,0 (S 61 · A 12 · G 7 · W 7) | 0,1 | 8,6 | 2,7 | 1,5 | 13,0 |
| 2 Konfigurator | 87,4 (S 1 · A 13 · G 5 · W 69) | 2,0 | 0,3 | 3,2 | 7,2 | 12,6 |
| 3 Konfigurator | 92,4 | 2,0 | 0,3 | 3,2 | 2,2 | 7,6 |
| 4 So geht es | 93,8 | 0,7 | 0,0 | 0,8 | 4,7 | 6,2 |
| 5 So geht es | 95,7 | 0,0 | 0,1 | 0,7 | 3,5 | 4,3 |
| 6 Aufmaß | 99,5 | 0,2 | 0,0 | 0,3 | 0,0 | 0,5 |
| 7 Aufmaß | 99,6 | 0,1 | 0,0 | 0,2 | 0,1 | 0,4 |
| 8 Preis | 94,5 | 4,8 | 0,7 | 0,0 | 0,0 | 5,5 |
| 9 Ratgeber | 99,3 | 0,1 | 0,0 | 0,7 | 0,0 | 0,7 |
| 10 Fensterbauer | 98,4 | 0,0 | 0,0 | 1,6 | 0,0 | 1,6 |
| 11 Fuß | 97,9 | 0,0 | 0,0 | 2,1 | 0,0 | 2,1 |
| **Seite** | 95,0 (S 44 · A 16 · G 5 · W 30) | 0,9 | 0,9 | 1,4 | 1,8 | 5,0 |

Schreibtisch 1280 × 800: Seite 95,9 (S 49 · A 12 · G 3 · W 32), Violett 0,7, Koralle 1,0, Indigo 0,8, Foto 1,6, Farbe gesamt 4,1; Bildschirm 1 11,1, Bildschirm 2 und 3 je 8,8, Rest unter 3,2.

Abweichungen von der Vorgabe: Bildschirm 1 und 2 am Telefon liegen mit 13,0 und 12,6 über 12, getrieben vom Platzhalterfoto (Koralle 8,6 ist der Orangeton der Baustelle) und von Holz und Glas der Renderings; mit dem neuen Foto nach hero-prompt.md fällt Bildschirm 1 auf etwa 5. Über die Seite fehlen Violett (0,9 statt 3,5) und Farbe gesamt (5,0 statt 7): Die Leuchten sind weich und werden beim Zählen zu Indigo (dunkel) oder Weiß (hell); mehr satte violette Fläche hieße Leuchten ohne Wert, was die DNA verbietet. Weiß 30 und Silbergrau 5 liegen je einen Punkt außerhalb, Schwarz am Schreibtisch mit 49 vier Punkte darüber (breite dunkle Szenen). Der Inhaber entscheidet, ob die Vorgabe als Zählung je Pixel oder als Eindruck gilt.

## Änderungstabelle für den Inhaber

| Änderung | Zweck | Gremium | Stand |
| --- | --- | --- | --- |
| Hero: Foto als Bühne, gekipptes Handy mit echtem Messbildschirm (1.409 mm, Maß 1 von 4), Etikett am Zollstock, Schein, Pille im unteren Drittel | Blickführung, Beweis | alle drei Gruppen dafür; Handy widerspruchsfrei und lesbar gefordert | geändert |
| Bildpille in der Überschrift | DNA-Baustein | Gestalter 4:2 dagegen, drei Kunden lesen „Kästchen“ | zurückgenommen |
| Pilotphase-Band oben weg | Verständnis | Kunden 3:1:2, Fensterbauer 4:2 dafür; Satz im Fuß präzisiert, Zeile in der Karte | geändert; **Inhaber entscheidet** |
| Konfigurator als Bento, 219 leuchtend, lebendes Raster | Beweis, DNA | alle dafür; „219“ ganz, Raster ruhiger | geändert (ein Gleiten) |
| So geht es: vier Kacheln mit Etiketten, Stationen am Schreibtisch | Verständnis | 17 von 18 behalten | bleibt; Nachmess-Satz am Messen-Schritt |
| Was im Aufmaß steckt in der dunklen Szene, Blatt mit drei Etiketten | Vertrauen | Etiketten neben das Blatt (G 4:2, F 4:2) | geändert |
| Preis als Zahl-Held in Leuchtkachel | Verständnis | Kunden 3:3, Gestalter kräftigere Ziffern | geändert (250, Jahr, Fensterbauer-Satz, Koralle-Chip) |
| Schriftfenster „eeziframes“ | DNA-Bewegungsgen | Kunden 5:1 zurück | zurückgenommen; **auf Wunsch zurück** |
| Karte für Fensterbauer weiß auf dunkel, schwarze Pille | Weg für Fensterbauer | 15 von 18 behalten; Satz zu Paketen und Pilotphase | geändert |
| Palette und Schrift (Outfit, Doto, Inter nur Wortmarke) | Marke | Gestalter 5:1, Kunden 3:2:1, Fensterbauer 5:1 | bleibt |
| Bewegung (Auftritt, Vorhang, Etiketten, Leiste) | DNA | behalten; Unschärfe nur auf der Überschrift | geändert |

Offen für den Inhaber: neues Hero-Foto (Prompt in hero-prompt.md; Waschbär oder ohne Figur), Pilotphase-Band oben, Schriftfenster, „Jetzt konfigurieren“ oder „Jetzt ausmessen“, Ansicht für Mieter, Maße in cm, Prüfung auf einem Mittelklasse-Android (Unschärfe, Glas, Vorhang). Für die Umsetzung in web/: Outfit und Doto nach web/vendor mit Lizenz, bundle.css und bundle.js als Dateien der Seite, Doto auf Ziffern subsetten.

Vorschau: https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i (privat, nichts online). Quelle: docs/profis/startseite-dna-vorschau/.

## Antwort des Inhabers

Noch keine (zur Fassung nach dem Gremium).

## Realitäts-Check

Steht aus. Fragekarte: zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe: „Was würdest du jetzt tun?“ (wörtlich notieren), „Was kostet das?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“

## Feinschliff-Runde (26.10., nach dem Ja des Inhabers zum Konzept)

Auftrag: Konzept und Abfolge bleiben; nur Kleinigkeiten (Zeitpunkte, Zeichen, Zustände, Schrift, Abstände). Vier Profis aus UX und Design, je etwa zehn Minuten, je höchstens zehn Befunde (Urteile unter docs/profis/gremium/2026-10-26-startseite-dna-feinschliff-*.md). Material: Zeitlupen-Einzelbilder des Hero-Auftritts (Animationen vierfach verlangsamt), Zustände (Ruhe, Hover, Druck, Fokus), Leiste, Bento und Stationen im Wechsel.

Vorab aus der eigenen DNA-Durchsicht: ein Chevron- und ein Punkt-Zeichen für die ganze Seite (1,8 px, runde Enden); die Zahl auf dem Gerät rollt erst nach 450 ms ein, das Etikett hängt sich danach an (1000/1300 ms); Stationen wechseln in 320 ms; Pfeil rückt bei Hover 2 px vor; der Schein lag über der Überschrift (Stapelreihenfolge) und liegt jetzt dahinter.

Umgesetzt aus den Befunden:
- Typografie (Roth): 32 px vor jeder Hauptaktion; Schattengrößen 13/15/18 auf die DNA-Skala 14/16/22; Zahlen in Kacheln 48/250, Preis 64–88 mit Einheit 15 px; Lesebreiten 36ch (Ratgeber 44ch); helle Szenen raum-7/raum-8 statt 56 px; Kicker→Titel 12, Titel→Text 16 überall; Fußchip in der Zeile, Marke oben; geschützte Leerzeichen am Mittelpunkt, Datum und Gerätekopf; Kachelbeschriftungen dürfen umbrechen; Haarlinien in Dunkel als Silbergrau zu 30 %; Etiketten 12/13 px, Wert in tinte-2.
- UX (Hartwig): Stationen als echte Links mit Hover; ganze Ratgeber-Zeile reagiert (Knopf Indigo, Titel unterstrichen, Druck); Farbwahl ohne Knöpfe (Spans, keine Zeigerereignisse); Blatt-Etiketten am Telefon neu gesetzt; Fokus unter dem Vorhang holt sich in die Mitte; Umschalter ohne beschnittenen Fokusring; Marke als 44-px-Ziel; Fuß-Spaltentitel als Überschriften, Spalte „Für Fensterbauer“ mit kurzen Namen; Skip-Link, Landmarken, lang; Leiste mit 24 px Hysterese auch nach unten; Hover auf Linkzeilen und Fußlinks.
- Zeichen (Lorenz): Pfeil im Ratgeber-Rundknopf wieder mittig (Vererbungsfehler); Maßlinien messen jetzt Maueröffnung und Rahmen; ein Zeichen je Bedeutung: violetter Punkt nur im Umschalter und am Etikett, Listenpunkte 6 px Silbergrau, Kostenlos mit Haken, Ratgeber ohne Punkt; Farbwähler mit Farbpunkt je Option, gewählt in handlung; Ankerpunkte und Linien auf Papier sichtbar; Striche der Zeichnung gerätunabhängig (1,8/1,2/1 px); Scheibe hinter dem Etikettpunkt in Dunkel sichtbar; Umschalter nur mit Punkt.
- Danach: Aufmaß-Liste einspaltig (16 px in zwei Spalten brach), Farbwähler passt in die Kachel.

Nicht übernommen: „Jetzt konfigurieren“ überall in „Jetzt ausmessen“ (Hartwig; Wortlaut des Inhabers); Preisziffern in 200 statt 250 (Roth; 250 liegt in der DNA-Spanne und war Forderung des Gremiums); Tab-Reihenfolge Kopf am Telefon (Pille im DOM nach dem Umschalter; am Schreibtisch stimmt sie).
- Bewegung (Brandner): Zahl rastet ab 250 ms von 1.000 auf 1.409 ein (Tabellenziffern, fertig bei 950 ms, Punkt 1000, Etikett 1300); Stationenpille wechselt nur Farbe, der Punkt skaliert per transform; Schritt-Karten blenden nur, das Etikett ist der einzige Weg; Ratgeber-Knopf mit synchronen Kanälen; leise Pille blendet Ring, Füllung und Schrift gemeinsam in 220 ms; Leiste geht in 220 ms, kommt in 320 ms; Umschalter mit Druckzustand; Tastatur (Enter, Tab) ohne Gleiten. Vorschlag ans Design-System (nicht in bundle.js geändert): `flip()` sollte laufende Animationen der Kacheln abbrechen, bevor es die Endlage misst, damit ein Zurückscrollen über die Schwelle nicht springt.

Endfassung gemessen (scratchpad `neu/r11`, Bilder in docs/profis/bilder/): Pille am Telefon 613 px (unteres Drittel), eine volle Pille je Bildschirm, nach 2,6 s 0 Animationen, bei „weniger Bewegung“ und ohne JavaScript alles sofort, Tab-Weg Skip-Link, Marke, Umschalter, Kopfpille, Hero-Pille, Mehr erfahren, Stationen; Ziele ab 44 px; keine Konsolenfehler. Farbanteile Telefon über die Seite: Schwarz 44, Anthrazit 16, Grau 5, Weiß 30, Violett 0,9, Koralle 0,9, Indigo 1,0, Foto 1,7, Farbe gesamt 4,5; Bildschirm 1 12,7 (Platzhalterfoto), Bildschirm 2 12,2, Bildschirm 10 (Fuß oben) ohne Farbe, nachdem die Spaltentitel keine Chips mehr sind; alle anderen Bildschirme 0,1 bis 7,5. Vorschau unter derselben Adresse neu veröffentlicht.

## Runde „Quäntchen“ (26.10., später): Vorlagen des Inhabers gegen die Seite, und das Stottern

Frage des Inhabers: Warum wirken seine zwölf Vorlagen (Koch-App, Switch, Heeal, NFT, Wallet, Dashboard, Task-App, Domus, rondesignlabs) exklusiver, und warum stottert die Seite beim Laden und Scrollen? Drei Perspektiven (Urteile unter docs/profis/gremium/2026-10-26-startseite-dna-vorlagen-*.md), dazu eine Messung mit vierfach gedrosselter CPU.

Befund in drei Sätzen: In den Vorlagen ist keine Fläche flach (tonaler Abfall, Lichtkante, Glas mit Bruchkante, Gerät als Körper, Bühne mit Lichtabfall), genau ein Element ist schwer und riesig, alles andere liegt drei Stufen darunter, und die Luft ist gestaffelt statt gleichmäßig. Unser Konzept, der Zahlenkontrast und die Luft waren schon auf Vorlagenniveau; es fehlte die Oberfläche, der schwere Held und die Hierarchie der Abstände. Das Stottern kam aus vier Quellen: Auftritte unterhalb des Hero (Inhalt erschien erst beim Sichtbarwerden und rückte 24 px hoch), nachladende Bilder, Weichzeichner auf großen Flächen (18 Filter-Ebenen) und das Umsortieren im Bento (Layoutsprung 0,25).

Umgesetzt:
- Leistung: Auftritt nur noch im Hero; alle Bilder sofort geladen (Modell auf 1000 px verkleinert); Leuchten ohne Weichzeichner (reine radiale Verläufe, keine zweite Ebene); Glas-Unschärfe 12 px; Überschrift aus 6 px Unschärfe mit will-change; Schriften vorab geladen, Grund sofort dunkel (kein weißer Blitz); Bento ohne Umsortieren (lebendes Raster abgeschaltet, Markup bleibt); Vorhang rechnet mit der größten Bildschirmhöhe der Ausrichtung, damit die Adressleiste die klebende Kante nicht verschiebt. Messung danach: Layoutsprung 0, Pseudo-Filter 0, keine nachladenden Bilder, Laden 0,5 s.
- Material (Veit): tonaler Verlauf und 1-px-Lichtkante auf allen dunklen Karten und Kacheln; Vignette und Lichtkante auf dem Hero-Foto; Lichtteich hinter der Bühne; Kontaktschatten unter den Renderings; Glas-Etiketten mit Bruchkante; Rundknöpfe mit Lichtverlauf; hellerer Kachelrand auf Weiß.
- Typografie (Roth): Titel in 600 (titel-xl bis 56 px, titel bis 40 px, engere Laufweite); Labels 400 mit .03em; kleine Zahlen 300 mit Einheit 14 px; Luft nach Hierarchie (Etikett→Titel 6, Titel→Text 12, Text→Pille 32); Schritt-Karten in drei Ebenen (Label, Titel 24/600, Meta 14 px); „Kostenlos“ mit Haken als eine Zeile; Wortmarke 18 px mit 26-px-Zeichen.
- Hero auf Wunsch des Inhabers: Gerät, Etikett und Schein aus dem Hero genommen, sein Hausfoto als Bühne (bilder/hero.webp). Folge für die Palette: Bildschirm 1 am Telefon trägt 17,7 % Farbe (Foto), die Seite 5,4 %; Seite 95 neutral (S 45 · A 14 · G 6 · W 30). Der Prompt in hero-prompt.md bleibt als Alternative.

Nicht übernommen: Gerät mit Metallkante und Spiegelung (nach dem Hero-Wechsel ohne Gerät); neue Renderings mit grauem Studioglas (Werkzeug docs/profis/werkzeuge/startseite-renderings.mjs, eigener Auftrag); Alles inline in index.html (Dateien bleiben getrennt, der Grund wird sofort dunkel gesetzt); Vorhang früher kleben lassen (DNA-Verhalten); Hero-Etikett zweizeilig (entfällt). Vorschlag ans Design-System (Rückfluss): Display-Gewicht 600 statt 500, Labels 400, kleine Zahlen 300, Lichtkante und tonaler Verlauf als Teil der Formensprache, Leuchten ohne Filter.

## Übernahme als Startseite (26.10., abends)

Auftrag des Inhabers: die ausgestaltete Seite als Startseite übernehmen und online stellen.

Umsetzung: Die Ansicht Hauseigentümer der echten Startseite ist jetzt diese Seite. Markup als `<template id="startseite-dna">` in web/index.html, Aufbau im Schatten-DOM von `#startseite` durch web/assets/startseite.js (einmal gebaut und über alle Aufbauten des Portals erhalten), Gestaltung web/assets/startseite-dna.css (tokens, bundle und start.css der Vorschau, `:root` und `body` als `:host`), Bausteine web/assets/dna-bundle.js, Schriften web/fonts/dna.css (eigene Datei, weil /fonts/* ein Jahr unveränderlich zwischengespeichert wird), Bilder web/bilder/start/. Die Ansicht Fensterbauer, die Anmeldung und der Bereich für Betriebe bleiben im Portal unverändert.

- Preis und Einführungspreis kommen aus modell.js; in der Vorlage steht kein fester Preis, der nach dem Stichtag veralten würde.
- Wer schon Fenster erfasst hat, sieht „Aufmaß fortsetzen“ und „Dein Aufmaß ist angefangen: N Fenster erfasst“.
- Eigene Fußzeile der Seite statt der des Portals; kein Pilotband auf der Startseite (Entscheidung des Inhabers), in der Ansicht Fensterbauer weiter.
- Sprungmarken im Schatten-DOM per Skript; /#fensterbauer wechselt die Ansicht, /#wie öffnet „So funktioniert es“ für Betriebe.
- Prüfsuite: Prüfungen der alten Startseite auf die neue umgeschrieben, keine abgeschaltet; 1089 bestanden. Drei Fehlschläge bestehen auch auf main ohne diese Änderung (Verglasungs-Lupe in der App, „Vertrag widerrufen“ und „nur für Unternehmer“ auf der Seite für Fensterbauer).
- Bereitstellung: Der erste Bau bei Cloudflare blieb über 20 Minuten in „Initializing“ hängen und wurde abgebrochen; der Code baut mit `npx wrangler deploy --dry-run` sauber (282 Dateien). Dieser Eintrag löst den Bau erneut aus.

## Umbau 29.10.2026: 3-D-Einstieg und Gratis-Wahl

### Auftrag und zwei Korrekturen am selben Tag

- Auftrag des Inhabers (sinngemäß): Der Konfigurator selbst ist der Einstieg, statt erklärt zu werden. Hero „zeigen statt erklären“: ein
  echtes 3-D-Fenster, das sich langsam dreht und sich mit Finger, Maus und Tastatur drehen lässt, darunter 3 bis 4 Farbfelder, ein Tipp
  wechselt den Rahmen; ergänzend ein kurzer Loop, in dem auf einer Hausfassade nacheinander die Fenster eingeplant werden. Überschrift
  „Plane deine Fenster in 3D, bevor du den ersten Handwerker anrufst.“, Knopf „Kostenlos losplanen“. Dazu ursprünglich: der Gratis-Weg
  als Wahl (zwei Karten, „Empfohlen“, durchgestrichener Preis), eine Drei-Schritte-Leiste mit Karte und Pins, Vertrauenssätze.
- Korrektur 1 (Koordinator für den Inhaber): bis zu fünf Betriebe statt genau zwei, Texte entsprechend.
- Korrektur 2, die neue Gewichtung (Koordinator für den Inhaber): **Die Seite ist auf den ersten Blick ein Planungswerkzeug, kein
  Vergleichs- oder Lead-Portal.** Das Verschicken an Betriebe ist nur eine leise Zusatzmöglichkeit; Abgrenzung von Seiten, die erst alle
  Daten abfragen. Umgesetzt: Hero bleibt, darunter „Ohne Konto, ohne Telefonnummer. Dein Ergebnis siehst du sofort.“; die drei Schritte
  handeln vom Aufmaß (Messen, In 3D planen, Aufmaßblatt), die Karte mit Pins entfällt; statt der zwei Preiskarten steht der Preis wie
  vorher („Messen kostet nichts.“, 7,99 € aus modell.js) und darunter ein leiser Zusatz zur Weitergabe; „vergleichbare Angebote“ nur dort.

### Wahl zum Hero (drei Zeilen)

1. Das 3-D-Fenster trägt den Hero allein: Es ist das, was der Besucher gleich selbst tut (G4, G7, G15), ein Foto dahinter wäre ein
   zweites schweres Element und brächte am Telefon Fenster, Etiketten, Farbfelder und Pille nicht in einen Bildschirm.
2. Das Hausfoto des Inhabers bleibt Material und trägt den Loop im Schritt „In 3D planen“ der Leiste direkt unter dem Hero: Dort erklärt
   es genau diesen Schritt (Fenster 2 von 5 · geplant), und die kleinen Fenster des Hauses haben Platz für Umriss und Etikett.
3. Das Foto mit dem Lichtschatten auf dem Boden (bilder/konfigurator/buehne.webp) ist nirgends verwendet; Handy und Maßlinien bleiben aus
   dem Hero heraus.

### Das 3-D-Fenster: Bildfolge des echten Modells, kein WebGL im Browser

- Ehrlich gesagt: Im Hero läuft **kein WebGL**. Er zeigt eine **Bildfolge des echten App-Modells**: `scripts/hero-fenster.mjs` öffnet die App
  mit `?gl=voll` in Chromium mit SwiftShader (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`), baut das Startfenster
  der App (`HERO_WIN`, zweiflügelig, frei schwebend wie die Bühne in Schritt 1, `o.frei`, ohne `raum-licht`) mit `w3dHTML`/`w3dApply` und
  lässt es von `Buehne3D` zeichnen, also mit demselben Programm, denselben Materialien und demselben Licht wie die Wünsche. Rahmenfarbe
  außen je Farbfeld (w.fa), innen Verkehrsweiß; Kamera wie die Ansicht „außen“ der App (rx −8°, VIEWS.outside), Schwenk um 180° ± 36°.
- Warum nicht live: Das Modell lebt in app.js (rund 1 MB) und buehne.js (127 KB); beides auf der Startseite zu laden, verzögert den ersten
  Bildschirm deutlich, und Telefone ohne schnelle Grafik fielen auf das CSS-Modell zurück (kein Rendering im Sinne des Inhabers).
- Daten: 25 Blickwinkel von −36° bis +36° in 3°-Schritten, je Farbe ein Raster 5 × 5 aus Feldern 516 × 600 px (WebP mit Transparenz,
  Qualität 80), dazu der Ruhewinkel −21° als eigenes Bild (LCP, mit Maßen, `fetchpriority="high"`, vorab geladen). Farben aus ral.js:
  9016 Verkehrsweiß (Start), 7016 Anthrazitgrau, 9005 Tiefschwarz, goak Golden Oak. Gewicht: 9016 12 KB + 285 KB = 298 KB (unter 400 KB),
  7016 10 + 227 KB, 9005 9 + 202 KB, Golden Oak 16 + 383 KB. Angaben in web/bilder/start/fenster/fenster.json mit Fingerabdruck von
  buehne.js und ral.js; die Prüfsuite meldet, wenn er nicht mehr passt (dann `PW_PFAD=/opt/node-tools node scripts/hero-fenster.mjs`).
- Bedienung (startseite.js): Pendeln von selbst (Sinus, 10 s je Hin und Her, weich aus dem Stand), zwei Ebenen blenden zwischen
  benachbarten Winkeln über; stoppt bei „weniger Bewegung“, außerhalb des Bildschirms, bei verstecktem Tab und für immer nach dem ersten
  Ziehen, Tastendruck oder Tastaturfokus. Ziehen mit Finger oder Maus ab 6 px waagerecht (senkrecht scrollt die Seite), danach rastet der
  nächste Winkel ein (160 ms). Tastatur: Pfeile, Bild auf/ab, Pos1, Ende, sofort, ohne Gleiten. Regler mit `role="slider"`, Wert in Grad,
  Text „Blick von rechts, 21 Grad“. Strichskala darunter (G5), Licht und Kontaktschatten unter dem Fenster (G14), „Aus dem 3-D-Modell der
  App“ als Marke. Farbfelder: runde Knöpfe 44 px, gewählt mit violettem Ring; der Tipp wechselt den Rahmen sofort (ist die Folge noch nicht
  da, steht ihr Ruhebild), Name und RAL daneben, „Kostenlos losplanen“ führt mit `/app/?farbe=<Schlüssel>#ausmessen` in die App. Weitere
  Farben: Ruhebilder 1,5 s nach dem Laden der Seite, Bildfolgen erst bei der ersten Berührung der Farbfelder (die angetippte zuerst).
- Mit angefangenem Aufmaß heißt die Pille wie bisher „Aufmaß fortsetzen“ und führt ohne Farbe in die App (die Farbe überschriebe sonst
  das erste Fenster des Aufmaßes).

### Änderungstabelle

| Bereich | Vorher (26.10.) | Nachher (29.10.) | Warum |
| --- | --- | --- | --- |
| Hero, Bühne | Hausfoto des Inhabers | 3-D-Fenster aus der Bildfolge des App-Modells, Lichtteich, violettes Licht und Kontaktschatten darunter, Strichskala | zeigen statt erklären (Auftrag) |
| Hero, Bedienung | keine | Pendeln, Ziehen, Pfeiltasten; 4 Farbfelder mit Name und RAL | der Konfigurator ist der Einstieg |
| Hero, Text | „Fensterplanung ganz eezi.“, Preis im Lead, „Mehr erfahren“, Chips der Wünsche | „Plane deine Fenster in 3D, *bevor du den ersten Handwerker anrufst.*“, „Farbe antippen, Fenster drehen.“, Pille „Kostenlos losplanen“ (?farbe=), darunter „Ohne Konto, ohne Telefonnummer. Dein Ergebnis siehst du sofort.“ | Auftrag und Gewichtung |
| Neu unter dem Hero | – | „Drei Schritte zu deinem Aufmaß.“: Messen (Bild der Messfolie mit der Breite der Öffnung, 1.236 mm auf der Linie), In 3D planen (Hausfoto, fünf Fenster werden nacheinander eingeplant, Etikett „Fenster 2 von 5 · geplant“), Aufmaßblatt (das Blatt) | Leiste nach dem Hero (Auftrag, Gewichtung) |
| Preis | „Messen kostet nichts.“ mit 7,99 € | unverändert, darunter leise: „Wenn du magst: Wir schicken dein Aufmaßblatt an Fensterbetriebe in deiner Nähe, dann ist es kostenlos. Nur wenn du das willst.“, ein Satz zur Wahl der Betriebe und zur Vermittlung, Textweg „Mit Weitergabe planen“ (/app/?weg=gratis#ausmessen) | Weitergabe nur als Möglichkeit (Gewichtung) |
| Verworfen am selben Tag | – | zwei Preiskarten (0 € „Empfohlen“ gegen 7,99 €, durchgestrichener Preis), Karte mit Pins „Betriebe wählen“, Angebots-Marken am Blatt, Vertrauenszeilen zu Telefoncode und „Warum kostenlos?“ | Gewichtung des Inhabers |
| So geht es, Schritt 4 | „Einmal 7,99 € für alle Fenster.“ | unverändert | – |
| Schrift und Ziele | Labels und Bildunterschriften 12 px, Fußlinks schmaler als 44 px | Text überall ab 13 px, Ziele ab 44 px (auch Links im Fließtext und im Fuß), Bento-Bilder mit Maßen | Grenzen des Auftrags |
| Suchmaschinen | Titel „Fenster selbst ausmessen, Aufmaß ohne Anfahrt“, h1 „Fensterplanung ganz eezi.“ | Titel „Fenster in 3D planen und selbst ausmessen“, h1 wie sichtbar, Text und JSON-LD mit Planen zuerst, drei Angebote (Planen 0 €, Aufmaßblatt 7,99 €, Aufmaßblatt mit Weitergabe auf Wunsch 0 €) | stimmig zum Sichtbaren |

### Messwerte (Endfassung; Bilder docs/profis/bilder/2026-10-29-startseite-3d-tel.jpg und -desk.jpg)

- Telefon 390 × 844: Pille „Kostenlos losplanen“ 708–760 px (unteres Drittel), genau eine volle Pille je Bildschirm, kein Querscrollen.
  Schreibtisch 1280 × 800: Pille 468–520 px.
- Layoutsprung 0 (Telefon, Schreibtisch, ruhige Fassung); LCP ist das Ruhebild des Fensters nach 0,21–0,27 s (lokal, ohne Drosselung);
  keine Weichzeichner auf Flächen oder Pseudoelementen; keine lazy-Bilder; Text ab 13 px; Ziele ab 44 px; keine Konsolenfehler; CSP
  eingehalten, keine fremden Server.
- Ruhige Fassung: das Fenster steht (−21°), die Fassade zeigt sofort alle fünf Fenster geplant.

Farbanteile je Bildschirm (`werkzeuge/farben.py`), Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Hero | 98,5 (S 72 · A 5 · G 13 · W 8) | 0,4 | 0,2 | 0,9 | 0,0 | 1,5 |
| 2 Drei Schritte | 91,6 (S 25 · A 37 · G 18 · W 11) | 0,0 | 6,3 | 0,0 | 2,0 | 8,4 |
| 3 Drei Schritte | 92,4 (S 24 · A 42 · G 9 · W 18) | 0,0 | 5,7 | 0,0 | 1,8 | 7,6 |
| 4 Konfigurator | 87,7 (S 1 · A 12 · G 5 · W 70) | 1,6 | 0,2 | 3,9 | 6,7 | 12,3 |
| 5 Konfigurator | 88,1 | 1,6 | 0,2 | 3,9 | 6,2 | 11,9 |
| 6 So geht es | 93,5 | 0,9 | 0,1 | 0,8 | 4,7 | 6,5 |
| 7 So geht es | 95,6 | 0,0 | 0,0 | 0,8 | 3,4 | 4,4 |
| 8 Aufmaß | 100,0 | 0,0 | 0,0 | 0,0 | 0,0 | 0,0 |
| 9 Aufmaß | 99,4 | 0,4 | 0,0 | 0,2 | 0,0 | 0,6 |
| 10 Preis | 94,3 (S 3 · A 1 · G 6 · W 84) | 4,9 | 0,8 | 0,0 | 0,0 | 5,7 |
| 11 Preis, Zusatz | 94,3 | 4,9 | 0,8 | 0,0 | 0,0 | 5,7 |
| 12 Ratgeber | 99,3 | 0,0 | 0,0 | 0,7 | 0,0 | 0,7 |
| 13 Fensterbauer | 100,0 | 0,0 | 0,0 | 0,0 | 0,0 | 0,0 |
| 14 Fuß | 99,4 | 0,2 | 0,0 | 0,5 | 0,0 | 0,6 |
| **Seite** | 95,3 (S 39 · A 16 · G 7 · W 33) | 1,1 | 1,0 | 0,8 | 1,8 | 4,7 |

Schreibtisch 1280 × 800: Seite 97,3 (S 53 · A 11 · G 4 · W 29), Violett 0,6, Koralle 0,2, Indigo 0,7, Foto 1,2, Farbe gesamt 2,7;
Hero 0,9 (Violett 0,2 vor Koralle 0,1), Drei Schritte 2,5 (Koralle 1,9 aus dem Hausfoto), Konfigurator je 8,7, Preis 3,2, Rest unter 2,7.

Abweichungen: In den Bildschirmen der drei Schritte führt Koralle (6,3 und 5,7) ohne Violett; das ist das Ziegeldach und das Abendlicht
im Hausfoto des Inhabers (Fotos zählen als Farbe; beim Hero-Foto galt am 26.10. der Eindruck). Das Foto ist dort mit einem Schleier aus
Schwarz gedämpft (vorher 9,9 % Koralle und 13,1 % gesamt). Bildschirm 4 (Bento, unverändert) liegt mit 12,3 knapp über 12, wie schon am
26.10. (12,6). Im Hero ist das Licht unter dem Fenster so violett, dass Violett vor Koralle (Golden-Oak-Feld) liegt; Violett bleibt Licht,
Ring und Punkt, nie Fläche.

### Gremium

Nicht einberufen: In dieser Sitzung gab es kein Werkzeug für parallele Agenten, und der Inhaber hat die Entscheidungsfindung verkürzt.
Statt der Runde: DNA-Prüfliste, Messwerkzeuge, Bildschirme ganz durchgesehen. Wenn der Inhaber es wünscht, eine Runde nachholen.

### Prüfsuite

Startseite in Abschnitt 2 (neu: Bildfolge gegen fenster.json und Fingerabdruck, Gewicht der ersten Farbe, Markup des Betrachters, Pendeln,
Farbfelder mit ?farbe, Tastatur, Ziehen, Abgrenzung unter der Pille, drei Schritte, leiser Zusatz mit ?weg=gratis, keine Merkmale eines
Vergleichsportals, Pille im unteren Drittel, ruhige Fassung mit Layoutsprung 0), Abschnitte 6 und 10 (h1 und Einstieg), 14 (Aufmaß
fortsetzen). Ergebnisse siehe Bericht der Übergabe; alles grün, nichts abgeschaltet.

### Offen

- App (andere Sitzung): `/app/?farbe=<Schlüssel>#ausmessen` als Rahmenfarbe außen des ersten Fensters und `/app/?weg=gratis#ausmessen`
  für die Weitergabe. Im Stand dieses Zweigs sagt die Weiche der App noch „bis zu drei Fensterbetriebe“ und „Dein Aufmaßblatt als PDF ist
  dabei nicht enthalten“; der leise Zusatz der Startseite verspricht das Blatt kostenlos bei Weitergabe. Das muss die App angleichen.
- Eigenes Hausfoto des Inhabers für die Fenster-Animation im Schritt „In 3D planen“ (der Koordinator baut sie danach); bis dahin das
  Foto vom 26.10. als Ausschnitt (web/bilder/start/fassade.webp).
- Bewegung von selbst: Pendeln und Fassaden-Loop laufen auf Wunsch des Inhabers länger als die 5 s der DNA (Pendeln bis zur ersten
  Berührung, Loop höchstens drei Durchläufe je Sichtbarkeit). Vorschlag für die DNA: „Ein Objekt zum Anfassen darf von selbst pendeln, bis
  der Besucher es berührt.“
- Die Vorschau unter docs/profis/startseite-dna-vorschau/ ist nicht nachgezogen; Quelle der Startseite sind jetzt die Dateien unter web/.
- Test auf einem echten Mittelklasse-Telefon (Speicher der Bildfolge: 2580 × 3000 px je Farbe, dekodiert etwa 31 MB).

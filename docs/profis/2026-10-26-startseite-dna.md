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

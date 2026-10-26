# Profis · Konfigurator, Schritt 1 „Was planst du?“ nach Design-DNA und Palette „Task-App dunkel“ · 26.10.2026

Umfang: Standard (ein Bildschirm), nach dem verkürzten Rezept des Begleit-Skills (Abschnitt 4): Gremium eine Runde, Muss-Punkte und Vetos umgesetzt, keine zweite Runde; Detail-Profis und Vorlagen-Abgleich entfallen. Vorschau als Artifact, Quelle in docs/profis/konfigurator-start-vorschau/, nichts in der App und nichts online.

## Auftrag

- Bereich: Konfigurator (web/app/, `SCREENS.start` in web/assets/app.js), Schritt 1 von 6 „Was planst du?“: der Kunde wählt das Element (Fenster, Balkontür, Festverglasung, Hebe-Schiebe-Tür, PSK-Tür, Faltschiebewand) und die Stelle (Fenster ersetzen oder neue Öffnung), dann „Weiter zu den Fotos“. Nur diese Folie.
- Wunsch des Inhabers: „intuitive Bedienung und eine gestalterisch ansprechende Maske“, mit dem Master-Anhängsel. Als positive Beispiele und Mindestanforderung genannt: die Startseite vom 26.10.2026 und die Seite „Konfigurator von Muster Fensterbau“ (https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM).
- Korrektur des Inhabers während des Durchlaufs: Die erste Vorschau war der Start-Folie der Musterseite „Konfigurator in Violett“ nachgebaut. Das wollte er nicht: Die Folie soll „komplett losgelöst von allen anderen Folien“ entstehen, allein aus den Quellen, die er im Auftrag nennt. Regel seitdem in .claude/skills/design-dna-eeziframes/SKILL.md, Abschnitt 4 („Jede Folie für sich“). Die erste Vorschau wurde verworfen; ihre Urteile liegen als Vorfassung unter docs/profis/gremium/2026-10-26-konfigurator-start-vorfassung-*.md.
- Was der Nutzer tun soll: das richtige Element antippen, die Stelle wählen, „Weiter zu den Fotos“.
- Erfolg: Der Kunde versteht in drei Sekunden, was er wählen soll, findet „Weiter“ ohne Suchen, und der Fensterbauer bekommt das richtige Element.

## Wahl (drei Zeilen)

1. Quellen: die DNA (Gene G1, G2, G4, G5, G6, G7, G8, G9, G10, G13, G14; Bausteine Etikett mit Anker, Glas-Chip mit Fortschrittsring, runde Glas-Knöpfe, Bento, Pille mit Pfeilkreis; App-Rahmen nur als Gerüst Kopf, Frage, Fuß), die Startseite vom 26.10.2026 (Bühne mit Foto, Lichtkante und Vignette, Etikett mit Ankerpunkt, Bento mit Renderings, Umschalter mit Füllung und Punkt), die Seite „Konfigurator von Muster Fensterbau“ (Betonboden im Fensterlicht als Bühne, Gerät auf der Bühne, Glas-Chip „Foto 1 von 2“ mit Ring) und die Vorlagen 01, 09 und 13 des Inhabers (Objekt auf hartem Licht, Glas über Foto, runde Werkzeugknöpfe). Keine andere Folie des Konfigurators.
2. Richtung: mutig, ein Prinzip übersetzt: das Element als Objekt auf echtem Material, das Fensterlicht als Bühne („Das Element im Licht“); Name und Art hängen als Glas-Etikett am Objekt, das violette Licht am Boden heißt „gewählt“. Naheliegend darunter: Bento der sechs Elemente und Umschalter für die Stelle, beides von der Startseite. Nicht gebaut: überraschend (helle Folie, das Element auf Weiß mit Kontaktschatten, dunkle Kacheln), weil Bühne und Gerät des Inhabers dunkel sind.
3. Material: das Bühnenfoto der Muster-Seite (bilder/buehne.webp, Betonboden im Fensterlicht), Renderings der sechs Elemente aus dem 3-D-Modell der App (CSS-Modell, dreifach, durchsichtig), die Strichzeichnungen der App für die Kacheln (`miniWin`, mit Flügeln, Griff und Öffnungsrichtung, nach Veto der Fensterbauer zur Vorfassung), Texte der App (`OPT.art`, `ST_NAME`, `GLOSS.elementart`, `GLOSS.ersatz`, `GLOSS.neuoeffnung`, `GLOSS.balkon/festverglasung/hst/psk/fsw`); neu nur die Unterzeile „Unsicher? Nimm, was heute eingebaut ist.“ (aus dem Tipp der App gekürzt) und der Satz „Weitere Fenster nimmst du danach einzeln auf.“

## Ist und Neu

- X (heute): docs/profis/bilder/2026-10-26-konfigurator-start-ist-{tel,desk}.jpg (echte App, lokal mit KI_ATTRAPPE, „Fenster ausmessen“ angetippt). „Weiter zu den Fotos“ liegt am Telefon unter dem ersten Bildschirm.
- Y (neu): docs/profis/bilder/2026-10-26-konfigurator-start-{tel,tel-balkon,tel-neu,tel-hst,tel-erkl,desk}.jpg; Quelle docs/profis/konfigurator-start-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css aus dem Begleit-Skill, dna/bundle.css und bundle.js unverändert, start.css und start.js mit Präfix ez-, Outfit und Inter in fonts/ (OFL), Foto und Renderings in bilder/). Artifact: https://claude.ai/artifact/YEawb68mGUjJ6SCe99eD1Q

## Ideenmatrix und Gene der Folie

Gen-Fragen: Worauf sieht man das Element? Auf dem Betonboden im Fensterlicht der Muster-Seite (G4, G7). Welcher Wert leuchtet? Das gewählte Element: violettes Licht am Boden, violettes Licht in der gewählten Kachel (G2). Was lässt sich messen? Der Schritt: Fortschrittsring „Schritt 1 von 6“ (G5). Wo gehört der Wert hin? Name und Art als Etikett am Objekt, mit Ankerpunkt und gestrichelter Linie (G9). Was ist Fakt, was Gefühl? Glas-Chip und Glas-Etikett scharf über dem weichen Foto (G10). Welche Aktion an diesem Ding? Runde Glas-Knöpfe zum Blättern, runder i-Knopf auf der Etikett-Ecke (G13). Aus welchen Teilen besteht es? Sechs Kacheln als Bento (G8). Was ist noch offen? Gestrichelter Rahmen bei „Neue Öffnung“ (G1). Eine Handlung: „Weiter zu den Fotos“ (G6). Keine Fläche flach: Lichtkante, Vignette, Kontaktschatten, Kacheln mit tonalem Abfall, Lichtteich hinter dem Gerät (G14).

Rohe Ideen (verworfen): das Element im Innenfoto der Startseite (dort steht schon ein Fenster, verwirrt); die sechs Elemente als Skala zum Ziehen (zu versteckt für Erstnutzer); Listenkarten mit Bild (zu hoch für einen Bildschirm); die Stelle als Kapselreihe (zwei Zustände brauchen keinen Anteil); Koralle-Marke „Wischen zum Wechseln“ (eine Befehls-Marke nimmt den ersten Blick, stattdessen sichtbare Knöpfe).

## Änderungsliste (Y gegen X)

1. Farbwelt und Schrift: Palette „Task-App dunkel“ und Outfit statt Inter, grünem Wort und grüner Linie; Überschrift 30 px Gewicht 500 mit zweiter Stimme in Silbergrau („du?“).
2. Kopf: runder Zurück-Pfeil, Logo mit Wortmarke (Inter 18 px), „Übersicht“ und Begriffe (Buch); der Schritt als Glas-Chip mit Fortschrittsring „Schritt 1 von 6 · Start“ oben links auf der Bühne statt Versalzeile.
3. Bühne: Foto des Betonbodens im Fensterlicht (Radius 28, Lichtkante, Vignette); das Rendering steht darauf mit Kontaktschatten; violettes Licht am Boden heißt „gewählt“ und wandert mit.
4. Name und Kurzbeschreibung als Glas-Etikett mit Ankerpunkt und gestrichelter Linie; „Was ist das?“ als weißer runder i-Knopf auf der Etikett-Ecke bei allen sechs Elementen, der Begriff erscheint unter den Kacheln.
5. Zwei runde Glas-Knöpfe unten rechts blättern die Elemente; Wischen und Pfeiltasten gehen auch; keine Befehls-Marke, kein Zähler.
6. Unterzeile „Unsicher? Nimm, was heute eingebaut ist.“; das i an der Frage öffnet die Erklärung der App als Anthrazit-Kachel mit Tipp und dem Satz zu weiteren Fenstern.
7. Sechs Kacheln als Bento auf Schwarz: weiße Kacheln mit den Strichzeichnungen der App und Namen; die gewählte dunkel mit violettem Licht und Punkt.
8. Die Stelle als Umschalter in dunkler Pille, gewählt Schwarz mit violettem Punkt; darunter ein Satz aus den Begriffen der App, auch für den Fall „Öffnung wird größer“; bei „Neue Öffnung“ Koralle-Punkt und gestrichelter Rahmen am Element.
9. Fuß: eine volle weiße Pille „Weiter zu den Fotos“ mit Pfeilkreis und runder Rückweg, am Telefon unten stehend (in X unter dem Inhalt, im ersten Bildschirm nicht sichtbar).
10. Rechtliche Verweise 13 px am Ende des Inhalts, wie X.
11. Schreibtisch: das Telefon als Gerät auf dunkler Bühne mit Notizspalte (Vorschau).
12. Bewegung: Wechsel des Elements durch Einblenden mit 14 px Versatz in Wischrichtung in 220 ms, Licht und Kontaktschatten gleiten in 320 ms, Kacheln und Umschalter 150 ms, Druck 0,97 in 160 ms; nichts läuft von selbst; bei „weniger Bewegung“ sofort. In X hüpft das Modell in 720 ms und wiegt sich.

## Lösungsschlüssel

Der Kunde steht vor einem zweiflügeligen Dreh-Kipp-Fenster, das ersetzt werden soll: „Fenster“ (vorgewählt) lassen oder antippen, „Fenster ersetzen“ bleibt, „Weiter zu den Fotos“. Terrassentür, die zur Seite schiebt: „Hebe-Schiebe“ oder „PSK-Tür“, der i-Knopf erklärt den Unterschied. Wird die Öffnung größer oder war dort noch keins: „Neue Öffnung“.

## Blickprotokoll der Gestaltungsleitung (Y, 390 × 844)

Sekunde 1: das Fenster im Fensterlicht auf dem Betonboden. Sekunde 2: das Etikett „Fenster / Dreh, Kipp, fest“ am Objekt, dann „Was planst du?“ mit der Unterzeile. Sekunde 3: die weiße Pille „Weiter zu den Fotos“ bei 774 px. Schieltest: drei Formen (Bühne, Frage, Pille), das Bento als Fläche dazwischen, die gewählte Kachel die einzige dunkle. Tab-Weg: Zurück, Übersicht, Begriffe, Bühne (Pfeiltasten), i am Etikett, Voriges, Nächstes, i an der Frage, Notiz, sechs Kacheln, zwei Tasten der Stelle, Rechtliches, Rückweg, Weiter.

## Messwerte (Vorschau, werkzeuge/ und eigenes Aufnahmeskript für die App-Folie)

- Telefon 390 × 844: genau eine volle Pille im Bildschirm, Oberkante 774 px (unteres Drittel), 52 px hoch; 0 laufende Animationen nach 2,6 s; keine Konsolenfehler; kein Querscrollen; alle Ziele ab 44 × 44 px (i-Knöpfe 28 px mit 44 px Trefferfläche); Laden 0,23 s bei vierfach gedrosselter CPU; Layoutsprung 0; keine `filter`-Ebene auf Flächen (zwei `backdrop-filter` nur auf Glas über dem Foto: Chip und Etikett); 0 lazy-Bilder; Bilder 269 KB (Foto 100 KB, sechs Renderings vorgeladen).
- Schreibtisch 1280 × 800: das Gerät wird bei flachen Bildschirmen kürzer, nie kleiner (Ziele bleiben 44 px); eine volle Pille im Bild, Oberkante 720 px.
- Ruhige Fassung und ohne JavaScript: alles steht sofort (Anker, Etikett und Kacheln liegen fest im Markup; ohne JavaScript bleibt „Fenster“ gewählt).

## Farbanteile (je Pixel der nächsten der acht Farben zugeordnet; Vorgabe je Bildschirm: Farbe gesamt höchstens 12, keiner ohne Farbe)

Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Start | 96,7 (S 49 · A 20 · G 10 · W 19) | 0,3 | 0,0 | 0,6 | 2,4 | **3,3** |
| 2 Neue Öffnung | 97,0 (S 48 · A 22 · G 10 · W 17) | 0,6 | 0,0 | 0,9 | 1,6 | **3,0** |
| 3 Hebe-Schiebe, Begriff offen | 95,2 (S 40 · A 27 · G 10 · W 18) | 0,7 | 0,0 | 0,7 | 3,4 | **4,8** |
| 4 Erklärung als Bogen | 98,9 (S 35 · A 42 · G 21 · W 0) | 0,0 | 0,0 | 0,5 | 0,6 | **1,1** |
| **Folie** | 96,9 (S 43 · A 28 · G 13 · W 14) | 0,4 | 0,0 | 0,7 | 2,0 | **3,1** |

Schreibtisch 1280 × 800: 99,0 neutral (S 75 · A 11 · G 7 · W 6), Violett 0,1, Koralle 0,0, Indigo 0,2, Foto 0,7, Farbe gesamt 1,0.

Lesart: Die Folie ist ruhiger als die Website-Vorgabe (Violett 3,5, Farbe gesamt 7), weil Farbe hier nur Zustand ist: das Licht unter dem Element (auf dem hellen Boden zählt es als Grau), die gewählte Kachel, der Punkt im Umschalter und der Ring im Chip. Koralle nur als Hinweis-Punkt bei „Neue Öffnung“. Je Bildschirm unter 12 und keiner ohne Farbe (Bildschirm 4 zeigt den Bogen über abgedunkeltem Inhalt); Koralle nie größer als Violett. Der Inhaber entscheidet wie bei der Startseite, ob Zählung oder Eindruck gilt.

## Gremium (eine Runde zur neuen Fassung, blind X = heute, Y = neu; Urteile unter docs/profis/gremium/2026-10-26-konfigurator-start-*.md)

| Gruppe | Gewinner | Aufgabe / Werte | Hände Y | Vetos, rote Punkte |
| --- | --- | --- | --- | --- |
| Kunden | Y, 6 zu 0 | gelöst: Y 5 von 6 (Kai als Gegenspieler schließt bei „Fotos“), X 3 von 6 (drei scheitern am unsichtbaren „Weiter“) | 3 · 4 · 4 · 3 · 3 · 2 (Median 3) | keins |
| Gestalter | Y, 6 zu 0 | – | 4 · 3 · 4 · 3 · 4 · 4 (Median 4) | keins; Mara und Tobias würden X blockieren (Hauptaktion unsichtbar) |
| Fensterbauer | Y, 6 zu 0 | kaufen Y 4 / X 2, zeigen Y 4 / X 3, seriös 4 / 3 | 4 · 5 · 4 · 4 · 4 · 4 (Median 4) | keins |

Mehrheiten „ändern“ (alle übrigen Änderungen mit Mehrheit „behalten“, keine mit Mehrheit „zurück“): 4 Begriff dort, wo das i getippt wird, i-Knöpfe mit einer Zustandslogik (Gestalter 5:1, Fensterbauer 1); 5 die runden Glas-Knöpfe auf der Bühne weg oder leiser (Kunden 4:2, Gestalter 4:2; Fensterbauer behalten); 6 Erklärung der Frage ohne Verdrängen von Kacheln und Pille (Gestalter 4:2); 8 Satz zur Stelle vollständig über der Pille, feste Mindesthöhe (Fensterbauer 6:0, Gestalter 4:2); 10 Rechtsverweise frei von der Pille (Fensterbauer 4:2); 11 Schreibtisch der echten App zweispaltig, das Telefon im Rahmen nur als Vorschau (Fensterbauer 4:2, Kunden 4:2).

Muss-Listen (Vereinigung): nichts unter dem klebenden Fuß, Satz zur Stelle sichtbar vor „Weiter“ · Begriff am Ort des Antippens, i-Knöpfe mit einer Logik · Erklärung ohne Verdrängen · Etikett nie über dem Element, Bühne hoch genug · Renderings mit festen Maßen, vorgeladen · Pfeilknöpfe von „Weiter“ unterscheidbar · Hinweis auf weitere Fenster im Bildschirm · Rechtsverweise nie angeschnitten, „Vertrag widerrufen“ nicht in Schritt 1 (Gisela) · Schildschrift im Bild so groß wie der Fließtext · Unterzeile „Unsicher? …“ bleibt · Schreibtisch für Kunden breit.

Konsent nach dem Umbau (ohne zweite Abnahme, verkürztes Rezept): keine Faust, keine Mehrheit „zurück“, keine Vetos; Kunden lösen 5 von 6, Fensterbauer Median kaufen und zeigen 4, Gestalter Median 4. Offen bleibt Kai (2, Gegenspieler) und die Hand 3 von Lena, Tobias, Renate, Thomas und Gisela mit den unten genannten Punkten.

## Umbau nach dem Gremium (Muss-Punkte und Vetos)

- Nichts unter dem Fuß: Bühne 266 px, Frage enger, Kacheln 80 px, Satz zur Stelle gekürzt („Das neue kommt in dieselbe Öffnung. Soll sie größer werden, etwa für eine Tür, wähle „Neue Öffnung“.“) mit Mindesthöhe; im ersten Bildschirm stehen Bühne, Frage, Unterzeile, sechs Kacheln, Umschalter und der ganze Satz über der Pille (gemessen: Satz endet bei 756 px, Fuß ab 760).
- Begriff am Ort des Antippens: der i-Ring am Etikett öffnet den Begriff direkt unter der Bühne (Anthrazit-Kachel), nicht mehr unter den Kacheln. Eine Zustandslogik für beide i: Umriss zu, Violett mit schwarzem i offen; nie voll weiß. Größe bleibt 28 px Ring mit 44 px Trefferfläche nach DNA Abschnitt 9 (Gestalter wollten 44 px sichtbar; die DNA des Inhabers geht vor).
- Erklärung der Frage als Bogen über dem Inhalt (200 ms, Opazität und 16 px von unten), Kacheln und Pille bleiben stehen; schließen mit ×, Grund oder Esc.
- Die zwei runden Glas-Knöpfe auf der Bühne entfallen (vier Kunden lasen sie als „Weiter/Zurück“); Element wechseln über Kacheln, Wischen mit Achsensperre und Pfeiltasten. Damit liegen nur noch zwei Glasflächen über dem Foto (Chip, Etikett).
- Hinweis auf weitere Fenster in der Unterzeile: „Unsicher? Nimm, was heute eingebaut ist. Weitere Fenster kommen danach einzeln dran.“
- Schildschrift am Etikett 17/14 px (vorher 16/13); Etikett schmaler als die Lücke zum Element, Objekt 164 px breit.
- Renderings mit festen Maßen (width/height je Bild) und nach dem Laden vorgeholt; Kontaktschatten wechselt mit dem Element in 220 ms, nur das Licht gleitet 320 ms nach; der gestrichelte Rahmen bei „Neue Öffnung“ zeichnet sich einmal in 300 ms (Opazität und Maß).
- Rechtsverweise mit 18 px Abstand über dem Fuß; „Vertrag widerrufen“ bleibt erster Verweis (Vorgabe docs/GESTALTUNG.md, § 356a BGB: der Knopf steht in jeder Fußzeile); nicht umgesetzt, Grund im Protokoll.
- Zeilenkopf „Element — Fenster“ entfällt (Name stand viermal auf dem Bildschirm); die Gruppe hat eine unsichtbare Beschriftung für Screenreader.
- Nicht umgesetzt (Kann oder gegen die DNA): „du?“ weiß (DNA: zweite Stimme in Silbergrau), Zweitzeile im Umschalter (Pille 44 px, der Satz darunter trägt sie), Lichtschatten mit Sprossen im Foto (Foto des Inhabers), anderer Boden (Renate allein), „Fenster ersetzen“ als „Bestehendes ersetzen“ (Text der App, Vorschlag an den Inhaber), Schreibtisch der echten App zweispaltig (gehört zur Übernahme, siehe unten).

## Änderungstabelle für den Inhaber

| Nr. | Änderung | Zweck | Urteil | Stand |
| --- | --- | --- | --- | --- |
| 1 | Palette „Task-App dunkel“, Outfit, Frage 30/500 mit zweiter Stimme „du?“ | Marke | behalten (G 5:1, K 4:2, F 6:0) | bleibt |
| 2 | Kopf mit rundem Zurück, Marke, Übersicht, Begriffe; Schritt als Glas-Chip mit Ring | Blickführung | behalten (alle) | bleibt |
| 3 | Bühne: Betonboden im Fensterlicht, Element steht darauf, Kontaktschatten, violettes Licht | Marke, Verständnis | behalten (G 4:2, K 5:1, F 6:0) | geändert: 266 px, Objekt 164 px |
| 4 | Glas-Etikett mit Anker, i-Ring bei allen sechs | Verständnis | ändern (G 5:1): Begriff am Ort, eine Logik | geändert |
| 5 | Runde Glas-Knöpfe zum Blättern | Bedienung | ändern (K 4:2, G 4:2): weg | zurückgenommen |
| 6 | Unterzeile und Erklärung der Frage | Vertrauen | ändern (G 4:2): Bogen; K: Hinweis auf weitere Fenster | geändert |
| 7 | Bento der sechs Kacheln mit Strichzeichnungen der App, gewählt dunkel mit Licht | Verständnis, Daten | behalten (alle) | geändert: 80 px, ohne Zeilenkopf |
| 8 | Die Stelle als Umschalter mit Satz aus den Begriffen der App | Daten | ändern (F 6:0, G 4:2): Satz sichtbar, Mindesthöhe | geändert |
| 9 | Fuß mit einer vollen Pille, am Telefon unten stehend | Blickführung | behalten (alle) | bleibt |
| 10 | Rechtsverweise 13 px am Ende | Technik, Recht | behalten (K 4:2, G 5:1); F 4:2 ändern: frei von der Pille | geändert: 18 px Abstand; Reihenfolge bleibt (Vorgabe) |
| 11 | Schreibtisch als Gerät mit Notizspalte (Vorschau) | Vorlage | ändern (F 4:2, K 4:2): App breit | bleibt in der Vorschau; Übernahme zweispaltig |
| 12 | Bewegung nur als Zustand und Rückmeldung | Marke | behalten (alle); Noah: Schatten mit dem Element | geändert: Schatten 220 ms, Rahmen zeichnet sich |

Blickprotokoll vorher und nachher: vorher (heutige App) Fenster, grünes „planst“, „Fenster“; „Weiter“ nicht im Bild, drei von sechs Kunden scheitern dort. Nachher: Fenster im Fensterlicht, Kacheln mit Namen, „Weiter zu den Fotos“; fünf von sechs Kunden lösen die Aufgabe ohne Scrollen.

Selbst entschieden: Bühnenfoto von der Muster-Seite, Strichzeichnungen der App statt Renderings in den Kacheln, Unterzeile und Satz zu weiteren Fenstern, Bogen statt Kachel für die Erklärung, Pfeilknöpfe weg. Echtes Material, das fehlt: keins (Foto, Renderings und Texte sind die des Projekts). Stimmen: alle simuliert; Realitäts-Check unten.

Kann-Liste (nur auf Wunsch): „Fenster ersetzen“ bei Türen als „Bestehendes ersetzen“ (Text der App) · „Fotos“ in der Pille erklären („Weiter zu den zwei Fotos“) · Wort unter Buch und Zurück-Pfeil · „Dreh, Kipp, fest“ so setzen, dass es nicht wie eine Wahl aussieht · Zweitzeile „Dort ist schon eins / Dort war noch keins“ im Umschalter · ein Name „Hebe-Schiebe-Tür“ auf Kachel und Etikett · Hinweis zu den Fotos vor Schritt 2 · „du?“ weiß (gegen die DNA) · Verweise in der Reihenfolge Impressum, Datenschutz, AGB, Widerruf (gegen die Vorgabe).

## Übernahme in die App (noch nicht geschehen)

Die Vorschau ist nicht in web/app/. Für die Übernahme: `SCREENS.start` in web/assets/app.js baut den Rahmen `.scr.dna` (wie `lageDna`), die Bühne nimmt das Foto (web/bilder/…/buehne.webp, 1000 px) und das echte 3-D-Modell (`model(startWin(w), { frei: true })`) statt der Renderings, Wischen und Pfeiltasten bleiben (`startWischen`), die Kacheln nutzen `svgIcon(miniWin(v))`, die Stelle schreibt `w.neu`, der Fuß ist `.lg-fuss`; Regeln in app.css, Abschnitt „Design-DNA im Konfigurator“; Prüfsuite NUR=22 und NUR=16. Schriften lokal (web/fonts/outfit-latin-wght.woff), CSP unverändert; im Kundenlink einer Instanz steht deren Zeichen im Kopf. Am Schreibtisch braucht die echte App ein zweispaltiges Layout (Bühne links, Frage und Kacheln rechts); das Gerät mit Notizspalte ist nur die Vorschau.

## Offen

- Kann-Liste des Gremiums (unten), nur auf Wunsch.
- Farbanteile (siehe oben): Entscheidung des Inhabers.
- Übernahme in die App auf sein Ja.

## Realitäts-Check (Fragekarte)

Zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe, am Telefon auf diesem Bildschirm: „Was würdest du jetzt tun?“ (wörtlich notieren), „Welches Element ist deins?“, „Wo geht es weiter?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“.

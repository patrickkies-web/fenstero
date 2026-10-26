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

- Telefon 390 × 844: genau eine volle Pille im Bildschirm, Oberkante 774 px (unteres Drittel), 52 px hoch; 0 laufende Animationen nach 2,6 s; keine Konsolenfehler; kein Querscrollen; alle Ziele ab 44 × 44 px (i-Knöpfe 28 px mit 44 px Trefferfläche); Laden 0,31 s bei vierfach gedrosselter CPU; Layoutsprung 0; keine `filter`-Ebene auf Flächen (vier `backdrop-filter` nur auf Glas über dem Foto: Chip, Etikett, zwei Knöpfe); 0 lazy-Bilder; Bilder 124 KB.
- Schreibtisch 1280 × 800: das Gerät wird bei flachen Bildschirmen kürzer, nie kleiner (Ziele bleiben 44 px); eine volle Pille im Bild, Oberkante 720 px.
- Ruhige Fassung und ohne JavaScript: alles steht sofort (Anker, Etikett und Kacheln liegen fest im Markup; ohne JavaScript bleibt „Fenster“ gewählt).

## Farbanteile (je Pixel der nächsten der acht Farben zugeordnet; Vorgabe je Bildschirm: Farbe gesamt höchstens 12, keiner ohne Farbe)

Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Start | 97,0 (S 48 · A 19 · G 9 · W 20) | 0,4 | 0,0 | 0,5 | 2,1 | **3,0** |
| 2 Neue Öffnung | 97,0 (S 50 · A 20 · G 9 · W 18) | 0,7 | 0,0 | 0,9 | 1,3 | **3,0** |
| 3 Hebe-Schiebe, „Was ist das?“ | 94,7 (S 49 · A 17 · G 9 · W 19) | 0,8 | 0,0 | 0,6 | 3,9 | **5,3** |
| 4 Erklärung offen | 95,4 (S 30 · A 41 · G 10 · W 14) | 0,5 | 0,0 | 0,2 | 3,9 | **4,6** |
| **Folie** | 96,0 (S 44 · A 24 · G 10 · W 18) | 0,6 | 0,0 | 0,6 | 2,8 | **4,0** |

Schreibtisch 1280 × 800: 99,1 neutral (S 75 · A 10 · G 7 · W 7), Violett 0,1, Koralle 0,0, Indigo 0,2, Foto 0,6, Farbe gesamt 0,9.

Lesart: Die Folie ist ruhiger als die Website-Vorgabe (Violett 3,5, Farbe gesamt 7), weil Farbe hier nur Zustand ist: das Licht unter dem Element (auf dem hellen Boden zählt es als Grau), die gewählte Kachel, der Punkt im Umschalter und der Ring im Chip. Koralle nur als Hinweis-Punkt bei „Neue Öffnung“. Je Bildschirm unter 12 und keiner ohne Farbe; Koralle nie größer als Violett. Der Inhaber entscheidet wie bei der Startseite, ob Zählung oder Eindruck gilt.

## Gremium (eine Runde zur neuen Fassung, blind X = heute, Y = neu; Urteile unter docs/profis/gremium/2026-10-26-konfigurator-start-*.md)

GREMIUM-ERGEBNIS

## Umbau nach dem Gremium (Muss-Punkte und Vetos)

UMBAU

## Änderungstabelle für den Inhaber

TABELLE

## Übernahme in die App (noch nicht geschehen)

Die Vorschau ist nicht in web/app/. Für die Übernahme: `SCREENS.start` in web/assets/app.js baut den Rahmen `.scr.dna` (wie `lageDna`), die Bühne nimmt das Foto (web/bilder/…/buehne.webp, 1000 px) und das echte 3-D-Modell (`model(startWin(w), { frei: true })`) statt der Renderings, Wischen und Pfeiltasten bleiben (`startWischen`), die Kacheln nutzen `svgIcon(miniWin(v))`, die Stelle schreibt `w.neu`, der Fuß ist `.lg-fuss`; Regeln in app.css, Abschnitt „Design-DNA im Konfigurator“; Prüfsuite NUR=22 und NUR=16. Schriften lokal (web/fonts/outfit-latin-wght.woff), CSP unverändert; im Kundenlink einer Instanz steht deren Zeichen im Kopf. Am Schreibtisch braucht die echte App ein zweispaltiges Layout (Bühne links, Frage und Kacheln rechts); das Gerät mit Notizspalte ist nur die Vorschau.

## Offen

- Kann-Liste des Gremiums (unten), nur auf Wunsch.
- Farbanteile (siehe oben): Entscheidung des Inhabers.
- Übernahme in die App auf sein Ja.

## Realitäts-Check (Fragekarte)

Zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe, am Telefon auf diesem Bildschirm: „Was würdest du jetzt tun?“ (wörtlich notieren), „Welches Element ist deins?“, „Wo geht es weiter?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“.

# Profis · Konfigurator, Schritt 1 „Was planst du?“ nach Design-DNA und Palette „Task-App dunkel“ · 26.10.2026

Umfang: Standard (ein Bildschirm), nach dem verkürzten Rezept des Begleit-Skills (Abschnitt 4): Gremium eine Runde, Muss-Punkte und Vetos umgesetzt, keine zweite Runde; Detail-Profis und Vorlagen-Abgleich entfallen. Vorschau als Artifact, Quelle in docs/profis/konfigurator-start-vorschau/, nichts in der App und nichts online.

## Auftrag

- Bereich: Konfigurator (web/app/, `SCREENS.start` in web/assets/app.js), Schritt 1 von 6 „Was planst du?“: der Kunde wählt das Element (Fenster, Balkontür, Festverglasung, Hebe-Schiebe-Tür, PSK-Tür, Faltschiebewand) und die Stelle (Fenster ersetzen oder neue Öffnung), dann „Weiter zu den Fotos“. Nur diese Folie.
- Wunsch des Inhabers: „intuitive Bedienung und eine gestalterisch ansprechende Maske“, mit dem Master-Anhängsel (Gestaltung nur nach `design-dna` und dem Begleit-Skill, Palette „Task-App dunkel“, Untergrenze die Startseite vom 26.10.2026). Als positive Beispiele und Mindestanforderung genannt: die Startseite und die Vorschau „Konfigurator von Muster Fensterbau“ (https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM, deren Hero diese Folie als Attrappe auf dem Gerät zeigt).
- Was der Nutzer tun soll: das richtige Element antippen, die Stelle wählen, „Weiter zu den Fotos“.
- Erfolg: Der Kunde versteht in drei Sekunden, was er wählen soll, findet „Weiter“ ohne Suchen, und der Fensterbauer bekommt das richtige Element.

## Wahl (drei Zeilen)

1. Rahmen: der App-Rahmen aus `design-dna` Abschnitt 9, wie ihn die Musterfolie „Konfigurator in Violett“ (Start) vorgibt: Kopf mit rundem Zurück, Logo, Übersicht und Begriffen; Stationen-Band „Start · 1 von 6“; Bühne in Anthrazit; Frage mit i und Notiz; weiße Karte mit Element und Stelle; Fuß mit rundem Rückweg und der einen weißen Pille „Weiter zu den Fotos“, am Telefon unten stehend. Knöpfe und Rahmen nicht neu erfunden.
2. Richtung: mutig in einem Punkt (G12 aus den Vorlagen 01 und 03: das Element ragt über die Bühnenkante, der i-Knopf sitzt auf der Ecke des Etiketts), sonst naheliegend; dazu die Tiefe der Startseite (G14: Bühne mit tonalem Abfall und Lichtkante, Kontaktschatten unter dem Objekt, Lichtteich hinter dem Gerät, Leuchten ohne Weichzeichner; G15: ein schweres Element je Bild, hier die Frage).
3. Material: Renderings der sechs Elemente aus dem 3-D-Modell der App (CSS-Modell, bei 3-facher Auflösung mit durchsichtigem Grund aufgenommen, docs/profis/konfigurator-start-vorschau/bilder/), Texte der App (`OPT.art`, `ST_NAME`, `GLOSS.elementart`, Hinweis zur neuen Öffnung); neu nur die Unterzeile „Unsicher? Nimm, was heute eingebaut ist.“ (aus dem Tipp der App gekürzt).

Nicht gebaut: überraschend (die Folie beginnt hell, das Element steht auf Weiß mit Kontaktschatten, die Kacheln dunkel): widerspricht dem App-Rahmen (Bühne Anthrazit), den der Inhaber mit „Lage in Violett“ angenommen hat.

## Ist und Neu

- X (heute): docs/profis/bilder/2026-10-26-konfigurator-start-ist-{tel,desk}.jpg (echte App, lokal mit KI_ATTRAPPE, „Fenster ausmessen“ angetippt). „Weiter zu den Fotos“ liegt am Telefon unter dem ersten Bildschirm.
- Y (neu): docs/profis/bilder/2026-10-26-konfigurator-start-{tel,tel-neu,tel-hst,tel-erkl,desk}.jpg; Quelle docs/profis/konfigurator-start-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css aus dem Begleit-Skill, dna/bundle.css und bundle.js unverändert, start.css und start.js mit Präfix ez-, Outfit und Inter in fonts/ (OFL), Renderings in bilder/). Artifact: https://claude.ai/artifact/YEawb68mGUjJ6SCe99eD1Q
- Familientest: neben der Musterfolie „Konfigurator in Violett“ (Start) dieselbe Hand: Kopf, Band, Bühne, Etikett, Kacheln, Schalter, Fuß; tiefer durch Lichtkante, Kontaktschatten, Rahmenbruch und Unterzeile.

## Gene der Folie

G4 das Element als Objekt auf der Bühne · G12 es ragt 14 px über die Bühnenkante, der i-Knopf sitzt auf der Etikett-Ecke · G2 violettes Leuchten unter dem Element als Zustand „gewählt“, gewählte Kachel und Zählerpunkt violett · G5 Maßstab mit Strichmarken am Boden, Stationen-Band mit Punkten, Zähler 1 von 6 · G9 Name und Kurzbeschreibung als Etikett an der Sache mit gestricheltem Strich · G13 runde Knöpfe (Zurück, i, Rückweg) · G1 gestrichelter Rahmen heißt „noch nicht da“ (neue Öffnung) · G6 genau eine volle Pille · G14 keine Fläche ist flach · G15 die Frage als schweres Element (30 px, 500, zweite Stimme in Silbergrau).

## Änderungsliste (Y gegen X)

1. Farbwelt und Schrift: Palette „Task-App dunkel“ und Outfit statt Inter, grünem Wort und grüner Linie; Überschrift 30 px Gewicht 500 mit zweiter Stimme in Silbergrau statt grünem Wort.
2. Kopf: runder Zurück-Pfeil, Logo mit Wortmarke, „Übersicht“ und Begriffe (Buch); Stationen-Band „Start · sechs Punkte · 1 von 6“ statt Versalzeile „SCHRITT 1 VON 6 · START“.
3. Bühne: Anthrazit-Kachel (Radius 28) mit Lichtkante, Maßstab am Boden, violettes Leuchten und Kontaktschatten unter dem Element; das Rendering steht links und ragt über die Bühnenkante.
4. Name und Kurzbeschreibung als Etikett an der Sache; „Was ist das?“ als runder i-Knopf auf der Etikett-Ecke, nur wo die App einen Begriff erklärt (Balkontür, Hebe-Schiebe, PSK).
5. Hinweis-Marke „Wischen zum Wechseln“ in Koralle oben links; Zähler mit sechs Punkten oben rechts.
6. Unterzeile „Unsicher? Nimm, was heute eingebaut ist.“; das i an der Frage öffnet die Erklärung der App als Kachel mit Tipp.
7. Sechs Kacheln auf weißer Karte mit Renderings und Namen, gewählt Violett mit schwarzer Schrift; Feldkopf „Element antippen — Fenster“.
8. Die Stelle als Schalter mit zwei Zeilen auf derselben Karte; bei „Neue Öffnung“ Hinweis mit Koralle-Punkt und gestrichelter Rahmen um das Element.
9. Fuß: eine volle weiße Pille „Weiter zu den Fotos“ mit Pfeilkreis und runder Rückweg, am Telefon unten stehend (in X unter dem Inhalt, im ersten Bildschirm nicht sichtbar).
10. Rechtliche Verweise 13 px am Ende des Inhalts, wie X.
11. Schreibtisch: das Telefon als Gerät auf dunkler Bühne mit Notizspalte (Vorschau).
12. Bewegung: Wechsel des Elements durch Einblenden mit 14 px Versatz in 220 ms, Leuchten und Kontaktschatten gleiten in 320 ms, Kacheln und Schalter 320 ms, Druck 0,97 in 160 ms; nichts läuft von selbst; bei „weniger Bewegung“ sofort. In X hüpft das Modell in 720 ms und wiegt sich.

## Lösungsschlüssel

Der Kunde steht vor einem zweiflügeligen Dreh-Kipp-Fenster, das ersetzt werden soll: „Fenster“ (vorgewählt) lassen oder antippen, „Fenster ersetzen“ bleibt, „Weiter zu den Fotos“. Terrassentür, die zur Seite schiebt: „Hebe-Schiebe“ oder „PSK-Tür“, „Was ist das?“ erklärt den Unterschied. Nur wo noch kein Fenster ist: „Neue Öffnung“.

## Blickprotokoll der Gestaltungsleitung (Y, 390 × 844)

Sekunde 1: das Fenster auf der Bühne mit dem violetten Licht darunter. Sekunde 2: „Was planst du?“ mit der Unterzeile. Sekunde 3: die weiße Pille „Weiter zu den Fotos“ bei 774 px. Schieltest: drei Formen (Bühne, Frage, Pille), die weiße Karte als vierte Fläche, die Pille der hellste kleine Punkt unten. Tab-Weg: Zurück, Übersicht, Begriffe, Bühne (Pfeiltasten), i, Notiz, sechs Kacheln, zwei Tasten der Stelle, Rechtliches, Rückweg, Weiter.

## Messwerte (Vorschau, werkzeuge/ und eigenes Aufnahmeskript für die App-Folie)

- Telefon 390 × 844: genau eine volle Pille im Bildschirm, Oberkante 774 px (unteres Drittel), 52 px hoch; 0 laufende Animationen nach 2,6 s; keine Konsolenfehler; kein Querscrollen; alle Ziele ab 44 × 44 px (i-Knöpfe 28 px mit 44 px Trefferfläche); Laden 0,25 s bei vierfach gedrosselter CPU; Layoutsprung 0; keine `filter`-Ebene; 0 lazy-Bilder; Bilder 168 KB.
- Schreibtisch 1280 × 800: das Gerät wird bei flachen Bildschirmen kürzer, nie kleiner (Ziele bleiben 44 px); eine volle Pille im Bild, Oberkante 720 px.
- Ruhige Fassung und ohne JavaScript: alles steht sofort (Maßstab und Zähler liegen fest im Markup).

## Farbanteile (je Pixel der nächsten der acht Farben zugeordnet; Vorgabe je Bildschirm: Farbe gesamt höchstens 12, keiner ohne Farbe)

Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Start | 91,1 (S 36 · A 16 · G 8 · W 32) | 5,2 | 1,1 | 0,4 | 2,1 | **8,9** |
| 2 Neue Öffnung | 90,7 (S 29 · A 15 · G 7 · W 40) | 5,3 | 1,2 | 1,0 | 1,8 | **9,3** |
| 3 Hebe-Schiebe, „Was ist das?“ | 89,7 (S 26 · A 13 · G 10 · W 41) | 5,7 | 1,2 | 0,3 | 3,1 | **10,3** |
| 4 Erklärung offen | 94,4 (S 27 · A 41 · G 9 · W 17) | 1,5 | 1,1 | 0,2 | 2,7 | **5,6** |
| **Folie** | 91,5 (S 29 · A 21 · G 8 · W 33) | 4,4 | 1,2 | 0,5 | 2,4 | **8,5** |

Schreibtisch 1280 × 800: 97,9 neutral (S 74 · A 10 · G 5 · W 8), Violett 1,0, Koralle 0,4, Indigo 0,1, Renderings 0,7, Farbe gesamt 2,1.

Abweichungen: Violett liegt über 3,5 (gewählte Kachel und Leuchten; Farbe heißt hier Zustand), Indigo unter 1,5 (nur Ringe und der Hof des Leuchtens), Weiß über 26 (die weiße Karte mit Element und Stelle, wie in der Musterfolie). Je Bildschirm bleibt alles unter 12 und keiner ohne Farbe. Der Inhaber entscheidet wie bei der Startseite, ob Zählung oder Eindruck gilt.

## Gremium (eine Runde, blind X = heute, Y = neu; Urteile unter docs/profis/gremium/2026-10-26-konfigurator-start-*.md)

GREMIUM-ERGEBNIS

## Umbau nach dem Gremium (Muss-Punkte und Vetos)

UMBAU

## Änderungstabelle für den Inhaber

TABELLE

## Übernahme in die App (noch nicht geschehen)

Die Vorschau ist nicht in web/app/. Für die Übernahme: `SCREENS.start` in web/assets/app.js baut den Rahmen `.scr.dna` (wie `lageDna`), die Bühne nimmt das echte 3-D-Modell (`model(startWin(w), { frei: true })`) statt der Renderings, Wischen und Pfeiltasten bleiben (`startWischen`), die Stelle schreibt `w.neu`, der Fuß ist `.lg-fuss`; Regeln in app.css, Abschnitt „Design-DNA im Konfigurator“; Prüfsuite NUR=22 und NUR=16. Schriften lokal (web/fonts/outfit-latin-wght.woff), CSP unverändert.

## Offen

- Kann-Liste des Gremiums (unten), nur auf Wunsch.
- Farbanteile (siehe oben): Entscheidung des Inhabers.
- Übernahme in die App auf sein Ja.

## Realitäts-Check (Fragekarte)

Zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe, am Telefon auf diesem Bildschirm: „Was würdest du jetzt tun?“ (wörtlich notieren), „Welches Element ist deins?“, „Wo geht es weiter?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“.

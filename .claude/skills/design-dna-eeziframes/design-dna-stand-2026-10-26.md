---
name: "design-dna"
description: "Seiten, Abschnitte oder Elemente im Stil des Inhabers neu gestalten oder überarbeiten, als Schnitt aus seinen Vorlagen. Laden bei „design-dna“, „in meinem Stil“, „wie meine Vorlagen“ oder „mit der DNA“."
---

# Design-DNA

Der Inhaber hat einen klaren Geschmack, gewonnen aus seinen gesammelten Vorlagen. Dieser Skill sorgt dafür, dass jede Seite aussieht wie ein Schnitt aus all diesen Vorlagen und nicht wie eine Standard-Vorlage. Er hat vier Schichten:

1. **Gene** – die Prinzipien, die alle Vorlagen verbinden. Sie entscheiden, welche Idee passt.
2. **Formensprache** – feste Werte für Farbe, Schrift, Rundung, Schatten, Bewegung.
3. **Bausteine** – fertig gebaute Elemente in genau diesem Look.
4. **Musterseite** – eine Seite aus allen Bausteinen. Jede neue Seite wird an ihr gemessen.

Für App-Bildschirme (Konfigurator von eeziframes) gelten zusätzlich die feste Farbwelt in Abschnitt 8 und der App-Rahmen in Abschnitt 9. Beides ist verbindlich, sobald dieser Skill geladen ist, auch in neuen Chats ohne Vorgeschichte. Für die Website von eeziframes gilt zusätzlich der Begleit-Skill `design-dna-eeziframes` im Projekt (.claude/skills/design-dna-eeziframes/): Palette als fertige Token-Datei, Ergänzungen der Formensprache vom 26.10.2026, Rezept je Seite, Messwerkzeuge, Prompt-Vorlage.

## 0. Rangfolge

1. Die Worte des Inhabers im Auftrag.
2. Die Marke des Projekts: Logo, Name, echte Inhalte, echte Bilder, rechtliche Texte. Eine Markenfarbe darf `signal` oder ein Leuchtpaar ersetzen, nie den Grund.
3. **Diese DNA** für Look, Komposition und Bewegung, mit der Farbwelt „Task-App dunkel“ (Abschnitt 8) als Standard-Palette. Ältere Markenregeln eines Projekts (bei eeziframes: Inter, Schriftgrößen 13/15/17/24/32/40, ein grünes Wort je Überschrift, Cream-Pille) gelten dort nicht, wo dieser Skill gestaltet; Logo, Name und Inhalte bleiben.
4. Im Projekt eeziframes der Begleit-Skill `design-dna-eeziframes` (Werte, Rezept, Entscheidungen des Inhabers).
5. Handwerksregeln anderer Skills (emil-design-eng, impeccable) nur, wo sie dieser DNA nicht widersprechen. `premium-gestaltung`, `ultimativ-webdesign` und `webdesign-wow` gehören zur früheren Richtung und werden für Gestaltung nicht mehr geladen (Inhaber, 26.10.2026); ihre Regeln (Pille nur im Band 460–600 px, ein farbiges Wort je Überschrift, Figurenwelt, Messband-Hero) gelten nicht. Wenn design-dna geladen ist, gilt ausdrücklich: neutraler Grund in Hell, Dunkel oder Warm statt Pflicht-Dunkel; Leuchtflächen aus Verläufen sind erlaubt; große Zahlen im dünnen Schnitt sind erlaubt; Kacheln mit echtem Inhalt (Bento) sind erlaubt.

## 1. Quellen laden – immer zuerst

- **Design-System „Design-DNA“:** https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o – mit dem Artifact-Werkzeug lesen (`read`, `path`): zuerst `project/README.md`, dann `project/bewegung.md`, `project/tokens.json`, `project/components/bundle.css`, `project/components/bundle.js` und die `project/components/<Baustein>/README.md` der Bausteine, die der Auftrag braucht.
- **Musterseite (Website):** https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97 – lesen (`read`). Sie enthält Tokens, bundle.css und bundle.js eingebettet und zeigt, wie alles zusammenspielt.
- **Musterseiten (App, Konfigurator):** „Konfigurator in Violett“ https://claude.ai/artifact/1vVq72cTJCJMRBxkrchmJX (Start, Fotos, Messen, Ränder, Ergebnis, Lage 1 und 2 zum Durchtippen) und „Lage in Violett“ https://claude.ai/artifact/RrGJ6AtBUWhKJQo5APBPCq (online in der App). Vor jedem App-Bildschirm lesen und den Rahmen daraus übernehmen.
- Code übernehmen statt nachbauen: Tokens und `bundle.css`/`bundle.js` unverändert einbinden, eigene Klassen mit Projektpräfix daneben; die Farbwerte danach mit Abschnitt 8 überschreiben.
- Ist das Artifact-Werkzeug nicht da oder eine Quelle nicht lesbar, gelten die Kurzfassungen in Abschnitt 5, 8, 9 und 10. Nie einen eigenen Look improvisieren, und das im Ergebnis sagen.

## 2. Die Gene

Jede Fläche einer Verkaufs- oder Erlebnisseite trägt mindestens vier Gene, und ich kann sagen, welche. Die Frage dahinter übersetzt das Gen auf den Abschnitt.

| Gen | Was es heißt | Frage für den Abschnitt |
| --- | --- | --- |
| G1 Weich trifft präzise | Leuchten und glänzendes Material gegen Punktraster, Strichmarken, Schraffur, gestrichelte Linien. Schraffur heißt immer „Rest, Platzhalter, noch nicht“ (nicht gewähltes Stockwerk, leerer Platz, ungenutzter Teil eines Balkens) | Was ist hier weich, was präzise? Was ist noch offen? |
| G2 Neutraler Raum, leuchtender Inhalt | Grund farblos; Farbe nur als Leuchten, das einen Zustand oder Wert zeigt | Welcher Wert darf hier leuchten? |
| G3 Die Zahl ist der Held | Groß, dünn bis mittel, Einheit und Nachkommastellen flüstern klein daneben („160 gr“, „3.219676,12“, „57 %“) | Welche Zahl ist das Ergebnis? |
| G4 Das Interface ist ein Objekt | Geräte gekippt auf einer Bühne aus echtem Material mit hartem Licht und Schattenkante (Putz, Beton, dunkler Stein, violetter Satin), gern in Händen | Worauf oder worin sieht man das? |
| G5 Skalen und Strichmarken | Lineal, Bogen mit Strichen (auch als Halbkreis-Anzeige), Stationen, Fortschritt „Schritt 2 von 5“ | Was lässt sich hier messen? |
| G6 Handlung = volle Pille | Eine volle Pille je Bildschirm, mit Pfeilkreis darin; alles andere Umriss oder grau | Was ist die eine Handlung? |
| G7 Ein besonderes Material | Gel, Flüssigmetall, Riffelglas, Milchglas, echtes Produkt | Welches Ding steckt dahinter, und woraus ist es? |
| G8 Zerlegen und neu ordnen | Teile treten aus der Fläche, ordnen sich zum Bento; Karten in Karte nur als dunkle Innenkarte mit dem Wert | Aus welchen Teilen besteht es? |
| G9 Daten an der echten Sache | Werte hängen als Etikett an der Stelle des Objekts | Wo gehört der Wert hin? |
| G10 Scharf vor unscharf | Kleine scharfe Oberfläche vorn, weiches Bild oder Leuchten dahinter; Milchglas-Chips und -Karten über echtem Foto | Was ist Fakt, was Gefühl? |
| G11 Werte als Kapselreihe | Ein Wert, Anteil oder Verlauf als Reihe abgerundeter Stäbchen (Pillenbalken): gefüllt = erreicht, grau oder schraffiert = Rest, ein Stäbchen als Marke hervorgehoben; Regler als Kapsel mit Knopf | Welcher Anteil lässt sich als Reihe zeigen? |
| G12 Das Objekt bricht aus dem Rahmen | Produkt, Bild oder Rendering ragt über den Rand seiner Karte hinaus, der runde Knopf sitzt auf der Kante | Was darf hier aus der Fläche treten? |
| G13 Runde Knöpfe | Navigation als Ring (Umriss, 44–52 px), Aktion an der Sache als voller Kreis mit Pfeil (weiß auf Dunkel, schwarz auf Hell), oft auf der Kartenecke; Werkzeuge als senkrechte Reihe runder Glas-Knöpfe | Welche Aktion gehört an genau dieses Ding? |
| G14 Keine Fläche ist flach | Jede Karte, Kachel und Bühne hat Licht: tonaler Abfall (oben links heller, unten dunkler), 1-px-Lichtkante oben, Vignette und Lichtkante auf Fotos, Kontaktschatten unter Objekten, Lichtteich hinter der Bühne; Leuchten als reine radiale Verläufe, nie als Weichzeichner | Woher kommt hier das Licht, und was wirft Schatten? |
| G15 Ein schweres Element je Bild | Genau eines trägt das Gewicht: der Titel in 600–700 oder die Zahl; alles andere drei Stufen leichter (Labels 400, kleine Zahlen 300, große 200–250, Lesetext in `tinte-2`) | Was ist hier das eine Schwere? |

**Bewegungs-Gene** (Rezepte mit Dauer und Kurve in `bewegung.md`): Auftritt aus der Unschärfe (nur im Hero; unterhalb steht alles sofort, sonst wirkt die Seite beim schnellen Scrollen zu langsam) · ein Element reist durch die Szenen · Vorhang von unten mit Wechsel hell/dunkel · Teile treten mit dem Scrollen heraus · lebendes Raster · Feinzeichnung zeichnet sich · Leuchten folgt dem Wert · Zahl rastet ein · Werte erscheinen an der Sache · Schrift als Fenster · Kapselreihe füllt sich von links (Stäbchen nacheinander, 12–20 ms Versatz) · Regler-Knopf gleitet mit Federn. In der App nur Rückmeldung und Zustand (Abschnitt 9).

## 3. Ablauf je Auftrag – erst die Idee, dann die Regeln

1. **Verstehen.** Ein Satz: worum es geht, für wen, was der Besucher tun soll. Website oder App? Geschicktes Material sortieren: *Vorbild* (Prinzip übernehmen), *Material* (genau so einbauen), *Gegenbeispiel* (so nicht). Fehlt die Rolle, frage ich einmal.
2. **Bestand ansehen** (bei Überarbeitung): Bildschirmfotos bei 390 und 1280 px, alle Inhalte, Bilder, Zahlen und Rechtstexte auflisten. Echte Inhalte bleiben; was fehlt, wird als Platzhalter benannt, nie erfunden.
3. **Szenen bilden.** Website: eine Folge von drei bis fünf Szenen (`dna-szene`) mit Vorhang, im Wechsel hell und dunkel. App: je Bildschirm eine Folie im Rahmen von Abschnitt 9 (Bühne oben, Frage, Karten, Fuß).
4. **Ideenmatrix.** Für jede Szene oder Folie die Gen-Fragen beantworten und daraus mindestens sechs rohe Ideen notieren. Dann drei Richtungen: naheliegend, mutig, überraschend (zwei Vorlagen kreuzen, ein Prinzip übersetzen, einmal umdrehen). Bei klarem Auftrag die stärkste bauen und die anderen in einer Zeile nennen.
5. **Bausteine zuordnen.** Je Idee: welcher Baustein trägt sie (Kennzahl, Leuchtkachel, Pille, BildImSatz, Etikett, Punktraster, Stufendiagramm, Skala, Geraetebuehne, Bento, Schriftfenster, Schritte, Szenen, Auftritt; dazu die Bausteine aus Abschnitt 10; in der App die lg-Bausteine aus Abschnitt 9)? Fehlt einer, baue ich ihn neu in derselben Sprache: Werte aus den Tokens, Bewegung aus den Rezepten.
6. **Bauen.** Telefon zuerst (390 px), dann Schreibtisch (1280 px). Tokens, `bundle.css` und `bundle.js` einbinden, Schriften Outfit und Doto über Google Fonts (im Projekt lokal, wenn die CSP fremde Server verbietet). Farben nach Abschnitt 8. Zum Anschauen als eigenständige HTML-Seite wie die Musterseite; in einem Code-Projekt direkt in dessen Dateien.
7. **Prüfen** mit der Prüfliste (Abschnitt 4), Bildschirmfotos neben der Musterseite und der Farbmessung (Abschnitt 8). Bei eeziframes dazu das Rezept des Begleit-Skills: Messwerkzeuge (Bildschirme, Farben, ruhige Fassung, Layoutsprung, Zeitlupe), Gremium `profis` eine Runde, vier Detail-Profis (Bewegung, Zeichen, UX, Typografie), Abgleich mit den aktuellen Vorlagen in drei Perspektiven. Erst wenn alles besteht, zeige ich das Ergebnis.
8. **Liefern.** Kurz sagen, welche Gene jede Szene oder Folie trägt, die Messtabelle der Farben und welches echte Material noch fehlt.
9. **Rückfluss.** Jede Korrektur des Inhabers („zu verspielt“, „Schrift zu dünn“) schlage ich als neue Regel für Abschnitt 7 vor. Neue Vorlagen analysiere ich nach Abschnitt 6 und schlage vor, Gene, Werte oder Bausteine zu ergänzen.

## 4. Prüfliste vor dem Zeigen

- **Familientest:** Bildschirmfoto der neuen Seite neben der Musterseite (bei App-Bildschirmen neben „Konfigurator in Violett“). Sieht sie aus wie aus derselben Familie? Wenn nein, nachbessern.
- Nur die acht Farben aus Abschnitt 8; Farbmessung je Bildschirm innerhalb der Toleranzen; Farbe nur als Leuchten, Zustand, Wert oder Bild.
- Jede Verkaufsszene trägt mindestens vier Gene, jede App-Folie mindestens vier; ich kann sie benennen.
- Jeder Datenabschnitt hat genau eine Zahl als Held, Einheit klein in `tinte-2`.
- Mindestens einmal je Seite: Feinzeichnung (Punktraster, Skala, Kapselreihe oder Schraffur), ein Gerät oder Objekt im Raum, Werte an der Sache.
- Genau eine volle Pille je Bildschirm, nie farbig; am Telefon im unteren Drittel und mindestens 44 px hoch. Weitere Aktionen als runde Knöpfe (G13), nicht als zweite Pille.
- Text mindestens 13 px und 4,5:1 (ab 24 px 3:1); Fokusring sichtbar; nichts nur über Farbe.
- Telefon 390 px: nichts scrollt seitlich, keine Überschrift bricht im Wort, Etiketten bleiben im Bild und überdecken sich nicht.
- Bewegung: Hero steht nach spätestens 1,3 s; was am Scrollen hängt, folgt dem Besucher; nichts läuft länger als 5 s von selbst; bei reduzierter Bewegung und ohne JavaScript steht jedes Endbild sofort; Auftritt nur im Hero.
- Gemessen, nicht geschätzt (Website): Layoutsprung 0, kein `filter: blur` auf Flächen oder Pseudoelementen, keine lazy-Bilder in den ersten Szenen, Schriften vorab geladen, Grund sofort dunkel, Laden unter 1 s; eine volle Pille je Bildschirm, am Telefon im unteren Drittel; alle Ziele 44 px; keine Konsolenfehler.
- Licht (G14) und Gewicht (G15): keine flache Karte, kein zweites schweres Element im selben Bild.
- **Nie:** linearer Blau-Lila-Verlauf, Neon, Emoji als Icons, Karten mit farbigem Seitenbalken, Karten in Karten (außer der dunklen Innenkarte mit dem Wert, G8), Statistikreihe aus drei Zahlen, erfundene Kennzahlen oder Bewertungen, frontale flache Bildschirmfotos, Standard-Hero mit Text links und Foto rechts ohne Bühne, Inter oder Roboto als Ersatzschrift, Ladebildschirm vor dem Inhalt, Zwischenschritte, die nur bestätigen, Trend nur in Grün/Rot (immer Pfeil und Vorzeichen dazu).

## 5. Kurzfassung der Formensprache (falls die Quellen nicht erreichbar sind)

```css
:root, [data-theme="hell"] { --grund:#ecebef; --grund-tief:#dddde3; --flaeche:#f6f6f8; --flaeche-hoch:#fff; --tinte:#111113; --tinte-2:#5c5b64; --linie:#c4c3ca; --linie-fein:#dcdbe1; --handlung:#111113; --auf-handlung:#fff; --glas:rgba(255,255,255,.58); }
[data-theme="dunkel"] { --grund:#0c0c0d; --grund-tief:#050506; --flaeche:#17181a; --flaeche-hoch:#232427; --tinte:#f3f3f5; --tinte-2:#a6a6ae; --linie:#3a3b40; --linie-fein:#26272b; --handlung:#f3f3f5; --auf-handlung:#0c0c0d; --glas:rgba(40,41,45,.58); }
[data-theme="warm"] { --grund:#b7aba5; --flaeche:#c6bcb7; --flaeche-hoch:#d6cdc8; --tinte:#191513; --tinte-2:#3e3532; }
:root { --signal:#cdeb3f; --glut-orange:#f7956f; --glut-honig:#fcc67e; --glut-pink:#f0508f; --glut-magenta:#b0145e; --glut-lila:#b86fe0; --glut-blau:#3f8cf0; --glut-gruen:#a6c285;
  --font-sans:"Outfit",system-ui,sans-serif; --font-punkt:"Doto",ui-monospace,monospace;
  --rund-m:20px; --rund-l:28px; --rund-xl:40px; --rund-pille:999px;
  --dna-auftritt:cubic-bezier(.16,1,.3,1); --dna-weg:cubic-bezier(.65,0,.35,1); --dna-druck:cubic-bezier(.2,.7,.2,1); }
```

Diese Grundwerte sind die Formen der DNA. **Die Farben werden immer durch Abschnitt 8 ersetzt** (Grau, Limette und die Glut-Paare oben gelten nur, wenn der Inhaber ausdrücklich eine andere Palette verlangt).

- Schrift: Outfit für alles (geometrisch, wie in allen App-Vorlagen); Überschriften Gewicht 500 (Display-Titel der Website seit 26.10.2026: 600, −0,035 em, Zeile 0,95; G15), eng (−0,02 bis −0,03 em), mit zweiter Stimme in `tinte-2`; Zahlen 200–500, groß (56–88 px), Einheit und Nachkommastellen klein; Riesenwort 600 bis 300 px (nur Website); Lesetext 16 px in `tinte-2`; Beschriftungen 13 px, gern als „Beschriftung — Wert“ mit Halbgeviertstrich. Doto nur für eine Punktzahl je Bildschirm.
- Leuchten: radiale Verläufe mit Zwischenstufe (Kern, 42 % bei 34 %, aus bei 72 %) statt Weichzeichner (`filter: blur` ruckelt beim Scrollen und wird seit 26.10.2026 nicht mehr auf Flächen verwendet), hinter neutraler Fläche; mit Abschnitt 8: Violett mit Indigo, oder Koralle allein.
- Dauern: Rückmeldung 220 ms, Zustand 320 ms, Gleiten 400 ms, Auftritt 700 ms (Staffel 70 ms), Szene 900–1200 ms (nur Website).
- Abstände: Seitenrand 16 px (Telefon) und 48 px (Schreibtisch), Abschnitte 72 px und 120 px, Kachelfuge 12 px. Rundung: Karten 28 px, Innenkarten 20 px, Knöpfe rund.

**Ergänzungen vom 26.10.2026** (gelernt an der Startseite eeziframes im Abgleich mit zwölf Vorlagen; die genauen CSS-Werte stehen in `design-dna-eeziframes`, Abschnitt 3):
- Material (G14): dunkle Karten mit radialem tonalem Abfall und 1-px-Lichtkante oben; Fotos mit Lichtkante und Vignette; Lichtteich hinter Bühnen; Kontaktschatten unter Objekten auf Weiß; Geräte mit Metallkante und Spiegelung; Glas 12 px mit Bruchkante, nur über Bild, Objekt oder Leuchten.
- Gewicht (G15): Titel 600, Kartentitel 24/600, Labels 12 px in 400 mit 0,03 em, kleine Zahlen 300 mit Einheit 14 px, große Zahlen 200–250 mit Einheit 15 px.
- Luft nach Hierarchie: Etikett→Titel 6 px, Titel→Text 12 px, Text→Handlung 32 px, Gruppe→Gruppe 48 px; Lesetext 36ch; Karten in drei Ebenen (Label, Titel, eine Zeile Meta oder Pille), nie ein Absatz in einer Karte.
- Ein Zeichen je Bedeutung: `signal` als Punkt nur für „aktiv“ und am Etikett; Listenpunkte 6 px in `linie`; Haken für „inklusive“; Chevron 1,8 px mit runden Enden als Maske; Chips Indigo für Zustände, Koralle für Hinweise; Rundknöpfe mit Lichtverlauf und Ring; Striche in Zeichnungen gerätunabhängig 1,8 / 1,2 / 1 px.
- Bewegung dosiert: Zahlen rasten von einem nahen Wert ein (700 ms), Etiketten erst Punkt und Linie, dann Text; Stationen wechseln nur über Farbe und Skalierung, Karten blenden nur; Leiste beim Hochscrollen 320 ms hin, 220 ms weg, 24 px Hysterese in beide Richtungen; Vorhang-Szenen rechnen mit der größten Bildschirmhöhe der Ausrichtung (Adressleiste); lebendes Bento nur mit Hysterese, sonst aus; Tastatur löst nie Gleiten aus.
- Laden: Grund sofort dunkel, Schriften vorab, Bilder sofort mit `decoding="async"` und Maßen, große Bilder höchstens 1000 px breit.

## 6. Neue Vorlagen aufnehmen

Je Vorlage dieselben Fragen: Was löst es aus? Was bewegt sich, und was bedeutet die Bewegung? Welcher Rhythmus? Welches Material, welches Licht? Wo liegt die Überraschung? Videos zerlege ich vorher in Einzelbilder (etwa drei je Sekunde), damit ich die Bewegung wirklich sehe. Ein Merkmal wird zum Gen, wenn es in mindestens drei Vorlagen auftaucht; vorher bleibt es Kandidat. Was im Video ein Schnitt ist, übersetze ich in eine Szene, die am Scrollen hängt.

Bisherige Vorlagen (26.10.2026):
1. Superpower, Gesundheits-App und Website (rondesignlab) – Leuchten als Zustand, Punktziffern, Gel-Material, Lineal-Skala, Limette nur für Handlung.
2. Domus, Smart-Home-Dashboard (sogaso) – warmes Taupe, Werte am 3D-Haus, Bogen mit Strichen, Schraffur auf schwarzer Karte, Kacheln vor dem Bildschirm.
3. Creator-Finanzen auf Monitor (rondesignlabs) – Magenta-Leuchtkachel, Punktraster-Diagramm, Riffelglas, gekippter Monitor.
4. Task-App (ui.vitali) – Handy auf Beton im harten Licht, Flüssigmetall-Kugel, schraffierte Balken. Ihre Farbverteilung ist seit 26.10.2026 die Standard-Palette (Abschnitt 8).
5. CRM auf iPad (rondesignlabs) – Verlaufskacheln mit Zahl und winziger Einheit, Ablauf mit Stationen, Drahtgitter-Kugel.
6. Reisekarte „Which card is better?“ (uiuxbunker) – Bildkarte mit Glas-Chips und schwarzer Pille; was genau gefällt, ist noch offen.
7. swapie, Wallet-Website (Bildschirmaufnahme) – Auftritt aus der Unschärfe, Bild im Satz, Vorhang von unten, Zerfall zum Bento, lebendes Raster, Schrift als Fenster, Verlaufspillen.
8. NFT-App hell (zwei Telefone auf Putz im harten Sonnenlicht) – Listenkarten mit großem gerundeten Bild links, „Owned by — Name“, Wert mit Münzzeichen, schwarzer Pfeilkreis je Karte; Detail als Blatt über dem Bild mit Griffleiste; Pastell-Verlaufskacheln mit großer Zahl und schwarzem Trend-Badge („↓ 3,1 %“), weiße Innenkarte; Countdown „48h · 16m · 59s“; schwarze Pille „Place Bid“ mit farbigem Pfeilkreis, daneben runde Umriss-Knöpfe; untere Navigation als dunkle Pille mit aktiver farbiger Pille.
9. Krypto-Paare dunkel (Telefon auf violettem Satin) – runde Umriss-Knöpfe für Zurück und Filter, Chip-Reihe mit weißem gewähltem Chip, Orange-Honig-Karte mit schwarzer Icon-Kachel und schwarzer Innenkarte „Balance“, Kapsel-Balkendiagramm mit Punkten und einem hervorgehobenen Stäbchen, weißer runder Aktionsknopf in der Innenkarte, schraffierter „+“-Kreis, Trend-Badges.
10. Krypto-Dashboard dunkel (gekippt vor violettem Licht) – Gesamtsaldo als Zahl mit Trend-Badge, Mini-Kapselbalken „Full Stats“, Verlaufskarte mit schwarzen Innenkarten und Fortschritts-Kapseln mit Knopf, schraffierte senkrechte Kapsel als Platzhalter, Balken mit Verlauf und Schraffur, Halbkreis-Anzeige mit Farbbogen.
11. Home-Pod-App (Limette oben, Schwarz unten, auf Stein) – runder Umriss-Zurück, runder schwarzer Schalter „On“, weiße Karte mit rundem Albumbild und Wellenform mit Regler, schwarze Bedienpille mit weißem Mittelknopf, echtes Produktfoto bricht aus der Fläche, senkrechter Glas-Regler „57 %“ mit Verlaufsfüllung, Schreibschrift „Enjoy the Sound“, Badge „PRO“.
12. Heeal.app Widget (schwarze Insel auf dem Startbildschirm) – kräftiges Wort „Walking“, Ziel klein darüber, Verlaufskachel Violett–Türkis mit Zahl „3824“ und schwarzer Kapsel „2,7 km“, Zeitleiste aus Kapseln mit Knopf und schraffiertem farbigem Abschnitt, Werte an den Enden.
13. Koch-App „Cooking now“ (Foto vollflächig, in der Hand) – Glas-Chip mit Fortschrittsring „Step 2 of 5“, Glas-Karte „French Fries 80 gr“ mit Schale, die aus der Karte ragt, und weißem Pfeilkreis auf der Ecke, senkrechte Leiste runder Glas-Knöpfe, Vorschläge als Glas-Kacheln mit Foto.
14. Rezept „Grilled Ribs“ (Foto vollflächig) – große weiße Überschrift auf dem Foto, Glas-Chips mit Zeichen (45 min, 2 Portionen, 620 kcal), Glas-Karte „160 gr“ mit Schale über dem Rand und Pfeilkreis, Personenzeile, Glas-Karten mit rundem Zeichen und Kapselbalken „Oven temp 120 °C“.
15. Nintendo-Switch-App (dunkel, Spielkarten) – Anthrazit-Karten mit tonalem Abfall und Lichtkante, Figur bricht aus der Karte (G12), Fähigkeitsbalken mit Prozent, Titel 700 als das eine Schwere, Chips für Genre.
16. Nintendo-Web (hell, gefächerte Karten) – riesiger Titel 700, Karten als Fächer mit Kontaktschatten, Raster im Hintergrund, eine rote Pille als einzige Handlung.
17. Domus, Energiekachel (Ausschnitt) – „12.4 kWh“ in 300 mit kleiner Einheit, Stufendiagramm mit Schraffur für den Rest, Chip „−18 %“ mit Vorzeichen, Lichtkante auf Schwarz.

**Abgleich vom 26.10.2026** (zwölf Bilder des Inhabers neben der Startseite eeziframes; Kopien unter docs/profis/vorlagen/2026-10-26/ im Projekt, Urteile in docs/profis/gremium/2026-10-26-startseite-dna-vorlagen-*.md): die Bilder zu 2, 3, 4, 8, 9, 10, 12, 13 und 14 noch einmal, dazu 15–17. **Neu als Gen:** G14 Keine Fläche ist flach (in allen zwölf: Lichtkante, tonaler Abfall, Vignette, Kontaktschatten) und G15 Ein schweres Element je Bild (3, 5, 12, 13, 15, 16, 17). Beide sind in der Startseite umgesetzt; der Inhaber hat das Ergebnis angenommen.

**Aus 8–14 neu als Gen:** G11 Kapselreihe (9, 10, 12, 14, dazu 4), G12 Objekt bricht aus dem Rahmen (11, 13, 14), G13 runde Knöpfe (8, 9, 10, 11, 13, 14). **Bestätigt und geschärft:** G1 Schraffur als Rest/Platzhalter (9, 10, 12), G3 Einheit und Nachkommastellen klein (8, 10, 13, 14), G4 Gerät auf echtem Material im harten Licht (8–12), G6 Pille mit Pfeilkreis (8), G8 dunkle Innenkarte mit dem Wert (8, 9, 10), G10 Milchglas über Foto (8, 13, 14). **Kandidaten** (noch unter drei): untere Navigation als dunkle Pille mit aktiver Pille (8), Countdown mit Punkten (8), senkrechte Werkzeugleiste (13), Schreibschrift als Signatur (11), Personenzeile mit Bildern (9, 14), Halbkreis-Anzeige mit Farbbogen (10).
**Farben in 8–14 und die Palette:** Limette (11), Pastell (8), Orange-Honig-Verläufe (9, 10) und Grün/Rot für Trends (10) übernehme ich nicht wörtlich. In der Palette „Task-App dunkel“ wird daraus: Verlaufskarte = Anthrazit-Kachel mit radialem Leuchten (Violett/Indigo oder Koralle), Trend = Pfeil und Vorzeichen, hoch in Violett, runter in Koralle.

## 7. Protokoll

- 26.10.2026 – Erste Fassung aus sieben Vorlagen: 10 Gene, Design-System mit 14 Bausteinen, Musterseite. Noch kein Urteil des Inhabers zur Musterseite.
- 26.10.2026 – Konfigurator „Lage“ in der DNA gebaut, Gremium (profis) mit sieben Korrekturen; Inhaber: Knöpfe und Designrichtung der Lage-Folien sind fix, Logo gehört in den Kopf.
- 26.10.2026 – Farbverteilung „Task-App dunkel“ vom Inhaber vorgegeben; „Lage in Violett“ gefällt („Find ich geil“), online in der App. Seitdem Standard-Palette (Abschnitt 8).
- 26.10.2026 – Konfigurator von Start bis Lage Folie für Folie neu („Konfigurator in Violett“). Inhaber: beim Messen kein Zwischenschritt („das nervt komplett“) – Zifferntasten offen, „Weiter“ speichert und geht zum nächsten Maß.
- 26.10.2026 – Andere Chats mit „design-dna“ kamen ohne Palette und Rahmen zu einem ganz anderen Look; deshalb stehen Palette (8) und App-Rahmen (9) jetzt im Skill selbst.
- 26.10.2026 – Sieben weitere Vorlagen (8–14, App-Oberflächen): neue Gene G11 Kapselreihe, G12 Rahmenbruch, G13 runde Knöpfe; neue Bausteine in Abschnitt 10.
- 26.10.2026 – Startseite eeziframes (Kunden) nach dieser DNA gebaut: fünf Szenen dunkel/hell, Bento, Stufen, Etiketten, Preis als Leuchtkachel (Protokoll docs/profis/2026-10-26-startseite-dna.md, Vorschau https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i). Urteil des Inhabers: „brutal geil“. Seine Entscheidungen: Gestaltung nur nach dieser DNA, alte Skills nicht mehr laden; Gremium nur eine Runde (etwa zehn Minuten je Seite); im Hero kein Gerät und keine Maßlinien, sein Hausfoto als Bühne; Bildpille im Satz und Schriftfenster nur auf sein Wort; Wortlaut „Jetzt konfigurieren“ bleibt. Daraus: G14 und G15, Ergänzungen in Abschnitt 5, Vorlagen 15–17, Messpunkte in Abschnitt 4; `--auf-signal` auf Schwarz berichtigt (Kontrastregel in Abschnitt 8); Begleit-Skill `design-dna-eeziframes` im Projekt.

## 8. Farbwelt „Task-App dunkel“ (Standard, ersetzt alle Farben aus anderen Skills und Vorlagen)

Nur diese acht Farben verwenden, keine weiteren.

| Farbe | Wert | Anteil (Fläche, über die ganze Seite gemittelt) | Rolle |
| --- | --- | --- | --- |
| Schwarz | #07090a | 42 % | Grund der dunklen Szenen |
| Weiß | #ffffff | 26 % | helle Szenen und Karten, Text, Handlungspille |
| Anthrazit | #202022 | 16 % | Kacheln, Bühnen und Flächen auf Schwarz |
| Silbergrau | #a8a4a9 | 9 % | Nebentext auf Dunkel, Linien, Skalen, Schraffur |
| (Textgrau) | #6b676c | zählt zu Silbergrau | nur Nebentext auf Weiß |
| Violett | #897efc | 3,5 % | Hauptakzent: Leuchten, Hauptwert, aktiver Zustand |
| Koralle | #f88962 | 2 % | Gegenakzent: zweiter Wert, Hinweis, warmer Hotspot |
| Indigo | #3c3a66 | 1,5 % | Schatten von Violett: getönte Chips, Hover, Fläche hinter Leuchten |

Toleranz: neutrale Farben ±3 Prozentpunkte, Akzente ±1.

**Regeln**
1. Farbe gesamt (Violett + Koralle + Indigo) etwa 7 % der Seite; je Bildschirm (390 × 844 und 1280 × 800) höchstens 12 %, aber kein Bildschirm ganz ohne Farbe.
2. Violett führt. Koralle ist nie größer als Violett (auch je Bildschirm). Indigo steht nur neben oder hinter Violett.
3. Dunkle Szenen (Schwarz/Anthrazit) wechseln mit hellen (Weiß). Helle Karten dürfen in dunkle Szenen ragen.
4. Die eine volle Handlungspille je Bildschirm ist nie farbig: Weiß mit schwarzer Schrift auf Dunkel, Schwarz mit weißer auf Hell. Farbe zeigt Werte und Zustände, nicht Klickbarkeit.
5. Leuchten nur radial (Violett mit Indigo, oder Koralle allein), nie als linearer Verlauf über ganze Flächen.
6. Fotos und 3-D-Objekte dürfen bunter sein, zählen aber als Farbfläche mit.

**Kontrast (Text)**
- Auf Schwarz und Anthrazit: Weiß, Silbergrau, Violett, Koralle.
- Auf Weiß: Schwarz, Indigo, Textgrau. Violett nur ab 24 px oder als Grafik. Koralle und Silbergrau nie als Text auf Weiß.
- Auf Indigo: Weiß. Indigo selbst nie als Text auf Dunkel.
- Auf Violett und Koralle (gewählte Taste, Hinweis-Marke): Schwarz (6:1 bzw. 8:1); Weiß nicht (zu schwach).
- Information nie nur über Farbe (gefüllt/Umriss, gestrichelt/durchgezogen, Pfeil/Vorzeichen, Text).

**Tokens mit der DNA**
```css
:root { --schwarz:#07090a; --anthrazit:#202022; --weiss:#fff; --silbergrau:#a8a4a9; --textgrau:#6b676c; --violett:#897efc; --koralle:#f88962; --indigo:#3c3a66;
  --signal:var(--violett); --auf-signal:var(--schwarz); --glut-orange:var(--koralle); --glut-honig:var(--koralle); --glut-pink:var(--koralle); --glut-magenta:var(--indigo); --glut-lila:var(--violett); --glut-blau:var(--indigo); --glut-gruen:var(--violett); }
[data-theme="dunkel"] { --grund:var(--schwarz); --grund-tief:var(--schwarz); --flaeche:var(--anthrazit); --flaeche-hoch:var(--schwarz); --tinte:var(--weiss); --tinte-2:var(--silbergrau); --linie:var(--silbergrau); --linie-fein:var(--anthrazit); --handlung:var(--weiss); --auf-handlung:var(--schwarz); --glas:var(--schwarz); --fokus:var(--violett); --schatten-glas:none; }
[data-theme="hell"] { --grund:var(--weiss); --grund-tief:var(--weiss); --flaeche:var(--weiss); --flaeche-hoch:var(--weiss); --tinte:var(--schwarz); --tinte-2:var(--textgrau); --linie:var(--silbergrau); --linie-fein:var(--silbergrau); --handlung:var(--schwarz); --auf-handlung:var(--weiss); --glas:var(--weiss); --fokus:var(--violett); --schatten-glas:none; }
```

**Messen vor dem Zeigen:** Für jeden Bildschirm (jede Folie und jeden Unterschritt, oben und am Ende) ein Bildschirmfoto machen, jedes Pixel der nächsten der acht Farben zuordnen (Textgrau zählt zu Silbergrau; mit PIL `quantize` auf eine Palette aus den acht Werten, ohne Dithering) und als kurze Tabelle ausgeben: Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt, dazu das Mittel der Seite und die vier neutralen Anteile. Liegt ein Wert außerhalb der Toleranz, erst anpassen, dann zeigen. Bewährte Stellschrauben: Kern des Leuchtens größer (Violett bis 50–60 %), Hinweis-Marken als Koralle mit schwarzer Schrift, Schraffur (Silbergrau) für Nicht-Gewähltes, Kacheln Anthrazit oder Schwarz mit 1,5-px-Kontur in Silbergrau.

## 9. App-Rahmen: Folien des Konfigurators

Gilt für jeden App-Bildschirm. Vorbild sind die Folien in „Konfigurator in Violett“; Knöpfe und Rahmen nicht neu erfinden.

- **Kopf (52 px):** links runder Zurück-Knopf (nur Pfeil, 44 px), daneben das Logo (Zeichen 26 px plus Wortmarke „**eezi**frames“, im Kundenlink einer Instanz deren Zeichen), rechts „Übersicht“ (drei Striche + Wort) und „Begriffe“ (Buch). Genau ein Kopf.
- **Stationen-Band (44 px):** Name des Schritts links (15 px), Punkte auf gepunkteter Linie, rechts „N von M“ (13 px). Schritte 1–6 (Start, Fotos, Messen, Ränder, Ergebnis, Wünsche), in den Wünschen die Kapitel 1–7 (Lage, Aufbau, Material & Farbe, Glas & Sprossen, Griff & Schutz, Sonnenschutz, Einbau). Laufender Punkt Violett mit Indigo-Ring, erledigte Silbergrau.
- **Bühne (etwa 250 px, Radius 28):** Anthrazit, darauf das Fensterelement aus dem 3-D-Modell der App (Rendering mit durchsichtigem Grund, passend zum Bereich: gewähltes Element, Ansicht innen/außen, Öffnung im Raum mit dem aktuellen Maß, Fenster mit allen Maßen, Haus im Schnitt), Feinzeichnung darüber (Maßlinien, Skalen, Schraffur), Werte als Etiketten an der Sache, ein Hinweis als Marke oben links. Leuchten radial hinter dem Zustand. Das Rendering darf über den Rand der Bühne oder einer Kachel ragen (G12).
- **Frage:** Überschrift 30 px Gewicht 500 mit zweiter Stimme in Silbergrau, i-Knopf (28 px, Ring) für die Erklärung, rechts die leise Pille „Notiz“; Unterzeile 16 px in Silbergrau, ein Satz.
- **Karten:** Eingaben auf weißer Karte (Radius 28, Felder als Pillen mit 1,5-px-Ring, Vorschläge als Umriss-Chips, die ergänzen statt ersetzen); Auswahl auf Anthrazit-Kachel; Zahl als Held auf schwarzer Kontur-Kachel mit Leuchten. Hilfetext 14 px; Pflicht als leises Badge mit Koralle-Punkt.
- **Schalter:** Segmente in einer Pille (Schwarz auf Kachel, Weiß mit Ring auf Karte), gewählt Violett mit schwarzer Schrift, 44 px hoch. Plus/Minus als runde Knöpfe 48 px. Anteile und Mengen gern als Kapselreihe oder Kapselregler (G11).
- **Fuß:** runder Zurück-Knopf als Umriss (52 px) und die volle weiße Pille mit schwarzem Pfeilkreis („Weiter“, „Weiter zu den Fotos“, „Weiter zu Maß 2“ …). „Weiter“ ist immer voll; fehlt etwas, steht eine Zeile darüber, warum (Koralle-Punkt), und das Feld wird mit Koralle-Ring markiert und fokussiert. Am Telefon klebt der Fuß unten. Darunter im Inhalt die rechtlichen Verweise (13 px, Silbergrau, „Vertrag widerrufen“ unterstrichen zuerst).
- **Messen und alle Zahleneingaben:** kein Zwischenschritt. Zifferntasten stehen offen auf der Folie, das Feld auf der Linie zeigt live, was getippt wird, „Weiter“ prüft, speichert und geht direkt zum nächsten Maß; eine Rückfrage (z. B. „Zollstock zeigt 141 cm?“ · „Ja, 1.410 mm“) steht am Platz der Zeile und geht mit einem Tipp weiter. Nur das aktuelle Maß im Modell. Fenster-Maße Violett und durchgezogen, Öffnungs-Maße Koralle und gestrichelt.
- **Bewegung in der App:** nur Rückmeldung und Zustand (Druck 220 ms, Zustand 320 ms, Gleiten 400 ms mit `--dna-auftritt`, Zahl rastet ein, Leuchten folgt dem Wert, Kapselreihe füllt sich, Folienwechsel 260 ms seitlich 14 px), ruhige Fassung bei „weniger Bewegung“.
- **Maße:** Telefon 390 × 844 zuerst, Schreibtisch zeigt das Telefon als Gerät auf der Bühne mit Notizspalte; Text mindestens 13 px, Ziele mindestens 44 px, kein Querscrollen.

## 10. Bausteine aus den App-Vorlagen (8–14), in der Palette

- **Kapselreihe (G11):** 8–30 Stäbchen, je 6–10 px breit, voll gerundet, Abstand 4–6 px. Erreicht = Weiß (auf Dunkel) oder Schwarz (auf Weiß), Rest = Silbergrau 30 % oder schraffiert, ein Marken-Stäbchen in Violett (Hauptwert) oder Koralle (zweiter Wert), Punkt oder Knopf darauf. Beschriftung klein darunter, Wert groß daneben („Oven temp — 120 °C“). Für Anteile, Fortschritt, Temperaturen, Mengen.
- **Kapselregler:** senkrechte oder waagerechte Glas-Pille (Anthrazit mit Ring), Füllung als radiales Leuchten von unten, Wert groß oben („57 %“), Griff als kleine Querpille; Ziehen und Tippen, Tastatur mit Pfeilen.
- **Pfeilkreis an der Karte (G13):** 44–52 px, weiß mit schwarzem Pfeil auf Dunkel, schwarz mit weißem Pfeil auf Hell, sitzt rechts unten in oder auf der Kartenkante; führt zum Detail. Die Karte bleibt ruhig, der Kreis ist die Aktion.
- **Runde Umriss-Knöpfe:** Zurück, Filter, Teilen, Merken als Ring 44–52 px mit Zeichen; Werkzeuge als senkrechte Leiste runder Glas-Knöpfe am Rand eines Fotos.
- **Trend-Badge:** kleine schwarze Kapsel (auf Hell) oder Anthrazit-Kapsel (auf Dunkel) mit Pfeil und Vorzeichen „↑ +2,5 %“; hoch Violett, runter Koralle, nie nur Farbe.
- **Dunkle Innenkarte:** in einer Kachel mit Leuchten eine schwarze Karte (Radius 20) mit Beschriftung und Wert und einem runden Aktionsknopf; trägt den einen Wert, auf den es ankommt.
- **Glas-Chip und Glas-Karte über Foto (G10):** Milchglas (Anthrazit 60 % mit Unschärfe 16 px und 1-px-Lichtkante), Zeichen + Text in Weiß, Fortschrittsring „Schritt 2 von 5“; Karte mit großer Zahl und kleiner Einheit, Produkt ragt hinaus (G12), Pfeilkreis auf der Ecke.
- **Listenkarte mit Bild:** großes gerundetes Bild links (Radius 20), rechts „Beschriftung — Name“ klein, Titel 17 px, Wert mit Zeichen, Pfeilkreis rechts unten.
- **Halbkreis-Anzeige (Kandidat):** Bogen mit Strichen (G5), gefüllter Teil Violett mit Koralle am Ende, Rest Silbergrau, Zahl in der Mitte.
- **Untere Navigation (Kandidat):** dunkle Pille mit runden Zeichen, die aktive als Pille mit Zeichen und Wort; aktiv in Violett mit schwarzer Schrift.

**Übertragung auf den Konfigurator (Vorschläge, nicht ungefragt bauen):** Anzahl gleicher Fenster und „Wie genau planen“ als Kapselreihe; „Dreimal gemessen, das kleinste zählt“ als drei Kapseln je Richtung; Start-Kacheln mit Rendering, das aus der Kachel ragt, und Pfeilkreis; Fotos mit Glas-Chips und Fortschrittsring „Foto 1 von 2“ über dem Bild; Ergebnis mit dunkler Innenkarte für das Maß, auf das es ankommt.
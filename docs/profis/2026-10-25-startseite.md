# Profis · Startseite (Ansicht Hauseigentümer) · 25.10.2026

Umfang: Groß (ganze Seite): Gremium, Umbau, Abnahme. Drei Agenten je Runde, blind (X = heute, Y = neu). Vorschau als Artefakt „Startseite neu gedacht“, nicht online.

## Auftrag

- Bereich: Startseite https://eeziframes.com, Ansicht Hauseigentümer (`SCREENS.landing` in web/assets/portal.js).
- Wunsch des Inhabers: Startseite nach `ultimativ-webdesign` und `profis` überarbeiten; nur als Beispielseite zeigen, Entscheidung am nächsten Morgen.
- Der Besucher soll: in drei Sekunden verstehen, was es ist, dass Messen kostenlos ist und was das Blatt kostet, und „Jetzt ausmessen“ oder „Führung starten“ antippen; Fensterbauer finden ihren Weg.
- Erfolg: Kunden tippen, Fensterbauer trauen der Firma den Konfigurator zu.

## Ist und Neu

- X (heute): Bildschirmfotos scratchpad `start/tel-*.png`, `start/desk-alle.png`.
- Y (Runde 1): scratchpad `start/preview/` Stand 23:23 Uhr; Y2 (Umbau und Abnahme): docs/profis/startseite-vorschau/ und docs/profis/bilder/2026-10-26-startseite-{bild1,tel,desk}.jpg.
- Material: Foto des Inhabers (`web/bilder/foto/start-hauseigentuemer.webp`), Aufmaßblatt Weber (`web/bilder/fensterbauer/aufmassblatt-weber.webp`), Bildschirme der App (Schritt 1 live; Schritt 2 ist der Entwurf „Maße neu gedacht“, Runde 3 vom Designrat, noch nicht gebaut; Ergebnis live).

## Änderungsliste (Y gegen X)

1. Pilot-Balken und Einführungsband oben → eine Zeile (Runde 1), dann ganz entfernt (Umbau).
2. Ansicht-Schalter als Glas (Runde 1) → tonal mit Pfeil (Umbau).
3. Kopf: Foto groß, Überschrift im Verlauf, Lead zwei bis drei Zeilen, Maßlinie am Zollstock mit Wert, Glas-Nachricht „Aufmaßblatt fertig“, Chips, Lichtfleck (Runde 1) → Nachricht, Chips, Licht gestrichen; Wert oben neben der Linie, „abgelesen am Zollstock“; Kicker einzeilig; Pille bei 562 px; eine Cream-Pille je Bildschirm (Umbau).
4. Statistikreihe → Messband, das sich beim Lesen füllt.
5. „Drei Schritte“ mit echten App-Bildschirmen → Beschriftung über dem Bildschirm, Bildschirme 280 px (Umbau).
6. „Was im Aufmaß steckt“: acht Kacheln → Beispielblatt mit Liste; Zahlensatz stimmig, Nachmess-Satz, Zeile für Fensterbauer (Umbau).
7. Leerer Platzhalter → sechs Elementarten als Symbole, 56 px, auf einer Linie (Umbau).
8. Preis 7,99 € mit zweiter Pille → „einmal, für alle Fenster“, „danach 12,99 €“ (Umbau).
9. Ratgeber: neun Kacheln → drei Zeilen.
10. Für Fensterbauer kompakt → mit „Ihre Kunden zahlen nichts“, Link-Einbau, Pakete, Pilotphase-Zeile (Umbau).
11. Bewegung: Choreografie mit sechs Takten (Runde 1) → vier Takte, Pille ab Bild eins, Kopfzeile beim Hochscrollen (Umbau).

## Runde 2: Gremium (Y gegen X)

| Gruppe | Rangfolge | Hände für Y | Median | Vetos |
| --- | --- | --- | --- | --- |
| Gestalter | Y 6:0 | 4, 4, 3, 4, 4, 3 | 4 | Roth: „statt 12,99 €“ |
| Kunden | Y verstehen alle sechs; Abbruch Bildschirm eins: X vier, Y nur der Gegenspieler | 4, 4, 2, 3, 3, 2 | 3 | Kraus: „Bestellmaß“ ohne Nachmess-Satz · Hofmann: Mieter fehlen, Bild suggeriert Kameramessung |
| Fensterbauer | Y 6:0; kaufen Median 3 (X 2), zeigen 3,5 (X 2) | 3, 4, 2, 3, 4, 2 | 3 | Brandt: Maßzahlen widersprechen sich · Lindqvist: Pilotphase-Hinweis weg, ohne zu sagen, was gilt |

Mehrheiten je Änderung: behalten 1, 4, 6, 8, 9, 10 (Inhalt), ändern 2, 3, 5, 7, 11 (Gestalter) und 6, 8, 10 (Text: Zahlen, Einheit, Pilotphase); zurück: keine.

Forderungen nach Wirkung:
- Gestalter: eine Cream-Pille je Bildschirm und Kopfzeile beim Hochscrollen (schließt die Lücke Bildschirm 2 bis 4 ohne Aktion); Kopf auf zwei Stimmen (Waschbär und Maßlinie), Nachricht und Chips raus, Pille unter 600 px; ehrliche Zahlen („danach“, ein Zahlensatz).
- Kunden: ein einziger Preissatz im ersten Bildschirm, mit Einheit, sonst nichts zum Geld (kein Pilotbalken, kein Streichpreis, kein Countdown); „vier Maße“ gegen „drei Breiten, drei Höhen“ klären; Knopf sofort bedienbar; 2,4 s Bewegung zu lang.
- Fensterbauer: der Kopf endet auf dem Produkt, nicht auf dem Tier (Waschbär darf hinführen); Maßzahl überall dieselbe; Pilotphase ehrlich benennen; Preis je Betrieb, wer die 7,99 € zahlt, Einbau in einem Satz.

Streit zwischen Gruppen: Kunden wollen keinen Pilot- und Einführungsbalken, Fensterbauer (Lindqvist) wollen den Pilotphase-Hinweis zurück. Entscheidung nach Vorrangregel: Der erste Bildschirm gehört dem Kunden (ein Preissatz), der Pilotphase-Hinweis steht im Abschnitt „Für Fensterbauer“, wo er hingehört; das Einführungsband oben entfällt, der Einführungspreis steht im Preisabschnitt. Ob das Band oben bleibt, entscheidet der Inhaber.

## Umbau (Runde 3)

Lösungsschlüssel der Zahlen (aus web/assets/app.js, `MESS` und `MO_KEYS`): Die App fragt vier Maße in der Mitte (Öffnung Höhe und Breite, Element Höhe und Breite), danach die Ränder (Höhe links und rechts, Breite oben und unten, „Wie Mitte“ möglich); je Richtung zählt das kleinste von drei Maßen. Preis (portal.js 905, AGB § 5): 7,99 € einmalig für das ganze Projekt, auch wenn Fenster dazukommen; Einführungspreis bis 17. November, danach 12,99 €; über den Link des Fensterbauers kostenlos. Pakete (modell.js `PREISE0`, Nutzungsbedingungen): die ersten drei Aufmaße frei, dann 9 € je Projekt, Abo 10 für 49 €, Plus für 79 € im Monat (netto). Pilotphase: Wortlaut aus gemeinsam.js `PilotHinweis`.

Umgesetzt: siehe Änderungsliste (Umbau) und `start/abnahme-brief.md`. Gemessen (Playwright 390 × 844 und 1280 × 800): Pille oben 562 px (Schreibtisch 455), genau eine Cream-Pille auf Bildschirm eins, kein Querscrollen, nach 3,2 s laufen 0 Animationen, Kopfzeile kehrt beim Hochscrollen mit Cream-Pille zurück. Kontraste auf echtem Grund: Text 16:1, Text2 11:1, Grün 10,5:1, Orange im Chip 7,3:1, Muted 5,3:1 bis 5,8:1. Schieltest (Graustufen, 8 px): Foto, Überschrift, Pille als drei Formen, die Pille der einzige helle Punkt. `impeccable detect`: nur Scheinbefunde (der Detektor rechnet mit weißem Grund).

Nicht geändert, dem Inhaber vorgelegt: Name der Ansicht „Hauseigentümer“ (Mieter), „du“ für Hauseigentümer, Waschbär als Held (abschaltbar im Betriebskonfigurator wäre Produktwunsch), Datenschutz der Fotos nur über den Fußlink, Schreibtischfoto als Karte (Roth wollte randlos), Einführungsband oben.

## Abnahme (Runde 3, Fassung Y2, 26.10., 0 bis 6 Uhr)

| Gruppe | Hände | Median (Runde 2) | Aufgabe | Vetos |
| --- | --- | --- | --- | --- |
| Gestalter | 4, 4, 4, 4, 3, 4 | 4 (4) | Schieltest drei Formen, eine Cream-Pille, Hauptaktion auf der Achse, Bewegung zieht einmal | keine offen (Roth erledigt) |
| Kunden | 4, 4, 4, 4, 4, 2 | 4 (3) | Was es ist: 6 von 6 · was es kostet, mit Einheit: 6 von 6 · was sie tun: 5 von 6 (Gegenspieler schließt) · Abbruch Bildschirm eins: nur der Gegenspieler | Kraus erledigt · Hofmann: Kamera erledigt, offen „Hauseigentümer“ ohne Mieter und Verbleib der Fotos (beide dem Inhaber vorgelegt) |
| Fensterbauer | 4, 4, 3, 4, 4, 3 | 4 (3) | kaufen Median 3 (Runde 2: 3), zeigen 4 (3,5); Weg zu „Für Fensterbauer“ 6 von 6; fachlich stimmig 6 von 6 | keine offen (Brandt, Lindqvist erledigt) |

Konsent: Gestalter ja. Kunden fast: eine Hand unter 3 (Gegenspieler, Gründe sind Produktentscheidungen). Fensterbauer: Hände und „zeigen“ ja, „kaufen“ bei 3; die Kaufhindernisse liegen außerhalb der Startseite (Teamkonto, AVV, Serverstandort, Referenzbetrieb, Marke sichtbar). Damit ist die Grenze von drei Runden erreicht; die Vorlage sagt offen, woran es hängt.

Nach der Abnahme noch umgesetzt (jede Forderung mit Mehrheit oder ohne Gegenstimme, nur mit belegten Aussagen):
- Kopfzeilen-Pille bleibt immer Umriss und heißt wie die Hauptaktion „Jetzt ausmessen“; Kopfzeile erscheint erst nach 24 px Hochscrollen (Keller, Hartwig, Lenz).
- Preisabschnitt: „7,99 € einmal fürs Aufmaßblatt, alle Fenster“, dazu der Zahlweg „mit Karte, Apple Pay oder Google Pay, über Stripe“ (Keller, Pohl; Voreinstellung ZAHLARTEN=card in functions/api/umgebung.js).
- Takte: Kicker 0, Zeilen 0/80 (500 ms, fertig bei 580), Lead 160, Linie ab 800, Wert bei 1700; Luft vor der Pille 40 px, Pille bei 584 px (Brandner, Veit).
- „So geht es“ statt „Drei Schritte“, Beschriftung „Schritt 1 · 4 · 5“ wie das Zählwerk der App (Berger, Roth).
- Hinweis unter der Pille: „Dein Aufmaß samt Fotos bleibt auf deinem Gerät, bis du es sicherst oder sendest.“ (Demir, Berger, Hofmann; Beleg: app.js `Fotos`, Gast bleibt auf dem Gerät).
- Nachmess-Satz direkt unter dem Beispielblatt; Schritt 5 nennt den Weg ohne Einladung („Du gibst es jedem Fensterbauer deiner Wahl“) (Kraus, Vogel).
- Maueröffnung konkret: „Breite oben, Mitte, unten; Höhe links, Mitte, rechts; die App nimmt das kleinste Maß“ (Reuter, Kraus).
- Für Fensterbauer: Pilotphase und Preise in einem Satz, nicht mehr gedämpft: „Pilotphase: noch kostenlos. Danach sind die ersten drei Aufmaße frei, dann 9 € je Projekt oder ein Abo ab 49 € im Monat, netto. Konto und Projekte bleiben bis dahin in Ihrem Browser; jedes Aufmaß sichern Sie als PDF.“ (Yilmaz, Lindqvist, Sonntag, Hartwig).

Nicht übernommen (Minderheit oder außerhalb der Seite): Foto über dem Kicker enden lassen und Foto-Zoom streichen (Veit, Brandner; Regelbeispiel erlaubt beides), Beispielblatt antippbar (Vogel; in der echten Seite verlinkt es das PDF), „Hebe-Schiebe-Tür“ bricht am Telefon am Bindestrich (Roth), Modell 1.790/1.410 gegen Blatt 1.789/1.409 und „8 Fotos ausgewertet“ auf dem Blatt (Brandt; Sache des Aufmaßblatts), „Ränder“ im Schrittnamen (App-Begriff), Fensterbank innen oder außen (App-Text), Bär-Schalter und „Sie“ im Betriebskonfigurator (Sonntag), Marke des Betriebs sichtbar, AVV und Serverstandort (Kranich, Lindqvist; Fensterbauer-Ansicht).

Gemessen an der Endfassung (Playwright, Inter lokal): Pille oben 584 px (Schreibtisch 447), eine Cream-Pille auf Bildschirm eins, beim Hochscrollen keine zweite, kein Querscrollen, nach 3,2 s 0 Animationen, keine Konsolenfehler.

## Änderungstabelle für den Inhaber

| Änderung | Zweck | Gremium | Stand |
| --- | --- | --- | --- |
| Kopf: Foto groß, Waschbär und Maßlinie am Zollstock mit „1.410 mm · abgelesen am Zollstock“, Überschrift „Fenster ausmessen. Selbst. eezi.“, ein Preissatz mit Einheit, Pille unter 600 px | Blickführung, Verständnis | alle drei Gruppen dafür | bleibt |
| Pilot-Balken, Einführungsband, Streichpreis, Countdown vom ersten Bildschirm entfernt; Einführungspreis im Preisabschnitt, Pilotphase bei den Fensterbauern | Verständnis, Vertrauen | Kunden fordern es, Gestalter dafür, Fensterbauer wollten den Hinweis nur ehrlich | geändert; **Inhaber entscheidet**, ob das Band oben wegbleibt |
| Glas-Nachricht „Aufmaßblatt fertig“, Chips und Licht im Kopf | Blickführung | Mehrheit „ändern“ (vier Stimmen auf einem Foto) | zurückgenommen |
| Kopfzeile verschwindet beim Lesen, kommt beim Hochscrollen zurück; ihre Pille immer Umriss, Name „Jetzt ausmessen“ | Handlung auf jedem Bildschirm, eine Cream-Pille | Gestalter | geändert |
| Schalter Hauseigentümer / Fensterbauer tonal mit Pfeil | Weg für Fensterbauer | Gestalter, Fensterbauer 6 von 6 finden den Weg | geändert |
| Messband statt Statistikreihe | Marke, Ehrlichkeit | Mehrheit behalten (Hartwig: Schmuck) | bleibt |
| „So geht es“: drei echte App-Bildschirme (Schritt 1, 4, 5), Beschriftung darüber, 280 px | Beweis, Hierarchie | alle Gruppen | geändert; Schritt 4 zeigt den Entwurf „Maße neu gedacht“, noch nicht gebaut |
| „Was im Aufmaß steckt“: Beispielblatt mit Liste, Nachmess-Satz, Zeile für Fensterbauer | Vertrauen | Kunden, Fensterbauer | geändert |
| Sechs Elementarten als Symbole statt leerem Platzhalter | Beweis | alle | bleibt |
| Preis: „7,99 € einmal fürs Aufmaßblatt, alle Fenster“, „danach 12,99 €“, Zahlweg | Verständnis, Ehrlichkeit | Kunden, Gestalter | geändert |
| Ratgeber als drei Zeilen statt neun Kacheln | Hierarchie | alle | bleibt |
| Für Fensterbauer: „Ihre Kunden zahlen nichts“, Link-Einbau, Pilotphase und Preise in einem Satz | Vertrauen, Kaufen | Fensterbauer | geändert |
| Bewegung: vier Takte, Pille ab Bild eins, nach 2,1 s Stille, beim zweiten Aufruf nichts, bei „weniger Bewegung“ alles sofort | Bewegung zieht einmal | Gestalter, Kunden | geändert |

Offen für den Inhaber: Name der Ansicht „Hauseigentümer“ (Mieter), „du“ gegenüber Kunden über 55, Band mit Einführungspreis ganz oben, Referenzbetrieb, Schalter für den Waschbären im Betriebskonfigurator, AVV und Serverstandort im Fuß, Angleichen von Blatt und Modell (1.789 gegen 1.790).

Vorschau: Artefakt „Startseite neu gedacht“ (https://claude.ai/artifact/MvM53eefcKSNrcNeiM7Rsh), Quelle in docs/profis/startseite-vorschau/ (index.html ohne Dokumentgerüst, Bilder daneben), Montagen in docs/profis/bilder/2026-10-26-startseite-*.jpg. Nichts ist online.

## Antwort des Inhabers

Noch keine.

## Realitäts-Check

Steht aus. Fragekarte: zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe: „Was würdest du jetzt tun?“ (wörtlich notieren), „Was kostet das?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“

## Nachtrag 26.10.: Wunsch des Inhabers zum Kopf (nur ultimativ-webdesign, ohne Gremium)

Rückmeldung: Kopfzeile „super“; die Maßlinie im Foto „hässlich“; es fehlen Chips, die zeigen, was man alles machen kann, auch in Richtung Konfigurator.

Umgesetzt (Version 2 des Artefakts):
- Maßlinie und Plakette „1.410 mm · abgelesen am Zollstock“ entfernt; das Foto bleibt frei.
- Lead endet mit Doppelpunkt: „Zwei Fotos, vier Maße mit dem Zollstock. Dann planst du dein neues Fenster:“, darunter die Bausteinleiste mit den echten Symbolen aus dem Glossar der App: Öffnungsart, Material, Farbe, Glas, Sprossen, Griff, Sicherheit, Rollladen, Insektenschutz, Fensterbank (Kapitel der Wünsche laut `KAPITEL` in app.js). Am Telefon eine wischbare Leiste bis an den Rand, rechts ausgeblendet, der vierte Baustein schaut an; ab 720 px umbrochen (4/4/2). Schilder ohne Rand, ohne Hover, ohne Pfeil, damit sie nicht wie Knöpfe wirken.
- Preissatz direkt unter den Knöpfen („Messen ist kostenlos, das Aufmaßblatt für alle Fenster kostet einmal 7,99 €.“), damit die Pille unter 600 px bleibt.
- Auftritt: Foto, Überschrift, Lead wie bisher; ab 420 ms gleiten die Bausteine je 50 ms später von rechts herein (zeigt: da kommt mehr), fertig nach 1,2 s; nach 2,4 s wird die Klasse gelöst, es hängt keine Animation mehr.
- Verworfen: Chips als Glasplättchen auf dem Foto (verdecken den Waschbären), zwei Reihen (Pille rutscht über 600 px oder das Foto schrumpft auf 300 px).

Gemessen: Pille 599 px (Schreibtisch 474), eine Cream-Pille, kein Querscrollen, Leiste am Telefon 1.190 px breit und per Tastatur erreichbar, am Schreibtisch ohne Tabstopp, bei „weniger Bewegung“ alles sofort.

## Nachtrag 26.10., zweiter Wunsch: Kopf entschlacken, Band, Ablauf (ultimativ-webdesign und webdesign-wow, ohne Gremium)

Rückmeldung zum Bildschirmfoto: Der Kopf ist „zu überlagert mit Informationen“, „zu viele kleine feinteilige Sachen“; gewünscht: das waagerechte Band wie auf der Seite für Fensterbauer (Elemente und Fakten zum Konfigurator), danach ein Ablauf samt Schritt Konfigurieren, dann das Aufmaßblatt.

Umgesetzt (Version 3 des Artefakts):
- Kopf: nur Foto (420 px), Überschrift, ein Satz („Messen kostet nichts. Das Aufmaßblatt für jeden Fensterbauer kostet einmal 7,99 €.“), „Jetzt ausmessen“ und „Erst ansehen“ nebeneinander. Gestrichen: Kicker, Bausteinleiste, Preiszeile, Hinweise, Messband. Pille bei 592 px.
- Band „Aus dem Konfigurator · Jedes Fenster. Bis ins Detail.“ nach dem Muster von /fuer-fensterbauer/ (Laufband, gegenläufiges Faktenband, Halt-Knopf, weiches Anhalten bei Finger, Maus und Fokus). Statt Bildplätzen zehn echte, freigestellte Ansichten aus dem 3-D-Modell der App (gerendert mit docs/profis/werkzeuge/startseite-renderings.mjs über den Startbildschirm, `frei: true`). Fakten aus der App gezählt: 6 Elementarten (OPT.art), 7 Fensterformen (OPT.form), 5 Materialien, 239 Farben und Dekore (COLORS), 7 Glas-Extras (OPT.glasfn), 6 Arten Insektenschutz, 124 Begriffe erklärt (GLOSS), 0 € fürs Messen. Das Band läuft erst, wenn es zu 70 % im Bild ist; davor und außerhalb steht die Animation (gemessen: pausiert bei 0, im Bild läuft sie, nach Halt pausiert). Bei „weniger Bewegung“ steht es und lässt sich wischen, die Klone sind ausgeblendet.
- Ablauf „So geht es · Vom Zollstock zum Aufmaß.“: 01 Fotografieren, 02 Messen, 03 Konfigurieren (grün markiert), 04 Aufmaßblatt, je mit echtem Bildschirm der App (Fotos, Maß 1 von 4, Farbe außen am 3-D-Modell, Ausschnitt des Blatts). Telefon senkrecht mit Linie, ab 900 px vier Spalten mit waagerechter Linie. Darunter die Führung in einem Satz.
- Danach das Aufmaßblatt wie bisher; der Abschnitt „Sechs Elementarten“ entfällt (steckt jetzt im Band).

Gefunden beim Rendern: Bei Bogenformen (Rundbogen, Segmentbogen) zeichnet das 3-D-Modell der App oben ein einzelnes Beschlagteil außerhalb des Rahmens. Für die Bilder freigestellt; in der App noch zu beheben.

Offen: Die Fakten auf /fuer-fensterbauer/ (1.280 Kombinationen, 14 Fensterarten, 36 Farben und Dekore, 5 Profilsysteme, 3 Verglasungen, < 5 Min.) haben keinen Beleg im Code und weichen von den gezählten Werten ab; dort stehen auch noch Bildplätze statt Renderings.

## Nachtrag 26.10., dritter Wunsch: „So geht es“ animiert (ultimativ-webdesign und webdesign-wow, ohne Gremium)

Rückmeldung: Bildschirmfotos im Ablauf sind „schwach“; gewünscht ist die Abfolge animiert, auf dem Niveau der Skills.

Umgesetzt (Version 4 des Artefakts), Idee „Ein Fenster, vier Takte“ (Leitideen Bühne und Licht, ein Held, Bewegung mit Bedeutung, Beweis; Vorbilder V7 „Foto löst sich in Linienzeichnung“ und V1 „Aufbau in Takten“):
- Bühne 1:1 (Telefon 358 px, Schreibtisch 560 px) mit einem einzigen Fenster, das durch alle Schritte reist; daneben bzw. darunter die vier Schritte mit Fortschrittsbalken, antippbar. Halt-Knopf; läuft nur, wenn die Bühne zu 45 % im Bild ist; bei „weniger Bewegung“ kein Ablauf, jeder Schritt zeigt sein Endbild (Grundzustand jedes Teils ist das Endbild).
- Takt 1 Fotografieren (4,6 s): Fenster in der Wand von innen (3-D-Modell der App), Sucher schließt sich, Auslöser, das Bild fliegt als Vorschau „innen“ in die Ecke; dann außen (Anthrazit, Fassade), Vorschau „außen“; „Einbausituation erkannt“.
- Takt 2 Messen (4,8 s): das Foto löst sich in eine technische Zeichnung auf (Linien zeichnen sich), dann die vier Maße in der Reihenfolge der App: Öffnung Höhe 1.409 (orange), Fenster Höhe 1.385 (blau), Öffnung Breite 1.789, Fenster Breite 1.760; Zähler „Maß 1 von 4 … Alle Maße in mm“. Die Werte sind Zeile 1 des echten Aufmaßblatts (Wohnzimmer).
- Takt 3 Konfigurieren (5,0 s): aus der Zeichnung wächst das 3-D-Modell (weiß), der Ring springt auf Anthrazitgrau RAL 7016, das Fenster färbt sich um; der Schalter „Sprossen“ geht an, Wiener Sprossen erscheinen. Drei Renderings mit identischer Kamera (docs/profis/werkzeuge/startseite-so-renderings.mjs).
- Takt 4 Aufmaßblatt (4,8 s): das Blatt steigt auf, das Fenster fliegt in Zeile 1, die vier Positionen leuchten nacheinander auf und haken sich ab; „Aufmaßblatt.pdf · für jeden Fensterbauer“, „einmal 7,99 €“.
- Technik: CSS-Keyframes auf transform, opacity und stroke-dashoffset; der Fortschrittsbalken treibt per animationend den Wechsel; kein GSAP nötig. Bildfolge zur Prüfung: docs/profis/bilder/2026-10-26-startseite-so-ablauf.jpg.

Gemessen: kein Querscrollen, Pille 592 px, nach dem Auftritt im ersten Bildschirm keine laufende Animation; Bühne pausiert vor dem Sichtbarwerden, beim Hochscrollen aus dem Bild und bei verstecktem Tab.

Hinweis: Die Schritte bündeln die sechs Schritte der App (Start, Fotos, Einzeichnen, Maße, Ergebnis, Wünsche) zu vier.

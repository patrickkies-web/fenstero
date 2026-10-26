# Abgleich Typografie (Daniel Roth): Landingpage Y, Paket Essential Plus (Fensterbau Brandt)

Grundlage: Brief vom 26.10.2026, die Vorlagen 01–12 unter docs/profis/vorlagen/2026-10-26/, die Formensprache (DNA Abschnitt 5, 6 und 10, Skill Abschnitt 3 mit G15 und der Luft 6/12/32/48), die Bilder von Y (Telefon drei Streifen, Schreibtisch 01–08) und docs/profis/essential-plus-vorschau/start.css. Eine Runde, Perspektive Typografie; keine andere Datei geändert.

**Gesamteindruck.** Y spricht in der Stimme der Startseite: Titel 600 eng, Labels 12/400 mit 0,03 em, Lesetext in Grau, Einheiten auf der Grundlinie. Wo die Vorlagen aber **eine** Sache sprechen lassen (die Zahl, das Foto, das Wort), reden bei Y zwei bis sieben Stimmen gleich laut: Auf dem zweiten Telefonbildschirm stehen H2, fünf Fotobeschriftungen und der Kacheltitel alle in 600; in der Kontaktkarte ist das Telefon (32 px) kaum größer als der Firmenname (18 px), und die drei Knopfbeschriftungen darunter sind weiß und 500; das Etikett über jeder Szene ist ein einzelnes Wort ohne Wert, während die Vorlagen „Beschriftung — Wert“ setzen (05 „5 Months — Free Access“, 06 „Owned by — Jenni Bin“, 09 „Completed — 24“). Die Wortmarke folgt dem Bauplan von 03/05 (Versalienzeile zu fettem Wort), ist aber falsch gewichtet: die leise Zeile ist doppelt so breit wie die laute. Die Sprünge Held zu Nebenstimme liegen bei Y zwischen 1,8:1 (Telefon) und 2,5:1 (Zahl 5 zu Stationen); die Vorlagen liegen bei 5:1 bis 10:1 (08 „$4,032.00“ zu „Total Balance“, 10 „12.4 kWh“ zu „Energy Usage“, 01 „80 gr“ zu „French Fries“).

Was in Ordnung ist und bleibt: Hero-Kopfzeile (Kicker 12, H1 56/600, Lead mit einer 500-Zeile, Luft 6/12), Schritt-Karten (Label 12, Titel 24/600, Meta 14 in Grau), Route-Karte (18/500 mit 14-px-Meta), Bereit-Karte (Titel 600 mit zweiter Stimme, Pille 32 px unter dem Text), Fuß (Wortmarke, Rechtslinks 14, eine Zeile 13 für „Konfigurator von eeziframes“), deutsche Schreibweise mit geschützten Leerzeichen (0221 123456, 5 Minuten), Einheit 15 px an der Grundlinie der Zeit-Kachel.

## 1 · Kontaktkarte: das Telefon ist der Held, alles andere eine Stimme leiser · Wirkung hoch

**Wo:** `.ez-kontakt__daten .ez-kontakt__held dd`, `.ez-kontakt__betrieb b`, `.ez-kontakt__betrieb span span`, `.ez-kontakt__daten div`, `.ez-kontakt__daten dt`, `.ez-kontakt__daten dd`, `.ez-kontakt__wege a`, `.ez-kontakt` (gap).

**Was:** Heute 32 px/300 neben dem Firmennamen 18 px/500: Verhältnis 1,8:1. Die Paare E-Mail und Anschrift stehen als Tabelle (Spalte 76 px) in derselben Größe wie die Nebenzeile des Namens, die Werte in Grau wie die Beschriftungen; unter den Rundknöpfen drei weiße 500-Wörter. Auf dem Telefon (Streifen 3) ist die Nummer kleiner als die Überschrift darüber, am Schreibtisch (desk-08) füllt sie ein Fünftel der Kartenbreite. In den Vorlagen trägt die Innenkarte genau einen Wert, groß und dünn, mit einer kleinen Beschriftung darüber; alles andere ist 12–13 px in Grau.

**Wie:**
- `dd` des Helden: `font: 250 clamp(44px, 11vw, 56px)/1 var(--font-sans); letter-spacing: -.035em; font-variant-numeric: tabular-nums; color: var(--weiss)`; ab 900 px 56 px. Schreibweise bleibt „0221 123456“ mit geschütztem Leerzeichen (DIN 5008, keine weitere Gruppierung). `dt` „Telefon“ bleibt 12/400 mit 0,03 em, Abstand zur Zahl 6 px (heute `gap: 6px`, bleibt).
- Firmenname `b`: `font: 500 16px/1.2`, Nebenzeile `13px/1.3` in `tinte-2`; der Name bleibt lesbar, tritt aber hinter die Zahl.
- Paare: `div { display: flex; flex-wrap: wrap; gap: 0 8px; align-items: baseline }` statt der 76-px-Spalte; `dt::after { content: "\00a0—"; }` (Halbgeviertstrich); `dt` 13/400 in `tinte-2`, `dd` `15px/1.4` in `var(--tinte)` (Wert weiß, Beschriftung grau, wie 06 „Owned by — Jenni Bin“). Ergebnis: „E-Mail — info@fensterbau-brandt.de“, „Anschrift — Musterstraße 12, 50667 Köln“ (die Anschrift in einer Zeile, am Telefon umbrechend nach dem Komma).
- Knopfbeschriftungen `.ez-kontakt__wege a`: `font: 400 12px/1; letter-spacing: .03em; color: var(--tinte-2)`; die weißen Ringe bleiben das Zeichen, die Wörter die leise Stimme.
- Luft: Betrieb → Held 24 px, Held → Paare 16 px, Paare → Knöpfe 32 px (Text → Handlung); heute überall 16 px (`gap: var(--raum-4)`), dazu `margin-top: 16px` an `.ez-kontakt__wege`.

**Warum:** Vorlage 08 (Dashboard: „Total Balance“ 12 px, darunter „$4,032.00“ dünn über die halbe Breite), 07 (schwarze Innenkarte „Balance / $3,240.99“, der eine Wert mit rundem Knopf), 10 (Domus „12.4 kWh“ in 300, Einheit winzig, Titel darüber leicht), 06 (Detailblatt „Current Bid / 0.91231 ETH“ und „Sale End / 48h · 16m · 59s“ als Beschriftung über Wert, Paare in einer Zeile).

## 2 · Fotoplätze und Chips: eine Zeile je Platz, kein 600 auf einem Platzhalter · Wirkung hoch

**Wo:** `.ez-foto__text`, `.ez-foto__text b`, `.ez-foto__text span`, `.ez-foto--gross .ez-foto__text b`, `.ez-glaschip--foto` (Basis `.ez-glaschip`), figcaption-Wortlaut in index.html Zeilen 144, 150, 166, 172, 178.

**Was:** Auf dem zweiten Telefonbildschirm stehen sieben schwere Elemente: H2 600, „Werkstatt“ 24/600, „Montage“, „Team“, „Ausstellung“, „Referenz“ 18/600 und „Alles, was Sie planen“ 24/600 (G15: eines je Bild). Die Beschriftung lautet einmal „Foto folgt vom Betrieb“, viermal „Foto folgt“. Die Zustands-Chips „Foto n von 6“ (500 12 px) und die Hinweis-Chips der Muster-Ebene „Ihre Fotos, bis zu 6“ (500 12 px) sprechen gleich; auf dem großen Platz stapeln sie sich. Sobald der Betrieb echte Fotos liefert, bleibt das schwere Wort auf dem Bild stehen und konkurriert mit dem Foto, das der Held sein soll.

**Wie:**
- Beschriftung in **einer** Zeile nach dem Muster „Beschriftung — Wert“: `<figcaption class="ez-foto__text"><b>Werkstatt</b><span> — Foto folgt</span></figcaption>`; `.ez-foto__text { display: block; font: 400 13px/1.3 var(--font-sans); letter-spacing: .02em; color: var(--silbergrau) }`, `b { font: 500 15px/1.2; letter-spacing: -.01em; color: var(--weiss) }`, großer Platz `b` 17 px. Derselbe Wortlaut auf allen fünf Plätzen („Foto folgt“); dass die Fotos vom Betrieb kommen, sagt die Muster-Ebene mit „Ihre Fotos, bis zu 6“.
- Zustands-Chip „Foto n von 6“: `font-weight: 400; letter-spacing: .02em; font-variant-numeric: tabular-nums`, Ring bleibt. Hinweis-Chips der Muster-Ebene bleiben 500 mit Koralle-Punkt. So trägt jedes Zeichen eine Bedeutung: 500 + Punkt = Hinweis für den Fensterbauer, 400 + Ring = Zustand.
- Abstand Beschriftung zum unteren Rand 14 px (heute 12 px), damit die eine Zeile nicht an der Schraffur klebt.

**Warum:** Vorlage 01 und 02 (Glas-Karte: „Beef Ribs“ und „French Fries“ in 400, die Zahl und die Schale sind der Held; Chip „Step 2 of 5 · Grilling“ in 400 mit grauer Nebenstimme), 06 (Listenkarte: „Owned by — Jenni Bin“ 12 px über dem Titel 17 px, Bild links ist das Schwere), 03 („Star Allies“ 400 klein unter „Kirby“, nur ein Wort je Karte ist fett).

## 3 · Die zwei Kacheln „5 Minuten“ und „Alles, was Sie planen“: drei Ebenen, Zahl 250, Luft 6/12 · Wirkung mittel bis hoch

**Wo:** `.ez-zeit .dna-zahl__wert`, `.ez-zeit .dna-zahl__einheit`, `.ez-zeit.dna-leucht` (gap), `.dna-leucht__kopf`, `.ez-zeit .ez-klein`, `.ez-stationen li`; `.ez-planen__text`, `.ez-planen__text .dna-label`, `.ez-planen__text .dna-titel-s`, `.ez-planen__text .ez-klein`.

**Was:** Die „5“ steht in 200 bei 72–88 px: ein einzelner dünner Strich vor dem goldenen Leuchten, der am Telefon (Streifen 2, Mitte) weniger Gewicht hat als das 500-Wort „Fotos“ darunter. Vom Label „Je Fenster etwa“ bis zur Zahl liegen rund 28 px (`gap: var(--raum-4)` + `gap: var(--raum-2)` + Zeilenhöhe) statt 6. Unter der Zahl folgen Stationen **und** ein zweizeiliger Absatz: vier Ebenen, die DNA erlaubt drei (Label, Held, eine Zeile Meta). Die Planen-Kachel setzt Label, 600-Titel und einen dreizeiligen Absatz, der die Reihe darunter wörtlich wiederholt („Fenster, Türen, Hebe-Schiebe, Rundbogen, Sprossen, Rollladen und Raffstore“); am Telefon (`max-width: 58%`) läuft er in vier Zeilen neben dem Fenster. Die Glas-Karte der Vorlagen hat einen leichten Titel, eine Zahl, ein Objekt und den Pfeilkreis, keinen Absatz.

**Wie:**
- Zeit: `.ez-zeit .dna-zahl__wert { font-weight: 250; font-size: clamp(76px, 20vw, 96px); letter-spacing: -.045em }`, Einheit bleibt 15/400 in `tinte-2` auf der Grundlinie, `margin-left: .2em`. `.ez-zeit.dna-leucht { gap: 12px }` und `.dna-leucht__kopf { margin-bottom: -6px }` → Label → Zahl 6 px, Zahl → Stationen 12 px. Absatz wird eine Zeile Meta: `.ez-zeit .ez-klein { font-size: 13px; line-height: 1.3 }` mit dem Wortlaut „Pausieren jederzeit, die Planung bleibt auf dem Gerät.“ (46 Zeichen, eine Zeile ab 360 px). Stationen 13/400, aktive 500, bleibt.
- Planen: Titel `font: 500 22px/1.1; letter-spacing: -.02em` (die H2 der Szene ist das Schwere, die Glas-Karte der Vorlagen trägt den Titel leicht); `.ez-planen__text .dna-label { margin-bottom: -6px }` (heute −4); Meta eine Zeile 13 px: „Vom Fenster bis zum Raffstore.“; `max-width: 62%` am Telefon, damit die Zeile nicht bricht. Objekt und Pfeilkreis bleiben wie sie sind.

**Warum:** Vorlage 10 (Domus „12.4 kWh“ in 300, Titel und Chip unmittelbar darüber, darunter nur das Diagramm), 08 („Total Balance“ ohne Luft über der Zahl, eine Zeile Meta), 04 (Heeal „3824“ mit Kapsel „2,7 km“: Zahl, Einheit, sonst nichts), 01 und 02 (Glas-Karte: leichter Titel, Zahl mit winziger Einheit, Objekt ragt heraus, Pfeilkreis auf der Ecke, kein Absatz).

## 4 · Wortmarke des Betriebs: ein Block mit zwei Stimmen, die Versalien über dem Wort · Wirkung mittel

**Wo:** `.ez-logo__wort`, `.ez-logo__wort b`, `.ez-logo__wort small`, `.ez-logo--klein .ez-logo__wort b`, `@media (min-width: 900px) .ez-kopf .ez-logo__wort b`; Reihenfolge der beiden Zeilen in index.html Zeilen 36, 50, 378.

**Was:** „Brandt“ 700 17 px ist etwa 55 px breit, „FENSTERBAU · KÖLN“ 11 px mit 0,08 em etwa 118 px: die leise Zeile ist doppelt so breit wie die laute, der Block kippt nach rechts, und mit 2 px Zeilenabstand berühren sich Unterlänge und Versalhöhe. In den Vorlagen 03 und 05 steht „NINTENDO“ gesperrt **über** „SWITCH“; das fette Wort ist die Basis, die Versalien sitzen als schmale Zeile darüber, und die Laufweite ist deutlich weiter (etwa 0,2 em). Dazu kommt: der Hero-Kicker „Fensterbau Brandt · Köln“ wiederholt 60 px unter der Wortmarke deren zweite Zeile Wort für Wort (siehe Hebel 5).

**Wie:**
- Reihenfolge wie in 03/05: `small` oben, `b` unten (`.ez-logo__wort { display: grid; gap: 3px }`, im HTML `<small>Fensterbau · Köln</small><b>Brandt</b>`).
- `small { font: 400 10px/1; letter-spacing: .16em; text-transform: uppercase; color: var(--tinte-2) }`; `b { font: 700 20px/1; letter-spacing: -.025em }`, ab 900 px 22 px; Leiste (`.ez-logo--klein`) `b` 16 px, `small` 9 px mit 0,14 em. Zeichen 36/40 px bleibt; die Wortmarke wird damit etwa so hoch wie das Zeichen (10 + 3 + 20 = 33 px), heute 30 px.
- 700 bleibt das eine schwere Gewicht der Marke, wie „SWITCH“ in 03 und 05; in der Kontaktkarte und im App-Logo bleibt der Name 500 bzw. 400, weil dort die Zahl bzw. das Gerät der Held ist.

**Warum:** Vorlage 03 und 05 (Wortmarke „NINTENDO / SWITCH“: gesperrte Versalien schmal über dem fetten Wort, gleiche Blockbreite), 09 (Zeichen + „ME Team · May. 2024“ 500 mit Meta in einer Zeile, Versalien nirgends breiter als das Wort), 06 (Wortmarke im Kopf als eine Zeile neben dem Zeichen).

## 5 · Kopfzeilen der Szenen: „Beschriftung — Wert“ als Etikett, Luft 6/12/32 gleich · Wirkung mittel

**Wo:** `.ez-kopfzeile > .dna-label`, `.ez-kicker`, `.ez-kopfzeile--betrieb .dna-text`, Etiketten in index.html Zeilen 112, 133, 200, 279, 320, 347; neue Klasse `.ez-label__wert`.

**Was:** Die Etiketten sind Ein-Wort-Schilder („So geht es“, „Ihre Daten“, „Fragen vorab?“, „Bevor Sie starten“, „Fensterbau Brandt“): eine Stimme, kein Wert. Die Vorlagen geben dem Etikett einen Wert in Schwarz oder Weiß: 05 „5 Months — Free Access“, 06 „Owned by — Jenni Bin“, 09 „Tasks · Completed — 24“, 03 „Special Skills (Unlocked)“. Der Hero-Kicker wiederholt die Wortmarke; „Fensterbau Brandt“ steht auf den neun Telefonbildschirmen elfmal. Der Lesetext der Betrieb-Szene läuft 44ch (DNA: 36ch).

**Wie:**
- Markup `<span class="dna-label">So geht es<span class="ez-label__wert"> — vier Schritte</span></span>`; `.ez-label__wert { color: var(--tinte); }` (400, nicht 500: das Schwere bleibt die H2). Wortlaut: Hero „Konfigurator — Fensterbau Brandt, Köln“ (sagt, was die Seite ist, und ersetzt die Dopplung mit der Wortmarke); Szene 2 „Der Betrieb — Köln und Umgebung“; Szene 3 „So geht es — vier Schritte“; Szene 4 „Ihre Daten — nur an den Betrieb“; Bereit-Karte „Bevor Sie starten — vier Dinge“; Kontakt „Kontakt — werktags im Büro“. Keine Zahl darin, die anderswo der Held ist (die „5 Minuten“ bleiben der Zeit-Kachel).
- Luft prüfen und halten: Etikett → Titel 6 px (`margin-bottom: -6px` + `gap: 12px`, heute richtig), Titel → Text 12 px (richtig), Text → Pille 32 px im Hero und in der Bereit-Karte (`.ez-aktionen { margin-top: 20px }` bei `gap: 12px`), Gruppe → Gruppe 48 px zwischen Kopfzeile und Bento, Schritten, Route (heute `gap: var(--raum-6)` = 32 px am Telefon; auf 48 px). `.ez-kopfzeile--betrieb .dna-text { max-width: 36ch }`.

**Warum:** Vorlage 05 (Kicker mit Zeichen, Wert in Farbe, Rest grau mit Halbgeviertstrich, 6 px über dem Riesen-Titel), 06 („Owned by — Jenni Bin“ als Etikett über jedem Titel), 09 („Completed — 24“, Etikett mit Wert im Kopf), 03 (Beschriftung mit Zustand in Klammern).

## Die fünf nach Wirkung

1. Kontaktkarte: Telefon 44–56 px/250, Firmenname 16/500, Paare als „Beschriftung — Wert“, Knopfwörter 12/400, Luft 24/16/32 (Vorlagen 06, 07, 08, 10).
2. Fotoplätze: eine Zeile „Werkstatt — Foto folgt“ (15/500 + 13/400), Zustands-Chips 400 mit Ring, Hinweis-Chips 500 mit Punkt (01, 02, 06, 03).
3. Zeit- und Planen-Kachel auf drei Ebenen: „5“ 250 bei 76–96 px, Label → Zahl 6 px, eine Zeile Meta statt Absatz; Planen-Titel 22/500 mit einer Zeile Meta (10, 08, 04, 01/02).
4. Wortmarke: Versalien 10 px mit 0,16 em über dem Wort 20/700, Abstand 3 px (03, 05, 09).
5. Kopfzeilen: Etikett mit Wert „So geht es — vier Schritte“, Hero-Kicker „Konfigurator — Fensterbau Brandt, Köln“, Lesetext 36ch, Gruppe → Gruppe 48 px (05, 06, 09).

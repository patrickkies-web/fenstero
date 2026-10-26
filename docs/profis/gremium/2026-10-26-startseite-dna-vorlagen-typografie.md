# C · Typografie und Komposition (Daniel Roth)

**Gemeinsamkeit.** In jeder Vorlage ist genau ein Element schwer und riesig, ein Titel in 600–700 („Grilled Ribs“, „Fun Games“) oder eine Zahl in 300–500 („12.4 kWh“, „3824“), alles andere liegt drei Stufen darunter: 11–13 px, Gewicht 400, gedämpft; der Sprung ist 5:1 bis 10:1, bei uns zwischen Titel und Lesetext 36:16 = 2,25:1. Jede Karte hat drei Ebenen (winziges Etikett, Held, eine Zeile Meta oder eine Pille), nie einen Absatz; unser 16-px-Absatz in drei Zeilen ist das Website-Merkmal. Die Luft ist gestaffelt (4–6 px in der Gruppe, 12 dazwischen, 24–32 vor Blöcken), bei uns 16 px überall, so hängt nichts zusammen und nichts setzt sich ab.

## 1 · Der Held ist schwer, der Rest leicht
Wo: `.dna-titel-xl`, `.dna-titel` (h1, alle h2). Was: Gewicht 600; `titel-xl` clamp(44px, 9.5vw, 64px)/.95, −.035em; `titel` clamp(30px, 6.5vw, 40px)/1.02, −.025em; `titel-s` bleibt 500/22. Lesetext unter Titeln ab 900 px 15 px/1.5, Telefon 16. Warum: Outfit 500 bei 56 px hat Striche wie der 400er-Text daneben, der Titel sitzt nicht; die titeldominierten Vorlagen (02, 03, 05) setzen 600–700, die zahldominierten (10–12) 400–500. Regel: je Bild ein schweres Element; ist es eine Zahl, bleibt der Titel bei 500. DNA: Anpassung (500 → 600 für Display-Größen); Palette ja.

## 2 · Zahl mit Einheit, auch im Hero
Wo: `.dna-zahl--klein` (219 Töne, 15 Dekore), Hero-Etikett. Was: kleine Zahlen 300 statt 250, Schreibtisch 56 px; Einheit 14 px/400 `tinte-2`, .25em Abstand, auf der Grundlinie; `7,99` bleibt 88/250. Hero-Etikett zweizeilig wie die Glaskarte „Beef Ribs / 160 gr“: Etikett 11 px/500, Wert 24 px/400 tabellarisch, „mm“ 12 px `tinte-2`. Warum: 250 bei 48 px ergibt 1,6-px-Striche, das 500er-Etikett „RAL-Farben“ wirkt schwerer als der Held; Domus setzt „22.5 °C“ um 300. Im Hero ist unser Größtes der Titel, in den Vorlagen die Zahl. DNA: 200–250 → „200 ab 88 px, 300 darunter“; Palette ja.

## 3 · Karten in drei Ebenen
Wo: Schritte-Karten (`.ez-stufe__text`), Bento-Großkachel, Ratgeber. Was: `.dna-label` 12 px/400 statt 500, Laufweite .03em, Satzschreibung bleibt (Versalien nur in 3 von 12 Vorlagen, immer winzig, nie neben einer Zahl); Kartentitel 24 px/600; Meta 14 px/1.45, höchstens zwei Zeilen, 30ch; der harte Fakt („4 Maße“) als `dna-badge--leise` statt im Satz. Warum: Vorlagenkarten („Kirby / Star Allies“) haben nie Fließtext; Dichte entsteht aus kleiner Meta, nicht aus weniger Inhalt. DNA ja (16 px bleibt Lesestrecken); Palette ja.

## 4 · Luft nach Hierarchie
Wo: alle Textspalten (`.ez-kopfzeile`, `.ez-text`, `.ez-stufe__text`), Preis-Spalte. Was: Etikett→Titel 6 px, Titel→Text 12 px, Text→Pillen 32 px, Gruppe→Gruppe 48 px; „Kostenlos“ und Häkchen als eine Zeile 8 px unter dem Titel. Warum: sechs Elemente im 16-px-Takt lesen sich als Liste; die Vorlagen kleben Etikett an Wert und lassen vor der Handlung Raum. DNA ja (`raum-2/3/6/7`); Palette ja.

## 5 · Wortmarke und Kopfzeile zurücknehmen
Wo: `.ez-wm`, `.ez-kopf`. Was: Wortmarke in Outfit statt Inter, 18 px, „eezi“ 700, „frames“ 400, −.02em, Zeichen 26 px; Kopf-Pille 40 px/13 px (Telefon 44 bleibt). Warum: „eezi“ in Inter 900 ist heute das schwerste Element der Seite und eine zweite Familie; in den Vorlagen ist die Marke klein, oft nur Zeichen (05), der Held steht darunter. DNA ja (eine Familie); Palette ja. Liegt die Marke in Inter fest: 18 px und 800.

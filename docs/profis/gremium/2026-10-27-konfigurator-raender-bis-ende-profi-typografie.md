# Detail-Profi „Typografie“: Konfigurator Schritt 4 bis Teilen (27.10.2026)

**Grundlage:** Ich habe mit Playwright eigene Aufnahmen gemacht, mit dreifacher Pixeldichte bei 390 × 844, 375 × 812, 375 × 667 und 360 × 780. Die Ränder habe ich über die Tasten erreicht, wie im Brief beschrieben, dazu die Warnung mit 1320. Für die übrigen Folien bin ich mit `zeigeFolie` gesprungen. Je Text habe ich Schriftgröße, Gewicht, Zeilen und Umbruchstellen gemessen, außerdem die Grundlinie von Zahl und Einheit. Den Kontrast habe ich aus den Bildpunkten gerechnet.

**Wichtig:** Während meines Laufs (12:43 bis 12:50 Uhr) hat jemand start.css, abschluss.css und start.js geändert. Einige meiner ersten Befunde waren danach schon erledigt:
- Abstände 12 und 28 px auf den Abschlussfolien
- Etiketten 12 px auf den weißen Karten in start.css
- Grundlinie der Wertschilder im Ergebnis
- Preis auf dem Blatt jetzt 64/200

Die Tabelle gilt deshalb für den Stand von 12:50 Uhr; ich habe ihn danach noch einmal vollständig aufgenommen. Jeden Vorschlag habe ich im Testbrowser mit eingespritztem CSS oder Text erprobt.

**Bleibt:**
- Der Titel steht auf allen Folien mit 28/500 (unter 375 px mit 26) und ist bei allen vier Breiten einzeilig. Nur „Wie erreicht dich / dein Fensterbauer?“ ist zweizeilig, sauber getrennt.
- Zahl und Einheit stehen überall auf einer Grundlinie, gemessen Δ 0,0 px: Messfeld, Schilder auf „Passt.“ und im Ergebnis, die Karte „Passt.“, Heldenkachel im Ergebnis, Zähler in Anfrage 1, Blatt, Kasse.
- Der Tausenderpunkt fehlt nirgends.
- „7,99 €“ in der Pille und „1,28 €“ haben ein geschütztes Leerzeichen, ebenso „Schritt 4 von 6“, „5 mm“ und „19 %“.
- Es gibt keine Silbentrennung und kein getrenntes Wort. Getrennt wird nur am Bindestrich in „Muster-|Widerrufsformular“.
- Die Warnzeile passt jetzt bei allen Breiten (48 bis 52 px Inhalt in 52 bzw. 54 px).
- Die Wortmarke ist Inter 18 (eezi 900, frames 500).
- Kontrast: Alle Texte erreichen 4,5:1, außer dem Platzhalter (Nr. 7). Knapp ist nur „Fenster im ganzen Haus“ mit 12 px auf dem hellsten Fleck der Bühne (4,49:1).
- Titel → Unterzeile 12 px, Unterzeile → Karte 28 px. In Anfrage 1 und 2 sind es 18,6 px, weil der 44 px hohe Notiz-Knopf die Titelzeile hebt; das ist hinnehmbar.

| Nr | Befund (Stelle) | Wie (genauer Wert) | Wirkung |
|---|---|---|---|
| 1 | **Geschützte Leerzeichen fehlen bei Preis und Datum.** abschluss.js Z. 13: `bis: '17. November'`. Z. 15: `… + ' €'` mit normalem Leerzeichen. Im Markup: Budget „bis 5.000 €“, „5.000 bis 10.000 €“ usw., AGB „(Stand: 18. Oktober 2026)“, Stationen „In 1 bis 3 Monaten“. Auf dem Blatt bricht der Text bei allen vier Breiten nach „17.“; bei 360 steht „€“ allein in der dritten Zeile („danach 12,99 \| €“). | `bis: '17.' + NB + 'November'`; in `einfText` `euro(EINF.danach)` statt `+ ' €'`; im Markup `5.000&nbsp;€`, `5.000&nbsp;bis 10.000&nbsp;€`, `18.&nbsp;Oktober&nbsp;2026`, `1&nbsp;bis&nbsp;3`, `3&nbsp;bis&nbsp;6`. Erprobt: 390 „Einführungspreis bis \| 17. November, danach 12,99 €“, 375/360 dreizeilig ohne abgetrennte Einheit; Stationen „In 1 bis 3 \| Monaten“. | Hoch: Der Preis entscheidet den Kauf, und die DNA nennt genau diese Schreibweise. |
| 2 | **„Bis zum 03.11.2026“ (Gespeichert)** steht in Ziffern, Blatt und Kasse schreiben „17. November“. | `datumKurz`: `toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })`, Leerzeichen durch `NB` ersetzen → „Bis zum 3. November kannst du …“. Erprobt: 74 px, der Satz bleibt zweizeilig. | Mittel: eine Schreibweise für Daten. |
| 3 | **Die Umriss-Pille „Hier auch 1.410 mm gemessen?“** bricht seit dem Zusatz „141 cm“ bei 375 und 360 in zwei Zeilen (Text nur 128 px breit), auf Rand 1, 3 und 4. | `@media (max-width: 389px) { .ez-zeile__gleich { gap: 8px; padding: 0 12px; font-size: .875rem; white-space: nowrap } .ez-zeile__gleich small { margin-left: 2px; font-size: .75rem } }`. Erprobt: einzeilig (192 + 34 px) bei 375 und 360; 390 bleibt bei 15 px. | Hoch: Die wichtigste Abkürzung der Folie liest sich als ein Satz. |
| 4 | **Die Unterzeile spricht mit zwei Stimmen:** Messen, Ergebnis und Wünsche 14/1,4, alle Abschlussfolien 15/1,45 (abschluss.css `.ez-folie.ez-ab .ez-unterzeile`), dazu „Fenster · Vollständig“ in 15. | `font-size: .875rem; line-height: 1.4`; der Abstand von 12 px aus start.css bleibt. Erprobt: keine Folie bekommt eine Zeile mehr; Blatt bei 390 drei → zwei Zeilen. | Mittel: gleiche Rolle, gleiche Stimme von Schritt 4 bis Teilen. |
| 5 | **Formular-Etiketten 13 px** („Gebäude“, „Baujahr des Hauses“, „Name“, „E-Mail“, „Zahlungsart“). „Maueröffnung · Breite × Höhe“ auf „Passt.“ und alle Etiketten auf Anthrazit haben 12 px. `.ez-ab-form .dna-label` in abschluss.css überschreibt die neue 12-px-Regel aus start.css. | `.ez-ab-form .dna-label { font-size: .75rem }`, Textgrau auf Weiß 5,5:1. Erprobt: einzeilig. | Mittel bis niedrig: G15 gilt dann auf allen Folien. |
| 6 | **Der Notiz-Knopf hat 12/500** auf allen Folien mit Notiz (Ränder, „Passt.“, Ergebnis, Anfrage 1–3). Das Handlungswort liegt damit unter der Mindestgröße von 13 px. | `.ez-frage .dna-pille.ez-notizknopf { font-size: .8125rem }`. Erprobt: 30 px breit, passt in 52 × 44. | Mittel: für Ältere. |
| 7 | **Platzhalter „z. B. 1.250“:** Silbergrau auf Weiß nur 2,46:1. Er ist 36/300 groß, braucht also 3:1. | `.ez-mass__feld.is-leer b { color: color-mix(in srgb, var(--silbergrau) 50%, var(--textgrau)) }` = #8a868a, 3,6:1 (gerechnet). Er bleibt klar heller als ein getipptes Maß (Schwarz, 19:1). | Mittel. |
| 8 | **Die Kachel „Wünsche ändern“ (Gespeichert)** bricht bei 375 und 360 („Wünsche \| ändern“), daneben steht „Maße ändern“ einzeilig. | `.ez-ab-kachel { gap: 8px; padding: 10px 12px } .ez-ab-kachel span { white-space: nowrap }`. Erprobt: 111 px, einzeilig bei allen Breiten. | Mittel: vier gleiche Kacheln. |
| 9 | **Absatz in der Karte** (G15: Label, Titel, eine Zeile Meta oder Pille). Gespeichert, „Wie geht es weiter?“: 3 + 2 + 2 Zeilen, 260 px hoch. Teilen, „An deinen Fensterbauer“: 5 Zeilen 15/400 in Weiß. | Gespeichert: „Noch ein Fenster? Dann tipp auf „Weiteres Fenster“.“ wird Kartentitel 17/500. „Alles erfasst? …“, „Speichern kostet nichts …“ und „Maße, Wünsche …“ stehen als `.ez-ab-hilfe` unter der Karte. Teilen: In der Karte bleibt nur „Schick ihm das Aufmaßblatt als PDF.“ als Meta 14/1,4 in Silbergrau; „Zeichnungen, alle Maße … übernimmt.“ steht als `.ez-ab-hilfe` darunter. Wortlaut jeweils unverändert. Erprobt bei 390: Karte 260 → 148 px bzw. 268 → 179 px. | Mittel bis hoch: Der Blick geht vom Titel direkt zur Pille. |
| 10 | **Kassenpreis auf der Bühne 48/200 mit „€“ 15.** Nach G15 ist 48 px eine kleine Zahl: Gewicht 300, Einheit 14, so wie auf „Passt.“ mit 48/300 und „mm“ 14. Das Gewicht 200 gehört zu 64–88 px (Blatt 64/200, Zähler 64/200). | `.ez-ab-betrag b { font-weight: 300 } .ez-ab-betrag small { font-size: .875rem }`. Erprobt: Grundlinie Δ 0, Breite 80 px wie vorher. | Niedrig: eine Zahlenskala über alle Folien. |

**Nicht in der Tabelle (Kleinkram):** „Falls zur Hand“ hat 16/500, die übrigen Kartentitel 17/500. Bei 360 bricht im Ergebnis „Brüstungshöhe und Laibungstiefe, sonst beim | Feinaufmaß“ so, dass das letzte Wort allein steht.

**Dateien:** Ich habe nichts im Projekt geändert. Aufnahmen und Messwerte liegen in `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/typo/shots/`:
- `ist2-*`: Stand von 12:50 Uhr
- `v2-*`, `v3-*`: Erprobung

Die Proben selbst stehen in `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/typo/v2.css` und `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/typo/v1.js`. v1.js ist die Ersetzung der Texte mit geschützten Leerzeichen und dem neuen Datum.

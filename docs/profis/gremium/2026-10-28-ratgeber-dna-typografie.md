# Ratgeber in der DNA, Detail-Profi Typografie (28.10.2026)

Daniel Roth, getrennter Agent, eine Runde, Fassung X. Zehn Befunde nach Wirkung:

1. **Geschützte Leerzeichen fehlen** (Zahl und Einheit trennen sich: „10 / mm“, 7,99 €, 1.230 × 1.410 mm, § 1, DIN 18202, Belegnummer allein am Zeilenanfang). Wie: im Generator für Textknoten im Hauptteil; Prüfungen mit wörtlichem Vergleich angleichen.
2. **Fehlerseite: Abstände 52/56/60 statt 6/12/32** (Raster-`gap` kommt zu den Rändern). Wie: `gap: 0`, Etikett 6, Titel 12, Pillen 32, Bühne am Telefon 48; Unterschrift `text-wrap: pretty`.
3. **Lesetext langer Artikel: Zeilen zu lang (etwa 86 Zeichen), Textgrau über ganze Bildschirme blass, am Telefon zu locker.** Wie: Spalte 34em (etwa 73 Zeichen), Lesetext als tonale Nuance `color-mix(in srgb, var(--textgrau) 70%, var(--schwarz))` (etwa 8,6:1), Zeilenabstand Telefon 1,55, ab 960 px 1,6; Rechtstexte Spalte 580 px.
4. **Witwen und Titelumbrüche** (Listen, Schritte, Unterschriften; Übersichtstitel bricht „Ratgeber: In / sechs Schritten zu / neuen Fenstern“; die zweite Stimme trifft zufällige letzte Wörter). Wie: `text-wrap: pretty` für Listen und Unterschriften, `balance` für Zeilentitel, kurze Wörter nach dem Doppelpunkt binden. Vorschlag: zweite Stimme = Teil nach „: “ bzw. „? “.
5. **Wörter brechen ohne Trennstrich** (`overflow-wrap: break-word` an h1/h2: „Geschäftsbedingungen“ bei 360 px; `anywhere` an Tabellen). Wie: `hyphens: auto; hyphenate-limit-chars: 12 5 5`; Tabellen `break-word`, `anywhere` nur an Links der Quellen.
6. **Abstände nach Hierarchie**: Etikett→Titel 6 (Kicker 12, Abschnitt 12), Titel→Text 12 (h2 14, Kurz gesagt 16, Übersicht 6), Hinweise Gruppe→Gruppe 48 (32); Rechtstexte Etikett 6, h1 12, Punkt über § 6.
7. **Tabellenziffern fehlen** (Outfit hat proportionale Ziffern; 1.236/1.233/1.230 ungleich breit; Countdown springt). Wie: `font-variant-numeric: tabular-nums` an Tabellen, Countdown, Stationen, Quellen, Schrittziffern; „es zählt“ in Tinte 500.
8. **Zu viele Größen**: Zwischentitel 28/38 gegen Ende 30/40 (2 px wirken wie Versehen) → beide 28/38; Hinweis- und Antworttext 16 → 17 (16 nur „Kurz gesagt“ am Telefon); Rechtstexte auf die Skala (Titel 36/56, Abschnitt 22, Etikett 12/13, Text 17).
9. **Ein schweres Element (G15)**: Schrittziffern als schwarze Scheiben → Ringe; „Du bist hier“ weiß gefüllt → Indigo; Übersicht: Zahl ist der Held, Titel 500.
10. **Hinweistext über dem Leuchten** (Silbergrau auf violettem bzw. korallfarbenem Leuchten etwa 3:1 am Zeilenende). Wie: Leuchten kleiner oder Etikett allein in der ersten Zeile oder Text weiß.

Was stimmt: deutsche Anführungszeichen, Etiketten 12/400/.03em ohne Versalien, Titel 600 mit −.035em, Text→Handlung 32 px, Tabellen am Telefon als Blöcke.

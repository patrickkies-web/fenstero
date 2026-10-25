# Profis · Startseite (Ansicht Hauseigentümer) · 25.10.2026

Umfang: Groß (ganze Seite): Gremium, Umbau, Abnahme. Drei Agenten je Runde, blind (X = heute, Y = neu). Vorschau als Artefakt „Startseite neu gedacht“, nicht online.

## Auftrag

- Bereich: Startseite https://eeziframes.com, Ansicht Hauseigentümer (`SCREENS.landing` in web/assets/portal.js).
- Wunsch des Inhabers: Startseite nach `ultimativ-webdesign` und `profis` überarbeiten; nur als Beispielseite zeigen, Entscheidung am nächsten Morgen.
- Der Besucher soll: in drei Sekunden verstehen, was es ist, dass Messen kostenlos ist und was das Blatt kostet, und „Jetzt ausmessen“ oder „Führung starten“ antippen; Fensterbauer finden ihren Weg.
- Erfolg: Kunden tippen, Fensterbauer trauen der Firma den Konfigurator zu.

## Ist und Neu

- X (heute): Bildschirmfotos scratchpad `start/tel-*.png`, `start/desk-alle.png`.
- Y (Runde 1): `start/preview/` Stand 23:23 Uhr; Y2 (Umbau): `start/preview/tel-0…6.png`, `desk-0…5.png`, `tel-hoch.png`, Montagen `tel-alle.png`, `desk-alle.png`, Schieltest `schiel.png`.
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

## Abnahme (Runde 3, Fassung Y2)

(wird nach der Abnahme ergänzt)

## Antwort des Inhabers

Noch keine.

## Realitäts-Check

Steht aus. Fragekarte: zwei bis drei echte Menschen (ideal über 65, ohne Technikgewohnheit, ein Fensterbauer), fünf Minuten, keine Hilfe: „Was würdest du jetzt tun?“ (wörtlich notieren), „Was kostet das?“, „Wie sicher bist du, dass du das hinbekommst, 1 bis 5?“

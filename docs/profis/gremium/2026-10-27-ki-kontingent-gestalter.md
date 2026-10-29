# Gremium Gestalter: Karte „KI-Auswertungen“ im Kundenbereich und in der Zentrale (27.10.2026, eine Runde)

Simuliert, getrennter Agent, nur Urteil. Bewertet wurde der Stand vor dem Umbau; umgesetzt siehe [2026-10-27-bestellung.md](../2026-10-27-bestellung.md), Abschnitt „KI-Kontingent“.

**Jonas Veit, Art Director.** Blicke: „65“, das Leuchten rechts, die Stäbchenreihe. Bei 65 % sitzt der Held: Zahl groß und dünn, Einheit klein, Reihe ruhig. Das Leuchten schwebt aber im leeren rechten Feld über dem schraffierten Rest, statt die Zahl zu tragen. Bei 130 % liest sich die Zahl wie ein Fehler. Hand 3. MUSS: Leuchten hinter die Zahl (etwa `at 22% 30%`), weg von der Reihe. Veto nein.

**Lena Hartwig, UX und Barrierefreiheit.** Blicke: „65 %“, „13 von 20 genutzt“, der Ring. In drei Sekunden verstehe ich „zwei Drittel weg“, aber nicht, wovon: Dass eine Auswertung ein Foto ist, steht nirgends. „26 von 20“ kann es nicht geben. Der Strich der Schraffur hat unter 2:1 zum Grund, nötig 3:1. Der Korallring am Monatschip zeigt den Zustand nur über die Farbe. Hand 3. MUSS: Unterzeile nennt die Einheit und geht nie über 20: „13 von 20 Fotos ausgewertet“, freigeschaltet „20 von 20 Fotos · 6 weitere“. Veto nein.

**Noah Brandner, Motion.** Blicke: Leuchten, Reihe, Blatt. Das ist ein Kontostand: Die Zahl zählt nicht hoch, die Schraffur wandert nicht, das Leuchten pulsiert nicht. Bewegung nur als Bestätigung einer Handlung. Hand 4. MUSS: Nach „Freischalten“ wächst die Korallreihe einmal auf (240 ms ease-out, Stäbchen je 12 ms versetzt); bei reduzierter Bewegung nur einblenden. Veto nein.

**Tobias Lenz, Frontend.** Blicke: hohe Stäbchen am Telefon, Punkte in Reihe 2, breite Bohnen am Schreibtisch. Die Form hängt an der Breite (Telefon 12 × 22 px, Schreibtisch 28 × 22 px). Reihe 2 wird am Telefon zu Kreisen von 11 px; schraffiert sehen sie aus wie ein Verbotszeichen. Ringe 44 px, gut. Hand 3. MUSS: Stäbchen fest 12 × 22 px, Reihe 2 als Kapseln 12 × 6 px, Abstand füllt die Breite, höchstens 440 px; `role="meter"` mit `aria-valuetext`, Stäbchen `aria-hidden`. Veto nein.

**Mara Keller, Conversion.** Blicke: „65“, der Ring „freischalten“, der Absatz im Blatt. „+6 weitere · bisher 0,48 € netto, höchstens 1,60 €“ ist vorbildlich. Vorher fehlt der Preis: Auf der Karte steht er gar nicht, im Blatt mitten im Absatz. Wer freischaltet, entscheidet über Geld. Hand 3. MUSS: Im Blatt oben „0,08 €“ als Zahl (300, 48 px, Einheit 14 px), darunter „je weiteres Foto, netto · höchstens 1,60 € im Monat“; dieselbe Zeile klein unter den Ring auf der Karte. Veto nein.

**Daniel Roth, Typografie und Ehrlichkeit.** Blicke: „Freischalten?“, der Absatz, „6, 0,48 €“ in der Zentrale. Das Blatt sagt nicht, ob die Freischaltung nur im Oktober gilt oder weiterläuft. „jederzeit hier“ zeigt auf nichts. In der Zentrale liest sich „6, 0,48 €“ wie eine Zahl, „bis 40 im Monat“ scheint „20 weitere“ zu widersprechen. Hand **Faust**. MUSS: „Gilt ab sofort, auch in den nächsten Monaten, bis Sie es auf dieser Karte beenden.“ **Veto ja:** Der Betrieb stimmt Kosten zu, ohne dass eine Dauer genannt ist.

## Sprecher

Median der Hand 3 (Faust, 3, 3, 3, 3, 4). Vetos: eins (Daniel), fällt mit Punkt 1.

MUSS nach Wirkung:
1. Blatt: Dauer nennen (Daniels Satz), „hier“ → „auf dieser Karte“.
2. Blatt und Karte: „0,08 €“ als Held im Blatt, Preiszeile unter dem Ring.
3. Stäbchen fest 12 × 22 px, Reihe 2 als Kapseln 12 × 6 px statt ⊘-Punkten, höchstens 440 px.
4. „13 von 20 Fotos ausgewertet“, freigeschaltet „20 von 20 Fotos · 6 weitere“.
5. Leuchten hinter die Zahl, Strich der Schraffur mindestens 3:1.

Außerdem: Korallreihe einmal aufwachsen lassen (Noah); Zentrale „6 · 0,48 € netto“ statt „6, 0,48 € netto“ und „20 + 20 weitere“ statt „bis 40 im Monat“ (Daniel).

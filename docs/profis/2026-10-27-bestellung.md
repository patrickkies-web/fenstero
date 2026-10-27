# Bestellung, Kundenbereich und Zentrale: Gremium und Preise (27.10.2026)

## Auftrag

- **Bereich:** Bestellung `/bestellen/`, Kundenbereich `/konto/`, Zentrale `/zentrale/`, neu gebaut in der Design-DNA ohne das alte Kundenkonto.
- **Wunsch des Inhabers:** je Paket ein eigenes Bestellformular, alles online und automatisch, Kundenbereich je Betrieb, Zentrale mit allen Bestellungen; danach die neuen Preise mit KI-Kontingent und Preis je weiterer Auswertung.
- **Was der Nutzer tun soll:** Paket wählen, Angaben machen, kostenpflichtig bestellen; später Vorschau ansehen und freigeben.
- **Erfolg:** Der Fensterbauer versteht Paket, Preis (netto und heute brutto) und Bindung, bevor er zahlt; der Inhaber hat alles für die Landingpage an einer Stelle.

## Bilder

Telefon (390 px) und Schreibtisch (1280 px) unter `docs/profis/bilder/2026-10-27-bestellung/`, aufgenommen mit den Attrappen (`KI_ATTRAPPE`, `DATEN_ATTRAPPE`, `ZAHLUNG_ATTRAPPE`, `MAIL_ATTRAPPE`) nach dem Umbau: Paket, Konto mit Code, Betrieb (auch mit Fehlern), Adresse (Domain und Name unter eeziframes.com), Auftritt, Bestellen (ganz und mit fehlenden Häkchen), Kundenbereich (bezahlt, Vorschau, Freigabe, live), Zentrale (Eingang, Auftrag).

## Gremium (eine Runde, getrennte Agenten, nur Urteil)

| Gruppe | Hand je Person | Median | Vetos |
| --- | --- | --- | --- |
| Gestalter (G) | Veit 3 · Hartwig 2 · Brandner 4 · Lenz 3 · Keller 2 · Roth 2 | 2,5 | keine |
| Kunden (K) | Vogel 2 · Demir 3 · Kraus 2 · Berger 2 · Pohl 2 · Hofmann Faust | 2 | Hofmann: Paket vorgewählt, ohne dass man es sieht · Berger: Nettopreise ohne Hinweis |
| Fensterbauer (F) | Median „kaufen“ 2,5, Hand 2,5 | 2,5 | Lindqvist (Faust): „Vorläufige Preise“ neben „Kostenpflichtig bestellen“ |

Verständnis (K): 4 von 6 wissen, was es ist; 5 von 6 lesen den Preis richtig ab, keiner merkt vor dem Kundenbereich, dass er netto ist; 3 von 6 wissen, was zu tun ist (Widerspruch „Weiter mit Essential Plus“ bei sichtbarer, nicht gewählter Essential-Karte).

Gut angekommen: „Monatsabo erst ab Livegang, ohne Mindestlaufzeit“, das Freigabe-Fenster, „Alles lässt sich später ändern“, die zweite Stimme in den Überschriften, die Vorschau der eigenen Seite, die beim Ausfüllen wächst.

## Änderungstabelle (Muss-Punkte und Vetos, umgesetzt)

| Änderung | Zweck | Urteil | Stand |
| --- | --- | --- | --- |
| Paketwahl: Umschalter Essential, Plus, Signature mit Monatspreis unter der Frage; am Telefon nur die gewählte Karte; Pille „Weiter mit Essential Plus · 69 €“ | Verständnis, Vertrauen | Veto K (Hofmann), Muss G, K | geändert |
| „Vorläufige Preise“ weg (Preise des Inhabers); „netto“ an jedem Preis; auf „Bestellen“ „Heute bei Stripe: … inkl. 19 % USt.“ und der Monat netto und brutto | Vertrauen | Veto F (Lindqvist), Veto K (Berger), Muss G | geändert |
| Zustimmung direkt unter der Preiskachel, je Haken ein Satz Alltagsdeutsch; Zeile über der Pille zählt fehlende Häkchen, Koralle nur dann; „kostenlos stornieren, bis wir beginnen“ in der Preiskachel; Stripe in einem Halbsatz | Verständnis | Muss G, K | geändert |
| „So geht es weiter“ und „Ihre Angaben“ unter der Pille (eigener Rasterbereich) | Blickführung | Muss G | geändert |
| Meldungen im Fuß über der Pille (aria-live), weg mit der Station oder nach 4 s; nie über Knopf oder Feld | Blickführung | Muss G, K, F | geändert |
| Platzhalter beginnen mit „z. B.“ (Code-Feld ausgenommen); „wie auf Ihren Rechnungen“ statt „wie im Handelsregister“; Fehler springen zum ersten Feld (war schon so) | Verständnis | Muss G, K | geändert |
| Weg „Schnell“: Bundesland, Rechtsform und Vertretung freiwillig („klären wir im Telefonat“), Browser und Server mit derselben Regel | Aufwand | Muss F | geändert |
| Hinweis auf eeziframes in jeder Paketkarte offen; Domain „bis 25 € netto im Jahr inklusive“ in der Karte und der Zusammenfassung | Vertrauen | Muss F | geändert |
| Muster-Aufmaßblatt und „So misst Ihr Kunde“ auf der Station Paket (Kundenmaß, Feinaufmaß folgt) | Vertrauen | Muss F | neu |
| Kundenbereich, Vorschau: Pille „Vorschau öffnen“, „Freigeben“ und „Änderungen wünschen“ als Ringe; vor der Freigabe Hinweis auf fehlendes Logo, Fotos, Porträt („Trotzdem freigeben“) | Verständnis | Muss F, K | geändert |
| Live-Vorschau ohne schraffierte Kachel; Beispiel-Einladung als „Beispiel“ gekennzeichnet (Familie Muster verwirrte) | Ehrlichkeit | Muss G, F | geändert |
| Kundenbereich „Zahlung“: „… inkl. USt. (… netto), bezahlt am …“; Verlauf und Zentrale mit deutschem Datum | Vertrauen | Muss G | geändert |
| Entfernen-Knopf auf Fotos: Trefferfläche war 44 px, sichtbarer Kreis jetzt 32 px | Bedienung | Muss G | geändert |
| Zentrale, schwarze Bühne: Ursache war ein Foto mit Transparenz, das beim Umwandeln in JPEG schwarz wurde; Fotos werden jetzt auf Weiß gelegt | Technik | Muss G | behoben |
| Fachwort „Bühne und fünf Kacheln“ → „ein großes Bild oben, fünf kleinere darunter“ | Verständnis | Befund K | geändert |

## Neue Preise (Inhaber, 27.10.2026)

| Paket | Einrichtung | Monat | KI-Auswertungen im Monat inklusive | jede weitere |
| --- | --- | --- | --- | --- |
| Essential | 99 € | 39 € | 1.000 | 0,08 € |
| Essential Plus | 50 € | 69 € | 1.500 | 0,08 € |
| Signature | 239 € | 99 € | 2.000 | 0,08 € |

Alle netto. Eine KI-Auswertung ist ein Foto; „20 Kundenanfragen bzw. 1.000 KI-Anfragen“ ist als Rechengröße umgesetzt (1.000 Auswertungen reichen für etwa 20 Anfragen mit je 25 Fenstern), nicht als Grenze für Anfragen. Kalkulation des Preises je weiterer Auswertung nur intern in [docs/KI-KOSTEN.md](../KI-KOSTEN.md); öffentlich stehen Kontingent, Preis und der Schutz vor Missbrauch (Verkaufsseite mit Karten, Vergleich und Frage „Was ist eine KI-Auswertung …?“, Bestellung, Kundenbereich, Bestellbestätigung, Paketbedingungen § 2 Abs. 2, § 4 Abs. 1 und 4, § 7 Abs. 3, llms.txt). Beispielrechnung der Verkaufsseite auf zwei gesparte Stunden umgestellt (65,14 € lagen unter 69 €).

## Farben (fünf Telefon-Bildschirme, `werkzeuge/farben.py`)

| Bildschirm | Neutral (S · A · G · W) | Violett | Koralle | Indigo | Foto |
| --- | --- | --- | --- | --- | --- |
| Paket | 40 · 27 · 7 · 20 | 2,5 | 0,1 | 0,3 | 3,1 |
| Betrieb | 40 · 9 · 5 · 45 | 1,3 | 0,0 | 0,1 | 0,0 |
| Bestellen | 40 · 21 · 4 · 27 | 0,1 | 0,0 | 5,5 | 1,2 |
| Kundenbereich, Vorschau | 44 · 20 · 4 · 29 | 0,0 | 0,0 | 2,7 | 1,5 |
| Zentrale, Auftrag | 37 · 10 · 5 · 47 | 0,0 | 1,0 | 0,0 | 0,0 |
| **Mittel** | **40 · 17 · 5 · 34** | **0,8** | **0,2** | **1,7** | 1,2 |

Ziel der DNA: 42 · 16 · 9 · 26, Violett 3,5, Koralle 2, Indigo 1,5. Weiß liegt über dem Ziel (Formulare sind weiße Karten), Violett und Koralle darunter; nicht nachgebessert, weil Formulare Lesbarkeit vor Farbe brauchen. Entscheidung beim Inhaber.

## Kann-Liste (nicht umgesetzt)

- E-Mails vor dem @ umbrechen; Farbe in der Zusammenfassung mit Hex-Wert.
- „Abbrechen“ im Freigabe-Blatt ohne Indigo-Fläche, damit nur eine Pille gefüllt wirkt.
- Zentrale: die Zahl „zu tun“ steht dreimal; Filter und Stand gleich benennen.
- Stationen-Band: Hof gleitet zum nächsten Punkt (250 ms).
- Satz „zur Hälfte in Ihren Farben“ mit Verweis auf Signature verbinden.
- Schrittzahl wechselt je Paket (6 bzw. 5), „Signature · A-2026-0004“ ohne Erklärung.
- Einbau-Code für die eigene Website zusätzlich „an den Website-Betreuer schicken“.

## Offen (braucht den Inhaber oder den nächsten Schritt)

- Instanz beim Live-Schalten aus dem Auftrag anlegen; danach die Abrechnung der weiteren KI-Auswertungen als Posten auf der Monatsrechnung.
- Wildcard für Essential unter `<name>.eeziframes.com`.
- Alte Zentrale-Funktionen ohne Oberfläche (Statistik, Anzeigen, Betriebe, 2FA per QR), alte Tabellen.
- Anwaltliche Prüfung der Paketbedingungen (sechs Platzhalter).
- Essential: Das volle KI-Kontingent kostet mehr als der Monatsbeitrag (KI-KOSTEN.md).

## Realitäts-Check (Fragekarte)

Zwei bis drei echte Menschen, davon ein Fensterbauer, fünf Minuten, ohne Hilfe, am Telefon auf `/bestellen/#plus`:
1. „Was würdest du jetzt tun?“ (wörtlich notieren)
2. „Was zahlst du heute, was jeden Monat?“
3. „Was passiert, wenn deine Kunden sehr viele Fotos auswerten lassen?“
4. „Wie sicher bist du, dass du das richtig bestellst, 1 bis 5?“

Alle Stimmen oben sind simuliert (Gremium), keine echten.

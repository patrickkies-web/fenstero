# Feinschliff Typografie (Daniel Roth): Seite für Fensterbauer

**Gesamteindruck:** Die Seite spricht in der Hand der Startseite (Skala der Titel, Gewichte der Zahlen, Luft in den Kopfzeilen, Wortmarke in Inter 18/900+500 neben Outfit, Kicker 01–06 als Labels 12/400/.03em, Zeilenlängen 36ch/44ch/60ch stimmen fast überall), aber in den Paketkarten und im Kleingedruckten redet der Text weiter, wo die Typografie knapp sein müsste, und die Schreibweise der Preise ist auf der Seite selbst uneinheitlich.

## 1. Haken-Listen in den Paketkarten · Wirkung hoch
Signature-Haken 1 fasst zwei Merkmale mit Semikolon (vier Zeilen am Telefon) → zwei Haken. Essential-Haken 1 bricht die Domain am Bindestrich → „Unter Ihrer eigenen Domain“ (die Beispieldomain steht in der Mini-Browserzeile); Domains und Zitate im Fließtext mit `nowrap`. Plus-Haken 1 wiederholt wörtlich den Satz darüber → „Ihr Logo und Ihre Firmenfarbe“, „Bis zu 6 Fotos Ihres Betriebs“, „Eigene Startseite, in Suchmaschinen sichtbar“; Satz → „Ihr Konfigurator in Ihrem Design, mit eigener Startseite.“ Essential-Haken 2 → „Planung mit 3-D-Modell und KI-Fotoauswertung“ + „Klärungsliste und Zeichnung je Anfrage“. Der Branding-Hinweis („Powered by EEZIframes“, „kleiner Hinweis im Fuß“) ist kein Vorteil → letzte Zeile ohne Haken in tinte-2; bei Signature bleibt „Ohne Hinweis …“ ein Haken. Ziel: ein Merkmal je Haken, eine Zeile am Schreibtisch.

## 2. Wortlaut und Ehrlichkeit · Wirkung hoch
| Wo | vorher → nachher | Warum |
| --- | --- | --- |
| Hero-Lead | „Ihr Angebot ohne Vor-Ort-Termin“ → „Ihr erstes Angebot ohne Vor-Ort-Termin“ | Schritt 4 und FAQ sagen „erstes Angebot“, das Feinaufmaß folgt. |
| FAQ | „misst seine Fenster perfekt“ → „misst seine Fenster selbst“ | genau, nicht perfekt. |
| Tabelle | „Fotos Ihres Betriebs: 6“ → „bis zu 6“ | wie die Karte. |
| FAQ 1 | „Im Paket Essential … ab Signature gar keiner“ → „In Essential und Essential Plus steht unten ein kleiner Hinweis auf eeziframes, bei Signature keiner.“ | Plus fehlte. |
| FAQ | „Plus in Ihrem Design“ → „Essential Plus in Ihrem Design“ | ein Paketname. |
| Kicker | „05 · Ihre Anfrage“ → „05 · Ihr Paket“ | „Anfrage“ heißt auf der Seite die Kundenanfrage. |
| Knopf | „Frage senden“ → „Anfrage senden“ | passt zu „Paket anfragen“. |

## 3. Geschützte Leerzeichen und Schreibweise · Wirkung mittel
Zwei Formen vor „€“ (U+202F und &nbsp;) → eine: `&nbsp;` wie auf der Startseite; „vorab&nbsp;·&nbsp;netto“; „U<sub>w</sub>-Zielwert“. Richtig: z. B., § 14, 1.409 mm, 1.229 × 1.424 mm, 3-D-Modell, Anführungszeichen, Kicker.

## 4. Paketkarte: Skala und Luft · Wirkung mittel
Name 13/500 kleiner als der Satz 15/400 → Name 16/500 in tinte (eigene Regel), Einrichtung 14 wie die Haken; Pille 32 unter der Liste; Formular 32 vor dem Senden-Knopf; Kundenschutz 48 Abstand (Gruppe→Gruppe).

## 5. Zahlen-, Titel- und Gewichtsskala · Wirkung mittel
Zahlen in sechs Größen → `.ez-fakt__zahl` 48/300 mit Einheit 14 (wie dna-zahl--klein), Anfrage-Zahl am Telefon 48; `.ez-naehe .dna-titel-s` 28 streichen; Zeilentitel in zwei Größen (18/500: Vergleich, Livegang, Summary; 16/500: Danach, Glaskarte, Anfrage-Name; Ratgeber 22 bleibt); Kachel 65,14 €: fett nur eine Zeile („Eine gesparte Fahrt im Monat zahlt Essential Plus.“), die Rechnung in die graue Zeile.

## 6. Rechtstext unter den Paketen · Wirkung mittel
14 px über 72ch, neun Zeilen am Telefon, „Bestellung wird in Kürze freigeschaltet“ viermal auf der Seite → 60ch, ohne Wiederholungen: „Alle Preise netto zzgl. MwSt., Angebot nur für Unternehmer im Sinne von § 14 BGB. Beim Bestellen wird Ihr Preis für den Vertrag festgeschrieben. Keine Mindestlaufzeit, monatlich kündbar; bis zum Beginn der Einrichtung stornierbar, die Einrichtung erstatten wir dann vollständig. Keine Gebühr für Anfragen Ihrer eigenen Kunden. Die Vorschau zeigt einen erfundenen Betrieb. Paketbedingungen“. Hinweis: „…, fest für Ihren Vertrag. Bestellen bald möglich.“

## 7. Die zweite Stimme in den Überschriften · Wirkung mittel
„Paket anfragen. <em>Unverbindlich.</em>“ (Entlastung als Pointe); „Warum Kunden <em>selbst planen.</em>“; „Ein Knopf auf Ihrer Website. <em>Der Rest unter Ihrem Namen.</em>“ (elf Wörter waren zu lang). Hero-Wortlaut bleibt (Inhaber).

## 8. Quellen im Fuß · Wirkung mittel
Fünf gelistet, drei im Text belegt (§ 632, ZDH, Preisatlas); KOFA und Bitkom kommen nicht vor → auf drei kürzen.

## 9. Vergleichstabelle am Telefon · Wirkung mittel
Drei Spalten à 106 px: Werte kürzen („eeziframes-Design“ / „Ihr Design“; „Powered by“ / „im Fuß“ / „keiner“; „30 Tage“ / „Vertragsdauer“), `td::before` 12 px, „ja“ in tinte, Ziffern tabellarisch.

## 10. Kleinstgrößen und Kontrast · Wirkung klein
11 px (Glaskarten-Label, Tabellenbeschriftung) → 12 px; `opacity` auf Textgrau („freiwillig“ 3,6:1) und auf Quellen weg; „Firma (freiwillig)“.

**Die drei Befunde, die am meisten bringen:** 1. Haken-Listen (ein Merkmal je Haken, Branding ohne Haken). 2. Wortlaut („erstes Angebot“, „05 · Ihr Paket“, „Anfrage senden“). 3. Rechtstext 60ch ohne Wiederholungen, eine Schreibweise für „29 €“.

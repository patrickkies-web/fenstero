# Interne Struktur für die Auffindbarkeit, 30.10.2026

## Auftrag

Der Inhaber: prüfen, welche internen Strukturverbesserungen für die Auffindbarkeit wichtig sind, dann „Verbessern!“.

## Befund (Linkgraph der ausgelieferten Seiten, Stand main nach #56)

| Punkt | Befund | Gewicht |
| --- | --- | --- |
| Kontextlinks | Keine ältere Seite verlinkte im Lesetext auf eine der acht neuen; diese hingen an Fußzeile, Übersicht und untereinander (1 bis 3 Quellseiten) | hoch |
| Förderthemen | „Förderung 2026“ im Titel von drei Seiten (Uw-Wert, Fenster austauschen, Förderung 2026), dieselbe Frage auf zwei Seiten | hoch |
| Schritte | „Entscheiden“ 9 Seiten, „Auswählen“ und „Ausmessen“ je 8; Weg und „Nächster Schritt“ zeigten nur auf die erste Seite eines Schritts | hoch |
| Startseite ohne JavaScript | Textfassung verlinkte 6 Ratgeber, alle zum Messen | mittel |
| Sitemap | 43 von 51 Adressen mit demselben Datum (Gestaltungsläufe hoben den Stand mit an) | mittel |
| Autor | nur die Organisation, keine Seite, die erklärt, wie geprüft wird | mittel |
| Vorschaubild | alle Ratgeber mit demselben /og.png | klein |
| Fragen beim Messen | „Wie viel kleiner als die Maueröffnung?“ auf drei Seiten | klein |

## Umsetzung

| Wo | Was |
| --- | --- |
| 12 ältere Ratgeber | 23 Kontextlinks auf die neuen Seiten an der Stelle, wo das Thema anklingt (Fenster austauschen, Uw-Wert, Altbau, Brüstungshöhe, Standardmaße, Öffnungsarten, Alter, Reparieren, Lüftungskonzept, Angebote, Dreifachverglasung, Ausmessen) |
| Förderung | Hauptseite ist Fenster-Förderung 2026; Titel von „Fenster austauschen“ (Kosten pro Fenster, Ablauf, Dauer) und „Uw-Wert“ (Grenzwerte) ohne „Förderung“, Zwischentitel als eigene Frage, Verweis auf Förderung 2026, Antrag und Steuerbonus; Ankertext „Uw-Wert“ statt „Uw-Wert und Förderung“; Förderseiten verweisen im Einstieg auf Förderung 2026 |
| Fragen | „Wie viele Angebote“ auf Fenster austauschen und „Wie viel Zuschuss“ auf Förderung beantragen entfernt (stehen auf Angebote vergleichen und Förderung 2026), die Fugenfrage auf Standardmaße entfernt und auf Fenster ausmessen zu „Ziehe ich beim Messen die Fuge ab?“ |
| Bauskript | „Mehr in Schritt N“ unter „Nächster Schritt“ auf allen Seiten im Weg; og:image je Seite; `author` mit `url` /redaktion/; „Redaktion und Prüfung“ in der Fußzeile |
| Vorschaubilder | 41 Bilder unter web/bilder/og/ (scripts/og-bilder.mjs), Prüfsuite angepasst |
| Redaktion | neue Seite /redaktion/ (AboutPage), in Sitemap und llms.txt |
| Startseite | Textfassung mit „Haus gekauft oder geerbt“ und „Fenster-Förderung 2026“ |
| Stand | 30.10.2026 nur auf den 14 Ratgebern mit inhaltlicher Änderung, auf der Startseite und der Redaktion; Regel in docs/SEO.md |

## Offen (Inhaber)

- Soll die Seite Redaktion sagen, dass die Texte mit Unterstützung von KI-Werkzeugen entstehen?
- Wird die Vermittlung eingeschaltet, muss der Abschnitt „Wie eeziframes Geld verdient“ auf /redaktion/ ergänzt werden.

## Geprüft

Prüfsuite Abschnitt 10 grün (295 Prüfungen); der neue Block am Telefon (390 px) und am Schreibtisch (1280 px) angesehen; zwei
Vorschaubilder angesehen.

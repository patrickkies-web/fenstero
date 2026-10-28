# Prüfung: Konfigurator eines Kunden je Paket (28.10.2026)

Auftrag des Inhabers: „Wenn ich für Kunden so den Konfigurator und alles eingestellt hab … funktionieren bei ihm alle Funktionen?
Check sie mal für jedes Paket und ob die Ansichten dem neuen Design entsprechen.“

Geprüft lokal mit nachgestellter Datenbank, Kasse und Post:
`KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 MAIL_ATTRAPPE=1 QUEUE_ATTRAPPE=1 node scripts/dev-server.mjs`.
Die Instanzen essential, plus und signature kamen aus `/__saat`. Plus und Signature bekamen eine eigene Startansicht (Kicker,
Überschrift, Text), Signature einen Dashboard-Zugang. Jede Ansicht wurde am Telefon (390 px) und am Laptop (1440 px) fotografiert.
Dazu kommt die Prüfsuite von heute: Die Abschnitte 23 bis 29 (Instanzen, Dashboard, Einladungen, Bestellung, Zentrale, Verkaufsseite)
waren grün.

## Funktionen

| Funktion | Essential | Plus | Signature | Befund |
| --- | --- | --- | --- | --- |
| Startseite, „Erstes Fenster ausmessen“ | ✓ | ✓ | ✓ | |
| Konfigurator (Folien), Liste, Kontakt, Senden mit Nummer | ✓ | ✓ | ✓ | P-2026-001 usw., ohne Fehler in der Konsole |
| Bestätigung, Durchschrift als PDF, Seite nach dem Senden | ✓ | ✓ | ✓ | |
| Mail an den Betrieb mit Aufmaßblatt als PDF | ✓ | ✓ | ✓ | Essential mit Link „Anfrage ansehen (14 Tage)“ und Kennzeichnung, Signature mit „Im Dashboard öffnen“ und ohne eeziframes |
| Kennzeichnung | „Powered by EEZIframes“ | dezent | keine | wie in pakete.js |
| Eigene Startansicht (Titel, Text) | – | ✓ | ✓ | |
| Firmenfarbe | – | ✓ | ✓ | nur als Akzent (farbiges Wort, Zeichen) |
| Dashboard `/betrieb/` mit Anmeldecode | – | – | ✓ | Anfragen kommen an, Stand „Eingereicht“ |
| Einladungslinks (Projekt anlegen, Link, WhatsApp/SMS/E-Mail, Laufzeit) | – | – | ✓ | Kunde landet in seiner Einladung, dann im Konfigurator |
| Impressum, Datenschutz der Instanz | ✓ | ✓ | ✓ | |
| In Vorbereitung 503, Pause 503 mit Kontakt, Ende 410 | ✓ | ✓ | ✓ | Zwischenspeicher 60 s |

## Ansichten: neues oder altes Design

| Ansicht | Design | Was alt ist |
| --- | --- | --- |
| Startseite der Instanz (`/`, vor dem ersten Fenster) | **alt** | Waschbären-Bild als Standard, Inter, farbiges Wort, Großbuchstaben-Etikett, Cream-Pille. Die Beispielseiten (Paket-Vorlagen) gibt es auf der Instanz nicht. |
| Einladungsseite (Signature) | **alt** | wie die Startseite |
| Dashboard `/betrieb/` (Signature) | **alt** | Inter, farbiges Wort, grüne Punkte, alte Karten |
| Impressum, Datenschutz | **alt** (schlicht) | Inter, alte Karte |
| Seiten für Pause, Ende, Vorbereitung | **alt** (schlicht) | Inter |
| Folien des Konfigurators, Liste, Kontakt, Bestätigung, Seite nach dem Senden | **neu** | |
| Mail an den Betrieb | neutral | Mail-Layout, kein Teil der DNA |

Bilder:
- docs/profis/bilder/2026-10-28-instanzen-altes-design.jpg (Start Essential, Start Signature, Einladung, Dashboard, Impressum, Pause)
- docs/profis/bilder/2026-10-28-instanzen-neues-design.jpg (erste Folie, Liste, Kontakt, Bestätigung, nach dem Senden, Folie aus der
  Einladung)

## Was fehlt, damit du einen Kunden wirklich einrichten kannst

Aus docs/BESTELLUNG.md („Offen“), bestätigt im Code:

1. **Konfigurator aus dem Auftrag anlegen:** In der neuen Zentrale gibt es keine Karte dafür. Die Funktionen auf dem Server sind da
   (`functions/api/zentrale-instanzen.js`), die Oberfläche kam mit der alten Zentrale weg. Bis dahin lässt sich kein Auftrag live
   schalten.
2. **Essential unter `<name>.eeziframes.com`:** Wildcard-Eintrag und Zuordnung im Worker fehlen.
3. **Landingpage von Plus und Signature:** Unter `/` liefert die Instanz die App mit ihrer Startseite aus. Eine Seite wie die
   Paket-Beispiele (Szenen, Fotos, Ablauf, Kontakt) hat dort keinen Platz.
4. **Paketwechsel nach der Zahlung** ausführen (Differenz, Abo).
5. **KI-Kontingent im Dashboard** von Signature.
6. **Farbwelt im Konfigurator:** Plus und Signature nehmen dort nur die Akzentfarbe.

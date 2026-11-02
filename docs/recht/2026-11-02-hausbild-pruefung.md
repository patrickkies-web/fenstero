# Rechtliche Prüfung „An meinem Haus ansehen“, 2.11.2026

**Simulation, keine Rechtsberatung.** Zwei KI-Agenten in der Rolle von Anwälten haben getrennt gelesen und nichts geändert; ihre
Befunde sind begründete Hinweise für den Anwalt des Inhabers, der sie prüft. Umgesetzt auf dem Zweig `claude/fenster-am-haus`.

- **Dr. Lena Brandes (simuliert)**, IT-Recht und Datenschutz: „So noch nicht startreif. Gestartet werden kann nach den Muss-Punkten 1 bis 4.“
- **Markus Feldhaus (simuliert)**, KI-Recht, Verbraucher-, Wettbewerbs- und Urheberrecht: „So geht es nicht online.“ Drei Muss-Punkte,
  jeder mit wenig Aufwand behebbar.

## Befunde und Umsetzung

| Nr. | Stufe | Befund | Umgesetzt |
| --- | --- | --- | --- |
| B1 | Muss | Pflichtangaben in 5a fehlen: Empfänger mit Firma und Anschrift, Speicherdauer, Training (Art. 13) | Platzhalter „[bitte ergänzen …]“ in 5a und im Einwilligungsblatt; **offen bis zum Vertrag mit Black Forest Labs** |
| B2 | Muss | Tageszähler speicherte die IP-Adresse dauerhaft in der Datenbank | Prüfwert mit Geheimnis statt IP (`hbanschluss:`), Löschung nach 2 Tagen im täglichen Lauf (`functions/api/eingang.js`), Satz in Abschnitt 2 |
| B3 | Muss | Weltweiter Zugang (`HAUSBILD_ZUGANG`) hätte Daten in die USA geschickt | Entfernt: nur EU-Zugang, Abholen nur von `api.eu*.bfl.ai`, Bild nur von `*.bfl.ai`; Satz „keine Ausweichung“ in 5a |
| B4 | Muss | Drittland trotz EU-Rechenzentrum möglich (Vertragspartner, Unterauftragnehmer) | Platzhalter mit beiden Formulierungen in 5a; Frage an Black Forest Labs; Cloudflare als Weg genannt |
| B5 | Soll | Rechtsgrundlage: Einwilligung oder Vertrag (lit. b) | **Entscheidung für den Anwalt.** Umgesetzt ist die Einwilligung (lit. a), wie bei der KI-Auswertung; dafür alle Punkte B7 bis B9 |
| B6 | Soll | Dritte auf dem Foto (Nachbarn, Personen, Kennzeichen) | Absatz mit lit. f in 5a; Einwilligungsblatt zeigt den tatsächlich übermittelten Ausschnitt |
| B7 | Soll | Einwilligungstext unvollständig (KI, Sitz, Frist, „wir speichern nicht“ gilt nur für uns) | Neuer Text, Überschrift „Einwilligung zur KI-Vorschau“, beide Knöpfe gleich gewichtet |
| B8 | Soll | Einwilligung fehlt auf der Cookie-Seite; Nachweis | Eintrag `aufmass.hausbild.einwilligung` auf /cookies/; Server nimmt nur Anfragen mit dem aktuellen Stand des Textes an (`EINW_STAND`) |
| B9 | Soll | Widerruf nur im Editor | Zusätzlich in der Fußleiste der App („Vorschau-Einwilligung widerrufen“); Satz zur Löschung bereits übermittelter Bilder |
| B10 | Kann | Verständlichkeit, Inhaltsverzeichnis, Linkfrist, GPS und IP | 5a im Inhaltsverzeichnis, „Link verfällt nach 10 Minuten“, GPS und IP genannt, „Pixel“ |
| F1 | Muss | KI-Verordnung Art. 50 Abs. 2 (seit 2.8.2026): gespeichertes Bild ungekennzeichnet | Sichtbarer Hinweis „KI-Visualisierung · kein Foto · eeziframes.com“ im Bild, XMP mit IPTC DigitalSourceType, Dateiname `mein-haus-ki-visualisierung.jpg`, Chip „KI-Bild“ |
| F2 | Muss | Einwilligung uninformiert solange Platzhalter, EU-Zusage durch Ausweichweg gebrochen, „KI“ fehlt | Wie B1, B3, B7 |
| F3 | Muss | Irreführung (§ 5, § 5a UWG): „in echt“, „Echte Vorschau“, „So sieht es aus“ | „Sieh dein Fenster an deinem Haus.“, Pille „KI-Vorschau“, Titel „So könnte es aussehen.“, Unterzeile mit möglichen Abweichungen |
| F4 | Muss vor Werbung | Werbung mit KI-Häusern ist ein Deepfake (Art. 50 Abs. 4) | Regel in docs/GESTALTUNG.md: Hinweis im Motiv, keine Kundenbilder ohne eigene Freigabe; **bei jeder Werbung beachten** |
| F5 | Soll | Rechte am hochgeladenen Foto | AGB § 11 Abs. 2 (Fotos nur mit Recht, einfaches Nutzungsrecht für die Berechnung, Freistellung) |
| F6 | Soll | Keine Zusage über das Aussehen | AGB § 2 Abs. 5; Stand der AGB 2.11.2026 (`AGB_STAND`, Kasse, Sitemap) |
| F7 | Soll | Bedingungen von Black Forest Labs (Werbung, C2PA, Endnutzer, Gewähr) | Fragen 7 bis 11 in der Anfrage |
| F8 | Kann | Auftrag an die KI: keine Personen, Texte, Kennzeichen | Ergänzt in `auftrag()` |
| F9 | Kann | Nutzungsbedingungen | Keine Änderung nötig (Funktion nur im eigenen Aufmaß) |

## Offen vor dem Start (Reihenfolge)

1. Anfrage an Black Forest Labs schicken (`docs/recht/2026-11-02-black-forest-labs-anfrage.md`), DPA abschließen.
2. Die Platzhalter füllen: Datenschutzerklärung 5a (Firma und Anschrift, Drittland-Satz, Frist, Training) und Einwilligungsblatt
   (`HB_EINW_TEXT` in `web/assets/hausbild.js`: Sitz, Frist). Ändert sich der Text des Blatts, `HB_EINW_STAND` in hausbild.js und
   `EINW_STAND` in functions/api/hausbild.js gemeinsam hochzählen.
3. Rechtsgrundlage bestätigen (B5: Einwilligung wie umgesetzt oder Vertrag).
4. AGB § 2 Abs. 5 und § 11 Abs. 2 freigeben (neuer Stand 2.11.2026; die Kasse zeigt ihn).
5. Stand 2.11.2026: Der Code ist online, `BFL_API_KEY` steht bei Cloudflare, die Funktion ist aber aus. Die Rechtstexte liegen fertig in
   docs/recht/2026-11-02-hausbild-rechtstexte.md (dort auch die Schritte); nach dem Einsetzen `HAUSBILD_FREI=1` bei Cloudflare.

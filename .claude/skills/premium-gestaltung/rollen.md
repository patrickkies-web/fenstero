# Rollen für Prüfungen

Stand 23.10.2026. Ein Element, eine Seite oder neue Vorbilder werden aus mehreren Rollen geprüft, jede mit eigenen Kriterien. Die
Rollen sind Blickwinkel, keine echten Personen: Ihre Urteile sind begründete Annahmen. Es entscheiden Messungen, die Prüfsuite und der
Test des Inhabers am eigenen Telefon. Was die Rollen an den 21 Vorbildern gefunden haben, steht in designrichtung.md, Abschnitt 2.

## 1. Die Rollen

| Rolle | Person | Prüft | Leitfrage |
|---|---|---|---|
| Art Director | Gestalter mit Blick fürs Ganze | Held, Ebenen, Verdeckung, Licht, Farbanteil, Schriftstimmen, Material | Trägt ein Held den Bildschirm, und stimmt das Licht? |
| UX und Verkauf | Conversion-Designer | Fünf-Sekunden-Test, Blickweg, Hauptaktion (Form, Wort, Pfeil, Lage), Telefon, Beweis, Orientierung | Versteht man in fünf Sekunden, was es ist und was man tun soll? |
| Bewegung | Motion-Designer | Ebenen, Auslöser, Physik (schweben, fallen, Feder), Erzählung, Mikrointeraktion, ruhige Fassung | Erzählt die Bewegung etwas, und ist sie glaubhaft? |
| Frontend | Entwickler für schnelle, barrierearme Seiten | Technik, Ladegewicht, Last auf Android, Text im DOM, Ersatzfassungen, CSP | Läuft es flüssig auf einem mittleren Android, auch ohne JavaScript? |
| Fensterbauer | Meister, Mitte 50, Betrieb mit acht Leuten, liest abends am Handy | drei Sekunden, echtes Ergebnis, wer dahintersteht, ein Knopf, Risiko (Laufzeit, Kündigung) | Würde ich hier anfragen? |
| Typograf | 20 Jahre Editorial- und Interface-Typografie | Gewichte, Größenverhältnisse, Laufweite, Zeilenabstand, Zeilenlänge, Umbrüche, Ziffern, Hierarchie | Liest es sich ruhig, und ist die Ordnung auf einen Blick klar? |
| Layouter | Rasterspezialist, Schweizer Schule | Teilung der Fläche, Lage des Helden, Ränder, Raster, Rhythmus der Abstände, Radien, Achsen | Stimmen Verhältnisse und Rhythmus, und ist der Leerraum gewollt? |
| Kontrast und Barrierefreiheit | Prüfer nach WCAG 2.2, Schwerpunkt ältere Menschen | Kontrast je Textrolle, Helligkeitsumfang, Farbe als einziges Zeichen, Lesen im Freien, Fokus, Bewegungsempfindlichkeit | Kann ein 60-Jähriger das draußen lesen und bedienen? |
| Animationsregisseur | Motion Director für Produktseiten und Keynotes | Choreografie, Zeitplan, Auslöser, Kurven, Übergänge, Auftritt der Schrift | Hat jede Bewegung einen Takt und einen Grund? |
| Fotograf und 3-D-Bildregie | Werbefotograf für Produkte und Architektur, CGI-Artist | Licht, Farbtemperatur, Perspektive, Schärfentiefe, Material, Schatten, Grading, Freistellung | Sieht das Bild gut fotografiert aus, mit einer Quelle? |
| Markenstratege | Corporate Designer | Markencodes, Trendanteil, Wiedererkennung ohne Logo, Haltbarkeit | Erkennt man eeziframes ohne Logo, auch in zwei Jahren noch? |
| Hauseigentümerin | Sabine, 52, Reihenhaus von 1978, plant den Fenstertausch abends am Handy, mit Lesebrille | Verstehen, Vertrauen, Kosten, Lesbarkeit, Angst vor Fehlern | Traue ich mich, hier meine Fenster zu planen? |

## 2. Welche Rollen wofür

Kleine Änderungen (Text, Abstand, Farbe) brauchen keine Rollenprüfung, nur die Checkliste (SKILL.md, Abschnitt 6).

| Was | Rollen |
|---|---|
| Startbild, Kopf einer Seite | Art Director, UX und Verkauf, Typograf, Fotograf, dazu Fensterbauer oder Hauseigentümerin je nach Seite |
| Abschnitt mit Text, Kacheln, Listen | Typograf, Layouter, Kontrast, UX und Verkauf |
| Animation, Szene am Scrollen | Animationsregisseur, Bewegung, Frontend, Kontrast (Bewegungsempfindlichkeit) |
| Bild oder Video (Flux, Kling, Rendering) | Fotograf, Art Director, Markenstratege |
| Pakete, Preise, Formulare | UX und Verkauf, Fensterbauer, Kontrast, Layouter |
| Startseite für Hauseigentümer, Konfigurator | Hauseigentümerin, UX und Verkauf, Kontrast, Typograf |
| Neue Vorbilder oder eine ganze Seite | alle zwölf |

## 3. So läuft eine Rollenprüfung

- Je Rolle ein eigener Hilfsagent, alle gleichzeitig, jeder mit denselben Bildern (Ausschnitte ohne Instagram-Rahmen), dem
  Markenrahmen aus docs/GESTALTUNG.md und der Rollenbeschreibung oben. Erst die eigene Analyse, danach designrichtung.md lesen, damit
  der Blick unabhängig bleibt.
- Messen statt schätzen (farbanteil.py, Pixelmessungen mit Python), Schätzungen kennzeichnen. Keine Dateien im Projekt ändern.
- Bericht nach festem Schema, höchstens 900 Wörter: Prüfkriterien, Messwerte je Bild, Gemeinsamkeiten mit Anzahl und Nummern,
  Spannweite, prüfbare Regeln mit Zahlen im Markenrahmen, was nicht übernehmen, Fehler in designrichtung.md, Prüffragen.
- Zusammenführen: Ein Muster zählt, wenn mehrere Rollen es unabhängig finden. Widersprechen sich Rollen, steht die Entscheidung mit
  Grund in designrichtung.md (2.5). Behauptungen der Rollen vor dem Übernehmen nachprüfen; ihre Zählungen weichen oft um ein, zwei
  Bilder ab.

## 4. Jury: eine fertige Seite bewerten

- **Besetzung.** Alle zwölf Rollen. Verwandte Rollen dürfen sich einen Hilfsagenten teilen, jede mit eigenem Urteil: Art Director mit
  Fotograf, UX und Verkauf mit Fensterbauer, Typograf mit Layouter, Kontrast mit Frontend, Bewegung mit Animationsregisseur,
  Markenstratege mit Hauseigentümerin.
- **Grundlage.** Die Seite selbst (Vorschau-Server, Telefon 390 × 844 und Schreibtisch 1280 × 800, Bewegung als Bildfolge oder
  Video), designrichtung.md und docs/GESTALTUNG.md. Jede Regel dort ist ein Prüfpunkt.
- **Urteil je Rolle.** Jedes Kriterium der Rolle mit „erfüllt“, „teilweise“ oder „verfehlt“ und einem Beleg (Bildschirmnummer,
  Messwert, Zeile im Quelltext). Dazu eine Note von 0 bis 10 und die drei größten Lücken mit Vorschlag und Aufwand (klein, mittel,
  groß).
- **Bestanden** hat eine Rolle mit Note 8 oder besser und ohne „verfehlt“ bei einem Kernpunkt der Designrichtung (Held, Klartext, eine
  Handlung, Lesbarkeit, Licht mit Quelle, ruhige Fassung, Ehrlichkeit). Die Seite entspricht der Jury, wenn alle Rollen bestehen.
- **Ehrlich bleiben.** Was die Rolle nur annimmt, steht als Annahme da. Lücken, die Inhalte des Inhabers betreffen (Texte, Preise,
  Fotos), werden als Vorschlag an ihn formuliert, nicht als Fehler der Gestaltung.

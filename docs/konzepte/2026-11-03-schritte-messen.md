# Wo steigen die Leute aus? Brainstorm zum Messen der Schritte

Stand 3.11.2026, nachts, auf Wunsch des Inhabers. **Umgesetzt am 4.11.2026** (Wunsch des Inhabers): A bis F, also Schritt-Signal, Ausstieg, Herkunft, Dauer-Stufen, Zeichen für Mühe, Szenen und Klicks der Startseite, dazu der Strang Führung und die Karte „Wo steigen sie aus?“ in der Zentrale. Prüfmappe für die Anwälte: docs/recht/2026-11-04-pruefmappe-tracking-funnel.md. Nicht umgesetzt sind G (Varianten), H (Besuchsnummer) und I (Frage beim Gehen). Das hier ist eine Ideensammlung mit
Empfehlung. Rechtliches ist Einschätzung, keine Rechtsberatung.

## 1. Kurz

Die Website zählt heute auf dem Server mit: Seitenaufrufe, Besuche, Herkunft, Anzeigen und Vorgänge, die ohnehin über den Server laufen
(Kasse, Kauf, Senden, Konto, Fotolink). Die App ist aber eine einzige Adresse (`/app/`). Alle Folien wechseln im Browser, und der Server
sieht davon nichts. Deshalb wissen wir nur, wie viele die App öffnen und wie viele am Ende kaufen oder anfragen. Was dazwischen passiert,
bleibt unsichtbar.

Die Lösung: Die App meldet selbst, welche Folie sie zeigt. Das ist ein kleines Signal ohne Cookie und ohne Kennung, gezählt in derselben
eigenen Statistik wie heute. Dann zeigt die Zentrale je Strang einen Trichter: wie viele jede Folie erreicht haben und wo die meisten
aussteigen.

## 2. Die drei Stränge

**W: Website.** Startseite geöffnet → Szene „So läuft es“ erreicht → Szene „Jedes Fenster bis ins Detail“ erreicht → Klick auf „Kostenlos
losplanen“ (oben oder unten) → App geöffnet mit Herkunft Startseite.

**K: Konfigurator.** App geöffnet → erste Folie „Was planst du?“ gesehen → Stelle gewählt → Element gewählt → Form am Modell → Weg zu den
Maßen → Fotos → Messen (Maß 1 bis 4) → Ränder → Ergebnis → Wünsche (Hauptfragen, „x von n“) → Gespeichert → zweites Fenster begonnen →
Aufmaßblatt → Weiche → Weg A (Betriebe, Kontakt, Code, bestätigt) oder Weg B (Kasse, Kauf). Nebenwege: Führung, „An meinem Haus ansehen“
(geöffnet, Foto, Fenster gesetzt, Vorschau gerechnet, Grenze gesehen), Begriffe und Erklärungen geöffnet.

**F: Konfiguratoren der Fensterbauer.** Dieselben Schritte, getrennt je Betrieb. Später zeigt das Signature-Dashboard dem Betrieb seinen
eigenen Trichter. Das ist ein gutes Verkaufsargument: „Hier steigen Ihre Kunden aus.“

## 3. Ideen

| Nr. | Idee | Was man erfährt | Aufwand | Datenschutz |
|---|---|---|---|---|
| A | **Schritt-Signal ohne Kennung:** Beim ersten Zeigen einer Folie schickt die App `sendBeacon('/api/schritt', 'strang=K&schritt=messen-2')`. Was schon gemeldet ist, merkt sie sich nur im Arbeitsspeicher, also nicht im Browser-Speicher. Der Server nimmt nur Namen aus einer festen Liste an und zählt sie als Tageszähler, wie bei den Vorgängen heute. | Wie viele jede Folie erreichen, Absprung von Folie zu Folie | etwa 1 Tag | ohne Cookie, ohne Kennung, ohne Geräteangaben |
| B | **Letzte Folie beim Verlassen:** Wird die Seite geschlossen oder verlassen (`pagehide`), meldet die App die Folie, auf der der Nutzer zuletzt war. | Der direkteste Wert für „wo steigen sie aus“: Ausstiege je Folie | ein paar Stunden, mit A | wie A |
| C | **Herkunft im ersten Signal:** Aus `document.referrer` und den Anzeigen-Parametern wird eine grobe Klasse: Startseite, Ratgeber, Anzeige, Link eines Fensterbauers, direkt. | Der Strang ergibt sich von selbst. Man sieht, ob Anzeigen-Besucher früher aussteigen | klein, mit A | nur die grobe Klasse wird gezählt |
| D | **Verweildauer als Stufe:** Das Signal der nächsten Folie trägt die Zeit auf der vorigen mit, eingeteilt in „unter 30 s“, „30 s bis 2 min“ und „über 2 min“. | Wo die Leute hängen bleiben, ohne einzelne Personen zu verfolgen | klein, mit A | wie A |
| E | **Zeichen für Verwirrung:** gezählt werden Taps auf i und Begriffe, „Weiß ich nicht“, Fehlermeldungen (z. B. unplausibles Maß) und Zurück, jeweils je Folie. | Wo es schwer ist, nicht nur wo jemand aussteigt | etwa 1 Tag | wie A |
| F | **Scrolltiefe der Startseite:** Je Szene ein Signal, sobald sie zur Hälfte im Bild ist. Dazu die Klicks auf „Kostenlos losplanen“ mit ihrer Stelle (Hero oder Fuß). | Strang W von oben bis zum Klick | etwa einen halben Tag | wie A |
| G | **Testvariante im Signal:** Beim Laden wird eine Variante gelost (nur im Arbeitsspeicher) und mitgeschickt. | A/B-Tests (siehe Funnel-Konzept, Abschnitt 5) | klein | mit dem Anwalt klären |
| H | **Besuchsnummer nur für einen Tab:** eine Zufallszahl im Arbeitsspeicher, die mit jedem Signal mitgeht und beim Neuladen weg ist. Rohdaten 7 Tage, danach nur noch Summen. | Echte Pfade: Rückwege, Reihenfolge, Zeit bis zum Kauf | etwa 2 Tage | pseudonym, braucht Abwägung und einen Absatz in der Datenschutzerklärung |
| I | **Eine Frage beim Gehen:** Im Bogen „Verlassen“ oder beim Zurück auf der ersten Folie: „Was hat dir gefehlt?“ mit vier Antworten (mein Fenster ist nicht dabei, zu kompliziert, kein Zollstock da, nur mal geschaut) und Freitext. | Das Warum zum Wo | etwa einen halben Tag | Freitext ohne Namen speichern, nach 90 Tagen löschen |
| J | **Echte Menschen:** fünf Leute im Monat, die meisten über 50, testen am eigenen Handy und laut denkend; Bildschirmaufnahme mit dem Handy. | Wer, warum, in welchen Worten | ein Nachmittag im Monat | Einwilligung auf Papier |
| K | **Fremde Werkzeuge** (Google Analytics, Hotjar, Microsoft Clarity, PostHog Cloud) | Viel, auch Aufnahmen der Sitzungen | klein | **nicht empfohlen:** fremde Server (verstößt gegen die CSP-Regel), Cookie-Banner, Daten in den USA, passt nicht zur Linie „ohne Cookies“ |
| L | **Selbst betriebene Werkzeuge** (Umami, Plausible) | Trichter und Ereignisse fertig eingebaut | eigener Server nötig | ohne Cookies möglich, aber ein zweites System neben der Zentrale |

## 4. So sieht es in der Zentrale aus

Ein neuer Reiter „Trichter“ mit Auswahl von Strang (W, K, F je Betrieb), Zeitraum (Woche, Monat), Gerät (Telefon oder Rechner, grob wie
heute) und Herkunft. Darunter je Schritt eine Zeile mit diesen Spalten: erreicht, Anteil vom vorigen Schritt, Ausstiege hier, Dauer-Stufen
und Zeichen für Verwirrung. Die Zeile mit dem größten Absprung ist markiert. Neben jeder Zahl steht, auf wie vielen Personen sie beruht.
Faustregel: Ab etwa 200 Personen je Schritt ist ein Unterschied von 10 Prozentpunkten belastbar, darunter eher Zufall.

## 5. Recht und Datenschutz

- § 25 TDDDG (Zugriff auf das Endgerät) und DSGVO. Bei A bis F gibt es kein Cookie, keinen Browser-Speicher, keine Geräteangaben und keine
  Kennung. Das Signal enthält nur, was die App über sich selbst weiß (Folie, Strang, grobe Herkunft). Meine Einschätzung: Das braucht keine
  Einwilligung. Der Anwalt sollte das bestätigen, vor allem für G.
- Die Datenschutzerklärung sagt heute im Abschnitt „Eigene Statistik“: „ohne Skript im Browser“. Das muss vor dem Start geändert werden:
  „Die App meldet, welche Folie sie zeigt, ohne Kennung, nur als Tageszähler.“
- Wie heute: Mit „Global Privacy Control“ oder „Do Not Track“ wird nichts gemeldet. Der Inhaber wird in der Zentrale nicht mitgezählt,
  ebenso wenig die Führung und die Testansicht für Fensterbauer (eigener Strang „Probe“).
- H und I sind personenbeziehbar (pseudonym bzw. Freitext). Dafür braucht es eine Abwägung, eine kurze Löschfrist und einen eigenen Absatz.

## 6. Empfehlung

1. **Stufe 1 (etwa 2 bis 3 Tage):** A, B, C und F, dazu der Reiter „Trichter“ in der Zentrale und der Satz in der Datenschutzerklärung.
   Damit ist die Frage „wo steigen die meisten aus?“ für beide Stränge beantwortet.
2. **Stufe 2 (etwa 1 bis 2 Tage), nach zwei Wochen Daten:** D und E für die Folien mit dem größten Absprung, dazu I als eine Frage.
3. **Stufe 3 nur, wenn die Zahlen nicht reichen:** H mit Anwalt; G, sobald es genug Besucher für Tests gibt (siehe Funnel-Konzept).
4. **Immer:** J, fünf echte Menschen im Monat. Die Zahlen zeigen, wo Leute aussteigen, die Menschen sagen, warum.

Technisch hängt alles an einer Stelle: `go()` in `web/assets/app.js` wechselt jede Folie. Dort sitzt ein kleiner Aufruf
`schritt(name)`. Auf dem Server kommt eine Route `functions/api/schritt.js` hinzu, die über die vorhandene Funktion `zaehlen` in
`functions/api/statistik.js` schreibt (Schlüssel `schritt:K|messen-2`, Tag und Stunde) und durch dieselbe Bremse läuft wie die anderen
Routen. Gebaut wird nach deinem Ja; vorher brauche ich nur zwei Antworten: Stufe 1 ja oder nein, und wer die Anwaltsfrage stellt.

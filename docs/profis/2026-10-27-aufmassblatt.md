# Aufmaßblatt mit Systematik und Durchschrift für den Kunden (27.10.2026)

## Auftrag

- **Bereich:** das Aufmaßblatt als PDF (`web/assets/blatt.js`), vor allem das Blatt, das der Fensterbauer bekommt, und die Kopie für den Kunden nach dem Senden aus einem Konfigurator.
- **Wunsch des Inhabers:** „eine strukturierte und für den Fensterbauer erkennbare Systematik der erfassten Elemente sowie eine sehr schöne Übersichtlichkeit und intuitive Bedienung“; dazu eine beispielhafte Aufstellung für die jeweiligen Bereiche, die auf ein beispielhaftes Aufmaßblatt verweist (Mustername, Fensterbau Brandt). Außerdem eine Durchschrift für den Kunden, die „in ihren Daten nicht dazu geeignet ist, das Aufmaßblatt an weitere Fensterbauer zu verschicken“, mit dem Hinweis, dass man den Fensterbauer um die PDF bitten kann.
- **Was der Leser tun soll:** Der Fensterbauer findet in Sekunden, was zu bestellen ist, wo es sitzt und was zu klären ist. Der Kunde hat einen Beleg seiner Planung, aber kein Aufmaß zum Weiterreichen.
- **Erfolg:** Prüfaufgaben des Gremiums F (Raffstores, Balkontür, Kind 1, Strom, Konkurrenzangebot) schneller und richtiger gelöst als mit dem Ist-Blatt; in der Durchschrift kein Maß des Projekts.

Gestaltung nach `design-dna` und `design-dna-eeziframes` (Palette „Task-App dunkel“ auf Papier, Outfit), `emil-design-eng` nicht nötig (keine Bewegung im PDF). Gremium eine Runde, danach nur Muss und Vetos.

## Ist und Neu

| | Ist | Neu |
| --- | --- | --- |
| Blatt des Betriebs, Seite 1 | [bilder/2026-10-27-aufmassblatt-ist-betrieb-01.webp](bilder/2026-10-27-aufmassblatt-ist-betrieb-01.webp) | [bilder/2026-10-27-aufmassblatt-betrieb-01.webp](bilder/2026-10-27-aufmassblatt-betrieb-01.webp) |
| Klärung und Aufstellung | | [-02](bilder/2026-10-27-aufmassblatt-betrieb-02.webp), [-03](bilder/2026-10-27-aufmassblatt-betrieb-03.webp) |
| Positionsseiten | | [EG-02](bilder/2026-10-27-aufmassblatt-betrieb-07.webp), [OG-02](bilder/2026-10-27-aufmassblatt-betrieb-13.webp) |
| Kundenkopie, Seite 1 | [bilder/2026-10-27-aufmassblatt-ist-durchschrift-01.webp](bilder/2026-10-27-aufmassblatt-ist-durchschrift-01.webp) (alle Maße, 17 Seiten) | [bilder/2026-10-27-aufmassblatt-durchschrift-1.webp](bilder/2026-10-27-aufmassblatt-durchschrift-1.webp) (ohne Maße, 8 Seiten) |
| Karten der Durchschrift | | [-5](bilder/2026-10-27-aufmassblatt-durchschrift-5.webp) |

Vorschau zum Durchblättern (privates Artifact): https://claude.ai/artifact/JXnnG8PSZZv2RFpXZhZL92

Vollständige Beispiele mit allen Seiten: [aufmassblatt-vorschau/aufmassblatt-brandt.pdf](aufmassblatt-vorschau/aufmassblatt-brandt.pdf) (18 Seiten) und [aufmassblatt-vorschau/durchschrift-mustermann.pdf](aufmassblatt-vorschau/durchschrift-mustermann.pdf) (8 Seiten), erzeugt mit `node scripts/blatt-beispiel.mjs`. Musterprojekt: Fensterbau Brandt GmbH, Familie Mustermann, Musterweg 12, Köln, 13 Positionen in Keller, Erdgeschoss, 1. Obergeschoss und Dachgeschoss.

## Die Systematik

- **Code je Position** aus Geschoss und Nummer: KG-01, EG-01 … EG-06, OG-01 … OG-04, DG-01, DG-02 (bei mehreren Obergeschossen 1OG-01, 2OG-01). Nach Geschoss sortiert, im Geschoss in der Reihenfolge der Erfassung. Derselbe Code steht in Übersicht, Aufstellung, Klärungsliste, groß auf der Positionsseite, im Maßstab und in den Lesezeichen.
- **Übersicht nach Geschoss:** Geschoss als Band, je Zeile Code, kleine Zeichnung, Raum und Art, Öffnung, Element, Bestellmaß (am „ד ausgerichtet), Ausstattung als Zeichen mit Kürzel (RL, RS, SC, KL, IS, IN), Seite.
- **Aufstellung nach Gewerk:** Fenster und Türen, Sonnenschutz außen (mit Summe je Art), Sicht- und Blendschutz innen, Insektenschutz, Glas, Sicherheit, Strom und Antrieb (vorhanden laut Foto oder klären), Montage; je Zeile Stückzahl und die Codes.
- **Bedienung:** Jede Zeile, jeder Code und jeder Klärungspunkt führt zur Seite der Position; Kopfband der Positionsseite mit „‹ vorige · Übersicht · nächste ›“; Lesezeichen je Geschoss und Position; das PDF öffnet mit ihnen. Die Seitenzahl steht gedruckt in der Übersicht.

## Änderungsliste (dem Gremium vorgelegt)

1. Code nach Geschoss statt laufender Nummer. 2. Kennzahlen und Kapselreihe auf Seite 1. 3. Übersicht nach Geschoss mit Zeichen und Seite. 4. Aufstellung nach Gewerk. 5. Klärungsliste mit Code und Raum. 6. Positionsseite mit Code-Etikett und Weg im Kopfband. 7. Farben und Schrift nach der Design-DNA. 8. Ende mit Maßstab und Codes, Tabelle am Ende entfällt. 9. Kundenkopie als Durchschrift ohne Maße.

## Lösungsschlüssel (Gremium F)

a) 3 Raffstores: EG-01, EG-02 (Vorbaukasten, Smart Home), OG-03 (Unterputzkasten). b) EG-04 Essen, Bestellmaß 880 × 2.175. c) Kind 1: Absturzsicherung, unteres Feld fest, Sicherheitsglas. d) Strom an 7 Positionen, an 5 zu klären. e) Mit der Durchschrift kein Angebot ohne eigenes Aufmaß.

## Urteile (eine Runde, simuliert, getrennte Agenten, blind)

| Gruppe | Ergebnis | Hand (Median) | Vetos |
| --- | --- | --- | --- |
| Gestalter | neu gewinnt 6:0; keine Änderung mit Mehrheit „zurück“ | 4 (alle 54 Hände) | Tobias Lenz gegen die Durchschrift „in dieser Form (Leck-Risiko)“: Maße aus Texten gestrichen statt aus Feldern gebaut |
| Kunden | Durchschrift gewinnt 4:2; Aufgabe „zweites Angebot“ 5 von 6 richtig verstanden | 2,5 bis 4 je Änderung | Renate Vogel (Telefonnummer umbrochen), Thomas Berger („0,,20 m“ im Hinweis zur Bauordnung), Kai Hofmann („Durchschrift“ heißt im Hinweis zweierlei) |
| Fensterbauer | neu gewinnt 6:0; Prüfaufgaben 29 von 30 in etwa 2 Minuten (Ist 25 von 30 in etwa 7 Minuten) | kaufen 4, zeigen 3,5, Hand 4 (Ist 2 / 2 / 2) | Klaus Brandt (Hebe-Schiebe-Tür als Dreh-Kipp gezeichnet; Absturzmeldung bei 880 mm), Petra Lindqvist gegen das Ist („Kundenkopie gibt alle Maße heraus“) |

Urteile im Wortlaut: [gremium/2026-10-27-aufmassblatt-gestalter.md](gremium/2026-10-27-aufmassblatt-gestalter.md), [gremium/2026-10-27-aufmassblatt-kunden.md](gremium/2026-10-27-aufmassblatt-kunden.md), [gremium/2026-10-27-aufmassblatt-fensterbauer.md](gremium/2026-10-27-aufmassblatt-fensterbauer.md).

## Muss und Vetos: was daraus wurde

| Wer | Muss oder Veto | Umgesetzt |
| --- | --- | --- |
| Jonas Veit (G) | Koralle nur für „offen“, Maueröffnung in der Zeichnung Anthrazit | ja; Glas neutral hellgrau statt violett |
| Lena Hartwig (G) | Prüfpunkt ohne Farbe erkennbar, keine Schmuckpunkte vor Überschriften | ja: Ring mit „!“ überall (Bestellmaß, Klärung, offen); Punkte vor Abschnitten entfernt |
| Noah Brandner (G), Mara Keller (G), Deniz Yilmaz (F) | Klärungsliste in Code-Reihenfolge, Doppelte zusammen, gleiche Punkte in eine Zeile | ja: je Gruppe nach Code sortiert, gleiche Punkte in einer Zeile mit allen Codes („Strom“ fünfmal → einmal), geklärt erst, wenn alle geklärt; im Muster 20 → 15 Punkte |
| Tobias Lenz (G, Veto), Thomas Berger (K, Veto), Michael Sonntag (F) | Durchschrift aus Feldern ohne Maße, „0,,20 m“ weg | ja: Punkte mit Maßen (Absturzsicherung, Maßprüfungen, großes Element) neu aus den Feldern gesagt; sonst fallen nur Angaben in mm weg, Normwerte bleiben („0,90 × 1,20 m“). Prüfung in `blatt-beispiel.mjs` und Prüfsuite (16): kein Maß des Projekts im Text |
| Daniel Roth (G) | „MAẞE“ statt „MASSE“ | ja: Versal-Eszett aus Inter in die Outfit-Schnitte übernommen (`scripts/blatt-schrift.py`), Versalzeilen setzen ẞ |
| Renate Vogel (K, Veto), Michael Sonntag (F) | Telefonnummer in einer Zeile | ja: Kontaktzeile bricht nur zwischen den Angaben um |
| Renate Vogel (K) | Bezeichner in den Karten dunkler | ja (Anthrazit, 7,8 pt) |
| Sabine Kraus (K) | Hinweis, dass der Betrieb vor der Fertigung nachmisst; Grund der Absturzsicherung in ihrer Sprache | ja, beides; „Das ist kein Messfehler“ |
| Thomas Berger (K), Kai Hofmann (K, Veto) | ein Wort, eine Bedeutung | ja: „Durchschrift“ nur für das Kundenblatt, die vollständige PDF heißt „das vollständige Aufmaßblatt mit Maßen“ |
| Thomas Berger (K) | Fotozahl stimmig, Doppelklammer, „Fußboden Fußboden“, 2-fach mit Förderwert | ja: Durchschrift „20 Fotos übermittelt“; „(einbruchhemmend, RC2)“; Fußboden einmal; die Zeile heißt im Blatt „Förderziel“ (das Ziel, nicht der Wert des Fensters) |
| Gisela Pohl (K) | „kostenlos und unverbindlich“ in den Hinweis | nein: Das kann nur der Betrieb zusagen; ohne seine Angabe wäre es erfunden. Offen als Einstellung des Betriebs |
| Sarah Kranich (F) | Durchschrift endet mit Ansprechperson und Termin, nicht mit „auf Anfrage“ | teilweise: Ansprechperson, Telefon, Mail und Website in eigener Zeile, Satz zum Nachmessen vor Ort. Der Hinweis auf die PDF bleibt, weil der Inhaber ihn ausdrücklich verlangt (Vorrang der Worte des Inhabers) |
| Tobias Reuter (F) | Klärungspunkte auf der Positionsseite ausschreiben | ja: „Zu klären bei dieser Position“ mit jedem Punkt |
| Petra Lindqvist (F) | keine Aufstellung in der Durchschrift | ja |
| Klaus Brandt (F, Veto) | Hebe-Schiebe-Tür richtig zeichnen; Absturzmeldung bei 880 mm | Zeichnung: Fehler der Musterdaten (in der App setzt `artSetzen` die Flügel), behoben; Kind 1 hat nun ein festes Unterlicht. Absturzmeldung: Regel des Modells (`ABSTURZ_MM = 900` in `modell.js`, vorsichtig für mehr als 12 m Absturzhöhe); das Modell bleibt ohne Wort des Inhabers unverändert, offen unten. Im Muster hat das Schlafzimmer jetzt 950 mm |

Ebenfalls umgesetzt (Kann, mehrfach genannt): Kürzel zu den Zeichen und Legende auf jeder Seite der Übersicht, Maße am „ד ausgerichtet, Spalte „Seite“ ausgeschrieben, Sonnenschutz mit Summe je Art, Strom aufgeteilt (vorhanden laut Foto, klären), Gewerk nicht über den Seitenumbruch, Bestellmaß-Formel zweizeilig, Kennzahlen „Fenster und Türen“ statt doppelter 13 und „zu klären, davon n Pflicht“ (führt zur Klärungsliste), Kapselreihe „Maße vom Kunden · 8 je Fenster · Feinaufmaß folgt“, Hinweis der Durchschrift vor den Kennzahlen, Wasserzeichen leiser (8 %), Geschosse am Ende in Code-Reihenfolge, Kasten „Ausstattung im Überblick“ entfällt (die Aufstellung sagt es genauer), „Mit Ihnen“ statt „Mit dem Kunden“ in der Durchschrift.

Nicht umgesetzt (Kann-Liste): Bogen mit Code-Etiketten zum Ausschneiden (Reuter), Breite je Code in der Aufstellung Sonnenschutz (Yilmaz), Akzentfarbe aus den Einstellungen des Betriebs (Lindqvist), Maßstab nach Geschoss gegliedert (Brandner), Kennzahl „Positionen“ in der Angebotssoftware als laufende Nummer (Keller), Seite 1 der Durchschrift als Bild für Websites (Kranich).

## Änderungstabelle

| Wo | Was | Warum |
| --- | --- | --- |
| `web/assets/blatt.js` | Code nach Geschoss, Übersicht nach Geschoss, Aufstellung nach Gewerk, Klärung mit Code, Positionsseite mit Code-Etikett und Weg, Verweise in zwei Durchläufen, Lesezeichen | Systematik und Bedienung (Wunsch des Inhabers) |
| `web/assets/blatt.js` | Palette der Design-DNA, Prüfzeichen Ring mit „!“, Kürzel zu den Zeichen, Maße am „ד ausgerichtet | Marke, Schwarzweißdruck (Gremium G) |
| `web/assets/blatt.js` | Variante `anfrage` als Durchschrift: Hinweis oben, Karten je Position, keine Maße, keine Zeichnung mit Maßen, keine Fotos, kein KI-Befund, keine Aufstellung | Wunsch des Inhabers, Vetos K und G |
| `scripts/blatt-schrift.py`, `web/assets/blatt-schrift.js` | Outfit in vier Schnitten mit Versal-Eszett, Wortmarke Inter | Design-DNA, „MAẞE“ |
| `scripts/bedingungen-pdf.mjs`, `functions/api/blatt-server.js`, `web/konfigurator-bedingungen/*.pdf` | Paketbedingungen, AV-Vertrag und Textblätter in Outfit | gleiche Schrift wie das Blatt (die alten Inter-Schnitte gibt es nicht mehr) |
| `web/assets/app.js`, `functions/api/blatt-server.js` | Durchschrift mit Ansprechperson, Telefon und Mail des Betriebs; lädt keine Fotos mehr; Texte „Durchschrift … ohne Maße“ | ehrliche Ankündigung, weniger Datenverkehr |
| `scripts/blatt-beispiel.mjs`, `docs/profis/aufmassblatt-vorschau/` | Musterprojekt Brandt/Mustermann, Bilder je Seite, Prüfung der Durchschrift auf Maße | Beispiel für den Inhaber und Fensterbauer |
| `scripts/pruefen.mjs` | Prüfungen auf neuen Aufbau, Outfit, ẞ und zusammengeführte Klärung angepasst; neue Prüfung der Durchschrift | Prüfsuite deckt das neue Blatt |
| `web/bilder/tour-aufmassblatt-*` | Tour-Ausschnitt neu erzeugt | Fingerabdruck des Blatts |
| `docs/GESTALTUNG.md` | Abschnitt Aufmaßblatt neu | Doku |

## Farbtabelle (Anteile je Seite, `werkzeuge/farben.py`, 110 dpi)

| Blatt | Neutral | Violett | Koralle | Indigo | Foto/Logo |
| --- | --- | --- | --- | --- | --- |
| Neu, Betrieb, Seiten 1, 3, 7 | 99,4 % (Weiß 89, Schwarz 6) | 0,2 % | 0,2 % | 0,2 % | 0,1 % |
| Neu, Durchschrift, Seiten 1, 5 | 99,6 % | 0,1 % | 0,2 % | 0,0 % | 0,1 % |
| Ist, Betrieb, Seiten 1, 2, 6 | 98,6 % (Weiß 87, Anthrazit 7) | 0,0 % | 0,3 % | 0,0 % | 1,1 % (Grün, Orange) |

Papier bleibt weiß (Druck, Toner); die Anteile der Website-Palette gelten hier nicht. Farbe steht nur als Zustand: Violett (Haken, Kapseln, Element), Indigo (Codes, Chips), Koralle (offen, prüfen).

## Messwerte

- Blatt des Betriebs: 18 Seiten, 272 KB (Ist 17 Seiten); Durchschrift: 8 Seiten, 104 KB (Ist 17 Seiten mit allen Maßen).
- Durchschrift: 90 Maßwerte des Musterprojekts gesucht, keiner im Text; keine Angabe in mm.
- Prüfsuite: siehe Lieferung (Abschnitte 3, 9, 16 und Instanzen 23–29 grün nach der Anpassung).

## Offen

- **„Kostenlos und unverbindlich“** im Hinweis der Durchschrift nur, wenn der Betrieb es in seinem Konto einstellt (Feld fehlt). Entschieden (Ermessen, 27.10.2026): vorerst nicht, eine Zusage gibt nur der Betrieb.
- Realitäts-Check mit echten Menschen.

## Auf der Website (Wunsch des Inhabers, 27.10.2026)

„Wenn du mit dem Aufmaßblatt fertig bist und ein Beispielblatt erstellt hast, dann kannst du es den ganzen Stellen hinzufügen, wo derzeit darauf verwiesen wird.“ Umgesetzt mit `node scripts/blatt-beispiel.mjs --web`:

| Wo | Was |
| --- | --- |
| `web/beispiele/` | `aufmassblatt-fensterbau-brandt.pdf` (18 Seiten) und `durchschrift-familie-mustermann.pdf` (8 Seiten) |
| Startseite (`web/index.html`, Vorschau `docs/profis/startseite-dna-vorschau/`) | Schritt 4 und Abschnitt „Was im Aufmaß steckt“: neuer Ausschnitt von Seite 1 (920 × 903), Anker neu vermessen (Öffnung und Bestellmaß EG-01, „Auf einen Blick 13 Fenster“), Etikett „je Fenster eine Seite“, Link „Ganzes Beispiel ansehen (PDF, 18 Seiten)“, Alt-Texte |
| Seite für Fensterbauer (Vorschau `docs/profis/fensterbauer-vorschau/`, übertragen) | Anfrage im Kopf „Familie Mustermann · 13 Positionen · Aufmaßblatt_Mustermann.pdf“, Schritt 3 und FAQ „Durchschrift seiner Anfrage als PDF, ohne Maße“, Schritt 4 und Abschnitt „Was in jeder Anfrage steht“ mit neuem Ausschnitt, Ankern, „Bestellmaß · EG-01 1.980 × 1.365 mm“, Klärungskarte aus dem Beispiel, Links auf beide PDFs |
| Bestellung (`web/assets/bestellen.js`) | Muster-Aufmaßblatt: Bild neu, Bild und Link öffnen das PDF, dazu „Durchschrift (PDF)“ |
| Ratgeber Aufmaßblatt (`web/ratgeber/aufmassblatt-fenster/`) | Link „Beispiel-Aufmaßblatt als PDF“ im Abschnitt „Das Aufmaßblatt aus der App“ |
| Tour der Fensterbauer (`portal.js`) | unverändert: Ausschnitt und „Ganzes Beispiel-PDF ansehen“ entstehen aus `blatt.js`, tragen also schon das neue Blatt (Tour-Bild neu erzeugt) |

Nicht geändert: die alte Vorschau `web/vorschau/fensterbauer-79b44cf9f8/` (nirgends verlinkt) und das schematische Bild `/bilder/aufmassblatt.svg` im Ratgeber (Skizze, kein Blatt).

## Fragekarte für den Realitäts-Check

Zwei Fensterbauer und ein Hauseigentümer über 65, je fünf Minuten, ohne Hilfe: Fensterbauer: „Wie viele Raffstores, wo? Was ist bei Kind 1 zu klären?“ (Zeit nehmen). Hauseigentümer mit der Durchschrift: „Was ist das? Was würden Sie tun, um ein zweites Angebot zu bekommen?“ (wörtlich notieren), „Wie sicher sind Sie, dass Sie das verstehen, 1 bis 5?“

## Antwort des Inhabers

27.10.2026: „Ja, kannst du alles online stellen nach deinem Ermessen.“ Online gestellt (main). Nach Ermessen entschieden und umgesetzt:

- **Brüstung 80 bis 89 cm** (`modell.js`, Klärungsliste): statt „Absturzsicherung nötig“ (Pflicht) jetzt „Absturzhöhe prüfen … bis 12 m Absturzhöhe genügen 80 cm Brüstung, darüber sind 90 cm nötig“ unter „Vor Ort prüfen“; unter 80 cm, bei Türen und bodentief bleibt es Pflicht. Die Frage in der App bleibt (vorsichtig ab 90 cm). Durchschrift: Grund in einfachen Worten.
- **„Unten fest“** (`app.js`): setzt ein festes Unterlicht aus Glas bis etwa 90 cm über dem Boden (300 bis 600 mm), damit Modell und Zeichnung es zeigen; wechselt die Wahl oder bleibt sie offen, fällt das so gesetzte Unterlicht wieder weg.
- **„Kostenlos und unverbindlich“:** nicht übernommen (siehe Offen).

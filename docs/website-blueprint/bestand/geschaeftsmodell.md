# Bestand: Geschäftsmodell, Leistungen, Pakete, Zielgruppen

Phase A des Website-Blueprints (MASTER-PROMPT V4), Teil „Geschäftsmodell, Leistungen, Pakete, Zielgruppen“. Ausgewertet am
24.10.2026 auf dem Zweig `claude/design-dna-styleguide`, nur lesend.

**Belege:** `Datei:Zeile` (bei HTML-Seiten die Zeile im Quelltext), bei Rechtstexten zusätzlich der Paragraf. Abkürzungen:
`PB` = `web/konfigurator-bedingungen/index.html` (Paketbedingungen mit AV-Vertrag), `AGB` = `web/agb/index.html`,
`NB` = `web/nutzungsbedingungen/index.html`, `VK` = `web/fuer-fensterbauer/index.html` (Verkaufsseite),
`SKILL` = `.claude/skills/premium-gestaltung/SKILL.md`, `BAUPLAN` = `docs/instanzen/BAUPLAN.md`,
`UEBERGABE` = `docs/instanzen/UEBERGABE.md`. Was das Repository nicht hergibt, steht als „nicht belegt“ da; Widersprüche sind mit
**Widerspruch** markiert und in Abschnitt 7 als Frage aufgenommen.

**Begriffe:** *Pakete* oder *Instanz* = Fenster-Konfigurator unter der Domain eines Fensteranbieters. *B2C* = Hauseigentümer auf
eeziframes.com. *Altbestand* = Betriebskonten auf eeziframes.com mit Aufmaß-Links und den Tarifen Start, Abo 10 und Plus.

---

## 1. Geschäftsmodell in einem Absatz

eeziframes (Anbieter: Patrick Kies, Herzebrock-Clarholz; `PB:33` § 1, `AGB:28` § 1) betreibt eine Planungs- und Aufmaß-App für
Fenster im Browser und verkauft sie vor allem (Hauptzielgruppe laut `marketing/highlights/BEITRAGS-LINIE.txt:9`) an Fensterbauer
und Fensterhändler, ausschließlich an Unternehmer, als eigenen
Fenster-Konfigurator unter deren Domain und Marke: drei Pakete mit einmaliger Einrichtungsgebühr (vorab) und Monatsabo ab dem
Livegang, ohne Gebühr je Anfrage; eeziframes richtet den Konfigurator ein, sichert die Domain, betreibt ihn und leitet jede Anfrage
der Endkunden als E-Mail mit Aufmaßblatt-PDF an den Betrieb weiter (`README.md:3`, `BAUPLAN:10-14`, `PB:29`, `PB:38` § 2,
`VK:70`). Daneben messen Hauseigentümer auf eeziframes.com kostenlos und kaufen ihr fertiges Aufmaßblatt als PDF einmalig für
7,99 € (Einführungspreis bis 17.11.2026, danach 12,99 €), das sie an beliebig viele Fensterbauer weitergeben; das PDF trägt eine
Einladung an Fensterbauer und ist so zugleich ein Weg, über den Betriebe zu eeziframes finden (`docs/ABRECHNUNG.md:7`,
`docs/ABRECHNUNG.md:84`, `AGB:23`). Das ältere Modell für Betriebe (Konto auf eeziframes.com, Aufmaß-Links, Abrechnung je Projekt
oder im Abo) läuft weiter, wird aber nicht mehr beworben (`README.md:3`, `docs/SEO.md:151`, `BAUPLAN:657` E28). Für die
Verkaufsfläche gilt laut Inhaber: Das Produkt ist der hochwertige Konfigurator unter eigener Marke und Domain in drei Paketen;
„Kunden messen selbst“ ist nicht die Hauptaussage, eine Plattform, auf der Kunden bei eeziframes Projekte anlegen, ist „kein Thema
mehr“ (`SKILL:23-25`).

**Erlösquellen im Überblick**

| Erlösquelle | Zahler | Art | Status | Beleg |
|---|---|---|---|---|
| Konfigurator-Pakete | Fensterbauer, Fensterhändler (Unternehmer) | Einrichtung einmalig + Monatsabo | Verkauf noch nicht geöffnet, Preise vorläufig | `web/assets/pakete.js:17`, `docs/BESTELLUNG.md:50-57` |
| Aufmaßblatt-PDF | Hauseigentümer ohne Link eines Betriebs | Einmalkauf | eingebaut; im Live-Modus erst mit vollständigem `verkaufStand` | `docs/ABRECHNUNG.md:15`, `functions/api/recht.js:55-62` |
| Altbestand-Tarife | Bestandsbetriebe | je Projekt oder Abo | läuft, nicht beworben | `NB:44-48`, `README.md:3` |

Kosten, soweit im Repository genannt: KI-Auswertung etwa 2,6 Eurocent je Fenster (`docs/KI.md:76`); neue Fixkosten laut Vorschlag
im Bauplan Workers Paid 5 $, Resend Pro 20 $ und Supabase Pro 25 $ im Monat, Freigabe durch den Inhaber offen (`BAUPLAN:705` F1).

---

## 2. Leistungen

### 2.1 Für Hauseigentümer (eeziframes.com)

| Leistung | Umfang | Kosten | Beleg |
|---|---|---|---|
| Zugang | Web-App im Browser auf Handy, Tablet oder Computer, ohne Installation, ohne Konto zum Messen; Deutsch, für Deutschland | kostenlos | `web/index.html:62`, `web/index.html:76-77`, `AGB:39` § 3 (1) |
| Elementarten | Fenster (auch mit Ober- und Unterlicht), Balkon- und Terrassentüren, Festverglasungen, Hebe-Schiebe-, PSK-Türen, Faltschiebewände; Rollladen, Raffstore, Screen, Rollo, Plissee, Jalousie. Nicht: Haustür, Dachfenster | kostenlos | `README.md:3`, `docs/SEO.md:47` |
| Messen | je Fenster drei Breiten und drei Höhen der Maueröffnung plus Rahmenmaß; das kleinste Maß zählt, Abweichungen werden markiert | kostenlos | `web/index.html:59`, `web/app/index.html:57` |
| Fotos und KI | Foto innen und außen; mit Einwilligung liest die KI die Einbausituation (Rollladenkasten, Anschlag, Laibung, Fensterbänke, Fassade, Strom, Zugang, Schäden), keine Maße außer Laibungstiefe, keine Preise | kostenlos | `docs/KI.md:3`, `docs/KI.md:9`, `docs/KI.md:21-33`, `docs/KI.md:57` |
| 3-D-Modell und Wünsche | Modell aus den eigenen Maßen; Material, Farbe, Glas, Rollladen; „Weiß ich noch nicht“; Gestaltung eines gespeicherten Fensters übernehmen | kostenlos | `README.md:3`, `README.md:18` |
| Fachthemen | Absturzsicherung, Einbruchschutz, Lüftungskonzept, Förderweg werden dort gefragt, wo sie entstehen; Klärungsliste für den Fensterbauer | kostenlos | `README.md:3` |
| Neue Öffnung | Öffnung, wo noch kein Fenster ist, auf dem Foto einzeichnen | kostenlos | `README.md:3` |
| Führung | Kennenlernen ohne eigene Maße (`/app/#fuehrung`) | kostenlos | `README.md:5`, `web/assets/portal.js:852` |
| Aufmaß sichern | Konto mit E-Mail und Code, ohne Passwort; bis 20 Aufmaße (eines je Haus); Löschung nach 12 Monaten ohne Änderung, freigeschaltete nach 3 Jahren | kostenlos | `AGB:39-41` § 3, `docs/ABRECHNUNG.md:47` |
| Aufmaßblatt (PDF) | je Position Zeichnung mit allen Maßen, Fotos, Fotoauswertung, Wünsche und ein Code, mit dem ein Fensterbauer das Aufmaß übernimmt; gilt für das ganze Aufmaß; vor dem Kauf als Vorschau ohne Maße | kostenpflichtig, siehe 3.4 | `AGB:33` § 2 (2), `docs/ABRECHNUNG.md:43` |
| Messen über den Link eines Fensterbauers | Aufmaß geht nur an diesen Betrieb; keine Kopie mit Maßen von eeziframes | kostenlos | `AGB:34` § 2 (3), `docs/ABRECHNUNG.md:82` |
| Ratgeber | 23 Seiten, als Weg in sechs Schritten (Prüfen, Entscheiden, Auswählen, Ausmessen, Vergleichen, Einbauen); reines HTML, bewusst ohne Vorlagen, Formulare, Rechner | kostenlos | `docs/SEO.md:57-87`, `docs/SEO.md:93`, `docs/SEO.md:149`, Ordner `web/ratgeber/` |
| Grenzen | höchstens 50 Fenster je Aufmaß; je Fenster 7 Tage freies Ändern, danach 4 Änderungen; mit dem Kauf endet die freie Zeit | – | `AGB:45` § 4 |
| Ausdrücklich nicht | kein Fensterverkauf, keine Vermittlung von Aufträgen, kein Aufmaß vor Ort; das Aufmaßblatt ist kein Bestellmaß | – | `AGB:35` § 2 (4) |

### 2.2 Für Fensterbauer und Fensterhändler: Konfigurator-Pakete (aktuelles Angebot)

| Leistung | Umfang | Beleg |
|---|---|---|
| Eigene Domain | eeziframes registriert eine Wunsch-Domain (Jahrespreis bis 25 € netto inklusive), ist während des Vertrags Inhaber, hält sie nach Ende 12 Monate und überträgt sie auf Wunsch gegen eine Pauschale (Betrag offen); vorhandene Domain des Betriebs nur nach Absprache | `PB:64-66` § 6 |
| Voller Konfigurator | 3-D-Modell, KI-Auswertung der Fotos, Klärungsliste, Zeichnung; dieselbe App wie für Hauseigentümer, unter der Domain des Betriebs mit dessen Namen und ohne Preise | `web/assets/pakete.js:75`, `VK:209` |
| Anfrage per E-Mail | jede Anfrage als E-Mail mit Aufmaßblatt-PDF an bis zu 3 bestätigte Adressen; Antwortadresse ist der Kunde; Zustellung wird verfolgt, Bounces gemeldet | `PB:38` § 2 (1), `PB:61` § 5 (4), `web/assets/instanzregeln.js:66`, `docs/INSTANZEN.md:356` |
| Inhalt jeder Anfrage | Maueröffnung (drei Breiten, drei Höhen), Fensterelement, Fotos und Einbausituation, Teilung und Öffnung, Material, Farbe, Glas, Sonnenschutz und Montage, Klärungsliste | `VK:124-130` |
| Endkunde | plant im Browser ohne Konto, sieht nur den Betrieb, keine Preise, keine Werbung; nach dem Senden Bestätigung und „Meine Anfrage als PDF“; keine automatische Mail an ihn | `VK:89-90`, `VK:240`, `BAUPLAN:636` E7 |
| Einrichtung als Dienstleistung | Rückruf zur Wunschzeit, Konfigurator anlegen, Domain verbinden, Gestaltung, Vorschau-Link, Testanfrage, Freigabe durch den Betrieb, Live; danach Knopf „Fenster planen“ als HTML-Schnipsel für die eigene Website; „meist 3 bis 5 Werktage nach der Zahlung“ | `docs/BESTELLUNG.md:19-30`, `docs/INSTANZEN.md:382`, `VK:193` |
| Recht | Impressum und Datenschutz des Konfigurators aus den Angaben des Betriebs; AV-Vertrag mit der Bestellung; Unterauftragnehmer Cloudflare, Supabase (Frankfurt), Resend, Anthropic | `docs/INSTANZEN.md:344-348`, `PB:149-152` |
| Kundenkonto `/partner/` | Bestellformular, Statusleiste, Nachrichten, Rückruf, Freigabe, Rechnungen (lesend); Zahlungsmittel und Kündigung über das Stripe-Kundenportal | `docs/BESTELLUNG.md:13`, `docs/BESTELLUNG.md:43` |
| Kundenschutz (Zusage) | nur der Betrieb wird gezeigt; Anfragen nur an bestätigte Adressen; Verarbeitung im Auftrag; kein Ansprechen der Kunden, kein Verkauf von Anfragen | `PB:84-86` § 10, `VK:160-166` |
| Nur Signature | Dashboard unter `https://<domain>/betrieb/` mit 5 Zugängen (Anmeldung per Code), persönliche Einladungslinks, Fortschritt (eingeladen, in Bearbeitung, eingereicht), abgelegte Aufmaßblätter, Export, Erinnerung an offene Einladungen nach 3 Tagen | `docs/INSTANZEN.md:184-207`, `web/assets/pakete.js:65` |
| Weiterentwicklung | „Server, Updates, Sicherheit und neue Funktionen sind dabei“; Änderungen ohne wesentliche Einschränkung des Umfangs | `VK:77`, `PB:43` § 2 (3) |
| Nicht geschuldet | Beratung, Angebote oder Aufmaß gegenüber den Kunden des Betriebs; eine Verfügbarkeitszusage steht noch aus (Platzhalter) | `PB:44` § 2 (4), `PB:89` § 11 |
| Nicht gebaut | Subdomain beim Betrieb (Weg 2), Einbettung per iframe, Mitarbeiter-Selbstverwaltung; Sortiment und Vorbelegung je Instanz (Rang 1 der Ausbauliste) | `docs/INSTANZEN.md:366-368`, `BAUPLAN:659` E30, `BAUPLAN:717` |

### 2.3 Für Fensterbauer: Altbestand (läuft, wird nicht beworben)

| Leistung | Umfang | Beleg |
|---|---|---|
| Betriebskonto auf eeziframes.com | Projekte, Aufmaß-Links einzeln oder als Einladungsliste, Eingang des Aufmaßes ins Konto, Nachbesserung (höchstens 2 Runden, bis 30 Tage), Übernahme eines B2C-Aufmaßblatts per Code, Fotos 12 Monate | `NB:32-35` § 2, `docs/ABRECHNUNG.md:72-84` |
| Tarife | siehe 3.5 | `NB:44-48` § 4 |
| Noch sichtbar | Kopfzeile der Ansicht Fensterbauer mit „Preise“, „Anmelden“, „Kostenlos starten“; Hinweis bei `?von=pdf`; Werbeblock im B2C-Aufmaßblatt („3 Projekte kostenlos · danach 9 € netto“) | `docs/GESTALTUNG.md:193`, `web/assets/portal.js:848-849`, `web/assets/blatt.js:664`, `web/assets/blatt.js:694` |

---

## 3. Pakete und Preise

### 3.1 Konfigurator-Pakete

| Paket | Einrichtung (einmalig, vorab) | Monatspreis | Laufzeit, Kündigung | Hinweis auf eeziframes | Einführungspreis | Quelle |
|---|---|---|---|---|---|---|
| EEZI Essential | 99 € | 29 € | Abo ab Livegang, unbestimmte Zeit, kündbar zum Ende des Abrechnungsmonats, ohne Mindestlaufzeit | deutlich: „Powered by EEZIframes“, verlinkt auf die Seite für Fensterbauer | keiner im Repository | `web/assets/pakete.js:44`, `web/assets/pakete.js:47`, `PB:69` § 7 (1), `PB:80` § 9 |
| EEZI Essential Plus („Empfohlen“) | 199 € | 39 € | wie Essential | dezent: kleiner Hinweis im Fuß | keiner | `web/assets/pakete.js:52`, `functions/pakete-seite.js:32-33` |
| EEZI Signature | 279 € | 64 € | wie Essential | keiner, auch nicht in PDF, Mails, Titel, Icons, Rechtstexten | keiner | `web/assets/pakete.js:60`, `docs/INSTANZEN.md:288` |

Für alle drei Pakete:

- Preise netto zuzüglich Umsatzsteuer, nur für Unternehmer nach § 14 BGB (`web/assets/pakete.js:7`, `PB:34` § 1 (2), `PB:52` § 4 (1)).
- **Vorläufig:** `VORLAEUFIG = true`, Preisstand `2026-10-22`; die Seite sagt „Vorläufige Preise … es gilt der Preis, den Sie beim
  Bestellen sehen, und er bleibt für Ihren Vertrag fest“ (`web/assets/pakete.js:15-17`, `functions/pakete-seite.js:86-91`,
  `VK:174`). Der Preis wird bei der Bestellung eingefroren (`docs/BESTELLUNG.md:38`).
- Zahlung der Einrichtung über Stripe per Karte oder SEPA-Lastschrift; der Vertrag kommt mit dem Zahlungseingang zustande; die
  Monatsgebühr wird ab Livegang monatlich im Voraus abgebucht (`PB:48` § 3 (2), `PB:53-54` § 4).
- Storno bis zum Beginn der Einrichtung mit voller Erstattung, danach keine Erstattung (`PB:70` § 7 (2)).
- Paketwechsel nach oben jederzeit auf Anfrage, Differenz der Einrichtungsgebühren fällig, neuer Monatspreis ab dem Wechsel
  (anteilig); nach unten ab dem nächsten Abrechnungsmonat (`PB:71` § 7 (3), `docs/BESTELLUNG.md:41`).
- Preisänderungen mindestens sechs Wochen vorher in Textform, Sonderkündigungsrecht (`PB:55` § 4 (4)).
- Keine Gebühr je Anfrage, keine Kosten für Programmierung, Server oder Pflege (`VK:70`, `VK:237`).
- Einführungspreise für die Pakete: nicht vorhanden (keine Stelle in `pakete.js`, `pakete-seite.js` oder den Paketbedingungen).

Größenordnung, eigene Rechnung aus den Preisen oben (keine Prognose): erstes Vertragsjahr netto Essential 99 + 12 × 29 = 447 €,
Plus 199 + 12 × 39 = 667 €, Signature 279 + 12 × 64 = 1.047 €.

### 3.2 Merkmale je Paket

Verbindlich ist `web/assets/pakete.js:42-67` (Werte) mit den Beschriftungen aus `web/assets/pakete.js:71-99`; dieselbe Tabelle steht
in `PB:41` § 2 (2).

| Merkmal | Essential | Essential Plus | Signature |
|---|---|---|---|
| Eigene Domain, voller Konfigurator, Anfrage per E-Mail mit PDF | ja | ja | ja |
| Gestaltung | eeziframes-Design mit Ihrem Namen | in Ihrem Design | in Ihrem Design |
| Logo (App, Aufmaßblatt, E-Mail) | nein | ja | ja |
| Firmenfarbe | nein | ja | ja |
| Fotos des Betriebs auf der Startseite | 0 | 6 | 6 |
| Eigene Startseite (Titel, Begrüßung, Text) | nein | ja | ja |
| App-Symbol | eeziframes | Zeichen des Betriebs | Zeichen des Betriebs |
| Hinweis auf eeziframes in der App | „Powered by EEZIframes“ | kleiner Hinweis im Fuß | keiner |
| Hinweis im Aufmaßblatt | Untertitel und Fuß | nur im Fuß | keiner |
| Rahmen der E-Mails | eeziframes | Logo des Betriebs, Fußzeile von eeziframes | ohne eeziframes |
| Absender der E-Mails | Konfigurator-Postfach von eeziframes | Konfigurator-Postfach von eeziframes | neutrales Postfach, sobald eingerichtet |
| eeziframes in Datenschutz und KI-Hinweis | mit Namen | mit Namen | als technischer Dienstleister |
| In Suchmaschinen | nein (noindex) | Startseite | Startseite |
| PDF-Kopie für Endkunden | ja | ja | ja |
| Originalfotos per Link in der E-Mail | 14 Tage | 14 Tage | nein |
| Aufbewahrung der Anfragen | 30 Tage nach Zustellung | 30 Tage nach Zustellung | Vertragsdauer |
| Unterlagen jederzeit abrufbar | nein | nein | ja |
| Dashboard, Einladungslinks, Fortschritt | nein | nein | ja |
| Zugänge zum Dashboard | 0 | 0 | 5 |
| KI-Auswertungen im Monat (Richtwert, Begrenzung ab dem Doppelten) | 600 | 1000 | 2000 |
| Anfragen am Tag (Richtwert, Begrenzung ab dem Vierfachen) | 50 | 50 | 100 |

Unterschied der Pakete in einem Satz laut Verkaufsseite: „Sie unterscheiden sich darin, wie sehr der Konfigurator Ihre Marke trägt,
und Signature hat zusätzlich ein Dashboard mit persönlichen Einladungslinks“ (`VK:236`).

### 3.3 Fristen der Pakete

Alle Werte sind laut Repository „Vorschläge bis zur Antwort des Inhabers“ (`web/assets/instanzregeln.js:8`,
`docs/INSTANZEN.md:338`, `BAUPLAN:703`).

| Frist | Wert | Quelle |
|---|---|---|
| Kulanz nach fehlgeschlagener Abbuchung, danach Pause | 14 Tage | `web/assets/instanzregeln.js:59`, `PB:75` § 8 (1) |
| Höchstdauer der Pause, danach Vertragsende | 60 Tage | `web/assets/instanzregeln.js:59`, `PB:77` § 8 (3) |
| Löschung aller Daten nach Vertragsende | 30 Tage | `web/assets/instanzregeln.js:59`, `PB:77` § 8 (3) |
| Domain nach Vertragsende gehalten | 12 Monate | `PB:65` § 6 (2) |
| Vorschau-Link vor dem Livegang | 30 Tage | `web/assets/instanzregeln.js:60` |
| Erinnerung an die Freigabe | nach 3 und 7 Tagen | `web/assets/instanzregeln.js:61` |
| Unbezahlter Bestellentwurf | Erinnerung nach 3 Tagen, Löschung nach 30 Tagen; höchstens 3 offene Bestellungen | `docs/BESTELLUNG.md:32` |
| Anfragen Essential und Plus | 30 Tage nach bestätigter Zustellung; ohne Zustellung 60 Tage | `PB:169` AVV § 11 |
| Anfragen Signature | bis Vertragsende, Originalfotos 365 Tage | `PB:169` AVV § 11 |
| Begonnene Planung ohne Fenster / mit Fenster | 24 Stunden / 30 Tage nach der letzten Änderung | `PB:169` AVV § 11 |
| Test- und Demo-Anfragen | 1 Tag | `PB:169` AVV § 11 |
| Sicherungen der Datenbank | 7 Tage | `PB:169` AVV § 11 |
| Dauer bis Live | „meist 3 bis 5 Werktage nach der Zahlung“ | `docs/BESTELLUNG.md:30`, `VK:242` |

### 3.4 Hauseigentümer: Aufmaßblatt

| Produkt | Preis | Einführungspreis | Quelle |
|---|---|---|---|
| Messen, Fotos, KI-Auswertung, 3-D-Modell | 0 € | – | `AGB:23`, `docs/ABRECHNUNG.md:43` |
| Aufmaßblatt als PDF, ohne Link eines Betriebs | Endpreis, einmalig | 7,99 € bei Kauf bis einschließlich 17.11.2026, ab 18.11.2026 automatisch 12,99 € | `AGB:55` § 6 (1), `web/config.js:12`, `web/config.js:14`, `functions/api/umgebung.js:72`, `docs/ABRECHNUNG.md:11` |
| Messen über den Link eines Betriebs | 0 € | – | `AGB:34` § 2 (3) |

Zahlung über Stripe; Karte, Apple Pay, Google Pay, PayPal je nach Kasse; keine SEPA-Lastschrift (`AGB:56` § 6 (2)). Das
Widerrufsrecht erlischt mit der Zustimmung an der Kasse und der Vertragsbestätigung per E-Mail (`AGB:23`, `AGB:77`). Einen
„statt“-Preis zeigt die Seite bewusst nicht (`docs/ABRECHNUNG.md:11`).

### 3.5 Altbestand-Tarife (nicht beworben)

| Tarif | Preis netto | Einführungspreis | Laufzeit, Kündigung | Quelle |
|---|---|---|---|---|
| Start | keine Grundgebühr; erste 3 Projekte mit eingegangenem Aufmaß kostenlos, danach 9 € je Projekt | – | – | `NB:44` § 4, `docs/ABRECHNUNG.md:17` |
| Abo 10 | 10 Projekte je Kalendermonat, jedes weitere 5 € | 49 € im Monat bei Abschluss bis 17.11.2026, danach 69 € | monatlich, kündbar zum Ende des Abrechnungsmonats | `NB:45` § 4, `NB:68` § 8 (2) |
| Plus | Projekte unbegrenzt, Logo und Farbe beim Kunden, Team | 79 € im Monat bei Abschluss bis 17.11.2026, danach 119 € | wie Abo 10 | `NB:46` § 4 |

Abrechnung der Projekte als Sammelrechnung am 1. und 15. (`NB:57` § 6 (1)). Der Tarif „Plus“ (79 € bzw. 119 €) ist ein anderes Produkt
als das Paket „EEZI Essential Plus“ (39 €) (`BAUPLAN:328`).

---

## 4. Zielgruppen und Besuchssituationen

**Grundlage:** Im Repository gibt es keine Nutzerforschung, keine Personas und keine Besucherzahlen (die Statistik der Zentrale zählt
auf dem Server, ihre Werte liegen nicht im Repository, `docs/ZENTRALE.md:27`). Belegt sind Suchbegriffe aus den Vorschlägen der
Google-Suche, Stand Oktober 2026, ohne Suchvolumen (`docs/SEO.md:30`), die Seiten und Einstiege im Code und die dokumentierten Wege, über
die Besucher kommen sollen. Wissensstand und Absicht sind daraus **abgeleitet**, nicht erhoben.

### 4.1 Zielgruppen laut Repository

| Zielgruppe | Rolle | Beleg |
|---|---|---|
| Fensterbauer und Fensterhändler, Unternehmer in Deutschland | Käufer der Pakete; laut Instagram-Linie „Hauptzielgruppe“; auf der Seite für Fensterbauer „soll ein Fensterbauer kaufen“ | `VK:56`, `marketing/highlights/BEITRAGS-LINIE.txt:9`, `SKILL:23`, `BAUPLAN:709` F5 |
| Hauseigentümer, die neue Fenster planen | Käufer des Aufmaßblatts; zugleich Endkunden in den Konfiguratoren der Betriebe | `web/index.html:73`, `BAUPLAN:11` |
| Bestandsbetriebe | Nutzer des Altbestands, melden sich an; nicht beworben | `docs/GESTALTUNG.md:193` |
| Paketkunden nach dem Kauf | Kundenkonto `/partner/`, bei Signature das Team im Dashboard; Service, keine Akquise | `docs/BESTELLUNG.md:13`, `docs/INSTANZEN.md:184` |
| Suchmaschinen und KI-Assistenten | Mittler: sollen eeziframes finden, zitieren, empfehlen | `docs/SEO.md:3` |

### 4.2 Besuchssituationen

| Nr. | Wer | Wie er kommt | Wissensstand (abgeleitet) | Absicht (abgeleitet) | Ziel im Bestand | Beleg |
|---|---|---|---|---|---|---|
| H1 | Hauseigentümer, Problem am Fenster | Suche „fenster beschlagen innen“, „fenster undicht“, „fenster zieht“, „fenster baujahr erkennen“, „lebensdauer fenster“ | Laie; weiß nicht, ob neue Fenster nötig sind | Ursache verstehen | Ratgeber, Schritt „Prüfen“, Leseführung zum nächsten Schritt | `docs/SEO.md:44`, `docs/SEO.md:93` |
| H2 | Hauseigentümer vor der Entscheidung | „fenster reparieren oder austauschen“, „fenster austauschen kosten“, „neue fenster förderung“, „fenstertausch altbau“ | Laie mit Vorhaben | Kosten, Förderung, Ablauf klären | Ratgeber „Entscheiden“ | `docs/SEO.md:37`, `docs/SEO.md:43-44` |
| H3 | Hauseigentümer bei der Auswahl | „kunststofffenster oder holzfenster“, „dreifachverglasung lohnt sich“, „fenster öffnungsarten“, „uw wert fenster“, „din links fenster“, „fenstermaße standard“ | Laie, vergleicht Optionen | Varianten verstehen | Ratgeber „Auswählen“ | `docs/SEO.md:41-44` |
| H4 | Hauseigentümer, der messen will | „fenster ausmessen“ (Hauptbegriff), „aufmaß fenster altbau“, „balkontür ausmessen“, „fenster mit rollladenkasten ausmessen“, „aufmaßblatt fenster pdf“, „fenster ausmessen app“, „aufmaß app kostenlos“ | Laie mit konkretem Vorhaben; sucht Anleitung, Vorlage oder Werkzeug | messen, ein Aufmaßblatt erhalten | Messanleitung → App → Kauf des Aufmaßblatts | `docs/SEO.md:34-36`, `docs/SEO.md:40` |
| H5 | Hauseigentümer mit Angeboten | „fenster angebot vergleichen“, „angebot fenstertausch worauf achten“ | hat Angebote vorliegen | Angebote prüfen | Ratgeber „Vergleichen“ | `docs/SEO.md:37`, `docs/SEO.md:44` |
| H6 | Hauseigentümer vor dem Einbau | „ral montage fenster“, „lüftungskonzept fenstertausch“, „schimmel nach fenstertausch“ | Auftrag steht bevor | Einbau richtig machen | Ratgeber „Einbauen“ | `docs/SEO.md:43` |
| H7 | Hauseigentümer über einen KI-Assistenten | Antwort von ChatGPT, Claude, Perplexity mit Verweis auf Ratgeber oder `llms.txt` | wie H1–H6 | wie H1–H6 | Ratgeber, App | `docs/SEO.md:3`, `docs/SEO.md:112` |
| H8 | Hauseigentümer direkt auf der Startseite | Adresse, Empfehlung | unbekannt | messen | Standardansicht Hauseigentümer: „Jetzt ausmessen“, „Führung starten“ | `web/assets/portal.js:852`, `docs/SEO.md:101` |
| H9 | Hauseigentümer über den Link oder Konfigurator eines Betriebs | Link `/app/#k-…` bzw. Domain des Betriebs; landet nicht auf der Website, Logo ohne Ziel (Kundenschutz) | vom Betrieb eingeladen | Aufmaß an diesen Betrieb senden | App | `docs/GESTALTUNG.md:139`, `docs/ABRECHNUNG.md:82` |
| F1 | Fensterbauer mit Aufmaß- oder Softwarefrage | Suche „digitales aufmaß“, „aufmaß software“, „fenster angebot software“, „feinaufmaß fenster“, „erstaufmaß“, „fensterbauer falsches aufmaß“, „aufmaß kostenpflichtig“, „anfahrtspauschale handwerker“, „fensterbau software“ | Fachmann; kennt Erst- und Feinaufmaß | Problem lösen (Anfahrt, Kosten, Haftung) oder Software vergleichen | `/fuer-fensterbauer/` und fünf Unterseiten „Wissen für Fensterbauer“ | `docs/SEO.md:38`, `docs/SEO.md:45`, `VK:251-255` |
| F2 | Fensterbauer, dem ein Kunde sein Aufmaßblatt schickt | QR-Code im PDF („Scannen: Anmeldung“, „Projekt anlegen“) → `/?von=pdf`, Ansicht Fensterbauer mit Hinweis zum Code; die Statistik zählt diese Herkunft eigens | kennt eeziframes nur aus dem PDF | Aufmaß übernehmen | heute: Registrierung im Altbestand („Die ersten 3 Aufmaße sind frei“) | `docs/ABRECHNUNG.md:84`, `web/assets/blatt.js:227`, `web/assets/blatt.js:664`, `web/assets/blatt.js:694-697`, `web/assets/portal.js:849`, `docs/ZENTRALE.md:27` |
| F3 | Fensterbauer, der einen Essential-Konfigurator eines anderen Betriebs sieht | Link „Powered by EEZIframes“ → `/fuer-fensterbauer/` | sieht das Produkt im Einsatz | dasselbe für sich prüfen | Verkaufsseite | `BAUPLAN:656` E27, `PB:80` § 9 (1) |
| F4 | Fensterbauer über Instagram oder Anzeigen | Story-Highlights; Anzeigen mit `utm_…`, als Ziel bisher `/?…#fensterbauer` beschrieben | unbekannt | unbekannt | Ansicht Fensterbauer | `marketing/highlights/BEITRAGS-LINIE.txt:7`, `marketing/highlights/storyboard.json` („leitgedanke“), `docs/ZENTRALE.md:83` |
| F5 | Fensterbauer über die Startseite | Umschalter „Fensterbauer“ (`/#fensterbauer`); die Verkaufsseite ist dort eingebettet | unbekannt | Angebot ansehen | eingebettete Verkaufsseite | `docs/GESTALTUNG.md:193`, `SKILL:63-64` |
| F6 | Fensterbauer, der ausprobieren will | „Konfigurator ausprobieren“ → `/app/` (B2C-App mit Preisen von eeziframes); Demo-Instanzen erst mit `PAKETE_DEMOS=1` | hat die Verkaufsseite gelesen | Produkt anfassen | App, später Demos | `VK:63`, `VK:209-210`, `docs/INSTANZEN.md:310` |
| F7 | Fensterbauer über einen KI-Assistenten | Frage etwa „Aufmaß-App für Fensterbauer“; `llms.txt` enthält einen Absatz zu den Paketen mit Preisen | unbekannt | Anbieter finden | Verkaufsseite | `docs/SEO.md:142`, `functions/pakete-seite.js:272-285` |
| B1 | Bestandsbetrieb | Kopfzeile „Anmelden“ | kennt eeziframes | Projekte bearbeiten | Betriebsbereich | `docs/GESTALTUNG.md:193` |
| P1 | Paketkunde | Kundenkonto `/partner/`; Signature-Team unter `/betrieb/` der eigenen Domain | Kunde | Status, Freigabe, Rechnungen, Anfragen | Kundenkonto, Dashboard | `docs/BESTELLUNG.md:13`, `docs/INSTANZEN.md:184` |

### 4.3 Was belegt ist und was nicht

- **Belegt:** Suchbegriffe ohne Volumen (`docs/SEO.md:28-47`); Themen der 23 Ratgeber und 5 Seiten für Fensterbauer; die Einstiege im
  Code (Startseite mit zwei Ansichten, Verkaufsseite, App, QR-Code im PDF, „Powered by“).
- **Nicht belegt:** Suchvolumen, Besucherzahlen, Anteil Telefon und Schreibtisch, Konversionsraten, Verhältnis der Zielgruppen,
  Größe der Zielbetriebe, wer im Betrieb entscheidet (Inhaber, Büro, Verkauf), Unterschiede zwischen Fensterbauer und
  Fensterhändler.
- „Mobil zuerst“ (Telefon 390 × 844 als Hauptansicht) ist eine Vorgabe des Inhabers, keine Messung (`SKILL:28`).
- Für die Konfigurator-Pakete selbst gibt es keine erhobenen Suchbegriffe: Die Fensterbauer-Zeile in `docs/SEO.md:38` und
  `docs/SEO.md:45` nennt nur Begriffe rund um Aufmaß und Software, keinen mit „Konfigurator“.
- Die Kennzahlen auf der Verkaufsseite (9,9 Wochen Auftragsreichweite, 97.482 offene Stellen, 65,14 € je Meisterstunde, 68 % Angebote
  digital) beschreiben den Markt mit Quellen (`VK:151-154`, `VK:261-265`); sie sind keine Nutzerforschung zu eeziframes.

---

## 5. Wirtschaftliches Endziel der Website

### 5.1 Handlungen, die Besucher ausführen sollen

| Nr. | Handlung | Zielgruppe | Einstieg im Bestand | Stand | Beleg |
|---|---|---|---|---|---|
| 1 | **Paket bestellen** (`/partner/#bestellen/<paket>`) | Fensterbauer | Knöpfe in den Paketkarten und im Abschnitt „Bestellen oder anfragen“ | nur mit `PAKETE_OFFEN=1`; heute nicht geöffnet | `SKILL:23`, `functions/pakete-seite.js:113-115`, `functions/pakete-seite.js:190-194`, `docs/BESTELLUNG.md:52` |
| 2 | **Zum höheren Paket greifen** | Fensterbauer | Plus als mittleres Paket „Empfohlen“ mit Cream-Knopf | vorhanden | `SKILL:50`, `functions/pakete-seite.js:32-33` |
| 3 | **Paket unverbindlich anfragen / Frage senden** | Fensterbauer | Formular auf der Verkaufsseite (auch ohne JavaScript) | heute die einzige Abschlusshandlung für Pakete | `functions/pakete-seite.js:173-197`, `docs/BESTELLUNG.md:59`, `VK:220-226` |
| 4 | Konfigurator ausprobieren, Demo ansehen | Fensterbauer | `/app/`, später `demo-<paket>.eeziframes.com` | Demos nicht freigeschaltet | `VK:209-210` |
| 5 | Paketbedingungen und AV-Vertrag lesen | Fensterbauer | `/konfigurator-bedingungen/`, PDFs | Entwurf | `VK:188` |
| 6 | **Messen in der App beginnen** | Hauseigentümer | „Jetzt ausmessen“; jeder Ratgeber führt zur App („jede zusätzliche Seite im Besuch ist eine Chance, dass jemand misst“) | vorhanden | `web/assets/portal.js:852`, `docs/SEO.md:91`, `docs/SEO.md:149` |
| 7 | Führung starten | Hauseigentümer | „Führung starten“ | vorhanden | `web/assets/portal.js:852` |
| 8 | Aufmaß sichern (Konto) | Hauseigentümer | Karte „Nur auf diesem Gerät“ in der App | vorhanden | `docs/ABRECHNUNG.md:47` |
| 9 | **Aufmaßblatt kaufen** | Hauseigentümer | „Freischalten“ in der App | eingebaut; echte Zahlung erst mit Stufe 2 und vollständigem `verkaufStand` | `docs/ABRECHNUNG.md:43`, `functions/api/recht.js:55-62` |
| 10 | Aufmaßblatt an Fensterbauer weitergeben | Hauseigentümer | Teilen-Knöpfe, PDF | vorhanden; das PDF wirbt heute für den Altbestand | `docs/ABRECHNUNG.md:84`, `web/assets/blatt.js:694` |
| 11 | Als Betrieb registrieren („Kostenlos starten“) | Fensterbauer | Kopfzeile der Ansicht Fensterbauer, `?von=pdf` | vorhanden, soll nicht beworben werden | `docs/GESTALTUNG.md:193`, `BAUPLAN:657` E28 |

### 5.2 Gewichtung laut Repository und SKILL.md

- **Ausdrücklich (SKILL.md):** Auf der Seite für Fensterbauer ist der Paketkauf das Ziel; jedes Element auf Verkaufsflächen führt
  zum Kauf, macht die Pakete sichtbar und führt zum höheren Paket; die nächste Handlung ist klar (`SKILL:23-25`, `SKILL:50-51`). Die
  Messlatte: Ein Fensterbauer soll an der Seite merken, dass eeziframes Webdesign und Digitales beherrscht (`SKILL:38`). Ehrlichkeit
  vor Überzeugung: keine erfundenen Belege, Kundenzahlen, Bewertungen, Siegel; „Beliebt“ nur mit Kunden, sonst „Empfohlen“
  (`SKILL:49`).
- **Instagram-Linie:** Fensterbauer sind die Hauptzielgruppe (`marketing/highlights/BEITRAGS-LINIE.txt:9`).
- **Startseite:** Standardansicht ist die für Hauseigentümer, die Ansicht Fensterbauer liegt hinter dem Umschalter
  (`docs/SEO.md:101`, `web/assets/portal.js:845-853`). Eine Gewichtung zwischen beiden Ansichten als Ziel nennt das Repository nicht.
- **Hauseigentümer:** Ziel der Ratgeber ist, dass gemessen wird; das Aufmaß entsteht in der App, „Geschäftsmodell“
  (`docs/SEO.md:91`, `docs/SEO.md:149`). Das Aufmaßblatt ist die einzige B2C-Einnahme und zugleich Akquise für Betriebe
  (`docs/ABRECHNUNG.md:7`, `docs/ABRECHNUNG.md:84`).
- **Altbestand:** Registrierung bleibt erreichbar, ist aber kein Ziel mehr (`BAUPLAN:657` E28, `docs/SEO.md:151`).
- **Nicht belegt:** Umsatzziele, Zielzahlen je Handlung, eine Rangfolge zwischen Paketverkauf und Verkauf des Aufmaßblatts.
- **Größenordnung, eigene Rechnung (keine Prognose):** Ein Essential-Vertrag bringt im ersten Jahr 447 € netto (3.1). Bei 19 %
  Umsatzsteuer entspricht das rund 67 Aufmaßblättern zu 7,99 € oder rund 41 zu 12,99 €; der Umsatzsteuer-Status ist offen (6.3).

**Folgerung aus den Belegen (zur Bestätigung durch den Inhaber, Frage 7.1):** Hauptumwandlung der Website ist die Paketbestellung,
solange der Verkauf geschlossen ist ersatzweise die unverbindliche Anfrage, mit Hinführung zu Plus oder Signature. Zweites Ziel ist,
dass Hauseigentümer in der App messen und das Aufmaßblatt kaufen. Die Registrierung im Altbestand ist kein Ziel.

---

## 6. Stand des Projekts

### 6.1 Gesamtstand

| Punkt | Stand | Beleg |
|---|---|---|
| Phase | „Pilotphase, Stufe 2 vorbereitet“: ohne Schlüssel laufen Kundenlinks, Messen, PDF und Code-Übergabe im Browser, der Kauf ist ein gekennzeichneter Testkauf, Konten von Betrieben liegen im Browser | `README.md:5`, `docs/ONLINE-STELLEN.md:9-21` |
| Online | Code der Pakete auf `main`, Seite über den Cloudflare-Build online; Pakete trotzdem geschlossen | `UEBERGABE` (Abschnitt „Stand“, letzter Absatz) |
| Pilotschalter | `pilot: true` als Rückfall; mit Server schaltet die App selbst um | `web/config.js:6` |
| Stufe 2 produktiv (Supabase, Stripe live)? | im Repository nicht feststellbar, die Schlüssel liegen nur bei Cloudflare | – |
| Suchmaschinen | **Widerspruch:** „freigegeben, `INDEXIERUNG=1` ist bei Cloudflare gesetzt“ (Stand 18.10.2026) gegenüber „noch gesperrt, bis Impressum und Datenschutz fertig sind“ | `docs/SEO.md:5`, `README.md:5` |
| Prüfsuite | 1683 bestanden, 0 fehlgeschlagen (Endstand der Pakete) | `UEBERGABE` (Tabelle „Stand“) |

### 6.2 Abgeschaltet oder nicht freigeschaltet

| Was | Schalter | Wirkung heute | Beleg |
|---|---|---|---|
| Verkauf der Pakete | `PAKETE_OFFEN` fehlt | „Vorläufige Preise“, „Bestellung bald möglich“, Anfrageformular statt Bestellknöpfen, JSON-LD `PreOrder` | `docs/BESTELLUNG.md:50-57`, `VK:174`, `VK:220` |
| Paket-Kasse im Live-Modus | `paketVerkaufStand()` | zu, bis Mailversand, `MWST`, Datenbank, `SITZUNG_GEHEIMNIS`, Paketbedingungen ohne Platzhalter, PDFs und geprüfte Rechtsvorlage der Instanzen da sind | `functions/api/recht.js:73-85` |
| Kasse des Aufmaßblatts im Live-Modus | `verkaufStand()` | zu, bis Mailversand, `MWST`, Konten und vollständige Rechtstexte da sind | `functions/api/recht.js:55-62` |
| Live-Demos je Paket | `PAKETE_DEMOS` fehlt | „schalten wir in Kürze frei“, Ersatz `/app/` | `VK:209`, `docs/INSTANZEN.md:310` |
| Neutraler Absender (Signature) | `MAIL_ABSENDER_NEUTRAL` | Zusage nur „sobald eingerichtet“ | `docs/INSTANZEN.md:308` |
| Werbung für den Altbestand | – | von der Startseite entfernt; Tarife nur in Nutzungsbedingungen und Betriebsbereich | `docs/SEO.md:151`, `docs/GESTALTUNG.md:193` |
| Beispielprojekte im Altbestand | – | werden nicht mehr angelegt | `docs/ABRECHNUNG.md:37` |
| Turnstile, Subdomain beim Betrieb, iframe-Einbettung, Mitarbeiter-Selbstverwaltung | – | nicht gebaut | `BAUPLAN:642` E13, `BAUPLAN:659` E30 |

### 6.3 Was rechtlich fehlt

| Was | Stand | Beleg |
|---|---|---|
| Paketbedingungen und AV-Vertrag | „Entwurf zur anwaltlichen Prüfung“, Stand 23.10.2026; sechs offene Stellen: Freigabe der Fassung, Pauschale für die Domain-Übertragung, Verfügbarkeitszusage, Haftungshöchstbetrag, Gerichtsstand, Meldefrist bei Datenpannen | `PB:28`, `PB:65`, `PB:89`, `PB:94`, `PB:106`, `PB:164` |
| Vorlage für Impressum und Datenschutz der Instanzen | `geprueft: false` | `functions/instanz/recht.js:25`, `docs/INSTANZEN.md:348` |
| Impressum und Datenschutz von eeziframes.com | Entwurf, „vor dem öffentlichen Start rechtlich prüfen lassen“; E-Mail und Telefon stehen inzwischen drin (**Widerspruch** zu „E-Mail und Telefon folgen“) | `web/impressum/index.html:14`, `web/datenschutz/index.html:13`, `README.md:21`, `docs/SEO.md:129` |
| AGB, Nutzungsbedingungen, Cookies | Stand 18.10.2026, rechtliche Prüfung offen | `AGB:20`, `NB:20`, `docs/ZENTRALE.md:121` |
| Umsatzsteuer | `MWST` nicht festgelegt (0 = Kleinunternehmer oder 19) | `functions/api/recht.js:58`, `functions/api/recht.js:76`, `docs/ABRECHNUNG.md:25` |
| Barrierefreiheit | ob BFSG oder BITV gelten, ist offen | `docs/GESTALTUNG.md:276` |
| Marke | Recherche im Markenregister empfohlen, Ähnlichkeiten („EzyFrame“, „EZ Frames“) | `docs/ONLINE-STELLEN.md:104` |
| Preise, Fristen, Zielmarkt | Vorschläge bis zur Antwort des Inhabers auf F1–F5 | `BAUPLAN:703-709` |

### 6.4 Was technisch und inhaltlich fehlt

| Was | Beleg |
|---|---|
| Einrichtung bei Cloudflare (KV `INSTANZEN`, Queue `EINGANG`, `CF_API_TOKEN`), Resend, Stripe, Supabase für die Pakete | `BAUPLAN:588-599`, `docs/INSTANZEN.md:15`, `UEBERGABE` („Nächste Schritte“ 2) |
| Bilder der Seite für Fensterbauer: Plätze `fb-anfrage`, `fb-kundenschutz`, `fb-pakete`, `fb-ablauf`, `fb-frage` mit Platzhaltern; Beispielbilder je Paket leer (Skizzen) | `UEBERGABE` („Nächste Schritte“ 3), `docs/BILDER.md:90-94`, `functions/pakete-seite.js:96` |
| Offene Prüfbefunde 11 (Hinweis „Bestellung bald möglich“ schon in Schritt 1), 15 (Rückruf: vergangene Zeiten, Feiertage), 17 (Formularfeld „E-Mail im Impressum“) | `docs/INSTANZEN.md:385` |
| Zeitstempel des Altbestands in UTC, Entscheidung offen | `UEBERGABE` („Nächste Schritte“ 4) |
| Einführungspreis für Hauseigentümer und Altbestand endet am 17.11.2026; danach gelten die regulären Preise von selbst | `docs/ABRECHNUNG.md:11` |

---

## 7. Offene Fragen an den Inhaber

### 7.1 Ziel und Gewichtung

1. Ist die Paketbestellung (bis zur Öffnung: die unverbindliche Anfrage) die Hauptumwandlung der ganzen Website, und welchen Rang hat
   der Kauf des Aufmaßblatts durch Hauseigentümer daneben: eigene Einnahmequelle, Schaufenster für den Konfigurator oder Akquise von
   Betrieben? Das Repository nennt keine Rangfolge (Abschnitt 5.2).
2. Soll die Startseite weiter mit der Ansicht für Hauseigentümer öffnen (`docs/SEO.md:101`), obwohl die Fensterbauer die
   Hauptzielgruppe sind (`marketing/highlights/BEITRAGS-LINIE.txt:9`, `SKILL:23`)?
3. Gilt der Satz „eeziframes bringt Leute, die am Haus etwas vorhaben, mit den Betrieben aus ihrer Gegend zusammen. Später kommen
   weitere Gewerke dazu“ (`docs/ONLINE-STELLEN.md:3`) noch? Er steht gegen „Kein Thema mehr: eine Plattform …“ (`SKILL:25`) und
   „Wir … vermitteln keine Aufträge“ (`AGB:35` § 2 (4)).
4. Gibt es Umsatz- oder Zielzahlen (Anfragen, Bestellungen, Käufe je Monat), an denen die neue Website gemessen werden soll?

### 7.2 Angebot und Preise

5. Sind die Paketpreise 29/99 €, 39/199 €, 64/279 € endgültig (`VORLAEUFIG = true`, `web/assets/pakete.js:17`)? Sind für die
   Pakete Einführungspreise geplant?
6. Wann soll der Paketverkauf geöffnet werden (`PAKETE_OFFEN`), wann die Live-Demos (`PAKETE_DEMOS`)?
7. Paketwechsel nach oben: Ist die Differenz der Einrichtungsgebühr immer fällig (`PB:71` § 7 (3), `VK:243`) oder nur „auf Wunsch“
   (`docs/BESTELLUNG.md:41`)? **Widerspruch.**
8. Sind Fensterhändler eine eigene Zielgruppe mit anderen Bedürfnissen oder Wörtern, oder reicht „Fensterbauer und Fensterhändler“?
9. Zielmarkt: nur Deutschland (`BAUPLAN:709` F5, `web/index.html:77`), oder sollen Österreich und Schweiz auf der Website vorkommen?
10. Sind die Fristen (Kulanz 14, Pause 60, Löschung 30 Tage; Domain bis 25 € netto) bestätigt (`BAUPLAN:705-707`)?
11. Belege für Zusagen: Sind „etwa 5 Minuten je Fenster“ (`VK:70`, `web/index.html:58`), „meist 3 bis 5 Werktage bis Live“
    (`docs/BESTELLUNG.md:30`) und „Antwort in der Regel innerhalb eines Werktags“ (`functions/pakete-seite.js:194`, `:196`)
    gemessen oder Ziele? Bis zum Livegang richtet der Inhaber jede Instanz selbst ein (`docs/INSTANZEN.md:297-306`): Gibt es eine
    Grenze, wie viele Bestellungen je Woche machbar sind?
12. Gibt es Pilotbetriebe oder erste Kunden, die als Referenz genannt werden dürfen (`PB:81` § 9 (2), `docs/SEO.md:139`)? Bis dahin
    zeigt die Website keine Kundenstimmen, Zahlen oder Logos (`SKILL:49`).

### 7.3 Altbestand

13. Soll der Altbestand auf der Website sichtbar bleiben: Kopfzeile „Preise“, „Anmelden“, „Kostenlos starten“
    (`docs/GESTALTUNG.md:193`), der Hinweis bei `?von=pdf` (`web/assets/portal.js:849`) und der Werbeblock im Aufmaßblatt
    („3 Projekte kostenlos · danach 9 € netto“, `web/assets/blatt.js:664`, `web/assets/blatt.js:694`)? Das steht gegen „nicht mehr
    beworben“ (`README.md:3`, `BAUPLAN:657` E28). **Widerspruch.**
14. Wohin soll ein Fensterbauer kommen, der den QR-Code auf dem Aufmaßblatt eines Kunden scannt: zur Registrierung im Altbestand
    (heute) oder zu den Paketen?
15. Zwei Produkte heißen „Plus“: der Altbestand-Tarif (79 € bzw. 119 €, `NB:46`) und das Paket „EEZI Essential Plus“ (39 €,
    `web/assets/pakete.js:52`). Wie soll die Website damit umgehen, solange beide sichtbar sind?
16. Instagram-Material und Markenkern lauten noch „Aufmaß ohne Anfahrt“ mit Tarif Start (`marketing/highlights/BEITRAGS-LINIE.txt:7`,
    `marketing/highlights/storyboard.json`), die Website soll aber wie die Beiträge aussehen (`docs/GESTALTUNG.md:3`). Folgt
    Instagram der neuen Ausrichtung auf die Pakete?

### 7.4 Recht, Steuer, Stand

17. Kleinunternehmerregelung oder 19 % Umsatzsteuer? Die Nutzungsbedingungen sagen „Solange wir die Kleinunternehmerregelung nach
    § 19 UStG anwenden …“ (`NB:48`), Paketbedingungen und Verkaufsseite „zuzüglich der gesetzlichen Umsatzsteuer“ (`PB:52` § 4 (1),
    `VK:185`), `MWST` ist nicht gesetzt (`functions/api/recht.js:58`). **Widerspruch.**
18. Ist eeziframes.com für Suchmaschinen freigegeben (`docs/SEO.md:5`) oder noch gesperrt (`README.md:5`)? **Widerspruch.**
19. Sind Supabase und Stripe (Stufe 2) produktiv angeschlossen, also werden Aufmaßblätter heute echt verkauft oder nur als Testkauf?
20. Wann ist die anwaltliche Prüfung von Paketbedingungen, AV-Vertrag, Rechtsvorlage der Instanzen, Impressum, Datenschutz, AGB und
    Nutzungsbedingungen zu erwarten (`PB:28`, `functions/instanz/recht.js:25`)?

### 7.5 Wortlaut und Marke

21. „Zwei Fotos, vier Maße“ (`web/assets/portal.js:852`, `docs/ONLINE-STELLEN.md:13`) oder „8 Maße je Fenster“
    (`web/assets/portal.js:854`, `docs/KI.md:3`)? **Widerspruch** in der Außendarstellung.
22. „Powered by EEZIframes“ (`web/assets/pakete.js:28`, `web/assets/pakete.js:83`) gegen die Regel „eeziframes, immer klein
    geschrieben“ (`docs/GESTALTUNG.md:7`): Absicht oder Fehler?
23. Soll für die Pakete eine eigene Suchbegriff-Recherche entstehen (etwa rund um „Fenster-Konfigurator“)? `docs/SEO.md:38` und
    `docs/SEO.md:45` enthalten für Fensterbauer nur Begriffe zu Aufmaß und Software.

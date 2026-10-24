# Websites mit vergleichbaren Geschäftsmodellen

Phase C, Recherche. Stand: 24.10.2026. Planungsdokument, keine Umsetzung.

## 1. Ausgangslage: was eeziframes verkauft

| Angebot | Inhalt | Beleg |
|---|---|---|
| Konfigurator für Fensterbauer und Fensterhändler | derselbe Konfigurator wie auf eeziframes.com, als eigener unter Domain und Marke des Betriebs; Kunden planen dort, jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail | README.md Z. 3; docs/BESTELLUNG.md Z. 3 |
| Drei Pakete, netto, vorläufig | EEZI Essential 29 €/Monat + 99 € Einrichtung; EEZI Essential Plus 39 € + 199 €; EEZI Signature 64 € + 279 € | web/assets/pakete.js Z. 44, 52, 60; `VORLAEUFIG` Z. 17; `PREIS_STAND` Z. 15 |
| Abstufung | Plus: eigene Gestaltung, Logo, Firmenfarbe, Startseite in Suchmaschinen; Signature zusätzlich ohne Hinweis auf eeziframes, Dashboard unter der Domain, Einladungslinks, 5 Zugänge | web/assets/pakete.js Z. 44–65, 74–98 |
| Weg bis Live | sechs Schritte von „Bestellt“ bis „Live“; Vorschau und Freigabe durch den Betrieb vor dem Livegang; meist 3 bis 5 Werktage nach der Zahlung | docs/BESTELLUNG.md Z. 19–30 |
| Zahlung | Einrichtung vorab (Karte oder SEPA), Monatsabo ab Livegang; Storno bis zum Beginn der Einrichtung mit voller Erstattung | docs/BESTELLUNG.md Z. 38–39, 44 |
| Stand des Verkaufs | Bestellung noch nicht freigeschaltet („Bestellung bald möglich“), Anfrageformular; Live-Demos je Paket „in Kürze“, bis dahin die App selbst | web/fuer-fensterbauer/index.html Z. 174, 209–210, 220; docs/BESTELLUNG.md Z. 50–57 |
| Aufmaß-App für Hauseigentümer | messen ohne Konto; Aufmaßblatt-PDF einmal 7,99 € (Einführungspreis bis 17.11.2026, danach 12,99 €) | README.md Z. 3 |
| Reifegrad | Pilotphase | README.md Z. 5 |

Die Verkaufsseite für Fensterbauer ist die Hauptfläche. Dort soll ein Fensterbauer kaufen, die Hauptaussage ist der Konfigurator unter eigener Marke und Domain, nicht „Kunden messen selbst“ (.claude/skills/premium-gestaltung/SKILL.md Z. 23–25).

## 2. Methode und Grenzen

- **Kein Seitenabruf möglich.** WebFetch meldete für jede Zieladresse einen DNS-Fehler (`getaddrinfo ENOTFOUND`, z. B. clean-invoice.com, linear.app). Der direkte Abruf über den Proxy der Arbeitsumgebung wurde mit 403 abgewiesen, geprüft für clean-invoice.com, www.clean-invoice.com, linear.app, www.shopify.com, hero-software.de, www.fensterversand.com und magicplan.app. Die Netzwerkrichtlinie der Umgebung lässt diese Hosts nicht zu.
- **Grundlage sind Suchauszüge.** Alle Beobachtungen stammen aus WebSearch-Ergebnissen vom 24.10.2026, also aus Textauszügen, die die Suchmaschine aus den Seiten liefert: Wortlaut, Preise, Handlungsaufforderungen als Text, Titel der Unterseiten. In dieser Datei heißt „gesehen“ immer: im Suchauszug belegt.
- **Nicht beobachtbar** waren deshalb: das Aussehen, die Reihenfolge der Abschnitte, wo die Knöpfe stehen, ob es Videos oder Animationen gibt, das Verhalten am Telefon und alles, was nach einem Klick kommt (Testkonto, Kasse). Die Spalte „Seitenarchitektur“ beschreibt daher nur die Gliederung in Unterseiten, die sich aus den Fundstellen ergibt.
- **Der Index kann veraltet sein.** Die Suchmaschine nannte für linear.app/pricing einen Stand von etwa 514 Tagen, für die Startseite von Linear etwa 99 Tage und für craftnote.de/preise/ etwa zwei Wochen. Bei Shopify und HERO tauchten widersprüchliche Preise aus verschiedenen Ständen auf.
- **Eigenangaben.** Preise, Bewertungen, Nutzerzahlen und Fallstudien sind Angaben der Anbieter. Geprüft wurde davon nichts.
- **„Nicht gesehen“ heißt nicht „nicht vorhanden“.**
- **Empfehlung vor Phase D:** die zwölf Websites einmal im Browser sichten (Telefon 390 × 844 und Schreibtisch 1280), mit Bildschirmfotos der Preisseiten. Die Adressen stehen in den Steckbriefen.

## 3. Auswahl

| Nr. | Website | Gruppe | Warum ausgewählt |
|---|---|---|---|
| 1 | fenzon.de | 1 Konfigurator für Betriebe | Konfiguratoren für Fenster, Türen, Tore, Sonnenschutz als Abo für Betriebe, DACH |
| 2 | 123fenster.com | 1 Konfigurator für Betriebe | Konfigurator mit Shop für Fensterhersteller und -händler, DACH |
| 3 | combeenation.com | 1 Konfigurator-Plattform | 3-D-Konfiguratoren, Referenzen mit Toren, veröffentlicht „ab“-Preise, Österreich |
| 4 | clean-invoice.com/fenster-konfigurator | 1 und 3 | kostenloser Fenster-Konfigurator für Endkunden, laut Auszug auch für Betriebe zum Einbinden; inhaltlich am nächsten an eeziframes |
| 5 | hero-software.de | 2 Handwerkssoftware | drei Tarife mit öffentlichen Preisen, Test und Demo, DACH |
| 6 | plancraft.com | 2 Handwerkssoftware | drei Tarife, Rabatt nach Laufzeit, Test ohne Kreditkarte, DACH |
| 7 | craftnote.de | 2 Handwerkssoftware | drei Pakete nach Rolle (Büro, Baustelle), Test ohne Zahlungsmittel, DACH |
| 8 | fensterversand.com | 3 Endkunden | Fenster-Konfigurator mit Preis und Aufmaßanleitung samt Aufmaßblatt-PDF |
| 9 | fensterblick.de | 3 Endkunden | Preisrechner in fünf Schritten, Angebot anfordern |
| 10 | magicplan.app | 3 Aufmaß-App | Aufmaß- und Grundriss-App, Preis nach Bindungsdauer statt nach Funktionen |
| 11 | linear.app | 4 SaaS-Maßstab | gilt als Maßstab für ruhige Produkt- und Preisseiten; zwei Wege: selbst starten oder Vertrieb |
| 12 | shopify.com/pricing | 4 SaaS-Maßstab | Paketseite mit vollständiger Vergleichstabelle, Kosten neben dem Abo offen ausgewiesen |

Gefunden, aber nicht ausgewertet, um die Zahl zu begrenzen: A+W iQuote (a-w.com/software/cantor-iquote/, Händlerportal eines Fensterbau-ERP; Fallstudie BE Bauelemente mit getrennten Konfiguratoren für Endkunden und Händler, blog.a-w.com/uk/online-configurator-for-dealers-and-end-customers), STOLMA (stolma.de/konfigurator, Händlerzugang nach Registrierung), FENSTERART (fensterart.de/service/online-konfigurator, Bestellung für registrierte Kunden, Preisanfrage für Gäste).

## 4. Vergleichstabelle

### 4.1 Angebot und Abschluss

| Nr. | Website | Preise öffentlich | Paketlogik | Einstieg ohne Kauf | Handlungsaufforderungen (Wortlaut, soweit gesehen) | Abschluss |
|---|---|---|---|---|---|---|
| 1 | Fenzon | nein | Nutzerlizenzen „Fenzon Core“ im Monatsabo, Zusatzmodule (Webshop, Connect); Ersteinrichtung als bezahlte Dienstleistung | nicht gesehen | Preisanfrage, Telefonnummer | über den Vertrieb |
| 2 | 123fenster | nein | nicht gesehen | nicht gesehen | „Preise anfragen“ | über den Vertrieb |
| 3 | Combeenation | teilweise: „ab 697 €/Monat“, Beispiele 697 / 1.600 / 2.400 € plus Implementierung | Monatslizenz nach Modulen und Komplexität, Einmalkosten für die Umsetzung | unverbindliches Angebot, kostenloses Erstgespräch | nicht wörtlich gesehen | Projekt, 4 Wochen bis 6 Monate (eine andere Seite: 6 bis 12 Wochen) |
| 4 | Clean Invoice | kostenlos | keine Pakete; Konfigurator als kostenloses Werkzeug neben der Rechnungssoftware | ja, ohne Anmeldung | „Anfrage erstellen & Angebote vergleichen“ (Endkunden) | Endkunde: PDF, Link oder E-Mail-Entwurf an Fensterfirmen; Betrieb: Einbinden in die eigene Website |
| 5 | HERO | ja | HERO Select ab 69 €, HERO OS ab 119 €, HERO OS Plus ab 299 € im Monat; je Nutzer; monatlich oder jährlich; Zusatzlizenzen | 14 Tage ohne Zahlungsdaten | Demo-Termin buchen; „Termin buchen“ (15 Minuten) | Testkonto mit Name, E-Mail, Telefon, Branche |
| 6 | plancraft | ja | Business 59,90 €, Pro 109,90 €, Premium 199,90 € im Monat bei Jahreszahlung; zwei Jahre günstiger, monatlich teurer; Zusatzlizenzen | 7 Tage ohne Kreditkarte, danach eingeschränkter 0-€-Tarif | kostenlos testen; Produktvorstellung buchen (15 bis 30 Minuten) | Testkonto im Browser |
| 7 | Craftnote | ja | Büro Plus 49,90 € („statt 69,90 €“), Büro 29,90 €, Baustelle 14,90 € je Nutzer und Monat, jährliche Abrechnung | 30 Tage Büro Plus ohne Zahlungsmittel | nicht wörtlich gesehen | Testkonto; Laufzeit widersprüchlich (siehe Steckbrief) |
| 8 | fensterversand.com | ja, Preis im Konfigurator | Produktpreis je Element | Konfigurieren ohne Kauf | nicht wörtlich gesehen | Online-Bestellung (laut Seitentitel „Fenster nach Maß bestellen“) |
| 9 | fensterblick.de | ja, „ab“-Preise und Preis während der Konfiguration | Produktpreis je Element; Lieferung frei ab 10 Elementen | Konfigurieren ohne Kauf | „Jetzt Angebot für Kunststofffenster anfordern“ | Angebot über Kontakt |
| 10 | magicplan | Struktur ja, Euro-Beträge nicht gesehen | nach Bindungsdauer: Starter kostenlos (2 Projekte), PRO Flex, PRO 12, PRO 24; alle Funktionen in jedem Tarif; Mehrprojekte einzeln | ja, „No credit card required“ | „try magicplan for free“ | Konto in der App |
| 11 | Linear | ja | Free, Basic $10, Business $16 je Nutzer und Monat bei Jahreszahlung, Enterprise auf Anfrage | Free-Tarif | „Get started“ (untere Tarife), „Contact sales“ (Business, Enterprise); Startseite zusätzlich „Open app“, „Download“ | selbst starten oder Vertrieb |
| 12 | Shopify | ja | Basic, Grow, Advanced, Plus; Basic $29 bei Jahres-, $39 bei Monatszahlung | 3 Tage kostenlos, dann $1 im Monat für 3 Monate | „Start for free“ (Basic), „Try for $399“ (Plus) | Konto, dann Tarif |

### 4.2 Demonstration, Vertrauen, Entscheidungshilfe

| Nr. | Website | Seitenarchitektur (nur Unterseiten) | Produktdemonstration | Vertrauen | Interaktive Entscheidungshilfe |
|---|---|---|---|---|---|
| 1 | Fenzon | Produktseite je Konfigurator, E-Commerce-Seite, Blog mit Erfolgsgeschichten | öffentlicher Endkunden-Shop mit Konfigurator (shop.fenzon.de, Febau GmbH) | Erfolgsgeschichte kellerfensteronline (Shopify) | nicht gesehen |
| 2 | 123fenster | eine Startseite mit Funktionsliste | nicht gesehen | Server in Deutschland, „24/7 Verfügbarkeit“, zehn Jahre Branchenerfahrung | nicht gesehen |
| 3 | Combeenation | Preisseite, Kostenartikel, FAQ, Fallstudien, Branchenseiten | Fallstudien mit 3-D und AR, Doku des 3-D-Viewers | Fallstudien mit Kennzahlen (z. B. „30 % mehr Anfragen“), Referenzen wie Lehner Tore | Kostenartikel mit Spannen, Vergleich von CPQ-Werkzeugen (Blog) |
| 4 | Clean Invoice | Endkundenseite, Seite für Betriebe, Seite „Rechner einbinden“ | das Werkzeug selbst, ohne Anmeldung | „kostenlos, ohne Anmeldung, ohne Provision“; „Ihre Daten bleiben im Browser“ | der Konfigurator ist die Hilfe |
| 5 | HERO | Preisseite, Preisvideo, Gewerkseiten, Seiten „Alternativen“ gegen benannte Wettbewerber, Ratgeber | Video zur Preisgestaltung (älterer Stand), Live-Demo | Testsieger trusted (Note 1,3), Google 4,7 (275), App Store 4,4 (2.601), Google Play 3,3 (287), „41.000+ Nutzer“, Zitate aus Gewerken | Vergleich mit Wettbewerbern, Preisübersicht |
| 6 | plancraft | Preisseite je Land, Gewerkseiten, Seiten „im Vergleich“ (Excel/Word, traditionelle Lösungen) | geführte Produktvorstellung | Google 4,9 bei 709 Rezensionen (andere Stellen 600 und 608), App-Bewertungen, Zitate | Vergleich mit dem bisherigen Arbeitsweg |
| 7 | Craftnote | zwei Preisseiten (/preise/, /pakete/), Gewerkseiten, Funktionsseiten | nicht gesehen | „Mehr als 6000+ Bewertungen“, Zitate | nicht gesehen |
| 8 | fensterversand.com | Konfigurator, Anleitungen, Montagepartner, Referenzen | Aufmaßanleitung mit Videos und Aufmaßblatt-PDF | etwa 4,7 von 5 mit wechselnder Anzahl (13.200, 13.500, 5.205) | Live-Preis, Aufmaßformeln für Alt- und Neubau |
| 9 | fensterblick.de | viele Seiten zu Preis und Konfigurator (Preise, Kosten, Kalkulator, Preisrechner) | nicht gesehen | Hinweis auf fachkundige Mitarbeiter; Bewertungen nicht gesehen | Preisrechner „in nur 5 Schritten“ mit laufendem Preis |
| 10 | magicplan | Preisseite, Funktionsseite, Branchenseiten, Hilfecenter | LiDAR-Scan, Bluetooth-Laser (Funktionsangaben) | „trusted by restoration teams“, App-Store-Bewertungen als Zitate | nicht gesehen |
| 11 | Linear | Preisseite, Kundengeschichten, Enterprise, Startups, Abrechnungs-Doku | nicht beobachtbar | „over 40,000 product teams“, eigene Kundenseite | Vergleich der Tarife; Abrechnungsfragen in der Doku |
| 12 | Shopify | Preisseite, Plus-Preise, Kassen-Preise, Hilfecenter | nicht beobachtbar | nicht gesehen | vollständige Funktionstabelle; Gebühren je Tarif; FAQ im Hilfecenter (vergleichen, wechseln, pausieren) |

## 5. Steckbriefe

Abrufdatum aller Auszüge: 24.10.2026. Keine Seite war direkt abrufbar (Abschnitt 2).

### 5.1 Fenzon (Gruppe 1)

Adressen: https://fenzon.de/, https://fenzon.de/core/fenster-konfigurator, https://fenzon.de/blog/kellerfensteronline-integriert-fenster-konfigurator-in-shopify, https://shop.fenzon.de/

Beobachtung
- Konfiguratoren für Fenster, Haustür, Innentür, Garagentor, Sonnenschutz, Insektenschutz und Fensterbank, je mit eigener Seite; sie rechnen Preise und erzeugen Grafiken für Angebote.
- Cloud, „jederzeit und von jedem Ort“. Abo je Nutzerlizenz, dazu Module wie Webshop und Connect. Kosten nur auf Anfrage: „rufen Sie uns einfach unter … an oder senden Sie uns eine Preisanfrage“. Ersteinrichtung, komplexe Produkte und Preislisten als bezahlte Dienstleistung.
- Erfolgsgeschichte: ein Händler bindet den Konfigurator über ein SDK in seinen Shopify-Shop ein; Prüfung der Baubarkeit, Grafik, Übergabe in den Warenkorb.
- Ein öffentlicher Endkunden-Shop mit Konfigurator läuft unter shop.fenzon.de.

Bewertung
- Das Angebot ist eine Kalkulations- und Shop-Software. Sie setzt hinterlegte Produkte und Preislisten voraus; Kauf über den Vertrieb.
- Der Fall aus der Praxis ist der stärkste Beleg auf der Seite. Er verkauft über den Nutzen eines Kollegen, nicht über Funktionen.

### 5.2 123fenster (Gruppe 1)

Adresse: https://123fenster.com/

Beobachtung
- „Fensterkonfigurator und Online Shop Software“ für Hersteller und Händler. Genannt werden Konfigurator-Management, Baustoff-Online-Shop, Rechnungs- und Bezahlsysteme, Logistikplanung.
- Einrichtung in Schritten beschrieben: eigene Bezeichnungen hinterlegen, Preise eintragen „oder einfach anhand Ihrer Marge berechnen“.
- „Verkaufsoptimiertes Shopsystem dank Künstlicher Intelligenz“, automatische Preisanpassung. „Cloud Server in Deutschland, 24/7 Verfügbarkeit“, zehn Jahre Branchenerfahrung.
- Preise nur über „Preise anfragen“. Referenzen, Demo oder Test nicht gesehen.

Bewertung
- Der Ablauf in wenigen Schritten macht den Aufwand greifbar. Ohne Preis, Demo und Referenz bleibt die Seite aber eine Behauptung.
- Die KI-Aussage hat keinen sichtbaren Beleg. Das ist ein Muster, das eeziframes nicht übernehmen sollte (Abschnitt 8).

### 5.3 Combeenation (Gruppe 1, Plattform)

Adressen: https://www.combeenation.com/en/pricing/, https://www.combeenation.com/blog/details/was-kostet-ein-produktkonfigurator/, https://www.combeenation.com/en/case-studies/, https://www.combeenation.com/en/cpq-implementation/

Beobachtung
- Preisseite mit Einstiegspreis im Titel („CPQ Pricing & Costs Starting at €697/Month“), Beispiele 697 €, 1.600 € und 2.400 € im Monat je nach Komplexität, jeweils zuzüglich Implementierung. Implementierung etwa 10.000 € für einen einfachen Konfigurator, die meisten Projekte zwischen 30.000 und 60.000 €.
- Ein Blogartikel erklärt, wovon die Kosten abhängen, mit Spannen für Plattform und Eigenbau.
- Unverbindliches Angebot und kostenloses Erstgespräch. Dauer der Umsetzung: 4 Wochen bis 6 Monate; ein Vergleichsartikel nennt für einfache Projekte 6 bis 12 Wochen.
- Fallstudien nach Branchen, mit Kennzahlen (z. B. Leuchten: „30 % mehr Anfragen“; Hallenbüros: „30 % mehr Anfragen und 50 % schnellere Angebotserstellung“), mit 3-D und AR. Unter den Referenzen sind Tor-Hersteller; Fenster wurden nicht genannt.
- Händler als eigene Rolle: Auswahl, Preise und Marke je Händler.

Bewertung
- Vorbildlich: Eine teure, erklärungsbedürftige Leistung nennt trotzdem einen Einstiegspreis und erklärt die Kostentreiber. Das nimmt Unsicherheit, bevor jemand Kontakt aufnimmt.
- Die Fallstudien verbinden Produktbild und Ergebnis. Das Prinzip ist übertragbar, sobald eeziframes echte Betriebe hat; vorher nicht.
- Die Größenordnung (mindestens 697 € im Monat plus fünfstellige Umsetzung) zeigt, wo individuelle Konfiguratoren preislich liegen.

### 5.4 Clean Invoice, Fenster-Konfigurator (Gruppe 1 und 3)

Adressen: https://www.clean-invoice.com/fenster-konfigurator, https://www.clean-invoice.com/fenster-konfigurator/betriebe, https://www.clean-invoice.com/rechner-einbinden/fenster-konfigurator

Beobachtung
- Endkundenseite: „Fenster-Konfigurator: Anfrage erstellen & Angebote vergleichen“. Kostenlos, ohne Anmeldung, „Ihre Daten bleiben im Browser“. Bedienung über eine Skizze: Element wählen, Maße an der Skizze anklicken, Teilung, Farben, Glas. Mehrere Positionen ergeben eine Anfrage. Weitergabe als PDF, Link oder E-Mail-Entwurf an „Fensterfirmen der Wahl“; weil jede Firma dieselbe Spezifikation bekommt, „werden die Angebote wirklich vergleichbar“.
- Seite für Betriebe, nur aus einem einzigen Suchauszug: Einbinden in die eigene Website statt „Kontaktformular mit Freitextfeld“, Besucher konfigurieren „mit fotorealer Skizze“, Anfrage mit PDF und Skizzen an die E-Mail des Betriebs. „Kostenlos, ohne Anmeldung, ohne Provision. Das Widget zeigt bewusst keine Preise — die Kalkulation bleibt bei Ihnen.“
- Anbieter ist eine Rechnungssoftware für Handwerksbetriebe. Ein anderes kostenloses Werkzeug desselben Anbieters (E-Rechnung-Viewer) wird als iframe-Widget zum Einbinden angeboten.

Bewertung
- Inhaltlich der nächste Vergleich: Anfrage als PDF statt Freitext, keine Preise im Konfigurator, Anfrage per E-Mail an den Betrieb. Das sind dieselben Versprechen wie bei eeziframes (web/fuer-fensterbauer/index.html Z. 209), hier kostenlos und als Mittel, um Kunden für die Rechnungssoftware zu gewinnen.
- Der Endkundenweg „Angebote vergleichen“ schickt dieselbe Anfrage an mehrere Firmen. Für einen Fensterbauer ist das das Gegenteil von „Ihre Kunden bleiben Ihre Kunden“ (web/fuer-fensterbauer/index.html Z. 159–166).
- Ob es eine eigene Domain, eine eigene Marke, Fotos, 3-D oder eine Auswertung gibt, war nicht zu sehen. Diese Seite sollte als erste im Browser gesichtet werden.

### 5.5 HERO (Gruppe 2)

Adressen: https://hero-software.de/preise, https://hero-software.de/videos/preisgestaltung, https://hero-software.de/ueber-uns/auszeichnungen-mitgliedschaften/trusted-testsieger, https://hero-software.de/alternativen/streit, https://hero-software.de/ai

Beobachtung
- Drei Tarife: HERO Select ab 69 €, HERO OS ab 119 € (zweite Stufe 135 €), HERO OS Plus ab 299 € im Monat, je Nutzer, monatlich oder jährlich. Zusatzlizenzen 69 € bzw. 79 € je Standardnutzer, 22 € bzw. 25 € je App-Nutzer.
- 14 Tage kostenlos testen ohne Zahlungsdaten; Testkonto mit Name, E-Mail, Telefon und Branche. Daneben Demo-Termin und ein kostenloser 15-Minuten-Termin („Termin buchen“).
- Ein Video zu den Preisen zeigt einen älteren Stand mit anderen Paketnamen („Free“, „Starter“, „Pro“).
- Vertrauen: Testsieger beim Vergleichsportal trusted (Note 1,3, neun Programme verglichen); Bewertungen Google 4,7 (275), App Store 4,4 (2.601), Google Play 3,3 (287); „41.000+ Nutzer“; Zitate von Meistern aus verschiedenen Gewerken.
- Unterseiten je Gewerk (SHK, Gerüstbau) und Vergleichsseiten gegen benannte Wettbewerber (WinWorker, STREIT).

Bewertung
- Zwei gleichwertige Einstiege, selbst testen oder kurz begleitet: Das senkt die Hürde für beide Typen von Betriebsinhabern.
- Die Bewertung im Play Store (3,3) steht offen neben den besseren Werten. Das wirkt ehrlicher als eine ausgewählte Bestnote.
- Ein veraltetes Preisvideo neben einer neuen Preisseite widerspricht sich. Inhalte mit Preisen brauchen eine einzige Quelle; eeziframes hat sie mit `pakete.js` (docs/BESTELLUNG.md Z. 9).

### 5.6 plancraft (Gruppe 2)

Adressen: https://plancraft.com/de-de/preise, https://plancraft.com/de-de, https://plancraft.com/de-de/word-excel-vs-plancraft, https://plancraft.com/de-de/gewerke/maler-software

Beobachtung
- Drei Tarife bei Jahreszahlung: Business 59,90 €, Pro 109,90 €, Premium 199,90 € im Monat, zzgl. USt. Bei zwei Jahren günstiger (Business 47,92 €), bei monatlicher Zahlung teurer (Pro 139,90 €, Premium 249,90 €). Premium mit persönlichem Ansprechpartner und individuellem Einrichtungstermin.
- 7 Tage kostenlos, ohne Kreditkarte, direkt im Browser „ohne Installation“. Danach ein kostenloser, eingeschränkter Tarif. Alternativ eine Produktvorstellung von 15 bis 30 Minuten mit einem Mitarbeiter.
- Startseite: Google 4,9 bei 709 Rezensionen; strukturierte Daten nennen 600 bzw. 608; App-Bewertungen je Seite verschieden.
- Vergleichsseiten mit dem bisherigen Arbeitsweg („Excel/Word vs. plancraft“, „Traditionelle Lösungen vs. plancraft“). Gewerkseiten mit Nutzenversprechen im Titel („8 Std. weniger Büro pro Woche“).

Bewertung
- Der Vergleich mit dem Status quo statt mit Wettbewerbern passt zu eeziframes: Der Gegner ist das Kontaktformular mit Freitext und der Termin vor Ort, nicht ein anderer Anbieter.
- Die höchste Stufe verkauft persönliche Betreuung bei der Einrichtung. Das ist ein greifbarer Grund für ein höheres Paket.
- Abweichende Bewertungszahlen auf verschiedenen Seiten schwächen das Vertrauen, das sie aufbauen sollen.

### 5.7 Craftnote (Gruppe 2)

Adressen: https://craftnote.de/preise/, https://craftnote.de/pakete/, https://craftnote.de/, https://craftnote.de/buero-plus/

Beobachtung
- Pakete nach Rolle: Büro Plus 49,90 € („statt 69,90 €“), Büro 29,90 €, Baustelle 14,90 € je Nutzer und Monat, zzgl. MwSt., jährliche Abrechnung.
- Die Preisseite wirbt mit „Monatlich kündbar“. Die Paketseite nennt eine automatische Verlängerung um ein Jahr bei drei Monaten Kündigungsfrist.
- 30 Tage Büro Plus testen, ohne Zahlungsmethode. „Mehr als 6000+ Bewertungen“ auf der Startseite. Zitate von Betrieben.
- Zwei Preisseiten nebeneinander (/preise/ und /pakete/).

Bewertung
- Pakete nach Rolle (Büro, Baustelle) sind leicht zu verstehen. Bei eeziframes entspricht dem eher die Frage „Wie sehr soll es nach Ihrem Betrieb aussehen?“ als eine Rolle.
- Durchgestrichener Preis und sich widersprechende Laufzeiten sind Muster, die eeziframes meiden sollte (Abschnitt 8).

### 5.8 fensterversand.com (Gruppe 3)

Adressen: https://www.fensterversand.com/info/anleitungen/fensterkonfigurator.php, https://www.fensterversand.com/info/anleitungen/fenster/ausmessen.php, https://www.fensterversand.com/fileadmin/pdf/aufmassblatt-fensterversand.pdf, https://www.fensterversand.com/referenzen-fenster-shop.php, https://www.fensterversand.com/fenstermonteure.php

Beobachtung
- Konfigurator: Material, Profil, Verglasung, Griff; der Preis ist „direkt und transparent“ sichtbar. Maße auf den Millimeter; bei mehrflügeligen Fenstern wird die Gesamtbreite gleichmäßig aufgeteilt, wenn keine Einzelmaße angegeben sind.
- Aufmaß: kostenloses Aufmaßblatt als PDF mit Formeln für Alt- und Neubau; eine Anleitung Schritt für Schritt mit Videos; Rat, vor dem Messen eine Skizze zu machen und die Griffseite zu notieren.
- Vermittlung von Montagebetrieben auf einer eigenen Seite.
- Bewertung etwa 4,7 von 5, die Anzahl wechselt je Seite (rund 13.200, 13.500, 5.205 mit 4,76). Eine Referenzseite mit Kundenstimmen.

Bewertung
- Das Aufmaß ist hier ein Papierprozess neben dem Konfigurator: PDF ausdrucken, Video ansehen, Formel anwenden. eeziframes führt das Messen in der App (README.md Z. 3). Für Endkunden zeigt das, wie groß die Hürde ohne Führung ist.
- Der Shop verkauft an Endkunden am Fachbetrieb vorbei; die Montage wird nachträglich vermittelt. Für Fensterbauer ist das das Wettbewerbsumfeld, aus dem Kunden mit Preisvorstellungen kommen.

### 5.9 fensterblick.de (Gruppe 3)

Adressen: https://www.fensterblick.de/, https://www.fensterblick.de/fensterpreisrechner.html, https://www.fensterblick.de/fenster-kosten.html, https://www.fensterblick.de/konfigurator.html

Beobachtung
- Preisrechner „ganz einfach in nur 5 Schritten“; der Preis wird „während der Konfiguration stetig“ neu berechnet.
- „ab“-Preise je Material; die Werte unterscheiden sich je Seite (Kunststoff 47,74 € gegenüber 53,55 €).
- Knopf „Jetzt Angebot für Kunststofffenster anfordern“. Lieferung frei ab 10 Elementen; Einbau nicht im Preis.
- Viele Seiten zu fast demselben Thema (Fenster-Preise, Fenster-Kosten, Fensterkalkulator, Fensterpreisrechner). Bewertungen nicht gesehen.

Bewertung
- Die Zahl der Schritte vorab zu nennen, nimmt die Angst vor einem langen Formular. Das Prinzip passt auf den Konfigurator und auf die Bestellung (sechs Schritte, docs/BESTELLUNG.md Z. 19).
- Viele fast gleiche Seiten mit verschiedenen Preisen sind Suchmaschinenfutter und schaden der Glaubwürdigkeit.

### 5.10 magicplan (Gruppe 3)

Adressen: https://magicplan.app/pricing, https://help.magicplan.app/magicplan-pro-subscriptions, https://help.magicplan.app/using-magicplan-for-free, https://magicplan.app/blog/lidar

Beobachtung
- „Pricing is based on commitment length, not locking features behind plans“; „all features are included, no matter the plan“.
- Starter kostenlos mit zwei Projekten. PRO Flex monatlich (mindestens 10 Projekte im Monat), PRO 12 und PRO 24. Mehrprojekte werden einzeln berechnet (40 $ je Projekt, laut älterer Seite). Unbegrenzt viele Teammitglieder in PRO.
- „try magicplan for free. No credit card required.“
- Überschrift „trusted by restoration teams“; als Belege App-Store-Bewertungen. LiDAR-Scan auf iOS-Pro-Geräten, Bluetooth-Laser.
- Euro-Preise waren nicht zu sehen.

Bewertung
- Mit „alle Funktionen in jedem Tarif“ entfällt die Funktionstabelle als Entscheidungshilfe. Für eeziframes trifft das teilweise zu: Der volle Konfigurator ist in allen drei Paketen gleich (web/assets/pakete.js Z. 75); die Pakete unterscheiden sich nur in Marke, Sichtbarkeit und Dashboard. Diese Aussage lässt sich übernehmen.
- Abrechnung nach Projekt und Überschreitungsgebühren sind für Betriebe schwer zu planen.

### 5.11 Linear (Gruppe 4)

Adressen: https://linear.app/pricing, https://linear.app/, https://linear.app/docs/billing-and-plans, https://linear.app/contact/sales

Beobachtung (Stand des Suchindex: Preisseite etwa 514 Tage, Startseite etwa 99 Tage alt)
- Vier Tarife: Free (0 $, 250 Issues), Basic (10 $), Business (16 $) je Nutzer und Monat bei Jahreszahlung, Enterprise auf Anfrage, nur jährlich.
- Untere Tarife mit „Get started“, Business und Enterprise mit „Contact sales“. Startseite: „Get started“, „Contact sales“, „Open app“, „Download“, Verweis auf „Customer stories“; „over 40,000 product teams“.
- Abrechnungsfragen stehen in der Dokumentation: Abrechnung nach aktiven Nutzern, Nachberechnung im Jahr, Rabatte für gemeinnützige Organisationen (75 %) und Startups.
- Nutzungsabhängige KI-Funktionen laufen über ein Guthaben; wer nichts auflädt, „will never be charged for them“.

Bewertung
- Die Handlungsaufforderung richtet sich nach dem Tarif: Selbstbedienung unten, Gespräch oben. Für eeziframes heißt das: Essential und Plus direkt bestellen, Signature mit Rückruf als gleichwertige Alternative. Der Rückruf ist im Ablauf ohnehin vorgesehen (docs/BESTELLUNG.md Z. 25).
- Der ausdrückliche Satz, was nie berechnet wird, nimmt Kostenangst. eeziframes hat einen solchen Satz („0 € Gebühr je Anfrage“, web/fuer-fensterbauer/index.html Z. 70).

### 5.12 Shopify (Gruppe 4)

Adressen: https://www.shopify.com/pricing, https://www.shopify.com/plus/pricing, https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans

Beobachtung
- Basic, Grow, Advanced, Plus; Basic 29 $ bei Jahres- und 39 $ bei Monatszahlung (etwa 25 % Nachlass). Grow und Advanced mit widersprüchlichen Beträgen je Seitenstand (79 $ oder 89 $; 299 $ oder 359 $).
- Einstieg: „Try 3 days free, then $1/month for 3 months“, Basic mit „Start for free“; Plus mit „Try for $399“ und ab 2.300 $ im Monat bei drei Jahren.
- Vollständige Funktionstabelle aller Tarife. Kartengebühren je Tarif offen ausgewiesen (2,9 %, 2,7 %, 2,5 % plus 30 ¢).
- FAQ zu Vergleichen, Wechseln und Pausieren im Hilfecenter. Die deutsche Preisseite wurde nicht gefunden.

Bewertung
- Alle Kostenbestandteile neben dem Abo stehen auf der Preisseite. Für eeziframes entspricht das der Einrichtungsgebühr neben dem Monatspreis und den Richtwerten für Anfragen und KI-Auswertungen (web/assets/pakete.js Z. 97–98). Beides gehört sichtbar an die Pakete.
- „Pausieren, ohne etwas zu verlieren“ als Antwort auf eine Kaufangst. Ob eeziframes eine Pause vorsieht, die der Betrieb selbst auslösen kann, steht nicht im Repository; es gibt `pausiert` nur als Folge offener Zahlung oder durch den Inhaber (docs/BESTELLUNG.md Z. 30, 40).

## 6. Muster, die wiederkehren

Aus den Beobachtungen abgeleitete Prinzipien, nicht Gestaltung zum Nachbauen.

1. **Zwei Lager bei den Preisen.** Handwerkssoftware und SaaS-Maßstäbe zeigen Preise offen, in drei bis vier Stufen (HERO, plancraft, Craftnote, Linear, Shopify). Konfigurator-Anbieter für Betriebe verbergen sie hinter „Preise anfragen“ (123fenster, Fenzon). Combeenation liegt dazwischen: Einstiegspreis plus erklärte Kostentreiber.
2. **Der Einstieg kostet nichts und verlangt kein Zahlungsmittel.** 7, 14 oder 30 Tage Test ohne Kreditkarte (plancraft, HERO, Craftnote), Gratisstufe (magicplan, Linear), symbolischer Einstiegspreis (Shopify). Daneben fast immer ein kurzer begleiteter Termin (15 bis 30 Minuten bei HERO und plancraft).
3. **Die Handlungsaufforderung richtet sich nach der Stufe.** Selbst starten bei kleinen Tarifen, Gespräch bei großen (Linear). Combeenation verkauft nur über das Gespräch, weil jedes Projekt anders ist.
4. **Rabatt für Bindung.** Jahres- oder Zweijahreszahlung günstiger (plancraft, HERO, Shopify, Craftnote); magicplan macht die Bindungsdauer zur einzigen Unterscheidung.
5. **Vertrauen über Zahlen und Dritte.** Bewertungen mit Anzahl (Google, App Stores), Testsiegel eines Vergleichsportals, Nutzerzahlen, Zitate mit Gewerk, Fallstudien mit Kennzahlen. Mehrfach widersprechen sich die Zahlen zwischen Seiten desselben Anbieters (plancraft, fensterversand.com, Craftnote).
6. **Seiten je Gewerk und Vergleichsseiten.** Handwerkssoftware spricht Gewerke einzeln an und vergleicht sich mit Wettbewerbern (HERO) oder mit dem bisherigen Arbeitsweg (plancraft).
7. **Endkunden-Konfiguratoren rechnen mit.** Preis bei jedem Schritt, Zahl der Schritte vorab genannt, „ab“-Preise je Material, danach „Angebot anfordern“ (fensterblick.de, fensterversand.com).
8. **Das Aufmaß ist bei Endkunden-Shops ein Dokument.** PDF-Aufmaßblatt, Formeln, Video (fensterversand.com). Eine geführte Aufmaß-App mit Fotos war in den Fundstellen nicht zu sehen.
9. **Konfiguratoren für Betriebe sind Shop- und Kalkulationssysteme.** Sie brauchen hinterlegte Produkte, Preise und Margen und eine Einrichtung als Dienstleistung (Fenzon, 123fenster, Combeenation, A+W).
10. **Der Beleg aus der Praxis schlägt die Funktionsliste.** Fenzon und Combeenation führen mit Fällen echter Kunden; 123fenster ohne Fall bleibt bei Behauptungen.

## 7. Lücken, die eeziframes besetzen könnte (Hypothesen)

Jede Hypothese ist ungeprüft. Sie beruht auf Suchauszügen; wo ein Wettbewerber etwas „nicht“ bietet, heißt das nur: nicht gesehen.

| Nr. | Hypothese | Grundlage im Repository | Grundlage in der Recherche | Prüfen durch |
|---|---|---|---|---|
| H1 | **Festpreis statt Preisanfrage.** Unter den Konfiguratoren für Fensterbetriebe wäre eeziframes der einzige mit öffentlichem Monats- und Einrichtungspreis im zweistelligen bzw. niedrigen dreistelligen Bereich. | pakete.js Z. 44, 52, 60 | 123fenster und Fenzon nur auf Anfrage; Combeenation ab 697 € im Monat plus Umsetzung | Sichtung der Seiten; Gespräche mit Fensterbauern |
| H2 | **Anfrage statt Shop.** Die anderen Lösungen setzen Preislisten und Kalkulation voraus. eeziframes liefert ohne Preise eine geklärte Anfrage mit Fotos, Maßen, 3-D-Modell und Klärungsliste. Das passt zu Betrieben, die keine Online-Preise zeigen wollen oder können. | README.md Z. 3; index.html Z. 209 | Fenzon (Preislisten, Einrichtung als Dienstleistung), 123fenster (Marge), Combeenation (Regelwerk, Projekt) | Fensterbauer fragen, ob sie Preise online zeigen würden |
| H3 | **Fertig in Tagen statt Monaten.** Bestellung bis Live in sechs sichtbaren Schritten, meist 3 bis 5 Werktage, mit Vorschau und Freigabe durch den Betrieb. | BESTELLUNG.md Z. 19–30 | Combeenation 4 Wochen bis 6 Monate; bei Fenzon und 123fenster keine Dauer gesehen | erste echte Einrichtungen messen |
| H4 | **Die Kunden bleiben beim Betrieb.** Zusage in den Paketbedingungen: nur der Name des Betriebs, nur an bestätigte Adressen, kein Weiterverkauf. | index.html Z. 159–166 | Clean Invoice wirbt bei Endkunden mit „Angebote vergleichen“ und schickt dieselbe Anfrage an mehrere Firmen | Sichtung Clean Invoice; Paketbedingungen nach anwaltlicher Prüfung (BESTELLUNG.md Z. 63) |
| H5 | **Das Produkt selbst als Demonstration.** Den Konfigurator kann man ohne Konto ausprobieren; bei den Konfiguratoren für Betriebe war außer dem Endkunden-Shop von Fenzon keine frei zugängliche Demo zu sehen. | index.html Z. 209–210 | Fenzon (Shop eines Kunden), 123fenster und Combeenation ohne gesehene Demo | Sichtung; Nutzung von `/app/` aus der Verkaufsseite messen (eigene Statistik, README.md Z. 5) |
| H6 | **Geführtes Aufmaß statt Aufmaßblatt zum Ausdrucken.** Endkunden-Shops geben PDF, Formeln und Video an die Hand; eeziframes führt Schritt für Schritt mit Fotos und KI-Auswertung. Für den Fensterbauer heißt das: weniger Rückfragen. | README.md Z. 3; docs/KI.md | fensterversand.com (Aufmaßblatt-PDF, Formeln, Video) | Vergleich echter Anfragen mit und ohne App, sobald es Betriebe gibt |
| H7 | **Risiko ohne Testphase senken.** Handwerkssoftware setzt den Standard „kostenlos testen ohne Zahlungsmittel“. eeziframes hat keine Testphase, aber Vorschau-Link und Freigabe vor dem Livegang, das Monatsabo erst ab Live und Storno mit voller Erstattung bis zum Beginn der Einrichtung. Diese drei Punkte könnten die Testphase im Verkauf ersetzen, wenn sie früh und deutlich stehen. | BESTELLUNG.md Z. 27, 39, 44 | HERO, plancraft, Craftnote, magicplan, Linear, Shopify | Inhaber entscheidet, ob eine Testphase gewollt ist (offene Frage) |
| H8 | **Gleicher Kern, Pakete nur nach Marke.** Wie bei magicplan („alle Funktionen in jedem Tarif“): Der volle Konfigurator steckt in allen drei Paketen; das höhere Paket kauft Markenwirkung, Sichtbarkeit und Dashboard. Das ist einfacher zu erklären als Funktionsstufen. | pakete.js Z. 44–65, 75 | magicplan; Gegenbeispiel Funktionsstufen bei HERO, plancraft | Verständlichkeitstest mit Fensterbauern |

## 8. Was wir bewusst nicht übernehmen sollten

| Muster | Gesehen bei | Warum nicht |
|---|---|---|
| Bewertungen, Testsiegel, Nutzerzahlen, Kundenzitate ohne echte Grundlage | HERO, plancraft, Craftnote, fensterversand.com, Linear | eeziframes ist in der Pilotphase (README.md Z. 5). Der Inhaber verlangt: keine erfundenen Belege, Kundenzahlen, Bewertungen, Siegel oder Testimonials (SKILL.md Z. 49). Wo es Zahlen gibt, nur eine Quelle je Zahl, damit sie sich nicht widersprechen wie bei plancraft oder fensterversand.com. |
| „Preise anfragen“ | 123fenster, Fenzon | widerspricht „Pakete sichtbar machen“ (SKILL.md Z. 50) und verschenkt H1. |
| Durchgestrichene Preise, „statt … nun …“ | Craftnote | wirkt nach Ausverkauf und passt nicht zu „fein, nicht laut“ (SKILL.md Z. 48). Offene Frage dazu: Einführungspreis des Aufmaßblatts (README.md Z. 3). |
| Laufzeit, die auf zwei Seiten verschieden steht | Craftnote | Vertrauensbruch an der heikelsten Stelle. Laufzeit und Kündigung nur aus den Paketbedingungen ableiten. |
| Live-Preis im Konfigurator | fensterblick.de, fensterversand.com | Der Konfigurator unter der Domain des Betriebs zeigt bewusst keine Preise (index.html Z. 209); die Kalkulation bleibt beim Betrieb. |
| Preis je Nutzer, Zusatzlizenzen, Gebühren je Projekt | HERO, plancraft, Craftnote, magicplan | Die Pakete von eeziframes sind Festpreise je Betrieb mit „0 € Gebühr je Anfrage“ (index.html Z. 70). Diese Einfachheit ist ein Vorteil; nicht verwässern. |
| Lockpreis-Testphasen („$1 für 3 Monate“) | Shopify | Jede Instanz wird von Hand eingerichtet (BESTELLUNG.md Z. 25–28); ein Lockpreis passt weder zum Aufwand noch zum Anspruch. |
| Viele fast gleiche Seiten für Suchmaschinen | fensterblick.de | Verkaufsflächen sollen nicht wie Ratgeber wirken (SKILL.md Z. 29–30). Ratgeber gibt es bei eeziframes getrennt unter `/ratgeber/` (README.md Z. 15). |
| Vergleichsseiten gegen namentlich genannte Wettbewerber | HERO | Für einen jungen Anbieter ohne Belege angreifbar. Der Vergleich mit dem bisherigen Arbeitsweg (Kontaktformular, Termin vor Ort) trägt dasselbe Argument ohne fremde Namen. |
| KI als Versprechen ohne sichtbaren Beleg | 123fenster | KI nur dort nennen, wo sie im Produkt zu sehen ist (Auswertung der Fotos, docs/KI.md). |
| Sprechen über Funktionen statt über den Betrieb | 123fenster (Funktionsliste) | Der Inhaber will Bild statt Text und kurze Abschnitte (SKILL.md Z. 29). |

## 9. Offene Fragen

1. **Clean Invoice:** Wie weit reicht der kostenlose Fenster-Konfigurator für Betriebe (eigene Domain, Marke, Fotos, Auswertung)? Die Seite war nicht abrufbar und ist nur aus einem Suchauszug bekannt. Wie stellt sich eeziframes gegen ein kostenloses Angebot mit ähnlichen Versprechen (Anfrage als PDF, keine Preise)?
2. **Eigene Domain bei Wettbewerbern:** Ob ein anderer Anbieter den Konfigurator unter der Domain des Betriebs betreibt, war in keiner Fundstelle zu sehen. Zu prüfen, bevor „eigene Domain“ als Alleinstellung auf die Seite kommt.
3. **„0 Zeilen Code auf Ihrer Website“** (web/fuer-fensterbauer/index.html Z. 70) und der Knopf „Fenster planen“ als HTML-Schnipsel für die Website des Betriebs (docs/BESTELLUNG.md Z. 28): Ist der Schnipsel freiwillig, und soll die Seite das so sagen?
4. **Testphase:** Will der Inhaber eine Testphase oder eine Probezeit anbieten, oder sollen Vorschau, Abo erst ab Live und Storno bis zur Einrichtung diese Rolle übernehmen (H7)?
5. **Pause durch den Betrieb:** Im Repository gibt es `pausiert` nur nach offener Zahlung oder durch den Inhaber (docs/BESTELLUNG.md Z. 30, 40). Soll ein Betrieb selbst pausieren können, etwa in der Hauptsaison?
6. **Aktualität:** Der Suchindex war teils veraltet (Linear etwa 514 Tage); Preise bei Shopify und HERO widersprachen sich. Alle Zahlen dieser Datei vor einer Verwendung im Browser bestätigen.
7. **Netzwerkzugang:** Für eine echte Sichtung muss die Umgebung die genannten Hosts zulassen (Abschnitt 2), oder die Sichtung geschieht von Hand im Browser.

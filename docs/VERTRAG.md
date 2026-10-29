# Vertrag mit dem Fensterbauer: Schutz des Anbieters (Stand 27.10.2026)

Gilt für die [Paketbedingungen mit Anlage AV-Vertrag](../web/konfigurator-bedingungen/index.html) (PDFs daneben, erzeugt mit `node scripts/bedingungen-pdf.mjs`). Das hier ist eine Prüfung ohne Anwalt: eigene Analyse plus eine Gegenprüfung aus Sicht eines Anwalts des Fensterbauers (getrennter Agent, simuliert). Sie ersetzt die anwaltliche Prüfung nicht. Solange der Platzhalter „[Freigabe der Fassung durch die Anwältin folgt]“ im Text steht, bleibt die Kasse der Pakete zu (`functions/api/recht.js`, `paketVerkaufStand`).

## Ziele des Inhabers (27.10.2026)

- So wenig angreifbar wie möglich: keine Schlupflöcher, über die der Fensterbauer klagen, Zahlungen zurückhalten oder sich herauswinden kann.
- Bei Nichtzahlung alles in der Hand: sperren, pausieren, kündigen, auch technisch vom Server aus.
- Nur technischer Dienstleister: für Inhalte, Angebote und Rechtspflichten der Seite ist der Fensterbauer verantwortlich, alles läuft über sein Impressum.

Grundsatz dabei: Im AGB-Recht fällt eine Klausel, die zu weit geht, ganz weg (keine geltungserhaltende Reduktion, § 306 BGB); dann gilt das Gesetz, und das ist für den Anbieter fast immer schlechter. Deshalb ist jede Klausel so gefasst, dass sie im Geschäftsverkehr halten sollte, nicht so scharf wie denkbar.

## Was jetzt drinsteht

| Thema | Wo | Kern |
| --- | --- | --- |
| Rolle | Kurz gesagt, § 2 Abs. 5, § 14, § 13 Abs. 3 | Fensterbauer ist Anbieter (§ 5 DDG, Impressum), macht sich freigegebene Inhalte zu eigen, keine Rechtsprüfung durch uns, Freistellung bei Verschulden, Verträge über Fenster nur zwischen ihm und seinem Kunden. Technisch schon so: Impressum und Datenschutzerklärung jedes Konfigurators nennen den Betrieb (`functions/instanz/recht.js`). |
| KI und Aufmaßblatt | § 2 Abs. 4, § 12 Abs. 3 | Leistungsbeschreibung: KI-Befund ist eine automatische, unverbindliche Einschätzung, Aufmaßblatt eine Planungsgrundlage, keine Grundlage für Kalkulation oder Fertigung. |
| Zahlung | § 3 Abs. 2, § 4 Abs. 6, 7 | Rücklastschrift lässt den Vertrag bestehen; Verzugszinsen und 40-€-Pauschale (§ 288 BGB), Kosten der Rücklastschrift; Aufrechnung nur unbestritten, rechtskräftig oder wegen Mängeln. |
| Nichtzahlung | § 7 Abs. 4, 5, § 8 | Fristlose Kündigung bei zwei Monatsbeiträgen Verzug, Pause nach 14 Tagen, Ende nach 60 Tagen Pause, Beitrag läuft in der Pause weiter, Sperrrecht bei Rechtsverletzung oder Gefahr. Technisch umgesetzt, siehe [BESTELLUNG.md](BESTELLUNG.md), „Nichtzahlung“. |
| Einrichtung | § 5 Abs. 1, 3, 5, 6, § 7 Abs. 2 | Vorschau in der Regel in 5, spätestens 20 Werktagen nach vollständiger Mitwirkung; Freigabe = Abnahme und Bestätigung aller Sachaussagen; zwei Änderungsrunden; Freigabe gilt nach Erinnerung und 14 Tagen Schweigen; keine Erstattung nach Arbeitsbeginn, außer wir setzen den Grund oder kündigen selbst im ersten Jahr (dann anteilig). |
| Haftung | § 12 | Leichte Fahrlässigkeit nur bei wesentlichen Pflichten, höchstens 5.000 € je Fall und 10.000 € je Vertragsjahr; keine Garantiehaftung für anfängliche Mängel (§ 536a Abs. 1 Alt. 1 BGB); Minderung nicht durch Abzug; Datenverlust nur Wiederherstellungsaufwand; Verjährung ein Jahr. Unbeschränkt nur, wo das Gesetz es zwingend verlangt (Vorsatz, grobe Fahrlässigkeit, Leben und Körper, Produkthaftung). |
| Verfügbarkeit | § 11 | 98 % im Jahresmittel am Übergang ins Internet, Wartung bis 8 Stunden im Monat; keine Zusage für KI und E-Mail-Zustellung (Dritte); höhere Gewalt. |
| Rechte und Domain | § 6, § 15 | Software, Vorlagen, Gestaltung bleiben bei uns, Nutzungsrecht nur für die Laufzeit; eigene Texte der Seite darf er behalten. Domain auf uns als Treuhänder, Umzugscode kostenlos erst, wenn alles bezahlt ist; Adresse unter eeziframes.com zwölf Monate gesperrt. |
| Änderungen | § 2 Abs. 3, § 16, § 17 | Änderungen am Dienst nur aus sachlichem Grund mit Ankündigung und Sonderkündigung; Vertrag auf eine künftige GmbH übertragbar; Änderungen der Bedingungen ohne Nachteil für den Kunden, nie an Preis und Hauptleistung. |
| Gerichtsstand | § 18 | Sitz in Herzebrock-Clarholz für Kaufleute (Handwerker ohne Eintrag im Handelsregister sind keine Kaufleute; für sie gilt das Gesetz). |
| AV-Vertrag | Anlage §§ 3, 4, 5, 7, 9, 10, 11, 12, 13 | Weisung mit der Bestellung (gegen den Vorwurf der Mitverantwortung), Sonderwünsche gegen Vergütung, Meldung möglichst in 48 Stunden, Prüfungen vor Ort höchstens jährlich mit vier Wochen Vorlauf, Haftungsgrenzen aus § 12 auch im Innenverhältnis, Freistellung bei Weisungen, Export vor der Löschung. |

## Gegenprüfung: Angriffspunkte und Stand

| Nr. | Angriffspunkt (Anwalt des Fensterbauers) | Stand |
| --- | --- | --- |
| 1 | Verfügbarkeit offen, Dienstleister-Ausfälle pauschal ausgenommen | geschlossen (§ 11) |
| 2 | Haftungshöchstbetrag leer, Garantiehaftung § 536a | geschlossen (§ 12 Abs. 2, 5); Höhe mit der Anwältin und der Versicherung abstimmen |
| 3 | AV-Vertrag hebelt Haftungsgrenzen aus | teilweise: Innenverhältnis geregelt, Reichweite unsicher |
| 4 | Fehler der KI oder der Zeichnung | geschlossen (Leistungsbeschreibung § 2 Abs. 4); Kennzeichnung nach Art. 50 KI-VO prüfen (offen) |
| 5 | Inhalte, die wir erstellen (Abmahnung, Urheberrecht) | geschlossen (§ 5 Abs. 3, § 14) |
| 6 | Einrichtung ohne Frist, Abnahme, Korrekturgrenze; Erstattungsausschluss zu weit | geschlossen (§ 5, § 7 Abs. 2) |
| 7 | Zustimmungsfiktion für alles | geschlossen (§ 17) |
| 8 | Export nur bei Signature, Data Act | teilweise: Export für alle (§ 8 Abs. 3); Angaben nach Art. 25 Data Act offen |
| 9 | Domain (Herausgabe, Ablauf, Neuvergabe) | geschlossen (§ 6) |
| 10 | Nutzungsrechte nach dem Ende | geschlossen (§ 15) |
| 11 | Barrierefreiheit (BFSG) | teilweise: keine Norm geschuldet (§ 2 Abs. 6); ob das hält, Anwältin |
| 12 | Kein Sperrrecht, DSA-Angaben fehlen | geschlossen (§ 8 Abs. 4, § 14 Abs. 6) |
| 13 | Spam-Ordner und Löschung nach 30 Tagen | geschlossen (§ 2 Abs. 1, § 5 Abs. 7, § 12 Abs. 4) |
| 14 | Änderungsvorbehalt ohne Grund | geschlossen (§ 2 Abs. 3) |
| 15 | Widersprüche im Text | geschlossen (Kurz gesagt, § 1, § 4 Abs. 4, § 10 Abs. 1) |
| 16 | Pause und Rücklastschrift | geschlossen (§ 3 Abs. 2, § 8 Abs. 5) |
| 17 | KI-Kosten durch Bots | geschlossen (§ 4 Abs. 4: Missbrauch Dritter wird nicht berechnet) |
| 18 | Gerichtsstand | geschlossen für Kaufleute |
| 19 | „Daten an niemanden“ | geschlossen (§ 10 Abs. 2) |
| 20 | Wechsel in ein kleineres Paket | geschlossen (§ 7 Abs. 3) |
| – | AV: Art. 9, Protokoll der Einblicke, Anthropic „spätestens 30 Tage“ | geändert; Datenschutzerklärung der Konfiguratoren und Einwilligungstext sagen noch „spätestens nach 30 Tagen“ (offen) |

## Offene Fragen an die Anwältin

1. Haftungshöchstbetrag 5.000 € je Fall und 10.000 € je Jahr: deckt er den vertragstypischen Schaden (verlorene Anfrage eines Fensterauftrags)?
2. Hält der Ausschluss der Minderung durch Abzug und der Garantiehaftung (§ 12 Abs. 5) im Mietrecht des laufenden Betriebs?
3. Freigabefiktion nach 14 Tagen (§ 5 Abs. 5) und Abnahme durch Freigabe: wirksam?
4. Reicht die Innenverhältnis-Regel im AV-Vertrag (§ 13), oder ist eine Deckelung gegenüber Art. 82 DSGVO dort unwirksam?
5. Data Act (Art. 23 ff.): fallen die Pakete darunter, und welche Angaben nach Art. 25 fehlen?
6. BFSG: trifft der Konfigurator die Betriebe als „Dienstleistung im elektronischen Geschäftsverkehr“, und hält § 2 Abs. 6?
7. KI-VO Art. 50: genügen Einwilligungstext und Hinweis im Konfigurator, oder muss der KI-Befund im Aufmaßblatt eigens gekennzeichnet sein?
8. Speicherdauer bei Anthropic: einheitlicher Wortlaut für AV-Vertrag, Datenschutzerklärungen und Einwilligung.
9. Freistellung in § 14 Abs. 5 und Zurückbehaltung der Domain (§ 6 Abs. 2): wirksam so?

## Empfehlungen außerhalb des Vertrags

- **Haftung des Inhabers:** Als Einzelunternehmer haftet Patrick Kies mit dem Privatvermögen. Eine GmbH oder UG trennt das; § 16 Abs. 1 erlaubt, die Verträge dann zu übertragen.
- **Versicherung:** IT-Haftpflicht mit Vermögensschäden und Cyber-Baustein; die Deckungssumme an § 12 ausrichten.
- **Stripe:** Einstellung „Abo kündigen“ nach den Fehlversuchen bleibt (Altkonten); der Server behandelt Pakete trotzdem nach § 8.
- **Freigabe-Erinnerung (§ 5 Abs. 5):** heute von Hand: in der Zentrale eine Nachricht mit dem Hinweis auf die 14 Tage schicken, danach live schalten.
- **Supabase:** `supabase/schema.sql` erneut ausführen (Spalten `instanz`, `ki`, `sperre`, `pause_seit`).

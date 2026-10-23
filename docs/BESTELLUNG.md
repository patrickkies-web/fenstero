# Bestellung der Konfigurator-Pakete: von „Paket wählen“ bis „Live“

Ein Fensteranbieter bestellt auf eeziframes.com einen eigenen Fenster-Konfigurator unter seiner Domain, in einem von drei Paketen (**EEZI Essential**, **EEZI Essential Plus**, **EEZI Signature**). Diese Datei beschreibt den Weg der Bestellung, das Geld (Stripe) und die Rechtstexte dazu. Wie eine Instanz danach betrieben wird, steht in [INSTANZEN.md](INSTANZEN.md) (Teil 2), was du einmalig einrichtest, in [ONLINE-STELLEN.md](ONLINE-STELLEN.md) („Stufe 3“).

## Wo was steht

| Was | Stelle |
|---|---|
| Merkmale, Preise, Fristen je Paket | `web/assets/pakete.js` (eine Zelle je Merkmal; `VORLAEUFIG`, `PREIS_STAND`) |
| Statusleiste, Übergänge, Abo-Zustände, Feldregeln des Formulars, globale Fristen | `web/assets/instanzregeln.js` |
| Verkaufsseite `/fuer-fensterbauer/`, `llms.txt`-Absatz | `functions/pakete-seite.js` (Bausteine in `web/fuer-fensterbauer/index.html`) |
| Paketbedingungen mit AV-Vertrag `/konfigurator-bedingungen/` und ihre PDFs | `web/konfigurator-bedingungen/`, `scripts/bedingungen-pdf.mjs`, Fassung `PAKET_STAND` in `functions/api/recht.js` |
| Kundenkonto `/partner/` (Bestellformular, Statusleiste, Nachrichten, Rückruf, Freigabe, Rechnungen) | `web/partner/index.html`, `web/assets/partner.js`, `functions/api/partner.js` |
| Statusmaschine, Zahlung, Abo, Paketwechsel, Tageslauf, Mails | `functions/api/bestellung.js`; Stripe-Teil in `functions/api/stripe.js` (Paketfunktionen) |
| Bestellungen in der Zentrale | `functions/api/zentrale-bestellungen.js`, [ZENTRALE.md](ZENTRALE.md) |

## Ablauf

Die Statusleiste im Kundenkonto und der Abschnitt „Von der Bestellung bis zum Livegang“ auf der Verkaufsseite nennen dieselben sechs Schritte (`Instanzregeln.bestellung.LEISTE`):

| Schritt | Status | Wer schaltet weiter | Was passiert |
|---|---|---|---|
| **Bestellt** | `offen` | Stripe (Zahlung) | Formular unter `/partner/#bestellen/<paket>` in Schritten (Paket, E-Mail mit Code, Unternehmen, Konfigurator, Gestaltung nur bei Paketen mit eigener Gestaltung, Prüfen und bestellen); Zwischenstand bleibt gespeichert. Mit „Kostenpflichtig bestellen“ (Häkchen: Unternehmer, Paketbedingungen in der Fassung `PAKET_STAND`, AV-Vertrag) geht sofort die Eingangsbestätigung mit beiden PDFs raus, dann die Kasse von Stripe. |
| **Bezahlt** | `bezahlt` | Inhaber | Nur `einrichtungUebernehmen` setzt das, gebunden an Bestellung, Partner und Stripe-Kunden (eine Zahlung zählt nie für zwei Bestellungen). SEPA: „Lastschrift unterwegs“, bis Stripe den Eingang meldet. Mail an Partner und Inhaber. |
| **In Einrichtung** | `einrichtung` | Inhaber | Rückruf zur Wunschzeit, Instanz anlegen (übernimmt alles aus der Bestellung), Bestätigungslinks an die Empfänger der Anfragen. |
| **Domain gesichert** | `domain` | Inhaber | Domain gekauft, verbunden und in der Zentrale grün geprüft. |
| **Zur Freigabe** | `freigabe` | Partner (Freigabe) und Inhaber | Vorschau-Link (`FRISTEN.vorschauTage` Tage), Testanfrage; der Partner gibt im Kundenkonto genau diese Fassung frei oder wünscht Änderungen (dann zurück nach „In Einrichtung“ oder „Domain gesichert“, mit Vermerk). Erinnerungen nach `FRISTEN.freigabeErinnerung` Tagen. |
| **Live** | `live` | Inhaber | Nur mit grüner Ampel (bezahlt, Domain, Rechtsangaben, bestätigte Eingangsadresse, Gestaltung veröffentlicht, Testanfrage zugestellt, Freigabe oder Vermerk, Zahlungsmittel, bei Signature ein bestätigter Zugang). Das Monatsabo startet von selbst, der Partner bekommt den Knopf „Fenster planen“ als HTML-Schnipsel für seine Website (`schnipsel(host, { farbe })`, Firmenfarbe, 44 px hoch). Beim ersten Livegang gibt der Server bei Plus und Signature die Startseite für Suchmaschinen frei (`instanzen.indexierung`); der Schalter unter „Betrieb“ bleibt zum Abschalten, nach einer Pause setzt ihn niemand neu. |

Danach ersetzt eine Abo-Karte die Leiste: **Aktiv · Zahlung offen (Kulanz bis …) · Gekündigt zum … · Pausiert · Beendet**. Abseits der Leiste gibt es `pausiert`, `beendet` und `storniert` (Übergänge in `UEBERGAENGE`). Dauer bis Live: meist 3 bis 5 Werktage nach der Zahlung (so steht es auf der Verkaufsseite).

Unbezahlte Entwürfe erinnern nach 3 Tagen einmal und werden nach `FRISTEN.bestellEntwurfTage` Tagen ohne Änderung samt Dateien gelöscht; verwirft der Partner einen unbezahlten Entwurf selbst, löscht `uebergang(…, 'storniert')` die Dateien sofort. Bei einem Storno nach der Zahlung (Erstattung) bleiben die Dateien noch `FRISTEN.loeschenNachEndeTage` Tage, dann löscht sie der Tageslauf (Vermerk `geloescht`). Höchstens drei offene Bestellungen je Partner.

**Aufbewahrung:** Ist der Vertrag beendet oder storniert, bleiben Partnerzeile, Bestellungen und Nachrichten bis zum Ende des 3. Jahres nach dem Jahr des Vertragsendes (`FRISTEN.nachrichtenJahre`; Ende am 5.3.2026 → gelöscht ab 1.1.2030), ein Partner ohne jede Bestellung ebenso lange ab dem Anlegen. Danach löscht `partnerAufraeumen` (am Ende von `bestellungenLauf`, höchstens 20 je Lauf, Protokoll `loeschen`) Nachrichten, Bestellungen, Partnerzeile und die Supabase-Anmeldung, sofern an ihr kein Betrieb, kein eigenes Aufmaß und kein Dashboard-Zugang hängt. Rechnungsbelege liegen bei Stripe.

## Geld (Stripe)

- **Einrichtung vorab:** Stripe Checkout mit dem Betrag aus dem Preisstand der Bestellung (`bestellungen.preise`, aus `pakete.js` beim Anlegen festgehalten, danach unveränderlich), Karte oder SEPA-Lastschrift, Zahlungsmittel wird für das Abo gespeichert. Metadaten `art: 'einrichtung'`, nie `betrieb` (so bleibt der Altbestand unberührt).
- **Abo ab Livegang:** `aboStarten` legt das Monatsabo an (ein Abo je Bestellung); der Monatspreis kommt über einen `lookup_key` mit Betrag, eine Preisänderung in `pakete.js` legt also einen neuen Preis an, bestehende Abos behalten ihren.
- **Kulanz, Pause, Ende:** erste fehlgeschlagene Abbuchung → `zahlung_offen`, Kulanz `FRISTEN.kulanzTage` Tage; danach pausiert der Tageslauf die Instanz (Seite 503 mit Name und Kontakt des Betriebs). Pause länger als `FRISTEN.pauseMaxTage` Tage → Abo beendet, Status `beendet`; `FRISTEN.loeschenNachEndeTage` Tage nach dem Ende löscht der Lauf alle Instanzdaten und die Dateien der Bestellung. Die Stripe-Einstellung „nach den Wiederholungsversuchen Abo kündigen“ bleibt (sonst stuft der Server Altbestands-Abos nicht mehr zurück); `customer.subscription.deleted` pausiert die Instanz, „Abo neu starten“ in der Zentrale.
- **Paketwechsel:** nur `paketWechseln` (ändert `instanzen.paket` und den Preis des Abos zusammen). Nach oben sofort: Abo anteilig (`create_prorations`), auf Wunsch die Differenz der Einrichtungsgebühr als Posten auf der nächsten Rechnung. Nach unten mit laufendem Abo und Instanz erst zum Periodenende: Der laufende Monat ist zum alten Preis bezahlt, also behält die Instanz bis `abo.bis` das alte Paket (bei Signature bleibt das Dashboard offen); bei Stripe wechselt der Preis sofort ohne Ausgleich (`proration_behavior: none`), die nächste Rechnung kommt zum kleineren Preis. Die Bestellung trägt `abo.wechsel = { paket, von, ab }` (ISO-Zeit) und `abo.paket` = Ziel; Kundenkonto und Zentrale zeigen „Paketwechsel nach … wirkt ab …“. Wirksam macht ihn der Tageslauf oder `invoice.paid` der neuen Periode (`paketSetzen`, Verlauf, kurze Mail); der wöchentliche Abgleich lässt einen vorgemerkten Wechsel stehen. Ein späterer Wechsel nach oben wirkt sofort und ersetzt die Vormerkung (Stripe erst zurück auf den bezahlten Preis, dann anteilig nach oben); zurück zum laufenden Paket hebt sie nur auf. Fehlt `abo.bis`, wirkt auch der Wechsel nach unten sofort (Hinweis im Verlauf). Ohne laufendes Abo oder ohne Instanz: sofort. Der Partner fragt im Kundenkonto an, der Inhaber führt in der Zentrale aus.
- **Abo neu starten** (`aboSteuern 'neu'`, Zentrale): nur bei `live` oder `pausiert` (nach `incomplete_expired` oder einem bei Stripe beendeten Abo); vor dem Livegang antwortet der Server 409, das Abo startet allein über `uebergang(…, 'live')`.
- **Rechnungen, Zahlungsmittel, Kündigung:** Kundenportal von Stripe (Knopf im Kundenkonto, nur mit frischer Anmeldung); das Kundenkonto zeigt die Rechnungen nur lesend.
- **Erstatten:** in der Zentrale ganz oder teilweise; Storno durch den Partner bis zum Beginn der Einrichtung mit voller Erstattung.
- **Webhook-Ereignisse** (Workbench → Webhooks, Test- und Live-Modus): `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `invoice.paid`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.dispute.created`. `zahlung.js` leitet Paket-Ereignisse über `paketObjekt`/`istPaketEreignis` an `bestellung.js`, alles andere läuft wie bisher.
- **Abgleich:** Der tägliche Lauf holt Kassen der letzten drei Tage nach, deren Ergebnis fehlt (verlorener Webhook, Browser geschlossen), und gleicht laufende Abos einmal je Woche mit Stripe ab.

## Verkauf an- und ausschalten

| | ohne `PAKETE_OFFEN` | mit `PAKETE_OFFEN=1` |
|---|---|---|
| Verkaufsseite | Pakete mit „Vorläufige Preise“, Karten führen zum Anfrageformular, Abschnitt „Bestellung bald möglich“ | Knöpfe „… bestellen“ auf `/partner/#bestellen/<paket>`, Frageformular darunter |
| JSON-LD der Angebote | `availability: PreOrder` | `InStock` |
| Paket-Kasse, Stripe-Testmodus oder Attrappe | offen (alles prüfbar) | offen |
| Paket-Kasse, Stripe-Live-Modus | zu: „Bestellung bald möglich“ (503), Angaben bleiben gespeichert, „unverbindlich anfragen“ | offen, sobald `paketVerkaufStand()` nichts mehr vermisst |

Die einzige Abfrage ist `Instanzregeln.verkauf({ offen, live, bereit })`. `paketVerkaufStand()` (`functions/api/recht.js`) vermisst im Live-Modus: Mailversand, `MWST`, Datenbank, `SITZUNG_GEHEIMNIS`, Platzhalter (`<mark class="ph">`) in Paketbedingungen, Impressum oder Datenschutz und die beiden PDFs der Fassung `PAKET_STAND`. Die Zentrale zeigt den Stand in der Übersicht („Konfigurator-Pakete“). „Vorläufige Preise“ steht zusätzlich, solange `Pakete.VORLAEUFIG` gilt, auch mit `PAKETE_OFFEN=1`.

Die **Frage ohne Konto** (`POST /api/partner/frage`, Formular auf der Verkaufsseite, auch ohne JavaScript) geht als Mail an `MAIL_KONTAKT` (Antwortadresse: der Fragende) und, wenn es zur Adresse schon ein Kundenkonto gibt, als Nachricht dorthin. Bremse `RL_FORM` (5 je Minute und Anschluss), Honigtopf `fax`, nur auf eeziframes.com.

## Paketbedingungen und AV-Vertrag

- Seite `/konfigurator-bedingungen/`: § 1–15 Paketbedingungen, dann die Anlage „Vertrag zur Auftragsverarbeitung“ (§ 1–13). **Entwurf zur anwaltlichen Prüfung**: offene Stellen sind als `<mark class="ph">[…]</mark>` markiert (Freigabe, Pauschale für die Domain-Übertragung, Verfügbarkeit, Haftungshöchstbetrag, Gerichtsstand, Meldefrist); solange es sie gibt, bleibt die Live-Kasse zu.
- Tabellen und Fristen kommen aus `pakete.js` und `instanzregeln.js` (Bausteine `<!--pakete:leistungen-->`, `fristen`, `f-kulanzTage` …), der Stand aus `PAKET_STAND`.
- PDFs: `node scripts/bedingungen-pdf.mjs` schreibt die Bausteine in die Seiten (Verkaufsseite, Paketbedingungen, Datenschutz) und erzeugt `paketbedingungen-<STAND>.pdf` und `av-vertrag-<STAND>.pdf` (jsPDF, Inter; „Entwurf zur anwaltlichen Prüfung“ im Kopf jeder Seite, solange Platzhalter da sind). Die Keywords jedes PDFs tragen die Prüfsumme seines Textes; `node scripts/bedingungen-pdf.mjs --pruefen` und Prüfabschnitt 29 melden, wenn Seite und PDF auseinanderlaufen.
- **Neue Fassung:** Text ändern → `PAKET_STAND` in `functions/api/recht.js` und `<meta name="stand">` der Seite auf das neue Datum → `node scripts/bedingungen-pdf.mjs` → die PDFs der alten Fassung liegen lassen (frühere Bestellungen verweisen darauf). Der Server nimmt nur Bestellungen mit genau dem aktuellen Stand an und speichert ihn an der Bestellung und in den Metadaten der Kasse.
- Nach der anwaltlichen Prüfung: Platzhalter durch die Werte ersetzen, den Hinweis „Entwurf zur anwaltlichen Prüfung“ im Kasten oben entfernen, neue Fassung wie oben. Ebenso `VORLAGE` in `functions/instanz/recht.js` (Impressum und Datenschutz der Instanzen) auf `geprueft: true` mit neuem Stand setzen.

## Preise ändern

Nur in `web/assets/pakete.js` (`preis: { monat, einrichtung }` je Paket, netto) und dort `PREIS_STAND` auf das Datum setzen; wenn die Preise feststehen, `VORLAEUFIG = false`. Danach `node scripts/bedingungen-pdf.mjs` (Verkaufsseite und Leistungstabelle). Laufende Bestellungen behalten ihren Preisstand, laufende Abos ihren Stripe-Preis.

## Prüfung

`NUR=27` (Kundenkonto, Bestellung, Stripe gegen die Attrappe), `NUR=26` (Zentrale), `NUR=29` (Verkaufsseite, Rechtstexte, PDFs, Doku), `NUR=30` (Ende zu Ende), jeweils über `node scripts/mit-server.mjs <port> env PW_PFAD=/opt/node-tools NUR=… node scripts/pruefen.mjs`.

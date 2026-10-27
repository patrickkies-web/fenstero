# Bestellung, Kundenbereich und Zentrale der Aufträge

Ein Fensterbauer bestellt auf eeziframes.com seine Landingpage mit Fenster-Konfigurator in einem der drei Pakete (**EEZI Essential**, **EEZI Essential Plus**, **EEZI Signature**). Die Seite baust du danach von Hand aus der Vorlage des Pakets, mit einem Prompt, den die Zentrale aus allen Angaben zusammenstellt. Neu gebaut am 27.10.2026; das alte Kundenkonto `/partner/`, die alte Paket-Bestellung und die alte Zentrale-Oberfläche sind gelöscht (Wunsch des Inhabers: „alles von neu aufbauen“).

## Wo was steht

| Was | Stelle |
|---|---|
| Merkmale und Preise je Paket | `web/assets/pakete.js` (einzige Stelle für Preise; `VORLAEUFIG`, `PREIS_STAND`) |
| Regeln der Aufträge: Stationen je Paket, Felder mit Grenzen und Prüfung, Plätze für Dateien, Stände und Übergänge, was ein Paket veränderbar macht, Anreiz zum nächsten Paket | `web/assets/auftragsregeln.js` (Browser `window.Auftrag`, Server `globalThis.Auftrag`) |
| Bestellung `/bestellen/` | `web/bestellen/index.html`, `web/assets/bestellen.js` |
| Kundenbereich `/konto/` | `web/konto/index.html`, `web/assets/konto.js` |
| Zentrale `/zentrale/` | `web/zentrale/index.html`, `web/assets/inhaber.js`, [ZENTRALE.md](ZENTRALE.md) |
| Gemeinsame Bausteine und Stil (Design-DNA, Palette „Task-App dunkel“, App-Rahmen) | `web/assets/auftrag-ui.js`, `web/assets/auftrag.css` (Präfix `a-`) |
| Server: Routen, Mails, Stripe, Daten | `functions/auftrag/index.js`, `mails.js`, `zahlung.js`, `daten.js` |
| Tabellen | `supabase/schema.sql`, Abschnitt „Aufträge“: `kunden`, `anmeldecodes`, `auftraege`, `auftrag_nachrichten`; Dateien im Bucket `auftraege` (privat, legt der Server selbst an) |
| Paketbedingungen mit AV-Vertrag und ihre PDFs | `web/konfigurator-bedingungen/`, `scripts/bedingungen-pdf.mjs`, Fassung `PAKET_STAND` in `functions/api/recht.js` (seit 27.10.2026: `2026-10-27`) |
| Prüfung | `scripts/pruefen-instanzen/26.mjs` (`NUR=26`), dazu 23 und 29 |

## Die Bestellung

Jede Karte auf der Seite für Fensterbauer führt in die Bestellung ihres Pakets (`/bestellen/#essential`, `#plus`, `#signature`). Rahmen nach der Design-DNA: Kopf, Stationen-Band, Bühne mit der Vorschau der eigenen Seite (kleiner Browser mit der künftigen Adresse, Name, Überschrift, Farbe, Porträt, Foto), Frage, weiße Karten, Fuß mit genau einer Pille.

| Station | Was gefragt wird |
|---|---|
| **Paket** | Umschalter Essential, Plus, Signature mit Monatspreis gleich unter der Frage (am Telefon steht nur die gewählte Karte, die Pille nennt Paket und Preis); Karten mit den Seiten von Fensterbau Brandt als Bild, Preis im Monat und Einrichtung (je mit „netto“), KI-Kontingent und Preis jeder weiteren Auswertung, was dazukommt, Hinweis auf eeziframes offen genannt; das Muster-Aufmaßblatt und der Mess-Schritt zum Ansehen; bei Plus und Signature der **Weg**: *Schnell* (nur das Nötigste und das Logo, Texte, Farben und Bilder übernimmst du von der Website oder klärst sie im Telefonat) oder *Ausführlich* (Logo, Farben, sechs Fotos, Porträt, Texte selbst) |
| **Konto** | E-Mail-Adresse, Code per Mail (zugleich die Registrierung, kein Passwort); danach liegt der Auftrag als Entwurf auf dem Server |
| **Ihr Betrieb** | was auf der Seite steht (Unternehmen, Name auf der Seite, Einzugsgebiet, Ansprechperson, Rolle, Telefon, E-Mail, Erreichbarkeit, bisherige Website) und Impressum und Rechnung (Anschrift, Bundesland, Rechtsform, Vertretung; Register, USt-IdNr., Kammer, Beruf aufklappbar). Name und Rechtsform füllen sich aus dem Unternehmen. Im Weg *Schnell* sind Bundesland, Rechtsform und Vertretung freiwillig (klären wir im Telefonat). Alle Platzhalter beginnen mit „z. B.“ |
| **Adresse** | Essential: Name unter eeziframes.com mit Prüfung „frei/vergeben“ und Anreiz zu Plus (eigene Domain). Plus und Signature: *Neue Domain* (bis drei Wünsche oder „Schlagen Sie mir Namen vor“; bis 25 € netto im Jahr im Paket, Paketbedingungen § 6) oder *Meine Domain* (eine Domain, die schon gehört, nach Absprache, § 6 Abs. 3; Hinweis, dass die bisherige Website bleibt). Dazu die Adressen für die Anfragen (bis drei), bei Signature die Zugänge zum Dashboard (bis fünf) |
| **Auftritt** | nur mit eigener Gestaltung (Plus, Signature). Schnell: Logo, „von meiner Website übernehmen“, Hinweise. Ausführlich: Logo, bis drei Farben (oder aus Logo/Website), Fotos für Bühne, Werkstatt, Montage, Team, Ausstellung, Referenz (leere Plätze schraffiert), Porträt, Überschrift, Einleitung, Leistungen, bei Signature der Einladungstext, Hinweise. Plus zeigt den Anreiz zu Signature |
| **Bestellen** | Lücken mit Sprung zur Station; Preiskachel: Einrichtung als Zahl (netto), „Heute bei Stripe: … inkl. 19 % USt.“, Monatspreis netto und brutto ab Livegang, KI-Kontingent, kostenloses Storno bis Arbeitsbeginn; direkt darunter drei Häkchen mit je einem Satz Alltagsdeutsch (Unternehmer § 14 BGB, Paketbedingungen in der Fassung `PAKET_STAND`, AV-Vertrag) und die Zeile über der Pille („Noch 2 Häkchen setzen“, Koralle nur, solange etwas fehlt); dann „Kostenpflichtig bestellen“ (Stripe) oder, solange die Kasse zu ist, „Unverbindlich anfragen“. Unter der Pille: die vier Schritte bis Live mit der Wunschzeit für den Anruf und „Ihre Angaben“ mit „Ändern“ je Teil |

Meldungen („Code ist unterwegs“, „Gespeichert“) stehen im Fuß über der Pille, nie über einem Knopf oder Feld, und verschwinden mit der Station oder nach vier Sekunden.

Gespeichert wird nach jeder Eingabe (kurz verzögert, beim Verlassen der Seite noch einmal); ein Entwurf darf Lücken haben, geprüft wird beim Weitergehen und beim Bestellen (Browser und Server mit denselben Regeln). Fotos werden im Browser verkleinert (Fotos bis 2400 px, Porträt 900 px). Paket und Weg lassen sich bis zur Zahlung wechseln.

## Stände eines Auftrags

| Stand | Wer | Was passiert |
|---|---|---|
| `entwurf` | Kunde | füllt aus; nach 30 Tagen ohne Änderung samt Dateien gelöscht |
| `angefragt` | Kunde | unverbindlich angefragt, solange die Kasse zu ist (ohne `PAKETE_OFFEN` im Live-Modus); Mail an dich; Löschfrist wie Entwurf |
| `bezahlt` | Stripe | Einrichtung bezahlt = Vertrag geschlossen (§ 3 Abs. 2); Mails an Kunde („Ihre Zahlung ist da“) und dich; Kunde kann bis Arbeitsbeginn im Kundenbereich stornieren (§ 7 Abs. 2, volle Erstattung, frische Anmeldung nötig) |
| `in_arbeit` | du | „Seite beginnen“: Anruf, Domain sichern, Seite bauen |
| `vorschau` | du | Link zur Vorschau eintragen; Mail mit Link; im Kundenbereich ist „Vorschau öffnen“ die Pille, „Freigeben“ und „Änderungen wünschen“ stehen daneben; fehlen Logo, Fotos oder Porträt, nennt die Freigabe das vorher („Trotzdem freigeben“). Der Kunde gibt frei oder schreibt, was zu ändern ist (dann zurück nach `in_arbeit`) |
| `live` | du | nach Freigabe: Adresse der fertigen Seite eintragen; das Monatsabo startet bei Stripe, Mail mit Link; der Kundenbereich zeigt den Knopf „Fenster planen“ als HTML für die eigene Website |
| `pausiert`, `beendet`, `storniert` | du (oder Stripe) | Pause, Ende (Abo zum Monatsende oder sofort), Storno mit Erstattung |

Übergänge stehen in `Auftrag.UEBERGAENGE` (wer darf was); der Server prüft jeden Schritt. Nach der Zahlung bleibt alles änderbar (Stationen der Bestellung mit „Speichern“), aber nur vollständig; jede Änderung erscheint in der Zentrale als „geändert“. Ein Paketwechsel nach der Zahlung ist eine Anfrage (Differenz der Einrichtung, neuer Monatspreis ab Wechsel, § 7 Abs. 3).

## Preise und KI-Auswertungen

Preise des Inhabers vom 27.10.2026, alle netto, einzige Stelle `web/assets/pakete.js` (`preis`, `kiMonat`, `PREIS_STAND`):

| Paket | Einrichtung | Monat | KI-Auswertungen im Monat inklusive | jede weitere |
|---|---|---|---|---|
| Essential | 99 € | 39 € | 1.000 (etwa 20 Kundenanfragen mit je 25 Fenstern) | 0,08 € |
| Essential Plus | 50 € | 69 € | 1.500 | 0,08 € |
| Signature | 239 € | 99 € | 2.000 | 0,08 € |

Eine KI-Auswertung ist ein Foto (je Fenster meist zwei). Der Preis jeder weiteren steht im Preisstand des Auftrags (`auftraege.preise.ki`) und gilt für diesen Vertrag. Schutz vor Missbrauch (`functions/api/ki.js`): nur Fotos aus einer Planung mit Code des Betriebs, höchstens 60 je Anfrage, Bremse je Anschluss, je Konfigurator und Monat Mail an den Inhaber beim Kontingent und Schluss beim Doppelten (danach weiter ohne KI-Befund), Tagesbudget über alle. Die Kalkulation des Preises steht nur intern in [KI-KOSTEN.md](KI-KOSTEN.md). Ist die Einrichtung des größeren Pakets günstiger (Essential zu Plus), kostet der Wechsel keine Einrichtung; erstattet wird nichts (Paketbedingungen § 7 Abs. 3).

## Geld (Stripe)

- **Einrichtung:** Checkout im Modus `payment` (Karte oder SEPA-Lastschrift), Betrag aus `pakete.js` netto mit Steuersatz 19 % (Metadaten `eeziframes: auftrag-mwst19`, legt der Server an; `MWST=0` ohne), Rechnung von Stripe, Zahlungsmittel bleibt für das Abo hinterlegt. Metadaten `art: auftrag`, `auftrag: <id>`.
- **Monatsabo ab Live:** Preis über `lookup_key` `eezi-auftrag-<paket>-<cent>` (eine Preisänderung legt einen neuen Preis an, laufende Abos behalten ihren).
- **Kundenportal:** eigene Konfiguration (Metadaten `auftrag-v1`): Rechnungen, Zahlungsmittel, Rechnungsangaben, Kündigung zum Monatsende.
- **Webhook** (`/api/zahlung/webhook`, Ereignisse mit `metadata.art = auftrag`): `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`. Rückkehr aus der Kasse und Webhook schreiben beide „bezahlt“; Mails gehen nur beim ersten Mal.
- **Attrappe** (`ZAHLUNG_ATTRAPPE=1` ohne Schlüssel): Kassen mit `test_`-Kennung gelten als bezahlt, Abo und Erstattung ohne Stripe.

## Mails

Anmeldecode · Eingangsbestätigung mit Paketbedingungen und AV-Vertrag als PDF (Fassung `PAKET_STAND`) · Zahlung da · Vorschau · Live · Pause, Ende, Storno · Nachrichten in beide Richtungen · an dich: neue Bestellung oder Anfrage, Nachrichten, Freigabe, Änderungswunsch, Paketwechsel, Storno, Frage vom Formular der Seite für Fensterbauer (`POST /api/auftrag/frage`, auch ohne JavaScript). Weiße Karte, Systemschrift, eine schwarze Pille, kein Tracking (`functions/auftrag/mails.js`).

## Fristen (Datenschutzerklärung Abschnitt 9, Werte aus `Instanzregeln.FRISTEN`)

Täglicher Lauf `auftraegeLauf`: nicht bezahlte Bestellungen 30 Tage nach der letzten Änderung samt Dateien; nach dem Vertragsende die Dateien nach 30 Tagen, der Auftrag mit Nachrichten nach dem Ende des dritten Jahres; Konten ohne Auftrag 30 Tage nach der letzten Anmeldung; abgelaufene Anmeldecodes nach einem Tag.

## Sicherheit

Anmeldung per Code (6 Ziffern, 15 Minuten, nur als HMAC gespeichert, höchstens fünf Versuche; Bremsen je Adresse und Anschluss), Sitzung `__Host-kunde` (14 Tage) bzw. `__Host-inhaber` (8 Stunden), signiert mit `SITZUNG_GEHEIMNIS`; POST nur mit eigener Herkunft. Jeder Auftrag gehört einem Kunden, fremde antworten 404. Dateityp aus den ersten Bytes, SVG und PDF nur als Anhang mit Sandbox. Bestellung und Zentrale gibt es nur auf der Hauptdomain, nicht auf dem Host einer Instanz.

## Lokal ausprobieren

```
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 MAIL_ATTRAPPE=1 ZENTRALE_PASSWORT=lokal-zentrale-2026 PORT=8789 node scripts/dev-server.mjs
```

Bestellung `http://localhost:8789/bestellen/#plus`, Code `123456`, Mails unter `/api/test/post`, Zentrale mit dem Passwort oben.

## Offen

- **Konfigurator beim Live-Schalten anlegen:** Die Instanz (Host, Merkmale, Empfänger, Rechtsangaben, Zugänge) entsteht noch nicht aus dem Auftrag; die alte Instanz-Verwaltung gehörte zur gelöschten Zentrale. Die Bausteine darunter (`functions/instanz/`, `verwalten.js`) bleiben und sind der nächste Schritt.
- **Essential unter `<name>.eeziframes.com`:** Wildcard-Eintrag und Zuordnung im Worker (`functions/instanz/mandant.js` behandelt `*.eeziframes.com` noch als Hauptdomain).
- **KI-Auswertungen über dem Kontingent abrechnen:** Der Zähler je Konfigurator und Monat läuft; als Posten auf die Monatsrechnung (Stripe) kommt er erst, wenn die Instanz beim Live-Schalten mit dem Auftrag verknüpft ist. Bis dahin von Hand (KI-KOSTEN.md).
- **Alte Tabellen** `partner`, `bestellungen`, `partner_nachrichten` und ihre Funktionen in `speicher.js`: ungenutzt; löschen nur auf Wunsch des Inhabers.

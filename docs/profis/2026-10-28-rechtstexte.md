# Prüfung der Rechtstexte, 28.10.2026

Auftrag des Inhabers: „Prüf nochmal mit 3 Anwälten und 3 wirklich bösen Fensterbauern meine AGBs und Rechtstexte.“

**Simulation, keine Rechtsberatung.** Sechs getrennte Agenten haben gelesen, ohne einander zu sehen, und nichts geändert. Sie haben Text und Code verglichen. Ihre Urteile sind begründete Hinweise. Eine echte anwaltliche Prüfung ersetzen sie nicht.

Geprüft wurden:
- Rechtstexte: AGB mit Widerrufsbelehrung, Widerrufsseite, Nutzungsbedingungen mit AV-Vertrag, Paketbedingungen §§ 1–18 mit AV-Vertrag, Datenschutzerklärung, Cookies, Impressum.
- Vorlagen der Konfiguratoren für Impressum und Datenschutz (`functions/instanz/recht.js`).
- Verkaufsseite für Fensterbauer, Kaufstrecken in App und Bestellung.
- Mails sowie Stripe- und KI-Code, soweit die Texte etwas über sie sagen.

## Die sechs Prüfer und ihr Urteil

| Prüfer | Schwerpunkt | Urteil |
| --- | --- | --- |
| Dr. Katrin Wolff | IT- und AGB-Recht | „So nicht freigegeben“: fünf Muss-Punkte, vor allem Widersprüche zwischen Text und Code. Danach Freigabe. |
| Jan Albrecht | Datenschutz | „Sorgfältig, noch nicht startreif“: Resend fehlt im Portal-AV, der KI-Dialog sagt Falsches über die Speicherung, die Anthropic-Fristen widersprechen sich. |
| Miriam Seidel | Verbraucher- und Wettbewerbsrecht | „Überdurchschnittlich sauber“. Abmahnfähig sind zwei Stellen: „Preis bleibt fest“ gegen den Preisänderungsvorbehalt, und die Zahlungsarten erscheinen erst im zweiten Kassenschritt. |
| Horst Kämmerer | Fensterbauer, prozessfreudig | Würde unterschreiben, um zu klagen: verlorene Anfrage, „Bestellmaß“ in der Werbung, „in 3 bis 5 Werktagen online“, Abnahme durch Schweigen. |
| Ronny Schulze | Fensterbauer, Ausnutzer | Abnahme durch Schweigen ist nicht gebaut, Rücklastschriften merkt das System nicht. Gesperrte Aufmaße wurden zum Tarif bei der Freischaltung gebucht (gratis unter Plus). Die Vorschau-Tests zählten ins KI-Kontingent. |
| Sabine Roth | Fensterbauerin, misstrauisch | Unterschreibt so nicht. Sie haftet für Texte von eeziframes, der Festpreis gilt nur in der Werbung, die Abnahme läuft über Schweigen, und die Domain liegt bei eeziframes. |

## Befunde und Stand

Schwere: **muss** (unwirksam, abmahnfähig, Widerspruch zu Code oder anderem Dokument), **sollte**, **kann**.

| Wo | Befund | Wer | Schwere | Stand |
| --- | --- | --- | --- | --- |
| Paketbedingungen § 4 Abs. 5 und Verkaufsseite | Werbung „Preis bleibt fest“, Vertrag erlaubt Erhöhung mit 6 Wochen Ankündigung | Seidel, Roth, Kämmerer | muss | **behoben:** Die Preise gelten fest für die Laufzeit, eine Erhöhung nur mit Zustimmung. Dazu kündigt eeziframes ordentlich mit 3 Monaten statt zum Monatsende (§ 7 Abs. 1). |
| Paketbedingungen § 5 Abs. 3 und 5 | Bestätigung „alle Sachaussagen zutreffend“ (Tatsachenbestätigung), Abnahme durch Schweigen nach einer Erinnerung, die es im Code nicht gab | Wolff, Kämmerer, Schulze, Roth | muss | **behoben:** Prüfpflicht statt Bestätigung, Fiktion nach § 640 Abs. 2 BGB (Frist 14 Tage, Mangel nennen genügt). Die Zentrale hat „Frist zur Freigabe setzen“ (Mail mit Hinweis auf die Folge), danach „Live schalten (Frist abgelaufen)“. Der Kundenbereich nennt die Frist. |
| Paketbedingungen § 7 Abs. 1 gegen Bestellung und Kundenbereich | Text „Abrechnungsmonat“, Oberfläche „zum Monatsende“, Stripe rechnet ab Livegang | Wolff | muss | **behoben:** Abrechnungsmonat ab dem Tag des Livegangs, Oberfläche angepasst |
| Paketbedingungen § 8 Abs. 5 | „Monatsbeitrag bleibt geschuldet“, Stripe beendet das Abo aber und stellt keine Rechnung | Wolff, Kämmerer | muss | **behoben:** Keine Beiträge für die Pause wegen Zahlungsverzugs. Für eine selbst verschuldete Sperre bleibt er geschuldet. |
| Paketbedingungen § 8 Abs. 1 | Rücklastschrift nicht geregelt, Code wertet sie nicht aus | Schulze, Kämmerer | muss | **behoben:** Text nennt Rückbuchung. `charge.dispute.created` schickt eine Mail an den Inhaber und vermerkt sie am Auftrag; das Ereignis muss bei Stripe ausgewählt werden (unten). |
| Nutzungsbedingungen § 12 Abs. 2, § 14 Abs. 1 | Änderungsvorbehalt ohne Grund und Zumutbarkeit, Zustimmungsfiktion mit „etwa“ | Wolff | muss | **behoben:** sachlicher Grund, kein Nachteil, Kündigungsrecht beider Seiten bei Widerspruch (wie Paketbedingungen § 17) |
| Nutzungsbedingungen, Anlage Nr. 6 | Resend fehlt als Unterauftragsverarbeiter, obwohl Mails mit Kundennamen rausgehen | Wolff, Albrecht | muss | **behoben** |
| Nutzungsbedingungen § 5 gegen Code | Gesperrte Aufmaße wurden beim Freischalten zum dann geltenden Tarif gebucht (unter Plus gratis) | Schulze | muss | **behoben:** Buchung zum Tarif beim Eingang (Start, 9 €), so wie § 5 Abs. 1 und Regel 1 im Code es sagen; Text § 5 Abs. 2 ergänzt |
| KI-Dialog (`gemeinsam.js`) | „eeziframes speichert deine Fotos nicht“ (falsch: sie liegen mit dem Aufmaß), Instanz: „dort nicht gespeichert“ und „löscht nach 30 Tagen“ zugleich | Albrecht | muss | **behoben** |
| Instanz-Vorlagen (`recht.js`) | Anthropic „spätestens nach 30 Tagen“ gegen „bis zu zwei Jahre“ in der eigenen Erklärung | Albrecht, Roth | muss | **behoben:** „in der Regel 30 Tage, bei Prüfung eines Verstoßes bis zu zwei Jahre“, dazu die Standardvertragsklauseln |
| Instanz-Vorlagen | „Daten gehen an niemanden sonst“ (falsch, Postfach des Betriebs), kein Hinweis nach § 36 VSBG, kein Feld für den Datenschutzbeauftragten | Albrecht, Kämmerer, Roth | muss | **behoben:** Empfängersatz neu. Im Impressum steht immer ein Abschnitt Verbraucherstreitbeilegung; ohne Angabe gilt der Satz „nicht bereit und nicht verpflichtet“. Die neuen Felder „Verbraucherschlichtung“ und „Datenschutzbeauftragter“ sind in Bestellung und Zentrale. Die Fassung der Vorlage ist jetzt vom 28.10.2026. |
| Fehlversuche bei der Dashboard-Anmeldung | SHA-256 der E-Mail-Adresse dauerhaft in der Statistik | Albrecht | muss | **behoben:** Der Tageslauf löscht nach 2 Tagen; die Frist steht im AV-Vertrag § 11 |
| Paket-AV § 7 | Notfallwechsel eines Unterauftragnehmers „sofort, Info danach“ (Art. 28 Abs. 2 verlangt vorher) | Albrecht | muss | **behoben:** mindestens 14 Tage vorher, bis dahin ruht die betroffene Funktion |
| Paket-AV § 4 und § 13 | Freistellung für jede „Weisung“, also auch für die vom Anbieter formulierte Standardverarbeitung | Roth, Kämmerer | muss | **behoben:** nur für Einzelweisungen über die Paketbedingungen hinaus |
| App, Kasse | Zahlungsarten erst im zweiten Schritt (§ 312j Abs. 1 BGB) | Seidel | muss | **behoben:** stehen auf der Karte „Freischalten“ |
| Quelltext der Paketbedingungen | HTML-Kommentar „ENTWURF zur anwaltlichen Prüfung“ öffentlich | Kämmerer | muss | **behoben** |
| Paketbedingungen § 1 Abs. 3 | Vorrang setzt voraus, dass die Nutzungsbedingungen mitgelten | Wolff | sollte | **behoben:** für das Paket gelten ausschließlich die Paketbedingungen |
| Paketbedingungen § 2 Abs. 2 | Was eine Auswertung ist und was zählt, unklar; Grenze je Anfrage im Code `min(60, 2 × Fenster + 6)` | Wolff | sollte | **behoben:** Definition im Text. Testanfragen in der Vorschau zählen im Code nicht mehr ins Kontingent. |
| Paketbedingungen § 2 Abs. 4, § 12 Abs. 3 und Verkaufsseite | „keine Grundlage für Kalkulation“ gegen „daraus kalkulieren Sie“, „Bestellmaß“ errechnet eeziframes | Kämmerer | sollte | **behoben:** Grundlage für ein erstes, unverbindliches Angebot; das Bestellmaß ist ein Vorschlag; die Haftung ist ausgeschlossen, soweit der Fehler aus den Kundenangaben stammt |
| Paketbedingungen § 7 Abs. 2 | „ohne dass wir einen Grund gesetzt haben“ unbestimmt; volle Einbehaltung vor Livegang | Wolff, Kämmerer | sollte | **behoben:** Beginn der Einrichtung definiert, § 648 BGB (abzüglich ersparter Aufwendungen), anteilige Erstattung auch bei Sonderkündigung |
| Paketbedingungen § 10 | Kein Verbot, andere Betriebe zu empfehlen, kein Ausschluss von KI-Training und App-Übernahme, kein Kündigungsrecht | Roth | sollte | **behoben** (§ 10 Abs. 2 und neuer Abs. 4) |
| Paketbedingungen § 11 Abs. 1 | Keine Zusage für die Zustellung der Mails (Hauptpflicht) | Kämmerer, Roth | sollte | **behoben:** Versand geschuldet; die KI kann bei Überlast für alle pausieren (Tagesbudget) |
| Paketbedingungen § 12 | Vorbehalt für Garantie und Arglist fehlte; Datenverlust auch bei nie zugestellten Anfragen begrenzt | Wolff, Kämmerer | sollte | **behoben** |
| Paketbedingungen § 6, § 7 Abs. 3, § 16 | Domain als Pfand bei bestrittenen Beträgen; Wechsel in ein Paket ohne eigene Domain; keine Übertragung auf den Betriebsnachfolger | Roth, Wolff | sollte | **behoben:** Code zurückhalten nur bei unbestrittenen Beträgen, Wechsel ohne Domain wie Vertragsende, Übertragung auf den Nachfolger mit Zustimmung |
| Verkaufsseite für Fensterbauer | „In 3 bis 5 Werktagen online“, „misst perfekt“, „gibt keine Daten weiter“, „künftig weitergeleitet“ | Seidel, Kämmerer | sollte | **behoben:** „Vorschau in 3 bis 5 Werktagen“, nach vollständigen Angaben; „selbst, Schritt für Schritt geführt“; „empfiehlt keine anderen Betriebe und verkauft keine Daten“; FAQ ohne „künftig“ |
| Vertragsbestätigung Aufmaßblatt | „Widerrufsrecht ist erloschen“, erlischt aber erst mit der Bestätigung | Seidel | sollte | **behoben:** „mit der Bereitstellung und dieser Bestätigung“ |
| Datenschutz, Instanz | Fortschrittsanzeige auf Art. 6 Abs. 1 lit. b gestützt | Albrecht | sollte | **behoben:** lit. f mit Widerspruchsrecht |
| Datenschutz § 3 und § 4 | „nichts ausgelesen“ zu absolut; Zähler gegen Mehrfachnutzung | Albrecht | sollte | **behoben** |
| Cookies | „auch für Fensterbauer keine Cookies“, `vk.halt` fehlte | Seidel, Albrecht | kann | **behoben** |
| Bounce einer Anfrage | § 11 Abs. 2 „informieren Sie“, Code meldet nur dem Inhaber | Kämmerer | kann | Die Mail an den Inhaber sagt jetzt, dass er den Betrieb informiert. Die Information an den Betrieb geht weiter von Hand. |
| Bestellbestätigung | Vertragspartner nicht genannt | Seidel | kann | **behoben:** Fußzeile mit Anbieter |
| Paketbedingungen § 4 Abs. 1 | Kleinunternehmerregelung nicht erwähnt | Wolff | kann | bleibt, die Paketpreise sind netto zuzüglich USt (siehe Fragen) |

Neue Fassungen: Paketbedingungen und AV-Vertrag vom 28.10.2026 (PDFs neu), Nutzungsbedingungen vom 28.10.2026, Cookies vom 28.10.2026, Instanz-Vorlage vom 28.10.2026. Die PDFs vom 27.10.2026 bleiben für frühere Bestellungen liegen.

## Bleibt so (Entscheidung des Inhabers, bewusst nicht geändert)

- **`VORLAGE.geprueft: true`** (Albrecht: „auf false, bis geprüft“): Der Inhaber hat am 27.10.2026 freigegeben. Die Fassung ist jetzt die vom 28.10.2026.
- **Haftungsdeckel 5.000 € je Fall, 10.000 € je Jahr** (Kämmerer, Wolff: zu niedrig für einen verlorenen Auftrag, Rechtsprechung prüfen). Der Satz ist trennbar; fällt der Deckel, bleibt die Beschränkung auf den vorhersehbaren Schaden. Abgleich mit einer Vermögensschadenhaftpflicht empfohlen.
- **Verfügbarkeit 98 %** (Roth: 99,5 % mit Gutschrift).
- **Domain auf eeziframes als Treuhänder** (Roth: auf den Betrieb).
- **Rolle bei der KI im Portal** (Albrecht: der Betrieb sollte verantwortlich sein): bewusst so, denn die App für Hauseigentümer ist ein eigener Dienst von eeziframes, und die Einwilligung gilt eeziframes. Im Konfigurator (Paket) ist der Betrieb verantwortlich. Beide Wege sind getrennt beschrieben.
- **Vertragsübertragung an jeden Fortführer** (Roth: nicht an Hersteller oder Portale): Sonderkündigungsrecht und anteilige Erstattung reichen.

## Nachtrag am selben Tag: Preise des Inhabers und die technischen Lücken

**Preise (Wort des Inhabers):** „Es gelten nur noch die Paketpreise und die Einrichtungsgebühren plus Aufpreise 8 ct. 9 € lange nicht mehr, für Privathaushalte immer noch 7,99 € im Angebot fürs Aufmaß.“ Daraus:

- **Betriebskonto kostenlos.** Projekte, Kundenlinks, eingegangene Aufmaße und Codes vom Kunden kosten nichts, eine Zahlungsart wird nicht verlangt.
  - Code: `preise.projekt` 0, `kostenlos()` in `modell.js`. Es gibt keine Sperre und keine Tarife; früher gesperrte Aufmaße schalten sich frei.
  - Das Portal hat keine Abrechnung mehr. Preise und FAQ sagen „Ihr Konto kostet nichts“ und verweisen auf die Pakete.
  - Das Aufmaßblatt zeigt „Konto kostenlos“.
  - Die Abo-Kasse und die Zahlungsart lehnt der Server ab (409). Sammelrechnungen gibt es nicht mehr; ein altes Abo 10 oder Plus kündigt der Abrechnungslauf einmal zum Ende seines Abrechnungsmonats.
  - Die alte Abrechnung je Projekt läuft nur noch mit `BETRIEBE_ABRECHNUNG=1`, also nur in der Prüfsuite.
- **Nutzungsbedingungen §§ 4–8 neu** (Stand 28.10.2026):
  - § 4 Kosten: Das Konto ist kostenlos; kostenpflichtig sind nur das Paket und das Aufmaßblatt der Hauseigentümer.
  - § 5 Projekte und Nachbesserungen.
  - § 6 Frühere Tarife: nichts mehr berechnet, alte Abos enden.
  - § 7 Sperre.
  - § 8 Laufzeit ohne Abo.
  - Dazu § 12 und § 14 angepasst. Datenschutz: Abschnitt „Frühere Abrechnung der Betriebe“.
- Unverändert: Pakete (Einrichtung, Monatspreis, 0,08 € je weiterer KI-Auswertung) und das Aufmaßblatt (7,99 € bis 17.11.2026, danach 12,99 €).

**Technische Lücken, jetzt geschlossen:**

1. **KI-Missbrauch über die App:** Die Tagesbudgets für App (`KI_TAG_MAX`) und Konfiguratoren (`KI_TAG_MAX_INSTANZEN`) sind getrennt; die App hat zusätzlich die Cloudflare-Bremse `RL_KI` je Anschluss. Wer die kostenlose App leerfährt, trifft die zahlenden Betriebe nicht mehr.
2. **Vorschau als Gratis-Konfigurator:**
   - Höchstens 10 Testanfragen am Tag je Konfigurator (`GRENZEN.testJeTag`), steht in Paketbedingungen § 5 Abs. 3.
   - Testanfragen zählen nicht ins Kontingent.
   - Dazu „Frist zur Freigabe setzen“ in der Zentrale.
3. **KI-Nachberechnung beim Vertragsende:** Ist der Vertrag beendet, kommen weitere Auswertungen des letzten Monats als eigene Schlussrechnung, eingezogen vom hinterlegten Zahlungsmittel. Ohne laufenden Auftrag läuft die KI nicht mehr über das Kontingent hinaus.
4. **Falsche Anfragen gegen einen Mitbewerber:** Anfragen je Anschluss werden dauerhaft gezählt (10 am Tag), als gekürzter Prüfwert mit Geheimnis, nach 2 Tagen gelöscht. Instanz-Datenschutz und AV-Vertrag nennen das.
5. **Doppelte Konten für Gratisprojekte:** erledigt, weil das Konto kostenlos ist.
6. **Nachweis der KI-Einwilligung:** Zeitpunkt und Fassung (`KI_HINWEIS_STAND`) stehen am Entwurf und gehen mit der Anfrage an den Betrieb. Instanz-Datenschutz und AV-Vertrag nennen das.
7. **Unzustellbare Anfrage:** Der Betrieb bekommt beim endgültigen Bounce selbst eine Mail an die Adresse seines Kundenkontos.

Nicht gelöst: eine echte Prüfung gegen Automaten (Captcha). Sie bräuchte einen fremden Dienst, und die CSP lässt keine fremden Server zu. Die Grenzen oben begrenzen den Schaden.

## Was du tun musst

1. **Stripe:** Workbench → Webhooks → dein Ziel → Ereignis `charge.dispute.created` ergänzen (Test und Live). Ohne das merkt der Server keine Rücklastschrift.
2. **Bestehende Konten für Betriebe:** Falls es schon echte gibt, ihnen die neuen Nutzungsbedingungen mailen. § 14 Abs. 1 verlangt sechs Wochen Vorlauf mit Hinweis auf das Widerspruchsrecht; Resend als Unterauftragsverarbeiter vier Wochen (Anlage Nr. 6). Für sie wird alles günstiger (Konto kostenlos). Hat noch jemand ein Abo 10 oder Plus bei Stripe, kündigt es der Abrechnungslauf zum Ende des Abrechnungsmonats; schau in Stripe nach, ob es solche Abos gibt.
5. **Nie setzen:** `BETRIEBE_ABRECHNUNG` und `PREIS_PROJEKT` bei Cloudflare. Sie schalten die alte Abrechnung je Projekt wieder ein.
3. **Impressum:** Hast du eine USt-IdNr. oder schon eine Wirtschafts-Identifikationsnummer, gehört sie ins Impressum (§ 5 Abs. 1 Nr. 6 DDG). Sag sie mir, dann trage ich sie ein.
4. **Umsatzsteuer:** Die Pakete sind netto plus 19 % ausgewiesen. Bist du Kleinunternehmer (MWST=0), muss ich die Paketseiten und Bedingungen anpassen.

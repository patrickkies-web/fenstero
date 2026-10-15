# Abrechnung: Preise, Regeln, Zählung, Schranken

Stand: Preise und Paywalls sind eingebaut, die Regeln laufen im Browser (Pilot, nichts wird berechnet) und auf dem Server (Stufe 2, sobald Supabase und Stripe angeschlossen sind, siehe `docs/ONLINE-STELLEN.md`). Beide nutzen denselben Code: `web/assets/modell.js`.

## 1. Das Modell in einem Satz

Hauseigentümer messen mit Fensterino kostenlos; ihr fertiges Aufmaßblatt kostet einmal 7,99 €. Fensterbauer zahlen je **Projekt mit eingegangenem Aufmaß**, weil ihnen die Anfahrt zum Erstaufmaß erspart bleibt. Das Aufmaßblatt des Eigentümers trägt die Einladung an den Fensterbauer; so finden Betriebe zu Fensterino, ohne dass wir sie einzeln anschreiben.

## 2. Preise

| Wer | Was | Preis | Steuer |
|---|---|---|---|
| Hauseigentümer ohne Link | Aufmaßblatt als PDF, mit Code für den Fensterbauer, für das ganze Projekt (auch wenn später Fenster dazukommen) | **7,99 €** einmalig | brutto, inkl. 19 % MwSt. |
| Hauseigentümer über den Link eines Betriebs | Messen, Senden, alles | **0 €** | – |
| Betrieb, Tarif **Start** | keine Grundgebühr; die ersten **3 Projekte** mit eingegangenem Aufmaß kostenlos, danach **9 €** je Projekt | je Projekt | netto, zzgl. MwSt. |
| Betrieb, **Abo 10** | **49 €** im Monat, **10 Projekte** im Kalendermonat inklusive, jedes weitere **5 €** | monatlich, kündbar zum Monatsende | netto |
| Betrieb, **Plus** | **79 €** im Monat, Projekte unbegrenzt, Logo und Farbe beim Kunden, Team | monatlich, kündbar zum Monatsende | netto |

Abo 10 lohnt sich ab 6 Projekten im Monat (6 × 9 € = 54 €), Plus ab 16 (49 € + 6 × 5 € = 79 €). Messen, Fotos, 3-D-Modell, Projekte anlegen, Links und Einladungslisten kosten nie etwas.

Einstellbar ohne Code: `web/config.js → preise` (Pilot) bzw. die Variablen `PREIS_AUFMASS_CENT`, `PREIS_PROJEKT`, `FREI_PROJEKTE`, `PREIS_ABO`, `ABO_INKL`, `PREIS_ABO_EXTRA`, `PREIS_PLUS`, `MWST` bei Cloudflare (Stufe 2; der Server schickt die Preise per `/api/status` an Website und App). `MWST=0` bzw. `mwst: false` für die Kleinunternehmerregelung: Die Kasse zeigt dann „umsatzsteuerfrei nach § 19 UStG“ statt der ausgewiesenen Steuer.

## 3. Was gezählt und gebucht wird

| Ereignis | Gebucht als | Preis | Wann genau |
|---|---|---|---|
| Aufmaß geht in einem Projekt ein (aus Link, Einladungsliste, direkt aus der App oder per Code vom Kunden) | Position `aufmass`, Schlüssel = Projekt | Start: die ersten 3 je Betrieb kostenlos, danach 9 €; Abo 10: 10 im Monat inklusive, dann 5 €; Plus: inklusive | beim **ersten Eingang je Projekt**, zum Tarif in diesem Moment |
| Nachbesserung im selben Projekt | nichts | 0 € | höchstens 2 Runden, bis 30 Tage nach dem Eingang |
| Nachbesserung ohne jede Überschneidung mit dem bisherigen Aufmaß | Position `aufmass`, Schlüssel = Projekt + Runde | wie ein neues Aufmaß | beim Eingang, mit Hinweis an den Betrieb |
| Abo 10 / Plus | Position `abo` / `plus`, Schlüssel = Monat | 49 € / 79 € je Monat; Wechsel von Abo 10 auf Plus im selben Monat: nur der Aufpreis 30 € | beim Aktivieren und dann am Monatsanfang; Wechsel nach unten gilt zum Monatsende |
| Hauseigentümer: Aufmaßblatt | Zeile in `zahlungen` (Stufe 2) | 7,99 € | beim Kauf, Stripe ist das Buch |

Nicht berechnet werden: Projekte anlegen, Links und Einladungslisten verschicken, Beispieldaten (`demo`), gesperrte Aufmaße ohne Zahlungsart (sie warten).

**Eine Buchung wird nie geändert oder gelöscht.** Projekte löschen oder den Tarif wechseln ändert gebuchte Positionen nicht; Korrekturen laufen über eine Gutschrift.

## 4. Wo die Paywalls sitzen, und warum dort

**Hauseigentümer ohne Link.** Messen, Fotos, KI-Auswertung und 3-D-Modell sind frei; so entsteht der Wert erst. Die Paywall sitzt vor dem **Ergebnis**: Das fertige Blatt wird als Vorschau gezeigt (Kopf und Übersicht echt, Positionen verschwommen), PDF, Teilen-Knöpfe und der Aufmaß-Code erscheinen erst nach der Zahlung. Die Kasse hat zwei Schritte: E-Mail und Zustimmung (Rechnung, Nachweis), dann Stripe Checkout (Karte, PayPal, Apple/Google Pay) mit der Zustimmung zum sofortigen Beginn (Widerrufsrecht erlischt, § 356 Abs. 5 BGB). Ohne Server ist es ein gekennzeichneter Testkauf.

Zurück aus der Kasse prüft die App die Zahlung am Server (`/api/zahlung/pruefen`) und bekommt einen **Freischalt-Nachweis** (HMAC über Projekt-Kennung und Stripe-Sitzung, Geheimnis `FREISCHALT_GEHEIMNIS`). Der Nachweis ist jederzeit am Server prüfbar (`/api/zahlung/nachweis`), ein gefälschter nicht. Die PDF entsteht weiter auf dem Gerät des Kunden, denn sein Aufmaß verlässt das Gerät nicht; wer sich mit den Entwicklerwerkzeugen seines Browsers ein eigenes Blatt baut, bekommt ein Blatt ohne Rechnung und ohne Nachweis. Bei 7,99 € ist das der richtige Kompromiss zwischen Datenschutz und Schloss.

**Betriebe.** Registrieren, Projekte, Links, die ersten drei Aufmaße gehen ohne Zahlungsart. Das vierte Aufmaß kommt an, wird gespeichert und **gesperrt**: Der Betrieb sieht Positionen und Fotozahl, aber keine Maße, bis eine Zahlungsart hinterlegt ist. Danach werden wartende Aufmaße der Reihe nach gebucht und freigeschaltet. Das ist absichtlich der Moment mit dem größten Nutzen: Das Aufmaß liegt schon da. Abo 10 und Plus brauchen die Zahlungsart beim Aktivieren; die erste Monatsposition entsteht sofort. Abbuchung: Projekte alle zwei Wochen als Sammelrechnung (SEPA-Lastschrift oder Karte, Cron am 1. und 15.), Abos monatlich über Stripe.

**Kein Schlupfloch auf dem Server (Stufe 2):**
- Die Zählung läuft beim Eingang auf dem Server, nicht im Browser. Der Browser bekommt nur das Ergebnis.
- Gesperrte Aufmaße verlassen den Server nur als Umriss (Zahl der Positionen und Fotos); die Maße bleiben in der Datenbank, bis gebucht wurde.
- Link-Codes vergibt der Server beim Anlegen des Projekts; `/api/aufmass` nimmt nur Codes bekannter Projekte an, prüft Runde und offene Nachbesserung und weist doppelte Aufmaße ab (409).
- Zahlungsart, Abo und Rechnung sind erst gültig, wenn Stripe sie bestätigt hat (Rückkehr-Prüfung am Server und Webhook mit Unterschrift, Ereignisse werden nur einmal verarbeitet).
- Doppelkonten (gleiche Telefonnummer oder gleicher Firmenname im selben PLZ-Gebiet) bekommen kein Freikontingent (`dupOf`), das Konto selbst bleibt nutzbar.
- Bremsen je IP-Adresse: 8 Anmeldecodes, 15 Code-Prüfungen, 20 Kassen, 30 Aufmaß-Eingänge je 10 Minuten.

## 5. Nachbesserung statt zweiter Rechnung

1. Im Projekt: **„Nachbesserung anfragen“** mit Hinweis, was der Kunde prüfen soll. Der Link bekommt eine Runde (`~2`) und 14 Tage neue Laufzeit, die Nachricht enthält den Hinweis.
2. Der Kunde öffnet den Link: Sein gesendetes Aufmaß wird wieder bearbeitbar, alle Angaben bleiben. Auf einem anderen Gerät misst er nur die betroffenen Fenster neu; der Code trägt dann `m: 1` und der Betriebsbereich **ersetzt nur die passenden Positionen** (gleicher Name oder gleiche Maße ±3 %) und behält den Rest.
3. Das neue Aufmaß trägt die Runde. Es wird nur angenommen, wenn für dieses Projekt eine Nachbesserung offen ist und die Runde passt; das alte Aufmaß wird als Fassung aufgehoben, **gebucht wird nichts**.

Schranken gegen Missbrauch (ein Projekt als Sammelstelle für viele Kunden): höchstens **2 Runden** je Projekt, nur **bis 30 Tage** nach dem Eingang; ein Aufmaß **ohne jede Überschneidung** mit dem bisherigen gilt als anderes Aufmaß und wird gebucht; der Betrieb sieht die Regel vorher im Anfrage-Fenster.

## 6. Zwei Wege, auf denen ein Aufmaß zum Betrieb kommt

**Über den Link des Betriebs** (einzeln oder aus einer Einladungsliste): Der Betrieb hat den Kunden eingeladen. Zusage an den Betrieb: *Ihr Kunde bleibt Ihr Kunde.* Der Kunde sieht im Link nur diesen Betrieb, keine anderen Anbieter, keine Werbung, und zahlt nichts. Eine Kopie mit Maßen bekommt er vom Betrieb (PDF mit dem Angebot), nicht von uns; nach dem Senden zeigt die App ihm seine Positionen ohne Maßliste. Das ist eine Bremse, kein Schloss, und mehr wäre gegen die Daten des Kunden selbst gerichtet.

**Vom Kunden selbst** (ohne Link): Der Kunde misst von sich aus, kauft sein Aufmaßblatt für 7,99 € und gibt es weiter, an so viele Fensterbauer, wie er will. Auf jeder Seite der PDF läuft der senkrechte Fensterino-Streifen mit, auf der Übersichtsseite stehen Einladung, QR-Code zur kostenlosen Anmeldung (`?von=pdf`) und der Aufmaß-Code zum Einfügen. Holt der Betrieb das Aufmaß in sein Konto, entsteht ein Projekt und zählt wie jedes andere. Kein Anmeldezwang zum Lesen: Wer die PDF nur lesen will, braucht kein Fensterino; wer sie weiterverarbeiten will, meldet sich an, weil es ihm etwas bringt. So erreicht jedes Kunden-Aufmaß einen Betrieb, den wir nie angeschrieben haben.

## 7. Technik in Kürze (Stufe 2)

| Baustein | Datei | Aufgabe |
|---|---|---|
| Regeln | `web/assets/modell.js` | Zählung, Buchung, Sperre, Tarifwechsel, Nachbesserung, Import; im Browser und auf dem Server identisch |
| Konten | `functions/api/konten.js` | Anmeldung per E-Mail-Code (Supabase Auth), Registrierung mit Doppelkonto-Prüfung, Projekte, Import, Tarif, Zahlungsart, Eingang aus der App, Sammelrechnung, Stripe-Ereignisse |
| Kasse Hauseigentümer | `functions/api/zahlung.js` | Stripe Checkout, Prüfung nach der Rückkehr, Freischalt-Nachweis, Webhook |
| Stripe | `functions/api/stripe.js` | Kassen (Zahlung, Zahlungsart, Abo), Abo ändern/kündigen, Sammelrechnung |
| Speicher | `functions/api/speicher.js`, `supabase/schema.sql` | Supabase über PostgREST mit Versionszähler gegen gleichzeitiges Überschreiben; Attrappe für Tests |
| Verteiler | `functions/api/router.js`, `worker.js`, `wrangler.jsonc` | Routen, Größen- und Herkunftsprüfung, Cron |
| Prüfung | `scripts/pruefen.mjs`, Abschnitt 8 | kompletter Durchlauf gegen die Attrappen: Registrierung, Eingang, Sperre, Zahlungsart, Abo, Kauf, Abrechnungslauf |

**Offene Fragen für später** (bewusst noch nicht gebaut): Staffelpreise ab vielen Projekten im Monat ohne Abo, ein Teamkonto mit mehreren Mitarbeitern, Rabatt für Jahreszahlung, Gutschriften als eigene Buchungsart, und ob Plus-Betriebe ihren Link-Kunden eine PDF mit eigenem Logo freigeben dürfen (ein Argument mehr für Plus).

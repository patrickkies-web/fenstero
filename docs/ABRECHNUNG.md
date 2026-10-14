# Abrechnung: Regeln, Zählung, Schranken

Stand: Pilotphase. Dieses Dokument ist die Vorgabe für die spätere Server-Umsetzung. Im Pilot läuft alles im Browser und **es wird nichts berechnet**; die Regeln sind trotzdem schon so eingebaut, wie sie später gelten sollen.

## 1. Das Modell in einem Satz

Hauseigentümer messen mit Fensterino kostenlos und bekommen ihr Aufmaßblatt als PDF. Fensterbauer zahlen je **Projekt mit eingegangenem Aufmaß**, weil ihnen die Anfahrt zum Erstaufmaß erspart bleibt. Das Aufmaßblatt des Eigentümers trägt die Einladung an den Fensterbauer; so finden Betriebe zu Fensterino, ohne dass wir sie einzeln anschreiben.

## 2. Was gezählt und berechnet wird

| Ereignis | Gebucht als | Preis | Wann genau |
|---|---|---|---|
| Aufmaß geht in einem Projekt ein (aus Link, Einladungsliste oder per Code vom Kunden) | Position `aufmass`, Schlüssel = Projekt | die ersten 3 je Betrieb kostenlos, danach 9 € netto; mit Betrieb Plus inklusive | beim **ersten Eingang je Projekt**, zum Tarif in diesem Moment |
| Nachbesserung im selben Projekt | nichts | 0 € | höchstens 2 Runden, bis 30 Tage nach dem Eingang |
| Nachbesserung ohne jede Überschneidung mit dem bisherigen Aufmaß | Position `aufmass`, Schlüssel = Projekt + Runde | wie ein neues Aufmaß | beim Eingang, mit Hinweis an den Betrieb |
| Betrieb Plus | Position `plus`, Schlüssel = Monat | 79 € je Monat | beim Aktivieren und dann am Monatsanfang; Wechsel zurück gilt zum Monatsende |
| Hauseigentümer: App und PDF | – | 0 € | – |

Nicht berechnet werden: Projekte anlegen, Links und Einladungslisten verschicken, Beispieldaten (`demo`), gesperrte Aufmaße ohne Zahlungsart (sie warten).

**Eine Buchung wird nie geändert oder gelöscht.** Projekte löschen oder den Tarif wechseln ändert gebuchte Positionen nicht; Korrekturen laufen über eine Gutschrift.

## 3. Wo die Bezahlung einsetzt

- **Zahlungsart erst, wenn sie gebraucht wird.** Registrieren, Projekte, Links und die ersten drei Aufmaße gehen ohne. Das vierte Aufmaß kommt an, wird gespeichert und **gesperrt**: Der Betrieb sieht Positionen und Fotozahl, aber keine Maße, bis eine Zahlungsart hinterlegt ist. Danach werden wartende Aufmaße der Reihe nach gebucht und freigeschaltet. Das ist absichtlich der Moment mit dem größten Nutzen: Das Aufmaß liegt schon da.
- **Betrieb Plus:** Zahlungsart beim Aktivieren; die erste Monatsposition entsteht sofort.
- **Abbuchung:** alle zwei Wochen als Sammelrechnung (SEPA-Firmenlastschrift oder Karte). Im Pilot nur angezeigt.
- Der **Kunde zahlt nie**, weder für Link, Messen, Versand noch für seine PDF.

## 4. Nachbesserung statt zweiter Rechnung

1. Im Projekt: **„Nachbesserung anfragen“** mit Hinweis, was der Kunde prüfen soll. Der Link bekommt eine Runde (`~2`) und 14 Tage neue Laufzeit, die Nachricht enthält den Hinweis.
2. Der Kunde öffnet den Link: Sein gesendetes Aufmaß wird wieder bearbeitbar, alle Angaben bleiben. Auf einem anderen Gerät misst er nur die betroffenen Fenster neu; der Code trägt dann `m: 1` und der Betriebsbereich **ersetzt nur die passenden Positionen** (gleicher Name oder gleiche Maße ±3 %) und behält den Rest.
3. Der neue Code trägt die Runde. Er wird nur angenommen, wenn für dieses Projekt eine Nachbesserung offen ist und die Runde passt; das alte Aufmaß wird als Fassung aufgehoben, **gebucht wird nichts**.

Schranken gegen Missbrauch (ein Projekt als Sammelstelle für viele Kunden): höchstens **2 Runden** je Projekt, nur **bis 30 Tage** nach dem Eingang; ein Aufmaß **ohne jede Überschneidung** mit dem bisherigen gilt als anderes Aufmaß und wird gebucht; der Betrieb sieht die Regel vorher im Anfrage-Fenster.

## 5. Zwei Wege, auf denen ein Aufmaß zum Betrieb kommt

**Über den Link des Betriebs** (einzeln oder aus einer Einladungsliste): Der Betrieb hat den Kunden eingeladen. Zusage an den Betrieb: *Ihr Kunde bleibt Ihr Kunde.* Der Kunde sieht im Link nur diesen Betrieb, keine anderen Anbieter, keine Werbung. Eine Kopie mit Maßen bekommt er vom Betrieb (PDF mit dem Angebot), nicht von uns; nach dem Senden zeigt die App ihm seine Positionen ohne Maßliste. Das ist eine Bremse, kein Schloss, und mehr wäre gegen die Daten des Kunden selbst gerichtet.

**Vom Kunden selbst** (ohne Link): Der Kunde misst von sich aus, sein Aufmaß gehört ihm, die PDF ist kostenlos und vollständig. Auf jeder Seite steht „Erstellt mit Fensterino“, am Ende ein Block für den Fensterbauer: was Fensterino ihm bringt (Kunden per Link einladen statt hinfahren, Projekte verwalten, Nachbesserung, PDF mit Logo), ein QR-Code zur kostenlosen Anmeldung (`?von=pdf`) und der Aufmaß-Code zum Einfügen. Holt der Betrieb das Aufmaß in sein Konto, entsteht ein Projekt und zählt wie jedes andere. Kein Anmeldezwang zum Lesen: Wer die PDF nur lesen will, braucht kein Fensterino; wer sie weiterverarbeiten will, meldet sich an, weil es ihm etwas bringt. So erreicht jedes Kunden-Aufmaß einen Betrieb, den wir nie angeschrieben haben.

Eine Missbrauchsgrenze auf Kundenseite braucht es nicht: Der Kunde zahlt nichts und kann nichts umgehen.

## 6. Was heute umgangen werden kann, und was der Server später erzwingt

Im Pilot liegt alles im Browser des Betriebs. Wer will, löscht seine Website-Daten und hat wieder drei kostenlose Projekte. Das ist bekannt und in der Pilotphase in Ordnung, weil nichts berechnet wird. Für den echten Betrieb gehört jede Zählung auf den Server:

| Lücke heute | Später auf dem Server |
|---|---|
| Zähler im Browser | Buchungen in der Datenbank, Zählung beim Eingang über eine Server-Funktion, nicht im Client |
| Mehrere Konten für mehr Freikontingent (heute nur Heuristik über Telefon und Firmenname) | Freikontingent je **geprüftem Betrieb**: Telefonnummer, IBAN-Fingerabdruck und Umsatzsteuer-ID als Schlüssel; `dupOf` sperrt das Kontingent, nicht das Konto |
| Link-Codes entstehen im Browser | Codes vergibt der Server beim Anlegen des Projekts, mit Ablaufdatum und Runde; der Aufmaß-Code wird vom Server geprüft (Projekt, Runde, offene Nachbesserung) |
| Überschneidungsprüfung im Client | dieselbe Prüfung serverseitig beim Eingang, Ergebnis in der Buchung festgehalten |
| Zahlungsart ist eine Eingabe | Mandat bzw. Karte über den Zahlungsdienstleister; Freischalten erst nach dessen Bestätigung |
| Plus-Monate als Felder | eigenes Hauptbuch: eine Tabelle mit Art (`aufmass`, `plus`, `gutschrift`), Bezug, Betrag, Zeitpunkt |

Was auch heute schon nicht geht, weil es die Regeln selbst verhindern: zweimal für dasselbe Projekt zahlen, ein Aufmaß nach dem Senden still verändern (der Code ist eingefroren), ohne vollständiges Fenster senden, einen Code doppelt einlesen.

## 7. Anreize, so wie sie gebaut sind

**Betrieb:** Einstieg ohne Risiko (keine Zahlungsart, drei echte Projekte gratis, der Nutzen kommt vor der ersten Rechnung); 9 € stehen neben dem, was sie ersetzen (Anfahrt, Stunde), der Rechner auf der Startseite zeigt, ab wann Plus günstiger ist (ab 9 Projekten im Monat); Nachbesserung kostenlos, damit 9 € nie zum Streitfall werden; Einladungslisten, damit ein Betrieb mit einer Aktion zehn Kunden auf einmal zum Messen bringt.

**Hauseigentümer:** alles kostenlos, kein Konto, Daten bleiben auf dem Gerät, kleine Erfolgsmomente beim Messen, ein PDF, das jeder Fensterbauer lesen kann.

**Offene Fragen für später** (bewusst noch nicht gebaut): Staffelpreise ab vielen Projekten im Monat ohne Plus, ein Teamkonto mit mehreren Mitarbeitern, Rabatt für Jahreszahlung, und ob Plus-Betriebe ihren Link-Kunden eine PDF mit eigenem Logo freigeben dürfen (ein Argument mehr für Plus).

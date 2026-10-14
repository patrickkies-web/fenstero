# Abrechnung: Regeln, Zählung, Schranken

Stand: Pilotphase. Dieses Dokument ist die Vorgabe für die spätere Server-Umsetzung. Im Pilot läuft alles im Browser und **es wird nichts berechnet**; die Regeln sind trotzdem schon so eingebaut, wie sie später gelten sollen, damit Betriebe und Kunden sie heute kennenlernen und nichts umgestellt werden muss.

## 1. Was gezählt und berechnet wird

| Ereignis | Gebucht als | Preis | Wann genau |
|---|---|---|---|
| Aufmaß eines **eigenen Kunden** geht ein | Position `aufmass`, Schlüssel = Projekt | die ersten 3 je Betrieb kostenlos, danach 9 € netto; mit Betrieb Plus inklusive | beim **ersten Eingang je Projekt**, zum Tarif in diesem Moment |
| Nachbesserung im selben Projekt | nichts | 0 € | höchstens 2 Runden, bis 30 Tage nach dem Eingang |
| Nachbesserung, die mit dem bisherigen Aufmaß **keine Position gemeinsam** hat | Position `aufmass`, Schlüssel = Projekt + Runde | wie ein neues Aufmaß | beim Eingang, mit Hinweis an den Betrieb |
| Betrieb Plus | Position `plus`, Schlüssel = Monat | 79 € je Monat | beim Aktivieren und dann am Monatsanfang; Wechsel zurück gilt zum Monatsende |
| Eigentümer gibt Kontakt frei (Portal) | `charge`, Schlüssel = Anfrage | 29 / 59 / 89 / 129 € nach Fensterzahl, Plus −30 % | beim Freigeben; zuerst aus dem Startguthaben, der Rest auf die Sammelrechnung |
| Freigabe zurückgezogen oder Fair-Regel | `charge` → `gutschrift` | verrechnetes Guthaben kommt zurück, der Rest wird nicht berechnet | sofort bzw. frühestens 7 Tage nach der Freigabe |
| Kunde: PDF des eigenen Aufmaßes | – | im Pilot kostenlos (später 19,90 €) | – |

Nicht berechnet werden: Projekte anlegen, Links verschicken, anklopfen, Beispieldaten (`demo`), gesperrte Aufmaße ohne Zahlungsart (sie warten).

**Eine Buchung wird nie geändert oder gelöscht.** Projekte löschen, Tarif wechseln oder ein Aufmaß zurückziehen ändert gebuchte Positionen nicht; Korrekturen laufen immer über eine Gutschrift.

## 2. Wo die Bezahlung eingeleitet wird

- **Zahlungsart erst, wenn sie gebraucht wird.** Registrieren, Projekte, Links und die ersten drei Aufmaße gehen ohne. Das vierte Aufmaß geht ein, wird gespeichert und **gesperrt**: Der Betrieb sieht Positionen und Fotozahl, aber keine Maße, bis eine Zahlungsart hinterlegt ist. Danach werden wartende Aufmaße der Reihe nach gebucht und freigeschaltet. Das ist absichtlich der Moment mit dem größten Nutzen: Das Aufmaß liegt schon da.
- **Portal-Zusatz:** Zahlungsart bei der Registrierung, weil Freigaben sofort Geld kosten; dafür 100 € Startguthaben, Anklopfen bleibt kostenlos.
- **Betrieb Plus:** Zahlungsart beim Aktivieren; die erste Monatsposition entsteht sofort.
- **Abbuchung:** alle zwei Wochen als Sammelrechnung (SEPA-Firmenlastschrift oder Karte). Im Pilot nur angezeigt.
- Der **Kunde zahlt nie** für Link, Messen oder Versand. Das steht an jeder Stelle, an der er es sich fragen könnte.

## 3. Nachbesserung statt zweiter Rechnung

Ein fehlerhaftes Aufmaß soll den Betrieb nichts kosten:

1. Im Projekt: **„Nachbesserung anfragen“** mit Hinweis, was der Kunde prüfen soll. Der Link bekommt eine Runde (`~2`) und 14 Tage neue Laufzeit, die Nachricht enthält den Hinweis.
2. Der Kunde öffnet den Link: Sein gesendetes Aufmaß wird wieder bearbeitbar, alle Angaben bleiben. Auf einem anderen Gerät misst er nur die betroffenen Fenster neu; der Code trägt dann `m: 1` und das Portal **ersetzt nur die passenden Positionen** (gleicher Name oder gleiche Maße ±3 %) und behält den Rest.
3. Der neue Code trägt die Runde. Das Portal nimmt ihn nur an, wenn für dieses Projekt eine Nachbesserung offen ist und die Runde passt; das alte Aufmaß wird als Fassung aufgehoben, **gebucht wird nichts**.

Schranken gegen Missbrauch (ein Projekt als Sammelstelle für viele Kunden):
- höchstens **2 Runden** je Projekt, nur **bis 30 Tage** nach dem Eingang;
- ein Aufmaß **ohne jede Überschneidung** mit dem bisherigen (keine Position mit gleichem Namen oder gleichen Maßen) gilt als anderes Aufmaß und wird gebucht; der Betrieb sieht das vorher im Anfrage-Fenster und hinterher als Hinweis;
- Projektname und Kunde stecken im Link; ein Nachbesserungs-Link funktioniert nur für genau dieses Projekt.

## 4. Was heute umgangen werden kann, und was der Server später erzwingt

Im Pilot liegt alles im Browser des Betriebs. Wer will, löscht seine Website-Daten und hat wieder drei kostenlose Aufmaße. Das ist bekannt und in der Pilotphase in Ordnung, weil nichts berechnet wird. Für den echten Betrieb gehört jede Zählung auf den Server:

| Lücke heute | Später auf dem Server |
|---|---|
| Zähler im Browser | Buchungen in der Datenbank, Zählung beim Eingang über eine Server-Funktion, nicht im Client |
| Mehrere Konten für mehr Freikontingent (heute nur Heuristik über Telefon und Firmenname) | Freikontingent je **geprüftem Betrieb**: Gewerbenachweis, Telefonnummer und IBAN-Fingerabdruck als Schlüssel; `dupOf` sperrt das Kontingent, nicht das Konto |
| Link-Codes entstehen im Browser | Codes vergibt der Server beim Anlegen des Projekts, mit Ablaufdatum und Runde; der Aufmaß-Code wird vom Server geprüft (Projekt, Runde, offene Nachbesserung) |
| Überschneidungsprüfung im Client | dieselbe Prüfung serverseitig beim Eingang, Ergebnis in der Buchung festgehalten |
| Zahlungsart ist eine Eingabe | Mandat bzw. Karte über den Zahlungsdienstleister; Freischalten erst nach dessen Bestätigung |
| Startguthaben, Gutschriften, Plus-Monate als Felder | eigenes Hauptbuch: eine Tabelle mit Art (`aufmass`, `plus`, `kontakt`, `gutschrift`), Bezug, Betrag, Zeitpunkt; Guthaben ist eine Summe, kein Feld |

Was auch heute schon nicht geht, weil es die Regeln selbst verhindern: zweimal für dasselbe Projekt zahlen, ein Aufmaß nach dem Senden still verändern (der Code ist eingefroren), ohne vollständiges Fenster senden, einen Code doppelt einlesen, nach einer Absage erneut anklopfen, bei pausierten oder zurückgezogenen Aufmaßen anklopfen, eine Gutschrift vor dem siebten Tag, einen bezahlten Kontakt durch Löschen des Aufmaßes verlieren.

## 5. Anreize, so wie sie gebaut sind

**Betrieb**
- Einstieg ohne Risiko: kein Konto-Zwang mit Zahlungsart, drei echte Aufmaße gratis, der erste Nutzen (eingesparte Anfahrt) kommt vor der ersten Rechnung.
- Der Preis je Aufmaß (9 €) steht neben dem, was er ersetzt (Anfahrt, Stunde). Der Rechner auf der Startseite zeigt die Schwelle, ab der Plus günstiger ist (ab 9 Aufmaßen im Monat).
- Plus lohnt sich über zwei Hebel: unbegrenzte Aufmaße und 30 % günstigere Portal-Kontakte, dazu Logo und Farbe beim Kunden.
- Portal: anklopfen kostet nichts, bezahlt wird erst die Freigabe durch den Eigentümer; Fair-Regel, wenn der Kunde nicht erreichbar ist. Das senkt die Hemmschwelle, überhaupt anzuklopfen.
- Nachbesserung kostenlos: Ein schlechtes Aufmaß wird nicht zum Streitfall über 9 €.

**Kunde (Eigentümer)**
- Alles kostenlos, kein Konto, Daten bleiben anonym bis zur Freigabe, höchstens drei Betriebe bekommen den Kontakt, Freigabe jederzeit zurückziehbar.
- Kleine Erfolgsmomente beim Messen (Alle Maße da, Fenster gespeichert, abgeschickt) und ein PDF für die eigenen Unterlagen.

**Offene Fragen für später** (bewusst noch nicht gebaut): Staffelpreise ab vielen Aufmaßen im Monat ohne Plus, ein Teamkonto mit mehreren Mitarbeitern, Rabatt für Jahreszahlung, und ob die 19,90 € für die Kunden-PDF nach dem Pilot bleiben.

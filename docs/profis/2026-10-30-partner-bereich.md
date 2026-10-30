# Bereich für Fensterbauer, Register und Partner (30.10.2026)

## Auftrag des Inhabers

Nach dem ersten Tag mit der Vermittlung (Weiche, Betriebe sofort) wünschte er sich die nächste Stufe, in seinen Worten:

- **Lexikon der Betriebe in der Zentrale:** jeder Betrieb, den Kunden je gewählt haben, mit den vermittelten Kunden, ob erreicht, was
  der Anruf ergab, wie viele Aufmaße er bekommen hat und wer abgelehnt hat. Doppelte Betriebe zusammenführen („Name und Adresse,
  das ist schon sehr sicher“).
- **Kundenabschnitt in der Anfrage:** von dort E-Mails an den Kunden schicken, damit er weiß, was im Hintergrund passiert.
- **Keine Kundendaten per E-Mail:** Der Fensterbauer bekommt eine Mail mit einem Link auf eeziframes.com. Dort ein angenehmer, klarer
  „Kundenbereich für Fensterbauer“: die Anfrage, das Aufmaßblatt als PDF zum Drucken, darunter Knöpfe im Stil der Seite: ins Register
  eintragen (leichtere Kommunikation, künftige Anfragen automatisch), Bereitschaft erklären, für Vermittlungen zu bezahlen (das erste
  Aufmaß kostenlos, ab dem zweiten 29 € je vermitteltes Aufmaß); solche Betriebe stehen bei Kunden aus ihrer Umgebung auf den ersten
  beiden Plätzen („lass uns mal die ersten zwei nehmen“); den Vorteil erklären; Werbung für die Pakete; der Hinweis, dass die
  Telefonnummern per Code bestätigt sind („Existenz garantiert“).
- **Anmelden auf der Startseite**, im Umschalter Fensterbauer; ein Bereich für beide Arten von Fensterbauern (Pakete und Vermittlung),
  ohne Mahnung „kein Paket gebucht“, im Design der Seite.
- **Auf Rückfrage:** Abrechnung je Aufmaß (er ruft an, schickt den Zugang, der Betrieb schaltet im Bereich frei und zahlt bei Stripe);
  Preis 29 € netto zzgl. USt; Etikett „Partner“ und ein Satz zur Reihenfolge in der App.

## Umsetzung

| Wo | Was | Warum |
| --- | --- | --- |
| Zugang statt Anhang | Die Mail an den Betrieb enthält Ort, Eckdaten, „per Code bestätigt“ und einen Link; kein Name, keine Nummer, kein PDF. Der Link gilt 180 Tage. | sein Wunsch; die Daten bleiben bei eeziframes, bis der Betrieb sie im Bereich abruft |
| Vorschau ohne Anmeldung | Der Link zeigt die Anfrage ohne Kontaktdaten; zum Abrufen meldet sich der Betrieb mit genau der Adresse an, an die der Zugang ging (Code per Mail). | Niemand, der den Link weiterleitet, kommt an Kundendaten |
| Ein Bereich | `/konto/` für Paketkunden und Vermittlung zugleich; die Übersicht zeigt, was da ist, und nennt die Pakete als Angebot, nicht als Mahnung. | „nicht zwei separate Bereiche“ |
| Freischalten | Erstes Aufmaß je Betrieb kostenlos, danach 29 € zzgl. USt (34,51 € brutto) über Stripe, Karte; vorher die Zustimmung zu den Partnerbedingungen. Danach Kontakt, PDF; der Kunde bekommt eine Mail, welcher Betrieb sein Aufmaß abgerufen hat. | seine Abrechnung je Aufmaß; der Kunde soll wissen, wer seine Daten hat |
| Partner | Ein Betrieb mit Konto erklärt die Bereitschaft; in der Suche stehen Partner im Umkreis von 30 km auf Platz 1 und 2, mit dem Etikett „Partner“; darunter ein Satz zur Reihenfolge. | „die ersten zwei“, „Etikett „Partner“ und ein Satz“ |
| Register | Jeder gewählte Betrieb bekommt beim Senden einen Eintrag (Kennung aus Name und Ort, Aliase für Doppelte über Nummer und Website); Zähler je Betrieb: Anfragen, Will, Will nicht, Nicht erreicht, Zugänge, Geöffnet, Kostenlos, Bezahlt, Umsatz. | sein Lexikon; Doppelte zusammengeführt |
| Zentrale | Reiter „Betriebe“ mit Suche und Filtern (Partner, Kontakt, Neu, Abgelehnt), Detailseite je Betrieb mit Zahlen, Kontakt, Stand, Anfragen, Notiz, Verlauf; in der Anfrage der Kundenabschnitt mit drei Vorlagen und freiem Text, die Mails werden festgehalten; „Zugang schicken“ statt „Aufmaß schicken“. | sein Lexikon und Kundenabschnitt |
| Recht | Neue Seite `/partnerbedingungen/` (Stand 30.10.2026); Datenschutz 6a und 9, AGB § 4a angepasst. **Vor dem Onlinegang vom Anwalt prüfen lassen**, Fragen 10 bis 14 in docs/VERMITTLUNG-RECHT.md. | Preis, Zugang, Daten des Kunden und Partnerplatz brauchen eine Grundlage |

Technik und Datenmodell: docs/VERMITTLUNG.md, Abschnitt 13. Datenbank: neue Tabelle `vermittlung_betriebe` in `supabase/schema.sql`, die vor
dem Onlinegang in Supabase angelegt werden muss (docs/ONLINE-STELLEN.md).

## Gremium, eine Runde (simuliert, keine Marktforschung)

**Gestalter (Jonas Veit):** Beide Seiten tragen die Hand der Zentrale und der Startseite: Anthrazit-Karte mit tonalem Abfall und der
Zahl als Held, weiße Karten mit Zeilen, Chips in Indigo für Zustände, eine volle Pille je Bildschirm. Im Bereich für Fensterbauer
ist die Pille „Freischalten“ die eine Handlung; alles andere (Partner, eigener Betrieb, Pakete) sind Umriss-Knöpfe oder runde Knöpfe.
Kann: Im Lexikon der Zentrale stehen je Zeile fünf Zahlen, das ist dicht; die Suche oben fängt das auf.

**Kunden (Renate Vogel):** Sie bekommt jetzt eine Mail, sobald ein Betrieb ihr Aufmaß abgerufen hat, und findet das richtig: „Dann
weiß ich, wer meine Nummer hat.“ Kai Hofmann sieht in der App das Etikett „Partner“ und den Satz dazu und versteht, dass die Betriebe
dafür bezahlen; er wählt trotzdem nach Entfernung. Kein Veto.

**Fensterbauer (Klaus Brandt):** Der Link statt des Anhangs ist ihm recht, solange die Anmeldung schnell geht: Code per Mail, kein
Passwort. Das erste Aufmaß kostenlos nimmt er als Probe; 29 € netto für ein Aufmaß mit bestätigter Nummer hält er für fair, wenn der
Kunde wirklich erreichbar ist. Tobias Reuter fragt, ob er als Partner alle Anfragen bekommt; nein, der Kunde wählt weiter selbst, Partner
stehen nur vorn. Das soll im Bereich klar stehen, und es steht dort.

| Änderung | Urteil | Hand |
| --- | --- | --- |
| Zugang per Link statt Daten per Mail | behalten | 5 |
| Ein Bereich für Pakete und Vermittlung | behalten | 4–5 |
| Erstes Aufmaß kostenlos, dann 29 € netto, Freischalten mit Zustimmung | behalten | 4 |
| Partner auf Platz 1 und 2 mit Etikett und Satz | behalten | 4 |
| Lexikon mit Zählern, Detailseite, Kundenabschnitt | behalten | 4–5 |
| Kann: Zahlen je Zeile im Lexikon ausdünnen | offen | – |

Muss-Punkte und Vetos: keine.

## Messung

Farbanteile je Bildschirm mit `werkzeuge/farben.py`; Telefon 390 × 844, Laptop 1280 × 800. Indigo auf den Betriebe-Seiten der Zentrale
ist das Leuchten der Kennzahl-Kachel (dieselbe Kachel wie in der Vermittlung), Violett nur Punkt, Chip und gewählte Kapsel.

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt |
| --- | --- | --- | --- | --- | --- |
| Konto, Zugang, Telefon | 98,7 | 0,0 | 0,0 | 1,3 | 1,3 |
| Konto, Anfrage freigeschaltet, Telefon | 98,9 | 0,0 | 0,0 | 1,1 | 1,1 |
| Konto, Übersicht mit Partner, Telefon | 99,6 | 0,0 | 0,0 | 0,3 | 0,4 |
| Konto, Zugang, Laptop | 99,3 | 0,0 | 0,0 | 0,7 | 0,7 |
| Konto, Anfrage freigeschaltet, Laptop | 99,5 | 0,0 | 0,0 | 0,5 | 0,5 |
| Konto, Übersicht mit Partner, Laptop | 99,6 | 0,0 | 0,0 | 0,3 | 0,4 |
| Zentrale, Betriebe, Telefon | 92,6 | 2,1 | 0,1 | 5,2 | 7,4 |
| Zentrale, ein Betrieb, Telefon | 92,7 | 0,0 | 0,0 | 7,2 | 7,3 |
| Zentrale, Anfrage mit Kundenabschnitt, Telefon | 99,3 | 0,0 | 0,7 | 0,0 | 0,7 |
| Zentrale, Betriebe, Laptop | 96,4 | 0,7 | 0,0 | 2,9 | 3,6 |
| Zentrale, ein Betrieb, Laptop | 96,1 | 0,0 | 0,0 | 3,9 | 3,9 |
| Zentrale, Anfrage mit Kundenabschnitt, Laptop | 99,5 | 0,0 | 0,5 | 0,0 | 0,5 |

Bilder (Telefon, ganze Seite): `bilder/2026-10-30-konto-zugang.jpg`, `-konto-anfrage.jpg`, `-konto-uebersicht.jpg`,
`bilder/2026-10-30-zentrale-betriebe.jpg`, `-zentrale-betrieb.jpg`, `-zentrale-kundenabschnitt.jpg`.

## Prüfungen

Abschnitt 31 (31.5 angepasst, 31.7 neu):

- **Zugang:** Mail ohne Anhang und ohne Kontaktdaten, Link gilt, verändertes Token 410.
- **Vorschau ohne Anmeldung**, Annehmen nur mit der richtigen Adresse (fremd 403, ohne 401).
- **Freischalten:** kostenlos nur mit Zustimmung, PDF vorher 402, danach 200; Mail an den Kunden; zweites Aufmaß zur Kasse (29 € netto),
  nach der Rückkehr bezahlt; fremde Kasse 400.
- **Partner:** Bereitschaft nur mit Zustimmung und eigenem Betrieb; Platz 1 und 2 in der Suche; zurückgenommen wieder nach Entfernung.
- **Register:** Liste, Detail, Stand, Notiz, Neuaufbau, Doppelte über Nummer und Website.
- **Kundenmail** aus der Zentrale (400 ohne Text, 409 ohne Adresse).
- **Rechtsseite** `/partnerbedingungen/` im Impressum, Datenschutz und in den AGB verlinkt.
- **App:** Etikett „Partner“ (Indigo) am ersten Eintrag und der Satz zur Reihenfolge.
- **Bereich im Browser (31.K, Telefon und Schreibtisch):** Zugang über den Link ohne Kunde, Code, Freischalten nur mit Häkchen, Kontakt und
  PDF, Übersicht mit „Freigeschaltet“, Bereitschaft nur mit Häkchen; eine Pille je Bildschirm, Ziele 44 px, Schrift ab 13 px, keine
  Konsolenfehler; Ring „Anmelden“ auf der Seite für Fensterbauer.

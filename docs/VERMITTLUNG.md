# Vermittlung „Angebote aus deiner Nähe“: echte Daten, maximaler Verdienst

Entwurf vom 29.10.2026, noch nicht gebaut. Grundlage: Gespräch mit dem Inhaber am 29.10.2026 (Fake-Daten, „9,99 € oder kostenlos“,
Geld zurück, Handynummer als Echtheitsprüfung, KI sucht Betriebe), Gremium `docs/profis/2026-10-29-geschaeftsmodell.md`. Alle Preise und Quoten mit **[Annahme]** sind Startwerte zum
Testen, keine Marktdaten.

## Die Regel in einem Satz

Jede Planung endet entweder als **bestätigte Anfrage an bis zu drei Partnerbetriebe** (für den Hauseigentümer kostenlos, der Betrieb
zahlt je Anfrage) oder als **bezahltes Aufmaßblatt** (9,99 €). Anonym und kostenlos gibt es nichts zum Mitnehmen.

**Auf dem kostenlosen Weg bekommt der Kunde kein Aufmaßblatt.** Das Blatt geht nur an die Betriebe; der Kunde bekommt, was er
eigentlich will: Angebote. Wer das Blatt selbst haben will, zahlt (Nachtrag 29.10.2026 auf den Einwand des Inhabers: „Der Kunde gibt
Fake-Daten ein, klickt die Einwilligung, kriegt sein Aufmaß, und ich kann nichts vermarkten.“).

Warum Fake-Daten damit nichts mehr bringen:

| Der Kunde … | bekommt |
|---|---|
| gibt eine falsche Handynummer ein | nichts: ohne SMS-Code geht keine Anfrage raus |
| gibt eine falsche E-Mail ein | egal: Der Betrieb ruft unter der bestätigten Nummer an |
| gibt echte Daten ein, will aber nur das Blatt | kein Blatt (das geht an die Betriebe); er wird angerufen, wie er eingewilligt hat. Wer 20 bis 30 Minuten seine Fenster ausmisst, plant ein Fensterprojekt; für den Betrieb ist das ein echter Kontakt |
| zahlt 9,99 € | sein Blatt; er ist kein Lead, aber Umsatz |
| schließt die App | nur die Zahlen, die er selbst gemessen hat („keine Gesamtübersicht“) |

**Die Handynummer ist die Echtheitsprüfung** (Entscheidung des Inhabers, 29.10.2026). Eine E-Mail-Adresse ist in einer Minute
angelegt, eine deutsche Handynummer nicht: Prepaid-Karten gibt es in Deutschland seit 2017 nur gegen Ausweis. Deshalb ist der
SMS-Code Pflicht, die E-Mail bekommt keinen Code (ein Schritt weniger). Stimmen die übrigen Angaben nicht, ist das so: Die Nummer
ist echt, und darauf kommt es dem Betrieb an.

Der Hauseigentümer will keinen Plan, er will einen Preis. Den gibt ihm nur ein Betrieb. Wer schummelt, bekommt kein Angebot und kein
Blatt; er war nie eine Anfrage, sondern ein Neugieriger. Er kostet einen Klick und ein paar KI-Auswertungen, und genau die werden
begrenzt (Abschnitt 2).

## 1. Der Weg des Hauseigentümers

### Planen (wie heute)

Kostenlos, ohne Konto. Neu: Ohne bestätigte E-Mail oder Handynummer laufen höchstens **8 KI-Auswertungen je Gerät und Tag**
**[Annahme]**, danach „Bestätige kurz deine E-Mail oder Handynummer, dann geht es mit der Auswertung weiter“. So holen wir den Kontakt früh, und Bots und Sammler zahlen
uns keine KI mehr. Nach dem Speichern bleibt es bei „keine Gesamtübersicht“.

### Am Ende: zwei Türen

```
┌───────────────────────────────────────────────────────────────┐
│  Angebote von Fachbetrieben aus deiner Nähe      kostenlos     │
│  Wähle bis zu 3 Betriebe. Sie bekommen dein Aufmaß             │
│  und melden sich mit ihrem Angebot bei dir.                    │
│  [ Betriebe wählen ]                                           │
│                                                                │
│  Kostenlos für dich, weil die Betriebe uns für die             │
│  Vermittlung bezahlen.                                         │
└───────────────────────────────────────────────────────────────┘
   Lieber nur für dich? Aufmaßblatt ohne Weitergabe: 9,99 €
```

Die kostenlose Tür steht groß, die bezahlte klein: Eine vermittelte Anfrage bringt ein Vielfaches von 9,99 € (Abschnitt 4).

### Tür A: Angebote einholen (kostenlos)

1. **Betriebe wählen.** Angezeigt werden höchstens fünf Partner, deren Gebiet die Postleitzahl des Kunden abdeckt und deren
   Monatsdeckel nicht voll ist: Name, Ort, Entfernung, Materialien (Kunststoff, Holz, Alu), „antwortet meist innerhalb von X Stunden“.
   Der Kunde wählt aktiv bis zu drei; ein Knopf „Alle drei wählen“ ist erlaubt, vorausgewählte Häkchen nicht. Reihenfolge nach
   Entfernung und Antwortquote; bezahlte Platzierung (Stufe 3) nur mit dem Etikett „Anzeige“.
2. **Kontakt und zwei Fragen.** Name, Handynummer, E-Mail, Postleitzahl und Ort; Straße freiwillig („für den Termin vor Ort“). Dazu je
   ein Tipp: „Bist du Eigentümer?“ (Ja, Nein) und „Wann soll es losgehen?“ (sofort, in 3 Monaten, in 6 Monaten, später; das Feld
   `zeit` gibt es schon).
3. **Einwilligung.** Ein leerer Haken mit den Namen der gewählten Betriebe: „Ich möchte, dass [Betrieb 1], [Betrieb 2] mein Aufmaß
   und meine Kontaktdaten bekommen und mich für ein Angebot kontaktieren. eeziframes fragt nach zwei Tagen kurz nach, ob sich jemand
   gemeldet hat.“
4. **SMS-Code an die Handynummer** (Pflicht). Wer nur Festnetz hat, bekommt den Code per Anruf mit Ansage. Die E-Mail bekommt keinen
   Code, nur die Prüfung auf Tippfehler („gmial.com“ → „gmail.com?“) und Wegwerf-Domains. Mit dem Code entsteht das Konto und das
   Aufmaß ist gesichert (Anmeldung per Telefon: Supabase kann Codes per SMS schicken; sonst ein eigener Weg neben `auth.js`).
5. **Prüfung** (automatisch, Abschnitt 2). Besteht die Anfrage nicht, sagt die App, was fehlt (zum Beispiel „Bitte prüfe deine
   Postleitzahl“); ein Lead ohne Prüfung geht nie raus.
6. **Versand an die Betriebe.** Mail mit Aufmaßblatt-PDF und Link an jeden gewählten Betrieb. Der Kunde sieht in seinem Konto, welche
   Betriebe seine Anfrage haben und wann, aber kein Blatt und keine Gesamtübersicht. Darunter klein: „Dein Aufmaßblatt für dich selbst:
   9,99 €“.
7. **Nach zwei Werktagen** eine SMS an den Kunden (die Nummer ist sicher, die E-Mail vielleicht nicht): „Hat sich ein Betrieb gemeldet?“ mit drei Knöpfen (Ja, Termin vereinbart; Ja,
   noch kein Termin; Nein). **Nach 14 Tagen:** „Wie war es?“ (Bewertung je Betrieb, später sichtbar).

### Tür B: Nur für mich (9,99 €)

- Die vorhandene Kasse (`functions/api/zahlung.js`) mit neuem Betrag: bis 17.11.2026 bleibt es bei 7,99 € (so steht es auf der
  Seite), ab 18.11.2026 **9,99 €** statt der bisher geplanten 12,99 €.
- Danach in der App und in der Mail: „Doch Angebote? Schick dein Aufmaß innerhalb von 30 Tagen an Partnerbetriebe, dann bekommst du
  die 9,99 € zurück.“ Die Anfrage läuft durch Tür A (SMS-Code, alle Prüfungen). Erstattet wird automatisch, wenn **7 Tage nach dem
  Versand kein Betrieb wegen falscher Kontaktdaten reklamiert** hat; kein Betrieb muss dafür etwas bestätigen. Stripe behält bei einer
  Erstattung seine Gebühr (bei 9,99 € etwa 0,40 €, Stand prüfen).
- Wer bezahlt hat, schickt das Blatt weiter, an wen er will (wie heute per WhatsApp oder E-Mail).

### Wenn es noch keinen Partner gibt

Am Anfang der Normalfall. Tür A heißt dann **„Betrieb für mich suchen: kostenlos“**: gleicher Ablauf, die Einwilligung nennt „einen
geprüften Fensterfachbetrieb im Umkreis von 50 km“, den Namen bekommt der Kunde per SMS bzw. Mail, sobald er feststeht. Ein Blatt
bekommt er auch hier nicht.

**Die KI sucht, du rufst an** (Idee des Inhabers, 29.10.2026, in der rechtlich sicheren Form):

1. **KI-Suche.** Die Anfrage landet in der Zentrale auf der Liste „Betrieb gesucht“. Die KI sucht drei bis fünf Fensterbauer im
   Umkreis (Websuche über die Claude-Schnittstelle, die das Projekt schon nutzt; Kosten je Suche vor dem Bau prüfen), liest ihre
   Website (baut der Betrieb Fenster ein? Kunststoff, Holz, Alu?) und legt Name, Ort, Entfernung, Telefon und Website als
   **Anrufliste neben die Anfrage**. Sie schreibt niemanden an.
2. **Du rufst an**, mit der Anfrage in der Hand: „Ich habe einen Kunden in Clarholz, vier Fenster, Kunststoff, Start in drei Monaten.
   Möchten Sie die Anfrage? Die ersten drei sind gratis.“ Etwa drei Minuten je Anruf; das Ergebnis trägst du mit einem Tipp ein
   (will, will nicht, nicht erreicht, später).
3. **Erlaubnis im Gespräch.** „Darf ich Ihnen den Link per Mail schicken?“ Die Zentrale hält Zeitpunkt und Zustimmung fest; erst dann
   geht die Mail raus, mit einem **Einladungslink**.
4. **Registrierung in einer Minute** über den Link: Betrieb, E-Mail-Code, Gebiet, Partnerbedingungen. Danach bekommt er die Anfrage
   sofort, und jede weitere aus seinem Gebiet automatisch. Anrufen musst du nur dort, wo es noch keinen Partner gibt; mit jedem
   Partner seltener.
5. **Findet sich in 5 Werktagen keiner,** bekommt der Kunde eine ehrliche Nachricht, sein Aufmaßblatt kostenlos (die Nummer ist ja
   bestätigt) und die Liste der Betriebe, die die KI gefunden hat. Er schickt das Blatt selbst aus seinem eigenen Mailprogramm oder
   per WhatsApp: seine eigene Anfrage, keine Werbung von uns. Auf dem Blatt steht klein „erstellt mit eeziframes“.

Nicht gebaut wird: eine automatische Mail an Betriebe, die nicht eingewilligt haben (Abschnitt 6).

## 2. Echtheit: sieben Prüfungen

| # | Prüfung | Wann | Kosten | Wirkung |
|---|---|---|---|---|
| 1 | **Bot-Schutz:** Cloudflare Turnstile vor der ersten KI-Auswertung; die vorhandene Bremse `RL_KI` (20 je Minute) plus das Tagesbudget je Gerät ohne bestätigte E-Mail oder Nummer (`budget()` in `bremse.js`) | beim Planen | keine | keine Skripte, keine Sammler auf unsere KI-Kosten |
| 2 | **SMS-Code an die Handynummer** (Pflicht, die eigentliche Echtheitsprüfung); Festnetz per Anruf mit Code; nur deutsche Nummern; höchstens 3 Codes je Nummer und Tag (`budget()` in `bremse.js`) | vor dem Versand | wenige Cent je Code (Anbieterpreis prüfen; Anbieter in der EU bevorzugen, Vertrag zur Auftragsverarbeitung), gegen rund 77 € je Anfrage | jede Anfrage hat eine echte Nummer, hinter der ein Ausweis steht |
| 3 | **E-Mail ohne Code:** Tippfehler-Vorschlag, Wegwerf-Domains gesperrt (offene Liste, Lizenz prüfen) | Eingabe | keine | meist eine brauchbare Adresse; ist sie falsch, ruft der Betrieb an |
| 4 | **Nummer plausibel, bevor ein Code rausgeht:** Format, Länge, Vorwahl; keine Folgen wie 0123456789 oder 1111111 | Eingabe | keine | keine Code-Kosten für Unsinn |
| 5 | **Inhalt vollständig:** mindestens ein Fenster mit allen drei Breiten und Höhen und Fotos innen und außen; Postleitzahl existiert und liegt im Gebiet; Maße plausibel (die App prüft schon gegen das Seitenverhältnis aus der KI) | vor dem Versand | keine | jede Anfrage ist ein brauchbares Erstaufmaß |
| 6 | **Dubletten und Sammler:** gleiche Handynummer, E-Mail oder Adresse innerhalb von 90 Tagen an denselben Betrieb wird nicht berechnet, sondern als Ergänzung geschickt; höchstens **2 kostenlose Anfragen je Person in 90 Tagen**, danach nur Tür B | vor dem Versand | keine | kein Betrieb nutzt die freie App als Gratis-Werkzeug für seine eigenen Kunden |
| 7 | **Rückmeldung von beiden Seiten:** die SMS an den Kunden nach zwei Werktagen und die Reklamation des Betriebs (Abschnitt 5) | danach | keine | Fakes werden gutgeschrieben, falsche Reklamationen abgelehnt |

Jeder Betrieb sieht in der Mail und im Partnerbereich ein **Echtheitsprofil** der Anfrage: „Handynummer bestätigt ✓ ·
Eigentümer ✓ · Start in 3 Monaten · 4 Fenster · 8 Fotos · ging an 2 Betriebe“. Das ist das Verkaufsargument gegenüber Portalen.

## 3. Einnahmen: fünf Quellen

| # | Quelle | Wer zahlt | Startwert | Wann |
|---|---|---|---|---|
| 1 | **Gebühr je Anfrage und Betrieb** | Partnerbetrieb | **39 €** **[Annahme]**, die ersten 3 Anfragen gratis, nur nicht reklamierte Anfragen | Stufe 1 |
| 2 | **Aufmaßblatt ohne Weitergabe** | Hauseigentümer | 9,99 € ab 18.11.2026, Erstattung bei Versand an Partner innerhalb 30 Tagen, wenn keiner wegen falscher Daten reklamiert | Stufe 1 |
| 3 | **Pakete** (eigener Konfigurator) | Partnerbetrieb | wie `pakete.js`; Paketkunden zahlen 25 % weniger je vermittelter Anfrage **[Annahme]**; Anfragen aus dem eigenen Konfigurator bleiben ohne Gebühr | Stufe 2 |
| 4 | **Gebietspartner** (Monatsbetrag mit Anfragen inklusive und gekennzeichnetem ersten Platz in seinem Gebiet) | Partnerbetrieb | Preis nach drei Monaten aus den echten Zahlen | Stufe 3 |
| 5 | **Hersteller und Händler** (Lizenzen, siehe Gremium) | Industrie | offen | später |

Bewusst nicht: dieselbe Anfrage an mehr als fünf Betriebe (zuerst drei, siehe Abschnitt 11), Weitergabe ohne Einwilligung, Gebühr für reklamierte Anfragen, versteckte
Platzierung. Jede davon bringt kurz Geld und kostet die Partner.

Warum ein fester Preis je Betrieb und nicht je Empfängerzahl: einfacher zu verkaufen. Ob eine Anfrage an einen oder drei ging, steht
im Echtheitsprofil; nach den ersten 50 Anfragen den Preis an der Abschlussquote der Betriebe prüfen.

## 4. Rechnung

Erlös je bestätigter Anfrage = Gebühr × Ø Betriebe je Anfrage × (1 − Reklamationsquote)
Kosten je bestätigter Anfrage = Kosten je Klick ÷ Quote (Klick → bestätigte Anfrage) + KI + Zahlungsgebühren

| | Wert | Herkunft |
|---|---|---|
| Gebühr je Betrieb | 39 € | [Annahme] |
| Ø Betriebe je Anfrage | 2,2 | [Annahme] |
| Reklamationsquote | 10 % | [Annahme] |
| **Erlös je bestätigter Anfrage** | 39 × 2,2 × 0,9 = **rund 77 €** | |
| Kosten je Klick (Google, Hauseigentümer) | 1,50 € | [Annahme], im Konto ablesen |
| Quote Klick → bestätigte Anfrage | 4 % (25 Klicks je Anfrage) | [Annahme] |
| Werbung je Anfrage | 25 × 1,50 = 37,50 € | |
| KI je Anfrage | etwa 3 € (25 Besucher, 40 % mit Fotos, je 6 Auswertungen zu 0,044 €) | Kosten aus `docs/KI-KOSTEN.md`, Rest [Annahme] |
| SMS-Code, Zahlungsgebühren, Mail | unter 1 € | |
| **Deckungsbeitrag je bestätigter Anfrage** | **rund 36 €** | |
| Höchstgebot je Klick, bei dem es sich gerade noch trägt | 77 € × 4 % = **3,08 €** | |

- 100 bestätigte Anfragen im Monat ergeben rund 7.700 € Erlös und rund 3.600 € Deckungsbeitrag. Dafür braucht es 20 bis 25
  Partnerbetriebe mit je etwa 10 Anfragen im Monat.
- Der Hebel ist die Quote. Bei 2 % statt 4 % kostet die Werbung 75 € je Anfrage, und jede Anfrage verliert Geld. Deshalb: Tür A so
  einfach wie möglich, und die 23 Ratgeber für Hauseigentümer als kostenlose Besucherquelle (Google und KI-Assistenten).
- Tür B kommt obendrauf: Kaufen 1 % der Besucher das Blatt, sind das bei 25 Besuchern je Anfrage weitere rund 2,50 € je Anfrage.

**Die eine Zahl, die zählt:** Erlös je bestätigter Anfrage minus Kosten je bestätigter Anfrage. Bei Google Ads ist die Conversion
deshalb „Anfrage bestätigt und versendet“ mit dem Wert 77 €, nicht der Klick und nicht die angefangene Planung. Werbung läuft nur
dort, wo es Partner gibt (Standort-Ausrichtung = Partnergebiete), am Anfang 50 km um Herzebrock-Clarholz.

## 5. Partnerbedingungen (Kern)

- **Gebiet und Deckel:** Postleitzahlen oder Umkreis, Materialien, Monatsdeckel selbst wählbar, Pause jederzeit.
- **Antwort innerhalb von 2 Werktagen.** Gemessen über die Rückmeldung der Kunden; wer dreimal hintereinander nicht reagiert, wird
  pausiert und gefragt, ob er weitermachen will.
- **Reklamation innerhalb von 7 Tagen** mit festen Gründen: unter der bestätigten Nummer nach drei Versuchen an drei verschiedenen
  Tagen nicht erreichbar; die Nummer gehört jemand anderem; außerhalb des Gebiets; Dublette; „habe nie angefragt“. Kein Grund: Kunde hat woanders gekauft, zu teuer, nur
  Preisvergleich, E-Mail-Adresse falsch. Sagt der Kunde „Termin vereinbart“, wird eine Reklamation „nicht erreichbar“ abgelehnt. Schweigen heißt: die
  Anfrage war echt.
- **Abrechnung monatlich** per SEPA-Lastschrift oder Karte über Stripe, Rechnung mit Liste der Anfragen; die ersten 3 Anfragen gratis.
- **Daten** nur für diese Anfrage nutzen, nicht weitergeben oder verkaufen, löschen, wenn kein Auftrag zustande kommt. Die Betriebe
  sind eigene Verantwortliche (kein Auftragsverarbeitungsvertrag), die Zweckbindung steht in den Partnerbedingungen.

## 6. Recht (vor dem Start anwaltlich prüfen lassen, keine Rechtsberatung)

- **Kostenlos gegen Weitergabe der Daten** ist ein Verbrauchervertrag (§ 312 Abs. 1a BGB): Pflichtangaben und Widerruf wie bei
  einem bezahlten Vertrag; offen sagen, dass die Betriebe für die Vermittlung zahlen.
- **Einwilligung** aktiv und nicht vorausgewählt (Art. 4 Nr. 11 und Erwägungsgrund 32 DSGVO), Empfänger mit Namen bzw. als Kategorie
  („Fensterfachbetrieb im Umkreis von 50 km“), die Rückfrage per SMS darin genannt.
- **Reihenfolge der Betriebe:** die Hauptkriterien offenlegen (§ 5b Abs. 2 UWG); bezahlte Plätze eindeutig kennzeichnen (Anhang
  Nr. 11a UWG).
- **Keine automatischen Mails an Betriebe** ohne vorherige Einwilligung (§ 7 UWG, auch unter Firmen). Das gilt auch, wenn die App
  im Namen des Kunden schreibt (BGH 2013, „Empfehlungs-E-Mail“). Unerwünschte Mails gefährden außerdem das Konto beim Mailversand
  und damit die Anmeldecodes. Anrufe bei Betrieben nur mit mutmaßlicher Einwilligung: Eine konkrete Kundenanfrage aus dem eigenen
  Gewerk ist dafür der stärkste Fall, aber nicht sicher. Die Erlaubnis zur Mail im Gespräch einholen und festhalten.
- **Daten der Betriebe** aus der KI-Suche (Name, Telefon, Website) nach berechtigtem Interesse, beim ersten Kontakt informieren
  (Art. 14 DSGVO), nach einem Nein löschen bzw. sperren.
- **Anpassen:** Nutzungsbedingungen (9,99 €, Erstattung, zwei kostenlose Anfragen in 90 Tagen), Datenschutzerklärung (Empfänger,
  Turnstile, SMS-Anbieter, Rückfrage per SMS), neue Partnerbedingungen, Hinweis auf der Verkaufsseite. Die Content-Security-Policy muss Turnstile
  erlauben.

## 7. Kennzahlen (Wochenblick in der Zentrale)

Besucher → Planung begonnen → Ende erreicht → Tür A begonnen → Handynummer bestätigt → versendet; Tür-B-Käufe und Erstattungen;
Ø Betriebe je Anfrage; Reklamationsquote und Gründe; „Betrieb hat sich gemeldet“ in %; Erlös, Werbekosten und KI-Kosten je
bestätigter Anfrage; Anfragen auf der Liste „Betrieb gesucht“ je Region; Anrufe, Zusagen und neue Partner je Woche.

## 8. Bau in drei Stufen

Wiederverwendet wird: Anmeldung per Code (`auth.js`, Konten der Hauseigentümer in `eigene.js`), Kasse und Freischaltung
(`zahlung.js`, `stripe.js`), Aufmaßblatt im Worker (`blatt-server.js`), Versand mit PDF und Wiederholung (`eingang.js`), Bremsen und
Budgets (`bremse.js`), Kundenkonto `/partner/` und Zentrale (`zentrale.js`).

**Stufe 1, Pilot (ohne Partnerliste, du vermittelst von Hand)**
- Zwei Türen am Ende der App, Tür A als „Betrieb für mich suchen“, Einwilligung, SMS-Code (Festnetz per Anruf), Prüfungen 1 bis 6;
  auf Tür A kein Blatt für den Kunden.
- Zentrale: Liste der Anfragen mit Echtheitsprofil und Status (geprüft, Betrieb gesucht, weitergeleitet, reklamiert, gutgeschrieben)
  und dem Knopf „An Betrieb schicken“ (Betrieb eintragen, Mail mit PDF geht raus).
- KI-Suche der Betriebe zur Anfrage, Anrufliste mit Ergebnis je Anruf, Zustimmung zur Mail festhalten, Einladungslink mit
  Registrierung in einer Minute (Partnerbedingungen, erste 3 Anfragen gratis).
- Tür B mit 9,99 € ab 18.11.2026 und automatischer Erstattung bei Versand innerhalb von 30 Tagen (7 Tage ohne Reklamation).
- KI-Grenze ohne bestätigte E-Mail oder Nummer; Turnstile.
- Rückfrage per SMS an den Kunden nach zwei Werktagen.
- Entwürfe der Rechtstexte; Prüfsuite (neuer Abschnitt), Altbestand bleibt grün.

**Stufe 2, ab den ersten Partnern**
- Seite „Partner werden“ (Gebiet, Materialien, Deckel, Zahlungsart, Partnerbedingungen) im vorhandenen Kundenkonto `/partner/`;
  der Einladungslink aus Stufe 1 führt dorthin.
- Partnerliste in Tür A mit Auswahl bis drei; automatischer Versand; Reklamation im Partnerbereich; monatliche Abrechnung.
- Paketkunden automatisch in der Auswahl, mit Rabatt je Anfrage.
- Google-Ads-Conversion „Anfrage bestätigt“ mit Wert.

**Stufe 3, ab etwa 100 Anfragen im Monat**
- Gebietspartner (Monatsbetrag), Bewertungen sichtbar.

## 9. Entscheidungen (Vorschlag, bis der Inhaber anders entscheidet)

| | Vorschlag |
|---|---|
| Gebühr je Anfrage und Betrieb | 39 €, die ersten 3 gratis, nach 50 Anfragen prüfen |
| Höchstzahl Betriebe je Anfrage | 3 |
| Preis Tür B | 7,99 € bis 17.11.2026, danach 9,99 € |
| Blatt auf Tür A | nein, nur die Betriebe bekommen es (Ausnahme: kein Betrieb gefunden) |
| Echtheitsprüfung | Handynummer per SMS-Code (Pflicht), Festnetz per Anruf; E-Mail ohne Code |
| Betriebe ohne Partnervertrag | KI sucht, Inhaber ruft an, Mail erst nach Zustimmung im Gespräch; nie automatisch anschreiben |
| Erstattung Tür B | automatisch bei Versand über Tür A innerhalb von 30 Tagen, wenn 7 Tage lang kein Betrieb wegen falscher Daten reklamiert |
| Kostenlose Anfragen je Person | 2 in 90 Tagen |
| Startregion | 50 km um Herzebrock-Clarholz |
| Straße | freiwillig |
| KI ohne bestätigte E-Mail oder Nummer | 8 Auswertungen je Gerät und Tag |

## 10. Umsetzung Stufe 1 (Auftrag des Inhabers, 29.10.2026)

Wortlaut: „Ich hätte gerne die Auswahl entweder kostenlos oder [Aufmaßblatt bezahlen] … im letzten Schritt … dass eine KI aussucht in
der Gegend von dem Menschen, also die Adresse, die eingegeben wurde, welche Betriebe dort in der Nähe sind, und der kann dann
selbstständig auswählen, welche Betriebe dieses Aufmaßblatt bekommen würden, und dann drückt er auf Abschicken … damit ich weiß, welche
Betriebe ich kontaktieren kann, und das würde ich dann telefonisch tun und diesem Betrieb das Aufmaßblatt schicken. Leg das alles an,
visuell an meine Seite angepasst.“

Daraus: Der Kunde wählt die Betriebe, eeziframes fragt sie telefonisch an und schickt das Aufmaßblatt nur an die, die zustimmen. Der
Text in der App sagt genau das („Wir fragen bei den Betrieben an …“), nicht „gesendet“.

### Weg in der App (nur eeziframes.com ohne Betriebslink, nicht auf Instanzen)

Haus → Zeit und Budget → **Weiche** (Folie `weg`): „Gestatte uns, das Aufmaßblatt an von dir ausgewählte Betriebe zu schicken (und nur
an diese).“ für 0 € oder „Aufmaßblatt für dich, Preis wie `PREIS()`“ → A (Reihenfolge seit 30.10.2026, Abschnitt 12): **Betriebe** (Folie
`betriebe`: nur die Postleitzahl, mit der fünften Ziffer sofort die Liste, Auswahl von zwei bis fünf (Abschnitt 11)) → **Kontakt**
(`anfrage3`; Pflicht: Name, Telefon; E-Mail freiwillig; Einwilligung; „Abschicken“) → **Code** (Folie `vcode`: Code per SMS bzw. Anruf,
Zifferntasten) → **Angefragt** (Folie `angefragt`) · B: Kontakt wie bisher und Freischalten (`teilen`, Kasse). Ohne Server (Pilot) gibt es nur B.

### Schnittstelle

`GET /api/status` liefert zusätzlich `vermittlung: { an, suche: 'ki'|'attrappe'|'', sms: 'sms'|'attrappe'|'' }`; `an` nur mit Daten
und Mailversand.

| Route | Eingabe | Antwort |
|---|---|---|
| `POST /api/vermittlung/suche` | `{ plz }` | `{ ok, betriebe: [{ id, name, ort, km, leistungen }], umkreis, quelle: 'zwischenspeicher'|'umgebung'|'ki'|'attrappe'|'keine', plz, ort }` ohne Telefon und Website (die sieht nur die Zentrale); höchstens 8, nach km; zuerst aus den gespeicherten Suchen im Umkreis von 25 km (Abschnitt 12), erst darunter eine neue KI-Suche; unbekannte PLZ 400 am Feld `plz`; Bremse je IP und Tagesgrenze `VERMITTLUNG_SUCHE_TAG_MAX` (300) mit Mail bei 80 % |
| `POST /api/vermittlung/code` | `{ tel }` | `{ ok, kanal: 'sms'|'anruf', an: '0171 ••• 4567', token, attrappe? }` (Code 6 Ziffern, 10 Minuten, Token mit HMAC ohne Speicher); ohne SMS-Anbieter und ohne Attrappe `{ ok, ohneCode: true }`; höchstens 3 Codes je Nummer und Tag |
| `POST /api/vermittlung/senden` | `{ kontakt: { name, ort, tel, mail, erreich }, plz, betriebe: [id, …] (0–3, leer = „Betrieb für mich suchen“), token, code, einwilligung: { fassung, text }, aufmass: '<packProject>', eckdaten: { fenster, elemente, gebaeude, baujahr, zeit, budget, foerdweg }, pdf: '<Base64>' }` | `{ ok, nr: 'V-2026-0001' }`; höchstens 2 Anfragen je Nummer in 90 Tagen; PDF in der Ablage `vermittlung`; Mail an `MAIL_KONTAKT` mit PDF und den gewählten Betrieben samt Telefon und Website; Bestätigung an den Kunden ohne PDF, falls E-Mail angegeben |

Zentrale (`/zentrale/`, Sitzung des Inhabers): `GET /api/inhaber/vermittlungen`, `GET …/:id`, `GET …/:id/pdf`,
`POST …/:id/betrieb { bid, status, notiz }` (offen, nicht erreicht, will, will nicht), `POST …/:id/betrieb-neu { name, ort, tel, web }`,
`POST …/:id/senden { bid, mail, zustimmung: true, kunde: true }` (Mail mit PDF an den Betrieb nur mit Zustimmung im Gespräch, die mit
Zeit im Verlauf steht; höchstens fünf (Abschnitt 11); auf Wunsch eine Mail an den Kunden, welcher Betrieb sein Aufmaß hat), `POST …/:id/stand`,
`POST …/:id/notiz`. Aufbewahrung 180 Tage, dann löscht der Tageslauf Anfrage und PDF.

### Stand der Umsetzung (29.10.2026)

Gebaut sind Server, Zentrale, Datenbank und Prüfung (Abschnitt 31 der Prüfsuite); die Folien der App sind ein eigener Teil
(`web/assets/app.js`, `web/assets/vermittlung.css`, Prüfung `scripts/pruefen-instanzen/31-app.mjs`).

| Teil | Stelle | Was es tut |
|---|---|---|
| Routen | `functions/api/vermittlung.js` | Suche (zuerst aus der Umgebung), Code, Senden, Zentrale, Tageslauf, Vorrat (alle 10 Minuten, `vorratLauf`); `vermittlung` in `/api/status` (`an` = Datenbank, Mailversand, `SITZUNG_GEHEIMNIS` und Ablage da) |
| KI-Suche | `functions/api/vermittlung-suche.js` | Messages-API mit Websuche `web_search_20260209`, Modell `claude-opus-5-5` (Variable `VERMITTLUNG_MODELL`); wartet ein Kunde, Aufwand `low` und höchstens 4 Suchen, für den Vorrat Aufwand `medium` und höchstens 6; die KI nennt die PLZ jedes Betriebs mit; Ort als `user_location` (DE), Portale und Baumärkte gesperrt, `fallbacks: "default"`; `pause_turn` wird fortgesetzt; Zeitlimit 80 s (`VERMITTLUNG_SUCHE_MS`), danach `quelle: 'keine'`. Die Antwort wird geprüft: ohne Name, Ort, Telefon und Website, Portale, über 60 km und Doppelte fallen weg; Leistungen nur aus der festen Liste; Kennung `b` + 12 Hex-Zeichen aus Name und Ort |
| Zwischenspeicher | Tabelle `vermittlung_suche` | Suchen der Kunden je PLZ 30 Tage (eine leere Suche einen Tag), Vorrat 180 Tage (`info.vorrat`), mit Telefon, Website und Straße für die Zentrale; die App bekommt nur `id, name, ort, km, leistungen` |
| Orte und Umgebung | `functions/api/vermittlung-ort.js`, `functions/api/plz-de.js` (gebaut mit `scripts/plz-tabelle.py` aus GeoNames, CC BY 4.0, Nennung im Impressum und auf der Folie) | 8.997 Postleitzahlen mit Mittelpunkt und Ort, Postleitzahlen im Umkreis, Lage eines Betriebs aus seiner PLZ oder seinem Ort, 483 Stützpunkte für den Vorrat (Abschnitt 12) |
| Code | `functions/api/vermittlung-sms.js` | seven.io: SMS an Handys (015x, 016x, 017x), Anruf mit Ansage an Festnetz; 6 Ziffern, 10 Minuten, Token mit HMAC über Nummer und Code (`SITZUNG_GEHEIMNIS`, Zweck `vcode`), nichts gespeichert; 3 Codes je Nummer und Tag, Bremse je Anschluss, 5 Fehlversuche je Token |
| Anfragen | Tabelle `vermittlungen`, Ablage `vermittlung` | Nummer `V-JJJJ-NNNN`; Kunde, Eckdaten, Aufmaß (`AM1.…`), Einwilligung mit Fassung, Wortlaut, Zeit und gekürztem Netz, gewählte Betriebe mit allen Angaben und Ergebnis der Anrufe, Verlauf, Notiz; Aufmaßblatt als PDF (bis 10 MB); höchstens 2 Anfragen je Nummer in 90 Tagen; nach 180 Tagen löscht der Tageslauf Anfrage und PDF |
| Mails | `functions/api/vermittlung-mails.js` | an `MAIL_KONTAKT` mit PDF, Kunde, Eckdaten, Betrieben samt Telefon (tel:-Link), Website, km und Link zur Zentrale; an den Kunden (Du-Form, ohne PDF): „Wir fragen bei … an und schicken dein Aufmaß an die, die ein Angebot machen möchten; sie melden sich dann bei dir.“; an den Betrieb nur über die Zentrale mit Häkchen (Sie-Form, PDF, „Vermittelt von eeziframes“, Impressum im Fuß); auf Wunsch an den Kunden, welcher Betrieb sein Aufmaß hat |
| Zentrale | `web/zentrale/`, `web/assets/inhaber.js`, `auftrag.css` | Umschalter „Aufträge \| Vermittlung“ mit der Zahl der neuen, Liste, Anfrage mit Anruf-Knöpfen, Ergebnis je Anruf, Notiz, „Aufmaß schicken“ nur mit dem Häkchen, weiterer Betrieb, Stand, interne Notiz ([ZENTRALE.md](ZENTRALE.md)) |

Antworten, auf die sich die App verlässt: Fehler kommen als `{ ok: false, fehler, feld }` (bei Senden zusätzlich `felder` mit allen
Feldern). `feld` ist `tel` (Nummer falsch, auch beim Code), `code` (401: fehlt, falsch, abgelaufen, andere Nummer, zu viele Versuche; mit
`neu: true`, wenn ein neuer Code nötig ist), `betriebe` (400 mehr als fünf, 409 `neuSuchen` wenn die Auswahl nicht mehr in den gültigen
Suchen im Umkreis dieser PLZ steht), `name`, `mail`, `plz`, `einwilligung`, `aufmass` oder `pdf`. Die Grenze „zwei in 90 Tagen“ antwortet 429 mit
`grenze: '90tage'` und `feld: 'tel'`. Derselbe Code mit demselben Token zweimal (Doppelklick) liefert dieselbe Nummer mit `schon: true`.
`kontakt.ort` darf das ganze Feld „PLZ und Ort“ sein; der Server trennt die PLZ ab (die App füllt es seit 30.10.2026 aus der Suche). Telefonnummern prüft der Server mit derselben Regel wie
die App (`vmTel`), dazu Länge, Sonder- und Servicenummern und einen Anschluss aus lauter gleichen Ziffern.

Attrappen und Prüfung: `KI_ATTRAPPE=1` liefert feste, erfundene Betriebe um Herzebrock-Clarholz (Fensterbau Brandt vorn); `SMS_ATTRAPPE=1` oder
`DATEN_ATTRAPPE=1` nimmt den Code 123456 und verschickt nichts (`SMS_ATTRAPPE=0` schaltet das ab, dann gilt der Weg ohne Code);
`MAIL_ATTRAPPE=1` merkt sich die Mails. Ohne Anthropic-Schlüssel und ohne Attrappe antwortet die Suche `{ betriebe: [], quelle: 'keine' }`,
ohne SMS-Anbieter und ohne Attrappe der Code `{ ohneCode: true }`; die Anfrage geht dann ohne Code durch und steht in der Zentrale als
„Nummer nicht bestätigt“. Prüfung: `node scripts/mit-server.mjs 8971 env NUR=31 PW_PFAD=/opt/node-tools node scripts/pruefen.mjs`.

Offen: Turnstile und KI-Grenze ohne bestätigte Nummer (Prüfung 1), Prüfung der E-Mail auf
Tippfehler und Wegwerf-Domains (Prüfung 3), Einladungslink für Partner, Tür B mit 9,99 € und Erstattung, Rechtstexte
([VERMITTLUNG-RECHT.md](VERMITTLUNG-RECHT.md)), Vertrag zur Auftragsverarbeitung mit seven.io.

## 11. Gratis-Wahl (Entscheidung des Inhabers, 29.10.2026, abends)

Der Inhaber übernimmt einen Vorschlag aus einem anderen Gespräch: Das Gratis-Aufmaß wird nicht als „Daten gegen Rabatt“ verkauft,
sondern als das, was es für den Kunden ist, **vergleichbare Angebote, ohne selbst herumzutelefonieren**. Das ändert Abschnitt 1
(dort: „auf dem kostenlosen Weg kein Aufmaßblatt“) und Abschnitt 10. Nachtrag desselben Abends: statt genau zwei Betrieben **bis zu
fünf, mindestens zwei** (Inhaber: „nicht beschränken, anfangen mit fünf“); die Tabelle zeigt den Stand danach.

| Punkt | Jetzt |
|---|---|
| Weiche | zwei Karten, seit 30.10.2026 untereinander: „Gestatte uns, das Aufmaßblatt an von dir ausgewählte Betriebe zu schicken (und nur an diese).“ für 0 € mit durchgestrichenem Preis, vorgewählt, mit Ring und dem Etikett „Empfohlen“ (nicht „Beliebt“: ohne Nutzerzahlen unbelegt), darunter „Aufmaßblatt für dich“ mit Preis; Untertitel „Wähle, wie du fortfahren möchtest.“ |
| Betriebe | zwei bis fünf (oder „Sucht ihr passende für mich aus“, dann sucht der Inhaber bis zu fünf aus); mindestens zwei, damit es etwas zu vergleichen gibt (findet die Suche nur einen, reicht einer); der Server nimmt zwei bis fünf (`MAX_WAHL`, `MIN_WAHL` in `functions/api/vermittlung.js`, `VM_MAX`, `VM_MIN` in der App), die Zentrale schickt an höchstens fünf und, wenn der Kunde gewählt hat, nur an die gewählten. Im Umkreis tragen bis zwei Gewählte ein Namensschild, ab drei nur die Nummer wie in der Liste |
| Aufmaßblatt | gehört auf dem Gratis-Weg dazu: nach dem Abschicken frei (Nachweis vom Server wie beim Kauf, Sitzung `vermittlung:<Nr>`) und als PDF in der Bestätigungsmail; vor dem Abschicken bleibt es gesperrt, die Nummer ist da schon per Code bestätigt |
| Vertrauen | seit 30.10.2026 die Daten-Garantie unter den Karten (Abschnitt 12) und „Warum kostenlos?“ zum Aufklappen; Telefon: „Damit die Betriebe wissen, dass ein echter Mensch anfragt. So bekommst du ernsthafte Rückmeldungen.“; „Warum kostenlos? Die Fensterbetriebe bezahlen uns für die Vermittlung.“ |
| Einwilligung | eigener Haken, seit 30.10.2026 im Kontakt nach der Wahl, nennt die gewählten Betriebe (bei „Sucht ihr …“: „bis zu fünf passende Fensterbetriebe, die eeziframes für mich aussucht“) und was sie bekommen (Name, Ort, Telefonnummer, falls angegeben E-Mail-Adresse), „Sonst bekommt niemand meine Daten“, jederzeit widerrufbar; ohne die frühere Rückfrage nach zwei Tagen (Fassung `2026-10-30`) |
| Bezahlen | auf Freischalten, Rechnungsadresse und Kasse noch einmal die Gratis-Karte („Lieber kostenlos?“, „Kostenlos weiter“) |
| Startseite | Konfigurator als Einstieg (3-D-Fenster mit Farbfeldern, Fassade, Drei-Schritte-Leiste, die zwei Karten); die Wahl dort steuert die App: `/app/?farbe=<RAL>#ausmessen` setzt die Rahmenfarbe außen des ersten Fensters, `?weg=gratis` bzw. `?weg=blatt` die Weiche |
| Bühnen | ohne das Foto mit dem Lichtschatten (Inhaber: „muss ich nicht überall haben“): Anthrazit mit Punktraster wie eine Karte |

Rechnung (Abschnitt 4) je Anfrage: Erlös = Gebühr × Zahl der Betriebe, die zusagen × (1 − Reklamationsquote). Bei 39 € und 10 % sind das
rund 70 € bei zwei Betrieben und rund 175 € bei fünf. Ein Kunde, der vorher 7,99 € gezahlt hätte, bringt auf dem Gratis-Weg mehr.
Gegengewicht: Je mehr Betriebe anrufen, desto eher fühlt sich der Kunde bedrängt und desto seltener gewinnt der einzelne Betrieb den
Auftrag; Portale nennen meist drei. Daher erst fünf und an der Zahl der Reklamationen und Zusagen ablesen, ob die Grenze passt.

## 12. Sofort Betriebe finden, Kontakt danach (Auftrag des Inhabers, 30.10.2026)

> „Wie erreichen dich die Betriebe: da will ich das erst haben, nachdem ausgewählt wurde, welche Unternehmen in der Nähe sind. Dafür würde
> ich vorschlagen, zieht man die Maske mit Betriebe finden nach vorne […] Da musst du dann auch wirklich nur die Postleitzahl eintragen und
> dann sucht die KI entsprechend die Betriebe raus. Das Ganze hat jetzt ganz schön lange gedauert […] ich will, dass der Nutzer sofort
> Betriebe findet.“

**Weiche.** Untertitel „Wähle, wie du fortfahren möchtest.“, im weißen Feld sein Satz („Gestatte uns, das Aufmaßblatt an von dir
ausgewählte Betriebe zu schicken (und nur an diese).“), darunter die Daten-Garantie als Feld mit Chip und „Warum kostenlos?“ zum
Aufklappen; die Pille heißt „Betriebe finden“. Die Karten stehen untereinander, weil der Satz die ganze Breite braucht.

**Daten-Garantie.** Sein Wortlaut, so gefasst, dass er stimmt: Die gewählten Betriebe melden sich ja (das ist der Zweck), und von uns
kommen der Code und Nachrichten zur Anfrage (Bestätigung, auf Wunsch welcher Betrieb das Aufmaß hat); gespeichert wird, was im
Datenschutz steht, also nichts versteckt:

> Außer den Fensterbauern, die dein Aufmaß bekommen, meldet sich niemand bei dir, weder per E-Mail noch per Telefon noch auf anderen
> Wegen. Von uns bekommst du nur den Code und Nachrichten zu deiner Anfrage. Deine Daten geben wir nur an die Fensterbauer weiter, die du
> auswählst (oder uns für dich aussuchen lässt), so wie du es vermutlich auch selbst tun würdest. Kein versteckter Verkauf und keine
> versteckte Speicherung deiner Daten.

Damit entfällt die Rückfrage nach zwei Tagen, die bisher in der Einwilligung stand (gebaut war sie nie).

**Sofort statt warten.** Eine KI-Suche mit Websuche dauert 20 bis 80 Sekunden; schneller wird sie nicht verlässlich. Deshalb wartet der
Kunde in der Regel gar nicht auf sie:

1. **Umgebung:** Der Server nimmt alle gültigen Suchen der Postleitzahlen im Umkreis von 25 km (eine Abfrage, etwa 10 bis 60 ms) und
   rechnet die Entfernung jedes Betriebs zum Kunden neu: aus der PLZ des Betriebs (die KI nennt sie seit 30.10.2026 mit), sonst aus
   seinem Ort (der nächste gleichnamige, höchstens 60 km), sonst höchstens Abstand der beiden PLZ plus die Schätzung der Suche. Nur bis
   30 km, jeder Betrieb einmal (gleiche Kennung, Telefonnummer oder Website), die nächsten acht. Ab drei Betrieben ist das die Antwort
   (`quelle: 'umgebung'`), ohne neue Suche und ohne Kosten.
2. **Vorrat:** Damit auch der erste Kunde einer Gegend sofort Betriebe sieht, sucht der Server ohne Kunden für 483 Stützpunkte (jede PLZ
   in Deutschland höchstens 20 km von einem, dicht besiedelte zuerst), alle 10 Minuten eine, am Tag höchstens `VERMITTLUNG_VORRAT`
   (Vorgabe 0 = aus). Diese Suchen gelten 180 Tage und werden danach von selbst erneuert, solange die Variable gesetzt ist.
3. **Neue Suche nur, wenn nichts da ist:** knapp (Aufwand `low`, höchstens 4 Websuchen); die App sagt nach 2,5 Sekunden, dass die KI für
   diese Gegend gerade neu sucht. Eine Postleitzahl, die es nicht gibt, sucht gar nicht (Hinweis am Feld).

Kosten des Vorrats (Preise nach dem Skill `claude-api`, Stand Oktober 2026): je Suche grob 0,15 bis 0,35 $, also für alle 483
Stützpunkte einmalig etwa 70 bis 170 $ und danach dasselbe je 180 Tage (im Mittel 0,20 bis 0,50 $ am Tag). Mit `VERMITTLUNG_VORRAT=50`
ist ganz Deutschland nach etwa zehn Tagen gefüllt, mit 144 (Höchstwert, eine je Lauf) nach dreieinhalb. Eingeschaltet wird er nur auf
das Wort des Inhabers.

**Datenschutz.** Unverändert richtig: An Anthropic gehen nur Postleitzahl und Ort, wenn neu gesucht wird; die Suchen der Kunden gelten
30 Tage. Der Vorrat enthält keine Daten von Kunden. Die Ortsdaten stammen von GeoNames (CC BY 4.0), genannt im Impressum und in der
Quellenzeile der Folie.

Prüfung: Abschnitt 31 (Suche aus der Umgebung, Entfernung aus dem Ort, Tabelle, Vorrat; in der App Weiche, Postleitzahl, Kontakt danach).


## 13. Bereich für Fensterbauer, Register und Partner (Auftrag des Inhabers, 30.10.2026)

> „Ich möchte die Daten von den Kunden nicht per E-Mail verschicken. Der Fensterbauer erhält eine E-Mail, in der steht, dass er sich auf
> meiner Webseite die Daten runterladen kann […] Grundsätzlich soll das Prinzip so sein, dass das erste Aufmaß komplett kostenlos ist und
> ab dem zweiten die Kosten bei 29 € liegen pro vermitteltes Aufmaß. […] Ich hätte gerne ein kleines Lexikon von Betrieben, mit denen ich
> bisher Informationen ausgetauscht habe […] und einen Abschnitt für den Kunden selbst, dass ich ihm Mails schicken kann.“

Entscheidungen des Inhabers im Gespräch: Die Betriebe schalten das Aufmaß in ihrem Bereich selbst frei und zahlen dabei über Stripe
(nicht Monatsrechnung); 29 € netto zzgl. USt; Partner mit Etikett „Partner“ und einem Satz zur Reihenfolge.

### Ablauf

1. **Anruf wie bisher.** Der Inhaber ruft die Betriebe an. Wer zustimmt, bekommt „Zugang schicken“ (Zentrale, früher „Aufmaß schicken“).
2. **Mail ohne Daten.** Die Mail an den Betrieb enthält nur Ort, Eckdaten, dass die Nummer bestätigt ist, Preis und einen Link
   `/konto/#zugang/<Token>` (unterschrieben wie der Code der Kunden, gültig 180 Tage). Kein Anhang, kein Name, keine Nummer.
3. **Bereich für Fensterbauer** (`/konto/`, derselbe wie für die Pakete, Anmeldung per Code an die E-Mail-Adresse): Vorschau der Anfrage
   (Ort, Eingang, Eckdaten, Echtheitsprofil), dann Anmeldung mit genau der Adresse, an die der Zugang ging (sonst 403), „Annehmen“
   verbindet den Betrieb im Register mit dem Konto.
4. **Freischalten.** Das erste Aufmaß eines Kontos ist kostenlos; jedes weitere kostet `PREIS_NETTO` = 29 € netto (Stripe-Kasse, Karte,
   Rechnung von Stripe, Metadaten `art: 'vermittlung'`; Rückkehr `/konto/?kasse=<session>#anfrage/<id>`, dazu der Webhook, falls der Betrieb
   nicht zurückkehrt). Danach Kontaktdaten, Aufmaßblatt (PDF, ansehen und herunterladen), Zweckbindung. Der Kunde bekommt per Mail, welcher
   Betrieb sein Aufmaß abgerufen hat (`freigeschaltetMail`).
5. **Register und Partner.** Im Bereich trägt sich der Betrieb ein (Name, Ort, PLZ, Straße, Telefon, Website, Leistungen) und erklärt seine
   Bereitschaft (Partnerbedingungen). Partner stehen bei Kunden im Umkreis von 30 km auf Platz 1 und 2 (`partnerVorn`, höchstens zwei, die
   nächsten zuerst; die App zeigt „Partner“ und „Partnerbetriebe stehen oben, danach nach Entfernung“), auch wenn keine Suche sie kannte.
   Wählt ein Kunde einen Partner, bekommt der Inhaber die Anfrage wie bisher; der Zugang geht über „Zugang schicken“ (ohne Anruf nötig).
6. **Lexikon der Zentrale** (`#betriebe`): jeder Betrieb mit Kontakt, Stand (neu, kontakt, partner, abgelehnt, pausiert), Partner-Erklärung,
   Konto, Zählern (Anfragen, Anrufergebnisse, Zugänge, geöffnet, kostenlos, bezahlt, Umsatz) und der Liste seiner Anfragen mit Ergebnis;
   Notiz, Verlauf, „Register neu aufbauen“. Doppelte: gleiche Kennung, Telefonnummer oder Website werden ein Eintrag mit Alias.
7. **Kunde in der Zentrale:** Nachricht an den Kunden (Betreff, Text, Vorlagen), geht an seine E-Mail, steht im Verlauf und unter
   `nachrichten`.

### Teile

| Teil | Stelle | Was es tut |
|---|---|---|
| Register | `functions/api/vermittlung-register.js`, Tabelle `vermittlung_betriebe` (schema.sql) | `registerFuer` (finden oder anlegen, Alias bei gleicher Nummer oder Website), `registerMerken` (nach jeder Änderung an einem Betrieb in einer Anfrage), `registerNeuAufbauen`, `partnerVorn` |
| Bereich für Fensterbauer | `functions/api/vermittlung-partner.js` | Routen `GET /api/anfrage/:token`, `POST …/annehmen`, `GET /api/konto/anfragen[/:id[/pdf|/kasse]]`, `POST …/:id/freischalten`, `POST /api/konto/partner`, `POST /api/konto/betrieb`; Kasse bei Stripe, `zugangBezahlt` für den Webhook |
| Zentrale | `functions/api/vermittlung.js` (INHABER) | `senden` schickt den Zugang; `kunde-mail`; `GET/POST /api/inhaber/betriebe[/:id]`, `neu-aufbauen` |
| Mails | `functions/api/vermittlung-mails.js` | `betriebMail` (Link, ohne Daten), `kundeMail`, `freigeschaltetMail` |
| App | `web/assets/app.js`, `vermittlung.css` | Etikett „Partner“ (`.vm-partner`), Satz zur Reihenfolge in der Quellenzeile |
| Oberflächen | `web/assets/inhaber.js` + `zentrale-register.css`; `web/assets/konto.js` + `konto-anfragen.css`; „Anmelden“ im Kopf der Seite für Fensterbauer | Lexikon, Kundenabschnitt, Zugang schicken; Zugang, Anfrage, Freischalten, Karten (Register/Bereitschaft, Echtheit, Pakete), Übersicht für beide Seiten |
| Recht | `web/partnerbedingungen/` (`PARTNER_STAND` in recht.js), Datenschutz 6a und 9, AGB § 4a | Entwurf vom 30.10.2026, vom Anwalt zu prüfen (Fragen in VERMITTLUNG-RECHT.md) |
| Prüfung | Abschnitt 31.5 (Zugang statt Aufmaß), 31.7 (Bereich, Register, Partner, Kundenmail, Rechtsseite) | |

Lokal ausprobieren: Server starten (ONLINE-STELLEN.md, „Lokal ausprobieren“), `node scripts/dev-vermittlung-anlegen.mjs http://localhost:8795 4`
legt Testanfragen an; in der Zentrale „Zugang schicken“ an eine Adresse ohne `.example`, den Link aus `GET /api/test/post` öffnen, Code 123456.

Offen: Reklamation aus dem Bereich heraus (heute per E-Mail, Partnerbedingungen § 6); Stripe-Kundenportal im Bereich für Rechnungen der
Vermittlung (die Pakete haben es schon); automatische Zugänge an Partner ohne Anruf.

**Erstes Aufmaß je Betrieb, auf mehreren Ebenen geprüft (Inhaber, 30.10.2026: Mitarbeiter desselben Betriebs nennen verschiedene Adressen):** `rundum()` in vermittlung-partner.js sammelt vor jeder Entscheidung die Register-Einträge (1) des Betriebs der Anfrage samt Aliasen, (2) aller mit dem Konto verbundenen Betriebe (`konto` und `konten`), (3) aller Betriebe mit derselben Telefonnummer oder Website, (4) des Betriebs, dessen Website zur Domain der E-Mail-Adresse passt (nicht bei Freemail, Liste `FREIMAIL`), (5) aller Betriebe, an deren Adresse schon ein Zugang ging; hat einer davon ein freigeschaltetes Aufmaß, kostet das nächste. Ein Betrieb kann mehrere Konten haben: Geht ein Zugang von der Zentrale an eine weitere Adresse, wird dieses Konto beim Annehmen in `konten` ergänzt (vorher 409). Nur „Als Betrieb eintragen“ mit fremder Nummer oder Website bleibt 409, mit dem Hinweis, sich einen Zugang schicken zu lassen. Partnerbedingungen § 4 Abs. 1 sagt das.

**Alles löschen (Zentrale, Reiter Betriebe, unten):** `POST /api/inhaber/vermittlung/alles-loeschen { bestaetigung: 'ALLES LÖSCHEN' }` löscht alle Anfragen samt Aufmaßblättern in der Ablage, das Register und die Zähler `budget:vcode:*` (drei Codes je Nummer und Tag); die Grenze „zwei Anfragen je Nummer in 90 Tagen“ fällt damit von selbst. Suchen bleiben. Für die Tests des Inhabers (30.10.2026).

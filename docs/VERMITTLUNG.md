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

Bewusst nicht: dieselbe Anfrage an mehr als drei Betriebe, Weitergabe ohne Einwilligung, Gebühr für reklamierte Anfragen, versteckte
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

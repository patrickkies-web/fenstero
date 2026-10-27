# KI-Kosten je Auswertung und Preis je weiterer Auswertung (intern)

Nur für den Inhaber. Diese Rechnung steht nirgends auf der Website; dort stehen nur das Kontingent je Paket und der Preis jeder weiteren Auswertung (`web/assets/pakete.js`, `preis.ki` und `kiMonat`).

Stand 27.10.2026, Preise der Anthropic-API laut Preisliste vom 06.10.2026.

**Regel des Inhabers (27.10.2026):** Jede weitere KI-Auswertung kostet das 1,75-Fache dessen, was sie uns kostet, gerundet auf volle Cent. Der Faktor steht nie auf der Website, in den Paketbedingungen, in Mails oder im Kundenbereich; dort stehen nur Kontingent, Preis je weiterer Auswertung und der Schutz vor Missbrauch. Ändern sich Modell oder API-Preise, wird hier neu gerechnet und `preis.ki` angepasst.

## Was eine Auswertung ist

Eine Auswertung ist **eine Anfrage an die KI mit einem Foto** (`functions/api/ki.js`). Je Fenster fotografiert der Kunde meist zweimal (innen und außen), also zwei Auswertungen je Fenster. Das Handy verkleinert jedes Foto vorher auf etwa 1,15 Megapixel (rund 1.240 × 930 Pixel, `web/assets/app.js`, `shrink`).

## Kosten einer Auswertung

Modell: `claude-sonnet-5-5` (Variable `KI_MODELL` kann es ändern), 2 US-$ je Million Eingabe-Tokens, 10 US-$ je Million Ausgabe-Tokens. Denken (adaptiv, Standard dieses Modells) zählt als Ausgabe.

| Teil | Tokens (geschätzt) | Kosten |
| --- | --- | --- |
| Auftrag an die KI (System, rund 5.000 Zeichen bei „einbau“, 3.000 bei „wand“) | etwa 2.000 | |
| Foto mit 1,15 Megapixel | etwa 1.550 | |
| Satz dazu und Rahmen | etwa 50 | |
| **Eingabe zusammen** | **etwa 3.600** | **0,0072 US-$** |
| Antwort (JSON mit 5 bis 12 Befundzeilen, Stichworten, Hinweisen, Prüfpunkten, Fachangaben) | etwa 1.300 | |
| Denken vor der Antwort | etwa 2.700 | |
| **Ausgabe zusammen** | **etwa 4.000** | **0,040 US-$** |
| **Auswertung** | | **etwa 0,047 US-$ = 0,044 €** |

Kurs angenommen: 1 US-$ = 0,93 €. Die längste mögliche Auswertung (Ausgabe am Limit `MAX_TOKENS` = 8.000) kostet etwa 0,087 US-$ = 0,081 €; eine Auswertung bei „wand“ (kürzerer Auftrag) etwas weniger als im Mittel.

## Preis je weiterer Auswertung

Kosten mal 1,75: 0,044 € × 1,75 = 0,077 €, gerundet **0,08 € netto** je Auswertung über dem Kontingent. Gleicher Preis in allen drei Paketen.

| Paket | Kontingent im Monat | entspricht etwa | jede weitere | höchstens im Monat dazu (Schluss beim Doppelten) |
| --- | --- | --- | --- | --- |
| Essential | 1.000 | 20 Anfragen mit je 25 Fenstern | 0,08 € | 1.000 × 0,08 € = 80 € |
| Essential Plus | 1.500 | 30 Anfragen mit je 25 Fenstern | 0,08 € | 120 € |
| Signature | 2.000 | 40 Anfragen mit je 25 Fenstern | 0,08 € | 160 € |

Kosten des Kontingents für dich, falls ein Betrieb es ganz ausschöpft (0,044 € je Auswertung): Essential 44 €, Plus 66 €, Signature 88 € im Monat. Das liegt bei Essential **über** dem Monatsbeitrag (39 €) und bei Plus (69 €) und Signature (99 €) knapp darunter, ohne Betrieb, Mail und Speicher. Bei üblicher Nutzung (wenige Anfragen mit 5 bis 15 Fenstern im Monat) sind es nur wenige Euro; teuer wird es nur, wenn ein Betrieb sehr viele Anfragen bekommt. Wenn dich das stört: kleineres Kontingent in `kiMonat` oder ein höherer Monatspreis bei Essential.

**Prüfen nach dem ersten Monat:** Die echten Kosten stehen in der Anthropic Console (Usage und Cost). Kosten des Monats geteilt durch die Zahl der Auswertungen (Zähler je Konfigurator, `functions/api/statistik.js`) ergibt die echten Kosten je Auswertung. Weicht das deutlich ab, `preis.ki` in `web/assets/pakete.js` ändern (gilt für neue Bestellungen; bestehende Verträge behalten ihren Preisstand, Änderung nur mit Ankündigung nach Paketbedingungen § 4 Abs. 5).

## Schutz vor Missbrauch (so steht es auch auf der Verkaufsseite)

- Die KI wertet auf einem Konfigurator nur Fotos aus einer Planung mit gültigem Code dieses Betriebs aus (`kiInstanz`).
- Je Anfrage höchstens 2 × Fenster + 6 Auswertungen, nie mehr als 60 (`Instanzregeln.GRENZEN.kiJeCode`).
- Bremse je Anschluss: 40 Anfragen in 10 Minuten (IPv6 je /64), dazu die Bremse der Datenbank.
- Je Konfigurator und Monat: Mail an dich beim Kontingent, Schluss beim Doppelten; danach nimmt der Konfigurator weiter Anfragen an, nur ohne KI-Befund.
- Über alle Konfiguratoren: höchstens `KI_TAG_MAX` Auswertungen am Tag (Standard 3.000), Mail an dich bei 80 %.

## Offen

- **Abrechnung der weiteren Auswertungen:** Der Zähler je Konfigurator und Monat läuft (`budget`, Schlüssel `inst:<id>:ki`), die Rechnung an den Betrieb aber noch nicht von selbst. Sobald die Instanz beim Live-Schalten aus dem Auftrag angelegt wird (docs/BESTELLUNG.md, „Offen“), kann der monatliche Lauf die Auswertungen über dem Kontingent als Rechnungsposten an das Stripe-Abo hängen. Bis dahin: Zahl aus dem Zähler lesen (`functions/api/bremse.js`, `budget`) und von Hand berechnen; die neue Zentrale zeigt sie noch nicht.
- Die Token-Zahlen oben sind geschätzt, nicht gemessen; die Console liefert die echten.

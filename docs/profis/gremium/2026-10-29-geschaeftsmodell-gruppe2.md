# Gremium „Hat eeziframes eine Zukunft?“ · Gruppe 2 „Geschäft und Zahlen“

29.10.2026 · Grundlage: BRIEFING.md, `web/assets/pakete.js` (Preisstand 28.10.2026), `docs/KI-KOSTEN.md`, `functions/api/ki.js` (nur gelesen), die Verkaufsseite eeziframes.com/fuer-fensterbauer/ (heute abgerufen) und eine Marktrecherche (Quellen am Ende).

Was die Gruppe auf der Verkaufsseite vorfand: Pakete 39/69/99 € im Monat und 99/150/239 € Einrichtung. Es gibt keine Testphase, nur eine Demo mit dem erfundenen Betrieb „Fensterbau Brandt“, und keine echte Referenz, Kundenstimme oder Ergebniszahl. Die Seite ist sehr lang (rund 5.700 Wörter im Quelltext). Die Seite sagt außerdem: **„Die Bestellung wird in Kürze freigeschaltet, bis dahin fragen Sie unverbindlich an.“** Heute kann also kein Betrieb ein Paket bezahlen.

---

## Gemeinsame Rechengrundlage (alle drei rechnen damit, jede Annahme ist gekennzeichnet)

| Nr. | Annahme | Wert |
| --- | --- | --- |
| A1 | Paketmix Essential / Plus / Signature | 40/40/20 % (Basis), 60/30/10 % (vorsichtig) |
| A2 | Variable Kosten je Paket und Monat | KI 4,40 € (5 Anfragen × 10 Fenster × 2 Fotos × 0,044 €), Zahlung ≈ 1,5 % + 0,25 € plus Abo-Abrechnung, Domain 2,08 € (25 €/Jahr, nur Plus und Signature) |
| → | Deckungsbeitrag je Paket | Essential ≈ 34 €, Plus ≈ 61 €, Signature ≈ 91 € · **Ø 55 € (Basis), Ø 48 € (vorsichtig)** |
| A3 | Fixkosten | Technik ≈ 47 € (Cloudflare 5 $, Resend 20 $, Supabase 25 $), Steuerberatung, Versicherung, Werkzeuge ≈ 100 € → **150 € im Monat**, ohne die KI der freien App (siehe B2C) |
| A4 | Gewinn | vor Einkommensteuer, Kranken- und Rentenversicherung des Inhabers. Netto bleibt deutlich weniger. |
| A5 | Zeit je Einrichtung | Essential 2 h, Plus 5 h, Signature 8 h → Ø 4,4 h. Die Gebühr liegt im Schnitt bei 147 €, das sind rund 33 € je Stunde. **Die Einrichtungsgebühr ersetzt nur Zeit, sie finanziert keine Kundengewinnung.** |
| A6 | Kündigung | 4 % im Monat (Basis, Ø Lebensdauer 25 Monate), 7 % (vorsichtig, 14 Monate) |
| A7 | Kundengewinnungskosten (CAC) in Geld | 300 € (Basis), 400 € (vorsichtig) |
| A8 | Betreuung | 0,5 h je Paket und Monat |

**Formel:** zahlende Pakete = (Zielgewinn + 150 € Fixkosten) ÷ (Deckungsbeitrag − Kündigungsrate × CAC). Den Ersatz der Kündiger zahlt der laufende Betrieb. Einrichtungsgebühr und Einrichtungszeit heben sich auf (A5).

| Gewinn im Monat | ohne Kosten der Kundengewinnung (55 €) | **Basis** (55 € − 4 % × 300 € = 43 €) | **vorsichtig** (48 € − 7 % × 400 € = 20 €) |
| --- | --- | --- | --- |
| 1.000 € | 21 | **27** | 58 |
| 3.000 € | 58 | **74** | 158 |
| 5.000 € | 94 | **120** | 258 |

**Tempo:** In der Basis kündigen jeden Monat 4 % der Kunden. Wer 27 Pakete in 12 Monaten will, braucht etwa 3 Abschlüsse im Monat. Für 120 Pakete in 24 Monaten sind es etwa 8 im Monat.

**Zeit des Inhabers bei 120 Paketen (Basis):**
- Betreuung: 60 h im Monat.
- Einrichtungen: 4,8 je Monat × 4,4 h = 21 h.
- Zusammen etwa 80 h im Monat.
- Gewinnt der Inhaber die Kunden selbst am Telefon, kommen etwa 13 h je Abschluss dazu. Dann sind es etwa 140 h im Monat.

### Erreichbarer Markt

| Größe | Zahl | Quelle |
| --- | --- | --- |
| Fensterhersteller in Deutschland | ≈ 6.500 (2016), Prognose < 5.000 bis 2020 | Munich Strategy Group, berichtet von Baulinks am 17.04.2016 |
| ebenso, 2007 | 7.200 Betriebe, 97 % mit < 20 Produktionsmitarbeitern | VFF-Branchenstrukturanalyse, Baulinks 2008 |
| Tischler / Glaser / Rollladen- und Sonnenschutztechniker in Baden-Württemberg, 31.12.2025 | 4.320 / 777 / 677 (alle rückläufig) | Handwerk BW, Betriebsstatistik 2025 |
| Handwerk in Deutschland, 31.12.2025 | 1.038.126 Betriebe, BW davon 144.563 = 13,9 % | ZDH; Handwerk BW |
| Hochrechnung DE (Annahme: der BW-Anteil gilt je Gewerk) | Tischler ≈ 31.000, Glaser ≈ 5.600, Rollladenbauer ≈ 4.900 | eigene Rechnung |
| **Betriebe, die Privatkunden Fenster verkaufen und einbauen (Gesamtmarkt)** | **Annahme 8.000–12.000** | Hersteller, ein Teil der Tischler und Glaser, Händler und Montagebetriebe; Überschneidungen abgezogen |
| **davon erreichbar** (Privatsanierung, eigene Website, offen für Digitales) | **Annahme 3.000–4.000** (30–35 %) | Bitkom 2025: Website 26 %, Empfehlung 83 % (Briefing) |
| Umsatzdeckel bei Vollabdeckung des erreichbaren Markts | ≈ 2,3–3,0 Mio. € im Jahr (Ø 63 € × 12) | eigene Rechnung |
| Vergleich Lead-Portal | Aroundhome: über 2.000 Partner (alle Gewerke), höchstens 2 Mitbewerber je Region, monatlich kündbar | aroundhome.de |

### B2C-Prüfung: Aufmaßblatt für Hauseigentümer

In der freien App läuft die KI nach der Einwilligung, aber **vor dem Bezahlen**. Die Tagesgrenze der App liegt bei 3.000 Auswertungen (`KI_TAG_MAX`), das sind bis zu 132 € am Tag.

| | 7,99 € (bis 17.11.) | 12,99 € |
| --- | --- | --- |
| netto (19 % USt) | 6,71 € | 10,92 € |
| nach Zahlungsgebühr (≈ 1,5 % + 0,25 €) | ≈ 6,34 € | ≈ 10,48 € |
| KI je Planung (Annahme: 10 Fenster × 2 Fotos) | 0,88 € | 0,88 € |
| KI je Käufer, wenn 1 von 20 Planern kauft (Annahme) | 17,60 € | 17,60 € |
| **Ergebnis je Käufer** | **≈ −11 €** | **≈ −7 €** |
| Wie viele Planer müssen kaufen, damit es sich trägt? | mindestens 1 von 7 | mindestens 1 von 12 |

---

## Miriam Adler, 41, Gründerin einer vertikalen SaaS fürs Handwerk (zwei Exits)

**Hoffnung: 5 von 10.** Das Produkt ist weiter als bei den meisten Gründern, die ich mit null Kunden sehe. Aber es gibt keinen Beleg, dass ein Fensterbauer zahlt; laut Verkaufsseite ist die Kasse noch nicht einmal offen. Product-Market-Fit ist nicht gescheitert, er ist ungetestet.

**Rechnung.** Nach A1–A8: 27, 74 und 120 Pakete für 1.000, 3.000 und 5.000 € Gewinn. Mein Punkt ist das Onboarding. Bei Ø 4,4 Stunden Einrichtung (A5) bezahlt die Gebühr nur deine Zeit, und ab 50 Kunden frisst dich jede Handarbeit. Essential muss sich in zehn Minuten selbst einrichten lassen.

**Preis und Zuschnitt.** Nicht zu teuer, falsch geschnitten:
- Essential für 39 € steht direkt neben dem kostenlosen Widget von Clean Invoice und verliert. Mach unten ein kostenloses Paket: Subdomain, „Powered by“, etwa 100 KI-Auswertungen im Monat. Jeder Gratis-Betrieb zeigt seinen Kunden eeziframes.
- Plus ist der Anker.
- Signature verträgt 129–149 €, wenn du die Einbindung in die Website des Betriebs übernimmst.
- Jahreszahlung mit zwei Monaten Rabatt senkt die Kündigungen.

B2C mit 12,99 € ist Taschengeld. Wertvoller ist der Hauseigentümer, der sein Blatt kostenlos an einen Betrieb in der Nähe schickt. Die Weiterleitung löst das Grundproblem: Ein Konfigurator bringt keine Besucher, eine Anfrage schon.

**Risiken.**
1. Es kommen keine Anfragen, und der Betrieb kündigt nach drei Monaten. Entschärfen: die Einbindung mitliefern (Knopf auf der Website, Google-Unternehmensprofil, Link in der Angebotsmail) und Anfragen aus der Nähe zuspielen.
2. Clean Invoice ist gratis. Entschärfen: kostenlose Stufe, Vorsprung zeigen (KI-Befund, Klärungsliste, eigene Marke).
3. Hersteller-Konfiguratoren. Daneben stehen statt dagegen: herstellerneutral, mit Aufmaß.

**90 Tage.** Weiter, wenn 10 Betriebe live sind (auch kostenlos), 5 davon zwei echte Anfragen im Monat bekommen und 3 zahlen. Abbruch, wenn nach 100 Gesprächen mit Inhabern keiner zahlen will.

---

## Dr. Felix Wagner, 45, Business Angel

**Hoffnung: 4 von 10.** Die Rechnung je Kunde trägt, die Kundengewinnung ist offen. Allein in einem Markt kleiner Betriebe ist das ein Geschäft mit Deckel bei einigen tausend Euro im Monat, kein Fall für Investoren. Für dein Ziel reicht das.

**Rechnung.**
- Deckungsbeitrag: Ø 55 € je Paket (A1–A3).
- Kundenwert: bei 4 % Kündigung 55 € × 25 Monate ≈ 1.375 €, bei 6 % ≈ 920 €.
- Tragbare CAC bei Kundenwert : CAC = 3: **höchstens 300–460 €**, zurück nach 6–8 Monaten.
- Die Einrichtungsgebühr ist kein Polster, sie bezahlt deine Stunden.
- Mit 300 € CAC in Geld brauchst du **27, 74 und 120 Pakete** für 1.000, 3.000 und 5.000 € Gewinn.

Engpass ist deine Zeit: bei 120 Paketen etwa 80 Stunden im Monat, mit eigenem Telefonvertrieb 140. Am Telefon kostet jeder Kunde 12–15 Stunden (Annahme: 100 Anrufe, 10 Gespräche, 3 Vorführungen, 1 Abschluss), mit 30 €/h also 360–450 €: an der Grenze.

**Markt.** 5.000–6.500 Fensterhersteller plus Tischler, Glaser, Händler: angenommen 8.000–12.000 Betriebe, erreichbar 3.000–4.000. 120 Pakete sind 3–4 %: machbar, nicht geschenkt.

**Preis.** Das Aufmaßblatt für 12,99 € ist eine Kostenfalle, denn die KI läuft vor dem Bezahlen. Kauft einer von 20 Planern (Annahme), kostet die KI je Käufer 18 € bei 10,50 € Erlös. Die Gebühr je weitergeleiteter Anfrage taugt als zweites Standbein bei 30–50 € je exklusiver Anfrage mit Aufmaß (Annahme), aber erst mit genug Betrieben in einer Region.

**Risiken.**
1. Deine Zeit: Selbsteinrichtung und Vorlagen.
2. Kosten der B2C-KI: KI erst nach dem Bezahlen oder kleines Freikontingent.
3. Ein einziger Kanal: zwei parallel messen.

**90 Tage.** Miss die Kosten je Vorführung und je Abschluss. Weiter bei mindestens 5 Zahlenden und einer CAC von höchstens 400 €. Instagram nur als Test mit 300 €; kostet eine Vorführung mehr als 150 €, stoppen.

---

## Carsten Rehm, 52, früher Vertriebsleiter bei einem Fensterprofil-Hersteller (Gegenspieler)

**Hoffnung: 3 von 10.** Ich habe Fensterbauern jahrelang Werkzeuge verkauft. Die meisten wollen nicht mehr Anfragen: zehn Wochen Arbeit im Buch, keine Monteure. Ein Laien-Aufmaß erspart keine Fahrt, der Meister fährt trotzdem raus; die 65 € je gesparter Fahrt glaubt er nicht.

**Rechnung, vorsichtig.** Handwerker kaufen das Billigste: Mix 60/30/10, Ø 48 € Deckungsbeitrag. Mit 7 % Kündigung im ersten Jahr und 400 € CAC bleiben je Paket 20 € im Monat, also **58, 158 und 258 Pakete**. 258 zahlende Betriebe sind für einen ohne Außendienst drei bis fünf Jahre Arbeit. Tragbar wären bei 7 % höchstens 230 € CAC (48 € × 14 Monate ÷ 3).

**Markt.** Die 6.500 Hersteller von 2016 werden weniger, und nur 26 % finden Handwerker über Websites, 83 % über Empfehlung (Bitkom). Der Konfigurator wirkt nur bei diesem Viertel.

**Preis.** Nicht der Preis ist das Problem, sondern „kostenlos“ nebenan. Die 12,99 € helfen eher dem Online-Fensterversand: Wer selbst misst, bestellt selbst. Prüf, ob nicht Online-Händler, die an Messfehlern Geld verlieren, die eigentlichen Zahler sind. Die Gebühr je Anfrage macht dich zum Portal gegen Aroundhome mit über 2.000 Partnern.

**Risiken.**
1. Clean Invoice: gratis, in zwei Minuten eingebaut. Wer zahlt da 39 €? Nur mit kostenloser Stufe verkaufbar.
2. Hersteller und Händler binden ihre Fachbetriebe mit eigenen Werkzeugen. Entschärfen: über sie verkaufen. Ein Fachhändler mit 200 Montagebetrieben ist ein Vertrag statt 200.
3. Ein-Mann-Firma ohne Referenz, Kasse „in Kürze“: Kein Betrieb hängt seine Kundenkontakte an einen Unbekannten. Erst drei Referenzen mit Namen und Zahlen.

**Veto: Kein Euro für Instagram-Werbung an Fensterbauer, bevor fünf Betriebe zahlen.**

**90 Tage.** Abbruch, wenn nach 150 direkten Kontakten weniger als 3 zahlen, die Piloten im Schnitt unter einer echten Anfrage im Monat bleiben oder ein Betrieb sagt: „Das Blatt nutze ich nicht.“ Weiter nur, wenn die Zahlen mich widerlegen.

---

## Sprecher der Gruppe (Dr. Felix Wagner)

**Hoffnung der Gruppe: 4 von 10** (Adler 5, Wagner 4, Rehm 3). Das Geschäft ist nicht widerlegt, sondern ungetestet: Bisher hat kein einziger Betrieb bezahlt, und er konnte es auch nicht.

**Mehrheit (Adler, Wagner):** Es gibt bedingte Hoffnung. Der Inhaber soll weitermachen, aber als 90-tägige Beweisphase mit harten Zahlen und mit umgebautem Modell:
- eine kostenlose Stufe gegen Clean Invoice;
- Selbsteinrichtung statt Handarbeit;
- „Anfragen aus Ihrer Nähe“ als Grund, Kunde zu bleiben.

1.000 € Gewinn (27 Pakete) sind in 12 Monaten realistisch, wenn die 90 Tage bestehen. 5.000 € (120 Pakete) gehen nur über einen Kanal und nicht über Einzelanrufe.

**Minderheit (Rehm):** Das Abo für Fensterbauer trägt allein nicht. Hoffnung gibt es nur über einen Kanal (Fachhändler, Profilhersteller, Einkaufsgemeinschaft) oder über ein anderes Segment: Online-Fensterhändler, die an Messfehlern Geld verlieren. Er verlangt, beides in den 90 Tagen mit je fünf Gesprächen zu prüfen. Die Mehrheit nimmt das auf.

**Veto des Gegenspielers:** Keine bezahlte Instagram-Werbung an Fensterbauer, bevor fünf Betriebe zahlen. **Die Gruppe nimmt das Veto an.** Wagners 300-€-Test wartet bis dahin. Organische Stories bleiben erlaubt. Bezahlte Werbung an Hauseigentümer erst, wenn die KI der freien App gedeckelt ist; sonst kostet jede Anzeige doppelt.

**Gemeinsame Messlatte für Tag 90:**

| Messgröße | weiter | abbrechen |
| --- | --- | --- |
| direkte Kontakte mit Inhabern (Telefon, Besuch, Innung) | ≥ 150 | (Voraussetzung, sonst ist nichts getestet) |
| Vorführungen | ≥ 20 | < 10 |
| Betriebe live, auch kostenlos | ≥ 10 | < 5 |
| zahlende Pakete | ≥ 5 | < 3 |
| echte Anfragen je Pilot und Monat | Ø ≥ 2 | Ø < 1 |
| Urteil der Betriebe: Aufmaßblatt verwertbar | mindestens 3 von 5 sagen ja | die Mehrheit sagt nein |
| Einrichtungszeit je Instanz | ≤ 2 h | > 5 h |
| Kosten je Abschluss, Zeit mit 30 €/h | ≤ 400 € | > 600 € |

Liegen die Werte dazwischen: 30 Tage verlängern und das Segment wechseln (Händler-Kanal oder Online-Fensterhändler).

**Die drei wichtigsten Empfehlungen, nach Wirkung:**

1. **Erst beweisen, dann werben.**
   - Die Kasse sofort öffnen.
   - 10 Pilotbetriebe persönlich gewinnen: Telefon, Besuch, Innung, eigene Region. 60 Tage gratis gegen Namensnennung und Zahlen.
   - Jede Woche festhalten: Anfragen, gesparte Fahrten, gewonnene Aufträge.
   - Daraus drei Referenzen mit Namen für die Verkaufsseite machen. Die Seite selbst verkauft erst, wenn diese Belege da sind.
2. **Die Pakete gegen „kostenlos“ umbauen.**
   - Essential für 39 € durch eine kostenlose Stufe mit Selbsteinrichtung ersetzen: Subdomain, „Powered by“, kleines KI-Kontingent.
   - Verdienen mit Plus (Marke, Domain) und Signature (129–149 €, Einbindung in die Website inklusive).
   - Jahreszahlung mit Rabatt anbieten.
   - Einrichtungsgebühr nur, wo Handarbeit anfällt.
3. **Anfragen verkaufen statt Werkzeug, und die Kosten deckeln.**
   - Die KI der freien App vor dem Bezahlen deckeln: Tagesgrenze von 3.000 senken, Freikontingent je Planung.
   - Das Aufmaßblatt für Hauseigentümer kostenlos machen, wenn sie es an einen Betrieb weiterleiten.
   - „Anfragen aus Ihrer Nähe“ in einer Region mit den Pilotbetrieben starten (Annahme: 29–49 € je exklusiver Anfrage).
   - Parallel je fünf Gespräche führen: mit einem Kanal (Fachhändler oder Profilhersteller) und mit Online-Fensterhändlern.

---

## Quellen

- Munich Strategy Group, „Deutschlands Fensterindustrie im Formcheck“, berichtet von Baulinks am 17.04.2016: https://www.baulinks.de/webplugin/2016/0468.php4
- VFF-Branchenstrukturanalyse (7.200 Betriebe 2007), Baulinks 2008: https://www.baulinks.de/webplugin/2008/0574.php4
- Handwerk BW, Betriebsstatistik 2025 (Stichtag 31.12.2025): https://handwerk-bw.de/fileadmin/media/Publikationen/Betriebsstatistik/2026/HANDWERK_BW-Statistik_Betriebsstatistik_2025_pdf.pdf
- ZDH, Wirtschaftlicher Stellenwert des Handwerks 2025: https://www.zdh.de/daten-und-fakten/kennzahlen-des-handwerks/wirtschaftlicher-stellenwert-des-handwerks-2025/
- Clean Invoice, Fenster-Konfigurator zum Einbinden (kostenlos, Backlink-Pflicht, ohne Preise): https://www.clean-invoice.com/rechner-einbinden/fenster-konfigurator
- Aroundhome, Partner werden Fenster (über 2.000 Partner, höchstens 2 Mitbewerber je Region): https://www.aroundhome.de/partner-werden/fenster/
- Bitkom 2025, ZDH Q2/2026: laut Briefing (nicht neu geprüft)
- Repo: `web/assets/pakete.js`, `docs/KI-KOSTEN.md`, `functions/api/ki.js`, `functions/api/umgebung.js` (`KI_TAG_MAX` 3.000), `web/fuer-fensterbauer/index.html` („Die Bestellung wird in Kürze freigeschaltet“)

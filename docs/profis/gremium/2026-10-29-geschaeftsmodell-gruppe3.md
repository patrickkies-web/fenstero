# Gremium „Hat eeziframes eine Zukunft?“ · Gruppe 3: Vertrieb und Marketing

29.10.2026 · Lena Özdemir, Tim Kessler, Sandra Vogt (Sprecherin), Nico Brandl

## Grundlage

- **Verkaufsseite live** (https://eeziframes.com/fuer-fensterbauer/): am Telefon 390 × 844 sind es 22 Bildschirme (18.060 px), dazu die ersten 2 am Schreibtisch (1280 × 800). Außerdem die Startseite (10 Bildschirme am Telefon, 2 am Schreibtisch), /bestellen/ und die Vorschau hinter „Selbst ausprobieren“. Die Bilder liegen unter `/tmp/claude-0/-home-user-fenstero/6308e9cd-6489-590e-a8f0-f7de4414f68a/scratchpad/gremium-geschaeft/bilder/` (vk-tel-01 … 22, vk-desk-01/02, start-tel-01 … 10, start-desk-01/02, bestellen-tel-01, ausprobieren-tel-01), der Seitentext in `/tmp/claude-0/-home-user-fenstero/6308e9cd-6489-590e-a8f0-f7de4414f68a/scratchpad/gremium-geschaeft/vk-tel-text.txt`.
- **Instagram:** marketing/highlights/ (README, PROMPTS.md, storyboard.json, BEITRAGS-LINIE.txt); angesehen haben wir export h01, h02, h05 und h19.
- **Befunde, auf die sich alle beziehen:**
  1. Die Highlights verkaufen ein Modell, das es nicht mehr gibt: den Aufmaß-Link aus dem Betriebskonto (h03–h06), „Links kosten nichts … danach 9 € netto, keine Grundgebühr“ (h19) und „975 € oder 108 €, Tarif Start“ (h02). Im FAQ der Verkaufsseite steht dagegen: „Das Konto mit Kundenlinks gibt es seit dem 28. Oktober 2026 nicht mehr.“ Heute gelten 39/69/99 € im Monat plus Einrichtung.
  2. Auf der Verkaufsseite gibt es kein Gesicht, keine sichtbare Telefonnummer, keinen Kunden und keine Referenz. „Pilotphase: Die Kasse … öffnet in Kürze“ steht nur im Fuß (Bild 22), die Paketknöpfe heißen trotzdem „… bestellen“.
  3. Die schwebende Pille „Zum Konfigurator“ (ab Bild 02, auch am Schreibtisch) führt in die App-Demo (`/app/?ausprobieren=signature&direkt`) und nicht zur Anfrage.
  4. Die Website zählt schon heute ohne Cookies auf dem Server: Besuche, Herkunft, UTM-Kampagnen, Klicks aus Anzeigen und das Ereignis `paket_frage` (functions/api/statistik.js, functions/auftrag/index.js). Klicks auf Knöpfe, das Öffnen der Demo und das Beispiel-PDF zählt sie nach unserer Durchsicht nicht als Ereignis (bitte prüfen).
- **Annahmen, nicht belegt:** Besucherzahl, Anfragen und zahlende Kunden sind unbekannt, vermutlich 0 bis 2 Paketkunden. Zeit und Budget des Inhabers sind ebenfalls unbekannt. Markt: rund 7.200 Fensterbaubetriebe laut VFF, Stand 2009 und damit veraltet [M1], dazu Tischler mit Fensterbau und Fensterhändler.

---

## 1. Lena Özdemir, 34, Performance-Marketing Meta/Instagram

**Hoffnung: 5/10.** Das Produkt ist echt und lässt sich erklären. Kalte B2B-Werbung auf Meta trägt es aber nicht allein: Die Zielgruppe ist klein und dort schlecht anzusteuern.

**Lohnt sich Werbung?** Als Hauptkanal noch nicht. „Fensterbauer“ lässt sich auf Meta nicht sauber auswählen: Berufsangaben sind dünn, und seit Januar 2026 hat Meta weitere Detailoptionen gestrichen [L3]. Wer auf „Fenster“ oder „Tischler“ zielt, erreicht vor allem Hauseigentümer. Also breit ausspielen (NRW, Niedersachsen, 30 bis 65 Jahre). Die Anzeige spricht die Zielgruppe direkt an („Fensterbauer?“), und das Formular filtert mit der Pflichtfrage „Fensterbau / Tischlerei / Fensterhandel / Privatkunde“.

**Ziel:** Leads über ein Sofort-Formular („Höhere Absicht“), Angebot „Pilotplatz + Muster-Aufmaßblatt“. Kein Pixel, er bräuchte eine Cookie-Einwilligung. Retargeting geht über Interaktionen: Video zu 50 % gesehen, Profil besucht, Formular abgebrochen.

**Budget:** 7 Tage zu je 20 €, also 140 €. Kommen weniger als 3 echte Betriebe, ruht die B2B-Werbung bis zu den ersten Referenzen. Sonst 600 € im Monat für 2 Monate.

**Richtwerte** (USA, in $): Lead-Kampagnen, alle Branchen: CPC 1,80 $, CPL 27,39 $. Haus & Renovierung kommt auf 2,18 $ und 42,95 $, Industrie & Gewerbe auf 35,87 $ CPL [L1], B2B-SaaS auf 63,40 $ CPL [L2]. Meine Schätzung (Annahme): 30–60 € je Formular, 80–200 € je echtem Betrieb. Bei 20 % Abschluss kostet ein Kunde 400–1.000 €. Ein Plus-Kunde bringt im ersten Jahr 978 €. Das rechnet sich nur, wenn er bleibt.

**Drei Anzeigen:**
1. Reel, Sie vor einem echten Fenster: „Wie viele Ihrer Aufmaßtermine wurden nie ein Auftrag?“ Schnitt aufs Telefon, das Aufmaßblatt kommt an.
2. Bildschirmaufnahme, 15 s: „Ihr Kunde misst. Sie rechnen.“ Drei Breiten, drei Höhen, 3-D-Modell, dann das PDF.
3. Karussell je Stadt: „Fensterbau in Gütersloh? So sähe Ihr Konfigurator aus.“ Ausgespielt in 30 km um die Stadt.

**Diese Woche:** Den Test für 140 € mit den Anzeigen 1 und 3 starten.

---

## 2. Tim Kessler, 38, Conversion-Optimierung B2B

**Hoffnung: 6/10.** Die Seite ist sauberer als alles, was ich aus dem Handwerk kenne. Aber null Besucher mal jede Conversion-Rate ergibt null. Die Seite ist nicht der Engpass, sie verliert nur unnötig.

**Fünf Hebel, nach Wirkung:**
1. **Kein Mensch, kein Beweis** (Bild 01, 13, 22). Ein Anbieter ohne Gesicht wirkt wie ein Risiko. Änderung: Foto, Name, Handynummer und WhatsApp oben und am Formular. „Pilotphase“ aus dem Fuß nach oben holen, als Angebot: „10 Pilotplätze, Einrichtung 0 €“.
2. **Die Pille „Zum Konfigurator“** (ab Bild 02, auch am Schreibtisch) führt in die App-Demo statt zur Anfrage und verdeckt Inhalte (Bild 02, 09, 11). Änderung: „Pilotplatz anfragen“ mit Telefon-Symbol, erst nach dem ersten Bildschirm.
3. **Neun verschiedene Aufforderungen** (Pakete ansehen, Selbst ausprobieren, Zum Konfigurator, Paket anfragen, … bestellen, Beispiel ansehen, Frage senden, Interesse vormerken, Schreiben Sie uns). Dazu widerspricht „bestellen“ dem Hinweis „Kasse öffnet in Kürze“ (Bild 22). Änderung: eine Hauptaktion und eine Nebenaktion („Beispiel ausprobieren“). Die Paketknöpfe füllen das Formular vor.
4. **Das Geldargument kommt erst bei 85 % der Seite** (Bild 17–18). Änderung: eine Zeile direkt unter den Kopfbereich: „Zwei gesparte Fahrten im Monat: 130 €. Plus kostet 69 €.“
5. **„Vorher eine Frage?“** (Bild 12–13) steht neben 99–239 € Vorkasse. Änderung: „15 Minuten am Telefon, Ihre Seite als Vorschau“. Felder: Name, Betrieb, Telefon, Wunschzeit. Am Preis steht Sandras Risikoumkehr.

**Ziel:** Bei kaltem Verkehr 3–4 % Anfragen je Besuch (Unbounce-Median: SaaS 3,8 %, alle Branchen 6,6 % [T1]). Bei warmem Verkehr (Brief, Anruf, Messe) ab 20 %. Vom Gespräch zum Paket 40 % (Annahme).

**Messen:** Ihre Statistik zählt schon ohne Cookies; dazu Ereignisse per sendBeacon, ohne Kennung, also ohne Banner: Klick auf die Hauptaktion mit Ort, Demo geöffnet, Beispiel-PDF geöffnet, /bestellen/ Schritt 1–5, Klick auf Telefon oder WhatsApp, Vormerken. Jeder Link nach draußen bekommt `utm_source` (qr, messe, partner, instagram).

**Diese Woche:** Die Punkte 1 und 2 umsetzen, ein Tag Arbeit.

---

## 3. Sandra Vogt, 46, B2B-Vertrieb im Handwerk

**Hoffnung: 6/10.** Es fehlt nicht am Produkt, sondern am Vertrieb. 10 Betriebe in 90 Tagen schafft man mit Fleiß. Für ein Gehalt braucht es danach Partner, die ohne Sie verkaufen.

**Wen:** Inhabergeführte Fensterbauer, Tischler mit Fensterbau und Fensterhändler, 3 bis 20 Leute, mit Privatkunden im Altbau und einer Website ohne Konfigurator. Umkreis 100 km, damit Sie hinfahren können; 200 Betriebe aus Google Maps und den Fachbetriebssuchen der Profilhersteller. Zuerst kommt jeder dran, der ein Konto mit Kundenlinks hatte. Die haben schon einmal Ja gesagt.

**Wie:** Kalte E-Mails an Betriebe brauchen eine Einwilligung, kalte Anrufe eine mutmaßliche, und das Risiko tragen Sie [S1]. Also erst ein Brief mit QR-Code zur Vorschau mit dem Namen des Betriebs; nach dem Scan Besuch oder Anruf. Persönliches Vorbeigehen wirkt im Handwerk am stärksten.

**Kern des Skripts:** „Patrick Kies aus Herzebrock. Wie viele Erstaufmaße fahren Sie im Monat, aus denen nie ein Auftrag wird? Bei mir misst Ihr Kunde selbst, Sie bekommen das Aufmaßblatt fürs Angebot, unter Ihrem Namen. Das Feinaufmaß bleibt bei Ihnen. Ich suche zehn Betriebe in OWL. Darf ich es Ihnen in 15 Minuten zeigen?“ Einwände: „Kunden können nicht messen“ → Die Klärungsliste zeigt, wo nachgemessen werden muss. „Clean Invoice ist gratis“ → Dort steht deren Marke drauf, hier Ihre.

**Einstieg „Pilot 10“:** Einrichtung 0 €, Plus 12 Monate zum Essential-Preis (39 €), 60 Tage Geld zurück, monatlich kündbar. Gegenleistung: Name als Referenz, ein Satz für die Seite, ein Feedbackgespräch im Monat.

**Trichter** (Annahme): 200 Betriebe → 120 erreicht → 40 Gespräche → 20 Vorführungen → 10 Piloten. Das sind 4 bis 5 Stunden Vertrieb am Tag.

**Multiplikatoren:** Webdesigner für Handwerker (20 % dauerhafte Provision). Kreishandwerkerschaft und Tischler-Innung: Vortrag „Erstaufmaß und Haftung“. Händlerbetreuer der Hersteller auf der BAU München, 11.–15.01.2027 [S2]. Hersteller dauern 6 bis 12 Monate, bringen aber ganze Händlernetze.

**Diese Woche:** Alle früheren Konten anrufen und fünf Vorführungen buchen.

---

## 4. Nico Brandl, 29, Social Media für Handwerksmarken

**Hoffnung: 5/10.** Für Hauseigentümer ist Instagram stark. Für Fensterbauer ist es ein Schaufenster, aber kein Vertriebskanal: Wen Sandra anruft, der schaut zuerst auf Ihr Profil. Und dort stehen gerade falsche Preise.

**Highlights:** Heute archivieren: „Link“ (h03–h06), „Preise“ (h19, h20) und h02. Sie zeigen das Konto mit Kundenlinks, das es seit dem 28.10. nicht mehr gibt, und 9 € je Projekt statt 39–99 € im Monat. Wer das sieht und danach die Seite öffnet, glaubt keinem Preis mehr. Nach kurzer Prüfung bleiben „Kunde“ (h07–h09), „Alles drin“ (h10–h13) und „Ergebnis“ (h14–h17); h18 noch prüfen. Neu: „Pakete“ (nur dauerhafte Nettopreise), „Pilot“ (Angebot, Ihr Gesicht, Ihre Nummer) und „Für Hauseigentümer“. Grün und Inter passen nicht zur DNA: Gestaltung später, Inhalt jetzt.

**Bio:** Statt „Wir verkaufen keine Fenster, sondern …“: „Fenster-Konfigurator für Fensterbauer. Ihr Kunde misst, Sie bekommen das Aufmaßblatt. 10 Pilotplätze ↓“. Der Link bekommt `utm_source=instagram`.

**Takt für eine Person:** etwa 4 Stunden je Woche, vorproduziert an einem halben Tag: 2 Reels, 1 Karussell, 3 Stories.
- **50 % Hauseigentümer** (Reichweite, per du wie auf der Startseite): „Du misst dein Fenster falsch.“ / „Zollstock raus: 3 Breiten, 3 Höhen, das kleinste Maß zählt.“ Die 23 Ratgeber werden zu Karussells.
- **30 % Fensterbauer:** „Was kostet Sie eine Fahrt ohne Auftrag?“ / „So kommt eine Anfrage bei Ihnen an“ (Scroll durchs PDF) / „Live: Fensterbau X aus Y“ als Collab-Beitrag mit dem Pilotkunden. Er erscheint auf beiden Profilen.
- **20 % Sie selbst:** „Ich baue einen Konfigurator in 3 Tagen“, als Zeitraffer und mit Gesicht.

Bär und Waschbär bleiben für die Hauseigentümer, denn Fensterbauer kaufen von Menschen. Creator: zwei oder drei Fensterbau-Monteure mit 5.000 bis 30.000 Followern fragen und mit einem Jahr Signature bezahlen (Namen noch nicht recherchiert).

**Diese Woche:** Die veralteten Highlights archivieren und die Bio ändern. Zehn Minuten, größter Schaden weg.

---

## Sprecherin der Gruppe: Sandra Vogt

**Mehrheit (Sandra, Tim, Lena; Hoffnung 5–6):** Ja, es gibt Hoffnung. Der Engpass liegt aber im Vertrieb, nicht im Produkt und nicht in der Seite. Die ersten 10 Kunden kommen über persönlichen Direktvertrieb mit einem Pilotangebot. Werbung gibt es höchstens als kleinen Test mit Abbruchregel. Erst kommen Referenzen, dann Reichweite. Rechnung (Annahme): Die Fixkosten von etwa 50 € im Monat sind ab dem zweiten Kunden gedeckt. 100 Kunden mit durchschnittlich 60 € bringen 6.000 € im Monat, genug für ein Gehalt, solange sie bleiben. Monatlich kündbar heißt: Halten zählt so viel wie Gewinnen.

**Minderheit (Nico, zum Teil Lena):** Langfristig liegt der größere Hebel bei den Hauseigentümern: Reichweite über Instagram und die Ratgeber, dazu „Anfragen aus Ihrer Nähe“. Fensterbauer zahlen lieber für Anfragen als für Software. Gegenrede der Mehrheit: Das widerspricht dem Versprechen „Kein Portal und kein Marktplatz“ auf der eigenen Seite (Bild 02). Und Betriebe mit rund 10 Wochen Auftragsreichweite suchen eher Zeit als Anfragen. Entscheiden erst nach den ersten 10 Kunden.

**Die drei wichtigsten Empfehlungen, nach Wirkung:**
1. **Direktvertrieb „Pilot 10“ starten.** Erst die früheren Konten mit Kundenlinks, dann 200 Betriebe im Umkreis von 100 km: Brief mit QR-Vorschau, danach Besuch oder Anruf. Angebot: Einrichtung 0 €, 60 Tage Geld zurück, Referenz als Gegenleistung. Ziel: 10 zahlende Betriebe bis Ende Januar 2027.
2. **Die Verkaufsseite für warme Besucher umbauen.** Gesicht, Nummer und Pilotangebot nach oben, eine Hauptaktion statt der Pille „Zum Konfigurator“, das Rechenbeispiel nach oben, Klicks ohne Cookies als Ereignisse zählen.
3. **Instagram bereinigen und als Beweis nutzen.** Die veralteten Highlights sofort entfernen, die Bio auf die Pilotplätze ausrichten und mit jedem Pilotkunden einen Collab-Beitrag machen. Meta-Werbung nur als Test für 140 € mit Abbruchregel und mit Retargeting über Interaktionen, ohne Pixel.

---

## Quellen

- [L1] LocaliQ/WordStream, Facebook Advertising Benchmarks, aktualisiert am 23.09.2026; Lead-Kampagnen: alle Branchen CPC 1,80 $, CTR 2,70 %, CVR 8,54 %, CPL 27,39 $; Home & Home Improvement CPC 2,18 $, CPL 42,95 $; Industrial & Commercial CPC 1,55 $, CPL 35,87 $; Traffic-Kampagnen CPC 0,60 $. https://localiq.com/blog/facebook-advertising-benchmarks/
- [L2] Focus Digital, Average Cost per Lead on Facebook, July 2026 Report (138 Meta-Kampagnen, Nordamerika, März–Juni 2026, nach Ausgaben gewichtet): B2B/SaaS 63,40 $, Home Services 45,50 $, Mittel etwa 42 $. https://focus-digital.co/average-cost-per-lead-on-facebook-july-2026-report/
- [L3] MediaPost, „Meta To Remove More Detailed Targeting Options Deemed 'Sensitive'“ (ab 15.01.2026). https://www.mediapost.com/publications/article/392609/meta-to-remove-more-detailed-targeting-options-dee.html · Meta for Developers, „Removal of Detailed Targeting Exclusions“ (21.01.2025). https://developers.facebook.com/blog/post/2025/01/21/removal-of-detailed-targeting-exclusions/
- [T1] Unbounce Conversion Benchmark Report (Median 2024: alle Branchen 6,6 %, SaaS 3,8 %). https://unbounce.com/conversion-benchmark-report/saas-conversion-rate/
- [S1] § 7 Abs. 2 UWG (Telefonwerbung gegenüber Unternehmen nur mit zumindest mutmaßlicher Einwilligung, E-Mail-Werbung nur mit ausdrücklicher Einwilligung); BGH, 16.11.2006, I ZR 191/03 (ein allgemeiner Sachbezug genügt nicht); IHK Karlsruhe, „Werbung – was ist erlaubt?“ https://www.ihk.de/karlsruhe/fachthemen/recht/wettbewerbsrecht/werbung-was-ist-erlaubt-2459622
- [S2] BAU 2027, 11.–15.01.2027, Messe München. https://www.messen.de/de/8424/muenchen/bau-muenchen/info
- [M1] baulinks.de, 28.07.2009: „In Deutschland gibt es rund 7.200 Fensterbaubetriebe mit etwa 100.000 Beschäftigten.“ https://www.baulinks.de/webplugin/2009/1279.php4
- Im Repo: functions/api/statistik.js (eigene Statistik ohne Cookies, Kampagnen- und Anzeigenerkennung), functions/auftrag/index.js (`ereignis:paket_frage`), web/fuer-fensterbauer/index.html (FAQ „Ich hatte ein Konto mit Kundenlinks“), marketing/highlights/storyboard.json (h02, h03–h06, h19, h20).

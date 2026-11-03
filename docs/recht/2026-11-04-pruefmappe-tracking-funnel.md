# Prüfmappe: Schritte zählen und Lenkung zum Aufmaßblatt

Stand 4.11.2026, zur Prüfung durch **zwei Rechtsanwälte** (Wunsch des Inhabers). Erstellt von der technischen Umsetzung, nicht von einem
Anwalt; alle Einschätzungen hier sind Vorschläge. Was beide Anwälte ändern, wird wörtlich übernommen; bis zur Freigabe gelten die Schalter
in Abschnitt 5.

## Freigabe

| | Anwalt 1 | Anwalt 2 |
|---|---|---|
| Name, Kanzlei | | |
| Datum | | |
| Teil A Schritte zählen: frei / mit Änderungen / nicht frei | | |
| Teil B KI-Vorschau-Kontingent: frei / mit Änderungen / nicht frei | | |
| Teil C Texte (Datenschutzerklärung, Cookies und Speicher): frei / mit Änderungen | | |
| Änderungen (Abschnitt oder Seite und Wortlaut) | | |

Online seit dem 4.11.2026: www.eeziframes.com/datenschutz/ (Abschnitt 3) und www.eeziframes.com/cookies/.

## Teil A: Schritte in App und Startseite zählen

**Zweck.** Herausfinden, an welcher Stelle Besucher aufhören (Startseite bis Klick in die App; in der App Folie für Folie bis Kauf oder
Anfrage), um diese Stellen zu verbessern. Die App ist eine einzige Adresse (/app/), deshalb sieht der Server die Folien nicht von selbst.

**Was technisch passiert.**

1. Ein eigenes Skript (`web/assets/schritt.js`, ohne Dienste Dritter) schickt per `navigator.sendBeacon` an die eigene Adresse
   `/api/schritt` kurze Meldungen mit diesen Feldern:
   - **Strang:** Startseite, eigenes Aufmaß, Kundenlink eines Fensterbauers, Führung.
   - **Schritt:** Name der Folie oder Szene beim ersten Anzeigen im Tab, z. B. „messen“, „frage-farbe“, „kasse“, „szene-weg“,
     „klick-app-hero“.
   - **Dauer:** wie lange die vorige Folie zu sehen war, nur als Stufe (unter 30 s, bis 2 min, länger).
   - **Zeichen für Mühe:** Erklärung geöffnet, zurück, „Weiß ich noch nicht“, Maß-Rückfrage.
   - **Ausstieg:** Folie, die beim Verlassen der Seite zuletzt zu sehen war (Ereignis `pagehide`).
   - **Merkmal:** ob vorher eine KI-Vorschau am eigenen Haus gerechnet wurde, nur an Weiche, Kasse, Kauf, Anfrage.
   - **Herkunft**, grob: Startseite, Ratgeber, Seite für Fensterbauer, Werbeanzeige, andere Website, direkt. Das Skript leitet sie aus
     `document.referrer` und aus Kennzeichen in der eigenen Adresse ab (`utm_…`, `gclid`, `fbclid`, `msclkid`).
2. **Keine Inhalte:** keine Maße, Namen, Adressen, Fotos. **Keine Kennung**, kein Cookie, kein localStorage. Was schon gemeldet ist, merkt
   sich das Skript nur im Arbeitsspeicher des Tabs; nach dem Neuladen zählt es neu.
3. **Server** (`functions/api/schritt.js`):
   - Er zählt nur Tageszähler und Stundenzähler in der vorhandenen Tabelle `statistik` (Tag, Schlüssel, Anzahl), dazu die Geräteklasse
     (Telefon, Tablet, Computer) aus der Browser-Kennung, die jede Anfrage ohnehin mitschickt.
   - Die IP-Adresse dient nur als Schlüssel der Bremse im Arbeitsspeicher (höchstens 60 Meldungen je Minute und Anschluss) und wird nicht
     gespeichert.
   - Er nimmt nur Namen nach festen Mustern an.
4. **Nicht gezählt:** Global Privacy Control oder Do Not Track (das Skript sendet dann nichts, der Server zählt nichts), der angemeldete
   Inhaber, Bots, die Testansicht für Fensterbauer, die Konfiguratoren der Fensterbauer auf deren Websites (dort gilt deren
   Datenschutzerklärung).
5. **Ansicht:** Zentrale des Inhabers, Statistik, Karte „Wo steigen sie aus?“: je Strang die Schritte mit Anzahl, Ausstiegen, Dauer-Stufen
   und Zeichen für Mühe.

**Vorgeschlagene Rechtsgrundlage.** Art. 6 Abs. 1 lit. f DSGVO (Verbesserung des Angebots), soweit überhaupt personenbezogene Daten
verarbeitet werden (kurz IP-Adresse für die Bremse, Browser-Kennung für die Geräteklasse). Gespeichert werden nur Summen.

**Fragen an die Anwälte.**

1. **§ 25 Abs. 1 TDDDG:** Ist das Skript ein Zugriff auf Informationen in der Endeinrichtung? Es liest `document.referrer`,
   `location.search`, `navigator.doNotTrack` bzw. `globalPrivacyControl` und den Sichtbereich (welche Szene im Bild ist). Wenn ja: Greift
   § 25 Abs. 2 Nr. 2 (unbedingt erforderlich)? Wir halten das bei reiner Reichweitenmessung für fraglich. Wege, falls nicht:
   - **(a)** Herkunft nicht im Browser ableiten (Feld weglassen, eine Zeile in `schritt.js`).
   - **(b)** Einwilligung einholen (Banner; die Zahlen wären dann unvollständig).
   - **(c)** Zählen ganz abschalten (Abschnitt 5).
2. **Anonymität der Summen:** Reichen Tageszähler ohne Kennung als anonym? Pro Folie und Tag kann ein Zähler 1 sein, wenn sehr wenige
   Besucher kommen.
3. **Informationspflicht (Art. 13 DSGVO):** Reicht der neue Absatz in Abschnitt 3 (Wortlaut unten)? Braucht es einen eigenen
   Widerspruchsweg neben GPC und Do Not Track, etwa einen Schalter „nicht mitzählen“ in der Datenschutzerklärung?
4. **Kundenlink (Strang L):** Wir zählen auch im Kundenlink eines Fensterbauers auf eeziframes.com (eigene Verantwortung von
   eeziframes). Passt das zur Rolle gegenüber dem Betrieb (Auftragsverarbeitung oder eigene Verantwortung)?

**Neuer Wortlaut in der Datenschutzerklärung (Abschnitt 3, eingefügt als zweiter Absatz).**

> **Schritte in der App und auf der Startseite.** Unsere App hat nur eine einzige Adresse; welche Folie Sie gerade sehen, erfährt unser
> Server sonst nicht. Damit wir erkennen, an welcher Stelle Besucher aufhören und was wir dort verbessern müssen, schickt ein kleines
> Skript unserer eigenen Website (ohne Dienste Dritter) seit dem 4. November 2026 kurze Meldungen an unseren Server: in welchem Bereich Sie
> sind (Startseite, eigenes Aufmaß, Kundenlink eines Fensterbauers, Führung), welche Folie oder welchen Abschnitt Sie zum ersten Mal sehen
> (etwa „Messen“, „Wünsche: Farbe“ oder „Kasse“), wie lange die vorige Folie ungefähr zu sehen war (unter 30 Sekunden, bis 2 Minuten oder
> länger), ob Sie dort eine Erklärung geöffnet, „zurück“ oder „Weiß ich noch nicht“ gewählt haben oder ein Maß nachgefragt wurde, welche
> Folie zuletzt zu sehen war, als Sie die Seite verlassen haben, ob vorher eine KI-Vorschau am eigenen Haus gerechnet wurde, und eine grobe
> Herkunft des Besuchs (unsere Startseite, der Ratgeber, unsere Seite für Fensterbauer, eine Werbeanzeige, eine andere Website oder
> direkt), die das Skript aus der Adresse ableitet, von der Sie gekommen sind. Ihre Eingaben, etwa Maße, Namen, Adressen oder Fotos, gehen
> dabei nicht mit. Das Skript merkt sich nur, solange die Seite geöffnet ist, was es schon gemeldet hat; es setzt keine Cookies, schreibt
> nichts in den Speicher Ihres Browsers und vergibt keine Kennung. Unser Server zählt die Meldungen wie oben nur als Summen je Tag und
> Stunde, zusammen mit der Geräteklasse (Telefon, Tablet, Computer). Ihre IP-Adresse verwendet er dabei nur kurz im Arbeitsspeicher, um
> mehr als 60 Meldungen je Minute von einem Anschluss abzuweisen, und speichert sie nicht. Meldet Ihr Browser „Global Privacy Control“
> oder „Do Not Track“, sendet das Skript nichts. In den Konfiguratoren, die Fensterbauer auf ihren eigenen Websites einsetzen, zählen wir
> so nicht.

**Weitere Änderungen.**

- **„Kurz gesagt“, Datenschutzerklärung.** Vorher: „kein Tracking … wie oft unsere Seiten aufgerufen werden, zählt unser eigener Server …“.
  Jetzt: „keine Verfolgung einzelner Personen … wie oft unsere Seiten aufgerufen werden und wie weit Besucher in der App kommen, zählt
  unser eigener Server nur als anonyme Summe je Tag und Stunde“.
- **Abschnitt 3, erster Absatz.** Vorher: „setzen wir keine Cookies, laden kein Mess-Skript und speichern nichts auf Ihrem Gerät oder
  lesen dort etwas aus“. Jetzt: „setzen wir keine Cookies und speichern nichts auf Ihrem Gerät“.
- **Abschnitt 3, Rechtsgrundlage, Satz zu § 25 TDDDG.** Er nennt jetzt, was die Meldungen enthalten: die Stelle der eigenen Seite, die
  grobe Herkunft, die beachtete Einstellung „Do Not Track“. Bitte besonders prüfen (Frage 1).

## Teil B: KI-Vorschau am eigenen Haus, Kontingent und Lenkung

**Was gilt seit 3./4.11.2026.**

- Die Einladung erscheint erst, wenn ein Fenster vollständige Maße hat.
- Auf einem Gerät gibt es eine KI-Vorschau frei, drei mit gesichertem Konto (E-Mail), zehn mit freigeschaltetem Aufmaßblatt. Freigeschaltet
  heißt: gekauft (7,99 €) oder über „Angebote aus deiner Nähe“ (Weg A der Vermittlung; die Weitergabe an Betriebe beruht dort auf eigener
  Einwilligung).
- Der Editor sagt das vorher offen („Eine KI-Vorschau ist frei, weitere mit deinem Aufmaßblatt“). Danach öffnet „KI-Vorschau“ einen Bogen:
  „Weitere Vorschauen mit deinem Aufmaßblatt“, mit den Knöpfen „Zum Aufmaßblatt“ und „Nicht jetzt“.
- Der Zähler liegt im Browser (`aufmass.hausbild.vorschauen`, nur eine Zahl, neu in „Cookies und Speicher“). Die Server-Grenzen sind
  gesenkt: 6 je Anschluss und Tag, 150 am Tag insgesamt.
- Die Einwilligung zur KI-Vorschau (Cloudflare, Stand 2026-11-02c) ist unverändert.

**Fragen an die Anwälte.**

1. **Kopplungsverbot (Art. 7 Abs. 4 DSGVO):** Weitere Vorschauen gibt es auch über Weg A, also nach Einwilligung in die Weitergabe der
   Kontaktdaten an Betriebe. Wir halten das für zulässig: Es ist ein Zusatz, kein Kerndienst; der bezahlte Weg B steht gleichwertig daneben;
   ohne Einwilligung bleibt alles andere nutzbar. Trägt das?
2. **Transparenz (§ 5a UWG):** Reicht der Hinweis vor der ersten Vorschau? Braucht es den Hinweis auch auf der Kauf- bzw. Weichen-Seite
   („mit dem Aufmaßblatt bis zu 10 Vorschauen“)?
3. **§ 25 TDDDG für den Zähler im Browser:** Wir stützen ihn auf § 25 Abs. 2 Nr. 2, weil er zum angebotenen Dienst gehört (Kontingent).
   Einverstanden?
4. **Leistungsbeschreibung:** Muss das Kontingent in die AGB bzw. in die Beschreibung des Aufmaßblatts, wenn es als Teil des Kaufs genannt
   wird?

## Teil C: Noch nicht umgesetzt, später zu prüfen

Aus dem Funnel-Konzept `docs/konzepte/2026-11-03-conversion-funnel.md`:

- **A/B-Tests:** Losen einer Variante je Tab, nur im Arbeitsspeicher. Gilt dafür § 25 TDDDG?
- **Erinnerungs-Mail** („Dein Aufmaß ist zu 60 % fertig“): nur mit eigener Einwilligung (§ 7 UWG).
- **Nachweisfrist für Einwilligungen zur Telefonwerbung** (§ 7a UWG): heute 180 Tage gespeichert. Sind fünf Jahre nötig?
- **Vorschaubild ins Aufmaßblatt und an die Betriebe:** Braucht es dafür eine eigene Einwilligung? Heute bleibt das Bild im Browser.
- **Kontingent auf dem Server** statt im Browser (Anschluss, Kundensitzung, Freischaltung): Welche Daten dürfen dafür gespeichert werden?

## 5. Schalter bis zur Freigabe

- **Schritte zählen ganz aus (Browser sendet nichts):** in `web/config.js` `schritte: false` setzen und online stellen.
- **Schritte zählen aus (Server zählt nichts):** bei Cloudflare die Variable `SCHRITTE_AUS=1` setzen. Wirkt sofort, ohne neue Version.
- **Nur die Herkunft weglassen:** in `web/assets/schritt.js` `o.h = herkunftKlasse();` entfernen.
- **Kontingent der KI-Vorschau ändern:** `HB_FREI_N`, `HB_MIT_KONTO`, `HB_MIT_BLATT` in `web/assets/hausbild.js`.

## 6. Dateien

- **Browser:** `web/assets/schritt.js` (Skript), `web/assets/app.js` (Funktion `schrittMelden`, Zeichen in `act`),
  `web/assets/startseite.js` (Funktion `schritte`), `web/assets/hausbild.js` (Kontingent).
- **Server:** `functions/api/schritt.js` (Annahme), `functions/api/statistik.js` (`trichter`, Auswertung), `functions/api/hausbild.js`
  (Grenzen).
- **Zentrale:** `web/assets/inhaber.js` (Karte „Wo steigen sie aus?“).
- **Texte:** `web/datenschutz/index.html` (Abschnitt 3, „Kurz gesagt“), `web/cookies/index.html` (Satz und Eintrag
  `aufmass.hausbild.vorschauen`).
- **Prüfsuite:** `scripts/pruefen.mjs`, Abschnitt 3c (Browser) und 13 l2 (Server).

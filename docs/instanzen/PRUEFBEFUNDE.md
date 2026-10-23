# Prüfbefunde nach dem Instanzen-Bau (Stand e8d86a0) und ihre Nacharbeit

Zwei unabhängige Prüfer haben den Stand e8d86a0 geprüft (nur lesen und angreifen). Die Nacharbeit ist am 23.10.2026 auf dem Branch `claude/eager-sagan-2ey2vv` erfolgt (vier Gruppen in eigenen Worktrees, je Befund eine Regressionsprüfung, danach die volle Suite 1–30). Was je Befund geschah, steht hier; die Einzelheiten in `docs/INSTANZEN.md`, Abschnitt „Nacharbeit nach der Prüfung“.

## Stand der Nacharbeit

| Nr. | Gewicht | Stand | Was |
|---|---|---|---|
| 1 | muss | behoben | `anmeldungGebraucht` in verwalten.js: Anmeldung mit lebenden Aufmaßen eines Hauseigentümers bleibt (Prüfung 24.12) |
| 2 | sollte | behoben, Entscheidung | Neutraler Absender bleibt optional (Bauplan §4, kostet eine zweite Domain): Texte in Paketbedingungen und Verkaufsseite sagen „sobald eingerichtet“ (Paketbedingungen Stand 2026-10-23), Ampel und Zentrale-Übersicht zeigen den Hinweis (26.5, 26.10, 29.4) |
| 3 | sollte | behoben | Erster Livegang setzt `indexierung` bei Plus und Signature (26.5) |
| 4 | sollte | behoben, Instanz-Zweig | Zeiten in Europe/Berlin in Link, Mail, PDF, Dashboard (24.2); Altbestand bleibt UTC, Entscheidung des Inhabers |
| 5 | sollte | behoben | `paketVerkaufStand` verlangt die geprüfte Vorlage; Ampel-Hinweis `vorlage`, Zentrale-Übersicht zeigt, was fehlt (26.5, 26.10, 29.4) |
| 6 | sollte | behoben | Zwischenstand übernommen und bestätigt (28.15) |
| 7 | sollte | behoben | Zwischenstand übernommen und bestätigt (30, Teil 5) |
| 8 | sollte | behoben | Frage ohne Anmeldung nur noch als `system` mit Vorsatz „Absender nicht bestätigt“; Datenschutztext angepasst (27.12) |
| 9 | sollte | behoben | Dateien eines verworfenen Entwurfs sofort weg, stornierte ohne Instanz nach 30 Tagen (27.7, 27.10) |
| 10 | sollte | behoben | Wechsel nach unten wirkt zum Periodenende (`abo.wechsel`), Stripe-Preis sofort ohne Ausgleich; Kundenkonto und Zentrale zeigen „wirkt ab“ (26.6, 27.9, 27.10, 30.W1, 30.W3) |
| 11 | kann | offen | bewusst verschoben (Wochenlimit) |
| 12 | kann | behoben | Fußhinweis 13 px (25.1) |
| 13 | kann | offen | bewusst verschoben (Wochenlimit) |
| 14 | kann | behoben | „Rückruf anfordern“ nur noch einmal (30, Teil 1) |
| 15 | kann | offen | bewusst verschoben (Wochenlimit) |
| 16 | kann | behoben | Testanfrage nach dem Livegang nicht mehr im Dashboard (28.14, 30 Teil 4) |
| 17 | kann | teilweise | Server nimmt `wunsch.firma.mailImpressum` (26.2, 26.5); das Formularfeld fehlt noch |
| 18 | kann | behoben | Schnipsel ist ein Knopf „Fenster planen“ in der Firmenfarbe, in der Live-Mail und im Kundenkonto (26.5) |
| 19 | kann | behoben | Webhook vermerkt erst nach der Verarbeitung (24.5) |
| 20 | kann | behoben | `/404` und `/404/` in `run_worker_first` (23.3, 23.13) |
| 21 | kann | behoben | `partnerAufraeumen`: Partner, Nachrichten, Bestellungen nach 3 Jahren ab Jahresende (27.10) |
| 22 | kann | behoben | „Abo neu starten“ nur in live oder pausiert (26.5) |

## Die Befunde im Wortlaut

## 1. [muss] server · Sicherheit, Geld, Daten

**Problem:** instanzDatenLoeschen löscht die Supabase-Anmeldung eines Dashboard-Zugangs auch dann, wenn dieselbe Anmeldung ein Hauseigentümer-Konto mit gesicherten Aufmaßen ist. Damit verlieren Altbestand-Daten (B2C) ihren Besitzer und werden gelöscht. Der Fall ist selten, der Weg läuft aber automatisch: 30 Tage nach jedem Vertragsende.

**Beleg:** functions/instanz/verwalten.js:299: `genutzt` prüft nur betriebNachAuth, partnerNachAuth und andere Instanzen, nicht eigeneVonNutzer. Danach folgt anmeldungLoeschen (auth.js:87). schema.sql:157: eigene.nutzer hat `on delete set null`. zentrale.js:751: Der tägliche Lauf löscht eigene Aufmaße mit `!e.nutzer` (eigenesWeg). Die Zentrale schützt genau diesen Fall an zwei Stellen (zentrale.js:651 und 737, eigeneVonNutzer). Aufgerufen wird es von bestellungenLauf (bestellung.js:616 ff.) und von der Zentrale beim Löschen.

**Lösung:** In instanzDatenLoeschen zusätzlich `sp.eigeneVonNutzer && (await sp.eigeneVonNutzer(z.uid)).filter(lebt).length` als „genutzt“ werten, wie in zentrale.js:651/737. Am besten die Prüfung als gemeinsame Funktion „Anmeldung wird noch gebraucht“ nutzen.

## 2. [sollte] server · Produkt und Erlebnis

**Problem:** Signature schickt die Mails an den Betrieb (Anfrage, Anmeldecode, Bestätigungen) ohne MAIL_ABSENDER_NEUTRAL aus dem eeziframes-Postfach. Die Paketbedingungen sagen aber für Signature „Absender der E-Mails: neutrales Postfach“, und die Paketkarte verspricht „Ohne Hinweis auf eeziframes, auch im PDF und in den E-Mails“. Im Bauplan §4 ist die neutrale Adresse nur „optional“, nichts sperrt den Verkauf oder das Live-Schalten.

**Beleg:** functions/api/eingang.js:75 (adresse = m.absender==='neutral' ? k.instanzen.neutral || k.instanzen.absender : …); web/konfigurator-bedingungen/index.html:41, Tabellenzeile „Absender der E-Mails … neutrales Postfach“; functions/pakete-seite.js:74; Bildschirmfoto /tmp/claude-0/-home-user-fenstero/6308e9cd-6489-590e-a8f0-f7de4414f68a/scratchpad/instanzen/morgen/30-10-mail-signature-1280.png: „Von: Fensterwerk Specht · Fensterplaner <kontakt@eeziframes.invalid>“; paketVerkaufStand (functions/api/recht.js:66-76) und die Live-Ampel prüfen MAIL_ABSENDER_NEUTRAL nicht.

**Lösung:** Bei Signature die neutrale Absenderadresse zur Live-Bedingung machen (Ampel in zentrale-instanzen.js) und in der Zentrale-Übersicht unter „Konfigurator-Pakete“ anzeigen. Alternativ die Texte in Paketbedingungen und Verkaufsseite auf „Absender ohne eeziframes, sobald eingerichtet“ abschwächen.

## 3. [sollte] server · Produkt und Erlebnis

**Problem:** Plus und Signature versprechen auf der Verkaufsseite „Startseite in Suchmaschinen“. Jede neue Instanz startet aber mit indexierung=false und bleibt noindex, bis jemand in der Zentrale unter „Betrieb“ den Schalter setzt. Dieser Schritt fehlt in der Live-Ampel, in „Einrichtung je Kunde“ (docs/INSTANZEN.md) und im Bauplan §4. Ohne ihn bekommt der Kunde die zugesagte Leistung nicht.

**Beleg:** functions/api/speicher.js:342 (indexierung: false); supabase/schema.sql:262 (default false); functions/instanz/seiten.js:46 (indexiert verlangt inst.indexierung); grep findet kein „indexierung = true“ im Code; Bildschirmfoto 30-05-zentrale-instanz-plus-1280.png: „Suchmaschinen: gesperrt (Schalter unter Betrieb)“; functions/pakete-seite.js:75; docs/INSTANZEN.md:292-301 ohne den Schritt.

**Lösung:** Beim Live-Schalten für m.indexierung==='start' indexierung=true setzen (der Schalter bleibt zum Abschalten). Alternativ als Punkt in die Live-Ampel und in die Checkliste „Einrichtung je Kunde“ aufnehmen.

## 4. [sollte] server · Produkt und Erlebnis

**Problem:** Die Eingangszeit einer Anfrage steht im Aufmaßblatt-PDF, im Mailtext und im Signature-Dashboard in UTC, also 1 bis 2 Stunden falsch. Kurz vor Mitternacht ist auch das Datum falsch. Zentrale und Kundenkonto zeigen dieselben Ereignisse in deutscher Zeit.

**Beleg:** web/assets/modell.js:1118 stamp() nutzt getHours() und läuft auf dem Server, der Worker rechnet in UTC (konten.js:455/464 importCode); functions/api/blatt-server.js:117 übernimmt l.log.eingegangen. Bildschirmfotos aus demselben Lauf: 30-09-pdf-*-seite1.png „eingegangen 23.10., 04:07 · 23. Oktober 2026“, 30-10-mail-*.png „Eingegangen: 23.10., 04:07“, 30-11-signature-dashboard-eingereicht-1280.png „23.10., 04:07“; 30-04-kundenkonto-live-signature-1280.png „23. Okt., 06:07“ und die Zentrale „06:06“. Im Altbestand gilt dasselbe, weil auch dort der Server importiert.

**Lösung:** Im Instanz-Zweig (POST /api/aufmass, eingang.js, blatt-server.js) die Eingangszeit aus eingegangen_at mit timeZone 'Europe/Berlin' formatieren und l.log.eingegangen damit überschreiben. Ob stamp() auch für den Altbestand korrigiert wird, entscheidet der Inhaber; das würde sichtbares Altverhalten ändern.

## 5. [sollte] server · Produkt und Erlebnis

**Problem:** Die ungeprüfte Rechtsvorlage der Instanzen hält nichts auf. Laut Bauplan §4 bleibt die Paket-Kasse zu, bis auch die Vorlagen für Impressum und Datenschutz der Instanzen anwaltlich geprüft sind. paketVerkaufStand prüft aber nur die eigenen Seiten von eeziframes.com. Mit PAKETE_OFFEN=1 und bereinigten Paketbedingungen gehen Instanzen live, und unter Impressum und Datenschutz jedes Betriebs steht öffentlich „Vorlage vom …, anwaltliche Prüfung ausstehend“.

**Beleg:** functions/instanz/recht.js:24 (VORLAGE geprueft:false) und :79 (Satz immer sichtbar); functions/api/recht.js:64-76 (PAKET_SEITEN nur /konfigurator-bedingungen/, /impressum/, /datenschutz/ der Hauptdomain, VORLAGE nicht geprüft); grep: VORLAGE wird außer in recht.js nur in scripts/pruefen-instanzen/29.mjs gelesen.

**Lösung:** In paketVerkaufStand ergänzen: if (!VORLAGE.geprueft) fehlt.push('Vorlage Impressum/Datenschutz der Instanzen anwaltlich prüfen'). Dasselbe in der Zentrale-Übersicht und als Punkt der Live-Ampel zeigen.

## 6. [sollte] oberflaeche · Produkt und Erlebnis

**Problem:** Signature-Dashboard unter „Betrieb → Ihre Einladungsseite“: Die Karte und die Telefonvorschau „So sieht Ihr Kunde die Seite“ zeigen die Initiale in Standard-Blau (#0071e3) statt in der Firmenfarbe. Links daneben („Ihre Initiale“), in der Seitenleiste und auf der echten Kundenseite steht die Firmenfarbe. Die Vorschau zeigt also nicht, was der Kunde sieht.

**Beleg:** web/assets/portal.js:1167 einAuftritt → Einladung.auftritt(a, INST.farbe); web/assets/einladung.js:50 und :86 farbe() lässt nur die 6 FARBEN zu und fällt sonst auf FARBEN[0] zurück. Die App nimmt dagegen hexFarbe (web/assets/app.js:2211). Messung auf signature.localhost (Farbe #f0c36a): Zeichen „klein ini“ rgb(240,195,106), Vorschau „gross ini“ rgb(0,113,227). Bildschirmfotos /tmp/claude-0/-home-user-fenstero/6308e9cd-6489-590e-a8f0-f7de4414f68a/scratchpad/p8976/b4/dash-einladung-gestalten.png und /tmp/claude-0/-home-user-fenstero/6308e9cd-6489-590e-a8f0-f7de4414f68a/scratchpad/p8976/b3/dash-desktop-Betrieb.png.

**Lösung:** Im INST-Zweig von einAuftritt danach p.col = Einladung.hexFarbe(INST.farbe) || p.col setzen, wie instProfil in app.js. Prüfung 28.15 um die Farbe der Vorschau-Initiale ergänzen.

## 7. [sollte] oberflaeche · Produkt und Erlebnis

**Problem:** Kundenkonto bei „Zahlung offen“ (Kulanzfrist läuft): Die Hauptkarte meldet weiter „Ihr Konfigurator ist live“ mit dem Cream-Knopf „Konfigurator öffnen“. Die eigentlich nötige Aktion steht nur als kleiner Textlink „Offene Rechnung bezahlen“ in der Abo-Karte. Bauplan D.10 verlangt die nächste Aktion als Hauptknopf.

**Beleg:** web/assets/partner.js:460 (case 'live' ohne Rücksicht auf abo_status) und :474 (Textlink p-link); Bildschirmfoto 30-04-kundenkonto-zahlung-offen-plus-1280.png.

**Lösung:** In hauptaktion() für status 'live' und abo_status 'zahlung_offen' den Text „Zahlung offen, bitte bis <kulanz_bis> bezahlen, sonst pausieren wir“ und als Hauptknopf „Offene Rechnung bezahlen“ (a.offeneRechnung) setzen. „Konfigurator öffnen“ wird dann ein Ring-Knopf.

## 8. [sollte] server · Sicherheit, Geld, Daten

**Problem:** POST /api/partner/frage legt ohne Anmeldung eine Nachricht mit `von: 'partner'` im Kundenkonto jedes Partners ab, dessen E-Mail-Adresse man kennt. Im Kundenkonto steht sie als „Sie“, in der Zentrale als Frage des Partners. Ein Angreifer kann sich so als Partner ausgeben, etwa mit „bitte neue Eingangsadresse x@… eintragen“ oder „Abo kündigen“. Die Bestätigung einer neuen Adresse schützt dann nicht, weil der Angreifer sie selbst bestätigt.

**Beleg:** Angriff auf Port 8975, ohne Keks: `POST /api/partner/frage {name:'Angreifer', mail:'b@partner-b.de', text:'Bitte kündigen Sie mein Abo …'}` gibt 200 zurück. Danach liefert `GET /api/partner/nachrichten` mit der Sitzung von B: [["partner","frage","Bitte kündigen Sie mein Abo sofort und e…"]]. Code: partner.js:212 (`nachrichtAnlegen({ partner: p.id, von: 'partner', art: 'frage' …})` allein über partnerNachMail).

**Lösung:** Fragen ohne Anmeldung nie als `von: 'partner'` in ein Konto schreiben. Entweder gar nicht ablegen (nur Mail an MAIL_KONTAKT), oder mit eigener Herkunft (z. B. `von: 'system'`, Vermerk „unbestätigt, über das Formular ohne Anmeldung“) und in Zentrale und Kundenkonto deutlich so kennzeichnen. Den Satz in der Datenschutzerklärung entsprechend anpassen.

## 9. [sollte] server · Sicherheit, Geld, Daten

**Problem:** Hochgeladene Dateien einer verworfenen oder stornierten Bestellung ohne Instanz (Logo, Unternehmensfotos, Foto des Ansprechpartners) werden nie gelöscht. Die Datenschutzerklärung verspricht für unbezahlte Bestellungen die Löschung „samt ihren Dateien 30 Tage nach der letzten Änderung“ (bestellEntwurfTage). Auch nach einem Storno mit Erstattung bleiben die Dateien liegen.

**Beleg:** Versuch auf Port 8975: zwei Bestellungen mit je einem Upload (art ap) angelegt, eine über /stornieren verworfen. Danach Uhr +40 Tage (/__jetzt) und Tageslauf (/__scheduled 17 4 * * *). Ergebnis: Die offene Bestellung ist gelöscht (entwuerfe:1). In der Ablage `bestellungen` liegt weiter `partner/…/949f…/de883ka10m.png` der stornierten Bestellung (B-2026-0001, storniert, 1 Datei). Code: bestellung.js:634 löscht nur `status === 'offen'`, bestellung.js:616 nur `beendet` oder `storniert && b.instanz`.

**Lösung:** In bestellungenLauf auch `storniert` ohne Instanz erfassen: nach bestellEntwurfTage bzw. loeschenNachEndeTage ab ende_am die Dateien löschen (dateienLoeschen, z.dateien = [], Vermerk `geloescht`). Beim Verwerfen eines unbezahlten Entwurfs die Dateien am besten sofort löschen.

## 10. [sollte] server · Sicherheit, Geld, Daten

**Problem:** Ein Paketwechsel nach unten wirkt sofort: instanzen.paket wechselt, und bei Signature schließt das Dashboard sofort. Der Stripe-Preis wechselt sofort ohne Ausgleich. Der Partner hat den laufenden Monat zum höheren Preis bezahlt, verliert die Leistung aber mitten im Monat. Der Plan sagt „nach unten zum Periodenende“ (§3 D.8, Vorschlag F2: „Signature-Dashboard schließt dann“).

**Beleg:** bestellung.js:485 (Kommentar „Nach unten ebenfalls sofort …“), bestellung.js:503 (`if (b.instanz) await paketSetzen(…)` ohne Unterscheidung oben/unten), stripe.js:458 (`proration_behavior: o.oben ? 'create_prorations' : 'none'`, sofort). dashboard.js kontoVon antwortet danach sofort mit 403 „Ihr Paket enthält kein Dashboard“.

**Lösung:** Nach unten nur vormerken (abo.paketAb = Periodenende, Stripe über subscription schedule oder Preiswechsel zum Periodenende). paketSetzen auf der Instanz erst im Tageslauf bzw. bei invoice.paid der neuen Periode. Bis dahin bleibt das alte Paket. In der Zentrale „wirkt ab …“ anzeigen.

## 11. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Ohne PAKETE_OFFEN im Live-Modus führt „Kundenkonto → Paket wählen und bestellen“ durch alle Schritte: Anmeldung per Code, Firma, Impressum, Domains, Uploads. Erst im letzten Schritt erscheint „Bestellung bald möglich“ mit „Unverbindlich anfragen“. Die Regel ist technisch erfüllt, der Interessent tippt aber alles umsonst.

**Beleg:** web/assets/partner.js:179/193 (Schritt 1 zeigt nur „Vorläufige Preise“), :294 und :300 (der Hinweis „bald“ und der Knopf „Unverbindlich anfragen“ kommen erst bei s.k==='pruefen'); /api/partner/stand liefert verkauf.kasse schon beim Laden.

**Lösung:** Bei stand.verkauf.kasse===false schon auf /partner/ und in Schritt 1 den Kasten „Bestellung bald möglich, gern unverbindlich anfragen“ mit Link auf /fuer-fensterbauer/#frage zeigen.

## 12. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Der Hinweis „Konfigurator von eeziframes“ im Fuß von Plus-Instanzen ist 12 px groß. Der Styleguide sagt: nichts unter 13 px.

**Beleg:** web/assets/einladung.css:145 (.ein-kz.dezent { font-size: 12px }); Messung am Telefon auf plus.localhost: P.ein-kz 12px auf Start, Begriffe und KI-Einwilligung.

**Lösung:** font-size: 13px. „Dezent“ entsteht schon durch die Farbe --muted und die Stellung im Fuß.

## 13. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Der erste Bildschirm der Verkaufsseite hat zwei gleiche Cream-Pillen „Pakete ansehen“, im Kopf und im Startbild. GESTALTUNG.md sagt für diese Seite ausdrücklich „Eine Cream-Pille je Bildschirm: oben „Pakete ansehen““.

**Beleg:** web/fuer-fensterbauer/index.html:48 (rg-nav, btn primary small) und :58 (rg-cta, btn primary); Messung am Telefon und bei 1280: „0: Pakete ansehen | Pakete ansehen“; Bildschirmfoto 30-01-verkaufsseite-telefon.png, oben.

**Lösung:** Im Kopf dieser Seite die Pille als Ring-Knopf oder mit anderem Ziel (z. B. „Kundenkonto“) zeigen, damit nur die Pille im Startbild Cream ist.

## 14. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Kundenkonto im Stand „Bezahlt“: „Rückruf anfordern“ steht doppelt, einmal als Hauptknopf (Cream) und einmal in der Rückruf-Karte.

**Beleg:** Bildschirmfoto 30-04-kundenkonto-bezahlt-plus-1280.png; eigener Lauf: „Rückruf-Knöpfe: 2“; web/assets/partner.js hauptaktion case 'bezahlt'.

**Lösung:** Den Knopf in der Rückruf-Karte ausblenden, solange die Hauptaktion schon „Rückruf anfordern“ ist.

## 15. [kann] server · Produkt und Erlebnis

**Problem:** Beim Rückruf lassen sich auch heutige Zeitfenster wählen, die schon vorbei sind (z. B. Freitag 17:30 → „heute 08–10 Uhr“), und gesetzliche Feiertage gelten als Werktage.

**Beleg:** functions/api/partner.js:156-160 werktage() beginnt mit dem heutigen Datum und beachtet weder Uhrzeit noch Feiertage; :535-537 prüft nur Tag und Fenster; /api/partner/stand liefert „werktage“ ab 2026-10-23, alle Fenster 08–18.

**Lösung:** Für heute nur Fenster anbieten und annehmen, die mindestens eine Stunde nach jetzt beginnen (Europe/Berlin). Bundesweite Feiertage herausnehmen.

## 16. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Nach dem Livegang steht die Testanfrage aus der Einrichtung im Signature-Dashboard des Kunden als Projekt „Testanfrage · Eingereicht“ und zählt bei „Eingereicht“ und im Projekte-Zähler mit (bis zu einem Tag).

**Beleg:** Bildschirmfoto 30-11-signature-dashboard-eingereicht-1280.png: Kachel „Eingereicht 3“ und Navigation „Projekte 3“, eine davon ist „Testanfrage · Test“.

**Lösung:** art 'test' in dashboardSicht nicht zählen oder ganz ausblenden, sobald die Instanz aktiv ist.

## 17. [kann] server · Produkt und Erlebnis

**Problem:** Als E-Mail im Impressum der Instanz steht ungefragt die Anmeldeadresse des Partners. Der Formularschritt „Angaben für das Impressum“ zeigt nicht, welche Adresse veröffentlicht wird; das kann eine persönliche Adresse sein.

**Beleg:** functions/api/zentrale-bestellungen.js:74 (recht.mail = p.mail); Bildschirmfoto 30-03-bestellformular-plus-firma-1280.png: Impressumsblock ohne E-Mail-Feld.

**Lösung:** Im Bestellformular ein Feld „E-Mail für das Impressum“ ergänzen, vorbelegt mit der Anmeldeadresse, oder den Satz „Im Impressum steht <Adresse>; ändern über …“ einfügen.

## 18. [kann] oberflaeche · Produkt und Erlebnis

**Problem:** Die Verkaufsseite verspricht zum Livegang „einen Knopf „Fenster planen“ für Ihre Website“ (Ablauf Schritt 6 und FAQ). Das Kundenkonto liefert aber einen ungestalteten Textlink „Fenster online planen und anfragen“, der auf fremden Websites wie normaler Fließtext aussieht.

**Beleg:** Bildschirmfoto 30-04-kundenkonto-live-signature-1280.png, Karte „Auf Ihrer Website verlinken“: <a href="https://…/" rel="noopener">Fenster online planen und anfragen</a>; FAQ „Brauche ich eine Website?“ in web/fuer-fensterbauer/index.html.

**Lösung:** Den Schnipsel mit Inline-Stil als Knopf ausliefern (Firmenfarbe, Rundung, 44 px hoch, Text „Fenster planen“) oder die Texte der Verkaufsseite auf „Link“ ändern.

## 19. [kann] server · Sicherheit, Geld, Daten

**Problem:** Der Resend-Webhook vermerkt das Ereignis als verarbeitet, bevor er es verarbeitet. Scheitert danach das Schreiben (z. B. eine kurze Störung der Datenbank), meldet der Server 500. Die Wiederholung von Resend endet dann als „doppelt“, und Zustellung, Bounce oder Beschwerde gehen verloren. Folgen: Die Anfrage gilt als nie zugestellt (Löschung erst nach 60 statt 30 Tagen, falscher Hinweis), oder die Ampel „Testanfrage zugestellt“ bleibt rot.

**Beleg:** eingang.js, EINGANG 'POST /api/post/webhook': `if (!(await ctx.sp.ereignisNeu('svix:' + id…))) return { ok: true, doppelt: true };` steht vor anfrageAendern. Der Stripe-Webhook macht es richtig herum: zahlung.js `ereignisNeu` erst nach der Verarbeitung, siehe Kommentar dort.

**Lösung:** Wie beim Stripe-Webhook: zuerst `ereignisBekannt` prüfen, verarbeiten und erst danach `ereignisNeu` schreiben. Die einzelnen Schritte sind ohnehin idempotent (Abgleich über `v.id === mailId`).

## 20. [kann] server · Sicherheit, Geld, Daten

**Problem:** Im Netz liefert Cloudflare `/404` auf jeder Instanz-Domain direkt aus den statischen Dateien aus, also die eeziframes-Fehlerseite mit Status 200 („Seite nicht gefunden · eeziframes“), auch bei Signature. In run_worker_first steht nur `/404.html`, nicht `/404`, und html_handling liefert 404.html unter /404 aus. Der Testserver leitet alles durch den Worker und zeigt das deshalb nicht.

**Beleg:** wrangler.jsonc run_worker_first: "/404.html", aber kein "/404". worker.js datei(): Der Kommentar „Cloudflare liefert sie unter /404“ bestätigt den Pfad. web/404.html: `<title>Seite nicht gefunden · eeziframes</title>`. Bauplan E23/K2.5: keine eeziframes-Fehlerseite auf Betriebs-Domains. Ähnlich, aber harmlos: `/f39851a897e004d2371f5b99367aa8c2.txt` (IndexNow-Schlüssel).

**Lösung:** "/404" (und gegebenenfalls "/404/") in run_worker_first aufnehmen. Dann liefert seiten.js auf Instanz-Hosts die neutrale 404-Seite. Auf der Hauptdomain liefert worker.js die Datei weiter selbst aus, wie bisher.

## 21. [kann] server · Sicherheit, Geld, Daten

**Problem:** Die Löschfrist `nachrichtenJahre` (3 Jahre nach Vertragsende) ist nirgends umgesetzt. partner_nachrichten, Rückrufwünsche und Partnerdaten bleiben unbegrenzt liegen. Die Datenschutzerklärung von eeziframes.com verspricht die Aufbewahrung nur „bis zum Ende des 3. Jahres nach dem Vertragsende“.

**Beleg:** grep: `nachrichtenJahre` und `belegeJahre` kommen nur in web/assets/instanzregeln.js:61 vor, in keinem Lauf. web/datenschutz/index.html:82 „Angaben zu Vertrag und Bestellung und Ihre Nachrichten bewahren wir bis zum Ende des 3. Jahres nach dem Vertragsende auf“.

**Lösung:** Im Tageslauf (bestellungenLauf oder aufraeumen) Nachrichten und Partnerzeilen ohne laufende Bestellung nach FRISTEN.nachrichtenJahre (Jahresende nach ende_am) löschen bzw. anonymisieren. Rechnungsbelege liegen bei Stripe.

## 22. [kann] server · Sicherheit, Geld, Daten

**Problem:** „Abo neu starten“ (aboSteuern 'neu') startet das Monatsabo auch im Bestellstatus „freigabe“, also vor dem Live-Schalten. Die Oberfläche bietet den Knopf nur bei „pausiert“ an, die Zentrale-API erlaubt es aber. Der Plan sagt: Abo nur beim Live-Schalten.

**Beleg:** bestellung.js:523 `if (aktion === 'neu') return aboStarten(ctx, id, { neu: true });`. bestellung.js:457 lässt `['freigabe', 'live', 'pausiert']` zu. zentrale-bestellungen.js 'POST …/abo' nimmt 'neu' ohne Statusprüfung an.

**Lösung:** In aboSteuern 'neu' nur bei Status live oder pausiert zulassen (sonst 409). aboStarten aus „freigabe“ nur über uebergang(…, 'live') aufrufen.

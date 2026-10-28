# Zentrale des Inhabers

Die Zentrale unter `https://eeziframes.com/zentrale/` ist dein Eingang für alle Bestellungen der Landingpages mit Konfigurator: wer was bestellt hat, was als Nächstes zu tun ist, und je Auftrag alles, was du zum Bauen der Seite brauchst. Neu gebaut am 27.10.2026 in der Design-DNA; die frühere Zentrale (Betriebe, Statistik, Anzeigen, Instanzen, alte Paket-Bestellungen) ist als Oberfläche ersetzt.

Code: `web/zentrale/index.html`, `web/assets/inhaber.js`, Stil `web/assets/auftrag.css`, Server `functions/auftrag/index.js` (Routen `/api/inhaber/…`). Ablauf und Stände der Aufträge: [BESTELLUNG.md](BESTELLUNG.md). Geprüft in `scripts/pruefen-instanzen/26.mjs`.

## Einrichten

1. **Passwort:** Cloudflare → Workers & Pages → **fenstero** → Settings → Variables and Secrets → **Add**, Typ **Secret**, Name `ZENTRALE_PASSWORT`, Wert mindestens 12 Zeichen (besser 20 und mehr, aus dem Passwort-Manager). **Deploy**.
2. **Sitzungen:** Secret `SITZUNG_GEHEIMNIS` (mindestens 32 Zeichen, nie ändern); damit unterschreibt der Server die Sitzung der Zentrale (`__Host-inhaber`, 8 Stunden) und die der Kunden.
3. **Datenbank:** `supabase/schema.sql` im SQL-Editor von Supabase komplett ausführen (Abschnitt „Aufträge“ legt `kunden`, `anmeldecodes`, `auftraege`, `auftrag_nachrichten` an; erneutes Ausführen schadet nicht).
4. **Mails an dich:** `MAIL_API_KEY` (Resend) und `MAIL_KONTAKT` (deine Adresse); dorthin gehen neue Bestellungen, Anfragen, Nachrichten und Fragen vom Formular.
5. **Zweiter Faktor (empfohlen):** einen Schlüssel erzeugen, z. B. im Terminal
   `node -e "const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';console.log(Array.from(require('crypto').randomBytes(32)).map(b=>a[b%32]).join(''))"`,
   in der Authenticator-App als Schlüssel von Hand eintragen (zeitbasiert, 6 Ziffern, 30 Sekunden) und bei Cloudflare als Secret `ZENTRALE_2FA` speichern. Danach fragt die Anmeldung zusätzlich den Code.

## Was sie kann

| Bereich | Inhalt |
|---|---|
| **Eingang** | eine große Zahl „Aufträge warten auf Sie“, dazu live und Monatsumsatz der laufenden Abos (netto, aus den echten Aufträgen); Filter Zu tun, In Arbeit, Vorschau, Live, Entwürfe, Alle; je Zeile Name, Paket, Nummer, Ort, Adresse, nächster Schritt, Stand und Hinweise (geändert, neue Nachrichten, Paketwechsel, freigegeben); darunter der **Stand der Paket-Kasse**: „Kasse offen“ mit Modus (Stripe-Testmodus, echtes Geld, Attrappe) oder „Kasse zu“ mit den genauen Gründen (z. B. `PAKETE_OFFEN` fehlt, Mailversand, `MWST`, Rechtstexte), solange Bestellungen als unverbindliche Anfrage enden |
| **Auftrag** | Vorschau der Seite des Kunden in der Bühne; der nächste Schritt als Pille (Seite beginnen, Vorschau bereitstellen, Frist zur Freigabe setzen, Live schalten, wieder live schalten) mit Satz an den Kunden und Mail; „Frist zur Freigabe setzen“ schickt bei einer Vorschau ohne Antwort die Mail mit 14 Tagen Frist und dem Hinweis auf die Abnahme (Paketbedingungen § 5 Abs. 5, § 640 Abs. 2 BGB), danach heißt die Pille „Live schalten (Frist abgelaufen)“; „Live schalten“ nur mit Konfigurator unter der Adresse im Paket des Auftrags (sonst Fehler am Feld, kein Abo, keine Mail); bei einer unverbindlichen Anfrage nennt der Hinweis oben, warum die Kasse zu war bzw. ist; ist sie offen, lädt die Pille „Zur Zahlung einladen“ den Kunden per Mail mit Link zur Bestellung ein; Hinweise oben (Änderungen, Änderungswunsch, Freigabe, Paketwechsel, Anfrage bei geschlossener Kasse) |
| **Prompt** | alle Angaben als Auftrag für Claude: Vorlage des Pakets (`docs/profis/<paket>-vorschau/`, Beispiel Fensterbau Brandt), Betrieb, Ansprechperson, Adresse und Domain-Art, Anruf, Website, Weg, Farben und Farbstufe, Texte, Dateien (da oder fehlt), Team, Empfänger, Hinweise, Impressum; „Prompt kopieren“ |
| **Material** | Logo, Porträt und die sechs Fotoplätze zum Herunterladen, weitere Dateien, Farben (zum Kopieren), Website, Texte, Hinweise des Kunden |
| **Betrieb, Adresse** | Impressum und Kontakt, Domain (neu oder vorhanden), weitere Wünsche, Empfänger der Anfragen, Dashboard-Team |
| **Nachrichten** | Verlauf mit dem Kunden, Antwort geht auch per Mail |
| **Interne Notiz** | nur für dich |
| **KI-Auswertungen** | verknüpfter Konfigurator (beim Live-Schalten über die Adresse, sonst hier von Hand), genutzt im Monat in Prozent, ob der Kunde weitere freigeschaltet hat, bisher weitere mit Betrag, Abrechnungen der Vormonate mit Stripe-Posten |
| **Zahlung und Abo, Kunde, Verlauf** | Einrichtung und Abo mit Stripe-Kennungen, Zustimmung mit Fassung und Zeitpunkt, Konto des Kunden, jeder Schritt mit Zeit und Urheber |
| **Weitere Schritte** | je Stand die erlaubten Übergänge: zurück in Arbeit, zurück in den Entwurf, pausieren, beenden (zum Monatsende oder sofort), stornieren (mit Erstattung) |

## Sicherheit

Anmeldung mit Passwort (und Code, falls `ZENTRALE_2FA` eingetragen), höchstens acht Versuche je 15 Minuten und Anschluss; Sitzung `__Host-inhaber` (nur HTTPS, für Skripte unlesbar, SameSite=Strict, 8 Stunden); POST nur mit eigener Herkunft; die Seite enthält keine Daten, alles kommt nach der Anmeldung. Nie in Suchmaschinen, nie zwischengespeichert. Passwort ändern beendet alle Sitzungen nicht von selbst; dafür `SITZUNG_GEHEIMNIS` nicht anfassen, sondern dich abmelden oder 8 Stunden warten.

## Was es in der neuen Zentrale (noch) nicht gibt

Die frühere Zentrale hatte daneben Bereiche für die App und den alten Betriebsbereich: Betriebe (Kennzahlen, Sperren, Löschen, Export), Käufe des Aufmaßblatts, die eigene Statistik ohne Cookies, Anzeigen-Links, Protokoll und die Einrichtung des zweiten Faktors per QR-Code, außerdem die Verwaltung der Konfigurator-Instanzen. Diese Oberflächen sind mit der alten Zentrale entfernt. Der Server-Teil für App und Betriebe (`functions/api/zentrale.js`, Routen `/api/zentrale/…`, Statistik, täglicher Aufräumlauf mit den Fristen der App) läuft unverändert weiter. Ob und wie Statistik, Anzeigen und Instanzen in die neue Zentrale kommen, entscheidest du; die Instanz beim Live-Schalten anzulegen ist der nächste Schritt ([BESTELLUNG.md](BESTELLUNG.md), „Offen“).

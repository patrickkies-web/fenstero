# Zentrale des Inhabers

Die Zentrale ist dein Verwaltungsbereich unter `https://eeziframes.com/zentrale/`: alle Betriebe mit ihren Zahlen, Sperren, Löschen, Datenexport, Käufe des Aufmaßblatts, eine eigene Statistik ohne Cookies und ein Protokoll jedes Eingriffs. Sie steht auf keiner Seite verlinkt, meldet sich bei Suchmaschinen immer mit `noindex` ab und zeigt ohne Anmeldung nichts außer dem Anmeldefeld.

Code: `web/zentrale/index.html`, `web/assets/zentrale.js`, `web/assets/zentrale.css` (Oberfläche), `functions/api/zentrale.js` (Server), `functions/api/statistik.js` (Statistik), Tabellen in `supabase/schema.sql`. Geprüft in `scripts/pruefen.mjs`, Abschnitt 13.

## Einrichten

1. **Passwort.** Cloudflare → Workers & Pages → **fenstero** → Settings → Variables and Secrets → **Add**: Typ **Secret**, Name `ZENTRALE_PASSWORT`, Wert ein langes Passwort (mindestens 12 Zeichen, besser 20 und mehr, am besten aus dem Passwort-Manager). **Deploy**. Ohne dieses Secret oder mit weniger als 12 Zeichen bleibt die Zentrale geschlossen.
2. **Datenbank-Tabellen.** Supabase → SQL Editor → New query: den ganzen Inhalt von `supabase/schema.sql` einfügen, **Run**. Die Datei lässt sich gefahrlos erneut ausführen; sie legt nur an, was fehlt (Tabellen `protokoll` und `statistik`, Funktion `eeziframes_zaehlen`). Ohne diesen Schritt funktioniert die Zentrale trotzdem, nur Protokoll und Statistik melden „noch nicht eingerichtet“.
3. **Anmelden.** `https://eeziframes.com/zentrale/` öffnen, Passwort eingeben.
4. **Zweiter Faktor (empfohlen, nötig für den Einblick in Daten der Endkunden).** In der Zentrale unter **Einstellungen → Zweiter Faktor einrichten**: Der Browser erzeugt einen Schlüssel und zeigt ihn als QR-Code. Mit einer Authenticator-App scannen (Passwörter-App von Apple, Google Authenticator, Microsoft Authenticator, 1Password …), den Code zur Probe eingeben, dann bei Cloudflare als Secret `ZENTRALE_2FA` eintragen und **Deploy**. Ab dann braucht die Anmeldung Passwort und Code.

Passwort ändern: `ZENTRALE_PASSWORT` bei Cloudflare ersetzen. Damit enden alle Sitzungen, auch auf anderen Geräten. Telefon verloren: `ZENTRALE_2FA` bei Cloudflare löschen (dann reicht wieder das Passwort) und neu einrichten.

## Was sie kann

| Bereich | Inhalt |
|---|---|
| Übersicht | Betriebe (neu, aktiv in 30 Tagen, gesperrt), Projekte und verschickte Links, eingegangene Aufmaße, Aufträge der Betriebe, monatliche Abo-Einnahmen, Umsatz mit Betrieben (bezahlt, noch nicht berechnet), verkaufte Aufmaßblätter, Besuche der Website; zwölf Wochen als Diagramme; letzte Vorgänge; Hinweise (zweiter Faktor fehlt, Statistik nicht eingerichtet, fehlgeschlagene Zahlungen, wartende Aufmaße, verwechselte Schlüssel) |
| Betriebe | Liste mit Suche (Name, E-Mail, PLZ, Telefon), Filtern (aktiv, mit Abo, ohne Zahlungsart, Aufmaß wartet, gesperrt, Doppelkonto-Verdacht) und Sortierung; als CSV für Excel |
| Ein Betrieb | Stammdaten, letzte Anmeldung, zuletzt aktiv, Tarif, Zahlungsart, Stripe-Kunde und Abo (mit Link ins Stripe-Dashboard), Kennzahlen (Projekte, verschickte und geöffnete Links, Aufmaße, Positionen, Fotos, Nachbesserungen, Angebote, Termine, Aufträge, Umsatz), der Weg vom Projekt zum Auftrag, Projekte, Buchungen, Rechnungen, interne Notiz, Eingriffe an diesem Konto |
| Eingriffe | Sperren (mit Begründung) und Entsperren · Nachricht ins Konto · kostenlose Projekte gutschreiben · Doppelkonto-Verdacht aufheben · Abo zum Monatsende kündigen oder sofort beenden · offene Buchungen jetzt abrechnen · Daten exportieren · Konto löschen |
| Käufe | Aufmaßblätter der Hauseigentümer mit E-Mail, Betrag, Stand; nicht abgeschlossene Kassen |
| Statistik | Besuche, Seitenaufrufe, Seiten, Einstiegsseiten, Herkunft (Suchmaschinen, KI-Assistenten, Netzwerke, Kampagnen über `?utm_source=…`, QR-Code des Aufmaßblatts), Geräte, Browser, Systeme, Länder, Bots und Linkvorschauen (etwa wenn ein Link in WhatsApp geteilt wird), Abrufe von `llms.txt` und `robots.txt`, Vorgänge (Kasse, Kauf, Aufmaß gesendet, Registrierung …) und drei Trichter; 7 Tage bis 1 Jahr |
| Protokoll | jede Anmeldung in der Zentrale (gekürzte IP, Browser) und jeder Eingriff, mit Filter |
| Einstellungen | Stand der Dienste (KI, Stripe Test oder Live, Webhook, Datenbank, Statistik, Protokoll, Suchmaschinen), Preise, zweiter Faktor, Passwort, Sammelrechnungen sofort, Anmeldungen ohne Betrieb, Links zu Cloudflare, Stripe und Supabase |

**Sperren.** Der Betrieb kommt nicht mehr in sein Konto, auch nicht über eine neue Anmeldung; er sieht dabei die Begründung und den Hinweis, dass er widersprechen kann. Seine Kundenlinks ruhen („Dieser Link ist zurzeit nicht aktiv“), ohne dass Kunden die Begründung sehen. Daten, Abo und Abrechnung bleiben. Entsperren stellt alles wieder her, der Betrieb bekommt eine Mitteilung.

**Löschen.** Nur mit dem eingetippten Namen des Betriebs. Ein laufendes Abo endet sofort, die Anmeldung bei Supabase und das Konto samt Projekten und Aufmaßen werden gelöscht. Im Protokoll bleibt ein Löschnachweis (Name, Stripe-Kunde, Rechnungsnummern, nicht berechneter Betrag), keine E-Mail-Adresse. Rechnungen bleiben bei Stripe. Will der Betrieb seine Daten haben: vorher **Daten exportieren** (JSON mit allem, auch der internen Notiz und den Eingriffen).

**Einblick in Daten der Endkunden.** Namen, Kontakte, Adressen und Aufmaße der Kunden eines Betriebs erscheinen nur als Projektnummer. **Kundendaten einblenden** geht nur mit zweitem Faktor und mit Anlass (etwa „Support-Anfrage des Betriebs vom …“); der Einblick steht samt Anlass im Protokoll und endet, sobald du den Betrieb verlässt.

## Sicherheit

- Passwort nur als Cloudflare-Secret, mindestens 12 Zeichen. Vergleich in gleichbleibender Zeit, nach einem Fehlversuch 0,4 Sekunden Pause, höchstens 5 Versuche je 15 Minuten und IP-Adresse (je Server-Instanz).
- Sitzung: Cookie `__Host-zentrale` (nur HTTPS, für Skripte unlesbar, nur von dieser Seite gesendet, 8 Stunden), unterschrieben mit einem Schlüssel aus Passwort, zweitem Faktor und `FREISCHALT_GEHEIMNIS`. Jede Anfrage braucht zusätzlich die Kopfzeile `x-zentrale: 1`, die eine fremde Seite nicht setzen kann; Formulare fremder Seiten kommen außerdem an der Herkunftsprüfung nicht vorbei.
- Zweiter Faktor nach RFC 6238 (TOTP, 6 Ziffern, 30 Sekunden), jeder Code nur einmal.
- Strenge Content-Security-Policy wie überall, `noindex`, `Cache-Control: no-store`, keine Daten in der HTML-Datei, nichts im Speicher des Browsers.
- Optional zusätzlich: Cloudflare Zero Trust → Access → Application für `eeziframes.com/zentrale*` und `eeziframes.com/api/zentrale/*` mit deiner E-Mail (kostenlos bis 50 Nutzer). Dann fragt Cloudflare schon vor der Zentrale nach einem Code per E-Mail.

## Statistik ohne Cookies

Gezählt wird auf dem Server, während er eine Seite ausliefert (`worker.js` → `seitenaufruf`), und bei Vorgängen, die ohnehin über den Server laufen. Gespeichert werden nur Tageszähler je Schlüssel (`aufruf:/app/`, `herkunft:Google`, `ereignis:kauf` …), keine IP-Adressen, keine Kennungen, keine einzelnen Aufrufe.

- **Besuch** heißt: ein Aufruf, der nicht von einer eigenen Seite kommt. Nur Besuche tragen Herkunft, Gerät, Browser, System und Land, damit jeder Besuch einmal zählt.
- **Nicht gezählt:** Aufrufe mit „Global Privacy Control“ oder „Do Not Track“, Vorab-Ladevorgänge, Aufrufe des Inhabers, solange er angemeldet ist, die Zentrale selbst, Fehlerseiten, Bots (nur als Familie, auch Headless-Browser).
- **Bewusst nicht gezählt: eindeutige Besucher.** Dafür bräuchte es eine Kennung, etwa einen Hash aus IP-Adresse und Browser. Der wäre, solange er existiert, ein personenbezogenes Pseudonym und brächte die Frage nach § 25 TDDDG zurück; die Aufsichtsbehörden haben solche Verfahren nicht gebilligt. Besuche (Einstiege) reichen für die Reichweite.
- Ein Messskript im Browser (Pixel, Beacon) gibt es nicht: Das wäre ein Zugriff auf das Endgerät und bräuchte eine Einwilligung.

## Rechtlicher Rahmen (Recherche vom 15.10.2026, keine Rechtsberatung)

| Frage | Ergebnis | Quelle |
|---|---|---|
| Braucht die Zählung auf dem Server eine Einwilligung (§ 25 TDDDG)? | Nein, solange nur verarbeitet wird, was der Browser ohnehin schickt, und nichts auf dem Gerät gespeichert oder per Skript ausgelesen wird. Ein Beacon oder Pixel wäre ein Zugriff. | [LfDI BW, FAQ Tracking, A 3.1](https://www.baden-wuerttemberg.datenschutz.de/wp-content/uploads/2022/03/FAQ-Tracking-online.pdf); [EDPB Leitlinien 2/2023, Rn. 33, 42–56](https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf); [DSK OH Digitale Dienste 1.2, Rn. 88–90](https://datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf) |
| Rechtsgrundlage der Statistik | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): eigene Auswertung, keine Dritten, nur Summen, keine Profile, keine Verknüpfung, Pfade ohne Abfrageteile | LfDI BW, FAQ Tracking; [EuGH C-621/22](https://collab.dpa.gr/wp-content/uploads/2024/10/CJEU_C%E2%80%91621.22-Koninklijke-Nederlandse-Lawn-Tennisbond_en.pdf) |
| Digital Omnibus (Ausnahme für Reichweitenmessung) | vorgeschlagen am 19.11.2025, im Oktober 2026 nicht beschlossen; die Zählung erfüllt die vorgeschlagenen Bedingungen schon | [EDPB-EDPS Joint Opinion 2/2026, Rn. 101–102](https://www.edpb.europa.eu/system/files/documents/2026-02/edpb_edps_jointopinion_202602_digitalomnibus_en.pdf) |
| Einblick in Konten der Betriebe | Vertrag, Abrechnung, Support (lit. b), Steuerpflichten (lit. c), Schutz vor Mehrfachkonten und Missbrauch (lit. f, ErwG 47 und 49); interne Notizen gehören zur Auskunft | DSGVO; [EuGH Nowak](https://www.dataprotection.ie/sites/default/files/uploads/2018-11/20_12_17%20CJEU%20Nowak%20Judgment.pdf) |
| Daten der Endkunden in Betriebskonten | Auftragsverarbeitung: Zugriff nur auf Weisung des Betriebs (etwa Support-Anfrage) oder bei gesetzlicher Pflicht, mit Vertraulichkeit und Protokoll; standardmäßig verborgen ist angemessen | Art. 28 Abs. 3, Art. 29, Art. 32 DSGVO; [EDPB Leitlinien 07/2020](https://www.edpb.europa.eu/system/files/2021-07/eppb_guidelines_202007_controllerprocessor_final_en.pdf) |
| Löschen und Aufbewahren | Kontodaten löschen; Buchungsbelege und Rechnungen 8 Jahre (seit 2025, § 147 AO, § 14b UStG), Bücher 10 Jahre; ein knapper Löschnachweis ist als Rechenschaft vertretbar | Art. 17 Abs. 3 lit. b DSGVO; [BEG IV, BGBl. 2024](https://www.ihk-muenchen.de/ihk/documents/Recht-Steuern/Steuerrecht/Neuer-Ordner/BEG-IV-BGBl-29102024.pdf); [EDPB, Bericht zum Recht auf Löschung 2025](https://www.edpb.europa.eu/system/files/2026-02/edpb_cef-report_2025_right-to-erasure_en.pdf) |
| Protokoll | berechtigtes Interesse an IT-Sicherheit und Rechenschaft; Fristen selbst festlegen (hier: Anmeldungen 90 Tage, Eingriffe 3 Jahre) | Art. 5 Abs. 2, Art. 6 Abs. 1 lit. f DSGVO; [SDM-Baustein 43 „Protokollieren“](https://www.datenschutz-mv.de/static/DS/Dateien/Datenschutzmodell/Bausteine/SDM-V3.1_Protokollieren_V2.0.pdf) |
| Sperren | Gründe, Vorwarnung, sofortige Sperre und Wiederfreigabe gehören in die Nutzungsbedingungen; bei Sperre wegen Verstoß eine Begründung mit Fakten, Klausel und Widerspruchsweg (DSA Art. 17) | §§ 307, 314, 320 BGB; [DSA Art. 17](https://www.springlex.eu/en/packages/dsa/dsa-regulation/article-17/) |

Umgesetzt ist das in der Datenschutzerklärung (Abschnitte 3, 4, 8 und 9) und hier im Code.

## Noch zu tun (nicht technisch)

- **Nutzungsbedingungen für Betriebe** fehlen noch (die Registrierung verlangt die Zustimmung). Hinein gehört unter anderem eine Klausel zur Sperre, etwa: „Wir dürfen den Zugang sperren, wenn Rechnungen trotz Mahnung offen bleiben, der Dienst missbräuchlich genutzt wird oder ein schwerer Verstoß gegen diese Bedingungen vorliegt. Wir teilen die Gründe mit; der Betrieb kann widersprechen. Während der Sperre bleiben Daten und Abrechnung erhalten; auf Wunsch geben wir die Daten heraus.“
- **Auftragsverarbeitungsvertrag (AVV) mit jedem Betrieb** für die Daten seiner Kunden, mit Regel zum Support-Zugriff (auf Anfrage des Betriebs, zur Störungsbehebung, bei gesetzlicher Pflicht) und zur Rückgabe oder Löschung am Vertragsende.
- Beides rechtlich prüfen lassen, zusammen mit Impressum und Datenschutzerklärung.

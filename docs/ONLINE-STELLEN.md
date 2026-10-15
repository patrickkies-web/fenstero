# Fensterino online stellen

**Fensterino.** Die Aufmaß-App für Fenster: kostenlos für Hauseigentümer, bezahlt von Fensterbauern je Projekt. Das Logo ist ein weißes Fenster auf Schwarz, dessen Flügel kurz kippt. Fensterino bringt Leute, die am Haus etwas vorhaben, mit den Betrieben aus ihrer Gegend zusammen. Später kommen weitere Gewerke dazu, zum Start geht es nur um Fenster.

Diese Anleitung bringt die Fensterino-Website ins Netz: erst unter einer kostenlosen Cloudflare-Adresse (`…workers.dev`), dann unter deiner eigenen Domain (`fensterino.com`).

## Zwei Stufen

**Stufe 1, jetzt: Pilot-Website.** Alles läuft im Browser, ohne Datenbank, ohne echte Zahlungen. Der Code für Stufe 2 ist schon an Bord und schaltet sich selbst ein, sobald die Schlüssel da sind.

| Was | Stand im Pilot | Mit Supabase und Stripe (Stufe 2) |
|---|---|---|
| App: Fotos, vier Maße, Ränder, 3-D-Modell, Wünsche, Glossar | funktioniert vollständig | gleich |
| Kundenlink vom Betrieb zur App | funktioniert | der Link wird beim Öffnen am Server geprüft, der Betrieb sieht „geöffnet“ und „misst“ |
| Aufmaß zum Betrieb | Kunde schickt den Aufmaß-Code (WhatsApp/E-Mail), der Betrieb fügt ihn ein | geht beim Absenden direkt an den Betrieb, kein Code-Umweg |
| Aufmaßblatt für Hauseigentümer ohne Link (7,99 € inkl. MwSt.) | Paywall ist da, Kauf ist ein gekennzeichneter **Testkauf** ohne Abbuchung | echte Zahlung über Stripe (Karte, PayPal, Apple/Google Pay), Rechnung per E-Mail |
| KI-Auswertung der Fotos | funktioniert mit Anthropic-Schlüssel (Schritt 5), sonst ohne KI | gleich |
| Bereich für Betriebe: Projekte, Einladungslisten, Nachbesserung | funktioniert im Browser mit Beispieldaten | echte Konten, Anmeldung per E-Mail-Code, alles auf dem Server |
| Abrechnung Betriebe (3 Projekte frei, dann 9 € · Abo 10 · Plus) | nur angezeigt, nichts wird berechnet, Zähler im Browser | Zählung und Sperre auf dem Server, Zahlungsart und Abos bei Stripe, Sammelrechnung alle zwei Wochen |
| Speicherort | nur im Browser des jeweiligen Geräts | Supabase (Frankfurt), das Aufmaß des Hauseigentümers bleibt weiter auf seinem Gerät |

**Stufe 2** brauchst du, sobald echte Betriebe mitmachen oder Geld fließen soll: Abschnitt „Stufe 2: Supabase und Stripe anschließen“ unten. Es sind nur Schlüssel einzutragen, kein Code.

## Was du brauchst

| | Kosten |
|---|---|
| GitHub-Repo `patrickkies-web/fenstero` | hast du schon, kostenlos (Umbenennen in `fensterino` ist möglich, siehe unten) |
| Cloudflare-Konto (Workers) | kostenlos |
| Eigene Domain | `fensterino.com`, liegt schon bei Cloudflare |
| Anthropic-API-Schlüssel für die KI | optional, nach Verbrauch; Ausgabenlimit setzen |
| Supabase-Projekt (Stufe 2) | kostenloser Tarif reicht für den Start |
| Stripe-Konto (Stufe 2) | keine Grundgebühr, Gebühr je Zahlung (Karte ca. 1,5 % + 0,25 €, SEPA 0,35 €) |

---

## Schritt 1: Cloudflare-Konto anlegen

[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) öffnen, mit E-Mail und Passwort registrieren und die E-Mail bestätigen. Der kostenlose Tarif reicht.

## Schritt 2: Worker mit GitHub verbinden

Cloudflare legt neue Projekte als **Worker** an. Das Repo bringt dafür alles mit: `wrangler.jsonc` sagt Cloudflare, dass die Website im Ordner `web/` liegt, und `worker.js` beantwortet alles unter `/api/…` (KI-Auswertung, Kauf des Aufmaßblatts, Konten der Betriebe, Eingang von Aufmaßen).

1. Im Cloudflare-Dashboard **Workers & Pages → Erstellen (Create) → Repository importieren (Import a repository)**, GitHub verbinden und das Repo `patrickkies-web/fenstero` wählen.
2. So einstellen (bei einem bestehenden Worker unter **Einstellungen → Build** prüfen):

   | Feld | Wert |
   |---|---|
   | Projektname | `fenstero`, genau wie `"name"` in `wrangler.jsonc` |
   | Build-Befehl (Build command) | leer |
   | Bereitstellungsbefehl (Deploy command) | `npx wrangler deploy` |
   | Befehl für andere Branches (Non-production branch deploy command) | `npx wrangler versions upload` |
   | Pfad (Path, unter „Erweitert“) | `/`, also das ganze Repo, **nicht** `web` |
   | Produktions-Branch | `main` |

3. **Erstellen und bereitstellen.** Nach etwa einer Minute ist die Seite unter `https://fenstero.<dein-konto>.workers.dev` erreichbar; die genaue Adresse steht oben im Worker.

Ab jetzt gilt: Jede Änderung in `main` geht automatisch online. Pull Requests bekommen eine Vorschau; ob der Build geklappt hat, zeigt Cloudflare direkt im Pull Request auf GitHub („Workers Builds: fenstero“).

Die Menünamen bei Cloudflare ändern sich ab und zu; die Werte in der Tabelle bleiben gleich.

> Ein Pages-Projekt geht weiterhin: **Workers & Pages → Erstellen → Pages → Mit Git verbinden**, Framework `None`, Build-Befehl leer, Ausgabeverzeichnis `web`. Pages nutzt `functions/api/ki.js` direkt und ignoriert `wrangler.jsonc`. Beides gleichzeitig mit derselben Domain geht nicht. Von „Direct Upload“ per Drag-and-drop rate ich ab: Die KI-Funktion läuft dort nicht, und jedes Update muss von Hand hochgeladen werden.

## Schritt 3: Testen

- `https://fensterino.com/` (oder die `…workers.dev`-Adresse) zeigt die Startseite mit dem Pilot-Hinweis oben.
- `https://fensterino.com/app/` zeigt die App.
- Kompletter Weg: Auf der Startseite **Demo ansehen** wählen (Fensterbau Brandt), ein Projekt öffnen, den Kundenlink kopieren und dir selbst per WhatsApp schicken. Auf dem Handy öffnen, ein Fenster messen (oder „Beispielfotos nutzen“), absenden, den Aufmaß-Code an dich zurückschicken. Im Portal **Code vom Kunden einfügen**: Das Aufmaß erscheint beim Projekt.
- `…/impressum/` und `…/datenschutz/` laden.

**Wichtig im Pilot:** Der Bereich für Betriebe speichert alles im Browser des Geräts. Kundenlinks anlegen und Codes einfügen deshalb immer im selben Browser auf demselben Gerät, zum Beispiel am Büro-PC.

## Schritt 4: Impressum und Datenschutz ausfüllen

Pflicht, bevor du die Adresse an Kunden oder Betriebe gibst. In `web/impressum/index.html` und `web/datenschutz/index.html` sind alle offenen Angaben orange markiert: Name oder Firma, Anschrift, E-Mail, Telefon, gegebenenfalls USt-IdNr. und Registereintrag, zuständige Datenschutzbehörde.

Zwei Wege:
- Du schickst mir die Angaben, ich trage sie ein.
- Oder du bearbeitest die Dateien direkt auf GitHub (Datei öffnen, Stift-Symbol, speichern). Cloudflare veröffentlicht danach automatisch.

Beide Texte sind Entwürfe für die Pilotphase. Lass sie vor dem öffentlichen Start rechtlich prüfen.

## Schritt 5: KI-Fotoauswertung einschalten (optional)

1. In der [Anthropic Console](https://console.anthropic.com) anmelden, unter **Billing** ein Zahlungsmittel oder Guthaben hinterlegen und unter **Limits** ein monatliches Ausgabenlimit setzen.
2. Unter **API Keys** einen Schlüssel anlegen, Name zum Beispiel `fensterino-pages`. Der Schlüssel wird nur einmal angezeigt. Er gehört **nicht** ins Repo und nicht in einen Chat.
3. Cloudflare: **Workers & Pages → fenstero → Einstellungen (Settings) → Variablen und Geheimnisse (Variables and Secrets) → Hinzufügen (Add)**: Typ **Secret**, Name `ANTHROPIC_API_KEY`, Wert einfügen, **Bereitstellen** (Deploy). Secrets bleiben bei allen weiteren Deployments erhalten.
4. Prüfen: `https://fensterino.com/api/ki` zeigt `{"bereit":true}`.

Was dann passiert: Vor dem ersten Foto fragt die App um Einwilligung. Erst danach geht eine verkleinerte Kopie des Fotos über `/api/ki` an Anthropic. Pro Foto sind es zwei Anfragen (Aufbau des Fensters, Fakten fürs Angebot). Die Aufträge an die KI liegen auf dem Server (`functions/api/ki.js`), der Zugang wertet also nur Fensterfotos aus. Eine eingebaute Bremse erlaubt 40 Anfragen je 10 Minuten und IP-Adresse.

Optional:
- Andere Modelle über die Variablen `KI_MODELL_GENAU` und `KI_MODELL_SCHNELL` (Standard: `claude-sonnet-5-5` und `claude-haiku-5-5`). Aktuelle Modellnamen: [docs.claude.com](https://docs.claude.com/en/docs/about-claude/models/overview).
- Zusätzlicher Schutz bei Cloudflare unter **Security → WAF → Rate limiting rules**: Pfad `/api/ki`, zum Beispiel 20 Anfragen in 10 Sekunden je IP, Aktion „Block“.

Datenschutz: Anthropic verarbeitet die Fotos dann in deinem Auftrag. Prüf, dass der Auftragsverarbeitungsvertrag (DPA) von Anthropic für dein Konto gilt; Abschnitt 4 der Datenschutzerklärung beschreibt die Verarbeitung.

## Schritt 6: Eigene Domain (wenn der Name feststeht)

Vorher den Namen prüfen: kurz ins Markenregister schauen ([DPMA](https://register.dpma.de), [EUIPO](https://euipo.europa.eu/eSearch/)), vor allem für Software, Vermittlung und Handwerksleistungen (Klassen 9, 35, 37 und 42). Eine eigene Marke „Fensterino“ samt Logo anzumelden schützt dich, wenn später weitere Gewerke dazukommen. Ein neuer Name ist technisch schnell gemacht: `python3 scripts/marke-umbenennen.py NeuerName`.

1. Die Domain muss bei Cloudflare liegen. Für `fensterino.com` ist das erledigt (Nameserver `may.ns.cloudflare.com` und `coen.ns.cloudflare.com`). Bei einer neuen Domain: **Domain hinzufügen** (Add a domain), kostenlosen Tarif wählen und die zwei genannten Nameserver beim Domain-Anbieter eintragen.
2. **Workers & Pages → fenstero → Einstellungen → Domains & Routen (Domains & Routes) → Hinzufügen (Add) → Benutzerdefinierte Domain (Custom domain)**: `fensterino.com` eintragen, hinzufügen. Dasselbe noch einmal für `www.fensterino.com`. Cloudflare legt DNS-Eintrag und Zertifikat selbst an; nach ein paar Minuten lädt die Seite.
3. Meldet Cloudflare, dass es für den Namen schon einen DNS-Eintrag gibt: unter **DNS → Einträge (Records)** den A-, AAAA- oder CNAME-Eintrag für genau diesen Namen löschen und Schritt 2 wiederholen. Eigene A-Einträge braucht die Website nicht.

So erkennst du, wo es hakt: **Fehler 522** heißt, die Domain zeigt noch nicht auf den Worker (Punkt 2 und 3 oben). **„Server nicht gefunden“** heißt, für diesen Namen gibt es gar keinen Eintrag (häufig bei `www.`). Eine **leere oder 404-Seite** heißt, der letzte Build in `main` hat die Website nicht gefunden (Einstellungen aus Schritt 2 prüfen).

Kundenlinks passen sich von selbst an: Sie zeigen immer auf die Adresse, unter der der Betriebsbereich geöffnet wurde.

**Repo umbenennen (optional, am besten vor Schritt 2):** GitHub → Repo `fenstero` → Settings → Repository name `fensterino`. GitHub leitet die alte Adresse weiter.

## Stufe 2: Supabase und Stripe anschließen

Alles für Stufe 2 steckt schon im Repo: `functions/api/` (Konten, Eingang, Kasse, Webhook, Sammelrechnung), `web/assets/modell.js` (die Abrechnungsregeln, im Browser und auf dem Server dieselben) und `supabase/schema.sql` (die Tabellen). Du legst zwei Konten an, trägst sieben Schlüssel bei Cloudflare ein, fertig. Die Website merkt über `/api/status`, was da ist: Der Pilot-Hinweis verschwindet, die App schickt Aufmaße direkt, die Kasse geht zu Stripe.

### A. Supabase (Datenbank und Anmeldung), etwa 20 Minuten

1. [supabase.com](https://supabase.com) → **New project**: Name `fensterino`, Region **Central EU (Frankfurt)**, ein starkes Datenbank-Passwort (in den Passwort-Manager, du brauchst es sonst nicht).
2. **SQL Editor → New query**: den Inhalt von `supabase/schema.sql` einfügen, **Run**. Das legt die Tabellen `betriebe`, `zahlungen`, `ereignisse` an und sperrt sie für Browser (nur der Server kommt mit dem Service-Schlüssel dran).
3. **Project Settings → API**: notiere **Project URL** (`https://….supabase.co`), den **anon**-Schlüssel und den **service_role**-Schlüssel. Beide sind lange Texte, die mit `eyJ` beginnen; Supabase zeigt sie inzwischen unter „Legacy API keys“. Der service_role-Schlüssel darf nur bei Cloudflare liegen, nie im Browser, nie im Repo, nie in einem Chat.
4. **Authentication → Sign In / Providers → Email**: eingeschaltet lassen, „Confirm email“ ist egal (wir nutzen den Code), **„Allow new users to sign up“ muss an sein**.
5. **Authentication → Email Templates → Magic Link**: Betreff zum Beispiel `Ihr Fensterino-Anmeldecode`, Text zum Beispiel:
   ```
   Guten Tag,
   Ihr Anmeldecode für Fensterino lautet: {{ .Token }}
   Er gilt eine Stunde. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail.
   ```
   Wichtig ist `{{ .Token }}`: Das ist der sechsstellige Code. Die Vorlage „Confirm signup“ genauso anpassen (sie wird beim allerersten Anmelden einer Adresse verschickt).
6. **Authentication → SMTP Settings**: Supabase verschickt mit dem eingebauten Versand nur **etwa 2 E-Mails pro Stunde**, das reicht nicht für echte Betriebe. Trag einen eigenen Versand ein (Resend, Postmark oder Brevo haben kostenlose Einstiegsstufen; Absender z. B. `anmeldung@fensterino.com`, dafür bei Cloudflare die DNS-Einträge des Anbieters setzen). Bis dahin testest du mit deiner eigenen Adresse.
7. Optional, **Authentication → Rate Limits**: Codes pro Stunde und Adresse begrenzen (die Website bremst zusätzlich: 8 Codes je 10 Minuten und IP).

### B. Stripe (Zahlungen), etwa 30 Minuten, erst im Testmodus

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Konto anlegen. Oben rechts bleibt der **Testmodus** (Sandbox) an, bis alles läuft; Firmendaten und Bankkonto für die Freischaltung kannst du parallel eintragen.
2. **Produktkatalog → Produkt hinzufügen**, je Produkt die **Preis-ID** (`price_…`) notieren:

   | Produkt | Preis | Art | Steuer | Variable bei Cloudflare |
   |---|---|---|---|---|
   | Fensterino Abo 10 | 49,00 € | wiederkehrend, monatlich | exklusiv (netto) | `STRIPE_PRICE_ABO` |
   | Fensterino Plus | 79,00 € | wiederkehrend, monatlich | exklusiv (netto) | `STRIPE_PRICE_PLUS` |
   | Fensterino Aufmaßblatt (optional) | 7,99 € | einmalig | inklusiv (brutto) | `STRIPE_PRICE_AUFMASS`; ohne diese Variable setzt der Server den Betrag aus `PREIS_AUFMASS_CENT` je Kauf selbst |

3. **Steuersätze** (Produktkatalog → Steuersätze): „MwSt. 19 %“ als **exklusiv** → `STRIPE_TAX_RATE`, und noch einmal „MwSt. 19 % inkl.“ als **inklusiv** → `STRIPE_TAX_RATE_INKL`. Bei Kleinunternehmerregelung (§ 19 UStG) beide weglassen und bei Cloudflare `MWST` = `0` setzen; dann steht auf der Kasse „umsatzsteuerfrei nach § 19 UStG“ und die Betriebspreise gelten ohne Zusatz.
4. **Einstellungen → Zahlungsmethoden**: Karten, PayPal, Apple Pay und Google Pay einschalten (Hauseigentümer), **SEPA-Lastschrift** einschalten (Betriebe; Stripe schaltet sie nach Prüfung frei).
5. **Einstellungen → Kunden-E-Mails**: „Zahlungsbelege per E-Mail“ an (der Hauseigentümer bekommt so seine Rechnung an die Adresse aus der Kasse). **Einstellungen → Branding** und **Öffentliche Angaben**: Name, Support-Adresse, Logo; das steht auf Belegen und Rechnungen.
6. **Entwickler → API-Schlüssel**: den **Geheimschlüssel** (`sk_test_…`) notieren → `STRIPE_SECRET_KEY`.
7. **Entwickler → Webhooks → Endpunkt hinzufügen**: URL `https://fensterino.com/api/zahlung/webhook`, Ereignisse `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`. Den **Signaturschlüssel** (`whsec_…`) notieren → `STRIPE_WEBHOOK_SECRET`. (Für die `…workers.dev`-Adresse einen zweiten Endpunkt anlegen, falls du dort testest.)

### C. Schlüssel bei Cloudflare eintragen

**Workers & Pages → fenstero → Einstellungen → Variablen und Geheimnisse**, jeweils Typ **Secret**, danach **Bereitstellen**:

| Name | Wert |
|---|---|
| `SUPABASE_URL` | Project URL aus A3 |
| `SUPABASE_SERVICE_KEY` | service_role-Schlüssel aus A3 |
| `SUPABASE_ANON_KEY` | anon-Schlüssel aus A3 |
| `STRIPE_SECRET_KEY` | `sk_test_…` aus B6, später `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` aus B7 |
| `FREISCHALT_GEHEIMNIS` | ein langer Zufallstext (z. B. aus `openssl rand -base64 32` oder dem Passwort-Manager); unterschreibt die Freischalt-Nachweise der gekauften Aufmaßblätter. Einmal setzen und nie ändern, sonst gelten alte Nachweise nicht mehr |
| `ANTHROPIC_API_KEY` | aus Schritt 5, falls noch nicht da |

Als normale Variablen (Typ Text): `STRIPE_PRICE_ABO`, `STRIPE_PRICE_PLUS`, optional `STRIPE_PRICE_AUFMASS`, `STRIPE_TAX_RATE`, `STRIPE_TAX_RATE_INKL`, `MWST`. Preise lassen sich ohne Code ändern: `PREIS_AUFMASS_CENT` (799), `PREIS_PROJEKT` (9), `FREI_PROJEKTE` (3), `PREIS_ABO` (49), `ABO_INKL` (10), `PREIS_ABO_EXTRA` (5), `PREIS_PLUS` (79). Die Abo-Preise bei Stripe musst du dann ebenfalls anpassen; die Website zeigt, was in den Variablen steht.

Die Sammelrechnungen laufen als Cron am 1. und 15. jeden Monats (steht in `wrangler.jsonc`, Cloudflare richtet den Zeitplan beim Deployment ein; sichtbar unter **Einstellungen → Trigger**). Du musst nichts weiter tun.

### D. Prüfen

- `https://fensterino.com/api/status` zeigt `"daten":true` und `"zahlung":true` sowie die Preise.
- Startseite: Der Pilot-Hinweis ist weg. **Kostenlos starten** → deine E-Mail → Code aus der Mail → Betrieb eintragen. Projekt anlegen, Link aufs Handy, als Kunde messen und absenden: Das Aufmaß erscheint im Projekt, ohne Code.
- Drei Projekte mit Aufmaß sind frei; das vierte bleibt gesperrt, bis unter **Abrechnung → Zahlungsart** eine Test-IBAN (`DE89 3704 0044 0532 0130 00`) oder Testkarte (`4242 4242 4242 4242`, beliebiges Datum in der Zukunft, beliebige drei Ziffern) hinterlegt ist.
- App ohne Link: ein Fenster messen, **Freischalten · 7,99 €**, E-Mail, Testkarte. Zurück in der App ist das Blatt frei, PDF und Code sind da, Stripe schickt den Beleg.
- Im Stripe-Dashboard unter **Webhooks** stehen die Ereignisse mit Antwort `200`.

### E. Echtes Geld

1. Stripe-Konto aktivieren (Firmendaten, Bankkonto, Identität).
2. Im **Live-Modus** Produkte, Steuersätze und den Webhook noch einmal anlegen (Test- und Live-Modus sind getrennt) und bei Cloudflare `STRIPE_SECRET_KEY` (`sk_live_…`), `STRIPE_WEBHOOK_SECRET` und die Preis-IDs austauschen.
3. Rechtliches vor der ersten echten Zahlung: Impressum (Schritt 4), Datenschutzerklärung um Supabase und Stripe als Auftragsverarbeiter ergänzen (AV-Verträge sind bei beiden Teil der Nutzungsbedingungen, in deren Kontoeinstellungen bestätigen), **Nutzungsbedingungen für Betriebe** und für den Kauf des Aufmaßblatts samt **Widerrufsbelehrung** (digitaler Inhalt: der Kunde stimmt in der Kasse zu, dass die Lieferung sofort beginnt und das Widerrufsrecht erlischt; dieser Satz steht schon in der Kasse). Lass die Texte prüfen.
4. Suchmaschinen freigeben: in `web/_headers` die Zeile `X-Robots-Tag` entfernen, `web/robots.txt` auf `Allow: /` stellen und in den HTML-Dateien `<meta name="robots" …>` löschen.

### Was wo gespeichert ist

| Daten | Ort |
|---|---|
| Konten der Betriebe, Projekte, Aufmaße der Link-Kunden, Buchungen, Nachrichten | Supabase, Tabelle `betriebe` (ein Dokument je Betrieb) |
| Anmeldung (E-Mail, Codes) | Supabase Auth |
| Zahlungsarten, Abos, Rechnungen, Belege | Stripe; bei uns nur Kennungen (`stripe_customer`, `stripe_subscription`) und Rechnungsnummern |
| Käufe des Aufmaßblatts | Stripe, dazu eine Zeile je Kauf in `zahlungen` (Kennung, E-Mail, Betrag, Nachweis) |
| Das Aufmaß des Hauseigentümers ohne Link | nur auf seinem Gerät; der Server sieht nur E-Mail, Betrag und eine zufällige Projekt-Kennung |
| Fotos | nur auf dem Gerät; an Anthropic geht eine verkleinerte Kopie zur Auswertung, gespeichert wird nichts |

## Sicherheit

- Geheime Schlüssel nur als **Secret** bei Cloudflare, niemals in Dateien im Repo.
- Das Repo ist öffentlich. Das ist in Ordnung, weil keine Geheimnisse darin stehen und der Code einer Website ohnehin im Browser sichtbar ist. Lieber privat: GitHub → Settings → Change visibility; Cloudflare funktioniert auch mit privaten Repos.
- Die Website lädt nichts von fremden Servern (Schriften und Bibliotheken liegen in `web/`) und setzt strenge Sicherheits-Kopfzeilen (`web/_headers`).

## Lokal ausprobieren (für Entwickler)

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs                                   # http://localhost:8788, Pilot, KI mit festen Testantworten
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 PORT=8789 node scripts/dev-server.mjs   # Stufe 2 nachgestellt: Anmeldecode 123456, Kassen kehren sofort als bezahlt zurück
node scripts/pruefen.mjs                                                    # Browser-Prüfung (Abschnitt 8 startet den zweiten Server selbst), braucht playwright-core
npx wrangler dev                                                            # wie bei Cloudflare (Worker-Laufzeit), http://localhost:8787
```

Mit echten Schlüsseln lokal: `SUPABASE_URL=… SUPABASE_SERVICE_KEY=… SUPABASE_ANON_KEY=… STRIPE_SECRET_KEY=sk_test_… node scripts/dev-server.mjs` (Schlüssel nur in der Shell, nie in eine Datei im Repo).

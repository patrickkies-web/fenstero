# eeziframes online stellen

**eeziframes** (immer kleingeschrieben, „eezi“ wie „easy“). Die Aufmaß-App für Fenster: kostenlos für Hauseigentümer, bezahlt von Fensterbauern je Projekt. Das Logo ist ein weißes Fenster auf Schwarz, dessen Flügel kurz kippt. eeziframes bringt Leute, die am Haus etwas vorhaben, mit den Betrieben aus ihrer Gegend zusammen. Später kommen weitere Gewerke dazu, zum Start geht es nur um Fenster.

Diese Anleitung bringt die eeziframes-Website ins Netz: erst unter einer kostenlosen Cloudflare-Adresse (`…workers.dev`), dann unter der eigenen Domain `eeziframes.com` (Schritt 6).

## Zwei Stufen

**Stufe 1, jetzt: Pilot-Website.** Alles läuft im Browser, ohne Datenbank, ohne echte Zahlungen. Der Code für Stufe 2 ist schon an Bord und schaltet sich selbst ein, sobald die Schlüssel da sind.

| Was | Stand im Pilot | Mit Supabase und Stripe (Stufe 2) |
|---|---|---|
| App: Fotos, vier Maße, Ränder, 3-D-Modell, Wünsche, Glossar | funktioniert vollständig | gleich |
| Kundenlink vom Betrieb zur App | funktioniert | der Link wird beim Öffnen am Server geprüft, der Betrieb sieht „geöffnet“ und „misst“ |
| Aufmaß zum Betrieb | Kunde schickt den Aufmaß-Code (WhatsApp/E-Mail), der Betrieb fügt ihn ein | geht beim Absenden direkt an den Betrieb, kein Code-Umweg |
| Aufmaßblatt für Hauseigentümer ohne Link (7,99 € inkl. MwSt.) | Paywall ist da, Kauf ist ein gekennzeichneter **Testkauf** ohne Abbuchung | echte Zahlung über Stripe (Karte, PayPal, Apple/Google Pay), Rechnung per E-Mail |
| KI-Auswertung der Fotos | funktioniert mit Anthropic-Schlüssel (Schritt 5), sonst ohne KI | gleich |
| Bereich für Betriebe: Projekte, Einladungslisten, Nachbesserung | funktioniert im Browser mit Beispieldaten | echte Konten, Anmeldung per E-Mail (Link oder Code), alles auf dem Server |
| Abrechnung Betriebe (3 Projekte frei, dann 9 € · Abo 10 · Plus) | nur angezeigt, nichts wird berechnet, Zähler im Browser | Zählung und Sperre auf dem Server, Zahlungsart und Abos bei Stripe, Sammelrechnung alle zwei Wochen |
| Speicherort | nur im Browser des jeweiligen Geräts | Supabase (Frankfurt), das Aufmaß des Hauseigentümers bleibt weiter auf seinem Gerät |

**Stufe 2** brauchst du, sobald echte Betriebe mitmachen oder Geld fließen soll: Abschnitt „Stufe 2: Supabase und Stripe anschließen“ unten. Es sind nur Schlüssel einzutragen, kein Code.

## Was du brauchst

| | Kosten |
|---|---|
| GitHub-Repo `patrickkies-web/fenstero` | hast du schon, kostenlos (Umbenennen in `eeziframes` ist möglich, siehe unten) |
| Cloudflare-Konto (Workers) | kostenlos |
| Eigene Domain | `eeziframes.com`, verwaltet bei Cloudflare (Jahresgebühr beim Anbieter) |
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

- `https://eeziframes.com/` (oder die `…workers.dev`-Adresse) zeigt die Startseite mit dem Pilot-Hinweis oben.
- `https://eeziframes.com/app/` zeigt die App.
- Ohne Konto: Auf der Startseite **Führung starten** (App, ein Fenster in neun Schritten) und **Tour starten** (Fensterbauer, acht Schritte). Beide speichern nichts.
- Kompletter Weg: Auf der Startseite **Für Betriebe starten** wählen und ein Konto anlegen (in der Pilotphase liegt es im Browser), ein Projekt anlegen, den Kundenlink kopieren und dir selbst per WhatsApp schicken. Auf dem Handy öffnen, ein Fenster messen (zwei Fotos, vier Maße), absenden, den Aufmaß-Code an dich zurückschicken. Im Portal **Code vom Kunden einfügen**: Das Aufmaß erscheint beim Projekt.
- `…/impressum/` und `…/datenschutz/` laden.

**Wichtig im Pilot:** Der Bereich für Betriebe speichert alles im Browser des Geräts. Kundenlinks anlegen und Codes einfügen deshalb immer im selben Browser auf demselben Gerät, zum Beispiel am Büro-PC.

## Schritt 4: Rechtstexte

Impressum (`web/impressum/`), Datenschutzerklärung (`web/datenschutz/`), AGB für Hauseigentümer mit Widerrufsbelehrung und Muster-Widerrufsformular (`web/agb/`), Nutzungsbedingungen für Fensterbauer mit dem Vertrag über die Auftragsverarbeitung (`web/nutzungsbedingungen/`), Cookies (`web/cookies/`) und die Widerrufsfunktion (`web/widerruf/`) sind mit den Angaben des Anbieters ausgefüllt (Patrick Kies, Postweg 35, 33442 Herzebrock-Clarholz, E-Mail ask@eeziframes.com, Telefon 0152 56950998; das Postfach liegt bei Zoho Mail, das steht in der Datenschutzerklärung). Alle Fußzeilen verlinken die Texte und zeigen „Vertrag widerrufen“ als Knopf (§ 356a BGB, seit 19. Juni 2026 Pflicht, sobald Verbraucher online kaufen).

Die Texte sind Entwürfe. Lass sie vor dem öffentlichen Start rechtlich prüfen. Die Suite (Abschnitt 17) prüft, dass Anbieter, Preise, Widerrufsbelehrung, Speicher-Einträge und Knöpfe zur Website passen.

Die Telefonnummer ist Pflicht: Sie gehört in die Widerrufsbelehrung und in die Vertragsbestätigung, nicht nur ins Impressum (Art. 246a § 1 EGBGB). E-Mail-Adresse und Nummer stehen auch in `functions/api/anbieter.js` (`mail`, `telefon`), damit sie in Vertragsbestätigung und Eingangsbestätigung stehen; die Suite prüft, dass beides zum Impressum passt. Steht in einem Text wieder ein orangefarbener Platzhalter (`<mark class="ph">`), bleibt die Kasse im Live-Modus zu (`/api/status`, `"verkauf"`).

Ändert sich der Text der AGB oder der Nutzungsbedingungen, bekommt er einen neuen Stand: in `functions/api/recht.js` (`AGB_STAND`, `NB_STAND`) und auf der Seite (`<meta name="stand">` und „Stand:“, erzeugt aus einer Quelle). Die Kasse zeigt den Stand, der Server nimmt nur Käufe mit genau diesem Stand an und speichert ihn mit dem Kauf; die Suite prüft, dass beides übereinstimmt.

## Schritt 5: KI-Fotoauswertung einschalten (optional)

1. In der [Anthropic Console](https://console.anthropic.com) anmelden, unter **Billing** ein Zahlungsmittel oder Guthaben hinterlegen und unter **Limits** ein monatliches Ausgabenlimit setzen.
2. Unter **API Keys** einen Schlüssel anlegen, Name zum Beispiel `eeziframes`. Der Schlüssel wird nur einmal angezeigt. Er gehört **nicht** ins Repo und nicht in einen Chat.
3. Cloudflare: **Workers & Pages → fenstero → Einstellungen (Settings) → Variablen und Geheimnisse (Variables and Secrets) → Hinzufügen (Add)**: Typ **Secret**, Name `ANTHROPIC_API_KEY`, Wert einfügen, **Bereitstellen** (Deploy). Secrets bleiben bei allen weiteren Deployments erhalten.
4. Prüfen: `https://eeziframes.com/api/ki` zeigt `{"bereit":true}`.

Was dann passiert: Vor dem ersten Foto fragt die App um Einwilligung. Erst danach geht eine verkleinerte Kopie des Fotos über `/api/ki` an Anthropic, **eine Anfrage je Foto**. Die KI liest die Einbausituation rund um die Maueröffnung (Rollladenkasten, Anschlag, Laibung, Fensterbänke, Wandaufbau, Anschlüsse, Zugang, Schäden), nicht das alte Fenster; Checkliste, Quellen und Kosten in [docs/KI.md](KI.md). Die Aufträge liegen auf dem Server (`functions/api/ki.js`), der Zugang wertet also nur Fotos fürs Aufmaß aus. Eine eingebaute Bremse erlaubt 40 Anfragen je 10 Minuten und IP-Adresse; sie zählt je Server-Instanz, deshalb unbedingt das Ausgabenlimit bei Anthropic setzen.

Optional:
- Anderes Modell über die Variable `KI_MODELL` (Standard: `claude-sonnet-5-5`, etwa 2,5 Cent je Fenster; `claude-haiku-5-5` etwa 0,13 Cent, weniger genau). Aktuelle Modellnamen: [docs.claude.com](https://docs.claude.com/en/docs/about-claude/models/overview).
- Zusätzlicher Schutz bei Cloudflare unter **Security → WAF → Rate limiting rules**: Pfad `/api/ki`, zum Beispiel 20 Anfragen in 10 Sekunden je IP, Aktion „Block“.

Datenschutz: Anthropic verarbeitet die Fotos dann in deinem Auftrag. Prüf, dass der Auftragsverarbeitungsvertrag (DPA) von Anthropic für dein Konto gilt; Abschnitt 5 der Datenschutzerklärung beschreibt die Verarbeitung.

## Schritt 6: Eigene Domain eeziframes.com

Die Hauptdomain ist `eeziframes.com`. Markenschutz: kurz ins Markenregister schauen ([DPMA](https://register.dpma.de), [EUIPO](https://euipo.europa.eu/eSearch/)), vor allem für Software, Vermittlung und Handwerksleistungen (Klassen 9, 35, 37 und 42). Eine eigene Marke „eeziframes“ samt Logo anzumelden schützt dich, wenn später weitere Gewerke oder Länder dazukommen; für mehrere Länder gibt es die Unionsmarke beim EUIPO oder eine internationale Registrierung über die WIPO. Ähnlich klingende Namen gibt es schon, etwa „EzyFrame“ von Manfrotto und „EZ Frames“ von Durkee; vor der Anmeldung deshalb auf Verwechslungsgefahr prüfen lassen.

1. Die Domain muss bei Cloudflare liegen: **Domain hinzufügen** (Add a domain), kostenlosen Tarif wählen und die zwei genannten Nameserver beim Domain-Anbieter eintragen. Bei einer Registrierung direkt über Cloudflare entfällt das.
2. **Workers & Pages → fenstero → Einstellungen → Domains & Routen (Domains & Routes) → Hinzufügen (Add) → Benutzerdefinierte Domain (Custom domain)**: `eeziframes.com` eintragen, hinzufügen. Dasselbe noch einmal für `www.eeziframes.com`. Cloudflare legt DNS-Eintrag und Zertifikat selbst an; nach ein paar Minuten lädt die Seite.
3. Meldet Cloudflare, dass es für den Namen schon einen DNS-Eintrag gibt: unter **DNS → Einträge (Records)** den A-, AAAA- oder CNAME-Eintrag für genau diesen Namen löschen und Schritt 2 wiederholen. Eigene A-Einträge braucht die Website nicht.

So erkennst du, wo es hakt: **Fehler 522** heißt, die Domain zeigt noch nicht auf den Worker (Punkt 2 und 3 oben). **„Server nicht gefunden“** heißt, für diesen Namen gibt es gar keinen Eintrag (häufig bei `www.`). Eine **leere oder 404-Seite** heißt, der letzte Build in `main` hat die Website nicht gefunden (Einstellungen aus Schritt 2 prüfen).

Kundenlinks, QR-Codes und die Adresse im Aufmaßblatt nehmen von selbst die Domain, unter der der Betriebsbereich geöffnet wurde; im Code steht keine Domain. Für Suchmaschinen zählt `www.eeziframes.com` als `eeziframes.com`, und die `…workers.dev`-Adresse wird nie freigegeben (`functions/seo.js`). Hängen weitere Domains am Worker, etwa `eeziframes.de`, leite sie bei Cloudflare per Weiterleitungsregel (Rules → Redirect Rules, 301, Pfad behalten) auf `eeziframes.com` um oder setze `KANONISCH` (Schritt 7).

**Die frühere Adresse `fensterino.com` gibt es nicht mehr.** Kundenlinks, QR-Codes und Aufmaßblätter, die noch darauf zeigen, laufen ins Leere; in der Pilotphase lagen Konten und Aufmaße ohnehin nur im Browser der jeweiligen Domain. Wurde Stufe 2 schon unter der alten Adresse eingerichtet, die Adressen nachziehen: Webhook bei Stripe (Stufe 2, B.4) und bei Supabase unter **Authentication → URL Configuration** die Site URL `https://eeziframes.com`.

**Repo umbenennen (optional, am besten vor Schritt 2):** GitHub → Repo `fenstero` → Settings → Repository name `eeziframes`. GitHub leitet die alte Adresse weiter. Den Worker-Namen `fenstero` nicht ändern, sonst findet Cloudflare die Bereitstellung nicht mehr.

## Schritt 7: Für Suchmaschinen und KI-Assistenten freigeben (wenn Impressum und Datenschutz fertig sind)

In der Pilotphase ist die Website für Google, Bing, ChatGPT, Claude und Perplexity gesperrt (`robots.txt` sperrt alles, jede Seite meldet `noindex`). Freigegeben wird ohne Code-Änderung:

1. Schritt 4 erledigt? Ohne vollständiges Impressum keine Freigabe.
2. Cloudflare: **Workers & Pages → fenstero → Einstellungen → Variablen und Geheimnisse → Hinzufügen**: Typ **Text**, Name `INDEXIERUNG`, Wert `1`, **Bereitstellen**. Hängen außer `eeziframes.com` und `www.` weitere Domains am Worker, zusätzlich `KANONISCH` = `https://eeziframes.com`.
3. Prüfen: `https://eeziframes.com/robots.txt` zeigt `Allow: /` und eine Zeile `Sitemap:`, `https://eeziframes.com/sitemap.xml` listet 14 Seiten, `https://eeziframes.com/llms.txt` die Kurzfassung für KI-Assistenten.
4. [Google Search Console](https://search.google.com/search-console) und [Bing Webmaster Tools](https://www.bing.com/webmasters): Domain bestätigen (DNS-Eintrag bei Cloudflare), Sitemap einreichen.

Was danach hilft (Erwähnungen, Bewertungen, Aktualität) und warum: [docs/SEO.md](SEO.md). Zurück in die Pilotphase: Variable `INDEXIERUNG` löschen.

## Stufe 2: Supabase und Stripe anschließen

Alles für Stufe 2 steckt schon im Repo: `functions/api/` (Konten, Eingang, Kasse, Webhook, Sammelrechnung), `web/assets/modell.js` (die Abrechnungsregeln, im Browser und auf dem Server dieselben) und `supabase/schema.sql` (die Tabellen). Du legst zwei Konten an und trägst die Schlüssel bei Cloudflare ein (Supabase zwei, Stripe zwei, dazu ein Zufallstext), fertig. Die Website merkt über `/api/status`, was da ist: Der Pilot-Hinweis verschwindet, die App schickt Aufmaße direkt, die Kasse geht zu Stripe.

Stripe geht auch allein, ohne Supabase: Dann kaufen Hauseigentümer das Aufmaßblatt über Stripe (im Testmodus mit Testkarte), alles für Betriebe bleibt im Pilotmodus, bis Supabase da ist. Mit Supabase sichern Hauseigentümer ihr Aufmaß in einem Konto (E-Mail und Code, kein Passwort) und kaufen nur noch damit; Messen geht weiter ohne Konto.

### A. Supabase (Datenbank und Anmeldung), etwa 20 Minuten

1. [supabase.com](https://supabase.com) → **New project**: Name `eeziframes`, Region **Central EU (Frankfurt)**, Datenbank-Passwort über **Generate a password** (in den Passwort-Manager, du brauchst es sonst nicht). Fragt Supabase nach Sicherheitsoptionen, die Vorgaben lassen („Data API + Connection String“, „public schema“): Der Server spricht über die Data API mit der Datenbank.
2. **SQL Editor → New query**: den Inhalt von `supabase/schema.sql` einfügen, **Run**. Das legt die Tabellen `betriebe`, `zahlungen`, `ereignisse`, `protokoll`, `statistik`, `entwuerfe` und `eigene` an und sperrt sie für Browser (nur der Server kommt mit dem geheimen Schlüssel dran). Die Datei lässt sich gefahrlos erneut ausführen; kommt etwas Neues dazu (zuletzt bei den Zahlungen die Zustimmung an der Kasse und die Vertragsbestätigung, davor die Konten für Hauseigentümer), einfach noch einmal komplett ausführen. Solange `eigene` fehlt, kaufen Hauseigentümer wie bisher ohne Konto.
3. **Project Settings → API Keys**: den **Secret key** (`sb_secret_…`) anzeigen und kopieren, gleich bei Cloudflare als Secret `SUPABASE_SECRET_KEY` eintragen (C). Die **Project URL** (`https://….supabase.co`) steht oben unter **Connect**. Der geheime Schlüssel darf nur bei Cloudflare liegen, nie im Browser, nie im Repo, nie in einem Chat. Den Publishable key (`sb_publishable_…`) braucht der Server nicht; ohne ihn nimmt die Anmeldung den geheimen. Ältere Projekte mit den früheren Schlüsseln (`eyJ…`, „Legacy API keys“: service_role und anon) gehen weiter unter `SUPABASE_SERVICE_KEY` und `SUPABASE_ANON_KEY`; Supabase schafft sie bis Ende 2026 ab, also besser die neuen nehmen.
4. **Authentication → Sign In / Providers → Email**: eingeschaltet lassen, „Confirm email“ ist egal, **„Allow new users to sign up“ muss an sein** (neue Konten entstehen beim Sichern eines Aufmaßes mit Zustimmung zu den AGB und bei der Registrierung eines Betriebs; „Anmelden“ in der App legt keins an).
   **Authentication → Audit Logs** (unter Configuration): **„Write audit logs to the database“ ausschalten.** Dann bleiben die Anmeldeprotokolle (IP-Adresse, Browser) nur kurz in der Protokollablage von Supabase, so wie es die Datenschutzerklärung sagt.
5. **Authentication → URL Configuration**: **Site URL** `https://eeziframes.com` (statt `http://localhost:3000`), bei **Redirect URLs** `https://eeziframes.com/**` hinzufügen (und die `…workers.dev`-Adresse mit `/**`, falls du dort testest). Dorthin führt der Anmeldelink aus der E-Mail zurück (Betriebe auf `/konto/`, Hauseigentümer auf `/app/`, beides deckt `/**` ab).
6. **Die Anmelde-E-Mail.** Betriebe und Hauseigentümer melden sich ohne Passwort an: Sie bekommen eine E-Mail mit einem Code und geben ihn dort ein, wo sie ihn angefordert haben. Die Website nimmt auch Anmeldelinks an, aber Mail-Apps öffnen Links gern in einem anderen Browser; ein Hauseigentümer, der dort landet, sieht sein gerade gemessenes Fenster nicht (es liegt im Browser, in dem er gemessen hat). Deshalb steht in den Vorlagen nur der Code (Schritt 7). Beide bekommen dieselben Vorlagen. Ohne eigenen Mailversand verschickt Supabase seine Standardmail mit Link, die Vorlagen lassen sich dann nicht ändern, und der eingebaute Versand schickt nur an Adressen aus deinem Supabase-Team, höchstens **2 E-Mails pro Stunde** (andere Adressen bekommen „Email address not authorized“). Zum Testen reicht das mit deiner eigenen Adresse.
7. Für echte Betriebe und Hauseigentümer, **Authentication → Emails → SMTP Settings** (bzw. „Set up SMTP“): einen eigenen Versand eintragen. Vorgesehen ist **Resend** (kostenlos bis 3.000 E-Mails im Monat und 100 am Tag; Öffnungs- und Klickmessung ist dort von Haus aus aus, so steht es in der Datenschutzerklärung). Brevo nicht nehmen: Dort lässt sich die Klickmessung in solchen E-Mails nur im teuren Tarif abschalten.
   - [resend.com](https://resend.com) → Konto anlegen (auch über GitHub) → **Domains → Add Domain**: `eeziframes.com`, Region **Ireland (eu-west-1)**. Am einfachsten **„Sign in to Cloudflare“**: Resend trägt die drei Einträge selbst ein (MX und SPF auf der Unteradresse `send`, DKIM auf `resend._domainkey`) und prüft sie meist in wenigen Minuten. Von Hand: die angezeigten Einträge bei Cloudflare unter **DNS** eintragen, DKIM mit „DNS only“. **„Receiving“ bleibt aus**: Empfangen wird über Zoho Mail (MX-Einträge der Hauptdomain), Resend verschickt nur. Öffnungs- und Klickmessung bleiben aus ([Resend: Cloudflare](https://resend.com/docs/guides/dns/cloudflare)).
   - **API Keys → Create API Key** zweimal, je mit „Sending access“ nur für `eeziframes.com`: einer für Supabase, einer für Cloudflare (`MAIL_API_KEY`, Abschnitt C). Schlüssel beginnen mit `re_`, nur einmal sichtbar, nirgends sonst ablegen.
   - Hier in Supabase: Host `smtp.resend.com`, Port `465`, Benutzer `resend`, Passwort = der Supabase-Schlüssel, Absender `ask@eeziframes.com`, Name `eeziframes`.
   Wer einen anderen Anbieter nimmt, muss die Datenschutzerklärung anpassen. Danach unter **Authentication → Emails → Templates** **zwei** Vorlagen anpassen: **Confirm signup** (in neueren Dashboards „Confirm sign up“; geht an jede Adresse, die noch kein bestätigtes Konto hat, also beim allerersten Anmelden) und **Magic Link** („Magic link or OTP“; alle weiteren Anmeldungen). Fehlt `{{ .Token }}` in einer davon, kommt dort nur ein Link zur Registrierung bzw. Anmeldung. Die Vorlagen liegen fertig gestaltet im Repo, im Stil der Seite (Papier, weiße Karte, Code im schwarzen Feld, hell und dunkel), ohne Bilder und ohne nachgeladene Inhalte:

   | Vorlage bei Supabase | Betreff | Inhalt („Source“, alles ersetzen) |
   |---|---|---|
   | Magic Link | `Anmeldecode für eeziframes: {{ .Token }}` | [`supabase/vorlagen/anmeldecode.html`](../supabase/vorlagen/anmeldecode.html) |
   | Confirm signup | `Willkommen bei eeziframes: Code {{ .Token }}` | [`supabase/vorlagen/registrierung.html`](../supabase/vorlagen/registrierung.html) |

   Supabase setzt auch im Betreff ein; so steht der Code schon in der Mitteilung auf dem Handy (wer das nicht will, lässt `{{ .Token }}` im Betreff weg). `{{ .Token }}` ist der Code, `{{ .Email }}` die Adresse; `{{ .ConfirmationURL }}` (der Link) bleibt bewusst weg (Schritt 6). Die Texte kommen ohne „du“ und „Sie“ aus, weil Betriebe und Hauseigentümer dieselben Vorlagen bekommen. Wie viele Stellen der Code hat, steht unter **Authentication → Sign In / Providers → Email** bei „Email OTP Length“ (6 bis 10); die Website nimmt jede dieser Längen, 6 ist am bequemsten. Ob der eigene Versand greift, zeigt der Absender: `eeziframes <ask@eeziframes.com>`; steht dort „Supabase Auth“, ist SMTP noch nicht eingeschaltet, und die Vorlagen wirken nicht.
8. **Fotos:** nichts einzurichten. Der Server legt beim ersten Foto selbst den Speicher an (**Storage → Buckets → `fotos`**, „Public“ aus, nur JPEG, höchstens 1 MB je Datei) und liest ihn nur mit dem geheimen Schlüssel. Die App schickt die Fotos verkleinert (etwa 1 Megapixel, meist 0,2 bis 0,6 MB). Der kostenlose Tarif von Supabase hat derzeit 1 GB Dateispeicher und 5 GB Datenverkehr im Monat; das reicht für einige Tausend Fotos. Wird es knapp, zeigt Supabase das unter **Usage**, dann lohnt der Pro-Tarif.
9. **Authentication → Rate Limits**: Mit eigenem Versand erlaubt Supabase zunächst nur 30 E-Mails pro Stunde ([Supabase: Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)). Weil sich auch Hauseigentümer anmelden, den Wert für E-Mails erhöhen, zum Beispiel auf 100; die Website bremst zusätzlich (8 Anmelde-E-Mails je 10 Minuten und Anschluss).

### B. Stripe (Zahlungen), etwa 15 Minuten, erst im Testmodus

Produkte, Preise und Steuersätze legst du nicht an: Das macht der Server beim ersten Bedarf selbst und findet sie danach wieder (`functions/api/stripe.js`). In Stripe heißen sie „eeziframes Abo 10“ (49 € im Monat), „eeziframes Plus“ (79 € im Monat) und „MwSt.“ (19 %, einmal inklusive fürs Aufmaßblatt, einmal zuzüglich für Betriebe). Ändert sich ein Preis über die Variablen (`PREIS_ABO`, `PREIS_PLUS`), legt er einen neuen Preis an; laufende Abos behalten ihren bis zum nächsten Tarifwechsel.

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Konto anlegen. Gearbeitet wird zuerst in der **Sandbox** (Testumgebung, im Dashboard so beschriftet): Dort fließt kein echtes Geld. Firmendaten und Bankkonto kommen erst für echtes Geld dazu (E).
2. **Einstellungen → Zahlungen → Zahlungsmethoden**: Karten sind an; **Apple Pay** und **Google Pay** einschalten (laufen über die Karte), **SEPA-Lastschrift** einschalten (Betriebe). Die Kasse fürs Aufmaßblatt bietet die Zahlungsarten aus der Variablen `ZAHLARTEN` an, Standard nur Karte; SEPA bewusst nicht, weil Lastschriften erst nach Tagen bestätigen, das Blatt aber sofort kommt. PayPal oder Klarna dazu: hier einschalten und bei Cloudflare `ZAHLARTEN` = `card,paypal` (bzw. `card,paypal,klarna`) setzen; die Kasse in der App nennt sie dann von selbst.
3. **Entwickler → API-Schlüssel** ([dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)): den **Geheimschlüssel** (`sk_test_…`) anzeigen, kopieren und gleich bei Cloudflare als Secret `STRIPE_SECRET_KEY` eintragen (C). Nicht per E-Mail oder Chat weitergeben. Ein eingeschränkter Schlüssel (`rk_test_…`) geht auch; er braucht Schreibrechte für Checkout Sessions, Customers, Invoices, Invoice Items, Prices, Products, Subscriptions und Tax Rates sowie Leserechte für Payment Intents, Setup Intents und Payment Methods.
4. **Workbench → Webhooks** ([dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)) → **Erstellen Sie ein Ereignisziel** → **Ihr Konto** → Payload-Format **Thin**, wie vorgeschlagen (Snapshot geht genauso, dann die vorgeschlagene API-Version lassen) → diese vier Ereignisse auswählen:
   - `checkout.session.completed` (Kasse abgeschlossen)
   - `invoice.paid` (Rechnung bezahlt)
   - `invoice.payment_failed` (Zahlung fehlgeschlagen)
   - `customer.subscription.deleted` (Abo beendet)

   Bei Thin steht davor ein `v1.`. **Weiter** → **Webhook-Endpoint** → **Weiter** → Endpoint-URL `https://eeziframes.com/api/zahlung/webhook` (hängt die Domain noch nicht am Worker: die `…workers.dev`-Adresse mit `/api/zahlung/webhook`) → erstellen. Auf der Seite des Ziels **Geheimschlüssel anzeigen** (`whsec_…`) und bei Cloudflare als Secret `STRIPE_WEBHOOK_SECRET` eintragen. Der Server prüft damit jede Zustellung; ohne passendes Geheimnis lehnt er sie ab.
5. **Einstellungen → Kunden-E-Mails**: Belege für erfolgreiche Zahlungen an (Hauseigentümer bekommen so ihre Rechnung), für Betriebe auch abgeschlossene Rechnungen. **Einstellungen → Öffentliche Unternehmensangaben** und **Branding**: Name, Anschrift, Support-Adresse, Logo; das steht auf Belegen und Rechnungen.
6. Für Abos der Betriebe, **Billing → Umsatzsicherung → Wiederholungsversuche**: Wenn alle Versuche scheitern, **Abo kündigen**. Dann endet ein unbezahltes Abo bei Stripe, und der Betrieb ist bei uns von selbst wieder im Tarif Start.

Umsatzsteuer: Die Variable `MWST` musst du vor dem Verkauf mit echtem Geld setzen. `MWST` = `0` bei Kleinunternehmerregelung (§ 19 UStG): keine Steuersätze, auf jeder Rechnung steht „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“, die Kasse zeigt „umsatzsteuerfrei nach § 19 UStG“. `MWST` = `19`: Betriebspreise netto zuzüglich 19 %, Aufmaßblatt brutto mit 19 % darin. Ohne Angabe rechnet die Vorschau mit 19 %, aber im Live-Modus bleiben Kasse, Abo-Abschluss und Sammelrechnungen zu: Eine Rechnung mit Umsatzsteuer, die ein Kleinunternehmer nicht schuldet, müsste er trotzdem ans Finanzamt zahlen (§ 14c UStG).

### C. Schlüssel bei Cloudflare eintragen

**Workers & Pages → fenstero → Einstellungen → Variablen und Geheimnisse**, jeweils Typ **Secret**, danach **Bereitstellen**:

| Name | Wert |
|---|---|
| `SUPABASE_URL` | Project URL aus A3 (`https://….supabase.co`) |
| `SUPABASE_SECRET_KEY` | Secret key aus A3 (`sb_secret_…`); bei älteren Projekten stattdessen `SUPABASE_SERVICE_KEY` (service_role) und `SUPABASE_ANON_KEY` (anon) |
| `STRIPE_SECRET_KEY` | `sk_test_…` aus B3, später `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` aus B4 (Test- und Live-Modus haben je ein eigenes) |
| `FREISCHALT_GEHEIMNIS` | ein langer Zufallstext (z. B. aus dem Passwort-Manager); unterschreibt die Freischalt-Nachweise der gekauften Aufmaßblätter. Einmal setzen und nie ändern, sonst gelten alte Nachweise nicht mehr |
| `ANTHROPIC_API_KEY` | aus Schritt 5, falls noch nicht da |
| `ZENTRALE_PASSWORT` | Passwort für deine Zentrale unter `/zentrale/`, mindestens 12 Zeichen (besser 20 und mehr); ohne bleibt sie zu ([docs/ZENTRALE.md](ZENTRALE.md)) |
| `ZENTRALE_2FA` | optional, empfohlen: Schlüssel für die Authenticator-App, erzeugt die Zentrale unter **Einstellungen → Zweiter Faktor** |
| `MAIL_API_KEY` | API-Schlüssel von Resend für Cloudflare (`re_…`, A7); der Server verschickt damit die Vertragsbestätigung nach dem Kauf (mit AGB und Widerrufsbelehrung, ohne sie erlischt das Widerrufsrecht nicht) und die Eingangsbestätigung eines Widerrufs |

Als normale Variablen (Typ Text): `MAIL_ABSENDER` (Pflicht mit `MAIL_API_KEY`: eine Adresse der bei Resend bestätigten Domain, hier `ask@eeziframes.com`), `MAIL_KONTAKT` (optional: Postfach für Kopien eingegangener Widerrufe und Antwortadresse, sonst `ask@eeziframes.com` aus `functions/api/anbieter.js`, wie im Impressum), `MWST` (Pflicht vor echtem Geld: `0` bei Kleinunternehmerregelung, sonst `19`); alle weiteren optional: `ZAHLARTEN` (`card`, auf Wunsch `card,paypal`), die Preise `PREIS_AUFMASS_CENT` (799), `PREIS_PROJEKT` (9), `FREI_PROJEKTE` (3), `PREIS_ABO` (49), `ABO_INKL` (10), `PREIS_ABO_EXTRA` (5), `PREIS_PLUS` (79). Variablen aus dem Dashboard bleiben bei jedem Deployment erhalten (`keep_vars` in `wrangler.jsonc`). Nur wer eigene Objekte in Stripe nutzen will: `STRIPE_PRICE_ABO`, `STRIPE_PRICE_PLUS`, `STRIPE_PRICE_AUFMASS`, `STRIPE_TAX_RATE`, `STRIPE_TAX_RATE_INKL` (IDs aus Stripe; sie haben Vorrang).

Die Sammelrechnungen laufen als Cron am 1. und 15. jeden Monats (steht in `wrangler.jsonc`, Cloudflare richtet den Zeitplan beim Deployment ein; sichtbar unter **Einstellungen → Trigger**). Jeden Tag räumt der Server auf (Protokoll nach Frist, nicht bezahlte Kassen nach 30 Tagen, Anmeldungen ohne Betrieb nach 30 Tagen ohne Nutzung, bezahlte Käufe nach acht Jahren) und holt nach, was eine Störung des Mailversands verhindert hat: Vertragsbestätigungen nach dem Kauf und Eingangsbestätigungen von Widerrufen. Was danach noch fehlt, zeigt die Zentrale als Hinweis. Du musst nichts weiter tun.

### D. Prüfen

- `https://eeziframes.com/api/status` zeigt `"zahlung":true`, `"testmodus":true` (Sandbox-Schlüssel) und `"webhook":true`, mit Supabase auch `"daten":true` und `"konten":true`, mit Resend `"post":true`, dazu die Preise. Ist ein Schlüssel verwechselt oder fehlt einer, steht dort `"hinweise"` mit dem Namen der Variablen (nie mit ihrem Wert). Unter `"verkauf"` steht, was vor dem Verkauf mit echtem Geld noch fehlt (`"fehlt"`: Mailversand, `MWST`, Konten, E-Mail-Adresse und Telefonnummer in den Rechtstexten); erst bei `"bereit":true` öffnet die Kasse im Live-Modus.
- App ohne Link: ein Fenster messen, **Freischalten · 7,99 €**, Aufmaß mit E-Mail und Code sichern, an der Kasse beide Haken setzen (AGB, sofortige Bereitstellung), weiter zu Stripe. Die Kasse sagt „Testbetrieb“ und nennt die Testkarte `4242 4242 4242 4242` (Datum in der Zukunft, beliebige Prüfziffer). Zurück in der App ist das Blatt frei, PDF und Code sind da, Stripe schickt den Beleg.
- Stripe → **Workbench → Webhooks** → dein Ziel: Zustellungen mit Antwort `200`. Ein `503` bei `invoice.paid` kurz nach einer Sammelrechnung ist gewollt: Die Rechnung wird gerade eingetragen, Stripe stellt später erneut zu.
- Mit Supabase, Betriebe: **Kostenlos starten** → deine E-Mail → in der Mail auf den Anmeldelink klicken (oder den Code eingeben) → Betrieb eintragen. Projekt anlegen, Link aufs Handy, als Kunde messen und absenden: Das Aufmaß erscheint im Projekt, ohne Code. Drei Projekte mit Aufmaß sind frei; das vierte bleibt gesperrt, bis unter **Abrechnung → Zahlungsart** eine Test-IBAN (`DE89 3704 0044 0532 0130 00`) oder die Testkarte hinterlegt ist (das Blatt nennt beide im Testmodus). Nach dem ersten Abo stehen in Stripe unter **Produktkatalog** „eeziframes Abo 10“ und die Steuersätze.

### Zentrale (dein Verwaltungsbereich)

Unter `https://eeziframes.com/zentrale/` siehst du alle Betriebe mit ihren Zahlen, kannst sperren, löschen und Daten exportieren, siehst die Käufe, eine eigene Statistik ohne Cookies und ein Protokoll. Einrichten: `ZENTRALE_PASSWORT` als Secret bei Cloudflare (C), `supabase/schema.sql` noch einmal ausführen (A2), anmelden, unter **Einstellungen** den zweiten Faktor einrichten. Alles Weitere: [docs/ZENTRALE.md](ZENTRALE.md).

### E. Echtes Geld

1. Stripe-Konto aktivieren (Firmendaten, Bankkonto, Identität). Steuernummer bzw. USt-IdNr. in den Rechnungseinstellungen eintragen, damit sie auf jeder Rechnung steht. Vorher muss `/api/status` unter `"verkauf"` `"bereit":true` zeigen; sonst bleibt die Kasse im Live-Modus zu.
2. Im **Live-Modus** einen Geheimschlüssel (`sk_live_…`) und ein neues Ereignisziel anlegen (gleiche Adresse, gleiche Ereignisse; Test- und Live-Modus sind getrennt), bei Cloudflare `STRIPE_SECRET_KEY` und `STRIPE_WEBHOOK_SECRET` austauschen. Preise und Steuersätze legt der Server im Live-Modus selbst neu an.
3. Stripe-Kennungen aus dem Testmodus gelten live nicht: In Supabase (Tabelle `betriebe`) die Spalten `stripe_customer` und `stripe_subscription` der Testkonten leeren oder die Testkonten löschen.
4. Rechtliches vor der ersten echten Zahlung: E-Mail-Adresse und Telefonnummer in die Rechtstexte (Schritt 4), Mailversand eingerichtet (`MAIL_API_KEY`, sonst gehen weder Vertragsbestätigung noch Eingangsbestätigung eines Widerrufs raus), Gewerbe angemeldet und Kleinunternehmer-Frage geklärt (`MWST`), die Texte rechtlich prüfen lassen. Die Kasse im Live-Modus prüft das Technische davon selbst (`"verkauf"` in `/api/status`).
   Bevor sich der erste Betrieb registriert: Supabase auf den Tarif **Pro** stellen (tägliche Sicherungen, sieben Tage aufbewahrt). So sagt es der Vertrag über die Auftragsverarbeitung (Anlage der Nutzungsbedingungen, Nr. 5 und 8); im kostenlosen Tarif sichert Supabase nichts.
5. Suchmaschinen freigeben: Schritt 7 (Variable `INDEXIERUNG`).

Erstattungen, Kündigungen und Rechnungen siehst und erledigst du im Stripe-Dashboard (**Zahlungen** → Zahlung → **⋯** → **Zahlung erstatten**; **Kunden**; **Rechnungen**). Eine Erstattung des Aufmaßblatts sperrt das Blatt nicht nachträglich; es liegt auf dem Gerät des Käufers.

### Was wo gespeichert ist

| Daten | Ort |
|---|---|
| Konten der Betriebe, Projekte, Aufmaße der Link-Kunden, Buchungen, Nachrichten | Supabase, Tabelle `betriebe` (ein Dokument je Betrieb) |
| Anmeldung (E-Mail, Codes) | Supabase Auth |
| Zahlungsarten, Abos, Rechnungen, Belege | Stripe; bei uns nur Kennungen (`stripe_customer`, `stripe_subscription`) und Rechnungsnummern |
| Käufe des Aufmaßblatts | Stripe, dazu eine Zeile je Kauf in `zahlungen` (Kennung, E-Mail, Betrag, Nachweis, Zustimmung an der Kasse mit AGB-Stand und Zeitpunkt, Zeitpunkt der Vertragsbestätigung); die Zustimmung steht auch in den Metadaten der Stripe-Kasse |
| Das Aufmaß des Hauseigentümers ohne Link | ohne Konto nur auf seinem Gerät; gesichert im Konto in Supabase, Tabelle `eigene` (die Fotos liegen daneben, nächste Zeile) |
| Fotos | verkleinert auf dem Gerät des Kunden (IndexedDB `aufmass-fotos`); beim Kundenlink und mit Konto zusätzlich in Supabase Storage, Bucket `fotos` (privat): `link/<code>/…` und `konto/<nutzer>/<kennung>/…`. Der Betrieb sieht sie erst mit dem gesendeten Aufmaß. Gelöscht: beim Betrieb 12 Monate nach dem Eingang (das Aufmaß bleibt), nie gesendet mit dem Inhalt des Zwischenstands, im Konto mit dem Aufmaß bzw. dem Konto, überholte beim Senden bzw. Abgleich, alle mit dem Konto des Betriebs. An Anthropic geht nur mit Einwilligung eine verkleinerte Kopie zur Auswertung |
| Protokoll der Zentrale (Anmeldungen mit gekürzter IP, Eingriffe, Löschnachweise, Widerrufe) | Supabase, Tabelle `protokoll`; Anmeldungen 90 Tage, Eingriffe 3 Jahre, Widerrufe bis Ende des dritten Jahres nach dem Eingang |
| Eigene Statistik | Supabase, Tabelle `statistik`: nur Tagessummen, keine IP-Adressen, keine Kennungen |
| Vermerke der Zentrale an einem Konto (Sperre, interne Notiz) | im Dokument des Betriebs (`daten.verwaltung`), verlässt den Server nur im Datenexport |

## Sicherheit

- Geheime Schlüssel nur als **Secret** bei Cloudflare, niemals in Dateien im Repo.
- Das Repo ist öffentlich. Das ist in Ordnung, weil keine Geheimnisse darin stehen und der Code einer Website ohnehin im Browser sichtbar ist. Lieber privat: GitHub → Settings → Change visibility; Cloudflare funktioniert auch mit privaten Repos.
- Die Website lädt nichts von fremden Servern (Schriften und Bibliotheken liegen in `web/`) und setzt strenge Sicherheits-Kopfzeilen (`web/_headers`).
- Die Zentrale ist nur mit `ZENTRALE_PASSWORT` erreichbar, am besten mit zweitem Faktor; jede Anmeldung und jeder Eingriff steht im Protokoll ([docs/ZENTRALE.md](ZENTRALE.md), Abschnitt Sicherheit).

## Lokal ausprobieren (für Entwickler)

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs                                   # http://localhost:8788, Pilot, KI mit festen Testantworten
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 PORT=8789 ZENTRALE_PASSWORT=lokales-testpasswort node scripts/dev-server.mjs   # Stufe 2 nachgestellt: Anmeldecode 123456, Kassen kehren sofort als bezahlt zurück, Zentrale unter /zentrale/
node scripts/pruefen.mjs                                                    # Browser-Prüfung (Abschnitte 8 und 13 starten eigene Server, Abschnitt 11 prüft die Stripe-Anbindung gegen ein nachgestelltes Stripe), braucht playwright-core
npx wrangler dev                                                            # wie bei Cloudflare (Worker-Laufzeit), http://localhost:8787
```

Mit echten Schlüsseln lokal: `SUPABASE_URL=… SUPABASE_SECRET_KEY=sb_secret_… STRIPE_SECRET_KEY=sk_test_… node scripts/dev-server.mjs` (Schlüssel nur in der Shell, nie in eine Datei im Repo).

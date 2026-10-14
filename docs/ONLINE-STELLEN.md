# Fensterino online stellen

**Fensterino.** Die Aufmaß-App für Fenster: kostenlos für Hauseigentümer, bezahlt von Fensterbauern je Projekt. Das Logo ist ein weißes Fenster auf Schwarz, dessen Flügel kurz kippt. Fensterino bringt Leute, die am Haus etwas vorhaben, mit den Betrieben aus ihrer Gegend zusammen. Später kommen weitere Gewerke dazu, zum Start geht es nur um Fenster.

Diese Anleitung bringt die Fensterino-Website ins Netz: erst unter einer kostenlosen Cloudflare-Adresse (`…workers.dev`), dann unter deiner eigenen Domain (`fensterino.com`).

## Zwei Stufen

**Stufe 1, jetzt: Pilot-Website.** Alles läuft im Browser, ohne eigenen Server, ohne Datenbank, ohne Zahlungen.

| Was | Stand im Pilot |
|---|---|
| App: Fotos, vier Maße, Ränder, 3-D-Modell, Wünsche, Glossar | funktioniert vollständig |
| Kundenlink vom Betrieb zur App | funktioniert |
| Aufmaß zum Betrieb | Kunde schickt das Aufmaßblatt als PDF oder den Aufmaß-Code, der Betrieb fügt den Code in seinem Bereich ein |
| PDF fürs Aufmaß (Kunde und Betrieb) | funktioniert, für Kunden in der Pilotphase kostenlos |
| KI-Auswertung der Fotos | funktioniert, sobald du einen Anthropic-Schlüssel hinterlegst (Schritt 5), sonst ohne KI |
| Bereich für Betriebe: Projekte, Einladungslisten, Nachbesserung, Abrechnung | funktioniert im Browser, Abrechnung als Vorschau, nichts wird berechnet |
| Speicherort | nur im Browser des jeweiligen Geräts |

**Stufe 2, danach: echtes Backend.** Konten, automatische Übertragung samt Fotos, Abrechnung. Siehe Abschnitt „Stufe 2“ unten.

## Was du brauchst

| | Kosten |
|---|---|
| GitHub-Repo `patrickkies-web/fenstero` | hast du schon, kostenlos (Umbenennen in `fensterino` ist möglich, siehe unten) |
| Cloudflare-Konto (Workers) | kostenlos |
| Eigene Domain | `fensterino.com`, liegt schon bei Cloudflare |
| Anthropic-API-Schlüssel für die KI | optional, nach Verbrauch; Ausgabenlimit setzen |

---

## Schritt 1: Cloudflare-Konto anlegen

[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) öffnen, mit E-Mail und Passwort registrieren und die E-Mail bestätigen. Der kostenlose Tarif reicht.

## Schritt 2: Worker mit GitHub verbinden

Cloudflare legt neue Projekte als **Worker** an. Das Repo bringt dafür alles mit: `wrangler.jsonc` sagt Cloudflare, dass die Website im Ordner `web/` liegt, und `worker.js` beantwortet `/api/ki` (KI-Auswertung der Fotos).

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

## Später: öffentlicher Start

- **`pilot: true` in `web/config.js` erst abschalten, wenn Stufe 2 läuft.** Ohne Backend würde die App sonst wieder „Gesendet“ anzeigen, obwohl nichts übertragen wurde, und eine Bezahlseite ohne echte Zahlung.
- Suchmaschinen freigeben: in `web/_headers` die Zeile `X-Robots-Tag` entfernen, `web/robots.txt` auf `Allow: /` stellen und in den HTML-Dateien `<meta name="robots" …>` löschen.

## Stufe 2: echtes Backend (Überblick)

- **Supabase**, Region Frankfurt: Konten für Betriebe, Projekte, Kundenlinks, Aufmaße samt Fotos.
- **Automatische Übertragung**: Die App schickt das Aufmaß direkt an den Betrieb, der Code-Umweg entfällt.
- **Stripe**: SEPA-Lastschrift und Karte für Betriebe. Zuerst im Testmodus.
- **E-Mails** für Benachrichtigungen.
- **Recht**: Nutzungsbedingungen für Betriebe, erweiterte Datenschutzerklärung, Auftragsverarbeitungsverträge (Supabase, Stripe).

## Sicherheit

- Geheime Schlüssel nur als **Secret** bei Cloudflare, niemals in Dateien im Repo.
- Das Repo ist öffentlich. Das ist in Ordnung, weil keine Geheimnisse darin stehen und der Code einer Website ohnehin im Browser sichtbar ist. Lieber privat: GitHub → Settings → Change visibility; Cloudflare funktioniert auch mit privaten Repos.
- Die Website lädt nichts von fremden Servern (Schriften und Bibliotheken liegen in `web/`) und setzt strenge Sicherheits-Kopfzeilen (`web/_headers`).

## Lokal ausprobieren (für Entwickler)

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs     # http://localhost:8788, KI mit festen Testantworten
node scripts/pruefen.mjs                      # Browser-Prüfung, braucht das Paket playwright-core
npx wrangler dev                              # wie bei Cloudflare (Worker-Laufzeit), http://localhost:8787
```

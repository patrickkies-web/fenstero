# Klopfan online stellen

**Klopfan – Hier kommen wa zamm.** Das Logo ist eine Faust, die anklopft, so wie Betriebe im Portal bei Projekten anklopfen. Klopfan bringt Leute, die am Haus etwas vorhaben, mit den Betrieben aus ihrer Gegend zusammen. Später kommen weitere Gewerke dazu, zum Start geht es nur um Fenster.

Diese Anleitung bringt die Klopfan-Website ins Netz: erst unter einer kostenlosen Cloudflare-Adresse (`…pages.dev`), später unter deiner eigenen Domain.

## Zwei Stufen

**Stufe 1, jetzt: Pilot-Website.** Alles läuft im Browser, ohne eigenen Server, ohne Datenbank, ohne Zahlungen.

| Was | Stand im Pilot |
|---|---|
| App: Fotos, vier Maße, Ränder, 3-D-Modell, Wünsche, Glossar | funktioniert vollständig |
| Kundenlink vom Betrieb zur App | funktioniert |
| Aufmaß zum Betrieb | Kunde schickt einen Aufmaß-Code per WhatsApp oder E-Mail, der Betrieb fügt ihn im Portal ein |
| PDF fürs Aufmaß (Kunde und Betrieb) | funktioniert, für Kunden in der Pilotphase kostenlos |
| KI-Auswertung der Fotos | funktioniert, sobald du einen Anthropic-Schlüssel hinterlegst (Schritt 5), sonst ohne KI |
| Portal: Marktplatz, Anklopfen, Bewertungen, Abrechnung | Vorschau mit Beispieldaten, nichts wird berechnet |
| Speicherort | nur im Browser des jeweiligen Geräts |

**Stufe 2, danach: echtes Backend.** Konten, automatische Übertragung samt Fotos, echte Anfragen im Marktplatz, Abrechnung. Siehe Abschnitt „Stufe 2“ unten.

## Was du brauchst

| | Kosten |
|---|---|
| GitHub-Repo `patrickkies-web/fenstero` | hast du schon, kostenlos (Umbenennen in `klopfan` ist möglich, siehe unten) |
| Cloudflare-Konto (Pages) | kostenlos |
| Eigene Domain | später, beim Anbieter deiner Wahl |
| Anthropic-API-Schlüssel für die KI | optional, nach Verbrauch; Ausgabenlimit setzen |

---

## Schritt 1: Cloudflare-Konto anlegen

[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) öffnen, mit E-Mail und Passwort registrieren und die E-Mail bestätigen. Der kostenlose Tarif reicht.

## Schritt 2: Pages-Projekt mit GitHub verbinden

1. Im Cloudflare-Dashboard links **Workers & Pages** öffnen, dann **Erstellen** (Create).
2. Den Bereich **Pages** wählen und **Mit Git verbinden** (Connect to Git). Falls Cloudflare zuerst nur „Workers“ anbietet: unten auf den Hinweis zu **Pages** klicken.
3. GitHub verbinden und Cloudflare den Zugriff auf das Repo **fenstero** erlauben.
4. Repo `patrickkies-web/fenstero` auswählen und so einstellen:

   | Feld | Wert |
   |---|---|
   | Projektname | `klopfan` (ergibt `klopfan.pages.dev`, falls frei) |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Build command | leer lassen |
   | Build output directory | `web` |

5. **Speichern und bereitstellen** (Save and Deploy). Nach etwa einer Minute ist die Seite unter `https://klopfan.pages.dev` erreichbar (oder unter dem Namen, den Cloudflare anzeigt).

Die Menünamen bei Cloudflare ändern sich ab und zu; die Werte in der Tabelle bleiben gleich.

Ab jetzt gilt: Jede Änderung im Branch `main` geht automatisch online. Andere Branches bekommen eine eigene Vorschau-Adresse.

> Es gibt auch „Direct Upload“ per Drag-and-drop. Davon rate ich ab: Die KI-Funktion läuft dort nicht, jedes Update muss von Hand hochgeladen werden, und ein solches Projekt lässt sich später nicht auf GitHub umstellen.

## Schritt 3: Testen

- `https://…pages.dev/` zeigt das Portal mit dem Pilot-Hinweis oben.
- `https://…pages.dev/app/` zeigt die App.
- Kompletter Weg: Im Portal **Demo ansehen** wählen (Fensterbau Brandt), ein Projekt öffnen, den Kundenlink kopieren und dir selbst per WhatsApp schicken. Auf dem Handy öffnen, ein Fenster messen (oder „Beispielfotos nutzen“), absenden, den Aufmaß-Code an dich zurückschicken. Im Portal **Code vom Kunden einfügen**: Das Aufmaß erscheint beim Projekt.
- `…/impressum/` und `…/datenschutz/` laden.

**Wichtig im Pilot:** Das Portal speichert alles im Browser des Geräts. Kundenlinks anlegen und Codes einfügen deshalb immer im selben Browser auf demselben Gerät, zum Beispiel am Büro-PC.

## Schritt 4: Impressum und Datenschutz ausfüllen

Pflicht, bevor du die Adresse an Kunden oder Betriebe gibst. In `web/impressum/index.html` und `web/datenschutz/index.html` sind alle offenen Angaben orange markiert: Name oder Firma, Anschrift, E-Mail, Telefon, gegebenenfalls USt-IdNr. und Registereintrag, zuständige Datenschutzbehörde.

Zwei Wege:
- Du schickst mir die Angaben, ich trage sie ein.
- Oder du bearbeitest die Dateien direkt auf GitHub (Datei öffnen, Stift-Symbol, speichern). Cloudflare veröffentlicht danach automatisch.

Beide Texte sind Entwürfe für die Pilotphase. Lass sie vor dem öffentlichen Start rechtlich prüfen.

## Schritt 5: KI-Fotoauswertung einschalten (optional)

1. In der [Anthropic Console](https://console.anthropic.com) anmelden, unter **Billing** ein Zahlungsmittel oder Guthaben hinterlegen und unter **Limits** ein monatliches Ausgabenlimit setzen.
2. Unter **API Keys** einen Schlüssel anlegen, Name zum Beispiel `klopfan-pages`. Der Schlüssel wird nur einmal angezeigt. Er gehört **nicht** ins Repo und nicht in einen Chat.
3. Cloudflare: **Workers & Pages → klopfan → Einstellungen (Settings) → Variablen und Geheimnisse (Variables and Secrets)**, Umgebung **Production**, **Hinzufügen**: Typ **Secret**, Name `ANTHROPIC_API_KEY`, Wert einfügen, speichern.
4. Neu bereitstellen, denn Secrets wirken erst ab dem nächsten Deployment: **Deployments**, beim letzten Eintrag **Erneut versuchen** (Retry deployment).
5. Prüfen: `https://…pages.dev/api/ki` zeigt `{"bereit":true}`.

Was dann passiert: Vor dem ersten Foto fragt die App um Einwilligung. Erst danach geht eine verkleinerte Kopie des Fotos über `/api/ki` an Anthropic. Pro Foto sind es zwei Anfragen (Aufbau des Fensters, Fakten fürs Angebot). Die Aufträge an die KI liegen auf dem Server (`functions/api/ki.js`), der Zugang wertet also nur Fensterfotos aus. Eine eingebaute Bremse erlaubt 40 Anfragen je 10 Minuten und IP-Adresse.

Optional:
- Andere Modelle über die Variablen `KI_MODELL_GENAU` und `KI_MODELL_SCHNELL` (Standard: `claude-sonnet-5-5` und `claude-haiku-5-5`). Aktuelle Modellnamen: [docs.claude.com](https://docs.claude.com/en/docs/about-claude/models/overview).
- Zusätzlicher Schutz bei Cloudflare unter **Security → WAF → Rate limiting rules**: Pfad `/api/ki`, zum Beispiel 20 Anfragen in 10 Sekunden je IP, Aktion „Block“.

Datenschutz: Anthropic verarbeitet die Fotos dann in deinem Auftrag. Prüf, dass der Auftragsverarbeitungsvertrag (DPA) von Anthropic für dein Konto gilt; Abschnitt 4 der Datenschutzerklärung beschreibt die Verarbeitung.

## Schritt 6: Eigene Domain (wenn der Name feststeht)

Vorher den Namen prüfen: kurz ins Markenregister schauen ([DPMA](https://register.dpma.de), [EUIPO](https://euipo.europa.eu/eSearch/)), vor allem für Software, Vermittlung und Handwerksleistungen (Klassen 9, 35, 37 und 42). Eine eigene Marke „Klopfan“ samt Logo anzumelden schützt dich, wenn später weitere Gewerke dazukommen. Ein neuer Name ist technisch schnell gemacht: `python3 scripts/marke-umbenennen.py NeuerName`.

1. Domain kaufen (zum Beispiel `klopfan.de`) bei einem Anbieter deiner Wahl.
2. In Cloudflare **Domain hinzufügen** (Add a domain), kostenlosen Tarif wählen. Cloudflare nennt zwei Nameserver. Diese beim Domain-Anbieter eintragen; das wirkt nach Minuten bis Stunden.
3. **Workers & Pages → klopfan → Benutzerdefinierte Domains (Custom domains) → Domain einrichten**: `klopfan.de` und `www.klopfan.de` eintragen. Cloudflare legt die DNS-Einträge an, HTTPS kommt automatisch.

Für die Domain ohne `www` verlangt Cloudflare Pages, dass sie über die Cloudflare-Nameserver läuft. Nur `www.` ginge auch per CNAME-Eintrag beim bisherigen Anbieter.

Kundenlinks passen sich von selbst an: Sie zeigen immer auf die Adresse, unter der das Portal geöffnet wurde.

**Repo umbenennen (optional, am besten vor Schritt 2):** GitHub → Repo `fenstero` → Settings → Repository name `klopfan`. GitHub leitet die alte Adresse weiter.

## Später: öffentlicher Start

- **`pilot: true` in `web/config.js` erst abschalten, wenn Stufe 2 läuft.** Ohne Backend würde die App sonst wieder „Gesendet“ anzeigen, obwohl nichts übertragen wurde, und eine Bezahlseite ohne echte Zahlung.
- Suchmaschinen freigeben: in `web/_headers` die Zeile `X-Robots-Tag` entfernen, `web/robots.txt` auf `Allow: /` stellen und in den HTML-Dateien `<meta name="robots" …>` löschen.

## Stufe 2: echtes Backend (Überblick)

- **Supabase**, Region Frankfurt: Konten für Betriebe und Hauseigentümer, Projekte, Kundenlinks, Aufmaße samt Fotos, Marktplatz, Freigaben, Prüfung der Betriebe (Admin).
- **Automatische Übertragung**: Die App schickt das Aufmaß direkt an den Betrieb, der Code-Umweg entfällt.
- **Stripe**: SEPA-Lastschrift und Karte für Betriebe, Checkout für die Kundendatei. Zuerst im Testmodus.
- **E-Mails** für Benachrichtigungen.
- **Recht**: Nutzungsbedingungen, erweiterte Datenschutzerklärung, Auftragsverarbeitungsverträge (Supabase, Stripe), Widerrufsbelehrung für die Kundendatei.

## Sicherheit

- Geheime Schlüssel nur als **Secret** bei Cloudflare, niemals in Dateien im Repo.
- Das Repo ist öffentlich. Das ist in Ordnung, weil keine Geheimnisse darin stehen und der Code einer Website ohnehin im Browser sichtbar ist. Lieber privat: GitHub → Settings → Change visibility; Cloudflare Pages funktioniert auch mit privaten Repos.
- Die Website lädt nichts von fremden Servern (Schriften und Bibliotheken liegen in `web/`) und setzt strenge Sicherheits-Kopfzeilen (`web/_headers`).

## Lokal ausprobieren (für Entwickler)

```bash
KI_ATTRAPPE=1 node scripts/dev-server.mjs     # http://localhost:8788, KI mit festen Testantworten
node scripts/pruefen.mjs                      # Browser-Prüfung, braucht das Paket playwright-core
```

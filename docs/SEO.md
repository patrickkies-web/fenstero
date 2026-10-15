# Auffindbarkeit: Suchmaschinen und KI-Assistenten

Ziel: Wer Google, ChatGPT, Claude, Perplexity oder Copilot fragt, wie man Fenster ausmisst, was auf ein Aufmaßblatt gehört oder wie ein Fensterbauer zu einem Aufmaß ohne Anfahrt kommt, soll auf eeziframes stoßen, als Quelle zitiert und empfohlen werden.

**Stand:** alles umgesetzt und geprüft (Abschnitt 10 der Prüfsuite), aber **noch nicht freigegeben**. In der Pilotphase sperrt `robots.txt` alles und jede Seite trägt `X-Robots-Tag: noindex`. Freigabe mit der Variablen `INDEXIERUNG=1` bei Cloudflare, erst wenn Impressum und Datenschutz vollständig sind (siehe unten).

Code: `functions/seo.js` (robots.txt, sitemap.xml, llms.txt, Kopfzeilen der Seiten), `worker.js`, `wrangler.jsonc` (`run_worker_first`), die Seiten in `web/ratgeber/`, `web/fuer-fensterbauer/`, die Textfassung in `web/index.html` und `web/app/index.html`, Gestaltung `web/assets/ratgeber.css`.

## Was KI-Assistenten brauchen, um eine Seite zu empfehlen

| Befund | Folgerung für eeziframes | Quelle |
|---|---|---|
| ChatGPT-Suche findet Seiten über den Crawler **OAI-SearchBot**; wer ihn sperrt, erscheint nicht in den Antworten. GPTBot (Training) und ChatGPT-User (Abruf auf Wunsch eines Nutzers) sind davon getrennt. Änderungen an robots.txt wirken nach etwa 24 Stunden. | OAI-SearchBot und ChatGPT-User ausdrücklich erlaubt | [OpenAI: Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots) |
| Claude nutzt **Claude-SearchBot** (Suchindex) und **Claude-User** (Abruf für eine Frage); wer sie sperrt, wird in Claudes Suche seltener und ungenauer gezeigt. ClaudeBot sammelt Trainingsdaten. | Claude-SearchBot und Claude-User ausdrücklich erlaubt | [Anthropic: Does Anthropic crawl data from the web?](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Perplexity verlinkt Seiten über **PerplexityBot**; Perplexity-User ruft Seiten für eine konkrete Frage ab. | beide ausdrücklich erlaubt | [Perplexity: Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers.md) |
| **Keiner der großen KI-Crawler führt JavaScript aus** (OpenAI, Anthropic, Perplexity); nur Googles Crawler rendert. Wichtiger Inhalt muss im ersten HTML stehen. | Die App rendert im Browser, deshalb haben Startseite und App eine Textfassung im HTML, und alle Ratgeberseiten sind reines HTML | [Vercel: The rise of the AI crawler, 17.12.2024](https://vercel.com/blog/the-rise-of-the-ai-crawler) |
| Für Googles KI-Übersichten und den KI-Modus gibt es **keine Sonderregeln**: Die Seite muss indexiert sein und mit Snippet erscheinen dürfen; keine eigenen Dateien und kein besonderes Schema nötig. Empfohlen: Crawling erlauben, interne Links, Inhalt als Text, strukturierte Daten passend zum sichtbaren Text, Search Console. | Grundlagen sauber: Indexierung, Titel, Beschreibung, interne Links, JSON-LD nur für Sichtbares | [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) |
| In der GEO-Studie (KDD 2024) steigerten **Zitate, Statistiken und Quellenangaben** die Sichtbarkeit in generierten Antworten um bis zu rund 40 %; **Keyword-Stuffing schadete** (rund 8 % schlechter). | Jede Zahl mit Quelle und Datum, kurze Antwort zuerst, keine Wortwiederholungen | [Aggarwal u. a.: GEO, Generative Engine Optimization](https://arxiv.org/abs/2311.09735) |
| Microsoft (Bing, Copilot): KI-Assistenten lesen Seiten in Stücken; helfen tun klare Überschriften, Frage-Antwort-Paare, Listen und Tabellen, knappe, für sich verständliche Sätze, Schema-Markup; die SEO-Grundlagen bleiben die Basis. | Aufbau aller Seiten: „Kurz gesagt“, Schritte, Tabellen, Fragen und Antworten | [Microsoft Advertising: Optimizing your content for inclusion in AI search answers, 08.10.2025](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) |
| **llms.txt** ist ein Vorschlag (Jeremy Howard, 2024): eine Markdown-Datei im Wurzelverzeichnis mit Kurzfassung und Links für Sprachmodelle. Google braucht sie ausdrücklich nicht. | als kleine Zugabe vorhanden, dynamisch mit Preisen aus den Variablen | [llmstxt.org](https://llmstxt.org/) |

Dazu der Rahmen, der sich nicht technisch lösen lässt: KI-Assistenten empfehlen, was sie aus mehreren Quellen kennen. Erwähnungen auf anderen Seiten (Fensterbauer, Verbände, Vergleichsportale, Presse) und echte Bewertungen wiegen schwer; dafür sorgt der Abschnitt „Nach der Freigabe“.

## Suchbegriffe in Deutschland

Erhoben über die Vorschläge der Google-Suche (Deutschland, deutsch), Reihenfolge wie von Google vorgeschlagen, Stand Oktober 2026. Absolute Suchvolumen liefern erst Search Console oder Keyword-Planer nach der Freigabe.

| Thema | Suchbegriffe | Seite |
|---|---|---|
| Ausmessen (Hauptbegriff) | fenster ausmessen, fenster ausmessen altbau, fenster ausmessen anleitung, fenster ausmessen für neue fenster, fenster ausmessen für austausch, fenster ausmessen innen oder außen, fenster ausmessen mit aufsatzrollladen, alte fenster ausmessen, fenster messen, aufmaß fenster, aufmaß fenster altbau, maueröffnung fenster | `/ratgeber/fenster-ausmessen/` |
| Vorlage | aufmaßblatt fenster, aufmaßblatt fenster pdf, aufmaßblatt vorlage pdf, aufmaßblatt pdf kostenlos, fenster ausmessen vorlage, fenster ausmessen pdf, fenster ausmessen tabelle, aufmaß fenster vorlage pdf | `/ratgeber/aufmassblatt-fenster/` |
| App | fenster ausmessen app, fenster messen app, aufmaß app fenster, aufmaß app kostenlos, aufmaß app iphone, hebeschiebetür ausmessen | `/app/`, `/` |
| Austausch, Kosten, Förderung | fenster austauschen, fenster austauschen kosten, fenster austauschen förderung, fenster austauschen dauer, fensteraustausch, neue fenster kosten, neue fenster kosten mit einbau, neue fenster kosten einfamilienhaus, neue fenster förderung, fenster angebot einholen, fenster angebot vergleichen | `/ratgeber/fenster-austauschen/` |
| Fensterbauer (B2B) | digitales aufmaß, digitales aufmaß app, digitales aufmaß handwerk, digitales aufmaß fenster, aufmaß software, aufmaß software kostenlos, fenster aufmaß software freeware, fenster angebot software | `/fuer-fensterbauer/` |

Nicht besetzt, weil nicht unser Thema: „fensterbauer in der nähe“ (lokale Suche, gehört den Betrieben) und Normmaße („fenstermaße standard“, „fenstermaße tabelle“): Kandidaten für eine spätere Ratgeberseite.

Regeln für Texte: Suchbegriff vorn im Titel und im h1, Marke am Ende des Titels; Titel bis 75 Zeichen, Beschreibung 70 bis 170 Zeichen (prüft die Suite); „ausmessen“ statt „aufmessen“, wo Hauseigentümer angesprochen sind; das Wortspiel „eezi“ bleibt in Vorschautexten, Hero und Augenbrauen.

## Was umgesetzt ist

**Seiten aus reinem HTML** (lesbar ohne JavaScript, für Menschen und Crawler gleich):

| Seite | Inhalt | Strukturierte Daten |
|---|---|---|
| `/ratgeber/fenster-ausmessen/` | Anleitung in sechs Schritten, Messpunkte, innen oder außen, Altbau, Bestellmaß, Fehler, Fragen | Article, HowTo, FAQPage, BreadcrumbList |
| `/ratgeber/aufmassblatt-fenster/` | was aufs Aufmaßblatt gehört, Vorlage für drei Fenster (druckt allein auf eine A4-Seite), App-PDF | Article, FAQPage, BreadcrumbList |
| `/ratgeber/fenster-austauschen/` | Ablauf, Kosten pro Fenster (BKI 2026, VFF/BF 2023), Förderung 2026 (BAFA, § 35c), Checkliste fürs Angebot, Dauer | Article, HowTo, FAQPage, BreadcrumbList |
| `/fuer-fensterbauer/` | Ablauf, Inhalt des Aufmaßes, Zahlen zum Handwerk, Preise, Datenschutz (Sie-Form) | SoftwareApplication mit Angeboten, FAQPage, BreadcrumbList |
| `/ratgeber/` | Übersicht | CollectionPage, BreadcrumbList |

Aufbau jeder Seite: zuerst „Kurz gesagt“ mit der Antwort, dann Schritte, Tabellen (am Telefon als Karten) und Fragen; jede Zahl mit nummerierter Quelle, Quellenliste mit Datum, „Stand“ am Ende. Strukturierte Daten enthalten nur, was sichtbar ist; keine Bewertungen, solange es keine echten gibt.

**Startseite und App:** Im HTML steht innerhalb von `#app` eine Textfassung (`.vorab`) mit h1, Erklärung, Fakten „auf einen Blick“, Preisen, Fragen und Links. `gemeinsam.js` setzt sofort die Klasse `js` auf `<html>`, `.js .vorab` ist verborgen, und beim ersten `render()` ersetzt die App den Inhalt. Wer kein JavaScript ausführt (KI-Crawler), liest die Textfassung; Google rendert und sieht die App, deren Inhalt derselbe ist. Titel und Beschreibungen beginnen mit dem Suchbegriff. Auf der Startseite ist „Fenster ausmessen. Selbst. eezi.“ das einzige h1 (die Kopfzeile hat dort kein h1).

**Technik** (`functions/seo.js`, läuft im Worker und im lokalen Testserver):
- `robots.txt` aus dem Worker: Pilotphase `Disallow: /`; mit Freigabe alles erlaubt außer `/api/`, die KI-Suchen namentlich, Verweis auf die Sitemap. Trainings-Crawler (GPTBot, ClaudeBot, Google-Extended) sind über `User-agent: *` erlaubt, damit künftige Modelle eeziframes kennen; wer das nicht will, sperrt sie in `robots()` einzeln.
- `sitemap.xml` mit allen Seiten aus `SEITEN` (nur mit Freigabe), `lastmod` aus `STAND`.
- `llms.txt` mit Kurzfassung, Fakten, Preisen aus den Variablen und Links.
- Kopfzeilen jeder Seite: Canonical als `Link`-Kopfzeile (Hauptadresse aus `KANONISCH`, sonst die aufgerufene Domain), Sicherheitskopfzeilen wie in `web/_headers` (der Worker setzt sie selbst, weil Cloudflare `_headers` auf Antworten des Workers nicht verlässlich anwendet), `X-Robots-Tag: noindex` nur in der Pilotphase. Die Meta-Tags `robots` in den Seiten sind entfernt (sie hätten die Freigabe blockiert); die Fehlerseite behält ihres.
- Logo und Icon ohne `noindex` (`! X-Robots-Tag` in `_headers`), damit Google das Logo aus den strukturierten Daten zeigen darf; Skripte und Schriften bleiben `noindex`.
- Interne Links: Fußzeile des Portals („Aufmaß-App für Fensterbauer“, „Ratgeber“), Startseite der App („Anleitung: Fenster ausmessen“), Direktlink `/#tour` für die Tour.

## Freigabe

1. Impressum und Datenschutz vollständig ausfüllen (orange Platzhalter in `web/impressum/` und `web/datenschutz/`) und prüfen lassen. Eine öffentliche, auffindbare Website braucht ein vollständiges Impressum (§ 5 DDG).
2. Cloudflare → Workers & Pages → `fenstero` → Einstellungen → Variablen und Geheimnisse: `INDEXIERUNG` = `1` (Typ Text). Laufen mehrere Domains auf den Worker (z. B. fensterino.com und eeziframes.com): `KANONISCH` = `https://<hauptdomain>`, damit alle Canonicals auf eine Adresse zeigen.
3. Prüfen: `https://<domain>/robots.txt` (Allow, Sitemap-Zeile), `/sitemap.xml` (9 Adressen), `/llms.txt`; eine Seite im Browser, Entwicklerwerkzeuge → Netzwerk: kein `X-Robots-Tag`, `Link: <…>; rel="canonical"`.

Zurück in die Pilotphase: Variable löschen. Ohne Code-Änderung, wirksam mit dem nächsten Aufruf.

## Nach der Freigabe (außerhalb des Codes)

1. **Google Search Console:** Domain-Property anlegen und per DNS-Eintrag bestätigen, `sitemap.xml` einreichen, die fünf Hauptseiten über die URL-Prüfung zur Indexierung anmelden. Danach monatlich: Suchanfragen, Klicks, Seiten mit Problemen.
2. **Bing Webmaster Tools:** Website aus der Search Console übernehmen, Sitemap einreichen. Bing ist die Grundlage von Copilot; der Bericht „AI Performance“ zeigt, wo die Seite in KI-Antworten auftaucht ([Bing Webmaster Blog, 02/2026](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)).
3. **Erwähnungen:** Pilotbetriebe bitten, auf ihrer Website auf eeziframes zu verlinken („Fenster selbst ausmessen mit eeziframes“); Einträge in Software-Vergleichen fürs Handwerk; Fachpresse und Innungen. Überall dieselben Fakten: Name klein, „Aufmaß-App für Fenster“, Preise wie auf der Seite.
4. **Bewertungen:** echte Bewertungen von Kunden und Betrieben sammeln, sobald es sie gibt; erst dann Bewertungs-Markup.
5. **Aktualität:** Förderung (BAFA, § 35c) und Kosten mindestens vierteljährlich prüfen; bei Änderungen Text, Quelle mit Datum, `dateModified` im JSON-LD, „Stand“ auf der Seite und `STAND` in `functions/seo.js` anpassen.
6. **Beobachten:** einmal im Monat dieselben Fragen in ChatGPT, Claude, Perplexity und Google stellen („Wie messe ich Fenster für neue Fenster aus?“, „Aufmaßblatt Fenster Vorlage“, „Aufmaß-App für Fensterbauer“) und notieren, ob eeziframes genannt oder verlinkt wird.

## Pflege

- **Neue Seite:** `web/<pfad>/index.html` im Aufbau der Ratgeberseiten, Eintrag in `SEITEN` (`functions/seo.js`); bei einem neuen Pfad oberster Ebene auch `istSeite()` und `run_worker_first` in `wrangler.jsonc`. Die Suite meldet, wenn eines fehlt.
- **Preise:** Die statischen Seiten nennen die Preise aus `web/config.js` (7,99 €, 9 €, 49 €, 79 €). Werden sie über die Variablen (`PREIS_…`) geändert, auch die Seiten anpassen; die Suite vergleicht Seiten und `config.js`. `llms.txt` liest die Variablen selbst.
- **Kopfzeilen:** Änderungen an der Content-Security-Policy in `web/_headers` und in `SICHERHEIT` (`functions/seo.js`) gleich machen; die Suite vergleicht beides.

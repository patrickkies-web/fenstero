# Konfigurator-Instanzen in drei Paketen

Jeder Fensteranbieter bekommt seinen eigenen Fenster-Konfigurator auf seiner eigenen Domain (z. B. `brandt-fenster.app`), in einem von drei Paketen: **Essential**, **Plus**, **Signature**. Alle Domains hängen am selben Worker wie eeziframes.com; je Kunde steht alles in der Datenbank und wird in der Zentrale gepflegt, nie im Code. eeziframes.com bleibt für das Aufmaß der Hauseigentümer, wie es ist, verkauft die Pakete und führt das Kundenkonto der Fensteranbieter (`/partner/`). Bestehende Betriebskonten und Kundenlinks laufen unverändert weiter.

Diese Datei ist der Vertrag zwischen den Bausträngen (Teil 1, vom Fundament S0) und wird um den Betrieb ergänzt (Teil 2, Strang F: Einrichtung, Status, Fristen, Fehlerbilder). Grundlage ist der Bauplan vom 22.10.2026 (Entscheidungen E1–E30).

## Teil 1: Verträge

### Grundregeln

- **Altbestand ist heilig.** `scripts/pruefen.mjs` Abschnitte 1–22 bleiben in jedem Strang grün; eeziframes.com (B2C-Aufmaß, Kauf des Aufmaßblatts, Bestandsbetriebe mit Kundenlinks) verhält sich unverändert. Jeder Instanz-Zweig im Server hängt an `ctx.instanz` bzw. `daten.instanz`, jeder Zweig in App und Portal an `KONFIG.instanz`.
- **Eine Stelle je Wahrheit.** Merkmale, Preise und Fristen je Paket nur in `web/assets/pakete.js`; Zustände, Übergänge, globale Fristen und Grenzen, Feldregeln der Bestellung nur in `web/assets/instanzregeln.js`. Kein Vergleich mit einem Paketnamen (`paket === …`) außerhalb von `pakete.js` (Prüfung 23); Code fragt Merkmale ab (`m.dashboard`, `m.logo`, …). Ein Paket setzt nie den Tarif eines Kontos: Instanzkonten haben `konto: 'instanz'`.
- **Gefahrlos mergebar.** Alles Neue darf in `main`, bevor Preise, Rechtstexte und Cloudflare/Stripe/Resend eingerichtet sind:
  - Ohne Variable `PAKETE_OFFEN=1` zeigt die Verkaufsseite die Pakete mit „vorläufige Preise“ und statt „Paket bestellen“ ein Anfrageformular („Bestellung bald möglich“); die Paket-Kasse bleibt im Live-Modus von Stripe zu. Im Test- und Attrappenmodus ist sie offen, damit sich alles prüfen lässt. Die einzige Abfrage dafür ist `Instanzregeln.verkauf({ offen: k.paketeOffen, live: live(k), bereit })` → `{ offen, vorlaeufig, bestellen, kasse }` (`bereit`: Paketbedingungen ohne Platzhalter, `paketVerkaufStand()` in `functions/api/recht.js`).
  - `wrangler.jsonc` hat nur Bindungen, die ohne Vorbereitung im Dashboard deployen (Rate Limiting); KV `INSTANZEN` und Queue `EINGANG` kommen erst nach der Einrichtung mit einem eigenen Commit, der Code läuft ohne sie. **Nie `routes` oder `custom_domain` in `wrangler.jsonc`** (die Custom Domains der Instanzen würden überschrieben).
  - Keine echten Secrets im Repo.
- **Uhr.** Fristen immer mit `jetztAus(env)` bzw. `k.jetzt` (functions/api/umgebung.js) rechnen, nicht mit `Date.now()`: Die Prüfung stellt die Uhr über `JETZT` vor (`h.uhr(tage)`).
- **Texte.** Deutsch wie im Repo; Endkunde in der App „Du“ bzw. wie die Anrede des Betriebs (`du`), Betrieb und Website „Sie“. Gestaltung nach `docs/GESTALTUNG.md`. Auf Signature-Instanzen erscheint „eeziframes“ nirgends (Seiten, Mails, PDF, Titel, Icons).
- **Prüfungen.** Jeder Strang schreibt seine Prüfungen in `scripts/pruefen-instanzen/<abschnitt>.mjs` (siehe unten, „Prüfung“).

### Wellen und Dateibesitz

| Schritt | Strang | Dateien (nur dieser Strang ändert sie) |
|---|---|---|
| 0 | **S0 Fundament** | `supabase/schema.sql` (Block Instanzen), `web/assets/pakete.js`, `web/assets/instanzregeln.js`, `functions/api/speicher.js` (Instanz-Funktionen), `functions/api/sitzung.js`, `functions/api/bremse.js`, `functions/api/post.js`, `functions/api/fotos.js` (`ablage`, `FOTO_ID`), `functions/api/router.js`, `functions/seo.js` (Haken), `functions/api/umgebung.js` (`paketeOffen`, `sitzung`, `jetzt`), `wrangler.jsonc`, `scripts/dev-server.mjs`, `scripts/pruefen.mjs` (Lader), `scripts/pruefen-instanzen/hilfe.mjs`, `scripts/pruefen-instanzen/23-fundament.mjs`, `docs/INSTANZEN.md` (Teil 1) |
| Welle 1 | **A Server-Kern** | `worker.js`; `functions/instanz/mandant.js`, `seiten.js`, `adapter.js`, `verwalten.js`; `functions/api/eingang.js`, `instanz-api.js`, `blatt-server.js`; `functions/api/konten.js` (nur `GET /api/link/:code`, `POST …/fortschritt`, `POST /api/aufmass`, `abrechnungslauf`); `functions/api/entwurf.js`; `functions/api/fotos.js` (Link-Route); `functions/api/ki.js`; `functions/api/benachrichtigung.js`; `functions/api/statistik.js`; `functions/api/umgebung.js`; `web/assets/modell.js` (nur Abrechnung und `aufmassText`); `web/assets/blatt.js`, `blatt-schrift.js`; `scripts/pruefen-instanzen/23.mjs`, `24.mjs` |
| Welle 1 | **D Kundenkonto, Bestellung, Stripe** | `functions/api/partner.js`, `bestellung.js`; `functions/api/stripe.js` (Paketfunktionen anhängen); `functions/api/zahlung.js` (Weiche vor dem B2C-Zweig); `functions/api/recht.js` (`PAKET_STAND`, `paketVerkaufStand`); `web/partner/index.html`, `web/assets/partner.js`, `partner.css`; `web/_headers` (`/partner/*` no-store); `scripts/stripe-attrappe.mjs`; `scripts/pruefen-instanzen/27.mjs` |
| Welle 2 | **B Konfigurator-App** | `web/assets/app.js`, `app.css`, `web/app/index.html` (nur neutrale Haken), `web/assets/einladung.js`, `einladung.css`, `gemeinsam.js`, `gemeinsam.css`; `scripts/pruefen-instanzen/25.mjs` |
| Welle 2 | **C Zentrale** | `functions/api/zentrale-instanzen.js`, `zentrale-bestellungen.js`, `cloudflare.js`; `functions/api/zentrale.js` (Exporte und genannte Stellen); `web/assets/zentrale.js`, `zentrale.css`, `web/zentrale/index.html`; `scripts/cloudflare-attrappe.mjs`; `scripts/pruefen-instanzen/26.mjs` |
| Welle 3 | **E Signature-Dashboard** | `functions/api/dashboard.js`; `functions/api/auth.js` (`admin` mit Body, `codeErzeugen`, `nutzerAnlegen`); `functions/api/konten.js` (Haken für Instanz-Hosts); `functions/api/fotos.js` (nur `GET /api/konto/foto`); `web/betrieb/index.html`; `web/assets/portal.js`, `portal.css`; `scripts/pruefen-instanzen/28.mjs` |
| Welle 3 | **F Verkaufsseite, Recht, Doku** | `web/fuer-fensterbauer/index.html`; `functions/pakete-seite.js`; `web/konfigurator-bedingungen/index.html` und PDFs; `scripts/bedingungen-pdf.mjs`; `web/datenschutz/index.html` (Abschnitt Kundenkonto); `functions/instanz/recht.js`; `scripts/pruefen.mjs` (nur Abschnitt 10); README.md; `docs/INSTANZEN.md` (Teil 2), `docs/BESTELLUNG.md`, `ONLINE-STELLEN.md`, `ZENTRALE.md`, `GESTALTUNG.md`, `SEO.md`; `scripts/pruefen-instanzen/29.mjs` |
| Schluss | **I Integrator** | Abschnitt 30 (`scripts/pruefen-instanzen/30.mjs`), Vollsuite 1–30, Bildschirmfotos |

Muss ein Strang eine fremde Datei ändern, liefert er die Änderung als Vorgabe an den Besitzer. Ausnahme aus S0: `worker.js` liefert schon die Fehlerseite selbst (weil `not_found_handling` entfällt) und setzt auf `/zentrale*`, `/partner*`, `/betrieb*` Sicherheitskopfzeilen, `noindex` und `no-store`; Strang A baut darauf die Host-Weiche.

### Datenmodell (supabase/schema.sql)

Neue Tabellen: `partner`, `bestellungen` (Nummer `B-JJJJ-NNNN` aus der Folge `bestellung_nr`; Zahlung über `zahlung->>session` und `zahlung->>pi` eindeutig), `partner_nachrichten`, `instanzen`, `instanz_hosts` (Host klein, ohne `www.`, ohne Port; eine Hauptdomain je Instanz), `anfragen` (Code 10 Zeichen, `(betrieb, lid)` eindeutig; `daten` = Link-Objekt wie `betriebe.daten.links[]`). Funktionen: `instanz_nr(uuid)` (P-JJJJ-NNN je Instanz und Jahr, atomar), `instanz_fuer_host(text)` (ohne `entwurf` und `zugang`), `instanz_anlegen(jsonb)` (Instanz und Betriebszeile atomar; Betriebszeile mit Platzhalter `i-<id>@instanz.invalid`, `daten.konto = 'instanz'`, `daten.instanz.id`), `anfragen_kopf(uuid, timestamptz)` (Projektliste ohne `aufmass` und `vorher`), `eeziframes_budget(date, text, int)` (Zähler für Budgets, atomar). Alle Tabellen mit RLS, nur `service_role`. Bestehende Tabellen und Daten werden nicht migriert.

`instanzen.version` steigt bei jeder Änderung (Schutz vor gleichzeitigem Schreiben und Cache-Schlüssel, `/marke/<version>/…` und `KONFIG.instanz.v`). Bilder einer veröffentlichten Marke liegen im Bucket `marke` unter `instanz/<id>/<marke.v>/<name>`; `marke.v` zählt nur die Veröffentlichungen. `id8` einer Instanz = die ersten 8 Hex-Zeichen der `id` ohne Bindestriche.

Formen in JSON-Spalten:

```js
instanzen.marke   { name, titel, beschreibung, farbe, v, bilder: { logo, icon32, icon180, icon512, og, start: [], ap }, start: { kicker, ueberschrift, text } }
instanzen.eingang { mails: [{ mail, bestaetigt: ISO|null, eingeladen: ISO }], absendername }
instanzen.zugang  [{ mail, uid, name, rolle, bestaetigt, zuletzt, aus }]
instanzen.recht   { firma, rechtsform, vertretung, strasse, plz, ort, land, tel, mail, register, ust, kammer, beruf, bundesland, stand }
anfragen.versand  { runde, status: offen|gesendet|zugestellt|bounce|beschwerde|fehler, versuche, naechster: ISO, id, bytes, ohneFotos }
bestellungen.preise { monat, einrichtung, mwst, name, stand }   (Pakete.preisStand)
```

### Speicher (functions/api/speicher.js, Supabase und Attrappe)

Fehlt eine Tabelle, liefern lesende Funktionen `undefined`, schreibende werfen 503. `…Aendern(id, fn)`: `fn(z)` ändert die Kopie `z`; `false` = nichts schreiben; sonst Rückgabe von `fn` oder, ohne Rückgabe, die neue Zeile; Versionszähler, bis zu vier Versuche. Konflikte mit eindeutigen Schlüsseln: `ApiFehler` 409 mit `extra.grund` (`slug_vergeben`, `host_vergeben`, `haupt_doppelt`, `anfrage_vorhanden`, `partner_vorhanden`, `zahlung_doppelt`).

- Instanzen: `instanzFuerHost(host)`, `instanzHolen(id)`, `instanzVonBetrieb(betrieb)`, `instanzAnlegen(p)` → id (`p: { slug, name, plz, paket, partner, bestellung, eingang, zugang, recht, entwurf, demo, betriebDaten }`), `instanzAendern(id, fn)`, `instanzenAlle({ status })`, `instanzNr(id)`, `instanzLoeschen(id)` (samt Hosts, Anfragen, Zwischenständen und Betriebszeile).
- Hosts: `hostsVon(instanz)`, `hostAnlegen(row)`, `hostAendern(host, patch)`, `hostLoeschen(host)`.
- Anfragen: `anfrageHolen(code)`, `anfrageNachLid(betrieb, lid)`, `anfrageAnlegen(row)`, `anfrageAendern(code, fn)`, `anfragenVonBetrieb(betrieb, { kopf, seit })`, `anfragenStand(betrieb)` → `{ stand, anzahl }`, `anfrageNachMailId(id)`, `anfragenFaellig(jetzt)` (Versand offen und fällig, höchstens 50), `anfragenZuLoeschen(jetzt)`, `anfrageLoeschen(code)`.
- Zwischenstände: `entwurfAnlegen(code, betrieb, meta)` legt nur neu an (Code vergeben: `null`), dazu wie bisher `entwurfHolen`, `entwurfAendern`, `entwuerfeVonBetrieb`.
- Partner: `partnerHolen`, `partnerNachAuth`, `partnerNachMail`, `partnerAnlegen`, `partnerAendern(id, fn)`, `partnerFelder(id, patch)`, `partnerAlle`.
- Bestellungen: `bestellungHolen`, `bestellungenVonPartner`, `bestellungAnlegen`, `bestellungAendern(id, fn)` (Verlauf höchstens 200 Einträge), `bestellungNachSession`, `bestellungNachPi`, `bestellungNachAbo`, `bestellungenListe({ status, seit })`, `bestellungLoeschen`.
- Nachrichten: `nachrichtAnlegen`, `nachrichtenVon(pid, { bestellung, anzahl })`, `nachrichtenGelesen(pid, empfaenger)`, `rueckrufeOffen()`, `nachrichtAendern(id, patch)`, `nachrichtenAltLoeschen(pid, bis)`.
- `geschuetzteNutzer()` → Set der Anmeldungen von Partnern und Dashboard-Zugängen (Aufräumen der Zentrale löscht sie nie).
- `zaehlerLesen(tag, schluessel[])`, `zaehlerErhoehen(tag, schluessel, n)` (dauerhafte Zähler in `statistik`).

### Ablagen (functions/api/fotos.js)

`ablage(k, art)` mit `art` = `fotos` (Vorgabe; JPEG, 1 MB; `link/<code>/<id>.jpg`, kleine Fassung `<id>k`), `marke` (PNG, JPEG, WebP, 2 MB; `instanz/<id>/<v>/<name>`), `bestellungen` (PNG, JPEG, WebP, SVG, PDF, 1 MB; `partner/<partner>/<bestellung>/<datei>`), `blatt` (PDF, 10 MB; `instanz/<id>/<code>-<runde>.pdf`). `ablegen(pfad, bytes, typ)` legt nur erlaubte Typen und Größen ab. `FOTO_ID = /^b[a-z0-9]{12,24}k?$/`.

### ctx.instanz (functions/instanz/mandant.js, Strang A)

Gesetzt in `worker.js` und an `api(request, env, ctx0, inst)` übergeben; auf der Hauptdomain `null`.

```js
{ id, id8, slug, betrieb, host, haupthost, status, paket, m /* Pakete.merkmale(paket, abweichung) */, version, name, du, plz,
  auftritt /* Einladung.auftritt mit freier Farbe */, marke, recht, eingang: { mails: [nur bestätigte] }, demo, indexierung,
  vorschau /* gültiges __Host-vorschau-Cookie */, kontakt: { tel, mail } }
```

### window.KONFIG auf Instanz-Hosts (/config.js, functions/instanz/seiten.js, Strang A)

Per `JSON.stringify`, `<` als `<`; ohne Preise.

```js
{ marke: name, pilot: false, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/',
  instanz: { id: id8, v: version, host, name, du, status, vorschau, m: Pakete.oeffentlich(m), auftritt,
             start: { kicker, ueberschrift, text, bilder: ['/marke/<v>/start-1.jpg'] }, farbe, akzent, kontakt: { tel, mail },
             logo: '/marke/<v>/logo.png' | '', grenzen: { fenster: 50 } } }
```

### HTTP auf Instanz-Hosts

```
POST /api/instanz/start → { ok, code, betrieb, du, auftritt }        A (Status-Matrix, Bremse RL_START, kein anfragen-Eintrag)
GET  /api/instanz/ping  → { ok, instanz: id8, version }              A, für die Domain-Prüfung (C)
GET  /api/ki?aufgabe=…&code=<10>                                       A (Code Pflicht auf Instanz-Hosts), B ruft so auf
POST /api/link/:code/foto/:id   id = b… oder b…k (kleine Fassung)     A nimmt an, B lädt beide hoch
POST /api/aufmass → { ok, nr, betrieb, runde }                         A
GET  /api/instanz/bestaetigen?t=  (Hauptdomain)                        A: Empfänger- und Zugangsbestätigung (Token Zweck empfaenger)
GET  /api/instanz/fotos/:code?t=                                       A: Originalfotos für Essential/Plus (Token Zweck fotos, 14 Tage)
POST /api/post/webhook  (Hauptdomain)                                  A: Resend, Svix-Signatur
/api/partner/…  (nur Hauptdomain)                                      D; POST /api/partner/frage auch als Formular ohne JavaScript
/api/konto…     (Instanz-Host nur bei m.dashboard)                      E
/api/zentrale/instanzen/…, /api/zentrale/bestellungen/…  (Hauptdomain) C
```

`GET /api/status` auf Instanz-Hosts: `{ ok, daten, ki, post, instanz: true, zahlung: false, konten: false }`, ohne Preise, Einführung, Verkauf, Recht.

### Module mit festen Exportnamen (Stubs ab S0)

```
functions/instanz/mandant.js (A):   hostVon(request), istHaupt(host, env), instanzVon(host, env, ctx), auftritt(inst), cacheVergessen(host)
functions/instanz/seiten.js (A):    ausliefern(request, env, ctx, inst), kopf(html, inst, env), konfigJs(inst), icons(pfad, inst, env), robots(inst), fehlerSeite(status, inst)
functions/instanz/adapter.js (A):   linkAufloesen(ctx, code) → { art: 'alt'|'anfrage'|'virtuell', row, l, anfrage?, entwurf? }, linkAendern(ctx, aufl, fn),
                                    pseudoKonto(daten, l) → { konto: 'instanz', links: [l], book: [], notif: [], abzug, prefs, since } (fertig)
functions/instanz/verwalten.js (A): instanzAnlegen(ctx, p), instanzAendern(ctx, id, fn), instanzStatus(ctx, id, status, grund), hostSetzen(ctx, id, host, o),
                                    hostEntfernen(ctx, id, host), hauptSetzen(ctx, id, host), markeVeroeffentlichen(ctx, id), bildAblegen(ctx, id, name, bytes, typ),
                                    empfaengerEinladen(ctx, id, mail, art), vorschauToken(ctx, id, version), cacheLeeren(ctx, id), instanzDatenLoeschen(ctx, id)
functions/instanz/recht.js (F):     impressumSeite(inst), datenschutzSeite(inst), rechtVollstaendig(recht) → { ok, fehlt }   (Impressum fertig, Datenschutz vorläufig)
functions/api/eingang.js (A):       eingangVerarbeiten(k, sp, code, runde), versandNachholen(k, sp), eingangErneut(ctx, code), probeEingang(ctx, instanzId),
                                    anfragenAufraeumen(k, sp), textPdf(titel, abschnitte), EINGANG (Routen)
functions/api/blatt-server.js (A):  blattFuerEingang(k, inst, z), blattAnfrage(k, inst, z), textPdf(titel, abschnitte)
functions/api/instanz-api.js (A):   INSTANZ_API (Routen)
functions/api/partner.js (D):       PARTNER (Routen)
functions/api/bestellung.js (D):    uebergang(ctx, id, nach, { wer, text }), einrichtungUebernehmen(ctx, session, o), paketObjekt(ev) → bool, paketEreignis(ctx, ev),
                                    aboStarten(ctx, id), paketWechseln(ctx, id, paket, { differenz }), aboSteuern(ctx, id, aktion), bestellungenLauf(k, sp, zd, env), erstatten(ctx, id, o)
functions/api/dashboard.js (E):     kontoVon(ctx), dashboardSicht(ctx, o), mailCode(ctx, mail), einladungenErinnern(k, sp, env), DASHBOARD (Routen)
functions/api/zentrale-instanzen.js (C): ZENTRALE_INSTANZEN (Routen) · functions/api/zentrale-bestellungen.js (C): ZENTRALE_BESTELLUNGEN (Routen)
functions/api/cloudflare.js (C):    cloudflareDienst(k, env), instanzenPruefen(k, sp, env)
functions/pakete-seite.js (F):      paketeSeite(html, url, env), paketeLlms(origin, env), PAKETE_SEITEN (Einträge für die Sitemap)
web/assets/blatt.js (A):            Blatt.pdf({ variante: 'betrieb'|'anfrage', kennzeichnung: 'deutlich'|'dezent'|'keine', marke: { name, logo, farbe, host } })
web/assets/pakete.js, web/assets/instanzregeln.js (S0, fertig)
```

Stubs werfen `ApiFehler` 501 („noch nicht gebaut“), bis ihr Strang sie baut; die Läufe der Cron-Weiche tun bis dahin nichts. Nach Welle 1 sind nur noch die Module von C (`zentrale-instanzen.js`, `zentrale-bestellungen.js`, `cloudflare.js` mit `instanzenPruefen`), E (`dashboard.js` mit `einladungenErinnern`) und F (`pakete-seite.js`, Datenschutz in `functions/instanz/recht.js`) Stubs.

### Stand nach Welle 1 (A und D zusammengeführt)

Zusätzliche Exporte, die C, E und F nutzen dürfen (Namen fest wie oben):

```
functions/instanz/verwalten.js (A):  paketSetzen(ctx, id, paket, grund)   nur von paketWechseln (bestellung.js) aufgerufen; schreibt Protokoll, leert Zwischenspeicher
                                     instanzStatus(ctx, id, status, grund, { bis })   bis: Ende der Pause (höchstens FRISTEN.pauseMaxTage)
                                     profilSetzen(ctx, id, einladung, { ap, tel, mail, abzug }) · empfaengerBestaetigen(ctx, id, mail, art)
functions/instanz/mandant.js (A):    instanzAusZeile(t, host) · farbeVon(inst) → { farbe, akzent } (Kontrast über Instanzregeln.akzent)
functions/api/eingang.js (A):        eingangAnstossen(ctx, code, runde) · instanzKontext(sp, id) (wie ctx.instanz, aus der Datenbank) ·
                                     mailInhalt(k, inst, z, o) · loeschenAbFuer(m, art, jetzt) · absender(k, inst) · rahmenMarke(inst, logoCid)
functions/api/blatt-server.js (A):   blattBauen(k, inst, z, o) → { bytes, … }
functions/api/bestellung.js (D):     paketVon(b) (Paket der Bestellung, nach einem Wechsel abo.paket) · istPaketEreignis(ctx, ev) · dateiAntwort(k, b, did) ·
                                     dateiPfad(b, d) · dateienLoeschen(k, b) · eingangBestaetigen(ctx, b, p) · partnerMail(ctx, p, betreff, inhalt, o) ·
                                     inhaberMail(ctx, betreff, inhalt, antwortAn, o) · schnipsel(host) · herkunft(ctx)
```

Abläufe zwischen den Strängen (vom Integrator im Prozess über `worker.fetch` mit echten Hosts durchgespielt: bestellt → bezahlt → Instanz → Bestätigungslink → Vorschau → Freigabe → live → Anfrage mit PDF → Empfängerwechsel → Paketwechsel → Zahlungsausfall, Pause → Zahlung → Kündigung → Löschung):

- **Instanz aus der Bestellung (C):** `instanzAnlegen(ctx, { slug, paket: paketVon(b), name, partner: b.partner, bestellung: b.id, eingang, zugang, recht, entwurf, betriebDaten })`, danach `bestellungen.instanz` setzen. `instanzAnlegen` schickt die Bestätigungslinks selbst (`einladungen` im Ergebnis).
- **Status:** Der Status einer Instanz mit Bestellung folgt der Bestellung über `uebergang` (`Instanzregeln.instanz.statusFuer`); C ruft `instanzStatus` direkt nur für Instanzen ohne Bestellung (Demo).
- **Paket:** nur `paketWechseln` (bestellung.js) → `paketSetzen` (verwalten.js); `instanzAendern` lehnt eine Paketänderung ab.
- **Vorschau:** `vorschauToken(ctx, id, marke.v)` → `{ token, url, bis }`; C setzt `b.vorschau = { version: marke.v, bis, gesendet, link: url }`. Das Kundenkonto zeigt `link` und gibt genau diese `version` frei; „Live“ verlangt die Freigabe dieser Version oder einen Vermerk.
- **Empfänger:** Das Kundenkonto schreibt neue Adressen unbestätigt an die Instanz und ruft `empfaengerEinladen`; die Bestätigung (`GET /api/instanz/bestaetigen?t=`, Hauptdomain) leert den Zwischenspeicher. Anfragen gehen nur an bestätigte Adressen.
- **Aufräumen (zentrale.js):** Der tägliche Lauf der Zentrale lässt Zwischenstände von Instanzen (`meta.instanz` oder Betriebszeile mit `daten.instanz`) aus, die räumt `anfragenAufraeumen` auf; Anmeldungen aus `geschuetzteNutzer()` (Partner, Dashboard-Zugänge) löscht er nicht (aus C.8 vorgezogen).

### Router (functions/api/router.js)

- `api(request, env, ctx0, inst)`; `ctx.instanz = inst || null`. Die neuen Routen-Objekte stehen vor den bestehenden in `ROUTEN`; bei gleicher Adresse gewinnt der Altbestand.
- `/api/partner…` und `/api/instanz…` brauchen die Datenbank (503 ohne). Formulare ohne JavaScript nimmt der Router für `/api/widerruf` und `/api/partner/frage` an.
- Cron-Weiche: `CRON_ABRECHNUNG = '0 3 1,15 * *'` (Sammelrechnungen, Aufräumen), `CRON_TAEGLICH = '17 4 * * *'` (Aufräumen, Nachholen, `anfragenAufraeumen`, `bestellungenLauf`, `instanzenPruefen`, `einladungenErinnern`, IndexNow), `CRON_ZEHN = '*/10 * * * *'` (nur `versandNachholen`). Ein unbekannter Zeitplan läuft als täglicher Lauf, ohne `cron` läuft alles.
- `GET /api/test/post` (nur Mail-Attrappe): verschickte Mails; mit `?anhaenge=1` samt Anhängen als Base64 (`anhangDaten`).

### Sitzungen und Zweck-Token (functions/api/sitzung.js)

```
sitzungSetzen(ctx, bereich, { sub, mail }) → Set-Cookie     bereich 'partner' (eeziframes.com) | 'betrieb' (Instanz-Host)
sitzungLesen(ctx, bereich, { frisch }) → Sitzung | null       { v, bereich, aud: Host, sub, mail, iat, exp, n, frisch }
sitzungPflicht(ctx, bereich, { frisch }) → Sitzung            sonst 401 { anmelden: true } | 401 { frisch: true } | 403 (fremde Herkunft)
sitzungLoeschen(ctx, bereich) → Set-Cookie
tokenSignieren(k, zweck, daten, sekunden) → Text            Zweck im MAC: vorschau, empfaenger, fotos, …
tokenPruefen(k, zweck, token) → daten | null
```

HMAC-SHA-256 über `SITZUNG_GEHEIMNIS` (mindestens 32 Zeichen; ohne gibt es weder Sitzungen noch Token, nur mit `DATEN_ATTRAPPE=1` ein fester Testwert). Cookie `__Host-partner` bzw. `__Host-betrieb` (HttpOnly, Secure, SameSite=Strict, Path=/, 14 Tage); Chromium nimmt es auch auf `http://*.localhost` an (geprüft). Die Sitzung gilt nur in ihrem Bereich und auf dem Host, der sie ausgestellt hat (`aud`). Schreibende Anfragen mit Sitzung verlangen `Origin` = eigene Herkunft. `frisch`: Anmeldung jünger als 15 Minuten; Geld-Aktionen verlangen das. Kein Supabase-Token im Browser.

### Bremsen und Budgets (functions/api/bremse.js)

`bremse(ctx, name, schluessel)` → `true` (weiter) | `false`: Rate-Limiting-Binding `env.RL_LINK` (60/60 s), `RL_START` (10), `RL_FOTO` (60), `RL_KI` (20), `RL_OTP` (5), `RL_FORM` (5); ohne Binding im Arbeitsspeicher mit denselben Grenzen. `budget(ctx, schluessel, max, { alarm, monat })` → `{ ok, stand, alarm }`: dauerhafter Zähler je Tag (oder Monat) in `statistik` (Schlüssel `budget:<schluessel>`, die Auswertung der Statistik übergeht sie); `alarm` genau einmal beim Erreichen der Alarmgrenze. Beispiele aus dem Bauplan: `budget(ctx, 'inst:<id8>:ki', m.kiMonat * 2, { alarm: m.kiMonat, monat: true })`, `budget(ctx, 'ki:tag', KI_TAG_MAX)`, `budget(ctx, 'otpfehl:<sha256(mail)>', GRENZEN.otpFehlerMailTag)`.

### Post (functions/api/post.js)

`senden({ an (Adresse oder Liste), betreff, html, antwortAn, anhaenge: [{ filename, content (Base64), content_type, content_id }], von: { name, adresse }, idempotenz })` → `{ ok, id }`. Empfänger auf `.invalid` → `{ ok: false, grund: 'invalid' }`. `idempotenz` geht als Kopfzeile `Idempotency-Key` an Resend (Muster `anfrage-<code>-<runde>-<n>`). Die Attrappe merkt sich Empfänger, Absender, Anhänge (Name, Typ, Größe) und Idempotenz. `mailRahmen(titel, inhalt, kontakt, { marke })`: `marke` `null` (eeziframes wie bisher), `{ name, logoCid, dezent: true }` (Logo des Betriebs, Fußzeile „Konfigurator von eeziframes“), `{ name, logoCid }` (ohne eeziframes) oder `'neutral'`.

### Pakete und Regeln (web/assets/pakete.js, web/assets/instanzregeln.js)

`Pakete`: `PAKETE`, `MERKMALE` (Beschriftung für Verkaufsseite und Zentrale), `LISTE`, `merkmale(paket, abweichung)` (eingefroren; Abweichungen nur für bekannte Merkmale, nie Paket, Name, Preis), `oeffentlich(m)` (gestaltung, logo, farbe, fotos, startansicht, kennzeichnung, rechtNennung, kopieKunde, dashboard), `preis(paket)`, `preisText(paket, 'monat'|'einrichtung', mwst)`, `preisStand(paket, mwst)`, `VORLAEUFIG`, `PREIS_STAND`.

`Instanzregeln`: `darf(status, bereich, { vorschau, feld })` (die einzige Abfrage der Status-Matrix; Bereiche `seite, recht, schreiben, link, ki, dashboardLesen, dashboardSchreiben, einladen, export`), `felder()`, `seite(status, { vorschau })` → `{ code, art }`, `anfrageArt()` (`test` in der Vorschau), `FRISTEN`, `GRENZEN`, `bestellung.{ LEISTE, TITEL, ABO_TITEL, UEBERGAENGE, uebergang(von, nach, wer), firma, konfigurator, gestaltung, erreichbarkeit, zustimmung, vollstaendig }` (Feldregeln für Browser und Server), `instanz.{ uebergang, statusFuer }`, `verkauf()`, `host(s, { demo, lokal })`, `hostNorm`, `farbe(hex)` (Kontrast ≥ 4,5:1 auf #161616), `akzent(hex)`, `kontrast`, `BUNDESLAENDER`.

| Status | `/` | Recht | Endkunde schreibt | Link lesen | KI | Dashboard lesen | Dashboard schreiben | Einladen | Export |
|---|---|---|---|---|---|---|---|---|---|
| `einrichtung` | 503 „in Vorbereitung“ | ja | nein | nein | nein | ja | nur Profil | nein | ja |
| `einrichtung` mit Vorschau | ja, Band „Vorschau“ | ja | ja (`art: 'test'`) | ja | ja | ja | nur Profil | nein | ja |
| `aktiv` | ja | ja | ja | ja | ja | ja | ja | ja | ja |
| `pausiert` | 503 mit Kontakt | ja | nein | nein | nein | ja | nur `klaer`, `stage`, `memo`, `seen` | nein | ja |
| `beendet` | 410 | ja | nein | nein | nein | nein | nein | nein | ja |

### Umgebung

Neu in `konfig(env)`: `k.paketeOffen` (`PAKETE_OFFEN=1`), `k.sitzung.geheimnis` (`SITZUNG_GEHEIMNIS`), `k.jetzt` (Zeit der Anfrage, mit `JETZT`). Weitere Variablen der Stränge (bei ihrer Einführung in `umgebung.js` eintragen): `MAIL_ABSENDER_INSTANZ`, `MAIL_ABSENDER_NEUTRAL`, `RESEND_WEBHOOK_SECRET` (A), `INSTANZ_CACHE_MS`, `HAUPT_HOSTS`, `KI_TAG_MAX` (A), `CF_API_TOKEN`, `CF_ACCOUNT_ID` (C). Bindungen: `RL_*` (wrangler.jsonc), später `INSTANZEN` (KV) und `EINGANG` (Queue).

### Prüfung (scripts/pruefen.mjs, Abschnitte 23–30)

Je Abschnitt ein Modul `scripts/pruefen-instanzen/<n>.mjs`, dazu beliebig viele `<n>-<name>.mjs`, die vorher laufen (Abschnitt 23 beginnt mit `23-fundament.mjs` aus S0): `export default async (h) => { … }`. Ein Fehler im Modul zählt als fehlgeschlagene Prüfung. Einzeln: `NUR=23 node scripts/pruefen.mjs` (über `node scripts/mit-server.mjs <port> env PW_PFAD=/opt/node-tools NUR=23 node scripts/pruefen.mjs`).

`h` (`scripts/pruefen-instanzen/hilfe.mjs`) startet einen eigenen Testserver mit `DATEN_ATTRAPPE=1 MAIL_ATTRAPPE=1 KI_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 INSTANZ_CACHE_MS=0` und Zentrale-Passwort und legt die Instanzen `essential.localhost`, `plus.localhost` (Alias `plus-alias.localhost`), `signature.localhost`, `signature2.localhost` an (aktiv, mit bestätigter Eingangsadresse, Rechtsangaben; Signature mit einem Zugang). Chromium löst `*.localhost` selbst auf; API-Prüfungen schicken die Kopfzeile `Host`.

```
h.ok, h.browser, h.neueSeite(ctx, base), h.sauber, h.foto, h.telefon, h.BASE (Server der übrigen Suite)
h.port, h.base(host), h.api(host, pfad, { method, body, headers, cookie, origin }) → { status, headers, text, json, buf, cookies }
h.instanzen.{essential|plus|signature|signature2} = { id, id8, slug, betrieb, paket, status, host }
h.instanz(sel, patch), h.saat({ instanzen }), h.attrappe(), h.post({ anhaenge }), h.zentrale() → { cookie, kopf, api }
h.uhr(tage) / h.uhr(null), h.geplant(cron), h.server(env) (weiterer Testserver, z. B. { QUEUE_ATTRAPPE: '1' } oder { PAKETE_OFFEN: '1' })
```

Der lokale Testserver (`scripts/dev-server.mjs`) schickt jede Anfrage durch `worker.js`, nimmt die Adresse aus der Kopfzeile `Host`, liefert über `env.ASSETS` bei fehlender Datei 404 ohne Fehlerseite (wie Cloudflare ohne `not_found_handling`), stellt mit `QUEUE_ATTRAPPE=1` die Warteschlange `EINGANG` nach (ruft `worker.queue` direkt) und hat nur mit `DATEN_ATTRAPPE=1` die Prüfhilfen `/__scheduled?cron=`, `/__jetzt?tage=`, `/__saat`, `/__instanz`, `/__attrappe`, `/__sitzung` (nie im Worker).

## Teil 2: Betrieb

Folgt mit Strang F (Einrichtung je Kunde, Status und Fristen, Fehlerbilder). Bis dahin: Bauplan §4 „Manuelle Schritte des Inhabers“.

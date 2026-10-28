# Konfigurator-Instanzen in drei Paketen

Jeder Fensteranbieter bekommt seinen eigenen Fenster-Konfigurator auf seiner eigenen Domain (z. B. `brandt-fenster.app`), in einem von drei Paketen: **Essential**, **Plus**, **Signature**. Alle Domains hängen am selben Worker wie eeziframes.com; je Kunde steht alles in der Datenbank und wird in der Zentrale gepflegt, nie im Code. eeziframes.com bleibt für das Aufmaß der Hauseigentümer, wie es ist, verkauft die Pakete und führt das Kundenkonto der Fensteranbieter (`/partner/`). Bestehende Betriebskonten und Kundenlinks laufen unverändert weiter.

> **Stand 27.10.2026:** Kundenkonto `/partner/`, die alte Paket-Bestellung und die alte Zentrale (Oberfläche, Verwaltung der Instanzen) sind entfernt; bestellt wird jetzt über `/bestellen/`, verwaltet in der neuen Zentrale ([BESTELLUNG.md](BESTELLUNG.md), [ZENTRALE.md](ZENTRALE.md)). Die Laufzeit der Instanzen unten (Mandant, Eingang, App, Dashboard, Rechtsseiten) gilt weiter; eine Instanz beim Live-Schalten aus dem Auftrag anzulegen ist der nächste Schritt. Abschnitte, die Kundenkonto, Bestellung oder Zentrale beschreiben, zeigen den früheren Stand.

Diese Datei ist der Vertrag zwischen den Bausträngen (Teil 1, vom Fundament S0) und beschreibt den Betrieb (Teil 2: Einrichtung je Kunde, Zustände, Fristen, Rechtstexte der Instanzen, Fehlerbilder). Bestellung und Geld: [BESTELLUNG.md](BESTELLUNG.md). Grundlage ist der Bauplan vom 22.10.2026 (Entscheidungen E1–E30).

## Teil 1: Verträge

### Grundregeln

- **Altbestand ist heilig.** `scripts/pruefen.mjs` Abschnitte 1–22 bleiben in jedem Strang grün; eeziframes.com (B2C-Aufmaß, Kauf des Aufmaßblatts, Bestandsbetriebe mit Kundenlinks) verhält sich unverändert. Jeder Instanz-Zweig im Server hängt an `ctx.instanz` bzw. `daten.instanz`, jeder Zweig in App und Portal an `KONFIG.instanz`.
- **Eine Stelle je Wahrheit.** Merkmale, Preise und Fristen je Paket nur in `web/assets/pakete.js`; Zustände, Übergänge, globale Fristen und Grenzen, Feldregeln der Bestellung nur in `web/assets/instanzregeln.js`. Kein Vergleich mit einem Paketnamen (`paket === …`) außerhalb von `pakete.js` (Prüfung 23); Code fragt Merkmale ab (`m.dashboard`, `m.logo`, …). Ein Paket setzt nie den Tarif eines Kontos: Instanzkonten haben `konto: 'instanz'`.
- **Gefahrlos mergebar.** Alles Neue darf in `main`, bevor Preise, Rechtstexte und Cloudflare/Stripe/Resend eingerichtet sind:
  - Ohne Variable `PAKETE_OFFEN=1` zeigt die Verkaufsseite statt „Paket bestellen“ ein Anfrageformular (bis 27.10.2026 auch „vorläufige Preise“; seitdem hängt das nur an `VORLAEUFIG` in `pakete.js`, die Preise hat der Inhaber festgelegt) („Bestellung bald möglich“); die Paket-Kasse bleibt im Live-Modus von Stripe zu. Im Test- und Attrappenmodus ist sie offen, damit sich alles prüfen lässt. Die einzige Abfrage dafür ist `Instanzregeln.verkauf({ offen: k.paketeOffen, live: live(k), bereit })` → `{ offen, vorlaeufig, bestellen, kasse }` (`bereit`: Paketbedingungen ohne Platzhalter, `paketVerkaufStand()` in `functions/api/recht.js`).
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
| Welle 1 | **D Kundenkonto, Bestellung, Stripe** | entfernt am 27.10.2026: Kundenkonto `/partner/`, Paket-Bestellung, Paketfunktionen in `functions/api/stripe.js`; ersetzt durch `functions/auftrag/` ([BESTELLUNG.md](BESTELLUNG.md)) |
| Welle 2 | **B Konfigurator-App** | `web/assets/app.js`, `app.css`, `web/app/index.html` (nur neutrale Haken), `web/assets/einladung.js`, `einladung.css`, `gemeinsam.js`, `gemeinsam.css`; `scripts/pruefen-instanzen/25.mjs` |
| Welle 2 | **C Zentrale** | entfernt am 27.10.2026: Oberfläche der Zentrale, Verwaltung der Instanzen und Bestellungen; geblieben `functions/api/cloudflare.js` und `functions/api/zentrale.js` (App); neue Zentrale der Aufträge in `web/assets/inhaber.js` ([ZENTRALE.md](ZENTRALE.md)) |
| Welle 3 | **E Signature-Dashboard** | `functions/api/dashboard.js`; `functions/api/auth.js` (`admin` mit Body, `codeErzeugen`, `nutzerAnlegen`); `functions/api/konten.js` (Haken für Instanz-Hosts); `functions/api/fotos.js` (nur `GET /api/konto/foto`); `web/betrieb/index.html`; `web/assets/portal.js`, `portal.css`; `scripts/pruefen-instanzen/28.mjs` |
| Welle 3 | **F Verkaufsseite, Recht, Doku** | `web/fuer-fensterbauer/index.html`; `functions/pakete-seite.js`; `web/konfigurator-bedingungen/index.html` und PDFs; `scripts/bedingungen-pdf.mjs`; `web/datenschutz/index.html` (Abschnitt Kundenkonto); `functions/instanz/recht.js`; `scripts/pruefen.mjs` (nur Abschnitt 10); README.md; `docs/INSTANZEN.md` (Teil 2), `docs/BESTELLUNG.md`, `ONLINE-STELLEN.md`, `ZENTRALE.md`, `GESTALTUNG.md`, `SEO.md`; `scripts/pruefen-instanzen/29.mjs` |
| Schluss | **I Integrator** | Abschnitt 30 (Ende zu Ende über die alte Bestellung), entfernt am 27.10.2026; die Aufträge prüft `scripts/pruefen-instanzen/26.mjs` |

Muss ein Strang eine fremde Datei ändern, liefert er die Änderung als Vorgabe an den Besitzer. Ausnahme aus S0: `worker.js` liefert schon die Fehlerseite selbst (weil `not_found_handling` entfällt) und setzt auf `/zentrale*`, `/partner*`, `/betrieb*` Sicherheitskopfzeilen, `noindex` und `no-store`; Strang A baut darauf die Host-Weiche.

### Datenmodell (supabase/schema.sql)

Neue Tabellen: `partner`, `bestellungen` (Nummer `B-JJJJ-NNNN` aus der Folge `bestellung_nr`; Zahlung über `zahlung->>session` und `zahlung->>pi` eindeutig), `partner_nachrichten`, `instanzen`, `instanz_hosts` (Host klein, ohne `www.`, ohne Port; eine Hauptdomain je Instanz), `anfragen` (Code 10 Zeichen, `(betrieb, lid)` eindeutig; `daten` = Link-Objekt wie `betriebe.daten.links[]`). Funktionen: `instanz_nr(uuid)` (P-JJJJ-NNN je Instanz und Jahr, atomar), `instanz_fuer_host(text)` (ohne `entwurf` und `zugang`), `instanz_anlegen(jsonb)` (Instanz und Betriebszeile atomar; Betriebszeile mit Platzhalter `i-<id>@instanz.invalid`, `daten.konto = 'instanz'`, `daten.instanz.id`), `anfragen_kopf(uuid, timestamptz)` (Projektliste ohne `aufmass` und `vorher`), `eeziframes_budget(date, text, int)` (Zähler für Budgets, atomar). Alle Tabellen mit RLS, nur `service_role`. Bestehende Tabellen und Daten werden nicht migriert.

`instanzen.version` steigt bei jeder Änderung (Schutz vor gleichzeitigem Schreiben und Cache-Schlüssel, `/marke/<version>/…` und `KONFIG.instanz.v`). Bilder einer veröffentlichten Marke liegen im Bucket `marke` unter `instanz/<id>/<marke.v>/<name>`; `marke.v` zählt nur die Veröffentlichungen. `id8` einer Instanz = die ersten 8 Hex-Zeichen der `id` ohne Bindestriche.

Formen in JSON-Spalten:

```js
instanzen.marke   { name, titel, beschreibung, farbe, v, bilder: { logo, icon32, icon180, icon512, og, start: [], ap }, start: { kicker, ueberschrift, text } }
instanzen.eingang { mails: [{ mail, bestaetigt: ISO|null, eingeladen: ISO }], absendername }
instanzen.zugang  [{ mail, uid, name, rolle, bestaetigt, zuletzt, aus }]
instanzen.recht   { firma, rechtsform, vertretung, strasse, plz, ort, land, tel, mail, register, ust, kammer, beruf, schlichtung, dsb, bundesland, stand }
                  schlichtung: Angabe nach § 36 VSBG, leer = „nicht bereit und nicht verpflichtet“; dsb: Datenschutzbeauftragter, nur wenn benannt
                  (beide aus den Angaben des Auftrags, betrieb.schlichtung und betrieb.dsb)
anfragen.versand  { runde, status: offen|gesendet|zugestellt|bounce|beschwerde|fehler, versuche, naechster: ISO, id, bytes, ohneFotos }
bestellungen.preise { monat, einrichtung, mwst, name, stand }   (Pakete.preisStand)
```

### Speicher (functions/api/speicher.js, Supabase und Attrappe)

Fehlt eine Tabelle, liefern lesende Funktionen `undefined`, schreibende werfen 503. `…Aendern(id, fn)`: `fn(z)` ändert die Kopie `z`; `false` = nichts schreiben; sonst Rückgabe von `fn` oder, ohne Rückgabe, die neue Zeile; Versionszähler, bis zu vier Versuche. Konflikte mit eindeutigen Schlüsseln: `ApiFehler` 409 mit `extra.grund` (`slug_vergeben`, `host_vergeben`, `haupt_doppelt`, `anfrage_vorhanden`, `partner_vorhanden`, `zahlung_doppelt`).

- Instanzen: `instanzFuerHost(host)`, `instanzHolen(id)`, `instanzVonBetrieb(betrieb)`, `instanzAnlegen(p)` → id (`p: { slug, name, plz, paket, partner, bestellung, eingang, zugang, recht, entwurf, demo, betriebDaten }`), `instanzAendern(id, fn)`, `instanzenAlle({ status })`, `instanzNr(id)`, `instanzLoeschen(id)` (samt Hosts, Anfragen, Zwischenständen und Betriebszeile).
- Hosts: `hostsVon(instanz)`, `hostAnlegen(row)`, `hostAendern(host, patch)`, `hostLoeschen(host)`.
- Anfragen: `anfrageHolen(code)`, `anfrageNachLid(betrieb, lid)`, `anfrageAnlegen(row)`, `anfrageAendern(code, fn)`, `anfragenVonBetrieb(betrieb, { kopf, seit })`, `anfragenStand(betrieb)` → `{ stand, anzahl }`, `anfrageNachMailId(id)`, `anfragenFaellig(jetzt)` (Versand offen und fällig, höchstens 50), `anfragenZuLoeschen(jetzt)`, `anfrageLoeschen(code)`.
- Zwischenstände: `entwurfAnlegen(code, betrieb, meta)` legt nur neu an (Code vergeben: `null`), dazu wie bisher `entwurfHolen`, `entwurfAendern`, `entwuerfeVonBetrieb`.
- Partner: `partnerHolen`, `partnerNachAuth`, `partnerNachMail`, `partnerAnlegen`, `partnerAendern(id, fn)`, `partnerFelder(id, patch)`, `partnerAlle`, `partnerLoeschen(id)` (409, solange Bestellungen da sind; Nachrichten gehen mit, Instanzen verlieren den Verweis).
- Bestellungen: `bestellungHolen`, `bestellungenVonPartner`, `bestellungAnlegen`, `bestellungAendern(id, fn)` (Verlauf höchstens 200 Einträge), `bestellungNachSession`, `bestellungNachPi`, `bestellungNachAbo`, `bestellungenListe({ status, seit })`, `bestellungLoeschen`.
- Nachrichten: `nachrichtAnlegen`, `nachrichtenVon(pid, { bestellung, anzahl })`, `nachrichtenGelesen(pid, empfaenger)`, `rueckrufeOffen()`, `nachrichtAendern(id, patch)`, `nachrichtenAltLoeschen(pid, bis)`, `nachrichtenLoeschen(pid)`.
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
functions/instanz/adapter.js (A):   linkAufloesen(ctx, code) → { art: 'alt'|'anfrage'|'virtuell', row, l, anfrage?, entwurf? }, linkAendern(ctx, aufl, fn, o) mit fn(a, l, jetzt),
                                    pseudoKonto(daten, l) → { konto: 'instanz', links: [l], book: [], notif: [], abzug, prefs, since } (fertig)
                                    stempelBerlin(ms), datumBerlin(ms), zeitenBerlin(l, jetzt): Zeitstempel der Instanz-Anfragen in deutscher Zeit (Europe/Berlin);
                                    der Altbestand (eeziframes.com) bleibt bei stamp()/datum() in der Uhr des Workers (UTC)
functions/instanz/verwalten.js (A): instanzAnlegen(ctx, p), instanzAendern(ctx, id, fn), instanzStatus(ctx, id, status, grund), hostSetzen(ctx, id, host, o),
                                    hostEntfernen(ctx, id, host), hauptSetzen(ctx, id, host), markeVeroeffentlichen(ctx, id), bildAblegen(ctx, id, name, bytes, typ),
                                    empfaengerEinladen(ctx, id, mail, art), vorschauToken(ctx, id, version), cacheLeeren(ctx, id), instanzDatenLoeschen(ctx, id),
                                    anmeldungGebraucht(sp, uid, { ohneInstanz, instanzen }) → bool (Betrieb, Partner, andere Instanz, lebende Aufmaße eines Hauseigentümers)
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

Stubs werfen `ApiFehler` 501 („noch nicht gebaut“), bis ihr Strang sie baut; die Läufe der Cron-Weiche tun bis dahin nichts. Nach Welle 1 sind nur noch die Module von C (`zentrale-instanzen.js`, `zentrale-bestellungen.js`, `cloudflare.js` mit `instanzenPruefen`), E (`dashboard.js` mit `einladungenErinnern`) und F (`pakete-seite.js`, Datenschutz in `functions/instanz/recht.js`) Stubs. Seit Welle 3 ist kein Stub mehr übrig.

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

### Stand nach Welle 2 (B und C zusammengeführt)

Verträge, die E und F nutzen dürfen (damals vom Integrator im echten Ablauf geprüft, Abschnitt 30, entfernt am 27.10.2026: Chromium auf `*.localhost`, API mit Kopfzeile `Host`: Bestellung → Zentrale → Gestaltung mit Vorschau im Telefonrahmen → Vorschau-Link mit Testanfrage → live → Anfrage im Browser mit Mail und PDF → Versandliste → Pause bei offener App → Fortsetzen → Paketwechsel):

- **Startseite einer Instanz (einladung.js, B):** `Einladung.html({ name, du, p, instanz, vorschau })` mit `instanz = { kz: m.kennzeichnung, website, kopie: m.kopieKunde, start: { kicker, ueberschrift, text }, bilder: ['/marke/<v>/start-N.jpg'], standardBild, ohneKopf }`; `p` ist das Profil (`Einladung.profil`) mit `logoUrl` (`/marke/<v>/logo.png`) und `col` (Firmenfarbe, jede Hex-Farbe). Ohne `ohneKopf` steht der Absender oben („Fensterplaner von“ für Website-Besucher, sonst „Persönliche Anfrage von“). Mit `vorschau: true` ist nichts bedienbar, und `bilder` darf auch `blob:`-Adressen der Seite enthalten. `Einladung.kennzeichnung(kz)` liefert den Hinweis je Paket. Die App baut `instanz` in `instOpt()`, die Zentrale in `vorschau()` genauso; das Dashboard (E) zeigt die Einladungsseite ebenso.
- **Merkmale im Browser:** `Pakete.oeffentlich(m)` enthält auch `pdfKennzeichnung` (PDF-Kopie der App, Aufmaßblätter im Dashboard).
- **Status bei offener Seite:** Die Instanz-API antwortet in `pausiert`, `beendet` und `einrichtung` (ohne Vorschau) mit 503 bzw. 410 und `{ status }`; die App zeigt dann die Seite des Betriebs mit Kontakt (`instZuPruefen`), die Planung bleibt. Das Dashboard (E) wertet dieselbe Antwort aus.
- **„Als Kunde öffnen“ auf der Instanz (für E):** `https://<host>/?vorschau=1#k-<code>`. `?vorschau=1` ist kein Vorschau-Token, `seiten.js` lässt es in der Adresse (jeder andere Wert gilt als Token: Cookie und Umleitung). Die App zeigt die Vorschau des Betriebs (nichts gespeichert, nichts gesendet, nicht „geöffnet“), wenn der Code in `localStorage['aufmass.portal.v1'].acc.*.links` steht (`linkImBetrieb`, wie auf eeziframes.com); `portal.js` schreibt diesen Speicher auf derselben Herkunft.
- **Einladungslinks (für E):** `#k-<code>` hat in der App Vorrang vor der laufenden Planung des Geräts. Einladungen (`art: 'einladung'`) zeigen die persönliche Startseite ohne Kontaktpflicht, Website-Besucher die Startseite des Betriebs mit Pflichtkontakt.
- **Zentrale (C):** Zugänge `instanzen.zugang[] = { mail, name, rolle: 'inhaber'|'team', uid: null, bestaetigt, zuletzt, aus }` (anlegen, aus, an, löschen; Bestätigung über `empfaengerEinladen(…, 'zugang')`, A); E bindet `uid` und setzt `zuletzt`. Testanfrage der Zentrale: `instanzen.eingang.test = { code, zeit, status, zugestellt }`. Hauptknopf und Ampel: `GET /api/zentrale/bestellungen/:id` (`schritt`, `ampel`); Aufgaben der Übersicht: `GET /api/zentrale/aufgaben`.
- **Cloudflare (C):** `CF_API_TOKEN` (Secret) und `CF_ACCOUNT_ID` (Variable) liest `functions/api/cloudflare.js`; `umgebung.js` meldet in den Hinweisen, wenn nur einer der beiden Werte gesetzt ist. Ohne beide zeigt die Zentrale die Klick-Anleitung.
- **Initiale (Favicon, Zeichen):** erster Buchstabe oder erste Ziffer des Namens ohne Zusatz wie „Fensterbau“, in `einladung.js` und `seiten.js` gleich.

### Stand nach Welle 3 (E und F zusammengeführt)

Verträge, damals vom Integrator im echten Ablauf geprüft (Abschnitt 30, entfernt am 27.10.2026; eigener Testserver mit `PAKETE_OFFEN=1`, Chromium auf `*.localhost`, API mit Kopfzeile `Host`): Verkaufsseite → Bestellformular mit dem Paket → Signature-Bestellung mit Dashboard-Zugang → Zentrale übernimmt den Zugang in die Instanz → Bestätigungslink → Anmeldung im Dashboard in der Vorbereitung → live → Einladung im Dashboard → Kunde plant und sendet in der App → Mail mit PDF und Knopf ins Dashboard → Nachbesserung und zweite Runde → Impressum und Datenschutz aus den Angaben der Bestellung → Zugang aus und an → Paketwechsel Signature → Plus → Signature → Hauptdomain mit Umzug ins Dashboard.

**Dashboard (E)** auf dem Haupthost einer Instanz mit `m.dashboard` (sonst 404 wie eine unbekannte Route):

```
GET  /betrieb/                                Hülle web/betrieb/index.html (CSP, noindex, no-store); /betrieb → 301; Alias-Host → 301 auf den Haupthost
GET  /config.js?betrieb=1                     Marke für die Hülle in jedem Status, solange das Paket ein Dashboard hat (seiten.js)
POST /api/konto/anmelden { mail }             immer dieselbe Antwort; einen Code bekommen nur bestätigte, eingeschaltete Zugänge (Mail in der Marke)
POST /api/konto/bestaetigen { mail, code }    → Cookie __Host-betrieb (aud = Host), uid am Zugang gebunden, kein Token in der Antwort
GET  /api/konto?start=1                       ohne Sitzung { ok, angemeldet: false } statt 401 (erster Abruf der Hülle)
GET  /api/konto[?stand=]                      Sicht ohne Abrechnungsfelder; { gleich: true }, solange nichts geändert ist; GET schreibt nie
PATCH /api/konto                              Profil (Einladungsseite, Kontakt, Bestellmaß, Benachrichtigungen); logo, col → 403
POST /api/konto/projekte · /projekte/liste    Einladungen (m.einladungslinks, Status aktiv): Zeile in anfragen, art einladung, Nummer aus instanz_nr
PATCH /api/konto/projekte/:id                 über linkAendern, Felder nach der Status-Matrix (pausiert: klaer, stage, memo, seen)
GET  /api/konto/projekte/:id                  ein eingereichtes Projekt voll nachladen (älter als 30 Tage kommt es in der Sicht nur als Kopf)
POST /api/konto/projekte/:id/loeschen { bestaetigung: <Projektnummer> }   Zeile, Fotos, Zwischenstand, Blätter, Meldungen; Protokoll ohne Kundendaten
GET  /api/konto/export                        JSON zum Herunterladen (ohne uid, ohne verwaltung), auch „beendet“ bis zur Löschung
GET  /api/konto/foto/:code/:id                Fotos der eigenen Instanz
POST /api/konto/abmelden                      löscht das Cookie
404 auf Instanz-Hosts: registrieren, sitzung, erneuern, plan*, zahlungsart*, import
Hauptdomain: Zugangsadresse ohne Betriebskonto → 409 { umzug: 'https://<host>/betrieb/' } (portal.js: „Zu Ihrem Dashboard“); /betrieb* → 404
```

- **Mail an den Betrieb (A):** bei `m.dashboard` mit dem Knopf `https://<host>/betrieb/#projekt-<id>`; die Hülle springt nach der Anmeldung dorthin. Ohne Dashboard (nach einem Wechsel auf Plus) kommt die Mail ohne Knopf, offene Einladungen nehmen ihr Aufmaß weiter an.
- **Erinnerung (täglicher Lauf `einladungenErinnern`):** Einladungen „verschickt“ oder „geöffnet“ ohne Planung, älter als `FRISTEN.einladungErinnernTage` (3), einmal je Projekt (`daten.erinnert`) an die bestätigten Eingangsadressen, mit Links ins Dashboard; abschaltbar mit `prefs.remind = false`.
- **Zugänge:** Die Bestellung (D) nennt sie in `konfigurator.zugang`, die Zentrale (C) übernimmt sie beim Anlegen der Instanz und schaltet sie an, aus oder löscht sie; bestätigt wird über `GET /api/instanz/bestaetigen?t=` (A). E bindet `uid` und setzt `zuletzt`. Entzug, ein Paket ohne Dashboard und jeder neue Status wirken beim nächsten Aufruf (das offene Dashboard meldet ab).
- **portal.js im Instanz-Modus** (`INST` aus `KONFIG.instanz`): Links `https://<host>/#k-<code>`, „Als Kunde öffnen“ `https://<host>/?vorschau=1#k-<code>`; Fuß mit `/impressum/` und `/datenschutz/` der Instanz (F) und `acc.instanz.kundenkonto` = `https://eeziframes.com/partner/` (D, „Vertrag, Rechnungen und Support“).
- **Verkaufsseite (F):** `functions/pakete-seite.js` setzt die Bausteine je Umgebung ein: ohne `PAKETE_OFFEN` „Bestellung bald möglich“ mit Anfrageformular (`POST /api/partner/frage`, D, auch ohne JavaScript), mit `PAKETE_OFFEN=1` Knöpfe auf `/partner/#bestellen/<paket>` (partner.js wählt das Paket vor); `PAKETE_DEMOS=1` verlinkt die Demo-Instanzen.
- **Fassung der Paketbedingungen:** `PAKET_STAND` (functions/api/recht.js) steht gleich in `GET /api/partner/stand`, in `<meta name="stand">` von `/konfigurator-bedingungen/` und in den Namen der beiden PDFs; die Kasse verlangt genau diese Fassung. `node scripts/bedingungen-pdf.mjs` schreibt Bausteine und PDFs, `--pruefen` vergleicht.
- **Recht je Instanz (F):** `impressumSeite(inst)` und `datenschutzSeite(inst)` aus `instanzen.recht` (bei Instanzen aus einer Bestellung die Firma der Bestellung) und den Merkmalen; ein Paketwechsel ändert die Texte sofort (`__Host-betrieb` nur mit Dashboard, eeziframes mit Namen nur bei `rechtNennung: 'name'`).
- **Startseite eeziframes.com (E.7):** Ansicht Hauseigentümer: Kasten „Für Fensterbauer“ → `/fuer-fensterbauer/` (dazu der Weg in die Ansicht für Bestandsbetriebe); Ansicht Fensterbauer: Karte „Pakete ansehen“. Registrierung und Tour des Betriebsbereichs bleiben über `/#fensterbauer` und `/#tour` erreichbar.

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

`Pakete`: `PAKETE`, `MERKMALE` (Beschriftung für Verkaufsseite und Zentrale), `LISTE`, `merkmale(paket, abweichung)` (eingefroren; Abweichungen nur für bekannte Merkmale, nie Paket, Name, Preis), `oeffentlich(m)` (gestaltung, logo, farbe, fotos, startansicht, kennzeichnung, pdfKennzeichnung, rechtNennung, kopieKunde, dashboard), `preis(paket)`, `preisText(paket, 'monat'|'einrichtung', mwst)`, `preisStand(paket, mwst)`, `VORLAEUFIG`, `PREIS_STAND`.

`Instanzregeln`: `darf(status, bereich, { vorschau, feld })` (die einzige Abfrage der Status-Matrix; Bereiche `seite, recht, schreiben, link, ki, dashboardLesen, dashboardSchreiben, einladen, export`), `felder()`, `seite(status, { vorschau })` → `{ code, art }`, `anfrageArt()` (`test` in der Vorschau), `FRISTEN`, `GRENZEN`, `bestellung.{ LEISTE, TITEL, ABO_TITEL, UEBERGAENGE, uebergang(von, nach, wer), firma, konfigurator, gestaltung, erreichbarkeit, zustimmung, vollstaendig }` (Feldregeln für Browser und Server), `instanz.{ uebergang, statusFuer }`, `verkauf()`, `host(s, { demo, lokal })`, `hostNorm`, `farbe(hex)` (Kontrast ≥ 4,5:1 auf #161616), `akzent(hex)`, `kontrast`, `BUNDESLAENDER`.

| Status | `/` | Recht | Endkunde schreibt | Link lesen | KI | Dashboard lesen | Dashboard schreiben | Einladen | Export |
|---|---|---|---|---|---|---|---|---|---|
| `einrichtung` | 503 „in Vorbereitung“ | ja | nein | nein | nein | ja | nur Profil | nein | ja |
| `einrichtung` mit Vorschau | ja, Band „Vorschau“ | ja | ja (`art: 'test'`) | ja | ja | ja | nur Profil | nein | ja |
| `aktiv` | ja | ja | ja | ja | ja | ja | ja | ja | ja |
| `pausiert` | 503 mit Kontakt | ja | nein | nein | nein | ja | nur `klaer`, `stage`, `memo`, `seen` | nein | ja |
| `beendet` | 410 | ja | nein | nein | nein | nein | nein | nein | ja |

### Umgebung

Neu in `konfig(env)`: `k.paketeOffen` (`PAKETE_OFFEN=1`), `k.sitzung.geheimnis` (`SITZUNG_GEHEIMNIS`), `k.jetzt` (Zeit der Anfrage, mit `JETZT`). Weitere Variablen der Stränge (bei ihrer Einführung in `umgebung.js` eintragen): `MAIL_ABSENDER_INSTANZ`, `MAIL_ABSENDER_NEUTRAL`, `RESEND_WEBHOOK_SECRET` (A), `INSTANZ_CACHE_MS`, `HAUPT_HOSTS`, `KI_TAG_MAX` (A), `CF_API_TOKEN`, `CF_ACCOUNT_ID` (C), `PAKETE_DEMOS` (F, Live-Demos auf der Verkaufsseite). Bindungen: `RL_*` (wrangler.jsonc), später `INSTANZEN` (KV) und `EINGANG` (Queue).

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

Der lokale Testserver (`scripts/dev-server.mjs`) schickt jede Anfrage durch `worker.js`, nimmt die Adresse aus der Kopfzeile `Host`, liefert über `env.ASSETS` bei fehlender Datei 404 ohne Fehlerseite (wie Cloudflare ohne `not_found_handling`), stellt mit `QUEUE_ATTRAPPE=1` die Warteschlange `EINGANG` nach (ruft `worker.queue` direkt) und hat nur mit `DATEN_ATTRAPPE=1` die Prüfhilfen `/__scheduled?cron=`, `/__jetzt?tage=`, `/__saat`, `/__instanz`, `/__attrappe`, `/__sitzung` (nie im Worker). Mit `ZAHLUNG_ATTRAPPE=1` (ohne Stripe) stellt `POST /__stripe` ein Stripe-Ereignis der Pakete zu wie der Webhook (`{ type: 'invoice.payment_failed', object: { subscription } }` → `paketEreignis`), damit Zahlungsausfall, Kulanz und Pause im Browser prüfbar sind.

Abschnitt 30 (`30.mjs`, nach den Vertragsprüfungen `30-welle1|2|3.mjs`) geht den ganzen Weg je Paket auf einem eigenen Testserver mit `PAKETE_OFFEN=1` und ohne Standard-Instanzen: Bestellung im Browser, Einrichtung in der Zentrale (`essential|plus|signature.localhost`), Freigabe, Live, Anfrage vom Telefon mit Fotos, RAL-Farbe und Notiz, Mail mit PDF, Signature-Dashboard mit Einladung, dann Zahlungsausfall bis zur Löschung über `JETZT`. Mit `BILDER30=<Ordner>` legt er die Bildschirmfotos ab (Telefon und 1280, dazu PDF Seite 1 und die Mail an den Betrieb).

## Teil 2: Betrieb

Für den Inhaber: wie ein Kunde zu seinem Konfigurator kommt, was in welchem Zustand gilt, welche Fristen der Server von selbst einhält und was zu tun ist, wenn etwas hakt. Die Bestellung bis „Live“ und das Geld stehen in [BESTELLUNG.md](BESTELLUNG.md), die einmalige Einrichtung (Cloudflare, Resend, Stripe, Supabase) in [ONLINE-STELLEN.md](ONLINE-STELLEN.md), die Bedienung der Zentrale in [ZENTRALE.md](ZENTRALE.md).

### Was der Kunde bekommt

| | Essential | Plus | Signature |
|---|---|---|---|
| Adresse des Konfigurators | `ihr-name.eeziframes.com` (Entscheidung des Inhabers 27.10.2026, siehe unten) | eigene Domain | eigene Domain |
| Anfrage per Mail mit Aufmaßblatt-PDF | ja | ja | ja |
| Gestaltung | eeziframes-Design, Name als Text | Logo, Firmenfarbe, bis 6 Fotos, eigene Startseite | wie Plus |
| Farben der Landingpage (`farbwelt`) | Palette von eeziframes | Palette des Betriebs auf Karten, heller Szene und Akzenten, Grund von eeziframes | die ganze Seite in der Palette des Betriebs |
| Hinweis auf eeziframes | „Powered by EEZIframes“ (verlinkt) | „Konfigurator von eeziframes“ im Fuß | keiner, auch nicht in PDF, Mails, Titel, Icons, Rechtstexten |
| Suchmaschinen | noindex (ohne Disallow) | nur die Startseite | nur die Startseite |
| Aufbewahrung der Anfragen auf dem Server | 30 Tage nach Zustellung | 30 Tage nach Zustellung | 30 Tage nach Zustellung, bis dahin auch im Dashboard |
| Dashboard `/betrieb/` mit Einladungslinks und Fortschritt | nein | nein | ja, 5 Zugänge |

Verbindlich ist `web/assets/pakete.js`; die Tabelle oben ist ein Auszug.

**Stand 27.10.2026, Entscheidungen des Inhabers:** Kein Paket bewahrt Anfragen bis zum Vertragsende auf (`aufbewahrung` überall 30 Tage;
`'vertrag'` nur noch als Abweichung). Essential läuft unter `ihr-name.eeziframes.com` (`domain: false`). **Offen:** Der Server kann das
noch nicht. `istHaupt` in `functions/instanz/mandant.js` behandelt jede Adresse unter `eeziframes.com` außer `demo-*` als Hauptdomain,
Bestellung und Einrichtung fragen auch bei Essential nach einer Wunsch-Domain, und es fehlt die Route `*.eeziframes.com` am Worker.
Bis das gebaut ist, bekommt ein Essential-Kunde wie bisher eine eigene Domain. Die Farbstufen (`farbwelt`) sind in den Vorlagen gebaut
(docs/profis/paketvorlagen/, Farbdatei je Betrieb); die Instanzen setzen heute nur die Firmenfarbe als Akzent. Abweichungen für einzelne Kunden (Kulanz) stehen in `instanzen.abweichung` und gelten nur für bekannte Merkmale, nie für Paket, Name oder Preis.

### Einrichtung je Kunde (Weg 1: Domain im eigenen Cloudflare-Konto)

1. Mail „Bestellung bezahlt“ → Zentrale → Bestellungen → **Einrichtung beginnen**. Den Kunden zur Wunschzeit anrufen, Domain festlegen (die Zentrale zeigt „wahrscheinlich frei“).
2. **Domain kaufen:** `.app`, `.com` usw. bei Cloudflare (Domain Registration → Register Domains, Auto-Verlängerung an); `.de` bei einem anderen Anbieter, dann in der Zentrale **Zone anlegen** und die zwei Nameserver beim Anbieter eintragen.
3. **Instanz anlegen** (übernimmt Firma, Rechtsangaben, Empfänger, Zugänge und Gestaltungswünsche aus der Bestellung und schickt die Bestätigungslinks an die Empfänger).
4. **Mit Konfigurator verbinden:** mit `CF_API_TOKEN` automatisch, sonst nach der Klick-Anleitung der Zentrale (Workers & Pages → fenstero → Einstellungen → Domains & Routes → Add → Custom Domain, Domain und `www.`; vorhandene A-, AAAA-, CNAME-Einträge für genau diese Namen löschen). Nie in `wrangler.jsonc` eintragen.
5. In der Zone des Kunden: Web Analytics, Rocket Loader, E-Mail-Adressen-Verschleierung und Bot Fight Mode aus (setzen sonst Skripte oder Cookies, die in keinem Datenschutztext stehen).
6. **Prüfen**, bis alles grün ist (Zertifikat, DNS, Antwort der Instanz auf `/api/instanz/ping`), dann **Domain gesichert**.
7. Plus und Signature: **aus Bestellung übernehmen**, ansehen (Vorschau im Telefonrahmen), **Veröffentlichen**.
8. **Rechtsangaben** ansehen (Impressum und Datenschutz entstehen daraus, siehe unten); **Testanfrage** schicken, bis „zugestellt“ dasteht.
9. **Vorschau senden** → der Kunde gibt im Kundenkonto frei (oder Vermerk nach Telefonat).
10. **Live schalten** (nur mit grüner Ampel; gelbe Punkte mit „Hinweis“ sperren nicht). Das Abo startet von selbst, der Kunde bekommt den Link-Schnipsel für seine Website; bei Plus und Signature setzt das Live-Schalten die Freigabe für Suchmaschinen (`indexierung`) von selbst.

Signature: Die Mails an den Betrieb kommen vom neutralen Postfach `MAIL_ABSENDER_NEUTRAL` (eigene Domain ohne eeziframes, bei Resend bestätigt; Bauplan §4, optional). Solange die Variable fehlt, kommen sie von `MAIL_ABSENDER_INSTANZ` (sonst `MAIL_ABSENDER`); die Live-Ampel zeigt das als gelben Hinweis, die Zentrale unter Einstellungen → „Konfigurator-Pakete“ („Neutraler Absender“), und Verkaufsseite und Paketbedingungen versprechen den neutralen Absender nur „sobald eingerichtet“. Ebenso ein Hinweis, bis sie anwaltlich geprüft ist: die Rechtsvorlage der Instanzen (`VORLAGE` in `functions/instanz/recht.js`); sie sperrt nur die Paket-Kasse im Live-Modus (`paketVerkaufStand`, Liste „fehlt“ in denselben Einstellungen).

Demo-Instanzen der Verkaufsseite: Custom Domains `demo-essential.eeziframes.com`, `demo-plus.eeziframes.com`, `demo-signature.eeziframes.com` am Worker, in der Zentrale je eine Instanz ohne Bestellung mit Schalter „Demo“ (Anfragen gehen an `MAIL_KONTAKT` und verschwinden nach `FRISTEN.testTage` Tag). Die Verkaufsseite verlinkt sie erst mit der Variable `PAKETE_DEMOS=1`, vorher führt „Konfigurator ausprobieren“ in die App.


Testansicht für Fensterbauer (28.10.2026, Wunsch des Inhabers: jeder Weg zum Ausprobieren auf der Seite für Fensterbauer führt in einen Bereich, der erkennbar zum Testen da ist; am Ende der Abschluss, wie ihn der Kunde eines Betriebs mit gebuchtem Paket sieht): „Selbst ausprobieren“ auf der Seite für Fensterbauer und „Konfigurator ausprobieren“ in deren Ratgebern führen auf `/app/?ausprobieren` (Paket Plus), „Fenster planen“ in den drei Paket-Beispielen auf `/app/?ausprobieren=essential|plus|signature` (docs/profis/werkzeuge/paketvorlagen.py, `fuer_web`). Die App läuft dann im Instanz-Modus als Fensterbau Brandt, der erfundene Betrieb der Beispiele, mit den öffentlichen Merkmalen des Pakets aus pakete.js (die App lädt dafür /assets/pakete.js) und der Firmenfarbe Aquatürkis, wo das Paket eine Farbe hat (`PROBE`, `PROBE_PAKET` in web/assets/app.js setzen `KONFIG.instanz` vor `INST`), ohne Führung und ohne Kauf. Alles bleibt im Browser: kein `/api/status`, kein Code vom Server (`instanzStart` vergibt ihn auf dem Gerät), kein Zwischenstand, keine Fotos hinauf, KI ohne Code wie auf der Hauptdomain. Erkennbar ist die Testansicht an der Karte am Anfang (`probeStart`: Beispielbetrieb, Paket, „Gesendet wird nichts“, Weg zurück), an „Testansicht“ unter dem Namen im Kopf jeder Folie, am Hinweis bei den Kontaktdaten und am Eintrag „Testansicht beenden“ in der Übersicht. Senden ist eine Simulation (`probeSenden`, Nummer `TEST-…`); das Ende ist die echte Bestätigung des Kunden mit dem Hinweis „So sieht Ihr Kunde den Abschluss auf Ihrer Website. Gesendet wurde nichts.“, „Pakete ansehen“ und, auf Wunsch, „So käme die Anfrage bei Ihnen an“: die E-Mail an den Betrieb mit dem Aufmaßblatt in der Variante `betrieb` als PDF (`probeBlatt`). Auf einer echten Instanz (KONFIG.instanz vom Server) gibt es die Testansicht nicht.

### Zustände und was sie bedeuten

| Status | Startseite | Endkunde | Dashboard (Signature) | Wie man hinkommt |
|---|---|---|---|---|
| `einrichtung` | 503 „in Vorbereitung“; mit Vorschau-Link (Cookie `__Host-vorschau`) die echte Seite mit Band „Vorschau“, Anfragen als `[Test]` | nein (Vorschau: Test) | lesen, nur Profil schreiben | Instanz angelegt |
| `aktiv` | ja | plant und sendet | alles | Live schalten |
| `pausiert` | 503 mit Name und Kontakt des Betriebs | nein | lesen, nur Klärung, Stand, Notiz, gesehen | Zahlung offen nach Kulanz, Pause durch den Inhaber, Abo in Stripe gekündigt |
| `beendet` | 410 neutral | nein | nein, nur Export | Pause länger als `FRISTEN.pauseMaxTage` Tage, Ende durch den Inhaber |

Impressum und Datenschutz sind in jedem Zustand erreichbar. Eine laufende Planung bleibt beim Endkunden im Browser, wenn die Instanz pausiert; nach dem Fortsetzen kann er senden. Einzige Abfrage: `Instanzregeln.darf(status, bereich, { vorschau })`.

### Fristen, die der Server einhält

| Was | Frist | Wo |
|---|---|---|
| Website-Entwurf ohne Fenster | `entwurfLeerStunden` (24 Stunden) | `anfragenAufraeumen` (täglich) |
| Website-Entwurf mit Fenster, nicht gesendet | `entwurfStillTage` (30 Tage ohne Änderung), samt Fotos | `anfragenAufraeumen` |
| Anfrage (alle Pakete) | `aufbewahrung` (30 Tage) nach bestätigter Zustellung, höchstens `unzustellbarTage` (60) ohne Zustellung | Resend-Webhook setzt `loeschen_ab`; `anfragenAufraeumen` |
| Anfrage Signature | wie Essential und Plus (seit 27.10.2026); nur mit Abweichung `aufbewahrung: 'vertrag'` bis Vertragsende, Originalfotos dann `fotosSignatureTage` (365) | `anfragenAufraeumen` |
| Fotolink in der Mail (Essential/Plus) | `fotoLinkTage` (14), nur auf dem Haupthost, Abruf protokolliert | `functions/api/instanz-api.js` |
| Test- und Demo-Anfragen | `testTage` (1 Tag) | `anfragenAufraeumen` |
| Vorschau-Link | `vorschauTage` (30) | Token `vorschau` |
| Erinnerung an offene Einladungen (Signature) | `einladungErinnernTage` (3), einmal je Projekt | `einladungenErinnern` (täglich) |
| Kulanz bei Zahlungsausfall, Pause, Löschung nach Ende | `kulanzTage` (14), `pauseMaxTage` (60), `loeschenNachEndeTage` (30) | `bestellungenLauf` (täglich) |
| Sicherungen der Datenbank | 7 Tage (Supabase Pro) | Supabase |

Die Zahlen sind Vorschläge bis zur Antwort des Inhabers (Bauplan §5.3) und stehen nur in `pakete.js` bzw. `instanzregeln.js`. Verkaufsseite, Paketbedingungen, AV-Vertrag, Datenschutz von eeziframes.com und Datenschutz jeder Instanz lesen sie von dort; nach einer Änderung `node scripts/bedingungen-pdf.mjs` laufen lassen (neue Fassung der Paketbedingungen, siehe [BESTELLUNG.md](BESTELLUNG.md)).

**Löschliste beim Ende** (30 Tage nach `beendet`, `instanzDatenLoeschen`): alle Anfragen und Entwürfe, ihre Fotos, die abgelegten Aufmaßblätter, Logo und Bilder der Marke, die Dateien der Bestellung, die Anmeldungen der Dashboard-Zugänge, Zwischenspeicher (L1, KV), die Hosts der Instanz; die Domain wird gelöst (Auto-Verlängerung aus). Der AV-Vertrag (§ 11) sagt dasselbe zu.

### Impressum und Datenschutz der Instanzen

`functions/instanz/recht.js` baut beide Seiten aus `instanzen.recht` (Firma, Rechtsform, Vertretung, Anschrift, Telefon, E-Mail, Register, USt-IdNr., Kammer, Berufsbezeichnung, Bundesland). Die Zentrale meldet fehlende Pflichtangaben (`rechtVollstaendig`) in der Ampel; ohne sie geht keine Instanz live.

- **Verantwortlich** ist der Betrieb, der technische Dienstleister sein Auftragsverarbeiter: bei Essential und Plus „eeziframes (Patrick Kies, …)“, bei Signature nur „unser technischer Dienstleister“. Die Unterauftragnehmer (Cloudflare, Supabase, Resend, Anthropic) stehen in jedem Paket mit Namen da.
- Fristen aus `pakete.js`/`instanzregeln.js` je Paket, Speicher im Browser und die Cookies `__Host-vorschau` und (Signature) `__Host-betrieb`, KI nur mit Einwilligung, Rechte, Aufsichtsbehörde nach dem Bundesland des Betriebs (Tabelle `AUFSICHT` der 16 Landesbehörden; Anschriften vor dem Start einmal prüfen).
- **Vorlage:** `VORLAGE = { stand, geprueft }`. Solange `geprueft: false`, steht unter beiden Seiten sichtbar „Vorlage vom …, anwaltliche Prüfung ausstehend“. Seit 27.10.2026 `geprueft: true` (Freigabe durch den Inhaber).

### Fehlerbilder

| Was du siehst | Ursache | Was tun |
|---|---|---|
| Ampel „Domain“ rot | DNS noch nicht umgestellt, Zertifikat noch nicht ausgestellt, alter A/CNAME-Eintrag | Nameserver prüfen, störende Einträge löschen (Zentrale bietet es an), nach 5–30 Minuten erneut prüfen |
| Testanfrage bleibt „gesendet“, nie „zugestellt“ | `RESEND_WEBHOOK_SECRET` fehlt oder der Webhook bei Resend ist nicht eingerichtet | Webhook nach ONLINE-STELLEN.md einrichten; ohne ihn zählt „gesendet“ als zugestellt |
| Anfrage „bounce“ oder „beschwerde“, Hinweis in der Übersicht | Empfängeradresse des Betriebs falsch oder voll | Betrieb anrufen, Empfänger im Kundenkonto oder in der Zentrale ändern (neue Adresse bestätigen lassen), **erneut senden** |
| Versand „fehler“ nach 8 Versuchen | Resend gestört, `MAIL_ABSENDER_INSTANZ` nicht bestätigt | Resend-Dashboard ansehen, dann erneut senden |
| Mail kam ohne PDF, mit Text und Link | PDF zu aufwendig für die Rechenzeit (Workers Free) oder Fehler im Zeichner | Workers Paid buchen; das Blatt reicht der Zehn-Minuten-Lauf nach (zwei Versuche) |
| Seite der Instanz 503 „in Vorbereitung“ | Status `einrichtung` | Vorschau-Link nutzen oder live schalten |
| Seite der Instanz 503 mit Kontakt | `pausiert` (Zahlung offen nach Kulanz, Pause) | Zahlung klären; mit Zahlung schaltet der Server von selbst frei |
| Alle Instanzen 503 „Störung“ | Supabase nicht erreichbar und kein Stand im Zwischenspeicher | Supabase-Status prüfen; mit KV `INSTANZEN` bleiben bekannte Instanzen erreichbar |
| Host zeigt die eeziframes-Startseite | Tabellen der Instanzen fehlen (`supabase/schema.sql` nicht erneut ausgeführt) | Schema ausführen |
| Kunde findet seine Seite nicht bei Google | Essential ist bewusst noindex; Plus/Signature brauchen Zeit | Search Console beim Kunden, `sitemap.xml` der Instanz |
| Paket-Kasse im Live-Modus zu | `PAKETE_OFFEN` fehlt oder `paketVerkaufStand()` vermisst etwas (Übersicht der Zentrale) | siehe [BESTELLUNG.md](BESTELLUNG.md), „Verkauf an- und ausschalten“ |

### Später (nur entworfen)

Weg 2: Subdomain beim Betrieb (`konfigurator.betrieb.de`) per CNAME über Cloudflare for SaaS (eigene Zone, Fallback-Origin, Worker-Route `*/*`, Host erst nach TXT-Nachweis). Tabelle (`weg = 'saas'`) und Weiche tragen das schon. Keine Einbettung per iframe, keine Mitarbeiter-Selbstverwaltung, keine Bestellung durch den Inhaber im Auftrag (E30).

### Nacharbeit nach der Prüfung (23.10.2026, `docs/instanzen/PRUEFBEFUNDE.md`)

- **Löschen (Befund 1):** `instanzDatenLoeschen` löscht die Anmeldung eines Dashboard-Zugangs nur, wenn `anmeldungGebraucht` nichts findet: Betrieb, Partner, andere Instanz, lebende Aufmaße eines Hauseigentümers (`eigene`). Dieselbe Prüfung nutzt `partnerAufraeumen`.
- **Zeiten (Befund 4):** Alle Zeitstempel der Instanz-Anfragen (Link-Objekt, Mail, PDF, Dashboard) entstehen in deutscher Zeit (`adapter.js`: `stempelBerlin`, `datumBerlin`, `zeitenBerlin`). Der Altbestand bleibt bei `stamp()`/`datum()` (UTC im Worker); das entscheidet der Inhaber.
- **Suchmaschinen (Befund 3):** Der erste Livegang (`uebergang(…, 'live')` aus `freigabe`) setzt `instanzen.indexierung = true`, wenn das Merkmal `indexierung` des Pakets `start` ist (Plus, Signature). Fortsetzen nach einer Pause setzt nichts; der Schalter unter „Betrieb“ bleibt zum Abschalten.
- **Paketwechsel nach unten (Befund 10):** erst zum Periodenende. `bestellungen.abo.wechsel = { paket, von, ab }` (ISO), `abo.paket` ist schon das Ziel (Stripe-Preis sofort, ohne Ausgleich). `wechselAnwenden` (Tageslauf oder `invoice.paid`) ruft `paketSetzen`, sobald `ab` erreicht ist. Nach oben sofort, eine Vormerkung entfällt dabei. Kundenkonto (`abo.wechsel` in der Sicht) und Zentrale zeigen „wirkt ab …“.
- **Dateien (Befund 9):** Ein verworfener, nie bezahlter Entwurf verliert seine Dateien sofort (`uebergang` nach `storniert`); stornierte Bestellungen ohne Instanz nach `loeschenNachEndeTage` im Tageslauf.
- **Aufbewahrung (Befund 21):** `partnerAufraeumen` (am Ende von `bestellungenLauf`) löscht Partner, deren Bestellungen alle beendet oder storniert sind, nach `FRISTEN.nachrichtenJahre` (ab dem Jahresende des Vertragsendes): Nachrichten, Bestellungen, Partnerzeile, Anmeldung (wenn nicht gebraucht). Höchstens 20 je Lauf, Protokoll `loeschen`.
- **Abo neu starten (Befund 22):** nur in `live` oder `pausiert`; aus `freigabe` startet das Abo allein über `uebergang(…, 'live')`.
- **Webhook (Befund 19):** Resend-Ereignisse werden erst nach der Verarbeitung vermerkt (`ereignisBekannt` → verarbeiten → `ereignisNeu`), wie beim Stripe-Webhook; bei einer Störung antwortet der Server mit 500 und die Wiederholung wird verarbeitet.
- **Dashboard (Befund 16):** Zeilen mit `art: 'test'` erscheinen nur im Status `einrichtung`; nach dem Livegang weder in der Liste noch einzeln (404) noch im Export.
- **Frage ohne Konto (Befund 8):** landet im Kundenkonto nie als Nachricht des Partners, sondern als `von: 'system'` mit dem Vorsatz „Frage über das Formular ohne Anmeldung (Absender nicht bestätigt)“.
- **Schnipsel (Befund 18):** `schnipsel(host, { farbe })` liefert einen Knopf „Fenster planen“ mit Inline-Stil (44 px, Firmenfarbe mit dunkler Schrift, sonst dunkel mit weißer Schrift).
- **Impressum-E-Mail (Befund 17, teilweise):** `instanzAusBestellung` nimmt `wunsch.firma.mailImpressum`, sonst die Anmeldeadresse. Das Formularfeld im Bestellformular fehlt noch.
- **Neutraler Absender (Befund 2), Rechtsvorlage (Befund 5):** siehe „Einrichtung je Kunde“ und die Live-Ampel (Punkte `absender` und `vorlage` sind Hinweise, sie sperren nicht; die Paket-Kasse bleibt im Live-Modus zu, bis die Vorlage anwaltlich geprüft ist, `paketVerkaufStand`).
- **Offen (kann, wenig Aufwand, bewusst verschoben):** Befunde 11 (Hinweis „Bestellung bald möglich“ schon in Schritt 1), 13 (Kopf-Pille der Verkaufsseite als Ring-Knopf), 15 (Rückruf: vergangene Fenster und Feiertage), 17 (Formularfeld „E-Mail im Impressum“).

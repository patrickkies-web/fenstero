// eeziframes · Hilfsobjekt h für die Prüfabschnitte 23–31 (Konfigurator-Instanzen, docs/INSTANZEN.md; 31 Vermittlung, docs/VERMITTLUNG.md), geladen von scripts/pruefen.mjs
//
// Jeder Abschnitt ist ein Modul scripts/pruefen-instanzen/<n>.mjs (dazu beliebig viele <n>-<name>.mjs, die vorher laufen):
//   export const titel = '…';                  optional, Zeile in der Ausgabe
//   export default async (h) => { h.ok(bedingung, 'Satz'); … };
// h startet einen eigenen Testserver (Attrappen für Daten, Mail, KI, Zahlung; INSTANZ_CACHE_MS=0; Zentrale mit Passwort) und legt die
// Standard-Instanzen an: essential.localhost, plus.localhost (Alias plus-alias.localhost), signature.localhost, signature2.localhost.
//   h.ok(bed, text) · h.browser · h.neueSeite(ctx, base) · h.sauber(page, text) · h.foto(page, name) · h.telefon (Kontext fürs Telefon)
//   h.BASE                          Server der übrigen Suite (eeziframes.com im Pilotmodus, ohne Attrappen)
//   h.port · h.base(host)           'http://<host>:<port>' des Instanz-Testservers (host Vorgabe: localhost)
//   h.api(host, pfad, init)         Anfrage mit Kopfzeile Host; init { method, body (Objekt → JSON, Text, Buffer), headers, cookie,
//                                   origin (true = eigene Herkunft) } → { status, headers, text, json, buf, cookies }
//   h.instanzen                     { essential|plus|signature|signature2: { id, id8, slug, betrieb, paket, status, host } }
//   h.instanz(sel, patch)           Felder einer Instanz setzen (sel: Host, slug oder { id }), → neue Zeile
//   h.saat(body)                    weitere Instanzen anlegen ({ instanzen: [{ slug, paket, name, plz, host?, alias?, status? }] })
//   h.attrappe()                    Inhalt der Attrappe (instanzen, hosts, anfragen, nachrichten, betriebe,
//                                   entwuerfe, ablage je Bucket, queue)
//   h.post({ anhaenge })            verschickte Mails (Attrappe), mit anhaenge: true samt Anhängen als Base64 (anhangDaten)
//   h.zentrale()                    angemeldete Zentrale: { cookie, kopf, api(pfad, init) }
//   h.uhr(tage)                     Uhr des Servers um tage vorstellen (JETZT läuft weiter); h.uhr(null) stellt sie zurück
//   h.geplant(cron)                 geplanten Lauf ausführen (CRON_TAEGLICH, CRON_ZEHN, CRON_ABRECHNUNG aus router.js) → Ergebnis
//   h.server(env)                   weiterer Testserver mit eigenen Variablen (z. B. { QUEUE_ATTRAPPE: '1' }, { PAKETE_OFFEN: '1' }),
//                                   gleiche Hilfen (base, api, post, …); wird am Ende beendet
import cp from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ORDNER = path.join(WURZEL, 'scripts/pruefen-instanzen');
export const PASSWORT = 'pruef-zentrale-instanzen-23';
export const TITEL = { 23: 'Mandant, Routing, Schutz (Instanzen)', 24: 'Eingang der Anfragen (Instanzen)', 25: 'App im Instanz-Modus', 26: 'Aufträge: Bestellung, Kundenbereich, Zentrale', 28: 'Signature-Dashboard', 29: 'Verkaufsseite, Recht, Doku', 31: 'Vermittlung: Suche, Code, Anfrage, Zentrale' };
const GRUND = { KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', INSTANZ_CACHE_MS: '0', ZENTRALE_PASSWORT: PASSWORT };

/* Module eines Abschnitts: <n>-<name>.mjs (alphabetisch) vor <n>.mjs */
export function module(n) {
  const re = new RegExp('^' + n + '(-[a-z0-9-]+)?\\.mjs$');
  return fs.readdirSync(ORDNER).filter((f) => re.test(f)).sort().map((f) => ({ datei: f, url: pathToFileURL(path.join(ORDNER, f)).href }));
}

export async function testserver(extra, freierPort) {
  const port = await freierPort();
  const env = Object.assign({}, process.env, GRUND, extra || {}, { PORT: String(port) });
  delete env.BASE; delete env.SERVER_PORT;
  const kind = cp.spawn(process.execPath, [path.join(WURZEL, 'scripts/dev-server.mjs')], { env: env, stdio: ['ignore', 'ignore', 'pipe'] });
  kind.stderr.on('data', (d) => process.stderr.write('  [Instanz-Server ' + port + '] ' + d));
  const stop = () => { try { kind.kill(); } catch (e) { /* schon weg */ } };
  process.on('exit', stop);
  const base = (host) => 'http://' + (host || 'localhost') + ':' + port;
  function api(host, pfad, init) {
    init = init || {};
    const roh = init.body === undefined ? null : typeof init.body === 'string' || Buffer.isBuffer(init.body) ? init.body : JSON.stringify(init.body);
    const kopf = Object.assign({ host: (host || 'localhost') + ':' + port }, roh !== null && typeof init.body === 'object' && !Buffer.isBuffer(init.body) ? { 'content-type': 'application/json' } : {},
      init.cookie ? { cookie: init.cookie } : {}, init.origin ? { origin: init.origin === true ? base(host) : init.origin } : {}, init.headers || {});
    if (roh !== null) kopf['content-length'] = Buffer.byteLength(roh);
    return new Promise((ja, nein) => {
      const r = http.request({ host: '127.0.0.1', port: port, path: pfad, method: init.method || (roh !== null ? 'POST' : 'GET'), headers: kopf }, (res) => {
        const teile = [];
        res.on('data', (d) => teile.push(d));
        res.on('end', () => { const buf = Buffer.concat(teile), text = buf.toString('utf8'); let json = null; try { json = JSON.parse(text); } catch (e) { json = null; } ja({ status: res.statusCode, headers: res.headers, text: text, json: json, buf: buf, cookies: [].concat(res.headers['set-cookie'] || []) }); });
      });
      r.on('error', nein);
      if (roh !== null) r.write(roh);
      r.end();
    });
  }
  let bereit = false;
  for (let i = 0; i < 100 && !bereit; i++) { await new Promise((r) => setTimeout(r, 150)); try { bereit = (await api('localhost', '/api/status')).status === 200; } catch (e) { /* noch nicht */ } }
  if (!bereit) { stop(); throw new Error('Instanz-Testserver auf Port ' + port + ' kam nicht hoch'); }
  let zentraleSitzung = null;
  const s = {
    port: port, base: base, api: api, stop: stop,
    saat: async (body) => (await api('localhost', '/__saat', { body: body || {} })).json.instanzen,
    instanz: async (sel, patch) => { const b = typeof sel === 'object' ? Object.assign({}, sel) : String(sel).includes('.') ? { host: sel } : { slug: sel }; b.patch = patch || {}; const r = await api('localhost', '/__instanz', { body: b }); return r.json && r.json.instanz; },
    attrappe: async () => (await api('localhost', '/__attrappe')).json,
    post: async (o) => { const r = await api('localhost', '/api/test/post' + (o && o.anhaenge ? '?anhaenge=1' : '')); return (r.json && r.json.post) || []; },
    uhr: async (tage) => (await api('localhost', '/__jetzt' + (tage === null || tage === undefined ? '' : '?tage=' + encodeURIComponent(tage)), { method: 'POST', body: {} })).json.jetzt,
    geplant: async (cron) => (await api('localhost', '/__scheduled?cron=' + encodeURIComponent(cron || ''))).json.ergebnis,
    /* einmal anmelden und die Sitzung behalten (die Zentrale bremst Anmeldungen je Adresse) */
    zentrale: async () => {
      if (!zentraleSitzung) {
        const r = await api('localhost', '/api/zentrale/anmelden', { body: { passwort: PASSWORT }, headers: { 'x-forwarded-for': '10.23.' + (port % 250) + '.1' } });
        const cookie = (r.cookies[0] || '').split(';')[0];
        if (r.status !== 200 || !cookie) throw new Error('Zentrale: Anmeldung fehlgeschlagen (' + r.status + ')');
        const kopf = { cookie: cookie, 'x-zentrale': '1' };
        zentraleSitzung = { cookie: cookie, kopf: kopf, api: (pfad, init) => api('localhost', pfad, Object.assign({}, init || {}, { headers: Object.assign({}, kopf, (init || {}).headers || {}) })) };
      }
      return zentraleSitzung;
    }
  };
  return s;
}

/* o: { browser, ok, neueSeite, sauber, foto, telefon, BASE, freierPort } aus scripts/pruefen.mjs */
export async function hilfe(o) {
  const laufend = [];
  const start = async (env) => { const s = await testserver(env, o.freierPort); laufend.push(s); return s; };
  const haupt = await start({});
  const instanzen = await haupt.saat();
  return Object.assign({}, haupt, {
    ok: o.ok, browser: o.browser, sauber: o.sauber, foto: o.foto, telefon: o.telefon, BASE: o.BASE, WURZEL: WURZEL, PASSWORT: PASSWORT,
    neueSeite: (ctx, base) => o.neueSeite(ctx, base || haupt.base()),
    instanzen: instanzen,
    server: async (env) => { const s = await start(env); await s.saat(); return s; },
    aufraeumen: () => { laufend.forEach((s) => s.stop()); }
  });
}

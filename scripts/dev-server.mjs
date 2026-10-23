// eeziframes · lokaler Testserver, verhält sich wie der Cloudflare Worker:
// jede Anfrage läuft durch worker.js (wie bei Cloudflare), env.ASSETS liefert die Dateien aus web/ mit den Kopfzeilen aus web/_headers
// (fehlt eine Datei: 404 ohne Fehlerseite, die Fehlerseite liefert worker.js). Die Adresse kommt aus der Kopfzeile Host, damit sich die
// Konfigurator-Instanzen unter http://essential.localhost:8788 usw. prüfen lassen (Chromium löst *.localhost selbst auf).
//
//   node scripts/dev-server.mjs                   Pilotmodus: ohne KI, ohne Zahlung, ohne Datenbank
//   KI_ATTRAPPE=1                                  KI mit festen Beispielantworten (kein Schlüssel nötig)
//   KI_VERZOEGERUNG_MS=20000                       dazu: jede Antwort erst nach dieser Zeit, wie eine echte Auswertung
//   ZAHLUNG_ATTRAPPE=1 DATEN_ATTRAPPE=1            Stripe und Datenbank nachgestellt: Anmeldecode 123456, Kassen kehren sofort als bezahlt zurück
//   MAIL_ATTRAPPE=1                                Mailversand nachgestellt (Vertragsbestätigung, Widerruf); lesbar unter /api/test/post
//   QUEUE_ATTRAPPE=1                               Warteschlange EINGANG nachgestellt (ruft den Consumer worker.queue direkt auf)
//   Nur mit DATEN_ATTRAPPE=1, nie im Worker (docs/INSTANZEN.md, Prüfung):
//     GET  /__scheduled?cron=…                     geplanten Lauf ausführen (wie wrangler dev --test-scheduled), Antwort: Ergebnis
//     POST /__jetzt?tage=N                         Uhr des Servers um N Tage vorstellen (Variable JETZT, läuft weiter); ohne tage: zurück
//     POST /__saat                                 Instanzen essential, plus, signature, signature2 (*.localhost) anlegen; Body { instanzen: […] }
//     POST /__instanz                              { host | id | slug, patch } Felder einer Instanz setzen
//     GET  /__attrappe                             Inhalt der Attrappe zu den Instanzen, Ablagen und Warteschlange
//     POST /__stripe                               Stripe-Ereignis der Konfigurator-Pakete wie über den Webhook (nur ZAHLUNG_ATTRAPPE=1):
//                                                  { type: 'invoice.payment_failed', object: { subscription: 'sub_test_…' } }
//     GET  /__sitzung?bereich=…  /__sitzung/lesen?bereich=…   Sitzung zum Prüfen ausstellen bzw. lesen (sitzung.js)
//   ANTHROPIC_API_KEY=… STRIPE_SECRET_KEY=… SUPABASE_URL=… SUPABASE_SECRET_KEY=…   echte Dienste (Schlüssel nie ins Repo schreiben)
//
// Danach im Browser: http://localhost:8788
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = path.join(ROOT, 'web');
const PORT = Number(process.env.PORT || 8788);
const ATTRAPPE = process.env.KI_ATTRAPPE === '1';
const env = Object.assign({}, process.env, {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || (ATTRAPPE ? 'attrappe' : ''),
  KI_MODELL: process.env.KI_MODELL || ''
});

if (ATTRAPPE) {
  /* Feste Testantworten statt Anthropic. Die Zeile „Testauftrag“ spiegelt Aufgabe, Seite und Modell, damit die Prüfung sieht, was der Server geschickt hätte. */
  const echt = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (!String(url).startsWith('https://api.anthropic.com/')) return echt(url, opts);
    const body = JSON.parse(opts.body);
    const system = String(body.system || ''), satz = String((body.messages[0].content[1] || {}).text || '');
    const wand = system.includes('Wanddurchbruch'), aussen = satz.includes('von außen');
    const altesFenster = system.includes('Das bestehende Fenster wird ausgebaut');
    const daten = wand
      ? { foto_passt: true, neigung_grad: 0.6, rows: [[aussen ? 'Fassade' : 'Wand', aussen ? 'Putz, vermutlich Mauerwerk (Testantwort)' : 'Verputzt, vermutlich Außenwand (Testantwort)'], ['Elektro', 'Steckdose in der Fläche (Testantwort)'], ['Testauftrag', 'wand, ' + (aussen ? 'out' : 'in') + ', ' + body.model]], chips: ['Außenwand', 'Testantwort'], hinweise: ['Leitungen vor dem Durchbruch orten (Testantwort).'], vor_ort: ['Statik und Sturz klären (Testantwort).'], fach: aussen ? { fassade: 'putz', geschoss: 'eg', erreichbar: true, geruest: false } : { strom: true }, sicherheit: 0.5 }
      : { foto_passt: true, neigung_grad: 0.8, laibung_mm: aussen ? undefined : 160, rows: aussen
          ? [['Fassade', 'Putz auf Mauerwerk (Testantwort)'], ['Fensterbank außen', 'Aluminium mit Tropfkante (Testantwort)'], ['Testauftrag', 'einbau, out, ' + body.model + (altesFenster ? ', ohne Altfenster' : '') + ', max_tokens ' + body.max_tokens]]
          : [['Rollladen', 'Einbaukasten innen mit Revisionsdeckel (Testantwort)'], ['Anschlag', 'Innenanschlag (Testantwort)'], ['Testauftrag', 'einbau, in, ' + body.model + (altesFenster ? ', ohne Altfenster' : '') + ', max_tokens ' + body.max_tokens]],
        chips: aussen ? ['Putzfassade', 'Testantwort'] : ['Rollladenkasten innen', 'Testantwort'], hinweise: ['Dies ist eine Testantwort des lokalen Servers.'], vor_ort: ['Dämmung des Rollladenkastens prüfen (Testantwort).'],
        /* feste Werte und Seitenverhältnis wie ein Fenster von 1.230 × 1.410 mm; „unklar“ und Unbekanntes muss die App verwerfen */
        fach: aussen ? { rollladen: 'keiner', anschlag: 'aussen', fassade: 'klinker', fensterbank: 'aluminium', geschoss: 'eg', erreichbar: true, geruest: false } : { rollladen: 'einbau', anschlag: 'innen', fensterbank: 'unklar', bruestung: 'normal', strom: false, quatsch: 'x' },
        verhaeltnis: 0.87, sicherheit: 0.5 };
    /* KI_VERZOEGERUNG_MS: so lange wie eine echte Auswertung (etwa 15 bis 30 Sekunden), damit sich Speichern und neue Fenster währenddessen prüfen lassen */
    const warten = Number(process.env.KI_VERZOEGERUNG_MS) || 0;
    if (warten > 0) await new Promise((r) => setTimeout(r, warten));
    return new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(daten) }], stop_reason: 'end_turn' }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
const { konfig } = await import(pathToFileURL(path.join(ROOT, 'functions/api/umgebung.js')).href);
const { speicher, attrappeStand } = await import(pathToFileURL(path.join(ROOT, 'functions/api/speicher.js')).href);
const { ablage, ABLAGEN } = await import(pathToFileURL(path.join(ROOT, 'functions/api/fotos.js')).href);
const sitzung = await import(pathToFileURL(path.join(ROOT, 'functions/api/sitzung.js')).href);
const { zahlungsdienst } = await import(pathToFileURL(path.join(ROOT, 'functions/api/stripe.js')).href);
const { istPaketEreignis, paketEreignis } = await import(pathToFileURL(path.join(ROOT, 'functions/api/bestellung.js')).href);

/* _headers lesen: Zeile ohne Einzug = Pfad (mit * am Ende), eingerückt = Kopfzeile, „! Name“ nimmt eine Kopfzeile wieder weg */
const regeln = [];
try {
  let cur = null;
  for (const zeile of (await readFile(path.join(WEB, '_headers'), 'utf8')).split('\n')) {
    if (!zeile.trim() || zeile.trim().startsWith('#')) continue;
    if (!/^\s/.test(zeile)) { cur = { muster: zeile.trim(), kopf: [] }; regeln.push(cur); continue; }
    if (cur && zeile.trim().startsWith('! ')) { cur.kopf.push(['!', zeile.trim().slice(2).trim()]); continue; }
    const i = zeile.indexOf(':');
    if (cur && i > 0) cur.kopf.push([zeile.slice(0, i).trim(), zeile.slice(i + 1).trim()]);
  }
} catch (e) { /* ohne _headers */ }
const passt = (muster, p) => (muster.endsWith('*') ? p.startsWith(muster.slice(0, -1)) : p === muster);
const kopfzeilen = (p) => regeln.filter((r) => passt(r.muster, p)).flatMap((r) => r.kopf);

const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf' };

async function datei(p) {
  try { const s = await stat(p); return s.isFile() ? p : s.isDirectory() ? 'dir' : null; } catch (e) { return null; }
}

/* wie env.ASSETS bei Cloudflare ohne not_found_handling: Datei aus web/ mit Kopfzeilen aus _headers; Ordner ohne Schrägstrich leiten
   weiter; fehlt die Datei, 404 ohne Inhalt (die Fehlerseite liefert worker.js) */
async function statisch(url) {
  let p = '';
  try { p = decodeURIComponent(url.pathname); } catch (e) { return new Response('', { status: 400 }); }
  if (p.includes('..')) return new Response('', { status: 400 });
  let ziel = path.join(WEB, p);
  let gefunden = await datei(ziel);
  if (gefunden === 'dir') {
    if (!p.endsWith('/')) return new Response('', { status: 308, headers: { location: p + '/' + url.search } });
    ziel = path.join(ziel, 'index.html'); gefunden = await datei(ziel);
  }
  if (!gefunden || path.basename(ziel).startsWith('_')) return new Response('', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const kopf = new Headers({ 'content-type': TYPEN[path.extname(ziel)] || 'application/octet-stream' });
  for (const [k, v] of kopfzeilen(p)) { if (k === '!') kopf.delete(v); else kopf.set(k, v); }
  return new Response(await readFile(ziel), { status: 200, headers: kopf });
}
env.ASSETS = { fetch: (r) => statisch(new URL(typeof r === 'string' ? r : r.url)) };

/* Uhr des Servers für die Prüfung: JETZT läuft mit dem Versatz weiter (umgebung.js jetztAus liest env.JETZT bei jeder Anfrage) */
let versatz = null;
const jetztStart = process.env.JETZT || '';
Object.defineProperty(env, 'JETZT', { enumerable: true, configurable: true, get: () => (versatz !== null ? new Date(Date.now() + versatz).toISOString() : jetztStart || undefined) });

/* ctx wie im Worker: waitUntil sammelt die Aufgaben, damit /__scheduled auf sie warten kann */
const neuerCtx = () => { const offen = []; return { offen, waitUntil(p) { offen.push(Promise.resolve(p).then((v) => v, (e) => { console.error(e); return { ok: false, fehler: String(e && e.message ? e.message : e) }; })); }, passThroughOnException() {} }; };

/* Warteschlange EINGANG nachgestellt: send() ruft den Consumer (worker.queue) gleich danach direkt auf */
const queueLog = [];
if (process.env.QUEUE_ATTRAPPE === '1') {
  const zustellen = (bodies) => setImmediate(async () => {
    if (typeof worker.queue !== 'function') return;
    const c = neuerCtx(), messages = bodies.map((b, i) => ({ id: 'q' + Date.now().toString(36) + i, timestamp: new Date(), body: b, attempts: 1, ack() { this.erledigt = true; }, retry() { this.nochmal = true; } }));
    try { await worker.queue({ queue: 'eezi-eingang', messages, ackAll() {}, retryAll() {} }, env, c); await Promise.all(c.offen); } catch (e) { console.error(e); }
  });
  env.EINGANG = {
    async send(body) { queueLog.push({ body, zeit: new Date().toISOString() }); zustellen([body]); },
    async sendBatch(liste) { const bodies = (liste || []).map((m) => m.body); bodies.forEach((body) => queueLog.push({ body, zeit: new Date().toISOString() })); zustellen(bodies); }
  };
}

/* Standard-Instanzen der Prüfung (docs/INSTANZEN.md): je Paket eine, dazu eine zweite Signature-Instanz; plus hat einen Alias-Host */
const STANDARD = [
  { slug: 'essential', paket: 'essential', name: 'Fensterbau Amsel', plz: '50667', ort: 'Köln', strasse: 'Amselweg 1', farbe: '' },
  { slug: 'plus', paket: 'plus', name: 'Glaserei Fink', plz: '50823', ort: 'Köln', strasse: 'Finkenstraße 2', farbe: '#8fb8e8', alias: ['plus-alias.localhost'] },
  { slug: 'signature', paket: 'signature', name: 'Fensterwerk Specht', plz: '40210', ort: 'Düsseldorf', strasse: 'Spechtallee 3', farbe: '#f0c36a' },
  { slug: 'signature2', paket: 'signature', name: 'Holzfenster Meise', plz: '33602', ort: 'Bielefeld', strasse: 'Meisenplatz 4', farbe: '#9fd3c7' }
];
const id8 = (id) => String(id).replace(/-/g, '').slice(0, 8);
async function saat(body) {
  const sp = speicher(konfig(env)), liste = Array.isArray(body && body.instanzen) && body.instanzen.length ? body.instanzen : STANDARD, out = {}, iso = new Date().toISOString();
  for (const [n, e] of liste.entries()) {
    const host = e.host || e.slug + '.localhost';
    let inst = (await sp.instanzenAlle()).find((i) => i.slug === e.slug);
    if (!inst) {
      const tel = e.tel || '0221 555 0' + (n + 1), mail = e.mail || 'kontakt@' + e.slug + '.example', ap = e.ap || 'Petra ' + String(e.name).split(' ').pop();
      const id = await sp.instanzAnlegen({ slug: e.slug, name: e.name, plz: e.plz, paket: e.paket,
        eingang: { mails: [{ mail: 'anfragen@' + e.slug + '.example', bestaetigt: iso, eingeladen: iso }] },
        zugang: e.paket === 'signature' ? [{ mail: 'team@' + e.slug + '.example', uid: null, name: ap, rolle: 'inhaber', bestaetigt: iso, zuletzt: null, aus: false }] : [],
        recht: { firma: e.name, rechtsform: 'GmbH', vertretung: ap, strasse: e.strasse || 'Hauptstraße 1', plz: e.plz, ort: e.ort || 'Köln', land: 'DE', tel: tel, mail: mail, register: 'Amtsgericht Köln, HRB 1' + (n + 1) + '000', ust: 'DE12345678' + (n + 1), bundesland: e.bundesland || 'NW', stand: iso.slice(0, 10) },
        betriebDaten: { ap: ap, tel: tel, mail: mail, since: 2026, einladung: { ansprechpartner: ap, telefon: tel, mail: mail } } });
      await sp.instanzAendern(id, (z) => { z.status = e.status || 'aktiv'; z.marke = { name: e.name, farbe: e.farbe || '', v: 1, bilder: {}, start: {} }; if (e.indexierung !== undefined) z.indexierung = !!e.indexierung; });
      await sp.hostAnlegen({ host: host, instanz: id, haupt: true, status: 'aktiv' });
      for (const a of e.alias || []) await sp.hostAnlegen({ host: a, instanz: id, haupt: false, status: 'umleiten' });
      inst = await sp.instanzHolen(id);
    }
    out[e.slug] = { id: inst.id, id8: id8(inst.id), slug: inst.slug, betrieb: inst.betrieb, paket: inst.paket, status: inst.status, host: ((await sp.hostsVon(inst.id)).find((h) => h.haupt) || {}).host || host };
  }
  return out;
}
async function instanzSetzen(b) {
  const sp = speicher(konfig(env)); b = b || {};
  let id = b.id;
  if (!id && b.host) { const t = await sp.instanzFuerHost(b.host); id = t && t.instanz.id; }
  if (!id && b.slug) id = ((await sp.instanzenAlle()).find((i) => i.slug === b.slug) || {}).id;
  if (!id) return null;
  return sp.instanzAendern(id, (z) => { Object.assign(z, b.patch || {}); });
}
const devJson = (obj, status, extra) => new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, extra || {}) });

/* Nur lokal und nur mit nachgestellter Datenbank: Hilfen für die Prüfung (nie im Worker) */
async function dev(request, url) {
  if (env.DATEN_ATTRAPPE !== '1') return null;
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
  switch (url.pathname) {
    case '/__scheduled': { const c = neuerCtx(); await worker.scheduled({ cron: url.searchParams.get('cron') || '', scheduledTime: Date.now() }, env, c); const r = await Promise.all(c.offen); return devJson({ ok: true, ergebnis: r[0] || null }); }
    case '/__jetzt': { const t = url.searchParams.get('tage'); versatz = t === null || t === '' || t === 'aus' ? null : Number(t) * 864e5; if (Number.isNaN(versatz)) versatz = null; return devJson({ ok: true, jetzt: env.JETZT || null }); }
    case '/__saat': return devJson({ ok: true, instanzen: await saat(body) });
    case '/__instanz': { const r = await instanzSetzen(body); return r ? devJson({ ok: true, instanz: r }) : devJson({ ok: false, fehler: 'unbekannt' }, 404); }
    case '/__attrappe': return devJson(Object.assign({ ok: true }, attrappeStand(), { ablage: Object.fromEntries(Object.keys(ABLAGEN).map((a) => [a, ablage(konfig(env), a).alle()])), queue: queueLog }));
    /* Stripe-Ereignis der Konfigurator-Pakete wie über den Webhook (zahlung.js → bestellung.js paketEreignis), nur mit der Zahlungs-Attrappe:
       ohne Stripe gibt es kein Webhook-Geheimnis. Body { type, object }, z. B. invoice.payment_failed mit { subscription: <Abo der Bestellung> } */
    case '/__stripe': {
      if (env.ZAHLUNG_ATTRAPPE !== '1' || env.STRIPE_SECRET_KEY) return devJson({ ok: false, fehler: 'nur mit ZAHLUNG_ATTRAPPE=1 ohne Stripe' }, 400);
      const k = konfig(env), c = neuerCtx(), sp = speicher(k);
      const ctx = { k, env, sp, zd: zahlungsdienst(k), request, url, body: null, roh: '', params: {}, waitUntil: c.waitUntil, instanz: null, zaehlen: () => {} };
      const ev = { id: 'evt_dev_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), type: String(body.type || ''), data: { object: body.object || {} } };
      const paket = await istPaketEreignis(ctx, ev), ergebnis = paket ? await paketEreignis(ctx, ev) : null;
      await Promise.all(c.offen);
      return devJson({ ok: true, paket, ergebnis });
    }
    case '/__sitzung': { const ctx = { k: konfig(env), env, request, url }; const b = url.searchParams.get('bereich') || 'betrieb'; return devJson({ ok: true }, 200, { 'set-cookie': await sitzung.sitzungSetzen(ctx, b, { sub: url.searchParams.get('sub') || 'pruef-nutzer', mail: 'pruef@beispiel.example' }) }); }
    case '/__sitzung/lesen': { const ctx = { k: konfig(env), env, request, url }; return devJson({ ok: true, sitzung: await sitzung.sitzungLesen(ctx, url.searchParams.get('bereich') || 'betrieb') }); }
    default: return null;
  }
}

/* Host der Anfrage aus der Kopfzeile (nur Name und Port, sonst localhost) */
const hostAus = (h) => (/^[a-z0-9.-]+(:\d{1,5})?$/i.test(h) || /^\[[0-9a-f:.]+\](:\d{1,5})?$/i.test(h) ? h : 'localhost:' + PORT);

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://' + hostAus(String(req.headers.host || '')));
    const teile = [];
    if (!['GET', 'HEAD'].includes(req.method)) for await (const t of req) teile.push(t);
    const request = new Request(url.href, { method: req.method, headers: req.headers, body: teile.length || !['GET', 'HEAD'].includes(req.method) ? Buffer.concat(teile) : undefined });
    const c = neuerCtx();
    const antwort = (url.pathname.startsWith('/__') ? await dev(request, url) : null) || (await worker.fetch(request, env, c));
    const kopf = {};
    for (const [k, v] of antwort.headers) if (k !== 'set-cookie') kopf[k] = v;
    const kekse = antwort.headers.getSetCookie ? antwort.headers.getSetCookie() : [];
    if (kekse.length) kopf['set-cookie'] = kekse;
    res.writeHead(antwort.status, kopf);
    res.end(Buffer.from(await antwort.arrayBuffer()));
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500);
    res.end('Fehler');
  }
}).listen(PORT, () => console.log('eeziframes lokal: http://localhost:' + PORT + (ATTRAPPE ? '  (KI-Attrappe)' : env.ANTHROPIC_API_KEY ? '  (echte KI)' : '  (ohne KI)') + (env.DATEN_ATTRAPPE === '1' ? '  (Daten-Attrappe, Anmeldecode 123456)' : env.SUPABASE_URL ? '  (Supabase)' : '') + (env.ZAHLUNG_ATTRAPPE === '1' ? '  (Zahlungs-Attrappe)' : env.STRIPE_SECRET_KEY ? '  (Stripe)' : '')));

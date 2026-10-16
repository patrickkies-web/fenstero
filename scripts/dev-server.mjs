// eeziframes · lokaler Testserver, verhält sich wie der Cloudflare Worker:
// statische Dateien aus web/, Kopfzeilen aus web/_headers, alles unter /api/ aus functions/api/router.js.
//
//   node scripts/dev-server.mjs                   Pilotmodus: ohne KI, ohne Zahlung, ohne Datenbank
//   KI_ATTRAPPE=1                                  KI mit festen Beispielantworten (kein Schlüssel nötig)
//   ZAHLUNG_ATTRAPPE=1 DATEN_ATTRAPPE=1            Stripe und Datenbank nachgestellt: Anmeldecode 123456, Kassen kehren sofort als bezahlt zurück
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
          ? [['Fassade', 'Putz auf Mauerwerk (Testantwort)'], ['Fensterbank außen', 'Aluminium mit Tropfkante (Testantwort)'], ['Testauftrag', 'einbau, out, ' + body.model + (altesFenster ? ', ohne Altfenster' : '')]]
          : [['Rollladen', 'Einbaukasten innen mit Revisionsdeckel (Testantwort)'], ['Anschlag', 'Innenanschlag (Testantwort)'], ['Testauftrag', 'einbau, in, ' + body.model + (altesFenster ? ', ohne Altfenster' : '')]],
        chips: aussen ? ['Putzfassade', 'Testantwort'] : ['Rollladenkasten innen', 'Testantwort'], hinweise: ['Dies ist eine Testantwort des lokalen Servers.'], vor_ort: ['Dämmung des Rollladenkastens prüfen (Testantwort).'],
        /* feste Werte und Seitenverhältnis wie ein Fenster von 1.230 × 1.410 mm; „unklar“ und Unbekanntes muss die App verwerfen */
        fach: aussen ? { rollladen: 'keiner', anschlag: 'aussen', fassade: 'klinker', fensterbank: 'aluminium', geschoss: 'eg', erreichbar: true, geruest: false } : { rollladen: 'einbau', anschlag: 'innen', fensterbank: 'unklar', bruestung: 'normal', strom: false, quatsch: 'x' },
        verhaeltnis: 0.87, sicherheit: 0.5 };
    return new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(daten) }], stop_reason: 'end_turn' }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

const { api } = await import(pathToFileURL(path.join(ROOT, 'functions/api/router.js')).href);
const { behandeln } = await import(pathToFileURL(path.join(ROOT, 'functions/seo.js')).href);
const { seitenaufruf } = await import(pathToFileURL(path.join(ROOT, 'functions/api/statistik.js')).href);

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

const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

async function datei(p) {
  try { const s = await stat(p); return s.isFile() ? p : s.isDirectory() ? 'dir' : null; } catch (e) { return null; }
}

/* Datei aus web/ als Response, mit Kopfzeilen aus _headers; Ordner ohne Schrägstrich leiten weiter, Unbekanntes bekommt 404.html */
async function statisch(url) {
  const p = decodeURIComponent(url.pathname);
  if (p.includes('..')) return new Response('', { status: 400 });
  let ziel = path.join(WEB, p);
  let gefunden = await datei(ziel);
  if (gefunden === 'dir') {
    if (!p.endsWith('/')) return new Response('', { status: 308, headers: { location: p + '/' + url.search } });
    ziel = path.join(ziel, 'index.html'); gefunden = await datei(ziel);
  }
  let status = 200;
  if (!gefunden || path.basename(ziel).startsWith('_')) { ziel = path.join(WEB, '404.html'); status = 404; }
  const kopf = new Headers({ 'content-type': TYPEN[path.extname(ziel)] || 'application/octet-stream' });
  for (const [k, v] of kopfzeilen(p)) { if (k === '!') kopf.delete(v); else kopf.set(k, v); }
  return new Response(await readFile(ziel), { status: status, headers: kopf });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:' + PORT);
  try {
    if (url.pathname.startsWith('/api/')) {
      const teile = [];
      for await (const t of req) teile.push(t);
      const request = new Request(url.href, { method: req.method, headers: req.headers, body: ['POST', 'PATCH', 'PUT'].includes(req.method) ? Buffer.concat(teile) : undefined });
      const antwort = (await api(request, env, { waitUntil() {} })) || new Response('Not Found', { status: 404 });
      res.writeHead(antwort.status, Object.fromEntries(antwort.headers));
      res.end(Buffer.from(await antwort.arrayBuffer()));
      return;
    }
    /* Seiten, robots.txt, sitemap.xml wie beim Worker (functions/seo.js), sonst die Datei aus web/ */
    const request = new Request(url.href, { method: req.method, headers: req.headers });
    const seite = await behandeln(request, env, () => statisch(url));
    if (seite && (seite.status === 200 || seite.status === 304)) seitenaufruf(request, env).catch(() => false); // eigene Statistik wie im Worker
    const antwort = seite || (await statisch(url));
    res.writeHead(antwort.status, Object.fromEntries(antwort.headers));
    res.end(Buffer.from(await antwort.arrayBuffer()));
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end('Fehler');
  }
}).listen(PORT, () => console.log('eeziframes lokal: http://localhost:' + PORT + (ATTRAPPE ? '  (KI-Attrappe)' : env.ANTHROPIC_API_KEY ? '  (echte KI)' : '  (ohne KI)') + (env.DATEN_ATTRAPPE === '1' ? '  (Daten-Attrappe, Anmeldecode 123456)' : env.SUPABASE_URL ? '  (Supabase)' : '') + (env.ZAHLUNG_ATTRAPPE === '1' ? '  (Zahlungs-Attrappe)' : env.STRIPE_SECRET_KEY ? '  (Stripe)' : '')));

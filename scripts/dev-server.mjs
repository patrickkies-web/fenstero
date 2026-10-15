// eeziframes · lokaler Testserver, verhält sich wie der Cloudflare Worker:
// statische Dateien aus web/, Kopfzeilen aus web/_headers, alles unter /api/ aus functions/api/router.js.
//
//   node scripts/dev-server.mjs                   Pilotmodus: ohne KI, ohne Zahlung, ohne Datenbank
//   KI_ATTRAPPE=1                                  KI mit festen Beispielantworten (kein Schlüssel nötig)
//   ZAHLUNG_ATTRAPPE=1 DATEN_ATTRAPPE=1            Stripe und Datenbank nachgestellt: Anmeldecode 123456, Kassen kehren sofort als bezahlt zurück
//   ANTHROPIC_API_KEY=… STRIPE_SECRET_KEY=… SUPABASE_URL=… SUPABASE_SERVICE_KEY=… SUPABASE_ANON_KEY=…   echte Dienste (Schlüssel nie ins Repo schreiben)
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
  KI_MODELL_GENAU: process.env.KI_MODELL_GENAU || '',
  KI_MODELL_SCHNELL: process.env.KI_MODELL_SCHNELL || ''
});

if (ATTRAPPE) {
  const echt = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (!String(url).startsWith('https://api.anthropic.com/')) return echt(url, opts);
    const body = JSON.parse(opts.body);
    const auftrag = body.messages[0].content[1].text;
    const daten = auftrag.includes('Messsoftware')
      ? { fenster_gefunden: true, scheiben: [], element: { ol: [250, 180], or: [750, 180], ur: [750, 820], ul: [250, 820] }, oeffnung: { ol: [210, 140], or: [790, 140], ur: [790, 860], ul: [210, 860] }, laibung_mm: 160, neigung_grad: 0.8, fluegel: 2, teilung: '2 Flügel mit Pfosten', oeffnungsart: 'Dreh-Kipp', material: 'kunststoff', farbe: 'weiß', hinweise: 'Testantwort' }
      : { chips: ['Kunststoff, weiß', '2 Flügel Dreh-Kipp', 'Testantwort'], rows: [['Material', 'Kunststoff, weiß (Testantwort)'], ['Verglasung', '2-fach (Testantwort)']], hinweise: ['Dies ist eine Testantwort des lokalen Servers.'], sicherheit: 0.5 };
    return new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(daten) }], stop_reason: 'end_turn' }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

const { api } = await import(pathToFileURL(path.join(ROOT, 'functions/api/router.js')).href);

/* _headers lesen: Zeile ohne Einzug = Pfad (mit * am Ende), eingerückt = Kopfzeile */
const regeln = [];
try {
  let cur = null;
  for (const zeile of (await readFile(path.join(WEB, '_headers'), 'utf8')).split('\n')) {
    if (!zeile.trim() || zeile.trim().startsWith('#')) continue;
    if (!/^\s/.test(zeile)) { cur = { muster: zeile.trim(), kopf: [] }; regeln.push(cur); continue; }
    const i = zeile.indexOf(':');
    if (cur && i > 0) cur.kopf.push([zeile.slice(0, i).trim(), zeile.slice(i + 1).trim()]);
  }
} catch (e) { /* ohne _headers */ }
const passt = (muster, p) => (muster.endsWith('*') ? p.startsWith(muster.slice(0, -1)) : p === muster);
const kopfzeilen = (p) => regeln.filter((r) => passt(r.muster, p)).flatMap((r) => r.kopf);

const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

async function datei(p) {
  try { const s = await stat(p); return s.isFile() ? p : s.isDirectory() ? 'dir' : null; } catch (e) { return null; }
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
    let p = decodeURIComponent(url.pathname);
    if (p.includes('..')) { res.writeHead(400); res.end(); return; }
    let ziel = path.join(WEB, p);
    let gefunden = await datei(ziel);
    if (gefunden === 'dir') {
      if (!p.endsWith('/')) { res.writeHead(308, { location: p + '/' + url.search }); res.end(); return; }
      ziel = path.join(ziel, 'index.html'); gefunden = await datei(ziel);
    }
    let status = 200;
    if (!gefunden || path.basename(ziel).startsWith('_')) { ziel = path.join(WEB, '404.html'); status = 404; }
    const inhalt = await readFile(ziel);
    const kopf = { 'content-type': TYPEN[path.extname(ziel)] || 'application/octet-stream' };
    for (const [k, v] of kopfzeilen(p)) kopf[k] = v;
    res.writeHead(status, kopf);
    res.end(inhalt);
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end('Fehler');
  }
}).listen(PORT, () => console.log('eeziframes lokal: http://localhost:' + PORT + (ATTRAPPE ? '  (KI-Attrappe)' : env.ANTHROPIC_API_KEY ? '  (echte KI)' : '  (ohne KI)') + (env.DATEN_ATTRAPPE === '1' ? '  (Daten-Attrappe, Anmeldecode 123456)' : env.SUPABASE_URL ? '  (Supabase)' : '') + (env.ZAHLUNG_ATTRAPPE === '1' ? '  (Zahlungs-Attrappe)' : env.STRIPE_SECRET_KEY ? '  (Stripe)' : '')));

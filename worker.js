/* Fensterino auf Cloudflare Workers (Einstellungen in wrangler.jsonc)
   Die Website kommt als statische Dateien aus web/. Hier läuft nur /api/… durch:
   /api/ki ist die KI-Auswertung der Fotos aus functions/api/ki.js, dieselbe Datei wie für Cloudflare Pages und den lokalen Testserver. */
import * as ki from './functions/api/ki.js';

const json = (obj, status) => new Response(JSON.stringify(obj), {
  status: status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/ki') {
      const m = request.method;
      const fn = m === 'GET' || m === 'HEAD' ? ki.onRequestGet : m === 'POST' ? ki.onRequestPost : null;
      if (!fn) return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
      return fn({ request, env, params: {}, data: {}, waitUntil: (p) => ctx.waitUntil(p) });
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, fehler: 'not_found' }, 404);
    /* alles andere: Datei aus web/, sonst die Fehlerseite */
    return env.ASSETS.fetch(request);
  }
};

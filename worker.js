/* eeziframes auf Cloudflare Workers (Einstellungen in wrangler.jsonc)
   Die Website kommt als statische Dateien aus web/. Alles unter /api/… beantwortet functions/api/router.js:
   KI-Auswertung, Kauf des Aufmaßblatts (Stripe), Konten der Betriebe (Supabase), Eingang von Aufmaßen, Zentrale des Inhabers.
   Ohne eingerichtete Schlüssel läuft die Website im Pilotmodus weiter; /api/status sagt der App, was da ist.
   Ausgelieferte Seiten zählt die eigene Statistik als Tageszähler (functions/api/statistik.js), ohne Cookies und ohne Kennungen. */
import { api, geplant } from './functions/api/router.js';
import { behandeln } from './functions/seo.js';
import { seitenaufruf } from './functions/api/statistik.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const antwort = await api(request, env, ctx);
      if (antwort) return antwort;
    }
    /* Seiten, robots.txt, sitemap.xml: Freigabe für Suchmaschinen (Variable INDEXIERUNG) und Canonical, siehe functions/seo.js */
    const seo = await behandeln(request, env, (r) => env.ASSETS.fetch(r));
    if (seo) {
      if (seo.status === 200) ctx.waitUntil(seitenaufruf(request, env).catch(() => false));
      return seo;
    }
    /* alles andere: Datei aus web/, sonst die Fehlerseite */
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(geplant(env));
  }
};

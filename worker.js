/* eeziframes auf Cloudflare Workers (Einstellungen in wrangler.jsonc)
   Die Website kommt als statische Dateien aus web/. Alles unter /api/… beantwortet functions/api/router.js:
   KI-Auswertung, Kauf des Aufmaßblatts (Stripe), Konten der Betriebe (Supabase), Eingang von Aufmaßen.
   Ohne eingerichtete Schlüssel läuft die Website im Pilotmodus weiter; /api/status sagt der App, was da ist. */
import { api, geplant } from './functions/api/router.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const antwort = await api(request, env, ctx);
      if (antwort) return antwort;
    }
    /* alles andere: Datei aus web/, sonst die Fehlerseite */
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(geplant(env));
  }
};

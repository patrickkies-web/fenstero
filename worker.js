/* eeziframes auf Cloudflare Workers (Einstellungen in wrangler.jsonc)
   Die Website kommt als statische Dateien aus web/. Alles unter /api/… beantwortet functions/api/router.js:
   KI-Auswertung, Kauf des Aufmaßblatts (Stripe), Konten der Betriebe (Supabase), Eingang von Aufmaßen, Zentrale des Inhabers.
   Ohne eingerichtete Schlüssel läuft die Website im Pilotmodus weiter; /api/status sagt der App, was da ist.
   Ausgelieferte Seiten zählt die eigene Statistik als Tageszähler (functions/api/statistik.js), ohne Cookies und ohne Kennungen.
   Seit den Konfigurator-Instanzen (docs/INSTANZEN.md) gibt es in wrangler.jsonc kein not_found_handling mehr: Fehlt eine Datei,
   liefert dieser Worker selbst die Fehlerseite web/404.html mit Status 404 (je Host, Bauplan E23).
   Host-Weiche (Bauplan §3 A.1, E5): Die Hauptdomain (eeziframes.com, www, KANONISCH, …workers.dev, lokal, HAUPT_HOSTS) erkennt
   functions/instanz/mandant.js ohne Datenbank und läuft wie bisher. Jeder andere Host gehört zu einer Konfigurator-Instanz und geht an
   functions/instanz/seiten.js (App, Seiten und API nur nach Status und Positivliste). Gibt es noch keine Instanzen (keine Datenbank oder
   schema.sql noch nicht erneut ausgeführt), bleibt jeder Host die Hauptdomain. Der Host kommt nur aus der Adresse der Anfrage, nie aus
   Kopfzeilen wie X-Forwarded-Host.
   queue(): Warteschlange EINGANG (falls gebunden, wrangler.jsonc): PDF und Mail eingegangener Anfragen (functions/api/eingang.js). */
import { api, geplant } from './functions/api/router.js';
import { behandeln, umleitung, SICHERHEIT, SPERRE } from './functions/seo.js';
import { seitenaufruf } from './functions/api/statistik.js';
import { hostVon, istHaupt, instanzVon } from './functions/instanz/mandant.js';
import { ausliefern } from './functions/instanz/seiten.js';
import { eingangVerarbeiten } from './functions/api/eingang.js';
import { konfig } from './functions/api/umgebung.js';
import { speicher } from './functions/api/speicher.js';

/* Bereiche ohne Suchmaschinen und ohne Zwischenspeicher: Zentrale, Kundenkonto, Dashboard (laufen über run_worker_first durch den
   Worker, damit die Kopfzeilen sicher dran sind, auch wenn Cloudflare _headers an Antworten aus dem Worker nicht anwendet) */
const GESCHUETZT = /^\/(zentrale|partner|betrieb)(\/|$)/;
function sicher(antwort, ohneCache) {
  const h = new Headers(antwort.headers);
  for (const [k, v] of Object.entries(SICHERHEIT)) if (!h.has(k)) h.set(k, v);
  h.set('X-Robots-Tag', SPERRE);
  if (ohneCache) h.set('Cache-Control', 'no-store');
  return new Response(antwort.body, { status: antwort.status, statusText: antwort.statusText, headers: h });
}
/* Datei aus web/; fehlt sie, die Fehlerseite mit Status 404 (Cloudflare liefert sie unter /404, der lokale Testserver unter /404.html) */
async function datei(request, env) {
  const r = await env.ASSETS.fetch(request);
  if (r.status !== 404 || !['GET', 'HEAD'].includes(request.method)) return r;
  for (const pfad of ['/404', '/404.html']) {
    const s = await env.ASSETS.fetch(new Request(new URL(pfad, request.url), { method: request.method }));
    if (s.status === 200) { const h = new Headers(s.headers); h.delete('etag'); h.delete('last-modified'); return sicher(new Response(s.body, { status: 404, headers: h }), false); }
  }
  return r;
}

export default {
  async fetch(request, env, ctx) {
    /* Konfigurator-Instanz: eigener Weg, die Hauptdomain bleibt unberührt */
    const host = hostVon(request);
    if (!istHaupt(host, env)) {
      const inst = await instanzVon(host, env, ctx);
      if (inst !== undefined) return ausliefern(request, env, ctx, inst);
    }
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const antwort = await api(request, env, ctx);
      if (antwort) return antwort;
    }
    /* http:// und www. auf https://eeziframes.com (301), siehe functions/seo.js */
    const weiter = umleitung(request);
    if (weiter) return weiter;
    /* Seiten, robots.txt, sitemap.xml: Freigabe für Suchmaschinen (Variable INDEXIERUNG) und Canonical, siehe functions/seo.js */
    const seo = await behandeln(request, env, (r) => datei(r, env));
    if (seo) {
      if (seo.status === 200 || seo.status === 304) ctx.waitUntil(seitenaufruf(request, env).catch(() => false)); // 304: aus dem Browser-Cache, trotzdem ein Aufruf
      return seo;
    }
    /* alles andere: Datei aus web/, sonst die Fehlerseite */
    const antwort = await datei(request, env);
    return GESCHUETZT.test(url.pathname) ? sicher(antwort, true) : antwort;
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(geplant(env, event && event.cron));
  },
  /* Warteschlange EINGANG: je Nachricht { code, runde } PDF bauen und Mail an den Betrieb (idempotent über versand.runde/status);
     ein Fehler stellt die Nachricht erneut zu, der Zehn-Minuten-Lauf holt ohnehin alles Offene nach */
  async queue(batch, env, ctx) {
    const k = konfig(env), sp = speicher(k);
    for (const msg of (batch && batch.messages) || []) {
      const b = (msg && msg.body) || {};
      try {
        if (sp && b.code) await eingangVerarbeiten(k, sp, String(b.code), Number(b.runde) || 0);
        if (msg.ack) msg.ack();
      } catch (e) {
        console.log('Eingang aus der Warteschlange fehlgeschlagen', String(e && e.message ? e.message : e).slice(0, 160));
        if (msg.retry) msg.retry();
      }
    }
  }
};

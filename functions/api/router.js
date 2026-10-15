/* Fensterino · Verteiler für /api/… (Cloudflare Worker und lokaler Testserver nutzen denselben Code)
   GET  /api/status                 was eingerichtet ist (KI, Zahlung, Daten) und die Preise
   GET/POST /api/ki                 KI-Auswertung der Fotos (ki.js)
   /api/zahlung/…                   Aufmaßblatt kaufen (zahlung.js)
   /api/konto/…, /api/link/…, /api/aufmass   Betriebe, Links, Eingang (konten.js) */
import { konfig, json, ApiFehler } from './umgebung.js';
import { onRequestGet as kiGet, onRequestPost as kiPost } from './ki.js';
import { speicher } from './speicher.js';
import { zahlungsdienst } from './stripe.js';
import { KONTO, abrechnungslauf } from './konten.js';
import { ZAHLUNG } from './zahlung.js';
import '../../web/assets/modell.js';

const ROUTEN = Object.assign({}, ZAHLUNG, KONTO);
const MAX_BODY = 1500000;

function finde(method, pfad) {
  const direkt = ROUTEN[method + ' ' + pfad]; if (direkt) return { fn: direkt, params: {} };
  for (const key of Object.keys(ROUTEN)) {
    const [m, muster] = key.split(' '); if (m !== method || !muster.includes(':')) continue;
    const a = muster.split('/'), b = pfad.split('/'); if (a.length !== b.length) continue;
    const params = {}; let ok = true;
    for (let i = 0; i < a.length; i++) { if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]); else if (a[i] !== b[i]) { ok = false; break; } }
    if (ok) return { fn: ROUTEN[key], params: params };
  }
  return null;
}

export async function api(request, env, ctx0) {
  const url = new URL(request.url), pfad = url.pathname;
  if (!pfad.startsWith('/api/')) return null;
  const k = konfig(env);
  globalThis.Abrechnung.setPreise(k.preise);
  try {
    if (pfad === '/api/status') return json({ ok: true, ki: k.ki, zahlung: k.zahlung, daten: k.daten, preise: k.preise, attrappe: k.zahlungAttrappe || k.datenAttrappe });
    if (pfad === '/api/ki') { if (request.method === 'GET' || request.method === 'HEAD') return kiGet({ request, env }); if (request.method === 'POST') return kiPost({ request, env }); return new Response(null, { status: 405, headers: { allow: 'GET, POST' } }); }
    const treffer = finde(request.method, pfad);
    if (!treffer) return json({ ok: false, fehler: 'not_found' }, 404);
    const sp = speicher(k), zd = zahlungsdienst(k);
    const brauchtDaten = pfad.startsWith('/api/konto') || pfad.startsWith('/api/link') || pfad === '/api/aufmass';
    if (brauchtDaten && !sp) return json({ ok: false, fehler: 'Noch nicht eingerichtet: Die Datenbank fehlt (SUPABASE_URL, SUPABASE_SERVICE_KEY).' }, 503);
    if (pfad.startsWith('/api/zahlung') && !zd) return json({ ok: false, fehler: 'Noch nicht eingerichtet: Zahlungen fehlen (STRIPE_SECRET_KEY).' }, 503);
    let body = null, roh = '';
    if (request.method === 'POST' || request.method === 'PATCH') {
      if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return json({ ok: false, fehler: 'Zu groß.' }, 413);
      roh = await request.text(); if (roh.length > MAX_BODY) return json({ ok: false, fehler: 'Zu groß.' }, 413);
      if (roh) { try { body = JSON.parse(roh); } catch (e) { if (pfad !== '/api/zahlung/webhook') return json({ ok: false, fehler: 'Kein JSON.' }, 400); } }
      if (pfad !== '/api/zahlung/webhook' && request.headers.get('origin') && request.headers.get('origin') !== url.origin) return json({ ok: false, fehler: 'forbidden' }, 403);
    }
    const ctx = { k: k, sp: sp, zd: zd, request: request, url: url, body: body, roh: roh, params: treffer.params, waitUntil: (p) => (ctx0 && ctx0.waitUntil ? ctx0.waitUntil(p) : p) };
    const out = await treffer.fn(ctx);
    return json(out == null ? { ok: true } : out);
  } catch (e) {
    if (e instanceof ApiFehler) return json({ ok: false, fehler: e.message }, e.status);
    console.log('API-Fehler', pfad, String(e && e.stack ? e.stack : e).slice(0, 400));
    return json({ ok: false, fehler: 'Da ist etwas schiefgegangen. Bitte noch einmal versuchen.' }, 500);
  }
}

/* Cron (wrangler.jsonc: triggers.crons): Sammelrechnungen */
export async function geplant(env) {
  const k = konfig(env); globalThis.Abrechnung.setPreise(k.preise);
  const r = await abrechnungslauf(k, speicher(k), zahlungsdienst(k));
  console.log('Abrechnungslauf', JSON.stringify(r));
  return r;
}

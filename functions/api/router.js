/* eeziframes · Verteiler für /api/… (Cloudflare Worker und lokaler Testserver nutzen denselben Code)
   GET  /api/status                 was eingerichtet ist (KI, Zahlung, Daten, Stripe im Testmodus, Webhook) und die Preise
   GET/POST /api/ki                 KI-Auswertung der Fotos (ki.js)
   /api/zahlung/…                   Aufmaßblatt kaufen (zahlung.js)
   /api/konto/…, /api/link/…, /api/aufmass   Betriebe, Links, Eingang (konten.js)
   /api/link/:code/entwurf          Zwischenstand eines Kundenlinks mit Zählern gegen Mehrfachnutzung (entwurf.js)
   /api/kunde/…                     Konten der Hauseigentümer: Anmelden per Code, Aufmaße sichern und abgleichen (eigene.js)
   …/foto/:id                       Fotos der Fenster: Kunde legt ab (Link, eigenes Aufmaß), Betrieb und Besitzer lesen (fotos.js)
   /api/zentrale/…                  Zentrale des Inhabers (zentrale.js), eigene Statistik (statistik.js)
   POST /api/widerruf               Widerrufsfunktion nach § 356a BGB mit Eingangsbestätigung per E-Mail (widerruf.js, post.js), als JSON
                                    oder ohne JavaScript als Formular (dann antwortet der Server mit einer Seite) */
import { konfig, json, ApiFehler } from './umgebung.js';
import { AGB_STAND, NB_STAND, ZUSTIMMUNG, verkaufStand } from './recht.js';
import { bestaetigungenNachholen } from './bestaetigung.js';
import { onRequestGet as kiGet, onRequestPost as kiPost } from './ki.js';
import { speicher } from './speicher.js';
import { zahlungsdienst } from './stripe.js';
import { KONTO, abrechnungslauf } from './konten.js';
import { ZAHLUNG } from './zahlung.js';
import { ZENTRALE, aufraeumen } from './zentrale.js';
import { ENTWURF } from './entwurf.js';
import { EIGENE, kontenDa } from './eigene.js';
import { WIDERRUF, widerrufeNachholen } from './widerruf.js';
import { FOTOS } from './fotos.js';
import { attrappePost, attrappeAus } from './post.js';
import { zaehlen, mitWerbung, werbungAus } from './statistik.js';
import '../../web/assets/modell.js';
import { indexnow } from '../seo.js';

const ROUTEN = Object.assign({}, ZAHLUNG, KONTO, ENTWURF, EIGENE, ZENTRALE, WIDERRUF, FOTOS);
const MAX_BODY = 1500000;

function finde(method, pfad) {
  const direkt = ROUTEN[method + ' ' + pfad]; if (direkt) return { fn: direkt, params: {} };
  for (const key of Object.keys(ROUTEN)) {
    const [m, muster] = key.split(' '); if (m !== method || !muster.includes(':')) continue;
    const a = muster.split('/'), b = pfad.split('/'); if (a.length !== b.length) continue;
    const params = {}; let ok = true;
    for (let i = 0; i < a.length; i++) { if (a[i].startsWith(':')) { try { params[a[i].slice(1)] = decodeURIComponent(b[i]); } catch (e) { ok = false; break; } } else if (a[i] !== b[i]) { ok = false; break; } }
    if (ok) return { fn: ROUTEN[key], params: params };
  }
  return null;
}

export async function api(request, env, ctx0) {
  const url = new URL(request.url), pfad = url.pathname;
  if (!pfad.startsWith('/api/')) return null;
  const k = konfig(env);
  globalThis.Abrechnung.setPreise(k.preise);
  const warte = (p) => (ctx0 && ctx0.waitUntil ? ctx0.waitUntil(p) : p);
  try {
    /* verkauf: was vor dem Verkauf mit echtem Geld fehlt (recht.js); recht: Stand der AGB und der Nutzungsbedingungen und der Wortlaut
       der Zustimmung an der Kasse, so wie die App sie zeigt und der Server sie annimmt */
    if (pfad === '/api/status') { const konten = k.daten ? !!(await kontenDa(speicher(k))) : false; return json({ ok: true, ki: k.ki, zahlung: k.zahlung, daten: k.daten, konten: konten, preise: k.preise, einfuehrung: k.einfuehrung, zahlarten: k.zahlarten, attrappe: k.zahlungAttrappe || k.datenAttrappe, testmodus: !!(k.stripe && k.stripe.test), webhook: !!(k.stripe && k.stripe.webhook), post: !!k.post, verkauf: await verkaufStand(k, env, url.origin, konten), recht: { agb: AGB_STAND, nb: NB_STAND, zustimmung: ZUSTIMMUNG }, hinweise: k.hinweise.length ? k.hinweise : undefined }); }
    /* nur lokal mit MAIL_ATTRAPPE=1: die zuletzt „verschickten“ Mails, damit die Prüfung sie lesen kann; ?stoerung=1 bzw. 0 stellt
       eine Störung des Mailversands nach bzw. beendet sie */
    if (pfad === '/api/test/post' && k.post && k.post.attrappe) { const st = url.searchParams.get('stoerung'); if (st !== null) attrappeAus.an = st === '1'; return json({ ok: true, post: attrappePost, stoerung: attrappeAus.an }); }
    /* nur lokal mit DATEN_ATTRAPPE=1 und MAIL_ATTRAPPE=1: das Nachholen des täglichen Laufs sofort ausführen */
    if (pfad === '/api/test/nachholen' && k.datenAttrappe && k.post && k.post.attrappe) { const sp0 = speicher(k); return json({ ok: true, vertrag: await bestaetigungenNachholen(k, sp0, env), widerruf: await widerrufeNachholen(k, sp0) }); }
    if (pfad === '/api/ki') {
      if (request.method === 'GET' || request.method === 'HEAD') return kiGet({ request, env });
      if (request.method === 'POST') { const r = await kiPost({ request, env }); if (r.status === 200) warte(zaehlen(k, speicher(k), mitWerbung(['ereignis:ki_foto'], werbungAus(request))).catch(() => false)); return r; }
      return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
    }
    const treffer = finde(request.method, pfad);
    if (!treffer) return json({ ok: false, fehler: 'not_found' }, 404);
    const sp = speicher(k), zd = zahlungsdienst(k);
    const brauchtDaten = pfad.startsWith('/api/konto') || pfad.startsWith('/api/link') || pfad.startsWith('/api/kunde') || pfad === '/api/aufmass';
    if (brauchtDaten && !sp) return json({ ok: false, fehler: 'Noch nicht eingerichtet: Die Datenbank fehlt (SUPABASE_URL, SUPABASE_SECRET_KEY).' }, 503);
    if (pfad.startsWith('/api/zahlung') && !zd) return json({ ok: false, fehler: 'Noch nicht eingerichtet: Zahlungen fehlen (STRIPE_SECRET_KEY).' }, 503);
    let body = null, roh = '';
    /* Nur die Widerrufsfunktion nimmt auch ein gewöhnliches Formular an (Browser ohne JavaScript) */
    const formular = pfad === '/api/widerruf' && /^application\/x-www-form-urlencoded/i.test(request.headers.get('content-type') || '');
    if (request.method === 'POST' || request.method === 'PATCH') {
      if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return json({ ok: false, fehler: 'Zu groß.' }, 413);
      roh = await request.text(); if (roh.length > MAX_BODY) return json({ ok: false, fehler: 'Zu groß.' }, 413);
      if (roh && formular) body = Object.fromEntries(new URLSearchParams(roh));
      else if (roh) { try { body = JSON.parse(roh); } catch (e) { if (pfad !== '/api/zahlung/webhook') return json({ ok: false, fehler: 'Kein JSON.' }, 400); } }
      if (pfad !== '/api/zahlung/webhook' && request.headers.get('origin') && request.headers.get('origin') !== url.origin) return json({ ok: false, fehler: 'forbidden' }, 403);
    }
    /* zaehlen: Vorgang für die eigene Statistik (läuft nach der Antwort weiter, Fehler bleiben folgenlos); kommt die Anfrage von einer
       Seite, die über einen Anzeigenlink aufgerufen wurde, zählt der Vorgang zusätzlich als werbung:… (statistik.js) */
    const ctx = { k: k, env: env, sp: sp, zd: zd, request: request, url: url, body: body, roh: roh, formular: formular, params: treffer.params, waitUntil: warte, zaehlen: (s) => { warte(zaehlen(k, sp, mitWerbung(Array.isArray(s) ? s : [s], werbungAus(request))).catch(() => false)); } };
    const out = await treffer.fn(ctx);
    if (out instanceof Response) return out;
    return json(out == null ? { ok: true } : out);
  } catch (e) {
    if (e instanceof ApiFehler) return json(Object.assign({ ok: false, fehler: e.message }, e.extra || {}), e.status);
    console.log('API-Fehler', pfad, String(e && e.stack ? e.stack : e).slice(0, 400));
    return json({ ok: false, fehler: 'Da ist etwas schiefgegangen. Bitte noch einmal versuchen.' }, 500);
  }
}

/* Cron (wrangler.jsonc: triggers.crons): am 1. und 15. Sammelrechnungen, jeden Tag Aufräumen (Protokoll nach Frist,
   liegengebliebene Kassen, Anmeldungen ohne Betrieb nach 30 Tagen, Zwischenstände erledigter Kundenlinks) und Nachholen: nicht
   zugestellte Vertragsbestätigungen (bestaetigung.js) und Eingangsbestätigungen von Widerrufen (widerruf.js) */
export const CRON_ABRECHNUNG = '0 3 1,15 * *';
export async function geplant(env, cron) {
  const k = konfig(env); globalThis.Abrechnung.setPreise(k.preise);
  const sp = speicher(k), abrechnen = !cron || cron === CRON_ABRECHNUNG, taeglich = !cron || cron !== CRON_ABRECHNUNG;
  const r = abrechnen ? await abrechnungslauf(k, sp, zahlungsdienst(k)) : { ok: true, nurAufraeumen: true };
  if (r && r.rechnungen) await zaehlen(k, sp, new Array(r.rechnungen).fill('ereignis:sammelrechnung')).catch(() => false);
  let weg = null; try { weg = await aufraeumen(k, sp); } catch (e) { weg = { ok: false }; }
  let nach = null;
  if (taeglich) { nach = {}; try { nach.vertrag = await bestaetigungenNachholen(k, sp, env); } catch (e) { nach.vertrag = { ok: false }; } try { nach.widerruf = await widerrufeNachholen(k, sp); } catch (e) { nach.widerruf = { ok: false }; } }
  /* täglicher Lauf: nach einer Veröffentlichung die geänderten Seiten per IndexNow melden (functions/seo.js, nur mit Freigabe) */
  let suche = null; if (cron && cron !== CRON_ABRECHNUNG) { try { suche = await indexnow(env); } catch (e) { suche = { ok: false }; } }
  console.log('Abrechnungslauf', JSON.stringify(r), 'Aufräumen', JSON.stringify(weg), 'Nachholen', JSON.stringify(nach), 'IndexNow', JSON.stringify(suche));
  return Object.assign({}, r, { aufraeumen: weg, nachholen: nach, indexnow: suche });
}

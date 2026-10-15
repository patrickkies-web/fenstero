/* eeziframes · Einstellungen des Servers aus den Umgebungsvariablen (Cloudflare: Einstellungen → Variablen und Geheimnisse)

   Geheimnisse (Typ Secret):
     ANTHROPIC_API_KEY        KI-Auswertung der Fotos
     STRIPE_SECRET_KEY        Zahlungen (sk_test_… zum Testen, sk_live_… für echtes Geld; eingeschränkte Schlüssel rk_… gehen auch)
     STRIPE_WEBHOOK_SECRET    Unterschrift der Stripe-Webhooks (whsec_…), je Modus ein eigenes
     SUPABASE_URL             https://<projekt>.supabase.co
     SUPABASE_SECRET_KEY      geheimer Schlüssel sb_secret_… (nur hier, nie im Browser); alter Name SUPABASE_SERVICE_KEY,
                              dort geht auch noch der frühere service_role-Schlüssel (eyJ…, Supabase schafft ihn bis Ende 2026 ab)
     SUPABASE_PUBLISHABLE_KEY optional, sb_publishable_… (alter Name SUPABASE_ANON_KEY); ohne ihn nimmt die Anmeldung den geheimen
     FREISCHALT_GEHEIMNIS     beliebiger langer Zufallstext; unterschreibt die Freischalt-Nachweise für bezahlte Aufmaßblätter

   Variablen (Typ Text, alle optional):
     MWST                     0 = Kleinunternehmerregelung (§ 19 UStG): keine Umsatzsteuer, Hinweis auf jeder Rechnung; sonst 19 %
     PREIS_AUFMASS_CENT 799 · PREIS_PROJEKT 9 · FREI_PROJEKTE 3 · PREIS_ABO 49 · ABO_INKL 10 · PREIS_ABO_EXTRA 5 · PREIS_PLUS 79
     Nur falls eigene Objekte in Stripe genutzt werden sollen; sonst legt der Server Preise und Steuersätze selbst an (stripe.js):
     STRIPE_PRICE_AUFMASS     Preis-ID des Aufmaßblatts (sonst wird der Betrag je Kauf gesetzt, PREIS_AUFMASS_CENT)
     STRIPE_PRICE_ABO         Preis-ID „Abo 10“ (monatlich)
     STRIPE_PRICE_PLUS        Preis-ID „Plus“ (monatlich)
     STRIPE_TAX_RATE          Steuersatz-ID 19 % exklusiv (Rechnungen an Betriebe)
     STRIPE_TAX_RATE_INKL     Steuersatz-ID 19 % inklusiv (Aufmaßblatt)
     ZAHLUNG_ATTRAPPE=1 / DATEN_ATTRAPPE=1   nur lokal zum Testen: Stripe bzw. Datenbank werden nachgestellt */
const num = (v, d) => { const n = Number(v); return v !== undefined && v !== '' && !isNaN(n) ? n : d; };
/* Rolle aus einem früheren Supabase-Schlüssel (JWT, eyJ…) lesen, ohne ihn zu prüfen: nur um anon und service_role zu unterscheiden */
function jwtRolle(t) { try { if (!/^eyJ/.test(t)) return ''; const m = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(atob(m + '==='.slice((m.length + 3) % 4))).role || ''; } catch (e) { return ''; } }
/* Neue Supabase-Schlüssel gehören nur in den Kopf apikey, nicht in Authorization (sie sind kein JWT) */
export const sbNeu = (schluessel) => /^sb_(secret|publishable)_/.test(String(schluessel || ''));
export function konfig(env) {
  env = env || {};
  const hinweise = []; // häufige Verwechslungen beim Eintragen, /api/status zeigt sie an (ohne Werte)
  const schluessel = String(env.STRIPE_SECRET_KEY || '').trim();
  if (/^pk_/.test(schluessel)) hinweise.push('STRIPE_SECRET_KEY: Das ist der veröffentlichbare Schlüssel (pk_…). Gebraucht wird der Geheimschlüssel (sk_… oder rk_…).');
  const stripe = schluessel && !/^pk_/.test(schluessel) ? { key: schluessel, test: /^(sk|rk)_test_/.test(schluessel), webhook: String(env.STRIPE_WEBHOOK_SECRET || '').trim(), preisAufmass: env.STRIPE_PRICE_AUFMASS || '', preisAbo: env.STRIPE_PRICE_ABO || '', preisPlus: env.STRIPE_PRICE_PLUS || '', steuer: env.STRIPE_TAX_RATE || '', steuerInkl: env.STRIPE_TAX_RATE_INKL || '' } : null;
  if (stripe && stripe.webhook && !/^whsec_/.test(stripe.webhook)) hinweise.push('STRIPE_WEBHOOK_SECRET: beginnt nicht mit whsec_. Eingetragen gehört der Signatur-Geheimschlüssel des Ereignisziels.');
  /* Supabase: neue Schlüssel (sb_secret_…, sb_publishable_…) oder die früheren (eyJ…, service_role bzw. anon); die Adresse auch mit /rest/v1 am Ende */
  const sbUrl = String(env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
  const sbGeheim = String(env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_KEY || '').trim(), sbOffen = String(env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || '').trim();
  let sbOk = !!(sbUrl && sbGeheim);
  if (sbUrl && !sbGeheim) hinweise.push('Supabase: SUPABASE_SECRET_KEY fehlt noch.');
  if (sbGeheim && !sbUrl) hinweise.push('Supabase: SUPABASE_URL fehlt noch.');
  if (sbUrl && !/^https:\/\//.test(sbUrl)) hinweise.push('SUPABASE_URL: Erwartet wird die Adresse https://<projekt>.supabase.co.');
  if (/^sb_publishable_/.test(sbGeheim) || jwtRolle(sbGeheim) === 'anon') { hinweise.push('SUPABASE_SECRET_KEY: Das ist der öffentliche Schlüssel (sb_publishable_… bzw. anon). Gebraucht wird der geheime (sb_secret_… bzw. service_role).'); sbOk = false; }
  const supabase = sbOk ? { url: sbUrl, service: sbGeheim, anon: sbOffen || sbGeheim } : null;
  const zahlungAttrappe = env.ZAHLUNG_ATTRAPPE === '1', datenAttrappe = env.DATEN_ATTRAPPE === '1';
  return {
    stripe: stripe, zahlungAttrappe: zahlungAttrappe, zahlung: !!(stripe || zahlungAttrappe),
    supabase: supabase, datenAttrappe: datenAttrappe, daten: !!(supabase || datenAttrappe),
    ki: !!env.ANTHROPIC_API_KEY,
    geheimnis: env.FREISCHALT_GEHEIMNIS || env.STRIPE_SECRET_KEY || 'eeziframes-pilot', hinweise: hinweise,
    preise: { aufmass: num(env.PREIS_AUFMASS_CENT, 799) / 100, projekt: num(env.PREIS_PROJEKT, 9), frei: num(env.FREI_PROJEKTE, 3), abo: { grund: num(env.PREIS_ABO, 49), inkl: num(env.ABO_INKL, 10), extra: num(env.PREIS_ABO_EXTRA, 5) }, plus: num(env.PREIS_PLUS, 79), mwst: env.MWST !== '0' }
  };
}
export const json = (obj, status, extra) => new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }, extra || {}) });
export const fehler = (text, status) => json({ ok: false, fehler: text }, status || 400);
export class ApiFehler extends Error { constructor(text, status) { super(text); this.status = status || 400; } }
export const b64url = (bytes) => btoa(String.fromCharCode.apply(null, Array.from(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export async function hmac(geheimnis, text) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(geheimnis), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text)));
}
export const hex = (bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
export const zufall = (n) => b64url(crypto.getRandomValues(new Uint8Array(n || 12)));
/* Bremse je IP-Adresse, nur im Arbeitsspeicher dieser Instanz */
const zaehler = new Map();
export function erlaubt(schluessel, max, fensterMs) {
  const jetzt = Date.now(), liste = (zaehler.get(schluessel) || []).filter((t) => jetzt - t < fensterMs);
  if (liste.length >= max) { zaehler.set(schluessel, liste); return false; }
  liste.push(jetzt); zaehler.set(schluessel, liste); if (zaehler.size > 5000) zaehler.clear(); return true;
}
export const ip = (request) => request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unbekannt';

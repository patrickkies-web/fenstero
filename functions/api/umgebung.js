/* Fensterino · Einstellungen des Servers aus den Umgebungsvariablen (Cloudflare: Einstellungen → Variablen und Geheimnisse)

   Geheimnisse (Typ Secret):
     ANTHROPIC_API_KEY        KI-Auswertung der Fotos
     STRIPE_SECRET_KEY        Zahlungen (sk_test_… zum Testen, sk_live_… für echtes Geld)
     STRIPE_WEBHOOK_SECRET    Unterschrift der Stripe-Webhooks (whsec_…)
     SUPABASE_URL             https://<projekt>.supabase.co
     SUPABASE_SERVICE_KEY     service_role-Schlüssel (nur hier, nie im Browser)
     SUPABASE_ANON_KEY        anon-Schlüssel (für die Anmeldung per E-Mail-Code)
     FREISCHALT_GEHEIMNIS     beliebiger langer Zufallstext; unterschreibt die Freischalt-Nachweise für bezahlte Aufmaßblätter

   Variablen (Typ Text, alle optional):
     STRIPE_PRICE_AUFMASS     Preis-ID des Aufmaßblatts (sonst wird der Betrag je Kauf gesetzt, PREIS_AUFMASS_CENT)
     STRIPE_PRICE_ABO         Preis-ID „Abo 10“ (monatlich), Pflicht für Abos
     STRIPE_PRICE_PLUS        Preis-ID „Plus“ (monatlich), Pflicht für Plus
     STRIPE_TAX_RATE          Steuersatz-ID 19 % (exklusiv) für Rechnungen an Betriebe; leer bei Kleinunternehmerregelung
     STRIPE_TAX_RATE_INKL     Steuersatz-ID 19 % (inklusiv) für das Aufmaßblatt; leer bei Kleinunternehmerregelung
     PREIS_AUFMASS_CENT 799 · PREIS_PROJEKT 9 · FREI_PROJEKTE 3 · PREIS_ABO 49 · ABO_INKL 10 · PREIS_ABO_EXTRA 5 · PREIS_PLUS 79 · MWST 1
     ZAHLUNG_ATTRAPPE=1 / DATEN_ATTRAPPE=1   nur lokal zum Testen: Stripe bzw. Datenbank werden nachgestellt */
const num = (v, d) => { const n = Number(v); return v !== undefined && v !== '' && !isNaN(n) ? n : d; };
export function konfig(env) {
  env = env || {};
  const stripe = env.STRIPE_SECRET_KEY ? { key: env.STRIPE_SECRET_KEY, webhook: env.STRIPE_WEBHOOK_SECRET || '', preisAufmass: env.STRIPE_PRICE_AUFMASS || '', preisAbo: env.STRIPE_PRICE_ABO || '', preisPlus: env.STRIPE_PRICE_PLUS || '', steuer: env.STRIPE_TAX_RATE || '', steuerInkl: env.STRIPE_TAX_RATE_INKL || '' } : null;
  const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY ? { url: String(env.SUPABASE_URL).replace(/\/+$/, ''), service: env.SUPABASE_SERVICE_KEY, anon: env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_KEY } : null;
  const zahlungAttrappe = env.ZAHLUNG_ATTRAPPE === '1', datenAttrappe = env.DATEN_ATTRAPPE === '1';
  return {
    stripe: stripe, zahlungAttrappe: zahlungAttrappe, zahlung: !!(stripe || zahlungAttrappe),
    supabase: supabase, datenAttrappe: datenAttrappe, daten: !!(supabase || datenAttrappe),
    ki: !!env.ANTHROPIC_API_KEY,
    geheimnis: env.FREISCHALT_GEHEIMNIS || env.STRIPE_SECRET_KEY || 'fensterino-pilot',
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

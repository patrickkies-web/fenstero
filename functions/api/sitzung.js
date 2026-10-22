/* eeziframes · Sitzungen und Zweck-Token für Kundenkonto (/partner/ auf eeziframes.com) und Dashboard der Instanzen (/betrieb/)
   Muster wie die Zentrale (zentrale.js, Sitzung): Der Server unterschreibt die Sitzung selbst (HMAC-SHA-256 über SITZUNG_GEHEIMNIS),
   der Browser bekommt sie nur als Cookie, das Skripte nicht lesen können. Kein Supabase-Token im Browser (Bauplan K1.1, E11).
   - Sitzung { v, bereich: 'partner'|'betrieb', aud: Host, sub, mail, iat, exp, n } im Cookie __Host-partner bzw. __Host-betrieb
     (HttpOnly, Secure, SameSite=Strict, Path=/). Sie gilt nur in ihrem Bereich und nur auf dem Host, der sie ausgestellt hat.
   - Schreibende Anfragen mit Sitzung verlangen die Kopfzeile Origin der eigenen Adresse (gegen Anfragen fremder Seiten).
   - frisch: Anmeldung jünger als FRISTEN.frischMinuten (15); Geld-Aktionen verlangen das (sonst 401 { frisch: true }).
   - Zweck-Token (vorschau, empfaenger, fotos, …): Daten mit Ablauf, der Zweck steht im MAC; ein Token für einen Zweck gilt für keinen
     anderen.
   Ohne SITZUNG_GEHEIMNIS (mindestens 32 Zeichen) gibt der Server keine Sitzungen und keine Token aus und nimmt keine an; nur mit
   DATEN_ATTRAPPE=1 gilt ein fester Testwert (umgebung.js, konfig().sitzung).
   API: sitzungSetzen(ctx, bereich, { sub, mail }) → Set-Cookie · sitzungLesen(ctx, bereich, { frisch }) → Sitzung | null ·
        sitzungPflicht(ctx, bereich, { frisch }) → Sitzung oder ApiFehler 401/403 · sitzungLoeschen(ctx, bereich) → Set-Cookie ·
        tokenSignieren(k, zweck, daten, sekunden) → Text · tokenPruefen(k, zweck, token) → daten | null */
import '../../web/assets/instanzregeln.js';
import { ApiFehler, hmac, b64url, gleich, zufall, jetztAus } from './umgebung.js';

export const BEREICHE = ['partner', 'betrieb'];
const R = () => globalThis.Instanzregeln;
const TAG = 864e5;
const b64urlText = (s) => b64url(new TextEncoder().encode(s));
const textAusB64url = (s) => { const b = String(s).replace(/-/g, '+').replace(/_/g, '/'); return decodeURIComponent(escape(atob(b + '==='.slice((b.length + 3) % 4)))); };
const geheimnis = (k) => (k && k.sitzung && k.sitzung.geheimnis) || '';
/* Zeit des Servers: mit JETZT (nur Prüfung) die vorgestellte Uhr, sonst Date.now(); k.jetzt rechnet konfig() je Anfrage */
const jetzt = (ctx) => (ctx && ctx.env ? jetztAus(ctx.env) : ctx && ctx.k && ctx.k.jetzt ? ctx.k.jetzt : Date.now());
const jetztK = (k) => (k && k.jetzt ? k.jetzt : Date.now());
/* Host der Anfrage: klein, ohne Port, ohne www. (gleich wie die Host-Weiche) */
export const hostAus = (url) => String(url.hostname || '').toLowerCase().replace(/^www\./, '');
/* Lokal über http (localhost, *.localhost): gleiche Cookies; Chromium nimmt Secure-Cookies dort an (sicherer Kontext) */
const cookieName = (bereich) => '__Host-' + bereich;

async function signieren(k, art, nutzlast) {
  const g = geheimnis(k); if (!g) throw new ApiFehler('Anmeldung ist hier noch nicht eingerichtet (SITZUNG_GEHEIMNIS).', 503);
  const teil = b64urlText(JSON.stringify(nutzlast));
  return teil + '.' + b64url(await hmac(g, 'eeziframes|' + art + '|' + teil));
}
async function lesen(k, art, token) {
  const g = geheimnis(k); if (!g) return null;
  const t = String(token || '').split('.');
  if (t.length !== 2 || !t[0] || !t[1] || t[0].length > 4000) return null;
  if (!(await gleich(t[1], b64url(await hmac(g, 'eeziframes|' + art + '|' + t[0]))))) return null;
  try { return JSON.parse(textAusB64url(t[0])); } catch (e) { return null; }
}
function cookieWert(request, name) {
  const m = new RegExp('(?:^|;\\s*)' + name.replace(/[-]/g, '\\-') + '=([^;\\s]+)').exec(request.headers.get('cookie') || '');
  return m ? m[1] : '';
}
const cookie = (bereich, wert, sekunden) => cookieName(bereich) + '=' + wert + '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=' + Math.max(0, Math.floor(sekunden));

/* Sitzung ausstellen; Rückgabe: Wert für die Kopfzeile Set-Cookie */
export async function sitzungSetzen(ctx, bereich, wer) {
  if (!BEREICHE.includes(bereich)) throw new ApiFehler('Unbekannter Bereich.', 500);
  wer = wer || {};
  if (!wer.sub) throw new ApiFehler('Anmeldung ohne Kennung.', 500);
  const t = jetzt(ctx), dauer = R().FRISTEN.sitzungTage * TAG;
  const p = { v: 1, bereich: bereich, aud: hostAus(ctx.url), sub: String(wer.sub), mail: String(wer.mail || '').toLowerCase(), iat: t, exp: t + dauer, n: zufall(6) };
  return cookie(bereich, await signieren(ctx.k, 'sitzung', p), dauer / 1000);
}
export const sitzungLoeschen = (ctx, bereich) => cookie(bereich, '', 0);

/* Sitzung lesen: null bei fehlendem oder fremdem Cookie, falschem Bereich oder Host, Ablauf, fremder Unterschrift, bei schreibenden
   Anfragen ohne passende Origin, mit o.frisch auch bei älterer Anmeldung. Ergebnis mit frisch: true|false */
export async function sitzungLesen(ctx, bereich, o) {
  const p = await sitzungRoh(ctx, bereich);
  if (!p || p.fehler) return null;
  if (o && o.frisch && !p.frisch) return null;
  return p;
}
async function sitzungRoh(ctx, bereich) {
  if (!BEREICHE.includes(bereich)) return null;
  const roh = cookieWert(ctx.request, cookieName(bereich)); if (!roh) return null;
  const p = await lesen(ctx.k, 'sitzung', roh), t = jetzt(ctx);
  if (!p || p.v !== 1 || p.bereich !== bereich || p.aud !== hostAus(ctx.url) || !p.sub || !(p.exp > t) || !(p.iat <= t + 60000)) return null;
  const schreibt = !['GET', 'HEAD', 'OPTIONS'].includes(ctx.request.method);
  if (schreibt && ctx.request.headers.get('origin') !== ctx.url.origin) return { fehler: 'origin' };
  return Object.assign(p, { frisch: t - p.iat < R().FRISTEN.frischMinuten * 60000 });
}
/* Für Routen: Sitzung oder Fehler (401 { anmelden: true }, 401 { frisch: true }, 403 bei fremder Herkunft) */
export async function sitzungPflicht(ctx, bereich, o) {
  const p = await sitzungRoh(ctx, bereich);
  if (p && p.fehler === 'origin') throw new ApiFehler('Nicht erlaubt.', 403);
  if (!p) throw new ApiFehler('Bitte neu anmelden.', 401, { anmelden: true });
  if (o && o.frisch && !p.frisch) throw new ApiFehler('Bitte bestätigen Sie diesen Schritt mit einem neuen Code.', 401, { frisch: true });
  return p;
}

/* Zweck-Token: daten (JSON), gültig für sekunden; der Zweck steht im MAC */
export async function tokenSignieren(k, zweck, daten, sekunden) {
  if (!/^[a-z][a-z0-9_-]{1,30}$/.test(String(zweck || ''))) throw new ApiFehler('Unbekannter Zweck.', 500);
  const iat = jetztK(k);
  return signieren(k, 'token:' + zweck, { z: zweck, d: daten === undefined ? null : daten, iat: iat, exp: iat + Math.max(1, Number(sekunden) || 0) * 1000 });
}
/* daten oder null (falscher Zweck, abgelaufen, fremde Unterschrift) */
export async function tokenPruefen(k, zweck, token) {
  const p = await lesen(k, 'token:' + zweck, token);
  const t = jetztK(k);
  if (!p || p.z !== zweck || !(p.exp > t)) return null;
  return p.d;
}

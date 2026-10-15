/* eeziframes · Anmeldung für Betriebe ohne Passwort: ein sechsstelliger Code per E-Mail (Supabase Auth, „Email OTP“).
   Supabase-Einstellung: Authentication → Email Templates → „Magic Link“ muss den Code {{ .Token }} enthalten (siehe docs/ONLINE-STELLEN.md).
   Attrappe (DATEN_ATTRAPPE=1): der Code ist immer 123456. */
import { ApiFehler, sbNeu } from './umgebung.js';

const cache = new Map();
const hashN = (s) => String(s).split('').reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7);
const mailOk = (m) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m);

async function gotrue(k, pfad, init, token) {
  const kopf = { apikey: k.supabase.anon, 'content-type': 'application/json' };
  if (token) kopf.Authorization = 'Bearer ' + token; // Sitzung des Betriebs
  else if (!sbNeu(k.supabase.anon)) kopf.Authorization = 'Bearer ' + k.supabase.anon; // früherer anon-Schlüssel (JWT); neue Schlüssel nur im Kopf apikey
  const r = await fetch(k.supabase.url + '/auth/v1/' + pfad, { method: init && init.body ? 'POST' : 'GET', headers: kopf, body: init && init.body ? JSON.stringify(init.body) : undefined });
  const text = await r.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
  return { ok: r.ok, status: r.status, data: data };
}

export async function codeSenden(k, sp, mail) {
  mail = String(mail || '').trim().toLowerCase();
  if (!mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
  if (k.supabase) {
    const r = await gotrue(k, 'otp', { body: { email: mail, create_user: true } });
    if (!r.ok) { console.log('Supabase Auth', r.status, JSON.stringify(r.data || {}).slice(0, 200)); throw new ApiFehler(r.status === 429 ? 'Zu viele Versuche. Bitte in einer Minute noch einmal.' : 'Der Code konnte nicht verschickt werden.', 502); }
    return { ok: true, mail: mail };
  }
  sp.codeMerken(mail, '123456');
  console.log('[Attrappe] Anmeldecode für ' + mail + ': 123456');
  return { ok: true, mail: mail, attrappe: true };
}

export async function codePruefen(k, sp, mail, code) {
  mail = String(mail || '').trim().toLowerCase(); code = String(code || '').replace(/\s+/g, '');
  if (!mailOk(mail) || !/^\d{6,8}$/.test(code)) throw new ApiFehler('Bitte den sechsstelligen Code aus der E-Mail eingeben.');
  if (k.supabase) {
    const r = await gotrue(k, 'verify', { body: { type: 'email', email: mail, token: code } });
    if (!r.ok || !r.data || !r.data.access_token) throw new ApiFehler('Der Code stimmt nicht oder ist abgelaufen.', 401);
    return { token: r.data.access_token, refresh: r.data.refresh_token || '', nutzer: { id: r.data.user.id, mail: String(r.data.user.email || mail).toLowerCase() } };
  }
  if (sp.codeLesen(mail) !== code) throw new ApiFehler('Der Code stimmt nicht oder ist abgelaufen.', 401);
  const id = 'u_' + hashN(mail).toString(36);
  return { token: 'test.' + btoa(unescape(encodeURIComponent(mail))).replace(/=+$/, ''), refresh: 'test-refresh', nutzer: { id: id, mail: mail } };
}

export async function erneuern(k, refresh) {
  if (!k.supabase) return null;
  const r = await gotrue(k, 'token?grant_type=refresh_token', { body: { refresh_token: String(refresh || '') } });
  if (!r.ok || !r.data || !r.data.access_token) return null;
  return { token: r.data.access_token, refresh: r.data.refresh_token || refresh, nutzer: { id: r.data.user.id, mail: String(r.data.user.email || '').toLowerCase() } };
}

/* Wer steckt hinter dem Token? Kurz zwischengespeichert, damit nicht jeder Aufruf bei Supabase nachfragt. */
export async function nutzer(k, token) {
  token = String(token || '');
  if (!token) return null;
  const c = cache.get(token); if (c && c.bis > Date.now()) return c.n;
  let n = null;
  if (k.supabase) { const r = await gotrue(k, 'user', null, token); if (r.ok && r.data && r.data.id) n = { id: r.data.id, mail: String(r.data.email || '').toLowerCase() }; }
  else if (token.startsWith('test.')) { try { const mail = decodeURIComponent(escape(atob(token.slice(5)))); n = { id: 'u_' + hashN(mail).toString(36), mail: mail }; } catch (e) { n = null; } }
  if (n) { cache.set(token, { n: n, bis: Date.now() + 60000 }); if (cache.size > 2000) cache.clear(); }
  return n;
}

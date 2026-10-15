/* eeziframes · Anmeldung für Betriebe ohne Passwort: eine E-Mail mit Anmeldelink oder sechsstelligem Code (Supabase Auth).
   Der Link führt mit #access_token=… zurück auf die Startseite (portal.js → /api/konto/sitzung); der Code geht über /api/konto/bestaetigen.
   Welche E-Mail Supabase schickt, bestimmt die Vorlage „Magic Link“: Ohne eigenen Mailversand (SMTP) ist es die Standardvorlage mit Link,
   mit eigenem Mailversand lässt sich {{ .Token }} (Code) eintragen; beides funktioniert (docs/ONLINE-STELLEN.md, Stufe 2 A).
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

/* zurueck: Adresse, auf die der Anmeldelink führt (muss bei Supabase unter Redirect URLs erlaubt sein, sonst nimmt Supabase die Site URL) */
export async function codeSenden(k, sp, mail, zurueck) {
  mail = String(mail || '').trim().toLowerCase();
  if (!mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
  if (k.supabase) {
    const r = await gotrue(k, 'otp' + (zurueck ? '?redirect_to=' + encodeURIComponent(zurueck) : ''), { body: { email: mail, create_user: true } });
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

/* Verwaltung der Anmeldungen für die Zentrale (Supabase Auth, Admin-Schnittstelle, nur mit dem geheimen Schlüssel).
   Ohne Supabase (Attrappe) gibt es keine eigenen Anmeldedaten: die Funktionen melden Erfolg bzw. eine leere Liste. */
async function admin(k, pfad, method) {
  const kopf = { apikey: k.supabase.service, 'content-type': 'application/json' };
  if (!sbNeu(k.supabase.service)) kopf.Authorization = 'Bearer ' + k.supabase.service; // früherer service_role-Schlüssel (JWT)
  const r = await fetch(k.supabase.url + '/auth/v1/admin/' + pfad, { method: method || 'GET', headers: kopf });
  const text = await r.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
  if (!r.ok && r.status !== 404) console.log('Supabase Auth (Verwaltung)', r.status, pfad.split('?')[0].replace(/[0-9a-f-]{36}/, '…'), JSON.stringify(data || {}).slice(0, 160));
  return { ok: r.ok, status: r.status, data: data };
}
const nutzerKurz = (u) => ({ id: u.id, mail: String(u.email || '').toLowerCase(), erstellt: u.created_at || '', zuletzt: u.last_sign_in_at || '', bestaetigt: u.email_confirmed_at || u.confirmed_at || '' });
/* Eine Anmeldung löschen (DSGVO-Löschung eines Kontos); schon gelöscht zählt als erledigt */
export async function anmeldungLoeschen(k, uid) {
  if (!k.supabase || !uid) return { ok: true, attrappe: !k.supabase };
  const r = await admin(k, 'users/' + encodeURIComponent(uid), 'DELETE');
  return { ok: r.ok || r.status === 404, status: r.status };
}
export async function anmeldungLesen(k, uid) {
  if (!k.supabase || !uid) return null;
  const r = await admin(k, 'users/' + encodeURIComponent(uid));
  return r.ok && r.data && r.data.id ? nutzerKurz(r.data) : null;
}
/* Alle Anmeldungen (seitenweise); null, wenn Supabase nicht antwortet */
export async function anmeldungenAlle(k) {
  if (!k.supabase) return [];
  const out = [];
  for (let seite = 1; seite <= 50; seite++) {
    const r = await admin(k, 'users?page=' + seite + '&per_page=500');
    if (!r.ok) return null;
    const liste = (r.data && (r.data.users || r.data)) || [];
    if (!Array.isArray(liste)) return null;
    out.push.apply(out, liste.map(nutzerKurz));
    if (liste.length < 500) break;
  }
  return out;
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

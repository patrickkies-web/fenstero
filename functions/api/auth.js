/* eeziframes · Anmeldung ohne Passwort für Betriebe und Hauseigentümer: eine E-Mail mit Code (Supabase Auth).
   Der Code geht über /api/konto/bestaetigen bzw. /api/kunde/anmelden. Ein Anmeldelink führt mit #access_token=… zurück
   (portal.js → /api/konto/sitzung, app.js → /api/kunde/sitzung) und wird ebenfalls angenommen.
   Welche E-Mail Supabase schickt, bestimmen zwei Vorlagen: „Confirm signup“ geht an eine Adresse ohne bestätigtes Konto (beim
   allerersten Anmelden), „Magic Link“ an alle anderen. In beiden steht nur {{ .Token }}, kein Link: Mail-Apps öffnen Links gern in
   einem anderen Browser, dort fehlt dann ein angefangenes Aufmaß (docs/ONLINE-STELLEN.md, Stufe 2 A). Die Länge des Codes stellt man
   bei Supabase ein (Email OTP Length, 6 bis 10 Stellen); angenommen wird jede davon.
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

/* zurueck: Adresse, auf die der Anmeldelink führt (muss bei Supabase unter Redirect URLs erlaubt sein, sonst nimmt Supabase die Site URL).
   neu === false: nur anmelden, kein neues Konto anlegen (App „Anmelden“: ein Konto entsteht nur mit Zustimmung zu den AGB beim Sichern).
   Gibt es zu der Adresse kein Konto, antwortet der Server trotzdem wie sonst, damit sich nicht ausprobieren lässt, wer ein Konto hat;
   es kommt dann nur kein Code an. */
export async function codeSenden(k, sp, mail, zurueck, neu) {
  mail = String(mail || '').trim().toLowerCase();
  if (!mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
  const anlegen = neu !== false;
  if (k.supabase) {
    const r = await gotrue(k, 'otp' + (zurueck ? '?redirect_to=' + encodeURIComponent(zurueck) : ''), { body: { email: mail, create_user: anlegen } });
    if (!r.ok && !anlegen && (r.status === 422 || r.status === 400) && /otp_disabled|signup|not allowed|not found/i.test(JSON.stringify(r.data || {}))) return { ok: true, mail: mail };
    if (!r.ok) { console.log('Supabase Auth', r.status, String((r.data && (r.data.error_code || r.data.code)) || '').slice(0, 60)); throw new ApiFehler(r.status === 429 ? 'Zu viele Versuche. Bitte in einer Minute noch einmal.' : 'Der Code konnte nicht verschickt werden.', 502); }
    return { ok: true, mail: mail };
  }
  if (!anlegen && sp.nutzerBekannt && !sp.nutzerBekannt(mail)) return { ok: true, mail: mail, attrappe: true }; // wie Supabase: ohne Konto kein Code
  sp.codeMerken(mail, '123456');
  console.log('[Attrappe] Anmeldecode für ' + mail + ': 123456');
  return { ok: true, mail: mail, attrappe: true };
}

export async function codePruefen(k, sp, mail, code) {
  mail = String(mail || '').trim().toLowerCase(); code = String(code || '').replace(/\s+/g, '');
  if (!mailOk(mail) || !/^\d{6,10}$/.test(code)) throw new ApiFehler('Bitte den Code aus der E-Mail eingeben.');
  if (k.supabase) {
    const r = await gotrue(k, 'verify', { body: { type: 'email', email: mail, token: code } });
    if (!r.ok || !r.data || !r.data.access_token) throw new ApiFehler('Der Code stimmt nicht oder ist abgelaufen.', 401);
    return { token: r.data.access_token, refresh: r.data.refresh_token || '', nutzer: { id: r.data.user.id, mail: String(r.data.user.email || mail).toLowerCase() } };
  }
  if (sp.codeLesen(mail) !== code) throw new ApiFehler('Der Code stimmt nicht oder ist abgelaufen.', 401);
  if (sp.nutzerMerken) sp.nutzerMerken(mail);
  const id = 'u_' + hashN(mail).toString(36);
  return { token: 'test.' + btoa(unescape(encodeURIComponent(mail))).replace(/=+$/, ''), refresh: 'test-refresh', nutzer: { id: id, mail: mail } };
}

/* Supabase Auth gestört (Fehler 5xx, Bremse 429, keine Verbindung): eine Störung, keine abgelaufene Anmeldung. Sonst würde die App
   die Anmeldung wegwerfen, obwohl sie gültig ist. */
const gestoert = () => new ApiFehler('Die Anmeldung ist gerade nicht erreichbar. Bitte gleich noch einmal.', 503, { gestoert: true });
async function gotrueSicher(k, pfad, init, token) {
  let r; try { r = await gotrue(k, pfad, init, token); } catch (e) { throw gestoert(); }
  if (r.status >= 500 || r.status === 429) throw gestoert();
  return r;
}

/* null: Erneuerung abgelehnt (abgelaufen, schon benutzt, Konto gelöscht); Störung: Fehler 503 */
export async function erneuern(k, refresh) {
  if (!k.supabase) return null;
  const r = await gotrueSicher(k, 'token?grant_type=refresh_token', { body: { refresh_token: String(refresh || '') } });
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

/* Wer steckt hinter dem Token? Kurz zwischengespeichert, damit nicht jeder Aufruf bei Supabase nachfragt. null: Token ungültig;
   ist Supabase gestört, ein Fehler 503 (dann bleibt die Anmeldung in der App erhalten) */
export async function nutzer(k, token) {
  token = String(token || '');
  if (!token) return null;
  const c = cache.get(token); if (c && c.bis > Date.now()) return c.n;
  let n = null;
  if (k.supabase) { const r = await gotrueSicher(k, 'user', null, token); if (r.ok && r.data && r.data.id) n = { id: r.data.id, mail: String(r.data.email || '').toLowerCase() }; }
  else if (token.startsWith('test.')) { try { const mail = decodeURIComponent(escape(atob(token.slice(5)))); n = { id: 'u_' + hashN(mail).toString(36), mail: mail }; } catch (e) { n = null; } }
  if (n) { cache.set(token, { n: n, bis: Date.now() + 60000 }); if (cache.size > 2000) cache.clear(); }
  return n;
}

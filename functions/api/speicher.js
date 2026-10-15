/* eeziframes · Speicher: Supabase (PostgREST über fetch, mit dem geheimen Schlüssel sb_secret_… bzw. früher service_role, nur vom Server aus) oder eine Attrappe im Arbeitsspeicher zum Testen.
   Tabellen: siehe supabase/schema.sql. Je Betrieb liegt das Konto als ein JSON-Dokument (daten) mit Projekten, Buchungen und Nachrichten;
   Änderungen laufen über betriebAendern(id, fn) mit Versionszähler, damit zwei gleichzeitige Eingänge sich nicht überschreiben. */
import { ApiFehler, sbNeu } from './umgebung.js';

const attrappe = { betriebe: new Map(), zahlungen: new Map(), ereignisse: new Set(), codes: new Map() };
const kopie = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));

export function speicher(k) {
  if (k.supabase) return supabaseSpeicher(k);
  if (k.datenAttrappe) return attrappeSpeicher();
  return null;
}

function attrappeSpeicher() {
  const B = attrappe.betriebe;
  const find = (fn) => { for (const r of B.values()) if (fn(r)) return kopie(r); return null; };
  return {
    art: 'attrappe',
    betriebHolen: async (id) => kopie(B.get(id) || null),
    betriebNachAuth: async (uid) => find((r) => r.auth_user === uid),
    betriebNachMail: async (mail) => find((r) => r.mail === mail),
    betriebNachCode: async (code) => find((r) => (r.daten.links || []).some((l) => l.code === code)),
    betriebeDup: async (q) => Array.from(B.values()).filter((r) => (q.tel && r.tel_norm === q.tel) || (q.name && r.name_norm === q.name && (!q.plz || String(r.plz || '').slice(0, 2) === q.plz))).map((r) => ({ id: r.id, name: r.name })),
    betriebAnlegen: async (row) => { const r = Object.assign({ id: uuid(), version: 0, created_at: new Date().toISOString() }, kopie(row)); B.set(r.id, r); return kopie(r); },
    betriebAendern: async (id, fn) => { const r = B.get(id); if (!r) throw new ApiFehler('Konto nicht gefunden.', 404); const a = kopie(r.daten), out = await fn(a, r); r.daten = a; r.version++; r.updated_at = new Date().toISOString(); return out; },
    betriebFelder: async (id, patch) => { const r = B.get(id); if (r) Object.assign(r, kopie(patch)); return kopie(r); },
    betriebeMitKunde: async () => Array.from(B.values()).filter((r) => r.stripe_customer).map(kopie),
    zahlungHolen: async (session) => kopie(attrappe.zahlungen.get(session) || null),
    zahlungAnlegen: async (row) => { attrappe.zahlungen.set(row.stripe_session, Object.assign({ id: uuid(), created_at: new Date().toISOString() }, kopie(row))); return true; },
    zahlungAendern: async (session, patch) => { const z = attrappe.zahlungen.get(session); if (z) Object.assign(z, kopie(patch)); return !!z; },
    ereignisNeu: async (id) => { if (attrappe.ereignisse.has(id)) return false; attrappe.ereignisse.add(id); return true; },
    ereignisBekannt: async (id) => attrappe.ereignisse.has(id),
    /* nur Attrappe: Anmeldecodes */
    codeMerken: (mail, code) => attrappe.codes.set(mail, code),
    codeLesen: (mail) => attrappe.codes.get(mail)
  };
}

function supabaseSpeicher(k) {
  const basis = k.supabase.url + '/rest/v1/';
  async function sb(pfad, init) {
    init = init || {};
    const kopf = { apikey: k.supabase.service, 'content-type': 'application/json', Prefer: init.prefer || 'return=representation' };
    if (!sbNeu(k.supabase.service)) kopf.Authorization = 'Bearer ' + k.supabase.service; // früherer service_role-Schlüssel (JWT)
    const r = await fetch(basis + pfad, { method: init.method || 'GET', headers: Object.assign(kopf, init.headers || {}), body: init.body ? JSON.stringify(init.body) : undefined });
    if (r.status === 409) return { konflikt: true };
    if (!r.ok) { console.log('Supabase-Fehler', r.status, pfad.split('?')[0], (await r.text().catch(() => '')).slice(0, 200)); throw new ApiFehler('Datenbank antwortet nicht (' + r.status + ')', 502); }
    if (r.status === 204) return null;
    const text = await r.text(); return text ? JSON.parse(text) : null;
  }
  const eins = (rows) => (Array.isArray(rows) && rows.length ? rows[0] : null);
  const q = (s) => encodeURIComponent(String(s));
  return {
    art: 'supabase',
    betriebHolen: async (id) => eins(await sb('betriebe?id=eq.' + q(id) + '&select=*')),
    betriebNachAuth: async (uid) => eins(await sb('betriebe?auth_user=eq.' + q(uid) + '&select=*')),
    betriebNachMail: async (mail) => eins(await sb('betriebe?mail=eq.' + q(mail) + '&select=*')),
    betriebNachCode: async (code) => eins(await sb('betriebe?daten=cs.' + q(JSON.stringify({ links: [{ code: code }] })) + '&select=*&limit=1')),
    betriebeDup: async (qq) => { const teile = []; if (qq.tel) teile.push('tel_norm.eq.' + qq.tel); if (qq.name) teile.push(qq.plz ? 'and(name_norm.eq.' + qq.name + ',plz.like.' + qq.plz + '*)' : 'name_norm.eq.' + qq.name); if (!teile.length) return []; return (await sb('betriebe?or=(' + encodeURIComponent(teile.join(',')) + ')&select=id,name')) || []; },
    betriebAnlegen: async (row) => eins(await sb('betriebe', { method: 'POST', body: row })),
    /* Lesen, ändern, mit Versionsnummer zurückschreiben; bei Konflikt neu lesen */
    betriebAendern: async (id, fn) => {
      for (let i = 0; i < 4; i++) {
        const r = eins(await sb('betriebe?id=eq.' + q(id) + '&select=*')); if (!r) throw new ApiFehler('Konto nicht gefunden.', 404);
        const a = r.daten || {}, out = await fn(a, r);
        const res = await sb('betriebe?id=eq.' + q(id) + '&version=eq.' + q(r.version), { method: 'PATCH', body: { daten: a, version: (r.version || 0) + 1, updated_at: new Date().toISOString() } });
        if (Array.isArray(res) && res.length) return out;
      }
      throw new ApiFehler('Gleichzeitige Änderung, bitte noch einmal versuchen.', 409);
    },
    betriebFelder: async (id, patch) => eins(await sb('betriebe?id=eq.' + q(id), { method: 'PATCH', body: patch })),
    betriebeMitKunde: async () => (await sb('betriebe?stripe_customer=not.is.null&select=*')) || [],
    zahlungHolen: async (session) => eins(await sb('zahlungen?stripe_session=eq.' + q(session) + '&select=*')),
    zahlungAnlegen: async (row) => { await sb('zahlungen?on_conflict=stripe_session', { method: 'POST', body: row, prefer: 'resolution=merge-duplicates,return=representation' }); return true; },
    zahlungAendern: async (session, patch) => { const r = await sb('zahlungen?stripe_session=eq.' + q(session), { method: 'PATCH', body: patch }); return Array.isArray(r) && r.length > 0; },
    ereignisNeu: async (id) => { const r = await sb('ereignisse', { method: 'POST', body: { stripe_id: id } }); return !(r && r.konflikt); },
    ereignisBekannt: async (id) => !!eins(await sb('ereignisse?stripe_id=eq.' + q(id) + '&select=stripe_id'))
  };
}

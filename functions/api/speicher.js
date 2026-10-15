/* eeziframes · Speicher: Supabase (PostgREST über fetch, mit dem geheimen Schlüssel sb_secret_… bzw. früher service_role, nur vom Server aus) oder eine Attrappe im Arbeitsspeicher zum Testen.
   Tabellen: siehe supabase/schema.sql. Je Betrieb liegt das Konto als ein JSON-Dokument (daten) mit Projekten, Buchungen und Nachrichten;
   Änderungen laufen über betriebAendern(id, fn) mit Versionszähler, damit zwei gleichzeitige Eingänge sich nicht überschreiben.
   Für die Zentrale (zentrale.js): alle Betriebe lesen, ein Konto löschen, Käufe lesen, Protokoll der Eingriffe, eigene Statistik
   (Tageszähler über die Funktion eeziframes_zaehlen). Protokoll und Statistik sind optional: Fehlen die Tabellen noch
   (schema.sql nicht erneut ausgeführt), melden die Funktionen das (null bzw. false), statt einen Fehler zu werfen. */
import { ApiFehler, sbNeu } from './umgebung.js';

const attrappe = { betriebe: new Map(), zahlungen: new Map(), ereignisse: new Set(), codes: new Map(), protokoll: [], statistik: new Map() };
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
    /* Zentrale */
    betriebeAlle: async () => Array.from(B.values()).map(kopie).sort((x, y) => String(y.created_at).localeCompare(String(x.created_at))),
    betriebLoeschen: async (id) => B.delete(id),
    zahlungenAlle: async () => Array.from(attrappe.zahlungen.values()).map(kopie).sort((x, y) => String(y.created_at).localeCompare(String(x.created_at))),
    zahlungenAufraeumen: async (grenze) => { for (const [s, z] of attrappe.zahlungen) if (z.status === 'offen' && z.created_at < grenze) attrappe.zahlungen.delete(s); return true; },
    protokollSchreiben: async (e) => { attrappe.protokoll.unshift(Object.assign({ id: uuid(), zeit: new Date().toISOString(), betrieb: null, text: '', daten: {}, netz: null }, kopie(e))); return true; },
    protokollLesen: async (o) => { o = o || {}; const alle = attrappe.protokoll.filter((e) => (!o.betrieb || e.betrieb === o.betrieb) && (!o.art || e.art === o.art)); return alle.slice(o.von || 0, (o.von || 0) + (o.anzahl || 100)).map(kopie); },
    protokollAufraeumen: async (grenzeAnmeldung, grenzeAlle) => { attrappe.protokoll = attrappe.protokoll.filter((e) => !(e.zeit < grenzeAlle || (/^anmeldung/.test(e.art) && e.zeit < grenzeAnmeldung))); return true; },
    zaehlen: async (tag, schluessel) => { schluessel.forEach((s) => { const k2 = tag + '|' + s; attrappe.statistik.set(k2, (attrappe.statistik.get(k2) || 0) + 1); }); return true; },
    statistikLesen: async (von) => Array.from(attrappe.statistik.entries()).map(([k2, n]) => ({ tag: k2.slice(0, 10), schluessel: k2.slice(11), anzahl: n })).filter((r) => r.tag >= von),
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
    if (r.status === 404 && init.optional) { await r.text().catch(() => ''); return { fehlt: true }; } // Tabelle oder Funktion noch nicht angelegt (PGRST205/PGRST202)
    if (!r.ok) { console.log('Supabase-Fehler', r.status, pfad.split('?')[0], (await r.text().catch(() => '')).slice(0, 200)); throw new ApiFehler('Datenbank antwortet nicht (' + r.status + ')', 502); }
    if (r.status === 204) return null;
    const text = await r.text(); return text ? JSON.parse(text) : null;
  }
  const eins = (rows) => (Array.isArray(rows) && rows.length ? rows[0] : null);
  const q = (s) => encodeURIComponent(String(s));
  /* Supabase liefert höchstens 1000 Zeilen je Anfrage (Einstellung „Max rows“): seitenweise lesen; null, wenn die Tabelle fehlt */
  async function alle(pfad, optional) {
    const out = [];
    for (let von = 0; von < 200000; von += 1000) {
      const r = await sb(pfad + (pfad.includes('?') ? '&' : '?') + 'limit=1000&offset=' + von, { optional: optional });
      if (r && r.fehlt) return null;
      const teil = Array.isArray(r) ? r : [];
      out.push.apply(out, teil);
      if (teil.length < 1000) break;
    }
    return out;
  }
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
    ereignisBekannt: async (id) => !!eins(await sb('ereignisse?stripe_id=eq.' + q(id) + '&select=stripe_id')),
    /* Zentrale */
    betriebeAlle: async () => (await alle('betriebe?select=*&order=created_at.desc,id.asc')) || [],
    betriebLoeschen: async (id) => { await sb('betriebe?id=eq.' + q(id), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
    zahlungenAlle: async () => (await alle('zahlungen?select=id,stripe_session,art,kennung,mail,betrag_cent,status,created_at&order=created_at.desc,id.asc')) || [],
    zahlungenAufraeumen: async (grenze) => { await sb('zahlungen?status=eq.offen&created_at=lt.' + q(grenze), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
    protokollSchreiben: async (e) => { const r = await sb('protokoll', { method: 'POST', body: e, prefer: 'return=minimal', optional: true }); return !(r && r.fehlt); },
    protokollLesen: async (o) => {
      o = o || {};
      const r = await sb('protokoll?select=*&order=zeit.desc,id.asc&limit=' + Math.min(500, o.anzahl || 100) + '&offset=' + (o.von || 0) + (o.betrieb ? '&betrieb=eq.' + q(o.betrieb) : '') + (o.art ? '&art=eq.' + q(o.art) : ''), { optional: true });
      return r && r.fehlt ? null : r || [];
    },
    protokollAufraeumen: async (grenzeAnmeldung, grenzeAlle) => {
      const a = await sb('protokoll?art=in.(anmeldung,anmeldung_fehlgeschlagen)&zeit=lt.' + q(grenzeAnmeldung), { method: 'DELETE', prefer: 'return=minimal', optional: true });
      if (a && a.fehlt) return false;
      await sb('protokoll?zeit=lt.' + q(grenzeAlle), { method: 'DELETE', prefer: 'return=minimal', optional: true });
      return true;
    },
    zaehlen: async (tag, schluessel) => { const r = await sb('rpc/eeziframes_zaehlen', { method: 'POST', body: { p_tag: tag, p_schluessel: schluessel }, prefer: 'return=minimal', optional: true }); return !(r && r.fehlt); },
    statistikLesen: async (von) => alle('statistik?select=tag,schluessel,anzahl&tag=gte.' + q(von) + '&order=tag.asc,schluessel.asc', true)
  };
}

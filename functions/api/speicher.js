/* eeziframes · Speicher: Supabase (PostgREST über fetch, mit dem geheimen Schlüssel sb_secret_… bzw. früher service_role, nur vom Server aus) oder eine Attrappe im Arbeitsspeicher zum Testen.
   Tabellen: siehe supabase/schema.sql. Je Betrieb liegt das Konto als ein JSON-Dokument (daten) mit Projekten, Buchungen und Nachrichten;
   Änderungen laufen über betriebAendern(id, fn) mit Versionszähler, damit zwei gleichzeitige Eingänge sich nicht überschreiben.
   Für die Zentrale (zentrale.js): alle Betriebe lesen, ein Konto löschen, Käufe lesen, Protokoll der Eingriffe, eigene Statistik
   (Tageszähler über die Funktion eeziframes_zaehlen), Zwischenstände der Kundenlinks (entwuerfe). Protokoll, Statistik und
   Zwischenstände sind optional: Fehlen die Tabellen noch (schema.sql nicht erneut ausgeführt), melden die Funktionen das
   (null, undefined bzw. false), statt einen Fehler zu werfen. Ebenso die Aufmaße der Hauseigentümer mit Konto (eigene, eigene.js).
   Zahlungen halten seit Oktober 2026 auch die Zustimmung an der Kasse (daten), den Zeitpunkt der Zahlung und der zugestellten
   Vertragsbestätigung; fehlen diese Spalten noch, schreibt der Server ohne sie weiter und meldet das im Log. */
import { ApiFehler, sbNeu } from './umgebung.js';

const attrappe = { betriebe: new Map(), zahlungen: new Map(), ereignisse: new Set(), codes: new Map(), nutzer: new Set(), protokoll: [], statistik: new Map(), entwuerfe: new Map(), eigene: new Map(),
  /* Konfigurator-Instanzen (docs/INSTANZEN.md) */
  instanzen: new Map(), hosts: new Map(), anfragen: new Map(), partner: new Map(), bestellungen: new Map(), nachrichten: new Map(), bestellNr: 0 };
const kopie = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
/* Vertragsbestätigung: so oft versucht der tägliche Lauf eine nicht zugestellte nachzuholen (bestaetigung.js) */
export const VERSUCHE = 12;
/* Spalten der Zahlungen, die erst eine neuere schema.sql anlegt */
const NEU = ['daten', 'bezahlt_am', 'bestaetigt_am', 'versuche'];
const ohneNeu = (o) => { const x = Object.assign({}, o); NEU.forEach((s) => delete x[s]); return x; };
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));

export function speicher(k) {
  if (k.supabase) return supabaseSpeicher(k);
  if (k.datenAttrappe) return attrappeSpeicher();
  return null;
}

function attrappeSpeicher() {
  const B = attrappe.betriebe;
  const find = (fn) => { for (const r of B.values()) if (fn(r)) return kopie(r); return null; };
  const s = {
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
    zahlungAnlegen: async (row) => { attrappe.zahlungen.set(row.stripe_session, Object.assign({ id: uuid(), created_at: new Date().toISOString(), daten: {}, bezahlt_am: null, bestaetigt_am: null, versuche: 0 }, kopie(row))); return true; },
    zahlungAendern: async (session, patch) => { const z = attrappe.zahlungen.get(session); if (z) Object.assign(z, kopie(patch)); return !!z; },
    /* wie in der Datenbank: nur eine noch nicht bezahlte Zahlung wird bezahlt (true), sonst nichts (false) */
    zahlungBezahlt: async (row) => {
      const z = attrappe.zahlungen.get(row.stripe_session);
      if (z) { if (z.status === 'bezahlt') return false; Object.assign(z, { status: 'bezahlt', token: row.token, bezahlt_am: row.bezahlt_am || new Date().toISOString() }, row.mail ? { mail: row.mail } : {}); return true; }
      attrappe.zahlungen.set(row.stripe_session, Object.assign({ id: uuid(), created_at: new Date().toISOString(), bestaetigt_am: null, versuche: 0 }, kopie(row), { status: 'bezahlt' })); return true;
    },
    zahlungenUnbestaetigt: async (seit, alle) => Array.from(attrappe.zahlungen.values()).filter((z) => z.status === 'bezahlt' && z.art === 'aufmass' && !z.bestaetigt_am && (alle || (z.versuche || 0) < VERSUCHE) && String(z.created_at) >= seit).map(kopie),
    zahlungenAltLoeschen: async (grenze) => { for (const [s, z] of attrappe.zahlungen) if (z.status === 'bezahlt' && z.created_at < grenze) attrappe.zahlungen.delete(s); return true; },
    ereignisNeu: async (id) => { if (attrappe.ereignisse.has(id)) return false; attrappe.ereignisse.add(id); return true; },
    ereignisBekannt: async (id) => attrappe.ereignisse.has(id),
    /* Zentrale */
    betriebeAlle: async () => Array.from(B.values()).map(kopie).sort((x, y) => String(y.created_at).localeCompare(String(x.created_at))),
    betriebLoeschen: async (id) => { for (const [c, e] of attrappe.entwuerfe) if (e.betrieb === id) attrappe.entwuerfe.delete(c); return B.delete(id); }, // wie on delete cascade
    zahlungenAlle: async () => Array.from(attrappe.zahlungen.values()).map(kopie).sort((x, y) => String(y.created_at).localeCompare(String(x.created_at))),
    zahlungenAufraeumen: async (grenze) => { for (const [s, z] of attrappe.zahlungen) if (z.status === 'offen' && z.created_at < grenze) attrappe.zahlungen.delete(s); return true; },
    protokollSchreiben: async (e) => { attrappe.protokoll.unshift(Object.assign({ id: uuid(), zeit: new Date().toISOString(), betrieb: null, text: '', daten: {}, netz: null }, kopie(e))); return true; },
    protokollLesen: async (o) => { o = o || {}; const alle = attrappe.protokoll.filter((e) => (!o.betrieb || e.betrieb === o.betrieb) && (!o.art || e.art === o.art) && (!o.seit || e.zeit >= o.seit)); return alle.slice(o.von || 0, (o.von || 0) + (o.anzahl || 100)).map(kopie); },
    /* grenzeWiderruf: Widerrufe bleiben bis zum Ende des dritten Jahres nach dem Eingang (zentrale.js, aufraeumen) */
    protokollAufraeumen: async (grenzeAnmeldung, grenzeAlle, grenzeWiderruf) => { attrappe.protokoll = attrappe.protokoll.filter((e) => /^widerruf/.test(e.art) ? !(grenzeWiderruf && e.zeit < grenzeWiderruf) : !(e.zeit < grenzeAlle || (/^anmeldung/.test(e.art) && e.zeit < grenzeAnmeldung))); return true; },
    zaehlen: async (tag, schluessel) => { schluessel.forEach((s) => { const k2 = tag + '|' + s; attrappe.statistik.set(k2, (attrappe.statistik.get(k2) || 0) + 1); }); return true; },
    statistikLesen: async (von, bis) => Array.from(attrappe.statistik.entries()).map(([k2, n]) => ({ tag: k2.slice(0, 10), schluessel: k2.slice(11), anzahl: n })).filter((r) => r.tag >= von && (!bis || r.tag <= bis)),
    statistikErsterTag: async () => Array.from(attrappe.statistik.keys()).map((k2) => k2.slice(0, 10)).sort()[0] || null,
    statistikStunden: async (von, bis) => Array.from(attrappe.statistik.entries()).map(([k2, n]) => ({ tag: k2.slice(0, 10), schluessel: k2.slice(11), anzahl: n })).filter((r) => r.tag >= von && r.tag <= bis && r.schluessel.startsWith('stunde:')),
    statistikStundenAb: async () => Array.from(attrappe.statistik.keys()).filter((k2) => k2.slice(11).startsWith('stunde:')).map((k2) => k2.slice(0, 10) + ' ' + k2.slice(18, 20)).sort()[0] || null,
    /* wie die Funktionen eeziframes_auswerten und eeziframes_auswerten_zeitraum in der Datenbank: Tagessummen je Art (aufruf:*,
       besuch:*, bot:*) und Summen je Schlüssel */
    statistikAuswerten: async (von, bis) => {
      const tage = new Map(), summen = new Map();
      for (const [k2, n] of attrappe.statistik.entries()) {
        const tag = k2.slice(0, 10), sch = k2.slice(11), art = sch.split(':')[0]; if (tag < von || (bis && tag > bis)) continue;
        if (['aufruf', 'besuch', 'bot'].includes(art)) tage.set(tag + '|' + art + ':*', (tage.get(tag + '|' + art + ':*') || 0) + n);
        summen.set(sch, (summen.get(sch) || 0) + n);
      }
      return Array.from(tage.entries()).map(([k2, n]) => ({ tag: k2.slice(0, 10), schluessel: k2.slice(11), anzahl: n })).concat(Array.from(summen.entries()).map(([sch, n]) => ({ tag: null, schluessel: sch, anzahl: n })));
    },
    /* Zwischenstand eines Kundenlinks (entwurf.js): lesen, mit Versionszähler ändern, für Zentrale und Aufräumen ohne Inhalt auflisten */
    entwurfHolen: async (code) => kopie(attrappe.entwuerfe.get(code) || null),
    entwurfAendern: async (code, betrieb, fn) => {
      const alt = attrappe.entwuerfe.get(code) || null, r = kopie(alt) || { code: code, betrieb: betrieb, daten: {}, meta: {}, stand: 0, version: 0, created_at: new Date().toISOString() };
      const out = await fn(r); if (out === false) return { row: kopie(alt), out: out };
      r.version = (alt ? alt.version : 0) + 1; r.updated_at = new Date().toISOString(); attrappe.entwuerfe.set(code, r); return { row: kopie(r), out: out };
    },
    entwuerfeAlle: async () => Array.from(attrappe.entwuerfe.values()).map((r) => ({ code: r.code, betrieb: r.betrieb, meta: kopie(r.meta), stand: r.stand, created_at: r.created_at, updated_at: r.updated_at })),
    entwurfLoeschen: async (code) => attrappe.entwuerfe.delete(code),
    entwuerfeVonBetrieb: async (id) => Array.from(attrappe.entwuerfe.values()).filter((r) => r.betrieb === id).map((r) => ({ code: r.code, betrieb: r.betrieb, meta: kopie(r.meta), stand: r.stand, created_at: r.created_at, updated_at: r.updated_at })),
    /* Aufmaße der Hauseigentümer mit Konto (eigene.js): wie Zwischenstände, je Kennung, mit der Anmeldung (nutzer) als Besitzer */
    eigeneDa: async () => true,
    eigenesHolen: async (kennung) => kopie(attrappe.eigene.get(kennung) || null),
    eigenesAendern: async (kennung, nutzer, fn) => {
      const alt = attrappe.eigene.get(kennung) || null, r = kopie(alt) || { kennung: kennung, nutzer: nutzer, daten: {}, meta: {}, stand: 0, version: 0, created_at: new Date().toISOString() };
      const out = await fn(r); if (out === false) return { row: kopie(alt), out: out };
      r.version = (alt ? alt.version : 0) + 1; r.updated_at = new Date().toISOString(); attrappe.eigene.set(kennung, r); return { row: kopie(r), out: out };
    },
    eigeneVonNutzer: async (nutzer) => Array.from(attrappe.eigene.values()).filter((r) => r.nutzer === nutzer && !(r.meta && r.meta.entfernt)).sort((x, y) => String(y.updated_at).localeCompare(String(x.updated_at))).map((r) => ({ kennung: r.kennung, nutzer: r.nutzer, meta: kopie(r.meta), stand: r.stand, created_at: r.created_at, updated_at: r.updated_at, name: ((r.daten || {}).proj || {}).name || '' })),
    eigeneAlle: async () => Array.from(attrappe.eigene.values()).map((r) => ({ kennung: r.kennung, nutzer: r.nutzer, meta: kopie(r.meta), stand: r.stand, created_at: r.created_at, updated_at: r.updated_at })),
    eigenesLoeschen: async (kennung, bis) => { const r = attrappe.eigene.get(kennung); if (!r || (bis && !(String(r.updated_at || '') < bis))) return false; return attrappe.eigene.delete(kennung); },
    /* in der App gelöscht: Inhalt weg, Löschmarke bleibt (eigene.js) */
    eigenesWeg: async (kennung) => { const r = attrappe.eigene.get(kennung); if (!r || (r.meta && r.meta.entfernt)) return false; Object.assign(r, { daten: {}, meta: { entfernt: Date.now() }, stand: 0, version: -1, updated_at: new Date().toISOString() }); return true; },
    eigeneWegVonNutzer: async (nutzer) => { const t = Date.now(), iso = new Date().toISOString(); for (const r of attrappe.eigene.values()) if (r.nutzer === nutzer && !(r.meta && r.meta.entfernt)) Object.assign(r, { daten: {}, meta: { entfernt: t }, stand: 0, version: -1, updated_at: iso }); return true; },
    /* nur Attrappe: Anmeldecodes und angemeldete Adressen (wie die Nutzer in Supabase Auth) */
    codeMerken: (mail, code) => attrappe.codes.set(mail, code),
    codeLesen: (mail) => attrappe.codes.get(mail),
    nutzerMerken: (mail) => attrappe.nutzer.add(mail),
    nutzerBekannt: (mail) => attrappe.nutzer.has(mail)
  };
  return Object.assign(s, instanzAttrappe());
}

function supabaseSpeicher(k) {
  const basis = k.supabase.url + '/rest/v1/';
  async function sb(pfad, init) {
    init = init || {};
    const kopf = { apikey: k.supabase.service, 'content-type': 'application/json', Prefer: init.prefer || 'return=representation' };
    if (!sbNeu(k.supabase.service)) kopf.Authorization = 'Bearer ' + k.supabase.service; // früherer service_role-Schlüssel (JWT)
    const r = await fetch(basis + pfad, { method: init.method || 'GET', headers: Object.assign(kopf, init.headers || {}), body: init.body ? JSON.stringify(init.body) : undefined });
    if (r.status === 409) return init.konfliktText ? { konflikt: true, text: await r.text().catch(() => '') } : { konflikt: true }; // konfliktText: welcher Schlüssel (Instanzen)
    if (r.status === 404 && init.optional) { await r.text().catch(() => ''); return { fehlt: true }; } // Tabelle oder Funktion noch nicht angelegt (PGRST205/PGRST202)
    /* Spalte noch nicht angelegt (schema.sql nicht erneut ausgeführt): PGRST204 beim Schreiben, 42703 beim Filtern */
    if (r.status === 400 && init.spalten) { const t = await r.text().catch(() => ''); if (/PGRST204|42703|does not exist|Could not find the/.test(t)) { console.log('Datenbank: neue Spalten fehlen, bitte supabase/schema.sql erneut ausführen (' + pfad.split('?')[0] + ')'); return { spalteFehlt: true }; } console.log('Supabase-Fehler', r.status, pfad.split('?')[0], t.slice(0, 200)); throw new ApiFehler('Datenbank antwortet nicht (' + r.status + ')', 502); }
    if (!r.ok) { console.log('Supabase-Fehler', r.status, pfad.split('?')[0], (await r.text().catch(() => '')).slice(0, 200)); throw new ApiFehler('Datenbank antwortet nicht (' + r.status + ')', 502); }
    if (r.status === 204) return null;
    const text = await r.text();
    /* zaehlen: Anzahl aller Treffer aus Content-Range (Prefer: count=exact), z. B. „0-0/57“ */
    if (init.zaehlen) { const n = Number(String(r.headers.get('content-range') || '').split('/')[1]); return { rows: text ? JSON.parse(text) : [], anzahl: Number.isFinite(n) ? n : null }; }
    return text ? JSON.parse(text) : null;
  }
  const eins = (rows) => (Array.isArray(rows) && rows.length ? rows[0] : null);
  const q = (s) => encodeURIComponent(String(s));
  /* Supabase liefert höchstens 1000 Zeilen je Anfrage (Einstellung „Max rows“): seitenweise lesen, höchstens 40 Seiten (Grenze für
     Unteranfragen je Aufruf bei Cloudflare); null, wenn die Tabelle fehlt */
  async function alle(pfad, optional) {
    const out = [];
    for (let von = 0; von < 40000; von += 1000) {
      const r = await sb(pfad + (pfad.includes('?') ? '&' : '?') + 'limit=1000&offset=' + von, { optional: optional });
      if (r && r.fehlt) return null;
      const teil = Array.isArray(r) ? r : [];
      out.push.apply(out, teil);
      if (teil.length < 1000) break;
    }
    return out;
  }
  const s = {
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
    betriebeMitKunde: async () => (await alle('betriebe?stripe_customer=not.is.null&select=*&order=id.asc')) || [],
    zahlungHolen: async (session) => eins(await sb('zahlungen?stripe_session=eq.' + q(session) + '&select=*')),
    /* Neue Spalten (daten, bezahlt_am, bestaetigt_am, versuche) fehlen in einer älteren Datenbank: dann ohne sie schreiben */
    zahlungAnlegen: async (row) => { const r = await sb('zahlungen?on_conflict=stripe_session', { method: 'POST', body: row, prefer: 'resolution=merge-duplicates,return=representation', spalten: true }); if (r && r.spalteFehlt) await sb('zahlungen?on_conflict=stripe_session', { method: 'POST', body: ohneNeu(row), prefer: 'resolution=merge-duplicates,return=representation' }); return true; },
    zahlungAendern: async (session, patch) => { let r = await sb('zahlungen?stripe_session=eq.' + q(session), { method: 'PATCH', body: patch, spalten: true }); if (r && r.spalteFehlt) { const p2 = ohneNeu(patch); if (!Object.keys(p2).length) return false; r = await sb('zahlungen?stripe_session=eq.' + q(session), { method: 'PATCH', body: p2 }); } return Array.isArray(r) && r.length > 0; },
    /* Nur eine noch nicht bezahlte Zahlung wird bezahlt (true); war sie es schon, ändert sich nichts (false). So schickt nur einer von
       zwei gleichzeitigen Wegen (Rückkehr und Webhook) die Vertragsbestätigung. Fehlt die Zeile, wird sie angelegt (Duplikat: false). */
    zahlungBezahlt: async (row) => {
      const patch = Object.assign({ status: 'bezahlt', token: row.token, bezahlt_am: row.bezahlt_am }, row.mail ? { mail: row.mail } : {});
      let r = await sb('zahlungen?stripe_session=eq.' + q(row.stripe_session) + '&status=neq.bezahlt', { method: 'PATCH', body: patch, spalten: true });
      if (r && r.spalteFehlt) r = await sb('zahlungen?stripe_session=eq.' + q(row.stripe_session) + '&status=neq.bezahlt', { method: 'PATCH', body: ohneNeu(patch) });
      if (Array.isArray(r) && r.length) return true;
      const neu = Object.assign({}, row, { status: 'bezahlt' });
      let n = await sb('zahlungen?on_conflict=stripe_session', { method: 'POST', body: neu, prefer: 'resolution=ignore-duplicates,return=representation', spalten: true });
      if (n && n.spalteFehlt) n = await sb('zahlungen?on_conflict=stripe_session', { method: 'POST', body: ohneNeu(neu), prefer: 'resolution=ignore-duplicates,return=representation' });
      return Array.isArray(n) && n.length > 0;
    },
    /* Käufe ohne zugestellte Vertragsbestätigung (für den täglichen Lauf; alle: auch aufgegebene, für die Zentrale); null, wenn die
       Spalten noch fehlen */
    zahlungenUnbestaetigt: async (seit, alle) => { const r = await sb('zahlungen?status=eq.bezahlt&art=eq.aufmass&bestaetigt_am=is.null' + (alle ? '' : '&versuche=lt.' + VERSUCHE) + '&created_at=gte.' + q(seit) + '&select=*&order=created_at.asc&limit=' + (alle ? 200 : 50), { spalten: true }); return r && r.spalteFehlt ? null : r || []; },
    zahlungenAltLoeschen: async (grenze) => { await sb('zahlungen?status=eq.bezahlt&created_at=lt.' + q(grenze), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
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
      const r = await sb('protokoll?select=*&order=zeit.desc,id.asc&limit=' + Math.min(500, o.anzahl || 100) + '&offset=' + (o.von || 0) + (o.betrieb ? '&betrieb=eq.' + q(o.betrieb) : '') + (o.art ? '&art=eq.' + q(o.art) : '') + (o.seit ? '&zeit=gte.' + q(o.seit) : ''), { optional: true });
      return r && r.fehlt ? null : r || [];
    },
    /* grenzeWiderruf: Widerrufe (und ihre nachgeholten Eingangsbestätigungen) bleiben bis zum Ende des dritten Jahres nach dem Eingang */
    protokollAufraeumen: async (grenzeAnmeldung, grenzeAlle, grenzeWiderruf) => {
      const a = await sb('protokoll?art=in.(anmeldung,anmeldung_fehlgeschlagen)&zeit=lt.' + q(grenzeAnmeldung), { method: 'DELETE', prefer: 'return=minimal', optional: true });
      if (a && a.fehlt) return false;
      await sb('protokoll?art=not.like.widerruf*&zeit=lt.' + q(grenzeAlle), { method: 'DELETE', prefer: 'return=minimal', optional: true });
      if (grenzeWiderruf) await sb('protokoll?art=like.widerruf*&zeit=lt.' + q(grenzeWiderruf), { method: 'DELETE', prefer: 'return=minimal', optional: true });
      return true;
    },
    zaehlen: async (tag, schluessel) => { const r = await sb('rpc/eeziframes_zaehlen', { method: 'POST', body: { p_tag: tag, p_schluessel: schluessel }, prefer: 'return=minimal', optional: true }); return !(r && r.fehlt); },
    statistikLesen: async (von, bis) => alle('statistik?select=tag,schluessel,anzahl&tag=gte.' + q(von) + (bis ? '&tag=lte.' + q(bis) : '') + '&order=tag.desc,schluessel.asc', true),
    /* verdichtet in der Datenbank (Funktion eeziframes_auswerten); null, wenn es die Funktion noch nicht gibt */
    /* mit Ende: eigene Funktion (schema.sql); fehlt sie noch, liefert das null, und auswerten nimmt die einzelnen Tageszähler */
    statistikAuswerten: async (von, bis) => alle(bis ? 'rpc/eeziframes_auswerten_zeitraum?p_von=' + q(von) + '&p_bis=' + q(bis) + '&order=schluessel.asc,tag.asc' : 'rpc/eeziframes_auswerten?p_von=' + q(von) + '&order=schluessel.asc,tag.asc', true),
    statistikErsterTag: async () => { const r = await sb('statistik?select=tag&order=tag.asc&limit=1', { optional: true }); return Array.isArray(r) && r[0] ? String(r[0].tag).slice(0, 10) : null; },
    /* Stundenzähler (stunde:HH|…) eines Zeitraums für die Auswertung der Anzeigen; null, wenn die Tabelle fehlt */
    statistikStunden: async (von, bis) => alle('statistik?select=tag,schluessel,anzahl&schluessel=like.stunde:*&tag=gte.' + q(von) + '&tag=lte.' + q(bis) + '&order=tag.asc,schluessel.asc', true),
    /* erster Stundenzähler überhaupt („JJJJ-MM-TT HH“): ab dann gibt es Stundenwerte */
    statistikStundenAb: async () => { const r = await sb('statistik?select=tag,schluessel&schluessel=like.stunde:*&order=tag.asc,schluessel.asc&limit=1', { optional: true }); return Array.isArray(r) && r[0] ? String(r[0].tag).slice(0, 10) + ' ' + String(r[0].schluessel).slice(7, 9) : null; },
    /* Zwischenstand eines Kundenlinks (entwurf.js). undefined: Tabelle fehlt noch (schema.sql nicht erneut ausgeführt) */
    entwurfHolen: async (code) => { const r = await sb('entwuerfe?code=eq.' + q(code) + '&select=*', { optional: true }); return r && r.fehlt ? undefined : eins(r); },
    /* Lesen, ändern, mit Versionsnummer zurückschreiben (wie betriebAendern); fn gibt false zurück, wenn nichts zu speichern ist */
    entwurfAendern: async (code, betrieb, fn) => {
      for (let i = 0; i < 4; i++) {
        const gelesen = await sb('entwuerfe?code=eq.' + q(code) + '&select=*', { optional: true }); if (gelesen && gelesen.fehlt) return { fehlt: true };
        const alt = eins(gelesen), r = alt ? JSON.parse(JSON.stringify(alt)) : { code: code, betrieb: betrieb, daten: {}, meta: {}, stand: 0, version: 0 };
        const out = await fn(r); if (out === false) return { row: alt, out: out };
        if (!alt) {
          const neu = await sb('entwuerfe', { method: 'POST', body: { code: code, betrieb: betrieb, daten: r.daten, meta: r.meta, stand: r.stand, version: 1 }, optional: true });
          if (neu && neu.konflikt) continue; if (neu && neu.fehlt) return { fehlt: true };
          return { row: eins(neu), out: out };
        }
        const res = await sb('entwuerfe?code=eq.' + q(code) + '&version=eq.' + q(alt.version), { method: 'PATCH', body: { daten: r.daten, meta: r.meta, stand: r.stand, version: (alt.version || 0) + 1, updated_at: new Date().toISOString() }, optional: true });
        if (Array.isArray(res) && res.length) return { row: res[0], out: out };
      }
      throw new ApiFehler('Gleichzeitige Änderung, bitte gleich noch einmal.', 409);
    },
    entwuerfeAlle: async () => alle('entwuerfe?select=code,betrieb,meta,stand,created_at,updated_at&order=updated_at.desc,code.asc', true),
    entwuerfeVonBetrieb: async (id) => { const r = await sb('entwuerfe?betrieb=eq.' + q(id) + '&select=code,betrieb,meta,stand,created_at,updated_at&order=updated_at.desc', { optional: true }); return r && r.fehlt ? null : r || []; },
    entwurfLoeschen: async (code) => { const r = await sb('entwuerfe?code=eq.' + q(code), { method: 'DELETE', prefer: 'return=minimal', optional: true }); return !(r && r.fehlt); },
    /* Aufmaße der Hauseigentümer mit Konto (eigene.js). undefined bzw. null: Tabelle fehlt noch */
    eigeneDa: async () => { const r = await sb('eigene?select=kennung&limit=1', { optional: true }); return !(r && r.fehlt); },
    eigenesHolen: async (kennung) => { const r = await sb('eigene?kennung=eq.' + q(kennung) + '&select=*', { optional: true }); return r && r.fehlt ? undefined : eins(r); },
    eigenesAendern: async (kennung, nutzer, fn) => {
      for (let i = 0; i < 4; i++) {
        const gelesen = await sb('eigene?kennung=eq.' + q(kennung) + '&select=*', { optional: true }); if (gelesen && gelesen.fehlt) return { fehlt: true };
        const alt = eins(gelesen), r = alt ? JSON.parse(JSON.stringify(alt)) : { kennung: kennung, nutzer: nutzer, daten: {}, meta: {}, stand: 0, version: 0 };
        const out = await fn(r); if (out === false) return { row: alt, out: out };
        if (!alt) {
          const neu = await sb('eigene', { method: 'POST', body: { kennung: kennung, nutzer: nutzer, daten: r.daten, meta: r.meta, stand: r.stand, version: 1 }, optional: true });
          if (neu && neu.konflikt) continue; if (neu && neu.fehlt) return { fehlt: true };
          return { row: eins(neu), out: out };
        }
        const res = await sb('eigene?kennung=eq.' + q(kennung) + '&version=eq.' + q(alt.version), { method: 'PATCH', body: { daten: r.daten, meta: r.meta, stand: r.stand, version: (alt.version || 0) + 1, updated_at: new Date().toISOString() }, optional: true });
        if (Array.isArray(res) && res.length) return { row: res[0], out: out };
      }
      throw new ApiFehler('Gleichzeitige Änderung, bitte gleich noch einmal.', 409);
    },
    eigeneVonNutzer: async (nutzer) => { const r = await sb('eigene?nutzer=eq.' + q(nutzer) + '&meta->>entfernt=is.null&select=kennung,nutzer,meta,stand,created_at,updated_at,name:daten->proj->>name&order=updated_at.desc&limit=100', { optional: true }); return r && r.fehlt ? null : r || []; },
    eigeneAlle: async () => alle('eigene?select=kennung,nutzer,meta,stand,created_at,updated_at&order=updated_at.asc,kennung.asc', true),
    /* bis (ISO-Zeit): nur löschen, wenn seitdem nicht geändert (Aufräumen) */
    eigenesLoeschen: async (kennung, bis) => { const r = await sb('eigene?kennung=eq.' + q(kennung) + (bis ? '&updated_at=lt.' + q(bis) : '') + '&select=kennung', { method: 'DELETE', optional: true }); return Array.isArray(r) && r.length > 0; },
    /* in der App gelöscht: Inhalt weg, Löschmarke bleibt (eigene.js). version -1 lässt jedes gleichzeitige Schreiben scheitern, das
       danach neu liest und die Marke sieht */
    eigenesWeg: async (kennung) => { const iso = new Date().toISOString(), r = await sb('eigene?kennung=eq.' + q(kennung) + '&meta->>entfernt=is.null&select=kennung', { method: 'PATCH', body: { daten: {}, meta: { entfernt: Date.now() }, stand: 0, version: -1, updated_at: iso }, optional: true }); return Array.isArray(r) && r.length > 0; },
    eigeneWegVonNutzer: async (nutzer) => { const iso = new Date().toISOString(), r = await sb('eigene?nutzer=eq.' + q(nutzer) + '&meta->>entfernt=is.null&select=kennung', { method: 'PATCH', body: { daten: {}, meta: { entfernt: Date.now() }, stand: 0, version: -1, updated_at: iso }, optional: true }); return !(r && r.fehlt); }
  };
  return Object.assign(s, instanzSupabase(sb, alle, eins, q));
}

/* ===================== Konfigurator-Instanzen (docs/INSTANZEN.md, Bauplan §2.6) =====================
   Tabellen instanzen, instanz_hosts, anfragen, partner, bestellungen, partner_nachrichten (supabase/schema.sql). Gleiche Funktionen
   für Supabase und Attrappe. Fehlt eine Tabelle (schema.sql nicht erneut ausgeführt), liefern lesende Funktionen undefined, schreibende
   werfen 503. Ändern (…Aendern(id, fn)): fn(z) ändert die Kopie z; Rückgabe false = nichts schreiben, sonst der Rückgabewert von fn
   oder, wenn fn nichts zurückgibt, die neue Zeile. Geschrieben wird mit Versionszähler, bei gleichzeitiger Änderung bis zu vier Versuche.
   Konflikte mit eindeutigen Schlüsseln: ApiFehler 409 mit extra.grund (slug_vergeben, host_vergeben, haupt_doppelt, anfrage_vorhanden,
   partner_vorhanden, zahlung_doppelt). */
const FEHLT = 'Die Datenbank kennt die Konfigurator-Instanzen noch nicht (supabase/schema.sql erneut ausführen).';
const PAKET_SCHLUESSEL = ['essential', 'plus', 'signature'];
/* Spalten, die …Aendern zurückschreibt (id, Schlüssel und Zeitstempel nie) */
const SPALTEN = {
  instanzen: ['slug', 'partner', 'bestellung', 'paket', 'status', 'abweichung', 'marke', 'entwurf', 'eingang', 'zugang', 'recht', 'indexierung', 'demo', 'pause_seit', 'pause_bis', 'ende_am'],
  anfragen: ['lid', 'status', 'nr', 'daten', 'versand', 'eingegangen_at', 'loeschen_ab'],
  partner: ['auth_user', 'mail', 'firma', 'name_norm', 'plz', 'daten', 'stripe_customer'],
  bestellungen: ['paket_bestellt', 'status', 'abo_status', 'preise', 'wunsch', 'dateien', 'zahlung', 'abo', 'instanz', 'vorschau', 'zustimmung', 'verlauf', 'notiz', 'bezahlt_am', 'live_am', 'pause_seit', 'ende_am']
};
const nurSpalten = (tabelle, z) => { const o = {}; SPALTEN[tabelle].forEach((s) => { if (z[s] !== undefined) o[s] = z[s]; }); if (tabelle === 'bestellungen' && Array.isArray(o.verlauf) && o.verlauf.length > 200) o.verlauf = o.verlauf.slice(-200); return o; };
const isoAus = (t) => (t == null ? new Date() : t instanceof Date ? t : new Date(typeof t === 'number' ? t : Date.parse(t))).toISOString();
const jahrBerlin = () => Number(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric' }).format(new Date()));
const hostFormat = (h) => typeof h === 'string' && h.length >= 3 && h.length <= 253 && h === h.toLowerCase() && !/^www\./.test(h) && !h.includes(':') && !/[\s/]/.test(h);
const kopfDaten = (d) => { const o = Object.assign({}, d || {}); delete o.aufmass; delete o.vorher; return o; };
const ergebnis = (out, neu) => (out === undefined ? kopie(neu) : out);
const fehler409 = (text, grund) => new ApiFehler(text, 409, { grund: grund });
const T_SLUG = 'Diese Kennung ist schon vergeben.', T_HOST = 'Diese Domain gehört schon zu einer Instanz.', T_HAUPT = 'Diese Instanz hat schon eine Hauptdomain.';
const T_ANFRAGE = 'Diese Anfrage gibt es schon.', T_PARTNER = 'Zu dieser Adresse gibt es schon ein Kundenkonto.', T_ZAHLUNG = 'Diese Zahlung gehört schon zu einer anderen Bestellung.';
function instanzPruefen(p) {
  if (!p || !/^[a-z0-9-]{3,40}$/.test(String(p.slug || ''))) throw new ApiFehler('Die Kennung der Instanz braucht 3 bis 40 Zeichen aus a–z, 0–9 und Bindestrich.', 400);
  if (!PAKET_SCHLUESSEL.includes(p.paket)) throw new ApiFehler('Unbekanntes Paket.', 400);
  if (!String(p.name || '').trim()) throw new ApiFehler('Der Name fehlt.', 400);
}

function instanzAttrappe() {
  const I = attrappe.instanzen, H = attrappe.hosts, A = attrappe.anfragen, PA = attrappe.partner, BE = attrappe.bestellungen, NA = attrappe.nachrichten, B = attrappe.betriebe;
  const iso = () => new Date().toISOString();
  const nachDatum = (x, y) => String(y.created_at).localeCompare(String(x.created_at));
  /* Lesen, ändern, Version hochzählen (wie betriebAendern); pruefe(z, alt) wirft bei Konflikten mit eindeutigen Schlüsseln */
  async function aendern(map, tabelle, schluessel, fn, text, pruefe) {
    const r = map.get(schluessel); if (!r) throw new ApiFehler(text, 404);
    const z = kopie(r), out = await fn(z, kopie(r)); if (out === false) return false;
    const neu = nurSpalten(tabelle, z); if (pruefe) pruefe(neu, r);
    Object.assign(r, kopie(neu)); r.version = (r.version || 0) + 1; r.updated_at = iso();
    return ergebnis(out, r);
  }
  const hauptVon = (instanz, ausser) => Array.from(H.values()).find((h) => h.instanz === instanz && h.haupt && h.host !== ausser);
  const zahlungFrei = (neu, id) => {
    const z = neu.zahlung || {};
    for (const b of BE.values()) {
      if (b.id === id || !b.zahlung) continue;
      if ((z.session && b.zahlung.session === z.session) || (z.pi && b.zahlung.pi === z.pi)) throw fehler409(T_ZAHLUNG, 'zahlung_doppelt');
    }
  };
  return {
    /* ---------- Instanzen ---------- */
    instanzFuerHost: async (host) => {
      const h = H.get(String(host || '').toLowerCase()); if (!h) return null;
      const i = I.get(h.instanz); if (!i) return null;
      const b = B.get(i.betrieb) || { daten: {} }, d = b.daten || {}, haupt = hauptVon(i.id), inst = kopie(i);
      delete inst.entwurf; delete inst.zugang;
      const n = (v) => (v === undefined ? null : kopie(v));
      return { host: h.host, haupt: h.haupt, hostStatus: h.status, haupthost: haupt ? haupt.host : null, instanz: inst,
        betrieb: { id: b.id || null, name: n(b.name), plz: n(b.plz), einladung: n(d.einladung), ap: n(d.ap), tel: n(d.tel), mail: n(d.mail), du: n(d.du), sperre: n((d.verwaltung || {}).sperre) } };
    },
    instanzHolen: async (id) => kopie(I.get(id) || null),
    instanzVonBetrieb: async (betrieb) => { for (const i of I.values()) if (i.betrieb === betrieb) return kopie(i); return null; },
    /* p: { slug, name, plz, paket, partner, bestellung, eingang, zugang, recht, entwurf, demo, betriebDaten } → id; legt die Betriebszeile
       mit Platzhalteradresse auf .invalid mit an (wie instanz_anlegen in schema.sql) */
    instanzAnlegen: async (p) => {
      instanzPruefen(p);
      for (const i of I.values()) if (i.slug === p.slug) throw fehler409(T_SLUG, 'slug_vergeben');
      const id = uuid(), bid = uuid(), jetzt = iso();
      B.set(bid, { id: bid, auth_user: null, mail: 'i-' + id.replace(/-/g, '') + '@instanz.invalid', name: String(p.name), plz: p.plz == null ? null : String(p.plz), tel_norm: null, name_norm: null, version: 0,
        daten: Object.assign({}, kopie(p.betriebDaten || {}), { konto: 'instanz', instanz: { id: id } }), stripe_customer: null, stripe_subscription: null, created_at: jetzt, updated_at: jetzt });
      I.set(id, { id: id, slug: p.slug, betrieb: bid, partner: p.partner || null, bestellung: p.bestellung || null, paket: p.paket, status: 'einrichtung', abweichung: {}, marke: {},
        entwurf: p.entwurf === undefined ? null : kopie(p.entwurf), eingang: kopie(p.eingang || { mails: [] }), zugang: kopie(p.zugang || []), recht: kopie(p.recht || {}), indexierung: false, demo: !!p.demo,
        nr_jahr: null, nr_zaehler: 0, version: 1, pause_seit: null, pause_bis: null, ende_am: null, created_at: jetzt, updated_at: jetzt });
      return id;
    },
    instanzAendern: (id, fn) => aendern(I, 'instanzen', id, fn, 'Diese Instanz gibt es nicht.', (neu, alt) => {
      if (neu.slug !== undefined && neu.slug !== alt.slug) { if (!/^[a-z0-9-]{3,40}$/.test(neu.slug)) throw new ApiFehler('Ungültige Kennung.', 400); for (const i of I.values()) if (i.id !== alt.id && i.slug === neu.slug) throw fehler409(T_SLUG, 'slug_vergeben'); }
      if (neu.paket !== undefined && !PAKET_SCHLUESSEL.includes(neu.paket)) throw new ApiFehler('Unbekanntes Paket.', 400);
      if (neu.status !== undefined && !['einrichtung', 'aktiv', 'pausiert', 'beendet'].includes(neu.status)) throw new ApiFehler('Unbekannter Status.', 400);
    }),
    instanzenAlle: async (o) => { const st = o && o.status; return Array.from(I.values()).filter((i) => !st || (Array.isArray(st) ? st.includes(i.status) : i.status === st)).sort(nachDatum).map(kopie); },
    instanzNr: async (id) => {
      const r = I.get(id); if (!r) throw new ApiFehler('Diese Instanz gibt es nicht.', 404);
      const j = jahrBerlin(); r.nr_zaehler = r.nr_jahr === j ? r.nr_zaehler + 1 : 1; r.nr_jahr = j; r.updated_at = iso();
      return 'P-' + j + '-' + String(r.nr_zaehler).padStart(3, '0');
    },
    /* Instanz samt Hosts, Anfragen, Zwischenständen und Betriebszeile (in der Datenbank per on delete cascade) */
    instanzLoeschen: async (id) => {
      const r = I.get(id); if (!r) return false;
      for (const [h, x] of H) if (x.instanz === id) H.delete(h);
      for (const [c, x] of A) if (x.instanz === id || x.betrieb === r.betrieb) A.delete(c);
      for (const [c, e] of attrappe.entwuerfe) if (e.betrieb === r.betrieb) attrappe.entwuerfe.delete(c);
      I.delete(id); B.delete(r.betrieb);
      return true;
    },
    /* ---------- Hosts ---------- */
    hostsVon: async (instanz) => Array.from(H.values()).filter((h) => h.instanz === instanz).sort((x, y) => (y.haupt ? 1 : 0) - (x.haupt ? 1 : 0) || x.host.localeCompare(y.host)).map(kopie),
    hostAnlegen: async (row) => {
      if (!row || !hostFormat(row.host)) throw new ApiFehler('Ungültige Domain.', 400, { grund: 'host_ungueltig' });
      if (!I.has(row.instanz)) throw new ApiFehler('Diese Instanz gibt es nicht.', 404);
      if (H.has(row.host)) throw fehler409(T_HOST, 'host_vergeben');
      if (row.haupt && hauptVon(row.instanz)) throw fehler409(T_HAUPT, 'haupt_doppelt');
      const r = Object.assign({ haupt: false, weg: 'zone', status: 'einrichtung', registrar: {}, pruefung: {}, created_at: iso() }, kopie(row));
      H.set(r.host, r); return kopie(r);
    },
    hostAendern: async (host, patch) => {
      const r = H.get(host); if (!r) return null;
      const p = Object.assign({}, kopie(patch || {})); delete p.host; delete p.created_at;
      if (p.haupt && !r.haupt && hauptVon(p.instanz || r.instanz, host)) throw fehler409(T_HAUPT, 'haupt_doppelt');
      Object.assign(r, p); return kopie(r);
    },
    hostLoeschen: async (host) => H.delete(host),
    /* ---------- Anfragen (Link-Objekt in daten) ---------- */
    anfrageHolen: async (code) => kopie(A.get(code) || null),
    anfrageNachLid: async (betrieb, lid) => { for (const a of A.values()) if (a.betrieb === betrieb && a.lid === lid) return kopie(a); return null; },
    anfrageAnlegen: async (row) => {
      if (!row || !/^[a-z0-9]{10}$/.test(String(row.code || ''))) throw new ApiFehler('Ungültiger Code.', 400);
      if (!['website', 'einladung', 'test', 'demo'].includes(row.art)) throw new ApiFehler('Unbekannte Art der Anfrage.', 400);
      if (A.has(row.code)) throw fehler409(T_ANFRAGE, 'anfrage_vorhanden');
      for (const a of A.values()) if (a.betrieb === row.betrieb && a.lid === row.lid) throw fehler409(T_ANFRAGE, 'anfrage_vorhanden');
      const jetzt = iso(), r = Object.assign({ status: 'erstellt', nr: null, daten: {}, versand: {}, version: 0, eingegangen_at: null, loeschen_ab: null, created_at: jetzt, updated_at: jetzt }, kopie(row));
      A.set(r.code, r); return kopie(r);
    },
    anfrageAendern: (code, fn) => aendern(A, 'anfragen', code, fn, 'Diese Anfrage gibt es nicht.'),
    anfragenVonBetrieb: async (betrieb, o) => {
      o = o || {}; const seit = o.seit ? isoAus(o.seit) : '';
      return Array.from(A.values()).filter((a) => a.betrieb === betrieb && (!seit || a.updated_at >= seit)).sort((x, y) => String(y.updated_at).localeCompare(String(x.updated_at)))
        .map((a) => (o.kopf ? Object.assign(kopie(a), { daten: kopfDaten(kopie(a.daten)) }) : kopie(a)));
    },
    anfragenStand: async (betrieb) => { const l = Array.from(A.values()).filter((a) => a.betrieb === betrieb); return { stand: l.map((a) => a.updated_at).sort().pop() || null, anzahl: l.length }; },
    anfrageNachMailId: async (id) => { if (!id) return null; for (const a of A.values()) if (a.versand && a.versand.id === id) return kopie(a); return null; },
    /* Versand offen und fällig (naechster erreicht oder nicht gesetzt), älteste zuerst, höchstens 50 */
    anfragenFaellig: async (jetzt) => { const t = isoAus(jetzt); return Array.from(A.values()).filter((a) => a.eingegangen_at && a.versand && a.versand.status === 'offen' && (!a.versand.naechster || String(a.versand.naechster) <= t)).sort((x, y) => String(x.eingegangen_at).localeCompare(String(y.eingegangen_at))).slice(0, 50).map(kopie); },
    anfragenZuLoeschen: async (jetzt) => { const t = isoAus(jetzt); return Array.from(A.values()).filter((a) => a.loeschen_ab && String(a.loeschen_ab) <= t).slice(0, 200).map((a) => Object.assign(kopie(a), { daten: kopfDaten(kopie(a.daten)) })); },
    anfrageLoeschen: async (code) => A.delete(code),
    /* ---------- Zwischenstand neu anlegen, nie überschreiben (virtuelle Links); null = Code schon vergeben ---------- */
    entwurfAnlegen: async (code, betrieb, meta) => {
      if (attrappe.entwuerfe.has(code)) return null;
      const jetzt = iso(), r = { code: code, betrieb: betrieb, daten: {}, meta: kopie(meta || {}), stand: 0, version: 1, created_at: jetzt, updated_at: jetzt };
      attrappe.entwuerfe.set(code, r); return kopie(r);
    },
    /* ---------- Partner (Kundenkonto /partner/) ---------- */
    partnerHolen: async (id) => kopie(PA.get(id) || null),
    partnerNachAuth: async (uid) => { if (!uid) return null; for (const p of PA.values()) if (p.auth_user === uid) return kopie(p); return null; },
    partnerNachMail: async (mail) => { const m = String(mail || '').toLowerCase(); for (const p of PA.values()) if (p.mail === m) return kopie(p); return null; },
    partnerAnlegen: async (row) => {
      const m = String((row || {}).mail || '').toLowerCase(); if (!m || !String(row.firma || '').trim()) throw new ApiFehler('Adresse und Firma fehlen.', 400);
      for (const p of PA.values()) if (p.mail === m || (row.auth_user && p.auth_user === row.auth_user) || (row.stripe_customer && p.stripe_customer === row.stripe_customer)) throw fehler409(T_PARTNER, 'partner_vorhanden');
      const jetzt = iso(), r = Object.assign({ id: uuid(), auth_user: null, name_norm: null, plz: null, daten: {}, stripe_customer: null, version: 0, created_at: jetzt, updated_at: jetzt }, kopie(row), { mail: m });
      PA.set(r.id, r); return kopie(r);
    },
    partnerAendern: (id, fn) => aendern(PA, 'partner', id, fn, 'Dieses Kundenkonto gibt es nicht.', (neu, alt) => {
      if (neu.mail !== undefined) neu.mail = String(neu.mail).toLowerCase();
      for (const p of PA.values()) if (p.id !== alt.id && ((neu.mail && p.mail === neu.mail) || (neu.auth_user && p.auth_user === neu.auth_user) || (neu.stripe_customer && p.stripe_customer === neu.stripe_customer))) throw fehler409(T_PARTNER, 'partner_vorhanden');
    }),
    partnerFelder: async (id, patch) => { const r = PA.get(id); if (!r) return null; Object.assign(r, nurSpalten('partner', kopie(patch || {})), { updated_at: iso() }); return kopie(r); },
    partnerAlle: async () => Array.from(PA.values()).sort(nachDatum).map(kopie),
    /* wie die Datenbank: Bestellungen sperren (restrict), Nachrichten gehen mit (cascade), Instanzen verlieren den Verweis (set null) */
    partnerLoeschen: async (id) => {
      if (!PA.has(id)) return false;
      for (const b of BE.values()) if (b.partner === id) throw fehler409('Zu diesem Partner gibt es noch Bestellungen.', 'partner_bestellungen');
      for (const [nid, x] of NA) if (x.partner === id) NA.delete(nid);
      for (const i of I.values()) if (i.partner === id) i.partner = null;
      return PA.delete(id);
    },
    /* ---------- Bestellungen ---------- */
    bestellungHolen: async (id) => kopie(BE.get(id) || null),
    bestellungenVonPartner: async (pid) => Array.from(BE.values()).filter((b) => b.partner === pid).sort(nachDatum).map(kopie),
    bestellungAnlegen: async (row) => {
      if (!row || !PA.has(row.partner)) throw new ApiFehler('Dieses Kundenkonto gibt es nicht.', 404);
      if (!PAKET_SCHLUESSEL.includes(row.paket_bestellt)) throw new ApiFehler('Unbekanntes Paket.', 400);
      zahlungFrei(row, null);
      const jetzt = iso(), nr = 'B-' + jahrBerlin() + '-' + String(++attrappe.bestellNr).padStart(4, '0');
      const r = Object.assign({ id: uuid(), nr: nr, status: 'offen', abo_status: '', preise: {}, wunsch: {}, dateien: [], zahlung: {}, abo: {}, instanz: null, vorschau: {}, zustimmung: {}, verlauf: [], notiz: '', version: 0,
        bezahlt_am: null, live_am: null, pause_seit: null, ende_am: null, created_at: jetzt, updated_at: jetzt }, kopie(row));
      BE.set(r.id, r); return kopie(r);
    },
    bestellungAendern: (id, fn) => aendern(BE, 'bestellungen', id, fn, 'Diese Bestellung gibt es nicht.', (neu, alt) => { if (neu.zahlung) zahlungFrei(neu, alt.id); }),
    bestellungNachSession: async (s) => { if (!s) return null; for (const b of BE.values()) if (b.zahlung && b.zahlung.session === s) return kopie(b); return null; },
    bestellungNachPi: async (pi) => { if (!pi) return null; for (const b of BE.values()) if (b.zahlung && b.zahlung.pi === pi) return kopie(b); return null; },
    bestellungNachAbo: async (sub) => { if (!sub) return null; for (const b of BE.values()) if (b.abo && b.abo.id === sub) return kopie(b); return null; },
    bestellungenListe: async (o) => { o = o || {}; const st = o.status, seit = o.seit ? isoAus(o.seit) : ''; return Array.from(BE.values()).filter((b) => (!st || (Array.isArray(st) ? st.includes(b.status) : b.status === st)) && (!seit || b.updated_at >= seit)).sort(nachDatum).map(kopie); },
    bestellungLoeschen: async (id) => { for (const n of NA.values()) if (n.bestellung === id) n.bestellung = null; return BE.delete(id); },
    /* ---------- Nachrichten zwischen Partner und Inhaber ---------- */
    nachrichtAnlegen: async (row) => {
      if (!row || !PA.has(row.partner)) throw new ApiFehler('Dieses Kundenkonto gibt es nicht.', 404);
      const r = Object.assign({ id: uuid(), bestellung: null, art: 'text', text: '', dateien: [], rueckruf: null, gelesen_at: null, created_at: iso() }, kopie(row));
      NA.set(r.id, r); return kopie(r);
    },
    nachrichtenVon: async (pid, o) => { o = o || {}; return Array.from(NA.values()).filter((n) => n.partner === pid && (!o.bestellung || n.bestellung === o.bestellung)).sort(nachDatum).slice(0, o.anzahl || 200).map(kopie); },
    /* empfaenger 'partner': Nachrichten von Inhaber und System gelesen; 'inhaber': Nachrichten des Partners gelesen */
    nachrichtenGelesen: async (pid, empfaenger) => { let n = 0; const t = iso(); for (const x of NA.values()) if (x.partner === pid && !x.gelesen_at && (empfaenger === 'partner' ? x.von !== 'partner' : x.von === 'partner')) { x.gelesen_at = t; n++; } return n; },
    rueckrufeOffen: async () => Array.from(NA.values()).filter((n) => n.art === 'rueckruf' && !(n.rueckruf && n.rueckruf.erledigt)).sort((x, y) => String(x.created_at).localeCompare(String(y.created_at))).map(kopie),
    nachrichtAendern: async (id, patch) => { const r = NA.get(id); if (!r) return null; const p = kopie(patch || {}); delete p.id; delete p.partner; delete p.created_at; Object.assign(r, p); return kopie(r); },
    nachrichtenAltLoeschen: async (pid, bis) => { const t = isoAus(bis); let n = 0; for (const [id, x] of NA) if ((!pid || x.partner === pid) && x.created_at < t) { NA.delete(id); n++; } return n; },
    nachrichtenLoeschen: async (pid) => { let n = 0; for (const [id, x] of NA) if (x.partner === pid) { NA.delete(id); n++; } return n; },
    /* ---------- Aufräumen der Anmeldungen (zentrale.js): Partner und Dashboard-Zugänge bleiben ---------- */
    geschuetzteNutzer: async () => { const s = new Set(); for (const p of PA.values()) if (p.auth_user) s.add(p.auth_user); for (const i of I.values()) (i.zugang || []).forEach((z) => { if (z && z.uid) s.add(z.uid); }); return s; },
    /* ---------- dauerhafte Zähler (bremse.js budget), in der Tabelle statistik ---------- */
    zaehlerLesen: async (tag, schluessel) => { const o = {}; (schluessel || []).forEach((s) => { o[s] = attrappe.statistik.get(tag + '|' + s) || 0; }); return o; },
    zaehlerErhoehen: async (tag, schluessel, n) => { const k2 = tag + '|' + schluessel, neu = (attrappe.statistik.get(k2) || 0) + (n || 1); attrappe.statistik.set(k2, neu); return neu; },
    /* Zähler eines Präfixes vor dem Tag bis (YYYY-MM-DD) löschen, z. B. budget:otpfehl: (Prüfwert der E-Mail-Adresse) */
    zaehlerAltLoeschen: async (bis, praefix) => { let n = 0; for (const k2 of Array.from(attrappe.statistik.keys())) { const [tag, s] = [k2.slice(0, k2.indexOf('|')), k2.slice(k2.indexOf('|') + 1)]; if (tag < bis && s.indexOf(praefix) === 0) { attrappe.statistik.delete(k2); n++; } } return n; }
  };
}

function instanzSupabase(sb, alle, eins, q) {
  /* in.(…) mit Werten in Anführungszeichen (Schlüssel enthalten Doppelpunkte) */
  const liste = (werte) => encodeURIComponent('(' + werte.map((w) => '"' + String(w).replace(/["\\]/g, '\\$&') + '"').join(',') + ')');
  const lesen = async (pfad) => { const r = await sb(pfad, { optional: true }); return r && r.fehlt ? undefined : r; };
  const einsLesen = async (pfad) => { const r = await lesen(pfad); return r === undefined ? undefined : eins(r); };
  const schreiben = async (pfad, init) => { const r = await sb(pfad, Object.assign({ optional: true }, init)); if (r && r.fehlt) throw new ApiFehler(FEHLT, 503); return r; };
  /* Lesen, ändern, mit Versionsnummer zurückschreiben; konflikt(text): Fehler bei eindeutigen Schlüsseln */
  async function aendern(tabelle, schluesselSpalte, wert, fn, text, konflikt) {
    for (let i = 0; i < 4; i++) {
      const r = await einsLesen(tabelle + '?' + schluesselSpalte + '=eq.' + q(wert) + '&select=*');
      if (r === undefined) throw new ApiFehler(FEHLT, 503);
      if (!r) throw new ApiFehler(text, 404);
      const z = JSON.parse(JSON.stringify(r)), out = await fn(z, r); if (out === false) return false;
      const body = Object.assign(nurSpalten(tabelle, z), { version: (r.version || 0) + 1, updated_at: new Date().toISOString() });
      const res = await schreiben(tabelle + '?' + schluesselSpalte + '=eq.' + q(wert) + '&version=eq.' + q(r.version), { method: 'PATCH', body: body, konfliktText: true });
      if (res && res.konflikt) throw konflikt ? konflikt(res.text) : fehler409('Gleichzeitige Änderung, bitte noch einmal versuchen.', 'konflikt');
      if (Array.isArray(res) && res.length) return ergebnis(out, res[0]);
    }
    throw new ApiFehler('Gleichzeitige Änderung, bitte noch einmal versuchen.', 409);
  }
  const instanzKonflikt = () => fehler409(T_SLUG, 'slug_vergeben');
  const hostKonflikt = (t) => (/haupt/.test(String(t || '')) ? fehler409(T_HAUPT, 'haupt_doppelt') : fehler409(T_HOST, 'host_vergeben'));
  const zahlungKonflikt = (t) => (/session|_pi_|pi_uidx/.test(String(t || '')) ? fehler409(T_ZAHLUNG, 'zahlung_doppelt') : fehler409('Diese Bestellung gibt es schon.', 'bestellung_vorhanden'));
  const partnerKonflikt = () => fehler409(T_PARTNER, 'partner_vorhanden');
  const statusFilter = (st) => (!st ? '' : Array.isArray(st) ? '&status=in.' + liste(st) : '&status=eq.' + q(st));
  const ANFRAGE_KOPF = 'code,instanz,betrieb,lid,art,status,nr,versand,version,eingegangen_at,loeschen_ab,created_at,updated_at';
  return {
    /* ---------- Instanzen ---------- */
    instanzFuerHost: async (host) => { const r = await sb('rpc/instanz_fuer_host', { method: 'POST', body: { p_host: String(host || '').toLowerCase() }, optional: true }); return r && r.fehlt ? undefined : r || null; },
    instanzHolen: (id) => einsLesen('instanzen?id=eq.' + q(id) + '&select=*'),
    instanzVonBetrieb: (betrieb) => einsLesen('instanzen?betrieb=eq.' + q(betrieb) + '&select=*'),
    instanzAnlegen: async (p) => {
      instanzPruefen(p);
      const r = await schreiben('rpc/instanz_anlegen', { method: 'POST', body: { p: p }, konfliktText: true });
      if (r && r.konflikt) throw instanzKonflikt(r.text);
      return typeof r === 'string' ? r : null;
    },
    instanzAendern: (id, fn) => aendern('instanzen', 'id', id, fn, 'Diese Instanz gibt es nicht.', instanzKonflikt),
    instanzenAlle: async (o) => { const r = await alle('instanzen?select=*' + statusFilter(o && o.status) + '&order=created_at.desc,id.asc', true); return r === null ? undefined : r; },
    instanzNr: async (id) => { const r = await schreiben('rpc/instanz_nr', { method: 'POST', body: { p_instanz: id } }); return typeof r === 'string' ? r : null; },
    instanzLoeschen: async (id) => {
      const r = await einsLesen('instanzen?id=eq.' + q(id) + '&select=id,betrieb'); if (!r) return false;
      await schreiben('instanzen?id=eq.' + q(id), { method: 'DELETE', prefer: 'return=minimal' });
      await schreiben('betriebe?id=eq.' + q(r.betrieb), { method: 'DELETE', prefer: 'return=minimal' });
      return true;
    },
    /* ---------- Hosts ---------- */
    hostsVon: (instanz) => lesen('instanz_hosts?instanz=eq.' + q(instanz) + '&select=*&order=haupt.desc,host.asc'),
    hostAnlegen: async (row) => {
      if (!row || !hostFormat(row.host)) throw new ApiFehler('Ungültige Domain.', 400, { grund: 'host_ungueltig' });
      const r = await schreiben('instanz_hosts', { method: 'POST', body: row, konfliktText: true });
      if (r && r.konflikt) throw hostKonflikt(r.text);
      return eins(r);
    },
    hostAendern: async (host, patch) => {
      const p = Object.assign({}, patch || {}); delete p.host; delete p.created_at;
      const r = await schreiben('instanz_hosts?host=eq.' + q(host), { method: 'PATCH', body: p, konfliktText: true });
      if (r && r.konflikt) throw hostKonflikt(r.text);
      return eins(r);
    },
    hostLoeschen: async (host) => { await schreiben('instanz_hosts?host=eq.' + q(host), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
    /* ---------- Anfragen ---------- */
    anfrageHolen: (code) => einsLesen('anfragen?code=eq.' + q(code) + '&select=*'),
    anfrageNachLid: (betrieb, lid) => einsLesen('anfragen?betrieb=eq.' + q(betrieb) + '&lid=eq.' + q(lid) + '&select=*'),
    anfrageAnlegen: async (row) => {
      if (!row || !/^[a-z0-9]{10}$/.test(String(row.code || ''))) throw new ApiFehler('Ungültiger Code.', 400);
      const r = await schreiben('anfragen', { method: 'POST', body: row, konfliktText: true });
      if (r && r.konflikt) throw fehler409(T_ANFRAGE, 'anfrage_vorhanden');
      return eins(r);
    },
    anfrageAendern: (code, fn) => aendern('anfragen', 'code', code, fn, 'Diese Anfrage gibt es nicht.'),
    /* kopf: ohne daten.aufmass und daten.vorher (Funktion anfragen_kopf); fehlt sie, wird hier gekürzt */
    anfragenVonBetrieb: async (betrieb, o) => {
      o = o || {}; const seit = o.seit ? isoAus(o.seit) : null;
      if (o.kopf) {
        const r = await sb('rpc/anfragen_kopf', { method: 'POST', body: { p_betrieb: betrieb, p_seit: seit }, optional: true });
        if (!(r && r.fehlt)) return Array.isArray(r) ? r : [];
      }
      const r = await alle('anfragen?betrieb=eq.' + q(betrieb) + (seit ? '&updated_at=gte.' + q(seit) : '') + '&select=*&order=updated_at.desc,code.asc', true);
      if (r === null) return undefined;
      return o.kopf ? r.map((a) => Object.assign(a, { daten: kopfDaten(a.daten) })) : r;
    },
    anfragenStand: async (betrieb) => {
      const r = await sb('anfragen?betrieb=eq.' + q(betrieb) + '&select=updated_at&order=updated_at.desc&limit=1', { optional: true, prefer: 'count=exact', zaehlen: true });
      if (r && r.fehlt) return undefined;
      return { stand: r.rows[0] ? r.rows[0].updated_at : null, anzahl: r.anzahl || 0 };
    },
    anfrageNachMailId: (id) => (id ? einsLesen('anfragen?versand->>id=eq.' + q(id) + '&select=*') : Promise.resolve(null)),
    anfragenFaellig: (jetzt) => { const t = isoAus(jetzt); return lesen('anfragen?eingegangen_at=not.is.null&versand->>status=eq.offen&or=' + encodeURIComponent('(versand->>naechster.is.null,versand->>naechster.lte."' + t + '")') + '&select=*&order=eingegangen_at.asc&limit=50'); },
    anfragenZuLoeschen: (jetzt) => lesen('anfragen?loeschen_ab=lte.' + q(isoAus(jetzt)) + '&select=' + ANFRAGE_KOPF + '&order=loeschen_ab.asc&limit=200'),
    anfrageLoeschen: async (code) => { await schreiben('anfragen?code=eq.' + q(code), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
    /* ---------- Zwischenstand neu anlegen, nie überschreiben; null = Code schon vergeben, undefined = Tabelle fehlt ---------- */
    entwurfAnlegen: async (code, betrieb, meta) => {
      const r = await sb('entwuerfe', { method: 'POST', body: { code: code, betrieb: betrieb, daten: {}, meta: meta || {}, stand: 0, version: 1 }, optional: true });
      if (r && r.fehlt) return undefined; if (r && r.konflikt) return null;
      return eins(r);
    },
    /* ---------- Partner ---------- */
    partnerHolen: (id) => einsLesen('partner?id=eq.' + q(id) + '&select=*'),
    partnerNachAuth: (uid) => (uid ? einsLesen('partner?auth_user=eq.' + q(uid) + '&select=*') : Promise.resolve(null)),
    partnerNachMail: (mail) => einsLesen('partner?mail=eq.' + q(String(mail || '').toLowerCase()) + '&select=*'),
    partnerAnlegen: async (row) => {
      const r = await schreiben('partner', { method: 'POST', body: Object.assign({}, row, { mail: String((row || {}).mail || '').toLowerCase() }), konfliktText: true });
      if (r && r.konflikt) throw partnerKonflikt(r.text);
      return eins(r);
    },
    partnerAendern: (id, fn) => aendern('partner', 'id', id, fn, 'Dieses Kundenkonto gibt es nicht.', partnerKonflikt),
    partnerFelder: async (id, patch) => { const r = await schreiben('partner?id=eq.' + q(id), { method: 'PATCH', body: Object.assign(nurSpalten('partner', patch || {}), { updated_at: new Date().toISOString() }), konfliktText: true }); if (r && r.konflikt) throw partnerKonflikt(r.text); return eins(r); },
    partnerAlle: async () => { const r = await alle('partner?select=*&order=created_at.desc,id.asc', true); return r === null ? undefined : r; },
    /* bestellungen.partner ist on delete restrict (erst die Bestellungen löschen), partner_nachrichten cascade, instanzen.partner set null */
    partnerLoeschen: async (id) => { const r = await schreiben('partner?id=eq.' + q(id), { method: 'DELETE', prefer: 'return=minimal', konfliktText: true }); if (r && r.konflikt) throw fehler409('Zu diesem Partner gibt es noch Bestellungen.', 'partner_bestellungen'); return true; },
    /* ---------- Bestellungen ---------- */
    bestellungHolen: (id) => einsLesen('bestellungen?id=eq.' + q(id) + '&select=*'),
    bestellungenVonPartner: (pid) => lesen('bestellungen?partner=eq.' + q(pid) + '&select=*&order=created_at.desc'),
    bestellungAnlegen: async (row) => {
      const body = Object.assign({}, row); delete body.nr; // die Nummer vergibt die Datenbank (Folge bestellung_nr)
      const r = await schreiben('bestellungen', { method: 'POST', body: body, konfliktText: true });
      if (r && r.konflikt) throw zahlungKonflikt(r.text);
      return eins(r);
    },
    bestellungAendern: (id, fn) => aendern('bestellungen', 'id', id, fn, 'Diese Bestellung gibt es nicht.', zahlungKonflikt),
    bestellungNachSession: (s) => (s ? einsLesen('bestellungen?zahlung->>session=eq.' + q(s) + '&select=*') : Promise.resolve(null)),
    bestellungNachPi: (pi) => (pi ? einsLesen('bestellungen?zahlung->>pi=eq.' + q(pi) + '&select=*') : Promise.resolve(null)),
    bestellungNachAbo: (sub) => (sub ? einsLesen('bestellungen?abo->>id=eq.' + q(sub) + '&select=*') : Promise.resolve(null)),
    bestellungenListe: async (o) => { o = o || {}; const r = await alle('bestellungen?select=*' + statusFilter(o.status) + (o.seit ? '&updated_at=gte.' + q(isoAus(o.seit)) : '') + '&order=created_at.desc,id.asc', true); return r === null ? undefined : r; },
    bestellungLoeschen: async (id) => { await schreiben('bestellungen?id=eq.' + q(id), { method: 'DELETE', prefer: 'return=minimal' }); return true; },
    /* ---------- Nachrichten ---------- */
    nachrichtAnlegen: async (row) => eins(await schreiben('partner_nachrichten', { method: 'POST', body: row })),
    nachrichtenVon: (pid, o) => { o = o || {}; return lesen('partner_nachrichten?partner=eq.' + q(pid) + (o.bestellung ? '&bestellung=eq.' + q(o.bestellung) : '') + '&select=*&order=created_at.desc&limit=' + Math.min(500, o.anzahl || 200)); },
    nachrichtenGelesen: async (pid, empfaenger) => { const r = await schreiben('partner_nachrichten?partner=eq.' + q(pid) + '&gelesen_at=is.null&von=' + (empfaenger === 'partner' ? 'neq.partner' : 'eq.partner') + '&select=id', { method: 'PATCH', body: { gelesen_at: new Date().toISOString() } }); return Array.isArray(r) ? r.length : 0; },
    rueckrufeOffen: () => lesen('partner_nachrichten?art=eq.rueckruf&rueckruf->>erledigt=is.null&select=*&order=created_at.asc&limit=500'),
    nachrichtAendern: async (id, patch) => { const p = Object.assign({}, patch || {}); delete p.id; delete p.partner; delete p.created_at; return eins(await schreiben('partner_nachrichten?id=eq.' + q(id), { method: 'PATCH', body: p })); },
    nachrichtenAltLoeschen: async (pid, bis) => { const r = await schreiben('partner_nachrichten?created_at=lt.' + q(isoAus(bis)) + (pid ? '&partner=eq.' + q(pid) : '') + '&select=id', { method: 'DELETE' }); return Array.isArray(r) ? r.length : 0; },
    nachrichtenLoeschen: async (pid) => { if (!pid) return 0; const r = await schreiben('partner_nachrichten?partner=eq.' + q(pid) + '&select=id', { method: 'DELETE' }); return Array.isArray(r) ? r.length : 0; },
    /* ---------- Aufräumen der Anmeldungen: Partner und Dashboard-Zugänge bleiben ---------- */
    geschuetzteNutzer: async () => {
      const s = new Set(), p = await alle('partner?auth_user=not.is.null&select=auth_user', true), i = await alle('instanzen?select=zugang', true);
      (p || []).forEach((x) => s.add(x.auth_user)); (i || []).forEach((x) => (x.zugang || []).forEach((z) => { if (z && z.uid) s.add(z.uid); }));
      return s;
    },
    /* ---------- dauerhafte Zähler (bremse.js budget) ---------- */
    zaehlerLesen: async (tag, schluessel) => {
      if (!schluessel || !schluessel.length) return {};
      const r = await lesen('statistik?tag=eq.' + q(tag) + '&schluessel=in.' + liste(schluessel) + '&select=schluessel,anzahl'); if (r === undefined) return undefined;
      const o = {}; schluessel.forEach((s) => { o[s] = 0; }); (r || []).forEach((x) => { o[x.schluessel] = Number(x.anzahl) || 0; }); return o;
    },
    /* atomar über eeziframes_budget; fehlt die Funktion: hochzählen (eeziframes_zaehlen) und lesen */
    zaehlerErhoehen: async (tag, schluessel, n) => {
      const r = await sb('rpc/eeziframes_budget', { method: 'POST', body: { p_tag: tag, p_schluessel: schluessel, p_n: n || 1 }, optional: true });
      if (!(r && r.fehlt)) return Number(r) || 0;
      const z = await sb('rpc/eeziframes_zaehlen', { method: 'POST', body: { p_tag: tag, p_schluessel: new Array(n || 1).fill(schluessel) }, prefer: 'return=minimal', optional: true });
      if (z && z.fehlt) return undefined;
      const l = await lesen('statistik?tag=eq.' + q(tag) + '&schluessel=eq.' + q(schluessel) + '&select=anzahl');
      return l && l[0] ? Number(l[0].anzahl) || 0 : 0;
    },
    /* Zähler eines Präfixes vor dem Tag bis (YYYY-MM-DD) löschen, z. B. budget:otpfehl: (Prüfwert der E-Mail-Adresse) */
    zaehlerAltLoeschen: async (bis, praefix) => { const r = await schreiben('statistik?tag=lt.' + q(bis) + '&schluessel=like.' + q(praefix + '*') + '&select=schluessel', { method: 'DELETE' }); return Array.isArray(r) ? r.length : 0; }
  };
}

/* Nur für den lokalen Testserver (scripts/dev-server.mjs, GET /__attrappe): Inhalt der Attrappe zu den Instanzen, als Kopie */
export function attrappeStand() {
  const instBetriebe = new Set(Array.from(attrappe.instanzen.values()).map((i) => i.betrieb));
  const werte = (m) => Array.from(m.values()).map(kopie);
  return {
    instanzen: werte(attrappe.instanzen), hosts: werte(attrappe.hosts), anfragen: werte(attrappe.anfragen), partner: werte(attrappe.partner),
    bestellungen: werte(attrappe.bestellungen), nachrichten: werte(attrappe.nachrichten),
    betriebe: Array.from(attrappe.betriebe.values()).filter((b) => instBetriebe.has(b.id)).map(kopie),
    entwuerfe: Array.from(attrappe.entwuerfe.values()).filter((e) => instBetriebe.has(e.betrieb)).map(kopie)
  };
}

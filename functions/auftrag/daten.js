/* eeziframes · Daten der Aufträge: Kunden (Fensterbauer mit Anmeldung per Code), Anmeldecodes, Aufträge, Nachrichten
   Supabase über PostgREST (geheimer Schlüssel, nur vom Server) oder eine Attrappe im Arbeitsspeicher (DATEN_ATTRAPPE=1, Prüfung).
   Tabellen und Funktion naechste_auftrag_nr() in supabase/schema.sql (Abschnitt „Aufträge“); erneutes Ausführen schadet nicht.
   Ein Auftrag ist ein Dokument (angaben, dateien, zahlung, abo, vorschau, verlauf); Änderungen laufen über auftragAendern(id, fn) mit
   Versionszähler, damit Kunde, Inhaber und Zahlungseingang sich nicht gegenseitig überschreiben.
   API: daten(k) → { art, kundeNachMail, kundeHolen, kundeAnlegen, kundeAendern, kundenAlle, kundeLoeschen, codeSetzen, codeHolen, codeLoeschen,
        codeFehler, codesAufraeumen,
        auftragAnlegen, auftragHolen, auftraegeVonKunde, auftraegeAlle, auftragAendern, auftragNachSession, auftragLoeschen, adresseBelegt,
        auftragZuInstanz (der laufende Auftrag eines Konfigurators: instanz.id, Stand live oder pausiert),
        nachrichtAnlegen, nachrichtenVon, nachrichtenGelesen, ungelesen } | null */
import { ApiFehler, sbNeu } from '../api/umgebung.js';

const kopie = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const jetzt = () => new Date().toISOString();
const nrText = (n) => 'A-' + new Date().getUTCFullYear() + '-' + String(n).padStart(4, '0');
/* Stände, in denen die Adresse (Essential: Name unter eeziframes.com) einem Auftrag gehört */
const HAELT = ['angefragt', 'bezahlt', 'in_arbeit', 'vorschau', 'live', 'pausiert'];
/* Stände, in denen ein Auftrag seinen Konfigurator betreibt (KI-Kontingent, functions/api/ki.js) */
const LAEUFT = ['live', 'pausiert'];

export function daten(k) {
  if (k.supabase) return supabase(k);
  if (k.datenAttrappe) return attrappe();
  return null;
}

/* ---------- Attrappe ---------- */
const A = { kunden: new Map(), codes: new Map(), auftraege: new Map(), nachrichten: [], nr: 0 };
export const attrappeLeeren = () => { A.kunden.clear(); A.codes.clear(); A.auftraege.clear(); A.nachrichten.length = 0; A.nr = 0; };
function attrappe() {
  const K = A.kunden, Au = A.auftraege;
  const finde = (map, fn) => { for (const r of map.values()) if (fn(r)) return kopie(r); return null; };
  return {
    art: 'attrappe',
    kundeNachMail: async (mail) => finde(K, (r) => r.mail === mail),
    kundeHolen: async (id) => kopie(K.get(id) || null),
    kundeAnlegen: async (row) => { const r = Object.assign({ id: uuid(), created_at: jetzt(), stripe: '', angemeldet_am: null }, kopie(row)); K.set(r.id, r); return kopie(r); },
    kundeAendern: async (id, felder) => { const r = K.get(id); if (!r) return null; Object.assign(r, kopie(felder)); return kopie(r); },
    kundenAlle: async () => Array.from(K.values()).map(kopie),
    kundeLoeschen: async (id) => { K.delete(id); Array.from(Au.values()).filter((a) => a.kunde === id).forEach((a) => Au.delete(a.id)); return true; },
    codeSetzen: async (mail, row) => { A.codes.set(mail, Object.assign({ mail: mail, fehl: 0, created_at: jetzt() }, kopie(row))); return true; },
    codeHolen: async (mail) => kopie(A.codes.get(mail) || null),
    codeLoeschen: async (mail) => { A.codes.delete(mail); return true; },
    codeFehler: async (mail) => { const r = A.codes.get(mail); if (r) r.fehl = (r.fehl || 0) + 1; return r ? r.fehl : 0; },
    codesAufraeumen: async (bis) => { for (const [m, r] of A.codes) if (r.bis < bis) A.codes.delete(m); return true; },
    auftragAnlegen: async (row) => { const r = Object.assign({ id: uuid(), nr: nrText(++A.nr), stand: 'entwurf', angaben: {}, dateien: [], zahlung: {}, abo: {}, vorschau: {}, verlauf: [], notiz: '', adresse: null, version: 0, created_at: jetzt(), updated_at: jetzt() }, kopie(row)); Au.set(r.id, r); return kopie(r); },
    auftragHolen: async (id) => kopie(Au.get(id) || null),
    auftraegeVonKunde: async (kunde) => Array.from(Au.values()).filter((r) => r.kunde === kunde).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).map(kopie),
    auftraegeAlle: async () => Array.from(Au.values()).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)).map(kopie),
    auftragNachSession: async (session) => finde(Au, (r) => (r.zahlung || {}).session === session),
    /* fn(z) ändert z; false = nichts schreiben (Rückgabe false) */
    auftragAendern: async (id, fn) => {
      const r = Au.get(id); if (!r) throw new ApiFehler('Auftrag nicht gefunden.', 404);
      const z = kopie(r), out = await fn(z); if (out === false) return false;
      z.version = (r.version || 0) + 1; z.updated_at = jetzt(); Au.set(id, z); return kopie(z);
    },
    auftragLoeschen: async (id) => { Au.delete(id); A.nachrichten = A.nachrichten.filter((n) => n.auftrag !== id); return true; },
    adresseBelegt: async (name, ausser) => Array.from(Au.values()).some((r) => r.id !== ausser && r.adresse === name && HAELT.indexOf(r.stand) >= 0),
    auftragZuInstanz: async (id) => Array.from(Au.values()).filter((r) => r.instanz && r.instanz.id === id && LAEUFT.indexOf(r.stand) >= 0).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)).map(kopie)[0] || null,
    nachrichtAnlegen: async (row) => { const r = Object.assign({ id: uuid(), gelesen: false, created_at: jetzt() }, kopie(row)); A.nachrichten.push(r); return kopie(r); },
    nachrichtenVon: async (auftrag) => A.nachrichten.filter((n) => n.auftrag === auftrag).map(kopie),
    nachrichtenGelesen: async (auftrag, von) => { A.nachrichten.forEach((n) => { if (n.auftrag === auftrag && n.von === von) n.gelesen = true; }); return true; },
    ungelesen: async (von) => { const m = {}; A.nachrichten.forEach((n) => { if (n.von === von && !n.gelesen) m[n.auftrag] = (m[n.auftrag] || 0) + 1; }); return m; }
  };
}

/* ---------- Supabase ---------- */
function supabase(k) {
  const basis = k.supabase.url + '/rest/v1/';
  const kopf = (extra) => { const h = Object.assign({ apikey: k.supabase.service, 'content-type': 'application/json', accept: 'application/json' }, extra || {}); if (!sbNeu(k.supabase.service)) h.Authorization = 'Bearer ' + k.supabase.service; return h; };
  async function sb(pfad, init) {
    init = init || {};
    let r;
    try { r = await fetch(basis + pfad, { method: init.method || 'GET', headers: kopf(init.headers), body: init.body === undefined ? undefined : JSON.stringify(init.body) }); }
    catch (e) { throw new ApiFehler('Die Datenbank antwortet gerade nicht. Bitte gleich noch einmal.', 503); }
    if (r.status === 204) return null;
    const t = await r.text().catch(() => '');
    if (!r.ok) {
      /* Tabellen fehlen noch: schema.sql (Abschnitt Aufträge) ausführen */
      if (r.status === 404 || /does not exist|schema cache/i.test(t)) throw new ApiFehler('Die Aufträge sind in der Datenbank noch nicht eingerichtet (supabase/schema.sql).', 503);
      if (r.status === 409) throw new ApiFehler('Schon vergeben.', 409, { doppelt: true });
      console.log('Datenbank', r.status, t.slice(0, 160)); throw new ApiFehler('Die Datenbank hat die Anfrage abgelehnt.', 502);
    }
    try { return t ? JSON.parse(t) : null; } catch (e) { return null; }
  }
  const q = encodeURIComponent;
  const eins = (l) => (Array.isArray(l) && l.length ? l[0] : null);
  const schreiben = (pfad, method, body) => sb(pfad, { method: method, body: body, headers: { prefer: 'return=representation' } });
  return {
    art: 'supabase',
    kundeNachMail: async (mail) => eins(await sb('kunden?mail=eq.' + q(mail) + '&select=*')),
    kundeHolen: async (id) => eins(await sb('kunden?id=eq.' + q(id) + '&select=*')),
    kundeAnlegen: async (row) => eins(await schreiben('kunden', 'POST', row)),
    kundeAendern: async (id, felder) => eins(await schreiben('kunden?id=eq.' + q(id), 'PATCH', felder)),
    kundenAlle: async () => (await sb('kunden?select=id,mail,angemeldet_am,created_at&order=created_at.asc&limit=2000')) || [],
    kundeLoeschen: async (id) => { await sb('kunden?id=eq.' + q(id), { method: 'DELETE' }); return true; },
    codeSetzen: async (mail, row) => { await sb('anmeldecodes?on_conflict=mail', { method: 'POST', body: Object.assign({ mail: mail, fehl: 0 }, row), headers: { prefer: 'resolution=merge-duplicates,return=minimal' } }); return true; },
    codeHolen: async (mail) => eins(await sb('anmeldecodes?mail=eq.' + q(mail) + '&select=*')),
    codeLoeschen: async (mail) => { await sb('anmeldecodes?mail=eq.' + q(mail), { method: 'DELETE' }); return true; },
    codesAufraeumen: async (bis) => { await sb('anmeldecodes?bis=lt.' + q(bis), { method: 'DELETE' }); return true; },
    codeFehler: async (mail) => { const r = eins(await sb('anmeldecodes?mail=eq.' + q(mail) + '&select=fehl')); const n = ((r && r.fehl) || 0) + 1; await sb('anmeldecodes?mail=eq.' + q(mail), { method: 'PATCH', body: { fehl: n } }); return n; },
    auftragAnlegen: async (row) => {
      const n = await sb('rpc/naechste_auftrag_nr', { method: 'POST', body: {} });
      return eins(await schreiben('auftraege', 'POST', Object.assign({ nr: nrText(Number(n) || Date.now() % 10000) }, row)));
    },
    auftragHolen: async (id) => eins(await sb('auftraege?id=eq.' + q(id) + '&select=*')),
    auftraegeVonKunde: async (kunde) => (await sb('auftraege?kunde=eq.' + q(kunde) + '&select=*&order=created_at.desc')) || [],
    auftraegeAlle: async () => (await sb('auftraege?select=*&order=updated_at.desc&limit=500')) || [],
    auftragNachSession: async (session) => eins(await sb('auftraege?zahlung->>session=eq.' + q(session) + '&select=*')),
    auftragAendern: async (id, fn) => {
      for (let i = 0; i < 4; i++) {
        const r = eins(await sb('auftraege?id=eq.' + q(id) + '&select=*')); if (!r) throw new ApiFehler('Auftrag nicht gefunden.', 404);
        const z = kopie(r), out = await fn(z); if (out === false) return false;
        const felder = {}; ['paket', 'weg', 'stand', 'angaben', 'dateien', 'preise', 'zahlung', 'abo', 'vorschau', 'zustimmung', 'verlauf', 'notiz', 'adresse', 'angaben_geaendert', 'gesehen', 'wechsel', 'instanz', 'ki'].forEach((s) => { if (JSON.stringify(z[s]) !== JSON.stringify(r[s])) felder[s] = z[s] === undefined ? null : z[s]; });
        felder.version = (r.version || 0) + 1; felder.updated_at = jetzt();
        const neu = eins(await schreiben('auftraege?id=eq.' + q(id) + '&version=eq.' + (r.version || 0), 'PATCH', felder));
        if (neu) return neu;
      }
      throw new ApiFehler('Gerade gleichzeitig geändert. Bitte noch einmal.', 409);
    },
    auftragLoeschen: async (id) => { await sb('auftraege?id=eq.' + q(id), { method: 'DELETE' }); return true; },
    adresseBelegt: async (name, ausser) => { const l = (await sb('auftraege?adresse=eq.' + q(name) + '&stand=in.(' + HAELT.join(',') + ')&select=id')) || []; return l.some((r) => r.id !== ausser); },
    auftragZuInstanz: async (id) => eins(await sb('auftraege?instanz->>id=eq.' + q(id) + '&stand=in.(' + LAEUFT.join(',') + ')&select=*&order=updated_at.desc&limit=1')),
    nachrichtAnlegen: async (row) => eins(await schreiben('auftrag_nachrichten', 'POST', row)),
    nachrichtenVon: async (auftrag) => (await sb('auftrag_nachrichten?auftrag=eq.' + q(auftrag) + '&select=*&order=created_at.asc')) || [],
    nachrichtenGelesen: async (auftrag, von) => { await sb('auftrag_nachrichten?auftrag=eq.' + q(auftrag) + '&von=eq.' + q(von) + '&gelesen=eq.false', { method: 'PATCH', body: { gelesen: true } }); return true; },
    ungelesen: async (von) => { const l = (await sb('auftrag_nachrichten?von=eq.' + q(von) + '&gelesen=eq.false&select=auftrag')) || []; const m = {}; l.forEach((n) => { m[n.auftrag] = (m[n.auftrag] || 0) + 1; }); return m; }
  };
}

/* eeziframes · Daten der Vermittlung (docs/VERMITTLUNG.md, Abschnitt 10): Anfragen der Hauseigentümer an bis zu drei Fensterbetriebe und
   der Zwischenspeicher der KI-Suche je Postleitzahl.
   Supabase über PostgREST (geheimer Schlüssel, nur vom Server) oder eine Attrappe im Arbeitsspeicher (DATEN_ATTRAPPE=1, Prüfung).
   Tabellen vermittlungen, vermittlung_suche und Funktion naechste_vermittlung_nr() in supabase/schema.sql (Abschnitt „Vermittlung“);
   erneutes Ausführen schadet nicht. Eine Anfrage ist ein Dokument (kunde, eckdaten, aufmass, einwilligung, betriebe, verlauf, notiz);
   Änderungen laufen über aendern(id, fn) mit Versionszähler wie bei den Aufträgen (functions/auftrag/daten.js).
   API: vermittlungDaten(k) → { art, anlegen(row), holen(id), alle(), vonTel(tel, seitIso), aendern(id, fn), loeschen(id),
        aelterAls(iso), sucheHolen(plz), sucheSetzen(plz, row), suchenFuer(plzListe), suchenStand(plzListe), suchenAufraeumen(iso, isoVorrat),
        betriebHolen(id), betriebeHolen(ids), betriebNachKontakt(telNorm, webHost), betriebeNachKonto(kontoId), betriebeNachMail(mail),
        betriebePartner(), betriebeAlle(), betriebSetzen(row), betriebAendern(id, fn) } | null
   Register der Betriebe (seit 30.10.2026, Tabelle vermittlung_betriebe, docs/VERMITTLUNG.md Abschnitt 13): je Betrieb eine Zeile mit
   Kennung (betriebId aus Name und Ort), Kontakt, Stand (neu, kontakt, partner, abgelehnt, pausiert), Partner-Erklärung, Konto im
   Kundenbereich, Zähler und der Liste seiner Anfragen; aliase sind Kennungen doppelt gefundener Einträge (gleiche Nummer oder Website).
   suchenStand: wie suchenFuer, aber nur plz, created_at, info und der erste Betrieb (reicht für gueltig; der Vorrat liest alle 10 Minuten)
   Vorrat (seit 30.10.2026): Suchen, die der Server ohne Kunden für Stützpunkte über ganz Deutschland füllt, tragen info.vorrat = true;
   sie gelten länger (isoVorrat) als die Suchen der Kunden (iso). */
import { ApiFehler, sbNeu } from './umgebung.js';

const kopie = (o) => (o == null ? o : JSON.parse(JSON.stringify(o)));
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const jetzt = () => new Date().toISOString();
export const nrText = (n) => 'V-' + new Date().getUTCFullYear() + '-' + String(n).padStart(4, '0');
/* Felder, die die Liste der Zentrale braucht (ohne das große Aufmaß) */
const LISTE = 'id,nr,tel,plz,stand,kunde,eckdaten,betriebe,bestaetigt,created_at,updated_at';
const FELDER = ['stand', 'kunde', 'eckdaten', 'aufmass', 'einwilligung', 'betriebe', 'bestaetigt', 'pdf', 'verlauf', 'notiz', 'meta'];

export function vermittlungDaten(k) {
  if (k.supabase) return supabase(k);
  if (k.datenAttrappe) return attrappe();
  return null;
}

/* ---------- Attrappe ---------- */
const A = { v: new Map(), suche: new Map(), betriebe: new Map(), nr: 0 };
function attrappe() {
  const V = A.v;
  const ohneAufmass = (r) => { const x = kopie(r); delete x.aufmass; delete x.einwilligung; delete x.verlauf; delete x.pdf; delete x.meta; delete x.notiz; return x; };
  return {
    art: 'attrappe',
    anlegen: async (row) => { const r = Object.assign({ id: uuid(), nr: nrText(++A.nr), stand: 'neu', kunde: {}, eckdaten: {}, aufmass: '', einwilligung: {}, betriebe: [], bestaetigt: false, pdf: null, verlauf: [], notiz: '', meta: {}, version: 0, created_at: jetzt(), updated_at: jetzt() }, kopie(row)); V.set(r.id, r); return kopie(r); },
    holen: async (id) => kopie(V.get(id) || null),
    alle: async () => Array.from(V.values()).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 500).map(ohneAufmass),
    vonTel: async (tel, seit) => Array.from(V.values()).filter((r) => r.tel === tel && r.created_at >= seit).map((r) => ({ id: r.id, nr: r.nr, created_at: r.created_at, meta: kopie(r.meta) })),
    /* fn(z) ändert z; false = nichts schreiben (Rückgabe false) */
    aendern: async (id, fn) => {
      const r = V.get(id); if (!r) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
      const z = kopie(r), out = await fn(z); if (out === false) return false;
      z.version = (r.version || 0) + 1; z.updated_at = jetzt(); V.set(id, z); return kopie(z);
    },
    loeschen: async (id) => { V.delete(id); return true; },
    aelterAls: async (iso) => Array.from(V.values()).filter((r) => r.created_at < iso).slice(0, 200).map((r) => ({ id: r.id, nr: r.nr, pdf: kopie(r.pdf), created_at: r.created_at })),
    sucheHolen: async (plz) => kopie(A.suche.get(plz) || null),
    sucheSetzen: async (plz, row) => { A.suche.set(plz, Object.assign({ plz: plz, created_at: jetzt() }, kopie(row))); return true; },
    suchenFuer: async (liste) => liste.map((p) => A.suche.get(p)).filter(Boolean).map(kopie),
    suchenStand: async (liste) => liste.map((p) => A.suche.get(p)).filter(Boolean).map((r) => ({ plz: r.plz, created_at: r.created_at, info: kopie(r.info), betriebe: kopie((r.betriebe || []).slice(0, 1)) })),
    suchenAufraeumen: async (iso, isoVorrat) => { let n = 0; for (const [p, r] of A.suche) if (r.created_at < (r.info && r.info.vorrat ? isoVorrat || iso : iso)) { A.suche.delete(p); n++; } return n; },
    /* Register der Betriebe */
    betriebHolen: async (id) => kopie(A.betriebe.get(id) || Array.from(A.betriebe.values()).find((r) => (r.aliase || []).includes(id)) || null),
    betriebeHolen: async (ids) => Array.from(A.betriebe.values()).filter((r) => ids.includes(r.id) || (r.aliase || []).some((a) => ids.includes(a))).map(kopie),
    betriebNachKontakt: async (tel, host) => kopie(Array.from(A.betriebe.values()).find((r) => (tel && r.tel_norm === tel) || (host && r.web_host === host)) || null),
    betriebeNachKonto: async (konto) => Array.from(A.betriebe.values()).filter((r) => r.konto === konto).map(kopie),
    betriebeNachMail: async (mail) => Array.from(A.betriebe.values()).filter((r) => r.mail === mail).map(kopie),
    betriebePartner: async () => Array.from(A.betriebe.values()).filter((r) => r.stand === 'partner').map(kopie),
    betriebeAlle: async () => Array.from(A.betriebe.values()).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)).slice(0, 1000).map(kopie),
    betriebSetzen: async (row) => { const alt = A.betriebe.get(row.id); const r = Object.assign({ version: 0, created_at: jetzt() }, alt || {}, kopie(row), { updated_at: jetzt() }); A.betriebe.set(r.id, r); return kopie(r); },
    betriebAendern: async (id, fn) => {
      const r = A.betriebe.get(id); if (!r) throw new ApiFehler('Diesen Betrieb gibt es im Register nicht.', 404);
      const z = kopie(r), out = await fn(z); if (out === false) return false;
      z.version = (r.version || 0) + 1; z.updated_at = jetzt(); A.betriebe.set(id, z); return kopie(z);
    }
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
      /* Tabellen fehlen noch: schema.sql (Abschnitt Vermittlung) ausführen */
      if (r.status === 404 || /does not exist|schema cache/i.test(t)) throw new ApiFehler('Die Vermittlung ist in der Datenbank noch nicht eingerichtet (supabase/schema.sql).', 503);
      console.log('Datenbank (Vermittlung)', r.status, t.slice(0, 160)); throw new ApiFehler('Die Datenbank hat die Anfrage abgelehnt.', 502);
    }
    try { return t ? JSON.parse(t) : null; } catch (e) { return null; }
  }
  const q = encodeURIComponent;
  const eins = (l) => (Array.isArray(l) && l.length ? l[0] : null);
  const schreiben = (pfad, method, body) => sb(pfad, { method: method, body: body, headers: { prefer: 'return=representation' } });
  return {
    art: 'supabase',
    anlegen: async (row) => {
      const n = await sb('rpc/naechste_vermittlung_nr', { method: 'POST', body: {} });
      return eins(await schreiben('vermittlungen', 'POST', Object.assign({ nr: nrText(Number(n) || Date.now() % 10000) }, row)));
    },
    holen: async (id) => eins(await sb('vermittlungen?id=eq.' + q(id) + '&select=*')),
    alle: async () => (await sb('vermittlungen?select=' + LISTE + '&order=created_at.desc&limit=500')) || [],
    vonTel: async (tel, seit) => (await sb('vermittlungen?tel=eq.' + q(tel) + '&created_at=gte.' + q(seit) + '&select=id,nr,created_at,meta')) || [],
    aendern: async (id, fn) => {
      for (let i = 0; i < 4; i++) {
        const r = eins(await sb('vermittlungen?id=eq.' + q(id) + '&select=*')); if (!r) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
        const z = kopie(r), out = await fn(z); if (out === false) return false;
        const felder = {}; FELDER.forEach((s) => { if (JSON.stringify(z[s]) !== JSON.stringify(r[s])) felder[s] = z[s] === undefined ? null : z[s]; });
        felder.version = (r.version || 0) + 1; felder.updated_at = jetzt();
        const neu = eins(await schreiben('vermittlungen?id=eq.' + q(id) + '&version=eq.' + (r.version || 0), 'PATCH', felder));
        if (neu) return neu;
      }
      throw new ApiFehler('Gerade gleichzeitig geändert. Bitte noch einmal.', 409);
    },
    loeschen: async (id) => { await sb('vermittlungen?id=eq.' + q(id), { method: 'DELETE' }); return true; },
    aelterAls: async (iso) => (await sb('vermittlungen?created_at=lt.' + q(iso) + '&select=id,nr,pdf,created_at&order=created_at.asc&limit=200')) || [],
    sucheHolen: async (plz) => eins(await sb('vermittlung_suche?plz=eq.' + q(plz) + '&select=*')),
    sucheSetzen: async (plz, row) => { await sb('vermittlung_suche?on_conflict=plz', { method: 'POST', body: Object.assign({ plz: plz, created_at: jetzt() }, row), headers: { prefer: 'resolution=merge-duplicates,return=minimal' } }); return true; },
    /* Suchen mehrerer Postleitzahlen (Umkreis, Stützpunkte); in Teilen zu 120, damit die Adresse kurz bleibt, die Teile gleichzeitig */
    suchenFuer: async (liste) => {
      const teile = []; for (let i = 0; i < liste.length; i += 120) teile.push(liste.slice(i, i + 120));
      return (await Promise.all(teile.map((t) => sb('vermittlung_suche?plz=in.(' + t.map(q).join(',') + ')&select=plz,ort,quelle,betriebe,info,created_at')))).flatMap((l) => l || []);
    },
    suchenStand: async (liste) => {
      const teile = []; for (let i = 0; i < liste.length; i += 120) teile.push(liste.slice(i, i + 120));
      return (await Promise.all(teile.map((t) => sb('vermittlung_suche?plz=in.(' + t.map(q).join(',') + ')&select=plz,info,created_at,erster:betriebe->0')))).flatMap((l) => l || []).map((r) => ({ plz: r.plz, created_at: r.created_at, info: r.info, betriebe: r.erster ? [r.erster] : [] }));
    },
    suchenAufraeumen: async (iso, isoVorrat) => {
      const kunden = 'vermittlung_suche?created_at=lt.' + q(iso) + '&info->>vorrat=is.null', vorrat = 'vermittlung_suche?created_at=lt.' + q(isoVorrat || iso) + '&info->>vorrat=eq.true';
      const l = ((await sb(kunden + '&select=plz')) || []).concat((await sb(vorrat + '&select=plz')) || []);
      if (l.length) { await sb(kunden, { method: 'DELETE' }); await sb(vorrat, { method: 'DELETE' }); }
      return l.length;
    },
    /* Register der Betriebe (aliase ist text[]: ov = überschneidet sich) */
    betriebHolen: async (id) => eins(await sb('vermittlung_betriebe?or=(id.eq.' + q(id) + ',aliase.cs.{' + q(id) + '})&select=*&limit=1')),
    betriebeHolen: async (ids) => (ids.length ? (await sb('vermittlung_betriebe?or=(id.in.(' + ids.map(q).join(',') + '),aliase.ov.{' + ids.map(q).join(',') + '})&select=*')) || [] : []),
    betriebNachKontakt: async (tel, host) => {
      const t = []; if (tel) t.push('tel_norm.eq.' + q(tel)); if (host) t.push('web_host.eq.' + q(host));
      return t.length ? eins(await sb('vermittlung_betriebe?or=(' + t.join(',') + ')&select=*&limit=1')) : null;
    },
    betriebeNachKonto: async (konto) => (await sb('vermittlung_betriebe?konto=eq.' + q(konto) + '&select=*')) || [],
    betriebeNachMail: async (mail) => (await sb('vermittlung_betriebe?mail=eq.' + q(mail) + '&select=*')) || [],
    betriebePartner: async () => (await sb('vermittlung_betriebe?stand=eq.partner&select=*')) || [],
    betriebeAlle: async () => (await sb('vermittlung_betriebe?select=*&order=updated_at.desc&limit=1000')) || [],
    betriebSetzen: async (row) => eins(await sb('vermittlung_betriebe?on_conflict=id', { method: 'POST', body: row, headers: { prefer: 'resolution=merge-duplicates,return=representation' } })),
    betriebAendern: async (id, fn) => {
      for (let i = 0; i < 4; i++) {
        const r = eins(await sb('vermittlung_betriebe?id=eq.' + q(id) + '&select=*')); if (!r) throw new ApiFehler('Diesen Betrieb gibt es im Register nicht.', 404);
        const z = kopie(r), out = await fn(z); if (out === false) return false;
        const felder = {}; Object.keys(z).forEach((s) => { if (s !== 'id' && s !== 'version' && s !== 'created_at' && s !== 'updated_at' && JSON.stringify(z[s]) !== JSON.stringify(r[s])) felder[s] = z[s] === undefined ? null : z[s]; });
        felder.version = (r.version || 0) + 1; felder.updated_at = jetzt();
        const neu = eins(await schreiben('vermittlung_betriebe?id=eq.' + q(id) + '&version=eq.' + (r.version || 0), 'PATCH', felder));
        if (neu) return neu;
      }
      throw new ApiFehler('Gerade gleichzeitig geändert. Bitte noch einmal.', 409);
    }
  };
}

// eeziframes · Cloudflare nachgestellt für die Prüfung (scripts/pruefen-instanzen/26.mjs; Gegenstück zu functions/api/cloudflare.js)
//
// Fängt fetch an https://api.cloudflare.com/client/v4, an den DNS-Dienst https://cloudflare-dns.com/dns-query und an
// https://<host>/api/instanz/ping ab (die Antwort der Instanz liefert o.ping(url), etwa worker.fetch im selben Prozess) und hält Zonen,
// DNS-Einträge, Custom Domains des Workers, Zertifikate und Registrar-Daten im Speicher. Jede Anfrage steht im Protokoll (Methode,
// Pfad, Body, ob der Schlüssel stimmte). Nachgebildet sind nur die Regeln, auf die es hier ankommt, so wie Cloudflare sie dokumentiert:
//   - falscher oder fehlender Schlüssel: 403 mit success: false (Code 10000)
//   - eine neue Zone ist „pending“ und nennt zwei Nameserver; aktivieren(name) stellt den Wechsel der Nameserver nach
//   - Custom Domain (PUT …/workers/domains): gibt es für den Namen schon einen A-, AAAA- oder CNAME-Eintrag, lehnt Cloudflare ab
//     (Code 100117); sonst legt Cloudflare selbst einen schreibgeschützten Eintrag und ein aktives Zertifikat an
//   - DNS-Abfrage: Namen mit Custom Domain oder A-Eintrag antworten mit einer Adresse, Zonen und o.vergeben ohne Adresse, unbekannte
//     mit NXDOMAIN (Status 3)
//   - Registrar: nur Domains, die bei Cloudflare registriert sind (zone(name, { registrar })), sonst 404
export function cloudflareNachstellen(o) {
  o = o || {};
  const echt = globalThis.fetch, log = [];
  const TOKEN = o.token || 'cf-pruef-token', KONTO = o.konto || '0123456789abcdef0123456789abcdef';
  const db = { zonen: new Map(), dns: [], domains: [], zertifikate: [], registrar: new Map() };
  let nr = 0;
  const id = (p) => p + String(++nr).padStart(8, '0') + 'a'.repeat(24 - String(nr).length);
  const antwort = (status, result, fehler) => new Response(JSON.stringify(fehler ? { success: false, errors: [fehler], messages: [], result: null } : { success: true, errors: [], messages: [], result: result }), { status: status, headers: { 'content-type': 'application/json' } });
  const zoneVon = (name) => { for (const z of db.zonen.values()) if (name === z.name || name.endsWith('.' + z.name)) return z; return null; };
  function zoneAnlegen(name, x) {
    x = x || {};
    const z = { id: id('z'), name: name, status: x.status || 'pending', name_servers: ['ada.ns.cloudflare.com', 'bob.ns.cloudflare.com'], account: { id: KONTO } };
    db.zonen.set(z.id, z);
    if (x.registrar) db.registrar.set(name, Object.assign({ name: name, expires_at: '2027-10-22T00:00:00Z', auto_renew: true }, x.registrar));
    return z;
  }
  async function cf(url, init) {
    const u = new URL(url), pfad = u.pathname.replace(/^\/client\/v4/, ''), m = (init && init.method) || 'GET', kopf = new Headers((init && init.headers) || {});
    let body = null; try { body = init && init.body ? JSON.parse(init.body) : null; } catch (e) { body = null; }
    const echtSchluessel = kopf.get('authorization') === 'Bearer ' + TOKEN;
    log.push({ method: m, pfad: pfad, suche: u.search, body: body, schluessel: echtSchluessel });
    if (!echtSchluessel) return antwort(403, null, { code: 10000, message: 'Authentication error' });
    let t;
    if (pfad === '/zones' && m === 'GET') { const n = u.searchParams.get('name'); return antwort(200, Array.from(db.zonen.values()).filter((z) => !n || z.name === n)); }
    if (pfad === '/zones' && m === 'POST') {
      if (!body || !body.name || (body.account || {}).id !== KONTO) return antwort(400, null, { code: 1001, message: 'Invalid zone' });
      if (Array.from(db.zonen.values()).some((z) => z.name === body.name)) return antwort(409, null, { code: 1061, message: body.name + ' already exists' });
      return antwort(200, zoneAnlegen(body.name));
    }
    if ((t = /^\/zones\/([^/]+)$/.exec(pfad)) && m === 'GET') { const z = db.zonen.get(t[1]); return z ? antwort(200, z) : antwort(404, null, { code: 1001, message: 'Zone not found' }); }
    if ((t = /^\/zones\/([^/]+)\/dns_records$/.exec(pfad))) {
      if (!db.zonen.has(t[1])) return antwort(404, null, { code: 1001, message: 'Zone not found' });
      if (m === 'GET') { const n = u.searchParams.get('name'); return antwort(200, db.dns.filter((r) => r.zone_id === t[1] && (!n || r.name === n))); }
      if (m === 'POST') { const r = Object.assign({ id: id('r'), zone_id: t[1], meta: {} }, body); db.dns.push(r); return antwort(200, r); }
    }
    if ((t = /^\/zones\/([^/]+)\/dns_records\/([^/]+)$/.exec(pfad)) && m === 'DELETE') { const i = db.dns.findIndex((r) => r.id === t[2] && r.zone_id === t[1]); if (i < 0) return antwort(404, null, { code: 81044, message: 'Record not found' }); db.dns.splice(i, 1); return antwort(200, { id: t[2] }); }
    if ((t = /^\/zones\/([^/]+)\/ssl\/certificate_packs$/.exec(pfad)) && m === 'GET') return antwort(200, db.zertifikate.filter((c) => c.zone_id === t[1]));
    if ((t = /^\/accounts\/([^/]+)\/workers\/domains$/.exec(pfad))) {
      if (t[1] !== KONTO) return antwort(403, null, { code: 10000, message: 'Authentication error' });
      if (m === 'GET') { const n = u.searchParams.get('hostname'); return antwort(200, db.domains.filter((d) => !n || d.hostname === n)); }
      if (m === 'PUT') {
        const z = db.zonen.get((body || {}).zone_id), h = String((body || {}).hostname || '');
        if (!z || !(h === z.name || h.endsWith('.' + z.name))) return antwort(400, null, { code: 100116, message: 'Hostname does not belong to zone' });
        if (z.status !== 'active') return antwort(400, null, { code: 100119, message: 'Zone is not active' });
        if (db.dns.some((r) => r.name === h && ['A', 'AAAA', 'CNAME'].includes(r.type) && !(r.meta && r.meta.read_only))) return antwort(409, null, { code: 100117, message: 'Hostname already has externally managed DNS records (A, AAAA, CNAME).' });
        let d = db.domains.find((x) => x.hostname === h);
        if (!d) {
          d = { id: id('d'), hostname: h, service: body.service, environment: body.environment || 'production', zone_id: z.id, zone_name: z.name, cert_id: id('c') };
          db.domains.push(d);
          db.dns.push({ id: id('r'), zone_id: z.id, type: 'AAAA', name: h, content: '100::', proxied: true, meta: { read_only: true, origin_worker_id: 'fenstero' } });
          db.zertifikate.push({ id: d.cert_id, zone_id: z.id, status: o.zertifikatAus ? 'pending_validation' : 'active', hosts: [h] });
        }
        return antwort(200, d);
      }
    }
    if ((t = /^\/accounts\/([^/]+)\/workers\/domains\/([^/]+)$/.exec(pfad)) && m === 'DELETE') {
      const i = db.domains.findIndex((d) => d.id === t[2]); if (i < 0) return antwort(404, null, { code: 100114, message: 'Domain not found' });
      const d = db.domains.splice(i, 1)[0]; db.dns = db.dns.filter((r) => !(r.name === d.hostname && r.meta && r.meta.read_only)); db.zertifikate = db.zertifikate.filter((c) => c.id !== d.cert_id);
      return antwort(200, null);
    }
    if ((t = /^\/accounts\/([^/]+)\/registrar\/domains\/([^/]+)$/.exec(pfad))) {
      const r = db.registrar.get(decodeURIComponent(t[2]));
      if (!r) return antwort(404, null, { code: 10006, message: 'Domain not found' });
      if (m === 'GET') return antwort(200, r);
      if (m === 'PUT') { if (o.registrarNurLesen) return antwort(403, null, { code: 10000, message: 'Authentication error' }); Object.assign(r, { auto_renew: !!(body || {}).auto_renew }); return antwort(200, r); }
    }
    return antwort(404, null, { code: 7003, message: 'No route for that URI (' + m + ' ' + pfad + ')' });
  }
  function doh(url) {
    const u = new URL(url), name = u.searchParams.get('name'), typ = u.searchParams.get('type') || 'A';
    log.push({ method: 'GET', pfad: 'dns-query', name: name, typ: typ });
    const mitDomain = db.domains.some((d) => d.hostname === name), eintraege = db.dns.filter((r) => r.name === name && r.type === typ && !(r.meta && r.meta.read_only));
    const status = mitDomain || eintraege.length || db.dns.some((r) => r.name === name) || Array.from(db.zonen.values()).some((z) => z.name === name) || (o.vergeben || []).includes(name) ? 0 : 3;
    const answer = mitDomain ? [{ name: name, type: typ === 'AAAA' ? 28 : 1, data: typ === 'AAAA' ? '2606:4700:3030::6815:1' : '104.21.0.1' }] : eintraege.map((r) => ({ name: name, type: 1, data: r.content }));
    return new Response(JSON.stringify({ Status: status, Answer: answer.length ? answer : undefined }), { status: 200, headers: { 'content-type': 'application/dns-json' } });
  }
  globalThis.fetch = async (url, init) => {
    const s = String(url && url.url ? url.url : url);
    if (s.startsWith('https://api.cloudflare.com/')) return cf(s, init);
    if (s.startsWith('https://cloudflare-dns.com/dns-query')) return doh(s);
    if (/^https:\/\/[^/]+\/api\/instanz\/ping$/.test(s)) {
      const host = new URL(s).hostname; log.push({ method: 'GET', pfad: 'ping', host: host });
      if (!db.domains.some((d) => d.hostname === host) || !o.ping) throw new TypeError('fetch failed');
      return o.ping(s);
    }
    return echt(url, init);
  };
  return {
    log: log, db: db, token: TOKEN, konto: KONTO,
    zone: zoneAnlegen,
    aktivieren: (name) => { for (const z of db.zonen.values()) if (z.name === name) z.status = 'active'; },
    dns: (name, rec) => { const z = zoneVon(name); const r = Object.assign({ id: id('r'), zone_id: z.id, name: name, meta: {} }, rec); db.dns.push(r); return r; },
    aus: () => { globalThis.fetch = echt; }
  };
}

/* eeziframes · Domains der Instanzen über die Cloudflare-API: Zone, Custom Domain am Worker, DNS-Schutz, Registrar, Prüfung
   (Strang C, Bauplan §3 C.3, K2.3, K2.20, E21; Klick-Anleitung aus §4). Aufrufer: Zentrale (zentrale-instanzen.js), täglicher Lauf.
   Zugang: Secret CF_API_TOKEN (eigene Vorlage ohne Zugriff auf eeziframes.com: Konto „Workers Scripts: Edit“, „Zone: Edit“,
   „Registrar: Domains: Read“; Zonen „Zone: Read“, „DNS: Edit“, „Workers Routes: Edit“) und Variable CF_ACCOUNT_ID. Ohne beides gibt es
   keinen Dienst (null): Die Zentrale zeigt dann die Klick-Anleitung und prüft trotzdem (DNS über DoH, Antwort der Instanz).
   Der Worker heißt fenstero (wrangler.jsonc „name“); seine Custom Domains stehen nie in wrangler.jsonc (Regel K2.18).

   API:
     cloudflareDienst(k, env) → Dienst | null
     anleitung(host)                         Klick-Anleitung (Schritte als Text) für das Dashboard von Cloudflare
     zoneAnlegen(ctx, inst, host)            Zone für eine woanders gekaufte Domain anlegen, Nameserver nennen
     domainVerbinden(ctx, inst, host, o)     Zone suchen (o.zoneAnlegen: anlegen und Nameserver nennen), störende A/AAAA/CNAME melden
                                             (o.stoerendeLoeschen: löschen), Custom Domain für host und www.host, DNS-Schutz, Registrar
     domainPruefen(ctx, inst, host, o)       Prüfung serverseitig: API (Custom Domain, Zertifikat, Zone), DoH, Antwort der Instanz
                                             (/api/instanz/ping mit erwarteter id8); speichert das Ergebnis in instanz_hosts.pruefung
     domainLoesen(ctx, inst, host)           Custom Domains lösen, Auto-Verlängerung aus (Ende des Vertrags, §5.3 F1)
     instanzenPruefen(k, sp, env)            täglich: Antwort der Instanz, Ablaufwarnung (FRISTEN.domainWarnTage), bei „beendet“ lösen
   Lokal (DATEN_ATTRAPPE und *.localhost) fragt die Prüfung die Instanz im selben Prozess (der Testserver hat keine echte Domain) und
   überspringt DNS. Jede Anfrage nach außen hat eine Zeitgrenze; ein Fehler macht die Prüfung rot, nie den Aufrufer kaputt. */
import '../../web/assets/instanzregeln.js';
import { ApiFehler, jetztAus } from './umgebung.js';
import { postDienst, mailRahmen, esc } from './post.js';

const R = () => globalThis.Instanzregeln;
const API = 'https://api.cloudflare.com/client/v4';
const DOH = 'https://cloudflare-dns.com/dns-query';
export const WORKER = 'fenstero';
const TAG = 864e5;
const iso = (t) => new Date(t).toISOString();
const lokalHost = (k, host) => !!(k && k.datenAttrappe) && /(^|\.)localhost$/.test(String(host || ''));

/* fetch mit Zeitgrenze */
async function holen(url, init, ms) {
  const ab = new AbortController(), t = setTimeout(() => ab.abort(), ms || 8000);
  try { return await fetch(url, Object.assign({}, init || {}, { signal: ab.signal })); } finally { clearTimeout(t); }
}

/* Registrierbare Domain (Zone) zu einem Host: die letzten zwei Teile, bei zweistufigen Endungen (co.uk, com.au …) drei */
export function apexVon(host) {
  const t = String(host || '').toLowerCase().split('.').filter(Boolean);
  if (t.length <= 2) return t.join('.');
  const zweistufig = /^(co|com|org|net|gov|ac|or|ne|edu)$/.test(t[t.length - 2]) && t[t.length - 1].length === 2;
  return t.slice(zweistufig ? -3 : -2).join('.');
}

/* ---------- Dienst ---------- */
export function cloudflareDienst(k, env) {
  const token = String((env && env.CF_API_TOKEN) || '').trim(), konto = String((env && env.CF_ACCOUNT_ID) || '').trim();
  if (!token || !/^[0-9a-f]{32}$/i.test(konto)) return null;
  async function rufe(method, pfad, body, o) {
    let r;
    try { r = await holen(API + pfad, { method: method, headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined }, 15000); }
    catch (e) { throw new ApiFehler('Cloudflare antwortet nicht (' + String(e && e.name === 'AbortError' ? 'Zeitüberschreitung' : e && e.message ? e.message : e).slice(0, 80) + ').', 502); }
    const j = await r.json().catch(() => null);
    if (o && o.leer404 && r.status === 404) return null;
    if (!r.ok || !j || j.success === false) {
      const f = (j && Array.isArray(j.errors) && j.errors[0]) || {};
      const e = new ApiFehler('Cloudflare: ' + String(f.message || ('Fehler ' + r.status)).slice(0, 200) + (f.code ? ' (Code ' + f.code + ')' : ''), r.status === 403 || r.status === 401 ? 502 : r.status >= 500 ? 502 : 409, { cloudflare: { status: r.status, code: f.code || 0 } });
      e.cf = { status: r.status, code: f.code || 0 };
      throw e;
    }
    return j.result;
  }
  const z = encodeURIComponent;
  return {
    art: 'cloudflare', konto: konto,
    /* Zone zu einem Host: der Host selbst oder ein übergeordneter Name (höchstens drei Stufen) */
    async zoneSuchen(host) {
      const teile = String(host).split('.');
      for (let i = 0; i < Math.min(3, teile.length - 1); i++) {
        const name = teile.slice(i).join('.');
        const l = await rufe('GET', '/zones?name=' + z(name) + '&account.id=' + z(konto) + '&per_page=5');
        if (Array.isArray(l) && l.length) return l[0];
      }
      return null;
    },
    zoneAnlegen: (name) => rufe('POST', '/zones', { name: name, account: { id: konto }, type: 'full' }),
    zone: (id) => rufe('GET', '/zones/' + z(id)),
    domains: (host) => rufe('GET', '/accounts/' + z(konto) + '/workers/domains' + (host ? '?hostname=' + z(host) : '')).then((l) => (Array.isArray(l) ? l : []).filter((d) => !host || d.hostname === host)),
    domainAnhaengen: (host, zoneId) => rufe('PUT', '/accounts/' + z(konto) + '/workers/domains', { environment: 'production', hostname: host, service: WORKER, zone_id: zoneId }),
    domainLoesen: (id) => rufe('DELETE', '/accounts/' + z(konto) + '/workers/domains/' + z(id)),
    dnsListe: (zoneId, name) => rufe('GET', '/zones/' + z(zoneId) + '/dns_records?per_page=100' + (name ? '&name=' + z(name) : '')).then((l) => (Array.isArray(l) ? l : [])),
    dnsAnlegen: (zoneId, rec) => rufe('POST', '/zones/' + z(zoneId) + '/dns_records', rec),
    dnsLoeschen: (zoneId, id) => rufe('DELETE', '/zones/' + z(zoneId) + '/dns_records/' + z(id)),
    zertifikate: (zoneId) => rufe('GET', '/zones/' + z(zoneId) + '/ssl/certificate_packs?status=all&per_page=50').then((l) => (Array.isArray(l) ? l : [])),
    registrar: (name) => rufe('GET', '/accounts/' + z(konto) + '/registrar/domains/' + z(name), null, { leer404: true }),
    autoRenew: (name, an) => rufe('PUT', '/accounts/' + z(konto) + '/registrar/domains/' + z(name), { auto_renew: !!an })
  };
}

/* ---------- Klick-Anleitung (Bauplan §4, je Kunde) ---------- */
export function anleitung(host) {
  const h = String(host || 'ihre-domain.de'), apex = apexVon(h);
  return [
    { titel: 'Domain kaufen', text: '.app, .com usw. bei Cloudflare (Domain Registration → Register Domains, Auto-Verlängerung an). .de bei einem anderen Anbieter (z. B. INWX); dann bei Cloudflare „Add a domain“ für ' + apex + ' (Tarif Free) und die zwei angezeigten Nameserver beim Anbieter eintragen.' },
    { titel: 'Mit dem Konfigurator verbinden', text: 'Workers & Pages → ' + WORKER + ' → Einstellungen → Domains & Routes → Add → Custom Domain: ' + h + ' eintragen und hinzufügen, danach dasselbe für www.' + h + '.' },
    { titel: 'Störende Einträge löschen', text: 'Meldet Cloudflare, dass es den Namen schon gibt: unter DNS → Records die A-, AAAA- oder CNAME-Einträge für genau ' + h + ' bzw. www.' + h + ' löschen und den Schritt davor wiederholen.' },
    { titel: 'Mail-Schutz eintragen', text: 'DNS → Records → Add: MX ' + h + ' mit Mailserver „.“ und Priorität 0; TXT ' + h + ' mit „v=spf1 -all“; TXT _dmarc.' + h + ' mit „v=DMARC1; p=reject;“. So kann niemand mit dieser Domain Mails fälschen.' },
    { titel: 'Zone aufräumen', text: 'In der Zone von ' + apex + ': Web Analytics aus, Rocket Loader aus, E-Mail-Adressen-Verschleierung aus, Bot Fight Mode aus (setzt sonst ein Cookie, das in keinem Datenschutztext steht).' },
    { titel: 'Prüfen', text: 'Hier auf „Prüfen“ tippen, bis alles grün ist (Zertifikat, DNS, Antwort der Instanz). Das Zertifikat braucht meist ein paar Minuten.' }
  ];
}

/* ---------- Anbinden ---------- */
/* Einträge, die einer Custom Domain im Weg stehen: A, AAAA, CNAME für genau diesen Namen (nicht die vom Worker selbst angelegten) */
const vomWorker = (r) => !!(r && ((r.meta && (r.meta.read_only || r.meta.origin_worker_id)) || r.type === 'Worker'));
const stoerend = (liste, name) => liste.filter((r) => r && r.name === name && ['A', 'AAAA', 'CNAME'].includes(r.type) && !vomWorker(r));

export async function domainVerbinden(ctx, inst, host, o) {
  o = o || {};
  const cf = cloudflareDienst(ctx.k, ctx.env);
  if (!cf) throw new ApiFehler('Ohne CF_API_TOKEN und CF_ACCOUNT_ID geht das nur von Hand: Bitte der Klick-Anleitung folgen.', 409, { anleitung: true });
  const schritte = [], namen = [host, 'www.' + host];
  /* 1. Zone */
  let zone = await cf.zoneSuchen(host);
  if (!zone) {
    if (!o.zoneAnlegen) return { ok: false, schritt: 'zone', zone: null, schritte: [{ ok: false, text: 'Für ' + apexVon(host) + ' gibt es im Cloudflare-Konto noch keine Zone. Bei Cloudflare gekauft? Dann kurz warten. Woanders gekauft (z. B. .de)? Dann „Zone anlegen“ und die Nameserver beim Anbieter eintragen.' }] };
    zone = await cf.zoneAnlegen(apexVon(host));
    schritte.push({ ok: true, text: 'Zone ' + zone.name + ' angelegt.' });
  }
  const zoneInfo = { id: zone.id, name: zone.name, status: zone.status, nameserver: zone.name_servers || [] };
  if (zone.status !== 'active') {
    schritte.push({ ok: false, text: 'Die Zone ' + zone.name + ' ist noch nicht aktiv (' + zone.status + '). Beim Domain-Anbieter diese Nameserver eintragen: ' + (zone.name_servers || []).join(', ') + '. Danach dauert es meist einige Minuten, selten bis zu 24 Stunden.' });
    await registrarMerken(ctx, inst.id, host, { zone_id: zone.id });
    return { ok: false, schritt: 'nameserver', zone: zoneInfo, schritte: schritte };
  }
  /* 2. Störende Einträge */
  const dns = await cf.dnsListe(zone.id);
  const konflikte = namen.flatMap((n) => stoerend(dns, n)).map((r) => ({ id: r.id, name: r.name, typ: r.type, inhalt: r.content }));
  if (konflikte.length && !o.stoerendeLoeschen) return { ok: false, schritt: 'konflikte', zone: zoneInfo, konflikte: konflikte, schritte: schritte.concat([{ ok: false, text: 'Für ' + namen.join(' bzw. ') + ' gibt es schon DNS-Einträge (' + konflikte.map((x) => x.typ + ' ' + x.name + ' → ' + x.inhalt).join('; ') + '). Sie stehen der Verbindung im Weg; „Einträge löschen und verbinden“ entfernt genau diese.' }]) };
  for (const x of konflikte) { await cf.dnsLoeschen(zone.id, x.id); schritte.push({ ok: true, text: 'DNS-Eintrag ' + x.typ + ' ' + x.name + ' gelöscht.' }); }
  /* 3. Custom Domains für host und www.host */
  const ids = {};
  for (const n of namen) {
    const da = (await cf.domains(n)).find((d) => d.service === WORKER);
    const d = da || (await cf.domainAnhaengen(n, zone.id));
    ids[n === host ? 'apex' : 'www'] = d.id;
    schritte.push({ ok: true, text: n + (da ? ' hängt schon am Konfigurator.' : ' mit dem Konfigurator verbunden.') });
  }
  /* 4. Mail-Schutz: nur, wenn es keine eigenen Mail-Einträge gibt (eine Domain mit Postfach bleibt unberührt) */
  const schutz = [];
  const vorhanden = (name, typ, test) => dns.some((r) => r.name === name && r.type === typ && (!test || test(String(r.content || ''))));
  if (!vorhanden(host, 'MX')) { await cf.dnsAnlegen(zone.id, { type: 'MX', name: host, content: '.', priority: 0, ttl: 1, comment: 'eeziframes: keine Mails über diese Domain' }); schutz.push('MX 0 .'); }
  if (!vorhanden(host, 'TXT', (c) => /v=spf1/i.test(c))) { await cf.dnsAnlegen(zone.id, { type: 'TXT', name: host, content: 'v=spf1 -all', ttl: 1, comment: 'eeziframes: keine Mails über diese Domain' }); schutz.push('SPF -all'); }
  if (!vorhanden('_dmarc.' + host, 'TXT', (c) => /v=DMARC1/i.test(c))) { await cf.dnsAnlegen(zone.id, { type: 'TXT', name: '_dmarc.' + host, content: 'v=DMARC1; p=reject;', ttl: 1, comment: 'eeziframes: keine Mails über diese Domain' }); schutz.push('DMARC reject'); }
  schritte.push({ ok: true, text: schutz.length ? 'Mail-Schutz eingetragen (' + schutz.join(', ') + ').' : 'Mail-Einträge vorhanden, Mail-Schutz unverändert.' });
  /* 5. Registrar */
  const reg = await registrarLesen(cf, host).catch(() => null);
  await registrarMerken(ctx, inst.id, host, Object.assign({ zone_id: zone.id, domain_ids: ids, verbunden: iso(jetztAus(ctx.env)) }, reg || { anbieter: 'extern' }));
  schritte.push(reg ? { ok: true, text: 'Registriert bei Cloudflare, läuft bis ' + datumText(reg.ablauf) + (reg.autoRenew ? ', verlängert sich selbst.' : ', Auto-Verlängerung AUS.') } : { ok: true, text: 'Nicht bei Cloudflare registriert: Ablaufdatum bitte von Hand eintragen.' });
  return { ok: true, schritt: 'verbunden', zone: zoneInfo, schritte: schritte };
}
export async function zoneAnlegen(ctx, inst, host) {
  const cf = cloudflareDienst(ctx.k, ctx.env);
  if (!cf) throw new ApiFehler('Ohne CF_API_TOKEN geht das nur im Dashboard von Cloudflare („Add a domain“).', 409, { anleitung: true });
  const da = await cf.zoneSuchen(host), zone = da || (await cf.zoneAnlegen(apexVon(host)));
  await registrarMerken(ctx, inst.id, host, { zone_id: zone.id });
  return { ok: true, neu: !da, zone: { id: zone.id, name: zone.name, status: zone.status, nameserver: zone.name_servers || [] } };
}
const datumText = (s) => { const d = new Date(s); return isNaN(d) ? '–' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Berlin' }); };
async function registrarLesen(cf, host) {
  const r = await cf.registrar(apexVon(host));
  if (!r) return null;
  return { anbieter: 'cloudflare', ablauf: r.expires_at || r.expires || null, autoRenew: !!r.auto_renew };
}
/* Registrar-Daten am Host (Zusammenführen, nie Verlust von Hand eingetragener Werte) */
async function registrarMerken(ctx, instId, host, neu) {
  const alt = ((await ctx.sp.hostsVon(instId)) || []).find((h) => h.host === host);
  if (!alt) return null;
  return ctx.sp.hostAendern(host, { registrar: Object.assign({}, alt.registrar || {}, neu) });
}

/* ---------- Prüfen ---------- */
async function dohFrage(host) {
  for (const typ of ['A', 'AAAA']) {
    try {
      const r = await holen(DOH + '?name=' + encodeURIComponent(host) + '&type=' + typ, { headers: { accept: 'application/dns-json' } }, 5000);
      const j = r.ok ? await r.json() : null;
      if (j && j.Status === 0 && Array.isArray(j.Answer) && j.Answer.length) return { ok: true, typ: typ, werte: j.Answer.slice(0, 4).map((a) => String(a.data)) };
      if (j && j.Status === 3) return { ok: false, fehler: 'Den Namen gibt es (noch) nicht im DNS.' };
    } catch (e) { return { ok: false, fehler: 'DNS-Abfrage nicht möglich.' }; }
  }
  return { ok: false, fehler: 'Kein A- oder AAAA-Eintrag.' };
}
/* „Wahrscheinlich frei“ (Bestellung, Gespräch mit dem Kunden): Ohne Abfrage beim Registrar nur eine Schätzung über das DNS.
   Kennt das DNS die registrierbare Domain nicht (NXDOMAIN), ist sie wahrscheinlich frei; antwortet es, ist sie vergeben. */
export async function domainFrei(hosts) {
  const out = [];
  for (const h of (hosts || []).slice(0, 6)) {
    const r0 = R().host(h), apex = r0.ok ? apexVon(r0.host) : '';
    if (!apex) { out.push({ host: String(h || '').slice(0, 80), apex: '', frei: null, text: r0.fehler || 'keine Domain' }); continue; }
    let frei = null;
    try {
      const r = await holen(DOH + '?name=' + encodeURIComponent(apex) + '&type=NS', { headers: { accept: 'application/dns-json' } }, 5000), j = r.ok ? await r.json() : null;
      if (j && j.Status === 3) frei = true; else if (j && j.Status === 0) frei = false;
    } catch (e) { frei = null; }
    out.push({ host: r0.host, apex: apex, frei: frei, text: frei === true ? 'wahrscheinlich frei' : frei === false ? 'vergeben' : 'unklar' });
  }
  return out;
}
/* Antwort der Instanz: lokal im selben Prozess (Testserver), sonst über das Netz */
async function ping(k, env, host, basisLokal) {
  try {
    let r;
    if (lokalHost(k, host)) {
      const { instanzVon } = await import('../instanz/mandant.js'), { ausliefern } = await import('../instanz/seiten.js');
      const inst = await instanzVon(host, env, null);
      r = await ausliefern(new Request((basisLokal || 'http://' + host) + '/api/instanz/ping'), env, { waitUntil() {}, passThroughOnException() {} }, inst);
    } else r = await holen('https://' + host + '/api/instanz/ping', { headers: { accept: 'application/json' }, redirect: 'manual' }, 8000);
    if (r.status >= 300 && r.status < 400) return { ok: false, status: r.status, fehler: 'Leitet weiter (' + r.status + '), statt selbst zu antworten.' };
    const j = await r.json().catch(() => null);
    return j && j.ok && j.instanz ? { ok: true, status: r.status, instanz: j.instanz, version: j.version } : { ok: false, status: r.status, fehler: 'Antwort ohne Instanz (' + r.status + ').' };
  } catch (e) { return { ok: false, status: 0, fehler: 'Keine Antwort (' + String(e && e.name === 'AbortError' ? 'Zeitüberschreitung' : e && e.message ? e.message : e).slice(0, 80) + ').' }; }
}
async function apiStand(cf, host, reg) {
  const out = { ok: false, domains: [], zertifikat: false, zone: '' };
  try {
    const zone = reg && reg.zone_id ? await cf.zone(reg.zone_id).catch(() => null) : await cf.zoneSuchen(host);
    if (!zone) { out.fehler = 'Keine Zone im Konto.'; return out; }
    out.zone = zone.status;
    for (const n of [host, 'www.' + host]) if ((await cf.domains(n)).some((d) => d.service === WORKER)) out.domains.push(n);
    const packs = await cf.zertifikate(zone.id).catch(() => []);
    out.zertifikat = packs.some((p) => p && p.status === 'active' && (p.hosts || []).some((x) => x === host || (x.startsWith('*.') && host.endsWith(x.slice(1)))));
    out.ok = zone.status === 'active' && out.domains.length === 2 && out.zertifikat;
    if (!out.ok) out.fehler = zone.status !== 'active' ? 'Zone noch nicht aktiv (Nameserver).' : out.domains.length < 2 ? 'Nicht beide Namen hängen am Konfigurator (' + (out.domains.join(', ') || 'keiner') + ').' : 'Zertifikat noch nicht aktiv.';
  } catch (e) { out.fehler = String(e && e.message ? e.message : e).slice(0, 160); }
  return out;
}
/* Ergebnis: ok, wenn die Instanz unter der Domain antwortet; scheitert nur der Abruf von hier, zählen API und DNS (oder ein Vermerk
   „im Browser geprüft“, o.manuell) */
export async function domainPruefen(ctx, inst, host, o) {
  o = o || {};
  const k = ctx.k, sp = ctx.sp, jetzt = jetztAus(ctx.env), zeile = (((await sp.hostsVon(inst.id)) || []).find((x) => x.host === host));
  if (!zeile) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
  const cf = cloudflareDienst(k, ctx.env), lokal = lokalHost(k, host);
  const basisLokal = lokal && ctx.url && ctx.url.port ? 'http://' + host + ':' + ctx.url.port : '';
  const [p, dns, dnsWww, api] = await Promise.all([
    ping(k, ctx.env, host, basisLokal),
    lokal ? Promise.resolve({ ok: true, lokal: true }) : dohFrage(host),
    lokal ? Promise.resolve({ ok: true, lokal: true }) : dohFrage('www.' + host),
    cf && !lokal ? apiStand(cf, host, zeile.registrar || {}) : Promise.resolve(null)
  ]);
  const id8 = String(inst.id).replace(/-/g, '').slice(0, 8), pingOk = p.ok && p.instanz === id8;
  if (p.ok && !pingOk) p.fehler = 'Unter dieser Domain antwortet eine andere Instanz (' + p.instanz + ').';
  const manuell = o.manuell ? iso(jetzt) : (zeile.pruefung || {}).manuell || null;
  const ok = pingOk || (!!api && api.ok && dns.ok) || (!!manuell && dns.ok);
  const fehler = [!pingOk ? 'Antwort der Instanz: ' + (p.fehler || 'fehlt') : '', !dns.ok ? 'DNS ' + host + ': ' + (dns.fehler || 'fehlt') : '', !dnsWww.ok ? 'DNS www.' + host + ': ' + (dnsWww.fehler || 'fehlt') : '', api && !api.ok ? 'Cloudflare: ' + (api.fehler || 'unvollständig') : ''].filter(Boolean);
  const pruefung = { zeit: iso(jetzt), ok: ok, ping: { ok: pingOk, status: p.status || 0, fehler: pingOk ? '' : p.fehler || '' }, dns: dns, dnsWww: dnsWww, api: api, manuell: manuell, fehler: fehler, okSeit: ok ? (zeile.pruefung && zeile.pruefung.ok && zeile.pruefung.okSeit) || iso(jetzt) : null };
  const patch = { pruefung: pruefung };
  if (ok && zeile.haupt && zeile.status === 'einrichtung') patch.status = 'aktiv';
  await sp.hostAendern(host, patch);
  return Object.assign({ host: host }, pruefung);
}

export async function domainLoesen(ctx, inst, host) {
  const sp = ctx.sp, zeile = ((await sp.hostsVon(inst.id)) || []).find((x) => x.host === host);
  if (!zeile) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
  const cf = cloudflareDienst(ctx.k, ctx.env), reg = Object.assign({}, zeile.registrar || {}), out = { ok: true, geloest: [], autoRenew: null, hinweise: [] };
  if (!cf) { out.hinweise.push('Ohne CF_API_TOKEN bitte im Dashboard lösen: Workers & Pages → ' + WORKER + ' → Domains & Routes → ' + host + ' und www.' + host + ' entfernen; Auto-Verlängerung nach Vertrag ausschalten.'); return out; }
  for (const n of [host, 'www.' + host]) for (const d of (await cf.domains(n)).filter((x) => x.service === WORKER)) { await cf.domainLoesen(d.id); out.geloest.push(n); }
  if (reg.anbieter === 'cloudflare' || !reg.anbieter) {
    try { const r = await cf.registrar(apexVon(host)); if (r) { await cf.autoRenew(apexVon(host), false); out.autoRenew = false; } } catch (e) { out.hinweise.push('Auto-Verlängerung ließ sich nicht ausschalten (' + String(e.message || e).slice(0, 100) + '); bitte im Dashboard unter Domain Registration.'); }
  }
  await sp.hostAendern(host, { registrar: Object.assign(reg, { geloest: iso(jetztAus(ctx.env)), autoRenew: out.autoRenew === false ? false : reg.autoRenew, domain_ids: {} }) });
  return out;
}

/* ---------- Täglicher Lauf ---------- */
async function inhaberHinweis(k, sp, betrieb, text, daten, betreff) {
  try { if (sp.protokollSchreiben) await sp.protokollSchreiben({ art: 'instanz_domain', betrieb: betrieb || null, text: String(text).slice(0, 300), daten: daten || {} }); } catch (e) { /* weiter */ }
  const pd = postDienst(k); if (!pd || !pd.kontakt) return false;
  try { return await pd.senden({ an: pd.kontakt, betreff: betreff || 'Hinweis zu einer Domain', html: mailRahmen(betreff || 'Hinweis zu einer Domain', '<p style="margin:0 0 12px">' + esc(text) + '</p>', '') }); } catch (e) { return false; }
}
export async function instanzenPruefen(k, sp, env) {
  if (!sp || !sp.instanzenAlle || !sp.hostsVon) return { ok: true, leer: true };
  const alle = await sp.instanzenAlle().catch(() => undefined);
  if (!Array.isArray(alle)) return { ok: true, ohneTabelle: true };
  const cf = cloudflareDienst(k, env), jetzt = jetztAus(env), F = R().FRISTEN;
  const ctx = { k: k, env: env || {}, sp: sp, url: null };
  const n = { geprueft: 0, rot: 0, gewarnt: 0, geloest: 0, fehler: 0 };
  for (const inst of alle.slice(0, 300)) {
    try {
      const hosts = (await sp.hostsVon(inst.id)) || [];
      if (inst.status === 'beendet') {
        for (const h of hosts) {
          const reg = h.registrar || {};
          if (reg.geloest || !(reg.domain_ids && (reg.domain_ids.apex || reg.domain_ids.www)) || !cf) continue;
          await domainLoesen(ctx, inst, h.host); n.geloest++;
        }
        continue;
      }
      const haupt = hosts.find((h) => h.haupt); if (!haupt) continue;
      const vorher = haupt.pruefung || {};
      const p = await domainPruefen(ctx, inst, haupt.host); n.geprueft++;
      if (!p.ok) n.rot++;
      if (!p.ok && vorher.ok && inst.status === 'aktiv') await inhaberHinweis(k, sp, inst.betrieb, 'Die Domain ' + haupt.host + ' (Instanz ' + inst.slug + ') antwortet nicht mehr: ' + p.fehler.join('; '), { instanz: inst.id, host: haupt.host }, 'Domain antwortet nicht: ' + haupt.host);
      /* Registrar: Ablauf lesen (Cloudflare) bzw. von Hand eingetragenes Datum; Warnung FRISTEN.domainWarnTage vorher, einmal je Ablauf */
      let reg = Object.assign({}, haupt.registrar || {});
      if (cf && !lokalHost(k, haupt.host) && reg.anbieter !== 'extern') { const r = await registrarLesen(cf, haupt.host).catch(() => null); if (r) { reg = Object.assign(reg, r); await sp.hostAendern(haupt.host, { registrar: reg }); } }
      const ablauf = Date.parse(reg.ablauf || '');
      if (!isNaN(ablauf) && ablauf - jetzt < F.domainWarnTage * TAG && !(reg.autoRenew && reg.anbieter === 'cloudflare') && reg.gewarnt !== reg.ablauf) {
        await inhaberHinweis(k, sp, inst.betrieb, 'Die Domain ' + haupt.host + ' (Instanz ' + inst.slug + ') läuft am ' + datumText(reg.ablauf) + ' ab' + (reg.anbieter === 'cloudflare' ? ' und verlängert sich nicht selbst.' : '. Sie liegt bei einem anderen Anbieter: bitte dort verlängern.'), { instanz: inst.id, host: haupt.host, ablauf: reg.ablauf }, 'Domain läuft ab: ' + haupt.host);
        await sp.hostAendern(haupt.host, { registrar: Object.assign(reg, { gewarnt: reg.ablauf }) });
        n.gewarnt++;
      }
    } catch (e) { n.fehler++; console.log('Domain-Prüfung fehlgeschlagen', inst && inst.slug, String(e && e.message ? e.message : e).slice(0, 160)); }
  }
  return Object.assign({ ok: !n.fehler, cloudflare: !!cf }, n);
}

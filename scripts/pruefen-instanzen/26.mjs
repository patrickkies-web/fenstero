// eeziframes · Prüfabschnitt 26: Zentrale, Bestellungen und Instanzen (Strang C, Bauplan §3 C; docs/INSTANZEN.md)
// Teil A läuft im Prozess über worker.fetch mit echten Hosts (eeziframes.com für Kundenkonto und Zentrale, Domains der Instanzen) gegen
// die Speicher-Attrappe und ein nachgestelltes Cloudflare (scripts/cloudflare-attrappe.mjs):
//   26.1 Bestellung mit Aufgabe, Zahl in der Navigation, Hauptknopf-Folge und „was fehlt“ · 26.2 Instanz anlegen (idempotent, Platzhalter,
//   Bestätigungsmails), Domain-Fehler · 26.3 Domain mit Cloudflare (Zone, Nameserver, störende Einträge, Custom Domain für Domain und www,
//   Mail-Schutz, Prüfung grün), ohne Token Anleitung, mit zweitem Faktor ohne frischen Code 403 · 26.4 Gestaltung: Bild im Entwurf,
//   Veröffentlichen erhöht die Fassung, /marke/<v>/logo.png liefert ein Bild · 26.5 Ampel sperrt Live bei jeder fehlenden Bedingung,
//   mit allem Abo und aktiv · 26.6 Pausieren, Fortsetzen, Beenden; Paketwechsel Essential → Plus → Signature ändert /config.js ·
//   26.7 Zugänge · 26.8 Testanfrage, Versandliste, erneut senden · 26.9 Aufräumen schont Partner, Zugänge, Entwürfe; Löschschutz ·
//   26.10 Übersicht und KPI · 26.11 Domain-Ablaufwarnung, Lösen bei „beendet“ · 26.12 Rückrufe und Nachrichten
// Teil B im Browser gegen den Testserver der Instanzen (h): eine Plus-Bestellung von „bezahlt“ bis „live“ in höchstens 20 Klicks,
//   SVG-Logo aus der Bestellung als PNG, Schriftrollen, Zielgrößen und Telefonbreite der neuen Seiten.
import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const titel = 'Zentrale: Bestellungen und Instanzen';

/* kleines PNG (einfarbig) für die Bildablage */
function png(w, h, rgb) {
  const crc = (b) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
  const block = (typ, daten) => { const l = Buffer.alloc(4); l.writeUInt32BE(daten.length); const t = Buffer.concat([Buffer.from(typ), daten]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(t)); return Buffer.concat([l, t, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const zeile = Buffer.concat([Buffer.from([0]), Buffer.from(new Array(w).fill(rgb).flat())]), roh = Buffer.concat(new Array(h).fill(zeile));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), block('IHDR', ihdr), block('IDAT', zlib.deflateSync(roh)), block('IEND', Buffer.alloc(0))]);
}
const SVG_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect x="4" y="4" width="72" height="72" rx="14" fill="#2f6f4f"/><text x="92" y="54" font-family="Arial" font-size="40" font-weight="700" fill="#161616">Brandt</text></svg>';

export default async (h) => {
  await teilA(h);
  await teilB(h);
};

/* ===================================== Teil A: im Prozess ===================================== */
async function teilA(h) {
  const WZ = h.WURZEL, ok = (b, t) => h.ok(b, t);
  const imp = (rel) => import(pathToFileURL(path.join(WZ, rel)).href);
  await imp('web/assets/pakete.js'); await imp('web/assets/instanzregeln.js');
  const worker = (await imp('worker.js')).default, post = await imp('functions/api/post.js'), spM = await imp('functions/api/speicher.js'), umg = await imp('functions/api/umgebung.js');
  const recht = await imp('functions/api/recht.js'), ze = await imp('functions/api/zentrale.js'), cfM = await imp('functions/api/cloudflare.js'), V = await imp('functions/instanz/verwalten.js');
  const { cloudflareNachstellen } = await imp('scripts/cloudflare-attrappe.mjs');
  const WEB = path.join(WZ, 'web');
  const ASSETS = { fetch: async (r) => { const u = new URL(typeof r === 'string' ? r : r.url); let p = path.join(WEB, decodeURIComponent(u.pathname)); try { if (fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); } catch (e) { return new Response('', { status: 404 }); } if (!fs.existsSync(p)) return new Response('', { status: 404 }); return new Response(fs.readFileSync(p), { status: 200, headers: { 'content-type': /\.html$/.test(p) ? 'text/html; charset=utf-8' : 'application/octet-stream' } }); } };
  const PW = 'pruef-zentrale-26-instanzen', TOTP = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
  let ENV = null;
  const cf = cloudflareNachstellen({ vergeben: ['brandt-fenster.de'], ping: (url) => worker.fetch(new Request(url), ENV, { waitUntil() {}, passThroughOnException() {} }) });
  ENV = { DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW, FREISCHALT_GEHEIMNIS: 'pruef26', INSTANZ_CACHE_MS: '0', CF_API_TOKEN: cf.token, CF_ACCOUNT_ID: cf.konto, ASSETS: ASSETS };
  const OHNE_CF = Object.assign({}, ENV, { CF_API_TOKEN: '', CF_ACCOUNT_ID: '' }), MIT_2FA = Object.assign({}, ENV, { ZENTRALE_2FA: TOTP });
  const sp = spM.speicher(umg.konfig(ENV)), stempel = Date.now().toString(36).slice(-5);
  try {
    let ipN = 0;
    function klient(basis, env0) {
      const c = { cookies: {}, offen: [], ip: '10.26.' + (++ipN % 250) + '.' + (1 + Math.floor(Math.random() * 250)), env: env0 || ENV };
      c.rufe = async (pfad, body, x) => {
        x = x || {};
        const ck = Object.entries(c.cookies).map(([n, v]) => n + '=' + v).join('; ');
        const kopf = Object.assign({ accept: 'application/json', origin: basis, 'x-forwarded-for': c.ip }, body != null ? { 'content-type': 'application/json' } : {}, ck ? { cookie: ck } : {}, x.headers || {});
        const r = await worker.fetch(new Request(basis + pfad, { method: x.method || (body != null ? 'POST' : 'GET'), headers: kopf, body: body != null ? JSON.stringify(body) : undefined, redirect: 'manual' }), x.env || c.env, { waitUntil: (p) => c.offen.push(Promise.resolve(p).catch(() => false)), passThroughOnException() {} });
        (r.headers.getSetCookie ? r.headers.getSetCookie() : []).forEach((s) => { const nv = s.split(';')[0], i = nv.indexOf('='); const n = nv.slice(0, i), v = nv.slice(i + 1); if (v) c.cookies[n] = v; else delete c.cookies[n]; });
        const buf = Buffer.from(await r.arrayBuffer()), text = buf.toString('utf8'); let j = {}; try { j = JSON.parse(text); } catch (e) { j = {}; }
        while (c.offen.length) await Promise.all(c.offen.splice(0));
        return { status: r.status, j: j, text: text, buf: buf, headers: r.headers };
      };
      return c;
    }
    const idNr = (m) => Number(String(m.id).split('-').pop()) || 0;
    const marke = () => post.attrappePost.reduce((x, m) => Math.max(x, idNr(m)), 0);
    const mailsAn = (an, re, seit) => post.attrappePost.filter((m) => idNr(m) > (seit || 0) && (Array.isArray(m.an) ? m.an.includes(an) : m.an === an) && (!re || re.test(m.betreff)));
    const GEHEIM = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
    const zugestellt = async (mailId) => { const body = JSON.stringify({ type: 'email.delivered', data: { email_id: mailId } }), id = 'msg_' + crypto.randomUUID(), ts = String(Math.floor(Date.now() / 1000)); const sig = 'v1,' + crypto.createHmac('sha256', Buffer.from(GEHEIM.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64'); return worker.fetch(new Request('https://eeziframes.com/api/post/webhook', { method: 'POST', headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': sig }, body: body }), ENV, { waitUntil() {}, passThroughOnException() {} }); };
    const bestaetigen = async (mail, seit) => { const m = mailsAn(mail, /bestätigen/i, seit).pop(); const l = m && /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/.exec(m.html || ''); if (!l) return 0; const u = new URL(l[1].replace(/&amp;/g, '&')); return (await klient('https://eeziframes.com').rufe(u.pathname + u.search, null, { headers: { accept: 'text/html' } })).status; };

    /* Zentrale anmelden (mit zweitem Faktor: Code aus dem Testschlüssel) */
    async function zentrale(env) {
      const z = klient('https://eeziframes.com', env || ENV); ze.codesVergessen();
      const code = env && env.ZENTRALE_2FA ? await ze.totpCode(env.ZENTRALE_2FA, Math.floor(Date.now() / 30000)) : '';
      const a = await z.rufe('/api/zentrale/anmelden', { passwort: PW, code: code });
      if (a.status !== 200) throw new Error('Zentrale: Anmeldung ' + a.status + ' ' + a.text);
      z.api = (pfad, body, x) => z.rufe(pfad, body, Object.assign({}, x || {}, { headers: Object.assign({ 'x-zentrale': '1' }, (x || {}).headers || {}) }));
      return z;
    }
    /* Bestellung im Kundenkonto bis „bezahlt“ (Attrappe der Zahlung) */
    async function bestellen(mail, paket, firma, k) {
      const pa = klient('https://eeziframes.com');
      await pa.rufe('/api/partner/anmelden', { mail: mail }); await pa.rufe('/api/partner/bestaetigen', { mail: mail, code: '123456' });
      await pa.rufe('/api/partner/firma', { firma: firma, rechtsform: 'GmbH', strasse: 'Lindenweg 4', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'brandt-fenster.de', ap: 'Jens Brandt', rolle: 'Geschäftsführer', tel: '0221 123456', vertretung: 'Jens Brandt (Geschäftsführer)', register: 'Amtsgericht Köln, HRB 1234', erreichbar: { tage: ['mo', 'di', 'mi', 'do', 'fr'], von: '08:00', bis: '18:00', kanal: 'telefon' } });
      const b0 = (await pa.rufe('/api/partner/bestellungen', { paket: paket, konfigurator: k })).j.bestellung;
      if (P().PAKETE[paket].logo) await pa.rufe('/api/partner/bestellungen/' + b0.id, { gestaltung: { farben: ['#2f6f4f'], titel: 'Fenster von Brandt', begruessung: 'Willkommen bei Brandt', notiz: 'Logo ist angehängt' } }, { method: 'PATCH' });
      const ka = await pa.rufe('/api/partner/bestellungen/' + b0.id + '/kasse', { zustimmung: { unternehmer: true, agb: recht.PAKET_STAND, avv: true } });
      const sid = new URL(ka.j.url).searchParams.get('kasse');
      await pa.rufe('/api/partner/bestellungen/' + b0.id + '/kasse/pruefen?session=' + sid);
      return { pa: pa, b: await sp.bestellungHolen(b0.id) };
    }
    const P = () => globalThis.Pakete;

    /* ---------- 26.1 Bestellung, Aufgabe, Hauptknopf ---------- */
    const z = await zentrale();
    const MAIL = 'brandt26-' + stempel + '@fenster26.example', EIN = 'anfragen-' + stempel + '@brandt26.example', HOST = 'brandt-' + stempel + '.app';
    const { pa, b: b0 } = await bestellen(MAIL, 'plus', 'Fensterbau Brandt ' + stempel + ' GmbH', { name: 'Brandt Fenster ' + stempel, domains: [HOST], eingang: [EIN] });
    const auf0 = await z.api('/api/zentrale/aufgaben'), liste0 = await z.api('/api/zentrale/bestellungen?filter=alle'), d0 = await z.api('/api/zentrale/bestellungen/' + b0.id);
    const zeile0 = (liste0.j.bestellungen || []).find((x) => x.id === b0.id) || {};
    ok(b0.status === 'bezahlt' && auf0.status === 200 && auf0.j.anzahl >= 1 && auf0.j.liste.some((x) => x.ziel === 'bestellung/' + b0.id && /Einrichtung beginnen/.test(x.text)) && zeile0.handeln && zeile0.schritt === 'Einrichtung beginnen' && d0.j.bestellung.schritt.aktion === 'einrichtung',
      '26.1 bezahlte Bestellung: Aufgabe „Einrichtung beginnen“ mit Zahl für die Navigation, in der Liste unter „Zu tun“, Hauptknopf Einrichtung beginnen');
    const frei1 = await z.api('/api/zentrale/bestellungen/' + b0.id + '/domains/frei', {}), frei2 = await z.api('/api/zentrale/bestellungen/' + b0.id + '/domains/frei', { host: 'https://www.Brandt-Fenster.de/kontakt' });
    ok(frei1.status === 200 && frei1.j.domains.length === 1 && frei1.j.domains[0].host === HOST && frei1.j.domains[0].frei === true && /wahrscheinlich frei/.test(frei1.j.domains[0].text) && frei2.j.domains[0].host === 'brandt-fenster.de' && frei2.j.domains[0].frei === false,
      '26.1 Wunsch-Domain „wahrscheinlich frei“ (DNS kennt sie nicht), eine vergebene Domain „vergeben“, Eingabe normalisiert');
    const folge = [d0.j.bestellung.schritt.aktion];
    const s1 = await z.api('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'einrichtung' }); folge.push(s1.j.bestellung.schritt.aktion);
    const nochmal = await z.api('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'einrichtung' });
    ok(s1.status === 200 && folge[1] === 'instanz' && nochmal.status === 409 && mailsAn(MAIL, /Wir richten Ihren Konfigurator ein/).length === 1, '26.1 Einrichtung beginnen: Status „In Einrichtung“, Mail an den Partner, nächster Schritt „Instanz anlegen“; zweimal: 409');

    /* ---------- 26.2 Instanz anlegen ---------- */
    const m0 = marke();
    const [i1, i2] = await Promise.all([z.api('/api/zentrale/bestellungen/' + b0.id + '/instanz', {}), z.api('/api/zentrale/bestellungen/' + b0.id + '/instanz', {})]);
    const i3 = await z.api('/api/zentrale/bestellungen/' + b0.id + '/instanz', {});
    const iid = i1.j.instanz && i1.j.instanz.id, inst = iid ? await sp.instanzHolen(iid) : null, zeileB = inst ? await sp.betriebHolen(inst.betrieb) : null;
    const alleZurBestellung = ((await sp.instanzenAlle()) || []).filter((x) => x.bestellung === b0.id);
    ok(i1.status === 200 && i2.status === 200 && i3.j.schon === true && i2.j.instanz.id === iid && alleZurBestellung.length === 1 && (await sp.bestellungHolen(b0.id)).instanz === iid, '26.2 Instanz anlegen ist idempotent: zwei gleichzeitige Klicks und ein dritter ergeben genau eine Instanz an der Bestellung');
    ok(inst && inst.paket === 'plus' && inst.status === 'einrichtung' && /^i-[0-9a-f]{32}@instanz\.invalid$/.test(zeileB.mail) && zeileB.daten.konto === 'instanz' && inst.recht.firma === 'Fensterbau Brandt ' + stempel + ' GmbH' && inst.recht.vertretung && inst.entwurf.farbe === '#2f6f4f' && inst.entwurf.titel === 'Fenster von Brandt' && (zeileB.daten.einladung || {}).begruessung === 'Willkommen bei Brandt',
      '26.2 Instanz übernimmt Paket, Firma, Impressumsangaben, Farbe, Titel und Begrüßung; Betriebszeile mit Platzhalter auf .invalid');
    ok(mailsAn(EIN, /bestätigen/i, m0).length === 1, '26.2 genau eine Bestätigungsmail an die Eingangsadresse aus der Bestellung');
    const hFalsch = await z.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'kein host' }), hEezi = await z.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'kunde.eeziframes.com' });
    const demo = await z.api('/api/zentrale/instanzen', { paket: 'essential', name: 'Demo Essential ' + stempel, slug: 'demo26-' + stempel }), did = demo.j.instanz && demo.j.instanz.id;
    await z.api('/api/zentrale/instanzen/' + did + '/host', { host: 'demo26-' + stempel + '.localhost' });
    const hDoppelt = await z.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'demo26-' + stempel + '.localhost' });
    ok(hFalsch.status === 400 && hEezi.status === 400 && /eeziframes/.test(hEezi.j.fehler) && hDoppelt.status === 409 && demo.status === 200 && demo.j.instanz.demo && demo.j.instanz.marke.v === 1, '26.2 Domain: falsches Format 400, eeziframes-Host 400, schon vergeben 409; Demo ohne Bestellung angelegt (Essential sofort mit Namen veröffentlicht)');

    /* ---------- 26.3 Domain mit Cloudflare ---------- */
    const hOk = await z.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'HTTPS://www.' + HOST.toUpperCase() + '/pfad' });
    const vOhneZone = await z.api('/api/zentrale/instanzen/' + iid + '/domain/verbinden', { host: HOST });
    const zone = await z.api('/api/zentrale/instanzen/' + iid + '/domain/zone', { host: HOST });
    const vPending = await z.api('/api/zentrale/instanzen/' + iid + '/domain/verbinden', { host: HOST });
    cf.aktivieren(HOST); cf.dns(HOST, { type: 'A', content: '192.0.2.10' }); cf.dns('www.' + HOST, { type: 'CNAME', content: 'alt.example' });
    const vKonflikt = await z.api('/api/zentrale/instanzen/' + iid + '/domain/verbinden', { host: HOST });
    const vOk = await z.api('/api/zentrale/instanzen/' + iid + '/domain/verbinden', { host: HOST, stoerendeLoeschen: true });
    const zoneId = (zone.j.ergebnis || {}).zone && zone.j.ergebnis.zone.id, recs = cf.db.dns.filter((r) => r.zone_id === zoneId);
    ok(hOk.status === 200 && hOk.j.instanz.haupthost === HOST && vOhneZone.j.ergebnis.schritt === 'zone' && zone.j.ergebnis.neu && zone.j.ergebnis.zone.nameserver.length === 2 && vPending.j.ergebnis.schritt === 'nameserver', '26.3 Domain normalisiert (https, www, Großschreibung); ohne Zone „Zone anlegen“, danach die zwei Nameserver und Warten');
    ok(vKonflikt.j.ergebnis.schritt === 'konflikte' && vKonflikt.j.ergebnis.konflikte.length === 2 && vOk.j.ergebnis.ok && cf.db.domains.filter((d) => d.hostname === HOST || d.hostname === 'www.' + HOST).length === 2 && !recs.some((r) => r.type === 'A' && r.content === '192.0.2.10') && !recs.some((r) => r.type === 'CNAME'),
      '26.3 störende A/CNAME-Einträge werden gemeldet und erst auf Wunsch gelöscht; Custom Domain für Domain und www am Worker fenstero');
    ok(recs.some((r) => r.type === 'MX' && r.content === '.' && Number(r.priority) === 0) && recs.some((r) => r.type === 'TXT' && r.name === HOST && r.content === 'v=spf1 -all') && recs.some((r) => r.type === 'TXT' && r.name === '_dmarc.' + HOST && /p=reject/.test(r.content)) && cf.db.domains.every((d) => d.service === 'fenstero'),
      '26.3 Mail-Schutz: MX 0 ., SPF -all, DMARC reject');
    const pr = vOk.j.pruefung || {};
    ok(pr.ok && pr.ping.ok && pr.dns.ok && pr.dnsWww.ok && pr.api && pr.api.ok && vOk.j.instanz.hosts[0].status === 'aktiv' && cf.log.some((e) => e.pfad === 'ping') && cf.log.filter((e) => e.pfad !== 'ping' && e.pfad !== 'dns-query').every((e) => e.schluessel), '26.3 Prüfung serverseitig grün: Antwort der Instanz mit ihrer id8, DNS für Domain und www, Custom Domain und Zertifikat laut API');
    const zOhne = await zentrale(OHNE_CF), sOhne = await zOhne.api('/api/zentrale/instanzen/' + iid), vOhne = await zOhne.api('/api/zentrale/instanzen/' + iid + '/domain/verbinden', { host: HOST });
    ok(sOhne.j.instanz.cloudflare === false && sOhne.j.instanz.anleitung.length >= 5 && /Custom Domain/.test(JSON.stringify(sOhne.j.instanz.anleitung)) && vOhne.status === 409 && vOhne.j.anleitung, '26.3 ohne CF_API_TOKEN: Klick-Anleitung aus dem Bauplan, Verbinden verweist darauf (409)');
    const z2 = await zentrale(MIT_2FA), ohneCode = await z2.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'zweit-' + HOST });
    ze.codesVergessen(); const falschCode = await z2.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'zweit-' + HOST, code: '000000' });
    ze.codesVergessen(); const mitCode = await z2.api('/api/zentrale/instanzen/' + iid + '/host', { host: 'zweit-' + HOST, code: await ze.totpCode(TOTP, Math.floor(Date.now() / 30000)) });
    ok(ohneCode.status === 403 && ohneCode.j.code === true && falschCode.status === 401 && mitCode.status === 200 && mitCode.j.instanz.hosts.some((x) => x.host === 'zweit-' + HOST && !x.haupt), '26.3 mit zweitem Faktor: Domain-Aktion ohne Code 403, falscher Code 401, frischer Code 200 (weitere Domain leitet um)');
    await z.api('/api/zentrale/instanzen/' + iid + '/host/entfernen', { host: 'zweit-' + HOST });

    /* ---------- 26.4 Gestaltung ---------- */
    const bild = png(60, 30, [47, 111, 79]).toString('base64');
    const g1 = await z.api('/api/zentrale/instanzen/' + iid + '/bild', { name: 'logo.png', daten: bild }), g2 = await z.api('/api/zentrale/instanzen/' + iid + '/bild', { name: 'start-1.jpg', daten: bild });
    const gZuViel = await z.api('/api/zentrale/instanzen/' + iid + '/bild', { name: 'start-7.jpg', daten: bild }), gSvg = await z.api('/api/zentrale/instanzen/' + iid + '/bild', { name: 'logo.png', daten: Buffer.from(SVG_LOGO).toString('base64') });
    const e1 = await z.api('/api/zentrale/instanzen/' + iid + '/entwurf', { entwurf: { name: 'Brandt Fenster', titel: 'Fenster planen bei Brandt', farbe: '#2f6f4f', start: { kicker: 'Fenster aus Köln', ueberschrift: 'Ihre neuen Fenster.', text: 'Planen Sie in Ruhe.' } } });
    const eSchlecht = await z.api('/api/zentrale/instanzen/' + iid + '/entwurf', { entwurf: { farbe: 'grün' } });
    const vor = (await sp.instanzHolen(iid)).marke.v || 0, pub = await z.api('/api/zentrale/instanzen/' + iid + '/veroeffentlichen', {}), v1 = pub.j.v;
    const logoR = await klient('https://' + HOST).rufe('/marke/' + v1 + '/logo.png', null, { headers: { accept: 'image/png' } });
    ok(g1.status === 200 && g2.status === 200 && g1.j.instanz.entwurf.bilder.logo === 'logo.png' && gZuViel.status === 400 && gSvg.status === 400 && e1.status === 200 && eSchlecht.status === 400 && v1 === vor + 1 && logoR.status === 200 && logoR.buf.slice(1, 4).toString() === 'PNG' && /image\/png/.test(logoR.headers.get('content-type')),
      '26.4 Gestaltung: Bilder im Entwurf (Logo, Foto; mehr Fotos als das Paket und SVG direkt: 400), Farbe nur als Hex, Veröffentlichen erhöht die Fassung, /marke/<v>/logo.png liefert das PNG');
    const sG = (await z.api('/api/zentrale/instanzen/' + iid)).j.instanz;
    ok(sG.ampel.punkte.find((p) => p.id === 'gestaltung').ok && sG.marke.start.ueberschrift === 'Ihre neuen Fenster.' && sG.marke.bilder.start.includes('start-1.jpg'), '26.4 veröffentlichte Marke trägt Startansicht und Fotos; Ampel „Gestaltung veröffentlicht“ grün');

    /* ---------- 26.5 Ampel und Live ---------- */
    const live0 = await z.api('/api/zentrale/bestellungen/' + b0.id + '/live', { vermerk: 'Freigabe telefonisch am Donnerstag' });
    const amp0 = (await z.api('/api/zentrale/bestellungen/' + b0.id)).j.bestellung;
    ok(live0.status === 409 && /Zur Freigabe/.test(live0.j.fehler) && amp0.schritt.aktion === 'domain-gesichert', '26.5 Live aus „In Einrichtung“: 409; nächster Schritt „Domain gesichert“ (Domain grün)');
    await z.api('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'domain' });
    const sV = await z.api('/api/zentrale/bestellungen/' + b0.id + '/vorschau', {}), bV = sV.j.bestellung;
    ok(sV.status === 200 && bV.status === 'freigabe' && new RegExp('^https://' + HOST.replace(/\./g, '\\.') + '/\\?vorschau=').test(sV.j.link) && bV.vorschau.version === v1 && mailsAn(MAIL, /Freigabe/).length >= 1, '26.5 Vorschau senden: Link auf die Domain (30 Tage), Fassung = veröffentlichte, Status „Zur Freigabe“, Mail an den Partner');
    const fehltVon = async (vermerk) => { const r = await z.api('/api/zentrale/bestellungen/' + b0.id + '/live', { vermerk: vermerk || '' }); return { status: r.status, fehlt: r.j.fehlt || [] }; };
    const f1 = await fehltVon('');
    ok(f1.status === 409 && ['eingang', 'test', 'freigabe'].every((x) => f1.fehlt.includes(x)) && !f1.fehlt.includes('domain') && !f1.fehlt.includes('gestaltung'), '26.5 Ampel sperrt: Eingangsadresse unbestätigt, keine Testanfrage, keine Freigabe (' + f1.fehlt.join(', ') + ')');
    const tVorher = await z.api('/api/zentrale/instanzen/' + iid + '/test', {});
    const bst = await bestaetigen(EIN, m0);
    const t1 = await z.api('/api/zentrale/instanzen/' + iid + '/test', {}), testCode = t1.j.test && t1.j.test.code;
    const testMail = mailsAn(EIN, /^\[Test\]/).pop();
    const f2 = await fehltVon('');
    ok(tVorher.status === 409 && bst === 200 && t1.status === 200 && testMail && (testMail.anhaenge || []).some((a) => a.typ === 'application/pdf') && f2.fehlt.includes('test') && !f2.fehlt.includes('eingang'), '26.5 Testanfrage erst nach bestätigter Adresse; sie kommt mit „[Test]“ und PDF an; bis zur Zustellung bleibt die Ampel rot');
    await zugestellt((await sp.anfrageHolen(testCode)).versand.id);
    const f3 = await fehltVon('kurz');
    await sp.instanzAendern(iid, (x) => { x.recht = Object.assign({}, x.recht, { mail: '' }); });
    const f4 = await fehltVon('Freigabe telefonisch am Donnerstag');
    await z.api('/api/zentrale/instanzen/' + iid + '/recht', { recht: { mail: 'info@brandt26.example' } });
    ok(f3.status === 409 && f3.fehlt.length === 1 && f3.fehlt[0] === 'freigabe' && f4.status === 409 && f4.fehlt.length === 1 && f4.fehlt[0] === 'recht', '26.5 zugestellt (Resend-Webhook): nur noch die Freigabe fehlt (Vermerk zu kurz); fehlt die E-Mail im Impressum, sperrt „Rechtsangaben“ trotz Vermerk');
    const fr = await pa.rufe('/api/partner/bestellungen/' + b0.id + '/freigabe', { aktion: 'freigeben', version: v1 });
    const mL = marke(), live = await z.api('/api/zentrale/bestellungen/' + b0.id + '/live', {});
    const bL = await sp.bestellungHolen(b0.id), iL = await sp.instanzHolen(iid), seite = await klient('https://' + HOST).rufe('/', null, { headers: { accept: 'text/html' } }), liveMail = mailsAn(MAIL, /live/i, mL).pop();
    ok(fr.status === 200 && live.status === 200 && bL.status === 'live' && bL.abo_status === 'aktiv' && bL.abo.id && iL.status === 'aktiv' && seite.status === 200 && liveMail && /Fenster online planen und anfragen/.test(liveMail.html) && live.j.bestellung.schritt.aktion === '', '26.5 mit allem: Live schaltet das Abo (Attrappe), die Instanz ist aktiv, die Seite antwortet, der Partner bekommt den Schnipsel für seine Website');

    /* ---------- 26.6 Pause, Fortsetzen, Beenden; Paketwechsel ---------- */
    const cfg = async (host) => { const r = await klient('https://' + host).rufe('/config.js'); const m = /window\.KONFIG = (\{.*\});/.exec(r.text); return { status: r.status, k: m ? JSON.parse(m[1]) : null }; };
    const DHOST = 'demo26-' + stempel + '.localhost', dk0 = (await z.api('/api/zentrale/instanzen/' + did)).j.instanz;
    const dPr = await z.api('/api/zentrale/instanzen/' + did + '/domain/pruefen', { host: DHOST }), dLive = await z.api('/api/zentrale/instanzen/' + did + '/live', {});
    const c0 = await cfg(DHOST), pw1 = await z.api('/api/zentrale/instanzen/' + did + '/paket', { paket: 'plus' }), c1 = await cfg(DHOST), pw2 = await z.api('/api/zentrale/instanzen/' + did + '/paket', { paket: 'signature' }), c2 = await cfg(DHOST);
    ok(dk0.status === 'einrichtung' && dPr.j.pruefung.ok && dLive.status === 200 && c0.k && c0.k.instanz.m.logo === false && c0.k.instanz.m.kennzeichnung === 'deutlich' && pw1.status === 200 && c1.k.instanz.m.logo === true && c1.k.instanz.m.dashboard === false && pw2.status === 200 && c2.k.instanz.m.dashboard === true && c2.k.instanz.m.kennzeichnung === 'keine',
      '26.6 Demo live ohne Bestellung; Paketwechsel Essential → Plus → Signature ändert /config.js sofort, ohne Code (Logo, Dashboard, Kennzeichnung)');
    const p1 = await z.api('/api/zentrale/instanzen/' + iid + '/status', { aktion: 'pausieren', grund: 'Urlaub des Betriebs', bis: new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10) });
    const iP = await sp.instanzHolen(iid), bP = await sp.bestellungHolen(b0.id), sP = await klient('https://' + HOST).rufe('/', null, { headers: { accept: 'text/html' } });
    const p2 = await z.api('/api/zentrale/instanzen/' + iid + '/status', { aktion: 'fortsetzen' }), iF = await sp.instanzHolen(iid), bF = await sp.bestellungHolen(b0.id), sF = await klient('https://' + HOST).rufe('/', null, { headers: { accept: 'text/html' } });
    const maxBis = Date.parse(iP.pause_seit) + 60 * 864e5;
    ok(p1.status === 200 && iP.status === 'pausiert' && bP.status === 'pausiert' && bP.abo_status === 'ausgesetzt' && Math.abs(Date.parse(iP.pause_bis) - maxBis) < 2 * 864e5 && sP.status === 503 && p2.status === 200 && iF.status === 'aktiv' && bF.status === 'live' && sF.status === 200,
      '26.6 Pausieren (Abo ausgesetzt, Seite 503, höchstens 60 Tage), Fortsetzen (wieder live, 200)');
    const kurz = await z.api('/api/zentrale/instanzen/' + did + '/status', { aktion: 'beenden', grund: 'kurz' });
    ok(kurz.status === 400, '26.6 Beenden verlangt einen Vermerk mit mindestens 10 Zeichen');

    /* ---------- 26.7 Zugänge (Signature) ---------- */
    const mz = marke(), za = await z.api('/api/zentrale/instanzen/' + did + '/zugang', { aktion: 'anlegen', mail: 'Team26-' + stempel + '@demo26.example', name: 'Team' });
    const zMail = mailsAn('team26-' + stempel + '@demo26.example', /Dashboard/i, mz);
    const zAus = await z.api('/api/zentrale/instanzen/' + did + '/zugang', { aktion: 'aus', mail: 'team26-' + stempel + '@demo26.example' });
    for (let n = 2; n <= 5; n++) await z.api('/api/zentrale/instanzen/' + did + '/zugang', { aktion: 'anlegen', mail: 'team' + n + '-' + stempel + '@demo26.example' });
    const zuViel = await z.api('/api/zentrale/instanzen/' + did + '/zugang', { aktion: 'anlegen', mail: 'team6-' + stempel + '@demo26.example' });
    const zDel = await z.api('/api/zentrale/instanzen/' + did + '/zugang', { aktion: 'loeschen', mail: 'team5-' + stempel + '@demo26.example' });
    const zEss = await z.api('/api/zentrale/instanzen/' + iid + '/zugang', { aktion: 'anlegen', mail: 'x@demo26.example' });
    ok(za.status === 200 && zMail.length === 1 && zAus.j.instanz.zugang.find((x) => x.mail === 'team26-' + stempel + '@demo26.example').aus === true && zuViel.status === 400 && zDel.j.instanz.zugang.length === 4 && zEss.status === 409,
      '26.7 Zugänge: anlegen mit Bestätigungsmail, ausschalten, höchstens 5 im Paket, löschen; ohne Dashboard (Plus) 409');

    /* ---------- 26.8 Testanfrage, Versandliste, erneut senden ---------- */
    const sVs = (await z.api('/api/zentrale/instanzen/' + iid)).j.instanz, zeileT = sVs.versand.find((x) => x.code === testCode);
    const mE = marke(), erneut = await z.api('/api/zentrale/instanzen/' + iid + '/anfragen/' + testCode + '/erneut', {}), fremd = await z.api('/api/zentrale/instanzen/' + did + '/anfragen/' + testCode + '/erneut', {});
    ok(zeileT && zeileT.art === 'test' && zeileT.status === 'zugestellt' && !('kunde' in zeileT) && erneut.status === 200 && mailsAn(EIN, /^\[Test\]/, mE).length === 1 && fremd.status === 404 && sVs.ampel.test.ok, '26.8 Versandliste mit Nummer und Stand ohne Kundendaten; erneut senden schickt genau eine Mail; Anfrage einer anderen Instanz 404');

    /* ---------- 26.9 Aufräumen, Löschschutz ---------- */
    const ALT = new Date(Date.now() - 40 * 864e5).toISOString(), uPartner = crypto.randomUUID(), uZugang = crypto.randomUUID(), uLeiche = crypto.randomUUID();
    await sp.partnerAnlegen({ auth_user: uPartner, mail: 'aufraeumen26-' + stempel + '@fenster26.example', firma: 'Aufräumen GmbH' });
    await sp.instanzAendern(did, (x) => { x.zugang = (x.zugang || []).map((y, j) => (j === 0 ? Object.assign({}, y, { uid: uZugang }) : y)); });
    const SB = 'https://pruef26.supabase.co', geloescht = [];
    const vorFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
      const s = String(url && url.url ? url.url : url);
      if (!s.startsWith(SB)) return vorFetch(url, init);
      const u = new URL(s), m = (init && init.method) || 'GET';
      if (u.pathname === '/auth/v1/admin/users' && m === 'GET') return new Response(JSON.stringify({ users: [uPartner, uZugang, uLeiche].map((id) => ({ id: id, email: id.slice(0, 6) + '@x.example', created_at: ALT, last_sign_in_at: ALT })) }), { status: 200, headers: { 'content-type': 'application/json' } });
      if (/^\/auth\/v1\/admin\/users\//.test(u.pathname) && m === 'DELETE') { geloescht.push(u.pathname.split('/').pop()); return new Response('{}', { status: 200 }); }
      if (/\/storage\/v1\/object\/list\//.test(u.pathname)) return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    };
    let aufR = null, anmListe = null, anmSchutz = null;
    try {
      const kSB = umg.konfig(Object.assign({}, ENV, { SUPABASE_URL: SB, SUPABASE_SECRET_KEY: 'sb_secret_pruef26', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_pruef26' }));
      aufR = await ze.aufraeumen(kSB, sp);
      const zctx = (pfad, body, params) => ({ k: kSB, env: ENV, sp: sp, request: new Request('https://eeziframes.com' + pfad, { method: body ? 'POST' : 'GET', headers: { cookie: Object.entries(z.cookies).map(([n, v]) => n + '=' + v).join('; '), 'x-zentrale': '1' } }), url: new URL('https://eeziframes.com' + pfad), body: body || null, params: params || {} });
      anmListe = await ze.ZENTRALE['GET /api/zentrale/anmeldungen'](zctx('/api/zentrale/anmeldungen'));
      anmSchutz = await ze.ZENTRALE['POST /api/zentrale/anmeldungen/:uid/loeschen'](zctx('/api/zentrale/anmeldungen/' + uPartner + '/loeschen', {}, { uid: uPartner })).then(() => 200, (e) => e.status);
    } finally { globalThis.fetch = vorFetch; }
    const listeIds = ((anmListe || {}).liste || []).map((x) => x.id);
    ok(aufR && aufR.ok && geloescht.length === 1 && geloescht[0] === uLeiche && !listeIds.includes(uPartner) && !listeIds.includes(uZugang) && listeIds.includes(uLeiche) && anmListe.pakete === 2 && anmSchutz === 409,
      '26.9 Aufräumen mit 40 Tage alten Anmeldungen: Partner und Dashboard-Zugang bleiben (auch nicht in „ohne Betrieb“, Löschen dort 409), die echte Leiche wird gelöscht');
    const sEnt = await klient('https://' + HOST).rufe('/api/instanz/start', {}), webCode = sEnt.j.code;
    await sp.entwurfAendern(webCode, '', (e) => { e.daten = { windows: [{ wid: 'w1', name: 'Fenster 1' }], proj: {} }; e.meta = Object.assign({}, e.meta, { aktuell: 1 }); return true; });
    const aufR2 = await ze.aufraeumen(umg.konfig(ENV), sp), loeschInst = await z.api('/api/zentrale/betriebe/' + inst.betrieb + '/loeschen', { bestaetigung: zeileB.name });
    ok(aufR2.ok && !!(await sp.entwurfHolen(webCode)) && !!(await sp.anfrageHolen(testCode)) && loeschInst.status === 409 && /Instanz/.test(loeschInst.j.fehler), '26.9 Zwischenstände der Website und Anfragen einer Instanz übersteht das Aufräumen; Betriebszeile einer Instanz unter „Betriebe“ nicht löschbar (409)');

    /* ---------- 26.10 Übersicht und KPI ---------- */
    const ue = await z.api('/api/zentrale/uebersicht?tage=30'), betr = await z.api('/api/zentrale/betriebe?tage=30'), rows = (await sp.betriebeAlle()) || [];
    const instZeilen = rows.filter((r) => r.daten && r.daten.konto === 'instanz').length, zeileI = (betr.j.betriebe || []).find((x) => x.id === inst.betrieb) || {};
    ok(ue.status === 200 && ue.j.pakete && ue.j.pakete.live >= 1 && ue.j.pakete.mrr >= 39 && ue.j.pakete.je.plus >= 1 && ue.j.aufgaben && Array.isArray(ue.j.aufgaben.liste) && ue.j.kpi.betriebe === rows.length - instZeilen && zeileI.instanz === iid && typeof ue.j.kpi.mrr === 'number',
      '26.10 Übersicht: Pakete live und MRR Pakete getrennt vom bisherigen MRR, Aufgabenliste; Instanzkonten zählen nicht als Betriebe und sind in der Liste markiert');

    /* ---------- 26.11 Ablaufwarnung, Lösen bei „beendet“ ---------- */
    const DH2 = 'ablauf26-' + stempel + '.app', d2 = await z.api('/api/zentrale/instanzen', { paket: 'essential', name: 'Ablauf ' + stempel, slug: 'ablauf26-' + stempel }), d2id = d2.j.instanz.id;
    cf.zone(DH2, { status: 'active', registrar: { expires_at: new Date(Date.now() + 20 * 864e5).toISOString(), auto_renew: false } });
    await z.api('/api/zentrale/instanzen/' + d2id + '/host', { host: DH2 });
    const v2 = await z.api('/api/zentrale/instanzen/' + d2id + '/domain/verbinden', { host: DH2 });
    const kontakt = umg.konfig(ENV).post.kontakt, mW = marke();
    const lauf1 = await cfM.instanzenPruefen(umg.konfig(ENV), sp, ENV), lauf2 = await cfM.instanzenPruefen(umg.konfig(ENV), sp, ENV);
    const warn = mailsAn(kontakt, /Domain läuft ab: /, mW);
    ok(v2.j.ergebnis.ok && lauf1.ok && warn.length === 1 && warn[0].betreff.includes(DH2) && lauf2.ok, '26.11 Ablaufwarnung 30 Tage vorher ohne Auto-Verlängerung: genau eine Mail an den Inhaber, auch nach einem zweiten Lauf');
    const ende = await z.api('/api/zentrale/instanzen/' + d2id + '/status', { aktion: 'beenden', grund: 'Demo wird nicht mehr gebraucht' });
    const lauf3 = await cfM.instanzenPruefen(umg.konfig(ENV), sp, ENV), h2 = ((await sp.hostsVon(d2id)) || [])[0] || {};
    ok(ende.status === 200 && lauf3.geloest >= 1 && !cf.db.domains.some((d) => d.hostname === DH2 || d.hostname === 'www.' + DH2) && cf.db.registrar.get(DH2).auto_renew === false && h2.registrar && h2.registrar.geloest, '26.11 beendet: der tägliche Lauf löst Domain und www vom Worker und schaltet die Auto-Verlängerung aus');

    /* ---------- 26.12 Rückrufe und Nachrichten ---------- */
    const pSicht = (await pa.rufe('/api/partner')).j, werktag = (() => { for (let i = 0; i < 10; i++) { const t = new Date(Date.now() + i * 864e5), w = t.getUTCDay(); if (w >= 1 && w <= 5) return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(t); } return ''; })();
    const rr = await pa.rufe('/api/partner/rueckruf', { tag: werktag, fenster: '10-12', tel: '0221 123456', thema: 'Domain', text: 'Bitte wegen der zweiten Domain', bestellung: b0.id });
    const ENVT = Object.assign({}, ENV, { JETZT: werktag + 'T10:30:00+02:00' });
    const lr = await z.api('/api/zentrale/bestellungen?filter=alle', null, { env: ENVT }), aR = await z.api('/api/zentrale/aufgaben', null, { env: ENVT });
    const rZ = (lr.j.rueckrufe || []).find((x) => x.id === rr.j.rueckruf.id) || {};
    const erl = await z.api('/api/zentrale/rueckrufe/' + rr.j.rueckruf.id, { notiz: 'Zweite Domain besprochen' }), offen = ((await sp.rueckrufeOffen()) || []).some((x) => x.id === rr.j.rueckruf.id);
    ok(pSicht.angemeldet && rr.status === 200 && rZ.faellig && rZ.firma && aR.j.liste.some((x) => x.gruppe === 'rueckruf' && /10–12 Uhr/.test(x.text)) && erl.status === 200 && !offen, '26.12 Rückruf des Partners: heute fällig in Liste und Aufgaben, „Erledigt“ mit Notiz nimmt ihn heraus');
    await pa.rufe('/api/partner/nachrichten', { text: 'Können wir noch eine Farbe ändern?', bestellung: b0.id });
    const aN = await z.api('/api/zentrale/aufgaben'), dN = await z.api('/api/zentrale/bestellungen/' + b0.id), gel = await z.api('/api/zentrale/bestellungen/' + b0.id + '/gelesen', {});
    const mN = marke(), an = await z.api('/api/zentrale/bestellungen/' + b0.id + '/nachricht', { text: 'Gern, schicken Sie uns die Farbe.' }), pN = (await pa.rufe('/api/partner/nachrichten')).j.nachrichten || [];
    ok(aN.j.liste.some((x) => x.gruppe === 'nachricht') && dN.j.bestellung.ungelesen >= 1 && gel.j.n === dN.j.bestellung.ungelesen && dN.j.bestellung.nachrichten.some((x) => x.art === 'text' && !x.gelesen) && an.status === 200 && an.j.mail && mailsAn(MAIL, /Neue Nachricht/, mN).length === 1 && pN.some((x) => x.von === 'inhaber' && /Farbe/.test(x.text)),
      '26.12 Nachricht des Partners: Aufgabe und Zähler, gelesen markieren; Antwort aus der Zentrale erscheint im Kundenkonto und kommt per E-Mail');

    /* Live-Beenden zuletzt: Abo endet, Seite 410 */
    const beenden = await z.api('/api/zentrale/instanzen/' + iid + '/status', { aktion: 'beenden', grund: 'Vertrag endet auf Wunsch' }), bE = await sp.bestellungHolen(b0.id), sE = await klient('https://' + HOST).rufe('/', null, { headers: { accept: 'text/html' } });
    ok(beenden.status === 200 && bE.status === 'beendet' && bE.abo_status === 'beendet' && (await sp.instanzHolen(iid)).status === 'beendet' && sE.status === 410, '26.6 Beenden mit Vermerk: Abo beendet, Bestellung und Instanz beendet, Seite 410');
  } catch (e) {
    ok(false, '26 Teil A ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { cf.aus(); }
}

/* ===================================== Teil B: im Browser ===================================== */
async function teilB(h) {
  const ok = (b, t) => h.ok(b, t);
  const stempel = Date.now().toString(36).slice(-5), MAIL = 'browser26-' + stempel + '@fenster26.example', EIN = 'eingang-b26-' + stempel + '@brandt26.example', HOST = 'brandt-b26-' + stempel + '.localhost';
  const cookieAus = (r) => (r.cookies || []).map((c) => c.split(';')[0]).filter((c) => !/=$/.test(c)).join('; ');
  let ctx = null;
  try {
    /* eigener Testserver: die Mails dieses Durchlaufs bleiben aus der Liste der übrigen Abschnitte (die Attrappe hält nur die letzten 50) */
    const srv = await h.server({});
    /* Bestellung im Kundenkonto des Testservers: Plus, SVG-Logo und ein Foto, bezahlt (Attrappe) */
    await srv.api('localhost', '/api/partner/anmelden', { body: { mail: MAIL }, origin: true });
    const an = await srv.api('localhost', '/api/partner/bestaetigen', { body: { mail: MAIL, code: '123456' }, origin: true }), ck = cookieAus(an);
    const pa = (pfad, body, m) => srv.api('localhost', pfad, { body: body, method: m, cookie: ck, origin: true });
    await pa('/api/partner/firma', { firma: 'Fensterbau Browser ' + stempel, rechtsform: 'GmbH', strasse: 'Lindenweg 4', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'brandt-fenster.de', ap: 'Jens Brandt', rolle: 'GF', tel: '0221 123456', vertretung: 'Jens Brandt', register: 'AG Köln HRB 1', erreichbar: { tage: ['mo', 'di', 'mi', 'do', 'fr'], von: '08:00', bis: '18:00', kanal: 'telefon' } });
    const b0 = (await pa('/api/partner/bestellungen', { paket: 'plus', konfigurator: { name: 'Brandt Browser', domains: [HOST.replace('.localhost', '.app')], eingang: [EIN] } })).json.bestellung;
    await pa('/api/partner/bestellungen/' + b0.id, { gestaltung: { farben: ['#2f6f4f'], titel: 'Fenster von Brandt', begruessung: 'Willkommen', notiz: '' } }, 'PATCH');
    const up1 = await pa('/api/partner/bestellungen/' + b0.id + '/datei', { art: 'logo', name: 'logo.svg', daten: Buffer.from(SVG_LOGO).toString('base64') });
    const up2 = await pa('/api/partner/bestellungen/' + b0.id + '/datei', { art: 'foto', name: 'werkstatt.png', daten: png(320, 200, [180, 140, 90]).toString('base64') });
    const ka = await pa('/api/partner/bestellungen/' + b0.id + '/kasse', { zustimmung: { unternehmer: true, agb: (await srv.api('localhost', '/api/partner/stand')).json.stand || (await import(new URL('../../functions/api/recht.js', import.meta.url).href)).PAKET_STAND, avv: true } });
    const sid = new URL(ka.json.url).searchParams.get('kasse'), kp = await pa('/api/partner/bestellungen/' + b0.id + '/kasse/pruefen?session=' + sid);
    ok(up1.status === 200 && up2.status === 200 && kp.json.status === 'bezahlt', '26 Browser: Plus-Bestellung mit SVG-Logo und Foto ist bezahlt');

    /* Zentrale im Browser: von „bezahlt“ bis „live“, Klicks gezählt */
    ctx = await h.browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
    const page = await h.neueSeite(ctx, srv.base('localhost')), B = srv.base('localhost');
    let klicks = 0;
    const klick = async (sel) => { klicks++; await page.click(sel); };
    const warteText = (re) => page.waitForFunction((q) => new RegExp(q).test(document.body.innerText), re.source, { timeout: 15000 });
    await page.goto(B + '/zentrale/#bestellungen', { waitUntil: 'networkidle' });
    await page.fill('#z-pw', h.PASSWORT); await klick('form[data-form="anmelden"] button[type="submit"]');
    await page.waitForSelector('.z-tab tbody tr');
    const badgeNav = await page.evaluate(() => { const z = document.querySelector('.z-nav a[href="#bestellungen"] .z-zahl'); return z ? Number(z.textContent) : 0; });
    await klick('a.z-zeile[href="#bestellung/' + b0.id + '"]'); await page.waitForSelector('.z-schritt [data-v="einrichtung"]');
    const leiste = await page.evaluate(() => Array.from(document.querySelectorAll('.z-leiste li')).map((x) => x.textContent + (x.getAttribute('aria-current') ? '*' : '')).join('|'));
    await klick('.z-schritt [data-v="einrichtung"]'); await page.waitForSelector('.z-schritt [data-v="instanz"]');
    await klick('.z-schritt [data-v="instanz"]'); await page.waitForSelector('.z-schritt [data-v="domain"]');
    await klick('.z-schritt [data-v="domain"]'); await page.waitForSelector('#z-host');
    await page.fill('#z-host', HOST); await klick('form[data-form="i-host"] button[type="submit"]'); await page.waitForSelector('[data-act="i-pruefen"]');
    await klick('[data-act="i-pruefen"]'); await warteText(/geprüft/);
    await klick('.z-reiter a[href$="/start"]'); await page.waitForSelector('.z-schritt [data-v="domain-gesichert"]');
    await klick('.z-schritt [data-v="domain-gesichert"]'); await page.waitForSelector('.z-schritt [data-v="gestaltung"]');
    await klick('.z-schritt [data-v="gestaltung"]'); await page.waitForSelector('[data-act="i-uebernehmen"][data-art="logo"]');
    await klick('[data-act="i-uebernehmen"][data-art="logo"]'); await page.waitForFunction(() => !!document.querySelector('.z-slot-bild.logo img'), null, { timeout: 15000 });
    await klick('[data-act="i-uebernehmen"][data-art="foto"]'); await page.waitForFunction(() => document.querySelectorAll('.z-slot-bild:not(.logo) img').length >= 1, null, { timeout: 15000 });
    const vorschauBild = await page.evaluate(() => { const t = document.querySelector('.z-telefon'); return !!t && !!t.querySelector('img[src^="blob:"]') && /--accent/.test(t.getAttribute('style') || ''); });
    await klick('[data-act="i-veroeffentlichen"]'); await warteText(/Veröffentlicht: Fassung/);
    /* Eingangsadresse bestätigen (Link aus der Mail, wie der Kunde) */
    const best = (await srv.post()).filter((m) => (Array.isArray(m.an) ? m.an : [m.an]).includes(EIN) && /bestätigen/i.test(m.betreff)).pop(), link = best && /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/.exec(best.html || '');
    const bl = link ? await srv.api('localhost', new URL(link[1].replace(/&amp;/g, '&')).pathname + new URL(link[1].replace(/&amp;/g, '&')).search, { headers: { accept: 'text/html' } }) : { status: 0 };
    await klick('.z-reiter a[href$="/betrieb"]'); await page.waitForSelector('[data-act="i-test"]');
    await klick('[data-act="i-test"]'); await warteText(/Testanfrage: /);
    const iid = await page.evaluate(() => location.hash.split('/')[1]);
    const zeilen = (await srv.attrappe()).anfragen || [], test = (Array.isArray(zeilen) ? zeilen : Object.values(zeilen)).filter((a) => a.instanz === iid && a.art === 'test').pop();
    const umg = await import(new URL('../../functions/api/umgebung.js', import.meta.url).href), GEHEIM = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
    if (test && test.versand && test.versand.id) { const body = JSON.stringify({ type: 'email.delivered', data: { email_id: test.versand.id } }), id = 'msg_' + crypto.randomUUID(), ts = String(Math.floor(Date.now() / 1000)); await srv.api('localhost', '/api/post/webhook', { body: body, headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': 'v1,' + crypto.createHmac('sha256', Buffer.from(GEHEIM.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64') } }); }
    await klick('.z-reiter a[href$="/start"]'); await page.waitForSelector('.z-schritt [data-v="vorschau"]');
    await klick('.z-schritt [data-v="vorschau"]'); await page.waitForSelector('.z-schritt [data-v="live"]');
    const vers = (await srv.api('localhost', '/api/partner', { cookie: ck })).json.bestellungen.find((x) => x.id === b0.id).vorschau.version;
    const fg = await pa('/api/partner/bestellungen/' + b0.id + '/freigabe', { aktion: 'freigeben', version: vers });
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('.z-schritt [data-v="live"]');
    const ampelGruen = await page.evaluate(() => !document.querySelector('.z-ampel li.offen'));
    await klick('.z-schritt [data-v="live"]'); await page.waitForSelector('.z-dialog');
    await klick('.z-dialog button[type="submit"]'); await warteText(/Live\. Das Abo läuft/);
    const stand = (await srv.api('localhost', '/api/zentrale/instanzen/' + iid, { headers: (await srv.zentrale()).kopf })).json.instanz;
    const cfg = await srv.api(HOST, '/config.js'), km = /window\.KONFIG = (\{.*\});/.exec(cfg.text), konf = km ? JSON.parse(km[1]) : null;
    const logo = konf && konf.instanz.logo ? await srv.api(HOST, konf.instanz.logo) : { status: 0, buf: Buffer.alloc(0) };
    ok(leiste.startsWith('Bestellt|Bezahlt*') && badgeNav >= 1, '26 Browser: Statusleiste mit „Bezahlt“ als aktuellem Schritt, Zahl „zu tun“ in der Navigation');
    ok(bl.status === 200 && fg.status === 200 && ampelGruen && stand.status === 'aktiv' && stand.marke.v >= 1 && stand.marke.bilder.logo === 'logo.png' && (stand.marke.bilder.start || []).length === 1 && stand.marke.farbe === '#2f6f4f' && konf && konf.instanz.v >= 1 && /^\/marke\/\d+\/logo\.png$/.test(konf.instanz.logo) && logo.status === 200 && logo.buf.slice(1, 4).toString() === 'PNG' && vorschauBild,
      '26.4 Browser: SVG-Logo aus der Bestellung als PNG mit Symbolen, Foto 16:9, Farbe aus der Bestellung, Vorschau im Telefonrahmen; nach dem Veröffentlichen liefert /marke/<v>/logo.png ein PNG und /config.js die neue Fassung');
    ok(klicks <= 20 && stand.status === 'aktiv', '26.4 Plus-Einrichtung im Browser von „bezahlt“ bis „live“ in ' + klicks + ' Klicks (höchstens 20)');
    h.sauber(page, '26 Browser: Zentrale ohne Konsolenfehler, CSP-Verstöße oder fremde Anfragen');

    /* Gestaltung der neuen Seiten: Schriftrollen, Ziele ab 44 px, kein Querscrollen (wie Abschnitt 13) */
    const messen = (s) => s.evaluate(() => {
      const sichtbar = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const groessen = new Set(), klein = [];
      document.querySelectorAll('body *').forEach((el) => { if (el.closest('.ein-telefon')) return; if (sichtbar(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) groessen.add(parseFloat(getComputedStyle(el).fontSize)); });
      document.querySelectorAll('a, button, input, select, textarea, summary').forEach((el) => { if (el.closest('.ein-telefon') || !sichtbar(el) || (el.type === 'file')) return; const hh = el.getBoundingClientRect().height; if (hh < 43.5 && !(el.type === 'checkbox')) klein.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' (' + Math.round(hh) + ' px: ' + (el.textContent || el.value || '').trim().slice(0, 24) + ')'); });
      return { groessen: Array.from(groessen).sort((a, b) => a - b), klein: klein, quer: document.scrollingElement.scrollWidth > window.innerWidth + 1 };
    });
    const seiten = ['#uebersicht', '#bestellungen', '#bestellung/' + b0.id, '#instanzen', '#instanz/' + iid + '/start', '#instanz/' + iid + '/domain', '#instanz/' + iid + '/gestaltung', '#instanz/' + iid + '/recht', '#instanz/' + iid + '/betrieb'];
    for (const [opt, erlaubt, name] of [[{ viewport: { width: 1280, height: 900 } }, [13, 15, 17, 22, 30], 'Schreibtisch'], [{ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' }, [13, 15, 17, 22, 26], 'Telefon']]) {
      const c = await h.browser.newContext(Object.assign({ locale: 'de-DE' }, opt)), s = await h.neueSeite(c, B), befund = [];
      await s.goto(B + '/zentrale/#bestellungen', { waitUntil: 'networkidle' }); await s.fill('#z-pw', h.PASSWORT); await s.click('form[data-form="anmelden"] button[type="submit"]'); await s.waitForSelector('.z-tab, .z-leer');
      for (const hs of seiten) {
        await s.goto(B + '/zentrale/' + hs, { waitUntil: 'networkidle' }); await s.waitForTimeout(300);
        const m = await messen(s), fremd = m.groessen.filter((g) => !erlaubt.includes(g));
        if (fremd.length || m.klein.length || m.quer) befund.push(hs + ': ' + (fremd.length ? 'Größen ' + fremd.join(', ') + ' ' : '') + (m.klein.length ? 'klein ' + m.klein.slice(0, 4).join('; ') + ' ' : '') + (m.quer ? 'Querscrollen' : ''));
      }
      ok(!befund.length, '26 Gestaltung ' + name + ': Bestellungen und Instanzen nur mit ' + erlaubt.join(' · ') + ', Ziele ab 44 px, kein Querscrollen' + (befund.length ? '\n      ' + befund.join('\n      ') : ''));
      h.sauber(s, '26 Gestaltung ' + name + ' ohne Fehler'); await c.close();
    }
  } catch (e) {
    ok(false, '26 Teil B ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { if (ctx) await ctx.close().catch(() => false); }
}

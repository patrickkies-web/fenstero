// eeziframes · Prüfabschnitt 30, Teil Welle 1 (Integrator): Verträge zwischen Strang A (Mandant, verwalten.js, Eingang) und Strang D
// (Kundenkonto, bestellung.js, Stripe) im Prozess über worker.fetch mit echten Hosts: eeziframes.com für das Kundenkonto,
// brandt.localhost für die Instanz. Die Schritte der Zentrale (Strang C) stehen hier mit genau den Funktionen, die C laut
// docs/INSTANZEN.md („Stand nach Welle 1“) aufruft. Ablauf: bestellt → bezahlt → Instanz aus der Bestellung → Bestätigungslink →
// Vorschau-Cookie → Freigabe → live (Abo, Instanz aktiv) → Anfrage mit PDF (der Zwischenstand übersteht das Aufräumen der Zentrale) →
// Empfängerwechsel → Paketwechsel → Zahlungsausfall, Pause (503) → Zahlung → Kündigung (410) → nach 30 Tagen gelöscht (404).
// Die volle Ende-zu-Ende-Prüfung mit Browser, Zentrale und Dashboard folgt in 30.mjs (Integrator, Schluss).
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export default async (h) => {
  const WZ = h.WURZEL, ok = (b, t) => h.ok(b, '30.W1 ' + t);
  const imp = (rel) => import(pathToFileURL(path.join(WZ, rel)).href);
  await imp('web/assets/pakete.js'); await imp('web/assets/instanzregeln.js');
  const { stripeNachstellen } = await imp('scripts/stripe-attrappe.mjs');
  const st = stripeNachstellen();
  try {
    const worker = (await imp('worker.js')).default;
    const umg = await imp('functions/api/umgebung.js'), spM = await imp('functions/api/speicher.js'), stM = await imp('functions/api/stripe.js'), zentrale = await imp('functions/api/zentrale.js');
    const post = await imp('functions/api/post.js'), best = await imp('functions/api/bestellung.js'), V = await imp('functions/instanz/verwalten.js'), recht = await imp('functions/api/recht.js');

    /* env.ASSETS wie Cloudflare ohne not_found_handling: Datei aus web/, Ordner → index.html, sonst 404 ohne Inhalt */
    const WEB = path.join(WZ, 'web');
    const TYP = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf' };
    const ASSETS = { fetch: async (r) => {
      const u = new URL(typeof r === 'string' ? r : r.url); let p = path.join(WEB, decodeURIComponent(u.pathname));
      try { if (fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); } catch (e) { return new Response('', { status: 404 }); }
      if (!fs.existsSync(p)) return new Response('', { status: 404 });
      return new Response(fs.readFileSync(p), { status: 200, headers: { 'content-type': TYP[path.extname(p)] || 'application/octet-stream' } });
    } };
    const W = 'whsec_pruefung30w1';
    const ENV = { STRIPE_SECRET_KEY: 'sk_test_pruefung30w1', STRIPE_WEBHOOK_SECRET: W, DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1', SITZUNG_GEHEIMNIS: 'pruefung30-welle1-sitzung-geheimnis-32-zeichen', FREISCHALT_GEHEIMNIS: 'pruefung30w1', INSTANZ_CACHE_MS: '0', ASSETS: ASSETS };
    const envT = (tage) => Object.assign({}, ENV, { JETZT: new Date(Date.now() + tage * 864e5).toISOString() });
    const k = umg.konfig(ENV), sp = spM.speicher(k), zd = stM.zahlungsdienst(k);
    const ctxD = (env) => { const e = env || ENV, kk = umg.konfig(e), offen = []; return { k: kk, env: e, sp: sp, zd: stM.zahlungsdienst(kk), url: new URL('https://eeziframes.com'), request: new Request('https://eeziframes.com'), waitUntil: (p) => offen.push(p), zaehlen: null, offen: offen }; };
    const warten = async (c) => { while (c.offen.length) await Promise.all(c.offen.splice(0)); };
    const HTML = { headers: { accept: 'text/html' } };

    /* Aufruf wie bei Cloudflare: worker.fetch mit der vollen Adresse (der Host kommt nur aus der Adresse), Cookies je Klient */
    let ipN = 0;
    function klient(basis) {
      const c = { cookies: {}, offen: [], ip: '10.30.' + (++ipN) + '.1' };
      c.rufe = async (pfad, body, x) => {
        x = x || {};
        const ck = Object.entries(c.cookies).map(([n, v]) => n + '=' + v).join('; ');
        const kopf = Object.assign({ accept: 'application/json', origin: basis, 'x-forwarded-for': c.ip }, body != null ? { 'content-type': 'application/json' } : {}, ck ? { cookie: ck } : {}, x.headers || {});
        const r = await worker.fetch(new Request(basis + pfad, { method: x.method || (body != null ? 'POST' : 'GET'), headers: kopf, body: body != null ? JSON.stringify(body) : undefined, redirect: 'manual' }), x.env || ENV, { waitUntil: (p) => c.offen.push(Promise.resolve(p).catch(() => false)), passThroughOnException() {} });
        const sc = typeof r.headers.getSetCookie === 'function' ? r.headers.getSetCookie() : [r.headers.get('set-cookie')].filter(Boolean);
        sc.forEach((s) => { const nv = s.split(';')[0], i = nv.indexOf('='), n = nv.slice(0, i), v = nv.slice(i + 1); if (v) c.cookies[n] = v; else delete c.cookies[n]; });
        const text = Buffer.from(await r.arrayBuffer()).toString('utf8'); let j = {}; try { j = JSON.parse(text); } catch (e) { j = {}; }
        return { status: r.status, j: j, text: text, headers: r.headers };
      };
      c.warten = async () => { while (c.offen.length) await Promise.all(c.offen.splice(0)); };
      return c;
    }
    const idNr = (m) => Number(String(m.id).split('-').pop()) || 0;
    const marke = () => post.attrappePost.reduce((x, m) => Math.max(x, idNr(m)), 0);
    const mailsAn = (an, re, seit) => post.attrappePost.filter((m) => idNr(m) > (seit || 0) && (Array.isArray(m.an) ? m.an.includes(an) : m.an === an) && (!re || re.test(m.betreff)));
    let evN = 0;
    const hook = async (typ, obj) => { const w = st.webhook(W, typ, obj, 'evt_p30w1_' + Date.now().toString(36) + '_' + (++evN)); const r = await worker.fetch(new Request('https://eeziframes.com/api/zahlung/webhook', { method: 'POST', headers: { 'stripe-signature': w.kopf, 'content-type': 'application/json' }, body: w.roh }), ENV, { waitUntil: () => {}, passThroughOnException() {} }); await new Promise((x) => setTimeout(x, 30)); return r.status; };
    const seite = (pfad) => klient('http://brandt.localhost').rufe(pfad || '/', null, HTML);

    /* ---------- Bestellung im Kundenkonto (D) bis bezahlt ---------- */
    const pa = klient('https://eeziframes.com'), MAIL = 'brandt@p30w1.example', EINGANG = 'anfragen@brandt-p30.example', NEU = 'buero@brandt-p30.example';
    await pa.rufe('/api/partner/anmelden', { mail: MAIL });
    const an = await pa.rufe('/api/partner/bestaetigen', { mail: MAIL, code: '123456' });
    const fi = await pa.rufe('/api/partner/firma', { firma: 'Fensterbau Brandt GmbH', rechtsform: 'GmbH', strasse: 'Lindenweg 4', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'brandt-fenster.de', ap: 'Jens Brandt', rolle: 'Geschäftsführer', tel: '0221 123456', vertretung: 'Jens Brandt (Geschäftsführer)', register: 'Amtsgericht Köln, HRB 1234', erreichbar: { tage: ['mo', 'di'], von: '08:00', bis: '12:00', kanal: 'telefon' } });
    const b0 = (await pa.rufe('/api/partner/bestellungen', { paket: 'plus', konfigurator: { name: 'Brandt Fenster', domains: ['brandt-fenster.app'], eingang: [EINGANG] } })).j.bestellung;
    await pa.rufe('/api/partner/bestellungen/' + b0.id, { gestaltung: { farben: ['#2f6f4f'], titel: 'Fenster von Brandt', begruessung: 'Willkommen', notiz: '' } }, { method: 'PATCH' });
    const ka = await pa.rufe('/api/partner/bestellungen/' + b0.id + '/kasse', { zustimmung: { unternehmer: true, agb: recht.PAKET_STAND, avv: true } });
    const sid = new URL(ka.j.url).searchParams.get('kasse') || String(ka.j.url).split('/').pop(); st.abschliessen(sid);
    const pr = await pa.rufe('/api/partner/bestellungen/' + b0.id + '/kasse/pruefen?session=' + sid); await pa.warten();
    let b = await sp.bestellungHolen(b0.id);
    ok(an.status === 200 && pa.cookies['__Host-partner'] && fi.status === 200 && ka.status === 200 && pr.status === 200 && b.status === 'bezahlt', 'Kundenkonto auf eeziframes.com: Anmeldung, Unternehmen, Bestellung Plus, Kasse und Rückkehr → bezahlt');

    /* ---------- Zentrale (wie C): Einrichtung, Instanz aus der Bestellung, Domain, Gestaltung ---------- */
    const cz = ctxD();
    await best.uebergang(cz, b.id, 'einrichtung', { wer: 'inhaber' });
    const m0 = marke();
    const inst = await V.instanzAnlegen(cz, { slug: 'p30-brandt', paket: best.paketVon(b), name: 'Brandt Fenster', partner: b.partner, bestellung: b.id, eingang: (b.wunsch.konfigurator || {}).eingang, zugang: [], recht: { firma: 'Fensterbau Brandt GmbH', strasse: 'Lindenweg 4', plz: '50667', ort: 'Köln', bundesland: 'NW', tel: '0221 123456', mail: 'info@brandt-p30.example' }, entwurf: { name: 'Brandt Fenster', farbe: '#2f6f4f', titel: 'Fenster von Brandt' }, betriebDaten: { tel: '0221 123456', ap: 'Jens Brandt' } });
    await sp.bestellungAendern(b.id, (z) => { z.instanz = inst.id; });
    await V.hostSetzen(cz, inst.id, 'brandt.localhost');
    await V.hauptSetzen(cz, inst.id, 'brandt.localhost');
    await V.markeVeroeffentlichen(cz, inst.id);
    const best1 = mailsAn(EINGANG, /bestätigen/i, m0);
    ok(inst.id && inst.status === 'einrichtung' && inst.paket === 'plus' && best1.length === 1, 'instanzAnlegen mit paketVon(b): Plus, Status einrichtung, genau eine Bestätigungsmail an die Eingangsadresse aus der Bestellung');
    const link = ((best1[0] || {}).html || '').match(/href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/), lu = link ? new URL(link[1].replace(/&amp;/g, '&')) : null;
    const bl = lu ? await klient('https://eeziframes.com').rufe(lu.pathname + lu.search, null, HTML) : { status: 0 };
    const iB = await sp.instanzHolen(inst.id);
    ok(lu && lu.origin === 'https://eeziframes.com' && bl.status === 200 && iB.eingang.mails.some((e) => e.mail === EINGANG && e.bestaetigt), 'Bestätigungslink aus der Mail (Hauptdomain) bestätigt die Adresse an der Instanz');
    for (const n of ['domain', 'freigabe']) await best.uebergang(cz, b.id, n, { wer: 'inhaber' });
    const ein = await sp.instanzHolen(inst.id);
    ok(ein.status === 'einrichtung' && (ein.marke || {}).v === 1, 'Bestellung „Zur Freigabe“: Instanz bleibt in Einrichtung (Instanzregeln.instanz.statusFuer), Gestaltung Fassung 1');

    /* ---------- Vorschau (A) und Freigabe im Kundenkonto (D) ---------- */
    const ku = klient('http://brandt.localhost');
    const vorher = await ku.rufe('/', null, HTML);
    ok(vorher.status === 503 && !/eeziframes/i.test(vorher.text), 'Instanz in Einrichtung ohne Vorschau: / antwortet 503 neutral');
    const vt = await V.vorschauToken(cz, inst.id, ein.marke.v);
    await sp.bestellungAendern(b.id, (z) => { z.vorschau = { version: ein.marke.v, bis: vt.bis, gesendet: new Date().toISOString(), link: vt.url }; });
    const vk = await ku.rufe('/?vorschau=' + encodeURIComponent(vt.token), null, HTML), mitV = await ku.rufe('/', null, HTML), cfgV = await ku.rufe('/config.js');
    ok(/^https?:\/\/brandt\.localhost\/\?vorschau=/.test(vt.url) && [302, 303].includes(vk.status) && Object.keys(ku.cookies).some((n) => /vorschau/.test(n)) && mitV.status === 200 && /"vorschau":true/.test(cfgV.text), 'Vorschau-Link auf den Haupthost setzt das Cookie; danach / 200 und /config.js mit vorschau: true');
    const sicht = ((await pa.rufe('/api/partner')).j.bestellungen || []).find((x) => x.id === b.id) || {};
    const fr = await pa.rufe('/api/partner/bestellungen/' + b.id + '/freigabe', { aktion: 'freigeben', version: ein.marke.v }); await pa.warten();
    ok(sicht.vorschau && sicht.vorschau.link === vt.url && fr.status === 200, 'Kundenkonto zeigt den Vorschau-Link aus b.vorschau, Freigabe genau dieser Fassung');

    /* ---------- Live: Abo (D), Instanz aktiv (A) ---------- */
    const cl = ctxD();
    await best.uebergang(cl, b.id, 'live', { wer: 'inhaber' }); await warten(cl);
    b = await sp.bestellungHolen(b.id);
    let i = await sp.instanzHolen(inst.id);
    const start = await seite('/'), cfg = await klient('http://brandt.localhost').rufe('/config.js'), cfgK = cfg.text.replace(/\s/g, '');
    ok(b.status === 'live' && b.abo_status === 'aktiv' && i.status === 'aktiv' && start.status === 200 && /Brandt Fenster/.test(start.text) && /--accent/.test(start.text) && /"logo":true/.test(cfgK) && /"dashboard":false/.test(cfgK), 'Live: Abo aktiv, Instanz aktiv; / und /config.js zeigen Name, Firmenfarbe und Merkmale von Plus');

    /* ---------- Endkunde: Zwischenstand übersteht das Aufräumen der Zentrale, Anfrage → Mail mit PDF ---------- */
    const ek = klient('http://brandt.localhost'), m5 = marke();
    const sStart = await ek.rufe('/api/instanz/start', {});
    const code = sStart.j.code, w = { wid: 'w1', name: 'Fenster 1', mo: { wt: 1232, wm: 1230, wb: 1231, hl: 1412, hm: 1410, hr: 1411 }, el: { w: 1200, h: 1380 }, teilung: '2', ts: Date.now(), t0: Date.now() };
    await ek.rufe('/api/link/' + code + '/entwurf', { windows: [w], proj: {}, stand: Date.now(), projTs: Date.now() });
    const auf0 = await zentrale.aufraeumen(k, sp), zw = await sp.entwurfHolen(code);
    ok(sStart.status === 200 && auf0 && zw && ((zw.daten || {}).windows || []).length === 1, 'Tägliches Aufräumen der Zentrale lässt den Zwischenstand eines Website-Besuchers der Instanz stehen (kein „Link weg“)');
    const auf = await ek.rufe('/api/aufmass', { b: code, w: [w], wm: [{ wid: 'w1', t0: w.t0, ts: w.ts }], p: { name: 'Familie Kunde', tel: '0171 5551234', mail: 'kunde@p30w1.example', erreich: 'vm' }, stand: Date.now(), projTs: Date.now() });
    await ek.warten();
    const mail5 = mailsAn(EINGANG, /Neue Anfrage/, m5)[0];
    ok(auf.status === 200 && mail5 && (mail5.anhaenge || []).some((a) => a.typ === 'application/pdf') && mail5.antwortAn === 'kunde@p30w1.example', 'Anfrage auf brandt.localhost: Mail „Neue Anfrage“ mit PDF an die bestätigte Adresse, Antwort an den Kunden');

    /* ---------- Empfänger ändern im Kundenkonto (D → verwalten.empfaengerEinladen) ---------- */
    const m6 = marke();
    const eg = await pa.rufe('/api/partner/bestellungen/' + b.id + '/eingang', { mails: [EINGANG, NEU] }); await pa.warten();
    i = await sp.instanzHolen(inst.id);
    const weg = await pa.rufe('/api/partner/bestellungen/' + b.id + '/eingang', { mails: [NEU] });
    ok(eg.status === 200 && mailsAn(NEU, /bestätigen/i, m6).length === 1 && i.eingang.mails.length === 2 && !i.eingang.mails.find((e) => e.mail === NEU).bestaetigt && weg.status === 409, 'Empfänger: neue Adresse unbestätigt an der Instanz mit genau einer Bestätigungsmail; die letzte bestätigte Adresse bleibt (409)');

    /* ---------- Paketwechsel (D) → Merkmale der Instanz (A), nur über paketSetzen; nach unten erst zum Periodenende (Befund 10) ---------- */
    const pw = await best.paketWechseln(ctxD(), b.id, 'signature', { differenz: true });
    i = await sp.instanzHolen(inst.id);
    const cfgS = (await klient('http://brandt.localhost').rufe('/config.js')).text.replace(/\s/g, '');
    const zur = await best.paketWechseln(ctxD(), b.id, 'plus', {}), iZ = await sp.instanzHolen(inst.id), bZ = await sp.bestellungHolen(b.id), cfgZ = (await klient('http://brandt.localhost').rufe('/config.js')).text.replace(/\s/g, '');
    let verbot = null; try { await V.instanzAendern(ctxD(), inst.id, (z) => { z.paket = 'essential'; }); } catch (e) { verbot = e; }
    ok(pw.ok && i.paket === 'signature' && /"dashboard":true/.test(cfgS) && verbot && verbot.status === 400, 'Paketwechsel Plus → Signature über paketWechseln: /config.js zeigt die Merkmale sofort; instanzAendern lehnt eine Paketänderung ab');
    ok(zur.ok && zur.wechsel && iZ.paket === 'signature' && /"dashboard":true/.test(cfgZ) && bZ.abo.wechsel && bZ.abo.wechsel.paket === 'plus' && bZ.abo.wechsel.von === 'signature' && bZ.abo.wechsel.ab === bZ.abo.bis && bZ.abo.paket === 'plus' && bZ.verlauf.some((v) => /wirkt ab/.test(v.text)),
      'Signature → Plus mit laufendem Abo: die Instanz bleibt bis zum Periodenende Signature (/config.js unverändert), die Bestellung merkt sich abo.wechsel { paket, von, ab = abo.bis }');
    await best.bestellungenLauf(umg.konfig(envT(31)), sp, zd, envT(31));
    const iW = await sp.instanzHolen(inst.id), bW = await sp.bestellungHolen(b.id), cfgW = (await klient('http://brandt.localhost').rufe('/config.js')).text.replace(/\s/g, '');
    ok(iW.paket === 'plus' && !bW.abo.wechsel && bW.abo.paket === 'plus' && /"dashboard":false/.test(cfgW) && bW.verlauf.some((v) => /wirksam/.test(v.text)) && bW.status === 'live', 'Tageslauf nach dem Periodenende: Instanz Plus, Vormerkung weg, /config.js ohne Dashboard, Bestellung weiter live');

    /* ---------- Zahlungsausfall → Kulanz → Pause (503) → Zahlung → live ---------- */
    const sub = b.abo.id, partner = await sp.partnerHolen(b.partner);
    const rechnung = (extra) => Object.assign({ id: 'in_p30w1_' + Math.random().toString(36).slice(2, 8), object: 'invoice', customer: partner.stripe_customer, hosted_invoice_url: 'https://invoice.stripe.com/i/x', parent: { subscription_details: { subscription: sub, metadata: { art: 'paket', bestellung: b.id } } }, lines: { data: [{ period: { end: Math.floor(Date.now() / 1000) + 30 * 86400 } }] } }, extra || {});
    await hook('invoice.payment_failed', rechnung());
    await best.bestellungenLauf(umg.konfig(envT(15)), sp, zd, envT(15));
    b = await sp.bestellungHolen(b.id); i = await sp.instanzHolen(inst.id);
    const p503 = await seite('/'), startP = await klient('http://brandt.localhost').rufe('/api/instanz/start', {});
    const aufP = await ek.rufe('/api/aufmass', { b: code, w: [w], wm: [], p: { name: 'Familie Kunde', tel: '0171 5551234' }, stand: Date.now(), projTs: Date.now() });
    ok(b.status === 'pausiert' && i.status === 'pausiert' && p503.status === 503 && /Brandt/.test(p503.text) && startP.status >= 400 && aufP.status >= 400, 'Kulanz vorbei (Tageslauf): Bestellung und Instanz pausiert; / 503 mit Name des Betriebs, Start und Senden ≠ 2xx');
    await hook('invoice.paid', rechnung({ status: 'paid' }));
    b = await sp.bestellungHolen(b.id); i = await sp.instanzHolen(inst.id);
    ok(b.status === 'live' && i.status === 'aktiv' && (await seite('/')).status === 200, 'invoice.paid: wieder live, Instanz aktiv, / 200');

    /* ---------- Kündigung → Ende (410) → nach 30 Tagen alles gelöscht (verwalten.instanzDatenLoeschen) ---------- */
    await hook('customer.subscription.updated', Object.assign({}, st.db.abos.get(sub), { cancel_at_period_end: true }));
    st.aboBeenden(sub);
    await hook('customer.subscription.deleted', Object.assign({}, st.db.abos.get(sub)));
    b = await sp.bestellungHolen(b.id); i = await sp.instanzHolen(inst.id);
    ok(b.status === 'beendet' && i.status === 'beendet' && (await seite('/')).status === 410, 'Kündigung zum Periodenende: Bestellung und Instanz beendet, / 410');
    await best.bestellungenLauf(umg.konfig(envT(31)), sp, zd, envT(31));
    b = await sp.bestellungHolen(b.id);
    const rest = (spM.attrappeStand().anfragen || []).filter((a) => a.instanz === inst.id), nachher = await seite('/');
    ok(!(await sp.instanzHolen(inst.id)) && !(await sp.entwurfHolen(code)) && !rest.length && nachher.status === 404 && !/eeziframes/i.test(nachher.text) && b.verlauf.some((v) => v.art === 'geloescht'), '30 Tage nach dem Ende (Tageslauf): Instanz, Host, Anfragen und Zwischenstände gelöscht, der Host antwortet 404 neutral');
  } catch (e) { ok(false, 'Abbruch: ' + String(e && e.stack || e).slice(0, 400)); }
  finally { st.aus(); }
};

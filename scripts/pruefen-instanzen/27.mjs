// eeziframes · Prüfabschnitt 27: Kundenkonto und Bestellung der Konfigurator-Pakete (Strang D, Bauplan §3 D; docs/INSTANZEN.md)
// Teil A läuft im Prozess gegen ein nachgestelltes Stripe (scripts/stripe-attrappe.mjs) und die Speicher-Attrappe: Anmeldung mit Cookie,
// Feldregeln, Uploads, Eingangsbestätigung, Kasse, Bindung der Zahlung, Statusmaschine, Altbestand, Abo, Kulanz bis Löschung,
// Kundenportal, Nachrichten und Rückruf, Domain-Hinweis, Instanz-Host. Teil B prüft im Browser (Chromium, 390 und 1280 px) gegen den
// Instanz-Testserver (Zahlungs-Attrappe): Bestellung von „Paket wählen“ bis „Bezahlt“, Zwischenspeichern, Fehler am Feld, Statusleiste.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const titel = 'Kundenkonto und Bestellung (Konfigurator-Pakete)';
const B = 'https://eeziframes.com';
const W = 'whsec_pruefung27';
const GEHEIM = 'pruefung27-sitzung-geheimnis-mindestens-32-zeichen';
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a5f40000000049454e44ae426082', 'hex');
const SVG = Buffer.from('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script><rect width="10" height="10"/></svg>');
const PDF = Buffer.from('%PDF-1.4\n%\xe2\xe3\n1 0 obj << /Type /Catalog >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n', 'latin1');
const FIRMA = { firma: 'Fensterbau Brandt GmbH', rechtsform: 'GmbH', strasse: 'Lindenweg 4', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'brandt-fenster.de', ap: 'Jens Brandt', rolle: 'Geschäftsführer', tel: '0221 123456', vertretung: 'Jens Brandt (Geschäftsführer)', register: 'Amtsgericht Köln, HRB 1234', erreichbar: { tage: ['mo', 'di', 'mi'], von: '08:00', bis: '12:00', kanal: 'telefon' } };
const KONF = (o) => Object.assign({ name: 'Brandt Fenster', domains: ['brandt-fenster.app'], eingang: ['anfragen@brandt.example'] }, o || {});
const GEST = { farben: ['#8fd694'], titel: 'Fenster von Brandt', begruessung: 'Willkommen', notiz: '' };

export default async (h) => {
  const { ok } = h, WZ = h.WURZEL;
  const imp = (rel) => import(pathToFileURL(path.join(WZ, rel)).href);
  await imp('web/assets/pakete.js'); await imp('web/assets/instanzregeln.js');
  const Pk = globalThis.Pakete, RB = globalThis.Instanzregeln.bestellung, RE = globalThis.Instanzregeln;
  const { stripeNachstellen } = await imp('scripts/stripe-attrappe.mjs');
  const st = stripeNachstellen();
  /* Mails im Prozess: Resend nie wirklich aufrufen (Teil „Live-Modus mit Mailversand“) */
  const fetchStripe = globalThis.fetch, resend = [];
  globalThis.fetch = async (url, init) => { const u = new URL(typeof url === 'string' ? url : url.url); if (u.hostname === 'api.resend.com') { resend.push(JSON.parse(init.body)); return new Response(JSON.stringify({ id: 're_' + resend.length }), { status: 200, headers: { 'content-type': 'application/json' } }); } return fetchStripe(url, init); };
  try {
    const { api } = await imp('functions/api/router.js'), umg = await imp('functions/api/umgebung.js'), spM = await imp('functions/api/speicher.js'), stM = await imp('functions/api/stripe.js');
    const post = await imp('functions/api/post.js'), recht = await imp('functions/api/recht.js'), best = await imp('functions/api/bestellung.js'), fotos = await imp('functions/api/fotos.js'), konten = await imp('functions/api/konten.js');
    const ENV = { STRIPE_SECRET_KEY: 'sk_test_pruefung27', STRIPE_WEBHOOK_SECRET: W, DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1', SITZUNG_GEHEIMNIS: GEHEIM, FREISCHALT_GEHEIMNIS: 'pruefung27' };
    const k = umg.konfig(ENV), sp = spM.speicher(k), zd = stM.zahlungsdienst(k), STAND = recht.PAKET_STAND;
    const mitZeit = (ms) => Object.assign({}, ENV, { JETZT: new Date(Date.now() + ms).toISOString() });
    const ctxD = (env) => { const e = env || ENV, kk = umg.konfig(e), offen = []; return { k: kk, env: e, sp: sp, zd: stM.zahlungsdienst(kk), url: new URL(B), request: new Request(B), waitUntil: (p) => offen.push(p), zaehlen: null, offen: offen }; };
    let ipZahl = 0;
    /* Client im Prozess: eigene Adresse (Bremsen), Cookie der Sitzung, Aufgaben nach der Antwort (waitUntil) */
    function klient(o) {
      o = o || {};
      const c = { cookie: '', offen: [], ip: '10.27.' + (++ipZahl) + '.1' };
      c.rufe = async (pfad, body, x) => {
        x = x || {};
        const kopf = Object.assign({ accept: 'application/json', origin: x.origin === undefined ? (x.host || B) : x.origin, 'x-forwarded-for': c.ip }, body != null ? { 'content-type': 'application/json' } : {}, c.cookie && !x.ohneCookie ? { cookie: c.cookie } : {}, x.headers || {});
        if (!kopf.origin) delete kopf.origin;
        const r = await api(new Request((x.host || B) + pfad, { method: x.method || (body != null ? 'POST' : 'GET'), headers: kopf, body: body != null ? JSON.stringify(body) : undefined }), x.env || o.env || ENV, { waitUntil: (p) => c.offen.push(p) }, x.inst);
        const sc = r.headers.get('set-cookie'); if (sc && /^__Host-partner=/.test(sc)) c.cookie = /^__Host-partner=;/.test(sc) ? '' : sc.split(';')[0];
        const buf = Buffer.from(await r.arrayBuffer()); let j = {}; try { j = JSON.parse(buf.toString('utf8')); } catch (e) { j = {}; }
        return { status: r.status, j: j, headers: r.headers, buf: buf, setCookie: sc || '' };
      };
      c.warten = async () => { while (c.offen.length) await Promise.all(c.offen.splice(0)); };
      c.anmelden = async (mail) => { await c.rufe('/api/partner/anmelden', { mail: mail }); return c.rufe('/api/partner/bestaetigen', { mail: mail, code: '123456' }); };
      return c;
    }
    const idNr = (m) => Number(String(m.id).split('-').pop()) || 0;
    const marke = () => post.attrappePost.reduce((x, m) => Math.max(x, idNr(m)), 0);
    const mailsAn = (an, re, seit) => post.attrappePost.filter((m) => idNr(m) > (seit || 0) && (Array.isArray(m.an) ? m.an.includes(an) : m.an === an) && (!re || re.test(m.betreff)));
    const inhaber = () => (k.post || {}).kontakt;
    /* eigene Ereigniskennungen: die Kennungen der Attrappe beginnen je Abschnitt neu, und die Datenbank merkt sich verarbeitete Ereignisse */
    let evZahl = 0;
    const hook = async (typ, obj, id) => { const w = st.webhook(W, typ, obj, id || 'evt_p27_' + Date.now().toString(36) + '_' + (++evZahl)); const r = await api(new Request(B + '/api/zahlung/webhook', { method: 'POST', headers: { 'stripe-signature': w.kopf, 'content-type': 'application/json' }, body: w.roh }), ENV, { waitUntil: () => {} }); return { status: r.status, j: await r.json().catch(() => ({})) }; };
    const kassenLog = (n0) => st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/checkout/sessions');
    /* Kennung der Kasse: bei Stripe das Ende der Adresse, in der Attrappe ?kasse= */
    const sessionAus = (url) => new URL(url).searchParams.get('kasse') || String(url).split('/').pop();
    const vorbereiten = async (c, mail, paket, o) => {
      o = o || {};
      await c.anmelden(mail);
      if (!o.ohneFirma) await c.rufe('/api/partner/firma', Object.assign({}, FIRMA, { firma: o.firma || FIRMA.firma }));
      const b = (await c.rufe('/api/partner/bestellungen', { paket: paket, konfigurator: KONF(o.konf) })).j.bestellung;
      if (Pk.merkmale(paket).logo) await c.rufe('/api/partner/bestellungen/' + b.id, { gestaltung: GEST }, { method: 'PATCH' });
      return b;
    };
    const ZUST = { unternehmer: true, agb: STAND, avv: true };

    /* ---------- 27.1 Anmeldung: Cookie statt Token, Bereich und Host gebunden, frisch für Geld-Aktionen, Sperre nach Fehlversuchen ---------- */
    const a = klient();
    const an1 = await a.rufe('/api/partner/anmelden', { mail: 'Brandt@Fenster27.example' });
    const be1 = await a.rufe('/api/partner/bestaetigen', { mail: 'brandt@fenster27.example', code: '123456' });
    const sc1 = be1.setCookie;
    ok(an1.status === 200 && be1.status === 200 && /^__Host-partner=[^;]+;/.test(sc1) && /HttpOnly/.test(sc1) && /Secure/.test(sc1) && /SameSite=Strict/.test(sc1) && /Path=\//.test(sc1) && !/token|refresh/i.test(Object.keys(be1.j).join()) && !/test\.|eyJ/.test(JSON.stringify(be1.j)), '27.1 Anmeldung per Code setzt __Host-partner (HttpOnly, Secure, SameSite=Strict, Path=/); die Antwort enthält kein Supabase-Token');
    const s1 = await a.rufe('/api/partner'), s0 = await a.rufe('/api/partner', null, { ohneCookie: true });
    const kontoMitCookie = await a.rufe('/api/konto');
    const andererHost = await a.rufe('/api/partner', null, { host: 'https://brandt-fenster.app' });
    const instHost = await a.rufe('/api/partner/anmelden', { mail: 'x@fenster27.example' }, { host: 'https://plus.example', inst: { id: 'i27', host: 'plus.example' } });
    ok(s1.status === 200 && s1.j.angemeldet && s1.j.mail === 'brandt@fenster27.example' && s1.j.partner === null && s0.status === 200 && s0.j.angemeldet === false && kontoMitCookie.status === 401 && andererHost.j.angemeldet === false && instHost.status === 404, '27.1 Sitzung gilt nur im Kundenkonto auf diesem Host: ohne Cookie nicht angemeldet (200), /api/konto bleibt 401, fremder Host nicht angemeldet, auf einem Instanz-Host 404');
    const fremdOrigin = await a.rufe('/api/partner/firma', FIRMA, { origin: 'https://boese.example' });
    ok(fremdOrigin.status === 403, '27.1 Schreibende Anfrage mit Sitzung von fremder Herkunft: 403');
    const altMail = 'alt@fenster27.example', alt = klient(); await alt.anmelden(altMail); await alt.rufe('/api/partner/firma', FIRMA);
    const portalAlt = await alt.rufe('/api/partner/portal', {}, { env: mitZeit(20 * 60000) });
    const stornoAlt = await alt.rufe('/api/partner/portal', {});
    ok(portalAlt.status === 401 && portalAlt.j.frisch === true && stornoAlt.status === 409, '27.1 Geld-Aktion (Kundenportal) mit Anmeldung älter als 15 Minuten: 401 { frisch: true }; frisch angemeldet geht es weiter (ohne Stripe-Kunden 409)');
    const sp1 = klient(), sperrMail = 'sperre@fenster27.example';
    await sp1.rufe('/api/partner/anmelden', { mail: sperrMail });
    const falsch = [];
    for (let i = 0; i < 10; i++) { sp1.ip = '10.27.200.' + i; falsch.push((await sp1.rufe('/api/partner/bestaetigen', { mail: sperrMail, code: '000000' })).status); }
    sp1.ip = '10.27.201.1';
    const richtig = await sp1.rufe('/api/partner/bestaetigen', { mail: sperrMail, code: '123456' }), neuCode = await sp1.rufe('/api/partner/anmelden', { mail: sperrMail });
    await sp1.warten();
    ok(falsch.every((x) => x === 401) && richtig.status === 429 && richtig.j.gesperrt && neuCode.status === 429 && !richtig.setCookie && mailsAn(sperrMail, /gesperrt/).length === 1, '27.1 Zehn falsche Codes je Adresse: danach gesperrt bis Mitternacht (auch der richtige Code und neue Codes 429), genau eine Hinweis-Mail an die Adresse');

    /* ---------- 27.2 Feldregeln: Browser und Server prüfen mit derselben Funktion; Domains normalisiert ---------- */
    const kaputt = { firma: 'B', strasse: 'W', plz: '5066', ort: '', bundesland: 'XX', ust: 'DE12', web: 'http://', ap: '', tel: '12', rechtsform: '', vertretung: '', erreichbar: { tage: [], von: '18:00', bis: '08:00' } };
    const fe = await a.rufe('/api/partner/firma', kaputt), erwartet = RB.firma(kaputt).fehler;
    ok(fe.status === 400 && JSON.stringify(fe.j.felder) === JSON.stringify(erwartet) && Object.keys(erwartet).length >= 10, '27.2 Unternehmen: der Server meldet genau die Feldfehler der gemeinsamen Prüffunktion (' + Object.keys(erwartet).length + ' Felder)');
    const fiOk = await a.rufe('/api/partner/firma', FIRMA);
    ok(fiOk.status === 200 && fiOk.j.partner.firma === FIRMA.firma && fiOk.j.partner.daten.erreichbar.tage.join() === 'mo,di,mi' && fiOk.j.partner.daten.vertretung === FIRMA.vertretung, '27.2 Unternehmen mit Erreichbarkeit und Impressumsangaben gespeichert (Kundenkonto angelegt)');
    const kb = await a.rufe('/api/partner/bestellungen', { paket: 'signature', konfigurator: { name: 'Brandt', domains: ['HTTPS://WWW.Brandt-Fenster.App/x', 'bücher.de', 'brandt-fenster.app'], eingang: ['anfragen@brandt.example'], zugang: ['team@brandt.example'] } });
    const kbFalsch = await a.rufe('/api/partner/bestellungen', { paket: 'signature', konfigurator: { name: 'Brandt', domains: ['eeziframes.com'], eingang: ['kaputt'] } });
    ok(kb.status === 200 && kb.j.bestellung.wunsch.konfigurator.domains.join() === 'brandt-fenster.app,xn--bcher-kva.de' && kbFalsch.status === 400 && kbFalsch.j.felder['konfigurator.domains.0'] && kbFalsch.j.felder['konfigurator.eingang.0'] && kbFalsch.j.felder['konfigurator.zugang'], '27.2 Wunsch-Domains normalisiert (HTTPS://WWW.Brandt-Fenster.App/x → brandt-fenster.app, IDN → Punycode, doppelt entfernt); eeziframes-Host, falsche Adresse, fehlender Zugang bei Signature → Feldfehler');
    const bS = kb.j.bestellung;

    /* ---------- 27.3 Uploads: Typ aus der Signatur, Größe, Anzahl, SVG/PDF nur als Download in der Sandbox, fremd 404 ---------- */
    const up = (c, bid, art, buf, name) => c.rufe('/api/partner/bestellungen/' + bid + '/datei', { art: art, name: name, daten: buf.toString('base64') });
    const u1 = await up(a, bS.id, 'logo', PNG, 'logo.png'), u2 = await up(a, bS.id, 'logo', Buffer.from('GIF89a' + 'x'.repeat(40)), 'logo.png');
    const gross = Buffer.concat([PNG, Buffer.alloc(1000001)]), u3 = await up(a, bS.id, 'foto', gross, 'riesig.png');
    const u4 = await up(a, bS.id, 'logo', SVG, 'logo.svg'), u5 = await up(a, bS.id, 'druck', PDF, 'druck.pdf'), u6 = await up(a, bS.id, 'foto', PDF, 'foto.pdf');
    ok(u1.status === 200 && u1.j.datei.typ === 'image/png' && u2.status === 400 && u3.status === 413 && u4.status === 200 && u4.j.datei.typ === 'image/svg+xml' && u5.status === 200 && u5.j.datei.typ === 'application/pdf' && u6.status === 400, '27.3 Uploads: PNG angenommen, falsche Signatur 400, über 1 MB 413, SVG als Logo, PDF nur als Druckvorlage (als Foto 400)');
    const dl = (c, bid, did) => c.rufe('/api/partner/bestellungen/' + bid + '/datei/' + did);
    const gPng = await dl(a, bS.id, u1.j.datei.id), gSvg = await dl(a, bS.id, u4.j.datei.id), gPdf = await dl(a, bS.id, u5.j.datei.id);
    const kopfOk = (r, art) => r.status === 200 && new RegExp('^' + art).test(r.headers.get('content-disposition') || '') && /sandbox/.test(r.headers.get('content-security-policy') || '') && /default-src 'none'/.test(r.headers.get('content-security-policy') || '') && r.headers.get('x-content-type-options') === 'nosniff' && /no-store/.test(r.headers.get('cache-control') || '');
    ok(kopfOk(gPng, 'inline') && kopfOk(gSvg, 'attachment') && kopfOk(gPdf, 'attachment') && gPng.buf.equals(PNG) && gSvg.headers.get('content-type') === 'image/svg+xml', '27.3 Auslieferung: Bild inline, SVG und PDF nur als attachment, immer mit CSP sandbox, nosniff, no-store; Inhalt unverändert');
    const fremd = klient(); await fremd.anmelden('fremd@fenster27.example'); await fremd.rufe('/api/partner/firma', Object.assign({}, FIRMA, { firma: 'Glaserei Fremd' }));
    const gFremd = await dl(fremd, bS.id, u1.j.datei.id), pFremd = await fremd.rufe('/api/partner/bestellungen/' + bS.id, { gestaltung: GEST }, { method: 'PATCH' }), dUnbekannt = await dl(a, bS.id, 'dgibtsnicht1');
    for (let i = 0; i < 6; i++) await up(a, bS.id, 'foto', PNG, 'foto' + i + '.png');
    const u7 = await up(a, bS.id, 'foto', PNG, 'foto7.png');
    const bEss = (await a.rufe('/api/partner/bestellungen', { paket: 'essential', konfigurator: KONF() })).j.bestellung, uEss = await up(a, bEss.id, 'logo', PNG, 'logo.png');
    await sp.bestellungAendern(bEss.id, (z) => { z.status = 'live'; });
    const uLive = await a.rufe('/api/partner/bestellungen/' + bEss.id + '/datei', { art: 'logo', name: 'x.png', daten: PNG.toString('base64') });
    const ablageB = fotos.ablage(k, 'bestellungen').alle().filter((p) => p.startsWith('partner/'));
    ok(gFremd.status === 404 && pFremd.status === 404 && dUnbekannt.status === 404 && u7.status === 400 && uEss.status === 400 && uLive.status === 409 && ablageB.some((p) => p.endsWith(u1.j.datei.id + '.png')) && ablageB.some((p) => p.endsWith(u4.j.datei.id + '.svg')), '27.3 Fremde Bestellung und unbekannte Datei 404, Anzahl je Art begrenzt (7. Foto 400), Essential ohne Logo 400, nach Live 409; Ablage im Bucket „bestellungen“ unter partner/<partner>/<bestellung>/');
    await sp.bestellungAendern(bEss.id, (z) => { z.status = 'storniert'; });

    /* ---------- 27.4 / 27.5 Kostenpflichtig bestellen: Eingangsbestätigung mit zwei PDFs sofort, Kasse mit Preis aus pakete.js ---------- */
    const bP = await vorbereiten(klient(), 'leer@fenster27.example', 'plus', { ohneFirma: true }).catch(() => null);
    ok(bP === null, '27.5 Bestellung ohne Angaben zum Unternehmen: kein Entwurf (409, erst das Unternehmen)');
    const c = klient(), cMail = 'kasse@fenster27.example', bA = await vorbereiten(c, cMail, 'plus');
    const ohneKonf = (await c.rufe('/api/partner/bestellungen', { paket: 'plus' })).j.bestellung;
    const kUnvoll = await c.rufe('/api/partner/bestellungen/' + ohneKonf.id + '/kasse', { zustimmung: ZUST });
    const kAlt = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: Object.assign({}, ZUST, { agb: '2020-01-01' }) });
    const kOhne = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: { unternehmer: false, agb: STAND, avv: false } });
    await c.rufe('/api/partner/bestellungen/' + ohneKonf.id + '/stornieren', {});
    ok(kUnvoll.status === 400 && kUnvoll.j.schritt === 'konfigurator' && kAlt.status === 409 && kAlt.j.neuLaden && kAlt.j.stand === STAND && kOhne.status === 400 && kOhne.j.felder['zustimmung.unternehmer'] && kOhne.j.felder['zustimmung.avv'], '27.5 Kasse: unvollständig 400 mit Schritt, alte Fassung der Paketbedingungen 409, ohne Unternehmer- und AV-Häkchen 400');
    let n0 = st.log.length;
    const kA = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }); await c.warten();
    const kasse = kassenLog(n0)[0] || { p: {} }, pp = kasse.p, li = (pp.line_items || [])[0] || {}, steuer = st.db.steuern.find((t) => t.id === (li.tax_rates || [])[0]) || {};
    const partnerA = await sp.partnerNachMail(cMail), kunde = st.db.kunden.get(pp.customer) || {};
    ok(kA.status === 200 && /^https:\/\/checkout\.stripe\.com\//.test(kA.j.url) && pp.mode === 'payment' && li.price_data.unit_amount === String(Pk.preis('plus').einrichtung * 100) && li.price_data.tax_behavior === 'exclusive' && !steuer.inclusive && Number(steuer.percentage) === 19 && pp.payment_method_types.join() === 'card,sepa_debit' && pp.payment_intent_data.setup_future_usage === 'off_session' && pp.invoice_creation.enabled === 'true', '27.5 Kasse: Einrichtung ' + Pk.preis('plus').einrichtung + ' € netto aus pakete.js, Steuer 19 % exklusiv, Karte und SEPA, Zahlungsmittel für das Abo gespeichert (setup_future_usage), Rechnung (invoice_creation)');
    ok(pp.metadata.art === 'einrichtung' && pp.metadata.bestellung === bA.id && pp.metadata.partner === partnerA.id && pp.metadata.stand === STAND && pp.payment_intent_data.metadata.art === 'einrichtung' && !/betrieb/i.test(kasse.roh) && pp.customer === partnerA.stripe_customer && kunde.metadata.art === 'paket' && kunde.metadata.partner === partnerA.id && !kunde.metadata.betrieb && kunde.address.postal_code === '50667' && kunde.tax_ids[0].value === 'DE123456789', '27.5 Metadaten art=einrichtung, Bestellung, Partner, Stand; nirgends „betrieb“; Stripe-Kunde des Partners mit Anschrift und USt-IdNr.');
    const eing = mailsAn(cMail, /Eingangsbestätigung/), anl = eing[0] ? eing[0].anhaenge : [];
    const pdfDaten = eing[0] ? (post.attrappePost.find((m) => m.id === eing[0].id) || {}).anhangDaten || [] : [];
    ok(eing.length === 1 && anl.length === 2 && anl.every((x) => x.typ === 'application/pdf' && x.bytes > 500) && anl.map((x) => x.name).join() === 'Paketbedingungen-' + STAND + '.pdf,AV-Vertrag-' + STAND + '.pdf' && pdfDaten.every((d) => Buffer.from(d, 'base64').toString('latin1').startsWith('%PDF')) && /B-\d{4}-\d{4}/.test(eing[0].betreff), '27.4 Eingangsbestätigung sofort beim Klick auf „Kostenpflichtig bestellen“: Bestellübersicht mit Paketbedingungen und AV-Vertrag als PDF (Fassung ' + STAND + ')');
    n0 = st.log.length;
    const kA2 = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }); await c.warten();
    const ab = st.log.slice(n0).filter((e) => /\/expire$/.test(e.pfad)), zA = (await sp.bestellungHolen(bA.id));
    ok(kA2.status === 200 && ab.length === 1 && mailsAn(cMail, /Eingangsbestätigung/).length === 1 && zA.zustimmung.stand === STAND && zA.zustimmung.unternehmer && zA.zustimmung.avv && zA.zahlung.status === 'kasse' && zA.zahlung.session === sessionAus(kA2.j.url), '27.4 Zweiter Klick: die alte Kasse verfällt, eine neue entsteht, keine zweite Eingangsbestätigung; Zustimmung (Stand, Unternehmer, AV-Vertrag) an der Bestellung');
    /* Verkauf: ohne PAKETE_OFFEN im Live-Modus keine Kasse; mit PAKETE_OFFEN erst, wenn Mail, MwSt., Geheimnis und Paketbedingungen samt PDFs da sind */
    const ASSETS = (mitPdf) => ({ fetch: async (req) => { const u = new URL(req.url); if (/\.pdf$/.test(u.pathname)) return mitPdf ? new Response(PDF, { status: 200 }) : new Response('', { status: 404 }); return new Response('<main><h1>Text</h1></main>', { status: 200 }); } });
    const LIVE = Object.assign({}, ENV, { STRIPE_SECRET_KEY: 'sk_live_pruefung27' });
    const live0 = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }, { env: LIVE });
    const live1 = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }, { env: Object.assign({}, LIVE, { PAKETE_OFFEN: '1', ASSETS: ASSETS(false) }) });
    n0 = st.log.length;
    /* Befund 5: solange die Rechtsvorlage der Instanzen ungeprüft ist (VORLAGE.geprueft false), bleibt die Kasse auch mit allem anderen zu */
    const ALLES = Object.assign({}, LIVE, { PAKETE_OFFEN: '1', MWST: '19', MAIL_API_KEY: 're_pruefung27', MAIL_ABSENDER: 'kontakt@eeziframes.com', ASSETS: ASSETS(true) });
    const rechtI = await import(pathToFileURL(path.join(WZ, 'functions/instanz/recht.js')).href), geprueft0 = rechtI.VORLAGE.geprueft;
    if (recht.rechtstexteVergessen) recht.rechtstexteVergessen(); // Abschnitt 26 hat die echten Seiten (mit Platzhaltern) für diesen Ursprung gemerkt
    rechtI.VORLAGE.geprueft = false;
    const live2a = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }, { env: ALLES });
    rechtI.VORLAGE.geprueft = true;
    const live2 = await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST }, { env: ALLES });
    rechtI.VORLAGE.geprueft = geprueft0;
    const standLive = await c.rufe('/api/partner/stand', null, { env: LIVE }), standTest = await c.rufe('/api/partner/stand');
    ok(live0.status === 503 && live0.j.gesperrt && live0.j.bald && live1.status === 503 && live2a.status === 503 && live2a.j.bald && live2.status === 200 && kassenLog(n0).length === 1 && standLive.j.verkauf.kasse === false && standLive.j.verkauf.vorlaeufig && standTest.j.verkauf.kasse === true && standTest.j.verkauf.bestellen === false, '27.5 Live-Modus: ohne PAKETE_OFFEN „Bestellung bald möglich“ (503), mit PAKETE_OFFEN erst mit Mailversand, MwSt., Paketbedingungen, PDFs und anwaltlich geprüfter Rechtsvorlage der Instanzen; im Testmodus ist die Kasse offen, die Preise bleiben vorläufig (' + [live0.status, live1.status, live2a.status, live2.status].join('/') + ' · ' + JSON.stringify(live2a.j || {}).slice(0, 160) + ' · ' + JSON.stringify(live2.j || {}).slice(0, 160) + ')');
    const anfr = await c.rufe('/api/partner/bestellungen/' + bA.id + '/anfragen', {}); await c.warten();
    ok(anfr.status === 200 && mailsAn(inhaber(), /Anfrage zu einem Paket/).length >= 1, '27.5 Kasse noch zu: „Unverbindlich anfragen“ wird eine Nachricht mit Mail an den Inhaber');

    /* ---------- 27.6 Bindung der Zahlung, genau ein Übergang, je eine Mail ---------- */
    const kB = await c.rufe('/api/partner/bestellungen/' + (await vorbereiten(klient(), 'zweit@fenster27.example', 'plus')).id + '/kasse', { zustimmung: ZUST }).catch(() => null);
    const bB = (await c.rufe('/api/partner/bestellungen', { paket: 'plus', konfigurator: KONF() })).j.bestellung;
    await c.rufe('/api/partner/bestellungen/' + bB.id, { gestaltung: GEST }, { method: 'PATCH' });
    const kAletzt = (await c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse', { zustimmung: ZUST })).j.url, sA = sessionAus(kAletzt);
    st.abschliessen(sA);
    const quer = await c.rufe('/api/partner/bestellungen/' + bB.id + '/kasse/pruefen?session=' + sA);
    const bBnach = await sp.bestellungHolen(bB.id);
    ok(kB === null || kB.status === 404, '27.6 Fremde Bestellung zur Kasse: 404');
    ok(quer.status === 403 && bBnach.status === 'offen' && (bBnach.verlauf || []).some((v) => v.art === 'hinweis' && v.intern), '27.6 Sitzung von Bestellung A an Bestellung B: 403, B bleibt offen, Hinweis für die Zentrale');
    const m6 = marke();
    const evId = 'evt_paket27_doppelt_' + Date.now().toString(36);
    const [rk, wh1, wh2] = await Promise.all([c.rufe('/api/partner/bestellungen/' + bA.id + '/kasse/pruefen?session=' + sA), hook('checkout.session.completed', st.db.kassen.get(sA), evId), hook('checkout.session.completed', st.db.kassen.get(sA), 'evt_paket27_zweit_' + Date.now().toString(36))]);
    const wh3 = await hook('checkout.session.completed', st.db.kassen.get(sA), evId); await c.warten();
    await new Promise((r) => setTimeout(r, 50));
    const bAnach = await sp.bestellungHolen(bA.id);
    ok(rk.status === 200 && rk.j.bezahlt && wh1.status === 200 && wh2.status === 200 && wh3.j.doppelt && bAnach.status === 'bezahlt' && bAnach.verlauf.filter((v) => v.status === 'bezahlt').length === 1 && bAnach.zahlung.pm && bAnach.zahlung.betrag_cent === stM.einrichtungBrutto(bAnach.preise) && mailsAn(cMail, /bezahlt/, m6).length === 1 && mailsAn(inhaber(), /Bestellung bezahlt/, m6).length === 1, '27.6 Rückkehr und Webhook gleichzeitig, Webhook doppelt zugestellt: genau ein Wechsel auf „bezahlt“, je eine Mail an Partner und Inhaber; Zahlungsmittel und Betrag gespeichert');
    const dopp = await sp.bestellungAendern(bB.id, (z) => { z.zahlung = { status: 'kasse', session: sA }; }).then(() => 0, (e) => e);
    ok(dopp && dopp.status === 409 && dopp.extra && dopp.extra.grund === 'zahlung_doppelt', '27.6 Zweite Bestellung mit derselben Kasse: Fehler des eindeutigen Schlüssels (409 zahlung_doppelt)');
    const dKunde = st.db.kunden.get(partnerA.stripe_customer);
    ok(dKunde.invoice_settings.default_payment_method === bAnach.zahlung.pm, '27.6 Das Zahlungsmittel der Einrichtung ist Standard am Stripe-Kunden (für das Abo)');
    /* falscher Betrag, SEPA unterwegs, Lastschrift zurück */
    const sB = sessionAus((await c.rufe('/api/partner/bestellungen/' + bB.id + '/kasse', { zustimmung: ZUST })).j.url);
    st.abschliessen(sB, { betrag: 100 });
    const falschBetrag = await c.rufe('/api/partner/bestellungen/' + bB.id + '/kasse/pruefen?session=' + sB);
    const bBf = await sp.bestellungHolen(bB.id);
    ok(falschBetrag.status === 403 && bBf.status === 'offen' && bBf.verlauf.some((v) => v.art === 'hinweis' && /weicht/.test(v.text)), '27.6 Falscher Betrag: nicht bezahlt, Hinweis in der Zentrale');
    const bC = await vorbereiten(c, cMail, 'essential').catch(() => null) || (await c.rufe('/api/partner/bestellungen', { paket: 'essential', konfigurator: KONF() })).j.bestellung;
    const sC = sessionAus((await c.rufe('/api/partner/bestellungen/' + bC.id + '/kasse', { zustimmung: ZUST })).j.url);
    st.abschliessen(sC, { zahlung: 'processing', art: 'sepa_debit' });
    const laeuft = await c.rufe('/api/partner/bestellungen/' + bC.id + '/kasse/pruefen?session=' + sC); await c.warten();
    const stornoLaeuft = await c.rufe('/api/partner/bestellungen/' + bC.id + '/stornieren', {});
    st.zahlungEingang(sC);
    const asy = await hook('checkout.session.async_payment_succeeded', st.db.kassen.get(sC)); await new Promise((r) => setTimeout(r, 30));
    const bCn = await sp.bestellungHolen(bC.id);
    ok(laeuft.status === 200 && laeuft.j.laeuft && !laeuft.j.bezahlt && mailsAn(cMail, /Lastschrift ist unterwegs/).length === 1 && stornoLaeuft.status === 409 && asy.status === 200 && bCn.status === 'bezahlt' && bCn.zahlung.status === 'bezahlt', '27.6 SEPA: „Zahlung in Bearbeitung“ mit Mail, Verwerfen solange gesperrt; async_payment_succeeded → bezahlt');
    const bD = (await c.rufe('/api/partner/bestellungen', { paket: 'essential', konfigurator: KONF() })).j.bestellung;
    const sD = sessionAus((await c.rufe('/api/partner/bestellungen/' + bD.id + '/kasse', { zustimmung: ZUST })).j.url);
    st.abschliessen(sD, { zahlung: 'processing', art: 'sepa_debit' }); st.zahlungEingang(sD, { fehl: true });
    const asf = await hook('checkout.session.async_payment_failed', Object.assign({}, st.db.kassen.get(sD), { _p: undefined }));
    await new Promise((r) => setTimeout(r, 30));
    ok(asf.status === 200 && (await sp.bestellungHolen(bD.id)).zahlung.status === 'fehlgeschlagen' && mailsAn(cMail, /zurückgegeben/).length === 1, '27.6 async_payment_failed: Zahlung fehlgeschlagen, Status bleibt offen, Mail „erneut bezahlen“');

    /* ---------- 27.7 Statusmaschine: jeder nicht erlaubte Übergang 409, Vermerk wo Pflicht ---------- */
    const STATI = RB.STATUS, probe = (await c.rufe('/api/partner/bestellungen', { paket: 'essential', konfigurator: KONF() })).j.bestellung, ctxU = ctxD();
    const falscheErlaubt = [];
    let verboten = 0;
    for (const von of STATI) for (const nach of STATI) {
      if (RB.uebergang(von, nach, 'inhaber')) continue;
      await sp.bestellungAendern(probe.id, (z) => { z.status = von; });
      verboten++;
      const e = await best.uebergang(ctxU, probe.id, nach, { wer: 'inhaber', text: 'Vermerk für die Prüfung' }).then(() => null, (x) => x);
      if (!e || e.status !== 409) falscheErlaubt.push(von + '→' + nach);
    }
    await sp.bestellungAendern(probe.id, (z) => { z.status = 'freigabe'; z.vorschau = { version: 2 }; });
    const ohneVermerk = await best.uebergang(ctxU, probe.id, 'domain', { wer: 'inhaber' }).then(() => null, (x) => x);
    const liveOhne = await best.uebergang(ctxU, probe.id, 'live', { wer: 'inhaber' }).then(() => null, (x) => x);
    const offenBezahlt = await (async () => { await sp.bestellungAendern(probe.id, (z) => { z.status = 'offen'; }); return best.uebergang(ctxU, probe.id, 'bezahlt', { wer: 'inhaber' }).then(() => null, (x) => x); })();
    ok(!falscheErlaubt.length && verboten > 50, '27.7 Statusmaschine: alle ' + verboten + ' nicht erlaubten Übergänge antworten 409' + (falscheErlaubt.length ? ' (falsch: ' + falscheErlaubt.slice(0, 6).join(', ') + ')' : ''));
    ok(ohneVermerk && ohneVermerk.status === 400 && liveOhne && liveOhne.status === 409 && liveOhne.extra.fehlt === 'freigabe' && offenBezahlt && offenBezahlt.status === 409, '27.7 Vorbedingungen: Rücksprung ohne Vermerk 400, Live ohne Freigabe der aktuellen Vorschau und ohne Vermerk 409, „bezahlt“ nur über Stripe');

    /* ---------- 27.9 Abo beim Live-Schalten: ein Abo je Bestellung, Preis über lookup_key, Zahlungsmittel aus der Einrichtung ---------- */
    const betriebeVorher = JSON.stringify(((await sp.betriebeAlle()) || []).filter((b) => !(b.daten && b.daten.instanz)));
    await sp.bestellungAendern(bA.id, (z) => { z.status = 'freigabe'; z.vorschau = { version: 1, gesendet: new Date().toISOString(), freigabe: null }; });
    const fA = await c.rufe('/api/partner/bestellungen/' + bA.id + '/freigabe', { aktion: 'freigeben', version: 1 }); await c.warten();
    const fAlt = await c.rufe('/api/partner/bestellungen/' + bA.id + '/freigabe', { aktion: 'freigeben', version: 0 });
    ok(fA.status === 200 && fA.j.bestellung.vorschau.freigabe.version === 1 && fAlt.status === 409 && fAlt.j.neuLaden && mailsAn(inhaber(), /Freigabe erteilt/).length >= 1, '27.9 Freigabe nur für die aktuelle Vorschau-Version, Mail an den Inhaber');
    n0 = st.log.length;
    const m9 = marke(), ctxL = ctxD();
    const [l1, l2] = await Promise.all([best.uebergang(ctxL, bA.id, 'live', { wer: 'inhaber' }).then((x) => x, (e) => e), best.uebergang(ctxL, bA.id, 'live', { wer: 'inhaber' }).then((x) => x, (e) => e)]);
    await Promise.all(ctxL.offen);
    const aboPosts = st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/subscriptions'), ap = (aboPosts[0] || {}).p || {}, bL = await sp.bestellungHolen(bA.id);
    const preisAbo = st.db.preise.find((x) => x.id === ((ap.items || [])[0] || {}).price) || {};
    ok(aboPosts.length === 1 && preisAbo.lookup_key === 'eeziframes_paket_plus_' + Pk.preis('plus').monat * 100 + '_eur_monat' && preisAbo.unit_amount === Pk.preis('plus').monat * 100 && preisAbo.tax_behavior === 'exclusive' && ap.default_payment_method === bAnach.zahlung.pm && ap.off_session === 'true' && ap.payment_behavior === 'allow_incomplete' && ap.metadata.art === 'paket' && ap.metadata.bestellung === bA.id && !/betrieb/.test((aboPosts[0] || {}).roh || '') && aboPosts[0].idem === 'eeziframes-paketabo-' + bA.id + '-1', '27.9 Live schalten legt genau ein Abo an (Doppelklick): Preis über lookup_key des Pakets, Zahlungsmittel aus der Einrichtung, off_session, allow_incomplete, Metadaten art=paket, Idempotency-Key je Bestellung');
    ok(bL.status === 'live' && bL.abo_status === 'aktiv' && bL.abo.id && bL.live_am && ([l1, l2].filter((x) => x && x.status === 409).length === 1) && mailsAn(cMail, /ist live/, m9).length === 1, '27.9 Bestellung live, Abo aktiv; der zweite Klick 409; eine Mail „Ihr Konfigurator ist live“');
    const nochmal = await best.aboStarten(ctxD(), bA.id);
    ok(nochmal.schon && st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/subscriptions').length === 1, '27.9 aboStarten bei laufendem Abo legt keins dazu an');

    /* ---------- 27.10 Kulanz, Pause, Ende, Löschung mit vorgestellter Uhr; Kündigung ---------- */
    const subA = bL.abo.id, rechnungFuer = (sub, extra) => Object.assign({ id: 'in_p27_' + Math.random().toString(36).slice(2, 8), object: 'invoice', customer: partnerA.stripe_customer, hosted_invoice_url: 'https://invoice.stripe.com/i/offen27', parent: { subscription_details: { subscription: sub, metadata: { art: 'paket', bestellung: bA.id } } }, lines: { data: [{ period: { end: Math.floor(Date.now() / 1000) + 30 * 86400 } }] } }, extra || {});
    const pf1 = await hook('invoice.payment_failed', rechnungFuer(subA)); await new Promise((r) => setTimeout(r, 30));
    const bK = await sp.bestellungHolen(bA.id), kulanz = Date.parse(bK.abo.kulanz_bis);
    ok(pf1.status === 200 && bK.abo_status === 'zahlung_offen' && Math.abs(kulanz - (Date.now() + 14 * 864e5)) < 120000 && bK.abo.offeneRechnung === 'https://invoice.stripe.com/i/offen27' && mailsAn(cMail, /Zahlung für Ihren Konfigurator offen/).length === 1 && mailsAn(inhaber(), /Zahlung offen/).length >= 1, '27.10 Abbuchung fehlgeschlagen: Zahlung offen, Kulanz 14 Tage, Mails an Partner und Inhaber');
    await hook('invoice.payment_failed', rechnungFuer(subA));
    ok((await sp.bestellungHolen(bA.id)).abo.kulanz_bis === bK.abo.kulanz_bis, '27.10 Zweiter Fehlschlag verlängert die Kulanz nicht');
    const lauf = async (tage) => best.bestellungenLauf(umg.konfig(mitZeit(tage * 864e5)), sp, zd, mitZeit(tage * 864e5));
    await lauf(13);
    ok((await sp.bestellungHolen(bA.id)).status === 'live', '27.10 Tag 13: noch live');
    await lauf(15);
    const bP15 = await sp.bestellungHolen(bA.id);
    ok(bP15.status === 'pausiert' && bP15.abo.grund === 'zahlung' && bP15.pause_seit && mailsAn(cMail, /pausiert/).length === 1, '27.10 Tag 15: Kulanz vorbei → pausiert (Grund Zahlung), Mail');
    await hook('invoice.paid', rechnungFuer(subA, { status: 'paid' })); await new Promise((r) => setTimeout(r, 30));
    const bW = await sp.bestellungHolen(bA.id);
    ok(bW.status === 'live' && bW.abo_status === 'aktiv' && !bW.abo.kulanz_bis && mailsAn(cMail, /wieder online/).length === 1, '27.10 invoice.paid: wieder live, Abo aktiv, Kulanz gelöscht');
    await hook('invoice.payment_failed', rechnungFuer(subA));
    await lauf(15);
    const bP2 = await sp.bestellungHolen(bA.id);
    await sp.bestellungAendern(bA.id, (z) => { z.pause_seit = new Date().toISOString(); });
    n0 = st.log.length;
    await lauf(59);
    ok(bP2.status === 'pausiert' && (await sp.bestellungHolen(bA.id)).status === 'pausiert', '27.10 Pause bis 60 Tage bleibt pausiert');
    await lauf(61);
    const bE = await sp.bestellungHolen(bA.id), del = st.log.slice(n0).filter((e) => e.method === 'DELETE' && e.pfad === '/subscriptions/' + subA);
    ok(bE.status === 'beendet' && bE.abo_status === 'beendet' && bE.ende_am && del.length === 1 && st.db.abos.get(subA).status === 'canceled', '27.10 Pause länger als 60 Tage: Abo bei Stripe beendet, Bestellung beendet');
    const ordner = 'partner/' + partnerA.id + '/' + bA.id + '/';
    await fotos.ablage(k, 'bestellungen').ablegen(ordner + 'dtest27.png', PNG, 'image/png');
    await sp.bestellungAendern(bA.id, (z) => { z.ende_am = new Date().toISOString(); });
    await lauf(29);
    ok(!(await sp.bestellungHolen(bA.id)).verlauf.some((v) => v.art === 'geloescht'), '27.10 Vor Ablauf von 30 Tagen nach dem Ende: nichts gelöscht');
    await lauf(31);
    const bG = await sp.bestellungHolen(bA.id);
    ok(bG.verlauf.some((v) => v.art === 'geloescht') && !fotos.ablage(k, 'bestellungen').alle().some((p) => p.startsWith(ordner)) && !bG.dateien.length && bG.zahlung.status === 'bezahlt', '27.10 30 Tage nach dem Ende: Dateien und Instanzdaten gelöscht, Bestell- und Zahlungsdaten bleiben (Rechnungsnachweis)');
    /* Kündigung zum Periodenende → beendet; Abo bei Stripe ohne Kündigung beendet → pausiert mit Hinweis */
    const kd = klient(), kdMail = 'kuendigt@fenster27.example', bK1 = await vorbereiten(kd, kdMail, 'essential');
    const sK1 = sessionAus((await kd.rufe('/api/partner/bestellungen/' + bK1.id + '/kasse', { zustimmung: ZUST })).j.url); st.abschliessen(sK1);
    await kd.rufe('/api/partner/bestellungen/' + bK1.id + '/kasse/pruefen?session=' + sK1);
    await sp.bestellungAendern(bK1.id, (z) => { z.status = 'freigabe'; z.vorschau = { version: 1 }; });
    await best.uebergang(ctxD(), bK1.id, 'live', { wer: 'inhaber', text: 'Freigabe telefonisch am 22.10.' });
    const subK = (await sp.bestellungHolen(bK1.id)).abo.id;
    await hook('customer.subscription.updated', Object.assign({}, st.db.abos.get(subK), { cancel_at_period_end: true, default_payment_method: null }));
    const bKg = await sp.bestellungHolen(bK1.id);
    st.aboBeenden(subK);
    await hook('customer.subscription.deleted', Object.assign({}, st.db.abos.get(subK), { default_payment_method: null })); await new Promise((r) => setTimeout(r, 30));
    const bKe = await sp.bestellungHolen(bK1.id);
    ok(bKg.abo_status === 'gekuendigt' && bKg.abo.ende && mailsAn(kdMail, /Kündigung bestätigt/).length === 1 && bKe.status === 'beendet' && bKe.abo_status === 'beendet', '27.10 Kündigung zum Periodenende: gekündigt mit Mail; mit dem Ende des Abos ist der Vertrag beendet');
    const ab2 = klient(), bX = await vorbereiten(ab2, 'ausfall@fenster27.example', 'essential');
    const sX = sessionAus((await ab2.rufe('/api/partner/bestellungen/' + bX.id + '/kasse', { zustimmung: ZUST })).j.url); st.abschliessen(sX);
    await ab2.rufe('/api/partner/bestellungen/' + bX.id + '/kasse/pruefen?session=' + sX);
    await sp.bestellungAendern(bX.id, (z) => { z.status = 'freigabe'; z.vorschau = { version: 1, freigabe: { version: 1 } }; });
    await best.uebergang(ctxD(), bX.id, 'live', { wer: 'inhaber' });
    const subX = (await sp.bestellungHolen(bX.id)).abo.id; st.aboBeenden(subX);
    await hook('customer.subscription.deleted', Object.assign({}, st.db.abos.get(subX), { default_payment_method: null })); await new Promise((r) => setTimeout(r, 30));
    const bXe = await sp.bestellungHolen(bX.id);
    ok(bXe.status === 'pausiert' && bXe.abo_status === 'beendet' && bXe.verlauf.some((v) => v.art === 'hinweis' && /neu starten/.test(v.text)), '27.10 Abo bei Stripe ohne Kündigung beendet (Zahlungsausfall): pausiert, Hinweis „Abo neu starten“');
    const neuStart = await best.aboSteuern(ctxD(), bX.id, 'neu');
    const bXn = await sp.bestellungHolen(bX.id);
    ok(neuStart.ok && bXn.status === 'live' && bXn.abo.id !== subX && bXn.abo.n === 2 && st.log.some((e) => e.idem === 'eeziframes-paketabo-' + bX.id + '-2'), '27.10 „Abo neu starten“: neues Abo (Idempotency …-2), wieder live');

    /* Paketwechsel: Preis am Abo, nach oben die Differenz der Einrichtung als Posten; mit Instanz ändert er instanzen.paket */
    n0 = st.log.length;
    const pw = await best.paketWechseln(ctxD(), bX.id, 'plus', { differenz: true });
    const pwAbo = st.log.slice(n0).find((e) => e.method === 'POST' && e.pfad === '/subscriptions/' + bXn.abo.id), pwPosten = st.log.slice(n0).find((e) => e.method === 'POST' && e.pfad === '/invoiceitems');
    const preisPlus = st.db.preise.find((x) => x.lookup_key === 'eeziframes_paket_plus_' + Pk.preis('plus').monat * 100 + '_eur_monat') || {};
    const iId = await sp.instanzAnlegen({ slug: 'p27-wechsel-' + Date.now().toString(36), name: 'Wechsel GmbH', plz: '50667', paket: 'plus', bestellung: bX.id });
    await sp.bestellungAendern(bX.id, (z) => { z.instanz = iId; });
    const pw2 = await best.paketWechseln(ctxD(), bX.id, 'signature', {}), iNach = await sp.instanzHolen(iId);
    ok(pw.oben && pw.posten && pwAbo && pwAbo.p.items[0].price === preisPlus.id && pwAbo.p.proration_behavior === 'create_prorations' && pwPosten && pwPosten.p.amount === String((Pk.preis('plus').einrichtung - Pk.preis('essential').einrichtung) * 100) && pwPosten.p.metadata.art === 'paket' && !/betrieb/.test(pwPosten.roh) && pw2.ok && iNach.paket === 'signature' && (await sp.bestellungHolen(bX.id)).abo.paket === 'signature', '27.9 Paketwechsel: Abo-Preis des neuen Pakets (nach oben anteilig), Differenz der Einrichtung als Posten auf der nächsten Rechnung; mit Instanz ändert er instanzen.paket');
    /* nach unten mit laufendem Abo (Befund 10): Stripe-Preis sofort ohne Ausgleich, die Instanz erst zum Periodenende (abo.bis) */
    n0 = st.log.length;
    const cW = ctxD(), pw3 = await best.paketWechseln(cW, bX.id, 'plus', {}); await Promise.all(cW.offen);
    const iNach3 = await sp.instanzHolen(iId), bX3 = await sp.bestellungHolen(bX.id), pw3Abo = st.log.slice(n0).find((e) => e.method === 'POST' && e.pfad === '/subscriptions/' + bXn.abo.id), w3 = bX3.abo.wechsel || {};
    const mail3 = mailsAn('ausfall@fenster27.example', /Ihr Paket: EEZI Essential Plus/).pop() || {};
    ok(pw3.ok && !pw3.oben && pw3.wechsel && iNach3.paket === 'signature' && w3.paket === 'plus' && w3.von === 'signature' && w3.ab === bX3.abo.bis && Date.parse(w3.ab) > Date.now() + 20 * 864e5 && bX3.abo.paket === 'plus' && bX3.abo.monat === Pk.preis('plus').monat && pw3Abo && pw3Abo.p.items[0].price === preisPlus.id && pw3Abo.p.proration_behavior === 'none' && pw3Abo.p.metadata.paket === 'plus' && /bleibt Ihr Konfigurator im Paket/.test(mail3.html || '') && bX3.verlauf.some((v) => /wirkt ab/.test(v.text)),
      '27.9 Paketwechsel nach unten mit laufendem Abo: Stripe-Preis sofort ohne Ausgleich (proration none), instanzen.paket bleibt bis zum Periodenende, Vormerkung abo.wechsel { paket, von, ab = abo.bis }, Mail „bis … bleibt“');
    const pw4 = await best.paketWechseln(ctxD(), bX.id, 'plus', {});
    ok(pw4.gleich === true && pw4.wechsel && (await sp.bestellungHolen(bX.id)).verlauf.filter((v) => /wirkt ab/.test(v.text)).length === 1, '27.9 Derselbe Wechsel noch einmal ist ein Leerlauf (gleich, kein zweiter Vermerk)');
    /* Empfänger der Anfragen ändern: mindestens eine bestätigte Adresse bleibt; neue bekommen einen Bestätigungslink */
    await sp.instanzAendern(iId, (z) => { z.eingang = { mails: [{ mail: 'alt@wechsel.example', bestaetigt: new Date().toISOString() }] }; });
    const e1 = await ab2.rufe('/api/partner/bestellungen/' + bX.id + '/eingang', { mails: ['neu@wechsel.example'] });
    const e2 = await ab2.rufe('/api/partner/bestellungen/' + bX.id + '/eingang', { mails: ['alt@wechsel.example', 'neu@wechsel.example'] });
    const e3 = await ab2.rufe('/api/partner/bestellungen/' + bX.id + '/eingang', { mails: ['kaputt'] });
    const iE = await sp.instanzHolen(iId);
    ok(e1.status === 409 && e2.status === 200 && iE.eingang.mails.map((x) => x.mail).join() === 'alt@wechsel.example,neu@wechsel.example' && !iE.eingang.mails[1].bestaetigt && e2.j.eingang[0].bestaetigt === true && e3.status === 400 && e3.j.felder['eingang.0'], '27.12 Empfänger ändern: die letzte bestätigte Adresse bleibt (409), neue Adressen stehen unbestätigt an der Instanz, ungültige 400');
    /* Erinnerung an die Freigabe (3 und 7 Tage), unbezahlter Entwurf: Erinnerung nach 3 Tagen, gelöscht nach 30 Tagen ohne Änderung */
    const er = klient(), erMail = 'erinnerung@fenster27.example', bEr = await vorbereiten(er, erMail, 'essential');
    const bEnt = (await er.rufe('/api/partner/bestellungen', { paket: 'plus', konfigurator: KONF() })).j.bestellung;
    await sp.bestellungAendern(bEr.id, (z) => { z.status = 'freigabe'; z.vorschau = { version: 3, gesendet: new Date().toISOString(), link: 'https://vorschau.example/?vorschau=t' }; });
    const mE = marke();
    await lauf(2); const nach2 = mailsAn(erMail, /wartet auf Ihre Freigabe/, mE).length;
    await lauf(4); await lauf(5); const nach5 = mailsAn(erMail, /wartet auf Ihre Freigabe/, mE).length;
    await lauf(8); const nach8 = mailsAn(erMail, /wartet auf Ihre Freigabe/, mE).length;
    const entErinnert = mailsAn(erMail, /noch nicht abgeschlossen/, mE).length;
    const iVor31 = (await sp.instanzHolen(iId)).paket;
    await lauf(31);
    ok(nach2 === 0 && nach5 === 1 && nach8 === 2 && entErinnert === 1 && (await sp.bestellungHolen(bEnt.id)) === null && !!(await sp.bestellungHolen(bEr.id)), '27.10 Tageslauf: Erinnerung an die Freigabe nach 3 und 7 Tagen (je einmal); unbezahlter Entwurf nach 3 Tagen einmal erinnert, nach 30 Tagen ohne Änderung gelöscht');
    const bX31 = await sp.bestellungHolen(bX.id), mail31 = mailsAn('ausfall@fenster27.example', /Ihr Paket: EEZI Essential Plus/).pop() || {};
    ok(iVor31 === 'signature' && (await sp.instanzHolen(iId)).paket === 'plus' && !bX31.abo.wechsel && bX31.abo.paket === 'plus' && bX31.status === 'live' && bX31.verlauf.some((v) => v.von === 'system' && /wirksam \(Tageslauf\)/.test(v.text)) && /wie angekündigt/.test(mail31.html || ''), '27.10 Tageslauf nach dem Periodenende: der vorgemerkte Wechsel nach unten wird wirksam (Instanz Plus, Vormerkung weg, Verlauf, Mail); vorher blieb die Instanz Signature');

    /* ---------- 27.8 Altbestand: Betriebe unverändert, Paket-Ereignisse nie beim Altbestand, keine Posten in der Sammelrechnung ---------- */
    const betriebeNachher = JSON.stringify(((await sp.betriebeAlle()) || []).filter((b) => !(b.daten && b.daten.instanz)));
    n0 = st.log.length;
    const lauf0 = await konten.abrechnungslauf(k, sp, zd).catch((e) => ({ fehler: String(e && e.message) }));
    const paketKunden = new Set(Array.from(st.db.kunden.values()).filter((x) => x.metadata && x.metadata.art === 'paket').map((x) => x.id));
    const posten = st.log.slice(n0).filter((e) => e.method === 'POST' && /^\/invoice(item)?s/.test(e.pfad) && paketKunden.has(e.p.customer));
    const altEv = { type: 'invoice.paid', data: { object: { metadata: { betrieb: 'b1' }, subscription_details: { metadata: { betrieb: 'b1', plan: 'abo' } } } } };
    ok(betriebeVorher === betriebeNachher && lauf0 && !posten.length && !best.paketObjekt(altEv) && best.paketObjekt({ type: 'invoice.paid', data: { object: rechnungFuer('sub_x') } }) && best.paketObjekt({ type: 'checkout.session.completed', data: { object: { metadata: { art: 'einrichtung' } } } }), '27.8 Altbestand: nach allen Paket-Ereignissen alle Betriebe byteweise gleich, Sammelrechnung ohne Posten der Paket-Kunden, Weiche erkennt Paket-Objekte nur an art');

    /* ---------- 27.11 Kundenportal nur mit frischer Anmeldung ---------- */
    n0 = st.log.length;
    const po1 = await c.rufe('/api/partner/portal', {}), po2 = await c.rufe('/api/partner/portal', {}, { env: mitZeit(16 * 60000) }), po3 = await c.rufe('/api/partner/portal', {});
    const konf = st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/billing_portal/configurations'), sitz = st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/billing_portal/sessions');
    ok(po1.status === 200 && /^https:\/\/billing\.stripe\.com\//.test(po1.j.url) && po2.status === 401 && po2.j.frisch && po3.status === 200 && konf.length === 1 && konf[0].p.features.subscription_cancel.mode === 'at_period_end' && konf[0].p.features.payment_method_update.enabled === 'true' && sitz.length === 2 && sitz[0].p.customer === partnerA.stripe_customer, '27.11 Kundenportal (Rechnungen, Zahlungsmittel, Kündigung zum Periodenende): nur mit frischer Anmeldung, Konfiguration legt der Server einmal an');
    const re = await c.rufe('/api/partner/rechnungen'), reFremd = await fremd.rufe('/api/partner/rechnungen');
    ok(re.status === 200 && re.j.rechnungen.length >= 1 && re.j.rechnungen.every((x) => x.status && x.nr) && reFremd.j.rechnungen.length === 0, '27.11 Rechnungen lesend aus Stripe, nur die eigenen');

    /* ---------- 27.12 Nachrichten und Rückruf ---------- */
    const n = klient(), nMail = 'nachricht@fenster27.example'; await n.anmelden(nMail); await n.rufe('/api/partner/firma', Object.assign({}, FIRMA, { firma: 'Nachricht GmbH' }));
    const m12 = marke(), stati = [];
    for (let i = 0; i < 21; i++) stati.push((await n.rufe('/api/partner/nachrichten', { text: 'Frage ' + (i + 1) })).status);
    await n.warten();
    const zuLang = await n.rufe('/api/partner/nachrichten', { text: 'x'.repeat(2001) });
    ok(stati.slice(0, 20).every((x) => x === 200) && stati[20] === 429 && mailsAn(inhaber(), /Neue Nachricht/, m12).length === 20 && zuLang.status === 400, '27.12 Nachrichten: je eine Mail an den Inhaber, die 21. in einer Stunde 429, über 2000 Zeichen 400');
    const pN = await sp.partnerNachMail(nMail);
    await sp.nachrichtAnlegen({ partner: pN.id, von: 'inhaber', art: 'text', text: 'Antwort vom Inhaber' });
    const ung1 = (await n.rufe('/api/partner')).j.ungelesen; await n.rufe('/api/partner/nachrichten/gelesen', {}); const ung2 = (await n.rufe('/api/partner')).j.ungelesen;
    ok(ung1 === 1 && ung2 === 0, '27.12 Ungelesene Nachrichten des Inhabers gezählt, „gelesen“ getrennt je Empfänger');
    const r2 = klient(); await r2.anmelden('rueckruf@fenster27.example'); await r2.rufe('/api/partner/firma', Object.assign({}, FIRMA, { firma: 'Rückruf GmbH' }));
    const stand27 = (await r2.rufe('/api/partner/stand')).j, tag = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    let sa = new Date(); while (new Date(tag(sa) + 'T12:00:00Z').getUTCDay() !== 6) sa = new Date(sa.getTime() + 864e5);
    const rrSa = await r2.rufe('/api/partner/rueckruf', { tag: tag(sa), fenster: '10-12' }), rrAlt = await r2.rufe('/api/partner/rueckruf', { tag: tag(new Date(Date.now() - 864e5)), fenster: '10-12' }), rrFenster = await r2.rufe('/api/partner/rueckruf', { tag: stand27.werktage[1], fenster: '07-09' });
    const rr1 = await r2.rufe('/api/partner/rueckruf', { tag: stand27.werktage[1], fenster: '10-12', thema: 'Domain' }); await r2.warten();
    const rr2 = await r2.rufe('/api/partner/rueckruf', { tag: stand27.werktage[2], fenster: '14-16' });
    const rrWeg = await r2.rufe('/api/partner/rueckruf/' + rr1.j.rueckruf.id, null, { method: 'DELETE' }), rr3 = await r2.rufe('/api/partner/rueckruf', { tag: stand27.werktage[2], fenster: '14-16' });
    const pRR = await sp.partnerNachMail('rueckruf@fenster27.example'), offeneRR = (await sp.rueckrufeOffen()).filter((x) => x.partner === pRR.id);
    ok(stand27.werktage.length === 10 && stand27.werktage.every((t) => { const w = new Date(t + 'T12:00:00Z').getUTCDay(); return w >= 1 && w <= 5; }) && rrSa.status === 400 && rrSa.j.felder.tag && rrAlt.status === 400 && rrFenster.status === 400 && rr1.status === 200 && rr1.j.rueckruf.rueckruf.tel === FIRMA.tel && rr2.status === 400 && rrWeg.status === 200 && rr3.status === 200 && offeneRR.length === 1 && mailsAn(inhaber(), /Rückruf gewünscht/).length >= 1, '27.12 Rückruf: nur Werktage in den nächsten 10, nicht Samstag, nicht vergangen, nur feste Zeitfenster, höchstens einer offen, zurückziehen geht, Mail an den Inhaber');

    /* ---------- 27.13 Domain-Hinweis: .app über RDAP, .de über DNS (DoH), beides nachgestellt ---------- */
    const abfragen = [], fetchVorher = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
      const u = new URL(typeof url === 'string' ? url : url.url);
      if (u.hostname === 'data.iana.org') { abfragen.push('iana'); return new Response(JSON.stringify({ services: [[['app', 'dev'], ['https://pubapi.registry.google/rdap/']], [['com'], ['https://rdap.verisign.com/com/v1/']]] }), { status: 200 }); }
      if (u.hostname === 'pubapi.registry.google') { abfragen.push('rdap:' + u.pathname); return new Response('{}', { status: /frei/.test(u.pathname) ? 404 : 200 }); }
      if (u.hostname === 'cloudflare-dns.com') { abfragen.push('dns:' + u.searchParams.get('name')); return new Response(JSON.stringify({ Status: /frei/.test(u.searchParams.get('name')) ? 3 : 0 }), { status: 200 }); }
      return fetchVorher(url, init);
    };
    const d1 = await r2.rufe('/api/partner/domain-pruefen', { domain: 'HTTPS://WWW.Frei-Fenster27.App/x' }), d2 = await r2.rufe('/api/partner/domain-pruefen', { domain: 'vergeben-fenster27.app' });
    const d3 = await r2.rufe('/api/partner/domain-pruefen', { domain: 'frei-fenster27.de' }), d4 = await r2.rufe('/api/partner/domain-pruefen', { domain: 'vergeben-fenster27.de' });
    const d5 = await r2.rufe('/api/partner/domain-pruefen', { domain: 'eeziframes.com' });
    globalThis.fetch = fetchVorher;
    ok(d1.j.host === 'frei-fenster27.app' && d1.j.stand === 'frei' && d1.j.quelle === 'rdap' && d2.j.stand === 'vergeben' && d3.j.stand === 'frei' && d3.j.quelle === 'dns' && d4.j.stand === 'vergeben' && d4.j.quelle === 'dns' && /unverbindlich/.test(d1.j.text) && !abfragen.some((x) => /^rdap:.*\.de$/.test(x)) && d5.status === 400, '27.13 Domain-Hinweis: .app über RDAP (404 → wahrscheinlich frei, 200 → vergeben), .de über DoH (NXDOMAIN → frei), immer „unverbindlich“; eeziframes-Hosts abgewiesen');

    /* ---------- Selbststorno mit Erstattung (frisch), Entwurf verwerfen, Frage ohne Konto ---------- */
    const so = klient(), soMail = 'storno@fenster27.example', bSo = await vorbereiten(so, soMail, 'plus');
    const uSo = await up(so, bSo.id, 'ap', PNG, 'ansprechpartner.png'), partnerSo = await sp.partnerNachMail(soMail), ablageB2 = () => fotos.ablage(k, 'bestellungen').alle();
    const sSo = sessionAus((await so.rufe('/api/partner/bestellungen/' + bSo.id + '/kasse', { zustimmung: ZUST })).j.url); st.abschliessen(sSo);
    await so.rufe('/api/partner/bestellungen/' + bSo.id + '/kasse/pruefen?session=' + sSo);
    const soAlt = await so.rufe('/api/partner/bestellungen/' + bSo.id + '/stornieren', {}, { env: mitZeit(20 * 60000) });
    n0 = st.log.length;
    const soOk = await so.rufe('/api/partner/bestellungen/' + bSo.id + '/stornieren', {}); await so.warten();
    const refund = st.log.slice(n0).filter((e) => e.method === 'POST' && e.pfad === '/refunds'), bSoN = await sp.bestellungHolen(bSo.id);
    ok(soAlt.status === 401 && soAlt.j.frisch && soOk.status === 200 && refund.length === 1 && refund[0].p.payment_intent === bSoN.zahlung.pi && !refund[0].p.amount && bSoN.status === 'storniert' && bSoN.zahlung.status === 'erstattet' && mailsAn(soMail, /storniert/).length === 1, '27.6 Storno nach Zahlung nur mit frischer Anmeldung: volle Erstattung bei Stripe, Status storniert, Mail');
    /* Befund 9: Dateien einer stornierten Bestellung ohne Instanz. Ein verworfener Entwurf verliert sie sofort, ein bezahltes Storno nach
       loeschenNachEndeTage Tagen im Tageslauf */
    const bVer = (await so.rufe('/api/partner/bestellungen', { paket: 'plus', konfigurator: KONF() })).j.bestellung, uVer = await up(so, bVer.id, 'logo', PNG, 'logo.png');
    const pfadSo = uSo.j.datei ? best.dateiPfad(bSoN, uSo.j.datei) : '', pfadVer = uVer.j.datei ? best.dateiPfad({ partner: partnerSo.id, id: bVer.id }, uVer.j.datei) : '', vorVer = !!pfadVer && ablageB2().includes(pfadVer);
    const ver = await so.rufe('/api/partner/bestellungen/' + bVer.id + '/stornieren', {});
    ok(ver.status === 200 && ver.j.bestellung.status === 'storniert', '27.7 Entwurf verwerfen: offen → storniert');
    const bVerN = await sp.bestellungHolen(bVer.id);
    ok(uSo.status === 200 && uVer.status === 200 && vorVer && !ablageB2().includes(pfadVer) && !bVerN.dateien.length && bVerN.verlauf.some((v) => v.art === 'geloescht') && !ver.j.bestellung.dateien.length && ablageB2().includes(pfadSo) && bSoN.dateien.length === 1,
      '27.7 Verworfener Entwurf: seine Datei ist sofort aus der Ablage „bestellungen“ weg (Vermerk „gelöscht“); die Datei der bezahlten, stornierten Bestellung bleibt vorerst');
    await lauf(29);
    const so29 = ablageB2().includes(pfadSo) && (await sp.bestellungHolen(bSo.id)).dateien.length === 1;
    await lauf(40);
    const bSo40 = await sp.bestellungHolen(bSo.id);
    ok(so29 && !ablageB2().includes(pfadSo) && !bSo40.dateien.length && bSo40.verlauf.some((v) => v.art === 'geloescht' && /Storno/.test(v.text)) && bSo40.zahlung.status === 'erstattet' && bSo40.status === 'storniert', '27.10 Storno mit Erstattung ohne Instanz: 29 Tage nichts, nach 30 Tagen löscht der Tageslauf die Dateien (Vermerk „gelöscht“), Bestell- und Zahlungsdaten bleiben');
    const fr = klient(), mF = marke();
    const fr1 = await fr.rufe('/api/partner/frage', { name: 'Petra Fink', firma: 'Glaserei Fink', mail: 'petra@fink.example', text: 'Geht auch eine .de-Domain?', paket: 'plus' });
    const fr2 = await fr.rufe('/api/partner/frage', { name: 'Bot', mail: 'bot@spam.example', text: 'Kaufen Sie jetzt', fax: '0221 1' });
    const fr3 = await fr.rufe('/api/partner/frage', { name: '', mail: 'kaputt', text: '' });
    const formular = await api(new Request(B + '/api/partner/frage', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: B, 'x-forwarded-for': '10.27.250.1' }, body: 'name=Paul+Meise&mail=paul%40meise.example&text=Bitte+um+R%C3%BCckruf' }), ENV, { waitUntil: () => {} });
    const fhtml = await formular.text();
    await fr.warten();
    ok(fr1.status === 200 && fr2.status === 200 && fr3.status === 400 && fr3.j.felder.mail && mailsAn(inhaber(), /Frage zu den Paketen/, mF).length === 2 && formular.status === 200 && /text\/html/.test(formular.headers.get('content-type')) && /Danke/.test(fhtml) && /frame-ancestors 'none'/.test(formular.headers.get('content-security-policy') || ''), '27.12 Frage ohne Konto (auch als Formular ohne JavaScript): Mail an den Inhaber, Honigtopf schickt nichts, Feldfehler 400');
    /* Befund 8: Wer die Adresse eines Partners kennt, darf über das Formular keine Nachricht „des Partners“ in dessen Konto legen (Rückruf GmbH hat einen offenen Rückruf) */
    const ang = klient(), angriff = await ang.rufe('/api/partner/frage', { name: 'Angreifer', mail: 'rueckruf@fenster27.example', text: 'Bitte kündigen Sie mein Abo sofort.' }); await ang.warten();
    const nachAngriff = (await r2.rufe('/api/partner/nachrichten')).j.nachrichten || [], ausFormular = nachAngriff.filter((x) => /kündigen Sie mein Abo/.test(x.text)), offeneRRdanach = (await sp.rueckrufeOffen()).filter((x) => x.partner === pRR.id);
    ok(angriff.status === 200 && !nachAngriff.some((x) => x.von === 'partner' && /kündigen Sie mein Abo/.test(x.text)) && ausFormular.length === 1 && ausFormular[0].von === 'system' && ausFormular[0].art === 'frage' && /^Frage über das Formular ohne Anmeldung \(Absender nicht bestätigt\): Bitte kündigen/.test(ausFormular[0].text) && offeneRRdanach.length === 1,
      '27.12 Befund 8: Frage ohne Anmeldung mit der Adresse eines Partners landet nur als „system“ mit Vorsatz „Absender nicht bestätigt“ im Konto, nie als Nachricht des Partners; offene Rückrufe unberührt (' + JSON.stringify(ausFormular.map((x) => [x.von, x.art, x.text.slice(0, 60)])) + ')');
    /* Befund 10 (Anzeige): ein vorgemerkter Wechsel nach unten (abo.wechsel, von Gruppe B gesetzt) kommt im Kundenkonto an; ohne Vormerkung null */
    const we = klient(); await we.anmelden('wechsel@fenster27.example'); await we.rufe('/api/partner/firma', Object.assign({}, FIRMA, { firma: 'Wechsel GmbH' }));
    const neuW = await we.rufe('/api/partner/bestellungen', { paket: 'plus', konfigurator: KONF() }), bVor = neuW.j.bestellung || { id: 'fehlt' }, ohneW = bVor.abo || {};
    if (neuW.status === 200) await sp.bestellungAendern(bVor.id, (z) => { z.abo = Object.assign({}, z.abo, { wechsel: { paket: 'essential', von: 'plus', ab: '2026-12-01T00:00:00.000Z' } }); });
    const bWs = ((await we.rufe('/api/partner')).j.bestellungen || []).find((x) => x.id === bVor.id) || {};
    ok(neuW.status === 200 && ohneW.wechsel === null && bWs.abo && bWs.abo.wechsel && bWs.abo.wechsel.paket === 'essential' && bWs.abo.wechsel.von === 'plus' && bWs.abo.wechsel.ab === '2026-12-01T00:00:00.000Z',
      '27.9 Befund 10 (Anzeige): bestellungSicht reicht abo.wechsel { paket, von, ab } durch, ohne Vormerkung null (' + neuW.status + ' ' + JSON.stringify(neuW.status === 200 ? bWs.abo && bWs.abo.wechsel : neuW.j).slice(0, 200) + ')');

    /* ---------- 27.10 Aufbewahrung (Befund 21): Partner, Nachrichten und Bestellungen 3 Jahre nach dem Jahr des Vertragsendes ---------- */
    const JAHR = 365.25 * 864e5;
    const pfK = klient(), pfMail = 'frist@fenster27.example', bF = await vorbereiten(pfK, pfMail, 'essential');
    await pfK.rufe('/api/partner/nachrichten', { text: 'Frage vor dem Ende' }); await pfK.warten();
    await sp.bestellungAendern(bF.id, (z) => { z.status = 'beendet'; z.ende_am = new Date().toISOString(); });
    const psK = klient(), psMail = 'spaet@fenster27.example', bS2 = await vorbereiten(psK, psMail, 'essential');
    await sp.bestellungAendern(bS2.id, (z) => { z.status = 'beendet'; z.ende_am = new Date(Date.now() + 2 * JAHR).toISOString(); });
    const pF = await sp.partnerNachMail(pfMail), pS = await sp.partnerNachMail(psMail), pX = await sp.partnerNachMail('ausfall@fenster27.example');
    const nF0 = ((await sp.nachrichtenVon(pF.id)) || []).length, protVor = ((await sp.protokollLesen({ art: 'loeschen', anzahl: 50 })) || []).length;
    const bisJahr3 = await lauf(3 * 365), bleibt3 = !!(await sp.partnerHolen(pF.id)) && !!(await sp.bestellungHolen(bF.id));
    const lauf4 = await lauf(4 * 365 + 1);
    const protNach = ((await sp.protokollLesen({ art: 'loeschen', anzahl: 50 })) || []).filter((e) => e.daten && e.daten.partner === pF.id);
    ok(nF0 === 1 && bisJahr3 && !bisJahr3.partner && bleibt3 && lauf4.partner >= 1 && !(await sp.partnerHolen(pF.id)) && !(await sp.bestellungHolen(bF.id)) && !((await sp.nachrichtenVon(pF.id)) || []).length && protNach.length === 1 && /Aufbewahrung/.test(protNach[0].text),
      '27.10 Aufbewahrung: 3 Jahre nach dem Ende bleibt alles; 4 Jahre später sind Partner, Bestellung und Nachrichten des beendeten Vertrags gelöscht, mit Protokolleintrag');
    ok(!!(await sp.partnerHolen(pS.id)) && !!(await sp.bestellungHolen(bS2.id)) && !!(await sp.partnerHolen(pX.id)) && (await sp.bestellungHolen(bX.id)).status === 'live', '27.10 Aufbewahrung: ein Partner mit laufendem Abo und einer, dessen Vertrag erst vor 2 Jahren endete, bleiben samt Bestellung (Protokoll vorher ' + protVor + ' Einträge)');
  } finally { globalThis.fetch = fetchStripe; st.aus(); }

  /* ---------- 27.15 Instanz-Host: /partner/ und /api/partner/anmelden antworten 404 ---------- */
  const status = await h.api('plus.localhost', '/api/status');
  const p1 = await h.api('plus.localhost', '/partner/'), p2 = await h.api('plus.localhost', '/api/partner/anmelden', { body: { mail: 'x@y.example' }, origin: true });
  const p3 = await h.api('plus.localhost', '/api/partner/stand'), p4 = await h.api('localhost', '/partner/');
  ok(status.json && status.json.instanz === true && p1.status === 404 && p2.status === 404 && p3.status === 404 && !/eeziframes/i.test(p1.text) && p4.status === 200, '27.15 Auf einem Instanz-Host (Host-Weiche) antworten /partner/, /api/partner/anmelden und /api/partner/stand mit 404 ohne eeziframes; auf der Hauptdomain /partner/ 200');

  /* ---------- 27.14 Browser: Bestellung von „Paket wählen“ bis „Bezahlt“ (Zahlungs-Attrappe), Telefon und Schreibtisch ---------- */
  const basis = h.base('localhost');
  const kein = async (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const ctx = await h.browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await h.neueSeite(ctx, basis);
  const vorher = (await h.post()).length;
  await page.goto(basis + '/partner/#bestellen/plus');
  await page.waitForSelector('.p-paket[aria-pressed="true"]');
  const gewaehlt = await page.getAttribute('.p-paket[aria-pressed="true"]', 'data-v');
  const leisteText = await page.textContent('.p-leiste li[aria-current="step"]');
  ok(gewaehlt === 'plus' && /Paket/.test(leisteText) && (await page.textContent('main')).includes('Angebot nur für Unternehmer') && (await page.textContent('main')).includes('Vorläufige Preise') && await kein(page), '27.14 Schreibtisch: Paket aus dem Link vorgewählt, Schritt „Paket“ mit aria-current, Hinweis Unternehmer und vorläufige Preise, kein waagrechter Scroll');
  await page.click('[data-a="weiter"]');
  await page.fill('#f-mail', 'browser27@fenster.example');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#f-code');
  await page.fill('#f-code', '123456');
  await page.click('[data-a="code-pruefen"]');
  await page.waitForSelector('[data-form="firma"]');
  await page.click('[data-a="weiter"]');
  await page.waitForSelector('.p-f.fehlt');
  const fehlerFeld = await page.evaluate(() => ({ n: document.querySelectorAll('[aria-invalid="true"]').length, fokus: document.activeElement && document.activeElement.getAttribute('aria-invalid'), text: (document.querySelector('.p-f.fehlt .p-fehler') || {}).textContent || '' }));
  const gleicheRegel = await page.evaluate(() => JSON.stringify(window.Instanzregeln.bestellung.firma({}).fehler));
  ok(fehlerFeld.n >= 8 && fehlerFeld.fokus === 'true' && /Bitte/.test(fehlerFeld.text) && gleicheRegel === JSON.stringify(RE_firmaLeer()), '27.14 Fehlermeldungen am Feld (aria-invalid, Text darunter), Fokus auf dem ersten Fehler; der Browser prüft mit derselben Regel wie der Server');
  const tippe = async (id, v) => { await page.fill('#' + id, v); };
  await tippe('f-firma-firma', 'Fensterwerk Browser GmbH'); await tippe('f-firma-rechtsform', 'GmbH'); await page.selectOption('#f-firma-bundesland', 'NW');
  await tippe('f-firma-strasse', 'Testweg 1'); await tippe('f-firma-plz', '50667'); await tippe('f-firma-ort', 'Köln');
  await tippe('f-firma-ap', 'Bea Browser'); await tippe('f-firma-tel', '0221 999888'); await tippe('f-firma-vertretung', 'Bea Browser');
  await page.focus('#f-erreichbar-tage'); await page.keyboard.press('Space');
  await page.focus('#f-tag-di'); await page.keyboard.press('Enter');
  await page.selectOption('#f-firma-erreichbar-von', '09:00'); await page.selectOption('#f-firma-erreichbar-bis', '12:00');
  await page.click('[data-a="weiter"]');
  await page.waitForSelector('[data-form="konfigurator"]');
  ok(/Konfigurator/.test(await page.textContent('.p-leiste li[aria-current="step"]')) && (await page.$$('.p-leiste li.erledigt')).length === 3, '27.14 Unternehmen gespeichert (Tage per Tastatur gewählt), weiter zum Konfigurator; erledigte Schritte markiert');
  await tippe('f-konfigurator-name', 'Fensterwerk Browser'); await tippe('f-konfigurator-domains-0', 'HTTPS://WWW.Browser-Fenster27.App/x');
  await page.reload();
  await page.waitForSelector('[data-form="konfigurator"]');
  const nachReload = await page.inputValue('#f-konfigurator-domains-0');
  ok(nachReload === 'HTTPS://WWW.Browser-Fenster27.App/x' && (await page.inputValue('#f-konfigurator-eingang-0')) === 'browser27@fenster.example', '27.14 Zwischenspeichern: nach dem Neuladen derselbe Schritt mit der Eingabe; Eingangsadresse mit der Anmeldeadresse vorbelegt');
  await page.click('[data-a="weiter"]');
  await page.waitForSelector('[data-form="gestaltung"]');
  await page.setInputFiles('input[data-datei="logo"]', { name: 'logo.png', mimeType: 'image/png', buffer: PNG });
  await page.waitForSelector('.p-datei');
  await page.fill('#f-gestaltung-titel', 'Fenster vom Werk');
  await page.click('[data-a="weiter"]');
  await page.waitForSelector('[data-form="pruefen"]');
  const zus = await page.textContent('main');
  ok(zus.includes('browser-fenster27.app') && zus.includes('hochgeladen') && zus.includes('199') && /Kostenpflichtig bestellen/.test(await page.textContent('[data-a="kasse"]')), '27.14 Logo hochgeladen; Prüfen zeigt die normalisierte Domain, das Logo und den Preis, Knopf „Kostenpflichtig bestellen“');
  await page.click('[data-a="kasse"]');
  await page.waitForSelector('.p-check.fehlt');
  ok((await page.$$('.p-check.fehlt')).length === 3, '27.14 Ohne die drei Häkchen (Unternehmer, Paketbedingungen, AV-Vertrag) keine Bestellung, Fehler am Häkchen');
  for (const id of ['f-zustimmung-unternehmer', 'f-zustimmung-agb', 'f-zustimmung-avv']) { await page.focus('#' + id); await page.keyboard.press('Space'); }
  await Promise.all([page.waitForURL(/\/partner\/(\?kasse=test_[^#]+)?#bestellung\//), page.click('[data-a="kasse"]')]);
  await page.waitForSelector('.p-danke');
  const danke = await page.textContent('.p-danke h1');
  await h.foto(page, '27-danke-schreibtisch');
  await page.click('[data-a="konto"]');
  await page.waitForSelector('.p-verlauf');
  const leiste2 = await page.evaluate(() => ({ aktuell: (document.querySelector('.p-verlauf li[aria-current="step"]') || {}).textContent || '', erledigt: document.querySelectorAll('.p-verlauf li.erledigt').length, url: location.href }));
  await h.foto(page, '27-konto-schreibtisch');
  ok(/bezahlt/.test(danke) && /Bezahlt/.test(leiste2.aktuell) && leiste2.erledigt === 1 && !/kasse=/.test(leiste2.url) && await kein(page), '27.14 Rückkehr aus der Kasse: „Danke, die Einrichtung ist bezahlt“, Statusleiste mit aria-current auf „Bezahlt“, Adresse ohne Kassen-Kennung');
  await page.waitForTimeout(300);
  const neuePost = (await h.post()).slice(vorher);
  ok(neuePost.some((m) => m.an === 'browser27@fenster.example' && /Eingangsbestätigung/.test(m.betreff) && m.anhaenge.length === 2) && neuePost.some((m) => m.an === 'browser27@fenster.example' && /bezahlt/.test(m.betreff)) && neuePost.some((m) => /Bestellung bezahlt/.test(m.betreff) && m.an !== 'browser27@fenster.example'), '27.14 Mails an Partner (Eingangsbestätigung mit zwei PDFs, Zahlung) und Inhaber (Bestellung bezahlt) in /api/test/post');
  h.sauber(page, '27.14 Bestellung im Browser ohne Konsolenfehler, ohne fremde Anfragen, ohne Fehlerantworten');
  await ctx.close();

  const tel = await h.browser.newContext(h.telefon);
  const tp = await h.neueSeite(tel, basis);
  await tp.goto(basis + '/partner/#bestellen/essential');
  await tp.waitForSelector('.p-paket');
  const telStart = await kein(tp);
  await tp.click('[data-a="weiter"]');
  await tp.fill('#f-mail', 'browser27@fenster.example'); await tp.click('[data-a="code-senden"]');
  await tp.waitForSelector('#f-code'); await tp.fill('#f-code', '123456'); await tp.click('[data-a="code-pruefen"]');
  await tp.waitForSelector('[data-form="konfigurator"]');
  const telKonf = await kein(tp);
  await h.foto(tp, '27-konfigurator-telefon');
  await tp.goto(basis + '/partner/#uebersicht');
  await tp.waitForSelector('.p-bestellkarte');
  await tp.click('.p-bestellkarte');
  await tp.waitForSelector('.p-verlauf');
  const senkrecht = await tp.evaluate(() => getComputedStyle(document.querySelector('.p-verlauf')).flexDirection);
  const telKonto = await kein(tp);
  await h.foto(tp, '27-konto-telefon');
  await tp.click('[data-a="rueckruf-auf"]');
  await tp.waitForSelector('#f-rr-tag');
  await tp.click('[data-a="rueckruf-senden"]');
  await tp.waitForSelector('[data-a="rueckruf-weg"]');
  ok(telStart && telKonf && telKonto && senkrecht === 'column' && await kein(tp), '27.14 Telefon (390 px): Paketwahl, Konfigurator (angemeldet geht es mit dem nächsten offenen Schritt weiter), Konto mit senkrechter Statusleiste und Rückruf, nirgends waagrechter Scroll');
  h.sauber(tp, '27.14 Telefon ohne Konsolenfehler und fremde Anfragen');
  await tel.close();
};
/* Feldfehler der leeren Firma, wie der Server sie meldet (gleiche Datei instanzregeln.js) */
function RE_firmaLeer() { return globalThis.Instanzregeln.bestellung.firma({}).fehler; }

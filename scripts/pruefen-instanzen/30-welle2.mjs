// eeziframes · Prüfabschnitt 30, Teil Welle 2 (Integrator): Verträge zwischen Strang B (App im Instanz-Modus, einladung.js) und Strang C
// (Zentrale) im echten Ablauf auf einem eigenen Testserver: Chromium auf http://<domain>.localhost:PORT, API mit Kopfzeile Host.
// Ablauf: Plus-Bestellung mit SVG-Logo, Foto und Farbe (Kundenkonto, D) → Zentrale: Einrichtung, Instanz, Domain (C über A) → Gestaltung
// aus der Bestellung im Browser; die Vorschau im Telefonrahmen der Zentrale ist dieselbe Startseite wie in der App (einladung.js o.instanz:
// „Fensterplaner von“, Kicker, Überschrift mit grünem Wort, Fotos, Kennzeichnung des Pakets) → Vorschau-Link aus der Zentrale: App mit Band,
// Senden ergibt eine Testanfrage, die in der Versandliste der Zentrale steht → Testanfrage zugestellt, Freigabe, live → App mit Logo, Fotos
// und Firmenfarbe aus der Zentrale, Anfrage im Browser bis zur Bestätigung, Mail mit PDF → Versandliste ohne Kundendaten, „erneut senden“ →
// Pause in der Zentrale, die offene App zeigt den Kontakt und nimmt nichts an → Fortsetzen → Paketwechsel Plus → Signature: App ohne
// eeziframes → „Als Kunde öffnen“ (/?vorschau=1, Vorgabe für das Dashboard, Strang E) bleibt auf dem Instanz-Host in der Adresse.
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { werkzeug } from './23.mjs';

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
/* kleines PNG (einfarbig) */
function png(w, h, rgb) {
  const crc = (b) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
  const block = (typ, daten) => { const l = Buffer.alloc(4); l.writeUInt32BE(daten.length); const t = Buffer.concat([Buffer.from(typ), daten]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(t)); return Buffer.concat([l, t, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const zeile = Buffer.concat([Buffer.from([0]), Buffer.from(new Array(w).fill(rgb).flat())]), roh = Buffer.concat(new Array(h).fill(zeile));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), block('IHDR', ihdr), block('IDAT', zlib.deflateSync(roh)), block('IEND', Buffer.alloc(0))]);
}
const SVG_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect x="4" y="4" width="72" height="72" rx="14" fill="#2f6f4f"/><text x="92" y="54" font-family="Arial" font-size="40" font-weight="700" fill="#161616">Ahorn</text></svg>';

export default async (h) => {
  const ok = (b, t) => h.ok(b, '30.W2 ' + t), eezi = /eeziframes/i;
  const offen = [];
  try {
    const X = await h.server({}), T = werkzeug(h, X), B = X.base('localhost');
    const stempel = Date.now().toString(36).slice(-5), MAIL = 'w2-' + stempel + '@fenster30.example', EIN = 'eingang-w2-' + stempel + '@ahorn30.example', HOST = 'ahorn-w2-' + stempel + '.localhost';
    const START = { kicker: 'Ahorn Fenster · seit 1994', ueberschrift: 'Neue Fenster für Ihr Haus', text: 'Planen Sie in Ruhe, wir melden uns mit dem Angebot.' };
    const cookieAus = (r) => (r.cookies || []).map((c) => c.split(';')[0]).filter((c) => !/=$/.test(c)).join('; ');
    let netz = 40;
    const kontext = (o) => { const c = h.browser.newContext(Object.assign({ acceptDownloads: true, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': '203.0.113.' + (++netz) } }, o || {})); offen.push(c); return c; };
    const bis = async (s, fn, ms, arg) => { const ende = Date.now() + (ms || 10000); while (Date.now() < ende) { if (await s.evaluate(fn, arg).catch(() => false)) return true; await warte(200); } return false; };

    /* ---------- Bestellung (Kundenkonto, Strang D): Plus, SVG-Logo, Foto, Farbe; bezahlt (Attrappe) ---------- */
    await X.api('localhost', '/api/partner/anmelden', { body: { mail: MAIL }, origin: true });
    const an = await X.api('localhost', '/api/partner/bestaetigen', { body: { mail: MAIL, code: '123456' }, origin: true }), ck = cookieAus(an);
    const pa = (pfad, body, m) => X.api('localhost', pfad, { body: body, method: m, cookie: ck, origin: true });
    await pa('/api/partner/firma', { firma: 'Fensterbau Ahorn ' + stempel + ' GmbH', rechtsform: 'GmbH', strasse: 'Ahornweg 3', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'ahorn-fenster.de', ap: 'Petra Ahorn', rolle: 'GF', tel: '0221 445566', vertretung: 'Petra Ahorn', register: 'AG Köln HRB 2', erreichbar: { tage: ['mo', 'di', 'mi', 'do', 'fr'], von: '08:00', bis: '18:00', kanal: 'telefon' } });
    const b0 = (await pa('/api/partner/bestellungen', { paket: 'plus', konfigurator: { name: 'Ahorn Fenster', domains: [HOST.replace('.localhost', '.app')], eingang: [EIN] } })).json.bestellung;
    await pa('/api/partner/bestellungen/' + b0.id, { gestaltung: { farben: ['#2f6f4f'], titel: 'Fenster von Ahorn', begruessung: 'Willkommen bei Ahorn', notiz: '' } }, 'PATCH');
    await pa('/api/partner/bestellungen/' + b0.id + '/datei', { art: 'logo', name: 'logo.svg', daten: Buffer.from(SVG_LOGO).toString('base64') });
    await pa('/api/partner/bestellungen/' + b0.id + '/datei', { art: 'foto', name: 'werkstatt.png', daten: png(320, 200, [170, 130, 80]).toString('base64') });
    const stand = (await X.api('localhost', '/api/partner/stand')).json.stand || (await import(new URL('../../functions/api/recht.js', import.meta.url).href)).PAKET_STAND;
    const ka = await pa('/api/partner/bestellungen/' + b0.id + '/kasse', { zustimmung: { unternehmer: true, agb: stand, avv: true } });
    const kp = await pa('/api/partner/bestellungen/' + b0.id + '/kasse/pruefen?session=' + new URL(ka.json.url).searchParams.get('kasse'));
    ok(kp.json && kp.json.status === 'bezahlt', 'Plus-Bestellung mit SVG-Logo, Foto und Farbe ist bezahlt');

    /* ---------- Zentrale (Strang C) über die API: Einrichtung, Instanz, Domain ---------- */
    const Z = await X.zentrale(), za = (pfad, body) => Z.api(pfad, body === undefined ? {} : { body: body });
    await za('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'einrichtung' });
    const iA = await za('/api/zentrale/bestellungen/' + b0.id + '/instanz', {}), iid = iA.json && iA.json.instanz && iA.json.instanz.id;
    await za('/api/zentrale/instanzen/' + iid + '/host', { host: HOST });
    const dp = await za('/api/zentrale/instanzen/' + iid + '/domain/pruefen', { host: HOST });
    const dg = await za('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'domain' });
    const zuVorher = await X.api(HOST, '/', { headers: { accept: 'text/html' } });
    ok(iA.status === 200 && !!iid && dp.json && dp.json.pruefung && dp.json.pruefung.ok && dg.status === 200 && zuVorher.status === 503, 'Zentrale: Instanz aus der Bestellung, Domain ' + HOST + ' geprüft und gesichert; ohne Vorschau antwortet die Domain 503');

    /* ---------- Gestaltung im Browser der Zentrale: aus der Bestellung übernehmen, Vorschau im Telefonrahmen ---------- */
    const ctxZ = await kontext({ viewport: { width: 1280, height: 900 } }), sZ = await h.neueSeite(ctxZ, B);
    await sZ.goto(B + '/zentrale/#instanz/' + iid + '/gestaltung', { waitUntil: 'networkidle' });
    await sZ.fill('#z-pw', h.PASSWORT); await sZ.click('form[data-form="anmelden"] button[type="submit"]');
    await sZ.waitForSelector('[data-act="i-uebernehmen"][data-art="logo"]');
    await sZ.click('[data-act="i-uebernehmen"][data-art="logo"]'); await sZ.waitForFunction(() => !!document.querySelector('.z-slot-bild.logo img'), null, { timeout: 15000 });
    await sZ.click('[data-act="i-uebernehmen"][data-art="foto"]'); await sZ.waitForFunction(() => document.querySelectorAll('.z-slot-bild:not(.logo) img').length >= 1, null, { timeout: 15000 });
    await sZ.fill('#z-g-kicker', START.kicker); await sZ.fill('#z-g-ueber', START.ueberschrift); await sZ.fill('#z-g-text', START.text);
    await sZ.click('form[data-form="i-entwurf"] button[type="submit"]');
    await bis(sZ, (k) => { const t = document.querySelector('.z-telefon .ein-start-in > .eyebrow.kicker'); return !!t && t.textContent === k && !!document.querySelector('.z-telefon .ein-bilder img[src^="blob:"]'); }, 15000, START.kicker);
    const zv = await sZ.evaluate(() => {
      const t = document.querySelector('.z-telefon'), q = (s) => t.querySelector(s), tx = (s) => ((q(s) || {}).textContent || '').trim();
      return { absender: tx('.ein-abs small'), name: tx('.ein-abs b'), logo: !!q('.ein-abs .ein-zeichen.logo img[src^="blob:"]'), kicker: tx('.ein-start-in > .eyebrow.kicker'), h1: tx('.ein-start-in > h1'), gruen: tx('.ein-start-in > h1 .ak'), h1n: t.querySelectorAll('h1').length,
        gruss: tx('.ein-gruss'), bilder: t.querySelectorAll('.ein-bilder img[src^="blob:"]').length, standard: !!q('.ein-bild'), kz: tx('.ein-kz'), kzKlasse: (q('.ein-kz') || {}).className || '', akzent: (t.getAttribute('style') || '').replace(/^.*--accent:\s*([^;]+);.*$/, '$1'),
        link: /Link|Übermittelt mit/.test(t.innerText), knoepfe: t.querySelectorAll('button, a[href]').length };
    });
    await h.foto(sZ, '30w2-zentrale-vorschau');
    ok(zv.absender === 'Fensterplaner von' && zv.name === 'Ahorn Fenster' && zv.logo && zv.kicker === START.kicker && zv.h1 === START.ueberschrift && zv.gruen === 'Haus' && zv.h1n === 1 && zv.gruss === START.text && zv.bilder === 1 && !zv.standard && zv.kz === 'Konfigurator von eeziframes' && /dezent/.test(zv.kzKlasse) && !zv.link && zv.knoepfe === 0,
      'Vorschau der Zentrale nach dem Vertrag von einladung.js: „Fensterplaner von“ mit Logo, eigener Kicker, Überschrift mit grünem letztem Wort, Text, ein Foto aus dem Entwurf, dezente Kennzeichnung, nichts über Links, nichts bedienbar (' + JSON.stringify(zv) + ')');
    await sZ.click('[data-act="i-veroeffentlichen"]'); await bis(sZ, () => /Veröffentlicht: Fassung/.test(document.body.innerText), 15000);
    h.sauber(sZ, 'Zentrale: Gestaltung ohne Konsolenfehler, CSP-Verstöße oder fremde Anfragen');

    /* Eingangsadresse bestätigen (Link aus der Mail, wie der Betrieb) */
    const best = (await X.post()).filter((m) => (Array.isArray(m.an) ? m.an : [m.an]).includes(EIN) && /bestätigen/i.test(m.betreff)).pop(), lk = best && /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/.exec(best.html || '');
    const bu = lk ? new URL(lk[1].replace(/&amp;/g, '&')) : null, bst = bu ? await X.api('localhost', bu.pathname + bu.search, { headers: { accept: 'text/html' } }) : { status: 0 };

    /* ---------- Vorschau-Link aus der Zentrale: die App mit Band, Senden ergibt eine Testanfrage ---------- */
    const vs = await za('/api/zentrale/bestellungen/' + b0.id + '/vorschau', {}), vLink = vs.json && vs.json.link ? String(vs.json.link).replace(/^https:\/\/[^/]+/, X.base(HOST)) : '';
    const ctxV = await kontext(h.telefon), sV = await h.neueSeite(ctxV, X.base(HOST));
    await sV.goto(vLink, { waitUntil: 'networkidle' }); await sV.waitForTimeout(400);
    const app = (s) => s.evaluate(() => {
      const tx = (sel) => ((document.querySelector(sel) || {}).textContent || '').trim();
      return { url: location.href, band: tx('.inst-vorschau'), logo: (document.querySelector('.hdr-inst img') || { getAttribute: () => '' }).getAttribute('src') || '', name: tx('.hdr-inst .hdr-name'), kicker: tx('.ein-start-in > .eyebrow.kicker'), h1: tx('.ein-start-in > h1'),
        gruen: tx('.ein-start-in > h1 .ak'), gruss: tx('.ein-gruss'), bilder: Array.from(document.querySelectorAll('.ein-bilder img')).map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })), kz: tx('.ein-kz'),
        akzent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), konfig: window.KONFIG.instanz, text: document.body.innerText, titel: document.title };
    });
    const v1 = await app(sV);
    await h.foto(sV, '30w2-app-vorschau');
    ok(vs.status === 200 && /Vorschau/.test(v1.band) && !/vorschau=/.test(v1.url) && /^\/marke\/\d+\/logo\.png$/.test(v1.logo) && v1.bilder.length === 1 && v1.bilder.every((b) => /^\/marke\/\d+\/start-1\.jpg$/.test(b.src) && b.ok),
      'Vorschau-Link der Zentrale öffnet die App mit Band „Vorschau“, Logo und Foto aus der veröffentlichten Fassung (' + v1.logo + ')');
    ok(v1.kicker === zv.kicker && v1.h1 === zv.h1 && v1.gruen === zv.gruen && v1.gruss === zv.gruss && v1.kz === zv.kz && v1.akzent === zv.akzent && v1.akzent === v1.konfig.akzent,
      'App und Vorschau der Zentrale zeigen dieselbe Startseite: Kicker, Überschrift, grünes Wort, Text, Kennzeichnung, Akzentfarbe ' + v1.akzent);
    const fensterSpeichern = (s, name) => s.evaluate((n) => { Object.assign(S.win, { name: n, mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, name);
    const kontaktSenden = async (s, k) => {
      await s.evaluate(() => go('anfrage')); await s.waitForSelector('.scr[data-screen="anfrage"]');
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage2"]');
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage3"]');
      await s.fill('#t-name', k.name); if (k.tel) await s.fill('#t-tel', k.tel); if (k.mail) await s.fill('#t-mail', k.mail);
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="blatt"]');
      await s.click('.bb .btn.primary'); await s.waitForFunction(() => S.sent && S.sent.nr, null, { timeout: 30000 }); await s.waitForTimeout(300);
      return s.evaluate(() => ({ nr: S.sent.nr, art: S.sent.art || '', code: S.betrieb.code, text: document.querySelector('.scr').innerText }));
    };
    await sV.click('[data-act="new"]'); await sV.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(sV, 'Probe'); await sV.waitForSelector('.scr[data-screen="fertig"]');
    const tv = await kontaktSenden(sV, { name: 'Familie Probe', mail: 'probe-w2@beispiel.de' });
    const testMail = (await T.warteMail((m) => (m.betreff || '').includes('Familie Probe') && (Array.isArray(m.an) ? m.an : [m.an]).includes(EIN), 15000))[0];
    const sichtV = (await za('/api/zentrale/instanzen/' + iid)).json.instanz, zeileV = (sichtV.versand || []).find((z) => z.code === tv.code);
    ok(bst.status === 200 && tv.art === 'test' && /^TEST-/.test(tv.nr) && !!testMail && /^\[Test\]/.test(testMail.betreff) && !!zeileV && zeileV.art === 'test',
      'Senden in der Vorschau: Testanfrage ' + tv.nr + ' geht mit „[Test]“ an die bestätigte Adresse und steht in der Versandliste der Zentrale');
    h.sauber(sV, 'App in der Vorschau ohne Fehler');

    /* ---------- Testanfrage zugestellt, Freigabe, live ---------- */
    const t1 = await za('/api/zentrale/instanzen/' + iid + '/test', {}), tc = t1.json && t1.json.test && t1.json.test.code;
    const zeileT = tc ? await T.warteZeile(tc, (z) => !!(z.versand || {}).id, 8000) : null;
    const umg = await import(new URL('../../functions/api/umgebung.js', import.meta.url).href), GEHEIM = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
    if (zeileT && zeileT.versand.id) { const body = JSON.stringify({ type: 'email.delivered', data: { email_id: zeileT.versand.id } }), id = 'msg_' + crypto.randomUUID(), ts = String(Math.floor(Date.now() / 1000)); await X.api('localhost', '/api/post/webhook', { body: body, headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': 'v1,' + crypto.createHmac('sha256', Buffer.from(GEHEIM.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64') } }); }
    const vers = (await X.api('localhost', '/api/partner', { cookie: ck })).json.bestellungen.find((x) => x.id === b0.id).vorschau.version;
    const fg = await pa('/api/partner/bestellungen/' + b0.id + '/freigabe', { aktion: 'freigeben', version: vers });
    const live = await za('/api/zentrale/bestellungen/' + b0.id + '/live', {});
    ok(t1.status === 200 && fg.status === 200 && live.status === 200 && live.json.bestellung.status === 'live', 'Testanfrage der Zentrale zugestellt, Freigabe im Kundenkonto, Live geschaltet (' + live.status + (live.json && live.json.fehler ? ': ' + live.json.fehler : '') + ')');

    /* ---------- Live: Anfrage im Browser, Mail mit PDF, Versandliste ohne Kundendaten, erneut senden ---------- */
    const ctxK = await kontext({ viewport: { width: 1280, height: 900 } }), sK = await h.neueSeite(ctxK, X.base(HOST));
    await sK.goto(X.base(HOST) + '/', { waitUntil: 'networkidle' }); await sK.waitForTimeout(400);
    const k1 = await app(sK);
    ok(!k1.band && k1.logo === v1.logo && k1.name === 'Ahorn Fenster' && k1.bilder.length === 1 && k1.bilder[0].ok && k1.kicker === START.kicker && k1.kz === 'Konfigurator von eeziframes' && k1.akzent === zv.akzent && k1.titel === 'Fenster von Ahorn',
      'Live: App ohne Band, mit Logo, Foto, Startansicht und Firmenfarbe aus der Zentrale; Titel aus der Bestellung „' + k1.titel + '“' + (k1.band || !k1.bilder.length ? ' (' + JSON.stringify({ band: k1.band, logo: k1.logo, name: k1.name, bilder: k1.bilder, kicker: k1.kicker, kz: k1.kz, akzent: k1.akzent }) + ')' : ''));
    const ati = await X.api(HOST, '/apple-touch-icon.png'), man = await X.api(HOST, '/manifest.webmanifest'), manI = ((man.json || {}).icons || []).map((x) => x.src);
    ok(ati.status === 200 && ati.buf.slice(1, 4).toString() === 'PNG' && ['192', '512'].every((n) => manI.some((u) => new RegExp('^/marke/\\d+/icon' + n + '\\.png$').test(u))),
      'App-Symbole aus dem Logo der Zentrale (Leinwand → icon180/192/512): Touch-Icon als PNG, Manifest mit /marke/<v>/icon192.png und icon512.png');
    await sK.click('[data-act="new"]'); await sK.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(sK, 'Wohnzimmer'); await sK.waitForSelector('.scr[data-screen="fertig"]');
    const kunde = { name: 'Familie Linde', tel: '0171 7654321', mail: 'linde-w2@beispiel.de' };
    const gs = await kontaktSenden(sK, kunde);
    const mailK = (await T.warteMail((m) => (m.betreff || '').includes('Familie Linde'), 15000, { anhaenge: true }))[0];
    const pdf = mailK && (mailK.anhaenge || []).find((a) => a.typ === 'application/pdf');
    ok(/^P-\d{4}-\d{3}$/.test(gs.nr) && /Ahorn Fenster/.test(gs.text) && !!mailK && (Array.isArray(mailK.an) ? mailK.an : [mailK.an]).includes(EIN) && mailK.antwortAn === kunde.mail && !!pdf,
      'Anfrage ' + gs.nr + ' im Browser bis zur Bestätigung; Mail mit PDF an die bestätigte Adresse, Antwort an den Kunden');
    const sichtK = await za('/api/zentrale/instanzen/' + iid), zeileK = ((sichtK.json.instanz || {}).versand || []).find((z) => z.code === gs.code);
    const erneut = await za('/api/zentrale/instanzen/' + iid + '/anfragen/' + gs.code + '/erneut', {});
    const zweite = await T.warteMail((m) => (m.betreff || '').includes('Familie Linde'), 8000);
    ok(!!zeileK && zeileK.nr === gs.nr && zeileK.art === 'website' && !/Linde|0171 7654321|linde-w2@/.test(sichtK.text) && erneut.status === 200 && zweite.length >= 2,
      'Versandliste der Zentrale: ' + gs.nr + ' ohne Name, Telefon und E-Mail des Kunden; „erneut senden“ schickt die Mail noch einmal');
    h.sauber(sK, 'App live ohne Fehler');

    /* ---------- Pause in der Zentrale, während die App offen ist; Fortsetzen ---------- */
    const ctxP = await kontext(h.telefon), sP = await h.neueSeite(ctxP, X.base(HOST));
    await sP.goto(X.base(HOST) + '/', { waitUntil: 'networkidle' }); await sP.waitForTimeout(300);
    await sP.click('[data-act="new"]'); await sP.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(sP, 'Küche'); await sP.waitForSelector('.scr[data-screen="fertig"]');
    const pause = await za('/api/zentrale/instanzen/' + iid + '/status', { aktion: 'pausieren', grund: 'Prüfung Welle 2' });
    await sP.evaluate(() => { go('fertig'); linkPruefen(); });
    const zuErkannt = await bis(sP, () => S.instZu === 'pausiert', 8000);
    const pz = await sP.evaluate(() => ({ screen: S.screen, text: document.querySelector('.scr').innerText, n: S.windows.length }));
    await h.foto(sP, '30w2-app-pausiert');
    const seiteP = await X.api(HOST, '/', { headers: { accept: 'text/html' } });
    ok(pause.status === 200 && pause.json.instanz.status === 'pausiert' && zuErkannt && pz.screen === 'home' && /gerade nicht erreichbar/i.test(pz.text) && /Ahorn/.test(pz.text) && pz.n === 1 && seiteP.status === 503,
      'Pause aus der Zentrale: die offene App zeigt „gerade nicht erreichbar“ mit Kontakt, die Planung bleibt; die Domain antwortet 503');
    sP.probleme = sP.probleme.filter((p) => !/HTTP 503|status of 503/.test(p));
    const weiter = await za('/api/zentrale/instanzen/' + iid + '/status', { aktion: 'fortsetzen' });
    await sP.reload({ waitUntil: 'networkidle' }); await sP.waitForTimeout(400);
    const pw = await sP.evaluate(() => ({ zu: S.instZu || '', n: S.windows.length, name: (S.windows[0] || {}).name }));
    const bw = (await za('/api/zentrale/bestellungen/' + b0.id)).json.bestellung;
    ok(weiter.status === 200 && weiter.json.instanz.status === 'aktiv' && bw.status === 'live' && !pw.zu && pw.n === 1 && pw.name === 'Küche', 'Fortsetzen: Instanz aktiv, Bestellung wieder live, die Planung auf dem Gerät geht weiter');
    h.sauber(sP, 'Pause und Fortsetzen ohne weitere Fehler');

    /* ---------- Paketwechsel in der Zentrale: Plus → Signature; die App zeigt kein eeziframes mehr ---------- */
    /* neuer Browser: /config.js darf 60 Sekunden im Zwischenspeicher bleiben (seiten.js), ein Wechsel wirkt beim nächsten Besuch */
    const pw2 = await za('/api/zentrale/instanzen/' + iid + '/paket', { paket: 'signature', differenz: true });
    const ctxS = await kontext({ viewport: { width: 1280, height: 900 } }), sS = await h.neueSeite(ctxS, X.base(HOST));
    await sS.goto(X.base(HOST) + '/', { waitUntil: 'networkidle' }); await sS.waitForTimeout(400);
    const k2 = await app(sS), icons = await sS.evaluate(() => Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')).map((l) => l.getAttribute('href')).join(' '));
    await h.foto(sS, '30w2-app-signature');
    ok(pw2.status === 200 && k2.konfig.m.dashboard === true && k2.konfig.m.kennzeichnung === 'keine' && k2.konfig.m.pdfKennzeichnung === 'keine' && !k2.kz && !eezi.test(k2.text) && !eezi.test(k2.titel) && !eezi.test(icons) && k2.logo === v1.logo,
      'Paketwechsel Plus → Signature aus der Zentrale: die App zeigt beim nächsten Besuch keine Kennzeichnung und kein „eeziframes“ mehr, Logo bleibt' + (pw2.status !== 200 || eezi.test(k2.text) ? ' (' + pw2.status + ' ' + JSON.stringify({ m: k2.konfig.m, kz: k2.kz, eezi: (k2.text.match(/.{0,40}eeziframes.{0,40}/i) || [''])[0] }) + ')' : ''));
    h.sauber(sS, 'App nach dem Paketwechsel ohne Fehler');

    /* ---------- Vorgabe für das Dashboard (E): „Als Kunde öffnen“ mit ?vorschau=1 bleibt in der Adresse ---------- */
    const ak = await X.api(HOST, '/?vorschau=1', { headers: { accept: 'text/html' } }), fav = await X.api(HOST, '/favicon.svg');
    ok(ak.status === 200 && !ak.headers.location && fav.status === 200, '„Als Kunde öffnen“ (/?vorschau=1) liefert auf dem Instanz-Host die App (kein Vorschau-Token, keine Umleitung), damit app.js die Vorschau des Betriebs erkennt');
  } catch (e) {
    ok(false, 'ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally {
    for (const c of offen) await (await c).close().catch(() => false);
  }
};

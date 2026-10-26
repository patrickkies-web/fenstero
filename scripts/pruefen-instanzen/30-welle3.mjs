// eeziframes · Prüfabschnitt 30, Teil Welle 3 (Integrator): Verträge zwischen Strang E (Signature-Dashboard) und Strang F (Verkaufsseite,
// Recht je Instanz) und mit den Strängen A–D im echten Ablauf, auf einem eigenen Testserver mit PAKETE_OFFEN=1: Chromium auf
// http://<domain>.localhost:PORT, API mit Kopfzeile Host.
// Ablauf: Verkaufsseite (F) → „Signature bestellen“ öffnet das Bestellformular des Kundenkontos (D) mit dem Paket; Kasse und Seite nennen
// dieselbe Fassung der Paketbedingungen → Signature-Bestellung mit Dashboard-Zugang (D) → Zentrale legt die Instanz an und übernimmt den
// Zugang (C über A) → vor der Bestätigung kein Anmeldecode, Bestätigungslink aus der Mail (A) → Ampel „Dashboard-Zugang“ (C) → Anmeldung im
// Dashboard in der Vorbereitung (E: Banner, keine Einladung) → Gestaltung, Testanfrage, Freigabe, live (C, D) → Einladung im Dashboard
// (E) → der Kunde plant und sendet in der App (B), Mail mit PDF und Knopf ins Dashboard (A) → Projekt aus der Mail im Dashboard,
// Nachbesserung → zweite Runde aus der App → Impressum und Datenschutz der Instanz aus den Angaben der Bestellung (F, Fuß des Dashboards)
// → Zugang aus und an in der Zentrale → Paketwechsel Signature → Plus: Dashboard zu, offene Einladung nimmt das Aufmaß an, Rechtstexte
// folgen dem Paket → zurück auf Signature → Hauptdomain: Zugangsadresse bekommt den Weg ins Dashboard (E), die Startseite führt
// Fensterbauer zu den Paketen (E.7, F).
import crypto from 'node:crypto';
import { werkzeug } from './23.mjs';

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (h) => {
  const ok = (b, t) => h.ok(b, '30.W3 ' + t), eezi = /eeziframes/i;
  const offen = [];
  await import(new URL('../../web/assets/pakete.js', import.meta.url).href);
  const Pk = globalThis.Pakete;
  try {
    const X = await h.server({ PAKETE_OFFEN: '1' }), T = werkzeug(h, X), B = X.base('localhost');
    const stempel = Date.now().toString(36).slice(-5), MAIL = 'w3-' + stempel + '@fenster30.example', EIN = 'eingang-w3-' + stempel + '@ahorn30.example';
    const TEAM = 'team-w3-' + stempel + '@ahorn30.example', HOST = 'ahorn-w3-' + stempel + '.localhost', BH = X.base(HOST);
    const cookieAus = (r) => (r.cookies || []).map((c) => c.split(';')[0]).filter((c) => !/=$/.test(c)).join('; ');
    const an = (m) => (Array.isArray(m.an) ? m.an : [m.an]);
    let netz = 60;
    const kontext = (o) => { const c = h.browser.newContext(Object.assign({ acceptDownloads: true, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': '203.0.113.' + (++netz) } }, o || {})); offen.push(c); return c; };
    const bis = async (s, fn, ms, arg) => { const ende = Date.now() + (ms || 10000); while (Date.now() < ende) { if (await s.evaluate(fn, arg).catch(() => false)) return true; await warte(200); } return false; };
    const linkAus = (html, re) => { const m = re.exec(html || ''); return m ? new URL(m[1].replace(/&amp;/g, '&')) : null; };

    /* ---------- Verkaufsseite (F) → Bestellformular (D) ---------- */
    const ctxV = await kontext({ viewport: { width: 1280, height: 900 } }), sV = await h.neueSeite(ctxV, B);
    await sV.goto(B + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
    const ziele = await sV.$$eval('a[href^="/partner/#bestellen/"]', (as) => as.map((a) => a.getAttribute('href')));
    await sV.locator('#pk-tab-2:visible, .pk-karte[data-paket="2"] .pk-wahl:visible').first().click(); await sV.waitForTimeout(400);
    await sV.click('.pk-karte[data-paket="2"] a[href="/partner/#bestellen/signature"]');
    await sV.waitForURL(/\/partner\/#bestellen\/signature$/, { timeout: 8000 }).catch(() => null);
    await bis(sV, () => !!document.querySelector('.p-kopfblock .kicker'), 8000);
    const bf = await sV.evaluate(() => ({ url: location.pathname + location.hash, kicker: ((document.querySelector('.p-kopfblock .kicker') || {}).textContent || '').trim(), text: document.body.innerText }));
    const preisS = Pk.preis('signature');
    ok(Pk.LISTE.every((p) => ziele.includes('/partner/#bestellen/' + p)) && bf.url === '/partner/#bestellen/signature' && /EEZI Signature/.test(bf.kicker) && new RegExp('\\b' + preisS.monat + '\\s?€').test(bf.text) && new RegExp('\\b' + preisS.einrichtung + '\\s?€').test(bf.text),
      'Verkaufsseite mit PAKETE_OFFEN=1: jeder Paketknopf führt ins Bestellformular; „Signature bestellen“ öffnet es mit EEZI Signature und den Preisen aus pakete.js (' + bf.kicker + ')');
    h.sauber(sV, 'Verkaufsseite und Bestellformular ohne Fehler');
    const stand = (await X.api('localhost', '/api/partner/stand')).json || {}, kb = await X.api('localhost', '/konfigurator-bedingungen/');
    const kbStand = (/<meta name="stand" content="([^"]+)">/.exec(kb.text) || [])[1] || '';
    const pdfK = await X.api('localhost', '/konfigurator-bedingungen/paketbedingungen-' + kbStand + '.pdf'), pdfA = await X.api('localhost', '/konfigurator-bedingungen/av-vertrag-' + kbStand + '.pdf');
    ok(!!stand.stand && stand.stand === kbStand && stand.verkauf && stand.verkauf.offen === true && pdfK.status === 200 && pdfA.status === 200 && pdfK.buf.slice(0, 5).toString() === '%PDF-',
      'Kasse und Paketbedingungen nennen dieselbe Fassung (' + kbStand + '), beide PDFs dieser Fassung liegen bereit');

    /* ---------- Signature-Bestellung mit Dashboard-Zugang (D), bezahlt (Attrappe) ---------- */
    await X.api('localhost', '/api/partner/anmelden', { body: { mail: MAIL }, origin: true });
    const anm = await X.api('localhost', '/api/partner/bestaetigen', { body: { mail: MAIL, code: '123456' }, origin: true }), ck = cookieAus(anm);
    const pa = (pfad, body, m) => X.api('localhost', pfad, { body: body, method: m, cookie: ck, origin: true });
    await pa('/api/partner/firma', { firma: 'Fensterbau Ahorn ' + stempel + ' GmbH', rechtsform: 'GmbH', strasse: 'Ahornweg 3', plz: '50667', ort: 'Köln', bundesland: 'NW', ust: 'DE123456789', web: 'ahorn-fenster.de', ap: 'Petra Ahorn', rolle: 'GF', tel: '0221 445566', vertretung: 'Petra Ahorn', register: 'AG Köln HRB 3', erreichbar: { tage: ['mo', 'di', 'mi', 'do', 'fr'], von: '08:00', bis: '18:00', kanal: 'telefon' } });
    const b0r = await pa('/api/partner/bestellungen', { paket: 'signature', konfigurator: { name: 'Ahorn Fenster', domains: [HOST.replace('.localhost', '.app')], eingang: [EIN], zugang: [TEAM] } }), b0 = (b0r.json || {}).bestellung || {};
    await pa('/api/partner/bestellungen/' + b0.id, { gestaltung: { farben: ['#e9b44c'], titel: 'Fenster von Ahorn', begruessung: 'Willkommen bei Ahorn', notiz: '' } }, 'PATCH');
    const ka = await pa('/api/partner/bestellungen/' + b0.id + '/kasse', { zustimmung: { unternehmer: true, agb: stand.stand, avv: true } });
    const kp = ka.json && ka.json.url ? await pa('/api/partner/bestellungen/' + b0.id + '/kasse/pruefen?session=' + new URL(ka.json.url).searchParams.get('kasse')) : { json: null };
    ok(b0r.status === 200 && kp.json && kp.json.status === 'bezahlt', 'Signature-Bestellung mit Dashboard-Zugang ist bezahlt (Kasse mit der Fassung ' + stand.stand + ')');

    /* ---------- Zentrale (C): Einrichtung, Instanz mit dem Zugang aus der Bestellung, Domain ---------- */
    const Z = await X.zentrale(), za = (pfad, body) => Z.api(pfad, body === undefined ? {} : { body: body });
    await za('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'einrichtung' });
    const iA = await za('/api/zentrale/bestellungen/' + b0.id + '/instanz', {}), iid = iA.json && iA.json.instanz && iA.json.instanz.id;
    await za('/api/zentrale/instanzen/' + iid + '/host', { host: HOST });
    const dp = await za('/api/zentrale/instanzen/' + iid + '/domain/pruefen', { host: HOST });
    await za('/api/zentrale/bestellungen/' + b0.id + '/status', { nach: 'domain' });
    const si0 = (await za('/api/zentrale/instanzen/' + iid)).json || {}, zg0 = ((si0.instanz || {}).zugang || []).find((x) => x.mail === TEAM);
    const amp0 = (((si0.instanz || {}).ampel || si0.ampel || {}).punkte || []).find((p) => p.id === 'zugang');
    ok(iA.status === 200 && !!iid && dp.json && dp.json.pruefung && dp.json.pruefung.ok && !!zg0 && !zg0.bestaetigt && (!amp0 || !amp0.ok), 'Zentrale: Instanz aus der Bestellung mit dem Zugang ' + TEAM + ' (unbestätigt), Domain ' + HOST + ' geprüft');

    /* ---------- vor der Bestätigung kein Code; Bestätigungslinks aus den Mails (A) ---------- */
    const codeMails = async () => (await X.post()).filter((m) => an(m).includes(TEAM) && /Anmeldecode/.test(m.betreff || ''));
    const vorher = await X.api(HOST, '/api/konto/anmelden', { body: { mail: TEAM }, origin: true }); await warte(200);
    const ohneCode = (await codeMails()).length === 0;
    const mails0 = await X.post();
    const bestZ = mails0.filter((m) => an(m).includes(TEAM) && /Zugang zum Dashboard bestätigen/.test(m.betreff || '')).pop(), bestE = mails0.filter((m) => an(m).includes(EIN) && /bestätigen/i.test(m.betreff || '')).pop();
    const uZ = linkAus(bestZ && bestZ.html, /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/), uE = linkAus(bestE && bestE.html, /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/);
    const kZ = uZ ? await X.api('localhost', uZ.pathname + uZ.search, { headers: { accept: 'text/html' } }) : { status: 0, text: '' };
    const kE = uE ? await X.api('localhost', uE.pathname + uE.search, { headers: { accept: 'text/html' } }) : { status: 0 };
    const si1 = (await za('/api/zentrale/instanzen/' + iid)).json || {}, zg1 = ((si1.instanz || {}).zugang || []).find((x) => x.mail === TEAM);
    const amp1 = (((si1.instanz || {}).ampel || si1.ampel || {}).punkte || []).find((p) => p.id === 'zugang');
    ok(vorher.status === 200 && ohneCode && !!bestZ && !eezi.test(bestZ.html + bestZ.betreff) && kZ.status === 200 && kE.status === 200 && !!zg1 && !!zg1.bestaetigt && (!amp1 || amp1.ok),
      'Zugang: vor der Bestätigung gleiche Antwort ohne Code; der Bestätigungslink aus der Mail (ohne eeziframes) bestätigt ihn, die Ampel „Dashboard-Zugang“ wird grün');

    /* ---------- Dashboard in der Vorbereitung (E): Anmeldung, Banner, keine Einladung ---------- */
    const ctxD = await kontext({ viewport: { width: 1280, height: 900 } }); let sD = await h.neueSeite(ctxD, BH);
    await sD.goto(BH + '/betrieb/', { waitUntil: 'networkidle' });
    await sD.waitForSelector('form[data-form="srvlogin"]');
    await sD.fill('#lg-mail', TEAM); await sD.click('form[data-form="srvlogin"] button[type="submit"]');
    await sD.waitForSelector('#lg-code'); await sD.fill('#lg-code', '123456'); await sD.click('form[data-form="srvlogin"] button[type="submit"]');
    await sD.waitForSelector('.scr[data-screen="links"]', { timeout: 10000 }).catch(() => null);
    await sD.waitForTimeout(400);
    const d0 = await sD.evaluate(() => ({ s: S.screen, text: document.body.innerText, einladen: instEinladen(), titel: document.title, fuss: Array.from(document.querySelectorAll('footer a')).map((a) => a.getAttribute('href')) }));
    const mailCode = (await codeMails()).pop();
    ok(d0.s === 'links' && /noch in Vorbereitung/.test(d0.text) && d0.einladen === false && /Ahorn Fenster/.test(d0.titel) && !eezi.test(d0.text) && !!mailCode && !eezi.test(mailCode.html),
      'Dashboard in der Vorbereitung: Anmeldung mit dem bestätigten Zugang (Code-Mail ohne eeziframes), Banner „in Vorbereitung“, noch keine Einladungen');

    /* ---------- Gestaltung, Testanfrage, Vorschau, Freigabe, live (C, D) ---------- */
    await za('/api/zentrale/instanzen/' + iid + '/entwurf', { entwurf: { name: 'Ahorn Fenster', farbe: '#e9b44c', titel: 'Fenster von Ahorn', start: { kicker: 'Ahorn Fenster · seit 1994', ueberschrift: 'Neue Fenster für Ihr Haus', text: 'Planen Sie in Ruhe.' } } });
    const ver = await za('/api/zentrale/instanzen/' + iid + '/veroeffentlichen', {});
    const t1 = await za('/api/zentrale/instanzen/' + iid + '/test', {}), tc = t1.json && t1.json.test && t1.json.test.code;
    const zeileT = tc ? await T.warteZeile(tc, (z) => !!(z.versand || {}).id, 8000) : null;
    const umg = await import(new URL('../../functions/api/umgebung.js', import.meta.url).href), GEHEIM = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
    if (zeileT && zeileT.versand.id) { const body = JSON.stringify({ type: 'email.delivered', data: { email_id: zeileT.versand.id } }), id = 'msg_' + crypto.randomUUID(), ts = String(Math.floor(Date.now() / 1000)); await X.api('localhost', '/api/post/webhook', { body: body, headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': 'v1,' + crypto.createHmac('sha256', Buffer.from(GEHEIM.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64') } }); }
    await za('/api/zentrale/bestellungen/' + b0.id + '/vorschau', {});
    const vers = ((await X.api('localhost', '/api/partner', { cookie: ck })).json.bestellungen.find((x) => x.id === b0.id).vorschau || {}).version;
    const fg = await pa('/api/partner/bestellungen/' + b0.id + '/freigabe', { aktion: 'freigeben', version: vers });
    const live = await za('/api/zentrale/bestellungen/' + b0.id + '/live', {});
    ok(ver.status === 200 && fg.status === 200 && live.status === 200 && live.json.bestellung.status === 'live', 'Gestaltung veröffentlicht, Testanfrage zugestellt, Freigabe im Kundenkonto, live (' + live.status + (live.json && live.json.fehler ? ': ' + live.json.fehler : '') + ')');

    /* ---------- Einladung im Dashboard (E) ---------- */
    await sD.evaluate(() => Server.aktualisieren()); await sD.waitForTimeout(500);
    const d1 = await sD.evaluate(() => ({ text: document.body.innerText, einladen: instEinladen() }));
    await sD.evaluate(() => go('newlink')); await sD.waitForSelector('#nl-kunde');
    await sD.fill('#nl-kunde', 'Familie Ahorn'); await sD.click('[data-act="nl-next"]');
    await sD.waitForSelector('[data-act="nl-create"]'); await sD.click('[data-act="nl-create"]');
    await sD.waitForSelector('.scr[data-screen="link"]', { timeout: 10000 }).catch(() => null);
    await sD.waitForSelector('#lnk', { timeout: 10000 }).catch(() => null);
    const einl = await sD.evaluate(() => { const l = A().links.find((x) => x.id === S.sel) || {}; return { id: l.id, code: l.code, nr: l.nr, url: ((document.getElementById('lnk') || {}).textContent || '').trim() }; });
    const zE = einl.code ? await T.zeile(einl.code) : null;
    ok(!/noch in Vorbereitung/.test(d1.text) && d1.einladen === true && /^[a-z0-9]{10}$/.test(einl.code || '') && einl.url.startsWith(BH + '/#k-' + einl.code) && !!zE && zE.art === 'einladung' && zE.instanz === iid,
      'Nach dem Livegang: Banner weg, Einladung im Dashboard angelegt, Link auf der eigenen Domain ' + BH + '/#k-' + einl.code + '… (Zeile art einladung)' + (zE && zE.art === 'einladung' ? '' : ' ' + JSON.stringify({ einl: einl, d1: { einladen: d1.einladen } })));
    await h.foto(sD, '30w3-dashboard-einladung');

    /* ---------- Der Kunde plant und sendet in der App (B); Mail mit PDF und Knopf ins Dashboard (A) ---------- */
    const fensterSpeichern = (s, name) => s.evaluate((n) => { Object.assign(S.win, { name: n, mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, name);
    /* Senden einer Einladung (ohne Kontaktpflicht): „Weiter“ bis zum Aufmaßblatt, dort senden; in der Nachbesserung ebenso. Die Schritte
       zeigt die App selbst (B, Abschnitt 25.7); hier zählt nur, dass das Aufmaß beim Betrieb ankommt */
    const einladungSenden = async (s) => {
      await s.evaluate(() => go('anfrage')); await s.waitForTimeout(300);
      const wege = [];
      for (let i = 0; i < 6; i++) {
        if (await s.evaluate(() => !!(S.sent && S.sent.uebertragen))) break;
        const vor = await s.evaluate(() => S.screen); wege.push(vor);
        const knopf = await s.$('.bb .btn.primary');
        if (!knopf) throw new Error('kein Knopf „Weiter“ auf ' + vor + ' (Weg: ' + wege.join(' → ') + ')');
        await knopf.click();
        await bis(s, (v) => S.screen !== v || !!(S.sent && S.sent.uebertragen), 10000, vor);
      }
      await s.waitForFunction(() => S.sent && S.sent.uebertragen, null, { timeout: 30000 });
      return wege;
    };
    const ctxK = await kontext(h.telefon), sK = await h.neueSeite(ctxK, BH);
    await sK.goto(einl.url, { waitUntil: 'networkidle' }); await sK.waitForTimeout(600);
    const k1 = await sK.evaluate(() => ({ text: document.body.innerText, titel: document.title }));
    ok(/Persönliche Anfrage von/.test(k1.text) && /Ahorn Fenster/.test(k1.text) && /Familie Ahorn/.test(k1.text) && !eezi.test(k1.text + k1.titel), 'Einladungslink aus dem Dashboard: die App zeigt die persönliche Startseite in der Marke, ohne eeziframes');
    await sK.click('[data-act="new"]'); await sK.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(sK, 'Wohnzimmer'); await sK.waitForSelector('.scr[data-screen="fertig"]');
    await einladungSenden(sK);
    const m1 = (await T.warteMail((m) => an(m).includes(EIN) && (m.html || '').includes('#projekt-' + einl.id), 15000, { anhaenge: true }))[0];
    const pdf1 = m1 && (m1.anhaenge || []).find((a) => a.typ === 'application/pdf');
    const z1 = await T.warteZeile(einl.code, (z) => z.status === 'eingegangen', 8000);
    const knopf = m1 ? linkAus(m1.html, new RegExp('href="([^"]*\\/betrieb\\/#projekt-' + einl.id + ')"')) : null;
    ok(!!m1 && !!pdf1 && !eezi.test(m1.html + m1.betreff) && !!knopf && knopf.origin === BH && !!z1 && z1.status === 'eingegangen',
      'Eingang der Einladung: Mail an die bestätigte Adresse mit PDF, ohne eeziframes, Knopf auf ' + (knopf ? knopf.href : '–'));
    h.sauber(sK, 'App mit der Einladung ohne Fehler');

    /* ---------- Projekt aus der Mail im Dashboard, Nachbesserung (E) ---------- */
    /* der Knopf öffnet einen neuen Tab (gleiche Sitzung im Cookie); das Dashboard von vorhin bleibt offen */
    const sD0 = sD; h.sauber(sD0, 'Dashboard bis zur Einladung ohne Fehler');
    sD = await h.neueSeite(ctxD, BH);
    await sD.goto(knopf ? knopf.href : BH + '/betrieb/', { waitUntil: 'networkidle' });
    await sD.waitForSelector('.scr[data-screen="link"]', { timeout: 10000 }).catch(() => null);
    await sD.waitForTimeout(400);
    const p1 = await sD.evaluate(() => ({ s: S.screen, sel: S.sel, h1: ((document.querySelector('.top h1') || {}).textContent || '').trim(), text: document.body.innerText, status: (A().links.find((x) => x.id === S.sel) || {}).status }));
    ok(p1.s === 'link' && p1.sel === einl.id && /Familie Ahorn/.test(p1.h1) && p1.status === 'eingegangen' && /Eingereicht/.test(p1.text) && /Wohnzimmer/.test(p1.text), 'Knopf aus der Mail öffnet im Dashboard das Projekt: Eingereicht, mit dem Fenster aus der App' + (p1.s === 'link' && p1.status === 'eingegangen' ? '' : ' ' + JSON.stringify({ s: p1.s, sel: p1.sel, h1: p1.h1, status: p1.status, text: p1.text.slice(0, 200) })));
    await sD.click('[data-act="sheet"][data-v="nachbesserung"]'); await sD.waitForSelector('#nb-hinweis');
    await sD.fill('#nb-hinweis', 'Bitte die Höhe im Wohnzimmer noch einmal messen.'); await sD.click('[data-act="nb-send"]');
    const zNb = await T.warteZeile(einl.code, (z) => ((z.daten || {}).nb || {}).runde === 2, 8000);
    /* wie im Betriebsbereich der Hauptdomain: Der Betrieb schickt den Link erneut, er trägt die Runde (#k-…~2) */
    await bis(sD, () => /Nachbesserung · Link erneut schicken/.test(document.body.innerText) && /~2$/.test(((document.getElementById('lnk') || {}).textContent || '').trim()), 8000);
    const nbUrl = await sD.evaluate(() => ((document.getElementById('lnk') || {}).textContent || '').trim());
    ok(!!zNb && zNb.daten.nb.hinweis === 'Bitte die Höhe im Wohnzimmer noch einmal messen.' && nbUrl.startsWith(BH + '/#k-' + einl.code) && /~2$/.test(nbUrl), 'Nachbesserung im Dashboard: Runde 2 mit dem Hinweis am Projekt, der Link zum erneuten Schicken trägt die Runde (…~2)');
    await sK.goto(nbUrl, { waitUntil: 'networkidle' }); await sK.reload({ waitUntil: 'networkidle' }); await sK.waitForTimeout(400);
    await bis(sK, () => !!S.nb && !S.sent, 8000);
    const k2 = await sK.evaluate(() => ({ text: document.body.innerText, nb: !!S.nb, sent: !!S.sent }));
    const weg2 = await einladungSenden(sK);
    const z2 = await T.warteZeile(einl.code, (z) => z.status === 'eingegangen' && Number((z.daten || {}).runde) === 2, 10000);
    const m2 = (await T.warteMail((m) => an(m).includes(EIN) && (m.html || '').includes('#projekt-' + einl.id), 15000)).length;
    ok(k2.nb && !k2.sent && /noch einmal messen/.test(k2.text) && !!z2 && m2 >= 2, 'Die App zeigt den Hinweis der Nachbesserung, der Kunde schickt erneut (' + weg2.join(' → ') + '): Runde 2 eingegangen, zweite Mail' + (k2.nb && z2 ? '' : ' ' + JSON.stringify({ nb: k2.nb, sent: k2.sent, runde: z2 && z2.daten && z2.daten.runde, m2: m2 })));
    h.sauber(sK, 'Nachbesserung in der App ohne Fehler');

    /* ---------- Impressum und Datenschutz der Instanz (F) über den Fuß des Dashboards ---------- */
    await sD.evaluate(() => Server.aktualisieren()); await sD.waitForTimeout(300);
    const fuss = await sD.evaluate(() => Array.from(document.querySelectorAll('footer a')).map((a) => ({ href: a.getAttribute('href'), t: a.textContent.trim() })));
    const imp = await X.api(HOST, '/impressum/'), ds = await X.api(HOST, '/datenschutz/');
    const kk = fuss.find((a) => /Vertrag, Rechnungen und Support/.test(a.t));
    ok(fuss.some((a) => a.href === '/impressum/') && fuss.some((a) => a.href === '/datenschutz/') && !!kk && /^https:\/\/eeziframes\.com\/partner\/$/.test(kk.href) && imp.status === 200 && ds.status === 200 &&
      imp.text.includes('Fensterbau Ahorn ' + stempel + ' GmbH') && imp.text.includes('Ahornweg 3') && imp.text.includes('HRB 3') && /__Host-betrieb/.test(ds.text) && /technischer Dienstleister/.test(ds.text) && !eezi.test(imp.text + ds.text),
      'Fuß des Dashboards: Impressum mit den Angaben der Bestellung, Datenschutz mit dem Cookie __Host-betrieb und ohne eeziframes, „Vertrag, Rechnungen und Support“ → Kundenkonto ' + (kk && kk.href));
    h.sauber(sD, 'Dashboard bis zur Nachbesserung ohne Fehler');

    /* ---------- Zugang aus und an in der Zentrale (C) wirkt sofort im Dashboard (E) ---------- */
    const aus = await za('/api/zentrale/instanzen/' + iid + '/zugang', { aktion: 'aus', mail: TEAM });
    await sD.evaluate(() => go('links')); await sD.evaluate(() => Server.aktualisieren());
    const abgemeldet = await bis(sD, () => !!document.querySelector('form[data-form="srvlogin"]') && /keinen Zugang mehr/.test(document.body.innerText), 6000);
    const wieder = await za('/api/zentrale/instanzen/' + iid + '/zugang', { aktion: 'an', mail: TEAM });
    sD.probleme = sD.probleme.filter((p) => !/HTTP 403: .*\/api\/konto|status of 403/.test(p));
    await X.api(HOST, '/api/konto/anmelden', { body: { mail: TEAM }, origin: true });
    const neuAn = await X.api(HOST, '/api/konto/bestaetigen', { body: { mail: TEAM, code: '123456' }, origin: true }), ckD = (neuAn.cookies.find((c) => c.startsWith('__Host-betrieb=')) || '').split(';')[0];
    ok(aus.status === 200 && abgemeldet && wieder.status === 200 && neuAn.status === 200 && !!ckD, 'Zugang in der Zentrale ausgeschaltet: das offene Dashboard meldet ab; wieder eingeschaltet: Anmeldung geht');

    /* ---------- Paketwechsel Signature → Plus (C über D): Dashboard zu, offene Einladung bleibt, Rechtstexte folgen ---------- */
    const n2 = await X.api(HOST, '/api/konto/projekte', { cookie: ckD, origin: true, body: { kunde: 'Familie Offen', kontakt: 'offen-w3@beispiel.de' } });
    const l2 = n2.json && n2.json.konto ? n2.json.konto.acc.links.find((l) => l.id === n2.json.id) : null;
    const zuPlus = await za('/api/zentrale/instanzen/' + iid + '/paket', { paket: 'plus' });
    /* nach unten wirkt der Wechsel erst zum Periodenende (bestellung.js paketWechseln, Befund 10): Vormerkung prüfen, Uhr hinter abo.bis, Tageslauf */
    const { CRON_TAEGLICH } = await import(new URL('../../functions/api/router.js', import.meta.url).href);
    const bVorgemerkt = ((await X.attrappe()).bestellungen || []).find((b) => b.id === b0.id) || {}, iVorgemerkt = ((await X.attrappe()).instanzen || []).find((i) => i.id === iid) || {};
    await X.uhr(31); await X.geplant(CRON_TAEGLICH); await X.uhr(null);
    const q1 = await X.api(HOST, '/api/konto', { cookie: ckD }), q2 = await X.api(HOST, '/betrieb/'), q3 = await X.api(HOST, '/datenschutz/');
    const ctxO = await kontext(h.telefon), sO = await h.neueSeite(ctxO, BH);
    await sO.goto(BH + '/#k-' + (l2 ? l2.code : 'x'), { waitUntil: 'networkidle' }); await sO.waitForTimeout(500);
    await sO.click('[data-act="new"]'); await sO.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(sO, 'Küche'); await sO.waitForSelector('.scr[data-screen="fertig"]');
    await einladungSenden(sO);
    const mO = (await T.warteMail((m) => an(m).includes(EIN) && /Familie Offen/.test((m.betreff || '') + (m.html || '')), 15000, { anhaenge: true }))[0];
    ok(zuPlus.status === 200 && bVorgemerkt.abo && bVorgemerkt.abo.wechsel && bVorgemerkt.abo.wechsel.paket === 'plus' && iVorgemerkt.paket === 'signature' && [403, 404].includes(q1.status) && q2.status === 404 && !/__Host-betrieb/.test(q3.text) && /eeziframes/.test(q3.text) && !!mO && (mO.anhaenge || []).some((a) => a.typ === 'application/pdf') && !mO.html.includes('/betrieb/#projekt-'),
      'Paketwechsel auf Plus (bis zum Periodenende nur vorgemerkt, dann Tageslauf): Dashboard zu (' + q1.status + ', /betrieb/ ' + q2.status + '), Datenschutz ohne __Host-betrieb und mit eeziframes als Auftragsverarbeiter; die offene Einladung nimmt das Aufmaß an, Mail mit PDF ohne Dashboard-Knopf');
    h.sauber(sO, 'Einladung nach dem Paketwechsel ohne Fehler');
    const zuSig = await za('/api/zentrale/instanzen/' + iid + '/paket', { paket: 'signature' });
    await X.api(HOST, '/api/konto/anmelden', { body: { mail: TEAM }, origin: true });
    const zurueck = await X.api(HOST, '/api/konto/bestaetigen', { body: { mail: TEAM, code: '123456' }, origin: true });
    const lz = zurueck.json && zurueck.json.konto ? zurueck.json.konto.acc.links : [];
    ok(zuSig.status === 200 && zurueck.status === 200 && lz.some((l) => l.code === einl.code && l.status === 'eingegangen') && lz.some((l) => l.code === (l2 || {}).code && l.status === 'eingegangen'), 'Zurück auf Signature: derselbe Zugang meldet sich an und sieht beide Projekte, auch das unter Plus eingegangene');

    /* ---------- Hauptdomain: Zugangsadresse → Weg ins Dashboard (E); Startseite → Pakete (E.7, F) ---------- */
    const ctxH = await kontext({ viewport: { width: 1280, height: 900 } }), sH = await h.neueSeite(ctxH, B);
    await sH.goto(B + '/', { waitUntil: 'networkidle' }); await sH.waitForTimeout(300);
    /* Startseite nach der Design-DNA: Kopf und Wege stehen im Baustein (Schatten-DOM von #startseite) */
    const start = await sH.evaluate(() => { const sr = (document.getElementById('startseite') || {}).shadowRoot; return { wechsel: !!(sr && sr.querySelector('a[href="/fuer-fensterbauer/"]')), ansicht: !!(sr && sr.querySelector('.ez-kopf nav.ez-ansicht a[href="/#fensterbauer"]')), alt: /Projekte sind kostenlos/.test(sr ? sr.textContent : '') }; });
    await sH.click('.ez-kopf nav.ez-ansicht a[href="/#fensterbauer"]'); await sH.waitForTimeout(300);
    /* die Ansicht Fensterbauer bettet die Paket-Landingpage ein (portal.js, Einbettung der Verkaufsseite): auf die Einbettung warten */
    await sH.waitForSelector('.vk-einbettung .fb[data-fb-an="1"], .vk-einbettung.vk-rueckfall', { timeout: 8000 }).catch(() => null);
    const karte = await sH.evaluate(() => ({ hero: !!document.querySelector('.vk-einbettung .fb #hero'), pakete: document.querySelectorAll('.vk-einbettung .pk-karte').length, h1: Array.from(document.querySelectorAll('h1')).map((e) => e.textContent.trim()) }));
    const fb = await X.api('localhost', '/fuer-fensterbauer/');
    ok(start.wechsel && start.ansicht && !start.alt && karte.hero && karte.pakete === 3 && karte.h1.length === 1 && /Anfragen mit Aufmaß/.test(karte.h1[0]) && fb.status === 200 && /<article class="pk-karte[^"]*" data-paket="2">/.test(fb.text), 'Startseite eeziframes.com: „Für Fensterbauer“ führt zu den Paketen (die Ansicht für Bestandsbetriebe bleibt erreichbar), die Ansicht für Fensterbauer bettet die Paket-Landingpage ein (Startbild, drei Paketkarten, ein h1: ' + karte.h1.join(' | ') + ')');
    await sH.evaluate(() => { S.sheet = { k: 'login' }; render(); });
    await sH.waitForSelector('form[data-form="srvlogin"] #lg-mail');
    await sH.fill('#lg-mail', TEAM); await sH.click('form[data-form="srvlogin"] button[type="submit"]');
    await sH.waitForSelector('#lg-code'); await sH.fill('#lg-code', '123456'); await sH.click('form[data-form="srvlogin"] button[type="submit"]');
    const umzug = await bis(sH, (z) => !!Array.from(document.querySelectorAll('.note a.ulink')).find((a) => a.getAttribute('href') === z), 6000, BH + '/betrieb/');
    sH.probleme = sH.probleme.filter((p) => !/HTTP 409: .*\/api\/konto\/bestaetigen|status of 409/.test(p));
    ok(umzug, 'Hauptdomain: Anmeldung mit der Zugangsadresse ohne Betriebskonto zeigt „Zu Ihrem Dashboard“ → ' + BH + '/betrieb/');
    h.sauber(sH, 'Startseite und Anmeldung auf der Hauptdomain ohne weitere Fehler');
  } catch (e) {
    ok(false, 'ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally {
    for (const c of offen) await (await c).close().catch(() => false);
  }
};

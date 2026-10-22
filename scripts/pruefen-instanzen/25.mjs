// eeziframes · Prüfabschnitt 25: Konfigurator-App im Instanz-Modus (Strang B, Bauplan §3 B; docs/INSTANZEN.md)
// Chromium auf http://<instanz>.localhost:PORT, Telefon- und Desktopbreite, eigene Instanzen dieses Abschnitts (b-essential, b-plus mit
// veröffentlichter Marke, b-signature, b-vorschau in Einrichtung), damit die übrigen Abschnitte ihre Standard-Instanzen unverändert vorfinden.
// 25.1 Startansicht je Paket · 25.2 ganzer Ablauf bis zur Bestätigung, PDF-Kopie, danach nur Nummer und Datum, weitere Anfrage, vergessen
// · 25.3 keine Preise, Kasse, WhatsApp, AGB, Widerruf, Cookies, Führung · 25.4 neu laden und zweites Gerät · 25.5 Server weg, Planung
// verfallen · 25.6 Fotos mit kleiner Fassung, KI mit Code · 25.7 Signature-Einladung · 25.8 Vorschau und Testanfrage · 25.9 keine Fehler,
// keine fremden Anfragen, kein waagrechter Scroll · 25.10 Hauptdomain-App unverändert (dazu die Abschnitte 4, 14, 16, 19, 21, 22)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { werkzeug } from './23.mjs';

export const titel = 'App im Instanz-Modus';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (h) => {
  /* eigener Testserver: die Mails, Bremsen und Instanzen dieses Abschnitts berühren die übrigen Abschnitte nicht (die Mail-Attrappe
     hält nur die letzten 50 Mails, Anfragen je Anschluss und Tag sind begrenzt) */
  const X = await h.server({});
  const { ok } = h, T = werkzeug(h, X), eezi = /eeziframes/i;
  const ordner = fs.mkdtempSync(path.join(os.tmpdir(), 'eezi-25-'));
  const pdfText = (buf) => { const f = path.join(ordner, Math.random().toString(36).slice(2) + '.pdf'); fs.writeFileSync(f, buf); try { return cp.execFileSync('pdftotext', ['-layout', f, '-']).toString('utf8'); } catch (e) { return ''; } };
  let netz = 10;
  /* je Browser ein eigener Anschluss (Bremsen je Anschluss: Starts, Anfragen am Tag) */
  const kontext = (o) => h.browser.newContext(Object.assign({ acceptDownloads: true, extraHTTPHeaders: { 'x-forwarded-for': '203.0.113.' + (++netz) } }, o || {}));
  const telefon = (o) => kontext(Object.assign({}, h.telefon, o || {}));
  const desktop = (o) => kontext(Object.assign({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' }, o || {}));

  /* ---------- eigene Instanzen ---------- */
  const I = await X.saat({ instanzen: [
    { slug: 'b-essential', paket: 'essential', name: 'Fensterbau Lerche', plz: '50667', ort: 'Köln', farbe: '' },
    { slug: 'b-plus', paket: 'plus', name: 'Glaserei Star', plz: '50823', ort: 'Köln', farbe: '#1f5fa8' },
    { slug: 'b-signature', paket: 'signature', name: 'Fensterwerk Kranich', plz: '40210', ort: 'Düsseldorf', farbe: '#e8a33d' },
    { slug: 'b-vorschau', paket: 'plus', name: 'Glaserei Vorschau', plz: '50823', ort: 'Köln', farbe: '#8fb8e8', status: 'einrichtung' }
  ] });
  const E = I['b-essential'], P = I['b-plus'], S9 = I['b-signature'], V = I['b-vorschau'];
  const base = (x) => X.base(x.host);

  /* Marke von Plus veröffentlichen: Logo, zwei Startbilder, Firmenfarbe, eigene Startansicht (wie die Zentrale, verwalten.js) */
  const sB = await h.browser.newPage();
  const bild = await sB.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 480; c.height = 160; const g = c.getContext('2d'); g.fillStyle = '#1f5fa8'; g.fillRect(0, 0, 480, 160); g.fillStyle = '#ffffff'; g.font = 'bold 84px sans-serif'; g.fillText('STAR', 120, 112);
    const st = [1, 2].map((n) => { const d = document.createElement('canvas'); d.width = 1600; d.height = 900; const x = d.getContext('2d'); x.fillStyle = n === 1 ? '#c9d6df' : '#e3d5c9'; x.fillRect(0, 0, 1600, 900); x.fillStyle = '#334455'; x.font = 'bold 200px sans-serif'; x.fillText('Foto ' + n, 420, 520); return d.toDataURL('image/jpeg', 0.8).split(',')[1]; });
    const fotos = [1, 2].map((n) => { const d = document.createElement('canvas'); d.width = 900; d.height = 1200; const x = d.getContext('2d'); x.fillStyle = n === 1 ? '#d9d2c5' : '#c9d6df'; x.fillRect(0, 0, 900, 1200); x.fillStyle = '#fff'; x.fillRect(150, 140, 600, 900); return d.toDataURL('image/jpeg', 0.85).split(',')[1]; });
    return { logo: c.toDataURL('image/png').split(',')[1], start: st, fotos: fotos };
  });
  await sB.close();
  await T.test({ verwalten: { fn: 'instanzAendern', args: [P.id, { entwurf: { name: 'Glaserei Star', farbe: '#1f5fa8', titel: 'Fenster planen mit Glaserei Star', start: { kicker: 'Glaserei Star · seit 1987', ueberschrift: 'Neue Fenster für Ihr Zuhause', text: 'Planen Sie in Ruhe auf dem Sofa. Wir melden uns mit dem Angebot.' } } }] } });
  for (const [n, b, t] of [['logo.png', bild.logo, 'image/png'], ['start-1.jpg', bild.start[0], 'image/jpeg'], ['start-2.jpg', bild.start[1], 'image/jpeg']]) await T.test({ verwalten: { fn: 'bildAblegen', args: [P.id, n, b, t] } });
  await T.test({ verwalten: { fn: 'markeVeroeffentlichen', args: [P.id] } });
  const kfgP = await X.api(P.host, '/config.js');
  ok(/"logo":"\/marke\/\d+\/logo\.png"/.test(kfgP.text) && /start-1\.jpg/.test(kfgP.text), '25.0 Plus: veröffentlichte Marke mit Logo und Startbildern in /config.js');

  /* Helfer: Seite öffnen, Zustand lesen, Ablauf */
  const oeffnen = async (ctx, x, pfad) => { const s = await h.neueSeite(ctx, base(x)); await s.goto(base(x) + (pfad || '/'), { waitUntil: 'networkidle' }); await s.waitForTimeout(400); return s; };
  /* warten, bis fn im Browser wahr ist (auch asynchron; waitForFunction wartet nicht auf Promises) */
  const bis = async (s, fn, ms, arg) => { const ende = Date.now() + (ms || 10000); while (Date.now() < ende) { if (await s.evaluate(fn, arg).catch(() => false)) return true; await warte(200); } return false; };
  const waagrecht = (s) => s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  const html = (s) => s.evaluate(() => document.getElementById('app').innerHTML);
  const text = (s) => s.evaluate(() => document.body.innerText);
  const lokal = (s) => s.evaluate(async () => ({ ls: Object.keys(localStorage).reduce((o, k) => { o[k] = localStorage.getItem(k); return o; }, {}), idb: (await Fotos.alle()) || [] }));
  const MO = { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 };
  const VERBOTEN_H = /kasse|wa\.me|\/agb\/|\/widerruf\/|\/cookies\/|data-act="tour-start"|data-act="k-start"/i, VERBOTEN_T = /\d+,\d{2}\s*€|Preis|Freischalten|kostenpflichtig|Führung|Pilotphase/;
  const gesehen = [];
  const merken = async (s, wo) => { gesehen.push({ wo: wo, html: await html(s), text: await text(s), quer: await waagrecht(s) }); };
  const fotosMachen = async (s) => {
    await s.click('.bb .btn.primary');
    await s.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
    await s.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(bild.fotos[0], 'base64') });
    if (await s.waitForSelector('.fx-dialog', { timeout: 3000 }).then(() => true, () => false)) { await merken(s, 'KI-Einwilligung'); await s.click('.fx-ja'); }
    await s.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(bild.fotos[1], 'base64') });
    await bis(s, async () => { const b = S.win.bilder || {}; return !!(b.in && b.out && (await Fotos.holen(b.in)) && (await Fotos.holen(b.out))); }, 10000);
  };
  const fensterSpeichern = (s, name) => s.evaluate((a) => { Object.assign(S.win, { name: a.n, mo: a.mo, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, { n: name, mo: MO });
  const kontaktSenden = async (s, k, o) => {
    o = o || {};
    await s.evaluate(() => go('anfrage')); await s.waitForSelector('.scr[data-screen="anfrage"]');
    if (o.merken) await merken(s, 'Haus');
    await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage2"]');
    if (o.merken) await merken(s, 'Zeit und Budget');
    await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage3"]');
    let ohne = null;
    if (o.ohne) { await s.click('.bb .btn.primary'); await s.waitForTimeout(300); ohne = await s.evaluate(() => ({ screen: S.screen, bad: document.querySelectorAll('.trow.bad').length, text: Array.from(document.querySelectorAll('.trow-f')).map((e) => e.textContent).join(' | ') })); await h.foto(s, '25-kontakt-pflicht'); }
    if (o.merken) await merken(s, 'Kontakt');
    await s.fill('#t-name', k.name); if (k.tel) await s.fill('#t-tel', k.tel); if (k.mail) await s.fill('#t-mail', k.mail);
    if (k.erreich) await s.click('[data-act="setp"][data-f="erreich"][data-v="' + k.erreich + '"]');
    await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="blatt"]');
    if (o.merken) await merken(s, 'Prüfen');
    await s.click('.bb .btn.primary');
    await s.waitForFunction(() => S.sent && S.sent.nr, null, { timeout: 30000 });
    await s.waitForTimeout(300);
    return ohne;
  };
  const pdfHolen = async (s) => {
    const [dl] = await Promise.all([s.waitForEvent('download', { timeout: 20000 }), s.click('[data-act="inst-pdf"]')]);
    const f = path.join(ordner, 'kopie-' + Math.random().toString(36).slice(2) + '.pdf'); await dl.saveAs(f);
    const buf = fs.readFileSync(f); return { name: dl.suggestedFilename(), buf: buf, text: pdfText(buf), roh: buf.toString('latin1') };
  };

  /* ---------- 25.1 Startansicht je Paket (Telefon und Schreibtisch) ---------- */
  const start = {};
  for (const [x, art] of [[E, 'essential'], [P, 'plus'], [S9, 'signature']]) {
    for (const breite of ['telefon', 'desktop']) {
      const ctx = await (breite === 'telefon' ? telefon() : desktop()), s = await oeffnen(ctx, x);
      const st = await s.evaluate(() => {
        const kz = document.querySelector('.ein-kz'), a = kz && kz.querySelector('a'), cs = getComputedStyle(document.documentElement), r = (sel) => Array.from(document.querySelectorAll(sel));
        const sichtbar = (el) => !!el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden';
        return {
          titel: document.title, text: document.body.innerText, kz: kz ? kz.textContent.trim() : '', kzSichtbar: sichtbar(kz), kzHref: a ? a.href : '', kzRel: a ? a.rel : '', kzRef: a ? a.getAttribute('referrerpolicy') : '',
          kopfName: (document.querySelector('.hdr-inst .hdr-name') || {}).textContent || '', kopfLogo: (document.querySelector('.hdr-inst img') || {}).getAttribute ? document.querySelector('.hdr-inst img').getAttribute('src') : '',
          logos: r('.ein-zeichen.logo img').length, bilder: r('.ein-bilder img').map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })), standard: !!document.querySelector('.ein-bild img[src="/bilder/foto/app-start.webp"]'),
          akzent: cs.getPropertyValue('--accent').trim(), okFarbe: cs.getPropertyValue('--ok').trim(), konfig: window.KONFIG.instanz, icons: r('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').map((l) => l.getAttribute('href')).join(' '),
          kicker: (document.querySelector('.ein-start-in > .eyebrow.kicker') || {}).textContent || '', h1: (document.querySelector('.ein-start-in > h1') || {}).textContent || '',
          code: localStorage.getItem('instanz.' + window.KONFIG.instanz.id + '.aktiv'), pille: (document.querySelector('.ein-cta .btn.primary') || {}).textContent || ''
        };
      });
      st.quer = await waagrecht(s);
      await h.foto(s, '25-start-' + art + '-' + breite);
      if (breite === 'telefon') { start[art] = st; await merken(s, 'Start ' + art); }
      ok(!st.quer, '25.1 ' + art + ' (' + breite + '): kein waagrechter Scroll');
      h.sauber(s, '25.1 ' + art + ' (' + breite + '): Startansicht ohne Fehler, ohne fremde Anfragen');
      await ctx.close();
    }
  }
  const lum = (hex) => { const n = parseInt(String(hex).slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
  const kontrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const se = start.essential, sp = start.plus, ss = start.signature;
  ok(se.kzSichtbar && se.kz === 'Powered by EEZIframes' && se.kzHref === 'https://eeziframes.com/fuer-fensterbauer/' && /noopener/.test(se.kzRel) && se.kzRef === 'no-referrer' && se.kopfName === 'Fensterbau Lerche' && !se.kopfLogo && se.logos === 0 && se.standard && !se.bilder.length && se.akzent === '#8fd694' && /Fenster planen und anfragen/i.test(se.kicker),
    '25.1 Essential: „Powered by EEZIframes“ sichtbar und verlinkt (neuer Tab, ohne Referrer), Name als Text im Kopf, kein Logo, Startbild von eeziframes, Grün als Akzent');
  ok(!!sp.kopfLogo && /^\/marke\/\d+\/logo\.png$/.test(sp.kopfLogo) && sp.bilder.length === 2 && sp.bilder.every((b) => /^\/marke\/\d+\/start-\d\.jpg$/.test(b.src) && b.ok) && !sp.standard,
    '25.1 Plus: Logo im Kopf und Fotos des Betriebs aus /marke/ (geladen)');
  ok(sp.akzent === sp.konfig.akzent && /^#[0-9a-f]{6}$/.test(sp.akzent) && kontrast(sp.akzent, '#161616') >= 4.5 && sp.okFarbe === '#8fd694', '25.1 Plus: --accent ist die Firmenfarbe (' + sp.akzent + ', aufgehellt auf ' + kontrast(sp.akzent || '#000000', '#161616').toFixed(2) + ':1), --ok bleibt grün');
  ok(sp.kz === 'Konfigurator von eeziframes' && !/Powered by/i.test(sp.text) && sp.kicker === 'Glaserei Star · seit 1987' && /Neue Fenster für Ihr Zuhause/.test(sp.h1) && /Planen Sie in Ruhe auf dem Sofa/.test(sp.text), '25.1 Plus: eigene Startansicht (Kicker, Überschrift, Text) und dezenter Fuß „Konfigurator von eeziframes“ ohne Link');
  ok(!eezi.test(ss.text) && !eezi.test(ss.titel) && !eezi.test(ss.icons) && !ss.kz && ss.kopfName === 'Fensterwerk Kranich' && ss.akzent === ss.konfig.akzent, '25.1 Signature: kein „eeziframes“ in Text, Titel und Icon-Adressen (' + ss.icons + ')');
  ok([se, sp, ss].every((x) => !x.code && /Erstes Fenster ausmessen/.test(x.pille)), '25.1 Beim Öffnen entsteht noch keine Planung (kein Code), die Cream-Pille führt zum ersten Fenster');

  /* ---------- 25.2 / 25.6 Ganzer Ablauf auf Plus (Telefon) ---------- */
  const ctxA = await telefon(), sA = await oeffnen(ctxA, P);
  const anfragen = []; sA.on('request', (r) => anfragen.push({ m: r.method(), u: r.url() }));
  const vorNeu = anfragen.filter((a) => /\/api\/instanz\/start/.test(a.u)).length;
  await sA.click('[data-act="new"]'); await sA.waitForSelector('.scr[data-screen="start"]');
  const codeA = await sA.evaluate(() => S.betrieb.code), aktivA = await sA.evaluate(() => localStorage.getItem('instanz.' + KONFIG.instanz.id + '.aktiv'));
  ok(vorNeu === 0 && /^[a-z0-9]{10}$/.test(codeA) && aktivA === codeA, '25.2 Code erst mit dem ersten Fenster (POST /api/instanz/start), gemerkt als laufende Planung dieses Geräts (' + codeA + ')');
  await merken(sA, 'Start des Fensters');
  await fotosMachen(sA); await merken(sA, 'Fotos');
  await fensterSpeichern(sA, 'Wohnzimmer'); await sA.waitForSelector('.scr[data-screen="fertig"]'); await merken(sA, 'Fenster gespeichert');
  const fotosOben = await bis(sA, async () => !!S.windows[0] && bilderVon(S.windows[0]).length === 2 && (await fotosOffen()) === 0, 20000);
  const ids = await sA.evaluate(() => bilderVon(S.windows[0]));
  const ab = (await X.attrappe()).ablage.fotos || [], ord = 'link/' + codeA + '/';
  const kiCode = anfragen.filter((a) => /\/api\/ki\?/.test(a.u) && a.m === 'POST'), fotoPost = anfragen.filter((a) => a.m === 'POST' && /\/api\/link\/[a-z0-9]{10}\/foto\//.test(a.u)).map((a) => a.u.split('/foto/')[1]);
  ok(fotosOben && ids.length === 2 && ids.every((i) => ab.includes(ord + i + '.jpg') && ab.includes(ord + i + 'k.jpg')) && ids.every((i) => fotoPost.includes(i) && fotoPost.includes(i + 'k')), '25.6 Fotos: Original <id> und kleine Fassung <id>k gehen zur Planung (' + fotoPost.length + ' Uploads)');
  ok(kiCode.length >= 2 && kiCode.every((a) => a.u.includes('code=' + codeA)), '25.6 KI-Auswertung nur mit dem Code der Planung (' + kiCode.length + ' Aufrufe mit code=)');
  /* 25.4 neu laden und zweites Gerät */
  await sA.reload({ waitUntil: 'networkidle' }); await sA.waitForTimeout(500);
  const nachLaden = await sA.evaluate(() => ({ n: S.windows.length, name: (S.windows[0] || {}).name, code: S.betrieb.code, screen: S.screen }));
  await merken(sA, 'Liste'); await h.foto(sA, '25-liste-plus');
  await sA.click('[data-act="inst-geraet"]'); await sA.waitForTimeout(200);
  const weiterLink = await sA.inputValue('.inst-link input');
  ok(nachLaden.n === 1 && nachLaden.name === 'Wohnzimmer' && nachLaden.code === codeA && weiterLink === base(P) + '/#k-' + codeA, '25.4 Neu geladen: dieselbe Planung; „Auf anderem Gerät weitermachen“ zeigt ' + weiterLink);
  const ctxB = await desktop(), sBz = await oeffnen(ctxB, P, '/#k-' + codeA);
  await sBz.waitForFunction(() => S.windows.length === 1, null, { timeout: 10000 }).catch(() => {});
  const zweit = await sBz.evaluate(() => ({ n: S.windows.length, name: (S.windows[0] || {}).name, hash: location.hash, aktiv: localStorage.getItem('instanz.' + KONFIG.instanz.id + '.aktiv'), web: S.betrieb.website }));
  ok(zweit.n === 1 && zweit.name === 'Wohnzimmer' && zweit.hash === '' && zweit.aktiv === codeA && zweit.web, '25.4 Zweites Gerät mit #k-<code>: Entwurf da, Code aus der Adresse genommen und als laufende Planung gemerkt');
  h.sauber(sBz, '25.4 Zweites Gerät ohne Fehler'); await ctxB.close();
  /* Kontakt Pflicht, Senden */
  const kontaktA = { name: 'Familie Ahorn', tel: '0171 2345678', mail: 'ahorn@beispiel.de', erreich: 'nm' };
  const ohne = await kontaktSenden(sA, kontaktA, { ohne: true, merken: true });
  ok(ohne && ohne.screen === 'anfrage3' && ohne.bad >= 2 && /Namen/.test(ohne.text) && /Telefonnummer oder E-Mail/.test(ohne.text), '25.2 Kontakt ist Pflicht: ohne Name und Telefon oder E-Mail bleibt „Prüfen und senden“ auf dem Kontakt-Schritt, Fehler am Feld');
  await merken(sA, 'Bestätigung'); await h.foto(sA, '25-bestaetigung-plus');
  const best = await sA.evaluate(() => ({ nr: S.sent.nr, text: document.querySelector('.scr').innerText, pdfKnopf: !!document.querySelector('[data-act="inst-pdf"]'), weitere: !!document.querySelector('[data-act="inst-weitere"]'), vergessen: !!document.querySelector('[data-act="inst-vergessen"]') }));
  const zA = await T.zeile(codeA);
  ok(/^P-\d{4}-\d{3}$/.test(best.nr) && best.text.includes(best.nr) && /Glaserei Star hat jetzt Ihre Maße/.test(best.text) && /Petra Star|0221/.test(best.text) && best.pdfKnopf && best.weitere && best.vergessen, '25.2 Bestätigung mit Nummer ' + best.nr + ', „Glaserei Star … meldet sich“, Kontaktkarte, PDF, weitere Anfrage, vergessen');
  ok(zA && zA.instanz === P.id && zA.nr === best.nr && zA.daten.kunde === 'Familie Ahorn' && ((zA.daten.aufmass || {}).proj || {}).erreich === 'nm' && zA.art === 'website', '25.2 Beim Betrieb: Anfrage mit diesem Code, Name, Erreichbarkeit „nachmittags“');
  const mailA = (await T.warteMail((m) => (m.betreff || '').includes('Familie Ahorn'), 15000))[0];
  ok(!!mailA && mailA.an === 'anfragen@b-plus.example', '25.2 Mail mit der Anfrage an den Betrieb');
  const pdfA = await pdfHolen(sA);
  ok(pdfA.buf.slice(0, 4).toString() === '%PDF' && /^Anfrage-P-\d{4}-\d{3}\.pdf$/.test(pdfA.name) && /Glaserei Star/.test(pdfA.text) && /Familie Ahorn/.test(pdfA.text) && /Erstellt mit eeziframes/.test(pdfA.text) && !/Anfrage · erstellt mit eeziframes/.test(pdfA.text), '25.2 „Meine Anfrage als PDF“ (' + pdfA.name + '): Marke des Betriebs, Kunde, Plus nur im Fuß gekennzeichnet');
  await sA.click('.bb .btn'); await sA.waitForTimeout(500);
  const nach = await lokal(sA), roh = JSON.stringify(nach.ls), eintrag = JSON.parse(nach.ls['aufmass.k.' + codeA] || '{}');
  await merken(sA, 'Nach dem Senden'); await h.foto(sA, '25-nach-senden-plus');
  ok(eintrag.sent && eintrag.sent.nr === best.nr && eintrag.sent.kurz && !(eintrag.windows || []).length && !(eintrag.proj || {}).name && !/Ahorn|0171|ahorn@|Wohnzimmer/.test(roh) && !nach.idb.length && !Object.keys(nach.ls).some((k) => /\.entwurf$/.test(k)), '25.2 Bestätigung verlassen: auf dem Gerät nur Nummer, Datum und Betrieb; Fenster, Kontakt und Fotos (IndexedDB) gelöscht');
  await sA.click('[data-act="inst-weitere"]'); await sA.waitForSelector('.scr[data-screen="start"]', { timeout: 8000 });
  const codeA2 = await sA.evaluate(() => S.betrieb.code), nach2 = await lokal(sA);
  ok(/^[a-z0-9]{10}$/.test(codeA2) && codeA2 !== codeA && nach2.ls['instanz.' + P.id8 + '.aktiv'] === codeA2 && !nach2.ls['aufmass.k.' + codeA] && JSON.parse(nach2.ls['instanz.' + P.id8 + '.gesendet'] || '[]')[0].nr === best.nr, '25.2 „Weitere Anfrage starten“: neuer Code, die gesendete bleibt als Nummer gemerkt');
  await sA.evaluate(() => go('home')); await sA.waitForTimeout(300);
  const frueher = await sA.evaluate(() => (document.querySelector('.inst-frueher') || {}).innerText || '');
  await sA.click('.inst-frueher [data-act="inst-vergessen"]'); await sA.waitForTimeout(300);
  const weg = await lokal(sA);
  ok(frueher.includes(best.nr) && !Object.keys(weg.ls).some((k) => k.startsWith('instanz.') || k.startsWith('aufmass.k.')) && !weg.idb.length, '25.2 „Auf diesem Gerät vergessen“: keine Planung, keine Nummer mehr auf dem Gerät');
  h.sauber(sA, '25.2 Ganzer Ablauf ohne Fehler, ohne fremde Anfragen'); await ctxA.close();

  /* Essential und Signature: Ablauf mit Fenster ohne Fotos, Kennzeichnung im PDF je Paket */
  const pdfs = {};
  for (const [x, art, k] of [[E, 'essential', { name: 'Familie Birke', mail: 'birke@beispiel.de' }], [S9, 'signature', { name: 'Familie Eiche', tel: '0221 998877' }]]) {
    const ctx = await telefon(), s = await oeffnen(ctx, x);
    await s.click('[data-act="new"]'); await s.waitForSelector('.scr[data-screen="start"]');
    await fensterSpeichern(s, 'Küche'); await s.waitForSelector('.scr[data-screen="fertig"]');
    if (art === 'signature') await merken(s, 'Fenster gespeichert (Signature)');
    await kontaktSenden(s, k, { merken: art === 'signature' });
    if (art === 'signature') { await merken(s, 'Bestätigung (Signature)'); await h.foto(s, '25-bestaetigung-signature'); }
    pdfs[art] = await pdfHolen(s);
    await s.click('.bb .btn'); await s.waitForTimeout(300);
    if (art === 'signature') await merken(s, 'Nach dem Senden (Signature)');
    h.sauber(s, '25.2 ' + art + ': Ablauf ohne Fehler'); await ctx.close();
  }
  ok(/Anfrage · erstellt mit eeziframes/.test(pdfs.essential.text) && /Erstellt mit eeziframes/.test(pdfs.essential.text) && /Fensterbau Lerche/.test(pdfs.essential.text) && /Familie Birke/.test(pdfs.essential.text), '25.2 PDF-Kopie Essential: deutlich gekennzeichnet (Untertitel und Fuß)');
  ok(/Fensterwerk Kranich/.test(pdfs.signature.text) && /Familie Eiche/.test(pdfs.signature.text) && !eezi.test(pdfs.signature.text) && !eezi.test(pdfs.signature.roh), '25.2 PDF-Kopie Signature: Marke des Betriebs, kein „eeziframes“ (auch nicht als Autor oder Ersteller)');

  /* ---------- 25.3 und 25.1 (Signature) über alle besuchten Bildschirme ---------- */
  const verbotenH = gesehen.filter((g) => VERBOTEN_H.test(g.html)).map((g) => g.wo + ': ' + (g.html.match(VERBOTEN_H) || [])[0]);
  const verbotenT = gesehen.filter((g) => VERBOTEN_T.test(g.text)).map((g) => g.wo + ': ' + (g.text.match(VERBOTEN_T) || [])[0]);
  const euro = gesehen.filter((g) => /€/.test(g.text.replace(/(bis\s|über\s)?\d{1,3}(\.\d{3})*(\sbis\s\d{1,3}(\.\d{3})*)?\s€/g, ''))).map((g) => g.wo + ': ' + (g.text.match(/.{0,30}€.{0,10}/) || [])[0]);
  ok(!verbotenH.length && !verbotenT.length && !euro.length, '25.3 Auf ' + gesehen.length + ' Bildschirmen kein Preis, keine Kasse, kein WhatsApp, keine AGB-, Widerrufs- oder Cookie-Links, keine Führung; € nur im Wunschbudget' + (verbotenH.concat(verbotenT, euro).length ? ' (' + verbotenH.concat(verbotenT, euro).join('; ') + ')' : ''));
  const sigEezi = gesehen.filter((g) => /Signature|Start signature/.test(g.wo) && eezi.test(g.text)).map((g) => g.wo);
  ok(!sigEezi.length, '25.1 Signature: auch nach dem Senden und in der Bestätigung kein „eeziframes“' + (sigEezi.length ? ' (' + sigEezi.join(', ') + ')' : ''));
  const quer = gesehen.filter((g) => g.quer).map((g) => g.wo);
  ok(!quer.length, '25.9 Kein waagrechter Scroll auf allen besuchten Bildschirmen' + (quer.length ? ' (' + quer.join(', ') + ')' : ''));

  /* ---------- 25.5 Server weg: kein Pilot-Weg; Planung verfallen: still neu ---------- */
  const ctxW = await telefon();
  await ctxW.route('**/api/status', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' }));
  const sW = await oeffnen(ctxW, E);
  const w1 = await sW.evaluate(() => ({ pilot: PILOT, text: document.body.innerText, html: document.getElementById('app').innerHTML }));
  await sW.click('[data-act="new"]'); await sW.waitForTimeout(600);
  await fensterSpeichern(sW, 'Flur'); await sW.waitForTimeout(300);
  await sW.evaluate(() => { Object.assign(S.proj, { name: 'Familie Funkloch', tel: '0171 1112223' }); persist(); });
  await sW.evaluate(() => { go('blatt'); act('send', document.body); }); await sW.waitForTimeout(800);
  const w2 = await sW.evaluate(() => ({ sent: !!S.sent, toast: S.toast || '', html: document.getElementById('app').innerHTML, n: S.windows.length }));
  ok(w1.pilot === false && /Gerade nicht erreichbar/.test(w1.text) && !/wa\.me|Pilotphase|Übermittlungscode/.test(w1.html + w2.html) && !w2.sent && w2.n === 1 && /nicht erreichbar/i.test(w2.toast), '25.5 /api/status antwortet 500: kein Pilot-Weg, Hinweis „Gerade nicht erreichbar“, Senden wartet, die Planung bleibt');
  sW.probleme.length = 0; await ctxW.close();
  const ctxN = await telefon(), sN = await oeffnen(ctxN, E);
  await sN.evaluate((a) => { localStorage.setItem('instanz.' + KONFIG.instanz.id + '.aktiv', 'zzzz' + a.t); localStorage.setItem('aufmass.k.zzzz' + a.t, JSON.stringify({ windows: [{ name: 'Bad', wid: 'fbad1', t0: Date.now(), aend: 0, ts: Date.now(), mo: a.mo, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }], proj: { name: '' }, stand: Date.now() })); }, { t: Date.now().toString(36).slice(-6), mo: MO });
  const altCode = await sN.evaluate(() => localStorage.getItem('instanz.' + KONFIG.instanz.id + '.aktiv'));
  await sN.reload({ waitUntil: 'networkidle' });
  await sN.waitForFunction((alt) => S.betrieb && /^[a-z0-9]{10}$/.test(S.betrieb.code) && S.betrieb.code !== alt, altCode, { timeout: 10000 }).catch(() => {});
  await sN.waitForTimeout(1800);
  const neu = await sN.evaluate(() => ({ code: S.betrieb.code, aktiv: localStorage.getItem('instanz.' + KONFIG.instanz.id + '.aktiv'), n: S.windows.length, name: (S.windows[0] || {}).name, zu: S.linkZu, text: document.body.innerText }));
  const zwN = ((await X.attrappe()).entwuerfe || []).find((e) => e.code === neu.code);
  ok(neu.code !== altCode && neu.aktiv === neu.code && neu.n === 1 && neu.name === 'Bad' && !neu.zu && !/nicht mehr|Hier geht es gerade nicht weiter/.test(neu.text) && !!zwN && ((zwN.daten || {}).windows || []).length === 1, '25.5 Planung beim Server verfallen (404): still ein neuer Code, das Fenster auf dem Gerät bleibt und geht als Zwischenstand hin');
  sN.probleme = sN.probleme.filter((p) => !/HTTP 404: .*\/api\/link\/zzzz/.test(p) && !/status of 404/.test(p)); // der verfallene Code antwortet erwartungsgemäß 404
  h.sauber(sN, '25.5 Ohne weitere Fehler');
  /* Pause, während die App offen ist: die API antwortet 503 mit Status, die App zeigt die Seite des Betriebs mit Kontakt */
  await X.instanz({ id: E.id }, { status: 'pausiert' });
  await sN.evaluate(() => { go('fertig'); linkPruefen(); }); await sN.waitForTimeout(800);
  const pz = await sN.evaluate(() => ({ screen: S.screen, zu: S.instZu, text: document.querySelector('.scr').innerText, n: S.windows.length }));
  await sN.evaluate(() => { const b = document.createElement('button'); act('new', b); }); await sN.waitForTimeout(300);
  const pz2 = await sN.evaluate(() => ({ screen: S.screen, start: !!document.querySelector('.scr[data-screen="start"]') }));
  await h.foto(sN, '25-pausiert');
  await X.instanz({ id: E.id }, { status: 'aktiv' });
  ok(pz.zu === 'pausiert' && pz.screen === 'home' && /gerade nicht erreichbar/i.test(pz.text) && /Fensterbau Lerche/.test(pz.text) && /0221/.test(pz.text) && pz.n === 1 && pz2.screen === 'home' && !pz2.start, '25.5 Instanz pausiert, während die App offen ist: Seite „gerade nicht erreichbar“ mit Kontakt des Betriebs, kein neues Fenster, die Planung bleibt');
  sN.probleme = sN.probleme.filter((p) => !/HTTP 503|status of 503/.test(p)); // die API antwortet erwartungsgemäß 503
  h.sauber(sN, '25.5 Pause ohne weitere Fehler'); await ctxN.close();

  /* ---------- 25.7 Signature-Einladung ---------- */
  const ein = (await T.test({ einladung: { instanz: S9.id, kunde: 'Familie Linde', du: false } })).einladung;
  const ctxE = await telefon(), sE = await oeffnen(ctxE, S9, '/#k-' + ein.code);
  await sE.waitForFunction(() => window.LK_SERVER !== undefined || true, null, { timeout: 2000 }).catch(() => {});
  await sE.waitForTimeout(800);
  const e1 = await sE.evaluate(() => ({ text: document.body.innerText, hash: location.hash, aktiv: localStorage.getItem('instanz.' + KONFIG.instanz.id + '.aktiv'), web: instWebsite() }));
  await h.foto(sE, '25-einladung-signature');
  const zE = await T.warteZeile(ein.code, (z) => z.status === 'geoeffnet' || !!((z.daten || {}).log || {}).geoeffnet, 8000);
  ok(/Persönliche Anfrage von/.test(e1.text) && /Fensterwerk Kranich/.test(e1.text) && /für Familie Linde/.test(e1.text) && !eezi.test(e1.text) && !e1.web && !e1.aktiv && e1.hash === '#k-' + ein.code, '25.7 Signature-Einladung #k-…: persönliche Startseite in der Marke, ohne eeziframes, nicht als Planung der Website gemerkt');
  ok(!!zE && (zE.status === 'geoeffnet' || !!((zE.daten || {}).log || {}).geoeffnet), '25.7 „Geöffnet“ an den Betrieb gemeldet');
  await sE.click('[data-act="new"]'); await sE.waitForSelector('.scr[data-screen="start"]');
  await fensterSpeichern(sE, 'Erker'); await sE.waitForSelector('.scr[data-screen="fertig"]');
  await sE.evaluate(() => go('anfrage')); await sE.click('.bb .btn.primary'); await sE.waitForSelector('.scr[data-screen="anfrage2"]');
  const e2 = await sE.evaluate(() => ({ kopf: (document.querySelector('.hd .eyebrow') || {}).textContent || '', bar: (document.querySelector('.bb .btn.primary') || {}).textContent || '' }));
  await sE.click('.bb .btn.primary'); await sE.waitForSelector('.scr[data-screen="blatt"]'); await sE.click('.bb .btn.primary');
  await sE.waitForFunction(() => S.sent && S.sent.uebertragen, null, { timeout: 20000 });
  const zE2 = await T.zeile(ein.code), e3 = await sE.evaluate(() => document.body.innerText);
  ok(/2 von 2/.test(e2.kopf) && /Prüfen und senden/.test(e2.bar) && zE2.status === 'eingegangen' && !eezi.test(e3), '25.7 Einladung: zwei Schritte ohne Kontaktpflicht (der Betrieb kennt den Kunden), Eingang beim Betrieb, Bestätigung ohne eeziframes');
  h.sauber(sE, '25.7 Einladung ohne Fehler'); await ctxE.close();

  /* ---------- 25.8 Vorschau in der Einrichtung, Testanfrage ---------- */
  const zuV = await X.api(V.host, '/');
  const tokV = (await T.test({ verwalten: { fn: 'vorschauToken', args: [V.id] } })).verwalten;
  const ctxV = await telefon(), sV = await h.neueSeite(ctxV, base(V));
  await sV.goto(tokV.url, { waitUntil: 'networkidle' }); await sV.waitForTimeout(400);
  const v1 = await sV.evaluate(() => ({ url: location.href, band: (document.querySelector('.inst-vorschau') || {}).textContent || '', vorschau: KONFIG.instanz.vorschau }));
  await h.foto(sV, '25-vorschau');
  await sV.click('[data-act="new"]'); await sV.waitForSelector('.scr[data-screen="start"]');
  const bandFenster = await sV.evaluate(() => !!document.querySelector('.inst-vorschau'));
  await fensterSpeichern(sV, 'Probe'); await sV.waitForSelector('.scr[data-screen="fertig"]');
  await kontaktSenden(sV, { name: 'Familie Probe', mail: 'probe@beispiel.de' });
  const v2 = await sV.evaluate(() => ({ nr: S.sent.nr, art: S.sent.art, text: document.querySelector('.scr').innerText }));
  const mailV = (await T.warteMail((m) => (m.betreff || '').includes('Familie Probe'), 15000))[0];
  ok(zuV.status === 503 && v1.vorschau && /Vorschau/.test(v1.band) && /noch nicht öffentlich/.test(v1.band) && !/vorschau=/.test(v1.url) && bandFenster, '25.8 In der Einrichtung: ohne Cookie 503; der Vorschau-Link zeigt das Band „Vorschau – noch nicht öffentlich“ auf jedem Bildschirm');
  ok(v2.art === 'test' && /^TEST-/.test(v2.nr) && /Testanfrage/.test(v2.text) && !!mailV && /^\[Test\]/.test(mailV.betreff), '25.8 Senden in der Vorschau erzeugt eine Testanfrage (' + v2.nr + ', Betreff „[Test] …“)');
  h.sauber(sV, '25.8 Vorschau ohne Fehler'); await ctxV.close();

  /* ---------- 25.10 Hauptdomain-App unverändert ---------- */
  const ctxH = await desktop(), sH = await h.neueSeite(ctxH, X.base('localhost'));
  await sH.goto(X.base('localhost') + '/app/', { waitUntil: 'networkidle' }); await sH.waitForTimeout(400);
  const hd = await sH.evaluate(() => ({ inst: !!(window.KONFIG && window.KONFIG.instanz), betrieb: S.betrieb, text: document.body.innerText, recht: Array.from(document.querySelectorAll('.foot-links.recht a')).map((a) => a.getAttribute('href')).join(' ') }));
  ok(!hd.inst && hd.betrieb === null && /Fotografieren\./.test(hd.text) && /Führung starten/.test(hd.text) && /\/agb\//.test(hd.recht) && /\/widerruf\//.test(hd.recht), '25.10 Hauptdomain: eigene App wie bisher (eeziframes-Start, Führung, AGB und Widerruf in den Rechtslinks)');
  h.sauber(sH, '25.10 Hauptdomain ohne Fehler'); await ctxH.close();
};

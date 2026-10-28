// eeziframes · Prüfabschnitt 23: Mandant, Routing, Schutz der Konfigurator-Instanzen (Strang A, Bauplan §3 A; docs/INSTANZEN.md)
// 23.1 Hauptdomain unverändert · 23.2 unbekannter Host · 23.3 Routing je Paket, Alias, www, robots, noindex, Canonical · 23.4 Status-Matrix
// mit Vorschau-Cookie · 23.5 /config.js und Escaping · 23.6 /api/status · 23.7 Start und Host-Bindung · 23.8 Fotos · 23.9 KI · 23.10 Abrechnung
// · 23.11 Statistik · 23.12 Cache und Störung · 23.13 wrangler.jsonc · 23.14 Manifest
// Die Werkzeuge (werkzeug) nutzt auch Abschnitt 24.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

export const titel = 'Mandant, Routing, Schutz (Instanzen)';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

export function werkzeug(h, srv) {
  const S = srv || h;
  let ipZaehler = Math.floor(Math.random() * 200);
  const ip = () => ({ 'x-forwarded-for': '198.51.' + (ipZaehler % 250) + '.' + (++ipZaehler % 250) });
  const jpeg = (n) => { const b = Buffer.alloc(900, n % 251); b[0] = 0xff; b[1] = 0xd8; b[2] = 0xff; b[3] = 0xe0; return b.toString('base64'); };
  const fenster = (i, bilder, wid) => ({ wid: wid || 'w' + i + Date.now().toString(36), name: 'Fenster ' + (i + 1), mo: { wt: 1232, wm: 1230, wb: 1231, hl: 1412, hm: 1410, hr: 1411 }, el: { w: 1200, h: 1380 }, teilung: '2', ts: Date.now(), t0: Date.now(), bilder: bilder || undefined, fotos: bilder ? 2 : 0 });
  const id = (z) => 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + (z || '');
  const start = async (host, o) => { const r = await S.api(host, '/api/instanz/start', { body: {}, origin: true, headers: Object.assign(ip(), (o && o.headers) || {}), cookie: o && o.cookie }); return r; };
  const entwurf = (host, code, wins, o) => S.api(host, '/api/link/' + code + '/entwurf', { body: { windows: wins, proj: (o && o.proj) || {}, stand: Date.now(), projTs: Date.now() }, origin: true, cookie: o && o.cookie, headers: ip() });
  const senden = (host, code, wins, p, o) => S.api(host, '/api/aufmass', { body: { b: code, r: (o && o.runde) || undefined, w: wins, wm: wins.map((w) => ({ wid: w.wid, t0: w.t0, ts: w.ts })), p: p || {}, stand: Date.now(), projTs: Date.now() }, origin: true, cookie: o && o.cookie, headers: Object.assign(ip(), (o && o.headers) || {}) });
  const kontakt = (n) => ({ name: 'Familie Prüf ' + n, tel: '0171 555 ' + String(1000 + n), mail: 'pruef' + n + '@beispiel.de', erreich: 'vm', notiz: 'Bitte vormittags anrufen.' });
  /* ganze Anfrage über die Website: Start, Zwischenstand, Senden → { code, r (Antwort), wins } */
  const anfrage = async (host, n, o) => {
    o = o || {};
    const s = await start(host, o); if (s.status !== 200) return { start: s };
    const code = s.json.code, wins = o.wins || [fenster(0)];
    const e = await entwurf(host, code, wins, o);
    const r = await senden(host, code, wins, o.p || kontakt(n), o);
    return { code: code, r: r, wins: wins, entwurf: e };
  };
  const test = async (body) => { const r = await S.api('localhost', '/api/instanz/test', { body: body }); if (r.status !== 200) throw new Error('Prüfhilfe ' + r.status + ' ' + r.text.slice(0, 200)); return r.json; };
  const mails = (o) => S.post(o);
  const warteMail = async (pred, ms, o) => { const bis = Date.now() + (ms || 8000); while (Date.now() < bis) { const l = (await S.post(o)).filter(pred); if (l.length) return l; await warte(150); } return []; };
  const zeile = async (code) => ((await S.attrappe()).anfragen || []).find((a) => a.code === code) || null;
  const warteZeile = async (code, pred, ms) => { const bis = Date.now() + (ms || 8000); let z = null; while (Date.now() < bis) { z = await zeile(code); if (z && pred(z)) return z; await warte(150); } return z; };
  return { ip, jpeg, fenster, id, start, entwurf, senden, kontakt, anfrage, test, mails, warteMail, zeile, warteZeile };
}

export default async (h) => {
  const { ok } = h, W = h.WURZEL, T = werkzeug(h), I = h.instanzen;
  const lies = (rel) => fs.readFileSync(path.join(W, rel), 'utf8');
  const kopf = (r, n) => r.headers[n.toLowerCase()] || '';
  const eezi = /eeziframes/i;

  /* ---------- 23.1 Hauptdomain unverändert ---------- */
  const cfg = await h.api('localhost', '/config.js');
  ok(cfg.status === 200 && cfg.text === lies('web/config.js'), '23.1 Hauptdomain: /config.js bytegleich mit web/config.js');
  const holeBase = async (p) => { const r = await fetch(h.BASE + p); return { status: r.status, text: await r.text() }; };
  for (const p of ['/', '/app/']) {
    const hier = await h.api('localhost', p), dort = await holeBase(p), ohneHost = (t) => t.split(h.base('localhost')).join('ADRESSE').split(h.BASE.replace(/\/$/, '')).join('ADRESSE');
    ok(hier.status === 200 && ohneHost(hier.text) === ohneHost(dort.text) && /eeziframes/.test(hier.text), '23.1 Hauptdomain: ' + p + ' gleich wie auf dem Server der übrigen Suite (kein Instanz-Kopf)');
  }
  for (const p of ['/zentrale/', '/bestellen/', '/konto/', '/betrieb/']) {
    const r = await h.api('localhost', p), csp = kopf(r, 'content-security-policy');
    ok(/frame-ancestors 'none'/.test(csp) && /script-src 'self'/.test(csp) && kopf(r, 'x-frame-options') === 'DENY' && /no-store/.test(kopf(r, 'cache-control')) && /noindex/.test(kopf(r, 'x-robots-tag')), '23.1 Hauptdomain ' + p + ': volle CSP, X-Frame-Options DENY, no-store, noindex (' + r.status + ')');
  }
  const fav = await h.api('localhost', '/favicon.svg'), ati = await h.api('localhost', '/apple-touch-icon.png');
  ok(fav.status === 200 && ati.status === 200 && !kopf(fav, 'x-robots-tag') && !kopf(ati, 'x-robots-tag'), '23.1 Hauptdomain: Icons ohne X-Robots-Tag');
  const zuf = await h.api('localhost', '/gibts-' + Date.now().toString(36));
  ok(zuf.status === 404 && /<title>Seite nicht gefunden · eeziframes/.test(zuf.text) && !!kopf(zuf, 'content-security-policy'), '23.1 Hauptdomain: zufälliger Pfad → 404.html mit Status 404');

  /* ---------- 23.2 Unbekannter Host ---------- */
  const fremd = 'fremd-' + Date.now().toString(36) + '.localhost';
  const u1 = await h.api(fremd, '/'), u2 = await h.api(fremd, '/api/status'), u3 = await h.api(fremd, '/', { headers: { 'x-forwarded-host': 'essential.localhost', 'x-test-host': 'essential.localhost' } });
  const u4 = await h.api('essential.localhost', '/', { headers: { 'x-forwarded-host': 'localhost', 'x-test-host': 'localhost' } });
  ok(u1.status === 404 && !eezi.test(u1.text) && /noindex/.test(kopf(u1, 'x-robots-tag')) && !!kopf(u1, 'content-security-policy') && u2.status === 404, '23.2 Unbekannter Host: 404 neutral (kein eeziframes, noindex, CSP), auch /api/…');
  ok(u3.status === 404 && u4.status === 200 && /Fensterbau Amsel/.test(u4.text), '23.2 Kopfzeilen X-Forwarded-Host und x-test-host ändern den Host nicht');

  /* ---------- 23.3 Routing je Paket ---------- */
  await h.instanz('plus', { indexierung: false }); await h.instanz('signature', { indexierung: false });
  const MATRIX = [['/', 200], ['/index.html', 200], ['/app/', 301], ['/app', 301], ['/config.js', 200], ['/favicon.svg', 200], ['/manifest.webmanifest', 200], ['/impressum/', 200], ['/datenschutz/', 200], ['/impressum', 301], ['/robots.txt', 200],
    ['/sitemap.xml', 404], ['/ratgeber/', 404], ['/ratgeber/fenster-ausmessen/', 404], ['/fuer-fensterbauer/', 404], ['/agb/', 404], ['/widerruf/', 404], ['/cookies/', 404], ['/nutzungsbedingungen/', 404], ['/zentrale/', 404], ['/partner/', 404], ['/llms.txt', 404],
    ['/verifyforzoho.html', 404], ['/404.html', 404], ['/404', 404], ['/gibts-nicht', 404], ['/assets/app.js', 200], ['/fonts/fonts.css', 200], ['/vendor/jspdf.umd.min.js', 200], ['/assets/gibts-nicht.js', 404], ['/marke/1/logo.png', 404]];
  for (const p of ['essential', 'plus', 'signature']) {
    const host = I[p].host, falsch = [];
    for (const [pfad, soll] of MATRIX) { const r = await h.api(host, pfad); if (r.status !== soll) falsch.push(pfad + ' ' + r.status); if (soll === 404 && !/\.(js|css)$/.test(pfad) && eezi.test(r.text)) falsch.push(pfad + ' nennt eeziframes'); }
    const icon = await h.api(host, '/apple-touch-icon.png'), og = await h.api(host, '/og.png'), btr = await h.api(host, '/betrieb'), btr2 = await h.api(host, '/betrieb/');
    const iconSoll = p === 'essential' ? 200 : 404; // Plus/Signature ohne veröffentlichte Icons: kein eeziframes-Symbol
    if (icon.status !== iconSoll || og.status !== iconSoll) falsch.push('Icons ' + icon.status + '/' + og.status);
    if (p === 'signature' ? btr.status !== 301 : btr.status !== 404) falsch.push('/betrieb ' + btr.status);
    if (p !== 'signature' && btr2.status !== 404) falsch.push('/betrieb/ ' + btr2.status);
    /* /api/konto… gehört auf Signature-Hosts dem Dashboard (Strang E); hier nur: nie offen ohne Anmeldung */
    for (const a of ['/api/test/post', '/api/zentrale/status', '/api/auftrag/anmelden', '/api/inhaber/anmelden', '/api/konto', '/api/kunde/aufmaesse', '/api/zahlung/status', '/api/widerruf', '/api/post/webhook', '/api/gibts-nicht']) { const r = await h.api(host, a, a === '/api/auftrag/anmelden' || a === '/api/inhaber/anmelden' || a === '/api/widerruf' || a === '/api/post/webhook' ? { body: {}, origin: true } : {}); if (p === 'signature' && a === '/api/konto' ? r.status < 400 : r.status !== 404) falsch.push(a + ' ' + r.status); }
    ok(!falsch.length, '23.3 ' + p + ': Routing-Matrix (Seiten, Dateien, zufällige Pfade, Positivliste der API)' + (falsch.length ? ': ' + falsch.join(', ') : ''));
  }
  const alias = await h.api('plus-alias.localhost', '/x?y=1'), www = await h.api('www.plus.localhost', '/impressum/'), aliasPost = await h.api('plus-alias.localhost', '/api/aufmass', { body: {} });
  ok(alias.status === 301 && alias.headers.location === h.base('plus.localhost') + '/x?y=1' && www.status === 301 && www.headers.location === h.base('plus.localhost') + '/impressum/' && aliasPost.status === 308, '23.3 Alias-Domain und www. → 301 auf den Haupthost (POST: 308)');
  const robE = await h.api(I.essential.host, '/robots.txt'), startE = await h.api(I.essential.host, '/');
  ok(!/Disallow/.test(robE.text) && /noindex/.test(kopf(startE, 'x-robots-tag')) && !kopf(startE, 'link') && !/rel="canonical"/.test(startE.text), '23.3 Ohne Indexierung: robots.txt ohne Disallow, / mit noindex, kein Canonical');
  await h.instanz('plus', { indexierung: true }); await h.instanz('essential', { indexierung: true });
  const robP = await h.api(I.plus.host, '/robots.txt'), startP = await h.api(I.plus.host, '/'), impP = await h.api(I.plus.host, '/impressum/'), smP = await h.api(I.plus.host, '/sitemap.xml'), startE2 = await h.api(I.essential.host, '/');
  ok(/Disallow: \/api\//.test(robP.text) && /Disallow: \/betrieb\//.test(robP.text) && robP.text.includes('Sitemap: ' + h.base('plus.localhost') + '/sitemap.xml') && !kopf(startP, 'x-robots-tag') && kopf(startP, 'link') === '<' + h.base('plus.localhost') + '/>; rel="canonical"' && startP.text.includes('<link rel="canonical" href="' + h.base('plus.localhost') + '/">') && /noindex/.test(kopf(impP, 'x-robots-tag')) && smP.status === 200 && smP.text.includes('<loc>' + h.base('plus.localhost') + '/</loc>'), '23.3 Plus mit Indexierung: nur / ohne noindex, Canonical auf den Haupthost, robots mit Disallow und Sitemap');
  ok(/noindex/.test(kopf(startE2, 'x-robots-tag')), '23.3 Essential: auch mit Schalter noindex (Merkmal indexierung „nein“)');
  await h.instanz('plus', { indexierung: false }); await h.instanz('essential', { indexierung: false });

  /* ---------- 23.4 Status-Matrix mit Vorschau ---------- */
  const st = (await h.saat({ instanzen: [{ slug: 'statusprobe', paket: 'plus', name: 'Statusprobe Fenster', plz: '50667', status: 'einrichtung', tel: '0221 777 888', mail: 'kontakt@statusprobe.example' }] })).statusprobe;
  const H = st.host;
  const schreib = async (cookie) => {
    const out = {};
    out.start = (await T.start(H, { cookie })).status;
    out.link = (await h.api(H, '/api/link/abcdefghij', { cookie })).status;
    out.aufmass = (await h.api(H, '/api/aufmass', { body: { b: 'abcdefghij', w: [] }, origin: true, cookie })).status;
    out.fortschritt = (await h.api(H, '/api/link/abcdefghij/fortschritt', { body: { stufe: 'arbeit' }, origin: true, cookie })).status;
    out.entwurf = (await h.api(H, '/api/link/abcdefghij/entwurf', { body: { windows: [] }, origin: true, cookie })).status;
    out.foto = (await h.api(H, '/api/link/abcdefghij/foto/b1234567890ab', { body: { bild: T.jpeg(1) }, origin: true, cookie })).status;
    out.ki = (await h.api(H, '/api/ki?aufgabe=einbau&seite=in&code=abcdefghij', { body: '/9j/' + 'A'.repeat(400), origin: true, cookie, headers: { 'content-type': 'text/plain' } })).status;
    return out;
  };
  const e1 = await h.api(H, '/'), e1r = await h.api(H, '/impressum/'), e1s = await schreib(), ping = await h.api(H, '/api/instanz/ping');
  ok(e1.status === 503 && !/Statusprobe/.test(e1.text) && /In Vorbereitung/.test(e1.text) && e1r.status === 200 && Object.values(e1s).every((s) => s === 503) && ping.status === 200 && ping.json.instanz === st.id8, '23.4 einrichtung: / 503 neutral, Impressum 200, jede Schreibroute 503, Ping 200 (' + JSON.stringify(e1s) + ')');
  const vt = (await T.test({ verwalten: { fn: 'vorschauToken', args: [st.id] } })).verwalten;
  const vs = await h.api(H, '/?vorschau=' + encodeURIComponent(vt.token)), keks = (vs.cookies[0] || '').split(';')[0], vf = await h.api(H, '/?vorschau=falsch' + vt.token.slice(6));
  ok(vs.status === 302 && vs.headers.location === '/' && /^__Host-vorschau=/.test(keks) && /HttpOnly/.test(vs.cookies[0]) && /Secure/.test(vs.cookies[0]) && vf.status === 302 && !vf.cookies.length && vt.url === h.base(H) + '/?vorschau=' + encodeURIComponent(vt.token), '23.4 Vorschau-Link setzt __Host-vorschau (HttpOnly, Secure) und leitet ohne Token weiter; falsches Token setzt nichts');
  /* Pfad mit zwei Schrägstrichen (im Netz möglich, der Testserver liest ihn als fremden Host): direkt gegen seiten.js */
  const SEI = await import(pathToFileURL(path.join(W, 'functions/instanz/seiten.js')).href), SIT = await import(pathToFileURL(path.join(W, 'functions/api/sitzung.js')).href), UMG = await import(pathToFileURL(path.join(W, 'functions/api/umgebung.js')).href);
  const envV = { DATEN_ATTRAPPE: '1' }, tokV = await SIT.tokenSignieren(UMG.konfig(envV), 'vorschau', { i: 'id-v' }, 60);
  const vOffen = await SEI.ausliefern(new Request('https://probe.example//boese.example/?vorschau=' + encodeURIComponent(tokV)), envV, null, { id: 'id-v', haupt: true, haupthost: 'probe.example', status: 'einrichtung', m: {} });
  ok(vOffen.status === 302 && vOffen.headers.get('location') === '/boese.example/', '23.4 Vorschau-Weiterleitung bleibt auf dem eigenen Host (kein „//fremd“)');
  const v1 = await h.api(H, '/', { cookie: keks }), vcfg = await h.api(H, '/config.js', { cookie: keks });
  const tA = await T.anfrage(H, 900, { cookie: keks }), tZ = tA.code ? await T.warteZeile(tA.code, (z) => z.versand && z.versand.status !== 'offen') : null;
  const tMail = tA.code ? await T.warteMail((m) => m.betreff && m.betreff.startsWith('[Test] Neue Anfrage: Familie Prüf 900')) : [];
  ok(v1.status === 200 && /"vorschau":true/.test(vcfg.text) && tA.r && tA.r.status === 200 && tA.r.json.art === 'test' && tZ && tZ.art === 'test' && /^TEST-/.test(tZ.nr) && tMail.length === 1, '23.4 einrichtung mit Vorschau-Cookie: Seite 200, Senden als Testanfrage („[Test]“, Nummer TEST-…, nicht gezählt)');
  await T.test({ verwalten: { fn: 'instanzStatus', args: [st.id, 'aktiv', 'Prüfung'] } });
  const a1 = await h.api(H, '/'), a1s = await T.start(H);
  ok(a1.status === 200 && a1s.status === 200, '23.4 aktiv: Seite und Start offen');
  await T.test({ verwalten: { fn: 'instanzStatus', args: [st.id, 'pausiert', 'Prüfung'] } });
  const p1 = await h.api(H, '/'), p1r = await h.api(H, '/datenschutz/'), p1s = await schreib(keks), p1k = await h.api(H, '/config.js');
  ok(p1.status === 503 && /Statusprobe Fenster/.test(p1.text) && /0221 777 888/.test(p1.text) && !/<form/i.test(p1.text) && p1r.status === 200 && Object.values(p1s).every((s) => s >= 400) && p1k.status === 503, '23.4 pausiert: / 503 mit Name und Kontakt, ohne Formular; Recht 200; jede Schreibroute ≠ 2xx (' + JSON.stringify(p1s) + ')');
  await T.test({ verwalten: { fn: 'instanzStatus', args: [st.id, 'beendet', 'Prüfung'] } });
  const b1 = await h.api(H, '/'), b1r = await h.api(H, '/impressum/'), b1s = await schreib(keks);
  ok(b1.status === 410 && !/Statusprobe/.test(b1.text) && b1r.status === 200 && Object.values(b1s).every((s) => s >= 400), '23.4 beendet: / 410 neutral, Recht 200, jede Schreibroute ≠ 2xx (' + JSON.stringify(b1s) + ')');
  const zurueck = await h.api('localhost', '/api/instanz/test', { body: { verwalten: { fn: 'instanzStatus', args: [st.id, 'aktiv', 'Prüfung'] } } });
  ok(zurueck.status === 409, '23.4 Übergänge nur nach Instanzregeln (beendet → aktiv: 409)');

  /* ---------- 23.5 /config.js je Paket, Escaping ---------- */
  const lade = (text) => { const c = { window: {} }; vm.runInNewContext(text, c); return c.window.KONFIG; };
  const kE = lade((await h.api(I.essential.host, '/config.js')).text), kP = lade((await h.api(I.plus.host, '/config.js')).text), kSt = await h.api(I.signature.host, '/config.js'), kS = lade(kSt.text);
  ok(kE.instanz.m.kennzeichnung === 'deutlich' && !kE.instanz.m.logo && kE.instanz.farbe === '' && kP.instanz.farbe === '#8fb8e8' && /^#[0-9a-f]{6}$/.test(kP.instanz.akzent) && kS.instanz.m.dashboard === true && kS.instanz.m.kennzeichnung === 'keine' && !('preise' in kE) && !('preise' in kS) && !('einfuehrung' in kE) && kE.pilot === false && kE.instanz.id === I.essential.id8 && kE.instanz.grenzen.fenster === 50 && !eezi.test(kSt.text) && /max-age=60/.test(kSt.headers['cache-control']), '23.5 /config.js je Paket (Merkmale, Farbe, Akzent, keine Preise; Signature ohne eeziframes)');
  const bos = 'Fenster "Brandt" $\' <b>&';
  const bi = (await h.saat({ instanzen: [{ slug: 'escaping', paket: 'plus', name: bos, plz: '10115', farbe: '#f0c36a' }] })).escaping;
  await h.instanz('escaping', { marke: { name: bos, farbe: '#f0c36a', v: 1, bilder: {}, start: { kicker: '</script><script>', ueberschrift: '<img src=x>', text: '$&' } }, abweichung: {} });
  const esS = await h.api(bi.host, '/'), esK = await h.api(bi.host, '/config.js'), esF = await h.api(bi.host, '/favicon.svg'), esM = await h.api(bi.host, '/manifest.webmanifest');
  let kon = null; try { kon = lade(esK.text); } catch (e) { kon = null; }
  const titelZ = (esS.text.match(/<title>[^<]*<\/title>/) || [''])[0];
  ok(titelZ === '<title>Fenster planen und anfragen · Fenster &quot;Brandt&quot; $&#39; &lt;b&gt;&amp;</title>' && !esS.text.includes('<b>&') && kon && kon.marke === bos && kon.instanz.start.kicker === '</script><script>' && !/<\//.test(esK.text) && !esK.text.includes('<img') && />B<\/text>/.test(esF.text) && !/<b>|["']<\/text>/.test(esF.text) && JSON.parse(esM.text).name.startsWith(bos), '23.5 Escaping: Name mit Anführungszeichen, $\', <b> und & in Titel, /config.js (parsebar, ohne „<“), Initial-SVG (erster Buchstabe „B“, wie einladung.js) und Manifest');

  /* ---------- 23.6 /api/status ---------- */
  const sE = await h.api(I.essential.host, '/api/status');
  ok(sE.status === 200 && sE.json.instanz === true && sE.json.zahlung === false && sE.json.konten === false && sE.json.daten === true && ['preise', 'einfuehrung', 'verkauf', 'recht', 'zahlarten', 'hinweise', 'testmodus', 'attrappe'].every((x) => !(x in sE.json)), '23.6 /api/status auf Instanz-Hosts: ok, daten, ki, post, instanz, ohne Preise, Einführung, Verkauf, Recht');

  /* ---------- 23.7 Start und Host-Bindung ---------- */
  const sStart = await T.start(I.essential.host), codeE = sStart.json && sStart.json.code;
  const gE = await h.api(I.essential.host, '/api/link/' + codeE), gP = await h.api(I.plus.host, '/api/link/' + codeE), gH = await h.api('localhost', '/api/link/' + codeE), kurz = await h.api(I.essential.host, '/api/link/abcde');
  const att0 = await h.attrappe();
  ok(sStart.status === 200 && /^[a-z0-9]{10}$/.test(codeE) && sStart.json.betrieb === 'Fensterbau Amsel' && !att0.anfragen.some((a) => a.code === codeE) && att0.entwuerfe.some((e) => e.code === codeE && e.meta.instanz.id === I.essential.id), '23.7 Start: zehnstelliger Code, Zwischenstand mit meta.instanz, keine Zeile in anfragen');
  /* Altbestandslink (Betrieb auf der Hauptdomain) */
  const mail = 'alt-' + Date.now().toString(36) + '@beispiel.example';
  await h.api('localhost', '/api/konto/anmelden', { body: { mail: mail }, headers: T.ip() });
  const best = await h.api('localhost', '/api/konto/bestaetigen', { body: { mail: mail, code: '123456' }, headers: T.ip() }), tok = best.json && best.json.token;
  const RECHT = await import(pathToFileURL(path.join(W, 'functions/api/recht.js')).href);
  await h.api('localhost', '/api/konto/registrieren', { body: { firma: 'Altbestand Fenster', ap: 'Anna Alt', tel: '0221 123456', plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, headers: { authorization: 'Bearer ' + tok } });
  const proj = await h.api('localhost', '/api/konto/projekte', { body: { kunde: 'Familie Alt' }, headers: { authorization: 'Bearer ' + tok } });
  const altCode = proj.json && proj.json.konto && proj.json.konto.acc.links[0].code;
  const altH = await h.api('localhost', '/api/link/' + altCode), altI = await h.api(I.essential.host, '/api/link/' + altCode);
  ok(gE.status === 200 && gE.json.status === 'arbeit' && gE.json.instanz === true && gP.status === 404 && gH.status === 404 && kurz.status === 404 && altH.status === 200 && altI.status === 404, '23.7 Host-Bindung: Code von Essential auf Plus 404, virtueller Code auf der Hauptdomain 404, Altbestandslink auf der Instanz 404, fünfstelliger Code 404');

  /* ---------- 23.8 Fotos ---------- */
  const fA = T.id(), fB = T.id(), fC = T.id();
  const fs1 = await T.start(I.essential.host), fc = fs1.json.code, fw = 'wfoto' + Date.now().toString(36);
  const ohneF = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + fA, { body: { bild: T.jpeg(1) }, origin: true, headers: T.ip() });
  await T.entwurf(I.essential.host, fc, [T.fenster(0, { in: fA, out: fB }, fw)]);
  const f1 = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + fA, { body: { bild: T.jpeg(2) }, origin: true, headers: T.ip() });
  const f1k = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + fA + 'k', { body: { bild: T.jpeg(3) }, origin: true, headers: T.ip() });
  const fremdF = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + fC, { body: { bild: T.jpeg(4) }, origin: true, headers: T.ip() });
  const fremdHost = await h.api(I.plus.host, '/api/link/' + fc + '/foto/' + fA, { body: { bild: T.jpeg(5) }, origin: true, headers: T.ip() });
  /* höchstens 2 × Fenster + 4 verschiedene Fotos: mit einem Fenster 6; danach 409 */
  let voll = null;
  for (let i = 0; i < 4; i++) {
    const x = T.id(), y = T.id();
    await T.entwurf(I.essential.host, fc, [Object.assign(T.fenster(0, { in: x, out: y }, fw), { ts: Date.now() + i + 1 })]); // dasselbe Fenster, neu fotografiert
    const r1 = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + x, { body: { bild: T.jpeg(10 + i) }, origin: true, headers: T.ip() });
    const r2 = await h.api(I.essential.host, '/api/link/' + fc + '/foto/' + y, { body: { bild: T.jpeg(20 + i) }, origin: true, headers: T.ip() });
    if (r1.status === 409 || r2.status === 409) { voll = { i: i, s: [r1.status, r2.status] }; break; }
  }
  const abl = (await h.attrappe()).ablage.fotos.filter((p) => p.startsWith('link/' + fc + '/'));
  ok(ohneF.status === 409 && f1.status === 200 && f1k.status === 200 && fremdF.status === 400 && fremdHost.status === 404 && voll && voll.i === 2 && voll.s[0] === 200 && voll.s[1] === 409 && abl.includes('link/' + fc + '/' + fA + 'k.jpg'), '23.8 Fotos: ohne gespeichertes Fenster 409, fremde Kennung 400, fremder Host 404, kleine Fassung …k angenommen, mehr als 2 × Fenster + 4 Fotos 409' + (voll ? '' : ' (nie voll)'));

  /* ---------- 23.9 KI ---------- */
  const kiBild = '/9j/' + 'A'.repeat(400);
  const ki = (host, code, o) => h.api(host, '/api/ki?aufgabe=einbau&seite=in' + (code ? '&code=' + code : ''), Object.assign({ body: kiBild, origin: true, headers: Object.assign({ 'content-type': 'text/plain' }, T.ip()) }, o || {}));
  const kc = (await T.start(I.essential.host)).json.code;
  const k0 = await ki(I.essential.host, ''), kFremd = await ki(I.plus.host, kc), kStati = [];
  for (let i = 0; i < 7; i++) kStati.push((await ki(I.essential.host, kc)).status);
  const kiE = ((await h.attrappe()).entwuerfe.find((e) => e.code === kc) || { meta: {} }).meta.ki;
  ok(k0.status === 400 && kFremd.status === 404 && kStati.slice(0, 6).every((s) => s === 200) && kStati[6] === 429 && kiE === 6, '23.9 KI auf Instanz-Hosts nur mit eigenem Code; je Code ohne Fenster höchstens 6 (2 × 0 + 6), gezählt im Zwischenstand (' + kStati.join(',') + ')');
  const kiI = (await h.saat({ instanzen: [{ slug: 'kiprobe', paket: 'essential', name: 'KI-Probe Fenster', plz: '50667' }] })).kiprobe;
  await h.instanz('kiprobe', { abweichung: { kiMonat: 2 } });
  const kiStati = [];
  for (let i = 0; i < 5; i++) { const c = (await T.start(kiI.host)).json.code; kiStati.push((await ki(kiI.host, c)).status); }
  const kiAlarm = await T.warteMail((m) => /Kontingent erreicht bei KI-Probe Fenster/.test(m.betreff || ''), 3000);
  ok(kiStati.join() === '200,200,429,429,429' && kiAlarm.length === 1, '23.9 KI je Instanz und Monat: Alarm-Mail genau einmal beim Kontingent; ohne laufenden Auftrag nichts darüber hinaus, 429 ab dem Kontingent (' + kiStati.join(',') + ')');
  const s2 = await h.server({ KI_TAG_MAX: '3' });
  const tagStati = [];
  for (let i = 0; i < 4; i++) tagStati.push((await s2.api('localhost', '/api/ki?aufgabe=einbau&seite=in', { body: kiBild, origin: true, headers: Object.assign({ 'content-type': 'text/plain' }, T.ip()) })).status);
  const tagAlarm = (await s2.post()).filter((m) => /80 % des Tagesbudgets/.test(m.betreff || ''));
  ok(tagStati.join() === '200,200,200,429' && tagAlarm.length === 1, '23.9 Globales KI-Tagesbudget auch auf der Hauptdomain (KI_TAG_MAX=3: 429 bei der vierten, Alarm bei 80 %) (' + tagStati.join(',') + ')');

  /* ---------- 23.10 Abrechnung ---------- */
  const preis = [];
  for (const p of ['essential', 'plus', 'signature']) for (let n = 0; n < 5; n++) { const a = await T.anfrage(I[p].host, 100 + n + (p === 'plus' ? 10 : p === 'signature' ? 20 : 0)); preis.push(a.r && a.r.status); }
  const einl = [];
  for (let n = 0; n < 3; n++) { const l = (await T.test({ einladung: { instanz: I.signature.id, kunde: 'Familie Einladung ' + n } })).einladung; const w = [T.fenster(0)]; await T.entwurf(I.signature.host, l.code, w); einl.push({ code: l.code, r: (await T.senden(I.signature.host, l.code, w, {})).status, w: w }); }
  const nbT = await T.test({ nachbesserung: { code: einl[0].code, hinweis: 'Bitte Maß prüfen' } });
  const nbW = [Object.assign({}, einl[0].w[0], { ts: Date.now() + 1000, mo: { wt: 1240, wm: 1238, wb: 1239, hl: 1412, hm: 1410, hr: 1411 } })];
  const nbR = await T.senden(I.signature.host, einl[0].code, nbW, {}, { runde: 2 });
  const att1 = await h.attrappe(), instBetriebe = new Set(att1.instanzen.map((i) => i.betrieb));
  const buchungen = att1.betriebe.filter((b) => instBetriebe.has(b.id)).flatMap((b) => (b.daten.book || []).filter((x) => x.betrag > 0));
  const gesperrt = att1.anfragen.filter((a) => a.daten && a.daten.locked);
  const KONTEN = await import(pathToFileURL(path.join(W, 'functions/api/konten.js')).href);
  const rechnungen = [];
  const zd = { rechnung: async (o) => { rechnungen.push(o.id); return { neu: { nr: 'R-1', id: 'in_1', betrag: 9, buchungen: o.posten.map((p) => p.buchung) } }; } };
  const spF = { betriebeMitKunde: async () => [{ id: 'inst-b', stripe_customer: 'cus_i', daten: { instanz: { id: 'x' }, konto: 'instanz', pay: { type: 'Karte' }, book: [{ id: 'bi', kind: 'aufmass', status: 'offen', betrag: 9, text: 'x' }] } }, { id: 'alt-b', stripe_customer: 'cus_a', daten: { konto: 'service', pay: { type: 'Karte' }, book: [{ id: 'ba', kind: 'aufmass', status: 'offen', betrag: 9, text: 'y' }], rechnungen: [] } }], betriebAendern: async () => true };
  const lauf = await KONTEN.abrechnungslauf({}, spF, zd);
  const quellen = []; const such = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!['vendor', 'fonts', 'bilder', 'lottie'].includes(e.name)) such(f); } else if (/\.m?js$/.test(e.name)) quellen.push(f); } };
  such(path.join(W, 'functions')); such(path.join(W, 'web/assets')); quellen.push(path.join(W, 'worker.js'));
  const vergleich = quellen.filter((f) => !f.endsWith(path.join('assets', 'pakete.js')) && /\bpaket\s*[!=]==?\s*['"]/.test(fs.readFileSync(f, 'utf8')));
  if (!(preis.every((s) => s === 200) && einl.every((e) => e.r === 200) && nbR.status === 200)) console.log('    23.10 Stati:', preis.join(','), einl.map((e) => e.r).join(','), nbT.nachbesserung, nbR.status, nbR.text.slice(0, 200));
  if (buchungen.length || gesperrt.length || rechnungen.join() !== 'alt-b' || lauf.rechnungen !== 1) console.log('    23.10:', JSON.stringify({ buchungen: buchungen.length, gesperrt: gesperrt.length, rechnungen: rechnungen, lauf: lauf }));
  ok(preis.every((s) => s === 200) && einl.every((e) => e.r === 200) && /Nachbesserung angefragt/.test(nbT.nachbesserung || '') && nbR.status === 200 && !buchungen.length && !gesperrt.length && rechnungen.join() === 'alt-b' && lauf.rechnungen === 1 && !vergleich.length, '23.10 Abrechnung: 15 Website-Anfragen, 3 Einladungen, 1 Nachbesserung ohne Buchung > 0 und ohne Sperre; abrechnungslauf übergeht Instanzen, rechnet den Altbestand ab; kein „paket ===“' + (vergleich.length ? ' (' + vergleich.join(', ') + ')' : ''));

  /* ---------- 23.11 Statistik getrennt ---------- */
  const z = await h.zentrale(), vorher = await z.api('/api/zentrale/statistik?tage=7');
  for (let i = 0; i < 3; i++) await h.api(I.plus.host, '/');
  await warte(400);
  const nachher = await z.api('/api/zentrale/statistik?tage=7'), stat = (await T.test({ statistik: true })).statistik;
  const instAufruf = stat.filter((r) => r.schluessel === 'inst:' + I.plus.id8 + ':aufruf').reduce((s, r) => s + r.anzahl, 0);
  const json = JSON.stringify(nachher.json || {});
  ok(nachher.status === 200 && vorher.json.summe.aufrufe === nachher.json.summe.aufrufe && instAufruf >= 3 && stat.some((r) => r.schluessel === 'inst:' + I.essential.id8 + ':anfrage') && stat.some((r) => r.schluessel === 'inst:' + I.essential.id8 + ':start') && !/inst:/.test(json) && !/"budget/.test(json), '23.11 Statistik: Aufrufe der Instanzen zählen als inst:<id8>:…, nie als Seitenaufruf von eeziframes; die Auswertung der Zentrale lässt inst: und budget: aus');

  /* ---------- 23.12 Cache und Störung ---------- */
  await h.instanz('plus', { marke: { name: 'Glaserei Fink Neu', farbe: '#8fb8e8', v: 1, bilder: {}, start: {} } });
  const neuK = await h.api(I.plus.host, '/config.js');
  await h.instanz('plus', { marke: { name: 'Glaserei Fink', farbe: '#8fb8e8', v: 1, bilder: {}, start: {} } });
  await h.api(I.plus.host, '/'); await h.api(I.plus.host, '/config.js'); // L1 füllen
  await T.test({ stoerung: { daten: true } });
  const stS = await h.api(I.plus.host, '/'), stK = await h.api(I.plus.host, '/config.js'), stU = await h.api('nie-gesehen-' + Date.now().toString(36) + '.localhost', '/');
  await T.test({ stoerung: { daten: false } });
  ok(/Glaserei Fink Neu/.test(neuK.text) && stS.status === 200 && /Glaserei Fink/.test(stS.text) && stK.status === 200 && stU.status === 503 && !eezi.test(stU.text), '23.12 Cache: Änderung wirkt mit INSTANZ_CACHE_MS=0 sofort; Datenbank gestört → / und /config.js aus dem letzten Stand, unbekannter Host 503 neutral');

  /* ---------- 23.13 wrangler.jsonc ---------- */
  const wr = lies('wrangler.jsonc'), wrCode = wr.replace(/^\/\*[\s\S]*?\*\//, '').split('\n').map((x) => x.replace(/^\s*\/\/.*$/, '')).join('\n');
  const rwf = JSON.parse((wr.match(/"run_worker_first":\s*(\[[^\]]*\])/) || [])[1] || '[]');
  ok(!/"routes"|"route"|"custom_domain"/.test(wrCode) && !/not_found_handling/.test(wrCode) && ['/config.js', '/favicon.svg', '/apple-touch-icon.png', '/og.png', '/manifest.webmanifest', '/marke/*', '/betrieb', '/betrieb/*', '/404.html', '/404', '/404/', '/'].every((p) => rwf.includes(p)), '23.13 wrangler.jsonc: keine routes/custom_domain, kein not_found_handling, die Pfade der Instanzen laufen durch den Worker, auch /404 und /404/ (Befund 20: sonst liefert html_handling die eeziframes-Fehlerseite mit 200)');

  /* ---------- 23.14 Manifest je Instanz ---------- */
  const mE = JSON.parse((await h.api(I.essential.host, '/manifest.webmanifest')).text), mSr = await h.api(I.signature.host, '/manifest.webmanifest'), mS = JSON.parse(mSr.text);
  const kopfS = (await h.api(I.signature.host, '/')).text.split('</head>')[0];
  ok(mE.name.startsWith('Fensterbau Amsel') && mE.start_url === '/' && mE.icons.some((i) => i.src === '/apple-touch-icon.png') && mS.name.startsWith('Fensterwerk Specht') && !eezi.test(mSr.text) && mS.icons.every((i) => !/apple-touch-icon/.test(i.src)) && /<link rel="manifest" href="\/manifest.webmanifest">/.test(kopfS) && !eezi.test(kopfS), '23.14 Manifest je Instanz (Name, Start, Icons nach Merkmal); Signature-Kopf und -Manifest ohne eeziframes');
};

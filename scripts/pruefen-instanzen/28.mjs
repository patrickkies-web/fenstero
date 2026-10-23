// eeziframes · Prüfabschnitt 28: Signature-Dashboard unter der Domain der Instanz (Strang E, Bauplan §3 E; docs/INSTANZEN.md)
// Teil A (Server, Anfragen mit Kopfzeile Host gegen den Instanz-Testserver von h):
//   28.1 Essential/Plus ohne Dashboard · 28.2 Hülle /betrieb/ · 28.3 Code nur für Zugänge, Mail in der Marke · 28.4 Bestätigen setzt
//   __Host-betrieb, uid gebunden, Fehlversuche · 28.5 Sicht ohne Abrechnung, ?stand=, GET schreibt nie · 28.6 Trennung (Host, Bereich,
//   Fotos, Entzug, Hauptdomain mit Umzug) · 28.7 gesperrte Routen · 28.8 Einladung auf der eigenen Domain · 28.9 Fortschritt und anonyme
//   Website-Zahl · 28.10 Website-Anfrage mit Mail-Link ins Dashboard · 28.11 Herabstufen · 28.12 keine Abrechnung · 28.13 Löschen und
//   Export · 28.14 Status-Matrix (pausiert, einrichtung, beendet) · Erinnerung an offene Einladungen (E.8)
// Teil B (Chromium auf http://<instanz>.localhost:PORT/betrieb/, Telefon und Schreibtisch): 28.15 Anmeldung, jeder Bildschirm und jedes
//   Blatt ohne eeziframes, Abrechnung, Tarif, Zahlungsart, €, Tour, kostenlos; „Als Kunde öffnen“ in der Vorschau ohne Senden; PDF ohne
//   eeziframes; --accent der Instanz; getrennte Sitzungen je Host; Abmelden bei Entzug · 28.16 Altbestand (Betriebsbereich auf der
//   Hauptdomain unverändert; die Abschnitte 1–22 laufen getrennt)
// Eigene Instanzen (dash, dash2, dashx) statt der Standard-Instanzen: Die Abschnitte davor und danach ändern signature.localhost.
import zlib from 'node:zlib';
import { werkzeug } from './23.mjs';

export const titel = 'Signature-Dashboard';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const VERBOTEN = /eeziframes|Abrechnung|Tarif|Zahlungsart|€|Tour|kostenlos/i;

export default async (h) => {
  const { ok } = h, T = werkzeug(h), I = h.instanzen, eezi = /eeziframes/i;
  const kopf = (r, n) => r.headers[n.toLowerCase()] || '';
  const iso = () => new Date().toISOString();
  await h.uhr(null);
  const neu = await h.saat({ instanzen: [
    { slug: 'dash', paket: 'signature', name: 'Fensterbau Kranich', plz: '20095', ort: 'Hamburg', strasse: 'Kranichweg 5', farbe: '#e9b44c', alias: ['dash-alias.localhost'] },
    { slug: 'dash2', paket: 'signature', name: 'Glaserei Reiher', plz: '28195', ort: 'Bremen', strasse: 'Reiherstieg 2', farbe: '#9fd3c7' },
    { slug: 'dashx', paket: 'signature', name: 'Bauelemente Star', plz: '30159', ort: 'Hannover', strasse: 'Starweg 9', farbe: '#c9a0dc' }
  ] });
  const D = neu.dash, D2 = neu.dash2, DX = neu.dashx, HOST = D.host, HOST2 = D2.host, HOSTX = DX.host;
  const TEAM = 'team@dash.example', TEAM2 = 'team@dash2.example';
  /* weitere Zugänge: Mitarbeiterin (für Fehlversuche und Entzug), unbestätigt, gesperrt */
  const zugang = (mail, x) => Object.assign({ mail: mail, uid: null, name: '', rolle: 'team', bestaetigt: iso(), zuletzt: null, aus: false }, x || {});
  await h.instanz('dash', { zugang: [zugang(TEAM, { name: 'Jens Kranich', rolle: 'inhaber' }), zugang('mia@dash.example', { name: 'Mia Kranich' }), zugang('neu@dash.example', { bestaetigt: null }), zugang('weg@dash.example', { aus: true }), zugang('falsch@dash.example'), zugang('alt@dash.example'), zugang('anker@dash.example')] });
  const ip = T.ip;
  const api = (host, pfad, init) => h.api(host, pfad, Object.assign({}, init || {}, { headers: Object.assign(ip(), (init || {}).headers || {}) }));
  const mailsAn = async (an) => (await h.post()).filter((m) => [].concat(m.an).includes(an));
  /* Anmelden: Code anfordern und mit 123456 (Attrappe) bestätigen → Cookie für h.api */
  const anmelden = async (host, mail) => {
    await api(host, '/api/konto/anmelden', { body: { mail: mail }, origin: true });
    const r = await api(host, '/api/konto/bestaetigen', { body: { mail: mail, code: '123456' }, origin: true });
    return { r: r, cookie: (r.cookies.find((c) => c.startsWith('__Host-betrieb=')) || '').split(';')[0] };
  };
  const zeileVon = async (slug) => ((await h.attrappe()).instanzen || []).find((i) => i.slug === slug);
  const betriebVon = async (id) => ((await h.attrappe()).betriebe || []).find((b) => b.id === id);

  /* ---------- 28.1 Essential und Plus ohne Dashboard ---------- */
  for (const p of ['essential', 'plus']) {
    const host = I[p].host, b = await api(host, '/betrieb/'), b0 = await api(host, '/betrieb'), anm = await api(host, '/api/konto/anmelden', { body: { mail: 'x@' + p + '.example' }, origin: true }), k = await api(host, '/api/konto'), ex = await api(host, '/api/konto/export');
    ok(b.status === 404 && b0.status === 404 && !eezi.test(b.text) && /noindex/.test(kopf(b, 'x-robots-tag')) && anm.status === 404 && k.status === 404 && ex.status === 404 && !eezi.test(anm.text + k.text), '28.1 ' + p + ': /betrieb/, /betrieb, /api/konto/anmelden, /api/konto, /api/konto/export → 404 neutral, ohne eeziframes');
  }
  const hb = await api('localhost', '/betrieb/'), hex = await api('localhost', '/api/konto/export'), hlo = await api('localhost', '/api/konto/projekte/x/loeschen', { body: { bestaetigung: 'x' }, origin: true });
  ok(hb.status === 404 && hex.status === 404 && hlo.status === 404, '28.1 Hauptdomain: /betrieb/ ist die Fehlerseite (404), Export und Löschen gibt es dort nicht');

  /* ---------- 28.2 Hülle ---------- */
  const h0 = await api(HOST, '/betrieb'), h1 = await api(HOST, '/betrieb/'), csp = kopf(h1, 'content-security-policy');
  ok(h0.status === 301 && kopf(h0, 'location') === '/betrieb/', '28.2 /betrieb → 301 auf /betrieb/');
  ok(h1.status === 200 && /frame-ancestors 'none'/.test(csp) && /script-src 'self'/.test(csp) && /noindex/.test(kopf(h1, 'x-robots-tag')) && /no-store/.test(kopf(h1, 'cache-control')) && kopf(h1, 'x-frame-options') === 'DENY', '28.2 /betrieb/: 200 mit CSP, noindex, no-store, X-Frame-Options DENY');
  ok(/<title>Fensterbau Kranich · Projekte<\/title>/.test(h1.text) && !eezi.test(h1.text) && !/ld\+json/.test(h1.text) && /data-seite="betrieb"/.test(h1.text) && /\/config\.js\?betrieb=1/.test(h1.text) && /--accent:#/i.test(h1.text) && !/class="vorab"/.test(h1.text), '28.2 Hülle: Titel mit Namen, ohne eeziframes, ohne JSON-LD und Werbetext, Farbe der Instanz, Marke aus /config.js?betrieb=1');
  const ha = await api('dash-alias.localhost', '/betrieb/');
  ok(ha.status === 301 && kopf(ha, 'location') === h.base(HOST) + '/betrieb/', '28.2 Alias-Domain: /betrieb/ → 301 auf den Haupthost (' + kopf(ha, 'location') + ')');

  /* ---------- 28.3 Code anfordern ---------- */
  const vorher3 = (await h.post()).length;
  const fremd = await api(HOST, '/api/konto/anmelden', { body: { mail: 'fremd@beispiel.de' }, origin: true });
  const unb = await api(HOST, '/api/konto/anmelden', { body: { mail: 'neu@dash.example' }, origin: true });
  const aus = await api(HOST, '/api/konto/anmelden', { body: { mail: 'weg@dash.example' }, origin: true });
  const andere = await api(HOST, '/api/konto/anmelden', { body: { mail: TEAM2 }, origin: true });
  await warte(200);
  ok(fremd.status === 200 && fremd.json.ok && unb.status === 200 && aus.status === 200 && andere.status === 200 && JSON.stringify(Object.keys(fremd.json).sort()) === JSON.stringify(Object.keys(unb.json).sort()) && (await h.post()).length === vorher3, '28.3 Fremde, unbestätigte, gesperrte und Zugänge anderer Instanzen: gleiche Antwort, keine Mail');
  const c1 = await api(HOST, '/api/konto/anmelden', { body: { mail: TEAM }, origin: true });
  await warte(200);
  const m3 = await mailsAn(TEAM);
  ok(c1.status === 200 && m3.length === 1 && /Ihr Anmeldecode für Fensterbau Kranich/.test(m3[0].betreff) && /123456/.test(m3[0].html) && !eezi.test(m3[0].html + m3[0].betreff + ((m3[0].von || {}).name || '')) && (m3[0].von || {}).name === 'Fensterbau Kranich · Fensterplaner' && m3[0].html.includes(HOST + '/betrieb/'), '28.3 Zugang: genau eine Mail „Ihr Anmeldecode für <Name>“ mit dem Code, Absender „<Name> · Fensterplaner“, ohne eeziframes');
  const fuenf = [];
  for (let i = 0; i < 6; i++) fuenf.push((await api(HOST, '/api/konto/anmelden', { body: { mail: 'mia@dash.example' }, origin: true })).status);
  ok(fuenf.slice(0, 5).every((s) => s === 200) && fuenf[5] === 429, '28.3 Sechste Anforderung in einer Stunde für dieselbe Adresse: 429 (' + fuenf.join(', ') + ')');

  /* ---------- 28.4 Bestätigen ---------- */
  const falsch = await api(HOST, '/api/konto/bestaetigen', { body: { mail: TEAM, code: '000000' }, origin: true });
  const { r: b4, cookie } = await anmelden(HOST, TEAM);
  const ck4 = b4.cookies.find((c) => c.startsWith('__Host-betrieb=')) || '';
  const z4 = (await zeileVon('dash')).zugang.find((z) => z.mail === TEAM);
  ok(falsch.status === 401 && b4.status === 200 && /HttpOnly/.test(ck4) && /Secure/.test(ck4) && /SameSite=Strict/.test(ck4) && /Path=\//.test(ck4) && !('token' in b4.json) && !('refresh' in b4.json) && !/"token"|"refresh"/.test(b4.text) && b4.json.konto && b4.json.konto.company.name === 'Fensterbau Kranich', '28.4 Code 123456: Cookie __Host-betrieb (HttpOnly, Secure, SameSite=Strict), kein Token in der Antwort; falscher Code 401');
  ok(z4 && z4.uid && z4.zuletzt, '28.4 Zugang gebunden: uid und „zuletzt“ gesetzt');
  /* eine Adresse mit gültigem Code, aber ohne Zugang: Code auf der Hauptdomain angefordert */
  await api('localhost', '/api/konto/anmelden', { body: { mail: 'ohne@beispiel.de' }, origin: true });
  const ohneZ = await api(HOST, '/api/konto/bestaetigen', { body: { mail: 'ohne@beispiel.de', code: '123456' }, origin: true });
  ok(ohneZ.status === 403 && !ohneZ.cookies.length, '28.4 Gültiger Code, aber kein Zugang: 403, kein Cookie');
  await api(HOST, '/api/konto/anmelden', { body: { mail: 'falsch@dash.example' }, origin: true });
  const fehl = [];
  for (let i = 0; i < 11; i++) fehl.push((await api(HOST, '/api/konto/bestaetigen', { body: { mail: 'falsch@dash.example', code: String(100000 + i) }, origin: true })).status);
  const gesperrt = await api(HOST, '/api/konto/bestaetigen', { body: { mail: 'falsch@dash.example', code: '123456' }, origin: true });
  await warte(200);
  const sperrMail = (await mailsAn('falsch@dash.example')).filter((m) => /gesperrt/i.test(m.betreff));
  ok(fehl.slice(0, 10).every((s) => s === 401) && fehl[10] === 429 && gesperrt.status === 429 && gesperrt.json.gesperrt && sperrMail.length === 1 && !eezi.test(sperrMail[0].html), '28.4 Zehn falsche Codes je Adresse: Sperre bis Mitternacht (auch mit richtigem Code), eine Hinweis-Mail ohne eeziframes');

  /* ---------- 28.5 Sicht ---------- */
  const k5 = await api(HOST, '/api/konto', { cookie });
  const acc = (k5.json && k5.json.konto && k5.json.konto.acc) || {}, ai = acc.instanz || {};
  ok(k5.status === 200 && ai.basis === h.base(HOST) + '/' && ai.m && ai.m.dashboard === true && ai.m.einladungslinks === true && ai.m.pdfKennzeichnung === 'keine' && Array.isArray(ai.zugang) && ai.zugang.length && ai.zugang.every((z) => !('uid' in z)) && ai.zugang.some((z) => z.ich && z.mail === TEAM), '28.5 Sicht: acc.instanz mit basis, Merkmalen und Zugängen ohne uid');
  ok(['book', 'rechnungen', 'pay', 'freeUsed', 'freeQuota', 'verwaltung', 'konto', 'plan', 'aboSitzung'].every((f) => !(f in acc)) && k5.json.konto.stripe === null && !eezi.test(k5.text.split(ai.kundenkonto || '§').join('')) && /\/partner\/$/.test(ai.kundenkonto || ''), '28.5 Sicht ohne Abrechnungsfelder (book, rechnungen, pay, freeUsed, Tarif, verwaltung), stripe null; eeziframes nur in der Adresse des Kundenkontos (Vertrag, Rechnungen, Support)');
  const stand = k5.json.konto.stand, v0 = [(await betriebVon(D.betrieb)).version, (await zeileVon('dash')).version];
  const k5b = await api(HOST, '/api/konto?stand=' + encodeURIComponent(stand), { cookie }), k5c = await api(HOST, '/api/konto', { cookie });
  const v1 = [(await betriebVon(D.betrieb)).version, (await zeileVon('dash')).version];
  ok(k5b.status === 200 && k5b.json.gleich === true && !k5b.json.konto && k5c.json.konto && v0.join() === v1.join(), '28.5 ?stand= unverändert → { gleich: true }; zwei Abrufe ändern weder Betriebszeile noch Instanz (Version ' + v0.join('/') + ')');

  /* ---------- 28.6 Trennung ---------- */
  const t1 = await api(HOST2, '/api/konto', { cookie }), t2 = await api('localhost', '/api/partner/nachrichten', { cookie: cookie.replace('__Host-betrieb', '__Host-partner') }), t3 = await api('localhost', '/api/partner/nachrichten', { cookie });
  ok([401, 403].includes(t1.status) && t2.status === 401 && t3.status === 401, '28.6 Sitzung von ' + HOST + ' gilt nicht auf ' + HOST2 + ' (' + t1.status + ') und nicht im Kundenkonto auf der Hauptdomain (401)');
  const umzug = await (async () => { await api('localhost', '/api/konto/anmelden', { body: { mail: TEAM }, origin: true }); return api('localhost', '/api/konto/bestaetigen', { body: { mail: TEAM, code: '123456' }, origin: true }); })();
  ok(umzug.status === 409 && umzug.json.umzug === h.base(HOST) + '/betrieb/', '28.6 Hauptdomain: Anmeldung mit einer Zugangsadresse ohne Betriebskonto → 409 mit Umzug auf ' + (umzug.json && umzug.json.umzug));
  const { cookie: cookieMia } = await (async () => { await warte(10); return anmelden(HOST, 'mia@dash.example').catch(() => ({ cookie: '' })); })();
  const vorEntzug = await api(HOST, '/api/konto', { cookie: cookieMia });
  const zg = (await zeileVon('dash')).zugang.map((z) => (z.mail === 'mia@dash.example' ? Object.assign({}, z, { aus: true }) : z));
  await h.instanz('dash', { zugang: zg });
  const nachEntzug = await api(HOST, '/api/konto', { cookie: cookieMia }), teamNoch = await api(HOST, '/api/konto', { cookie });
  ok(vorEntzug.status === 200 && nachEntzug.status === 403 && nachEntzug.json.abmelden === true && teamNoch.status === 200, '28.6 Zugang „aus“ in der Zentrale: der nächste Aufruf dieser Anmeldung → 403 mit Abmelden, andere Zugänge arbeiten weiter');

  /* ---------- 28.7 Gesperrte Routen ---------- */
  const gesp = [['POST', '/api/konto/registrieren'], ['POST', '/api/konto/sitzung'], ['POST', '/api/konto/erneuern'], ['POST', '/api/konto/plan'], ['GET', '/api/konto/plan/pruefen?session=x'], ['POST', '/api/konto/zahlungsart'], ['GET', '/api/konto/zahlungsart/pruefen?session=x'], ['POST', '/api/konto/import']];
  const gs = [];
  for (const [m, p] of gesp) gs.push((await api(HOST, p, { method: m, cookie, origin: true, body: m === 'POST' ? { code: 'AM1.x', plan: 'abo' } : undefined })).status);
  ok(gs.every((s) => s === 404), '28.7 Registrieren, Anmeldelink, Erneuern, Tarif, Zahlungsart, Code vom Kunden: 404 auf dem Instanz-Host (' + gs.join(', ') + ')');
  const pl = await api(HOST, '/api/konto', { method: 'PATCH', cookie, origin: true, body: { logo: 'data:image/png;base64,AAAA' } });
  const pc = await api(HOST, '/api/konto', { method: 'PATCH', cookie, origin: true, body: { col: '#ff0000' } });
  const pe = await api(HOST, '/api/konto', { method: 'PATCH', cookie, origin: true, body: { einladung: { ansprechpartner: 'Jens Kranich', begruessung: 'Schön, dass Sie da sind.' }, tel: '040 123 456' } });
  const po = await api(HOST, '/api/konto', { method: 'PATCH', cookie, body: { tel: '040 1' } });
  ok(pl.status === 403 && pc.status === 403 && pe.status === 200 && pe.json.konto.acc.tel === '040 123 456' && ((pe.json.konto.acc.einladung || {}).begruessung || '').includes('Schön') && po.status === 403, '28.7 PATCH /api/konto: Logo und Farbe 403 („pflegt Ihr Einrichtungsservice“), Profil 200; ohne eigene Herkunft 403');

  /* ---------- 28.8 Einladung ---------- */
  const n8 = await api(HOST, '/api/konto/projekte', { cookie, origin: true, body: { kunde: 'Familie Weber', kontakt: '0171 2345678', plan: ['Fenster'], du: false, days: 14 } });
  const l8 = n8.json && n8.json.konto.acc.links.find((l) => l.id === n8.json.id);
  const z8 = l8 && await T.zeile(l8.code);
  ok(n8.status === 200 && l8 && /^[a-z0-9]{10}$/.test(l8.code) && l8.host === HOST && /^P-\d{4}-\d{3}$/.test(l8.nr) && z8 && z8.art === 'einladung' && z8.instanz === D.id && z8.status === 'erstellt', '28.8 Neues Projekt: Zeile in anfragen (art einladung) mit zehnstelligem Code, Host ' + HOST + ', Nummer ' + (l8 && l8.nr));
  const g8 = [await api(HOST, '/api/link/' + l8.code), await api(I.plus.host, '/api/link/' + l8.code), await api(HOST2, '/api/link/' + l8.code), await api('localhost', '/api/link/' + l8.code)];
  ok(g8[0].status === 200 && g8[0].json.kunde === 'Familie Weber' && g8[0].json.betrieb === 'Fensterbau Kranich' && g8.slice(1).every((r) => r.status === 404), '28.8 Link gilt nur auf ' + HOST + ' (anderes Paket, andere Instanz, Hauptdomain: 404)');
  const l8b = await api(HOST, '/api/konto/projekte/liste', { cookie, origin: true, body: { text: 'Herr Kaya, kaya@beispiel.de\nFrau Schulze, 0160 9987766', du: false } });
  ok(l8b.status === 200 && l8b.json.n === 2 && l8b.json.konto.acc.links.filter((l) => l.host === HOST).length === 3, '28.8 Liste einladen: zwei Projekte auf einmal');
  const gv = await api(HOST, '/api/konto/projekte/' + l8.id, { method: 'PATCH', cookie, origin: true, body: { gesendet: true, via: 'WhatsApp' } });
  ok(gv.status === 200 && gv.json.konto.acc.links.find((l) => l.id === l8.id).status === 'gesendet', '28.8 Als verschickt markieren: Eingeladen');

  /* ---------- 28.9 Fortschritt und anonyme Website-Zahl ---------- */
  await api(HOST, '/api/link/' + l8.code + '/fortschritt', { body: { stufe: 'geoeffnet' }, origin: true });
  const w9 = [T.fenster(0), T.fenster(1)];
  await T.entwurf(HOST, l8.code, w9);
  await api(HOST, '/api/link/' + l8.code + '/fortschritt', { body: { stufe: 'arbeit', k: 2 }, origin: true });
  const web9 = await T.start(HOST); await T.entwurf(HOST, web9.json.code, [T.fenster(0), T.fenster(1), T.fenster(2)]);
  const k9 = await api(HOST, '/api/konto', { cookie }), a9 = k9.json.konto.acc, l9 = a9.links.find((l) => l.id === l8.id);
  ok(l9.status === 'arbeit' && l9.fortschritt && l9.fortschritt.fenster === 2 && !!l9.fortschritt.zuletzt, '28.9 Fortschritt: In Bearbeitung mit 2 Fenstern und „zuletzt aktiv“');
  ok(a9.website && a9.website.laufend === 1 && a9.website.fenster === 3 && Object.keys(a9.website).sort().join() === 'fenster,laufend,zuletzt' && !a9.links.some((l) => l.code === web9.json.code), '28.9 Website: eine laufende Planung als anonyme Zahl (ohne Code, ohne Namen)');
  const n9 = a9.notif.find((n) => /geöffnet/.test(n.t || ''));
  ok(!!n9 && Array.isArray(n9.to) && n9.to[1] === l8.id, '28.9 Nachricht „hat den Link geöffnet“ im Dashboard');

  /* ---------- 28.10 Website-Anfrage ---------- */
  const a10 = await T.anfrage(HOST, 280, { p: Object.assign(T.kontakt(280), { name: 'Familie Website' }) });
  const m10 = (await T.warteMail((m) => (m.betreff || '').includes('Familie Website'), 10000))[0];
  const k10 = await api(HOST, '/api/konto', { cookie }), l10 = k10.json.konto.acc.links.find((l) => l.code === a10.code);
  ok(a10.r.status === 200 && l10 && l10.status === 'eingegangen' && l10.via === 'Website' && l10.seen !== true && l10.aufmass && l10.aufmass.windows.length === 1, '28.10 Website-Anfrage erscheint als Eingereicht, über die Website, noch nicht gesehen');
  ok(!!m10 && m10.html.includes(h.base(HOST) + '/betrieb/#projekt-' + l10.id) && !eezi.test(m10.html), '28.10 Mail an den Betrieb mit Knopf auf ' + h.base(HOST) + '/betrieb/#projekt-…, ohne eeziframes');
  ok(k10.json.konto.acc.notif.some((n) => /Familie Website/.test((n.t || '') + (n.s || ''))), '28.10 Nachricht zur neuen Anfrage im Dashboard');
  const s10 = await api(HOST, '/api/konto/projekte/' + l10.id, { method: 'PATCH', cookie, origin: true, body: { seen: true } });
  ok(s10.status === 200 && s10.json.konto.acc.links.find((l) => l.id === l10.id).seen === true, '28.10 Gesehen gilt für alle Zugänge (am Projekt gespeichert)');

  /* eingereichte Projekte, die seit 30 Tagen unverändert sind, kommen nur als Kopf; die Projektansicht lädt das Aufmaß nach */
  await h.uhr(31);
  const { cookie: ckAlt } = await anmelden(HOST, 'alt@dash.example');
  const kAlt = await api(HOST, '/api/konto', { cookie: ckAlt }), lAlt = ((kAlt.json && kAlt.json.konto.acc.links) || []).find((l) => l.code === a10.code) || {};
  const pAlt = await api(HOST, '/api/konto/projekte/' + lAlt.id, { cookie: ckAlt }), pFremd = await api(HOST, '/api/konto/projekte/gibtsnicht', { cookie: ckAlt });
  await h.uhr(null);
  ok(kAlt.status === 200 && lAlt.nachladen === true && !lAlt.aufmass && pAlt.status === 200 && pAlt.json.link.aufmass && pAlt.json.link.aufmass.windows.length === 1 && pFremd.status === 404, '28.5 Eingereichte Projekte älter als 30 Tage nur als Kopf; GET /api/konto/projekte/:id lädt das Aufmaß nach (fremd 404)');

  /* ---------- 28.13 Fotos, Löschen und Export ---------- */
  const fid = T.id(), w13 = T.fenster(0, { in: fid, out: T.id() });
  const s13 = await T.start(HOST), c13 = s13.json.code;
  await T.entwurf(HOST, c13, [w13]);
  await api(HOST, '/api/link/' + c13 + '/foto/' + fid, { body: { bild: T.jpeg(13) }, origin: true });
  await api(HOST, '/api/link/' + c13 + '/foto/' + fid + 'k', { body: { bild: T.jpeg(14) }, origin: true });
  await T.senden(HOST, c13, [w13], Object.assign(T.kontakt(281), { name: 'Familie Löschen' }));
  const k13 = await api(HOST, '/api/konto', { cookie }), l13 = k13.json.konto.acc.links.find((l) => l.code === c13);
  const f1 = await api(HOST, '/api/konto/foto/' + c13 + '/' + fid, { cookie }), f2 = await api(HOST, '/api/konto/foto/' + c13 + '/' + fid + 'k', { cookie });
  const { cookie: cookie2 } = await anmelden(HOST2, TEAM2);
  const f3 = await api(HOST2, '/api/konto/foto/' + c13 + '/' + fid, { cookie: cookie2 }), f4 = await api(HOST, '/api/konto/foto/' + c13 + '/' + fid);
  ok(f1.status === 200 && /image\/jpeg/.test(kopf(f1, 'content-type')) && f1.buf[0] === 0xff && f2.status === 200 && f3.status === 404 && f4.status === 401, '28.6 Fotos: im eigenen Dashboard (Original und kleine Fassung), aus einer anderen Instanz 404, ohne Anmeldung 401');
  const lf = await api(HOST, '/api/konto/projekte/' + l13.id + '/loeschen', { cookie, origin: true, body: { bestaetigung: 'P-1999-001' } });
  const ablageVor = (await h.attrappe()).ablage.fotos.filter((p) => p.startsWith('link/' + c13 + '/'));
  const lr = await api(HOST, '/api/konto/projekte/' + l13.id + '/loeschen', { cookie, origin: true, body: { bestaetigung: l13.nr.toLowerCase() } });
  const ab13 = await h.attrappe();
  ok(lf.status === 400 && ablageVor.length === 2 && lr.status === 200 && !lr.json.konto.acc.links.some((l) => l.code === c13) && !(ab13.anfragen || []).some((a) => a.code === c13) && !ab13.ablage.fotos.some((p) => p.startsWith('link/' + c13 + '/')) && !(ab13.entwuerfe || []).some((e) => e.code === c13), '28.13 Anfrage löschen: falsche Nummer 400; mit Nummer Zeile, Fotos und Zwischenstand weg');
  const zen = await h.zentrale(), pr = await zen.api('/api/zentrale/protokoll?art=dashboard_projekt_geloescht');
  const prot = ((pr.json && pr.json.eintraege) || []).find((p) => p.betrieb === D.betrieb);
  ok(!!prot && prot.text.includes(l13.nr) && JSON.stringify(prot).includes(TEAM) && !/Familie Löschen|pruef281|0171/.test(JSON.stringify(prot)), '28.13 Protokoll: Nummer und wer gelöscht hat, ohne Kundendaten');
  const ex = await api(HOST, '/api/konto/export', { cookie }), exJ = ex.json || {};
  ok(ex.status === 200 && /attachment; filename="dashboard-export-dash-/.test(kopf(ex, 'content-disposition')) && Array.isArray(exJ.projekte) && exJ.projekte.some((p) => p.code === a10.code && p.projekt.aufmass) && !/"uid"|"verwaltung"/.test(ex.text) && !/stripe|book/i.test(Object.keys(exJ.betrieb || {}).join()), '28.13 Export: Datei zum Herunterladen mit allen Projekten samt Aufmaß, ohne uid und verwaltung');
  const exH = await api('localhost', '/api/konto/export', { cookie });
  ok(exH.status === 404, '28.13 Export und Löschen gibt es auf der Hauptdomain nicht');

  /* ---------- 28.12 Keine Abrechnung ---------- */
  /* die Einladung l8 einreichen, eine Nachbesserung anfragen und erneut einreichen */
  await T.senden(HOST, l8.code, w9, {});
  const nb = await api(HOST, '/api/konto/projekte/' + l8.id, { method: 'PATCH', cookie, origin: true, body: { nb: { hinweis: 'Bitte die Breite im Bad prüfen.' } } });
  await T.senden(HOST, l8.code, w9.map((w) => Object.assign({}, w, { ts: Date.now() + 5 })), {}, { runde: 2 });
  await warte(300);
  const b12 = await betriebVon(D.betrieb), z12 = await T.zeile(l8.code), lauf = await h.geplant('0 3 1,15 * *');
  const book = (b12.daten || {}).book || [];
  ok(nb.status === 200 && z12 && z12.status === 'eingegangen' && (z12.daten.runde || 1) === 2 && !book.some((x) => Number(x.betrag) > 0) && !(b12.daten || {}).links && !z12.daten.locked && !((b12.daten || {}).konto && b12.daten.konto !== 'instanz') && !b12.stripe_customer && (lauf.rechnungen || 0) === 0, '28.12 Einladung, Eingang und Nachbesserung im Dashboard: keine Buchung über 0 €, nichts gesperrt, der Abrechnungslauf erzeugt nichts');

  /* ---------- 28.14 Status der Instanz ---------- */
  await h.instanz('dash', { status: 'pausiert', pause_bis: new Date(Date.now() + 20 * 864e5).toISOString() });
  const p1 = await api(HOST, '/api/konto', { cookie }), p2 = await api(HOST, '/api/konto/projekte', { cookie, origin: true, body: { kunde: 'Pause' } });
  const p3 = await api(HOST, '/api/konto/projekte/' + l10.id, { method: 'PATCH', cookie, origin: true, body: { klaer: { id: 'p1', ok: true } } });
  const p4 = await api(HOST, '/api/konto/projekte/' + l10.id, { method: 'PATCH', cookie, origin: true, body: { nb: { hinweis: 'x' } } });
  const p5 = await api(HOST, '/api/konto', { method: 'PATCH', cookie, origin: true, body: { tel: '040 9' } }), p6 = await api(HOST, '/betrieb/'), p7 = await api(HOST, '/config.js?betrieb=1'), p8 = await api(HOST, '/config.js');
  ok(p1.status === 200 && p1.json.konto.acc.instanz.status === 'pausiert' && p2.status === 409 && p3.status === 200 && p4.status === 409 && p5.status === 409 && p6.status === 200 && p7.status === 200 && p8.status === 503, '28.14 pausiert: lesen ja, Einladungen 409, Klärungsliste 200, Nachbesserung und Profil 409; Hülle und Marke da, die öffentliche Seite zu (' + [p1.status, p2.status, p3.status, p4.status, p5.status, p6.status, p7.status, p8.status].join(' ') + ')');
  await h.instanz('dash', { status: 'einrichtung', pause_bis: null });
  const { r: e1 } = await anmelden(HOST, TEAM), e2 = await api(HOST, '/api/konto/projekte', { cookie, origin: true, body: { kunde: 'Vorab' } }), e3 = await api(HOST, '/api/konto', { method: 'PATCH', cookie, origin: true, body: { tel: '040 123 456' } });
  ok(e1.status === 200 && e1.json.konto && e2.status === 409 && /Livegang/.test(e2.json.fehler || '') && e3.status === 200, '28.14 einrichtung: Anmeldung und Lesen gehen, Profil ja, Einladungen erst ab dem Livegang (409)');
  await h.instanz('dash', { status: 'beendet', ende_am: iso() });
  const x1 = await api(HOST, '/api/konto', { cookie }), x2 = await api(HOST, '/api/konto/export', { cookie }), x3 = await api(HOST, '/betrieb/'), x4 = await api(HOST, '/api/konto/projekte/' + l10.id, { method: 'PATCH', cookie, origin: true, body: { seen: true } });
  ok(x1.status === 410 && x1.json.beendet === true && x2.status === 200 && x3.status === 200 && x4.status === 410, '28.14 beendet: Dashboard 410, nur noch der Export (200)');
  await h.instanz('dash', { status: 'aktiv', ende_am: null });

  /* ---------- 28.11 Herabstufen Signature → Plus ---------- */
  const n11 = await api(HOSTX, '/api/konto/projekte', { cookie: (await anmelden(HOSTX, 'team@dashx.example')).cookie, origin: true, body: { kunde: 'Familie Offen', kontakt: 'offen@beispiel.de' } });
  const l11 = n11.json.konto.acc.links.find((l) => l.id === n11.json.id);
  await h.instanz('dashx', { paket: 'plus' });
  const { cookie: ckx } = { cookie: '' };
  const d1 = await api(HOSTX, '/api/konto', { cookie: ckx }), d2 = await api(HOSTX, '/betrieb/'), d3 = await api(HOSTX, '/api/konto/anmelden', { body: { mail: 'team@dashx.example' }, origin: true });
  const w11 = [T.fenster(0)];
  await T.entwurf(HOSTX, l11.code, w11);
  const s11 = await T.senden(HOSTX, l11.code, w11, {});
  const m11 = (await T.warteMail((m) => (m.betreff || '').includes('Familie Offen'), 10000, { anhaenge: true }))[0];
  const pdf11 = m11 && (m11.anhaenge || []).find((a) => a.typ === 'application/pdf');
  ok([403, 404].includes(d1.status) && d2.status === 404 && d3.status === 404 && s11.status === 200 && !!pdf11 && !m11.html.includes('/betrieb/#projekt-'), '28.11 Herabstufen auf Plus: Dashboard zu (' + d1.status + ', /betrieb/ 404), die offene Einladung nimmt das Aufmaß noch an, Mail mit PDF ohne Dashboard-Knopf');
  await h.instanz('dashx', { paket: 'signature' });

  /* ---------- Erinnerung an offene Einladungen (E.8) ---------- */
  const offen = await api(HOST, '/api/konto/projekte', { cookie: (await anmelden(HOST, TEAM)).cookie, origin: true, body: { kunde: 'Familie Zögern', kontakt: '0171 9998887' } });
  const lo = offen.json.konto.acc.links.find((l) => l.id === offen.json.id);
  await api(HOST, '/api/konto/projekte/' + lo.id, { method: 'PATCH', cookie, origin: true, body: { gesendet: true, via: 'SMS' } });
  const vorE = (await mailsAn('anfragen@dash.example')).filter((m) => /Erinnerung/.test(m.betreff)).length;
  await h.uhr(4); await h.geplant('17 4 * * *'); await h.geplant('17 4 * * *'); await h.uhr(null);
  const er = (await mailsAn('anfragen@dash.example')).filter((m) => /Erinnerung/.test(m.betreff));
  ok(er.length - vorE === 1 && er[er.length - 1].html.includes('Familie Zögern') && er[er.length - 1].html.includes(h.base(HOST) + '/betrieb/#projekt-' + lo.id) && !eezi.test(er[er.length - 1].html), '28.E8 Erinnerung: offene Einladung nach 3 Tagen einmal an die Eingangsadressen, mit Link ins Dashboard, ohne eeziframes');

  /* =========================== Teil B: im Browser =========================== */
  await browserTeil(h, { HOST, HOST2, website: l10 });
};

/* Text der Seite, der Blätter, des Titels und der Icon-Adressen. o.ohneVorschau: ohne die Vorschau der Einladungsseite im Telefonrahmen
   (#ein-vor): Sie zeigt, was der Kunde sieht („Für Sie kostenlos, ohne Konto“), und wird nur auf eeziframes geprüft */
async function textVon(page, o) {
  return page.evaluate((ohne) => {
    const vor = document.getElementById('ein-vor'), merk = vor ? vor.style.display : '';
    if (ohne && vor) vor.style.display = 'none';
    const t = document.title + '\n' + document.body.innerText + '\n' + Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')).map((l) => l.href).join(' ');
    if (ohne && vor) vor.style.display = merk;
    return t;
  }, !!(o && o.ohneVorschau));
}

async function browserTeil(h, o) {
  const { ok } = h, { HOST, HOST2 } = o, base = h.base(HOST), eezi = /eeziframes/i;
  /* je Browser eine eigene Zugangsadresse (die Code-Anforderung ist je Adresse und Stunde begrenzt) */
  const iso = new Date().toISOString(), MAIL = { telefon: 'telefon@dash.example', desktop: 'buero@dash.example' };
  const zg0 = (await h.attrappe()).instanzen.find((i) => i.slug === 'dash').zugang.filter((z) => !Object.values(MAIL).includes(z.mail));
  await h.instanz('dash', { zugang: zg0.concat(Object.values(MAIL).map((m) => ({ mail: m, uid: null, name: 'Büro', rolle: 'team', bestaetigt: iso, zuletzt: null, aus: false }))) });
  for (const art of ['telefon', 'desktop']) {
    const TEAM = MAIL[art];
    const ctx = await h.browser.newContext(art === 'telefon' ? h.telefon : { viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
    const page = await h.neueSeite(ctx, base);
    const posts = [];
    page.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url())) posts.push(r.method() + ' ' + new URL(r.url()).pathname); });
    await page.goto(base + '/betrieb/', { waitUntil: 'networkidle' });
    await page.waitForSelector('form[data-form="srvlogin"]');
    const t0 = await textVon(page);
    ok(/Fensterbau Kranich/.test(t0) && !VERBOTEN.test(t0) && (await page.title()) === 'Fensterbau Kranich · Projekte', '28.15 ' + art + ': Anmeldung mit dem Namen des Betriebs, ohne eeziframes und ohne Preise');
    await page.fill('#lg-mail', TEAM);
    await page.click('form[data-form="srvlogin"] button[type="submit"]');
    await page.waitForSelector('#lg-code');
    await page.fill('#lg-code', '123456');
    await page.click('form[data-form="srvlogin"] button[type="submit"]');
    await page.waitForSelector('.scr[data-screen="links"]');
    await page.waitForTimeout(600);
    await h.foto(page, '28-dashboard-projekte-' + art);
    const ls = await page.evaluate(() => ({ s: localStorage.getItem('aufmass.sitzung'), p: localStorage.getItem('aufmass.portal.v1') }));
    ok(!ls.s && !/kunde|kontakt|aufmass/i.test(ls.p || ''), '28.15 ' + art + ': nach der Anmeldung kein Token und keine Kundendaten im Browser (nur Codes der Projekte)');
    const seiten = [];
    const pruefe = async (name) => {
      await page.waitForTimeout(150);
      const t = await textVon(page, { ohneVorschau: true }), voll = await textVon(page);
      if (VERBOTEN.test(t)) seiten.push(name + ': „' + (t.match(VERBOTEN) || [''])[0] + '“');
      if (eezi.test(voll)) seiten.push(name + ': eeziframes');
    };
    await pruefe('Projekte');
    for (const f of ['eingeladen', 'bearbeitung', 'eingegangen', 'website', 'alle']) { await page.click('.lfilter [data-v="' + f + '"]'); await pruefe('Filter ' + f); }
    const chips = await page.$$eval('.lfilter .chip', (b) => b.map((x) => x.textContent.trim()));
    ok(chips.some((c) => /^Eingeladen\d+$/.test(c)) && chips.some((c) => /^In Bearbeitung\d+$/.test(c)) && chips.some((c) => /^Eingereicht\d+$/.test(c)) && chips.some((c) => /^Über Website\d+$/.test(c)), '28.15 ' + art + ': Filter Eingeladen, In Bearbeitung, Eingereicht, Über Website (' + chips.join(' · ') + ')');
    const badges = await page.$$eval('.pcard .badge, .pcard .lst', (b) => b.map((x) => x.textContent.trim()).join(' | '));
    ok(/Eingereicht/.test(badges) || /Eingeladen|In Bearbeitung/.test(badges), '28.15 ' + art + ': Statusnamen der Projekte (' + badges.slice(0, 120) + ')');
    /* Projekt in jedem Zustand öffnen, dazu die Blätter */
    const ids = await page.$$eval('.pcard', (b) => b.map((x) => x.getAttribute('data-id')));
    for (const id of ids.slice(0, 6)) {
      await page.evaluate((i) => { window.go('link', i); }, id).catch(async () => { await page.click('.pcard[data-id="' + id + '"]'); });
      await page.waitForSelector('.scr[data-screen="link"]');
      await pruefe('Projekt ' + id);
      await page.evaluate(() => window.go('links')).catch(() => {});
    }
    /* Link-Feld und „Als Kunde öffnen“ */
    const offen = await page.evaluate(() => { const l = (A().links || []).find((x) => ['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(x.status)); return l ? l.id : ''; });
    if (offen) {
      await page.evaluate((i) => window.go('link', i), offen);
      await page.waitForSelector('.scr[data-screen="link"]');
      const href = await page.getAttribute('a[target="_blank"][href*="vorschau=1"]', 'href').catch(() => '');
      const linkU = await page.evaluate(() => linkURL(A().links.find((x) => x.id === S.sel)));
      ok(String(href).startsWith(base + '/?vorschau=1#k-') && linkU.startsWith(base + '/#k-'), '28.15 ' + art + ': Einladungslink beginnt mit ' + base + '/#k-, „Als Kunde öffnen“ mit ' + base + '/?vorschau=1#k-');
      for (const sh of ['deact']) { await page.evaluate((k) => { S.sheet = { k: k, id: S.sel }; render(); }, sh); await pruefe('Blatt ' + sh); await page.evaluate(() => { S.sheet = null; render(); }); }
      if (art === 'desktop' && href) {
        const kunde = await h.neueSeite(ctx, base);
        const kPosts = [];
        kunde.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url())) kPosts.push(new URL(r.url()).pathname); });
        await kunde.goto(href, { waitUntil: 'networkidle' });
        await kunde.waitForTimeout(800);
        const kt = await textVon(kunde);
        ok(new URL(kunde.url()).origin === base && /Vorschau/i.test(kt) && !eezi.test(kt) && kPosts.length === 0, '28.15 Als Kunde öffnen: dieselbe Herkunft, Vorschau ohne eeziframes, schickt nichts an den Server (' + kPosts.join(', ') + ')');
        await kunde.close();
      }
    }
    /* eingereichtes Projekt: Blätter Nachbesserung, Löschen; PDF */
    const ein = await page.evaluate(() => { const l = (A().links || []).find((x) => x.status === 'eingegangen' && x.aufmass); return l ? l.id : ''; });
    if (ein) {
      await page.evaluate((i) => window.go('link', i), ein);
      await page.waitForSelector('.scr[data-screen="link"]');
      await pruefe('Projekt eingereicht');
      for (const sh of ['nachbesserung', 'p-loeschen']) { await page.evaluate((k) => { S.sheet = { k: k, id: S.sel }; render(); }, sh); await pruefe('Blatt ' + sh); await page.evaluate(() => { S.sheet = null; render(); }); }
      if (art === 'desktop') {
        const pdf = await page.evaluate(async () => { const l = A().links.find((x) => x.id === S.sel); const b = await amPDF(l, {}, null); const buf = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]); return btoa(s); }).catch((e) => 'FEHLER ' + e.message);
        const roh = Buffer.from(pdf, 'base64'), lat = roh.toString('latin1');
        let text = lat; const re = /stream\r?\n([\s\S]*?)endstream/g; let mm;
        while ((mm = re.exec(lat))) { try { text += zlib.inflateSync(Buffer.from(mm[1], 'latin1')).toString('latin1'); } catch (e) { /* kein zlib */ } }
        ok(lat.startsWith('%PDF') && !eezi.test(text), '28.15 PDF im Dashboard: %PDF, ohne eeziframes (auch nicht als Autor oder Ersteller)');
      }
    }
    for (const n of ['notif', 'bprofil', 'einladung', 'newlink']) { await page.evaluate((s) => window.go(s), n); await page.waitForSelector('.scr[data-screen="' + n + '"]'); await pruefe('Bildschirm ' + n); }
    await page.evaluate(() => { S.nl.step = 1; render(); }); await pruefe('Neues Projekt, Schritt 2'); await page.evaluate(() => { S.nl = null; window.go('links'); });
    await page.evaluate(() => { S.sheet = { k: 'liste' }; render(); }); await pruefe('Blatt liste'); await page.evaluate(() => { S.sheet = null; render(); });
    ok(!seiten.length, '28.15 ' + art + ': jeder Bildschirm und jedes Blatt ohne eeziframes, Abrechnung, Tarif, Zahlungsart, €, Tour, kostenlos' + (seiten.length ? ' – ' + seiten.join('; ') : ''));
    const akz = await page.evaluate(() => ({ css: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().toLowerCase(), k: String((window.KONFIG.instanz || {}).akzent || '').toLowerCase() }));
    ok(akz.k && akz.css === akz.k, '28.15 ' + art + ': --accent ist die Farbe der Instanz (' + akz.css + ')');
    const breit = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    ok(breit, '28.15 ' + art + ': kein waagrechter Scroll');
    if (art === 'desktop') {
      /* Export über den Knopf unter „Betrieb“: eine JSON-Datei zum Speichern */
      await page.evaluate(() => window.go('bprofil'));
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.click('button[data-act="export"]')]);
      const dlName = dl ? dl.suggestedFilename() : '';
      ok(/^dashboard-export-dash-\d{4}-\d{2}-\d{2}\.json$/.test(dlName), '28.13 Browser: „Alle Daten exportieren“ speichert ' + (dlName || 'nichts'));
      /* getrennte Sitzungen: auf der zweiten Instanz die Anmeldung */
      const p2 = await h.neueSeite(ctx, h.base(HOST2));
      await p2.goto(h.base(HOST2) + '/betrieb/', { waitUntil: 'networkidle' });
      await p2.waitForSelector('form[data-form="srvlogin"]');
      ok(/Glaserei Reiher/.test(await textVon(p2)) && !(await p2.evaluate(() => localStorage.getItem('aufmass.sitzung'))), '28.15 Getrennte Sitzungen: ' + HOST2 + '/betrieb/ zeigt die eigene Anmeldung');
      h.sauber(p2, '28.15 Zweite Instanz: keine Fehler');
      await p2.close();
      /* Entzug: der nächste Abruf meldet ab */
      const zg = (await h.attrappe()).instanzen.find((i) => i.slug === 'dash').zugang;
      await h.instanz('dash', { zugang: zg.map((z) => (z.mail === TEAM ? Object.assign({}, z, { aus: true }) : z)) });
      await page.evaluate(() => window.go('links'));
      await page.evaluate(() => Server.aktualisieren());
      await page.waitForSelector('form[data-form="srvlogin"]', { timeout: 5000 }).catch(() => null);
      const entzug = await textVon(page);
      ok(/keinen Zugang mehr/.test(entzug) && (await page.$('form[data-form="srvlogin"]')) !== null, '28.15 Zugang entzogen: abgemeldet mit Hinweis');
      await h.instanz('dash', { zugang: zg });
      page.probleme = page.probleme.filter((p) => !/HTTP 403: .*\/api\/konto|status of 403/.test(p)); // die erwartete Antwort auf den Entzug
    }
    h.sauber(page, '28.15 ' + art + ': keine Konsolenfehler, keine fremden Anfragen');
    await h.foto(page, '28-dashboard-' + art);
    await ctx.close();
  }
  /* Link „Im Dashboard öffnen“ aus der Mail: erst die Anmeldung, danach direkt das Projekt */
  const ctxA = await h.browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const pa = await h.neueSeite(ctxA, base);
  await pa.goto(base + '/betrieb/#projekt-' + o.website.id, { waitUntil: 'networkidle' });
  await pa.waitForSelector('form[data-form="srvlogin"]');
  await pa.fill('#lg-mail', 'anker@dash.example'); await pa.click('form[data-form="srvlogin"] button[type="submit"]');
  await pa.waitForSelector('#lg-code'); await pa.fill('#lg-code', '123456'); await pa.click('form[data-form="srvlogin"] button[type="submit"]');
  await pa.waitForSelector('.scr[data-screen="link"]', { timeout: 8000 }).catch(() => null);
  const anker = await pa.evaluate(() => ({ s: S.screen, sel: S.sel, h1: (document.querySelector('.top h1') || {}).textContent || '', hash: location.hash }));
  ok(anker.s === 'link' && anker.sel === o.website.id && /Familie Website/.test(anker.h1) && !anker.hash, '28.10 Link aus der Mail (/betrieb/#projekt-…): nach der Anmeldung direkt das Projekt (' + anker.h1 + ')');
  await pa.waitForTimeout(500);
  await h.foto(pa, '28-dashboard-projekt-desktop');
  h.sauber(pa, '28.10 Projekt aus der Mail: keine Fehler');
  await ctxA.close();
  /* 28.16 Altbestand: Betriebsbereich der Hauptdomain unverändert (Links mit /app/, Abrechnung, eeziframes) */
  const ctx = await h.browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const alt = await h.neueSeite(ctx, h.base('localhost'));
  await alt.goto(h.base('localhost') + '/', { waitUntil: 'networkidle' });
  const altInfo = await alt.evaluate(() => ({ inst: typeof INST !== 'undefined' ? INST : 'x', app: APP_URL, nav: navItems().map((n) => n[1]).join(','), wm: !!document.querySelector('.wm') }));
  ok(altInfo.inst === null && /\/app\/$/.test(altInfo.app) && /Abrechnung/.test(altInfo.nav) && altInfo.wm, '28.16 Hauptdomain: Betriebsbereich ohne Instanz-Modus, Links mit /app/, Reiter Abrechnung, Wortmarke eeziframes');
  h.sauber(alt, '28.16 Hauptdomain: keine Fehler');
  await ctx.close();
}

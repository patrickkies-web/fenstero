// eeziframes · automatische Prüfung im Browser (Chromium über Playwright)
//
//   1. Testserver starten:   KI_ATTRAPPE=1 node scripts/dev-server.mjs
//   2. Prüfung starten:      node scripts/pruefen.mjs
//      (braucht das Paket playwright-core; Ort per PW_PFAD=/pfad/zu/node_modules/.. angeben, falls nicht im Repo)
//
// Geprüft wird: alle Seiten laden ohne Fehler, ohne Verstoß gegen die Content-Security-Policy und ohne
// Anfragen an fremde Server; kein alter Name mehr; Pilot-Hinweis; Kundenlink von Portal zu App und zurück;
// ehrlicher Versand mit AM1-Code; Paywall für das Aufmaßblatt (7,99 €, kein Code und keine Datei vor der Zahlung);
// KI mit Einwilligung; ältere ZF1-, FE1- und LM1-Codes bleiben lesbar;
// Logik (Ablauf, doppelte Codes, Sende-Sperre, Einladungsliste), Übersichten und kleine Belohnungen;
// Name und Logo (weißes Fenster auf Schwarz) an den richtigen Stellen.
// Abschnitt 8 startet dazu einen zweiten Testserver mit nachgestellter Datenbank und Kasse (DATEN_ATTRAPPE, ZAHLUNG_ATTRAPPE)
// und prüft den Servermodus: Anmeldung per Code, Registrierung, Aufmaß direkt aus der App, Freikontingent und Sperre,
// Zahlungsart und Abo über die (nachgestellte) Stripe-Rückkehr, Kauf des Aufmaßblatts mit Nachweis. BASE2=… nutzt einen laufenden Server.
// Abschnitt 10 prüft die Auffindbarkeit (docs/SEO.md): jede Seite ohne JavaScript lesbar, ein h1, Titel, Beschreibung, gültige
// strukturierte Daten, Pilotphase per Kopfzeile gesperrt, Freigabe mit INDEXIERUNG=1 auf einem dritten Testserver, Gleichstand
// von Kopfzeilen, Sitemap, Worker-Routen und Preisen.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8788';
const BILDER = process.env.BILDER || '';
const NUR = process.env.NUR ? process.env.NUR.split(',') : null; // z. B. NUR=8 für einen Abschnitt
const teil = (n) => !NUR || NUR.includes(String(n));
if (BILDER) mkdirSync(BILDER, { recursive: true });

let fehlerZahl = 0;
const ok = (bed, text) => { if (bed) console.log('  ✓ ' + text); else { fehlerZahl++; console.log('  ✗ ' + text); } };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

/* Neue Seite mit Wächtern: Konsolenfehler, Skriptfehler, CSP-Verstöße, fremde Anfragen */
async function neueSeite(ctx, base) {
  const page = await ctx.newPage();
  page.probleme = []; page.base = base || BASE;
  page.on('console', (m) => { if (/status of 404/.test(m.text()) && page.url().includes('/gibtsnicht')) return; if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) page.probleme.push('Konsole: ' + m.text()); });
  page.on('pageerror', (e) => page.probleme.push('Skriptfehler: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(page.base) && !u.startsWith('data:') && !u.startsWith('blob:')) page.probleme.push('Fremde Anfrage: ' + u); });
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/gibtsnicht')) page.probleme.push('HTTP ' + r.status() + ': ' + r.url()); });
  return page;
}
const sauber = (page, text) => { ok(page.probleme.length === 0, text + (page.probleme.length ? '\n      ' + page.probleme.join('\n      ') : '')); page.probleme.length = 0; };
const foto = async (page, name) => { if (BILDER) await page.screenshot({ path: BILDER + '/' + name + '.png' }); };
const telefon = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' };
const b64u = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
/* Betriebe für die Prüfung: die früheren Beispielkonten Fensterbau Brandt (c1) und Glaserei Vogt (c7). Die Website hat keine
   Demo-Konten mehr; hier entstehen sie im Browser als eigene Betriebe (myCompanies) und werden angemeldet. */
const betrieb = (page, id) => page.evaluate((id) => {
  const firmen = { c1: { id: 'c1', plan: 'service', name: 'Fensterbau Brandt', plz: '50668', since: 1998, col: '#0071e3' }, c7: { id: 'c7', plan: 'service', name: 'Glaserei Vogt', plz: '50259', since: 1989, col: '#8a5a2b' } };
  const projekte = {
    c1: () => [
      { id: 'l1', code: '7f3a9', nr: 'P-2026-031', kunde: 'Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster', 'Rollläden'], note: 'Rollladen elektrisch gewünscht', created: '10.10.2026', expires: '24.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '10.10., 09:12', gesendet: '10.10., 09:13', geoeffnet: '10.10., 18:40', arbeit: '10.10., 18:41', eingegangen: '10.10., 19:05' }, aufmass: aufmassOf(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' })), stage: 'angebot', memo: 'Angebot bis Freitag', seen: false },
      { id: 'l2', code: 'k2m8q', nr: 'P-2026-032', kunde: 'Herr Kaya', kontakt: 'kaya@beispiel.de', adresse: '51063 Köln-Mülheim', geb: 'etw', fz: '1 bis 2', plan: ['Fenster'], note: 'Wohnzimmer, vor dem Mieterwechsel', created: '12.10.2026', expires: '26.10.2026', status: 'arbeit', progress: 2, via: 'E-Mail', du: false, log: { erstellt: '12.10., 14:02', gesendet: '12.10., 14:03', geoeffnet: 'gestern, 19:20', arbeit: 'gestern, 19:22' } },
      { id: 'l3', code: 'p9x4t', nr: 'P-2026-033', kunde: 'Frau Schulze', kontakt: '0160 998 77 66', adresse: '50939 Köln-Sülz', geb: 'rh', fz: '6 bis 10', plan: ['Fenster', 'Haustür'], note: 'ganzes Haus, Rückruf nach 17 Uhr', created: 'heute', expires: dateIn(14), status: 'gesendet', progress: 0, via: 'SMS', du: false, log: { erstellt: 'heute, 08:30', gesendet: 'heute, 08:31' } }
    ],
    c7: () => [
      { id: 'l4', code: 'v3n7r', nr: 'P-2026-007', kunde: 'Bäckerei Lindner', kontakt: '02238 12 34', adresse: 'Venloer Straße 3, 50259 Pulheim', geb: 'gewerbe', fz: '3 bis 5', plan: ['Fenster', 'Insektenschutz'], note: 'Ladenfront und Backstube', created: '08.10.2026', expires: '22.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '08.10., 10:00', gesendet: '08.10., 10:01', geoeffnet: '08.10., 15:30', arbeit: '08.10., 15:31', eingegangen: '08.10., 16:02' }, aufmass: aufmassOf(demoWins('lindner'), projOf({ gebaeude: 'gewerbe', baujahr: '1965', total: 3, zeit: 'asap', budget: 'b2' })), stage: 'termin', memo: 'Feinaufmaß Dienstag 9 Uhr', seen: true },
      { id: 'l5', code: 'h6c2w', nr: 'P-2026-008', kunde: 'Familie Roth', kontakt: '0172 333 44 55', adresse: '50259 Pulheim', geb: 'dh', fz: '1 bis 2', plan: ['Fenster'], note: 'Kinderzimmer', created: 'gestern', expires: dateIn(13), status: 'geoeffnet', progress: 0, via: 'WhatsApp', du: true, log: { erstellt: 'gestern, 17:45', gesendet: 'gestern, 17:46', geoeffnet: 'heute, 07:58' } }
    ]
  };
  const konten = {
    c1: () => ({ plan: 'service', konto: 'service', pay: { type: 'SEPA-Firmenlastschrift', label: 'DE12 •••• •••• 4521', inhaber: 'Fensterbau Brandt', when: '01.09.2026' }, ap: 'Jens Brandt', mail: 'info@fensterbau-brandt.de', tel: '0221 123456', abzug: { seite: 15, oben: 15 }, prefs: { mail: true, remind: true }, rechnungen: [{ nr: 'RE-2026-0912', datum: '30.09.2026', betrag: 27, pos: 3, status: 'bezahlt' }], links: projekte.c1(), book: null, freeUsed: 0 }),
    c7: () => ({ plan: 'service', konto: 'service', ap: 'Petra Vogt', mail: 'info@glaserei-vogt.de', tel: '02238 4711', abzug: { seite: 10, oben: 10 }, prefs: { mail: true, remind: true }, rechnungen: [], links: projekte.c7(), book: null, freeUsed: 0 })
  };
  const nachrichten = {
    c1: [{ t: 'Herr Kaya misst gerade', s: 'Projekt P-2026-032: 2 von 4 Maßen eingetragen.', when: 'gestern, 19:22', new: true, to: ['link', 'l2'] }, { t: 'Aufmaß eingegangen: Familie Weber', s: '4 Positionen, 5 Elemente, 8 Fotos.', when: '10.10., 19:05', new: false, to: ['link', 'l1'] }],
    c7: [{ t: 'Familie Roth hat den Link geöffnet', s: 'Projekt P-2026-008, noch keine Maße eingetragen.', when: 'heute, 07:58', new: true, to: ['link', 'l5'] }, { t: 'Aufmaß eingegangen: Bäckerei Lindner', s: '3 Positionen mit 6 Fotos.', when: '08.10., 16:02', new: false, to: ['link', 'l4'] }]
  };
  if (!S.myCompanies.some((c) => c.id === id)) S.myCompanies.push(firmen[id]);
  if (!S.acc[id]) { S.acc[id] = konten[id](); S.notif[id] = nachrichten[id]; S.logins[S.acc[id].mail] = { role: 'betrieb', id: id }; }
  login('betrieb', id);
}, id);

/* ---------- 1. Alle Seiten laden ---------- */
if (teil(1)) {
  console.log('1. Seiten laden');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  for (const [pfad, titel] of [['/', 'eeziframes'], ['/app/', 'eeziframes'], ['/impressum/', 'Impressum'], ['/datenschutz/', 'Datenschutz'], ['/gibtsnicht', 'nicht gefunden']]) {
    const r = await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => document.body.innerText);
    ok((pfad === '/gibtsnicht' ? r.status() === 404 : r.status() === 200) && (await page.title()).includes(titel), pfad + ' lädt (' + r.status() + ', „' + (await page.title()) + '“)');
    ok(!/Lichtma|Fenstero|Zamma|Klopfan|Fensterino/i.test(text) && !/claude\.ai/i.test(text), pfad + ': keine alten Namen, kein claude.ai');
    ok(!/EEZI/.test(text) && (pfad === '/gibtsnicht' || await page.locator('.wm').count() > 0), pfad + ': Marke eeziframes klein, auch in Versalzeilen' + (pfad === '/gibtsnicht' ? '' : ', mit Wortmarke'));
    if (pfad !== '/gibtsnicht') ok(await page.locator('svg .fi-fluegel').count() > 0 && await page.locator('svg .fi-kachel').count() > 0, pfad + ': Logo (Fenster auf der Kachel) da');
    ok(!text.includes('wa zamm'), pfad + ': kein Spruch mehr');
    sauber(page, pfad + ': keine Fehler, keine CSP-Verstöße, keine fremden Server');
  }
  const font = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 16px "Maven Pro"'); });
  ok(font, 'Schrift Maven Pro lokal geladen');
  await ctx.close();
}

/* ---------- 2. Portal: Pilot-Hinweis, Rechtslinks, Telefonbreite ---------- */
if (teil(2)) {
  console.log('2. Portal');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok(await page.locator('.fx-pilot').isVisible(), 'Pilot-Hinweis sichtbar');
  await foto(page, 'portal-desktop');
  await page.click('.fx-pilot button.zu');
  await page.reload({ waitUntil: 'networkidle' });
  ok(await page.locator('.fx-pilot').count() === 0, 'Pilot-Hinweis bleibt nach Schließen weg');
  const links = await page.$$eval('footer a', (as) => as.map((a) => a.getAttribute('href')));
  ok(links.includes('/impressum/') && links.includes('/datenschutz/'), 'Fußzeile verlinkt Impressum und Datenschutz');
  ok(await page.evaluate(() => typeof unpack === 'function' && !!unpack('x') === false), 'Portal-Code geladen');
  sauber(page, 'Portal ohne Fehler');
  await ctx.close();

  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' });
  const mp = await neueSeite(mob);
  await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(800);
  ok(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Portal: kein seitliches Scrollen bei 390 px');
  await foto(mp, 'portal-telefon');
  sauber(mp, 'Portal (Telefon) ohne Fehler');
  await mob.close();
}

/* ---------- 3. App: eigener Ablauf bis zum Ergebnis, KI mit Einwilligung ---------- */
if (teil(3)) {
  console.log('3. App: messen und KI');
  const ctx = await browser.newContext({ ...telefon, acceptDownloads: true });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const start = await page.evaluate(() => document.body.innerText);
  ok(/Erstes Fenster ausmessen/.test(start), 'Eigenes Projekt startet leer');
  ok(await page.locator('.foot-links.recht a[href="/impressum/"]').count() === 1, 'App-Start verlinkt Impressum');
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'App: kein seitliches Scrollen bei 390 px');
  await foto(page, 'app-start');

  // Testfoto als JPEG im Browser erzeugen
  const jpeg = Buffer.from(await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const g = c.getContext('2d'); g.fillStyle = '#e9e3da'; g.fillRect(0, 0, 900, 1200); g.fillStyle = '#ffffff'; g.fillRect(220, 200, 460, 760); g.fillStyle = '#a9c8e8'; g.fillRect(250, 230, 190, 700); g.fillRect(460, 230, 190, 700); return c.toDataURL('image/jpeg', 0.9).split(',')[1]; }), 'base64');

  await page.click('[data-act="new"]');
  await page.waitForSelector('.scr[data-screen="start"]');
  ok(await page.locator('.qopt[data-act="situation"]').count() === 2 && await page.locator('.qopt[data-act="art"]').count() === 4 && /Schritt 1 von 6/.test(await page.evaluate(() => document.body.textContent)), 'Start: die Stelle (ersetzen oder neu) und das Element (Fenster, Festverglasung, Hebe-Schiebe-Tür, Faltschiebewand) zur Wahl');
  await page.click('.bb .btn.primary');
  await page.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
  const kiPosts = [], kiUrls = [];
  page.on('response', (r) => { if (r.url().includes('/api/ki?') && r.request().method() === 'POST') { kiPosts.push(r.status()); kiUrls.push(r.url()); } });
  await page.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await page.waitForSelector('.fx-dialog', { timeout: 5000 });
  ok(true, 'Einwilligung wird vor dem Hochladen gefragt');
  ok(kiPosts.length === 0, 'Vor der Einwilligung geht nichts an die KI');
  await foto(page, 'app-einwilligung');
  await page.click('.fx-ja');
  await page.waitForFunction(() => S.ai.in && S.ai.in.status === 'done', null, { timeout: 15000 });
  ok(kiPosts.length === 1 && kiPosts[0] === 200 && /aufgabe=einbau&seite=in/.test(kiUrls[0]), 'Eine KI-Anfrage je Foto, Auftrag Einbausituation: ' + kiPosts.join(', '));
  const ki = await page.evaluate(() => S.win.ki);
  ok(ki && ki.chips.includes('Testantwort') && ki.laib === 160 && ki.pruefen.length > 0, 'KI-Ergebnis im Fenster übernommen: Befund, Laibungstiefe, Prüfpunkte fürs Feinaufmaß');
  ok(ki.rows.some((r) => r[0] === 'Testauftrag' && /einbau, in, claude-sonnet-5-5, ohne Altfenster/.test(r[1])) && !ki.rows.some((r) => /^(Material|Verglasung|Flügel)$/.test(r[0])) && !('material' in ki), 'Server fragt nach der Einbausituation (Sonnet 5.5), nicht nach dem alten Fenster; nichts davon fließt ins neue Fenster');
  await page.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await page.waitForFunction(() => S.ai.out && S.ai.out.status === 'done', null, { timeout: 15000 });
  ok(await page.locator('.fx-dialog').count() === 0 && kiPosts.length === 2 && /aufgabe=einbau&seite=out/.test(kiUrls[1]), 'Zweites Foto ohne erneute Frage ausgewertet');
  const kiApi = await page.evaluate(async () => {
    const bild = '/9j/' + 'A'.repeat(400), post = async (q) => { const r = await fetch('/api/ki?' + q, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: bild }); const j = await r.json().catch(() => null); return { s: r.status, auftrag: j && j.daten ? ((j.daten.rows || []).find((x) => x[0] === 'Testauftrag') || [])[1] || '' : '' }; };
    return { wand: await post('aufgabe=wand&seite=out'), alt: await post('aufgabe=fakten&seite=in'), weg: await post('aufgabe=struktur&seite=in') };
  });
  /* die absichtlich abgelehnte Anfrage („struktur“) ist kein Fehler der Seite */
  for (let i = page.probleme.length - 1; i >= 0; i--) if (/aufgabe=struktur|status of 400/.test(page.probleme[i])) page.probleme.splice(i, 1);
  ok(kiApi.wand.s === 200 && /^wand, out/.test(kiApi.wand.auftrag) && kiApi.alt.s === 200 && /^einbau, in/.test(kiApi.alt.auftrag) && kiApi.weg.s === 400, 'KI-Server: neue Öffnung mit Wand-Auftrag, alter Name „fakten“ gilt als Einbau, „struktur“ gibt es nicht mehr');
  await foto(page, 'app-fotos');

  // vier Maße über die Zifferntasten, dann vier Ränder „wie Mitte“
  await page.click('.bb .btn.primary');
  for (const wert of ['1480', '1410', '1370', '1230']) {
    await page.waitForSelector('.keypad');
    for (const z of wert) await page.click('.keypad button[data-v="' + z + '"]');
    await page.click('.keypad button[data-v="ok"]');
    await page.waitForTimeout(250);
  }
  for (let i = 0; i < 4; i++) { await page.waitForSelector('[data-act="rest-same"]'); await page.click('[data-act="rest-same"]'); await page.waitForTimeout(200); }
  await page.waitForSelector('.bb .btn.primary');
  await page.click('.bb .btn.primary');
  await page.waitForSelector('[data-screen="ergebnis"]');
  const erg = await page.evaluate(() => { const d = derive(S.win); return [d.moW, d.moH, d.elW, d.elH].join('×'); });
  ok(erg === '1370×1480×1230×1410', 'Ergebnis stimmt: ' + erg);
  await foto(page, 'app-ergebnis');
  // Eigenes Aufmaß: speichern, dann die Paywall: Vorschau mit Preis, kein Code und keine Datei vor der Zahlung
  await page.evaluate(() => { saveWin(); S.screen = 'teilen'; render(true); }); await page.waitForTimeout(400);
  let t3 = await page.evaluate(() => document.body.textContent);
  ok(/Dein Aufmaßblatt ist fertig/.test(t3) && /Freischalten · 7,99 €/.test(t3) && /inkl\. MwSt\./.test(t3) && /Messen, Fotos und 3-D-Modell bleiben kostenlos/.test(t3), 'Paywall: Aufmaßblatt für 7,99 € inkl. MwSt., Messen bleibt kostenlos');
  ok(!/AM1\./.test(t3) && !/Code kopieren/.test(t3) && await page.locator('[data-act="k-dl"], [data-act="teil-pdf"]').count() === 0 && await page.locator('.dv-blur').count() === 1 && await page.locator('.dv-tab tr').count() === 2, 'Vor der Zahlung: Vorschau mit Übersicht, Positionen verschwommen, kein Code, keine Datei');
  await foto(page, 'app-paywall');
  await page.evaluate(() => go('home')); await page.waitForTimeout(300);
  ok(/Dein Aufmaßblatt · 7,99 €/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('[data-act="k-dl"]').count() === 0, 'Startseite: Karte mit Preis statt kostenloser Datei');
  await page.evaluate(() => go('teilen')); await page.waitForTimeout(200);
  // Kasse, Schritt 1: E-Mail und Zustimmung sind Pflicht
  await page.click('[data-act="k-start"]'); await page.waitForSelector('#k-mail');
  await page.click('.bb .btn.primary'); await page.waitForTimeout(200);
  ok(await page.locator('.kf.bad').count() === 1 && await page.locator('.kcheck.bad').count() === 1 && await page.evaluate(() => S.screen === 'konto'), 'Ohne E-Mail und Zustimmung geht es nicht zur Zahlung');
  await page.fill('#k-mail', 'kunde@beispiel.de'); await page.click('[data-in="kc"][data-f="agb"]'); await page.click('.bb .btn.primary'); await page.waitForTimeout(300);
  t3 = await page.evaluate(() => document.body.textContent);
  ok(/Schritt 2 von 2/.test(t3) && /Aufmaßblatt als PDF/.test(t3) && /7,99 €/.test(t3) && /darin 19 % MwSt\./.test(t3) && /1,28 €/.test(t3) && /Testkauf abschließen/.test(t3) && /Pilotphase: Testkauf/.test(t3), 'Kasse: 7,99 € mit ausgewiesener MwSt. (1,28 €), im Pilot als Testkauf gekennzeichnet');
  await foto(page, 'app-kasse');
  await page.click('.bb .btn.primary'); await page.waitForTimeout(200);
  ok(await page.locator('.kerr').count() === 2 && await page.evaluate(() => !(S.kauf && S.kauf.paid) && S.screen === 'kasse'), 'Ohne Zahlungsart und Widerrufs-Zustimmung kein Kauf');
  await page.click('[data-act="k-pay"][data-v="PayPal"]'); await page.click('[data-in="kc"][data-f="widerruf"]');
  await page.click('.bb .btn.primary'); await page.waitForSelector('[data-screen="gekauft"]'); await page.waitForTimeout(400);
  ok(/Freigeschaltet\./.test(await page.evaluate(() => document.body.textContent)) && await page.evaluate(() => S.kauf.paid === true && S.kauf.test === true && !S.kauf.token) && await page.evaluate(() => { const e = document.querySelector('.okmark-l[data-lottie="fertig"]'); return !!(e && e._lottie && e.querySelector('svg') && e._lottie.currentFrame > 0); }), 'Testkauf: freigeschaltet, der Haken zeichnet sich (Lottie), als Test gekennzeichnet, ohne Nachweis');
  await foto(page, 'app-gekauft');
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  ok(await page.evaluate(() => FREI() && !!document.querySelector('.datei-card.bought [data-act="k-dl"]')), 'Freischaltung bleibt nach dem Neuladen, Startseite zeigt die Datei');
  await page.evaluate(() => go('teilen')); await page.waitForTimeout(400);
  t3 = await page.evaluate(() => document.body.textContent);
  ok(/Dein Aufmaß, dein Blatt/.test(t3) && /An deinen Fensterbauer/.test(t3) && !/Portal/.test(t3) && /Freigeschaltet, für dieses Projekt/.test(t3) && /Rechnung ist an kunde@beispiel\.de unterwegs/.test(t3) && await page.locator('#code-box').count() === 1, 'Nach dem Kauf: Weg zum Fensterbauer, eigene PDF, Aufmaß-Code und Rechnungshinweis');
  const wa3 = await page.getAttribute('.share-way a[href^="https://wa.me/"]', 'href');
  ok(/Code vom Kunden einfügen/.test(decodeURIComponent(wa3)) && /Kostenlos anmelden/.test(decodeURIComponent(wa3)) && /AM1\./.test(decodeURIComponent(wa3)), 'Nachricht an den Fensterbauer enthält Code und Einladung zu eeziframes');
  // Weg 1: PDF schicken (ohne Teilen-Menü im Testbrowser: Download) → erledigt, nächster Schritt wird angestoßen
  const [dl3] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('[data-act="teil-pdf"]')]);
  await page.waitForTimeout(500);
  ok(/\.pdf$/.test(dl3.suggestedFilename()) && await page.evaluate(() => S.teil && S.teil.betrieb > 0) && /Unterwegs zu deinem Fensterbauer/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('.share-way.done').count() === 1, 'PDF an den Fensterbauer: Weg 1 erledigt, nächster Schritt angestoßen');
  const fs = await import('node:fs'), cp = await import('node:child_process');
  const pdfText = (pfad) => { try { return cp.execFileSync('pdftotext', ['-layout', pfad, '-']).toString('utf8'); } catch (e) { return ''; } };
  const dl3Pfad = await dl3.path(), pdfBytes = fs.readFileSync(dl3Pfad);
  ok(pdfBytes.subarray(0, 5).toString() === '%PDF-', 'Datei ist ein echtes PDF');
  const roh3 = pdfBytes.toString('latin1'), txt3 = pdfText(await dl3.path());
  ok(/MavenBlack/.test(roh3) && /MavenMedium/.test(roh3), 'PDF trägt die eingebettete Marken-Schrift');
  ok(/Code vom Kunden/.test(txt3) && /Scannen: Anmeldung/.test(txt3) && roh3.includes('/URI (' + BASE + '/?von=pdf)') && /AM1\./.test(txt3) && /Aufmaß digital übernehmen/.test(txt3), 'PDF an den Fensterbauer: Anleitung mit QR-Link und Aufmaß-Code');
  /* Aufbau nach Leserichtung: Seite 1 mit Weg, Box für den Fensterbauer und Position 1; Seite 2 unten eeziframes für eigene Kunden; Kennung auf jeder Seite */
  const seiteTxt = (n) => { try { return cp.execFileSync('pdftotext', ['-layout', '-f', String(n), '-l', String(n), dl3Pfad, '-']).toString('utf8'); } catch (e) { return ''; } };
  const s1 = seiteTxt(1), s2 = seiteTxt(2), info3 = (() => { try { return cp.execFileSync('pdfinfo', [dl3Pfad]).toString('utf8'); } catch (e) { return ''; } })();
  const kenn = (/AM-[A-Z2-9]{6}/.exec(s1) || [''])[0], nSeiten = +((/Pages:\s+(\d+)/.exec(info3) || [0, 0])[1]);
  ok(/4 von 5 Schritten erledigt/i.test(s1) && /Ihr Schritt: Angebot/.test(s1) && /FÜR SIE ALS FENSTERBAUER/.test(s1) && /MAUERÖFFNUNG/.test(s1) && /Alle Maße in mm/.test(s1), 'Aufmaßblatt Seite 1: der Weg (4 von 5 erledigt), Box für den Fensterbauer, Position 1 beginnt schon hier');
  ok(/AUFMASSE IHRER EIGENEN KUNDEN/.test(s2) && /Ihre Kunden messen selbst/.test(s2) && /Scannen: Projekt anlegen/.test(s2) && /3 Projekte kostenlos/.test(s2), 'Aufmaßblatt Seite 2 unten: eeziframes für die eigenen Kunden des Fensterbauers');
  ok(!!kenn && nSeiten >= 3 && seiteTxt(nSeiten).includes(kenn) && seiteTxt(2).includes(kenn) && /Seite 1 von/.test(s1) && /Title:\s+Aufmaßblatt/.test(info3), 'Kennung ' + kenn + ', Datum und „Seite x von y“ auf jeder Seite, Dokumenttitel gesetzt');
  const seite3 = (() => { try { return cp.execFileSync('pdftotext', ['-f', '3', '-l', '3', dl3Pfad, '-']).toString('utf8'); } catch (e) { return ''; } })();
  ok(/Für Fensterbauer: Aufmaß per Code/.test(seite3) && /eeziframes/.test(seite3) && !/EEZI/.test(txt3), 'Senkrechter Markenstreifen steht auch auf einer Positionsseite; Marke im PDF überall klein');
  ok(/IHRES KUNDEN/.test(txt3) && /FÜR SIE ALS FENSTERBAUER/.test(txt3) && /Maueröffnung/.test(txt3) && !/Übersicht/.test(txt3), 'Ausgabe für den Fensterbauer: Sie-Ansprache, Position mit Maßen; bei einer Position keine doppelte Übersicht');
  const m3 = /AM1\.[A-Za-z0-9_\-\s]+/.exec(txt3), code3 = m3 ? m3[0].replace(/\s+/g, '') : '';
  const dekod3 = await page.evaluate((c) => { const o = unpackProject(c); return o ? o.w.length : 0; }, code3);
  ok(dekod3 === 1, 'Aufmaß-Code aus dem PDF-Text ist wieder lesbar (' + code3.length + ' Zeichen)');
  const [dl4] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('.share-way [data-act="k-dl"]')]);
  ok(/\.pdf$/.test(dl4.suggestedFilename()), 'Eigen-Kunde lädt seine freigeschaltete PDF: ' + dl4.suggestedFilename());
  const txt4 = pdfText(await dl4.path());
  ok(/DEIN FENSTER-AUFMASS/.test(txt4) && /DEIN WEG ZU NEUEN FENSTERN/.test(txt4) && /FÜR DEINEN FENSTERBAUER/.test(txt4) && /Jetzt senden/.test(txt4), 'Ausgabe für den Kunden: Du-Ansprache, der nächste Schritt ist das Senden');
  await foto(page, 'app-zwei-wege');
  sauber(page, 'Messablauf ohne Fehler');

  // Ablehnen: neue Sitzung fragt erneut, „Ohne KI“ schickt nichts
  const ctx2 = await browser.newContext(telefon);
  const p2 = await neueSeite(ctx2);
  await p2.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  const posts2 = [];
  p2.on('request', (r) => { if (r.url().includes('/api/ki?')) posts2.push(r.url()); });
  await p2.click('[data-act="new"]'); await p2.waitForSelector('.scr[data-screen="start"]'); await p2.click('.bb .btn.primary');
  await p2.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await p2.waitForSelector('.fx-dialog');
  await p2.click('.fx-nein');
  await p2.waitForFunction(() => S.ai.in && S.ai.in.status === 'error', null, { timeout: 5000 });
  ok(posts2.length === 0, 'Ohne Einwilligung keine Übertragung');
  ok(/ohne KI/.test(await p2.evaluate(() => document.body.innerText)), 'Foto zeigt „ohne KI“');
  sauber(p2, 'Ablehnen ohne Fehler');
  await ctx2.close();
  await ctx.close();
}

/* ---------- 4. Kundenlink: Portal → App → Code → Portal ---------- */
if (teil(4)) {
  console.log('4. Kundenlink von Anfang bis Ende');
  const ctx = await browser.newContext({ ...telefon, acceptDownloads: true });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // Anmelden als Betrieb (Prüfkonto, siehe betrieb())
  await betrieb(page, 'c1');
  await page.waitForTimeout(400);
  const link = await page.evaluate(() => { const l = A().links.find((x) => x.status !== 'eingegangen' && x.status !== 'abgelaufen'); return l ? { url: linkURL(l), code: l.code, kunde: l.kunde, betrieb: BC().name } : null; });
  ok(!!link && link.url.startsWith(BASE + '/app/#k-'), 'Portal erzeugt Kundenlink auf die eigene Domain: ' + (link && link.url.slice(0, 60)) + '…');
  sauber(page, 'Portal-Login ohne Fehler');

  await page.goto(link.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  let text = await page.evaluate(() => document.body.innerText);
  ok(text.includes('Persönliche Anfrage von') && text.includes(link.betrieb), 'App zeigt „Persönliche Anfrage von ' + link.betrieb + '“');
  // zwei fertige Fenster in den Link legen (wie nach dem Messen)
  await page.evaluate((code) => { localStorage.setItem('aufmass.k.' + code, JSON.stringify({ windows: demoProject(), proj: {}, name: '' })); }, link.code);
  await page.reload({ waitUntil: 'networkidle' });
  await page.click('.bb .btn.primary'); // Weiter zum Absenden
  await page.waitForSelector('[data-screen="anfrage"]');
  await page.click('.bb .btn.primary');
  await page.waitForSelector('[data-screen="anfrage2"]');
  await page.click('.bb .btn.primary'); // Prüfen und senden
  await page.waitForSelector('[data-screen="blatt"]');
  text = await page.evaluate(() => document.body.innerText);
  ok(text.includes('mit allen Maßen und Wünschen') && !text.includes('Fotos und Wünschen'), 'Prüfen-Seite verspricht keine Fotos');
  await page.click('.bb .btn.primary'); // An … senden
  await page.waitForSelector('[data-screen="gesendet"]');
  text = await page.evaluate(() => document.body.innerText);
  ok(text.includes('Jetzt abschicken.') && !text.includes('Gesendet.'), 'Pilot: „Jetzt abschicken“ statt „Gesendet“');
  const code = await page.inputValue('#code-box');
  ok(code.startsWith('AM1.'), 'Aufmaß-Code beginnt mit AM1.');
  const wa = await page.getAttribute('a[href^="https://wa.me/"]', 'href');
  ok(decodeURIComponent(wa).includes(code) && decodeURIComponent(wa).includes('Code vom Kunden einfügen'), 'WhatsApp-Nachricht enthält Code und Anleitung');
  await foto(page, 'app-senden');

  // Link-Kunde: keine Kopie mit Maßen, die gibt der Betrieb weiter (Zusage „Ihr Kunde bleibt Ihr Kunde“)
  ok(await page.locator('.datei-card [data-act="k-dl"]').count() === 0 && /Frag Fensterbau Brandt/.test(text), 'Link-Kunde bekommt keine PDF, sondern den Hinweis auf seinen Betrieb');

  await page.click('.bb .btn.primary'); // Fertig
  await page.waitForTimeout(300);
  text = await page.evaluate(() => document.body.innerText);
  ok(text.includes('Fast erledigt.') && text.includes('Code senden'), 'Startseite erinnert ans Code-Senden');
  const ls = await page.evaluate(() => JSON.stringify(Object.assign({}, localStorage)));
  ok(!/"pw":"[^"]+"/.test(ls), 'Kein Passwort im Browser-Speicher');
  sauber(page, 'Kundenablauf ohne Fehler');

  // zurück ins Portal, Code einfügen
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-act', 'sheet'); b.setAttribute('data-v', 'linkimport'); document.getElementById('app').appendChild(b); b.click(); });
  await page.waitForSelector('#code-in');
  await page.fill('#code-in', code);
  await page.click('[data-act="linkimport"]');
  await page.waitForTimeout(500);
  const ein = await page.evaluate((c) => { const l = A().links.find((x) => x.code === c); return l ? l.status : null; }, link.code);
  ok(ein === 'eingegangen', 'Portal: Aufmaß beim richtigen Projekt eingegangen (' + ein + ')');
  ok(await page.evaluate((c) => ['ZF1.', 'FE1.', 'LM1.'].every((alt) => !!unpack(c.replace(/^AM1\./, alt))), code), 'Ältere ZF1-, FE1- und LM1-Codes bleiben lesbar');
  await foto(page, 'portal-eingang');
  sauber(page, 'Code-Eingang ohne Fehler');

  // PDF im Portal
  const pdfKnopf = page.locator('[data-act="pdf-am"]').first();
  if (await pdfKnopf.count()) {
    const [d2] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), pdfKnopf.click()]);
    ok(/\.pdf$/.test(d2.suggestedFilename()), 'Portal-PDF: ' + d2.suggestedFilename());
    let txtB = ''; try { txtB = (await import('node:child_process')).execFileSync('pdftotext', ['-layout', await d2.path(), '-']).toString('utf8'); } catch (e) { txtB = ''; }
    ok(/BESTELLMASS-VORSCHLAG/.test(txtB) && /Fensterbau Brandt/.test(txtB) && /Übersicht/.test(txtB) && !/eeziframes-Konto\./.test(txtB), 'Portal-PDF in den Farben des Betriebs: Bestellmaß, keine Werbeseite');
  } else ok(false, 'Portal-PDF-Knopf gefunden');
  sauber(page, 'Portal-PDF ohne Fehler');
  await ctx.close();
}

/* ---------- 5. Rechtsseiten ---------- */
if (teil(5)) {
  console.log('5. Rechtsseiten');
  const ctx = await browser.newContext(telefon);
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/datenschutz/', { waitUntil: 'networkidle' });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Datenschutz: kein seitliches Scrollen');
  await foto(page, 'datenschutz');
  await page.goto(BASE + '/impressum/', { waitUntil: 'networkidle' });
  await foto(page, 'impressum');
  sauber(page, 'Rechtsseiten ohne Fehler');
  await ctx.close();
}

/* ---------- 6. Logik, Übersichten und kleine Belohnungen ---------- */
if (teil(6)) {
  console.log('6. Logik, Übersichten und Belohnungen');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const tun = (act, v, id, c) => page.evaluate(([act, v, id, c]) => { const b = document.createElement('button'); b.setAttribute('data-act', act); if (v) b.setAttribute('data-v', v); if (id) b.setAttribute('data-id', id); if (c) b.setAttribute('data-c', c); document.getElementById('app').appendChild(b); b.click(); }, [act, v || '', id || '', c || '']);
  const toastText = () => page.evaluate(() => { const t = document.getElementById('toast'); return t ? t.textContent : ''; });
  await betrieb(page, 'c1'); await page.waitForTimeout(500);

  // Übersicht Projekte: Kacheln mit Farbton und Symbol, Karten mit Schrittpunkten, Fensterstapel und Ring
  ok(await page.locator('.stat.tone-warn .stat-ic svg').count() === 1 && await page.locator('.stat.tone-ok').count() === 1, 'Projekte: Kennzahlen mit Farbe und Symbol');
  const nProj = await page.evaluate(() => A().links.length);
  ok(await page.locator('.pcard .pstep').count() === nProj, 'Jedes Projekt zeigt seine vier Schrittpunkte');
  ok(await page.locator('.pcard.st-eingegangen .winstack svg').count() >= 1 && await page.locator('.pcard.st-arbeit .pring').count() === 1, 'Eingegangenes Aufmaß als Fensterstapel, laufendes als Ring');
  await foto(page, 'portal-projekte');

  // Neues Projekt anlegen: Karte „Projekt angelegt“ mit Ring um das Neue
  await page.evaluate(() => { S.nl = { step: 1, kunde: 'Familie Testmann', kontakt: '0171 000 00 00', adresse: 'Teststraße 1, 50667 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster'], note: '', days: 14, du: false, err: {} }; });
  await tun('nl-create'); await page.waitForTimeout(500);
  ok(await page.locator('.created').count() === 1 && await page.locator('.created.fx-mark').count() === 1, 'Projekt angelegt: Bestätigung, Ring um die neue Karte');
  await foto(page, 'portal-projekt-neu');
  await page.waitForTimeout(1400);
  ok(await page.locator('.fx-mark').count() === 0, 'Markierung räumt sich selbst auf');

  // Link verschickt → Puls am Status; Enter im Formular springt nicht über Schritt 2
  await tun('l-share', 'Text', await page.evaluate(() => A().links[0].id)); await page.waitForTimeout(700);
  ok(await page.evaluate(() => A().links[0].status === 'gesendet'), 'Erstes Teilen setzt den Status auf „Link gesendet“');
  await tun('go', 'newlink'); await page.waitForTimeout(300);
  await page.fill('#nl-kunde', 'Herr Enter'); await page.press('#nl-kunde', 'Enter'); await page.waitForTimeout(300);
  ok(await page.locator('#nl-adresse').count() === 1 && await page.evaluate(() => !A().links.some((l) => l.kunde === 'Herr Enter')), 'Enter im ersten Schritt führt zu Schritt 2, legt noch nichts an');
  await page.press('#nl-adresse', 'Enter'); await page.waitForTimeout(400);
  ok(await page.evaluate(() => A().links.some((l) => l.kunde === 'Herr Enter')), 'Enter im zweiten Schritt legt das Projekt an');

  // Links laufen ab
  await page.evaluate(() => { const l = A().links.find((x) => x.status === 'gesendet' || x.status === 'geoeffnet'); l.expires = '01.01.2020'; tick(); });
  ok(await page.evaluate(() => A().links.some((l) => l.status === 'abgelaufen')), 'Abgelaufener Link wird als abgelaufen geführt');
  // Zweiter Code-Import desselben Aufmaßes wird erkannt
  const dup = await page.evaluate(() => { const l = A().links.find((x) => x.status === 'eingegangen' && x.aufmass); const vorher = A().links.length; const o = { v: 1, b: l.code, w: l.aufmass.windows, p: l.aufmass.proj }; const code = 'AM1.' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); return { code, vorher }; });
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', dup.code); await tun('linkimport'); await page.waitForTimeout(400);
  const nachher = await page.evaluate(() => A().links.length);
  ok(nachher === dup.vorher && /schon|bereits|gleich/i.test(await toastText()), 'Derselbe Aufmaß-Code wird nicht doppelt angelegt');
  await page.evaluate(() => { S.sheet = null; render(); });

  // Einladungsliste: mehrere Projekte auf einmal
  const vorListe = await page.evaluate(() => A().links.length);
  await tun('sheet', 'liste'); await page.waitForSelector('#liste-in');
  await page.fill('#liste-in', 'Familie Listig, 0171 111 22 33\nHerr Mailer; mailer@beispiel.de\nx\nFrau Ohne');
  await tun('liste-create'); await page.waitForTimeout(600);
  const nachListe = await page.evaluate(() => ({ n: A().links.length, neu: A().links.slice(0, 3).map((l) => [l.kunde, l.kontakt, l.status]) }));
  ok(nachListe.n === vorListe + 3 && nachListe.neu.some((x) => x[0] === 'Familie Listig' && x[1] === '0171 111 22 33') && nachListe.neu.some((x) => x[0] === 'Herr Mailer' && x[1] === 'mailer@beispiel.de') && nachListe.neu.every((x) => x[2] === 'erstellt'), 'Einladungsliste legt je Zeile ein Projekt an, ungültige Zeilen werden übersprungen');
  ok(/3 Projekte angelegt/.test(await toastText()) && await page.locator('.pcard').count() >= 3 , 'Liste angelegt: Hinweis, Projekte stehen in der Liste');
  await foto(page, 'portal-liste');

  // Code vom Kunden ohne Projekt (Eigen-Kunde): neues Projekt, zählt wie jedes andere
  const eigenCode = await page.evaluate(() => { const w = [{ name: 'Küche', w: 1230, h: 1410, el: { w: 1230, h: 1410 }, mo: { hm: 1440, hl: 1440, hr: 1440, wm: 1260, wt: 1260, wb: 1260 }, fotos: 2 }]; const o = { v: 1, b: '', w: w, p: { ort: '50823 Köln', gebaeude: 'efh', budget: 'b2', zeit: '3m', name: 'Lisa Berger', tel: '0221 444 55 66' }, t: Date.now() }; return 'AM1.' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); });
  const vorEigen = await page.evaluate(() => ({ n: A().links.length, book: ledger(A()).filter((b) => b.kind === 'aufmass').length }));
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', eigenCode); await tun('linkimport'); await page.waitForTimeout(500);
  const nachEigen = await page.evaluate(() => ({ n: A().links.length, book: ledger(A()).filter((b) => b.kind === 'aufmass').length, l: A().links.find((x) => x.kunde === 'Lisa Berger') }));
  ok(nachEigen.n === vorEigen.n + 1 && nachEigen.l && nachEigen.l.status === 'eingegangen' && nachEigen.l.kontakt === '0221 444 55 66' && nachEigen.book === vorEigen.book + 1, 'Code eines Eigen-Kunden wird zum Projekt und gebucht');
  ok(await page.evaluate((c) => { const gebrochen = c.replace(/(.{60})/g, '$1\n   '); const o = unpack(gebrochen); return !!o && o.w.length === 1; }, eigenCode), 'Code mit Zeilenumbrüchen (aus der PDF kopiert) bleibt lesbar');
  await tun('logout'); await page.waitForTimeout(300);
  await page.goto(BASE + '/?von=pdf', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  ok(await page.locator('.banner.vonpdf [data-act="reg"]').count() === 1 && /eeziframes-Aufmaß in der Hand/.test(await page.evaluate(() => document.body.textContent)), 'Wer über die PDF kommt, sieht den Weg zum Konto');
  await betrieb(page, 'c7'); await page.waitForTimeout(500);
  ok(await page.locator('.banner.vonpdf [data-v="linkimport"]').count() === 1, 'Angemeldeter Betrieb bekommt direkt „Code vom Kunden einfügen“');
  await tun('vonpdf-zu'); await page.waitForTimeout(200);
  ok(await page.locator('.banner.vonpdf').count() === 0, 'Hinweis lässt sich schließen');
  // Startseite: beide Zielgruppen, kein Marktplatz
  await tun('logout'); await page.waitForTimeout(300);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  const start = await page.evaluate(() => document.body.textContent);
  ok(/Fenster ausmessen\. Selbst\. eezi\./.test(start) && /Aufmaß ohne Anfahrt/.test(start) && await page.locator('.hero.b2c a[href$="/app/"]').count() === 1 && await page.locator('.hero.b2c a[href$="/app/#fuehrung"]').count() === 1, 'Startseite: Hauseigentümer zuerst (aufmessen oder Führung), Fensterbauer darunter');
  ok(!/anklopf|Anklopf|Marktplatz|Portal-Zusatz|Vergleichsangebot/.test(start), 'Kein Marktplatz mehr auf der Startseite');
  await foto(page, 'portal-start');
  sauber(page, 'Logik und Übersichten ohne Fehler');
  await ctx.close();

  // App: Sende-Sperre ohne vollständiges Fenster, Feier bei „Alle Maße da“, Code bleibt nach dem Senden gleich
  const ctx2 = await browser.newContext(telefon);
  const p2 = await neueSeite(ctx2);
  await p2.goto(BASE + '/app/#k-pruef1-Test_Betrieb.VGVzdCBCZXRyaWVi', { waitUntil: 'networkidle' });
  await p2.evaluate(() => { const w = demoProject(); const halb = Object.assign({}, w[0], { name: 'Halb gemessen', w: '', h: '', el: { h: '', w: '' }, mo: { hm: 1200, wm: 1000, hl: '', hr: '', wt: '', wb: '' } }); localStorage.setItem('aufmass.k.pruef1', JSON.stringify({ windows: [halb], proj: {}, name: 'Test Betrieb' })); });
  await p2.reload({ waitUntil: 'networkidle' });
  await p2.evaluate(() => { S.screen = 'blatt'; render(true); }); await p2.waitForTimeout(300);
  ok(await p2.locator('.bb .btn.primary[disabled]').count() === 1 && /kein Fenster ist vollständig/.test(await p2.evaluate(() => document.body.innerText)), 'Senden gesperrt, solange kein Fenster vollständig ist');
  await foto(p2, 'app-senden-gesperrt');
  await p2.evaluate(() => { S.windows.push(Object.assign({}, demoProject()[1], { name: 'Komplett' })); persist(); render(true); }); await p2.waitForTimeout(300);
  ok(await p2.locator('.bb .btn.primary[disabled]').count() === 0 && /trotzdem senden/.test(await p2.evaluate(() => document.body.innerText)), 'Mit einem vollständigen Fenster geht Senden, Lücke wird genannt');
  await p2.click('.bb .btn.primary'); await p2.waitForSelector('[data-screen="gesendet"]'); await p2.waitForTimeout(400);
  const code1 = await p2.inputValue('#code-box');
  ok(await p2.evaluate(() => { const e = document.querySelector('.okmark-l[data-lottie="senden"]'); return !!(e && e._lottie && e.querySelector('svg') && e._lottie.currentFrame > 0); }), 'Abschicken: der Flieger fliegt (Lottie)');
  await p2.evaluate(() => { S.windows[0].name = 'Nachträglich geändert'; S.proj.notiz = 'anders'; render(true); }); await p2.waitForTimeout(200);
  ok(await p2.inputValue('#code-box') === code1, 'Der Aufmaß-Code bleibt nach dem Senden eingefroren');
  // Scroll-Reveal: Blöcke tragen .rev und sind sichtbar
  ok(await p2.evaluate(() => { const k = document.querySelectorAll('.scr > .rev'); return k.length >= 3 && Array.from(k).slice(0, 2).every((e) => e.classList.contains('in')); }), 'Blöcke erscheinen nacheinander (Scroll-Reveal aktiv)');
  // Alle Maße da: die Maßlinien zeichnen sich nacheinander
  await p2.evaluate(() => { S.betrieb = null; });
  await p2.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await p2.click('[data-act="new"]'); await p2.waitForTimeout(200);
  await p2.evaluate(() => { S.win.mo = { hm: 1480, wm: 1370, hl: '', hr: '', wt: '', wb: '' }; go('rest'); });
  for (let i = 0; i < 4; i++) { await p2.waitForSelector('[data-act="rest-same"]'); await p2.click('[data-act="rest-same"]'); await p2.waitForTimeout(150); }
  await p2.waitForTimeout(400);
  ok(/Alle Maße da/.test(await p2.evaluate(() => document.body.textContent)) && await p2.locator('.w3d-dim.is-drawing').count() >= 2, '„Alle Maße da“: Maßlinien zeichnen sich nacheinander');
  await foto(p2, 'app-masse-da');
  // Bewegtbilder (Lottie) in Tokenfarben, Haptik, Scroll-Bindung
  await p2.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  ok(await p2.evaluate(() => !!(window.lottie && window.Lottie && window.Haptik && window.Scroll && window.Lottie.bereit())), 'Spieler sowie Lottie-, Haptik- und Scroll-Bausteine geladen');
  await p2.click('[data-act="gloss"][data-k="referenz"]'); await p2.waitForTimeout(700);
  ok(await p2.evaluate(() => { const e = document.querySelector('.sheet [data-lottie="messen"]'); return !!(e && e._lottie && !e._lottie.isPaused && e.querySelector('svg') && !e.querySelector('.lottie-still')); }), 'Glossar „Wie genau“: das Messen läuft als Bewegtbild in Schleife, Standbild ist ersetzt');
  ok(await p2.evaluate(() => { const st = Array.from(document.querySelectorAll('.sheet [data-lottie="messen"] svg [stroke]')).map((x) => x.getAttribute('stroke')); return st.some((c) => /rgb\(194,\s*65,\s*12\)|#c2410c/i.test(c)) && st.some((c) => /rgb\(20,\s*20,\s*20\)|#141414/i.test(c)); }), 'Bewegtbild trägt die Tokenfarben (Tinte, Maueröffnung)');
  ok(await p2.evaluate(() => window.Haptik.an() === true && window.Haptik.tick() === true), 'Haptik: am Telefon nach einer Berührung ein kurzes Tippen');
  await p2.evaluate(() => { S.gloss = null; render(); }); await p2.waitForTimeout(200);
  const sp = await p2.evaluate(async () => { const hs = document.querySelector('.hero-scene'), sc = document.querySelector('.scroll'); if (!hs || !sc) return null; const a = hs.style.getPropertyValue('--sp'); sc.scrollTop = 260; await new Promise((r) => setTimeout(r, 250)); return [a, hs.style.getPropertyValue('--sp')]; });
  ok(sp && sp[1] && sp[0] !== sp[1], 'Startbild folgt dem Scrollen (Scroll-Bindung setzt --sp)');
  const ctx3 = await browser.newContext({ ...telefon, reducedMotion: 'reduce' }), p3 = await neueSeite(ctx3);
  await p3.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await p3.click('[data-act="gloss"][data-k="referenz"]'); await p3.waitForTimeout(700);
  ok(await p3.evaluate(() => { const e = document.querySelector('.sheet [data-lottie="messen"]'); return !!(e && e._lottie && e._lottie.isPaused && e._lottie.currentFrame >= e._lottie.totalFrames - 2) && window.Haptik.an() === false; }), 'Bei „weniger Bewegung“: Bewegtbild steht auf dem Endbild, Haptik aus');
  sauber(p3, 'Bewegtbilder ohne Fehler');
  await ctx3.close();
  // Formen im Modell, Öffnung vorführen, Glas, Einbruchschutz, Fensterbank
  const ctx4 = await browser.newContext(telefon), p4 = await neueSeite(ctx4);
  await p4.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  const frage = async (id, set) => { await p4.evaluate(([id, set]) => { const w = demoProject()[0]; Object.assign(w, set || {}); S.win = w; S.q = id; S.selSash = 0; S.screen = 'frage'; render(true); }, [id, set || {}]); await p4.waitForTimeout(500); };
  await frage('form');
  const kacheln = await p4.evaluate(() => { const k = Array.from(document.querySelectorAll('.qformen .qf')), r = k.map((e) => e.getBoundingClientRect()), pan = document.querySelector('.qpanel').getBoundingClientRect(); return { n: k.length, eineReihe: r.every((x) => Math.abs(x.top - r[0].top) < 1), gleich: r.every((x) => Math.abs(x.width - r[0].width) < 1 && Math.abs(x.height - r[0].height) < 1), drin: r.every((x) => x.left >= pan.left - 1 && x.right <= pan.right + 1), name: (document.querySelector('.qformen + .qcur') || {}).textContent }; });
  ok(kacheln.n === 5 && kacheln.eineReihe && kacheln.gleich && kacheln.drin && /Rechteck/.test(kacheln.name), 'Formen: fünf gleich große Kacheln in einer Reihe, alle sichtbar, Name der gewählten darunter');
  const loch = () => p4.evaluate(() => { const st = document.getElementById('w3d'), wand = st.querySelector('[data-r="wall-in"]'), pts = (wand.style.clipPath.match(/px/g) || []).length / 2; return { struct: st.getAttribute('data-struct'), pts: pts, clip: wand.style.clipPath, glas: (st.querySelector('[data-r="glass-0"]').style.clipPath || '').slice(0, 12), streifen: st.querySelectorAll('.w3d-rs').length }; });
  const l0 = await loch();
  await p4.click('.qformen [data-v="rundbogen"]'); await p4.waitForTimeout(800);
  const l1 = await loch();
  ok(l0.struct === 'g' && l1.struct === 'g' && l1.pts === l0.pts && l1.pts >= 30 && l1.clip !== l0.clip && /^polygon\(/.test(l1.glas) && l1.streifen === 32, 'Rundbogen im Modell: Bogen in Wand, Laibung als Streifen, Flügel beschnitten; gleiche Punktzahl, damit es morpht');
  for (const f of ['segment', 'schraeg']) { await p4.click('.qformen [data-v="' + f + '"]'); await p4.waitForTimeout(300); }
  await p4.click('.qformen [data-v="rund"]'); await p4.waitForTimeout(500);
  const rund = await p4.evaluate(() => ({ t: S.win.teilung, s: S.win.sashes.map((x) => x.t).join(''), ol: S.win.ol, fragen: qList(S.win).map((q) => q.id), toast: (document.querySelector('.toast') || {}).textContent || '' }));
  ok(rund.t === '1' && rund.s === 'F' && !rund.ol && !rund.fragen.some((id) => /^(teilung|typ-|din-|ol$|fbi|fba)/.test(id)) && /fest verglast/.test(rund.toast), 'Rund: fest verglast, Fragen nach Flügeln, Oberlicht und Fensterbank entfallen, Hinweis erklärt es');
  await p4.click('.qformen [data-v="rechteck"]'); await p4.waitForTimeout(400);
  ok(await p4.evaluate(() => S.win.teilung === '3' && S.win.sashes.map((x) => x.t + x.din).join(',') === 'DKL,FL,DKR'), 'Zurück von Rund: die drei Flügel sind wieder da');
  await frage('ol', { ol: true, olT: 'K', form: 'rundbogen' });
  ok(await p4.evaluate(() => { const k = document.querySelector('[data-r="kf"]'); return !!k && parseFloat(k.style.height) > 2; }), 'Oberlicht mit Kämpfer: der Riegel zwischen Oberlicht und Flügeln ist da');
  await frage('typ-0');
  await p4.click('.qpanel [data-act="sash"][data-v="D"]'); await p4.waitForTimeout(250);
  const demo = await p4.evaluate(() => { const sa = document.querySelector('[data-r="sash-0"]'), hd = sa.querySelector('.w3d-handle'); return { cls: sa.className, an: sa.getAnimations().map((a) => a.animationName), griff: hd.getAnimations().map((a) => a.animationName) }; });
  ok(/demo-D/.test(demo.cls) && demo.an.indexOf('w3d-dreh') >= 0 && demo.griff.indexOf('w3d-griff-d') >= 0, 'Dreh gewählt: der Flügel geht kurz auf und zu, der Griff dreht vorher mit');
  await p4.waitForTimeout(1800);
  await p4.click('.qpanel [data-act="sash"][data-v="DK"]'); await p4.waitForTimeout(250);
  ok(await p4.evaluate(() => document.querySelector('[data-r="sash-0"]').getAnimations().some((a) => a.animationName === 'w3d-dk')), 'Dreh-Kipp gewählt: erst kippen, dann drehen');
  await frage('glas', { glas: '2', glasfn: [] });
  const g2 = await p4.evaluate(() => ({ lupe: !!document.querySelector('.w3d-lupe svg'), k: (document.querySelector('.w3d-lupe') || {}).getAttribute && document.querySelector('.w3d-lupe').getAttribute('data-k'), hint: document.querySelector('.w3d-hint').textContent, b: getComputedStyle(document.querySelector('[data-r="pane-b-0"]')).opacity }));
  await p4.click('.qpanel [data-act="setw"][data-v="3"]'); await p4.waitForTimeout(400);
  const g3 = await p4.evaluate(() => ({ k: document.querySelector('.w3d-lupe').getAttribute('data-k'), hint: document.querySelector('.w3d-hint').textContent, b: getComputedStyle(document.querySelector('[data-r="pane-b-0"]')).opacity }));
  ok(g2.lupe && /2 Scheiben/.test(g2.hint) && /3 Scheiben/.test(g3.hint) && g2.k !== g3.k && g2.b === '0' && g3.b !== '0', 'Verglasung: Lupe zeigt den Glasaufbau, 3-fach bekommt die dritte Scheibe im Modell');
  await frage('glasfn', { glasfn: [] });
  await p4.click('.qpanel [data-act="glasfn"][data-v="sonne"]'); await p4.waitForTimeout(300);
  await p4.click('.qpanel [data-act="glasfn"][data-v="vsg"]'); await p4.waitForTimeout(300);
  const fn = await p4.evaluate(() => ({ sonne: document.getElementById('w3d').classList.contains('glas-sonne'), folie: /#2fa57f/i.test(document.querySelector('.w3d-lupe').innerHTML), ico: document.querySelectorAll('.qpanel .chip .ci svg').length }));
  ok(fn.sonne && fn.folie && fn.ico === 4, 'Glas-Extras: Symbole in der Auswahl, Sonnenschutz tönt das Glas, Sicherheitsglas zeigt die Folie in der Lupe');
  await frage('rc', { rc: 'basis' });
  const pilz = () => p4.evaluate(() => document.querySelectorAll('.w3d-pilz.is-on').length);
  const r0 = await pilz();
  await p4.click('.qpanel [data-act="setw"][data-v="rc1"]'); await p4.waitForTimeout(300); const r1 = await pilz();
  await p4.click('.qpanel [data-act="setw"][data-v="rc2"]'); await p4.waitForTimeout(300); const r2 = await pilz();
  ok(r0 === 0 && r1 === 8 && r2 === 16 && await p4.evaluate(() => document.getElementById('w3d').classList.contains('mit-schloss') && /RC2/.test(document.querySelector('.w3d-hint').textContent)), 'Einbruchschutz: RC1 N zeigt Pilzköpfe an den Seiten, RC2 rundum und ein Schloss am Griff');
  await frage('fbi', { fbi: 'behalten' });
  const bank0 = await p4.evaluate(() => document.querySelector('[data-r="sill-t"]').style.background);
  await p4.click('.qpanel [data-act="setw"][data-v="stein"]'); await p4.waitForTimeout(300);
  const bank1 = await p4.evaluate(() => ({ bg: document.querySelector('[data-r="sill-t"]').style.background, tief: parseFloat(document.querySelector('[data-r="sill-t"]').style.height), hint: document.querySelector('.w3d-hint').textContent, dots: document.querySelectorAll('.qpanel .chip .dot').length }));
  ok(bank0 !== bank1.bg && /radial-gradient/.test(bank1.bg) && bank1.tief > 15 && /Naturstein/.test(bank1.hint) && bank1.dots === 4, 'Fensterbank innen: echte Bank bis vor die Wand, Material sichtbar, Musterpunkte in der Auswahl');
  await frage('fba', { fba: 'behalten' });
  await p4.click('.qpanel [data-act="setw"][data-v="alu"]'); await p4.waitForTimeout(300);
  ok(await p4.evaluate(() => { const t = document.querySelector('[data-r="sa-t2"]'), f = document.querySelector('[data-r="sa-f"]'); return !!t && !!f && parseFloat(t.style.height) > 5 && /rotateX\(-83deg\)/.test(t.style.transform) && parseFloat(f.style.height) > 4; }), 'Fensterbank außen: Überstand mit Gefälle und Tropfkante');
  sauber(p4, 'Formen, Öffnung, Glas, Schutz und Bank ohne Fehler');
  await ctx4.close();

  // Elementarten: Unterlicht, Festverglasung, Hebe-Schiebe-Tür, Faltschiebewand; Sonnenschutz außen und innen; neue Öffnung einzeichnen
  const ctx5 = await browser.newContext(telefon), p5 = await neueSeite(ctx5);
  await p5.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  const frage5 = async (id, set, art) => { await p5.evaluate(([id, set, art]) => { const w = demoProject()[0]; if (art) artSetzen(w, art); Object.assign(w, set || {}); if (art === 'hst') w.sashes = hstFluegel(w.hst.schema, w.hst.richtung); if (art === 'fsw') w.sashes = fswFluegel(w.fsw.n, w.fsw.schema, w.fsw.geh); S.win = w; S.q = id; S.selSash = 0; S.screen = 'frage'; render(true); }, [id, set || {}, art || '']); await p5.waitForTimeout(500); };
  await frage5('ul', { ul: false });
  const ul0 = await p5.evaluate(() => ({ feld: !!document.querySelector('[data-r="ul-front"]'), sashH: parseFloat(document.querySelector('[data-r="sash-0"]').style.height) }));
  await p5.click('.qpanel [data-act="ul-set"][data-v="glas"]'); await p5.waitForTimeout(700);
  await p5.click('.qpanel [data-act="ulh"][data-v="50"]'); await p5.waitForTimeout(500);
  const ul1 = await p5.evaluate(() => ({ feld: !!document.querySelector('[data-r="ul-front"]'), kf: parseFloat((document.querySelector('[data-r="kfu"]') || { style: {} }).style.height), sashH: parseFloat(document.querySelector('[data-r="sash-0"]').style.height), h: S.win.ulH, hint: document.querySelector('.w3d-hint').textContent, glas: document.querySelector('[data-r="ul-glass"]').classList.contains('w3d-glass') }));
  await p5.click('.qpanel [data-act="ul-set"][data-v="paneel"]'); await p5.waitForTimeout(500);
  const ul2 = await p5.evaluate(() => ({ paneel: document.querySelector('[data-r="ul-glass"]').classList.contains('w3d-paneel'), hint: document.querySelector('.w3d-hint').textContent }));
  ok(!ul0.feld && ul1.feld && ul1.kf > 2 && ul1.sashH < ul0.sashH - 10 && ul1.h === 450 && /450 mm/.test(ul1.hint) && ul1.glas && ul2.paneel && /Paneel/.test(ul2.hint), 'Unterlicht: festes Feld mit Kämpfer unter kürzeren Flügeln, Höhe in 5-cm-Schritten, Glas oder Paneel im Modell');
  await frage5('felder', {}, 'fest');
  await p5.click('.qpanel [data-act="felder"][data-v="4"]'); await p5.waitForTimeout(500);
  const fest = await p5.evaluate(() => ({ n: S.win.sashes.length, t: S.win.sashes.map((x) => x.t).join(''), griff: S.win.griff, handles: Array.from(document.querySelectorAll('.w3d-sash')).every((sa) => sa.classList.contains('is-fixed')), fragen: qList(S.win).map((q) => q.id) }));
  ok(fest.n === 4 && fest.t === 'FFFF' && fest.griff === 'ohne' && fest.handles && !fest.fragen.some((id) => /^(teilung|typ-|din-|ol$|ul$|griff|gf)$/.test(id)) && fest.fragen.includes('felder'), 'Festverglasung: 1 bis 4 Felder ohne Flügelrahmen und Griff, Fragen nach Flügeln, Griff und Ober-/Unterlicht entfallen');
  await frage5('hsts', { hst: { schema: 'A', richtung: 'R', schwelle: 'flach' } }, 'hst');
  const hst = await p5.evaluate(() => { const st = document.getElementById('w3d'), s1 = st.querySelector('[data-r="sash-1"]'), h = s1.querySelector('.w3d-handle'); return { t: S.win.sashes.map((x) => x.t).join(''), boden: !!st.querySelector('[data-r="floor-in"]') && !!st.querySelector('[data-r="floor-out"]'), schwelle: !!st.querySelector('[data-r="schw"]'), bank: getComputedStyle(st.querySelector('[data-r="sill-t"]')).opacity === '0', schiebe: s1.classList.contains('is-schiebe'), hebegriff: parseFloat(h.style.height) > parseFloat(h.style.width) * 6, z: parseFloat((st.querySelector('[data-r="sash-0"]').style.translate.split(' ')[2])) < parseFloat(s1.style.translate.split(' ')[2]) }; });
  ok(hst.t === 'FS' && hst.boden && hst.schwelle && hst.bank && hst.schiebe && hst.hebegriff && hst.z, 'Hebe-Schiebe-Tür: bodentief mit Boden innen und außen, Schwelle statt Fensterbank, Schiebeflügel mit Hebegriff vor dem Festteil');
  await p5.evaluate(() => tuerZeigen()); await p5.waitForTimeout(300);
  ok(await p5.evaluate(() => document.querySelector('[data-r="sash-1"]').getAnimations().some((a) => a.animationName === 'w3d-schieben')), 'Hebe-Schiebe-Tür: der Flügel hebt sich und schiebt vor das Festteil');
  await p5.click('.qpanel [data-act="hst"][data-v="C"]'); await p5.waitForTimeout(500);
  ok(await p5.evaluate(() => S.win.sashes.map((x) => x.t + x.din).join(',') === 'FL,SR,SL,FR' && qList(S.win).every((q) => q.id !== 'hstr')), 'Schema C: zwei Schiebeflügel mittig, die Seitenfrage entfällt');
  await frage5('fswn', { fsw: { n: 4, schema: 'links', geh: true, schwelle: 'flach' } }, 'fsw');
  await p5.click('.qpanel [data-act="fsw"][data-v="6"]'); await p5.waitForTimeout(300);
  const fsw = await p5.evaluate(() => ({ n: S.win.sashes.length, t: S.win.sashes.map((x) => x.t).join(''), geh: S.win.sashes[5].t === 'P' && S.win.sashes[5].din === 'L' }));
  /* Die Vorführung startet kurz nach der Wahl; gezählt wird, sobald die Flügel weit gefaltet sind, danach die Ruhelage */
  /* Gefaltet wird per CSS-Animation je Flügel (läuft im Compositor): auf dem Höhepunkt sind mindestens fünf Flügel räumlich gedreht */
  const gefaltet = () => p5.evaluate(() => { const st = document.getElementById('w3d'); return st.classList.contains('is-demo') && Array.from(st.querySelectorAll('.w3d-sash')).filter((sa) => sa.getAnimations().some((a) => /^falt-/.test(a.animationName)) && /^matrix3d/.test(getComputedStyle(sa).transform) && Math.abs(new DOMMatrix(getComputedStyle(sa).transform).m13) > 0.35).length >= 5; });
  let falt = false; for (let k = 0; k < 40 && !falt; k++) { await p5.waitForTimeout(100); falt = await gefaltet(); }
  const ruhig = () => { const st = document.getElementById('w3d'); return !st.classList.contains('is-demo') && Array.from(st.querySelectorAll('.w3d-sash')).every((sa) => sa.style.transform === 'none' && !sa.getAnimations().some((a) => /^falt-/.test(a.animationName))); };
  await p5.waitForFunction(ruhig, null, { timeout: 6000 }).catch(() => {});
  const ruhe = await p5.evaluate(ruhig);
  ok(fsw.n === 6 && fsw.t === 'XXXXXP' && fsw.geh && falt && ruhe, 'Faltschiebewand: 6 Flügel mit Gehflügel am Ende, die Wand faltet sich zum Paket und kommt zurück');
  await frage5('sart', { sart: 'keiner', roll: 'keiner' });
  await p5.click('.qpanel [data-act="sart"][data-v="raffstore"]'); await p5.waitForTimeout(600);
  const so1 = await p5.evaluate(() => ({ roll: S.win.roll, behang: !!document.querySelector('[data-r="behang"]'), bg: (document.querySelector('[data-r="behang"]') || { style: {} }).style.background || '', kasten: (document.querySelector('[data-r="roll-f"]') || { style: {} }).style.background || '', fragen: qList(S.win).map((q) => q.id) }));
  await frage5('sfarbe', { sart: 'raffstore', roll: 'aufsatz', sfarbe: 'silber' });
  await p5.click('.qpanel .qsw[data-v="anthrazit"]'); await p5.waitForTimeout(500);
  const so2 = await p5.evaluate(() => ({ f: S.win.sfarbe, bg: document.querySelector('[data-r="behang"]').style.background, hint: document.querySelector('.w3d-hint').textContent, swatches: document.querySelectorAll('.qpanel .qsw').length }));
  ok(so1.roll === 'aufsatz' && so1.behang && /repeating-linear-gradient/.test(so1.bg) && so1.fragen.includes('einbau') && so1.fragen.includes('sfarbe') && so1.fragen.includes('antrieb') && so2.f === 'anthrazit' && so2.bg !== so1.bg && /Anthrazit/.test(so2.hint) && so2.swatches === 7, 'Sonnenschutz außen: Raffstore hängt als Lamellen-Behang vor dem Fenster, sieben Farben färben Behang und Kasten, Einbau und Antrieb folgen');
  await frage5('iart', { iart: 'keiner' });
  await p5.click('.qpanel [data-act="setw"][data-f="iart"][data-v="jalousie"]'); await p5.waitForTimeout(600);
  const inn = await p5.evaluate(() => ({ da: !!document.querySelector('[data-r="innen"]'), bg: document.querySelector('[data-r="innen"]').style.background, k: !!document.querySelector('[data-r="innen-k"]'), fragen: qList(S.win).map((q) => q.id) }));
  ok(inn.da && inn.k && /repeating-linear-gradient/.test(inn.bg) && inn.fragen.includes('ifarbe'), 'Sichtschutz innen: Jalousie mit Kassette vor dem Glas, die Farbfrage folgt');
  // Eigene Farbe: Textfeld bei jeder Farbwahl, erkannte Farben färben das Modell schon beim Tippen
  await frage5('fa');
  await p5.click('#t-wunschA'); await p5.keyboard.type('RAL 7021'); await p5.waitForTimeout(300);
  const fa1 = await p5.evaluate(() => ({ bg: document.querySelector('[data-r="el-back"]').style.background, info: document.getElementById('ffi-wunschA').textContent, fokus: document.activeElement.id, cur: document.querySelector('.qpanel .qcur').textContent }));
  await p5.evaluate(() => document.activeElement.blur()); await p5.waitForTimeout(300);
  const fa2 = await p5.evaluate(() => ({ zeile: specRows(S.win).find((r) => r.k === 'Farbe').v, gewaehlt: document.querySelectorAll('.qpanel .qsw[aria-pressed="true"]').length }));
  await p5.click('.qpanel .qsw[data-v="9016"]'); await p5.waitForTimeout(300);
  const fa3 = await p5.evaluate(() => ({ wunsch: S.win.wunschA, fa: S.win.fa }));
  ok(/rgb\(47, 50, 52\)/.test(fa1.bg) && /Erkannt: RAL 7021 Schwarzgrau/.test(fa1.info) && fa1.fokus === 't-wunschA' && /RAL 7021 Schwarzgrau/.test(fa1.cur) && /RAL 7021 Schwarzgrau, eigene Angabe/.test(fa2.zeile) && fa2.gewaehlt === 0 && fa3.wunsch === '' && fa3.fa === '9016', 'Eigene Farbe außen: RAL-Nummer wird erkannt, das Modell färbt sich beim Tippen, eine Farbe aus der Liste hebt sie wieder auf');
  await frage5('gf');
  await p5.click('#t-wunschGf'); await p5.keyboard.type('Messing'); await p5.evaluate(() => document.activeElement.blur()); await p5.waitForTimeout(300);
  const gf1 = await p5.evaluate(() => ({ griff: document.querySelector('[data-r="handle-0"]').style.background, zeile: specRows(S.win).find((r) => r.k === 'Griff').v }));
  await frage5('sfarbe', { sart: 'raffstore', roll: 'aufsatz' });
  await p5.click('#t-wunschSf'); await p5.keyboard.type('DB 703'); await p5.evaluate(() => document.activeElement.blur()); await p5.waitForTimeout(300);
  const sf1 = await p5.evaluate(() => ({ hint: document.querySelector('.w3d-hint').textContent, zeile: specRows(S.win).find((r) => r.k === 'Sonnenschutz').v }));
  await frage5('ifarbe', { iart: 'rollo' });
  await p5.click('#t-wunschIf'); await p5.keyboard.type('Sonnenuntergang'); await p5.evaluate(() => document.activeElement.blur()); await p5.waitForTimeout(300);
  const if1 = await p5.evaluate(() => ({ info: document.getElementById('ffi-wunschIf').textContent, zeile: specRows(S.win).find((r) => r.k === 'Sonnenschutz').v }));
  ok(/rgb\(181, 162, 106\)/.test(gf1.griff) && /Messing/.test(gf1.zeile) && /DB 703 Eisenglimmer dunkel/.test(sf1.hint) && /DB 703/.test(sf1.zeile) && /Nicht in der Farbliste/.test(if1.info) && /Wunsch: Sonnenuntergang/.test(if1.zeile), 'Eigene Farbe auch für Griff, Sonnenschutz und Innenschutz: Messing, DB 703 erkannt, Unbekanntes geht als Wunsch mit');
  // Flüssig: gleiche Struktur → dieselbe Bühne bleibt, der Hinweis am Modell ohne Weichzeichner
  await frage5('glas');
  const buehne = await p5.evaluate(() => { window.__b = document.getElementById('w3d'); return true; });
  await p5.click('.qpanel [data-act="setw"][data-v="2"]'); await p5.waitForTimeout(200);
  ok(buehne && await p5.evaluate(() => window.__b === document.getElementById('w3d') && getComputedStyle(document.querySelector('.w3d-hint')).backdropFilter === 'none'), 'Flüssig: bei gleicher Struktur bleibt die Bühne stehen, der Hinweis am Modell rechnet keinen Weichzeichner');
  // Neue Öffnung: Start → Fotos → Einzeichnen (Ecke ziehen, Lupe) → Maße → Ergebnis mit Lage
  await p5.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await p5.click('[data-act="new"]'); await p5.waitForSelector('.scr[data-screen="start"]');
  await p5.click('.qopt[data-act="situation"][data-v="neu"]'); await p5.waitForTimeout(300);
  await p5.click('.qopt[data-act="art"][data-v="fenster"]'); await p5.waitForTimeout(200);
  const startNeu = await p5.evaluate(() => ({ neu: S.win.neu, note: !!document.querySelector('.qgroup .note'), bar: document.querySelector('.bb .btn.primary').textContent }));
  await p5.click('.bb .btn.primary'); await p5.waitForTimeout(300);
  const fotosNeu = await p5.evaluate(() => ({ h1: document.querySelector('.hd h1').textContent, bar: document.querySelector('.bb .btn.primary').textContent, steps: stepsFor(S.win).join(',') }));
  await p5.evaluate(() => useDemo()); await p5.waitForTimeout(1800);
  await p5.click('.bb .btn.primary'); await p5.waitForTimeout(700);
  const z0 = await p5.evaluate(() => ({ screen: S.screen, ecken: document.querySelectorAll('.zcorner').length, raster: document.querySelectorAll('.zgrid line').length, dim: !!document.querySelector('.zdim'), e: JSON.stringify(S.win.plan.ecken[2]) }));
  const dot = await p5.$('[data-r="zc-2"] .dot'); const bb = await dot.boundingBox();
  await p5.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p5.mouse.down(); await p5.mouse.move(bb.x + 40, bb.y + 50, { steps: 6 }); await p5.waitForTimeout(100);
  const lupe = await p5.evaluate(() => { const l = document.querySelector('[data-r="zlupe"]'); return !l.hidden && /url\(/.test(l.style.backgroundImage); });
  await p5.mouse.up(); await p5.waitForTimeout(200);
  const z1 = await p5.evaluate(() => ({ e: JSON.stringify(S.win.plan.ecken[2]), lupe: document.querySelector('[data-r="zlupe"]').hidden }));
  await p5.click('[data-act="plan-rect"]'); await p5.waitForTimeout(200);
  const z2 = await p5.evaluate(() => { const P = S.win.plan.ecken; return Math.abs(P[0][1] - P[1][1]) < 1e-9 && Math.abs(P[1][0] - P[2][0]) < 1e-9; });
  ok(startNeu.neu && startNeu.note && /Fotos/.test(startNeu.bar) && /Stelle/.test(fotosNeu.h1) && /Einzeichnen/.test(fotosNeu.bar) && fotosNeu.steps === 'start,fotos,zeichnen,planmasse,ergebnis,frage' && z0.screen === 'zeichnen' && z0.ecken === 4 && z0.raster === 4 && z0.dim && z0.e !== z1.e && lupe && z1.lupe && z2, 'Neue Öffnung: eigener Weg mit Einzeichnen, vier Ecken mit Raster, Lupe beim Ziehen, „Rechteck ausrichten“');
  await p5.click('.qnav .btn.primary'); await p5.waitForTimeout(900);
  const pm = await p5.evaluate(() => ({ screen: S.screen, d: derive(S.win), bild: (S.win.plan.bild || '').length, rows: document.querySelectorAll('input[data-in="plan"]').length }));
  await p5.click('[data-act="plan-bump"][data-f="h"][data-v="50"]'); await p5.waitForTimeout(300);
  const pm2 = await p5.evaluate(() => { const d = derive(S.win); return { moH: d.moH, elH: d.elH, mo: S.win.mo.hl === S.win.mo.hr && S.win.mo.hl === d.moH }; });
  await p5.click('.bb .btn.primary'); await p5.waitForTimeout(900);
  const erg = await p5.evaluate(() => ({ screen: S.screen, tags: Array.from(document.querySelectorAll('.result .tag')).map((t) => t.textContent), bild: !!document.querySelector('.plan-bild'), back: document.querySelector('.hdr-btn[data-act="back"] span').textContent }));
  const code = await p5.evaluate(() => { const o = unpackProject(packProject([S.win], S.proj, null)); return { bild: o.w[0].plan.bild, ecken: o.w[0].plan.ecken.length, neu: o.w[0].neu }; });
  ok(pm.screen === 'planmasse' && pm.d.moW === 1230 && pm.d.elW === 1200 && pm.bild > 5000 && pm.rows === 4 && pm2.moH === 1530 && pm2.elH === 1500 && pm2.mo && erg.screen === 'ergebnis' && erg.tags.every((t) => /Wunschmaß|rechnerisch/.test(t)) && erg.bild && erg.back === 'Maße' && code.bild === '' && code.ecken === 4 && code.neu, 'Wunschmaße: Vorgabe je Art, Element 15 mm je Seite kleiner, Ergebnis als Wunschmaß mit Lage auf dem Foto; das Foto bleibt auf dem Gerät');
  await foto(p5, 'app-neu-ergebnis');
  sauber(p5, 'Elementarten, Sonnenschutz und neue Öffnung ohne Fehler');
  await ctx5.close();
  sauber(p2, 'App-Logik ohne Fehler');
  await ctx2.close();
}

/* ---------- 7. Nachbesserung: gleiches Projekt, nichts doppelt gebucht, Grenzen ---------- */
if (teil(7)) {
  console.log('7. Nachbesserung ohne Doppelbuchung');
  const ctx = await browser.newContext({ ...telefon, acceptDownloads: true });
  const page = await neueSeite(ctx);
  const tun = (act, v, id) => page.evaluate(([act, v, id]) => { const b = document.createElement('button'); b.setAttribute('data-act', act); if (v) b.setAttribute('data-v', v); if (id) b.setAttribute('data-id', id); document.getElementById('app').appendChild(b); b.click(); }, [act, v || '', id || '']);
  const toastText = () => page.evaluate(() => { const t = document.getElementById('toast'); return t ? t.textContent : ''; });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await betrieb(page, 'c1'); await page.waitForTimeout(400);
  const vorher = await page.evaluate(() => ({ book: ledger(A()).filter((b) => b.kind === 'aufmass').length, frei: freeLeft(A()), url: linkURL(A().links.find((l) => l.id === 'l1')) }));
  // Runde 2 anfragen
  await tun('go', 'link', 'l1'); await page.waitForTimeout(300);
  ok(await page.locator('[data-v="nachbesserung"]').count() === 1, 'Eingegangenes Projekt bietet „Nachbesserung anfragen“');
  await tun('sheet', 'nachbesserung', 'l1'); await page.waitForSelector('#nb-hinweis'); await page.fill('#nb-hinweis', 'Küche: Breite unten bitte nachmessen');
  await tun('nb-send', '', 'l1'); await page.waitForTimeout(400);
  const nb = await page.evaluate(() => { const l = A().links.find((x) => x.id === 'l1'); return { offen: l.nb && l.nb.offen, runde: l.nb && l.nb.runde, url: linkURL(l), msg: linkMsg(l) }; });
  ok(nb.offen && nb.runde === 2 && /~2$/.test(nb.url) && nb.url !== vorher.url, 'Nachbesserungs-Link trägt die Runde (~2)');
  ok(/Küche: Breite unten/.test(nb.msg) && /erneut abschicken/.test(nb.msg), 'Nachricht an den Kunden nennt den Hinweis');
  await foto(page, 'portal-nachbesserung');
  // Kunde: gesendetes Aufmaß liegt auf dem Gerät, Link mit Runde 2 öffnet es wieder
  await page.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.setItem('aufmass.k.7f3a9', JSON.stringify({ windows: demoProject(), proj: {}, sent: { when: Date.now() - 864e5, runde: 1 }, name: 'Fensterbau Brandt' })); });
  await page.goto(nb.url, { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  let st = await page.evaluate(() => ({ nb: S.nb, sent: S.sent, n: S.windows.length, txt: document.body.textContent }));
  ok(st.nb && st.nb.runde === 2 && !st.sent && st.n === 2 && /eine Runde noch/.test(st.txt), 'App öffnet das gesendete Aufmaß zur Nachbesserung, Angaben bleiben');
  await foto(page, 'app-nachbesserung');
  await page.evaluate(() => { S.windows[1].mo.wb = 900; S.windows[1].name = 'Bad (nachgemessen)'; persist(); S.screen = 'blatt'; render(true); });
  await page.waitForTimeout(300);
  ok(/Erneut an Fensterbau Brandt senden/.test(await page.evaluate(() => document.querySelector('.bb .btn.primary').textContent)), 'Prüfen-Seite sagt „Erneut senden“');
  await page.click('.bb .btn.primary'); await page.waitForSelector('[data-screen="gesendet"]');
  const code2 = await page.inputValue('#code-box');
  ok(await page.evaluate((c) => unpackProject(c).r === 2 && !S.nb && S.sent.runde === 2, code2), 'Erneuter Code trägt Runde 2, App ist wieder im Zustand „gesendet“');
  // Betrieb: Code übernehmen → ersetzt, nichts gebucht
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', code2); await tun('linkimport'); await page.waitForTimeout(500);
  let l1 = await page.evaluate(() => { const l = A().links.find((x) => x.id === 'l1'); return { runde: l.runde, offen: l.nb.offen, vorher: (l.vorher || []).length, namen: l.aufmass.windows.map((w) => w.name), book: ledger(A()).filter((b) => b.kind === 'aufmass').length, frei: freeLeft(A()) }; });
  ok(l1.runde === 2 && !l1.offen && l1.vorher === 1 && l1.namen.includes('Bad (nachgemessen)'), 'Nachbesserung ersetzt das Aufmaß im selben Projekt (Runde 2, alte Fassung aufgehoben)');
  ok(l1.book === vorher.book && l1.frei === vorher.frei && /nichts berechnet/.test(await toastText()), 'Nichts doppelt gebucht, kein Freikontingent verbraucht');
  // Alter Code noch einmal: schon eingegangen
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', code2); await tun('linkimport'); await page.waitForTimeout(400);
  ok(/schon eingegangen/.test(await toastText()), 'Derselbe Code ein zweites Mal wird abgewiesen');
  await page.evaluate(() => { S.sheet = null; render(); });
  // Runde 3 mit einem völlig anderen Aufmaß: wird als neues gebucht
  await tun('sheet', 'nachbesserung', 'l1'); await page.waitForSelector('#nb-hinweis'); await tun('nb-send', '', 'l1'); await page.waitForTimeout(300);
  const url3 = await page.evaluate(() => linkURL(A().links.find((x) => x.id === 'l1')));
  ok(/~3$/.test(url3), 'Zweite Nachbesserung: Runde 3');
  await page.goto(url3, { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  await page.evaluate(() => { const w = demoProject()[0]; S.windows = [Object.assign({}, w, { name: 'Garage', w: 2400, h: 2100, el: { w: 2400, h: 2100 }, mo: { hm: 2130, hl: 2130, hr: 2130, wm: 2430, wt: 2430, wb: 2430 } })]; persist(); S.screen = 'blatt'; render(true); });
  await page.waitForTimeout(200); await page.click('.bb .btn.primary'); await page.waitForSelector('[data-screen="gesendet"]');
  const code3 = await page.inputValue('#code-box');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', code3); await tun('linkimport'); await page.waitForTimeout(500);
  l1 = await page.evaluate(() => ({ book: ledger(A()).filter((b) => b.kind === 'aufmass').length, extra: ledger(A()).some((b) => b.ref === 'l1#3'), toast: document.getElementById('toast').textContent, nb: nbMoeglich(A().links.find((x) => x.id === 'l1')) }));
  ok(l1.book === vorher.book + 1 && l1.extra && /anderes Aufmaß/.test(l1.toast), 'Aufmaß ohne Überschneidung wird wie ein neues gebucht');
  ok(/Maximum/.test(l1.nb) && await page.locator('[data-v="nachbesserung"]').count() === 0, 'Nach zwei Runden keine weitere Nachbesserung');
  sauber(page, 'Nachbesserung Betrieb ohne Fehler');

  // Anderes Gerät: Kunde hat keine gespeicherten Angaben, misst nur das eine Fenster neu → wird ergänzt
  await betrieb(page, 'c7'); await page.waitForTimeout(400);
  await tun('sheet', 'nachbesserung', 'l4'); await page.waitForSelector('#nb-hinweis'); await tun('nb-send', '', 'l4'); await page.waitForTimeout(300);
  const url4 = await page.evaluate(() => linkURL(A().links.find((x) => x.id === 'l4')));
  const alt4 = await page.evaluate(() => A().links.find((x) => x.id === 'l4').aufmass.windows.length);
  await page.goto(url4, { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  st = await page.evaluate(() => ({ nb: S.nb, n: S.windows.length, txt: document.body.textContent }));
  ok(st.nb && st.nb.teil && st.n === 0 && /nicht gespeichert/.test(st.txt), 'Ohne gespeicherte Angaben erklärt die App, nur das betroffene Fenster neu zu messen');
  await page.evaluate(() => { S.windows = [Object.assign({}, demoProject()[1], { name: 'Backstube' })]; persist(); S.screen = 'blatt'; render(true); });
  await page.waitForTimeout(200); await page.click('.bb .btn.primary'); await page.waitForSelector('[data-screen="gesendet"]');
  const code4 = await page.inputValue('#code-box');
  ok(await page.evaluate((c) => { const o = unpackProject(c); return o.r === 2 && o.m === 1; }, code4), 'Code meldet Teil-Nachbesserung');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', code4); await tun('linkimport'); await page.waitForTimeout(500);
  const l4 = await page.evaluate(() => { const l = A().links.find((x) => x.id === 'l4'); return { n: l.aufmass.windows.length, namen: l.aufmass.windows.map((w) => w.name), toast: document.getElementById('toast').textContent }; });
  ok(l4.n === alt4 && l4.namen.filter((n) => n === 'Backstube').length === 1 && /ergänzt/.test(l4.toast), 'Teil-Nachbesserung ersetzt nur die passende Position, der Rest bleibt');
  sauber(page, 'Nachbesserung anderes Gerät ohne Fehler');
  await ctx.close();
}

/* ---------- 8. Servermodus: Konto auf dem Server, direkter Eingang, Kontingent und Sperre, Zahlungsart, Abo, Kauf mit Nachweis ---------- */
if (teil(8)) {
  console.log('8. Servermodus (Datenbank und Kasse nachgestellt)');
  const cp = await import('node:child_process'), pfad = await import('node:path'), urlM = await import('node:url');
  let kind = null, BASE2 = process.env.BASE2 || '';
  if (!BASE2) {
    const port = 8790 + Math.floor(Math.random() * 100); BASE2 = 'http://localhost:' + port;
    const skript = pfad.join(pfad.dirname(urlM.fileURLToPath(import.meta.url)), 'dev-server.mjs');
    kind = cp.spawn(process.execPath, [skript], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1' }), stdio: ['ignore', 'ignore', 'pipe'] });
    kind.stderr.on('data', (d) => process.stderr.write('  [Server 2] ' + d));
    const aus = () => { try { kind.kill(); } catch (e) { /* schon weg */ } };
    process.on('exit', aus); process.on('SIGTERM', () => { aus(); process.exit(143); }); process.on('SIGINT', () => { aus(); process.exit(130); });
    let bereit = false;
    for (let i = 0; i < 60 && !bereit; i++) { await new Promise((r) => setTimeout(r, 200)); try { const j = await fetch(BASE2 + '/api/status').then((r) => r.json()); bereit = !!(j && j.daten && j.zahlung); } catch (e) { /* noch nicht */ } }
    ok(bereit, 'Zweiter Testserver mit Attrappen läuft: ' + BASE2);
  }
  const status = await fetch(BASE2 + '/api/status').then((r) => r.json()).catch(() => null);
  ok(!!status && status.daten && status.zahlung && status.attrappe && status.preise.aufmass === 7.99 && status.preise.frei === 3 && status.preise.abo.grund === 49 && status.preise.plus === 79, '/api/status meldet Daten, Zahlung, Attrappe und die Preise');
  const api = async (p, body, token, method) => { const init = { method: method || (body ? 'POST' : 'GET'), headers: { accept: 'application/json', origin: BASE2 } }; if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); } if (token) init.headers.authorization = 'Bearer ' + token; const r = await fetch(BASE2 + p, init); return Object.assign({ _status: r.status }, await r.json().catch(() => ({}))); };
  ok((await api('/api/konto'))._status === 401 && (await api('/api/aufmass', { b: 'gibtsnicht', w: [] }))._status === 404 && (await api('/api/link/gibtsnicht'))._status === 404 && (await api('/api/konto/projekte', { kunde: 'x' }))._status === 401, 'API: Konten nur angemeldet, unbekannte Links werden abgewiesen');
  const falsch = await api('/api/konto/bestaetigen', { mail: 'falsch@beispiel.de', code: '000000' });
  ok(falsch._status >= 400 && falsch.ok === false, 'Falscher Anmeldecode wird abgewiesen');
  const testToken = (m) => 'test.' + Buffer.from(m, 'utf8').toString('base64').replace(/=+$/, '');
  const fremd = await api('/api/konto/projekte', { kunde: 'x' }, testToken('niemand@beispiel.de'));
  ok(fremd._status === 404 && /registrieren/.test(fremd.fehler || ''), 'Anmeldung ohne Betrieb: erst registrieren');

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await neueSeite(ctx, BASE2);
  const tun = (act, v, id) => page.evaluate(([act, v, id]) => { const b = document.createElement('button'); b.setAttribute('data-act', act); if (v) b.setAttribute('data-v', v); if (id) b.setAttribute('data-id', id); document.getElementById('app').appendChild(b); b.click(); }, [act, v || '', id || '']);
  const toastText = () => page.evaluate(() => { const t = document.getElementById('toast'); return t ? t.textContent : ''; });
  const stempel = Date.now().toString(36), mail = 'test-' + stempel + '@beispiel.de', firma = 'Fensterbau Prüf ' + stempel, tel = '0221 ' + String(Date.now()).slice(-7);
  await page.goto(BASE2 + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  ok(await page.locator('.fx-pilot').count() === 0 && await page.evaluate(() => Server.an && !Server.online() && !S.role), 'Portal im Servermodus: kein Pilot-Hinweis, noch nicht angemeldet');
  ok(/7,99/.test(await page.evaluate(() => document.body.textContent)), 'Startseite nennt den Preis vom Server');
  // Registrierung: E-Mail → Code 123456 → Betrieb eintragen
  await tun('reg', 'betrieb'); await page.waitForSelector('#lg-mail');
  ok(/Konto für Ihren Betrieb/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('#lg-pw').count() === 0, 'Registrierung beginnt mit der E-Mail, ohne Passwort');
  await page.fill('#lg-mail', mail); await page.click('form[data-form="srvlogin"] button[type="submit"]'); await page.waitForSelector('#lg-code');
  await page.fill('#lg-code', '000000'); await page.click('form[data-form="srvlogin"] button[type="submit"]'); await page.waitForTimeout(400);
  ok(await page.locator('#lg-code').count() === 1 && await page.locator('.sheet .err').count() === 1, 'Falscher Code: Hinweis, Blatt bleibt offen');
  page.probleme = page.probleme.filter((x) => !/bestaetigen|401/.test(x)); // der absichtlich falsche Code
  await page.fill('#lg-code', '123456'); await page.click('form[data-form="srvlogin"] button[type="submit"]');
  await page.waitForSelector('#r-firma');
  ok(await page.evaluate(() => S.reg && S.reg.server === true && !!Server.sitzung) && await page.locator('#r-mail').count() === 0 && await page.locator('#r-pw').count() === 0, 'Nach dem Code: Betrieb eintragen, E-Mail steht fest, kein Passwort');
  await page.fill('#r-firma', firma); await page.fill('#r-ap', 'Petra Prüf'); await page.fill('#r-tel', tel);
  await tun('reg-next'); await page.waitForSelector('#r-plz');
  await page.fill('#r-plz', '50667'); await page.click('[data-in="r:agb"]');
  await tun('reg-next'); await page.waitForFunction(() => Server.online(), null, { timeout: 8000 }); await page.waitForTimeout(500);
  ok(await page.evaluate((f) => Server.online() && BC().name === f && X.konto(A()) === 'service' && freeLeft(A()) === 3 && A().links.length === 0 && !A().pay, firma), 'Betrieb auf dem Server angelegt: Start-Tarif, 3 freie Projekte, keine Zahlungsart');
  ok(await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('aufmass.sitzung') || 'null'); return !!(s && s.token && s.refresh); }) && !/"pw":"[^"]+"/.test(await page.evaluate(() => JSON.stringify(Object.assign({}, localStorage)))), 'Sitzung im Browser, kein Passwort');
  await foto(page, 'srv-portal-neu');
  // Doppelkonto: gleiche Telefonnummer → kein Freikontingent
  const dupMail = 'dup-' + stempel + '@beispiel.de', dupTok = testToken(dupMail);
  const dup = await api('/api/konto/registrieren', { firma: 'Prüf Zweitkonto ' + stempel, ap: 'Paul Prüf', tel: tel, plz: '50667', col: '#1f7a3d', agb: true }, dupTok);
  ok(dup.ok && dup.konto.acc.freeQuota === 0 && dup.konto.acc.dupOf === firma, 'Zweites Konto mit derselben Telefonnummer bekommt keine kostenlosen Projekte');
  // Projekt anlegen → Link auf den eigenen Server
  await page.evaluate(() => { S.nl = { step: 1, kunde: 'Familie Server', kontakt: '0171 000 00 01', adresse: 'Serverweg 1, 50667 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster'], note: '', days: 14, du: false, err: {} }; });
  await tun('nl-create'); await page.waitForFunction(() => A().links.length === 1, null, { timeout: 8000 }); await page.waitForTimeout(400);
  const l1 = await page.evaluate(() => { const l = A().links[0]; return { url: linkURL(l), code: l.code, id: l.id, status: l.status }; });
  ok(l1.url.startsWith(BASE2 + '/app/#k-') && l1.status === 'erstellt' && await page.locator('.created').count() === 1, 'Projekt auf dem Server angelegt, Link zeigt auf den eigenen Server');
  await tun('l-share', 'Text', l1.id); await page.waitForTimeout(600);
  ok(await page.evaluate(() => A().links[0].status === 'gesendet'), 'Link verschickt: Status kommt vom Server zurück');
  sauber(page, 'Registrierung und Projekt ohne Fehler');

  // Der Kunde öffnet den Link in der App: Betrieb vom Server bestätigt, Öffnen gemeldet, Aufmaß geht direkt an den Betrieb
  const kctx = await browser.newContext({ ...telefon }), kp = await neueSeite(kctx, BASE2);
  await kp.goto(l1.url, { waitUntil: 'networkidle' }); await kp.waitForTimeout(700);
  ok(await kp.evaluate(() => SERVER.daten && !PILOT && S.linkStatus === 'gesendet') && (await kp.evaluate(() => document.body.innerText)).includes(firma) && await kp.locator('.fx-pilot').count() === 0, 'App im Servermodus: Link beim Server geprüft, Betrieb angezeigt, kein Pilot-Hinweis');
  const st1 = await api('/api/link/' + l1.code);
  ok(st1.ok && st1.status === 'geoeffnet' && st1.betrieb === firma && st1.kunde === 'Familie Server', 'Server weiß, dass der Kunde den Link geöffnet hat');
  await kp.evaluate((code) => { localStorage.setItem('aufmass.k.' + code, JSON.stringify({ windows: demoProject(), proj: {}, name: '' })); }, l1.code);
  await kp.reload({ waitUntil: 'networkidle' }); await kp.waitForTimeout(500);
  await kp.click('.bb .btn.primary'); await kp.waitForSelector('[data-screen="anfrage"]'); await kp.click('.bb .btn.primary'); await kp.waitForSelector('[data-screen="anfrage2"]'); await kp.click('.bb .btn.primary'); await kp.waitForSelector('[data-screen="blatt"]');
  ok(/mit allen Maßen und Wünschen, dazu die Auswertung der Fotos/.test(await kp.evaluate(() => document.body.innerText)), 'Prüfen-Seite verspricht Maße, Wünsche und Fotoauswertung');
  await kp.click('.bb .btn.primary'); await kp.waitForSelector('[data-screen="gesendet"]'); await kp.waitForTimeout(500);
  const ges = await kp.evaluate(() => ({ txt: document.body.innerText, sent: S.sent, code: !!document.getElementById('code-box'), feier: (function () { const e = document.querySelector('.okmark-l[data-lottie="fertig"]'); return e && e._lottie && e.querySelector('svg') && e._lottie.currentFrame > 0 ? 1 : 0; })() }));
  ok(/Gesendet\./.test(ges.txt) && !/Jetzt abschicken/.test(ges.txt) && !/Nur im Prototyp/.test(ges.txt) && ges.sent && ges.sent.uebertragen === true && !ges.code && ges.feier === 1, 'Aufmaß direkt übertragen: „Gesendet“, kein Code-Umweg, kein Prototyp-Hinweis, gefeiert');
  await foto(kp, 'srv-app-gesendet');
  const o1 = await kp.evaluate((code) => unpackProject(packProject(S.windows, S.proj, { code: code })), l1.code);
  const dopp = await api('/api/aufmass', o1);
  ok(dopp._status === 409 && /schon/.test(dopp.fehler || ''), 'Dasselbe Aufmaß ein zweites Mal wird abgewiesen (409)');
  sauber(kp, 'Kundenablauf im Servermodus ohne Fehler');

  // Betrieb: Aufmaß da, als 1 von 3 kostenlos gebucht, Meldung vom Server
  await page.goto(BASE2 + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
  const ein1 = await page.evaluate((id) => { const l = A().links.find((x) => x.id === id); const b = ledger(A()).find((x) => x.kind === 'aufmass' && x.ref === id); return { online: Server.online(), status: l.status, locked: !!l.locked, n: l.aufmass ? l.aufmass.windows.length : 0, badge: b ? b.badge : '', betrag: b ? b.betrag : -1, frei: freeLeft(A()), notif: (notifs()[0] || {}).t || '' }; }, l1.id);
  ok(ein1.online && ein1.status === 'eingegangen' && !ein1.locked && ein1.n === 2 && ein1.betrag === 0 && /kostenlos, 1 von 3/.test(ein1.badge) && ein1.frei === 2, 'Betrieb nach dem Neuladen: Aufmaß eingegangen, als 1 von 3 kostenlos gebucht');
  ok(/Aufmaß eingegangen: Familie Server/.test(ein1.notif), 'Meldung „Aufmaß eingegangen“ kommt vom Server');
  await tun('go', 'link', l1.id); await page.waitForTimeout(400);
  ok(await page.locator('.lockcard').count() === 0 && /Bestellmaß/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('[data-act="pdf-am"]').count() === 1, 'Freies Aufmaß ist mit Maßen und PDF sichtbar');
  await foto(page, 'srv-portal-eingang');

  // Kontingent: drei weitere Projekte; das vierte Aufmaß kommt an, bleibt aber gesperrt, und seine Maße verlassen den Server nicht
  const token = await page.evaluate(() => Server.sitzung.token), weitere = [];
  for (let i = 2; i <= 4; i++) { const r = await api('/api/konto/projekte', { kunde: 'Kunde ' + i, kontakt: '', plan: ['Fenster'], days: 14 }, token); const l = r.konto.acc.links.find((x) => x.id === r.id); weitere.push({ id: r.id, code: l.code, kunde: 'Kunde ' + i }); }
  const antworten = [];
  for (let i = 0; i < weitere.length; i++) {
    const o = JSON.parse(JSON.stringify(o1)); o.b = weitere[i].code; o.t = Date.now() + i;
    o.w.forEach((w, j) => { w.name = 'Raum ' + (i + 2) + '.' + (j + 1); const br = i === 2 ? 2222 : 1000 + 50 * i + 10 * j; w.mo.wm = br; w.mo.wt = br; w.mo.wb = br; w.el.w = br - 30; w.w = br - 30; });
    antworten.push(await api('/api/aufmass', o));
  }
  ok(antworten.every((r) => r.ok === true && r._status === 200), 'Drei weitere Aufmaße kommen an, der Kunde merkt von der Sperre nichts');
  await page.goto(BASE2 + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
  const sperre = await page.evaluate((id) => { const l = A().links.find((x) => x.id === id), am = l.aufmass || {}; return { frei: freeLeft(A()), gesperrt: lockedLinks(A()).map((x) => x.id), locked: !!l.locked, n: (am.windows || []).length, masse: (am.windows || []).some((w) => AW.num(w.w) || (w.mo && AW.num(w.mo.wm))), roh: JSON.stringify(A()) }; }, weitere[2].id);
  ok(sperre.frei === 0 && sperre.gesperrt.length === 1 && sperre.gesperrt[0] === weitere[2].id && sperre.locked && sperre.n === 2, 'Nach 3 freien Projekten: das vierte Aufmaß ist gesperrt (Positionen gezählt)');
  ok(!sperre.masse && !sperre.roh.includes('2222'), 'Gesperrte Maße verlassen den Server nicht (kein 2222 im Konto des Browsers)');
  await tun('go', 'link', weitere[2].id); await page.waitForTimeout(400);
  const lockTxt = await page.evaluate(() => document.body.textContent);
  ok(await page.locator('.lockcard').count() === 1 && /Zum Ansehen eine Zahlungsart hinterlegen/.test(lockTxt) && /9[\s\u00a0]€ netto/.test(lockTxt) && !/2\.222/.test(lockTxt) && await page.locator('[data-act="pdf-am"]').count() === 0, 'Projektseite: Sperrkarte mit Preis, keine Maße, keine PDF');
  await foto(page, 'srv-portal-sperre');
  await tun('nav', 'abrechnung'); await page.waitForTimeout(400);
  ok(/wartet auf Zahlungsart/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('.lrow .badge.bad').count() === 1, 'Abrechnung zeigt das wartende Aufmaß');
  sauber(page, 'Kontingent und Sperre ohne Fehler');

  // Zahlungsart über Stripe (nachgestellt): hin und zurück, gesperrtes Aufmaß frei, 9 € gebucht
  await tun('sheet', 'pay'); await page.waitForSelector('[data-act="srv-zahlungsart"]');
  ok(/1 Aufmaß wartet auf Freischaltung/.test(await page.evaluate(() => document.querySelector('.sheet').textContent)) && await page.locator('#pay-iban').count() === 0, 'Zahlungsart-Blatt: Weg zu Stripe, keine IBAN im Browser');
  await page.click('[data-act="srv-zahlungsart"]');
  await page.waitForFunction(() => typeof Server !== 'undefined' && Server.online() && !!A().pay && S.screen === 'abrechnung', null, { timeout: 12000 }); await page.waitForTimeout(500);
  const pay = await page.evaluate((id) => { const b = ledger(A()).find((x) => x.kind === 'aufmass' && x.ref === id), l = A().links.find((x) => x.id === id); return { type: A().pay.type, gesperrt: lockedLinks(A()).length, betrag: b ? b.betrag : -1, badge: b ? b.badge : '', locked: !!l.locked, masse: l.aufmass.windows.some((w) => AW.num(w.mo && w.mo.wm) === 2222), url: location.search, toast: (document.getElementById('toast') || {}).textContent || '', notif: (notifs()[0] || {}).t || '' }; }, weitere[2].id);
  ok(pay.type === 'SEPA-Lastschrift' && pay.gesperrt === 0 && !pay.locked && pay.betrag === 9 && /nächste Rechnung/.test(pay.badge) && pay.url === '', 'Zurück von Stripe: Zahlungsart hinterlegt, Aufmaß freigeschaltet und mit 9 € gebucht, Adresse bereinigt');
  ok(pay.masse && /freigeschaltet/.test(pay.notif), 'Freigeschaltetes Aufmaß kommt jetzt mit Maßen, Meldung dazu');
  await foto(page, 'srv-portal-zahlungsart');
  // Abo 10 über Stripe (nachgestellt)
  await tun('konto', 'abo');
  await page.waitForFunction(() => typeof Server !== 'undefined' && Server.online() && X.konto(A()) === 'abo', null, { timeout: 12000 }); await page.waitForTimeout(500);
  const abo = await page.evaluate(() => ({ book: ledger(A()).find((b) => b.kind === 'abo'), stripe: Server.stripe, screen: S.screen, txt: document.body.textContent, frei: X.aboFrei(A()) }));
  ok(abo.book && abo.book.betrag === 49 && abo.stripe.abo === true && abo.screen === 'abrechnung' && /Abo 10 ist für/.test(abo.txt) && abo.frei === 10, 'Abo 10 aktiv: 49 € gebucht, Abo bei Stripe, 10 Projekte inklusive');
  // Code vom Kunden einfügen (Eigen-Kunde) im Abo: inklusive
  const eigenCode = await page.evaluate((s) => { const w = [{ name: 'Küche', w: 1230, h: 1410, el: { w: 1230, h: 1410 }, mo: { hm: 1440, hl: 1440, hr: 1440, wm: 1260, wt: 1260, wb: 1260 }, fotos: 2 }]; const o = { v: 1, b: '', w: w, p: { ort: '50823 Köln', gebaeude: 'efh', budget: 'b2', zeit: '3m', name: 'Lisa Berger', tel: '0221 ' + s }, t: Date.now() }; return 'AM1.' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }, String(Date.now()).slice(-6));
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', eigenCode); await tun('linkimport');
  await page.waitForFunction(() => A().links.some((l) => l.kunde === 'Lisa Berger'), null, { timeout: 8000 }); await page.waitForTimeout(400);
  const imp = await page.evaluate(() => { const l = A().links.find((x) => x.kunde === 'Lisa Berger'), b = ledger(A()).find((x) => x.kind === 'aufmass' && x.ref === l.id); return { status: l.status, locked: !!l.locked, badge: b ? b.badge : '', betrag: b ? b.betrag : -1, screen: S.screen, toast: (document.getElementById('toast') || {}).textContent || '' }; });
  ok(imp.status === 'eingegangen' && !imp.locked && imp.betrag === 0 && /inklusive \(Abo, 1 von 10\)/.test(imp.badge) && imp.screen === 'link' && /Aufmaß übernommen: Lisa Berger/.test(imp.toast), 'Code eines Eigen-Kunden auf dem Server übernommen, im Abo inklusive');
  await tun('sheet', 'linkimport'); await page.waitForSelector('#code-in'); await page.fill('#code-in', eigenCode); await tun('linkimport'); await page.waitForTimeout(600);
  ok(/schon da/.test(await toastText()), 'Derselbe Code noch einmal: schon da, nichts doppelt');
  await page.evaluate(() => { S.sheet = null; render(); });
  // Wechsel nach unten vorgemerkt, nach oben sofort (Abo bei Stripe wird umgestellt, nur der Aufpreis gebucht)
  await tun('konto', 'service'); await page.waitForFunction(() => !!A().downgrade, null, { timeout: 8000 });
  ok(await page.evaluate(() => A().downgrade.to === 'service' && X.konto(A()) === 'abo') && /Vorgemerkt/.test(await toastText()), 'Wechsel zu Start ist zum Monatsende vorgemerkt, Abo läuft weiter');
  await tun('konto', 'plus'); await page.waitForFunction(() => X.konto(A()) === 'plus', null, { timeout: 8000 }); await page.waitForTimeout(300);
  const plus = await page.evaluate(() => ({ down: A().downgrade, auf: ledger(A()).find((b) => b.kind === 'plus') }));
  ok(!plus.down && plus.auf && plus.auf.betrag === 30 && /Aufpreis/.test(plus.auf.text), 'Plus sofort aktiv, nur der Aufpreis von 30 € gebucht');
  await foto(page, 'srv-portal-abrechnung');
  sauber(page, 'Zahlungsart, Abo und Import ohne Fehler');
  // Abmelden und wieder anmelden: Konto kommt vom Server
  await tun('logout'); await page.waitForTimeout(400);
  ok(await page.evaluate(() => !Server.online() && !S.role && !localStorage.getItem('aufmass.sitzung') && !S.acc.srv), 'Abgemeldet: Sitzung und Konto aus dem Browser entfernt');
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  await tun('sheet', 'login'); await page.waitForSelector('#lg-mail'); await page.fill('#lg-mail', mail); await page.click('form[data-form="srvlogin"] button[type="submit"]'); await page.waitForSelector('#lg-code');
  await page.fill('#lg-code', '123456'); await page.click('form[data-form="srvlogin"] button[type="submit"]');
  await page.waitForFunction(() => Server.online(), null, { timeout: 8000 }); await page.waitForTimeout(400);
  ok(await page.evaluate((f) => BC().name === f && X.konto(A()) === 'plus' && A().links.length === 5 && !!A().pay, firma), 'Wieder angemeldet: Betrieb, Tarif, 5 Projekte und Zahlungsart kommen vom Server');
  ok(/Willkommen zurück, Petra/.test(await toastText()), 'Begrüßung mit Namen');
  sauber(page, 'Ab- und Anmeldung ohne Fehler');
  await kctx.close(); await ctx.close();

  // Hauseigentümer kauft das Aufmaßblatt über die (nachgestellte) Kasse: Nachweis vom Server
  const kctx2 = await browser.newContext({ ...telefon, acceptDownloads: true }), kp2 = await neueSeite(kctx2, BASE2);
  await kp2.goto(BASE2 + '/app/', { waitUntil: 'networkidle' }); await kp2.waitForTimeout(400);
  await kp2.evaluate(() => { S.windows = demoProject(); Object.assign(S.proj, { name: 'Haus Prüf', ort: '50667 Köln' }); persist(); go('teilen'); }); await kp2.waitForTimeout(400);
  ok(await kp2.evaluate(() => SERVER.zahlung && SERVER.attrappe && PREIS() === 7.99 && !FREI()) && await kp2.locator('.dv-blur').count() === 1, 'App kennt die Kasse des Servers, Blatt ist noch gesperrt');
  await kp2.click('[data-act="k-start"]'); await kp2.waitForSelector('#k-mail'); await kp2.fill('#k-mail', 'kaeufer@beispiel.de'); await kp2.click('[data-in="kc"][data-f="agb"]'); await kp2.click('.bb .btn.primary'); await kp2.waitForTimeout(300);
  const kasse = await kp2.evaluate(() => document.body.innerText);
  ok(/Weiter zu Stripe · 7,99 €/.test(kasse) && /Zahlungsdienstleisters Stripe/.test(kasse) && /Testbetrieb/.test(kasse) && !/Testkauf/.test(kasse) && await kp2.locator('[data-act="k-pay"]').count() === 0, 'Kasse im Servermodus: Zahlung bei Stripe, keine Scheinauswahl, kein Testkauf');
  await kp2.click('.bb .btn.primary'); await kp2.waitForTimeout(200);
  ok(await kp2.evaluate(() => S.screen === 'kasse' && !(S.kauf && S.kauf.paid)) && await kp2.locator('.kerr').count() === 1, 'Ohne Widerrufs-Zustimmung keine Kasse');
  await kp2.click('[data-in="kc"][data-f="widerruf"]');
  await kp2.click('.bb .btn.primary');
  await kp2.waitForFunction(() => typeof S !== 'undefined' && S.screen === 'gekauft' && S.kauf && S.kauf.paid, null, { timeout: 12000 }); await kp2.waitForTimeout(500);
  const kauf = await kp2.evaluate(() => ({ token: S.kauf.token, session: S.kauf.session, kennung: S.kauf.kennung, test: !!S.kauf.test, url: location.search, txt: document.body.innerText, feier: (function () { const e = document.querySelector('.okmark-l[data-lottie="fertig"]'); return e && e._lottie && e.querySelector('svg') && e._lottie.currentFrame > 0 ? 1 : 0; })() }));
  ok(/Freigeschaltet\./.test(kauf.txt) && /^test_/.test(kauf.session || '') && (kauf.token || '').length === 32 && !kauf.test && kauf.url === '' && kauf.feier === 1, 'Zurück von der Kasse: freigeschaltet mit Nachweis vom Server, Adresse bereinigt');
  const nw = await api('/api/zahlung/nachweis?kennung=' + encodeURIComponent(kauf.kennung) + '&session=' + encodeURIComponent(kauf.session) + '&token=' + encodeURIComponent(kauf.token));
  const nwFalsch = await api('/api/zahlung/nachweis?kennung=' + encodeURIComponent(kauf.kennung) + '&session=' + encodeURIComponent(kauf.session) + '&token=' + encodeURIComponent('x'.repeat(32)));
  const unbez = await api('/api/zahlung/pruefen?session=' + encodeURIComponent('cs_offen_' + stempel) + '&kennung=' + encodeURIComponent(kauf.kennung));
  ok(nw.ok === true && nwFalsch.ok === false && unbez.bezahlt === false, 'Nachweis ist auf dem Server prüfbar; gefälschter Nachweis und unbezahlte Sitzung schalten nichts frei');
  await kp2.click('.bb .btn.primary'); await kp2.waitForTimeout(400);
  ok(await kp2.locator('#code-box').count() === 1 && /Dein Aufmaß, dein Blatt/.test(await kp2.evaluate(() => document.body.innerText)), 'Nach dem Kauf: Code und Datei da');
  const [dl8] = await Promise.all([kp2.waitForEvent('download', { timeout: 10000 }), kp2.click('[data-act="k-dl"]')]);
  ok(/\.pdf$/.test(dl8.suggestedFilename()), 'Gekaufte PDF lädt: ' + dl8.suggestedFilename());
  await foto(kp2, 'srv-app-gekauft');
  sauber(kp2, 'Kauf im Servermodus ohne Fehler');
  await kctx2.close();

  // Abrechnungslauf (Cron) mit Attrappen im selben Prozess: offene Projektbuchungen werden zur Sammelrechnung, nichts doppelt
  {
    const umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), stM = await import('../functions/api/stripe.js'), ko = await import('../functions/api/konten.js');
    const k = umg.konfig({ DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1' }); globalThis.Abrechnung.setPreise(k.preise);
    const sp = spM.speicher(k), zd = stM.zahlungsdienst(k);
    const row = await sp.betriebAnlegen({ auth_user: 'u-cron', mail: 'cron@beispiel.de', name: 'Cron GmbH', plz: '50667', tel_norm: '', name_norm: 'cron', daten: { konto: 'service', pay: { type: 'SEPA-Lastschrift', label: 'DE •••• 0000' }, links: [], book: [{ id: 'b1', kind: 'aufmass', ref: 'l1', when: 'heute', month: '2026-10', text: 'Aufmaß · Test', sub: '', betrag: 9, badge: 'nächste Rechnung', status: 'offen' }, { id: 'b0', kind: 'aufmass', ref: 'l0', when: 'gestern', month: '2026-10', text: 'Aufmaß · Frei', sub: '', betrag: 0, badge: 'kostenlos', status: 'offen' }], freeUsed: 3, rechnungen: [], notif: [] } });
    await sp.betriebFelder(row.id, { stripe_customer: 'cus_test_cron' });
    const r1 = await ko.abrechnungslauf(k, sp, zd), nach = await sp.betriebHolen(row.id);
    ok(r1.ok && r1.rechnungen === 1 && nach.daten.book.find((b) => b.id === 'b1').status === 'berechnet' && nach.daten.book.find((b) => b.id === 'b0').status === 'offen' && /^RE-TEST-/.test(nach.daten.rechnungen[0].nr) && nach.daten.rechnungen[0].betrag === 9 && /Sammelrechnung/.test(nach.daten.notif[0].t), 'Abrechnungslauf: offene 9-€-Buchung wird zur Sammelrechnung, kostenlose bleibt außen vor');
    const r2 = await ko.abrechnungslauf(k, sp, zd);
    ok(r2.rechnungen === 0, 'Zweiter Lauf berechnet nichts doppelt');
  }
  if (kind) kind.kill();
}

/* ---------- 9. Führung (Hauseigentümer) und Tour (Fensterbauer) statt Demo-Konten ---------- */
if (teil(9)) {
  console.log('9. Führung und Tour');
  // Startseite des Portals: Führung starten führt in die App, Tour für Fensterbauer statt Demo
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', acceptDownloads: true });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  ok(await page.locator('.hero.b2c a[href$="/app/#fuehrung"]').count() === 1 && await page.locator('#betriebe [data-act="tour"]').count() === 1, 'Startseite: „Führung starten“ für Hauseigentümer, „Tour starten“ für Fensterbauer');
  const ohneDemo = async (wo) => { const t = await page.evaluate(() => document.body.innerText); return !/\bDemo\b|Demo-Zugang|Beispieldaten|Beispiel-IBAN|Demo-Ansicht/.test(t) && await page.locator('[data-act="demo-as"], [data-act="reg-fill"], [data-act="pay-fill"], [data-act="l-sim"], [data-act="demo-project"], [data-act="demo"]').count() === 0 ? true : wo; };
  ok(await ohneDemo('Startseite') === true, 'Startseite ohne Demo-Konten und Beispiel-Registrierung');
  await page.click('.top [data-act="sheet"][data-v="login"]'); await page.waitForTimeout(300);
  ok(await ohneDemo('Anmelden') === true && await page.locator('.sheet [data-act="tour"]').count() === 1, 'Anmelden: keine Demo-Zugänge mehr, dafür der Weg in die Tour');
  await page.evaluate(() => { S.sheet = null; render(); });
  await page.click('.top [data-act="reg"]'); await page.waitForTimeout(300);
  ok(await ohneDemo('Registrieren') === true && await page.locator('.fillbtn').count() === 0, 'Registrieren ohne „Beispieldaten einsetzen“');
  // Tour für Fensterbauer: acht Schritte, je ein Fakt mit Quelle, Vorgegebenes gesperrt, nichts wird gespeichert
  await page.evaluate(() => { S.reg = null; nav('landing'); }); await page.waitForTimeout(300);
  const vorTour = await page.evaluate(() => JSON.stringify({ acc: S.acc, logins: S.logins }));
  await page.click('#betriebe [data-act="tour"]'); await page.waitForSelector('.tourw'); await page.waitForTimeout(300);
  const ids = [];
  for (let i = 0; i < 8; i++) {
    const st = await page.evaluate(() => ({ id: TOUR[S.tour.i], fakt: !!document.querySelector('.tour-fakt .tf-q'), merk: document.querySelectorAll('.tour-merk li').length, schritte: document.querySelectorAll('.tour-schritte button').length }));
    ids.push(st.id + (st.fakt && st.merk >= 2 && st.schritte === 8 ? '' : '!'));
    if (st.id === 'misst') await page.waitForTimeout(5500);
    if (i < 7) { await page.click('.tour-nav .btn.primary'); await page.waitForTimeout(250); }
  }
  ok(ids.join(',') === 'projekt,link,misst,eingang,bestell,nachbes,code,start', 'Tour: acht Schritte, jeder mit Fakt und Quelle (' + ids.join(',') + ')');
  ok(await page.locator('.tour-nav [data-act="reg"]').count() === 1 && /3 Projekte kostenlos/.test(await page.evaluate(() => document.body.innerText)), 'Letzter Schritt: Preise und „Kostenlos starten“');
  await page.click('.tour-schritte [data-v="0"]'); await page.waitForTimeout(250);
  ok(await page.locator('.tf-feld.gesperrt').count() === 3 && await page.locator('.chip.gesperrt[aria-disabled="true"]').count() >= 2, 'Schritt 1: Kundendaten vorgegeben, mit Schloss');
  await page.click('.chip.gesperrt', { force: true }); await page.waitForTimeout(200);
  ok(/In der Tour vorgegeben/.test(await page.evaluate(() => (document.getElementById('toast') || {}).textContent || '')), 'Gesperrtes erklärt sich beim Antippen');
  await page.click('[data-act="tour-du"][data-v="du"]'); await page.click('.tour-schritte [data-v="1"]'); await page.waitForTimeout(250);
  ok(/Hallo Familie Weber, für euer Fensterangebot/.test(await page.evaluate(() => document.querySelector('.bub.out').textContent)), 'Anrede Du ändert die Nachricht im Telefon');
  await page.click('.tour-schritte [data-v="4"]'); await page.waitForTimeout(250);
  await page.click('[data-act="tour-abzug"][data-v="20"]'); await page.waitForTimeout(200);
  ok(/1\.219 × 1\.419 mm/.test(await page.evaluate(() => document.querySelector('.tbm').textContent)), 'Abzug 20 mm rechnet das Bestellmaß neu');
  const [dlB] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('[data-act="tour-pdf"]')]);
  let txtB = ''; try { txtB = (await import('node:child_process')).execFileSync('pdftotext', ['-layout', await dlB.path(), '-']).toString('utf8'); } catch (e) { txtB = ''; }
  ok(/Beispiel/.test(dlB.suggestedFilename()) && /AM-BEISPIEL/.test(txtB) && /BESTELLMASS-VORSCHLAG/.test(txtB) && /Fensterbau Brandt/.test(txtB), 'Beispiel-PDF für Betriebe: mit Bestellmaß, gekennzeichnet als Beispiel');
  await page.click('.tour-schritte [data-v="5"]'); await page.click('[data-act="tour-nb"]'); await page.waitForTimeout(200);
  await page.click('.tour-schritte [data-v="6"]'); await page.click('[data-act="tour-code"]'); await page.waitForTimeout(200);
  ok(await page.locator('.tour-ergebnis').count() === 1, 'Code übernehmen zeigt das neue Projekt');
  await page.click('.tour-kopf [data-act="tour-ende"]'); await page.waitForTimeout(300);
  ok(await page.evaluate((v) => S.screen === 'landing' && !S.tour && !S.role && JSON.stringify({ acc: S.acc, logins: S.logins }) === v, vorTour), 'Tour beenden: zurück zur Startseite, kein Konto, nichts gespeichert');
  // Frühere Demo-Sitzung: Konten verschwinden, die Anmeldung endet; eigene Betriebe bleiben
  await page.evaluate(() => { localStorage.setItem('aufmass.portal.v1', JSON.stringify({ v: 5, role: 'betrieb', cur: 'c1', screen: 'links', hist: [], acc: { c1: { links: [], book: [] }, c7: { links: [] }, u1: { links: [], book: [], ap: 'Eva Eigen', mail: 'eva@beispiel.de' } }, myCompanies: [{ id: 'u1', name: 'Eigenbau Eva', plz: '50667', col: '#0071e3' }], logins: { 'info@fensterbau-brandt.de': { role: 'betrieb', id: 'c1' }, 'eva@beispiel.de': { role: 'betrieb', id: 'u1' } }, notif: { c1: [], u1: [] } })); });
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  ok(await page.evaluate(() => !S.role && S.screen === 'landing' && !S.acc.c1 && !S.acc.c7 && !!S.acc.u1 && !S.logins['info@fensterbau-brandt.de'] && !!S.logins['eva@beispiel.de']), 'Alte Demo-Sitzung: abgemeldet, Demo-Konten entfernt, eigener Betrieb bleibt');
  sauber(page, 'Tour für Fensterbauer ohne Fehler');
  await ctx.close();

  // Führung in der App: gesperrte Optionen, Fakten, Beispiel-PDF, eigenes Projekt bleibt unberührt
  const ctx2 = await browser.newContext({ ...telefon, acceptDownloads: true });
  const ap = await neueSeite(ctx2);
  await ap.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await ap.evaluate(() => { S.windows = demoProject().slice(0, 1); persist(); render(true); });
  const vorher = await ap.evaluate(() => localStorage.getItem('aufmass.v1'));
  ok(await ap.locator('.hero [data-act="tour-start"]').count() === 1, 'App-Startseite: „Führung starten“ neben „Fenster ausmessen“');
  await ap.click('.hero [data-act="tour-start"]'); await ap.waitForSelector('.scr[data-screen="tour"]');
  const schritte = [];
  for (let i = 0; i < 9; i++) {
    const st = await ap.evaluate(() => ({ id: TOUR[S.tour.i], fakt: !!document.querySelector('.tour-fakt .tf-q'), gesperrt: document.querySelectorAll('.gesperrt[aria-disabled="true"], .farbfeld.gesperrt').length }));
    schritte.push(st);
    if (st.id === 'fotos') await ap.waitForTimeout(1900);
    if (i < 8) { await ap.click('.bb .btn.primary'); await ap.waitForTimeout(350); }
  }
  ok(schritte.map((x) => x.id).join(',') === 'start,fotos,messen,oeffnung,material,farbe,glas,sonne,blatt' && schritte.every((x) => x.fakt), 'Führung: neun Schritte, in jedem ein Fakt mit Quelle');
  ok(['start', 'oeffnung', 'material', 'farbe', 'glas', 'sonne'].every((id) => schritte.find((x) => x.id === id).gesperrt > 0), 'Führung: einige Optionen tragen ein Schloss (Element, Öffnung, Material, Farbe, Glas, Sonnenschutz)');
  ok(/An beliebig viele Fensterbauer/.test(await ap.evaluate(() => document.body.innerText)) && await ap.locator('.tb .tb-weg li').count() === 5, 'Am Ende: Vorschau des Aufmaßblatts und „An beliebig viele Fensterbauer“');
  const [dlA] = await Promise.all([ap.waitForEvent('download', { timeout: 10000 }), ap.click('[data-act="tour-pdf"]')]);
  let txtA = ''; try { txtA = (await import('node:child_process')).execFileSync('pdftotext', ['-layout', await dlA.path(), '-']).toString('utf8'); } catch (e) { txtA = ''; }
  ok(/AM-BEISPIEL/.test(txtA) && /BEISPIEL/.test(txtA) && !/AM1\./.test(txtA) && /DEIN WEG ZU NEUEN FENSTERN/.test(txtA), 'Beispiel-PDF der Führung: Wasserzeichen, ohne Aufmaß-Code, Seite 1 mit dem Weg');
  await ap.click('.hdr-btn[data-act="back"]'); await ap.waitForTimeout(300);
  ok(await ap.evaluate(() => !S.tour && S.screen === 'home' && S.windows.length === 1) && await ap.evaluate(() => localStorage.getItem('aufmass.v1')) === vorher, 'Führung beenden: eigenes Projekt unverändert');
  await ap.goto(BASE + '/app/#fuehrung', { waitUntil: 'networkidle' }); await ap.waitForTimeout(300);
  ok(await ap.evaluate(() => S.screen === 'tour' && TOUR[S.tour.i] === 'start'), '#fuehrung (von der Startseite) öffnet die Führung');
  await ap.click('[data-act="situation"][data-v="neu"]', { force: true }); await ap.waitForTimeout(150);
  ok(await ap.evaluate(() => !S.win.neu && /gesperrt/.test(S.toast)), 'Gesperrt antippen: Hinweis, keine Änderung');
  await ap.click('[data-act="tour-art"][data-v="fsw"]'); await ap.waitForTimeout(300);
  ok(await ap.evaluate(() => S.win.art === 'fsw' && derive(S.win).elW === 3600 && derive(S.win).complete), 'Element frei wählbar, Maße passend vorgegeben');
  sauber(ap, 'Führung ohne Fehler');
  await ctx2.close();

  // Aufmaßblatt: Seite 1 hält auch mit langer Nachricht und allen Kontaktdaten, eine Position bleibt beisammen
  const ctx3 = await browser.newContext({ ...telefon });
  const bp = await neueSeite(ctx3);
  await bp.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  const cp9 = await import('node:child_process'), fs9 = await import('node:fs'), os9 = await import('node:os'), path9 = await import('node:path');
  const blattDatei = async (name, extra, eins) => {
    const b64 = await bp.evaluate(async ([extra, eins]) => {
      S.windows = eins ? demoProject().slice(0, 1) : demoProject();
      S.proj = Object.assign({}, S.proj, { name: 'Familie Weber', ort: '50823 Köln', total: 11, foerd: true }, extra);
      await blattSchrift(); const blob = await blattPDF('kunde');
      const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s);
    }, [extra, eins]);
    const pfad = path9.join(os9.tmpdir(), 'eeziframes-pruefung-' + name + '.pdf'); fs9.writeFileSync(pfad, Buffer.from(b64, 'base64')); return pfad;
  };
  const seiteT = (pfad, n) => { try { return cp9.execFileSync('pdftotext', ['-layout', '-f', String(n), '-l', String(n), pfad, '-']).toString('utf8'); } catch (e) { return ''; } };
  const alleT = (pfad) => { try { return cp9.execFileSync('pdftotext', ['-layout', pfad, '-']).toString('utf8'); } catch (e) { return ''; } };
  /* Lage eines Wortes auf Seite 1 in pt von oben (pdftotext -bbox): tiefste Unterkante bzw. höchste Oberkante */
  const woerter = (pfad, wort) => { try { const html = cp9.execFileSync('pdftotext', ['-bbox', '-f', '1', '-l', '1', pfad, '-']).toString('utf8'); return [...html.matchAll(/<word xMin="[\d.]+" yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">([^<]*)<\/word>/g)].filter((x) => x[3] === wort).map((x) => [+x[1], +x[2]]); } catch (e) { return []; } };
  const zeichnungUeberFuss = (pfad) => { const leg = woerter(pfad, 'Hand'), fuss = woerter(pfad, 'Erstellt'); return leg.length > 0 && fuss.length > 0 && Math.max(...leg.map((x) => x[1])) < Math.min(...fuss.map((x) => x[0])) - 4; };
  const LANG = 'Bitte beachten: Der Rollladen im Bad klemmt seit dem Winter und lässt sich nur noch halb herunterlassen. Im Wohnzimmer zieht es unten links, vermutlich ist die Dichtung porös. Wir möchten gern Angebote für beide Fenster, am liebsten mit elektrischem Rollladen, und eine Einschätzung, ob sich ein Austausch der Fensterbänke lohnt. Parken bitte in der Einfahrt, der Hund ist freundlich.';
  const pLang = await blattDatei('lang', { notiz: LANG, tel: '0171 2345678', mail: 'familie.weber-schmidt@beispiel-mail.de', erreich: 'ab' }, false);
  const l1 = seiteT(pLang, 1), lRest = alleT(pLang).split(l1).join('');
  ok(/MAUERÖFFNUNG/.test(l1) && /vollständig nach Pos\. 1/.test(l1) && !/Hund ist freundlich/.test(l1) && /Hund ist freundlich/.test(lRest) && /Deine Nachricht/.test(lRest), 'Aufmaßblatt, lange Nachricht: auf Seite 1 dreizeilig, danach vollständig; Position 1 bleibt auf Seite 1');
  ok(zeichnungUeberFuss(pLang), 'Aufmaßblatt, lange Nachricht und alle Kontaktdaten: die Zeichnung auf Seite 1 endet über dem Fuß');
  const pVoll = await blattDatei('voll', { notiz: 'Rollladen im Bad klemmt.', tel: '0171 2345678', mail: 'weber@beispiel.de', erreich: 'ab', baujahr: '1965' }, false);
  ok(zeichnungUeberFuss(pVoll) && !/vollständig nach Pos/.test(alleT(pVoll)), 'Aufmaßblatt mit allen Kontaktdaten und kurzer Nachricht: Seite 1 passt, Nachricht ungekürzt');
  const pZwei = await blattDatei('zwei', {}, false);
  ok(!/fortsetzung/i.test(alleT(pZwei)) && /Bad/.test(seiteT(pZwei, 3)) && /EINBAUSITUATION AUS DEN FOTOS/.test(seiteT(pZwei, 3)) && /Vor Ort prüfen/.test(seiteT(pZwei, 3)), 'Aufmaßblatt: Position 2 steht samt Fotoauswertung auf einer Seite (Zeichnung etwas kleiner statt Rest auf neuer Seite)');
  sauber(bp, 'Aufmaßblatt-Prüfung ohne Fehler');
  await ctx3.close();
}

/* ---------- 10. Auffindbarkeit: Suchmaschinen und KI-Assistenten (docs/SEO.md) ---------- */
if (teil(10)) {
  console.log('10. Auffindbarkeit (Suchmaschinen und KI-Assistenten)');
  const seo = await import(new URL('../functions/seo.js', import.meta.url).href);
  const fs10 = await import('node:fs'), path10 = await import('node:path'), url10 = await import('node:url'), cp10 = await import('node:child_process');
  const WURZEL = path10.join(path10.dirname(url10.fileURLToPath(import.meta.url)), '..');
  const roh = async (p, base) => { const r = await fetch((base || BASE) + p, { redirect: 'manual' }); return { status: r.status, h: r.headers, text: await r.text() }; };
  const ldjson = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch (e) { return null; } });
  const eur = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €';

  /* a) Jede Seite der Sitemap ohne JavaScript: ein h1, Titel, Beschreibung, strukturierte Daten; Pilotphase per Kopfzeile */
  const intern = new Set();
  for (const s of seo.SEITEN) {
    const r = await roh(s.pfad);
    const titel = (r.text.match(/<title>([^<]*)<\/title>/) || [])[1] || '', beschr = (r.text.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    const rechts = s.pfad === '/impressum/' || s.pfad === '/datenschutz/', ld = ldjson(r.text);
    ok(r.status === 200 && (r.text.match(/<h1[\s>]/g) || []).length === 1 && /eeziframes/.test(titel) && titel.length <= 75 && (rechts || (beschr.length >= 70 && beschr.length <= 170)), s.pfad + ': ohne JavaScript genau ein h1, Titel mit Marke (' + titel.length + ' Zeichen)' + (rechts ? '' : ', Beschreibung (' + beschr.length + ' Zeichen)'));
    ok(!/<meta name="robots"/.test(r.text) && r.h.get('x-robots-tag') === seo.SPERRE && !!r.h.get('content-security-policy') && r.h.get('link') === '<' + BASE + s.pfad + '>; rel="canonical"', s.pfad + ': Pilotphase per Kopfzeile noindex (kein Meta-Tag), CSP und Canonical vom Worker');
    if (!rechts) ok(ld.length > 0 && ld.every((x) => x && x['@context'] === 'https://schema.org') && !/"(url|@id|item|mainEntityOfPage|logo)":"\//.test(r.text) && (r.text.match(/<meta property="og:image" content="([^"]*)"/) || [])[1] === BASE + '/og.png', s.pfad + ': strukturierte Daten (JSON-LD) lesbar, Adressen darin und im Vorschaubild absolut');
    for (const m of r.text.matchAll(/href="(\/[^"#]*)/g)) intern.add(m[1]);
  }
  const tot = [];
  for (const p of intern) { const r = await fetch(BASE + p, { redirect: 'manual' }); if (r.status !== 200) tot.push(p + ' (' + r.status + ')'); }
  ok(tot.length === 0, 'Alle internen Links und Dateien der Seiten erreichbar (' + intern.size + ')' + (tot.length ? ': ' + tot.join(', ') : ''));

  /* b) Startseite und App: Textfassung für Leser ohne JavaScript, mit JavaScript übernimmt die App */
  const start = await roh('/'), app = await roh('/app/');
  ok(/<div class="vorab">/.test(start.text) && /<h1>Fenster ausmessen\. Selbst\. eezi\.<\/h1>/.test(start.text) && /Aufmaß-App für Fenster/.test(start.text) && /auf einen Blick/.test(start.text), 'Startseite ohne JavaScript: Textfassung mit h1, Erklärung und Fakten');
  ok(/<div class="vorab">/.test(app.text) && /<h1>Fenster ausmessen: kostenlose Aufmaß-App im Browser<\/h1>/.test(app.text), 'App ohne JavaScript: Textfassung mit h1');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  ok(await page.locator('.vorab').count() === 0 && await page.locator('h1').count() === 1 && /Fenster ausmessen\. Selbst\. eezi\./.test(await page.locator('h1').first().textContent()), 'Startseite mit JavaScript: App statt Textfassung, genau ein h1 (im Hero)');
  const fuss = await page.$$eval('footer a', (as) => as.map((a) => a.getAttribute('href')));
  ok(fuss.includes('/ratgeber/') && fuss.includes('/fuer-fensterbauer/'), 'Fußzeile der Startseite verlinkt Ratgeber und die Seite für Fensterbauer');
  await page.goto(BASE + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
  await page.click('.rg-cta a[href="/#tour"]'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(600);
  const tour1 = await page.evaluate(() => S.screen === 'tour' && location.hash === '');
  await page.evaluate(() => { tourEnde(); location.hash = 'tour'; }); await page.waitForTimeout(400);
  ok(tour1 && await page.evaluate(() => S.screen === 'tour' && location.hash === ''), 'Link „Tour“ auf der Seite für Fensterbauer öffnet die Tour (/#tour), auch als Sprungmarke auf der Startseite');
  await page.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  ok(await page.locator('.vorab').count() === 0 && await page.locator('a[href$="/ratgeber/fenster-ausmessen/"]').count() >= 1 && await page.locator('a[href$="/fuer-fensterbauer/"]').count() >= 1, 'App mit JavaScript: Textfassung weg, Anleitung und Seite für Fensterbauer verlinkt');
  sauber(page, 'Startseite und App mit Textfassung ohne Fehler');
  await ctx.close();
  const nojs = await browser.newContext(Object.assign({}, telefon, { javaScriptEnabled: false })), np = await nojs.newPage();
  for (const p of ['/', '/app/']) { await np.goto(BASE + p, { waitUntil: 'load' }); ok(await np.locator('.vorab h1').isVisible() && await np.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), p + ' ohne JavaScript (Telefon): Textfassung sichtbar, kein Querscrollen'); }
  await nojs.close();

  /* c) Ratgeber und Seite für Fensterbauer im Browser: Schriftrollen, Zielflächen, Marke, kein Querscrollen */
  for (const [gname, opts] of [['Telefon', telefon], ['Desktop', { viewport: { width: 1280, height: 860 }, locale: 'de-DE' }]]) {
    const c = await browser.newContext(opts), sp = await neueSeite(c);
    for (const s of seo.SEITEN.filter((x) => /^\/(ratgeber|fuer-fensterbauer)\//.test(x.pfad))) {
      await sp.goto(BASE + s.pfad, { waitUntil: 'networkidle' });
      const m = await sp.evaluate(() => {
        const groessen = new Set(), klein = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (el.closest('script, style')) continue; groessen.add(parseFloat(getComputedStyle(el).fontSize)); }
        document.querySelectorAll('.rg-kopf a, .rg-fuss a, .rg-cta a, .rg-karte, .rg-frage summary').forEach((a) => { const r = a.getBoundingClientRect(); if (r.width && r.height && (r.height < 44 || r.width < 44)) klein.push((a.textContent || '').trim().slice(0, 24) + ' ' + Math.round(r.width) + '×' + Math.round(r.height)); });
        const t = document.body.innerText;
        return { groessen: [...groessen].sort((a, b) => a - b), klein, quer: document.documentElement.scrollWidth > innerWidth + 1, marke: !/EEZI/.test(t) && !/Lichtma|Fenstero|Zamma|Klopfan|Fensterino/i.test(t) && !!document.querySelector('.rg-kopf .wm') };
      });
      const erlaubt = gname === 'Telefon' ? [13, 15, 17, 24, 32] : [13, 15, 17, 24, 40];
      ok(m.groessen.every((g) => erlaubt.includes(g)) && !m.klein.length && !m.quer && m.marke, gname + ' ' + s.pfad + ': Schriftgrößen ' + m.groessen.join('/') + ', Ziele ab 44 px, Marke klein' + (m.klein.length ? ' (zu klein: ' + m.klein.join('; ') + ')' : '') + (m.quer ? ', Querscrollen!' : ''));
    }
    sauber(sp, gname + ': Ratgeber und Seite für Fensterbauer ohne Fehler, ohne CSP-Verstöße, ohne fremde Server');
    await c.close();
  }

  /* d) Pilotphase: alles gesperrt */
  const rb1 = await roh('/robots.txt'), sm1 = await roh('/sitemap.xml'), ll1 = await roh('/llms.txt');
  ok(/User-agent: \*\nDisallow: \/\n/.test(rb1.text) && sm1.status === 404 && ll1.status === 200 && ll1.h.get('x-robots-tag') === seo.SPERRE, 'Pilotphase: robots.txt sperrt alles, keine Sitemap, llms.txt mit noindex');

  /* e) Freigabe: dritter Testserver mit INDEXIERUNG=1 und KANONISCH */
  const port = 8890 + Math.floor(Math.random() * 100), B3 = 'http://localhost:' + port, KAN = 'https://eeziframes.example';
  const kind = cp10.spawn(process.execPath, [path10.join(WURZEL, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1', INDEXIERUNG: '1', KANONISCH: KAN }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind.stderr.on('data', (d) => process.stderr.write('  [Server 3] ' + d));
  const aus = () => { try { kind.kill(); } catch (e) { /* schon weg */ } };
  process.on('exit', aus);
  let bereit = false;
  for (let i = 0; i < 60 && !bereit; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit = (await fetch(B3 + '/robots.txt')).ok; } catch (e) { /* noch nicht */ } }
  ok(bereit, 'Testserver mit Freigabe (INDEXIERUNG=1, KANONISCH) läuft: ' + B3);
  const rb = await roh('/robots.txt', B3), sm = await roh('/sitemap.xml', B3), ll = await roh('/llms.txt', B3);
  ok(/User-agent: \*\nAllow: \/\nDisallow: \/api\//.test(rb.text) && rb.text.includes('Sitemap: ' + KAN + '/sitemap.xml') && ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'].every((b) => rb.text.includes('User-agent: ' + b + '\n')), 'Freigabe: robots.txt erlaubt alles außer /api/, nennt die KI-Suchen und die Sitemap');
  ok(sm.status === 200 && seo.SEITEN.every((s) => sm.text.includes('<loc>' + KAN + s.pfad + '</loc>')) && (sm.text.match(/<url>/g) || []).length === seo.SEITEN.length, 'Freigabe: sitemap.xml mit allen ' + seo.SEITEN.length + ' Seiten und absoluten Adressen');
  ok(ll.status === 200 && ll.text.startsWith('# eeziframes\n\n> ') && ll.text.includes('(' + KAN + '/ratgeber/fenster-ausmessen/)') && ll.text.includes(eur(7.99)) && !ll.h.get('x-robots-tag'), 'Freigabe: llms.txt mit Kurzfassung, Preisen und absoluten Links');
  const fehlt = [];
  for (const s of seo.SEITEN) { const r = await fetch(B3 + s.pfad); if (r.headers.get('x-robots-tag') || r.headers.get('link') !== '<' + KAN + s.pfad + '>; rel="canonical"' || !r.headers.get('content-security-policy')) fehlt.push(s.pfad); }
  ok(!fehlt.length, 'Freigabe: alle Seiten ohne noindex, mit CSP und Canonical auf die Hauptadresse' + (fehlt.length ? ' (fehlt: ' + fehlt.join(', ') + ')' : ''));
  const fb3 = await roh('/fuer-fensterbauer/', B3);
  ok(fb3.text.includes('<meta property="og:image" content="' + KAN + '/og.png">') && fb3.text.includes('"url":"' + KAN + '/fuer-fensterbauer/"'), 'Freigabe: Vorschaubild und strukturierte Daten zeigen auf die Hauptadresse');
  const js3 = await fetch(B3 + '/assets/app.js'), logo3 = await fetch(B3 + '/apple-touch-icon.png'), weg3 = await fetch(B3 + '/ratgeber/gibtsnicht/');
  ok(js3.headers.get('x-robots-tag') === seo.SPERRE && !logo3.headers.get('x-robots-tag') && weg3.status === 404, 'Freigabe: Skripte bleiben noindex, das Logo darf in die Suche, Unbekanntes bleibt 404');
  aus();

  /* f) Gleichstand: Kopfzeilen, Sitemap, Worker-Routen, Preise */
  const block = fs10.readFileSync(path10.join(WURZEL, 'web/_headers'), 'utf8').split(/\n(?=\S)/).find((b) => b.startsWith('/*\n')) || '';
  const ausDatei = Object.fromEntries(block.split('\n').slice(1).map((z) => z.trim()).filter((z) => z && z.includes(':')).map((z) => [z.slice(0, z.indexOf(':')).trim(), z.slice(z.indexOf(':') + 1).trim()]));
  ok(ausDatei['X-Robots-Tag'] === seo.SPERRE && Object.entries(seo.SICHERHEIT).every(([k, v]) => ausDatei[k] === v) && Object.keys(ausDatei).every((k) => k === 'X-Robots-Tag' || k in seo.SICHERHEIT), 'Kopfzeilen in functions/seo.js und web/_headers stimmen überein');
  const dateien = [], such = (d, rel) => { for (const e of fs10.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) such(path10.join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') dateien.push(rel); } };
  such(path10.join(WURZEL, 'web'), '/');
  ok(dateien.length === seo.SEITEN.length && dateien.every((p) => seo.SEITEN.some((s) => s.pfad === p)), 'Sitemap kennt jede Seite in web/ (' + dateien.length + ')');
  const routen = JSON.parse((fs10.readFileSync(path10.join(WURZEL, 'wrangler.jsonc'), 'utf8').match(/"run_worker_first":\s*(\[[^\]]*\])/) || [])[1] || '[]');
  const passt = (r, p) => (r.endsWith('*') ? p.startsWith(r.slice(0, -1)) : p === r);
  ok(seo.SEITEN.every((s) => seo.istSeite(s.pfad) && routen.some((r) => passt(r, s.pfad))) && ['/robots.txt', '/sitemap.xml', '/llms.txt'].every((p) => routen.includes(p)), 'Worker übernimmt alle Seiten, robots.txt, sitemap.xml und llms.txt (run_worker_first in wrangler.jsonc)');
  const og = fs10.readFileSync(path10.join(WURZEL, 'web/og.png'));
  ok(og.readUInt32BE(16) === 1200 && og.readUInt32BE(20) === 630 && og.length < 200000, 'Vorschaubild zum Teilen: 1200 × 630, ' + Math.round(og.length / 1024) + ' KB');
  const konf = {}; new Function('window', fs10.readFileSync(path10.join(WURZEL, 'web/config.js'), 'utf8'))(konf);
  const pr = konf.KONFIG.preise, fb = (await roh('/fuer-fensterbauer/')).text, ab = (await roh('/ratgeber/aufmassblatt-fenster/')).text;
  ok([eur(pr.projekt) + ' netto', eur(pr.abo.grund) + ' im Monat', 'jedes weitere ' + eur(pr.abo.extra), eur(pr.plus) + ' im Monat', 'ersten ' + pr.frei + ' Projekte'].every((t) => fb.includes(t)) && [start.text, app.text, ab, fb].every((t) => t.includes(eur(pr.aufmass))), 'Preise auf den statischen Seiten wie in config.js (' + [pr.aufmass, pr.projekt, pr.abo.grund, pr.plus].map(eur).join(', ') + ')');
}

await browser.close();
console.log(fehlerZahl ? '\n' + fehlerZahl + ' Prüfung(en) fehlgeschlagen.' : '\nAlle Prüfungen bestanden.');
process.exit(fehlerZahl ? 1 : 0);

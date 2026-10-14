// Klopfan · automatische Prüfung im Browser (Chromium über Playwright)
//
//   1. Testserver starten:   KI_ATTRAPPE=1 node scripts/dev-server.mjs
//   2. Prüfung starten:      node scripts/pruefen.mjs
//      (braucht das Paket playwright-core; Ort per PW_PFAD=/pfad/zu/node_modules/.. angeben, falls nicht im Repo)
//
// Geprüft wird: alle Seiten laden ohne Fehler, ohne Verstoß gegen die Content-Security-Policy und ohne
// Anfragen an fremde Server; kein alter Name mehr; Pilot-Hinweis; Kundenlink von Portal zu App und zurück;
// ehrlicher Versand mit AM1-Code; kostenlose PDF-Datei; KI mit Einwilligung; ältere ZF1-, FE1- und LM1-Codes bleiben lesbar;
// Name und Logo (Hand, die anklopft) an den richtigen Stellen, kein Spruch mehr.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8788';
const BILDER = process.env.BILDER || '';
if (BILDER) mkdirSync(BILDER, { recursive: true });

let fehlerZahl = 0;
const ok = (bed, text) => { if (bed) console.log('  ✓ ' + text); else { fehlerZahl++; console.log('  ✗ ' + text); } };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

/* Neue Seite mit Wächtern: Konsolenfehler, Skriptfehler, CSP-Verstöße, fremde Anfragen */
async function neueSeite(ctx) {
  const page = await ctx.newPage();
  page.probleme = [];
  page.on('console', (m) => { if (/status of 404/.test(m.text()) && page.url().includes('/gibtsnicht')) return; if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) page.probleme.push('Konsole: ' + m.text()); });
  page.on('pageerror', (e) => page.probleme.push('Skriptfehler: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) page.probleme.push('Fremde Anfrage: ' + u); });
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/gibtsnicht')) page.probleme.push('HTTP ' + r.status() + ': ' + r.url()); });
  return page;
}
const sauber = (page, text) => { ok(page.probleme.length === 0, text + (page.probleme.length ? '\n      ' + page.probleme.join('\n      ') : '')); page.probleme.length = 0; };
const foto = async (page, name) => { if (BILDER) await page.screenshot({ path: BILDER + '/' + name + '.png' }); };
const b64u = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/* ---------- 1. Alle Seiten laden ---------- */
console.log('1. Seiten laden');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  for (const [pfad, titel] of [['/', 'Klopfan'], ['/app/', 'Klopfan'], ['/impressum/', 'Impressum'], ['/datenschutz/', 'Datenschutz'], ['/gibtsnicht', 'nicht gefunden']]) {
    const r = await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => document.body.innerText);
    ok((pfad === '/gibtsnicht' ? r.status() === 404 : r.status() === 200) && (await page.title()).includes(titel), pfad + ' lädt (' + r.status() + ', „' + (await page.title()) + '“)');
    ok(!/Lichtma|Fenstero|Zamma/.test(text) && !/claude\.ai/i.test(text), pfad + ': keine alten Namen, kein claude.ai');
    if (pfad !== '/gibtsnicht') ok(await page.locator('svg .kl-hand').count() > 0 && await page.locator('svg .kl-tuer').count() > 0, pfad + ': Logo mit klopfender Hand und Tür da');
    ok(!text.includes('wa zamm'), pfad + ': kein Spruch mehr');
    sauber(page, pfad + ': keine Fehler, keine CSP-Verstöße, keine fremden Server');
  }
  const font = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 16px "Maven Pro"'); });
  ok(font, 'Schrift Maven Pro lokal geladen');
  await ctx.close();
}

/* ---------- 2. Portal: Pilot-Hinweis, Rechtslinks, Telefonbreite ---------- */
console.log('2. Portal');
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  ok(await page.locator('.fx-pilot').isVisible(), 'Pilot-Hinweis sichtbar');
  await foto(page, 'portal-desktop');
  await page.click('.fx-pilot button');
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
console.log('3. App: messen und KI');
const telefon = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' };
{
  const ctx = await browser.newContext(telefon);
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const start = await page.evaluate(() => document.body.innerText);
  ok(/Erstes Fenster aufmessen/.test(start), 'Eigenes Projekt startet leer');
  ok(await page.locator('.foot-links.recht a[href="/impressum/"]').count() === 1, 'App-Start verlinkt Impressum');
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'App: kein seitliches Scrollen bei 390 px');
  await foto(page, 'app-start');

  // Testfoto als JPEG im Browser erzeugen
  const jpeg = Buffer.from(await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const g = c.getContext('2d'); g.fillStyle = '#e9e3da'; g.fillRect(0, 0, 900, 1200); g.fillStyle = '#ffffff'; g.fillRect(220, 200, 460, 760); g.fillStyle = '#a9c8e8'; g.fillRect(250, 230, 190, 700); g.fillRect(460, 230, 190, 700); return c.toDataURL('image/jpeg', 0.9).split(',')[1]; }), 'base64');

  await page.click('[data-act="new"]');
  await page.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
  const kiPosts = [];
  page.on('response', (r) => { if (r.url().includes('/api/ki?') && r.request().method() === 'POST') kiPosts.push(r.status()); });
  await page.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await page.waitForSelector('.fx-dialog', { timeout: 5000 });
  ok(true, 'Einwilligung wird vor dem Hochladen gefragt');
  ok(kiPosts.length === 0, 'Vor der Einwilligung geht nichts an die KI');
  await foto(page, 'app-einwilligung');
  await page.click('.fx-ja');
  await page.waitForFunction(() => S.ai.in && S.ai.in.status === 'done', null, { timeout: 15000 });
  ok(kiPosts.length === 2 && kiPosts.every((s) => s === 200), 'Zwei KI-Anfragen (Struktur, Fakten) erfolgreich: ' + kiPosts.join(', '));
  const ki = await page.evaluate(() => S.win.ki);
  ok(ki && ki.chips.includes('Testantwort') && ki.laib === 160, 'KI-Ergebnis im Fenster übernommen');
  await page.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: jpeg });
  await page.waitForFunction(() => S.ai.out && S.ai.out.status === 'done', null, { timeout: 15000 });
  ok(await page.locator('.fx-dialog').count() === 0 && kiPosts.length === 4, 'Zweites Foto ohne erneute Frage ausgewertet');
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
  sauber(page, 'Messablauf ohne Fehler');

  // Ablehnen: neue Sitzung fragt erneut, „Ohne KI“ schickt nichts
  const ctx2 = await browser.newContext(telefon);
  const p2 = await neueSeite(ctx2);
  await p2.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  const posts2 = [];
  p2.on('request', (r) => { if (r.url().includes('/api/ki?')) posts2.push(r.url()); });
  await p2.click('[data-act="new"]');
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
console.log('4. Kundenlink von Anfang bis Ende');
{
  const ctx = await browser.newContext({ ...telefon, acceptDownloads: true });
  const page = await neueSeite(ctx);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // Login als Demo-Betrieb über den vorgesehenen Knopf
  await page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-act', 'demo-as'); b.setAttribute('data-v', 'c1'); document.getElementById('app').appendChild(b); b.click(); });
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

  // kostenlose Datei
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 10000 }), page.click('.datei-card [data-act="k-dl"]')]);
  ok(/\.pdf$/.test(dl.suggestedFilename()), 'PDF wird kostenlos heruntergeladen: ' + dl.suggestedFilename());
  const pdfPfad = await dl.path();
  const kopf = (await import('node:fs')).readFileSync(pdfPfad).subarray(0, 5).toString();
  ok(kopf === '%PDF-', 'Datei ist ein echtes PDF');

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
  } else ok(false, 'Portal-PDF-Knopf gefunden');
  sauber(page, 'Portal-PDF ohne Fehler');
  await ctx.close();
}

/* ---------- 5. Rechtsseiten ---------- */
console.log('5. Rechtsseiten');
{
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

await browser.close();
console.log(fehlerZahl ? '\n' + fehlerZahl + ' Prüfung(en) fehlgeschlagen.' : '\nAlle Prüfungen bestanden.');
process.exit(fehlerZahl ? 1 : 0);

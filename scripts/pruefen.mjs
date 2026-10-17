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
// von Kopfzeilen, Sitemap, Worker-Routen und Preisen; www zählt als Hauptdomain, …workers.dev bleibt gesperrt.
// Abschnitt 11 prüft die Stripe-Anbindung gegen ein nachgestelltes Stripe (scripts/stripe-attrappe.mjs): Kassen, selbst angelegte Preise
// und Steuersätze, Webhook in beiden Formen der API, Sammelrechnung ohne leere oder doppelte Rechnungen, Fehler je Betrieb.
// Abschnitt 12 prüft die Supabase-Schlüssel (neue sb_secret_…/sb_publishable_… und frühere JWT) und die Hinweise in /api/status.
// Abschnitt 13 prüft die Zentrale des Inhabers: Zugang (Passwort, zweiter Faktor, Sitzungs-Cookie, Bremse), Betriebe mit Kennzahlen,
// Kunden der Betriebe nur als Projektnummer, Einblick mit Anlass, Sperren, Entsperren, Notiz, Nachricht, Gutschrift, Export, CSV,
// Löschen mit Nachweis, eigene Statistik ohne Cookies, Protokoll, Aufräumen; im Browser auf einem vierten Testserver samt Gestaltung.
// Abschnitt 14 prüft Fortsetzen, Paywall, Grenzen und den Zwischenstand beim Kundenlink, Abschnitt 15 das Konto für Hauseigentümer.
// Abschnitt 16 prüft das Erstaufmaß: „Weiß ich noch nicht“ statt Vorgabe, Absturzsicherung, Erreichbarkeit und Einbruchschutz, Lüftung,
// Förderweg mit Zielwerten, Balkon- und PSK-Tür, Kunststoff-Alu, KI-Fachangaben und Maße gegen das Foto, Gestaltung übernehmen,
// Klärungsliste in App, PDF, Betriebsbereich und Code; dazu die Gestaltung der neuen Schritte hell und dunkel.
// Abschnitt 17 prüft Rechtstexte, Widerruf, E-Mails des Servers und die Anmelde-E-Mails bei Supabase.
// Abschnitt 18 prüft die KI-Auswertung mit langsamer Antwort (eigener Testserver mit KI_VERZOEGERUNG_MS): Sie kommt auch an, wenn
// vorher gespeichert, ein weiteres Fenster angelegt oder gesendet wird, und zählt nicht als Änderung.
// Abschnitt 19 prüft die Fotos (functions/api/fotos.js): Ablage über den Kundenlink, beim Betrieb erst nach dem Senden und nicht
// gesperrt, Löschfristen und Aufräumen, Fotos im Konto des Hauseigentümers; im Browser auf einem eigenen Testserver: Fotos überstehen
// das Neuladen, Senden wartet auf sie, der Betriebsbereich zeigt sie (klein, groß, im PDF), ein zweites Gerät holt sie aus dem Konto.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8788';
const BILDER = process.env.BILDER || '';
const NUR = process.env.NUR ? process.env.NUR.split(',') : null; // z. B. NUR=8 für einen Abschnitt
const teil = (n) => !NUR || NUR.includes(String(n));
const RECHT = await import('../functions/api/recht.js'); // Stand der AGB und Nutzungsbedingungen, Wortlaut der Zustimmung an der Kasse
const KASSE = { agb: RECHT.AGB_STAND, zustimmung: RECHT.ZUSTIMMUNG };
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
  for (const [pfad, titel] of [['/', 'eeziframes'], ['/app/', 'eeziframes'], ['/impressum/', 'Impressum'], ['/datenschutz/', 'Datenschutz'], ['/zentrale/', 'Zentrale'], ['/gibtsnicht', 'nicht gefunden']]) {
    const r = await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => document.body.innerText);
    ok((pfad === '/gibtsnicht' ? r.status() === 404 : r.status() === 200) && (await page.title()).includes(titel), pfad + ' lädt (' + r.status() + ', „' + (await page.title()) + '“)');
    const ohneWorker = pfad === '/zentrale/' ? text.replace(/\bfenstero\b/g, '') : text; // die Zentrale nennt dem Inhaber den internen Worker-Namen bei Cloudflare
    ok(!/Lichtma|Fenstero|Zamma|Klopfan|Fensterino/i.test(ohneWorker) && !/claude\.ai/i.test(text), pfad + ': keine alten Namen, kein claude.ai');
    ok(!/EEZI/.test(text) && (pfad === '/gibtsnicht' || await page.locator('.wm').count() > 0), pfad + ': Marke eeziframes klein, auch in Versalzeilen' + (pfad === '/gibtsnicht' ? '' : ', mit Wortmarke'));
    ok(await page.locator('svg .fi-kachel').count() > 0 && await page.locator('svg .fi-strahl').count() > 0 && await page.locator('svg .fi-fluegel').count() === 0, pfad + ': Logo (Licht fällt durch ein Fenster) da, auch auf der Fehlerseite');
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

  // Ansicht: Umschalter oben, Anker, Knöpfe nur für die gewählte Zielgruppe
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' });
  const pa = await neueSeite(ctxA);
  const zustand = () => pa.evaluate(() => ({ a: ((document.querySelector('.top .ansicht [aria-pressed="true"]') || {}).textContent || ''), n: document.querySelectorAll('.top .ansicht button').length, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()), b2c: !!document.querySelector('.hero.b2c'), b2b: !!document.querySelector('.hero.b2b'), top: [...document.querySelectorAll('.top .btn')].filter((b) => b.offsetParent).map((b) => b.innerText.trim()), hash: location.hash, screen: S.screen }));
  await pa.goto(BASE + '/', { waitUntil: 'networkidle' }); await pa.waitForTimeout(300);
  let z = await zustand();
  ok(z.n === 2 && z.a === 'Hauseigentümer' && z.b2c && !z.b2b && z.h1.length === 1 && /Fenster ausmessen/.test(z.h1[0]) && z.top.includes('Fenster ausmessen') && !z.top.some((t) => /Anmelden|starten/i.test(t)), 'Ansicht Hauseigentümer (Standard): Umschalter oben, nur Inhalte für Hauseigentümer, Knopf „Fenster ausmessen“, kein Anmelden oder Starten für Betriebe');
  ok(await pa.locator('.top a.btn.primary[href$="/app/"]').count() === 1 && await pa.locator('.wechsel [data-act="ansicht"][data-v="betrieb"]').count() === 1 && await pa.locator('a.tcard[href="/ratgeber/fenster-ausmessen/"]').count() === 1, 'Hauseigentümer: „Fenster ausmessen“ führt in die App, Ratgeber verlinkt, am Ende der Weg zur Ansicht für Fensterbauer');
  await pa.click('.top .ansicht [data-v="betrieb"]'); await pa.waitForTimeout(400);
  z = await zustand();
  ok(z.a === 'Fensterbauer' && z.b2b && !z.b2c && z.h1.length === 1 && /Aufmaß ohne Anfahrt/.test(z.h1[0]) && z.hash === '#fensterbauer' && z.top.includes('Anmelden') && z.top.includes('Kostenlos starten') && !z.top.includes('Fenster ausmessen'), 'Ansicht Fensterbauer: Anker #fensterbauer, nur Inhalte für Betriebe, „Anmelden“ und „Kostenlos starten“');
  ok(await pa.locator('.wechsel [data-act="ansicht"][data-v="kunde"]').count() === 1 && await pa.evaluate(() => window.scrollY) === 0, 'Fensterbauer: Sprung an den Anfang der Ansicht, am Ende der Weg zu den Hauseigentümern');
  await pa.reload({ waitUntil: 'networkidle' }); await pa.waitForTimeout(300);
  ok((await zustand()).a === 'Fensterbauer', 'Gewählte Ansicht bleibt nach dem Neuladen');
  await pa.goto(BASE + '/#hauseigentuemer', { waitUntil: 'networkidle' }); await pa.waitForTimeout(300);
  z = await zustand();
  ok(z.a === 'Hauseigentümer' && z.b2c, 'Anker /#hauseigentuemer öffnet die Ansicht für Hauseigentümer');
  await pa.goto(BASE + '/#betriebe', { waitUntil: 'networkidle' }); await pa.waitForTimeout(300);
  z = await zustand();
  ok(z.a === 'Fensterbauer' && z.b2b && z.hash === '#fensterbauer', 'Früherer Anker /#betriebe öffnet die Ansicht für Fensterbauer');
  await pa.click('.top [data-act="go"][data-v="preise"]'); await pa.waitForTimeout(300);
  z = await zustand();
  ok(z.screen === 'preise' && z.a === 'Fensterbauer', 'Preise gehören zur Ansicht Fensterbauer, der Umschalter zeigt es');
  await pa.click('.top .ansicht [data-v="kunde"]'); await pa.waitForTimeout(300);
  z = await zustand();
  ok(z.screen === 'landing' && z.a === 'Hauseigentümer' && z.b2c && z.hash === '#hauseigentuemer', 'Von den Preisen per Umschalter zur Startseite der Hauseigentümer');
  await pa.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await pa.goto(BASE + '/?von=pdf', { waitUntil: 'networkidle' }); await pa.waitForTimeout(300);
  z = await zustand();
  ok(z.a === 'Fensterbauer' && await pa.locator('.banner.vonpdf').count() === 1, 'Über den QR-Code eines Aufmaßblatts: Ansicht Fensterbauer mit Hinweis zum Code');
  sauber(pa, 'Ansichten ohne Fehler');
  await ctxA.close();

  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'de-DE' });
  const mp = await neueSeite(mob);
  await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(800);
  ok(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Portal: kein seitliches Scrollen bei 390 px');
  const kopf = await mp.evaluate(() => { const t = document.querySelector('.top'), u = t.querySelector('.ansicht'), r = u.getBoundingClientRect(), k = [...u.querySelectorAll('button')]; return { breit: Math.round(r.width), zeile: r.top > t.querySelector('.logo-s').getBoundingClientRect().bottom - 2, voll: k.every((b) => b.scrollWidth <= b.clientWidth + 1 && b.getBoundingClientRect().height >= 44), passt: t.scrollWidth <= t.clientWidth + 1, hoehe: Math.round(t.getBoundingClientRect().height) }; });
  ok(kopf.zeile && kopf.breit >= 340 && kopf.voll && kopf.passt && kopf.hoehe <= 124, 'Telefon: Umschalter als eigene Zeile der Kopfzeile, volle Breite, beide Wörter ganz lesbar, Ziele ab 44 px (Kopf ' + kopf.hoehe + ' px)');
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
  ok(await page.locator('.qopt[data-act="situation"]').count() === 2 && await page.locator('.qopt[data-act="art"]').count() === 6 && /Schritt 1 von 6/.test(await page.evaluate(() => document.body.textContent)), 'Start: die Stelle (ersetzen oder neu) und das Element (Fenster, Balkon- oder Terrassentür, Festverglasung, Hebe-Schiebe-Tür, PSK-Tür, Faltschiebewand) zur Wahl');
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
  // Name des Fensters ist Pflicht: ohne Namen kein Weiter und kein Speichern; nach dem Tippen geht „Weiter“ gleich beim ersten Antippen
  await page.evaluate(() => { S.win.name = ''; S.q = 'lage'; S.screen = 'frage'; render(true); }); await page.waitForTimeout(300);
  await page.click('[data-act="qnext"]'); await page.waitForTimeout(300);
  const n1 = await page.evaluate(() => ({ q: S.q, inv: document.getElementById('t-name').getAttribute('aria-invalid'), fokus: document.activeElement && document.activeElement.id, satz: (document.getElementById('t-name-f') || {}).textContent || '', pflicht: /Name des Fensters\s*Pflichtfeld/.test((document.querySelector('label[for="t-name"]') || {}).textContent || '') }));
  await page.evaluate(() => saveWin()); await page.waitForTimeout(200);
  const n2 = await page.evaluate(() => ({ q: S.q, screen: S.screen, n: S.windows.length }));
  await page.fill('#t-name', 'Wohnzimmer'); await page.click('[data-act="qnext"]'); await page.waitForTimeout(300);
  const n3 = await page.evaluate(() => ({ q: S.q, name: S.win.name }));
  ok(n1.q === 'lage' && n1.inv === 'true' && n1.fokus === 't-name' && /Bitte gib dem Fenster einen Namen/.test(n1.satz) && n1.pflicht && n2.q === 'lage' && n2.screen === 'frage' && n2.n === 0 && n3.q !== 'lage' && n3.name === 'Wohnzimmer', 'Name des Fensters ist Pflicht: ohne Namen kein Weiter und kein Speichern, Hinweis am Feld mit Fokus; nach dem Tippen geht „Weiter“ beim ersten Antippen');
  // Eigenes Aufmaß: speichern, dann die Paywall: Vorschau mit Preis, kein Code und keine Datei vor der Zahlung
  await page.evaluate(() => { S.win.name = 'Wohnzimmer'; saveWin(); S.screen = 'teilen'; render(true); }); await page.waitForTimeout(400); // der Name ist Pflicht (Frage „Wo ist das Fenster?“)
  let t3 = await page.evaluate(() => document.body.textContent);
  ok(/Dein Aufmaßblatt ist fertig/.test(t3) && /Freischalten · 7,99 €/.test(t3) && /inkl\. MwSt\./.test(t3) && /Messen, Fotos und 3-D-Modell bleiben kostenlos/.test(t3), 'Paywall: Aufmaßblatt für 7,99 € inkl. MwSt., Messen bleibt kostenlos');
  ok(!/AM1\./.test(t3) && !/Code kopieren/.test(t3) && await page.locator('[data-act="k-dl"], [data-act="teil-pdf"]').count() === 0 && await page.locator('.dv-blur').count() === 1 && await page.locator('.dv-tab tr').count() === 2, 'Vor der Zahlung: Vorschau mit Übersicht, Positionen verschwommen, kein Code, keine Datei');
  await foto(page, 'app-paywall');
  await page.evaluate(() => go('home')); await page.waitForTimeout(300);
  ok(/Dein Aufmaßblatt · 7,99 €/.test(await page.evaluate(() => document.body.textContent)) && await page.locator('[data-act="k-dl"]').count() === 0, 'Startseite: Karte mit Preis statt kostenloser Datei');
  await page.evaluate(() => go('teilen')); await page.waitForTimeout(200);
  // Kasse, Schritt 1 (ohne Konto): die E-Mail ist Pflicht; den AGB stimmt man an der Kasse zu, für genau diesen Kauf
  await page.click('[data-act="k-start"]'); await page.waitForSelector('#k-mail');
  await page.click('.bb .btn.primary'); await page.waitForTimeout(200);
  ok(await page.locator('.kf.bad').count() === 1 && await page.locator('.kcheck').count() === 0 && await page.evaluate(() => S.screen === 'konto'), 'Ohne E-Mail geht es nicht zur Zahlung; die AGB kommen erst an der Kasse');
  await page.fill('#k-mail', 'kunde@beispiel.de'); await page.click('.bb .btn.primary'); await page.waitForTimeout(300);
  t3 = await page.evaluate(() => document.body.textContent);
  ok(/Schritt 2 von 2/.test(t3) && /Aufmaßblatt als PDF/.test(t3) && /7,99 €/.test(t3) && /darin 19 % MwSt\./.test(t3) && /1,28 €/.test(t3) && /Testkauf abschließen/.test(t3) && /Pilotphase: Testkauf/.test(t3), 'Kasse: 7,99 € mit ausgewiesener MwSt. (1,28 €), im Pilot als Testkauf gekennzeichnet');
  const kasse2 = await page.evaluate(() => ({ haken: Array.from(document.querySelectorAll('.kasse-recht .kcheck')).map((l) => l.textContent.trim()), an: Array.from(document.querySelectorAll('.kasse-recht .kcheck input')).some((i) => i.checked), wr: !!document.querySelector('.kasse-recht a[href="/agb/#widerrufsbelehrung"]') && !!document.querySelector('.kasse-recht a[href="/agb/#widerrufsformular"]') && !!document.querySelector('.kasse-recht a[href="/agb/"]') }));
  ok(kasse2.haken.length === 2 && kasse2.haken[0] === 'Ich akzeptiere die AGB (Stand: ' + RECHT.standText(RECHT.AGB_STAND) + ').' && kasse2.haken[1] === RECHT.ZUSTIMMUNG && !kasse2.an && kasse2.wr, 'Kasse: zwei leere Haken, AGB mit Stand und die Zustimmung zur sofortigen Bereitstellung im Wortlaut des Servers; Widerrufsbelehrung und Muster-Widerrufsformular verlinkt');
  await foto(page, 'app-kasse');
  await page.click('.bb .btn.primary'); await page.waitForTimeout(200);
  ok(await page.locator('.kerr').count() === 3 && await page.evaluate(() => !(S.kauf && S.kauf.paid) && S.screen === 'kasse'), 'Ohne Zahlungsart, AGB und Zustimmung zur sofortigen Bereitstellung kein Kauf');
  await page.click('[data-act="k-pay"][data-v="PayPal"]'); await page.click('[data-in="kc"][data-f="bedingungen"]'); await page.click('[data-in="kc"][data-f="widerruf"]');
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
  /* Der Code steht in Zeilen direkt untereinander; danach kommt nach Leerzeilen der Seitenfuß (nicht mitnehmen). Mit der KI-Auswertung im
     Fenster wird er lang (mehrere Zeilen). */
  const m3 = /AM1\.[A-Za-z0-9_-]+(?:\n[ \t]*[A-Za-z0-9_-]+)*/.exec(txt3), code3 = m3 ? m3[0].replace(/\s+/g, '') : '';
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
  /* Kundenschutz (Nutzungsbedingungen § 11): Im Link gibt es weder Aufmaßblatt noch Code, keine Kasse und kein Konto; das Aufmaß geht nur an den Betrieb */
  const ks4 = await page.evaluate(async () => {
    const wege = ['teilen', 'datei', 'kasse', 'konto', 'sichern', 'meinkonto'].map((s) => { go(s); return S.screen; });
    const sichtbar = document.body.textContent; go('blatt');
    await saveDatei(); const t1 = S.toast || ''; await pdfTeilen(); const t2 = S.toast || '';
    return { wege: wege.join(','), code: /AM1\./.test(sichtbar), t1: t1, t2: t2, nurAn: /gehen nur an /.test(document.body.textContent) };
  });
  ok(ks4.wege === 'blatt,blatt,blatt,blatt,blatt,blatt' && !ks4.code && /bekommst du von/.test(ks4.t1) && /bekommst du von/.test(ks4.t2) && ks4.nurAn, 'Kundenschutz im Link: kein Weg zu Aufmaßblatt, Code, Kasse oder Konto, die PDF gibt es nur vom Betrieb; Prüfen-Seite: geht nur an den Betrieb (' + ks4.wege + ')');
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
  for (const [pfad, name] of [['/datenschutz/', 'datenschutz'], ['/impressum/', 'impressum'], ['/agb/', 'agb'], ['/nutzungsbedingungen/', 'nutzungsbedingungen'], ['/cookies/', 'cookies'], ['/widerruf/', 'widerruf']]) {
    await page.goto(BASE + pfad, { waitUntil: 'networkidle' });
    const m5 = await page.evaluate(() => { const k = document.querySelector('.fuss a.widerruf-knopf'), r = k ? k.getBoundingClientRect() : null; return { quer: document.documentElement.scrollWidth > window.innerWidth + 1, knopf: !!r && r.height >= 44 && getComputedStyle(k).boxShadow !== 'none', klein: Array.from(document.querySelectorAll('main *, footer *')).filter((e) => e.childElementCount === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 13).length }; });
    ok(!m5.quer && m5.knopf && !m5.klein, pfad + ': kein seitliches Scrollen, Schrift ab 13 px, „Vertrag widerrufen“ als Knopf ab 44 px');
    await foto(page, name);
  }
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
  await page.goto(BASE + '/#hauseigentuemer', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  const start = await page.evaluate(() => document.body.textContent);
  ok(/Fenster ausmessen\. Selbst\. eezi\./.test(start) && !/Aufmaß ohne Anfahrt/.test(start) && await page.locator('.hero.b2c a[href$="/app/"]').count() === 1 && await page.locator('.hero.b2c a[href$="/app/#fuehrung"]').count() === 1, 'Startseite, Ansicht Hauseigentümer: ausmessen oder Führung, nichts für Betriebe');
  await page.click('.top .ansicht [data-v="betrieb"]'); await page.waitForTimeout(400);
  const startB = await page.evaluate(() => document.body.textContent);
  ok(/Aufmaß ohne Anfahrt/.test(startB) && !/Fenster ausmessen\. Selbst/.test(startB) && await page.locator('.hero.b2c').count() === 0, 'Startseite, Ansicht Fensterbauer: Aufmaß ohne Anfahrt, nichts für Hauseigentümer');
  ok(!/anklopf|Anklopf|Marktplatz|Portal-Zusatz|Vergleichsangebot/.test(start + startB), 'Kein Marktplatz mehr auf der Startseite');
  ok(await page.locator('#kundenschutz').count() === 1 && await page.locator('#kundenschutz a[href="/nutzungsbedingungen/#kundenschutz"]').count() === 1 && /Ihr Kunde bleibt Ihr Kunde\./.test(startB) && (startB.match(/Nur Ihr Betrieb|Nur in Ihr Konto|Keine Kopie von uns|Kein Weiterverkauf/g) || []).length === 4, 'Startseite für Betriebe: Abschnitt Kundenschutz mit vier Zusagen und Verweis auf § 11 der Nutzungsbedingungen');
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
  const r0 = await pilz(), ohneRc1 = await p4.locator('.qpanel [data-act="setw"][data-v="rc1"]').count() === 0;
  await p4.click('.qpanel [data-act="setw"][data-v="rc2"]'); await p4.waitForTimeout(300); const r2 = await pilz();
  const schloss = await p4.evaluate(() => document.getElementById('w3d').classList.contains('mit-schloss') && /RC2/.test(document.querySelector('.w3d-hint').textContent));
  await frage('rc', { rc: 'rc1' }); const r1 = await pilz(), mitRc1 = await p4.locator('.qpanel [data-act="setw"][data-v="rc1"][aria-pressed="true"]').count() === 1;
  ok(r0 === 0 && r1 === 8 && r2 === 16 && schloss && ohneRc1 && mitRc1, 'Einbruchschutz: Basisschutz oder RC2 zur Wahl (RC1 N nur, wenn ein älteres Aufmaß es schon hat); RC1 N zeigt Pilzköpfe an den Seiten, RC2 rundum und ein Schloss am Griff');
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
  const dup = await api('/api/konto/registrieren', { firma: 'Prüf Zweitkonto ' + stempel, ap: 'Paul Prüf', tel: tel, plz: '50667', col: '#1f7a3d', agb: RECHT.NB_STAND, unternehmer: true }, dupTok);
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
  ok(await page.evaluate(() => { const alt = Server.status; Server.status = Object.assign({}, alt, { testmodus: true }); const mit = paySheet({}); Server.status = alt; const ohne = paySheet({}); return /Testbetrieb:/.test(mit) && /DE89 3704 0044 0532 0130 00/.test(mit) && /4242 4242 4242 4242/.test(mit) && !/Testbetrieb:/.test(ohne); }), 'Zahlungsart-Blatt nennt im Stripe-Testmodus Test-IBAN und Testkarte, sonst nicht');
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
  // Anmeldung über den Link aus der E-Mail (Supabase-Standardmail ohne eigenen Mailversand): #access_token=… auf der Startseite
  const ungueltig = await api('/api/konto/sitzung', { token: 'kaputt', refresh: '' });
  ok(ungueltig._status === 401 && /abgelaufen/.test(ungueltig.fehler || ''), 'Anmeldelink mit ungültigem Token wird abgewiesen');
  /* angefordert: dieser Browser hat die E-Mail für diese Adresse angefordert (wie nach „E-Mail schicken“), dann ohne Rückfrage */
  const linkSeite = async (hash, angefordert) => { const c = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' }); if (angefordert) await c.addInitScript((m) => { try { localStorage.setItem('aufmass.sitzung.anfrage', JSON.stringify({ mail: m, at: Date.now() })); } catch (e) { /* ok */ } }, angefordert); const p = await neueSeite(c, BASE2); await p.goto(BASE2 + '/' + hash, { waitUntil: 'networkidle' }); return { c: c, p: p }; };
  const neuMail = 'link-' + stempel + '@beispiel.de';
  const l1s = await linkSeite('#access_token=' + testToken(neuMail) + '&expires_in=3600&refresh_token=test-refresh&token_type=bearer&type=signup', neuMail);
  await l1s.p.waitForSelector('#r-firma', { timeout: 8000 });
  ok(await l1s.p.evaluate((m) => !/access_token|refresh_token/.test(location.href) && S.reg && S.reg.server === true && S.reg.d.mail === m && !!Server.sitzung && Server.sitzung.refresh === 'test-refresh', neuMail), 'Anmeldelink einer neuen Adresse: weiter zum Eintragen des Betriebs, Sitzung gemerkt, Token aus der Adresszeile entfernt');
  sauber(l1s.p, 'Anmeldelink (neu) ohne Fehler'); await l1s.c.close();
  const l2s = await linkSeite('#access_token=' + testToken(mail) + '&expires_in=3600&refresh_token=test-refresh&token_type=bearer&type=magiclink', mail);
  await l2s.p.waitForFunction(() => typeof Server !== 'undefined' && Server.online(), null, { timeout: 8000 }); await l2s.p.waitForTimeout(300);
  ok(await l2s.p.evaluate((f) => BC().name === f && !/access_token|refresh_token/.test(location.href) && X.konto(A()) === 'plus', firma) && /Willkommen zurück/.test(await l2s.p.evaluate(() => (document.getElementById('toast') || {}).textContent || '')), 'Anmeldelink eines bestehenden Betriebs: direkt im Konto, mit Begrüßung');
  sauber(l2s.p, 'Anmeldelink (bestehend) ohne Fehler'); await l2s.c.close();
  /* Ein Link, den dieser Browser nicht angefordert hat (etwa untergeschoben): erst die Rückfrage mit der Adresse des Kontos */
  const l4s = await linkSeite('#access_token=' + testToken(mail) + '&expires_in=3600&refresh_token=test-refresh&token_type=bearer&type=magiclink');
  await l4s.p.waitForSelector('[data-act="srv-link-ja"]', { timeout: 8000 });
  const frage4 = await l4s.p.evaluate(() => ({ text: (document.querySelector('.sheet') || {}).textContent || '', sitzung: !!Server.sitzung, adresse: location.href }));
  await l4s.p.click('.sheet [data-act="sheet-close"]'); await l4s.p.waitForTimeout(300);
  const nein4 = await l4s.p.evaluate(() => ({ sitzung: !!Server.sitzung, gemerkt: localStorage.getItem('aufmass.sitzung') }));
  ok(/Mit diesem Konto anmelden\?/.test(frage4.text) && frage4.text.includes(mail) && !frage4.sitzung && !/access_token/.test(frage4.adresse) && !nein4.sitzung && !nein4.gemerkt, 'Betriebsbereich: Anmeldelink, den dieser Browser nicht angefordert hat, erst mit Rückfrage und Adresse des Kontos; „Nicht anmelden“ meldet nicht an');
  await l4s.c.close();
  const l5s = await linkSeite('#access_token=' + testToken(mail) + '&expires_in=3600&refresh_token=test-refresh&token_type=bearer&type=magiclink');
  await l5s.p.waitForSelector('[data-act="srv-link-ja"]', { timeout: 8000 }); await l5s.p.click('[data-act="srv-link-ja"]');
  await l5s.p.waitForFunction(() => typeof Server !== 'undefined' && Server.online(), null, { timeout: 8000 });
  ok(await l5s.p.evaluate((f) => BC().name === f, firma), 'Betriebsbereich: nach „Anmelden“ in der Rückfrage im Konto');
  sauber(l5s.p, 'Anmeldelink mit Rückfrage ohne Fehler'); await l5s.c.close();
  const l3s = await linkSeite('#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired'); await l3s.p.waitForTimeout(600);
  ok(/abgelaufen/.test(await l3s.p.evaluate(() => (document.getElementById('toast') || {}).textContent || '')) && await l3s.p.evaluate(() => !/error_code/.test(location.href) && !Server.sitzung), 'Abgelaufener Anmeldelink: Hinweis, keine Sitzung, Adresszeile bereinigt');
  await l3s.c.close();
  await kctx.close(); await ctx.close();

  // Hauseigentümer kauft das Aufmaßblatt über die (nachgestellte) Kasse: Nachweis vom Server
  const kctx2 = await browser.newContext({ ...telefon, acceptDownloads: true }), kp2 = await neueSeite(kctx2, BASE2);
  await kp2.goto(BASE2 + '/app/', { waitUntil: 'networkidle' }); await kp2.waitForTimeout(400);
  await kp2.evaluate(() => { S.windows = demoProject(); Object.assign(S.proj, { name: 'Haus Prüf', ort: '50667 Köln' }); persist(); go('teilen'); }); await kp2.waitForTimeout(400);
  ok(await kp2.evaluate(() => SERVER.zahlung && SERVER.attrappe && PREIS() === 7.99 && !FREI()) && await kp2.locator('.dv-blur').count() === 1, 'App kennt die Kasse des Servers, Blatt ist noch gesperrt');
  await kp2.click('[data-act="k-start"]'); await kp2.waitForSelector('#s-mail'); // Freischalten nur mit Konto: E-Mail und Code
  ok(await kp2.evaluate(() => S.screen === 'sichern' && S.sichern.zweck === 'kauf' && /brauchst du ein Konto/.test(document.body.innerText)), 'Freischalten im Servermodus: erst das Aufmaß sichern (E-Mail und Code, kein Passwort)');
  await kp2.fill('#s-mail', 'kaeufer@beispiel.de'); await kp2.click('[data-in="sc"][data-f="agb"]'); await kp2.click('.bb .btn.primary'); await kp2.waitForSelector('#s-code');
  await kp2.fill('#s-code', '123456'); await kp2.click('.bb .btn.primary'); await kp2.waitForSelector('[data-screen="kasse"]', { timeout: 10000 }); await kp2.waitForTimeout(300);
  const kasse = await kp2.evaluate(() => document.body.innerText);
  ok(/Weiter zu Stripe · 7,99 €/.test(kasse) && /Zahlungsdienstleisters Stripe/.test(kasse) && /Kredit- oder Debitkarte \(auf passenden Geräten auch Apple Pay oder Google Pay\)/.test(kasse) && /Testbetrieb/.test(kasse) && /Rechnung an kaeufer@beispiel\.de/.test(kasse) && !/Testkauf/.test(kasse) && await kp2.locator('[data-act="k-pay"]').count() === 0, 'Kasse im Servermodus: Zahlung bei Stripe mit den Zahlungsarten des Servers, Rechnung an die E-Mail des Kontos, keine Scheinauswahl, kein Testkauf');
  await kp2.click('.bb .btn.primary'); await kp2.waitForTimeout(200);
  ok(await kp2.evaluate(() => S.screen === 'kasse' && !(S.kauf && S.kauf.paid)) && await kp2.locator('.kerr').count() === 2, 'Ohne Zustimmung zu AGB und sofortiger Bereitstellung keine Kasse');
  await kp2.click('[data-in="kc"][data-f="bedingungen"]'); await kp2.click('[data-in="kc"][data-f="widerruf"]');
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
  kp2.probleme = kp2.probleme.filter((x) => !/Attrappe/.test(x));
  sauber(kp2, 'Kauf im Servermodus ohne Fehler');
  await kctx2.close();

  // Zahlung noch unterwegs (etwa eine Lastschrift): nicht freigeschaltet, Hinweis statt „abgebrochen“, beim nächsten Öffnen von selbst frei
  const kctx3 = await browser.newContext({ ...telefon }), kp3 = await neueSeite(kctx3, BASE2);
  await kp3.goto(BASE2 + '/app/', { waitUntil: 'networkidle' }); await kp3.waitForTimeout(300);
  await kp3.evaluate(() => { S.windows = demoProject(); Object.assign(S.proj, { name: 'Haus Warten', ort: '50667 Köln' }); kauf().mail = 'warten@beispiel.de'; kennung(); persist(); });
  await kp3.goto(BASE2 + '/app/?bezahlt=wartet_' + stempel, { waitUntil: 'networkidle' }); await kp3.waitForTimeout(500);
  const w1 = await kp3.evaluate(() => ({ paid: !!(S.kauf && S.kauf.paid), wartet: (S.kauf && S.kauf.wartet) || '', screen: S.screen, txt: document.body.innerText, toast: S.toast || '', url: location.search }));
  ok(!w1.paid && /^wartet_/.test(w1.wartet) && w1.screen === 'teilen' && /Deine Zahlung ist unterwegs/.test(w1.txt) && /Bitte nicht noch einmal bezahlen/.test(w1.txt) && /unterwegs/.test(w1.toast) && w1.url === '', 'Zahlung noch unterwegs: nicht freigeschaltet, Hinweis „nicht noch einmal bezahlen“ statt „abgebrochen“');
  await foto(kp3, 'srv-app-zahlung-unterwegs');
  await kp3.click('.bb .btn.primary'); await kp3.waitForTimeout(400);
  ok(await kp3.evaluate(() => S.screen === 'teilen' && /unterwegs/.test(S.toast || '') && !!S.kauf.wartet), 'Freischalten, während die Zahlung unterwegs ist: keine zweite Kasse, nur der Hinweis');
  await kp3.evaluate(() => { S.kauf.wartet = 'test_spaeter'; persist(); });
  await kp3.reload({ waitUntil: 'networkidle' }); await kp3.waitForTimeout(600);
  ok(await kp3.evaluate(() => !!S.kauf.paid && !S.kauf.wartet && S.screen === 'gekauft' && (S.kauf.token || '').length === 32), 'Beim nächsten Öffnen: Zahlung bestätigt, Blatt von selbst freigeschaltet');
  sauber(kp3, 'Zahlung unterwegs ohne Fehler');
  await kctx3.close();
  // Stripe im Testmodus (Schlüssel sk_test_…): die Kasse sagt es und nennt die Testkarte
  const kctx4 = await browser.newContext({ ...telefon }), kp4 = await neueSeite(kctx4, BASE2);
  await kctx4.route('**/api/status', async (route) => { const r = await route.fetch(); const j = await r.json(); j.attrappe = false; j.testmodus = true; await route.fulfill({ response: r, json: j }); });
  await kp4.goto(BASE2 + '/app/', { waitUntil: 'networkidle' }); await kp4.waitForTimeout(300);
  await kp4.evaluate(() => { S.windows = demoProject(); const k = kauf(); k.mail = 'test@beispiel.de'; k.agb = true; persist(); go('kasse'); }); await kp4.waitForTimeout(300);
  const t4 = await kp4.evaluate(() => ({ txt: document.body.innerText, test: SERVER.testmodus }));
  ok(t4.test && /Testbetrieb:/.test(t4.txt) && /4242 4242 4242 4242/.test(t4.txt) && !/nachgestellt/.test(t4.txt) && /Weiter zu Stripe/.test(t4.txt), 'Stripe im Testmodus: Kasse nennt Testbetrieb und Testkarte');
  await foto(kp4, 'srv-app-kasse-testmodus');
  sauber(kp4, 'Kasse im Testmodus ohne Fehler');
  await kctx4.close();

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
  const fuehrungDa = await page.locator('.hero.b2c a[href$="/app/#fuehrung"]').count() === 1;
  await page.click('.top .ansicht [data-v="betrieb"]'); await page.waitForTimeout(300);
  ok(fuehrungDa && await page.locator('.hero.b2b [data-act="tour"]').count() === 1, 'Startseite: „Führung starten“ in der Ansicht für Hauseigentümer, „Tour starten“ in der für Fensterbauer');
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
  await page.click('.hero.b2b [data-act="tour"]'); await page.waitForSelector('.tourw'); await page.waitForTimeout(300);
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
  /* Echter Ausschnitt des Aufmaßblatts statt einer Skizze: Bild zum gewählten Abzug, aus demselben Code und denselben Daten erzeugt
     (scripts/tour-bild.mjs); der Fingerabdruck verrät, wenn blatt.js, Schrift, jsPDF, modell.js oder die Daten der Tour sich geändert haben */
  await page.waitForFunction(() => { const i = document.querySelector('.tpk-blatt img'); return !!(i && i.complete && i.naturalWidth > 0); }, null, { timeout: 8000 }).catch(() => {});
  const tb9 = await page.evaluate(() => { const i = document.querySelector('.tpk-blatt img'); return i ? { src: i.getAttribute('src'), alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, skizze: !!document.querySelector('.tpk-papier') } : null; });
  const fs9b = await import('node:fs'), url9b = await import('node:url'), tourBild = await import('./tour-bild.mjs');
  const tourInfo = JSON.parse(fs9b.readFileSync(url9b.fileURLToPath(new URL('../web/bilder/tour-aufmassblatt.json', import.meta.url)), 'utf8'));
  const tourDaten = await page.evaluate(tourBild.DATEN_AUS_SEITE);
  ok(!!tb9 && tb9.src === '/bilder/tour-aufmassblatt-20.webp' && /Bestellmaß-Vorschlag 1\.749 × 1\.389 mm/.test(tb9.alt) && tb9.w === tourInfo.breite && tb9.h === tourInfo.hoehe && !tb9.skizze && tourInfo.abzuege.every((a) => fs9b.existsSync(url9b.fileURLToPath(new URL('../web/bilder/tour-aufmassblatt-' + a + '.webp', import.meta.url)))), 'Tour, Bestellmaß und PDF: echter Ausschnitt von Seite 1 des Aufmaßblatts zum gewählten Abzug (' + (tb9 ? tb9.src + ', ' + tb9.w + ' × ' + tb9.h : 'kein Bild') + '), keine Skizze mehr');
  ok(tourBild.fingerabdruck(tourDaten) === tourInfo.stand, 'Tour-Ausschnitt passt zum aktuellen Aufmaßblatt (sonst neu erzeugen: PW_PFAD=/opt/node-tools node scripts/tour-bild.mjs)');
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
  ok(await ap.locator('[data-act="tour-start"]').count() === 1, 'App-Startseite mit angefangenem Aufmaß: „Führung starten“ bleibt erreichbar (unter der Liste)');
  await ap.click('[data-act="tour-start"]'); await ap.waitForSelector('.scr[data-screen="tour"]');
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
    const rechts = ['/impressum/', '/datenschutz/', '/agb/', '/nutzungsbedingungen/', '/cookies/', '/widerruf/'].includes(s.pfad), ld = ldjson(r.text);
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
  const tour1 = await page.evaluate(() => S.screen === 'tour' && location.hash !== '#tour');
  await page.evaluate(() => { tourEnde(); location.hash = 'tour'; }); await page.waitForTimeout(400);
  ok(tour1 && await page.evaluate(() => S.screen === 'tour' && location.hash !== '#tour'), 'Link „Tour“ auf der Seite für Fensterbauer öffnet die Tour (/#tour), auch als Sprungmarke auf der Startseite');
  await page.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  ok(await page.locator('.vorab').count() === 0 && await page.locator('a[href$="/ratgeber/fenster-ausmessen/"]').count() >= 1 && await page.locator('a[href$="/#fensterbauer"]').count() >= 1, 'App mit JavaScript: Textfassung weg, Anleitung verlinkt, Fensterbauer kommen in ihre Ansicht');
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
  ok(/User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: \/\nDisallow: \/api\//.test(rb.text) && rb.text.includes('Sitemap: ' + KAN + '/sitemap.xml') && ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'].every((b) => rb.text.includes('User-agent: ' + b + '\n')), 'Freigabe: robots.txt erlaubt alles außer /api/, nennt die KI-Suchen und die Sitemap');
  ok(sm.status === 200 && seo.SEITEN.every((s) => sm.text.includes('<loc>' + KAN + s.pfad + '</loc>')) && (sm.text.match(/<url>/g) || []).length === seo.SEITEN.length, 'Freigabe: sitemap.xml mit allen ' + seo.SEITEN.length + ' Seiten und absoluten Adressen');
  ok(ll.status === 200 && ll.text.startsWith('# eeziframes\n\n> ') && ll.text.includes('(' + KAN + '/ratgeber/fenster-ausmessen/)') && ll.text.includes(eur(7.99)) && !ll.h.get('x-robots-tag'), 'Freigabe: llms.txt mit Kurzfassung, Preisen und absoluten Links');
  const fehlt = [];
  for (const s of seo.SEITEN) { const r = await fetch(B3 + s.pfad); if (r.headers.get('x-robots-tag') || r.headers.get('link') !== '<' + KAN + s.pfad + '>; rel="canonical"' || !r.headers.get('content-security-policy')) fehlt.push(s.pfad); }
  ok(!fehlt.length, 'Freigabe: alle Seiten ohne noindex, mit CSP und Canonical auf die Hauptadresse' + (fehlt.length ? ' (fehlt: ' + fehlt.join(', ') + ')' : ''));
  const din3 = await roh('/ratgeber/din-links-rechts/', B3), bild3 = await fetch(B3 + '/bilder/din-links-rechts.svg');
  ok(seo.SEITEN.every((x) => sm.text.includes('<loc>' + KAN + x.pfad + '</loc><lastmod>' + x.stand + '</lastmod>')) && din3.text.includes('"image":"' + KAN + '/bilder/din-links-rechts.svg"') && bild3.status === 200 && !bild3.headers.get('x-robots-tag'), 'Freigabe: lastmod je Seite in der Sitemap, Abbildung im JSON-LD mit voller Adresse und ohne noindex');
  const fb3 = await roh('/fuer-fensterbauer/', B3);
  ok(fb3.text.includes('<meta property="og:image" content="' + KAN + '/og.png">') && fb3.text.includes('"url":"' + KAN + '/fuer-fensterbauer/"'), 'Freigabe: Vorschaubild und strukturierte Daten zeigen auf die Hauptadresse');
  const js3 = await fetch(B3 + '/assets/app.js'), logo3 = await fetch(B3 + '/apple-touch-icon.png'), weg3 = await fetch(B3 + '/ratgeber/gibtsnicht/'), z3 = await fetch(B3 + '/zentrale/');
  ok(js3.headers.get('x-robots-tag') === seo.SPERRE && !logo3.headers.get('x-robots-tag') && weg3.status === 404, 'Freigabe: Skripte bleiben noindex, das Logo darf in die Suche, Unbekanntes bleibt 404');
  ok(z3.status === 200 && z3.headers.get('x-robots-tag') === seo.SPERRE && z3.headers.get('cache-control') === 'no-store', 'Freigabe: die Zentrale bleibt noindex und wird nicht zwischengespeichert');
  aus();

  /* f) Gleichstand: Kopfzeilen, Sitemap, Worker-Routen, Preise */
  const block = fs10.readFileSync(path10.join(WURZEL, 'web/_headers'), 'utf8').split(/\n(?=\S)/).find((b) => b.startsWith('/*\n')) || '';
  const ausDatei = Object.fromEntries(block.split('\n').slice(1).map((z) => z.trim()).filter((z) => z && z.includes(':')).map((z) => [z.slice(0, z.indexOf(':')).trim(), z.slice(z.indexOf(':') + 1).trim()]));
  ok(ausDatei['X-Robots-Tag'] === seo.SPERRE && Object.entries(seo.SICHERHEIT).every(([k, v]) => ausDatei[k] === v) && Object.keys(ausDatei).every((k) => k === 'X-Robots-Tag' || k in seo.SICHERHEIT), 'Kopfzeilen in functions/seo.js und web/_headers stimmen überein');
  const dateien = [], such = (d, rel) => { for (const e of fs10.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) such(path10.join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') dateien.push(rel); } };
  such(path10.join(WURZEL, 'web'), '/');
  const oeffentlich = dateien.filter((p) => p !== '/zentrale/');
  ok(oeffentlich.length === seo.SEITEN.length && oeffentlich.every((p) => seo.SEITEN.some((s) => s.pfad === p)), 'Sitemap kennt jede öffentliche Seite in web/ (' + oeffentlich.length + ')');
  ok(dateien.includes('/zentrale/') && !seo.SEITEN.some((s) => s.pfad.startsWith('/zentrale')) && !seo.istSeite('/zentrale/') && !seo.llms('https://eeziframes.com', {}).includes('zentrale'), 'Zentrale des Inhabers: nicht in Sitemap und llms.txt, keine Seite für Suchmaschinen');
  const routen = JSON.parse((fs10.readFileSync(path10.join(WURZEL, 'wrangler.jsonc'), 'utf8').match(/"run_worker_first":\s*(\[[^\]]*\])/) || [])[1] || '[]');
  const passt = (r, p) => (r.endsWith('*') ? p.startsWith(r.slice(0, -1)) : p === r);
  ok(seo.SEITEN.every((s) => seo.istSeite(s.pfad) && routen.some((r) => passt(r, s.pfad))) && ['/robots.txt', '/sitemap.xml', '/llms.txt'].every((p) => routen.includes(p)), 'Worker übernimmt alle Seiten, robots.txt, sitemap.xml und llms.txt (run_worker_first in wrangler.jsonc)');
  const zoho10 = await seo.behandeln(new Request('https://eeziframes.com/verifyforzoho.html'), {}, async () => new Response('falsch'));
  const zohoText10 = zoho10 ? await zoho10.text() : '';
  ok(!!zoho10 && zoho10.status === 200 && zohoText10 === '41302434' && zohoText10 === fs10.readFileSync(path10.join(WURZEL, 'web/verifyforzoho.html'), 'utf8') && /text\/html/.test(zoho10.headers.get('content-type') || '') && routen.includes('/verifyforzoho.html'), 'Bestätigung der Domain für Zoho Mail: /verifyforzoho.html liefert genau den Code wie die Datei in web/, über den Worker und ohne Weiterleitung');
  const og = fs10.readFileSync(path10.join(WURZEL, 'web/og.png'));
  ok(og.readUInt32BE(16) === 1200 && og.readUInt32BE(20) === 630 && og.length < 200000, 'Vorschaubild zum Teilen: 1200 × 630, ' + Math.round(og.length / 1024) + ' KB');
  /* Das Zeichen überall gleich (eine Quelle: scripts/logo-setzen.py): alle Seitenköpfe (die Zentrale zeichnet es per Skript), Favicon,
     Zentrale, Logo.svg in App und Betriebsbereich; das PDF mit denselben Punkten; das Bild für die E-Mails (scripts/marke-bilder.mjs) */
  const gem10 = fs10.readFileSync(path10.join(WURZEL, 'web/assets/gemeinsam.js'), 'utf8'), innen10 = (gem10.match(/var LOGO_INNEN = '([^']*)';/) || [])[1] || '';
  const statisch10 = '<svg viewBox="0 0 64 64" aria-hidden="true">' + innen10 + '</svg>', seiten10 = [];
  (function such10(d) { for (const e of fs10.readdirSync(d, { withFileTypes: true })) { const f = path10.join(d, e.name); if (e.isDirectory()) such10(f); else if (e.name.endsWith('.html') && !f.includes(path10.sep + 'zentrale' + path10.sep) && !seo.BESTAETIGUNG['/' + e.name]) seiten10.push(f); } })(path10.join(WURZEL, 'web'));
  const ohneZeichen10 = seiten10.filter((f) => !fs10.readFileSync(f, 'utf8').includes(statisch10)).map((f) => path10.relative(WURZEL, f));
  const lies10 = (f) => fs10.readFileSync(path10.join(WURZEL, f), 'utf8'), bl10 = lies10('web/assets/blatt.js');
  ok(/fi-strahl/.test(innen10) && seiten10.length >= 19 && !ohneZeichen10.length && lies10('web/favicon.svg').includes(innen10) && lies10('web/assets/zentrale.js').includes(innen10) && ['[26.4, 12.2]', '[57, 17.6]', '[44.2, 41]', '[11.7, 64]'].every((s) => bl10.includes(s)) && !/fi-fluegel|rx="16" fill="#000"/.test(seiten10.map((f) => fs10.readFileSync(f, 'utf8')).join('') + gem10) && /ZEICHEN_PNG = 'iVBOR/.test(lies10('functions/api/marke.js')), 'Das neue Zeichen steht überall gleich: ' + seiten10.length + ' Seiten, Favicon, Zentrale, App und Betriebsbereich, im PDF mit denselben Punkten, als Bild für die E-Mails' + (ohneZeichen10.length ? '; fehlt in ' + ohneZeichen10.join(', ') : ''));
  const apple10 = fs10.readFileSync(path10.join(WURZEL, 'web/apple-touch-icon.png'));
  ok(apple10.readUInt32BE(16) === 180 && apple10.readUInt32BE(20) === 180, 'Apple-Icon 180 × 180 mit dem neuen Zeichen (scripts/marke-bilder.mjs)');
  const konf = {}; new Function('window', fs10.readFileSync(path10.join(WURZEL, 'web/config.js'), 'utf8'))(konf);
  const pr = konf.KONFIG.preise, fb = (await roh('/fuer-fensterbauer/')).text, ab = (await roh('/ratgeber/aufmassblatt-fenster/')).text, fa = (await roh('/ratgeber/fenster-ausmessen/')).text;
  const neuPreis = await Promise.all(['balkontuer-ausmessen', 'fenster-mit-rollladen-ausmessen', 'din-links-rechts', 'bruestungshoehe-fenster'].map(async (n) => (await roh('/ratgeber/' + n + '/')).text));
  ok([eur(pr.projekt) + ' netto', eur(pr.abo.grund) + ' im Monat', 'jedes weitere ' + eur(pr.abo.extra), eur(pr.plus) + ' im Monat', 'ersten ' + pr.frei + ' Projekte'].every((t) => fb.includes(t)) && [start.text, app.text, ab, fb, fa, ...neuPreis].every((t) => t.includes(eur(pr.aufmass))), 'Preise auf den statischen Seiten wie in config.js, auch in den neuen Ratgebern (' + [pr.aufmass, pr.projekt, pr.abo.grund, pr.plus].map(eur).join(', ') + ')');
  ok(/<h2 id="kundenschutz">Kundenschutz: Ihr Kunde bleibt Ihr Kunde<\/h2>/.test(fb) && ['Nur Ihr Betrieb:', 'Nur in Ihr Konto:', 'Keine Kopie von uns:', 'Kein Weiterverkauf:'].every((s) => fb.includes(s)) && fb.includes('href="/nutzungsbedingungen/#kundenschutz"') && fb.includes('Kann mir ein anderer Betrieb über eeziframes den Kunden abwerben?'), 'Seite für Fensterbauer: Kundenschutz mit vier Zusagen, Verweis auf § 11 der Nutzungsbedingungen und die Frage zum Abwerben');
  /* g) Domains: www zählt als Hauptdomain, die Cloudflare-Testadresse bleibt gesperrt (functions/seo.js direkt geprüft) */
  const probe = async (adresse, env) => { const r = await seo.behandeln(new Request(adresse), env, async () => new Response('<!doctype html><title>x</title><meta property="og:image" content="/og.png">', { headers: { 'content-type': 'text/html; charset=utf-8' } })); return { robots: r.headers.get('x-robots-tag'), link: r.headers.get('link'), text: await r.text() }; };
  const www = await probe('https://www.eeziframes.com/ratgeber/', { INDEXIERUNG: '1' }), wdev = await probe('https://fenstero.beispiel.workers.dev/ratgeber/', { INDEXIERUNG: '1' });
  const rbWww = await (await seo.behandeln(new Request('https://www.eeziframes.com/robots.txt'), { INDEXIERUNG: '1' }, null)).text(), rbDev = await (await seo.behandeln(new Request('https://fenstero.beispiel.workers.dev/robots.txt'), { INDEXIERUNG: '1' }, null)).text();
  ok(!www.robots && www.link === '<https://eeziframes.com/ratgeber/>; rel="canonical"' && www.text.includes('content="https://eeziframes.com/og.png"') && rbWww.includes('Sitemap: https://eeziframes.com/sitemap.xml'), 'Domain: www.eeziframes.com zählt als eeziframes.com (Canonical, Vorschaubild, Sitemap)');
  const um = (a, m) => { const r = seo.umleitung(new Request(a, { method: m || 'GET' })); return r ? r.status + ' ' + r.headers.get('location') : null; };
  const httpKan = await probe('http://eeziframes.com/ratgeber/', { INDEXIERUNG: '1' });
  ok(um('http://eeziframes.com/ratgeber/?x=1') === '301 https://eeziframes.com/ratgeber/?x=1' && um('https://www.eeziframes.com/app/') === '301 https://eeziframes.com/app/' && um('http://www.eeziframes.com/') === '301 https://eeziframes.com/' && um('https://eeziframes.com/') === null && um('http://localhost:8788/') === null && um('http://eeziframes.com/', 'POST') === null && um('http://eeziframes.com/verifyforzoho.html') === null && httpKan.link === '<https://eeziframes.com/ratgeber/>; rel="canonical"' && httpKan.text.includes('content="https://eeziframes.com/og.png"'), 'Domain: http:// und www. leiten dauerhaft auf https://eeziframes.com um (nicht lokal, nicht POST, nicht die Bestätigungsdatei); Canonical immer mit https');
  ok(wdev.robots === seo.SPERRE && /User-agent: \*\nDisallow: \/\n/.test(rbDev), 'Domain: die Cloudflare-Testadresse (…workers.dev) bleibt auch mit Freigabe gesperrt');

  /* h) Ratgeber rund ums Aufmaß: Stand je Seite, Abbildungen, keine Eingaben, IndexNow, llms.txt, Glossar der App */
  const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const deutsch = (d) => { const [j, m, t] = d.split('-').map(Number); return t + '. ' + MONATE[m - 1] + ' ' + j; };
  const standFehler = [];
  for (const sx of seo.SEITEN.filter((x) => /^\/ratgeber\/.+/.test(x.pfad))) {
    const t = (await roh(sx.pfad)).text, art = ldjson(t).flatMap((x) => (x && x['@graph']) || []).find((x) => x['@type'] === 'Article');
    if (!art || art.dateModified !== sx.stand || !t.includes('Stand ' + deutsch(sx.stand)) || !t.includes('Stand: ' + deutsch(sx.stand))) standFehler.push(sx.pfad);
  }
  ok(!standFehler.length && seo.SEITEN.every((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.stand)), 'Jede Ratgeberseite: Stand in der Sitemap = dateModified im JSON-LD = „Stand“ auf der Seite' + (standFehler.length ? ' (abweichend: ' + standFehler.join(', ') + ')' : ''));
  /* Häufige Fragen: JSON-LD wortgleich mit dem sichtbaren Text (Google verlangt sichtbare Inhalte; KI-Assistenten zitieren beides) */
  const sichtbar = (h) => h.replace(/\s*<a href="#q\d+">\[\d+\]<\/a>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
  const faqFehler = [];
  let faqZahl = 0;
  for (const pf of seo.SEITEN.map((x) => x.pfad).filter((x) => /^\/(ratgeber|fuer-fensterbauer|app)\//.test(x))) {
    const t = (await roh(pf)).text, fragen = ldjson(t).flatMap((x) => (x && x['@graph']) || [x]).filter((x) => x && x['@type'] === 'FAQPage').flatMap((x) => x.mainEntity || []);
    const vis = new Map(Array.from(t.matchAll(/<summary>([\s\S]*?)<\/summary><div>([\s\S]*?)<\/div><\/details>/g)).map((m) => [sichtbar(m[1]), sichtbar(m[2])]));
    faqZahl += fragen.length;
    for (const q of fragen) if (vis.get(q.name) !== (q.acceptedAnswer || {}).text) faqFehler.push(pf + ' „' + q.name + '“');
  }
  ok(!faqFehler.length && faqZahl >= 40, 'Häufige Fragen (' + faqZahl + '): Antworten im JSON-LD wortgleich mit den sichtbaren Antworten, nur ohne Belegnummern' + (faqFehler.length ? ' (abweichend: ' + faqFehler.join(', ') + ')' : ''));
  const neueSeiten = ['/ratgeber/balkontuer-ausmessen/', '/ratgeber/fenster-mit-rollladen-ausmessen/', '/ratgeber/bestellmass-fenster/', '/ratgeber/din-links-rechts/', '/ratgeber/bruestungshoehe-fenster/'];
  const uebersicht = (await roh('/ratgeber/')).text, ausmessen = (await roh('/ratgeber/fenster-ausmessen/')).text, llAus = seo.llms('https://eeziframes.com', {});
  ok(neueSeiten.every((u) => seo.SEITEN.some((x) => x.pfad === u) && uebersicht.includes('href="' + u + '"') && ausmessen.includes('href="' + u + '"') && llAus.includes('(https://eeziframes.com' + u + ')')) && /## Kurze Antworten/.test(llAus) && /Balkon- und Terrassentüren/.test(llAus) && /PSK-Türen/.test(llAus), 'Neue Ratgeber (Balkontür, Rollladenkasten, Bestellmaß, DIN links/rechts, Brüstungshöhe): in Sitemap, Übersicht, Anleitung und llms.txt verlinkt; llms.txt mit kurzen Antworten und allen Elementarten');
  const bildFehler = [];
  for (const sx of seo.SEITEN.filter((x) => /^\/ratgeber\/.+/.test(x.pfad))) {
    const t = (await roh(sx.pfad)).text;
    for (const m of t.matchAll(/<img ([^>]*)>/g)) {
      const src = (m[1].match(/src="([^"]+)"/) || [])[1], alt = (m[1].match(/alt="([^"]*)"/) || [])[1] || '';
      const r = src ? await fetch(BASE + src) : null;
      if (!src || !r || r.status !== 200 || !/image\/svg\+xml/.test(r.headers.get('content-type') || '') || r.headers.get('x-robots-tag') || alt.length < 40 || !/width="\d+" height="\d+"/.test(m[1])) bildFehler.push(sx.pfad + ' ' + src);
    }
  }
  const bildDa = (await Promise.all(neueSeiten.concat(['/ratgeber/fenster-ausmessen/']).map(async (u) => /<figure class="rg-bild"><img /.test((await roh(u)).text)))).every(Boolean);
  ok(!bildFehler.length && bildDa, 'Abbildungen in den Ratgebern: Datei da (SVG), ohne noindex für die Bildersuche, Breite, Höhe und ein beschreibender Alternativtext' + (bildFehler.length ? ' (' + bildFehler.join(', ') + ')' : ''));
  const key = await roh('/' + seo.INDEXNOW + '.txt');
  const aufrufe = [], post = async (u, o) => { aufrufe.push({ u: u, o: o }); return { ok: true, status: 200 }; };
  const tag = (d, plus) => new Date(Date.parse(d) + plus * 864e5);
  const ohne = await seo.indexnow({}, post, tag(seo.STAND, 0)), mit = await seo.indexnow({ INDEXIERUNG: '1' }, post, tag(seo.STAND, 1)), spaet = await seo.indexnow({ INDEXIERUNG: '1' }, post, tag(seo.STAND, 5));
  const body = aufrufe.length === 1 ? JSON.parse(aufrufe[0].o.body) : {}, sollUrls = seo.SEITEN.filter((x) => { const t = (Date.parse(seo.STAND) + 864e5 - Date.parse(x.stand)) / 864e5; return t >= 0 && t <= 2; }).map((x) => 'https://eeziframes.com' + x.pfad);
  ok(key.status === 200 && key.text.trim() === seo.INDEXNOW && /^[0-9a-f]{32}$/.test(seo.INDEXNOW) && ohne.gemeldet === 0 && spaet.gemeldet === 0 && mit.gemeldet === sollUrls.length && aufrufe.length === 1 && aufrufe[0].u === 'https://api.indexnow.org/indexnow' && body.host === 'eeziframes.com' && body.key === seo.INDEXNOW && body.keyLocation === 'https://eeziframes.com/' + seo.INDEXNOW + '.txt' && JSON.stringify(body.urlList) === JSON.stringify(sollUrls), 'IndexNow: Schlüsseldatei da; gemeldet wird nur mit Freigabe und nur in den zwei Tagen nach einer Änderung, mit den geänderten Seiten (' + sollUrls.length + ')');
  /* Ratgeber ohne Eingaben: keine Formulare, keine leeren Tabellen zum Ausfüllen, keine Vorlage zum Ausdrucken, kein Rechner (das Aufmaß entsteht in der App) */
  const eingabeFehler = [];
  for (const pf of seo.SEITEN.map((x) => x.pfad).filter((x) => /^\/(ratgeber|fuer-fensterbauer)\//.test(x))) {
    const t = (await roh(pf)).text;
    if (/<(form|input|select|textarea)\b|contenteditable|rg-leer|rechner\.js|<td><\/td>/i.test(t)) eingabeFehler.push(pf);
  }
  const ohneRechner = (await fetch(BASE + '/assets/rechner.js')).status === 404, bm = (await roh('/ratgeber/bestellmass-fenster/')).text, ab2 = (await roh('/ratgeber/aufmassblatt-fenster/')).text;
  ok(!eingabeFehler.length && ohneRechner && /bis 1,5 m<\/td><td data-k="weiß">10 mm/.test(bm) && /Gibt es hier eine Vorlage zum Ausdrucken\?<\/summary><div><p>Nein\./.test(ab2) && /Aufmaßblatt in der App erstellen/.test(ab2) && !/Vorlage für drei Fenster/.test(ab2), 'Ratgeber ohne Eingaben: keine Formulare, keine leeren Tabellen, keine Vorlage zum Ausdrucken, kein Rechner; das Aufmaßblatt entsteht in der App' + (eingabeFehler.length ? ' (' + eingabeFehler.join(', ') + ')' : ''));
  const gctx = await browser.newContext(telefon), gp = await neueSeite(gctx);
  await gp.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await gp.evaluate(() => { S.gloss = 'dinlr'; render(); }); await gp.waitForTimeout(200);
  const gl1 = await gp.evaluate(() => { const a = document.querySelector('.sheet a[href="/ratgeber/din-links-rechts/"]'); return !!a && a.target === '_blank' && /noopener/.test(a.rel) && a.getBoundingClientRect().height >= 44; });
  await gp.evaluate(() => { S.betrieb = { name: 'Fensterbau Test', code: 'x' }; S.gloss = 'dinlr'; render(); }); await gp.waitForTimeout(150);
  const gl2 = await gp.evaluate(() => !document.querySelector('.sheet a[href^="/ratgeber/"]'));
  await gp.evaluate(() => { S.betrieb = null; S.gloss = 'dk'; render(); }); await gp.waitForTimeout(150);
  const gl3 = await gp.evaluate(() => !document.querySelector('.sheet a[href^="/ratgeber/"]'));
  ok(gl1 && gl2 && gl3, 'Glossar der App: „Ausführlich im Ratgeber“ bei passenden Begriffen (neuer Tab, Ziel ab 44 px), nicht im Kundenlink eines Betriebs und nicht bei Begriffen ohne Seite');
  sauber(gp, 'Glossar mit Ratgeber-Links ohne Fehler'); await gctx.close();

}

/* ---------- 11. Stripe-Anbindung: gegen ein nachgestelltes Stripe im selben Prozess (scripts/stripe-attrappe.mjs) ---------- */
if (teil(11)) {
  console.log('11. Stripe-Anbindung (Stripe nachgestellt)');
  const { stripeNachstellen } = await import('./stripe-attrappe.mjs');
  const st = stripeNachstellen();
  try {
    const { api } = await import('../functions/api/router.js'), ko = await import('../functions/api/konten.js'), umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), stM = await import('../functions/api/stripe.js');
    const X = globalThis.Abrechnung, W = 'whsec_pruefung', B = 'https://eeziframes.com';
    const fs11 = await import('node:fs'), path11 = await import('node:path'), url11 = await import('node:url'), W11 = path11.resolve(path11.dirname(url11.fileURLToPath(import.meta.url)), '..');
    const env = { STRIPE_SECRET_KEY: 'sk_test_pruefung11', STRIPE_WEBHOOK_SECRET: W, DATEN_ATTRAPPE: '1', FREISCHALT_GEHEIMNIS: 'pruefung' };
    const k = umg.konfig(env), sp = spM.speicher(k), zd = stM.zahlungsdienst(k);
    const rufe = async (pfad, body, token, e) => { const h = { accept: 'application/json', origin: B }; if (body) h['content-type'] = 'application/json'; if (token) h.authorization = 'Bearer ' + token; const r = await api(new Request(B + pfad, { method: body ? 'POST' : 'GET', headers: h, body: body ? JSON.stringify(body) : undefined }), e || env, null); return Object.assign({ _status: r.status }, await r.json().catch(() => ({}))); };
    const senden = async (w) => { const r = await api(new Request(B + '/api/zahlung/webhook', { method: 'POST', headers: { 'stripe-signature': w.kopf, 'content-type': 'application/json' }, body: w.roh }), env, null); return Object.assign({ _status: r.status }, await r.json().catch(() => ({}))); };
    const hook = (typ, obj, id) => senden(st.webhook(W, typ, obj, id)), thin = (typ, art, objektId) => senden(st.thin(W, typ, art, objektId));
    const kassenSeit = (n) => st.log.slice(n).filter((e) => e.method === 'POST' && e.pfad === '/checkout/sessions');
    const tok = (m) => 'test.' + Buffer.from(m, 'utf8').toString('base64').replace(/=+$/, '');
    const monat = X.monthKey(), jetzt = Math.floor(Date.now() / 1000), sitzung = (r) => r.url.split('/').pop();
    const registrieren = async (mail, firma, tel) => (await rufe('/api/konto/registrieren', { firma: firma, ap: 'Sina Stripe', tel: tel, plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, tok(mail))).konto.id;

    // a) Status: Testmodus am Schlüssel erkannt
    const s1 = await rufe('/api/status'), s2 = await rufe('/api/status', null, null, { STRIPE_SECRET_KEY: ' sk_live_beispiel ' });
    ok(s1.zahlung && s1.testmodus === true && s1.webhook === true && s2.zahlung && s2.testmodus === false && s2.webhook === false, '/api/status: Testmodus am Schlüssel erkannt (sk_test_… ja, sk_live_… nein), Webhook-Geheimnis eingetragen');

    // b) Aufmaßblatt: Steuersatz legt der Server selbst an, SEPA bleibt draußen, Nachweis erst nach der Zahlung, Zahlung unterwegs
    let n0 = st.log.length;
    const TK = tok('kauf@beispiel.de'), sichern11 = (kennung) => rufe('/api/kunde/aufmass/' + kennung, { windows: [{ wid: 'w1', name: 'Fenster' }], proj: {}, stand: Date.now() }, TK);
    for (const k of ['pruef11abc', 'pruef11def', 'pruef11ghi']) await sichern11(k);
    const k0 = await rufe('/api/zahlung/start', { ...KASSE, mail: 'kauf@beispiel.de', kennung: 'pruef11abc' });
    ok(k0._status === 401 && k0.anmelden && kassenSeit(n0).length === 0, 'Aufmaßblatt nur mit Konto: ohne Anmeldung keine Kasse (401)');
    const k1 = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11abc' }, TK);
    const kasse = kassenSeit(n0)[0], inkl = st.db.steuern.find((t) => t.metadata.eeziframes === 'mwst19-inkl');
    ok(kasse.p.customer_email === 'kauf@beispiel.de' && kasse.p.metadata.nutzer && kasse.p.metadata.kennung === 'pruef11abc', 'Kasse für das Konto: Rechnung an seine E-Mail, Konto und Aufmaß in den Metadaten');
    ok(k1.ok && /^https:\/\/checkout\.stripe\.com\//.test(k1.url) && kasse.version === '2024-06-20' && kasse.p.payment_method_types.join() === 'card' && kasse.p.submit_type === 'pay' && kasse.p.line_items[0].price_data.unit_amount === '799' && !!inkl && inkl.inclusive && inkl.percentage === 19 && kasse.p.line_items[0].tax_rates[0] === inkl.id && kasse.p.invoice_creation.enabled === 'true', 'Aufmaßblatt: Kasse über 7,99 € mit selbst angelegtem Steuersatz 19 % inklusive, mit Rechnung, nur mit den Zahlungsarten aus ZAHLARTEN (Standard Karte, keine SEPA-Lastschrift), Zahlknopf „Bezahlen“');
    const besch11 = ((kasse.p.invoice_creation || {}).invoice_data || {}).description || '';
    ok(besch11.includes('„' + RECHT.ZUSTIMMUNG + '“') && besch11.includes('Stand ' + RECHT.standText(RECHT.AGB_STAND)) && /\/agb\//.test(besch11) && kasse.p.metadata.agb === RECHT.AGB_STAND && kasse.p.metadata.zustimmung === RECHT.ZUSTIMMUNG && !isNaN(Date.parse(kasse.p.metadata.zustimmung_zeit)), 'Zustimmung an der Kasse im Wortlaut mit Stand der AGB auf der Rechnung und mit Zeitpunkt in den Metadaten der Kasse (Nachweis auch ohne Datenbank)');
    ok(st.log.slice(n0).every((e) => e.auth === 'Basic ' + Buffer.from('sk_test_pruefung11:').toString('base64')) && st.log.slice(n0).every((e) => e.version === '2024-06-20'), 'Anfragen an Stripe mit dem Geheimschlüssel und fester API-Version 2024-06-20');
    /* Zustimmung ist Pflicht und muss zur geltenden Fassung passen; die Zahlung hält sie fest */
    await sichern11('pruef11zst'); n0 = st.log.length;
    const ohneZ = await rufe('/api/zahlung/start', { kennung: 'pruef11zst' }, TK), altZ = await rufe('/api/zahlung/start', { kennung: 'pruef11zst', agb: '2020-01-01', zustimmung: RECHT.ZUSTIMMUNG }, TK), andersZ = await rufe('/api/zahlung/start', { kennung: 'pruef11zst', agb: RECHT.AGB_STAND, zustimmung: 'Ich will sofort.' }, TK);
    const zRow = await sp.zahlungHolen(sitzung(k1));
    ok(ohneZ._status === 400 && ohneZ.zustimmung && altZ._status === 409 && altZ.neuLaden && altZ.recht.agb === RECHT.AGB_STAND && altZ.recht.zustimmung === RECHT.ZUSTIMMUNG && andersZ._status === 409 && kassenSeit(n0).length === 0 && zRow.daten.zustimmung.agb === RECHT.AGB_STAND && zRow.daten.zustimmung.text === RECHT.ZUSTIMMUNG, 'Kasse nur mit Zustimmung: ohne 400, mit alter Fassung oder anderem Wortlaut 409 samt geltender Fassung; die Zahlung hält Stand, Wortlaut und Zeitpunkt fest');
    /* Echtes Geld (sk_live_…) erst, wenn Mailversand, Umsatzsteuer, Konten und Rechtstexte stehen */
    const dateien11 = { fetch: async (req) => { const u = new URL(req.url), f = path11.join(W11, 'web', u.pathname, u.pathname.endsWith('/') ? 'index.html' : ''); try { return new Response(fs11.readFileSync(f, 'utf8'), { status: 200 }); } catch (e) { return new Response('', { status: 404 }); } } };
    const live1 = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11zst' }, TK, Object.assign({}, env, { STRIPE_SECRET_KEY: 'sk_live_pruefung11' }));
    /* Rechtstexte mit Platzhaltern nachgestellt (die echten sind inzwischen vollständig, siehe unten) */
    const platzhalter11 = { fetch: async () => new Response('<main><p>Telefon: <mark class="ph">[Telefonnummer]</mark>, E-Mail: <mark class="ph">[E-Mail-Adresse folgt]</mark></p></main>', { status: 200 }) };
    const live2 = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11zst' }, TK, Object.assign({}, env, { STRIPE_SECRET_KEY: 'sk_live_pruefung11', MAIL_API_KEY: 're_pruefung', MAIL_ABSENDER: 'kontakt@eeziframes.com', MWST: '19', ASSETS: platzhalter11 }));
    const liveS = await rufe('/api/status', null, null, Object.assign({}, env, { STRIPE_SECRET_KEY: 'sk_live_pruefung11', ASSETS: platzhalter11 }));
    ok(live1._status === 503 && live1.gesperrt && live2._status === 503 && kassenSeit(n0).length === 0 && liveS.verkauf.live && !liveS.verkauf.bereit && liveS.verkauf.fehlt.some((t) => /E-Mail-Versand/.test(t)) && liveS.verkauf.fehlt.some((t) => /MWST=0/.test(t)) && liveS.verkauf.fehlt.some((t) => /Telefonnummer/.test(t) && /E-Mail-Adresse/.test(t)), 'Live-Modus: Kasse bleibt zu ohne Mailversand und festgelegte Umsatzsteuer und solange in den Rechtstexten Telefonnummer oder E-Mail-Adresse fehlen; /api/status nennt, was fehlt');
    const live3 = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11zst' }, TK, Object.assign({}, env, { STRIPE_SECRET_KEY: 'sk_live_pruefung11', MAIL_API_KEY: 're_pruefung', MAIL_ABSENDER: 'kontakt@eeziframes.com', MWST: '19' }));
    ok(live3.ok && kassenSeit(n0).length === 1, 'Live-Modus mit Mailversand, Umsatzsteuer und Konten (Rechtstexte hier nicht gelesen): die Kasse öffnet');
    const echt11 = await RECHT.rechtstexteFertig({ ASSETS: dateien11 }, 'https://echte-rechtstexte.test');
    ok(echt11.ok && !echt11.fehlt.length, 'Die echten Rechtstexte haben keine Platzhalter mehr (E-Mail-Adresse und Telefonnummer eingetragen): im Live-Modus öffnet die Kasse, sobald Mailversand und Umsatzsteuer stehen');
    const cs1 = sitzung(k1), vor = await rufe('/api/zahlung/pruefen?session=' + cs1 + '&kennung=pruef11abc');
    st.abschliessen(cs1);
    const bez = await rufe('/api/zahlung/pruefen?session=' + cs1 + '&kennung=pruef11abc'), fremdK = await rufe('/api/zahlung/pruefen?session=' + cs1 + '&kennung=pruef11zzz');
    ok(vor.bezahlt === false && !vor.wartet && bez.bezahlt === true && (bez.token || '').length === 32 && bez.mail === 'kauf@beispiel.de' && fremdK.bezahlt === false && !fremdK.token && fremdK.anderes && fremdK.kennung === 'pruef11abc', 'Aufmaßblatt: vor der Zahlung kein Nachweis, danach Nachweis vom Server, aber nur für das Projekt, das bezahlt hat (sonst der Hinweis auf das andere)');
    /* Rückkehr in einen Browser, in dem gerade ein anderes Aufmaß offen ist: der Kauf landet trotzdem am bezahlten Aufmaß im Konto */
    await sichern11('pruef11jkl');
    const kJ = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11jkl' }, TK), csJ = sitzung(kJ); st.abschliessen(csJ);
    const prJ = await rufe('/api/zahlung/pruefen?session=' + csJ + '&kennung=pruef11def'), gJ = await rufe('/api/kunde/aufmass/pruef11jkl', null, TK), gD = await rufe('/api/kunde/aufmass/pruef11def', null, TK);
    ok(prJ.anderes && prJ.kennung === 'pruef11jkl' && !prJ.token && gJ.bezahlt && gJ.bezahlt.session === csJ && !gD.bezahlt, 'Bezahlt, während im Browser ein anderes Aufmaß offen ist: der Kauf steht am bezahlten Aufmaß im Konto, das offene bleibt zu');
    const k2 = await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11def' }, TK), cs2 = sitzung(k2);
    st.abschliessen(cs2, { zahlung: 'processing' });
    const unterwegs = await rufe('/api/zahlung/pruefen?session=' + cs2 + '&kennung=pruef11def');
    ok(unterwegs.bezahlt === false && unterwegs.wartet === true && st.db.steuern.filter((t) => t.metadata.eeziframes === 'mwst19-inkl').length === 1, 'Zahlung noch unterwegs: kein Nachweis, aber „wartet“ statt „abgebrochen“; der Steuersatz wird nicht doppelt angelegt');
    n0 = st.log.length;
    await rufe('/api/zahlung/start', { ...KASSE, kennung: 'pruef11ghi' }, TK, Object.assign({}, env, { MWST: '0', STRIPE_SECRET_KEY: 'sk_test_kleinunternehmer' }));
    const kasse0 = kassenSeit(n0)[0];
    ok(!kasse0.p.line_items[0].tax_rates && !kasse0.p.line_items[0].price_data.tax_behavior && /§ 19 UStG/.test((kasse0.p.invoice_creation.invoice_data || {}).footer || '') && !st.log.slice(n0).some((e) => e.pfad === '/tax_rates'), 'Kleinunternehmer (MWST=0): kein Steuersatz, Hinweis nach § 19 UStG auf der Rechnung');

    // c) Betrieb: Zahlungsart per Webhook (der Betrieb schließt das Fenster), danach die Rückkehr; fremde und alte Kassen
    const T = tok('stripe11@beispiel.de'), bid = await registrieren('stripe11@beispiel.de', 'Fensterbau Stripe', '0221 5551111');
    const T2 = tok('fremd11@beispiel.de'), bid2 = await registrieren('fremd11@beispiel.de', 'Glaserei Fremd', '0221 5552222');
    await sp.betriebAendern(bid, (a) => { a.freeUsed = 3; const l = { id: 'lS1', code: 'st11a', nr: 'P-2026-001', kunde: 'Familie Stripe', status: 'gesendet', log: {} }; a.links.push(l); X.receiveAufmass(a, l, { windows: [X.fromApp({ name: 'Küche' })], proj: {}, fotos: 2, elemente: 1 }); });
    ok(X.lockedLinks((await sp.betriebHolen(bid)).daten).length === 1, 'Betrieb ohne Zahlungsart: das vierte Aufmaß wartet gesperrt');
    n0 = st.log.length;
    const z = await rufe('/api/konto/zahlungsart', {}, T), csZ = sitzung(z), zk = kassenSeit(n0)[0], kunde = st.db.kunden.get(zk.p.customer);
    ok(zk.p.mode === 'setup' && zk.p.payment_method_types.join() === 'sepa_debit,card' && zk.p.metadata.betrieb === bid && !!kunde && kunde.metadata.betrieb === bid && kunde.preferred_locales[0] === 'de' && !kunde.invoice_settings.footer, 'Zahlungsart: ein Stripe-Kunde je Betrieb, Kasse für SEPA-Lastschrift oder Karte');
    st.abschliessen(csZ);
    const fremdZ = await rufe('/api/konto/zahlungsart/pruefen?session=' + csZ, null, T2);
    ok(fremdZ._status === 403 && !(await sp.betriebHolen(bid2)).daten.pay, 'Die Kasse eines anderen Betriebs schaltet nichts frei (403)');
    const h1 = await hook('checkout.session.completed', st.db.kassen.get(csZ)), nachH = await sp.betriebHolen(bid);
    ok(h1._status === 200 && nachH.daten.pay && nachH.daten.pay.type === 'SEPA-Lastschrift' && nachH.daten.pay.session === csZ && nachH.daten.pay.frei === 1 && !X.lockedLinks(nachH.daten).length && !!st.db.kunden.get(kunde.id).invoice_settings.default_payment_method, 'Webhook „Kasse abgeschlossen“: Zahlungsart übernommen, wartendes Aufmaß frei, Standard für Rechnungen gesetzt, auch ohne Rückkehr');
    const zur = await rufe('/api/konto/zahlungsart/pruefen?session=' + csZ, null, T), nachZ = await sp.betriebHolen(bid);
    ok(zur.ok && zur.n === 1 && nachZ.daten.book.filter((b) => b.kind === 'aufmass' && b.betrag === 9).length === 1, 'Rückkehr danach: meldet dieselbe Freischaltung, bucht nichts doppelt');
    // Eine ältere Kasse kommt nach einer neueren an (Stripe stellt nach einem Fehler erneut zu): ändert nichts
    const za = await rufe('/api/konto/zahlungsart', {}, T), csAlt = sitzung(za), zn = await rufe('/api/konto/zahlungsart', {}, T), csNeu = sitzung(zn);
    st.abschliessen(csAlt); st.abschliessen(csNeu, { art: 'card' });
    await rufe('/api/konto/zahlungsart/pruefen?session=' + csNeu, null, T);
    const pmNeu = st.db.kunden.get(kunde.id).invoice_settings.default_payment_method, hAlt = await hook('checkout.session.completed', st.db.kassen.get(csAlt)), nachAlt = await sp.betriebHolen(bid);
    ok(hAlt._status === 200 && nachAlt.daten.pay.type === 'Karte' && nachAlt.daten.pay.session === csNeu && st.db.kunden.get(kunde.id).invoice_settings.default_payment_method === pmNeu, 'Spät zugestellte ältere Kasse überschreibt weder die neuere Zahlungsart noch den Standard bei Stripe');

    // d) Abo 10 und Plus: Preise legt der Server selbst an (lookup_key mit Betrag), Steuersatz 19 % exklusiv
    n0 = st.log.length;
    const pl = await rufe('/api/konto/plan', { plan: 'abo' }, T), csA = sitzung(pl), ak = kassenSeit(n0)[0];
    const preisAbo = st.db.preise.find((x) => x.lookup_key === 'eeziframes_abo_4900_eur_monat'), exkl = st.db.steuern.find((t) => t.metadata.eeziframes === 'mwst19');
    ok(ak.p.mode === 'subscription' && !!preisAbo && preisAbo.unit_amount === 4900 && preisAbo.recurring.interval === 'month' && preisAbo.tax_behavior === 'exclusive' && ak.p.line_items[0].price === preisAbo.id && !!exkl && !exkl.inclusive && ak.p.subscription_data.default_tax_rates[0] === exkl.id && ak.p.subscription_data.metadata.betrieb === bid, 'Abo 10: Monatspreis 49 € und Steuersatz 19 % exklusiv legt der Server selbst an');
    const pl2 = await rufe('/api/konto/plan', { plan: 'abo' }, T), csA2 = sitzung(pl2);
    ok(st.db.kassen.get(csA).status === 'expired' && st.db.kassen.get(csA2).status === 'open', 'Neue Abo-Kasse: die ältere offene verfällt (zwei bezahlte Kassen ergäben zwei Abos)');
    const fertigA = st.abschliessen(csA2), sub = st.db.abos.get(fertigA.subscription);
    // Stripe meldet die bezahlte Abo-Rechnung vor dem Abschluss der Kasse (die Reihenfolge ist nicht garantiert)
    const neuForm = (id) => ({ id: id, object: 'invoice', number: 'EEZI-' + id, created: jetzt, metadata: {}, parent: { type: 'subscription_details', quote_details: null, subscription_details: { metadata: { betrieb: bid, plan: 'abo' }, subscription: sub.id } } });
    const hFrueh = await hook('invoice.paid', neuForm('in_frueh'));
    const fremdA = await rufe('/api/konto/plan/pruefen?session=' + csA2 + '&plan=abo', null, T2);
    const h2 = await hook('checkout.session.completed', st.db.kassen.get(csA2)), nachA = await sp.betriebHolen(bid), aboB = nachA.daten.book.filter((b) => b.kind === 'abo');
    ok(fremdA._status === 403 && X.konto((await sp.betriebHolen(bid2)).daten) === 'service' && !(await sp.betriebHolen(bid2)).stripe_subscription, 'Das Abo eines anderen Betriebs lässt sich nicht übernehmen (403)');
    ok(hFrueh._status === 200 && h2._status === 200 && X.konto(nachA.daten) === 'abo' && nachA.stripe_subscription === sub.id && aboB.length === 1 && aboB[0].status === 'bezahlt', 'Webhook: Abo aktiv, auch wenn der Betrieb das Fenster schließt; die vorher gemeldete Zahlung zählt, der Monat steht als bezahlt da');
    const zurA = await rufe('/api/konto/plan/pruefen?session=' + csA2 + '&plan=abo', null, T);
    ok(zurA.ok && zurA.ergebnis.msg === 'Abo 10 aktiv' && (await sp.betriebHolen(bid)).daten.book.filter((b) => b.kind === 'abo').length === 1, 'Rückkehr danach: „Abo 10 aktiv“, kein zweiter Monatsbetrag');
    await rufe('/api/konto/plan', { plan: 'plus' }, T);
    const preisPlus = st.db.preise.find((x) => x.lookup_key === 'eeziframes_plus_7900_eur_monat'), aendern = st.log.filter((e) => e.method === 'POST' && e.pfad === '/subscriptions/' + sub.id).pop();
    ok(!!preisPlus && sub.items.data[0].price.id === preisPlus.id && sub.metadata.plan === 'plus' && aendern.p.default_tax_rates[0] === exkl.id && st.db.preise.filter((x) => x.lookup_key === 'eeziframes_abo_4900_eur_monat').length === 1 && st.db.steuern.filter((t) => t.metadata.eeziframes === 'mwst19').length === 1, 'Wechsel auf Plus: Preis 79 € angelegt, dasselbe Abo bei Stripe umgestellt (mit Steuersatz), nichts doppelt');
    ok(aendern.p.proration_behavior === 'create_prorations', 'Wechsel nach oben (Abo 10 → Plus): sofort, Stripe rechnet den Unterschied anteilig ab');
    /* Wechsel nach unten und Kündigung: zum Ende des Abrechnungsmonats bei Stripe, ohne Ausgleich; Rücknahme stellt alles wieder her */
    const ende11 = X.datum(sub.current_period_end * 1000), aboPost = () => st.log.filter((e) => e.method === 'POST' && e.pfad === '/subscriptions/' + sub.id).pop();
    const runter = await rufe('/api/konto/plan', { plan: 'abo' }, T), runterE = aboPost(), nachR = await sp.betriebHolen(bid);
    ok(runter.ergebnis.art === 'vorgemerkt' && runterE.p.proration_behavior === 'none' && sub.items.data[0].price.id === preisAbo.id && X.konto(nachR.daten) === 'plus' && nachR.daten.downgrade.to === 'abo' && nachR.daten.downgrade.at === ende11 && runter.ergebnis.msg.includes(ende11), 'Wechsel zu Abo 10: bei Stripe ohne Ausgleich zum kleineren Preis, im Konto bleibt Plus bis zum Ende des Abrechnungsmonats (' + ende11 + ')');
    const wieder11 = await rufe('/api/konto/plan', { plan: 'plus' }, T), wiederE = aboPost(), nachW = await sp.betriebHolen(bid);
    ok(wieder11.ergebnis.art === 'bleibt' && wiederE.p.proration_behavior === 'none' && sub.items.data[0].price.id === preisPlus.id && !nachW.daten.downgrade && X.konto(nachW.daten) === 'plus', 'Wechsel zurückgenommen: wieder Plus bei Stripe, ohne Ausgleich, nichts mehr vorgemerkt');
    const kuend11 = await rufe('/api/konto/plan', { plan: 'service' }, T), nachK = await sp.betriebHolen(bid);
    ok(kuend11.ergebnis.art === 'vorgemerkt' && sub.cancel_at_period_end === true && nachK.daten.downgrade.to === 'service' && nachK.daten.downgrade.at === ende11 && X.konto(nachK.daten) === 'plus', 'Kündigung: bei Stripe zum Ende des Abrechnungsmonats (' + ende11 + '), bis dahin bleibt der Tarif');
    const bleibt11 = await rufe('/api/konto/plan', { plan: 'plus' }, T), nachB = await sp.betriebHolen(bid);
    ok(bleibt11.ergebnis.art === 'bleibt' && sub.cancel_at_period_end === false && !nachB.daten.downgrade, 'Kündigung zurückgenommen: das Abo läuft weiter');

    // e) Abo-Rechnung bezahlt: Ereignis in beiden Formen (bis 2025-02 subscription_details, seit 2025-03-31 parent.subscription_details)
    const altForm = { id: 'in_alt', object: 'invoice', number: 'EEZI-ALT', created: jetzt, metadata: {}, subscription: sub.id, subscription_details: { metadata: { betrieb: bid, plan: 'plus' } } };
    ok(ko.betriebVon(altForm) === bid && ko.aboVon(altForm) === sub.id && ko.betriebVon(neuForm('x')) === bid && ko.aboVon(neuForm('x')) === sub.id, 'Webhook liest Betrieb und Abo aus beiden Formen einer Abo-Rechnung');
    const h3 = await hook('invoice.paid', neuForm('in_neu')), nachP = await sp.betriebHolen(bid), monatlich = nachP.daten.book.filter((b) => (b.kind === 'abo' || b.kind === 'plus') && b.month === monat);
    ok(h3._status === 200 && monatlich.length === 2 && monatlich.every((b) => b.status === 'bezahlt'), 'Abo-Rechnung bezahlt (neue Form): Monatsbetrag und Aufpreis als bezahlt markiert');

    // f) Webhook: Unterschrift, altes Abo, Fehler beim Verarbeiten, doppelte Zustellung
    const falsch = await api(new Request(B + '/api/zahlung/webhook', { method: 'POST', headers: { 'stripe-signature': 't=1,v1=00' }, body: '{}' }), env, null);
    const alt1 = await hook('customer.subscription.deleted', { id: 'sub_alt', object: 'subscription', metadata: { betrieb: bid } });
    ok(falsch.status === 400 && alt1._status === 200 && X.konto((await sp.betriebHolen(bid)).daten) === 'plus', 'Webhook: falsche Unterschrift abgewiesen; ein altes Abo endet, der Tarif bleibt');
    const z2 = await rufe('/api/konto/zahlungsart', {}, T), csZ2 = sitzung(z2); st.abschliessen(csZ2, { art: 'card' });
    st.fehlerBei((e) => e.method === 'GET' && e.pfad === '/checkout/sessions/' + csZ2);
    const h6 = await hook('checkout.session.completed', st.db.kassen.get(csZ2), 'evt_pruef_wieder');
    st.fehlerBei(null);
    const h7 = await hook('checkout.session.completed', st.db.kassen.get(csZ2), 'evt_pruef_wieder'), h8 = await hook('checkout.session.completed', st.db.kassen.get(csZ2), 'evt_pruef_wieder');
    ok(h6._status >= 500 && h7._status === 200 && !h7.doppelt && h8.doppelt === true && (await sp.betriebHolen(bid)).daten.pay.session === csZ2, 'Webhook: schlägt die Verarbeitung fehl, kommt die erneute Zustellung durch; danach zählt dasselbe Ereignis als doppelt');
    const pmKarte = st.db.kunden.get(kunde.id).invoice_settings.default_payment_method;
    ok(sub.default_payment_method.id === pmKarte && st.db.zahlarten.get(pmKarte).type === 'card', 'Neue Zahlungsart gilt auch für das laufende Abo (Stripe zieht Abos von der Zahlungsart des Abos ein)');
    const spaetA = await hook('checkout.session.completed', st.db.kassen.get(csA2), 'evt_spaet_abo_laufend'), nachSA = await sp.betriebHolen(bid);
    ok(spaetA._status === 200 && st.db.kunden.get(kunde.id).invoice_settings.default_payment_method === pmKarte && nachSA.daten.pay.session === csZ2 && X.konto(nachSA.daten) === 'plus', 'Spät erneut zugestellte Abo-Kasse: ändert weder Tarif noch Zahlungsart (Standard bei Stripe bleibt die neuere Karte)');

    // g) Sammelrechnung: Entwurf, Posten daran, abschließen; ein Fehler bei einem Betrieb hält die anderen nicht auf
    X.setPreise(k.preise);
    const buchung = (id, text) => ({ id: id, kind: 'aufmass', ref: id, when: 'heute', month: monat, text: text || 'Aufmaß · Test', sub: '', betrag: 9, badge: 'nächste Rechnung', status: 'offen' });
    await sp.betriebAendern(bid, (a) => { a.book.unshift(Object.assign(buchung('bS1', 'Aufmaß · Familie Eins'), { sub: 'P-2026-011' }), buchung('bS2', 'Aufmaß · Familie Zwei')); });
    const kaputt = await sp.betriebAnlegen({ auth_user: 'u-kaputt11', mail: 'kaputt11@beispiel.de', name: 'Kaputt GmbH', plz: '50667', tel_norm: '', name_norm: 'kaputt11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bK1')], rechnungen: [], notif: [] } });
    await sp.betriebFelder(kaputt.id, { stripe_customer: 'cus_gibtsnicht' });
    const abbruch = await sp.betriebAnlegen({ auth_user: 'u-abbruch11', mail: 'abbruch11@beispiel.de', name: 'Abbruch GmbH', plz: '50667', tel_norm: '', name_norm: 'abbruch11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bA1'), buchung('bA2')], rechnungen: [], notif: [] } });
    const cusAb = await zd.kundeAnlegen({ id: abbruch.id, mail: 'abbruch11@beispiel.de', name: 'Abbruch GmbH' }); await sp.betriebFelder(abbruch.id, { stripe_customer: cusAb });
    st.fehlerBei((e) => e.method === 'POST' && /\/finalize$/.test(e.pfad) && (st.db.rechnungen.get(e.pfad.split('/')[2]) || {}).customer === cusAb);
    const lauf = await ko.abrechnungslauf(k, sp, zd);
    st.fehlerBei(null);
    const cus = nachP.stripe_customer, rech = [...st.db.rechnungen.values()].filter((r) => r.customer === cus), re = rech[0] || {};
    const posten = [...st.db.posten.values()].filter((it) => it.invoice === re.id), anlegen = st.log.find((e) => e.method === 'POST' && e.pfad === '/invoices' && e.p.customer === cus) || { p: {} };
    ok(lauf.rechnungen === 1 && lauf.fehler === 2 && rech.length === 1 && re.status === 'open' && posten.length === 3 && posten.every((it) => it.metadata.buchung && it.tax_rates[0].id === exkl.id) && anlegen.p.pending_invoice_items_behavior === 'exclude' && anlegen.p.auto_advance === 'false', 'Sammelrechnung bei Stripe: Entwurf ohne fremde offene Posten, drei Posten mit Buchungs-Kennung und 19 % daran, abgeschlossen');
    const meine = await sp.betriebHolen(bid), reDb = meine.daten.rechnungen[0] || {};
    ok(reDb.nr === re.number && reDb.betrag === 32.13 && reDb.pos === 3 && /^https:/.test(reDb.url) && meine.daten.book.filter((b) => ['bS1', 'bS2'].includes(b.id)).every((b) => b.status === 'berechnet' && b.rechnung === re.number) && /Sammelrechnung/.test(meine.daten.notif[0].t), 'Sammelrechnung im Konto: Nummer von Stripe, 32,13 € (27 € netto zzgl. 19 %), Buchungen als berechnet, Meldung');
    const k2r = await sp.betriebHolen(kaputt.id), abr = await sp.betriebHolen(abbruch.id);
    ok(k2r.daten.book[0].status === 'offen' && abr.daten.book.every((b) => b.status === 'offen') && ![...st.db.rechnungen.values()].some((r) => r.customer === cusAb) && ![...st.db.posten.values()].some((it) => it.customer === cusAb), 'Fehler bei zwei Betrieben halten den dritten nicht auf; Entwurf und Posten des abgebrochenen sind gelöscht (auch keine offenen Posten übrig), seine Buchungen bleiben offen');
    // Schon bei Stripe berechnet, aber nicht gespeichert (z. B. Datenbank kurz weg): Zahlung kommt zu früh, der nächste Lauf trägt nur nach
    await sp.betriebAendern(bid, (a) => { a.book.unshift(buchung('bS3', 'Aufmaß · Familie Drei')); });
    const nurStripe = await zd.rechnung({ id: bid, customer: cus, posten: [{ buchung: 'bS3', betrag: 9, text: 'Aufmaß · Familie Drei' }] });
    const zuFrueh = await hook('invoice.paid', { id: nurStripe.neu.id, object: 'invoice', number: nurStripe.neu.nr, created: jetzt, metadata: { betrieb: bid, art: 'sammelrechnung' }, parent: null }, 'evt_zu_frueh');
    /* liegengebliebener offener Posten aus einem früheren Aufräumen: wird gelöscht, nicht berechnet */
    await fetch('https://api.stripe.com/v1/invoiceitems', { method: 'POST', headers: { 'Stripe-Version': '2024-06-20' }, body: 'customer=' + cusAb + '&amount=900&currency=eur&metadata[betrieb]=' + abbruch.id + '&metadata[buchung]=bA1' });
    const vorher = [...st.db.rechnungen.values()].filter((r) => r.customer === cus).length;
    await ko.abrechnungslauf(k, sp, zd);
    const meine2 = await sp.betriebHolen(bid), b3 = meine2.daten.book.find((b) => b.id === 'bS3');
    ok(zuFrueh._status === 503 && !!nurStripe.neu && [...st.db.rechnungen.values()].filter((r) => r.customer === cus).length === vorher && b3.status === 'berechnet' && b3.rechnung === nurStripe.neu.nr && meine2.daten.rechnungen.some((r) => r.id === nurStripe.neu.id), 'Schon bei Stripe, aber nicht gespeichert: die zu frühe Zahlungsmeldung wird später erneut zugestellt (503), der nächste Lauf legt keine zweite Rechnung an, sondern trägt nach');
    const abRech = [...st.db.rechnungen.values()].filter((r) => r.customer === cusAb), abPosten = [...st.db.posten.values()].filter((it) => it.customer === cusAb);
    ok(abRech.length === 1 && abPosten.length === 2 && abPosten.every((it) => it.invoice === abRech[0].id) && (await sp.betriebHolen(abbruch.id)).daten.book.every((b) => b.status === 'berechnet'), 'Nächster Lauf für den abgebrochenen Betrieb: genau eine Rechnung mit zwei Posten, der liegengebliebene offene Posten ist gelöscht');
    const zuFrueh2 = await hook('invoice.paid', { id: nurStripe.neu.id, object: 'invoice', number: nurStripe.neu.nr, created: jetzt, metadata: { betrieb: bid, art: 'sammelrechnung' }, parent: null }, 'evt_zu_frueh');
    ok(zuFrueh2._status === 200 && (await sp.betriebHolen(bid)).daten.book.find((b) => b.id === 'bS3').status === 'bezahlt', 'Erneute Zustellung der Zahlungsmeldung nach dem Eintragen: bezahlt');
    // Guthaben deckt die Rechnung (etwa nach einer anteiligen Gutschrift): sofort bezahlt
    const guthaben = await sp.betriebAnlegen({ auth_user: 'u-guthaben11', mail: 'guthaben11@beispiel.de', name: 'Guthaben GmbH', plz: '50667', tel_norm: '', name_norm: 'guthaben11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bG1')], rechnungen: [], notif: [] } });
    const cusG = await zd.kundeAnlegen({ id: guthaben.id, mail: 'guthaben11@beispiel.de', name: 'Guthaben GmbH' }); await sp.betriebFelder(guthaben.id, { stripe_customer: cusG }); st.guthaben(cusG, 5000);
    await ko.abrechnungslauf(k, sp, zd);
    const g = await sp.betriebHolen(guthaben.id);
    ok(g.daten.rechnungen[0].status === 'bezahlt' && g.daten.book[0].status === 'bezahlt', 'Rechnung beim Abschließen schon bezahlt (Guthaben): steht gleich als bezahlt da');
    const h9 = await hook('invoice.paid', { id: re.id, object: 'invoice', number: re.number, created: jetzt, metadata: { betrieb: bid, art: 'sammelrechnung' }, parent: null });
    const meine3 = await sp.betriebHolen(bid);
    ok(h9._status === 200 && meine3.daten.rechnungen.find((r) => r.id === re.id).status === 'bezahlt' && meine3.daten.book.filter((b) => b.rechnung === re.number).every((b) => b.status === 'bezahlt'), 'Sammelrechnung bezahlt: Rechnung und ihre Buchungen als bezahlt markiert');

    // h) Thin-Ereignisse (von Stripe für neue Ziele empfohlen): der Server holt das Objekt selbst
    n0 = st.log.length;
    const t1 = await thin('invoice.paid', 'invoice', re.id);
    ok(t1._status === 200 && st.log.slice(n0).some((e) => e.method === 'GET' && e.pfad === '/invoices/' + re.id && e.version === '2024-06-20'), 'Thin-Ereignis „v1.invoice.paid“: Rechnung bei Stripe in der festen Version nachgeschlagen');
    const z3 = await rufe('/api/konto/zahlungsart', {}, T), csZ3 = sitzung(z3); st.abschliessen(csZ3);
    const t4 = await thin('checkout.session.completed', 'checkout.session', csZ3), nachT = await sp.betriebHolen(bid);
    ok(t4._status === 200 && nachT.daten.pay.session === csZ3 && nachT.daten.pay.type === 'SEPA-Lastschrift', 'Thin-Ereignis „v1.checkout.session.completed“: neue Zahlungsart übernommen');
    const t3 = await senden({ roh: '{"id":"evt_x","object":"v2.core.event","type":"v1.invoice.paid","related_object":{"id":"in_x","type":"invoice","url":"/v1/invoices/in_x"}}', kopf: 't=' + jetzt + ',v1=' + 'ab'.repeat(32) });
    ok(t3._status === 400, 'Thin-Ereignis ohne gültige Unterschrift wird abgewiesen');

    // i) Abo endet; eine spät zugestellte Kasse des beendeten Abos ändert nichts; ein bei Stripe laufendes Abo wird übernommen statt verdoppelt
    st.aboBeenden(sub.id);
    const t2 = await thin('customer.subscription.deleted', 'subscription', sub.id), nachE = await sp.betriebHolen(bid);
    ok(t2._status === 200 && X.konto(nachE.daten) === 'service' && !nachE.stripe_subscription, 'Thin-Ereignis „v1.customer.subscription.deleted“ für das aktuelle Abo: zurück auf Start');
    const spaet = await hook('checkout.session.completed', st.db.kassen.get(csA2), 'evt_spaet_abo'), nachS = await sp.betriebHolen(bid);
    ok(spaet._status === 200 && X.konto(nachS.daten) === 'service' && !nachS.stripe_subscription, 'Spät zugestellte Kasse eines beendeten Abos: Tarif bleibt Start, kein totes Abo im Konto');
    const laufend = st.abschliessen(sitzung(await (async () => { const r = await zd.aboKasse({ id: bid, customer: cus, plan: 'abo', zurueck: B + '/' }); return r; })()));
    n0 = st.log.length;
    const ueber = await rufe('/api/konto/plan', { plan: 'plus' }, T), nachU = await sp.betriebHolen(bid);
    ok(ueber.ok && !ueber.url && kassenSeit(n0).length === 0 && nachU.stripe_subscription === laufend.subscription && X.konto(nachU.daten) === 'plus' && st.db.abos.get(laufend.subscription).metadata.plan === 'plus', 'Läuft bei Stripe schon ein Abo (Rückmeldung verloren): wird übernommen und umgestellt, keine zweite Kasse');
    /* Wettlauf zweier Kassen: ein zweites Abo läuft an; das erste bleibt im Konto, der Betrieb bekommt einen Hinweis */
    const zweite = await (await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { 'Stripe-Version': '2024-06-20' }, body: 'mode=subscription&customer=' + cus + '&line_items[0][price]=' + preisAbo.id + '&line_items[0][quantity]=1&metadata[art]=abo&metadata[betrieb]=' + bid + '&metadata[plan]=abo&subscription_data[metadata][betrieb]=' + bid + '&subscription_data[metadata][plan]=abo' })).json();
    st.abschliessen(zweite.id);
    const hZ = await hook('checkout.session.completed', st.db.kassen.get(zweite.id)), nachZw = await sp.betriebHolen(bid);
    ok(hZ._status === 200 && nachZw.stripe_subscription === laufend.subscription && X.konto(nachZw.daten) === 'plus' && /Zweites Abo/.test(nachZw.daten.notif[0].t), 'Zweites laufendes Abo (Wettlauf zweier Kassen): das erste bleibt im Konto, Hinweis an den Betrieb');
    // j) Zwei Abrechnungsläufe zur selben Zeit (Cron und „jetzt abrechnen“ in der Zentrale): eine Rechnung, keine doppelten Posten
    const gleich = await sp.betriebAnlegen({ auth_user: 'u-gleich11', mail: 'gleich11@beispiel.de', name: 'Gleichzeitig GmbH', plz: '50667', tel_norm: '', name_norm: 'gleich11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bQ1'), buchung('bQ2')], rechnungen: [], notif: [] } });
    const cusQ = await zd.kundeAnlegen({ id: gleich.id, mail: 'gleich11@beispiel.de', name: 'Gleichzeitig GmbH' }); await sp.betriebFelder(gleich.id, { stripe_customer: cusQ });
    const zwei = await Promise.all([ko.abrechnungslauf(k, sp, zd, gleich.id), ko.abrechnungslauf(k, sp, zd, gleich.id)]);
    const rQ = [...st.db.rechnungen.values()].filter((r) => r.customer === cusQ), pQ = [...st.db.posten.values()].filter((it) => it.customer === cusQ), gQ = await sp.betriebHolen(gleich.id);
    ok(rQ.length === 1 && rQ[0].status === 'open' && pQ.length === 2 && pQ.every((it) => it.invoice === rQ[0].id) && gQ.daten.book.every((b) => b.status === 'berechnet' && b.rechnung === rQ[0].number) && gQ.daten.rechnungen.length === 1 && zwei.some((r) => r.rechnungen === 1), 'Zwei Abrechnungsläufe gleichzeitig: eine Rechnung mit zwei Posten, nichts doppelt (der zweite Lauf bekommt dieselbe Rechnung oder bricht ohne Wirkung ab)');
    // k) Ein Lauf scheitert heute schon einmal (Entwurf aufgeräumt), danach laufen zwei gleichzeitig: wieder genau eine Rechnung
    const nach = await sp.betriebAnlegen({ auth_user: 'u-nach11', mail: 'nach11@beispiel.de', name: 'Nachher GmbH', plz: '50667', tel_norm: '', name_norm: 'nach11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bN1'), buchung('bN2'), buchung('bN3')], rechnungen: [], notif: [] } });
    const cusN = await zd.kundeAnlegen({ id: nach.id, mail: 'nach11@beispiel.de', name: 'Nachher GmbH' }); await sp.betriebFelder(nach.id, { stripe_customer: cusN });
    let nPost = 0; st.fehlerBei((e) => e.method === 'POST' && e.pfad === '/invoiceitems' && e.p.customer === cusN && ++nPost === 2);
    const erst = await ko.abrechnungslauf(k, sp, zd, nach.id);
    st.fehlerBei(null);
    const leerN = [...st.db.rechnungen.values()].filter((r) => r.customer === cusN).length;
    const zweiN = await Promise.all([ko.abrechnungslauf(k, sp, zd, nach.id), ko.abrechnungslauf(k, sp, zd, nach.id)]);
    const rN = [...st.db.rechnungen.values()].filter((r) => r.customer === cusN), pN = [...st.db.posten.values()].filter((it) => it.customer === cusN), gN = await sp.betriebHolen(nach.id);
    ok(erst.fehler === 1 && leerN === 0 && rN.length === 1 && rN[0].status === 'open' && pN.length === 3 && pN.every((it) => it.invoice === rN[0].id) && gN.daten.book.every((b) => b.status === 'berechnet' && b.rechnung === rN[0].number) && gN.daten.rechnungen.length === 1 && zweiN.filter((r) => r.rechnungen === 1).length === 1, 'Erst ein gescheiterter Lauf (Entwurf gelöscht), dann zwei gleichzeitig: genau eine Rechnung mit drei Posten, der zweite Lauf bricht ohne Wirkung ab');
    // l) Zentrale „Jetzt abrechnen“: Scheitert Stripe, sagt die Zentrale das (statt „Nichts abzurechnen“); der nächste Versuch rechnet ab
    const envZ = Object.assign({}, env, { ZENTRALE_PASSWORT: 'pruefung-zentrale-11' });
    const zRufe = async (pfad, body, keks) => { const r = await api(new Request(B + pfad, { method: body ? 'POST' : 'GET', headers: Object.assign({ accept: 'application/json', origin: B, 'x-zentrale': '1', 'cf-connecting-ip': '198.51.100.11' }, body ? { 'content-type': 'application/json' } : {}, keks ? { cookie: keks } : {}), body: body ? JSON.stringify(body) : undefined }), envZ, null); return Object.assign({ _status: r.status, _kopf: r.headers }, await r.json().catch(() => ({}))); };
    const zAn = await zRufe('/api/zentrale/anmelden', { passwort: 'pruefung-zentrale-11' }), zKeks = (zAn._kopf.get('set-cookie') || '').split(';')[0];
    const zb = await sp.betriebAnlegen({ auth_user: 'u-zentrale11', mail: 'zentrale11@beispiel.de', name: 'Zentrale GmbH', plz: '50667', tel_norm: '', name_norm: 'zentrale11', daten: { konto: 'service', pay: { type: 'Karte', label: 'x' }, links: [], book: [buchung('bZ1')], rechnungen: [], notif: [] } });
    const cusZ = await zd.kundeAnlegen({ id: zb.id, mail: 'zentrale11@beispiel.de', name: 'Zentrale GmbH' }); await sp.betriebFelder(zb.id, { stripe_customer: cusZ });
    st.fehlerBei((e) => e.method === 'POST' && /\/finalize$/.test(e.pfad) && (st.db.rechnungen.get(e.pfad.split('/')[2]) || {}).customer === cusZ);
    const zFehl = await zRufe('/api/zentrale/betriebe/' + zb.id + '/abrechnen', {}, zKeks), zVor = await sp.betriebHolen(zb.id);
    st.fehlerBei(null);
    const zOk = await zRufe('/api/zentrale/betriebe/' + zb.id + '/abrechnen', {}, zKeks), zNach = await sp.betriebHolen(zb.id), zProt = (await sp.protokollLesen({ betrieb: zb.id, anzahl: 10 })) || [];
    ok(/^__Host-zentrale=/.test(zKeks) && zFehl._status === 502 && /^Abrechnung fehlgeschlagen: /.test(zFehl.fehler || '') && zVor.daten.book[0].status === 'offen' && zOk._status === 200 && zOk.ergebnis.rechnungen === 1 && zNach.daten.book[0].status === 'berechnet' && zProt.some((e) => e.art === 'abrechnung' && e.text === 'Abrechnung fehlgeschlagen') && zProt.some((e) => e.art === 'abrechnung' && e.text === 'Sammelrechnung erstellt'), 'Zentrale „Jetzt abrechnen“: Scheitert Stripe, stehen der Grund im Dialog und „Abrechnung fehlgeschlagen“ im Protokoll, die Buchung bleibt offen; der nächste Versuch rechnet ab');
    if (process.env.STRIPE_PROTOKOLL) (await import('node:fs')).writeFileSync(process.env.STRIPE_PROTOKOLL, JSON.stringify(st.log, null, 1));
  } catch (e) {
    ok(false, 'Stripe-Anbindung ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally {
    st.aus();
  }
}

/* ---------- 12. Supabase-Schlüssel: neue (sb_secret_…, sb_publishable_…) und frühere (JWT), Verwechslungen ---------- */
if (teil(12)) {
  console.log('12. Supabase-Schlüssel und Hinweise in /api/status');
  const umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), au = await import('../functions/api/auth.js'), { api } = await import('../functions/api/router.js');
  const echt = globalThis.fetch, anfragen = [];
  globalThis.fetch = async (url, init) => {
    const u = new URL(typeof url === 'string' ? url : url.url);
    if (!u.hostname.endsWith('.supabase.co')) return echt(url, init);
    anfragen.push({ pfad: u.pathname + u.search, kopf: Object.assign({}, (init && init.headers) || {}) });
    if (u.pathname === '/auth/v1/user') return new Response(JSON.stringify({ id: 'u-1', email: 'Chef@Beispiel.de' }), { status: 200, headers: { 'content-type': 'application/json' } });
    if (u.pathname === '/auth/v1/otp') return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    return new Response('[{"id":"b-1","daten":{}}]', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const jwt = (rolle) => 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify({ role: rolle, iss: 'supabase' })).toString('base64url') + '.signatur';
    // neue Schlüssel: nur apikey, Adresse bereinigt, Anmeldung ohne Publishable Key nimmt den geheimen
    const kNeu = umg.konfig({ SUPABASE_URL: ' https://abc.supabase.co/rest/v1/ ', SUPABASE_SECRET_KEY: ' sb_secret_pruef ' });
    const row = await spM.speicher(kNeu).betriebHolen('b-1'); const a1 = anfragen.pop();
    ok(kNeu.daten && kNeu.supabase.url === 'https://abc.supabase.co' && row.id === 'b-1' && a1.pfad.startsWith('/rest/v1/betriebe?id=eq.b-1') && a1.kopf.apikey === 'sb_secret_pruef' && !a1.kopf.Authorization, 'Neuer geheimer Schlüssel (sb_secret_…): Datenbank-Anfragen nur mit apikey, ohne Authorization; Adresse mit /rest/v1 und Leerzeichen bereinigt');
    await au.codeSenden(kNeu, null, 'chef@beispiel.de'); const a2 = anfragen.pop();
    const kPub = umg.konfig({ SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_SECRET_KEY: 'sb_secret_pruef', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_pruef' });
    await au.codeSenden(kPub, null, 'chef@beispiel.de'); const a3 = anfragen.pop();
    const n = await au.nutzer(kPub, 'nutzer-jwt-pruef'); const a4 = anfragen.pop();
    await au.codeSenden(kPub, null, 'chef@beispiel.de', 'https://eeziframes.com/'); const aZ = anfragen.pop();
    ok(aZ.pfad === '/auth/v1/otp?redirect_to=' + encodeURIComponent('https://eeziframes.com/'), 'Anmeldelink führt auf die Seite zurück, von der aus angefordert wurde (redirect_to)');
    ok(a2.pfad === '/auth/v1/otp' && a2.kopf.apikey === 'sb_secret_pruef' && !a2.kopf.Authorization && a3.kopf.apikey === 'sb_publishable_pruef' && !a3.kopf.Authorization && a4.pfad === '/auth/v1/user' && a4.kopf.apikey === 'sb_publishable_pruef' && a4.kopf.Authorization === 'Bearer nutzer-jwt-pruef' && n.mail === 'chef@beispiel.de', 'Anmeldung mit neuen Schlüsseln: Code anfordern nur mit apikey (Publishable Key, sonst der geheime), Sitzung prüfen mit dem Token des Betriebs');
    // frühere Schlüssel (JWT) unter den alten Namen: wie bisher auch als Authorization
    const kAlt = umg.konfig({ SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_SERVICE_KEY: jwt('service_role'), SUPABASE_ANON_KEY: jwt('anon') });
    await spM.speicher(kAlt).betriebHolen('b-1'); const a5 = anfragen.pop();
    await au.codeSenden(kAlt, null, 'chef@beispiel.de'); const a6 = anfragen.pop();
    ok(kAlt.daten && a5.kopf.apikey === jwt('service_role') && a5.kopf.Authorization === 'Bearer ' + jwt('service_role') && a6.kopf.apikey === jwt('anon') && a6.kopf.Authorization === 'Bearer ' + jwt('anon'), 'Frühere Schlüssel (service_role und anon als JWT, alte Variablennamen) gehen weiter wie bisher');
    // Verwechslungen: abgelehnt und in /api/status benannt, ohne Werte
    const st = async (env) => (await (await api(new Request('https://eeziframes.com/api/status'), env, null)).json());
    const v1 = await st({ SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_SECRET_KEY: 'sb_publishable_pruef' }), v2 = await st({ SUPABASE_URL: 'https://abc.supabase.co', SUPABASE_SERVICE_KEY: jwt('anon') });
    const v3 = await st({ STRIPE_SECRET_KEY: 'pk_test_pruef', STRIPE_WEBHOOK_SECRET: 'sk_test_falsch' }), v4 = await st({ STRIPE_SECRET_KEY: 'sk_test_pruef', STRIPE_WEBHOOK_SECRET: 'pruef' }), v5 = await st({ SUPABASE_URL: 'abc.supabase.co' }), v6 = await st({});
    const alle = JSON.stringify([v1, v2, v3, v4, v5]);
    ok(!v1.daten && /SUPABASE_SECRET_KEY/.test(v1.hinweise.join()) && !v2.daten && /öffentliche Schlüssel/.test(v2.hinweise.join()) && !v3.zahlung && /veröffentlichbare/.test(v3.hinweise.join()) && v4.zahlung && /whsec_/.test(v4.hinweise.join()) && /SUPABASE_SECRET_KEY fehlt/.test(v5.hinweise.join()) && /https:/.test(v5.hinweise.join()) && v6.hinweise === undefined && !/sb_publishable_pruef|pk_test_pruef|sk_test_pruef/.test(alle), '/api/status benennt verwechselte oder fehlende Schlüssel, ohne einen Wert zu zeigen; öffentliche Schlüssel am falschen Platz werden nicht benutzt');
  } catch (e) {
    ok(false, 'Supabase-Schlüssel ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally {
    globalThis.fetch = echt;
  }
}

/* ---------- 13. Zentrale des Inhabers: Zugang, Betriebe, Sperren, Löschen, Export, Statistik ohne Cookies, Protokoll ---------- */
if (teil(13)) {
  console.log('13. Zentrale des Inhabers');
  const { api } = await import('../functions/api/router.js'), umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), ze = await import('../functions/api/zentrale.js'), stat = await import('../functions/api/statistik.js');
  const B = 'https://eeziframes.com', PW = 'pruef-passwort-zentrale-13', GEHEIM = 'JBSWY3DPEHPK3PXPJBSWY3DP', stempel = Date.now().toString(36), seoSperre = (await import('../functions/seo.js')).SPERRE;
  const env = { DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW, FREISCHALT_GEHEIMNIS: 'pruef13' }, env2 = Object.assign({}, env, { ZENTRALE_2FA: GEHEIM });
  let ipNr = 1; const neueIp = () => '198.51.100.' + (ipNr++);
  const rufe = async (pfad, o) => {
    o = o || {}; const h = Object.assign({ accept: 'application/json', origin: B, 'cf-connecting-ip': o.ip || '192.0.2.10' }, o.kopf || {});
    if (o.body) h['content-type'] = 'application/json';
    if (o.cookie) { h.cookie = o.cookie; if (o.z !== false) h['x-zentrale'] = '1'; }
    if (o.token) h.authorization = 'Bearer ' + o.token;
    const r = await api(new Request(B + pfad, { method: o.method || (o.body ? 'POST' : 'GET'), headers: h, body: o.body ? JSON.stringify(o.body) : undefined }), o.env || env, null);
    const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch (e) { j = null; }
    return Object.assign({ _status: r.status, _kopf: r.headers, _text: text }, j || {});
  };
  const anmelden = async (e, pw, code, ip) => { const r = await rufe('/api/zentrale/anmelden', { body: { passwort: pw, code: code || '' }, env: e, ip: ip || neueIp() }); const sc = r._kopf.get('set-cookie') || ''; return { r: r, sc: sc, cookie: sc.split(';')[0] }; };
  const tok = (m) => 'test.' + Buffer.from(m, 'utf8').toString('base64').replace(/=+$/, '');
  const ruhe = () => new Promise((r) => setTimeout(r, 30)); // Zähler laufen nach der Antwort weiter
  const sp = spM.speicher(umg.konfig(env));
  const fenster = [{ name: 'Küche', etage: 'eg', mo: { hm: 1440, hl: 1442, hr: 1438, wm: 1260, wt: 1262, wb: 1258 }, el: { w: 1230, h: 1410 }, fotos: 2 }, { name: 'Bad', etage: 'og', mo: { hm: 900, hl: 900, hr: 900, wm: 800, wt: 800, wb: 800 }, el: { w: 770, h: 870 }, fotos: 2 }];
  const anzahl = (liste, name) => ((liste || []).find((x) => x.schluessel === name || x.name === name) || { n: 0 }).n;
  try {
    // a) Eingerichtet nur mit Passwort ab 12 Zeichen; /api/status verrät nichts über die Zentrale
    const s0 = await rufe('/api/zentrale/status', { env: { DATEN_ATTRAPPE: '1' } }), s1 = await rufe('/api/zentrale/status', { env: { DATEN_ATTRAPPE: '1', ZENTRALE_PASSWORT: 'zu-kurz-123' } }), a1 = await rufe('/api/zentrale/anmelden', { body: { passwort: 'zu-kurz-123' }, env: { DATEN_ATTRAPPE: '1', ZENTRALE_PASSWORT: 'zu-kurz-123' }, ip: neueIp() });
    const st = await rufe('/api/status', { env: { DATEN_ATTRAPPE: '1', ZENTRALE_PASSWORT: 'zu-kurz-123', ZENTRALE_2FA: 'kaputt' } });
    const s2 = await rufe('/api/zentrale/status', { env: { DATEN_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW, ZENTRALE_2FA: 'kein-base32!' } }), a2 = await rufe('/api/zentrale/anmelden', { body: { passwort: PW }, env: { DATEN_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW, ZENTRALE_2FA: 'kein-base32!' }, ip: neueIp() });
    ok(!s0.eingerichtet && s0.grund === 'fehlt' && !s1.eingerichtet && s1.grund === 'zu_kurz' && a1._status === 503 && !/ZENTRALE|zentrale/.test(st._text), 'Zentrale bleibt zu ohne Passwort oder mit weniger als 12 Zeichen; /api/status verrät nichts darüber');
    ok(!s2.eingerichtet && s2.grund === '2fa_ungueltig' && a2._status === 503, 'Ungültiger zweiter Faktor schließt die Zentrale, statt nur mit Passwort offen zu bleiben');
    // b) Ohne Sitzung nichts, ohne Kopfzeile x-zentrale nichts
    const zu = await Promise.all(['/api/zentrale/uebersicht', '/api/zentrale/betriebe', '/api/zentrale/statistik', '/api/zentrale/protokoll', '/api/zentrale/einstellungen', '/api/zentrale/kaeufe', '/api/zentrale/betriebe.csv'].map((p) => rufe(p)));
    ok(zu.every((r) => r._status === 403), 'Ohne Kopfzeile x-zentrale: jede Anfrage abgewiesen');
    const zu2 = await Promise.all(['/api/zentrale/uebersicht', '/api/zentrale/betriebe', '/api/zentrale/protokoll'].map((p) => rufe(p, { kopf: { 'x-zentrale': '1' } })));
    ok(zu2.every((r) => r._status === 401 && r.abgemeldet === true), 'Ohne Sitzung: 401, keine Daten');
    // c) Falsches Passwort: abgewiesen und protokolliert (gekürzte IP), nach fünf Versuchen gebremst
    const versuche = []; for (let i = 0; i < 6; i++) versuche.push(await rufe('/api/zentrale/anmelden', { body: { passwort: 'falsch-' + i + '-xxxxxxxx' }, ip: '203.0.113.7' }));
    ok(versuche.slice(0, 5).every((r) => r._status === 401 && !r._kopf.get('set-cookie')) && versuche[5]._status === 429, 'Falsches Passwort: abgewiesen ohne Cookie; nach fünf Versuchen je IP-Adresse gebremst (429)');
    // d) Richtiges Passwort: Sitzungs-Cookie nur für HTTPS, für Skripte unlesbar, nur von dieser Seite, 8 Stunden
    const an1 = await anmelden(env, PW);
    ok(an1.r._status === 200 && /^__Host-zentrale=[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+;/.test(an1.sc) && /; Path=\//.test(an1.sc) && /; Secure/.test(an1.sc) && /; HttpOnly/.test(an1.sc) && /; SameSite=Strict/.test(an1.sc) && /Max-Age=28800/.test(an1.sc), 'Anmeldung: Cookie __Host-zentrale (Secure, HttpOnly, SameSite=Strict, 8 Stunden)');
    const C = an1.cookie, mitC = (pfad, o) => rufe(pfad, Object.assign({ cookie: C }, o || {}));
    ok((await rufe('/api/zentrale/status', { cookie: C })).angemeldet === true && (await mitC('/api/zentrale/uebersicht', { z: false }))._status === 403, 'Mit Sitzung angemeldet; ohne x-zentrale trotz Cookie abgewiesen');
    // e) Gefälschte, abgelaufene oder mit anderem Passwort unterschriebene Sitzungen
    const schl = 'eeziframes-zentrale|' + PW + '||pruef13', unterschrift = async (n) => Buffer.from(await umg.hmac(schl, n)).toString('base64url');
    const nutz = (exp) => b64u(JSON.stringify({ v: 1, iat: Date.now() - 1000, exp: exp, z: false, n: 'pruef' }));
    const gut = nutz(Date.now() + 60000), alt = nutz(Date.now() - 1000);
    const echtSelbst = await rufe('/api/zentrale/uebersicht', { cookie: '__Host-zentrale=' + gut + '.' + (await unterschrift(gut)) });
    const abgelaufen = await rufe('/api/zentrale/uebersicht', { cookie: '__Host-zentrale=' + alt + '.' + (await unterschrift(alt)) });
    const gefaelscht = await rufe('/api/zentrale/uebersicht', { cookie: C.slice(0, -2) + (C.slice(-2) === 'AA' ? 'BB' : 'AA') });
    const anderesPw = await rufe('/api/zentrale/uebersicht', { cookie: C, env: Object.assign({}, env, { ZENTRALE_PASSWORT: PW + '-neu' }) });
    ok(echtSelbst._status === 200 && abgelaufen._status === 401 && gefaelscht._status === 401 && anderesPw._status === 401, 'Sitzung: abgelaufen, verändert oder nach einem Passwortwechsel ungültig');

    // f) Betriebe anlegen wie im echten Ablauf: zwei Projekte, ein Aufmaß aus der App, ein Link geöffnet; Zweitkonto mit gleicher Nummer
    const evVor = (await stat.auswerten(sp, 7)).ereignisse;
    const mailA = 'zentrale-a-' + stempel + '@beispiel.de', TA = tok(mailA), tel = '0221 9' + String(Date.now()).slice(-6), firmaA = 'Zentrale Prüf A ' + stempel;
    const regA = await rufe('/api/konto/registrieren', { body: { firma: firmaA, ap: 'Anna Prüf', tel: tel, plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: TA }), idA = regA.konto.id;
    const p1 = await rufe('/api/konto/projekte', { body: { kunde: 'Familie Geheim', kontakt: '0171 9999999', adresse: 'Geheimweg 7, 50667 Köln', plan: ['Fenster'], days: 14 }, token: TA });
    const p2 = await rufe('/api/konto/projekte', { body: { kunde: 'Herr Verborgen', kontakt: 'verborgen@beispiel.de', plan: ['Fenster'], days: 14 }, token: TA });
    const codeA1 = p1.konto.acc.links.find((l) => l.id === p1.id).code, codeA2 = p2.konto.acc.links.find((l) => l.id === p2.id).code;
    await rufe('/api/link/' + codeA2 + '/fortschritt', { body: { stufe: 'geoeffnet' } });
    const einA = await rufe('/api/aufmass', { body: { v: 1, b: codeA1, w: fenster, p: { name: 'Familie Geheim' }, t: Date.now() } });
    const mailB = 'zentrale-b-' + stempel + '@beispiel.de', TB = tok(mailB);
    const regB = await rufe('/api/konto/registrieren', { body: { firma: 'Zentrale Prüf B ' + stempel, ap: 'Bert Prüf', tel: tel, plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: TB }), idB = regB.konto.id;
    const pB = await rufe('/api/konto/projekte', { body: { kunde: 'Familie Wartet', plan: ['Fenster'], days: 14 }, token: TB }), codeB = pB.konto.acc.links.find((l) => l.id === pB.id).code;
    const einB = await rufe('/api/aufmass', { body: { v: 1, b: codeB, w: fenster.slice(0, 1), p: { name: 'Familie Wartet' }, t: Date.now() + 1 } });
    const TK13 = tok('kauf13@beispiel.de'); await rufe('/api/kunde/aufmass/pruef13kauf', { body: { windows: [{ wid: 'w1', name: 'Fenster' }], proj: {}, stand: Date.now() }, token: TK13 });
    const k1 = await rufe('/api/zahlung/start', { body: { ...KASSE, kennung: 'pruef13kauf' }, token: TK13 }), cs13 = new URL(k1.url).searchParams.get('bezahlt');
    await rufe('/api/zahlung/pruefen?session=' + cs13 + '&kennung=pruef13kauf'); await rufe('/api/zahlung/pruefen?session=' + cs13 + '&kennung=pruef13kauf');
    await ruhe();
    const evNach = (await stat.auswerten(sp, 7)).ereignisse, d = (n) => (evNach[n] || 0) - (evVor[n] || 0);
    ok(einA.ok && einB.ok && d('registrierung') === 2 && d('doppelkonto_verdacht') === 1 && d('projekt') === 3 && d('aufmass_gesendet') === 2 && d('link_geoeffnet') === 1 && d('kasse') === 1 && d('kauf') === 1, 'Vorgänge für die Statistik: Registrierungen (eine mit Doppelkonto-Verdacht), Projekte, Aufmaße, geöffneter Link, Kasse und Kauf (zweite Prüfung zählt nicht doppelt)');

    // g) Liste und Detail: Kennzahlen; Kunden der Betriebe nur als Projektnummer
    const liste = await mitC('/api/zentrale/betriebe'), zA = liste.betriebe.find((b) => b.id === idA), zB = liste.betriebe.find((b) => b.id === idB);
    ok(zA && zA.k.projekte === 2 && zA.k.verschickt === 2 && zA.k.geoeffnet === 2 && zA.k.aufmasse === 1 && zA.k.positionen === 2 && zA.k.fotos === 4 && zA.angemeldet && zA.anmeldungen === 1 && zA.tarif === 'service' && !zA.gesperrt, 'Liste: Projekte, verschickte und geöffnete Links, Aufmaße, Positionen, Fotos, letzte Anmeldung, Tarif');
    ok(zB && zB.doppelt === firmaA && zB.k.wartend === 1 && !zB.zahlungsart, 'Liste: Doppelkonto-Verdacht und ein Aufmaß, das auf eine Zahlungsart wartet');
    const detA = await mitC('/api/zentrale/betriebe/' + idA);
    ok(detA.ok && detA.betrieb.projekte.length === 2 && !/Geheim|Verborgen|Geheimweg|9999999/.test(detA._text) && /Aufmaß · P-\d{4}-\d{3}/.test(detA.betrieb.buchungen[0].text) && detA.betrieb.einblick === false && detA.betrieb.nachrichten === null, 'Detail ohne Daten der Endkunden: keine Namen, Kontakte oder Adressen, Buchungen mit Projektnummer, keine Mitteilungstexte');
    ok((await mitC('/api/zentrale/betriebe/gibts-nicht-1234'))._status === 404 && (await mitC('/api/zentrale/betriebe/x'))._status === 404, 'Unbekannter Betrieb: 404');
    const einOhne = await mitC('/api/zentrale/betriebe/' + idA + '/einblick', { body: { grund: 'Support-Anfrage des Betriebs' } });
    ok(einOhne._status === 403 && /zweite Faktor/.test(einOhne.fehler || ''), 'Einblick in Daten der Endkunden ohne zweiten Faktor: abgewiesen');

    // h) Sperren: Konto, Anmeldung und Kundenlinks ruhen, die Begründung sieht nur der Betrieb selbst
    ok((await mitC('/api/zentrale/betriebe/' + idA + '/sperren', { body: { grund: 'x' } }))._status === 400, 'Sperren ohne Begründung: abgewiesen');
    const sp1 = await mitC('/api/zentrale/betriebe/' + idA + '/sperren', { body: { grund: 'Rechnung seit acht Wochen offen' } });
    const kontoGesperrt = await rufe('/api/konto', { token: TA }), linkGesperrt = await rufe('/api/link/' + codeA2), amGesperrt = await rufe('/api/aufmass', { body: { v: 1, b: codeA2, w: fenster, p: {}, t: Date.now() + 2 } });
    await rufe('/api/konto/anmelden', { body: { mail: mailA }, ip: neueIp() }); const bestGesperrt = await rufe('/api/konto/bestaetigen', { body: { mail: mailA, code: '123456' }, ip: neueIp() });
    const fortGesperrt = await rufe('/api/link/' + codeA2 + '/fortschritt', { body: { stufe: 'arbeit', k: 2 } });
    ok(sp1.ok && sp1.betrieb.gesperrt && kontoGesperrt._status === 403 && kontoGesperrt.gesperrt === true && /gesperrt/.test(kontoGesperrt.fehler) && /acht Wochen/.test(kontoGesperrt.fehler) && bestGesperrt._status === 403 && /acht Wochen/.test(bestGesperrt.fehler), 'Gesperrt: kein Zugang zum Konto, auch nicht über eine neue Anmeldung; die Begründung steht in der Meldung');
    ok(linkGesperrt._status === 404 && /nicht aktiv/.test(linkGesperrt.fehler) && !/acht Wochen/.test(linkGesperrt._text) && amGesperrt._status === 404 && fortGesperrt.ok && (await sp.betriebHolen(idA)).daten.links.find((l) => l.code === codeA2).status === 'geoeffnet', 'Gesperrt: Kundenlinks ruhen ohne Begründung, kein Aufmaß, kein Fortschritt');
    const ent = await mitC('/api/zentrale/betriebe/' + idA + '/entsperren', { body: {} }), kontoFrei = await rufe('/api/konto', { token: TA });
    ok(ent.ok && !ent.betrieb.gesperrt && kontoFrei.ok && kontoFrei.konto.acc.verwaltung === undefined && /wieder frei/.test(kontoFrei.konto.acc.notif[0].t), 'Entsperrt: Konto wieder da, mit Mitteilung; Vermerke der Zentrale verlassen den Server nicht');
    // i) Notiz, Nachricht, Gutschrift, Doppelkonto-Verdacht aufheben
    await mitC('/api/zentrale/betriebe/' + idA + '/notiz', { body: { text: 'Telefonat am 15.10.: Rechnung kommt' } });
    const nach = await mitC('/api/zentrale/betriebe/' + idA + '/nachricht', { body: { titel: 'Neue Funktion', text: 'Ab heute gibt es die Zentrale.' } }), kontoN = await rufe('/api/konto', { token: TA });
    ok(nach.ok && nach.betrieb.notiz === 'Telefonat am 15.10.: Rechnung kommt' && kontoN.konto.acc.notif[0].t === 'Neue Funktion' && !kontoN._text.includes('Telefonat am 15.10.'), 'Interne Notiz bleibt in der Zentrale; Nachricht erscheint bei den Mitteilungen des Betriebs');
    const gut2 = await mitC('/api/zentrale/betriebe/' + idB + '/gutschrift', { body: { anzahl: 2, grund: 'Kulanz' } });
    const nachGut = await sp.betriebHolen(idB);
    ok(gut2.ok && gut2.freigeschaltet === 1 && nachGut.daten.freeQuota === 2 && !nachGut.daten.links[0].locked && /gutgeschrieben/.test(nachGut.daten.notif[0].t), 'Gutschrift: zwei kostenlose Projekte, das wartende Aufmaß ist sofort frei, Mitteilung an den Betrieb');
    const dop = await mitC('/api/zentrale/betriebe/' + idB + '/doppelkonto', { body: {} }), dopNein = await mitC('/api/zentrale/betriebe/' + idA + '/doppelkonto', { body: {} });
    ok(dop.ok && dop.betrieb.doppelt === '' && dop.betrieb.freiKontingent === 3 && dopNein._status === 400, 'Doppelkonto-Verdacht aufgehoben: übliche kostenlose Projekte; ohne Verdacht abgewiesen');
    ok((await mitC('/api/zentrale/betriebe/' + idB + '/abo', { body: { aktion: 'kuendigen' } }))._status === 400, 'Abo kündigen ohne Abo: abgewiesen');

    // j) Export (Art. 15/20) und Liste als CSV (ohne Formeln aus Eingaben)
    const exOhne = await mitC('/api/zentrale/betriebe/' + idA + '/export', { body: { grund: 'Auskunftsersuchen des Betriebs' } }), exGet = await mitC('/api/zentrale/betriebe/' + idA + '/export');
    ok(exOhne._status === 403 && /zweiten Faktor/.test(exOhne.fehler || '') && exGet._status === 404, 'Export enthält Kundendaten: ohne zweiten Faktor abgewiesen, nur per POST');
    const regC = await rufe('/api/konto/registrieren', { body: { firma: '=SUMME(1;2)', ap: 'Carl Prüf', tel: '0221 8' + String(Date.now()).slice(-6), plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: tok('zentrale-c-' + stempel + '@beispiel.de') });
    const csv = await mitC('/api/zentrale/betriebe.csv'), csvBytes = new Uint8Array(await (await api(new Request(B + '/api/zentrale/betriebe.csv', { headers: { cookie: C, 'x-zentrale': '1' } }), env, null)).arrayBuffer());
    ok(csv._status === 200 && /text\/csv/.test(csv._kopf.get('content-type')) && csvBytes[0] === 0xef && csvBytes[1] === 0xbb && csvBytes[2] === 0xbf && csv._text.includes('"Betrieb";"Ansprechpartner"') && csv._text.includes('"' + firmaA + '"') && csv._text.includes('"\'=SUMME(1;2)"') && !csv._text.includes('";"=SUMME'), 'CSV für Excel: Semikolon, UTF-8 mit BOM, Eingaben wie =… werden nicht zur Formel');
    // k) Löschen (Art. 17): nur mit dem Namen, danach weg; der Löschnachweis bleibt
    const falschL = await mitC('/api/zentrale/betriebe/' + idA + '/loeschen', { body: { bestaetigung: 'Falscher Name' } });
    const lo = await mitC('/api/zentrale/betriebe/' + idA + '/loeschen', { body: { bestaetigung: ' ' + firmaA.toUpperCase() + ' ', grund: 'Löschwunsch per E-Mail' } });
    const prot = await mitC('/api/zentrale/protokoll'), nachweis = prot.eintraege.find((e) => e.art === 'loeschen' && e.betrieb === idA), kontoWeg = await rufe('/api/konto', { token: TA });
    ok(falschL._status === 400 && (await sp.betriebHolen(idA)) === null && lo.ok && lo.geloescht === firmaA && nachweis && nachweis.daten.betrieb === firmaA && Array.isArray(nachweis.daten.rechnungen) && !JSON.stringify(nachweis).includes(mailA) && kontoWeg._status === 404, 'Löschen nur mit dem Namen; danach ist das Konto weg, der Löschnachweis (ohne E-Mail) steht im Protokoll');
    await mitC('/api/zentrale/betriebe/' + regC.konto.id + '/loeschen', { body: { bestaetigung: '=SUMME(1;2)' } });

    // l) Statistik ohne Cookies: was zählt und was nicht
    const vor = await stat.auswerten(sp, 7);
    const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    const aufruf = (pfad, kopf, method) => stat.seitenaufruf(new Request(B + pfad, { method: method || 'GET', headers: Object.assign({ 'user-agent': iphone }, kopf || {}) }), env);
    await aufruf('/app/', { referer: 'https://www.google.de/', 'cf-ipcountry': 'AT' });
    await aufruf('/ratgeber/fenster-ausmessen/', { referer: B + '/app/' });
    await aufruf('/', { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' });
    await aufruf('/', { dnt: '1' }); await aufruf('/', { 'sec-gpc': '1' }); await aufruf('/', { cookie: '__Host-zentrale=abc.def' }); await aufruf('/', { 'sec-purpose': 'prefetch' });
    await aufruf('/zentrale/'); await aufruf('/impressum/', {}, 'POST'); await aufruf('/llms.txt', { 'user-agent': 'ChatGPT-User/1.0' });
    await aufruf('/fuer-fensterbauer/?utm_source=newsletter'); await aufruf('/ratgeber/?utm_source=max.mustermann@gmail.com', { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36' }); await aufruf('/app/?von=pdf', { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36' });
    const nachS = await stat.auswerten(sp, 7), dS = (art, name) => anzahl(nachS[art], name) - anzahl(vor[art], name);
    ok(dS('herkunft', 'Kampagne: (andere)') === 1 && !JSON.stringify(nachS).includes('mustermann'), 'Kampagnen: nur bekannte Namen einzeln, alles andere als „(andere)“ (keine E-Mail-Adresse in der Statistik)');
    ok(nachS.summe.aufrufe - vor.summe.aufrufe === 5 && nachS.summe.besuche - vor.summe.besuche === 4 && dS('seiten', '/app/') === 2 && dS('seiten', '/ratgeber/fenster-ausmessen/') === 1 && dS('seiten', '/zentrale/') === 0, 'Statistik: Seitenaufrufe und Besuche (ein Aufruf von einer eigenen Seite ist kein neuer Besuch); die Zentrale zählt nicht');
    ok(dS('herkunft', 'Google') === 1 && dS('herkunft', 'Kampagne: newsletter') === 1 && dS('herkunft', 'Aufmaßblatt (QR-Code)') === 1 && dS('geraet', 'Telefon') === 2 && dS('geraet', 'Computer') === 2 && dS('browser', 'Safari') === 2 && dS('system', 'iOS') === 2 && dS('land', 'AT') === 1 && dS('bots', 'Google') === 1 && dS('dateien', '/llms.txt') === 1, 'Statistik: Herkunft (Suchmaschine, Kampagne, QR-Code des Aufmaßblatts), Gerät, Browser, System, Land, Bots als Familie, llms.txt');
    ok(nachS.summe.aufrufe - vor.summe.aufrufe === 5 && dS('herkunft', 'Direkt') === 0, 'Nicht gezählt: Do Not Track, Global Privacy Control, der angemeldete Inhaber, Vorab-Laden, POST');
    const roh = await stat.auswerten(Object.assign({}, sp, { statistikAuswerten: undefined }), 30), verd = await stat.auswerten(sp, 30);
    ok(JSON.stringify(roh.summe) === JSON.stringify(verd.summe) && JSON.stringify(roh.reihe) === JSON.stringify(verd.reihe) && JSON.stringify(roh.herkunft) === JSON.stringify(verd.herkunft) && JSON.stringify(roh.ereignisse) === JSON.stringify(verd.ereignisse), 'Auswertung verdichtet (Datenbankfunktion) und aus den einzelnen Tageszählern ergibt dasselbe');
    const stZ = await mitC('/api/zentrale/statistik?tage=30');
    ok(stZ.ok && stZ.tabelle && stZ.tage === 30 && stZ.reihe.length === 30 && stZ.reihe[29].aufrufe >= 4 && stZ.seiten.some((x) => x.name === 'App') && !/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(JSON.stringify(stZ)), 'Auswertung: 30 Tage als Reihe, Seiten mit Namen, keine IP-Adressen');

    // m) Übersicht, Käufe, Einstellungen, Protokoll
    const ue = await mitC('/api/zentrale/uebersicht');
    ok(ue.ok && ue.kpi.betriebe >= 1 && ue.kpi.kaeufe >= 1 && ue.wochen.length === 12 && ue.hinweise.some((h) => /Zweiter Faktor fehlt/.test(h.text)) && !ue._text.includes(PW), 'Übersicht: Kennzahlen, zwölf Wochen, Hinweis auf den fehlenden zweiten Faktor, kein Passwort');
    const ka = await mitC('/api/zentrale/kaeufe');
    ok(ka.ok && ka.kaeufe.some((x) => x.mail === 'kauf13@beispiel.de' && x.status === 'bezahlt' && x.betrag === 7.99) && ka.summe.anzahl >= 1, 'Käufe: Aufmaßblätter mit E-Mail, Betrag und Stand');
    const ei = await mitC('/api/zentrale/einstellungen');
    ok(ei.ok && ei.dienste.daten.art === 'attrappe' && ei.dienste.statistik === true && ei.dienste.protokoll === true && ei.zentrale.zweiFaktor === false && !ei._text.includes(PW) && !ei._text.includes('pruef13'), 'Einstellungen: Dienste und Tabellen, kein Passwort und kein Geheimnis in der Antwort');
    const pr = await mitC('/api/zentrale/protokoll'), arten = pr.eintraege.map((e) => e.art), fehl = pr.eintraege.find((e) => e.art === 'anmeldung_fehlgeschlagen' && e.netz === '203.0.113.0/24');
    ok(pr.tabelle && ['anmeldung', 'sperren', 'entsperren', 'notiz', 'nachricht', 'gutschrift', 'doppelkonto', 'liste_export', 'loeschen'].every((a) => arten.includes(a)) && fehl && !JSON.stringify(pr).includes('203.0.113.7') && pr.eintraege[0].zeit >= pr.eintraege[pr.eintraege.length - 1].zeit, 'Protokoll: Anmeldungen (IP nur gekürzt) und jeder Eingriff, neueste zuerst');
    const ab = await rufe('/api/zentrale/abmelden', { body: {}, cookie: C });
    ok(/__Host-zentrale=;.*Max-Age=0/.test(ab._kopf.get('set-cookie') || ''), 'Abmelden löscht das Cookie');

    // n) Zweiter Faktor (TOTP): Code nötig, nur einmal gültig; Einblick in Endkundendaten mit Anlass und Protokoll
    const schritt = Math.floor(Date.now() / 30000), richtig = await ze.totpCode(GEHEIM, schritt), falschCode = richtig === '123456' ? '654321' : '123456';
    const t1 = await anmelden(env2, PW, ''), t2 = await anmelden(env2, PW, falschCode), t3 = await anmelden(env2, PW, richtig), t4 = await anmelden(env2, PW, richtig);
    const zf = await rufe('/api/zentrale/status', { env: env2 });
    ok(zf.zweiFaktor === true && t1.r._status === 401 && t2.r._status === 401 && t3.r._status === 200 && t4.r._status === 401 && (await rufe('/api/zentrale/uebersicht', { cookie: C, env: env2 }))._status === 401, 'Zweiter Faktor: ohne oder mit falschem Code keine Anmeldung, jeder Code nur einmal; ältere Sitzungen ohne Faktor gelten nicht mehr');
    ok((await ze.totpCode('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 1)) === '287082' && (await ze.totpCode('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 37037036)) === '081804', 'TOTP rechnet wie RFC 6238 (Testvektoren für SHA-1)');
    const C2 = t3.cookie;
    const mailE = 'zentrale-e-' + stempel + '@beispiel.de', TE = tok(mailE), regE = await rufe('/api/konto/registrieren', { body: { firma: 'Zentrale Prüf E ' + stempel, ap: 'Eva Prüf', tel: '0221 7' + String(Date.now()).slice(-6), plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: TE });
    const pE = await rufe('/api/konto/projekte', { body: { kunde: 'Familie Einblick', kontakt: '0171 5555555', adresse: 'Lupenweg 3', plan: ['Fenster'], days: 14 }, token: TE }), codeE = pE.konto.acc.links.find((l) => l.id === pE.id).code;
    await rufe('/api/aufmass', { body: { v: 1, b: codeE, w: fenster, p: { name: 'Familie Einblick', notiz: 'Bitte Rollladen prüfen' }, t: Date.now() + 3 } });
    const codeJetzt = async () => { ze.codesVergessen(); return ze.totpCode(GEHEIM, Math.floor(Date.now() / 30000)); }; // jeder Code gilt einmal; die Prüfung wartet nicht auf den nächsten
    const wieder = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/einblick', { body: { grund: 'Support-Anfrage des Betriebs vom 15.10.', code: richtig }, cookie: C2, env: env2 });
    ok(wieder._status === 401 && /nur einmal/.test(wieder.fehler || ''), 'Der Code der Anmeldung gilt nicht noch einmal für den Einblick (ein abgefangener Anmeldecode öffnet keine Kundendaten)');
    const kurz = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/einblick', { body: { grund: 'x', code: await codeJetzt() }, cookie: C2, env: env2 });
    const ohneCode = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/einblick', { body: { grund: 'Support-Anfrage des Betriebs vom 15.10.' }, cookie: C2, env: env2 });
    const blick = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/einblick', { body: { grund: 'Support-Anfrage des Betriebs vom 15.10.', code: await codeJetzt() }, cookie: C2, env: env2 });
    ok(ohneCode._status === 401 && /Code/.test(ohneCode.fehler || ''), 'Einblick verlangt einen frischen Code aus der Authenticator-App');
    // Raten des Codes mit einer gestohlenen Sitzung: nach fünf falschen Codes ist die Sitzung beendet, jeder Versuch im Protokoll
    ze.codesVergessen(); const t5 = await anmelden(env2, PW, await ze.totpCode(GEHEIM, Math.floor(Date.now() / 30000))), C5 = t5.cookie, rateErg = [];
    const echteCodes = new Set(await Promise.all([-1, 0, 1].map((d) => ze.totpCode(GEHEIM, Math.floor(Date.now() / 30000) + d))));
    const falsche = ['111111', '222222', '333333', '444444', '555555', '666666', '777777'].filter((c) => !echteCodes.has(c)).slice(0, 5);
    for (const c of falsche) rateErg.push(await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/einblick', { body: { grund: 'Support-Anfrage des Betriebs', code: c }, cookie: C5, env: env2 }));
    const danach = await rufe('/api/zentrale/uebersicht', { cookie: C5, env: env2 }), protCode = await rufe('/api/zentrale/protokoll?art=code_falsch', { cookie: C2, env: env2 });
    ok(t5.r._status === 200 && rateErg.every((r) => r._status === 401) && rateErg[4].abgemeldet === true && danach._status === 401 && protCode.eintraege.filter((e) => /Falscher Code/.test(e.text)).length >= 5, 'Fünf falsche Codes für heikle Schritte beenden die Sitzung; jeder Fehlversuch steht im Protokoll');
    const pj = blick.betrieb && blick.betrieb.projekte[0], prot2 = await rufe('/api/zentrale/protokoll?art=einblick', { cookie: C2, env: env2 });
    ok(kurz._status === 400 && blick.ok && blick.betrieb.einblick === true && pj.kunde === 'Familie Einblick' && pj.adresse === 'Lupenweg 3' && pj.fenster.length === 2 && pj.fenster[0].oeffnung === '1258 × 1438' && pj.angaben.notiz === 'Bitte Rollladen prüfen' && prot2.eintraege.some((e) => e.betrieb === regE.konto.id && e.text === 'Support-Anfrage des Betriebs vom 15.10.'), 'Einblick mit zweitem Faktor und Anlass: Namen, Kontakt, Objekt und Aufmaß in Kurzform; im Protokoll mit Anlass');
    // Export mit zweitem Faktor: Anlass und frischer Code, Kundendaten drin, gesperrte (unbezahlte) Aufmaße nur als Umriss
    const mailF = 'zentrale-f-' + stempel + '@beispiel.de', TF = tok(mailF), telF = '0221 5' + String(Date.now()).slice(-6);
    await rufe('/api/konto/registrieren', { body: { firma: 'Zentrale Prüf F1 ' + stempel, ap: 'Fritz Prüf', tel: telF, plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: tok('zentrale-f1-' + stempel + '@beispiel.de') });
    const regF = await rufe('/api/konto/registrieren', { body: { firma: 'Zentrale Prüf F ' + stempel, ap: 'Fritz Prüf', tel: telF, plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, token: TF });
    const pF = await rufe('/api/konto/projekte', { body: { kunde: 'Familie Unbezahlt', kontakt: '0171 4444444', plan: ['Fenster'], days: 14 }, token: TF }), codeF = pF.konto.acc.links.find((l) => l.id === pF.id).code;
    await rufe('/api/aufmass', { body: { v: 1, b: codeF, w: fenster, p: { name: 'Familie Unbezahlt' }, t: Date.now() + 4 } });
    await rufe('/api/zentrale/betriebe/' + regF.konto.id + '/notiz', { body: { text: 'Notiz für den Export' }, cookie: C2, env: env2 });
    const exKurz = await rufe('/api/zentrale/betriebe/' + regF.konto.id + '/export', { body: { grund: 'x', code: await codeJetzt() }, cookie: C2, env: env2 });
    const ex = await rufe('/api/zentrale/betriebe/' + regF.konto.id + '/export', { body: { grund: 'Auskunftsersuchen des Betriebs vom 15.10.', code: await codeJetzt() }, cookie: C2, env: env2 }), exJ = JSON.parse(ex._text || '{}');
    const lF = ((exJ.daten || {}).links || [])[0] || {}, protEx = await rufe('/api/zentrale/protokoll?art=export', { cookie: C2, env: env2 });
    ok(exKurz._status === 400 && ex._status === 200 && /attachment; filename="eeziframes-export-zentrale-pr/.test(ex._kopf.get('content-disposition')) && exJ.konto.mail === mailF && lF.kunde === 'Familie Unbezahlt' && lF.locked === true && lF.aufmass.gesperrt === true && !ex._text.includes('1258') && exJ.daten.verwaltung.notiz === 'Notiz für den Export' && exJ.eingriffe.some((e) => e.art === 'notiz') && !exJ.eingriffe.some((e) => /^anmeldung/.test(e.art)) && protEx.eintraege.some((e) => e.betrieb === regF.konto.id && /Auskunftsersuchen/.test(e.text)), 'Export mit zweitem Faktor, Anlass und Code: Daten mit Notiz und Eingriffen, unbezahlte Aufmaße nur als Umriss, im Protokoll vermerkt');
    const loOhne = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/loeschen', { body: { bestaetigung: 'Zentrale Prüf E ' + stempel }, cookie: C2, env: env2 });
    const loMit = await rufe('/api/zentrale/betriebe/' + regE.konto.id + '/loeschen', { body: { bestaetigung: 'Zentrale Prüf E ' + stempel, code: await codeJetzt() }, cookie: C2, env: env2 });
    ok(loOhne._status === 401 && loMit.ok && loMit.nachweis === true && (await sp.betriebHolen(regE.konto.id)) === null, 'Mit zweitem Faktor verlangt auch das Löschen einen frischen Code; danach ist das Konto weg, mit Löschnachweis');
    for (const fid of [regF.konto.id]) await rufe('/api/zentrale/betriebe/' + fid + '/loeschen', { body: { bestaetigung: 'Zentrale Prüf F ' + stempel, code: await codeJetzt() }, cookie: C2, env: env2 });

    // o) Aufräumen: Fristen fürs Protokoll, liegengebliebene Kassen
    const tage = (n) => new Date(Date.now() - n * 864e5).toISOString();
    await sp.protokollSchreiben({ art: 'anmeldung', text: 'alt-91', zeit: tage(91) }); await sp.protokollSchreiben({ art: 'anmeldung', text: 'neu-80', zeit: tage(80) });
    await sp.protokollSchreiben({ art: 'sperren', text: 'alt-4j', zeit: tage(4 * 365) }); await sp.protokollSchreiben({ art: 'sperren', text: 'neu-1j', zeit: tage(365) });
    await sp.zahlungAnlegen({ stripe_session: 'cs_alt_offen_' + stempel, status: 'offen', mail: 'alt@beispiel.de', created_at: tage(31) }); await sp.zahlungAnlegen({ stripe_session: 'cs_alt_bezahlt_' + stempel, status: 'bezahlt', mail: 'b@beispiel.de', created_at: tage(400) }); await sp.zahlungAnlegen({ stripe_session: 'cs_neu_offen_' + stempel, status: 'offen', mail: 'n@beispiel.de', created_at: tage(5) });
    const wegR = await ze.aufraeumen(umg.konfig(env), sp), texte = (await sp.protokollLesen({ anzahl: 500 })).map((e) => e.text);
    ok(wegR.ok && !texte.includes('alt-91') && texte.includes('neu-80') && !texte.includes('alt-4j') && texte.includes('neu-1j') && !(await sp.zahlungHolen('cs_alt_offen_' + stempel)) && !!(await sp.zahlungHolen('cs_alt_bezahlt_' + stempel)) && !!(await sp.zahlungHolen('cs_neu_offen_' + stempel)), 'Aufräumen: Anmeldungen nach 90 Tagen, Eingriffe nach 3 Jahren, nicht bezahlte Kassen nach 30 Tagen; bezahlte bleiben');
  } catch (e) {
    ok(false, 'Zentrale ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  }

  // p) Oberfläche im Browser, auf einem eigenen Testserver mit Zentrale
  const cp = await import('node:child_process'), pfad = await import('node:path'), urlM = await import('node:url');
  const port = 8890 + Math.floor(Math.random() * 90), B4 = 'http://localhost:' + port;
  const kind = cp.spawn(process.execPath, [pfad.join(pfad.dirname(urlM.fileURLToPath(import.meta.url)), 'dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind.stderr.on('data', (dd) => process.stderr.write('  [Server 4] ' + dd));
  const aus4 = () => { try { kind.kill(); } catch (e) { /* schon weg */ } }; process.on('exit', aus4);
  try {
    let bereit = false; for (let i = 0; i < 60 && !bereit; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit = (await fetch(B4 + '/api/zentrale/status').then((r) => r.json())).eingerichtet === true; } catch (e) { /* noch nicht */ } }
    ok(bereit, 'Testserver mit Zentrale läuft: ' + B4);
    const http = async (p, body, token) => { const r = await fetch(B4 + p, { method: body ? 'POST' : 'GET', headers: Object.assign({ accept: 'application/json', origin: B4 }, body ? { 'content-type': 'application/json' } : {}, token ? { authorization: 'Bearer ' + token } : {}), body: body ? JSON.stringify(body) : undefined }); return Object.assign({ _status: r.status }, await r.json().catch(() => ({}))); };
    const mailU = 'ui-' + stempel + '@beispiel.de', TU = tok(mailU);
    await http('/api/konto/registrieren', { firma: 'Fensterbau Oberfläche', ap: 'Uwe Ober', tel: '0221 6' + String(Date.now()).slice(-6), plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, TU);
    const pr = await http('/api/konto/projekte', { kunde: 'Familie Unsichtbar', kontakt: '0171 1111111', plan: ['Fenster'], days: 14 }, TU), codeU = pr.konto.acc.links.find((l) => l.id === pr.id).code;
    await http('/api/aufmass', { v: 1, b: codeU, w: fenster, p: { name: 'Familie Unsichtbar' }, t: Date.now() });
    const MENSCH = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'; // Headless-Chromium meldet sich als HeadlessChrome und zählt deshalb als Bot
    const zctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE', acceptDownloads: true, userAgent: MENSCH }), zp = await neueSeite(zctx, B4);
    const r0 = await zp.goto(B4 + '/zentrale/', { waitUntil: 'networkidle' });
    ok(r0.headers()['x-robots-tag'] === seoSperre && r0.headers()['cache-control'] === 'no-store' && /Zentrale/.test(await zp.title()) && await zp.locator('#z-pw').count() === 1 && await zp.locator('svg .fi-kachel').count() === 1, '/zentrale/: Anmeldung mit Logo, noindex, nicht zwischengespeichert');
    await zp.fill('#z-pw', 'falsch-falsch-falsch'); await zp.click('form[data-form="anmelden"] button[type="submit"]'); await zp.waitForSelector('.z-login .err');
    ok(/stimmt nicht/.test(await zp.locator('.z-login .err').textContent()) && await zp.locator('.z-stats').count() === 0, 'Falsches Passwort: Hinweis, keine Zentrale');
    zp.probleme = zp.probleme.filter((x) => !/401/.test(x));
    await zp.fill('#z-pw', PW); await zp.click('form[data-form="anmelden"] button[type="submit"]'); await zp.waitForSelector('.z-stats');
    const ck = (await zctx.cookies()).find((c) => c.name === '__Host-zentrale');
    ok(!!ck && ck.httpOnly && ck.secure && ck.sameSite === 'Strict' && !(await zp.evaluate(() => document.cookie)).includes('zentrale') && await zp.evaluate(() => !Object.keys(localStorage).length && !Object.keys(sessionStorage).length), 'Sitzung als Cookie, das kein Skript lesen kann; nichts im Speicher des Browsers');
    ok(/Zweiter Faktor fehlt/.test(await zp.evaluate(() => document.body.innerText)) && await zp.locator('.z-chart svg').count() >= 3, 'Übersicht: Kennzahlen, Diagramme, Hinweis auf den zweiten Faktor');
    await foto(zp, 'zentrale-uebersicht');
    await zp.goto(B4 + '/zentrale/#betriebe'); await zp.waitForSelector('.z-tab');
    await zp.fill('#z-suche', 'Oberfläche'); await zp.waitForTimeout(150);
    ok(await zp.locator('.z-tab tbody tr').count() === 1 && (await zp.inputValue('#z-suche')) === 'Oberfläche', 'Suche filtert beim Tippen, das Feld behält den Fokus und den Text');
    await zp.click('.z-tab tbody tr td:nth-child(3)'); await zp.waitForSelector('.z-aktionen');
    const det = await zp.evaluate(() => document.body.innerText);
    ok(/Fensterbau Oberfläche/.test(det) && /P-\d{4}-001/.test(det) && !/Unsichtbar|1111111/.test(det), 'Klick auf die Zeile öffnet den Betrieb; Kunden nur als Projektnummer');
    await foto(zp, 'zentrale-betrieb');
    await zp.click('[data-act="dlg"][data-v="sperren"]'); await zp.waitForSelector('#d-grund');
    ok(await zp.evaluate(() => document.activeElement && document.activeElement.id === 'd-grund'), 'Dialog „Sperren“: Fokus im Feld für die Begründung');
    await zp.fill('#d-grund', 'Prüfung der Sperre'); await zp.click('.z-dialog button[type="submit"]'); await zp.waitForSelector('.z-hinweis.bad');
    ok(/Prüfung der Sperre/.test(await zp.locator('.z-hinweis.bad').textContent()), 'Gesperrt: Hinweis mit Begründung am Betrieb');
    const pctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' }), pp = await neueSeite(pctx, B4);
    await pp.goto(B4 + '/', { waitUntil: 'networkidle' });
    await pp.evaluate((s) => localStorage.setItem('aufmass.sitzung', JSON.stringify(s)), { token: TU, refresh: 'test-refresh', mail: mailU });
    await pp.reload({ waitUntil: 'networkidle' }); await pp.waitForTimeout(500);
    const gesp = await pp.evaluate(() => ({ online: Server.online(), sitzung: localStorage.getItem('aufmass.sitzung'), toast: (document.getElementById('toast') || {}).textContent || '' }));
    pp.probleme = pp.probleme.filter((x) => !/403/.test(x));
    ok(!gesp.online && !gesp.sitzung && /gesperrt/.test(gesp.toast) && /Prüfung der Sperre/.test(gesp.toast), 'Betriebsbereich: gesperrter Betrieb wird abgemeldet und sieht die Begründung');
    const lk = await http('/api/link/' + codeU);
    ok(lk._status === 404 && /nicht aktiv/.test(lk.fehler || ''), 'Kundenlink eines gesperrten Betriebs ruht');
    await zp.click('[data-act="dlg"][data-v="entsperren"]'); await zp.click('.z-dialog button[type="submit"]'); await zp.waitForFunction(() => !document.querySelector('.z-hinweis.bad'));
    await pp.evaluate((s) => localStorage.setItem('aufmass.sitzung', JSON.stringify(s)), { token: TU, refresh: 'test-refresh', mail: mailU });
    await pp.reload({ waitUntil: 'networkidle' }); await pp.waitForTimeout(500);
    ok(await pp.evaluate(() => Server.online()), 'Entsperrt: der Betrieb kommt wieder in sein Konto');
    sauber(pp, 'Betriebsbereich mit Sperre ohne Fehler'); await pctx.close();
    await zp.click('[data-act="dlg"][data-v="export"]'); await zp.waitForSelector('.z-dialog #d-grund');
    const warnt = /zweite Faktor eingerichtet sein/.test(await zp.locator('.z-dialog').textContent());
    await zp.fill('#d-grund', 'Auskunftsersuchen zur Prüfung'); await zp.click('.z-dialog button[type="submit"]'); await zp.waitForSelector('.z-dialog .err');
    ok(warnt && /zweiten Faktor/.test(await zp.locator('.z-dialog .err').textContent()), 'Export ohne zweiten Faktor: Dialog warnt, der Server lehnt ab');
    zp.probleme = zp.probleme.filter((x) => !/403/.test(x));
    await zp.click('.z-dialog [data-act="dlg-zu"]');
    // Eigene Aufrufe zählen nicht, fremde schon
    const summe = () => zp.evaluate(async () => (await (await fetch('/api/zentrale/statistik?tage=7', { headers: { 'x-zentrale': '1' } })).json()).summe.aufrufe);
    const vorA = await summe();
    await zp.goto(B4 + '/', { waitUntil: 'networkidle' });
    const fctx = await browser.newContext({ locale: 'de-DE', userAgent: MENSCH }), fp = await fctx.newPage(); await fp.goto(B4 + '/ratgeber/fenster-ausmessen/', { waitUntil: 'networkidle' }); await fctx.close();
    await zp.goto(B4 + '/zentrale/#statistik'); await zp.waitForSelector('.z-chart svg'); await zp.waitForTimeout(200);
    ok((await summe()) === vorA + 1, 'Statistik im Browser: Aufrufe des angemeldeten Inhabers zählen nicht, fremde schon');
    await foto(zp, 'zentrale-statistik');
    await zp.goto(B4 + '/zentrale/#einstellungen'); await zp.waitForSelector('[data-act="2fa-neu"]'); await zp.click('[data-act="2fa-neu"]'); await zp.waitForSelector('.z-qr');
    const geheimUI = await zp.inputValue('#z-geheim');
    await zp.fill('#z-probe', '000000'); await zp.click('form[data-form="2fa-probe"] button[type="submit"]'); await zp.waitForTimeout(150);
    const falschUI = await zp.locator('#z-2fa .err').count();
    await zp.fill('#z-probe', await ze.totpCode(geheimUI, Math.floor(Date.now() / 30000))); await zp.click('form[data-form="2fa-probe"] button[type="submit"]'); await zp.waitForSelector('#z-2fa .z-hinweis.ok');
    ok(/^[A-Z2-7]{32}$/.test(geheimUI) && falschUI === 1 && /ZENTRALE_2FA/.test(await zp.locator('#z-2fa .z-hinweis.ok').textContent()), 'Zweiter Faktor einrichten: Schlüssel und QR-Code im Browser, falscher Code abgewiesen, richtiger bestätigt, Anleitung für Cloudflare');
    await foto(zp, 'zentrale-zweiter-faktor');
    sauber(zp, 'Zentrale ohne Fehler, ohne CSP-Verstöße, ohne fremde Server');
    // Gestaltung: erlaubte Schriftgrößen, Ziele ab 44 px, kein Querscrollen, am Schreibtisch und am Telefon, hell und dunkel
    const messen = (seite) => seite.evaluate(() => {
      const sichtbar = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const groessen = new Set(), klein = [];
      document.querySelectorAll('body *').forEach((el) => { if (sichtbar(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) groessen.add(parseFloat(getComputedStyle(el).fontSize)); });
      document.querySelectorAll('a, button, input, select, textarea, summary').forEach((el) => { if (!sichtbar(el)) return; const h = el.getBoundingClientRect().height; if (h < 43.5) klein.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' (' + Math.round(h) + ' px: ' + (el.textContent || el.value || '').trim().slice(0, 24) + ')'); });
      return { groessen: Array.from(groessen).sort((a, b) => a - b), klein: klein, quer: document.scrollingElement.scrollWidth > window.innerWidth + 1 };
    });
    const seiten = ['#uebersicht', '#betriebe', '#kaeufe', '#statistik', '#protokoll', '#einstellungen'];
    const pruefeGestaltung = async (ctxOpt, erlaubt, name) => {
      const c = await browser.newContext(Object.assign({ locale: 'de-DE' }, ctxOpt));
      const s = await neueSeite(c, B4), befund = [];
      await s.goto(B4 + '/zentrale/#betriebe', { waitUntil: 'networkidle' }); await s.fill('#z-pw', PW); await s.click('form[data-form="anmelden"] button[type="submit"]'); await s.waitForSelector('.z-tab'); const idDetail = await s.evaluate(() => (document.querySelector('.z-zeile') || {}).getAttribute('href'));
      for (const h of seiten.concat([idDetail])) {
        await s.goto(B4 + '/zentrale/' + h, { waitUntil: 'networkidle' }); await s.waitForTimeout(250);
        const m = await messen(s), fremd = m.groessen.filter((g) => !erlaubt.includes(g));
        if (fremd.length || m.klein.length || m.quer) befund.push(h + ': ' + (fremd.length ? 'Größen ' + fremd.join(', ') + ' ' : '') + (m.klein.length ? 'klein ' + m.klein.slice(0, 4).join('; ') + ' ' : '') + (m.quer ? 'Querscrollen' : ''));
      }
      const animiert = ctxOpt.reducedMotion ? await s.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length) : 0;
      ok(!befund.length && !animiert, 'Gestaltung ' + name + ': nur Schriftgrößen ' + erlaubt.join(' · ') + ', Ziele ab 44 px, kein Querscrollen' + (ctxOpt.reducedMotion ? ', bei „weniger Bewegung“ keine Animation' : '') + (befund.length ? '\n      ' + befund.join('\n      ') : '') + (animiert ? ' (' + animiert + ' laufend)' : ''));
      if (name === 'Telefon, dunkel') { await s.goto(B4 + '/zentrale/#uebersicht', { waitUntil: 'networkidle' }); await s.waitForTimeout(200); ok((await s.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(17, 17, 16)', 'Dunkler Modus: Papier aus den Tokens'); await foto(s, 'zentrale-telefon-dunkel'); }
      sauber(s, 'Gestaltung ' + name + ' ohne Fehler'); await c.close();
    };
    await pruefeGestaltung({ viewport: { width: 1280, height: 900 } }, [13, 15, 17, 22, 30], 'Schreibtisch');
    await pruefeGestaltung({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark', reducedMotion: 'reduce' }, [13, 15, 17, 22, 26], 'Telefon, dunkel');
    await zp.click('[data-act="abmelden"]'); await zp.waitForSelector('#z-pw');
    const nachAb = await zp.evaluate(async () => (await fetch('/api/zentrale/uebersicht', { headers: { 'x-zentrale': '1' } })).status);
    zp.probleme = zp.probleme.filter((x) => !/401/.test(x));
    ok(nachAb === 401, 'Abmelden: zurück zur Anmeldung, Daten nicht mehr erreichbar');
    await zctx.close();
  } catch (e) {
    ok(false, 'Zentrale im Browser ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { aus4(); }
}

/* ---------- 14. Fortsetzen, keine Gesamtansicht vor dem Freischalten, Grenzen gegen Mehrfachnutzung, Zwischenstand beim Kundenlink ---------- */
if (teil(14)) {
  console.log('14. Fortsetzen, Paywall, Grenzen, Zwischenstand beim Kundenlink');
  const { api } = await import('../functions/api/router.js'), umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), ze = await import('../functions/api/zentrale.js');
  const X = globalThis.Abrechnung, B = 'https://eeziframes.com', PW = 'pruef-passwort-zentrale-14', TAG = 864e5, stempel = Date.now().toString(36);
  const env = { DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', ZENTRALE_PASSWORT: PW, FREISCHALT_GEHEIMNIS: 'pruef14' };
  const sp = spM.speicher(umg.konfig(env));
  let ipNr = 1; const neueIp = () => '198.51.100.' + (60 + (ipNr++ % 150));
  const rufe = async (pfad, o) => {
    o = o || {}; const h = Object.assign({ accept: 'application/json', origin: B, 'cf-connecting-ip': o.ip || neueIp() }, o.kopf || {});
    if (o.body) h['content-type'] = 'application/json';
    if (o.cookie) { h.cookie = o.cookie; h['x-zentrale'] = '1'; }
    const r = await api(new Request(B + pfad, { method: o.method || (o.body ? 'POST' : 'GET'), headers: h, body: o.body ? JSON.stringify(o.body) : undefined }), o.env || env, { waitUntil() {} });
    const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch (e) { j = null; }
    return Object.assign({ _status: r.status, _kopf: r.headers }, j || {});
  };
  try {
    // a) Modell: lange Link-Codes, 60 Tage ab dem ersten Öffnen, abgelaufen erkennen, verlängern
    const jetzt = Date.now(), a0 = { konto: 'service', links: [], book: [], notif: [] }, l0 = X.neuesProjekt(a0, { kunde: 'Familie Modell', days: 7 }, jetzt).l;
    ok(/^[a-z0-9]{10}$/.test(l0.code) && new Set(Array.from({ length: 200 }, () => X.newCode())).size === 200, 'Neue Link-Codes: 10 Zeichen aus a–z und 0–9 (rund 3,6 Billiarden Möglichkeiten), ältere mit 5 Zeichen gelten weiter');
    const f1 = X.fortschritt(l0, 'geoeffnet', 0, jetzt), f2 = X.fortschritt(l0, 'geoeffnet', 0, jetzt + 1000);
    ok(f1 === 'geoeffnet' && !!l0.offenAm && l0.expires === X.dateIn(60, jetzt) && f2 === false, 'Erstes Öffnen: ab dann 60 Tage Zeit, auch wenn der Betrieb 7 Tage gewählt hat; das zweite Öffnen ändert nichts');
    const alt = { status: 'arbeit', expires: X.dateIn(3, jetzt), log: { geoeffnet: 'x', arbeit: 'y' } };
    ok(X.fortschritt(alt, 'geoeffnet', 0, jetzt) === 'frist' && alt.expires === X.dateIn(60, jetzt), 'Schon geöffnete Links von vorher bekommen die 60 Tage beim nächsten Öffnen, ohne erneute Meldung an den Betrieb');
    l0.expires = X.dateIn(-1, jetzt);
    const zuVorher = X.linkZu(l0, jetzt); X.tickKonto(a0, jetzt); const v0 = X.projektAendern(l0, { verlaengern: true }, jetzt);
    ok(zuVorher === 'abgelaufen' && v0.ok && l0.status === 'geoeffnet' && l0.expires === X.dateIn(30, jetzt) && X.linkZu(l0, jetzt) === '' && /gilt jetzt bis/.test(v0.msg), 'Abgelaufen wird erkannt, auch bevor die Zeit angewendet ist; Verlängern öffnet den Link für 30 Tage mit dem Stand von vorher');
    const lx = { status: 'gesendet', expires: X.dateIn(-2, jetzt), log: {} };
    ok(X.fortschritt(lx, 'geoeffnet', 0, jetzt) === false && !lx.offenAm && lx.status === 'gesendet' && lx.expires === X.dateIn(-2, jetzt), 'Abgelaufener Link: Öffnen bringt keine neuen 60 Tage, auch bevor die Zeit angewendet ist');
    const ly = X.neuesProjekt(a0, { kunde: 'Familie Frist', days: 14 }, jetzt).l; X.fortschritt(ly, 'geoeffnet', 0, jetzt); const bisY = ly.expires; X.projektAendern(ly, { days: 7 }, jetzt + 1000);
    const lz = X.neuesProjekt(a0, { kunde: 'Familie Kurz', days: 30 }, jetzt).l; X.projektAendern(lz, { days: 7 }, jetzt);
    ok(ly.expires === bisY && bisY === X.dateIn(60, jetzt) && lz.expires === X.dateIn(7, jetzt), 'Laufzeit ändern: verkürzt die 60 Tage eines geöffneten Links nicht, vor dem Öffnen gilt die neue Laufzeit');
    const kx = 'pruef-bremse-' + stempel; for (let i = 0; i < 3; i++) umg.erlaubt(kx, 3, 60000);
    for (let i = 0; i < 4500; i++) umg.erlaubt('fuell-' + stempel + '-' + i, 5, 1);
    await new Promise((r) => setTimeout(r, 5));
    for (let i = 0; i < 1000; i++) umg.erlaubt('fuell2-' + stempel + '-' + i, 5, 60000);
    ok(umg.erlaubt(kx, 3, 60000) === false && umg.anschluss('2001:db8:1:2:aaaa::1') === umg.anschluss('2001:db8:1:2:bbbb:cccc:dddd:2'), 'Bremsen: viele andere Schlüssel setzen eine volle Bremse nicht zurück (erst Abgelaufenes weg, nie alles); gezählt je Anschluss, zwei Adressen aus einem IPv6-/64 teilen sich eine Bremse');

    // b) Zwischenstand auf dem Server (im Prozess)
    const aB = { konto: 'service', links: [], book: [], notif: [] }, lB = X.neuesProjekt(aB, { kunde: 'Familie Zwischen', days: 14 }).l;
    const rowB = await sp.betriebAnlegen({ auth_user: 'u-zw-' + stempel, mail: 'zw' + stempel + '@beispiel.de', name: 'Fensterbau Zwischen', plz: '50667', tel_norm: '', name_norm: 'zw' + stempel, daten: aB });
    const code = lB.code, t = Date.now(), pfadE = '/api/link/' + code + '/entwurf';
    const fw = (i, extra) => Object.assign({ wid: 'w' + i, t0: t, aend: 0, name: 'Fenster ' + i, art: 'fenster', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, plan: { bild: 'data:image/jpeg;base64,AAAA', ecken: [[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9]] } }, extra || {});
    const g0 = await rufe(pfadE);
    const p1 = await rufe(pfadE, { body: { windows: [fw(1), fw(2)], proj: { notiz: 'Rollladen klemmt' }, stand: t, angelegt: 2 } });
    const g1 = await rufe(pfadE);
    ok(g0._status === 200 && g0.entwurf === null && p1.ok && g1.entwurf.windows.length === 2 && g1.entwurf.windows.every((w) => w.plan.bild === '') && g1.entwurf.proj.notiz === 'Rollladen klemmt' && g1.meta.angelegt === 2 && g1.meta.fenster.w1.t0 === t, 'Zwischenstand: gespeichert und wieder gelesen, ohne das Bild der Lage; Zähler je Fenster vom Server');
    const p2 = await rufe(pfadE, { body: { windows: [fw(1), fw(3)], proj: {}, stand: t + 1, angelegt: 0, bekannt: ['w1', 'w2', 'w3'] } });
    const p3 = await rufe(pfadE, { body: { windows: [fw(1)], proj: {}, stand: t - 10, angelegt: 0 } });
    ok(p2.meta.angelegt === 3 && !p2.entwurf && p3.entwurf && p3.entwurf.windows.length === 2 && p3.meta.angelegt === 3, 'Gelöschte Fenster zählen weiter (3 angelegt, 2 da); ein älterer Stand überschreibt nichts, der Browser bekommt den neueren zurück');
    const p4 = await rufe(pfadE, { body: { windows: Array.from({ length: 50 }, (_, i) => fw(100 + i)), proj: {}, stand: t + 2, angelegt: 0 } });
    const p5 = await rufe(pfadE, { body: { windows: Array.from({ length: 51 }, (_, i) => fw(200 + i)), proj: {}, stand: t + 2 } });
    ok(p4._status === 409 && p4.grenze && /höchstens 50 Fenster, gelöschte zählen mit/.test(p4.fehler) && p5._status === 409 && (await sp.entwurfHolen(code)).daten.windows.length === 2, 'Grenze: mehr als 50 angelegte Fenster (gelöschte mitgezählt) nimmt der Server nicht an, der Zwischenstand bleibt');
    /* nach der ersten Woche: der Server zählt Änderungen selbst; nach vier ist das Fenster fest und behält seine Fassung */
    await sp.entwurfAendern(code, rowB.id, (r) => { r.meta.fenster.w1.t0 = t - 8 * TAG; return true; });
    const p6 = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Wohnzimmer neu', ts: t + 3 }), fw(3)], proj: {}, stand: t + 3, angelegt: 3, bekannt: ['w1', 'w2', 'w3'] } });
    let p7 = null; for (let i = 0; i < 4; i++) p7 = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch ' + i, ts: t + 4 + i }), fw(3)], proj: {}, stand: t + 4 + i, angelegt: 3, bekannt: ['w1', 'w2', 'w3'] } });
    ok(p6.meta.fenster.w1.aend === 1 && p6.meta.fenster.w1.t0 === t - 8 * TAG && p7.meta.fenster.w1.aend === 4 && p7.zurueck.includes('w1') && p7.entwurf.windows.find((w) => w.wid === 'w1').name === 'Versuch 2', 'Nach der ersten Woche zählt der Server jede Änderung, auch wenn der Browser nicht mitzählt; nach vier bleibt die alte Fassung, das erste Speichern lässt sich nicht nach hinten schieben');
    const pl = await rufe('/api/link/' + code), fo = await rufe('/api/link/' + code + '/fortschritt', { body: { stufe: 'geoeffnet' } });
    ok(pl.ok && pl.zu === '' && pl.grenzen.fenster === 50 && fo.ok && fo.expires === X.dateIn(60), 'Link offen; beim ersten Öffnen kommt die neue Frist zurück (60 Tage)');
    await sp.betriebAendern(rowB.id, (d) => { d.links[0].expires = '01.01.2020'; });
    const z1 = await rufe('/api/link/' + code), z2 = await rufe(pfadE, { body: { windows: [fw(1)], proj: {}, stand: t + 99, angelegt: 3 } }), z3 = await rufe('/api/aufmass', { body: { b: code, w: [{ name: 'x' }], p: {} } }), z4 = await rufe(pfadE);
    ok(z1.status === 'abgelaufen' && z1.zu === 'abgelaufen' && /verlängern/.test(z1.zuText) && z2._status === 410 && z2.zu === 'abgelaufen' && z3._status === 410 && z4.ok && z4.zu === 'abgelaufen' && z4.entwurf === null && z4.meta === null, 'Abgelaufener Link: kein Inhalt mehr für den, der den Link hat, weder Zwischenstand noch Aufmaß angenommen (410), mit Hinweis aufs Verlängern');
    await sp.betriebAendern(rowB.id, (d) => { X.projektAendern(d.links[0], { verlaengern: true }); });
    const z5 = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch 2' }), fw(3)], proj: {}, stand: t + 100, angelegt: 3, bekannt: ['w1', 'w2', 'w3'] } });
    /* Zwei Geräte: Gerät B legt w9 an; Gerät A (kennt w9 nicht, neuerer Stand) verliert w9 nicht; ein älteres Gerät C bringt sein neues w8 mit */
    const zB = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch 2' }), fw(3), fw(9)], proj: {}, stand: t + 110, angelegt: 4, bekannt: ['w1', 'w2', 'w3', 'w9'] } });
    const zA = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch 2' })], proj: {}, stand: t + 120, angelegt: 3, bekannt: ['w1', 'w2', 'w3'] } });
    const zC = await rufe(pfadE, { body: { windows: [fw(1, { name: 'alt' }), fw(8)], proj: {}, stand: t + 5, angelegt: 3, bekannt: ['w1', 'w8'] } });
    const idsA = (zA.entwurf ? zA.entwurf.windows : []).map((w) => w.wid).sort().join(','), idsC = (zC.entwurf ? zC.entwurf.windows : []).map((w) => w.wid).sort().join(',');
    ok(zB.ok && idsA === 'w1,w9' && idsC === 'w1,w8,w9' && zC.entwurf.windows.find((w) => w.wid === 'w1').name === 'Versuch 2', 'Zwei Geräte: Gelöschtes (w3) bleibt gelöscht, anderswo Angelegtes (w9) bleibt erhalten; ein älterer Stand ändert nichts, bringt aber sein neues Fenster (w8) mit');
    const z6 = await rufe('/api/aufmass', { body: { v: 1, b: code, w: Array.from({ length: 51 }, () => ({ name: 'x' })), p: {}, t: Date.now() } });
    ok(z5.ok && z6._status === 400 && /höchstens 50/.test(z6.fehler), 'Nach dem Verlängern geht es weiter; ein Aufmaß mit mehr als 50 Fenstern lehnt der Server ab');
    /* Gerät mit altem Stand: w9 nach der ersten Woche; ein Gerät speichert es später (ts), ein anderes mit älterer Fassung, aber neuerem
       Zwischenstand schickt danach seine Liste */
    await sp.entwurfAendern(code, rowB.id, (r) => { r.meta.fenster.w9.t0 = t - 8 * TAG; r.meta.fenster.w9.aend = 0; return true; });
    const gNeu = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch 2' }), fw(8), fw(9, { name: 'Neu', ts: t + 500 })], proj: {}, stand: t + 200, angelegt: 0, bekannt: ['w1', 'w8', 'w9'] } });
    const gAlt = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Versuch 2' }), fw(8), fw(9, { name: 'Fenster 9', ts: t + 100 })], proj: {}, stand: t + 300, angelegt: 0, bekannt: ['w1', 'w8', 'w9'] } });
    ok(gNeu.meta.fenster.w9.aend === 1 && gAlt.meta.fenster.w9.aend === 1 && gAlt.entwurf && gAlt.entwurf.windows.find((w) => w.wid === 'w9').name === 'Neu' && (await sp.entwurfHolen(code)).daten.windows.find((w) => w.wid === 'w9').name === 'Neu', 'Gerät mit altem Stand: dreht ein später gespeichertes Fenster nicht zurück und verbraucht keine Änderung (je Fenster gewinnt das zuletzt gespeicherte)');
    /* Offene Nachbesserung: der Kunde ändert frei, auch ein festes Fenster; danach (eingegangen) kein Inhalt und keine Änderung mehr */
    await sp.betriebAendern(rowB.id, (d) => { Object.assign(d.links[0], { status: 'eingegangen', eingegangenAt: Date.now(), runde: 2, nb: { offen: true, runde: 2 } }); });
    const nbP = await rufe(pfadE, { body: { windows: [fw(1, { name: 'Korrigiert', ts: t + 900 }), fw(8), fw(9, { name: 'Neu', ts: t + 500 })], proj: {}, stand: t + 400, angelegt: 0, bekannt: ['w1', 'w8', 'w9'] } });
    ok(nbP.ok && nbP.meta.fenster.w1.aend === 4 && !(nbP.zurueck || []).length && (await sp.entwurfHolen(code)).daten.windows.find((w) => w.wid === 'w1').name === 'Korrigiert', 'Offene Nachbesserung: Änderungen gehen durch, auch an einem festen Fenster, und zählen nicht (darum hat der Betrieb gebeten)');
    await sp.betriebAendern(rowB.id, (d) => { d.links[0].nb.offen = false; });
    const eg = await rufe(pfadE), ep = await rufe(pfadE, { body: { windows: [fw(1)], proj: {}, stand: t + 999 } });
    ok(eg.ok && eg.zu === 'eingegangen' && eg.entwurf === null && eg.runde === 2 && ep._status === 410 && ep.zu === 'eingegangen' && ep.runde === 2 && ep.seit > 0, 'Eingegangen ohne offene Nachbesserung: kein Inhalt, keine Änderung (410 mit Grund, Runde und Eingang; die App zeigt dann „Schon erledigt.“ und erkennt eine spätere Nachbesserung)');
    /* Ältere Links mit fünfstelligem Code: kein Zwischenstand */
    const aK = { konto: 'service', links: [], book: [], notif: [] }, lK = X.neuesProjekt(aK, { kunde: 'Familie Kurzcode', days: 14 }).l; lK.code = 'k' + stempel.slice(-4);
    await sp.betriebAnlegen({ auth_user: 'u-kurz-' + stempel, mail: 'kurz' + stempel + '@beispiel.de', name: 'Fensterbau Kurz', plz: '50667', tel_norm: '', name_norm: 'kurz' + stempel, daten: aK });
    const gk = await rufe('/api/link/' + lK.code + '/entwurf'), pk = await rufe('/api/link/' + lK.code + '/entwurf', { body: { windows: [fw(1)], proj: {}, stand: t } });
    ok(lK.code.length === 5 && gk.ok && gk.aus && pk.ok && pk.aus && !(await sp.entwurfHolen(lK.code)), 'Ältere Links mit fünfstelligem Code: kein Zwischenstand auf dem Server (zu leicht zu erraten), die App speichert dort nur im Browser');
    /* Senden mit Kennungen der Fenster (wm): gezählt wird gegen den Zwischenstand; danach steht er auf dem gesendeten Stand */
    const aW = { konto: 'service', links: [], book: [], notif: [] }, lW = X.neuesProjekt(aW, { kunde: 'Familie Senden', days: 14 }).l;
    const rowW = await sp.betriebAnlegen({ auth_user: 'u-send-' + stempel, mail: 'send' + stempel + '@beispiel.de', name: 'Fensterbau Senden', plz: '50667', tel_norm: '', name_norm: 'send' + stempel, daten: aW });
    await sp.entwurfAendern(lW.code, rowW.id, (r) => { r.meta = { angelegt: 48, fenster: Object.fromEntries(Array.from({ length: 48 }, (_, i) => ['x' + i, { t0: t, aend: 0 }])) }; r.daten = { windows: [], proj: {} }; return true; });
    const fwSend = (n) => ({ name: n, art: 'fenster', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 } });
    const sw = await rufe('/api/aufmass', { body: { v: 1, b: lW.code, w: [0, 1, 2].map((i) => fwSend('Neu ' + i)), p: {}, t: Date.now(), wm: [0, 1, 2].map((i) => ({ wid: 'neu' + i, t0: t, aend: 0, ts: t })), stand: t } });
    const sw2 = await rufe('/api/aufmass', { body: { v: 1, b: lW.code, w: [fwSend('Bekannt')], p: {}, t: Date.now(), wm: [{ wid: 'x0', t0: t, aend: 0, ts: t }], stand: t } });
    await new Promise((r) => setTimeout(r, 30));
    const dW = await sp.entwurfHolen(lW.code);
    ok(sw._status === 400 && /gelöschte zählen mit/.test(sw.fehler) && sw2.ok && dW.meta.gesendet === 1 && dW.daten.windows.length === 1 && dW.daten.windows[0].wid === 'x0' && dW.daten.windows[0].name === 'Bekannt', 'Senden: 48 angelegt plus 3 neue Fenster lehnt der Server ab; mit bekannten Fenstern geht es, der Zwischenstand steht danach auf dem gesendeten Stand');
    const sw3 = await rufe('/api/aufmass', { body: { v: 1, b: lW.code, w: [fwSend('Bekannt')], p: {}, t: Date.now(), wm: [{ wid: 'x0', t0: t, aend: 0, ts: t }], stand: t } });
    ok(sw3._status === 409 && sw3.zu === 'eingegangen' && sw3.runde === 1 && sw3.seit > 0, 'Noch einmal gesendet (anderes Gerät): 409 mit Grund, die App zeigt „Schon erledigt.“');
    /* Löschen mit Zeitpunkt, Angaben zum Haus mit eigenem Zeitpunkt, Uhr des Geräts begrenzt, Fenster ohne Kennung, Senden ohne Kennungen */
    const aT = { konto: 'service', links: [], book: [], notif: [] }, lT = X.neuesProjekt(aT, { kunde: 'Familie Zeitpunkt', days: 14 }).l;
    const rowT = await sp.betriebAnlegen({ auth_user: 'u-zeit-' + stempel, mail: 'zeit' + stempel + '@beispiel.de', name: 'Fensterbau Zeitpunkt', plz: '50667', tel_norm: '', name_norm: 'zeit' + stempel, daten: aT });
    const pT = '/api/link/' + lT.code + '/entwurf', projT = (tel) => ({ name: 'Familie Zeitpunkt', tel: tel });
    const sendeT = (fenster, extra) => rufe(pT, { body: Object.assign({ windows: fenster, proj: projT('0171 1'), projTs: t + 10, angelegt: 0, bekannt: ['a1', 'a2'], geloescht: {} }, extra) });
    await sendeT([fw(1, { wid: 'a1', ts: t + 10 }), fw(2, { wid: 'a2', ts: t + 10 })], { stand: t + 10 });
    await sendeT([fw(1, { wid: 'a1', ts: t + 10 }), fw(2, { wid: 'a2', ts: t + 30, name: 'B geändert' })], { stand: t + 30 }); // Gerät B ändert a2
    const delA = await sendeT([fw(1, { wid: 'a1', ts: t + 10 })], { stand: t + 40, geloescht: { a2: t + 20 } }); // Gerät A hatte a2 vorher gelöscht
    ok(delA.entwurf && delA.entwurf.windows.some((w) => w.wid === 'a2' && w.name === 'B geändert') && (await sp.entwurfHolen(lT.code)).daten.windows.length === 2, 'Löschen mit Zeitpunkt: ein Fenster, das anderswo nach dem Löschen noch gespeichert wurde, bleibt und kommt aufs löschende Gerät zurück');
    await sendeT([fw(2, { wid: 'a2', ts: t + 30, name: 'B geändert' })], { stand: t + 50, geloescht: { a1: t + 50 } }); // A löscht a1
    const nachDel = await sp.entwurfHolen(lT.code);
    const altC = await sendeT([fw(1, { wid: 'a1', ts: t + 10 }), fw(2, { wid: 'a2', ts: t + 30, name: 'B geändert' })], { stand: t + 55 }); // altes Gerät hat a1 noch
    const nachB = await sendeT([fw(1, { wid: 'a1', ts: t + 60, name: 'B nach dem Löschen' }), fw(2, { wid: 'a2', ts: t + 30, name: 'B geändert' })], { stand: t + 60 }); // B hat a1 danach noch geändert
    const dT = await sp.entwurfHolen(lT.code);
    ok(nachDel.daten.windows.length === 1 && nachDel.meta.geloescht.a1 === t + 50 && altC.entwurf && !altC.entwurf.windows.some((w) => w.wid === 'a1') && nachB.ok && (dT.daten.windows.find((w) => w.wid === 'a1') || {}).name === 'B nach dem Löschen' && !dT.meta.geloescht.a1, 'Anderswo gelöscht: ein Gerät mit altem Stand bringt das Fenster nicht zurück, eines, das es nach dem Löschen noch geändert hat, schon');
    await sendeT(dT.daten.windows, { stand: t + 80, proj: projT('0171 NEU'), projTs: t + 80 }); // B ändert die Telefonnummer
    const projA = await sendeT(dT.daten.windows.map((w) => (w.wid === 'a2' ? Object.assign({}, w, { name: 'A ändert ein Fenster', ts: t + 90 }) : w)), { stand: t + 90 }); // A mit alten Angaben
    const dP = await sp.entwurfHolen(lT.code);
    ok(dP.daten.proj.tel === '0171 NEU' && dP.daten.windows.some((w) => w.name === 'A ändert ein Fenster') && projA.entwurf && projA.entwurf.proj.tel === '0171 NEU', 'Angaben zum Haus mit eigenem Zeitpunkt: ein Gerät, das nur ein Fenster ändert, setzt die neue Telefonnummer nicht zurück und bekommt sie');
    const fern = await sendeT(dP.daten.windows.concat([fw(5, { wid: 'a5', ts: Date.now() + 30 * 365 * TAG })]), { stand: Date.now() + 1e12, bekannt: ['a1', 'a2', 'a5'] });
    const dZ = await sp.entwurfHolen(lT.code), a5 = dZ.daten.windows.find((w) => w.wid === 'a5') || {};
    const ohneId = await rufe(pT, { body: { windows: [{ name: 'ohne Kennung' }], proj: {}, stand: t } });
    const ohneWm = await rufe('/api/aufmass', { body: { v: 1, b: lT.code, w: [fwSend('Ohne Kennung')], p: {}, t: Date.now() } });
    ok(fern.ok && a5.ts > 0 && a5.ts <= Date.now() + 5 * 60000 && dZ.stand <= Date.now() + 5 * 60000 && ohneId._status === 400 && ohneWm._status === 400 && /neu laden/.test(ohneWm.fehler), 'Zeitpunkte von der Uhr des Geräts höchstens fünf Minuten nach der Serverzeit (eine vorgehende Uhr sperrt kein Fenster); Fenster ohne Kennung und Senden ohne Kennungen trotz Zwischenstand lehnt der Server ab');
    /* Senden mit altem Stand, während ein anderes Gerät schon weiter ist: erst abgleichen (409) */
    const gT = await rufe(pT), wmVon = (fenster) => fenster.map((w) => ({ wid: w.wid, t0: Number(w.t0) || t, aend: Number(w.aend) || 0, ts: Number(w.ts) || 0 }));
    const sendeAm = (wm, projTs) => rufe('/api/aufmass', { body: { v: 1, b: lT.code, w: wm.map((x) => fwSend('Fenster ' + x.wid)), p: projT('0171 NEU'), t: Date.now(), wm: wm, stand: t + 99, projTs: projTs } });
    const alleT = wmVon(dZ.daten.windows), ohneA5 = alleT.filter((x) => x.wid !== 'a5'), aelterA2 = alleT.map((x) => (x.wid === 'a2' ? Object.assign({}, x, { ts: x.ts - 1 }) : x));
    const s1 = await sendeAm(ohneA5, t + 80), s2 = await sendeAm(aelterA2, t + 80), s3 = await sendeAm(alleT, t + 10), s4 = await sendeAm(alleT, t + 80);
    ok(typeof gT.jetzt === 'number' && Math.abs(gT.jetzt - Date.now()) < 5000 && s1._status === 409 && s1.abgleichen && s2._status === 409 && s2.abgleichen && s3._status === 409 && s3.abgleichen && s4.ok, 'Senden mit altem Stand (ein Fenster fehlt, ist anderswo neuer, oder die Angaben zum Haus sind dort neuer): 409 „erst abgleichen“; auf dem neuesten Stand geht es durch; jede Antwort nennt die Serverzeit');
    await sp.betriebLoeschen(rowT.id);
    let gebremst = 0; for (let i = 0; i < 34; i++) { const r = await rufe('/api/link/qqqqqqqq' + String(i).padStart(2, '0'), { ip: '203.0.113.77' }); if (r._status === 429) gebremst++; }
    const fremd = await rufe('/api/link/' + code, { ip: '203.0.113.77' });
    ok(gebremst === 4 && fremd._status === 429, 'Unbekannte Link-Codes: nach 30 Fehlversuchen je Anschluss in 10 Minuten gebremst (429), damit niemand Codes durchprobiert');

    // c) Zentrale: Hinweise auf Mehrfachnutzung, Kundenlinks in Arbeit; Aufräumen
    const aC = { konto: 'service', links: [], book: [], notif: [] }, lC = X.neuesProjekt(aC, { kunde: 'Familie Viel', days: 14 }).l;
    const rowC = await sp.betriebAnlegen({ auth_user: 'u-viel-' + stempel, mail: 'viel' + stempel + '@beispiel.de', name: 'Fensterbau Vielmesser ' + stempel, plz: '50667', tel_norm: '', name_norm: 'viel' + stempel, daten: aC });
    await sp.entwurfAendern(lC.code, rowC.id, (r) => { r.meta = { angelegt: 42, aktuell: 3, fenster: { a: { t0: 1, aend: 4 } } }; r.daten = { windows: [], proj: {} }; return true; });
    const kaeufer = 'mehrfach' + stempel + '@beispiel.de';
    for (let i = 0; i < 3; i++) await sp.zahlungAnlegen({ stripe_session: 'cs_mehr_' + stempel + i, status: 'bezahlt', mail: i ? kaeufer : kaeufer.toUpperCase(), betrag_cent: 799, kennung: 'p' + i });
    const anm = await rufe('/api/zentrale/anmelden', { body: { passwort: PW } }), keks = (anm._kopf.get('set-cookie') || '').split(';')[0];
    const ue = await rufe('/api/zentrale/uebersicht', { cookie: keks }), hin = (ue.hinweise || []).map((h) => h.text + '|' + (h.ziel || ''));
    const hl = hin.find((h) => h.includes('Fensterbau Vielmesser ' + stempel)) || '', hk = hin.find((h) => h.includes(kaeufer)) || '';
    ok(/Mehrfachnutzung prüfen/.test(hl) && /42 Fenster angelegt/.test(hl) && /39 Fenster gelöscht/.test(hl) && /nach vier Änderungen fest/.test(hl) && hl.endsWith('|betrieb/' + rowC.id) && /3 Aufmaßblätter gekauft/.test(hk) && hk.endsWith('|kaeufe'), 'Zentrale: Hinweis auf einen auffälligen Kundenlink (viele angelegte und gelöschte Fenster, feste Fenster) und auf einen Käufer mit drei Aufmaßblättern');
    const dt = await rufe('/api/zentrale/betriebe/' + rowC.id, { cookie: keks }), zs = ((dt.betrieb || {}).zwischenstaende || [])[0] || {};
    ok(zs.nr === lC.nr && zs.angelegt === 42 && zs.geloescht === 39 && zs.fest === 1 && zs.kunde === '' && zs.gruende.length >= 3, 'Betrieb in der Zentrale: Kundenlinks in Arbeit mit Zählern, ohne Namen des Kunden (nur mit Einblick)');
    /* Aufräumen: Zwischenstand ohne Link weg, eingegangen und Nachbesserung vorbei weg, laufender Link bleibt */
    await sp.entwurfAendern('weg' + stempel, rowC.id, (r) => { r.meta = {}; r.daten = { windows: [] }; return true; });
    const lD = X.neuesProjekt(aC, { kunde: 'Familie Fertig', days: 14 }).l; Object.assign(lD, { status: 'eingegangen', eingegangenAt: Date.now() - 31 * TAG, runde: 1 });
    await sp.betriebAendern(rowC.id, (d) => { d.links.unshift(lD); });
    await sp.entwurfAendern(lD.code, rowC.id, (r) => { r.meta = {}; r.daten = { windows: [] }; return true; });
    const lE = X.neuesProjekt(aC, { kunde: 'Familie Abgelaufen', days: 14 }).l; Object.assign(lE, { status: 'abgelaufen', expires: X.dateIn(-40), offenAm: X.dateIn(-100), log: { geoeffnet: 'x' } });
    const lF = X.neuesProjekt(aC, { kunde: 'Familie Kürzlich', days: 14 }).l; Object.assign(lF, { status: 'abgelaufen', expires: X.dateIn(-10) });
    const lG = X.neuesProjekt(aC, { kunde: 'Familie Deaktiviert', days: 14 }).l; Object.assign(lG, { status: 'deaktiviert', deaktiviertAm: Date.now() - 31 * TAG });
    await sp.betriebAendern(rowC.id, (d) => { d.links.unshift(lE, lF, lG); });
    for (const l of [lE, lF, lG]) await sp.entwurfAendern(l.code, rowC.id, (r) => { r.meta = { angelegt: 5, aktuell: 2, fenster: { e1: { t0: 1, aend: 2 }, e2: { t0: 1, aend: 0 } } }; r.daten = { windows: [fw(1, { wid: 'e1' }), fw(2, { wid: 'e2' })], proj: { notiz: 'privat' } }; r.stand = t; return true; });
    const auf = await ze.aufraeumen(umg.konfig(env), sp);
    const dE = await sp.entwurfHolen(lE.code), dF = await sp.entwurfHolen(lF.code), dG = await sp.entwurfHolen(lG.code);
    ok(dE && !dE.daten.windows.length && !Object.keys(dE.daten.proj).length && dE.meta.angelegt === 5 && dE.meta.fenster.e1.aend === 2 && dE.meta.geleertIds.join(',') === 'e1,e2' && dG && !dG.daten.windows.length && dF.daten.windows.length === 2 && auf.entwuerfeGeleert >= 2, 'Aufräumen: 30 Tage nach Ablauf oder Deaktivierung ist der Inhalt weg, die Zähler bleiben (Verlängern setzt keine Grenze zurück); kürzlich abgelaufen bleibt alles');
    await sp.betriebAendern(rowC.id, (d) => { X.projektAendern(d.links.find((x) => x.code === lE.code), { verlaengern: true }); });
    const gE = await rufe('/api/link/' + lE.code + '/entwurf');
    const wE = await rufe('/api/link/' + lE.code + '/entwurf', { body: { windows: [fw(1, { wid: 'e1' }), fw(2, { wid: 'e2' })], proj: { notiz: 'privat' }, stand: t - 1000, angelegt: 5, bekannt: ['e1', 'e2'], geloescht: {} } });
    const dE2 = await sp.entwurfHolen(lE.code);
    ok(gE.entwurf && gE.entwurf.geleert && !gE.entwurf.windows.length && wE.ok && dE2.daten.windows.length === 2 && dE2.daten.proj.notiz === 'privat' && !(wE.entwurf && !Object.keys(wE.entwurf.proj || {}).length) && !dE2.meta.geleert && !dE2.meta.geleertIds && dE2.meta.fenster.e1.aend === 2, 'Nach dem Verlängern stellt das Gerät des Kunden seine Fenster und Angaben zum Haus wieder her, auch mit älterem Stand; die Zähler gelten weiter');
    ok(auf.entwuerfe >= 2 && !(await sp.entwurfHolen('weg' + stempel)) && !(await sp.entwurfHolen(lD.code)) && !!(await sp.entwurfHolen(lC.code)) && !!(await sp.entwurfHolen(code)), 'Aufräumen: Zwischenstände ohne Link und nach dem Ende der Nachbesserungsfrist gelöscht, laufende bleiben');
    await sp.betriebLoeschen(rowC.id);
    ok(!(await sp.entwurfHolen(lC.code)), 'Konto gelöscht: seine Zwischenstände sind mit weg');
  } catch (e) {
    ok(false, 'Zwischenstand und Zentrale ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  }

  // d) App, eigenes Aufmaß (Pilot): Liste oben, keine Gesamtansicht vor dem Freischalten, Grenzen
  const messenApp = (seite) => seite.evaluate(() => {
    const sichtbar = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 4; };
    const groessen = new Set(), klein = [];
    document.querySelectorAll('#app *').forEach((el) => { if (el.closest('svg')) return; if (sichtbar(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) groessen.add(parseFloat(getComputedStyle(el).fontSize)); });
    /* Textlinks im Fließtext (WCAG 2.5.8, Ausnahme „inline“) zählen nicht als Zielfläche */
    document.querySelectorAll('#app a, #app button, #app input, #app summary').forEach((el) => { if (!sichtbar(el) || el.closest('svg') || el.matches('.ulink') || el.closest('.sheet')) return; const h = el.getBoundingClientRect().height; if (h < 43.5) klein.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' (' + Math.round(h) + ' px: ' + (el.textContent || '').trim().slice(0, 24) + ')'); });
    return { groessen: Array.from(groessen).sort((a, b) => a - b), klein: klein, quer: document.scrollingElement.scrollWidth > innerWidth + 1 };
  });
  const APP_GROESSEN = [13, 15, 17, 24, 32, 40];
  const fensterAnlegen = (seite, liste) => seite.evaluate((liste) => {
    liste.forEach((f) => { S.win = Object.assign(baseWin(), { name: f[0], mo: { hm: f[2] + 70, hl: f[2] + 70, hr: f[2] + 70, wm: f[1] + 140, wt: f[1] + 140, wb: f[1] + 140 }, el: { w: f[1], h: f[2] }, w: f[1], h: f[2], fotos: 2 }); S.editIdx = -1; saveWin(); });
    go('home');
  }, liste);
  const ctx = await browser.newContext(telefon), page = await neueSeite(ctx);
  try {
    await page.goto(BASE + '/app/', { waitUntil: 'networkidle' });
    await fensterAnlegen(page, [['Wohnzimmer', 1230, 1410], ['Küche', 1010, 1210], ['Bad', 610, 810]]); await page.waitForTimeout(400);
    const h1 = await page.evaluate(() => { const l = document.querySelector('.liste-in'), c = document.querySelectorAll('.liste-in .wincard'); return { h1: document.querySelector('.hd h1').textContent, n: c.length, oben: l ? Math.round(l.getBoundingClientRect().top) : 9999, karten: Array.from(c).map((x) => x.textContent).join(' | '), hero: !!document.querySelector('.hero'), bar: document.querySelector('.bb .btn.primary').textContent, angelegt: angelegt(), wids: S.windows.every((w) => w.wid && w.t0 && w.aend === 0) }; });
    ok(h1.h1 === 'Weiter, wo du warst.' && h1.n === 3 && h1.oben < 500 && !h1.hero && h1.bar === 'Aufmaßblatt fertigstellen' && h1.angelegt === 3 && h1.wids, 'Angefangenes Aufmaß: „Weiter, wo du warst.“, die Liste steht oben (ab ' + h1.oben + ' px) statt unter dem Startbild, kein „Fenster ausmessen“ mehr');
    ok(/Maße vollständig/.test(h1.karten) && !/\d\.\d{3}\s×\s\d/.test(h1.karten) && !/\d mm/.test(h1.karten), 'Liste vor dem Freischalten: „Maße vollständig“ statt Zahlen');
    await foto(page, 'app-aufmass-fortsetzen');
    await page.click('.liste-in .wincard[data-i="0"]'); await page.waitForSelector('[data-screen="fertig"]'); await page.waitForTimeout(200);
    const f0 = await page.evaluate(() => ({ fold: document.querySelectorAll('details.fold .kv').length, zu: !!document.querySelector('.zu-karte [data-act="k-start"]'), fakten: document.querySelector('.center p:not(.eyebrow)').textContent, frei: (document.querySelector('.aend-frei') || {}).textContent || '', zurueck: document.querySelector('.hdr-btn[data-act="back"]').textContent, alle: !!document.querySelector('.pill.voll[data-v="home"]') }));
    ok(f0.fold === 0 && f0.zu && !/\d mm/.test(f0.fakten) && /beliebig ändern, danach noch viermal/.test(f0.frei) && f0.zurueck === 'Aufmaß' && f0.alle, 'Fenster gespeichert: keine Liste aller Angaben und keine Maße vor dem Freischalten, dafür „Freischalten“; Hinweis auf 7 Tage freies Ändern; zurück heißt „Aufmaß“, dazu „Alle Fenster ansehen“');
    await foto(page, 'app-fenster-gesperrt');
    const mFertig = await messenApp(page);
    await page.evaluate(() => go('teilen')); await page.waitForTimeout(300);
    const tab = await page.evaluate(() => Array.from(document.querySelectorAll('.dv-tab tr')).slice(1).map((tr) => Array.from(tr.children).slice(2).map((td) => td.textContent).join(' ')));
    ok(tab.length === 3 && tab.every((z) => !/\d/.test(z) && /•/.test(z)), 'Vorschau des Blatts: Positionen und Räume, die Maße nur als Platzhalter');
    await page.evaluate(() => { const k = kauf(); k.paid = true; k.test = true; persist(); go('home'); }); await page.waitForTimeout(250);
    const nachKauf = await page.evaluate(() => document.querySelector('.liste-in').textContent);
    await page.click('.liste-in .wincard[data-i="0"]'); await page.waitForSelector('[data-screen="fertig"]');
    ok(/1\.230 × 1\.410 mm/.test(nachKauf) && await page.locator('details.fold .kv').count() === 1 && await page.locator('.zu-karte').count() === 0, 'Nach dem Freischalten: Maße in der Liste und alle Angaben');
    // Portal: angefangenes Aufmaß → „Aufmaß fortsetzen“
    await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
    const po = await page.evaluate(() => ({ top: (document.querySelector('.top a.btn.primary') || {}).textContent, hero: (document.querySelector('.hero.b2c a.btn.primary') || {}).textContent, hint: (document.querySelector('.hint.fortsetzen') || {}).textContent || '' }));
    ok(po.top === 'Aufmaß fortsetzen' && po.hero === 'Aufmaß fortsetzen' && /3 Fenster erfasst/.test(po.hint), 'Startseite (Hauseigentümer) mit angefangenem Aufmaß: „Aufmaß fortsetzen“ statt „Jetzt ausmessen“');
    await page.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
    // Grenze: 50 angelegte Fenster, Löschen gibt keinen Platz zurück
    await page.evaluate(() => { S.angelegt = 49; persist(); render(); });
    const vorGrenze = await page.evaluate(() => (document.querySelector('.sub.grenze') || {}).textContent || '');
    await fensterAnlegen(page, [['Flur', 800, 1200]]);
    await page.evaluate(() => { S.win = kopie(S.windows[3]); S.editIdx = 3; act('delwin', document.body); }); await page.waitForTimeout(250);
    const anGrenze = await page.evaluate(() => ({ n: S.windows.length, a: angelegt(), note: (document.querySelector('.note.grenze') || {}).textContent || '', neu: !!document.querySelector('.liste-in [data-act="new"]') }));
    await page.evaluate(() => act('new', document.body)); await page.waitForTimeout(150);
    const blockiert = await page.evaluate(() => ({ screen: S.screen, toast: S.toast }));
    ok(/Noch 1 neues Fenster möglich/.test(vorGrenze) && anGrenze.n === 3 && anGrenze.a === 50 && /höchstens 50 Fenster, gelöschte zählen mit/.test(anGrenze.note) && !anGrenze.neu && blockiert.screen === 'home' && /höchstens 50/.test(blockiert.toast), 'Grenze: kurz vorher ein Hinweis; nach 50 angelegten Fenstern kein neues mehr, auch nicht nach dem Löschen (3 da, 50 angelegt)');
    await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(250);
    const nachLaden = await page.evaluate(() => angelegt());
    await page.evaluate(() => act('copywin', document.body)); await page.waitForTimeout(100);
    ok(nachLaden === 50 && await page.evaluate(() => S.windows.length === 3 && /höchstens 50/.test(S.toast)), 'Der Zähler bleibt nach dem Neuladen; auch Kopieren legt kein Fenster mehr an');
    await page.evaluate(() => { for (let k = 0; k < 3; k++) { S.win = kopie(S.windows[0]); S.editIdx = 0; act('delwin', document.body); } go('home'); }); await page.waitForTimeout(250);
    const leerGrenze = await page.evaluate(() => ({ n: S.windows.length, a: angelegt(), h1: (document.querySelector('.hd h1') || {}).textContent || '', stand: (document.querySelector('.hd .sub, .hd p:not(.eyebrow)') || {}).textContent || '', neu: !!document.querySelector('.note.grenze [data-act="aufmass-neu"]'), bar: !!document.querySelector('.bb') }));
    await page.evaluate(() => { S.editIdx = -1; go('fertig'); act('delwin', document.body); }); await page.waitForTimeout(100);
    ok(leerGrenze.n === 0 && leerGrenze.a === 50 && leerGrenze.h1 === 'Weiter, wo du warst.' && /kein Fenster erfasst/.test(leerGrenze.stand) && leerGrenze.neu && !leerGrenze.bar && await page.evaluate(() => /gibt es nicht mehr/.test(S.toast) && S.screen === 'home'), 'An der Grenze und alles gelöscht: kein Startbild mit totem Knopf, sondern die Erklärung mit „Neues Aufmaß beginnen“; Löschen eines verschwundenen Fensters meldet sich ehrlich');
    await page.click('.note.grenze [data-act="aufmass-neu"]'); await page.waitForSelector('.neu-frage');
    await page.click('[data-act="aufmass-neu-ja"]'); await page.waitForTimeout(250);
    ok(await page.evaluate(() => S.windows.length === 0 && angelegt() === 0 && !FREI() && /Erstes Fenster ausmessen/.test(document.body.textContent)), 'Für ein weiteres Haus: neues Aufmaß nach Rückfrage, die Freischaltung gilt nur für das alte');
    // 7 Tage frei, danach vier gespeicherte Änderungen, dann fest
    await fensterAnlegen(page, [['Gaube', 900, 1100]]);
    await page.evaluate(() => { S.windows[0].t0 = Date.now() - 8 * 864e5; persist(); });
    const aendern = (name) => page.evaluate((name) => { S.win = altAngleichen(Object.assign(baseWin(), kopie(S.windows[0]))); S.editIdx = 0; S.win.name = name; saveWin(); return { aend: S.windows[0].aend, toast: S.toast, name: S.windows[0].name }; }, name);
    await page.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; go('fertig'); }); await page.waitForTimeout(150);
    const hinweis0 = await page.evaluate(() => (document.querySelector('.note.warn') || {}).textContent || '');
    const c1 = await aendern('Gaube links'), c0 = await page.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; saveWin(); return S.windows[0].aend; });
    const c2 = await aendern('Gaube 2'), c3 = await aendern('Gaube 3'), c4 = await aendern('Gaube 4');
    ok(/noch viermal ändern/.test(hinweis0) && c1.aend === 1 && /noch dreimal/.test(c1.toast) && c0 === 1 && c2.aend === 2 && c3.aend === 3 && c4.aend === 4 && /letzte Änderung/.test(c4.toast), 'Nach der ersten Woche: Hinweis „noch viermal“, jedes Speichern mit Änderung zählt (Speichern ohne Änderung nicht), die vierte ist die letzte');
    await page.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; go('fertig'); }); await page.waitForTimeout(150);
    const fest = await page.evaluate(() => ({ zu: document.querySelectorAll('.pill[aria-disabled="true"]').length, note: (document.querySelector('.note.warn') || {}).textContent || '' }));
    await page.locator('.pill[data-act="wuensche"]').dispatchEvent('click'); await page.waitForTimeout(100); // aria-disabled: antippbar, erklärt sich
    const nachKlick = await page.evaluate(() => ({ screen: S.screen, toast: S.toast }));
    const c5 = await aendern('Gaube 5'), karte = await page.evaluate(() => { go('home'); return document.querySelector('.liste-in .wincard').textContent; });
    ok(fest.zu === 2 && /ist fest/.test(fest.note) && nachKlick.screen === 'fertig' && /ist fest/.test(nachKlick.toast) && c5.aend === 4 && c5.name === 'Gaube 4' && /fest/.test(karte), 'Nach vier Änderungen ist das Fenster fest: „Maße/Wünsche ändern“ gesperrt, Speichern ändert nichts, die Liste zeigt „fest“');
    await page.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; act('copywin', document.body); }); await page.waitForTimeout(100);
    ok(await page.evaluate(() => S.windows.length === 2 && S.windows[1].aend === 0 && angelegt() === 2 && S.windows[1].wid !== S.windows[0].wid), 'Kopie eines festen Fensters: neues Fenster mit eigener Woche, zählt gegen die Grenze');
    await fensterAnlegen(page, [['Keller', 700, 500]]);
    const frei = await page.evaluate(() => { const i = S.windows.length - 1; for (let k = 0; k < 5; k++) { S.win = kopie(S.windows[i]); S.editIdx = i; S.win.name = 'Keller ' + k; saveWin(); } return { aend: S.windows[i].aend, name: S.windows[i].name }; });
    ok(frei.aend === 0 && frei.name === 'Keller 4', 'In der ersten Woche zählt keine Änderung (fünfmal geändert, nichts verbraucht)');
    sauber(page, 'Fortsetzen, Paywall und Grenzen ohne Fehler');
    // Gestaltung: Liste und Fenster gespeichert, Telefon hell und dunkel
    const befund = [];
    for (const dunkel of [false, true]) {
      const c = await browser.newContext(Object.assign({}, telefon, dunkel ? { colorScheme: 'dark', reducedMotion: 'reduce' } : {})), s = await neueSeite(c);
      await s.goto(BASE + '/app/', { waitUntil: 'networkidle' });
      await fensterAnlegen(s, [['Wohnzimmer', 1230, 1410], ['Kinderzimmer', 1010, 1210]]); await s.waitForTimeout(300);
      for (const schritt of ['home', 'fertig']) {
        if (schritt === 'fertig') { await s.click('.liste-in .wincard[data-i="1"]'); await s.waitForSelector('[data-screen="fertig"]'); await s.waitForTimeout(250); }
        const m = await messenApp(s), fremd = m.groessen.filter((g) => !APP_GROESSEN.includes(g));
        if (fremd.length || m.klein.length || m.quer) befund.push((dunkel ? 'dunkel ' : 'hell ') + schritt + ': ' + (fremd.length ? 'Größen ' + fremd.join(', ') + ' ' : '') + (m.klein.length ? 'klein ' + m.klein.slice(0, 4).join('; ') : '') + (m.quer ? ' Querscrollen' : ''));
      }
      if (dunkel) await foto(s, 'app-fenster-gesperrt-dunkel');
      sauber(s, 'Gestaltung ' + (dunkel ? 'dunkel' : 'hell') + ' ohne Fehler'); await c.close();
    }
    const fremdF = mFertig.groessen.filter((g) => !APP_GROESSEN.includes(g));
    ok(!befund.length && !fremdF.length, 'Gestaltung (Telefon, hell und dunkel): Liste und gespeichertes Fenster nur mit 13 · 15 · 17 · 24 · 32 · 40, Ziele ab 44 px, kein Querscrollen' + (befund.length ? '\n      ' + befund.join('\n      ') : '') + (fremdF.length ? ' (' + fremdF.join(', ') + ')' : ''));
  } catch (e) {
    ok(false, 'App mit angefangenem Aufmaß ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { await ctx.close(); }

  // e) Kundenlink im Servermodus: Hinweis, Zwischenstand auf dem Server, anderes Gerät, deaktivierter Link
  const cp = await import('node:child_process'), pfad = await import('node:path'), urlM = await import('node:url');
  const port = 8990 + Math.floor(Math.random() * 90), B5 = 'http://localhost:' + port;
  const kind = cp.spawn(process.execPath, [pfad.join(pfad.dirname(urlM.fileURLToPath(import.meta.url)), 'dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1' }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind.stderr.on('data', (dd) => process.stderr.write('  [Server 5] ' + dd));
  const aus5 = () => { try { kind.kill(); } catch (e) { /* schon weg */ } }; process.on('exit', aus5);
  try {
    let bereit = false; for (let i = 0; i < 60 && !bereit; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit = (await fetch(B5 + '/api/status').then((r) => r.json())).daten === true; } catch (e) { /* noch nicht */ } }
    ok(bereit, 'Testserver mit Datenbank-Attrappe läuft: ' + B5);
    const http = async (p, body, token, method) => { const r = await fetch(B5 + p, { method: method || (body ? 'POST' : 'GET'), headers: Object.assign({ accept: 'application/json', origin: B5 }, body ? { 'content-type': 'application/json' } : {}, token ? { authorization: 'Bearer ' + token } : {}), body: body ? JSON.stringify(body) : undefined }); return Object.assign({ _status: r.status }, await r.json().catch(() => ({}))); };
    const tok = (m) => 'test.' + Buffer.from(m, 'utf8').toString('base64').replace(/=+$/, ''), T5 = tok('link14-' + stempel + '@beispiel.de');
    await http('/api/konto/registrieren', { firma: 'Fensterbau Weitermachen', ap: 'Wera', tel: '0221 7' + String(Date.now()).slice(-6), plz: '50667', agb: RECHT.NB_STAND, unternehmer: true }, T5);
    const pr = await http('/api/konto/projekte', { kunde: 'Familie Rückkehr', kontakt: '0171 2222222', plan: ['Fenster'], days: 14 }, T5), lk = pr.konto.acc.links.find((l) => l.id === pr.id);
    const url = B5 + '/app/#k-' + lk.code + '-Fensterbau_Weitermachen.' + b64u('Fensterbau Weitermachen') + '.' + b64u('Familie Rückkehr');
    const c1 = await browser.newContext(telefon), s1 = await neueSeite(c1, B5);
    await s1.goto(url, { waitUntil: 'networkidle' }); await s1.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 }); await s1.waitForTimeout(200);
    const erst = await s1.evaluate(() => document.querySelector('.hero.lk').textContent);
    ok(/Über diesen Link kommst du jederzeit zurück/.test(erst), 'Kundenlink, erster Besuch: Hinweis, dass der Kunde jederzeit über den Link zurückkommt');
    await fensterAnlegen(s1, [['Wohnzimmer', 1230, 1410], ['Küche', 1010, 1210]]);
    await s1.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 }); await s1.waitForTimeout(200);
    const srv = await http('/api/link/' + lk.code + '/entwurf');
    ok(srv.entwurf && srv.entwurf.windows.length === 2 && srv.meta.angelegt === 2 && srv.entwurf.windows.every((w) => w.wid && !(w.plan && w.plan.bild)), 'Zwischenstand liegt auf dem Server: 2 Fenster, Zähler dabei, keine Bilder');
    const p1 = await http('/api/link/' + lk.code);
    ok(p1.expires === X.dateIn(60), 'Beim ersten Öffnen beginnen die 60 Tage (gilt bis ' + p1.expires + ')');
    await foto(s1, 'app-link-weitermachen');
    const c2 = await browser.newContext(telefon), s2 = await neueSeite(c2, B5);
    await s2.goto(url, { waitUntil: 'networkidle' }); await s2.waitForFunction(() => S.windows.length === 2, null, { timeout: 8000 }); await s2.waitForTimeout(300);
    const zwei = await s2.evaluate(() => ({ namen: S.windows.map((w) => w.name).join(','), a: angelegt(), merk: (document.querySelector('.merk-karte') || {}).textContent || '', h1: (document.querySelector('.hd h1') || {}).textContent, karten: document.querySelector('.liste-in').textContent, bar: document.querySelector('.bb .btn.primary').textContent }));
    ok(zwei.namen === 'Wohnzimmer,Küche' && zwei.a === 2 && zwei.h1 === 'Weiter, wo du warst.' && /auch für ein anderes Gerät/.test(zwei.merk) && /Der Link gilt bis/.test(zwei.merk) && zwei.bar === 'Weiter zum Absenden', 'Anderes Gerät, leerer Speicher: dieselbe Liste aus dem Zwischenstand, Hinweis „jederzeit weitermachen“ mit Gültigkeit');
    ok(/Maße vollständig/.test(zwei.karten) && !/\d mm/.test(zwei.karten), 'Kundenlink: in der Liste keine Maße (die bekommt der Betrieb)');
    await s2.click('.liste-in .wincard[data-i="0"]'); await s2.waitForSelector('[data-screen="fertig"]');
    ok(await s2.locator('details.fold .kv').count() === 0 && /Gehen mit deinem Aufmaß an Fensterbau Weitermachen/.test(await s2.locator('.zu-karte').textContent()) && await s2.locator('.zu-karte [data-act="k-start"]').count() === 0, 'Kundenlink: keine Liste aller Angaben vor dem Senden, kein Kaufknopf');
    /* Änderung auf Gerät 2 kommt auf Gerät 1 an */
    await s2.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Wohnzimmer links'; saveWin(); });
    await s2.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    await s1.reload({ waitUntil: 'networkidle' }); await s1.waitForFunction(() => S.windows[0] && S.windows[0].name === 'Wohnzimmer links', null, { timeout: 8000 });
    ok(true, 'Änderung auf dem zweiten Gerät ist nach dem Neuladen auch auf dem ersten da (der neuere Stand gewinnt)');
    sauber(s1, 'Kundenlink mit Zwischenstand ohne Fehler (Gerät 1)'); sauber(s2, 'Kundenlink mit Zwischenstand ohne Fehler (Gerät 2)');
    /* Serverfehler beim Prüfen des Links sperrt nicht; nur „gibt es nicht“ (404) schließt */
    await s1.route('**/api/link/' + lk.code, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false,"fehler":"Serverfehler"}' }));
    await s1.reload({ waitUntil: 'networkidle' }); await s1.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 }); await s1.waitForTimeout(200);
    const k500 = await s1.evaluate(() => ({ zu: S.linkZu, n: S.windows.length, neu: !!document.querySelector('.liste-in [data-act="new"]') }));
    await s1.unroute('**/api/link/' + lk.code);
    s1.probleme = s1.probleme.filter((x) => !/500/.test(x));
    ok(k500.zu === '' && k500.n === 2 && k500.neu, 'Serverfehler beim Prüfen des Links: der Kunde arbeitet weiter, nur „gibt es nicht“ (404) schließt den Link');
    /* Vorschau des Betriebs („Als Kunde öffnen“): kein Zwischenstand des Kunden, nichts gespeichert, nichts gesendet, nicht geöffnet */
    const pr2 = await http('/api/konto/projekte', { kunde: 'Familie Vorschau', plan: ['Fenster'], days: 7 }, T5), lv = pr2.konto.acc.links.find((l) => l.id === pr2.id);
    const cV = await browser.newContext(telefon); await cV.addInitScript((codes) => { try { localStorage.setItem('aufmass.portal.v1', JSON.stringify({ v: 5, acc: { b1: { links: codes.map((c) => ({ code: c })) } } })); } catch (e) { /* ok */ } }, [lk.code, lv.code]);
    const sV = await neueSeite(cV, B5);
    await sV.goto(url.replace('/app/#', '/app/?vorschau=1#'), { waitUntil: 'networkidle' }); await sV.waitForTimeout(500);
    const vor0 = await sV.evaluate(() => ({ n: S.windows.length, note: (document.querySelector('.note.vorschau') || {}).textContent || '' }));
    await sV.goto(B5 + '/app/?vorschau=1#k-' + lv.code + '-Fensterbau_Weitermachen.' + b64u('Fensterbau Weitermachen') + '.' + b64u('Familie Vorschau'), { waitUntil: 'networkidle' }); await sV.reload({ waitUntil: 'networkidle' }); await sV.waitForTimeout(400);
    await fensterAnlegen(sV, [['Probe', 1000, 1200]]); await sV.waitForTimeout(1600);
    await sV.evaluate(() => act('send', document.body)); await sV.waitForTimeout(100);
    const vor2 = await sV.evaluate(() => ({ n: S.windows.length, toast: S.toast, speicher: Object.keys(localStorage).filter((k) => k.startsWith('aufmass.k.')).length, note: (document.querySelector('.note.vorschau') || {}).textContent || '' }));
    const lvNach = await http('/api/link/' + lv.code), dv = await http('/api/link/' + lv.code + '/entwurf');
    ok(vor0.n === 0 && /Vorschau für Ihren Betrieb/.test(vor0.note) && vor2.n === 1 && /Vorschau/.test(vor2.toast) && vor2.speicher === 0 && dv.entwurf === null && !['geoeffnet', 'arbeit'].includes(lvNach.status) && lvNach.expires === lv.expires, 'Vorschau des Betriebs: Hinweis oben, der Zwischenstand des Kunden bleibt unsichtbar, nichts im Browser oder auf dem Server gespeichert, nichts gesendet, der Link gilt weiter als ungeöffnet');
    await foto(sV, 'app-link-vorschau');
    sauber(sV, 'Vorschau ohne Fehler'); await cV.close();
    const cK = await browser.newContext(telefon), sK = await neueSeite(cK, B5);
    await sK.goto(url.replace('/app/#', '/app/?vorschau=1#'), { waitUntil: 'networkidle' }); await sK.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 }); await sK.waitForTimeout(200);
    const kunde = await sK.evaluate(() => ({ n: S.windows.length, note: !!document.querySelector('.note.vorschau'), suche: location.search, vorschau: vorschau() }));
    ok(kunde.n === 2 && !kunde.note && kunde.suche === '' && !kunde.vorschau, 'Bekommt ein Kunde die Adresse der Vorschau, arbeitet er normal: seine Liste ist da, kein Vorschau-Hinweis, der Zusatz verschwindet aus der Adresse');
    sauber(sK, 'Kunde mit Adresse der Vorschau ohne Fehler'); await cK.close();
    /* Absenden auf Gerät A mit Abgleich; Gerät B erfährt danach, dass das Aufmaß schon beim Betrieb ist */
    const pr3 = await http('/api/konto/projekte', { kunde: 'Familie Zwei Geräte', plan: ['Fenster'], days: 14 }, T5), l3 = pr3.konto.acc.links.find((l) => l.id === pr3.id);
    const url3 = B5 + '/app/#k-' + l3.code + '-Fensterbau_Weitermachen.' + b64u('Fensterbau Weitermachen') + '.' + b64u('Familie Zwei Geräte');
    const cA = await browser.newContext(telefon), sA = await neueSeite(cA, B5), cB = await browser.newContext(telefon), sB = await neueSeite(cB, B5);
    await sA.goto(url3, { waitUntil: 'networkidle' }); await sA.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 });
    await fensterAnlegen(sA, [['Esszimmer', 1230, 1410]]); await sA.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    await sB.goto(url3, { waitUntil: 'networkidle' }); await sB.waitForFunction(() => S.windows.length === 1, null, { timeout: 8000 });
    await sB.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Esszimmer Süd'; saveWin(); go('home'); }); await sB.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    await sA.evaluate(() => { go('home'); act('send', document.body); }); await sA.waitForFunction(() => /abgeglichen/.test(S.toast), null, { timeout: 8000 });
    const a1 = await sA.evaluate(() => ({ name: S.windows[0].name, sent: !!S.sent }));
    await sA.evaluate(() => act('send', document.body)); await sA.waitForFunction(() => !!S.sent, null, { timeout: 8000 }); await sA.waitForTimeout(100);
    const p3s = await http('/api/link/' + l3.code), d3 = await http('/api/link/' + l3.code + '/entwurf');
    ok(a1.name === 'Esszimmer Süd' && !a1.sent && p3s.status === 'eingegangen' && d3.zu === 'eingegangen' && d3.entwurf === null, 'Absenden mit Abgleich: hat ein anderes Gerät inzwischen geändert, zeigt die App erst den neuen Stand; danach geht das Aufmaß an den Betrieb, der Zwischenstand ist zu');
    await sB.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Esszimmer Nord'; saveWin(); go('home'); });
    await sB.waitForFunction(() => !!S.sent, null, { timeout: 8000 }); await sB.waitForTimeout(200);
    const b1 = await sB.evaluate(() => ({ h1: (document.querySelector('.hero.lk h1') || {}).textContent || '', neu: document.querySelectorAll('[data-act="new"]').length, warn: (document.querySelector('.note.warn') || {}).textContent || '', karte: (document.querySelector('.wincard.sent') || {}).textContent || '', titel: Array.from(document.querySelectorAll('.sec-title')).map((x) => x.textContent).join('|') }));
    ok(/Schon erledigt/.test(b1.h1) && b1.neu === 0 && /nicht bei Fensterbau Weitermachen angekommen/.test(b1.warn) && /Auf diesem Gerät/.test(b1.karte) && !/Übermittelt/.test(b1.karte) && /Auf diesem Gerät/.test(b1.titel), 'Anderes Gerät nach dem Absenden: erfährt beim nächsten Speichern, dass das Aufmaß schon beim Betrieb ist („Schon erledigt.“), sagt ehrlich, dass seine Änderung nicht angekommen ist, und nennt seine Liste nicht „übermittelt“');
    await foto(sB, 'app-link-schon-erledigt');
    /* Nachbesserung angefragt, zurückgezogen, wieder angefragt: das Gerät kommt wieder hinein */
    await http('/api/konto/projekte/' + l3.id, { nb: { hinweis: 'Bitte das Esszimmer prüfen' } }, T5, 'PATCH');
    await sA.goto(url3 + '~2', { waitUntil: 'networkidle' }); await sA.reload({ waitUntil: 'networkidle' }); await sA.waitForFunction(() => S.sync && S.sync.geladen && !!S.nb, null, { timeout: 8000 });
    await sA.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Esszimmer korrigiert'; saveWin(); go('home'); }); await sA.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    await http('/api/konto/projekte/' + l3.id, { nbZurueck: true }, T5, 'PATCH');
    await sA.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Esszimmer noch einmal'; saveWin(); go('home'); }); await sA.waitForFunction(() => !!S.sent, null, { timeout: 8000 });
    const zurueckgezogen = await sA.evaluate(() => ({ runde: S.sent.runde, nb: !!S.nb, h1: (document.querySelector('.hero.lk h1') || {}).textContent || '' }));
    await http('/api/konto/projekte/' + l3.id, { nb: { hinweis: 'Doch noch einmal' } }, T5, 'PATCH');
    await sA.reload({ waitUntil: 'networkidle' }); await sA.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 }); await sA.waitForTimeout(200);
    const wieder = await sA.evaluate(() => ({ nb: !!S.nb, sent: !!S.sent, h1: (document.querySelector('.hero.lk h1') || {}).textContent || '' }));
    ok(zurueckgezogen.runde === 1 && !zurueckgezogen.nb && /Schon erledigt/.test(zurueckgezogen.h1) && wieder.nb && !wieder.sent && /eine Runde noch/.test(wieder.h1), 'Nachbesserung zurückgezogen: das Gerät zeigt „Schon erledigt.“ mit der Runde beim Betrieb; wird wieder angefragt, kommt es in die Nachbesserung zurück');
    sA.probleme = sA.probleme.filter((x) => !/410/.test(x));
    sB.probleme = sB.probleme.filter((x) => !/410/.test(x)); sauber(sA, 'Absenden mit Abgleich ohne Fehler'); sauber(sB, 'Zweites Gerät nach dem Absenden ohne Fehler');
    await cA.close(); await cB.close();
    /* Funkloch beim Öffnen: vor dem Absenden holt die App den Zwischenstand nach */
    const pr4 = await http('/api/konto/projekte', { kunde: 'Familie Funkloch', plan: ['Fenster'], days: 14 }, T5), l4 = pr4.konto.acc.links.find((l) => l.id === pr4.id);
    const url4 = B5 + '/app/#k-' + l4.code + '-Fensterbau_Weitermachen.' + b64u('Fensterbau Weitermachen') + '.' + b64u('Familie Funkloch');
    const c4a = await browser.newContext(telefon), s4a = await neueSeite(c4a, B5), c4b = await browser.newContext(telefon), s4b = await neueSeite(c4b, B5);
    await s4a.goto(url4, { waitUntil: 'networkidle' }); await s4a.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 });
    await fensterAnlegen(s4a, [['Bad', 1010, 1210]]); await s4a.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    await s4b.goto(url4, { waitUntil: 'networkidle' }); await s4b.waitForFunction(() => S.windows.length === 1, null, { timeout: 8000 });
    await s4b.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Bad oben'; saveWin(); go('home'); }); await s4b.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    let ersterVersuch = true; await s4a.route('**/api/link/' + l4.code, (route) => { if (ersterVersuch) { ersterVersuch = false; return route.abort(); } return route.continue(); });
    await s4a.reload({ waitUntil: 'networkidle' }); await s4a.waitForTimeout(300);
    const funkloch = await s4a.evaluate(() => ({ geladen: S.sync.geladen, name: S.windows[0].name }));
    await s4a.evaluate(() => { go('home'); act('send', document.body); }); await s4a.waitForFunction(() => /abgeglichen/.test(S.toast), null, { timeout: 8000 });
    const nachFunkloch = await s4a.evaluate(() => ({ name: S.windows[0].name, sent: !!S.sent }));
    await s4a.unroute('**/api/link/' + l4.code);
    ok(!funkloch.geladen && funkloch.name === 'Bad' && nachFunkloch.name === 'Bad oben' && !nachFunkloch.sent, 'Funkloch beim Öffnen: vor dem Absenden holt die App den Zwischenstand nach und zeigt erst den neueren Stand des anderen Geräts, statt den alten zu senden');
    s4a.probleme = s4a.probleme.filter((x) => !/ERR_FAILED|net::|Failed to load resource/i.test(x));
    /* Hochladen scheitert (503), Herunterladen geht: nicht senden, der Server konnte nicht zusammenführen */
    await s4a.route('**/api/link/' + l4.code + '/entwurf', (route) => (route.request().method() === 'POST' ? route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false,"fehler":"kurz weg"}' }) : route.continue()));
    await s4a.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Bad A'; saveWin(); go('home'); }); await s4a.waitForTimeout(1600);
    await s4a.evaluate(() => act('send', document.body)); await s4a.waitForFunction(() => /Keine Verbindung/.test(S.toast), null, { timeout: 8000 });
    const blockiert = await s4a.evaluate(() => ({ sent: !!S.sent, offen: S.sync.offen }));
    const l4s = await http('/api/link/' + l4.code);
    await s4a.unroute('**/api/link/' + l4.code + '/entwurf');
    ok(!blockiert.sent && blockiert.offen && l4s.status !== 'eingegangen', 'Hochladen scheitert, Herunterladen geht: die App sendet nicht (der Server konnte nicht zusammenführen) und bittet, es gleich noch einmal zu versuchen');
    s4a.probleme = s4a.probleme.filter((x) => !/503/.test(x));
    sauber(s4a, 'Funkloch beim Öffnen ohne Fehler'); sauber(s4b, 'Zweites Gerät beim Funkloch ohne Fehler');
    await c4a.close(); await c4b.close();
    /* Uhr des Geräts geht drei Stunden nach: die App gleicht mit der Serverzeit ab */
    const pr5 = await http('/api/konto/projekte', { kunde: 'Familie Uhr', plan: ['Fenster'], days: 14 }, T5), l5 = pr5.konto.acc.links.find((l) => l.id === pr5.id);
    const c5 = await browser.newContext(telefon); await c5.addInitScript(() => { const echt = Date.now.bind(Date); Date.now = () => echt() - 3 * 3600 * 1000; });
    const s5 = await neueSeite(c5, B5);
    await s5.goto(B5 + '/app/#k-' + l5.code + '-Fensterbau_Weitermachen.' + b64u('Fensterbau Weitermachen') + '.' + b64u('Familie Uhr'), { waitUntil: 'networkidle' }); await s5.waitForFunction(() => S.sync && S.sync.geladen, null, { timeout: 8000 });
    await fensterAnlegen(s5, [['Gaube', 900, 1100]]); await s5.waitForFunction(() => S.sync && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    const d5 = await http('/api/link/' + l5.code + '/entwurf'), w5 = (d5.entwurf && d5.entwurf.windows[0]) || {};
    ok(Math.abs((w5.ts || 0) - Date.now()) < 60000 && Math.abs((w5.t0 || 0) - Date.now()) < 60000, 'Uhr des Geräts geht drei Stunden nach: die App gleicht mit der Serverzeit ab, Zeitpunkte der Fenster stimmen');
    sauber(s5, 'Gerät mit falscher Uhr ohne Fehler'); await c5.close();
    /* Betrieb deaktiviert den Link: zu, mit Hinweis */
    await http('/api/konto/projekte/' + lk.id, { deaktivieren: true }, T5, 'PATCH');
    await s2.goto(url.replace('#', '?x=1#'), { waitUntil: 'networkidle' }); await s2.waitForFunction(() => S.linkZu === 'deaktiviert', null, { timeout: 8000 }); await s2.waitForTimeout(200);
    const zu = await s2.evaluate(() => ({ t: document.querySelector('.hero.lk').textContent, neu: document.querySelectorAll('[data-act="new"]').length, bar: !!document.querySelector('.bb') }));
    await s2.evaluate(() => act('new', document.body));
    ok(/Link deaktiviert/.test(zu.t) && /Hier geht es gerade nicht weiter/.test(zu.t) && zu.neu === 0 && !zu.bar && await s2.evaluate(() => S.screen === 'home' && /deaktiviert/.test(S.toast)), 'Deaktivierter Link: Hinweis statt Messen, nichts lässt sich mehr anlegen oder senden');
    s2.probleme = s2.probleme.filter((x) => !/410/.test(x));
    sauber(s2, 'Deaktivierter Link ohne Fehler');
    await c1.close(); await c2.close();
  } catch (e) {
    ok(false, 'Kundenlink mit Zwischenstand ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { aus5(); }
}

if (teil(15)) {
  console.log('15. Konten für Hauseigentümer (Gast, Aufmaß sichern, Anmelden, Kauf nur mit Konto)');
  const { api } = await import('../functions/api/router.js'), umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js'), ze = await import('../functions/api/zentrale.js');
  const B = 'https://eeziframes.com', TAG = 864e5, stempel = Date.now().toString(36), t = Date.now();
  const env = { DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', FREISCHALT_GEHEIMNIS: 'pruef15' };
  const sp = spM.speicher(umg.konfig(env));
  let ipNr = 1;
  const rufe = async (pfad, o) => {
    o = o || {}; const h = { accept: 'application/json', origin: B, 'cf-connecting-ip': '198.51.100.' + (10 + (ipNr++ % 200)) };
    if (o.body) h['content-type'] = 'application/json'; if (o.token) h.authorization = 'Bearer ' + o.token;
    const r = await api(new Request(B + pfad, { method: o.method || (o.body ? 'POST' : 'GET'), headers: h, body: o.body ? JSON.stringify(o.body) : undefined }), o.env || env, { waitUntil() {} });
    const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch (e) { j = null; }
    return Object.assign({ _status: r.status }, j || {});
  };
  const fw = (i, x) => Object.assign({ wid: 'h' + i, t0: t, aend: 0, ts: t + i, name: 'Fenster ' + i, art: 'fenster', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 } }, x || {});
  const sichern = (token, kennung, fenster, extra) => rufe('/api/kunde/aufmass/' + kennung, { token: token, body: Object.assign({ windows: fenster, proj: { name: 'Haus ' + kennung }, projTs: t, stand: Date.now(), angelegt: fenster.length, bekannt: fenster.map((w) => w.wid), geloescht: {} }, extra || {}) });
  try {
    // a) Anmelden per Code, Aufmaß sichern, Liste, fremde Konten
    const st = await rufe('/api/status'), mail = 'haus15-' + stempel + '@beispiel.de';
    const c1 = await rufe('/api/kunde/code', { body: { mail: mail } }), falsch = await rufe('/api/kunde/anmelden', { body: { mail: mail, code: '000000' } }), an = await rufe('/api/kunde/anmelden', { body: { mail: mail, code: '123456' } });
    ok(st.konten === true && c1.ok && falsch._status === 401 && an.ok && an.token && an.mail === mail && Array.isArray(an.aufmasse) && !an.aufmasse.length, 'Hauseigentümer: Anmelden mit E-Mail und Code (kein Passwort), falscher Code abgewiesen; /api/status meldet Konten');
    const T = an.token, K1 = 'p15a' + stempel, K2 = 'p15b' + stempel;
    const s1 = await sichern(T, K1, [fw(1), fw(2)]), g1 = await rufe('/api/kunde/aufmass/' + K1, { token: T }), l1 = await rufe('/api/kunde/aufmasse', { token: T });
    ok(s1.ok && g1.entwurf.windows.length === 2 && g1.meta.angelegt === 2 && !g1.bezahlt && l1.aufmasse.length === 1 && l1.aufmasse[0].kennung === K1 && l1.aufmasse[0].name === 'Haus ' + K1 && l1.aufmasse[0].fenster === 2, 'Aufmaß gesichert: im Konto mit Name und Fensterzahl, Zähler wie beim Kundenlink');
    await rufe('/api/kunde/code', { body: { mail: 'fremd15-' + stempel + '@beispiel.de' } });
    const anF = await rufe('/api/kunde/anmelden', { body: { mail: 'fremd15-' + stempel + '@beispiel.de', code: '123456' } });
    const fremdG = await rufe('/api/kunde/aufmass/' + K1, { token: anF.token }), fremdP = await sichern(anF.token, K1, [fw(9)]), ohne = await rufe('/api/kunde/aufmass/' + K1), ohneK = await rufe('/api/kunde/aufmass/' + K1, { body: { windows: [{ name: 'ohne Kennung' }], proj: {} }, token: T });
    ok(fremdG._status === 403 && fremdG.fremd && fremdP._status === 403 && ohne._status === 401 && ohne.anmelden && ohneK._status === 400 && (await sp.eigenesHolen(K1)).daten.windows.length === 2, 'Fremdes Konto sieht und ändert das Aufmaß nicht (403), ohne Anmeldung nichts (401), Fenster ohne Kennung abgewiesen');
    /* Grenze 20 Aufmaße je Konto */
    const tokV = 'test.' + Buffer.from('voll15-' + stempel + '@beispiel.de', 'utf8').toString('base64').replace(/=+$/, '');
    for (let i = 0; i < 20; i++) await sichern(tokV, 'p15v' + i + stempel, [fw(1)]);
    const voll = await sichern(tokV, 'p15v20' + stempel, [fw(1)]);
    ok(voll._status === 409 && voll.voll && /20 Aufmaße/.test(voll.fehler), 'Ein Konto hat höchstens 20 Aufmaße (409 mit Hinweis)');
    // b) Kauf nur mit Konto und nur für ein gesichertes Aufmaß; der Kauf hängt am Aufmaß; danach zählt jede Änderung
    const kOhne = await rufe('/api/zahlung/start', { body: { ...KASSE, mail: mail, kennung: K1 } }), kNicht = await rufe('/api/zahlung/start', { token: T, body: { ...KASSE, kennung: K2 } }), kFremd = await rufe('/api/zahlung/start', { token: anF.token, body: { ...KASSE, kennung: K1 } });
    const kMit = await rufe('/api/zahlung/start', { token: T, body: { ...KASSE, kennung: K1, mail: 'andere@beispiel.de' } }), sess = new URL(kMit.url).searchParams.get('bezahlt');
    const pr = await rufe('/api/zahlung/pruefen?session=' + sess + '&kennung=' + K1), g2 = await rufe('/api/kunde/aufmass/' + K1, { token: T }), zahl = await sp.zahlungHolen(sess);
    ok(kOhne._status === 401 && kOhne.anmelden && kNicht._status === 409 && kNicht.sichern && kFremd._status === 403 && kMit.ok && pr.bezahlt && g2.bezahlt && g2.bezahlt.token === pr.token && g2.bezahlt.at > 0 && zahl.mail === mail, 'Freischalten nur mit Konto, nur für ein gesichertes eigenes Aufmaß; Rechnung an die E-Mail des Kontos; der Kauf hängt danach am Aufmaß (auf jedem Gerät da)');
    const nachKauf = await sichern(T, K1, [fw(1, { name: 'nach dem Kauf', ts: Date.now() }), fw(2)]), zweit = await rufe('/api/zahlung/start', { token: T, body: { ...KASSE, kennung: K1 } });
    ok(nachKauf.meta.fenster.h1.aend === 1 && zweit.ok && zweit.schon && !zweit.url, 'Mit dem Kauf endet die freie Woche: die erste Änderung danach zählt schon; ein zweiter Kauf desselben Aufmaßes öffnet keine Kasse');
    /* als Gast gekauft (Nachweis aus dem Browser): kommt beim Sichern mit ins Konto, ein gefälschter nicht */
    const kG = 'p15g' + stempel, kG2 = 'p15h' + stempel, echt = await (await import('../functions/api/eigene.js')).kaufNachweis(umg.konfig(env), kG, 'cs_gast_' + stempel);
    const gast = await sichern(T, kG, [fw(1)], { kauf: { session: 'cs_gast_' + stempel, token: echt } }), gast2 = await sichern(T, kG2, [fw(1)], { kauf: { session: 'cs_gast_' + stempel, token: 'x'.repeat(32) } });
    ok(gast.bezahlt && gast.bezahlt.token === echt && !gast2.bezahlt, 'Als Gast gekauft: der Nachweis kommt beim Sichern mit ins Konto, ein gefälschter nicht');
    // c) Löschen: ein Aufmaß, das Konto. Der Inhalt ist sofort weg, eine Löschmarke verhindert, dass ein anderes Gerät es wieder anlegt
    const del1 = await rufe('/api/kunde/aufmass/' + kG2 + '/loeschen', { token: T, body: {} }), m1 = await sp.eigenesHolen(kG2);
    const wieder1 = await sichern(T, kG2, [fw(1), fw(2)]), lesen1 = await rufe('/api/kunde/aufmass/' + kG2, { token: T }), kasse1 = await rufe('/api/zahlung/start', { token: T, body: { ...KASSE, kennung: kG2 } });
    ok(del1.ok && m1 && m1.meta.entfernt > 0 && !(m1.daten.windows || []).length && !m1.meta.bezahlt && !m1.meta.fenster && del1.aufmasse.every((a) => a.kennung !== kG2) && wieder1._status === 410 && wieder1.geloescht && lesen1._status === 410 && kasse1._status === 410 && kasse1.geloescht, 'Ein Aufmaß löschen: Inhalt, Zähler und Kauf weg, nur eine Löschmarke bleibt; ein anderes Gerät legt es nicht wieder an (410), auch keine Kasse');
    const delK = await rufe('/api/kunde/loeschen', { token: T, body: {} }), restK = await sp.eigeneVonNutzer((await (await import('../functions/api/auth.js')).nutzer(umg.konfig(env), T)).id), mK1 = await sp.eigenesHolen(K1);
    const wiederK = await sichern(T, K1, [fw(1)]), listeK = await rufe('/api/kunde/aufmasse', { token: T }); // dieselbe Adresse meldet sich wieder an
    ok(delK.ok && restK.length === 0 && mK1 && mK1.meta.entfernt > 0 && !(mK1.daten.windows || []).length && wiederK._status === 410 && listeK.aufmasse.length === 0, 'Konto löschen: alle Aufmaße weg (nur Löschmarken); nach neuem Anmelden kommt keines zurück');
    /* Supabase gestört: kein „abgelaufen“ (sonst wirft die App eine gültige Anmeldung weg); abgelehnt: abgelaufen */
    const auth = await import('../functions/api/auth.js'), kSb = { supabase: { url: 'https://pruef15.supabase.co', anon: 'sb_publishable_pruef15' } }, echtFetch = globalThis.fetch;
    const mit = async (status, fn) => { globalThis.fetch = async () => new Response(JSON.stringify(status >= 500 ? { message: 'down' } : { error: 'invalid_grant' }), { status: status, headers: { 'content-type': 'application/json' } }); try { return await fn(); } catch (e) { return e; } finally { globalThis.fetch = echtFetch; } };
    const e500 = await mit(500, () => auth.erneuern(kSb, 'r1')), e429 = await mit(429, () => auth.nutzer(kSb, 'tok-pruef15-' + stempel)), e400 = await mit(400, () => auth.erneuern(kSb, 'r2')), e401 = await mit(401, () => auth.nutzer(kSb, 'tok2-pruef15-' + stempel));
    ok(e500 && e500.status === 503 && e429 && e429.status === 503 && e400 === null && e401 === null, 'Anmeldung bei Störung von Supabase (5xx, 429): Fehler 503 statt „abgelaufen“; abgelehnte Erneuerung und ungültiges Token: abgelaufen');
    /* Aufmaß ohne Besitzer (Anmeldung anders als über die App gelöscht): niemand übernimmt es, die App sichert ihre Kopie neu */
    const tokO = 'test.' + Buffer.from('ohne15-' + stempel + '@beispiel.de', 'utf8').toString('base64').replace(/=+$/, ''), KO = 'p15q' + stempel;
    await sp.eigenesAendern(KO, null, (r) => { r.daten = { windows: [fw(1)], proj: { name: 'Altes Haus' } }; return true; });
    const oG = await rufe('/api/kunde/aufmass/' + KO, { token: tokO }), oP = await sichern(tokO, KO, [fw(1), fw(2)]), oK = await rufe('/api/zahlung/start', { token: tokO, body: { ...KASSE, kennung: KO } }), oRow = await sp.eigenesHolen(KO);
    ok(oG._status === 409 && oG.verwaist && oP._status === 409 && oP.verwaist && oK._status === 409 && oK.sichern && !oRow.nutzer && oRow.daten.windows.length === 1, 'Aufmaß ohne Besitzer: weder lesen noch übernehmen (409 „verwaist“), die Kasse verlangt Sichern; die App sichert ihre Kopie unter neuer Kennung');
    // d) Aufräumen: nach 12 Monaten ohne Änderung weg, freigeschaltete erst nach 3 Jahren, nichts, was sich während des Laufs ändert
    const tokA = 'test.' + Buffer.from('alt15-' + stempel + '@beispiel.de', 'utf8').toString('base64').replace(/=+$/, '');
    const mitZeit = async (versatz, fn) => { const D = globalThis.Date; class Frueher extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() - versatz); } static now() { return D.now() - versatz; } } globalThis.Date = Frueher; try { return await fn(); } finally { globalThis.Date = D; } };
    await mitZeit(400 * TAG, async () => { // vor 400 Tagen zuletzt geändert: x freigeschaltet, y nicht
      await sichern(tokA, 'p15x' + stempel, [fw(1)]); await sichern(tokA, 'p15y' + stempel, [fw(1)]);
      await sp.eigenesAendern('p15x' + stempel, null, (r) => { r.meta = Object.assign({}, r.meta, { bezahlt: { session: 's', token: 't', at: 1 } }); return true; });
    });
    await sichern(tokA, 'p15z' + stempel, [fw(1)]); await sichern(tokA, 'p15w' + stempel, [fw(1)]);
    await mitZeit(400 * TAG, async () => { await sichern(tokA, 'p15m' + stempel, [fw(1)]); await sp.eigenesWeg('p15m' + stempel); }); // Löschmarke von vor 400 Tagen
    await sichern(tokA, 'p15n' + stempel, [fw(1)]); await sp.eigenesWeg('p15n' + stempel); // frische Löschmarke
    await sp.eigenesAendern('p15o' + stempel, null, (r) => { r.daten = { windows: [fw(1)], proj: {} }; return true; }); // ohne Besitzer (Anmeldung anders gelöscht)
    const echtAlle = sp.eigeneAlle; // w steht in der Liste noch alt, wurde aber inzwischen gespeichert (Änderung während des Laufs)
    sp.eigeneAlle = async () => (await echtAlle()).map((e) => (e.kennung === 'p15w' + stempel ? Object.assign({}, e, { updated_at: new Date(Date.now() - 400 * TAG).toISOString() }) : e));
    const auf = await ze.aufraeumen(umg.konfig(env), sp);
    sp.eigeneAlle = echtAlle;
    const o15 = await sp.eigenesHolen('p15o' + stempel);
    ok(!!(await sp.eigenesHolen('p15x' + stempel)) && !(await sp.eigenesHolen('p15y' + stempel)) && !!(await sp.eigenesHolen('p15z' + stempel)) && !!(await sp.eigenesHolen('p15w' + stempel)), 'Aufräumen: Aufmaß nach 12 Monaten ohne Änderung weg, freigeschaltetes bleibt (3 Jahre), aktuelles bleibt, eines mit Änderung während des Laufs auch');
    ok(auf.eigene === 4 && !(await sp.eigenesHolen('p15m' + stempel)) && !!(await sp.eigenesHolen('p15n' + stempel)) && o15 && o15.meta.entfernt > 0 && !(o15.daten.windows || []).length, 'Aufräumen: Löschmarken 12 Monate nach dem Löschen weg, frische bleiben; Aufmaße ohne Besitzer werden zur Löschmarke');
  } catch (e) {
    ok(false, 'Konten im Prozess ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  }

  // e) Im Browser: Gast, sichern, zweites Gerät, Kauf nur mit Konto, Konto-Seite, abmelden, Link aus der E-Mail, abgelaufene Anmeldung
  const cp = await import('node:child_process'), pfad = await import('node:path'), urlM = await import('node:url');
  const port = 9100 + Math.floor(Math.random() * 80), B6 = 'http://localhost:' + port;
  const kind = cp.spawn(process.execPath, [pfad.join(pfad.dirname(urlM.fileURLToPath(import.meta.url)), 'dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', MAIL_ATTRAPPE: '1' }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind.stderr.on('data', (dd) => process.stderr.write('  [Server 6] ' + dd));
  const aus6 = () => { try { kind.kill(); } catch (e) { /* schon weg */ } }; process.on('exit', aus6);
  const fensterAnlegen = (seite, liste) => seite.evaluate((liste) => { liste.forEach((f) => { S.win = Object.assign(baseWin(), { name: f[0], mo: { hm: f[2] + 70, hl: f[2] + 70, hr: f[2] + 70, wm: f[1] + 140, wt: f[1] + 140, wb: f[1] + 140 }, el: { w: f[1], h: f[2] }, w: f[1], h: f[2], fotos: 2 }); S.editIdx = -1; saveWin(); }); go('home'); }, liste);
  const ruhig = (seite) => seite.waitForFunction(() => S.sync && S.sync.geladen && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
  const anmelden = async (seite, mail, agb) => { await seite.fill('#s-mail', mail); if (agb) await seite.click('[data-in="sc"][data-f="agb"]'); await seite.click('.bb .btn.primary'); await seite.waitForSelector('#s-code'); await seite.fill('#s-code', '123456'); await seite.click('.bb .btn.primary'); };
  const mail6 = 'haus6-' + stempel + '@beispiel.de';
  try {
    let bereit = false; for (let i = 0; i < 60 && !bereit; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit = (await fetch(B6 + '/api/status').then((r) => r.json())).konten === true; } catch (e) { /* noch nicht */ } }
    ok(bereit, 'Testserver mit Konten läuft: ' + B6);
    const c1 = await browser.newContext(telefon), s1 = await neueSeite(c1, B6);
    await s1.goto(B6 + '/app/', { waitUntil: 'networkidle' }); await s1.waitForTimeout(300);
    const start = await s1.evaluate(() => ({ anmelden: !!document.querySelector('.hero [data-act="anmelden"]'), text: document.querySelector('.hero').textContent }));
    ok(start.anmelden && /Schon ein Aufmaß gesichert\?/.test(start.text), 'Startbild als Gast: „Schon ein Aufmaß gesichert? Anmelden“');
    await fensterAnlegen(s1, [['Wohnzimmer', 1230, 1410], ['Küche', 1010, 1210]]); await s1.waitForTimeout(300);
    const gast = await s1.evaluate(() => { const k = document.querySelector('.konto-karte'), l = document.querySelector('.liste-in'); return { text: k ? k.textContent : '', nachListe: !!(k && l && k.getBoundingClientRect().top > l.getBoundingClientRect().bottom), vorDatei: !!(k && document.querySelector('.datei-card') && k.getBoundingClientRect().top < document.querySelector('.datei-card').getBoundingClientRect().top), offen: S.sync.offen, ks: !!KS }; });
    ok(/Nur auf diesem Gerät/.test(gast.text) && /Aufmaß sichern/.test(gast.text) && gast.nachListe && gast.vorDatei && gast.offen && !gast.ks, 'Gast mit Fenstern: Karte „Nur auf diesem Gerät · Aufmaß sichern“ direkt unter der Liste; noch nichts auf dem Server');
    await foto(s1, 'app-gast-sichern');
    await s1.click('.konto-karte [data-act="sichern"]'); await s1.waitForSelector('#s-mail');
    await s1.click('.bb .btn.primary'); await s1.waitForTimeout(200);
    ok(await s1.locator('.kf.bad').count() === 1 && await s1.locator('.kcheck.bad').count() === 1 && await s1.evaluate(() => S.screen === 'sichern' && S.sichern.schritt === 1), 'Sichern: ohne E-Mail und Zustimmung kein Code');
    await foto(s1, 'app-sichern-mail');
    await s1.fill('#s-mail', mail6); await s1.click('[data-in="sc"][data-f="agb"]'); await s1.click('.bb .btn.primary'); await s1.waitForSelector('#s-code'); await s1.waitForTimeout(250);
    await foto(s1, 'app-sichern-code');
    const codeSchirm = await s1.evaluate(() => ({ max: document.getElementById('s-code').getAttribute('maxlength'), text: document.body.innerText, link: (document.querySelector('.link-statt-code') || {}).textContent || '' }));
    ok(codeSchirm.max === '10' && !/sechsstellig/.test(codeSchirm.text) && /Wir haben dir einen Code an/.test(codeSchirm.text) && /Link statt eines Codes, öffne ihn in diesem Browser: Dein Aufmaß liegt bisher nur hier/.test(codeSchirm.link), 'Code-Schritt: Feld für 6 bis 10 Stellen (Länge stellt man bei Supabase ein), kein „sechsstellig“; Hinweis, einen Link statt Code in diesem Browser zu öffnen');
    /* Server: jede Länge von 6 bis 10 Stellen ist ein Code (dann „stimmt nicht“), 5 oder 11 Stellen sind keiner */
    const codeLaenge = async (pfad, code) => (await fetch(B6 + pfad, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'cf-connecting-ip': '198.51.100.' + (laengen.length + 20) }, body: JSON.stringify({ mail: mail6, code: code }) }).then((r) => r.json())).fehler || ''; // eigene Adresse je Versuch: die Bremse der Seite bleibt für die übrigen Schritte frei
    const laengen = [];
    for (const pfad of ['/api/kunde/anmelden', '/api/konto/bestaetigen']) for (const c of ['12345', '87654321', '9876543210', '12345678901']) laengen.push(await codeLaenge(pfad, c));
    ok(laengen.every((f, i) => ([1, 2].includes(i % 4) ? /stimmt nicht/.test(f) : /Bitte den Code aus der E-Mail eingeben/.test(f))), 'Anmeldecode mit 8 oder 10 Stellen wird geprüft (Supabase: Email OTP Length), 5 oder 11 Stellen gelten nicht als Code (App und Betriebsbereich)');
    await s1.fill('#s-code', '999999'); await s1.click('.bb .btn.primary'); await s1.waitForTimeout(500);
    const falschC = await s1.evaluate(() => ({ screen: S.screen, err: (S.sichern && S.sichern.err.code) || '', ks: !!KS }));
    await s1.fill('#s-code', '123456'); await s1.click('.bb .btn.primary');
    await s1.waitForFunction(() => S.screen === 'home' && KS, null, { timeout: 8000 }); await ruhig(s1); await s1.waitForTimeout(300);
    const gesichert = await s1.evaluate(async () => ({ karte: document.querySelector('.konto-karte').textContent, liste: (await kontoJson('/api/kunde/aufmasse')).aufmasse, kennung: S.kauf.kennung }));
    ok(falschC.screen === 'sichern' && /stimmt nicht/.test(falschC.err) && !falschC.ks && /Gesichert/.test(gesichert.karte) && gesichert.liste.length === 1 && gesichert.liste[0].kennung === gesichert.kennung && gesichert.liste[0].fenster === 2, 'Nach dem Code: Aufmaß im Konto (2 Fenster), Karte „Gesichert“; ein falscher Code meldet sich');
    await foto(s1, 'app-gesichert');
    // zweites Gerät: Anmelden, die Liste ist da; Änderung kommt zurück aufs erste Gerät
    const c2 = await browser.newContext(telefon), s2 = await neueSeite(c2, B6);
    await s2.goto(B6 + '/app/', { waitUntil: 'networkidle' }); await s2.waitForTimeout(250);
    await s2.click('.hero [data-act="anmelden"]'); await s2.waitForSelector('#s-mail');
    ok(await s2.locator('[data-in="sc"]').count() === 0 && /Weiter mit deinem Aufmaß/.test(await s2.evaluate(() => document.body.innerText)), 'Anmelden auf einem anderen Gerät: nur E-Mail und Code, ohne erneute Zustimmung');
    await anmelden(s2, mail6, false);
    await s2.waitForFunction(() => S.windows.length === 2, null, { timeout: 8000 }); await s2.waitForTimeout(300);
    const zwei = await s2.evaluate(() => ({ namen: S.windows.map((w) => w.name).join(','), h1: document.querySelector('.hd h1').textContent, karte: (document.querySelector('.konto-karte') || {}).textContent || '' }));
    ok(zwei.namen === 'Wohnzimmer,Küche' && zwei.h1 === 'Weiter, wo du warst.' && /Gesichert/.test(zwei.karte), 'Anderes Gerät nach dem Anmelden: dasselbe Aufmaß, „Weiter, wo du warst.“');
    await s2.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.win.name = 'Wohnzimmer links'; saveWin(); go('home'); }); await ruhig(s2);
    await s1.reload({ waitUntil: 'networkidle' }); await s1.waitForFunction(() => S.windows[0] && S.windows[0].name === 'Wohnzimmer links', null, { timeout: 8000 });
    ok(true, 'Änderung auf dem zweiten Gerät ist nach dem Neuladen auch auf dem ersten da');
    // Kauf auf Gerät 2 (mit Konto direkt zur Kasse), Gerät 1 bekommt den Kauf; danach endet die freie Woche
    await s2.evaluate(() => go('teilen')); await s2.waitForTimeout(200); await s2.click('.bb .btn.primary'); await s2.waitForSelector('[data-screen="kasse"]', { timeout: 8000 });
    const kasse = await s2.evaluate(() => document.body.innerText);
    await s2.click('[data-in="kc"][data-f="bedingungen"]'); await s2.click('[data-in="kc"][data-f="widerruf"]'); await s2.click('.bb .btn.primary');
    await s2.waitForFunction(() => S.kauf && S.kauf.paid && S.screen === 'gekauft', null, { timeout: 10000 });
    await s1.reload({ waitUntil: 'networkidle' }); await s1.waitForFunction(() => S.kauf && S.kauf.paid, null, { timeout: 8000 });
    const nach = await s1.evaluate(() => { S.win = kopie(S.windows[1]); S.editIdx = 1; go('fertig'); return { frei: FREI(), note: (document.querySelector('.note.warn') || {}).textContent || '' }; });
    ok(/Rechnung an haus6-/.test(kasse) && !/Wohin soll die Rechnung/.test(kasse) && nach.frei && /Seit dem Freischalten kannst du dieses Fenster noch viermal ändern/.test(nach.note), 'Mit Konto direkt zur Kasse (Rechnung an die E-Mail des Kontos); der Kauf kommt aufs andere Gerät; danach zählt jede Änderung („Seit dem Freischalten … noch viermal“)');
    let post15 = []; for (let i = 0; i < 20 && !post15.some((m) => m.an === mail6); i++) { post15 = (await fetch(B6 + '/api/test/post').then((r) => r.json())).post || []; if (!post15.some((m) => m.an === mail6)) await new Promise((r) => setTimeout(r, 150)); }
    const best15 = post15.filter((m) => m.an === mail6 && /Vertragsbestätigung/.test(m.betreff));
    ok(best15.length === 1 && /Ihre Zustimmung beim Kauf/.test(best15[0].html) && /Widerrufsbelehrung/.test(best15[0].html) && /Sie können Ihr Widerrufsrecht auch online unter/.test(best15[0].html) && /Muster-Widerrufsformular/.test(best15[0].html) && /Patrick Kies/.test(best15[0].html) && /7,99 €/.test(best15[0].html) && !/<script/.test(best15[0].html), 'Nach dem Kauf genau eine Vertragsbestätigung per E-Mail: Anbieter, Preis, Zustimmung zum sofortigen Beginn, AGB mit Widerrufsbelehrung und Muster-Widerrufsformular');
    // Konto-Seite: neues Aufmaß (das alte bleibt), zwischen Aufmaßen wechseln, abmelden, wieder anmelden
    await s1.evaluate(() => go('meinkonto')); await s1.waitForTimeout(300);
    await foto(s1, 'app-konto');
    const konto1 = await s1.evaluate(() => ({ n: document.querySelectorAll('.konto-aufmass').length, text: document.body.innerText }));
    await s1.click('[data-act="konto-neu"]'); await s1.waitForTimeout(300);
    const neuA = await s1.evaluate(() => ({ n: S.windows.length, paid: !!(S.kauf && S.kauf.paid), kennung: S.kauf.kennung }));
    await fensterAnlegen(s1, [['Gaube', 900, 1100]]); await ruhig(s1); await s1.evaluate(() => kontoListe()); await s1.waitForTimeout(300);
    await s1.evaluate(() => go('meinkonto')); await s1.waitForTimeout(300);
    const konto2 = await s1.evaluate(() => Array.from(document.querySelectorAll('.konto-aufmass')).map((x) => x.textContent));
    const nichtOffen = (seite, wahl) => seite.evaluate((wahl) => { const z = Array.from(document.querySelectorAll('.konto-zeile')).find((x) => !/GERADE GEÖFFNET/.test(x.textContent)); z.querySelector(wahl).click(); }, wahl);
    await nichtOffen(s1, '.konto-aufmass'); await s1.waitForFunction(() => S.windows.length === 2, null, { timeout: 8000 });
    const gewechselt = await s1.evaluate(() => ({ namen: S.windows.map((w) => w.name).join(','), paid: !!S.kauf.paid }));
    ok(konto1.n === 1 && /Angemeldet als/.test(konto1.text) && neuA.n === 0 && !neuA.paid && konto2.length === 2 && /freigeschaltet/.test(konto2.join('|')) && gewechselt.namen === 'Wohnzimmer links,Küche' && gewechselt.paid, '„Dein Konto“: neues Aufmaß beginnen, das alte bleibt im Konto; zwischen den Aufmaßen wechseln, der Kauf gehört zum richtigen');
    /* ein anderes Aufmaß direkt in der Liste löschen, mit Rückfrage an Ort und Stelle */
    await s1.evaluate(() => go('meinkonto')); await s1.waitForTimeout(250);
    await nichtOffen(s1, '.konto-weg'); await s1.waitForTimeout(200);
    const frageWeg = await s1.evaluate(() => { const f = document.querySelector('.liste-in .neu-frage'); return f ? f.textContent : ''; });
    await foto(s1, 'app-konto-loeschen');
    await s1.click('[data-act="aufmass-weg-ja"]'); await s1.waitForFunction(() => document.querySelectorAll('.konto-aufmass').length === 1, null, { timeout: 8000 });
    const nachWeg = await s1.evaluate(async () => ({ n: S.windows.length, liste: (await kontoJson('/api/kunde/aufmasse')).aufmasse.length }));
    ok(/löschen\?/.test(frageWeg) && /auf allen Geräten/.test(frageWeg) && nachWeg.n === 2 && nachWeg.liste === 1, '„Dein Konto“: ein anderes Aufmaß direkt in der Liste löschen, nach Rückfrage; das offene bleibt');
    await s1.evaluate(() => go('meinkonto')); await s1.waitForTimeout(200);
    await s1.click('[data-act="konto-frage"][data-v="abmelden"]'); await s1.waitForTimeout(150);
    const frage = await s1.evaluate(() => (document.querySelector('.neu-frage') || {}).textContent || '');
    await s1.click('[data-act="konto-abmelden-ja"]'); await s1.waitForFunction(() => !KS && S.screen === 'home', null, { timeout: 8000 });
    const ab = await s1.evaluate(() => ({ n: S.windows.length, speicher: localStorage.getItem('aufmass.v1'), sitzung: localStorage.getItem('aufmass.kunde'), toast: S.toast }));
    ok(/bleibt in deinem Konto/.test(frage) && ab.n === 0 && !ab.sitzung && (!ab.speicher || JSON.parse(ab.speicher).windows.length === 0) && /Abgemeldet/.test(ab.toast), 'Abmelden fragt nach; danach ist das Aufmaß von diesem Gerät weg, im Konto bleibt es');
    // Anmeldelink aus der E-Mail (#access_token=…): in dem Browser, der den Code angefordert hat, ohne Rückfrage
    const tok6 = 'test.' + Buffer.from(mail6, 'utf8').toString('base64').replace(/=+$/, ''), linkAdr = (tok) => B6 + '/app/#access_token=' + encodeURIComponent(tok) + '&refresh_token=test-refresh&type=magiclink';
    await s1.evaluate((m) => localStorage.setItem('aufmass.kunde.anfrage', JSON.stringify({ mail: m, zweck: 'anmelden', at: Date.now() })), mail6);
    await s1.goto(linkAdr(tok6), { waitUntil: 'networkidle' });
    await s1.waitForFunction(() => KS && S.windows.length > 0, null, { timeout: 8000 }); await s1.waitForTimeout(200);
    const link = await s1.evaluate(() => ({ hash: location.hash, mail: KS.mail, n: S.windows.length, screen: S.screen, anfrage: localStorage.getItem('aufmass.kunde.anfrage') }));
    ok(link.hash === '' && link.mail === mail6 && link.n >= 1 && link.screen === 'home' && !link.anfrage, 'Anmeldelink im Browser, der den Code angefordert hat: ohne Rückfrage angemeldet, zuletzt bearbeitetes Aufmaß geladen, Adresse bereinigt');
    // Ein Link, den dieser Browser nicht angefordert hat (etwa untergeschoben): erst die Rückfrage mit der Adresse des Kontos
    const c3 = await browser.newContext(telefon), s3 = await neueSeite(c3, B6);
    await s3.goto(B6 + '/app/', { waitUntil: 'networkidle' }); await fensterAnlegen(s3, [['Gast-Bad', 600, 800]]); await s3.waitForTimeout(250);
    const vorLink = (await fetch(B6 + '/api/kunde/aufmasse', { headers: { authorization: 'Bearer ' + tok6, accept: 'application/json' } }).then((r) => r.json())).aufmasse.length;
    await s3.goto(linkAdr(tok6), { waitUntil: 'networkidle' }); await s3.waitForFunction(() => S.screen === 'linkanmelden', null, { timeout: 8000 }); await s3.waitForTimeout(200);
    const frageL = await s3.evaluate(() => ({ hash: location.hash, ks: !!KS, gespeichert: localStorage.getItem('aufmass.kunde'), text: document.body.innerText }));
    await foto(s3, 'app-link-rueckfrage');
    await s3.click('[data-act="link-anmelden-nein"]'); await s3.waitForTimeout(300);
    const nein = await s3.evaluate(() => ({ ks: !!KS, gespeichert: localStorage.getItem('aufmass.kunde'), n: S.windows.length, screen: S.screen }));
    const nachNein = (await fetch(B6 + '/api/kunde/aufmasse', { headers: { authorization: 'Bearer ' + tok6, accept: 'application/json' } }).then((r) => r.json())).aufmasse.length;
    ok(frageL.hash === '' && !frageL.ks && !frageL.gespeichert && /Mit diesem Konto anmelden\?/.test(frageL.text) && frageL.text.includes(mail6) && /in diesem Konto gesichert/.test(frageL.text) && !/anderen Browser oder einer anderen App/.test(frageL.text) && !nein.ks && !nein.gespeichert && nein.n === 1 && nein.screen === 'home' && nachNein === vorLink, 'Fremder Anmeldelink: Rückfrage mit der Adresse des Kontos, vorher keine Anmeldung; „Nicht anmelden“ lässt alles, wie es war, nichts geht ins fremde Konto');
    /* Link in einem leeren Browser (Mail-App öffnet ihn woanders als dort, wo gemessen wurde): Hinweis, wo das Aufmaß liegt */
    const c3b = await browser.newContext(telefon), s3b = await neueSeite(c3b, B6);
    await s3b.goto(linkAdr(tok6), { waitUntil: 'networkidle' }); await s3b.waitForFunction(() => S.screen === 'linkanmelden', null, { timeout: 8000 }); await s3b.waitForTimeout(200);
    const leer = await s3b.evaluate(() => ({ ks: !!KS, n: S.windows.length, note: (document.querySelector('.note.link-anderswo') || {}).textContent || '' }));
    await foto(s3b, 'app-link-anderer-browser');
    ok(!leer.ks && leer.n === 0 && /in einem anderen Browser oder einer anderen App angefangen\? Dann liegt es dort und noch nicht in deinem Konto/.test(leer.note) && /gib dort den Code aus der E-Mail ein/.test(leer.note), 'Anmeldelink in einem Browser ohne Aufmaß: Hinweis, dass ein angefangenes Aufmaß im anderen Browser liegt und dort mit dem Code ins Konto kommt');
    sauber(s3b, 'Anmeldelink im leeren Browser ohne Fehler'); await c3b.close();
    await s3.goto(linkAdr(tok6), { waitUntil: 'networkidle' }); await s3.waitForFunction(() => S.screen === 'linkanmelden', null, { timeout: 8000 });
    await s3.click('[data-act="link-anmelden-ja"]'); await s3.waitForFunction(() => KS && S.screen === 'home' && S.sync.ok && !S.sync.offen, null, { timeout: 8000 });
    const nachJa = (await fetch(B6 + '/api/kunde/aufmasse', { headers: { authorization: 'Bearer ' + tok6, accept: 'application/json' } }).then((r) => r.json())).aufmasse.length;
    ok(nachJa === vorLink + 1, 'Nach „Anmelden“ in der Rückfrage: angemeldet, das Aufmaß dieses Geräts ist im Konto');
    sauber(s3, 'Anmeldelink mit Rückfrage ohne Fehler'); await c3.close();
    // abgelaufene Anmeldung: Hinweis „Bitte neu anmelden“, nichts geht verloren
    await s1.evaluate(() => { kontoMerken({ token: 'kaputt', refresh: 'kaputt', mail: KS.mail }); });
    await s1.reload({ waitUntil: 'networkidle' }); await s1.waitForFunction(() => !KS && S.konto.abgelaufen, null, { timeout: 8000 }); await s1.waitForTimeout(300);
    const abgelaufen = await s1.evaluate(() => ({ karte: (document.querySelector('.konto-karte') || {}).textContent || '', n: S.windows.length }));
    ok(/Bitte neu anmelden/.test(abgelaufen.karte) && abgelaufen.n >= 1, 'Abgelaufene Anmeldung: Hinweis „Bitte neu anmelden“, das Aufmaß bleibt auf dem Gerät');
    // Konto löschen
    await s2.evaluate(() => go('meinkonto')); await s2.waitForTimeout(200);
    await s2.click('[data-act="konto-frage"][data-v="loeschen"]'); await s2.waitForTimeout(150); await s2.click('[data-act="konto-loeschen-ja"]');
    await s2.waitForFunction(() => !KS && S.screen === 'home', null, { timeout: 8000 });
    const weg = await fetch(B6 + '/api/kunde/aufmasse', { headers: { authorization: 'Bearer ' + tok6, accept: 'application/json' } }).then((r) => r.json());
    ok(weg.ok && weg.aufmasse.length === 0 && await s2.evaluate(() => S.windows.length === 0), 'Konto löschen: alle Aufmaße weg, auf dem Gerät auch');
    // Gerät 1 hat noch eine Kopie (Anmeldung abgelaufen): nach neuem Anmelden kommt das gelöschte Aufmaß nicht zurück, es geht auch hier weg
    const vorher1 = await s1.evaluate(() => S.windows.length);
    await s1.evaluate(() => sichernStart('anmelden')); await s1.waitForSelector('#s-mail');
    await anmelden(s1, mail6, false);
    await s1.waitForFunction(() => KS && S.windows.length === 0 && S.screen === 'home', null, { timeout: 8000 }); await s1.waitForTimeout(300);
    const zurueck = await s1.evaluate(async () => ({ toast: S.toast, liste: (await kontoJson('/api/kunde/aufmasse')).aufmasse.length }));
    ok(vorher1 >= 1 && /gelöscht/.test(zurueck.toast) && zurueck.liste === 0, 'Gelöschtes Konto: ein Gerät mit alter Kopie legt das Aufmaß nach neuem Anmelden nicht wieder an, sondern nimmt es weg');
    // Konto voll (20 Aufmaße): Das Aufmaß dieses Geräts bleibt hier, gilt nicht als gesichert, Abmelden würde es nicht wegwerfen;
    // ein altes in der Liste löschen, dann kommt es hinein
    const mailV = 'voll6-' + stempel + '@beispiel.de', tokV6 = 'test.' + Buffer.from(mailV, 'utf8').toString('base64').replace(/=+$/, '');
    for (let i = 0; i < 20; i++) { const j = Date.now(); await fetch(B6 + '/api/kunde/aufmass/p6v' + i + stempel, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', authorization: 'Bearer ' + tokV6 }, body: JSON.stringify({ windows: [{ wid: 'v' + i, t0: j, aend: 0, ts: j, name: 'Alt ' + i }], proj: { name: 'Altes Haus ' + i }, projTs: j, stand: j, angelegt: 1, bekannt: ['v' + i], geloescht: {} }) }); }
    const c5 = await browser.newContext(telefon), s5 = await neueSeite(c5, B6);
    await s5.goto(B6 + '/app/', { waitUntil: 'networkidle' }); await fensterAnlegen(s5, [['Neues Haus', 900, 1200]]); await s5.waitForTimeout(250);
    await s5.click('.konto-karte [data-act="sichern"]'); await s5.waitForSelector('#s-mail');
    await anmelden(s5, mailV, true);
    await s5.waitForFunction(() => KS && S.screen === 'home' && S.sync.voll, null, { timeout: 8000 }); await s5.waitForTimeout(300);
    const voll = await s5.evaluate(() => ({ toast: S.toast, karte: (document.querySelector('.konto-karte') || {}).textContent || '', n: S.windows.length, konto: S.kauf.konto || '', gemerkt: JSON.parse(localStorage.getItem('aufmass.v1')).voll }));
    await s5.reload({ waitUntil: 'networkidle' }); await s5.waitForFunction(() => KS && S.sync.voll, null, { timeout: 8000 }); await s5.waitForTimeout(250);
    const vollNeu = await s5.evaluate(() => (document.querySelector('.konto-karte') || {}).textContent || '');
    await foto(s5, 'app-konto-voll');
    await s5.evaluate(() => go('meinkonto')); await s5.waitForTimeout(200);
    await s5.click('[data-act="konto-frage"][data-v="abmelden"]'); await s5.waitForTimeout(150); await s5.click('[data-act="konto-abmelden-ja"]'); await s5.waitForTimeout(400);
    const blieb = await s5.evaluate(() => ({ ks: !!KS, n: S.windows.length, toast: S.toast, hinweis: !!document.querySelector('.note.warn') }));
    await s5.click('.konto-zeile .konto-weg'); await s5.waitForTimeout(150); await s5.click('[data-act="aufmass-weg-ja"]');
    await s5.waitForFunction(() => !S.sync.voll && S.sync.ok && !S.sync.offen && !S.sync.laeuft, null, { timeout: 8000 });
    const danach = (await fetch(B6 + '/api/kunde/aufmasse', { headers: { authorization: 'Bearer ' + tokV6, accept: 'application/json' } }).then((r) => r.json())).aufmasse;
    const hierK = await s5.evaluate(() => S.kauf.kennung);
    ok(!voll.konto && voll.gemerkt === true && /Nicht gesichert/.test(vollNeu), 'Konto voll: das Aufmaß gilt erst nach dem Hochladen als Teil des Kontos; „Nicht gesichert“ bleibt auch nach dem Neuladen');
    ok(/20 Aufmaße/.test(voll.toast) && !/Gesichert/.test(voll.toast) && /Nicht gesichert/.test(voll.karte) && voll.n === 1 && blieb.ks && blieb.n === 1 && /verloren/.test(blieb.toast) && blieb.hinweis && danach.length === 20 && danach.some((a) => a.kennung === hierK), 'Konto voll: das Aufmaß bleibt auf dem Gerät und heißt „Nicht gesichert“, Abmelden würde es nicht wegwerfen; nach dem Löschen eines alten kommt es ins Konto');
    /* anderswo gelöscht, während hier die Kasse offen ist: nicht mit einem anderen Aufmaß an der Kasse stehen bleiben */
    await s5.evaluate(() => go('kasse')); await s5.waitForTimeout(200);
    await fetch(B6 + '/api/kunde/aufmass/' + hierK + '/loeschen', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', authorization: 'Bearer ' + tokV6 }, body: '{}' });
    await s5.evaluate(() => kaufStarten()); await s5.waitForFunction(() => S.screen === 'home' && S.kauf.kennung !== '', null, { timeout: 8000 }); await s5.waitForTimeout(300);
    const nachK = await s5.evaluate((k) => ({ screen: S.screen, kennung: S.kauf.kennung, toast: S.toast, sichern: S.sichern }), hierK);
    ok(nachK.screen === 'home' && nachK.kennung !== hierK && !nachK.sichern, 'Anderswo gelöscht, während hier die Kasse offen ist: zurück zur Startseite mit dem nächsten Aufmaß, nicht an der Kasse');
    s5.probleme = s5.probleme.filter((x) => !/\b(409|410)\b/.test(x)); sauber(s5, 'Konto voll ohne Fehler (außer den gewollten Antworten „voll“ und „gelöscht“)'); await c5.close();
    /* Anmeldelink, wenn die App zugleich nach einer Zahlung zurückkommt: beides wird verarbeitet */
    const c7 = await browser.newContext(telefon), s7 = await neueSeite(c7, B6), mail7 = 'link7-' + stempel + '@beispiel.de', tok7 = 'test.' + Buffer.from(mail7, 'utf8').toString('base64').replace(/=+$/, '');
    await c7.addInitScript((m) => { try { if (!sessionStorage.getItem('einmal')) { sessionStorage.setItem('einmal', '1'); localStorage.setItem('aufmass.kunde.anfrage', JSON.stringify({ mail: m, zweck: 'anmelden', at: Date.now() })); } } catch (e) { /* ok */ } }, mail7);
    await s7.goto(B6 + '/app/?bezahlt=wartet_' + stempel + '#access_token=' + encodeURIComponent(tok7) + '&refresh_token=test-refresh&type=magiclink', { waitUntil: 'networkidle' });
    await s7.waitForFunction(() => KS && KS.mail, null, { timeout: 8000 });
    ok(await s7.evaluate((m) => KS.mail === m && !/access_token/.test(location.href) && !/bezahlt=/.test(location.href), mail7), 'Anmeldelink zusammen mit der Rückkehr von der Kasse: die Anmeldung geht nicht verloren');
    await c7.close();
    for (const s of [s1, s2]) { s.probleme = s.probleme.filter((x) => !/\b(401|410)\b/.test(x)); } // abgelaufene Anmeldung und gelöschtes Aufmaß sind hier gewollt
    sauber(s1, 'Konto im Browser ohne Fehler (Gerät 1)'); sauber(s2, 'Konto im Browser ohne Fehler (Gerät 2)');
    await c1.close(); await c2.close();
    // Gestaltung: Gast-Karte, Sichern, Konto-Seite, Telefon hell und dunkel
    const APP_GROESSEN = [13, 15, 17, 24, 32, 40], befund = [];
    const messen = (seite) => seite.evaluate(() => {
      const sichtbar = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 4; };
      const groessen = new Set(), klein = [];
      document.querySelectorAll('#app *').forEach((el) => { if (el.closest('svg')) return; if (sichtbar(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) groessen.add(parseFloat(getComputedStyle(el).fontSize)); });
      document.querySelectorAll('#app a, #app button, #app input').forEach((el) => { if (!sichtbar(el) || el.closest('svg') || el.matches('.ulink') || el.type === 'checkbox') return; const h = el.getBoundingClientRect().height; if (h < 43.5) klein.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' (' + Math.round(h) + ' px)'); });
      return { groessen: Array.from(groessen), klein: klein, quer: document.scrollingElement.scrollWidth > innerWidth + 1 };
    });
    for (const dunkel of [false, true]) {
      const c = await browser.newContext(Object.assign({}, telefon, dunkel ? { colorScheme: 'dark', reducedMotion: 'reduce' } : {})), s = await neueSeite(c, B6);
      await s.goto(B6 + '/app/', { waitUntil: 'networkidle' }); await fensterAnlegen(s, [['Bad', 610, 810]]); await s.waitForTimeout(300);
      const pruefe = async (name) => { const m = await messen(s), fremd = m.groessen.filter((g) => !APP_GROESSEN.includes(g)); if (fremd.length || m.klein.length || m.quer) befund.push((dunkel ? 'dunkel ' : 'hell ') + name + ': ' + (fremd.length ? 'Größen ' + fremd.join(', ') + ' ' : '') + (m.klein.length ? 'klein ' + m.klein.slice(0, 4).join('; ') : '') + (m.quer ? ' Querscrollen' : '')); };
      await pruefe('Gast');
      await s.click('.konto-karte [data-act="sichern"]'); await s.waitForSelector('#s-mail'); await s.waitForTimeout(250); await pruefe('Sichern');
      await anmelden(s, 'design' + (dunkel ? 'd' : 'h') + stempel + '-mit-einer-sehr-langen-adresse@beispiel-handwerk.de', true);
      await s.waitForFunction(() => S.screen === 'home' && KS, null, { timeout: 8000 }); await s.waitForTimeout(300); await pruefe('Gesichert');
      await s.evaluate(() => go('meinkonto')); await s.waitForTimeout(300); await pruefe('Konto');
      await s.evaluate(() => { S.kontoFrage = 'weg:' + ((S.konto.liste || [])[0] || {}).kennung; render(); }); await s.waitForTimeout(200); await pruefe('Löschen bestätigen');
      await s.evaluate(() => { S.kontoFrage = ''; S.linkAnmeldung = { ok: true, token: 'x', refresh: 'y', mail: 'jemand-mit-einer-sehr-langen-adresse@beispiel-handwerk.de', aufmasse: [] }; go('linkanmelden'); }); await s.waitForTimeout(250); await pruefe('Rückfrage Anmeldelink');
      await s.evaluate(() => { S.linkAnmeldung = null; go('meinkonto'); }); await s.waitForTimeout(200);
      if (dunkel) await foto(s, 'app-konto-dunkel');
      sauber(s, 'Gestaltung Konto ' + (dunkel ? 'dunkel' : 'hell') + ' ohne Fehler'); await c.close();
    }
    ok(!befund.length, 'Gestaltung (Telefon, hell und dunkel): Gast-Karte, Sichern, Konto-Seite nur mit 13 · 15 · 17 · 24 · 32 · 40, Ziele ab 44 px, lange E-Mail-Adressen ohne Querscrollen' + (befund.length ? '\n      ' + befund.join('\n      ') : ''));
  } catch (e) {
    ok(false, 'Konten im Browser ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally { aus6(); }
}

/* ---------- 16. Erstaufmaß: offen statt Vorgabe, Pflichtthemen, Förderweg, Balkon- und PSK-Tür, KI-Fachangaben, Gestaltung übernehmen ---------- */
if (teil(16)) {
  console.log('16. Erstaufmaß: offen statt Vorgabe, Pflichtthemen, Förderweg, neue Elemente, KI-Fachangaben, Gestaltung übernehmen');
  const cp16 = await import('node:child_process'), fs16 = await import('node:fs'), os16 = await import('node:os'), path16 = await import('node:path');
  const M16 = createRequire(import.meta.url)('../web/assets/modell.js'), AW16 = M16.AW, X16 = M16.Abrechnung;
  const MO = (w, h) => ({ hm: h + 60, hl: h + 60, hr: h + 60, wm: w + 60, wt: w + 60, wb: w + 60 });

  /* a) Gemeinsames Modell (Betriebsbereich und Server): offen, Pflichtthemen, Zielwerte, Maße gegen das Foto, Klärungsliste */
  const w1 = AW16.mk({ name: 'Küche', etage: 'og', bru: 450, offen: { fa: true, fba: true }, mo: MO(1230, 1410), el: { w: 1230, h: 1410 } });
  const zeile = (w, k, p) => (AW16.rows(w, p).find((r) => r[0] === k) || [])[1] || '';
  ok(AW16.istOffen(w1, 'fa') && AW16.farbe(w1, 'aussen')[0] === 'Farbe offen' && AW16.farbe(w1, 'aussen')[2] === '#f1f0ea' && /^außen offen, bitte beraten/.test(zeile(w1, 'Farbe')) && /außen offen, bitte beraten/.test(zeile(w1, 'Fensterbank')), 'Modell: offene Farbe außen und Fensterbank außen stehen als „offen, bitte beraten“, die Zeichnung zeigt neutral weiß');
  const tuer16 = AW16.mk({ art: 'hst', offen: { fba: true, griffA: true } });
  ok(AW16.offenListe(tuer16).length === 0 && AW16.offenListe(AW16.mk({ form: 'rund', offen: { fba: true } })).length === 0, 'Modell: offene Angaben gelten nur, wo sie zum Element gehören (keine Fensterbank an Türen und runden Fenstern)');
  ok(AW16.absturzFrage(w1) && !AW16.absturzFrage(AW16.mk({ etage: 'eg', bru: 300 })) && !AW16.absturzFrage(AW16.mk({ etage: 'og', bru: 950 })) && AW16.absturzFrage(AW16.mk({ etage: 'dg', art: 'balkon' })) && AW16.absturzFrage(AW16.mk({ etage: 'og', bru: '', ki: { fach: { bruestung: 'bodentief' } } })) && !AW16.absturzFrage(AW16.mk({ etage: 'og', bru: '' })), 'Absturzsicherung: gefragt im OG und DG unter 900 mm Brüstung, bei Türen immer, ohne Maß bei bodentiefer Brüstung laut Foto; nicht im EG, nicht ab 900 mm');
  const pB = { foerdweg: 'bafa' };
  ok(AW16.uwZiel(AW16.mk({}), pB).wert === 0.95 && AW16.uwZiel(AW16.mk({ rc: 'rc2' }), pB).wert === 1.1 && AW16.uwZiel(AW16.mk({ art: 'hst', hst: { schema: 'A', richtung: 'R', schwelle: 'null' } }), pB).wert === 1.1 && AW16.uwZiel(AW16.mk({ glasfn: ['schall'] }), { foerdweg: 'steuer' }).wert === 1.1 && AW16.uwZiel(AW16.mk({}), { foerdweg: 'steuer', gebaeude: 'denkmal' }).wert === 1.4 && AW16.uwZiel(AW16.mk({ spross: 'echt', bars: [{ s: 0, d: 'v', p: 0.5 }] }), { foerdweg: 'bafa', gebaeude: 'denkmal' }).wert === 1.6 && AW16.uwZiel(AW16.mk({}), { foerdweg: 'keine' }) === null && AW16.foerdWeg({ foerd: true }) === 'offen' && /Uw höchstens 0,95 W\/\(m²K\), BAFA/.test(zeile(AW16.mk({}), 'Förderwert', pB)), 'Förderweg: Uw-Zielwerte 0,95, 1,1 (RC2, barrierearme Schwelle, Schallschutz), 1,4 und 1,6 (Denkmal); ohne Förderung keiner; ältere Aufmaße mit „Förderung ja“ gelten als noch offen');
  const mw = (w, h, v, extra) => AW16.mk(Object.assign({ mo: MO(w, h), el: { w: w, h: h }, ki: { verh: v } }, extra || {}));
  ok(AW16.massPruef(mw(1230, 1410, 0.87)) === null && AW16.massPruef(mw(1410, 1230, 0.87)).typ === 'tausch' && AW16.massPruef(mw(1230, 2400, 0.87)).typ === 'abweichung' && AW16.massPruef(mw(1410, 1230, 0.87, { neu: true })) === null && AW16.massPruef(mw(1000, 1000, 0.87)) === null && AW16.massPruef(mw(1410, 1230, null)) === null, 'Maße gegen das Foto: passend still, vertauscht und stark abweichend erkannt; kleine Abweichung (Schrägsicht), neue Öffnung und fehlendes Verhältnis ohne Hinweis');
  const kl16 = AW16.klaerung([w1, AW16.mk({ name: 'Bad', offen: { fa: true } }), mw(1410, 1230, 0.87, { name: 'Flur', massOk: true })], { total: 6, foerdweg: 'offen' }).map((r) => r.k + ': ' + r.v).join('\n');
  ok(/Pos\. 1 Küche: Absturzsicherung nötig \(OG, Brüstung 450 mm\): bitte beraten/.test(kl16) && /Lüftung: Lüftungskonzept nach DIN 1946-6 erforderlich: 3 von 6/.test(kl16) && /Förderung: Noch offen/.test(kl16) && /Pos\. 3 Flur: Breite und Höhe laut Foto vertauscht\? Die Maße sind bestätigt\. Beim Feinaufmaß prüfen\./.test(kl16) && /Pos\. 1 Küche: Farbe außen, Fensterbank außen: offen, bitte beraten/.test(kl16) && /Pos\. 2 Bad: Farbe außen: offen/.test(kl16), 'Klärungsliste: Absturzsicherung, Lüftungskonzept ab mehr als einem Drittel, Förderweg, vertauschte Maße (auch bestätigt), offene Wünsche je Position');
  ok(AW16.klaerKurz([w1, AW16.mk({ offen: { fa: true } })], {}).join(', ') === 'Absturzsicherung (Pos. 1), Farbe außen (alle), Fensterbank außen (Pos. 1)', 'Klärungsliste in einer Zeile: je Angabe mit Positionen, „alle“, wenn es jede Position betrifft');
  const motor16 = AW16.klaerung([AW16.mk({ sart: 'rollladen', roll: 'aufsatz', antrieb: 'motor', ki: { fach: { strom: false } } }), AW16.mk({ sart: 'raffstore', roll: 'aufsatz', antrieb: 'smart', ki: { fach: { strom: true } } }), AW16.mk({ erreichbar: 'ja' })], {}).map((r) => r.v).join('\n');
  ok(/Strom am Fenster laut Foto nicht zu sehen/.test(motor16) && (motor16.match(/Elektrischer Antrieb/g) || []).length === 1 && /Leicht erreichbar, gewählt Basisschutz: Die Polizei empfiehlt RC2/.test(motor16), 'Klärungsliste: elektrischer Antrieb ohne Strom laut Foto (mit Strom kein Eintrag), leicht erreichbar ohne RC2');
  ok(X16.fromAppProj({ foerdweg: 'bafa' }).foerdweg === 'bafa' && X16.fromAppProj({ foerdweg: 'bafa' }).foerd === true && X16.fromAppProj({ foerdweg: 'quatsch' }).foerdweg === '' && X16.fromAppProj({ foerd: true }).foerd === true, 'Betriebsbereich übernimmt den Förderweg aus dem Aufmaß, nur bekannte Werte');
  ok(AW16.opening(AW16.mk({ art: 'psk', psk: { schema: 'A', richtung: 'L', schwelle: 'standard' }, sashes: [{ t: 'PS', din: 'L' }, { t: 'F', din: 'L' }] })) === '2-teilig (1 Schiebeflügel vor 1 Festteil), Schiebeflügel links, kippbar, mit Schwelle' && /Kunststoff-Alu/.test(zeile(AW16.mk({ material: 'kunststoffalu' }), 'Form, Material')) && AW16.istTuer(AW16.mk({ art: 'balkon' })) && /außen Ziehgriff mit Schnäpper/.test(zeile(AW16.mk({ art: 'balkon', bt: { schwelle: 'flach', griffA: 'ziehgriff', boden: 'neu' } }), 'Griff')) && /Fußboden wird erneuert/.test(zeile(AW16.mk({ art: 'balkon', bt: { schwelle: 'flach', griffA: 'ziehgriff', boden: 'neu' } }), 'Schwelle')), 'Modell kennt PSK-Tür (kippbar, mit Schwelle), Balkontür (Griff außen, Fußboden) und Kunststoff-Alu');
  ok(/Auf einen Blick/.test(AW16.kiRows(AW16.mk({ ki: { rows: [], fach: { rollladen: 'einbau', fassade: 'klinker', strom: true } } })).map((r) => r[0]).join()) && /Kasten: Einbaukasten innen im Sturz · Fassade Klinker · Strom am Fenster/.test(AW16.fachZeile(AW16.mk({ ki: { fach: { rollladen: 'einbau', fassade: 'klinker', strom: true } } }))), 'Fachangaben der KI stehen für den Betrieb „auf einen Blick“ vor dem Befund');

  /* b) App: offen statt Vorgabe */
  const ctx16 = await browser.newContext(telefon), a16 = await neueSeite(ctx16);
  await a16.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await a16.evaluate(() => newWin()); await a16.waitForTimeout(200);
  ok(await a16.evaluate(() => S.win.offen.fa === true && S.win.offen.fba === true && S.screen === 'start'), 'Neues Fenster: Farbe außen und Fensterbank außen starten ohne Vorauswahl (offen)');
  await a16.evaluate((MO) => { Object.assign(S.win, { name: 'Küche', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 } }); S.q = 'fa'; S.screen = 'frage'; render(true); }, MO(1230, 1410)); await a16.waitForTimeout(400);
  const fa0 = await a16.evaluate(() => ({ gedrueckt: document.querySelectorAll('.qpanel .qsw[aria-pressed="true"]').length, cur: document.querySelector('.qpanel .qcur').textContent, knopf: document.querySelector('.qoffen').getAttribute('aria-pressed'), farbe: document.querySelector('[data-r="el-back"]').style.background, karte: winCard(S.win, 0, false) }));
  ok(fa0.gedrueckt === 0 && /Noch offen/.test(fa0.cur) && fa0.knopf === 'true' && /241, 240, 234|#f1f0ea/i.test(fa0.farbe) && /Farbe offen/.test(fa0.karte), 'Farbe außen: nichts vorgewählt, „Weiß ich noch nicht“ gedrückt, Modell neutral weiß, Fensterkarte „Farbe offen“');
  await a16.click('.qpanel .qsw[data-v="7016"]'); await a16.waitForTimeout(200);
  const fa1 = await a16.evaluate(() => ({ offen: !!S.win.offen.fa, knopf: document.querySelector('.qoffen').getAttribute('aria-pressed'), zeile: specRows(S.win).find((r) => r.k === 'Farbe').v }));
  await a16.click('.qoffen'); await a16.waitForTimeout(200);
  const fa2 = await a16.evaluate(() => ({ offen: !!S.win.offen.fa, wunsch: S.win.wunschA, zeile: specRows(S.win).find((r) => r.k === 'Farbe').v }));
  await a16.click('#t-wunschA'); await a16.keyboard.type('RAL 7021'); await a16.waitForTimeout(200);
  const fa3 = await a16.evaluate(() => ({ offen: !!S.win.offen.fa, knopf: document.querySelector('.qoffen').getAttribute('aria-pressed') }));
  ok(!fa1.offen && fa1.knopf === 'false' && /außen Anthrazitgrau/.test(fa1.zeile) && fa2.offen && fa2.wunsch === '' && /außen offen, bitte beraten/.test(fa2.zeile) && !fa3.offen && fa3.knopf === 'false', 'Eine Farbe wählen (auch eingetippt) entscheidet; „Weiß ich noch nicht“ macht sie wieder offen, das Blatt sagt „offen, bitte beraten“');
  await a16.evaluate(() => { S.q = 'sart'; render(true); }); await a16.waitForTimeout(200);
  await a16.click('.qpanel [data-act="sart"][data-v="rollladen"]'); await a16.waitForTimeout(200);
  const so1 = await a16.evaluate(() => ({ einbau: !!S.win.offen.einbau, fragen: qList(S.win).map((q) => q.id), text: sonneText(S.win) }));
  await a16.evaluate(() => { S.q = 'einbau'; render(true); }); await a16.waitForTimeout(200);
  const so2 = await a16.evaluate(() => ({ gedrueckt: document.querySelectorAll('.qpanel .qopt[aria-pressed="true"]').length, knopf: (document.querySelector('.qoffen') || {}).textContent }));
  await a16.evaluate(() => { S.q = 'sart'; render(true); }); await a16.waitForTimeout(200);
  await a16.click('.qoffen[data-f="sart"]'); await a16.waitForTimeout(200);
  const so3 = await a16.evaluate(() => ({ sart: S.win.sart, fragen: qList(S.win).map((q) => q.id), text: sonneText(S.win), gedrueckt: document.querySelectorAll('.qpanel .qopt[aria-pressed="true"]').length }));
  ok(so1.einbau && so1.fragen.includes('einbau') && /Kasten nach Wahl des Fensterbauers/.test(so1.text) && so2.gedrueckt === 0 && /Fensterbauer entscheidet/.test(so2.knopf) && so3.sart === 'keiner' && !so3.fragen.includes('einbau') && so3.gedrueckt === 0 && /offen, bitte beraten/.test(so3.text), 'Rollladen gewählt: den Kasten wählt erst der Fensterbauer; Sonnenschutz „weiß ich noch nicht“: Folgefragen entfallen, das Blatt sagt offen');
  const qn = await a16.evaluate(() => qList(S.win).filter((q) => q.offen).map((q) => q.id));
  ok(['material', 'fa', 'fi', 'glas', 'glasfn', 'griff', 'rc', 'sart', 'insekt', 'iart', 'fbi', 'fba', 'montage'].every((id) => qn.includes(id)), 'Jede Wunschfrage bietet „Weiß ich noch nicht“ (' + qn.length + ' Fragen)');

  /* c) Pflichtthemen: Absturzsicherung, Erreichbarkeit und Einbruchschutz, Lüftung, Förderweg */
  await a16.evaluate(() => { S.win.etage = 'og'; S.win.bru = 450; S.q = 'absturz'; render(true); }); await a16.waitForTimeout(300);
  const ab0 = await a16.evaluate(() => ({ da: qList(S.win).some((q) => q.id === 'absturz'), titel: document.querySelector('.hd h1').textContent, karten: document.querySelectorAll('.qpanel .qopt').length, knopf: document.querySelector('.qoffen').getAttribute('aria-pressed'), kl: AW.klaerung([S.win], S.proj).map((r) => r.v).join('|') }));
  await a16.click('.qpanel [data-act="absturz"][data-v="gelaender"]'); await a16.waitForTimeout(200);
  const ab1 = await a16.evaluate(() => ({ wert: S.win.absturz, zeile: (specRows(S.win).find((r) => r.k === 'Absturzsicherung') || {}).v, kl: AW.klaerung([S.win], S.proj).map((r) => r.v).join('|'), eg: (S.win.etage = 'eg', qList(S.win).some((q) => q.id === 'absturz')) }));
  await a16.evaluate(() => { S.win.etage = 'og'; S.win.bru = ''; S.q = 'lage'; render(true); }); await a16.waitForTimeout(200);
  const lage = await a16.evaluate(() => !!document.querySelector('.qpanel #f-bru'));
  ok(ab0.da && /Absturz/.test(ab0.titel) && ab0.karten === 4 && ab0.knopf === 'true' && /Absturzsicherung nötig \(OG, Brüstung 450 mm\): bitte beraten/.test(ab0.kl) && ab1.wert === 'gelaender' && /Geländer außen/.test(ab1.zeile) && /Geländer außen/.test(ab1.kl) && !ab1.eg && lage, 'Absturzsicherung: im OG bei 450 mm Brüstung von selbst gefragt (vier Wege oder „weiß ich noch nicht“), Wahl im Blatt und in der Klärungsliste; im EG keine Frage; im OG ohne Brüstung fragt die Lage nach ihr');
  await a16.evaluate(() => { S.win.bru = 900; S.win.etage = 'eg'; S.q = 'rc'; render(true); }); await a16.waitForTimeout(200);
  const rc0 = await a16.evaluate(() => ({ titel: document.querySelector('.hd h1').textContent, rc1: !!document.querySelector('.qpanel [data-v="rc1"]'), text: document.querySelector('.qpanel').textContent }));
  await a16.click('.qpanel [data-act="erreichbar"][data-v="ja"]'); await a16.waitForTimeout(200);
  const rc1 = await a16.evaluate(() => ({ text: document.querySelector('.qpanel').textContent, zeile: specRows(S.win).find((r) => r.k === 'Einbruchschutz').v }));
  await a16.click('.qpanel [data-act="setw"][data-f="rc"][data-v="rc2"]'); await a16.waitForTimeout(300);
  const rc2 = await a16.evaluate(() => ({ pilz: document.querySelectorAll('.w3d-pilz.is-on').length, zeile: specRows(S.win).find((r) => r.k === 'Einbruchschutz').v }));
  ok(/leicht erreichbar/.test(rc0.titel) && !rc0.rc1 && /Polizei empfiehlt hier mindestens RC2/.test(rc1.text) && /Polizei empfiehlt RC2/.test(rc1.zeile) && rc2.pilz === 16 && /RC2 · leicht erreichbar/.test(rc2.zeile), 'Einbruchschutz: zuerst „leicht erreichbar?“, dann die Empfehlung der Polizei (RC2); RC2 zeigt die Pilzköpfe rundum');
  await a16.evaluate(() => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0, { total: 4 }); go('anfrage'); }); await a16.waitForTimeout(200);
  const lu = await a16.evaluate(() => document.querySelector('.note.warn') ? document.querySelector('.note.warn').textContent : '');
  await a16.evaluate(() => go('anfrage2')); await a16.waitForTimeout(200);
  await a16.click('[data-act="setp"][data-f="foerdweg"][data-v="bafa"]'); await a16.waitForTimeout(200);
  const fw = await a16.evaluate(() => ({ weg: S.proj.foerdweg, foerd: S.proj.foerd, hinweis: Array.from(document.querySelectorAll('.note')).map((n) => n.textContent).join(' '), wert: (specRows(S.windows[0]).find((r) => r.k === 'Förderwert') || {}).v, schalter: !!document.querySelector('[data-f="foerd"]') }));
  ok(/2 von 4 Fenstern, mehr als ein Drittel/.test(lu) && /Lüftungskonzept nach DIN 1946-6 erforderlich/.test(lu) && fw.weg === 'bafa' && fw.foerd === true && /Energieeffizienz-Experte/.test(fw.hinweis) && /Förderklausel/.test(fw.hinweis) && /Uw höchstens 0,95/.test(fw.wert) && !fw.schalter, 'Lüftung: kurzer Hinweis „erforderlich“ ab mehr als einem Drittel; Förderweg als Auswahl (BAFA, Steuerbonus, keine, noch offen) mit Hinweis und Zielwert je Position');

  /* d) Neue Elemente: Balkon-/Terrassentür, PSK-Tür, Kunststoff-Alu */
  const neuesElement = (art, extra) => a16.evaluate(([art, extra, MO]) => { const w = Object.assign(baseWin(), { name: 'Terrasse', w: 1010, h: 2180, mo: MO, el: { w: 1010, h: 2180 } }); artSetzen(w, art); Object.assign(w, extra || {}); S.win = w; S.windows = []; S.editIdx = -1; S.q = null; S.screen = 'frage'; render(true); return qList(S.win).map((q) => q.id); }, [art, extra || {}, MO(1010, 2180)]);
  const bq = await neuesElement('balkon');
  await a16.evaluate(() => { S.q = 'griffA'; render(true); }); await a16.waitForTimeout(400);
  /* Übergänge (Deckkraft) abwarten statt fester Zeiten: unter Last laufen sie langsamer */
  const deck = (wert) => a16.waitForFunction((wert) => { const e = document.querySelector('#w3d [data-r="ga-0"]'), b = document.querySelector('#w3d [data-r="sill-t"]'); return e && b && getComputedStyle(e).opacity === wert && getComputedStyle(b).opacity === '0'; }, wert, { timeout: 4000 }).catch(() => {});
  await deck('0');
  const ga0 = await a16.evaluate(() => getComputedStyle(document.querySelector('[data-r="ga-0"]')).opacity);
  await a16.click('.qpanel [data-act="bt"][data-f="griffA"][data-v="ziehgriff"]'); await a16.waitForTimeout(300); await deck('1');
  const b1 = await a16.evaluate(() => { const st = document.getElementById('w3d'); return { ga: getComputedStyle(st.querySelector('[data-r="ga-0"]')).opacity, boden: !!st.querySelector('[data-r="floor-in"]'), schwelle: !!st.querySelector('[data-r="schw"]'), bank: getComputedStyle(st.querySelector('[data-r="sill-t"]')).opacity === '0', sashes: S.win.sashes.map((x) => x.t).join(), text: openingText(S.win), griff: specRows(S.win).find((r) => r.k === 'Griff').v }; });
  const bOk = ['teilung', 'typ-0', 'material', 'ol', 'schwelle', 'boden', 'sprossen', 'griff', 'griffA', 'rc'].every((id) => bq.includes(id)) && !bq.includes('fbi') && !bq.includes('fba') && !bq.includes('ul') && ga0 === '0' && b1.ga === '1' && b1.boden && b1.schwelle && b1.bank && b1.sashes === 'DK' && /Balkontür, Dreh-Kipp DIN links, Standardschwelle/.test(b1.text) && /außen Ziehgriff mit Schnäpper/.test(b1.griff);
  ok(bOk, 'Balkon-/Terrassentür: Flügel, Oberlicht, Schwelle, Fußboden, Sprossen, Griff innen und außen; im Modell bodentief mit Schwelle, der Ziehgriff erscheint außen' + (bOk ? '' : '\n      ' + JSON.stringify({ fragen: bq, ga0: ga0, b1: b1 })));
  await a16.evaluate(() => { S.win.e_teilung = false; S.win.el.w = 1600; S.win.w = 1600; go('frage'); }); await a16.waitForTimeout(200);
  ok(await a16.evaluate(() => S.win.teilung === '2s' && S.win.sashes.map((x) => x.t).join() === 'D,DK'), 'Balkontür ab 1,3 m Breite: Vorschlag zwei Flügel ohne Pfosten (Stulp)');
  const pq = await neuesElement('psk');
  await a16.evaluate(() => { S.q = 'pskS'; render(true); }); await a16.waitForTimeout(300);
  await a16.evaluate(() => tuerZeigen()); await a16.waitForTimeout(250);
  const ps = await a16.evaluate(() => { const st = document.getElementById('w3d'), s1 = st.querySelector('[data-r="sash-1"]'); return { t: S.win.sashes.map((x) => x.t).join(), demo: s1.getAnimations().some((a) => a.animationName === 'w3d-psk'), sym: s1.querySelectorAll('.w3d-sym path').length, boden: !!st.querySelector('[data-r="floor-in"]'), text: openingText(S.win) }; });
  ok(pq.includes('pskS') && pq.includes('pskR') && !pq.includes('schwelle') && ps.t === 'F,PS' && ps.demo && ps.sym >= 2 && ps.boden && /PSK-Tür 2-teilig, Schiebeflügel rechts, kippbar, mit Schwelle/.test(ps.text), 'PSK-Tür: Teile und Seite, immer mit Schwelle; der Flügel stellt sich vor und schiebt, Symbol mit Schieben und Kippen');
  await a16.evaluate(() => { S.q = 'material'; render(true); }); await a16.waitForTimeout(200);
  ok(await a16.evaluate(() => !!document.querySelector('.qpanel [data-v="kunststoffalu"]') && lab('material', 'kunststoffalu') === 'Kunststoff-Alu'), 'Material Kunststoff-Alu wählbar');

  /* e) KI: Fachangaben aus den Fotos, für den Betrieb aufbereitet; Maße gegen das Foto */
  await a16.evaluate(() => { newWin(); }); await a16.waitForTimeout(150);
  const jpg = await a16.evaluate(async () => { const c = document.createElement('canvas'); c.width = 600; c.height = 700; const g = c.getContext('2d'); g.fillStyle = '#ddd'; g.fillRect(0, 0, 600, 700); g.fillStyle = '#fff'; g.fillRect(150, 150, 300, 350); return c.toDataURL('image/jpeg', 0.8); });
  const jpg16 = Buffer.from(jpg.split(',')[1], 'base64');
  await a16.evaluate(() => go('fotos')); await a16.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
  await a16.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpg16 });
  if (await a16.waitForSelector('.fx-dialog', { timeout: 4000 }).catch(() => null)) await a16.click('.fx-ja');
  await a16.waitForFunction(() => S.ai.in && S.ai.in.status === 'done', null, { timeout: 15000 }).catch(() => {});
  await a16.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: jpg16 });
  await a16.waitForFunction(() => S.ai.out && S.ai.out.status === 'done', null, { timeout: 15000 }).catch(() => {});
  const ki = await a16.evaluate(() => ({ fach: S.win.ki && S.win.ki.fach, verh: S.win.ki && S.win.ki.verh, fassade: S.win.fassade, anschlag: S.win.anschlag, etage: S.win.etage }));
  ok(ki.fach && ki.fach.rollladen === 'einbau' && ki.fach.anschlagI === 'innen' && ki.fach.anschlagA === 'aussen' && ki.fach.fassade === 'klinker' && ki.fach.fba === 'aluminium' && !('fbi' in ki.fach) && !('quatsch' in ki.fach) && ki.fach.strom === false && ki.fach.erreichbar === true && ki.verh === 0.87 && ki.fassade === 'klinker' && ki.anschlag === 'innen' && ki.etage === 'eg', 'KI: feste Fachangaben aus beiden Fotos (Kasten, Anschlag innen und außen, Fassade, Fensterbank, Strom, Erreichbarkeit), Unbekanntes verworfen; Fassade im Modell, Anschlag fürs Blatt, Geschoss als Vorschlag');
  await a16.evaluate(() => { Object.assign(S.win, { mo: { hm: 1290, hl: 1290, hr: 1290, wm: 1470, wt: 1470, wb: 1470 }, el: { w: 1410, h: 1230 }, w: 1410, h: 1230 }); go('ergebnis'); }); await a16.waitForTimeout(400);
  const e0 = await a16.evaluate(() => (document.querySelector('.mass-pruef') || {}).textContent || '');
  await a16.click('[data-act="mass-tausch"]'); await a16.waitForTimeout(300);
  const e1 = await a16.evaluate(() => ({ el: S.win.el, wm: S.win.mo.wm, hm: S.win.mo.hm, hinweis: !!document.querySelector('.mass-pruef') }));
  await a16.evaluate(() => { Object.assign(S.win, { el: { w: 1230, h: 2400 }, w: 1230, h: 2400 }); render(); }); await a16.waitForTimeout(200);
  const e2 = await a16.evaluate(() => (document.querySelector('.mass-pruef') || {}).textContent || '');
  await a16.click('[data-act="mass-ok"]'); await a16.waitForTimeout(200);
  const e3 = await a16.evaluate(() => ({ ok: S.win.massOk, hinweis: !!document.querySelector('.mass-pruef'), kl: AW.klaerung([S.win], {}).map((r) => r.v).join('|'), zeile: AW.massZeile(S.win) }));
  ok(/Breite und Höhe vertauscht\?/.test(e0) && e1.el.w === 1230 && e1.el.h === 1410 && e1.wm === 1290 && e1.hm === 1470 && !e1.hinweis && /noch einmal nach/.test(e2) && e3.ok && !e3.hinweis && /Seitenverhältnis laut Foto weicht von den Maßen ab\. Die Maße sind bestätigt/.test(e3.kl) && /weichen ab \(Breite : Höhe laut Foto etwa 0,87/.test(e3.zeile), 'Maße gegen das Foto: vertauscht → „Tauschen“ tauscht alle Maße; stark abweichend → „Nachmessen“ oder „Stimmt so“; bestätigt steht es als Prüfpunkt beim Betrieb');
  await a16.evaluate(() => { S.q = 'einbau'; S.win.sart = 'rollladen'; S.win.roll = 'aufsatz'; S.screen = 'frage'; render(true); }); await a16.waitForTimeout(200);
  ok(/Laut Foto vorhanden: Einbaukasten innen im Sturz/.test(await a16.evaluate(() => document.querySelector('.hd').textContent)), 'Kastenfrage nennt den Kasten, den die KI auf dem Foto erkannt hat');

  /* f) Gestaltung übernehmen */
  await a16.evaluate((MO) => {
    const a = demoProject(); a.forEach((x) => altAngleichen(x)); a[0].bars = presetBars('kreuz', a[0].sashes.length); a[0].preset = 'kreuz'; a[0].sart = 'raffstore'; a[0].sfarbe = 'anthrazit'; a[0].offen = { fba: true };
    S.windows = a.map((x, i) => Object.assign(x, { wid: 'wd' + i, t0: zeit(), aend: 0, ts: zeit() })); S.editIdx = -1; S.angelegt = 2;
    const w = Object.assign(baseWin(), { name: 'Kinderzimmer', etage: 'eg', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, offen: { fa: true, fba: true } }); S.win = w; S.designVorher = null; S.q = null; S.screen = 'frage'; render(true);
  }, MO(1230, 1410));
  const d0 = await a16.evaluate(() => ({ ids: qList(S.win).map((q) => q.id).slice(0, 3), karten: designListe().map((d) => d.label) }));
  await a16.evaluate(() => { S.q = 'design'; render(true); }); await a16.waitForTimeout(250);
  await a16.click('.qpanel [data-act="design"][data-v="0"]'); await a16.waitForTimeout(400);
  const d1 = await a16.evaluate(() => ({ fa: S.win.fa, offen: S.win.offen, bars: S.win.bars.length, preset: S.win.preset, sart: S.win.sart, sfarbe: S.win.sfarbe, nav: Array.from(document.querySelectorAll('.qnav button')).map((b) => b.textContent.trim()).filter(Boolean), gedrueckt: document.querySelector('.qpanel [data-act="design"][data-v="0"]').getAttribute('aria-pressed'), name: S.win.name, mo: S.win.mo.wm }));
  await a16.click('[data-act="design-weg"]'); await a16.waitForTimeout(250);
  const d2 = await a16.evaluate(() => ({ fa: S.win.fa, offen: S.win.offen, bars: S.win.bars.length, sart: S.win.sart }));
  await a16.click('.qpanel [data-act="design"][data-v="0"]'); await a16.waitForTimeout(250);
  await a16.click('.qnav [data-act="save"]'); await a16.waitForTimeout(400);
  const d3 = await a16.evaluate(() => { const w = S.windows[S.windows.length - 1]; return { n: S.windows.length, screen: S.screen, name: w.name, fa: w.fa, sart: w.sart, bars: w.bars.length, offen: w.offen }; });
  await a16.evaluate(() => { S.win = kopie(S.windows[0]); S.editIdx = 0; S.q = 'design'; S.screen = 'frage'; render(true); }); await a16.waitForTimeout(200);
  const d4 = await a16.evaluate(() => designListe().map((d) => d.label).join('|'));
  await a16.evaluate(() => { const w = Object.assign(baseWin(), { name: 'Terrasse', w: 2600, h: 2200, mo: { hm: 2260, hl: 2260, hr: 2260, wm: 2660, wt: 2660, wb: 2660 }, el: { w: 2600, h: 2200 } }); artSetzen(w, 'hst'); S.win = w; S.editIdx = -1; S.windows[1].griff = 'druckknopf'; designAnwenden(S.win, S.windows[1]); });
  const d5 = await a16.evaluate(() => ({ griff: S.win.griff, bars: S.win.bars.length }));
  ok(d0.ids[0] === 'lage' && d0.ids[1] === 'design' && d0.karten.length === 2 && /Wie Wohnzimmer/.test(d0.karten.join()) && d1.fa === '7016' && !d1.offen.fa && d1.offen.fba && d1.bars === 4 && d1.preset === 'eigene' && d1.sart === 'raffstore' && d1.sfarbe === 'anthrazit' && d1.gedrueckt === 'true' && d1.nav.join() === 'Anpassen,Speichern' && d1.name === 'Kinderzimmer' && d1.mo === 1290 &&
    d2.offen.fa && d2.bars === 0 && d2.sart === 'keiner' && d3.n === 3 && d3.screen === 'fertig' && d3.name === 'Kinderzimmer' && d3.fa === '7016' && d3.sart === 'raffstore' && d3.bars === 4 && !/Wohnzimmer/.test(d4) && d5.griff === 'standard' && d5.bars === 0,
  'Gestaltung übernehmen: nach der Lage die gespeicherten Gestaltungen (gleiche zusammengefasst); Antippen übernimmt Farben, Sprossen, Raffstore und offene Punkte, Maße und Name bleiben; „Doch neu gestalten“ nimmt es zurück; „Speichern“ legt das Fenster gleich an; beim Ändern fehlt die eigene, bei Türen passt sich der Griff an');

  /* g) Klärungsliste auf dem Blatt (App, PDF), im Betriebsbereich und im Code */
  await a16.evaluate(() => { const a = demoProject(); a[0].offen = { fa: true, fba: true }; a[0].ki.fach = { rollladen: 'einbau', anschlagI: 'innen', fassade: 'putz', strom: true }; a[1].etage = 'og'; a[1].bru = 600; S.windows = a; S.proj = Object.assign({}, PROJ0, { name: 'Familie Weber', total: 5, foerdweg: 'bafa' }); S.kauf = { paid: true, mail: 'test@beispiel.de' }; go('blatt'); }); await a16.waitForTimeout(300);
  const bl = await a16.evaluate(() => (document.querySelector('.paper-klaer') || {}).textContent || '');
  ok(/Noch zu klären · 4/.test(bl) && /Absturzsicherung nötig \(OG, Brüstung 600 mm\)/.test(bl) && /Lüftungskonzept nach DIN 1946-6 erforderlich/.test(bl) && /BAFA-Zuschuss gewünscht/.test(bl) && /Farbe außen, Fensterbank außen: offen, bitte beraten/.test(bl), 'Aufmaßblatt in der App: „Noch zu klären“ oben, mit Absturzsicherung, Lüftung, Förderweg und offenen Wünschen');
  const b64 = await a16.evaluate(async () => { await blattSchrift(); const blob = await blattPDF('fensterbauer'); const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s); });
  const pdf16 = path16.join(os16.tmpdir(), 'eeziframes-pruefung-klaerung.pdf'); fs16.writeFileSync(pdf16, Buffer.from(b64, 'base64'));
  const pt = (n) => { try { return cp16.execFileSync('pdftotext', ['-layout'].concat(n ? ['-f', String(n), '-l', String(n)] : []).concat([pdf16, '-'])).toString('utf8'); } catch (e) { return ''; } };
  const s1 = pt(1), alle16 = pt(0), kSeite = [2, 3].find((n) => /MIT DEM KUNDEN ZU KLÄREN/.test(pt(n)));
  ok(/Zu klären/.test(s1) && /Absturzsicherung \(Pos\. 2\)/.test(s1) && /MAUERÖFFNUNG/.test(s1) && kSeite && /Übersicht/.test(pt(kSeite)) && /Lüftungskonzept nach DIN 1946-6 erforderlich/.test(alle16) && /Förderwert\s+Uw höchstens 0,95/.test(alle16) && /offen, bitte beraten/.test(alle16) && /Absturz-\s/.test(alle16) && !/Absturzsicheru\s/.test(alle16) && /Auf einen Blick/.test(alle16) && /Kasten: Einbaukasten innen im Sturz/.test(alle16), 'PDF: Seite 1 nennt in den Eckdaten, was zu klären ist (Position 1 bleibt auf Seite 1); die ausführliche Liste folgt nach Position 1 mit der Übersicht auf derselben Seite; Zielwert, „offen“ (Beschriftung an der Wortfuge getrennt) und KI-Fachangaben je Position');
  const rund = await a16.evaluate(() => { const w = Object.assign(baseWin(), { name: 'Terrasse', offen: { fa: true }, absturz: 'gelaender', erreichbar: 'ja', massOk: true }); artSetzen(w, 'balkon'); w.bt.griffA = 'abschliessbar'; const o = unpackProject(packProject([w], Object.assign({}, PROJ0, { foerdweg: 'steuer' }), null)); const alt = unpackProject(packProject([baseWin()], PROJ0, null)); return { offen: o.w[0].offen, absturz: o.w[0].absturz, erreichbar: o.w[0].erreichbar, ok: o.w[0].massOk, bt: o.w[0].bt, fw: o.p.foerdweg, altOffen: JSON.stringify(alt.w[0].offen) }; });
  ok(rund.offen.fa && rund.absturz === 'gelaender' && rund.erreichbar === 'ja' && rund.ok === true && rund.bt.griffA === 'abschliessbar' && rund.fw === 'steuer' && rund.altOffen === '{}', 'Aufmaß-Code trägt offene Punkte, Absturzsicherung, Erreichbarkeit, Balkontür und Förderweg; ohne Angaben bleibt nichts offen');
  sauber(a16, 'Erstaufmaß in der App ohne Fehler');
  await ctx16.close();

  const ctxP = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' }), p16 = await neueSeite(ctxP);
  await p16.goto(BASE + '/', { waitUntil: 'networkidle' });
  await betrieb(p16, 'c1'); await p16.waitForTimeout(300);
  await p16.evaluate(() => { const l = A().links.find((x) => x.id === 'l1'); l.aufmass.windows[0].offen = { fa: true }; l.aufmass.windows[0].ki = Object.assign({}, l.aufmass.windows[0].ki, { fach: { rollladen: 'einbau', fassade: 'putz', strom: true } }); l.aufmass.proj.foerdweg = 'bafa'; go('link', 'l1'); }); await p16.waitForTimeout(400);
  const pk = await p16.evaluate(() => ({ karte: (document.querySelector('.card.klaer') || {}).textContent || '', kopf: document.querySelector('.amhead').textContent, pos: (document.querySelector('.posc') || {}).textContent || '', text: aufmassText(A().links.find((x) => x.id === 'l1')) }));
  ok(/Mit dem Kunden zu klären/.test(pk.karte) && /BAFA-Zuschuss gewünscht/.test(pk.karte) && /Farbe außen: offen, bitte beraten/.test(pk.karte) && /Lüftungskonzept nach DIN 1946-6 erforderlich/.test(pk.karte) && /FörderungBAFA-Zuschuss \(BEG EM\)/.test(pk.kopf) && /Förderwert/.test(pk.pos) && /Auf einen Blick/.test(pk.pos) && /Mit dem Kunden zu klären:/.test(pk.text) && /Förderung: BAFA-Zuschuss/.test(pk.text), 'Betriebsbereich: „Mit dem Kunden zu klären“ über dem Aufmaß, Förderweg im Kopf, Zielwert und KI-Fachangaben je Position, auch im kopierten Text');
  sauber(p16, 'Klärungsliste im Betriebsbereich ohne Fehler');
  await ctxP.close();

  /* i) Aus der Durchsicht: nichts entscheidet still eine Vorgabe, Rückwege bleiben sicher, lange Listen passen ins PDF */
  const kl = (wins, p) => AW16.klaerung(wins, p || {}).map((r) => r.k + ': ' + r.v).join('\n');
  ok(AW16.uwZiel(AW16.mk({ art: 'hst', hst: { schema: 'A', richtung: 'R', schwelle: 'flach' }, offen: { schwelle: true } }), pB).wert === 0.95 && !/Glas für|3-fach-Glas/.test(kl([AW16.mk({ glas: '2' })], { foerdweg: 'bafa', gebaeude: 'denkmal' })) && /schafft praktisch nur 3-fach-Glas/.test(kl([AW16.mk({ glas: '2' })], { foerdweg: 'bafa' })), 'Förderung: offene Schwelle zählt nicht als barrierearm; im Baudenkmal (Uw 1,4) kein Hinweis, dass nur 3-fach-Glas reicht');
  ok(/Absturzsicherung nötig \(OG, bodentief\)/.test(kl([AW16.mk({ etage: 'og', bru: 0 })])) && /Absturzsicherung nötig \(DG, bodentief laut Foto\)/.test(kl([AW16.mk({ etage: 'dg', bru: '', ki: { fach: { bruestung: 'bodentief' } } })])) && /Fensterbank außen laut Foto aus Faserzement: vor dem Ausbau auf Asbest prüfen/.test(kl([AW16.mk({ ki: { fach: { fba: 'faserzement' } } })])) && !/Lüftung/.test(kl([AW16.mk({ anzahl: 4 })], {})) && AW16.klaerKurz([AW16.mk({ ki: { fach: { fbi: 'faserzement' } } })], {}).join() === 'Asbest prüfen (Pos. 1)', 'Klärungsliste: Brüstung 0 heißt bodentief, „laut Foto“ nur ohne Maß; Faserzement-Fensterbank als Asbest-Prüfpunkt; ohne Zahl der Fenster im Haus kein Lüftungskonzept');
  const ctxD = await browser.newContext(telefon), d16 = await neueSeite(ctxD);
  await d16.goto(BASE + '/app/', { waitUntil: 'networkidle' });
  await d16.evaluate((MO) => { S.windows = []; S.editIdx = -1; const w = Object.assign(baseWin(), { name: 'Bad', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, offen: { spross: true } }); w.bars = presetBars('kreuz', w.sashes.length); w.preset = 'kreuz'; S.win = w; S.q = 'breite'; S.screen = 'frage'; render(true); }, MO(1230, 1410)); await d16.waitForTimeout(250);
  await d16.click('.qpanel [data-act="setw"][data-f="breite"][data-v="18"]'); await d16.waitForTimeout(150);
  const br = await d16.evaluate(() => ({ offen: !!S.win.offen.spross, breite: S.win.breite, zeile: specRows(S.win).find((r) => r.k === 'Sprossen').v }));
  await d16.evaluate(() => { S.q = 'fa'; S.win.offen = Object.assign({}, S.win.offen, { fa: true }); render(true); }); await d16.waitForTimeout(200);
  await d16.click('.qoffen[data-f="fa"]'); await d16.waitForTimeout(150);
  const radio = await d16.evaluate(() => ({ offen: !!S.win.offen.fa, knopf: document.querySelector('.qoffen[data-f="fa"]').getAttribute('aria-pressed') }));
  await d16.click('#t-wunschA'); await d16.keyboard.type('RAL 3004'); await d16.waitForTimeout(150);
  const getippt = await d16.evaluate(() => !!S.win.offen.fa);
  await d16.click('[data-act="farbe-weg"][data-f="wunschA"]'); await d16.waitForTimeout(200);
  const geloescht = await d16.evaluate(() => ({ offen: !!S.win.offen.fa, wunsch: S.win.wunschA, zeile: specRows(S.win).find((r) => r.k === 'Farbe').v }));
  await d16.click('.qpanel .qsw[data-v="9016"]'); await d16.click('#t-wunschA'); await d16.keyboard.type('RAL 3004'); await d16.click('[data-act="farbe-weg"][data-f="wunschA"]'); await d16.waitForTimeout(200);
  const nachListe = await d16.evaluate(() => ({ offen: !!S.win.offen.fa, fa: S.win.fa }));
  await d16.evaluate(() => { S.q = 'glasfn'; S.win.offen = Object.assign({}, S.win.offen, { glasfn: true }); render(true); }); await d16.waitForTimeout(150);
  await d16.click('.qoffen[data-f="glasfn"]'); await d16.waitForTimeout(150);
  const keineExtras = await d16.evaluate(() => !S.win.offen.glasfn && S.win.glasfn.length === 0);
  ok(br.offen && br.breite === 18 && /offen, bitte beraten, 18 mm/.test(br.zeile) && radio.offen && radio.knopf === 'true' && !getippt && geloescht.offen && geloescht.wunsch === '' && /außen offen, bitte beraten/.test(geloescht.zeile) && !nachListe.offen && nachListe.fa === '9016' && keineExtras, 'Nichts entscheidet still: die Sprossenbreite lässt die Sprossenart offen; „Weiß ich noch nicht“ erneut antippen bleibt offen (nur Glas-Extras: aus heißt keine); eine getippte und wieder gelöschte Farbe ist wieder offen, nach einer Farbe aus der Liste nicht');
  await d16.evaluate((MO) => { const w = Object.assign(baseWin(), { name: 'Kind', etage: 'og', bru: '', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 } }); S.win = w; S.q = 'lage'; S.screen = 'frage'; render(true); }, MO(1230, 1410)); await d16.waitForTimeout(200);
  await d16.click('.qpanel [data-act="bump"][data-f="bru"][data-v="10"]'); await d16.waitForTimeout(150);
  const lage16 = await d16.evaluate(() => ({ bru: S.win.bru, feld: !!document.querySelector('.qpanel #f-bru') }));
  await d16.click('.qpanel [data-act="bump"][data-f="bru"][data-v="-10"]'); await d16.click('.qpanel [data-act="bump"][data-f="bru"][data-v="-10"]'); await d16.waitForTimeout(150);
  const lage16b = await d16.evaluate(() => ({ bru: S.win.bru, feld: !!document.querySelector('.qpanel #f-bru'), frage: qList(S.win).some((q) => q.id === 'absturz') }));
  await d16.evaluate(() => { S.win.bru = 0; S.q = 'absturz'; render(true); }); await d16.waitForTimeout(150);
  const sub0 = await d16.evaluate(() => document.querySelector('.hd').textContent);
  ok(lage16.bru === 860 && lage16.feld && lage16b.bru === 840 && lage16b.feld && lage16b.frage && /Bodentief im OG: Unter 80 cm \(über 12 m Höhe 90 cm\)/.test(sub0) && !/laut Foto/i.test(sub0), 'Lage im OG: das Feld für die Brüstung bleibt beim Antippen stehen und beginnt bei einem üblichen Maß (850 mm); 0 mm heißt bodentief, nicht „laut Foto“; Regel 80 cm, ab 12 m 90 cm');
  /* Gestaltung: nichts vorgewählt bei gleichen Vorgaben; „Doch neu gestalten“ nach dem Speichern nimmt keine gespeicherten Änderungen zurück */
  await d16.evaluate((MO) => { S.windows = []; S.editIdx = -1; S.angelegt = 0; const a = Object.assign(baseWin(), { name: 'Flur', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, offen: { fa: true, fba: true } }); S.win = a; saveWin(); const b = Object.assign(baseWin(), { name: 'Gast', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, offen: { fa: true, fba: true } }); S.win = b; S.editIdx = -1; S.designVorher = null; S.q = 'design'; S.screen = 'frage'; render(true); }, MO(1230, 1410)); await d16.waitForTimeout(250);
  const vorgewaehlt = await d16.evaluate(() => ({ gedrueckt: document.querySelectorAll('.qpanel .qopt[aria-pressed="true"]').length, nav: Array.from(document.querySelectorAll('.qnav button')).map((b) => b.textContent.trim()).filter(Boolean).join() }));
  await d16.evaluate((MO) => { const c = Object.assign(baseWin(), { name: 'Arbeit', w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, fa: '9016', sart: 'raffstore', sfarbe: 'anthrazit' }); c.wid = 'wc'; c.t0 = zeit(); S.windows.push(c); S.win = kopie(S.windows[0]); S.editIdx = 0; S.designVorher = null; S.q = 'design'; S.screen = 'frage'; render(true); }, MO(1230, 1410)); await d16.waitForTimeout(200);
  await d16.click('.qpanel [data-act="design"][data-v="1"]'); await d16.waitForTimeout(150);
  await d16.evaluate(() => { S.win.insekt = 'spann'; saveWin(); S.win = kopie(S.windows[0]); S.editIdx = 0; S.q = 'design'; S.screen = 'frage'; render(true); }); await d16.waitForTimeout(200);
  const nachSpeichern = await d16.evaluate(() => ({ chip: !!document.querySelector('[data-act="design-weg"]'), vorher: S.designVorher }));
  await d16.evaluate(() => act('design-weg', document.body)); await d16.waitForTimeout(150);
  const behalten = await d16.evaluate(() => ({ insekt: S.win.insekt, sart: S.win.sart, offenFa: !!S.win.offen.fa }));
  ok(vorgewaehlt.gedrueckt === 0 && vorgewaehlt.nav === 'Weiter' && !nachSpeichern.chip && nachSpeichern.vorher === null && behalten.insekt === 'spann' && behalten.sart === 'raffstore' && !behalten.offenFa, 'Gestaltung übernehmen: gleiche Vorgaben zweier Fenster zählen nicht als übernommen (nichts gedrückt, „Weiter“); nach dem Speichern gibt es kein „Doch neu gestalten“ mehr, gespeicherte Änderungen bleiben');
  /* Offene Angaben auch in Karten, Übersicht und Betrieb; Fenster im Haus ohne Vorgabe */
  const karten16 = await d16.evaluate(() => { const w = Object.assign(baseWin(), { name: 'Bad', offen: { material: true, glas: true, insekt: true } }); return { win: winCard(w, 0, false), check: checkCard(w, 0), proj: PROJ0.total }; });
  await d16.evaluate(() => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0); go('anfrage'); }); await d16.waitForTimeout(150);
  const anfr = await d16.evaluate(() => ({ note: !!document.querySelector('.note.warn'), feld: document.getElementById('p-total').value, ph: document.getElementById('p-total').placeholder }));
  ok(/Glas offen/.test(karten16.win) && /Material offen/.test(karten16.check) && karten16.proj === '' && !anfr.note && anfr.feld === '' && /z\. B\. 12/.test(anfr.ph), 'Karten zeigen offenes Glas und Material als offen; die Zahl der Fenster im Haus hat keine Vorgabe mehr, ohne sie kein Hinweis aufs Lüftungskonzept');
  /* PDF: eine lange Klärungsliste wird über die Seiten geteilt, nichts fällt weg; offene Angaben in der Übersicht */
  const b64L = await d16.evaluate(async () => {
    const a = []; for (let i = 0; i < 20; i++) { const w = Object.assign(baseWin(), { name: 'Zimmer ' + (i + 1), etage: 'og', bru: 500, erreichbar: 'ja', sart: 'rollladen', roll: 'aufsatz', antrieb: 'motor', w: 1000, h: 1200, mo: { hm: 1260, hl: 1260, hr: 1260, wm: 1060, wt: 1060, wb: 1060 }, el: { w: 1000, h: 1200 }, offen: { fa: true, glas: true, insekt: true }, wid: 'z' + i, t0: zeit() }); a.push(w); }
    S.windows = a; S.proj = Object.assign({}, PROJ0, { name: 'Familie Lang', total: 24, foerdweg: 'offen' }); S.kauf = { paid: true, mail: 'test@beispiel.de' };
    await blattSchrift(); const blob = await blattPDF('fensterbauer'); const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000)); return btoa(s);
  });
  const pdfL = path16.join(os16.tmpdir(), 'eeziframes-pruefung-klaerung-lang.pdf'); fs16.writeFileSync(pdfL, Buffer.from(b64L, 'base64'));
  const txtL = (() => { try { return cp16.execFileSync('pdftotext', ['-layout', pdfL, '-']).toString('utf8'); } catch (e) { return ''; } })();
  const zaehle = (re) => (txtL.match(re) || []).length, absturzZeilen = zaehle(/Absturzsicherung nötig \(OG, Brüstung 500 mm\)/g), rcZeilen = zaehle(/Die Polizei empfiehlt RC2\./g), stromZeilen = zaehle(/Elektrischer Antrieb gewünscht/g);
  ok(absturzZeilen === 20 && rcZeilen === 20 && stromZeilen === 20 && /Alle Positionen\s+[^\n]*Insektenschutz: offen, bitte beraten/.test(txtL) && /MIT DEM KUNDEN ZU KLÄREN, FORTSETZUNG/.test(txtL) && /Insektenschutz\s+offen/.test(txtL), 'PDF mit 20 Positionen: die lange Klärungsliste geht mit „Fortsetzung“ über die Seiten, alle Absturz-, RC2- und Strom-Zeilen und die offenen Wünsche stehen darin; die Übersicht zeigt offene Angaben als offen (' + absturzZeilen + ' / ' + rcZeilen + ' / ' + stromZeilen + ')');
  sauber(d16, 'Nachbesserungen aus der Durchsicht ohne Fehler');
  await ctxD.close();
  const ctxQ = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'de-DE' }), q16 = await neueSeite(ctxQ);
  await q16.goto(BASE + '/', { waitUntil: 'networkidle' }); await betrieb(q16, 'c1'); await q16.waitForTimeout(300);
  const pos16 = await q16.evaluate(() => { const w = AW.mk({ name: 'Bad', offen: { material: true } }); return posCard(w, 0, null, false, {}); });
  ok(/Material offen/.test(pos16) && !/Kunststoff ·/.test(pos16), 'Betriebsbereich: offenes Material steht in der Kopfzeile der Position als offen');
  sauber(q16, 'Betriebsbereich Positionen ohne Fehler'); await ctxQ.close();

  /* h) Gestaltung der neuen Schritte: nur die Schriftgrößen der App, Ziele ab 44 px, kein Querscrollen, hell und dunkel */
  const messen16 = (seite) => seite.evaluate(() => {
    const sichtbar = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 4; };
    const groessen = new Set(), klein = [];
    document.querySelectorAll('#app *').forEach((el) => { if (el.closest('svg') || el.closest('.w3d')) return; if (sichtbar(el) && Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())) groessen.add(parseFloat(getComputedStyle(el).fontSize)); });
    document.querySelectorAll('#app a, #app button, #app input, #app summary').forEach((el) => { if (!sichtbar(el) || el.closest('svg') || el.closest('.w3d') || el.matches('.ulink') || el.closest('.sheet')) return; const h = el.getBoundingClientRect().height; if (h < 43.5) klein.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' (' + Math.round(h) + ' px: ' + (el.textContent || '').trim().slice(0, 24) + ')'); });
    return { groessen: Array.from(groessen).sort((x, y) => x - y), klein: klein, quer: document.scrollingElement.scrollWidth > innerWidth + 1 };
  });
  const GR16 = [13, 15, 17, 24, 32, 40], befund16 = [];
  for (const dunkel of [false, true]) {
    const c = await browser.newContext(Object.assign({}, telefon, dunkel ? { colorScheme: 'dark', reducedMotion: 'reduce' } : {})), s = await neueSeite(c);
    await s.goto(BASE + '/app/', { waitUntil: 'networkidle' });
    const zeige = async (name, fn, arg) => {
      await s.evaluate(fn, arg); await s.waitForTimeout(350);
      const m = await messen16(s), fremd = m.groessen.filter((g) => !GR16.includes(g));
      if (fremd.length || m.klein.length || m.quer) befund16.push((dunkel ? 'dunkel ' : 'hell ') + name + ': ' + (fremd.length ? 'Größen ' + fremd.join(', ') + ' ' : '') + (m.klein.length ? 'klein ' + m.klein.slice(0, 4).join('; ') : '') + (m.quer ? ' Querscrollen' : ''));
    };
    const frage16 = ([id, art, extra, MO]) => { const a = demoProject(); S.windows = a; S.editIdx = -1; const w = Object.assign(baseWin(), { name: 'Kinderzimmer mit langem Namen', etage: 'og', bru: 450, w: 1230, h: 1410, mo: MO, el: { w: 1230, h: 1410 }, offen: { fa: true, fba: true } }); artSetzen(w, art); Object.assign(w, extra || {}); S.win = w; S.designVorher = null; S.q = id; S.screen = 'frage'; render(true); };
    const mo16 = MO(1230, 1410);
    await zeige('Absturzsicherung', frage16, ['absturz', 'fenster', {}, mo16]);
    await zeige('Gestaltung übernehmen', frage16, ['design', 'fenster', {}, mo16]);
    await zeige('Gestaltung übernommen', () => { designAnwenden(S.win, S.windows[0]); S.designVorher = kopie(S.win); render(true); });
    await zeige('Einbruchschutz', frage16, ['rc', 'fenster', { erreichbar: 'ja' }, mo16]);
    await zeige('Farbe offen', frage16, ['fa', 'fenster', {}, mo16]);
    await zeige('Kasten offen', frage16, ['einbau', 'fenster', { sart: 'rollladen', roll: 'aufsatz', offen: { einbau: true } }, mo16]);
    await zeige('Griff außen', frage16, ['griffA', 'balkon', {}, mo16]);
    await zeige('Fußboden', frage16, ['boden', 'balkon', {}, mo16]);
    await zeige('PSK-Tür', frage16, ['pskS', 'psk', {}, mo16]);
    await zeige('Maße prüfen', () => { const w = Object.assign(baseWin(), { name: 'Küche', w: 1410, h: 1230, mo: { hm: 1290, hl: 1290, hr: 1290, wm: 1470, wt: 1470, wb: 1470 }, el: { w: 1410, h: 1230 }, ki: { auto: true, chips: [], rows: [], hints: [], pruefen: [], verh: 0.87 } }); S.win = w; S.screen = 'ergebnis'; render(true); });
    await zeige('Lüftung', () => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0, { total: 4 }); go('anfrage'); });
    await zeige('Förderung', () => { S.proj.foerdweg = 'steuer'; go('anfrage2'); });
    if (dunkel) await foto(s, 'app-foerderung-dunkel');
    sauber(s, 'Neue Schritte ' + (dunkel ? 'dunkel' : 'hell') + ' ohne Fehler'); await c.close();
  }
  ok(!befund16.length, 'Gestaltung der neuen Schritte (Telefon, hell und dunkel): nur 13 · 15 · 17 · 24 · 32 · 40, Ziele ab 44 px, kein Querscrollen' + (befund16.length ? '\n      ' + befund16.join('\n      ') : ''));
}

if (teil(17)) {
  console.log('17. Rechtstexte, Vertrag widerrufen (§ 356a BGB), E-Mails des Servers');
  const cp17 = await import('node:child_process'), fs17 = await import('node:fs'), path17 = await import('node:path'), url17 = await import('node:url');
  const W17 = path17.resolve(path17.dirname(url17.fileURLToPath(import.meta.url)), '..');
  const seo17 = await import(url17.pathToFileURL(path17.join(W17, 'functions/seo.js')).href);
  const holen17 = async (b, p) => { const r = await fetch(b + p); return { status: r.status, text: await r.text() }; };
  /* a) Rechtsseiten mit den Angaben des Anbieters, ohne alte Platzhalter */
  const t17 = {}; for (const p of ['/impressum/', '/datenschutz/', '/agb/', '/nutzungsbedingungen/', '/cookies/', '/widerruf/']) t17[p] = (await holen17(BASE, p)).text;
  const anbieter17 = (t) => /Patrick Kies/.test(t) && /Postweg 35/.test(t) && /33442 Herzebrock-Clarholz/.test(t);
  ok(['/impressum/', '/datenschutz/', '/agb/', '/nutzungsbedingungen/', '/widerruf/'].every((p) => anbieter17(t17[p])) && !Object.values(t17).some((t) => /\[Vor- und Nachname|\[Straße und Hausnummer|\[PLZ und Ort|Landesdatenschutzbehörde Ihres|Es werden keine Zahlungen ausgeführt/.test(t)), 'Rechtsseiten: Anbieter Patrick Kies, Postweg 35, 33442 Herzebrock-Clarholz; keine alten Platzhalter, kein Pilot-Hinweis im Impressum');
  const anb17 = (await import(url17.pathToFileURL(path17.join(W17, 'functions/api/anbieter.js')).href)).ANBIETER;
  const mail17a = '<a href="mailto:' + anb17.mail + '">' + anb17.mail + '</a>', tel17a = '<a href="tel:+49' + anb17.telefon.replace(/\D/g, '').replace(/^0/, '') + '">' + anb17.telefon + '</a>';
  ok(anb17.mail === 'ask@eeziframes.com' && anb17.telefon === '0152 56950998' && t17['/impressum/'].includes('E-Mail: ' + mail17a) && t17['/impressum/'].includes('Telefon: ' + tel17a) && ['/datenschutz/', '/agb/', '/nutzungsbedingungen/', '/widerruf/'].every((p) => t17[p].includes(mail17a)) && t17['/agb/'].includes(tel17a) && t17['/nutzungsbedingungen/'].includes(tel17a) && !Object.values(t17).some((t) => /class="ph"/.test(t)) && /Zoho Mail \(Zoho Corporation B\.V\., Beneluxlaan 4B, 3527 HT Utrecht, Niederlande\), in Rechenzentren in der EU/.test(t17['/datenschutz/']), 'Kontakt eingetragen: ask@eeziframes.com und 0152 56950998 in Impressum, AGB, Nutzungsbedingungen, Datenschutz und Widerruf, gleich wie in anbieter.js; keine Platzhalter mehr; Postfach bei Zoho in der Datenschutzerklärung');
  ok(/§ 5 DDG/.test(t17['/impressum/']) && /§ 18 Abs\. 2 MStV/.test(t17['/impressum/']) && /Verbraucherschlichtungsstelle/.test(t17['/impressum/']) && !/ec\.europa\.eu\/consumers\/odr|OS-Plattform/i.test(Object.values(t17).join('')), 'Impressum: § 5 DDG, Verantwortlicher nach § 18 Abs. 2 MStV, Verbraucherstreitbeilegung; kein Verweis auf die eingestellte OS-Plattform');
  const agb17 = t17['/agb/'];
  ok(/id="widerrufsbelehrung"/.test(agb17) && /Sie können Ihr Widerrufsrecht auch online unter/.test(agb17) && /Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs/.test(agb17) && /id="widerrufsformular"/.test(agb17) && /Erlöschen des Widerrufsrechts/.test(agb17) && /Bestätigung des Vertrags auf einem dauerhaften Datenträger/.test(agb17) && /7,99 €/.test(agb17) && /§ 19 UStG/.test(agb17), 'AGB: Widerrufsbelehrung mit Online-Funktion und Eingangsbestätigung, Erlöschen bei digitalen Inhalten, Muster-Widerrufsformular, Preis mit beiden Umsatzsteuer-Fällen');
  const konf17 = {}; new Function('window', fs17.readFileSync(path17.join(W17, 'web/config.js'), 'utf8'))(konf17);
  const pr17 = konf17.KONFIG.preise, nb17 = t17['/nutzungsbedingungen/'];
  ok(/§ 14 BGB/.test(nb17) && /id="avv"/.test(nb17) && /Unterauftragsverarbeiter/.test(nb17) && /Technische und organisatorische Maßnahmen/.test(nb17) && ['ersten ' + pr17.frei + ' Projekte', pr17.projekt + ' € je Projekt', pr17.abo.grund + ' € im Monat mit ' + pr17.abo.inkl + ' Projekten', 'jedes weitere ' + pr17.abo.extra + ' €', pr17.plus + ' € im Monat'].every((t) => nb17.includes(t)), 'Nutzungsbedingungen für Fensterbauer: nur Unternehmer, Preise wie in config.js, Vertrag über die Auftragsverarbeitung mit Maßnahmen und Unterauftragsverarbeitern');
  ok(/Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen/.test(t17['/datenschutz/']) && /id="widerruf"/.test(t17['/datenschutz/']) && /Resend \(Plus Five Five, Inc\./.test(t17['/datenschutz/']) && /Öffnungs- und Klickmessung ist ausgeschaltet/.test(t17['/datenschutz/']) && !/Brevo/.test(t17['/datenschutz/']) && /href="\/cookies\/"/.test(t17['/datenschutz/']), 'Datenschutz: Aufsichtsbehörde NRW, Abschnitt zur Widerrufsfunktion, E-Mail-Dienstleister, Verweis auf die Cookies-Seite');
  /* Cookies: jeder Speicher-Eintrag aus dem Code steht auf der Seite */
  const code17 = ['app.js', 'portal.js', 'gemeinsam.js'].map((f) => fs17.readFileSync(path17.join(W17, 'web/assets', f), 'utf8')).join('\n');
  const schl17 = Array.from(new Set((code17.match(/'aufmass\.[a-z0-9.]+'/g) || []).map((x) => x.slice(1, -1).replace(/\.$/, '.…'))));
  const fehlt17 = schl17.filter((x) => !t17['/cookies/'].includes('<code>' + x + '</code>'));
  ok(schl17.length >= 12 && !fehlt17.length && /__Host-zentrale/.test(t17['/cookies/']) && !/document\.cookie/.test(code17), 'Cookies-Seite nennt jeden Speicher-Eintrag aus dem Code (' + schl17.length + ') und das Sitzungs-Cookie der Zentrale; die Website setzt selbst keine Cookies' + (fehlt17.length ? ': es fehlen ' + fehlt17.join(', ') : ''));
  /* b) „Vertrag widerrufen“ auf jeder Seite, hervorgehoben */
  const ohne17 = [];
  for (const sx of seo17.SEITEN.concat([{ pfad: '/gibtsnicht' }])) { const t = (await holen17(BASE, sx.pfad)).text; if (!/class="(rg-widerruf|widerruf-knopf)" href="\/widerruf\/">Vertrag widerrufen</.test(t)) ohne17.push(sx.pfad); }
  ok(!ohne17.length, '„Vertrag widerrufen“ auf jeder Seite der Website (' + (seo17.SEITEN.length + 1) + ', auch der Fehlerseite), hervorgehoben als Knopf' + (ohne17.length ? ': fehlt auf ' + ohne17.join(', ') : ''));
  const c17a = await browser.newContext(telefon), s17a = await neueSeite(c17a);
  await s17a.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await s17a.waitForTimeout(300);
  const app17 = await s17a.evaluate(() => { const a = document.querySelector('.foot-links.recht a.widerruf[href="/widerruf/"]'), r = a ? a.getBoundingClientRect() : null; return !!r && r.height >= 44 && !!document.querySelector('.foot-links.recht a[href="/agb/"]') && !!document.querySelector('.foot-links.recht a[href="/cookies/"]'); });
  await s17a.goto(BASE + '/', { waitUntil: 'networkidle' }); await s17a.waitForTimeout(300);
  const portal17 = await s17a.evaluate(() => { const a = document.querySelector('.foot a.foot-widerruf[href="/widerruf/"]'), r = a ? a.getBoundingClientRect() : null; return !!r && r.height >= 44 && !!document.querySelector('.foot a[href="/nutzungsbedingungen/"]') && !!document.querySelector('.foot a[href="/agb/"]'); });
  ok(app17 && portal17, 'App und Startseite: „Vertrag widerrufen“ als Knopf ab 44 px, dazu AGB, Cookies und Nutzungsbedingungen');
  sauber(s17a, 'App und Startseite mit den neuen Rechtslinks ohne Fehler'); await c17a.close();
  /* c) Ohne Mailversand und ohne Datenbank (Pilot) nimmt der Server keinen Widerruf an, statt ihn zu verlieren */
  const pilot17 = await fetch(BASE + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Test', vertrag: 'Aufmaßblatt', mail: 'test@beispiel.de' }) }), pj17 = await pilot17.json();
  ok(pilot17.status === 503 && pj17.anders === true && /E-Mail oder Brief/.test(pj17.fehler), 'Widerruf ohne Mailversand und Datenbank: 503 mit Hinweis auf E-Mail oder Brief');
  /* d) eigener Testserver mit Mail- und Daten-Attrappe: Formular, Eingangsbestätigung, Kopie */
  const port17 = 9300 + Math.floor(Math.random() * 80), B7 = 'http://localhost:' + port17;
  const kind17 = cp17.spawn(process.execPath, [path17.join(W17, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port17), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1' }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind17.stderr.on('data', (dd) => process.stderr.write('  [Server 7] ' + dd));
  const aus17 = () => { try { kind17.kill(); } catch (e) { /* schon weg */ } }; process.on('exit', aus17);
  let bereit17 = false; for (let i = 0; i < 60 && !bereit17; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit17 = (await fetch(B7 + '/api/status').then((r) => r.json())).post === true; } catch (e) { /* noch nicht */ } }
  ok(bereit17, 'Testserver mit Mail-Attrappe läuft: ' + B7);
  const leer17 = await fetch(B7 + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), lj17 = await leer17.json();
  const fremd17 = await fetch(B7 + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://fremd.example' }, body: JSON.stringify({ name: 'X', vertrag: 'Y', mail: 'x@beispiel.de' }) });
  ok(leer17.status === 400 && !!(lj17.felder && lj17.felder.name && lj17.felder.vertrag && lj17.felder.mail) && fremd17.status === 403, 'Widerruf-API: ohne Name, Vertrag und E-Mail 400 mit Hinweis je Feld; fremde Herkunft 403');
  const c17 = await browser.newContext(telefon), s17 = await neueSeite(c17, B7);
  await s17.goto(B7 + '/widerruf/', { waitUntil: 'networkidle' });
  await s17.click('#wr-senden'); await s17.waitForTimeout(150);
  const fehler17 = await s17.evaluate(() => ['name', 'vertrag', 'mail'].every((f) => !document.getElementById('wr-' + f + '-f').hidden) && document.activeElement && document.activeElement.id === 'wr-name' && document.getElementById('wr-senden').textContent === 'Widerruf bestätigen');
  const mail17 = 'erika-' + Date.now() + '@beispiel.de';
  await s17.fill('#wr-name', 'Erika Muster'); await s17.fill('#wr-vertrag', 'Kauf des Aufmaßblatts am 16.10.2026'); await s17.fill('#wr-mail', mail17);
  await s17.click('#wr-senden'); await s17.waitForSelector('#widerruf-ok:not([hidden])', { timeout: 8000 });
  const ok17 = await s17.evaluate(() => ({ text: document.getElementById('widerruf-ok').innerText, form: document.getElementById('widerruf').hidden }));
  await foto(s17, 'widerruf-bestaetigt');
  const post17 = (await fetch(B7 + '/api/test/post').then((r) => r.json())).post || [];
  const anKunde17 = post17.find((m) => m.an === mail17), anUns17 = post17.find((m) => /^Widerruf eingegangen: Erika Muster/.test(m.betreff));
  ok(fehler17 && ok17.form && /Ihr Widerruf ist eingegangen/.test(ok17.text) && /Eingang: \d{1,2}\. \S+ 20\d\d, \d\d:\d\d:\d\d Uhr/.test(ok17.text) && /Kauf des Aufmaßblatts am 16\.10\.2026/.test(ok17.text) && ok17.text.includes('haben wir an ' + mail17), 'Vertrag widerrufen im Browser: erst Hinweise je Feld, dann „Widerruf bestätigen“: Bestätigung mit Datum, Uhrzeit und Inhalt auf der Seite');
  ok(!!anKunde17 && anKunde17.betreff === 'Eingangsbestätigung Ihres Widerrufs' && /Hiermit widerrufe ich den folgenden Vertrag: Kauf des Aufmaßblatts am 16\.10\.2026/.test(anKunde17.html) && / Uhr</.test(anKunde17.html) && /nur den Eingang/.test(anKunde17.html) && !!anUns17 && anUns17.antwortAn === mail17, 'Eingangsbestätigung sofort per E-Mail an den Kunden (Inhalt, Datum, Uhrzeit, ohne Zusage zur Wirksamkeit), Kopie an den Betreiber mit Antwort an den Kunden');
  ok(!!anKunde17 && /<img src="cid:eeziframes-zeichen"/.test(anKunde17.html) && (anKunde17.bilder || []).includes('eeziframes-zeichen') && /<b style="font-weight:900">eezi<\/b>frames/.test(anKunde17.html), 'E-Mails tragen oben das Zeichen mit Wortmarke, als eingebettetes Bild (cid), nichts wird nachgeladen');
  sauber(s17, 'Widerrufsfunktion ohne Fehler'); await c17.close();

  /* e) Rechtstexte nach der unabhängigen Prüfung */
  const bel17 = agb17.slice(agb17.indexOf('id="widerrufsbelehrung"'), agb17.indexOf('Ende der Widerrufsbelehrung'));
  ok(/Telefon: <a href="tel:\+4915256950998">0152 56950998<\/a>, E-Mail: <a href="mailto:ask@eeziframes\.com">ask@eeziframes\.com<\/a>/.test(bel17) && agb17.indexOf('id="erloeschen"') > agb17.indexOf('Ende der Widerrufsbelehrung') && !/Erlöschen/.test(bel17) && agb17.includes('<meta name="stand" content="' + RECHT.AGB_STAND + '">') && nb17.includes('<meta name="stand" content="' + RECHT.NB_STAND + '">') && agb17.includes('Stand: ' + RECHT.standText(RECHT.AGB_STAND)) && nb17.includes('Stand: ' + RECHT.standText(RECHT.NB_STAND)), 'AGB: Widerrufsbelehrung mit Telefonnummer, der Hinweis zum Erlöschen steht nach dem Ende der Belehrung; Stand von AGB und Nutzungsbedingungen wie in functions/api/recht.js');
  ok(/frühestens drei Jahre nach dem Kauf/.test(agb17) && /Mit dem Kauf des Aufmaßblatts endet die Zeit für freies Ändern/.test(agb17) && /Auf der Kassenseite der App/.test(agb17) && /Eingabefehler berichtigen Sie/.test(agb17) && /Online abrufen können Sie den Vertragstext nach dem Kauf nicht/.test(agb17) && /Absatz 1 bleibt unberührt/.test(agb17) && /Für die kostenlosen Funktionen bemühen wir uns/.test(agb17), 'AGB: Kündigung eines Kontos mit Kauf erst nach drei Jahren, der Kauf beendet die freie Woche, Bestellschritte mit der Kassenseite, Eingabefehler, Vertragstext, Haftung, Mängelrechte bei Störungen');
  const avv17 = nb17.slice(nb17.indexOf('id="avv"'));
  ok(!/Gerichtsstand/.test(nb17) && /Abrechnungsmonat/.test(nb17) && /bis zu zwei Kalendertage vor dem Einzug/.test(nb17) && /Preiserhöhungen und Änderungen der Hauptleistungen gelten nur mit Ihrer Zustimmung/.test(nb17) && /10\. Verantwortung des Betriebs/.test(avv17) && /Inspektionen/.test(avv17) && /als eigener Verantwortlicher|selbst verantworten/.test(avv17) && !/Anthropic/.test(avv17) && /sieben Tagen/.test(avv17), 'Nutzungsbedingungen: kein Gerichtsstand, Abo je Abrechnungsmonat, SEPA-Ankündigung wie bei Stripe, Zustimmung durch Schweigen nur für Nebensachen; AVV mit Rollen, Sicherung, Kontrollen und Pflichten des Betriebs, ohne die KI-Auswertung');
  ok(/<h2 id="kundenschutz">§ 11 Kundenschutz<\/h2>/.test(nb17) && /Ihr Kunde sieht beim Messen nur Ihren Betrieb/.test(nb17) && /Kein anderer Betrieb kann es über eeziframes öffnen oder in sein Konto übernehmen/.test(nb17) && /weder das Aufmaßblatt noch einen Code, mit dem ein anderer Betrieb das Aufmaß übernehmen könnte/.test(nb17) && /verkaufen keine Anfragen oder Kontaktdaten/.test(nb17) && /ohne Einhaltung einer Frist kündigen/.test(nb17) && /<h2>§ 13 Haftung<\/h2>/.test(nb17) && /<h2>§ 15 Schlussbestimmungen<\/h2>/.test(nb17) && !/Kundenschutz-?Garantie/.test(nb17), 'Nutzungsbedingungen § 11 Kundenschutz: nur der eigene Betrieb im Link, kein Zugriff anderer Betriebe, kein Blatt und kein Code vom Anbieter, keine Ansprache und kein Verkauf, fristlose Kündigung bei Verstoß; folgende Paragrafen neu nummeriert');
  ok(/__cf_bm/.test(t17['/cookies/']) && /cf_clearance/.test(t17['/cookies/']) && /method="post" action="\/api\/widerruf"/.test(t17['/widerruf/']) && /Anthropic Ireland, Limited/.test(t17['/datenschutz/']) && /KI-Einwilligung widerrufen/.test(t17['/datenschutz/']) && !/sobald eeziframes mit Datenbank und Zahlungsdienst läuft/.test(t17['/datenschutz/']) && /Anmeldeprotokolle/.test(t17['/datenschutz/']), 'Cookies mit den Sicherheits-Cookies von Cloudflare; Widerrufsformular auch ohne JavaScript; Datenschutz mit Anthropic Ireland, Widerruf der KI-Einwilligung, Anmeldeprotokollen, ohne Vorbehalt zur Pilotphase');
  const gem17 = fs17.readFileSync(path17.join(W17, 'web/assets/gemeinsam.js'), 'utf8'), portalQ17 = fs17.readFileSync(path17.join(W17, 'web/assets/portal.js'), 'utf8');
  ok(/Anthropic Ireland, Ltd\./.test(gem17) && /spätestens nach 30 Tagen/.test(gem17) && /jederzeit widerrufen/.test(gem17) && /Ich registriere mich als Unternehmer \(§ 14 BGB\)/.test(portalQ17) && /Nur für Unternehmer \(§ 14 BGB\)/.test(portalQ17) && /Angebot nur für Unternehmer im Sinne von § 14 BGB/.test((await holen17(BASE, '/fuer-fensterbauer/')).text), 'KI-Dialog nennt Anthropic Ireland, die Löschung nach 30 Tagen und den Widerruf; Betriebe registrieren sich als Unternehmer, Preise für Betriebe mit Hinweis „nur für Unternehmer“');

  /* f) App: „Vertrag widerrufen“ unter jedem Bildschirm, im Glossar-Blatt, KI-Einwilligung widerrufbar */
  const c17b = await browser.newContext(telefon), s17b = await neueSeite(c17b);
  await s17b.goto(BASE + '/app/', { waitUntil: 'networkidle' }); await s17b.waitForTimeout(300);
  const schirme17 = await s17b.evaluate(() => {
    S.windows = demoProject(); Object.assign(S.proj, { name: 'Haus Recht' }); kauf().mail = 'recht@beispiel.de'; persist();
    return ['home', 'anfrage', 'anfrage2', 'anfrage3', 'teilen', 'blatt', 'konto', 'kasse'].map((sc) => { go(sc); const f = document.querySelector('.scr .foot-links.recht'), a = f && f.firstElementChild, r = a ? a.getBoundingClientRect() : null; return sc + ':' + (a && a.matches('a.widerruf[href="/widerruf/"]') && r.height >= 44 ? 'ja' : 'nein'); });
  });
  const blatt17 = await s17b.evaluate(() => { S.glossIndex = true; render(); const a = document.querySelector('.sheet .foot-links.recht a.widerruf[href="/widerruf/"]'); S.glossIndex = false; render(); return !!a; });
  ok(schirme17.every((x) => /:ja$/.test(x)) && blatt17, '„Vertrag widerrufen“ als erster Rechtslink unter jedem Bildschirm der App (' + schirme17.join(', ') + ') und im Glossar-Blatt, das auch die Messbildschirme öffnen');
  const ki17 = await s17b.evaluate(() => { localStorage.setItem('aufmass.ki.einwilligung', 'ja'); go('home'); const b = document.querySelector('.foot-links.recht [data-act="ki-widerrufen"]'); if (!b) return { da: false }; const r = b.getBoundingClientRect(); b.click(); return { da: true, hoch: r.height >= 44, weg: localStorage.getItem('aufmass.ki.einwilligung') === null && !window.FotoKI.eingewilligt(), danach: !document.querySelector('.foot-links.recht [data-act="ki-widerrufen"]'), toast: (document.querySelector('.toast') || {}).textContent || '' }; });
  ok(ki17.da && ki17.hoch && ki17.weg && ki17.danach && /Einwilligung widerrufen/.test(ki17.toast), 'KI-Einwilligung: sobald erteilt, unten in der App mit einem Tipp widerrufbar; danach fragt die App wieder');
  sauber(s17b, 'Rechtslinks und Widerruf der KI-Einwilligung ohne Fehler'); await c17b.close();

  /* g) Widerruf ohne JavaScript: gewöhnliches Formular, Antwort als Seite */
  const form17 = await fetch(B7 + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: B7 }, body: new URLSearchParams({ name: 'Otto Ohne', vertrag: 'Kauf des Aufmaßblatts am 15.10.2026', mail: 'otto-' + Date.now() + '@beispiel.de' }).toString() }), formT17 = await form17.text();
  const formLeer17 = await fetch(B7 + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'name=&vertrag=&mail=' }), formLeerT17 = await formLeer17.text();
  ok(form17.status === 200 && /text\/html/.test(form17.headers.get('content-type') || '') && /Ihr Widerruf ist eingegangen\./.test(formT17) && /Kauf des Aufmaßblatts am 15\.10\.2026/.test(formT17) && /\d\d:\d\d:\d\d Uhr/.test(formT17) && /Eine Eingangsbestätigung mit diesen Angaben haben wir an/.test(formT17) && !/widerruf\.js/.test(formT17) && /class="widerruf-knopf"/.test(formT17) && /default-src 'self'/.test(form17.headers.get('content-security-policy') || '') && formLeer17.status === 400 && /Bitte Ihren Namen angeben\./.test(formLeerT17) && /Zurück zum Formular/.test(formLeerT17), 'Widerruf als gewöhnliches Formular: Antwort als Seite im Aufbau der Website (Bestätigung mit Uhrzeit bzw. Hinweise je Feld), mit denselben Sicherheits-Kopfzeilen');
  const c17n = await browser.newContext(Object.assign({}, telefon, { javaScriptEnabled: false })), s17n = await c17n.newPage();
  await s17n.goto(B7 + '/widerruf/'); await s17n.fill('#wr-name', 'Nora Noscript'); await s17n.fill('#wr-vertrag', 'Aufmaßblatt vom 14.10.2026'); await s17n.fill('#wr-mail', 'nora-' + Date.now() + '@beispiel.de');
  await Promise.all([s17n.waitForURL(B7 + '/api/widerruf'), s17n.click('#wr-senden')]);
  const nos17 = await s17n.content(); await c17n.close();
  ok(/Ihr Widerruf ist eingegangen\./.test(nos17) && /Aufmaßblatt vom 14\.10\.2026/.test(nos17), 'Browser ohne JavaScript: „Widerruf bestätigen“ schickt das Formular, die nächste Seite zeigt die Bestätigung');

  /* h) Störung des Mailversands: der Widerruf gilt, die Eingangsbestätigung kommt mit dem täglichen Lauf */
  await fetch(B7 + '/api/test/post?stoerung=1');
  const mailS17 = 'sabine-' + Date.now() + '@beispiel.de';
  const st17 = await fetch(B7 + '/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Sabine Störung', vertrag: 'Aufmaßblatt vom 13.10.2026', mail: mailS17 }) }), sj17 = await st17.json();
  await fetch(B7 + '/api/test/post?stoerung=0');
  const nach17 = await fetch(B7 + '/api/test/nachholen').then((r) => r.json()), nach17b = await fetch(B7 + '/api/test/nachholen').then((r) => r.json());
  const postN17 = (await fetch(B7 + '/api/test/post').then((r) => r.json())).post || [], spaet17 = postN17.filter((m) => m.an === mailS17);
  ok(st17.status === 200 && sj17.ok && sj17.bestaetigt === false && sj17.nachholen === true && nach17.widerruf.nachgeholt === 1 && nach17b.widerruf.nachgeholt === 0 && spaet17.length === 1 && /erst jetzt kommt/.test(spaet17[0].html) && postN17.some((m) => /^Widerruf eingegangen: Sabine Störung/.test(m.betreff) && /nachgeholt/.test(m.html)), 'Störung des Mailversands: der Widerruf ist eingegangen und gespeichert; der tägliche Lauf schickt die Eingangsbestätigung und die Kopie an den Betreiber einmal nach');

  /* i) Vertragsbestätigung nachholen (im Speicher): Störung zählt, ohne lesbare AGB keine Mail mit bloßem Link, geänderte AGB von Hand */
  const umg17 = await import(url17.pathToFileURL(path17.join(W17, 'functions/api/umgebung.js')).href), spM17 = await import(url17.pathToFileURL(path17.join(W17, 'functions/api/speicher.js')).href);
  const best17 = await import(url17.pathToFileURL(path17.join(W17, 'functions/api/bestaetigung.js')).href), postM17 = await import(url17.pathToFileURL(path17.join(W17, 'functions/api/post.js')).href);
  const k17 = umg17.konfig({ DATEN_ATTRAPPE: '1', MAIL_ATTRAPPE: '1' }), sp17 = spM17.speicher(k17), vor17 = new Date(Date.now() - 3600000).toISOString();
  const dateien17 = { fetch: async (req) => { const u = new URL(req.url), f = path17.join(W17, 'web', u.pathname, u.pathname.endsWith('/') ? 'index.html' : ''); try { return new Response(fs17.readFileSync(f, 'utf8'), { status: 200 }); } catch (e) { return new Response('', { status: 404 }); } } };
  await sp17.zahlungAnlegen({ stripe_session: 'cs_nach17a', art: 'aufmass', kennung: 'nach17aaa', mail: 'nach17a@beispiel.de', betrag_cent: 799, status: 'bezahlt', bezahlt_am: vor17, daten: { zustimmung: { agb: RECHT.AGB_STAND, text: RECHT.ZUSTIMMUNG, zeit: vor17 } } });
  await sp17.zahlungAnlegen({ stripe_session: 'cs_nach17b', art: 'aufmass', kennung: 'nach17bbb', mail: 'nach17b@beispiel.de', betrag_cent: 799, status: 'bezahlt', bezahlt_am: vor17, daten: { zustimmung: { agb: '2020-01-01', text: RECHT.ZUSTIMMUNG, zeit: vor17 } } });
  postM17.attrappeAus.an = true; const r1n17 = await best17.bestaetigungenNachholen(k17, sp17, { ASSETS: dateien17 }); const a1n17 = await sp17.zahlungHolen('cs_nach17a'); postM17.attrappeAus.an = false;
  const ohneAgb17 = await best17.bestaetigungenNachholen(k17, sp17, {}), r2n17 = await best17.bestaetigungenNachholen(k17, sp17, { ASSETS: dateien17 }), r3n17 = await best17.bestaetigungenNachholen(k17, sp17, { ASSETS: dateien17 });
  const aN17 = await sp17.zahlungHolen('cs_nach17a'), bN17 = await sp17.zahlungHolen('cs_nach17b'), mailsN17 = postM17.attrappePost.filter((m) => /^nach17/.test(m.an));
  ok(r1n17.nachgeholt === 0 && a1n17.versuche === 1 && ohneAgb17.nachgeholt === 0 && r2n17.nachgeholt === 1 && r3n17.nachgeholt === 0 && !!aN17.bestaetigt_am && !bN17.bestaetigt_am && bN17.versuche === spM17.VERSUCHE && mailsN17.length === 1 && mailsN17[0].an === 'nach17a@beispiel.de' && mailsN17[0].html.includes('„' + RECHT.ZUSTIMMUNG + '“') && mailsN17[0].html.includes('Stand ' + RECHT.standText(RECHT.AGB_STAND)) && /Widerrufsbelehrung/.test(mailsN17[0].html) && /Muster-Widerrufsformular/.test(mailsN17[0].html), 'Vertragsbestätigung nachholen: eine Störung zählt als Versuch, ohne lesbare AGB geht keine Mail mit bloßem Link raus, danach genau eine Bestätigung mit Zustimmung im Wortlaut und AGB-Stand; bei geänderten AGB kein automatischer Versand');

  /* j) Anmelden legt kein Konto an; Registrierung der Betriebe nur als Unternehmer mit geltender Fassung */
  const post17j = (pfad, body, tok) => fetch(B7 + pfad, { method: 'POST', headers: Object.assign({ 'content-type': 'application/json' }, tok ? { authorization: 'Bearer ' + tok } : {}), body: JSON.stringify(body) }).then(async (r) => Object.assign({ _status: r.status }, await r.json().catch(() => ({}))));
  const neuMail17 = 'neu17-' + Date.now() + '@beispiel.de';
  const cA = await post17j('/api/kunde/code', { mail: neuMail17, neu: false }), aA = await post17j('/api/kunde/anmelden', { mail: neuMail17, code: '123456' });
  const cB = await post17j('/api/kunde/code', { mail: neuMail17 }), aB = await post17j('/api/kunde/anmelden', { mail: neuMail17, code: '123456' });
  const cC = await post17j('/api/kunde/code', { mail: neuMail17, neu: false }), aC = await post17j('/api/kunde/anmelden', { mail: neuMail17, code: '123456' });
  ok(cA.ok && aA._status === 401 && cB.ok && aB.ok && cC.ok && aC.ok, 'Anmelden in der App legt kein neues Konto an (ohne Konto kommt kein Code, die Antwort verrät das nicht); Sichern legt es an, danach klappt Anmelden');
  const tokR17 = 'test.' + Buffer.from('reg17-' + Date.now() + '@beispiel.de', 'utf8').toString('base64').replace(/=+$/, '');
  const reg17 = (zus) => post17j('/api/konto/registrieren', Object.assign({ firma: 'Fensterbau Recht ' + Date.now(), ap: 'Rita Recht', tel: '0221 9' + String(Date.now()).slice(-6), plz: '50667' }, zus), tokR17);
  const rgA = await reg17({ agb: true }), rgB = await reg17({ agb: RECHT.NB_STAND }), rgC = await reg17({ agb: '2020-01-01', unternehmer: true }), rgD = await reg17({ agb: RECHT.NB_STAND, unternehmer: true });
  /* e) Anmelde-E-Mails bei Supabase (supabase/vorlagen): nur der Code, nichts Nachgeladenes, Stil der Seite, bis 10 Stellen auf dem Telefon */
  const vorl17 = {}; for (const n of ['anmeldecode', 'registrierung']) vorl17[n] = fs17.readFileSync(path17.join(W17, 'supabase/vorlagen', n + '.html'), 'utf8');
  const vorlFehler17 = [];
  for (const [n, h] of Object.entries(vorl17)) {
    const aktionen = h.match(/\{\{[^}]*\}\}/g) || [], text = h.replace(/<head>[\s\S]*?<\/head>/, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    if ((h.match(/\{\{ \.Token \}\}/g) || []).length !== 1 || !h.includes('{{ .Email }}')) vorlFehler17.push(n + ': Code nicht genau einmal oder Adresse fehlt');
    if (!aktionen.every((a) => a === '{{ .Token }}' || a === '{{ .Email }}')) vorlFehler17.push(n + ': andere Platzhalter ' + aktionen.join(' '));
    if (/ConfirmationURL|TokenHash|<img|<script|url\(|@import|src=|<!--/i.test(h)) vorlFehler17.push(n + ': Link zur Anmeldung, Bild, Skript, Kommentar oder Nachgeladenes');
    if ((h.match(/https?:\/\/[^"'\s<]+/g) || []).some((u) => !/^https:\/\/eeziframes\.com\/(impressum|datenschutz)\/$/.test(u))) vorlFehler17.push(n + ': fremde Adresse');
    if ((h.match(/font-size:\s*\d+px/g) || []).map((x) => +x.match(/\d+/)[0]).some((g) => g > 0 && g < 13)) vorlFehler17.push(n + ': Schrift unter 13 px');
    if (/Eeziframes|EEZIFRAMES|eeziFrames/.test(h) || !h.includes('<b style="font-weight:900;">eezi</b><span style="font-weight:500;">frames</span>')) vorlFehler17.push(n + ': Wortmarke');
    if (/\b(du|dich|dir|dein|deine|Sie|Ihr|Ihre|Ihnen)\b/.test(text)) vorlFehler17.push(n + ': Anrede (Betriebe und Hauseigentümer bekommen dieselbe Mail)');
    if (!text.includes(anb17.name) || !/Herzebrock-Clarholz/.test(text)) vorlFehler17.push(n + ': Anbieter fehlt');
  }
  for (const schema of ['light', 'dark']) {
    const cV = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1, colorScheme: schema }), sV = await cV.newPage();
    for (const [n, h] of Object.entries(vorl17)) {
      await sV.setContent(h.replace('{{ .Token }}', '4829137750').replace('{{ .Email }}', 'sehr.lange.adresse.fuer.den.test@fensterbau-beispiel.de'), { waitUntil: 'load' });
      const m = await sV.evaluate(() => { const c = document.querySelector('.code'), f = document.querySelector('.codefeld'); return { quer: document.documentElement.scrollWidth - innerWidth, zeilen: Math.round(c.getBoundingClientRect().height / parseFloat(getComputedStyle(c).lineHeight)), feld: getComputedStyle(f).backgroundColor, ziffern: getComputedStyle(c).color }; });
      const erwartet = schema === 'dark' ? ['rgb(242, 241, 237)', 'rgb(17, 17, 16)'] : ['rgb(20, 20, 20)', 'rgb(255, 255, 255)'];
      if (m.quer > 0 || m.zeilen !== 1 || m.feld !== erwartet[0] || m.ziffern !== erwartet[1]) vorlFehler17.push(n + ' ' + schema + ': ' + JSON.stringify(m));
    }
    await cV.close();
  }
  const os17 = fs17.readFileSync(path17.join(W17, 'docs/ONLINE-STELLEN.md'), 'utf8');
  if (!os17.includes('supabase/vorlagen/anmeldecode.html') || !os17.includes('supabase/vorlagen/registrierung.html') || !os17.includes('`Anmeldecode für eeziframes: {{ .Token }}`')) vorlFehler17.push('Anleitung nennt Vorlagen oder Betreff nicht');
  ok(!vorlFehler17.length, 'Anmelde-E-Mails (Supabase-Vorlagen): genau ein Code, keine Anmeldelinks, Bilder, Skripte oder fremden Adressen, Schrift ab 13 px, Wortmarke, ohne Anrede, mit Anbieter; 10 Stellen und lange Adresse bei 360 px ohne Querscrollen, Codefeld hell und dunkel wie der Primärknopf' + (vorlFehler17.length ? ': ' + vorlFehler17.join(' | ') : ''));
  ok(rgA._status === 400 && rgB._status === 400 && rgC._status === 409 && rgC.neuLaden && rgD.ok && rgD.konto.acc.bedingungen.fassung === RECHT.NB_STAND && rgD.konto.acc.bedingungen.unternehmer === true && rgD.konto.acc.bedingungen.avv === true && !isNaN(Date.parse(rgD.konto.acc.bedingungen.zeit)), 'Registrierung nur als Unternehmer mit Zustimmung zur geltenden Fassung der Nutzungsbedingungen samt AVV; Fassung und Zeitpunkt stehen am Konto');
  aus17();
}

if (teil(18)) {
  console.log('18. KI-Auswertung kommt an, auch wenn schneller gespeichert oder gesendet wird');
  const cp18 = await import('node:child_process'), path18 = await import('node:path'), url18 = await import('node:url');
  const W18 = path18.resolve(path18.dirname(url18.fileURLToPath(import.meta.url)), '..');
  const port18 = 9300 + Math.floor(Math.random() * 80), B18 = 'http://localhost:' + port18, stempel18 = Date.now().toString(36);
  /* eine echte Auswertung dauert 15 bis 30 Sekunden; hier 4 Sekunden je Foto, damit Speichern und Senden davor liegen */
  const kind18 = cp18.spawn(process.execPath, [path18.join(W18, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port18), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', KI_VERZOEGERUNG_MS: '4000' }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind18.stderr.on('data', (d) => process.stderr.write('  [Server 18] ' + d));
  const aus18 = () => { try { kind18.kill(); } catch (e) { /* schon weg */ } };
  process.on('exit', aus18);
  let bereit18 = false;
  for (let i = 0; i < 60 && !bereit18; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit18 = !!(await fetch(B18 + '/api/status').then((r) => r.json())).daten; } catch (e) { /* noch nicht */ } }
  ok(bereit18, 'Testserver mit langsamer KI (4 s je Foto) läuft: ' + B18);
  try {
    const fotosMachen = async (s) => {
      const jpg = Buffer.from(await s.evaluate(() => { const c = document.createElement('canvas'); c.width = 900; c.height = 1200; const g = c.getContext('2d'); g.fillStyle = '#e9e3da'; g.fillRect(0, 0, 900, 1200); g.fillStyle = '#fff'; g.fillRect(220, 200, 460, 760); return c.toDataURL('image/jpeg', 0.9).split(',')[1]; }), 'base64');
      await s.click('[data-act="new"]'); await s.waitForSelector('.scr[data-screen="start"]'); await s.click('.bb .btn.primary');
      await s.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
      await s.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpg });
      if (await s.waitForSelector('.fx-dialog', { timeout: 3000 }).then(() => true, () => false)) await s.click('.fx-ja');
      await s.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: jpg });
      await s.waitForFunction(() => S.ai.in && S.ai.in.status === 'running' && S.ai.out && S.ai.out.status === 'running', null, { timeout: 5000 });
    };
    const schnellSpeichern = (s, name) => s.evaluate((n) => { Object.assign(S.win, { name: n, mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, name);
    /* a) eigenes Aufmaß: gespeichert, bevor die KI antwortet */
    const c18a = await browser.newContext(telefon), s18a = await neueSeite(c18a, B18);
    await s18a.goto(B18 + '/app/', { waitUntil: 'networkidle' }); await s18a.waitForTimeout(300);
    await fotosMachen(s18a); await schnellSpeichern(s18a, 'Wohnzimmer'); await s18a.waitForTimeout(200);
    const waehrend = await s18a.evaluate(() => ({ screen: S.screen, ki: !!(S.windows[0] && S.windows[0].ki), hinweis: (document.querySelector('.ki-laeuft') || {}).textContent || '' }));
    await s18a.waitForFunction(() => S.windows[0] && S.windows[0].ki && S.windows[0].ki.rows.some((r) => r[0] === 'Fassade') && S.windows[0].ki.rows.some((r) => r[0] === 'Rollladen'), null, { timeout: 15000 }); await s18a.waitForTimeout(300);
    const danach = await s18a.evaluate(() => ({ rows: S.windows[0].ki.rows.map((r) => r[0]).join(','), laib: S.windows[0].laib, fotos: S.windows[0].fotos, offen: S.win.ki && S.win.ki.rows.length, hinweis: !!document.querySelector('.ki-laeuft'), gespeichert: JSON.parse(localStorage.getItem('aufmass.v1') || '{}').windows[0].ki.rows.length }));
    ok(waehrend.screen === 'fertig' && !waehrend.ki && /Die KI liest noch die Einbausituation/.test(waehrend.hinweis) && /Rollladen/.test(danach.rows) && /Fassade/.test(danach.rows) && danach.laib === 160 && danach.fotos === 2 && danach.offen > 2 && !danach.hinweis && danach.gespeichert > 2, 'Gespeichert, bevor die KI antwortet: Hinweis „liest noch“, danach stehen beide Auswertungen im gespeicherten Fenster (auch im Browserspeicher) und in der offenen Ansicht');
    /* Auswertung allein ist keine Änderung: auch ein festes Fenster nimmt sie an; eine echte Änderung bleibt gesperrt */
    const fest = await s18a.evaluate(() => {
      const g = S.windows[0]; g.t0 = Date.now() - 30 * 864e5; g.aend = 4; persist();
      S.editIdx = 0; S.win = kopie(g); S.win.ki = Object.assign({}, S.win.ki, { chips: ['nachgereicht'] }); saveWin();
      const a = { aend: S.windows[0].aend, chips: S.windows[0].ki.chips.join(',') };
      S.win = kopie(S.windows[0]); S.win.name = 'Wohnzimmer links'; saveWin();
      return Object.assign(a, { name: S.windows[0].name, toast: S.toast || '' });
    });
    ok(fest.aend === 4 && fest.chips === 'nachgereicht' && fest.name === 'Wohnzimmer' && /fest/.test(fest.toast), 'Feste Fenster: neue Auswertung wird gespeichert und zählt nicht als Änderung, eine echte Änderung bleibt gesperrt');
    sauber(s18a, 'Langsame KI im eigenen Aufmaß ohne Fehler'); await c18a.close();
    /* b) gespeichert und gleich das nächste Fenster angelegt: die Auswertung des ersten läuft weiter und kommt dort an */
    const c18b = await browser.newContext(telefon), s18b = await neueSeite(c18b, B18);
    await s18b.goto(B18 + '/app/', { waitUntil: 'networkidle' }); await s18b.waitForTimeout(300);
    await fotosMachen(s18b); await schnellSpeichern(s18b, 'Küche'); await s18b.evaluate(() => newWin());
    await s18b.waitForFunction(() => S.windows[0] && S.windows[0].ki && S.windows[0].ki.rows.some((r) => r[0] === 'Fassade') && S.windows[0].ki.rows.some((r) => r[0] === 'Rollladen'), null, { timeout: 15000 });
    const naechstes = await s18b.evaluate(() => ({ n: S.windows.length, neuOhne: !S.win.ki, screen: S.screen }));
    ok(naechstes.n === 1 && naechstes.neuOhne && naechstes.screen === 'start', '„Weiteres Fenster“ bricht die Auswertung nicht mehr ab: sie landet im gespeicherten Fenster, das neue bleibt leer');
    sauber(s18b, 'Neues Fenster während der Auswertung ohne Fehler'); await c18b.close();
    /* c) Kundenlink: gespeichert und sofort gesendet; Senden wartet, der Betrieb bekommt die Auswertung */
    const api18 = async (p, body, token) => { const init = { method: body ? 'POST' : 'GET', headers: { accept: 'application/json', origin: B18 } }; if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); } if (token) init.headers.authorization = 'Bearer ' + token; const r = await fetch(B18 + p, init); const j = await r.json().catch(() => ({})); return Object.assign({ _status: r.status }, j); };
    const tok18 = 'test.' + Buffer.from('ki18-' + stempel18 + '@beispiel.de', 'utf8').toString('base64').replace(/=+$/, '');
    const reg18 = await api18('/api/konto/registrieren', { firma: 'Fensterbau KI ' + stempel18, ap: 'Kai Klar', tel: '0221 7' + String(Date.now()).slice(-6), plz: '50667', col: '#1f7a3d', agb: RECHT.NB_STAND, unternehmer: true }, tok18);
    const pr18 = await api18('/api/konto/projekte', { kunde: 'Familie Schnell', kontakt: '', plan: ['Fenster'], days: 14 }, tok18), code18 = pr18.konto.acc.links.find((l) => l.id === pr18.id).code;
    const c18c = await browser.newContext(telefon), s18c = await neueSeite(c18c, B18);
    await s18c.goto(B18 + '/app/#k-' + code18, { waitUntil: 'networkidle' }); await s18c.waitForTimeout(600);
    await fotosMachen(s18c); await schnellSpeichern(s18c, 'Bad');
    await s18c.evaluate(() => { go('blatt'); }); await s18c.waitForTimeout(200);
    const vorSenden = await s18c.evaluate(() => ({ hinweis: (document.querySelector('.ki-laeuft') || {}).textContent || '', voll: derive(S.windows[0]).complete }));
    await s18c.evaluate(() => { act('send', document.body); }); await s18c.waitForTimeout(150); // nicht auf das Senden warten: der Zustand währenddessen zählt
    const wartet = await s18c.evaluate(() => ({ wartet: S.kiWartet, sent: !!S.sent, knopf: (document.querySelector('.bb .btn.primary') || {}).textContent || '', aus: !!(document.querySelector('.bb .btn.primary') || {}).disabled, toast: S.toast || '' }));
    await s18c.waitForFunction(() => S.sent && S.sent.uebertragen, null, { timeout: 20000 });
    const beimBetrieb = (await api18('/api/konto', null, tok18)).konto.acc.links.find((l) => l.code === code18);
    const kiBetrieb = beimBetrieb && beimBetrieb.aufmass && beimBetrieb.aufmass.windows[0] && beimBetrieb.aufmass.windows[0].ki;
    ok(reg18.ok && vorSenden.voll && /kommt gleich dazu/.test(vorSenden.hinweis) && wartet.wartet === 'senden' && !wartet.sent && /Fotos werden ausgewertet/.test(wartet.knopf) && wartet.aus && /noch ausgewertet/.test(wartet.toast) && !!kiBetrieb && kiBetrieb.rows.length > 2 && kiBetrieb.rows.some((r) => r[0] === 'Fassade'), 'Kundenlink: sofort gesendet, während die KI liest; Senden wartet sichtbar, der Betrieb bekommt beide Auswertungen');
    sauber(s18c, 'Senden mit laufender Auswertung ohne Fehler'); await c18c.close();
    /* d) Server: nur die Auswertung neu zählt nicht als Änderung, auch bei festen Fenstern; eine echte Änderung bleibt fest */
    const ent18 = await import(url18.pathToFileURL(path18.join(W18, 'functions/api/entwurf.js')).href);
    const j18 = Date.now(), alt18 = { wid: 'fk18', name: 'Bad', t0: j18 - 30 * 864e5, aend: 4, ts: j18 - 5000, mo: { hm: 1480 } }, meta18 = { fenster: { fk18: { t0: alt18.t0, aend: 4 } } };
    const nurKi = ent18.zusammenfuehren([alt18], [Object.assign({}, alt18, { ki: { rows: [['Rollladen', 'Einbaukasten']] }, fotos: 2, ts: j18 })], meta18, new Set(['fk18']), true, j18, false, null, {}, 0);
    const echt18 = ent18.zusammenfuehren([alt18], [Object.assign({}, alt18, { name: 'Bad oben', ki: { rows: [['Rollladen', 'Einbaukasten']] }, ts: j18 })], meta18, new Set(['fk18']), true, j18, false, null, {}, 0);
    ok(nurKi.zurueck.length === 0 && nurKi.fenster[0].ki && nurKi.fenster[0].aend === 4 && echt18.zurueck[0] === 'fk18' && echt18.fenster[0].name === 'Bad', 'Server: eine nachgereichte Auswertung wird übernommen, ohne als Änderung zu zählen; eine echte Änderung an einem festen Fenster nicht');
  } finally { aus18(); }
}

/* ---------- 19. Fotos: zum Fensterbauer, ins Konto, ins Aufmaßblatt ---------- */
if (teil(19)) {
  console.log('19. Fotos kommen beim Fensterbauer an, liegen im Konto und im Aufmaßblatt');
  const { api } = await import('../functions/api/router.js'), umg = await import('../functions/api/umgebung.js'), spM = await import('../functions/api/speicher.js');
  const fo = await import('../functions/api/fotos.js'), ze = await import('../functions/api/zentrale.js'), auth = await import('../functions/api/auth.js');
  const B = 'https://eeziframes.com', TAG = 864e5, stempel = Date.now().toString(36);
  const env = { DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1', FREISCHALT_GEHEIMNIS: 'pruef19' }, k19 = umg.konfig(env), sp = spM.speicher(k19), ab = fo.ablage(k19);
  let ipNr = 1; const hinten = [];
  const rufe = async (pfad, o) => {
    o = o || {}; const h = { accept: 'application/json', origin: B, 'cf-connecting-ip': '203.0.113.' + (10 + (ipNr++ % 200)) };
    if (o.body) h['content-type'] = 'application/json'; if (o.token) h.authorization = 'Bearer ' + o.token;
    const r = await api(new Request(B + pfad, { method: o.method || (o.body ? 'POST' : 'GET'), headers: h, body: o.body ? JSON.stringify(o.body) : undefined }), env, { waitUntil(pr) { hinten.push(pr); } });
    if (o.roh) return r;
    const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch (e) { j = null; }
    return Object.assign({ _status: r.status }, j || {});
  };
  const fertig = async () => { while (hinten.length) await Promise.resolve(hinten.shift()).catch(() => 0); };
  const tok = (m) => 'test.' + Buffer.from(m, 'utf8').toString('base64').replace(/=+$/, '');
  const id = (n) => 'b' + stempel.slice(-6) + 'f19x' + n + 'abcd';
  const sJ = await browser.newPage();
  const jpegs = await sJ.evaluate(() => [1, 2, 3, 4].map((n) => { const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d'); g.fillStyle = ['#d9d2c5', '#c9d6df', '#e3d5c9', '#d5e3c9'][n - 1]; g.fillRect(0, 0, 600, 800); g.fillStyle = '#fff'; g.fillRect(150, 140, 300, 520); g.fillStyle = '#333'; g.font = '60px sans-serif'; g.fillText(String(n), 280, 420); return c.toDataURL('image/jpeg', 0.85).split(',')[1]; }));
  const png = await sJ.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 300; c.getContext('2d').fillRect(0, 0, 300, 300); return c.toDataURL('image/png').split(',')[1]; });
  await sJ.close();
  const fenster = { name: 'Bad', art: 'fenster', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, fotos: 2, bilder: { in: id(1), out: id(2) }, ki: { auto: true, chips: [], rows: [['Rollladen', 'Aufsatzkasten']], hints: [], pruefen: [] } };

  // a) Kundenlink: ablegen, vor dem Senden unsichtbar, nach dem Senden nur für den Betrieb
  const mailB = 'foto19-' + stempel + '@beispiel.de', TB = tok(mailB), TB2 = tok('foto19b-' + stempel + '@beispiel.de');
  const reg = await rufe('/api/konto/registrieren', { token: TB, body: { firma: 'Fensterbau Foto ' + stempel, ap: 'Fia Foto', tel: '0221 81' + String(Date.now()).slice(-5), plz: '50667', col: '#1f5fa8', agb: RECHT.NB_STAND, unternehmer: true } });
  const reg2 = await rufe('/api/konto/registrieren', { token: TB2, body: { firma: 'Glaserei Fremd ' + stempel, ap: 'Fred Fremd', tel: '0221 92' + String(Date.now()).slice(-5), plz: '50668', col: '#7a1f3d', agb: RECHT.NB_STAND, unternehmer: true } });
  const pr = await rufe('/api/konto/projekte', { token: TB, body: { kunde: 'Familie Foto', kontakt: '', plan: ['Fenster'], days: 14 } }), code = pr.konto.acc.links.find((l) => l.id === pr.id).code;
  const rowB = await sp.betriebNachAuth((await auth.nutzer(k19, TB)).id);
  const hoch = (c, i, bild) => rufe('/api/link/' + c + '/foto/' + i, { body: { bild: bild } });
  const holen = (c, i, t) => rufe('/api/konto/foto/' + c + '/' + i, { token: t, roh: true });
  const ordner = (pfx) => ab.alle().filter((x) => x.startsWith(pfx)).map((x) => x.split('/').pop().replace(/\.jpg$/, '')).sort().join(',');
  const h1 = await hoch(code, id(1), jpegs[0]), h2 = await hoch(code, id(2), jpegs[1]), h3 = await hoch(code, id(3), jpegs[2]);
  ok(reg.ok && reg2.ok && h1.ok && h2.ok && h3.ok && ordner('link/' + code + '/') === [id(1), id(2), id(3)].sort().join(','), 'Fotos über den Kundenlink abgelegt, je Link ein eigener Ordner (link/<code>/<kennung>.jpg)');
  const hPng = await hoch(code, id(4), png), hId = await hoch(code, 'b12', jpegs[0]), hGross = await hoch(code, id(4), '/9j/' + 'A'.repeat(1400000)), hKurz = await hoch('abc123', id(4), jpegs[0]), hFremd = await hoch('zzzzzzzzzz', id(4), jpegs[0]);
  ok(hPng._status === 400 && hId._status === 400 && hGross._status === 400 && hKurz._status === 400 && hFremd._status === 404 && !ordner('link/' + code + '/').includes(id(4)), 'Abgewiesen: kein JPEG, falsche Kennung, zu groß, alter kurzer Link (400), unbekannter Link (404)');
  const vorher = await holen(code, id(1), TB);
  ok(vorher.status === 404, 'Vor dem Senden sieht auch der Betrieb kein Foto');
  const send = await rufe('/api/aufmass', { body: { v: 1, b: code, p: { name: 'Familie Foto' }, w: [fenster], t: Date.now() } }); await fertig();
  const nach = (await rufe('/api/konto', { token: TB })).konto.acc.links.find((l) => l.code === code);
  ok(send.ok && nach.status === 'eingegangen' && (nach.aufmass.fotosDa || []).slice().sort().join(',') === [id(1), id(2)].sort().join(',') && nach.aufmass.windows[0].bilder.in === id(1) && ordner('link/' + code + '/') === [id(1), id(2)].sort().join(','), 'Gesendet: das Aufmaß nennt seine angekommenen Fotos; ein überholtes Foto (neu fotografiert) ist aus der Ablage gelöscht');
  const g1 = await holen(code, id(1), TB), b1 = Buffer.from(await g1.arrayBuffer());
  ok(g1.status === 200 && g1.headers.get('content-type') === 'image/jpeg' && /private/.test(g1.headers.get('cache-control') || '') && /sandbox/.test(g1.headers.get('content-security-policy') || '') && b1[0] === 0xff && b1[1] === 0xd8 && b1.equals(Buffer.from(jpegs[0], 'base64')), 'Nach dem Senden: der Betrieb lädt das Foto, Byte für Byte wie hochgeladen (JPEG, privat zwischengespeichert, abgeschottet)');
  const ohneT = await holen(code, id(1), ''), fremdT = await holen(code, id(1), TB2), ungenannt = await holen(code, id(3), TB), spaet = await hoch(code, id(4), jpegs[3]);
  ok(ohneT.status === 401 && fremdT.status === 404 && ungenannt.status === 404 && spaet._status === 410 && spaet.zu === 'eingegangen', 'Ohne Anmeldung 401, ein anderer Betrieb 404, ein Foto, das das Aufmaß nicht nennt, 404; nach dem Senden nimmt der Link keine Fotos mehr an (410)');
  await sp.betriebAendern(rowB.id, (a) => { a.links.find((l) => l.code === code).locked = true; });
  const gesperrt = await holen(code, id(1), TB), gesperrtSicht = (await rufe('/api/konto', { token: TB })).konto.acc.links.find((l) => l.code === code);
  await sp.betriebAendern(rowB.id, (a) => { a.links.find((l) => l.code === code).locked = false; });
  ok(gesperrt.status === 402 && !gesperrtSicht.aufmass.windows[0].bilder, 'Gesperrtes Aufmaß (noch keine Zahlungsart): keine Fotos, auch keine Kennungen (402)');
  // Code ohne Link (eingefügt): ohne Kennungen von Fotos; die Fotos stehen im Aufmaßblatt des Kunden
  const am1 = 'AM1.' + Buffer.from(JSON.stringify({ v: 1, b: '', p: { name: 'Ohne Link' }, w: [Object.assign({}, fenster, { name: 'Flur' })], t: Date.now() }), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const imp = await rufe('/api/konto/import', { token: TB, body: { code: am1 } }), impL = (await rufe('/api/konto', { token: TB })).konto.acc.links.find((l) => l.id === imp.eingang.id);
  ok(imp.eingang.ok && impL.aufmass.windows[0].name === 'Flur' && !impL.aufmass.windows[0].bilder && Array.isArray(impL.aufmass.fotosDa) && !impL.aufmass.fotosDa.length, 'Code ohne Link: übernommen ohne Kennungen von Fotos');

  // b) Löschfristen: nie gesendet mit dem Zwischenstand, eingegangen 12 Monate nach dem Eingang
  const pr2 = await rufe('/api/konto/projekte', { token: TB, body: { kunde: 'Familie Nie', kontakt: '', plan: ['Fenster'], days: 14 } }), code2 = pr2.konto.acc.links.find((l) => l.id === pr2.id).code;
  const h5 = await hoch(code2, id(5), jpegs[0]), j19 = Date.now();
  const zw2 = await rufe('/api/link/' + code2 + '/entwurf', { body: { windows: [Object.assign({}, fenster, { wid: 'w19n' + stempel, t0: j19, aend: 0, ts: j19, bilder: { in: id(5) } })], proj: {}, stand: j19, projTs: j19, angelegt: 1, bekannt: [], geloescht: {} } });
  await rufe('/api/konto/projekte/' + pr2.id, { method: 'PATCH', token: TB, body: { deaktivieren: true } });
  await sp.betriebAendern(rowB.id, (a) => { a.links.find((l) => l.code === code2).deaktiviertAm = Date.now() - 31 * TAG; });
  const auf1 = await ze.aufraeumen(k19, sp);
  ok(h5.ok && zw2.ok && !ordner('link/' + code2 + '/') && ordner('link/' + code + '/') === [id(1), id(2)].sort().join(','), 'Nie gesendet: die Fotos gehen 30 Tage nach dem Deaktivieren mit dem Inhalt des Zwischenstands; die eines eingegangenen Aufmaßes bleiben');
  await sp.betriebAendern(rowB.id, (a) => { a.links.find((l) => l.code === code).eingegangenAt = Date.now() - 366 * TAG; });
  const auf2 = await ze.aufraeumen(k19, sp);
  const nachJahr = (await rufe('/api/konto', { token: TB })).konto.acc.links.find((l) => l.code === code), gJahr = await holen(code, id(1), TB), gJahrT = await gJahr.json().catch(() => ({}));
  ok(auf1.ok !== undefined && auf2.fotos >= 1 && nachJahr.fotosGeloescht > 0 && nachJahr.aufmass.windows.length === 1 && !ordner('link/' + code + '/') && gJahr.status === 410 && /12 Monate/.test(gJahrT.fehler || ''), '12 Monate nach dem Eingang: Fotos gelöscht, das Aufmaß bleibt, der Betrieb erfährt es (410)');

  // c) Konto des Hauseigentümers: eigener Ordner, nur der Besitzer, Überholtes und Gelöschtes geht weg
  const TH = tok('haus19-' + stempel + '@beispiel.de'), TH2 = tok('haus19b-' + stempel + '@beispiel.de'), KH = 'p19a' + stempel, nH = await auth.nutzer(k19, TH), t0 = Date.now();
  const hk = (t, kn, i, bild) => rufe('/api/kunde/aufmass/' + kn + '/foto/' + i, { token: t, body: { bild: bild } });
  const gk = (t, kn, i) => rufe('/api/kunde/aufmass/' + kn + '/foto/' + i, { token: t, roh: true });
  const fwH = (bilder, ts) => ({ wid: 'h19' + stempel, t0: t0, aend: 0, ts: ts, name: 'Küche', art: 'fenster', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, fotos: 2, bilder: bilder });
  const sichernH = (kn, w, stand) => rufe('/api/kunde/aufmass/' + kn, { token: TH, body: { windows: [w], proj: { name: 'Haus' }, projTs: t0, stand: stand, angelegt: 1, bekannt: [w.wid], geloescht: {} } });
  const eig = (kn) => ordner('konto/' + nH.id + '/' + kn + '/');
  const k1 = await hk(TH, KH, id(6), jpegs[0]), k2 = await hk(TH, KH, id(7), jpegs[1]), s1 = await sichernH(KH, fwH({ in: id(6), out: id(7) }, t0 + 1), t0 + 1);
  const gOwn = await gk(TH, KH, id(6)), gOther = await gk(TH2, KH, id(6)), gNone = await gk('', KH, id(6));
  ok(k1.ok && k2.ok && s1.ok && eig(KH) === [id(6), id(7)].sort().join(',') && gOwn.status === 200 && gOther.status === 404 && gNone.status === 401, 'Konto: Fotos im eigenen Ordner, nur der Besitzer lädt sie (anderes Konto 404, ohne Anmeldung 401)');
  const k3 = await hk(TH, KH, id(8), jpegs[2]), s2 = await sichernH(KH, fwH({ in: id(8), out: id(7) }, t0 + 5000), t0 + 5000); await fertig();
  ok(k3.ok && s2.ok && eig(KH) === [id(7), id(8)].sort().join(','), 'Neu fotografiert und gespeichert: das überholte Foto löscht der Server nach dem Abgleich');
  const del = await rufe('/api/kunde/aufmass/' + KH + '/loeschen', { token: TH, body: {} }), KH2 = 'p19b' + stempel, k4 = await hk(TH, KH2, id(9), jpegs[3]);
  const delK = await rufe('/api/kunde/loeschen', { token: TH, body: {} });
  ok(del.ok && !eig(KH) && k4.ok && delK.ok && !ordner('konto/' + nH.id + '/'), 'Aufmaß löschen nimmt seine Fotos mit, Konto löschen alle, auch die eines nie gesicherten Aufmaßes');
  ok(fo.fotoIds([{ bilder: { in: id(1), out: '../x' } }, { bilder: { in: 'kaputt' } }, null]).size === 1, 'Nur gültige Kennungen zählen (fotoIds)');

  // d) im Browser: Kundenlink, Betriebsbereich, Konto auf zwei Geräten (eigener Testserver mit nachgestellter Datenbank)
  const cp19 = await import('node:child_process'), path19 = await import('node:path'), url19 = await import('node:url');
  const W19 = path19.resolve(path19.dirname(url19.fileURLToPath(import.meta.url)), '..');
  const port19 = 9400 + Math.floor(Math.random() * 80), B19 = 'http://localhost:' + port19;
  const kind19 = cp19.spawn(process.execPath, [path19.join(W19, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port19), KI_ATTRAPPE: '1', DATEN_ATTRAPPE: '1', ZAHLUNG_ATTRAPPE: '1' }), stdio: ['ignore', 'ignore', 'pipe'] });
  kind19.stderr.on('data', (d) => process.stderr.write('  [Server 19] ' + d));
  const aus19 = () => { try { kind19.kill(); } catch (e) { /* schon weg */ } };
  process.on('exit', aus19);
  let bereit19 = false;
  for (let i = 0; i < 60 && !bereit19; i++) { await new Promise((r) => setTimeout(r, 200)); try { bereit19 = !!(await fetch(B19 + '/api/status').then((r) => r.json())).daten; } catch (e) { /* noch nicht */ } }
  ok(bereit19, 'Testserver mit nachgestellter Datenbank und Fotoablage läuft: ' + B19);
  try {
    const api19 = async (p, body, token) => { const init = { method: body ? 'POST' : 'GET', headers: { accept: 'application/json', origin: B19 } }; if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); } if (token) init.headers.authorization = 'Bearer ' + token; const r = await fetch(B19 + p, init); const j = await r.json().catch(() => ({})); return Object.assign({ _status: r.status }, j); };
    const bilderGleich = (b, da) => !!b && [b.in, b.out].sort().join(',') === (da || []).slice().sort().join(',');
    const bis = async (s, fn, ms, arg) => { const ende = Date.now() + (ms || 10000); while (Date.now() < ende) { if (await s.evaluate(fn, arg)) return true; await new Promise((r) => setTimeout(r, 200)); } return false; };
    const jpg = Buffer.from(jpegs[0], 'base64');
    const fotosMachen = async (s) => {
      await s.click('[data-act="new"]'); await s.waitForSelector('.scr[data-screen="start"]'); await s.click('.bb .btn.primary');
      await s.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
      await s.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: jpg });
      if (await s.waitForSelector('.fx-dialog', { timeout: 2500 }).then(() => true, () => false)) await s.click('.fx-ja');
      await s.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(jpegs[1], 'base64') });
      await bis(s, async () => { const b = S.win.bilder || {}; return !!(b.in && b.out && (await Fotos.holen(b.in)) && (await Fotos.holen(b.out))); }, 8000); // verkleinert und auf dem Gerät abgelegt
    };
    const speichern = (s, name) => s.evaluate((n) => { Object.assign(S.win, { name: n, mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, name);
    const oeffnen = (s, i) => s.evaluate((i) => { const b = document.createElement('button'); b.setAttribute('data-i', String(i)); act('open', b); }, i);
    const mailL = 'foto19l-' + stempel + '@beispiel.de', TL = tok(mailL);
    const regL = await api19('/api/konto/registrieren', { firma: 'Fensterbau Lichtblick ' + stempel, ap: 'Lea Licht', tel: '0221 63' + String(Date.now()).slice(-5), plz: '50670', col: '#1f5fa8', agb: RECHT.NB_STAND, unternehmer: true }, TL);
    const prL = await api19('/api/konto/projekte', { kunde: 'Familie Sonnig', kontakt: '', plan: ['Fenster'], days: 14 }, TL), linkL = prL.konto.acc.links.find((l) => l.id === prL.id);
    const c1 = await browser.newContext(telefon), s1b = await neueSeite(c1, B19);
    await s1b.goto(B19 + '/app/#k-' + linkL.code, { waitUntil: 'networkidle' }); await s1b.waitForTimeout(500);
    await fotosMachen(s1b);
    const vorSpeichern = await s1b.evaluate(async () => ({ offen: await fotosOffen(), lokal: ((await Fotos.alle()) || []).length }));
    await speichern(s1b, 'Wohnzimmer');
    const oben = await bis(s1b, async () => !!S.windows[0] && bilderVon(S.windows[0]).length === 2 && (await fotosOffen()) === 0, 10000);
    ok(regL.ok && vorSpeichern.lokal === 2 && oben, 'Kundenlink: Fotos liegen verkleinert auf dem Gerät (IndexedDB) und gehen mit dem gespeicherten Fenster zum Server');
    await s1b.reload({ waitUntil: 'networkidle' }); await s1b.waitForTimeout(400);
    await oeffnen(s1b, 0);
    const zurueck = await bis(s1b, () => !!(S.photos.in && /^blob:/.test(S.photos.in.url) && S.photos.out && /^blob:/.test(S.photos.out.url)), 5000);
    await s1b.evaluate(() => go('fotos')); await s1b.waitForTimeout(300);
    const kacheln = await s1b.evaluate(() => Array.from(document.querySelectorAll('.tile img')).filter((i) => /^blob:/.test(i.src) && i.complete && i.naturalWidth > 0).length);
    ok(zurueck && kacheln === 2, 'Nach dem Neuladen: das gespeicherte Fenster zeigt seine Fotos wieder (vom Gerät)');
    await s1b.evaluate(() => { go('blatt'); }); await s1b.waitForTimeout(200);
    await s1b.evaluate(() => { act('send', document.body); });
    await s1b.waitForFunction(() => S.sent && S.sent.uebertragen, null, { timeout: 20000 });
    const linkB = (await api19('/api/konto', null, TL)).konto.acc.links.find((l) => l.code === linkL.code);
    ok(linkB.status === 'eingegangen' && (linkB.aufmass.fotosDa || []).length === 2 && bilderGleich(linkB.aufmass.windows[0].bilder, linkB.aufmass.fotosDa), 'Gesendet: beide Fotos sind beim Betrieb angekommen');
    sauber(s1b, 'Kundenlink mit Fotos ohne Fehler'); await c1.close();
    /* Betriebsbereich: klein beim Aufklappen, groß im Blatt, im PDF */
    const c2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' }), s2b = await neueSeite(c2, B19);
    await s2b.goto(B19 + '/', { waitUntil: 'networkidle' });
    await s2b.evaluate((x) => localStorage.setItem('aufmass.sitzung', JSON.stringify(x)), { token: TL, refresh: 'test-refresh', mail: mailL });
    await s2b.reload({ waitUntil: 'networkidle' }); await s2b.waitForTimeout(500);
    await s2b.evaluate((lid) => go('link', lid), linkB.id); await s2b.waitForTimeout(400);
    const zu = await s2b.evaluate(() => ({ kacheln: document.querySelectorAll('.posc .pfoto').length, geladen: document.querySelectorAll('.pfoto img[src]').length }));
    await s2b.click('.poslist details summary');
    const klein = await bis(s2b, () => document.querySelectorAll('.pfoto img[src^="blob:"]').length === 2 && Array.from(document.querySelectorAll('.pfoto img')).every((i) => i.complete && i.naturalWidth > 0), 8000);
    const masse = await s2b.evaluate(() => Array.from(document.querySelectorAll('.pfoto')).map((b) => { const r = b.getBoundingClientRect(), t = b.querySelector('.pf-tag'); return { h: r.height, w: r.width, schrift: t ? parseFloat(getComputedStyle(t).fontSize) : 0, text: t ? t.textContent : '' }; }));
    await foto(s2b, 'betrieb-fotos');
    await s2b.click('.pfoto');
    const gross = await bis(s2b, () => { const i = document.querySelector('.sheet .foto-gross img'); return !!(i && /^blob:/.test(i.src) && i.naturalWidth > 0); }, 5000);
    const blatt = await s2b.evaluate(() => ({ titel: (document.querySelector('.sheet h3') || {}).textContent || '', text: (document.querySelector('.sheet') || {}).textContent || '' }));
    await foto(s2b, 'betrieb-foto-gross');
    ok(zu.kacheln === 2 && zu.geladen === 0 && klein && masse.every((m) => m.h >= 44 && m.w >= 44 && m.schrift >= 13) && masse.map((m) => m.text).join(',') === 'Von innen,Von außen', 'Betriebsbereich: zwei Fotos je Position, geladen erst beim Aufklappen; Felder mindestens 44 px, Beschriftung 13 px');
    ok(gross && blatt.titel === 'Von innen' && /12 Monate/.test(blatt.text), 'Antippen zeigt das Foto groß, mit Hinweis auf die 12 Monate');
    const pdf = await s2b.evaluate(async (lid) => { const l = A().links.find((x) => x.id === lid); await window.Blatt.schrift(); const f = await amFotos(l), mit = amPDF(l, f), ohne = amPDF(l, {}); const zahl = async (b) => ((await b.text()).match(/\/Subtype \/Image/g) || []).length; return { n: Object.keys(f).length, mit: await zahl(mit), ohne: await zahl(ohne), breit: Math.max.apply(null, Object.values(f).map((x) => Math.max(x.w, x.h))) }; }, linkB.id);
    ok(pdf.n === 2 && pdf.mit === pdf.ohne + 2 && pdf.breit <= 960, 'PDF des Betriebs: beide Fotos stehen darin, fürs PDF verkleinert (längste Kante höchstens 960 px)');
    sauber(s2b, 'Betriebsbereich mit Fotos ohne Fehler'); await c2.close();
    /* Konto: zwei Geräte; das zweite holt die Fotos aus dem Konto; neu fotografiert löscht das alte; abmelden räumt das Gerät */
    const mailH = 'foto19h-' + stempel + '@beispiel.de', THb = tok(mailH), sitzH = { token: THb, refresh: 'test-refresh', mail: mailH };
    const c3 = await browser.newContext(telefon), s3b = await neueSeite(c3, B19);
    await s3b.goto(B19 + '/app/', { waitUntil: 'networkidle' }); await s3b.evaluate((x) => localStorage.setItem('aufmass.kunde', JSON.stringify(x)), sitzH);
    await s3b.reload({ waitUntil: 'networkidle' }); await s3b.waitForTimeout(500);
    await fotosMachen(s3b); await speichern(s3b, 'Küche');
    const imKonto = await bis(s3b, async () => !!KS && S.sync.ok && !S.sync.offen && !!S.windows[0] && bilderVon(S.windows[0]).length === 2 && (await fotosOffen()) === 0, 15000);
    const kennH = await s3b.evaluate(() => S.kauf.kennung), idsH = await s3b.evaluate(() => bilderVon(S.windows[0]));
    const gKonto = await fetch(B19 + '/api/kunde/aufmass/' + kennH + '/foto/' + idsH[0], { headers: { authorization: 'Bearer ' + THb } });
    const codeOhne = await s3b.evaluate(() => { const o = unpackProject(packProject(S.windows, S.proj, null)); const m = unpackProject(packProject(S.windows, S.proj, { code: 'abcdefghij' })); return { ohne: !o.w[0].bilder, mit: !!(m.w[0].bilder && m.w[0].bilder.in) }; });
    ok(imKonto && gKonto.status === 200 && codeOhne.ohne && codeOhne.mit, 'Mit Konto: die Fotos des gespeicherten Fensters liegen im Konto; der Aufmaß-Code ohne Link nennt keine Fotos');
    const c4 = await browser.newContext(telefon), s4b = await neueSeite(c4, B19);
    await s4b.goto(B19 + '/app/', { waitUntil: 'networkidle' }); await s4b.evaluate((x) => localStorage.setItem('aufmass.kunde', JSON.stringify(x)), sitzH);
    await s4b.reload({ waitUntil: 'networkidle' });
    await bis(s4b, () => S.windows.length === 1, 10000);
    await oeffnen(s4b, 0);
    const ausKonto = await bis(s4b, () => !!(S.photos.in && /^blob:/.test(S.photos.in.url) && S.photos.out), 8000);
    const blattH = await s4b.evaluate(async () => Object.keys(await fotosFuerBlatt(S.windows)).length);
    ok(ausKonto && blattH === 2, 'Zweites Gerät: die Fotos kommen aus dem Konto in die Kacheln und ins Aufmaßblatt');
    await s4b.evaluate(async (b64) => { const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); await onPhoto('in', new File([u], 'neu.jpg', { type: 'image/jpeg' })); }, jpegs[2]);
    await bis(s4b, async () => (await Fotos.holen(S.win.bilder.in)) !== null, 5000);
    await speichern(s4b, 'Küche');
    const neuOben = await bis(s4b, async () => S.sync.ok && !S.sync.offen && S.windows[0].bilder.in !== undefined && (await fotosOffen()) === 0, 15000);
    const neuId = await s4b.evaluate(() => S.windows[0].bilder.in);
    let altWeg = 0; for (let i = 0; i < 20 && altWeg !== 404; i++) { altWeg = (await fetch(B19 + '/api/kunde/aufmass/' + kennH + '/foto/' + idsH[0], { headers: { authorization: 'Bearer ' + THb } })).status; if (altWeg !== 404) await new Promise((r) => setTimeout(r, 200)); }
    const neuDa = (await fetch(B19 + '/api/kunde/aufmass/' + kennH + '/foto/' + neuId, { headers: { authorization: 'Bearer ' + THb } })).status;
    ok(neuOben && neuId !== idsH[0] && altWeg === 404 && neuDa === 200, 'Neu fotografiert auf dem zweiten Gerät: das neue Foto liegt im Konto, das alte ist gelöscht');
    sauber(s4b, 'Zweites Gerät mit Fotos aus dem Konto ohne Fehler'); await c4.close();
    await s3b.evaluate(() => kontoAbmelden());
    const geraeumt = await bis(s3b, async (ids) => !KS && !((await Fotos.alle()) || []).some((x) => ids.includes(x)), 8000, idsH);
    ok(geraeumt, 'Abmelden nimmt die Fotos, die im Konto liegen, auch vom Gerät');
    sauber(s3b, 'Konto mit Fotos ohne Fehler'); await c3.close();
  } finally { aus19(); }
}

await browser.close();
console.log(fehlerZahl ? '\n' + fehlerZahl + ' Prüfung(en) fehlgeschlagen.' : '\nAlle Prüfungen bestanden.');
process.exit(fehlerZahl ? 1 : 0);

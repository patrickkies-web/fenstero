// eeziframes · Prüfabschnitt 30: Ende zu Ende je Paket (Integrator, Bauplan §3 I; docs/INSTANZEN.md). Eigener Testserver mit allen
// Attrappen (Daten, Mail, KI, Zahlung) und PAKETE_OFFEN=1, ohne die Standard-Instanzen: Die Zentrale legt essential.localhost,
// plus.localhost und signature.localhost selbst an. Chromium auf http://<host>:PORT, API mit Kopfzeile Host.
// Je Paket: Verkaufsseite → Bestellformular im Kundenkonto (Einrichtung bezahlt, Attrappe) → Zentrale im Browser: Einrichtung, Instanz,
// Domain, Gestaltung aus der Bestellung (Plus, Signature), Bestätigungslinks aus den Mails, Testanfrage zugestellt, Vorschau → Vorschau
// in der App und Freigabe im Kundenkonto → Live, Abo läuft → der Hausbesitzer plant auf dem Telefon (Fotos mit KI-Attrappe, RAL-Farbe
// aus dem Farbblatt, Notiz) und sendet → Bestätigung und PDF-Kopie → Mail an den Betrieb mit PDF (Anhang, Antwort an den Kunden,
// Kennzeichnung je Paket in Mail, Absender und PDF). Signature dazu: Dashboard-Anmeldung per Code, Einladungslink auf der eigenen
// Domain, Status Eingeladen → In Bearbeitung → Eingereicht. Danach für alle drei: Zahlungsausfall → Kulanz (noch online) → pausiert
// (503 mit Kontakt) → nach 60 Tagen Pause beendet (410) → 30 Tage später gelöscht (Uhr über JETZT, täglicher Lauf).
// Wo das Paket eeziframes verbietet, steht es nirgends: Seitenquelltext, Titel, Icons, /config.js, Rechtsseiten, Mail, PDF (Text und
// Eigenschaften). Bildschirmfotos (Telefon und 1280) mit BILDER30=<Ordner> (sonst BILDER): Verkaufsseite, Bestellformular, Kundenkonto,
// Zentrale, Startansicht und Bestätigung je Paket, PDF Seite 1 je Paket (pdftoppm), Mail an den Betrieb, Signature-Dashboard.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import net from 'node:net';
import { werkzeug } from './23.mjs';
import { testserver } from './hilfe.mjs';

export const titel = 'Ende zu Ende (Instanzen)';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const freierPort = () => new Promise((ja, nein) => { const s = net.createServer(); s.unref(); s.on('error', nein); s.listen(0, () => { const p = s.address().port; s.close(() => ja(p)); }); });
const BILDER = process.env.BILDER30 || process.env.BILDER || '';
const ORDNER = fs.mkdtempSync(path.join(os.tmpdir(), 'eezi-30-'));
const D1280 = { viewport: { width: 1280, height: 900 }, locale: 'de-DE' };
const MO = { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 };
const NOTIZ = 'Der Rollladen links klemmt seit dem Winter.';
const an = (m) => (Array.isArray(m.an) ? m.an : [m.an]);

/* PDF: Text (pdftotext), Eigenschaften (pdfinfo), Seite 1 als Bild (pdftoppm) */
const pdfDatei = (buf) => { const f = path.join(ORDNER, crypto.randomUUID() + '.pdf'); fs.writeFileSync(f, buf); return f; };
const pdfText = (buf) => { try { return cp.execFileSync('pdftotext', ['-layout', pdfDatei(buf), '-']).toString('utf8'); } catch (e) { return ''; } };
const pdfInfo = (buf) => { try { return cp.execFileSync('pdfinfo', [pdfDatei(buf)]).toString('utf8'); } catch (e) { return ''; } };
function pdfSeite1(buf, name) {
  if (!BILDER) return;
  fs.mkdirSync(BILDER, { recursive: true });
  try { cp.execFileSync('pdftoppm', ['-png', '-r', '90', '-f', '1', '-l', '1', '-singlefile', pdfDatei(buf), path.join(BILDER, '30-' + name)]); } catch (e) { /* ohne Bild */ }
}

export default async (h) => {
  const ok = (b, t) => h.ok(b, '30 ' + t), eezi = /eeziframes/i;
  const pruefe = (b, t, detail) => ok(b, t + (b || !detail ? '' : ' ' + JSON.stringify(detail()))); // Einzelheiten nur, wenn es schiefgeht
  const offen = [];
  await import(new URL('../../web/assets/pakete.js', import.meta.url).href);
  const Pk = globalThis.Pakete;
  const umg = await import(new URL('../../functions/api/umgebung.js', import.meta.url).href), WEBHOOK = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
  const { CRON_TAEGLICH } = await import(new URL('../../functions/api/router.js', import.meta.url).href);
  let X = null;
  /* Bildschirmfoto; ganze Seite von oben (sonst steht ein mitlaufender Kopf mitten im Bild) */
  const bild = async (s, name, o) => {
    if (!BILDER) return;
    fs.mkdirSync(BILDER, { recursive: true });
    const toast = await s.evaluate(() => { const l = document.querySelectorAll('#z-toast.an, #p-toast.an'); l.forEach((e) => e.classList.remove('an')); return l.length; }).catch(() => 0); // Rückmeldungen von eben nicht im Bild
    const ganz = !!(o && o.ganz), y = ganz ? await s.evaluate(() => { const y0 = window.scrollY; window.scrollTo(0, 0); return y0; }).catch(() => 0) : 0;
    if (ganz || toast) await s.waitForTimeout(toast ? 400 : 150);
    await s.screenshot({ path: path.join(BILDER, '30-' + name + '.png'), fullPage: ganz, scale: o && o.css ? 'css' : 'device' }).catch(() => false);
    if (ganz && y) await s.evaluate((y0) => window.scrollTo(0, y0), y).catch(() => false);
  };
  let netz = 20;
  const kontext = async (o) => { const c = await h.browser.newContext(Object.assign({ acceptDownloads: true, locale: 'de-DE', extraHTTPHeaders: { 'x-forwarded-for': '198.18.30.' + (++netz) } }, o || {})); offen.push(c); return c; };
  const bis = async (s, fn, ms, arg) => { const ende = Date.now() + (ms || 10000); while (Date.now() < ende) { if (await s.evaluate(fn, arg).catch(() => false)) return true; await warte(200); } return false; };
  const warteText = (s, re, ms) => s.waitForFunction((q) => new RegExp(q).test(document.body.innerText), re.source, { timeout: ms || 15000 });
  const linkAus = (html, re) => { const m = re.exec(html || ''); return m ? new URL(m[1].replace(/&amp;/g, '&')) : null; };
  try {
    X = await testserver({ PAKETE_OFFEN: '1', MAIL_KONTAKT: 'inhaber@eezi30.example' }, freierPort);
    const T = werkzeug(h, X), B = X.base('localhost'), HB = h.base('localhost');
    const stempel = Date.now().toString(36).slice(-5);
    const attrappe = () => X.attrappe();
    const bestellungVon = async (bid) => ((await attrappe()).bestellungen || []).find((b) => b.id === bid) || null;
    const instanzVon = async (iid) => ((await attrappe()).instanzen || []).find((i) => i.id === iid) || null;
    const zugestellt = async (code) => {
      const z = await T.warteZeile(code, (x) => !!(x.versand || {}).id, 10000);
      if (!z || !z.versand.id) return false;
      const body = JSON.stringify({ type: 'email.delivered', data: { email_id: z.versand.id } }), id = 'msg_' + crypto.randomUUID(), ts = String(Math.floor(Date.now() / 1000));
      const r = await X.api('localhost', '/api/post/webhook', { body: body, headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': 'v1,' + crypto.createHmac('sha256', Buffer.from(WEBHOOK.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64') } });
      return r.status === 200;
    };

    /* Bilder für Logo, Firmenfoto und Fensterfotos (Leinwand im Browser) */
    const sBild = await h.browser.newPage();
    const zeichne = (o) => sBild.evaluate((o) => {
      const c = document.createElement('canvas'); c.width = o.w; c.height = o.h; const g = c.getContext('2d');
      g.fillStyle = o.grund; g.fillRect(0, 0, o.w, o.h);
      if (o.zeichen) { g.fillStyle = o.zeichen; g.beginPath(); g.arc(o.h / 2, o.h / 2, o.h * 0.34, 0, 7); g.fill(); }
      if (o.fenster) { g.fillStyle = '#f4f1ea'; g.fillRect(o.w * 0.2, o.h * 0.12, o.w * 0.6, o.h * 0.76); g.fillStyle = '#9fb7c9'; g.fillRect(o.w * 0.24, o.h * 0.16, o.w * 0.24, o.h * 0.68); g.fillRect(o.w * 0.52, o.h * 0.16, o.w * 0.24, o.h * 0.68); }
      if (o.text) { g.fillStyle = o.farbe || '#161616'; g.font = 'bold ' + o.groesse + 'px sans-serif'; g.fillText(o.text, o.x, o.y); }
      return c.toDataURL(o.typ || 'image/png', 0.85).split(',')[1];
    }, o).then((b64) => Buffer.from(b64, 'base64'));
    const FENSTER_IN = await zeichne({ w: 900, h: 1200, grund: '#d9d2c5', fenster: true, typ: 'image/jpeg' });
    const FENSTER_AUS = await zeichne({ w: 900, h: 1200, grund: '#c9b8a6', fenster: true, typ: 'image/jpeg' });

    const PAKETE = [
      { p: 'essential', host: 'essential.localhost', firma: 'Fensterbau Amsel GmbH', name: 'Fensterbau Amsel', ap: 'Anna Amsel', tel: '0221 300100', plz: '50667', ort: 'Köln', geraet: 'telefon', kunde: { name: 'Familie Birke', tel: '0171 3001001', mail: 'birke30@beispiel.de', erreich: 'vm' } },
      { p: 'plus', host: 'plus.localhost', firma: 'Glaserei Fink GmbH', name: 'Glaserei Fink', ap: 'Paul Fink', tel: '0221 300200', plz: '50823', ort: 'Köln', geraet: '1280', farbe: '#2f6f4f', titel: 'Neue Fenster von Glaserei Fink', gruss: 'Planen Sie in Ruhe, wir melden uns mit dem Angebot.', kunde: { name: 'Familie Linde', tel: '0171 3002002', mail: 'linde30@beispiel.de', erreich: 'nm' } },
      { p: 'signature', host: 'signature.localhost', firma: 'Fensterwerk Specht GmbH', name: 'Fensterwerk Specht', ap: 'Sara Specht', tel: '0211 300300', plz: '40210', ort: 'Düsseldorf', geraet: '1280', farbe: '#e9b44c', titel: 'Fenster planen mit Fensterwerk Specht', gruss: 'Willkommen im Fensterplaner von Specht.', kunde: { name: 'Familie Eiche', tel: '0171 3003003', mail: 'eiche30@beispiel.de', erreich: 'ab' } }
    ];
    for (const P of PAKETE) {
      P.mail = 'inhaber-' + P.p + '-' + stempel + '@fenster30.example'; P.ein = 'anfragen-' + stempel + '@' + P.p + '30.example';
      P.domain = P.name.toLowerCase().replace(/[^a-z]+/g, '-') + '.de'; P.m = Pk.merkmale(P.p); P.basis = X.base(P.host);
      if (P.m.dashboard) P.team = 'team-' + stempel + '@' + P.p + '30.example';
      if (P.m.logo) {
        P.logo = await zeichne({ w: 480, h: 160, grund: '#ffffff', zeichen: P.farbe, text: P.name.split(' ').pop(), groesse: 64, x: 170, y: 104 });
        P.foto = await zeichne({ w: 1600, h: 900, grund: P.p === 'plus' ? '#cfd8dc' : '#e8dcc8', text: 'Werkstatt ' + P.name.split(' ').pop(), groesse: 110, x: 260, y: 500, farbe: '#334455', typ: 'image/jpeg' });
      }
    }
    await sBild.close();

    /* ---------- Verkaufsseite auf eeziframes.com, wie sie ohne PAKETE_OFFEN steht (Telefon und 1280) ---------- */
    for (const [opt, nm] of [[h.telefon, 'telefon'], [D1280, '1280']]) {
      const c = await kontext(opt), s = await h.neueSeite(c, HB);
      await s.goto(HB + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
      const v = await s.evaluate(() => ({ text: document.body.innerText, kasse: document.querySelectorAll('a[href^="/partner/#bestellen/"]').length, quer: document.documentElement.scrollWidth > window.innerWidth + 1 }));
      await bild(s, '01-verkaufsseite-' + nm, { ganz: true });
      ok(/Vorläufige Preise/i.test(v.text) && /Bestellung wird in Kürze freigeschaltet/i.test(v.text) && v.kasse === 0 && !v.quer, 'Verkaufsseite ohne PAKETE_OFFEN (' + nm + '): „Vorläufige Preise“, „Bestellung wird in Kürze freigeschaltet“, kein Weg in die Kasse, kein waagrechter Scroll');
      h.sauber(s, 'Verkaufsseite (' + nm + ') ohne Fehler');
    }

    /* ---------- 1. Der Fensteranbieter bestellt im Browser (Essential am Telefon, Plus und Signature am Schreibtisch) ---------- */
    for (const P of PAKETE) {
      const ctx = await kontext(P.geraet === 'telefon' ? h.telefon : D1280), s = await h.neueSeite(ctx, B);
      P.ctxK = ctx; P.sK = s;
      await s.goto(B + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
      if (P.p === 'plus') await bild(s, '02-verkaufsseite-offen-1280');
      /* Seite für Fensterbauer (Design-DNA): „… bestellen“ unten in der Karte des Pakets */
      await s.click('#paket-' + P.p + ' a[href="/partner/#bestellen/' + P.p + '"]');
      await s.waitForSelector('.p-paket[aria-pressed="true"]');
      const gewaehlt = await s.getAttribute('.p-paket[aria-pressed="true"]', 'data-v');
      await bild(s, '03-bestellformular-' + P.p + '-paket-' + P.geraet);
      await s.click('[data-a="weiter"]');
      await s.fill('#f-mail', P.mail); await s.keyboard.press('Enter');
      await s.waitForSelector('#f-code'); await s.fill('#f-code', '123456'); await s.click('[data-a="code-pruefen"]');
      await s.waitForSelector('[data-form="firma"]');
      const fuelle = async (id, v) => s.fill('#' + id, v);
      await fuelle('f-firma-firma', P.firma); await fuelle('f-firma-rechtsform', 'GmbH'); await s.selectOption('#f-firma-bundesland', 'NW');
      await fuelle('f-firma-strasse', 'Werkstraße ' + (PAKETE.indexOf(P) + 1)); await fuelle('f-firma-plz', P.plz); await fuelle('f-firma-ort', P.ort);
      await fuelle('f-firma-ust', 'DE12345678' + (PAKETE.indexOf(P) + 1)); await fuelle('f-firma-ap', P.ap); await fuelle('f-firma-tel', P.tel);
      await s.click('#f-erreichbar-tage'); await s.click('#f-tag-di'); await s.click('#f-tag-mi');
      await s.selectOption('#f-firma-erreichbar-von', '08:00'); await s.selectOption('#f-firma-erreichbar-bis', '17:00');
      await fuelle('f-firma-vertretung', P.ap + ' (Geschäftsführung)'); await fuelle('f-firma-register', 'Amtsgericht Köln, HRB 30' + (PAKETE.indexOf(P) + 1));
      if (P.p !== 'essential') await bild(s, '03-bestellformular-' + P.p + '-firma-' + P.geraet, { ganz: true });
      await s.click('[data-a="weiter"]'); await s.waitForSelector('[data-form="konfigurator"]');
      await fuelle('f-konfigurator-name', P.name); await fuelle('f-konfigurator-domains-0', P.domain); await fuelle('f-konfigurator-eingang-0', P.ein);
      if (P.team) await fuelle('f-konfigurator-zugang-0', P.team);
      await bild(s, '03-bestellformular-' + P.p + '-konfigurator-' + P.geraet, { ganz: true });
      await s.click('[data-a="weiter"]');
      if (P.m.logo) {
        await s.waitForSelector('[data-form="gestaltung"]');
        await s.setInputFiles('input[data-datei="logo"]', { name: 'logo.png', mimeType: 'image/png', buffer: P.logo });
        await bis(s, () => document.querySelectorAll('.p-datei').length >= 1, 10000);
        await s.setInputFiles('input[data-datei="foto"]', [{ name: 'werkstatt.jpg', mimeType: 'image/jpeg', buffer: P.foto }]);
        await bis(s, () => document.querySelectorAll('.p-datei').length >= 2, 10000);
        await fuelle('f-gestaltung-farben-0', P.farbe); await fuelle('f-gestaltung-titel', P.titel); await fuelle('f-gestaltung-begruessung', P.gruss);
        await bild(s, '03-bestellformular-' + P.p + '-gestaltung-' + P.geraet, { ganz: true });
        await s.click('[data-a="weiter"]');
      }
      await s.waitForSelector('[data-form="pruefen"]');
      const zus = await s.textContent('main');
      await bild(s, '03-bestellformular-' + P.p + '-pruefen-' + P.geraet, { ganz: true });
      for (const id of ['f-zustimmung-unternehmer', 'f-zustimmung-agb', 'f-zustimmung-avv']) { await s.focus('#' + id); await s.keyboard.press('Space'); }
      await Promise.all([s.waitForURL(/#bestellung\//, { timeout: 15000 }), s.click('[data-a="kasse"]')]);
      await s.waitForSelector('.p-danke');
      const danke = await s.textContent('.p-danke h1');
      await s.click('[data-a="konto"]'); await s.waitForSelector('.p-verlauf');
      const konto = await s.evaluate(() => ({ aktuell: ((document.querySelector('.p-verlauf li[aria-current="step"]') || {}).textContent || '').trim(), hash: location.hash, quer: document.documentElement.scrollWidth > window.innerWidth + 1,
        rueckrufKnoepfe: Array.from(document.querySelectorAll('button, a.btn')).filter((x) => x.innerText.trim() === 'Rückruf anfordern').length }));
      P.bid = konto.hash.replace('#bestellung/', '');
      await bild(s, '04-kundenkonto-bezahlt-' + P.p + '-' + P.geraet, { ganz: true });
      /* Befund 14: die nächste Aktion steht einmal als Hauptknopf, die Rückruf-Karte wiederholt sie nicht */
      ok(konto.rueckrufKnoepfe === 1, P.p + ': Kundenkonto „Bezahlt“ mit genau einem Knopf „Rückruf anfordern“ (gezählt: ' + konto.rueckrufKnoepfe + ')');
      const b = await bestellungVon(P.bid), preis = Pk.preis(P.p);
      const bOk = { paket: gewaehlt === P.p, domain: zus.includes(P.domain), preis: new RegExp('(^|\\D)' + preis.einrichtung + '\\s?€').test(zus), danke: /bezahlt/.test(danke), leiste: /Bezahlt/.test(konto.aktuell), quer: !konto.quer, status: !!b && b.status === 'bezahlt' && b.paket_bestellt === P.p, eingang: !!b && ((b.wunsch.konfigurator || {}).eingang || [])[0] === P.ein };
      ok(Object.values(bOk).every(Boolean),
        P.p + ': Verkaufsseite → Bestellformular (' + P.geraet + ') → Kasse (Attrappe) → Kundenkonto mit Statusleiste auf „Bezahlt“ (' + (b ? b.nr : '–') + ', Einrichtung ' + preis.einrichtung + ' €)' +
        (Object.values(bOk).every(Boolean) ? '' : ' ' + JSON.stringify({ bOk, danke, konto, wunsch: b && b.wunsch, zus: zus.replace(/\s+/g, ' ').slice(0, 600) })));
      h.sauber(s, P.p + ': Bestellung im Browser ohne Fehler');
    }

    /* ---------- 2. Der Inhaber richtet in der Zentrale ein (Browser, 1280) ---------- */
    const ctxZ = await kontext(D1280), sZ = await h.neueSeite(ctxZ, B);
    await sZ.goto(B + '/zentrale/#bestellungen', { waitUntil: 'networkidle' });
    await sZ.fill('#z-pw', h.PASSWORT); await sZ.click('form[data-form="anmelden"] button[type="submit"]');
    await sZ.waitForSelector('.z-tab tbody tr');
    await bild(sZ, '05-zentrale-bestellungen-1280');
    const schritt = (s) => s.evaluate(() => { const b = document.querySelector('.z-schritt [data-act="schritt"].btn.primary'); return b ? b.getAttribute('data-v') : ''; });
    for (const P of PAKETE) {
      await sZ.goto(B + '/zentrale/#bestellung/' + P.bid, { waitUntil: 'networkidle' });
      await sZ.waitForSelector('.z-schritt [data-v="einrichtung"]');
      if (P.p === 'plus') await bild(sZ, '05-zentrale-bestellung-plus-1280', { ganz: true });
      await sZ.click('.z-schritt [data-v="einrichtung"]'); await sZ.waitForSelector('.z-schritt [data-v="instanz"]');
      await sZ.click('.z-schritt [data-v="instanz"]'); await sZ.waitForSelector('.z-schritt [data-v="domain"]');
      await sZ.click('.z-schritt [data-v="domain"]'); await sZ.waitForSelector('#z-host');
      P.iid = await sZ.evaluate(() => location.hash.split('/')[1]);
      await sZ.fill('#z-host', P.host); await sZ.click('form[data-form="i-host"] button[type="submit"]'); await sZ.waitForSelector('[data-act="i-pruefen"]');
      await sZ.click('[data-act="i-pruefen"]'); await warteText(sZ, /geprüft/);
      if (P.p === 'plus') await bild(sZ, '05-zentrale-domain-plus-1280', { ganz: true });
      const vorFreigabe = await X.api(P.host, '/', { headers: { accept: 'text/html' } });
      await sZ.click('.z-reiter a[href$="/start"]'); await sZ.waitForSelector('.z-schritt [data-v="domain-gesichert"]');
      await sZ.click('.z-schritt [data-v="domain-gesichert"]');
      await bis(sZ, () => { const b = document.querySelector('.z-schritt [data-act="schritt"].btn.primary'); return !!b && b.getAttribute('data-v') !== 'domain-gesichert'; }, 10000);
      let naechster = await schritt(sZ), gestaltet = null;
      if (naechster === 'gestaltung') {
        await sZ.click('.z-schritt [data-v="gestaltung"]'); await sZ.waitForSelector('[data-act="i-uebernehmen"][data-art="logo"]');
        await sZ.click('[data-act="i-uebernehmen"][data-art="logo"]'); await sZ.waitForFunction(() => !!document.querySelector('.z-slot-bild.logo img'), null, { timeout: 15000 });
        await sZ.click('[data-act="i-uebernehmen"][data-art="foto"]'); await sZ.waitForFunction(() => document.querySelectorAll('.z-slot-bild:not(.logo) img').length >= 1, null, { timeout: 15000 });
        await sZ.fill('#z-g-kicker', P.name + ' · seit 1987'); await sZ.fill('#z-g-ueber', 'Neue Fenster für Ihr Zuhause'); await sZ.fill('#z-g-text', P.gruss);
        await sZ.click('form[data-form="i-entwurf"] button[type="submit"]');
        await bis(sZ, (k) => { const t = document.querySelector('.z-telefon .ein-start-in > .eyebrow.kicker'); return !!t && t.textContent === k && !!document.querySelector('.z-telefon .ein-bilder img'); }, 15000, P.name + ' · seit 1987');
        await bild(sZ, '05-zentrale-gestaltung-' + P.p + '-1280', { ganz: true });
        await sZ.click('[data-act="i-veroeffentlichen"]'); await warteText(sZ, /Veröffentlicht: Fassung/);
        gestaltet = (await instanzVon(P.iid)) || {};
        await sZ.click('.z-reiter a[href$="/start"]'); await sZ.waitForSelector('.z-schritt');
        naechster = await schritt(sZ);
      }
      /* Bestätigungslinks aus den Mails (Eingangsadresse, bei Signature der Dashboard-Zugang) */
      const post = await X.post();
      const bestE = post.filter((m) => an(m).includes(P.ein) && /bestätigen/i.test(m.betreff || '')).pop();
      const uE = linkAus(bestE && bestE.html, /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/), kE = uE ? await X.api('localhost', uE.pathname + uE.search, { headers: { accept: 'text/html' } }) : { status: 0 };
      let kZ = { status: 200 }, bestZ = null;
      if (P.team) { bestZ = post.filter((m) => an(m).includes(P.team) && /bestätigen/i.test(m.betreff || '')).pop(); const uZ = linkAus(bestZ && bestZ.html, /href="([^"]*\/api\/instanz\/bestaetigen\?t=[^"]+)"/); kZ = uZ ? await X.api('localhost', uZ.pathname + uZ.search, { headers: { accept: 'text/html' } }) : { status: 0 }; }
      /* Testanfrage aus der Zentrale, zugestellt (Resend-Webhook) */
      await sZ.click('.z-reiter a[href$="/betrieb"]'); await sZ.waitForSelector('[data-act="i-test"]');
      await sZ.click('[data-act="i-test"]'); await warteText(sZ, /Testanfrage: /);
      const testZeile = ((await attrappe()).anfragen || []).filter((a) => a.instanz === P.iid && a.art === 'test').pop();
      const testZu = testZeile ? await zugestellt(testZeile.code) : false;
      await sZ.click('.z-reiter a[href$="/start"]'); await sZ.waitForSelector('.z-schritt [data-v="vorschau"]');
      if (P.p === 'plus') await bild(sZ, '05-zentrale-instanz-plus-1280', { ganz: true });
      await sZ.click('.z-schritt [data-v="vorschau"]'); await sZ.waitForSelector('.z-schritt [data-v="live"]');
      const i0 = await instanzVon(P.iid);
      ok(!!P.iid && vorFreigabe.status === 503 && !eezi.test(vorFreigabe.text) && (P.m.logo ? naechster === 'vorschau' && gestaltet && gestaltet.marke && gestaltet.marke.v >= 1 && gestaltet.marke.farbe === P.farbe && (gestaltet.marke.bilder || {}).logo === 'logo.png' : naechster === 'vorschau') &&
        kE.status === 200 && kZ.status === 200 && (!P.team || !!bestZ) && testZu && !!i0 && i0.status === 'einrichtung' && (i0.eingang.mails || []).some((x) => x.mail === P.ein && x.bestaetigt) && (!P.team || (i0.zugang || []).some((z) => z.mail === P.team && z.bestaetigt)),
        P.p + ': Zentrale im Browser: Einrichtung, Instanz, Domain ' + P.host + ' geprüft (vorher 503 neutral), ' + (P.m.logo ? 'Gestaltung aus der Bestellung veröffentlicht (Logo, Foto, Farbe ' + P.farbe + '), ' : '') + 'Empfänger' + (P.team ? ' und Dashboard-Zugang' : '') + ' per Link aus der Mail bestätigt, Testanfrage zugestellt, Vorschau gesendet');

      /* Vorschau in der App (Link aus der Mail an den Partner) und Freigabe im Kundenkonto */
      const vMail = (await X.post()).filter((m) => an(m).includes(P.mail) && /vorschau=/.test(m.html || '')).pop();
      const vLink = linkAus(vMail && vMail.html, /href="([^"]*\?vorschau=[^"]+)"/), bV = await bestellungVon(P.bid);
      const vZiel = vLink || (bV && bV.vorschau && bV.vorschau.link ? new URL(bV.vorschau.link) : null);
      const ctxV = await kontext(h.telefon), sV = await h.neueSeite(ctxV, P.basis);
      await sV.goto(vZiel ? P.basis + vZiel.pathname + vZiel.search : P.basis + '/', { waitUntil: 'networkidle' }); await sV.waitForTimeout(400);
      const vz = await sV.evaluate(() => ({ band: ((document.querySelector('.inst-vorschau') || {}).textContent || '').trim(), url: location.href }));
      await bild(sV, '06-vorschau-' + P.p + '-telefon');
      h.sauber(sV, P.p + ': Vorschau in der App ohne Fehler'); await ctxV.close();
      const sK = P.sK;
      await sK.goto(B + '/partner/#bestellung/' + P.bid, { waitUntil: 'networkidle' }); await sK.reload({ waitUntil: 'networkidle' }); await sK.waitForSelector('[data-a="freigeben"]');
      const kf = await sK.evaluate(() => ({ aktuell: ((document.querySelector('.p-verlauf li[aria-current="step"]') || {}).textContent || '').trim() }));
      await bild(sK, '04-kundenkonto-freigabe-' + P.p + '-' + P.geraet, { ganz: true });
      await sK.click('[data-a="freigeben"]'); await sK.waitForSelector('[data-a="freigeben-ok"]'); await sK.click('[data-a="freigeben-ok"]');
      await warteText(sK, /Danke für Ihre Freigabe/);
      ok(!!vLink && /Vorschau/.test(vz.band) && !/vorschau=/.test(vz.url) && /Zur Freigabe/.test(kf.aktuell), P.p + ': Vorschau-Link aus der Mail öffnet die App mit Band „Vorschau“; im Kundenkonto steht „Zur Freigabe“, der Partner gibt frei' + (vLink ? '' : ' (kein Vorschau-Link in den Mails an ' + P.mail + ')'));

      /* Live schalten: Ampel grün, Abo startet */
      await sZ.reload({ waitUntil: 'networkidle' }); await sZ.waitForSelector('.z-schritt [data-v="live"]');
      const ampel = await sZ.evaluate(() => ({ offen: Array.from(document.querySelectorAll('.z-ampel li.offen')).map((l) => l.textContent.trim()), n: document.querySelectorAll('.z-ampel li').length }));
      await sZ.click('.z-schritt [data-v="live"]'); await sZ.waitForSelector('.z-dialog');
      await sZ.click('.z-dialog button[type="submit"]'); await warteText(sZ, /Live\. Das Abo läuft/);
      const bL = await bestellungVon(P.bid), iL = await instanzVon(P.iid);
      const schnipsel = (await X.post()).some((m) => an(m).includes(P.mail) && (m.html || '').includes(P.host));
      await sK.reload({ waitUntil: 'networkidle' }); await sK.waitForSelector('.p-abo');
      const abo = await sK.evaluate(() => ((document.querySelector('.p-abo .zustand') || {}).textContent || '').trim());
      await bild(sK, '04-kundenkonto-live-' + P.p + '-' + P.geraet, { ganz: true });
      ok(ampel.n >= 6 && !ampel.offen.length && bL.status === 'live' && bL.abo_status === 'aktiv' && /^sub_test_/.test((bL.abo || {}).id || '') && iL.status === 'aktiv' && schnipsel && abo === 'Aktiv',
        P.p + ': Ampel grün (' + ampel.n + ' Punkte), live geschaltet: Abo ' + ((bL.abo || {}).id || '–') + ' läuft, Instanz aktiv, Partner bekommt den Link, Kundenkonto zeigt das Abo „Aktiv“' + (ampel.offen.length ? ' (offen: ' + ampel.offen.join('; ') + ')' : ''));
      h.sauber(sK, P.p + ': Kundenkonto bis Live ohne Fehler');
    }
    h.sauber(sZ, 'Zentrale: Einrichtung aller drei Pakete ohne Fehler');

    /* ---------- 3. Der Hausbesitzer plant auf der Instanz (Telefon 390 × 844) und sendet; der Betrieb bekommt Mail mit PDF ---------- */
    const kontaktSenden = async (s, k) => {
      await s.evaluate(() => go('anfrage')); await s.waitForSelector('.scr[data-screen="anfrage"]');
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage2"]');
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="anfrage3"]');
      await s.fill('#t-name', k.name); if (k.tel) await s.fill('#t-tel', k.tel); if (k.mail) await s.fill('#t-mail', k.mail);
      if (k.erreich) await s.click('[data-act="setp"][data-f="erreich"][data-v="' + k.erreich + '"]');
      await s.click('.bb .btn.primary'); await s.waitForSelector('.scr[data-screen="blatt"]');
      await s.click('.bb .btn.primary');
      await s.waitForFunction(() => S.sent && S.sent.nr, null, { timeout: 30000 }); await s.waitForTimeout(300);
    };
    /* Startansicht, Seitenquelltext, Titel, Icons, /config.js und Rechtsseiten je Paket */
    const quellen = async (P) => {
      const pf = ['/', '/config.js', '/manifest.webmanifest', '/favicon.svg', '/robots.txt', '/impressum/', '/datenschutz/', '/gibt-es-nicht'];
      const out = {};
      for (const p of pf) out[p] = await X.api(P.host, p, { headers: { accept: p.endsWith('/') || p === '/gibt-es-nicht' ? 'text/html' : '*/*' } });
      return out;
    };
    for (const P of PAKETE) {
      const q = await quellen(P);
      const kfg = JSON.parse((/window\.KONFIG = (\{.*\});/.exec(q['/config.js'].text) || [])[1] || '{}');
      P.konfig = kfg;
      /* Startansicht am Schreibtisch nur fürs Bild */
      const ctxD = await kontext(D1280), sD = await h.neueSeite(ctxD, P.basis);
      await sD.goto(P.basis + '/', { waitUntil: 'networkidle' }); await sD.waitForTimeout(400);
      await bild(sD, '07-instanz-' + P.p + '-start-1280', { ganz: true });
      h.sauber(sD, P.p + ': Startansicht am Schreibtisch ohne Fehler'); await ctxD.close();

      const ctxH = await kontext(h.telefon), s = await h.neueSeite(ctxH, P.basis), anfragen = [];
      s.on('request', (r) => anfragen.push({ m: r.method(), u: r.url() }));
      await s.goto(P.basis + '/', { waitUntil: 'networkidle' }); await s.waitForTimeout(400);
      const st = await s.evaluate(() => ({
        titel: document.title, text: document.body.innerText, kz: ((document.querySelector('.ein-kz') || {}).textContent || '').trim(),
        icons: Array.from(document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="manifest"], meta[property="og:image"]')).map((l) => l.getAttribute('href') || l.getAttribute('content')).join(' '),
        kopf: ((document.querySelector('.hdr-inst .hdr-name') || {}).textContent || '').trim(), logo: !!document.querySelector('.hdr-inst img'), quer: document.documentElement.scrollWidth > window.innerWidth + 1
      }));
      await bild(s, '07-instanz-' + P.p + '-start-telefon', { ganz: true });
      /* dazu das Ende der Startseite (Fuß mit Rechtslinks und Kennzeichnung); die App scrollt in einem eigenen Bereich */
      const rollen = (unten) => s.evaluate((u) => { const l = Array.from(document.querySelectorAll('#app, #app *')).filter((e) => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight); const e = l[0] || document.scrollingElement; e.scrollTop = u ? e.scrollHeight : 0; }, unten);
      await rollen(true); await s.waitForTimeout(300);
      await bild(s, '07-instanz-' + P.p + '-start-telefon-ende');
      await rollen(false);
      /* Kennzeichnung je Paket: Essential deutlich (mit Link), Plus dezent im Fuß, Signature nirgends */
      const html = q['/'].text;
      if (P.p === 'essential') ok(/Powered by EEZIframes/.test(st.titel) && st.kz === 'Powered by EEZIframes' && st.kopf === P.name && !st.logo, 'essential: Titel und Fuß „Powered by EEZIframes“, Name als Text im Kopf, kein Logo');
      if (P.p === 'plus') pruefe(!eezi.test(st.titel) && st.kz === 'Konfigurator von eeziframes' && !eezi.test(st.icons) && !eezi.test(html.replace(/Konfigurator von eeziframes/g, '')) && !eezi.test(q['/config.js'].text.replace(/Konfigurator von eeziframes/g, '')) && !eezi.test(q['/manifest.webmanifest'].text + q['/favicon.svg'].text) && st.logo && /^\/marke\/\d+\/logo\.png$/.test(kfg.instanz.logo || ''),
        'plus: eeziframes nur dezent im Fuß der App („Konfigurator von eeziframes“, auch im Seitenquelltext); Titel, Icons, Manifest, Favicon und /config.js ohne eeziframes; Logo aus der Zentrale', () => ({ titel: st.titel, kz: st.kz, icons: st.icons, html: (html.match(/.{0,60}eeziframes.{0,60}/gi) || []).slice(0, 4), config: (q['/config.js'].text.match(/.{0,60}eeziframes.{0,60}/gi) || []).slice(0, 4), logo: st.logo, kl: kfg.instanz && kfg.instanz.logo }));
      if (P.p === 'signature') {
        const fund = Object.keys(q).filter((k) => eezi.test(q[k].text)).map((k) => k + ' „' + (q[k].text.match(/.{0,30}eeziframes.{0,30}/i) || [''])[0] + '“');
        ok(!eezi.test(st.titel + st.text + st.icons) && !st.kz && !fund.length && q['/impressum/'].status === 200 && q['/datenschutz/'].status === 200 && q['/gibt-es-nicht'].status === 404,
          'signature: kein eeziframes in Titel, Text, Icons, Seitenquelltext, /config.js, Manifest, Favicon, robots.txt, Impressum, Datenschutz und 404-Seite' + (fund.length ? ' (' + fund.join('; ') + ')' : ''));
      }
      ok(q['/'].status === 200 && st.titel.includes(P.name) && !st.quer && q['/impressum/'].text.includes(P.firma), P.p + ': Startansicht live auf ' + P.host + ' („' + st.titel + '“), Impressum mit der Firma aus der Bestellung, kein waagrechter Scroll');

      /* Planen: erstes Fenster, Fotos innen und außen mit KI (Attrappe), RAL 7016 aus dem Farbblatt, Notiz an der Farbe */
      await s.click('[data-act="new"]'); await s.waitForSelector('.scr[data-screen="start"]');
      await s.click('.bb .btn.primary');
      await s.waitForSelector('input[data-in="photo"][data-f="in"]', { state: 'attached' });
      await s.setInputFiles('input[data-in="photo"][data-f="in"]', { name: 'innen.jpg', mimeType: 'image/jpeg', buffer: FENSTER_IN });
      const kiFrage = await s.waitForSelector('.fx-dialog', { timeout: 4000 }).then(() => true, () => false);
      const kiText = kiFrage ? await s.evaluate(() => document.querySelector('.fx-dialog').innerText) : '';
      if (kiFrage) await s.click('.fx-ja');
      await s.setInputFiles('input[data-in="photo"][data-f="out"]', { name: 'aussen.jpg', mimeType: 'image/jpeg', buffer: FENSTER_AUS });
      await bis(s, async () => { const b = S.win.bilder || {}; return !!(b.in && b.out && (await Fotos.holen(b.in)) && (await Fotos.holen(b.out))); }, 10000);
      const kiDa = await bis(s, () => !!(S.win.ki && (S.win.ki.chips || []).join(' ').includes('Testantwort')), 20000);
      await s.evaluate((mo) => { Object.assign(S.win, { name: 'Wohnzimmer', mo: mo, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); S.q = 'fa'; S.screen = 'frage'; render(true); }, MO);
      await s.waitForSelector('.fw-mehr [data-farbblatt="fa"]:not([data-familie])');
      await s.click('.fw-mehr [data-farbblatt="fa"]:not([data-familie])'); await s.waitForSelector('#fb-such');
      await s.fill('#fb-such', '7016'); await s.waitForTimeout(250); await s.click('.fb .fb-f[data-v="7016"]'); await s.waitForTimeout(200); await s.click('.fb .fb-fertig');
      await s.click('.qdock .nz-knopf'); await s.waitForSelector('#nz-text'); await s.fill('#nz-text', NOTIZ); await s.click('[data-act="notiz-sichern"]'); await s.waitForTimeout(200);
      const fw = await s.evaluate(() => ({ fa: S.win.fa, notiz: (S.win.notizen || {}).fa || '' }));
      await s.evaluate(() => saveWin()); await s.waitForSelector('.scr[data-screen="fertig"]');
      const fotosOben = await bis(s, async () => !!S.windows[0] && bilderVon(S.windows[0]).length === 2 && (await fotosOffen()) === 0, 20000);
      const code = await s.evaluate(() => S.betrieb.code);
      const kiCode = anfragen.filter((a) => a.m === 'POST' && /\/api\/ki\?/.test(a.u));
      ok(kiFrage && (P.p !== 'signature' || !eezi.test(kiText)) && kiDa && fw.fa === '7016' && fw.notiz === NOTIZ && fotosOben && kiCode.length >= 2 && kiCode.every((a) => a.u.includes('code=' + code)),
        P.p + ': Fenster mit zwei Fotos (KI-Auswertung der Attrappe mit dem Code der Planung' + (P.p === 'signature' ? ', Einwilligung ohne eeziframes' : '') + '), Farbe außen RAL 7016 aus dem Farbblatt, Notiz an der Farbe');
      const kunde = P.kunde;
      await kontaktSenden(s, kunde);
      const best = await s.evaluate(() => ({ nr: S.sent.nr, text: document.querySelector('.scr').innerText, pdf: !!document.querySelector('[data-act="inst-pdf"]') }));
      await s.waitForTimeout(1200); // Haken fertig gezeichnet
      await bild(s, '08-instanz-' + P.p + '-bestaetigung-telefon', { ganz: true });
      await s.setViewportSize({ width: 1280, height: 900 }); await s.waitForTimeout(400);
      await bild(s, '08-instanz-' + P.p + '-bestaetigung-1280', { ganz: true, css: true });
      await s.setViewportSize({ width: 390, height: 844 }); await s.waitForTimeout(200);
      const [dl] = await Promise.all([s.waitForEvent('download', { timeout: 20000 }), s.click('[data-act="inst-pdf"]')]);
      const kopieDatei = path.join(ORDNER, P.p + '-kopie.pdf'); await dl.saveAs(kopieDatei);
      const kopie = fs.readFileSync(kopieDatei), kopieText = pdfText(kopie);
      const kz = { essential: /Anfrage · erstellt mit eeziframes/.test(kopieText), plus: /Erstellt mit eeziframes/.test(kopieText) && !/Anfrage · erstellt mit eeziframes/.test(kopieText), signature: !eezi.test(kopieText + kopie.toString('latin1') + pdfInfo(kopie)) }[P.p];
      ok(/^P-\d{4}-\d{3}$/.test(best.nr) && best.text.includes(best.nr) && best.text.includes(P.name) && best.pdf && kopie.slice(0, 4).toString() === '%PDF' && kopieText.includes(kunde.name) && kz,
        P.p + ': Bestätigung ' + best.nr + ' mit dem Namen des Betriebs; „Meine Anfrage als PDF“ in der Marke, Kennzeichnung ' + P.m.pdfKennzeichnung);
      h.sauber(s, P.p + ': Planen und Senden auf dem Telefon ohne Fehler');
      P.nr = best.nr; P.code = code; P.sH = s; P.ctxH = ctxH;

      /* Mail an den Betrieb: Anhang, Antwort an den Kunden, Absender und Kennzeichnung je Paket, PDF-Text */
      const mB = (await T.warteMail((m) => an(m).includes(P.ein) && (m.betreff || '').includes(kunde.name) && !/^\[Test\]/.test(m.betreff || ''), 20000, { anhaenge: true }))[0];
      const ai = mB ? mB.anhaenge.findIndex((a) => a.typ === 'application/pdf') : -1, pdf = ai >= 0 ? Buffer.from(mB.anhangDaten[ai], 'base64') : Buffer.alloc(0);
      const txt = pdfText(pdf), info = pdfInfo(pdf), kopfZeilen = txt.split('\n').slice(0, 8).join('\n');
      ok(!!mB && ai >= 0 && pdf.slice(0, 5).toString() === '%PDF-' && pdf.length < 7e6 && /^Aufmass-P-\d{4}-\d{3}-.+\.pdf$/.test(mB.anhaenge[ai].name) && mB.antwortAn === kunde.mail && (mB.betreff || '').includes(best.nr) && an(mB).length === 1,
        P.p + ': Mail an die bestätigte Adresse mit „' + (mB ? mB.betreff : '–') + '“, PDF-Anhang ' + (ai >= 0 ? mB.anhaenge[ai].name + ' (' + Math.round(pdf.length / 1024) + ' KB)' : '–') + ', Antwort an den Kunden');
      const pdfTeile = { betrieb: txt.includes(P.name), kunde: txt.includes(kunde.name), ral: /7016|Anthrazitgrau/.test(txt), notiz: txt.includes('Rollladen links klemmt'), ki: /Testantwort/.test(txt), klaerung: /zu klären/i.test(txt) };
      ok(Object.values(pdfTeile).every(Boolean), P.p + ': PDF mit Betrieb, Kunde, RAL 7016, Notiz, KI-Auswertung und Klärungsliste' + (Object.values(pdfTeile).every(Boolean) ? '' : ' ' + JSON.stringify(pdfTeile) + ' ' + JSON.stringify(txt.replace(/\s+/g, ' ').slice(0, 1500))));
      const absName = { essential: 'EEZIframes für ' + P.name, plus: 'Konfigurator ' + P.name, signature: P.name + ' · Fensterplaner' }[P.p];
      const mailText = (mB ? mB.html + ' ' + mB.betreff + ' ' + mB.von.name : '');
      const kzOk = {
        essential: /eeziframes/i.test(mB.html) && /erstellt mit eeziframes|übermittelt mit eeziframes/i.test(kopfZeilen) && (txt.match(/eeziframes/gi) || []).length >= 2,
        plus: /Konfigurator von eeziframes/.test(mB.html) && !eezi.test(mB.html.replace(/Konfigurator von eeziframes|Erfasst mit eeziframes/g, '')) && !eezi.test(mB.betreff + mB.von.name) && !eezi.test(kopfZeilen) && /eeziframes/i.test(txt) && txt.split('\n').filter((z) => eezi.test(z)).every((z) => /mit eeziframes/i.test(z)),
        signature: !eezi.test(mailText) && !eezi.test(txt) && !eezi.test(info) && !eezi.test(pdf.toString('latin1'))
      }[P.p];
      const knopf = P.m.dashboard ? linkAus(mB.html, /href="([^"]*\/betrieb\/#projekt-[^"]+)"/) : linkAus(mB.html, /href="([^"]*\/api\/instanz\/fotos\/[a-z0-9]{10}\?t=[^"]+)"/);
      if (!kzOk) console.log('      Kennzeichnung ' + P.p + ': ' + JSON.stringify({ mail: (mB.html.match(/.{0,60}eeziframes.{0,60}/gi) || []).slice(0, 5), kopf: kopfZeilen, pdf: txt.split('\n').filter((z) => eezi.test(z)).slice(0, 6), info: info.split('\n').filter((z) => eezi.test(z)) }));
      ok(mB.von.name === absName && kzOk && !!knopf && knopf.origin === P.basis && !/Preis|€|gesperrt|freischalten/i.test(mB.html),
        P.p + ': Absender „' + mB.von.name + '“, Kennzeichnung ' + P.m.mailKennzeichnung + ' in der Mail und ' + P.m.pdfKennzeichnung + ' im PDF, ' + (P.m.dashboard ? 'Knopf ins Dashboard' : 'Link auf Anfrage und Originalfotos (14 Tage)') + ' auf ' + P.basis + ', kein Preis- oder Sperrtext');
      pdfSeite1(pdf, '09-pdf-' + P.p + '-seite1');
      if (BILDER) {
        /* Bilder der Mail (cid:) wie im Postfach: Logo des Betriebs bzw. das eeziframes-Zeichen (Essential) */
        let logo = '';
        const zeichenUrl = P.konfig.instanz && P.konfig.instanz.logo ? [P.host, P.konfig.instanz.logo] : ['localhost', '/apple-touch-icon.png'];
        { const r = await X.api(zeichenUrl[0], zeichenUrl[1]); if (r.status === 200) logo = 'data:image/png;base64,' + r.buf.toString('base64'); }
        const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
        const kopf = '<div style="font:13px/1.6 Arial,sans-serif;color:#333;background:#fff;border-bottom:1px solid #ddd;padding:12px 24px"><b>Von:</b> ' + esc(mB.von.name) + ' &lt;' + esc(mB.von.adresse || '') + '&gt;<br><b>An:</b> ' + esc(an(mB).join(', ')) + '<br><b>Antwort an:</b> ' + esc(mB.antwortAn) + '<br><b>Betreff:</b> ' + esc(mB.betreff) + '<br><b>Anhang:</b> ' + mB.anhaenge.map((a) => esc(a.name) + ' (' + Math.round(a.bytes / 1024) + ' KB)').join(', ') + '</div>';
        const roh = mB.html.replace(/src="cid:[^"]*"/g, () => 'src="' + logo + '"').replace(/<body([^>]*)>/, (x) => x + kopf);
        for (const [vp, nm] of [[{ width: 1280, height: 900 }, '1280'], [{ width: 390, height: 844 }, 'telefon']]) {
          const c = await h.browser.newContext({ viewport: vp, deviceScaleFactor: nm === 'telefon' ? 2 : 1 }), pg = await c.newPage();
          await pg.route('**/*', (r) => (/^(data|about):/.test(r.request().url()) ? r.continue() : r.abort()));
          await pg.setContent(roh, { waitUntil: 'load' }).catch(() => false);
          await pg.screenshot({ path: path.join(BILDER, '30-10-mail-' + P.p + '-' + nm + '.png'), fullPage: true }).catch(() => false);
          await c.close();
        }
      }
    }

    /* ---------- 4. Signature: Dashboard unter der eigenen Domain, Einladung, Status ---------- */
    const S9 = PAKETE.find((P) => P.p === 'signature');
    {
      const BH = S9.basis;
      const ctxD = await kontext(D1280); let sD = await h.neueSeite(ctxD, BH);
      await sD.goto(BH + '/betrieb/', { waitUntil: 'networkidle' });
      await sD.waitForSelector('form[data-form="srvlogin"]');
      await bild(sD, '11-signature-anmeldung-1280');
      await sD.fill('#lg-mail', S9.team); await sD.click('form[data-form="srvlogin"] button[type="submit"]');
      await sD.waitForSelector('#lg-code');
      const codeMail = (await T.warteMail((m) => an(m).includes(S9.team) && /Anmeldecode/.test(m.betreff || ''), 8000))[0];
      await sD.fill('#lg-code', '123456'); await sD.click('form[data-form="srvlogin"] button[type="submit"]');
      await sD.waitForSelector('.scr[data-screen="links"]', { timeout: 10000 }).catch(() => null); await sD.waitForTimeout(400);
      const d0 = await sD.evaluate(() => ({ s: S.screen, text: document.body.innerText, titel: document.title, html: document.documentElement.outerHTML, cookie: document.cookie }));
      const cookies = await ctxD.cookies(BH);
      pruefe(d0.s === 'links' && !!codeMail && !eezi.test(codeMail.html + codeMail.betreff + codeMail.von.name) && cookies.some((c) => /betrieb$/.test(c.name) && c.httpOnly) && !/betrieb=/.test(d0.cookie) && d0.titel.includes(S9.name) && !eezi.test(d0.text + d0.titel + d0.html.replace(/href="https:\/\/eeziframes\.com\/partner\/"/g, '')) && d0.text.includes(S9.nr),
        'signature: Anmeldung im Dashboard ' + BH + '/betrieb/ per Code (Mail ohne eeziframes), Sitzung im HttpOnly-Cookie, Website-Anfrage ' + S9.nr + ' in der Liste; eeziframes nirgends im Text und im Quelltext nur als Ziel des Links „Vertrag, Rechnungen und Support“ (Kundenkonto des Betriebs, Bauplan E.6)',
        () => ({ s: d0.s, code: !!codeMail, codeEezi: codeMail ? eezi.test(codeMail.html + codeMail.betreff + codeMail.von.name) : null, cookies: cookies.map((c) => c.name + (c.httpOnly ? ':h' : '')), js: d0.cookie, titel: d0.titel, eezi: (d0.html.match(/.{0,60}eeziframes.{0,60}/gi) || []).slice(0, 4).concat((d0.text.match(/.{0,40}eeziframes.{0,40}/gi) || []).slice(0, 2)), nr: d0.text.includes(S9.nr) }));
      /* Befund 16: die Testanfrage aus der Einrichtung (Teil 2) zählt nach dem Livegang nicht mehr als Projekt */
      ok(!/Testanfrage/.test(d0.text), 'signature: die Testanfrage aus der Einrichtung steht nach dem Livegang nicht mehr im Dashboard');
      /* Einladung anlegen, Link auf der eigenen Domain, „Eingeladen“ */
      await sD.evaluate(() => go('newlink')); await sD.waitForSelector('#nl-kunde');
      await sD.fill('#nl-kunde', 'Familie Ulme'); await sD.click('[data-act="nl-next"]');
      await sD.waitForSelector('[data-act="nl-create"]'); await sD.click('[data-act="nl-create"]');
      await sD.waitForSelector('#lnk', { timeout: 10000 });
      await sD.click('[data-act="l-share"][data-v="link"]').catch(() => null); await sD.waitForTimeout(600);
      const einl = await sD.evaluate(() => { const l = A().links.find((x) => x.id === S.sel) || {}; return { id: l.id, code: l.code, status: l.status, url: ((document.getElementById('lnk') || {}).textContent || '').trim() }; });
      /* Karte des Projekts in der Liste (Status als Wort, wie der Betrieb ihn sieht) */
      const statusText = async () => { await sD.evaluate(() => Server.aktualisieren()); await sD.waitForTimeout(500); await sD.evaluate(() => go('links')); await sD.waitForTimeout(300); return sD.evaluate((id) => ((document.querySelector('.scr [data-act="go"][data-v="link"][data-id="' + id + '"]') || {}).innerText || ''), einl.id); };
      const st1 = await statusText();
      await bild(sD, '11-signature-dashboard-eingeladen-1280', { ganz: true });
      ok(/^[a-z0-9]{10}$/.test(einl.code || '') && einl.url.startsWith(BH + '/#k-' + einl.code) && /Eingeladen/.test(st1), 'signature: Einladung im Dashboard, Link auf der eigenen Domain ' + einl.url + ', Status „Eingeladen“');
      /* der Kunde öffnet den Link auf dem Telefon → In Bearbeitung → sendet → Eingereicht */
      const ctxU = await kontext(h.telefon), sU = await h.neueSeite(ctxU, BH);
      await sU.goto(einl.url, { waitUntil: 'networkidle' }); await sU.waitForTimeout(600);
      const u0 = await sU.evaluate(() => ({ text: document.body.innerText, titel: document.title }));
      await sU.click('[data-act="new"]'); await sU.waitForSelector('.scr[data-screen="start"]');
      await sU.evaluate((mo) => { Object.assign(S.win, { name: 'Küche', mo: mo, el: { w: 1230, h: 1410 }, w: 1230, h: 1410 }); saveWin(); }, MO);
      await sU.waitForSelector('.scr[data-screen="fertig"]');
      await T.warteZeile(einl.code, (z) => ['geoeffnet', 'arbeit'].includes(z.status), 8000);
      const st2 = await statusText();
      await bild(sD, '11-signature-dashboard-bearbeitung-1280', { ganz: true });
      await sU.evaluate(() => go('anfrage')); await sU.waitForTimeout(300);
      for (let i = 0; i < 6 && !(await sU.evaluate(() => !!(S.sent && S.sent.uebertragen)).catch(() => false)); i++) {
        const vor = await sU.evaluate(() => S.screen);
        if (vor === 'anfrage3' && !(await sU.inputValue('#t-name').catch(() => 'x'))) await sU.fill('#t-name', 'Familie Ulme');
        await sU.click('.bb .btn.primary');
        await bis(sU, (v) => S.screen !== v || !!(S.sent && S.sent.uebertragen), 10000, vor);
      }
      await sU.waitForFunction(() => S.sent && (S.sent.uebertragen || S.sent.nr), null, { timeout: 30000 });
      const zE = await T.warteZeile(einl.code, (z) => z.status === 'eingegangen', 10000);
      const st3 = await statusText();
      await bild(sD, '11-signature-dashboard-eingereicht-1280', { ganz: true });
      ok(/Familie Ulme/.test(u0.text) && !eezi.test(u0.text + u0.titel) && /In Bearbeitung/.test(st2) && !!zE && /Eingereicht/.test(st3),
        'signature: der Kunde öffnet die Einladung auf dem Telefon (ohne eeziframes) → „In Bearbeitung“ → sendet → „Eingereicht“ im Dashboard');
      h.sauber(sU, 'signature: Einladung in der App ohne Fehler'); await ctxU.close();
      /* Dashboard am Telefon */
      const ctxDT = await kontext(h.telefon), sDT = await h.neueSeite(ctxDT, BH);
      await ctxDT.addCookies((await ctxD.cookies(BH)).map((c) => Object.assign({}, c)));
      await sDT.goto(BH + '/betrieb/', { waitUntil: 'networkidle' }); await sDT.waitForSelector('.scr[data-screen="links"]', { timeout: 10000 }).catch(() => null); await sDT.waitForTimeout(400);
      const dt = await sDT.evaluate(() => ({ s: S.screen, quer: document.documentElement.scrollWidth > window.innerWidth + 1, text: document.body.innerText }));
      await bild(sDT, '11-signature-dashboard-telefon', { ganz: true });
      await sDT.evaluate((id) => go('link', id), (await T.zeile(S9.code) || {}).daten ? (await T.zeile(S9.code)).daten.id : einl.id); await sDT.waitForTimeout(500);
      await bild(sDT, '11-signature-dashboard-projekt-telefon', { ganz: true });
      ok(dt.s === 'links' && !dt.quer && !eezi.test(dt.text) && /Eingereicht/.test(dt.text), 'signature: Dashboard am Telefon mit derselben Sitzung, kein waagrechter Scroll, ohne eeziframes');
      h.sauber(sDT, 'signature: Dashboard am Telefon ohne Fehler'); await ctxDT.close();
      h.sauber(sD, 'signature: Dashboard ohne Fehler');
    }

    /* ---------- 5. Zahlungsausfall → Kulanz → pausiert → beendet → gelöscht (Uhr über JETZT, täglicher Lauf) ---------- */
    const vorAusfall = await attrappe(); // was danach weg sein muss: Anfragen, Fotos, Marke, PDFs der Instanzen
    for (const P of PAKETE) {
      const b = await bestellungVon(P.bid);
      const r = await X.api('localhost', '/__stripe', { body: { type: 'invoice.payment_failed', object: { id: 'in_dev30_' + P.p, subscription: b.abo.id, hosted_invoice_url: 'https://invoice.stripe.com/i/dev30-' + P.p } } });
      P.ausfall = r.json || {};
    }
    const bK = await Promise.all(PAKETE.map((P) => bestellungVon(P.bid)));
    const mailsK = await X.post();
    ok(PAKETE.every((P, i) => P.ausfall.paket && bK[i].abo_status === 'zahlung_offen' && Math.abs(Date.parse(bK[i].abo.kulanz_bis) - (Date.now() + 14 * 864e5)) < 3 * 36e5 && bK[i].status === 'live' && mailsK.some((m) => an(m).includes(P.mail) && /Zahlung für Ihren Konfigurator offen/.test(m.betreff || ''))),
      'Zahlungsausfall (Stripe-Ereignis invoice.payment_failed): alle drei „Zahlung offen“, Kulanz 14 Tage, Mail an den Partner, noch live');
    {
      const P = PAKETE[1], sK = P.sK;
      await sK.reload({ waitUntil: 'networkidle' }); await sK.waitForSelector('.p-abo');
      const abo = await sK.evaluate(() => (document.querySelector('.p-abo') || {}).innerText || '');
      await bild(sK, '04-kundenkonto-zahlung-offen-plus-1280', { ganz: true });
      ok(/Zahlung offen/.test(abo) && /Kulanz|bis/.test(abo), 'plus: Kundenkonto zeigt „Zahlung offen“ mit Frist');
      /* D.10: die offene Rechnung ist die nächste Aktion, als einziger Cream-Knopf; „Konfigurator öffnen“ ist ein Ring-Knopf */
      const hk = await sK.evaluate(() => { const k = document.querySelector('.p-karte.hi'); return { h: ((k && k.querySelector('h2')) || {}).innerText || '', t: ((k && k.querySelector('.p-text')) || {}).innerText || '', cream: Array.from(document.querySelectorAll('.btn.primary')).map((b) => b.innerText.trim()), ring: Array.from((k && k.querySelectorAll('.btn.ghost')) || []).map((b) => b.innerText.trim()) }; });
      ok(/Zahlung offen/.test(hk.h) && /bis \d{1,2}\. \S+ \d{4}, sonst pausieren wir/.test(hk.t) && hk.cream.length === 1 && hk.cream[0] === 'Offene Rechnung bezahlen' && hk.ring.includes('Konfigurator öffnen'), 'plus: Hauptkarte bei offener Zahlung mit Frist, Hauptknopf „Offene Rechnung bezahlen“, „Konfigurator öffnen“ als Ring-Knopf (' + hk.h + ' · ' + hk.cream.join(', ') + ' · ' + hk.ring.join(', ') + ')');
      h.sauber(sK, 'plus: Kundenkonto mit offener Zahlung ohne Fehler');
    }
    await X.uhr(13); await X.geplant(CRON_TAEGLICH);
    const tag13 = await Promise.all(PAKETE.map(async (P) => ({ b: await bestellungVon(P.bid), seite: await X.api(P.host, '/', { headers: { accept: 'text/html' } }) })));
    ok(tag13.every((x) => x.b.status === 'live' && x.seite.status === 200), 'Tag 13 der Kulanz: alle drei noch live, die Seiten antworten 200');
    await X.uhr(15); await X.geplant(CRON_TAEGLICH);
    const tag15 = [];
    for (const P of PAKETE) {
      const bb = await bestellungVon(P.bid), ii = await instanzVon(P.iid), seite = await X.api(P.host, '/', { headers: { accept: 'text/html' } });
      const start = await X.api(P.host, '/api/instanz/start', { body: {}, origin: true, headers: { 'x-forwarded-for': '198.18.31.' + PAKETE.indexOf(P) } });
      tag15.push({ P, bb, ii, seite, start });
      const c = await kontext(h.telefon), s = await h.neueSeite(c, P.basis);
      await s.goto(P.basis + '/', { waitUntil: 'networkidle' }).catch(() => null); await s.waitForTimeout(300);
      await bild(s, '12-instanz-' + P.p + '-pausiert-telefon');
      await c.close();
    }
    ok(tag15.every((x) => x.bb.status === 'pausiert' && (x.bb.abo || {}).grund === 'zahlung' && x.ii.status === 'pausiert' && x.seite.status === 503 && x.seite.text.includes(x.P.name) && x.seite.text.includes(x.P.tel) && !/<form/i.test(x.seite.text) && x.start.status >= 400) &&
      tag15.filter((x) => x.P.p === 'signature').every((x) => !eezi.test(x.seite.text)),
      'Tag 15: Kulanz vorbei → pausiert (Grund Zahlung); die Seite antwortet 503 mit Name und Telefon des Betriebs, ohne Formular, neue Planungen abgewiesen (' + tag15.map((x) => x.P.p + ' ' + x.seite.status + '/' + x.start.status).join(', ') + ')');
    await X.uhr(15 + 59); await X.geplant(CRON_TAEGLICH);
    const tag74 = await Promise.all(PAKETE.map((P) => bestellungVon(P.bid)));
    await X.uhr(15 + 62); await X.geplant(CRON_TAEGLICH);
    const tag77 = [];
    for (const P of PAKETE) tag77.push({ P, bb: await bestellungVon(P.bid), ii: await instanzVon(P.iid), seite: await X.api(P.host, '/', { headers: { accept: 'text/html' } }) });
    ok(tag74.every((x) => x.status === 'pausiert') && tag77.every((x) => x.bb.status === 'beendet' && x.bb.abo_status === 'beendet' && x.ii && x.ii.status === 'beendet' && x.seite.status === 410 && !eezi.test(x.seite.text)),
      'Pause bis 60 Tage bleibt pausiert; danach endet das Abo, Bestellung und Instanz beendet, die Seite antwortet 410 neutral (' + tag77.map((x) => x.P.p + ' ' + x.bb.status + '/' + (x.ii || {}).status + '/' + x.seite.status).join(', ') + ')');
    await X.uhr(15 + 62 + 29); await X.geplant(CRON_TAEGLICH);
    const tag106 = await Promise.all(PAKETE.map((P) => instanzVon(P.iid)));
    await X.uhr(15 + 62 + 32); await X.geplant(CRON_TAEGLICH);
    const nach = await attrappe(), abl = nach.ablage || {};
    const geloescht = [];
    for (const P of PAKETE) {
      const bb = (nach.bestellungen || []).find((b) => b.id === P.bid) || {}, seite = await X.api(P.host, '/', { headers: { accept: 'text/html' } });
      const codes = (vorAusfall.anfragen || []).filter((a) => a.instanz === P.iid).map((a) => a.code), ab0 = vorAusfall.ablage || {};
      const vorhanden = (ab0.fotos || []).filter((p) => codes.some((c) => p.startsWith('link/' + c + '/'))).length + (ab0.marke || []).filter((p) => p.startsWith('instanz/' + P.iid)).length;
      const reste = [].concat(
        (nach.instanzen || []).filter((i) => i.id === P.iid).map(() => 'instanzen'),
        (nach.hosts || []).filter((x) => x.instanz === P.iid || x.host === P.host).map(() => 'hosts'),
        (nach.anfragen || []).filter((a) => a.instanz === P.iid).map(() => 'anfragen'),
        (abl.marke || []).filter((p) => p.startsWith('instanz/' + P.iid)).map(() => 'marke'),
        (abl.blatt || []).filter((p) => p.startsWith('instanz/' + P.iid)).map(() => 'blatt'),
        (abl.fotos || []).filter((p) => codes.some((c) => p.startsWith('link/' + c + '/'))).map(() => 'fotos'),
        (abl.bestellungen || []).filter((p) => p.includes('/' + P.bid + '/')).map(() => 'bestellungen'));
      geloescht.push({ P, bb, seite, reste, codes: codes.length, vorhanden });
    }
    ok(tag106.every((i) => !!i) && geloescht.every((x) => (x.bb.verlauf || []).some((v) => v.art === 'geloescht') && !x.reste.length && x.codes >= 2 && x.vorhanden >= 4 && x.seite.status === 404 && !eezi.test(x.seite.text) && x.bb.zahlung && x.bb.zahlung.status === 'bezahlt'),
      '30 Tage nach dem Ende gelöscht (vorher nicht): Instanz, Hosts, Anfragen, Fotos, Marke, abgelegte PDFs und Bestelldateien weg, die Domain antwortet 404 neutral; Bestell- und Zahlungsdaten bleiben (' + geloescht.map((x) => x.P.p + ': ' + x.codes + ' Anfragen und ' + x.vorhanden + ' Dateien vorher, ' + (x.reste.length ? 'Reste ' + x.reste.join(',') : 'danach leer') + ', Domain ' + x.seite.status).join('; ') + ')');
  } catch (e) {
    ok(false, 'ohne Ausnahme: ' + (e && e.stack ? e.stack : e));
  } finally {
    for (const c of offen) await c.close().catch(() => false);
    if (X) { await X.uhr(null).catch(() => false); X.stop(); }
    try { fs.rmSync(ORDNER, { recursive: true, force: true }); } catch (e) { /* bleibt liegen */ }
  }
};

/* Bestandsaufnahme (28.10.2026, Wunsch des Inhabers): Welche Seiten tragen noch das alte Design (Grund #161616, Schrift Inter,
   Signal Grün #8fd694, Cream-Pille) und welche schon die Design-DNA (Grund #07090a, Outfit, Violett und Koralle)?
   Je Seite ein Bild am Telefon (390 × 844, doppelte Dichte) und am Schreibtisch (1280 × 800), dazu die Messung im DOM samt
   Schatten-DOM: Grund von body/html, Schrift der ersten Überschrift, Zahl der sichtbaren Elemente in Grün, Violett und Koralle.
   Urteil „alt“: Grund #161616 oder Überschrift in Inter oder Grün im DOM; sonst „neu“.
   Aufruf (Server mit Attrappen, damit die Konfiguratoren der Fensterbauer laufen):
     KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 BETRIEBSKONTO=0 PORT=8789 node scripts/dev-server.mjs
     node docs/profis/werkzeuge/altes-design.mjs <ausgabeordner> [http://localhost:8789]
   Ergebnis: <ausgabeordner>/<id>-tel.jpg, <id>-desk.jpg und ergebnis.json; in der Konsole je Seite eine Zeile. */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [,, OUT = 'altes-design', BASIS = 'http://localhost:8789'] = process.argv;
const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../web');
const PORT = new URL(BASIS).port;
const inst = (slug, pfad = '/') => `http://${slug}.localhost:${PORT}${pfad}`;
const ordner = (rel) => readdirSync(path.join(WEB, rel)).filter((n) => statSync(path.join(WEB, rel, n)).isDirectory()).sort();
mkdirSync(OUT, { recursive: true });

/* Alle Seiten: die festen Seiten aus web/, die Ratgeber und das Wissen für Fensterbauer aus ihren Ordnern, dazu die Konfiguratoren */
const seiten = [
  ['start-haus', '/', 'Startseite Hauseigentümer'], ['start-fensterbauer', '/fensterbauer', 'Startseite Fensterbauer'],
  ['fuer-fensterbauer', '/fuer-fensterbauer/', 'Verkaufsseite der Pakete'],
  ...ordner('fuer-fensterbauer').map((n) => ['fb-' + n, `/fuer-fensterbauer/${n}/`, 'Wissen für Fensterbauer']),
  ['ratgeber', '/ratgeber/', 'Ratgeber'], ...ordner('ratgeber').map((n) => ['rg-' + n, `/ratgeber/${n}/`, 'Ratgeber']),
  ['app', '/app/', 'App'], ['app-fuehrung', '/app/#fuehrung', 'App'],
  ['bestellen', '/bestellen/?paket=plus', 'Bestellung'], ['konto', '/konto/', 'Kundenbereich'], ['zentrale', '/zentrale/', 'Zentrale'],
  ...['impressum', 'datenschutz', 'agb', 'nutzungsbedingungen', 'cookies', 'widerruf', 'konfigurator-bedingungen'].map((n) => ['recht-' + n, `/${n}/`, 'Rechtstexte']),
  ['404', '/gibt-es-nicht/', 'Fehlerseite'], ['betrieb-404', '/betrieb/', 'Fehlerseite'],
  ...['essential', 'plus', 'signature'].map((n) => ['paket-' + n, `/vorschau/paket-beispiel/${n}.html`, 'Paket-Vorschau']),
  ...ordner('vorschau').filter((n) => n !== 'paket-beispiel').map((n) => ['vorschau-' + n.replace(/-[0-9a-f]{10}$/, ''), `/vorschau/${n}/`, 'Vorschau, nicht verlinkt']),
].map(([id, pfad, gruppe]) => ({ id, url: BASIS + pfad, gruppe }));
seiten.push(
  ...['essential', 'plus', 'signature'].map((n) => ({ id: 'instanz-' + n, url: inst(n), gruppe: 'Konfigurator beim Fensterbauer' })),
  { id: 'instanz-impressum', url: inst('plus', '/impressum/'), gruppe: 'Konfigurator beim Fensterbauer' },
  { id: 'instanz-datenschutz', url: inst('plus', '/datenschutz/'), gruppe: 'Konfigurator beim Fensterbauer' },
  { id: 'instanz-404', url: inst('plus', '/gibt-es-nicht'), gruppe: 'Konfigurator beim Fensterbauer' },
  { id: 'instanz-betrieb', url: inst('signature', '/betrieb/'), gruppe: 'Konfigurator beim Fensterbauer' },
  { id: 'instanz-dashboard', url: inst('signature', '/betrieb/'), gruppe: 'Konfigurator beim Fensterbauer', anmelden: 'team@signature.example' },
  { id: 'instanz-pausiert', url: inst('signature2'), gruppe: 'Konfigurator beim Fensterbauer', status: ['signature2', 'pausiert'] },
);

/* läuft in der Seite: sichtbare Elemente samt Schatten-DOM nach Farbe zählen */
const messen = () => {
  const rgb = (c) => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const art = (c) => {
    const f = rgb(c); if (!f || f.a < 0.15) return null;
    const mx = Math.max(f.r, f.g, f.b), mn = Math.min(f.r, f.g, f.b), ch = mx - mn; if (ch < 40) return null;
    let h = mx === f.r ? ((f.g - f.b) / ch) % 6 : mx === f.g ? (f.b - f.r) / ch + 2 : (f.r - f.g) / ch + 4; h = (h * 60 + 360) % 360;
    if (h >= 95 && h <= 165) return 'gruen';
    if (h >= 232 && h <= 265) return 'violett';
    if (h >= 5 && h <= 25 && f.r > 190) return 'koralle';
    return null;
  };
  const z = { gruen: 0, violett: 0, koralle: 0 }, alle = [];
  const sammeln = (w) => { for (const e of w.querySelectorAll('*')) { alle.push(e); if (e.shadowRoot) sammeln(e.shadowRoot); } };
  sammeln(document);
  for (const e of alle) {
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) continue;
    const svg = e instanceof SVGElement, eigenText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const props = [eigenText || svg ? s.color : '', s.backgroundColor, parseFloat(s.borderTopWidth) > 0 ? s.borderTopColor : '', svg ? s.fill : '', svg ? s.stroke : ''];
    for (const a of new Set(props.map(art).filter(Boolean))) z[a]++;
  }
  const grund = [document.body, document.documentElement].map((e) => getComputedStyle(e).backgroundColor).find((c) => rgb(c) && rgb(c).a > 0) || '';
  const tief = (sel) => { let el = document.querySelector(sel); if (el) return el; for (const e of alle) if (e.shadowRoot && (el = e.shadowRoot.querySelector(sel))) return el; return null; };
  const h = tief('h1') || tief('h2');
  return { z, grund, schrift: h ? getComputedStyle(h).fontFamily.split(',')[0].replace(/"/g, '') : '', h1: h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90) : '', titel: document.title };
};

await fetch(BASIS + '/__saat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => null);
const browser = await chromium.launch();
const ergebnis = [];
for (const s of seiten) {
  if (s.status) await fetch(BASIS + '/__instanz', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ slug: s.status[0], patch: { status: s.status[1] } }) }).catch(() => null);
  const e = { ...s };
  for (const [name, w, h, dichte] of [['tel', 390, 844, 2], ['desk', 1280, 800, 1]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dichte, locale: 'de-DE' });
    const page = await ctx.newPage();
    try {
      const antwort = await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 });
      e.http = antwort ? antwort.status() : 0;
      if (s.anmelden) {
        await page.fill('input[type=email]', s.anmelden); await page.getByRole('button', { name: /Code schicken/ }).click(); await page.waitForTimeout(1500);
        await page.locator('input[autocomplete="one-time-code"], input[inputmode="numeric"]').first().fill('123456'); await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(2600);
      await page.screenshot({ path: `${OUT}/${s.id}-${name}.jpg`, type: 'jpeg', quality: 72 });
      if (name === 'desk') e.mess = await page.evaluate(messen);
    } catch (f) { e.fehler = String(f).slice(0, 200); }
    await ctx.close();
  }
  const m = e.mess || {};
  e.urteil = m.grund === 'rgb(22, 22, 22)' && !/^start-/.test(s.id) || m.schrift === 'Inter' || (m.z && m.z.gruen > 0) ? 'alt' : 'neu';
  console.log([e.urteil.padEnd(3), s.id.padEnd(40), e.http, m.grund, m.schrift, m.z && `grün ${m.z.gruen} · violett ${m.z.violett} · koralle ${m.z.koralle}`].join('  '));
  ergebnis.push(e);
}
writeFileSync(`${OUT}/ergebnis.json`, JSON.stringify(ergebnis, null, 1));
await browser.close();

/* Bestandsaufnahme (28.10.2026, Wunsch des Inhabers): Welche Seiten tragen noch das alte Design (Grund #161616, Schrift Inter,
   Signal Grün #8fd694, Cream-Pille) und welche schon die Design-DNA (Grund #07090a, Outfit, Violett und Koralle)?
   Je Seite vier Bilder: erster Bildschirm und ganze Seite, je am Telefon (390 px, doppelte Dichte) und am Schreibtisch (1280 px).
   Vor der ganzseitigen Aufnahme wird die Seite einmal durchgescrollt, damit nachgeladene Bilder stehen.
   Messung im DOM samt Schatten-DOM: Grund von body/html, Schrift der ersten Überschrift, sichtbare Elemente in Grün, Violett und
   Koralle (Text, Fläche, Rand, Schatten, ::before/::after, SVG), dazu die Bausteine der Ratgeber-Vorlage je Seite.
   Urteil „alt“: Grund #161616 oder Überschrift in Inter oder Grün im DOM; sonst „neu“.

   Konfiguratoren der Fensterbauer: Online gibt es noch keinen. Das Werkzeug legt deshalb im lokalen Testserver (nur Attrappe, nie
   online) drei Instanzen des erfundenen Beispielbetriebs „Fensterbau Brandt“ an, den auch die Paket-Vorschau zeigt, je Paket eine,
   dazu eine vierte im Zustand „pausiert“. Die Testbetriebe der Prüfsuite (Amsel, Fink, Specht, Meise) werden hier nicht gebraucht.

   Aufruf (Server mit Attrappen):
     KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 BETRIEBSKONTO=0 PORT=8789 node scripts/dev-server.mjs
     node docs/profis/werkzeuge/altes-design.mjs <ausgabeordner> [http://localhost:8789]
   Ergebnis: <ausgabeordner>/<id>-{tel,desk}.jpg, <id>-{tel,desk}-ganz.png und ergebnis.json; in der Konsole je Seite eine Zeile. */
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

/* Beispielbetrieb wie in der Paket-Vorschau (web/vorschau/paket-beispiel/), Firmenfarbe Aquatürkis aus seiner Palette */
const BRANDT = { name: 'Fensterbau Brandt', ap: 'Petra Brandt', plz: '50667', ort: 'Köln', strasse: 'Am Fensterhof 7', tel: '0221 555 0100' };
const INSTANZEN = [
  { ...BRANDT, slug: 'brandt-essential', paket: 'essential', farbe: '', mail: 'kontakt@brandt-essential.example' },
  { ...BRANDT, slug: 'brandt-plus', paket: 'plus', farbe: '#2ab4bd', mail: 'kontakt@brandt-plus.example' },
  { ...BRANDT, slug: 'brandt-signature', paket: 'signature', farbe: '#2ab4bd', mail: 'kontakt@brandt-signature.example' },
  { ...BRANDT, slug: 'brandt-pausiert', paket: 'signature', farbe: '#2ab4bd', mail: 'kontakt@brandt-pausiert.example', status: 'pausiert' },
];
const KONF = 'Konfigurator beim Fensterbauer';

/* Alle Seiten: die festen Seiten aus web/, die Ratgeber und das Wissen für Fensterbauer aus ihren Ordnern, dazu die Konfiguratoren */
const seiten = [
  ['start-haus', '/', 'Startseite Hauseigentümer'], ['start-fensterbauer', '/fensterbauer', 'Startseite Fensterbauer'],
  ['fuer-fensterbauer', '/fuer-fensterbauer/', 'Verkaufsseite der Pakete'],
  ...ordner('fuer-fensterbauer').map((n) => ['fb-' + n, `/fuer-fensterbauer/${n}/`, 'Wissen für Fensterbauer']),
  ['ratgeber', '/ratgeber/', 'Ratgeber'], ...ordner('ratgeber').map((n) => ['rg-' + n, `/ratgeber/${n}/`, 'Ratgeber']),
  ['app', '/app/', 'App'], ['app-fuehrung', '/app/#fuehrung', 'App'],
  ['bestellen', '/bestellen/?paket=plus', 'Bestellung'], ['konto', '/konto/', 'Kundenbereich'], ['zentrale', '/zentrale/', 'Zentrale'],
  ...['impressum', 'datenschutz', 'agb', 'nutzungsbedingungen', 'cookies', 'widerruf', 'konfigurator-bedingungen'].map((n) => ['recht-' + n, `/${n}/`, 'Rechtstexte']),
  ['404', '/gibt-es-nicht/', 'Fehlerseite'],
  ...['essential', 'plus', 'signature'].map((n) => ['paket-' + n, `/vorschau/paket-beispiel/${n}.html`, 'Paket-Vorschau']),
  ...ordner('vorschau').filter((n) => n !== 'paket-beispiel').map((n) => ['vorschau-' + n.replace(/-[0-9a-f]{10}$/, ''), `/vorschau/${n}/`, 'Vorschau, nicht verlinkt']),
].map(([id, pfad, gruppe]) => ({ id, url: BASIS + pfad, gruppe }));
seiten.push(
  ...['essential', 'plus', 'signature'].map((n) => ({ id: 'instanz-' + n, url: inst('brandt-' + n), gruppe: KONF })),
  { id: 'instanz-so-gehts', url: inst('brandt-plus'), gruppe: KONF, klick: /So funktioniert es/ },
  { id: 'instanz-impressum', url: inst('brandt-plus', '/impressum/'), gruppe: KONF },
  { id: 'instanz-datenschutz', url: inst('brandt-plus', '/datenschutz/'), gruppe: KONF },
  { id: 'instanz-404', url: inst('brandt-plus', '/gibt-es-nicht'), gruppe: KONF },
  { id: 'instanz-betrieb', url: inst('brandt-signature', '/betrieb/'), gruppe: KONF },
  { id: 'instanz-dashboard', url: inst('brandt-signature', '/betrieb/'), gruppe: KONF, anmelden: 'team@brandt-signature.example' },
  { id: 'instanz-pausiert', url: inst('brandt-pausiert'), gruppe: KONF },
);

/* läuft in der Seite: Farben und Bausteine */
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
  const schattenFarben = (s) => (s && s !== 'none' ? s.match(/rgba?\([^)]+\)/g) || [] : []);
  const z = { gruen: 0, violett: 0, koralle: 0 }, alle = [], gruenWo = {};
  const sammeln = (w) => { for (const e of w.querySelectorAll('*')) { alle.push(e); if (e.shadowRoot) sammeln(e.shadowRoot); } };
  sammeln(document);
  for (const e of alle) {
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0) continue;
    const svg = e instanceof SVGElement, eigenText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const farben = [eigenText || svg ? s.color : '', s.backgroundColor, parseFloat(s.borderTopWidth) > 0 ? s.borderTopColor : '',
      parseFloat(s.borderLeftWidth) > 0 ? s.borderLeftColor : '', svg ? s.fill : '', svg ? s.stroke : '', ...schattenFarben(s.boxShadow)];
    for (const p of ['::before', '::after']) { const q = getComputedStyle(e, p); if (q.content && q.content !== 'none' && q.content !== 'normal') farben.push(q.color, q.backgroundColor, ...schattenFarben(q.boxShadow)); }
    const arten = new Set(farben.map(art).filter(Boolean));
    for (const a of arten) z[a]++;
    if (arten.has('gruen')) {
      const k = e.closest('.ak') ? 'Wort in der Überschrift' : e.closest('.eyebrow, .kicker, .rg-stand') ? 'Kicker' : e.closest('summary') ? 'Plus bei den Fragen' :
        e.closest('.rg-tipp') ? 'Hinweiskarte' : e.closest('.rg-weg, .rg-weg-liste') ? 'Dein Weg' : e.closest('.rg-weiter') ? 'Nächster Schritt' : e.closest('.rg-fuss, footer') ? 'Fußzeile' :
        e.closest('nav, .rg-inhalt') ? 'Inhaltsverzeichnis' : e.closest('a') ? 'Link' : 'sonst';
      gruenWo[k] = (gruenWo[k] || 0) + 1;
    }
  }
  const grund = [document.body, document.documentElement].map((e) => getComputedStyle(e).backgroundColor).find((c) => rgb(c) && rgb(c).a > 0) || '';
  const tief = (sel) => { let el = document.querySelector(sel); if (el) return el; for (const e of alle) if (e.shadowRoot && (el = e.shadowRoot.querySelector(sel))) return el; return null; };
  const h = tief('h1') || tief('h2');
  const q = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().height > 0).length;
  const text = document.body ? document.body.innerText : '';
  const bilder = [...document.querySelectorAll('main img, img')].filter((i) => i.getBoundingClientRect().width > 40).map((i) => (i.getAttribute('src') || '').split('/').pop().split('?')[0]);
  return { z, gruenWo, grund, schrift: h ? getComputedStyle(h).fontFamily.split(',')[0].replace(/"/g, '') : '', h1: h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90) : '',
    titel: document.title, hoehe: document.documentElement.scrollHeight,
    bausteine: { abschnitte: q('main h2'), fragen: q('details'), tabellen: q('table'), hinweise: q('.rg-tipp'), quellen: q('.rg-quellen li'),
      band: /Einführungspreis bis/.test(text.slice(0, 400)), schritt: ((text.match(/Dein Weg: Schritt (\d) von 6/) || [])[1]) || '', bilder } };
};

const durchscrollen = async (page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(100); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
};

await fetch(BASIS + '/__saat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ instanzen: INSTANZEN }) }).catch(() => null);
const browser = await chromium.launch();
const ergebnis = [];
for (const s of seiten) {
  const e = { ...s, klick: undefined };
  for (const [name, w, h, dichte] of [['tel', 390, 844, 2], ['desk', 1280, 800, 1]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dichte, locale: 'de-DE' });
    const page = await ctx.newPage();
    const fehler = []; page.on('pageerror', (f) => fehler.push(String(f).slice(0, 160)));
    try {
      const antwort = await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 });
      e.http = antwort ? antwort.status() : 0;
      if (s.anmelden) {
        await page.fill('input[type=email]', s.anmelden); await page.getByRole('button', { name: /Code schicken/ }).click(); await page.waitForTimeout(1500);
        await page.locator('input[autocomplete="one-time-code"], input[inputmode="numeric"]').first().fill('123456'); await page.keyboard.press('Enter');
      }
      if (s.klick) { await page.waitForTimeout(800); await page.getByRole('button', { name: s.klick }).first().click(); }
      await page.waitForTimeout(2600);
      await page.screenshot({ path: `${OUT}/${s.id}-${name}.jpg`, type: 'jpeg', quality: 72 });
      if (!s.klick) await durchscrollen(page);
      await page.screenshot({ path: `${OUT}/${s.id}-${name}-ganz.png`, fullPage: !s.klick });
      e['mess_' + name] = await page.evaluate(messen);
    } catch (f) { e.fehler = String(f).slice(0, 200); }
    e['fehler_' + name] = fehler;
    await ctx.close();
  }
  e.mess = e.mess_desk;
  const m = e.mess || {};
  e.urteil = (m.grund === 'rgb(22, 22, 22)' && !/^start-/.test(s.id)) || m.schrift === 'Inter' || (m.z && m.z.gruen > 0) ? 'alt' : 'neu';
  console.log([e.urteil.padEnd(3), s.id.padEnd(40), e.http, m.grund, m.schrift, m.z && `grün ${m.z.gruen} · violett ${m.z.violett} · koralle ${m.z.koralle}`, e.fehler || ''].join('  '));
  ergebnis.push(e);
}
writeFileSync(`${OUT}/ergebnis.json`, JSON.stringify(ergebnis, null, 1));
await browser.close();

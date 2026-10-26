/* Bildschirmfotos der Vorschau an Szenengrenzen: je Szene von oben in Bildschirmhöhen, zuletzt das Szenenende bündig unten.
   Aufruf: node shot.mjs <ausgabeordner> [url] [reduziert] */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
const [,, OUT, URL = 'http://localhost:8790/lokal.html', REDUZIERT] = process.argv;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const bericht = {};
async function reihe(w, h, name) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: 'de-DE', reducedMotion: REDUZIERT ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const fehler = [];
  page.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  page.on('pageerror', e => fehler.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  const info = await page.evaluate(() => {
    const szenen = [...document.querySelectorAll('.dna-szene')].map(s => { const r = s.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; });
    const p = document.querySelector('.ez-hero .dna-pille');
    return { total: document.documentElement.scrollHeight, breit: document.documentElement.scrollWidth, szenen,
      animationen: document.getAnimations().filter(a => a.playState === 'running').length,
      pilleOben: p ? Math.round(p.getBoundingClientRect().top) : null,
      vollePillen: [...document.querySelectorAll('.dna-pille:not(.dna-pille--leise)')].filter(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }).length };
  });
  const pos = [];
  for (const s of info.szenen) {
    let y = s.top; const ende = s.top + s.h;
    while (y + h < ende - 8) { pos.push(y); y += h; }
    pos.push(Math.min(Math.max(ende - h, s.top), info.total - h));
  }
  const eindeutig = pos.filter((y, i) => i === 0 || y - pos[i - 1] > 40);
  let i = 0;
  for (const y of eindeutig) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(900);
    i++; await page.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}.png` });
  }
  /* Leiste: hinunter, dann 120 px hinauf */
  await page.evaluate(() => window.scrollTo(0, 1800)); await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 1680)); await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${name}-leiste.png` });
  const leiste = await page.evaluate(() => !!document.querySelector('.ez-leiste.ist-da'));
  bericht[name] = { ...info, positionen: eindeutig, leisteSichtbar: leiste, fehler };
  console.log(JSON.stringify(bericht[name]));
  await ctx.close();
}
await reihe(390, 844, 'tel');
await reihe(1280, 800, 'desk');
writeFileSync(`${OUT}/bericht.json`, JSON.stringify(bericht, null, 1));
await browser.close();

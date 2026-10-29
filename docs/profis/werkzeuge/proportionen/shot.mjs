import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';
const OUT = process.argv[2] || 'bilder'; mkdirSync(OUT, { recursive: true });
const CSS = readFileSync(new URL('./nachher.css', import.meta.url), 'utf8');
const BASIS = 'http://localhost:8789';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function lauf(name, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: 'de-DE', reducedMotion: 'reduce' });
  const page = await ctx.newPage(); page.setDefaultTimeout(60000);
  page.on('pageerror', (e) => console.log('FEHLER', name, e.message));
  await page.goto(BASIS + '/app/?gl=voll', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  const k = async (sel, w = 700) => { await page.click(sel); await page.waitForTimeout(w); };
  await k('button[data-act="new"]', 900);
  await k('.st-kachel[data-act="art"][data-v="fenster"]', 500);
  await k('button[data-act="go"][data-v="fotos"]', 900);
  await k('button[data-act="ohne-foto"]', 500);
  await k('button[data-act="ohne-foto-weiter"]', 1500);
  const W = ['1410', '1350', '1240', '1180', '1405', '1408', '1238', '1236'];
  for (let i = 0; i < 8; i++) {
    await page.waitForSelector('#mess-weiter', { state: 'attached' }); await page.waitForTimeout(400);
    await page.keyboard.type(W[i], { delay: 40 }); await page.waitForTimeout(400);
    await page.waitForSelector('#mess-weiter:not(.ist-weg)', { state: 'visible' });
    await k('#mess-weiter:not(.ist-weg)', 1000);
    const frage = await page.$('#mess-stimmt'); if (frage && await frage.isVisible()) { await k('#mess-stimmt', 900); }
  }
  // „Passt.“ → Ergebnis
  await page.waitForTimeout(600); await k('#mess-weiter:not(.ist-weg), .ez-folie .dna-pille.lg-weiter', 1500);
  { const e = await page.$('button[data-act="go"][data-v="ergebnis"]'); if (e) await k('button[data-act="go"][data-v="ergebnis"]', 1500); }
   console.log(name, 'screen', await page.evaluate(() => (document.querySelector('.scr') || {}).className));
  await k('[data-act="wuensche"]', 1500);
  await k('button[data-act="lg-raum"][data-v="Küche"]', 400);
  // bis zur Frage „Material“
  for (let i = 0; i < 30; i++) {
    const q = await page.evaluate(() => (document.querySelector('.qpanel') || {}).getAttribute ? document.querySelector('.qpanel').getAttribute('data-q') : '');
    if (q === 'material') break;
    await k('[data-act="qnext"]', 900);
  }
  const q = await page.evaluate(() => { const p = document.querySelector('.qpanel'); return { q: p && p.getAttribute('data-q'), h1: (document.querySelector('h1') || {}).textContent, cls: document.querySelector('.scr') && document.querySelector('.scr').className }; });
  console.log(name, JSON.stringify(q));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}-vorher.png`, timeout: 180000 });
  await page.addStyleTag({ content: CSS });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(name === 'laptop' ? 9000 : 2500);
  await page.screenshot({ path: `${OUT}/${name}-nachher.png`, timeout: 180000 });
  await ctx.close();
}
if (!process.env.NUR || process.env.NUR === 'tel') await lauf('tel', { width: 390, height: 844 });
if (!process.env.NUR || process.env.NUR === 'laptop') await lauf('laptop', { width: 1440, height: 900 });
await browser.close();

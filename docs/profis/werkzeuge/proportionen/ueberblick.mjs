import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const OUT = process.argv[2] || 'ueberblick'; mkdirSync(OUT, { recursive: true });
const BASIS = 'http://localhost:8789';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function lauf(name, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, locale: 'de-DE', reducedMotion: 'reduce' });
  const page = await ctx.newPage(); page.setDefaultTimeout(90000);
  page.on('pageerror', (e) => console.log('FEHLER', name, e.message));
  let n = 0; const ab = ''; const T = name === 'laptop' ? 6000 : 1800;
  const foto = async (t) => { n++; await page.waitForTimeout(T); await page.screenshot({ path: `${OUT}/${name}-${String(n).padStart(2, '0')}-${t}.png`, timeout: 240000 }); console.log(name, n, t); };
  const k = async (sel, w = 700) => { await page.click(sel); await page.waitForTimeout(w); };
  await page.goto(BASIS + '/app/?gl=voll', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  await k('button[data-act="new"]', 900);
  await k('.st-kachel[data-act="art"][data-v="fenster"]', 500); await foto('start');
  await k('button[data-act="go"][data-v="fotos"]', 900); await foto('fotos');
  await k('button[data-act="ohne-foto"]', 500); await foto('fotos-hinweis');
  await k('button[data-act="ohne-foto-weiter"]', 1500); await foto('messen-1');
  const W = ['1410', '1350', '1240', '1180', '1405', '1408', '1238', '1236'];
  for (let i = 0; i < 8; i++) {
    await page.waitForSelector('#mess-weiter', { state: 'attached' }); await page.waitForTimeout(400);
    await page.keyboard.type(W[i], { delay: 40 }); await page.waitForTimeout(400);
    if (i === 0) await foto('messen-1-wert');
    await page.waitForSelector('#mess-weiter:not(.ist-weg)', { state: 'visible' });
    await k('#mess-weiter:not(.ist-weg)', 1000);
    const frage = await page.$('#mess-stimmt'); if (frage && await frage.isVisible()) { await k('#mess-stimmt', 900); }
    if (i === 3) await foto('rand-1');
  }
  await foto('passt');
  await page.waitForTimeout(600); await k('#mess-weiter:not(.ist-weg), .ez-folie .dna-pille.lg-weiter', 1500);
  { const e = await page.$('button[data-act="go"][data-v="ergebnis"]'); if (e) await k('button[data-act="go"][data-v="ergebnis"]', 1500); }
  await foto('ergebnis');
  await k('[data-act="wuensche"]', 1500); await foto('lage');
  await k('button[data-act="lg-raum"][data-v="Küche"]', 400); await foto('lage-kueche');
  await k('[data-act="qnext"]', 900); await foto('tiefe');
  const ziele = ['oeffnung', 'form', 'richtung', 'material', 'farbe', 'glas', 'sprossen', 'griff', 'rc', 'sonne', 'einbau', 'notiz'];
  const gesehen = new Set();
  for (let i = 0; i < 40; i++) {
    const q = await page.evaluate(() => { const p = document.querySelector('.qpanel'); return p ? p.getAttribute('data-q') : ''; });
    if (q && !gesehen.has(q)) { gesehen.add(q); await foto('wunsch-' + q); }
    const weiter = await page.$('[data-act="qnext"], [data-act="save"]'); if (!weiter) break;
    const act = await weiter.getAttribute('data-act');
    await weiter.click(); await page.waitForTimeout(900);
    if (act === 'save') break;
  }
  await foto('gespeichert');
  for (const t of ['angebot-1', 'angebot-2', 'angebot-3', 'blatt']) {
    const b = await page.$('.lg-fuss .dna-pille.lg-weiter, .lg-fuss .dna-pille:not(.dna-pille--leise), .lg-fuss .btn.primary'); if (!b) break;
    await b.click(); await page.waitForTimeout(1200); await foto(t);
  }
  await ctx.close();
}
if (!process.env.NUR || process.env.NUR === 'tel') await lauf('tel', { width: 390, height: 844 });
if (!process.env.NUR || process.env.NUR === 'laptop') await lauf('laptop', { width: 1440, height: 900 });
await browser.close();

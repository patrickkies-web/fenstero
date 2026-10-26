/* Zeitlupe: Animationen 4× langsamer (CDP), Einzelbilder des Hero-Auftritts; Zustände (Hover, Druck, Fokus); Leiste, Bento und Stationen mitten im Wechsel */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [,, OUT] = process.argv; const URL = process.env.URL || 'http://localhost:8790/lokal.html';
const browser = await chromium.launch();
async function neu(w, h, scale = 2) { const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale }); const page = await ctx.newPage(); await page.addInitScript(() => document.addEventListener('click', e => e.preventDefault(), true)); return { ctx, page }; }
// 1. Hero-Auftritt am Telefon in Zeitlupe (Rate 0.25): Bilder bei Animationszeit 0, 100 … 2000 ms
{
  const { ctx, page } = await neu(390, 844, 1);
  const cdp = await ctx.newCDPSession(page); await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.25 });
  const zeiten = [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600, 1800, 2000];
  const t0 = Date.now(); await page.goto(URL, { waitUntil: 'commit' });
  for (const z of zeiten) { const ziel = t0 + z * 4; const warte = ziel - Date.now(); if (warte > 0) await page.waitForTimeout(warte); await page.screenshot({ path: `${OUT}/hero-${String(z).padStart(4, '0')}.png`, clip: { x: 0, y: 130, width: 390, height: 560 } }); }
  await ctx.close();
}
// 2. Zustände am Schreibtisch: Ruhe, Hover, Druck, Fokus auf der Hero-Pille und der leisen Pille; Umschalter-Hover; Rundknopf-Hover
{
  const { ctx, page } = await neu(1280, 800, 2);
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(2200);
  const pille = page.locator('.ez-hero .dna-pille').first(), leise = page.locator('.ez-hero .dna-pille--leise').first();
  const clip = async (loc, pad = 14) => { const b = await loc.boundingBox(); return { x: b.x - pad, y: b.y - pad, width: b.width + 2 * pad, height: b.height + 2 * pad }; };
  await page.screenshot({ path: `${OUT}/zustand-ruhe.png`, clip: await clip(page.locator('.ez-aktionen').first()) });
  await pille.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-hover.png`, clip: await clip(page.locator('.ez-aktionen').first()) });
  await page.mouse.down(); await page.waitForTimeout(60); await page.screenshot({ path: `${OUT}/zustand-druck.png`, clip: await clip(page.locator('.ez-aktionen').first()) }); await page.mouse.up();
  await leise.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-hover-leise.png`, clip: await clip(page.locator('.ez-aktionen').first()) });
  await page.mouse.move(5, 5); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/zustand-fokus.png`, clip: await clip(page.locator('.ez-aktionen').first()) });
  await page.locator('.ez-kopf .ez-ansicht a').nth(1).hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-umschalter-hover.png`, clip: await clip(page.locator('.ez-kopf .ez-ansicht')) });
  await page.screenshot({ path: `${OUT}/detail-kopf.png`, clip: { x: 0, y: 0, width: 1280, height: 100 } });
  await page.screenshot({ path: `${OUT}/detail-geraet.png`, clip: { x: 630, y: 100, width: 600, height: 500 } });
  await page.evaluate(() => document.querySelector('#konfigurator').scrollIntoView()); await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/detail-bento.png`, clip: { x: 80, y: 280, width: 1120, height: 420 } });
  await page.evaluate(() => document.querySelector('#stufe-2').scrollIntoView({ block: 'center' })); await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/detail-messen.png`, clip: { x: 80, y: 0, width: 1120, height: 800 } });
  await page.evaluate(() => document.querySelector('#aufmass').scrollIntoView({ block: 'center' })); await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/detail-blatt.png`, clip: { x: 660, y: 0, width: 560, height: 800 } });
  await page.evaluate(() => document.querySelector('#preis').scrollIntoView({ block: 'center' })); await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/detail-preis.png`, clip: { x: 80, y: 100, width: 1120, height: 500 } });
  await page.evaluate(() => document.querySelector('#ratgeber').scrollIntoView()); await page.waitForTimeout(1200);
  const rk = page.locator('.ez-ratgeber a').first(); await rk.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-ratgeber-hover.png`, clip: await clip(rk, 6) });
  await page.evaluate(() => document.querySelector('.ez-fuss').scrollIntoView()); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/detail-fuss.png`, clip: { x: 80, y: 0, width: 1120, height: 800 } });
  await ctx.close();
}
// 3. Leiste mitten im Einblenden, Bento mitten im Gleiten, Stationen beim Wechsel (Rate 0.25)
{
  const { ctx, page } = await neu(1280, 800, 1);
  const cdp = await ctx.newCDPSession(page); await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(2000);
  await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.25 });
  await page.evaluate(() => window.scrollTo(0, 1800)); await page.waitForTimeout(300); await page.evaluate(() => window.scrollTo(0, 1680));
  await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/leiste-mitte.png`, clip: { x: 0, y: 0, width: 1280, height: 120 } });
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/leiste-ende.png`, clip: { x: 0, y: 0, width: 1280, height: 120 } });
  const bento = await page.evaluate(() => { const r = document.querySelector('.ez-bento').getBoundingClientRect(); return r.top + scrollY; });
  await page.evaluate(y => window.scrollTo(0, y - 500), bento); await page.waitForTimeout(400);
  await page.evaluate(y => window.scrollTo(0, y - 80), bento); await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/bento-mitte.png`, clip: { x: 80, y: 0, width: 1120, height: 800 } });
  await page.waitForTimeout(2500); await page.screenshot({ path: `${OUT}/bento-ende.png`, clip: { x: 80, y: 0, width: 1120, height: 800 } });
  await page.evaluate(() => document.querySelector('#stufe-1').scrollIntoView({ block: 'center' })); await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelector('#stufe-2').scrollIntoView({ block: 'center' })); await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/stationen-mitte.png`, clip: { x: 80, y: 180, width: 320, height: 300 } });
  await page.waitForTimeout(2000); await page.screenshot({ path: `${OUT}/stationen-ende.png`, clip: { x: 80, y: 180, width: 320, height: 300 } });
  await ctx.close();
}
await browser.close(); console.log('fertig');

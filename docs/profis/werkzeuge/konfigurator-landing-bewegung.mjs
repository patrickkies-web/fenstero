/* Zeitlupe und Zustände der Landingpage (angepasst aus werkzeuge/bewegung.mjs: andere Bausteine als die Startseite) */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [,, OUT] = process.argv; const URL = process.env.URL || 'http://localhost:8790/lokal.html';
import { mkdirSync } from 'node:fs'; mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
async function neu(w, h, scale = 2) { const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale }); const page = await ctx.newPage(); await page.addInitScript(() => document.addEventListener('click', e => e.preventDefault(), true)); return { ctx, page }; }
{ // 1. Hero-Auftritt am Telefon, Zeitlupe 0,25
  const { ctx, page } = await neu(390, 844, 1);
  const cdp = await ctx.newCDPSession(page); await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.25 });
  const zeiten = [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600, 2000];
  const t0 = Date.now(); await page.goto(URL, { waitUntil: 'commit' });
  for (const z of zeiten) { const ziel = t0 + z * 4; const warte = ziel - Date.now(); if (warte > 0) await page.waitForTimeout(warte); try { await page.screenshot({ path: `${OUT}/hero-${String(z).padStart(4, "0")}.png`, clip: { x: 0, y: 60, width: 390, height: 700 } }); } catch (e) {} }
  await ctx.close();
}
{ // 2. Zustände und Details am Schreibtisch
  const { ctx, page } = await neu(1280, 800, 2);
  await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(2200);
  const clip = async (loc, pad = 14) => { const b = await loc.boundingBox(); return { x: b.x - pad, y: b.y - pad, width: b.width + 2 * pad, height: b.height + 2 * pad }; };
  const akt = page.locator('.ez-hero .ez-aktionen').first(), pille = page.locator('.ez-hero .dna-pille').first(), leise = page.locator('.ez-hero .dna-pille--leise').first();
  await page.screenshot({ path: `${OUT}/zustand-ruhe.png`, clip: await clip(akt) });
  await pille.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-hover.png`, clip: await clip(akt) });
  await page.mouse.down(); await page.waitForTimeout(60); await page.screenshot({ path: `${OUT}/zustand-druck.png`, clip: await clip(akt) }); await page.mouse.up();
  await leise.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-hover-leise.png`, clip: await clip(akt) });
  await page.mouse.move(5, 5); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/zustand-fokus.png`, clip: await clip(akt) });
  await page.screenshot({ path: `${OUT}/detail-kopf.png`, clip: { x: 0, y: 0, width: 1280, height: 100 } });
  await page.screenshot({ path: `${OUT}/detail-buehne.png`, clip: await clip(page.locator('.ez-buehne'), 4) });
  for (const [sel, name, block] of [['.ez-schritte4', 'schritte', 'center'], ['.ez-paar', 'paar', 'center'], ['.ez-route', 'weg', 'center'], ['.ez-bereit', 'bereit', 'center'], ['.ez-fuss', 'fuss', 'center']]) {
    await page.evaluate(([s, b]) => document.querySelector(s).scrollIntoView({ block: b }), [sel, block]); await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/detail-${name}.png`, clip: await clip(page.locator(sel), 8) });
  }
  const knopf = page.locator('.ez-kontakt__wege a').first(); await knopf.hover(); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/zustand-rundknopf-hover.png`, clip: await clip(page.locator('.ez-kontakt__wege'), 10) });
  await ctx.close();
}
{ // 3. Leiste und Vorhang mitten im Wechsel (Zeitlupe 0,25)
  const { ctx, page } = await neu(390, 844, 2);
  const cdp = await ctx.newCDPSession(page); await page.goto(URL, { waitUntil: 'networkidle' }); await page.waitForTimeout(2000);
  await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.25 });
  await page.evaluate(() => window.scrollTo(0, 1800)); await page.waitForTimeout(300); await page.evaluate(() => window.scrollTo(0, 1680));
  await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/leiste-mitte.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });
  await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/leiste-ende.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });
  for (const y of [300, 520, 700]) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/vorhang-${y}.png` }); }
  await ctx.close();
}
await browser.close(); console.log('fertig');

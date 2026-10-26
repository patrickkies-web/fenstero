/* Ruhige Fassung, ohne JavaScript, Schieltest-Bild, Zielgrößen, Tab-Weg */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const URL = process.env.URL || 'http://localhost:8790/lokal.html';
const OUT = process.argv[2] || process.env.OUT || '.'; // Ordner für die zwei Bildschirmfotos (ruhige Fassung, ohne JavaScript)
import { mkdirSync } from 'node:fs'; mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
// 1. weniger Bewegung: steht alles sofort?
let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
let page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(150);
const ruhig = await page.evaluate(() => {
  const h1 = document.querySelector('h1'), p = document.querySelector('.ez-hero .dna-pille');
  const o = el => getComputedStyle(el).opacity;
  return { h1Opacity: o(h1.querySelector('.dna-wort') || h1), pilleOpacity: o(p.closest('[data-dna-auftritt]') || p), animationen: document.getAnimations().length, etikett: (document.querySelector('#hero-etikett') ? o(document.querySelector('#hero-etikett')) : 'kein Etikett') };
});
await page.screenshot({ path: OUT + '/ruhig-tel-01.png' });
await ctx.close();
// 2. ohne JavaScript
ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(300);
const ohneJs = await page.evaluate(() => {
  const o = el => getComputedStyle(el).opacity;
  return { h1: o(document.querySelector('h1')), lead: o(document.querySelector('.ez-hero .dna-text')), pille: o(document.querySelector('.ez-aktionen')), buehne: o(document.querySelector('.ez-buehne')) };
});
await page.screenshot({ path: OUT + '/ohnejs-tel-01.png' });
await ctx.close();
// 3. Zielgrößen und Tab-Weg
ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const ziele = await page.evaluate(() => {
  const klein = [];
  document.querySelectorAll('a, button').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width || el.closest('.ez-leiste') || el.closest('[aria-hidden="true"]')) return; if (r.height < 44 || r.width < 44) klein.push(el.textContent.trim().slice(0, 30) + ' ' + Math.round(r.width) + '×' + Math.round(r.height)); });
  const tab = [...document.querySelectorAll('a[href], button, [tabindex="0"]')].filter(el => !el.closest('.ez-leiste') && el.tabIndex >= 0 && !el.closest('[aria-hidden="true"]')).slice(0, 12).map(el => el.textContent.trim().slice(0, 24) || el.getAttribute('aria-label'));
  return { klein, tab, chipsScrollbar: (() => { const u = document.querySelector('.ez-chips ul'); return u ? u.scrollWidth > u.clientWidth : 'keine Chipreihe'; })() };
});
console.log(JSON.stringify({ ruhig, ohneJs, ziele }, null, 1));
await ctx.close();
await browser.close();

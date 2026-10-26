/* Leistungsdiagnose: Layoutsprünge (CLS), lange Aufgaben, Schriftwechsel, Filter-Ebenen, Bildbytes; CPU 4× gedrosselt wie ein Mittelklasse-Telefon */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const URL = process.env.URL || 'http://localhost:8790/lokal.html';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(() => {
  window.__cls = 0; window.__shifts = []; window.__long = [];
  new PerformanceObserver(l => { for (const e of l.getEntries()) { if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), q: (e.sources || []).map(s => s.node && s.node.className ? String(s.node.className).slice(0, 40) : (s.node && s.node.tagName)).slice(0, 3) }); } } }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
});
const t0 = Date.now();
await page.goto(URL, { waitUntil: 'load' });
const ladezeit = Date.now() - t0;
await page.waitForTimeout(500);
const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight); });
// schnell scrollen wie ein ungeduldiger Daumen
for (let i = 1; i <= 16; i++) { await page.evaluate(y => window.scrollTo(0, y), i * 500); await page.waitForTimeout(120); }
await page.waitForTimeout(800);
const r = await page.evaluate(() => {
  const filter = [...document.querySelectorAll('*')].filter(el => { const cs = getComputedStyle(el); return (cs.filter && cs.filter !== 'none') || (cs.backdropFilter && cs.backdropFilter !== 'none'); }).length;
  const pseudo = [...document.querySelectorAll('*')].filter(el => { const b = getComputedStyle(el, '::before'); return b.filter && b.filter !== 'none' && b.content !== 'none'; }).length;
  const bilder = performance.getEntriesByType('resource').filter(e => /\.(webp|png|jpg)$/.test(e.name)).reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0);
  const lazy = document.querySelectorAll('img[loading="lazy"]').length;
  const unsichtbar = [...document.querySelectorAll('[data-dna-auftritt]')].filter(el => !el.classList.contains('ist-da')).length;
  return { cls: +window.__cls.toFixed(4), shifts: window.__shifts.slice(0, 8), langeAufgaben: window.__long.length, laengste: Math.max(0, ...window.__long), filterEbenen: filter, pseudoFilter: pseudo, bildBytesKB: Math.round(bilder / 1024), lazyBilder: lazy, auftrittNochUnsichtbar: unsichtbar, sticky: document.querySelectorAll('.dna-szene').length };
});
console.log(JSON.stringify({ ladezeitMs: ladezeit, schriften: fonts, ...r }, null, 1));
await browser.close();

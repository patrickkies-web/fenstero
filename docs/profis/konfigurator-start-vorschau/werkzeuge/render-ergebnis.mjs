import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
/* Ergebnis: das Modell der Wünsche in der Ansicht „result“ der App (Bühne 358 × 300), Faktor 6, dazu die Lagen der vier Maßlinien
   (hm, wm, eh, ew) wie die App sie im Ergebnis zeigt; buehne.js nur im Testbrowser umgeschrieben */
const OUT = 'mess-render/ergebnis'; mkdirSync(OUT, { recursive: true });
const NUR = process.argv[2] ? process.argv[2].split(',') : null;
const DPR = +(process.env.DPR || 6);
const WERTE = { fenster: ['1410', '1350', '1240', '1180'], balkon: ['2150', '2110', '900', '860'], fest: ['1250', '1210', '1500', '1450'], hst: ['2250', '2210', '3500', '3440'], psk: ['2150', '2110', '2000', '1950'], fsw: ['2250', '2210', '3500', '3440'] };
const RAND = { fenster: ['1405', '1408', '1238', '1236'], balkon: ['2148', '2146', '898', '897'], fest: ['1248', '1246', '1498', '1497'], hst: ['2248', '2246', '3498', '3497'], psk: ['2148', '2146', '1998', '1997'], fsw: ['2248', '2246', '3498', '3497'] };
const STIL = `.w3d-dim,.w3d-ueber,.w3d-feldlage,.w3d-hint,.rail,.w3d-selring,.w3d-ctl{visibility:hidden!important} #w3d,#w3d canvas{border-radius:0!important} #w3d::before,#w3d::after{border-radius:0!important}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const art of Object.keys(WERTE)) {
  if (NUR && !NUR.includes(art)) continue;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 560 }, deviceScaleFactor: DPR, locale: 'de-DE', reducedMotion: 'reduce' });
  await ctx.route('**/assets/buehne.js*', async (route) => { const r = await route.fetch(); let t = await r.text(); const n = t.replace('Math.min(window.devicePixelRatio || 1, 2)', '(window.devicePixelRatio || 1)'); if (n === t) throw new Error('Stelle in buehne.js nicht gefunden'); await route.fulfill({ response: r, body: n }); });
  const page = await ctx.newPage(); page.setDefaultTimeout(180000);
  await page.goto('http://localhost:8788/app/?gl=voll', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await page.click('button[data-act="new"]'); await page.waitForTimeout(900);
  await page.click(`.st-mini[data-v="${art}"]`); await page.waitForTimeout(700);
  await page.click('button[data-act="go"][data-v="fotos"]'); await page.waitForTimeout(900);
  await page.click('button[data-act="ohne-foto"]'); await page.waitForTimeout(500);
  await page.click('button[data-act="ohne-foto-weiter"]'); await page.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) {
    await page.click('button[data-act="mess-auf"]'); await page.waitForTimeout(300);
    for (const d of WERTE[art][i]) await page.click(`.keypad button[data-v="${d}"]`);
    await page.waitForTimeout(200); await page.click('button[data-act="mess-next"]'); await page.waitForTimeout(500);
    const w = await page.$('button[data-act="mess-next"][data-ack="1"]'); if (w) { await w.click(); await page.waitForTimeout(400); }
    await page.click('button[data-act="mess-weiter"]'); await page.waitForTimeout(800);
  }
  for (let i = 0; i < 4; i++) {
    await page.click('button[data-act="rest-auf"]'); await page.waitForTimeout(300);
    for (const d of RAND[art][i]) await page.click(`.keypad button[data-v="${d}"]`);
    await page.waitForTimeout(200); await page.click('button[data-act="rest-next"]'); await page.waitForTimeout(500);
    const w = await page.$('button[data-act="rest-next"][data-ack="1"]'); if (w) { await w.click(); await page.waitForTimeout(400); }
    await page.click('button[data-act="rest-weiter"]'); await page.waitForTimeout(900);
  }
  await page.click('button[data-act="go"][data-v="ergebnis"]'); await page.waitForTimeout(2500);
  const lage = await page.evaluate(() => {
    const st = document.getElementById('w3d'), r0 = st.getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return [+(r.x - r0.x).toFixed(1), +(r.y - r0.y).toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)]; };
    const o = { stage: [+r0.width.toFixed(1), +r0.height.toFixed(1)], dims: {} };
    st.querySelectorAll('.w3d-dim').forEach((d) => { const k = d.getAttribute('data-dim'); if (!k) return; o.dims[k] = { cls: d.className, line: rel(d.querySelector('.w3d-dim-line')), caps: [...d.querySelectorAll('.w3d-dim-cap')].map(rel), lab: d.querySelector('.w3d-dim-lab') ? rel(d.querySelector('.w3d-dim-lab')) : null, text: (d.querySelector('.w3d-dim-lab') || {}).textContent }; });
    return o;
  });
  await page.evaluate((css) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }, STIL);
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => { const st = document.getElementById('w3d'), cv = st.querySelector('canvas'); return { gl: st.classList.contains('gl'), css: [st.clientWidth, st.clientHeight], cv: cv ? [cv.width, cv.height] : null }; });
  await page.locator('#w3d').screenshot({ path: `${OUT}/${art}.png`, timeout: 240000, animations: 'disabled' });
  writeFileSync(`${OUT}/lage-${art}.json`, JSON.stringify(lage, null, 1));
  console.log(art, JSON.stringify(info), Object.keys(lage.dims).join(','));
  await ctx.close();
}
await browser.close();

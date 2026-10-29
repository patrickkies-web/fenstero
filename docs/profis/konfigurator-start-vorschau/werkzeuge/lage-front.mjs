import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
/* Frontansicht (VIEWS.front der App, --rx 0, --ry 0) des Modells der Wünsche, Faktor 6, für die waagerechten Maße; dazu die Lagen
   aller vier Maßlinien in dieser Ansicht (buehne.js nur im Testbrowser umgeschrieben, die Datei bleibt unberührt) */
const OUT = 'mess-render/front-lage'; mkdirSync(OUT, { recursive: true });
const NUR = process.argv[2] ? process.argv[2].split(',') : null;
const WERTE = { fenster: ['1410', '1350', '1240', '1180'], balkon: ['2150', '2110', '900', '860'], fest: ['1250', '1210', '1500', '1450'], hst: ['2250', '2210', '3500', '3440'], psk: ['2150', '2110', '2000', '1950'], fsw: ['2250', '2210', '3500', '3440'] };
const STIL = `.w3d-dim,.w3d-ueber,.w3d-feldlage,.w3d-hint,.rail,.w3d-selring{visibility:hidden!important} #w3d,#w3d canvas{border-radius:0!important} #w3d::before,#w3d::after{border-radius:0!important}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const art of Object.keys(WERTE)) {
  if (NUR && !NUR.includes(art)) continue;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 418 }, deviceScaleFactor: 1, locale: 'de-DE', reducedMotion: 'reduce' });
  if (false) await ctx.route('**/assets/buehne.js*', async (route) => { const r = await route.fetch(); let t = await r.text(); const n = t.replace('Math.min(window.devicePixelRatio || 1, 2)', '(window.devicePixelRatio || 1)'); if (n === t) throw new Error('Stelle in buehne.js nicht gefunden'); await route.fulfill({ response: r, body: n }); });
  const page = await ctx.newPage();
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
    if (i < 3) { await page.click('button[data-act="mess-weiter"]'); await page.waitForTimeout(800); }
  }
  const front = () => page.evaluate(() => { const st = document.getElementById('w3d'); st.style.setProperty('--rx', '0deg'); st.style.setProperty('--ry', '0deg'); st.classList.remove('raum-licht'); const el = st.querySelector('.w3d-el.is-hidden'); if (el) el.classList.remove('is-hidden'); });
  const lageHolen = () => page.evaluate(() => {
    const st = document.getElementById('w3d'), r0 = st.getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return [+(r.x - r0.x).toFixed(1), +(r.y - r0.y).toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)]; };
    const dim = st.querySelector('.w3d-dim.is-active');
    return { stage: [+r0.width.toFixed(1), +r0.height.toFixed(1)], dimCls: dim.className, line: rel(dim.querySelector('.w3d-dim-line')), caps: [...dim.querySelectorAll('.w3d-dim-cap')].map(rel) };
  });
  const lage = {};
  await front(); await page.waitForTimeout(6000);
  lage[4] = await lageHolen();
  for (let i = 3; i >= 1; i--) { await page.click('.mess-dock button[data-v="zurueck"]'); await page.waitForTimeout(900); await front(); await page.waitForTimeout(4000); lage[i] = await lageHolen(); }
  writeFileSync(`${OUT}/lage-${art}.json`, JSON.stringify(lage, null, 1));
  console.log(art, JSON.stringify(lage[4].caps));
  await ctx.close();
}
await browser.close();

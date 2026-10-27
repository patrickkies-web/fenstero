import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
/* Lagen der vier Randmaße (Höhe links/rechts, Breite oben/unten) im Modell der App, schräg und von vorn, Bühne 358 × 234 wie die Messbilder */
const OUT = process.env.OUT || 'mess-render/rand2'; mkdirSync(OUT, { recursive: true });
const NUR = process.argv[2] ? process.argv[2].split(',') : null;
const WERTE = { fenster: ['1410', '1350', '1240', '1180'], balkon: ['2150', '2110', '900', '860'], fest: ['1250', '1210', '1500', '1450'], hst: ['2250', '2210', '3500', '3440'], psk: ['2150', '2110', '2000', '1950'], fsw: ['2250', '2210', '3500', '3440'] };
const RAND = { fenster: ['1405', '1408', '1238', '1236'], balkon: ['2148', '2146', '898', '897'], fest: ['1248', '1246', '1498', '1497'], hst: ['2248', '2246', '3498', '3497'], psk: ['2148', '2146', '1998', '1997'], fsw: ['2248', '2246', '3498', '3497'] };
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const art of Object.keys(WERTE)) {
  if (NUR && !NUR.includes(art)) continue;
  const ctx = await browser.newContext({ viewport: { width: +(process.env.VW || 358), height: +(process.env.VH || 400) }, deviceScaleFactor: 1, locale: 'de-DE', reducedMotion: 'reduce' });
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
    await page.click('button[data-act="mess-weiter"]'); await page.waitForTimeout(800);
  }
  const lageHolen = () => page.evaluate(() => {
    const st = document.getElementById('w3d'), r0 = st.getBoundingClientRect();
    const rel = (el) => { const r = el.getBoundingClientRect(); return [+(r.x - r0.x).toFixed(1), +(r.y - r0.y).toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)]; };
    const dim = st.querySelector('.w3d-dim.is-active');
    return { stage: [+r0.width.toFixed(1), +r0.height.toFixed(1)], dimCls: dim.className, line: rel(dim.querySelector('.w3d-dim-line')), caps: [...dim.querySelectorAll('.w3d-dim-cap')].map(rel) };
  });
  const front = () => page.evaluate(() => { const st = document.getElementById('w3d'); st.style.setProperty('--rx', '0deg'); st.style.setProperty('--ry', '0deg'); });
  /* wie beim Rendern der Bilder: Lage für die Bühne im Raum gerechnet, dann ohne raum-licht (358 × 234) aufgenommen */
  const wieBild = () => page.evaluate(() => { const st = document.getElementById('w3d'); st.classList.remove('raum-licht'); const el = st.querySelector('.w3d-el.is-hidden'); if (el) el.classList.remove('is-hidden'); });
  const lage = {};
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1500); await wieBild(); await page.waitForTimeout(1500); const s = await lageHolen();
    await front(); await page.waitForTimeout(3500); const f = await lageHolen();
    lage[i + 1] = { schraeg: s, front: f };
    await page.click('button[data-act="rest-auf"]'); await page.waitForTimeout(300);
    for (const d of RAND[art][i]) await page.click(`.keypad button[data-v="${d}"]`);
    await page.waitForTimeout(200); await page.click('button[data-act="rest-next"]'); await page.waitForTimeout(500);
    const w = await page.$('button[data-act="rest-next"][data-ack="1"]'); if (w) { await w.click(); await page.waitForTimeout(400); }
    if (i < 3) { await page.click('button[data-act="rest-weiter"]'); await page.waitForTimeout(900); }
  }
  writeFileSync(`${OUT}/lage-${art}.json`, JSON.stringify(lage, null, 1));
  console.log(art, JSON.stringify(lage[1].schraeg.caps), JSON.stringify(lage[3].front.caps));
  await ctx.close();
}
await browser.close();

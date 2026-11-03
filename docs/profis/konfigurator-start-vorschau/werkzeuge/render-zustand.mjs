import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
/* Messbild einer Elementart mit dem Zustand direkt gesetzt (3.11.2026, für die Haustür): alte Messansicht der App (SCREENS.messenAlt),
   Bühne 358 × 234, Faktor 6, dieselben Werte wie die Balkontür, damit die Linienlagen (MESS_LAGE usw.) gleich bleiben.
   Aufruf gegen den Dev-Server auf 8797: node render-zustand.mjs <art> [schraeg|front] [griffA]; buehne.js nur im Testbrowser umgeschrieben */
const art = process.argv[2], ansicht = process.argv[3] || 'schraeg';
const STIL = `.w3d-dim,.w3d-ueber,.w3d-feldlage,.w3d-hint,.rail,.w3d-selring{visibility:hidden!important} #w3d,#w3d canvas{border-radius:0!important} #w3d::before,#w3d::after{border-radius:0!important}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 418 }, deviceScaleFactor: 6, locale: 'de-DE', reducedMotion: 'reduce' });
await ctx.route('**/assets/buehne.js*', async (route) => { const r = await route.fetch(); let t = await r.text(); const n = t.replace('RUHE_DPR = 3, RUHE_PX = 1.3e6', 'RUHE_DPR = 6, RUHE_PX = 1e9'); if (n === t) throw new Error('Stelle in buehne.js nicht gefunden'); await route.fulfill({ response: r, body: n }); });
const page = await ctx.newPage(); const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
await page.goto('http://localhost:8797/app/?gl=voll', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
await page.evaluate(([art, process_griff]) => {
  const w = baseWin(); artSetzen(w, art); w.ohneFoto = true;
  if (process_griff) w.ht.griffA = process_griff; w.mo.hm = 2150; w.el.h = 2110; w.mo.wm = 900; w.el.w = 860;
  S.win = w; S.editIdx = -1; S.windows = []; S.mess = Object.assign(S.mess || {}, { step: 3, cur: '860', pad: false, msg: null }); S.screen = 'messenAlt'; render(true);
}, [art, process.argv[4] || '']);
await page.waitForTimeout(1500);
const lage = await page.evaluate(({ css, front }) => {
  const st = document.getElementById('w3d');
  if (front) { st.style.setProperty('--rx', '0deg'); st.style.setProperty('--ry', '0deg'); }
  st.classList.remove('raum-licht'); const el = st.querySelector('.w3d-el.is-hidden'); if (el) el.classList.remove('is-hidden');
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  const r0 = st.getBoundingClientRect(); return { gl: st.classList.contains('gl'), css: [st.clientWidth, st.clientHeight], top: r0.top };
}, { css: STIL, front: ansicht === 'front' });
await page.waitForTimeout(5000);
await page.locator('#w3d').screenshot({ path: `${art}-${ansicht}${process.argv[4] ? '-' + process.argv[4] : ''}.png`, timeout: 240000, animations: 'disabled' });
console.log(art, ansicht, JSON.stringify(lage), JSON.stringify(fehler));
await browser.close();

/* Renderings für die Bühne „So geht es“: dasselbe Fenster (2 Flügel, 1.760 × 1.385 mm in einer Öffnung von 1.790 × 1.410 mm) aus dem 3-D-Modell der App.
   Szene 1: in der Wand, innen und außen (Bildschirm „frage“ ohne Bedienelemente). Szene 3: freigestellt (Startbühne, frei), drei Ausführungen mit derselben Kamera. */
import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node-tools/')('playwright');
const b = await chromium.launch({ args: ['--no-proxy-server'] });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 4, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://localhost:8788/app/', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  window.__fenster = (fa, fi, extra) => Object.assign(baseWin(), { name: 'Wohnzimmer', art: 'fenster', teilung: '2p', sashes: sashesFor('2p'), e_teilung: true, w: 1760, h: 1385, mo: { hm: 1410, hl: 1410, hr: 1410, wm: 1790, wt: 1790, wb: 1790 }, el: { w: 1760, h: 1385 }, bru: 620, laib: 140, fa: fa, fi: fi, material: 'kunststoff', roll: 'keiner', sart: 'keiner', fotos: 2 }, extra || {});
  START_MASS.fenster = [1760, 1385, 620];
  const base = startWin; window.__cfg = null;
  window.startWin = function (w) { const v = base(w); if (window.__cfg) { Object.assign(v, window.__cfg); if (window.__cfg.teilung) v.sashes = sashesFor(window.__cfg.teilung); if (window.__cfg.preset) v.bars = presetBars(window.__cfg.preset, v.sashes.length); } return v; };
});
const ohneUi = '.w3d-hint,.w3d-ctl,.rail{display:none!important}';
for (const [name, q, fa, fi] of [['wand-innen', 'material', '7016', '9016'], ['wand-aussen', 'fa', '7016', '9016']]) {
  await p.evaluate(([q, fa, fi]) => { const w = window.__fenster(fa, fi); S.windows = [w]; S.win = w; S.editIdx = 0; S.q = q; go('frage'); }, [q, fa, fi]);
  await p.waitForTimeout(1800);
  await p.addStyleTag({ content: ohneUi });
  await p.waitForTimeout(200);
  await p.locator('#w3d').screenshot({ path: name + '.png' });
  console.log(name, await p.evaluate(() => S.screen + '|' + S.q));
}
await p.setViewportSize({ width: 390, height: 844 });
await c.close();
const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 7, reducedMotion: 'reduce' });
const p2 = await c2.newPage();
await p2.goto('http://localhost:8788/app/', { waitUntil: 'networkidle' });
await p2.evaluate(() => { START_MASS.fenster = [1760, 1385, 620]; const base = startWin; window.__cfg = null; window.startWin = function (w) { const v = base(w); if (window.__cfg) { Object.assign(v, window.__cfg); if (window.__cfg.teilung) v.sashes = sashesFor(window.__cfg.teilung); if (window.__cfg.preset) v.bars = presetBars(window.__cfg.preset, v.sashes.length); } return v; }; });
for (const [name, fa, fi, cfg] of [['aufwaermen', '9016', '9016', { teilung: '2p' }], ['modell-weiss', '9016', '9016', { teilung: '2p' }], ['modell-anthrazit', '7016', '7016', { teilung: '2p' }], ['modell-sprosse', '7016', '7016', { teilung: '2p', spross: 'wiener', preset: 'sechs' }]]) {
  await p2.evaluate(([fa, fi, cfg]) => { window.__cfg = cfg; S.win = Object.assign(baseWin(), { art: 'fenster', material: 'kunststoff', fa: fa, fi: fi }); go('start'); }, [fa, fi, cfg]);
  await p2.waitForTimeout(1600);
  await p2.addStyleTag({ content: 'html,body,.app,.scr,.scroll,main,.st-buehne,.st-held{background:transparent!important} .st-boden{display:none!important}' });
  await p2.locator('.st-held').first().screenshot({ path: name + '.png', omitBackground: true });
  console.log(name);
}
await b.close();

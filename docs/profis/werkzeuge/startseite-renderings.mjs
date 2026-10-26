/* Elemente für das Band „Aus dem Konfigurator“: freigestellt aus dem 3-D-Modell der App (Startbühne, frei), Sonnenschutz halb heruntergefahren */
import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node-tools/')('playwright');
const KONF = [
  ['fsw', { art: 'fsw', material: 'alu', fa: '7016', fi: '7016' }, {}],
  ['rund', { art: 'fenster', material: 'kunststoff', fa: '7016', fi: '7016' }, { teilung: '1', form: 'rund' }],
  ['sprosse', { art: 'fenster', material: 'kunststoff', fa: '9016', fi: '9016' }, { teilung: '2p', spross: 'wiener', preset: 'sechs' }],
  ['raffstore', { art: 'fenster', material: 'alu', fa: '7016', fi: '7016' }, { teilung: '2p', sart: 'raffstore', einbau: 'vorbau', roll: 'vorbau', sfarbe: 'anthrazit', antrieb: 'motor', __view: 'outside' }],
  ['hst', { art: 'hst', material: 'alu', fa: '9005', fi: '9005' }, {}],
  ['rundbogen', { art: 'fenster', material: 'holz', fa: 'eiche', fi: 'eiche' }, { teilung: '1', form: 'rundbogen' }],
  ['rollladen', { art: 'fenster', material: 'kunststoff', fa: 'goak', fi: 'goak' }, { teilung: '3', sart: 'rollladen', roll: 'vorbau', einbau: 'vorbau', sfarbe: 'braun', antrieb: 'motor', __view: 'outside' }],
  ['trapez', { art: 'fest', material: 'alu', fa: '7016', fi: '7016' }, { form: 'trapez' }],
  ['balkon', { art: 'balkon', material: 'kunststoff', fa: '9016', fi: '9016' }, { spross: 'wiener', preset: 'quer' }],
  ['psk', { art: 'psk', material: 'kunststoffalu', fa: '7016', fi: '9016' }, {}],
  ['segment', { art: 'fenster', material: 'kunststoff', fa: '9001', fi: '9001' }, { teilung: '2p', form: 'segment', spross: 'echt', preset: 'kreuz' }]
];
const b = await chromium.launch({ args: ['--no-proxy-server'] });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 4, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://localhost:8788/app/', { waitUntil: 'networkidle' });
await p.evaluate(() => { const base = startWin; window.__cfg = null; window.startWin = function (w) { const v = base(w); if (window.__cfg) { Object.assign(v, window.__cfg); if (window.__cfg.teilung) v.sashes = sashesFor(window.__cfg.teilung); if (window.__cfg.preset) v.bars = presetBars(window.__cfg.preset, v.sashes.length); } return v; }; W3D_BEHANG.stand = 0.55; const m0 = model; window.__view = null; window.model = function (w, o) { if (window.__view && o && String(o.cls || '').indexOf('st-schwebe') >= 0) o = Object.assign({}, o, { view: window.__view }); return m0(w, o); }; });
const css = 'html,body,.app,.scr,.scroll,main,.st-buehne,.st-held{background:transparent!important} .st-boden{display:none!important}';
for (const [name, win, cfg] of [['aufwaermen', { art: 'fenster', fa: '9016', fi: '9016' }, {}], ...KONF]) {
  await p.evaluate(([win, cfg]) => { window.__view = cfg.__view || null; window.__cfg = Object.assign({}, cfg); delete window.__cfg.__view; W3D_BEHANG.stand = 0.55; S.win = Object.assign(baseWin(), win); go('start'); }, [win, cfg]);
  await p.waitForTimeout(1500); await p.addStyleTag({ content: css });
  await p.locator('.st-held').first().screenshot({ path: name + '.png', omitBackground: true });
}
console.log('fertig', await p.evaluate(() => W3D_BEHANG.stand));
await b.close();

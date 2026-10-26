import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire('/opt/node-tools/')('playwright');
const KONF = [
  ['dk2', { art: 'fenster', material: 'kunststoff', fa: '7016', fi: '7016' }, { teilung: '2p' }],
  ['rundbogen', { art: 'fenster', material: 'holz', fa: 'eiche', fi: 'eiche' }, { teilung: '2p', form: 'rundbogen' }],
  ['balkon', { art: 'balkon', material: 'kunststoff', fa: '9016', fi: '9016' }, {}],
  ['hst', { art: 'hst', material: 'alu', fa: '9005', fi: '9005' }, {}],
  ['sprosse', { art: 'fenster', material: 'kunststoff', fa: '9016', fi: '9016' }, { teilung: '2p', spross: 'wiener', preset: 'sechs' }],
  ['trapez', { art: 'fest', material: 'alu', fa: '7016', fi: '7016' }, { form: 'trapez' }],
  ['psk', { art: 'psk', material: 'kunststoffalu', fa: '7016', fi: '9016' }, {}],
  ['fsw', { art: 'fsw', material: 'alu', fa: 'db703', fi: 'db703' }, {}],
  ['dreifluegel', { art: 'fenster', material: 'kunststoff', fa: 'goak', fi: 'goak' }, { teilung: '3' }]
];
const b = await chromium.launch({ args: ['--no-proxy-server'] });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 4, reducedMotion: 'reduce' });
const p = await c.newPage();
await p.goto('http://localhost:8788/app/', { waitUntil: 'networkidle' });
await p.evaluate(() => { const base = startWin; window.__cfg = null; window.startWin = function (w) { const v = base(w); if (window.__cfg) { Object.assign(v, window.__cfg); if (window.__cfg.teilung) v.sashes = sashesFor(window.__cfg.teilung); } return v; }; });
await p.addStyleTag({ content: 'html,body,.app,.scr,.scroll,main,.st-buehne,.st-held{background:transparent!important} .st-boden{display:none!important}' });
for (const [name, win, cfg] of KONF) {
  await p.evaluate(([win, cfg]) => { window.__cfg = cfg; S.win = Object.assign(baseWin(), win); go('start'); }, [win, cfg]);
  await p.waitForTimeout(1600);
  await p.addStyleTag({ content: 'html,body,.app,.scr,.scroll,main,.st-buehne,.st-held{background:transparent!important} .st-boden{display:none!important}' });
  await p.locator('.st-held').first().screenshot({ path: name + '.png', omitBackground: true });
  console.log(name);
}
await b.close();

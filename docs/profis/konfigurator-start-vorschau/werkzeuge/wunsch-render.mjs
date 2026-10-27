import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
/* Wünsche der App (Fenster, „Üblich“): je Frage Inhalt (Texte, Optionen, Erklärungen) aus dem DOM und das Modell der Bühne als Bild,
   bei Auswahlfragen zusätzlich je Option; buehne.js nur im Testbrowser umgeschrieben (Pixeldichte), die Datei bleibt unberührt */
const OUT = process.env.OUT || 'wunsch-render'; mkdirSync(OUT, { recursive: true });
const DPR = +(process.env.DPR || 4), NUR = process.env.NUR ? process.env.NUR.split(',').map(Number) : null, OHNE_OPT = !!process.env.OHNE_OPT;
const STIL = `.w3d-ctl,.w3d-hint,.rail,.w3d-ueber,.w3d-feldlage{visibility:hidden!important} #w3d,#w3d canvas{border-radius:0!important} #w3d::before,#w3d::after{border-radius:0!important}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 640 }, deviceScaleFactor: DPR, locale: 'de-DE', reducedMotion: 'reduce' });
await ctx.route('**/assets/buehne.js*', async (route) => { const r = await route.fetch(); const t = await r.text(); const n = t.replace('Math.min(window.devicePixelRatio || 1, 2)', '(window.devicePixelRatio || 1)'); if (n === t) throw new Error('Stelle in buehne.js nicht gefunden'); await route.fulfill({ response: r, body: n }); });
const page = await ctx.newPage(); page.setDefaultTimeout(240000);
await page.goto('http://localhost:8788/app/?gl=voll', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
await page.click('button[data-act="new"]'); await page.waitForTimeout(900);
await page.click('.st-mini[data-v="fenster"]'); await page.waitForTimeout(600);
await page.click('button[data-act="go"][data-v="fotos"]'); await page.waitForTimeout(900);
await page.click('button[data-act="ohne-foto"]'); await page.waitForTimeout(500);
await page.click('button[data-act="ohne-foto-weiter"]'); await page.waitForTimeout(1500);
const W = ['1410', '1350', '1240', '1180'], R = ['1405', '1408', '1238', '1236'];
for (let i = 0; i < 4; i++) { await page.click('button[data-act="mess-auf"]'); await page.waitForTimeout(200); for (const d of W[i]) await page.click(`.keypad button[data-v="${d}"]`); await page.click('button[data-act="mess-next"]'); await page.waitForTimeout(500); await page.click('button[data-act="mess-weiter"]'); await page.waitForTimeout(900); }
for (let i = 0; i < 4; i++) { await page.click('button[data-act="rest-auf"]'); await page.waitForTimeout(200); for (const d of R[i]) await page.click(`.keypad button[data-v="${d}"]`); await page.click('button[data-act="rest-next"]'); await page.waitForTimeout(500); await page.click('button[data-act="rest-weiter"]'); await page.waitForTimeout(900); }
await page.click('button[data-act="go"][data-v="ergebnis"]'); await page.waitForTimeout(1500);
await page.click('[data-act="wuensche"]'); await page.waitForTimeout(1500);
await page.click('button[data-act="lg-raum"][data-v="Küche"]'); await page.waitForTimeout(400);
await page.evaluate((css) => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }, STIL);
const lesen = () => page.evaluate(() => {
  const s = document.querySelector('.scr'), t = (e) => (e ? e.textContent.replace(/\s+/g, ' ').trim() : ''), ar = (e, a) => (e ? e.getAttribute(a) : null);
  const h1 = s.querySelector('h1'), h1c = h1 ? h1.cloneNode(true) : null; if (h1c) h1c.querySelectorAll('button').forEach((b) => b.remove());
  const qg = h1 ? h1.querySelector('.qg, .lg-i') : null, panel = s.querySelector('.qpanel'), st = document.getElementById('w3d');
  const info = (el) => { const i = el && el.querySelector('.qinfo, .qci-i, .ibtn'); return i ? { k: ar(i, 'data-k'), label: ar(i, 'aria-label') } : null; };
  const bloecke = [];
  if (panel) [...panel.children].forEach((el) => {
    const c = el.className || '';
    if (/qcards|qformen|formen/.test(c) || el.querySelector(':scope > .qo')) bloecke.push({ typ: 'karten', cls: c, opts: [...el.querySelectorAll('.qo')].map((o) => { const b = o.querySelector('.qopt'); return { act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b.querySelector('.lbl')) || ar(b, 'aria-label') || t(b), sb: t(b.querySelector('.sb')), pr: t(b.querySelector('.pr')), an: ar(b, 'aria-pressed') === 'true', info: info(o), ico: b.querySelector('svg') ? b.querySelector('svg').outerHTML : '' }; }) });
    else if (/qswatches/.test(c)) bloecke.push({ typ: 'tupfen', label: ar(el, 'aria-label'), opts: [...el.querySelectorAll('.qsw')].map((b) => ({ act: ar(b, 'data-act'), side: ar(b, 'data-side'), v: ar(b, 'data-v'), name: ar(b, 'aria-label'), farbe: (b.querySelector('.c') || {}).style ? b.querySelector('.c').style.background : '', an: ar(b, 'aria-pressed') === 'true' })) });
    else if (/fw-zeile/.test(c)) bloecke.push({ typ: 'aktuell', b: t(el.querySelector('b')), small: t(el.querySelector('small')), aktion: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b) })) });
    else if (/qlist/.test(c)) bloecke.push({ typ: 'liste', multi: /mehrfach/i.test(t(s.querySelector('.hd > p:not(.eyebrow)'))), opts: [...el.querySelectorAll('.qli')].map((o) => { const b = o.querySelector('button:not(.qci-i)'); return { act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true', info: info(o), ico: b.querySelector('svg') ? b.querySelector('svg').outerHTML : '' }; }) });
    else if (/qsteps/.test(c)) bloecke.push({ typ: 'zaehler', opts: [...el.querySelectorAll('.qstep')].map((o) => ({ b: t(o.querySelector('.t b')), small: t(o.querySelector('.t small')), wert: t(o.querySelector('.stepper b')), d: ar(o.querySelector('button'), 'data-d'), act: ar(o.querySelector('button'), 'data-act') })) });
    else if (/seg/.test(c)) bloecke.push({ typ: 'segment', opts: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true' })) });
    else if (/qchips/.test(c)) bloecke.push({ typ: 'chips', cls: c, opts: [...el.querySelectorAll('.chip')].map((b) => ({ act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true', info: info(b.parentNode) })) });
    else if (/qlabel/.test(c)) bloecke.push({ typ: 'label', text: t(el) });
    else if (/^rows/.test(c)) bloecke.push({ typ: 'zeilen', opts: [...el.children].map((r) => r.classList.contains('sw-row') ? { art: 'schalter', b: t(r.querySelector('.t b')), small: t(r.querySelector('.t small')), f: ar(r.querySelector('.switch'), 'data-f'), an: ar(r.querySelector('.switch'), 'aria-checked') === 'true', info: info(r) } : r.classList.contains('trow') ? { art: 'text', label: t(r.querySelector('span')), ph: ar(r.querySelector('textarea, input'), 'placeholder'), f: ar(r.querySelector('textarea, input'), 'data-f') } : { art: 'sonst', text: t(r) }) });
    else if (/qrow/.test(c)) bloecke.push({ typ: 'hinweise', texts: [...el.children].map((x) => t(x)).filter(Boolean) });
    else if (/qoffen/.test(c)) bloecke.push({ typ: 'offen', f: ar(el, 'data-f'), b: t(el.querySelector('b')), small: t(el.querySelector('small')), an: ar(el, 'aria-pressed') === 'true' });
    else if (/qmehr/.test(c)) bloecke.push({ typ: 'mehr', v: ar(el, 'data-v'), b: t(el.querySelector('b')), small: t(el.querySelector('small')) });
    else if (/qcur/.test(c)) bloecke.push({ typ: 'aktuell', b: t(el), small: '' });
    else if (/qteile/.test(c)) bloecke.push({ typ: 'aufteilung', titel: t(el.querySelector('.qlabel')), werte: [...el.querySelectorAll('.st-wert')].map((x) => ({ b: t(x.querySelector('b')), small: t(x.querySelector('small')), label: ar(x, 'aria-label') })), regler: ar(el.querySelector('input[type="range"]'), 'aria-label'), hinweis: t(el.querySelector('.qrow')) });
    else if (/fw-mehr/.test(c)) bloecke.push({ typ: 'knoepfe', opts: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b) })) });
    else if (/fw-hinweis|sub/.test(c)) bloecke.push({ typ: 'hinweis', text: t(el) });
    else if (/farbfeld|ff-info/.test(c) && !t(el)) { /* leer, nur für „Alle Farben“ */ }
    else bloecke.push({ typ: 'sonst', cls: c, text: t(el).slice(0, 300) });
  });
  return {
    id: ar(panel, 'data-q') || (s.querySelector('.lg-haus') ? 'lage' : s.querySelector('.lp-raster') ? 'tiefe' : ''),
    kap: t(s.querySelector('.ql[aria-current]')), kapitel: [...s.querySelectorAll('.ql')].map((b) => ({ v: ar(b, 'data-v'), kap: ar(b, 'data-kap'), n: t(b), fertig: b.classList.contains('fertig') })),
    eyebrow: t(s.querySelector('.eyebrow')), tiefe: t(s.querySelector('.qtiefe')), h1: h1c ? h1c.innerHTML.replace(/<span class="ak">(.*?)<\/span>/g, '<em>$1</em>').replace(/\s+/g, ' ').trim() : '',
    gloss: qg ? { k: ar(qg, 'data-k'), label: ar(qg, 'aria-label') } : null, sub: t(s.querySelector('.qdock .hd > p:not(.eyebrow), .hd > p:not(.eyebrow)')), notiz: ar(s.querySelector('.nz-knopf'), 'aria-label'),
    hint: t(st && st.querySelector('.w3d-hint')), rx: st ? st.style.getPropertyValue('--rx') : '', ry: st ? st.style.getPropertyValue('--ry') : '', weiter: t(s.querySelector('[data-act="qnext"]')), bloecke: bloecke
  };
});
const bild = async (name) => { await page.waitForTimeout(1600); const r = await page.evaluate(() => { const st = document.getElementById('w3d'); st.scrollIntoView({ block: 'center' }); const b = st.getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height }; }); await page.waitForTimeout(300); await page.screenshot({ path: `${OUT}/${name}.png`, clip: r, animations: 'disabled' }); return name; };
const fragen = [];
for (let n = 0; n < 40; n++) {
  const q = await lesen(); q.n = n;
  const nn = String(n).padStart(2, '0');
  const tun = !NUR || NUR.includes(n);
  if (q.id !== 'lage' && q.id !== 'tiefe' && tun) {
    q.bild = await bild(`${nn}-${q.id}`);
    if (!OHNE_OPT) for (const b of q.bloecke) {
      if (!['karten', 'chips', 'segment', 'tupfen'].includes(b.typ)) continue;
      const opts = b.typ === 'tupfen' ? b.opts.slice(0, 8) : b.opts, orig = b.opts.find((o) => o.an);
      for (const o of opts) {
        if (o.an) { o.bild = q.bild; continue; }
        const sel = (x) => `.qpanel [data-act="${x.act}"][data-v="${x.v}"]` + (x.f ? `[data-f="${x.f}"]` : '') + (x.side ? `[data-side="${x.side}"]` : '');
        const el = await page.$(sel(o)); if (!el) continue;
        await el.click(); o.bild = await bild(`${nn}-${q.id}-${String(o.v).replace(/[^a-z0-9]/gi, '_')}`);
        if (orig) { const e2 = await page.$(sel(orig)); if (e2) { await e2.click(); await page.waitForTimeout(300); } }
      }
      if (!orig && b.typ === 'tupfen') { const w = await page.$(`.qpanel [data-act="color"][data-v="9016"]`); if (w) { await w.click(); await page.waitForTimeout(300); } }
    }
  }
  fragen.push(q); writeFileSync(`${OUT}/fragen.json`, JSON.stringify(fragen, null, 1));
  console.log(nn, q.id, q.h1.replace(/<[^>]+>/g, ''), q.bloecke.map((b) => b.typ).join(','));
  if (/speichern/i.test(q.weiter)) break;
  await page.click('[data-act="qnext"]'); await page.waitForTimeout(900);
}
await browser.close();

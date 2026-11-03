/* Wirkungskette (3.11.2026): klickt in jeder Frage jede Antwort wie ein Kunde und vergleicht 3-D-Modell (Innen- und Außenflächen getrennt)
   und Aufmaß-Text mit dem Stand davor. Meldet Antworten ohne jede Wirkung und Fehler in der Konsole. Die sieben Prüfpunkte stehen in
   docs/GESTALTUNG.md („Wirkungskette prüfen“). Aufruf gegen den Dev-Server:
   BASE=http://localhost:8797 PW_PFAD=/opt/node-tools/node_modules node scripts/wirkungskette.mjs [fenster|balkon|kombi|haustuer|hst|psk|fsw|fest|alle] */
import { createRequire } from 'module';
import path from 'node:path';
const require = createRequire(path.join(process.env.PW_PFAD || '/opt/node-tools/node_modules', '/'));
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8797';
const ARTEN = ['fenster', 'balkon', 'kombi', 'haustuer', 'hst', 'psk', 'fsw', 'fest'];
const wahl = process.argv[2] || 'alle';
let schlecht = 0;
for (const KONFIG of wahl === 'alle' ? ARTEN : [wahl]) {
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const fehler = []; p.on('pageerror', (e) => fehler.push(String(e).slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 200)); });
await p.goto(BASE + '/app/', { waitUntil: 'networkidle' });
const ergebnis = await p.evaluate(async (KONFIG) => {
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const w0 = baseWin(); w0.el = { w: 1400, h: 1500 }; w0.massWeg = 'eingeben'; w0.name = 'Küche'; w0.fa = '7016'; w0.fi = '9016'; w0.gleich = false;
  if (KONFIG !== 'fenster') { if (KONFIG === 'kombi') { artSetzen(w0, 'balkon'); w0.kombi = true; w0.kombiSeite = 'R'; w0.kombiBru = 850; w0.teilung = '2p'; w0.sashes = kombiFluegel('R'); w0.el = { w: 1800, h: 2150 }; } else { artSetzen(w0, KONFIG); w0.el = { w: KONFIG === 'haustuer' ? 1100 : 2400, h: 2150 }; } }
  if (KONFIG === 'fenster') { w0.bars = [{ id: 'b1', s: 0, d: 'h', p: 0.5 }, { id: 'b1s1', s: 1, d: 'h', p: 0.5 }]; w0.sart = 'rollladen'; w0.roll = 'vorbau'; w0.iart = 'rollo'; w0.insekt = 'spann'; w0.glasfn = ['sicht']; w0.ol = true; w0.olT = 'K'; }
  S.win = w0; S.editIdx = -1; S.windows = [];
  const snap = JSON.stringify(w0);
  const zustand = () => {
    const st = document.getElementById('w3d'); const innen = [], aussen = [], alle = []; if (st) alle.push(st.className + '|' + st.style.cssText + '|' + Object.keys(st).filter((k) => k[0] === '_' && typeof st[k] === 'string').map((k) => k + '=' + st[k]).join(','));
    if (st) st.querySelectorAll('[data-r]').forEach((e) => { const r = e.getAttribute('data-r'); if (/^(hint|lupe|ring|dim)/.test(r)) return; const ex = Object.keys(e).filter((k) => k[0] === '_' && k !== '_v' && ['string', 'number', 'boolean'].indexOf(typeof e[k]) >= 0).sort().map((k) => k + '=' + (typeof e[k] === 'number' ? Math.round(e[k] * 100) / 100 : e[k])).join(','); const t = r + '|' + e.className + '|' + e.style.cssText + '|' + ex + '|' + (e._g ? JSON.stringify(e._g) : '') + (e._s ? JSON.stringify(e._s) : ''); alle.push(t); (e.classList.contains('w3d-back') ? aussen : innen).push(t); });
    const tx = JSON.stringify(AW.rows(S.win)) + AW.opening(S.win) + JSON.stringify(AW.wuensche(S.win).gruppen.map((g) => g.zeilen.map((z) => z.k + z.t)));
    return { alle: alle.join('~'), innen: innen.join('~'), aussen: aussen.join('~'), text: tx };
  };
  const out = [];
  const fragen = qList(w0).map((q) => ({ id: q.id, kind: q.kind, view: q.view, title: q.title }));
  for (const f of fragen) {
    if (['massweg', 'lage', 'notiz', 'extras', 'design', 'sprossen', 'montage', 'ul'].indexOf(f.id) >= 0) continue;
    S.win = JSON.parse(snap); S.q = f.id; S.screen = 'frage'; render(true); await warte(30);
    const knoepfe = [...document.querySelectorAll('.qpanel [data-act][data-v]')].filter((x) => !/gloss|info/.test(x.getAttribute('data-act')) && x.getAttribute('aria-pressed') !== 'true' && x.getAttribute('aria-checked') !== 'true').map((x) => ({ act: x.getAttribute('data-act'), f: x.getAttribute('data-f') || '', v: x.getAttribute('data-v'), label: (x.getAttribute('aria-label') || x.textContent || '').trim().slice(0, 30) }));
    for (const k of knoepfe) {
      S.win = JSON.parse(snap); S.q = f.id; S.screen = 'frage'; render(true); await warte(30);
      const vor = zustand();
      const sel = '.qpanel [data-act="' + k.act + '"]' + (k.f ? '[data-f="' + k.f + '"]' : '') + '[data-v="' + CSS.escape(k.v) + '"]';
      const el = document.querySelector(sel); if (!el) { out.push({ q: f.id, k: k, fehlt: true }); continue; }
      let err = '';
      try { el.click(); } catch (e) { err = String(e).slice(0, 120); }
      await warte(40);
      const nach = zustand();
      out.push({ q: f.id, view: f.view, k: k.label + ' [' + k.act + (k.f ? ':' + k.f : '') + '=' + k.v + ']', modell: vor.alle !== nach.alle, innen: vor.innen !== nach.innen, aussen: vor.aussen !== nach.aussen, text: vor.text !== nach.text, err: err });
    }
  }
  return out;
}, KONFIG);
const nichts = ergebnis.filter((x) => !x.fehlt && !x.modell && !x.text);
console.log(KONFIG, 'Klicks', ergebnis.length, '| ohne Wirkung', nichts.length, '| Fehler', fehler.length);
nichts.forEach((x) => console.log('  OHNE WIRKUNG', x.q, x.k));
ergebnis.filter((x) => x.err).forEach((x) => console.log('  ERR', x.q, x.k, x.err));
fehler.slice(0, 5).forEach((x) => console.log('  KONSOLE', x));
schlecht += fehler.length + ergebnis.filter((x) => x.err).length;
await b.close();
}
process.exit(schlecht ? 1 : 0);

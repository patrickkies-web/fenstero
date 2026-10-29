import { readFileSync, writeFileSync } from 'node:fs';
/* Erklärungen (GLOSS der App) für die Schlüssel, die die Wünsche nennen; nur t, x und tipp */
const app = readFileSync('/home/user/fenstero/web/assets/app.js', 'utf8').split('\n');
const fragen = JSON.parse(readFileSync(process.argv[2] || 'wunsch-render/fragen.json', 'utf8'));
const keys = new Set(['lage', 'tiefe', 'bruestung']);
for (const q of fragen) { if (q.gloss && q.gloss.k) keys.add(q.gloss.k); for (const b of q.bloecke) for (const o of (b.opts || [])) if (o.info && o.info.k) keys.add(o.info.k); }
const out = {};
for (const k of keys) {
  const re = new RegExp("^\\s*'?" + k.replace(/[-]/g, '\\-') + "'?: \\{ s: ");
  const line = app.find((l) => re.test(l)); if (!line) { console.log('fehlt', k); continue; }
  const m = line.match(/ t: ('(?:[^'\\]|\\.)*'), x: (\[(?:'(?:[^'\\]|\\.)*'(?:, )?)*\]), tipp: ('(?:[^'\\]|\\.)*')/);
  if (!m) { console.log('Muster', k); continue; }
  out[k] = { t: eval(m[1]), x: eval(m[2]), tipp: eval(m[3]) };
}
writeFileSync('wunsch-gloss.json', JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'Erklärungen');

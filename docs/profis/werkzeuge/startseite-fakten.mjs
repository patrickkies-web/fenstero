import { createRequire } from 'node:module';
const { chromium } = createRequire('/opt/node-tools/')('playwright');
const b = await chromium.launch({ args: ['--no-proxy-server'] });
const p = await b.newPage();
await p.goto('http://localhost:8788/app/', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => {
  const n = (k, ohne) => OPT[k].filter((x) => !(ohne || []).includes(x.k)).length;
  const konf = ['art', 'form', 'teilung', 'typ', 'olT', 'material', 'preset', 'spross', 'breite', 'glas', 'glasfn', 'griff', 'gf', 'rc', 'sart', 'einbau', 'sfarbe', 'antrieb', 'iart', 'ifarbe', 'insekt', 'fbi', 'fba', 'holzart', 'oberfl', 'profil', 'dicht', 'lamelle', 'panzer', 'klBauart', 'klFarbe', 'insGewebe', 'fbiFarbe', 'fbaFarbe', 'ul', 'schwelle', 'fswN', 'hstSchema', 'pskSchema', 'kinder', 'luefter', 'kontakt', 'gitter', 'oeffner', 'sensor', 'transp'];
  const summe = konf.reduce((s, k) => s + (OPT[k] ? OPT[k].length : 0), 0);
  let fragenMax = 0; const art = {};
  OPT.art.forEach((a) => { try { const w = Object.assign(baseWin(), { art: a.k }); artSetzen(w, a.k); const q = qList(w).length; art[a.k] = q; fragenMax = Math.max(fragenMax, q); } catch (e) { art[a.k] = String(e).slice(0, 60); } });
  return {
    elementarten: OPT.art.length, formen: OPT.form.length, materialien: OPT.material.length, farben: COLORS.length,
    holzdekore: COLORS.filter((c) => c.holz).length, ral: COLORS.filter((c) => /^RAL/.test(c.code)).length,
    oeffnungsarten: OPT.typ.length, teilungen: OPT.teilung.length, sprossenarten: OPT.spross.length, sprossenbilder: n('preset', ['keine']),
    glasExtras: OPT.glasfn.length, ornament: ORN.length, griffarten: n('griff', ['ohne']), griffFarben: OPT.gf.length, sicherheit: OPT.rc.length,
    sonnenschutz: n('sart', ['keiner', 'behalten']), antriebe: OPT.antrieb.length, kastenFarben: OPT.sfarbe.length, innen: n('iart', ['keiner']),
    insekt: n('insekt', ['keiner']), gewebe: OPT.insGewebe.length, holzarten: OPT.holzart.length, kapitel: KAPITEL.length, begriffe: Object.keys(GLOSS).length,
    handmasse: MO_KEYS.length + 2, summeOptionen: summe, fragenJeArt: art, fragenMax: fragenMax
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();

/* eeziframes · Bildfolge des 3-D-Fensters für den Hero der Startseite (Ansicht Hauseigentümer)
   Der Inhaber will jedes Fenster mit demselben Programm, denselben Materialien und demselben Licht sehen wie in den Wünschen der App
   (web/assets/buehne.js in WebGL, ohne raum-licht). Die App selbst (app.js, rund 1 MB) auf der Startseite zu laden, kostet zu viel
   Ladezeit; deshalb nimmt dieses Skript das echte Modell der App je Farbe in einer Folge von Blickwinkeln auf (Schwenk um die
   senkrechte Achse, von außen, wie die Ansicht „außen“ der App) und legt sie als Bildfolge (Sprite) ab. Der Dreh-Betrachter der
   Startseite (web/assets/startseite.js) blättert darin: Pendeln von selbst, Ziehen mit Finger oder Maus, Pfeiltasten.

     web/bilder/start/fenster/<farbe>.webp        alle Blickwinkel einer Farbe in einem Raster (SPALTEN Spalten), WebP mit Transparenz
     web/bilder/start/fenster/<farbe>-ruhe.webp   der Ruhewinkel allein (erstes Bild, LCP), gleiche Maße wie ein Feld des Rasters
     web/bilder/start/fenster/fenster.json        Farben, Winkel, Maße, Bytes und Fingerabdruck von buehne.js und ral.js

   Aufruf (startet einen eigenen Testserver; BASE=… nimmt einen laufenden, z. B. über scripts/mit-server.mjs):
     PW_PFAD=/opt/node-tools node scripts/hero-fenster.mjs
   Ändern sich Programm, Licht oder Materialien der Bühne (buehne.js) oder die Farben (ral.js), meldet die Prüfsuite (Abschnitt 2) einen
   veralteten Fingerabdruck; dann das Skript erneut laufen lassen. app.js ändert sich täglich und zählt deshalb nicht mit: Ändert sich dort
   das Fenster selbst (HERO_WIN, w3dCalc, die Flächen in w3dHTML), das Skript von Hand erneut laufen lassen. Die Prüfsuite prüft außerdem
   Raster, Maße, Gewicht und die Angaben im Markup gegen fenster.json.
   Braucht Playwright mit Chromium (WebGL über SwiftShader: ?gl=voll und die Schalter unten) und Python mit Pillow (WebP). */
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
import { execFileSync, spawn } from 'child_process';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(WURZEL, 'web/bilder/start/fenster');
/* Farben als Schlüssel aus ral.js (so setzt die App sie in w.fa; die Startseite verlinkt /app/?farbe=<schlüssel>#ausmessen) */
export const FARBEN = ['9016', '7016', '9005', 'goak'];
/* Schwenk von außen: 180° ist frontal von außen, die App schaut von außen mit rx −8° (VIEWS.outside); WINKEL sind die Abweichungen */
export const BILD = { rx: -8, von: -36, bis: 36, schritt: 3, ruhe: -21, spalten: 5, hoehe: 600, qualitaet: 80, alpha: 90, buehne: 600 };
export const WINKEL = Array.from({ length: Math.round((BILD.bis - BILD.von) / BILD.schritt) + 1 }, (x, i) => BILD.von + i * BILD.schritt);
/* Das Fenster: zweiflügelig wie das Startfenster der App (HERO_WIN in app.js), frei schwebend ohne Wand (o.frei, wie die Bühne in
   Schritt 1), Rahmen außen in der gewählten Farbe, innen Verkehrsweiß wie in der App vorgegeben */
export const QUELLEN = ['web/assets/buehne.js', 'web/assets/ral.js'];
export function fingerabdruck() {
  const h = crypto.createHash('sha256');
  QUELLEN.forEach((q) => h.update(fs.readFileSync(path.join(WURZEL, q))));
  h.update(JSON.stringify([FARBEN, BILD]));
  return h.digest('hex').slice(0, 32);
}

/* Zuschnitt (gemeinsam für alle Farben und Winkel, damit das Fenster beim Blättern und Farbwechsel nicht springt), Raster, WebP */
const PY = `
import sys, json, os
from PIL import Image
quelle, ziel, cfg = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
farben, n, spalten, hoehe, ruhe = cfg['farben'], cfg['n'], cfg['spalten'], cfg['hoehe'], cfg['ruhe']
bilder = {f: [Image.open(os.path.join(quelle, '%s-%02d.png' % (f, i))).convert('RGBA') for i in range(n)] for f in farben}
box = None
for f in farben:
    for im in bilder[f]:
        b = im.getchannel('A').point(lambda a: 255 if a > 6 else 0).getbbox()
        if b: box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
w0, h0 = bilder[farben[0]][0].size
rand = round((box[3] - box[1]) * 0.03)
box = (max(0, box[0] - rand), max(0, box[1] - rand), min(w0, box[2] + rand), min(h0, box[3] + rand))
breite = round((box[2] - box[0]) * hoehe / (box[3] - box[1]) / 2) * 2
zeilen = -(-n // spalten)
aus = {'breite': breite, 'hoehe': hoehe, 'zeilen': zeilen, 'bytes': {}, 'ruheBytes': {}}
for f in farben:
    raster = Image.new('RGBA', (breite * spalten, hoehe * zeilen), (0, 0, 0, 0))
    for i, im in enumerate(bilder[f]):
        feld = im.crop(box).resize((breite, hoehe), Image.LANCZOS)
        raster.paste(feld, ((i % spalten) * breite, (i // spalten) * hoehe))
        if i == ruhe:
            p = os.path.join(ziel, f + '-ruhe.webp')
            feld.save(p, 'WEBP', quality=cfg['q'], alpha_quality=cfg['a'], method=6)
            aus['ruheBytes'][f] = os.path.getsize(p)
    p = os.path.join(ziel, f + '.webp')
    raster.save(p, 'WEBP', quality=cfg['q'], alpha_quality=cfg['a'], method=6)
    aus['bytes'][f] = os.path.getsize(p)
print(json.dumps(aus))
`;

async function main() {
  const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
  let pw; try { pw = require('playwright-core'); } catch (e) { pw = require('playwright'); }
  let base = process.env.BASE, server = null;
  if (!base) {
    const port = 8792; base = 'http://localhost:' + port;
    server = spawn(process.execPath, [path.join(WURZEL, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1' }), stdio: 'ignore' });
    for (let i = 0; i < 50; i++) { try { if ((await fetch(base + '/')).ok) break; } catch (e) { /* startet noch */ } await new Promise((r) => setTimeout(r, 200)); }
  }
  const pfad = process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await pw.chromium.launch({ executablePath: pfad, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hero-fenster-'));
  try {
    /* doppelte Pixeldichte: buehne.js zeichnet höchstens mit Faktor 2, Pillow verkleinert danach auf BILD.hoehe */
    const ctx = await browser.newContext({ viewport: { width: BILD.buehne + 100, height: BILD.buehne + 100 }, deviceScaleFactor: 2, locale: 'de-DE', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const fehler = [];
    page.on('pageerror', (e) => fehler.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error' || /Selbsttest|CSS-Modell/.test(m.text())) fehler.push(m.text()); });
    await page.goto(base + '/app/?gl=voll', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof w3dHTML === 'function' && typeof w3dApply === 'function' && window.Buehne3D && typeof HERO_WIN === 'object' && window.RAL);
    /* nur die Bühne, durchsichtig: Hintergrund, Rand und alles über der Leinwand aus (Maßlinien, Hinweise, Regler) */
    await page.addStyleTag({ content: 'html,body{background:transparent!important} #app{display:none!important} #hero3d,#hero3d::before,#hero3d::after{background:transparent!important;box-shadow:none!important;border:0!important;border-radius:0!important} #hero3d canvas{border-radius:0!important} .w3d-hint,.rail,.w3d-ctl,.w3d-dim,.w3d-ueber,.w3d-feldlage,.w3d-selring,.w3d-lupe{visibility:hidden!important}' });
    for (const farbe of FARBEN) {
      const ok = await page.evaluate(([f, groesse]) => {
        if (!window.RAL.eintrag(f)) return 'Farbe ' + f + ' fehlt in ral.js';
        const alt = document.getElementById('hero-halter'); if (alt) alt.remove();
        const w = JSON.parse(JSON.stringify(HERO_WIN)); w.fa = f; w.fi = '9016';
        const o = { id: 'hero3d', frei: true, view: 'outside', stageH: groesse };
        const halter = document.createElement('div'); halter.id = 'hero-halter';
        halter.style.cssText = 'position:fixed;left:50px;top:50px;width:' + groesse + 'px;z-index:9';
        document.body.appendChild(halter);
        halter.innerHTML = w3dHTML(w, o);
        const st = halter.querySelector('.w3d-stage'); W3DS[st.id] = { w: w, o: o };
        st.classList.add('no-anim'); w3dApply(st, w, o); void st.offsetWidth; st.classList.remove('no-anim');
        window.Buehne3D.an(st);
        st.classList.add('is-drag');
        return '';
      }, [farbe, BILD.buehne]);
      if (ok) throw new Error(ok);
      await page.waitForTimeout(1500);
      if (!(await page.evaluate(() => document.getElementById('hero3d').classList.contains('gl')))) throw new Error('Keine WebGL-Bühne (Chromium mit SwiftShader und ?gl=voll nötig); ein Bild aus dem CSS-Modell ist kein Rendering');
      for (let i = 0; i < WINKEL.length; i++) {
        await page.evaluate(([rx, ry]) => { const st = document.getElementById('hero3d'); st.style.setProperty('--rx', rx + 'deg'); st.style.setProperty('--ry', ry + 'deg'); }, [BILD.rx, 180 + WINKEL[i]]);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        await page.waitForTimeout(i === 0 ? 1200 : 450);
        await page.locator('#hero3d').screenshot({ path: path.join(tmp, farbe + '-' + String(i).padStart(2, '0') + '.png'), omitBackground: true, animations: 'disabled' });
      }
      console.log(farbe + ': ' + WINKEL.length + ' Blickwinkel');
    }
    if (fehler.length) throw new Error('Fehler in der App: ' + fehler.join(' | '));
    await ctx.close();
    fs.mkdirSync(ZIEL, { recursive: true });
    const cfg = { farben: FARBEN, n: WINKEL.length, spalten: BILD.spalten, hoehe: BILD.hoehe, ruhe: WINKEL.indexOf(BILD.ruhe), q: BILD.qualitaet, a: BILD.alpha };
    if (cfg.ruhe < 0) throw new Error('Ruhewinkel liegt nicht auf dem Raster der Winkel');
    const aus = JSON.parse(execFileSync('python3', ['-I', '-c', PY, tmp, ZIEL, JSON.stringify(cfg)]).toString());
    const namen = await (async () => { const p = await browser.newPage(); await p.goto(base + '/app/?gl=voll', { waitUntil: 'networkidle' }); const n = await p.evaluate((fs2) => fs2.map((f) => { const e = window.RAL.eintrag(f); return { key: f, name: e.name, code: e.code, hex: e.hex }; }), FARBEN); await p.close(); return n; })();
    const info = { stand: fingerabdruck(), erzeugt: new Date().toISOString().slice(0, 10), farben: namen, winkel: WINKEL, ruhe: cfg.ruhe, rx: BILD.rx, spalten: BILD.spalten, zeilen: aus.zeilen, breite: aus.breite, hoehe: aus.hoehe, bytes: aus.bytes, ruheBytes: aus.ruheBytes };
    fs.writeFileSync(path.join(ZIEL, 'fenster.json'), JSON.stringify(info, null, 2) + '\n');
    console.log('Bildfolge: ' + WINKEL.length + ' Winkel je Farbe, Feld ' + aus.breite + ' × ' + aus.hoehe + ' px, ' + FARBEN.map((f) => f + ' ' + Math.round(aus.bytes[f] / 1024) + ' KB + ' + Math.round(aus.ruheBytes[f] / 1024) + ' KB').join(', '));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
    await browser.close();
    if (server) server.kill();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

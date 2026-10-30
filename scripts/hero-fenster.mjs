/* eeziframes · Bildfolgen der 3-D-Fenster für den Hero der Startseite (Ansicht Hauseigentümer)
   Drei Fenster wechseln sich ab (Inhaber, 29.10.2026: „ein schickes graues mit Raffstore, ein Fenster in Weiß mit Sprossen, ein
   Dreierfenster in Weiß ohne Sprossen mit Rollladen“); jedes in den vier Farben der Farbfelder. Der Inhaber will jedes Fenster mit demselben Programm, denselben Materialien und demselben Licht sehen wie in den Wünschen der App
   (web/assets/buehne.js in WebGL, ohne raum-licht). Die App selbst (app.js, rund 1 MB) auf der Startseite zu laden, kostet zu viel
   Ladezeit; deshalb nimmt dieses Skript das echte Modell der App je Farbe in einer Folge von Blickwinkeln auf (Schwenk um die
   senkrechte Achse, von außen, wie die Ansicht „außen“ der App) und legt sie als Bildfolge (Sprite) ab. Der Dreh-Betrachter der
   Startseite (web/assets/startseite.js) blättert darin: Pendeln von selbst, Ziehen mit Finger oder Maus, Pfeiltasten.

     web/bilder/start/fenster/<modell>-<farbe>.webp        alle Blickwinkel in einem Raster (SPALTEN Spalten), WebP mit Transparenz
     web/bilder/start/fenster/<modell>-<farbe>-ruhe.webp   der Ruhewinkel allein (erstes Bild, LCP), gleiche Maße wie ein Feld
     web/bilder/start/fenster/fenster.json                 Modelle, Farben, Winkel, Maße, Bytes, Fingerabdruck von buehne.js und ral.js
   Alle Modelle stehen im selben Feld (BILD.breite × BILD.hoehe), unten bündig, damit der Schein darunter bei jedem Fenster passt.

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
/* 2°-Schritte (37 Blickwinkel; vorher 3°, das Überblenden zwischen weiter auseinanderliegenden Winkeln wirkte unruhig, Inhaber 29.10.2026:
   „läuft überhaupt nicht smooth“); ein Raster je Modell und Farbe bleibt unter 16 Megapixel (Grenze älterer iPhones beim Dekodieren) */
export const BILD = { rx: -8, von: -36, bis: 36, schritt: 2, ruhe: -20, spalten: 5, breite: 600, hoehe: 560, rand: 0.035, qualitaet: 78, alpha: 90, buehne: 600 };
export const WINKEL = Array.from({ length: Math.round((BILD.bis - BILD.von) / BILD.schritt) + 1 }, (x, i) => BILD.von + i * BILD.schritt);
/* Die Fenster: Felder wie in der App (baseWin), frei schwebend ohne Wand (o.frei, wie die Bühne in Schritt 1), Rahmen außen in der
   Farbe, innen Verkehrsweiß. farbe = Vorgabe, bis der Besucher eine Farbe wählt. Behang: stand 0 oben bis 1 unten, wend 1 = Lamellen
   gekippt. Kasten und Behang passend zur Rahmenfarbe (sfarbe); die Bedienung innen (Taster, Gurt) bleibt weg, sie hinge ohne Wand in
   der Luft. */
export const MODELLE = [
  { key: 'raff', name: 'Mit Raffstore', farbe: '7016', fenster: { w: 1480, h: 1420, teilung: '2p', sart: 'raffstore', roll: 'vorbau', antrieb: 'motor' },
    behang: { stand: 0.42, wend: 1 }, sfarbe: { 9016: 'silber', 7016: 'anthrazit', 9005: 'schwarz', goak: 'anthrazit' } },
  { key: 'sprossen', name: 'Mit Sprossen', farbe: '9016', fenster: { w: 1230, h: 1410, teilung: '2p', preset: 'sechs', spross: 'wiener' } },
  { key: 'drei', name: 'Dreiteilig mit Rollladen', farbe: '9016', fenster: { w: 2100, h: 1400, teilung: '3', sart: 'rollladen', roll: 'vorbau', antrieb: 'motor' },
    behang: { stand: 0.28, wend: 0 }, sfarbe: { 9016: 'weiss', 7016: 'anthrazit', 9005: 'schwarz', goak: 'braun' } }
];
export const QUELLEN = ['web/assets/buehne.js', 'web/assets/ral.js'];
export function fingerabdruck() {
  const h = crypto.createHash('sha256');
  QUELLEN.forEach((q) => h.update(fs.readFileSync(path.join(WURZEL, q))));
  h.update(JSON.stringify([FARBEN, BILD, MODELLE]));
  return h.digest('hex').slice(0, 32);
}

/* Zuschnitt je Modell (gemeinsam für seine Farben und Winkel, damit das Fenster beim Blättern und Farbwechsel nicht springt), ins
   gemeinsame Feld eingepasst (unten bündig, waagerecht mittig), Raster, WebP */
const PY = `
import sys, json, os
from PIL import Image
quelle, ziel, cfg = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
modelle, farben, n, spalten, breite, hoehe, ruhe, rand = cfg['modelle'], cfg['farben'], cfg['n'], cfg['spalten'], cfg['breite'], cfg['hoehe'], cfg['ruhe'], cfg['rand']
zeilen = -(-n // spalten)
aus = {'breite': breite, 'hoehe': hoehe, 'zeilen': zeilen, 'bytes': {}, 'ruheBytes': {}, 'masse': {}}
for m in modelle:
    bilder = {f: [Image.open(os.path.join(quelle, '%s-%s-%02d.png' % (m, f, i))).convert('RGBA') for i in range(n)] for f in farben}
    box = None
    for f in farben:
        for im in bilder[f]:
            b = im.getchannel('A').point(lambda a: 255 if a > 6 else 0).getbbox()
            if b: box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    bw, bh = box[2] - box[0], box[3] - box[1]
    k = min(breite * (1 - 2 * rand) / bw, hoehe * (1 - 2 * rand) / bh)
    w, h = max(1, round(bw * k)), max(1, round(bh * k))
    x, y = (breite - w) // 2, round(hoehe * (1 - rand)) - h
    aus['masse'][m] = [x, y, w, h]
    for f in farben:
        raster = Image.new('RGBA', (breite * spalten, hoehe * zeilen), (0, 0, 0, 0))
        for i, im in enumerate(bilder[f]):
            feld = Image.new('RGBA', (breite, hoehe), (0, 0, 0, 0))
            feld.paste(im.crop(box).resize((w, h), Image.LANCZOS), (x, y))
            raster.paste(feld, ((i % spalten) * breite, (i // spalten) * hoehe))
            if i == ruhe:
                p = os.path.join(ziel, '%s-%s-ruhe.webp' % (m, f))
                feld.save(p, 'WEBP', quality=cfg['q'], alpha_quality=cfg['a'], method=6)
                aus['ruheBytes'][m + '-' + f] = os.path.getsize(p)
        p = os.path.join(ziel, '%s-%s.webp' % (m, f))
        raster.save(p, 'WEBP', quality=cfg['q'], alpha_quality=cfg['a'], method=6)
        aus['bytes'][m + '-' + f] = os.path.getsize(p)
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
    for (const m of MODELLE) for (const farbe of FARBEN) {
      const ok = await page.evaluate(([m, f, groesse]) => {
        if (!window.RAL.eintrag(f)) return 'Farbe ' + f + ' fehlt in ral.js';
        const alt = document.getElementById('hero-halter'); if (alt) alt.remove();
        const w = Object.assign(JSON.parse(JSON.stringify(HERO_WIN)), m.fenster); w.fa = f; w.fi = '9016';
        w.el = { w: w.w, h: w.h }; w.mo = { hm: w.h + 30, hl: w.h + 30, hr: w.h + 30, wm: w.w + 30, wt: w.w + 30, wb: w.w + 30 };
        w.sashes = sashesFor(w.teilung); w.bars = w.preset && w.preset !== 'keine' ? presetBars(w.preset, w.sashes.length) : [];
        if (m.sfarbe && m.sfarbe[f]) w.sfarbe = m.sfarbe[f];
        const o = { id: 'hero3d', frei: true, view: 'outside', stageH: groesse };
        if (m.behang) o.behang = { stand: m.behang.stand, pos: m.behang.stand, wend: m.behang.wend };
        const halter = document.createElement('div'); halter.id = 'hero-halter';
        halter.style.cssText = 'position:fixed;left:50px;top:50px;width:' + groesse + 'px;z-index:9';
        document.body.appendChild(halter);
        halter.innerHTML = w3dHTML(w, o);
        const st = halter.querySelector('.w3d-stage'); W3DS[st.id] = { w: w, o: o };
        st.classList.add('no-anim'); w3dApply(st, w, o); void st.offsetWidth; st.classList.remove('no-anim');
        halter.querySelectorAll('.w3d-an').forEach((e) => { e.style.opacity = '0'; });
        window.Buehne3D.an(st);
        st.classList.add('is-drag');
        return '';
      }, [m, farbe, BILD.buehne]);
      if (ok) throw new Error(ok);
      await page.waitForTimeout(1500);
      if (!(await page.evaluate(() => document.getElementById('hero3d').classList.contains('gl')))) throw new Error('Keine WebGL-Bühne (Chromium mit SwiftShader und ?gl=voll nötig); ein Bild aus dem CSS-Modell ist kein Rendering');
      for (let i = 0; i < WINKEL.length; i++) {
        await page.evaluate(([rx, ry]) => { const st = document.getElementById('hero3d'); st.style.setProperty('--rx', rx + 'deg'); st.style.setProperty('--ry', ry + 'deg'); }, [BILD.rx, 180 + WINKEL[i]]);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        await page.waitForTimeout(i === 0 ? 1200 : 300);
        await page.locator('#hero3d').screenshot({ path: path.join(tmp, m.key + '-' + farbe + '-' + String(i).padStart(2, '0') + '.png'), omitBackground: true, animations: 'disabled' });
      }
      console.log(m.key + ' ' + farbe + ': ' + WINKEL.length + ' Blickwinkel');
    }
    if (fehler.length) throw new Error('Fehler in der App: ' + fehler.join(' | '));
    await ctx.close();
    fs.mkdirSync(ZIEL, { recursive: true });
    const cfg = { modelle: MODELLE.map((m) => m.key), farben: FARBEN, n: WINKEL.length, spalten: BILD.spalten, breite: BILD.breite, hoehe: BILD.hoehe, rand: BILD.rand, ruhe: WINKEL.indexOf(BILD.ruhe), q: BILD.qualitaet, a: BILD.alpha };
    if (cfg.ruhe < 0) throw new Error('Ruhewinkel liegt nicht auf dem Raster der Winkel');
    const aus = JSON.parse(execFileSync('python3', ['-I', '-c', PY, tmp, ZIEL, JSON.stringify(cfg)]).toString());
    const namen = await (async () => { const p = await browser.newPage(); await p.goto(base + '/app/?gl=voll', { waitUntil: 'networkidle' }); const n = await p.evaluate((fs2) => fs2.map((f) => { const e = window.RAL.eintrag(f); return { key: f, name: e.name, code: e.code, hex: e.hex }; }), FARBEN); await p.close(); return n; })();
    const info = { stand: fingerabdruck(), erzeugt: new Date().toISOString().slice(0, 10), modelle: MODELLE.map((m) => ({ key: m.key, name: m.name, farbe: m.farbe })), farben: namen, winkel: WINKEL, ruhe: cfg.ruhe, rx: BILD.rx, spalten: BILD.spalten, zeilen: aus.zeilen, breite: aus.breite, hoehe: aus.hoehe, masse: aus.masse, bytes: aus.bytes, ruheBytes: aus.ruheBytes };
    fs.writeFileSync(path.join(ZIEL, 'fenster.json'), JSON.stringify(info, null, 2) + '\n');
    console.log('Bildfolgen: ' + WINKEL.length + ' Winkel je Modell und Farbe, Feld ' + aus.breite + ' × ' + aus.hoehe + ' px, ' + Object.keys(aus.bytes).map((k) => k + ' ' + Math.round(aus.bytes[k] / 1024) + ' KB + ' + Math.round(aus.ruheBytes[k] / 1024) + ' KB').join(', '));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
    await browser.close();
    if (server) server.kill();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

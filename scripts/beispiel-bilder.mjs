// eeziframes · Bilder je Position für das Beispielprojekt Familie Mustermann (web/beispiele/mustermann/)
//
// Für das erfundene Projekt gibt es keine echten Fotos. An ihrer Stelle nimmt dieses Skript je Position das 3-D-Modell der App auf,
// so wie der Kunde sein Fenster im Konfigurator gesehen hat: von innen und, wo das Projekt zwei Bilder vorsieht, von außen, ohne
// Maßschilder. Das Aufmaßblatt schreibt unter diese Bilder „Beispiel: Bild aus dem 3-D-Modell statt Foto“ (Kennung bmuster…).
//
//   1. Testserver starten:   KI_ATTRAPPE=1 node scripts/dev-server.mjs
//   2. Bilder aufnehmen:     node scripts/beispiel-bilder.mjs [http://localhost:8788]
//   3. Beispiel erzeugen:    node scripts/blatt-beispiel.mjs --web
//
// Braucht Playwright mit Chromium (WebGL über SwiftShader) und Pillow (python3) für JPEG. Ort von Playwright per PW_PFAD, falls nicht
// im Repo. Schreibt <Kennung>.jpg (höchstens 960 px, Qualität 80) neben projekt.json.
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BSP = path.join(WURZEL, 'web/beispiele/mustermann');
const BASE = process.argv[2] || 'http://localhost:8788';
const req = createRequire(path.join(process.env.PW_PFAD || WURZEL, 'x.js'));
let pw; try { pw = req('playwright'); } catch (e) { try { pw = req('playwright-core'); } catch (e2) { pw = createRequire(import.meta.url)('playwright'); } }

const P = JSON.parse(fs.readFileSync(path.join(BSP, 'projekt.json'), 'utf8'));
const browser = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + '/app/?ausprobieren=signature&beispiel&gl=voll', { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof S !== 'undefined' && S.windows && S.windows.length > 0, null, { timeout: 20000 });
await page.addStyleTag({ content: '.w3d-hint,.rail,.w3d-ctl,.wz-chip,.er-titel,.md-titel,.w3d-dim{visibility:hidden!important}' });
const tmp = fs.mkdtempSync(path.join(BSP, '.bilder-'));
const pngs = [];
for (let i = 0; i < P.w.length; i++) {
  const x = P.w[i], seiten = ['in', 'out'].filter((s) => x.bilder && x.bilder[s]);
  if (!seiten.length) continue;
  await page.evaluate((k) => { S.editIdx = k; S.win = JSON.parse(JSON.stringify(S.windows[k])); go('ergebnis'); }, i);
  await page.waitForSelector('canvas.w3d-gl', { timeout: 20000 }); await page.waitForTimeout(1200);
  for (const s of seiten) {
    /* leicht schräg wie ein Foto vom Raum aus bzw. vom Garten; je Position etwas anders */
    const ry = (s === 'in' ? 9 : 189) + (i * 7) % 11, rx = -2 - (i % 3);
    await page.evaluate(([a, b]) => { const st = document.querySelector('.w3d-stage'); st.classList.remove('dims-all'); st.classList.add('is-drag'); st.style.setProperty('--rx', a + 'deg'); st.style.setProperty('--ry', b + 'deg'); }, [rx, ry]);
    await page.waitForTimeout(1300);
    const box = await page.locator('canvas.w3d-gl').boundingBox(), r = 18; // runde Ecken der Bühne abschneiden
    const f = path.join(tmp, x.bilder[s] + '.png');
    await page.screenshot({ path: f, clip: { x: box.x + r, y: box.y + r, width: box.width - 2 * r, height: box.height - 2 * r } });
    pngs.push(f); console.log(x.name + ', ' + (s === 'in' ? 'innen' : 'außen'));
  }
}
await browser.close();
cp.execFileSync('python3', ['-I', '-c', 'import sys, os\nfrom PIL import Image\nziel = sys.argv[1]\nfor p in sys.argv[2:]:\n    im = Image.open(p).convert("RGB")\n    im.thumbnail((960, 960), Image.LANCZOS)\n    im.save(os.path.join(ziel, os.path.basename(p)[:-4] + ".jpg"), quality=80, optimize=True, progressive=False)', BSP].concat(pngs));
fs.rmSync(tmp, { recursive: true, force: true });
console.log(pngs.length + ' Bilder in ' + path.relative(WURZEL, BSP));

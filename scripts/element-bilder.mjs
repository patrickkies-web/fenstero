/* eeziframes · Bilder der Elementarten für den Start der App (Schritt 1, Reihe „Das Element“)
   Rendert jede Art mit dem echten Modell der App im dunklen Studio der Startbühne (.w3d-stage.studio), ohne Beschriftung, Zoom und
   Schwanken, und speichert sie als WebP:
     web/bilder/app/element-<art>.webp   272 × 192 (doppelte Pixeldichte für die Karte von 136 × 96)
   Ändert sich das Modell (app.js, modell.js) oder das Studio (app.css), die Bilder neu erzeugen:
     PW_PFAD=/opt/node-tools node scripts/element-bilder.mjs          (startet einen eigenen Server; BASE=… nimmt einen laufenden)
   Braucht Python mit Pillow (WebP). */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execFileSync, spawn } from 'child_process';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTEN = ['fenster', 'balkon', 'fest', 'hst', 'psk', 'fsw'];
/* gerendert in doppelter Kartengröße (sonst wirken Griffe und Profile zu grob), mit 1,5-facher Dichte, dann verkleinert */
const KARTE = { b: 136, h: 96, dichte: 2, render: 2, rdichte: 1.5, qualitaet: 84 };

async function main() {
  const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
  const { chromium } = require('playwright-core');
  let base = process.env.BASE, server = null;
  if (!base) {
    const port = 8792; base = 'http://localhost:' + port;
    server = spawn(process.execPath, [path.join(WURZEL, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1' }), stdio: 'ignore' });
    for (let i = 0; i < 50; i++) { try { if ((await fetch(base + '/')).ok) break; } catch (e) { /* startet noch */ } await new Promise((r) => setTimeout(r, 200)); }
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'element-'));
  const ziel = path.join(WURZEL, 'web/bilder/app');
  fs.mkdirSync(ziel, { recursive: true });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: KARTE.rdichte, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + '/app/#ausmessen', { waitUntil: 'networkidle' });
    await page.waitForSelector('.scr[data-screen="start"] #w3d');
    for (const art of ARTEN) {
      await page.click('.qopt[data-act="art"][data-v="' + art + '"]');
      await page.waitForTimeout(300);
      /* Bühne auf Kartengröße, ohne Beschriftung, Knöpfe und Schwanken; dann neu auslegen */
      await page.evaluate((k) => {
        let st = document.getElementById('element-bild-stil');
        if (!st) { st = document.createElement('style'); st.id = 'element-bild-stil'; document.head.appendChild(st); }
        st.textContent = '#w3d { width: ' + k.b * k.render + 'px !important; height: ' + k.h * k.render + 'px !important; border-radius: 0 !important; box-shadow: none !important } #w3d .w3d-hint, #w3d .w3d-ctl { display: none !important } #w3d .w3d-sway { animation: none !important }';
        document.getElementById('w3d').classList.remove('is-live');
        window.dispatchEvent(new Event('resize'));
      }, KARTE);
      await page.waitForTimeout(900);
      const png = path.join(tmp, art + '.png');
      await page.locator('#w3d').screenshot({ path: png });
      const webp = path.join(ziel, 'element-' + art + '.webp');
      execFileSync('python3', ['-I', '-c', 'import sys; from PIL import Image; im = Image.open(sys.argv[1]).convert("RGB"); im = im.resize((int(sys.argv[3]), int(sys.argv[4])), Image.LANCZOS); im.save(sys.argv[2], "WEBP", quality=int(sys.argv[5]), method=6)', png, webp, String(KARTE.b * KARTE.dichte), String(KARTE.h * KARTE.dichte), String(KARTE.qualitaet)]);
      console.log(path.relative(WURZEL, webp), Math.round(fs.statSync(webp).size / 1024) + ' KB');
    }
  } finally {
    await browser.close();
    if (server) server.kill();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

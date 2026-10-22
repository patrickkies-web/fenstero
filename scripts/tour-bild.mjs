/* eeziframes · Ausschnitt des echten Aufmaßblatts für die Tour der Fensterbauer (Schritt „Bestellmaß und PDF“)
   Erzeugt das Beispiel-PDF der Tour mit demselben Code und denselben Daten wie „Beispiel-PDF ansehen“ (window.TourBeispiel in
   portal.js, Blatt.pdf in blatt.js), je Abzug 10, 15 und 20 mm, ohne Wasserzeichen, mit eeziframes.com als Adresse, und schneidet
   den oberen Teil von Seite 1 aus: Kopf in der Farbe des Betriebs, Kunde, Position 1 mit Bestellmaß-Vorschlag und Zeichnung.
     web/bilder/tour-aufmassblatt-<abzug>.webp   920 px breit (doppelte Pixeldichte für etwa 460 px)
     web/bilder/tour-aufmassblatt.json           Fingerabdruck der Eingaben, Maße der Bilder
   Ändern sich blatt.js, die Schrift, jsPDF, modell.js, ral.js (Farbnamen) oder die Daten der Tour, stimmt der Fingerabdruck nicht mehr; dann meldet
   scripts/pruefen.mjs das, und dieses Skript erzeugt die Bilder neu:
     PW_PFAD=/opt/node-tools node scripts/tour-bild.mjs          (startet einen eigenen Server; BASE=… nimmt einen laufenden)
   Braucht pdftoppm (poppler-utils) und Python mit Pillow. */
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
import { execFileSync, spawn } from 'child_process';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const AUSSCHNITT = { seite: 1, oben: 0, hoehe: 0.67, breite: 920, dpi: 240, qualitaet: 82 };
const QUELLEN = ['web/assets/blatt.js', 'web/assets/blatt-schrift.js', 'web/vendor/jspdf.umd.min.js', 'web/assets/modell.js', 'web/assets/ral.js'];
/* Die Daten der Tour ohne Funktionen, so wie window.TourBeispiel.blatt(15, 'eeziframes.com', false) sie liefert */
export const DATEN_AUS_SEITE = "JSON.stringify(window.TourBeispiel.blatt(15, 'eeziframes.com', false), (k, v) => (typeof v === 'function' ? undefined : v))";
export function fingerabdruck(daten) {
  const h = crypto.createHash('sha256');
  QUELLEN.forEach((q) => h.update(fs.readFileSync(path.join(WURZEL, q))));
  h.update(String(daten)); h.update(JSON.stringify(AUSSCHNITT));
  return h.digest('hex').slice(0, 32);
}

async function main() {
  const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
  const { chromium } = require('playwright-core');
  let base = process.env.BASE, server = null;
  if (!base) {
    const port = 8791; base = 'http://localhost:' + port;
    server = spawn(process.execPath, [path.join(WURZEL, 'scripts/dev-server.mjs')], { env: Object.assign({}, process.env, { PORT: String(port), KI_ATTRAPPE: '1' }), stdio: 'ignore' });
    for (let i = 0; i < 50; i++) { try { if ((await fetch(base + '/')).ok) break; } catch (e) { /* startet noch */ } await new Promise((r) => setTimeout(r, 200)); }
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  try {
    const page = await browser.newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Blatt && window.TourBeispiel);
    const daten = await page.evaluate(DATEN_AUS_SEITE);
    const abzuege = await page.evaluate(() => window.TourBeispiel.abzuege);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tour-bild-'));
    const masse = {};
    for (const a of abzuege) {
      const b64 = await page.evaluate(async (abzug) => {
        await window.Blatt.schrift();
        const blob = window.Blatt.pdf(window.TourBeispiel.blatt(abzug, 'eeziframes.com', false));
        const buf = new Uint8Array(await blob.arrayBuffer()); let s = '';
        for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
        return btoa(s);
      }, a);
      const pdf = path.join(tmp, 'blatt-' + a + '.pdf'), png = path.join(tmp, 'seite-' + a);
      fs.writeFileSync(pdf, Buffer.from(b64, 'base64'));
      execFileSync('pdftoppm', ['-r', String(AUSSCHNITT.dpi), '-f', String(AUSSCHNITT.seite), '-l', String(AUSSCHNITT.seite), '-png', '-singlefile', pdf, png]);
      const ziel = path.join(WURZEL, 'web/bilder/tour-aufmassblatt-' + a + '.webp');
      const aus = execFileSync('python3', ['-I', '-c', [
        'import sys', 'from PIL import Image',
        'im = Image.open(sys.argv[1]).convert("RGB"); w, h = im.size',
        'o, hh, bw, q = float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])',
        'im = im.crop((0, round(h * o), w, round(h * (o + hh))))',
        'im = im.resize((bw, round(im.size[1] * bw / im.size[0])), Image.LANCZOS)',
        'im.save(sys.argv[2], "WEBP", quality=q, method=6)', 'print(im.size[0], im.size[1])'
      ].join('\n'), png + '.png', ziel, String(AUSSCHNITT.oben), String(AUSSCHNITT.hoehe), String(AUSSCHNITT.breite), String(AUSSCHNITT.qualitaet)]).toString().trim().split(' ').map(Number);
      masse[a] = { breite: aus[0], hoehe: aus[1], bytes: fs.statSync(ziel).size };
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    const info = { stand: fingerabdruck(daten), abzuege: abzuege, breite: masse[abzuege[0]].breite, hoehe: masse[abzuege[0]].hoehe };
    fs.writeFileSync(path.join(WURZEL, 'web/bilder/tour-aufmassblatt.json'), JSON.stringify(info, null, 2) + '\n');
    console.log('Tour-Ausschnitt:', JSON.stringify(masse));
  } finally {
    await browser.close();
    if (server) server.kill();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

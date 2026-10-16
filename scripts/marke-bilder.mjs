/* eeziframes · Bilder des Zeichens aus der einen Quelle (LOGO_INNEN in web/assets/gemeinsam.js, gesetzt von scripts/logo-setzen.py)
   - web/apple-touch-icon.png  180 × 180, randlos (iOS rundet selbst), auch Logo in den strukturierten Daten
   - web/og.png                das Vorschaubild zum Teilen: das Zeichen oben links neu, der Rest bleibt
   - functions/api/marke.js    das Zeichen als kleines PNG für den Kopf der E-Mails (als eingebettetes Bild, ohne Nachladen)
   PW_PFAD=/opt/node-tools node scripts/marke-bilder.mjs
   Danach mit Python verkleinern lassen (Palette), siehe unten; die Prüfsuite verlangt für og.png weniger als 200 KB. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execFileSync } from 'child_process';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
const { chromium } = require('playwright-core');

const gem = fs.readFileSync(path.join(WURZEL, 'web/assets/gemeinsam.js'), 'utf8');
const INNEN = (gem.match(/var LOGO_INNEN = '([^']*)';/) || [])[1];
if (!INNEN) throw new Error('LOGO_INNEN nicht gefunden');
/* Randlos für iOS: Kachel ohne Rundung, der Lichtstreifen bis in die Ecke, kein Haarstrich */
const RANDLOS = INNEN.replace('rx="10"', '').replace(/H10A10 10 0 0 1 0 54Z/, 'H0V54Z').replace(/<rect class="fi-rand"[^>]*\/>/, '');
if (RANDLOS === INNEN) throw new Error('Randlose Fassung nicht ableitbar');
const svg = (innen, px) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="' + px + '" height="' + px + '">' + innen + '</svg>';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
const seite = async (html, w, h, ziel, transparent) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent('<!doctype html><html><head><style>html,body{margin:0;padding:0;background:' + (transparent ? 'transparent' : '#fff') + '}</style></head><body>' + html + '</body></html>');
  await p.screenshot({ path: ziel, omitBackground: !!transparent, clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
};

/* 1. Apple-Icon */
await seite(svg(RANDLOS, 180), 180, 180, path.join(WURZEL, 'web/apple-touch-icon.png'));

/* 2. Vorschaubild: das alte Zeichen (72 px bei 80/76) mit der Hintergrundfarbe abdecken, das neue darüber */
const og = fs.readFileSync(path.join(WURZEL, 'web/og.png')).toString('base64');
await seite('<div style="position:relative;width:1200px;height:630px;background:url(data:image/png;base64,' + og + ')"><div style="position:absolute;left:78px;top:74px;width:76px;height:76px;background:#f3f2ee"></div><div style="position:absolute;left:80px;top:76px">' + svg(INNEN, 72) + '</div></div>', 1200, 630, path.join(WURZEL, 'web/og.png'));

/* 3. E-Mail: 96 × 96, durchsichtig um die Kachel, angezeigt mit 32 px */
const tmp = path.join(WURZEL, '.marke-mail.png');
await seite(svg(INNEN, 96), 96, 96, tmp, true);
await browser.close();

/* Paletten-PNG (kleiner, gleiches Bild) */
execFileSync('python3', ['-I', '-c', [
  'import sys', 'from PIL import Image',
  'for f in sys.argv[1:]:',
  '  im = Image.open(f)',
  '  im = im.convert("RGBA").quantize(256, method=Image.Quantize.FASTOCTREE) if im.mode == "RGBA" else im.convert("RGB").quantize(256, method=Image.Quantize.MEDIANCUT)',
  '  im.save(f, optimize=True)'
].join('\n'), path.join(WURZEL, 'web/og.png'), path.join(WURZEL, 'web/apple-touch-icon.png'), tmp]);

const b64 = fs.readFileSync(tmp).toString('base64');
fs.unlinkSync(tmp);
fs.writeFileSync(path.join(WURZEL, 'functions/api/marke.js'),
  '/* eeziframes · Das Zeichen als PNG (96 × 96) für den Kopf der E-Mails. Erzeugt von scripts/marke-bilder.mjs aus LOGO_INNEN;\n' +
  '   post.js hängt es als eingebettetes Bild an (cid:' + 'eeziframes-zeichen), damit nichts von einem Server nachgeladen wird. */\n' +
  "export const ZEICHEN_CID = 'eeziframes-zeichen';\n" +
  "export const ZEICHEN_PNG = '" + b64 + "';\n");
console.log('apple-touch-icon.png', fs.statSync(path.join(WURZEL, 'web/apple-touch-icon.png')).size, 'B · og.png', fs.statSync(path.join(WURZEL, 'web/og.png')).size, 'B · Zeichen für E-Mails', b64.length, 'Zeichen Base64');

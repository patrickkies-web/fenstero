/* eeziframes · Bilder des Zeichens aus der einen Quelle (LOGO_INNEN in web/assets/gemeinsam.js, gesetzt von scripts/logo-setzen.py)
   - web/apple-touch-icon.png  180 × 180, randlos (iOS rundet selbst), auch Logo in den strukturierten Daten
   - web/og.png                das Vorschaubild zum Teilen, im Stil der Beiträge (dunkle Bühne, Inter, Grün als Signal)
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

/* 2. Vorschaubild zum Teilen, wie ein Cover der Beiträge: dunkle Bühne, Wortmarke, Kicker in Grün, Headline mit einem grünen Wort,
      eine Reihe Haken-Chips (Werte wie in web/assets/gemeinsam.css; Inter als Daten-URI, weil die Seite aus dem Nichts geladen wird) */
const inter = fs.readFileSync(path.join(WURZEL, 'web/fonts/inter-latin-wght-normal.woff2')).toString('base64');
const chip = (t) => '<span style="display:inline-flex;align-items:center;gap:9px;height:46px;padding:0 18px;border-radius:999px;border:2px solid #2b2b2b;background:#1f1f1f;color:#f3f2ee;font-size:22px;font-weight:700"><span style="width:9px;height:16px;margin-top:-5px;border:solid #8fd694;border-width:0 3px 3px 0;transform:rotate(45deg)"></span>' + t + '</span>';
await seite('<style>@font-face{font-family:Inter;font-weight:100 900;src:url(data:font/woff2;base64,' + inter + ') format("woff2")}</style>' +
  '<div style="position:relative;box-sizing:border-box;width:1200px;height:630px;padding:56px 64px;background:#161616;color:#f3f2ee;font-family:Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased">' +
  '<div style="display:flex;align-items:center;gap:14px;font-size:30px;font-weight:800;letter-spacing:-.02em">' + svg(INNEN, 44) + '<span>eeziframes</span></div>' +
  '<p style="margin:60px 0 0;font-size:22px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#8fd694">Aufmaß-App für Fenster</p>' +
  '<h1 style="margin:14px 0 0;font-size:104px;line-height:1;font-weight:800;letter-spacing:-.04em">Fenster ausmessen.<br>Selbst. <span style="color:#8fd694">eezi.</span></h1>' +
  '<p style="margin:26px 0 0;font-size:30px;line-height:1.35;color:#c9c8c3;max-width:900px">Zollstock, Handy, fünf Minuten je Fenster. Das Aufmaßblatt kann jeder Fensterbauer lesen.</p>' +
  '<div style="position:absolute;left:64px;bottom:56px;display:flex;gap:10px">' + ['Maße', 'Fotos', '3-D-Modell', 'Aufmaßblatt', 'Für Fensterbauer: ohne Anfahrt'].map(chip).join('') + '</div>' +
  '</div>', 1200, 630, path.join(WURZEL, 'web/og.png'));

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

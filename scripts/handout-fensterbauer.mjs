// eeziframes · Handout für Fensterbauer als PDF (Wunsch des Inhabers, 28.10.2026): zwei Seiten zum Lesen aus
// docs/profis/handout-fensterbauer/index.html (Design-DNA wie Startseite und Seite für Fensterbauer, Preise aus web/assets/pakete.js),
// danach drei Seiten aus dem Beispiel-Aufmaß web/beispiele/aufmassblatt-fensterbau-brandt.pdf (Seiten 1, 2 und 6 von 18).
//
//   PW_PFAD=/opt/node-tools/node_modules node scripts/handout-fensterbauer.mjs [ausgabe.pdf]
//   Vorgabe: docs/profis/handout-fensterbauer/eeziframes-fuer-fensterbauer.pdf
//
// Braucht playwright-core (Ort per PW_PFAD) und pdfseparate/pdfunite (poppler-utils). Ändert sich das Beispiel-Aufmaß
// (node scripts/blatt-beispiel.mjs --web) oder ein Preis, dieses Skript neu laufen lassen.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = path.join(WURZEL, 'docs/profis/handout-fensterbauer');
const AUS = path.resolve(process.argv[2] || path.join(ORDNER, 'eeziframes-fuer-fensterbauer.pdf'));
const BEISPIEL = path.join(WURZEL, 'web/beispiele/aufmassblatt-fensterbau-brandt.pdf');
const SEITEN = [1, 2, 6];

const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : import.meta.url);
const { chromium } = require('playwright-core');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'handout-'));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const fehler = [];
page.on('pageerror', (e) => fehler.push(e.message));
page.on('requestfailed', (r) => fehler.push('nicht geladen: ' + r.url()));
await page.goto(pathToFileURL(path.join(ORDNER, 'index.html')).href, { waitUntil: 'load' });
await page.waitForFunction(() => document.documentElement.getAttribute('data-fertig') === '1' && document.fonts.status === 'loaded', null, { timeout: 15000 });
/* jede Seite muss in ihr A4-Blatt passen */
const ueber = await page.evaluate(() => Array.from(document.querySelectorAll('.h-seite')).map((s, i) => { const r = s.getBoundingClientRect(); const tief = Array.from(s.querySelectorAll('*')).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0); return tief > r.bottom + 0.5 ? 'Seite ' + (i + 1) + ' läuft ' + Math.round(tief - r.bottom) + ' px über' : ''; }).filter(Boolean));
const info = path.join(tmp, 'info.pdf');
await page.pdf({ path: info, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
if (fehler.length || ueber.length) { console.error([].concat(fehler, ueber).join('\n')); process.exit(1); }

for (const n of SEITEN) cp.execFileSync('pdfseparate', ['-f', String(n), '-l', String(n), BEISPIEL, path.join(tmp, 'b-%d.pdf')]);
cp.execFileSync('pdfunite', [info].concat(SEITEN.map((n) => path.join(tmp, 'b-' + n + '.pdf')), [AUS]));
fs.rmSync(tmp, { recursive: true, force: true });
console.log('Handout geschrieben: ' + path.relative(WURZEL, AUS) + ' (' + Math.round(fs.statSync(AUS).size / 1024) + ' KB, ' + (2 + SEITEN.length) + ' Seiten)');

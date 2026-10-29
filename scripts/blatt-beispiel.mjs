// eeziframes · Beispiel-Aufmaßblätter aus demselben Zeichner wie in App, Betrieb und Server (web/assets/blatt.js)
//
// Musterprojekt: Fensterbau Brandt GmbH (Köln) und Familie Mustermann, 13 Positionen in vier Geschossen. Die Daten stehen in
// web/beispiele/mustermann/projekt.json im Format der App (dieselbe Datei öffnet die Testansicht: /app/?ausprobieren&beispiel), die
// Bilder je Position daneben (<Kennung>.jpg, Beispielbilder aus dem 3-D-Modell der App, scripts/beispiel-bilder.mjs). So zeigt das
// Beispiel, was der Konfigurator tatsächlich ins Blatt schreibt. Erzeugt die Fassung für den Betrieb (wie die Mail einer Anfrage) und
// die Durchschrift für den Kunden.
//
//   node scripts/blatt-beispiel.mjs [ausgabeordner]      Vorgabe: docs/profis/aufmassblatt-vorschau/
//   node scripts/blatt-beispiel.mjs --web                dazu die Beispiele der Website: web/beispiele/*.pdf (verlinkt auf Startseite,
//                                                        Seite für Fensterbauer, Bestellung, Ratgeber) und der Ausschnitt von Seite 2
//                                                        (920 × 903, oben 69,4 % der Seite) als blatt.webp für Startseite und Seite für
//                                                        Fensterbauer samt ihren Vorschauen (Anker auf dem Bild: siehe docs/GESTALTUNG.md)
//
// Schreibt aufmassblatt-brandt.pdf, durchschrift-mustermann.pdf und je Seite ein Bild (pdftoppm, 110 dpi, als WebP mit Pillow, sonst
// PNG) in den Ordner. Prüft danach, dass die Durchschrift kein Maß des Projekts enthält (Abbruch mit Fehlercode sonst).
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = process.argv.includes('--web'), ARGS = process.argv.slice(2).filter((a) => a !== '--web');
const AUS = path.resolve(ARGS[0] || path.join(WURZEL, 'docs/profis/aufmassblatt-vorschau'));
const imp = (f) => import(pathToFileURL(path.join(WURZEL, f)).href);

await imp('web/assets/ral.js');
await imp('web/assets/modell.js');
const J = await imp('web/vendor/jspdf.umd.min.js');
const jsPDF = (J && J.jsPDF) || (J && J.default && J.default.jsPDF) || (globalThis.jspdf && globalThis.jspdf.jsPDF);
if (!globalThis.jspdf) globalThis.jspdf = { jsPDF: jsPDF };
await imp('web/assets/blatt-schrift.js');
await imp('web/assets/blatt.js');
const AW = globalThis.AW, Blatt = globalThis.Blatt;

/* Logo von Fensterbau Brandt (wie in den Beispielseiten der Pakete): drei Felder in Petrol, als PNG aus einer festen Datei */
const BSP = path.join(WURZEL, 'web/beispiele/mustermann');
const LOGO = path.join(BSP, 'logo.png');
const logo = fs.existsSync(LOGO) ? { data: 'data:image/png;base64,' + fs.readFileSync(LOGO).toString('base64'), w: 3, h: 1, grund: 'hell' } : null;
if (logo) { const b = fs.readFileSync(LOGO); logo.w = b.readUInt32BE(16); logo.h = b.readUInt32BE(20); }

/* Das Projekt, wie es die App hält: je Fenster der Standard (AW.mk) und die Abweichungen aus der Datei */
const P = JSON.parse(fs.readFileSync(path.join(BSP, 'projekt.json'), 'utf8'));
const fenster = P.w.map((x) => AW.mk(JSON.parse(JSON.stringify(x))));
const projekt = P.p;
/* Bilder je Kennung (JPEG, Breite und Höhe aus dem Kopf der Datei) */
const jpegMass = (b) => { for (let i = 2; i < b.length - 9;) { if (b[i] !== 0xff) return null; const m = b[i + 1], l = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + l; } return null; };
const fotos = {};
fenster.forEach((w) => ['in', 'out'].forEach((s) => { const id = w.bilder && w.bilder[s], f = id && path.join(BSP, id + '.jpg'); if (f && fs.existsSync(f)) { const b = fs.readFileSync(f), g = jpegMass(b); if (g) fotos[id] = { data: 'data:image/jpeg;base64,' + b.toString('base64'), w: g.w, h: g.h }; } }));
if (!Object.keys(fotos).length) console.error('Keine Beispielbilder in web/beispiele/mustermann/ (scripts/beispiel-bilder.mjs): Blatt ohne Bilder');
const kunde = { name: projekt.name, kontakt: projekt.tel + ' · ' + projekt.mail, adresse: P.adresse, mehr: [['Erreichbar', 'nachmittags']] };
const ABZUG = { seite: 15, oben: 15, unten: 30, untenT: 0 };
const betrieb = { name: 'Fensterbau Brandt GmbH', logo: logo, abzug: ABZUG, nr: P.nr, eingegangen: P.eingegangen };
const marke = { name: 'Fensterbau Brandt GmbH', logo: logo, host: 'fensterbau-brandt.de', ap: 'Petra Brandt', tel: '0221 987 654 0', mail: 'aufmass@fensterbau-brandt.de' };

fs.mkdirSync(AUS, { recursive: true });
const schreiben = (name, bytes) => { const f = path.join(AUS, name); fs.writeFileSync(f, Buffer.from(bytes)); return f; };
const fb = Blatt.pdf({ variante: 'betrieb', kennzeichnung: 'dezent', fenster: fenster, projekt: projekt, kunde: kunde, betrieb: betrieb, portalKurz: 'eeziframes.com', fotos: fotos, ausgabe: 'bytes' });
const ds = Blatt.pdf({ variante: 'anfrage', kennzeichnung: 'dezent', sie: true, marke: marke, nr: P.nr, fenster: fenster, projekt: projekt, kunde: kunde, portalKurz: 'eeziframes.com', ausgabe: 'bytes' });
const dateien = [schreiben('aufmassblatt-brandt.pdf', fb), schreiben('durchschrift-mustermann.pdf', ds)];
/* Prüfung der Durchschrift: kein Maß des Projekts im Text (Maueröffnung, Element, Brüstung, Wand, Unterlicht, Bestellmaß) */
const massWerte = new Set();
fenster.forEach((w) => {
  const d = AW.derive(w), b = AW.bestellmass(w, AW.abzugVon(betrieb.abzug));
  [d.moW, d.moH, d.elW, d.elH, w.bru, w.wand, w.ulH, b && b.b, b && b.h].concat(Object.values(w.mo || {})).forEach((v) => { if (Number(v) >= 300) massWerte.add(Number(v)); });
});
const dsText = (() => { try { return cp.execFileSync('pdftotext', ['-layout', dateien[1], '-'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8'); } catch (e) { return null; } })();
if (dsText == null) console.error('pdftotext fehlt: Durchschrift nicht auf Maße geprüft');
else {
  const lecks = [...massWerte].filter((v) => new RegExp('(^|[^\\d.,])(' + v + '|' + AW.th(v).replace('.', '\\.') + ')(?![\\d.,]\\d)').test(dsText));
  if (lecks.length || /\d\s*mm\b/.test(dsText)) { console.error('Durchschrift enthält Maße: ' + lecks.join(', ') + (/\d\s*mm\b/.test(dsText) ? ' (und eine Angabe in mm)' : '')); process.exitCode = 1; }
  else console.log('Durchschrift ohne Maße: ' + massWerte.size + ' Werte geprüft, keiner im Text');
}
for (const f of dateien) {
  const stamm = f.replace(/\.pdf$/, '');
  fs.readdirSync(AUS).filter((x) => x.startsWith(path.basename(stamm) + '-') && /\.(png|webp)$/.test(x)).forEach((x) => fs.unlinkSync(path.join(AUS, x)));
  try { cp.execFileSync('pdftoppm', ['-r', '110', '-png', f, stamm], { stdio: ['ignore', 'ignore', 'ignore'] }); } catch (e) { console.error('pdftoppm fehlt oder scheiterte:', e.message); }
  const pngs = fs.readdirSync(AUS).filter((x) => x.startsWith(path.basename(stamm) + '-') && x.endsWith('.png')).map((x) => path.join(AUS, x));
  try { cp.execFileSync('python3', ['-I', '-c', 'import sys\nfrom PIL import Image\nfor p in sys.argv[1:]:\n    Image.open(p).save(p[:-4] + ".webp", quality=82, method=6)'].concat(pngs)); pngs.forEach((x) => fs.unlinkSync(x)); } catch (e) { /* ohne Pillow bleiben die PNG */ }
  const seiten = fs.readdirSync(AUS).filter((x) => x.startsWith(path.basename(stamm) + '-') && /\.(png|webp)$/.test(x)).length;
  console.log(path.relative(WURZEL, f) + ': ' + Math.round(fs.statSync(f).size / 1024) + ' KB, ' + seiten + ' Seiten');
}

/* Beispiele der Website: die beiden PDFs und der Ausschnitt der Übersicht (Seite 2) */
if (WEB) {
  const ZIEL = path.join(WURZEL, 'web/beispiele');
  fs.mkdirSync(ZIEL, { recursive: true });
  fs.copyFileSync(dateien[0], path.join(ZIEL, 'aufmassblatt-fensterbau-brandt.pdf'));
  fs.copyFileSync(dateien[1], path.join(ZIEL, 'durchschrift-familie-mustermann.pdf'));
  const tmp = path.join(AUS, '.seite1');
  /* Seite 2: die Übersicht (seit 28.10.2026 steht auf Seite 1 der Projektstandard, die Übersicht als Ganzes auf Seite 2) */
  cp.execFileSync('pdftoppm', ['-r', '240', '-f', '2', '-l', '2', '-singlefile', '-png', dateien[0], tmp], { stdio: ['ignore', 'ignore', 'ignore'] });
  const bilder = ['web/bilder/start/blatt.webp', 'web/bilder/fensterbauer-dna/blatt.webp', 'docs/profis/startseite-dna-vorschau/bilder/blatt.webp', 'docs/profis/fensterbauer-vorschau/bilder/blatt.webp'].map((x) => path.join(WURZEL, x));
  cp.execFileSync('python3', ['-I', '-c', 'import sys\nfrom PIL import Image\nim = Image.open(sys.argv[1]).convert("RGB")\nw, h = im.size\nc = im.crop((0, 0, w, round(h * 0.694)))\nc = c.resize((920, round(c.size[1] * 920 / w)), Image.LANCZOS)\nfor z in sys.argv[2:]:\n    c.save(z, quality=82, method=6)\nprint(c.size)', tmp + '.png'].concat(bilder), { stdio: 'inherit' });
  fs.unlinkSync(tmp + '.png');
  console.log('Website: web/beispiele/ und ' + bilder.length + ' × blatt.webp geschrieben');
}

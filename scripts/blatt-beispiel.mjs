// eeziframes · Beispiel-Aufmaßblätter aus demselben Zeichner wie in App, Betrieb und Server (web/assets/blatt.js)
//
// Musterprojekt: Fensterbau Brandt GmbH (Köln) und Familie Mustermann, 13 Positionen in vier Geschossen mit Rollläden (Aufsatz,
// Vorbau, Unterputz), Raffstores, Screen, Klappläden, Insektenschutz, Plissee und Rollo, Hebe-Schiebe-Tür, Balkontür, Festverglasung
// und Oberlicht. Erzeugt die Fassung für den Betrieb (wie die Mail einer Anfrage) und die Durchschrift für den Kunden.
//
//   node scripts/blatt-beispiel.mjs [ausgabeordner]      Vorgabe: docs/profis/aufmassblatt-vorschau/
//
// Schreibt aufmassblatt-brandt.pdf, durchschrift-mustermann.pdf und je Seite ein Bild (pdftoppm, 110 dpi, als WebP mit Pillow, sonst
// PNG) in den Ordner. Prüft danach, dass die Durchschrift kein Maß des Projekts enthält (Abbruch mit Fehlercode sonst).
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUS = path.resolve(process.argv[2] || path.join(WURZEL, 'docs/profis/aufmassblatt-vorschau'));
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
const LOGO = path.join(WURZEL, 'docs/profis/aufmassblatt-vorschau/brandt-logo.png');
const logo = fs.existsSync(LOGO) ? { data: 'data:image/png;base64,' + fs.readFileSync(LOGO).toString('base64'), w: 3, h: 1, grund: 'hell' } : null;
if (logo) { const b = fs.readFileSync(LOGO); logo.w = b.readUInt32BE(16); logo.h = b.readUInt32BE(20); }

const mo = (b, h, d) => ({ wt: b + (d || 0), wm: b, wb: b + 2, hl: h + 3, hm: h, hr: h + 2 });
const ki = (rows, chips, hints, fach) => ({ auto: true, rows: rows, chips: chips || [], hints: hints || [], fach: fach || {} });
const F = (o) => AW.mk(o);

const fenster = [
  F({ name: 'Wohnen links', etage: 'eg', teilung: '3', mo: mo(2010, 1410), el: { w: 1980, h: 1385 }, bru: 600, laib: 150, wand: 365, fa: '7016', fi: '9016', glas: '3', glasfn: ['schall'], rc: 'rc2',
    sart: 'raffstore', roll: 'vorbau', sfarbe: 'anthrazit', antrieb: 'smart', insekt: 'spann', fotos: 2,
    ki: ki([['Rollladen', 'Einbaukasten innen im Sturz, Gurt links'], ['Anschlag', 'Innenanschlag, Blendrahmen etwa 2 cm hinter der Innenkante'], ['Fassade', 'Putz auf Mauerwerk'], ['Vor Ort prüfen', 'Sturzhöhe für den Raffstore-Kasten']], ['Rollladenkasten innen', 'Putzfassade'], ['Für den Raffstore-Kasten die Sturzhöhe vor Ort prüfen.'], { rollladen: 'einbau', anschlagI: 'innen', fassade: 'putz', strom: true }) }),
  F({ name: 'Wohnen Terrasse', etage: 'eg', art: 'hst', hst: { schema: 'A', richtung: 'R', schwelle: 'null' }, teilung: '2', sashes: [{ t: 'F', din: 'R' }, { t: 'S', din: 'R' }], griff: 'standard', mo: mo(3020, 2260), el: { w: 2990, h: 2240 }, laib: 150, wand: 365, fa: '7016', fi: '9016', glas: '3', glasfn: ['vsg'],
    sart: 'raffstore', roll: 'vorbau', sfarbe: 'anthrazit', antrieb: 'smart', insekt: 'schiebe', fotos: 2,
    ki: ki([['Auf einen Blick', 'Terrassentür mit Seitenteil, ebenerdige Terrasse'], ['Boden', 'Fliesen innen, Terrasse auf gleicher Höhe'], ['Vor Ort prüfen', 'Entwässerung der Schwelle']], ['Terrasse ebenerdig'], ['Terrasse aus Holz auf Stelzlagern: Anschluss an die Schwelle vor Ort abstimmen.']) }),
  F({ name: 'Küche', etage: 'eg', teilung: '2p', mo: mo(1260, 1210), el: { w: 1230, h: 1185 }, bru: 950, laib: 140, fa: '7016', fi: '9016',
    sart: 'rollladen', roll: 'aufsatz', sfarbe: 'anthrazit', antrieb: 'motor', insekt: 'dreh', fotos: 2,
    ki: ki([['Fensterbank innen', 'Arbeitsplatte reicht bis an den Rahmen'], ['Strom', 'Steckdose in der Nähe']], ['über Arbeitsplatte'], [], { strom: true }) }),
  F({ name: 'Essen', etage: 'eg', art: 'balkon', teilung: '1', mo: mo(910, 2190), el: { w: 885, h: 2170 }, laib: 140, fa: '7016', fi: '9016', bt: { schwelle: 'flach', griffA: 'ziehgriff', boden: 'bleibt' },
    sart: 'rollladen', roll: 'aufsatz', sfarbe: 'anthrazit', antrieb: 'motor', insekt: 'pendel', fotos: 1,
    ki: ki([['Auf einen Blick', 'Balkontür mit Rollladenkasten innen'], ['Boden', 'Parkett innen, Balkon eine Stufe tiefer'], ['Anschlag', 'Innenanschlag']], ['Balkon eine Stufe tiefer'], [], { anschlagI: 'innen' }) }),
  F({ name: 'Gäste-WC', etage: 'eg', teilung: '1', mo: mo(615, 815), el: { w: 590, h: 790 }, bru: 1450, laib: 120, fa: '9016', fi: '9016', glasfn: ['sicht'], orn: 'satinato', fotos: 1,
    sashes: [{ t: 'K', din: 'L' }], ki: ki([['Auf einen Blick', 'Kleines Kippfenster, Ornamentglas'], ['Laibung', 'Gefliest bis zur Hälfte']], ['Fliesenlaibung']) }),
  F({ name: 'Flur neben der Haustür', etage: 'eg', art: 'fest', mo: mo(420, 2120), el: { w: 400, h: 2100 }, laib: 130, fa: '7016', fi: '9016', glasfn: ['vsg', 'sicht'], orn: 'master', fotos: 1,
    ki: ki([['Auf einen Blick', 'Schmales festes Seitenfenster neben der Haustür'], ['Fassade', 'Putz auf Mauerwerk']], ['neben der Haustür']) }),
  F({ name: 'Schlafen', etage: 'og', ogNr: 1, teilung: '2p', mo: mo(1510, 1260), el: { w: 1480, h: 1235 }, bru: 950, laib: 140, fa: '7016', fi: '9016', glasfn: ['schall'],
    sart: 'rollladen', roll: 'vorbau', sfarbe: 'anthrazit', antrieb: 'smart', insekt: 'spann', iart: 'plissee', ifarbe: 'grau', fotos: 2,
    ki: ki([['Auf einen Blick', 'Zweiflügliges Fenster, Rollladenkasten innen'], ['Rollladen', 'Einbaukasten innen, Gurt rechts'], ['Strom', 'keine Steckdose in der Nähe']], ['Rollladenkasten innen'], ['Heizkörper direkt unter dem Fenster: Fensterbank innen nicht tiefer als 20 cm.']) }),
  F({ name: 'Kind 1', etage: 'og', ogNr: 1, teilung: '1', ul: true, ulA: 'glas', ulH: 400, mo: mo(1010, 1260), el: { w: 985, h: 1235 }, bru: 780, laib: 140, fa: '7016', fi: '9016', absturz: 'fest',
    sart: 'rollladen', roll: 'aufsatz', sfarbe: 'anthrazit', antrieb: 'solar', insekt: 'spann', fotos: 2,
    ki: ki([['Auf einen Blick', 'Einflügliges Fenster, niedrige Brüstung'], ['Fassade', 'Putz, Südseite']], ['Südseite']) }),
  F({ name: 'Kind 2', etage: 'og', ogNr: 1, teilung: '2p', mo: mo(1260, 1260), el: { w: 1230, h: 1235 }, bru: 900, laib: 140, fa: '7016', fi: '9016',
    sart: 'raffstore', roll: 'unterputz', sfarbe: 'anthrazit', antrieb: 'motor', insekt: 'spann', fotos: 2,
    ki: ki([['Auf einen Blick', 'Zweiflügliges Fenster, alter Rollladenkasten innen'], ['Sturz', 'Betonsturz, verputzt']], ['Betonsturz']) }),
  F({ name: 'Bad', etage: 'og', ogNr: 1, teilung: '1', mo: mo(905, 1040), el: { w: 880, h: 1010 }, bru: 1320, laib: 120, fa: '9016', fi: '9016', glasfn: ['sicht'], orn: 'chinchilla', iart: 'rollo', ifarbe: 'weiss', fotos: 1,
    ki: ki([['Laibung', 'Gefliest bis an den Blendrahmen'], ['Feuchte', 'Feuchteflecken in der unteren Laibungsecke'], ['Vor Ort prüfen', 'Fliesen an der Laibung beim Ausbau']], ['Fliesenlaibung'], ['Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt.']) }),
  F({ name: 'Studio', etage: 'dg', teilung: '2p', ol: true, olT: 'K', mo: mo(1410, 1810), el: { w: 1380, h: 1785 }, bru: 450, laib: 160, fa: '7016', fi: '9016',
    sart: 'screen', roll: 'vorbau', sfarbe: 'anthrazit', antrieb: 'motor', fotos: 2,
    ki: ki([['Auf einen Blick', 'Großes Fenster in der Giebelwand mit Oberlicht'], ['Fassade', 'Holzverschalung']], ['Giebelwand'], ['Oberlicht nur mit Leiter erreichbar: kippbar mit Stange planen.']) }),
  F({ name: 'Ankleide', etage: 'dg', teilung: '2s', mo: mo(1010, 1210), el: { w: 985, h: 1185 }, bru: 900, laib: 160, fa: '7016', fi: '9016', sart: 'klappladen', fotos: 1,
    ki: ki([['Auf einen Blick', 'Stulpfenster, alte Klappläden aus Holz']], ['Klappläden vorhanden']) }),
  F({ name: 'Hobbyraum', etage: 'kg', teilung: '1', mo: mo(810, 610), el: { w: 785, h: 585 }, bru: 1650, laib: 300, fa: '9016', fi: '9016', glas: '2', rc: 'rc2', insekt: 'spann', fotos: 1,
    sashes: [{ t: 'K', din: 'L' }], ki: ki([['Auf einen Blick', 'Kellerfenster mit Lichtschacht'], ['Laibung', 'tiefe Laibung, Lichtschacht außen']], ['Lichtschacht']) })
];

const projekt = { name: 'Familie Mustermann', ort: '50667 Köln', tel: '0221 555 01 23', mail: 'familie.mustermann@beispiel.de', erreich: 'nm', gebaeude: 'efh', baujahr: '1978', total: 16,
  zeit: '3m', budget: 'b4', foerd: true, foerdweg: 'bafa', notiz: 'Bitte vorher anrufen, unser Hund ist freundlich.' };
const kunde = { name: 'Familie Mustermann', kontakt: '0221 555 01 23 · familie.mustermann@beispiel.de', adresse: 'Musterweg 12, 50667 Köln', mehr: [['Erreichbar', 'nachmittags']] };
const betrieb = { name: 'Fensterbau Brandt GmbH', logo: logo, abzug: { seite: 15, oben: 15, unten: 30, untenT: 0 }, nr: 'A-2026-0142', eingegangen: '27. Oktober 2026' };
const marke = { name: 'Fensterbau Brandt GmbH', logo: logo, host: 'fensterbau-brandt.de', ap: 'Petra Brandt', tel: '0221 987 654 0', mail: 'aufmass@fensterbau-brandt.de' };

fs.mkdirSync(AUS, { recursive: true });
const schreiben = (name, bytes) => { const f = path.join(AUS, name); fs.writeFileSync(f, Buffer.from(bytes)); return f; };
const fb = Blatt.pdf({ variante: 'betrieb', kennzeichnung: 'dezent', fenster: fenster, projekt: projekt, kunde: kunde, betrieb: betrieb, portalKurz: 'eeziframes.com', ausgabe: 'bytes' });
const ds = Blatt.pdf({ variante: 'anfrage', kennzeichnung: 'dezent', sie: true, marke: marke, nr: 'A-2026-0142', fenster: fenster, projekt: projekt, kunde: kunde, portalKurz: 'eeziframes.com', ausgabe: 'bytes' });
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

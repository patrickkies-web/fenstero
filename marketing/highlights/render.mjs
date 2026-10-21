// eeziframes · Highlights: rendert Story-Screens (HTML, 1080 × 1920) zu PNG.
//
//   node marketing/highlights/render.mjs                      alle screens/*.html  -> out/<id>.png
//   NUR=h03,h04 node marketing/highlights/render.mjs          nur diese Screens (auch NUR=cover-* für alle Cover)
//   MUSTER=1 node marketing/highlights/render.mjs             die Muster aus vorlage/muster-*.html
//   node marketing/highlights/render.mjs pfad/zu/screen.html  einzelne Dateien
//   RASTER=1 ...                                              zusätzlich out/raster-<id>.png mit den Sicherheitszonen
//
// Fotos: <img data-slot="h03-foto" data-ersatz="bar-werkstatt.webp" src="../bilder/bar-werkstatt.webp">
//   Liegt bilder/<slot>.png|jpg|jpeg|webp vor (bei mehreren die neueste), wird sie gerendert,
//   sonst das Ersatzfoto bilder/<data-ersatz>. Neue KI-Fotos also nur in bilder/ ablegen und neu rendern.
//   Ausschnitt: --ef-fp am <figure> gilt nur für das Ersatzfoto. Ein Slot-Foto steht oben bündig (50% 0%),
//   so wie PROMPTS.md es komponiert (Format 4:5, Gesicht bei y 260 bis 350 der Bühne); ein anderer Ausschnitt
//   für das Slot-Foto steht als data-fp="50% 4%" am <img>.
//   Je Foto meldet das Skript Fotofläche, Ausblendung und welche Fotozeilen in der Gesichtszone liegen;
//   RASTER=1 markiert die Gesichtszone (y 250 bis Beginn der Ausblendung).
// Gewartet wird auf Schriften (document.fonts.ready, Inter muss geladen sein) und auf alle Bilder.
// Danach prüft das Skript, ob etwas über die Sicherheitszonen ragt oder abgeschnitten ist, und meldet es.
import { createRequire } from 'node:module';
import { readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, basename, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire('/opt/node-tools/x.js');
const { chromium } = require('playwright-core');

const HIER = dirname(fileURLToPath(import.meta.url));
const SCREENS = join(HIER, 'screens');
const VORLAGE = join(HIER, 'vorlage');
const BILDER = join(HIER, 'bilder');
const OUT = join(HIER, 'out');
const ENDUNGEN = ['png', 'jpg', 'jpeg', 'webp'];
const W = 1080, H = 1920, OBEN = 250, UNTEN = 250, RAND = 84;

const htmlIn = (dir, filter = () => true) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.html') && filter(f)).sort().map((f) => join(dir, f)) : []);

let dateien = process.argv.slice(2).map((p) => resolve(p));
if (!dateien.length) dateien = process.env.MUSTER === '1' ? htmlIn(VORLAGE, (f) => f.startsWith('muster-')) : htmlIn(SCREENS);
if (process.env.NUR) {
  const nur = process.env.NUR.split(',').map((s) => s.trim()).filter(Boolean);
  const passt = (id) => nur.some((n) => (n.endsWith('*') ? id.startsWith(n.slice(0, -1)) : id === n));
  dateien = dateien.filter((d) => passt(basename(d, '.html')));
}
if (!dateien.length) { console.error('Keine Screens gefunden (screens/*.html, NUR=' + (process.env.NUR || '') + ').'); process.exit(1); }
const RASTER = process.env.RASTER === '1';
mkdirSync(OUT, { recursive: true });

/* Foto für einen Slot: neueste Datei bilder/<slot>.<endung>, sonst null */
function slotDatei(slot) {
  const da = ENDUNGEN.map((e) => join(BILDER, slot + '.' + e)).filter((p) => existsSync(p));
  da.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return da[0] || null;
}

/* Überlagerung mit den Sicherheitszonen (nur zur Kontrolle) */
function raster(highlight) {
  const d = document.createElement('div');
  d.id = 'ef-raster';
  d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;font:700 22px/1.2 Inter,Arial,sans-serif;color:#fff';
  const box = (css, text) => { const b = document.createElement('div'); b.style.cssText = 'position:absolute;' + css; if (text) { const t = document.createElement('span'); t.textContent = text; t.style.cssText = 'position:absolute;left:12px;bottom:10px;padding:4px 10px;border-radius:6px;background:rgba(0,0,0,.65)'; b.appendChild(t); } d.appendChild(b); };
  box('left:0;top:0;width:1080px;height:250px;background:rgba(255,40,120,.35);border-bottom:2px dashed #ff2878', 'oben 250 px frei');
  box('left:0;bottom:0;width:1080px;height:250px;background:rgba(255,40,120,.35);border-top:2px dashed #ff2878', 'unten 250 px frei');
  box('left:0;top:250px;width:84px;height:1420px;background:rgba(40,160,255,.28);border-right:2px dashed #28a0ff');
  box('right:0;top:250px;width:84px;height:1420px;background:rgba(40,160,255,.28);border-left:2px dashed #28a0ff');
  /* Foto-Screens: Gesichtszone (unter den oberen 250 px bis zum Beginn der Ausblendung) und Ende des Fotos */
  for (const im of document.querySelectorAll('.ef-foto > img')) {
    const cs = getComputedStyle(im);
    if (cs.objectFit !== 'cover') continue;
    const f = im.getBoundingClientRect();
    const voll = f.top + f.height * (parseFloat(cs.getPropertyValue('--ef-foto-voll')) || 56) / 100;
    box('left:0;top:250px;width:1080px;height:' + Math.max(0, voll - 250) + 'px;border:3px dashed #00e0c0;box-sizing:border-box', 'Gesicht und Handlung: Foto voll sichtbar bis ' + Math.round(voll));
    box('left:0;top:' + voll + 'px;width:1080px;height:' + Math.max(0, f.bottom - voll) + 'px;border-bottom:3px dashed #00e0c0;box-sizing:border-box', 'Ausblendung bis ' + Math.round(f.bottom));
  }
  if (highlight) {
    box('left:0;top:420px;width:1080px;height:1080px;border-radius:50%;border:3px dashed #ffd400;box-sizing:border-box', '');
    box('left:540px;top:0;width:0;height:1920px;border-left:1px dashed rgba(255,212,0,.6)');
    box('left:0;top:960px;width:1080px;height:0;border-top:1px dashed rgba(255,212,0,.6)');
    const t = document.createElement('span'); t.textContent = 'Kreis-Ausschnitt Highlight (Durchmesser 1080)'; t.style.cssText = 'position:absolute;left:300px;top:1510px;padding:4px 10px;border-radius:6px;background:rgba(0,0,0,.65)'; d.appendChild(t);
  }
  document.body.appendChild(d);
}

/* Kontrolle: Inhalt außerhalb der Sicherheitszonen, abgeschnittener Text, Größe der Bühne */
function pruefen([W, H, OBEN, UNTEN, RAND]) {
  const meld = [];
  const b = document.querySelector('.ef-buehne');
  if (!b) return ['keine .ef-buehne gefunden'];
  const r = b.getBoundingClientRect();
  if (Math.round(r.width) !== W || Math.round(r.height) !== H) meld.push('Bühne ist ' + Math.round(r.width) + ' × ' + Math.round(r.height) + ' statt ' + W + ' × ' + H);
  if (b.classList.contains('ef-hl')) return meld;
  const name = (el) => { const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40); return '<' + el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') + '>' + (t ? ' „' + t + '“' : ''); };
  for (const el of b.querySelectorAll('*')) {
    if (el.closest('.ef-foto, [data-frei], #ef-raster')) continue;
    const e = el.getBoundingClientRect();
    if (!e.width || !e.height) continue;
    const raus = [];
    let optisch = 0; // Headlines rücken bewusst ein paar px nach links (Vorbreite der Glyphen), das zählt nicht als Verstoß
    for (let a = el; a && a !== b; a = a.parentElement) optisch += Math.max(0, -parseFloat(getComputedStyle(a).marginLeft) || 0);
    if (e.top < OBEN - 0.5) raus.push('oben ' + Math.round(OBEN - e.top) + ' px');
    if (e.bottom > H - UNTEN + 0.5) raus.push('unten ' + Math.round(e.bottom - (H - UNTEN)) + ' px');
    if (e.left < RAND - optisch - 0.5) raus.push('links ' + Math.round(RAND - e.left) + ' px');
    if (e.right > W - RAND + 0.5) raus.push('rechts ' + Math.round(e.right - (W - RAND)) + ' px');
    if (raus.length && !el.parentElement.closest('[data-gemeldet]')) { meld.push(name(el) + ' ragt über die Sicherheitszone: ' + raus.join(', ')); el.setAttribute('data-gemeldet', ''); }
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') meld.push(name(el) + ' ist abgeschnitten');
  }
  const foto = b.querySelector('.ef-foto');
  if (foto) { const f = foto.getBoundingClientRect(); if (f.height < 400) meld.push('Foto ist nur ' + Math.round(f.height) + ' px hoch: Text kürzen'); }
  return meld;
}

/* Lage jedes Fotos: Fotofläche, Ausblendung und welche Zeilen des Originals in der Gesichtszone (OBEN bis Beginn der Ausblendung) liegen */
function fotoLage(OBEN) {
  return [...document.querySelectorAll('.ef-foto > img')].map((im) => {
    const cs = getComputedStyle(im);
    if (cs.objectFit !== 'cover' || !im.naturalWidth) return null;
    const f = im.getBoundingClientRect(), nw = im.naturalWidth, nh = im.naturalHeight;
    const s = Math.max(f.width / nw, f.height / nh); // object-fit: cover
    const py = (cs.objectPosition.split(' ')[1] || '50%').trim();
    const versatz = py.endsWith('%') ? (nh * s - f.height) * parseFloat(py) / 100 : -parseFloat(py) || 0;
    const voll = f.top + f.height * (parseFloat(cs.getPropertyValue('--ef-foto-voll')) || 56) / 100;
    const zeile = (y) => Math.round((y - f.top + versatz) / s);
    return { slot: im.getAttribute('data-slot') || '', fp: cs.objectPosition, h: Math.round(f.height), unten: Math.round(f.bottom), voll: Math.round(voll), nw, nh, von: zeile(f.top), bis: zeile(f.bottom), gVon: zeile(OBEN), gBis: zeile(voll), skala: s };
  }).filter(Boolean);
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, locale: 'de-DE', reducedMotion: 'reduce' });
let fehler = 0;
for (const datei of dateien) {
  const id = basename(datei, '.html');
  const page = await ctx.newPage();
  const konsole = [];
  page.on('pageerror', (e) => konsole.push('Skriptfehler: ' + e.message));
  page.on('requestfailed', (r) => konsole.push('nicht geladen: ' + r.url()));
  try {
    await page.goto(pathToFileURL(datei).href, { waitUntil: 'load' });
    /* Foto-Slots auflösen */
    const slots = await page.$$eval('[data-slot]', (els) => els.map((el, i) => ({ i, slot: el.getAttribute('data-slot'), ersatz: el.getAttribute('data-ersatz') || '' })));
    const fotos = [];
    for (const s of slots) {
      let p = slotDatei(s.slot), quelle = 'Slot';
      if (!p && s.ersatz) { p = join(BILDER, s.ersatz); quelle = 'Ersatz'; }
      if (!p || !existsSync(p)) throw new Error('Foto fehlt: bilder/' + s.slot + '.(png|jpg|webp) und kein gültiges data-ersatz (' + (s.ersatz || 'leer') + ')');
      fotos.push(s.slot + ' = ' + (quelle === 'Slot' ? '' : 'Ersatz ') + relative(HIER, p));
      await page.evaluate(async ([i, url, slotFoto]) => {
        const el = document.querySelectorAll('[data-slot]')[i];
        const fig = el.closest('.ef-foto');
        if (slotFoto && fig) fig.style.setProperty('--ef-fp', el.getAttribute('data-fp') || '50% 0%'); // --ef-fp im Screen gilt dem Ersatzfoto
        el.src = url; await el.decode();
      }, [s.i, pathToFileURL(p).href, quelle === 'Slot']);
    }
    /* Schriften und Bilder abwarten */
    const stand = await page.evaluate(async () => {
      await document.fonts.ready;
      const bilder = [...document.images];
      await Promise.all(bilder.map((im) => (im.complete ? Promise.resolve() : new Promise((ok) => { im.addEventListener('load', ok, { once: true }); im.addEventListener('error', ok, { once: true }); }))));
      await Promise.all(bilder.map((im) => im.decode().catch(() => {})));
      await document.fonts.ready;
      await Promise.all(['500 40px Inter', '800 40px Inter'].map((f) => document.fonts.load(f, 'Aä€').catch(() => {}))); // lädt Inter auch auf Seiten ohne Text
      const inter = [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'Inter');
      return { inter: inter.some((f) => f.status === 'loaded'), kaputt: bilder.filter((im) => !im.naturalWidth).map((im) => im.getAttribute('src')) };
    });
    if (!stand.inter) throw new Error('Schrift Inter nicht geladen (Pfad in vorlage.css prüfen)');
    if (stand.kaputt.length) throw new Error('Bild nicht geladen: ' + stand.kaputt.join(', '));
    const hinweise = await page.evaluate(pruefen, [W, H, OBEN, UNTEN, RAND]);
    const lagen = await page.evaluate(fotoLage, OBEN);
    for (const l of lagen) if (l.skala > 1.001) hinweise.push('Foto ' + l.slot + ' ist nur ' + l.nw + ' × ' + l.nh + ' px und wird hochgerechnet (gebraucht: 4:5, mindestens 1120 × 1400)');
    const ziel = join(OUT, id + '.png');
    await page.screenshot({ path: ziel, clip: { x: 0, y: 0, width: W, height: H }, animations: 'disabled' });
    let zeile = id.padEnd(16) + ' -> ' + relative(process.cwd(), ziel);
    if (RASTER) {
      const hl = await page.evaluate(() => !!document.querySelector('.ef-hl'));
      await page.evaluate(raster, hl);
      const zr = join(OUT, 'raster-' + id + '.png');
      await page.screenshot({ path: zr, clip: { x: 0, y: 0, width: W, height: H }, animations: 'disabled' });
      zeile += ', ' + relative(process.cwd(), zr);
    }
    console.log(zeile + (fotos.length ? '  [' + fotos.join('; ') + ']' : ''));
    for (const l of lagen) console.log('   Foto ' + l.slot + ' (Ausschnitt ' + l.fp + '): Fläche ' + W + ' × ' + l.h + ', voll sichtbar bis y ' + l.voll + ', ausgeblendet bis y ' + l.unten + '; zeigt Zeilen ' + l.von + ' bis ' + l.bis + ' von ' + l.nh + ', Gesichtszone y ' + OBEN + ' bis ' + l.voll + ' = Zeilen ' + l.gVon + ' bis ' + l.gBis);
    for (const h of [...hinweise, ...konsole]) console.log('   ! ' + h);
  } catch (e) {
    fehler++;
    console.error(id.padEnd(16) + ' FEHLER: ' + e.message);
    for (const h of konsole) console.error('   ! ' + h);
  }
  await page.close();
}
await browser.close();
process.exit(fehler ? 1 : 0);

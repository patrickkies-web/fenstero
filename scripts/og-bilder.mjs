/* eeziframes · Vorschaubilder zum Teilen (og:image) je Ratgeberseite und je Unterseite für Fensterbauer (30.10.2026, Strukturprüfung
   Punkt 7: vorher trugen alle Seiten dasselbe /og.png; Chats, Netzwerke und Google Discover zeigen kein SVG).
   - Ziel: web/bilder/og/<slug>.png, 1200 × 630, unter 200 KB, für jede Seite unter /ratgeber/<slug>/ und /fuer-fensterbauer/<slug>/
     mit Zeichnung im Einstieg (<figure class="rg-bild"><img …>). Die Übersicht /ratgeber/ und die Verkaufsseite /fuer-fensterbauer/
     behalten /og.png.
   - Gestaltung nach der Design-DNA (Palette „Task-App dunkel“): Grund Schwarz mit Lichtteich, Etikett mit violettem Punkt, der Titel aus
     dem h1 der Seite (Suchwort in Weiß, die zweite Stimme .ak in Silbergrau, Outfit 600, höchstens vier Zeilen), unten die Wortmarke
     (Inter Marke) und eeziframes.com; rechts die Zeichnung der Seite als weißes Blatt mit Kontaktschatten. Keine Weichzeichner, kein
     Violett als Fläche, Text ab 20 px.
   - Quelle: das h1 und die Zeichnung jeder Seite (scripts/ratgeber-bausteine.mjs: seiten(), zeichnungenVon()), Schriften aus web/fonts/.
   - Idempotent: Jedes PNG trägt die Prüfsumme seiner Eingaben (Seitenvorlage mit Titel, Zeichnung, Schriften und dieses Skript) im
     Textfeld „eezi-quelle“; stimmt sie, wird nicht neu gezeichnet (Chromium zeichnet sonst bei jedem Lauf einzelne Pixel anders). Den Verweis im Kopf jeder Seite (og:image) setzt
     node scripts/ratgeber-bausteine.mjs; die Prüfsuite (Abschnitt 10) prüft Maße, Größe und Zuordnung.
   Aufruf: node scripts/og-bilder.mjs        (danach node scripts/ratgeber-bausteine.mjs) */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { seiten, zeichnungenVon } from './ratgeber-bausteine.mjs';

const WURZEL = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const WEB = path.join(WURZEL, 'web');
const ZIEL = path.join(WEB, 'bilder', 'og');
const require = createRequire(process.env.PW_PFAD ? process.env.PW_PFAD.replace(/\/?$/, '/') + 'x.js' : '/opt/node-tools/x.js');
const { chromium } = require('playwright-core');

const daten = (datei, typ) => 'data:' + typ + ';base64,' + fs.readFileSync(datei).toString('base64');
const OUTFIT = daten(path.join(WEB, 'fonts/outfit.woff2'), 'font/woff2');
const INTER = daten(path.join(WEB, 'fonts/inter-marke.woff2'), 'font/woff2');
const ZEICHEN = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="10" fill="#07090a"/><g fill="#fff"><path d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/><path d="M45 22 57 17.6V41.9L45 39.8Z"/><path d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/></g><rect x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#fff" stroke-opacity=".2"/></svg>';

/* Titel aus dem h1: Text vor <span class="ak"> in Weiß, der Inhalt der Spanne in Silbergrau */
const titelVon = (html) => {
  const h1 = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '';
  const m = h1.match(/^([\s\S]*?)<span class="ak">([\s\S]*?)<\/span>([\s\S]*)$/);
  const text = (s) => s.replace(/<[^>]+>/g, '').trim();
  return m ? [text(m[1]), text(m[2] + m[3])] : [text(h1), ''];
};
const esc = (s) => s.replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;');

const seite = (etikett, [weiss, grau], svg, w, h) => {
  /* Zeichnung: höchstens 470 × 440, rechts, senkrecht mittig */
  const s = Math.min(470 / w, 440 / h), bw = Math.round(w * s), bh = Math.round(h * s);
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:"Outfit";font-weight:100 900;src:url(${OUTFIT}) format("woff2")}
@font-face{font-family:"Inter Marke";font-weight:100 900;src:url(${INTER}) format("woff2")}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden;background:#07090a}
body{position:relative;font-family:"Outfit",sans-serif;color:#fff;-webkit-font-smoothing:antialiased;
  background:radial-gradient(55% 60% at 74% 52%,#141517,#07090a 72%),#07090a}
.text{position:absolute;left:72px;top:64px;width:${1200 - 72 - bw - 72 - 56}px;bottom:64px;display:flex;flex-direction:column}
.etikett{display:flex;align-items:center;gap:12px;font:400 22px/1 "Outfit";letter-spacing:.03em;color:#a8a4a9}
.etikett i{width:8px;height:8px;border-radius:50%;background:#897efc;box-shadow:0 0 0 4px rgba(60,58,102,.75)}
h1{margin-top:22px;font:600 var(--g,64px)/1 "Outfit";letter-spacing:-.03em;hyphens:manual;overflow-wrap:normal;text-wrap:balance}
h1 span{color:#a8a4a9}
.fuss{margin-top:auto;display:flex;align-items:center;gap:14px}
.fuss svg{width:40px;height:40px}
.wm{font:500 28px/1 "Inter Marke";letter-spacing:-.02em}
.wm b{font-weight:900}
.adresse{margin-left:8px;padding-left:16px;border-left:1px solid rgba(168,164,169,.35);font:400 22px/1 "Outfit";color:#a8a4a9}
.blatt{position:absolute;right:72px;top:${Math.round((630 - bh) / 2)}px;width:${bw}px;height:${bh}px;border-radius:16px;background:#fff;
  box-shadow:inset 0 0 0 1px rgba(7,9,10,.06),0 1px 0 rgba(255,255,255,.35),0 40px 60px -30px rgba(0,0,0,.9);overflow:hidden}
.blatt img{display:block;width:100%;height:100%}
.schatten{position:absolute;right:${72 + Math.round(bw * .08)}px;top:${Math.round((630 + bh) / 2) - 6}px;width:${Math.round(bw * .84)}px;height:28px;
  border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.85),rgba(0,0,0,0))}
</style></head><body>
<div class="schatten"></div><div class="blatt"><img src="${svg}" alt=""></div>
<div class="text"><p class="etikett"><i></i>${esc(etikett)}</p><h1>${esc(weiss)}${grau ? ' <span>' + esc(grau) + '</span>' : ''}</h1>
<div class="fuss">${ZEICHEN}<span class="wm"><b>eezi</b>frames</span><span class="adresse">eeziframes.com</span></div></div>
</body></html>`;
};

/* Prüfsumme im PNG: tEXt-Feld direkt hinter dem Kopf (IHDR), lesen und schreiben */
const SKRIPT = fs.readFileSync(url.fileURLToPath(import.meta.url));
const SCHLUESSEL = 'eezi-quelle';
const quelleVon = (png) => {
  for (let o = 8; o + 8 <= png.length;) {
    const n = png.readUInt32BE(o), typ = png.toString('latin1', o + 4, o + 8);
    if (typ === 'tEXt') { const t = png.toString('latin1', o + 8, o + 8 + n); if (t.startsWith(SCHLUESSEL + '\0')) return t.slice(SCHLUESSEL.length + 1); }
    if (typ === 'IDAT') return '';
    o += 12 + n;
  }
  return '';
};
const mitQuelle = (png, wert) => {
  const daten = Buffer.from(SCHLUESSEL + '\0' + wert, 'latin1'), kopf = Buffer.alloc(8);
  kopf.writeUInt32BE(daten.length, 0); kopf.write('tEXt', 4, 'latin1');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([kopf.subarray(4), daten])) >>> 0, 0);
  return Buffer.concat([png.subarray(0, 33), kopf, daten, crc, png.subarray(33)]);
};

const alle = seiten(WEB).filter(([p]) => /^\/(ratgeber|fuer-fensterbauer)\/[^/]+\/$/.test(p));
const zeichnungen = zeichnungenVon(alle);
fs.mkdirSync(ZIEL, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
let neu = 0, zahl = 0, groesste = 0;
for (const [pfad, datei] of alle) {
  const z = zeichnungen[pfad];
  if (!z) continue;
  const slug = pfad.split('/').filter(Boolean).pop();
  const svgDatei = path.join(WEB, z.src);
  const etikett = pfad.startsWith('/fuer-fensterbauer/') ? 'Für Fensterbauer' : 'Ratgeber';
  const html = seite(etikett, titelVon(fs.readFileSync(datei, 'utf8')), daten(svgDatei, 'image/svg+xml'), +z.w, +z.h);
  const quelle = crypto.createHash('sha256').update(html).update(SKRIPT).digest('hex').slice(0, 16);
  const ziel = path.join(ZIEL, slug + '.png');
  zahl++;
  if (fs.existsSync(ziel)) { const alt = fs.readFileSync(ziel); groesste = Math.max(groesste, alt.length); if (quelleVon(alt) === quelle) continue; }
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  /* Titel stufenweise kleiner, bis er in vier Zeilen ohne Trennstrich und über die Marke passt */
  await page.evaluate(() => {
    const h1 = document.querySelector('h1'), fuss = document.querySelector('.fuss');
    /* ganze Wörter ohne Trennstrich; erst wenn auch 44 px nicht reichen, darf das Wort brechen */
    for (const g of [64, 58, 52, 48, 44]) {
      h1.style.setProperty('--g', g + 'px');
      const zeilen = Math.round(h1.getBoundingClientRect().height / g);
      if (zeilen <= 4 && h1.scrollWidth <= h1.clientWidth && h1.getBoundingClientRect().bottom <= fuss.getBoundingClientRect().top - 24) return;
    }
    h1.style.hyphens = 'auto';
  });
  /* Zeichnung erst ganz dekodiert und zwei Bilder gezeichnet, sonst schwankt ein Bild zwischen den Läufen */
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())).then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))));
  const bild = mitQuelle(await page.screenshot({ type: 'png' }), quelle);
  groesste = Math.max(groesste, bild.length);
  fs.writeFileSync(ziel, bild); neu++;
}
await browser.close();
console.log(zahl + ' Vorschaubilder, ' + neu + ' neu geschrieben, größtes ' + Math.round(groesste / 1024) + ' KB');

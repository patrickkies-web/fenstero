/* Ganzseiten-Aufnahme für die Farbmessung einer Betriebspalette: Kundenansicht ohne Muster-Leiste und Etiketten, Vorhang aus,
   Bilder und Fotoplätze magenta (zählen getrennt als „Bild“). Aufruf: node palette.mjs <ausgabeordner> <url> [name] */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const [,, OUT, URL, NAME = 'seite'] = process.argv;
mkdirSync(OUT, { recursive: true });
const MAGENTA = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23ff00ff'/%3E%3C/svg%3E";
const b = await chromium.launch();
for (const [w, h, g] of [[390, 844, 'tel'], [1280, 800, 'desk']]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, locale: 'de-DE' });
  await ctx.addInitScript(() => { try { localStorage.setItem('ez-muster', 'aus'); } catch (e) {} });
  const p = await ctx.newPage(); await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(2600);
  await p.addStyleTag({ content: `.ez-ml, .ez-leiste, .ez-skip { display: none !important; } .dna-szene { position: relative !important; top: auto !important; }
    img { content: url("${MAGENTA}") !important; } .ez-foto { background: #ff00ff !important; } .ez-foto > * { visibility: hidden !important; }` });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${NAME}-${g}.png`, fullPage: true });
  await ctx.close();
}
await b.close();

/* Ratgeber, Rechtstexte und Fehlerseite in der Design-DNA prüfen (28.10.2026), nach dem Muster von
   .claude/skills/design-dna-eeziframes/werkzeuge/pruef.mjs, aber mit den Klassen dieser Seiten:
   1. weniger Bewegung: keine laufenden Animationen, alles sichtbar,
   2. ohne JavaScript: Titel, Pillen, Zeichnung und Text stehen sofort,
   3. Ziele ab 44 px (Links im Fließtext ausgenommen, wie WCAG 2.5.8), Tab-Weg der ersten Ziele,
   4. eine volle Pille je Telefon-Bildschirm, im ersten Bildschirm im unteren Drittel,
   5. nach 2,6 s keine laufenden Animationen, keine Konsolenfehler.
   Aufruf: node docs/profis/werkzeuge/ratgeber-pruef.mjs <basis> <pfad> [<pfad> …]   (z. B. http://localhost:8789 /ratgeber/) */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [,, BASIS = 'http://localhost:8789', ...PFADE] = process.argv;
const browser = await chromium.launch();
const ergebnis = {};
const voll = '.rg .btn.primary, main .knopf:not(.leise), main.mitte .knopf:not(.leise)';
for (const pfad of PFADE.length ? PFADE : ['/ratgeber/']) {
  const e = ergebnis[pfad] = {};
  // 1. weniger Bewegung
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  let page = await ctx.newPage();
  await page.goto(BASIS + pfad, { waitUntil: 'load' }); await page.waitForTimeout(150);
  e.ruhig = await page.evaluate(() => ({ animationen: document.getAnimations().length, h1: getComputedStyle(document.querySelector('h1')).opacity }));
  await ctx.close();
  // 2. ohne JavaScript
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  page = await ctx.newPage();
  await page.goto(BASIS + pfad, { waitUntil: 'load' }); await page.waitForTimeout(300);
  e.ohneJs = await page.evaluate((voll) => {
    const sicht = (s) => { const el = document.querySelector(s); if (!el) return 'fehlt'; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).opacity === '1' && getComputedStyle(el).visibility === 'visible'; };
    return { h1: sicht('h1'), pille: sicht(voll), bild: document.querySelector('.rg-bild, .rg-wegkarte, .foto-karte') ? sicht('.rg-bild, .rg-wegkarte, .foto-karte') : 'keins', quer: document.documentElement.scrollWidth > innerWidth + 1 };
  }, voll);
  await ctx.close();
  // 3.–5. Ziele, Tab-Weg, Pillen je Bildschirm, Animationen
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  const fehler = []; page.on('console', (m) => { if (m.type() === 'error' && !/status of 404/.test(m.text())) fehler.push(m.text()); }); page.on('pageerror', (f) => fehler.push(String(f)));
  await page.goto(BASIS + pfad, { waitUntil: 'networkidle' }); await page.waitForTimeout(2600);
  e.animationenNach26 = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  const m = await page.evaluate((voll) => {
    const klein = [];
    document.querySelectorAll('a, button, summary').forEach((el) => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      if (el.closest('p, li, td, address, figcaption, .rg-stand') && !el.matches('.btn, .knopf, .rg-karte') && !el.closest('.rg-inhalt, .rg-pfad, .rg-weg-liste, .fuss, .rg-fuss, .kontakt')) return; // Links im Fließtext
      if (el.matches('.rg-skip')) return;
      if (r.height < 44 || r.width < 44) klein.push((el.textContent || '').trim().slice(0, 28) + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
    });
    const tab = [...document.querySelectorAll('a[href], button, summary, [tabindex="0"]')].filter((el) => el.tabIndex >= 0).slice(0, 10).map((el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 26) || el.getAttribute('aria-label'));
    const pillen = [...document.querySelectorAll(voll)].map((p) => { const r = p.getBoundingClientRect(); return { oben: Math.round(r.top + scrollY), unten: Math.round(r.bottom + scrollY) }; });
    return { klein, tab, pillen, hoehe: document.documentElement.scrollHeight };
  }, voll);
  /* Bildschirme in Telefon-Höhe: wie viele volle Pillen liegen ganz darin? */
  const schirme = [];
  for (let y = 0; y < m.hoehe; y += 844) schirme.push(m.pillen.filter((p) => p.oben >= y && p.unten <= y + 844).length);
  e.ziele = m.klein; e.tabWeg = m.tab; e.pillenJeBildschirm = schirme.join(' ');
  e.erstePille = m.pillen.length ? m.pillen[0].oben + ' px (unteres Drittel ab 563)' : 'keine';
  e.konsolenfehler = fehler;
  await ctx.close();
}
console.log(JSON.stringify(ergebnis, null, 1));
await browser.close();

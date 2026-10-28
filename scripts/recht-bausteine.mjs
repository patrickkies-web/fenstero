/* eeziframes · Wiederkehrende Bausteine der Rechtstexte und der Fehlerseite an einer Stelle pflegen (seit dem Gremium vom 28.10.2026,
   docs/profis/2026-10-28-ratgeber-dna.md). Der Rechtstext selbst bleibt Wort für Wort, wie er ist; das Skript setzt nur:
   - den Kopf: Grund sofort Schwarz, Outfit und die Wortmarke vorab (die Schriften stehen in web/assets/recht.css), /assets/druck.js
     für das Druckgefühl auf dem iPhone,
   - den Fuß mit „Für Fensterbauer“ (nach dem Ratgeber, sonst nach der Startseite) und der eigenen Seite (aria-current),
   - bei langen Texten (ab 10 Abschnitten) ids an den Überschriften und „Auf dieser Seite“ nach „Kurz gesagt“.
   Aufruf: node scripts/recht-bausteine.mjs (idempotent; ein zweiter Lauf ändert nichts) */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const WEB = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web');
export const SEITEN = ['/impressum/', '/datenschutz/', '/agb/', '/nutzungsbedingungen/', '/cookies/', '/widerruf/', '/konfigurator-bedingungen/', '/404.html'];
const datei = (p) => path.join(WEB, p === '/404.html' ? '404.html' : p + 'index.html');

const KOPF = '<link rel="preload" href="/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="/fonts/inter-marke.woff2" as="font" type="font/woff2" crossorigin>\n' +
  '<link rel="stylesheet" href="/assets/recht.css">\n<script src="/assets/druck.js" defer></script>\n';
const slug = (t) => t.replace(/<[^>]+>/g, '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-') || 'abschnitt';

export function baue(pfad, html) {
  /* Kopf */
  let h = html.replace(/<link rel="preload" href="\/fonts\/[^"]+" as="font"[^>]*>\n/g, '').replace(/<link rel="stylesheet" href="\/fonts\/(?:fonts|dna)\.css">\n/g, '')
    .replace(/<script src="\/assets\/druck\.js" defer><\/script>\n/g, '').replace(/<link rel="stylesheet" href="\/assets\/recht\.css">\n?/, () => KOPF);
  /* Fuß: Für Fensterbauer nach dem Ratgeber, die eigene Seite markiert */
  h = h.replace(/<footer class="fuss">([\s\S]*?)<\/footer>/, (m, innen) => {
    let f = innen.replace(/ aria-current="page"/g, '').replace(/<a href="\/fuer-fensterbauer\/">Für Fensterbauer<\/a>/g, '')
      .replace(/(<a href="\/ratgeber\/">Ratgeber<\/a>)|^(<a href="\/">Startseite<\/a>)(?![\s\S]*href="\/ratgeber\/")/, (x) => x + '<a href="/fuer-fensterbauer/">Für Fensterbauer</a>');
    /* die eigene Seite markiert; „Vertrag widerrufen“ bleibt als Knopf unverändert (auch auf /widerruf/) */
    if (pfad !== '/404.html') f = f.replace(new RegExp('<a href="' + pfad.replace(/\//g, '\\/') + '"'), (x) => x + ' aria-current="page"');
    return '<footer class="fuss">' + f + '</footer>';
  });
  /* Auf dieser Seite bei langen Texten */
  h = h.replace(/\n {2}<nav class="recht-inhalt"[\s\S]*?<\/nav>/, '');
  const main = h.match(/<main id="inhalt">[\s\S]*?<\/main>/);
  if (!main || (main[0].match(/<h2[\s>]/g) || []).length < 10) return h;
  const vergeben = new Set([...h.matchAll(/ id="([^"]+)"/g)].map((x) => x[1]));
  const liste = [];
  let m = main[0].replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (alles, attr, inhalt) => {
    let id = (attr && (attr.match(/\sid="([^"]+)"/) || [])[1]) || '';
    if (!id) {
      const grund = /^\d/.test(slug(inhalt)) ? 'p' + slug(inhalt) : slug(inhalt);
      id = grund; let n = 2; while (vergeben.has(id)) id = grund + '-' + n++;
      vergeben.add(id);
      alles = '<h2' + (attr || '') + ' id="' + id + '">' + inhalt + '</h2>';
    }
    liste.push('<li><a href="#' + id + '">' + inhalt.replace(/<[^>]+>/g, '') + '</a></li>');
    return alles;
  });
  const nav = '\n  <nav class="recht-inhalt" aria-label="Auf dieser Seite"><p>Auf dieser Seite</p><ol>' + liste.join('') + '</ol></nav>';
  const nachKarte = m.match(/<\/h1>\s*<div class="karte">[\s\S]*?<\/div>/);
  m = nachKarte ? m.replace(nachKarte[0], (x) => x + nav) : m.replace(/<\/h1>/, (x) => x + nav);
  return h.replace(main[0], () => m);
}

export const gebaut = () => SEITEN.map((p) => { const alt = fs.readFileSync(datei(p), 'utf8'); return [p, datei(p), alt, baue(p, alt)]; });

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  let n = 0;
  for (const [, d, alt, neu] of gebaut()) if (neu !== alt) { fs.writeFileSync(d, neu); n++; }
  console.log('Rechtstexte und Fehlerseite: ' + n + ' Dateien neu geschrieben');
}

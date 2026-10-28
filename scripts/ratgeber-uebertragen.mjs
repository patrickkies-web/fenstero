/* eeziframes · Ratgeber in der Design-DNA aus der Vorschau in die Website übertragen (28.10.2026).
   Quelle: docs/profis/ratgeber-vorschau/ (dna/tokens.css und dna/bundle.css unverändert aus der DNA, ratgeber.css und ratgeber.js
   mit den eigenen Klassen rg-). Ziel: web/assets/ratgeber-dna.css (Tokens und eigene Gestaltung in einer Datei, ohne Kommentare) und
   web/assets/ratgeber-dna.js. Aus dna/bundle.css kommen nur die Druckkurve, die Fokusregel und die Auswahlfarbe mit: keine Ratgeberseite
   benutzt eine Klasse dna- (Gremium 28.10.2026: die Datei halbiert sich). Danach node scripts/ratgeber-bausteine.mjs: Der Kopf jeder
   Seite verweist mit einer Prüfsumme (?v=…) auf beide Dateien, web/_headers hält sie ein Jahr im Zwischenspeicher.
   Mit --vorschau baut es außerdem die Vorschau für das Artifact (Ordner docs/profis/ratgeber-vorschau/artifact/, nicht im Repo):
   alle Ratgeber, das Wissen für Fensterbauer, die Rechtstexte und die Fehlerseite aus den echten Seiten unter web/, mit flachen
   Dateinamen und relativen Pfaden, Schriften und Zeichnungen daneben; index.html ohne Dokumentgerüst (das legt der Artifact-Dienst
   herum), die übrigen Seiten als ganze Dokumente. Links auf Seiten außerhalb der Vorschau zeigen auf eeziframes.com.
   Aufruf: node scripts/ratgeber-uebertragen.mjs [--vorschau] */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const WURZEL = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const QUELLE = path.join(WURZEL, 'docs/profis/ratgeber-vorschau');
const lies = (p) => fs.readFileSync(path.join(QUELLE, p), 'utf8');

const bundle = lies('dna/bundle.css');
const aus = (muster) => { const m = bundle.match(muster); if (!m) throw new Error('dna/bundle.css: ' + muster + ' fehlt'); return m[0].trim(); };
const GRUND = ':root { ' + aus(/--dna-druck:[^;]+;/) + ' }\n' + aus(/:where\(a, button, input, \[tabindex\]\):focus-visible \{[^}]*\}/).replace(':where(a, button, input, [tabindex])', ':where(a, button, input, summary, [tabindex])') + '\n' + aus(/::selection \{[^}]*\}/) + '\n';
const ohneKommentare = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/[ \t]+\n/g, '\n').replace(/\n\s*\n+/g, '\n');
const css = '/* Ratgeber, Wissen für Fensterbauer (Design-DNA, Palette „Task-App dunkel“). Erzeugt von scripts/ratgeber-uebertragen.mjs aus\n' +
  '   docs/profis/ratgeber-vorschau/ (dna/tokens.css, Teile von dna/bundle.css, ratgeber.css, dort mit Kommentaren); Änderungen dort machen. */\n' +
  ohneKommentare(lies('dna/tokens.css') + '\n' + GRUND + lies('ratgeber.css')).trim() + '\n';
fs.writeFileSync(path.join(WURZEL, 'web/assets/ratgeber-dna.css'), css);
fs.writeFileSync(path.join(WURZEL, 'web/assets/ratgeber-dna.js'), lies('ratgeber.js'));
console.log('web/assets/ratgeber-dna.css ' + Math.round(css.length / 1024) + ' KB, web/assets/ratgeber-dna.js');

/* ---------- Vorschau für das Artifact ---------- */
if (process.argv.includes('--vorschau')) {
  const WEB = path.join(WURZEL, 'web'), ZIEL = path.join(QUELLE, 'artifact');
  fs.rmSync(ZIEL, { recursive: true, force: true });
  for (const d of ['assets', 'fonts', 'bilder']) fs.mkdirSync(path.join(ZIEL, d), { recursive: true });
  /* Seiten: Pfad auf der Website → Datei in der Vorschau */
  const ordner = (rel) => fs.readdirSync(path.join(WEB, rel)).filter((n) => fs.statSync(path.join(WEB, rel, n)).isDirectory()).sort();
  const SEITEN = [['/ratgeber/fenster-ausmessen/', 'index.html'], ['/ratgeber/', 'ratgeber.html']]
    .concat(ordner('ratgeber').filter((n) => n !== 'fenster-ausmessen').map((n) => ['/ratgeber/' + n + '/', 'ratgeber-' + n + '.html']))
    .concat(ordner('fuer-fensterbauer').map((n) => ['/fuer-fensterbauer/' + n + '/', 'wissen-' + n + '.html']))
    .concat(['impressum', 'datenschutz', 'agb', 'nutzungsbedingungen', 'cookies', 'widerruf', 'konfigurator-bedingungen'].map((n) => ['/' + n + '/', n + '.html']))
    .concat([['/404.html', 'fehlerseite.html']]);
  const DATEI = Object.fromEntries(SEITEN);
  const LIVE = 'https://eeziframes.com';
  /* Links: Seiten der Vorschau relativ, alles andere auf die Website; Dateien (Bilder, Schriften, Skripte) relativ */
  const umschreiben = (html) => html
    .replace(/(href|src)="(\/[^"#?]*)(\?[^"#]*)?(#[^"]*)?"/g, (m, attr, pfad, frage, frag) => {
      if (DATEI[pfad]) return attr + '="' + DATEI[pfad] + (frag || '') + '"';
      if (/^\/(assets|fonts|bilder)\//.test(pfad)) return attr + '="' + pfad.slice(1) + (frag || '') + '"'; /* ohne ?v=: die Vorschau braucht keinen Zwischenspeicher-Schlüssel */
      if (/^\/(favicon\.svg|apple-touch-icon\.png|og\.png)$/.test(pfad)) return attr + '="' + LIVE + pfad + '"';
      return attr + '="' + LIVE + pfad + (frag || '') + '"';
    })
    .replace(/<link rel="preload"[^>]*>\n/g, '')
    .replace(/<link rel="stylesheet" href="fonts\/(fonts|dna)\.css">\n/g, '')
    .replace(/<link rel="stylesheet" href="assets\/(ratgeber-dna|recht)\.css">/, (m) => '<link rel="stylesheet" href="fonts/vorschau.css">\n' + m);
  /* Schriften: Outfit und Inter lokal, relative Adressen */
  for (const f of ['outfit.woff2', 'inter-marke.woff2', 'inter-latin-wght-normal.woff2', 'inter-latin-ext-wght-normal.woff2', 'OFL.txt', 'OFL-Outfit.txt']) fs.copyFileSync(path.join(WEB, 'fonts', f), path.join(ZIEL, 'fonts', f));
  fs.writeFileSync(path.join(ZIEL, 'fonts/vorschau.css'), '/* Outfit und Inter (SIL Open Font License 1.1, OFL.txt, OFL-Outfit.txt), lokal */\n' +
    '@font-face { font-family: "Outfit"; font-style: normal; font-display: swap; font-weight: 200 700; src: url(outfit.woff2) format("woff2"); }\n' +
    '@font-face { font-family: "Inter"; font-style: normal; font-display: swap; font-weight: 100 900; src: url(inter-latin-wght-normal.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }\n' +
    '@font-face { font-family: "Inter"; font-style: normal; font-display: swap; font-weight: 100 900; src: url(inter-latin-ext-wght-normal.woff2) format("woff2"); unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F; }\n');
  /* Schriften und Bilder in den Gestaltungsdateien relativ zur Datei (assets/) */
  for (const f of ['ratgeber-dna.css', 'ratgeber-dna.js', 'recht.css', 'druck.js']) fs.writeFileSync(path.join(ZIEL, 'assets', f), fs.readFileSync(path.join(WEB, 'assets', f), 'utf8').replace(/url\(\/(fonts|bilder)\//g, 'url(../$1/'));
  const bilder = new Set();
  for (const [pfad, datei] of SEITEN) {
    const quelle = pfad === '/404.html' ? path.join(WEB, '404.html') : path.join(WEB, pfad, 'index.html');
    let html = umschreiben(fs.readFileSync(quelle, 'utf8'));
    for (const m of html.matchAll(/src="(bilder\/[^"]+)"/g)) bilder.add(m[1]);
    if (datei === 'index.html') {
      /* ohne Dokumentgerüst: Gestaltung und Inhalt; Klasse und Thema des body setzt ein kleines Skript */
      const kopf = (html.match(/<link rel="stylesheet"[^>]*>/g) || []).join('\n'), inhalt = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
      html = '<title>eeziframes Ratgeber</title>\n<style>html,body{background:#07090a}</style>\n' + kopf + '\n<script>document.body.classList.add("rg-seite");document.body.setAttribute("data-theme","dunkel");</script>\n' +
        inhalt.replace(/<script src="assets\/ratgeber-dna\.js(?:\?[^"]*)?" defer><\/script>/, '') + '\n<script src="assets/ratgeber-dna.js"></script>\n';
    }
    fs.writeFileSync(path.join(ZIEL, datei), html);
  }
  for (const b of bilder) { fs.mkdirSync(path.dirname(path.join(ZIEL, b)), { recursive: true }); fs.copyFileSync(path.join(WEB, b), path.join(ZIEL, b)); }
  console.log('Vorschau: ' + SEITEN.length + ' Seiten, ' + bilder.size + ' Bilder in ' + path.relative(WURZEL, ZIEL));
}

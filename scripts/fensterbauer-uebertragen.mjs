// eeziframes · Überträgt die Vorschau der Seite für Fensterbauer (docs/profis/fensterbauer-vorschau/, Design-DNA) in die echte Seite:
//   web/fuer-fensterbauer/index.html      Kopf der Seite (Titel, Beschreibung, Open Graph, JSON-LD) um den Rahmen .fb der Vorschau,
//                                         Bilder unter /bilder/fensterbauer-dna/, FAQ zusätzlich als FAQPage
//   web/assets/fensterbauer-dna.css       dna/tokens.css, dna/bundle.css und start.css der Vorschau; :root und body gelten für den Rahmen
//                                         .fb, html/body der Vorschau für body.fb-seite (eingebettet in die Startseite bleibt das Portal unberührt)
//   web/assets/fensterbauer-dna.js        start.js der Vorschau (FbSeite.auf für die Einbettung, portal.js)
//   web/assets/js-da.js                   setzt html.ez-js (statt eines Inline-Skripts, das die CSP verbietet)
//   web/bilder/fensterbauer-dna/          die Bilder der Vorschau
// Aufruf: node scripts/fensterbauer-uebertragen.mjs, danach node scripts/bedingungen-pdf.mjs (setzt die Preis-Bausteine ein).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const W = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = path.join(W, 'docs/profis/fensterbauer-vorschau');
const lies = (p) => fs.readFileSync(p, 'utf8');
const schreib = (rel, text) => { const p = path.join(W, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); console.log('geschrieben: ' + rel); };
const muss = (text, alt, neu) => { if (text.indexOf(alt) < 0) throw new Error('nicht gefunden: ' + alt.slice(0, 80)); return text.split(alt).join(neu); };

/* ---------- Markup ---------- */
const vorschau = lies(path.join(V, 'index.html'));
const anfang = vorschau.indexOf('<div class="fb dna-wurzel ez"'), ende = vorschau.indexOf('<script src="dna/bundle.js">');
if (anfang < 0 || ende < 0) throw new Error('Rahmen .fb in der Vorschau nicht gefunden');
const rahmen = vorschau.slice(anfang, ende).trimEnd().replace(/src="bilder\//g, 'src="/bilder/fensterbauer-dna/');
if (/src="bilder\//.test(rahmen) || /href="(dna|fonts)\//.test(rahmen)) throw new Error('relative Pfade im Rahmen');

/* FAQ als FAQPage, Text wie sichtbar (ohne Markup); Antworten aus Bausteinen (je Umgebung anders) bleiben draußen, Entitäten sind in den
   Antworten nicht erlaubt, damit JSON-LD und Seite wortgleich bleiben (Prüfsuite, Abschnitt 10 und 29) */
const sichtbar = (t) => t.replace(/<[^>]+>/g, '').trim();
const fragen = [...rahmen.matchAll(/<details class="ez-frage"[^>]*><summary><span>([^<]+)<\/span>[\s\S]*?<\/summary><div class="frage-antwort">([\s\S]*?)<\/div><\/details>/g)]
  .filter((m) => !/<!--pakete:/.test(m[2]))
  .map((m) => ({ '@type': 'Question', name: m[1], acceptedAnswer: { '@type': 'Answer', text: sichtbar(m[2]) } }));
if (fragen.length < 6) throw new Error('FAQ nicht gefunden');
for (const q of fragen) if (/&[a-z#0-9]+;/.test(q.acceptedAnswer.text)) throw new Error('Entität in der FAQ-Antwort: ' + q.name);
const faqLd = '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'FAQPage', mainEntity: fragen }] }).replace(/</g, '\\u003c') + '</script>';

/* Kopf: Titel bis Icon und der ld-Baustein bleiben aus der bisherigen Datei (eine Quelle für Titel und Beschreibung) */
const altePfad = path.join(W, 'web/fuer-fensterbauer/index.html'), alt = fs.existsSync(altePfad) ? lies(altePfad) : '';
const meta = (/<title>[\s\S]*?<link rel="apple-touch-icon"[^>]*>/.exec(alt) || [])[0];
const ld = (/<!--pakete:ld-->[\s\S]*?<!--\/pakete:ld-->/.exec(alt) || [])[0];
if (!meta || !ld) throw new Error('Kopf (title … apple-touch-icon) oder Baustein ld in web/fuer-fensterbauer/index.html nicht gefunden');
const seite = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${meta.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#07090a">')}
<style>html,body{background:#07090a}</style>
<link rel="preload" href="/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/bilder/fensterbauer-dna/geraet.webp" as="image" fetchpriority="high">
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/fonts/dna.css">
<link rel="stylesheet" href="/assets/fensterbauer-dna.css">
<script src="/assets/js-da.js"></script>
${ld}
${faqLd}
</head>
<body class="fb-seite">
<!-- Seite für Fensterbauer nach der Design-DNA (26.10.2026). Quelle: docs/profis/fensterbauer-vorschau/index.html, übertragen von
     scripts/fensterbauer-uebertragen.mjs; Änderungen dort machen und neu übertragen. Preise und Pakete nur aus web/assets/pakete.js
     (Bausteine pakete:fb-…, eingesetzt von functions/pakete-seite.js und node scripts/bedingungen-pdf.mjs). -->
${rahmen}
<script src="/assets/dna-bundle.js"></script>
<script src="/assets/fensterbauer-dna.js"></script>
</body>
</html>
`;
schreib('web/fuer-fensterbauer/index.html', seite);

/* ---------- Gestaltung ---------- */
let tokens = lies(path.join(V, 'dna/tokens.css'));
if (!/:root/.test(tokens)) throw new Error('tokens.css ohne :root');
tokens = tokens.replace(/:root/g, '.fb');
let bundle = lies(path.join(V, 'dna/bundle.css'));
bundle = muss(bundle, '\nbody { margin: 0;', '\n.fb { margin: 0;');
bundle = muss(bundle, ':where(a, button, input, [tabindex]):focus-visible', '.fb :where(a, button, input, [tabindex]):focus-visible');
let start = lies(path.join(V, 'start.css')).split('\n').filter((z) => !/^@font-face/.test(z)).join('\n');
start = muss(start, 'html, body { background: var(--schwarz); margin: 0; overflow-x: clip; }', 'body.fb-seite { background: var(--schwarz); margin: 0; overflow-x: clip; }');
if (/^(html|body)\b/m.test(start.replace(/^html:not\(\.ez-js\)/gm, '').replace(/^body\.fb-seite/gm, ''))) throw new Error('start.css: html/body-Regel ohne Begrenzung');
const kopf = `/* Seite für Fensterbauer nach der Design-DNA (Palette „Task-App dunkel“), auch eingebettet in die Startseite (.fb.eingebettet).
   Erzeugt von scripts/fensterbauer-uebertragen.mjs aus docs/profis/fensterbauer-vorschau/ (dna/tokens.css, dna/bundle.css, start.css):
   :root und body gelten hier für den Rahmen .fb, html/body der Vorschau für body.fb-seite; Schriften kommen aus /fonts/fonts.css und
   /fonts/dna.css. Änderungen in der Vorschau machen und neu übertragen. */
`;
schreib('web/assets/fensterbauer-dna.css', kopf + '/* ---- dna/tokens.css ---- */\n' + tokens.trim() + '\n/* ---- dna/bundle.css ---- */\n' + bundle.trim() + '\n/* ---- start.css ---- */\n' + start.trim() + '\n');

/* ---------- Skripte und Bilder ---------- */
schreib('web/assets/fensterbauer-dna.js', lies(path.join(V, 'start.js')));
schreib('web/assets/js-da.js', "/* Kennzeichnet die Seite als Seite mit JavaScript (html.ez-js), damit die Auftritte der Design-DNA laufen; ohne JavaScript steht alles sofort. Eigene Datei, weil die CSP (functions/seo.js, web/_headers) kein Inline-Skript erlaubt. */\ndocument.documentElement.classList.add('ez-js');\n");
for (const f of fs.readdirSync(path.join(V, 'bilder'))) {
  if (!/\.webp$/.test(f) || !new RegExp('src="/bilder/fensterbauer-dna/' + f.replace('.', '\\.')).test(rahmen)) continue;
  fs.mkdirSync(path.join(W, 'web/bilder/fensterbauer-dna'), { recursive: true });
  fs.copyFileSync(path.join(V, 'bilder', f), path.join(W, 'web/bilder/fensterbauer-dna', f));
  console.log('kopiert: web/bilder/fensterbauer-dna/' + f);
}
console.log('Fertig. Jetzt: node scripts/bedingungen-pdf.mjs');

// eeziframes · Stellt die Vorschau des überarbeiteten Konfigurators (docs/profis/konfigurator-start-vorschau/, Design-DNA, Schritt 1 bis
// Teilen) als Link online: web/vorschau/konfigurator-5269b7215a/ (nicht indexiert, Kopfzeilen für /vorschau/* in web/_headers).
//   index.html        Dokumentgerüst wie beim Artifact-Dienst um index.html der Vorschau; html.ez-js über /assets/js-da.js (CSP: kein
//                     Inline-Skript)
//   app/buehne.html   Bühnenfenster der Wünsche: die App aus /assets/ unverändert; ez-vorab.js gibt ihr einen eigenen Speicher, damit
//                     die Vorschau keine echten Projekte auf dem Gerät liest oder überschreibt
//   alles Übrige      Stile, Skripte, Bausteine, Schriften und Bilder der Vorschau, unverändert
// Die Vorschau bleibt die Quelle; Änderungen gehören dorthin. Aufruf: node scripts/konfigurator-vorschau-uebertragen.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const W = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = path.join(W, 'docs/profis/konfigurator-start-vorschau');
const ZIEL = 'web/vorschau/konfigurator-5269b7215a';
const Z = path.join(W, ZIEL);
const lies = (p) => fs.readFileSync(p, 'utf8');
const schreib = (rel, text) => { const p = path.join(Z, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
const muss = (text, alt, neu) => { if (text.indexOf(alt) < 0) throw new Error('nicht gefunden: ' + alt.slice(0, 80)); return text.split(alt).join(neu); };

fs.rmSync(Z, { recursive: true, force: true });

/* ---------- Seite ---------- */
let seite = lies(path.join(V, 'index.html'));
seite = muss(seite, '<script>document.documentElement.classList.add("ez-js");</script>', '<script src="/assets/js-da.js"></script>');
if (/<script>(?!\s*<\/script>)/.test(seite) || / on[a-z]+="/.test(seite)) throw new Error('Inline-Skript in der Vorschau (CSP)');
const kopf = '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow, noarchive">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>Vorschau · Konfigurator · eeziframes</title>\n'
  + '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
  + '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
  + 'html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
  + 'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>\n</head>\n<body>\n';
schreib('index.html', kopf + seite.trim() + '\n</body>\n</html>\n');

/* ---------- Bühnenfenster: die App aus /assets/ ---------- */
let buehne = lies(path.join(V, 'app/buehne.html'));
buehne = muss(buehne, '<script src="ez-vorab.js" data-pfade="relativ"></script>', '<script src="ez-vorab.js"></script>');
buehne = buehne.replace(/(href|src)="(assets\/|config\.js)/g, '$1="/$2');
if (/(href|src)="(assets|bilder|vendor)\//.test(buehne)) throw new Error('relativer Pfad im Bühnenfenster');
schreib('app/buehne.html', buehne);
for (const f of ['ez-bruecke.js', 'ez-buehne.css', 'ez-vorab.js']) fs.copyFileSync(path.join(V, 'app', f), path.join(Z, 'app', f));

/* ---------- Stile, Skripte, Bausteine, Schriften, Bilder ---------- */
for (const f of ['start.css', 'start.js', 'wuensche.css', 'wuensche.js', 'wuensche-daten.js', 'abschluss.css', 'abschluss.js']) fs.copyFileSync(path.join(V, f), path.join(Z, f));
for (const d of ['dna', 'fonts', 'bilder']) fs.cpSync(path.join(V, d), path.join(Z, d), { recursive: true });

const zaehlen = (p) => fs.readdirSync(p, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? zaehlen(path.join(p, e.name)) : 1), 0);
console.log(ZIEL + '/: ' + zaehlen(Z) + ' Dateien');

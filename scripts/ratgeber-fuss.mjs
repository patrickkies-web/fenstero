/* eeziframes · Fußzeile aller Ratgeberseiten und der Seiten für Fensterbauer an einer Stelle pflegen.
   Drei Gruppen (Ratgeber, Für Fensterbauer, eeziframes mit den Rechtsseiten); der Link der eigenen Seite trägt aria-current.
   Neue Seite: Eintrag in GRUPPEN, dann  node scripts/ratgeber-fuss.mjs  (schreibt alle Dateien unter web/ratgeber/ und
   web/fuer-fensterbauer/ neu). scripts/pruefen.mjs (Abschnitt 10) prüft, dass jede dieser Seiten genau diese Fußzeile trägt und
   jede Seite der Sitemap unter /ratgeber/ und /fuer-fensterbauer/ darin verlinkt ist. */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export const GRUPPEN = [
  ['Ratgeber', [
    ['/ratgeber/', 'Alle Ratgeber'],
    ['/ratgeber/fenster-ausmessen/', 'Fenster ausmessen'],
    ['/ratgeber/balkontuer-ausmessen/', 'Balkontür ausmessen'],
    ['/ratgeber/fenster-mit-rollladen-ausmessen/', 'Fenster mit Rollladen'],
    ['/ratgeber/kellerfenster-ausmessen/', 'Kellerfenster ausmessen'],
    ['/ratgeber/fensterbank-ausmessen/', 'Fensterbank ausmessen'],
    ['/ratgeber/fenster-standardmasse/', 'Standardmaße'],
    ['/ratgeber/bestellmass-fenster/', 'Bestellmaß'],
    ['/ratgeber/din-links-rechts/', 'DIN links oder rechts'],
    ['/ratgeber/bruestungshoehe-fenster/', 'Brüstungshöhe'],
    ['/ratgeber/aufmassblatt-fenster/', 'Aufmaßblatt'],
    ['/ratgeber/fenster-austauschen/', 'Fenster austauschen'],
    ['/ratgeber/fenstertausch-altbau/', 'Fenstertausch im Altbau'],
    ['/ratgeber/ral-montage-fenster/', 'RAL-Montage'],
    ['/ratgeber/uw-wert-fenster/', 'Uw-Wert und Förderung'],
    ['/ratgeber/lueftungskonzept-fenstertausch/', 'Lüftungskonzept']
  ]],
  ['Für Fensterbauer', [
    ['/fuer-fensterbauer/', 'Aufmaß-App für Fensterbauer'],
    ['/fuer-fensterbauer/erstaufmass-feinaufmass/', 'Erstaufmaß und Feinaufmaß'],
    ['/fuer-fensterbauer/falsches-aufmass-haftung/', 'Falsches Aufmaß: Haftung'],
    ['/fuer-fensterbauer/aufmass-kostenpflichtig/', 'Aufmaß kostenpflichtig?'],
    ['/fuer-fensterbauer/geplatzter-aufmasstermin/', 'Geplatzter Aufmaßtermin'],
    ['/fuer-fensterbauer/fensterbau-software/', 'Fensterbau-Software'],
    ['/#tour', 'Tour für Fensterbauer']
  ]],
  ['Mehr', [
    ['/', 'Startseite'],
    ['/app/', 'App'],
    ['/agb/', 'AGB'],
    ['/nutzungsbedingungen/', 'Nutzungsbedingungen'],
    ['/datenschutz/', 'Datenschutz'],
    ['/cookies/', 'Cookies'],
    ['/impressum/', 'Impressum']
  ]]
];

export function fusszeile(eigen) {
  const link = ([href, text]) => '<a href="' + href + '"' + (href === eigen ? ' aria-current="page"' : '') + '>' + text + '</a>';
  return '<footer class="rg-fuss rg-fuss-gruppen"><div>' + GRUPPEN.map(([titel, links], i) =>
    '<nav aria-label="' + titel + '"><p class="rg-fuss-titel">' + titel + '</p>' + links.map(link).join('') +
    (i === GRUPPEN.length - 1 ? '<a class="rg-widerruf" href="/widerruf/">Vertrag widerrufen</a>' : '') + '</nav>').join('') + '</div></footer>';
}

export const FUSS = /<footer class="rg-fuss[^"]*">[\s\S]*?<\/footer>/;

/* Alle Seiten unter web/ratgeber/ und web/fuer-fensterbauer/ */
export function seiten(web) {
  const raus = [];
  const such = (d, rel) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) such(path.join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') raus.push([rel, path.join(d, e.name)]); } };
  for (const o of ['ratgeber', 'fuer-fensterbauer']) such(path.join(web, o), '/' + o + '/');
  return raus;
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  const web = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web');
  let n = 0;
  for (const [pfad, datei] of seiten(web)) {
    const alt = fs.readFileSync(datei, 'utf8');
    if (!FUSS.test(alt)) { console.error('Keine Fußzeile: ' + datei); process.exitCode = 1; continue; }
    const neu = alt.replace(FUSS, () => fusszeile(pfad));
    if (neu !== alt) { fs.writeFileSync(datei, neu); n++; }
  }
  console.log('Fußzeile in ' + n + ' Dateien neu geschrieben');
}

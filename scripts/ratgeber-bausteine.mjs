/* eeziframes · Wiederkehrende Bausteine aller Ratgeberseiten und Seiten für Fensterbauer an einer Stelle pflegen:
   - „Auf dieser Seite“: Abschnitte aus den h2 der Seite, mit Lesezeit, direkt nach dem ersten Knopfblock (.rg-cta)
   - „Dein Weg zu neuen Fenstern“: sechs Schritte von „Prüfen“ bis „Einbauen“, der eigene hervorgehoben, dazu „Nächster
     Schritt“ (nur Ratgeber für Hauseigentümer, vor „Weiterlesen“); hält Leser auf der Seite und verlinkt die Seiten sinnvoll
   - die Übersicht /ratgeber/ als dieser Weg (Karten je Schritt) und ihre strukturierten Daten (hasPart)
   - die Fußzeile in drei Gruppen (Ratgeber, Für Fensterbauer, Mehr; die eigene Seite mit aria-current)
   - ids an allen h2, damit „Auf dieser Seite“ und Google („Springe zu“) auf Abschnitte zeigen können
   Neue Seite: Eintrag in SEITEN_INFO und im passenden Schritt von WEG (Hauseigentümer) bzw. in FENSTERBAUER, dann
     node scripts/ratgeber-bausteine.mjs
   Das Skript ist idempotent; scripts/pruefen.mjs (Abschnitt 10) prüft, dass jede Seite genau so aussieht, wie es sie bauen würde. */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

/* Kurzname (Fußzeile, Weg) und Kartentext (Übersicht, „Nächster Schritt“) je Seite */
export const SEITEN_INFO = {
  '/ratgeber/fenster-beschlagen/': ['Fenster beschlagen', 'Innen, außen oder zwischen den Scheiben: was es bedeutet und was hilft.'],
  '/ratgeber/fenster-undicht/': ['Fenster undicht', 'Zugluft finden, Dichtung und Beschlag prüfen, und wann nur noch ein Tausch hilft.'],
  '/ratgeber/fenster-alter-erkennen/': ['Alter der Fenster', 'Baujahr ablesen, Lebensdauer je Material und was das Alter für dich heißt.'],
  '/ratgeber/fenster-reparieren-oder-austauschen/': ['Reparieren oder tauschen', 'Dichtung, Beschlag, Glas oder neu: die Entscheidung mit Tabelle.'],
  '/ratgeber/fenster-austauschen/': ['Fenster austauschen', 'Sechs Schritte vom Aufmaß bis zum Einbau, Kosten pro Fenster, Förderung 2026.'],
  '/ratgeber/fenstertausch-altbau/': ['Fenstertausch im Altbau', 'Laibung, Abdichtung und wie du Schimmel nach dem Tausch vermeidest.'],
  '/ratgeber/fenster-material-vergleich/': ['Material im Vergleich', 'Kunststoff, Holz, Holz-Alu oder Alu: Preis, Pflege, Lebensdauer.'],
  '/ratgeber/dreifachverglasung/': ['Dreifachverglasung', '2-fach oder 3-fach: Dämmung, Förderung, Gewicht und wann sich was lohnt.'],
  '/ratgeber/fenster-oeffnungsarten/': ['Öffnungsarten', 'Dreh-Kipp, Stulp oder fest: was wofür passt.'],
  '/ratgeber/uw-wert-fenster/': ['Uw-Wert und Förderung', 'Was der Wert bedeutet und welchen die Förderung 2026 verlangt.'],
  '/ratgeber/din-links-rechts/': ['DIN links oder rechts', 'Von innen gesehen: Bänder links heißt DIN links. Mit Merkregel und Zeichnung.'],
  '/ratgeber/fenster-standardmasse/': ['Standardmaße', 'Übliche Größen als Tabelle, und warum es im Altbau selten passt.'],
  '/ratgeber/fenster-ausmessen/': ['Fenster ausmessen', 'Maueröffnung an drei Stellen messen, das kleinste Maß zählt. Mit Messpunkten und typischen Fehlern.'],
  '/ratgeber/balkontuer-ausmessen/': ['Balkontür ausmessen', 'Höhe ab dem fertigen Fußboden, Schwelle und Abdichtung, Hebe-Schiebe- oder PSK-Tür.'],
  '/ratgeber/fenster-mit-rollladen-ausmessen/': ['Fenster mit Rollladen', 'Aufsatz, Einbau oder Vorbau: erst den Kasten erkennen, dann messen.'],
  '/ratgeber/kellerfenster-ausmessen/': ['Kellerfenster ausmessen', 'Maueröffnung oder Zarge, Lichtschacht und Einbruchschutz.'],
  '/ratgeber/fensterbank-ausmessen/': ['Fensterbank ausmessen', 'Innen und außen: Länge, Tiefe, Überstand und Gefälle.'],
  '/ratgeber/bruestungshoehe-fenster/': ['Brüstungshöhe', '80 cm, über 12 m Absturzhöhe 90 cm, und wann es eine Absturzsicherung braucht.'],
  '/ratgeber/aufmassblatt-fenster/': ['Aufmaßblatt', 'Was ein Aufmaß umfasst, Punkt für Punkt, und wie das Aufmaßblatt in der App entsteht.'],
  '/ratgeber/bestellmass-fenster/': ['Bestellmaß', 'Wie viel kleiner als die Öffnung? Fuge je Seite nach Größe und Farbe, mit Beispiel.'],
  '/ratgeber/fenster-angebot-vergleichen/': ['Angebote vergleichen', 'Checkliste und Beispiel: woran du ein gutes Angebot erkennst.'],
  '/ratgeber/ral-montage-fenster/': ['RAL-Montage', 'Innen luftdicht, in der Mitte gedämmt, außen schlagregendicht, einfach erklärt.'],
  '/ratgeber/lueftungskonzept-fenstertausch/': ['Lüftungskonzept', 'Wann es nach DIN 1946-6 nötig ist und was dabei herauskommt.'],
  '/fuer-fensterbauer/': ['Aufmaß-App für Fensterbauer', 'Kunden messen per Link selbst, Sie bekommen Maße, Fotos und Einbausituation fürs erste Angebot.'],
  '/fuer-fensterbauer/erstaufmass-feinaufmass/': ['Erstaufmaß und Feinaufmaß', 'Wofür welches Aufmaß da ist, wer misst und wie genau.'],
  '/fuer-fensterbauer/falsches-aufmass-haftung/': ['Falsches Aufmaß: Haftung', 'Wer haftet, wenn Fenster nicht passen, und wie Sie vorbeugen.'],
  '/fuer-fensterbauer/aufmass-kostenpflichtig/': ['Aufmaß kostenpflichtig?', 'Kostenloses Aufmaß, Anfahrtspauschale und was vorher vereinbart sein muss.'],
  '/fuer-fensterbauer/geplatzter-aufmasstermin/': ['Geplatzter Aufmaßtermin', 'Was eine Fahrt ohne Kunden kostet, mit Beispielrechnung.'],
  '/fuer-fensterbauer/fensterbau-software/': ['Fensterbau-Software', 'Aufmaß-Apps, Handwerkersoftware und ERP im fairen Überblick.']
};

/* Der Weg zu neuen Fenstern; die erste Seite eines Schritts ist sein Ziel in der Wegleiste und im „Nächster Schritt“ */
export const WEG = [
  { name: 'Prüfen', text: 'Beschlagen, undicht, wie alt?', seiten: ['/ratgeber/fenster-alter-erkennen/', '/ratgeber/fenster-beschlagen/', '/ratgeber/fenster-undicht/'] },
  { name: 'Entscheiden', text: 'Reparieren oder neu, Kosten, Förderung', seiten: ['/ratgeber/fenster-reparieren-oder-austauschen/', '/ratgeber/fenster-austauschen/', '/ratgeber/fenstertausch-altbau/'] },
  { name: 'Auswählen', text: 'Material, Glas, Öffnungsart', seiten: ['/ratgeber/fenster-material-vergleich/', '/ratgeber/dreifachverglasung/', '/ratgeber/fenster-oeffnungsarten/', '/ratgeber/uw-wert-fenster/', '/ratgeber/din-links-rechts/', '/ratgeber/fenster-standardmasse/'] },
  { name: 'Ausmessen', text: 'Selbst messen, fürs Angebot', seiten: ['/ratgeber/fenster-ausmessen/', '/ratgeber/balkontuer-ausmessen/', '/ratgeber/fenster-mit-rollladen-ausmessen/', '/ratgeber/kellerfenster-ausmessen/', '/ratgeber/fensterbank-ausmessen/', '/ratgeber/bruestungshoehe-fenster/', '/ratgeber/aufmassblatt-fenster/', '/ratgeber/bestellmass-fenster/'] },
  { name: 'Vergleichen', text: 'Angebote richtig lesen', seiten: ['/ratgeber/fenster-angebot-vergleichen/'] },
  { name: 'Einbauen', text: 'RAL-Montage, Lüftung', seiten: ['/ratgeber/ral-montage-fenster/', '/ratgeber/lueftungskonzept-fenstertausch/'] }
];
export const FENSTERBAUER = ['/fuer-fensterbauer/', '/fuer-fensterbauer/erstaufmass-feinaufmass/', '/fuer-fensterbauer/falsches-aufmass-haftung/', '/fuer-fensterbauer/aufmass-kostenpflichtig/', '/fuer-fensterbauer/geplatzter-aufmasstermin/', '/fuer-fensterbauer/fensterbau-software/'];

const name = (p) => SEITEN_INFO[p][0], karte = (p) => SEITEN_INFO[p][1];
export const schrittVon = (pfad) => WEG.findIndex((s) => s.seiten.includes(pfad));

/* Fußzeile: Ratgeber in der Reihenfolge des Wegs */
export const GRUPPEN = [
  ['Ratgeber', [['/ratgeber/', 'Alle Ratgeber']].concat(WEG.flatMap((s) => s.seiten.map((p) => [p, name(p)])))],
  ['Für Fensterbauer', FENSTERBAUER.map((p) => [p, name(p)]).concat([['/#tour', 'Tour für Fensterbauer']])],
  ['Mehr', [['/', 'Startseite'], ['/app/', 'App'], ['/agb/', 'AGB'], ['/nutzungsbedingungen/', 'Nutzungsbedingungen'], ['/datenschutz/', 'Datenschutz'], ['/cookies/', 'Cookies'], ['/impressum/', 'Impressum']]]
];
export function fusszeile(eigen) {
  const link = ([href, text]) => '<a href="' + href + '"' + (href === eigen ? ' aria-current="page"' : '') + '>' + text + '</a>';
  return '<footer class="rg-fuss rg-fuss-gruppen"><div>' + GRUPPEN.map(([titel, links], i) =>
    '<nav aria-label="' + titel + '"><p class="rg-fuss-titel">' + titel + '</p>' + links.map(link).join('') +
    (i === GRUPPEN.length - 1 ? '<a class="rg-widerruf" href="/widerruf/">Vertrag widerrufen</a>' : '') + '</nav>').join('') + '</div></footer>';
}
export const FUSS = /<footer class="rg-fuss[^"]*">[\s\S]*?<\/footer>/;

/* ids aus dem Text der Überschrift: klein, Umlaute ausgeschrieben, nur Buchstaben, Ziffern und Bindestriche */
const slug = (t) => t.replace(/<[^>]+>/g, '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-') || 'abschnitt';
const OHNE_INHALT = ['Weiterlesen', 'Quellen', 'Dein Weg zu neuen Fenstern'];
const INHALT = /\n?\s*<nav class="rg-inhalt"[\s\S]*?<\/nav>/;
const WEGBLOCK = /\n?\s*<section class="rg-weg"[\s\S]*?<\/section>/;

/* Lesezeit: Wörter im Hauptteil ohne Quellen, 200 Wörter je Minute, mindestens 2 Minuten */
function lesezeit(main) {
  const text = main.replace(/<h2[^>]*>Quellen<\/h2>[\s\S]*$/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  return Math.max(2, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

function wegBlock(pfad) {
  const i = schrittVon(pfad);
  const liste = WEG.map((s, j) => '<li' + (j === i ? ' aria-current="step"' : '') + '><a href="' + s.seiten[0] + '"><span class="n">Schritt ' + (j + 1) + '</span><b>' + s.name + '</b><span class="t">' + (j === i ? 'Du bist hier' : s.text) + '</span></a></li>').join('');
  const naechster = WEG[i + 1];
  const weiter = naechster
    ? '<a class="rg-karte rg-weiter" href="' + naechster.seiten[0] + '"><span class="eyebrow">Nächster Schritt · ' + (i + 2) + ' von ' + WEG.length + ': ' + naechster.name + '</span><b>' + name(naechster.seiten[0]) + '</b><span>' + karte(naechster.seiten[0]) + '</span></a>'
    : '<a class="rg-karte rg-weiter" href="/app/"><span class="eyebrow">Alles geplant?</span><b>Fenster ausmessen, kostenlos</b><span>Etwa fünf Minuten je Fenster; das Aufmaßblatt kann jeder Fensterbauer lesen.</span></a>';
  return '\n  <section class="rg-weg" aria-labelledby="weg"><h2 id="weg">Dein Weg zu neuen Fenstern</h2><ol class="rg-weg-liste">' + liste + '</ol>' + weiter + '</section>';
}

/* Eine Seite (nicht die Übersicht): Bausteine entfernen, ids setzen, neu einsetzen, Fußzeile */
export function baue(pfad, html) {
  let h = html.replace(INHALT, '').replace(WEGBLOCK, '');
  const m = h.match(/<main class="rg">[\s\S]*<\/main>/);
  if (!m) return h.replace(FUSS, () => fusszeile(pfad));
  let main = m[0];
  const vergeben = new Set([...main.matchAll(/ id="([^"]+)"/g)].map((x) => x[1]));
  main = main.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (alles, attr, inhalt) => {
    if (attr && /\sid="/.test(attr)) return alles;
    let id = slug(inhalt), n = 2; while (vergeben.has(id)) id = slug(inhalt) + '-' + n++;
    vergeben.add(id);
    return '<h2' + (attr || '') + ' id="' + id + '">' + inhalt + '</h2>';
  });
  const abschnitte = [...main.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].filter((x) => !OHNE_INHALT.includes(x[2].trim()));
  const imWeg = schrittVon(pfad) >= 0;
  const eintraege = abschnitte.map((x) => '<li><a href="#' + x[1] + '">' + x[2].trim() + '</a></li>')
    .concat(imWeg ? ['<li><a href="#weg">Dein Weg: Schritt ' + (schrittVon(pfad) + 1) + ' von ' + WEG.length + '</a></li>'] : []);
  const inhalt = '\n  <nav class="rg-inhalt" aria-label="Auf dieser Seite"><p class="eyebrow">Auf dieser Seite · ' + lesezeit(main) + ' Min. Lesezeit</p><ol>' + eintraege.join('') + '</ol></nav>';
  main = main.replace(/(<div class="rg-cta">[\s\S]*?<\/div>)/, (x) => x + inhalt);
  if (imWeg) main = main.replace(/(\n\s*)<h2([^>]*)>Weiterlesen<\/h2>/, (x) => wegBlock(pfad) + x);
  return h.replace(m[0], () => main).replace(FUSS, () => fusszeile(pfad));
}

/* Übersicht /ratgeber/: Karten je Schritt zwischen den Markierungen, strukturierte Daten aus den h1 der Seiten */
export function uebersicht(html, h1Von) {
  const karten = (liste) => '<div class="rg-karten">' + liste.map((p) => '<a class="rg-karte" href="' + p + '"><b>' + name(p) + '</b><span>' + karte(p) + '</span></a>').join('') + '</div>';
  const teile = WEG.map((s, j) => '\n  <h2 id="schritt-' + (j + 1) + '">' + (j + 1) + '. ' + s.name + '</h2>\n  <p class="rg-klein">' + s.text + '</p>\n  ' + karten(s.seiten));
  const weg = '<!-- weg -->\n  <ol class="rg-weg-liste">' + WEG.map((s, j) => '<li><a href="#schritt-' + (j + 1) + '"><span class="n">Schritt ' + (j + 1) + '</span><b>' + s.name + '</b><span class="t">' + s.text + '</span></a></li>').join('') + '</ol>' + teile.join('') +
    '\n  <h2 id="fuer-fensterbauer">Für Fensterbauer</h2>\n  ' + karten(FENSTERBAUER) + '\n  <!-- /weg -->';
  const hasPart = '"hasPart":[\n' + WEG.flatMap((s) => s.seiten).concat(FENSTERBAUER.slice(1)).map((p) => '{"@type":"Article","headline":' + JSON.stringify(h1Von(p)) + ',"url":"' + p + '"}').join(',\n') + ']}';
  return html.replace(/<!-- weg -->[\s\S]*?<!-- \/weg -->/, () => weg).replace(/"hasPart":\[[\s\S]*?\]\}(?=,\n\{"@type":"BreadcrumbList")/, () => hasPart);
}

/* Alle Seiten unter web/ratgeber/ und web/fuer-fensterbauer/ */
export function seiten(web) {
  const raus = [];
  const such = (d, rel) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) such(path.join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') raus.push([rel, path.join(d, e.name)]); } };
  for (const o of ['ratgeber', 'fuer-fensterbauer']) such(path.join(web, o), '/' + o + '/');
  return raus;
}
/* Was die Seite nach dem Bauen enthalten muss (für die Prüfsuite und den Lauf unten) */
export function gebaut(web) {
  const alle = seiten(web), h1 = {};
  for (const [p, d] of alle) h1[p] = ((fs.readFileSync(d, 'utf8').match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '');
  return alle.map(([p, d]) => { const alt = fs.readFileSync(d, 'utf8'); return [p, d, alt, p === '/ratgeber/' ? uebersicht(alt, (x) => h1[x]).replace(FUSS, () => fusszeile(p)) : baue(p, alt)]; });
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  const web = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web');
  const fehlt = WEG.flatMap((s) => s.seiten).concat(FENSTERBAUER).filter((p) => !fs.existsSync(path.join(web, p, 'index.html')));
  if (fehlt.length) console.error('Seite fehlt (noch): ' + fehlt.join(', '));
  let n = 0;
  for (const [, d, alt, neu] of gebaut(web)) if (neu !== alt) { fs.writeFileSync(d, neu); n++; }
  console.log('Bausteine in ' + n + ' Dateien neu geschrieben');
}

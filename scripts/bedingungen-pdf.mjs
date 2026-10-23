// eeziframes · Bausteine der Seiten zu den Konfigurator-Paketen und die PDFs der Paketbedingungen (Strang F, Bauplan §3 F.2)
//
//   node scripts/bedingungen-pdf.mjs            Bausteine in die Seiten schreiben, PDFs der Fassung PAKET_STAND neu erzeugen
//   node scripts/bedingungen-pdf.mjs --pruefen  nur prüfen (Exit 1, wenn eine Seite oder ein PDF nicht zum Stand passt)
//   node scripts/bedingungen-pdf.mjs --neu      PDFs auch dann neu schreiben, wenn sie zum Text passen
//
// 1. Bausteine: Zwischen <!--pakete:NAME--> und <!--/pakete:NAME--> steht in den Seiten, was functions/pakete-seite.js aus
//    web/assets/pakete.js und web/assets/instanzregeln.js baut (Paketkarten, Vergleich, Ablauf, Leistungen, Fristen, Stand …). Die
//    Dateien tragen die Fassung ohne Variablen (lesbar ohne Worker, Rückfall); beim Ausliefern setzt der Worker die Fassung für seine
//    Umgebung ein (PAKETE_OFFEN). Nach jeder Änderung an Paketen, Fristen oder Bausteinen dieses Skript laufen lassen.
// 2. PDFs: aus /konfigurator-bedingungen/ (nach Schritt 1) zwei Dateien in web/konfigurator-bedingungen/:
//      paketbedingungen-<PAKET_STAND>.pdf   § 1 bis § 15
//      av-vertrag-<PAKET_STAND>.pdf         Anlage: Vertrag zur Auftragsverarbeitung
//    Sie gehen mit der Eingangsbestätigung an den Besteller (functions/api/bestellung.js) und müssen da sein, bevor die Paket-Kasse im
//    Live-Modus öffnet (paketVerkaufStand in functions/api/recht.js). jsPDF aus web/vendor/, Schrift Inter wie im Aufmaßblatt.
//    Jedes PDF trägt in den Metadaten (Keywords) die Prüfsumme seines Textes: scripts/pruefen-instanzen/29.mjs vergleicht sie mit der
//    Seite, so fällt ein vergessener Lauf auf. Solange die Seite Platzhalter (<mark class="ph">) enthält, steht auf jeder PDF-Seite
//    „Entwurf zur anwaltlichen Prüfung“.
//    Ändert sich der Text der Paketbedingungen, bekommt er einen neuen Stand (PAKET_STAND in functions/api/recht.js); die PDFs der
//    alten Fassung bleiben liegen (frühere Bestellungen verweisen auf sie).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { bauen } = await import(pathToFileURL(path.join(WURZEL, 'functions/pakete-seite.js')).href);
const { PAKET_STAND, paketPdfs, standText } = await import(pathToFileURL(path.join(WURZEL, 'functions/api/recht.js')).href);

/* Seiten mit Bausteinen (Pfad in web/) */
export const SEITEN = ['fuer-fensterbauer/index.html', 'konfigurator-bedingungen/index.html', 'datenschutz/index.html'];
const BEDINGUNGEN = 'konfigurator-bedingungen/index.html';
const datei = (rel) => path.join(WURZEL, 'web', rel);

/* ---------- Text aus der Seite ---------- */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
const entities = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENT[e.toLowerCase()] !== undefined ? ENT[e.toLowerCase()] : m));
/* Inline-HTML → Text: <br> als Zeilenumbruch, Platzhalter bleiben in eckigen Klammern sichtbar */
const text = (html) => entities(String(html).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')).replace(/[ \t\r\f\v]+/g, ' ').replace(/ ?\n ?/g, '\n').trim();

/* Blöcke in Reihenfolge: { art: 'h1'|'h2'|'h3'|'p'|'klein'|'li'|'tabelle', text | zeilen } */
export function bloecke(html) {
  const main = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) || [])[1] || '';
  const ohne = main.replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  const re = /<table[^>]*>([\s\S]*?)<\/table>|<ul[^>]*>([\s\S]*?)<\/ul>|<ol[^>]*>([\s\S]*?)<\/ol>|<h([123])([^>]*)>([\s\S]*?)<\/h\4>|<p([^>]*)>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(ohne))) {
    if (m[1] !== undefined) {
      const zeilen = [...m[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((z) => [...z[1].matchAll(/<t([hd])[^>]*>([\s\S]*?)<\/t\1>/g)].map((c) => text(c[2])));
      out.push({ art: 'tabelle', zeilen: zeilen, kopf: /<thead/.test(m[1]) });
    } else if (m[2] !== undefined || m[3] !== undefined) {
      [...(m[2] || m[3]).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].forEach((li, i) => out.push({ art: 'li', text: text(li[1]), nr: m[3] !== undefined ? i + 1 : 0 }));
    } else if (m[4]) {
      out.push({ art: 'h' + m[4], id: (/id="([^"]+)"/.exec(m[5]) || [])[1] || '', text: text(m[6]) });
    } else {
      out.push({ art: /class="klein"/.test(m[7]) ? 'klein' : 'p', text: text(m[8]) });
    }
  }
  return out;
}

/* Die Seite in die beiden Verträge teilen: Paketbedingungen bis vor „Anlage“, AV-Vertrag ab dort; Zeilen mit Stand und PDF-Links
   (p.klein) bleiben weg, der Stand steht im Kopf jedes PDFs */
export function vertraege(html) {
  const b = bloecke(html).filter((x) => x.art !== 'klein');
  const i = b.findIndex((x) => x.art === 'h2' && x.id === 'avv');
  if (i < 0) throw new Error('Anlage AV-Vertrag (h2#avv) nicht gefunden');
  const entwurf = /<mark class="ph">/.test(html);
  return [
    { name: 'Paketbedingungen', datei: paketPdfs()[0], bloecke: b.slice(0, i), entwurf: entwurf },
    { name: 'Vertrag zur Auftragsverarbeitung', datei: paketPdfs()[1], bloecke: b.slice(i), entwurf: entwurf }
  ];
}
/* Prüfsumme des Textes und der Satzart (steht in den Keywords des PDFs); SATZ erhöhen, wenn sich pdfBauen() ändert */
const SATZ = 2;
export const pruefsumme = (v) => crypto.createHash('sha256').update(JSON.stringify([SATZ, PAKET_STAND, v.name, v.entwurf, v.bloecke])).digest('hex');

/* ---------- PDF ---------- */
let jsPDF = null;
async function laden() {
  if (jsPDF) return jsPDF;
  const J = await import(pathToFileURL(path.join(WURZEL, 'web/vendor/jspdf.umd.min.js')).href);
  jsPDF = (J && J.jsPDF) || (J && J.default && J.default.jsPDF) || (globalThis.jspdf && globalThis.jspdf.jsPDF);
  await import(pathToFileURL(path.join(WURZEL, 'web/assets/blatt-schrift.js')).href);
  if (!jsPDF || !globalThis.BlattSchrift) throw new Error('jsPDF oder Schrift nicht geladen');
  return jsPDF;
}
/* Zeichen außerhalb der eingebetteten Teilmenge (Latin-1 und Satzzeichen) ersetzen */
const t = (s) => String(s == null ? '' : s).replace(/[ -​ ]/g, ' ').replace(/[‐-‒]/g, '-').replace(/­/g, '').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/→/g, '->');

export async function pdfBauen(v) {
  const J = await laden(), S = globalThis.BlattSchrift;
  const doc = new J({ unit: 'mm', format: 'a4', compress: true });
  doc.addFileToVFS('Inter-Medium.ttf', S.medium); doc.addFont('Inter-Medium.ttf', 'InterMedium', 'normal');
  doc.addFileToVFS('Inter-Bold.ttf', S.bold); doc.addFont('Inter-Bold.ttf', 'InterBold', 'normal');
  doc.addFileToVFS('Inter-ExtraBold.ttf', S.extra); doc.addFont('Inter-ExtraBold.ttf', 'InterExtraBold', 'normal');
  const TINTE = [22, 22, 22], GRAU = [104, 104, 109], LINIE = [220, 219, 214], WARN = [161, 98, 7];
  const M = 20, B = 210 - 2 * M, OBEN = 26, UNTEN = 297 - 22;
  let y = OBEN;
  const schrift = (art, groesse, farbe) => { doc.setFont(art === 'fett' ? 'InterExtraBold' : art === 'halb' ? 'InterBold' : 'InterMedium', 'normal'); doc.setFontSize(groesse); doc.setTextColor.apply(doc, farbe || TINTE); };
  const platz = (h) => { if (y + h > UNTEN) { doc.addPage(); y = OBEN; return true; } return false; };
  const zeilen = (s, breite) => doc.splitTextToSize(t(s), breite);

  const summe = pruefsumme(v);
  doc.setDocumentProperties({ title: v.name + ' (Fassung vom ' + standText(PAKET_STAND) + ')', subject: 'Konfigurator-Pakete, Fassung ' + PAKET_STAND + (v.entwurf ? ', Entwurf zur anwaltlichen Prüfung' : ''), author: 'Patrick Kies, eeziframes', keywords: 'quelle-sha256:' + summe, creator: 'scripts/bedingungen-pdf.mjs' });
  try { doc.setLanguage('de-DE'); doc.setCreationDate(new Date(PAKET_STAND + 'T00:00:00Z')); doc.setFileId(summe.slice(0, 32).toUpperCase()); } catch (e) { /* ältere jsPDF */ }

  /* Titel */
  const titel = v.bloecke[0] && /^h[12]$/.test(v.bloecke[0].art) ? v.bloecke[0].text.replace(/^Anlage:\s*/, '') : v.name;
  schrift('fett', 20); zeilen(titel, B).forEach((z) => { platz(10); doc.text(z, M, y); y += 8.5; });
  schrift('normal', 10, GRAU); y += 1;
  zeilen('eeziframes · Konfigurator-Pakete EEZI Essential, EEZI Essential Plus und EEZI Signature · Fassung vom ' + standText(PAKET_STAND), B).forEach((z) => { doc.text(z, M, y); y += 4.8; });
  y += 4;

  const absatz = (s, o) => {
    o = o || {};
    const einzug = o.einzug || 0, breite = B - einzug;
    s.split('\n').forEach((teil, i) => {
      const zz = zeilen(teil, breite);
      zz.forEach((z, j) => { platz(5.4); if (o.marke && i === 0 && j === 0) doc.text(o.marke, M + einzug - 5, y); doc.text(z, M + einzug, y); y += 4.9; });
    });
    y += o.nach === undefined ? 2.2 : o.nach;
  };
  const tabelle = (tb) => {
    const n = Math.max.apply(null, tb.zeilen.map((z) => z.length));
    const erste = n >= 4 ? 0.34 : n === 3 ? 0.3 : 0.4, breiten = [B * erste].concat(Array(n - 1).fill((B * (1 - erste)) / (n - 1)));
    const PAD = 1.6, ZH = 4.2;
    const zeile = (z, kopf) => {
      schrift(kopf ? 'halb' : 'normal', 8.6, kopf ? TINTE : TINTE);
      const teile = z.map((c, i) => zeilen(c, breiten[i] - 2 * PAD));
      const h = Math.max.apply(null, teile.map((x) => x.length)) * ZH + 2 * PAD;
      if (platz(h + 1) && tb.kopf && !kopf) { zeile(tb.zeilen[0], true); schrift('normal', 8.6); }
      let x = M;
      teile.forEach((tz, i) => { tz.forEach((zl, j) => doc.text(zl, x + PAD, y + PAD + 3 + j * ZH)); x += breiten[i]; });
      y += h;
      doc.setDrawColor.apply(doc, LINIE); doc.setLineWidth(kopf ? 0.4 : 0.2); doc.line(M, y, M + B, y);
    };
    y += 1;
    tb.zeilen.forEach((z, i) => zeile(z, tb.kopf && i === 0));
    y += 4;
  };

  v.bloecke.slice(/^h[12]$/.test((v.bloecke[0] || {}).art) ? 1 : 0).forEach((b) => {
    if (b.art === 'h1' || b.art === 'h2') { y += 3; platz(16); schrift('fett', 13); zeilen(b.text, B).forEach((z) => { platz(7); doc.text(z, M, y); y += 6; }); y += 1.2; return; }
    if (b.art === 'h3') { y += 2; platz(14); schrift('halb', 11); zeilen(b.text, B).forEach((z) => { platz(6); doc.text(z, M, y); y += 5.2; }); y += 1; return; }
    if (b.art === 'tabelle') { tabelle(b); return; }
    schrift('normal', 9.8);
    if (b.art === 'li') { absatz(b.text, { einzug: 5, marke: b.nr ? b.nr + '.' : '•', nach: 1.4 }); return; }
    absatz(b.text);
  });

  /* Kopf und Fuß auf jeder Seite */
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    schrift('halb', 7.5, v.entwurf ? WARN : GRAU);
    doc.text(t(v.entwurf ? 'ENTWURF ZUR ANWALTLICHEN PRÜFUNG · Fassung vom ' + standText(PAKET_STAND) : 'Fassung vom ' + standText(PAKET_STAND)), M, 13);
    schrift('normal', 7.5, GRAU);
    doc.text(t('eeziframes · ' + v.name), M, 297 - 11);
    doc.text('Seite ' + i + ' von ' + n, 210 - M, 297 - 11, { align: 'right' });
  }
  return new Uint8Array(doc.output('arraybuffer'));
}

/* Keywords eines vorhandenen PDFs: Prüfsumme oder '' */
export function summeIn(bytes) {
  const s = Buffer.from(bytes).toString('latin1');
  return (/\/Keywords \(quelle-sha256:([0-9a-f]{64})\)/.exec(s) || [])[1] || '';
}

/* ---------- Ablauf ---------- */
/* Stand prüfen: { ok, fehler: [] } (Seiten gebaut, PDFs da und passend) */
export function pruefen() {
  const fehler = [];
  for (const rel of SEITEN) {
    const html = fs.readFileSync(datei(rel), 'utf8');
    if (html.indexOf('<!--pakete:') < 0) continue;
    if (bauen(html) !== html) fehler.push('web/' + rel + ': Bausteine nicht aktuell');
  }
  for (const v of vertraege(fs.readFileSync(datei(BEDINGUNGEN), 'utf8'))) {
    const f = datei(v.datei.replace(/^\//, ''));
    if (!fs.existsSync(f)) { fehler.push(v.datei + ' fehlt'); continue; }
    if (summeIn(fs.readFileSync(f)) !== pruefsumme(v)) fehler.push(v.datei + ' passt nicht zum Text der Seite');
  }
  return { ok: !fehler.length, fehler: fehler };
}

async function main() {
  if (process.argv.includes('--pruefen')) {
    const r = pruefen();
    r.fehler.forEach((f) => console.log('✗ ' + f));
    if (r.ok) console.log('✓ Bausteine und PDFs der Fassung ' + PAKET_STAND + ' sind aktuell');
    process.exit(r.ok ? 0 : 1);
  }
  for (const rel of SEITEN) {
    const html = fs.readFileSync(datei(rel), 'utf8');
    if (html.indexOf('<!--pakete:') < 0) continue;
    const neu = bauen(html);
    if (neu !== html) { fs.writeFileSync(datei(rel), neu); console.log('Bausteine geschrieben: web/' + rel); }
  }
  for (const v of vertraege(fs.readFileSync(datei(BEDINGUNGEN), 'utf8'))) {
    const f = datei(v.datei.replace(/^\//, ''));
    if (!process.argv.includes('--neu') && fs.existsSync(f) && summeIn(fs.readFileSync(f)) === pruefsumme(v)) { console.log('aktuell: web' + v.datei); continue; }
    const bytes = await pdfBauen(v);
    fs.writeFileSync(f, bytes);
    console.log('PDF geschrieben: web' + v.datei + ' (' + Math.round(bytes.length / 1024) + ' KB' + (v.entwurf ? ', Entwurf' : '') + ')');
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();

/* eeziframes · Aufmaßblatt als PDF im Worker (Strang A, Bauplan §3 A.8; Vertrag docs/INSTANZEN.md)
   Derselbe Zeichner wie im Betriebsbereich (web/assets/blatt.js), hier ohne DOM: jsPDF, die Schrift und blatt.js werden erst beim ersten
   Blatt geladen (import(), K2.6), damit sie den Start des Workers nicht verlangsamen. Das Blatt entsteht aus den Daten, die der Server
   gespeichert hat; Fotos nur in der kleinen Fassung <id>k (640 px, lädt die App mit hoch), fehlt sie, das Original, alles zusammen
   höchstens GRENZEN.pdfBudget (5 MB). Was darüber hinausgeht, nennt das Blatt als „weitere Fotos: x“.
   Rechenzeit: Ein Blatt braucht je nach Umfang 0,2 bis 1,5 s CPU. Das geht nur mit Workers Paid; im Gratis-Tarif bricht Cloudflare den
   Aufruf ab. eingang.js fängt das ab (Mail mit Text und Link, das Blatt wird nachgeholt; Variable PDF_IM_WORKER=0 schaltet den Versuch ab).
   API:
     blattFuerEingang(k, inst, z, o) → Uint8Array   Variante 'betrieb' für die Mail an den Betrieb; o: { ohneFotos }
     blattBauen(k, inst, z, o) → { bytes, fotos, weitere }   dasselbe mit Angaben zu den Fotos (eingang.js)
     blattAnfrage(k, inst, z) → Uint8Array          Variante 'anfrage' (Kopie für den Endkunden in der Marke der Instanz)
     textPdf(titel, abschnitte) → Uint8Array         schlichtes PDF aus Text (z. B. Paketbedingungen im Anhang, Strang D);
                                                     abschnitte: ['Absatz', …] oder [{ titel, text }]
     jpegMasse(bytes), pngMasse(bytes) → { w, h } | null
   inst: { id, name, host/haupthost, m (Merkmale), marke, du }, z: Zeile aus anfragen (daten = Link-Objekt mit aufmass) */
import '../../web/assets/ral.js';
import '../../web/assets/modell.js';
import '../../web/assets/instanzregeln.js';
import { ablage, linkOrdner } from './fotos.js';

const AW = () => globalThis.AW;
const R = () => globalThis.Instanzregeln;

let laden = null;
/* jsPDF (UMD) kommt je nach Umgebung als Modul (Bündel von wrangler, Node) oder auf globalThis an; blatt.js erwartet globalThis.jspdf */
export function blattLaden() {
  if (!laden) {
    laden = (async () => {
      const J = await import('../../web/vendor/jspdf.umd.min.js');
      const jsPDF = (J && J.jsPDF) || (J && J.default && J.default.jsPDF) || (globalThis.jspdf && globalThis.jspdf.jsPDF);
      if (!jsPDF) throw new Error('jsPDF nicht geladen');
      if (!globalThis.jspdf || !globalThis.jspdf.jsPDF) globalThis.jspdf = { jsPDF: jsPDF };
      await import('../../web/assets/blatt-schrift.js');
      await import('../../web/assets/blatt.js');
      if (!globalThis.Blatt || !globalThis.BlattSchrift) throw new Error('Zeichner nicht geladen');
      return globalThis.Blatt;
    })().catch((e) => { laden = null; throw e; });
  }
  return laden;
}

/* ---------- Bilder ---------- */
export function jpegMasse(u) {
  if (!u || u.length < 4 || u[0] !== 0xff || u[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < u.length) {
    if (u[i] !== 0xff) { i++; continue; }
    const m = u[i + 1], len = (u[i + 2] << 8) | u[i + 3];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: (u[i + 5] << 8) | u[i + 6], w: (u[i + 7] << 8) | u[i + 8] };
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
    i += 2 + len;
  }
  return null;
}
export function pngMasse(u) {
  if (!u || u.length < 24 || u[0] !== 0x89 || u[1] !== 0x50 || u[2] !== 0x4e || u[3] !== 0x47) return null;
  const n = (o) => ((u[o] << 24) | (u[o + 1] << 16) | (u[o + 2] << 8) | u[o + 3]) >>> 0;
  return { w: n(16), h: n(20) };
}
function webpMasse(u) {
  if (!u || u.length < 30 || String.fromCharCode(u[0], u[1], u[2], u[3]) !== 'RIFF' || String.fromCharCode(u[8], u[9], u[10], u[11]) !== 'WEBP') return null;
  const art = String.fromCharCode(u[12], u[13], u[14], u[15]);
  if (art === 'VP8X') return { w: 1 + (u[24] | (u[25] << 8) | (u[26] << 16)), h: 1 + (u[27] | (u[28] << 8) | (u[29] << 16)) };
  if (art === 'VP8 ') return { w: (u[26] | (u[27] << 8)) & 0x3fff, h: (u[28] | (u[29] << 8)) & 0x3fff };
  if (art === 'VP8L') { const b = u[21] | (u[22] << 8) | (u[23] << 16) | (u[24] << 24); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
  return null;
}
export const bildTyp = (u) => (pngMasse(u) ? 'image/png' : jpegMasse(u) ? 'image/jpeg' : webpMasse(u) ? 'image/webp' : '');
export const bildMasse = (u) => pngMasse(u) || jpegMasse(u) || webpMasse(u);
export function base64(u) {
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(s);
}

/* Logo der Instanz aus der veröffentlichten Marke (nur mit Merkmal logo), als Data-URL mit Maßen für blatt.js */
export async function logoLaden(k, inst) {
  const m = inst.m || {}, mk = inst.marke || {}, name = mk.bilder && mk.bilder.logo;
  if (!m.logo || !name || !mk.v) return null;
  const ab = ablage(k, 'marke'); if (!ab) return null;
  try {
    const u = await ab.holen('instanz/' + inst.id + '/' + mk.v + '/' + name); if (!u) return null;
    const typ = bildTyp(u), g = bildMasse(u); if (!typ || !g) return null;
    return { data: 'data:' + typ + ';base64,' + base64(u), w: g.w, h: g.h, grund: 'hell', bytes: u, typ: typ };
  } catch (e) { return null; }
}

/* Fotos des Aufmaßes: je Kennung erst die kleine Fassung, sonst das Original, bis das Budget erschöpft ist */
async function fotosLaden(k, code, wins, budget) {
  const ab = ablage(k), out = {}; let summe = 0, weitere = 0, n = 0;
  const ids = [];
  (wins || []).forEach((w) => { const b = w && w.bilder; if (b && typeof b === 'object') ['in', 'out'].forEach((s) => { const id = String(b[s] || ''); if (/^b[a-z0-9]{12,24}k?$/.test(id) && ids.indexOf(id) < 0) ids.push(id); }); });
  if (!ab) return { fotos: out, n: 0, weitere: ids.length };
  for (const id of ids) {
    let u = null;
    try { u = await ab.holen(linkOrdner(code) + '/' + id + 'k.jpg'); } catch (e) { u = null; }
    if (!u) { try { u = await ab.holen(linkOrdner(code) + '/' + id + '.jpg'); } catch (e) { u = null; } }
    if (!u) continue; // nicht angekommen
    const g = jpegMasse(u);
    if (!g || summe + u.length > budget) { weitere++; continue; }
    summe += u.length; n++;
    out[id] = { data: 'data:image/jpeg;base64,' + base64(u), w: g.w, h: g.h };
  }
  return { fotos: out, n: n, weitere: weitere };
}

/* Eingabe für blatt.js aus der Zeile der Anfrage */
function eingabe(inst, z, variante) {
  const l = (z && z.daten) || {}, am = l.aufmass || {}, wins = am.windows || [], pr = am.proj || {};
  const name = inst.name || (inst.marke && inst.marke.name) || '';
  return {
    variante: variante, fenster: wins, projekt: pr,
    kunde: { name: l.kunde || pr.name || '', kontakt: l.kontakt || '', adresse: l.adresse || pr.ort || '', mehr: AW().kundeKontakt(l).filter((r) => r[0] !== 'Erreichbar' || variante === 'betrieb') },
    klaerung: AW().klaerung(wins, pr, l), klaerStand: l.klaer || {},
    portalKurz: inst.haupthost || inst.host || '', kennzeichnung: (inst.m && inst.m.pdfKennzeichnung) || 'deutlich',
    nr: l.nr || '', fotos: {}, ausgabe: 'bytes',
    betrieb: { name: name, nr: l.nr || '', eingegangen: (l.log || {}).eingegangen || '', abzug: inst.abzug }
  };
}

export async function blattBauen(k, inst, z, o) {
  o = o || {};
  const B = await blattLaden();
  const l = (z && z.daten) || {}, am = l.aufmass || {};
  const e = eingabe(inst, z, 'betrieb');
  const logo = await logoLaden(k, inst); if (logo) e.betrieb.logo = { data: logo.data, w: logo.w, h: logo.h, grund: logo.grund };
  let f = { fotos: {}, n: 0, weitere: 0 };
  if (!o.ohneFotos) f = await fotosLaden(k, z.code, am.windows, Number(o.budget) || R().GRENZEN.pdfBudget);
  e.fotos = f.fotos;
  if (f.weitere) e.fotoHinweis = 'weitere Fotos: ' + f.weitere + ' (nicht im Blatt)';
  else if (o.ohneFotos) e.fotoHinweis = 'ohne Fotos im Blatt';
  const bytes = B.pdf(e);
  if (!bytes || !bytes.length) throw new Error('Kein PDF entstanden');
  return { bytes: bytes, fotos: f.n, weitere: f.weitere };
}
export async function blattFuerEingang(k, inst, z, o) { return (await blattBauen(k, inst, z, o)).bytes; }

export async function blattAnfrage(k, inst, z) {
  const B = await blattLaden();
  const e = eingabe(inst, z, 'anfrage'), l = (z && z.daten) || {};
  e.marke = { name: e.betrieb.name, host: inst.haupthost || inst.host || '' };
  const logo = await logoLaden(k, inst); if (logo) e.marke.logo = { data: logo.data, w: logo.w, h: logo.h, grund: logo.grund };
  e.betrieb = { name: e.betrieb.name, nr: l.nr || '' };
  e.sie = !inst.du;
  const f = await fotosLaden(k, z.code, (l.aufmass || {}).windows, R().GRENZEN.pdfBudget);
  e.fotos = f.fotos;
  const bytes = B.pdf(e);
  if (!bytes || !bytes.length) throw new Error('Kein PDF entstanden');
  return bytes;
}

/* Schlichtes PDF aus Text: Titel, dann Absätze bzw. Abschnitte mit Überschrift; Inter wie im Aufmaßblatt, A4, Seitenzahlen */
export async function textPdf(titel, abschnitte) {
  await blattLaden();
  const J = globalThis.jspdf.jsPDF, S = globalThis.BlattSchrift;
  const doc = new J({ unit: 'mm', format: 'a4', compress: true });
  let schrift = ['helvetica', 'normal'], fett = ['helvetica', 'bold'];
  try {
    doc.addFileToVFS('Inter-Medium.ttf', S.medium); doc.addFont('Inter-Medium.ttf', 'InterMedium', 'normal');
    doc.addFileToVFS('Inter-ExtraBold.ttf', S.extra); doc.addFont('Inter-ExtraBold.ttf', 'InterExtraBold', 'normal');
    schrift = ['InterMedium', 'normal']; fett = ['InterExtraBold', 'normal'];
  } catch (e) { /* Helvetica */ }
  const M = 20, B = 210 - 2 * M, UNTEN = 297 - 20;
  const t = (s) => String(s == null ? '' : s).replace(/[\u2000-\u200b\u202f]/g, ' ').replace(/[\u2010-\u2012]/g, '-').replace(/\u00ad/g, '');
  let y = 26;
  const platz = (h) => { if (y + h > UNTEN) { doc.addPage(); y = 22; } };
  try { doc.setDocumentProperties({ title: t(titel) }); doc.setLanguage('de-DE'); } catch (e) { /* ohne */ }
  doc.setFont(fett[0], fett[1]); doc.setFontSize(18); doc.setTextColor(22, 22, 22);
  doc.splitTextToSize(t(titel), B).forEach((z) => { platz(9); doc.text(z, M, y); y += 8; });
  y += 4;
  (Array.isArray(abschnitte) ? abschnitte : [abschnitte]).forEach((a) => {
    const ab = typeof a === 'string' ? { text: a } : a || {};
    if (ab.titel) { doc.setFont(fett[0], fett[1]); doc.setFontSize(12); doc.splitTextToSize(t(ab.titel), B).forEach((z) => { platz(7); doc.text(z, M, y); y += 6; }); y += 1; }
    doc.setFont(schrift[0], schrift[1]); doc.setFontSize(10);
    String(ab.text || '').split(/\n/).forEach((absatz) => {
      const zeilen = doc.splitTextToSize(t(absatz), B);
      if (!zeilen.length || !absatz.trim()) { y += 2.5; return; }
      zeilen.forEach((z) => { platz(5.2); doc.text(z, M, y); y += 4.8; });
      y += 1.6;
    });
    y += 3;
  });
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFont(schrift[0], schrift[1]); doc.setFontSize(8); doc.setTextColor(104, 104, 109); doc.text('Seite ' + i + ' von ' + n, 210 - M, 297 - 10, { align: 'right' }); }
  return new Uint8Array(doc.output('arraybuffer'));
}

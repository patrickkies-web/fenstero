'use strict';
/* ---------- Aufmaß-Modell wie in der App: Felder, Beschriftungen, Fensterzeichnung ---------- */
const AW = (() => {
  const OPT = {
    etage: { kg: 'Keller', eg: 'EG', og: 'OG', dg: 'DG' },
    form: { rechteck: 'Rechteck', rundbogen: 'Rundbogen', segment: 'Segmentbogen', schraeg: 'Schräg', rund: 'Rund' },
    olT: { F: 'Oberlicht fest', K: 'Oberlicht kippbar' },
    material: { kunststoff: 'Kunststoff', holz: 'Holz', holzalu: 'Holz-Alu', alu: 'Aluminium' },
    spross: { wiener: 'Wiener Sprosse', szr: 'Innenliegende Sprossen', auf: 'Aufgesetzte Sprossen', echt: 'Glasteilende Sprossen' },
    aufseite: { beide: 'innen und außen', aussen: 'nur außen', innen: 'nur innen' },
    glas: { '2': '2-fach', '3': '3-fach' },
    glasfn: { schall: 'Schallschutz', vsg: 'Sicherheitsglas', sicht: 'Sichtschutz', sonne: 'Sonnenschutz' },
    griff: { standard: 'Standard', abschliessbar: 'abschließbar', druckknopf: 'mit Druckknopf' },
    gf: { weiss: 'weiß', silber: 'silber', edelstahl: 'Edelstahl', titan: 'titan', schwarz: 'schwarz' },
    rc: { basis: 'Basisschutz', rc1: 'RC1 N', rc2: 'RC2' },
    roll: { keiner: 'keiner', behalten: 'bestehender bleibt', aufsatz: 'Aufsatzrollladen neu', vorbau: 'Vorbaurollladen neu' },
    antrieb: { gurt: 'Gurt', kurbel: 'Kurbel', motor: 'elektrisch', smart: 'Smart Home' },
    insekt: { keiner: 'keiner', spann: 'Spannrahmen', dreh: 'Drehrahmen', plissee: 'Plissee' },
    fbi: { behalten: 'behalten', werzalit: 'Werzalit', stein: 'Naturstein', holz: 'Holz' },
    fba: { behalten: 'behalten', alu: 'Aluminium', stein: 'Naturstein' },
    gebaeude: { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Eigentumswohnung', denkmal: 'Denkmalschutz', altbau: 'Altbau', gewerbe: 'Gewerbe' },
    zeit: { asap: 'so bald wie möglich', '3m': 'in 1 bis 3 Monaten', '6m': 'in 3 bis 6 Monaten', '12m': 'später, erst Angebote', sofort: 'so bald wie möglich', offen: 'noch offen' },
    budget: { b0: 'noch offen', b1: 'bis 5.000 €', b2: '5.000 bis 10.000 €', b3: '10.000 bis 20.000 €', b4: 'über 20.000 €' },
    orn: { satinato: 'Satinato', chinchilla: 'Chinchilla', master: 'Mastercarré' }
  };
  const COL = { '9016': ['Verkehrsweiß', 'RAL 9016', '#f1f0ea'], '9001': ['Cremeweiß', 'RAL 9001', '#e9e0cf'], '7035': ['Lichtgrau', 'RAL 7035', '#cbd0cc'], '7039': ['Quarzgrau', 'RAL 7039', '#6c6960'], '7012': ['Basaltgrau', 'RAL 7012', '#575d5e'], '7016': ['Anthrazitgrau', 'RAL 7016', '#383e42'], '9005': ['Tiefschwarz', 'RAL 9005', '#141516'], '8022': ['Schwarzbraun', 'RAL 8022', '#2b2522'], '6005': ['Moosgrün', 'RAL 6005', '#1f4436'], '5011': ['Stahlblau', 'RAL 5011', '#1e2b3a'], '3005': ['Weinrot', 'RAL 3005', '#5e2129'], goak: ['Golden Oak', 'Holzdekor', '#b5732f'], nuss: ['Nussbaum', 'Holzdekor', '#6b4428'], eiche: ['Eiche hell', 'Holzdekor', '#c9a46b'], mahag: ['Mahagoni', 'Holzdekor', '#6f2f22'] };
  const TYP = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp' };
  const lab = (g, k) => (OPT[g] && OPT[g][k]) || '';
  const col = (k) => COL[k] || COL['9016'];
  const num = (v) => { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
  const th = (v) => (!num(v) ? '–' : String(Math.round(num(v))).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  function sashesFor(k) {
    if (k === '1') return [{ t: 'DK', din: 'L' }];
    if (k === '2s') return [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }];
    if (k === '3') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'DK', din: 'R' }];
    return [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }];
  }
  function base() {
    return { name: '', etage: 'eg', anzahl: 1, mo: { hm: '', hl: '', hr: '', wm: '', wt: '', wb: '' }, el: { h: '', w: '' }, bru: '', laib: '', form: 'rechteck', teilung: '2p', ol: false, olT: 'K', sashes: sashesFor('2p'), richtung: 'innen', material: 'kunststoff', bars: [], spross: 'wiener', breite: 26, aufSeite: 'beide',
      fa: '7016', fi: '9016', gleich: false, wunschA: '', wunschI: '', glas: '3', glasfn: [], orn: 'satinato', griff: 'standard', gf: 'weiss', rc: 'basis', roll: 'keiner', antrieb: 'gurt', insekt: 'keiner', fbi: 'behalten', fba: 'alu', demontage: true, ralm: true, putz: true, notiz: '', ki: null, fotos: 0 };
  }
  const mk = (o) => { const w = Object.assign(base(), o); if (!o.sashes) w.sashes = sashesFor(w.teilung); return w; };
  function derive(w) {
    const mo = w.mo || {}, hs = ['hm', 'hl', 'hr'].map((k) => num(mo[k])).filter(Boolean), ws = ['wm', 'wt', 'wb'].map((k) => num(mo[k])).filter(Boolean);
    const moH = hs.length ? Math.min.apply(null, hs) : 0, moW = ws.length ? Math.min.apply(null, ws) : 0;
    return { moH: moH, moW: moW, devH: hs.length > 1 ? Math.max.apply(null, hs) - moH : 0, devW: ws.length > 1 ? Math.max.apply(null, ws) - moW : 0, elH: num(w.el && w.el.h) || num(w.h), elW: num(w.el && w.el.w) || num(w.w) };
  }
  const opening = (w) => (w.ol ? lab('olT', w.olT) + ' · ' : '') + (w.sashes || []).map((x) => TYP[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ');
  function rows(w) {
    const d = derive(w), mo = w.mo || {}, fa = col(w.fa), fi = col(w.gleich ? w.fa : w.fi);
    const r = [
      ['Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm, kleinstes Maß' + (d.devW > 5 || d.devH > 5 ? ', bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel' : '') : 'nicht gemessen'],
      ['Breiten', 'oben ' + th(mo.wt) + ' · Mitte ' + th(mo.wm) + ' · unten ' + th(mo.wb)],
      ['Höhen', 'links ' + th(mo.hl) + ' · Mitte ' + th(mo.hm) + ' · rechts ' + th(mo.hr)],
      ['Fensterelement', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm mit Rahmen' : 'nicht gemessen'],
      ['Lage', (w.name || 'ohne Raum') + ', ' + (lab('etage', w.etage) || 'EG') + (num(w.bru) ? ', Brüstung ' + th(w.bru) + ' mm' : '') + (num(w.laib) ? ', Laibung innen ' + th(w.laib) + ' mm' : '')],
      ['Öffnung', opening(w) + (w.richtung === 'aussen' ? ', öffnet nach außen' : '')],
      ['Form, Material', (lab('form', w.form) || 'Rechteck') + ', ' + (lab('material', w.material) || 'Kunststoff')],
      ['Farbe', 'außen ' + fa[0] + ' (' + fa[1] + ')' + (w.wunschA ? ', Wunsch: ' + w.wunschA : '') + ', innen ' + fi[0] + (w.wunschI && !w.gleich ? ', Wunsch: ' + w.wunschI : '')],
      ['Glas', (lab('glas', w.glas) || '3-fach') + ((w.glasfn || []).length ? ', ' + w.glasfn.map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + lab('orn', w.orn) + ')' : '')).join(', ') : '')],
      ['Sprossen', (w.bars || []).length ? lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite) + ')' : '') + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'keine'],
      ['Griff', (lab('griff', w.griff) || 'Standard') + ', ' + (lab('gf', w.gf) || 'weiß')],
      ['Einbruchschutz', lab('rc', w.rc) || 'Basisschutz'],
      ['Rollladen', (lab('roll', w.roll) || 'keiner') + (w.roll === 'aufsatz' || w.roll === 'vorbau' ? ', ' + lab('antrieb', w.antrieb) : '')],
      ['Insektenschutz', lab('insekt', w.insekt) || 'keiner'],
      ['Fensterbank', 'innen ' + (lab('fbi', w.fbi) || 'behalten') + ', außen ' + (lab('fba', w.fba) || 'behalten')],
      ['Montage', [w.demontage ? 'Altfenster ausbauen und entsorgen' : '', w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'nur Lieferung']
    ];
    if (w.notiz) r.push(['Notiz des Kunden', w.notiz]);
    return r;
  }
  const kiRows = (w) => (w.ki && w.ki.rows ? w.ki.rows : []);
  const kiChips = (w) => (w.ki ? (w.ki.chips || (w.ki.rows || []).map((r) => r[1])).filter(Boolean).slice(0, 6) : []);
  /* Fensterzeichnung: Rahmen, Flügel, Öffnungssymbole, Sprossen, Oberlicht; Farbe außen als Rahmenfarbe */
  const n1 = (v) => Math.round(v * 10) / 10;
  const R = (x, y, w, h) => 'M' + n1(x) + ' ' + n1(y) + 'h' + n1(w) + 'v' + n1(h) + 'h' + n1(-w) + 'Z';
  const Ln = (...p) => 'M' + p.map((q) => n1(q[0]) + ' ' + n1(q[1])).join('L');
  const path = (d, f, s, sw, da) => '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + sw + '"' + (da ? ' stroke-dasharray="' + da + '"' : '') + ' stroke-linejoin="round"></path>';
  function sym(x, y, w, h, t, din, da) {
    let o = '';
    if (t === 'D' || t === 'DK') o += path(din === 'L' ? Ln([x, y], [x + w, y + h / 2], [x, y + h]) : Ln([x + w, y], [x, y + h / 2], [x + w, y + h]), 'none', '#1d1d1f', 0.7, da);
    if (t === 'K' || t === 'DK') o += path(Ln([x, y + h], [x + w / 2, y], [x + w, y + h]), 'none', '#1d1d1f', 0.7, da);
    return o;
  }
  function svg(w, size) {
    const d = derive(w), a = (d.elW || 1000) / (d.elH || 1200), bw = a >= 1 ? 50 : 50 * a, bh = a >= 1 ? 50 / a : 50, bx = (64 - bw) / 2, by = (64 - bh) / 2;
    const fc = col(w.fa)[2], gl = '#d6e6f4', da = w.richtung === 'aussen' ? '3 2' : '';
    let o = path(R(bx, by, bw, bh), fc, '#1d1d1f', 1.2);
    const f = Math.max(2, bw * 0.06); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
    if (w.ol) { const oh = ih * 0.27; o += path(R(ix, iy, iw, oh), gl, '#1d1d1f', 0.6) + sym(ix, iy, iw, oh, w.olT || 'K', 'L', da); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
    const S = w.sashes || sashesFor(w.teilung), n = S.length, gap = w.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
    S.forEach((s, i) => {
      const sx = ix + i * (sw + gap), g = s.t === 'F' ? 0 : Math.max(1.5, sw * 0.09);
      if (s.t !== 'F') o += path(R(sx, iy, sw, ih), fc, '#1d1d1f', 0.7);
      const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
      o += path(R(gx, gy, gw, gh), gl, '#1d1d1f', 0.5);
      (w.bars || []).filter((b) => b.s === i).forEach((b) => { o += path(b.d === 'v' ? Ln([gx + gw * b.p, gy], [gx + gw * b.p, gy + gh]) : Ln([gx, gy + gh * b.p], [gx + gw, gy + gh * b.p]), 'none', fc === '#f1f0ea' ? '#b9b4a8' : fc, 1.2); });
      o += sym(gx, gy, gw, gh, s.t, s.din, da);
    });
    return '<svg viewBox="0 0 64 64" width="' + (size || 44) + '" height="' + (size || 44) + '" aria-hidden="true">' + o + '</svg>';
  }
  return { OPT: OPT, lab: lab, col: col, num: num, th: th, mk: mk, derive: derive, rows: rows, kiRows: kiRows, kiChips: kiChips, svg: svg, opening: opening, sashesFor: sashesFor };
})();

/* ---------- Grundlagen ---------- */
/* Adressen aus der aktuellen Seite: läuft so auf pages.dev und auf der eigenen Domain */
const APP_URL = new URL('/app/', location.href).href;
const LOCAL = false;
const APP_OPEN = APP_URL;
const STORE = 'aufmass.portal.v1';
const LOGO = (px) => (window.Logo ? window.Logo.svg(px) : '');
const BUDGET = { b0: 'Budget noch offen', b1: 'bis 5.000 €', b2: '5.000 bis 10.000 €', b3: '10.000 bis 20.000 €', b4: 'über 20.000 €' };
const ZEIT = { asap: 'so bald wie möglich', '3m': 'in 1 bis 3 Monaten', '6m': 'in 3 bis 6 Monaten', '12m': 'später, erst Angebote' };
const GEB = { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Eigentumswohnung', denkmal: 'Denkmalgeschütztes Haus', altbau: 'Altbau', gewerbe: 'Gewerbe' };
const GEO = { '50667': [50.938, 6.957, 'Köln', 'Altstadt'], '50823': [50.951, 6.918, 'Köln', 'Ehrenfeld'], '51103': [50.934, 7.025, 'Köln', 'Kalk'], '50939': [50.918, 6.933, 'Köln', 'Sülz'], '53111': [50.737, 7.098, 'Bonn', 'Zentrum'], '53173': [50.700, 7.160, 'Bonn', 'Bad Godesberg'], '51373': [51.031, 6.988, 'Leverkusen', 'Wiesdorf'], '40213': [51.224, 6.776, 'Düsseldorf', 'Altstadt'], '51429': [50.985, 7.137, 'Bergisch Gladbach', 'Bensberg'], '50354': [50.871, 6.868, 'Hürth', 'Hermülheim'], '50259': [50.996, 6.806, 'Pulheim', 'Stadt'], '53840': [50.816, 7.149, 'Troisdorf', 'Mitte'], '50668': [50.950, 6.960, 'Köln', 'Neustadt-Nord'], '51063': [50.960, 7.000, 'Köln', 'Mülheim'] };
const LEIST = ['Kunststoff', 'Holz', 'Holz-Alu', 'Aluminium', 'Haustüren', 'Rollläden', 'Insektenschutz', 'Denkmalschutz', 'RAL-Montage', 'Eigene Fertigung'];
const BASE_COMPANIES = [
  { id: 'c1', plan: 'portal', name: 'Fensterbau Brandt', plz: '50668', rating: 4.8, reviews: 127, since: 1998, team: 14, antwort: 'meist in 2 Std.', leist: ['Kunststoff', 'Holz-Alu', 'Aluminium', 'Rollläden', 'RAL-Montage'], verified: true, col: '#0071e3', text: 'Meisterbetrieb in Köln-Riehl. Wir montieren seit 27 Jahren alles von Kunststoff bis Holz-Alu, inklusive RAL-Montage und Rollladen.' },
  { id: 'c2', plan: 'portal', name: 'Glas & Rahmen Küpper', plz: '53111', rating: 4.6, reviews: 54, since: 2009, team: 6, antwort: 'meist am selben Tag', leist: ['Kunststoff', 'Holz', 'Haustüren', 'Insektenschutz'], verified: true, col: '#1f7a3d', text: 'Glaserei und Fensterbau in Bonn. Stark bei Altbau und Sonderformen.' },
  { id: 'c3', plan: 'portal', name: 'Schreinerei Ahrens', plz: '51429', rating: 4.9, reviews: 38, since: 1976, team: 9, antwort: 'meist in 4 Std.', leist: ['Holz', 'Holz-Alu', 'Denkmalschutz', 'Eigene Fertigung'], verified: true, col: '#a85a00', text: 'Familienbetrieb in dritter Generation. Eigene Fertigung für Holzfenster, auch denkmalgerecht.' },
  { id: 'c4', plan: 'portal', name: 'FensterWerk Rhein', plz: '40213', rating: 4.3, reviews: 211, since: 2014, team: 32, antwort: 'meist in 1 Std.', leist: ['Kunststoff', 'Aluminium', 'Rollläden', 'RAL-Montage'], verified: true, col: '#6e3fc2', text: 'Großer Montagebetrieb mit eigenem Lager. Schnelle Termine, Festpreise.' },
  { id: 'c5', plan: 'portal', name: 'Tischlerei Mertens', plz: '51373', rating: 4.7, reviews: 19, since: 2001, team: 4, antwort: 'meist in 1 Tag', leist: ['Holz', 'Holz-Alu', 'Eigene Fertigung'], verified: false, col: '#b3261e', text: 'Kleine Tischlerei in Leverkusen, Holzfenster nach Maß.' },
  { id: 'c6', plan: 'portal', name: 'Lichtblick Fenster GmbH', plz: '50354', rating: 4.5, reviews: 83, since: 2011, team: 11, antwort: 'meist in 3 Std.', leist: ['Kunststoff', 'Aluminium', 'Haustüren', 'Rollläden', 'Insektenschutz'], verified: true, col: '#0b7285', text: 'Fenster, Haustüren und Rollläden aus einer Hand, Ausstellung in Hürth.' },
  { id: 'c7', plan: 'service', name: 'Glaserei Vogt', plz: '50259', rating: 4.7, reviews: 22, since: 1989, team: 5, antwort: 'meist in 3 Std.', leist: ['Kunststoff', 'Holz', 'Insektenschutz'], verified: true, col: '#8a5a2b', text: 'Glaserei mit Fensterbau in Pulheim.' }
];
const REVIEWS = {
  c1: [['Familie Weber', 5, 'Aufmaß über die App, Angebot zwei Tage später, Montage sauber. Genau so stellt man sich das vor.'], ['R. Schmitz', 5, 'Haben sich beim Feinaufmaß Zeit genommen und zwei Fehler in unserer Planung gefunden.'], ['T. Keller', 4, 'Gute Arbeit, Termin hat sich um eine Woche verschoben.']],
  c2: [['M. Yilmaz', 5, 'Altbau mit Segmentbögen, kein Problem.'], ['A. Brauer', 4, 'Freundlich, fair, etwas längere Lieferzeit.']],
  c3: [['K. Hoffmann', 5, 'Holzfenster mit Sprossen fürs Denkmal, die Behörde war zufrieden und wir auch.']],
  c4: [['J. Peters', 4, 'Schnell und günstig, Beratung eher knapp.'], ['S. Lange', 3, 'Montage ok, Nacharbeit an einer Fensterbank nötig.']],
  c5: [['H. Brinkmann', 5, 'Handwerk wie früher.']],
  c6: [['D. Arslan', 5, 'Ausstellung lohnt sich, Rollladen gleich mitgeplant.'], ['P. Wolf', 4, 'Gutes Preis-Leistungs-Verhältnis.']]
};
const LINK_PRICE = 9, LINK_FREE = 3;
const KUNDE_DATEI = '19,90\u00a0€';
/* ---------- Helfer ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const mm = (n) => (n ? Number(n).toLocaleString('de-DE') : '–');
function geo(plz) {
  if (GEO[plz]) return GEO[plz];
  const p = String(plz || ''), keys = Object.keys(GEO);
  const k = keys.find((g) => g.slice(0, 3) === p.slice(0, 3)) || keys.find((g) => g.slice(0, 2) === p.slice(0, 2)) || keys.find((g) => g[0] === p[0]);
  return k ? GEO[k] : GEO['50667'];
}
function km(a, b) { const A = geo(a), B = geo(b), r = Math.PI / 180, dLat = (B[0] - A[0]) * r, dLng = (B[1] - A[1]) * r, x = Math.sin(dLat / 2) ** 2 + Math.cos(A[0] * r) * Math.cos(B[0] * r) * Math.sin(dLng / 2) ** 2; return Math.round(6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))); }
const ort = (plz) => geo(plz)[2], teil = (plz) => (GEO[plz] ? GEO[plz][3] : '');
const lage = (plz) => ort(plz) + (teil(plz) ? '-' + teil(plz) : '');
const slug = (t) => String(t || '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
const b64u = (t) => { try { return btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(String(t || ''))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); } catch (e) { return ''; } };
const MATL = { kunststoff: 'Kunststoff', holz: 'Holz', holzalu: 'Holz-Alu', alu: 'Aluminium' };
const newCode = () => Math.random().toString(36).slice(2, 7).replace(/[^a-z0-9]/g, 'x').padEnd(5, '7');
const two = (n) => String(n).padStart(2, '0');
function stamp() { const d = new Date(); return 'heute, ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
function dateIn(days) { const d = new Date(); d.setDate(d.getDate() + days); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); }
const seit = (d) => (d <= 0 ? 'Heute online' : d === 1 ? 'Online seit 1 Tag' : 'Online seit ' + d + ' Tagen');
const tage = (x) => (x.createdAt ? Math.floor((Date.now() - x.createdAt) / 864e5) : (x.created || 0));
const parseDE = (s) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59) : null; };
const datumDE = (ts) => { const d = new Date(ts); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); };
const tierName = (n) => (n <= 2 ? 'S · 1 bis 2 Fenster' : n <= 6 ? 'M · 3 bis 6 Fenster' : n <= 12 ? 'L · 7 bis 12 Fenster' : 'XL · ab 13 Fenster');
const hashN = (s) => String(s).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
/* ---------- Beispieldaten ---------- */
const nW = (n, one, many) => n + ' ' + (n === 1 ? one : many);
const KI = {
  wohnen: { chips: ['Kunststoff, weiß, vergilbt', '2-fach, vor 2000', 'Rollladenkasten innen', 'Heizkörper unter dem Fenster'], rows: [['Material', 'Kunststoff, weiß, vergilbt'], ['Verglasung', '2-fach, vermutlich vor 2000'], ['Rollladen', 'Kasten innen über dem Fenster, Gurtantrieb'], ['Fensterbank innen', 'Naturstein, etwa 25 cm tief'], ['Heizkörper', 'direkt unter dem Fenster'], ['Fassade', 'Putz, Außenanschlag etwa 3 cm']] },
  kueche: { chips: ['Kunststoff, weiß', '2-fach', 'Fliesenspiegel an der Laibung'], rows: [['Material', 'Kunststoff, weiß'], ['Verglasung', '2-fach'], ['Laibung innen', 'Fliesenspiegel bis an den Rahmen'], ['Fensterbank innen', 'Werzalit, weiß'], ['Hinweis', 'Arbeitsplatte unter dem Fenster, der Flügel muss darüber aufgehen']] },
  bad: { chips: ['Holz, weiß lackiert', 'Ornamentglas', 'Rahmen unten feucht'], rows: [['Material', 'Holz, weiß lackiert, Lack blättert unten'], ['Verglasung', 'Einfachglas, Ornament'], ['Laibung innen', 'gefliest'], ['Zustand', 'Rahmen unten feucht, Holz weich'], ['Hinweis', 'Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt']] },
  schlafen: { chips: ['Kunststoff, weiß', 'Rollladen vorhanden', 'Putzfassade'], rows: [['Material', 'Kunststoff, weiß'], ['Verglasung', '2-fach'], ['Rollladen', 'Kasten innen, Gurt, funktioniert'], ['Fassade', 'Putz']] },
  laden: { chips: ['Aluminium, dunkelgrau', 'Schaufenster', 'Klinkerfassade'], rows: [['Material', 'Aluminium, dunkelgrau'], ['Verglasung', '2-fach, Isolierglas'], ['Fassade', 'Klinker'], ['Hinweis', 'Festverglasung mit Beschriftung auf dem Glas']] },
  back: { chips: ['Aluminium', 'nur kippbar', 'kein Insektenschutz'], rows: [['Material', 'Aluminium'], ['Öffnung', 'nur kippbar'], ['Hinweis', 'Lebensmittelbetrieb: Insektenschutz einplanen']] }
};
const MOx = (w, h) => ({ wm: w, wt: w + 2, wb: w - 1, hm: h, hl: h + 2, hr: h - 1 });
function demoWins(set) {
  if (set === 'lindner') return [
    AW.mk({ name: 'Schaufenster links', etage: 'eg', mo: MOx(2030, 2240), el: { w: 2000, h: 2210 }, bru: 450, laib: 160, teilung: '1', sashes: [{ t: 'F', din: 'L' }], material: 'alu', fa: '7016', fi: '7016', gleich: true, glasfn: ['vsg'], fba: 'stein', fotos: 2, ki: KI.laden }),
    AW.mk({ name: 'Schaufenster rechts', etage: 'eg', mo: MOx(2030, 2240), el: { w: 2000, h: 2210 }, bru: 450, laib: 160, teilung: '1', sashes: [{ t: 'F', din: 'L' }], material: 'alu', fa: '7016', fi: '7016', gleich: true, glasfn: ['vsg'], fba: 'stein', fotos: 2, ki: KI.laden }),
    AW.mk({ name: 'Backstube', etage: 'eg', mo: MOx(1010, 810), el: { w: 980, h: 780 }, bru: 1450, laib: 160, teilung: '1', sashes: [{ t: 'K', din: 'L' }], material: 'alu', fa: '7016', fi: '9016', insekt: 'spann', fotos: 2, ki: KI.back })
  ];
  return [
    AW.mk({ name: 'Wohnzimmer', etage: 'eg', mo: MOx(1790, 1410), el: { w: 1760, h: 1385 }, bru: 620, laib: 140, teilung: '3', roll: 'aufsatz', antrieb: 'motor', insekt: 'spann', fbi: 'stein', fotos: 2, ki: KI.wohnen }),
    AW.mk({ name: 'Küche', etage: 'eg', mo: MOx(1260, 1440), el: { w: 1230, h: 1410 }, bru: 980, laib: 120, teilung: '2p', glasfn: ['vsg'], fbi: 'werzalit', fotos: 2, ki: KI.kueche }),
    AW.mk({ name: 'Bad', etage: 'og', mo: MOx(905, 1040), el: { w: 880, h: 1010 }, bru: 1320, laib: 120, teilung: '1', fa: '9016', glasfn: ['sicht'], orn: 'satinato', fbi: 'werzalit', fotos: 2, ki: KI.bad }),
    AW.mk({ name: 'Schlafzimmer', etage: 'og', anzahl: 2, mo: MOx(1260, 1440), el: { w: 1230, h: 1410 }, bru: 900, laib: 140, teilung: '2p', bars: [{ s: 0, d: 'v', p: 0.5 }, { s: 0, d: 'h', p: 0.5 }, { s: 1, d: 'v', p: 0.5 }, { s: 1, d: 'h', p: 0.5 }], spross: 'wiener', breite: 26, roll: 'behalten', fotos: 2, ki: KI.schlafen })
  ];
}
const projOf = (o) => Object.assign({ gebaeude: 'efh', baujahr: '1978', total: 9, zeit: '3m', budget: 'b3', foerd: false }, o);
const aufmassOf = (wins, proj) => ({ windows: wins, proj: proj, fotos: wins.reduce((s, w) => s + (w.fotos || 0), 0), elemente: wins.reduce((s, w) => s + (AW.num(w.anzahl) || 1), 0) });
function demoProjects(id) {
  if (id === 'c1') return [
    { id: 'l1', code: '7f3a9', nr: 'P-2026-031', kunde: 'Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster', 'Rollläden'], note: 'Rollladen elektrisch gewünscht', created: '10.10.2026', expires: '24.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '10.10., 09:12', gesendet: '10.10., 09:13', geoeffnet: '10.10., 18:40', arbeit: '10.10., 18:41', eingegangen: '10.10., 19:05' }, aufmass: aufmassOf(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' })), stage: 'angebot', memo: 'Angebot bis Freitag', seen: false },
    { id: 'l2', code: 'k2m8q', nr: 'P-2026-032', kunde: 'Herr Kaya', kontakt: 'kaya@beispiel.de', adresse: '51063 Köln-Mülheim', geb: 'etw', fz: '1 bis 2', plan: ['Fenster'], note: 'Wohnzimmer, vor dem Mieterwechsel', created: '12.10.2026', expires: '26.10.2026', status: 'arbeit', progress: 2, via: 'E-Mail', du: false, log: { erstellt: '12.10., 14:02', gesendet: '12.10., 14:03', geoeffnet: 'gestern, 19:20', arbeit: 'gestern, 19:22' } },
    { id: 'l3', code: 'p9x4t', nr: 'P-2026-033', kunde: 'Frau Schulze', kontakt: '0160 998 77 66', adresse: '50939 Köln-Sülz', geb: 'rh', fz: '6 bis 10', plan: ['Fenster', 'Haustür'], note: 'ganzes Haus, Rückruf nach 17 Uhr', created: 'heute', expires: dateIn(14), status: 'gesendet', progress: 0, via: 'SMS', du: false, log: { erstellt: 'heute, 08:30', gesendet: 'heute, 08:31' } }
  ];
  if (id === 'c7') return [
    { id: 'l4', code: 'v3n7r', nr: 'P-2026-007', kunde: 'Bäckerei Lindner', kontakt: '02238 12 34', adresse: 'Venloer Straße 3, 50259 Pulheim', geb: 'gewerbe', fz: '3 bis 5', plan: ['Fenster', 'Insektenschutz'], note: 'Ladenfront und Backstube', created: '08.10.2026', expires: '22.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '08.10., 10:00', gesendet: '08.10., 10:01', geoeffnet: '08.10., 15:30', arbeit: '08.10., 15:31', eingegangen: '08.10., 16:02' }, aufmass: aufmassOf(demoWins('lindner'), projOf({ gebaeude: 'gewerbe', baujahr: '1965', total: 3, zeit: 'asap', budget: 'b2' })), stage: 'termin', memo: 'Feinaufmaß Dienstag 9 Uhr', seen: true },
    { id: 'l5', code: 'h6c2w', nr: 'P-2026-008', kunde: 'Familie Roth', kontakt: '0172 333 44 55', adresse: '50259 Pulheim', geb: 'dh', fz: '1 bis 2', plan: ['Fenster'], note: 'Kinderzimmer', created: 'gestern', expires: dateIn(13), status: 'geoeffnet', progress: 0, via: 'WhatsApp', du: true, log: { erstellt: 'gestern, 17:45', gesendet: 'gestern, 17:46', geoeffnet: 'heute, 07:58' } }
  ];
  return [];
}
function demoInquiries() {
  const win = (name, w, h, t) => ({ name: name, w: w, h: h, typ: t });
  const ct = (name, tel, mail, erreich) => ({ name: name, tel: tel, mail: mail, erreich: erreich });
  return [
    { id: 'i1', owner: 'max', plz: '50823', geb: 'efh', baujahr: 1978, fenster: 3, elemente: 3, budget: 'b3', zeit: '3m', material: 'Kunststoff', fotos: 6, created: 1, status: 'offen', windows: [win('Wohnzimmer', 1760, 1385, '3 Flügel, Mitte fest'), win('Küche', 1230, 1410, '2 Flügel Dreh-Kipp'), win('Bad', 880, 1010, '1 Flügel Dreh-Kipp, Ornamentglas')], ki: ['Kunststoff, weiß, vergilbt', '2-fach, vor 2000', 'Rollladenkasten innen', 'Heizkörper unter dem Fenster', 'Dichtungen porös'], foerd: true, knocks: [{ c: 'c2', when: 'heute, 08:40', status: 'offen' }, { c: 'c3', when: 'gestern, 17:10', status: 'offen' }] },
    { id: 'i2', plz: '53111', geb: 'mfh', baujahr: 1962, fenster: 11, elemente: 11, budget: 'b4', zeit: 'asap', material: 'Kunststoff', fotos: 22, created: 2, status: 'offen', contact: ct('Hausverwaltung Schreiber', '0228 98 76 54', 'schreiber@beispiel.de', 'werktags 8 bis 16 Uhr'), windows: [win('Treppenhaus', 1100, 2200, 'Fest, 2 Felder'), win('Wohnung 1', 1230, 1410, '2 Flügel Dreh-Kipp')], ki: ['Holz, weiß, Lack blättert', 'Einfachglas', 'Putzfassade'], knocks: [{ c: 'c1', when: 'gestern, 09:20', status: 'frei' }] },
    { id: 'i3', plz: '51429', geb: 'dh', baujahr: 1996, fenster: 6, elemente: 7, budget: 'b3', zeit: '6m', material: 'Holz-Alu', fotos: 12, created: 3, status: 'offen', contact: ct('Familie Krämer', '02204 55 21 09', 'kraemer@beispiel.de', 'abends ab 18 Uhr'), windows: [win('Esszimmer', 2400, 2250, 'Hebe-Schiebe-Tür'), win('Schlafzimmer', 1230, 1410, '2 Flügel')], ki: ['Holz, braun', '2-fach', 'Rollladen vorhanden'], knocks: [] },
    { id: 'i4', plz: '50939', geb: 'etw', baujahr: 1930, fenster: 4, elemente: 4, budget: 'b2', zeit: '3m', material: 'Holz', fotos: 8, created: 4, status: 'offen', contact: ct('Dr. Anna Lenz', '0221 31 20 87', 'lenz@beispiel.de', 'lieber E-Mail'), windows: [win('Wohnzimmer', 1010, 1900, 'Kastenfenster, Sprossen')], ki: ['Kastenfenster, Holz', 'Sprossen echt', 'Denkmalschutz möglich'], denkmal: true, knocks: [{ c: 'c3', when: 'heute, 07:55', status: 'offen' }] },
    { id: 'i5', plz: '51373', geb: 'efh', baujahr: 2004, fenster: 2, elemente: 2, budget: 'b1', zeit: 'asap', material: 'Kunststoff', fotos: 4, created: 5, status: 'offen', contact: ct('Tobias Arndt', '0214 66 01 23', 'arndt@beispiel.de', 'vormittags'), windows: [win('Kinderzimmer', 1000, 1200, '1 Flügel Dreh-Kipp')], ki: ['Kunststoff, weiß', 'Dichtung defekt'], knocks: [] },
    { id: 'i6', plz: '40213', geb: 'etw', baujahr: 1985, fenster: 5, elemente: 5, budget: 'b3', zeit: '12m', material: 'Aluminium', fotos: 10, created: 6, status: 'offen', contact: ct('Sandra Haas', '0211 87 65 43', 'haas@beispiel.de', 'nachmittags'), windows: [win('Wohnen', 2100, 1400, '2 Flügel und Festfeld')], ki: ['Alu, anthrazit', '2-fach'], knocks: [{ c: 'c4', when: 'heute, 10:02', status: 'offen' }, { c: 'c6', when: 'gestern', status: 'abgelehnt' }] },
    { id: 'i7', plz: '50354', geb: 'rh', baujahr: 1972, fenster: 8, elemente: 9, budget: 'b3', zeit: '3m', material: 'Kunststoff', fotos: 16, created: 7, status: 'offen', contact: ct('Familie Özdemir', '02233 40 50 60', 'oezdemir@beispiel.de', 'am Wochenende'), windows: [win('Küche', 1230, 1200, '2 Flügel'), win('Haustür', 1000, 2100, 'Haustür')], ki: ['Kunststoff, weiß', 'Rollladen außen, Gurt'], foerd: true, knocks: [] },
    { id: 'i8', plz: '53840', geb: 'efh', baujahr: 1958, fenster: 14, elemente: 15, budget: 'b4', zeit: '6m', material: 'Holz-Alu', fotos: 28, created: 8, status: 'offen', contact: ct('Heinz Wagner', '02241 70 80 90', 'wagner@beispiel.de', 'jederzeit'), windows: [win('Erdgeschoss', 1480, 1370, '2 Flügel'), win('Obergeschoss', 1100, 1370, '1 Flügel')], ki: ['Holz, weiß', 'Einfachglas teils', 'Fassade Klinker'], foerd: true, knocks: [{ c: 'c1', when: 'vor 3 Tagen', status: 'offen' }] }
  ];
}
function seed() {
  return {
    v: 4, role: null, screen: 'landing', sel: null, hist: [],
    kunden: { max: { id: 'max', name: 'Max Muster', plz: '50823', tel: '0221 555 12 34', mail: 'max@beispiel.de', erreich: 'Nachmittags und abends, am liebsten Telefon', prefs: { push: true, addr: false, review: true } } },
    kcur: 'max',
    acc: {
      c1: { plan: 'portal', konto: 'ppk', pay: { type: 'SEPA-Firmenlastschrift', label: 'DE12 •••• •••• 4521', inhaber: 'Fensterbau Brandt', when: '01.09.2026' }, guthaben: 11, charges: [{ id: 'i2', when: 'gestern, 11:05', text: 'Portal-Kontakt · Mehrfamilienhaus Bonn', umfang: 'L · 7 bis 12 Fenster', betrag: 89, credit: 89, status: 'offen' }], verified: true, einsatz: 35, ap: 'Jens Brandt', mail: 'info@fensterbau-brandt.de', tel: '0221 123456', abzug: { seite: 15, oben: 15 }, prefs: { mail: true, urlaub: false }, kontakte: { i2: { stage: 'angebot', note: 'Angebot über 11 Fenster am 12.10. gesendet' } }, rechnungen: [{ nr: 'RE-2026-0912', datum: '30.09.2026', betrag: 118, pos: 2, status: 'bezahlt' }], links: demoProjects('c1') },
      c7: { plan: 'service', konto: 'service', guthaben: 0, verified: true, einsatz: 25, ap: 'Petra Vogt', mail: 'info@glaserei-vogt.de', tel: '02238 4711', abzug: { seite: 10, oben: 10 }, prefs: { mail: true, urlaub: false }, kontakte: {}, rechnungen: [], links: demoProjects('c7') }
    },
    cur: 'c1', myCompanies: [],
    logins: { 'max@beispiel.de': { role: 'kunde', id: 'max' }, 'info@fensterbau-brandt.de': { role: 'betrieb', id: 'c1' }, 'info@glaserei-vogt.de': { role: 'betrieb', id: 'c7' } },
    inq: demoInquiries(),
    notif: {
      max: [{ t: 'Glas & Rahmen Küpper hat angeklopft', s: 'Bonn, 4,6 Sterne. Du entscheidest, ob sie deine Kontaktdaten bekommen.', when: 'heute, 08:40', new: true, to: ['inquiry', 'i1'] }, { t: 'Schreinerei Ahrens hat angeklopft', s: 'Bergisch Gladbach, 4,9 Sterne.', when: 'gestern, 17:10', new: true, to: ['inquiry', 'i1'] }, { t: 'Dein Aufmaß ist online', s: '3 Fenster, anonym sichtbar für Betriebe im Umkreis.', when: 'vor 3 Tagen', new: false, to: ['inquiry', 'i1'] }],
      c1: [{ t: 'Herr Kaya misst gerade', s: 'Projekt P-2026-032: 2 von 4 Maßen eingetragen.', when: 'gestern, 19:22', new: true, to: ['link', 'l2'] }, { t: 'Aufmaß eingegangen: Familie Weber', s: '4 Positionen, 5 Elemente, 8 Fotos.', when: '10.10., 19:05', new: false, to: ['link', 'l1'] }, { t: 'Kontakt freigegeben: Mehrfamilienhaus Bonn', s: 'Der Eigentümer hat Sie zugelassen. 11 Fenster, Kontaktdaten jetzt sichtbar.', when: 'gestern, 11:05', new: false, to: ['lead', 'i2'] }],
      c7: [{ t: 'Familie Roth hat den Link geöffnet', s: 'Projekt P-2026-008, noch keine Maße eingetragen.', when: 'heute, 07:58', new: true, to: ['link', 'l5'] }, { t: 'Aufmaß eingegangen: Bäckerei Lindner', s: '3 Positionen mit 6 Fotos.', when: '08.10., 16:02', new: false, to: ['link', 'l4'] }]
    },
    reg: null, nl: null,
    filt: { km: 35, budget: '', minF: 0, zeit: '', sort: 'neu', q: '' }, af: { q: '', sort: 'km', leist: '' }, lfilt: 'alle', sheet: null
  };
}

let S = seed();
try { const raw = localStorage.getItem(STORE); if (raw) { const o = JSON.parse(raw); if (o && o.v === 4 && o.acc && o.kunden) S = Object.assign(seed(), o, { sheet: null }); } } catch (e) { /* ohne Speicher weiter */ }
function save() { try { const o = Object.assign({}, S, { sheet: null }); ['justCreated', '_pop', '_focusErr', 'animNext', '_feier'].forEach((k) => delete o[k]); localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* ok */ } }
/* ---------- Konten ---------- */
function allCompanies() { return BASE_COMPANIES.concat(S.myCompanies || []); }
function comp(id) { return allCompanies().find((c) => c.id === id) || BASE_COMPANIES[0]; }
const marketCompanies = () => allCompanies().filter((c) => c.plan === 'portal' && !(S.acc[c.id] && S.acc[c.id].prefs && S.acc[c.id].prefs.urlaub));
const A = () => S.acc[S.cur] || S.acc.c1;
const BC = () => comp(S.cur);
const K = () => S.kunden[S.kcur] || S.kunden.max;
const isPortal = () => A().plan === 'portal';
const myInq = () => S.inq.filter((x) => x.owner === S.kcur && x.status !== 'geloescht');
const sichtbar = (x) => x.status !== 'pause' && x.status !== 'geloescht';
function contactOf(x) { if (x.owner) { const k = S.kunden[x.owner] || K(); return { name: k.name, tel: k.tel || 'nicht angegeben', mail: k.mail, erreich: k.erreich || 'keine Angabe' }; } return x.contact || { name: 'Kunde', tel: '', mail: '', erreich: '' }; }
function knockStatus(inq, cid) { const k = (inq.knocks || []).find((x) => x.c === cid); return k ? k.status : null; }
const openKnocks = () => myInq().reduce((a, x) => a + (x.knocks || []).filter((k) => k.status === 'offen').length, 0);
const acctId = () => (S.role === 'kunde' ? S.kcur : S.cur);
const notifs = () => S.notif[acctId()] || (S.notif[acctId()] = []);
const newNotif = () => (S.role ? notifs().filter((n) => n.new).length : 0);
function notify(id, n) { (S.notif[id] = S.notif[id] || []).unshift(Object.assign({ when: stamp(), new: true }, n)); }
function leadPrice(inq, konto) { const n = inq.fenster, base = n <= 2 ? 29 : n <= 6 ? 59 : n <= 12 ? 89 : 129; return (konto || A().konto) === 'plus' ? Math.round(base * 0.7) : base; }
function charge(a, x) {
  const p = leadPrice(x, a.konto), cr = Math.min(a.guthaben, p);
  a.guthaben -= cr;
  (a.charges = a.charges || []).unshift({ id: x.id, when: stamp(), text: 'Portal-Kontakt · ' + GEB[x.geb] + ' ' + ort(x.plz), umfang: tierName(x.fenster), betrag: p, credit: cr, status: 'offen' });
}
const fairAb = (x) => { const k = (x.knocks || []).find((kk) => kk.c === S.cur); return k && k.freiAt && Date.now() - k.freiAt < 7 * 864e5 ? datumDE(k.freiAt + 7 * 864e5) : ''; };
const chargeOf = (a, id) => ((a && a.charges) || []).find((c) => c.id === id);
const paidPrice = (x) => { const c = chargeOf(A(), x.id); return c ? c.betrag : leadPrice(x); };
const dot = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const receivedLinks = (a) => (a || A()).links.filter((l) => l.status === 'eingegangen' && !l.demo);
function linkCharge(a) { return ledger(a || A()).filter((b) => b.status === 'offen').reduce((s, b) => s + b.betrag, 0); }
/* ---------- Symbole ---------- */
const STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z" fill="currentColor"/></svg>';
const stars = (c) => (c.rating ? '<span class="stars"><span class="starbar"><span class="base">' + STAR.repeat(5) + '</span><span class="fill" data-w="' + Math.round(c.rating / 5 * 100) + '%" style="--w: 0">' + STAR.repeat(5) + '</span></span>' + String(c.rating).replace('.', ',') + '<small>(' + c.reviews + ')</small></span>' : '<span class="badge acc">Neu bei Klopfan</span>');
const CHEV = '<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const I = (d, w) => '<svg viewBox="0 0 24 24" width="' + (w || 22) + '" height="' + (w || 22) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ICONS = {
  home: I('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  list: I('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  people: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 19c.6-3.4 3.3-5 6.5-5s5.9 1.6 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.3c3 0 5.3 1.5 6 4.7"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 20c.8-4 4-6 8-6s7.2 2 8 6"/>'),
  card: I('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h4"/>'),
  link: I('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  lock: I('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  swap: I('<path d="M7 7h12l-3-3M17 17H5l3 3"/>'),
  copy: I('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'), dl: I('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
  mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  sms: I('<path d="M4 5h16v11H9l-5 4z"/>'),
  wa: I('<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>'),
  ext: I('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  play: I('<path d="M8 5l11 7-11 7z"/>'),
  folder: I('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  ruler: I('<path d="M4 16L16 4l4 4L8 20z"/><path d="M8 12l1.5 1.5M11 9l1.5 1.5M14 6l1.5 1.5"/>'),
  frame: I('<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="7.5" y="6.5" width="9" height="11"/>'),
  camera: I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  open: I('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M6.5 6l4 6-4 6M13.5 18l2.5-12 2.5 12"/>'),
  palette: I('<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.6-1-2.6 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>'),
  glass: I('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 9l4-4M8 14l9-9M12 19l5-5"/>'),
  shutter: I('<rect x="4" y="3" width="16" height="5" rx="1"/><path d="M5.5 8v12M18.5 8v12M5.5 11.5h13M5.5 15h13M5.5 18.5h13"/>'),
  sill: I('<path d="M6 4h12v12H6zM3 16h18v3.5H3z"/><path d="M12 4v12"/>'),
  nouser: I('<circle cx="10" cy="8" r="4"/><path d="M3 20c.7-3.6 3.6-5.5 7-5.5"/><path d="M15.5 15l5 5M20.5 15l-5 5"/>'),
  filelock: I('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><rect x="9" y="13" width="6" height="5" rx="1"/><path d="M10.5 13v-1.5a1.5 1.5 0 0 1 3 0V13"/>'),
  euro: I('<path d="M17.5 6.5a7 7 0 1 0 0 11M4.5 10.5h9M4.5 13.5h9"/>'),
  logout: I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>'),
  send: I('<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>'),
  inbox: I('<path d="M4 4h16v16H4z"/><path d="M4 14h4l2 3h4l2-3h4"/>'),
  gift: I('<rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12"/><path d="M12 9c-3 0-5-1.2-5-3a2 2 0 0 1 4-.6C11.5 6.5 12 9 12 9zm0 0c3 0 5-1.2 5-3a2 2 0 0 0-4-.6C12.5 6.5 12 9 12 9z"/>'),
  coin: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18"/><circle cx="16.5" cy="15.5" r="1.3"/><path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4H18"/>'),
  pin: I('<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>'),
  hand: I('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8.5a5.5 5.5 0 0 1-5.5 5.5H11a5 5 0 0 1-4.3-2.4L4.3 13.4A1.4 1.4 0 0 1 6.6 12L8 14"/>'),
  spark: I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'),
  clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  flag: I('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>'),
  win: '<svg viewBox="0 0 48 56" aria-hidden="true"><rect x="4" y="4" width="40" height="48" rx="2" fill="#fbfbfa" stroke="#1d1d1f" stroke-width="1.5"/><rect x="9" y="9" width="13" height="38" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1"/><rect x="26" y="9" width="13" height="38" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1"/></svg>'
};
const icon = (k, w) => ICONS[k].replace(/width="22" height="22"/, 'width="' + w + '" height="' + w + '"');
/* Radar: ein Mittelpunkt, Punkte drumherum im richtigen Abstand, optional ein Umkreis */
function radarSVG(center, pts, o) {
  o = o || {}; const C = geo(center), cx = 160, cy = 160;
  const far = Math.max(o.km || 0, o.min || 18, ...pts.map((p) => km(center, p.plz))), sc = 136 / far;
  const pos = (plz) => { const P = geo(plz), dx = (P[1] - C[1]) * 111 * Math.cos(C[0] * Math.PI / 180), dy = -(P[0] - C[0]) * 111; return [cx + dx * sc, cy + dy * sc]; };
  let h = '<svg viewBox="0 0 320 320" aria-hidden="true">';
  [2, 5, 10, 25, 50, 100].forEach((r) => { if (r * sc < 152 && r * sc > 30) h += '<circle class="grid" cx="' + cx + '" cy="' + cy + '" r="' + (r * sc).toFixed(1) + '"></circle><text class="lbl" x="' + (cx + 4) + '" y="' + (cy - r * sc - 3).toFixed(1) + '">' + r + ' km</text>'; });
  if (o.km) h += '<circle class="ring" data-r="ring" cx="' + cx + '" cy="' + cy + '" r="' + (o.km * sc).toFixed(1) + '"></circle>';
  if (o.hero) h += '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="120" fill="none" stroke="var(--accent)" stroke-width="1.5"></circle><path class="sweep" d="M160 160 L160 20 A140 140 0 0 1 259 61 Z" fill="var(--accent)" fill-opacity=".10"></path>';
  h += '<g transform="translate(' + cx + ' ' + cy + ')"><g class="home" style="transform-box: fill-box; transform-origin: 50% 50%"><circle r="17" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"></circle><path d="M-8 1l8-7 8 7v8h-5v-5H-3v5h-5z" fill="var(--accent)"></path></g></g>';
  pts.forEach((p) => {
    const xy = pos(p.plz), d = km(center, p.plz), out = o.km && d > o.km;
    h += '<g transform="translate(' + xy[0].toFixed(1) + ' ' + xy[1].toFixed(1) + ')"><g class="pt' + (out ? ' out' : '') + '" data-km="' + d + '"' + (p.act ? ' data-act="' + p.act + '" data-v="' + (p.v || '') + '" data-id="' + (p.id || '') + '" role="button" tabindex="0"' : '') + ' style="--d: ' + (p.d || 0) + 's; transform-box: fill-box; transform-origin: 50% 50%"><title>' + esc(p.title || '') + '</title><circle class="b" r="11" fill="' + (p.col || 'var(--lead)') + '" stroke="var(--surface)" stroke-width="2.5"></circle><text y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" style="pointer-events: none">' + esc(p.ini || '') + '</text>' + (p.knock ? '<g class="kn" style="--d: ' + p.knock + 's"><rect x="-26" y="-36" width="52" height="18" rx="9" fill="var(--lead)"></rect><text y="-23" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">klopft an</text></g>' : '') + (p.ok ? '<g class="okm" style="--d: ' + p.ok + 's"><circle cx="11" cy="-10" r="8" fill="var(--ok)" stroke="var(--surface)" stroke-width="2"></circle><path d="M7.5 -10l2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g>' : '') + '</g></g>';
    if (p.ok) h += '<line class="ln" style="--d: ' + p.ok + 's" x1="' + xy[0].toFixed(1) + '" y1="' + xy[1].toFixed(1) + '" x2="' + cx + '" y2="' + cy + '" stroke="var(--ok)" stroke-width="2" stroke-dasharray="4 4"></line>';
  });
  return '<div class="radar' + (o.hero ? ' hero-radar' : '') + '" data-sc="' + sc.toFixed(4) + '">' + h + '</svg></div>';
}
function sw(label, sub, on, act, v) { return '<div class="sw-row"><span class="t"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><button type="button" class="switch" role="switch" aria-checked="' + !!on + '" aria-label="' + esc(label) + '" data-act="' + act + '" data-v="' + (v || '') + '"><span></span></button></div>'; }
const seg = (opts, cur, act) => '<div class="seg" role="tablist">' + opts.map((o) => '<button type="button" role="tab" data-act="' + act + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + (o[2] ? ' <span class="n">' + o[2] + '</span>' : '') + '</button>').join('') + '</div>';
const empty = (title, text, btn) => '<div class="empty"><b>' + title + '</b><span>' + text + '</span>' + (btn || '') + '</div>';
/* Kennzahl-Kachel mit Farbton und Symbol; Zahlen zählen hoch, Text (z. B. ∞) steht einfach da */
function stat(tone, ico, label, value, sub, fmt) {
  const num = typeof value === 'number';
  return '<div class="stat tone-' + tone + '"><span class="stat-ic">' + icon(ico, 20) + '</span><small>' + esc(label) + '</small><b' + (num ? ' data-count="' + value + '" data-fmt="' + (fmt || 'int') + '"' : '') + '>' + (num ? (fmt === 'eur' ? eur(value) : String(value)) : esc(String(value))) + '</b><span>' + sub + '</span></div>';
}
/* Bis zu drei gezeichnete Fenster, leicht gefächert, der Rest als Zahl */
function winStack(wins, size) {
  const show = wins.slice(0, 3);
  return '<span class="winstack n' + show.length + '">' + show.map((w, i) => '<i style="--k: ' + i + '">' + AW.svg(w, size || 40) + '</i>').join('') + (wins.length > 3 ? '<em>+' + (wins.length - 3) + '</em>' : '') + '</span>';
}
/* Fortschrittsring: k von n */
function ring(k, n) {
  const r = 17, c = 2 * Math.PI * r, p = n ? Math.min(1, k / n) : 0;
  return '<span class="pring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="' + r + '"/><circle class="val" cx="22" cy="22" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(1) + '"/></svg><b>' + k + '<small>/' + n + '</small></b></span>';
}
/* Vier Schrittpunkte: gesendet, geöffnet, misst, eingegangen */
function stepDots(l) {
  const idx = LORDER.indexOf(l.status), done = l.status === 'eingegangen', dead = ['abgelaufen', 'deaktiviert'].includes(l.status);
  return '<span class="pstep' + (dead ? ' dead' : '') + '">' + LORDER.slice(1).map((st, i) => { const j = i + 1; return '<i class="' + (done || j < idx ? 'done' : j === idx ? 'now' : '') + '" title="' + TLS[st] + '"></i>'; }).join('') + '</span>';
}
const KSTAGES = ['kontakt', 'termin', 'angebot', 'auftrag'];
function kstep(stage) {
  const i = KSTAGES.indexOf(stage || 'kontakt'), lost = stage === 'verloren';
  return '<span class="pstep kstep' + (lost ? ' dead' : '') + '">' + KSTAGES.map((st, j) => '<i class="' + (lost ? '' : j < i || (j === i && i === 3) ? 'done' : j === i ? 'now' : '') + '" title="' + st + '"></i>').join('') + '</span>';
}
/* Fensterreihe einer Anfrage: Rechtecke im richtigen Seitenverhältnis */
function winRow(wins, total) {
  const show = (wins || []).slice(0, 5);
  return '<span class="winrow">' + show.map((w) => { const a = (w.w || 1000) / (w.h || 1200), hh = 22, ww = Math.max(7, Math.min(40, hh * a)); return '<i style="width: ' + ww.toFixed(0) + 'px; height: ' + hh + 'px" title="' + esc(w.name + ' · ' + mm(w.w) + ' × ' + mm(w.h) + ' mm') + '"></i>'; }).join('') + (total > show.length ? '<em>+' + (total - show.length) + '</em>' : '') + '</span>';
}
/* Budget als vier Stufen */
function budgetBar(b) { const n = { b1: 1, b2: 2, b3: 3, b4: 4 }[b] || 0; return '<span class="bbar" title="' + esc(BUDGET[b] || '') + '">' + [1, 2, 3, 4].map((i) => '<i' + (i <= n ? ' class="on"' : '') + '></i>').join('') + '</span>'; }
/* ---------- Navigation ---------- */
function go(screen, sel) { if (S.screen !== screen || S.sel !== sel) { S.hist.push([S.screen, S.sel]); if (S.hist.length > 25) S.hist.shift(); } S.screen = screen; if (sel !== undefined) S.sel = sel; S.sheet = null; render(); window.scrollTo(0, 0); }
function nav(screen, sel) { S.hist = []; S.screen = screen; if (sel !== undefined) S.sel = sel; S.sheet = null; render(); window.scrollTo(0, 0); }
function back() { if (S.screen === 'reg' && S.reg && S.reg.step > firstStep(S.reg)) { S.reg.err = {}; S.reg.step--; S.animNext = true; render(); window.scrollTo(0, 0); return; } const h = S.hist.pop(); if (!h) return nav(S.role && PARENT[S.screen] ? PARENT[S.screen] : home()); S.screen = h[0]; S.sel = h[1]; S.sheet = null; render(); window.scrollTo(0, 0); }
function home() { return !S.role ? 'landing' : S.role === 'kunde' ? 'dash' : 'links'; }
function login(role, id, msg) { S.role = role; if (role === 'kunde') S.kcur = id; else S.cur = id; S.sheet = null; S.reg = null; nav(home()); toast(msg || ('Angemeldet als ' + (role === 'kunde' ? K().name : BC().name))); }
let pendingRefresh = false;
function refresh() { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && document.getElementById('app').contains(a)) { pendingRefresh = true; return; } render(); }
document.addEventListener('focusout', () => { if (!pendingRefresh) return; setTimeout(() => { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; pendingRefresh = false; render(); }, 50); });
function toast(t) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600); }
function later(ms, fn) { setTimeout(() => { fn(); save(); refresh(); }, ms); }
/* ---------- Rahmen ---------- */
function navItems() {
  if (S.role === 'kunde') return [['dash', 'Übersicht', 'home'], ['anbieter', 'Anbieter', 'people'], ['notif', 'Nachrichten', 'bell'], ['profil', 'Profil', 'user']];
  if (isPortal()) return [['links', 'Projekte', 'folder'], ['markt', 'Anfragen', 'list'], ['kontakte', 'Kontakte', 'people'], ['abrechnung', 'Abrechnung', 'card'], ['bprofil', 'Betrieb', 'user']];
  return [['links', 'Projekte', 'folder'], ['notif', 'Nachrichten', 'bell'], ['abrechnung', 'Abrechnung', 'card'], ['bprofil', 'Betrieb', 'user']];
}
const PARENT = { inquiry: 'dash', firma: 'anbieter', lead: 'markt', newlink: 'links', link: 'links', preise: 'abrechnung' };
function navCount(k) {
  if (k === 'notif') return newNotif();
  if (k === 'dash') return openKnocks();
  if (k === 'kontakte') return S.inq.filter((x) => knockStatus(x, S.cur) === 'frei' && !(A().kontakte[x.id] && A().kontakte[x.id].seen)).length;
  if (k === 'links') return A().links.filter((l) => l.status === 'eingegangen' && !l.seen).length;
  return 0;
}
function activeNav(k) { const p = PARENT[S.screen]; return S.screen === k || p === k || (S.hist.length && S.hist[0][0] === k && !navItems().some((n) => n[0] === S.screen)); }
const TITLES = { landing: 'Klopfan', reg: 'Registrieren', wie: 'So funktioniert es', preise: 'Preise', dash: 'Übersicht', inquiry: 'Mein Aufmaß', anbieter: 'Anbieter', firma: 'Betrieb', notif: 'Nachrichten', profil: 'Profil', markt: 'Anfragen', lead: 'Anfrage', kontakte: 'Kontakte', links: 'Projekte', newlink: 'Neues Projekt', link: 'Projekt', abrechnung: 'Abrechnung', bprofil: 'Mein Betrieb' };
let lastScreen = null, lastNew = 0, io = null;
const LASTVALS = {};
function render() {
  const root = document.getElementById('app'), role = S.role, out = !role;
  if (out && !['landing', 'reg', 'wie', 'preise'].includes(S.screen)) S.screen = 'landing';
  if (!out && ['landing', 'reg'].includes(S.screen)) S.screen = home();
  const view = (SCREENS[S.screen] || SCREENS.landing)();
  const anim = S.screen !== lastScreen || !!S.animNext; S.animNext = false;
  root.className = 'app' + (out ? ' is-out' : '');
  let h = '';
  if (!out) h += sidebar();
  const canBack = S.hist.length > 0 || (!!role && !!PARENT[S.screen]) || (S.screen === 'reg' && !!S.reg && S.reg.step > 0);
  const backBtn = '<button type="button" class="back" data-act="back" aria-label="Zurück"><svg width="10" height="17" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Zurück</span></button>';
  const logo = '<button type="button" class="logo-s" data-act="nav" data-v="landing"><span class="lm">' + LOGO(32) + '</span><span>Klopfan</span></button>';
  h += '<div class="main"><header class="top">' + (canBack ? backBtn : out ? logo : '') + '<h1>' + esc(out && S.screen === 'landing' ? '' : view.title || TITLES[S.screen] || '') + '</h1>';
  if (out) h += (S.screen !== 'preise' ? '<button type="button" class="btn small ghost hide-s" data-act="go" data-v="preise">Preise</button>' : '') + '<button type="button" class="btn small ghost" data-act="sheet" data-v="login">Anmelden</button>' + (S.screen !== 'reg' ? '<button type="button" class="btn small primary" data-act="reg" data-v="betrieb"><span class="hide-s">Kostenlos starten</span><span class="only-xs">Starten</span></button>' : '');
  else h += '<button type="button" class="btn small soft only-s demo-top" aria-label="Demo-Ansicht wechseln" data-act="sheet" data-v="demo">' + icon('swap', 16) + 'Demo</button><button type="button" class="ibtn" aria-label="Nachrichten" data-act="nav" data-v="notif">' + ICONS.bell + (newNotif() ? '<span class="dot"></span>' : '') + '</button>';
  h += '</header><div class="scr' + (anim ? ' anim' : '') + '" data-screen="' + S.screen + '">' + view.html + '</div>' + (out ? footer() : '') + '</div>';
  if (!out) h += '<nav class="tabs" aria-label="Bereiche">' + navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + '<span>' + esc(n[1]) + '</span>' + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>';
  if (S.sheet && SHEETS[S.sheet.k]) h += '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="sheet-close"></button><div class="sheet" role="dialog" aria-modal="true"><span class="grip"></span><button type="button" class="xclose" aria-label="Schließen" data-act="sheet-close">×</button>' + SHEETS[S.sheet.k](S.sheet) + '</div>';
  root.innerHTML = h;
  afterRender(anim);
  lastScreen = S.screen;
  save();
}
function sidebar() {
  const kunde = S.role === 'kunde', me = kunde ? { n: K().name, s: 'Hauseigentümer · ' + ort(K().plz), col: '#5e5ce6' } : { n: BC().name, s: (A().konto === 'plus' ? 'Betrieb Plus' : 'Start') + (isPortal() ? ' · mit Portal' : ''), col: BC().col };
  return '<aside class="side"><button type="button" class="logo" data-act="nav" data-v="' + home() + '"><span class="lm">' + LOGO(36) + '</span><span>Klopfan<small>Portal</small></span></button><nav class="nav">' +
    navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + esc(n[1]) + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>' +
    '<div class="me"><span class="av" style="background: ' + me.col + '">' + esc(me.n.slice(0, 1)) + '</span><span class="me-t"><b>' + esc(me.n) + '</b><small>' + esc(me.s) + '</small></span><button type="button" class="ibtn out" data-act="logout" aria-label="Abmelden" title="Abmelden">' + icon('logout', 19) + '</button></div><button type="button" class="btn small soft demo-side" data-act="sheet" data-v="demo">' + icon('swap', 17) + 'Demo-Ansicht wechseln</button></aside>';
}
function footer() {
  return '<footer class="foot"><div class="wrap"><div class="row between"><span class="lm-foot">' + LOGO(22) + ' Klopfan</span><div class="row foot-links"><button type="button" data-act="go" data-v="wie">So funktioniert es</button><button type="button" data-act="go" data-v="preise">Preise</button><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><button type="button" data-act="sheet" data-v="legal" data-id="agb">AGB</button></div></div><p>Pilotphase. Alle Betriebe, Projekte, Anfragen und Bewertungen sind Beispiele, es wird nichts berechnet. Echt funktionieren schon Kundenlinks, der Code-Eingang und der PDF-Export; alles bleibt in Ihrem Browser.</p></div></footer>';
}
/* ---------- Nach dem Rendern: Bewegung ---------- */
function afterRender(anim) {
  const scr = document.querySelector('.scr');
  if (!scr) return;
  ['.list', '.grid', '.flow', '.form', '.share'].forEach((sel) => scr.querySelectorAll(sel).forEach((p) => Array.from(p.children).forEach((c, i) => c.style.setProperty('--i', String(Math.min(i, 12))))));
  const wrap = scr.querySelector('.wrap');
  if (wrap) Array.from(wrap.children).forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--i', String(Math.min(i, 8))); });
  if (!io && 'IntersectionObserver' in window) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px 48px 0px' });
  scr.querySelectorAll('.rv').forEach((el) => { if (io && anim) io.observe(el); else el.classList.add('in'); });
  scr.querySelectorAll('[data-count]').forEach((el, i) => {
    const key = S.screen + ':' + i, to = +el.getAttribute('data-count'), fmt = el.getAttribute('data-fmt'), from = LASTVALS[key] == null ? 0 : LASTVALS[key];
    LASTVALS[key] = to;
    if (!anim && from === to) return;
    if (anim && io) { el.textContent = fmt === 'eur' ? eur(0) : '0'; const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(el, 0, to, fmt); o.disconnect(); } })); o.observe(el); return; }
    countUp(el, anim ? 0 : from, to, fmt);
  });
  const stage = document.getElementById('stage');
  if (stage) {
    const steps = Array.from(scr.querySelectorAll('.story-step'));
    const setStep = (i) => { if (stage.getAttribute('data-step') === String(i)) return; stage.setAttribute('data-step', String(i)); steps.forEach((st) => st.classList.toggle('on', +st.getAttribute('data-i') === i)); };
    stage.setAttribute('data-step', '-1'); setStep(0);
    if ('IntersectionObserver' in window) { const so = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setStep(+e.target.getAttribute('data-i')); }); }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 }); steps.forEach((st) => so.observe(st)); }
  }
  if (matchMedia('(hover: hover)').matches) scr.querySelectorAll('.hero .cta .btn, .rolecard .btn.primary, .svc .btn.primary').forEach((b) => { b.classList.add('magnet'); b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px, ' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)'; }); b.addEventListener('mouseleave', () => { b.style.transform = ''; }); });
  let prog = document.querySelector('.progress'); if (!prog) { prog = document.createElement('div'); prog.className = 'progress'; document.body.appendChild(prog); } prog.style.width = '0';
  scr.querySelectorAll('.stars .fill').forEach((f) => { const w = f.getAttribute('data-w'); if (anim) requestAnimationFrame(() => requestAnimationFrame(() => f.style.setProperty('--w', w))); else f.style.setProperty('--w', w); });
  const n = newNotif(), bell = document.querySelector('.top .ibtn:last-child');
  if (bell && n > lastNew) { bell.classList.add('ring'); const d = bell.querySelector('.dot'); if (d) d.classList.add('pop'); }
  lastNew = n;
  if (S._feier && window.Feier) {
    const art = S._feier; S._feier = null;
    const ziel = art === 'projekt' ? scr.querySelector('.created .burst-ok, .created') : art === 'willkommen' ? scr.querySelector('.h h2') : art === 'eingang' ? scr.querySelector('.amhead, .h .badge, .h h2') : art === 'frei' ? scr.querySelector('.note.ok, .h h2') : art === 'kontakt' ? scr.querySelector('.okcard .eyebrow, .okcard') : art === 'gesendet' ? scr.querySelector('.h .badge, .tlh li.now') : scr.querySelector('.h h2');
    if (ziel) setTimeout(() => { if (!document.body.contains(ziel)) return; if (art === 'gesendet') window.Feier.puls(ziel); else window.Feier.konfetti(ziel, { n: art === 'willkommen' || art === 'eingang' ? 36 : 24, kraft: art === 'willkommen' ? 170 : 120, breit: art === 'willkommen' }); }, 180);
  }
  if (S._pop) { const q = S._pop; const el = Array.from(document.querySelectorAll('[data-act="' + q.act + '"]')).find((x) => (x.getAttribute('data-v') || '') === q.v && (x.getAttribute('data-k') || '') === q.k); if (el) el.classList.add(el.classList.contains('switch') ? 'just' : 'pop'); S._pop = null; }
  scr.querySelectorAll('.scrollchips').forEach((row) => { const on = row.querySelector('[aria-pressed="true"]'); if (!on) return; const rr = row.getBoundingClientRect(), ro = on.getBoundingClientRect(); if (ro.left < rr.left + 8 || ro.right > rr.right - 8) row.scrollLeft += ro.left - rr.left - 24; });
  if (anim && matchMedia('(max-width: 520px)').matches) scr.querySelectorAll('.sample details').forEach((d) => { d.open = false; });
  const tk = document.getElementById('ticker'); if (tk) tk.textContent = TICKS[tickI % TICKS.length];
  document.querySelectorAll('.tilt').forEach(bindTilt);
  if (S.sheet && matchMedia('(hover: hover) and (pointer: fine)').matches) { const f = document.querySelector('.sheet input, .sheet textarea'); if (f && S.sheet.k !== 'demo') setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 80); }
  if (S._focusErr) { const f = document.querySelector('.f.has-err input, .f.has-err select, .f.has-err .chips button, .agree.has-err input'); if (f) { try { f.focus({ preventScroll: false }); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { /* ok */ } } S._focusErr = false; }
}
function countUp(el, from, to, fmt) {
  const t0 = performance.now(), dur = 750, f = (v) => (fmt === 'eur' ? eur(v) : String(Math.round(v)));
  const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = f(from + (to - from) * e); if (k < 1 && document.body.contains(el)) requestAnimationFrame(step); else el.textContent = f(to); };
  requestAnimationFrame(step);
}
const TICKS = ['Gerade eben: neue Anfrage in Troisdorf, 14 Fenster, Holz-Alu.', 'Vor 4 Minuten: Schreinerei Ahrens hat in Köln-Sülz angeklopft.', 'Vor 11 Minuten: Kontakt in Bonn freigegeben, 11 Fenster.', 'Vor 23 Minuten: neue Anfrage in Pulheim, 5 Fenster, Kunststoff.', 'Vor 40 Minuten: FensterWerk Rhein hat in Düsseldorf angeklopft.'];
let tickI = 0;
setInterval(() => { tickI++; const tk = document.getElementById('ticker'); if (!tk) return; const n = tk.cloneNode(false); n.textContent = TICKS[tickI % TICKS.length]; tk.replaceWith(n); }, 4200);
function bindTilt(card) {
  if (card.getAttribute('data-tilt')) return; card.setAttribute('data-tilt', '1');
  const host = card.closest('.hero') || card;
  host.addEventListener('mousemove', (e) => { const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; card.style.setProperty('--ty', (x * 9).toFixed(2) + 'deg'); card.style.setProperty('--tx', (-y * 7).toFixed(2) + 'deg'); });
  host.addEventListener('mouseleave', () => { card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); });
}
window.addEventListener('scroll', () => {
  const t = document.querySelector('.top'); if (t) t.classList.toggle('scrolled', window.scrollY > 6);
  const prog = document.querySelector('.progress'); if (prog) { const max = document.documentElement.scrollHeight - window.innerHeight; prog.style.width = (max > 200 ? Math.min(100, window.scrollY / max * 100) : 0).toFixed(1) + '%'; }
  const hr = document.querySelector('.hero .tilt'); if (hr) { const k = Math.min(1, window.scrollY / 600); hr.style.opacity = String(1 - k * 0.5); hr.style.setProperty('--tx', (-k * 10).toFixed(1) + 'deg'); }
  document.querySelectorAll('.rv:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('in'); });
  const bg = document.querySelector('.hero-bg'); if (bg) bg.style.transform = 'translateY(' + (window.scrollY * 0.25).toFixed(1) + 'px)';
}, { passive: true });
/* ---------- Bildschirme: Besucher ---------- */
const SCREENS = {};
const CAPS = [
  ['ruler', 'Maueröffnung', 'Drei Breiten und drei Höhen, das kleinste Maß zählt. Abweichungen außer Winkel werden markiert.'],
  ['frame', 'Fensterelement', 'Breite und Höhe des alten Fensters mit Rahmen, dazu Brüstungshöhe und Laibungstiefe.'],
  ['camera', 'Fotos innen und außen', 'Die KI liest Material, Zustand, Rollladenkasten, Fensterbank, Heizkörper und Fassade.'],
  ['open', 'Teilung und Öffnung', 'Flügel, Dreh, Kipp oder fest, DIN links oder rechts, Oberlicht und Sonderformen.'],
  ['palette', 'Material und Farbe', 'Kunststoff, Holz, Holz-Alu oder Aluminium. Farbe innen und außen nach RAL oder Dekor.'],
  ['glass', 'Glas und Sprossen', '2- oder 3-fach, Schallschutz, Sicherheits- und Ornamentglas, Sprossenart und Lage.'],
  ['shutter', 'Rollladen und Insektenschutz', 'Aufsatz oder Vorbau, Antrieb von Gurt bis Smart Home, Spann- oder Drehrahmen.'],
  ['sill', 'Fensterbank und Montage', 'Innen und außen, Ausbau und Entsorgung, RAL-Montage, Putzarbeiten an der Laibung.']
];
function heroPhone() {
  return '<div class="phone hero-ph" aria-hidden="true"><div class="ph-top"><span class="ph-av">B</span><span><b>Fensterbau Brandt</b><small>WhatsApp</small></span></div><div class="ph-body">' +
    '<div class="bub out b1">Guten Tag Familie Weber, für Ihr Fensterangebot brauchen wir die Maße Ihrer Fenster. Mit diesem Link messen Sie selbst, Schritt für Schritt erklärt:<span class="lp"><b>Klopfan · Aufmaß für Fensterbau Brandt</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span><i>09:13 ✓✓</i></div>' +
    '<div class="bub in b2">Super, machen wir heute Abend 👍<i>09:20</i></div>' +
    '<div class="ph-note b3"><span class="ph-dot"></span><span><b>Aufmaß eingegangen</b><small>Familie Weber · 4 Positionen, 8 Fotos</small></span></div></div></div>';
}
function storyScenes() {
  const win = '<svg viewBox="0 0 320 300" aria-hidden="true"><rect x="60" y="30" width="200" height="220" rx="3" fill="#fbfbfa" stroke="#1d1d1f" stroke-width="2"></rect><rect x="72" y="42" width="84" height="196" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><rect x="164" y="42" width="84" height="196" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><path d="M72 42 L156 140 L72 238 M72 238 L114 42 L156 238" fill="none" stroke="#1d1d1f" stroke-width=".8" opacity=".55"></path><rect x="150" y="128" width="5" height="24" rx="2" fill="#c9c3ba"></rect><rect x="165" y="128" width="5" height="24" rx="2" fill="#c9c3ba"></rect><path class="dim v" d="M34 30 V250 M28 30 H40 M28 250 H40" fill="none" stroke="var(--lead)" stroke-width="2.5" stroke-linecap="round"></path><path class="dim h" d="M60 272 H260 M60 266 V278 M260 266 V278" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"></path><g class="lab"><rect x="4" y="128" width="54" height="22" rx="11" fill="var(--lead)"></rect><text x="31" y="143" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">1.410</text></g><g class="lab h"><rect x="133" y="282" width="54" height="22" rx="11" fill="var(--accent)"></rect><text x="160" y="297" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">1.230</text></g></svg>';
  const w = demoWins('weber');
  return '<div class="sc sc-proj"><span class="pill">1 · Projekt</span><div class="mini form-mini"><p class="eyebrow">Neues Projekt</p><div class="fm"><small>Kunde</small><b class="ty" style="--n: 13">Familie Weber</b></div><div class="fm"><small>Objekt</small><b class="ty" style="--n: 26; --d: .9s">Lindenstraße 14, Köln</b></div><div class="fm-chips"><span class="badge acc">Einfamilienhaus</span><span class="badge acc">3 bis 5 Fenster</span><span class="badge acc">Fenster und Rollläden</span></div><span class="fm-btn">Projekt anlegen</span></div><p class="cap">Kunde, Adresse, grobe Eckdaten. Eine Minute.</p></div>' +
    '<div class="sc sc-msg"><span class="pill">2 · Link</span><div class="phone small"><div class="ph-top"><span class="ph-av">B</span><span><b>Fensterbau Brandt</b><small>WhatsApp</small></span></div><div class="ph-body"><div class="bub out">Guten Tag Familie Weber, mit diesem Link messen Sie Ihre Fenster selbst:<span class="lp"><b>Klopfan · Aufmaß für Fensterbau Brandt</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span><i>09:13 ✓✓</i></div></div></div><p class="cap">Mit Ihrem Namen als Absender. Text vorformuliert.</p></div>' +
    '<div class="sc sc-mess"><span class="pill">3 · Kunde misst</span>' + win + '<p class="cap">Im Browser, ohne Konto. Das Modell wächst beim Tippen.</p></div>' +
    '<div class="sc sc-in"><span class="pill">4 · Eingang</span><div class="mini in-mini"><span class="ring"></span><span class="unlock">' + ICONS.check + ' Aufmaß eingegangen</span><p class="mt">Familie Weber · Köln-Ehrenfeld</p>' + w.slice(0, 2).map((x, i) => { const d = AW.derive(x); return '<div class="in-row">' + AW.svg(x, 34) + '<span><b>Pos. ' + (i + 1) + ' · ' + esc(x.name) + '</b><small>Öffnung ' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' · ' + esc(AW.opening(x)) + '</small></span></div>'; }).join('') + '<p class="mf">und 2 weitere Positionen, 8 Fotos, Bestellmaß-Vorschlag</p></div><p class="cap">Sie kalkulieren, bevor Sie losfahren.</p></div>';
}
/* Ein Fenster aus dem Aufmaß: Kopfzeile, Maße, Bestellmaß, Einzelheiten zum Aufklappen */
function posCard(w, i, abzug, open) {
  const d = AW.derive(w), ab = abzug || { seite: 15, oben: 15 }, n = AW.num(w.anzahl) || 1;
  const best = d.moW && d.moH ? AW.th(d.moW - 2 * ab.seite) + ' × ' + AW.th(d.moH - ab.oben) + ' mm' : '–';
  const chips = AW.kiChips(w);
  return '<details class="posc"' + (open ? ' open' : '') + '><summary><span class="pic">' + AW.svg(w, 46) + '</span><span class="pt"><b>Pos. ' + (i + 1) + ' · ' + esc(w.name || 'Fenster') + (n > 1 ? ' · ' + n + ' Stück' : '') + '</b><span>Bestellmaß ' + best + '</span><small>Öffnung ' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' · Element ' + AW.th(d.elW) + ' × ' + AW.th(d.elH) + ' mm · ' + esc(AW.opening(w)) + ' · ' + esc(AW.lab('material', w.material) || 'Kunststoff') + ' · ' + esc(AW.lab('etage', w.etage) || 'EG') + '</small></span><span class="pchev" aria-hidden="true"></span></summary>' +
    '<div class="pbody"><div class="best"><span>Bestellmaß-Vorschlag</span><b>' + best + '</b><small>Öffnung minus ' + ab.seite + ' mm je Seite und ' + ab.oben + ' mm oben</small></div><div class="kv">' + AW.rows(w).map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>' +
    (AW.kiRows(w).length ? '<p class="eyebrow pos-h">Aus den Fotos (KI, ' + (w.fotos || 0) + ' Fotos)</p><div class="kv">' + AW.kiRows(w).map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>' : chips.length ? '<div class="chips">' + chips.map((c) => '<span class="badge">' + esc(c) + '</span>').join('') + '</div>' : '') + '</div></details>';
}
function roiCalc() {
  const n = S.roi ? S.roi.n : 12, t = S.roi ? S.roi.t : 75, r = S.roi ? S.roi.r : 65, v = roiVals(n, t, r);
  const rng = (k, label, min, max, step, val, out) => '<label class="roi-r"><span>' + label + '<b id="roi-' + k + '-l">' + out + '</b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-in="roi-' + k + '" aria-label="' + label + '"></label>';
  return '<section class="card roi"><div class="roi-in"><p class="eyebrow">Rechnen Sie nach</p><h3>Was ein Erstaufmaß vor Ort kostet.</h3>' + rng('n', 'Erstaufmaße im Monat', 2, 40, 1, n, String(n)) + rng('t', 'Zeit je Termin mit Fahrt', 30, 150, 5, t, t + ' Min.') + rng('r', 'Kosten je Stunde', 40, 120, 5, r, r + ' €') + '</div>' +
    '<div class="roi-out"><div class="ro"><small>Vor Ort im Monat</small><b id="roi-c">' + eur(v.cost) + '</b><span id="roi-h">' + v.hours + ' Stunden unterwegs und beim Kunden</span></div><div class="ro hi"><small>Mit Klopfan</small><b id="roi-l">' + eur(v.lm) + '</b><span id="roi-lp">' + v.plan + '</span></div><p class="roi-note">Annahme: Jedes Erstaufmaß ersetzt einen Termin fürs erste Angebot. Das Feinaufmaß vor der Fertigung bleibt.</p></div></section>';
}
function roiVals(n, t, r) { const hours = Math.round(n * t / 60 * 10) / 10, cost = Math.round(n * t / 60 * r), per = n * LINK_PRICE, plus = per > 79; return { hours: String(hours).replace('.', ','), cost: cost, lm: plus ? 79 : per, plan: plus ? 'Betrieb Plus, Aufmaße unbegrenzt' : n + ' Aufmaße × 9 € netto' }; }
SCREENS.landing = () => ({ title: 'Klopfan', html: '<div class="wrap">' +
  '<section class="hero b2b"><div class="hero-bg"></div><div><p class="eyebrow">Für Fensterbauer</p><h2>' + 'Aufmaß ohne Anfahrt.'.split(' ').map((w, i) => '<span class="w" style="--i: ' + i + '">' + w + '</span>').join(' ') + '</h2><p class="lead">Ihr Kunde misst seine Fenster selbst, mit der Klopfan-App und Schritt für Schritt geführt. Sie bekommen alles, was Sie für ein erstes Angebot brauchen: Maße, Fotos, Öffnungsarten, Farben und Ausstattung, für jedes Fenster.</p><div class="cta"><button type="button" class="btn big primary" data-act="reg" data-v="betrieb">Kostenlos starten</button><button type="button" class="btn big ghost" data-act="demo-as" data-v="c1">Demo ansehen</button></div><p class="hint">3 Aufmaße kostenlos · danach 9 € je Aufmaß · Ihr Kunde braucht kein Konto</p></div>' +
  '<div class="tilt hero-visual">' + heroPhone() + '</div></section>' +
  '<section class="strip"><div class="st"><b><span data-count="5" data-fmt="int">0</span><small> Min.</small></b><span>braucht Ihr Kunde je Fenster, Fotos und Wünsche inklusive</span></div><div class="st"><b><span data-count="8" data-fmt="int">0</span><small> Maße</small></b><span>je Fenster von Hand, plus Fotos innen und außen</span></div><div class="st"><b><span data-count="0" data-fmt="int">0</span><small> € </small></b><span>für Ihren Kunden. Kein Konto, keine App aus dem Store</span></div></section>' +
  '<section class="sec"><div class="sec-head"><h3>So läuft es</h3><button type="button" class="linkbtn" data-act="go" data-v="wie">Alle Details ›</button></div><div class="story"><div class="story-steps">' + [['Projekt anlegen', 'Kunde, Adresse und ein paar Eckdaten. Mehr braucht es nicht, in einer Minute erledigt.'], ['Link schicken', 'Per WhatsApp, SMS oder E-Mail, mit Ihrem Namen als Absender. Die Nachricht ist vorformuliert.'], ['Ihr Kunde misst', 'Im Browser, ohne Konto und ohne Installation. Zwei Fotos und vier Maße je Fenster, jeder Schritt erklärt.'], ['Aufmaß kommt an', 'Sortiert nach Positionen, mit Bestellmaß-Vorschlag und den Hinweisen aus den Fotos.']].map((st, i) => '<div class="story-step" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><h3>' + st[0] + '</h3><p>' + st[1] + '</p></div>').join('') + '</div><div class="story-stage" data-step="0" id="stage">' + storyScenes() + '</div></div></section>' +
  '<section class="sec"><div class="sec-head"><h3>Was im Aufmaß steckt</h3><span class="sub">je Fenster, wie beim Termin vor Ort</span></div><div class="caps">' + CAPS.map((c) => '<div class="cap"><span class="ci">' + icon(c[0], 22) + '</span><b>' + c[1] + '</b><span>' + c[2] + '</span></div>').join('') + '</div></section>' +
  '<section class="sec"><div class="sec-head"><h3>So kommt es bei Ihnen an</h3><span class="sub">Beispiel, Positionen zum Aufklappen</span></div><div class="card sample"><div class="sample-h"><span class="badge ok">' + icon('check', 12) + 'Aufmaß eingegangen</span><b>Familie Weber · Lindenstraße 14, Köln</b><span class="km-s">4 Positionen · 5 Elemente · 8 Fotos · Einfamilienhaus, Baujahr 1978</span></div>' + demoWins('weber').slice(0, 2).map((w, i) => posCard(w, i, null, i === 0)).join('') + '<p class="km-s">Vor der Fertigung messen Sie einmal nach. Fürs erste Angebot sparen Sie die Anfahrt.</p></div></section>' +
  '<section class="grid c3 trust"><div class="tcard"><span class="ci">' + icon('nouser', 22) + '</span><b>Für Ihren Kunden ohne Hürde</b><p>Er öffnet den Link im Browser und legt los. Kein Konto, keine App aus dem Store, keine Kosten. Seine Angaben gehen nur an Sie.</p></div><div class="tcard"><span class="ci">' + icon('filelock', 22) + '</span><b>Ihr Aufmaß bleibt Ihres</b><p>Ihr Kunde schickt das Aufmaß an Sie. Eine Kopie als Datei, um damit andere Betriebe anzufragen, gibt es für ihn nur mit eigenem Konto und gegen Gebühr.</p></div><div class="tcard"><span class="ci">' + icon('euro', 22) + '</span><b>Abgerechnet wird mit Ihnen</b><p>3 Aufmaße kostenlos, danach 9 € netto je eingegangenem Aufmaß. Unbegrenzt mit Betrieb Plus für 79 € im Monat.</p></div></section>' +
  roiCalc() +
  '<section class="addon"><div class="addon-t"><p class="eyebrow">Zusätzlich, wenn Sie möchten</p><h3>Anfragen aus dem Portal.</h3><p>Hauseigentümer stellen ihr Aufmaß anonym ins Klopfan-Portal. Sie sehen Projekte in Ihrem Umkreis mit komplettem Aufmaß, klopfen kostenlos an und zahlen nur, wenn der Eigentümer Sie freigibt.</p><ul><li>Kontakt 29 bis 129 € netto, je nach Fensterzahl</li><li>Höchstens drei Betriebe je Projekt</li><li>Gewerbenachweis nötig, 100 € Startguthaben</li></ul><div class="row"><button type="button" class="btn ghost" data-act="go" data-v="preise">Preise ansehen</button><button type="button" class="btn ghost" data-act="go" data-v="wie">So funktioniert es</button></div></div><div class="addon-v">' + radarSVG('50823', BASE_COMPANIES.slice(0, 6).map((c, i) => ({ plz: c.plz, col: c.col, ini: c.name.slice(0, 1), title: c.name, d: 0.4 + i * 0.7, knock: i === 1 ? 5.2 : i === 2 ? 5.9 : i === 5 ? 6.6 : 0, ok: i === 2 ? 7.8 : 0 })), { hero: true }) + '</div></section>' +
  '<section class="owner"><div><p class="eyebrow">Für Hauseigentümer</p><h3>Fenster selbst aufmessen, Angebote bekommen.</h3><p>Mit der App das eigene Aufmaß machen und anonym ins Portal stellen. Betriebe aus der Nähe klopfen an, Kontaktdaten gibt es nur nach Freigabe. Kostenlos.</p></div><div class="row"><button type="button" class="btn primary" data-act="reg" data-v="kunde">Als Hauseigentümer starten</button><a class="btn ghost" href="' + APP_OPEN + '" target="_blank" rel="noopener">App öffnen ' + icon('ext', 15) + '</a></div></section>' +
  '<div class="marquee" aria-hidden="true"><div class="track">' + ['Köln', 'Bonn', 'Leverkusen', 'Düsseldorf', 'Bergisch Gladbach', 'Hürth', 'Pulheim', 'Troisdorf', 'Brühl', 'Siegburg'].concat(['Köln', 'Bonn', 'Leverkusen', 'Düsseldorf', 'Bergisch Gladbach', 'Hürth', 'Pulheim', 'Troisdorf', 'Brühl', 'Siegburg']).map((c) => '<span>' + c + '</span>').join('') + '</div></div></div>' });
const FAQ = [
  ['Wie genau ist das Aufmaß?', 'Die App führt Ihren Kunden durch acht Handmaße je Fenster mit dem Zollstock. Von drei Breiten und drei Höhen zählt das kleinste Maß, Abweichungen außer Winkel werden markiert. Für ein erstes Angebot reicht das; vor der Fertigung messen Sie einmal nach.'],
  ['Was braucht mein Kunde?', 'Ein Smartphone mit Kamera und einen Zollstock. Kein Konto, keine App aus dem Store, keine Kosten. Der Link öffnet die App direkt im Browser.'],
  ['Was, wenn der Kunde nicht klarkommt?', 'Jeder Schritt hat eine Erklärung mit Bild, jeder Fachbegriff ein Glossar. Im Projekt sehen Sie, ob der Link geöffnet wurde und wie weit Ihr Kunde ist, und können gezielt nachhaken.'],
  ['Wer sieht die Daten?', 'Nur Sie. Aufmaße aus Ihren Links gehen nicht ins Portal und an keinen anderen Betrieb. Ihr Kunde bekommt keine Datei zum Weiterschicken, außer er kauft sie mit eigenem Konto.'],
  ['Wann zahle ich, und wofür?', 'Nur für eingegangene Aufmaße, nie für verschickte Links. Die ersten 3 sind kostenlos und brauchen keine Zahlungsart. Ab dem vierten hinterlegen Sie eine SEPA-Firmenlastschrift oder eine Karte; vorher bleibt ein neues Aufmaß gesperrt. Abgebucht wird alle zwei Wochen als Sammelrechnung.'],
  ['Kann ich die Daten weiterverarbeiten?', 'Ja: als PDF-Aufmaßblatt mit Bestellmaß-Vorschlag je Position und als Text zum Kopieren. Geplant sind Schnittstellen zu gängiger Fensterbau-Software.']
];
SCREENS.wie = () => ({ html: '<div class="wrap narrow"><div class="h"><p class="eyebrow">So funktioniert es</p><h2>Aufmaß ohne Anfahrt, abgerechnet mit Ihnen.</h2><p>Für Fensterbauer, die ihren Kunden ein sauberes Erstaufmaß ermöglichen wollen, ohne selbst hinzufahren. Dazu, wenn Sie möchten, anonyme Anfragen aus dem Portal.</p></div>' +
  '<div class="card"><p class="eyebrow">Projekt und Aufmaß-Link</p><div class="kv" style="margin-top: 10px"><span>1 · Projekt</span><span>Sie legen ein Projekt an: Kunde, Adresse und grobe Eckdaten wie Gebäude und ungefähre Fensterzahl.</span><span>2 · Link</span><span>Sie schicken den Aufmaß-Link per WhatsApp, SMS oder E-Mail. Er gilt für ein Aufmaß und läuft nach 7, 14 oder 30 Tagen ab.</span><span>3 · Aufmaß</span><span>Ihr Kunde öffnet den Link im Browser, ohne Konto und ohne Installation, und misst geführt: Fotos, Maße, Wünsche am 3-D-Modell.</span><span>4 · Eingang</span><span>Das Aufmaß landet in Ihrem Projekt, nicht im Portal. Kein anderer Betrieb sieht es.</span><span>5 · Abrechnung</span><span>Mit Ihnen: 3 Aufmaße kostenlos, danach 9 € netto je eingegangenem Aufmaß, mit Betrieb Plus unbegrenzt. Ihr Kunde zahlt nichts.</span><span>6 · Datei</span><span>Ihr Kunde bekommt keine Kopie zum Weiterschicken. Wer sein Aufmaß als Datei möchte, braucht ein eigenes Konto und zahlt dafür ' + KUNDE_DATEI + '.</span></div></div>' +
  '<section class="sec"><div class="sec-head"><h3>Häufige Fragen</h3></div><div class="faq">' + FAQ.map((f) => '<details class="fq"><summary>' + esc(f[0]) + '<span class="pchev" aria-hidden="true"></span></summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div></section>' +
  '<div class="card"><p class="eyebrow">Zusatz: Portal</p><div class="kv" style="margin-top: 10px"><span>1 · Inserat</span><span>Hauseigentümer messen selbst und stellen ihr Aufmaß anonym ins Portal: Postleitzahl, Gebäude, Fensterzahl, Budget, Zeitraum, Aufmaßblatt und Fotos.</span><span>2 · Anklopfen</span><span>Betriebe im Umkreis klopfen an. Kostenlos und unverbindlich.</span><span>3 · Freigabe</span><span>Der Eigentümer gibt bis zu drei Betriebe frei. Erst dann sehen sie Name, Telefon und E-Mail.</span><span>4 · Abrechnung</span><span>Nur die Freigabe kostet: 29 bis 129 € netto je nach Fensterzahl. Ist der Kunde sieben Tage nicht erreichbar, gibt es eine Gutschrift.</span></div></div>' +
  '<div class="row"><button type="button" class="btn primary" data-act="reg" data-v="betrieb">Kostenlos starten</button><button type="button" class="btn ghost" data-act="go" data-v="preise">Preise</button></div></div>' });
SCREENS.preise = () => {
  const tiers = [['S', '1 bis 2 Fenster', 29], ['M', '3 bis 6 Fenster', 59], ['L', '7 bis 12 Fenster', 89], ['XL', 'ab 13 Fenster', 129]];
  const cur = S.role === 'betrieb' ? (A().konto === 'plus' ? 'plus' : isPortal() ? 'portal' : 'start') : '';
  const card = (k, eb, p, sm, items, btn) => '<div class="price' + (cur === k ? ' hi' : k === 'plus' && !cur ? ' hi' : '') + '"><p class="eyebrow">' + eb + (cur === k ? ' · Ihr Plan' : '') + '</p><span class="p">' + p + '<small>' + sm + '</small></span><ul>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>' + btn + '</div>';
  const regBtn = (v, l) => (S.role ? '' : '<button type="button" class="btn primary" data-act="reg" data-v="' + v + '">' + l + '</button>');
  return { html: '<div class="wrap"><div class="h"><p class="eyebrow">Für Fensterbauer</p><h2>Sie zahlen für Aufmaße, die ankommen.</h2><p>Keine Grundgebühr im Start. Ihr Kunde zahlt nichts und braucht kein Konto. Kündbar jederzeit, alle Preise netto.</p></div>' +
    '<div class="grid c3 pricegrid">' + card('start', 'Start', '0 €', ' Grundgebühr', ['Projekte und Aufmaß-Links', '3 Aufmaße kostenlos', 'danach 9 € je eingegangenem Aufmaß', 'ohne Gewerbeprüfung startklar'], regBtn('betrieb', 'Kostenlos starten')) +
    card('plus', 'Betrieb Plus', '79 €', ' im Monat', ['Aufmaße unbegrenzt', 'Ihr Logo und Ihre Farbe beim Kunden', 'Team mit Rollen und Statistik', 'Portal-Kontakte 30 % günstiger', 'monatlich kündbar'], regBtn('betrieb', 'Mit Plus starten')) +
    card('portal', 'Portal-Zusatz', '0 €', ' Grundgebühr', ['anonyme Anfragen aus Ihrer Region', 'anklopfen kostenlos', 'Kontakt 29 bis 129 € nur bei Freigabe', 'Gewerbenachweis nötig, 100 € Startguthaben'], regBtn('portal', 'Portal freischalten')) + '</div>' +
    '<div class="card kcost"><span class="ci">' + icon('nouser', 22) + '</span><div><b>Für Ihren Kunden: kostenlos und ohne Konto.</b><p>Er misst und schickt das Aufmaß an Sie. Möchte er zusätzlich eine Kopie als Datei, um sie selbst weiterzugeben, braucht er ein eigenes Konto und zahlt ' + KUNDE_DATEI + '. Das berührt Ihr Projekt nicht.</p></div></div>' +
    '<section class="sec"><div class="sec-head"><h3>Kontaktpreise im Portal</h3><span class="sub">netto, nur bei Freigabe</span></div><div class="tiers">' + tiers.map((t) => '<div class="tier"><small>' + t[0] + ' · ' + t[1] + '</small><b>' + eur(t[2]) + '</b><small>mit Plus: ' + eur(Math.round(t[2] * 0.7)) + '</small></div>').join('') + '</div></section>' +
    roiCalc() + '</div>' };
};

/* ---------- Registrierung ---------- */
const VAL = {
  mail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()) || 'Bitte eine gültige E-Mail-Adresse eingeben.',
  pw: (v) => String(v || '').length >= 8 || 'Mindestens 8 Zeichen.',
  name: (v) => String(v || '').trim().length >= 2 || 'Bitte ausfüllen.',
  plz: (v) => /^\d{5}$/.test(String(v || '').trim()) || 'Bitte eine fünfstellige Postleitzahl eingeben.',
  tel: (v) => String(v || '').replace(/\D/g, '').length >= 6 || 'Bitte eine Telefonnummer eingeben.',
  telopt: (v) => !v || String(v).replace(/\D/g, '').length >= 6 || 'Bitte eine gültige Nummer eingeben oder das Feld leer lassen.',
  agb: (v) => !!v || 'Bitte zustimmen, sonst kann kein Konto angelegt werden.',
  leist: (v) => (v && v.length > 0) || 'Bitte mindestens eine Leistung wählen.',
  doc: (v) => v === 'ok' || 'Bitte einen Nachweis hochladen.',
  pay: (v) => !!v || 'Bitte eine Zahlungsart wählen.',
  kmail: (v) => { const r = VAL.mailfree(v); if (r !== true) return r; const m = String(v).trim().toLowerCase(), hit = FREEMAIL.test(m) ? '' : betriebBy((a) => String(a.mail || '').toLowerCase().split('@')[1] === m.split('@')[1]); return hit ? 'Diese Adresse gehört zu ' + hit + '. Für Ihre Kunden legen Sie bitte Projekte im Betriebskonto an.' : true; },
  ktel: (v) => { const r = VAL.telopt(v); if (r !== true) return r; const t = normTel(v), hit = t.length >= 6 ? betriebBy((a) => normTel(a.tel) === t) : ''; return hit ? 'Diese Nummer gehört zu ' + hit + '. Für Ihre Kunden legen Sie bitte Projekte im Betriebskonto an.' : true; },
  mailfree: (v) => (VAL.mail(v) === true ? (!S.logins[String(v).trim().toLowerCase()] || 'Zu dieser E-Mail gibt es schon ein Konto. Bitte anmelden.') : VAL.mail(v))
};
/* Betriebe starten direkt bei Schritt 1; Schritt 0 (Wegwahl) bleibt nur intern */
function regSteps(r) { if (r.role === 'kunde') return ['Zugang', 'Zu dir', 'Datenschutz']; if (r.path === 'portal') return ['Weg', 'Betrieb', 'Einsatzgebiet', 'Nachweise', 'Bewertungen', 'Kontomodell']; return ['Weg', 'Betrieb', 'Auftritt']; }
const firstStep = (r) => (r.role === 'kunde' ? 0 : 1);
function regKey(r) { return (r.role === 'kunde' ? 'kunde' : r.step <= 1 ? 'betrieb' : r.path) + ':' + r.step; }
const REQ = { 'kunde:0': { mail: 'kmail', pw: 'pw' }, 'kunde:1': { name: 'name', plz: 'plz', tel: 'ktel' }, 'kunde:2': { agb: 'agb' }, 'betrieb:1': { firma: 'name', ap: 'name', mail: 'mailfree', tel: 'tel', pw: 'pw' }, 'service:2': { plz: 'plz', agb: 'agb' }, 'portal:2': { plz: 'plz', leist: 'leist' }, 'portal:3': { doc: 'doc' }, 'portal:5': { pay: 'pay', agb: 'agb' } };
const SAMPLE = { 'kunde:0': { mail: 'lisa.berger@beispiel.de', pw: 'fenster2026' }, 'kunde:1': { name: 'Lisa Berger', plz: '50939', tel: '0221 444 55 66', erreich: ['Abends'] }, 'kunde:2': { agb: true }, 'betrieb:1': { firma: 'Fensterbau Sommer', ap: 'Jonas Sommer', mail: 'info@fensterbau-sommer.de', tel: '0221 777 88 99', pw: 'fenster2026' }, 'service:2': { plz: '51063', col: '#0b7285', agb: true }, 'portal:2': { str: 'Industriestraße 12', plz: '51063', km: 35, leist: ['Kunststoff', 'Holz-Alu', 'Rollläden'], kap: '4 bis 8' }, 'portal:3': { ust: 'DE123456789', doc: 'ok', haft: true }, 'portal:4': { google: 'Fensterbau Sommer' }, 'portal:5': { konto: 'ppk', pay: 'SEPA-Lastschrift', agb: true } };
function regValidate(r) {
  const req = REQ[regKey(r)] || {}, err = {};
  Object.keys(req).forEach((f) => { const ok = VAL[req[f]](r.d[f]); if (ok !== true) err[f] = ok; });
  r.err = err; return !Object.keys(err).length;
}
SCREENS.reg = () => {
  const r = S.reg || (S.reg = { role: 'betrieb', path: 'service', step: 1, d: {}, err: {} }), d = r.d, e = r.err || {}, k = r.role === 'kunde', steps = regSteps(r), f0 = firstStep(r);
  const fe = (f) => (e[f] ? '<small class="err" id="e-' + f + '">' + esc(e[f]) + '</small>' : '');
  const inp = (label, f, ph, type, small, auto) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label for="r-' + f + '">' + label + '</label><input id="r-' + f + '" type="' + (type || 'text') + '" data-in="r:' + f + '" value="' + esc(d[f] || '') + '" placeholder="' + esc(ph || '') + '"' + (auto ? ' autocomplete="' + auto + '"' : '') + (e[f] ? ' aria-invalid="true" aria-describedby="e-' + f + '"' : '') + '>' + fe(f) + (small && !e[f] ? '<small>' + small + '</small>' : '') + '</div>';
  const chipsF = (label, f, opts, multi) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label>' + label + '</label><div class="chips">' + opts.map((o) => '<button type="button" class="chip" data-act="' + (multi ? 'reg-chip' : 'reg-set') + '" data-k="' + f + '" data-v="' + esc(o) + '" aria-pressed="' + (multi ? (d[f] || []).indexOf(o) >= 0 : d[f] === o) + '">' + esc(o) + '</button>').join('') + '</div>' + fe(f) + '</div>';
  const agree = (text) => '<label class="agree' + (e.agb ? ' has-err' : '') + '"><input type="checkbox" data-in="r:agb"' + (d.agb ? ' checked' : '') + '><span>' + text + '</span></label>' + (e.agb ? '<small class="err">' + esc(e.agb) + '</small>' : '');
  const firmaName = d.firma || 'Ihr Betrieb', col = d.col || '#0071e3';
  let body = '', title = '';
  if (k) {
    if (r.step === 0) { title = 'Dein Zugang.'; body = inp('E-Mail', 'mail', 'name@beispiel.de', 'email', '', 'email') + inp('Passwort', 'pw', 'mindestens 8 Zeichen', 'password', 'Mindestens 8 Zeichen.', 'new-password') + '<div class="note acc">Dein Aufmaß machst du in der App auch ohne Konto. Das Konto brauchst du erst, wenn du es ins Portal stellst.</div>'; }
    if (r.step === 1) { title = 'Ein paar Angaben zu dir.'; body = inp('Name', 'name', 'Vor- und Nachname', 'text', '', 'name') + '<div class="f2">' + inp('Postleitzahl', 'plz', 'z. B. 50823', 'text', 'Nur für die Entfernung zu Betrieben.', 'postal-code') + inp('Telefon (freiwillig)', 'tel', 'für Rückfragen', 'tel', 'Bekommt nur, wen du freigibst.', 'tel') + '</div>' + chipsF('Wann bist du am besten erreichbar?', 'erreich', ['Vormittags', 'Nachmittags', 'Abends', 'Lieber E-Mail'], true); }
    if (r.step === 2) { title = 'Was Betriebe von dir sehen.'; body = '<div class="card"><div class="kv"><span>Vor Freigabe</span><span>Postleitzahl, Stadtteil, Gebäude, Fenster, Budget, Zeitraum, Aufmaß, Fotos</span><span>Nach Freigabe</span><span>Zusätzlich Name, Telefon, E-Mail, Erreichbarkeit, auf Wunsch die Adresse</span><span>Nie</span><span>Dein Konto, deine anderen Anfragen, deine Entscheidungen zu anderen Betrieben</span></div></div><div class="card">' + sw('Benachrichtigung bei Anklopfen', 'Per E-Mail und in der App', d.push !== false, 'reg-toggle', 'push') + sw('Adresse mit der Freigabe teilen', 'Sonst erst beim Termin', !!d.addr, 'reg-toggle', 'addr') + '</div>' + agree('Ich akzeptiere die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="agb">Nutzungsbedingungen</button> und die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="datenschutz">Datenschutzerklärung</button>.'); }
  } else {
    if (r.step === 1) { title = 'Ihr Betrieb.'; body = inp('Firma', 'firma', 'z. B. Fensterbau Muster GmbH', 'text', 'Steht als Absender in Ihren Aufmaß-Links.', 'organization') + inp('Ansprechpartner', 'ap', 'Vor- und Nachname', 'text', '', 'name') + '<div class="f2">' + inp('E-Mail', 'mail', 'buero@beispiel.de', 'email', '', 'email') + inp('Telefon', 'tel', 'z. B. 0221 123456', 'tel', '', 'tel') + '</div>' + inp('Passwort', 'pw', 'mindestens 8 Zeichen', 'password', 'Mindestens 8 Zeichen.', 'new-password'); }
    if (r.path === 'service' && r.step === 2) { title = 'So sieht Ihr Kunde den Link.'; body = dupNote(d) + '<div class="f2">' + inp('Postleitzahl des Betriebs', 'plz', 'z. B. 51063', 'text', 'Für Rechnung und Einsatzgebiet.', 'postal-code') + '<div class="f"><label>Ihre Farbe</label><div class="colors">' + ['#0071e3', '#1f7a3d', '#a85a00', '#6e3fc2', '#0b7285', '#b3261e'].map((c) => '<button type="button" class="col" data-act="reg-set" data-k="col" data-v="' + c + '" style="background: ' + c + '" aria-label="Farbe ' + c + '" aria-pressed="' + (col === c) + '"></button>').join('') + '</div></div></div><div class="preview"><p class="eyebrow">Erster Bildschirm beim Kunden</p><div class="pv-card"><span class="av" style="background: ' + col + '">' + esc(firmaName.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F') + '</span><span><small>Persönliche Anfrage von</small><b>' + esc(firmaName) + '</b></span></div><p class="pv-t">Deine Fenster. Deine Maße.</p><small class="pv-s">' + esc(firmaName) + ' braucht für dein Angebot die Maße deiner Fenster. Etwa fünf Minuten pro Fenster, jeder Schritt erklärt.</small></div>' + agree('Ich akzeptiere die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="agb">Nutzungsbedingungen für Betriebe</button>. Aufmaße meiner Kunden nutze ich nur für deren Projekt.'); }
    if (r.path === 'portal' && r.step === 2) { title = 'Wo Sie arbeiten.'; body = dupNote(d) + '<div class="f2">' + inp('Straße und Nr.', 'str', 'Musterstraße 1', 'text', '', 'street-address') + inp('Postleitzahl', 'plz', 'z. B. 51063', 'text', '', 'postal-code') + '</div><div class="f"><label for="r-km">Einsatzgebiet: <span id="km-reg">' + (d.km || 35) + '</span> km Umkreis</label><input id="r-km" type="range" min="10" max="100" step="5" value="' + (d.km || 35) + '" data-in="r:km"><small>Anfragen außerhalb sehen Sie nicht. Jederzeit änderbar.</small></div>' + chipsF('Leistungen', 'leist', LEIST, true) + chipsF('Wie viele Projekte im Monat können Sie annehmen?', 'kap', ['bis 3', '4 bis 8', '9 bis 15', 'mehr'], false); }
    if (r.path === 'portal' && r.step === 3) { title = 'Nachweise.'; body = '<div class="note">Nur geprüfte Betriebe sehen Kontaktdaten aus dem Portal. Die Prüfung dauert meist einen Werktag. Bis dahin sehen Sie Anfragen schon, können aber noch nicht anklopfen.</div>' + inp('Umsatzsteuer-ID (freiwillig)', 'ust', 'DE123456789', 'text', 'Für die Netto-Abrechnung.') + '<div class="f' + (e.doc ? ' has-err' : '') + '"><label>Gewerbeanmeldung oder Handwerkskarte</label><button type="button" class="opt" data-act="reg-set" data-k="doc" data-v="ok" aria-pressed="' + (d.doc === 'ok') + '"><span class="pi">' + icon('card', 22) + '</span><span><b>' + (d.doc === 'ok' ? 'Gewerbeanmeldung.pdf hochgeladen' : 'Datei hochladen') + '</b><small>PDF oder Foto. Im Prototyp ein Platzhalter, Tippen genügt.</small></span></button>' + fe('doc') + '</div><div class="card">' + sw('Betriebshaftpflicht vorhanden', 'Wird im Profil angezeigt', !!d.haft, 'reg-toggle', 'haft') + '</div>'; }
    if (r.path === 'portal' && r.step === 4) { title = 'Ihre Bewertungen.'; body = inp('Google-Unternehmensprofil (freiwillig)', 'google', 'Firmenname wie bei Google', 'text', 'Im echten Portal: Anmeldung mit Google, die Bewertungen werden live übernommen und als Google-Bewertungen gekennzeichnet.') + (d.google ? '<div class="card"><div class="row between"><b>' + esc(d.google) + '</b><span class="stars"><span class="starbar"><span class="base">' + STAR.repeat(5) + '</span><span class="fill" style="--w: 94%">' + STAR.repeat(5) + '</span></span>4,7<small>(63)</small></span></div><p class="sub" style="margin-top: 6px">Beispielwerte. Verknüpfung gefunden.</p></div>' : '<p class="sub">Ohne Google-Profil starten Sie als „Neu bei Klopfan“. Bewertungen kommen dann nach abgeschlossenen Aufträgen.</p>'); }
    if (r.path === 'portal' && r.step === 5) { title = 'Wie Sie zahlen möchten.'; body = '<div class="grid c2">' + [['ppk', 'Pro Kontakt · 0 € Grundgebühr', '29 bis 129 € je freigegebenem Kontakt. Aufmaß-Links: 3 frei, dann 9 €. 100 € Startguthaben.'], ['plus', 'Betrieb Plus · 79 € im Monat', '30 % Rabatt auf Kontakte, Aufmaße unbegrenzt, Profil zuerst. Monatlich kündbar.']].map((o) => '<button type="button" class="opt" data-act="reg-set" data-k="konto" data-v="' + o[0] + '" aria-pressed="' + ((d.konto || 'ppk') === o[0]) + '"><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></button>').join('') + '</div>' + chipsF('Zahlungsart', 'pay', ['SEPA-Lastschrift', 'Kreditkarte', 'Rechnung'], false) + '<p class="sub">Abrechnung alle zwei Wochen als Sammelrechnung. Im Prototyp wird nichts berechnet.</p>' + agree('Ich akzeptiere die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="agb">Nutzungsbedingungen für Betriebe</button>. Kontaktdaten nutze ich nur für das angefragte Projekt.'); }
  }
  const total = steps.length - f0, pos = r.step - f0 + 1, last = r.step === steps.length - 1, canFill = !!SAMPLE[regKey(r)];
  const head = k ? 'Konto für Hauseigentümer' : r.path === 'portal' ? 'Fensterbauer mit Portal' : 'Konto für Fensterbauer';
  return { title: head, html: '<div class="wrap narrow"><div class="stepbar"><span style="width: ' + (pos / total * 100) + '%"></span></div><div class="h"><p class="eyebrow">Schritt ' + pos + ' von ' + total + ' · ' + steps[r.step] + '</p><h2>' + title + '</h2>' + (canFill ? '<button type="button" class="fillbtn" data-act="reg-fill">' + icon('play', 13) + 'Nur testen? Beispieldaten einsetzen</button>' : '') + '</div><form class="form" data-form="reg" novalidate>' + body + '</form>' + (Object.keys(e).length ? '<p class="err-sum" role="alert">Bitte die markierten Felder prüfen.</p>' : '') + '<div class="row between formnav"><button type="button" class="btn ghost" data-act="reg-prev">' + (r.step > f0 ? 'Zurück' : 'Abbrechen') + '</button><button type="button" class="btn primary" data-act="reg-next">' + (last ? 'Konto anlegen' : 'Weiter') + '</button></div>' + (r.step === f0 ? '<p class="sub center">Schon ein Konto? <button type="button" class="ulink" data-act="sheet" data-v="login">Anmelden</button>' + (k ? '' : ' · Hauseigentümer? <button type="button" class="ulink" data-act="reg" data-v="kunde">Hier entlang</button>') + '</p>' : '') + '</div>' };
};
function regFinish() {
  const r = S.reg, d = r.d, mail = String(d.mail).trim().toLowerCase();
  if (r.role === 'kunde') {
    const id = 'k' + Date.now().toString(36);
    S.kunden[id] = { id: id, name: d.name.trim(), plz: d.plz.trim(), tel: d.tel || '', mail: mail, erreich: (d.erreich || []).join(', ') || 'keine Angabe', prefs: { push: d.push !== false, addr: !!d.addr, review: true } };
    S.logins[mail] = { role: 'kunde', id: id };
    S.notif[id] = [{ t: 'Willkommen bei Klopfan', s: 'Mach dein erstes Aufmaß mit der App oder probier es mit einem Beispiel.', when: stamp(), new: true, to: ['dash'] }];
    S.reg = null; S._feier = 'willkommen'; return login('kunde', id, 'Willkommen, ' + d.name.trim().split(' ')[0]);
  }
  const id = 'u' + Date.now().toString(36), portal = r.path === 'portal', plz = String(d.plz || '50667').trim();
  S.myCompanies.push({ id: id, plan: r.path, name: d.firma.trim(), plz: plz, rating: d.google ? 4.7 : null, reviews: d.google ? 63 : 0, since: new Date().getFullYear(), team: 1, antwort: 'neu', leist: d.leist || ['Kunststoff'], verified: !portal, col: d.col || '#0071e3', text: d.firma.trim() + ' aus ' + ort(plz) + '. Neu bei Klopfan.' });
  const dup = sameCompany(d);
  S.acc[id] = { plan: r.path, konto: portal ? 'ppk' : 'service', guthaben: portal ? 100 : 0, verified: !portal, einsatz: d.km || 35, ap: d.ap.trim(), mail: mail, tel: d.tel, abzug: { seite: 15, oben: 15 }, prefs: { mail: true, urlaub: false }, kontakte: {}, rechnungen: [], links: [], book: [], freeUsed: 0 };
  if (dup) { S.acc[id].freeQuota = 0; S.acc[id].dupOf = dup; }
  if (portal) { S.acc[id].pay = { type: d.pay || 'SEPA-Lastschrift', label: 'bei der Registrierung angegeben', when: stamp() }; if (d.konto === 'plus') activatePlus(S.acc[id]); }
  S.logins[mail] = { role: 'betrieb', id: id };
  S.notif[id] = [{ t: 'Willkommen bei Klopfan', s: dup ? 'Für ' + dup + ' gibt es schon ein Konto, die kostenlosen Aufmaße wurden dort genutzt. Ab dem ersten Aufmaß brauchen Sie eine Zahlungsart.' : portal ? 'Ihr Nachweis wird geprüft. Projekte und Anfragen sehen Sie schon.' : 'Legen Sie Ihr erstes Projekt an. Die ersten 3 Aufmaße sind kostenlos.', when: stamp(), new: true, to: ['links'] }];
  S.reg = null; S.filt.km = d.km || 35; S._feier = 'willkommen';
  return login('betrieb', id, 'Willkommen, ' + d.ap.trim().split(' ')[0]);
}

/* ---------- Bildschirme: Hauseigentümer ---------- */
function inqCard(x, forKunde) {
  const open = (x.knocks || []).filter((k) => k.status === 'offen').length, frei = (x.knocks || []).filter((k) => k.status === 'frei').length, st = knockStatus(x, S.cur);
  const tone = forKunde ? (open ? 'lead' : frei ? 'ok' : 'acc') : ({ frei: 'ok', offen: 'warn', abgelehnt: 'bad' }[st] || 'acc');
  const tags = [esc(x.material), esc(ZEIT[x.zeit]), x.fotos + ' Fotos'].concat(x.foerd ? ['Förderung'] : [], x.denkmal ? ['Denkmal'] : [], x.status === 'pause' ? ['pausiert'] : [], x.status === 'geloescht' ? ['zurückgezogen'] : []);
  return '<button type="button" class="item lcard st-' + tone + (x.status === 'pause' ? ' paused' : '') + '" data-act="go" data-v="' + (forKunde ? 'inquiry' : 'lead') + '" data-id="' + x.id + '">' +
    '<span class="lcnt"><b>' + x.fenster + '</b><small>' + (x.fenster === 1 ? 'Fenster' : 'Fenster') + '</small></span>' +
    '<span class="tx"><span class="ti">' + esc(GEB[x.geb]) + ' in ' + esc(lage(x.plz)) + '</span>' +
    '<span class="row lmeta">' + winRow(x.windows, x.fenster) + '<span class="bud">' + budgetBar(x.budget) + '<small>' + esc(BUDGET[x.budget]) + '</small></span></span>' +
    '<span class="di">' + tags.join(' · ') + '</span>' +
    (forKunde ? '' : '<span class="rt-m"><span class="kmp">' + icon('pin', 12) + km(BC().plz, x.plz) + ' km</span><b>' + eur(leadPrice(x)) + '</b><span class="badge ' + ({ frei: 'ok', offen: 'warn', abgelehnt: 'bad' }[st] || '') + '">' + ({ frei: 'Kontakt frei', offen: 'angeklopft', abgelehnt: 'abgelehnt' }[st] || 'bei Freigabe') + '</span></span>') +
    (forKunde ? '<span class="row" style="margin-top: 2px">' + (open ? '<span class="badge lead pulse">' + icon('hand', 13) + open + (open === 1 ? ' Betrieb klopft an' : ' Betriebe klopfen an') + '</span>' : '') + (frei ? '<span class="badge ok">' + frei + ' freigegeben</span>' : '') + (!open && !frei ? '<span class="badge">online, wartet</span>' : '') + '</span>' : '') + '</span>' +
    (forKunde ? '' : '<span class="rt"><span class="kmp">' + icon('pin', 12) + km(BC().plz, x.plz) + ' km</span><b>' + eur(leadPrice(x)) + '</b><span class="badge ' + ({ frei: 'ok', offen: 'warn', abgelehnt: 'bad' }[st] || '') + '">' + ({ frei: 'Kontakt frei', offen: 'angeklopft', abgelehnt: 'abgelehnt' }[st] || 'bei Freigabe') + '</span></span>') + CHEV + '</button>';
}
function compCard(c) {
  return '<button type="button" class="item" data-act="go" data-v="firma" data-id="' + c.id + '"><span class="ic av" style="background: ' + c.col + '; color: #fff; border-radius: 16px">' + esc(c.name.slice(0, 1)) + '</span><span class="tx"><span class="ti">' + esc(c.name) + (c.verified ? ' <span class="badge ok">geprüft</span>' : '') + '</span><span class="di">' + stars(c) + ' · ' + esc(ort(c.plz)) + ' · ' + km(K().plz, c.plz) + ' km</span><span class="me">' + esc(c.leist.slice(0, 4).join(' · ')) + (c.antwort !== 'neu' ? ' · antwortet ' + esc(c.antwort) : '') + '</span></span>' + CHEV + '</button>';
}
SCREENS.dash = () => {
  const mine = myInq(), open = openKnocks(), first = K().name.split(' ')[0];
  if (!mine.length) return { html: '<div class="wrap narrow"><div class="h"><p class="eyebrow">Hallo ' + esc(first) + '</p><h2>Dein erstes Aufmaß.</h2><p>So kommt es ins Portal. Drei Schritte, dann klopfen Betriebe aus deiner Nähe an.</p></div>' +
    '<div class="onboard"><div class="ob"><span class="n">1</span><span><b>Fenster mit der App aufmessen</b><small>Zwei Fotos, vier Maße, etwa fünf Minuten pro Fenster.</small></span><a class="btn small primary" href="' + APP_OPEN + '" target="_blank" rel="noopener">App öffnen ' + icon('ext', 14) + '</a></div><div class="ob"><span class="n">2</span><span><b>Aufmaß-Code kopieren</b><small>Steht in der App unter deinem Aufmaßblatt.</small></span></div><div class="ob"><span class="n">3</span><span><b>Hier einfügen und inserieren</b><small>Anonym, mit Postleitzahl, Budget und Zeitraum.</small></span><button type="button" class="btn small ghost" data-act="sheet" data-v="import">Code einfügen</button></div></div>' +
    '<div class="card tryit"><div><p class="eyebrow">Nur ausprobieren?</p><p style="margin: 6px 0 0; color: var(--fg2)">Stell ein Beispiel-Aufmaß ein. Nach ein paar Sekunden klopfen die ersten Betriebe an, und du kannst alles einmal durchspielen.</p></div><button type="button" class="btn primary" data-act="demo-inquiry">Beispiel-Aufmaß inserieren</button></div></div>' };
  const frei = mine.reduce((a, x) => a + (x.knocks || []).filter((k) => k.status === 'frei').length, 0);
  return { html: '<div class="wrap"><div class="h"><p class="eyebrow">Hallo ' + esc(first) + '</p><h2>' + (open ? (open === 1 ? 'Ein Betrieb klopft an.' : open + ' Betriebe klopfen an.') : 'Dein Aufmaß ist online.') + '</h2><p>' + (open ? 'Schau dir Bewertungen und Profile an und entscheide, wer deine Kontaktdaten bekommt. Bis dahin weiß niemand, wer du bist.' : 'Sobald ein Betrieb Interesse hat, siehst du es hier und per E-Mail.') + '</p></div>' +
    '<div class="grid c3 stats">' + stat('acc', 'frame', 'Aufmaße online', mine.length, mine.reduce((a, x) => a + x.fenster, 0) + ' Fenster insgesamt') + stat('lead', 'hand', 'Anklopfer', open, open ? 'warten auf deine Antwort' : 'noch niemand, Betriebe schauen') + stat('ok', 'check', 'Freigegeben', frei, 'höchstens 3 je Projekt') + '</div>' +
    '<section class="sec"><div class="sec-head"><h3>Meine Aufmaße</h3><button type="button" class="btn small soft" data-act="sheet" data-v="import">Aufmaß-Code einfügen</button></div><div class="list">' + mine.map((x) => inqCard(x, true)).join('') + '<a class="item dashed" href="' + APP_OPEN + '" target="_blank" rel="noopener"><span class="ic plusic">' + icon('plus', 24) + '</span><span class="tx"><span class="ti">Weitere Fenster aufmessen</span><span class="di">Öffnet die Klopfan-App. Den Aufmaß-Code fügst du danach hier ein.</span></span>' + icon('ext', 18) + '</a></div></section>' +
    '<section class="sec"><div class="sec-head"><h3>Anbieter in deiner Nähe</h3><button type="button" class="btn small soft" data-act="nav" data-v="anbieter">Alle ansehen</button></div><div class="grid c2 split"><div class="card">' + radarSVG(K().plz, marketCompanies().map((c) => ({ plz: c.plz, col: c.col, ini: c.name.slice(0, 1), title: c.name + ' · ' + km(K().plz, c.plz) + ' km', act: 'go', v: 'firma', id: c.id }))) + '<p class="cap-s">Dein Zuhause in der Mitte, Betriebe im richtigen Abstand. Antippen öffnet das Profil.</p></div><div class="list">' + marketCompanies().sort((a, b) => km(K().plz, a.plz) - km(K().plz, b.plz)).slice(0, 3).map(compCard).join('') + '</div></div></section></div>' };
};
SCREENS.inquiry = () => {
  const x = S.inq.find((i) => i.id === S.sel && i.owner === S.kcur) || myInq()[0]; if (!x) return SCREENS.dash();
  const knocks = x.knocks || [], frei = knocks.filter((k) => k.status === 'frei'), offen = knocks.filter((k) => k.status === 'offen'), abg = knocks.filter((k) => k.status === 'abgelehnt');
  const kcard = (k) => { const c = comp(k.c); return '<div class="card kcard"><div class="row between"><button type="button" class="who" data-act="go" data-v="firma" data-id="' + c.id + '"><span class="av" style="background: ' + c.col + '">' + esc(c.name.slice(0, 1)) + '</span><span><b>' + esc(c.name) + '</b><small>' + esc(ort(c.plz)) + ' · ' + km(x.plz, c.plz) + ' km · seit ' + c.since + '</small></span></button>' + stars(c) + '</div><p class="kt">' + esc(c.text) + '</p><div class="chips">' + c.leist.map((l) => '<span class="badge">' + esc(l) + '</span>').join('') + '</div><p class="km-s">Angeklopft ' + esc(k.when) + (c.antwort !== 'neu' ? ' · antwortet ' + esc(c.antwort) : '') + (c.verified ? ' · Gewerbe geprüft' : '') + '</p>' +
    (k.status === 'offen' ? '<div class="row"><button type="button" class="btn ok" data-act="release" data-id="' + x.id + '" data-c="' + c.id + '"' + (frei.length >= 3 ? ' disabled' : '') + '>' + icon('check', 18) + 'Kontakt freigeben</button><button type="button" class="btn danger" data-act="decline" data-id="' + x.id + '" data-c="' + c.id + '">Nein danke</button><button type="button" class="btn small ghost" data-act="go" data-v="firma" data-id="' + c.id + '">Profil ansehen</button></div>' : k.status === 'frei' ? '<div class="note ok row between"><span>Freigegeben. ' + esc(c.name) + ' hat deine Nummer und E-Mail und meldet sich ' + esc(dot(c.antwort !== 'neu' ? c.antwort : 'bald')) + '</span><button type="button" class="btn small ghost" data-act="revoke" data-id="' + x.id + '" data-c="' + c.id + '">Freigabe zurückziehen</button></div>' : '<div class="note row between"><span>Abgelehnt. Der Betrieb sieht deine Daten nicht.</span>' + (frei.length < 3 && x.status !== 'pause' ? '<button type="button" class="btn small ghost" data-act="release" data-id="' + x.id + '" data-c="' + c.id + '">Doch freigeben</button>' : '') + '</div>') + '</div>'; };
  return { title: 'Mein Aufmaß', html: '<div class="wrap narrow"><div class="h"><p class="eyebrow">' + seit(tage(x)) + ' · anonym' + (x.status === 'pause' ? ' · pausiert' : '') + '</p><h2>' + esc(GEB[x.geb]) + ' in ' + esc(ort(x.plz)) + '</h2><p>' + x.fenster + ' Fenster · ' + esc(x.material) + ' · ' + esc(BUDGET[x.budget]) + ' · ' + esc(ZEIT[x.zeit]) + '</p></div>' +
    (x.status === 'pause' ? '<div class="note warn row between"><span>Pausiert. Betriebe sehen dein Aufmaß gerade nicht.</span><button type="button" class="btn small ghost" data-act="pause" data-id="' + x.id + '">Wieder online stellen</button></div>' : '') +
    (frei.length >= 3 ? '<div class="note warn">Drei Betriebe sind freigegeben, mehr geht nicht. Zieh eine Freigabe zurück, wenn du jemand anderen zulassen willst.</div>' : '') +
    (knocks.length ? '<div class="card knockmap"><div>' + radarSVG(x.plz, knocks.map((k) => { const c = comp(k.c); return { plz: c.plz, col: k.status === 'abgelehnt' ? 'var(--line2)' : c.col, ini: c.name.slice(0, 1), title: c.name, act: 'go', v: 'firma', id: c.id }; }), { min: 8 }) + '</div><div><p class="eyebrow">Wer anklopft</p><p class="kt">' + knocks.filter((k) => k.status !== 'abgelehnt').map((k) => esc(comp(k.c).name) + ' (' + km(x.plz, comp(k.c).plz) + ' km)').join(', ') + '.</p><p class="km-s">Dein Haus ist die Mitte. Bis zur Freigabe sieht keiner deinen Namen.</p></div></div>' : '') +
    (offen.length ? '<section class="sec"><div class="sec-head"><h3>' + offen.length + (offen.length === 1 ? ' Betrieb klopft an' : ' Betriebe klopfen an') + '</h3><span class="sub">Du kannst noch ' + Math.max(0, 3 - frei.length) + ' freigeben</span></div>' + offen.map(kcard).join('') + '</section>' : '') +
    (frei.length ? '<section class="sec"><div class="sec-head"><h3>Freigegeben</h3></div>' + frei.map(kcard).join('') + '</section>' : '') +
    (abg.length ? '<section class="sec"><div class="sec-head"><h3>Abgelehnt</h3></div>' + abg.map(kcard).join('') + '</section>' : '') +
    (!knocks.length ? empty('Noch hat niemand angeklopft.', 'Betriebe im Umkreis sehen dein Aufmaß. Im Schnitt klopfen die ersten innerhalb eines Tages an.') : '') +
    '<section class="sec"><div class="sec-head"><h3>Was Betriebe sehen</h3><span class="sub">ohne Name und Adresse</span></div><div class="card">' + blatt(x) + '</div></section>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="' + (x.status === 'pause' ? 'pause' : 'sheet') + '" data-v="pause" data-id="' + x.id + '">' + (x.status === 'pause' ? 'Wieder online stellen' : 'Pausieren') + '</button><button type="button" class="btn danger" data-act="sheet" data-v="delete" data-id="' + x.id + '">Aufmaß löschen</button></div></div>' };
};
function blatt(x, showContact) {
  const ct = showContact ? contactOf(x) : null;
  return '<div class="kv"><span>Lage</span><span>' + esc(lage(x.plz)) + ' (' + x.plz + ')' + (ct ? ', Adresse beim Termin' : '') + '</span><span>Gebäude</span><span>' + esc(GEB[x.geb]) + (x.baujahr ? ', Baujahr ' + x.baujahr : '') + (x.denkmal ? ', Denkmalschutz' : '') + '</span><span>Umfang</span><span>' + x.fenster + ' Fenster, ' + x.elemente + ' Elemente, Wunsch ' + esc(x.material) + '</span><span>Budget</span><span>' + esc(BUDGET[x.budget]) + (x.foerd ? ', Förderung gewünscht' : '') + '</span><span>Zeitraum</span><span>' + esc(ZEIT[x.zeit]) + '</span><span>Fotos</span><span>' + x.fotos + ' Fotos, innen und außen, mit KI-Auswertung</span></div><p class="eyebrow pos-h">Positionen</p>' +
    x.windows.map((w, i) => '<div class="pos"><span class="ic">' + ICONS.win.replace('<svg', '<svg width="26" height="30"') + '</span><span class="t"><b>Pos. ' + (i + 1) + ' · ' + esc(w.name) + '</b><span>Element ' + mm(w.w) + ' × ' + mm(w.h) + ' mm · Öffnung ' + mm(w.w + 60) + ' × ' + mm(w.h + 40) + ' mm · ' + esc(w.typ) + '</span><small>8 Handmaße, kleinstes Maß zählt · Feinaufmaß vor Fertigung</small></span></div>').join('') + (x.windows.length < x.fenster ? '<p class="km-s">und ' + (x.fenster - x.windows.length) + ' weitere Positionen im Aufmaßblatt</p>' : '') +
    '<p class="eyebrow pos-h">Aus den Fotos gelesen (KI)</p><div class="chips">' + (x.ki || []).map((k) => '<span class="badge">' + esc(k) + '</span>').join('') + '</div>';
}
SCREENS.anbieter = () => {
  const f = S.af, list = marketCompanies().filter((c) => (!f.q || (c.name + ' ' + ort(c.plz) + ' ' + c.leist.join(' ')).toLowerCase().indexOf(f.q.toLowerCase()) >= 0) && (!f.leist || c.leist.indexOf(f.leist) >= 0)).sort((a, b) => (f.sort === 'rating' ? (b.rating || 0) - (a.rating || 0) : f.sort === 'reviews' ? b.reviews - a.reviews : km(K().plz, a.plz) - km(K().plz, b.plz)));
  return { html: '<div class="wrap"><div class="h"><p class="eyebrow">Umkreis ' + esc(ort(K().plz)) + '</p><h2>Fensterbauer in deiner Nähe.</h2><p>Bewertungen kommen aus dem Google-Unternehmensprofil der Betriebe. Du kannst Betriebe auch selbst einladen, dein Aufmaß anzusehen.</p></div>' +
    '<div class="filters fgrid two"><label>Suche<input data-in="af-q" value="' + esc(f.q) + '" placeholder="Name, Ort, Leistung" type="search"></label><label>Sortierung<select data-in="af-sort"><option value="km"' + (f.sort === 'km' ? ' selected' : '') + '>Entfernung</option><option value="rating"' + (f.sort === 'rating' ? ' selected' : '') + '>Bewertung</option><option value="reviews"' + (f.sort === 'reviews' ? ' selected' : '') + '>Anzahl Bewertungen</option></select></label></div>' +
    '<div class="chips scrollchips">' + [''].concat(['Kunststoff', 'Holz', 'Holz-Alu', 'Aluminium', 'Denkmalschutz', 'Rollläden', 'Haustüren']).map((l) => '<button type="button" class="chip" data-act="af-leist" data-v="' + l + '" aria-pressed="' + (f.leist === l) + '">' + (l || 'Alle') + '</button>').join('') + '</div>' +
    '<div class="list">' + (list.length ? list.map(compCard).join('') : empty('Kein Betrieb passt.', 'Andere Suche oder Leistung wählen.', '<button type="button" class="btn small ghost" data-act="af-reset">Filter zurücksetzen</button>')) + '</div></div>' };
};
SCREENS.firma = () => {
  const prev = S.hist.length ? S.hist[S.hist.length - 1] : null, fromInq = prev && prev[0] === 'inquiry' ? myInq().find((i) => i.id === prev[1]) : null;
  const c = comp(S.sel), mine = fromInq || myInq()[0], st = mine && S.role === 'kunde' ? knockStatus(mine, c.id) : null, revs = REVIEWS[c.id] || [];
  return { title: c.name, html: '<div class="wrap narrow"><div class="card fcard"><div class="row between"><div class="row"><span class="av big" style="background: ' + c.col + '">' + esc(c.name.slice(0, 1)) + '</span><div style="min-width: 0"><h2 class="fname">' + esc(c.name) + '</h2><span class="km-s">' + esc(ort(c.plz)) + (S.role === 'kunde' ? ' · ' + km(K().plz, c.plz) + ' km' : '') + ' · seit ' + c.since + ' · ' + c.team + (c.team === 1 ? ' Person' : ' Mitarbeitende') + '</span></div></div>' + stars(c) + '</div><div class="chips">' + (c.verified ? '<span class="badge ok">Gewerbe geprüft</span>' : '<span class="badge warn">Prüfung läuft</span>') + (c.antwort !== 'neu' ? '<span class="badge acc">antwortet ' + esc(c.antwort) + '</span>' : '') + c.leist.map((l) => '<span class="badge">' + esc(l) + '</span>').join('') + '</div><p class="kt">' + esc(c.text) + '</p>' +
    (S.role === 'kunde' && mine ? (st === 'offen' ? '<div class="row"><button type="button" class="btn ok" data-act="release" data-id="' + mine.id + '" data-c="' + c.id + '">' + icon('check', 18) + 'Kontakt freigeben</button><button type="button" class="btn danger" data-act="decline" data-id="' + mine.id + '" data-c="' + c.id + '">Nein danke</button></div>' : st === 'frei' ? '<div class="note ok">Du hast deinen Kontakt freigegeben.</div>' : st === 'abgelehnt' ? '<div class="note">Abgelehnt.</div>' : '<div class="row"><button type="button" class="btn primary" data-act="invite" data-id="' + mine.id + '" data-c="' + c.id + '">Zu meinem Aufmaß einladen</button><span class="km-s">Der Betrieb sieht dein Aufmaß anonym und kann anklopfen.</span></div>') : '') + '</div>' +
    '<section class="sec"><div class="sec-head"><h3>Bewertungen</h3><span class="sub">' + (c.reviews ? c.reviews + ' bei Google, Auswahl' : 'noch keine') + '</span></div>' + (revs.length ? revs.map((r) => '<div class="card rcard"><div class="row between"><b>' + esc(r[0]) + '</b><span class="stars">' + STAR.repeat(r[1]) + '</span></div><p class="kt">' + esc(r[2]) + '</p></div>').join('') : empty('Noch keine Bewertungen.', 'Neue Betriebe sammeln Bewertungen nach abgeschlossenen Aufträgen.')) + '<p class="km-s">Bewertungen werden aus Google übernommen und nicht verändert.</p></section></div>' };
};
SCREENS.notif = () => {
  const list = notifs();
  return { html: '<div class="wrap narrow"><div class="h"><h2>Nachrichten.</h2></div><div class="list">' + (list.length ? list.map((n, i) => '<button type="button" class="item nitem' + (n.new ? ' is-new' : '') + '" data-act="notif-open" data-i="' + i + '"><span class="ic">' + icon('bell', 22) + '</span><span class="tx"><span class="ti">' + esc(n.t) + '</span><span class="di">' + esc(n.s) + '</span><span class="me">' + esc(n.when) + '</span></span>' + (n.new ? '<span class="badge lead">neu</span>' : '') + (n.to ? CHEV : '') + '</button>').join('') : empty('Keine Nachrichten.', 'Hier landet alles, was passiert: Anklopfer, Freigaben, eingegangene Aufmaße.')) + '</div>' + (list.some((n) => n.new) ? '<div><button type="button" class="btn ghost" data-act="read-all">Alle als gelesen markieren</button></div>' : '') + '</div>' };
};
SCREENS.profil = () => {
  const k = K(), p = k.prefs || {};
  return { html: '<div class="wrap narrow"><div class="h"><h2>Dein Profil.</h2><p>Diese Daten bekommt ein Betrieb erst, wenn du ihn freigibst.</p></div><div class="card"><div class="form"><div class="f2"><div class="f"><label for="k-name">Name</label><input id="k-name" data-in="k:name" value="' + esc(k.name) + '"></div><div class="f"><label for="k-plz">Postleitzahl</label><input id="k-plz" data-in="k:plz" value="' + esc(k.plz) + '" inputmode="numeric"></div></div><div class="f2"><div class="f"><label for="k-tel">Telefon</label><input id="k-tel" data-in="k:tel" value="' + esc(k.tel) + '" type="tel"></div><div class="f"><label for="k-mail">E-Mail</label><input id="k-mail" data-in="k:mail" value="' + esc(k.mail) + '" type="email"></div></div><div class="f"><label for="k-erreich">Erreichbarkeit</label><input id="k-erreich" data-in="k:erreich" value="' + esc(k.erreich) + '"></div><small class="km-s">Änderungen werden beim Verlassen eines Feldes gespeichert.</small></div></div>' +
    '<div class="card">' + sw('Benachrichtigung bei Anklopfen', 'E-Mail und App', p.push !== false, 'kpref', 'push') + sw('Adresse mit der Freigabe teilen', 'Sonst erst beim Termin', !!p.addr, 'kpref', 'addr') + sw('Nach Abschluss um Bewertung bitten', 'Für den beauftragten Betrieb', p.review !== false, 'kpref', 'review') + '</div>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="sheet" data-v="demo">Demo wechseln</button><button type="button" class="btn ghost" data-act="logout">Abmelden</button><button type="button" class="btn danger" data-act="sheet" data-v="delacc">Konto löschen</button></div></div>' };
};
/* ---------- Bildschirme: Fensterbauer, Portal ---------- */
function banners() {
  const a = A(); let h = '';
  if (isPortal() && !a.verified) h += '<div class="banner warn"><span><b>Ihr Nachweis wird geprüft.</b> Anfragen sehen Sie schon, anklopfen können Sie nach der Prüfung, meist am nächsten Werktag.</span><button type="button" class="btn small ghost" data-act="verify-demo">Prüfung abschließen (Demo)</button></div>';
  if (a.prefs && a.prefs.urlaub) h += '<div class="banner"><span><b>Urlaubsmodus ist an.</b> Sie bekommen keine neuen Anfragen, und Eigentümer sehen Sie nicht in der Anbieterliste.</span><button type="button" class="btn small ghost" data-act="bpref" data-v="urlaub">Beenden</button></div>';
  return h;
}
SCREENS.markt = () => {
  if (!isPortal()) return SCREENS.links();
  const me = BC(), f = S.filt;
  let list = S.inq.filter((x) => sichtbar(x) && x.owner !== '__' && km(me.plz, x.plz) <= f.km && (!f.budget || x.budget === f.budget) && x.fenster >= (+f.minF || 0) && (!f.zeit || x.zeit === f.zeit) && (!f.q || (lage(x.plz) + ' ' + x.plz + ' ' + x.material).toLowerCase().indexOf(f.q.toLowerCase()) >= 0));
  list = list.sort((a, b) => (f.sort === 'km' ? km(me.plz, a.plz) - km(me.plz, b.plz) : f.sort === 'gross' ? b.fenster - a.fenster : tage(a) - tage(b)));
  const mineK = S.inq.filter((x) => knockStatus(x, me.id) === 'offen').length, frei = S.inq.filter((x) => knockStatus(x, me.id) === 'frei').length, all = S.inq.filter(sichtbar);
  return { html: '<div class="wrap">' + banners() + '<div class="h"><p class="eyebrow">' + esc(me.name) + ' · Umkreis ' + f.km + ' km</p><h2>' + list.length + (list.length === 1 ? ' Anfrage' : ' Anfragen') + ' mit fertigem Aufmaß.</h2><p>Jede Anfrage enthält acht Maße je Fenster, Fotos und KI-Auswertung. Anklopfen ist kostenlos, bezahlt wird nur ein freigegebener Kontakt.</p></div>' +
    '<div class="grid markt-top"><div class="card" style="padding: 14px">' + radarSVG(me.plz, all.map((x) => ({ plz: x.plz, col: knockStatus(x, me.id) === 'frei' ? 'var(--ok)' : knockStatus(x, me.id) === 'offen' ? 'var(--warn)' : 'var(--lead)', ini: String(x.fenster), title: GEB[x.geb] + ' ' + ort(x.plz) + ' · ' + x.fenster + ' Fenster · ' + km(me.plz, x.plz) + ' km', act: 'go', v: 'lead', id: x.id })), { km: f.km }) + '<p class="cap-s">Die Zahl ist die Fensterzahl. Grün: freigegeben, gelb: angeklopft. Den Umkreis ändern Sie unten im Filter.</p></div>' +
    '<div class="col-stack"><div class="ticker"><span class="live"></span><span class="msg" id="ticker"></span></div><div class="grid c2 stats">' + stat('acc', 'pin', 'Im Umkreis', list.length, list.reduce((a, x) => a + x.fenster, 0) + ' Fenster') + stat('warn', 'hand', 'Angeklopft', mineK, 'warten auf Freigabe') + stat('ok', 'people', 'Kontakte', frei, 'freigegeben') + stat('gold', 'coin', 'Guthaben', A().guthaben, A().konto === 'plus' ? 'Betrieb Plus, −30 %' : 'pro Kontakt', 'eur') + '</div></div></div>' +
    '<div class="filters fgrid"><label>Ort oder PLZ<input data-in="f-q" value="' + esc(f.q) + '" placeholder="z. B. Bonn, 53111" type="search"></label><label>Umkreis<span class="range"><input type="range" min="10" max="100" step="5" value="' + f.km + '" data-in="f-km" aria-label="Umkreis in Kilometern"><span id="km-lab">' + f.km + ' km</span></span></label><label>Budget<select data-in="f-budget"><option value="">alle</option>' + Object.keys(BUDGET).map((k) => '<option value="' + k + '"' + (f.budget === k ? ' selected' : '') + '>' + BUDGET[k] + '</option>').join('') + '</select></label><label>Mindestens<select data-in="f-minF">' + [0, 3, 6, 10].map((n) => '<option value="' + n + '"' + (+f.minF === n ? ' selected' : '') + '>' + (n ? 'ab ' + n + ' Fenster' : 'alle Größen') + '</option>').join('') + '</select></label><label>Zeitraum<select data-in="f-zeit"><option value="">alle</option>' + Object.keys(ZEIT).map((k) => '<option value="' + k + '"' + (f.zeit === k ? ' selected' : '') + '>' + ZEIT[k] + '</option>').join('') + '</select></label><label>Sortierung<select data-in="f-sort"><option value="neu"' + (f.sort === 'neu' ? ' selected' : '') + '>Neueste</option><option value="km"' + (f.sort === 'km' ? ' selected' : '') + '>Entfernung</option><option value="gross"' + (f.sort === 'gross' ? ' selected' : '') + '>Größte Projekte</option></select></label></div>' +
    '<div class="list">' + (list.length ? list.map((x) => inqCard(x, false)).join('') : empty('Keine Anfrage passt zu den Filtern.', 'Umkreis vergrößern oder Filter lockern.', '<button type="button" class="btn small ghost" data-act="f-reset">Filter zurücksetzen</button>')) + '</div></div>' };
};
SCREENS.lead = () => {
  const x = S.inq.find((i) => i.id === S.sel) || S.inq.find(sichtbar); if (!x) return SCREENS.markt();
  const me = BC(), st = knockStatus(x, me.id), price = leadPrice(x), others = (x.knocks || []).filter((k) => k.c !== me.id).length, ct = contactOf(x), kon = A().kontakte[x.id] || {};
  if (st === 'frei' && !kon.seen) { A().kontakte[x.id] = Object.assign(kon, { seen: true }); S._feier = 'kontakt'; }
  const contact = st === 'frei' ? '<div class="card okcard"><p class="eyebrow">Kontakt freigegeben</p><div class="kv"><span>Name</span><span>' + esc(ct.name) + '</span><span>Telefon</span><span class="sel">' + esc(ct.tel) + '</span><span>E-Mail</span><span class="sel">' + esc(ct.mail) + '</span><span>Erreichbar</span><span>' + esc(ct.erreich) + '</span><span>Adresse</span><span>teilt der Kunde beim Termin</span></div><div class="row"><button type="button" class="btn small ghost" data-act="copy" data-v="' + esc(ct.name + ', ' + ct.tel + ', ' + ct.mail) + '">' + icon('copy', 16) + 'Kontakt kopieren</button><span class="km-s">Berechnet: ' + eur(paidPrice(x)) + ' netto. Nicht erreichbar? </span>' + (fairAb(x) ? '<span class="km-s">Gutschrift ab dem ' + fairAb(x) + ' möglich.</span>' : '<button type="button" class="ulink" data-act="sheet" data-v="fair" data-id="' + x.id + '">Gutschrift anfragen</button>') + '</div></div>' : '';
  const weg = x.status === 'geloescht', knockBtn = !A().verified || weg ? '<button type="button" class="btn lead big" disabled>Anklopfen</button>' : '<button type="button" class="btn lead big" data-act="knock" data-id="' + x.id + '">Anklopfen<span class="knockwaves"></span></button>';
  const wegNote = weg ? '<div class="note warn">Der Eigentümer hat dieses Aufmaß aus dem Portal genommen.' + (st === 'frei' ? ' Die Kontaktdaten bleiben Ihnen für dieses Projekt erhalten.' : ' Anklopfen ist nicht mehr möglich.') + '</div>' : '';
  return { title: 'Anfrage', html: '<div class="wrap narrow">' + banners() + '<div class="h"><p class="eyebrow">' + km(me.plz, x.plz) + ' km · ' + seit(tage(x)) + ' · ' + (others ? others + ' weitere angeklopft' : 'noch niemand angeklopft') + '</p><h2>' + esc(GEB[x.geb]) + ' in ' + esc(lage(x.plz)) + '</h2><p>' + x.fenster + ' Fenster · ' + esc(x.material) + ' · ' + esc(BUDGET[x.budget]) + ' · ' + esc(ZEIT[x.zeit]) + '</p></div>' + wegNote + contact +
    '<div class="card pricecard"><div class="row between"><div><p class="eyebrow">Kontaktpreis</p><p class="pc">' + eur(price) + ' <small>netto · ' + tierName(x.fenster) + (A().konto === 'plus' ? ' · Plus-Rabatt' : '') + '</small></p></div>' + (st === null ? knockBtn : st === 'offen' ? '<span class="badge warn">Angeklopft, wartet auf Freigabe</span>' : st === 'abgelehnt' ? '<span class="badge bad">Der Kunde hat abgelehnt</span>' : '<span class="badge ok">Freigegeben</span>') + '</div><div class="lock">' + ICONS.lock + '<span>' + (st === 'frei' ? 'Nutzen Sie die Kontaktdaten nur für dieses Projekt.' : !A().verified ? 'Anklopfen geht, sobald Ihr Gewerbenachweis geprüft ist.' : 'Anklopfen ist kostenlos. Berechnet wird nur, wenn der Eigentümer Sie freigibt. Höchstens drei Betriebe bekommen den Kontakt.') + '</span></div>' + (st === 'offen' ? '<button type="button" class="btn small ghost" style="align-self: flex-start" data-act="unknock" data-id="' + x.id + '">Anklopfen zurücknehmen</button>' : '') + '</div>' +
    '<section class="sec"><div class="sec-head"><h3>Aufmaßblatt</h3><span class="sub">Handmaß, 8 Werte je Fenster</span></div><div class="card">' + blatt(x, st === 'frei') + '</div></section>' +
    (st === 'frei' ? '<section class="sec"><div class="sec-head"><h3>Stand</h3></div><div class="card"><div class="pipe">' + [['kontakt', 'Kontakt'], ['termin', 'Termin'], ['angebot', 'Angebot'], ['auftrag', 'Auftrag'], ['verloren', 'Verloren']].map((s) => '<button type="button" data-act="stage" data-id="' + x.id + '" data-v="' + s[0] + '" aria-pressed="' + ((kon.stage || 'kontakt') === s[0]) + '">' + s[1] + '</button>').join('') + '</div><div class="f" style="margin-top: 12px"><label for="note-' + x.id + '">Notiz</label><textarea id="note-' + x.id + '" data-in="note:' + x.id + '" placeholder="z. B. Termin am 21.10. um 10 Uhr">' + esc(kon.note || '') + '</textarea></div></div></section>' : '') + '</div>' };
};
SCREENS.kontakte = () => {
  if (!isPortal()) return SCREENS.links();
  const me = BC(), frei = S.inq.filter((x) => knockStatus(x, me.id) === 'frei'), offen = S.inq.filter((x) => sichtbar(x) && knockStatus(x, me.id) === 'offen'), stageL = { kontakt: 'Kontakt', termin: 'Termin vereinbart', angebot: 'Angebot gesendet', auftrag: 'Auftrag', verloren: 'Verloren' };
  frei.forEach((x) => { A().kontakte[x.id] = Object.assign(A().kontakte[x.id] || { stage: 'kontakt', note: '' }, { seen: true }); });
  return { html: '<div class="wrap"><div class="h"><h2>Ihre Kontakte.</h2><p>Freigegebene Kunden aus dem Portal mit Kontaktdaten und Stand. Aufmaße Ihrer eigenen Kunden finden Sie unter Projekte.</p></div>' +
    '<div class="grid c3 stats">' + stat('ok', 'people', 'Kontakte', frei.length, 'freigegeben, mit Nummer') + stat('warn', 'hand', 'Angeklopft', offen.length, 'warten auf Freigabe') + stat('gold', 'flag', 'Aufträge', frei.filter((x) => (A().kontakte[x.id] || {}).stage === 'auftrag').length, 'aus dem Portal') + '</div>' +
    '<section class="sec"><div class="sec-head"><h3>Freigegeben</h3><span class="sub">' + frei.length + '</span></div><div class="list">' + (frei.length ? frei.map((x) => { const ct = contactOf(x), k = A().kontakte[x.id] || {}, stg = k.stage || 'kontakt'; return '<button type="button" class="item kcard-i st-' + (stg === 'auftrag' ? 'ok' : stg === 'verloren' ? 'bad' : 'acc') + '" data-act="go" data-v="lead" data-id="' + x.id + '"><span class="ic av" style="background: ' + (stg === 'verloren' ? 'var(--line2)' : 'var(--ok)') + '; color: #fff">' + esc(ct.name.slice(0, 1)) + '</span><span class="tx"><span class="ti">' + esc(ct.name) + ' · ' + esc(ort(x.plz)) + '</span><span class="di">' + x.fenster + ' Fenster · ' + esc(BUDGET[x.budget]) + ' · <span class="sel">' + esc(ct.tel) + '</span></span><span class="row lst">' + kstep(stg) + '<span class="badge ' + (stg === 'auftrag' ? 'ok' : stg === 'verloren' ? 'bad' : stg === 'kontakt' ? '' : 'acc') + '">' + esc(stageL[stg]) + '</span>' + (x.status === 'geloescht' ? '<span class="badge">Aufmaß zurückgezogen</span>' : '') + (k.note ? '<small class="me">' + esc(k.note) + '</small>' : '') + '</span></span><span class="rt"><b>' + eur(paidPrice(x)) + '</b><span class="badge ok">berechnet</span></span>' + CHEV + '</button>'; }).join('') : empty('Noch keine Freigabe.', 'Klopfen Sie bei passenden Anfragen an. Sobald Sie ein Eigentümer zulässt, steht er hier.', '<button type="button" class="btn small primary" data-act="nav" data-v="markt">Zu den Anfragen</button>')) + '</div></section>' +
    '<section class="sec"><div class="sec-head"><h3>Angeklopft, wartet</h3><span class="sub">' + offen.length + '</span></div><div class="list">' + (offen.length ? offen.map((x) => inqCard(x, false)).join('') : empty('Nichts offen.', 'Alle Anklopfer sind beantwortet.')) + '</div></section></div>' };
};
/* ---------- Bildschirme: Projekte und Aufmaß-Links ---------- */
const LST = { erstellt: ['Angelegt', ''], gesendet: ['Link gesendet', 'acc'], geoeffnet: ['Link geöffnet', 'warn'], arbeit: ['Kunde misst', 'warn'], eingegangen: ['Aufmaß da', 'ok'], abgelaufen: ['Abgelaufen', 'bad'], deaktiviert: ['Deaktiviert', 'bad'] };
const TL = { erstellt: 'Projekt angelegt', gesendet: 'Link gesendet', geoeffnet: 'Link geöffnet', arbeit: 'Kunde misst', eingegangen: 'Aufmaß eingegangen' };
const TLS = { erstellt: 'Angelegt', gesendet: 'Gesendet', geoeffnet: 'Geöffnet', arbeit: 'Kunde misst', eingegangen: 'Eingegangen' };
const LORDER = ['erstellt', 'gesendet', 'geoeffnet', 'arbeit', 'eingegangen'];
const PGEB = { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Wohnung', gewerbe: 'Gewerbe' };
const PFZ = ['1 bis 2', '3 bis 5', '6 bis 10', 'mehr als 10'];
const PPLAN = ['Fenster', 'Haustür', 'Rollläden', 'Insektenschutz', 'Fensterbänke'];
const linkHash = (l) => '#k-' + l.code + '-' + slug(BC().name) + '.' + b64u(BC().name) + '.' + b64u(l.kunde || '');
const linkURL = (l) => APP_URL + linkHash(l);
const linkOpen = (l) => APP_OPEN + linkHash(l);
function linkMsg(l) {
  if (l.msg) return l.msg;
  const a = A(), c = BC(), u = linkURL(l), who = l.kunde || '', fam = /^Familie\s/i.test(who);
  if (l.du && fam) return 'Hallo ' + who + ', für euer Fensterangebot brauche ich die Maße eurer Fenster. Mit diesem Link messt ihr sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto braucht ihr nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
  if (l.du) return 'Hallo ' + who + ', für dein Fensterangebot brauche ich die Maße deiner Fenster. Mit diesem Link misst du sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto brauchst du nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
  return 'Guten Tag ' + who + ', für Ihr Fensterangebot brauchen wir die Maße Ihrer Fenster. Mit diesem Link messen Sie sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto brauchen Sie nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
}
const isPhone = (s) => !/@/.test(s || '') && String(s || '').replace(/\D/g, '').length >= 7;
const intl = (s) => { let d = String(s || '').replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); else if (d.startsWith('0')) d = '49' + d.slice(1); return d; };
const placeOf = (l) => { const t = String(l.adresse || ''), m = /\d{5}\s+(.+)$/.exec(t); return m ? m[1] : t.split(',').pop().trim(); };
const projFacts = (l) => [PGEB[l.geb], l.fz ? 'ca. ' + l.fz + ' Fenster' : '', (l.plan || []).join(', ')].filter(Boolean).join(' · ');
function projCard(l) {
  const dead = ['abgelaufen', 'deaktiviert'].includes(l.status), done = l.status === 'eingegangen', m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : (LST[l.status] || LST.erstellt), wins = done && l.aufmass ? l.aufmass.windows : [];
  const bis = parseDE(l.expires), restT = bis ? Math.max(0, Math.ceil((bis - Date.now()) / 864e5)) : 0;
  const vis = done && wins.length ? winStack(wins, 40) : l.status === 'arbeit' ? ring(l.progress, 4) : '<span class="pini ' + l.status + '">' + icon(dead ? 'lock' : l.status === 'erstellt' ? 'link' : l.status === 'geoeffnet' ? 'open' : 'send', 26) + (['gesendet', 'geoeffnet'].includes(l.status) ? '<i class="live"></i>' : '') + '</span>';
  const small = l.status === 'arbeit' ? l.progress + ' von 4 Maßen' : done ? (l.log || {}).eingegangen || '' : dead ? '' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? 'über ' + esc(l.via) : 'Link noch nicht verschickt';
  const right = done ? '<span class="rt"><b>' + nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '<span class="rt"><span class="badge bad">' + m[0] + '</span></span>' : '<span class="rt"><b>' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + '</b><small>Link gültig</small></span>';
  return '<button type="button" class="item pcard st-' + (l.locked ? 'locked' : l.status) + (done && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '">' + (done && !l.seen ? '<span class="neu">Neu</span>' : '') + '<span class="pvis">' + vis + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : '', l.nr].filter(Boolean).join(' · ')) + '</span><span class="row lst">' + stepDots(l) + '<span class="badge ' + m[1] + '">' + m[0] + '</span>' + (small ? '<small class="me">' + small + '</small>' : '') + '</span>' + (done ? '<span class="rt-m"><b>' + nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '' : '<span class="rt-m"><small class="me">Link noch ' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + ' gültig</small></span>') + '</span>' + right + CHEV + '</button>';
}
function linkItem(l) {
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : (LST[l.status] || LST.erstellt), prog = l.status === 'arbeit' ? '<span class="mprog"><span style="width: ' + (l.progress / 4 * 100) + '%"></span></span><small>' + l.progress + ' von 4 Maßen</small>' : '';
  const right = l.status === 'eingegangen' && l.aufmass ? '<span class="rt"><b>' + nW(l.aufmass.windows.length, 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? '<span class="rt"><span class="badge">' + esc(l.via) + '</span></span>' : '';
  return '<button type="button" class="item litem' + (l.status === 'eingegangen' && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '"><span class="ic av" style="background: ' + (l.status === 'eingegangen' ? 'var(--ok)' : 'var(--surface2)') + '; color: ' + (l.status === 'eingegangen' ? '#fff' : 'var(--fg2)') + '">' + esc((l.kunde || '?').replace(/^(Beispiel:\s*)?(Herr|Frau|Familie)\s+/, '').slice(0, 1)) + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : '', l.nr].filter(Boolean).join(' · ')) + '</span><span class="row lst"><span class="badge ' + m[1] + '">' + m[0] + '</span>' + prog + '</span></span>' + right + CHEV + '</button>';
}
SCREENS.links = () => {
  const a = A(), L = a.links, open = L.filter((l) => ['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)), rec = L.filter((l) => l.status === 'eingegangen');
  const shown = S.lfilt === 'offen' ? open : S.lfilt === 'eingegangen' ? rec : L, order = (l) => ({ eingegangen: l.seen ? 2 : 0, arbeit: 1, geoeffnet: 1, gesendet: 3, erstellt: 3 }[l.status] || 4);
  const fl = a.konto === 'plus' ? '∞' : String(freeLeft(a));
  if (!L.length) return { html: '<div class="wrap narrow">' + banners() + payBanner() + '<div class="h"><p class="eyebrow">' + esc(BC().name) + '</p><h2>Ihr erstes Projekt.</h2><p>Für einen Kunden, den Sie schon haben: Projekt anlegen, Aufmaß-Link schicken, und das Aufmaß kommt zu Ihnen zurück.</p></div>' +
    '<div class="card hero-link"><div class="hl-steps"><div><span class="n">1</span><b>Projekt anlegen</b><small>Kunde und ein paar Eckdaten.</small></div><div><span class="n">2</span><b>Link schicken</b><small>WhatsApp, SMS oder E-Mail.</small></div><div><span class="n">3</span><b>Aufmaß bekommen</b><small>Maße, Fotos und Wünsche je Fenster.</small></div></div><div class="row"><button type="button" class="btn primary big" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Erstes Projekt anlegen</button><button type="button" class="btn ghost big" data-act="demo-project">Beispiel ansehen</button></div><p class="km-s">' + (a.konto === 'plus' ? 'Mit Betrieb Plus unbegrenzt.' : 'Die ersten 3 Aufmaße sind kostenlos, danach 9 € netto je eingegangenem Aufmaß. Ihr Kunde zahlt nichts.') + '</p></div></div>' };
  return { html: '<div class="wrap">' + banners() + payBanner() + '<div class="h hrow"><div><p class="eyebrow">' + esc(BC().name) + '</p><h2>Projekte.</h2><p>Ein Projekt je Kunde. Den Aufmaß-Link schicken Sie direkt aus dem Projekt.</p></div><button type="button" class="btn primary big" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Neues Projekt</button></div>' +
    '<div class="grid c3 stats">' + stat('warn', 'send', 'Offen', open.length, open.length ? 'Link verschickt, Kunde misst noch' : 'alle Links sind erledigt') + stat('ok', 'inbox', 'Eingegangen', rec.length, rec.reduce((s, l) => s + (l.aufmass ? l.aufmass.windows.length : 0), 0) + ' Positionen mit Fotos') + stat('acc', 'gift', 'Noch kostenlos', fl, a.konto === 'plus' ? 'Betrieb Plus' : a.pay ? 'danach 9 € je Aufmaß' : 'danach mit Zahlungsart') + '</div>' +
    '<div class="row between">' + seg([['alle', 'Alle', L.length], ['offen', 'Offen', open.length], ['eingegangen', 'Eingegangen', rec.length]], S.lfilt, 'lfilt') + '<button type="button" class="btn small ghost" data-act="sheet" data-v="linkimport">Code vom Kunden einfügen</button></div>' +
    '<div class="list plist">' + (shown.length ? shown.slice().sort((x, y) => order(x) - order(y)).map(projCard).join('') : empty(S.lfilt === 'eingegangen' ? 'Noch nichts eingegangen.' : 'Keine offenen Projekte.', S.lfilt === 'eingegangen' ? 'Sobald ein Kunde sein Aufmaß abschickt, steht es hier.' : 'Alle verschickten Links sind erledigt.')) + '</div></div>' };
};
SCREENS.newlink = () => {
  const n = S.nl || (S.nl = { step: 0, kunde: '', kontakt: '', adresse: '', geb: '', fz: '', plan: ['Fenster'], note: '', days: 14, du: false, err: {} }), e = n.err || {}, c = BC(), a = A(), st = n.step || 0;
  const fake = { kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du };
  const one = (k, v, label) => '<button type="button" class="chip small" data-act="nl-set" data-k="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (n[k] === v) + '">' + esc(label) + '</button>';
  let body, nav;
  if (!st) {
    body = '<div class="f' + (e.kunde ? ' has-err' : '') + '"><label for="nl-kunde">Name des Kunden</label><input id="nl-kunde" data-in="nl:kunde" value="' + esc(n.kunde) + '" placeholder="z. B. Familie Weber" autocomplete="off">' + (e.kunde ? '<small class="err">' + esc(e.kunde) + '</small>' : '<small>Steht als Anrede in der Nachricht.</small>') + '</div>' +
      '<div class="f"><label for="nl-kontakt">Handynummer oder E-Mail</label><input id="nl-kontakt" data-in="nl:kontakt" value="' + esc(n.kontakt) + '" placeholder="z. B. 0171 2345678" autocomplete="off"><small>Freiwillig. Dann geht der Link gleich per WhatsApp, SMS oder E-Mail raus.</small></div>' +
      '<div class="f"><label>Anrede in der Nachricht</label>' + seg([['sie', 'Sie'], ['du', 'Du']], n.du ? 'du' : 'sie', 'nl-du') + '</div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="back">Abbrechen</button><button type="button" class="btn primary" data-act="nl-next">Weiter</button></div>';
  } else {
    body = '<div class="f"><label for="nl-adresse">Objektadresse</label><input id="nl-adresse" data-in="nl:adresse" value="' + esc(n.adresse) + '" placeholder="z. B. Lindenstraße 14, 50823 Köln" autocomplete="off"></div>' +
      '<div class="f"><label>Gebäude</label><div class="chips">' + Object.keys(PGEB).map((k) => one('geb', k, PGEB[k])).join('') + '</div></div>' +
      '<div class="f"><label>Wie viele Fenster ungefähr?</label><div class="chips">' + PFZ.map((v) => one('fz', v, v)).join('') + '</div></div>' +
      '<div class="f"><label>Was ist geplant?</label><div class="chips">' + PPLAN.map((v) => '<button type="button" class="chip small" data-act="nl-plan" data-v="' + v + '" aria-pressed="' + ((n.plan || []).indexOf(v) >= 0) + '">' + v + '</button>').join('') + '</div></div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="nl-prev">Zurück</button><button type="button" class="btn primary" data-act="nl-create">' + icon('link', 18) + 'Projekt anlegen</button></div><p class="km-s">' + (a.konto === 'plus' ? 'Betrieb Plus: Aufmaße unbegrenzt.' : 'Bezahlt wird nur ein eingegangenes Aufmaß. Noch ' + freeLeft(a) + ' kostenlos.') + '</p>';
  }
  return { title: 'Neues Projekt', html: '<div class="wrap"><div class="nl-grid"><div><div class="stepbar"><span style="width: ' + (st ? 100 : 50) + '%"></span></div><div class="h"><p class="eyebrow">Schritt ' + (st + 1) + ' von 2 · ' + (st ? 'Eckdaten' : 'Kunde') + '</p><h2>' + (st ? 'Ein paar Eckdaten.' : 'Für wen ist das Projekt?') + '</h2><p>' + (st ? 'Alles freiwillig, hilft beim Angebot. Später im Projekt änderbar.' : 'Ein Projekt je Kunde. Der Aufmaß-Link kommt im nächsten Schritt.') + '</p></div><div class="card"><form class="form" data-form="nl" novalidate>' + body + nav + '</form></div></div>' +
    '<div class="pv"><p class="eyebrow">So kommt die Nachricht an</p><div class="phone small"><div class="ph-top"><span class="ph-av" style="background: ' + c.col + '">' + esc(c.name.slice(0, 1)) + '</span><span><b>' + esc(c.name) + '</b><small>Nachricht</small></span></div><div class="ph-body"><div class="bub out show" id="pv-msg">' + pvHTML(fake) + '</div></div></div><p class="km-s">Den Text können Sie nach dem Anlegen noch ändern.</p></div></div></div>' };
};
const pvHTML = (fake) => esc(linkMsg(fake)).replace(/\n/g, '<br>').replace(/https?:\/\/\S+/, '<span class="lp"><b>Klopfan · Aufmaß für ' + esc(BC().name) + '</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span>');
function pvUpdate() { const el = document.getElementById('pv-msg'), n = S.nl; if (el && n) el.innerHTML = pvHTML({ kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du }); }
function aufmassText(l) {
  const am = l.aufmass || {}, pr = am.proj || {}, ab = A().abzug || { seite: 15, oben: 15 }, out = [];
  out.push('Aufmaß · ' + l.kunde + (l.nr ? ' · ' + l.nr : ''), [l.adresse, AW.lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')].filter(Boolean).join(' · '), 'Eingegangen: ' + ((l.log || {}).eingegangen || '') + ' · Zeitraum: ' + AW.lab('zeit', pr.zeit) + ' · Budget: ' + AW.lab('budget', pr.budget));
  if (pr.notiz) out.push('Nachricht vom Kunden: ' + pr.notiz);
  out.push('');
  (am.windows || []).forEach((w, i) => {
    const d = AW.derive(w);
    out.push('Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster') + ' · ' + (AW.num(w.anzahl) || 1) + ' Stück');
    AW.rows(w).forEach((r) => out.push('  ' + r[0] + ': ' + r[1]));
    if (d.moW && d.moH) out.push('  Bestellmaß-Vorschlag: ' + AW.th(d.moW - 2 * ab.seite) + ' × ' + AW.th(d.moH - ab.oben) + ' mm');
    AW.kiRows(w).forEach((r) => out.push('  Foto, ' + r[0] + ': ' + r[1]));
    out.push('');
  });
  out.push('Erfasst mit Klopfan. Vor der Fertigung Feinaufmaß vor Ort.');
  return out.join('\n');
}
const LSEEN = {};
SCREENS.link = () => {
  const a = A(), l = a.links.find((x) => x.id === S.sel); if (!l) return SCREENS.links();
  if (l.status === 'eingegangen' && !l.seen) l.seen = true;
  const lkey = l.status + ':' + l.progress, fresh = LSEEN[l.id] !== undefined && LSEEN[l.id] !== lkey; LSEEN[l.id] = lkey;
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : LST[l.status], idx = LORDER.indexOf(l.status), done = l.status === 'eingegangen', dead = ['abgelaufen', 'deaktiviert'].includes(l.status), u = linkURL(l), msg = linkMsg(l), phone = isPhone(l.kontakt), mail = /@/.test(l.kontakt || '');
  const cur = dead ? null : (done ? 'eingegangen' : LORDER[Math.max(0, idx)]);
  const tl = '<ol class="tlh">' + LORDER.map((s, i) => '<li class="' + (i < idx || done ? 'done' : i === idx ? 'now' : '') + (fresh && (i === idx || (done && i === LORDER.length - 1)) ? ' fresh' : '') + '"><span class="dot"></span><small>' + TLS[s] + '</small><small class="ts">' + esc((l.log || {})[s] || '') + '</small></li>').join('') + '</ol>' +
    '<p class="km-s tl-now">' + (dead ? esc(m[0]) + '.' : cur ? '<b>' + TL[cur] + (cur === 'arbeit' ? ' · ' + l.progress + ' von 4 Maßen' : '') + '</b>' + ((l.log || {})[cur] ? ' · ' + esc(l.log[cur]) : '') + (l.via && idx >= 1 ? ' · über ' + esc(l.via) : '') : '') + '</p>';
  const share = '<div class="card sharecard"><div class="row between"><p class="eyebrow">Aufmaß-Link schicken</p><span class="km-s">gilt bis ' + esc(l.expires) + '</span></div><div class="linkbox"><code class="sel" id="lnk">' + esc(u) + '</code><button type="button" class="btn small soft" data-act="l-share" data-v="link" data-id="' + l.id + '">' + icon('copy', 16) + 'Kopieren</button></div>' +
    '<div class="share"><a class="sbtn wa" href="https://wa.me/' + (phone ? intl(l.kontakt) : '') + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener" data-act="l-share" data-v="WhatsApp" data-id="' + l.id + '">' + ICONS.wa + '<span>WhatsApp</span></a><a class="sbtn" href="sms:' + (phone ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="SMS" data-id="' + l.id + '">' + ICONS.sms + '<span>SMS</span></a><a class="sbtn" href="mailto:' + (mail ? esc(l.kontakt) : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="E-Mail" data-id="' + l.id + '">' + ICONS.mail + '<span>E-Mail</span></a><button type="button" class="sbtn" data-act="l-share" data-v="Text" data-id="' + l.id + '">' + ICONS.copy + '<span>Text kopieren</span></button></div>' +
    '<div class="f"><label for="lmsg">Nachricht</label><textarea id="lmsg" rows="4" data-in="lmsg:' + l.id + '">' + esc(msg) + '</textarea><div class="row between"><span class="row" style="gap: 8px">' + seg([['sie', 'Sie'], ['du', 'Du']], l.du ? 'du' : 'sie', 'l-du') + seg([['7', '7 Tage'], ['14', '14 Tage'], ['30', '30 Tage']], String(l.days || 14), 'l-days') + '</span>' + (l.msg ? '<button type="button" class="linkbtn" data-act="l-reset-msg" data-id="' + l.id + '">Text zurücksetzen</button>' : '') + '</div></div>' +
    '<p class="km-s">' + (l.kontakt ? 'Kontakt: <span class="sel">' + esc(l.kontakt) + '</span>. ' : 'Ohne Nummer öffnet WhatsApp die Kontaktauswahl. ') + 'SMS und E-Mail öffnen Ihr Programm, falls das Gerät es erlaubt; sonst den Text kopieren.</p></div>';
  let result = '';
  if (done && l.aufmass) {
    const am = l.aufmass, pr = am.proj || {}, wins = am.windows || [], tot = AW.num(pr.total) || 0;
    result = '<section class="sec"><div class="sec-head"><h3>Aufmaß</h3><span class="sub">' + nW(wins.length, 'Position', 'Positionen') + ' · ' + nW(am.elemente || wins.length, 'Element', 'Elemente') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div>' +
      '<div class="card amhead"><div class="kv"><span>Gebäude</span><span>' + esc((AW.lab('gebaeude', pr.gebaeude) || PGEB[l.geb] || '–') + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')) + '</span><span>Zeitraum</span><span>' + esc(AW.lab('zeit', pr.zeit) || '–') + '</span><span>Budget</span><span>' + esc((AW.lab('budget', pr.budget) || '–') + (pr.foerd ? ', Förderung gewünscht' : '')) + '</span><span>Lüftung</span><span>' + (tot && (am.elemente || wins.length) > tot / 3 ? 'Mehr als ein Drittel der Fenster: Lüftungskonzept nach DIN 1946-6 prüfen' : tot ? (am.elemente || wins.length) + ' von ' + tot + ' Fenstern im Haus' : '–') + '</span>' + (pr.notiz ? '<span>Nachricht</span><span class="amnote">„' + esc(pr.notiz) + '“</span>' : '') + '</div><div class="row amacts"><button type="button" class="btn small primary" data-act="pdf-am" data-id="' + l.id + '">' + icon('dl', 16) + 'PDF herunterladen</button><button type="button" class="btn small soft" data-act="copy-am" data-id="' + l.id + '">' + icon('copy', 16) + 'Als Text kopieren</button></div></div>' +
      '<div class="row between poshead"><span class="eyebrow">Positionen</span><button type="button" class="linkbtn" data-act="pos-all">Alle aufklappen</button></div><div class="poslist">' + wins.map((w, i) => posCard(w, i, a.abzug, false)).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-head"><h3>Stand</h3></div><div class="card"><div class="pipe">' + [['neu', 'Neu'], ['angebot', 'Angebot'], ['termin', 'Feinaufmaß'], ['auftrag', 'Auftrag'], ['verloren', 'Verloren']].map((s) => '<button type="button" data-act="l-stage" data-id="' + l.id + '" data-v="' + s[0] + '" aria-pressed="' + ((l.stage || 'neu') === s[0]) + '">' + s[1] + '</button>').join('') + '</div><div class="f" style="margin-top: 12px"><label for="lmemo">Notiz zum Stand</label><textarea id="lmemo" data-in="lmemo:' + l.id + '" placeholder="z. B. Angebot bis Freitag">' + esc(l.memo || '') + '</textarea></div></div></section>';
  }
  const pdata = '<details class="card fold"><summary><span>Projektdaten<small>' + esc([l.kontakt, placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Kontakt, Objekt, Eckdaten, interne Notiz') + '</small></span></summary><div class="fold-body"><div class="kv"><span>Kunde</span><span>' + esc(l.kunde) + '</span><span>Kontakt</span><span>' + (l.kontakt ? '<span class="sel">' + esc(l.kontakt) + '</span>' : '–') + '</span><span>Objekt</span><span>' + esc(l.adresse || '–') + '</span><span>Eckdaten</span><span>' + esc(projFacts(l) || '–') + '</span><span>Link</span><span>' + (dead ? esc(m[0]) : 'gültig bis ' + esc(l.expires)) + ', Anrede ' + (l.du ? 'Du' : 'Sie') + '</span></div><div class="f" style="margin-top: 12px"><label for="pnote">Interne Notiz</label><textarea id="pnote" data-in="pnote:' + l.id + '" placeholder="Sieht nur Ihr Team">' + esc(l.note || '') + '</textarea></div></div></details>';
  return { title: l.kunde, html: '<div class="wrap narrow"><div class="h"><p class="eyebrow">' + (l.demo ? 'Beispielprojekt' : 'Projekt ' + esc(l.nr || '')) + ' · angelegt ' + esc(l.created) + '</p><h2>' + esc(l.kunde) + '</h2><p>' + esc([placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Ohne Eckdaten') + '</p><div class="row"><span class="badge ' + m[1] + (fresh ? ' pop' : '') + '">' + m[0] + '</span>' + (l.via ? '<span class="badge">über ' + esc(l.via) + '</span>' : '') + '</div></div>' +
    (S.justCreated === l.id ? '<div class="card created"><span class="burst-ok">' + icon('check', 30) + '</span><div><b>Projekt angelegt.</b><span>Jetzt den Aufmaß-Link an ' + esc(l.kunde) + ' schicken.</span></div></div>' : '') +
    (done ? (l.locked ? lockCard(l, a) : result) : '') + (!done && !dead ? share : '') +
    '<section class="sec"><div class="sec-head"><h3>Verlauf</h3></div><div class="card tlcard">' + tl + '</div></section>' + pdata +
    '<div class="row">' + (!done && !dead ? '<button type="button" class="btn ghost" data-act="l-sim" data-id="' + l.id + '">' + icon('play', 16) + 'Demo: Kunde füllt aus</button>' : '') + (!dead ? '<a class="btn ghost" href="' + linkOpen(l) + '" target="_blank" rel="noopener">Als Kunde öffnen ' + icon('ext', 15) + '</a>' : '') + (!done && !dead ? '<button type="button" class="btn danger" data-act="sheet" data-v="deact" data-id="' + l.id + '">Link deaktivieren</button>' : '') + (done || dead ? '<button type="button" class="btn ghost" data-act="l-again" data-id="' + l.id + '">' + (dead ? 'Neuen Link für ' : 'Weiteres Projekt für ') + esc(l.kunde.replace(/^Beispiel:\s*/, '')) + '</button>' : '') + '</div>' +
    '<p class="km-s">„Als Kunde öffnen“ zeigt die Klopfan-App so, wie Ihr Kunde sie sieht' + (LOCAL ? ' (die Datei Klopfan-App.html muss im selben Ordner liegen)' : '') + '. Im Prototyp ohne Server schickt Ihr Kunde nach dem Absenden einen Übermittlungscode, den Sie über „Code vom Kunden einfügen“ übernehmen.</p></div>' };
};

/* ---------- Bildschirme: Abrechnung und Betrieb ---------- */
SCREENS.abrechnung = () => {
  const a = A(), portal = isPortal(), ch = (a.charges || []), live = ch.filter((c) => c.status !== 'gutschrift'), book = ledger(a), rec = receivedLinks(), wait = lockedLinks(a);
  const nextInv = live.reduce((s, c) => s + c.betrag - c.credit, 0) + book.filter((b) => b.status === 'offen').reduce((s, b) => s + b.betrag, 0);
  const row = (t, sub, amount, badge, cls) => '<div class="lrow"><span class="lt"><b>' + esc(t) + '</b><small>' + esc(sub) + '</small></span><span class="la"><b>' + amount + '</b><span class="badge ' + (cls || '') + '">' + esc(badge) + '</span></span></div>';
  const chRows = ch.map((c) => row(c.text, c.when + ' · ' + c.umfang, eur(c.betrag), c.status === 'gutschrift' ? 'gutgeschrieben' : c.credit >= c.betrag ? 'aus Guthaben' : c.credit > 0 ? eur(c.credit) + ' aus Guthaben' : 'nächste Rechnung', c.status === 'gutschrift' ? 'acc' : c.credit >= c.betrag ? 'ok' : 'warn'));
  const waitRows = wait.map((l) => row('Aufmaß · ' + l.kunde, ((l.log || {}).eingegangen || '') + ' · wartet auf Zahlungsart', eur(LINK_PRICE), 'gesperrt', 'bad'));
  const bookRows = book.map((b) => row(b.text, b.sub || b.when, eur(b.betrag), b.badge, b.betrag ? 'warn' : 'ok'));
  const inv = a.rechnungen.map((r) => row('Sammelrechnung ' + r.nr, r.datum + ' · ' + r.pos + ' Positionen', eur(r.betrag), r.status, 'ok'));
  const all = waitRows.concat(bookRows, chRows, inv), q = freeQuota(a);
  const plans = portal ? [['ppk', 'Pro Kontakt · keine Grundgebühr', 'Aufmaße: 3 frei, danach 9 €. Portal-Kontakte 29 bis 129 € je Freigabe.'], ['plus', 'Betrieb Plus · 79 € im Monat', 'Aufmaße unbegrenzt, Portal-Kontakte 30 % günstiger, Profil zuerst (gekennzeichnet). Monatlich kündbar.']] : [['service', 'Start · keine Grundgebühr', '3 Aufmaße frei, danach 9 € netto je eingegangenem Aufmaß.'], ['plus', 'Betrieb Plus · 79 € im Monat', 'Aufmaße unbegrenzt, Ihr Logo und Ihre Farbe beim Kunden, Team und Statistik. Monatlich kündbar.']];
  const payCard = '<div class="card paycard"><div class="row between" style="align-items: center; flex-wrap: nowrap"><span style="min-width: 0"><p class="eyebrow">Zahlungsart</p><b>' + (a.pay ? esc(a.pay.type) + ' · ' + esc(a.pay.label) : 'Noch keine hinterlegt') + '</b><small>' + (a.pay ? 'Abbuchung alle zwei Wochen als Sammelrechnung.' : 'Nötig ab dem ersten kostenpflichtigen Aufmaß. Bis dahin wird nichts abgebucht.') + '</small></span><button type="button" class="btn small ' + (a.pay ? 'ghost' : 'primary') + '" data-act="sheet" data-v="pay">' + (a.pay ? 'Ändern' : 'Hinterlegen') + '</button></div></div>';
  const freeStat = a.konto === 'plus' ? '∞' : (a.freeUsed || 0) + ' / ' + q;
  return { html: '<div class="wrap">' + payBanner() + '<div class="h"><h2>Abrechnung.</h2><p>' + (portal ? 'Sie zahlen eingegangene Aufmaße und freigegebene Portal-Kontakte, netto, alle zwei Wochen als Sammelrechnung. Das Startguthaben wird zuerst verrechnet.' : 'Keine Grundgebühr, kein Abo. Die ersten 3 Aufmaße sind kostenlos, danach 9 € netto je eingegangenem Aufmaß. Ihr Kunde zahlt nichts.') + (a.dupOf ? ' Die kostenlosen Aufmaße für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : '') + '</p></div>' +
    '<div class="grid c3 stats">' + (portal ? stat('gold', 'coin', 'Guthaben', a.guthaben, 'vom Startguthaben', 'eur') + stat('ok', 'inbox', 'Aufmaße', rec.length, 'eingegangen') : stat('ok', 'inbox', 'Aufmaße', rec.length, 'eingegangen') + stat('acc', 'gift', 'Kostenlos', freeStat, a.konto === 'plus' ? 'Betrieb Plus' : 'genutzt')) + stat(nextInv ? 'warn' : 'acc', 'euro', 'Nächste Rechnung', nextInv, nextInv ? 'netto, bisher' : 'nichts offen', 'eur') + '</div>' + payCard +
    '<section class="sec"><div class="sec-head"><h3>Kontomodell</h3><button type="button" class="linkbtn" data-act="go" data-v="preise">Alle Preise ›</button></div><div class="grid c2">' + plans.map((o) => '<button type="button" class="opt" data-act="konto" data-v="' + o[0] + '" aria-pressed="' + ((a.konto === 'plus' ? 'plus' : portal ? 'ppk' : 'service') === o[0]) + '"><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></button>').join('') + '</div>' +
    (a.downgrade ? '<p class="km-s">Wechsel zu ' + (a.downgrade.to === 'ppk' ? 'Pro Kontakt' : 'Start') + ' zum ' + esc(a.downgrade.at) + ' vorgemerkt. Bis dahin bleibt Betrieb Plus aktiv. <button type="button" class="linkbtn" data-act="konto" data-v="plus">Plus behalten</button></p>' : a.konto === 'plus' ? '<p class="km-s">Betrieb Plus ist für ' + esc(monthLabel()) + ' gebucht. Ein Wechsel gilt zum Monatsende; gebuchte Positionen bleiben, wie sie sind.</p>' : '') + '</section>' +
    (portal ? '' : '<div class="card upsell"><div><p class="eyebrow">Zusätzlich: Portal</p><p style="margin: 6px 0 0; color: var(--fg2)">Anonyme Aufmaße von Hauseigentümern aus Ihrer Region. Anklopfen ist kostenlos, ein Kontakt kostet 29 bis 129 €, nur wenn der Eigentümer Sie freigibt.</p></div><button type="button" class="btn primary" data-act="sheet" data-v="upgrade">Portal freischalten</button></div>') +
    '<section class="sec"><div class="sec-head"><h3>Positionen</h3></div>' + (all.length ? '<div class="card ledger">' + all.join('') + '</div><p class="km-s">Gebucht wird beim Eingang eines Aufmaßes, zum dann gültigen Tarif. Projekte löschen oder den Tarif wechseln ändert gebuchte Positionen nicht.</p>' : empty('Noch keine Positionen.', 'Sobald ein Aufmaß eingeht' + (portal ? ' oder ein Eigentümer Sie freigibt' : '') + ', steht es hier.')) + '</section>' +
    (portal ? '<div class="note">Fair-Regel: Ist ein freigegebener Kunde sieben Tage lang nicht erreichbar, fragen Sie in der Anfrage eine Gutschrift an. Der Kontakt wird dann nicht berechnet, verrechnetes Guthaben kommt zurück.</div>' : '') + '</div>' };
};
const abEx = (ab) => 'Beispiel: Öffnung 1.260 × 1.440 mm ergibt ' + AW.th(1260 - 2 * ab.seite) + ' × ' + AW.th(1440 - ab.oben) + ' mm.';
SCREENS.bprofil = () => {
  const c = BC(), a = A(), portal = isPortal(), p = a.prefs || {}, ab = a.abzug || (a.abzug = { seite: 15, oben: 15 });
  const ini = esc(c.name.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase());
  return { html: '<div class="wrap"><div class="h"><h2>' + esc(c.name) + '</h2><p>' + (portal ? 'So begrüßt die App Ihre Kunden, und so sehen Eigentümer Sie im Portal.' : 'So begrüßt die App Ihre Kunden, wenn sie Ihren Aufmaß-Link öffnen.') + '</p></div><div class="grid c2"><div class="card fcard"><p class="eyebrow">Beim Kunden in der App</p><div class="preview"><div class="pv-card"><span class="av" style="background: ' + c.col + '">' + ini + '</span><span><small>Persönliche Anfrage von</small><b>' + esc(c.name) + '</b></span></div><p class="pv-t">Deine Fenster. Deine Maße.</p><small class="pv-s">' + esc(c.name) + ' braucht für dein Angebot die Maße deiner Fenster.</small></div>' +
    (portal ? '<p class="eyebrow pos-h">Im Portal</p><div class="row between"><span class="row"><span class="av" style="background: ' + c.col + '">' + esc(c.name.slice(0, 1)) + '</span><b>' + esc(c.name) + '</b></span>' + stars(c) + '</div><div class="chips">' + c.leist.map((l) => '<span class="badge">' + esc(l) + '</span>').join('') + '</div><div class="row">' + (c.verified ? '<span class="badge ok">Gewerbe geprüft</span>' : '<span class="badge warn">Prüfung läuft</span>') + (c.reviews ? '<span class="badge acc">Google verknüpft</span>' : '') + '</div>' : '') + '</div>' +
    '<div class="card"><p class="eyebrow">Zugang und Kontakt</p><div class="form" style="margin-top: 10px"><div class="f"><label for="b-ap">Ansprechpartner</label><input id="b-ap" data-in="b:ap" value="' + esc(a.ap) + '"><small>Unterschreibt die Nachricht an Ihre Kunden.</small></div><div class="f2"><div class="f"><label for="b-mail">E-Mail</label><input id="b-mail" data-in="b:mail" value="' + esc(a.mail) + '" type="email"></div><div class="f"><label for="b-tel">Telefon</label><input id="b-tel" data-in="b:tel" value="' + esc(a.tel) + '" type="tel"></div></div></div></div></div>' +
    '<div class="grid c2"><div class="card"><p class="eyebrow">Bestellmaß-Vorschlag</p><p class="sub" style="margin-top: 6px">Ihr Abzug von der Maueröffnung. Damit rechnet Klopfan in jedem eingegangenen Aufmaß ein Bestellmaß vor; verbindlich bleibt Ihr Feinaufmaß.</p><div class="f2" style="margin-top: 10px"><div class="f"><label for="ab-seite">Je Seite</label><input id="ab-seite" type="number" inputmode="numeric" min="0" max="60" value="' + ab.seite + '" data-in="ab:seite"><small>mm, links und rechts</small></div><div class="f"><label for="ab-oben">Oben</label><input id="ab-oben" type="number" inputmode="numeric" min="0" max="60" value="' + ab.oben + '" data-in="ab:oben"><small>mm</small></div></div><p class="km-s" id="ab-ex" style="margin-top: 8px">' + abEx(ab) + '</p></div>' +
    '<div class="card"><p class="eyebrow">Benachrichtigungen</p>' + sw('E-Mail bei neuem Aufmaß', 'sofort, mit Link zum Projekt', p.mail !== false, 'bpref', 'mail') + sw('Erinnerung an offene Links', 'wenn ein Kunde nach 3 Tagen noch nicht gemessen hat', p.remind !== false, 'bpref', 'remind') + (portal ? sw('Tägliche Übersicht neuer Anfragen', 'jeden Morgen um 7 Uhr', p.daily !== false, 'bpref', 'daily') : '') + '</div></div>' +
    (portal ? '<div class="card"><p class="eyebrow">Einsatzgebiet im Portal</p><div class="f" style="margin-top: 8px"><label for="b-einsatz"><span id="einsatz-lab">' + a.einsatz + '</span> km um ' + esc(ort(c.plz)) + '</label><input id="b-einsatz" type="range" min="10" max="100" step="5" value="' + a.einsatz + '" data-in="einsatz"><small>Anfragen außerhalb sehen Sie nicht.</small></div>' + sw('Urlaubsmodus', 'Keine neuen Anfragen, laufende Kontakte bleiben', !!p.urlaub, 'bpref', 'urlaub') + '</div>' : '<div class="card upsell"><div><p class="eyebrow">Zusätzlich: Portal</p><p style="margin: 6px 0 0; color: var(--fg2)">Anonyme Aufmaße von Hauseigentümern aus Ihrer Region. Sie zahlen nur, wenn ein Eigentümer Sie freigibt.</p></div><button type="button" class="btn primary" data-act="sheet" data-v="upgrade">Portal freischalten</button></div>') +
    '<section class="sec"><div class="sec-head"><h3>Team</h3></div><div class="card"><div class="kv"><span>Inhaber</span><span>' + esc(a.ap) + ' · darf alles</span>' + (S.cur === 'c1' ? '<span>Büro</span><span>Sabine Kurz · Projekte, Anfragen, Abrechnung</span><span>Montage</span><span>2 Monteure · sehen nur Aufmaßblätter</span>' : '') + '</div><p style="margin: 10px 0 0"><button type="button" class="btn small soft" data-act="toast" data-v="Einladung per E-Mail. Im Prototyp nur angedeutet.">Mitglied einladen</button></p></div></section>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="sheet" data-v="demo">Demo wechseln</button><button type="button" class="btn ghost" data-act="logout">Abmelden</button></div></div>' };
};

/* ---------- Blätter ---------- */
const LEGAL = { impressum: ['Impressum', 'Anbieter und Kontakt nach § 5 DDG.', '/impressum/'], datenschutz: ['Datenschutz', 'Welche Daten Klopfan verarbeitet, wofür, mit welchen Dienstleistern und welche Rechte Sie haben. In der Pilotphase bleiben Konten, Projekte und Aufmaße in Ihrem Browser.', '/datenschutz/'], agb: ['Nutzungsbedingungen', 'Klopfan ist in der kostenlosen Pilotphase: Es gibt noch keine kostenpflichtigen Leistungen, alle Preise sind eine Vorschau. Die Nutzungsbedingungen für Betriebe und Hauseigentümer folgen vor dem Start der Bezahlfunktionen. Bis dahin gilt: Aufmaße und Kontaktdaten nur für das jeweilige Projekt nutzen.'] };
/* Platzhalter aus dem Prototyp, nicht mehr verwendet */
const LEGAL_ALT = { impressum: ['Impressum', 'Kommt vor dem Start: Anbieter nach § 5 DDG mit Name, Anschrift, Kontakt, Registereintrag und Umsatzsteuer-ID.'], datenschutz: ['Datenschutz', 'Kommt vor dem Start: welche Daten Klopfan verarbeitet (Konto, Projekte, Aufmaße, Fotos, Freigaben), wofür, wie lange, mit welchen Dienstleistern, und welche Rechte Betroffene haben. Aufmaße aus Aufmaß-Links gehen nur an den Betrieb, der den Link geschickt hat.'], agb: ['Nutzungsbedingungen', 'Kommt vor dem Start: Regeln für Betriebe und Hauseigentümer, Preise, Fair-Regel, Zweckbindung von Kontaktdaten und Aufmaßen, Ranking-Kriterien im Portal. Im Prototyp ein Platzhalter.'] };
const DEMOS = [['kunde', 'max', 'Max Muster', 'Hauseigentümer im Portal, zwei Betriebe klopfen an', '#5e5ce6'], ['betrieb', 'c1', 'Fensterbau Brandt', 'Fensterbauer mit Projekten und Portal', '#0071e3'], ['betrieb', 'c7', 'Glaserei Vogt', 'Fensterbauer nur mit Projekten', '#8a5a2b']];
const SHEETS = {
  login: (s) => '<h3>Anmelden</h3><form class="form" data-form="login" novalidate><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email"></div><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-pw">Passwort</label><input id="lg-pw" type="password" data-in="lg:pw" value="" autocomplete="current-password">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Demo: jedes Passwort ab 8 Zeichen.</small>') + '</div><div class="row between"><button type="button" class="linkbtn" data-act="toast" data-v="Ein Link zum Zurücksetzen ist unterwegs (Demo).">Passwort vergessen?</button><button type="submit" class="btn primary">Anmelden</button></div></form>' +
    '<p class="eyebrow" style="margin-top: 6px">Oder Demo-Zugang</p><div class="list">' + DEMOS.map((d) => '<button type="button" class="item" data-act="demo-as" data-v="' + d[1] + '"><span class="ic av" style="background: ' + d[4] + '; color: #fff">' + d[2].slice(0, 1) + '</span><span class="tx"><span class="ti">' + d[2] + '</span><span class="di">' + d[3] + '</span></span>' + CHEV + '</button>').join('') + '</div><p class="sub center">Noch kein Konto? <button type="button" class="ulink" data-act="sheet" data-v="regchoice">Registrieren</button></p>',
  regchoice: () => '<h3>Konto anlegen</h3><div class="list"><button type="button" class="item" data-act="reg" data-v="betrieb"><span class="ic">' + ICONS.folder + '</span><span class="tx"><span class="ti">Fensterbauer</span><span class="di">Projekte anlegen, Aufmaß-Link schicken, Aufmaße bekommen. In einer Minute startklar.</span></span>' + CHEV + '</button><button type="button" class="item" data-act="reg" data-v="portal"><span class="ic">' + ICONS.list + '</span><span class="tx"><span class="ti">Fensterbauer mit Portal</span><span class="di">Zusätzlich anonyme Anfragen aus Ihrer Region. Gewerbenachweis nötig.</span></span>' + CHEV + '</button><button type="button" class="item" data-act="reg" data-v="kunde"><span class="ic">' + ICONS.home + '</span><span class="tx"><span class="ti">Hauseigentümer</span><span class="di">Eigenes Aufmaß anonym ins Portal stellen und Angebote bekommen. Kostenlos.</span></span>' + CHEV + '</button></div>',
  demo: () => { const own = [].concat(Object.keys(S.kunden).filter((id) => id !== 'max').map((id) => ['kunde', id, S.kunden[id].name, 'Ihr Konto als Hauseigentümer']), (S.myCompanies || []).map((c) => ['betrieb', c.id, c.name, c.plan === 'portal' ? 'Ihr Betrieb mit Portal' : 'Ihr Betrieb mit Projekten'])); return '<h3>Demo-Ansicht</h3><p class="sub">Alles bleibt in diesem Browser gespeichert. Freier Wechsel zwischen den Sichten.</p><div class="list">' + [['', 'visitor', 'Startseite', 'wie ein neuer Besucher']].concat(DEMOS.map((d) => [d[0], d[1], d[2], d[3]]), own).map((d) => '<button type="button" class="item' + ((d[1] === 'visitor' && !S.role) || (S.role === 'kunde' && S.kcur === d[1]) || (S.role === 'betrieb' && S.cur === d[1]) ? ' cur' : '') + '" data-act="demo-as" data-v="' + d[1] + '"><span class="tx"><span class="ti">' + esc(d[2]) + '</span><span class="di">' + esc(d[3]) + '</span></span>' + CHEV + '</button>').join('') + '</div><button type="button" class="btn danger" data-act="reset">Demo zurücksetzen</button>'; },
  import: () => '<h3>Aufmaß-Code einfügen</h3><p class="sub">In der Klopfan-App steht unter deinem Aufmaßblatt ein Code, der mit AM1. beginnt. Füge ihn hier ein, dann erscheint dein Aufmaß anonym im Portal.</p><div class="f"><textarea id="code-in" rows="4" placeholder="AM1.…"></textarea></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="import">Einfügen und inserieren</button></div>',
  linkimport: () => '<h3>Code vom Kunden einfügen</h3><p class="sub">Im Prototyp ohne Server schickt Ihr Kunde nach dem Absenden einen Übermittlungscode, zum Beispiel als Antwort in WhatsApp. Fügen Sie ihn hier ein; das Aufmaß landet im passenden Projekt. In der fertigen Version entfällt dieser Schritt.</p><div class="f"><textarea id="code-in" rows="4" placeholder="AM1.…"></textarea></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="linkimport">Übernehmen</button></div>',
  pause: (s) => '<h3>Aufmaß pausieren?</h3><p class="sub">Betriebe sehen es dann nicht mehr. Freigegebene Kontakte bleiben bestehen. Du kannst es jederzeit wieder online stellen.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="pause" data-id="' + s.id + '">Pausieren</button></div>',
  delete: (s) => '<h3>Aufmaß löschen?</h3><p class="sub">Das Aufmaß verschwindet aus dem Portal. Betriebe, die deinen Kontakt schon haben, behalten ihn für dieses Projekt.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="delete" data-id="' + s.id + '">Löschen</button></div>',
  fair: (s) => '<h3>Gutschrift anfragen</h3><p class="sub">Sie bestätigen, dass Sie den Kunden in sieben Tagen mindestens dreimal auf zwei Wegen nicht erreicht haben. Der Kunde bekommt eine Nachfrage. Bleibt sie unbeantwortet, wird der Kontakt gutgeschrieben.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="fair" data-id="' + s.id + '">Anfragen</button></div>',
  pay: (s) => paySheet(s),
  deact: (s) => '<h3>Link deaktivieren?</h3><p class="sub">Ihr Kunde kann über diesen Link dann kein Aufmaß mehr schicken. Das kostet nichts. Einen neuen Link können Sie jederzeit erstellen.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="l-deact" data-id="' + s.id + '">Deaktivieren</button></div>',
  delacc: () => '<h3>Konto löschen?</h3><p class="sub">Alle deine Aufmaße und Freigaben werden gelöscht. Im Prototyp wird nur dieses Konto entfernt und du landest auf der Startseite.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="delacc">Löschen</button></div>',
  knocked: (s) => '<h3>Angeklopft.</h3><p class="sub">Der Eigentümer sieht jetzt Ihr Profil und Ihre Bewertungen und entscheidet. Sie bekommen eine Nachricht, sobald er Sie freigibt oder ablehnt. Berechnet wird erst bei Freigabe: ' + eur(s.price) + ' netto.</p>' + (s.owner ? '<div class="note acc">Dieses Aufmaß gehört zum Demo-Konto ' + esc(S.kunden[s.owner].name) + '. Sie können selbst entscheiden, wie der Eigentümer reagiert.</div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Schließen</button><button type="button" class="btn primary" data-act="as-owner" data-v="' + s.owner + '" data-id="' + s.id + '">Als ' + esc(S.kunden[s.owner].name) + ' entscheiden</button></div>' : '<div class="note">Demo: Der Eigentümer antwortet in ein paar Sekunden. Achten Sie auf die Glocke oben.</div><div class="row"><button type="button" class="btn primary" data-act="sheet-close">Alles klar</button></div>'),
  upgrade: () => '<h3>Portal freischalten</h3><p class="sub">Sie bekommen zusätzlich anonyme Aufmaße von Hauseigentümern aus Ihrer Region. Dafür brauchen wir einen Gewerbenachweis. Bis zur Prüfung sehen Sie Anfragen schon, anklopfen können Sie danach.</p><div class="kv"><span>Anklopfen</span><span>kostenlos</span><span>Kontakt</span><span>29 bis 129 € netto, nur bei Freigabe</span><span>Startguthaben</span><span>100 €</span><span>Projekte</span><span>bleiben wie gehabt</span></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="plan-upgrade">Freischalten</button></div>',
  legal: (s) => { const L = LEGAL[s.id] || LEGAL.agb; return '<h3>' + esc(L[0]) + '</h3><p class="sub">' + esc(L[1]) + '</p><div class="row">' + (L[2] ? '<a class="btn primary" href="' + L[2] + '" target="_blank" rel="noopener">Seite öffnen</a><button type="button" class="btn ghost" data-act="sheet-close">Schließen</button>' : '<button type="button" class="btn primary" data-act="sheet-close">Schließen</button>') + '</div>'; }
};

/* ---------- Aufmaß-Code aus der App lesen ---------- */
function unpack(code) { try { const m = /(?:AM1|ZF1|FE1|LM1)\.([A-Za-z0-9_-]+)/.exec(String(code || '').trim()); if (!m) return null; const b = m[1].replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); const o = JSON.parse(new TextDecoder().decode(bytes)); return o && Array.isArray(o.w) ? o : null; } catch (e) { return null; } }
/* Fenster aus der App vollständig übernehmen: gleiche Felder, fehlende Werte sind App-Standard */
const fromApp = (w) => AW.mk(Object.assign({}, w, { name: w.name || 'Fenster' }));
/* Kennung eines Codes ohne Zeitstempel: gleiches Aufmaß, gleiche Kennung */
function fingerprint(o) { try { return hashN(JSON.stringify([o.w, o.p])); } catch (e) { return 0; } }
function fromAppProj(p) { p = p || {}; return { gebaeude: p.gebaeude || '', baujahr: p.baujahr || '', total: AW.num(p.total) || 0, zeit: p.zeit || '', budget: p.budget || '', foerd: !!p.foerd, notiz: String(p.notiz || '').replace(/\s+/g, ' ').trim().slice(0, 600) }; }
function nextNr(a) { const y = new Date().getFullYear(), mx = (a || A()).links.reduce((m, l) => { const k = /-(\d+)$/.exec(l.nr || ''); return k ? Math.max(m, +k[1]) : m; }, 0); return 'P-' + y + '-' + String(mx + 1).padStart(3, '0'); }
/* ---------- Simulationen ---------- */
function simDecision(x, cid) {
  later(4800, () => {
    const k = (x.knocks || []).find((kk) => kk.c === cid); if (!k || k.status !== 'offen') return;
    const yes = hashN(x.id + cid) % 4 !== 0, a = S.acc[cid];
    k.status = yes ? 'frei' : 'abgelehnt'; k.when = stamp(); if (yes) k.freiAt = Date.now();
    if (yes) { if (a) { charge(a, x); a.kontakte[x.id] = a.kontakte[x.id] || { stage: 'kontakt', note: '' }; } notify(cid, { t: 'Kontakt freigegeben: ' + GEB[x.geb] + ' ' + ort(x.plz), s: contactOf(x).name + ' hat Sie zugelassen. Kontaktdaten jetzt sichtbar. Berechnet: ' + eur(leadPrice(x, a && a.konto)) + ' netto.', to: ['lead', x.id] }); }
    else notify(cid, { t: 'Abgelehnt: ' + GEB[x.geb] + ' ' + ort(x.plz), s: 'Der Eigentümer hat sich für andere Betriebe entschieden. Nichts berechnet.', to: ['lead', x.id] });
    if (S.role === 'betrieb' && S.cur === cid) toast(yes ? 'Freigegeben: ' + contactOf(x).name + ' hat Sie zugelassen' : 'Ein Eigentümer hat abgelehnt, nichts berechnet');
  });
}
function simKnocks(x) {
  const cands = marketCompanies().filter((c) => !S.acc[c.id] || c.id === 'c1').sort((a, b) => km(x.plz, a.plz) - km(x.plz, b.plz)).slice(0, 2);
  cands.forEach((c, i) => later(3500 + i * 3800, () => {
    if (!S.inq.includes(x) || (x.knocks || []).some((k) => k.c === c.id)) return;
    x.knocks.push({ c: c.id, when: stamp(), status: 'offen' });
    notify(x.owner, { t: c.name + ' hat angeklopft', s: ort(c.plz) + (c.rating ? ', ' + String(c.rating).replace('.', ',') + ' Sterne' : '') + '. Du entscheidest, ob sie deine Kontaktdaten bekommen.', to: ['inquiry', x.id] });
    if (S.role === 'kunde' && S.kcur === x.owner) toast(c.name + ' klopft an');
  }));
}
function simLink(l, cid) {
  const steps = [['geoeffnet', 900], ['arbeit', 1700], ['p2', 2500], ['p3', 3200], ['p4', 3900], ['eingegangen', 4800]];
  steps.forEach((s) => later(s[1], () => {
    if (['eingegangen', 'deaktiviert'].includes(l.status)) return;
    if (s[0] === 'geoeffnet') { l.status = 'geoeffnet'; l.log.geoeffnet = stamp(); }
    else if (s[0] === 'arbeit') { l.status = 'arbeit'; l.progress = 1; l.log.arbeit = stamp(); }
    else if (s[0][0] === 'p') { l.progress = +s[0][1]; }
    else {
      const wins = demoWins('weber').slice(0, 2 + (hashN(l.id) % 3));
      const ok = receiveAufmass(S.acc[cid], cid, l, aufmassOf(wins, projOf({ baujahr: '1984', total: 8, foerd: false, notiz: 'Am besten nach 17 Uhr anrufen.' })), l.via);
      l.seen = S.screen === 'link' && S.sel === l.id;
      if (l.seen && ok) S._feier = 'eingang';
      if (S.role === 'betrieb' && S.cur === cid) toast(ok ? 'Aufmaß eingegangen: ' + l.kunde : 'Aufmaß eingegangen. Zum Ansehen Zahlungsart hinterlegen');
    }
  }));
}

/* ---------- Aufmaßblatt als PDF für den Betrieb ---------- */
let PDL = null;
const PDLP = (async () => { try { PDL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { PDL = null; } return PDL; })();
function amPDF(l) {
  const J = window.jspdf && window.jspdf.jsPDF; if (!J || !l.aufmass) return null;
  const am = l.aufmass, pr = am.proj || {}, wins = am.windows || [], ab = A().abzug || { seite: 15, oben: 15 }, c = BC();
  const doc = new J({ unit: 'mm', format: 'a4' }), W = 210, M = 16;
  const t = (s) => String(s == null ? '' : s).replace(/[  ]/g, ' ');
  let y = 18, page = 1;
  const foot = () => { doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120); doc.text(t('Erfasst vom Kunden mit Klopfan. Vor der Fertigung Feinaufmaß vor Ort.'), M, 289); doc.text('Seite ' + page, W - M, 289, { align: 'right' }); doc.setTextColor(20); };
  const need = (h) => { if (y + h > 280) { foot(); doc.addPage(); page++; y = 18; } };
  const put = (k, v) => { doc.setFontSize(9.5); const vl = doc.splitTextToSize(t(v), W - 2 * M - 42), kl = doc.splitTextToSize(t(k), 39), h = Math.max(vl.length, kl.length) * 4.4; need(h + 1.5); doc.setTextColor(110); doc.text(kl, M, y); doc.setTextColor(20); doc.text(vl, M + 42, y); y += h + 1.2; };
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text(t('Aufmaßblatt'), M, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(110); doc.text(t(c.name), W - M, y - 5, { align: 'right' }); doc.text(t([l.nr, (l.log || {}).eingegangen ? 'eingegangen ' + l.log.eingegangen : ''].filter(Boolean).join(' · ')), W - M, y, { align: 'right' }); doc.setTextColor(20);
  y += 9;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(t(l.kunde), M, y); doc.setFont('helvetica', 'normal'); y += 6;
  put('Kontakt', l.kontakt || '–'); put('Objekt', l.adresse || '–');
  put('Gebäude', (AW.lab('gebaeude', pr.gebaeude) || PGEB[l.geb] || '–') + (pr.baujahr ? ', Baujahr ' + pr.baujahr : ''));
  put('Zeitraum', AW.lab('zeit', pr.zeit) || '–'); put('Budget', (AW.lab('budget', pr.budget) || '–') + (pr.foerd ? ', Förderung gewünscht' : ''));
  put('Umfang', nW(wins.length, 'Position', 'Positionen') + ', ' + nW(am.elemente || wins.length, 'Element', 'Elemente') + ', ' + nW(am.fotos || 0, 'Foto', 'Fotos'));
  if (pr.notiz) put('Nachricht', '„' + pr.notiz + '“');
  y += 2; doc.setDrawColor(30); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 8;
  wins.forEach((w, i) => {
    const d = AW.derive(w);
    need(34);
    const bw = 18, bh = Math.max(10, Math.min(26, bw * (d.elH || 1200) / (d.elW || 1000))), bx = W - M - bw, by = y - 4, ns = (w.sashes || []).length || 1;
    doc.setLineWidth(0.4); doc.setDrawColor(30); doc.setFillColor(214, 230, 244); doc.rect(bx, by, bw, bh); for (let s = 0; s < ns; s++) doc.rect(bx + 1.2 + s * (bw - 2.4) / ns, by + 1.2, (bw - 2.4) / ns - 0.6, bh - 2.4, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.text(t('Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster') + ((AW.num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stück' : '')), M, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); y += 5.5;
    doc.text(t('Öffnung ' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' mm · Element ' + AW.th(d.elW) + ' × ' + AW.th(d.elH) + ' mm'), M, y); y += 5.5;
    if (d.moW && d.moH) { doc.setFont('helvetica', 'bold'); doc.text(t('Bestellmaß-Vorschlag ' + AW.th(d.moW - 2 * ab.seite) + ' × ' + AW.th(d.moH - ab.oben) + ' mm'), M, y); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(110); doc.text(t('(Öffnung minus ' + ab.seite + ' mm je Seite und ' + ab.oben + ' mm oben)'), M + 72, y); doc.setTextColor(20); }
    y = Math.max(y + 6, by + bh + 4);
    AW.rows(w).forEach((r) => put(r[0], r[1]));
    const ki = AW.kiRows(w);
    if (ki.length) { need(12); y += 2; doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.text(t('Bestand laut Fotos (KI)'), M, y); doc.setFont('helvetica', 'normal'); y += 5; ki.forEach((r) => put(r[0], r[1])); }
    y += 3; doc.setDrawColor(210); doc.setLineWidth(0.2); doc.line(M, y - 2, W - M, y - 2); y += 5;
  });
  foot();
  return doc.output('blob');
}
async function saveAm(l) {
  if (!l || !l.aufmass) return;
  const pdf = amPDF(l), base = 'Aufmass-' + [l.nr, slug(l.kunde.replace(/^Beispiel:\s*/, ''))].filter(Boolean).join('-').replace(/[^A-Za-z0-9_-]+/g, '-');
  const name = base + (pdf ? '.pdf' : '.txt'), data = pdf || aufmassText(l);
  if (!PDL) await PDLP;
  if (PDL) {
    try { await PDL.save({ filename: name, data: data }); toast(pdf ? 'PDF gespeichert' : 'Als Text gespeichert'); }
    catch (e) { if (e && e.code === 'declined') return; if (e && (e.code === 'rejected_extension' || e.code === 'extension_not_enabled') && pdf) { try { await PDL.save({ filename: base + '.txt', data: aufmassText(l) }); toast('Als Text gespeichert'); } catch (e2) { toast('Speichern hat nicht geklappt'); } return; } toast('Speichern hat nicht geklappt'); }
    return;
  }
  if (window.claude) { copyText(aufmassText(l), 'Speichern geht hier nicht. Aufmaß als Text kopiert'); return; }
  try { const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Download gestartet'); }
  catch (e) { toast('Speichern geht hier nicht. Bitte als Text kopieren.'); }
}

/* ---------- Abrechnung: Buchungen, kostenlose Aufmaße, Sperre ohne Zahlungsart ----------
   Regeln, die im echten Betrieb der Server durchsetzt:
   1. Gebucht wird beim Eingang eines Aufmaßes, zum Tarif, der in diesem Moment gilt. Eine Buchung wird nie geändert oder gelöscht.
   2. Kostenlose Aufmaße zählen je Betrieb über die Buchungen, nicht über die Projekte. Projekte löschen oder deaktivieren ändert nichts.
   3. Ohne Zahlungsart wird ab dem ersten kostenpflichtigen Aufmaß nichts mehr gezeigt: es kommt an, bleibt aber gesperrt, bis eine Zahlungsart da ist.
   4. Betrieb Plus braucht eine Zahlungsart, wird für den laufenden Monat sofort gebucht und endet beim Wechsel erst zum Monatsende. */
const PLUS_PRICE = 79;
const monthKey = () => { const d = new Date(); return d.getFullYear() + '-' + two(d.getMonth() + 1); };
const monthLabel = () => new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
const monthEnd = () => { const d = new Date(), e = new Date(d.getFullYear(), d.getMonth() + 1, 0); return two(e.getDate()) + '.' + two(e.getMonth() + 1) + '.' + e.getFullYear(); };
const freeQuota = (a) => (a.freeQuota != null ? a.freeQuota : LINK_FREE);
function ledger(a) {
  a = a || A();
  if (!a.book) {
    /* Altbestand: eingegangene Projekte in der Reihenfolge des Eingangs nachbuchen */
    a.book = []; a.freeUsed = 0;
    a.links.slice().reverse().filter((l) => l.status === 'eingegangen' && !l.demo).forEach((l) => { l.locked = !bookAufmass(a, l); });
  }
  return a.book;
}
const freeLeft = (a) => { a = a || A(); ledger(a); return Math.max(0, freeQuota(a) - (a.freeUsed || 0)); };
const lockedLinks = (a) => (a || A()).links.filter((l) => l.status === 'eingegangen' && l.locked && !l.demo);
function bookAufmass(a, l) {
  const book = a.book || (a.book = []);
  if (book.some((b) => b.kind === 'aufmass' && b.ref === l.id)) return true;
  const am = l.aufmass || {}, sub = [((l.log || {}).eingegangen || stamp()), l.nr, am.windows ? nW(am.windows.length, 'Position', 'Positionen') : ''].filter(Boolean).join(' · ');
  let betrag = 0, badge;
  if (a.konto === 'plus') badge = 'inklusive (Plus)';
  else if (freeQuota(a) - (a.freeUsed || 0) > 0) { a.freeUsed = (a.freeUsed || 0) + 1; badge = 'kostenlos, ' + a.freeUsed + ' von ' + freeQuota(a); }
  else if (a.pay) { betrag = LINK_PRICE; badge = 'nächste Rechnung'; }
  else return false;
  book.unshift({ id: 'b' + Date.now().toString(36) + book.length, kind: 'aufmass', ref: l.id, when: stamp(), text: 'Aufmaß · ' + l.kunde, sub: sub, betrag: betrag, badge: badge, status: 'offen' });
  return true;
}
/* Ein Aufmaß kommt an: speichern, buchen oder sperren, melden */
function receiveAufmass(a, cid, l, aufmass, via) {
  ledger(a);
  l.status = 'eingegangen'; l.progress = 4; l.via = l.via || via || 'Code'; l.log = l.log || {}; l.log.eingegangen = stamp(); l.aufmass = aufmass; l.stage = 'neu';
  l.locked = l.demo ? false : !bookAufmass(a, l);
  const size = nW(aufmass.windows.length, 'Position', 'Positionen') + ' mit ' + nW(aufmass.fotos || 0, 'Foto', 'Fotos');
  notify(cid, l.locked ? { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. Zum Ansehen eine Zahlungsart hinterlegen; Ihre kostenlosen Aufmaße sind verbraucht.', to: ['link', l.id] } : { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. ' + (l.nr || ''), to: ['link', l.id] });
  return !l.locked;
}
/* Nach Zahlungsart oder Plus: wartende Aufmaße freischalten, ältestes zuerst */
function unlockWaiting(a) {
  let n = 0;
  lockedLinks(a).slice().reverse().forEach((l) => { if (bookAufmass(a, l)) { l.locked = false; n++; } });
  return n;
}
function bookPlus(a) {
  const key = monthKey();
  if (!ledger(a).some((b) => b.kind === 'plus' && b.month === key)) a.book.unshift({ id: 'p' + Date.now().toString(36), kind: 'plus', month: key, when: stamp(), text: 'Betrieb Plus · ' + monthLabel(), sub: 'monatlich, bis ' + monthEnd() + ', danach monatlich kündbar', betrag: PLUS_PRICE, badge: 'nächste Rechnung', status: 'offen' });
}
function activatePlus(a) {
  a.konto = 'plus'; a.downgrade = null;
  bookPlus(a);
  return unlockWaiting(a);
}
/* Beim Start und einmal pro Minute: was die Zeit erledigt */
function tick() {
  const now = Date.now(); let dirty = false;
  Object.keys(S.acc).forEach((id) => {
    const a = S.acc[id];
    if (a.downgrade) { const d = parseDE(a.downgrade.at); if (d && now > d.getTime()) { a.konto = a.downgrade.to; a.downgrade = null; dirty = true; notify(id, { t: 'Kontomodell gewechselt', s: 'Betrieb Plus ist ausgelaufen, wie vorgemerkt.', to: ['abrechnung'] }); } }
    if (a.konto === 'plus' && a.pay && !ledger(a).some((b) => b.kind === 'plus' && b.month === monthKey())) { bookPlus(a); dirty = true; }
    (a.links || []).forEach((l) => { if (['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)) { const d = parseDE(l.expires); if (d && now > d.getTime()) { l.status = 'abgelaufen'; l.log = l.log || {}; l.log.abgelaufen = l.expires; dirty = true; } } });
  });
  if (dirty) { save(); if (document.getElementById('app')) refresh(); }
}
/* Gleicher Betrieb schon da? Telefonnummer oder Firmenname mit gleicher PLZ-Region */
const normTel = (t) => { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && d.length > 10) d = '0' + d.slice(2); return d; };
const normFirma = (n) => String(n || '').toLowerCase().replace(/\b(gmbh|ug|gbr|kg|ohg|e\.?\s?k\.?|inh\.?|&\s?co\.?)\b/g, '').replace(/[^a-z0-9äöüß]/g, '');
function sameCompany(d) {
  const tel = normTel(d.tel), name = normFirma(d.firma), plz = String(d.plz || '').slice(0, 2);
  const ids = Object.keys(S.acc);
  for (let i = 0; i < ids.length; i++) {
    const a = S.acc[ids[i]], c = comp(ids[i]);
    if (tel.length >= 6 && normTel(a.tel) === tel) return c ? c.name : 'ein bestehendes Konto';
    if (name.length >= 4 && c && normFirma(c.name) === name && (!plz || String(c.plz || '').slice(0, 2) === plz)) return c.name;
  }
  return '';
}
/* IBAN prüfen: Länge für Deutschland und Prüfziffer nach ISO 13616 */
function ibanOk(v) {
  const s = String(v || '').replace(/\s+/g, '').toUpperCase();
  if (!/^DE\d{20}$/.test(s)) return false;
  const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let m = 0; for (let i = 0; i < r.length; i++) m = (m * 10 + +r[i]) % 97;
  return m === 1;
}
const ibanMask = (v) => { const s = String(v || '').replace(/\s+/g, '').toUpperCase(); return s.slice(0, 4) + ' •••• •••• ' + s.slice(-4); };
function dupNote(d) { const n = sameCompany(d); return n ? '<div class="note warn">Für <b>' + esc(n) + '</b> gibt es schon ein Klopfan-Konto. Ein weiteres geht, die 3 kostenlosen Aufmaße gibt es aber nur einmal je Betrieb. <button type="button" class="ulink" data-act="sheet" data-v="login">Lieber anmelden</button></div>' : ''; }
function payBanner() {
  if (S.role !== 'betrieb') return '';
  const a = A(), w = lockedLinks(a).length;
  if (w) return '<div class="banner warn"><span><b>' + nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung.</b> Mit einer Zahlungsart sehen Sie ' + (w === 1 ? 'es' : 'sie') + ' sofort.</span><button type="button" class="btn small primary" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  if (!a.pay && a.konto !== 'plus' && freeLeft(a) === 0) return '<div class="banner"><span><b>Keine kostenlosen Aufmaße mehr.</b> Mit einer Zahlungsart ist das nächste Aufmaß sofort sichtbar.</span><button type="button" class="btn small ghost" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  return '';
}
function lockCard(l, a) {
  const am = l.aufmass || {}, n = (am.windows || []).length;
  return '<section class="sec"><div class="sec-head"><h3>Aufmaß</h3><span class="sub">' + nW(n, 'Position', 'Positionen') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div><div class="card lockcard"><span class="lk-ic">' + icon('lock', 26) + '</span><div><p class="eyebrow">Eingegangen · gesperrt</p><h3>Zum Ansehen eine Zahlungsart hinterlegen.</h3><p>' + (a.dupOf ? 'Die kostenlosen Aufmaße für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : 'Ihre ' + freeQuota(a) + ' kostenlosen Aufmaße sind verbraucht.') + ' Dieses Aufmaß kostet ' + eur(LINK_PRICE) + ' netto und kommt auf die nächste Sammelrechnung. Mit Betrieb Plus sind alle Aufmaße inklusive.</p><div class="row"><button type="button" class="btn primary" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button><button type="button" class="btn ghost" data-act="konto" data-v="plus">Betrieb Plus, ' + eur(PLUS_PRICE) + ' im Monat</button></div></div></div></section>';
}
function paySheet(s) {
  const e = s.err || {}, t = s.type || 'sepa', w = lockedLinks().length;
  const fe = (f) => (e[f] ? '<small class="err">' + esc(e[f]) + '</small>' : '');
  const inp = (label, f, ph, auto) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label for="pay-' + f + '">' + label + '</label><input id="pay-' + f + '" data-in="pay:' + f + '" value="' + esc(s[f] || '') + '" placeholder="' + esc(ph) + '" autocomplete="' + auto + '">' + fe(f) + '</div>';
  const why = s.then === 'plus' ? 'Für Betrieb Plus brauchen wir eine Zahlungsart. Gebucht wird ab heute für den laufenden Monat.' : w ? nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung und ' + (w === 1 ? 'ist' : 'sind') + ' danach sofort sichtbar.' : 'Nötig ab dem ersten kostenpflichtigen Aufmaß. Bis dahin wird nichts abgebucht.';
  return '<h3>Zahlungsart hinterlegen</h3><p class="sub">' + why + ' Abgebucht wird alle zwei Wochen als Sammelrechnung, nur für eingegangene Aufmaße.</p>' + seg([['sepa', 'SEPA-Lastschrift'], ['karte', 'Kreditkarte']], t, 'pay-type') +
    '<form class="form" data-form="pay" novalidate style="margin-top: 12px">' + (t === 'sepa' ? '<button type="button" class="fillbtn" data-act="pay-fill">' + icon('play', 13) + 'Nur testen? Beispiel-IBAN einsetzen</button>' + inp('Kontoinhaber', 'inhaber', 'wie auf dem Kontoauszug', 'name') + inp('IBAN', 'iban', 'DE00 0000 0000 0000 0000 00', 'off') +
      '<label class="agree' + (e.mandat ? ' has-err' : '') + '"><input type="checkbox" data-in="pay:mandat"' + (s.mandat ? ' checked' : '') + '><span>Ich erteile Klopfan ein SEPA-Firmenlastschrift-Mandat für dieses Geschäftskonto.</span></label>' + fe('mandat')
      : inp('Karteninhaber', 'inhaber', 'Name auf der Karte', 'cc-name') + '<div class="note">Die Kartennummer geben Sie im sicheren Feld des Zahlungsdienstleisters ein. Klopfan sieht sie nie.</div>') +
    '</form><p class="km-s">Prototyp: Es wird nichts gespeichert oder abgebucht.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="pay-save">' + (s.then === 'plus' ? 'Speichern und Plus starten' : w ? 'Speichern und freischalten' : 'Speichern') + '</button></div>';
}
/* Hauseigentümer-Konten sind für das eigene Zuhause: keine Betriebsnummer, keine Betriebs-Domain, höchstens 3 Aufmaße in 12 Monaten */
const FREEMAIL = /@(gmail|googlemail|gmx|web|t-online|outlook|hotmail|live|yahoo|icloud|me|posteo|mailbox|freenet|aol|beispiel)\./i;
const KUNDE_MAX = 3;
function betriebBy(fn) { const id = Object.keys(S.acc).find((k) => fn(S.acc[k])); if (!id) return ''; const c = comp(id); return c ? c.name : 'einem Betriebskonto'; }

/* ---------- Aktionen ---------- */
function act(name, el) {
  const v = el.getAttribute('data-v'), id = el.getAttribute('data-id'), cid = el.getAttribute('data-c');
  const findInq = () => S.inq.find((i) => i.id === id), findLink = () => A().links.find((l) => l.id === id);
  switch (name) {
    case 'none': return;
    case 'go': return go(v, id !== null ? id : undefined);
    case 'nav': return nav(v);
    case 'back': return back();
    case 'sheet': { S.sheet = { k: v, id: id }; return render(); }
    case 'sheet-close': { S.sheet = null; return render(); }
    case 'toast': return toast(v);
    case 'reg': { S.sheet = null; S.reg = v === 'kunde' ? { role: 'kunde', path: null, step: 0, d: {}, err: {} } : { role: 'betrieb', path: v === 'portal' ? 'portal' : 'service', step: 1, d: {}, err: {} }; if (S.screen === 'reg') { S.animNext = true; render(); window.scrollTo(0, 0); return; } return go('reg'); }
    case 'reg-path': { S.reg.path = v; S._pop = { act: 'reg-path', v: v, k: '' }; return render(); }
    case 'reg-prev': { const r = S.reg; r.err = {}; if (r.step > firstStep(r)) { r.step--; S.animNext = true; render(); window.scrollTo(0, 0); return; } return back(); }
    case 'reg-next': {
      const r = S.reg, steps = regSteps(r);
      if (r.role !== 'kunde' && r.step === 0) { if (!r.path) return; r.step = 1; S.animNext = true; render(); window.scrollTo(0, 0); return; }
      if (!regValidate(r)) { S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); } return; }
      if (r.step < steps.length - 1) { r.step++; S.animNext = true; render(); window.scrollTo(0, 0); return; }
      return regFinish();
    }
    case 'reg-fill': { const r = S.reg, smp = SAMPLE[regKey(r)]; if (!smp) return; Object.keys(smp).forEach((k) => { r.d[k] = Array.isArray(smp[k]) ? smp[k].slice() : smp[k]; }); if (r.d.mail && S.logins[r.d.mail]) r.d.mail = r.d.mail.replace('@', '+' + Math.floor(Math.random() * 900 + 100) + '@'); r.err = {}; return render(); }
    case 'reg-chip': { const r = S.reg, k = el.getAttribute('data-k'), arr = r.d[k] || [], i = arr.indexOf(v); r.d[k] = i >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]); delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-set': { const r = S.reg, k = el.getAttribute('data-k'); r.d[k] = v; delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-toggle': { const r = S.reg, def = v === 'push'; r.d[v] = !(r.d[v] !== undefined ? r.d[v] : def); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'login-submit': {
      const s = S.sheet, mail = String(s.mail || '').trim().toLowerCase(), u = S.logins[mail];
      if (VAL.mail(mail) !== true) { s.err = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return render(); }
      if (!u) { s.err = 'Zu dieser E-Mail gibt es kein Konto. Registrieren oder einen Demo-Zugang nutzen.'; return render(); }
      if (String(s.pw || '').length < 8) { s.err = 'Das Passwort ist zu kurz. Demo: jedes Passwort ab 8 Zeichen.'; return render(); }
      return login(u.role, u.id);
    }
    case 'demo-as': {
      if (v === 'visitor') { S.role = null; S.sheet = null; nav('landing'); return toast('Startseite wie ein neuer Besucher'); }
      if (S.kunden[v]) return login('kunde', v, 'Ansicht: ' + S.kunden[v].name);
      if (S.acc[v]) return login('betrieb', v, 'Ansicht: ' + comp(v).name);
      return;
    }
    case 'as-owner': { S.role = 'kunde'; S.kcur = v; S.sheet = null; S.hist = []; S.screen = 'dash'; go('inquiry', id); return toast('Ansicht: ' + K().name); }
    case 'reset': { try { localStorage.removeItem(STORE); } catch (e) { /* ok */ } S = seed(); nav('landing'); return toast('Demo zurückgesetzt'); }
    case 'logout': { S.role = null; S.sheet = null; nav('landing'); return toast('Abgemeldet'); }
    case 'notif-open': { const n = notifs()[+el.getAttribute('data-i')]; if (!n) return; n.new = false; if (n.to) return go(n.to[0], n.to[1]); return render(); }
    case 'read-all': { notifs().forEach((n) => { n.new = false; }); return render(); }
    /* Hauseigentümer */
    case 'release': { const x = findInq(), k = x && (x.knocks || []).find((kk) => kk.c === cid); if (!k) return; if ((x.knocks || []).filter((kk) => kk.status === 'frei').length >= 3) return toast('Höchstens drei Freigaben je Aufmaß'); k.status = 'frei'; k.when = stamp(); k.freiAt = Date.now(); const a = S.acc[cid]; if (a) { charge(a, x); a.kontakte[x.id] = a.kontakte[x.id] || { stage: 'kontakt', note: '' }; } notify(cid, { t: 'Kontakt freigegeben: ' + GEB[x.geb] + ' ' + ort(x.plz), s: contactOf(x).name + ' hat Sie zugelassen. ' + x.fenster + ' Fenster, Kontaktdaten jetzt sichtbar.', to: ['lead', x.id] }); S._feier = 'frei'; render(); return toast(comp(cid).name + ' bekommt deine Kontaktdaten'); }
    case 'decline': { const x = findInq(), k = x && (x.knocks || []).find((kk) => kk.c === cid); if (!k) return; k.status = 'abgelehnt'; notify(cid, { t: 'Abgelehnt: ' + GEB[x.geb] + ' ' + ort(x.plz), s: 'Der Eigentümer hat sich für andere Betriebe entschieden. Nichts berechnet.', to: ['lead', x.id] }); render(); return toast('Abgelehnt, nichts weitergegeben'); }
    case 'revoke': { const x = findInq(), k = x && (x.knocks || []).find((kk) => kk.c === cid); if (!k) return; k.status = 'abgelehnt'; k.when = stamp(); const a = S.acc[cid], c = chargeOf(a, x.id); if (a && c && c.status !== 'gutschrift') { c.status = 'gutschrift'; a.guthaben += c.credit || 0; notify(cid, { t: 'Freigabe zurückgezogen: ' + GEB[x.geb] + ' ' + ort(x.plz), s: 'Der Eigentümer hat die Freigabe zurückgezogen. ' + (c.credit ? eur(c.credit) + ' sind zurück auf Ihrem Guthaben' + (c.credit < c.betrag ? ', der Rest wird nicht berechnet' : '') : 'Der Kontakt wird nicht berechnet') + '.', to: ['lead', x.id] }); } render(); return toast('Freigabe zurückgezogen. Dem Betrieb wird nichts berechnet.'); }
    case 'invite': { const x = findInq(); if (!x) return; x.knocks = (x.knocks || []).filter((k) => k.c !== cid); x.knocks.unshift({ c: cid, when: 'eingeladen, ' + stamp(), status: 'offen' }); notify(cid, { t: 'Einladung: ' + GEB[x.geb] + ' ' + ort(x.plz), s: 'Ein Eigentümer möchte, dass Sie sein Aufmaß ansehen.', to: ['lead', x.id] }); toast(comp(cid).name + ' eingeladen'); return go('inquiry', id); }
    case 'pause': { const x = findInq(); if (!x) return; x.status = x.status === 'pause' ? 'offen' : 'pause'; S.sheet = null; render(); return toast(x.status === 'pause' ? 'Pausiert' : 'Wieder online'); }
    case 'delete': {
      const x = findInq(); if (!x) return;
      (x.knocks || []).filter((k) => k.status === 'offen').forEach((k) => { if (S.acc[k.c]) notify(k.c, { t: 'Anfrage zurückgezogen: ' + GEB[x.geb] + ' ' + ort(x.plz), s: 'Der Eigentümer hat sein Aufmaß aus dem Portal genommen. Es wird nichts berechnet.' }); });
      if ((x.knocks || []).some((k) => k.status === 'frei')) { x.status = 'geloescht'; x.knocks = x.knocks.filter((k) => k.status === 'frei'); }
      else S.inq = S.inq.filter((i) => i.id !== id);
      S.sheet = null; nav('dash'); return toast('Aufmaß gelöscht');
    }
    case 'delacc': { if (S.role === 'kunde' && S.kcur !== 'max') { const kid = S.kcur; S.inq = S.inq.filter((x) => x.owner !== kid); Object.keys(S.logins).forEach((m) => { if (S.logins[m].id === kid) delete S.logins[m]; }); delete S.kunden[kid]; S.kcur = 'max'; } S.role = null; S.sheet = null; nav('landing'); return toast(S.kunden.max ? 'Konto gelöscht' : 'Abgemeldet'); }
    case 'kpref': { const p = K().prefs = K().prefs || {}; p[v] = !(p[v] !== undefined ? p[v] : v !== 'addr'); S._pop = { act: name, v: v, k: '' }; render(); return toast('Gespeichert'); }
    case 'af-leist': { S.af.leist = v; S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'af-reset': { S.af = { q: '', sort: 'km', leist: '' }; return render(); }
    case 'import': {
      const ta = document.getElementById('code-in'), o = unpack(ta ? ta.value : '');
      if (!o) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.'); } if (o.b) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Dieses Aufmaß gehört zum Auftrag deines Fensterbauers und kann nicht ins Portal.'); } if ((K().imports || 0) >= KUNDE_MAX) { S.sheet = null; render(); return toast('Ein Konto ist für das eigene Zuhause: höchstens ' + KUNDE_MAX + ' Aufmaße in 12 Monaten.'); }
      const ws = (o.w || []).map(fromApp), p = o.p || {}, n = ws.reduce((s, w) => s + w.anzahl, 0) || 1, plz = (String(p.ort || '').match(/\d{5}/) || [K().plz])[0], fp = fingerprint(o);
      const schon = myInq().find((x) => x.fp === fp); if (schon) { S.sheet = null; go('inquiry', schon.id); return toast('Dieses Aufmaß ist schon online.'); }
      const x = { id: 'i' + Date.now().toString(36), owner: S.kcur, plz: plz, geb: GEB[p.gebaeude] ? p.gebaeude : 'efh', baujahr: p.baujahr || '', fenster: n, elemente: n, budget: BUDGET[p.budget] ? p.budget : 'b0', zeit: ZEIT[p.zeit] ? p.zeit : ({ sofort: 'asap', offen: '12m' }[p.zeit] || '3m'), material: ws[0] ? MATL[ws[0].material] || 'Kunststoff' : 'Kunststoff', fotos: (o.w || []).reduce((s, w) => s + (w.fotos || 0), 0), created: 0, createdAt: Date.now(), fp: fp, status: 'offen', windows: ws.slice(0, 8).map((w) => ({ name: w.name, w: w.elW || 1000, h: w.elH || 1200, typ: w.typ })), ki: ws[0] ? ws[0].ki : [], foerd: !!p.foerd, knocks: [] };
      K().imports = (K().imports || 0) + 1; S.inq.unshift(x); S.sheet = null; notify(S.kcur, { t: 'Dein Aufmaß ist online', s: n + ' Fenster, anonym sichtbar für Betriebe im Umkreis.', to: ['inquiry', x.id] }); simKnocks(x); go('inquiry', x.id); return toast('Aufmaß inseriert');
    }
    case 'demo-inquiry': {
      const x = { id: 'i' + Date.now().toString(36), owner: S.kcur, plz: K().plz, geb: 'efh', baujahr: 1984, fenster: 3, elemente: 3, budget: 'b3', zeit: '3m', material: 'Kunststoff', fotos: 6, created: 0, createdAt: Date.now(), status: 'offen', windows: [{ name: 'Wohnzimmer', w: 1760, h: 1385, typ: '3 Flügel, Mitte fest' }, { name: 'Küche', w: 1230, h: 1410, typ: '2 Flügel Dreh-Kipp' }, { name: 'Bad', w: 880, h: 1010, typ: '1 Flügel Dreh-Kipp' }], ki: ['Kunststoff, weiß', '2-fach, vor 2000', 'Rollladenkasten innen'], foerd: false, knocks: [] };
      S.inq.unshift(x); notify(S.kcur, { t: 'Dein Aufmaß ist online', s: '3 Fenster, anonym sichtbar für Betriebe im Umkreis.', to: ['inquiry', x.id] }); simKnocks(x); go('inquiry', x.id); return toast('Beispiel inseriert. Gleich klopft jemand an.');
    }
    /* Fensterbauer: Portal */
    case 'knock': { const x = findInq(); if (!x || !A().verified) return; if (x.status === 'pause') return toast('Dieses Aufmaß ist gerade pausiert.'); if (x.status === 'geloescht') return toast('Dieses Aufmaß wurde zurückgezogen.'); const prev = knockStatus(x, S.cur); if (prev === 'abgelehnt') return toast('Der Eigentümer hat abgelehnt. Erneut anklopfen geht nicht.'); if (prev === 'frei') return go('lead', x.id); x.knocks = (x.knocks || []).filter((k) => k.c !== S.cur); x.knocks.unshift({ c: S.cur, when: stamp(), status: 'offen' }); if (x.owner) notify(x.owner, { t: BC().name + ' hat angeklopft', s: ort(BC().plz) + '. Du entscheidest, ob sie deine Kontaktdaten bekommen.', to: ['inquiry', x.id] }); else simDecision(x, S.cur); S.sheet = { k: 'knocked', price: leadPrice(x), owner: x.owner || null, id: x.id }; return render(); }
    case 'unknock': { const x = findInq(); if (x) x.knocks = (x.knocks || []).filter((k) => k.c !== S.cur); render(); return toast('Anklopfen zurückgenommen'); }
    case 'stage': { A().kontakte[id] = Object.assign(A().kontakte[id] || { note: '' }, { stage: v }); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'konto': {
      const a = A();
      if (v === 'plus') {
        if (a.konto === 'plus') { if (a.downgrade) { a.downgrade = null; render(); return toast('Betrieb Plus läuft weiter'); } return; }
        if (!a.pay) { S.sheet = { k: 'pay', then: 'plus', type: 'sepa' }; return render(); }
        const n = activatePlus(a); S._pop = { act: name, v: v, k: '' }; save(); render();
        return toast('Betrieb Plus aktiv, ' + eur(PLUS_PRICE) + ' für ' + monthLabel() + (n ? '. ' + nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : ''));
      }
      if (a.konto === 'plus') { a.downgrade = { to: v, at: monthEnd() }; S._pop = { act: name, v: v, k: '' }; save(); render(); return toast('Vorgemerkt: Betrieb Plus läuft bis ' + monthEnd()); }
      a.konto = v; S._pop = { act: name, v: v, k: '' }; render(); return toast(v === 'service' ? 'Start: 3 Aufmaße frei, danach 9\u00a0€ je Aufmaß' : 'Pro Kontakt, keine Grundgebühr');
    }
    case 'fair': { const x = findInq(); if (x) { const k = x.knocks.find((kk) => kk.c === S.cur); if (k && k.freiAt && Date.now() - k.freiAt < 7 * 864e5) { S.sheet = null; render(); return toast('Gutschrift frühestens 7 Tage nach der Freigabe, ab dem ' + datumDE(k.freiAt + 7 * 864e5) + '.'); } if (k) k.status = 'abgelehnt'; const c = chargeOf(A(), x.id); let zurueck = 0; if (c && c.status !== 'gutschrift') { c.status = 'gutschrift'; zurueck = c.credit || 0; A().guthaben += zurueck; } S.sheet = null; render(); return toast(zurueck ? 'Gutschrift erteilt. ' + eur(zurueck) + ' sind zurück auf Ihrem Guthaben.' : 'Gutschrift erteilt. Der Kontakt wird nicht berechnet.'); } S.sheet = null; return render(); }
    case 'verify-demo': { A().verified = true; const c = (S.myCompanies || []).find((x) => x.id === S.cur); if (c) c.verified = true; notify(S.cur, { t: 'Nachweis geprüft', s: 'Sie können jetzt bei Anfragen anklopfen.', to: ['markt'] }); render(); return toast('Nachweis geprüft. Sie können jetzt anklopfen.'); }
    case 'bpref': { const p = A().prefs = A().prefs || {}; p[v] = !(p[v] !== undefined ? p[v] : v !== 'urlaub'); S._pop = { act: name, v: v, k: '' }; render(); return toast(v === 'urlaub' ? (p.urlaub ? 'Urlaubsmodus an' : 'Urlaubsmodus aus') : 'Gespeichert'); }
    case 'plan-upgrade': { A().plan = 'portal'; A().konto = 'ppk'; A().guthaben = Math.max(A().guthaben, 100); const own = (S.myCompanies || []).find((x) => x.id === S.cur); if (own) { own.plan = 'portal'; A().verified = false; own.verified = false; } else { A().verified = true; } S.sheet = null; nav('markt'); return toast('Portal freigeschaltet'); }
    case 'f-reset': { S.filt = { km: A().einsatz || 35, budget: '', minF: 0, zeit: '', sort: 'neu', q: '' }; return render(); }
    /* Fensterbauer: Kundenlinks */
    case 'lfilt': { S.lfilt = v; return render(); }
    case 'nl-set': { const n = S.nl; if (!n) return; const k = el.getAttribute('data-k'); n[k] = n[k] === v ? '' : v; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'nl-plan': { const n = S.nl; if (!n) return; const arr = n.plan || []; n.plan = arr.indexOf(v) >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'nl-days': { S.nl.days = +v; return render(); }
    case 'nl-du': { S.nl.du = v === 'du'; return render(); }
    case 'nl-create': {
      const n = S.nl; n.err = {};
      if (String(n.kunde || '').trim().length < 2) { n.err.kunde = 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.'; S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); } return; }
      const l = { id: 'l' + Date.now().toString(36), code: newCode(), nr: nextNr(), kunde: n.kunde.trim(), kontakt: String(n.kontakt || '').trim(), adresse: String(n.adresse || '').trim(), geb: n.geb || '', fz: n.fz || '', plan: (n.plan || []).slice(), note: String(n.note || '').trim(), created: 'heute', days: n.days || 14, expires: dateIn(n.days || 14), status: 'erstellt', progress: 0, via: '', du: !!n.du, log: { erstellt: stamp() } };
      A().links.unshift(l); S.nl = null; S.justCreated = l.id; S._feier = 'projekt'; S.hist = S.hist.filter((h) => h[0] !== 'newlink'); S.screen = 'links'; go('link', l.id); setTimeout(() => { if (S.justCreated === l.id) { S.justCreated = null; } }, 6000); return;
    }
    case 'l-share': {
      const l = findLink(); if (!l) return;
      if (v === 'link' || v === 'Text') { copyText(v === 'link' ? linkURL(l) : linkMsg(l), v === 'link' ? 'Link kopiert' : 'Nachricht kopiert'); }
      if (l.status === 'erstellt') { l.status = 'gesendet'; l.via = v === 'link' ? 'Link kopiert' : v === 'Text' ? 'Text kopiert' : v; l.log.gesendet = stamp(); S._feier = 'gesendet'; setTimeout(() => refresh(), 400); }
      return;
    }
    case 'l-du': { const l = A().links.find((x) => x.id === S.sel); if (!l) return; l.du = v === 'du'; l.msg = ''; return render(); }
    case 'l-reset-msg': { const l = findLink(); if (l) l.msg = ''; return render(); }
    case 'l-sim': { const l = findLink(); if (!l) return; if (l.status === 'erstellt') { l.status = 'gesendet'; l.via = l.via || 'WhatsApp'; l.log.gesendet = stamp(); } simLink(l, S.cur); render(); return toast('Demo: Der Kunde öffnet den Link'); }
    case 'l-deact': { const l = findLink(); if (l && l.status === 'eingegangen') { S.sheet = null; render(); return toast('Ein eingegangenes Aufmaß bleibt im Projekt und in der Abrechnung'); } if (l) l.status = 'deaktiviert'; S.sheet = null; render(); return toast('Link deaktiviert'); }
    case 'l-stage': { const l = findLink(); if (l) l.stage = v; S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'nl-next': { const n = S.nl; if (!n) return; n.err = {}; if (String(n.kunde || '').trim().length < 2) { n.err.kunde = 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.'; S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); } return; } n.step = 1; S.dir = 'fwd'; return render(); }
    case 'nl-prev': { if (S.nl) { S.nl.step = 0; S.dir = 'back'; } return render(); }
    case 'l-days': { const l = findLink(); if (l) { l.days = +v; l.expires = dateIn(+v); } S._pop = { act: name, v: v, k: '' }; render(); return toast('Link gilt ' + v + ' Tage'); }
    case 'l-again': { const l = findLink(); S.nl = { step: 0, kunde: l ? l.kunde.replace(/^Beispiel:\s*/, '') : '', kontakt: l ? l.kontakt || '' : '', adresse: l ? l.adresse || '' : '', geb: l ? l.geb || '' : '', fz: l ? l.fz || '' : '', plan: l ? (l.plan || []).slice() : ['Fenster'], note: '', days: 14, du: l ? !!l.du : false, err: {} }; return go('newlink'); }
    case 'demo-project': { const ex = A().links.find((x) => x.demo); if (ex) return go('link', ex.id); const l = { id: 'l' + Date.now().toString(36), code: newCode(), nr: 'Beispiel', demo: true, kunde: 'Beispiel: Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster', 'Rollläden'], note: 'Beispielprojekt, wird nicht berechnet', created: 'heute', expires: dateIn(14), status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: stamp(), gesendet: stamp(), geoeffnet: stamp(), arbeit: stamp(), eingegangen: stamp() }, aufmass: aufmassOf(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' })), stage: 'neu', seen: true }; A().links.push(l); go('link', l.id); return toast('Beispiel: So kommt ein Aufmaß bei Ihnen an'); }
    case 'copy-am': { const l = findLink(); if (l && !l.locked) copyText(aufmassText(l), 'Aufmaß als Text kopiert'); return; }
    case 'pdf-am': { const l = findLink(); if (l && !l.locked) saveAm(l); return; }
    case 'pay-type': { if (S.sheet) { S.sheet.type = v; S.sheet.err = {}; } return render(); }
    case 'pay-fill': { if (S.sheet) { S.sheet.inhaber = BC().name; S.sheet.iban = 'DE89 3704 0044 0532 0130 00'; S.sheet.mandat = true; S.sheet.err = {}; } return render(); }
    case 'pay-save': {
      const s = S.sheet; if (!s) return; const t = s.type || 'sepa', err = {};
      if (String(s.inhaber || '').trim().length < 2) err.inhaber = t === 'sepa' ? 'Bitte den Kontoinhaber eingeben.' : 'Bitte den Karteninhaber eingeben.';
      if (t === 'sepa' && !ibanOk(s.iban)) err.iban = 'Diese IBAN stimmt nicht. Bitte prüfen: DE und 20 Ziffern.';
      if (t === 'sepa' && !s.mandat) err.mandat = 'Bitte das Mandat bestätigen.';
      s.err = err; if (Object.keys(err).length) return render();
      const a = A(), then = s.then;
      a.pay = t === 'sepa' ? { type: 'SEPA-Firmenlastschrift', label: ibanMask(s.iban), inhaber: String(s.inhaber).trim(), when: stamp() } : { type: 'Kreditkarte', label: 'über Zahlungsdienstleister', inhaber: String(s.inhaber).trim(), when: stamp() };
      S.sheet = null;
      const n = then === 'plus' ? activatePlus(a) : unlockWaiting(a);
      save(); render();
      return toast(then === 'plus' ? 'Betrieb Plus aktiv' + (n ? ', ' + nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : '') : n ? nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : 'Zahlungsart gespeichert');
    }
    case 'pos-all': { const ds = Array.from(document.querySelectorAll('.poslist details')), open = ds.some((d) => !d.open); ds.forEach((d) => { d.open = open; }); el.textContent = open ? 'Alle zuklappen' : 'Alle aufklappen'; return; }
    case 'linkimport': {
      const ta = document.getElementById('code-in'), o = unpack(ta ? ta.value : '');
      if (!o) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.'); }
      let l = o.b ? A().links.find((x) => x.code === o.b) : null;
      if (o.b && !l) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Dieser Code gehört zu keinem Ihrer Projekte.'); }
      if (l && l.status === 'eingegangen') { S.sheet = null; go('link', l.id); return toast('Dieses Aufmaß ist schon eingegangen.'); }
      if (l && l.status === 'deaktiviert') { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Dieser Link wurde deaktiviert. Für ein neues Aufmaß legen Sie ein neues Projekt an.'); }
      const fp = fingerprint(o), schon = A().links.find((x) => x.aufmass && x.aufmass.fp === fp);
      if (schon) { S.sheet = null; go('link', schon.id); return toast('Dieses Aufmaß ist schon da: ' + schon.kunde); }
      const war = l && l.status === 'abgelaufen';
      const wins = (o.w || []).map(fromApp), p = o.p || {};
      if (!l) { l = { id: 'l' + Date.now().toString(36), code: newCode(), nr: nextNr(), kunde: p.name || 'Kunde ohne Projekt', kontakt: p.tel || p.mail || '', adresse: p.ort || '', geb: '', fz: '', plan: [], note: 'direkt vom Kunden, per Code übernommen', created: 'heute', expires: dateIn(14), status: 'gesendet', progress: 0, via: 'Code', du: false, log: { erstellt: stamp(), gesendet: stamp() } }; A().links.unshift(l); }
      l.seen = true; S.justCreated = null; l.log.gesendet = l.log.gesendet || stamp(); l.log.geoeffnet = l.log.geoeffnet || stamp(); l.log.arbeit = l.log.arbeit || stamp();
      const am = aufmassOf(wins, fromAppProj(p)); am.fp = fp;
      const ok = receiveAufmass(A(), S.cur, l, am, 'Code');
      S.sheet = null; S._feier = ok ? 'eingang' : ''; go('link', l.id); return toast(ok ? (war ? 'Link war abgelaufen, Aufmaß trotzdem übernommen: ' : 'Aufmaß übernommen: ') + l.kunde : 'Aufmaß übernommen. Zum Ansehen Zahlungsart hinterlegen');
    }
    case 'copy': return copyText(v, 'Kopiert');
    default: return;
  }
}
function copyText(text, ok) {
  try { navigator.clipboard.writeText(text).then(() => toast(ok), () => fallbackCopy(text, ok)); } catch (e) { fallbackCopy(text, ok); }
}
function fallbackCopy(text, ok) {
  const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
  let done = false; try { done = document.execCommand('copy'); } catch (e) { done = false; }
  ta.remove(); toast(done ? ok : 'Bitte den Text markieren und kopieren');
}
/* ---------- Eingaben ---------- */
function onInput(el, ev) {
  const k = el.getAttribute('data-in'), v = el.type === 'checkbox' ? el.checked : el.value, i = k.indexOf(':'), ns = i >= 0 ? k.slice(0, i) : k, f = i >= 0 ? k.slice(i + 1) : '';
  if (ns === 'r') { const r = S.reg; if (!r) return; r.d[f] = f === 'km' ? +v : v; if (f === 'km') { const lab = document.getElementById('km-reg'); if (lab) lab.textContent = v; } if (r.err && r.err[f]) { delete r.err[f]; const box = el.closest('.f, .agree'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } if (f === 'agb' && ev.type === 'change') { const er = document.querySelector('.agree + .err'); if (er && v) er.remove(); } return; }
  if (ns === 'lg') { if (S.sheet) S.sheet[f] = v; return; }
  if (ns === 'nl') { if (!S.nl) return; S.nl[f] = v; if (S.nl.err && S.nl.err[f]) { delete S.nl.err[f]; const box = el.closest('.f'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } if (f === 'kunde') pvUpdate(); return; }
  if (ns === 'lmsg') { const l = A().links.find((x) => x.id === f); if (l) l.msg = v; return; }
  if (ns === 'pay') { if (!S.sheet) return; S.sheet[f] = v; if (S.sheet.err && S.sheet.err[f]) { delete S.sheet.err[f]; const box = el.closest('.f, .agree'); if (box) { box.classList.remove('has-err'); const er = box.nextElementSibling && box.nextElementSibling.classList.contains('err') ? box.nextElementSibling : box.querySelector('.err'); if (er) er.remove(); } } return; }
  if (ns === 'pnote') { if (ev.type !== 'change') return; const l = A().links.find((x) => x.id === f); if (l) { l.note = v; save(); toast('Notiz gespeichert'); } return; }
  if (ns === 'ab') { const ab = A().abzug || (A().abzug = { seite: 15, oben: 15 }); ab[f] = Math.max(0, Math.min(60, parseInt(v, 10) || 0)); const ex = document.getElementById('ab-ex'); if (ex) ex.textContent = abEx(ab); if (ev.type === 'change') { save(); toast('Gespeichert'); } return; }
  if (k.indexOf('roi-') === 0) { S.roi = S.roi || { n: 12, t: 75, r: 65 }; S.roi[k.slice(4)] = +v; const r = S.roi, vv = roiVals(r.n, r.t, r.r), put = (i, t) => { const e2 = document.getElementById(i); if (e2) e2.textContent = t; }; put('roi-n-l', String(r.n)); put('roi-t-l', r.t + ' Min.'); put('roi-r-l', r.r + '\u00a0€'); put('roi-c', eur(vv.cost)); put('roi-h', vv.hours + ' Stunden unterwegs und beim Kunden'); put('roi-l', eur(vv.lm)); put('roi-lp', vv.plan); return; }
  if (ns === 'lmemo') { if (ev.type !== 'change') return; const l = A().links.find((x) => x.id === f); if (l) { l.memo = v; save(); toast('Notiz gespeichert'); } return; }
  if (ns === 'note') { if (ev.type !== 'change') return; A().kontakte[f] = Object.assign(A().kontakte[f] || { stage: 'kontakt' }, { note: v }); save(); return toast('Notiz gespeichert'); }
  if (ns === 'k') { if (ev.type !== 'change') return; if (f === 'plz' && !/^\d{5}$/.test(String(v).trim())) { el.classList.add('bad'); return toast('Bitte eine fünfstellige Postleitzahl eingeben'); } K()[f] = String(v).trim(); save(); return toast('Gespeichert'); }
  if (ns === 'b') { if (ev.type !== 'change') return; A()[f] = String(v).trim(); save(); return toast('Gespeichert'); }
  if (k === 'einsatz') { A().einsatz = +v; S.filt.km = +v; const lab = document.getElementById('einsatz-lab'); if (lab) lab.textContent = v; if (ev.type === 'change') { save(); toast('Einsatzgebiet: ' + v + ' km'); } return; }
  if (k.indexOf('af-') === 0) { const key = k.slice(3); S.af[key] = v; if (key === 'q' && ev.type === 'input') { clearTimeout(onInput.t); onInput.t = setTimeout(() => { render(); const inp = document.querySelector('[data-in="af-q"]'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }, 250); return; } if (ev.type === 'change') render(); return; }
  if (k.indexOf('f-') === 0) {
    const key = k.slice(2); S.filt[key] = key === 'km' || key === 'minF' ? +v : v;
    if (key === 'km' && ev.type !== 'change') { const rad = document.querySelector('.radar'), lab = document.getElementById('km-lab'); if (lab) lab.textContent = v + ' km'; if (rad) { const sc = +rad.getAttribute('data-sc'), ring = rad.querySelector('[data-r="ring"]'); if (ring) ring.setAttribute('r', (+v * sc).toFixed(1)); rad.querySelectorAll('.pt').forEach((pt) => pt.classList.toggle('out', +pt.getAttribute('data-km') > +v)); } return; }
    if (key === 'q' && ev.type === 'input') { clearTimeout(onInput.t); onInput.t = setTimeout(() => { render(); const inp = document.querySelector('[data-in="f-q"]'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }, 250); return; }
    if (ev.type === 'change') render(); return;
  }
}
const root = document.getElementById('app');
root.addEventListener('click', (e) => {
  const el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el || el.disabled) return;
  if (el.tagName !== 'A') e.preventDefault();
  const name = el.getAttribute('data-act');
  if (el.classList.contains('btn')) { const r = el.getBoundingClientRect(); el.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100).toFixed(0) + '%'); el.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100).toFixed(0) + '%'); }
  if (name === 'l-share' && el.tagName === 'A') { const l = A().links.find((x) => x.id === el.getAttribute('data-id')); if (l) { const v = el.getAttribute('data-v'), msg = encodeURIComponent(linkMsg(l)); el.href = v === 'WhatsApp' ? 'https://wa.me/' + (isPhone(l.kontakt) ? intl(l.kontakt) : '') + '?text=' + msg : v === 'SMS' ? 'sms:' + (isPhone(l.kontakt) ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + msg : 'mailto:' + (/@/.test(l.kontakt || '') ? l.kontakt : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + msg; } }
  if (name === 'knock' && !el.classList.contains('is-knocking')) { el.classList.add('is-knocking'); setTimeout(() => act(name, el), 560); return; }
  if (name === 'release') { const card = el.closest('.card'); if (card && !card.classList.contains('is-releasing')) { card.classList.add('is-releasing'); card.insertAdjacentHTML('beforeend', '<span class="burst">' + Array.from({ length: 10 }, (_, i) => '<i style="--bx: ' + Math.round(Math.cos(i / 10 * Math.PI * 2) * 90) + 'px; --by: ' + Math.round(Math.sin(i / 10 * Math.PI * 2) * 70) + 'px; animation-delay: ' + (i * 20) + 'ms"></i>').join('') + '</span><span class="bigcheck">' + ICONS.check + '</span>'); setTimeout(() => act(name, el), 720); return; } }
  if (name === 'decline') { const card = el.closest('.card'); if (card && !card.classList.contains('is-leaving')) { card.classList.add('is-leaving'); setTimeout(() => act(name, el), 380); return; } }
  act(name, el);
});
root.addEventListener('submit', (e) => { e.preventDefault(); const f = e.target.getAttribute('data-form'); if (f === 'login') act('login-submit', e.target); if (f === 'reg') act('reg-next', e.target); if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', e.target); });
root.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.sheet) { S.sheet = null; render(); }
  if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') { const form = e.target.closest('form'); if (form) { e.preventDefault(); const f = form.getAttribute('data-form'); if (f === 'login') act('login-submit', form); else if (f === 'reg') act('reg-next', form); else if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', form); } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('pt')) { e.preventDefault(); act(e.target.getAttribute('data-act'), e.target); }
});
root.addEventListener('input', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
root.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
tick();
setInterval(tick, 60000);
render();


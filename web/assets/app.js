'use strict';
const INK = '#1d1d1f', SUB = '#6e6e73', GL = '#d6e6f4', FR = '#ffffff', MUT = '#a1a1a6', WALL = '#ddd6cb';
const n1 = (v) => Math.round(v * 10) / 10;
const R = (x, y, w, h, r) => {
  r = r || 0;
  if (!r) return 'M' + n1(x) + ' ' + n1(y) + 'h' + n1(w) + 'v' + n1(h) + 'h' + n1(-w) + 'Z';
  return 'M' + n1(x + r) + ' ' + n1(y) + 'h' + n1(w - 2 * r) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'v' + n1(h - 2 * r) +
    'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r + 'h' + n1(-(w - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + (-r) +
    'v' + n1(-(h - 2 * r)) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + (-r) + 'Z';
};
const L = (...p) => 'M' + p.map((q) => n1(q[0]) + ' ' + n1(q[1])).join('L');
const LZ = (...p) => L(...p) + 'Z';
const C = (cx, cy, r) => 'M' + n1(cx - r) + ' ' + n1(cy) + 'a' + r + ' ' + r + ' 0 1 0 ' + n1(2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + n1(-2 * r) + ' 0Z';
const P = (d, f, s, w, da, o) => ({ d: d, f: f || 'none', s: s || 'none', w: w == null ? 1.6 : w, da: da, o: o == null ? 1 : o });

/* Öffnungssymbol: Linien starten an den Ecken der Bandseite, die Spitze zeigt zum Griff. Kippen: Spitze oben. */
function sym(x, y, w, h, t, din, da, col, sw) {
  const o = []; col = col || INK; sw = sw || 1;
  if (t === 'D' || t === 'DK') o.push(P(din === 'L' ? L([x, y], [x + w, y + h / 2], [x, y + h]) : L([x + w, y], [x, y + h / 2], [x + w, y + h]), 'none', col, sw, da));
  if (t === 'K' || t === 'DK') o.push(P(L([x, y + h], [x + w / 2, y], [x + w, y + h]), 'none', col, sw, da));
  return o;
}
function shp(form, x, y, w, h) {
  if (form === 'rundbogen') { const r = w / 2; return 'M' + n1(x) + ' ' + n1(y + h) + 'V' + n1(y + r) + 'A' + n1(r) + ' ' + n1(r) + ' 0 0 1 ' + n1(x + w) + ' ' + n1(y + r) + 'V' + n1(y + h) + 'Z'; }
  if (form === 'segment') return 'M' + n1(x) + ' ' + n1(y + h) + 'V' + n1(y + h * 0.22) + 'Q' + n1(x + w / 2) + ' ' + n1(y - h * 0.1) + ' ' + n1(x + w) + ' ' + n1(y + h * 0.22) + 'V' + n1(y + h) + 'Z';
  if (form === 'schraeg') return LZ([x, y + h], [x, y + h * 0.42], [x + w, y], [x + w, y + h]);
  if (form === 'rund') return C(x + w / 2, y + h / 2, Math.min(w, h) / 2);
  return R(x, y, w, h, 1.5);
}
function shapeIco(form, x, y, w, h) {
  return [P(shp(form, x, y, w, h), FR, INK, 1.4), P(shp(form, x + 3.2, y + 3.2, w - 6.4, h - 6.4), GL, INK, 0.8)];
}
/* Fenster als Pfadliste – für Karten, Projektliste und Aufmaßblatt */
function winIco(c, bx, by, bw, bh, fc) {
  if (c.form && c.form !== 'rechteck') return shapeIco(c.form, bx, by, bw, bh);
  fc = fc || FR; const o = [], da = c.richtung === 'aussen' ? '3 2' : undefined;
  o.push(P(R(bx, by, bw, bh, 1.2), fc, INK, 1.3));
  const f = Math.max(2, bw * 0.06); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
  if (c.ol) { const oh = ih * 0.27; o.push(P(R(ix, iy, iw, oh), GL, INK, 0.7)); o.push(...sym(ix, iy, iw, oh, c.olT || 'K', 'L', da, INK, 0.7)); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
  const n = c.sashes.length, gap = c.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
  c.sashes.forEach((s, i) => {
    const sx = ix + i * (sw + gap), g = s.t === 'F' ? 0 : Math.max(1.5, sw * 0.09);
    if (s.t !== 'F') o.push(P(R(sx, iy, sw, ih), fc, INK, 0.8));
    const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
    o.push(P(R(gx, gy, gw, gh), GL, INK, 0.6));
    (c.bars || []).filter((b) => b.s === i).forEach((b) => o.push(P(b.d === 'v' ? L([gx + gw * b.p, gy], [gx + gw * b.p, gy + gh]) : L([gx, gy + gh * b.p], [gx + gw, gy + gh * b.p]), 'none', INK, 1)));
    o.push(...sym(gx, gy, gw, gh, s.t, s.din, da, INK, 0.75));
  });
  return o;
}
/* ---------- Icon-Bibliothek (64 × 64) ---------- */
const ICO = {
  typ: (t) => winIco({ teilung: '1', sashes: [{ t: t, din: 'L' }] }, 14, 8, 36, 48),
  layout: (k) => winIco({ teilung: k, sashes: k === '1' ? [{ t: 'DK', din: 'L' }] : k === '3' ? [{ t: 'DK', din: 'L' }, { t: 'F' }, { t: 'DK', din: 'R' }] : k === '2s' ? [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }] : [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }] }, k === '3' ? 4 : 8, 10, k === '3' ? 56 : 48, 44),
  form: (f) => shapeIco(f, 14, 8, 36, 48),
  anschlag: (k) => {
    const o = [];
    if (k === 'ohne') { o.push(P(R(4, 14, 18, 36), WALL, INK, 0.8), P(R(42, 14, 18, 36), WALL, INK, 0.8), P(R(23, 28, 18, 8, 1), FR, INK, 1.1)); }
    if (k === 'innen') { o.push(P(LZ([4, 14], [20, 14], [20, 30], [26, 30], [26, 50], [4, 50]), WALL, INK, 0.8), P(LZ([60, 14], [44, 14], [44, 30], [38, 30], [38, 50], [60, 50]), WALL, INK, 0.8), P(R(21, 22, 22, 8, 1), FR, INK, 1.1)); }
    if (k === 'aussen') { o.push(P(LZ([4, 14], [26, 14], [26, 30], [20, 30], [20, 50], [4, 50]), WALL, INK, 0.8), P(LZ([60, 14], [38, 14], [38, 30], [44, 30], [44, 50], [60, 50]), WALL, INK, 0.8), P(R(21, 30, 22, 8, 1), FR, INK, 1.1)); }
    const gy = k === 'innen' ? 26 : k === 'aussen' ? 34 : 32;
    o.push(P(L([24, gy], [40, gy]), 'none', '#5b9bd5', 2));
    o.push(P(L([30, 4], [32, 1.5], [34, 4]), 'none', MUT, 1.2), P(L([30, 60], [32, 62.5], [34, 60]), 'none', MUT, 1.2));
    return o;
  },
  material: (m) => {
    if (m === 'kunststoff') return [P(R(16, 10, 32, 44, 4), FR, INK, 1.3), P(R(21, 15, 9, 15, 1.5), 'none', MUT, 0.9), P(R(34, 15, 9, 15, 1.5), 'none', MUT, 0.9), P(R(21, 34, 22, 14, 1.5), 'none', MUT, 0.9)];
    if (m === 'holz') return [P(R(16, 10, 32, 44, 3), '#d9b48a', INK, 1.3), P('M20 16c6 6 6 14 0 20M27 12c5 10 5 22 0 38M35 14c4 8 4 20 0 34M42 18c3 6 3 16 0 26', 'none', '#a3763f', 1)];
    if (m === 'holzalu') return [P(R(22, 10, 26, 44, 3), '#d9b48a', INK, 1.3), P('M27 16c5 10 5 22 0 34M36 14c4 8 4 22 0 34', 'none', '#a3763f', 1), P(R(13, 8, 9, 48, 2), '#c8cdd2', INK, 1.3)];
    return [P(R(20, 10, 24, 44, 2), '#c8cdd2', INK, 1.3), P(L([32, 12], [32, 52]), 'none', INK, 1, '3 2'), P(R(24, 16, 5, 10, 1), 'none', MUT, 0.8), P(R(35, 16, 5, 10, 1), 'none', MUT, 0.8)];
  },
  spross: (k) => {
    const o = [];
    if (k === 'echt') o.push(P(L([24, 6], [24, 22]), 'none', '#5b9bd5', 3), P(L([40, 6], [40, 22]), 'none', '#5b9bd5', 3), P(L([24, 42], [24, 58]), 'none', '#5b9bd5', 3), P(L([40, 42], [40, 58]), 'none', '#5b9bd5', 3), P(R(16, 22, 32, 20, 2), FR, INK, 1.3));
    else o.push(P(L([24, 6], [24, 58]), 'none', '#5b9bd5', 3), P(L([40, 6], [40, 58]), 'none', '#5b9bd5', 3));
    if (k === 'wiener' || k === 'auf') o.push(P(R(13, 25, 9, 14, 2), FR, INK, 1.2), P(R(42, 25, 9, 14, 2), FR, INK, 1.2));
    if (k === 'wiener') o.push(P(R(27, 27, 10, 10), '#3a3a3c', INK, 0.8));
    if (k === 'szr') o.push(P(R(27, 26, 10, 12, 1.5), FR, INK, 1.2));
    return o;
  },
  preset: (k) => {
    const o = [P(R(14, 8, 36, 48, 1.2), FR, INK, 1.3), P(R(18, 12, 28, 40), GL, INK, 0.7)], v = (x) => o.push(P(L([18 + 28 * x, 12], [18 + 28 * x, 52]), 'none', INK, 1.4)), h = (y) => o.push(P(L([18, 12 + 40 * y], [46, 12 + 40 * y]), 'none', INK, 1.4));
    if (k === 'kreuz') { v(0.5); h(0.5); }
    if (k === 'sechs') { v(0.5); h(1 / 3); h(2 / 3); }
    if (k === 'quer') h(0.3);
    if (k === 'senk') { v(1 / 3); v(2 / 3); }
    return o;
  },
  ref: (k) => {
    if (k === 'karte') return [P(R(10, 19, 44, 27, 4), '#2f6db5', INK, 1), P(R(16, 27, 8, 7, 1.5), '#e3c46b'), P(L([16, 39], [36, 39]), 'none', '#ffffff', 1.4, null, 0.8)];
    if (k === 'a4') return [P(LZ([18, 6], [40, 6], [48, 14], [48, 58], [18, 58]), FR, INK, 1.3), P(L([40, 6], [40, 14], [48, 14]), 'none', INK, 1.1), P(L([23, 24], [43, 24]), 'none', MUT, 1), P(L([23, 30], [43, 30]), 'none', MUT, 1), P(L([23, 36], [37, 36]), 'none', MUT, 1)];
    return [P(C(32, 32, 17), 'none', MUT, 1.6), P(L([20, 44], [44, 20]), 'none', MUT, 1.6)];
  },
  glas: (k) => {
    const xs = k === '3' ? [22, 32, 42] : [26, 38], o = [P(R(12, 4, 40, 6, 1.5), FR, INK, 1), P(R(12, 54, 40, 6, 1.5), FR, INK, 1)];
    xs.forEach((x) => o.push(P(L([x, 10], [x, 54]), 'none', '#5b9bd5', 3)));
    return o;
  },
  griff: (k) => {
    const o = [P(R(26, 6, 12, 24, 5), FR, INK, 1.3), P(R(29, 18, 6, 40, 3), FR, INK, 1.3)];
    if (k === 'abschliessbar') o.push(P(C(32, 12, 2.4), INK), P(L([32, 12], [32, 15.5]), 'none', INK, 1.4));
    if (k === 'druckknopf') o.push(P(C(32, 24, 2.6), '#5b9bd5', INK, 1));
    return o;
  },
  roll: (k) => {
    const o = [P(R(14, 2, 36, 10), WALL, INK, 0.8), P(R(14, 54, 36, 8), WALL, INK, 0.8)];
    if (k === 'aufsatz') o.push(P(R(24, 12, 16, 11, 2), FR, INK, 1.2), P(R(28, 23, 8, 31), FR, INK, 1.1));
    else if (k === 'vorbau') o.push(P(R(28, 12, 8, 42), FR, INK, 1.1), P(R(50, 12, 11, 12, 2), FR, INK, 1.2), P(L([55.5, 24], [55.5, 34]), 'none', INK, 1, '2 2'));
    else if (k === 'behalten') o.push(P(R(14, 2, 36, 18), WALL, INK, 0.8), P(R(26, 6, 16, 11, 2), FR, INK, 1, '2 1.5'), P(R(28, 20, 8, 34), FR, INK, 1.1));
    else o.push(P(R(28, 12, 8, 42), FR, INK, 1.1));
    o.push(P(L([32, k === 'aufsatz' ? 25 : k === 'behalten' ? 22 : 14], [32, 52]), 'none', '#5b9bd5', 1.6));
    return o;
  },
  insekt: (k) => {
    const o = [P(R(12, 6, 40, 52, 2), FR, INK, 1.3)];
    if (k === 'keiner') { o.push(P(R(17, 11, 30, 42), GL, INK, 0.7)); return o; }
    let mesh = '';
    for (let x = 20; x < 47; x += 4) mesh += L([x, 11], [x, 53]);
    for (let y = 14; y < 53; y += 4) mesh += L([17, y], [47, y]);
    o.push(P(R(17, 11, 30, 42), '#eef1f4', INK, 0.7));
    if (k === 'plissee') { let z = 'M17 11'; for (let y = 11; y <= 53; y += 3) z += 'L' + (y % 6 === 5 ? 21 : 17) + ' ' + y; o.push(P(z, 'none', INK, 0.9), P(L([22, 11], [22, 53]), 'none', INK, 1.4)); }
    else o.push(P(mesh, 'none', MUT, 0.5));
    if (k === 'dreh') o.push(P(R(10, 16, 3, 7, 1), INK), P(R(10, 41, 3, 7, 1), INK), P('M52 58A40 40 0 0 0 52 18', 'none', MUT, 1, '2 2'));
    return o;
  },
  bank: (k) => k === 'aussen' ? [P(R(6, 30, 40, 24), WALL, INK, 0.8), P(R(30, 8, 8, 22), FR, INK, 1.1), P(LZ([38, 30], [60, 32], [60, 35], [38, 33]), '#c8cdd2', INK, 1)] : [P(R(18, 30, 40, 24), WALL, INK, 0.8), P(R(26, 8, 8, 22), FR, INK, 1.1), P(R(4, 30, 22, 5, 1), '#efe9df', INK, 1)],
  check: () => [P(C(32, 32, 26), '#e8f5ec'), P(L([20, 33], [28, 41], [45, 23]), 'none', '#1f7a3d', 4)]
};
/* ---------- Demo-Fotos (300 × 350) ---------- */
/* Maßstäblich gezeichnet: Fensterebene 6,989 mm je Einheit (Rahmen 1.230 × 1.426 mm),
   Wandebene 15 cm näher an der Kamera (6,447 mm je Einheit), Objektiv 26 mm Kleinbild-Äquivalent. */
function sceneIn(ref) {
  const o = [P(R(0, 0, 300, 350), '#ebe6de'), P(R(0, 322, 300, 28), '#cdb79d'), P(L([0, 322], [300, 322]), 'none', '#b9a283', 1)];
  o.push(P(LZ([52, 38], [248, 38], [238, 48], [62, 48]), '#d9d1c5'), P(LZ([52, 38], [62, 48], [62, 252], [52, 252]), '#e2dbd0'), P(LZ([248, 38], [248, 252], [238, 252], [238, 48]), '#d3cbbf'));
  o.push(P(R(62, 48, 176, 204, 1), '#f7f7f5', '#c9c3ba', 1));
  [[70, 56], [152, 56]].forEach(([x, y], i) => {
    o.push(P(R(x, y, 78, 188, 1), '#fbfbfa', '#d5d0c8', 1));
    o.push(P(R(x + 7, y + 7, 64, 174), '#c4d9eb'), P(R(x + 7, y + 120, 64, 61), '#a7c19d'), P(C(x + (i ? 50 : 22), y + 112, 17), '#87a67f'), P(C(x + (i ? 26 : 44), y + 118, 13), '#7d9c76'));
    o.push(P(R(i ? x + 3 : x + 72, y + 86, 3, 16, 1.5), '#e9e7e3', '#bdb7ad', 0.8));
  });
  o.push(P(R(148, 56, 4, 188), '#f2f1ee', '#d5d0c8', 0.8));
  o.push(P(R(50, 252, 200, 8, 2), '#fdfdfc', '#d0cac0', 1));
  o.push(P(R(88, 268, 124, 48.2, 3), '#f4f3f0', '#cfc9c0', 1));
  let ribs = ''; for (let x = 96; x < 210; x += 8) ribs += L([x, 271], [x, 313]);
  o.push(P(ribs, 'none', '#d9d4cc', 1));
  o.push(P(R(262, 292, 12.4, 12.4, 1.6), '#fbfbfa', '#b9b3a9', 0.7), P(C(268.2, 298.2, 3.6), 'none', '#c4beb4', 0.6), P(C(266.7, 298.2, 0.7), '#8f8a83'), P(C(269.7, 298.2, 0.7), '#8f8a83'));
  o.push(P(R(262, 170, 12.4, 12.4, 1.6), '#fbfbfa', '#b9b3a9', 0.7), P(R(264.6, 172.6, 7.2, 7.2, 0.8), '#f1efeb', '#c9c3ba', 0.5));
  if (ref === 'karte') o.push(P(R(96, 240.6, 12.25, 7.72, 0.6), '#2f6db5'), P(R(97.5, 243.1, 2, 1.6, 0.3), '#e3c46b'));
  if (ref === 'a4') o.push(P(R(92, 150, 30.05, 42.5, 0.3), '#ffffff', '#c9c3ba', 0.5), P(L([96, 158], [118, 158]) + L([96, 163], [118, 163]) + L([96, 168], [112, 168]), 'none', '#c7c7cc', 0.6));
  return o;
}
function sceneOut() {
  const o = [P(R(0, 0, 300, 350), '#a9553d')];
  let mortar = '';
  for (let y = 10, k = 0; y < 350; y += 10, k++) { mortar += L([0, y], [300, y]); for (let x = (k % 2 ? 12 : 0); x < 300; x += 24) mortar += L([x, y - 10], [x, y]); }
  o.push(P(mortar, 'none', '#d4c1ad', 1, null, 0.85));
  o.push(P(R(56, 40, 188, 220), '#6e3426'), P(R(60, 44, 180, 18), '#d9dadc', '#b5b7ba', 1));
  o.push(P(R(66, 62, 168, 190), '#f1f1ef', '#b9b9b9', 1));
  [[74, 70], [154, 70]].forEach(([x, y]) => { o.push(P(R(x, y, 72, 174), '#eeeeec', '#c4c4c4', 0.8), P(R(x + 7, y + 7, 58, 160), '#5f7589'), P(LZ([x + 7, y + 60], [x + 46, y + 7], [x + 65, y + 7], [x + 7, y + 100]), '#8399ac', null, 0, null, 0.45)); });
  o.push(P(LZ([50, 252], [250, 252], [252, 262], [48, 262]), '#c8cdd2', '#9aa0a6', 1));
  return o;
}
const WOOD = (a, b, c, d) => 'repeating-linear-gradient(100deg, ' + a + ' 0px, ' + b + ' 3px, ' + c + ' 6px, ' + d + ' 9px)';
const COLORS = [
  { k: '9016', name: 'Verkehrsweiß', code: 'RAL 9016', bg: '#f1f0ea', solid: '#f1f0ea' },
  { k: '9001', name: 'Cremeweiß', code: 'RAL 9001', bg: '#e9e0cf', solid: '#e9e0cf' },
  { k: '7035', name: 'Lichtgrau', code: 'RAL 7035', bg: '#cbd0cc', solid: '#cbd0cc' },
  { k: '7039', name: 'Quarzgrau', code: 'RAL 7039', bg: '#6c6960', solid: '#6c6960' },
  { k: '7012', name: 'Basaltgrau', code: 'RAL 7012', bg: '#575d5e', solid: '#575d5e' },
  { k: '7016', name: 'Anthrazitgrau', code: 'RAL 7016', bg: '#383e42', solid: '#383e42' },
  { k: '9005', name: 'Tiefschwarz', code: 'RAL 9005', bg: '#141516', solid: '#141516' },
  { k: '8022', name: 'Schwarzbraun', code: 'RAL 8022', bg: '#2b2522', solid: '#2b2522' },
  { k: '6005', name: 'Moosgrün', code: 'RAL 6005', bg: '#1f4436', solid: '#1f4436' },
  { k: '5011', name: 'Stahlblau', code: 'RAL 5011', bg: '#1e2b3a', solid: '#1e2b3a' },
  { k: '3005', name: 'Weinrot', code: 'RAL 3005', bg: '#5e2129', solid: '#5e2129' },
  { k: 'goak', name: 'Golden Oak', code: 'Holzdekor', bg: WOOD('#b5732f', '#c4843c', '#a5652a', '#bd7b35'), solid: '#b5732f' },
  { k: 'nuss', name: 'Nussbaum', code: 'Holzdekor', bg: WOOD('#6b4428', '#7a5032', '#5a3820', '#70482b'), solid: '#6b4428' },
  { k: 'eiche', name: 'Eiche hell', code: 'Holzdekor', bg: WOOD('#c9a46b', '#d6b47c', '#b8935c', '#cfae73'), solid: '#c9a46b' },
  { k: 'mahag', name: 'Mahagoni', code: 'Holzdekor', bg: WOOD('#6f2f22', '#7e3a2b', '#5f261b', '#763427'), solid: '#6f2f22' }
];
const DARK = { '7039': 1, '7012': 1, '7016': 1, '9005': 1, '8022': 1, '6005': 1, '5011': 1, '3005': 1, nuss: 1, mahag: 1, goak: 1 };
const GLASS_BG = 'linear-gradient(165deg, #e4eff9 0%, #cadcee 58%, #b9d0e7 100%)';
const ORN = [
  { k: 'satinato', label: 'Satinato', sub: 'Milchglas-Optik', bg: 'repeating-linear-gradient(45deg, rgba(255,255,255,.45) 0px, rgba(255,255,255,.45) 2px, transparent 2px, transparent 4px), #dde6ee' },
  { k: 'chinchilla', label: 'Chinchilla', sub: 'Feine Struktur', bg: 'radial-gradient(circle at 3px 3px, rgba(255,255,255,.95) 1.2px, transparent 2px) 0 0 / 7px 7px, #c9d8e6' },
  { k: 'master', label: 'Mastercarré', sub: 'Kleines Raster', bg: 'linear-gradient(rgba(255,255,255,.75) 1px, transparent 1px) 0 0 / 8px 8px, linear-gradient(90deg, rgba(255,255,255,.75) 1px, transparent 1px) 0 0 / 8px 8px, #c4d4e3' }
];
const OPT = {
  ref: [{ k: 'karte', label: 'Bankkarte', sub: '85,6 × 54 mm' }, { k: 'a4', label: 'A4-Blatt', sub: '210 × 297 mm' }, { k: 'ohne', label: 'Ohne', sub: 'nur Schätzung' }],
  messart: [{ k: 'rahmen', label: 'Rahmenaußenmaß' }, { k: 'mauer', label: 'Maueröffnung' }],
  anschlag: [{ k: 'ohne', label: 'Ohne Anschlag', sub: 'Laibung glatt' }, { k: 'innen', label: 'Innenanschlag', sub: 'Mauer innen vor dem Rahmen' }, { k: 'aussen', label: 'Außenanschlag', sub: 'Mauer außen vor dem Rahmen' }],
  fassade: [{ k: 'putz', label: 'Putz' }, { k: 'klinker', label: 'Klinker' }, { k: 'wdvs', label: 'Gedämmt (WDVS)' }, { k: 'holz', label: 'Holz' }],
  etage: [{ k: 'kg', label: 'Keller' }, { k: 'eg', label: 'EG' }, { k: 'og', label: 'OG' }, { k: 'dg', label: 'DG' }],
  form: [{ k: 'rechteck', label: 'Rechteck' }, { k: 'rundbogen', label: 'Rundbogen' }, { k: 'segment', label: 'Segmentbogen' }, { k: 'schraeg', label: 'Schräg' }, { k: 'rund', label: 'Rund' }],
  teilung: [{ k: '1', label: '1 Flügel', sub: 'einteilig' }, { k: '2p', label: '2 Flügel', sub: 'mit Pfosten', g: 'pfosten' }, { k: '2s', label: '2 Flügel', sub: 'Stulp, ohne Pfosten', g: 'stulp' }, { k: '3', label: '3 Flügel', sub: 'Mitte fest' }],
  typ: [{ k: 'F', label: 'Fest', g: 'fest' }, { k: 'D', label: 'Dreh', g: 'symbol' }, { k: 'K', label: 'Kipp', g: 'kipp' }, { k: 'DK', label: 'Dreh-Kipp', g: 'dk' }],
  din: [{ k: 'L', label: 'DIN links' }, { k: 'R', label: 'DIN rechts' }],
  olT: [{ k: 'F', label: 'Oberlicht fest' }, { k: 'K', label: 'Oberlicht kippbar' }],
  richtung: [{ k: 'innen', label: 'Nach innen (Standard)' }, { k: 'aussen', label: 'Nach außen' }],
  material: [{ k: 'kunststoff', label: 'Kunststoff', sub: 'Pflegeleicht, günstig', price: '€' }, { k: 'holz', label: 'Holz', sub: 'Warm, braucht Pflege', price: '€€' }, { k: 'holzalu', label: 'Holz-Alu', sub: 'Innen Holz, außen Alu', price: '€€€' }, { k: 'alu', label: 'Aluminium', sub: 'Schlank, sehr stabil', price: '€€€' }],
  preset: [{ k: 'keine', label: 'Keine' }, { k: 'kreuz', label: 'Kreuz' }, { k: 'sechs', label: '6 Felder' }, { k: 'quer', label: 'Oben quer' }, { k: 'senk', label: 'Dreiteilig' }],
  spross: [{ k: 'wiener', label: 'Wiener Sprosse', sub: 'Wirkt echt, gut gedämmt', g: 'wiener' }, { k: 'szr', label: 'Innenliegend', sub: 'Zwischen den Scheiben', g: 'szr' }, { k: 'auf', label: 'Aufgesetzt', sub: 'Aufgeklebt, günstig', g: 'auf' }, { k: 'echt', label: 'Glasteilend', sub: 'Jedes Feld eigenes Glas', g: 'echt' }],
  breite: [{ k: 18, label: '18 mm, fein' }, { k: 26, label: '26 mm' }, { k: 45, label: '45 mm, kräftig' }],
  aufseite: [{ k: 'beide', label: 'Innen und außen' }, { k: 'aussen', label: 'Nur außen' }, { k: 'innen', label: 'Nur innen' }],
  glas: [{ k: '2', label: '2-fach', sub: 'Ug ≈ 1,1' }, { k: '3', label: '3-fach', sub: 'Ug ≈ 0,5 bis 0,7' }],
  glasfn: [{ k: 'schall', label: 'Schallschutz', g: 'schall' }, { k: 'vsg', label: 'Sicherheitsglas', g: 'vsg' }, { k: 'sicht', label: 'Sichtschutz', g: 'ornament' }, { k: 'sonne', label: 'Sonnenschutz' }],
  griff: [{ k: 'standard', label: 'Standard' }, { k: 'abschliessbar', label: 'Abschließbar' }, { k: 'druckknopf', label: 'Druckknopf' }],
  gf: [{ k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'silber', label: 'Silber', bg: '#c9ccd0' }, { k: 'edelstahl', label: 'Edelstahl', bg: 'linear-gradient(135deg, #eceef0, #a7abb0)' }, { k: 'titan', label: 'Titan', bg: '#8b8d8f' }, { k: 'schwarz', label: 'Schwarz', bg: '#1d1d1f' }],
  rc: [{ k: 'basis', label: 'Basis' }, { k: 'rc1', label: 'RC1 N' }, { k: 'rc2', label: 'RC2' }],
  roll: [{ k: 'keiner', label: 'Keiner' }, { k: 'behalten', label: 'Bestehender', sub: 'bleibt drin' }, { k: 'aufsatz', label: 'Aufsatz', sub: 'neu, auf dem Fenster', g: 'aufsatz' }, { k: 'vorbau', label: 'Vorbau', sub: 'neu, außen davor', g: 'vorbau' }],
  antrieb: [{ k: 'gurt', label: 'Gurt' }, { k: 'kurbel', label: 'Kurbel' }, { k: 'motor', label: 'Elektrisch' }, { k: 'smart', label: 'Smart Home' }],
  insekt: [{ k: 'keiner', label: 'Keiner' }, { k: 'spann', label: 'Spannrahmen' }, { k: 'dreh', label: 'Drehrahmen' }, { k: 'plissee', label: 'Plissee' }],
  fbi: [{ k: 'behalten', label: 'Behalten' }, { k: 'werzalit', label: 'Werzalit' }, { k: 'stein', label: 'Naturstein' }, { k: 'holz', label: 'Holz' }],
  fba: [{ k: 'behalten', label: 'Behalten' }, { k: 'alu', label: 'Aluminium' }, { k: 'stein', label: 'Naturstein' }],
  gebaeude: [{ k: 'efh', label: 'Einfamilienhaus' }, { k: 'dh', label: 'Doppelhaushälfte' }, { k: 'rh', label: 'Reihenhaus' }, { k: 'mfh', label: 'Mehrfamilienhaus' }, { k: 'etw', label: 'Eigentumswohnung' }, { k: 'denkmal', label: 'Denkmalschutz' }],
  zeit: [{ k: 'asap', label: 'So bald wie möglich' }, { k: '3m', label: 'In 1 bis 3 Monaten' }, { k: '6m', label: 'In 3 bis 6 Monaten' }, { k: '12m', label: 'Später, erst Angebote' }],
  budget: [{ k: 'b1', label: 'bis 5.000 €' }, { k: 'b2', label: '5.000 bis 10.000 €' }, { k: 'b3', label: '10.000 bis 20.000 €' }, { k: 'b4', label: 'über 20.000 €' }, { k: 'b0', label: 'Weiß ich noch nicht' }],
  erreich: [{ k: 'vm', label: 'Vormittags' }, { k: 'nm', label: 'Nachmittags' }, { k: 'ab', label: 'Abends' }],
  baujahr: [{ k: 'vor 1978', label: 'vor 1978' }, { k: '1978 bis 1995', label: '1978 bis 1995' }, { k: '1995 bis 2010', label: '1995 bis 2010' }, { k: 'nach 2010', label: 'nach 2010' }, { k: '', label: 'Weiß ich nicht' }]
};
const TYPNAME = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp' };
/* ---------- Glossar ---------- */
const GLOSS = {
  dinlr: { t: 'Was bedeutet DIN links und DIN rechts?', x: ['Die Angabe sagt, auf welcher Seite die Scharniere sitzen. Man schaut dafür immer von innen, also von der Seite, zu der das Fenster aufgeht.', 'Scharniere links heißt DIN links. Der Griff sitzt dann rechts. Merkhilfe: Stell dich innen vor das offene Fenster und leg die Hand auf die Scharniere. Linke Hand bedeutet DIN links.'], ico: () => [...ICO.typ('DK'), P(R(10.5, 14, 3, 9, 1), INK), P(R(10.5, 41, 3, 9, 1), INK)], see: ['symbol', 'dk'] },
  symbol: { t: 'Wie lese ich die Linien im Fenster?', x: ['In Fensterzeichnungen zeigen dünne Linien, wie ein Flügel aufgeht. Die Linien starten an den Ecken der Scharnierseite, die Spitze zeigt zum Griff.', 'Ein Dreieck mit der Spitze nach oben steht fürs Kippen. Durchgezogene Linien bedeuten: öffnet nach innen. Gestrichelte: öffnet nach außen.'], ico: () => ICO.typ('DK'), see: ['dinlr', 'dk'] },
  dk: { t: 'Was ist ein Dreh-Kipp-Fenster?', x: ['Der Standard in Deutschland. Griff nach oben: Das Fenster kippt und du lüftest. Griff zur Seite: Der Flügel dreht sich ganz auf, zum Putzen oder Stoßlüften.'], ico: () => ICO.typ('DK'), see: ['symbol', 'kipp'] },
  fest: { t: 'Was ist eine Festverglasung?', x: ['Glas im Rahmen ohne Flügel. Sie lässt sich nicht öffnen, hat dafür schmalere Profile, bringt mehr Licht und ist günstiger. Geputzt wird von außen.'], ico: () => ICO.typ('F'), see: ['dk'] },
  kipp: { t: 'Was ist ein Kippfenster?', x: ['Ein Flügel, der nur kippt und sich nicht ganz aufdrehen lässt. Typisch für Oberlichter und kleine Fenster in Bad oder Keller.'], ico: () => ICO.typ('K'), see: ['oberlicht', 'dk'] },
  stulp: { t: 'Was ist ein Stulpfenster?', x: ['Zwei Flügel ohne festen Mittelpfosten. Sind beide offen, ist die ganze Breite frei. Der zweite Flügel geht erst auf, wenn der erste offen ist.'], ico: () => ICO.layout('2s'), see: ['pfosten'] },
  pfosten: { t: 'Was ist ein Pfosten?', x: ['Ein festes Profil zwischen zwei Flügeln. Jeder Flügel öffnet für sich. Stabil und meist günstiger als ein Stulpfenster.'], ico: () => ICO.layout('2p'), see: ['stulp'] },
  oberlicht: { t: 'Was ist ein Oberlicht?', x: ['Ein eigenes Feld über dem eigentlichen Fenster, fest oder kippbar. Es bringt Licht und Luft, ohne dass der große Flügel aufgehen muss.'], ico: () => winIco({ teilung: '1', ol: true, olT: 'K', sashes: [{ t: 'DK', din: 'L' }] }, 14, 6, 36, 52), see: ['kipp'] },
  anschlag: { t: 'Was ist ein Maueranschlag?', x: ['Bei manchen Häusern steht das Mauerwerk ein paar Zentimeter vor dem Fensterrahmen, innen oder außen. Dann ist der Rahmen größer als die Öffnung, die du siehst.', 'Ohne Anschlag ist die Laibung glatt und das Fenster sitzt einfach in der Öffnung. Für die Bestellung ist das ein wichtiger Unterschied.'], ico: () => ICO.anschlag('aussen'), see: ['laibung', 'rahmenmass'] },
  laibung: { t: 'Was ist die Laibung?', x: ['Die Wandfläche in der Fensteröffnung, also die Tiefe der Wand rund um das Fenster. Es gibt eine Innenlaibung und eine Außenlaibung.'], ico: () => [...ICO.anschlag('ohne'), P(L([6, 56], [20, 56]), 'none', '#d4502b', 1.6), P(L([6, 53], [6, 59]), 'none', '#d4502b', 1.4), P(L([20, 53], [20, 59]), 'none', '#d4502b', 1.4)], see: ['anschlag'] },
  bruestung: { t: 'Was ist die Brüstungshöhe?', x: ['Der Abstand vom fertigen Fußboden bis zur Unterkante der Fensteröffnung. Bei sehr tiefen Fenstern kann eine Absturzsicherung vorgeschrieben sein.'], ico: () => [P(R(4, 58, 56, 3), INK), P(R(16, 6, 28, 30, 1), FR, INK, 1.3), P(R(19, 9, 22, 24), GL, INK, 0.6), P(L([52, 37], [52, 57]), 'none', '#d4502b', 1.6), P(L([49, 37], [55, 37]), 'none', '#d4502b', 1.4), P(L([49, 57], [55, 57]), 'none', '#d4502b', 1.4)], see: ['rahmenmass'] },
  rahmenmass: { t: 'Maueröffnung oder Fensterelement?', x: ['Die Maueröffnung ist das Loch in der Wand, gemessen von Laibung zu Laibung. Das Fensterelement ist das Fenster selbst mit seinem Rahmen, so wie du es siehst.', 'Beides brauchst du fürs Angebot. Das neue Fenster wird etwas kleiner als die Öffnung, damit Platz für Dämmung und Abdichtung bleibt. Das Bestellmaß legt dein Fensterbauer beim Feinaufmaß fest.'], ico: () => [P(R(6, 6, 52, 52), WALL, INK, 0.8), P(R(13, 13, 38, 38), '#f5f5f7', INK, 0.8, '3 2'), P(R(16, 16, 32, 32, 1), FR, INK, 1.3), P(R(20, 20, 24, 24), GL, INK, 0.6)], see: ['anschlag', 'feinaufmass'] },
  wiener: { t: 'Was ist eine Wiener Sprosse?', x: ['Sprossen, die außen und innen auf die Scheibe geklebt werden. Dazwischen sitzt ein dunkler Steg im Scheibenzwischenraum.', 'So sieht das Fenster aus wie mit echten Sprossen, dämmt aber wie eine durchgehende Scheibe.'], ico: () => ICO.spross('wiener'), see: ['szr', 'echt'] },
  szr: { t: 'Was sind innenliegende Sprossen?', x: ['Sprossen zwischen den Glasscheiben, im Scheibenzwischenraum. Die Oberfläche bleibt glatt, Putzen geht wie bei einem Fenster ohne Sprossen.'], ico: () => ICO.spross('szr'), see: ['wiener', 'auf'] },
  auf: { t: 'Was sind aufgesetzte Sprossen?', x: ['Sprossen, die nur auf die Scheibe geklebt sind, ohne Steg dazwischen. Günstig und auch nachträglich möglich. Aus der Nähe sieht man den Unterschied.'], ico: () => ICO.spross('auf'), see: ['wiener'] },
  echt: { t: 'Was ist eine glasteilende Sprosse?', x: ['Das klassische Original: Jedes Feld hat seine eigene Scheibe. Sehr authentisch und im Denkmalschutz oft gefordert. Dafür teurer und mit mehr Rahmenanteil.'], ico: () => ICO.spross('echt'), see: ['wiener'] },
  uwert: { t: 'Was bedeutet der U-Wert?', x: ['Er zeigt, wie viel Wärme durch das Fenster verloren geht. Je kleiner der Wert, desto besser die Dämmung.', 'Ug steht für das Glas, Uw für das ganze Fenster mit Rahmen. 2-fach-Glas liegt typisch um 1,1, 3-fach-Glas um 0,5 bis 0,7.'], ico: () => [...ICO.glas('3'), P(L([4, 32], [14, 32]), 'none', '#d4502b', 2), P(L([10, 28], [14, 32], [10, 36]), 'none', '#d4502b', 2), P(L([50, 32], [60, 32]), 'none', '#d4502b', 1.4, '2 2')], see: ['schall'] },
  schall: { t: 'Was bringt Schallschutzglas?', x: ['Unterschiedlich dicke Scheiben und spezielle Folien dämpfen Lärm. Sinnvoll an lauten Straßen, Bahnlinien oder in der Einflugschneise.'], ico: () => [...ICO.glas('2'), P('M8 24a12 12 0 0 1 0 16M4 20a18 18 0 0 1 0 24', 'none', INK, 1.4)], see: ['uwert', 'vsg'] },
  vsg: { t: 'Was ist Sicherheitsglas?', x: ['ESG zerfällt bei Bruch in kleine, stumpfe Krümel. VSG hat innen eine Folie: Die Scheibe hält bei Bruch zusammen und erschwert Einbrüche.'], ico: () => [...ICO.glas('2'), P(L([32, 10], [32, 54]), 'none', '#d4502b', 1.4, '3 2')], see: ['rc2'] },
  ornament: { t: 'Was ist Ornamentglas?', x: ['Strukturiertes Glas, das Licht durchlässt, aber Blicke streut. Typisch im Bad. Bekannte Muster heißen zum Beispiel Satinato, Chinchilla oder Mastercarré.'], ico: () => { let d = ''; for (let y = 14; y < 52; y += 5) for (let x = 18; x < 48; x += 5) d += C(x, y, 0.8); return [P(R(12, 8, 40, 48, 1.5), FR, INK, 1.3), P(R(16, 12, 32, 40), '#dde6ee', INK, 0.6), P(d, '#ffffff')]; }, see: ['vsg'] },
  rc2: { t: 'Was heißt RC2?', x: ['Eine Widerstandsklasse gegen Einbruch nach DIN EN 1627. Ein RC2-Fenster hält einem Gelegenheitstäter mit einfachem Werkzeug wie Schraubendreher oder Zange mindestens drei Minuten stand.'], ico: () => [P('M32 5l20 8v15c0 13-8 23-20 31C20 51 12 41 12 28V13z', FR, INK, 1.4), P(R(25, 28, 14, 12, 2), INK), P('M28 28v-4a4 4 0 0 1 8 0v4', 'none', INK, 1.8)], see: ['vsg'] },
  aufsatz: { t: 'Was ist ein Aufsatzrollladen?', x: ['Der Rollladenkasten sitzt direkt oben auf dem Fensterrahmen und wird mit dem Fenster zusammen eingebaut. Von außen sieht man ihn kaum.'], ico: () => ICO.roll('aufsatz'), see: ['vorbau'] },
  vorbau: { t: 'Was ist ein Vorbaurollladen?', x: ['Der Kasten wird außen vor die Fassade oder in die Laibung gesetzt. Ideal zum Nachrüsten, weil am Fenster selbst nichts geändert werden muss.'], ico: () => ICO.roll('vorbau'), see: ['aufsatz'] },
  insekt: { t: 'Spannrahmen, Drehrahmen oder Plissee?', x: ['Spannrahmen werden eingeklemmt und bleiben drin. Drehrahmen gehen auf wie eine Tür, gut für Balkontüren. Plissees falten sich zur Seite zusammen und sparen Platz.'], ico: () => ICO.insekt('dreh'), see: [] },
  ralmontage: { t: 'Was ist RAL-Montage?', x: ['Einbau nach dem Montageleitfaden der RAL-Gütegemeinschaft in drei Ebenen: innen luftdicht, in der Mitte gedämmt, außen schlagregendicht und trotzdem dampfdurchlässig.', 'Das schützt die Fuge um das Fenster vor Zugluft, Feuchtigkeit und Schimmel.'], ico: () => [P(R(4, 10, 18, 44), WALL, INK, 0.8), P(R(42, 10, 18, 44), WALL, INK, 0.8), P(R(22, 18, 20, 4), '#5b9bd5'), P(R(22, 22, 20, 18), '#f2d27a'), P(R(22, 40, 20, 4), '#8e8e93'), P(R(26, 26, 12, 10, 1), FR, INK, 1.1)], see: ['lueftung'] },
  fensterbank: { t: 'Fensterbank innen und außen', x: ['Innen zum Beispiel Werzalit (pflegeleichte Kunststoffplatte), Naturstein oder Holz. Außen meist Aluminium, alternativ Naturstein.', 'Die äußere Fensterbank leitet Regenwasser von der Fassade weg.'], ico: () => ICO.bank('aussen'), see: [] },
  ral: { t: 'Was bedeutet RAL?', x: ['RAL ist ein Farbsystem mit festen Nummern. So sieht Anthrazitgrau bei jedem Hersteller gleich aus: RAL 7016.', 'Holzdekore sind Folien mit Holzmaserung auf Kunststoffprofilen. Farben am Bildschirm weichen ab, ein Farbmuster zeigt das echte Ergebnis.'], ico: () => [P(C(20, 24, 11), '#383e42'), P(C(40, 24, 11), '#f1f0ea', INK, 0.8), P(C(30, 42, 11), '#b5732f')], see: [] },
  lueftung: { t: 'Brauche ich ein Lüftungskonzept?', x: ['Neue Fenster sind sehr dicht. Wird mehr als ein Drittel der Fenster getauscht, verlangt die Norm DIN 1946-6 ein Lüftungskonzept, damit kein Schimmel entsteht.', 'Oft reichen kleine Lüfter im Fensterfalz. Dein Fensterbauer berät dich dazu.'], ico: () => [P(R(16, 8, 32, 48, 1.2), FR, INK, 1.3), P(R(20, 12, 24, 40), GL, INK, 0.6), P('M4 20c4-3 8 3 12 0M4 30c4-3 8 3 12 0M48 34c4-3 8 3 12 0M48 44c4-3 8 3 12 0', 'none', '#5b9bd5', 1.8)], see: ['ralmontage'] },
  referenz: { t: 'Wie genau ist das Aufmaß?', x: ['Du misst mit dem Zollstock, die App führt dich: erst die Maueröffnung, dann das Fensterelement, jeweils senkrecht und waagerecht in der Mitte. Danach legt die KI beide Rechtecke auf dein Foto und fragt die restlichen Maße ab.', 'Das kleinste von drei Maßen zählt, so wie es der Fensterbauer auch macht. Die Fotos liefern ihm dazu Material, Zustand, Rollladen und Fensterbank.'], ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['feinaufmass', 'rahmenmass'] },
  feinaufmass: { t: 'Was ist ein Feinaufmaß?', x: ['Bevor dein Fenster produziert wird, misst der Fensterbauer vor Ort noch einmal genau nach. Dein Aufmaß ersetzt den ersten Termin und reicht fürs Angebot, nicht aber diese Endkontrolle.'], ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['referenz', 'rahmenmass'] }
};
const GLOSS_ORDER = ['referenz', 'feinaufmass', 'rahmenmass', 'bruestung', 'laibung', 'anschlag', 'dinlr', 'symbol', 'dk', 'kipp', 'fest', 'oberlicht', 'pfosten', 'stulp', 'wiener', 'szr', 'auf', 'echt', 'uwert', 'schall', 'vsg', 'ornament', 'rc2', 'ral', 'aufsatz', 'vorbau', 'insekt', 'fensterbank', 'ralmontage', 'lueftung'];
/* ---------- Fenster-Modell ---------- */
let BID = 1;
const nid = () => 'b' + (BID++);
function sashesFor(k) {
  if (k === '1') return [{ t: 'DK', din: 'L' }];
  if (k === '2s') return [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }];
  if (k === '3') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'DK', din: 'R' }];
  return [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }];
}
function presetBars(k, n) {
  const out = [];
  for (let s = 0; s < n; s++) {
    const add = (d, p) => out.push({ id: nid(), s: s, d: d, p: p });
    if (k === 'kreuz') { add('v', 0.5); add('h', 0.5); }
    if (k === 'sechs') { add('v', 0.5); add('h', 1 / 3); add('h', 2 / 3); }
    if (k === 'quer') add('h', 0.3);
    if (k === 'senk') { add('v', 1 / 3); add('v', 2 / 3); }
  }
  return out;
}
const hexA = (h, a) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return 'rgba(0,113,227,' + a + ')'; const n = parseInt(m[1], 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- Fenster-Modell ---------- */
const MO_KEYS = ['hm', 'hl', 'hr', 'wm', 'wt', 'wb'];
const MO_LABEL = { hm: 'Höhe Mitte', hl: 'Höhe links', hr: 'Höhe rechts', wm: 'Breite Mitte', wt: 'Breite oben', wb: 'Breite unten' };
function baseWin() {
  return { name: '', etage: 'eg', anzahl: 1, w: '', h: '', mo: { hm: '', hl: '', hr: '', wm: '', wt: '', wb: '' }, el: { h: '', w: '' }, bru: '', laib: '', anschlag: 'ohne', fassade: 'putz',
    form: 'rechteck', teilung: '2p', ol: false, olT: 'K', sashes: sashesFor('2p'), richtung: 'innen', material: 'kunststoff', bars: [], preset: 'keine', spross: 'wiener', breite: 26,
    fa: '7016', fi: '9016', gleich: false, muster: false, wunschA: '', wunschI: '', aufSeite: 'beide', glas: '3', glasfn: [], orn: 'satinato', griff: 'standard', gf: 'weiss', rc: 'basis', roll: 'keiner', antrieb: 'gurt', insekt: 'keiner', fbi: 'behalten', fba: 'alu',
    demontage: true, ralm: true, putz: true, notiz: '', ki: null, tilt: null, fotos: 0, quelle: 'hand' };
}
const num = (v) => { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
/* Maueröffnung: von drei Maßen zählt das kleinste. Fensterelement: Mitte senkrecht und waagerecht. */
function derive(w) {
  const mo = w.mo || {}, hs = ['hm', 'hl', 'hr'].map((k) => num(mo[k])).filter(Boolean), ws = ['wm', 'wt', 'wb'].map((k) => num(mo[k])).filter(Boolean);
  const moH = hs.length ? Math.min.apply(null, hs) : 0, moW = ws.length ? Math.min.apply(null, ws) : 0;
  const devH = hs.length > 1 ? Math.max.apply(null, hs) - moH : 0, devW = ws.length > 1 ? Math.max.apply(null, ws) - moW : 0;
  const elH = num(w.el && w.el.h), elW = num(w.el && w.el.w);
  return { moH: moH, moW: moW, devH: devH, devW: devW, elH: elH, elW: elW, complete: !!(moH && moW && elH && elW) };
}
function demoProject() {
  const a = Object.assign(baseWin(), { name: 'Wohnzimmer', w: 1760, h: 1385, mo: { hm: 1410, hl: 1408, hr: 1412, wm: 1790, wt: 1792, wb: 1788 }, el: { h: 1385, w: 1760 }, bru: 620, laib: 140, teilung: '3', e_teilung: true, sashes: sashesFor('3'), roll: 'aufsatz', antrieb: 'motor', insekt: 'spann', fotos: 2,
    ki: { material: 'Kunststoff', farbe: 'weiß', fluegel: 3, oeffnung: 'Dreh-Kipp, Mitte fest', chips: ['Kunststoff, weiß', '3 Flügel, Mitte fest', 'Rollladenkasten innen', 'Heizkörper unter dem Fenster', 'Dichtungen porös'], rows: [['Material', 'Kunststoff, weiß, vergilbt'], ['Verglasung', '2-fach, vermutlich vor 2000'], ['Rollladen', 'Kasten innen über dem Fenster, Gurtantrieb'], ['Fensterbank innen', 'Naturstein, ca. 25 cm tief'], ['Heizkörper', 'Direkt unter dem Fenster, Oberkante ca. 5 cm unter der Bank'], ['Zustand', 'Dichtungen porös, Beschläge in Ordnung'], ['Fassade', 'Putz, Außenanschlag ca. 3 cm'], ['Fensterbank außen', 'Aluminium mit Gefälle'], ['Hinweis', 'Rollladengurt läuft durch die Laibung, beim Ausbau beachten']] } });
  const b = Object.assign(baseWin(), { name: 'Bad', etage: 'og', w: 880, h: 1010, mo: { hm: 1040, hl: 1040, hr: 1038, wm: 905, wt: 905, wb: 902 }, el: { h: 1010, w: 880 }, bru: 1320, laib: 120, teilung: '1', e_teilung: true, sashes: sashesFor('1'), fa: '9016', glasfn: ['sicht'], fotos: 1,
    ki: { material: 'Holz', farbe: 'weiß', fluegel: 1, oeffnung: 'Dreh-Kipp', chips: ['Holz, weiß lackiert', '1 Flügel Dreh-Kipp', 'Fliesenlaibung', 'Ornamentglas'], rows: [['Material', 'Holz, weiß lackiert, Lack blättert unten'], ['Verglasung', 'Einfachglas, Ornamentglas'], ['Laibung innen', 'Gefliest, Fliesen laufen bis an den Rahmen'], ['Rollladen', 'Keiner'], ['Fensterbank innen', 'Gefliest'], ['Zustand', 'Rahmen unten feucht, Holz weich'], ['Hinweis', 'Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt']] } });
  return [a, b];
}
const thousand = (v) => (v === '' || v == null || isNaN(v) || v === 0) ? '–' : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const mmTxt = (v) => (num(v) ? thousand(v) + ' mm' : '–');
const cmTxt = (v) => (num(v) ? (num(v) / 10).toFixed(1).replace('.', ',') + ' cm' : '');
const LEGACY = { altbau: 'Altbau', sofort: 'So bald wie möglich', offen: 'Noch offen' };
const lab = (g, k) => { const o = (OPT[g] || []).find((x) => x.k === k); return o ? o.label : (LEGACY[k] || ''); };
const colorOf = (k) => COLORS.find((c) => c.k === k) || COLORS[0];
function openingText(w) {
  const s = w.sashes.map((x) => TYPNAME[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ');
  return (w.ol ? lab('olT', w.olT) + ' · ' : '') + s;
}
function specRows(w) {
  const d = derive(w), fa = colorOf(w.fa), fi = colorOf(w.gleich ? w.fa : w.fi), mo = w.mo || {};
  const rows = [
    { k: 'Maueröffnung', v: d.moW && d.moH ? thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm (kleinstes Maß)' + (d.devW > 5 || d.devH > 5 ? ', bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel' : '') : 'noch nicht gemessen' },
    { k: 'Breiten', v: ['wt', 'wm', 'wb'].map((k) => MO_LABEL[k].replace('Breite ', '') + ' ' + thousand(num(mo[k]))).join(' · ') },
    { k: 'Höhen', v: ['hl', 'hm', 'hr'].map((k) => MO_LABEL[k].replace('Höhe ', '') + ' ' + thousand(num(mo[k]))).join(' · ') },
    { k: 'Fensterelement', v: d.elW && d.elH ? thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm, sichtbar mit Rahmen' : 'noch nicht gemessen' },
    { k: 'Lage', v: (w.name || 'Ohne Raum') + ', ' + lab('etage', w.etage) + (num(w.bru) ? ', Brüstung ' + thousand(w.bru) + ' mm' : '') + (num(w.laib) ? ', Laibung innen ' + thousand(w.laib) + ' mm' : '') + (w.anzahl > 1 ? ', ' + w.anzahl + ' Stück' : '') },
    { k: 'Einbau', v: 'Anschlag und Fassade laut Fotos, Feinaufmaß vor Ort' },
    { k: 'Öffnung', v: openingText(w) + (w.richtung === 'aussen' ? ', öffnet nach außen' : '') },
    { k: 'Form', v: lab('form', w.form) + ', ' + lab('material', w.material) },
    { k: 'Farbe', v: 'außen ' + fa.name + ' (' + fa.code + ')' + (w.wunschA ? ', Wunsch: ' + w.wunschA : '') + ', innen ' + fi.name + (w.wunschI && !w.gleich ? ', Wunsch: ' + w.wunschI : '') },
    { k: 'Glas', v: lab('glas', w.glas) + (w.glasfn.length ? ', ' + w.glasfn.map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + (ORN.find((o) => o.k === w.orn) || ORN[0]).label + ')' : '')).join(', ') : '') },
    { k: 'Sprossen', v: w.bars.length ? lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite).toLowerCase() + ')' : '') + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'Keine' },
    { k: 'Griff', v: lab('griff', w.griff) + ', ' + lab('gf', w.gf) + ', Schutz ' + lab('rc', w.rc) },
    { k: 'Rollladen', v: lab('roll', w.roll) + (w.roll === 'aufsatz' || w.roll === 'vorbau' ? ', ' + lab('antrieb', w.antrieb) : '') + ' · Insektenschutz: ' + lab('insekt', w.insekt) },
    { k: 'Fensterbank', v: 'innen ' + lab('fbi', w.fbi) + ', außen ' + lab('fba', w.fba) },
    { k: 'Montage', v: [w.demontage ? 'Altfenster ausbauen und entsorgen' : '', w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'Nur Lieferung' }
  ];
  if (w.notiz) rows.push({ k: 'Notiz', v: w.notiz });
  return rows;
}
/* Kompakter Aufmaß-Code: nur Abweichungen vom Standard, für den Weg zum Fensterbauer ohne Server */
function packProject(windows, proj, betrieb) {
  const base = baseWin();
  const ws = windows.map((w) => { const o = {}; Object.keys(w).forEach((k) => { if (JSON.stringify(w[k]) !== JSON.stringify(base[k])) o[k] = w[k]; }); return o; });
  const json = JSON.stringify({ v: 1, b: betrieb ? betrieb.code : '', p: proj, w: ws, t: Date.now() });
  const bytes = new TextEncoder().encode(json);
  let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'AM1.' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unpackProject(code) {
  try {
    const m = /(?:AM1|ZF1|FE1|LM1)\.([A-Za-z0-9_-]+)/.exec(String(code || '').trim());
    if (!m) return null;
    let b64 = m[1].replace(/-/g, '+').replace(/_/g, '/'); while (b64.length % 4) b64 += '=';
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const o = JSON.parse(new TextDecoder().decode(bytes));
    if (!o || o.v !== 1 || !Array.isArray(o.w)) return null;
    o.w = o.w.map((x) => Object.assign(baseWin(), x));
    return o;
  } catch (e) { return null; }
}
const STEPS = ['fotos', 'messen', 'rest', 'ergebnis', 'frage'];
const STEPNAME = { fotos: 'Fotos', messen: 'Messen', rest: 'Ränder', ergebnis: 'Ergebnis', typ: 'Fenster', sprossen: 'Sprossen', farbe: 'Farbe & Glas', extras: 'Extras' };
/* Die vier geführten Messungen, dann die vier restlichen am Foto */
const MESS = [
  { k: 'hm', who: 'mo', dir: 'v', title: 'Maueröffnung senkrecht', short: 'Öffnung · Höhe Mitte', text: 'Miss die sichtbare Maueröffnung senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank. Den Zollstock an die Laibung halten, nicht an den Rahmen.' },
  { k: 'h', who: 'el', dir: 'v', title: 'Fensterelement senkrecht', short: 'Fenster · Höhe Mitte', text: 'Jetzt das Fenster selbst, senkrecht in der Mitte: alles, was vom Fenster samt Rahmen zu sehen ist, von Oberkante bis Unterkante.' },
  { k: 'wm', who: 'mo', dir: 'h', title: 'Maueröffnung waagerecht', short: 'Öffnung · Breite Mitte', text: 'Die Maueröffnung waagerecht in der Mitte: von Laibung zu Laibung, auf halber Höhe.' },
  { k: 'w', who: 'el', dir: 'h', title: 'Fensterelement waagerecht', short: 'Fenster · Breite Mitte', text: 'Das Fenster samt Rahmen waagerecht in der Mitte: von der linken bis zur rechten sichtbaren Rahmenkante.' }
];
const REST = [
  { k: 'hl', edge: 'l', title: 'Höhe links', text: 'Maueröffnung senkrecht, dicht an der linken Laibung. Alte Häuser sind selten im Winkel, deshalb lohnt der Blick.' },
  { k: 'hr', edge: 'r', title: 'Höhe rechts', text: 'Maueröffnung senkrecht, dicht an der rechten Laibung.' },
  { k: 'wt', edge: 't', title: 'Breite oben', text: 'Maueröffnung waagerecht, dicht unter der Oberkante der Öffnung.' },
  { k: 'wb', edge: 'b', title: 'Breite unten', text: 'Maueröffnung waagerecht, dicht über der Fensterbank.' }
];
/* Prüfungen beim Eintippen */
function checkValue(mm, step, vals) {
  const v = num(mm);
  if (!v) return { ok: false, msg: 'Bitte das Maß in Millimetern eintragen.' };
  if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10, msg: 'Meintest du ' + v + ' cm? Das wären ' + thousand(v * 10) + ' mm.' };
  if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen, zum Beispiel 1.230.' };
  if (step && step.who === 'el') {
    const o = num(step.dir === 'v' ? vals.hm : vals.wm);
    if (o && v > o + 30) return { ok: true, warn: 'Das Fensterelement ist größer als die Maueröffnung (' + thousand(o) + ' mm). Hast du die Öffnung vielleicht am Rahmen statt an der Laibung gemessen?' };
    if (o && v < o * 0.6) return { ok: true, warn: 'Das Fenster wirkt sehr klein für diese Öffnung. Miss das Element bis zur äußeren sichtbaren Rahmenkante.' };
  }
  return { ok: true };
}
function checkRest(mm, ref) {
  const v = num(mm), r = num(ref);
  if (!v) return { ok: false, msg: 'Bitte das Maß eintragen oder „Wie Mitte“ wählen.' };
  if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10, msg: 'Meintest du ' + v + ' cm? Das wären ' + thousand(v * 10) + ' mm.' };
  if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen.' };
  if (r && Math.abs(v - r) > 60) return { ok: true, warn: 'Das weicht ' + Math.abs(v - r) + ' mm vom Mittelmaß ab. Bei alten Häusern kommt das vor, bitte einmal nachmessen.' };
  return { ok: true };
}

/* ---------- SVG-Ausgabe ---------- */
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const svgPaths = (list) => list.map((p) => '<path d="' + p.d + '" fill="' + p.f + '" stroke="' + p.s + '" stroke-width="' + p.w + '"' + (p.da ? ' stroke-dasharray="' + p.da + '"' : '') + (p.o !== 1 ? ' opacity="' + p.o + '"' : '') + ' stroke-linecap="round" stroke-linejoin="round"></path>').join('');
const svgIcon = (list, size, cls) => '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + svgPaths(list) + '</svg>';
const miniWin = (x) => { const a = (num(x.w) || 1) / (num(x.h) || 1), bw = a >= 1 ? 50 : 50 * a, bh = a >= 1 ? 50 / a : 50; return winIco(x, (64 - bw) / 2, (64 - bh) / 2, bw, bh, colorOf(x.fa).solid); };

/* Beispielfotos als Bild (1200 × 1400), damit Abgleich und Rechtecke wie bei echten Fotos laufen */
function demoPhotoSvg(side) {
  const paths = side === 'in' ? sceneIn('ohne') : sceneOut();
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 350" width="1200" height="1400">' + svgPaths(paths) + '</svg>';
}
function demoPhotoUrl(side) {
  return new Promise((res) => {
    const url = URL.createObjectURL(new Blob([demoPhotoSvg(side)], { type: 'image/svg+xml' })), im = new Image();
    im.onload = () => { try { const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 1400; cv.getContext('2d').drawImage(im, 0, 0, 1200, 1400); res(cv.toDataURL('image/jpeg', 0.9)); } catch (e) { res(url); return; } URL.revokeObjectURL(url); };
    im.onerror = () => res('');
    im.src = url;
  });
}
/* Bekannte Lage von Rahmen und Öffnung im Beispielfoto (Pixel im 1200 × 1400-Bild) */
const DEMO_QUADS = { in: { inner: [[248, 192], [952, 192], [952, 1008], [248, 1008]], outer: [[208, 152], [992, 152], [992, 1008], [208, 1008]] }, out: { inner: [[264, 248], [936, 248], [936, 1008], [264, 1008]], outer: [[224, 160], [976, 160], [976, 1008], [224, 1008]] } };

/* ---------- 3-D-Modell: Wand, Maueröffnung, Fensterelement, aus CSS-Transformationen ----------
   Weltkoordinaten in Pixeln: Ursprung in der Mitte der Maueröffnung auf der Innenwand, x nach rechts, y nach unten,
   z zum Betrachter (in den Raum). Jede Fläche ist ein div, das mit translate3d an seine linke obere Ecke geschoben
   und um diese Kante gedreht wird. Alle Maße kommen aus w3dCalc, w3dLayout schreibt sie in die Flächen; so verformt
   sich das Modell mit Übergängen, wenn eine Zahl getippt wird. */
const W3D = { FD: 70, PF: 62, SF: 46, MUL: 72, OUTD: 110, SILL: 30, MARGIN_W: 3200, MARGIN_H: 2600 };
const VIEWS = { inside: [-9, -27], front: [0, 0], outside: [-8, 152], three: [-10, -34], result: [-7, -20] };
/* Kamera für einen geöffneten Flügel: von der Griffseite aus sieht man ihn aufschwingen */
function openView(x, base) { if (!x) return base; if (x.t === 'K') return [base[0] - 6, base[1]]; return [base[0], x.din === 'L' ? -30 : 30]; }
function w3dCalc(w, o) {
  o = o || {};
  const d = derive(w), haveMo = !!(d.moW && d.moH), moW = d.moW || o.moW || 1250, moH = d.moH || o.moH || 1480;
  const elW = d.elW || Math.round(moW - 60), elH = d.elH || Math.round(moH - 40);
  const laib = num(w.laib) || (w.ki && w.ki.laib) || 140, T = laib + W3D.FD + W3D.OUTD;
  const sw = o.stageW || 358, sh = o.stageH || 360;
  const s = o.s || Math.min(sw * (o.fitW || 0.64) / moW, sh * (o.fitH || 0.7) / moH);
  const n = Math.max(1, w.sashes.length), pf = W3D.PF, sf = W3D.SF, mul = w.teilung === '2s' ? 8 : W3D.MUL;
  const innerW = elW - 2 * pf, innerH = elH - 2 * pf, olH = w.ol ? Math.round(innerH * 0.26) : 0, sashH = innerH - (olH ? olH + mul : 0), sashW = (innerW - mul * (n - 1)) / n;
  return { s: s, moW: moW, moH: moH, elW: elW, elH: elH, laib: laib, T: T, n: n, pf: pf, sf: sf, mul: mul, innerW: innerW, innerH: innerH, olH: olH, sashH: sashH, sashW: sashW, haveMo: haveMo, haveEl: !!(d.elW && d.elH),
    x0: -elW / 2, y0: moH / 2 - elH, wallW: moW + W3D.MARGIN_W, wallH: moH + W3D.MARGIN_H, showEl: o.showEl !== false, dims: o.dims || [], active: o.active || '' };
}
const px = (v) => (Math.round(v * 100) / 100) + 'px';
const hole = (W, H, x1, y1, x2, y2) => 'polygon(evenodd, 0 0, ' + px(W) + ' 0, ' + px(W) + ' ' + px(H) + ', 0 ' + px(H) + ', 0 0, ' + px(x1) + ' ' + px(y1) + ', ' + px(x2) + ' ' + px(y1) + ', ' + px(x2) + ' ' + px(y2) + ', ' + px(x1) + ' ' + px(y2) + ', ' + px(x1) + ' ' + px(y1) + ')';
/* Fläche: Größe in Weltpixeln, Lage der linken oberen Ecke, Drehung um diese Kante */
function face(el, W, H, x, y, z, rot, origin, clip) {
  if (!el) return;
  el.style.width = px(W); el.style.height = px(H);
  el.style.transform = 'translate3d(' + px(x) + ', ' + px(y) + ', ' + px(z) + ')' + (rot ? ' ' + rot : '');
  el.style.transformOrigin = origin || '0 0';
  el.style.clipPath = clip || 'none';
}
function facadeBg(k) {
  if (k === 'klinker') return 'repeating-linear-gradient(0deg, #b85c42 0 18px, #d9cfc2 18px 21px), repeating-linear-gradient(90deg, transparent 0 38px, #d9cfc2 38px 41px)';
  if (k === 'holz') return 'repeating-linear-gradient(90deg, #a67a4e 0 26px, #8f6540 26px 28px)';
  if (k === 'wdvs') return 'linear-gradient(160deg, #f4f2ee, #e4e0d8)';
  return 'linear-gradient(160deg, #e9e2d6, #d7cfc0)';
}
function sillBg(k, side) {
  if (k === 'stein') return 'linear-gradient(90deg, #d9d6d0, #bfbab2 40%, #d2cec6 70%, #c4bfb6)';
  if (k === 'holz') return 'repeating-linear-gradient(90deg, #c9a46b 0 9px, #b8935c 9px 12px)';
  if (k === 'werzalit') return 'linear-gradient(180deg, #fafaf8, #ececea)';
  if (k === 'alu') return 'linear-gradient(90deg, #d6d9dc, #b9bdc2 50%, #cfd3d7)';
  return side === 'aussen' ? 'linear-gradient(90deg, #cdd1d5, #b5b9be)' : 'linear-gradient(180deg, #f1ede6, #e2dcd2)';
}
function sillSolid(k, side) { return k === 'stein' ? '#c9c4bb' : k === 'holz' ? '#c2a06a' : k === 'werzalit' ? '#f2f2f0' : k === 'alu' ? '#c5c9ce' : side === 'aussen' ? '#bfc3c8' : '#e9e4dc'; }
function barBg(w, fcol, side) {
  if (w.spross === 'szr') return 'linear-gradient(180deg, #d9d9d6, #bdbdb9)';
  if (w.spross === 'echt') return fcol.bg;
  if (w.spross === 'auf' && w.aufSeite && w.aufSeite !== 'beide' && w.aufSeite !== side) return 'transparent';
  return fcol.bg;
}
/* Struktur einmal bauen; die Geometrie setzt w3dLayout */
function w3dHTML(w, o) {
  o = o || {};
  const V = w3dCalc(w, o), view = VIEWS[o.view || 'inside'], fin = colorOf(w.gleich ? w.fa : w.fi), fout = colorOf(w.fa), hcol = (OPT.gf.find((g) => g.k === w.gf) || OPT.gf[0]).bg;
  const faceEl = (role, cls, extra) => '<div class="w3d-f ' + cls + '" data-r="' + role + '"' + (extra || '') + '></div>';
  let h = '<div class="w3d-stage' + (o.sway ? ' is-live' : '') + (o.symbols ? ' show-sym' : '') + (o.cls ? ' ' + o.cls : '') + '" id="' + (o.id || 'w3d') + '" data-sig="' + esc(w3dSig(w, o)) + '" style="' + (o.stageH === 'auto' ? '' : 'height: ' + (o.stageH || 360) + 'px; ') + '--rx: ' + view[0] + 'deg; --ry: ' + view[1] + 'deg" data-view="' + (o.view || 'inside') + '">' + (o.bg ? '<div class="w3d-bg" style="background-image: url(' + o.bg + ')"></div>' : '') + '<div class="w3d-cam"><div class="w3d-sway"><div class="w3d-world">';
  h += faceEl('wall-in', 'w3d-wall-in'); h += faceEl('wall-out', 'w3d-wall-out', ' style="background: ' + facadeBg(w.fassade) + '"');
  h += faceEl('rev-t', 'w3d-rev w3d-rev-t') + faceEl('rev-b', 'w3d-rev w3d-rev-b') + faceEl('rev-l', 'w3d-rev w3d-rev-l') + faceEl('rev-r', 'w3d-rev w3d-rev-r');
  h += faceEl('sill-f', 'w3d-sill', ' style="background: ' + sillBg(w.fbi, 'innen') + '"') + faceEl('sill-t', 'w3d-sill', ' style="background: ' + sillBg(w.fbi, 'innen') + '"');
  h += '<div class="w3d-el' + (V.showEl ? '' : ' is-hidden') + '" data-r="el">';
  h += faceEl('el-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('el-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('el-side-' + k, 'w3d-frame w3d-side', ' style="background: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
  if (w.ol) h += faceEl('ol-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('ol-glass', 'w3d-glass') + faceEl('ol-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  for (let i = 0; i < V.n - 1; i++) h += faceEl('mul-' + i, 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('mulb-' + i, 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  w.sashes.forEach((x, i) => {
    const fixed = x.t === 'F', symSvg = '<svg class="w3d-sym" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-r="sym-' + i + '">' + symPaths(w, x) + '</svg>';
    const bars = w.bars.filter((b) => b.s === i).map((b) => '<span class="w3d-bar' + (o.editBars ? ' is-edit' : '') + (o.selBar === b.id ? ' is-sel' : '') + '" data-bar="' + b.id + '" data-dir="' + b.d + '" data-r="bar-' + b.id + '" style="--bi: ' + barBg(w, fin, 'innen') + '; --bo: ' + barBg(w, fout, 'aussen') + '; background: var(--bi)"></span>').join('');
    h += '<div class="w3d-sash' + (fixed ? ' is-fixed' : '') + (o.selSash === i && o.selectable ? ' is-sel' : '') + '" data-r="sash-' + i + '" data-sash="' + i + '" data-t="' + x.t + '" data-din="' + x.din + '">';
    h += faceEl('sf-in-' + i, 'w3d-frame w3d-sf', ' style="background: ' + fin.bg + '"');
    h += '<div class="w3d-f w3d-glass" data-r="glass-' + i + '" data-glass="' + i + '">' + symSvg + bars + '</div>';
    h += faceEl('sf-out-' + i, 'w3d-frame w3d-sf w3d-back', ' style="background: ' + fout.bg + '"');
    ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('sfe-' + k + '-' + i, 'w3d-frame w3d-side w3d-sfe', ' style="background: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
    h += '<div class="w3d-handle" data-r="handle-' + i + '" style="background: ' + hcol + '"></div>';
    h += '<div class="w3d-selring" data-r="ring-' + i + '"></div>';
    h += '</div>';
  });
  h += '</div>';
  if (w.roll === 'vorbau' || w.roll === 'aufsatz') h += faceEl('roll-f', 'w3d-roll') + faceEl('roll-b', 'w3d-roll w3d-roll-b') + faceEl('roll-t', 'w3d-roll w3d-roll-t') + faceEl('roll-l', 'w3d-roll w3d-roll-s') + faceEl('roll-r', 'w3d-roll w3d-roll-s');
  if (w.insekt && w.insekt !== 'keiner') h += faceEl('mesh', 'w3d-mesh');
  (V.dims || []).forEach((k) => { h += dimHTML(k, V.active === k); });
  h += '</div></div></div>';
  h += '<span class="w3d-hint" data-r="hint"' + (o.hint ? '' : ' hidden') + '>' + esc(o.hint || '') + '</span>';
  h += '<div class="rail rail-h" data-rail="v" hidden></div><div class="rail rail-v" data-rail="h" hidden></div>';
  return h + '</div>';
}
const dimHTML = (k, active) => '<div class="w3d-dim ' + (k[0] === 'e' ? 'el' : 'mo') + (active ? ' is-active' : '') + '" data-r="dim-' + k + '" data-dim="' + k + '"><span class="w3d-dim-line"></span><span class="w3d-dim-cap a"></span><span class="w3d-dim-cap b"></span><span class="w3d-dim-lab" data-r="lab-' + k + '"></span></div>';
function symPaths(w, x) { return sym(0, 0, 100, 100, x.t, x.din, w.richtung === 'aussen' ? '5 4' : undefined, 'rgba(29,29,31,.45)', 1).map((p) => '<path d="' + p.d + '" fill="none" stroke="' + p.s + '" stroke-width="1.2"' + (p.da ? ' stroke-dasharray="' + p.da + '"' : '') + ' vector-effect="non-scaling-stroke"></path>').join(''); }
/* Struktur-Signatur: solange sie gleich bleibt, wird die Bühne weiterverwendet und alles morpht mit Übergängen */
function w3dSig(w, o) { o = o || {}; return [o.id || 'w3d', w.sashes.length, w.ol ? 1 : 0, w.roll === 'vorbau' || w.roll === 'aufsatz' ? 1 : 0, w.insekt && w.insekt !== 'keiner' ? 1 : 0, w.bars.map((b) => b.id).join(','), o.bg ? 1 : 0].join('|'); }
/* Farben und Materialien auf die Flächen schreiben (mit Übergang, wenn sich etwas ändert) */
function w3dPaint(stage, w) {
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), bg = (r, v) => { const el = q(r); if (el && el.style.background !== v) el.style.background = v; };
  const fin = colorOf(w.gleich ? w.fa : w.fi), fout = colorOf(w.fa), hcol = (OPT.gf.find((g) => g.k === w.gf) || OPT.gf[0]).bg;
  bg('wall-out', facadeBg(w.fassade)); bg('sill-f', sillBg(w.fbi, 'innen')); bg('sill-t', sillBg(w.fbi, 'innen'));
  bg('el-front', fin.bg); bg('el-back', fout.bg); bg('el-side-l', fout.solid); bg('el-side-r', fout.solid); bg('el-side-t', fin.solid); bg('el-side-b', fin.solid);
  bg('ol-front', fin.bg); bg('ol-back', fout.bg);
  w.sashes.forEach((x, i) => {
    bg('mul-' + i, fin.bg); bg('mulb-' + i, fout.bg); bg('sf-in-' + i, fin.bg); bg('sf-out-' + i, fout.bg); bg('handle-' + i, hcol);
    bg('sfe-l-' + i, fout.solid); bg('sfe-r-' + i, fout.solid); bg('sfe-t-' + i, fin.solid); bg('sfe-b-' + i, fin.solid);
    const sash = q('sash-' + i); if (sash) { sash.classList.toggle('is-fixed', x.t === 'F'); sash.setAttribute('data-t', x.t); sash.setAttribute('data-din', x.din); }
    const sv = q('sym-' + i); if (sv) { const p = symPaths(w, x); if (sv.getAttribute('data-k') !== x.t + x.din + w.richtung) { sv.innerHTML = p; sv.setAttribute('data-k', x.t + x.din + w.richtung); } }
  });
  w.bars.forEach((b) => { const be = q('bar-' + b.id); if (be) { be.style.setProperty('--bi', barBg(w, fin, 'innen')); be.style.setProperty('--bo', barBg(w, fout, 'aussen')); } });
}
/* Maßlinien nachziehen: fehlende anlegen, überzählige entfernen */
function ensureDims(stage, o) {
  const world = stage.querySelector('.w3d-world'), want = o.dims || [];
  stage.querySelectorAll('.w3d-dim').forEach((d) => { const k = d.getAttribute('data-dim'); if (want.indexOf(k) < 0) d.remove(); else d.classList.toggle('is-active', o.active === k); });
  want.forEach((k) => { if (!stage.querySelector('[data-r="dim-' + k + '"]')) world.insertAdjacentHTML('beforeend', dimHTML(k, o.active === k)); });
}
/* Alles auf den aktuellen Stand bringen: Ansicht, Auswahl, Farben, Geometrie, Kamera */
function w3dApply(stage, w, o) {
  if (!stage) return;
  o = o || {};
  stage.classList.toggle('is-live', !!o.sway); stage.classList.toggle('show-sym', !!o.symbols); stage.classList.toggle('dims-all', !!(o.cls && o.cls.indexOf('dims-all') >= 0));
  stage.setAttribute('data-view', o.view || 'inside');
  const hint = stage.querySelector('[data-r="hint"]'); if (hint) { hint.textContent = o.hint || ''; hint.hidden = !o.hint; }
  stage.querySelectorAll('.w3d-sash').forEach((sa) => { sa.classList.toggle('is-sel', !!o.selectable && +sa.getAttribute('data-sash') === o.selSash); });
  stage.querySelectorAll('.w3d-bar').forEach((b) => { b.classList.toggle('is-edit', !!o.editBars); b.classList.toggle('is-sel', !!o.editBars && b.getAttribute('data-bar') === o.selBar); });
  ensureDims(stage, o); w3dPaint(stage, w); w3dLayout(stage, w, o); layoutRails(stage, w, o); stage._s = w3dCalc(w, Object.assign({}, o, { stageW: stage.clientWidth || 358, stageH: stage.clientHeight || 360 })).s;
  const openIdx = o.openSash != null && o.openSash >= 0 ? o.openSash : -1, base = VIEWS[o.view || 'inside'];
  w3dView(stage, openIdx >= 0 && w.sashes[openIdx] ? openView(w.sashes[openIdx], base) : base);
}
/* Geometrie in die Flächen schreiben. dimVals: Beschriftungen je Maßlinie */
function w3dLayout(stage, w, o) {
  if (!stage) return;
  o = o || {};
  const V = w3dCalc(w, Object.assign({}, o, { stageW: stage.clientWidth || 358, stageH: stage.clientHeight || 360 })), s = V.s;
  const q = (r) => stage.querySelector('[data-r="' + r + '"]');
  const moW = V.moW * s, moH = V.moH * s, T = V.T * s, d = V.laib * s, fd = W3D.FD * s, wallW = V.wallW * s, wallH = V.wallH * s;
  face(q('wall-in'), wallW, wallH, -wallW / 2, -wallH / 2, 0, '', '0 0', hole(wallW, wallH, (wallW - moW) / 2, (wallH - moH) / 2, (wallW + moW) / 2, (wallH + moH) / 2));
  face(q('wall-out'), wallW, wallH, -wallW / 2, -wallH / 2, -T, 'rotateY(180deg)', '50% 50%', hole(wallW, wallH, (wallW - moW) / 2, (wallH - moH) / 2, (wallW + moW) / 2, (wallH + moH) / 2));
  face(q('rev-t'), moW, T, -moW / 2, -moH / 2, 0, 'rotateX(-90deg)', '0 0');
  const rb = q('rev-b'); face(rb, moW, T, -moW / 2, moH / 2, 0, 'rotateX(-90deg)', '0 0');
  if (rb) rb.style.background = 'linear-gradient(180deg, ' + sillSolid(w.fbi, 'innen') + ' 0 ' + px(d + fd) + ', #8e9398 ' + px(d + fd) + ' ' + px(d + fd + 2) + ', ' + sillSolid(w.fba, 'aussen') + ' ' + px(d + fd + 2) + ')';
  face(q('rev-l'), T, moH, -moW / 2, -moH / 2, 0, 'rotateY(90deg)', '0 0');
  face(q('rev-r'), T, moH, moW / 2, -moH / 2, 0, 'rotateY(90deg)', '0 0');
  const sl = W3D.SILL * s, sx = 40 * s;
  face(q('sill-f'), moW + 2 * sx, sl, -moW / 2 - sx, moH / 2, sl, '', '0 0');
  face(q('sill-t'), moW + 2 * sx, sl, -moW / 2 - sx, moH / 2, sl, 'rotateX(-90deg)', '0 0');
  const el = q('el'); if (el) el.classList.toggle('is-hidden', !V.showEl);
  const elW = V.elW * s, elH = V.elH * s, x0 = V.x0 * s, y0 = V.y0 * s, pf = V.pf * s, sf = V.sf * s, mul = V.mul * s, z0 = -d;
  face(q('el-front'), elW, elH, x0, y0, z0, '', '0 0', hole(elW, elH, pf, pf, elW - pf, elH - pf));
  face(q('el-back'), elW, elH, x0, y0, z0 - fd, 'rotateY(180deg)', '50% 50%', hole(elW, elH, pf, pf, elW - pf, elH - pf));
  face(q('el-side-l'), fd, elH, x0, y0, z0, 'rotateY(90deg)', '0 0');
  face(q('el-side-r'), fd, elH, x0 + elW, y0, z0, 'rotateY(90deg)', '0 0');
  face(q('el-side-t'), elW, fd, x0, y0, z0, 'rotateX(-90deg)', '0 0');
  face(q('el-side-b'), elW, fd, x0, y0 + elH, z0, 'rotateX(-90deg)', '0 0');
  const olH = V.olH * s, sashTop = y0 + pf + (olH ? olH + mul : 0), sashH = V.sashH * s, sashW = V.sashW * s;
  if (olH) {
    const osf = w.olT === 'K' ? sf : 3;
    face(q('ol-front'), V.innerW * s, olH, x0 + pf, y0 + pf, z0, '', '0 0', hole(V.innerW * s, olH, osf, osf, V.innerW * s - osf, olH - osf));
    face(q('ol-back'), V.innerW * s, olH, x0 + pf, y0 + pf, z0 - fd, 'rotateY(180deg)', '50% 50%', hole(V.innerW * s, olH, osf, osf, V.innerW * s - osf, olH - osf));
    face(q('ol-glass'), V.innerW * s - 2 * osf, olH - 2 * osf, x0 + pf + osf, y0 + pf + osf, z0 - fd / 2, '', '0 0');
  }
  for (let i = 0; i < V.n - 1; i++) {
    const mx = x0 + pf + (i + 1) * sashW + i * mul;
    face(q('mul-' + i), mul, sashH, mx, sashTop, z0, '', '0 0');
    face(q('mulb-' + i), mul, sashH, mx, sashTop, z0 - fd, 'rotateY(180deg)', '50% 50%');
  }
  w.sashes.forEach((x, i) => {
    const sash = q('sash-' + i), fixed = x.t === 'F', ssf = fixed ? 3 : sf, left = x0 + pf + i * (sashW + mul);
    if (!sash) return;
    sash.style.width = px(sashW); sash.style.height = px(sashH);
    sash.style.transformOrigin = x.t === 'K' ? '50% 100%' : (x.din === 'L' ? '0 50%' : '100% 50%');
    const open = o.openSash === i ? (x.t === 'K' ? 'rotateX(-16deg)' : x.t === 'DK' ? (x.din === 'L' ? 'rotateY(-34deg)' : 'rotateY(34deg)') : x.t === 'D' ? (x.din === 'L' ? 'rotateY(-46deg)' : 'rotateY(46deg)') : '') : '';
    sash.style.transform = 'translate3d(' + px(left) + ', ' + px(sashTop) + ', ' + px(z0) + ')' + (open ? ' ' + open : '');
    face(q('sf-in-' + i), sashW, sashH, 0, 0, 0, '', '0 0', hole(sashW, sashH, ssf, ssf, sashW - ssf, sashH - ssf));
    face(q('sf-out-' + i), sashW, sashH, 0, 0, -fd, 'rotateY(180deg)', '50% 50%', hole(sashW, sashH, ssf, ssf, sashW - ssf, sashH - ssf));
    face(q('glass-' + i), sashW - 2 * ssf, sashH - 2 * ssf, ssf, ssf, -fd / 2, '', '0 0');
    face(q('sfe-l-' + i), fd, sashH, 0, 0, 0, 'rotateY(90deg)', '0 0'); face(q('sfe-r-' + i), fd, sashH, sashW, 0, 0, 'rotateY(90deg)', '0 0');
    face(q('sfe-t-' + i), sashW, fd, 0, 0, 0, 'rotateX(-90deg)', '0 0'); face(q('sfe-b-' + i), sashW, fd, 0, sashH, 0, 'rotateX(-90deg)', '0 0');
    face(q('ring-' + i), sashW, sashH, 0, 0, 1, '', '0 0');
    const hd = q('handle-' + i);
    if (hd) { const hl = 135 * s, hw = Math.max(5, 22 * s); if (x.t === 'K') { hd.style.width = px(hl); hd.style.height = px(hw); hd.style.transform = 'translate3d(' + px(sashW / 2 - hl / 2) + ', ' + px(Math.max(2, sf / 2 - hw / 2)) + ', 5px)'; } else { hd.style.width = px(hw); hd.style.height = px(hl); hd.style.transform = 'translate3d(' + px(x.din === 'L' ? sashW - sf / 2 - hw / 2 : sf / 2 - hw / 2) + ', ' + px(sashH / 2 - hl / 2) + ', 5px)'; } }
    w.bars.filter((b) => b.s === i).forEach((b) => { w3dBarPos(q('bar-' + b.id), b, Math.max(2, w.breite * s)); });
  });
  if (q('roll-f')) { const rh = 180 * s, rz = w.roll === 'vorbau' ? -T - 140 * s : -T, bw = moW + 80 * s, bx = -moW / 2 - 40 * s, by = -moH / 2 - rh, dp = -rz - T + 1; face(q('roll-f'), bw, rh, bx, by, rz, 'rotateY(180deg)', '50% 50%'); face(q('roll-b'), bw, dp, bx, -moH / 2, -T, 'rotateX(-90deg)', '0 0'); face(q('roll-t'), bw, dp, bx, by, -T, 'rotateX(-90deg)', '0 0'); face(q('roll-l'), dp, rh, bx, by, -T, 'rotateY(90deg)', '0 0'); face(q('roll-r'), dp, rh, bx + bw, by, -T, 'rotateY(90deg)', '0 0'); }
  if (q('mesh')) face(q('mesh'), elW - 2 * pf, elH - 2 * pf, x0 + pf, y0 + pf, z0 - fd - 6 * s, '', '0 0');
  /* Maßlinien in der Wandebene (Öffnung) oder Fensterebene (Element) */
  const DIM = { hm: ['v', 0, -moH / 2, moH, 4, 24], hl: ['v', -moW / 2 + 40 * s, -moH / 2, moH, 4, 78], hr: ['v', moW / 2 - 40 * s, -moH / 2, moH, 4, 78], wm: ['h', -moW / 2, 0, moW, 4, 22], wt: ['h', -moW / 2, -moH / 2 + 40 * s, moW, 4, 76], wb: ['h', -moW / 2, moH / 2 - 40 * s, moW, 4, 24], eh: ['v', x0 + elW * 0.72, y0, elH, z0 + 6, 58], ew: ['h', x0, y0 + elH * 0.4, elW, z0 + 6, 76] };
  (V.dims || []).forEach((k) => {
    const D = DIM[k], de = q('dim-' + k); if (!D || !de) return;
    const vert = D[0] === 'v';
    de.style.width = px(vert ? 0 : D[3]); de.style.height = px(vert ? D[3] : 0);
    de.style.transform = 'translate3d(' + px(D[1]) + ', ' + px(D[2]) + ', ' + px(D[4]) + ')';
    de.classList.toggle('v', vert); de.classList.toggle('h', !vert);
    const lab = q('lab-' + k); if (lab) { lab.textContent = (o.labels && o.labels[k]) || '?'; if (vert) { lab.style.top = D[5] + '%'; lab.style.left = '0'; } else { lab.style.left = D[5] + '%'; lab.style.top = '0'; } }
  });
}
function w3dBarPos(be, b, bw) {
  if (!be) return;
  if (b.d === 'v') { be.style.left = 'calc(' + n1(b.p * 100) + '% - ' + px(bw / 2) + ')'; be.style.top = '0'; be.style.width = px(bw); be.style.height = '100%'; }
  else { be.style.top = 'calc(' + n1(b.p * 100) + '% - ' + px(bw / 2) + ')'; be.style.left = '0'; be.style.height = px(bw); be.style.width = '100%'; }
}
/* Glasflächen in Bühnenkoordinaten (Frontansicht), gerechnet statt gemessen, damit Übergänge nicht stören */
const W3D_PERSP = 1300;
function w3dGlassRects(stage, w, o) {
  const V = w3dCalc(w, Object.assign({}, o, { stageW: stage.clientWidth || 358, stageH: stage.clientHeight || 360 })), s = V.s;
  const W = stage.clientWidth || 358, H = stage.clientHeight || 360, cx = W / 2, cy = H / 2, oy = H * 0.46;
  const d = V.laib * s, fd = W3D.FD * s, z = -d - fd / 2, f = W3D_PERSP / (W3D_PERSP - z);
  const x0 = V.x0 * s, y0 = V.y0 * s, pf = V.pf * s, sf = V.sf * s, mul = V.mul * s, olH = V.olH * s, sashTop = y0 + pf + (olH ? olH + mul : 0), sashW = V.sashW * s, sashH = V.sashH * s;
  const proj = (x, y) => [cx + x * f, oy + (cy + y - oy) * f];
  return { s: s, sashes: w.sashes.map((x, i) => { const ssf = x.t === 'F' ? 3 : sf, left = x0 + pf + i * (sashW + mul) + ssf, top = sashTop + ssf, a = proj(left, top), b = proj(left + sashW - 2 * ssf, top + sashH - 2 * ssf); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; }) };
}
/* Schieberegler neben dem Modell: waagerechte Leiste für senkrechte Sprossen, senkrechte Leiste für waagerechte */
function layoutRails(stage, w, o) {
  const rh = stage.querySelector('[data-rail="v"]'), rv = stage.querySelector('[data-rail="h"]');
  if (!rh || !rv) return;
  if (!o.rails) { rh.hidden = true; rv.hidden = true; return; }
  rh.hidden = false; rv.hidden = false;
  const G = w3dGlassRects(stage, w, o), gs = G.sashes;
  const left = Math.min.apply(null, gs.map((g) => g.x)), right = Math.max.apply(null, gs.map((g) => g.x + g.w)), top = gs[0].y, bottom = gs[0].y + gs[0].h;
  rh.style.left = px(left); rh.style.width = px(right - left); rh.style.top = px(bottom + 40);
  rv.style.top = px(top); rv.style.height = px(bottom - top); rv.style.left = px(left - 42);
  rh.setAttribute('data-span', JSON.stringify(gs.map((g) => [Math.round((g.x - left) * 10) / 10, Math.round(g.w * 10) / 10])));
  const base = (id) => id.replace(/s\d+$/, ''), sel = o.selBar ? base(o.selBar) : '';
  let hh = '<span class="track"></span>';
  w.bars.filter((b) => b.d === 'v').forEach((b) => { const g = gs[b.s]; if (!g) return; hh += '<button type="button" class="rh' + (base(b.id) === sel ? ' is-sel' : '') + '" data-rb="' + b.id + '" data-rs="' + b.s + '" style="left: ' + px(g.x + b.p * g.w - left) + '" aria-label="Senkrechte Sprosse verschieben"></button>'; });
  rh.innerHTML = hh;
  let hv = '<span class="track"></span>';
  w.bars.filter((b) => b.d === 'h' && b.s === 0).forEach((b) => { hv += '<button type="button" class="rh' + (base(b.id) === sel ? ' is-sel' : '') + '" data-rb="' + b.id + '" data-rs="0" style="top: ' + px(b.p * (bottom - top)) + '" aria-label="Waagerechte Sprosse verschieben"></button>'; });
  rv.innerHTML = hv;
}
/* Kamera drehen (Finger) und Flügel antippen */
function bindW3D(stage, getOpts) {
  if (!stage || stage.getAttribute('data-bound')) return;
  stage.setAttribute('data-bound', '1');
  const cur = (k, d) => { const v = parseFloat(stage.style.getPropertyValue(k)); return isNaN(v) ? d : v; };
  let rx = 0, ry = 0;
  stage.addEventListener('pointerdown', (e) => {
    const o = getOpts() || {}, view = VIEWS[stage.getAttribute('data-view') || 'inside'];
    if (e.target.closest('.rail')) return;
    if (e.button != null && e.button > 0) return;
    rx = cur('--rx', view[0]); ry = cur('--ry', view[1]);
    const sx = e.clientX, sy = e.clientY, rx0 = rx, ry0 = ry, hit = e.target.closest ? e.target.closest('[data-sash]') : null;
    let moved = false;
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    const move = (ev) => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return; moved = true; stage.classList.add('is-drag'); ry = Math.max(view[1] - 52, Math.min(view[1] + 52, ry0 + dx * 0.35)); rx = Math.max(view[0] - 20, Math.min(view[0] + 20, rx0 - dy * 0.25)); stage.style.setProperty('--rx', rx + 'deg'); stage.style.setProperty('--ry', ry + 'deg'); };
    const up = (ev) => {
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
      stage.classList.remove('is-drag');
      if (!moved && o.onSash && hit) o.onSash(+hit.getAttribute('data-sash'));
    };
    stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  });
}
/* Kamera weich auf eine Ansicht fahren */
function w3dView(stage, v) { if (!stage || !v) return; stage.style.setProperty('--rx', v[0] + 'deg'); stage.style.setProperty('--ry', v[1] + 'deg'); }

/* ---------- KI im Hintergrund: Struktur (Glas, Rahmen, Laibung) und technische Fakten je Foto ---------- */
const AI = (function () {
  let sample = null, limits = null, initP = null;
  function init() {
    if (!initP) initP = (async () => {
      try {
        sample = window.FotoKI ? await window.FotoKI.verbinden() : (window.claude && window.claude.use ? await window.claude.use('sample') : null);
        if (sample) { try { limits = await sample.limits(); } catch (e) { limits = null; } }
      } catch (e) { sample = null; }
      return available();
    })();
    return initP;
  }
  const available = () => !!(sample && limits && limits.images);
  const okPt = (a) => Array.isArray(a) && a.length >= 2 && a[0] !== null && a[1] !== null && isFinite(+a[0]) && isFinite(+a[1]);
  function loadImage(src) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('Bild')); im.src = src; }); }
  async function shrink(file) {
    const url = URL.createObjectURL(file);
    try {
      const im = await loadImage(url), W = im.naturalWidth, H = im.naturalHeight, k = Math.min(1, Math.sqrt(1.15e6 / (W * H)));
      const cv = document.createElement('canvas'); cv.width = Math.round(W * k); cv.height = Math.round(H * k);
      const ctx = cv.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(im, 0, 0, cv.width, cv.height);
      const blob = await new Promise((res) => cv.toBlob((b) => res(b), 'image/jpeg', 0.9));
      return { blob: blob, w: W, h: H };
    } finally { URL.revokeObjectURL(url); }
  }
  function promptStructure(side) {
    const out = side === 'out';
    return [
      'Du bist die Messsoftware einer App für Fenster-Aufmaße. Das Bild ist ein Handyfoto eines Fensters ' + (out ? 'von außen (Fassade).' : 'von innen.'),
      'Koordinaten: x von 0 (linker Bildrand) bis 1000 (rechter Bildrand), y von 0 (oberer Bildrand) bis 1000 (unterer Bildrand), bezogen auf Bildbreite und Bildhöhe. Prüfe jede Koordinate am Bild nach.',
      'Arbeite von innen nach außen.',
      'Schritt 1, Glas: Finde jede Glasscheibe. Sie hebt sich durch den Lichteinfall deutlich ab. Gib je Scheibe die vier Ecken der Glasfläche. Was durch das Glas zu sehen ist, ist unwichtig.',
      'Schritt 2, Fensterelement: Um die Scheiben liegt der Rahmen aus Flügeln und Blendrahmen, meist einfarbig. Gib die vier äußeren Ecken des sichtbaren Fensterelements, dort, wo die Rahmenfarbe endet und ' + (out ? 'Putz, Mauerwerk oder Fensterbank' : 'Laibung, Putz oder Wand') + ' beginnt.',
      'Schritt 3, Maueröffnung: die Öffnung in der Wand, in der das Fenster sitzt. Gib die vier Ecken, an denen die Laibung in die Wandfläche übergeht' + (out ? ' (von außen die Kante des Mauerwerks um das Fenster)' : ' (die Kante zwischen Laibung und Zimmerwand; unten die Fensterbank)') + '. Schätze die Laibungstiefe in mm.',
      'Schritt 4, Lage: Wie schräg ist das Foto? Gib "neigung_grad" als Drehung der oberen Rahmenkante gegen die Waagerechte (positiv = rechts tiefer).',
      'Schritt 5: Anzahl der Flügel, Teilung, Öffnungsart, material (kunststoff, holz, alu, holzalu), farbe.',
      '',
      'Antworte ausschließlich mit JSON in genau dieser Form:',
      '{"fenster_gefunden":true,"scheiben":[{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]}],"element":{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]},"oeffnung":{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]},"laibung_mm":150,"neigung_grad":1.5,"fluegel":2,"teilung":"2 Flügel mit Pfosten","oeffnungsart":"Dreh-Kipp","material":"kunststoff","farbe":"weiß","hinweise":"ein kurzer Satz"}',
      'Ist keine Öffnung erkennbar, setze "oeffnung": null. Ist wirklich kein Fenster zu sehen: {"fenster_gefunden":false,"hinweise":"..."}'
    ].join('\n');
  }
  function promptFacts(side) {
    const out = side === 'out';
    return [
      'Du berätst einen Fensterbauer. Das Bild ist ein Handyfoto eines Fensters ' + (out ? 'von außen (Fassade)' : 'von innen') + ', aufgenommen vom Kunden für ein Angebot. Beschreibe alles, was der Fensterbauer für Angebot und Einbau wissen muss, so genau, wie es das Foto hergibt. Wenn etwas nicht erkennbar ist, schreibe "unklar". Erfinde nichts.',
      out ? 'Achte auf: Fassade (Putz, Klinker, WDVS, Holz), Außenanschlag (steht Mauerwerk vor dem Rahmen, wie viel), Rollladen außen (Vorbaukasten, Führungsschienen), Fensterbank außen (Material, Gefälle, Überstand), Zustand von Rahmen, Dichtungen und Anschlussfugen, Verglasung (Abstandhalter, Spiegelung), Gitter, Klappläden, Markise, Geschoss, Zugänglichkeit (Gerüst nötig?), Besonderheiten.'
        : 'Achte auf: Material und Farbe des Rahmens, Alter und Zustand (vergilbt, Lack, feucht, Dichtungen porös, Beschläge), Verglasung (einfach, 2-fach, 3-fach, Sprossen, Ornamentglas), Flügel und Öffnungsart, Griff, Rollladen (Kasten innen, Gurt, Kurbel, Motor), Fensterbank innen (Material, Tiefe), Heizkörper unter dem Fenster (Abstand), Laibung (Putz, Tapete, Fliesen, Holzverkleidung), Innenanschlag, Gardinenschiene, Steckdosen oder Kabel in der Laibung, Raumart, Besonderheiten für Ausbau und Montage.',
      'Antworte ausschließlich mit JSON: {"chips":["Kunststoff, weiß","2 Flügel Dreh-Kipp","Rollladenkasten innen"],"rows":[["Material","Kunststoff, weiß, leicht vergilbt"],["Verglasung","2-fach, Abstandhalter Alu, vermutlich 1990er"],["Rollladen","Kasten innen über dem Fenster, Gurtantrieb links"]],"hinweise":["Gardinenschiene vor dem Einbau abnehmen"],"sicherheit":0.7}',
      '"chips": 3 bis 5 kurze Stichworte für den Kunden. "rows": 6 bis 12 Zeilen [Begriff, Befund] für den Fensterbauer, Fachsprache erlaubt. "hinweise": 0 bis 4 Sätze zu Ausbau, Montage oder Angebot.'
    ].join('\n');
  }
  const quad = (q, W, H) => { if (!q || typeof q !== 'object') return null; const pts = ['ol', 'or', 'ur', 'ul'].map((k) => (okPt(q[k]) ? [Math.max(0, Math.min(1000, +q[k][0])) / 1000 * W, Math.max(0, Math.min(1000, +q[k][1])) / 1000 * H] : null)); return pts.some((p) => !p) ? null : pts; };
  function readStructure(j, W, H) {
    if (!j || j.fenster_gefunden === false) return { found: false, hint: j && j.hinweise ? String(j.hinweise) : '' };
    const inner = quad(j.element, W, H), outer = quad(j.oeffnung, W, H);
    const out = { found: !!inner, inner: inner, outer: outer, glass: (Array.isArray(j.scheiben) ? j.scheiben : []).map((q) => quad(q, W, H)).filter(Boolean),
      laib: isFinite(+j.laibung_mm) ? Math.max(0, Math.min(600, Math.round(+j.laibung_mm))) : null, tilt: isFinite(+j.neigung_grad) ? Math.round(+j.neigung_grad * 10) / 10 : null,
      fluegel: parseInt(j.fluegel, 10) || null, teilung: j.teilung ? String(j.teilung).slice(0, 60) : '', oeffnung: j.oeffnungsart ? String(j.oeffnungsart).slice(0, 60) : '', material: j.material ? String(j.material).slice(0, 20) : '', farbe: j.farbe ? String(j.farbe).slice(0, 20) : '', hint: j.hinweise ? String(j.hinweise).slice(0, 200) : '' };
    if (inner) { const xs = inner.map((p) => p[0]), ys = inner.map((p) => p[1]); if (Math.max.apply(null, xs) - Math.min.apply(null, xs) < 0.08 * W || Math.max.apply(null, ys) - Math.min.apply(null, ys) < 0.08 * H) out.found = false; }
    return out;
  }
  function readFacts(j) {
    if (!j || typeof j !== 'object') return null;
    const str = (v) => String(v == null ? '' : v).slice(0, 160);
    return { chips: (Array.isArray(j.chips) ? j.chips : []).map(str).filter(Boolean).slice(0, 6), rows: (Array.isArray(j.rows) ? j.rows : []).filter((r) => Array.isArray(r) && r.length >= 2).map((r) => [str(r[0]).slice(0, 40), str(r[1])]).slice(0, 14), hints: (Array.isArray(j.hinweise) ? j.hinweise : []).map(str).filter(Boolean).slice(0, 5), conf: isFinite(+j.sicherheit) ? +j.sicherheit : null };
  }
  async function ask(prompt, blob, tier, signal, task, side) { return sample.json(prompt, { images: blob, modelTier: tier, signal: signal, aufgabe: task, seite: side }); }
  /* Beide Anfragen je Foto laufen parallel; Fehler einzeln, damit ein Teil den anderen nicht mitreißt */
  async function analyze(file, side, signal, onPart) {
    const img = await shrink(file), res = { w: img.w, h: img.h, struct: null, facts: null, errs: {} };
    await Promise.all([
      ask(promptStructure(side), img.blob, 'complex', signal, 'struktur', side).then((j) => { res.struct = readStructure(j, img.w, img.h); if (onPart) onPart('struct', res); }, (e) => { res.errs.struct = e && e.code || 'error'; if (e && e.code === 'cancelled') throw e; }),
      ask(promptFacts(side), img.blob, 'default', signal, 'fakten', side).then((j) => { res.facts = readFacts(j); if (onPart) onPart('facts', res); }, (e) => { res.errs.facts = e && e.code || 'error'; if (e && e.code === 'cancelled') throw e; })
    ]);
    return res;
  }
  const ERR = { not_granted: 'Ohne deine Freigabe kann die KI die Fotos nicht ansehen.', rate_limited: 'Gerade laufen zu viele KI-Anfragen. Die Fotos werden später ausgewertet.', refused: 'Die KI hat dieses Foto nicht ausgewertet.', image_rejected: 'Dieses Bild konnte die KI nicht verarbeiten.', images_unavailable: 'In dieser Ansicht kann die KI keine Bilder ansehen.' };
  const errText = (code) => ERR[code] || 'Die KI-Auswertung hat nicht geklappt. Dein Aufmaß geht trotzdem weiter.';
  /* Beispielfotos: feste Ergebnisse, damit der Ablauf ohne KI erlebbar ist */
  const DEMO = {
    in: { w: 1200, h: 1400, struct: { found: true, inner: DEMO_QUADS.in.inner, outer: DEMO_QUADS.in.outer, glass: [], laib: 150, tilt: 0.4, fluegel: 2, teilung: '2 Flügel mit Pfosten', oeffnung: 'Dreh-Kipp', material: 'kunststoff', farbe: 'weiß', hint: '' },
      facts: { chips: ['Kunststoff, weiß', '2 Flügel Dreh-Kipp', 'Heizkörper unter dem Fenster', 'Steckdose in der Laibung'], rows: [['Material', 'Kunststoff, weiß, leicht vergilbt'], ['Verglasung', '2-fach, Abstandhalter Aluminium, vermutlich 1990er Jahre'], ['Flügel', '2 Flügel Dreh-Kipp mit Pfosten, Griffe weiß'], ['Zustand', 'Dichtungen porös, Beschläge sichtbar in Ordnung'], ['Rollladen', 'Keiner erkennbar'], ['Fensterbank innen', 'Werzalit weiß, ca. 20 cm tief'], ['Heizkörper', 'Plattenheizkörper direkt unter dem Fenster, Oberkante ca. 8 cm unter der Bank'], ['Laibung', 'Glatt verputzt, Innenanschlag nicht erkennbar'], ['Elektrik', 'Steckdose und Lichtschalter rechts neben dem Fenster']], hints: ['Heizkörper bleibt beim Ausbau im Weg, Fensterbank vorsichtig lösen.'], conf: 0.8 }, errs: {} },
    out: { w: 1200, h: 1400, struct: { found: true, inner: DEMO_QUADS.out.inner, outer: DEMO_QUADS.out.outer, glass: [], laib: 120, tilt: -0.3, fluegel: 2, teilung: '2 Flügel mit Pfosten', oeffnung: 'Dreh-Kipp', material: 'kunststoff', farbe: 'weiß', hint: '' },
      facts: { chips: ['Klinkerfassade', 'Vorbaurollladen', 'Fensterbank Alu'], rows: [['Fassade', 'Klinker, Normalformat, Fugen in Ordnung'], ['Außenanschlag', 'Ca. 3 cm, Mauerwerk steht vor dem Rahmen'], ['Rollladen', 'Vorbaukasten über dem Fenster, Führungsschienen seitlich'], ['Fensterbank außen', 'Aluminium mit Gefälle, Überstand ca. 4 cm'], ['Zustand außen', 'Rahmen hell, Silikonfuge zur Fensterbank gerissen'], ['Geschoss', 'Erdgeschoss, vom Boden erreichbar, kein Gerüst nötig']], hints: ['Rollladenschienen beim Ausbau lösen, Kasten bleibt.'], conf: 0.75 }, errs: {} }
  };
  return { init: init, available: available, analyze: analyze, errText: errText, DEMO: DEMO };
})();

/* ---------- Zustand ---------- */
/* Adressen aus der aktuellen Seite: läuft so auf pages.dev und auf der eigenen Domain */
const APP_URL = location.href.split('#')[0].split('?')[0];
const PORTAL_URL = new URL('../', APP_URL).href;
const PORTAL_OPEN = PORTAL_URL;
const STORE = 'aufmass.v1';
const PROJ0 = { gebaeude: 'efh', baujahr: '', total: 9, zeit: '3m', budget: 'b0', foerd: false, name: '', ort: '', tel: '', mail: '', erreich: 'nm' };
const S = {
  screen: 'home', dir: 'fwd', betrieb: null, windows: [], win: baseWin(), editIdx: -1,
  photos: { in: null, out: null }, ai: { in: null, out: null }, aiOk: null,
  mess: { step: 0, cur: '', msg: null, ack: false }, rest: { i: 0, cur: '', msg: null }, openSash: -1,
  selSash: 0, selBar: null, side: 'aussen', q: null, gloss: null, glossIndex: false, toast: '',
  proj: Object.assign({}, PROJ0),
  admin: { betrieb: 'Fensterbau Brandt', ort: '50668 Köln', tel: '0221 123456', mail: 'info@beispiel.de', abzugB: 20, abzugH: 20, links: [], inbox: [] },
  portal: { role: 'kunde', inseriert: false, decided: {}, knocked: {} },
  sent: null, inboxView: null
};
/* Kundenlink: eigenes Projekt je Code, getrennt vom eigenen Projekt; Senden geht einmal */
const linkKey = () => 'aufmass.k.' + (S.betrieb ? S.betrieb.code : '');
/* Passwörter nie im Browser speichern */
function kaufSicher() { return S.kauf ? Object.assign({}, S.kauf, { pw: '' }) : S.kauf; }
function persist() {
  try {
    if (S.betrieb) localStorage.setItem(linkKey(), JSON.stringify({ windows: S.windows, proj: S.proj, sent: S.sent, kauf: kaufSicher(), name: S.betrieb.name }));
    else localStorage.setItem(STORE, JSON.stringify({ windows: S.windows, proj: S.proj, admin: S.admin, portal: S.portal, kauf: kaufSicher() }));
  } catch (e) { /* ohne Speicher weiter */ }
}
function normProj(p) { if (p.zeit === 'sofort') p.zeit = 'asap'; if (p.zeit === 'offen') p.zeit = '12m'; if (p.gebaeude === 'altbau') p.gebaeude = 'efh'; return p; }
function takeWindows(arr) { S.windows = arr.map((x) => Object.assign(baseWin(), x)); S.windows.forEach((x) => (x.bars || []).forEach((b) => { const m = /^b(\d+)/.exec(String(b.id)); if (m && +m[1] >= BID) BID = +m[1] + 1; })); }
function loadLink() {
  S.windows = []; S.proj = Object.assign({}, PROJ0); S.sent = null; S.kauf = null; S.editIdx = -1; S.win = baseWin();
  try { const raw = localStorage.getItem(linkKey()); if (!raw) return; const o = JSON.parse(raw); if (o && Array.isArray(o.windows)) takeWindows(o.windows); if (o && o.proj) normProj(Object.assign(S.proj, o.proj)); if (o && o.sent) S.sent = o.sent; if (o && o.kauf) S.kauf = o.kauf; } catch (e) { /* ok */ }
}
function loadOwn() { S.windows = []; S.proj = Object.assign({}, PROJ0); S.sent = null; S.kauf = null; S.editIdx = -1; S.win = baseWin(); restore(); }
function restore() {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return;
    const o = JSON.parse(raw);
    if (o && Array.isArray(o.windows)) takeWindows(o.windows);
    if (o && o.proj) normProj(Object.assign(S.proj, o.proj));
    if (o && o.admin) Object.assign(S.admin, o.admin);
    if (o && o.portal) Object.assign(S.portal, o.portal);
    if (o && o.kauf) S.kauf = o.kauf;
  } catch (e) { /* ok */ }
}
function readHash() {
  const m = /^#k-([a-z0-9]{3,12})(?:-([A-Za-z0-9_]*))?(?:\.([A-Za-z0-9_-]+))?(?:\.([A-Za-z0-9_-]+))?$/.exec(location.hash || '');
  if (!m) return null;
  const dec = (v) => { if (!v) return ''; try { const b = v.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); } catch (e) { return ''; } };
  const clean = (t) => String(t || '').replace(/[<>"]/g, '').trim().slice(0, 60);
  return { code: m[1].toLowerCase(), name: clean(dec(m[3]) || (m[2] || '').replace(/_/g, ' ')), kunde: clean(dec(m[4])) };
}
const slug = (t) => String(t || '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
/* ---------- Rendern ---------- */
const $app = () => document.getElementById('app');
let lastScreen = null, toastTimer = null;
function setW(patch) { Object.assign(S.win, patch); render(); }
function setP(patch) { Object.assign(S.proj, patch); persist(); render(); }
function go(screen, dir) {
  S.dir = dir || 'fwd'; S.screen = screen; S.gloss = null; S.glossIndex = false; S.selBar = null;
  if (screen === 'rest') { const first = REST.findIndex((r) => !num(S.win.mo[r.k])); S.rest = { i: first < 0 ? 4 : first, cur: '', msg: null }; }
  if (screen !== 'frage') S.openSash = -1;
  if (screen === 'frage' && !S.win.e_teilung) { const ew = derive(S.win).elW || 0, t = ew && ew < 1000 ? '1' : ew >= 2000 ? '3' : '2p'; if (t !== S.win.teilung) { S.win.teilung = t; S.win.sashes = sashesFor(t); S.win.bars = S.win.preset !== 'keine' && S.win.preset !== 'eigene' ? presetBars(S.win.preset, S.win.sashes.length) : S.win.bars.filter((b) => b.s < S.win.sashes.length); S.selSash = 0; } }
  render(true);
}
function toast(msg) { S.toast = msg; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = ''; render(); }, 1900); }
function render(fresh) {
  const root = $app(), scroller = root.querySelector('.scroll'), keep = !fresh && scroller ? scroller.scrollTop : 0;
  const view = SCREENS[S.screen] ? SCREENS[S.screen]() : SCREENS.home();
  const si = STEPS.indexOf(S.screen), wiz = si >= 0;
  const qShare = S.screen === 'frage' && view.qpos ? view.qpos : 1;
  const title = wiz ? (S.editIdx >= 0 ? (S.win.name || 'Fenster') : 'Neues Fenster') : ({ fertig: 'Fenster', anfrage: 'Anfrage', anfrage2: 'Anfrage', anfrage3: 'Anfrage', blatt: S.kauf && S.kauf.paid ? 'Aufmaßblatt' : S.betrieb ? (S.sent ? (PILOT ? 'Senden' : 'Gesendet') : 'Prüfen') : '', admin: 'Fensterbauer', adminblatt: 'Eingang', portal: 'Fensterportal', gesendet: '' }[S.screen] || '');
  const prevStage = root.querySelector('#w3d'), prevSig = prevStage ? prevStage.getAttribute('data-sig') : null;
  const backLabel = view.back ? view.back[0] : '';
  let h = '<header class="hdr"><div class="hdr-row">';
  h += S.screen === 'home' ? '<div class="hdr-logo">' + LOGO(30) + '<span class="hdr-name">Klopfan</span></div>'
    : (view.back ? '<button type="button" class="hdr-btn" data-act="back"><svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>' + esc(backLabel) + '</span></button>' : '<span></span>');
  h += '<span class="hdr-title">' + esc(title) + '</span>';
  h += '<button type="button" class="hdr-btn" data-act="gindex"><svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 4.5C3 3.7 3.7 3 4.5 3H11v16H4.5c-.8 0-1.5.5-1.5 1.2zM19 4.5c0-.8-.7-1.5-1.5-1.5H11v16h6.5c.8 0 1.5.5 1.5 1.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg><span>Begriffe</span></button></div>';
  if (wiz) h += '<div class="prog"><div style="width: ' + ((si + qShare) / STEPS.length * 100) + '%"></div></div>';
  h += '</header>';
  h += '<div class="scroll' + (view.fit ? ' fit' : '') + '" style="padding-top: ' + (wiz ? 56 : 52) + 'px"><div class="scr' + (view.fit ? ' fit' : '') + (view.cls ? ' ' + view.cls : '') + (S.dir === 'back' ? ' is-back' : '') + '" data-screen="' + S.screen + '">' + view.html + '</div></div>';
  if (view.bar) h += '<div class="bb">' + (view.bar.sec ? '<button type="button" class="btn ghost" data-act="' + view.bar.secAct + '">' + esc(view.bar.sec) + '</button>' : '') + '<button type="button" class="btn primary" data-act="' + view.bar.act + '"' + (view.bar.v ? ' data-v="' + view.bar.v + '"' : '') + (view.bar.dis ? ' disabled' : '') + '>' + view.bar.label + '</button></div>';
  h += sheetsHTML();
  if (S.toast) h += '<div class="toast" role="status">' + esc(S.toast) + '</div>';
  root.innerHTML = h;
  /* Gleiche Modellstruktur wie zuvor: die alte Bühne bleibt, alles Weitere morpht mit Übergängen */
  const ph = root.querySelector('#w3d');
  if (ph && prevStage && prevSig && ph.getAttribute('data-sig') === prevSig && ph.getAttribute('data-keep') !== '0') { prevStage.className = ph.className; prevStage.style.height = ph.style.height; ph.replaceWith(prevStage); prevStage.setAttribute('data-reused', '1'); } else if (prevStage) prevStage.removeAttribute('data-reused');
  const sc = root.querySelector('.scroll');
  if (fresh || lastScreen !== S.screen) { if (sc) sc.scrollTop = 0; } else if (sc) sc.scrollTop = keep;
  if (lastScreen === S.screen && !fresh) { const scr = root.querySelector('.scr'); if (scr) scr.style.animation = 'none'; }
  lastScreen = S.screen;
  bindAfterRender();
}
/* ---------- Bausteine ---------- */
const ICON_I = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.7"></circle><path d="M11 10v5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="11" cy="6.8" r="1.3" fill="currentColor"></circle></svg>';
const CHEV = '<svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true"><path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="var(--line2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="var(--ok)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
function hd(eyebrow, h1, sub, cls, eyeCls) { return '<div class="hd' + (cls ? ' ' + cls : '') + '"><p class="eyebrow' + (eyeCls ? ' ' + eyeCls : '') + '">' + esc(eyebrow) + '</p><h1>' + h1 + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'; }
function secHead(title, g, sub) { return (title ? '<div class="sec-head"><h2 class="sec-title">' + esc(title) + '</h2>' + (g ? '<button type="button" class="link" data-act="gloss" data-k="' + g + '">' + ICON_I + 'Was heißt das?</button>' : '') + '</div>' : '') + (sub ? '<p class="sub" style="margin-top: -6px; padding: 0 6px">' + esc(sub) + '</p>' : ''); }
function cards(group, cur, field, icoFn, cols, target) {
  return '<div class="' + (cols === 3 ? 'grid3' : 'grid2') + '">' + OPT[group].map((o) => '<div class="opt"><button type="button" data-act="' + (target || 'setw') + '" data-f="' + field + '" data-v="' + o.k + '" aria-pressed="' + (String(cur) === String(o.k)) + '">' + (icoFn ? svgIcon(icoFn(o.k), cols === 3 ? 46 : 56) : '') + '<span class="lbl">' + esc(o.label) + '</span>' + (o.sub ? '<span class="sb">' + esc(o.sub) + '</span>' : '') + (o.price ? '<span class="pr">' + esc(o.price) + '</span>' : '') + '</button>' + (o.g ? '<button type="button" class="info" aria-label="Erklärung" data-act="gloss" data-k="' + o.g + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
function chips(group, cur, field, target) {
  return '<div class="chips">' + OPT[group].map((o) => '<button type="button" class="chip" data-act="' + (target || 'setw') + '" data-f="' + field + '" data-v="' + o.k + '" aria-pressed="' + (String(cur) === String(o.k)) + '">' + (o.bg ? '<span class="dot" style="background: ' + o.bg + '"></span>' : '') + esc(o.label) + '</button>').join('') + '</div>';
}
function fieldRow(label, field, unit, step, g, badge, badgeCls) {
  const v = S.win[field];
  return '<div class="row"><label><span class="lbl">' + esc(label) + (badge ? '<span class="badge ' + (badgeCls || '') + '">' + esc(badge) + '</span>' : '') + '</span><span class="val"><input type="text" inputmode="numeric" id="f-' + field + '" data-in="w" data-f="' + field + '" value="' + (v === '' || v == null ? '' : esc(v)) + '"><span class="unit">' + unit + '</span></span></label>' + (g ? '<button type="button" class="ibtn" aria-label="Erklärung" data-act="gloss" data-k="' + g + '">' + ICON_I + '</button>' : '') + '<button type="button" class="rnd" aria-label="Weniger" data-act="bump" data-f="' + field + '" data-v="' + (-step) + '">−</button><button type="button" class="rnd" aria-label="Mehr" data-act="bump" data-f="' + field + '" data-v="' + step + '">+</button></div>';
}
function textRow(label, field, ph, mode, target) { const v = (target === 'p' ? S.proj : S.win)[field]; return '<div class="trow"><span>' + esc(label) + '</span><input type="text" id="t-' + field + '" inputmode="' + (mode || 'text') + '" data-in="' + (target || 'w') + '" data-f="' + field + '" value="' + esc(v || '') + '" placeholder="' + esc(ph || '') + '"></div>'; }
function switchRow(label, sub, on, field, g, target) { return '<div class="sw-row"><span class="t"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' + (g ? '<button type="button" class="ibtn" aria-label="Erklärung" data-act="gloss" data-k="' + g + '">' + ICON_I + '</button>' : '') + '<button type="button" class="switch" role="switch" aria-checked="' + on + '" aria-pressed="' + on + '" aria-label="' + esc(label) + '" data-act="' + (target || 'togglew') + '" data-f="' + field + '"><span></span></button></div>'; }
function noteBox(text, g, cls) { return '<div class="note' + (cls ? ' ' + cls : '') + '">' + text + (g ? ' <button type="button" class="ulink" data-act="gloss" data-k="' + g + '">Mehr erfahren</button>' : '') + '</div>'; }
/* ---------- Bildschirme: Start ---------- */
const SCREENS = {};
const HERO_WIN = Object.assign(baseWin(), { w: 1230, h: 1410, mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { h: 1410, w: 1230 }, laib: 140, fa: '7016', fi: '9016' });
const W3DS = {};
function model(w, o) { W3DS[o.id || 'w3d'] = { w: w, o: o }; return w3dHTML(w, o); }
function winCard(x, i, live, hide) { const d = derive(x), tag = live ? 'button' : 'div';
  /* nach dem Senden im Link: keine Maße mehr, die stehen im Aufmaßblatt */
  if (hide) return '<div class="wincard sent"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + (PILOT ? 'Abgeschlossen' : 'Übermittelt') + (x.anzahl > 1 ? ' · ' + x.anzahl + ' Stück' : '') + (x.fotos ? ' · ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '') + '</span><span class="me">Maße und Angaben stehen im Aufmaßblatt</span></span></div>';
  return '<' + tag + (live ? ' type="button"' : '') + ' class="wincard"' + (live ? ' data-act="open" data-i="' + i + '"' : '') + '><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + (d.elW && d.elH ? thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm' : 'Maße offen') + (x.anzahl > 1 ? ' · ' + x.anzahl + ' Stück' : '') + ' · ' + x.sashes.map((z) => TYPNAME[z.t]).join(' · ') + '</span><span class="me">' + esc(colorOf(x.fa).name + ' · ' + lab('glas', x.glas) + '-Glas' + (x.fotos ? ' · ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '')) + '</span></span>' + (live ? CHEV : '') + '</' + tag + '>'; }
SCREENS.home = () => {
  if (S.betrieb) return linkHome();
  const cardsH = S.windows.map((x, i) => winCard(x, i, true)).join('');
  const betrieb = S.betrieb ? '<div class="betrieb"><svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="3" width="22" height="22" rx="5" fill="var(--accent)"></rect><path d="M9 14.5l3.5 3.5 7-8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg><span>Dein Aufmaß geht an<b>' + esc(S.betrieb.name || 'deinen Fensterbauer') + '</b></span></div>' : '';
  const html = '<section class="hero"><p class="eyebrow">Fenster-Aufmaß, geführt</p><h1>Fotografieren.<br>Messen.<br>Wünschen.</h1><p>Zwei Fotos, vier Maße mit dem Zollstock, und aus deinen Zahlen wächst dein Fenster als 3-D-Modell. Dein Fensterbauer bekommt alles fürs Angebot.</p>' +
    '<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 24px"><button type="button" class="btn primary" style="flex: 0 0 auto; padding: 0 28px" data-act="new">Fenster aufmessen</button><button type="button" class="link" data-act="gloss" data-k="referenz">Wie genau ist das? ›</button></div>' +
    '<div class="hero-scene">' + model(HERO_WIN, { id: 'w3d-hero', view: 'three', sway: true, cls: 'hero dims-all', stageH: 340, dims: ['hm', 'wm', 'eh', 'ew'], labels: { hm: '1.480 mm', wm: '1.370 mm', eh: '1.410 mm', ew: '1.230 mm' } }) + '</div></section>' + betrieb +
    '<section class="sec"><div class="sec-head"><h2 class="sec-title" style="font-size: 28px; font-weight: 900">Dein Projekt.</h2><span class="sub">' + S.windows.length + ' Fenster erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + cardsH + '<button type="button" class="dashed" data-act="new"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>' + (S.windows.length ? 'Weiteres Fenster' : 'Erstes Fenster aufmessen') + '</button></div></section>' +
    '<section class="card" style="padding: 30px 22px 26px; border-radius: 28px"><p class="eyebrow">So funktioniert\'s</p><h2 class="sec-title" style="font-size: 30px; line-height: 1.08; font-weight: 900; letter-spacing: -.025em; margin-bottom: 10px">Zollstock statt Rätselraten.</h2><div class="steps">' +
    '<div class="step"><span class="n">1</span><div><b>Fotografieren.</b><p>Innen und außen, das Handy gerade halten. Die KI liest daraus Material, Zustand, Rollladen und Fensterbank.</p></div></div>' +
    '<div class="step"><span class="n">2</span><div><b>Messen.</b><p>Vier Maße mit dem Zollstock, Schritt für Schritt erklärt. Mit jeder Zahl formt sich Öffnung und Fenster als Modell, dann ergänzt du die Ränder.</p></div></div>' +
    '<div class="step"><span class="n">3</span><div><b>Wünschen.</b><p>Flügel antippen, Sprossen ziehen, Farben innen und außen wählen. Jeder Fachbegriff mit Bild erklärt.</p></div></div></div>' +
    '<p style="margin: 22px 0 0; font-size: 17px; line-height: 1.55; color: var(--fg2)">Vor der Fertigung misst dein Fensterbauer einmal vor Ort nach, das <button type="button" class="ulink" data-act="gloss" data-k="feinaufmass">Feinaufmaß</button>.</p></section>' +
    '<div class="foot-links"><a class="link" href="' + PORTAL_OPEN + '" target="_blank" rel="noopener">Für Fensterbauer ›</a><a class="link" href="' + PORTAL_OPEN + '" target="_blank" rel="noopener">Fensterportal ›</a></div>' + rechtLinks();
  return { html: html, bar: S.windows.length ? { label: 'Anfrage vorbereiten', act: 'go', v: 'anfrage' } : null };
};
const PLUS = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>';
const sentWhen = () => { try { const d = new Date(S.sent.when); return d.toLocaleDateString('de-DE') + ' um ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'; } catch (e) { return ''; } };
/* Startseite für Kunden, die über einen Kundenlink kommen */
function linkHome() {
  const name = S.betrieb.name || 'Dein Fensterbauer', ini = esc((name.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '') || 'F').slice(0, 1).toUpperCase()), n = S.windows.length, sent = !!S.sent, kd = S.betrieb.kunde;
  const head = '<div class="lk-from"><span class="lk-av">' + ini + '</span><span><small>' + (sent ? (PILOT ? 'Aufmaß für' : 'Gesendet an') : 'Persönliche Anfrage von') + '</small><b>' + esc(name) + '</b></span></div>' + (kd && !sent ? '<p class="lk-for">für ' + esc(kd) + '</p>' : '');
  const steps = (a, b, c) => '<section class="card" style="gap: 18px"><p class="eyebrow">' + a + '</p><div class="steps">' + b.map((x, i) => '<div class="step"><span class="n" style="font-size: 34px">' + (i + 1) + '</span><div><b>' + x[0] + '</b><p>' + x[1] + '</p></div></div>').join('') + '</div></section>' + (c || '');
  if (sent) {
    const html = '<section class="hero lk">' + head + '<svg class="okmark" viewBox="0 0 64 64" width="84" height="84" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>' + (PILOT ? '<h1>Fast erledigt.</h1><p>Abgeschlossen am ' + esc(sentWhen()) + '. Schick ' + esc(name) + ' jetzt noch deinen Aufmaß-Code, falls noch nicht geschehen. Erst damit kommt dein Aufmaß an.</p><button type="button" class="btn primary" style="flex: 0 0 auto; margin-top: 16px; padding: 0 26px" data-act="go" data-v="gesendet">Code senden</button></section>' : '<h1>Danke, erledigt.</h1><p>' + esc(name) + ' hat dein Aufmaß seit ' + esc(sentWhen()) + ' und meldet sich mit einem Angebot.</p></section>') +
      dateiCard() +
      '<section class="sec"><div class="sec-head"><h2 class="sec-title" style="font-size: 22px; font-weight: 900">' + (PILOT ? 'Abgeschlossen.' : 'Gesendet.') + '</h2><span class="sub">' + n + (n === 1 ? ' Fenster' : ' Fenster') + '</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, false, true)).join('') + '</div></section>' +
      '<p class="sub center lk-note">Fragen und Änderungen klärst du direkt mit ' + esc(name) + '.</p>' + rechtLinks();
    return { html: html, bar: null };
  }
  const html = '<section class="hero lk">' + head + '<p class="eyebrow">Fenster-Aufmaß, geführt</p><h1>Deine Fenster.<br>Deine Maße.</h1><p>' + esc(name) + ' braucht für dein Angebot die Maße deiner Fenster. Zwei Fotos und vier Maße je Fenster, jeder Schritt erklärt. Ein Konto brauchst du nicht.</p>' +
    '<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 22px"><button type="button" class="btn primary" style="flex: 0 0 auto; padding: 0 28px" data-act="new">' + (n ? 'Weiteres Fenster aufmessen' : 'Erstes Fenster aufmessen') + '</button><button type="button" class="link" data-act="gloss" data-k="referenz">Wie genau ist das? ›</button></div>' +
    (n ? '' : '<div class="hero-scene">' + model(HERO_WIN, { id: 'w3d-hero', view: 'three', sway: true, cls: 'hero dims-all', stageH: 250, dims: ['hm', 'wm', 'eh', 'ew'], labels: { hm: '1.480 mm', wm: '1.370 mm', eh: '1.410 mm', ew: '1.230 mm' } }) + '</div>') + '</section>' +
    (n ? '<section class="sec"><div class="sec-head"><h2 class="sec-title" style="font-size: 28px; font-weight: 900">Deine Fenster.</h2><span class="sub">' + n + ' erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + '<button type="button" class="dashed" data-act="new">' + PLUS + 'Weiteres Fenster</button></div></section>' : '') +
    '<p class="sub center lk-note">Deine Angaben gehen nur an ' + esc(name) + ', sonst an niemanden.</p>' + rechtLinks();
  return { html: html, bar: n ? { label: 'Weiter zum Absenden', act: 'go', v: 'anfrage' } : null };
}
/* ---------- Fotos ---------- */
function photoTile(which) {
  const p = S.photos[which], a = S.ai[which], label = which === 'in' ? 'Von innen' : 'Von außen', demo = p && p.demo;
  let inner;
  if (!p) inner = '<span class="empty"><svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><path d="M8 15.5c0-1.9 1.6-3.5 3.5-3.5h4.2l2.4-4h7.8l2.4 4h4.2c1.9 0 3.5 1.6 3.5 3.5v16c0 1.9-1.6 3.5-3.5 3.5h-21C9.6 35 8 33.4 8 31.5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"></path><circle cx="22" cy="23" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"></circle></svg>' + label + '<br><small style="font-weight: 600; color: var(--muted)">' + (which === 'in' ? 'nötig' : 'empfohlen') + '</small></span>';
  else inner = '<img src="' + p.url + '" alt="' + label + '">';
  const ai = p ? (a && a.status === 'running' ? '<span class="ai"><span class="spin"></span>KI liest</span>' : a && a.status === 'done' ? '<span class="ai">' + '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>KI fertig</span>' : a && a.status === 'error' ? '<span class="ai">ohne KI</span>' : '') : '';
  return '<label class="tile"><input type="file" accept="image/*" capture="environment" data-in="photo" data-f="' + which + '">' + inner + ai + (p ? '<span class="tag">' + CHECK + esc(label) + (demo ? ' · Beispiel' : '') + '</span>' : '') + '</label>';
}
SCREENS.fotos = () => {
  const p = S.photos.in, tilt = p && S.ai.in && S.ai.in.struct && S.ai.in.struct.tilt != null ? S.ai.in.struct.tilt : null;
  let level = '<div class="level"><span class="bubble"><span></span></span><span>Handy <b>gerade</b> halten, das Fenster ganz im Bild, etwas Wand drumherum.</span></div>';
  if (tilt != null) level = '<div class="level"><span class="bubble"><span style="animation: none; left: ' + Math.round(25 + Math.max(-20, Math.min(20, tilt * 4))) + 'px"></span></span><span>' + (Math.abs(tilt) <= 2.5 ? 'Dein Foto ist mit ' + String(Math.abs(tilt)).replace('.', ',') + '° fast waagerecht. Passt.' : 'Dein Foto ist etwa ' + String(Math.abs(tilt)).replace('.', ',') + '° schräg. Es geht, gerader wäre besser.') + '</span></div>';
  const kiNote = S.aiOk === false ? noteBox('Die KI-Auswertung der Fotos ist hier gerade nicht eingeschaltet. Das Aufmaß funktioniert trotzdem komplett, nur die Zusatzinfos aus den Fotos fehlen.', null, 'warn') : '';
  const html = hd('Schritt 1 von 5 · Fotos', 'Fotografiere dein Fenster.', 'Einmal von innen, einmal von außen. Die KI liest daraus Material, Glas, Rollladen und mehr, du musst nichts eintippen.') +
    '<div class="tiles">' + photoTile('in') + photoTile('out') + '</div>' + level + kiNote +
    (!p ? '<button type="button" class="link" style="align-self: center" data-act="demo">Keine Kamera zur Hand? Beispielfotos nutzen</button>' : '');
  return { html: html, back: ['Projekt', 'home'], bar: { label: 'Weiter zum Messen', act: 'go', v: 'messen', dis: !p } };
};
/* ---------- Messen: vier geführte Maße, das Modell wächst mit ---------- */
const dimKey = (st) => (st.who === 'el' ? 'e' + st.k : st.k);
/* Das Innenfoto bleibt als weicher Hintergrund hinter dem Modell */
function photoBg() { const p = S.photos.in; return p && p.url ? p.url : null; }
function messLabels(live) {
  const w = S.win, L = {}, mo = w.mo, el = w.el;
  ['hm', 'wm', 'hl', 'hr', 'wt', 'wb'].forEach((k) => { if (num(mo[k])) L[k] = thousand(mo[k]) + ' mm'; });
  if (num(el.h)) L.eh = thousand(el.h) + ' mm'; if (num(el.w)) L.ew = thousand(el.w) + ' mm';
  if (live) Object.assign(L, live);
  return L;
}
const KEY_DEL = '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M9.5 6h11A1.5 1.5 0 0 1 22 7.5v11a1.5 1.5 0 0 1-1.5 1.5h-11L3.5 13z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M12 10.5l5 5M17 10.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>';
function keypad(okLabel) {
  return '<div class="keypad" role="group" aria-label="Zifferntasten">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => '<button type="button" data-act="key" data-v="' + d + '">' + d + '</button>').join('') +
    '<button type="button" class="fn" data-act="key" data-v="del" aria-label="Letzte Ziffer löschen">' + KEY_DEL + '</button><button type="button" data-act="key" data-v="0">0</button><button type="button" class="ok" data-act="key" data-v="ok">' + esc(okLabel || 'Weiter') + '</button></div>';
}
function numDisplay(cur, id) { return '<div class="num"><b id="' + id + '" class="' + (cur ? '' : 'empty') + '" aria-live="polite">' + (cur ? esc(thousand(cur)) : '0') + '</b><span class="cm" id="' + id + '-cm">' + cmTxt(cur) + '</span><span class="u">mm</span></div>'; }
function setNum(id, cur) { const b = document.getElementById(id), cm = document.getElementById(id + '-cm'); if (b) { b.textContent = cur ? thousand(cur) : '0'; b.classList.toggle('empty', !cur); } if (cm) cm.textContent = cmTxt(cur); }
function messOpts(step, cur) {
  const dims = MESS.slice(0, S.mess.step + 1).map(dimKey), k = dimKey(step), labels = messLabels({ [k]: num(cur) ? thousand(cur) + ' mm' : '?' });
  return { id: 'w3d', view: 'three', sway: true, showEl: S.mess.step >= 1, dims: dims, active: k, labels: labels, stageH: 'auto', bg: photoBg(), hint: step.who === 'mo' ? 'Rot: Maueröffnung' : 'Blau: Fensterelement' };
}
function liveWin(step, cur) {
  const w = JSON.parse(JSON.stringify(S.win)), v = num(cur);
  if (v >= 250 && v <= 6000) { if (step.who === 'mo') w.mo[step.k] = v; else { w.el[step.k] = v; w[step.k] = v; } }
  return w;
}
SCREENS.messen = () => {
  const m = S.mess, step = MESS[m.step];
  const msg = m.msg ? '<div class="msg ' + m.msg.cls + '">' + esc(m.msg.text) + (m.msg.cm ? '<button type="button" class="pill" data-act="mess-cm" data-v="' + m.msg.cm + '">Ja, ' + thousand(m.msg.cm) + ' mm</button>' : '') + (m.msg.cls === 'warn' ? '<button type="button" class="pill" data-act="mess-next" data-ack="1">Stimmt so, weiter</button>' : '') + '</div>' : '';
  const html = hd('Maß ' + (m.step + 1) + ' von 4 · ' + (step.who === 'mo' ? 'Maueröffnung' : 'Fensterelement'), esc(step.dir === 'v' ? 'Höhe in der Mitte.' : 'Breite in der Mitte.'), '', 'compact', step.who) +
    model(liveWin(step, m.cur), messOpts(step, m.cur)) +
    '<div class="ask ' + step.who + '"><p class="q"><span>' + esc(step.short) + '</span><button type="button" class="pill" data-act="gloss" data-k="rahmenmass">Wo genau?</button></p><p class="how">' + esc(step.text) + '</p>' + numDisplay(m.cur, 'mess-num') + msg + '</div>' +
    keypad(m.step < 3 ? 'Weiter' : 'Zu den Rändern');
  return { html: html, back: [m.step ? 'Zurück' : 'Fotos', m.step ? 'mess-prev' : 'fotos'], fit: true };
};
function messInput(v) {
  S.mess.cur = String(v).replace(/[^\d]/g, '').slice(0, 5);
  setNum('mess-num', S.mess.cur);
  const step = MESS[S.mess.step], stage = document.getElementById('w3d');
  if (stage) { const o = messOpts(step, S.mess.cur); W3DS.w3d = { w: liveWin(step, S.mess.cur), o: o }; w3dLayout(stage, W3DS.w3d.w, o); }
}
function messNext(ack) {
  const m = S.mess, step = MESS[m.step], vals = { hm: S.win.mo.hm, wm: S.win.mo.wm }, chk = checkValue(m.cur, step, vals);
  if (!chk.ok) { m.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; render(); return; }
  if (chk.warn && !ack) { m.msg = { cls: 'warn', text: chk.warn }; render(); return; }
  const v = num(m.cur);
  if (step.who === 'mo') S.win.mo[step.k] = v; else { S.win.el[step.k] = v; S.win[step.k] = v; }
  m.msg = null; m.cur = '';
  if (m.step < 3) { m.step++; render(true); }
  else go('rest');
}
function messPrev() { const m = S.mess; if (m.step > 0) { m.step--; const st = MESS[m.step]; m.cur = String(st.who === 'mo' ? S.win.mo[st.k] : S.win.el[st.k] || ''); m.msg = null; S.dir = 'back'; render(true); } else go('fotos', 'back'); }
/* ---------- Ränder: die vier übrigen Maße der Öffnung, am Modell ---------- */
SCREENS.rest = () => {
  const r = S.rest, d = derive(S.win), rest = r.i < 4 ? REST[r.i] : null;
  const labels = messLabels(rest ? { [rest.k]: num(r.cur) ? thousand(r.cur) + ' mm' : '?' } : null);
  const dims = ['hm', 'wm'].concat(REST.slice(0, Math.min(r.i + 1, 4)).map((x) => x.k));
  const stage = model(S.win, { id: 'w3d', view: 'three', sway: true, dims: dims, active: rest ? rest.k : '', labels: labels, stageH: rest ? 'auto' : 236, bg: photoBg(), cls: rest ? '' : 'dims-all', hint: rest ? 'Die leuchtende Kante messen' : 'Alle Ränder gemessen' });
  let body;
  if (rest) {
    const ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm;
    const msg = r.msg ? '<div class="msg ' + r.msg.cls + '">' + esc(r.msg.text) + (r.msg.cm ? '<button type="button" class="pill" data-act="rest-cm" data-v="' + r.msg.cm + '">Ja, ' + thousand(r.msg.cm) + ' mm</button>' : '') + (r.msg.cls === 'warn' ? '<button type="button" class="pill" data-act="rest-next" data-ack="1">Stimmt so, weiter</button>' : '') + '</div>' : '';
    body = '<div class="ask mo"><p class="q"><span>' + esc(rest.title) + '</span><button type="button" class="pill mo" data-act="rest-same" data-v="' + num(ref) + '">Wie Mitte · ' + thousand(ref) + '</button></p><p class="how">' + esc(rest.text) + '</p>' + numDisplay(r.cur, 'rest-num') + msg + '</div>' + keypad(r.i < 3 ? 'Weiter' : 'Fertig');
  } else {
    body = '<div class="mess-in"><p class="eyebrow" style="color: var(--ok)">Alle Maße da</p><div class="done-list"><div><small>Öffnung Breite</small><b>' + thousand(d.moW) + ' mm</b></div><div><small>Öffnung Höhe</small><b>' + thousand(d.moH) + ' mm</b></div><div><small>Fenster Breite</small><b>' + thousand(d.elW) + ' mm</b></div><div><small>Fenster Höhe</small><b>' + thousand(d.elH) + ' mm</b></div></div>' + (d.devW > 10 || d.devH > 10 ? '<div class="msg warn">Die Öffnung ist bis zu ' + Math.max(d.devW, d.devH) + ' mm außer Winkel. Das kleinste Maß zählt, so wie es der Fensterbauer auch macht.</div>' : '<div class="msg ok">' + CHECK + '<span>Die Öffnung ist gerade, alle Maße liegen nah beieinander.</span></div>') + '</div>';
  }
  const html = hd(rest ? 'Rand ' + (r.i + 1) + ' von 4 · Maueröffnung' : 'Ränder · Maueröffnung', rest ? esc(rest.title) + '.' : 'Passt.', rest ? '' : 'Alle sechs Maße der Öffnung und beide Maße des Fensters sind drin.', 'compact', rest ? 'mo' : '') + stage + body;
  return { html: html, back: ['Messen', 'mess-back'], fit: !!rest, bar: rest ? null : { label: 'Weiter zum Ergebnis', act: 'go', v: 'ergebnis' } };
};
function restInput(v) {
  S.rest.cur = String(v).replace(/[^\d]/g, '').slice(0, 5);
  setNum('rest-num', S.rest.cur);
  const rest = REST[S.rest.i], lab = rest ? document.querySelector('[data-r="lab-' + rest.k + '"]') : null; if (lab) lab.textContent = num(S.rest.cur) ? thousand(S.rest.cur) + ' mm' : '?';
}
function restNext(ack) {
  const r = S.rest, rest = REST[r.i], ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm, chk = checkRest(r.cur, ref);
  if (!chk.ok) { r.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; render(); return; }
  if (chk.warn && !ack) { r.msg = { cls: 'warn', text: chk.warn }; render(); return; }
  S.win.mo[rest.k] = num(r.cur); r.cur = ''; r.msg = null; r.i++;
  render();
}
/* ---------- Ergebnis ---------- */
SCREENS.ergebnis = () => {
  const w = S.win, d = derive(w), ki = S.win.ki;
  const res = '<div class="card"><p class="eyebrow">Ergebnis</p><div class="result">' +
    '<div><span class="k">Maueröffnung Breite</span><span class="v" style="color: var(--mo)">' + thousand(d.moW) + '<small> mm</small></span><span class="tag" style="background: var(--mo-soft); color: var(--mo)">kleinstes von 3</span></div>' +
    '<div><span class="k">Maueröffnung Höhe</span><span class="v" style="color: var(--mo); animation-delay: .1s">' + thousand(d.moH) + '<small> mm</small></span><span class="tag" style="background: var(--mo-soft); color: var(--mo)">kleinstes von 3</span></div>' +
    '<div><span class="k">Fenster Breite</span><span class="v" style="color: var(--el); animation-delay: .2s">' + thousand(d.elW) + '<small> mm</small></span><span class="tag" style="background: var(--el-soft); color: var(--el)">sichtbar mit Rahmen</span></div>' +
    '<div><span class="k">Fenster Höhe</span><span class="v" style="color: var(--el); animation-delay: .3s">' + thousand(d.elH) + '<small> mm</small></span><span class="tag" style="background: var(--el-soft); color: var(--el)">sichtbar mit Rahmen</span></div></div>' +
    (d.devW > 10 || d.devH > 10 ? '<p class="sub">Bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel, alle sechs Einzelmaße stehen im Aufmaßblatt.</p>' : '') + '</div>';
  const teaser = ki && (ki.chips || []).length ? '<div class="teaser"><p class="eyebrow">Aus deinen Fotos gelesen · ' + (ki.rows || []).length + ' Angaben fürs Aufmaßblatt</p><div class="chips">' + ki.chips.map((c) => '<span class="chip">' + esc(c) + '</span>').join('') + '</div></div>'
    : (S.ai.in && S.ai.in.status === 'running' ? '<div class="teaser"><p class="eyebrow">Aus deinen Fotos</p><p class="sub" style="display: flex; align-items: center; gap: 10px"><span class="spin dark"></span>Die KI liest noch Material, Zustand und Umgebung aus den Fotos.</p></div>' : '');
  const html = hd('Schritt 4 von 5 · Ergebnis', 'Dein Aufmaß steht.', 'Maueröffnung und Fensterelement, so wie der Fensterbauer sie fürs Angebot braucht.') + model(w, { id: 'w3d', view: 'result', sway: true, dims: ['hl', 'hm', 'hr', 'wt', 'wm', 'wb', 'eh', 'ew'], labels: messLabels(), stageH: 260, fitW: 0.6, fitH: 0.64, cls: 'dims-all', bg: photoBg(), hint: 'Zum Drehen ziehen' }) + res + teaser +
    '<details class="card fold"><summary><span>Falls zur Hand<small>Brüstungshöhe und Laibungstiefe, sonst beim Feinaufmaß</small></span></summary><div class="fold-body"><div class="rows">' + fieldRow('Brüstungshöhe', 'bru', 'mm', 10, 'bruestung') + fieldRow('Laibungstiefe innen', 'laib', 'mm', 5, 'laibung', ki && ki.laib && !w.e_laib ? 'KI-Schätzung' : '') + '</div></div></details>';
  return { html: html, back: ['Ränder', 'rest'], cls: 'tight', bar: { label: 'Weiter: Wunschfenster', act: 'wuensche' } };
};

/* ---------- Wunschfenster: das Modell wird konfiguriert ---------- */
/* ---------- Zusammenfassung, Anfrage, Aufmaßblatt ---------- */
SCREENS.fertig = () => {
  const w = S.win, d = derive(w), lk = !!S.betrieb;
  const facts = [thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm', w.sashes.map((z) => TYPNAME[z.t]).filter((t, i, a) => a.indexOf(t) === i).join(' · '), lab('material', w.material), colorOf(w.fa).name, (num(w.anzahl) || 1) > 1 ? w.anzahl + ' Stück' : ''].filter(Boolean);
  const html = model(w, { id: 'w3d', view: 'three', sway: true, stageH: 210, hint: 'Pos. ' + (S.editIdx + 1) }) + '<div class="center"><p class="eyebrow" style="color: var(--ok)">' + CHECK + ' Gespeichert · Position ' + (S.editIdx + 1) + '</p><h1 style="margin: 10px 0 0; font-family: var(--display); font-size: 38px; line-height: 1.04; font-weight: 900; letter-spacing: -.03em">' + esc(w.name || 'Fenster') + '</h1><p style="margin: 8px 0 0; font-size: 17px; line-height: 1.5; color: var(--fg2)">' + esc(facts.join(' · ')) + '</p></div>' +
    '<details class="card fold"><summary><span>Alle Angaben<small>' + specRows(w).length + ' Zeilen' + (w.ki && w.ki.rows && w.ki.rows.length ? ', dazu ' + w.ki.rows.length + ' aus den Fotos' : '') + '</small></span></summary><div class="fold-body"><div class="kv">' + specRows(w).map((r) => '<div><span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span></div>').join('') + '</div>' +
    (w.ki && w.ki.rows && w.ki.rows.length ? '<p class="eyebrow">Aus den Fotos gelesen</p><dl class="facts">' + w.ki.rows.map((r) => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl>' : '') + '</div></details>' +
    '<div class="pill-row" style="justify-content: center"><button type="button" class="pill" data-act="go" data-v="ergebnis">Maße ändern</button><button type="button" class="pill" data-act="wuensche">Wünsche ändern</button><button type="button" class="pill" data-act="copywin">Kopieren</button><button type="button" class="pill" style="background: var(--bad-soft); color: var(--bad)" data-act="delwin">Löschen</button></div>' +
    '<p class="sub center" style="padding: 0 10px">' + (lk ? 'Noch ein Fenster? Oder weiter zum Absenden an ' + esc(S.betrieb.name || 'deinen Fensterbauer') + '.' : 'Noch ein Fenster? Oder weiter zur Anfrage.') + '</p>';
  return { html: html, back: ['Projekt', 'home'], bar: { label: lk ? 'Zum Absenden' : 'Zur Anfrage', act: 'go', v: 'anfrage', sec: 'Weiteres Fenster', secAct: 'new' } };
};
/* Anfrage: zwei kurze Seiten im Link, drei ohne Link (dann mit Kontakt) */
const anfrageHead = (step, lk) => lk ? 'Fast fertig · ' + step + ' von 2' : 'Anfrage · ' + step + ' von 3';
SCREENS.anfrage = () => {
  const pr = S.proj, replaced = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0), lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'dein Fensterbauer') : 'der Fensterbauer';
  let html = hd(anfrageHead(1, lk), 'Noch kurz zum Haus.', 'Damit ' + esc(bn) + ' gut planen kann. Alles freiwillig.');
  html += '<div class="sec">' + secHead('Gebäude') + chips('gebaeude', pr.gebaeude, 'gebaeude', 'setp') + '</div>';
  if (pr.gebaeude === 'denkmal') html += noteBox('Bei Denkmalschutz brauchst du meist eine Genehmigung. Material und Sprossen können vorgeschrieben sein.', 'echt', 'warn');
  html += '<div class="sec">' + secHead('Baujahr des Hauses') + chips('baujahr', pr.baujahr, 'baujahr', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Fenster im ganzen Haus', null, 'Du tauschst ' + replaced + ' davon.') + '<div class="rows"><div class="row"><label><span class="lbl">Insgesamt</span><span class="val"><input type="text" inputmode="numeric" id="p-total" data-in="p" data-f="total" value="' + esc(pr.total) + '"><span class="unit">Stück</span></span></label><button type="button" class="rnd" aria-label="Weniger" data-act="bumpp" data-v="-1">−</button><button type="button" class="rnd" aria-label="Mehr" data-act="bumpp" data-v="1">+</button></div></div></div>';
  if (replaced > (num(pr.total) || 0) / 3) html += noteBox('Du tauschst mehr als ein Drittel der Fenster. Dann verlangt die DIN 1946-6 ein Lüftungskonzept.', 'lueftung', 'warn');
  return { html: html, back: ['Projekt', 'home'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage2' } };
};
SCREENS.anfrage2 = () => {
  const pr = S.proj, lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'dein Fensterbauer') : '';
  let html = hd(anfrageHead(2, lk), 'Zeit und Budget.', lk ? 'Freiwillig. Deine Kontaktdaten hat ' + esc(bn) + ' schon.' : 'Freiwillig, hilft beim Angebot.');
  html += '<div class="sec">' + secHead('Wann soll es losgehen?') + chips('zeit', pr.zeit, 'zeit', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Budget') + chips('budget', pr.budget, 'budget', 'setp') + '</div>';
  html += '<div class="rows">' + switchRow('Förderung nutzen', 'Dein Fensterbauer klärt die Voraussetzungen.', pr.foerd, 'foerd', null, 'togglep') + '</div>';
  if (lk) { html += '<div class="sec">' + secHead('Nachricht an ' + bn, null, 'Freiwillig, zum Beispiel wann du erreichbar bist.') + '<div class="rows">' + textRow('Nachricht', 'notiz', 'z. B. Rollladen im Bad klemmt', 'text', 'p') + '</div></div>'; return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: { label: 'Prüfen und senden', act: 'go', v: 'blatt' } }; }
  return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage3' } };
};
SCREENS.anfrage3 = () => {
  const pr = S.proj;
  let html = hd(anfrageHead(3, false), 'Wie erreichen wir dich?', 'Im Portal bleibst du anonym, bis du einen Betrieb freigibst. Schickst du das Aufmaß direkt, bekommt es nur dieser Betrieb.');
  html += '<div class="sec"><div class="rows">' + textRow('Name', 'name', 'Vor- und Nachname', 'text', 'p') + textRow('PLZ und Ort', 'ort', 'z. B. 50667 Köln', 'text', 'p') + textRow('Telefon', 'tel', 'Für Rückfragen', 'tel', 'p') + textRow('E-Mail', 'mail', 'name@beispiel.de', 'email', 'p') + '</div></div>';
  html += '<div class="sec">' + secHead('Am besten erreichbar') + chips('erreich', pr.erreich, 'erreich', 'setp') + '</div>';
  return { html: html, back: ['Zurück', 'anfrage2'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'teilen' } };
};
function blattHTML(windows, pr, opts) {
  opts = opts || {};
  let today = ''; try { today = new Date(opts.date || Date.now()).toLocaleDateString('de-DE'); } catch (e) { today = ''; }
  const replaced = windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
  const proj = [['Gebäude', lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')], ['Zeitraum', lab('zeit', pr.zeit)], ['Budget', lab('budget', pr.budget)], ['Förderung', pr.foerd ? 'gewünscht' : 'nein'], ['Lüftung', replaced > (num(pr.total) || 0) / 3 ? 'Lüftungskonzept prüfen (' + replaced + ' von ' + pr.total + ' Fenstern)' : replaced + ' von ' + pr.total + ' Fenstern']];
  let h = '<div class="sheet-paper"><div class="paper-head"><div style="min-width: 0"><p class="eyebrow" style="font-size: 11px">Aufmaßblatt</p><p style="margin: 4px 0 0; font-size: 20px; font-weight: 900; letter-spacing: -.02em">' + esc(pr.name || 'Ohne Namen') + '</p>' + ([pr.ort, pr.tel].filter(Boolean).length ? '<p style="margin: 2px 0 0; font-size: 13px; color: var(--muted)">' + esc([pr.ort, pr.tel].filter(Boolean).join(' · ')) + '</p>' : '') + '</div><div style="text-align: right; flex: 0 0 auto"><p style="margin: 0; font-size: 12px; color: var(--muted)">' + (opts.betrieb ? 'An ' + esc(opts.betrieb) : 'Erfasst mit Klopfan') + '</p><p style="margin: 2px 0 0; font-size: 13px; font-weight: 700">' + esc(today) + '</p></div></div>';
  h += '<div class="paper-grid">' + proj.map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>';
  windows.forEach((x, i) => {
    const d = derive(x), rows = specRows(x), ki = x.ki;
    h += '<div class="paper-pos"><div class="ph">' + svgIcon(miniWin(x), 54) + '<div class="t"><p class="eyebrow" style="font-size: 12px; letter-spacing: .12em; color: var(--muted)">Pos. ' + (i + 1) + ' · ' + (num(x.anzahl) || 1) + ' Stk.</p><p style="margin: 2px 0 0; font-size: 17px; font-weight: 800">' + esc(x.name || 'Fenster ' + (i + 1)) + '</p><p style="margin: 2px 0 0; font-size: 14px; font-weight: 700">Öffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' · Element ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm</p></div><span class="badge ' + (d.complete ? 'ok' : 'warn') + '" style="flex: 0 0 auto">' + (d.complete ? 'Handmaß, 8 Werte' : 'Maße offen') + '</span></div>';
    h += '<div class="paper-grid" style="grid-template-columns: 84px minmax(0, 1fr); font-size: 12px">' + rows.map((r) => '<span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span>').join('') + '</div>';
    if (ki && ki.rows && ki.rows.length) h += '<p class="eyebrow" style="font-size: 11px; margin-top: 4px">Aus den Fotos (KI, ' + (x.fotos || 0) + (x.fotos === 1 ? ' Foto' : ' Fotos') + ')</p><div class="paper-grid" style="grid-template-columns: 84px minmax(0, 1fr); font-size: 12px">' + ki.rows.map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + (ki.hints && ki.hints.length ? '<span>Hinweise</span><span>' + ki.hints.map(esc).join(' ') + '</span>' : '') + '</div>';
    h += '</div>';
  });
  h += '<div style="display: flex; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 2px solid var(--fg); font-size: 13px"><span style="font-weight: 800">' + windows.length + ' Positionen · ' + replaced + ' Elemente</span><span style="color: var(--muted)">Vor Fertigung: Feinaufmaß</span></div></div>';
  return h;
}
function blattMarkdown(windows, pr) {
  const lines = ['# Aufmaßblatt · ' + (pr.name || '[Name]'), (pr.ort || '') + (pr.tel ? ' · ' + pr.tel : '') + (pr.mail ? ' · ' + pr.mail : ''), '', 'Gebäude: ' + lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '') + ' · Zeitraum: ' + lab('zeit', pr.zeit) + ' · Budget: ' + lab('budget', pr.budget), ''];
  windows.forEach((x, i) => {
    const d = derive(x);
    lines.push('## Pos. ' + (i + 1) + ' · ' + (x.name || 'Fenster') + ' · ' + (num(x.anzahl) || 1) + ' Stk.');
    lines.push('Maueröffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm · Fensterelement ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm', '');
    specRows(x).forEach((r) => lines.push('- **' + r.k + ':** ' + r.v));
    if (x.ki && x.ki.rows && x.ki.rows.length) { lines.push('', '### Aus den Fotos (KI)'); x.ki.rows.forEach((r) => lines.push('- **' + r[0] + ':** ' + r[1])); (x.ki.hints || []).forEach((t) => lines.push('- Hinweis: ' + t)); }
    lines.push('');
  });
  lines.push('Erfasst mit Klopfan. Vor der Fertigung Feinaufmaß vor Ort.');
  return lines.join('\n');
}
SCREENS.blatt = () => {
  const lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'deinen Fensterbauer') : '', paid = S.kauf && S.kauf.paid;
  if (!lk && !paid) return SCREENS.teilen();
  if (paid) {
    const html = hd(paid ? 'Gekauft' : 'Vorschau', 'Dein Aufmaßblatt.', paid ? 'Dein Aufmaß, sortiert wie beim Fensterbauer. Als Datei bekommst du es über „Herunterladen“.' : 'So bekommt es ein Fensterbauer: sortiert, mit allen Maßen und dem, was die KI aus den Fotos gelesen hat.') + blattHTML(S.windows, S.proj, { betrieb: lk ? bn : '' });
    return { html: html, back: [lk ? 'Start' : 'Zurück', lk ? 'home' : 'teilen'], bar: { label: 'Herunterladen', act: 'k-dl' } };
  }
  if (S.sent && PILOT) return SCREENS.gesendet();
  if (S.sent) return { html: hd('Gesendet', 'Schon unterwegs.', esc(bn) + ' hat dein Aufmaß seit ' + esc(sentWhen()) + '.') + dateiCard(), back: ['Start', 'home'], bar: null };
  const pr = S.proj, items = [['Gebäude', lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')], ['Zeitraum', lab('zeit', pr.zeit)], ['Budget', lab('budget', pr.budget)]].concat(pr.notiz ? [['Nachricht', pr.notiz]] : []);
  const html = hd('Prüfen', 'Alles vollständig?', esc(bn) + (PILOT ? ' bekommt deine Fenster mit allen Maßen und Wünschen.' : ' bekommt deine Fenster mit allen Maßen, Fotos und Wünschen.') + ' Tipp ein Fenster an, um es zu prüfen oder zu ändern.') +
    '<div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => checkCard(x, i)).join('') + '</div>' +
    '<div class="kv">' + items.map((r) => '<div><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') + '</div>' +
    '<p class="sub" style="padding: 0 6px">Nach dem Absenden ist der Link erledigt. Ändern kannst du danach nur noch über ' + esc(bn) + '.</p>';
  return { html: html, back: ['Zurück', 'anfrage2'], bar: { label: 'An ' + bn + ' senden', act: 'send' } };
};
/* Übersicht vor dem Senden: vollständig oder nicht, aber keine Maßliste zum Abfotografieren */
function checkCard(x, i) {
  const d = derive(x), n = num(x.anzahl) || 1, typ = x.sashes.map((z) => TYPNAME[z.t]).filter((t, k, a) => a.indexOf(t) === k).join(' · ');
  return '<button type="button" class="wincard" data-act="open" data-i="' + i + '"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di"' + (d.complete ? '' : ' style="color: var(--bad)"') + '>' + (d.complete ? 'Vollständig: 8 Maße' : 'Maße fehlen noch') + (x.fotos ? ', ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : ', ohne Fotos') + '</span><span class="me">' + esc([typ, lab('material', x.material), n > 1 ? n + ' Stück' : ''].filter(Boolean).join(' · ')) + '</span></span>' + CHEV + '</button>';
}
SCREENS.gesendet = () => {
  const name = S.betrieb ? (S.betrieb.name || 'Dein Fensterbauer') : 'Dein Fensterbauer', code = packProject(S.windows, S.proj, S.betrieb);
  const wa = 'https://wa.me/?text=' + encodeURIComponent('Hallo ' + name + ', hier ist mein Übermittlungscode aus Klopfan:\n' + code);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px"><svg class="okmark" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><h1 style="margin: 4px 0 0; font-family: var(--display); font-size: 42px; line-height: 1; font-weight: 900; letter-spacing: -.035em">Gesendet.</h1><p style="margin: 0; font-size: 17px; line-height: 1.5; color: var(--fg2)">' + esc(name) + ' hat jetzt Maße, Fotos und Wünsche und meldet sich mit einem Angebot.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(name) + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard() +
    '<details class="card proto"><summary><span><b>Nur im Prototyp: Übermittlung</b><small>Ohne Server kommt dein Aufmaß hier noch nicht von selbst an.</small></span></summary><p class="sub" style="color: var(--fg2)">Bitte schick ' + esc(name) + ' diesen Übermittlungscode, am einfachsten als Antwort in WhatsApp. Er funktioniert nur in diesem Projekt bei ' + esc(name) + '. Im fertigen Klopfan entfällt dieser Schritt.</p><textarea class="copybox" id="code-box" readonly rows="3" aria-label="Übermittlungscode">' + esc(code) + '</textarea><div class="pill-row"><button type="button" class="pill" data-act="copyblatt">Code kopieren</button><a class="pill" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp antworten ›</a></div></details>';
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home' } };
};
/* Ohne Kundenlink: ins Portal stellen oder direkt an einen Betrieb schicken */
SCREENS.teilen = () => {
  const code = packProject(S.windows, S.proj, null), n = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
  const msg = 'Hallo, hier ist mein Fenster-Aufmaß aus Klopfan (' + n + ' Fenster). Den Code bitte im Klopfan-Portal unter „Aufmaß-Code einfügen“ einsetzen:\n' + code;
  const html = hd('Fertig gemessen', 'Wohin damit?', 'Dein Aufmaß ist komplett. Zwei Wege, du kannst auch beide gehen.') +
    (PILOT ? '<div class="card share-way soon"><p class="eyebrow">Bald · nach der Pilotphase</p><h2>Im Fensterportal anbieten</h2><p class="sub" style="color: var(--fg2)">Anonym: Fensterbauer aus deiner Nähe sehen Maße und Fotos, aber nicht dich. Wer Interesse hat, klopft an. Das startet nach der Pilotphase. Bis dahin schickst du dein Aufmaß direkt an einen Fensterbauer.</p></div>' : '<div class="card share-way"><p class="eyebrow">Empfohlen · kostenlos</p><h2>Im Fensterportal anbieten</h2><p class="sub" style="color: var(--fg2)">Anonym: Fensterbauer aus deiner Nähe sehen Maße und Fotos, aber nicht dich. Wer Interesse hat, klopft an. Du entscheidest, wer deine Kontaktdaten bekommt.</p>' +
    '<ol class="way-steps"><li><span class="n">1</span><span><b>Code kopieren</b></span><button type="button" class="pill" data-act="copyblatt">Kopieren</button></li><li><span class="n">2</span><span><b>Portal öffnen</b><small>Konto anlegen oder anmelden</small></span><a class="pill" href="' + PORTAL_OPEN + '" target="_blank" rel="noopener">Öffnen ›</a></li><li><span class="n">3</span><span><b>„Aufmaß-Code einfügen“</b><small>Dann ist es online, ohne deinen Namen.</small></span></li></ol></div>') +
    '<div class="card share-way"><p class="eyebrow">Du hast schon einen Betrieb?</p><h2>Direkt an deinen Fensterbauer</h2><p class="sub" style="color: var(--fg2)">Schick ihm den Code. Er setzt ihn in seinem Klopfan-Bereich ein und hat das komplette Aufmaßblatt.</p><div class="pill-row"><a class="pill" href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">WhatsApp ›</a><a class="pill" href="mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(msg) + '">E-Mail</a><button type="button" class="pill" data-act="copyblatt">Code kopieren</button></div></div>' +
    (PILOT ? '<div class="card share-way"><p class="eyebrow">Für dich · in der Pilotphase kostenlos</p><h2>Als Datei behalten</h2><p class="sub" style="color: var(--fg2)">Dein komplettes Aufmaßblatt als PDF, für deine Unterlagen.</p><div class="pill-row"><button type="button" class="pill" data-act="k-dl">Herunterladen</button></div></div>' : '<div class="card share-way"><p class="eyebrow">Für dich · ' + euro(DATEI_PREIS) + '</p><h2>Als Datei behalten</h2><p class="sub" style="color: var(--fg2)">Dein komplettes Aufmaßblatt als PDF, für deine Unterlagen. Mit Klopfan-Konto, einmalig.</p><div class="pill-row"><button type="button" class="pill" data-act="go" data-v="datei">' + (S.kauf && S.kauf.paid ? 'Herunterladen' : 'Ansehen') + '</button></div></div>') +
    '<div class="sec">' + secHead('Dein Aufmaß-Code', null, 'Für Portal und Fensterbauer. Falls Kopieren nicht klappt: Text markieren und kopieren.') + '<textarea class="copybox" id="code-box" readonly rows="3" aria-label="Aufmaß-Code">' + esc(code) + '</textarea></div>';
  return { html: html, back: ['Zurück', 'anfrage3'], bar: { label: 'Zurück zum Projekt', act: 'go', v: 'home' } };
};


/* ---------- Aufmaß als Datei: nur mit Konto und gegen Gebühr ---------- */
const DATEI_PREIS = 19.9;
const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
const kauf = () => S.kauf || (S.kauf = { mail: '', pw: '', agb: false, pay: '', widerruf: false, paid: false, err: {} });
const LOCK = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"></path></svg>';
const FILE_IC = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M14 3v4h4M9 12h6M9 15.5h6M9 9h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>';
/* Karte für Startseite und Gesendet-Seite: Angebot oder, nach dem Kauf, der Download */
function dateiCard() {
  const k = kauf(), n = S.windows.length;
  if (k.paid) return '<div class="card datei-card bought"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Gekauft</p><b>Dein Aufmaßblatt als PDF</b><small>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ' · im Konto ' + esc(k.mail) + '</small></div></div><button type="button" class="btn primary" style="flex: 0 0 auto" data-act="k-dl">Herunterladen</button></div>';
  return '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Für dich</p><b>Dein Aufmaß als Datei</b><small>Alle Maße, die Auswertung der Fotos und deine Wünsche als PDF, für deine Unterlagen oder weitere Angebote. Mit Klopfan-Konto, einmalig ' + euro(DATEI_PREIS) + '.</small></div></div><button type="button" class="btn ghost" style="flex: 0 0 auto" data-act="go" data-v="datei">Ansehen</button></div>';
}
SCREENS.datei = () => {
  const k = kauf(), n = S.windows.length;
  const preview = '<div class="dv"><div class="dv-paper" aria-hidden="true"><p class="dv-h">Aufmaßblatt</p><p class="dv-s">' + n + (n === 1 ? ' Position' : ' Positionen') + ' · ' + esc(lab('gebaeude', S.proj.gebaeude)) + '</p>' + S.windows.slice(0, 3).map((x, i) => '<div class="dv-pos">' + svgIcon(miniWin(x), 30) + '<span><b>Pos. ' + (i + 1) + ' · ' + esc(x.name || 'Fenster') + '</b><i></i><i class="s"></i></span></div>').join('') + '<div class="dv-lines"><i></i><i></i><i class="s"></i><i></i></div></div><span class="dv-lock">' + LOCK + 'Vorschau</span></div>';
  const html = hd('Für dich', 'Dein Aufmaß als Datei.', 'Das komplette Aufmaßblatt als PDF, für deine Unterlagen oder weitere Angebote.') + preview +
    '<div class="card"><div class="incl">' + [(n === 1 ? 'Dein Fenster mit allen acht Handmaßen' : 'Alle ' + n + ' Positionen mit acht Handmaßen je Fenster'), 'Auswertung der Fotos und deine Wünsche', 'Dauerhaft in deinem Klopfan-Konto'].map((t) => '<p>' + CHECK + '<span>' + esc(t) + '</span></p>').join('') + '</div>' +
    '<div class="price-row"><span><b>' + euro(DATEI_PREIS) + '</b><small>einmalig, inkl. MwSt.</small></span>' + '<small class="sub">' + n + ' Fenster, alle Maße und Angaben</small>' + '</div></div>' +
    '<p class="sub" style="padding: 0 6px">' + (S.betrieb ? 'Dein Aufmaß an ' + esc(S.betrieb.name || 'deinen Fensterbauer') + ' bleibt davon unberührt und kostenlos.' : 'Ins Portal stellen und an einen Fensterbauer schicken bleibt kostenlos.') + '</p>';
  return { html: html, back: ['Zurück', S.betrieb ? 'home' : 'teilen'], cls: 'tight', bar: k.paid ? { label: 'Herunterladen', act: 'k-dl' } : { label: k.mail && k.agb ? 'Weiter zur Zahlung' : 'Weiter: Konto anlegen', act: 'go', v: k.mail && k.agb ? 'kasse' : 'konto' } };
};
SCREENS.konto = () => {
  const k = kauf(), e = k.err || {};
  const field = (label, f, type, ph, auto) => '<label class="kf' + (e[f] ? ' bad' : '') + '"><span>' + label + '</span><input type="' + type + '" id="k-' + f + '" data-in="k" data-f="' + f + '" value="' + esc(f === 'pw' ? '' : k[f] || '') + '" placeholder="' + ph + '" autocomplete="' + auto + '">' + (e[f] ? '<small>' + esc(e[f]) + '</small>' : '') + '</label>';
  const html = hd('Schritt 1 von 2', 'Dein Klopfan-Konto.', 'Damit dein Aufmaß bei dir bleibt und du es jederzeit wieder herunterladen kannst.') +
    '<div class="card kform">' + field('E-Mail', 'mail', 'email', 'name@beispiel.de', 'email') + field('Passwort', 'pw', 'password', 'mindestens 8 Zeichen', 'new-password') +
    '<label class="kcheck' + (e.agb ? ' bad' : '') + '"><input type="checkbox" data-in="kc" data-f="agb"' + (k.agb ? ' checked' : '') + '><span>Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung von Klopfan.</span></label>' + (e.agb ? '<small class="kerr">' + esc(e.agb) + '</small>' : '') + '</div>' +
    '<p class="sub" style="padding: 0 6px">Kein Newsletter, keine Weitergabe. ' + (S.betrieb ? esc(S.betrieb.name || 'Dein Fensterbauer') + ' sieht dein Konto nicht.' : '') + '</p>';
  return { html: html, back: ['Zurück', 'datei'], bar: { label: 'Weiter zur Zahlung', act: 'k-next' } };
};
SCREENS.kasse = () => {
  const k = kauf(), e = k.err || {}, n = S.windows.length, mwst = DATEI_PREIS - DATEI_PREIS / 1.19;
  if (!k.mail || !k.agb) return SCREENS.konto();
  const html = hd('Schritt 2 von 2', 'Bezahlen.', 'Konto: ' + esc(k.mail)) +
    '<div class="card"><div class="order"><span><b>Aufmaßblatt als PDF</b><small>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ', einmalig</small></span><b>' + euro(DATEI_PREIS) + '</b></div><div class="order sum"><span>darin 19 % MwSt.</span><span>' + euro(mwst) + '</span></div></div>' +
    '<div class="sec">' + secHead('Zahlungsart') + '<div class="pay' + (e.pay ? ' bad' : '') + '">' + ['PayPal', 'Kreditkarte', 'Apple Pay', 'Sofortüberweisung'].map((p) => '<button type="button" class="chip" data-act="k-pay" data-v="' + p + '" aria-pressed="' + (k.pay === p) + '">' + p + '</button>').join('') + '</div>' + (e.pay ? '<small class="kerr">' + esc(e.pay) + '</small>' : '') + '</div>' +
    '<label class="kcheck' + (e.widerruf ? ' bad' : '') + '"><input type="checkbox" data-in="kc" data-f="widerruf"' + (k.widerruf ? ' checked' : '') + '><span>Ich möchte die Datei sofort erhalten und weiß, dass mein Widerrufsrecht damit erlischt.</span></label>' + (e.widerruf ? '<small class="kerr">' + esc(e.widerruf) + '</small>' : '') +
    '<p class="sub" style="padding: 0 6px">Prototyp: Es wird nichts berechnet.</p>';
  return { html: html, back: ['Zurück', 'konto'], bar: { label: 'Zahlungspflichtig bestellen', act: 'k-buy' } };
};
SCREENS.gekauft = () => {
  const k = kauf();
  const html = '<div class="center" style="padding-top: 48px; display: flex; flex-direction: column; align-items: center; gap: 14px"><svg class="okmark" viewBox="0 0 64 64" width="96" height="96" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><h1 style="margin: 8px 0 0; font-family: var(--display); font-size: 44px; line-height: 1; font-weight: 900; letter-spacing: -.035em">Gekauft.</h1><p style="margin: 0; font-size: 18px; line-height: 1.55; color: var(--fg2)">Dein Aufmaßblatt gehört dir. Die Rechnung kommt an ' + esc(k.mail) + '.</p></div>' + dateiCard();
  return { html: html, bar: { label: 'Fertig', act: 'go', v: 'home' } };
};
/* ---------- Die Datei: PDF mit jsPDF, sonst eine HTML-Datei ---------- */
const fileBase = () => 'Aufmass-' + (slug(S.proj.name || (S.betrieb && S.betrieb.kunde) || '') || 'Klopfan');
function blattPDF() {
  const J = window.jspdf && window.jspdf.jsPDF; if (!J) return null;
  const doc = new J({ unit: 'mm', format: 'a4' }), W = 210, M = 16, pr = S.proj;
  let y = 18, page = 1;
  const t = (s) => String(s == null ? '' : s).replace(/ /g, ' ');
  const foot = () => { doc.setFontSize(8); doc.setTextColor(120); doc.text('Erfasst mit Klopfan. Vor der Fertigung Feinaufmaß vor Ort.', M, 289); doc.text('Seite ' + page, W - M, 289, { align: 'right' }); doc.setTextColor(20); };
  const need = (h) => { if (y + h > 280) { foot(); doc.addPage(); page++; y = 18; } };
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('Aufmaßblatt', M, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(110); doc.text(t(new Date().toLocaleDateString('de-DE')), W - M, y - 5, { align: 'right' }); doc.text(t(S.betrieb ? 'Für ' + (S.betrieb.name || 'Fensterbauer') : 'Klopfan'), W - M, y, { align: 'right' }); doc.setTextColor(20);
  y += 8; doc.setFontSize(10.5);
  const nP = S.windows.length, nE = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
  const head = [['Gebäude', lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')], ['Zeitraum', lab('zeit', pr.zeit)], ['Budget', lab('budget', pr.budget)], ['Fenster', nP + (nP === 1 ? ' Position, ' : ' Positionen, ') + nE + (nE === 1 ? ' Element' : ' Elemente')]];
  head.forEach((r) => { doc.setTextColor(110); doc.text(t(r[0]), M, y); doc.setTextColor(20); doc.text(t(r[1]), M + 30, y); y += 5.5; });
  y += 3; doc.setDrawColor(30); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 8;
  S.windows.forEach((x, i) => {
    const d = derive(x), rows = specRows(x), bestand = x.ki && x.ki.rows ? x.ki.rows.map((r) => ({ k: r[0], v: r[1] })) : [];
    need(30);
    /* kleine Zeichnung: Rahmen und Flügel */
    const bw = 18, bh = Math.max(10, Math.min(26, bw * (d.elH || 1200) / (d.elW || 1000))), bx = W - M - bw, by = y - 4;
    doc.setLineWidth(0.4); doc.setFillColor(214, 230, 244); doc.rect(bx, by, bw, bh); const ns = x.sashes.length; for (let s = 0; s < ns; s++) doc.rect(bx + 1.2 + s * (bw - 2.4) / ns, by + 1.2, (bw - 2.4) / ns - 0.6, bh - 2.4, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.text(t('Pos. ' + (i + 1) + ' · ' + (x.name || 'Fenster') + ((num(x.anzahl) || 1) > 1 ? ' · ' + x.anzahl + ' Stück' : '')), M, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); y += 5.5; doc.text(t('Öffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm · Element ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm'), M, y); y += Math.max(6, bh - 5);
    doc.setFontSize(9.5);
    const put = (r) => { const lines = doc.splitTextToSize(t(r.v), W - 2 * M - 40), kl = doc.splitTextToSize(t(r.k), 37), h = Math.max(lines.length, kl.length) * 4.4; need(h + 1.5); doc.setTextColor(110); doc.text(kl, M, y); doc.setTextColor(20); doc.text(lines, M + 40, y); y += h + 1.2; };
    rows.forEach(put);
    if (bestand.length) { need(12); y += 2; doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.text('Bestand laut Fotos', M, y); doc.setFont('helvetica', 'normal'); y += 5; bestand.forEach(put); }
    y += 4; doc.setDrawColor(210); doc.setLineWidth(0.2); doc.line(M, y - 2, W - M, y - 2); y += 4;
  });
  foot();
  return doc.output('blob');
}
function blattFile() {
  const css = 'body{font:14px/1.45 -apple-system,system-ui,sans-serif;color:#1d1d1f;margin:32px auto;max-width:760px;padding:0 20px}h1{font-size:28px;margin:0 0 4px}.m{color:#6e6e73}.p{border-top:2px solid #1d1d1f;margin-top:20px;padding-top:12px}.p h2{font-size:17px;margin:0 0 6px}.g{display:grid;grid-template-columns:150px 1fr;gap:4px 12px}.g span:nth-child(odd){color:#6e6e73}h3{font-size:14px;margin:14px 0 6px}@media print{body{margin:0}}';
  const pr = S.proj, g = (rs) => '<div class="g">' + rs.map((r) => '<span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span>').join('') + '</div>', rowsH = (x) => g(specRows(x)) + (x.ki && x.ki.rows && x.ki.rows.length ? '<h3>Bestand laut Fotos</h3>' + g(x.ki.rows.map((r) => ({ k: r[0], v: r[1] }))) : '');
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Aufmaßblatt</title><style>' + css + '</style></head><body><h1>Aufmaßblatt</h1><p class="m">' + esc([lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : ''), lab('zeit', pr.zeit), new Date().toLocaleDateString('de-DE')].join(' · ')) + '</p>' +
    S.windows.map((x, i) => { const d = derive(x); return '<div class="p"><h2>Pos. ' + (i + 1) + ' · ' + esc(x.name || 'Fenster') + '</h2><p class="m">Öffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm · Element ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm</p>' + rowsH(x) + '</div>'; }).join('') + '<p class="m" style="margin-top:24px">Erfasst mit Klopfan. Vor der Fertigung Feinaufmaß vor Ort.</p></body></html>';
}
async function saveDatei() {
  if (!kauf().paid && !PILOT) return go('datei');
  const pdf = blattPDF(), name = fileBase() + (pdf ? '.pdf' : '.html'), data = pdf || blattFile();
  if (!DL && DLP) await DLP;
  if (DL) {
    try { await DL.save({ filename: name, data: data }); toast('Gespeichert'); }
    catch (e) { if (e && e.code === 'declined') return; if (e && (e.code === 'rejected_extension' || e.code === 'extension_not_enabled') && pdf) { try { await DL.save({ filename: fileBase() + '.txt', data: blattMarkdown(S.windows, S.proj) }); toast('Als Text gespeichert'); } catch (e2) { toast('Speichern hat nicht geklappt'); } return; } toast('Speichern hat nicht geklappt'); }
    return;
  }
  if (window.claude) return toast('Speichern ist in dieser Ansicht nicht möglich');
  try { const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/html' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Download gestartet'); }
  catch (e) { toast('Speichern geht hier nicht'); }
}

/* ---------- Wunschfenster als Fragen: eine Frage, das Modell darüber, die Antwort sofort sichtbar ---------- */
const QSEC = { lage: 'Lage', teilung: 'Fenster', typ: 'Fenster', din: 'Fenster', material: 'Fenster', ol: 'Fenster', form: 'Fenster', richtung: 'Fenster', sprossen: 'Sprossen', spross: 'Sprossen', aufseite: 'Sprossen', breite: 'Sprossen', fa: 'Farbe & Glas', fi: 'Farbe & Glas', glas: 'Farbe & Glas', glasfn: 'Farbe & Glas', orn: 'Farbe & Glas', griff: 'Farbe & Glas', gf: 'Farbe & Glas', rc: 'Farbe & Glas', roll: 'Extras', antrieb: 'Extras', insekt: 'Extras', fbi: 'Extras', fba: 'Extras', montage: 'Extras', notiz: 'Extras' };
function qList(w) {
  const L = [], d = derive(w), n = w.sashes.length;
  L.push({ id: 'lage', title: 'Wo ist das Fenster?', sub: 'Damit der Fensterbauer die Position zuordnen kann.', kind: 'lage', view: 'three' });
  L.push({ id: 'teilung', title: 'Wie viele Flügel?', sub: w.e_teilung ? '' : 'Vorschlag nach deiner Breite von ' + thousand(d.elW) + ' mm.', kind: 'cards', group: 'teilung', val: w.teilung, act: 'teilung', ico: ICO.layout, view: 'inside', g: 'pfosten', hint: 'Zum Drehen ziehen' });
  w.sashes.forEach((x, i) => {
    L.push({ id: 'typ-' + i, title: n > 1 ? 'Wie öffnet Flügel ' + (i + 1) + '?' : 'Wie soll es aufgehen?', sub: n > 1 ? 'Der markierte Flügel. Antippen wechselt.' : '', kind: 'cards', group: 'typ', val: x.t, act: 'sash', f: 't', sash: i, ico: ICO.typ, view: 'inside', g: 'symbol', hint: n > 1 ? 'Flügel ' + (i + 1) + ' von ' + n : 'Er schwingt so auf' });
    if (x.t === 'D' || x.t === 'DK') L.push({ id: 'din-' + i, title: n > 1 ? 'Scharniere von Flügel ' + (i + 1) + '?' : 'Scharniere links oder rechts?', sub: 'Von innen gesehen. Der Griff sitzt gegenüber.', kind: 'chips', group: 'din', val: x.din, act: 'sash', f: 'din', sash: i, view: 'inside', g: 'dinlr', hint: 'Der Griff wandert mit' });
  });
  L.push({ id: 'material', title: 'Welches Material?', sub: 'Bestimmt Preis, Pflege und Profilbreite.', kind: 'cards', group: 'material', val: w.material, act: 'setw', f: 'material', ico: ICO.material, view: 'inside' });
  L.push({ id: 'ol', title: 'Ein Oberlicht?', sub: 'Ein extra Feld über dem Fenster.', kind: 'chips', group: 'ol', val: w.ol ? w.olT : 'nein', act: 'ol-set', view: 'inside', g: 'oberlicht' });
  L.push({ id: 'form', title: 'Welche Form?', sub: 'Sonderformen zeigt das Modell vereinfacht.', kind: 'cards', group: 'form', val: w.form, act: 'form', ico: ICO.form, view: 'inside' });
  L.push({ id: 'richtung', title: 'Öffnet nach innen oder außen?', kind: 'chips', group: 'richtung', val: w.richtung, act: 'setw', f: 'richtung', view: 'inside', g: 'symbol' });
  L.push({ id: 'sprossen', title: 'Sprossen?', sub: 'Mit + und − dazu, an den Reglern verschieben.', kind: 'bars', view: 'front' });
  if (w.bars.length) {
    L.push({ id: 'spross', title: 'Welche Sprossenart?', kind: 'cards', group: 'spross', val: w.spross, act: 'setw', f: 'spross', ico: ICO.spross, view: 'front' });
    if (w.spross === 'auf') L.push({ id: 'aufseite', title: 'Aufgesetzt wo?', kind: 'chips', group: 'aufseite', val: w.aufSeite, act: 'setw', f: 'aufSeite', view: 'outside', hint: 'Ansicht von außen' });
    L.push({ id: 'breite', title: 'Wie breit sollen sie sein?', kind: 'chips', group: 'breite', val: w.breite, act: 'setw', f: 'breite', view: 'front' });
  }
  L.push({ id: 'fa', title: 'Welche Farbe außen?', kind: 'color', side: 'aussen', view: 'outside', g: 'ral', hint: 'Ansicht von außen' });
  L.push({ id: 'fi', title: 'Und innen?', kind: 'color', side: 'innen', view: 'inside', g: 'ral', hint: 'Ansicht von innen' });
  L.push({ id: 'glas', title: 'Welche Verglasung?', sub: 'Je kleiner der U-Wert, desto weniger Wärme geht verloren.', kind: 'cards', group: 'glas', val: w.glas, act: 'setw', f: 'glas', ico: ICO.glas, view: 'inside', g: 'uwert' });
  L.push({ id: 'glasfn', title: 'Extras fürs Glas?', sub: 'Mehrfachauswahl möglich.', kind: 'multi', group: 'glasfn', vals: w.glasfn, act: 'glasfn', view: 'inside' });
  if (w.glasfn.indexOf('sicht') >= 0) L.push({ id: 'orn', title: 'Welches Ornamentglas?', kind: 'orn', view: 'inside', g: 'ornament' });
  L.push({ id: 'griff', title: 'Welcher Griff?', kind: 'cards', group: 'griff', val: w.griff, act: 'setw', f: 'griff', ico: ICO.griff, view: 'inside' });
  L.push({ id: 'gf', title: 'Welche Griff-Farbe?', kind: 'chips', group: 'gf', val: w.gf, act: 'setw', f: 'gf', view: 'inside', hint: 'Der Griff wechselt mit' });
  L.push({ id: 'rc', title: 'Einbruchschutz?', kind: 'chips', group: 'rc', val: w.rc, act: 'setw', f: 'rc', view: 'inside', g: 'rc2' });
  L.push({ id: 'roll', title: 'Rollladen?', kind: 'cards', group: 'roll', val: w.roll, act: 'setw', f: 'roll', ico: ICO.roll, view: 'outside', hint: 'Ansicht von außen' });
  if (w.roll === 'aufsatz' || w.roll === 'vorbau') L.push({ id: 'antrieb', title: 'Wie wird er bedient?', kind: 'chips', group: 'antrieb', val: w.antrieb, act: 'setw', f: 'antrieb', view: 'outside', hint: 'Ansicht von außen' });
  L.push({ id: 'insekt', title: 'Insektenschutz?', kind: 'cards', group: 'insekt', val: w.insekt, act: 'setw', f: 'insekt', ico: ICO.insekt, view: 'outside', g: 'insekt', hint: 'Ansicht von außen' });
  L.push({ id: 'fbi', title: 'Fensterbank innen?', kind: 'chips', group: 'fbi', val: w.fbi, act: 'setw', f: 'fbi', view: 'inside', g: 'fensterbank' });
  L.push({ id: 'fba', title: 'Fensterbank außen?', kind: 'chips', group: 'fba', val: w.fba, act: 'setw', f: 'fba', view: 'outside', hint: 'Ansicht von außen' });
  L.push({ id: 'montage', title: 'Was soll der Fensterbauer übernehmen?', kind: 'switches', view: 'three' });
  L.push({ id: 'notiz', title: 'Noch etwas für den Fensterbauer?', kind: 'text', view: 'three' });
  return L;
}
function qCurrent() { const list = qList(S.win); let i = list.findIndex((q) => q.id === S.q); if (i < 0) { i = 0; S.q = list[0].id; } return { list: list, i: i, q: list[i] }; }
function qStep(delta) {
  const c = qCurrent(), nx = c.list[c.i + delta];
  if (!nx) { if (delta > 0) return saveWin(); return go('ergebnis', 'back'); }
  S.q = nx.id; S.dir = delta < 0 ? 'back' : 'fwd'; S.selBar = null; S.qWunsch = false;
  S.openSash = nx.sash != null ? nx.sash : -1; if (nx.sash != null) S.selSash = nx.sash;
  render(true);
}
function qOpt(q, o, pressed, inner) { return '<button type="button" class="qopt" data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : '') + ' data-v="' + o.k + '" aria-pressed="' + pressed + '">' + inner + '</button>'; }
function qCards(q) {
  const opts = OPT[q.group], scroll = opts.length > 4;
  return '<div class="qcards' + (scroll ? ' row' : '') + '">' + opts.map((o) => '<div class="qo">' + qOpt(q, o, String(o.k) === String(q.val), (q.ico ? svgIcon(q.ico(o.k), 44) : '') + '<span class="lbl">' + esc(o.label) + '</span>' + (o.sub ? '<span class="sb">' + esc(o.sub) + '</span>' : '') + (o.price ? '<span class="pr">' + esc(o.price) + '</span>' : '')) + (o.g ? '<button type="button" class="qinfo" aria-label="Erklärung" data-act="gloss" data-k="' + o.g + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
function qChips(q) {
  const opts = q.group === 'ol' ? [{ k: 'nein', label: 'Kein Oberlicht' }, { k: 'K', label: 'Oberlicht, kippbar' }, { k: 'F', label: 'Oberlicht, fest' }] : OPT[q.group];
  return '<div class="qchips">' + opts.map((o) => '<button type="button" class="chip big" data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : '') + ' data-v="' + o.k + '" aria-pressed="' + (String(o.k) === String(q.val)) + '">' + (o.bg ? '<span class="dot" style="background: ' + o.bg + '"></span>' : '') + esc(o.label) + '</button>').join('') + '</div>';
}
function qMulti(q) {
  return '<div class="qchips">' + OPT[q.group].map((o) => '<button type="button" class="chip big" data-act="' + q.act + '" data-v="' + o.k + '" aria-pressed="' + (q.vals.indexOf(o.k) >= 0) + '">' + esc(o.label) + '</button>').join('') + '</div>' + (q.vals.length ? '' : '<p class="sub center">Nichts davon? Einfach weiter.</p>');
}
function qColor(q) {
  const w = S.win, side = q.side, cur = side === 'innen' ? (w.gleich ? w.fa : w.fi) : w.fa, curC = colorOf(cur), wunsch = side === 'innen' ? w.wunschI : w.wunschA;
  let h = '<div class="qswatches">' + COLORS.map((c) => '<button type="button" class="qsw" data-act="color" data-side="' + side + '" data-v="' + c.k + '" aria-pressed="' + (c.k === cur) + '" aria-label="' + esc(c.name) + '"><span class="c" style="background: ' + c.bg + '"></span><span class="n">' + esc(c.name).replace(/^(Verkehrs|Anthrazit|Schwarz|Basalt)(weiß|grau|braun)$/, '$1&shy;$2') + '</span></button>').join('') + '</div>';
  h += '<p class="qcur"><b>' + esc(curC.name) + '</b> · ' + esc(curC.code) + (side === 'innen' && w.gleich ? ' · wie außen' : '') + '</p>';
  h += '<div class="qrow">' + (side === 'innen' ? '<button type="button" class="chip" data-act="togglew" data-f="gleich" aria-pressed="' + w.gleich + '">Innen wie außen</button>' : '') + '<button type="button" class="chip" data-act="qwunsch" aria-pressed="' + (S.qWunsch || !!wunsch) + '">Andere Farbe …</button></div>';
  if (S.qWunsch || wunsch) h += '<div class="qwunsch"><input type="text" id="t-wunsch" data-in="w" data-f="' + (side === 'innen' ? 'wunschI' : 'wunschA') + '" value="' + esc(wunsch || '') + '" placeholder="z. B. RAL 7021, Schwarzgrau"><small>Gibt es den Ton nicht, schlägt dein Fensterbauer den nächstliegenden vor.</small></div>';
  return h;
}
function qOrn() { const w = S.win; return '<div class="qswatches">' + ORN.map((o) => '<button type="button" class="qsw" data-act="setw" data-f="orn" data-v="' + o.k + '" aria-pressed="' + (w.orn === o.k) + '"><span class="c" style="background: ' + o.bg + '"></span><span class="n">' + esc(o.label) + '</span></button>').join('') + '</div>'; }
/* Sprossen: in allen Flügeln gleich, Flügel 1 ist das Muster */
const barBase = (id) => String(id).replace(/s\d+$/, '');
function mirrorBars(w) {
  const base = w.bars.filter((b) => b.s === 0).map((b) => ({ id: barBase(b.id), d: b.d, p: b.p })), out = [];
  w.sashes.forEach((x, s) => { base.forEach((b) => out.push({ id: s ? b.id + 's' + s : b.id, s: s, d: b.d, p: b.p })); });
  w.bars = out;
}
function barsDir(w, d) { return w.bars.filter((b) => b.s === 0 && b.d === d).sort((a, b) => a.p - b.p); }
const evenP = (n) => Array.from({ length: n }, (x, k) => (k + 1) / (n + 1));
function setDir(w, d, list) { w.bars = w.bars.filter((b) => !(b.s === 0 && b.d === d)).concat(list.map((b) => ({ id: b.id || nid(), s: 0, d: d, p: b.p }))); mirrorBars(w); w.preset = w.bars.length ? 'eigene' : 'keine'; }
function barCount(w, d, delta) { const cur = barsDir(w, d), n = Math.max(0, Math.min(4, cur.length + delta)); setDir(w, d, evenP(n).map((p, k) => ({ id: cur[k] ? cur[k].id : null, p: p }))); }
function isEven(w, d) { const cur = barsDir(w, d), e = evenP(cur.length); return cur.every((b, k) => Math.abs(b.p - e[k]) < 0.012); }
function moveBar(w, id, p) { const b0 = barBase(id); w.bars = w.bars.map((b) => (barBase(b.id) === b0 ? Object.assign({}, b, { p: p }) : b)); w.preset = 'eigene'; }
function deleteBar(w, id) { const b0 = barBase(id); w.bars = w.bars.filter((b) => barBase(b.id) !== b0); w.preset = w.bars.length ? 'eigene' : 'keine'; }
function addBarAt(w, d, p) { const id = nid(); w.bars.push({ id: id, s: 0, d: d, p: snapP(p) }); mirrorBars(w); w.preset = 'eigene'; return id; }
function qBars() {
  const w = S.win, nv = barsDir(w, 'v').length, nh = barsDir(w, 'h').length, uneven = !isEven(w, 'v') || !isEven(w, 'h');
  const row = (d, label, hint, n) => '<div class="qstep"><span class="t"><b>' + label + '</b><small>' + hint + '</small></span><span class="stepper"><button type="button" data-act="barcnt" data-d="' + d + '" data-v="-1" aria-label="Weniger"' + (n ? '' : ' disabled') + '>−</button><b>' + n + '</b><button type="button" data-act="barcnt" data-d="' + d + '" data-v="1" aria-label="Mehr"' + (n < 4 ? '' : ' disabled') + '>+</button></span></div>';
  let h = '<div class="qsteps">' + row('v', 'Senkrecht', 'Regler unten', nv) + row('h', 'Waagerecht', 'Regler links', nh) + '</div>';
  h += '<div class="qrow">' + (uneven ? '<button type="button" class="chip" data-act="bareven">Gleichmäßig verteilen</button>' : '') + (w.bars.length ? '<button type="button" class="chip" data-act="clearbars">Alle löschen</button>' : '<span class="sub">Ohne Sprossen? Einfach weiter.</span>') + (w.sashes.length > 1 ? '<span class="sub">In allen Flügeln gleich.</span>' : '') + '</div>';
  return h;
}
function qSwitches() { const w = S.win; return '<div class="rows">' + switchRow('Altfenster ausbauen und entsorgen', '', w.demontage, 'demontage') + switchRow('RAL-Montage', 'Luftdicht, gedämmt, schlagregendicht', w.ralm, 'ralm', 'ralmontage') + switchRow('Innenlaibung verputzen', '', w.putz, 'putz') + '</div>'; }
function qLage() { const w = S.win; return '<div class="rows"><div class="trow"><span>Raum</span><input type="text" id="t-name" data-in="w" data-f="name" value="' + esc(w.name || '') + '" placeholder="z. B. Küche" autocomplete="off"></div></div>' + chips('etage', w.etage, 'etage') + '<div class="rows">' + fieldRow('Gleiche Fenster im Haus', 'anzahl', 'Stück', 1) + '</div>'; }
function qText() { return '<div class="rows"><div class="trow"><span>Notiz für den Fensterbauer</span><textarea rows="3" id="t-notiz" data-in="w" data-f="notiz" placeholder="z. B. Fenster klemmt, Zugluft unten links">' + esc(S.win.notiz) + '</textarea></div></div>'; }
SCREENS.frage = () => {
  const c = qCurrent(), q = c.q, w = S.win, n = c.list.length, last = c.i === n - 1;
  const sec = QSEC[q.id.split('-')[0]] || 'Fenster';
  let panel;
  if (q.kind === 'cards') panel = qCards(q); else if (q.kind === 'chips') panel = qChips(q); else if (q.kind === 'multi') panel = qMulti(q); else if (q.kind === 'color') panel = qColor(q);
  else if (q.kind === 'orn') panel = qOrn(); else if (q.kind === 'bars') panel = qBars(); else if (q.kind === 'switches') panel = qSwitches(); else if (q.kind === 'lage') panel = qLage(); else panel = qText();
  const isSash = q.sash != null, selIdx = isSash ? q.sash : Math.min(S.selSash, w.sashes.length - 1);
  const view = q.id === 'sprossen' || q.kind === 'bars' ? 'front' : q.view;
  const stage = model(w, { id: 'w3d', view: view, sway: !isSash && q.kind !== 'bars', selectable: isSash, selSash: selIdx, openSash: isSash ? S.openSash : -1, symbols: isSash || q.id === 'richtung', rails: q.kind === 'bars', selBar: S.selBar, stageH: 'auto', fitW: q.kind === 'bars' ? 0.72 : view === 'front' ? 0.88 : 0.66, fitH: q.kind === 'bars' ? 0.66 : view === 'front' ? 0.82 : 0.72, hint: q.kind === 'bars' ? '' : (q.hint || '') });
  const title = hd('Frage ' + (c.i + 1) + ' von ' + n + ' · ' + sec, esc(q.title) + (q.g ? ' <button type="button" class="qg" aria-label="Erklärung" data-act="gloss" data-k="' + q.g + '">' + ICON_I + '</button>' : ''), q.sub ? esc(q.sub) : '', 'compact');
  const html = title + stage + '<div class="qpanel" data-q="' + q.id + '">' + panel + '</div>' + '<div class="qnav"><button type="button" class="btn ghost" data-act="qprev" aria-label="Zurück">' + '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></button><button type="button" class="btn primary" data-act="qnext">' + (last ? 'Fenster speichern' : 'Weiter') + '</button></div>';
  return { html: html, back: [c.i ? 'Zurück' : 'Ergebnis', 'qprev'], fit: true, qpos: (c.i + 1) / n };
};
/* Flügel im Modell antippen: springt zur Frage dieses Flügels */
function onSashTap(i) {
  if (S.screen !== 'frage') return;
  const c = qCurrent();
  S.selSash = i;
  if (c.q.sash != null && c.q.sash !== i) { const nx = c.list.find((q) => q.id === 'typ-' + i); if (nx) { S.q = nx.id; S.dir = i > c.q.sash ? 'fwd' : 'back'; } }
  S.openSash = S.openSash === i ? -1 : i;
  render(true);
}
/* Regler ziehen: live am Modell, beim Loslassen gespeichert; über das Ende hinaus gezogen löscht */
function bindRails(stage) {
  stage.querySelectorAll('.rail').forEach((rail) => {
    if (rail.getAttribute('data-bound')) return;
    rail.setAttribute('data-bound', '1');
    const horizontal = rail.getAttribute('data-rail') === 'v', d = horizontal ? 'v' : 'h';
    rail.addEventListener('pointerdown', (e) => {
      if (e.button != null && e.button > 0) return;
      e.preventDefault(); e.stopPropagation();
      const w = S.win, r = rail.getBoundingClientRect(), spans = JSON.parse(rail.getAttribute('data-span') || '[]'), h = e.target.closest ? e.target.closest('.rh') : null;
      const fracIn = (ev, s) => horizontal ? (ev.clientX - r.left - (spans[s] ? spans[s][0] : 0)) / (spans[s] ? spans[s][1] : r.width) : (ev.clientY - r.top) / r.height;
      if (!h) {
        let s = 0;
        if (horizontal) { const x = e.clientX - r.left; spans.forEach((sp, i) => { if (x >= sp[0] - 6 && x <= sp[0] + sp[1] + 6) s = i; }); }
        const raw = fracIn(e, s); if (raw < -0.05 || raw > 1.05) return;
        S.selBar = addBarAt(w, d, raw); render(); return;
      }
      try { h.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
      const id = h.getAttribute('data-rb'), s = +h.getAttribute('data-rs') || 0, b0 = barBase(id), bw = Math.max(2, w.breite * (stage._s || 0.15));
      let moved = false, out = false, p = null;
      const move = (ev) => {
        const raw = fracIn(ev, s);
        moved = true; h.classList.add('is-drag');
        out = raw < -0.12 || raw > 1.12; p = snapP(raw);
        h.classList.toggle('is-out', out);
        moveBar(w, id, p);
        w.bars.filter((b) => barBase(b.id) === b0).forEach((b) => w3dBarPos(stage.querySelector('[data-r="bar-' + b.id + '"]'), b, bw));
        rail.querySelectorAll('.rh').forEach((x) => { if (barBase(x.getAttribute('data-rb')) !== b0) return; const xs = +x.getAttribute('data-rs') || 0; if (horizontal) x.style.left = (spans[xs] ? spans[xs][0] + p * spans[xs][1] : p * r.width) + 'px'; else x.style.top = (p * r.height) + 'px'; });
      };
      const up = () => {
        h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
        if (moved && out) { deleteBar(w, id); S.selBar = null; toast('Sprosse entfernt'); } else S.selBar = b0;
        render();
      };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  });
}

/* ---------- Fensterbauer-Bereich ---------- */
function demoInbox() {
  const ws = demoProject();
  return [
    { id: 'd1', kunde: 'Familie Weber', ort: '50667 Köln', when: 'heute, 09:12', status: 'neu', windows: ws, proj: { gebaeude: 'efh', baujahr: '1978', total: 9, zeit: '3m', budget: 'b2', foerd: true, name: 'Familie Weber', ort: '50667 Köln', tel: '0221 000000', mail: 'weber@beispiel.de', erreich: 'ab' }, demo: true },
    { id: 'd2', kunde: 'M. Yilmaz', ort: '51429 Bergisch Gladbach', when: 'gestern, 18:40', status: 'offen', windows: [ws[1]], proj: { gebaeude: 'altbau', baujahr: '1952', total: 12, zeit: 'sofort', budget: 'b1', foerd: false, name: 'M. Yilmaz', ort: '51429 Bergisch Gladbach', tel: '02204 000000', mail: '', erreich: 'vm' }, demo: true }
  ];
}
function allInbox() { return demoInbox().concat(S.admin.inbox || []); }
function kundenlink(l) { return APP_URL + '#k-' + l.code + (S.admin.betrieb ? '-' + slug(S.admin.betrieb) : ''); }
SCREENS.admin = () => {
  const a = S.admin, inbox = allInbox();
  const ex = (num(a.abzugB) || 0) * 2, exH = (num(a.abzugH) || 0);
  let html = hd('Für Fensterbauer', 'Dein Bereich.', 'Schick Kunden deinen Link. Sie messen selbst auf, du bekommst das Aufmaßblatt samt allem, was die KI aus den Fotos liest.') +
    '<div class="sec">' + secHead('Betrieb') + '<div class="rows"><div class="trow"><span>Firma</span><input type="text" id="a-betrieb" data-in="a" data-f="betrieb" value="' + esc(a.betrieb) + '" placeholder="Fensterbau Muster"></div><div class="trow"><span>PLZ und Ort</span><input type="text" id="a-ort" data-in="a" data-f="ort" value="' + esc(a.ort) + '"></div><div class="trow"><span>Telefon</span><input type="text" inputmode="tel" id="a-tel" data-in="a" data-f="tel" value="' + esc(a.tel) + '"></div><div class="trow"><span>E-Mail</span><input type="text" inputmode="email" id="a-mail" data-in="a" data-f="mail" value="' + esc(a.mail) + '"></div></div></div>' +
    '<div class="sec">' + secHead('Bestellmaß aus der Öffnung', 'rahmenmass', 'Dein Abzug je Seite. Die App rechnet damit das Bestellmaß vor, du entscheidest beim Feinaufmaß.') + '<div class="rows"><div class="row"><label><span class="lbl">Seitlich je Seite</span><span class="val"><input type="text" inputmode="numeric" id="a-abzugB" data-in="a" data-f="abzugB" value="' + esc(a.abzugB) + '"><span class="unit">mm</span></span></label></div><div class="row"><label><span class="lbl">Oben</span><span class="val"><input type="text" inputmode="numeric" id="a-abzugH" data-in="a" data-f="abzugH" value="' + esc(a.abzugH) + '"><span class="unit">mm</span></span></label></div></div><p class="sub" style="padding: 0 6px">Beispiel: Öffnung 1.250 × 1.430 → Bestellmaß ' + thousand(1250 - ex) + ' × ' + thousand(1430 - exH) + ' mm.</p></div>';
  html += '<div class="sec">' + secHead('Kundenlinks', null, 'Jeder Link trägt deinen Namen. Der Kunde sieht beim Öffnen, dass sein Aufmaß an dich geht.') + '<div class="card">' +
    (a.links.length ? a.links.map((l) => '<div style="display: flex; flex-direction: column; gap: 6px; padding-bottom: 12px; border-bottom: 1px solid var(--line)"><div style="display: flex; justify-content: space-between; gap: 8px; align-items: center"><b>' + esc(l.name || 'Kunde ' + l.code.toUpperCase()) + '</b><small style="color: var(--muted)">' + esc(l.when) + '</small></div><textarea class="copybox" readonly rows="2" id="link-' + l.code + '" aria-label="Kundenlink">' + esc(kundenlink(l)) + '</textarea><div class="pill-row"><button type="button" class="pill" data-act="admin-copy" data-v="' + l.code + '">Link kopieren</button><button type="button" class="pill" data-act="admin-test" data-v="' + l.code + '">Als Kunde öffnen</button></div></div>').join('') : '<p class="sub">Noch kein Link erstellt.</p>') +
    '<div class="rows"><div class="trow"><span>Name des Kunden (optional)</span><input type="text" id="a-newname" data-in="a" data-f="newname" value="' + esc(a.newname || '') + '" placeholder="z. B. Familie Weber"></div></div><button type="button" class="btn primary" style="flex: 0 0 auto" data-act="admin-link">Neuen Kundenlink erstellen</button></div></div>';
  html += '<div class="sec">' + secHead('Eingang', null, inbox.length + ' Aufmaße') + '<div class="rows">' + inbox.map((it, i) => '<button type="button" class="inbox-item" data-act="admin-open" data-i="' + i + '"><span class="t"><b>' + esc(it.kunde) + '</b><small>' + esc(it.ort + ' · ' + it.windows.length + (it.windows.length === 1 ? ' Fenster' : ' Fenster') + ' · ' + it.when) + (it.demo ? ' · Beispiel' : '') + '</small></span><span class="status ' + it.status + '">' + ({ neu: 'Neu', offen: 'Angebot offen', fertig: 'Angebot raus' }[it.status] || it.status) + '</span>' + CHEV + '</button>').join('') + '</div>' +
    '<div class="card"><p class="eyebrow">Aufmaß-Code einfügen</p><p class="sub">Hat dir ein Kunde seinen Code geschickt, füge ihn hier ein.</p><textarea class="copybox" id="a-code" rows="3" data-in="a" data-f="code" placeholder="AM1.…" aria-label="Aufmaß-Code">' + esc(a.code || '') + '</textarea><button type="button" class="btn ghost" style="flex: 0 0 auto" data-act="admin-import">Aufmaß einlesen</button></div></div>';
  html += noteBox('Im Prototyp laufen Links und Eingang auf diesem Gerät. In der fertigen App landen Aufmaße automatisch in deinem Konto, mit Fotos.', null, '');
  return { html: html, back: ['Start', 'home'], bar: null };
};
SCREENS.adminblatt = () => {
  const it = S.inboxView;
  if (!it) return SCREENS.admin();
  const a = S.admin, exB = (num(a.abzugB) || 0) * 2, exH = num(a.abzugH) || 0;
  const bestell = '<div class="card"><p class="eyebrow">Bestellmaß-Vorschlag</p><div class="mini-list">' + it.windows.map((x, i) => { const d = derive(x); return '<div><span>Pos. ' + (i + 1) + ' · ' + esc(x.name || 'Fenster') + '</span><b>' + (d.moW ? thousand(d.moW - exB) + ' × ' + thousand(d.moH - exH) + ' mm' : '–') + '</b></div>'; }).join('') + '</div><p class="sub">Öffnung minus ' + exB + ' mm Breite und ' + exH + ' mm Höhe, nach deinen Abzügen. Gilt vorbehaltlich Feinaufmaß.</p></div>';
  const html = hd('Eingang', esc(it.kunde) + '.', esc(it.ort + ' · eingegangen ' + it.when)) + bestell + blattHTML(it.windows, it.proj, { betrieb: a.betrieb, date: it.date }) + '<div class="pill-row" style="justify-content: center">' + ['neu', 'offen', 'fertig'].map((st) => '<button type="button" class="pill' + (it.status === st ? ' el' : '') + '" data-act="admin-status" data-v="' + st + '">' + ({ neu: 'Neu', offen: 'Angebot offen', fertig: 'Angebot raus' }[st]) + '</button>').join('') + '</div>';
  return { html: html, back: ['Eingang', 'admin'], bar: null };
};
/* ---------- Fensterportal: anonym inserieren, Anbieter klopfen an ---------- */
const PROVIDERS = [
  { id: 'p1', name: 'Fensterbau Brandt', col: '#0a7a55', stars: 4.8, n: 126, km: 4, web: 'Webseite, Google-Profil', ant: 'antwortet meist in 2 Std.', seit: 'seit 1987' },
  { id: 'p2', name: 'Glas & Rahmen Nowak', col: '#7b3fa0', stars: 4.6, n: 58, km: 9, web: 'Webseite', ant: 'antwortet meist am selben Tag', seit: 'seit 2004' },
  { id: 'p3', name: 'Fensterwerk Lindau', col: '#c2185b', stars: 4.9, n: 211, km: 14, web: 'Webseite, Instagram', ant: 'antwortet meist in 1 Std.', seit: 'seit 1995' },
  { id: 'p4', name: 'Bauelemente Keller', col: '#b07d00', stars: 4.3, n: 34, km: 21, web: 'Google-Profil', ant: 'antwortet meist in 2 Tagen', seit: 'seit 2015' }
];
const INQUIRIES = [
  { id: 'q1', titel: '3 Fenster, Einfamilienhaus', ort: 'PLZ 506xx, Köln', km: 6, txt: 'Kunststoff, 3-fach, Anthrazit außen, Rollladen elektrisch', zeit: 'in 3 Monaten' },
  { id: 'q2', titel: '12 Fenster, Altbau', ort: 'PLZ 514xx, Bergisch Gladbach', km: 11, txt: 'Holz, weiß, Sprossen, Denkmalschutz möglich', zeit: 'so bald wie möglich' },
  { id: 'q3', titel: '1 Fenster, Bad', ort: 'PLZ 507xx, Köln', km: 3, txt: 'Kunststoff, Ornamentglas, Kippflügel', zeit: 'offen' }
];
const stars = (v) => { let s = ''; for (let i = 1; i <= 5; i++) s += i <= Math.round(v) ? '★' : '☆'; return s; };
function inseratHTML() {
  const ws = S.windows, pr = S.proj, mats = {}, n = ws.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
  ws.forEach((x) => { mats[lab('material', x.material)] = 1; });
  const plz = (pr.ort || '').replace(/\D/g, '').slice(0, 3);
  return '<div class="anon"><b>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ', ' + esc(lab('gebaeude', pr.gebaeude)) + '</b><span>' + (plz ? 'PLZ ' + plz + 'xx' : 'Dein Umkreis') + ' · ' + esc(Object.keys(mats).join(', ')) + ' · ' + esc(lab('glas', ws[0] ? ws[0].glas : '3')) + '-Glas · ' + esc(lab('zeit', pr.zeit)) + '</span><span>Maße und Fotos liegen bei. Name, Adresse und Telefon bleiben verborgen.</span></div>';
}
SCREENS.portal = () => {
  const p = S.portal, role = p.role;
  let html = hd('Fensterportal', role === 'kunde' ? 'Anbieter klopfen an.<br>Du entscheidest.' : 'Anfragen im Umkreis.', role === 'kunde' ? 'Inseriere dein Aufmaß anonym. Wer dir gefällt, bekommt deine Kontaktdaten, alle anderen nicht.' : 'Anonyme Aufmaße aus deiner Nähe. Klopf an, der Kunde gibt dir seine Kontaktdaten frei, wenn er will.') +
    '<div class="seg"><button type="button" data-act="portal-role" data-v="kunde" aria-pressed="' + (role === 'kunde') + '">Als Hauseigentümer</button><button type="button" data-act="portal-role" data-v="anbieter" aria-pressed="' + (role === 'anbieter') + '">Als Anbieter</button></div>';
  if (role === 'kunde') {
    html += '<div class="sec">' + secHead('Dein Inserat', null, 'So sehen es Anbieter.') + inseratHTML() + (!p.inseriert ? '<button type="button" class="btn primary" style="flex: 0 0 auto" data-act="portal-insert">Anonym inserieren</button>' : '<div class="msg ok">' + CHECK + ' Inseriert. Anbieter im Umkreis von 25 km sehen dein Aufmaß ohne Namen.</div>') + '</div>';
    if (p.inseriert) {
      const open = PROVIDERS.filter((x) => !p.decided[x.id]), yes = PROVIDERS.filter((x) => p.decided[x.id] === 'ja'), no = PROVIDERS.filter((x) => p.decided[x.id] === 'nein');
      html += '<div class="sec">' + secHead('Angeklopft', null, open.length ? open.length + ' Anbieter wollen dir ein Angebot machen. Beispielbetriebe.' : 'Alle beantwortet.') + open.map((x) => '<div class="knock"><div style="display: flex; gap: 14px; align-items: center"><span class="av" style="background: ' + x.col + '">' + esc(x.name[0]) + '</span><div style="min-width: 0"><div class="nm">' + esc(x.name) + '</div><div class="st"><span class="stars">' + stars(x.stars) + '</span> ' + String(x.stars).replace('.', ',') + ' · ' + x.n + ' Bewertungen</div></div></div><div class="st">' + x.km + ' km entfernt · ' + esc(x.web) + ' · ' + esc(x.ant) + ' · ' + esc(x.seit) + '</div><div class="knock-actions"><button type="button" class="btn no" data-act="knock" data-v="nein" data-id="' + x.id + '">Ablehnen</button><button type="button" class="btn yes" data-act="knock" data-v="ja" data-id="' + x.id + '">Kontakt freigeben</button></div></div>').join('') + '</div>';
      if (yes.length) html += '<div class="sec">' + secHead('Kontakt freigegeben') + '<div class="rows">' + yes.map((x) => '<div class="inbox-item"><span class="av" style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; background: ' + x.col + '">' + esc(x.name[0]) + '</span><span class="t"><b>' + esc(x.name) + '</b><small>Hat deine Kontaktdaten und meldet sich.</small></span><span class="status fertig">freigegeben</span></div>').join('') + '</div></div>';
      if (no.length) html += '<p class="sub" style="padding: 0 6px">Abgelehnt: ' + esc(no.map((x) => x.name).join(', ')) + '. Sie sehen deine Daten nicht.</p>';
    }
  } else {
    html += '<div class="sec">' + secHead('Offene Aufmaße', null, 'Umkreis 25 km um ' + esc(S.admin.ort || 'deinen Betrieb') + '. Beispiele.') + INQUIRIES.map((q) => '<div class="knock" style="animation: none"><div class="nm" style="font-size: 20px">' + esc(q.titel) + '</div><div class="st">' + esc(q.ort) + ' · ' + q.km + ' km · ' + esc(q.zeit) + '</div><div class="st">' + esc(q.txt) + '</div><div class="st" style="color: var(--muted)">Aufmaßblatt mit allen Maßen und KI-Angaben liegt bei. Kontakt erst nach Freigabe.</div>' + (p.knocked[q.id] ? '<div class="msg ok">' + CHECK + ' Angeklopft. Du erfährst es, sobald der Kunde dich freigibt.</div>' : '<button type="button" class="btn primary" style="flex: 0 0 auto" data-act="anbieter-knock" data-id="' + q.id + '">Anklopfen</button>') + '</div>').join('') + '</div>';
  }
  html += noteBox('Prototyp: Anbieter und Anfragen sind Beispiele. In der fertigen App kommen echte Betriebe mit Bewertungen und echten Anfragen aus dem Umkreis.', null, '');
  return { html: html, back: ['Start', 'home'], bar: null };
};
/* ---------- Glossar ---------- */
const SHORT = { dinlr: 'DIN links/rechts', symbol: 'Öffnungssymbole', dk: 'Dreh-Kipp', fest: 'Festverglasung', kipp: 'Kippfenster', stulp: 'Stulpfenster', pfosten: 'Pfosten', oberlicht: 'Oberlicht', anschlag: 'Maueranschlag', laibung: 'Laibung', bruestung: 'Brüstungshöhe', rahmenmass: 'Öffnung und Element', wiener: 'Wiener Sprosse', szr: 'Innenliegende Sprossen', auf: 'Aufgesetzte Sprossen', echt: 'Glasteilende Sprossen', uwert: 'U-Wert', schall: 'Schallschutzglas', vsg: 'Sicherheitsglas', ornament: 'Ornamentglas', rc2: 'RC2', aufsatz: 'Aufsatzrollladen', vorbau: 'Vorbaurollladen', insekt: 'Insektenschutz', ralmontage: 'RAL-Montage', fensterbank: 'Fensterbank', ral: 'RAL-Farben', lueftung: 'Lüftungskonzept', referenz: 'Genauigkeit', feinaufmass: 'Feinaufmaß' };
function sheetsHTML() {
  const X = '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="var(--seg)"></circle><path d="M10.5 10.5l9 9M19.5 10.5l-9 9" fill="none" stroke="var(--muted)" stroke-width="2.2" stroke-linecap="round"></path></svg>';
  if (S.gloss && GLOSS[S.gloss]) {
    const G = GLOSS[S.gloss];
    return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet" role="dialog" aria-label="Glossar"><div class="grip"></div><div class="sheet-top"><button type="button" class="link" data-act="gindex">Alle Begriffe</button><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + X + '</button></div><p class="eyebrow" style="text-align: center; margin-top: 4px">Glossar</p><h2 style="margin-top: 14px">' + esc(G.t) + '</h2><div class="ico">' + svgIcon(G.ico(), 132) + '</div>' + G.x.map((x) => '<p class="x">' + esc(x) + '</p>').join('') + (G.see.length ? '<div class="see"><span>Siehe auch:</span>' + G.see.map((k) => '<button type="button" class="ulink" style="min-height: 44px" data-act="gloss" data-k="' + k + '">' + esc(SHORT[k]) + '</button>').join('') + '</div>' : '') + '</div>';
  }
  if (S.glossIndex) return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet" role="dialog" aria-label="Alle Begriffe" style="padding-inline: 16px"><div class="grip"></div><div style="display: flex; justify-content: flex-end; margin-right: -4px"><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + X + '</button></div><p class="eyebrow" style="text-align: center">Glossar</p><h2 style="margin: 12px 0 20px">Fachbegriffe, einfach erklärt.</h2><div class="gindex">' + GLOSS_ORDER.map((k) => '<button type="button" data-act="gloss" data-k="' + k + '"><span><b>' + esc(SHORT[k]) + '</b><small>' + esc(GLOSS[k].t) + '</small></span>' + CHEV + '</button>').join('') + '</div></div>';
  return '';
}
/* ---------- Fotos und KI im Hintergrund ---------- */
let DL = null, DLP = null;
/* Ein Aufmaß ist ein Objekt: höchstens 20 Positionen, gleiche Fenster über „Anzahl“. Im echten Betrieb prüft das auch der Server. */
const MAXPOS = 20;
const maxMsg = () => 'Ein Aufmaß umfasst bis zu ' + MAXPOS + ' Fenster. Gleiche Fenster zählst du über „Anzahl“' + (S.betrieb ? '; für ein weiteres Haus schickt dir ' + (S.betrieb.name || 'dein Fensterbauer') + ' gern einen eigenen Link.' : '.');
const ctrls = {};
function imageDims(url) { return new Promise((res) => { const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => res({ w: 1200, h: 1600 }); im.src = url; }); }
async function onPhoto(which, file) {
  if (!file) return;
  if (S.photos[which] && S.photos[which].url && !S.photos[which].demo) { try { URL.revokeObjectURL(S.photos[which].url); } catch (e) { /* ok */ } }
  let url = ''; try { url = URL.createObjectURL(file); } catch (e) { url = ''; }
  if (!url) { url = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(''); fr.readAsDataURL(file); }); }
  const d = await imageDims(url);
  S.photos[which] = { url: url, file: file, w: d.w, h: d.h, demo: false };
  S.ai[which] = { status: 'idle' };
  S.win.fotos = (S.photos.in ? 1 : 0) + (S.photos.out ? 1 : 0);
  render();
  startAI(which, file);
}
async function startAI(which, file) {
  const ok = await AI.init();
  S.aiOk = ok;
  if (!ok) { S.ai[which] = { status: 'error', code: 'unavailable' }; render(); return; }
  if (ctrls[which]) ctrls[which].abort();
  const ctrl = new AbortController(); ctrls[which] = ctrl;
  S.ai[which] = { status: 'running' }; render();
  try {
    const res = await AI.analyze(file, which, ctrl.signal, (part, r) => { if (ctrl.signal.aborted) return; S.ai[which] = Object.assign({ status: 'running' }, r); mergeKI(); render(); });
    if (ctrl.signal.aborted) return;
    S.ai[which] = Object.assign({ status: 'done' }, res);
    if (res.errs.struct && res.errs.facts) { S.ai[which].status = 'error'; S.ai[which].code = res.errs.struct; }
    mergeKI();
    render();
  } catch (e) {
    if (e && e.code === 'cancelled') return;
    S.ai[which] = { status: 'error', code: e && e.code || 'error' }; render();
  }
}
/* KI-Ergebnisse beider Fotos zu einer Sicht fürs Fenster zusammenführen */
function mergeKI() {
  const a = S.ai.in, b = S.ai.out, w = S.win, ki = w.ki && w.ki.auto !== false ? w.ki : {};
  const chips = [], rows = [], hints = [];
  [a, b].forEach((x, i) => { if (!x || !x.facts) return; x.facts.chips.forEach((c) => { if (chips.length < 6 && chips.indexOf(c) < 0) chips.push(c); }); x.facts.rows.forEach((r) => rows.push([(i ? 'Außen: ' : '') + r[0], r[1]])); x.facts.hints.forEach((t) => hints.push(t)); });
  const st = a && a.struct && a.struct.found ? a.struct : (b && b.struct && b.struct.found ? b.struct : null);
  w.ki = { auto: true, chips: chips, rows: rows, hints: hints, laib: st ? st.laib : null, tilt: st ? st.tilt : null, material: st ? st.material : '', farbe: st ? st.farbe : '', fluegel: st ? st.fluegel : null, teilung: st ? st.teilung : '', oeffnung: st ? st.oeffnung : '' };
  if (st && st.laib && !w.e_laib && !num(w.laib)) w.laib = st.laib;
  if (st && st.material && !w.e_material && OPT.material.some((o) => o.k === st.material)) w.material = st.material;
  if (st && st.fluegel && !w.e_teilung) { const t = st.fluegel === 1 ? '1' : st.fluegel === 3 ? '3' : '2p'; if (w.teilung !== t) { w.teilung = t; w.sashes = sashesFor(t); w.bars = w.preset !== 'keine' && w.preset !== 'eigene' ? presetBars(w.preset, w.sashes.length) : []; } }
  w.fotos = (S.photos.in ? 1 : 0) + (S.photos.out ? 1 : 0);
}
async function useDemo() {
  const [u1, u2] = await Promise.all([demoPhotoUrl('in'), demoPhotoUrl('out')]);
  S.photos.in = { url: u1, file: null, w: 1200, h: 1400, demo: true }; S.photos.out = { url: u2, file: null, w: 1200, h: 1400, demo: true };
  S.ai.in = { status: 'running' }; S.ai.out = { status: 'running' }; S.win.fotos = 2;
  render();
  setTimeout(() => { S.ai.in = Object.assign({ status: 'done' }, AI.DEMO.in); S.ai.out = Object.assign({ status: 'done' }, AI.DEMO.out); mergeKI(); render(); }, 1400);
}
function newWin() {
  Object.keys(ctrls).forEach((k) => { if (ctrls[k]) ctrls[k].abort(); });
  ['in', 'out'].forEach((k) => { const p = S.photos[k]; if (p && p.url && !p.demo) { try { URL.revokeObjectURL(p.url); } catch (e) { /* ok */ } } });
  S.win = baseWin(); S.editIdx = -1; S.photos = { in: null, out: null }; S.ai = { in: null, out: null };
  S.mess = { step: 0, cur: '', msg: null, ack: false }; S.rest = { i: 0, cur: '', msg: null }; S.openSash = -1;
  S.selSash = 0; S.selBar = null; S.side = 'aussen';
  go('fotos');
}
function saveWin() {
  const w = Object.assign({}, S.win, { name: S.win.name || 'Fenster ' + (S.editIdx >= 0 ? S.editIdx + 1 : S.windows.length + 1) });
  if (S.editIdx >= 0) S.windows[S.editIdx] = w; else { S.windows.push(w); S.editIdx = S.windows.length - 1; }
  S.win = w; persist(); go('fertig');
}
/* ---------- Sprossen: Einrasten auf Viertel, Drittel, Hälfte ---------- */
function snapP(p) { const pts = [0.25, 1 / 3, 0.5, 2 / 3, 0.75]; for (let i = 0; i < pts.length; i++) if (Math.abs(p - pts[i]) < 0.03) return pts[i]; return clamp(p, 0.06, 0.94); }
/* ---------- Aktionen ---------- */
const NUMF = { w: 1, h: 1, bru: 1, laib: 1, anzahl: 1, breite: 1 };
function act(name, el) {
  const v = el.getAttribute('data-v'), f = el.getAttribute('data-f'), w = S.win;
  const n = (x) => { const k = parseInt(x, 10); return isNaN(k) ? x : k; };
  switch (name) {
    case 'none': return;
    case 'go': return go(v);
    case 'back': { const view = SCREENS[S.screen] ? SCREENS[S.screen]() : null, b = view && view.back ? view.back[1] : 'home'; if (b === 'mess-prev') return messPrev(); if (b === 'qprev') return qStep(-1); if (b === 'mess-back') { S.mess.step = 3; const st = MESS[3]; S.mess.cur = String(w.el[st.k] || ''); return go('messen', 'back'); } return go(b, 'back'); }
    case 'copywin': { if (S.windows.length >= MAXPOS) return toast(maxMsg()); const c = Object.assign(baseWin(), JSON.parse(JSON.stringify(w)), { name: (w.name || 'Fenster') + ' (Kopie)', fotos: 0, ki: w.ki }); S.windows.push(c); S.win = c; S.editIdx = S.windows.length - 1; persist(); toast('Kopiert, Maße prüfen'); return go('ergebnis'); }
    case 'new': if (S.betrieb && S.sent) return toast('Schon gesendet. Änderungen bitte direkt mit ' + (S.betrieb.name || 'deinem Fensterbauer') + ' klären.'); if (S.windows.length >= MAXPOS) return toast(maxMsg()); return newWin();
    case 'open': { if (S.betrieb && S.sent) return; const i = +el.getAttribute('data-i'); S.win = Object.assign(baseWin(), JSON.parse(JSON.stringify(S.windows[i]))); S.editIdx = i; S.selSash = 0; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; return go('fertig'); }
    case 'delwin': { if (S.editIdx >= 0) S.windows.splice(S.editIdx, 1); S.editIdx = -1; persist(); toast('Fenster gelöscht'); return go('home', 'back'); }
    case 'gloss': { S.gloss = el.getAttribute('data-k'); S.glossIndex = false; return render(); }
    case 'gindex': { S.gloss = null; S.glossIndex = true; return render(); }
    case 'gclose': { S.gloss = null; S.glossIndex = false; return render(); }
    case 'setw': { if (f === 'material') w.e_material = true; if (NUMF[f]) w[f] = n(v); else w[f] = v; return render(); }
    case 'setp': { S.proj[f] = v; persist(); return render(); }
    case 'togglew': { w[f] = !w[f]; return render(); }
    case 'togglep': { S.proj[f] = !S.proj[f]; persist(); return render(); }
    case 'bump': { const cur = num(w[f]) + n(v); w[f] = clamp(cur, f === 'anzahl' ? 1 : 0, 9999); if (f === 'laib') w.e_laib = true; return render(); }
    case 'bumpp': { S.proj.total = clamp(num(S.proj.total) + n(v), 1, 999); persist(); return render(); }
    case 'demo': return useDemo();
    case 'mess-next': return messNext(!!el.getAttribute('data-ack'));
    case 'mess-cm': { messInput(v); S.mess.msg = null; return render(); }
    case 'rest-next': return restNext(!!el.getAttribute('data-ack'));
    case 'rest-cm': { restInput(v); S.rest.msg = null; return render(); }
    case 'rest-same': { S.rest.cur = String(num(v) || ''); S.rest.msg = null; return restNext(true); }
    case 'key': return keyIn(v);
    case 'qnext': return qStep(1);
    case 'wuensche': { S.q = null; S.openSash = -1; return go('frage'); }
    case 'qprev': return qStep(-1);
    case 'qwunsch': { S.qWunsch = !S.qWunsch; render(); const t = document.getElementById('t-wunsch'); if (t && S.qWunsch) t.focus(); return; }
    case 'ol-set': { w.ol = v !== 'nein'; if (v !== 'nein') w.olT = v; return render(); }
    case 'sash': { const i = Math.min(S.selSash, w.sashes.length - 1); w.sashes = w.sashes.map((s, j) => (j === i ? Object.assign({}, s, { [f]: v }) : s)); S.openSash = i; return render(); }
    case 'sash-tap': return onSashTap(+v);
    case 'teilung': { w.e_teilung = true; const sashes = sashesFor(v); w.teilung = v; w.sashes = sashes; mirrorBars(w); S.selSash = 0; S.selBar = null; S.openSash = -1; return render(); }
    case 'form': { if (v === 'rund') { w.form = v; w.teilung = '1'; w.sashes = [{ t: 'F', din: 'L' }]; w.ol = false; mirrorBars(w); S.selSash = 0; } else w.form = v; return render(); }
    case 'preset': { w.preset = v; w.bars = presetBars(v, w.sashes.length); mirrorBars(w); S.selBar = null; return render(); }
    case 'barcnt': { barCount(w, el.getAttribute('data-d'), +v); S.selBar = null; return render(); }
    case 'bareven': { ['v', 'h'].forEach((d) => { const cur = barsDir(w, d); setDir(w, d, evenP(cur.length).map((p, k) => ({ id: cur[k].id, p: p }))); }); return render(); }
    case 'clearbars': { w.bars = []; w.preset = 'keine'; S.selBar = null; return render(); }
    case 'side': { S.side = v; return render(); }
    case 'color': { const side = el.getAttribute('data-side') || S.side; if (side === 'innen') { w.fi = v; w.gleich = false; } else w.fa = v; return render(); }
    case 'glasfn': { w.glasfn = w.glasfn.indexOf(v) >= 0 ? w.glasfn.filter((x) => x !== v) : w.glasfn.concat([v]); return render(); }
    case 'save': return saveWin();
    case 'send': { if (S.betrieb && S.sent) return go('gesendet'); S.sent = { when: Date.now() }; persist(); return go('gesendet'); }
    case 'copyblatt': return copyText(packProject(S.windows, S.proj, S.betrieb), 'code-box', 'Code kopiert');
    case 'k-next': { const k = kauf(); k.err = {}; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(k.mail || '').trim())) k.err.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.'; if (String(k.pw || '').length < 8) k.err.pw = 'Mindestens 8 Zeichen.'; if (!k.agb) k.err.agb = 'Bitte zustimmen, sonst können wir kein Konto anlegen.'; if (Object.keys(k.err).length) return render(); k.mail = k.mail.trim(); persist(); return go('kasse'); }
    case 'k-pay': { const k = kauf(); k.pay = v; if (k.err) delete k.err.pay; return render(); }
    case 'k-buy': { const k = kauf(); k.err = {}; if (!k.pay) k.err.pay = 'Bitte eine Zahlungsart wählen.'; if (!k.widerruf) k.err.widerruf = 'Für die sofortige Lieferung brauchen wir deine Zustimmung.'; if (Object.keys(k.err).length) return render(); k.paid = true; k.when = Date.now(); k.pw = ''; persist(); return go('gekauft'); }
    case 'k-dl': return saveDatei();
    case 'copycode': return copyText(packProject(S.windows, S.proj, S.betrieb), 'code-box', 'Code kopiert');
    case 'download': return saveDatei();
    case 'admin-link': { const code = Math.random().toString(36).slice(2, 7); S.admin.links.unshift({ code: code, name: S.admin.newname || '', when: new Date().toLocaleDateString('de-DE') }); S.admin.newname = ''; persist(); toast('Kundenlink erstellt'); return render(); }
    case 'admin-copy': { const l = S.admin.links.find((x) => x.code === v); return copyText(l ? kundenlink(l) : '', 'link-' + v, 'Link kopiert'); }
    case 'admin-test': { const l = S.admin.links.find((x) => x.code === v); S.betrieb = { code: v, name: S.admin.betrieb || (l && l.name) || '' }; toast('Ansicht des Kunden'); return go('home'); }
    case 'admin-import': { const o = unpackProject(S.admin.code); if (!o) { toast('Code nicht lesbar'); return; } S.admin.inbox.unshift({ id: 'i' + Date.now(), kunde: o.p && o.p.name || 'Unbekannt', ort: o.p && o.p.ort || '', when: 'eingelesen ' + new Date().toLocaleDateString('de-DE'), status: 'neu', windows: o.w, proj: o.p || {}, date: o.t }); S.admin.code = ''; persist(); toast('Aufmaß eingelesen'); return render(); }
    case 'admin-open': { S.inboxView = allInbox()[+el.getAttribute('data-i')] || null; return go('adminblatt'); }
    case 'admin-status': { if (S.inboxView) { S.inboxView.status = v; const it = S.admin.inbox.find((x) => x.id === S.inboxView.id); if (it) it.status = v; persist(); } return render(); }
    case 'portal-role': { S.portal.role = v; persist(); return render(); }
    case 'portal-insert': { S.portal.inseriert = true; persist(); toast('Anonym inseriert'); return render(); }
    case 'knock': { S.portal.decided[el.getAttribute('data-id')] = v; persist(); toast(v === 'ja' ? 'Kontakt freigegeben' : 'Abgelehnt'); return render(); }
    case 'anbieter-knock': { S.portal.knocked[el.getAttribute('data-id')] = true; persist(); toast('Angeklopft'); return render(); }
    default: return;
  }
}
/* Zifferntasten und Tastatur fürs Messen: kein Eingabefeld, keine Systemtastatur, nichts springt */
function keyIn(k) {
  const rest = S.screen === 'rest', st = rest ? S.rest : S.mess;
  if (k === 'ok') return rest ? restNext(false) : messNext(false);
  let cur = st.cur || '';
  if (k === 'del') cur = cur.slice(0, -1); else if (/^\d$/.test(k)) { if (cur.length >= 5) return; cur += k; }
  if (st.msg) { st.msg = null; st.cur = cur; render(); }
  rest ? restInput(cur) : messInput(cur);
}
function copyText(text, id, okMsg) {
  const done = () => toast(okMsg);
  try { navigator.clipboard.writeText(text).then(done, () => { const ta = document.getElementById(id); if (ta) { ta.focus(); ta.select(); } toast('Bitte markieren und kopieren'); }); }
  catch (e) { const ta = document.getElementById(id); if (ta) { ta.focus(); ta.select(); } toast('Bitte markieren und kopieren'); }
}
async function downloadBlatt() {
  if (!DL) return;
  try { await DL.save({ filename: 'Aufmass-' + (slug(S.proj.name) || 'Klopfan') + '.md', data: blattMarkdown(S.windows, S.proj) }); toast('Gespeichert'); }
  catch (e) { if (e && e.code !== 'declined') toast('Speichern hat nicht geklappt'); }
}
function onInput(el, ev) {
  const kind = el.getAttribute('data-in'), f = el.getAttribute('data-f');
  if (kind === 'mess') return messInput(el.value);
  if (kind === 'k') { const k = kauf(); k[f] = el.value; if (k.err && k.err[f]) { delete k.err[f]; const box = el.closest('.kf'); if (box) { box.classList.remove('bad'); const sm = box.querySelector('small'); if (sm) sm.remove(); } } return; }
  if (kind === 'kc') { const k = kauf(); k[f] = el.checked; if (k.err && k.err[f]) { delete k.err[f]; render(); } persist(); return; }
  if (kind === 'rest') return restInput(el.value);
  if (ev.type !== 'change') return;
  if (kind === 'photo') return onPhoto(f, el.files && el.files[0]);
  if (kind === 'w') { if (NUMF[f]) { const v = parseInt(String(el.value).replace(/\D/g, ''), 10); S.win[f] = isNaN(v) ? '' : Math.min(v, 9999); if (f === 'laib') S.win.e_laib = true; } else S.win[f] = el.value; return render(); }
  if (kind === 'p') { S.proj[f] = f === 'total' ? Math.min(parseInt(String(el.value).replace(/\D/g, ''), 10) || 1, 999) : f === 'baujahr' ? el.value.replace(/\D/g, '').slice(0, 4) : el.value; persist(); return render(); }
  if (kind === 'a') { S.admin[f] = f === 'abzugB' || f === 'abzugH' ? Math.min(parseInt(String(el.value).replace(/\D/g, ''), 10) || 0, 200) : el.value; persist(); return render(); }
}
function bindAfterRender() {
  document.querySelectorAll('.w3d-stage').forEach((stage) => {
    const reg = W3DS[stage.id]; if (!reg) return;
    if (stage.getAttribute('data-reused') === '1') { w3dApply(stage, reg.w, reg.o); }
    else {
      const openIdx = reg.o.openSash != null && reg.o.openSash >= 0 ? reg.o.openSash : -1;
      stage.classList.add('no-anim'); w3dApply(stage, reg.w, openIdx >= 0 ? Object.assign({}, reg.o, { openSash: -1 }) : reg.o); void stage.offsetWidth; stage.classList.remove('no-anim');
      if (openIdx >= 0) requestAnimationFrame(() => { const r = W3DS[stage.id]; if (r && document.body.contains(stage)) w3dApply(stage, r.w, r.o); });
    }
    bindW3D(stage, () => { const r = W3DS[stage.id]; return r ? Object.assign({}, r.o, { onSash: r.o.selectable ? (i) => { if (S.screen === 'frage') onSashTap(i); else { S.selSash = i; S.selBar = null; render(); } } : null }) : {}; });
  });
  document.querySelectorAll('.w3d-stage').forEach(bindRails);
}
function relayoutAll() { document.querySelectorAll('.w3d-stage').forEach((stage) => { const reg = W3DS[stage.id]; if (reg) w3dLayout(stage, reg.w, reg.o); }); }
function boot() {
  restore();
  S.betrieb = readHash();
  if (S.betrieb) loadLink();
  window.addEventListener('hashchange', () => { const b = readHash(), was = S.betrieb ? S.betrieb.code : '', now = b ? b.code : ''; if (was === now) { if (b) S.betrieb = b; return render(); } S.betrieb = b; if (b) loadLink(); else loadOwn(); S.screen = 'home'; render(true); });
  const root = $app();
  root.addEventListener('click', (e) => { const el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el || el.disabled) return; const name = el.getAttribute('data-act'); if (name === 'none') return; e.preventDefault(); act(name, el); });
  root.addEventListener('input', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
  root.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
  document.addEventListener('keydown', (e) => {
    if (S.screen !== 'messen' && S.screen !== 'rest') return;
    const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^\d$/.test(e.key)) { e.preventDefault(); keyIn(e.key); } else if (e.key === 'Backspace') { e.preventDefault(); keyIn('del'); } else if (e.key === 'Enter') { e.preventDefault(); keyIn('ok'); }
  });
  window.addEventListener('resize', relayoutAll);
  render(true);
  AI.init().then((ok) => { S.aiOk = ok; if (S.screen === 'fotos') render(); });
  DLP = (async () => { try { DL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { DL = null; } return DL; })();
}
/* ---------- Klopfan im Netz: Pilotphase ohne Server ----------
   Solange kein Backend läuft, zeigt die App nur, was wirklich passiert:
   „Gesendet“ erst mit dem Code, keine Scheinzahlung, die Datei ist kostenlos.
   Schalter: window.KONFIG.pilot in /config.js */
const PILOT = !!(window.KONFIG && window.KONFIG.pilot);
const LOGO = (px) => (window.Logo ? window.Logo.svg(px) : '');
function rechtLinks() {
  const C = window.KONFIG || {};
  return '<div class="foot-links recht"><a class="link" href="' + esc(C.impressum || '/impressum/') + '" target="_blank" rel="noopener">Impressum</a><a class="link" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a></div>';
}
const SEND_IC = '<svg viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--accent-soft)"></circle><path d="M17 31l29-12-9 28-7-10z" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linejoin="round"></path><path d="M30 37l16-18" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linecap="round"></path></svg>';
/* Versand im Kundenlink: der Code geht per WhatsApp oder E-Mail an den Betrieb */
const gesendetOrig = SCREENS.gesendet;
SCREENS.gesendet = () => {
  if (!PILOT) return gesendetOrig();
  const bn = S.betrieb && S.betrieb.name ? S.betrieb.name : '', dat = bn || 'deinem Fensterbauer', nom = bn || 'dein Fensterbauer';
  const n = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0), code = packProject(S.windows, S.proj, S.betrieb);
  const text = 'Hallo' + (bn ? ' ' + bn : '') + ', hier ist mein Fenster-Aufmaß aus Klopfan (' + n + ' Fenster). Bitte im Klopfan-Portal unter „Code vom Kunden einfügen“ einsetzen:\n' + code;
  const wa = 'https://wa.me/?text=' + encodeURIComponent(text), mail = 'mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(text);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px">' + SEND_IC +
    '<h1 style="margin: 4px 0 0; font-family: var(--display); font-size: 40px; line-height: 1.02; font-weight: 900; letter-spacing: -.035em">Jetzt abschicken.</h1>' +
    '<p style="margin: 0; font-size: 17px; line-height: 1.5; color: var(--fg2)">Dein Aufmaß ist fertig. Schick ' + esc(dat) + ' jetzt den Aufmaß-Code, am einfachsten per WhatsApp. Erst damit hat ' + esc(nom) + ' deine Maße und Wünsche.</p></div>' +
    '<div class="card send-card" style="gap: 12px"><p class="eyebrow">Senden</p><div class="pill-row send-row"><a class="btn primary" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp senden</a><a class="btn ghost" href="' + mail + '">Per E-Mail senden</a></div>' +
    '<textarea class="copybox" id="code-box" readonly rows="3" aria-label="Aufmaß-Code">' + esc(code) + '</textarea><div class="pill-row"><button type="button" class="pill" data-act="copyblatt">Code kopieren</button></div>' +
    '<p class="sub">Pilotphase: Klopfan überträgt dein Aufmaß noch nicht von selbst. Der Code enthält alle Maße, deine Wünsche und die Auswertung der Fotos, die Fotos selbst nicht.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(bn || 'deinem Fensterbauer') + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard();
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home' } };
};
/* Datei: in der Pilotphase kostenlos und ohne Konto */
const dateiCardOrig = dateiCard;
dateiCard = function () {
  if (!PILOT) return dateiCardOrig();
  const n = S.windows.length;
  return '<div class="card datei-card bought"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Für dich · in der Pilotphase kostenlos</p><b>Dein Aufmaßblatt als PDF</b><small>' + n + ' Fenster, alle Maße und Angaben, für deine Unterlagen.</small></div></div><button type="button" class="btn primary" style="flex: 0 0 auto" data-act="k-dl">Herunterladen</button></div>';
};
const dateiScreenOrig = SCREENS.datei;
SCREENS.datei = () => {
  const v = dateiScreenOrig();
  if (!PILOT) return v;
  v.html = v.html.replace('Dauerhaft in deinem Klopfan-Konto', 'Sofort als PDF auf deinem Gerät')
    .replace('<b>' + euro(DATEI_PREIS) + '</b><small>einmalig, inkl. MwSt.</small>', '<b>0,00 €</b><small>in der Pilotphase kostenlos, später ' + euro(DATEI_PREIS) + '</small>');
  v.bar = { label: 'Kostenlos herunterladen', act: 'k-dl' };
  return v;
};

boot();


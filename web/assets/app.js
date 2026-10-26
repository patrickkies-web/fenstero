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
  if (form === 'trapez') return LZ([x, y + h], [x, y + h * 0.3], [x + w * 0.25, y], [x + w * 0.75, y], [x + w, y + h * 0.3], [x + w, y + h]);
  if (form === 'dreieck') return LZ([x, y + h], [x, y + h * 0.88], [x + w / 2, y], [x + w, y + h * 0.88], [x + w, y + h]);
  if (form === 'rund') return C(x + w / 2, y + h / 2, Math.min(w, h) / 2);
  return R(x, y, w, h, 1.5);
}
function shapeIco(form, x, y, w, h) {
  return [P(shp(form, x, y, w, h), FR, INK, 1.4), P(shp(form, x + 3.2, y + 3.2, w - 6.4, h - 6.4), GL, INK, 0.8)];
}
/* Fenster als Pfadliste – für Karten, Projektliste und Aufmaßblatt */
function winIco(c, bx, by, bw, bh, fc) {
  if (c.form && c.form !== 'rechteck') return shapeIco(c.form, bx, by, bw, bh);
  fc = fc || FR; const o = [], da = c.richtung === 'aussen' ? '3 2' : undefined, art = c.art || 'fenster', tuer = art === 'hst' || art === 'fsw' || art === 'balkon' || art === 'psk';
  o.push(P(R(bx, by, bw, bh, 1.2), fc, INK, 1.3));
  const f = Math.max(2, bw * 0.06); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
  if (c.ol) { const oh = ih * 0.27; o.push(P(R(ix, iy, iw, oh), GL, INK, 0.7)); o.push(...sym(ix, iy, iw, oh, c.olT || 'K', 'L', da, INK, 0.7)); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
  /* Unterlicht: festes Feld unten, Glas oder Paneel */
  if (c.ul && art === 'fenster') { const uh = Math.min(ih * 0.5, Math.max(ih * 0.18, ih * (num(c.ulH) || 400) / ((num(c.el && c.el.h) || num(c.h) || 1400)))); o.push(P(R(ix, iy + ih - uh, iw, uh), c.ulA === 'paneel' ? '#c9c9c6' : GL, INK, 0.7)); ih -= uh + f * 0.7; }
  const n = c.sashes.length, gap = c.teilung === '2s' ? f * 0.25 : f * 0.8, frei = iw - gap * (n - 1), nSt = c.sashes.filter((x) => x.st).length;
  /* Aufteilung (c.anteile): Breiten nach Prozent, sonst gleich */
  const ant = !nSt && window.AW && AW.anteileGueltig(c, n) ? c.anteile : null, SW = c.sashes.map((x, i) => (ant ? frei * ant[i] / 100 : frei / n)), SX = []; SW.reduce((a, b, i) => { SX[i] = a; return a + b + gap; }, ix);
  c.sashes.forEach((s, i) => {
    const sw = SW[i], sx = SX[i], fest = s.t === 'F' || art === 'fest', g = fest ? 0 : Math.max(1.5, sw * 0.09);
    if (!fest) o.push(P(R(sx, iy, sw, ih), fc, INK, 0.8));
    const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
    o.push(P(R(gx, gy, gw, gh), GL, INK, 0.6));
    (c.bars || []).filter((b) => b.s === i).forEach((b) => o.push(P(b.d === 'v' ? L([gx + gw * b.p, gy], [gx + gw * b.p, gy + gh]) : L([gx, gy + gh * b.p], [gx + gw, gy + gh * b.p]), 'none', INK, 1)));
    if (s.t === 'S' || s.t === 'PS') { const d = s.din === 'L' ? 1 : -1, cx = gx + gw / 2, cy = gy + gh * 0.62; o.push(P(L([cx - d * gw * 0.25, cy], [cx + d * gw * 0.25, cy]), 'none', INK, 1.1), P(L([cx + d * gw * 0.25 - d * 2, cy - 2], [cx + d * gw * 0.25, cy], [cx + d * gw * 0.25 - d * 2, cy + 2]), 'none', INK, 1.1), P(R(s.din === 'L' ? gx + 1 : gx + gw - 2.6, gy + gh * 0.38, 1.6, gh * 0.24, 0.8), INK)); if (s.t === 'PS') o.push(...sym(gx, gy, gw, gh, 'K', s.din, da, INK, 0.75)); }
    else if (s.t === 'P') o.push(...sym(gx, gy, gw, gh, 'D', s.din, da, INK, 0.75));
    else if (s.t !== 'X') o.push(...sym(gx, gy, gw, gh, s.t, s.din, da, INK, 0.75));
  });
  if (tuer) o.push(P(R(bx - 1, by + bh - 0.5, bw + 2, 1.6), WALL, INK, 0.5));
  return o;
}
/* ---------- Icon-Bibliothek (64 × 64) ---------- */
const ICO = {
  typ: (t) => winIco({ teilung: '1', sashes: [{ t: t, din: 'L' }] }, 14, 8, 36, 48),
  layout: (k) => winIco({ teilung: k, sashes: k === '4' ? sashesFor('4') : k === '1' ? [{ t: 'DK', din: 'L' }] : k === '3' ? [{ t: 'DK', din: 'L' }, { t: 'F' }, { t: 'DK', din: 'R' }] : k === '2s' ? [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }] : [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }] }, k === '3' ? 4 : 8, 10, k === '3' ? 56 : 48, 44),
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
    /* Kunststoff mit Aluminium-Schale außen (links) */
    if (m === 'kunststoffalu') return [P(R(22, 10, 26, 44, 4), FR, INK, 1.3), P(R(26, 15, 8, 15, 1.5), 'none', MUT, 0.9), P(R(37, 15, 7, 15, 1.5), 'none', MUT, 0.9), P(R(26, 34, 18, 14, 1.5), 'none', MUT, 0.9), P(R(13, 8, 9, 48, 2), '#c8cdd2', INK, 1.3)];
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
  felder: (k) => { const n = k === '2p' ? 2 : num(k); return winIco({ teilung: k, art: 'fest', sashes: festFelder(n) }, n > 2 ? 4 : 8, 10, n > 2 ? 56 : 48, 44); },
  hgriff: (k) => {
    const o = [P(R(27, 4, 10, 56, 4), FR, INK, 1.3), P(R(30, 14, 4, 36, 2), '#e6e6e4', INK, 0.6)];
    if (k === 'abschliessbar') o.push(P(C(32, 9, 2.6), INK), P(L([32, 9], [32, 13]), 'none', INK, 1.4));
    if (k === 'motor') o.push(P(LZ([45, 22], [39, 34], [44, 34], [41, 44], [49, 30], [44, 30]), '#5b9bd5', INK, 0.8));
    return o;
  },
  /* Elementart: Fenster, Festverglasung, Hebe-Schiebe-Tür, Faltschiebewand */
  art: (k) => {
    if (k === 'fest') return [P(R(8, 8, 48, 48, 1.5), FR, INK, 1.4), P(R(11, 11, 20.5, 42), GL, INK, 0.7), P(R(32.5, 11, 20.5, 42), GL, INK, 0.7)];
    if (k === 'hst') return [P(R(6, 6, 52, 52, 1.5), FR, INK, 1.4), P(R(9, 9, 23, 46), GL, INK, 0.7), P(R(30, 7.5, 26, 49), FR, INK, 1.1), P(R(32.5, 10, 21, 44), GL, INK, 0.7), P(R(33.5, 24, 2.4, 16, 1), INK), P(L([22, 32], [12, 32]), 'none', INK, 1.6), P(L([15, 29], [12, 32], [15, 35]), 'none', INK, 1.6), P(R(4, 58, 56, 2.5), WALL, INK, 0.6)];
    if (k === 'fsw') { const o = [P(R(6, 6, 52, 52, 1.5), FR, INK, 1.4)]; [9, 21, 33, 45].forEach((x, i) => { o.push(P(R(x, 9, 10, 46), GL, INK, 0.7)); if (i) o.push(P(L([x, 9], [x, 55]), 'none', INK, 1.4)); }); o.push(P(R(53.5, 24, 2, 14, 1), INK), P(R(4, 58, 56, 2.5), WALL, INK, 0.6)); return o; }
    /* Balkon- oder Terrassentür: ein Dreh-Kipp-Flügel bis zum Boden */
    if (k === 'balkon') return winIco({ art: 'balkon', teilung: '1', sashes: [{ t: 'DK', din: 'L' }] }, 19, 4, 26, 54);
    /* PSK: der Flügel kippt oder schiebt sich parallel vor das Festteil, beide in einer Ebene */
    if (k === 'psk') return ICO.psk('A');
    return winIco({ teilung: '2p', sashes: [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }] }, 10, 8, 44, 48);
  },
  psk: (k) => {
    const o = [P(R(3, 6, 58, 52, 1.5), FR, INK, 1.3)], pf = (x, w) => o.push(P(R(x, 9, w, 46), GL, INK, 0.6));
    const sf = (x, w) => { o.push(P(R(x, 8.5, w, 47), FR, INK, 1.1), P(R(x + 2.5, 11, w - 5, 42), GL, INK, 0.6), P(L([x + 2.5, 53], [x + w / 2, 11], [x + w - 2.5, 53]), 'none', INK, 0.7, '2 1.6'), P(R(x + w - 5, 25, 2, 14, 1), INK)); const a = x + w / 2; o.push(P(L([a + 6, 40], [a - 6, 40]), 'none', INK, 1.5), P(L([a - 3, 37], [a - 6, 40], [a - 3, 43]), 'none', INK, 1.5)); };
    if (k === 'A3') { pf(6, 16); pf(24, 16); sf(42, 16); } else if (k === 'C') { pf(5, 12); sf(18, 13); sf(33, 13); pf(47, 12); } else { pf(6, 25); sf(33, 25); }
    o.push(P(R(1, 58, 62, 2.5), WALL, INK, 0.6));
    return o;
  },
  /* Absturzsicherung: Balkon davor, Geländer außen, Glas in der Laibung, unteres Feld fest */
  absturz: (k) => {
    const o = [P(R(16, 4, 28, 50, 1.2), FR, INK, 1.2)];
    if (k === 'fest') { o.push(P(R(19, 7, 22, 26), GL, INK, 0.6), ...sym(19, 7, 22, 26, 'DK', 'L', undefined, INK, 0.6), P(L([16, 35.5], [44, 35.5]), 'none', INK, 1.2), P(R(19, 38, 22, 13), GL, INK, 0.6), P(L([21, 49], [27, 40]) + L([27, 49], [33, 40]) + L([33, 49], [39, 40]), 'none', '#4f7fae', 0.8)); }
    else o.push(P(R(19, 7, 22, 44), GL, INK, 0.6));
    if (k === 'balkon') o.push(P(R(2, 54, 60, 4), WALL, INK, 0.7), P(L([50, 54], [50, 42]) + L([58, 54], [58, 42]) + L([48, 42], [60, 42]), 'none', INK, 1.3));
    else o.push(P(R(4, 54, 56, 3), WALL, INK, 0.6));
    if (k === 'gelaender') { let r = ''; for (let x = 18; x <= 42; x += 4) r += L([x, 34], [x, 53]); o.push(P(r, 'none', INK, 0.9), P(L([14, 34], [46, 34]), 'none', INK, 1.8)); }
    if (k === 'glas') o.push(P(R(17, 33, 26, 20, 0.6), '#cfe2f4', '#4f7fae', 1, undefined, 0.9), P(L([16, 33], [44, 33]), 'none', INK, 1.6));
    return o;
  },
  situation: (k) => {
    if (k === 'neu') return [P(R(6, 6, 52, 52, 2), WALL, INK, 0.8), P(R(17, 15, 30, 36, 1.5), 'none', '#5b9bd5', 1.6, '3 2.5'), P(L([32, 26], [32, 40]), 'none', '#5b9bd5', 1.8), P(L([25, 33], [39, 33]), 'none', '#5b9bd5', 1.8)];
    return winIco({ teilung: '1', sashes: [{ t: 'DK', din: 'L' }] }, 14, 8, 36, 48).concat([P(L([45, 12], [53, 12], [53, 22]), 'none', '#5b9bd5', 1.6), P(L([53, 12], [41, 24]), 'none', '#5b9bd5', 1.6)]);
  },
  ul: (k) => {
    const o = [P(R(12, 4, 40, 56, 1.5), FR, INK, 1.3), P(R(15.5, 7.5, 33, 30), FR, INK, 0.8), P(R(18, 10, 28, 25), GL, INK, 0.6)].concat(sym(18, 10, 28, 25, 'DK', 'L', undefined, INK, 0.7));
    if (k === 'glas') o.push(P(R(15.5, 40.5, 33, 16), GL, INK, 0.7));
    else if (k === 'paneel') o.push(P(R(15.5, 40.5, 33, 16), '#c9c9c6', INK, 0.7), P(L([19, 44], [45, 44]), 'none', MUT, 0.6), P(L([19, 48.5], [45, 48.5]), 'none', MUT, 0.6), P(L([19, 53], [45, 53]), 'none', MUT, 0.6));
    else { o.length = 0; o.push(P(R(12, 4, 40, 56, 1.5), FR, INK, 1.3), P(R(15.5, 7.5, 33, 49), GL, INK, 0.7)); o.push(...sym(15.5, 7.5, 33, 49, 'DK', 'L', undefined, INK, 0.7)); }
    return o;
  },
  hst: (k) => {
    const o = [P(R(3, 6, 58, 52, 1.5), FR, INK, 1.3)], pf = (x, w) => o.push(P(R(x, 9, w, 46), GL, INK, 0.6)), sf = (x, w, dir) => { o.push(P(R(x - 1, 7.5, w + 2, 49), FR, INK, 1.1), P(R(x + 1.5, 10, w - 3, 44), GL, INK, 0.6), P(R(dir === 'L' ? x + 2.5 : x + w - 4.5, 25, 2, 14, 1), INK)); const ax = dir === 'L' ? [x + w / 2 + 6, x + w / 2 - 6] : [x + w / 2 - 6, x + w / 2 + 6]; o.push(P(L([ax[0], 40], [ax[1], 40]), 'none', INK, 1.5), P(L([ax[1] + (dir === 'L' ? 3 : -3), 37], [ax[1], 40], [ax[1] + (dir === 'L' ? 3 : -3), 43]), 'none', INK, 1.5)); };
    if (k === 'C') { pf(6, 12); sf(19, 12, 'L'); sf(33, 12, 'R'); pf(46, 12); }
    else if (k === 'D') { sf(6, 25, 'R'); sf(33, 25, 'L'); }
    else if (k === 'A3') { pf(6, 16); pf(24, 16); sf(42, 16, 'L'); }
    else { pf(6, 25); sf(33, 25, 'L'); }
    o.push(P(R(1, 58, 62, 2.5), WALL, INK, 0.6));
    return o;
  },
  fsw: (n) => {
    n = Math.max(2, Math.min(7, num(n) || 3));
    const o = [P(R(3, 6, 58, 52, 1.5), FR, INK, 1.3)], w = 52 / n;
    for (let i = 0; i < n; i++) { const x = 6 + i * w; o.push(P(R(x + 0.8, 9, w - 1.6, 46), GL, INK, 0.6)); if (i) o.push(P(L([x, 8], [x, 56]), 'none', INK, 1.2)); }
    o.push(P(R(1, 58, 62, 2.5), WALL, INK, 0.6));
    return o;
  },
  schwelle: (k) => {
    const o = [P(R(4, 40, 56, 16), WALL, INK, 0.8), P(R(24, 8, 16, 32), FR, INK, 1.1), P(R(26.5, 10.5, 11, 27), GL, INK, 0.6)];
    if (k === 'flach') o.push(P(R(20, 37, 24, 3, 1), '#8e9398', INK, 0.6));
    else if (k === 'standard') o.push(P(R(20, 33, 24, 7, 1), '#8e9398', INK, 0.6), P(L([44, 33], [44, 40]), 'none', INK, 0.8));
    else o.push(P(L([4, 40], [60, 40]), 'none', '#5b9bd5', 1.6), P(R(44, 41, 10, 4, 1), '#8e9398', INK, 0.6));
    return o;
  },
  sonne: (k) => {
    const o = [P(R(14, 2, 36, 10), WALL, INK, 0.8), P(R(14, 54, 36, 8), WALL, INK, 0.8), P(R(22, 12, 20, 42), FR, INK, 1.1), P(R(24.5, 14.5, 15, 37), GL, INK, 0.6)];
    if (k === 'keiner') return o;
    if (k === 'behalten') { o.push(P(R(14, 2, 36, 16), WALL, INK, 0.8), P(R(20, 5, 24, 9, 2), FR, INK, 1, '2 1.5')); return o; }
    if (k === 'klappladen') { [[4, 17], [43, 17]].forEach(([x]) => { o.push(P(R(x, 12, 17, 42, 1), '#3f6b52', INK, 1)); for (let y = 16; y < 52; y += 3.4) o.push(P(L([x + 2.5, y], [x + 14.5, y + 1.2]), 'none', '#c9d8cd', 1)); }); return o; }
    o.push(P(R(18, 10, 28, 7, 1.5), FR, INK, 1.1));
    if (k === 'rollladen') { for (let y = 19; y < 36; y += 3) o.push(P(R(20, y, 24, 2.6, 0.6), '#b9bdc2', INK, 0.4)); }
    if (k === 'raffstore') { for (let y = 19; y < 38; y += 4.2) o.push(P(L([20, y + 2], [44, y]), 'none', '#6d7378', 2.2)); o.push(P(L([21, 17], [21, 54]), 'none', MUT, 0.6), P(L([43, 17], [43, 54]), 'none', MUT, 0.6)); }
    if (k === 'screen') { let m = ''; for (let x = 21; x <= 43; x += 2.4) m += L([x, 17], [x, 38]); for (let y = 19; y <= 38; y += 2.4) m += L([20, y], [44, y]); o.push(P(R(20, 17, 24, 21), '#d8d4cc', INK, 0.5, undefined, 0.95), P(m, 'none', MUT, 0.35), P(R(19, 37, 26, 2.2, 0.8), '#8e9398', INK, 0.5)); }
    return o;
  },
  innen: (k) => {
    const o = [P(R(10, 4, 44, 56, 1.5), FR, INK, 1.2), P(R(13.5, 7.5, 37, 49), GL, INK, 0.6)];
    if (k === 'keiner') return o;
    if (k === 'rollo') { o.push(P(R(12, 6, 40, 5, 2.5), '#8e9398', INK, 0.6), P(R(14, 10, 36, 24), '#efe9dc', INK, 0.7), P(R(13, 33, 38, 2.4, 1.2), '#8e9398', INK, 0.5), P(L([32, 35.4], [32, 40]), 'none', INK, 0.8)); }
    if (k === 'plissee') { let z = 'M14 10'; for (let y = 10; y <= 36; y += 3.2) z += 'L' + (((y - 10) / 3.2) % 2 ? 50 : 48) + ' ' + y + 'L14 ' + (y + 1.6); o.push(P(R(14, 10, 36, 28), '#efe9dc', INK, 0.6)); for (let y = 13.2; y < 38; y += 3.2) o.push(P(L([14, y], [50, y]), 'none', MUT, 0.5)); o.push(P(R(13, 37, 38, 2.4, 1.2), '#8e9398', INK, 0.5)); }
    if (k === 'jalousie') { for (let y = 10; y < 40; y += 3.6) o.push(P(L([14, y + 1.2], [50, y]), 'none', '#9aa0a5', 2)); o.push(P(R(12, 6, 40, 4, 2), '#8e9398', INK, 0.6), P(L([22, 10], [22, 40]), 'none', MUT, 0.4), P(L([42, 10], [42, 40]), 'none', MUT, 0.4)); }
    return o;
  },
  roll: (k) => {
    const o = [P(R(14, 2, 36, 10), WALL, INK, 0.8), P(R(14, 54, 36, 8), WALL, INK, 0.8)];
    if (k === 'aufsatz') o.push(P(R(24, 12, 16, 11, 2), FR, INK, 1.2), P(R(28, 23, 8, 31), FR, INK, 1.1));
    else if (k === 'vorbau') o.push(P(R(28, 12, 8, 42), FR, INK, 1.1), P(R(50, 12, 11, 12, 2), FR, INK, 1.2), P(L([55.5, 24], [55.5, 34]), 'none', INK, 1, '2 2'));
    else if (k === 'behalten') o.push(P(R(14, 2, 36, 18), WALL, INK, 0.8), P(R(26, 6, 16, 11, 2), FR, INK, 1, '2 1.5'), P(R(28, 20, 8, 34), FR, INK, 1.1));
    else if (k === 'unterputz') o.push(P(R(14, 2, 36, 18), WALL, INK, 0.8), P(R(24, 5, 16, 11, 2), 'none', INK, 1, '2 1.5'), P(R(28, 20, 8, 34), FR, INK, 1.1));
    else o.push(P(R(28, 12, 8, 42), FR, INK, 1.1));
    o.push(P(L([32, k === 'aufsatz' ? 25 : k === 'behalten' || k === 'unterputz' ? 22 : 14], [32, 52]), 'none', '#5b9bd5', 1.6));
    return o;
  },
  einbau: (k) => ICO.roll(k),
  insekt: (k) => {
    const o = [P(R(12, 6, 40, 52, 2), FR, INK, 1.3)];
    if (k === 'keiner') { o.push(P(R(17, 11, 30, 42), GL, INK, 0.7)); return o; }
    let mesh = '';
    for (let x = 20; x < 47; x += 4) mesh += L([x, 11], [x, 53]);
    for (let y = 14; y < 53; y += 4) mesh += L([17, y], [47, y]);
    o.push(P(R(17, 11, 30, 42), '#eef1f4', INK, 0.7));
    if (k === 'plissee') { let z = 'M17 11'; for (let y = 11; y <= 53; y += 3) z += 'L' + (y % 6 === 5 ? 21 : 17) + ' ' + y; o.push(P(z, 'none', INK, 0.9), P(L([22, 11], [22, 53]), 'none', INK, 1.4)); }
    else if (k === 'rollo') { o.push(P(R(15, 7, 34, 6, 2), FR, INK, 1.1)); let m2 = ''; for (let x = 20; x < 47; x += 4) m2 += L([x, 13], [x, 36]); for (let y = 16; y < 36; y += 4) m2 += L([17, y], [47, y]); o.push(P(m2, 'none', MUT, 0.5), P(L([17, 36], [47, 36]), 'none', INK, 1.4)); }
    else if (k === 'schiebe') { o.push(P(mesh, 'none', MUT, 0.5), P(L([29, 32], [39, 32]), 'none', INK, 1.4), P(L([36, 29], [39, 32], [36, 35]), 'none', INK, 1.4)); }
    else o.push(P(mesh, 'none', MUT, 0.5));
    if (k === 'pendel') o.push(P('M12 58A40 40 0 0 1 12 18', 'none', MUT, 1, '2 2'), P('M52 58A40 40 0 0 0 52 18', 'none', MUT, 1, '2 2'));
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
/* Rahmenfarben (S2): alle RAL-Classic-Töne, Holzdekore und Sonderfarben aus ral.js ({ k, name, code, label, bg, solid, holz, familie }).
   Die Schlüssel der ersten Fassung ('9016', '7016', 'goak' …) bleiben gültig; die fünfzehn von damals nur noch als Rückfall ohne ral.js. */
const COLORS = window.RAL ? window.RAL.liste.map((e) => ({ k: e.key, name: e.name, code: e.code, label: e.label, bg: e.bg, solid: e.hex, holz: e.holz, familie: e.familie })) : [
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
  { k: 'goak', name: 'Golden Oak', code: 'Holzdekor', bg: WOOD('#b5732f', '#c4843c', '#a5652a', '#bd7b35'), solid: '#b5732f', holz: true },
  { k: 'nuss', name: 'Nussbaum', code: 'Holzdekor', bg: WOOD('#6b4428', '#7a5032', '#5a3820', '#70482b'), solid: '#6b4428', holz: true },
  { k: 'eiche', name: 'Eiche hell', code: 'Holzdekor', bg: WOOD('#c9a46b', '#d6b47c', '#b8935c', '#cfae73'), solid: '#c9a46b', holz: true },
  { k: 'mahag', name: 'Mahagoni', code: 'Holzdekor', bg: WOOD('#6f2f22', '#7e3a2b', '#5f261b', '#763427'), solid: '#6f2f22', holz: true }
];
const FARBE_K = {};
COLORS.forEach((c) => { FARBE_K[c.k] = c; });
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
  form: [{ k: 'rechteck', label: 'Rechteck', sub: 'der Standard' }, { k: 'rundbogen', label: 'Rundbogen', sub: 'Halbkreis oben' }, { k: 'segment', label: 'Segmentbogen', sub: 'flacher Bogen oben' }, { k: 'schraeg', label: 'Schräg', sub: 'eine Seite höher' }, { k: 'rund', label: 'Rund', sub: 'fest verglast, ohne Flügel' }, { k: 'trapez', label: 'Trapez', sub: 'beide Ecken schräg' }, { k: 'dreieck', label: 'Dreieck', sub: 'Giebel, fest verglast' }],
  teilung: [{ k: '1', label: '1 Flügel', sub: 'einteilig' }, { k: '2p', label: '2 Flügel', sub: 'mit Pfosten', g: 'pfosten' }, { k: '2s', label: '2 Flügel', sub: 'Stulp, ohne Pfosten', g: 'stulp' }, { k: '3', label: '3 Flügel', sub: 'Mitte fest' }, { k: '4', label: '4 Flügel', sub: 'Mitte fest' }],
  typ: [{ k: 'F', label: 'Fest', g: 'fest' }, { k: 'D', label: 'Dreh', g: 'symbol' }, { k: 'K', label: 'Kipp', g: 'kipp' }, { k: 'DK', label: 'Dreh-Kipp', g: 'dk' }],
  din: [{ k: 'L', label: 'DIN links' }, { k: 'R', label: 'DIN rechts' }],
  olT: [{ k: 'F', label: 'Oberlicht fest' }, { k: 'K', label: 'Oberlicht kippbar' }],
  richtung: [{ k: 'innen', label: 'Nach innen (Standard)' }, { k: 'aussen', label: 'Nach außen' }],
  /* Unterzeilen höchstens 14 Zeichen: fünf Karten stehen in einer Reihe zum Wischen */
  material: [{ k: 'kunststoff', label: 'Kunststoff', sub: 'Pflegeleicht', price: '€' }, { k: 'kunststoffalu', label: 'Kunststoff-Alu', sub: 'Außen Alu', price: '€€' }, { k: 'holz', label: 'Holz', sub: 'Braucht Pflege', price: '€€' }, { k: 'holzalu', label: 'Holz-Alu', sub: 'Innen Holz', price: '€€€' }, { k: 'alu', label: 'Aluminium', sub: 'Sehr schlank', price: '€€€' }],
  preset: [{ k: 'keine', label: 'Keine' }, { k: 'kreuz', label: 'Kreuz' }, { k: 'sechs', label: '6 Felder' }, { k: 'quer', label: 'Oben quer' }, { k: 'senk', label: 'Dreiteilig' }],
  spross: [{ k: 'wiener', label: 'Wiener Sprosse', sub: 'Wirkt echt, gut gedämmt', g: 'wiener' }, { k: 'szr', label: 'Innenliegend', sub: 'Zwischen den Scheiben', g: 'szr' }, { k: 'auf', label: 'Aufgesetzt', sub: 'Aufgeklebt, günstig', g: 'auf' }, { k: 'echt', label: 'Glasteilend', sub: 'Jedes Feld eigenes Glas', g: 'echt' }],
  breite: [{ k: 18, label: '18 mm, fein' }, { k: 26, label: '26 mm' }, { k: 45, label: '45 mm, kräftig' }],
  aufseite: [{ k: 'beide', label: 'Innen und außen' }, { k: 'aussen', label: 'Nur außen' }, { k: 'innen', label: 'Nur innen' }],
  glas: [{ k: '2', label: '2-fach', sub: 'Ug ≈ 1,1' }, { k: '3', label: '3-fach', sub: 'Ug ≈ 0,5 bis 0,7' }],
  glasfn: [{ k: 'schall', label: 'Schallschutz', g: 'schall', ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2L11 18V6L7.2 9.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14.6 9.6a3.4 3.4 0 0 1 0 4.8M17.2 7a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
    { k: 'vsg', label: 'Sicherheitsglas', g: 'vsg', ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l7 2.8v5.2c0 4.3-2.9 7.6-7 9.6-4.1-2-7-5.3-7-9.6V6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12.2l2.1 2.1 4-4.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { k: 'sicht', label: 'Sichtschutz', g: 'ornament', ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-5.8 9.5-5.8 9.5 5.8 9.5 5.8-3.4 5.8-9.5 5.8S2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 4.5l15 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
    { k: 'sonne', label: 'Sonnenschutz', ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
    /* Nur bei „Alles im Detail“ (oder wenn schon gewählt) */
    { k: 'extraklar', label: 'Weißglas', g: 'glasarten', detail: true, ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 10l2.4-2.4M9 14.4l5.6-5.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' },
    { k: 'vogel', label: 'Vogelschutz', g: 'glasarten', detail: true, ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12.5c2.6.2 4.6-.9 6-3.2.8 2.2 2.4 3.4 4.8 3.6l5.2-2.2-2.6 3.1c-.8 3.2-3.4 5-6.8 5H7.6l2-2.3c-2.6-.2-4.6-1.5-6.1-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="15.4" cy="10.6" r="1" fill="currentColor"/></svg>' },
    { k: 'selbstr', label: 'Selbstreinigend', g: 'glasarten', detail: true, ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8c2.8 3.6 4.6 6.2 4.6 8.6a4.6 4.6 0 0 1-9.2 0c0-2.4 1.8-5 4.6-8.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 13.4a2 2 0 0 0 2 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' }],
  griff: [{ k: 'standard', label: 'Standard' }, { k: 'abschliessbar', label: 'Abschließbar' }, { k: 'druckknopf', label: 'Druckknopf' }, { k: 'ohne', label: 'Ohne Griff', sub: 'verdeckt oder elektrisch' }],
  hstGriff: [{ k: 'standard', label: 'Hebegriff' }, { k: 'abschliessbar', label: 'Abschließbar' }, { k: 'motor', label: 'Elektrisch', sub: 'per Taster oder App' }],
  /* Griff-Farben: was es an Fenstergriffen wirklich gibt (Oberflächen der Hersteller), alles andere als Wunsch */
  gf: [{ k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'silber', label: 'Silber', bg: '#c9ccd0' }, { k: 'edelstahl', label: 'Edelstahl', bg: 'linear-gradient(135deg, #eceef0, #a7abb0)' }, { k: 'titan', label: 'Titan', bg: '#8b8d8f' }, { k: 'schwarz', label: 'Schwarz', bg: '#1d1d1f' },
    { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'braun', label: 'Braun', bg: '#4a3526' }, { k: 'bronze', label: 'Bronze', bg: 'linear-gradient(135deg, #a88560, #6e5034)' }, { k: 'messing', label: 'Messing', bg: 'linear-gradient(135deg, #e3d39b, #a8904f)' }],
  rc: [{ k: 'basis', label: 'Basisschutz' }, { k: 'rc1', label: 'RC1 N' }, { k: 'rc2n', label: 'RC2 N' }, { k: 'rc2', label: 'RC2' }, { k: 'rc3', label: 'RC3' }],
  erreichbar: [{ k: 'ja', label: 'Ja, leicht' }, { k: 'nein', label: 'Nein' }],
  absturz: [{ k: 'balkon', label: 'Balkon davor', sub: 'dann keine nötig' }, { k: 'gelaender', label: 'Geländer außen', sub: 'französischer Balkon' }, { k: 'glas', label: 'Glasbrüstung', sub: 'Glas in der Laibung' }, { k: 'fest', label: 'Unten fest', sub: 'Sicherheitsglas' }],
  absturzTuer: [{ k: 'balkon', label: 'Ja, Balkon', sub: 'oder Terrasse davor' }, { k: 'gelaender', label: 'Nein, Geländer', sub: 'französischer Balkon' }, { k: 'glas', label: 'Nein, Glas', sub: 'Glasbrüstung davor' }],
  griffA: [{ k: 'keiner', label: 'Kein Griff außen' }, { k: 'ziehgriff', label: 'Ziehgriff mit Schnäpper' }, { k: 'abschliessbar', label: 'Abschließbar, mit Schlüssel' }],
  boden: [{ k: 'bleibt', label: 'Bleibt, wie er ist' }, { k: 'neu', label: 'Wird erneuert' }],
  pskSchema: [{ k: 'A', label: '2-teilig', sub: '1 schiebt vor 1 festem' }, { k: 'A3', label: '3-teilig', sub: '1 schiebt vor 2 festen' }, { k: 'C', label: '4-teilig', sub: '2 schieben mittig' }],
  foerdweg: [{ k: 'bafa', label: 'BAFA-Zuschuss' }, { k: 'steuer', label: 'Steuerbonus' }, { k: 'keine', label: 'Keine' }, { k: 'offen', label: 'Noch offen' }],
  roll: [{ k: 'keiner', label: 'Keiner' }, { k: 'behalten', label: 'Bestehender', sub: 'bleibt drin' }, { k: 'aufsatz', label: 'Aufsatz', sub: 'neu, auf dem Fenster', g: 'aufsatz' }, { k: 'vorbau', label: 'Vorbau', sub: 'neu, außen davor', g: 'vorbau' }, { k: 'unterputz', label: 'Unterputz', sub: 'neu, in der Wand', g: 'unterputz' }],
  antrieb: [{ k: 'gurt', label: 'Gurt' }, { k: 'kurbel', label: 'Kurbel' }, { k: 'motor', label: 'Elektrisch' }, { k: 'smart', label: 'Smart Home' }, { k: 'solar', label: 'Solar' }],
  art: [{ k: 'fenster', label: 'Fenster', sub: 'Dreh, Kipp, fest' }, { k: 'balkon', label: 'Balkon- oder Terrassentür', sub: 'geht auf wie ein Fenster', g: 'balkon' }, { k: 'fest', label: 'Festverglasung', sub: 'großflächig, ohne Griff' }, { k: 'hst', label: 'Hebe-Schiebe-Tür', sub: 'bodentief, schiebt', g: 'hst' }, { k: 'psk', label: 'PSK-Tür', sub: 'schiebt und kippt, meist günstiger', g: 'psk' }, { k: 'fsw', label: 'Faltschiebewand', sub: 'ganz zu öffnen' }],
  situation: [{ k: 'ersatz', label: 'Fenster ersetzen', sub: 'Dort ist schon eins' }, { k: 'neu', label: 'Neue Öffnung', sub: 'Dort war noch keins' }],
  felder: [{ k: '1', label: '1 Feld' }, { k: '2p', label: '2 Felder' }, { k: '3', label: '3 Felder' }, { k: '4', label: '4 Felder' }],
  ul: [{ k: 'nein', label: 'Kein Unterlicht' }, { k: 'glas', label: 'Unterlicht aus Glas', sub: 'fest verglast' }, { k: 'paneel', label: 'Unterlicht als Paneel', sub: 'geschlossen, gedämmt' }],
  hstSchema: [{ k: 'A', label: 'Schema A', sub: '1 schiebt vor 1 festem' }, { k: 'A3', label: '3-teilig', sub: '1 schiebt vor 2 festen' }, { k: 'C', label: 'Schema C', sub: '2 schieben mittig' }, { k: 'D', label: 'Schema D', sub: '2 schieben, Mitte zu' }],
  hstRichtung: [{ k: 'L', label: 'Schiebeflügel links' }, { k: 'R', label: 'Schiebeflügel rechts' }],
  schwelle: [{ k: 'flach', label: 'Flache Schwelle', sub: 'ca. 20 mm' }, { k: 'null', label: 'Barrierefrei', sub: 'ohne Schwelle' }, { k: 'standard', label: 'Standard', sub: 'mit Anschlag' }],
  fswN: [{ k: '2', label: '2' }, { k: '3', label: '3' }, { k: '4', label: '4' }, { k: '5', label: '5' }, { k: '6', label: '6' }, { k: '7', label: '7' }],
  fswSchema: [{ k: 'links', label: 'Paket links' }, { k: 'rechts', label: 'Paket rechts' }, { k: 'geteilt', label: 'Beide Seiten' }],
  sart: [{ k: 'keiner', label: 'Keiner' }, { k: 'behalten', label: 'Bestehender', sub: 'bleibt dran' }, { k: 'rollladen', label: 'Rollladen', sub: 'dunkelt ab' }, { k: 'raffstore', label: 'Raffstore', sub: 'Lamellen, stellbar' }, { k: 'screen', label: 'Screen', sub: 'Textil, Durchblick' }, { k: 'klappladen', label: 'Klappläden', sub: 'an der Fassade', g: 'klappladen' }],
  einbau: [{ k: 'aufsatz', label: 'Aufsatz', sub: 'auf dem Element' }, { k: 'vorbau', label: 'Vorbau', sub: 'außen davor' }, { k: 'unterputz', label: 'Unterputz', sub: 'in der Wand', g: 'unterputz' }],
  sfarbe: [{ k: 'silber', label: 'Silber', bg: 'linear-gradient(180deg, #d9dde1, #aeb4ba)' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }, { k: 'hellgrau', label: 'Hellgrau', bg: '#cbd0cc' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'braun', label: 'Braun', bg: '#5a4030' }, { k: 'bronze', label: 'Bronze', bg: 'linear-gradient(180deg, #a07a52, #6e4f32)' }, { k: 'schwarz', label: 'Schwarz', bg: '#141516' }],
  iart: [{ k: 'keiner', label: 'Keiner' }, { k: 'rollo', label: 'Rollo', sub: 'Stoff, rollt auf' }, { k: 'plissee', label: 'Plissee', sub: 'gefaltet, schiebt' }, { k: 'jalousie', label: 'Jalousie', sub: 'Lamellen innen' }],
  ifarbe: [{ k: 'weiss', label: 'Weiß', bg: '#f4f2ec' }, { k: 'creme', label: 'Creme', bg: '#e8dcc4' }, { k: 'grau', label: 'Grau', bg: '#9ea3a6' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#3b4044' }, { k: 'blau', label: 'Blau', bg: '#3f5f86' }, { k: 'gruen', label: 'Salbei', bg: '#7f9a7c' }, { k: 'terra', label: 'Terracotta', bg: '#b56a48' }],
  insekt: [{ k: 'keiner', label: 'Keiner' }, { k: 'spann', label: 'Spannrahmen' }, { k: 'dreh', label: 'Drehrahmen' }, { k: 'plissee', label: 'Plissee' }, { k: 'rollo', label: 'Rollo', sub: 'rollt auf' }, { k: 'pendel', label: 'Pendeltür', sub: 'für Türen' }, { k: 'schiebe', label: 'Schiebeanlage', sub: 'für große Türen' }],
  fbi: [{ k: 'behalten', label: 'Behalten' }, { k: 'werzalit', label: 'Werzalit' }, { k: 'stein', label: 'Naturstein' }, { k: 'holz', label: 'Holz' }],
  fba: [{ k: 'behalten', label: 'Behalten' }, { k: 'alu', label: 'Aluminium' }, { k: 'stein', label: 'Naturstein' }],
  gebaeude: [{ k: 'efh', label: 'Einfamilienhaus' }, { k: 'dh', label: 'Doppelhaushälfte' }, { k: 'rh', label: 'Reihenhaus' }, { k: 'mfh', label: 'Mehrfamilienhaus' }, { k: 'etw', label: 'Eigentumswohnung' }, { k: 'denkmal', label: 'Denkmalschutz' }],
  zeit: [{ k: 'asap', label: 'So bald wie möglich' }, { k: '3m', label: 'In 1 bis 3 Monaten' }, { k: '6m', label: 'In 3 bis 6 Monaten' }, { k: '12m', label: 'Später, erst Angebote' }],
  budget: [{ k: 'b1', label: 'bis 5.000 €' }, { k: 'b2', label: '5.000 bis 10.000 €' }, { k: 'b3', label: '10.000 bis 20.000 €' }, { k: 'b4', label: 'über 20.000 €' }, { k: 'b0', label: 'Weiß ich noch nicht' }],
  erreich: [{ k: 'vm', label: 'Vormittags' }, { k: 'nm', label: 'Nachmittags' }, { k: 'ab', label: 'Abends' }],
  /* Detailangaben (Register AW.DETAIL in modell.js); k '' = nicht gewählt, der Standard des Fensterbauers */
  kvd: [{ k: '', label: 'Dreh-Kipp' }, { k: 'kvd', label: 'Kipp vor Dreh' }],
  seiten: [{ k: '', label: 'Ohne' }, { k: 'links', label: 'Links' }, { k: 'rechts', label: 'Rechts' }, { k: 'beide', label: 'Beide' }],
  paneel: [{ k: '', label: 'Ganz Glas' }, { k: 'paneel', label: 'Unten Paneel' }],
  hstEck: [{ k: '', label: 'Gerade' }, { k: 'eck', label: 'Über Eck' }],
  fswAuf: [{ k: 'innen', label: 'Nach innen' }, { k: 'aussen', label: 'Nach außen' }],
  holzart: [{ k: 'kiefer', label: 'Kiefer' }, { k: 'fichte', label: 'Fichte' }, { k: 'laerche', label: 'Lärche' }, { k: 'eiche', label: 'Eiche' }, { k: 'meranti', label: 'Meranti' }],
  oberfl: [{ k: 'glatt', label: 'Glatt' }, { k: 'matt', label: 'Matt' }, { k: 'struktur', label: 'Feinstruktur' }, { k: 'holz', label: 'Holzstruktur' }],
  profil: [{ k: 'kantig', label: 'Kantig' }, { k: 'softline', label: 'Gerundet' }, { k: 'stil', label: 'Stilprofil' }],
  schmal: [{ k: 'standard', label: 'Standard' }, { k: 'schmal', label: 'Schmal' }],
  dicht: [{ k: 'schwarz', label: 'Schwarz', bg: '#1d1d1f' }, { k: 'grau', label: 'Grau', bg: '#8b8f93' }, { k: 'beige', label: 'Beige', bg: '#c9b48f' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }],
  sichtZone: [{ k: '', label: 'Ganze Scheibe' }, { k: 'unten', label: 'Nur unten' }],
  ahFarbe: [{ k: 'schwarz', label: 'Schwarz', bg: '#1d1d1f' }, { k: 'grau', label: 'Grau', bg: '#6d7378' }, { k: 'silber', label: 'Silber', bg: 'linear-gradient(180deg, #e3e6e9, #a9afb5)' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }],
  sprFarbe: [{ k: '', label: 'Wie der Rahmen' }, { k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'messing', label: 'Messing', bg: 'linear-gradient(135deg, #e6cf8a, #a8863e)' }],
  griffM: [{ k: 'standard', label: 'Standard' }, { k: 'design', label: 'Design, flach' }, { k: 'stil', label: 'Stilgriff' }],
  griffPos: [{ k: '', label: 'Mittig' }, { k: 'tief', label: 'Tiefer' }, { k: 'hoch', label: 'Höher' }],
  kinder: [{ k: '', label: 'Ohne' }, { k: 'schloss', label: 'Abschließbar' }, { k: 'sperre', label: 'Nur kippen' }],
  stulpBed: [{ k: '', label: 'Stulphebel' }, { k: 'griff', label: 'Zweiter Griff' }],
  hstPlus: [{ k: 'muschel', label: 'Griffmuschel außen' }, { k: 'soft', label: 'Softclose' }],
  pskZwang: [{ k: '', label: 'Ohne' }, { k: 'zwang', label: 'Mit' }],
  baender: [{ k: 'sichtbar', label: 'Sichtbar' }, { k: 'verdeckt', label: 'Verdeckt' }],
  oeffner: [{ k: '', label: 'Ohne' }, { k: 'kette', label: 'Kettenantrieb' }, { k: 'verdeckt', label: 'Verdeckt' }],
  luefter: [{ k: '', label: 'Ohne' }, { k: 'falz', label: 'Falzlüfter' }, { k: 'schall', label: 'Schalldämmlüfter' }],
  kontakt: [{ k: '', label: 'Ohne' }, { k: 'oeffnung', label: 'Öffnungsmelder' }, { k: 'verschluss', label: 'Auch Verschluss' }],
  gitter: [{ k: '', label: 'Ohne' }, { k: 'stab', label: 'Stabgitter' }, { k: 'zier', label: 'Ziergitter' }],
  gelForm: [{ k: 'stab', label: 'Senkrechte Stäbe' }, { k: 'quer', label: 'Querstäbe' }, { k: 'lochblech', label: 'Lochblech' }, { k: 'glas', label: 'Glas' }],
  gelFarbe: [{ k: 'rahmen', label: 'Wie der Rahmen' }, { k: 'edelstahl', label: 'Edelstahl', bg: 'linear-gradient(135deg, #eceef0, #a7abb0)' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }],
  sfTeile: [{ k: '', label: 'Wie der Behang' }, { k: 'rahmen', label: 'Wie der Rahmen' }, { k: 'eigen', label: 'Eigene Farben' }],
  lamelle: [{ k: 'c80', label: 'C-Lamelle' }, { k: 'z90', label: 'Z-Lamelle' }, { k: 'flach', label: 'Flachlamelle' }],
  fuehrung: [{ k: 'schiene', label: 'Schienen' }, { k: 'seil', label: 'Seil' }],
  blende: [{ k: 'fassade', label: 'Wie die Fassade' }, { k: 'alu', label: 'Alu-Blende' }],
  panzer: [{ k: 'kunststoff', label: 'Kunststoff' }, { k: 'alu', label: 'Aluminium' }],
  schlitz: [{ k: 'ohne', label: 'Ohne' }, { k: 'mit', label: 'Mit Schlitzen' }],
  transp: [{ k: 'licht', label: 'Lichtdurchlässig' }, { k: 'mittel', label: 'Blendfrei' }, { k: 'dunkel', label: 'Verdunkelnd' }],
  klBauart: [{ k: 'lamellen', label: 'Lamellen' }, { k: 'fuellung', label: 'Füllung' }, { k: 'leisten', label: 'Brettleisten' }],
  klFarbe: [{ k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'gruen', label: 'Moosgrün', bg: '#1f4436' }, { k: 'braun', label: 'Braun', bg: '#5a4030' }, { k: 'holz', label: 'Holz natur', bg: 'linear-gradient(135deg, #c99a62, #8a5a2e)' }],
  bedien: [{ k: 'links', label: 'Links' }, { k: 'rechts', label: 'Rechts' }],
  sensor: [{ k: 'zeit', label: 'Zeitschaltuhr' }, { k: 'sonne', label: 'Sonnensensor' }, { k: 'wind', label: 'Windwächter' }, { k: 'funk', label: 'Handsender' }],
  insFarbe: [{ k: 'rahmen', label: 'Wie der Rahmen' }, { k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'braun', label: 'Braun', bg: '#5a4030' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }],
  insGewebe: [{ k: 'standard', label: 'Standard' }, { k: 'klar', label: 'Klarsicht' }, { k: 'pollen', label: 'Pollenschutz' }, { k: 'tier', label: 'Reißfest' }],
  fbiFarbe: [{ k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'marmor', label: 'Marmor hell', bg: 'linear-gradient(135deg, #f1efe9, #d9d4c8)' }, { k: 'granit', label: 'Granit dunkel', bg: '#4a4744' }, { k: 'holz', label: 'Holzdekor', bg: 'linear-gradient(135deg, #c99a62, #8a5a2e)' }],
  fbaFarbe: [{ k: 'silber', label: 'Silber', bg: 'linear-gradient(180deg, #d9dde1, #aeb4ba)' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'bronze', label: 'Bronze', bg: 'linear-gradient(180deg, #a07a52, #6e4f32)' }],
  fbaUeber: [{ k: '30', label: '30 mm' }, { k: '40', label: '40 mm' }, { k: '50', label: '50 mm' }, { k: '60', label: '60 mm' }],
  fbaKappe: [{ k: 'kunststoff', label: 'Kunststoff' }, { k: 'alu', label: 'Aluminium' }, { k: 'gleit', label: 'Gleitabschluss' }],
  leiste: [{ k: '', label: 'Ohne' }, { k: 'innen', label: 'Innen' }, { k: 'aussen', label: 'Außen' }, { k: 'beide', label: 'Beide' }],
  baujahr: [{ k: 'vor 1978', label: 'vor 1978' }, { k: '1978 bis 1995', label: '1978 bis 1995' }, { k: '1995 bis 2010', label: '1995 bis 2010' }, { k: 'nach 2010', label: 'nach 2010' }, { k: '', label: 'Weiß ich nicht' }]
};
const TYPNAME = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp', S: 'Schiebeflügel', X: 'Faltflügel', P: 'Gehflügel', PS: 'PSK-Flügel' };
/* ---------- Glossar ----------
   Je Eintrag: s (Name im Verzeichnis), t (Frage als Überschrift), x (Absätze, Du-Form), tipp (Praxis-Tipp), ico (Zeichnung), see (siehe auch),
   lottie (Bewegtbild statt Zeichnung). Die Gruppen des Verzeichnisses stehen in GLOSS_GRUPPEN, die Ratgeberseiten in GLOSS_RG. */
/* Zeichnungen fürs Glossar: Wand mit Öffnung und Fenster, eine Maßlinie (Orange die Öffnung, Blau das Element) */
const G_MO = '#d4502b', G_EL = '#5b9bd5';
function massIco(art) {
  const o = [P(R(4, 4, 56, 56, 2), WALL, INK, 0.8), P(R(14, 10, 36, 44), '#f5f5f7', INK, 0.8), P(R(17, 13, 30, 38, 1), FR, INK, 1.2), P(R(20, 16, 24, 32), GL, INK, 0.6)];
  const linie = (a, b, c, quer) => o.push(P(L(a, b), 'none', c, 2), P(quer === 'h' ? L([a[0], a[1] - 3], [a[0], a[1] + 3]) + L([b[0], b[1] - 3], [b[0], b[1] + 3]) : L([a[0] - 3, a[1]], [a[0] + 3, a[1]]) + L([b[0] - 3, b[1]], [b[0] + 3, b[1]]), 'none', c, 1.6));
  if (art === 'oh') linie([32, 10], [32, 54], G_MO);
  else if (art === 'eh') linie([32, 13], [32, 51], G_EL);
  else if (art === 'ob') linie([14, 32], [50, 32], G_MO, 'h');
  else if (art === 'eb') linie([17, 32], [47, 32], G_EL, 'h');
  else { linie([15.5, 10], [15.5, 54], G_MO); linie([48.5, 10], [48.5, 54], G_MO); linie([14, 11.5], [50, 11.5], G_MO, 'h'); linie([14, 52.5], [50, 52.5], G_MO, 'h'); }
  return o;
}
const hausIco = () => [P(LZ([6, 30], [32, 8], [58, 30]), '#efe9df', INK, 1.2), P(R(12, 28, 40, 30), FR, INK, 1.2), P(R(18, 36, 10, 10), GL, INK, 0.8), P(R(36, 40, 10, 18), '#d9d1c5', INK, 0.8)];
const kameraIco = () => [P('M10 22c0-2.2 1.8-4 4-4h7l3.5-6h15l3.5 6h7c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H14c-2.2 0-4-1.8-4-4z', FR, INK, 1.4), P(C(32, 33, 10), GL, INK, 1.2), P(C(32, 33, 4.5), '#c4d9eb', INK, 0.8)];
const schildIco = (k) => { const o = [P('M32 5l20 8v15c0 13-8 23-20 31C20 51 12 41 12 28V13z', FR, INK, 1.4)]; if (k === 'rc2') o.push(P(R(25, 28, 14, 12, 2), INK), P('M28 28v-4a4 4 0 0 1 8 0v4', 'none', INK, 1.8)); else if (k === 'rc1') o.push(P(L([24, 30], [30, 36], [41, 24]), 'none', INK, 2.2)); return o; };
const pilzIco = () => [P(R(8, 10, 22, 44, 2), FR, INK, 1.2), P(R(34, 10, 22, 44, 2), '#e3e6ea', INK, 1.2), P(R(22, 27, 10, 10, 1), '#8e9398', INK, 0.8), P('M32 24h4a4 4 0 0 1 0 16h-4z', '#8e9398', INK, 1)];
const motorIco = () => [...ICO.roll('aufsatz'), P(LZ([46, 20], [40, 32], [45, 32], [42, 42], [50, 28], [45, 28]), '#f2d27a', INK, 1)];
const kalenderIco = () => [P(R(10, 12, 44, 42, 4), FR, INK, 1.4), P(R(10, 12, 44, 10, 4), '#efe9df', INK, 1.2), P(L([22, 8], [22, 16]) + L([42, 8], [42, 16]), 'none', INK, 2), P(R(18, 30, 8, 7, 1) + R(30, 30, 8, 7, 1) + R(18, 41, 8, 7, 1), GL, INK, 0.8)];
const muenzIco = () => [P(C(32, 32, 22), '#f2d27a', INK, 1.4), P(C(32, 32, 16), 'none', INK, 0.8), P('M37 25.5a7 7 0 1 0 0 13M24 30h11M24 34h11', 'none', INK, 1.6)];
const telefonIco = () => [P(R(20, 6, 24, 52, 5), FR, INK, 1.4), P(R(23, 12, 18, 36, 1), GL, INK, 0.8), P(C(32, 53, 1.8), INK)];
const stiftIco = () => [P(R(12, 8, 34, 46, 3), FR, INK, 1.2), P(L([18, 18], [38, 18]) + L([18, 25], [38, 25]) + L([18, 32], [30, 32]), 'none', MUT, 1.4), P(LZ([40, 48], [54, 22], [58, 25], [44, 51], [39, 53]), '#f2d27a', INK, 1.1)];
const frageIco = () => [P(C(32, 32, 24), FR, INK, 1.4), P('M24.5 25a7.5 7.5 0 1 1 10.6 6.8c-2 1-3.1 2.4-3.1 4.6v2', 'none', INK, 2.6), P(C(32, 46, 2), INK)];
const zweiIco = () => [...winIco({ teilung: '1', sashes: [{ t: 'DK', din: 'L' }] }, 6, 14, 24, 34), P(L([33, 31], [41, 31]) + L([38, 27], [42, 31], [38, 35]), 'none', INK, 1.6), ...winIco({ teilung: '1', sashes: [{ t: 'DK', din: 'L' }] }, 44, 14, 16, 34)];
const GLOSS = {
  /* Aufmaß und Messen */
  referenz: { s: 'Genauigkeit', lottie: 'messen', t: 'Wie genau ist das Aufmaß?', x: ['Du misst mit dem Zollstock, die App führt dich: erst die Maueröffnung, dann das Fensterelement, jeweils senkrecht und waagerecht in der Mitte, danach die Ränder.', 'Das kleinste von drei Maßen zählt, so wie es der Fensterbauer auch macht. Die Fotos liefern ihm dazu die Einbausituation: Rollladenkasten, Anschlag, Laibung, Fensterbänke, Fassade und Zugang.'], tipp: 'Miss jedes Maß zweimal und lies den Zollstock auf den Millimeter ab. Ein Maßband hängt bei großen Breiten leicht durch, der Zollstock nicht.', ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['feinaufmass', 'rahmenmass', 'raender'] },
  rahmenmass: { s: 'Öffnung und Element', lottie: 'messen', t: 'Maueröffnung oder Fensterelement?', x: ['Die Maueröffnung ist das Loch in der Wand, gemessen von Laibung zu Laibung. Das Fensterelement ist das Fenster selbst mit seinem Rahmen, so wie du es siehst.', 'Beides brauchst du fürs Angebot. Das neue Fenster wird etwas kleiner als die Öffnung, damit Platz für Dämmung und Abdichtung bleibt. Das Bestellmaß legt dein Fensterbauer beim Feinaufmaß fest.'], tipp: 'Für die Öffnung hältst du den Zollstock an die Wand der Laibung, für das Element an die äußere Kante des Rahmens. Beides misst du in der Mitte.', ico: () => [P(R(6, 6, 52, 52), WALL, INK, 0.8), P(R(13, 13, 38, 38), '#f5f5f7', INK, 0.8, '3 2'), P(R(16, 16, 32, 32, 1), FR, INK, 1.3), P(R(20, 20, 24, 24), GL, INK, 0.6)], see: ['oeffnung-hoehe', 'element-hoehe', 'bestellmass'] },
  'oeffnung-hoehe': { s: 'Öffnung senkrecht', t: 'Wie messe ich die Maueröffnung senkrecht?', x: ['Die Maueröffnung ist das Loch in der Wand, in dem dein Fenster sitzt. Senkrecht misst du sie in der Mitte: von der Oberkante der Öffnung, also der Unterseite von Sturz oder Rollladenkasten, bis hinunter auf die Fensterbank.', 'Halte den Zollstock dabei an die Wand der Laibung, nicht an den Fensterrahmen. Der Rahmen sitzt meist ein Stück weiter innen, das Maß wäre zu klein.'], tipp: 'Liegt innen eine Fensterbank aus Stein, misst du bis auf ihre Oberfläche. Wie sie eingebaut ist, sieht dein Fensterbauer auf dem Foto.', ico: () => massIco('oh'), see: ['element-hoehe', 'raender', 'laibung'] },
  'element-hoehe': { s: 'Element senkrecht', t: 'Wie messe ich das Fensterelement senkrecht?', x: ['Das Element ist dein bestehendes Fenster samt Rahmen. Senkrecht misst du es in der Mitte, von der Oberkante bis zur Unterkante des Rahmens, so weit du ihn siehst.', 'Bei einer Tür gilt dasselbe bis hinunter auf die Schwelle. Rollladenkasten, Fensterbank und Putz gehören nicht dazu.'], tipp: 'Verdeckt Putz oder eine Leiste einen Teil des Rahmens, miss bis zur sichtbaren Kante und schreib es in die Notiz. Den Rest klärt das Feinaufmaß.', ico: () => massIco('eh'), see: ['oeffnung-hoehe', 'blendrahmen', 'rahmenmass'] },
  'oeffnung-breite': { s: 'Öffnung waagerecht', t: 'Wie messe ich die Maueröffnung waagerecht?', x: ['Waagerecht misst du die Öffnung auf halber Höhe: von der linken Laibung bis zur rechten, also von Wand zu Wand.', 'Liegen dort Fliesen oder eine Verkleidung, zählt die fertige Oberfläche. Halte den Zollstock gerade, nicht schräg nach oben oder unten.'], tipp: 'Reicht der Zollstock nicht, miss das letzte Stück mit einem zweiten Zollstock oder einem Maßband und zähl beide Werte zusammen.', ico: () => massIco('ob'), see: ['element-breite', 'raender', 'laibung'] },
  'element-breite': { s: 'Element waagerecht', t: 'Wie messe ich das Fensterelement waagerecht?', x: ['Das Element misst du auf halber Höhe von der linken bis zur rechten sichtbaren Außenkante des Rahmens. Bei zwei oder drei Flügeln gehört alles dazu, auch die Pfosten dazwischen.', 'Das Maß ist meist ein paar Zentimeter kleiner als die Öffnung. Ist es größer, hast du die Öffnung wahrscheinlich am Rahmen statt an der Laibung gemessen.'], tipp: 'Die App warnt dich, wenn das Element größer ist als die Öffnung oder auffällig klein. Dann lohnt ein zweiter Blick mit dem Zollstock.', ico: () => massIco('eb'), see: ['oeffnung-breite', 'pfosten', 'rahmenmass'] },
  raender: { s: 'Ränder', t: 'Warum messe ich auch die Ränder?', x: ['Kaum eine Öffnung ist ganz gerade. Darum misst du die Höhe zusätzlich dicht an der linken und an der rechten Laibung, die Breite dicht unter der Oberkante und dicht über der Fensterbank.', 'Von den drei Maßen je Richtung zählt das kleinste, so wie es der Fensterbauer auch macht. Weichen die Werte stark ab, ist die Öffnung außer Winkel, und er plant dafür etwas mehr Fuge ein.'], tipp: 'Miss jeden Rand wirklich. Zeigt der Zollstock dasselbe wie in der Mitte, tippst du auf „Hier auch … gemessen?“. Abweichungen ab einem Millimeter bitte genau eintragen, genau die braucht dein Fensterbauer.', ico: () => massIco('raender'), see: ['oeffnung-hoehe', 'oeffnung-breite', 'referenz'] },
  laibung: { s: 'Laibung', t: 'Was ist die Laibung?', x: ['Die Laibung ist die seitliche Wandfläche in der Fensteröffnung, also die Tiefe der Wand rund um das Fenster. Innen heißt sie Innenlaibung, außen Außenlaibung.', 'Ihre Tiefe misst du innen vom Fensterrahmen bis zur Wandoberfläche im Raum. Sie bestimmt zum Beispiel, wie tief die neue Fensterbank wird und wie viel nach dem Einbau verputzt werden muss.'], tipp: 'Kennst du die Tiefe nicht, lass das Feld leer. Die KI schätzt sie aus dem Innenfoto, und beim Feinaufmaß wird sie ohnehin gemessen.', ico: () => [...ICO.anschlag('ohne'), P(L([6, 56], [20, 56]), 'none', G_MO, 1.6), P(L([6, 53], [6, 59]), 'none', G_MO, 1.4), P(L([20, 53], [20, 59]), 'none', G_MO, 1.4)], see: ['anschlag', 'beiputz', 'fensterbank'] },
  anschlag: { s: 'Maueranschlag', t: 'Was ist ein Maueranschlag?', x: ['Bei manchen Häusern steht das Mauerwerk ein paar Zentimeter vor dem Fensterrahmen, innen oder außen. Dann ist der Rahmen größer als die Öffnung, die du siehst.', 'Ohne Anschlag ist die Laibung glatt und das Fenster sitzt einfach in der Öffnung. Für die Bestellung ist das ein wichtiger Unterschied.'], tipp: 'Ob ein Anschlag da ist, sieht dein Fensterbauer meist auf dem Außenfoto. Du musst ihn nicht selbst bestimmen.', ico: () => ICO.anschlag('aussen'), see: ['laibung', 'rahmenmass'] },
  bruestung: { s: 'Brüstungshöhe', t: 'Was ist die Brüstungshöhe?', x: ['Die Brüstungshöhe ist der Abstand vom fertigen Fußboden bis zur Unterkante der Fensteröffnung, also bis zur Fensterbank. Gemessen wird innen, vom Boden, auf dem du stehst.', 'Sie ist wichtig für die Sicherheit: Liegt die Brüstung im Obergeschoss unter 80 cm, braucht das Fenster meist eine Absturzsicherung. Bei bodentiefen Fenstern ist die Brüstung null.'], tipp: 'Kommt noch ein neuer Bodenbelag, wird die Brüstung um dessen Dicke niedriger. Schreib das in die Notiz.', ico: () => [P(R(4, 58, 56, 3), INK), P(R(16, 6, 28, 30, 1), FR, INK, 1.3), P(R(19, 9, 22, 24), GL, INK, 0.6), P(L([52, 37], [52, 57]), 'none', G_MO, 1.6), P(L([49, 37], [55, 37]), 'none', G_MO, 1.4), P(L([49, 57], [55, 57]), 'none', G_MO, 1.4)], see: ['absturz', 'rahmenmass'] },
  rohbau: { s: 'Rohbauöffnung und Sturz', t: 'Was sind Rohbauöffnung und Sturz?', x: ['Die Rohbauöffnung ist das Loch im Mauerwerk ohne Putz und Verkleidung. Bei einer neuen Öffnung gibst du sie als Wunschmaß an; das Element wird rundum etwas kleiner, damit Platz für Dämmung und Abdichtung bleibt.', 'Der Sturz ist der Träger über der Öffnung. Er nimmt die Last der Wand darüber auf. In tragenden Wänden legt ein Statiker fest, wie er ausgeführt wird.'], tipp: 'Die Breite bestimmt den Sturz: Je breiter die Öffnung, desto kräftiger muss er sein. Mehr Licht bekommst du oft einfacher über die Höhe.', ico: () => ICO.situation('neu'), see: ['neuoeffnung', 'wandstaerke', 'bestellmass'] },
  wandstaerke: { s: 'Wandstärke', t: 'Wozu brauche ich die Wandstärke?', x: ['Die Wandstärke ist die Dicke der Wand von innen bis außen, mit Putz. Bei einer neuen Öffnung plant der Fensterbauer damit Sturz, Laibung und Fensterbänke.', 'Am einfachsten misst du sie an einer Tür oder einem Fenster in derselben Wand: quer durch die Öffnung von der Innenwand bis zur Außenwand.'], tipp: 'Weißt du sie nicht, lass das Feld leer. Mit dem Foto der Wand und dem Baujahr schätzt dein Fensterbauer gut, vor Ort misst er nach.', ico: () => [...ICO.anschlag('ohne'), P(L([4, 60], [60, 60]), 'none', G_MO, 1.6), P(L([4, 57], [4, 63]) + L([60, 57], [60, 63]), 'none', G_MO, 1.4)], see: ['rohbau', 'laibung'] },
  feinaufmass: { s: 'Feinaufmaß', t: 'Was ist ein Feinaufmaß?', x: ['Bevor dein Fenster produziert wird, misst der Fensterbauer vor Ort noch einmal genau nach. Erst danach steht das Bestellmaß fest, mit dem das Fenster gefertigt wird.', 'Dein Aufmaß ersetzt den ersten Termin zum Anschauen und reicht für ein belastbares Angebot. Die Endkontrolle vor der Fertigung ersetzt es nicht, denn ein falsch bestelltes Fenster lässt sich nicht kürzen.'], tipp: 'Halte beim Termin alle Fenster frei zugänglich, auch den Rollladenkasten. Dann dauert das Feinaufmaß meist nur wenige Minuten je Fenster.', ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['bestellmass', 'referenz', 'rahmenmass'] },
  bestellmass: { s: 'Bestellmaß', t: 'Was ist das Bestellmaß?', x: ['Das Bestellmaß ist das Maß, mit dem das neue Fenster gefertigt wird. Es ist etwas kleiner als die Maueröffnung: Rundum bleibt eine Fuge für Dämmung, Abdichtung und die Bewegung des Rahmens bei Wärme und Kälte.', 'Je nach Größe, Farbe und Material sind das meist 10 bis 20 mm je Seite. Dunkle Kunststofffenster dehnen sich in der Sonne stärker aus und brauchen mehr Fuge.'], tipp: 'Rechne das Bestellmaß nicht selbst aus. Dein Fensterbauer legt es nach dem Feinaufmaß fest und steht dafür gerade.', ico: () => [P(R(6, 6, 52, 52), WALL, INK, 0.8), P(R(13, 13, 38, 38), '#f5f5f7', INK, 0.8), P(R(17, 17, 30, 30, 1), FR, INK, 1.3), P(R(21, 21, 22, 22), GL, INK, 0.6), P(L([13, 32], [17, 32]) + L([47, 32], [51, 32]), 'none', G_MO, 1.8)], see: ['feinaufmass', 'rahmenmass'] },
  einbausituation: { s: 'Fotos und KI', t: 'Was liest die KI aus deinen Fotos?', x: ['Aus dem Innen- und dem Außenfoto liest die KI die Einbausituation: Rollladenkasten, Anschlag, Laibung, Fensterbänke, Fassade und wie gut das Fenster von außen erreichbar ist. Das sind Dinge, die du nicht beurteilen musst.', 'Die Auswertung geht an deinen Fensterbauer. So sieht er vor dem Termin, was ihn erwartet, und kann genauer anbieten. Die KI misst nichts; die Maße kommen nur von deinem Zollstock.'], tipp: 'Fotografiere bei Tageslicht, das Handy gerade, mit etwas Wand rund um das Fenster. Innen ruhig Rollladenkasten und Fensterbank mit aufs Bild nehmen.', ico: kameraIco, see: ['referenz', 'anschlag', 'rollladen'] },
  lage: { s: 'Lage und Geschoss', t: 'Warum fragt die App nach der Lage?', x: ['Mit dem Namen findet dein Fensterbauer jede Position im Aufmaß wieder, zum Beispiel „Küche links“ oder „Bad oben“. Das Geschoss sagt ihm, ob ein Gerüst nötig sein kann und ob eine Absturzsicherung zum Thema wird.', 'KG ist der Keller, EG das Erdgeschoss, OG ein Obergeschoss und DG das Dachgeschoss. Gibt es dasselbe Fenster mehrmals im Haus, trägst du die Anzahl ein, statt es mehrfach zu messen.'], tipp: 'Gleich heißt: gleiche Maße auf den Millimeter und gleiche Wünsche. Weicht ein Maß ab, leg lieber eine eigene Position an.', ico: hausIco, see: ['absturz', 'bruestung'] },
  /* Element und Öffnen */
  elementart: { s: 'Elementarten', t: 'Welches Element passt zu mir?', x: ['Ein Fenster geht auf wie gewohnt, mit Drehen und Kippen. Eine Balkon- oder Terrassentür ebenso, nur bodentief und mit Schwelle. Eine Festverglasung lässt sich nicht öffnen und bringt dafür viel Licht.', 'Für große Glasflächen zur Terrasse gibt es Schiebetüren: Die Hebe-Schiebe-Tür ist leichtgängig und dicht, die PSK-Tür schiebt und kippt und ist meist günstiger. Eine Faltschiebewand öffnet fast die ganze Breite.'], tipp: 'Unsicher? Wähle, was heute eingebaut ist. Dein Fensterbauer zeigt dir im Angebot, welche Alternativen es gibt.', ico: () => ICO.art('hst'), see: ['balkon', 'hst', 'psk', 'fsw', 'festverglasung'] },
  ersatz: { s: 'Fenster ersetzen', t: 'Was heißt Fenster ersetzen?', x: ['Das alte Fenster wird samt Rahmen ausgebaut und ein neues in die bestehende Öffnung gesetzt. Die Wand bleibt, wie sie ist; nur rund um den Rahmen wird neu abgedichtet und verputzt.', 'Dafür misst du die vorhandene Öffnung und das alte Fenster. Daraus und aus den Fotos plant dein Fensterbauer das neue Element.'], tipp: 'Soll die Öffnung größer werden, etwa für eine Tür statt eines Fensters, wähle „Neue Öffnung“. Dann geht es auch um Sturz und Statik.', ico: () => ICO.situation('ersatz'), see: ['neuoeffnung', 'montage', 'rahmenmass'] },
  neuoeffnung: { s: 'Neue Öffnung', t: 'Neue Öffnung in der Wand', x: ['Wo noch kein Fenster ist, braucht die Wand einen Durchbruch mit Sturz. Bei tragenden Wänden muss ein Statiker oder der Fensterbauer mit seinem Bauunternehmen prüfen, was geht.', 'Du markierst die gewünschte Lage auf dem Foto und gibst die Wunschgröße an. Das Rohbaumaß legt am Ende der Fachbetrieb fest.'], tipp: 'In einer Eigentumswohnung oder einem Mietshaus vorher die Eigentümer fragen: Ein Durchbruch in der Außenwand braucht ihre Zustimmung, manchmal auch eine Genehmigung.', ico: () => ICO.situation('neu'), see: ['rohbau', 'wandstaerke', 'feinaufmass'] },
  oeffnungsart: { s: 'Öffnungsarten', t: 'Wie kann ein Flügel aufgehen?', x: ['Ein Dreh-Kipp-Flügel kippt zum Lüften und dreht sich ganz auf zum Putzen. Ein Drehflügel geht nur zur Seite auf, ein Kippflügel nur oben. Ein festes Feld lässt sich gar nicht öffnen.', 'Bei mehreren Flügeln wählst du für jeden die Öffnung. Häufig ist ein Flügel Dreh-Kipp und der zweite nur Dreh, wenn er ohnehin selten aufgeht.'], tipp: 'Ein festes Feld ist günstiger und dichter. Achte nur darauf, dass du es außen noch putzen kannst, im Obergeschoss etwa vom Balkon aus.', ico: () => ICO.typ('DK'), see: ['dk', 'dreh', 'kipp', 'fest', 'symbol'] },
  dk: { s: 'Dreh-Kipp', t: 'Was ist ein Dreh-Kipp-Fenster?', x: ['Der Standard in Deutschland. Griff nach oben: Das Fenster kippt und du lüftest. Griff zur Seite: Der Flügel dreht sich ganz auf, zum Putzen oder Stoßlüften.', 'Griff nach unten heißt geschlossen. Die Beschläge rundum ziehen den Flügel dabei fest an die Dichtung.'], tipp: 'Lieber kurz stoßlüften als lange kippen: Ein gekipptes Fenster kühlt im Winter die Laibung aus, und dort bildet sich leicht Schimmel.', ico: () => ICO.typ('DK'), see: ['symbol', 'kipp', 'dinlr'] },
  dreh: { s: 'Drehfenster', t: 'Was ist ein Drehfenster?', x: ['Ein Drehflügel geht nur zur Seite auf, wie eine kleine Tür. Kippen lässt er sich nicht.', 'Das ist üblich beim zweiten Flügel eines Stulpfensters und bei Flügeln, die nur selten geöffnet werden. Der Beschlag ist einfacher und etwas günstiger als Dreh-Kipp.'], tipp: 'Möchtest du an diesem Flügel auch lüften, ohne ihn ganz zu öffnen, nimm lieber Dreh-Kipp.', ico: () => ICO.typ('D'), see: ['dk', 'stulp', 'oeffnungsart'] },
  kipp: { s: 'Kippfenster', t: 'Was ist ein Kippfenster?', x: ['Ein Flügel, der nur oben kippt und sich nicht ganz aufdrehen lässt. Typisch für Oberlichter und kleine Fenster in Bad, Keller oder Treppenhaus.', 'Geputzt wird ein Kippfenster außen von draußen oder mit einer Putzhilfe durch den Spalt. Bei hoch liegenden Flügeln gibt es eine Stange oder einen Hebel zum Öffnen.'], tipp: 'Liegt der Flügel hoch, frag nach einem Oberlichtöffner. Dann kippst du ihn bequem von unten.', ico: () => ICO.typ('K'), see: ['oberlicht', 'dk'] },
  fest: { s: 'Festes Feld', t: 'Was ist ein festes Feld?', x: ['Ein festes Feld hat keinen Flügel: Das Glas sitzt direkt im Rahmen. Es lässt sich nicht öffnen, ist dafür schlanker, dichter und günstiger.', 'In einem Fenster mit mehreren Feldern ist oft das mittlere fest und die äußeren gehen auf. Geputzt wird es von außen.'], tipp: 'Im Obergeschoss ohne Balkon kommst du an ein festes Feld außen nur schwer heran. Plane dort lieber einen Flügel, der aufgeht.', ico: () => ICO.typ('F'), see: ['festverglasung', 'oeffnungsart'] },
  symbol: { s: 'Öffnungssymbole', t: 'Wie lese ich die Linien im Fenster?', x: ['In Fensterzeichnungen zeigen dünne Linien, wie ein Flügel aufgeht. Die Linien starten an den Ecken der Scharnierseite, die Spitze zeigt zum Griff.', 'Ein Dreieck mit der Spitze nach oben steht fürs Kippen. Durchgezogene Linien bedeuten: öffnet nach innen. Gestrichelte: öffnet nach außen.'], tipp: 'Die Spitze zeigt immer zum Griff. So liest du auch fremde Zeichnungen sofort und weißt, wo die Scharniere sitzen.', ico: () => ICO.typ('DK'), see: ['dinlr', 'dk', 'aussen'] },
  dinlr: { s: 'DIN links/rechts', t: 'Was bedeutet DIN links und DIN rechts?', x: ['Die Angabe sagt, auf welcher Seite die Scharniere sitzen. Man schaut dafür immer von innen, also von der Seite, zu der das Fenster aufgeht.', 'Scharniere links heißt DIN links. Der Griff sitzt dann rechts. Merkhilfe: Stell dich innen vor das offene Fenster und leg die Hand auf die Scharniere. Linke Hand bedeutet DIN links.'], tipp: 'Denk an die Möbel: Der Flügel sollte zu der Seite aufgehen, auf der kein Schrank und kein Vorhang im Weg ist.', ico: () => [...ICO.typ('DK'), P(R(10.5, 14, 3, 9, 1), INK), P(R(10.5, 41, 3, 9, 1), INK)], see: ['symbol', 'dk'] },
  aussen: { s: 'Nach außen öffnend', t: 'Was heißt nach außen öffnend?', x: ['In Deutschland gehen Fenster fast immer nach innen auf. Nach außen öffnende Flügel kennt man aus Skandinavien, von manchen Holzfenstern und von Fenstern, vor denen innen kein Platz ist.', 'In Zeichnungen sind sie gestrichelt. Sie brauchen besondere Beschläge, lassen sich schwerer putzen und vertragen sich nicht mit einem Rollladen außen.'], tipp: 'Wähle das nur, wenn es einen Grund gibt. Im Zweifel bleibt es beim Standard nach innen.', ico: () => winIco({ teilung: '1', richtung: 'aussen', sashes: [{ t: 'D', din: 'L' }] }, 14, 8, 36, 48), see: ['symbol', 'oeffnungsart'] },
  blendrahmen: { s: 'Flügel und Rahmen', t: 'Wie ist ein Fenster aufgebaut?', x: ['Der Blendrahmen ist der feste Rahmen, der in der Wand sitzt. Darin hängen die Flügel, also die Teile, die sich öffnen. Ein Pfosten ist ein festes Profil, das den Blendrahmen in mehrere Felder teilt.', 'Ein Kämpfer teilt waagerecht, etwa zwischen Oberlicht und Fenster. Die Zahl der Flügel richtet sich nach der Breite: bis etwa 1 m meist einer, darüber zwei, ab etwa 2 m drei.'], tipp: 'Mehr Flügel heißt mehr Rahmen und weniger Glas. Wer viel Licht will, nimmt lieber weniger, dafür breitere Flügel.', ico: () => ICO.layout('2p'), see: ['pfosten', 'stulp', 'oberlicht'] },
  pfosten: { s: 'Pfosten', t: 'Was ist ein Pfosten?', x: ['Ein Pfosten ist ein festes, senkrechtes Profil zwischen zwei Flügeln. Jeder Flügel öffnet für sich, unabhängig vom anderen.', 'Das ist stabil, dicht und meist günstiger als ein Stulpfenster. Dafür steht in der Mitte immer ein Profil, auch wenn beide Flügel offen sind.'], tipp: 'Bei einem Fenster, durch das du nur hinaussiehst, stört der Pfosten selten. Bei einer Balkontür, durch die du gehst, ist ein Stulp oft praktischer.', ico: () => ICO.layout('2p'), see: ['stulp', 'blendrahmen'] },
  stulp: { s: 'Stulpfenster', t: 'Was ist ein Stulpfenster?', x: ['Zwei Flügel ohne festen Mittelpfosten. Der eine Flügel trägt eine Leiste, die beim Schließen über den anderen greift, die Stulpleiste.', 'Zuerst geht der Gehflügel mit dem Griff auf. Den Standflügel entriegelst du danach mit einem Hebel im Falz, oben und unten; auf Wunsch bekommt er einen zweiten Griff, dann geht es mit einer Hand. Er lässt sich meist nur drehen, nicht kippen. Sind beide offen, ist die ganze Breite frei.'], tipp: 'Ideal für breite Balkontüren und für Fenster, durch die du auch mal Möbel trägst.', ico: () => ICO.layout('2s'), see: ['pfosten', 'dreh'] },
  oberlicht: { s: 'Oberlicht', t: 'Was ist ein Oberlicht?', x: ['Ein eigenes Feld über dem eigentlichen Fenster, fest oder kippbar. Getrennt sind beide durch ein waagerechtes Profil, den Kämpfer.', 'Ein Oberlicht bringt Licht und Luft, ohne dass der große Flügel aufgehen muss. Bei Türen macht es eine hohe Öffnung möglich, ohne dass die Tür selbst riesig wird.'], tipp: 'Kippbare Oberlichter über Kopfhöhe brauchen einen Öffner, den du von unten bedienst. Frag danach, wenn es hoch wird.', ico: () => winIco({ teilung: '1', ol: true, olT: 'K', sashes: [{ t: 'DK', din: 'L' }] }, 14, 6, 36, 52), see: ['kipp', 'unterlicht', 'blendrahmen'] },
  unterlicht: { s: 'Unterlicht', t: 'Was ist ein Unterlicht?', x: ['Ein festes Feld unter den Flügeln, als Glas oder als gedämmtes Paneel. Typisch in Küchen: Die Arbeitsplatte steht vor dem Fenster, der Flügel beginnt erst darüber und lässt sich trotzdem öffnen.', 'Die Höhe richtet sich nach Arbeitsplatte oder Brüstung, meist 30 bis 60 cm.'], tipp: 'Steht eine Küchenzeile davor, miss von der Fensterbank bis knapp über die Arbeitsplatte. So hoch wird das Unterlicht, und der Flügel darüber geht frei auf.', ico: () => ICO.ul('glas'), see: ['oberlicht', 'fest'] },
  festverglasung: { s: 'Festverglasung', t: 'Was ist eine Festverglasung?', x: ['Glas direkt im Blendrahmen, ohne Flügel und ohne Griff. Dadurch schmalere Ansichten, mehr Licht und weniger Kosten. Zum Lüften braucht es daneben ein Fenster, das aufgeht.', 'Großflächige Festverglasungen werden in Felder geteilt, weil Scheiben ab etwa 2,5 m² schwer und teuer werden.'], tipp: 'Kombiniere eine große Festverglasung mit einem schmalen Flügel daneben. So hast du das Licht und kannst trotzdem lüften.', ico: () => ICO.art('fest'), see: ['fest', 'pfosten'] },
  balkon: { s: 'Balkon- und Terrassentür', t: 'Was ist eine Balkon- oder Terrassentür?', x: ['Eine Tür, die aufgeht wie ein Fenster: drehen zum Durchgehen, kippen zum Lüften. Unten sitzt eine Schwelle statt der Fensterbank.', 'Damit sie von außen zugeht, gibt es einen Ziehgriff mit Schnäpper. Mit Schloss lässt sie sich auch von außen abschließen.'], tipp: 'Gehst du oft hinaus und ziehst die Tür hinter dir zu, nimm den Ziehgriff. Ohne ihn bleibt sie von außen nur angelehnt.', ico: () => ICO.art('balkon'), see: ['schwelle', 'ziehgriff', 'psk'] },
  hst: { s: 'Hebe-Schiebe-Tür', t: 'Was ist eine Hebe-Schiebe-Tür?', x: ['Eine bodentiefe Tür, bei der ein großer Flügel per Hebegriff angehoben und zur Seite geschoben wird. Die Öffnung bleibt frei, nichts schwenkt in den Raum.', 'Schema A: ein Schiebeflügel vor einem festen Teil. Schema C: zwei Schiebeflügel öffnen in der Mitte zwischen zwei festen Teilen. Schema D: zwei Schiebeflügel, die in der Mitte schließen.'], tipp: 'Achte auf die Schwelle: Eine flache Schwelle ist bequem, außen braucht es dann eine Rinne für das Regenwasser.', ico: () => ICO.art('hst'), see: ['schiebeseite', 'schwelle', 'psk'] },
  psk: { s: 'PSK-Tür', t: 'Was ist eine PSK-Tür?', x: ['Parallel-Schiebe-Kipp: Der Flügel kippt zum Lüften. Zum Öffnen stellt er sich parallel ab und schiebt sich vor das feste Teil.', 'Meist deutlich günstiger als eine Hebe-Schiebe-Tür. Dafür sind die Flügel kleiner, und unten ist immer eine Schwelle. Vierteilig schieben sich zwei Flügel von der Mitte aus vor die festen Teile außen.'], tipp: 'Gehst du täglich oft hinaus, ist eine Hebe-Schiebe-Tür leichtgängiger. Für gelegentliches Öffnen reicht eine PSK-Tür.', ico: () => ICO.art('psk'), see: ['hst', 'schiebeseite', 'schwelle'] },
  fsw: { s: 'Faltschiebewand', t: 'Was ist eine Faltschiebewand?', x: ['Mehrere Flügel hängen in einer Laufschiene und falten sich wie eine Ziehharmonika zu einem Paket an der Seite. So öffnet sich die ganze Wand.', 'Ein Gehflügel geht wie eine normale Tür auf, ohne dass alles gefaltet werden muss. Ab drei Flügeln sinnvoll, bis etwa sieben üblich.'], tipp: 'Mit Gehflügel musst du für den kurzen Weg in den Garten nicht jedes Mal die ganze Wand falten.', ico: () => ICO.art('fsw'), see: ['faltpaket', 'hst', 'schwelle'] },
  schiebeseite: { s: 'Seite des Schiebeflügels', t: 'Schiebeflügel links oder rechts?', x: ['Bei Hebe-Schiebe- und PSK-Türen bewegt sich ein Flügel, der andere Teil steht fest. Die Seite gibst du an, wie du von innen auf die Tür schaust.', 'Schiebeflügel rechts heißt: Geschlossen steht er rechts und schiebt sich zum Öffnen nach links vor das feste Teil. Damit legst du auch fest, wo der Durchgang ist.'], tipp: 'Nimm die Seite, auf der du meist hinausgehst, etwa zum Sitzplatz oder zur Treppe in den Garten.', ico: () => ICO.hst('A'), see: ['hst', 'psk'] },
  faltpaket: { s: 'Faltpaket und Gehflügel', t: 'Wohin faltet die Faltschiebewand?', x: ['Beim Öffnen falten sich die Flügel zusammen und stehen dann als Paket an der Seite. Du wählst, ob das Paket links, rechts oder geteilt auf beiden Seiten steht, von innen gesehen.', 'Der Gehflügel am anderen Ende geht wie eine normale Tür auf, ohne dass du alles falten musst.'], tipp: 'Das Paket steht quer zur Wand und braucht etwa so viel Platz, wie ein Flügel breit ist. Stell dort keine Möbel und keine Pflanzkübel hin.', ico: () => ICO.fsw(5), see: ['fsw', 'schwelle'] },
  schwelle: { s: 'Schwelle', t: 'Welche Schwelle?', x: ['Flache Schwellen von etwa 20 mm gelten als barrierearm. Barrierefrei nach DIN 18040 heißt möglichst ohne Schwelle; dann braucht es außen eine Entwässerungsrinne vor der Tür.', 'Standardschwellen mit Anschlag dichten am besten und sind an Wetterseiten die sichere Wahl.'], tipp: 'Für die Förderung zählt eine barrierearme Schwelle mit: Dann reicht ein etwas höherer U-Wert. Frag deinen Fensterbauer danach.', ico: () => ICO.schwelle('flach'), see: ['fussboden', 'hst', 'balkon'] },
  fussboden: { s: 'Fußboden und Schwelle', t: 'Warum fragt die App nach dem Fußboden?', x: ['Die Schwelle einer Tür richtet sich nach dem fertigen Fußboden, also nach Estrich und Belag. Bleibt der Boden, setzt der Fensterbauer die Schwelle auf die heutige Höhe.', 'Kommt ein neuer Boden, etwa Fliesen oder Parkett auf neuem Estrich, ändert sich die Höhe um einige Zentimeter. Dann plant er die Schwelle auf die neue Oberkante.'], tipp: 'Weißt du schon, welcher Belag kommt, schreib seine Dicke in die Notiz. Das spart beim Termin eine Rückfrage.', ico: () => ICO.schwelle('standard'), see: ['schwelle', 'balkon'] },
  absturz: { s: 'Absturzsicherung', t: 'Wann braucht es eine Absturzsicherung?', x: ['Die Bauordnungen der meisten Länder verlangen Fensterbrüstungen von mindestens 80 cm, bei mehr als 12 m Absturzhöhe 90 cm. Ist sie niedriger, braucht das Fenster eine Absturzsicherung; bei bodentiefen Fenstern und Türen ohne Balkon davor immer.', 'Möglich sind ein Geländer außen (französischer Balkon), Glas in der Laibung oder ein unten fest verglastes Feld aus Sicherheitsglas.'], tipp: 'Ein unten fest verglastes Feld fällt kaum auf. Dafür lässt sich dieser Teil des Fensters nicht mehr öffnen.', ico: () => ICO.absturz('gelaender'), see: ['bruestung', 'vsg'] },
  /* Material und Form */
  material: { s: 'Material', t: 'Welches Material passt?', x: ['Kunststoff ist günstig und pflegeleicht. Holz wirkt warm und lässt sich streichen, braucht aber Pflege. Aluminium ist sehr stabil und schlank, kostet aber mehr.', 'Die Kombinationen verbinden beides: Kunststoff-Alu und Holz-Alu tragen außen eine Schale aus Aluminium, die Wind und Wetter abhält. Innen bleibt Kunststoff oder Holz.'], tipp: 'Für die meisten Häuser ist Kunststoff die vernünftige Wahl. Im Denkmalschutz ist oft Holz vorgeschrieben.', ico: () => ICO.material('holzalu'), see: ['kunststoff', 'kunststoffalu', 'holz', 'holzalu', 'alu'] },
  kunststoff: { s: 'Kunststoff', t: 'Fenster aus Kunststoff', x: ['Kunststofffenster bestehen aus PVC-Profilen mit mehreren Kammern und einem Kern aus Stahl für die Stabilität. Sie dämmen gut, sind günstig und brauchen kaum Pflege: Abwischen reicht.', 'Farbe bekommen sie über eine Folie oder ein Dekor, auch in Holzoptik.'], tipp: 'Dunkle Farben heizen sich in der Sonne auf. Frag bei großen dunklen Fenstern nach einer passenden Verstärkung.', ico: () => ICO.material('kunststoff'), see: ['material', 'holzdekor'] },
  kunststoffalu: { s: 'Kunststoff-Alu', t: 'Was ist Kunststoff-Alu?', x: ['Ein Kunststofffenster mit einer Schale aus Aluminium auf der Außenseite. Innen hast du die gute Dämmung und den Preis von Kunststoff, außen die robuste Oberfläche von Aluminium.', 'Die Schale gibt es in vielen Farben, sie bleicht kaum aus und wirkt von außen wie ein Alufenster.'], tipp: 'Sinnvoll an Wetterseiten und wenn außen eine dunkle Farbe lange gut aussehen soll.', ico: () => ICO.material('kunststoffalu'), see: ['material', 'alu'] },
  holz: { s: 'Holz', t: 'Fenster aus Holz', x: ['Holzfenster werden meist aus Kiefer, Fichte, Lärche oder Eiche gefertigt. Sie dämmen gut, fühlen sich warm an und lassen sich in jeder Farbe lasieren oder lackieren.', 'Außen braucht Holz Pflege: Alle paar Jahre wird der Anstrich ausgebessert, an der Wetterseite öfter.'], tipp: 'Keine Lust aufs Streichen? Holz-Alu hat innen Holz und außen eine Schale aus Aluminium.', ico: () => ICO.material('holz'), see: ['material', 'holzalu'] },
  holzalu: { s: 'Holz-Alu', t: 'Was ist Holz-Alu?', x: ['Innen Holz, außen eine Schale aus Aluminium mit etwas Abstand davor. Du hast innen die warme Oberfläche, außen schützt das Aluminium vor Regen und Sonne.', 'Holz-Alu-Fenster halten sehr lange und brauchen außen kaum Pflege. Dafür gehören sie zu den teuersten.'], tipp: 'Innen und außen dürfen verschiedene Farben haben, etwa Eiche innen und Anthrazit außen.', ico: () => ICO.material('holzalu'), see: ['material', 'holz'] },
  alu: { s: 'Aluminium', t: 'Fenster aus Aluminium', x: ['Aluminium ist sehr stabil. Darum werden die Profile schlank, und es bleibt mehr Glas: gut für große Fenster und Schiebetüren.', 'Damit es innen nicht kalt wird, sind die Profile thermisch getrennt: Ein Steg aus Kunststoff trennt die innere von der äußeren Schale. Aluminium ist langlebig und pflegeleicht, aber teurer als Kunststoff.'], tipp: 'Für sehr große Glasflächen ist Aluminium oft die einzige Wahl, die schlank bleibt.', ico: () => ICO.material('alu'), see: ['material', 'kunststoffalu', 'db703'] },
  form: { s: 'Formen', t: 'Rundbogen, Segmentbogen, Schräg, Trapez oder Rund?', x: ['Die meisten Fenster sind rechteckig. Ein Rundbogen hat oben einen Halbkreis, ein Segmentbogen nur einen flachen Bogen. Schräge Fenster sind auf einer Seite höher, ein Trapez hat oben zwei schräge Ecken, typisch unter Dachschrägen und im Giebel.', 'Runde Fenster und Dreiecke im Giebel sind fest verglast und haben keinen Flügel. Jede Sonderform wird einzeln gefertigt und kostet mehr als ein Rechteck gleicher Größe.'], tipp: 'Fotografiere einen Bogen gerade von vorn. Die genaue Form nimmt der Fensterbauer beim Feinaufmaß ab, oft mit einer Schablone.', ico: () => ICO.form('rundbogen'), see: ['feinaufmass', 'fest'] },
  /* Sprossen */
  sprossen: { s: 'Sprossen', t: 'Was sind Sprossen?', x: ['Sprossen teilen die Glasfläche in kleinere Felder. Früher war das nötig, weil es nur kleine Scheiben gab; heute geht es um die Optik, etwa im Altbau oder am Landhaus.', 'Es gibt vier Arten: Wiener Sprossen, innenliegende, aufgesetzte und glasteilende Sprossen. Sie unterscheiden sich in Optik, Pflege und Preis.'], tipp: 'Sprossen nehmen etwas Licht und machen das Putzen aufwendiger. Wenige Felder wirken oft eleganter als viele.', ico: () => ICO.preset('kreuz'), see: ['wiener', 'szr', 'auf', 'echt', 'sprossenbreite'] },
  wiener: { s: 'Wiener Sprosse', t: 'Was ist eine Wiener Sprosse?', x: ['Sprossen, die außen und innen auf die Scheibe geklebt werden. Dazwischen sitzt ein dunkler Steg im Scheibenzwischenraum, deshalb sieht man nicht durch die Sprosse hindurch.', 'So sieht das Fenster aus wie mit echten Sprossen, dämmt aber wie eine durchgehende Scheibe.'], tipp: 'Die beliebteste Wahl für den Altbau-Look bei guter Dämmung.', ico: () => ICO.spross('wiener'), see: ['szr', 'echt', 'sprossenbreite'] },
  szr: { s: 'Innenliegende Sprossen', t: 'Was sind innenliegende Sprossen?', x: ['Sprossen zwischen den Glasscheiben, im Scheibenzwischenraum. Die Oberfläche bleibt glatt, Putzen geht wie bei einem Fenster ohne Sprossen.', 'Aus der Nähe sieht man, dass die Sprossen hinter dem Glas liegen. Sie sind meist schmal und in Weiß, Messing oder der Farbe des Rahmens zu haben.'], tipp: 'Ideal, wenn du die Optik willst, aber beim Fensterputzen keine Ecken möchtest.', ico: () => ICO.spross('szr'), see: ['wiener', 'auf'] },
  auf: { s: 'Aufgesetzte Sprossen', t: 'Was sind aufgesetzte Sprossen?', x: ['Sprossen, die nur auf die Scheibe geklebt sind, ohne Steg dazwischen. Das ist günstig und geht auch nachträglich.', 'Aus der Nähe sieht man durch die Lücke hindurch, dass die Sprosse nur aufgesetzt ist. Du wählst, ob sie innen, außen oder auf beiden Seiten sitzt.'], tipp: 'Nur außen aufgesetzt wirkt die Fassade gegliedert, und innen putzt du eine glatte Scheibe.', ico: () => ICO.spross('auf'), see: ['wiener', 'szr'] },
  echt: { s: 'Glasteilende Sprossen', t: 'Was ist eine glasteilende Sprosse?', x: ['Das klassische Original: Jedes Feld hat seine eigene Scheibe, die Sprosse trägt das Glas. Sehr authentisch und im Denkmalschutz oft gefordert.', 'Dafür teurer, mit mehr Rahmenanteil und etwas schlechterer Dämmung, weil jede kleine Scheibe einen eigenen Rand hat.'], tipp: 'Im Baudenkmal vorher bei der Denkmalbehörde fragen, welche Sprosse sie verlangt.', ico: () => ICO.spross('echt'), see: ['wiener', 'gebaeude'] },
  sprossenbreite: { s: 'Sprossenbreite', t: 'Wie breit sollen die Sprossen sein?', x: ['Die Breite bestimmt, wie stark die Sprossen auffallen. Schmale Sprossen um 18 mm wirken fein und modern, 26 mm ist der übliche Mittelweg, 45 mm wirkt kräftig und historisch.', 'Bei glasteilenden Sprossen gibt die Technik die Breite vor, sie fallen breiter aus.'], tipp: 'Orientier dich an der Fassade: Hat das Haus sonst schlanke Profile, wirken breite Sprossen schnell schwer.', ico: () => ICO.spross('wiener'), see: ['sprossen', 'wiener'] },
  /* Farbe */
  ral: { s: 'RAL-Farben', t: 'Was bedeutet RAL?', x: ['RAL ist ein Farbsystem mit festen Nummern. So sieht Anthrazitgrau bei jedem Hersteller gleich aus: RAL 7016. RAL Classic hat 216 Töne, die erste Ziffer nennt die Familie: 1 Gelb und Beige, 2 Orange, 3 Rot, 4 Violett, 5 Blau, 6 Grün, 7 Grau, 8 Braun, 9 Weiß und Schwarz.', 'Am Fenster üblich sind Verkehrsweiß (RAL 9016), Cremeweiß (RAL 9001), Anthrazitgrau (RAL 7016) und Lichtgrau (RAL 7035). Alle anderen RAL-Töne findest du unter „Alle Farben“ in der Farbauswahl: Such nach Nummer oder Name, oder tipp die Nummer einfach ins Feld.', 'Deine Farbe steht oft auf alten Rechnungen oder einem Aufkleber im Falz. Soll sie zur Haustür passen, hilft ein Foto.'], tipp: 'Farben am Bildschirm weichen ab. Lass dir vor dem Auftrag ein echtes Farbmuster zeigen, am besten bei Tageslicht an der Fassade.', ico: () => [P(C(20, 24, 11), '#383e42'), P(C(40, 24, 11), '#f1f0ea', INK, 0.8), P(C(30, 42, 11), '#b5732f')], see: ['holzdekor', 'db703'] },
  holzdekor: { s: 'Holzdekor', t: 'Was ist ein Holzdekor?', x: ['Kunststofffenster bekommen Holzoptik über eine Folie mit Maserung, zum Beispiel Golden Oak, Nussbaum oder Eiche. Die Folie ist fest aufgebracht und fühlt sich leicht strukturiert an.', 'Das Dekor gibt es außen, innen oder auf beiden Seiten.'], tipp: 'Häufig ist Holzdekor außen und Weiß innen: Die Fassade wirkt warm, der Raum bleibt hell.', ico: () => [P(R(14, 8, 36, 48, 3), '#b5732f', INK, 1.3), P('M20 14c6 6 6 14 0 20M27 10c5 10 5 22 0 34M36 12c5 8 5 18 0 26', 'none', '#8a5522', 1.2)], see: ['ral', 'kunststoff'] },
  db703: { s: 'DB 703 und Eloxal', t: 'Was ist DB 703?', x: ['DB 703 ist ein dunkler Eisenglimmer-Ton: ein Anthrazit mit feinem Glimmer, ursprünglich aus der Farbreihe der Deutschen Bahn. Es schimmert leicht metallisch und ist bei Aluminium sehr beliebt.', 'Daneben gibt es Eloxal: Dabei wird die Oberfläche des Aluminiums selbst veredelt, etwa in Silber oder Bronze.'], tipp: 'DB 703 wirkt je nach Licht heller oder dunkler als RAL 7016. Vergleich beide als Muster nebeneinander.', ico: () => [P(C(32, 32, 20), '#4a4c4f', INK, 1), P(C(25, 26, 1.2) + C(36, 30, 1) + C(30, 39, 1.1) + C(40, 40, 0.9), '#b9bcc0')], see: ['ral', 'alu'] },
  /* Glas */
  uwert: { s: 'U-Wert', t: 'Was bedeutet der U-Wert?', x: ['Er zeigt, wie viel Wärme durch das Fenster verloren geht. Je kleiner der Wert, desto besser die Dämmung.', 'Ug steht für das Glas, Uw für das ganze Fenster mit Rahmen. 2-fach-Glas liegt typisch um 1,1, 3-fach-Glas um 0,5 bis 0,7.'], tipp: 'Für die Förderung zählt der Uw-Wert des ganzen Fensters, nicht der des Glases. Den nennt dir dein Fensterbauer im Angebot.', ico: () => [...ICO.glas('3'), P(L([4, 32], [14, 32]), 'none', G_MO, 2), P(L([10, 28], [14, 32], [10, 36]), 'none', G_MO, 2), P(L([50, 32], [60, 32]), 'none', G_MO, 1.4, '2 2')], see: ['foerderung', 'glasextras'] },
  glasextras: { s: 'Glas-Extras', t: 'Welche Extras gibt es fürs Glas?', x: ['Schallschutzglas dämpft Lärm von Straße oder Bahn. Sicherheitsglas hält bei einem Bruch zusammen und erschwert Einbrüche. Sichtschutz ist strukturiertes Glas, durch das niemand hineinsieht. Sonnenschutzglas hält im Sommer Wärme draußen.', 'Du kannst mehrere Extras kombinieren. Jedes macht das Glas etwas teurer, manche auch schwerer.'], tipp: 'Nimm Extras dort, wo sie wirken: Schallschutz zur Straße, Sichtschutz im Bad, Sicherheitsglas, wo man leicht hinkommt.', ico: () => ICO.glas('3'), see: ['schall', 'vsg', 'ornament', 'sonnenschutzglas'] },
  schall: { s: 'Schallschutzglas', t: 'Was bringt Schallschutzglas?', x: ['Unterschiedlich dicke Scheiben und spezielle Folien dämpfen Lärm. Gemessen wird das in Dezibel: Ein normales Fenster dämmt etwa 32 dB, Schallschutzfenster 38 bis 45 dB und mehr.', 'Sinnvoll an lauten Straßen, Bahnlinien oder in der Einflugschneise.'], tipp: 'Schon 10 dB weniger empfindet das Ohr etwa als halb so laut. Und ein gekipptes Fenster dämmt fast nichts.', ico: () => [...ICO.glas('2'), P('M8 24a12 12 0 0 1 0 16M4 20a18 18 0 0 1 0 24', 'none', INK, 1.4)], see: ['glasextras', 'vsg'] },
  vsg: { s: 'Sicherheitsglas', t: 'Was ist Sicherheitsglas?', x: ['ESG, Einscheiben-Sicherheitsglas, zerfällt bei Bruch in kleine, stumpfe Krümel. VSG, Verbund-Sicherheitsglas, hat innen eine zähe Folie: Die Scheibe bekommt Risse, hält aber zusammen.', 'VSG schützt vor Verletzungen und erschwert Einbrüche, weil kein Loch entsteht, durch das jemand greifen kann.'], tipp: 'Für den Einbruchschutz RC2 braucht es VSG der Klasse P4A. Bei bodentiefen Fenstern ist Sicherheitsglas oft ohnehin Pflicht.', ico: () => [...ICO.glas('2'), P(L([32, 10], [32, 54]), 'none', G_MO, 1.4, '3 2')], see: ['rc2', 'absturz'] },
  ornament: { s: 'Ornamentglas', t: 'Was ist Ornamentglas?', x: ['Strukturiertes Glas, das Licht durchlässt, aber Blicke streut. Typisch im Bad, im Flur oder an der Haustür.', 'Bekannte Muster heißen Satinato (matt wie Milchglas), Chinchilla (fein gemustert) oder Mastercarré (kleines Raster). Die Struktur liegt meist auf der inneren Scheibe.'], tipp: 'Satinato wirkt am ruhigsten und modern. Wer es klassisch mag, nimmt Chinchilla.', ico: () => { let d = ''; for (let y = 14; y < 52; y += 5) for (let x = 18; x < 48; x += 5) d += C(x, y, 0.8); return [P(R(12, 8, 40, 48, 1.5), FR, INK, 1.3), P(R(16, 12, 32, 40), '#dde6ee', INK, 0.6), P(d, '#ffffff')]; }, see: ['glasextras', 'vsg'] },
  sonnenschutzglas: { s: 'Sonnenschutzglas', t: 'Was ist Sonnenschutzglas?', x: ['Sonnenschutzglas hat eine hauchdünne Beschichtung, die einen Teil der Sonnenwärme zurückwirft. Der Raum heizt sich im Sommer weniger auf.', 'Das Maß dafür ist der g-Wert: Normales Wärmeschutzglas liegt um 0,5, Sonnenschutzglas oft bei 0,3 und darunter. Dafür wird es etwas dunkler und kann von außen leicht spiegeln.'], tipp: 'Sinnvoll bei großen Glasflächen nach Süden und Westen, besonders im Dachgeschoss. Im Winter fehlt dir dafür etwas Sonnenwärme.', ico: () => [...ICO.glas('3'), P(C(52, 14, 8), '#f2d27a', INK, 1.1)], see: ['glasextras', 'sonnenschutz'] },
  /* Griff und Sicherheit */
  griff: { s: 'Griffe', t: 'Welcher Griff?', x: ['Der Standardgriff hat drei Stellungen: zu, kippen, drehen. Ein abschließbarer Griff hat ein kleines Schloss, damit niemand das Fenster von innen öffnet, etwa Kinder oder ein Einbrecher durch eine eingeschlagene Scheibe. Beim Druckknopfgriff drückst du einen Knopf, bevor er sich dreht.', 'Ohne Griff heißt: Der Beschlag liegt verdeckt im Flügel, oder das Fenster öffnet elektrisch. Bei der Hebe-Schiebe-Tür hebt ein langer Hebegriff den Flügel aus der Dichtung.'], tipp: 'In Kinderzimmern und an leicht erreichbaren Fenstern lohnt der abschließbare Griff.', ico: () => ICO.griff('abschliessbar'), see: ['grifffarbe', 'rc2', 'ziehgriff'] },
  grifffarbe: { s: 'Griff-Farben', t: 'Welche Griff-Farbe?', x: ['Griffe gibt es in Weiß, Silber, Edelstahl, Titan, Schwarz und Anthrazit, dazu in Braun, Bronze und Messing. Meist passt der Griff zur Rahmenfarbe innen: Weiß zu weißen Fenstern, Edelstahl oder Schwarz zu dunklen.', 'Silber und Titan sind Aluminium mit veredelter Oberfläche, Edelstahl ist gebürstet und sehr robust.'], tipp: 'Hast du schon Türdrücker im Haus, nimm dieselbe Oberfläche. Dann wirkt alles aus einem Guss.', ico: () => ICO.griff('standard'), see: ['griff', 'ral'] },
  ziehgriff: { s: 'Griff außen', t: 'Ziehgriff mit Schnäpper oder abschließbar?', x: ['Ohne Griff außen lässt sich eine Balkontür von draußen nicht zuziehen. Ein Ziehgriff mit Schnäpper hält die Tür zu, wenn du sie von außen heranziehst; abgeschlossen ist sie damit aber nicht.', 'Mit einem Schloss außen schließt du die Tür auch von draußen mit dem Schlüssel ab.'], tipp: 'Gehst du oft über die Terrasse ums Haus und willst die Tür zuschließen, nimm die abschließbare Variante.', ico: () => ICO.art('balkon'), see: ['balkon', 'griff'] },
  basisschutz: { s: 'Basisschutz', t: 'Was ist der Basisschutz?', x: ['Basisschutz heißt: ein normaler Beschlag, wie er in fast jedem Fenster steckt. Er hält das Fenster dicht geschlossen, gegen einen Einbruch mit Werkzeug bietet er wenig.', 'Für Fenster, an die niemand ohne Leiter herankommt, reicht das meist aus.'], tipp: 'Ist das Fenster leicht erreichbar, etwa im Erdgeschoss oder vom Garagendach aus, empfiehlt die Polizei RC2.', ico: () => schildIco(''), see: ['rc2', 'pilzkopf'] },
  rc1n: { s: 'RC1 N', t: 'Was ist RC1 N?', x: ['RC1 N ist die unterste Widerstandsklasse nach DIN EN 1627. Das Fenster hält körperlicher Gewalt wie Treten oder Hochschieben stand, gegen Werkzeug hilft es kaum.', 'Das N heißt: ohne geprüftes Sicherheitsglas. Die App bietet RC1 N nicht mehr an, weil die Polizei für erreichbare Fenster RC2 empfiehlt.'], tipp: 'Steht RC1 N in einem älteren Aufmaß, frag deinen Fensterbauer, ob sich der Schritt zu RC2 lohnt.', ico: () => schildIco('rc1'), see: ['rc2', 'basisschutz'] },
  rc2: { s: 'RC2', t: 'Was heißt RC2?', x: ['Eine Widerstandsklasse gegen Einbruch nach DIN EN 1627. Ein RC2-Fenster hält einem Gelegenheitstäter mit einfachem Werkzeug wie Schraubendreher, Zange oder Keil mindestens drei Minuten stand.', 'Dafür hat es Pilzkopfzapfen rundum, Sicherheitsschließstücke, einen abschließbaren Griff und Sicherheitsglas. Die meisten Täter geben nach wenigen Minuten auf.'], tipp: 'Die Polizei empfiehlt RC2 für alle leicht erreichbaren Fenster und Türen. Für die Förderung reicht mit RC2 ein Uw von 1,1.', ico: () => schildIco('rc2'), see: ['pilzkopf', 'vsg', 'basisschutz', 'rc1n'] },
  pilzkopf: { s: 'Pilzköpfe', t: 'Was sind Pilzköpfe?', x: ['Pilzkopfzapfen sitzen rundum im Flügel und greifen beim Schließen hinter stählerne Schließstücke im Rahmen. Durch ihre Form lassen sie sich nicht einfach aushebeln.', 'Ein normaler Beschlag hat runde Zapfen, die beim Hebeln leichter herausrutschen. Bei RC2 sitzen Pilzköpfe an allen Seiten des Flügels.'], tipp: 'Im Modell siehst du die Pilzköpfe, wenn du RC2 wählst: Sie rasten nacheinander ein.', ico: pilzIco, see: ['rc2', 'basisschutz'] },
  /* Sonnen- und Sichtschutz */
  sonnenschutz: { s: 'Sonnenschutz außen', t: 'Welcher Sonnenschutz außen?', x: ['Ein Rollladen dunkelt ganz ab und dämmt zusätzlich. Ein Raffstore hat kippbare Lamellen: Du lenkst das Licht und behältst den Blick nach draußen. Ein Screen ist ein Stoff, durch den du hinaussiehst, während er die Hitze abhält.', 'Sonnenschutz außen hält die Wärme ab, bevor sie das Glas erreicht. Das wirkt viel stärker als jeder Schutz innen.'], tipp: 'Schlafzimmer: Rollladen. Wohnräume mit viel Sonne: Raffstore oder Screen. Ist schon ein Kasten da, kann er oft bleiben.', ico: () => ICO.sonne('raffstore'), see: ['rollladen', 'raffstore', 'screen', 'antrieb'] },
  rollladen: { s: 'Rollladen', t: 'Was ist ein Rollladen?', x: ['Ein Rollladen besteht aus Lamellen aus Kunststoff oder Aluminium, dem Panzer. Er rollt sich in einem Kasten über dem Fenster auf und läuft seitlich in Führungsschienen.', 'Der Kasten sitzt als Aufsatz auf dem Fenster, als Vorbau außen davor oder als Einbaukasten im Mauerwerk. Alte Einbaukästen mit Deckel im Raum sind oft schlecht gedämmt.'], tipp: 'Beim Fenstertausch ist der Moment günstig, einen alten Kasten dämmen zu lassen oder ihn durch einen Aufsatzkasten zu ersetzen.', ico: () => ICO.sonne('rollladen'), see: ['aufsatz', 'vorbau', 'antrieb'] },
  raffstore: { s: 'Raffstore', t: 'Was ist ein Raffstore?', x: ['Eine Außenjalousie aus Lamellen aus Aluminium. Die Lamellen lassen sich kippen: Du lenkst das Licht, blendest die Sonne aus und siehst trotzdem hinaus. Hochgezogen liegen sie als Paket in einem Kasten über dem Fenster.', 'Der Behang läuft in seitlichen Schienen. Bei starkem Wind muss er hochfahren; das übernimmt ein Windwächter.'], tipp: 'Raffstores werden meist elektrisch bedient. Plane deshalb gleich Strom am Fenster mit ein.', ico: () => ICO.sonne('raffstore'), see: ['sonnenschutz', 'screen', 'antrieb'] },
  screen: { s: 'Screen', t: 'Was ist ein Screen?', x: ['Ein textiler Sonnenschutz außen, der wie ein Rollo herunterfährt. Das Gewebe lässt dich hinaussehen, hält aber Hitze und Blicke ab.', 'Mit seitlichen Führungen wie bei einem Reißverschluss, ZIP genannt, bleibt der Stoff straff und auch bei Wind stabil.'], tipp: 'Dunkle Stoffe geben die beste Durchsicht nach draußen, helle werfen mehr Wärme zurück.', ico: () => ICO.sonne('screen'), see: ['raffstore', 'sonnenschutz'] },
  aufsatz: { s: 'Aufsatzkasten', t: 'Was ist ein Aufsatzrollladen?', x: ['Der Rollladenkasten sitzt direkt oben auf dem Fensterrahmen und wird mit dem Fenster zusammen eingebaut. Er ist gedämmt und von außen kaum zu sehen, wenn die Fassade darüber geputzt ist.', 'Dafür wird das Fenster selbst etwas niedriger, denn der Kasten braucht Platz in der Öffnung.'], tipp: 'Beim Fenstertausch die häufigste Lösung: Alles kommt aus einer Hand und schließt dicht an.', ico: () => ICO.roll('aufsatz'), see: ['vorbau', 'rollladen'] },
  vorbau: { s: 'Vorbaukasten', t: 'Was ist ein Vorbaurollladen?', x: ['Der Kasten wird außen vor die Fassade oder in die Laibung gesetzt. Ideal zum Nachrüsten, weil am Fenster selbst nichts geändert werden muss.', 'Von außen sieht man ihn als Kasten über dem Fenster. Die Glasfläche bleibt dafür so groß, wie sie ist.'], tipp: 'Wird die Fassade gedämmt, kann der Kasten oft unter Dämmung und Putz verschwinden. Frag nach einer Unterputz-Variante.', ico: () => ICO.roll('vorbau'), see: ['aufsatz', 'rollladen'] },
  antrieb: { s: 'Antrieb', t: 'Gurt, Kurbel, Motor, Smart Home oder Solar?', x: ['Beim Gurt ziehst du den Rollladen von Hand hoch, der Gurt wickelt sich innen in einem kleinen Kasten auf. Eine Kurbel ist leichtgängiger und wird oft bei schweren Rollläden oder Raffstores genommen.', 'Elektrisch fährt der Behang auf Knopfdruck, dafür braucht es Strom am Fenster. Mit Smart Home steuerst du ihn per App, nach Uhrzeit oder Sonnenstand. Solar heißt: Ein kleines Modul am Kasten lädt einen Akku, ganz ohne Stromanschluss.'], tipp: 'Ein Funkmotor braucht nur Strom am Fenster, aber kein Kabel zum Schalter. Das spart beim Nachrüsten Schlitze in der Wand.', ico: motorIco, see: ['rollladen', 'raffstore'] },
  innenschutz: { s: 'Rollo, Plissee, Jalousie', t: 'Rollo, Plissee oder Jalousie innen?', x: ['Innenliegender Sonnen- und Sichtschutz, aus Stoff oder Aluminium. Rollos rollen auf, Plissees falten sich und lassen sich von oben und unten verschieben, Jalousien haben kippbare Lamellen.', 'Gegen Hitze hilft außen mehr als innen; innen geht es um Blendung und Sichtschutz.'], tipp: 'Ein Plissee von unten nach oben geschoben schützt vor Blicken und lässt oben Licht herein.', ico: () => ICO.innen('rollo'), see: ['sonnenschutz', 'insekt'] },
  insekt: { s: 'Insektenschutz', t: 'Spannrahmen, Drehrahmen, Plissee oder Rollo?', x: ['Spannrahmen werden in den Fensterrahmen geklemmt und bleiben drin. Drehrahmen gehen auf wie eine Tür, gut für Balkontüren, durch die du oft gehst. Ein Rollo rollt sich in eine kleine Kassette oben am Fenster, wenn du es nicht brauchst.', 'Plissees falten sich zur Seite zusammen und sparen Platz, besonders an breiten Türen. Eine Pendeltür schwingt in beide Richtungen und fällt von selbst zu; vor großen Schiebetüren läuft eine Schiebeanlage in Schienen. Alle werden passend zum Element gefertigt.'], tipp: 'Für Fenster, die du meist kippst, reicht ein Spannrahmen. Für Türen, die du täglich nutzt, ist ein Drehrahmen oder Plissee bequemer.', ico: () => ICO.insekt('dreh'), see: ['innenschutz'] },
  /* Fensterbank und Montage */
  fensterbank: { s: 'Fensterbank', t: 'Fensterbank innen und außen', x: ['Innen gibt es zum Beispiel Werzalit, eine pflegeleichte beschichtete Platte, dazu Naturstein oder Holz. Außen ist sie meist aus Aluminium, manchmal aus Naturstein.', 'Die äußere Fensterbank leitet Regenwasser von der Fassade weg. Sie braucht Gefälle nach außen und steht mit einer Tropfkante einige Zentimeter über die Fassade.'], tipp: 'Ist die alte Fensterbank innen noch schön, kann sie oft bleiben. Außen wird sie beim Fenstertausch meist neu gesetzt.', ico: () => ICO.bank('aussen'), see: ['werzalit', 'laibung'] },
  werzalit: { s: 'Werzalit', t: 'Was ist Werzalit?', x: ['Werzalit ist eine bekannte Marke für Fensterbänke aus gepresstem Holzwerkstoff mit harter, beschichteter Oberfläche. Sie sind feuchtigkeitsbeständig, kratzfest und leicht zu reinigen.', 'Es gibt sie in Weiß, in Steinoptik und in vielen Dekoren, mit abgerundeter Vorderkante.'], tipp: 'Über einem Heizkörper ist eine Fensterbank mit Lüftungsschlitzen sinnvoll, damit die warme Luft aufsteigen kann.', ico: () => ICO.bank('innen'), see: ['fensterbank'] },
  montage: { s: 'Montageleistungen', t: 'Was gehört zur Montage?', x: ['Beim Tausch baut der Fensterbauer das alte Fenster aus und entsorgt es. Dann setzt er das neue ein, befestigt es in der Wand und dichtet die Fuge ab.', 'Danach muss die Innenlaibung meist verputzt werden, weil der Ausbau Spuren hinterlässt. Das kann der Fensterbauer übernehmen oder ein Maler.'], tipp: 'Lass dir im Angebot genau aufschreiben, was drin ist: Ausbau, Entsorgung, RAL-Montage, Beiputz, Fensterbänke. Dann lassen sich Angebote vergleichen.', ico: () => [P(R(4, 10, 18, 44), WALL, INK, 0.8), P(R(42, 10, 18, 44), WALL, INK, 0.8), P(R(24, 14, 16, 36, 1), FR, INK, 1.2), P(R(27, 17, 10, 30), GL, INK, 0.6), P(L([22, 20], [24, 20]) + L([40, 20], [42, 20]) + L([22, 44], [24, 44]) + L([40, 44], [42, 44]), 'none', INK, 1.6)], see: ['ralmontage', 'beiputz'] },
  ralmontage: { s: 'RAL-Montage', t: 'Was ist RAL-Montage?', x: ['Einbau nach dem Montageleitfaden der RAL-Gütegemeinschaft in drei Ebenen: innen luftdicht, in der Mitte gedämmt, außen schlagregendicht und trotzdem dampfdurchlässig.', 'Das schützt die Fuge um das Fenster vor Zugluft, Feuchtigkeit und Schimmel.'], tipp: 'Frag, ob dein Fensterbauer nach Leitfaden montiert. Für die Förderung ist ein fachgerechter, luftdichter Einbau ohnehin Voraussetzung.', ico: () => [P(R(4, 10, 18, 44), WALL, INK, 0.8), P(R(42, 10, 18, 44), WALL, INK, 0.8), P(R(22, 18, 20, 4), '#5b9bd5'), P(R(22, 22, 20, 18), '#f2d27a'), P(R(22, 40, 20, 4), '#8e8e93'), P(R(26, 26, 12, 10, 1), FR, INK, 1.1)], see: ['montage', 'lueftung'] },
  beiputz: { s: 'Beiputz', t: 'Was heißt Innenlaibung verputzen?', x: ['Beim Ausbau des alten Fensters bricht meist etwas Putz an der Laibung ab. Nach dem Einbau wird die Fuge am neuen Rahmen verputzt oder mit einer Leiste abgedeckt.', 'Der Fachbegriff dafür ist Beiputz. Danach braucht die Laibung oft noch Farbe.'], tipp: 'Tapete oder Fliesen an der Laibung? Dann plane einen Maler oder Fliesenleger mit ein.', ico: () => ICO.anschlag('ohne'), see: ['montage', 'laibung'] },
  /* Projekt und Förderung */
  angaben: { s: 'Angaben zum Haus', t: 'Wozu die Angaben zum Haus?', x: ['Gebäude und Baujahr helfen deinem Fensterbauer, das Richtige anzubieten: Im Altbau ist mehr zu erwarten, im Baudenkmal gelten eigene Regeln. Aus der Zahl aller Fenster ergibt sich, ob ein Lüftungskonzept nötig wird.', 'Zeit, Budget und Förderung zeigen ihm, wie er planen soll. Alles ist freiwillig.'], tipp: 'Bist du unsicher, wähle die nächstliegende Antwort. Dein Fensterbauer fragt ohnehin noch einmal nach.', ico: hausIco, see: ['gebaeude', 'baujahr', 'lueftung', 'foerderung'] },
  gebaeude: { s: 'Gebäude', t: 'Warum spielt die Art des Gebäudes eine Rolle?', x: ['In einer Eigentumswohnung gehören die Fenster meist zum Gemeinschaftseigentum. Dann muss die Eigentümerversammlung dem Tausch zustimmen, oft auch Farbe und Teilung.', 'Steht das Haus unter Denkmalschutz, braucht der Tausch eine Genehmigung. Material, Sprossen und Farbe können vorgeschrieben sein.'], tipp: 'Kläre die Zustimmung, bevor du Angebote einholst. Dann weißt du, was überhaupt geht.', ico: hausIco, see: ['echt', 'angaben'] },
  baujahr: { s: 'Baujahr', t: 'Wozu das Baujahr?', x: ['Am Baujahr erkennt dein Fensterbauer, was ihn erwartet: In älteren Häusern sind Öffnungen oft nicht im Winkel, Rollladenkästen schlecht gedämmt und Wände anders aufgebaut.', 'Für den Steuerbonus muss das Haus älter als zehn Jahre sein. Fensterbänke aus Faserzement, verbaut bis 1993, werden vor dem Ausbau auf Asbest geprüft.'], tipp: 'Kennst du das Jahr nicht genau, reicht die Spanne. Oft steht es im Kaufvertrag oder in der Bauakte.', ico: hausIco, see: ['foerderung', 'raender'] },
  lueftung: { s: 'Lüftungskonzept', t: 'Brauche ich ein Lüftungskonzept?', x: ['Neue Fenster sind sehr dicht. Wird mehr als ein Drittel der Fenster getauscht, ist nach der Norm DIN 1946-6 ein Lüftungskonzept erforderlich. Es zeigt, ob zusätzlich gelüftet werden muss, damit kein Schimmel entsteht.', 'Oft reichen kleine Lüfter im Fensterfalz. Um das Konzept kümmert sich dein Fensterbauer.'], tipp: 'Lüfter im Fensterfalz arbeiten ohne Strom und fallen kaum auf. Frag danach, wenn ein Konzept nötig wird.', ico: () => [P(R(16, 8, 32, 48, 1.2), FR, INK, 1.3), P(R(20, 12, 24, 40), GL, INK, 0.6), P('M4 20c4-3 8 3 12 0M4 30c4-3 8 3 12 0M48 34c4-3 8 3 12 0M48 44c4-3 8 3 12 0', 'none', '#5b9bd5', 1.8)], see: ['ralmontage', 'angaben'] },
  foerderung: { s: 'Förderung', t: 'BAFA-Zuschuss oder Steuerbonus?', x: ['BAFA: 15 % Zuschuss für neue Fenster und Außentüren. Ein Energieeffizienz-Experte muss den Antrag begleiten, gestellt wird er vor Beginn der Arbeiten. Den Vertrag erst mit Förderklausel unterschreiben.', 'Steuerbonus: 20 % der Kosten über drei Jahre von der Steuer abziehen, für selbst bewohnte Häuser, die älter als zehn Jahre sind. Der Fachbetrieb stellt eine Bescheinigung nach amtlichem Muster aus.', 'Beides gilt nur, wenn die Fenster gut dämmen: Uw höchstens 0,95, mit Einbruchschutz RC2 oder barrierearmer Schwelle höchstens 1,1. Für dieselben Fenster gibt es nur eins von beiden.'], tipp: 'Unterschreibe keinen Vertrag, bevor der Förderweg geklärt ist. Ein zu früh unterschriebener Vertrag kann dich den Zuschuss kosten.', ico: () => [...ICO.glas('3'), P(C(52, 14, 9), '#f2d27a', INK, 1.1), P(L([52, 9], [52, 19]) + L([49.5, 11], [54.5, 11]) + L([49.5, 17], [54.5, 17]), 'none', INK, 1.1)], see: ['uwert', 'lueftung'] },
  zeitraum: { s: 'Zeitraum', t: 'Wann soll es losgehen?', x: ['Fenster werden nach dem Feinaufmaß einzeln gefertigt. Bis zum Einbau vergehen meist einige Wochen, in der Saison auch mehr.', 'Mit deinem Zeitraum plant der Fensterbauer Termin und Lieferung. Willst du erst Angebote vergleichen, wähle „Später, erst Angebote“.'], tipp: 'Für den Zuschuss vom BAFA muss der Antrag vor Beginn gestellt sein. Plane dafür ein paar Wochen ein.', ico: kalenderIco, see: ['foerderung', 'feinaufmass'] },
  budget: { s: 'Budget', t: 'Warum fragt die App nach dem Budget?', x: ['Mit deinem Budget kann der Fensterbauer gezielt anbieten: wo es sich lohnt, mehr auszugeben, und wo die einfache Lösung reicht.', 'Die Angabe ist freiwillig und bindet dich nicht. „Weiß ich noch nicht“ ist eine gute Antwort, wenn du erst Preise kennenlernen willst.'], tipp: 'Denk an das Drumherum: Fensterbänke, Rollläden, Putz und Entsorgung machen einen spürbaren Teil des Preises aus.', ico: muenzIco, see: ['foerderung', 'montage'] },
  kontakt: { s: 'Kontakt', t: 'Wozu die Kontaktdaten?', x: ['Sie stehen oben auf deinem Aufmaßblatt, damit sich der Fensterbauer mit dem Angebot bei dir melden kann. Das Blatt bekommt nur, wem du es gibst.', 'Alles ist freiwillig. Ohne Kontaktdaten gibst du sie dem Fensterbauer eben selbst mit.'], tipp: 'Eine Handynummer und die Zeit, zu der du gut erreichbar bist, sparen viel Hin und Her.', ico: telefonIco, see: ['aufmassblatt'] },
  aufmassblatt: { s: 'Aufmaßblatt', t: 'Was steht im Aufmaßblatt?', x: ['Dein Fensterbauer bekommt das Aufmaß als PDF: je Fenster eine Zeichnung mit allen Maßen, deine Wünsche, die Auswertung der Fotos und deine Notizen an der passenden Stelle.', 'Oben steht, was noch zu klären ist, etwa eine Absturzsicherung oder offene Wünsche. So weiß er vor dem Termin, worüber ihr sprechen müsst.'], tipp: 'Je vollständiger deine Angaben, desto weniger Rückfragen und desto genauer das Angebot.', ico: () => ICO.ref('a4'), see: ['notizen', 'offen', 'feinaufmass'] },
  design: { s: 'Gestaltung übernehmen', t: 'Was heißt Gestaltung übernehmen?', x: ['Hast du schon ein Fenster gespeichert, übernimmst du dessen Gestaltung mit einem Tipp: Material, Farben, Glas, Sprossen, Griff, Einbruchschutz, Sonnenschutz, Fensterbänke und Montage. Maße, Lage und Flügel bleiben die des neuen Fensters.', 'Danach speicherst du gleich oder gehst die Fragen einzeln durch und passt an.'], tipp: 'Ideal, wenn im ganzen Haus dieselben Fenster kommen: einmal gestalten, den Rest nur noch messen.', ico: zweiIco, see: ['offen'] },
  offen: { s: 'Weiß ich noch nicht', t: 'Was passiert bei „Weiß ich noch nicht“?', x: ['Du musst nicht alles selbst entscheiden. Tippst du „Weiß ich noch nicht“, bleibt die Frage offen; im Modell steht dann ein neutrales Weiß.', 'Dein Fensterbauer sieht im Aufmaß, was offen ist, und berät dich dazu im Angebot. Tippst du später eine Option an, ist die Frage entschieden.'], tipp: 'Lieber offen lassen als raten. Eine falsch gewählte Option fällt vielleicht erst beim Einbau auf.', ico: frageIco, see: ['aufmassblatt', 'notizen'] },
  notizen: { s: 'Notizen', t: 'Wofür sind die Notizen?', x: ['An jedem Schritt kannst du über den Knopf „Notiz“ etwas für deinen Fensterbauer festhalten, zum Beispiel „Laibung links ausgebrochen“ oder „Farbe wie die Haustür“.', 'Die Notiz geht mit dem Aufmaß an ihn und steht dort genau an der Stelle, zu der du sie geschrieben hast. Je Stelle passen bis zu 500 Zeichen.'], tipp: 'Kurz und konkret hilft am meisten: was, wo und warum. Die Fotos zeigen den Rest.', ico: stiftIco, see: ['aufmassblatt', 'offen'] },
  /* Detailtiefe (#46): Aufbau, Material, Glas, Beschlag, Sonnenschutz, Einbau; je mit Gruppe in GLOSS_GRUPPEN */
  seitenteil: { s: 'Seitenteil', t: 'Was ist ein Seitenteil?', x: ['Ein festes Glasfeld neben den Flügeln, im selben Rahmen. Es bringt Licht, ohne dass ein Flügel mehr nötig ist.', 'Die Breite gibst du an, die Flügel teilen sich den Rest. Ein Seitenteil geht nicht auf und wird von außen geputzt.'], tipp: 'Schmale Seitenteile neben einer Balkontür machen den Raum heller, ohne dass die Tür breiter und schwerer wird.', ico: () => winIco({ teilung: '3', sashes: [{ t: 'F', din: 'L' }, { t: 'DK', din: 'L' }, { t: 'F', din: 'R' }] }, 4, 10, 56, 44), see: ['fest', 'pfosten'] },
  kvd: { s: 'Kipp vor Dreh', t: 'Was heißt Kipp vor Dreh?', x: ['Beim üblichen Dreh-Kipp-Beschlag dreht der Flügel auf, wenn der Griff waagerecht steht, und kippt, wenn er nach oben zeigt. Kipp vor Dreh tauscht das: Die erste Griffstellung kippt.', 'So kann ein Kind das Fenster nicht aus Versehen ganz öffnen. Ganz auf geht es erst mit einer weiteren Drehung, oft mit abschließbarem Griff.'], tipp: 'Sinnvoll im Kinderzimmer und überall, wo meist nur gekippt wird. Zum Putzen drehst du den Griff einfach weiter.', ico: () => ICO.typ('DK'), see: ['dk', 'kindersicherung'] },
  paneel: { s: 'Paneel', t: 'Was ist ein Paneel?', x: ['Eine gedämmte, undurchsichtige Platte statt Glas, meist unten in der Tür. Sie schützt vor Blicken und vor Stößen, etwa durch Möbel, Bälle oder einen Hund.', 'Das Paneel hat die Farbe des Rahmens und dämmt fast so gut wie das Glas darüber. Die Höhe gibst du ab der Unterkante des Flügels an.'], tipp: 'Steht innen ein Heizkörper oder ein Sofa vor der Tür, sieht ein Paneel bis zu dieser Höhe ruhiger aus als Glas.', ico: () => ICO.ul('paneel'), see: ['unterlicht', 'balkon'] },
  eckhst: { s: 'Hebe-Schiebe-Tür über Eck', t: 'Was ist eine Hebe-Schiebe-Tür über Eck?', x: ['Zwei Hebe-Schiebe-Türen treffen in der Ecke ohne Pfosten zusammen. Sind beide offen, ist die Ecke ganz frei und Wohnzimmer und Terrasse gehen ineinander über.', 'Das Modell zeigt eine Seite, die zweite plant dein Fensterbauer mit. Die Statik der Ecke klärt er vor Ort.'], tipp: 'Über Eck braucht der Sturz eine eigene Abstützung, weil der Pfosten fehlt. Frag früh nach, ob das bei deinem Haus geht.', ico: () => ICO.hst('A'), see: ['hst'] },
  holzart: { s: 'Holzart', t: 'Welche Holzarten gibt es?', x: ['Kiefer und Fichte sind der Standard: gut zu verarbeiten und preiswert. Lärche ist harzreicher und hält Wetter besser aus. Eiche ist hart und edel, aber teurer. Meranti ist ein dunkles, stabiles Tropenholz.', 'Lasuren lassen die Maserung sichtbar, deckende Farben nicht.'], tipp: 'Soll das Holz deckend gestrichen werden, reicht meist Kiefer. Für Lasur und sichtbare Maserung lohnt sich Lärche oder Eiche.', ico: () => ICO.material('holz'), see: ['ral'] },
  profil: { s: 'Profilform und Rahmenansicht', t: 'Was heißen Profilform und Rahmenansicht?', x: ['Die Profilform beschreibt die Kanten: kantig wirkt modern, gerundet weich, ein Stilprofil mit Kehle passt zum Altbau.', 'Die Rahmenansicht ist die sichtbare Breite von Rahmen und Flügel. Schmale Ansichten lassen mehr Licht herein, gehen aber nicht bei jedem Material und jeder Größe.'], tipp: 'Im Altbau mit Sprossen wirkt ein Stilprofil stimmig; bei großen modernen Flächen fällt ein schmaler, kantiger Rahmen am wenigsten auf.', ico: () => ICO.material('kunststoff'), see: ['ral'] },
  oberflaeche: { s: 'Oberfläche', t: 'Glatt, matt oder strukturiert?', x: ['Die Oberfläche bestimmt, wie Rahmen und Flügel aussehen und sich anfühlen. Glatt glänzt leicht und ist der Standard bei Kunststoff, matt wirkt ruhiger und edler.', 'Strukturiert ist fein gekörnt wie eine Pulverbeschichtung, Holzoptik trägt eine Maserung. Die Farbe bleibt dabei dieselbe.'], tipp: 'Matte und strukturierte Oberflächen zeigen Fingerabdrücke und kleine Kratzer weniger, sind aber etwas mühsamer zu putzen.', ico: () => ICO.material('kunststoff'), see: ['holzdekor', 'ral'] },
  dichtung: { s: 'Dichtung', t: 'Welche Rolle spielt die Farbe der Dichtung?', x: ['Rund ums Glas und zwischen Rahmen und Flügel liegen Gummidichtungen. Man sieht sie als schmalen Streifen.', 'Schwarz fällt bei dunklen Rahmen nicht auf, Grau oder Beige wirken bei hellen Rahmen und Holz ruhiger.'], tipp: 'Bei weißen Fenstern sieht eine graue Dichtung sauberer aus als eine schwarze, die jeden Spalt betont.', ico: () => ICO.glas('3'), see: ['abstandhalter'] },
  abstandhalter: { s: 'Abstandhalter', t: 'Was ist der Abstandhalter?', x: ['Ein Steg zwischen den Scheiben am Glasrand. Er hält den Abstand und ist am Rand zu sehen.', '„Warme Kante“ heißt: aus Kunststoff oder Edelstahl statt Aluminium, das dämmt besser. Die Farbe passt man meist dem Rahmen an.'], tipp: 'Eine warme Kante senkt das Kondenswasser am Glasrand im Winter. Für die Förderung ist sie heute fast immer dabei.', ico: () => ICO.glas('3'), see: ['uwert', 'dichtung'] },
  glasarten: { s: 'Weißglas, Vogelschutz, selbstreinigend', t: 'Weißglas, Vogelschutz, selbstreinigend?', x: ['Weißglas hat weniger Eisen und keinen Grünstich, Farben dahinter wirken echter. Vogelschutzglas trägt ein feines Muster, das Vögel sehen, damit sie nicht dagegen fliegen.', 'Selbstreinigendes Glas hat außen eine Schicht, an der Schmutz mit dem Regen abläuft.'], tipp: 'Vogelschutz lohnt sich bei großen Scheiben mit Blick ins Grüne und an Ecken mit Glas auf zwei Seiten.', ico: () => ICO.glas('3'), see: ['schall', 'vsg'] },
  kindersicherung: { s: 'Kindersicherung', t: 'Wie sichert man Fenster gegen Kinder?', x: ['Ein abschließbarer Griff lässt sich nur mit Schlüssel drehen. Eine Drehsperre erlaubt nur das Kippen, ganz auf geht das Fenster erst nach dem Entriegeln.', 'Dazu passen Kipp vor Dreh und ein Griff, der höher sitzt.'], tipp: 'Im Obergeschoss gehört eine Sicherung an jedes Fenster, das ein Kind erreichen kann, auch mit einem Stuhl.', ico: () => ICO.griff('abschliessbar'), see: ['kvd'] },
  baender: { s: 'Bänder', t: 'Bänder sichtbar oder verdeckt?', x: ['Bänder sind die Scharniere des Flügels. Sichtbare liegen auf dem Rahmen. Verdeckte liegen im Falz, man sieht sie bei geschlossenem Fenster nicht.', 'Verdeckte Bänder wirken ruhiger und sind leichter sauber zu halten, kosten aber etwas mehr.'], tipp: 'Bei sehr schweren Flügeln, etwa mit 3-fach-Glas und Sicherheitsglas, frag nach, ob verdeckte Bänder das Gewicht tragen.', ico: () => [...ICO.typ('DK'), P(R(10.5, 14, 3, 9, 1), INK), P(R(10.5, 41, 3, 9, 1), INK)], see: ['dinlr'] },
  softclose: { s: 'Griffmuschel und Softclose', t: 'Was sind Griffmuschel und Softclose?', x: ['Die Griffmuschel ist eine Mulde außen am Schiebeflügel. Mit ihr schiebst du die Tür von der Terrasse aus.', 'Softclose bremst den schweren Flügel am Ende sanft ab, er schlägt nicht an.'], tipp: 'Wer oft von draußen hereinkommt, will die Muschel außen. Softclose schont Finger und Beschlag, gerade wenn Kinder schieben.', ico: () => ICO.hst('A'), see: ['hst'] },
  zwang: { s: 'Zwangssteuerung', t: 'Was ist eine Zwangssteuerung?', x: ['Bei der PSK-Tür kippt der Flügel erst und schiebt sich dann vor das feste Teil. Die Zwangssteuerung sorgt dafür, dass es nur in dieser Reihenfolge geht.', 'So wird der Beschlag nicht falsch belastet, und der Flügel springt nicht aus der Führung.'], tipp: 'Bei großen und schweren PSK-Flügeln ist die Zwangssteuerung fast immer sinnvoll; sie verhindert teure Reparaturen am Beschlag.', ico: () => ICO.psk('A'), see: ['psk'] },
  oeffner: { s: 'Fensteröffner', t: 'Was ist ein elektrischer Fensteröffner?', x: ['Ein kleiner Motor kippt das Fenster per Taster, App oder Sensor, etwa ein hohes Oberlicht oder zum Lüften nach Zeitplan.', 'Er braucht Strom am Fenster, das klärt dein Fensterbauer. Mit einem Regensensor schließt er das Fenster von selbst, wenn es zu regnen beginnt.'], tipp: 'Für Fenster, an die du schlecht herankommst, etwa über der Küchenzeile, ist ein Öffner bequemer als jede Stange.', ico: () => ICO.typ('K'), see: ['kipp'] },
  falzluefter: { s: 'Lüfter im Fenster', t: 'Was macht ein Lüfter im Fenster?', x: ['Neue Fenster sind sehr dicht. Ein Falzlüfter lässt auch bei geschlossenem Fenster ein wenig Luft durch, das hilft gegen Feuchte und Schimmel.', 'Ein Schalldämmlüfter mit Filter tut das leiser und hält Pollen zurück. Ob das Lüften so reicht, zeigt das Lüftungskonzept.'], tipp: 'In Schlafzimmer und Bad, wo viel Feuchte entsteht, ist ein Lüfter oft der einfachste Teil des Lüftungskonzepts.', ico: () => ICO.typ('DK'), see: ['lueftung'] },
  alarmkontakt: { s: 'Alarmkontakt', t: 'Was ist ein Alarmkontakt?', x: ['Ein Magnetkontakt im Rahmen meldet der Alarmanlage, ob das Fenster offen ist. Die bessere Variante prüft auch, ob es verriegelt ist.', 'Die Kabel legt der Fensterbauer am besten gleich beim Einbau.'], tipp: 'Auch ohne Alarmanlage heute lohnt sich ein Leerrohr zum Fenster: Nachrüsten ist später viel aufwendiger.', ico: () => ICO.griff('standard'), see: ['rcstufen'] },
  rcstufen: { s: 'RC2 N, RC2, RC3', t: 'RC2 N, RC2 und RC3: was ist der Unterschied?', x: ['RC steht für Widerstandsklasse. RC2 hält einen Täter mit einfachem Werkzeug drei Minuten auf: Pilzköpfe rundum, abschließbarer Griff, geprüftes Sicherheitsglas. Das empfiehlt die Polizei für leicht erreichbare Fenster.', 'RC2 N hat dieselben Beschläge, aber kein geprüftes Glas. Das ist günstiger, zählt für die Förderung aber nicht als einbruchhemmend. RC3 hält auch stärkerem Werkzeug stand.'], tipp: 'Für Erdgeschoss und Terrassentür ist RC2 die übliche Wahl; RC3 lohnt sich vor allem bei Wertsachen oder abgelegenen Häusern.', ico: () => ICO.griff('abschliessbar'), see: ['rc2', 'vsg'] },
  fenstergitter: { s: 'Fenstergitter', t: 'Wann ein Fenstergitter?', x: ['Ein Gitter außen vor dem Fenster schützt dort, wo ein Einbrecher ungestört arbeiten kann, etwa am Kellerfenster oder an einem Fenster zur Rückseite.', 'Ziergitter sehen leichter aus, Stabgitter sind schlicht und stabil. Beide werden fest im Mauerwerk verankert, nicht nur verschraubt.'], tipp: 'Ein Gitter ersetzt keinen Fluchtweg: In Räumen, in denen jemand schläft, muss das Fenster im Notfall frei bleiben.', ico: () => ICO.art('fest'), see: ['rcstufen', 'rc2'] },
  sensor: { s: 'Steuerung', t: 'Welche Steuerungen gibt es?', x: ['Eine Zeitschaltuhr fährt den Behang zu festen Zeiten. Der Sonnensensor schließt, wenn die Sonne aufs Fenster scheint. Der Windwächter fährt Raffstores bei Sturm hoch, damit nichts kaputtgeht.', 'Mit dem Handsender bedienst du alles per Funk.'], tipp: 'Bei Raffstores gehört der Windwächter eigentlich immer dazu, sonst können die Lamellen beim ersten Sturm Schaden nehmen.', ico: () => ICO.sonne('raffstore'), see: ['raffstore'] },
  klappladen: { s: 'Klappläden', t: 'Was sind Klappläden?', x: ['Zwei Läden, die neben dem Fenster an der Fassade hängen und vors Fenster geklappt werden. Sie schützen vor Sonne und Blicken und prägen das Haus.', 'Lamellen lassen Luft und etwas Licht durch, Füllungen und Brettleisten dunkeln ganz ab.'], tipp: 'Neben dem Fenster braucht es auf jeder Seite so viel Wand, wie ein Laden breit ist. Miss das vorher nach.', ico: () => ICO.sonne('klappladen'), see: ['raffstore'] },
  unterputz: { s: 'Unterputzkasten', t: 'Was ist ein Unterputzkasten?', x: ['Der Rollladenkasten sitzt in der Wand über dem Fenster und wird überputzt. Außen sieht man nur den Behang und die Schienen.', 'Er braucht Platz im Sturz und wird meist beim Neubau oder mit einer neuen Fassade eingeplant.'], tipp: 'Wird die Fassade ohnehin gedämmt, ist das der Moment für einen Unterputzkasten. Beim reinen Fenstertausch ist ein Aufsatzkasten einfacher.', ico: () => ICO.roll('unterputz'), see: ['aufsatz', 'vorbau'] },
  sfarbe: { s: 'Farbe von Kasten und Schienen', t: 'Welche Farbe für Kasten und Schienen?', x: ['Kasten, Blende und Führungsschienen kannst du wie den Behang, wie den Rahmen außen oder in einer eigenen Farbe bestellen.', 'Wie der Behang wirkt alles aus einem Guss. Wie der Rahmen fällt der Sonnenschutz kaum auf, wenn er hochgefahren ist.'], tipp: 'Sind Rahmen und Behang verschieden, wirken Schienen in Rahmenfarbe meist ruhiger, weil sie neben dem Fenster liegen.', ico: () => ICO.sonne('rollladen'), see: ['rollladen', 'raffstore', 'ral'] },
  insektgewebe: { s: 'Gewebe Insektenschutz', t: 'Welche Gewebe gibt es für den Insektenschutz?', x: ['Das Standardgewebe ist grau und kaum zu sehen. Klarsichtgewebe ist noch feiner und fast durchsichtig.', 'Pollenschutz hält auch Blütenstaub ab, lässt aber etwas weniger Luft durch. Reißfestes Gewebe hält Krallen von Haustieren aus.'], tipp: 'Mit Allergie im Haus lohnt sich Pollenschutz im Schlafzimmer; mit Katze reißfestes Gewebe an der Tür, durch die sie geht.', ico: () => ICO.insekt('spann'), see: ['insekt'] },
  endkappen: { s: 'Endkappen und Überstand', t: 'Was sind Endkappen und Überstand?', x: ['Endkappen schließen die Fensterbank außen seitlich ab. An gedämmten Fassaden braucht es Gleitabschlüsse, damit die Bank sich bei Wärme dehnen kann, ohne den Putz zu reißen.', 'Der Überstand ist, wie weit die Bank vor der Fassade steht. 30 bis 40 mm leiten das Regenwasser von der Wand weg.'], tipp: 'Bei Wärmedämmverbundsystem nach Gleitabschlüssen fragen: Starre Kappen reißen dort oft schon im ersten Sommer den Putz.', ico: () => ICO.bank('aussen'), see: ['fensterbank'] },
  abdeckleiste: { s: 'Abdeckleisten', t: 'Was sind Abdeckleisten?', x: ['Schmale Leisten, die die Fuge zwischen Fensterrahmen und Wand abdecken. Das geht schneller als Verputzen und ist sauber, man sieht aber eine Kante.', 'Innen gibt es sie meist in der Farbe des Rahmens.'], tipp: 'Leisten sparen den Maler nach dem Einbau; wer eine glatte Laibung will, lässt lieber beiputzen.', ico: () => ICO.anschlag('ohne'), see: ['ralmontage', 'laibung'] },
  tiefe: { s: 'Planungstiefe und Standard', t: 'Wie genau planen, und was heißt „Standard“?', x: ['Du entscheidest, wie tief du planst: das Wichtigste, die üblichen Wünsche oder alles im Detail. Je tiefer, desto mehr Fragen, etwa zu Bändern, Dichtungen oder Endkappen.', 'Was du nicht beantwortest, nimmt dein Fensterbauer so, wie er es üblicherweise verbaut. Es landet nicht als offene Frage bei ihm, und du kannst die Tiefe jederzeit ändern.'], tipp: 'Für ein erstes Angebot reichen die üblichen Wünsche. Details wie Griffmodell oder Dichtungsfarbe klärst du gut auch später beim Feinaufmaß.', ico: frageIco, see: ['offen', 'aufmassblatt'] }
};
/* Verzeichnis „Begriffe“: nach Themen gruppiert, darin alphabetisch; jeder Eintrag steht genau einmal */
const GLOSS_GRUPPEN = [
  ['Aufmaß und Messen', ['referenz', 'rahmenmass', 'oeffnung-hoehe', 'element-hoehe', 'oeffnung-breite', 'element-breite', 'raender', 'laibung', 'anschlag', 'bruestung', 'rohbau', 'wandstaerke', 'feinaufmass', 'bestellmass', 'einbausituation', 'lage']],
  ['Element und Öffnen', ['elementart', 'ersatz', 'neuoeffnung', 'oeffnungsart', 'dk', 'dreh', 'kipp', 'fest', 'symbol', 'dinlr', 'aussen', 'blendrahmen', 'pfosten', 'stulp', 'oberlicht', 'unterlicht', 'festverglasung', 'balkon', 'hst', 'psk', 'fsw', 'schiebeseite', 'faltpaket', 'schwelle', 'fussboden', 'absturz', 'seitenteil', 'kvd', 'paneel', 'eckhst']],
  ['Material und Form', ['material', 'kunststoff', 'kunststoffalu', 'holz', 'holzalu', 'alu', 'form', 'holzart', 'profil', 'oberflaeche', 'dichtung']],
  ['Sprossen', ['sprossen', 'wiener', 'szr', 'auf', 'echt', 'sprossenbreite']],
  ['Farbe', ['ral', 'holzdekor', 'db703']],
  ['Glas', ['uwert', 'glasextras', 'schall', 'vsg', 'ornament', 'sonnenschutzglas', 'abstandhalter', 'glasarten']],
  ['Griff und Sicherheit', ['griff', 'grifffarbe', 'ziehgriff', 'basisschutz', 'rc1n', 'rc2', 'pilzkopf', 'kindersicherung', 'baender', 'softclose', 'zwang', 'oeffner', 'falzluefter', 'alarmkontakt', 'rcstufen', 'fenstergitter']],
  ['Sonnen- und Sichtschutz', ['sonnenschutz', 'rollladen', 'raffstore', 'screen', 'aufsatz', 'vorbau', 'antrieb', 'innenschutz', 'insekt', 'sensor', 'klappladen', 'unterputz', 'sfarbe', 'insektgewebe']],
  ['Fensterbank und Montage', ['fensterbank', 'werzalit', 'montage', 'ralmontage', 'beiputz', 'endkappen', 'abdeckleiste']],
  ['Projekt und Förderung', ['angaben', 'gebaeude', 'baujahr', 'lueftung', 'foerderung', 'zeitraum', 'budget', 'kontakt', 'aufmassblatt', 'design', 'offen', 'notizen', 'tiefe']]
].map(([t, k]) => [t, k.slice().sort((a, b) => GLOSS[a].s.localeCompare(GLOSS[b].s, 'de'))]);
const GLOSS_ORDER = [].concat.apply([], GLOSS_GRUPPEN.map((g) => g[1]));
/* ---------- Fenster-Modell ---------- */
let BID = 1;
const nid = () => 'b' + (BID++);
function sashesFor(k) {
  if (k === '1') return [{ t: 'DK', din: 'L' }];
  /* Stulp: links der Standflügel (steh, Drehflügel ohne Griff, über Kantriegel bzw. Stulpgetriebe im Falz bedient), rechts der Gehflügel */
  if (k === '2s') return [{ t: 'D', din: 'L', steh: true }, { t: 'DK', din: 'R' }];
  if (k === '3') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'DK', din: 'R' }];
  if (k === '4') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'F', din: 'R' }, { t: 'DK', din: 'R' }];
  return [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }];
}
/* Festverglasung: nur Felder, ohne Flügelrahmen und Griff */
const festFelder = (n) => Array.from({ length: Math.max(1, Math.min(4, num(n) || 1)) }, (x, i) => ({ t: 'F', din: i % 2 ? 'R' : 'L' }));
/* Hebe-Schiebe-Tür nach Schema: A = 1 Schiebeflügel vor 1 Festteil, A3 = 1 vor 2 Festteilen, C = 2 Schiebeflügel mittig vor 2 Festteilen,
   D = 2 Schiebeflügel, die in der Mitte schließen. richtung = Seite, auf der der Schiebeflügel geschlossen steht (L/R) */
function hstFluegel(schema, richtung) {
  const S = { t: 'S', din: richtung }, F = { t: 'F', din: richtung };
  if (schema === 'C') return [{ t: 'F', din: 'L' }, { t: 'S', din: 'R' }, { t: 'S', din: 'L' }, { t: 'F', din: 'R' }];
  if (schema === 'D') return [{ t: 'S', din: 'L' }, { t: 'S', din: 'R' }];
  if (schema === 'A3') return richtung === 'L' ? [S, F, F] : [F, F, S];
  return richtung === 'L' ? [S, F] : [F, S];
}
/* Faltschiebewand: n Faltflügel, der Gehflügel (Tür im Alltag) steht am Ende gegenüber dem Paket. Bei „Beide Seiten“ ist das die Mitte,
   wo die beiden Pakete zusammenstoßen: der letzte Flügel des linken Pakets, am Nachbarn angeschlagen, mit dem Griff zur Mitte */
function fswFluegel(n, schema, geh) {
  n = Math.max(2, Math.min(7, num(n) || 3));
  const out = Array.from({ length: n }, (x, i) => ({ t: 'X', din: schema === 'rechts' ? 'R' : 'L' }));
  if (geh && n > 1) { const i = schema === 'rechts' ? 0 : schema === 'geteilt' ? Math.ceil(n / 2) - 1 : n - 1; out[i] = { t: 'P', din: schema === 'rechts' ? 'R' : 'L' }; }
  return out;
}
/* Ohne Gehflügel bedient man die Faltwand am freien Ende der Kette: dieser Flügel trägt den Griff, auf der Seite, die zuletzt schließt */
const fswBedien = (w) => { if (w.art !== 'fsw' || w.sashes.some((x) => x.t === 'P')) return -1; const n = w.sashes.length, sc = (w.fsw || {}).schema; return sc === 'rechts' ? 0 : sc === 'geteilt' ? Math.ceil(n / 2) - 1 : n - 1; };
/* PSK-Tür: A = Schiebeflügel (kippbar) vor einem Festteil, A3 = vor zwei Festteilen, C = zwei Schiebeflügel mittig vor zwei
   Festteilen; richtung = Seite, auf der der Flügel geschlossen steht */
function pskFluegel(schema, richtung) {
  const S = { t: 'PS', din: richtung }, F = { t: 'F', din: richtung };
  if (schema === 'C') return [{ t: 'F', din: 'L' }, { t: 'PS', din: 'R' }, { t: 'PS', din: 'L' }, { t: 'F', din: 'R' }];
  if (schema === 'A3') return richtung === 'L' ? [S, F, F] : [F, F, S];
  return richtung === 'L' ? [S, F] : [F, S];
}
/* Wechsel der Elementart: Flügel, Teilung und Griff passend setzen; Sprossen, Ober- und Unterlicht zurück auf Standard */
function artSetzen(w, art) {
  w.art = art;
  if (art === 'fest') { w.teilung = '2p'; w.sashes = festFelder(2); w.ol = false; w.ul = false; w.griff = 'ohne'; }
  else if (art === 'hst') { w.hst = Object.assign({ schema: 'A', richtung: 'R', schwelle: 'flach' }, w.hst || {}); w.sashes = hstFluegel(w.hst.schema, w.hst.richtung); w.teilung = String(w.sashes.length); w.ol = false; w.ul = false; w.form = 'rechteck'; if (!OPT.hstGriff.some((o) => o.k === w.griff)) w.griff = 'standard'; }
  else if (art === 'fsw') { w.fsw = Object.assign({ n: 3, schema: 'links', geh: true, schwelle: 'flach' }, w.fsw || {}); w.sashes = fswFluegel(w.fsw.n, w.fsw.schema, w.fsw.geh); w.teilung = String(w.sashes.length); w.ol = false; w.ul = false; w.form = 'rechteck'; if (w.griff !== 'abschliessbar') w.griff = 'standard'; }
  else if (art === 'psk') { w.psk = Object.assign({ schema: 'A', richtung: 'R', schwelle: 'standard' }, w.psk || {}); w.sashes = pskFluegel(w.psk.schema, w.psk.richtung); w.teilung = String(w.sashes.length); w.ol = false; w.ul = false; w.form = 'rechteck'; if (w.griff !== 'abschliessbar') w.griff = 'standard'; }
  else if (art === 'balkon') { w.bt = Object.assign({ schwelle: 'standard', griffA: 'keiner', boden: 'bleibt' }, w.bt || {}); w.teilung = '1'; w.sashes = sashesFor('1'); w.ol = false; w.ul = false; w.form = 'rechteck'; if (w.griff === 'motor') w.griff = 'standard'; }
  else { w.teilung = '2p'; w.sashes = sashesFor('2p'); if (w.griff === 'motor') w.griff = 'standard'; }
  w.e_teilung = art !== 'fenster' && art !== 'balkon'; w.bars = []; w.preset = 'keine'; delete w.anteile;
  if (art === 'fenster' || art === 'balkon') { if (w.seiten) seitenAnwenden(w); } else { delete w.seiten; delete w.seitenB; }
}
const artName = (w) => (istTuer(w) ? 'Tür' : w.art === 'fest' ? 'Festverglasung' : 'Fenster');
/* Für Türen heißt es Schwelle statt Fensterbank und Tür statt Fenster */
function tuerText(t) {
  if (!istTuer(S.win)) return t;
  return t.replace(/bis zur Fensterbank/g, 'bis zur Schwelle bzw. zum fertigen Fußboden').replace(/über der Fensterbank/g, 'über der Schwelle').replace(/das Fenster selbst/g, 'die Tür selbst').replace(/vom Fenster samt Rahmen/g, 'von der Tür samt Rahmen').replace(/Das Fenster samt Rahmen/g, 'Die Tür samt Rahmen').replace(/^Fenster · /, 'Tür · ');
}
const elName = () => (istTuer(S.win) ? 'Türelement' : S.win.art === 'fest' ? 'Element' : 'Fensterelement');
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
    fa: '7016', fi: '9016', gleich: false, muster: false, wunschA: '', wunschI: '', wunschGf: '', wunschSf: '', wunschIf: '', aufSeite: 'beide', glas: '3', glasfn: [], orn: 'satinato', griff: 'standard', gf: 'weiss', rc: 'basis', roll: 'keiner', antrieb: 'gurt', insekt: 'keiner', fbi: 'behalten', fba: 'alu',
    /* Elementart, Lage, Unterlicht, Türen, Sonnenschutz */
    art: 'fenster', neu: false, plan: null, wand: '', ul: false, ulH: 400, ulA: 'glas', hst: { schema: 'A', richtung: 'R', schwelle: 'flach' }, fsw: { n: 3, schema: 'links', geh: true, schwelle: 'flach' },
    sart: 'keiner', sfarbe: 'silber', iart: 'keiner', ifarbe: 'weiss',
    /* Balkon-/Terrassentür und PSK-Tür; offen = Wünsche, die der Kunde noch nicht entschieden hat (Weiß ich noch nicht); Absturzsicherung,
       Erreichbarkeit fürs Einbruchschutz-Thema, massOk = Maße trotz Abweichung zum Foto bestätigt. Gleiche Standards in modell.js */
    bt: { schwelle: 'standard', griffA: 'keiner', boden: 'bleibt' }, psk: { schema: 'A', richtung: 'R', schwelle: 'standard' }, offen: {}, absturz: '', erreichbar: '', massOk: false,
    demontage: true, durchbruch: true, ralm: true, putz: true, notiz: '', notizen: {}, ki: null, tilt: null, fotos: 0, quelle: 'hand' };
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
    ki: { auto: true, laib: 140, chips: ['Rollladenkasten innen', 'Fensterbank Naturstein', 'Heizkörper darunter', 'Putzfassade'], rows: [['Rollladen', 'Einbaukasten innen über der Öffnung mit Revisionsdeckel, Gurt mit Unterputz-Wickler links'], ['Anschlag', 'Innenanschlag, Blendrahmen sitzt etwa 2 cm hinter der Innenkante'], ['Laibung', 'Verputzt und tapeziert, Gurtdurchführung links'], ['Fensterbank innen', 'Naturstein, etwa 25 cm tief, über dem Heizkörper'], ['Heizung', 'Heizkörper direkt unter dem Fenster, Oberkante knapp unter der Bank'], ['Fassade', 'Putz auf Mauerwerk, Außenanschlag etwa 3 cm'], ['Fensterbank außen', 'Aluminium mit Gefälle und Tropfkante'], ['Zugang', 'Erdgeschoss, kein Gerüst nötig']], hints: ['Der Gurtwickler sitzt in der Laibung; nach dem Ausbau ist Putz nachzuarbeiten.'], pruefen: ['Dämmung und Luftdichtheit des Rollladenkastens prüfen.'] } });
  const b = Object.assign(baseWin(), { name: 'Bad', etage: 'og', w: 880, h: 1010, mo: { hm: 1040, hl: 1040, hr: 1038, wm: 905, wt: 905, wb: 902 }, el: { h: 1010, w: 880 }, bru: 1320, laib: 120, teilung: '1', e_teilung: true, sashes: sashesFor('1'), fa: '9016', glasfn: ['sicht'], fotos: 1,
    ki: { auto: true, laib: 120, chips: ['Fliesenlaibung', 'kein Rollladen', 'Bad im Obergeschoss'], rows: [['Laibung', 'Gefliest, Fliesen laufen bis an den Blendrahmen'], ['Fensterbank innen', 'Gefliest, mit dem Fliesenspiegel verbunden'], ['Rollladen', 'Kein Kasten, kein Sonnenschutz'], ['Feuchte', 'Feuchteflecken in der unteren Laibungsecke'], ['Besonderheit', 'Bad: Sichtschutz und Lüftung beim neuen Fenster mitdenken'], ['Zugang', 'Obergeschoss, Montage von innen möglich']], hints: ['Die Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt; Ersatzfliesen oder eine Verkleidung einplanen.'], pruefen: ['Ursache der Feuchte in der Laibungsecke klären (Anschluss oder Kondensat).'] } });
  return [a, b];
}
const thousand = (v) => (v === '' || v == null || isNaN(v) || v === 0) ? '–' : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const mmTxt = (v) => (num(v) ? thousand(v) + ' mm' : '–');
const cmTxt = (v) => (num(v) ? (num(v) / 10).toFixed(1).replace('.', ',') + ' cm' : '');
const LEGACY = { altbau: 'Altbau', sofort: 'So bald wie möglich', offen: 'Noch offen' };
const lab = (g, k) => { const o = (OPT[g] || []).find((x) => x.k === k); return o ? o.label : (LEGACY[k] || ''); };
/* Gespeicherter Schlüssel → Farbe. Ein unbekannter Schlüssel bleibt mit Namen sichtbar und wird nicht still zu Verkehrsweiß. */
const colorOf = (k) => FARBE_K[k] || (k ? { k: String(k), name: String(k), code: 'Farbe bitte prüfen', bg: FARBE_K['9016'].bg, solid: FARBE_K['9016'].solid, unbekannt: true } : FARBE_K['9016']);
/* Eigene Farben: eingetippt und erkannt (ral.js, sonst Farbtext aus gemeinsam.js) → so im Modell, in der Zeichnung und im Aufmaßblatt.
   Nicht erkannt → die gewählte Farbe aus der Liste bleibt, der Text geht als Wunsch an den Fensterbauer. */
const farbLesen = (t) => (!t ? null : window.RAL ? window.RAL.lesen(t) : window.Farbtext ? window.Farbtext.lesen(t) : null);
const mischHex = (hex, ziel, t) => (window.RAL ? window.RAL.mischen(hex, ziel, t) : window.Farbtext ? window.Farbtext.mischen(hex, ziel, t) : hex);
/* Farbeintrag aus ral.js zu einem gespeicherten Schlüssel (Sonnenschutz und Innenschutz dürfen außer ihren eigenen Tönen jede Farbe tragen) */
const ralFarbe = (k) => (k && window.RAL ? window.RAL.eintrag(k) : null);
/* Noch nicht entschieden (Weiß ich noch nicht, oder die Frage ohne Vorauswahl übergangen): das Modell zeigt neutral Weiß, das Blatt „offen“ */
const FARBE_OFFEN = { k: 'offen', name: 'Farbe offen', code: 'bitte beraten', bg: '#f1f0ea', solid: '#f1f0ea', offen: true };
const farbeOffen = (w, seite) => !!(w.offen && (seite === 'innen' ? (w.gleich ? w.offen.fa : w.offen.fi) : w.offen.fa));
function rahmenFarbe(w, seite) {
  if (farbeOffen(w, seite)) return FARBE_OFFEN;
  const innen = seite === 'innen', t = innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA, k = innen ? (w.gleich ? w.fa : w.fi) : w.fa, f = farbLesen(t);
  if (!f) return colorOf(k);
  const e = f.eintrag;
  return { k: e ? e.key : 'eigen', name: e ? e.name : f.name, code: e ? e.code : f.code ? 'RAL ' + f.code : f.holz ? 'Holzdekor' : 'eigene Farbe', bg: f.bg, solid: f.hex, holz: f.holz, eigen: true };
}
function farbZeile(w, seite) {
  if (farbeOffen(w, seite)) return AW.OFFEN_TEXT;
  const innen = seite === 'innen', t = (innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA) || '', c = rahmenFarbe(w, seite);
  if (t && farbLesen(t)) return c.name + (c.code && c.code !== 'eigene Farbe' && c.name.indexOf(c.code) < 0 ? ' (' + c.code + ')' : '') + ', eigene Angabe';
  return c.name + ' (' + c.code + ')' + (t ? ', Wunsch: ' + t : '');
}
function griffFarbe(w) { const f = farbLesen(w.wunschGf); if (f) return { bg: f.hex, name: f.name, eigen: true }; const o = OPT.gf.find((g) => g.k === w.gf) || OPT.gf[0]; return { bg: o.bg, name: o.label + (w.wunschGf ? ', Wunsch: ' + w.wunschGf : '') }; }
/* Sonnenschutz und Innenschutz: eingetippt, sonst ein Ton der eigenen Liste, sonst eine Farbe aus dem Farbblatt (RAL, DB, Struktur) */
const behangRal = (g, k) => (lab(g, k) ? null : ralFarbe(k));
const behangTon = (hex, d, l) => [hex, mischHex(hex, '#000000', d), mischHex(hex, '#ffffff', l)];
function sonneFarbeW(w) { const f = farbLesen(w.wunschSf) || behangRal('sfarbe', w.sfarbe); return f ? behangTon(f.hex, 0.32, 0.28) : sonneFarbe(w.sfarbe); }
function innenFarbeW(w) { const f = farbLesen(w.wunschIf) || behangRal('ifarbe', w.ifarbe); return f ? behangTon(f.hex, 0.22, 0.3) : innenFarbe(w.ifarbe); }
const behangName = (g, k, wunsch) => { const f = farbLesen(wunsch); if (f) return f.name; const e = behangRal(g, k); return (e ? e.label : lab(g, k) || '') + (wunsch ? ', Wunsch: ' + wunsch : ''); };
const sonneName = (w) => behangName('sfarbe', w.sfarbe, w.wunschSf);
const innenName = (w) => behangName('ifarbe', w.ifarbe, w.wunschIf);
const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
/* Einstellungen der Tür je Art (Schwelle usw.) */
const tuerCfg = (w) => (w.art === 'hst' ? w.hst : w.art === 'fsw' ? w.fsw : w.art === 'psk' ? w.psk : w.art === 'balkon' ? w.bt : null) || {};
const schwelleText = (k) => ({ flach: 'flache Schwelle', null: 'barrierefrei ohne Schwelle', standard: 'Standardschwelle' }[k] || 'flache Schwelle');
/* Gehflügel der Balkontür: der erste Dreh-Kipp-Flügel, sonst der erste Drehflügel */
const gehFluegel = (w) => { const dk = w.sashes.findIndex((x) => x.t === 'DK' && !x.steh); return dk >= 0 ? dk : w.sashes.findIndex((x) => x.t === 'D' && !x.steh); };
/* Stulpfenster: nur der Gehflügel hat einen Griff, der Standflügel (x.steh) wird erst danach über den Falz geöffnet; Seitenteile (x.st)
   zählen nicht. Ältere Fenster ohne Kennzeichen: beim Stulp ist der Flügel, der nicht der Gehflügel ist, der Standflügel */
const stehFluegel = (w, i) => {
  const x = w.sashes[i]; if (!x || x.st || w.art === 'fest') return false;
  if (w.sashes.some((y) => y.steh)) return !!x.steh;
  return w.teilung === '2s' && w.sashes.filter((y) => !y.st).length === 2 && i !== gehFluegel(w);
};
/* Offen statt Vorgabe (Regeln in modell.js): istOffen prüft auch, ob die Angabe zum Element gehört */
const OT = 'offen, bitte beraten';
const istOffen = (w, k) => AW.istOffen(w, k);
const ov = (w, k, text) => (istOffen(w, k) ? OT : text);
function openingText(w) {
  if (w.art === 'fest') return w.sashes.length + (w.sashes.length === 1 ? ' Feld' : ' Felder') + ', fest verglast, ohne Griff';
  /* Zusätze nur, wenn gewählt: Oberlicht über Türen, Ecklösung, Faltrichtung, Kipp vor Dreh, Paneel */
  const ol = w.ol ? lab('olT', w.olT) + ' · ' : '', kvd = w.kvd === 'kvd' && AW.detailGilt(w, 'kvd') ? ', Kipp vor Dreh' : '';
  if (w.art === 'hst') { const h = w.hst || {}; return ol + 'Hebe-Schiebe-Tür ' + lab('hstSchema', h.schema) + (h.schema === 'A' || h.schema === 'A3' ? ', Schiebeflügel ' + (h.richtung === 'L' ? 'links' : 'rechts') : '') + (w.hstEck === 'eck' ? ', über Eck ohne Eckpfosten' : '') + ', ' + ov(w, 'schwelle', schwelleText(h.schwelle)); }
  if (w.art === 'fsw') { const f = w.fsw || {}; return ol + 'Faltschiebewand, ' + w.sashes.length + ' Flügel, ' + lab('fswSchema', f.schema) + (f.geh ? ', mit Gehflügel' : ', ohne Gehflügel') + (w.fswAuf ? ', ' + AW.lab('fswAuf', w.fswAuf) : '') + ', ' + ov(w, 'schwelle', schwelleText(f.schwelle)); }
  if (w.art === 'psk') { const p = w.psk || {}; return 'PSK-Tür ' + lab('pskSchema', p.schema) + (p.schema === 'C' ? ', 2 Schiebeflügel mittig' : ', Schiebeflügel ' + (p.richtung === 'L' ? 'links' : 'rechts')) + ', kippbar, mit Schwelle'; }
  const s = w.sashes.map((x) => (x.st ? 'Seitenteil' : TYPNAME[x.t]) + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ');
  if (w.art === 'balkon') return 'Balkontür, ' + ol + s + kvd + (w.paneel === 'paneel' ? ' · unten Paneel ' + thousand(num(w.paneelH) || 400) + ' mm' : '') + ', ' + ov(w, 'schwelle', schwelleText((w.bt || {}).schwelle));
  return ol + s + kvd + (w.ul ? ' · ' + lab('ul', w.ulA) + ' ' + thousand(w.ulH) + ' mm' : '');
}
/* Sonnenschutz außen in Worten */
function sonneText(w) {
  if (istOffen(w, 'sart')) return OT;
  const a = w.sart && w.sart !== 'keiner' ? w.sart : (w.roll === 'aufsatz' || w.roll === 'vorbau' ? 'rollladen' : w.roll === 'behalten' ? 'behalten' : 'keiner');
  if (a === 'keiner') return 'Keiner';
  if (a === 'behalten') return 'Bestehender bleibt';
  if (a === 'klappladen') return 'Klappläden';
  return lab('sart', a) + (a === 'screen' ? '' : ', ' + (istOffen(w, 'einbau') ? 'Kasten nach Wahl des Fensterbauers' : lab('einbau', OPT.einbau.some((o) => o.k === w.roll) ? w.roll : 'aufsatz'))) + ', ' + sonneName(w) + ', ' + (istOffen(w, 'antrieb') ? 'Antrieb offen' : lab('antrieb', w.antrieb));
}
const innenText = (w) => (istOffen(w, 'iart') ? OT : !w.iart || w.iart === 'keiner' ? 'Keiner' : lab('iart', w.iart) + ', ' + innenName(w));
const griffText = (w) => (w.art === 'fest' ? 'Ohne Griff' : istOffen(w, 'griff') ? 'Griff ' + OT : (w.art === 'hst' ? lab('hstGriff', w.griff) || 'Hebegriff' : lab('griff', w.griff)) + (w.griff === 'ohne' || w.griff === 'motor' ? '' : ', ' + griffFarbe(w).name)) + (w.art === 'balkon' ? '; außen ' + ov(w, 'griffA', lab('griffA', (w.bt || {}).griffA) || 'kein Griff') : '');
function specRows(w) {
  const d = derive(w), mo = w.mo || {}, z = AW.uwZiel(w, S.proj);
  const rows = [
    { k: 'Maueröffnung', v: d.moW && d.moH ? thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm (kleinstes Maß)' + (d.devW > 5 || d.devH > 5 ? ', bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel' : '') : 'noch nicht gemessen' },
    { k: 'Breiten', v: ['wt', 'wm', 'wb'].map((k) => MO_LABEL[k].replace('Breite ', '') + ' ' + thousand(num(mo[k]))).join(' · ') },
    { k: 'Höhen', v: ['hl', 'hm', 'hr'].map((k) => MO_LABEL[k].replace('Höhe ', '') + ' ' + thousand(num(mo[k]))).join(' · ') },
    { k: istTuer(w) ? 'Türelement' : w.art === 'fest' ? 'Element' : 'Fensterelement', v: d.elW && d.elH ? thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm' + (w.neu ? ', Wunschmaß mit Rahmen' : ', sichtbar mit Rahmen') : 'noch nicht gemessen' },
    { k: 'Lage', v: (w.name || 'Ohne Raum') + ', ' + lab('etage', w.etage) + (num(w.bru) ? ', Brüstung ' + thousand(w.bru) + ' mm' : '') + (num(w.laib) ? ', Laibung innen ' + thousand(w.laib) + ' mm' : '') + (num(w.wand) ? ', Wand ' + thousand(w.wand) + ' mm' : '') + (w.anzahl > 1 ? ', ' + w.anzahl + ' Stück' : '') },
    { k: 'Einbau', v: (AW.fassadeText(w) ? 'Fassade laut Kunde: ' + AW.fassadeText(w) + ' · ' : '') + (w.neu ? 'Neue Öffnung: ' + (AW.ohneFotos(w) ? 'ohne Foto, Lage nicht eingezeichnet' : 'Lage vom Kunden auf dem Foto eingezeichnet') + ', Maße sind Wunschmaße. Sturz und Statik vor dem Durchbruch prüfen.' : AW.ohneFotos(w) ? 'Ohne Fotos erfasst, Einbausituation und Feinaufmaß vor Ort' : 'Anschlag und Fassade laut Fotos, Feinaufmaß vor Ort') },
    { k: 'Element', v: lab('art', w.art || 'fenster') },
    { k: 'Öffnung', v: openingText(w) + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ', öffnet nach außen' : '') },
    { k: 'Form', v: lab('form', w.form) + ', ' + (istOffen(w, 'material') ? 'Material ' + OT : lab('material', w.material)) },
    { k: 'Farbe', v: 'außen ' + farbZeile(w, 'aussen') + ', innen ' + (w.gleich ? 'wie außen' : farbZeile(w, 'innen')) },
    { k: 'Glas', v: ov(w, 'glas', lab('glas', w.glas)) + (istOffen(w, 'glasfn') ? ', Extras ' + OT : w.glasfn.length ? ', ' + w.glasfn.map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + (ORN.find((o) => o.k === w.orn) || ORN[0]).label + ')' : '')).join(', ') : '') },
    { k: 'Sprossen', v: w.bars.length ? ov(w, 'spross', lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite).toLowerCase() + ')' : '')) + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'Keine' },
    { k: 'Griff', v: griffText(w) },
    { k: 'Einbruchschutz', v: AW.rcText(w) }
  ];
  const teilT = AW.teilungText(w); if (teilT) rows.splice(rows.findIndex((r) => r.k === 'Öffnung') + 1, 0, { k: 'Aufteilung', v: teilT });
  if (AW.absturzFrage(w)) rows.push({ k: 'Absturzsicherung', v: AW.absturzText(w) });
  if (z) rows.push({ k: 'Förderwert', v: AW.uwText(z) + ', ' + lab('foerdweg', AW.foerdWeg(S.proj)) });
  rows.push({ k: 'Sonnenschutz', v: 'außen: ' + sonneText(w) + ' · innen: ' + innenText(w) + ' · Insektenschutz: ' + ov(w, 'insekt', lab('insekt', w.insekt)) });
  rows.push(istTuer(w) ? { k: 'Schwelle', v: w.art === 'psk' ? 'Mit Schwelle (PSK)' : ov(w, 'schwelle', lab('schwelle', tuerCfg(w).schwelle)) + (w.art === 'balkon' ? ', Fußboden ' + ((w.bt || {}).boden === 'neu' ? 'wird erneuert' : 'bleibt') : '') } : { k: 'Fensterbank', v: 'innen ' + ov(w, 'fbi', lab('fbi', w.fbi)) + ', außen ' + ov(w, 'fba', lab('fba', w.fba)) });
  rows.push({ k: 'Montage', v: istOffen(w, 'montage') ? 'Nach Vorschlag des Fensterbauers' : [w.neu ? (w.durchbruch ? 'Wanddurchbruch samt Sturz' : '') : (w.demontage ? 'Altfenster ausbauen und entsorgen' : ''), w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'Nur Lieferung' });
  /* Detailangaben bei ihrer Gruppe (AW.DETAIL wg), in derselben Ordnung wie beim Betrieb und im Aufmaßblatt */
  const NACH = { fenster: ['Sprossen'], glas: ['Glas'], beschlag: ['Absturzsicherung', 'Einbruchschutz'], sonne: ['Sonnenschutz'], insekt: ['Sonnenschutz'], bank: ['Fensterbank', 'Schwelle'], montage: ['Montage'] };
  AW.DETAIL.forEach((d) => {
    if (d.zeile === false || !AW.detailGilt(w, d.k)) return; const v = AW.detailText(w, d); if (!v) return;
    const ziel = (NACH[d.wg] || []).map((k) => rows.map((r) => r.k).lastIndexOf(k)).find((i) => i >= 0), nach = ziel == null ? rows.length - 1 : ziel;
    let i = nach + 1; while (i < rows.length && rows[i].wg) i++; // hinter die Detailzeilen davor, Reihenfolge wie im Register
    rows.splice(i, 0, { k: d.n, v: v, wg: d.wg });
  });
  if (w.notiz) rows.push({ k: 'Notiz', v: w.notiz });
  AW.notizListe(w).forEach((r) => rows.push({ k: 'Notiz · ' + r[0], v: r[1] })); // Notizen je Stelle
  return rows;
}
/* Kompakter Aufmaß-Code: nur Abweichungen vom Standard, für den Weg zum Fensterbauer ohne Server; ohne die Zähler gegen
   Mehrfachnutzung (Kennung, erstes Speichern, Änderungen, letztes Speichern), die bleiben in der App und beim Zwischenstand.
   Die Kennungen der Fotos nur mit Link: Dort liegen die Fotos beim Server; ohne Link stehen sie nur im Aufmaßblatt */
const NUR_APP = { wid: 1, t0: 1, aend: 1, ts: 1 };
function packProject(windows, proj, betrieb) {
  const base = baseWin();
  const ws = windows.map((w) => { const o = {}; Object.keys(w).forEach((k) => { if (!NUR_APP[k] && JSON.stringify(w[k]) !== JSON.stringify(base[k])) o[k] = w[k]; }); if (o.plan && o.plan.bild) o.plan = Object.assign({}, o.plan, { bild: '' }); if (!betrieb) delete o.bilder; return o; });
  const runde = betrieb && S.nb && S.nb.runde ? S.nb.runde : (betrieb && S.sent && S.sent.runde) || 1;
  const json = JSON.stringify(Object.assign({ v: 1, b: betrieb ? betrieb.code : '', p: proj, w: ws, t: Date.now() }, runde > 1 ? { r: runde } : {}, runde > 1 && S.nb && S.nb.teil ? { m: 1 } : {}));
  const bytes = new TextEncoder().encode(json);
  let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return 'AM1.' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unpackProject(code) {
  try {
    const m = /(?:AM1|ZF1|FE1|LM1)\.([A-Za-z0-9_-]+)/.exec(String(code || '').replace(/\s+/g, ''));
    if (!m) return null;
    let b64 = m[1].replace(/-/g, '+').replace(/_/g, '/'); while (b64.length % 4) b64 += '=';
    const bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const text = new TextDecoder().decode(bytes), ende = text.lastIndexOf('}');
    const o = JSON.parse(ende > 0 ? text.slice(0, ende + 1) : text);
    if (!o || o.v !== 1 || !Array.isArray(o.w)) return null;
    o.w = o.w.map((x) => altAngleichen(Object.assign(baseWin(), x)));
    return o;
  } catch (e) { return null; }
}
/* Sechs Schritte je Weg: beim Ersatz wird gemessen (Messen, Ränder), die neue Öffnung wird eingezeichnet und bekommt Wunschmaße */
const STEPS_ERSATZ = ['start', 'fotos', 'messen', 'rest', 'ergebnis', 'frage'], STEPS_NEU = ['start', 'fotos', 'zeichnen', 'planmasse', 'ergebnis', 'frage'];
const stepsFor = (w) => (w && w.neu ? STEPS_NEU : STEPS_ERSATZ);
const STEPNAME = { start: 'Start', zeichnen: 'Einzeichnen', planmasse: 'Maße', fotos: 'Fotos', messen: 'Messen', rest: 'Ränder', ergebnis: 'Ergebnis', typ: 'Fenster', sprossen: 'Sprossen', farbe: 'Farbe & Glas', extras: 'Extras' };
/* Die vier geführten Messungen, dann die vier restlichen am Foto */
const MESS = [
  { k: 'hm', g: 'oeffnung-hoehe', who: 'mo', dir: 'v', title: 'Maueröffnung senkrecht', short: 'Öffnung · Höhe Mitte', text: 'Miss die sichtbare Maueröffnung senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank. Den Zollstock an die Laibung halten, nicht an den Rahmen.', sub: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank.', subTuer: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zum fertigen Fußboden.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'], chip: 'nicht' },
  { k: 'h', g: 'element-hoehe', who: 'el', dir: 'v', title: 'Fensterelement senkrecht', short: 'Fenster · Höhe Mitte', text: 'Jetzt das Fenster selbst, senkrecht in der Mitte: alles, was vom Fenster samt Rahmen zu sehen ist, von Oberkante bis Unterkante.', sub: 'Senkrecht in der Mitte: der feste Rahmen, von seiner Außenkante oben bis unten.', subTuer: 'Senkrecht in der Mitte: der feste Rahmen samt Schwelle, von Außenkante oben bis unten.', enden: ['Rahmen außen', 'Rahmen außen'], endenTuer: ['Rahmen außen', 'Unterkante Schwelle'], chip: 'samt' },
  { k: 'wm', g: 'oeffnung-breite', who: 'mo', dir: 'h', title: 'Maueröffnung waagerecht', short: 'Öffnung · Breite Mitte', text: 'Die Maueröffnung waagerecht in der Mitte: von Laibung zu Laibung, auf halber Höhe.', sub: 'Von innen, waagerecht auf halber Höhe: von Mauer zu Mauer.', enden: ['Mauer', 'Mauer'], chip: 'nicht' },
  { k: 'w', g: 'element-breite', who: 'el', dir: 'h', title: 'Fensterelement waagerecht', short: 'Fenster · Breite Mitte', text: 'Das Fenster samt Rahmen waagerecht in der Mitte: von der linken bis zur rechten sichtbaren Rahmenkante.', sub: 'Waagerecht auf halber Höhe: der feste Rahmen, von Außenkante zu Außenkante.', enden: ['Rahmen außen', 'Rahmen außen'], chip: 'samt' }
];
const REST = [
  { k: 'hl', edge: 'l', title: 'Höhe links', text: 'Maueröffnung senkrecht, dicht an der linken Laibung. Alte Häuser sind selten im Winkel, deshalb lohnt der Blick.', sub: 'Senkrecht, dicht an der linken Mauer. Alte Häuser sind selten im Winkel.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'] },
  { k: 'hr', edge: 'r', title: 'Höhe rechts', text: 'Maueröffnung senkrecht, dicht an der rechten Laibung.', sub: 'Senkrecht, dicht an der rechten Mauer.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'] },
  { k: 'wt', edge: 't', title: 'Breite oben', text: 'Maueröffnung waagerecht, dicht unter der Oberkante der Öffnung.', sub: 'Waagerecht, dicht unter der Oberkante der Öffnung.', enden: ['Mauer', 'Mauer'] },
  { k: 'wb', edge: 'b', title: 'Breite unten', text: 'Maueröffnung waagerecht, dicht über der Fensterbank.', sub: 'Waagerecht, dicht über der Fensterbank.', enden: ['Mauer', 'Mauer'] }
];
/* Prüfungen beim Eintippen */
function checkValue(mm, step, vals) {
  const v = num(mm);
  if (!v) return { ok: false, msg: 'Bitte das Maß in Millimetern eintragen.' };
  if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10, msg: 'Meintest du ' + v + ' cm? Das wären ' + thousand(v * 10) + ' mm.' };
  if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen, zum Beispiel 1.230.' };
  if (step && step.who === 'el') {
    const o = num(step.dir === 'v' ? vals.hm : vals.wm);
    if (o && v > o + 30) return { ok: true, warn: 'Größer als die Öffnung (' + thousand(o) + ' mm). Die Öffnung an der Mauer messen, nicht am Rahmen.' };
    if (o && v < o * 0.6) return { ok: true, warn: 'Sehr klein für diese Öffnung. Bis zur Außenkante des Rahmens messen.' };
  }
  return { ok: true };
}
function checkRest(mm, ref) {
  const v = num(mm), r = num(ref);
  if (!v) return { ok: false, msg: 'Bitte das Maß eintragen oder „Hier auch … gemessen?“ antippen.' };
  if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10, msg: 'Meintest du ' + v + ' cm? Das wären ' + thousand(v * 10) + ' mm.' };
  if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen.' };
  if (r && Math.abs(v - r) > 60) return { ok: true, warn: Math.abs(v - r) + ' mm anders als in der Mitte. Bitte einmal nachmessen.' };
  return { ok: true };
}

/* ---------- SVG-Ausgabe ---------- */
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const svgPaths = (list) => list.map((p) => '<path d="' + p.d + '" fill="' + p.f + '" stroke="' + p.s + '" stroke-width="' + p.w + '"' + (p.da ? ' stroke-dasharray="' + p.da + '"' : '') + (p.o !== 1 ? ' opacity="' + p.o + '"' : '') + ' stroke-linecap="round" stroke-linejoin="round"></path>').join('');
const svgIcon = (list, size, cls) => '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + svgPaths(list) + '</svg>';
const miniWin = (x) => { const a = (num(x.w) || 1) / (num(x.h) || 1), bw = a >= 1 ? 50 : 50 * a, bh = a >= 1 ? 50 / a : 50; return winIco(x, (64 - bw) / 2, (64 - bh) / 2, bw, bh, rahmenFarbe(x, 'aussen').solid); };

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

/* ---------- 3-D-Modell: Wand, Maueröffnung, Fensterelement, aus CSS-Transformationen ----------
   Weltkoordinaten in Pixeln: Ursprung in der Mitte der Maueröffnung auf der Innenwand, x nach rechts, y nach unten,
   z zum Betrachter (in den Raum). Jede Fläche ist ein div, das mit translate3d an seine linke obere Ecke geschoben
   und um diese Kante gedreht wird. Alle Maße kommen aus w3dCalc, w3dLayout schreibt sie in die Flächen; so verformt
   sich das Modell mit Übergängen, wenn eine Zahl getippt wird. */
const W3D = { FD: 70, PF: 62, SF: 46, MUL: 72, OUTD: 110, SILL: 30, MARGIN_W: 6400, MARGIN_H: 4000 };
const VIEWS = { inside: [-9, -27], front: [0, 0], outside: [-8, 152], three: [-10, -34], result: [-7, -20], bankInnen: [-24, -24], bankAussen: [-22, 156] };
/* Aufsatzkasten (mm) je Behang: Rollladen 200, Raffstore 230, Screen 170. Er sitzt oben in der Öffnung auf dem Blendrahmen; das Element
   beginnt erst darunter (w3dCalc kürzt die Elementhöhe, w3dSonne setzt den Kasten auf den Rahmen) */
const KASTEN_AUF = { rollladen: 200, raffstore: 230, screen: 170 };
const aufsatzH = (w) => (sonneAktiv(w) && w.roll === 'aufsatz' ? KASTEN_AUF[w.sart] || 200 : 0);
/* Kamera für einen geöffneten Flügel: von der Griffseite aus sieht man ihn aufschwingen */
function openView(x, base) { if (!x) return base; if (x.t === 'S' || x.t === 'X') return base; if (x.t === 'K') return [base[0] - 6, base[1]]; return [base[0], x.din === 'L' ? -30 : 30]; }
function w3dCalc(w, o) {
  o = o || {};
  const d = derive(w), haveMo = !!(d.moW && d.moH), moW = d.moW || o.moW || 1250, moH = d.moH || o.moH || 1480;
  const elW = d.elW || Math.round(moW - 60), elH0 = d.elH || Math.round(moH - 40);
  /* Aufsatzkasten: Öffnungshöhe minus Kasten bleibt fürs Element; der Kasten steht auf dem Rahmen bis zur Oberkante der Öffnung */
  const kastenH = aufsatzH(w), elH = kastenH ? Math.max(300, Math.min(elH0, moH - kastenH)) : elH0;
  /* Türen: tieferer Blendrahmen mit zwei Laufebenen (Hebe-Schiebe) bzw. Laufschiene (Falt, PSK), unten die Schwelle statt des Rahmenprofils.
     Die Balkontür hat Fensterprofile (gleiche Tiefe, Pfosten zwischen zwei Flügeln), steht aber wie jede Tür auf dem Boden */
  const tuer = istTuer(w), art = w.art || 'fenster', fd = art === 'hst' ? 170 : art === 'balkon' ? W3D.FD : tuer ? 90 : W3D.FD;
  /* Schmale Rahmenansicht: Blendrahmen, Flügel und Pfosten etwa ein Sechstel schlanker */
  const schmal = w.schmal === 'schmal' && AW.detailGilt(w, 'schmal');
  const schw = tuer ? tuerCfg(w).schwelle : '', pfB = tuer ? (schw === 'null' ? 16 : schw === 'standard' ? 62 : 28) : schmal ? 52 : W3D.PF;
  const laib = num(w.laib) || (w.ki && w.ki.laib) || 140, T = laib + fd + W3D.OUTD;
  const sw = o.stageW || 358, sh = o.stageH || 360;
  /* Zoom (w3dZoomSetzen) vergrößert den Maßstab und wird neu gelegt statt skaliert: so bleiben Kanten und Schilder scharf */
  let s0 = o.s || Math.min(sw * (o.fitW || 0.64) / moW, sh * (o.fitH || 0.7) / moH), dimX = 0, dimY = 0;
  /* Übersicht der Maße (dims-all): Das Schild der Höhe steht links außen neben der Öffnung (bei ungleichen Höhen auch rechts), das der
     Breite darüber (bei ungleichen Breiten auch unter der Bank). Alle müssen mit Abstand in die Bühne passen: Das Modell rückt dafür
     nach rechts bzw. unten (dimX, dimY), große Elemente werden kleiner. Schildbreite nach der Schrift (13 px, fett, Polster 8 px) */
  if (!o.s && !o.active && o.cls && o.cls.indexOf('dims-all') >= 0 && o.cls.indexOf('ohne-schilder') < 0) {
    const L = o.labels || {}, da = (ks) => ks.filter((k) => (o.dims || []).indexOf(k) >= 0), ungleich = (ks) => ks.length > 1 && !ks.every((k) => L[k] === L[ks[0]]);
    const hs = da(['hm', 'hl', 'hr']), ws = da(['wm', 'wt', 'wb']), off = (sk) => Math.max(10, 60 * sk), rand = 12, hoch = 24;
    if (hs.length) {
      const lab = Math.max.apply(null, hs.map((k) => String(L[k] || '?').length)) * 7.8 + 22, rechts = ungleich(hs);
      const schild = (sk) => lab + 8 + off(sk), links = (sk) => schild(sk) + rand, re = (sk) => (rechts ? schild(sk) : 0) + rand;
      for (let i = 0; i < 3 && moW * s0 + links(s0) + re(s0) > sw; i++) s0 = Math.max(20, sw - links(s0) - re(s0)) / moW;
      const frei = (sw - moW * s0) / 2;
      if (frei < links(s0)) dimX = links(s0) - frei;
    }
    if (ws.length) {
      const unten = ungleich(ws), tuer0 = istTuer(w), oben = (sk) => off(sk) + 8 + hoch + rand + 6, ab = (sk) => (unten ? off(sk) + (tuer0 ? 0 : 30 * sk) + 8 + hoch + 42 : 0) + rand; // unten zusätzlich Platz für die Beschriftung der Ansicht
      for (let i = 0; i < 3 && moH * s0 + oben(s0) + ab(s0) > sh; i++) s0 = Math.max(20, sh - oben(s0) - ab(s0)) / moH;
      const frei = (sh - moH * s0) / 2;
      dimY = frei < oben(s0) ? oben(s0) - frei : frei < ab(s0) ? frei - ab(s0) : 0; // nach unten bzw. oben rücken
    }
  }
  const zoom = Math.max(1, o.zoom || 1), s = s0 * zoom;
  const n = Math.max(1, w.sashes.length), pf = schmal ? 52 : W3D.PF, sf = schmal ? 38 : W3D.SF, mul = tuer && art !== 'balkon' ? 0 : w.teilung === '2s' ? 8 : schmal ? 60 : W3D.MUL;
  const innerW = elW - 2 * pf, innerH = elH - pf - pfB, olH = w.ol ? Math.round(Math.min(innerH * 0.6, Math.max(innerH * 0.26, formSenke(w.form, innerW, innerH)))) : 0;
  const ulH = w.ul && art === 'fenster' && !festForm(w.form) ? Math.round(clamp(num(w.ulH) || 400, 200, Math.max(200, (innerH - olH) * 0.55))) : 0;
  /* Kämpfer unter dem Oberlicht: so breit wie ein Pfosten, auch bei Türen (die sonst keinen Pfosten haben) */
  const km = olH ? (mul || W3D.MUL) : 0;
  const sashH = innerH - (olH ? olH + km : 0) - (ulH ? ulH + W3D.MUL : 0), sashW = (innerW - mul * (n - 1)) / n;
  /* Breiten je Flügel: Seitenteile (x.st) so breit wie gewählt (höchstens so, dass jeder Flügel 300 mm behält), die Flügel teilen sich den Rest */
  const nSt = w.sashes.filter((x) => x.st).length, nFl = n - nSt, frei = innerW - mul * (n - 1);
  const stB = nSt ? clamp(num(w.seitenB) || 400, 150, Math.max(150, (frei - nFl * 300) / nSt)) : 0, freiFl = frei - stB * nSt, flB = nFl ? freiFl / nFl : sashW;
  /* Aufteilung (w.anteile, qTeile): die Flügel ohne Seitenteile teilen sich die freie Breite nach Prozent, sonst gleich */
  const ant = anteileGueltig(w, nFl) ? w.anteile : null; let kAnt = 0;
  const swL = w.sashes.map((x) => (x.st ? stB : ant ? freiFl * ant[kAnt++] / 100 : nSt ? flB : sashW)), sxL = []; swL.reduce((a, b, i) => { sxL[i] = a; return a + b + mul; }, 0);
  return { s: s, sw: swL, sx: sxL, km: km, moW: moW, moH: moH, elW: elW, elH: elH, kastenH: kastenH, laib: laib, T: T, fd: fd, pfB: pfB, tuer: tuer, art: art, n: n, pf: pf, sf: sf, mul: mul, innerW: innerW, innerH: innerH, olH: olH, ulH: ulH, sashH: sashH, sashW: sashW, haveMo: haveMo, haveEl: !!(d.elW && d.elH),
    x0: -elW / 2, y0: moH / 2 - elH, dimX: dimX, dimY: dimY, wallW: moW + W3D.MARGIN_W / Math.sqrt(zoom), wallH: moH + W3D.MARGIN_H / Math.sqrt(zoom), zoom: zoom, showEl: o.showEl !== false, dims: o.dims || [], active: o.active || '' };
}
const px = (v) => (Math.round(v * 100) / 100) + 'px';
/* Umriss für clip-path; .g trägt dieselbe Geometrie in Zahlen für die WebGL-Bühne (buehne.js) */
const umriss = (css, g) => { const u = new String(css); u.g = g; return u; };
const hole = (W, H, x1, y1, x2, y2) => umriss('polygon(evenodd, 0 0, ' + px(W) + ' 0, ' + px(W) + ' ' + px(H) + ', 0 ' + px(H) + ', 0 0, ' + px(x1) + ' ' + px(y1) + ', ' + px(x2) + ' ' + px(y1) + ', ' + px(x2) + ' ' + px(y2) + ', ' + px(x1) + ' ' + px(y2) + ', ' + px(x1) + ' ' + px(y1) + ')', { t: 'hole', r: [x1, y1, x2, y2] });
/* ---------- Formen im Modell ----------
   formGeo(form, x, y, b, h): Ober- und Unterkante als Funktion von x, waagerechte Ausdehnung [xl, xr] und ein Umriss mit fester
   Punktzahl (oben 21, unten 11, im Uhrzeigersinn ab der linken Kämpferlinie). Alle Formen haben gleich viele Punkte, deshalb
   morphen Wandöffnung, Laibung, Rahmen und Flügel beim Wechsel der Form, statt zu springen. */
const FORM_O = 20, FORM_U = 10;
function formSenke(form, b, h) { return form === 'rundbogen' ? Math.min(b / 2, h * 0.8) : form === 'segment' ? Math.min(b * 0.15, h * 0.35) : form === 'schraeg' ? h * 0.42 : form === 'trapez' ? h * 0.3 : form === 'dreieck' ? h * 0.88 : 0; }
function formGeo(form, bx, by, bw, bh) {
  const cx = bx + bw / 2, pts = [];
  if (form === 'rund') {
    const r = Math.max(0, Math.min(bw, bh) / 2), cy = by + bh / 2, hh = (x) => Math.sqrt(Math.max(0, r * r - (x - cx) * (x - cx)));
    const n = FORM_O + FORM_U + 2, st = 2 * Math.PI / n, a0 = Math.PI / 2 + st * FORM_O / 2;
    for (let k = 0; k < n; k++) { const a = a0 - k * st; pts.push([cx + r * Math.cos(a), cy - r * Math.sin(a)]); }
    return { xl: cx - r, xr: cx + r, top: (x) => cy - hh(x), bot: (x) => cy + hh(x), pts: pts, rund: true };
  }
  const sk = formSenke(form, bw, bh);
  let top = () => by;
  if (form === 'rundbogen' && sk > 0.5) { const a = bw / 2; top = (x) => by + sk - sk * Math.sqrt(Math.max(0, 1 - ((x - cx) / a) * ((x - cx) / a))); }
  else if (form === 'segment' && sk > 0.5) { const hb = bw / 2, R = (hb * hb + sk * sk) / (2 * sk), cyc = by + R; top = (x) => cyc - Math.sqrt(Math.max(0, R * R - (x - cx) * (x - cx))); }
  else if (form === 'schraeg') top = (x) => by + sk * (1 - (x - bx) / bw);
  /* Trapez: oben in der Mitte gerade, beide Ecken schräg; Dreieck: Giebel mit kurzen senkrechten Seiten */
  else if (form === 'trapez') top = (x) => by + sk * Math.max(0, Math.abs(x - cx) - bw / 4) / (bw / 4);
  else if (form === 'dreieck') top = (x) => by + sk * Math.abs(x - cx) / (bw / 2);
  for (let k = 0; k <= FORM_O; k++) { const x = form === 'rundbogen' ? cx - (bw / 2) * Math.cos(Math.PI * k / FORM_O) : bx + bw * k / FORM_O; pts.push([x, top(x)]); }
  for (let k = 0; k <= FORM_U; k++) pts.push([bx + bw - bw * k / FORM_U, by + bh]);
  /* Knicke der Form (Ecken von Trapez und Dreieck): Schnitte mit Flügeln und Kämpfern nehmen sie als feste Punkte */
  const knick = form === 'trapez' ? [cx - bw / 4, cx + bw / 4] : form === 'dreieck' ? [cx] : [];
  return { xl: bx, xr: bx + bw, top: top, bot: () => by + bh, pts: pts, rund: false, knick: knick };
}
/* Rechteck (x, y, b, h) geschnitten mit einer Form: oben J Punkte (links nach rechts), unten J Punkte (zurück). x ist kosinusverteilt,
   so liegen die Punkte dort dicht, wo ein Bogen steil wird; beim Kreis ergibt das genau gleiche Winkelschritte. */
function formSchnitt(g, x, y, b, h, J) {
  let xa = Math.max(x, g.xl), xb = Math.min(x + b, g.xr);
  /* die Punkte nur über die Breite verteilen, in der die Form das Rechteck wirklich schneidet (bei schmalen Streifen wie dem
     Kämpfer eines Rundfensters sonst ein Keil zwischen Umriss und Rahmen) */
  const drin = (xx) => g.top(xx) <= y + h + 1e-6 && g.bot(xx) >= y - 1e-6;
  let mitte = null;
  for (let k = 0; k <= 32 && mitte === null; k++) { const xx = xa + (xb - xa) * (k % 2 ? 16 - (k + 1) / 2 : 16 + k / 2) / 32; if (drin(xx)) mitte = xx; }
  if (mitte !== null) {
    if (!drin(xa)) { let a = xa, c = mitte; for (let i = 0; i < 40; i++) { const m = (a + c) / 2; if (drin(m)) c = m; else a = m; } xa = c; }
    if (!drin(xb)) { let a = mitte, c = xb; for (let i = 0; i < 40; i++) { const m = (a + c) / 2; if (drin(m)) a = m; else c = m; } xb = a; }
  }
  /* Feste Stellen: wo der Umriss Ober- oder Unterkante des Rechtecks kreuzt (dort knickt der Schnitt) und die Knicke der Form.
     Sonst schneidet eine Sehne die Ecke ab und zwischen Kämpfer, Flügel und Rahmen bleibt ein Spalt. Dazwischen kosinusverteilt,
     zusammen immer J Punkte (fest für das Morphen) */
  const fest = [];
  if (xb - xa > 1e-6) {
    const N = 48, fn = [(xx) => g.top(xx) - y, (xx) => g.top(xx) - y - h, (xx) => g.bot(xx) - y, (xx) => g.bot(xx) - y - h];
    fn.forEach((f) => {
      let x0 = xa, f0 = f(x0);
      for (let k = 1; k <= N; k++) {
        const x1 = xa + (xb - xa) * k / N, f1 = f(x1);
        if ((f0 < 0) !== (f1 < 0)) { let a = x0, c = x1; for (let i = 0; i < 40; i++) { const m = (a + c) / 2; if ((f(m) < 0) === (f0 < 0)) a = m; else c = m; } fest.push((a + c) / 2); }
        x0 = x1; f0 = f1;
      }
    });
    (g.knick || []).forEach((k) => fest.push(k));
  }
  const tol = (xb - xa) * 1e-4, F = fest.filter((k) => k > xa + tol && k < xb - tol).sort((p, q) => p - q).filter((k, i, a) => !i || k - a[i - 1] > tol).slice(0, Math.max(0, J - 2));
  const n = J - F.length, xs = F.slice();
  for (let j = 0; j < n; j++) xs.push(xa + (xb - xa) * (1 - Math.cos(Math.PI * j / (n - 1))) / 2);
  xs.sort((p, q) => p - q);
  const o = [], u = [];
  xs.forEach((xx) => { const yt = Math.min(y + h, Math.max(y, g.top(xx))), yb = Math.max(yt, Math.min(y + h, g.bot(xx))); o.push([xx, yt]); u.unshift([xx, yb]); });
  return o.concat(u);
}
/* Punktlisten (Weltkoordinaten) als clip-path relativ zur Fläche bei (ox, oy) der Größe B × H; mit W gespiegelt für Rückseiten (rotateY 180°).
   Chrome legt in 3-D-Szenen die Ebene auf den Umriss des Clips und verschiebt dabei den Inhalt: beginnt ein Clip nicht oben links, fehlt
   unten ein Stück. Zwei Spitzen ohne Fläche zu den Ecken (0 0) und (B H) halten den Umriss so groß wie die Fläche. */
const polyPts = (pts, ox, oy, W) => pts.map((p) => px(W != null ? W - (p[0] - ox) : p[0] - ox) + ' ' + px(p[1] - oy)).join(', ');
const eckSpitzen = (B, H) => '0px 0px, ' + px(B) + ' ' + px(H) + ', 0px 0px';
const polyLok = (pts, ox, oy, W) => pts.map((p) => [W != null ? W - (p[0] - ox) : p[0] - ox, p[1] - oy]);
const ringClip = (aus, inn, ox, oy, B, H, W) => umriss('polygon(evenodd, 0px 0px, ' + polyPts(aus.concat([aus[0]]), ox, oy, W) + ', ' + eckSpitzen(B, H) + ', ' + polyPts(inn.concat([inn[0]]), ox, oy, W) + ')', { t: 'ring', o: polyLok(aus, ox, oy, W), i: polyLok(inn, ox, oy, W) });
const polyClip = (pts, ox, oy, B, H, W) => umriss('polygon(0px 0px, ' + polyPts(pts.concat([pts[0]]), ox, oy, W) + ', ' + eckSpitzen(B, H) + ')', { t: 'poly', p: polyLok(pts, ox, oy, W) });
/* Laibung: Farbe nach der Richtung, in die ein Streifen schaut (Licht von links oben), wie bei den vier Flächen des Rechtecks */
const REV_FARBEN = [[0, [233, 226, 214]], [90, [201, 191, 176]], [180, [205, 196, 181]], [270, [221, 214, 202]], [360, [233, 226, 214]]];
function revFarbe(deg) {
  deg = ((deg % 360) + 360) % 360;
  for (let k = 0; k < REV_FARBEN.length - 1; k++) { const a = REV_FARBEN[k], b = REV_FARBEN[k + 1]; if (deg <= b[0]) { const t = (deg - a[0]) / (b[0] - a[0]); return 'rgb(' + a[1].map((c, i) => Math.round(c + (b[1][i] - c) * t)).join(', ') + ')'; } }
  return 'rgb(233, 226, 214)';
}
const w3dGeformt = (w, o) => !!(w.form && w.form !== 'rechteck') || !!(o && o.formen);
/* Fläche: Größe in Weltpixeln, Lage der linken oberen Ecke, Drehung um diese Kante. el._f: dieselben Werte für die WebGL-Bühne,
   n = ohne Übergang (erster Aufbau, weniger Bewegung) */
let W3D_SOFORT = false;
function face(el, W, H, x, y, z, rot, origin, clip) {
  if (!el) return;
  const bw = px(W), bh = px(H), tf = 'translate3d(' + px(x) + ', ' + px(y) + ', ' + px(z) + ')' + (rot ? ' ' + rot : ''), og = origin || '0 0', cp = clip || 'none';
  const k = bw + '|' + bh + '|' + tf + '|' + og + '|' + cp;
  if (el._k === k) return;
  el._k = k;
  el._f = { W: W, H: H, x: x, y: y, z: z, r: rot || '', o: og, c: clip && clip.g ? clip.g : null, n: W3D_SOFORT };
  el.style.width = bw; el.style.height = bh; el.style.transform = tf; el.style.transformOrigin = og; el.style.clipPath = cp;
}
/* Werte für die WebGL-Bühne nur bei Änderung neu setzen (sonst begänne jedes Mal ein Übergang) */
function w3dWerte(el, feld, o) {
  if (!el) return;
  const k = JSON.stringify(o);
  if (el[feld + 'k'] === k) return;
  el[feld + 'k'] = k; o.n = W3D_SOFORT; el[feld] = o;
}
/* Fassade im Modell: Art (Putz, Klinker, gedämmt, Holz) und Farbton. Die Art liest die KI aus dem Außenfoto (w.fassade); am Zahnrad der
   Bühne wählt der Kunde Art und Ton selbst (w.e_fassade, w.fassadeFarbe), das geht der KI vor. Ohne Ton die bisherigen Töne. Namen fürs
   Blatt und den Betrieb: modell.js (OPT.fassadeFarbe, fassadeText) */
const FASSADE_TON = {
  putz: [['weiss', 'Weiß', '#e4e0d8'], ['creme', 'Creme', '#dfd5bf'], ['beige', 'Beige', '#cdbd9e'], ['hellgrau', 'Hell\u00adgrau', '#bdb8af'], ['grau', 'Grau', '#9d978e'], ['dunkel', 'Dunkel\u00adgrau', '#6a6763']],
  klinker: [['rot', 'Rot', '#b85c42'], ['rotbunt', 'Rotbunt', '#8e4a38'], ['gelb', 'Gelb', '#cfb27e'], ['braun', 'Braun', '#6d4b3a'], ['anthrazit', 'Anthra\u00adzit', '#4a4648'], ['weiss', 'Weiß', '#d8d1c5']],
  holz: [['natur', 'Natur', '#a67a4e'], ['grau', 'Ver\u00adgraut', '#8d8982'], ['dunkel', 'Dunkel', '#5c4232'], ['weiss', 'Weiß', '#e3ded5']]
};
FASSADE_TON.wdvs = FASSADE_TON.putz;
const FASSADE_STD = { klinker: '#b85c42', holz: '#a67a4e' }; // Grundton der Struktur in der WebGL-Bühne ohne gewählten Ton
const fassadeTonListe = (art) => FASSADE_TON[art] || FASSADE_TON.putz;
const fassadeTon = (w) => { const e = fassadeTonListe(w.fassade).find((x) => x[0] === w.fassadeFarbe); return e ? e[2] : ''; };
const fassadeArtC = (w) => fassadeTon(w) || FASSADE_STD[w.fassade] || '';
function facadeBg(k, hex) {
  /* Klinker: Läuferverband, die Stoßfugen oben (sichtbar), die Lagerfugen darunter; Fuge hellgrau, leicht zum Stein getönt */
  if (k === 'klinker') { const b = hex || FASSADE_STD.klinker, fuge = mischHex('#bfb6a9', b, 0.1); return 'repeating-linear-gradient(90deg, transparent 0 38px, ' + fuge + ' 38px 41px), repeating-linear-gradient(0deg, ' + b + ' 0 18px, ' + fuge + ' 18px 21px)'; }
  if (k === 'holz') { const b = hex || FASSADE_STD.holz; return 'repeating-linear-gradient(90deg, ' + b + ' 0 26px, ' + mischHex(b, '#000000', 0.18) + ' 26px 28px)'; }
  if (hex) return 'linear-gradient(160deg, ' + hex + ', ' + mischHex(hex, '#000000', 0.13) + ')';
  if (k === 'wdvs') return 'linear-gradient(160deg, #b8b3ab, #a39d94)';
  return 'linear-gradient(160deg, #aaa193, #968c7e)';
}
/* Fensterbänke: Oberseite (oben), Stirnseite (stirn), Vollton (voll) je Material; innen und außen */
const GRANIT = 'radial-gradient(circle at 30% 40%, rgba(40, 38, 35, .38) 0 1px, transparent 1.6px) 0 0 / 6px 6px, radial-gradient(circle at 70% 25%, rgba(255, 255, 255, .6) 0 .8px, transparent 1.4px) 0 0 / 5px 5px, radial-gradient(circle at 45% 80%, rgba(90, 84, 76, .32) 0 1.2px, transparent 2px) 0 0 / 9px 9px, ';
const BANK = {
  behalten: { oben: 'linear-gradient(180deg, #eee9e0, #e2dbd0)', stirn: 'linear-gradient(180deg, #e2dbd0, #d3cbbe)', voll: '#e9e4dc' },
  werzalit: { oben: 'linear-gradient(180deg, #fdfdfb, #f0f0ed)', stirn: 'linear-gradient(180deg, #ffffff, #dcdcd8)', voll: '#f6f6f4' },
  stein: { oben: GRANIT + 'linear-gradient(90deg, #bdb7ae, #aca69d 40%, #c2bcb3 70%, #b1aba2)', stirn: GRANIT + 'linear-gradient(180deg, #aaa49b, #938d84)', voll: '#b7b1a8' },
  holz: { oben: 'repeating-linear-gradient(180deg, rgba(110, 66, 28, .2) 0 1.5px, transparent 1.5px 7px, rgba(110, 66, 28, .12) 7px 8px, transparent 8px 13px), linear-gradient(90deg, #d6ae74, #c69a5e 50%, #d2a76b)', stirn: 'linear-gradient(180deg, #b98a50, #9c7240)', voll: '#c99f64' },
  alu: { oben: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .22) 0 1px, transparent 1px 3px), linear-gradient(180deg, #e3e6e9, #b9bec4)', stirn: 'linear-gradient(180deg, #d9dde1, #9da3aa)', voll: '#c8ccd1' },
  aussen: { oben: 'linear-gradient(180deg, #cdd1d5, #b5b9be)', stirn: 'linear-gradient(180deg, #c0c4c9, #a3a8ae)', voll: '#bfc3c8' }
};
const bank = (k, seite) => BANK[k === 'behalten' && seite === 'aussen' ? 'aussen' : k] || BANK.behalten;
/* Auswahl: jedes Material als Musterpunkt im Chip */
OPT.fbi.forEach((o) => { o.bg = bank(o.k, 'innen').oben; });
OPT.fba.forEach((o) => { o.bg = bank(o.k, 'aussen').oben; });
/* Sonnenschutz: Farbton als Fläche, Schatten und Licht; außen aus OPT.sfarbe, innen aus OPT.ifarbe */
const SFARBE = { silber: ['#c9cdd1', '#8f969d', '#eef0f2'], weiss: ['#f1f0ea', '#c8c6bf', '#ffffff'], hellgrau: ['#cbd0cc', '#9aa09c', '#e6e9e6'], anthrazit: ['#3f454a', '#22262a', '#5c6368'], braun: ['#5e4434', '#3b2a1f', '#7d5d49'], bronze: ['#8a6a48', '#5a4230', '#ab8a64'], schwarz: ['#1a1b1d', '#050506', '#36383b'] };
const IFARBE = { weiss: ['#f4f2ec', '#d4d1c8', '#ffffff'], creme: ['#e8dcc4', '#c6b797', '#f5eddc'], grau: ['#9ea3a6', '#767b7f', '#bfc3c6'], anthrazit: ['#3b4044', '#22262a', '#565c61'], blau: ['#3f5f86', '#2b4260', '#5b7ba3'], gruen: ['#7f9a7c', '#5f785c', '#9db59a'], terra: ['#b56a48', '#8a4d32', '#cf8a68'] };
const sonneFarbe = (k) => SFARBE[k] || SFARBE.silber, innenFarbe = (k) => IFARBE[k] || IFARBE.weiss;
const sonneAktiv = (w) => (w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen') && (w.roll === 'aufsatz' || w.roll === 'vorbau' || w.roll === 'unterputz');
/* Zubehör im Modell (Detailangaben): was neue Flächen braucht, steht in der Signatur, damit die Bühne neu aufgebaut wird */
const dg = (w, k) => AW.detailGilt(w, k) && w[k] !== undefined && w[k] !== '';
function zubehoer(w) {
  const gel = AW.absturzFrage(w) && (w.absturz === 'gelaender' || w.absturz === 'glas');
  return { kl: w.sart === 'klappladen' && !istOffen(w, 'sart'), gel: gel, gitter: dg(w, 'gitter'), leiste: dg(w, 'leiste') && !w3dGeformt(w, {}) ? w.leiste : '', paneel: w.art === 'balkon' && w.paneel === 'paneel', oeff: dg(w, 'oeffner') && w.oeffner === 'kette', luef: dg(w, 'luefter') && w.luefter === 'schall',
    solar: sonneAktiv(w) && w.antrieb === 'solar' && w.roll !== 'unterputz', baender: w.baender !== 'verdeckt', insektK: w.insekt === 'rollo', sicht: dg(w, 'sichtZone') && w.sichtZone === 'unten' };
}
const zubehoerSig = (w) => { const z = zubehoer(w); return Object.keys(z).map((k) => (z[k] ? (z[k] === true ? 1 : z[k]) : 0)).join(''); };
const innenAktiv = (w) => !!w.iart && w.iart !== 'keiner';
/* Kasten und Schienen: wie der Behang, wie der Rahmen außen oder eigene Farben (sfTeile, sfK, sfS) */
function sonneTeilFarbe(w, teil) {
  if (dg(w, 'sfTeile') && w.sfTeile === 'rahmen') { const c = rahmenFarbe(w, 'aussen').solid; return [c, mischHex(c, '#000000', 0.28), mischHex(c, '#ffffff', 0.22)]; }
  const k = teil === 'K' ? w.sfK : w.sfS;
  if (dg(w, 'sfTeile') && w.sfTeile === 'eigen' && k) { const e = behangRal('sfarbe', k); return e ? behangTon(e.hex, 0.32, 0.28) : sonneFarbe(k); }
  return sonneFarbeW(w);
}
const SOLAR_BG = 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .14) 0 1px, transparent 1px 9px), repeating-linear-gradient(180deg, rgba(255, 255, 255, .14) 0 1px, transparent 1px 9px), linear-gradient(135deg, #2b3e56, #121c29)';
/* Kleinteile mit fester Farbe (Oberlichtöffner, Bedienung innen, Stopfen): inline geschrieben, damit das CSS-Modell und die WebGL-Bühne
   dieselbe Farbe zeigen; keine Farbe nur aus einer Klasse */
const TEIL_BG = { olr: 'linear-gradient(90deg, #e6e8ea, #a8adb3)', olh: 'linear-gradient(90deg, #f1f2f3, #b9bec3)', 'an-wickler': 'linear-gradient(180deg, #f6f5f1, #dcd9d2)', 'an-schlitz': '#3a3b3d',
  'an-gurt': 'repeating-linear-gradient(180deg, rgba(0, 0, 0, .1) 0 1px, transparent 1px 3px), #bdb8ad', 'an-stange': 'linear-gradient(90deg, #c9ccd0, #6d7379)', 'an-kurbel': 'linear-gradient(180deg, #e8eaec, #8d939a)',
  'an-taster': '#f6f5f1', 'an-wippe': 'linear-gradient(180deg, #ffffff 0 48%, #b9b7b1 48% 52%, #eceae4 52%)', 'an-funk': '#3a3b3d', 'stopf-l': '#2a2b2d', 'stopf-r': '#2a2b2d' };
const KNOPF_BG = 'radial-gradient(circle at 40% 35%, #ffffff, #c9ced3 60%, #8a9096)', SCHLOSS_BG = 'radial-gradient(circle at 50% 50%, #e9ecef 0 22%, #3a3e43 26%)';
/* Klappläden: Lamellen, Füllung (zwei Felder) oder senkrechte Bretter; Farbe nach Wahl, sonst Moosgrün */
const KL_FARBE = { weiss: ['#ece9e2', '#c9c5bc', '#ffffff'], anthrazit: ['#41474c', '#26292c', '#5d646a'], gruen: ['#3d6650', '#24402f', '#5a856c'], braun: ['#5e4434', '#3b2a1f', '#7d5d49'], holz: ['#b98a50', '#8a5f30', '#d3a76c'] };
function klBg(w, s) {
  const kf = dg(w, 'klFarbe') ? w.klFarbe : 'gruen', e = KL_FARBE[kf] ? null : ralFarbe(kf), c = e ? behangTon(e.hex, 0.34, 0.22) : KL_FARBE[kf] || KL_FARBE.gruen, F = c[0], D = c[1], L = c[2], a = dg(w, 'klBauart') ? w.klBauart : 'lamellen';
  if (a === 'fuellung') return 'linear-gradient(90deg, ' + D + ' 0 5%, transparent 5% 95%, ' + D + ' 95%), linear-gradient(180deg, ' + D + ' 0 4%, transparent 4% 48%, ' + D + ' 48% 52%, transparent 52% 96%, ' + D + ' 96%), linear-gradient(180deg, ' + L + ', ' + F + ')';
  if (a === 'leisten') return 'repeating-linear-gradient(90deg, ' + D + ' 0 ' + px(Math.max(0.8, 3 * s)) + ', ' + F + ' ' + px(Math.max(0.8, 3 * s)) + ' ' + px(Math.max(3, 96 * s)) + '), ' + F;
  return 'linear-gradient(90deg, ' + D + ' 0 6%, transparent 6% 94%, ' + D + ' 94%), repeating-linear-gradient(180deg, ' + L + ' 0 ' + px(Math.max(0.6, 4 * s)) + ', ' + F + ' ' + px(Math.max(0.6, 4 * s)) + ' ' + px(Math.max(2, 34 * s)) + ', ' + D + ' ' + px(Math.max(2, 34 * s)) + ' ' + px(Math.max(2.6, 42 * s)) + ')';
}
/* Geländer: Stäbe, Querstäbe, Lochblech oder Glas; Glasbrüstung in der Laibung immer Glas */
const GEL_FARBE = { edelstahl: 'linear-gradient(90deg, #d9dcdf, #a5aab0)', anthrazit: '#3c4146', weiss: '#eeece6' };
const gelFarbe = (w) => (dg(w, 'gelFarbe') ? (w.gelFarbe === 'rahmen' ? rahmenFarbe(w, 'aussen').solid : GEL_FARBE[w.gelFarbe] || (ralFarbe(w.gelFarbe) || {}).hex) : '') || '#3c4146';
function gelBg(w, s) {
  const c = gelFarbe(w).indexOf('gradient') >= 0 ? '#b9bdc2' : gelFarbe(w), f = w.absturz === 'glas' ? 'glas' : dg(w, 'gelForm') ? w.gelForm : 'stab', b = px(Math.max(1, 14 * s)), t = px(Math.max(4, 110 * s));
  if (f === 'glas') return 'linear-gradient(135deg, rgba(210, 228, 245, .5), rgba(180, 205, 230, .38))';
  const pfosten = 'linear-gradient(90deg, ' + c + ' 0 1.2%, transparent 1.2% 98.8%, ' + c + ' 98.8%), ';
  if (f === 'quer') return pfosten + 'repeating-linear-gradient(180deg, ' + c + ' 0 ' + b + ', transparent ' + b + ' ' + t + ')';
  if (f === 'lochblech') return pfosten + 'radial-gradient(circle, rgba(0, 0, 0, 0) 0 ' + px(Math.max(0.8, 5 * s)) + ', ' + c + ' ' + px(Math.max(1, 6 * s)) + ') 0 0 / ' + px(Math.max(3, 18 * s)) + ' ' + px(Math.max(3, 18 * s));
  return 'linear-gradient(180deg, transparent 0 94%, ' + c + ' 94%), repeating-linear-gradient(90deg, ' + c + ' 0 ' + b + ', transparent ' + b + ' ' + t + ')';
}
function gitterBg(w, s) {
  const c = '#2b2e31', b = px(Math.max(1, 16 * s)), t = px(Math.max(4, 120 * s));
  return (w.gitter === 'zier' ? 'radial-gradient(circle, transparent 0 ' + px(Math.max(2, 34 * s)) + ', ' + c + ' ' + px(Math.max(2.5, 34 * s)) + ' ' + px(Math.max(3, 42 * s)) + ', transparent ' + px(Math.max(3.5, 42 * s)) + ') 0 0 / ' + t + ' ' + px(Math.max(8, 240 * s)) + ', ' : '') +
    'linear-gradient(180deg, ' + c + ' 0 2%, transparent 2% 14%, ' + c + ' 14% 16%, transparent 16% 84%, ' + c + ' 84% 86%, transparent 86% 98%, ' + c + ' 98%), repeating-linear-gradient(90deg, ' + c + ' 0 ' + b + ', transparent ' + b + ' ' + t + ')';
}
/* Insektenschutz: Gewebe (Standard, Klarsicht, Pollenschutz, reißfest) und Rahmenfarbe */
function meshBg(w) {
  const g = dg(w, 'insGewebe') ? w.insGewebe : 'standard', a = g === 'klar' ? 0.08 : g === 'pollen' ? 0.24 : g === 'tier' ? 0.26 : 0.16, st = g === 'pollen' ? 3 : 4, lw = g === 'tier' ? 1.5 : 1;
  return 'repeating-linear-gradient(0deg, rgba(20, 20, 20, ' + a + ') 0 ' + lw + 'px, transparent ' + lw + 'px ' + st + 'px), repeating-linear-gradient(90deg, rgba(20, 20, 20, ' + a + ') 0 ' + lw + 'px, transparent ' + lw + 'px ' + st + 'px)';
}
const INS_FARBE = { weiss: '#f1f0ea', braun: '#4b3628', anthrazit: '#383e42' };
const insRahmen = (w) => (dg(w, 'insFarbe') ? (w.insFarbe === 'rahmen' ? rahmenFarbe(w, 'aussen').solid : INS_FARBE[w.insFarbe] || (ralFarbe(w.insFarbe) || {}).hex) : '') || '#55585c';
/* Fensterbänke in der gewählten Farbe (innen: Werzalit weiß, Marmor, Granit, Holzdekor; außen: Aluminium eloxiert oder beschichtet) */
const BANK_FARBE = {
  weiss: { oben: 'linear-gradient(180deg, #fdfdfb, #efefec)', stirn: 'linear-gradient(180deg, #ffffff, #dcdcd8)' },
  marmor: { oben: 'linear-gradient(115deg, #f3f0ea, #e3ded4 40%, #f1ede6 70%, #ddd8cc)', stirn: 'linear-gradient(180deg, #e8e4dc, #d3cdc2)' },
  granit: { oben: GRANIT + 'linear-gradient(90deg, #55524e, #4a4744 50%, #5a5753)', stirn: GRANIT + 'linear-gradient(180deg, #4d4a47, #3a3836)' },
  holz: { oben: BANK.holz.oben, stirn: BANK.holz.stirn },
  silber: { oben: BANK.alu.oben, stirn: BANK.alu.stirn },
  anthrazit: { oben: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .08) 0 1px, transparent 1px 3px), linear-gradient(180deg, #4d5358, #383d41)', stirn: 'linear-gradient(180deg, #454b50, #2c3034)' },
  bronze: { oben: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .1) 0 1px, transparent 1px 3px), linear-gradient(180deg, #9a7a56, #765a3d)', stirn: 'linear-gradient(180deg, #8a6a48, #5a4230)' }
};
function bankFarbig(b, k) {
  if (k && BANK_FARBE[k]) return Object.assign({}, b, BANK_FARBE[k]);
  const e = k ? ralFarbe(k) : null; if (!e) return b; // beschichtet in einem Ton aus dem Farbblatt
  return Object.assign({}, b, { oben: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .08) 0 1px, transparent 1px 3px), linear-gradient(180deg, ' + mischHex(e.hex, '#ffffff', 0.12) + ', ' + e.hex + ')', stirn: 'linear-gradient(180deg, ' + e.hex + ', ' + mischHex(e.hex, '#000000', 0.24) + ')', voll: e.hex });
}
const KAPPE = { kunststoff: 'linear-gradient(180deg, #74787d, #5d6166)', gleit: 'linear-gradient(180deg, #4a4e52, #33373a)' };
/* Behang außen als eine Fläche: Rollladenpanzer (Lamellen 40 mm), Screen (Gewebe, durchscheinend); der Raffstore hat einzelne Lamellen (w3dSonne) */
/* Teilung des Rollladenpanzers in mm: Kunststofflamellen 40, Alu-Lamellen 37 (ausgeschäumt) */
const panzerTeilung = (w) => (w.sart === 'rollladen' && dg(w, 'panzer') && w.panzer === 'alu' ? 37 : 40);
function behangBg(w, s) {
  const c = sonneFarbeW(w), F = c[0], D = c[1], L = c[2];
  if (w.sart === 'screen') return 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .16) 0 1px, transparent 1px ' + px(Math.max(2.5, 18 * s)) + '), repeating-linear-gradient(180deg, rgba(0, 0, 0, .08) 0 1px, transparent 1px ' + px(Math.max(2.5, 18 * s)) + '), ' + F;
  /* Rollladenpanzer, je Lamelle (40 mm, Alu 37 mm): oben die Lichtkante, darunter der helle Rücken der gewölbten Lamelle, nach unten dunkler,
     an der Unterkante der Schatten des Hakens und die schmale Lichtfuge zur nächsten Lamelle. Die WebGL-Bühne wölbt dazu jede Lamelle
     im Licht (_relief in w3dSonne, gleiche Teilung). Lichtschlitze (Detailangabe schlitz): je Lamelle eine Reihe kurzer Schlitze */
  const P = panzerTeilung(w), p = (f) => px(P * f * s), kante = px(Math.max(0.6, 1.6 * s)), dunkel = mischHex(D, '#000000', 0.42), hell = mischHex(F, '#ffffff', 0.14), glanz = mischHex(L, '#ffffff', 0.35);
  const panzer = 'repeating-linear-gradient(180deg, ' + glanz + ' 0 ' + kante + ', ' + hell + ' ' + kante + ' ' + p(0.22) + ', ' + F + ' ' + p(0.38) + ' ' + p(0.66) + ', ' + D + ' ' + p(0.84) + ' ' + p(0.9) + ', ' + dunkel + ' ' + p(0.9) + ' ' + p(0.955) + ', ' + L + ' ' + p(0.955) + ' ' + p(1) + ')';
  if (w.sart === 'rollladen' && dg(w, 'schlitz') && w.schlitz === 'mit') return 'radial-gradient(circle at 50% 80%, rgba(20, 20, 20, .55) 0 ' + px(Math.max(0.5, 2.6 * s)) + ', transparent ' + px(Math.max(0.8, 3.4 * s)) + ') 0 0 / ' + px(Math.max(2.5, 14 * s)) + ' ' + p(1) + ', ' + panzer;
  return panzer;
}
/* Führungsschiene: zur Öffnung hin die Einlaufrinne mit Bürstendichtung (dunkel), außen die Lichtkante; links und rechts gespiegelt (die Flächen
   stehen um 180° gedreht, bei der linken liegt die Rinne am örtlichen Anfang, bei der rechten am Ende). Seilführung: Edelstahlseil */
const schieneBg = (r, links, seil) => (seil ? 'linear-gradient(90deg, #7d838a, #e4e7ea 50%, #7d838a)' : 'linear-gradient(' + (links ? 90 : 270) + 'deg, ' + mischHex(r[1], '#000000', 0.45) + ' 0 9%, ' + r[1] + ' 9% 20%, ' + r[0] + ' 20% 64%, ' + r[2] + ' 64% 82%, ' + r[0] + ' 82%)');
/* Endschiene: oben die Lichtkante, unten beim Rollladen die Gummilippe (Anschlagprofil), beim Raffstore und Screen die dunkle Unterkante */
const endleisteBg = (b, rollo) => (rollo ? 'linear-gradient(180deg, ' + b[2] + ' 0 10%, ' + b[0] + ' 10% 58%, ' + b[1] + ' 58% 78%, #2a2b2d 78% 100%)' : 'linear-gradient(180deg, ' + b[2] + ' 0 12%, ' + b[0] + ' 12% 66%, ' + b[1] + ' 66% 88%, ' + mischHex(b[1], '#000000', 0.4) + ' 88%)');
/* Innen: Rollo (Stoff), Plissee (Falten 20 mm), Jalousie (Lamellen 25 mm mit Lichtspalt) */
function innenBg(w, s) {
  const c = innenFarbeW(w), F = c[0], D = c[1], L = c[2];
  if (w.iart === 'plissee') return 'repeating-linear-gradient(180deg, ' + L + ' 0 ' + px(10 * s) + ', ' + D + ' ' + px(10 * s) + ' ' + px(20 * s) + ')';
  if (w.iart === 'jalousie') return 'repeating-linear-gradient(180deg, ' + D + ' 0 ' + px(3 * s) + ', ' + F + ' ' + px(3 * s) + ' ' + px(19 * s) + ', transparent ' + px(19 * s) + ' ' + px(25 * s) + ')';
  return 'linear-gradient(90deg, ' + F + ', ' + L + ' 50%, ' + F + ')';
}
const SPROSS_FARBE = { weiss: 'linear-gradient(180deg, #fbfbf9, #e6e6e2)', anthrazit: 'linear-gradient(180deg, #4a5055, #2f3337)', messing: 'linear-gradient(180deg, #e6cf8a, #b08f45)' };
function barBg(w, fcol, side) {
  if (w.spross === 'auf' && w.aufSeite && w.aufSeite !== 'beide' && w.aufSeite !== side) return 'transparent';
  if (dg(w, 'sprFarbe') && SPROSS_FARBE[w.sprFarbe]) return SPROSS_FARBE[w.sprFarbe];
  if (w.spross === 'szr') return 'linear-gradient(180deg, #d9d9d6, #bdbdb9)';
  if (w.spross === 'echt') return fcol.bg;
  if (w.spross === 'auf' && w.aufSeite && w.aufSeite !== 'beide' && w.aufSeite !== side) return 'transparent';
  return fcol.bg;
}
/* Öffnendes Element der Bühne: Klassen, Signatur, Höhe, Blickwinkel */
function w3dHuelle(w, o) {
  const view = VIEWS[o.view || 'inside'], G = w3dGeformt(w, o);
  return '<div class="w3d-stage' + (o.sway ? ' is-live' : '') + (o.symbols ? ' show-sym' : '') + (o.sonne ? ' mit-sonne' : '') + (o.cls ? ' ' + o.cls : '') + '" id="' + (o.id || 'w3d') + '" data-struct="' + (G ? 'g' : 'e') + '" data-sig="' + esc(w3dSig(w, o)) + '" style="' + (o.stageH === 'auto' ? '' : 'height: ' + (o.stageH || 360) + 'px; ') + '--rx: ' + view[0] + 'deg; --ry: ' + view[1] + 'deg" data-view="' + (o.view || 'inside') + '">';
}
/* Struktur einmal bauen; die Geometrie setzt w3dLayout */
function w3dHTML(w, o) {
  o = o || {};
  const V = w3dCalc(w, o), view = VIEWS[o.view || 'inside'], fin = rahmenFarbe(w, 'innen'), fout = rahmenFarbe(w, 'aussen'), hcol = griffFarbe(w).bg;
  const faceEl = (role, cls, extra) => '<div class="w3d-f ' + cls + '" data-r="' + role + '"' + (extra || '') + '></div>';
  const G = w3dGeformt(w, o);
  let h = w3dHuelle(w, o) + (o.bg ? '<div class="w3d-bg" style="background-image: url(' + o.bg + ')"></div>' : '') + '<div class="w3d-cam"><div class="w3d-sway"><div class="w3d-world">';
  /* o.frei: das Element schwebt allein (Start), ohne Wand, Laibung, Boden, Fensterbänke, Fuge und Abdeckleisten */
  const frei = !!o.frei;
  if (!frei) {
  h += faceEl('wall-in', 'w3d-wall-in'); h += faceEl('wall-out', 'w3d-wall-out', ' style="background: ' + facadeBg(w.fassade, fassadeTon(w)) + '"');
  if (G) { for (let k = 0; k < FORM_O + FORM_U + 2; k++) h += faceEl('rs-' + k, 'w3d-rev w3d-rs'); }
  else h += faceEl('rev-t', 'w3d-rev w3d-rev-t') + faceEl('rev-b', 'w3d-rev w3d-rev-b') + faceEl('rev-l', 'w3d-rev w3d-rev-l') + faceEl('rev-r', 'w3d-rev w3d-rev-r');
  /* Türen stehen auf dem Boden: Raumboden innen, Terrasse außen */
  if (V.tuer) h += faceEl('floor-in', 'w3d-floor w3d-floor-in') + faceEl('floor-out', 'w3d-floor w3d-floor-out');
  }
  const bi = bank(w.fbi, 'innen'), ba = bank(w.fba, 'aussen'), Z = zubehoer(w);
  if (!frei) {
  h += faceEl('sill-t', 'w3d-sill', ' style="background: ' + bi.oben + '"') + faceEl('sill-f', 'w3d-sill w3d-sill-f', ' style="background: ' + bi.stirn + '"') + faceEl('sill-l', 'w3d-sill w3d-sill-e', ' style="background: ' + bi.stirn + '"') + faceEl('sill-r', 'w3d-sill w3d-sill-e', ' style="background: ' + bi.stirn + '"');
  h += faceEl('sa-t1', 'w3d-sill', ' style="background: ' + ba.oben + '"') + faceEl('sa-t2', 'w3d-sill', ' style="background: ' + ba.oben + '"') + faceEl('sa-f', 'w3d-sill w3d-sill-f', ' style="background: ' + ba.stirn + '"');
  /* Endkappen der Fensterbank außen */
  h += faceEl('sa-l', 'w3d-sill w3d-sill-e', ' style="background: ' + ba.stirn + '"') + faceEl('sa-r', 'w3d-sill w3d-sill-e', ' style="background: ' + ba.stirn + '"');
  /* Abdeckleisten an der Fuge zwischen Rahmen und Laibung, innen und/oder außen */
  if (Z.leiste === 'innen' || Z.leiste === 'beide') ['t', 'l', 'r'].forEach((k) => { h += faceEl('li-' + k, 'w3d-leiste'); });
  if (Z.leiste === 'aussen' || Z.leiste === 'beide') ['t', 'l', 'r'].forEach((k) => { h += faceEl('la-' + k, 'w3d-leiste'); });
  }
  h += '<div class="w3d-el' + (V.showEl ? '' : ' is-hidden') + '" data-r="el">';
  h += faceEl('el-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('el-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  if (!frei) h += faceEl('fuge', 'w3d-fuge'); // Einbaufuge rundum, sonst sieht man zwischen Rahmen und Laibung ins Leere
  if (!G) ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('el-side-' + k, 'w3d-frame w3d-side', ' style="background-color: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
  /* Auf dem Blendrahmen innen: elektrischer Fensteröffner (Kettenantrieb), aufgesetzter Schalldämmlüfter */
  if (Z.oeff) h += faceEl('oeff', 'w3d-band w3d-oeff');
  if (Z.luef) h += faceEl('luef', 'w3d-band w3d-luef');
  if (w.ol) h += faceEl('ol-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('ol-glass', 'w3d-glass') + faceEl('ol-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"') + faceEl('kf', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('kfb', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  /* Kippbares Oberlicht: Oberlichtöffner auf dem Blendrahmen (Stange und Hebel in Griffhöhe) */
  if (w.ol) h += faceEl('olr', 'w3d-olr') + faceEl('olh', 'w3d-olh');
  /* Unterlicht: festes Feld unter den Flügeln, Glas oder Paneel, darüber der Kämpfer */
  if (V.ulH) h += faceEl('ul-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('ul-glass', 'w3d-glass w3d-ul') + faceEl('ul-pan-b', 'w3d-paneel w3d-back') + faceEl('ul-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"') + faceEl('kfu', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('kfub', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  /* Schwelle: das untere Profil der Tür, Aluminium, mit Trittfläche */
  if (V.tuer) h += faceEl('schw', 'w3d-schw') + faceEl('schw-t', 'w3d-schw w3d-schw-t');
  for (let i = 0; i < V.n - 1; i++) h += faceEl('mul-' + i, 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('mulb-' + i, 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  w.sashes.forEach((x, i) => {
    const fixed = x.t === 'F' || x.t === 'X', symSvg = '<svg class="w3d-sym" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-r="sym-' + i + '">' + symPaths(w, x) + '</svg>';
    const bars = w.bars.filter((b) => b.s === i).map((b) => '<span class="w3d-bar' + (o.editBars ? ' is-edit' : '') + (o.selBar === b.id ? ' is-sel' : '') + '" data-bar="' + b.id + '" data-dir="' + b.d + '" data-r="bar-' + b.id + '" style="--bi: ' + barBg(w, fin, 'innen') + '; --bo: ' + barBg(w, fout, 'aussen') + '; background: var(--bi)"></span>').join('');
    h += '<div class="w3d-sash' + (fixed ? ' is-fixed' : '') + (o.selSash === i && o.selectable ? ' is-sel' : '') + '" data-r="sash-' + i + '" data-sash="' + i + '" data-t="' + x.t + '" data-din="' + x.din + '">';
    h += faceEl('sf-in-' + i, 'w3d-frame w3d-sf', ' style="background: ' + fin.bg + '"');
    h += '<div class="w3d-f w3d-glass" data-r="glass-' + i + '" data-glass="' + i + '">' + symSvg + bars + '</div>' + faceEl('pane-a-' + i, 'w3d-scheibe') + faceEl('pane-b-' + i, 'w3d-scheibe');
    for (let k = 0; k < 8; k++) h += '<span class="w3d-f w3d-pilz" data-r="pz-' + i + '-' + k + '" style="--i: ' + k + '"></span>';
    /* Paneel unten in der Balkontür (mit Riegel darüber), nur unten satiniertes Glas */
    if (Z.paneel && !fixed) h += faceEl('riegel-i-' + i, 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('pan-i-' + i, 'w3d-paneel') + faceEl('pan-o-' + i, 'w3d-paneel w3d-back') + faceEl('riegel-o-' + i, 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
    if (Z.sicht) h += faceEl('su-' + i, 'w3d-sicht-u');
    /* Bänder: oben und unten auf der Bandseite (sichtbare Bänder; verdeckte liegen im Falz) */
    if (Z.baender && (x.t === 'D' || x.t === 'DK' || x.t === 'P') && !x.st) h += faceEl('bd-o-' + i, 'w3d-band') + faceEl('bd-u-' + i, 'w3d-band');
    h += faceEl('sf-out-' + i, 'w3d-frame w3d-sf w3d-back', ' style="background: ' + fout.bg + '"');
    ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('sfe-' + k + '-' + i, 'w3d-frame w3d-side w3d-sfe', ' style="background-color: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
    /* Griff: Rosette, Hebel und darauf Druckknopf und Schließzylinder als eigene Flächen (CSS-Modell und WebGL-Bühne zeigen dieselben) */
    h += '<div class="w3d-f w3d-ros" data-r="hros-' + i + '" style="background: ' + hcol + '"></div><div class="w3d-handle" data-r="handle-' + i + '" style="background: ' + hcol + '"><span class="w3d-f w3d-hknopf" data-r="hk-' + i + '"></span><span class="w3d-f w3d-hschloss" data-r="hs-' + i + '"></span></div>';
    /* Türen: Griff außen (Balkontür: Ziehgriff mit Schnäpper oder abschließbar; Schiebe- und Falttüren: Schließzylinder; Hebe-Schiebe:
       Griffmuschel) auf der Außenseite */
    if (V.tuer) h += '<div class="w3d-griffa" data-r="ga-' + i + '" style="background: ' + hcol + '"><span class="w3d-f w3d-hschloss" data-r="gas-' + i + '"></span></div>';
    h += '<div class="w3d-selring" data-r="ring-' + i + '"></div>';
    h += '</div>';
  });
  h += '</div>';
  /* Kasten bzw. Blende: Vorbau vor der Fassade (mit Schräge unten), Aufsatz in der Öffnung oben (außen überputzt, nur der Auslaufschlitz) */
  if (w.roll === 'vorbau' || w.roll === 'aufsatz') h += faceEl('roll-f', 'w3d-roll') + faceEl('roll-sl', 'w3d-roll w3d-roll-sl') + faceEl('roll-b', 'w3d-roll w3d-roll-b') + faceEl('roll-t', 'w3d-roll w3d-roll-t') + faceEl('roll-l', 'w3d-roll w3d-roll-s') + faceEl('roll-r', 'w3d-roll w3d-roll-s');
  /* Sonnenschutz außen: Führungsschienen links und rechts (Stirn und Innenseite), Behang mit Endleiste. Raffstore aus einzelnen
     Lamellen mit Aufzugbändern, die sich unten auf der Endschiene zum Paket sammeln; Rollladen als Panzer mit Lichtschlitzen,
     Screen als Gewebe mit Fallstab in ZIP-Schienen. Innen: Rollo, Plissee oder Jalousie vor dem Glas */
  if (sonneAktiv(w)) {
    h += faceEl('fs-l', 'w3d-fs') + faceEl('fs-l2', 'w3d-fs w3d-fs-s') + faceEl('fs-r', 'w3d-fs') + faceEl('fs-r2', 'w3d-fs w3d-fs-s');
    if (w.sart === 'raffstore') { for (let k = 0; k < LAM_MAX; k++) h += '<div class="w3d-f w3d-lam" data-r="lam-' + k + '" style="--k: ' + k + '"></div>'; h += faceEl('band-l', 'w3d-aufzug') + faceEl('band-r', 'w3d-aufzug'); ['kord-lv', 'kord-lh', 'kord-rv', 'kord-rh'].forEach((k) => { h += faceEl(k, 'w3d-aufzug w3d-kordel'); }); }
    else h += faceEl('behang', 'w3d-behang' + (w.sart === 'screen' ? ' w3d-screen' : ''));
    h += faceEl('behang-u', 'w3d-behang-u') + faceEl('behang-ub', 'w3d-behang-u w3d-behang-ub');
    /* Rollladen: Anschlagstopfen auf der Endleiste (halten den Panzer oben am Kasten) */
    if (w.sart === 'rollladen') h += faceEl('stopf-l', 'w3d-stopfen') + faceEl('stopf-r', 'w3d-stopfen');
  }
  if (Z.solar) h += faceEl('solar', 'w3d-solar');
  /* Klappläden an der Fassade, Geländer vor der Öffnung, Fenstergitter */
  if (Z.kl) h += faceEl('kl-l', 'w3d-klappladen') + faceEl('kl-r', 'w3d-klappladen');
  if (Z.gel) h += faceEl('gel', 'w3d-gel') + faceEl('gel-h', 'w3d-gel w3d-gel-h');
  if (Z.gitter) h += faceEl('gitter', 'w3d-gitter');
  if (innenAktiv(w)) h += faceEl('innen-k', 'w3d-innen-k') + faceEl('innen', 'w3d-innen') + faceEl('innen-u', 'w3d-innen-u');
  if (w.insekt && w.insekt !== 'keiner') h += faceEl('mesh', 'w3d-mesh') + (Z.insektK ? faceEl('mesh-k', 'w3d-roll w3d-mesh-k') : '');
  /* Bedienung innen neben der Öffnung: Gurtwickler mit Gurtband, Kurbelstange, Wandtaster (w3dAntrieb) */
  if (sonneAktiv(w) || w.art === 'hst') h += faceEl('an-gurt', 'w3d-an w3d-an-gurt') + faceEl('an-wickler', 'w3d-an w3d-an-wickler') + faceEl('an-schlitz', 'w3d-an w3d-an-schlitz') + faceEl('an-stange', 'w3d-an w3d-an-stange') + faceEl('an-kurbel', 'w3d-an w3d-an-kurbel') + faceEl('an-taster', 'w3d-an w3d-an-taster') + faceEl('an-wippe', 'w3d-an w3d-an-wippe') + faceEl('an-funk', 'w3d-an w3d-an-funk');
  (V.dims || []).forEach((k) => { h += dimHTML(k, V.active === k); });
  h += '</div></div></div>';
  h += '<span class="w3d-hint" data-r="hint"' + (o.hint ? '' : ' hidden') + '>' + esc(o.hint || '') + '</span>';
  if (o.lupe) h += '<div class="w3d-lupe" data-r="lupe" data-k="' + esc(glasLupeKey(w)) + '">' + glasLupe(w) + '</div>';
  h += '<div class="rail rail-h" data-rail="v" hidden></div><div class="rail rail-v" data-rail="h" hidden></div>';
  return h + '</div>';
}
const dimHTML = (k, active) => '<div class="w3d-dim ' + (k[0] === 'e' ? 'el' : 'mo') + (active ? ' is-active' : '') + '" data-r="dim-' + k + '" data-dim="' + k + '"><span class="w3d-dim-line"></span><span class="w3d-dim-cap a"></span><span class="w3d-dim-cap b"></span><span class="w3d-dim-lab" data-r="lab-' + k + '"></span></div>';
/* Feld und Enden der aktiven Maßlinie liegen flach über dem Modell (.w3d-feldlage), nicht im Raum: so verdeckt sie keine Wand, kein Boden
   und keine Laibung, und die Schrift bleibt scharf. Ihre Lage folgt Bild für Bild den Endkappen der Linie (Schwingen, Drehen, Wechsel
   zum nächsten Maß). an: m mittig, l/r links/rechts neben einer senkrechten Linie, o/u über/unter einer waagerechten. */
function feldLage(stage, o, an) {
  let L = stage.querySelector('.w3d-feldlage');
  const k = o.active, who = k[0] === 'e' ? 'el' : 'mo', fh = feldHTML(o.feld), en = o.enden || ['', ''];
  if (!L) { stage.insertAdjacentHTML('beforeend', '<div class="w3d-feldlage" aria-hidden="true"><div class="mu-feld"></div><span class="mu-ende a"></span><span class="mu-ende b"></span></div>'); L = stage.querySelector('.w3d-feldlage'); }
  L.className = 'w3d-feldlage ' + who + ' an-' + an + (o.feld.tipp ? ' tipp' : ''); L._k = k; L._an = an;
  L.setAttribute('aria-hidden', o.feld.tipp ? 'false' : 'true');
  const f = L.querySelector('.mu-feld'); if (f._h !== fh) { f._h = fh; f.innerHTML = fh; f.classList.toggle('leer', !o.feld.v); f.classList.toggle('aus', !!o.feld.aus); }
  L.querySelectorAll('.mu-ende').forEach((e, i) => { if (e.textContent !== en[i]) e.textContent = en[i]; });
  feldFolgen(stage);
}
function feldFolgen(stage) {
  if (stage._folgt) return; stage._folgt = true;
  let alt = '';
  const schritt = () => {
    const L = stage.querySelector('.w3d-feldlage');
    if (!L || !document.body.contains(stage)) { stage._folgt = false; return; }
    const d = stage.querySelector('[data-r="dim-' + L._k + '"]'), ca = d && d.querySelector('.w3d-dim-cap.a'), cb = d && d.querySelector('.w3d-dim-cap.b');
    if (ca && cb) {
      const r = stage.getBoundingClientRect(), A = ca.getBoundingClientRect(), B = cb.getBoundingClientRect();
      const ax = A.left + A.width / 2 - r.left, ay = A.top + A.height / 2 - r.top, bx = B.left + B.width / 2 - r.left, by = B.top + B.height / 2 - r.top;
      const sig = [ax, ay, bx, by, r.width, r.height].map(Math.round).join(',') + L._an + L.querySelector('.mu-feld')._h;
      if (sig !== alt) { alt = sig; feldSetzen(L, r.width, r.height, ax, ay, bx, by, d.classList.contains('v')); }
    }
    requestAnimationFrame(schritt);
  };
  requestAnimationFrame(schritt);
}
function feldSetzen(L, W, H, ax, ay, bx, by, vert) {
  const f = L.querySelector('.mu-feld'), ea = L.querySelector('.mu-ende.a'), eb = L.querySelector('.mu-ende.b'), an = L._an, rand = 8;
  const fw = f.offsetWidth, fh = f.offsetHeight, wa = ea.offsetWidth, ha = ea.offsetHeight, wb = eb.offsetWidth, hb = eb.offsetHeight;
  const mx = (ax + bx) / 2, my = (ay + by) / 2, lim = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const setz = (e, x, y, w, h) => { e.style.transform = 'translate(' + Math.round(lim(x, rand, W - w - rand)) + 'px, ' + Math.round(lim(y, rand, H - h - rand)) + 'px)'; };
  if (vert) {
    /* Feld mittig auf der Linie, bei den Rändern 8 px daneben zur Öffnung hin; Enden rechts neben den Endkappen (beim rechten Rand links) */
    const fx = an === 'r' ? mx + 8 : an === 'l' ? mx - 8 - fw : mx - fw / 2;
    setz(f, fx, my - fh / 2, fw, fh);
    const links = an === 'l'; eb.style.visibility = '';
    setz(ea, links ? ax - 16 - wa : ax + 16, ay - ha / 2, wa, ha); setz(eb, links ? bx - 16 - wb : bx + 16, by - hb / 2, wb, hb);
  } else {
    /* Feld über der Linie (beim Rand oben 24 px darunter, damit es den Rahmen nicht verdeckt); Enden außen vor den Endkappen auf
       Linienhöhe, wenn dort Platz ist, sonst unter (beim Rand oben über) der Linie an den Enden */
    setz(f, mx - fw / 2, an === 'u' ? my + 24 : my - 14 - fh, fw, fh);
    const oben = an === 'u', aAus = ax - 10 - wa >= rand, bAus = bx + 10 + wb <= W - rand;
    /* Passen beide nicht außen hin und stoßen an der Linie zusammen, steht das Etikett einmal mittig (die Enden heißen gleich) */
    const eins = !aAus && !bAus && ax + wa + 8 > bx - wb && ea.textContent === eb.textContent;
    eb.style.visibility = eins ? 'hidden' : '';
    if (eins) setz(ea, mx - wa / 2, oben ? my - 16 - ha : my + 16, wa, ha);
    else {
      if (aAus) setz(ea, ax - 10 - wa, ay - ha / 2, wa, ha); else setz(ea, ax, oben ? ay - 16 - ha : ay + 16, wa, ha);
      if (bAus) setz(eb, bx + 10, by - hb / 2, wb, hb); else setz(eb, bx - wb, oben ? by - 16 - hb : by + 16, wb, hb);
    }
  }
  L.classList.add('steht');
}
/* Eingabefeld auf der aktiven Maßlinie (o.feld, Messen und Ränder): leer mit Beispiel, sonst der Wert groß in mm und darunter in cm */
function feldHTML(f) {
  const v = num(f.v);
  if (f.aus) return '';
  /* Messen im Raum: der bestätigte Wert als Knopf, ein Tipp öffnet die Zifferntasten wieder */
  if (f.tipp && v) return '<button type="button" class="fd-knopf" data-act="' + f.act + '" aria-label="' + esc('Maß ändern: ' + thousand(v) + ' Millimeter') + '"><span class="fd-wert">' + esc(thousand(v)) + '</span><span class="fd-u">mm</span><span class="fd-aendern" aria-hidden="true">' + STIFT + '</span></button>';
  if (!f.v) return '<span class="fd-zeile"><span class="fd-caret" aria-hidden="true"></span><span class="fd-ph">z. B. ' + esc(thousand(f.ph || 1250)) + '</span><span class="fd-u">mm</span></span>';
  return '<span class="fd-zeile"><span class="fd-wert">' + esc(thousand(v)) + '</span><span class="fd-u">mm</span></span><span class="fd-cm">' + (v >= 250 && v <= 6000 ? '= ' + String(Math.round(v) / 10).replace('.', ',') + ' cm' : '&nbsp;') + '</span>';
}
function symPaths(w, x) {
  if (x.t === 'X') return '';
  if (x.t === 'PS') return symPaths(w, { t: 'S', din: x.din }) + symPaths(w, { t: 'K', din: x.din });
  if (x.t === 'S') { const d = x.din === 'L' ? 1 : -1, a = 50 - d * 26, b = 50 + d * 26; return '<path d="M' + a + ' 56H' + b + 'M' + (b - d * 7) + ' 49L' + b + ' 56L' + (b - d * 7) + ' 63" fill="none" stroke="rgba(29,29,31,.45)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'; }
  return sym(0, 0, 100, 100, x.t === 'P' ? 'D' : x.t, x.din, w.richtung === 'aussen' ? '5 4' : undefined, 'rgba(29,29,31,.45)', 1).map((p) => '<path d="' + p.d + '" fill="none" stroke="' + p.s + '" stroke-width="1.2"' + (p.da ? ' stroke-dasharray="' + p.da + '"' : '') + ' vector-effect="non-scaling-stroke"></path>').join(''); }
/* Lupe: Schnitt durch die Unterkante des Flügels, groß genug zum Lesen. Links Raum, rechts außen. Zeigt Scheibenzahl,
   Abstandhalter, Gasfüllung, Glasleiste und Dichtungen; Schallschutz (dickere Außenscheibe), Sicherheitsglas (Folie im Verbund),
   Sonnenschutz (Beschichtung innen auf der Außenscheibe), Sichtschutz (raue Raumseite). */
function glasLupe(w) {
  const fn = w.glasfn || [], drei = w.glas !== '2', vsg = fn.indexOf('vsg') >= 0 || AW.rcAb(w, 'rc2'), schall = fn.indexOf('schall') >= 0, sonne = fn.indexOf('sonne') >= 0, sicht = fn.indexOf('sicht') >= 0;
  const sch = [{ d: schall ? 8 : 5, schicht: sonne }]; if (drei) sch.push({ d: 5 }); sch.push({ d: vsg ? 8 : 5, folie: vsg, matt: sicht });
  const zw = drei ? 12 : 17, breit = sch.reduce((a, x) => a + x.d, 0) + zw * (sch.length - 1), xr = 52 + breit / 2;
  /* Abstandhalter und Dichtungen in der gewählten Farbe (sonst dunkelgrau und schwarz) */
  const ahF = dg(w, 'ahFarbe') ? AH_SOL[w.ahFarbe] || '#4d545c' : '#4d545c', dF = dg(w, 'dicht') ? (OPT.dicht.find((o) => o.k === w.dicht) || {}).bg || '#1f2226' : '#1f2226';
  const R = (x, y, b, h, f, extra) => '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(b) + '" height="' + n1(h) + '" fill="' + f + '"' + (extra || '') + '/>';
  let h = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="lupe-k"><circle cx="50" cy="50" r="46"/></clipPath>' +
    '<pattern id="lupe-m" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><circle cx="1.1" cy="1.1" r=".55" fill="#ffffff"/></pattern></defs><g clip-path="url(#lupe-k)">';
  h += R(0, 0, 100, 100, '#3b3733') + R(52, 0, 48, 100, '#232a31');
  /* Glaspaket von außen (rechts) nach innen */
  let x = xr; const lagen = [];
  sch.forEach((g, k) => { x -= g.d; lagen.push([x, g]); if (k < sch.length - 1) { x -= zw; lagen.push([x, null]); } });
  lagen.forEach((l) => {
    const gx = l[0], g = l[1];
    if (!g) { h += R(gx, -2, zw, 72, 'rgba(150, 196, 236, .32)') + R(gx + 1.2, 60, zw - 2.4, 8, ahF, ' rx="1"') + R(gx + 2.6, 61.6, zw - 5.2, 1.4, 'rgba(255, 255, 255, .45)') + R(gx + 0.6, 68, zw - 1.2, 3.4, '#1f2226'); return; }
    h += R(gx, -2, g.d, 73, '#cfe2f4', ' stroke="#4f7fae" stroke-width="1"');
    if (g.folie) h += R(gx + g.d / 2 - 0.9, -2, 1.8, 73, '#2fa57f');
    if (g.schicht) h += R(gx - 1.1, -2, 1.4, 73, '#c9962e');
    if (g.matt) h += R(gx, -2, 2.4, 73, 'url(#lupe-m)');
  });
  const xi = lagen[lagen.length - 1][0];
  /* Flügelprofil mit Kammern, Glasleiste innen, Dichtungen innen und außen */
  h += '<path d="M8 110V70q0-4 4-4h76q4 0 4 4v40z" fill="#ffffff" stroke="#6a7178" stroke-width="1.3"/>';
  [24, 38, 62, 76].forEach((cx) => { h += '<path d="M' + cx + ' 72v40" stroke="#c4c8cc" stroke-width="1.1"/>'; });
  h += '<path d="M14 84h72" stroke="#c4c8cc" stroke-width="1.1"/>';
  h += R(xi - 10, 54, 10, 14, '#ffffff', ' rx="1.4" stroke="#6a7178" stroke-width="1.1"') + R(xi - 2.6, 50, 2.6, 6, dF, ' rx="1"') + R(xr, 50, 2.6, 6, dF, ' rx="1"');
  if (schall) h += '<path d="M83 33c3.4 3.4 3.4 10.6 0 14M79 36c1.8 1.8 1.8 6.2 0 8" fill="none" stroke="#4f7fae" stroke-width="1.8" stroke-linecap="round"/>';
  if (sonne) h += '<circle cx="77" cy="20" r="4" fill="#e2a93b"/><path d="M77 12.8v1.8M77 25.4v1.8M69.8 20h1.8M82.4 20h1.8M71.9 14.9l1.2 1.2M80.9 23.9l1.2 1.2M71.9 25.1l1.2-1.2M80.9 16.1l1.2-1.2" stroke="#e2a93b" stroke-width="1.3" stroke-linecap="round"/>';
  h += '</g><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(243, 242, 238, .5)" stroke-width="1.6"/></svg>';
  return h;
}
const glasLupeKey = (w) => [w.glas, (w.glasfn || []).join(','), w.rc, dg(w, 'ahFarbe') ? w.ahFarbe : '', dg(w, 'dicht') ? w.dicht : ''].join('|');
const glasText = (w) => (w.glas === '2' ? '2 Scheiben · Ug ≈ 1,1' : '3 Scheiben · Ug ≈ 0,5 bis 0,7');
/* Struktur-Signatur: solange sie gleich bleibt, wird die Bühne weiterverwendet und alles morpht mit Übergängen */
function w3dSig(w, o) { o = o || {}; const V = w3dCalc(w, o); return [o.id || 'w3d', w.art || 'fenster', o.frei ? 'frei' : '', w3dGeformt(w, o) ? 'g' : 'e', w.sashes.length, w.ol ? 1 : 0, w.roll === 'vorbau' || w.roll === 'aufsatz' ? 1 : 0, w.insekt && w.insekt !== 'keiner' ? 1 : 0, w.bars.map((b) => b.id).join(','), o.bg ? 1 : 0, V.tuer ? 't' : 'f', V.ulH ? 1 : 0, sonneAktiv(w) ? w.sart : 0, innenAktiv(w) ? 1 : 0, zubehoerSig(w)].join('|'); }
/* Farben und Materialien auf die Flächen schreiben (mit Übergang, wenn sich etwas ändert) */
function w3dPaint(stage, w) {
  /* Nur schreiben, was sich geändert hat (der Vergleich mit dem gelesenen Stil schlägt bei Verläufen immer fehl) */
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), bg = (r, v) => { const el = q(r); if (el && el._bg !== v) { el._bg = v; el.style.background = v; } }, bgc = (r, v) => { const el = q(r); if (el && el._bg !== v) { el._bg = v; el.style.backgroundColor = v; } };
  const fin = rahmenFarbe(w, 'innen'), fout = rahmenFarbe(w, 'aussen'), hcol = griffFarbe(w).bg;
  stage.classList.toggle('glas-sonne', w.glasfn.indexOf('sonne') >= 0); stage.classList.toggle('glas-sicht', w.glasfn.indexOf('sicht') >= 0 && !(dg(w, 'sichtZone') && w.sichtZone === 'unten'));
  stage.classList.toggle('glas-klar', w.glasfn.indexOf('extraklar') >= 0); stage.classList.toggle('glas-vogel', w.glasfn.indexOf('vogel') >= 0);
  /* Werkstoff der Bühne (buehne.js): Profilform, Oberfläche, Dichtungs- und Abstandhalterfarbe; das Attribut löst das Neuzeichnen aus */
  stage._profil = dg(w, 'profil') ? w.profil : ''; stage._oberfl = dg(w, 'oberfl') ? w.oberfl : '';
  stage._dicht = dg(w, 'dicht') ? (OPT.dicht.find((o) => o.k === w.dicht) || {}).bg || '' : ''; stage._ah = dg(w, 'ahFarbe') ? AH_SOL[w.ahFarbe] || '' : '';
  const mat = [stage._profil, stage._oberfl, w.dicht || '', w.ahFarbe || ''].join('|'); if (stage.getAttribute('data-mat') !== mat) stage.setAttribute('data-mat', mat);
  stage._orn = (ORN.find((o) => o.k === w.orn) || ORN[0]).bg; stage.style.setProperty('--orn', stage._orn); stage.setAttribute('data-scheiben', w.glas === '2' ? '2' : '3');
  stage.classList.toggle('mit-schloss', AW.rcAb(w, 'rc2n') || w.griff === 'abschliessbar' || (dg(w, 'kinder') && w.kinder === 'schloss')); stage.classList.toggle('mit-knopf', w.griff === 'druckknopf');
  stage.classList.toggle('ohne-griff', w.griff === 'ohne' || (w.griff === 'motor' && w.art === 'hst'));
  const bi = bankFarbig(bank(w.fbi, 'innen'), dg(w, 'fbiFarbe') ? w.fbiFarbe : ''), ba = bankFarbig(bank(w.fba, 'aussen'), dg(w, 'fbaFarbe') ? w.fbaFarbe : ''), kp = dg(w, 'fbaKappe') && KAPPE[w.fbaKappe] ? KAPPE[w.fbaKappe] : ba.stirn;
  bg('wall-out', facadeBg(w.fassade, fassadeTon(w))); bg('sill-t', bi.oben); bg('sill-f', bi.stirn); bg('sill-l', bi.stirn); bg('sill-r', bi.stirn); bg('sa-t1', ba.oben); bg('sa-t2', ba.oben); bg('sa-f', ba.stirn); bg('sa-l', kp); bg('sa-r', kp);
  ['t', 'l', 'r'].forEach((k) => { bg('li-' + k, fin.bg); bg('la-' + k, fout.bg); });
  bg('oeff', 'linear-gradient(180deg, #eef0f2, #c3c8cd 60%, #a3a9af)');
  bg('luef', 'repeating-linear-gradient(90deg, rgba(0, 0, 0, .2) 0 1px, transparent 1px 5px), linear-gradient(180deg, ' + mischHex(fin.solid, '#ffffff', 0.12) + ', ' + mischHex(fin.solid, '#000000', 0.1) + ')');
  bg('solar', SOLAR_BG); Object.keys(TEIL_BG).forEach((r) => bg(r, TEIL_BG[r]));
  bg('el-front', fin.bg); bg('el-back', fout.bg); bgc('el-side-l', fout.solid); bgc('el-side-r', fout.solid); bgc('el-side-t', fin.solid); bgc('el-side-b', fin.solid);
  bg('ol-front', fin.bg); bg('ol-back', fout.bg); bg('kf', fin.bg); bg('kfb', fout.bg);
  bg('ul-front', fin.bg); bg('ul-back', fout.bg); bg('kfu', fin.bg); bg('kfub', fout.bg);
  const paneel = w.ul && w.ulA === 'paneel', ug = q('ul-glass'), upb = q('ul-pan-b');
  if (ug) { ug.classList.toggle('w3d-glass', !paneel); ug.classList.toggle('w3d-paneel', paneel); ug._bg = paneel ? fin.solid : ''; ug.style.background = ug._bg; }
  if (upb) { upb._bg = fout.solid; upb.style.background = upb._bg; upb.style.opacity = paneel ? '' : '0'; }
  if (sonneAktiv(w)) {
    /* Vorbau: Rollladenkasten mit gerundeter Front (Verlauf), Raffstore und Screen mit gerader Blende; Aufsatz: außen überputzt.
       Kasten und Schienen in ihrer Farbe (sfTeile, sfK, sfS), der Raffstore am Seil zeigt Edelstahlseile statt Schienen */
    const c = sonneTeilFarbe(w, 'K'), F = c[0], D = c[1], L = c[2], r = sonneTeilFarbe(w, 'S'), b = sonneFarbeW(w), seil = w.sart === 'raffstore' && dg(w, 'fuehrung') && w.fuehrung === 'seil';
    /* Aufsatzkasten: die Blende außen verputzt bzw. verblendet wie die Fassade (Muster läuft weiter), als Alu-Blende in Kastenfarbe mit
       Revisionsfuge unten (Detailangabe blende) */
    const aluBl = w.roll === 'aufsatz' && dg(w, 'blende') && w.blende === 'alu';
    if (w.roll === 'aufsatz') { bg('roll-f', aluBl ? 'linear-gradient(180deg, ' + L + ' 0 3%, ' + F + ' 10% 84%, ' + D + ' 88% 91%, ' + mischHex(D, '#000000', 0.35) + ' 91% 93.5%, ' + F + ' 93.5%)' : facadeBg(w.fassade, fassadeTon(w))); bg('roll-sl', 'transparent'); bg('roll-t', 'transparent'); bg('roll-l', 'transparent'); bg('roll-r', 'transparent'); }
    /* Vorbau: Rundkasten des Rollladens mit der Fuge des Revisionsdeckels, eckige Blende bei Raffstore und Screen */
    else { bg('roll-f', w.sart === 'rollladen' ? 'linear-gradient(180deg, ' + L + ' 0 2%, ' + F + ' 14% 56%, ' + D + ' 60% 61.5%, ' + mischHex(F, '#ffffff', 0.18) + ' 61.5% 63%, ' + F + ' 66% 82%, ' + D + ')' : 'linear-gradient(180deg, ' + L + ' 0 3%, ' + F + ' 12% 86%, ' + D + ')'); bg('roll-sl', 'linear-gradient(180deg, ' + F + ', ' + D + ')'); bg('roll-b', D); bg('roll-t', L); bg('roll-l', F); bg('roll-r', F); }
    bg('fs-l', schieneBg(r, true, seil)); bg('fs-r', schieneBg(r, false, seil)); bg('fs-l2', seil ? '#9aa0a6' : r[1]); bg('fs-r2', seil ? '#9aa0a6' : r[1]);
    bg('behang-u', endleisteBg(b, w.sart === 'rollladen')); bg('behang-ub', b[1]);
  }
  else { bg('roll-f', ''); bg('roll-sl', ''); bg('roll-b', ''); bg('roll-t', ''); bg('roll-l', ''); bg('roll-r', ''); }
  w.sashes.forEach((x, i) => {
    bg('mul-' + i, fin.bg); bg('mulb-' + i, fout.bg); bg('sf-in-' + i, fin.bg); bg('sf-out-' + i, fout.bg); bg('handle-' + i, hcol); bg('hros-' + i, hcol); bg('ga-' + i, hcol);
    bg('hk-' + i, KNOPF_BG); bg('hs-' + i, SCHLOSS_BG); bg('gas-' + i, SCHLOSS_BG);
    bgc('sfe-l-' + i, fout.solid); bgc('sfe-r-' + i, fout.solid); bgc('sfe-t-' + i, fin.solid); bgc('sfe-b-' + i, fin.solid);
    bg('pan-i-' + i, fin.bg); bg('pan-o-' + i, fout.bg); bg('riegel-i-' + i, fin.bg); bg('riegel-o-' + i, fout.bg);
    /* Bänder mit Abdeckkappen in einem Ton dunkler als der Rahmen; Sichtschutz nur unten im gewählten Ornament */
    const bd = 'linear-gradient(90deg, ' + mischHex(fin.solid, '#000000', 0.2) + ', ' + mischHex(fin.solid, '#ffffff', 0.3) + ' 40%, ' + mischHex(fin.solid, '#000000', 0.08) + ')'; bg('bd-o-' + i, bd); bg('bd-u-' + i, bd);
    bg('su-' + i, stage._orn);
    const sash = q('sash-' + i); if (sash) { sash.classList.toggle('is-fixed', x.t === 'F' || x.t === 'X'); sash.classList.toggle('is-kvd', x.t === 'DK' && dg(w, 'kvd') && w.kvd === 'kvd'); sash.classList.toggle('is-schiebe', x.t === 'S'); sash.setAttribute('data-t', x.t); sash.setAttribute('data-din', x.din); sash.style.setProperty('--sdir', x.din === 'L' ? '1' : '-1'); }
    const sv = q('sym-' + i); if (sv) { const p = symPaths(w, x); if (sv.getAttribute('data-k') !== x.t + x.din + w.richtung) { sv.innerHTML = p; sv.setAttribute('data-k', x.t + x.din + w.richtung); } }
  });
  w.bars.forEach((b) => { const be = q('bar-' + b.id); if (be) { be._bi = barBg(w, fin, 'innen'); be._bo = barBg(w, fout, 'aussen'); be._art = holzig(fin) && w.spross !== 'szr' ? 'holz' : ''; be._arto = holzig(fout) && w.spross !== 'szr' ? 'holz' : ''; be.style.setProperty('--bi', be._bi); be.style.setProperty('--bo', be._bo); } });
  const ms = q('mesh'), mk = q('mesh-k'), ir = insRahmen(w);
  if (ms) { ms._kante = ir; ms.style.boxShadow = 'inset 0 0 0 1.5px ' + ir; bg('mesh', meshBg(w)); }
  if (mk) bg('mesh-k', 'linear-gradient(180deg, ' + mischHex(ir, '#ffffff', 0.22) + ', ' + ir + ' 45%, ' + mischHex(ir, '#000000', 0.25) + ')');
  w3dOberflaeche(stage, w, fin, fout);
}
/* Abstandhalter als Vollfarbe für die Falzfläche (buehne.js) */
const AH_SOL = { schwarz: '#232528', grau: '#6d7378', silber: '#b9bfc5', weiss: '#ecebe6' };
/* Oberflächen für die WebGL-Bühne (buehne.js): Holzdekor mit Maserung, Fensterbänke aus Naturstein, Holz und Aluminium,
   Fassade als Klinker, Holz, Putz oder WDVS. Das CSS-Modell zeigt weiter die Verläufe aus BANK, WOOD und facadeBg. */
const holzig = (c) => !!(c && (c.holz || /Holzdekor/.test(c.code || '')));
/* Sonderoberflächen aus dem Farbblatt (ral.js): Eisenglimmer glänzt metallisch, Struktur ist rau, Eloxal gebürstet, Holzstruktur genarbt */
const SONDER_OBERFL = { db701: 'metall', db702: 'metall', db703: 'metall', sand7016: 'struktur', sand9005: 'struktur', holz7016: 'holz', eloxal: 'eloxal', eloxbronze: 'eloxal' };
const BANK_ART = { stein: 'granit', holz: 'holz', alu: 'alu' };
const FASSADE_ART = { klinker: 'klinker', holz: 'holzfassade', wdvs: 'putzfein' };
function w3dOberflaeche(stage, w, fin, fout) {
  /* _sol: Vollfarbe für die Falzflächen, die buehne.js zwischen Vorder- und Rückseite eines Profils ergänzt */
  /* _oberfl: Sonderoberfläche der Farbe je Seite (buehne.js, vor der Oberfläche aus der Detailangabe) */
  const oi = SONDER_OBERFL[fin.k] || '', oa = SONDER_OBERFL[fout.k] || '';
  /* _artC: Grundton einer Struktur (Klinker, Holzfassade), den die Bühne statt der Mittelfarbe des CSS-Hintergrunds nimmt */
  const setz = (r, k, sol, of, ac) => { const el = stage.querySelector('[data-r="' + r + '"]'); if (el) { el._art = k; if (sol) el._sol = sol; if (of != null) el._oberfl = of; el._artC = ac || ''; } };
  const hi = holzig(fin) ? 'holz' : '', ha = holzig(fout) ? 'holz' : '';
  ['el-front', 'ol-front', 'kf', 'ul-front', 'kfu', 'el-side-t', 'el-side-b'].forEach((r) => setz(r, hi, fin.solid, oi));
  ['el-back', 'ol-back', 'kfb', 'ul-back', 'kfub', 'el-side-l', 'el-side-r', 'ul-pan-b'].forEach((r) => setz(r, ha, fout.solid, oa));
  setz('ul-glass', w.ul && w.ulA === 'paneel' ? hi : '');
  w.sashes.forEach((x, i) => { ['mul-', 'sf-in-', 'sfe-t-', 'sfe-b-', 'pan-i-', 'riegel-i-'].forEach((r) => setz(r + i, hi, fin.solid, oi)); ['mulb-', 'sf-out-', 'sfe-l-', 'sfe-r-', 'pan-o-', 'riegel-o-'].forEach((r) => setz(r + i, ha, fout.solid, oa)); });
  ['t', 'l', 'r'].forEach((k) => { setz('li-' + k, hi, fin.solid, oi); setz('la-' + k, ha, fout.solid, oa); });
  /* Fensterbank innen: die gewählte Farbe bestimmt das Material (Marmor und Granit als Stein, Holzdekor als Holz) */
  const fF = dg(w, 'fbiFarbe') ? w.fbiFarbe : '', bi = fF === 'granit' ? 'granit' : fF === 'holz' ? 'holz' : fF === 'weiss' || fF === 'marmor' ? '' : BANK_ART[w.fbi] || '', ba = w.fba === 'alu' ? 'alu' : '';
  ['sill-t', 'sill-f', 'sill-l', 'sill-r'].forEach((r) => setz(r, bi)); ['sa-t1', 'sa-t2', 'sa-f'].forEach((r) => setz(r, ba)); ['sa-l', 'sa-r'].forEach((r) => setz(r, ba && !(dg(w, 'fbaKappe') && w.fbaKappe !== 'alu') ? 'alu' : ''));
  setz('wall-out', FASSADE_ART[w.fassade] || 'putz', null, null, fassadeArtC(w));
  /* Sonnenschutz: Lamellen des Raffstores, Schienen, Endschiene und Vorbaukasten aus Aluminium (gebürstet im Licht, alub: feine Struktur auf dem
     Verlauf, mehr Glanz); der Rollladenpanzer nur, wenn Aluminium gewählt ist, die Seilführung bleibt Edelstahl */
  if (sonneAktiv(w)) {
    const raff = w.sart === 'raffstore', seil = raff && dg(w, 'fuehrung') && w.fuehrung === 'seil', aluP = w.sart === 'rollladen' && dg(w, 'panzer') && w.panzer === 'alu';
    ['fs-l', 'fs-r', 'fs-l2', 'fs-r2'].forEach((r) => setz(r, seil ? '' : 'alub'));
    ['behang-u', 'behang-ub'].forEach((r) => setz(r, 'alub'));
    setz('behang', aluP ? 'alub' : '');
    if (raff) for (let k = 0; k < LAM_MAX; k++) setz('lam-' + k, 'alub');
    if (w.roll === 'vorbau') ['roll-f', 'roll-sl', 'roll-b', 'roll-t', 'roll-l', 'roll-r'].forEach((r) => setz(r, 'alub'));
  }
  /* Aufsatzkasten: die Blende ist Teil der Fassade (überputzt, Klinker oder Holz), ihr Muster setzt w3dSonne in der Wand fort;
     die Unterseite mit dem Auslaufschlitz ist feiner Putz */
  const aufsatz = sonneAktiv(w) && w.roll === 'aufsatz';
  const aluBl = aufsatz && dg(w, 'blende') && w.blende === 'alu';
  if (!(sonneAktiv(w) && w.roll === 'vorbau')) { setz('roll-f', aufsatz && !aluBl ? FASSADE_ART[w.fassade] || 'putz' : '', null, null, aufsatz && !aluBl ? fassadeArtC(w) : ''); setz('roll-b', aufsatz ? 'putzfein' : ''); } // der Vorbaukasten behält sein Aluminium
}
function w3dUeber(stage, html) {
  let ueber = stage.querySelector('[data-r="ueber"]');
  if (html) { if (!ueber) { stage.insertAdjacentHTML('beforeend', '<div class="w3d-ueber" data-r="ueber"></div>'); ueber = stage.querySelector('[data-r="ueber"]'); } if (ueber._h !== html) { ueber._h = html; ueber.innerHTML = html; } }
  else if (ueber) ueber.remove();
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
  const gr = [stage.clientWidth || 358, stage.clientHeight || 360];
  stage.classList.toggle('is-live', !!o.sway); stage.classList.toggle('show-sym', !!o.symbols); stage.classList.toggle('dims-all', !!(o.cls && o.cls.indexOf('dims-all') >= 0));
  stage.setAttribute('data-view', o.view || 'inside');
  const hint = stage.querySelector('[data-r="hint"]'); if (hint) { hint.textContent = o.hint || ''; hint.hidden = !o.hint; }
  /* Ebene über dem Modell (o.ueber, beim Messen: Hinweis am Rand und Rückfrage); bleibt erhalten, wenn die Bühne wiederverwendet wird */
  w3dUeber(stage, o.ueber);
  if (!o.feld) { const fl = stage.querySelector('.w3d-feldlage'); if (fl) fl.remove(); }
  let lupe = stage.querySelector('[data-r="lupe"]');
  if (o.lupe) { const key = glasLupeKey(w); if (!lupe) { stage.insertAdjacentHTML('beforeend', '<div class="w3d-lupe" data-r="lupe"></div>'); lupe = stage.querySelector('[data-r="lupe"]'); } if (lupe.getAttribute('data-k') !== key) { lupe.innerHTML = glasLupe(w); lupe.setAttribute('data-k', key); if (window.Feier) window.Feier.einrasten(lupe); } }
  else if (lupe) lupe.remove();
  stage.querySelectorAll('.w3d-sash').forEach((sa) => { sa.classList.toggle('is-sel', !!o.selectable && +sa.getAttribute('data-sash') === o.selSash); });
  stage.querySelectorAll('.w3d-bar').forEach((b) => { b.classList.toggle('is-edit', !!o.editBars); b.classList.toggle('is-sel', !!o.editBars && b.getAttribute('data-bar') === o.selBar); });
  ensureDims(stage, o); w3dPaint(stage, w);
  /* Zoom: neuer Bildschirm bzw. neue Frage setzt auf 1:1 zurück (bei Griff und Einbruchschutz fährt die Kamera danach hin) */
  const zm = w3dZoomZustand(stage), zkey = o.zkey == null ? '' : o.zkey; let fokus = false, weich = false;
  if (zm.key !== zkey) {
    /* Von einer Griff-Frage zur nächsten (Griff, Griff-Farbe, Einbruchschutz) bleibt die Kamera am Griff und fährt nur weich nach,
       statt erst auf 1:1 hinaus und dann wieder heran */
    if (o.fokus && zm.fokus && zm.z > 1.001) weich = true;
    else { if (zm.z > 1.001 && !stage.classList.contains('no-anim')) w3dZoomAnim(stage, true); zm.z = 1; zm.x = 0; zm.y = 0; }
    zm.key = zkey; zm.fokus = o.fokus || ''; fokus = !!o.fokus;
  }
  if (o.rails || o.noZoom) { zm.z = 1; zm.x = 0; zm.y = 0; }
  const V = w3dLayout(stage, w, o, gr); layoutRails(stage, w, o, gr); stage._s = V ? V.s : 0.15;
  w3dZoomKnoepfe(stage, o); w3dHausKnopf(stage, o); w3dSonneKnoepfe(stage, w, o); w3dZoomZeigen(stage);
  if (fokus) { clearTimeout(stage._fk); stage._fk = setTimeout(() => { const r = W3DS[stage.id]; if (r && r.o.zkey === zkey) w3dFokus(stage, r.w, r.o, weich); }, ruhig() ? 0 : weich ? 80 : 420); }
  /* Solange sich die Geometrie verwandelt, steht das sanfte Schwingen still: eine Bewegung zur Zeit */
  const geo = V ? [V.moW, V.moH, V.elW, V.elH, V.olH, V.ulH, V.n, w.form, w.art].join('|') : '';
  if (stage._geo && stage._geo !== geo) { stage.classList.add('is-busy'); clearTimeout(stage._busy); stage._busy = setTimeout(() => stage.classList.remove('is-busy'), 820); }
  stage._geo = geo;
  const openIdx = o.openSash != null && o.openSash >= 0 ? o.openSash : -1, base = VIEWS[o.view || 'inside'];
  w3dView(stage, openIdx >= 0 && w.sashes[openIdx] ? openView(w.sashes[openIdx], base) : base);
}
/* Geometrie in die Flächen schreiben. dimVals: Beschriftungen je Maßlinie.
   Zwei Bauarten: 'e' (Rechteck: vier Laibungsflächen, rechteckige Löcher) und 'g' (Formen: Laibung aus Streifen entlang des Umrisses,
   Löcher und Flügel als Polygone mit fester Punktzahl, damit der Wechsel der Form morpht). */
function w3dLayout(stage, w, o, gr) {
  if (!stage) return null;
  o = o || {};
  const V = w3dCalc(w, Object.assign({}, o, { stageW: gr ? gr[0] : stage.clientWidth || 358, stageH: gr ? gr[1] : stage.clientHeight || 360, zoom: w3dZ(stage, o) })), s = V.s;
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), G = stage.getAttribute('data-struct') === 'g', form = G ? (w.form || 'rechteck') : 'rechteck';
  if (V.dimX) stage.style.setProperty('--dimx', px(V.dimX)); else stage.style.removeProperty('--dimx');
  if (V.dimY) stage.style.setProperty('--dimy', px(V.dimY)); else stage.style.removeProperty('--dimy');
  stage.classList.toggle('is-niedrig', (gr ? gr[1] : stage.clientHeight || 360) < 200); // niedrige Bühne: Knöpfe am Modell in einer Reihe (app.css)
  const moW = V.moW * s, moH = V.moH * s, T = V.T * s, d = V.laib * s, fd = V.fd * s, sd = W3D.FD * s, wallW = V.wallW * s, wallH = V.wallH * s, tuer = V.tuer;
  /* Größe der Öffnung für das Tageslicht dahinter (app.css, .raum-licht: durch die Öffnung sieht man hell nach draußen) */
  stage.style.setProperty('--lw', px(moW)); stage.style.setProperty('--lh', px(moH));
  const gO = G ? formGeo(form, -moW / 2, -moH / 2, moW, moH) : null;
  /* ohne Übergang: erster Aufbau, weniger Bewegung und Zoomen mit zwei Fingern oder dem Rad (is-zooming), sonst liefe das Modell nach */
  W3D_SOFORT = stage.classList.contains('no-anim') || stage.classList.contains('is-zooming') || ruhig();
  const wandLoch = (spiegel) => G ? umriss('polygon(evenodd, 0 0, ' + px(wallW) + ' 0, ' + px(wallW) + ' ' + px(wallH) + ', 0 ' + px(wallH) + ', 0 0, ' + polyPts(gO.pts.concat([gO.pts[0]]), -wallW / 2, -wallH / 2, spiegel ? wallW : null) + ')', { t: 'wand', p: polyLok(gO.pts, -wallW / 2, -wallH / 2, spiegel ? wallW : null) })
    : hole(wallW, wallH, (wallW - moW) / 2, (wallH - moH) / 2, (wallW + moW) / 2, (wallH + moH) / 2);
  face(q('wall-in'), wallW, wallH, -wallW / 2, -wallH / 2, 0, '', '0 0', wandLoch(false));
  face(q('wall-out'), wallW, wallH, -wallW / 2, -wallH / 2, -T, 'rotateY(180deg)', '50% 50%', wandLoch(true));
  const bankZone = 'linear-gradient(180deg, transparent 0 ' + px(d) + ', #9a9fa4 ' + px(d) + ' ' + px(d + fd) + ', transparent ' + px(d + fd) + ')';
  if (G) {
    /* Laibung als Streifen: je Umrisskante eine Fläche, die in die Wand hineinreicht; Farbe nach Blickrichtung, unten die Bank */
    const P = gO.pts, n = P.length;
    let vor = null;
    for (let k = 0; k < n; k++) {
      const a = P[k], b = P[(k + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), el = q('rs-' + k);
      let ang = len > 0.01 ? Math.atan2(dy, dx) * 180 / Math.PI : (vor == null ? 0 : vor);
      if (vor != null) { while (ang - vor > 180) ang -= 360; while (ang - vor < -180) ang += 360; }
      vor = ang;
      if (!el) continue;
      if (el._ang != null) { while (ang - el._ang > 180) ang -= 360; while (ang - el._ang < -180) ang += 360; }
      el._ang = ang;
      face(el, len > 0.01 ? len + 0.8 : 0, T, a[0], a[1], 0, 'rotateZ(' + n1(ang) + 'deg) rotateX(-90deg)', '0 0');
      const unten = !gO.rund && k > FORM_O && k < n - 1;
      el._bgc = unten ? 'transparent' : revFarbe(Math.atan2(dx, -dy) * 180 / Math.PI); el._bgi = unten ? bankZone : '';
      el.style.backgroundColor = el._bgc; el.style.backgroundImage = el._bgi;
    }
  } else {
    face(q('rev-t'), moW, T, -moW / 2, -moH / 2, 0, 'rotateX(-90deg)', '0 0');
    const rb = q('rev-b'); face(rb, moW, T, -moW / 2, moH / 2, 0, 'rotateX(-90deg)', '0 0');
    if (rb) { rb._bg = tuer ? '#d6d0c6' : bankZone; rb.style.background = rb._bg; }
    face(q('rev-l'), T, moH, -moW / 2, -moH / 2, 0, 'rotateY(90deg)', '0 0');
    face(q('rev-r'), T, moH, moW / 2, -moH / 2, 0, 'rotateY(90deg)', '0 0');
  }
  /* Fensterbank innen: vom Rahmen bis 45 mm vor die Wand, 40 mm seitlich über, 26 mm dick.
     Außen: in der Öffnung waagerecht bis zur Fassade, davor 50 mm Überstand mit 7° Gefälle und Tropfkante. Runde Fenster haben keine. */
  const yB = moH / 2, ohneBank = (G && form === 'rund') || tuer;
  /* Boden: innen Parkett bis vor die Kamera, außen Terrasse; nur bei Türen */
  if (tuer) { face(q('floor-in'), wallW, 2400 * s, -wallW / 2, yB, 0, 'rotateX(90deg)', '0 0'); face(q('floor-out'), wallW, 2400 * s, -wallW / 2, yB, -T, 'rotateX(-90deg)', '0 0'); }
  const OV = 45 * s, SX = 40 * s, TH = 26 * s, bwI = moW + 2 * SX, bxI = -moW / 2 - SX;
  face(q('sill-t'), bwI, OV + d, bxI, yB, OV, 'rotateX(-90deg)', '0 0');
  face(q('sill-f'), bwI, TH, bxI, yB, OV, '', '0 0');
  face(q('sill-l'), OV, TH, bxI, yB, OV, 'rotateY(90deg)', '0 0'); face(q('sill-r'), OV, TH, bxI + bwI, yB, OV, 'rotateY(90deg)', '0 0');
  /* Überstand vor der Fassade: gewählt, aus der Ausladung (abzüglich der Außenlaibung) oder 50 mm */
  const ueber = dg(w, 'fbaUeber') ? num(w.fbaUeber) : dg(w, 'fbaTiefe') ? clamp(num(w.fbaTiefe) - W3D.OUTD, 15, 200) : 50;
  const OVA = ueber * s, SXA = 30 * s, LIP = (w.fba === 'alu' ? 40 : 30) * s, NG = 7 * Math.PI / 180, bwA = moW + 2 * SXA, bxA = -moW / 2 - SXA;
  face(q('sa-t1'), moW, Math.max(0, T - d - fd), -moW / 2, yB, -d - fd, 'rotateX(-90deg)', '0 0');
  face(q('sa-t2'), bwA, OVA / Math.cos(NG), bxA, yB, -T, 'rotateX(' + n1(-90 + 7) + 'deg)', '0 0');
  face(q('sa-f'), bwA, LIP, bxA, yB + OVA * Math.tan(NG), -T - OVA, 'rotateY(180deg)', '50% 50%');
  face(q('sa-l'), OVA, LIP + OVA * Math.tan(NG), bxA, yB, -T, 'rotateY(90deg)', '0 0'); face(q('sa-r'), OVA, LIP + OVA * Math.tan(NG), bxA + bwA, yB, -T, 'rotateY(90deg)', '0 0');
  ['sill-t', 'sill-f', 'sill-l', 'sill-r', 'sa-t1', 'sa-t2', 'sa-f', 'sa-l', 'sa-r'].forEach((r) => { const e = q(r); if (e) e.style.opacity = ohneBank ? '0' : ''; });
  /* Abdeckleisten: 22 mm auf der Laibung am Rahmen, innen (zum Raum hin) und außen (zur Fassade hin) */
  const LW = Math.max(2, 22 * s);
  face(q('li-t'), moW, LW, -moW / 2, -moH / 2 + 0.8, -d + LW, 'rotateX(-90deg)', '0 0'); face(q('li-l'), LW, moH, -moW / 2 + 0.8, -moH / 2, -d + LW, 'rotateY(90deg)', '0 0'); face(q('li-r'), LW, moH, moW / 2 - 0.8, -moH / 2, -d + LW, 'rotateY(90deg)', '0 0');
  face(q('la-t'), moW, LW, -moW / 2, -moH / 2 + 0.8, -d - fd, 'rotateX(-90deg)', '0 0'); face(q('la-l'), LW, moH, -moW / 2 + 0.8, -moH / 2, -d - fd, 'rotateY(90deg)', '0 0'); face(q('la-r'), LW, moH, moW / 2 - 0.8, -moH / 2, -d - fd, 'rotateY(90deg)', '0 0');
  const el = q('el'); if (el) el.classList.toggle('is-hidden', !V.showEl);
  const elW = V.elW * s, elH = V.elH * s, x0 = V.x0 * s, y0 = V.y0 * s, pf = V.pf * s, pfB = V.pfB * s, sf = V.sf * s, mul = V.mul * s, z0 = -d;
  const iw = V.innerW * s, ih = V.innerH * s, ix = x0 + pf, iy = y0 + pf;
  const gE = G ? formGeo(form, x0, y0, elW, elH) : null, gI = G ? formGeo(form, ix, iy, iw, ih) : null;
  face(q('el-front'), elW, elH, x0, y0, z0, '', '0 0', G ? ringClip(gE.pts, gI.pts, x0, y0, elW, elH) : hole(elW, elH, pf, pf, elW - pf, elH - pfB));
  face(q('el-back'), elW, elH, x0, y0, z0 - fd, 'rotateY(180deg)', '50% 50%', G ? ringClip(gE.pts, gI.pts, x0, y0, elW, elH, elW) : hole(elW, elH, pf, pf, elW - pf, elH - pfB));
  if (tuer) { face(q('schw'), elW, pfB, x0, y0 + elH - pfB, z0 + 0.6, '', '0 0'); face(q('schw-t'), elW, fd, x0, y0 + elH - pfB, z0, 'rotateX(-90deg)', '0 0'); }
  face(q('fuge'), moW, moH, -moW / 2, -moH / 2, z0 - 1, '', '0 0', G ? ringClip(gO.pts, gE.pts, -moW / 2, -moH / 2, moW, moH) : hole(moW, moH, x0 + moW / 2, y0 + moH / 2, x0 + elW + moW / 2, y0 + elH + moH / 2));
  if (!G) {
    face(q('el-side-l'), fd, elH, x0, y0, z0, 'rotateY(90deg)', '0 0');
    face(q('el-side-r'), fd, elH, x0 + elW, y0, z0, 'rotateY(90deg)', '0 0');
    face(q('el-side-t'), elW, fd, x0, y0, z0, 'rotateX(-90deg)', '0 0');
    face(q('el-side-b'), elW, fd, x0, y0 + elH, z0, 'rotateX(-90deg)', '0 0');
  }
  const olH = V.olH * s, km = V.km * s, sashTop = iy + (olH ? olH + km : 0), sashH = V.sashH * s, sashW = V.sashW * s;
  /* Körper (buehne.js): _tief ist die Tiefe bis zur Fläche, auf der sie sitzen */
  const oe = q('oeff'); if (oe) { const ks = w.sashes.findIndex((x) => x.t === 'K' || x.t === 'DK'), cx = (w.ol && w.olT === 'K') || ks < 0 ? ix + iw / 2 : ix + (V.sx[ks] + V.sw[ks] / 2) * s, bw2 = Math.min(iw * 0.8, 300 * s); oe._tief = Math.max(3, 46 * s); face(oe, bw2, pf * 0.62, cx - bw2 / 2, y0 + pf * 0.19, z0 + oe._tief, '', '0 0'); }
  const lf = q('luef'); if (lf) { const bw3 = iw * 0.62; lf._tief = Math.max(2, 20 * s); face(lf, bw3, pf * 0.46, ix + iw / 2 - bw3 / 2, y0 + pf * 0.27, z0 + lf._tief, '', '0 0'); }
  if (olH) {
    const osf = w.olT === 'K' ? sf : 3;
    if (G) {
      const gIo = formGeo(form, ix + osf, iy + osf, iw - 2 * osf, ih - 2 * osf), aus = formSchnitt(gI, ix, iy, iw, olH, 24), inn = formSchnitt(gIo, ix + osf, iy + osf, iw - 2 * osf, olH - 2 * osf, 24);
      face(q('ol-front'), iw, olH, ix, iy, z0, '', '0 0', ringClip(aus, inn, ix, iy, iw, olH));
      face(q('ol-back'), iw, olH, ix, iy, z0 - fd, 'rotateY(180deg)', '50% 50%', ringClip(aus, inn, ix, iy, iw, olH, iw));
      face(q('ol-glass'), iw - 2 * osf, olH - 2 * osf, ix + osf, iy + osf, z0 - fd / 2, '', '0 0', polyClip(inn, ix + osf, iy + osf, iw - 2 * osf, olH - 2 * osf));
    } else {
      face(q('ol-front'), iw, olH, ix, iy, z0, '', '0 0', hole(iw, olH, osf, osf, iw - osf, olH - osf));
      face(q('ol-back'), iw, olH, ix, iy, z0 - fd, 'rotateY(180deg)', '50% 50%', hole(iw, olH, osf, osf, iw - osf, olH - osf));
      face(q('ol-glass'), iw - 2 * osf, olH - 2 * osf, ix + osf, iy + osf, z0 - fd / 2, '', '0 0');
    }
    /* Kämpfer: der Riegel zwischen Oberlicht und Flügeln (fehlte bisher, man sah durch einen Spalt) */
    const kc = G ? formSchnitt(gI, ix, iy + olH, iw, km, 12) : null;
    face(q('kf'), iw, km, ix, iy + olH, z0, '', '0 0', kc ? polyClip(kc, ix, iy + olH, iw, km) : null);
    face(q('kfb'), iw, km, ix, iy + olH, z0 - fd, 'rotateY(180deg)', '50% 50%', kc ? polyClip(kc, ix, iy + olH, iw, km, iw) : null);
    const olr = q('olr'), olh = q('olh'), kipp = w.olT === 'K', rb = Math.max(1.5, 12 * s), lw = Math.max(3, 22 * s), lh = Math.max(10, 110 * s), xr = x0 + elW - pf / 2, y1 = iy + olH * 0.5, y2 = sashTop + V.sashH * s * 0.45;
    face(olr, rb, Math.max(0, y2 - y1), xr - rb / 2, y1, z0 + 2, '', '0 0'); face(olh, lw, lh, xr - lw / 2, y2 - lw / 2, z0 + 4, '', '0 0');
    if (olr) olr.style.opacity = kipp ? '' : '0'; if (olh) olh.style.opacity = kipp ? '' : '0';
  }
  /* Unterlicht unter den Flügeln: Kämpfer, dann das feste Feld mit Glasleiste oder als Paneel */
  const ulH = V.ulH * s;
  if (ulH) {
    const kmul = W3D.MUL * s, ulTop = sashTop + sashH + kmul, ub = 3;
    face(q('kfu'), iw, kmul, ix, sashTop + sashH, z0, '', '0 0');
    face(q('kfub'), iw, kmul, ix, sashTop + sashH, z0 - fd, 'rotateY(180deg)', '50% 50%');
    face(q('ul-front'), iw, ulH, ix, ulTop, z0, '', '0 0', hole(iw, ulH, ub, ub, iw - ub, ulH - ub));
    face(q('ul-back'), iw, ulH, ix, ulTop, z0 - fd, 'rotateY(180deg)', '50% 50%', hole(iw, ulH, ub, ub, iw - ub, ulH - ub));
    const paneel = w.ulA === 'paneel';
    face(q('ul-glass'), iw - 2 * ub, ulH - 2 * ub, ix + ub, ulTop + ub, paneel ? z0 - 2 : z0 - fd / 2, '', '0 0');
    face(q('ul-pan-b'), iw - 2 * ub, ulH - 2 * ub, ix + ub, ulTop + ub, z0 - fd + 2, 'rotateY(180deg)', '50% 50%');
  }
  for (let i = 0; i < V.n - 1; i++) {
    const mx = ix + (V.sx[i] + V.sw[i]) * s, c = G ? formSchnitt(gI, mx, sashTop, mul, sashH, 3) : null;
    face(q('mul-' + i), mul, sashH, mx, sashTop, z0, '', '0 0', c ? polyClip(c, mx, sashTop, mul, sashH) : null);
    face(q('mulb-' + i), mul, sashH, mx, sashTop, z0 - fd, 'rotateY(180deg)', '50% 50%', c ? polyClip(c, mx, sashTop, mul, sashH, mul) : null);
  }
  const griffe = [];
  w.sashes.forEach((x, i) => {
    /* Hebe-Schiebe-Tür: das Festteil sitzt in der äußeren Laufebene mit eigenem Profil, der Schiebeflügel innen davor */
    const sashW = V.sw[i] * s, sash = q('sash-' + i), fixed = x.t === 'F', hstFest = fixed && V.art === 'hst', ssf = hstFest ? sf * 0.75 : fixed ? 3 : sf, left = ix + V.sx[i] * s, zS = hstFest ? -(fd - sd) : 0;
    if (!sash) return;
    sash.style.width = px(sashW); sash.style.height = px(sashH);
    sash.style.transformOrigin = x.t === 'K' ? '50% 100%' : (x.din === 'L' ? '0 50%' : '100% 50%');
    /* Lage über translate, Drehung über transform: so kann die Vorführung (oeffnungZeigen) frei um das Band drehen */
    sash.style.setProperty('--hinge', x.din === 'L' ? '0 50%' : '100% 50%'); sash.style.setProperty('--sgn', x.din === 'L' ? '-1' : '1'); sash.style.setProperty('--hsgn', x.din === 'L' ? '1' : '-1');
    sash.style.translate = px(left) + ' ' + px(sashTop) + ' ' + px(z0 + zS);
    sash.style.transform = 'none';
    w3dWerte(sash, '_s', { w: sashW, h: sashH, tx: left, ty: sashTop, tz: z0 + zS, ox: x.t === 'K' ? sashW / 2 : x.din === 'L' ? 0 : sashW, oy: x.t === 'K' ? sashH : sashH / 2 });
    let aus = null, inn = null;
    if (G) {
      const gS = formGeo(form, ix + ssf, iy + ssf, iw - 2 * ssf, ih - 2 * ssf);
      aus = formSchnitt(gI, left, sashTop, sashW, sashH, 16); inn = formSchnitt(gS, left + ssf, sashTop + ssf, sashW - 2 * ssf, sashH - 2 * ssf, 16);
    }
    face(q('sf-in-' + i), sashW, sashH, 0, 0, 0, '', '0 0', G ? ringClip(aus, inn, left, sashTop, sashW, sashH) : hole(sashW, sashH, ssf, ssf, sashW - ssf, sashH - ssf));
    face(q('sf-out-' + i), sashW, sashH, 0, 0, -sd, 'rotateY(180deg)', '50% 50%', G ? ringClip(aus, inn, left, sashTop, sashW, sashH, sashW) : hole(sashW, sashH, ssf, ssf, sashW - ssf, sashH - ssf));
    /* Verglasung: 2 oder 3 Scheiben, gleichmäßig in der Profiltiefe; die erste trägt Sprossen und Symbole */
    const drei = w.glas !== '2', gc = G ? polyClip(inn, left + ssf, sashTop + ssf, sashW - 2 * ssf, sashH - 2 * ssf) : null, gw = sashW - 2 * ssf, gh = sashH - 2 * ssf;
    face(q('glass-' + i), gw, gh, ssf, ssf, -sd * (drei ? 0.3 : 0.38), '', '0 0', gc);
    face(q('pane-a-' + i), gw, gh, ssf, ssf, -sd * (drei ? 0.5 : 0.62), '', '0 0', gc);
    face(q('pane-b-' + i), gw, gh, ssf, ssf, -sd * 0.7, '', '0 0', gc);
    const pb = q('pane-b-' + i); if (pb) pb.style.opacity = drei ? '' : '0';
    const pIn = q('pan-i-' + i);
    if (pIn) {
      const ph = Math.min(gh * 0.6, (num(w.paneelH) || 400) * s), py = ssf + gh - ph, rh = Math.max(3, sf * 0.8);
      face(pIn, gw, ph, ssf, py, -sd * (drei ? 0.3 : 0.38) + 0.6, '', '0 0'); face(q('pan-o-' + i), gw, ph, ssf, py, -sd * (drei ? 0.7 : 0.62) - 0.6, 'rotateY(180deg)', '50% 50%');
      face(q('riegel-i-' + i), gw, rh, ssf, py - rh / 2, 0, '', '0 0'); face(q('riegel-o-' + i), gw, rh, ssf, py - rh / 2, -sd, 'rotateY(180deg)', '50% 50%');
    }
    const su = q('su-' + i); if (su) face(su, gw, gh * 0.55, ssf, ssf + gh * 0.45, -sd * (drei ? 0.3 : 0.38) + 0.3, '', '0 0');
    const bo = q('bd-o-' + i), bu = q('bd-u-' + i);
    if (bo && bu) { const bwd = Math.max(3, 15 * s), bhd = Math.max(8, 95 * s), bxd = x.din === 'L' ? -bwd * 0.35 : sashW - bwd * 0.65, bz = Math.max(2.5, 9 * s), rnd = Math.max(2, sashH * 0.05); bo._tief = bu._tief = bz; face(bo, bwd, bhd, bxd, rnd, bz, '', '0 0'); face(bu, bwd, bhd, bxd, sashH - bhd - rnd, bz, '', '0 0'); }
    /* Einbruchschutz: Pilzköpfe auf dem Flügelrahmen (sonst unsichtbar im Falz, hier gezeigt). RC1 N an den Seiten, RC2 rundum */
    const pz = fixed || x.t === 'X' ? 0 : AW.rcAb(w, 'rc2n') ? 8 : w.rc === 'rc1' ? 4 : 0, dm = Math.max(6, 34 * s), c = sf / 2;
    const yob = (xx) => (G ? Math.max(0, gI.top(left + xx) - sashTop) : 0) + c, yun = (xx) => (G ? Math.min(sashH, gI.bot(left + xx) - sashTop) : sashH) - c;
    const PZ = [[c, 0.24], [c, 0.76], [sashW - c, 0.24], [sashW - c, 0.76], [sashW * 0.3, 'o'], [sashW * 0.7, 'o'], [sashW * 0.3, 'u'], [sashW * 0.7, 'u']];
    PZ.forEach((pp, k) => {
      const e = q('pz-' + i + '-' + k); if (!e) return;
      const yy = pp[1] === 'o' ? yob(pp[0]) : pp[1] === 'u' ? yun(pp[0]) : yob(pp[0]) + (yun(pp[0]) - yob(pp[0])) * pp[1];
      face(e, dm, dm, pp[0] - dm / 2, yy - dm / 2, 3, '', '50% 50%');
      e.classList.toggle('is-on', k < pz);
    });
    /* Kanten: gerade Kanten bleiben Flächen, eine gebogene Oberkante zeigt keine Kantenfläche */
    let ytL = 0, ybL = sashH, ytR = 0, ybR = sashH, obenGerade = true, untenGerade = true;
    if (G) {
      ytL = Math.max(0, gI.top(left) - sashTop); ybL = Math.min(sashH, gI.bot(left) - sashTop); ytR = Math.max(0, gI.top(left + sashW) - sashTop); ybR = Math.min(sashH, gI.bot(left + sashW) - sashTop);
      obenGerade = aus.slice(0, 16).every((p) => p[1] - sashTop < 0.5); untenGerade = aus.slice(16).every((p) => sashTop + sashH - p[1] < 0.5);
    }
    face(q('sfe-l-' + i), sd, Math.max(0, ybL - ytL), 0, ytL, 0, 'rotateY(90deg)', '0 0'); face(q('sfe-r-' + i), sd, Math.max(0, ybR - ytR), sashW, ytR, 0, 'rotateY(90deg)', '0 0');
    face(q('sfe-t-' + i), sashW, sd, 0, 0, 0, 'rotateX(-90deg)', '0 0'); face(q('sfe-b-' + i), sashW, sd, 0, sashH, 0, 'rotateX(-90deg)', '0 0');
    const et = q('sfe-t-' + i), eb = q('sfe-b-' + i); if (et) et.style.opacity = obenGerade ? '' : '0'; if (eb) eb.style.opacity = untenGerade ? '' : '0';
    const ring = q('ring-' + i);
    face(ring, sashW, sashH, 0, 0, 1, '', '0 0');
    if (ring) {
      if (G) { ring.classList.add('is-form'); ring.innerHTML = '<svg viewBox="0 0 ' + n1(sashW) + ' ' + n1(sashH) + '" preserveAspectRatio="none" aria-hidden="true"><polygon points="' + aus.map((p) => n1(p[0] - left) + ',' + n1(p[1] - sashTop)).join(' ') + '"></polygon></svg>'; }
      else if (ring.classList.contains('is-form')) { ring.classList.remove('is-form'); ring.innerHTML = ''; }
    }
    /* Griff: Rosette fest auf dem Flügelprofil, der Hebel dreht um die Achse in ihrer Mitte (so dreht er in der Vorführung sichtbar).
       Seitlich auf der Mitte des Flügelprofils gegenüber den Bändern. Höhe (w3dGriffAchse): am Fenster mittig im geraden Teil des
       Profils, an Türen und bodentiefen Fenstern etwa 1.050 mm über dem Fußboden; das Getriebe (etwa ± 250 mm um die Achse) liegt
       immer im geraden Profil, nie im Bogen oder in der Schräge. Stulp: nur der Gehflügel hat einen Griff. */
    const hd = q('handle-' + i), ro = q('hros-' + i), gl = w3dGriffLage(V, w, x, i, s, { G: G, gI: gI, left: left, sashTop: sashTop, sashW: sashW, sashH: sashH, sf: sf });
    if (sash) { sash.classList.toggle('is-steh', gl.steh && !gl.sichtbar); sash.classList.toggle('mit-griff', gl.bedien); }
    if (hd) {
      hd.style.width = px(gl.lw); hd.style.height = px(gl.lh); hd.style.transformOrigin = gl.origin; hd.style.setProperty('--hw', px(Math.min(gl.lw, gl.lh)));
      hd.style.translate = px(gl.lx) + ' ' + px(gl.ly) + ' 6px';
      /* WebGL-Bühne: Maße und Drehpunkt des Hebels; ein Griff, den es nicht gibt (Standflügel, festes Feld, ohne Griff), fällt weg */
      w3dWerte(hd, '_h', { w: gl.lw, h: gl.lh, tx: gl.lx, ty: gl.ly, tz: 6, ox: gl.ox, oy: gl.oy });
      hd._aus = !gl.sichtbar;
      hd.style.transform = 'none';
    }
    face(ro, gl.rw, gl.rh, gl.ax - gl.rw / 2, gl.ay - gl.rh / 2, 3.5, '', '50% 50%');
    if (ro) { ro._rund = Math.min(gl.rw, gl.rh) * 0.3; ro.style.borderRadius = px(ro._rund); ro.style.opacity = gl.sichtbar ? '' : '0'; } // Deckkraft und Rundung inline: die WebGL-Bühne liest keine Klassen
    /* Druckknopf an der Hebelwurzel, Schließzylinder in der Nabe (an der Achse ox, oy, auch beim Kipp- und Hebegriff) */
    const hk = q('hk-' + i), hs = q('hs-' + i);
    if (hk && hs) {
      const hw = Math.min(gl.lw, gl.lh), dir = gl.lw > gl.lh ? [1, 0] : gl.oy > gl.lh / 2 ? [0, -1] : [0, 1], dk = hw * 0.56, ak = hw * 0.65 + dk / 2, ds = hw * 1.2;
      face(hk, dk, dk, gl.ox + dir[0] * ak - dk / 2, gl.oy + dir[1] * ak - dk / 2, 0, '', '50% 50%'); hk._rund = dk / 2;
      face(hs, ds, ds, gl.ox - ds / 2, gl.oy - ds / 2, 0, '', '50% 50%'); hs._rund = ds / 2;
      hk.style.opacity = stage.classList.contains('mit-knopf') ? '' : '0'; hs.style.opacity = stage.classList.contains('mit-schloss') ? '' : '0';
    }
    griffe[i] = gl.sichtbar ? [left + gl.ax, sashTop + gl.ay, z0 + 6] : null;
    /* Griff außen: Balkontür nach Wahl (Ziehgriff mit Schnäpper oder abschließbar), bei Hebe-Schiebe-, PSK- und Faltschiebetür nur
       abschließbar (Schließzylinder auf der Außenseite des bedienten Flügels); auf derselben Höhe wie der Griff innen */
    const ga = q('ga-' + i);
    if (ga) {
      const cfg = w.bt || {}, balkon = w.art === 'balkon', zg = balkon && cfg.griffA === 'ziehgriff';
      /* Hebe-Schiebe-Tür mit Griffmuschel außen (Detailangabe hstPlus): flache Mulde am Schiebeflügel, auch ohne Griff innen */
      const muschel = w.art === 'hst' && x.t === 'S' && dg(w, 'hstPlus') && [].concat(w.hstPlus).indexOf('muschel') >= 0 && w.griff !== 'abschliessbar';
      const an = muschel || (gl.sichtbar && (balkon ? i === gehFluegel(w) && !!cfg.griffA && cfg.griffA !== 'keiner' : w.griff === 'abschliessbar' && (x.t === 'S' || x.t === 'PS' || x.t === 'P' || gl.bedien)));
      const gw2 = Math.max(4, (zg ? 26 : muschel ? 44 : 34) * s), gh2 = Math.max(12, (zg ? 300 : muschel ? 180 : 150) * s), ym2 = clamp(gl.ay - gh2 / 2, 0, Math.max(0, sashH - gh2));
      ga.style.width = px(gw2); ga.style.height = px(gh2); ga.style.transform = 'translate3d(' + px(gl.ax - gw2 / 2) + ', ' + px(ym2) + ', ' + px(-sd - 5) + ')'; ga.style.opacity = an ? '1' : '0';
      ga.classList.toggle('is-schloss', !zg && !muschel); ga.classList.toggle('is-muschel', muschel);
      w3dWerte(ga, '_g', { w: gw2, h: gh2, tx: gl.ax - gw2 / 2, ty: ym2, tz: -sd - 5, op: an ? 1 : 0 });
      /* Schließzylinder außen: eigene Fläche oben im Griff */
      const gas = q('gas-' + i); if (gas) { const dz2 = gw2 * 0.64; face(gas, dz2, dz2, gw2 / 2 - dz2 / 2, gh2 * 0.14, 0, '', '50% 50%'); gas._rund = dz2 / 2; gas.style.opacity = !zg && !muschel ? '' : '0'; }
    }
    w.bars.filter((b) => b.s === i).forEach((b) => { w3dBarPos(q('bar-' + b.id), b, Math.max(2, w.breite * s)); });
  });
  stage._griffe = griffe;
  if (q('mesh')) face(q('mesh'), iw, ih, ix, iy, z0 - fd - 6 * s, '', '0 0', G ? polyClip(gI.pts, ix, iy, iw, ih) : null);
  stage._sonne = { w: w, o: o, V: V, s: s }; // für die Fahrt (w3dSonneNeu): nur Sonnenschutz und Sichtschutz je Bild neu legen
  const sonneL = w3dSonne(stage, w, o, V, s, q); w3dAntrieb(w, V, s, q);
  const kll = q('kl-l'), klr = q('kl-r');
  const malB = (el, v) => { if (el && el._bg !== v) { el._bg = v; el.style.background = v; } };
  if (kll && klr) { const kw = moW / 2 + 6 * s, kh = moH + 10 * s, kz = -T - Math.max(1, 4 * s), ky = -moH / 2 - 5 * s; face(kll, kw, kh, -moW / 2 - 8 * s - kw, ky, kz, 'rotateY(180deg)', '50% 50%'); face(klr, kw, kh, moW / 2 + 8 * s, ky, kz, 'rotateY(180deg)', '50% 50%'); malB(kll, klBg(w, s)); malB(klr, klBg(w, s)); }
  /* Geländer: Oberkante 950 mm über dem Boden (bei einer Brüstung entsprechend tiefer), vor der Fassade; Glasbrüstung in der Außenlaibung */
  const gl2 = q('gel'), glh = q('gel-h');
  if (gl2 && glh) {
    /* vor dem Sonnenschutz: Glasbrüstung in der Laibung 6 mm vor dessen äußerer Ebene (Aufsatz, Unterputz), Geländer vor der Fassade
       12 mm vor einem Vorbau */
    const glas = w.absturz === 'glas', hR = clamp(950 - (tuer ? 0 : num(w.bru) || 0), 320, 950) * s, gw3 = glas ? moW - 4 * s : moW + 80 * s, hh = Math.max(3, 42 * s);
    const gz = glas ? Math.max(-T + 2 * s, Math.min(-d - fd - 26 * s, sonneL && sonneL.laib ? sonneL.aussen - 6 * s : 0)) : Math.min(-T - 50 * s, sonneL && !sonneL.laib ? sonneL.aussen - 12 * s : 0);
    face(gl2, gw3, hR - hh, -gw3 / 2, yB - hR + hh, gz, 'rotateY(180deg)', '50% 50%'); face(glh, gw3, hh, -gw3 / 2, yB - hR, gz - 0.6, 'rotateY(180deg)', '50% 50%');
    gl2.classList.toggle('w3d-gel-glas', glas || (dg(w, 'gelForm') && w.gelForm === 'glas')); malB(gl2, gelBg(w, s)); malB(glh, gelFarbe(w));
  }
  /* Fenstergitter in der Außenlaibung (Laibungsmontage): über der Fensterbank, hinter einem Vorbau-Behang; läuft der Sonnenschutz in der
     Laibung (Aufsatz, Unterputz), liegt das Gitter davor, außerhalb der gedrehten Lamellen */
  const gi = q('gitter'); if (gi) { const zg = Math.max(-T + 1, Math.min(-T + Math.max(1, Math.min(30 * s, (T - d - fd) * 0.5)), sonneL && sonneL.laib ? sonneL.aussen - 4 * s : 0)); face(gi, moW - 1.2, yB + moH / 2, -moW / 2 + 0.6, -moH / 2, zg, 'rotateY(180deg)', '50% 50%'); malB(gi, gitterBg(w, s)); }
  /* Kasten des Insektenrollos oben am Rahmen, bei einem Aufsatzkasten darunter (dessen Unterseite reicht vor den Rahmen) */
  const mk = q('mesh-k'); if (mk) { const kh2 = Math.max(4, 48 * s); face(mk, iw + 10 * s, kh2, ix - 5 * s, Math.max(iy - kh2 * 0.7, sonneL && sonneL.unten != null ? sonneL.unten : -Infinity), z0 - fd - 10 * s, 'rotateY(180deg)', '50% 50%'); }
  w3dInnen(stage, w, o, V, s, q);
  /* Maßlinien in der Wandebene (Öffnung) oder Fensterebene (Element). Beim Messen liegen sie dort, wo gemessen wird (links, Mitte,
     rechts). In der Übersicht (dims-all, nichts aktiv) gilt: gleiche Maße nur einmal, die Maueröffnung außerhalb der Öffnung
     (Höhe links, Breite oben, Schild nach außen), das Element innen; so überdecken sich die Schilder nicht. */
  const DIM = { hm: ['v', 0, -moH / 2, moH, 4, 24], hl: ['v', -moW / 2 + 40 * s, -moH / 2, moH, 4, 78], hr: ['v', moW / 2 - 40 * s, -moH / 2, moH, 4, 78], wm: ['h', -moW / 2, 0, moW, 4, 22], wt: ['h', -moW / 2, -moH / 2 + 40 * s, moW, 4, 76], wb: ['h', -moW / 2, moH / 2 - 40 * s, moW, 4, 24], eh: ['v', x0 + elW * 0.72, y0, elH, z0 + 6, 58], ew: ['h', x0, y0 + elH * 0.4, elW, z0 + 6, 76] };
  const uebersicht = !V.active && !!(o.cls && o.cls.indexOf('dims-all') >= 0), weg = {}, an = {}, ohne = {};
  if (uebersicht) {
    const L = o.labels || {}, da = (ks) => ks.filter((k) => (V.dims || []).indexOf(k) >= 0), off = Math.max(10, 60 * s), unten = moH / 2 + off + (tuer ? 0 : 30 * s);
    const hs = da(['hm', 'hl', 'hr']), ws = da(['wm', 'wt', 'wb']), gleich = (ks) => ks.every((k) => L[k] === L[ks[0]]);
    if (hs.length && (hs.length === 1 || gleich(hs))) { hs.slice(1).forEach((k) => { weg[k] = 1; }); DIM[hs[0]] = ['v', -moW / 2 - off, -moH / 2, moH, 4, 50]; an[hs[0]] = 'l'; }
    else { if (DIM.hl) { DIM.hl = ['v', -moW / 2 - off, -moH / 2, moH, 4, 50]; an.hl = 'l'; } if (DIM.hr) { DIM.hr = ['v', moW / 2 + off, -moH / 2, moH, 4, 50]; an.hr = 'r'; } }
    if (ws.length && (ws.length === 1 || gleich(ws))) { ws.slice(1).forEach((k) => { weg[k] = 1; }); DIM[ws[0]] = ['h', -moW / 2, -moH / 2 - off, moW, 4, 50]; an[ws[0]] = 'o'; }
    else { DIM.wt = ['h', -moW / 2, -moH / 2 - off, moW, 4, 50]; an.wt = 'o'; DIM.wb = ['h', -moW / 2, unten, moW, 4, 76]; an.wb = 'u'; }
    DIM.eh = ['v', x0 + elW * 0.76, y0, elH, z0 + 6, 34]; DIM.ew = ['h', x0, y0 + elH * 0.8, elW, z0 + 6, 50];
    /* Ungleiche Maße: Die Schilder stehen an den äußeren Linien (links, rechts, oben, unten); die Linien in der Mitte bleiben ohne
       Schild, sonst überdecken sich die Schilder am Telefon. Die Werte nennt die Karte darunter bzw. der Schritt beim Messen */
    if (DIM.hm && !weg.hm && an.hm == null && an.hl) ohne.hm = 1;
    if (DIM.wm && !weg.wm && an.wm == null && an.wt) ohne.wm = 1;
  }
  /* Messen mit Feld (o.feld): nur die aktive Linie steht im Modell, die Linien des Elements laufen durch seine Mitte; das Feld sitzt auf
     senkrechten Linien mittig (an den Rändern zur Öffnung hin), auf waagerechten darüber wie die Maßzahl einer Zeichnung, die Enden
     stehen als Etiketten daneben bzw. darunter */
  const feld = o.feld && V.active ? o.feld : null;
  if (feld) { DIM.eh = ['v', x0 + elW / 2, y0, elH, z0 + 6, 50]; DIM.ew = ['h', x0, y0 + elH / 2, elW, z0 + 6, 50]; }
  const FD_AN = { hl: 'r', hr: 'l', wm: 'o', wt: 'u', wb: 'o', ew: 'o' };
  (V.dims || []).forEach((k) => {
    const D = DIM[k], de = q('dim-' + k); if (!D || !de) return;
    const vert = D[0] === 'v';
    de.style.width = px(vert ? 0 : D[3]); de.style.height = px(vert ? D[3] : 0);
    de.style.transform = 'translate3d(' + px(D[1]) + ', ' + px(D[2]) + ', ' + px(D[4]) + ')';
    de.classList.toggle('v', vert); de.classList.toggle('h', !vert); de.classList.toggle('is-weg', !!weg[k]); de.classList.toggle('ohne-schild', !!ohne[k]);
    ['l', 'r', 'o', 'u'].forEach((a) => de.classList.toggle('an-' + a, an[k] === a));
    const lab = q('lab-' + k), mitFeld = !!feld && k === V.active;
    if (lab) { lab.textContent = mitFeld ? '' : (o.labels && o.labels[k]) || '?'; lab.classList.toggle('feld', mitFeld); if (vert) { lab.style.top = D[5] + '%'; lab.style.left = '0'; } else { lab.style.left = D[5] + '%'; lab.style.top = '0'; } }
    de.classList.toggle('mit-feld', mitFeld);
  });
  if (feld) feldLage(stage, o, FD_AN[V.active] || 'm');
  stage._v = { d: d, fd: fd, T: T, s: s, moW: moW, moH: moH };
  W3D_SOFORT = false;
  return V;
}
/* Sonnenschutz außen. Stand des Behangs (0 = oben im Kasten, 1 = ganz unten) und Lamellenstellung (wend 0 = offen, 1 = zu) stellen
   die Knöpfe am Modell; sie gelten nur für die Ansicht und werden nicht gespeichert.
   Vorbau: Kasten bzw. Blende vor der Fassade, Schienen auf der Fassade neben der Öffnung, Behang davor bis auf die Außenbank.
   Aufsatz: Kasten in der Öffnung oben, außen überputzt mit Auslaufschlitz; Schienen und Behang in der Laibung vor dem Rahmen.
   Raffstore: Lamellen (80 mm, C-Profil, Abstand 72 mm, 8 mm Überlappung) an zwei Aufzugbändern; beim Hochfahren sammeln sie sich
   flach auf der Endschiene und fahren mit ihr als Paket unter die Blende. */
const LAM_MAX = 44;
/* stand = Ziel (0 oben, 1 unten), pos = angezeigter Stand: während einer Fahrt (w3dFahrt) läuft pos bildweise zum Ziel, sonst ist er gleich */
const W3D_BEHANG = { stand: 0.55, wend: 0, pos: 0.55 };
let FAHRT = null; // laufende Fahrt: { raf, stage }
/* Stand des Behangs für die Darstellung: während einer Fahrt dieser Bühne der Zwischenstand, sonst das Ziel */
function behangStand(st, stage) { const fahrt = !!(FAHRT && FAHRT.stage === stage); const v = clamp(+(fahrt ? st.pos : st.stand) || 0, 0, 1); if (!fahrt) st.pos = v; return v; }
function w3dSonne(stage, w, o, V, s, q) {
  const moW = V.moW * s, moH = V.moH * s, T = V.T * s, d = V.laib * s, fd = V.fd * s, z0 = -d, auf = w.roll === 'aufsatz';
  const raff = w.sart === 'raffstore', screen = w.sart === 'screen', st = o.behang || W3D_BEHANG, stand = behangStand(st, stage);
  /* Unterputz: der Kasten liegt in der Wand über der Öffnung (nicht zu sehen), Schienen und Behang sitzen wie beim Aufsatz in der Laibung.
     Raffstore am Seil (Detailangabe fuehrung): dünne Edelstahlseile statt Schienen; Lamellenform nach der Detailangabe lamelle */
  const up = w.roll === 'unterputz', inLaib = auf || up, seil = raff && dg(w, 'fuehrung') && w.fuehrung === 'seil', lm = raff && dg(w, 'lamelle') ? w.lamelle : 'c80';
  const c = sonneFarbeW(w), F = c[0], D = c[1], L = c[2], aus = (el) => { if (el) { el._k = ''; el.style.opacity = '0'; el.style.width = '0px'; el.style.height = '0px'; } };
  const kH = (auf ? V.kastenH || KASTEN_AUF[w.sart] || 200 : raff ? 150 : screen ? 130 : 180) * s, rail = seil ? [5, 6] : raff ? [26, 30] : screen ? [30, 40] : [22, 40], rw = Math.max(seil ? 1 : 2, rail[0] * s), rd = rail[1] * s;
  /* Oberkante des Aufsatzkastens: auf dem Blendrahmen (bei voller Elementhöhe bündig mit der Öffnung oben) */
  const yK = auf ? V.y0 * s - kH : -moH / 2;
  /* Raffstore: Schienen mit Abstand vor Fassade bzw. Rahmen (Distanzwinkel), damit die geneigten Lamellen frei drehen und nicht in
     die Wand ragen; der Vorbaukasten wird entsprechend tiefer */
  const LT = raff ? LAMELLE[lm] || LAMELLE.c80 : null, abst = LT ? Math.max(0, LT.h / 2 + 3 - rail[1] / 2) * s : 0, kD = Math.max(rd + 110 * s, abst + rd + 80 * s);
  /* Kasten */
  if (q('roll-f')) {
    ['roll-f', 'roll-sl', 'roll-b', 'roll-t', 'roll-l', 'roll-r'].forEach((r) => { const e = q(r); if (e) e.style.opacity = ''; });
    if (auf) {
      const dz = Math.max(1, T - d - fd), yb = yK + kH, schlitz = (Math.max(3, 16 * rd / 26) + 3 * s) / dz * 100, mitte = (3 * s + abst + rd / 2) / dz * 100;
      face(q('roll-f'), moW, kH, -moW / 2, yK, -T + 0.5, 'rotateY(180deg)', '50% 50%'); q('roll-f').style.backfaceVisibility = 'hidden';
      /* Muster der Fassade läuft über die Blende weiter (WebGL): Versatz der Blende in der Wandfläche, beide von außen gesehen gespiegelt */
      const rf = q('roll-f'), wo = q('wall-out'); rf._artVers = wo && wo._f ? [(wo._f.x + wo._f.W) - (rf._f.x + rf._f.W), rf._f.y - wo._f.y] : null;
      face(q('roll-b'), moW, dz, -moW / 2, yb, z0 - fd, 'rotateX(-90deg)', '0 0');
      const rb = q('roll-b'), rbg = 'linear-gradient(180deg, #9a9083 0 ' + n1(mitte - schlitz / 2) + '%, #232426 ' + n1(mitte - schlitz / 2) + '% ' + n1(mitte + schlitz / 2) + '%, #a49a8d ' + n1(mitte + schlitz / 2) + '%)';
      if (rb._bg !== rbg) { rb._bg = rbg; rb.style.background = rbg; }
      ['roll-sl', 'roll-t', 'roll-l', 'roll-r'].forEach((r) => aus(q(r)));
    } else {
      const bev = raff ? 0 : Math.min(kH * 0.3, 44 * s), bw = moW + 2 * (rw + 40 * s), bx = -bw / 2, by = -moH / 2 - kH;
      face(q('roll-f'), bw, kH - bev, bx, by, -T - kD, 'rotateY(180deg)', '50% 50%'); q('roll-f').style.backfaceVisibility = '';
      face(q('roll-sl'), bw, bev * Math.SQRT2, bx, by + kH - bev, -T - kD, 'rotateX(45deg)', '0 0'); if (!bev) aus(q('roll-sl'));
      face(q('roll-b'), bw, kD - bev, bx, -moH / 2, -T, 'rotateX(-90deg)', '0 0');
      face(q('roll-t'), bw, kD, bx, by, -T, 'rotateX(-90deg)', '0 0');
      const seite = bev ? 'polygon(0 0, ' + px(kD) + ' 0, ' + px(kD) + ' ' + px(kH - bev) + ', ' + px(kD - bev) + ' ' + px(kH) + ', 0 ' + px(kH) + ')' : null;
      face(q('roll-l'), kD, kH, bx, by, -T, 'rotateY(90deg)', '0 0', seite); face(q('roll-r'), kD, kH, bx + bw, by, -T, 'rotateY(90deg)', '0 0', seite);
    }
  }
  /* Solarmodul auf der Blende: vor der Front des Vorbaukastens bzw. auf der Aufsatzblende in der Öffnung, am rechten Ende (von außen links) */
  const so = q('solar');
  if (so) {
    if (auf) { const pw = Math.min(260 * s, moW * 0.3), ph = kH * 0.62; face(so, pw, ph, moW / 2 - 12 * s - pw, yK + (kH - ph) / 2, -T - 0.3, 'rotateY(180deg)', '50% 50%'); }
    else { const bev = raff ? 0 : Math.min(kH * 0.3, 44 * s), bw = moW + 2 * (rw + 40 * s), ph = (kH - bev) * 0.62, pw = Math.min(260 * s, bw * 0.3); face(so, pw, ph, bw / 2 - 12 * s - pw, -moH / 2 - kH + (kH - bev - ph) / 2, -T - kD - 0.8, 'rotateY(180deg)', '50% 50%'); }
  }
  if (!q('fs-l')) return null;
  /* Führungsschienen: Stirn nach außen und die Innenseite zur Öffnung hin */
  const yTop = auf ? yK + kH : -moH / 2, yEnd = moH / 2, len = Math.max(1, yEnd - yTop);
  const zr = (inLaib ? z0 - fd - 3 * s : -T) - abst, xl = inLaib ? -moW / 2 : -moW / 2 - rw, xr = inLaib ? moW / 2 - rw : moW / 2;
  face(q('fs-l'), rw, len, xl, yTop, zr - rd, 'rotateY(180deg)', '50% 50%'); face(q('fs-r'), rw, len, xr, yTop, zr - rd, 'rotateY(180deg)', '50% 50%');
  face(q('fs-l2'), rd, len, xl + rw, yTop, zr, 'rotateY(90deg)', '0 0'); face(q('fs-r2'), rd, len, xr, yTop, zr, 'rotateY(90deg)', '0 0');
  /* Behang zwischen den Schienenmitten, in der Mitte der Schienentiefe */
  const zb = zr - rd / 2, bw = inLaib ? moW - rw : moW + rw, bx = -bw / 2, uH = Math.max(3, (raff ? 45 : screen ? 30 : 38) * s), Hmax = Math.max(0, len - uH), dep = Math.max(2, rd * 0.7);
  let e;
  if (raff) {
    /* Lamellentyp (Detailangabe lamelle): Höhe, Teilung und Profil. C-Lamelle 80 mm, Teilung 72 mm, gewölbt; Z-Lamelle 90 mm, Teilung
       80 mm, mit abgekanteten Rändern; Flachlamelle 60 mm, Teilung 52 mm, eben. _bieg wölbt die Lamelle im Licht der WebGL-Bühne */
    const N = Math.min(LAM_MAX, Math.max(1, Math.ceil(Hmax / (LT.p * s)))), p = Math.max(LT.p * s, Hmax / N), lh = LT.h * s, pk = Math.max(0.9, LT.pk * s);
    const tilt = st.wend ? 6 : 78;
    e = yTop + N * pk + stand * Math.max(0, Hmax - N * pk);
    const lamBg = lamelleBg(lm, !!st.wend, F, D, L);
    for (let k = 0; k < LAM_MAX; k++) {
      const el = q('lam-' + k); if (!el) continue;
      /* überzählige Lamellen: ausgeblendet und durchsichtig (die WebGL-Bühne liest nur die Deckkraft) */
      if (k >= N) { el.style.display = 'none'; el.style.opacity = '0'; continue; }
      el.style.display = ''; el.style.opacity = '';
      const haengt = yTop + (k + 0.5) * p, paket = e - (N - k - 0.5) * pk, frei = haengt <= paket, cy = Math.min(haengt, paket);
      face(el, bw, lh, bx, cy - lh / 2, zb, 'rotateX(' + (frei ? -tilt : -86) + 'deg)', '50% 50%');
      if (el._bg !== lamBg) { el._bg = lamBg; el.style.background = lamBg; }
      el._bieg = LT.bieg;
    }
    /* Aufzugbänder bei einem Sechstel und fünf Sechsteln der Breite, an der Außenkante der Lamellen */
    const bz = zb - (lh / 2) * Math.sin(tilt * Math.PI / 180) - 0.6, bb = Math.max(1.2, 6 * s);
    face(q('band-l'), bb, Math.max(0, e - yTop), bx + bw / 6 - bb / 2, yTop, bz, '', '0 0'); face(q('band-r'), bb, Math.max(0, e - yTop), bx + bw * 5 / 6 - bb / 2, yTop, bz, '', '0 0');
    const AUFZUG = 'repeating-linear-gradient(180deg, rgba(0, 0, 0, .2) 0 1px, transparent 1px 5px), #d9d7d0';
    ['band-l', 'band-r'].forEach((r) => { const el = q(r); if (el && el._bg !== AUFZUG) { el._bg = AUFZUG; el.style.background = AUFZUG; } });
    /* Leiterkordeln nahe den Enden: je Seite eine Schnur vor und eine hinter den Lamellen (sie tragen und wenden die Lamellen) */
    const kb = Math.max(0.8, 2.2 * s), kz = (lh / 2) * Math.sin(tilt * Math.PI / 180) + 0.5, KORDEL = '#d4d2cb';
    [['kord-lv', bx + bw * 0.035, zb - kz], ['kord-lh', bx + bw * 0.035, zb + kz], ['kord-rv', bx + bw * 0.965, zb - kz], ['kord-rh', bx + bw * 0.965, zb + kz]].forEach((k) => { const el = q(k[0]); if (!el) return; face(el, kb, Math.max(0, e - yTop), k[1] - kb / 2, yTop, k[2], '', '0 0'); if (el._bg !== KORDEL) { el._bg = KORDEL; el.style.background = KORDEL; } });
  } else {
    const bh = q('behang'); e = yTop + stand * Hmax;
    if (bh) {
      /* Screen: Durchsicht nach dem Gewebe (Detailangabe transp), lichtdurchlässig bis verdunkelnd */
      const tr = screen && dg(w, 'transp') ? w.transp : '', op = tr === 'licht' ? '.72' : tr === 'dunkel' ? '.97' : '.86';
      face(bh, bw, Math.max(0, e - yTop), bx, yTop, zb, '', '0 0'); bh.style.opacity = e - yTop < 0.5 ? '0' : screen ? op : '';
      const bgv = behangBg(w, s); if (bh._bg !== bgv) { bh._bg = bgv; bh.style.background = bgv; }
      /* WebGL: jede Lamelle des Panzers gewölbt im Licht (Teilung wie der Verlauf, Neigung der Normale ±0,42), der Screen bleibt glatt */
      bh._relief = screen ? null : [panzerTeilung(w) * s, 0.42, 0, 0];
    }
  }
  face(q('behang-u'), bw, uH, bx, e, zb - 0.4, '', '0 0');
  face(q('behang-ub'), bw, dep, bx, e + uH, zb + dep / 2, 'rotateX(-90deg)', '0 0');
  /* Anschlagstopfen des Rollladens: zwei Klötze oben auf der Endleiste, außen davor */
  const sw = Math.max(2, 24 * s), sh = Math.max(2, uH * 0.6);
  face(q('stopf-l'), sw, sh, bx + bw * 0.14, e - sh, zb - 0.9, '', '0 0'); face(q('stopf-r'), sw, sh, bx + bw * 0.86 - sw, e - sh, zb - 0.9, '', '0 0');
  ['stopf-l', 'stopf-r'].forEach((r) => { const el = q(r); if (el) el._rund = Math.min(sw, sh) * 0.25; });
  /* äußerste Ebene des Sonnenschutzes (Schienen, beim Raffstore die gedrehten Lamellen): Glasbrüstung in der Laibung und Geländer vor
     der Fassade liegen davor */
  return { aussen: Math.min(zr - rd, LT ? zb - LT.h * s / 2 : zr - rd), laib: inLaib, unten: auf ? yTop : null };
}
/* Sichtschutz innen: Kassette oben, Behang nach dem Stand der Knöpfe herab, Endleiste; vor dem Rahmen auf der Raumseite */
function w3dInnen(stage, w, o, V, s, q) {
  const inn = q('innen'); if (!inn) return;
  const z0 = -V.laib * s, ix = (V.x0 + V.pf) * s, iy = (V.y0 + V.pf) * s, iw = V.innerW * s, ih = V.innerH * s;
  const zi = z0 + 24 * s, bwI2 = iw + 12 * s, bxI2 = ix - 6 * s, kH = Math.max(3, (w.iart === 'rollo' ? 58 : 36) * s), hI = ih * Math.max(0.03, behangStand(o.behang || W3D_BEHANG, stage)), c = innenFarbeW(w);
  face(q('innen-k'), bwI2, kH, bxI2, iy - kH, zi, '', '0 0'); const ik = q('innen-k'); if (ik) { ik._bg = 'linear-gradient(180deg, ' + c[2] + ', ' + c[1] + ')'; ik.style.background = ik._bg; }
  face(inn, bwI2, hI, bxI2, iy, zi - 0.4, '', '0 0'); inn._bg = innenBg(w, s); inn.style.background = inn._bg; inn.style.boxShadow = w.iart === 'jalousie' ? 'none' : '';
  face(q('innen-u'), bwI2, Math.max(2, 14 * s), bxI2, iy + hI, zi, '', '0 0'); const iu = q('innen-u'); if (iu) { iu._bg = c[1]; iu.style.background = iu._bg; }
}
/* Lamellen des Raffstores je Typ: Höhe h, Teilung p, Paketdicke pk (mm) und Wölbung bieg (Grad je Kante, WebGL) */
const LAMELLE = { c80: { h: 80, p: 72, pk: 7, bieg: 22 }, z90: { h: 90, p: 80, pk: 8, bieg: 6 }, flach: { h: 60, p: 52, pk: 5, bieg: 0 } };
/* Verlauf über die Lamellenhöhe: C-Profil hell oben und zur Kante hin dunkel; Z-Profil mit zwei abgekanteten Rändern; flach fast gleichmäßig.
   Gewendet (zu) steht die Lamelle fast senkrecht, das Licht fällt flacher */
function lamelleBg(lm, zu, F, D, L) {
  /* Bördelkanten: oben ein schmaler Lichtsaum, unten der dunkle Umschlag mit einer feinen Lichtlinie darunter */
  const dunkel = mischHex(D, '#000000', 0.3), hell = mischHex(F, '#ffffff', 0.16), saum = mischHex(L, '#ffffff', 0.4);
  if (lm === 'z90') return 'linear-gradient(180deg, ' + D + ' 0 4%, ' + saum + ' 4% 7%, ' + L + ' 7% 12%, ' + (zu ? F : hell) + ' 25%, ' + F + ' 76%, ' + D + ' 86%, ' + L + ' 88% 93%, ' + dunkel + ' 94%)';
  if (lm === 'flach') return 'linear-gradient(180deg, ' + saum + ' 0 3%, ' + L + ' 3% 8%, ' + (zu ? F : hell) + ' 16%, ' + F + ' 84%, ' + D + ' 95%, ' + dunkel + ')';
  return zu ? 'linear-gradient(180deg, ' + saum + ' 0 3%, ' + L + ' 3% 9%, ' + F + ' 20% 58%, ' + D + ' 86%, ' + dunkel + ' 95%, ' + D + ')' : 'linear-gradient(180deg, ' + saum + ' 0 3%, ' + L + ' 3% 10%, ' + hell + ' 30%, ' + F + ' 68%, ' + D + ' 90%, ' + dunkel + ' 96%, ' + L + ')';
}
/* Bedienung innen neben der Öffnung: an der Wand der Gurtwickler auf etwa 1.000 mm mit Gurtband aus der Wand über der Öffnung,
   in der Laibung die Kurbelstange mit Kurbel auf etwa 1.100 mm, Wandtaster auf 1.050 mm (elektrisch und Smart Home mit Funk-Punkt,
   Hebe-Schiebe-Tür elektrisch; Solar ohne Wandtaster, er wird per Funk bedient). Seite nach der Detailangabe bedien, sonst Wickler und
   Taster rechts, Kurbel links. Fußboden: Tür auf der Schwelle, Fenster nach Brüstung, ohne Angabe 900 mm angenommen */
function w3dAntrieb(w, V, s, q) {
  const t = q('an-taster'); if (!t) return;
  const moW = V.moW * s, moH = V.moH * s, bruTxt = String(w.bru == null ? '' : w.bru).trim(), boden = moH / 2 + (V.tuer ? 0 : bruTxt !== '' ? num(w.bru) : 900) * s;
  const sonne = sonneAktiv(w), a = w.antrieb, gurt = sonne && a === 'gurt', kurbel = sonne && a === 'kurbel', taster = (sonne && (a === 'motor' || a === 'smart')) || (w.art === 'hst' && w.griff === 'motor');
  const seite = dg(w, 'bedien') ? w.bedien : '', sw = seite === 'links' ? -1 : 1, sk = seite === 'rechts' ? 1 : -1;
  const x = sw * (moW / 2 + 120 * s), ww = Math.max(4, 50 * s), wh = Math.max(10, 170 * s), yw = Math.min(boden - 1000 * s, moH / 2 - wh / 2), gb = Math.max(1.5, 22 * s), yo = -moH / 2 - 70 * s;
  face(q('an-wickler'), ww, wh, x - ww / 2, yw - wh / 2, 1, '', '0 0');
  /* Schlitz oben im Wickler, durch den das Gurtband läuft */
  face(q('an-schlitz'), ww * 0.4, wh * 0.1, x - ww * 0.2, yw - wh / 2 + wh * 0.08, 1.4, '', '0 0');
  face(q('an-gurt'), gb, Math.max(0, yw - wh / 2 - yo), x - gb / 2, yo, 1.2, '', '0 0');
  const sb = Math.max(2, 16 * s), xs = sk * (moW / 2 - 50 * s), ys = -moH / 2 + 40 * s, ye = Math.max(ys + 60 * s, Math.min(boden - 1100 * s, moH / 2 - 160 * s)), zs = -V.laib * s + 40 * s;
  face(q('an-stange'), sb, Math.max(0, ye - ys), xs - sb / 2, ys, zs, '', '0 0');
  /* Kurbel um die Kurbelstange geschwenkt, zur Öffnung hin (rotateZ, damit die WebGL-Bühne sie liest) */
  face(q('an-kurbel'), Math.max(10, 130 * s), Math.max(3, 22 * s), sk < 0 ? xs : xs - Math.max(10, 130 * s), ye - Math.max(1.5, 11 * s), zs + 1, 'rotateZ(' + (sk < 0 ? 32 : -32) + 'deg)', sk < 0 ? '0 50%' : '100% 50%');
  const tg = Math.max(7, 80 * s), ty = boden - 1050 * s - tg / 2;
  face(t, tg, tg, x - tg / 2, ty, 1, '', '0 0');
  /* Wippe in der Mitte des Tasters, beim Smart Home ein Funk-Punkt oben rechts */
  face(q('an-wippe'), tg * 0.56, tg * 0.56, x - tg * 0.28, ty + tg * 0.22, 1.4, '', '0 0');
  const fk = Math.max(1.5, tg * 0.14); face(q('an-funk'), fk, fk, x + tg / 2 - tg * 0.08 - fk, ty + tg * 0.08, 1.8, '', '0 0');
  [['an-wickler', 3], ['an-taster', 4], ['an-wippe', 2], ['an-funk', fk / 2], ['an-schlitz', 2]].forEach((r) => { const e = q(r[0]); if (e) e._rund = r[1]; });
  [['an-gurt', gurt], ['an-wickler', gurt], ['an-schlitz', gurt], ['an-stange', kurbel], ['an-kurbel', kurbel], ['an-taster', taster], ['an-wippe', taster], ['an-funk', taster && sonne && a === 'smart']].forEach((r) => { const e = q(r[0]); if (e) e.style.opacity = r[1] ? '' : '0'; });
}
/* Lage des Griffs auf einem Flügel (Flügelkoordinaten in Pixeln): Achse (ax, ay), Hebel (lx, ly, lw, lh, Drehpunkt) und Rosette (rw, rh).
   Fenster: Hebel hängt nach unten, Rosette etwa 30 × 75 mm, Hebel etwa 135 mm. Kipp: oben mittig, Hebel waagerecht.
   Hebe-Schiebe: Achse etwa 1.050 mm über dem Boden, der lange Hebel (320 mm) zeigt geschlossen nach oben und dreht zum Heben nach unten. */
function w3dGriffAchse(V, w, s, sashH, yt, yb, lang) {
  const tuer = V.tuer, bruTxt = String(w.bru == null ? '' : w.bru).trim(), bodentief = !tuer && bruTxt !== '' && num(w.bru) < 400;
  /* Abstand Fußboden bis Unterkante Flügel: Tür über der Schwelle, Fenster über Brüstung, Rahmen und Unterlicht */
  const unter = tuer ? V.pfB : num(w.bru) + V.pfB + (V.ulH ? V.ulH + W3D.MUL : 0);
  const lo = yt + Math.max(250 * s, 40 * s), hi = yb - Math.max(lang + 23 * s, 250 * s);
  const ziel = tuer || bodentief ? sashH - (1050 - unter) * s : Math.max(sashH / 2, (yt + yb) / 2);
  return lo <= hi ? clamp(ziel, lo, hi) : (yt + yb) / 2;
}
function w3dGriffLage(V, w, x, i, s, g) {
  const sashW = g.sashW, sashH = g.sashH, sf = g.sf, G = g.G, gI = g.gI;
  const steh = stehFluegel(w, i), bedien = fswBedien(w) === i, fest = (x.t === 'F' || x.t === 'X' || !!x.st) && !bedien;
  const ohne = w.griff === 'ohne' || (w.griff === 'motor' && w.art === 'hst');
  /* Stulp mit Griff am zweiten Flügel (Detailangabe stulpBed): auch der Standflügel zeigt einen Griff */
  const stulpGriff = steh && dg(w, 'stulpBed') && w.stulpBed === 'griff';
  const r = { steh: steh, bedien: bedien, sichtbar: !fest && (!steh || stulpGriff) && !ohne };
  /* Griffmodell (Detailangabe griffM): Design schlanker und länger mit flacher, schmaler Rosette, Stilgriff (Olive) kurz und kräftig
     mit großer Rosette */
  const gm = dg(w, 'griffM') ? w.griffM : '', gL = gm === 'design' ? 150 / 135 : gm === 'stil' ? 112 / 135 : 1, gB = gm === 'design' ? 17 / 20 : gm === 'stil' ? 27 / 20 : 1;
  const rB = gm === 'design' ? 26 : gm === 'stil' ? 36 : 30, rH = gm === 'design' ? 62 : gm === 'stil' ? 86 : 75;
  /* Oberkante und Unterkante des Flügels an der Griffkante (bei Formen der gerade Teil des Profils) */
  const kante = (xs) => { const xe = Math.max(0.5, Math.min(sashW - 0.5, xs)); return [G ? Math.max(0, gI.top(g.left + xe) - g.sashTop) : 0, G ? Math.min(sashH, gI.bot(g.left + xe) - g.sashTop) : sashH]; };
  if (x.t === 'S') {
    /* Schema C: zwei Schiebeflügel stoßen in der Mitte zusammen, die Griffe rücken je 40 mm vom Stoß weg */
    const nb = w.sashes[x.din === 'L' ? i - 1 : i + 1], ein = nb && nb.t === 'S' ? 40 * s : 0;
    const hw = Math.max(6, 30 * s), hl = 320 * s, ax = x.din === 'L' ? sf / 2 + ein : sashW - sf / 2 - ein;
    const ay = clamp(sashH - (1050 - V.pfB) * s, hl, Math.max(hl, sashH - 150 * s));
    return Object.assign(r, { ax: ax, ay: ay, lw: hw, lh: hl + hw / 2, lx: ax - hw / 2, ly: ay - hl, origin: '50% ' + px(hl), ox: hw / 2, oy: hl, rw: Math.max(6, 36 * s), rh: Math.max(14, 96 * s) });
  }
  const hw = Math.max(4, 20 * gB * s), hl = Math.max(16, 135 * gL * s), rw = Math.max(5, rB * s), rh = Math.max(11, rH * s);
  if (x.t === 'K') {
    const k = kante(sashW / 2), ax = sashW / 2 - hl / 2 + hw / 2, ay = k[0] + sf / 2;
    return Object.assign(r, { ax: ax, ay: ay, lw: hl, lh: hw, lx: ax - hw / 2, ly: ay - hw / 2, origin: px(hw / 2) + ' 50%', ox: hw / 2, oy: hw / 2, rw: rh, rh: rw });
  }
  /* Dreh, Dreh-Kipp, Gehflügel und der Bediengriff der Faltwand: Griff gegenüber den Bändern. PSK: auf der Schließseite wie bei
     Hebe-Schiebe (din = Seite, auf der der Flügel geschlossen steht) */
  const rechts = bedien ? (w.fsw || {}).schema !== 'rechts' : x.t === 'PS' ? x.din === 'R' : x.din === 'L';
  /* PSK Schema C: zwei Schiebeflügel stoßen in der Mitte zusammen, die Griffe rücken wie bei Hebe-Schiebe je 40 mm vom Stoß weg */
  const nbP = x.t === 'PS' ? w.sashes[rechts ? i + 1 : i - 1] : null, einP = nbP && nbP.t === 'PS' ? 40 * s : 0;
  /* Griffhöhe (Detailangabe griffPos): tief gut erreichbar, hoch außer Reichweite von Kindern; sonst nach w3dGriffAchse */
  const ax = rechts ? sashW - sf / 2 - einP : sf / 2 + einP, k = kante(ax), lage = dg(w, 'griffPos') ? w.griffPos : '';
  const ay0 = w3dGriffAchse(V, w, s, sashH, k[0], k[1], hl), lo = k[0] + Math.max(250 * s, 40 * s), hi = Math.max(lo, k[1] - Math.max(hl + 23 * s, 250 * s));
  const ay = lage === 'tief' ? clamp(Math.max(ay0, k[0] + (k[1] - k[0]) * 0.64), lo, hi) : lage === 'hoch' ? clamp(Math.min(ay0, k[0] + (k[1] - k[0]) * 0.3), lo, hi) : ay0;
  return Object.assign(r, { ax: ax, ay: ay, lw: hw, lh: hl, lx: ax - hw / 2, ly: ay - hw / 2, origin: '50% ' + px(hw / 2), ox: hw / 2, oy: hw / 2, rw: rw, rh: rh });
}
function w3dBarPos(be, b, bw) {
  if (!be) return;
  be._b = { d: b.d, p: b.p, bw: bw };
  if (b.d === 'v') { be.style.left = 'calc(' + n1(b.p * 100) + '% - ' + px(bw / 2) + ')'; be.style.top = '0'; be.style.width = px(bw); be.style.height = '100%'; }
  else { be.style.top = 'calc(' + n1(b.p * 100) + '% - ' + px(bw / 2) + ')'; be.style.left = '0'; be.style.height = px(bw); be.style.width = '100%'; }
}
/* Glasflächen in Bühnenkoordinaten (Frontansicht), gerechnet statt gemessen, damit Übergänge nicht stören */
const W3D_PERSP = 1300;
function w3dGlassRects(stage, w, o, gr) {
  const W = gr ? gr[0] : stage.clientWidth || 358, H = gr ? gr[1] : stage.clientHeight || 360, cx = W / 2, cy = H / 2, oy = H * 0.46;
  const V = w3dCalc(w, Object.assign({}, o, { stageW: W, stageH: H })), s = V.s;
  const d = V.laib * s, fd = W3D.FD * s, z = -d - fd / 2, f = W3D_PERSP / (W3D_PERSP - z);
  const x0 = V.x0 * s, y0 = V.y0 * s, pf = V.pf * s, sf = V.sf * s, mul = V.mul * s, olH = V.olH * s, sashTop = y0 + pf + (olH ? olH + V.km * s : 0), sashW = V.sashW * s, sashH = V.sashH * s;
  const proj = (x, y) => [cx + x * f, oy + (cy + y - oy) * f];
  return { s: s, sashes: w.sashes.map((x, i) => { const ssf = x.t === 'F' ? 3 : sf, sw = V.sw[i] * s, left = x0 + pf + V.sx[i] * s + ssf, top = sashTop + ssf, a = proj(left, top), b = proj(left + sw - 2 * ssf, top + sashH - 2 * ssf); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; }) };
}
/* Schieberegler neben dem Modell: waagerechte Leiste für senkrechte Sprossen, senkrechte Leiste für waagerechte */
function layoutRails(stage, w, o, gr) {
  const rh = stage.querySelector('[data-rail="v"]'), rv = stage.querySelector('[data-rail="h"]');
  if (!rh || !rv) return;
  if (!o.rails) { rh.hidden = true; rv.hidden = true; return; }
  rh.hidden = false; rv.hidden = false;
  const G = w3dGlassRects(stage, w, o, gr), gs = G.sashes;
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
/* ---------- Zoom im Modell ----------
   Je Bühne ein Faktor 1 bis 4 und eine Verschiebung (W3DZ, über render() hinweg; key = Bildschirm und Frage, ein neuer key setzt
   zurück). Gezoomt wird über den Maßstab (w3dCalc), verschoben über --panx/--pany an der Kamera. Zwei Finger zoomen und schieben,
   ein Finger schiebt (gezoomt) oder dreht (1:1), Strg/Cmd + Mausrad bzw. Trackpad zoomt, Doppeltipp schaltet 1 ↔ 2,5 an der Stelle,
   dazu die Knöpfe + und − und „1:1“. In der Sprossenfrage (o.rails) ist der Zoom aus, weil die Regler neben dem Modell rechnen. */
const W3DZ = {}, ZOOM_MAX = 4;
const w3dZoomZustand = (stage) => W3DZ[stage.id || 'w3d'] || (W3DZ[stage.id || 'w3d'] = { z: 1, x: 0, y: 0, key: null });
const w3dZ = (stage, o) => (!stage || (o && o.rails) || (o && o.noZoom) ? 1 : w3dZoomZustand(stage).z);
const HAUS_ICO = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M19.3 13.4l1.9 1.5-1.8 3.1-2.3-.8a7.6 7.6 0 0 1-1.7 1l-.4 2.4h-3.6l-.4-2.4a7.6 7.6 0 0 1-1.7-1l-2.3.8-1.8-3.1 1.9-1.5a7.6 7.6 0 0 1 0-2.8L4.9 9.1l1.8-3.1 2.3.8a7.6 7.6 0 0 1 1.7-1l.4-2.4h3.6l.4 2.4a7.6 7.6 0 0 1 1.7 1l2.3-.8 1.8 3.1-1.9 1.5a7.6 7.6 0 0 1 0 2.8z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>';
const ZOOM_ICO = { plus: '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>', minus: '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' };
function w3dZoomKnoepfe(stage, o) {
  let k = stage.querySelector('[data-r="zoom"]');
  stage.classList.toggle('ohne-zoom', !!(o.rails || o.noZoom));
  if (o.rails || o.noZoom) { if (k) k.remove(); return; }
  if (!k) { stage.insertAdjacentHTML('beforeend', '<div class="w3d-ctl w3d-zoom" data-r="zoom"><button type="button" class="w3d-knopf rund eins" data-w3d="eins" aria-label="Ansicht zurücksetzen">1:1</button><button type="button" class="w3d-knopf rund" data-w3d="minus" aria-label="Verkleinern">' + ZOOM_ICO.minus + '</button><button type="button" class="w3d-knopf rund" data-w3d="plus" aria-label="Vergrößern">' + ZOOM_ICO.plus + '</button></div>'); k = stage.querySelector('[data-r="zoom"]'); }
}
/* Zahnrad fürs Haus (Fassade und Farbe, hausAuf): eigene Gruppe links neben dem Zoom, in der Übersicht der Maße unten rechts (app.css);
   nur am Modell des eigenen Fensters in den Wünschen und im Ergebnis (model() setzt o.haus) */
function w3dHausKnopf(stage, o) {
  const k = stage.querySelector('[data-r="haus"]');
  stage.classList.toggle('mit-haus', !!o.haus);
  if (!o.haus) { if (k) k.remove(); return; }
  if (!k) stage.insertAdjacentHTML('beforeend', '<div class="w3d-ctl w3d-haus" data-r="haus"><button type="button" class="w3d-knopf rund haus" data-w3d="haus" aria-label="Haus: Fassade und Farbe" title="Fassade und Farbe">' + HAUS_ICO + '</button></div>');
}
/* Zustand zeigen: Verschiebung an die Kamera, Klassen und Knöpfe */
function w3dZoomZeigen(stage) {
  const zm = w3dZoomZustand(stage), an = zm.z > 1.001;
  stage.style.setProperty('--panx', px(zm.x)); stage.style.setProperty('--pany', px(zm.y));
  stage.classList.toggle('is-zoom', an);
  const k = stage.querySelector('[data-r="zoom"]');
  if (k) { const b = (r) => k.querySelector('[data-w3d="' + r + '"]'); b('eins').hidden = !an; b('minus').disabled = !an; b('plus').disabled = zm.z >= ZOOM_MAX - 0.001; }
  /* Gezoomt verschiebt Ziehen, statt zu drehen: der Hinweis sagt es */
  const reg = W3DS[stage.id], hint = stage.querySelector('[data-r="hint"]'), h0 = reg && reg.o.hint ? reg.o.hint : '';
  if (hint && /Drehen ziehen/.test(h0)) hint.textContent = an ? 'Zum Verschieben ziehen' : h0;
}
/* Grenzen der Verschiebung: bei 1:1 keine, gezoomt bis etwa an den Rand des ungezoomten Bildes */
function w3dPanGrenze(stage, zm) {
  const W = stage.clientWidth || 358, H = stage.clientHeight || 360, gx = (zm.z - 1) * W * 0.56, gy = (zm.z - 1) * H * 0.56;
  zm.x = zm.z <= 1.001 ? 0 : clamp(zm.x, -gx, gx); zm.y = zm.z <= 1.001 ? 0 : clamp(zm.y, -gy, gy);
}
/* Zoomen um einen Ankerpunkt (ax, ay relativ zur Bühnenmitte): der Punkt darunter bleibt stehen. sanft = kurzer Übergang */
function w3dZoomSetzen(stage, z, ax, ay, sanft) {
  const reg = W3DS[stage.id]; if (!reg || reg.o.rails || reg.o.noZoom) return;
  const zm = w3dZoomZustand(stage), z1 = clamp(z, 1, ZOOM_MAX), k = z1 / zm.z;
  zm.x = (ax || 0) - ((ax || 0) - zm.x) * k; zm.y = (ay || 0) - ((ay || 0) - zm.y) * k; zm.z = z1;
  w3dPanGrenze(stage, zm);
  w3dZoomAnim(stage, sanft);
  w3dLayout(stage, reg.w, reg.o); w3dZoomZeigen(stage);
}
function w3dZoomAnim(stage, sanft) {
  stage.classList.toggle('is-zoomanim', !!sanft && !ruhig()); stage.classList.toggle('is-zooming', !sanft);
  clearTimeout(stage._zt); stage._zt = setTimeout(() => stage.classList.remove('is-zoomanim', 'is-zooming'), sanft ? 420 : 60);
}
/* Bildschirmlage eines Weltpunkts (Mitte der Bühne = 0) bei Verschiebung 0: Kamera drehen, dann Perspektive (1300 px, Ursprung 50 % 46 %) */
function w3dProj(stage, p) {
  const H = stage.clientHeight || 360, rx = parseFloat(stage.style.getPropertyValue('--rx')) || 0, ry = parseFloat(stage.style.getPropertyValue('--ry')) || 0;
  const a = rx * Math.PI / 180, b = ry * Math.PI / 180, x1 = p[0] * Math.cos(b) + p[2] * Math.sin(b), z1 = -p[0] * Math.sin(b) + p[2] * Math.cos(b);
  const y2 = p[1] * Math.cos(a) - z1 * Math.sin(a), z2 = p[1] * Math.sin(a) + z1 * Math.cos(a), f = W3D_PERSP / (W3D_PERSP - z2), oy = 0.04 * H;
  return { x: x1, y: y2, f: f, oy: oy };
}
/* Kamera auf den Griff fahren (Fragen nach Griff, Griff-Farbe und Einbruchschutz): Griff des Gehflügels, sonst der erste sichtbare.
   weich: die Kamera steht schon am Griff (vorige Griff-Frage) und fährt von dort aus weiter, ohne den Umweg über 1:1 */
function w3dFokus(stage, w, o, weich) {
  const reg = W3DS[stage.id]; if (!reg || !o.fokus || !document.body.contains(stage)) return;
  /* Die Fahrt ist für eine Bühne von etwa 262 px Höhe ausgelegt; auf kleineren Bühnen (Abschnittsleiste und Notiz darüber) fährt sie
     entsprechend näher heran, damit der Griff gleich groß zu sehen ist */
  const zm = w3dZoomZustand(stage), H = stage.clientHeight || 262, zz = Math.min(ZOOM_MAX, (o.fokus === 'rc' ? 1.9 : 2.6) * Math.max(1, 262 / H));
  const vorher = { z: zm.z, x: zm.x, y: zm.y };
  zm.z = zz; zm.x = 0; zm.y = 0;
  w3dLayout(stage, reg.w, reg.o);
  const G = stage._griffe || [], g = gehFluegel(w), p = G[g] || G.find((x) => !!x);
  if (!p) { zm.z = 1; w3dLayout(stage, reg.w, reg.o); w3dZoomZeigen(stage); return; }
  const r = w3dProj(stage, p);
  zm.x = -r.x; zm.y = r.oy / r.f - r.oy - r.y;
  w3dPanGrenze(stage, zm);
  /* erst ohne Übergang zurück auf den Ausgangspunkt legen (1:1, bzw. weich: wo die Kamera schon steht), dann sichtbar hinfahren */
  const ziel = { z: zm.z, x: zm.x, y: zm.y };
  if (weich && vorher.z > 1.001) Object.assign(zm, vorher); else { zm.z = 1; zm.x = 0; zm.y = 0; }
  if (Math.abs(zm.z - ziel.z) < 0.01 && Math.abs(zm.x - ziel.x) < 0.5 && Math.abs(zm.y - ziel.y) < 0.5) { w3dLayout(stage, reg.w, reg.o); w3dZoomZeigen(stage); return; } // steht schon richtig
  stage.classList.add('is-zooming'); w3dLayout(stage, reg.w, reg.o); w3dZoomZeigen(stage); void stage.offsetWidth; stage.classList.remove('is-zooming');
  Object.assign(zm, ziel); w3dZoomAnim(stage, true); w3dLayout(stage, reg.w, reg.o); w3dZoomZeigen(stage);
}
/* Knöpfe am Sonnenschutz: Hoch- bzw. Herunterfahren, beim Raffstore Lamellen wenden. Nur Ansicht, nichts wird gespeichert.
   Eine Reihe unten rechts: „Herunterfahren“ mit Text, „Lamellen wenden“ als Symbol (Name als aria-label und title); die Beschriftung
   der Ansicht steht dann oben links neben dem Zoom (app.css, mit-sonne). Auf niedrigen Bühnen nur Symbole, der Zoom in derselben Reihe */
const PFEIL = (hoch) => '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="' + (hoch ? 'M3 10l5-5 5 5' : 'M3 6l5 5 5-5') + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const WENDE_ICO = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 5.5h11M2.5 10.5h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 3l-2.5 2.5L5 8M11 8l2.5 2.5L11 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function w3dSonneKnoepfe(stage, w, o) {
  let k = stage.querySelector('[data-r="sonne"]');
  const raff = o.sonne === 'aussen' && w.sart === 'raffstore', key = o.sonne + '|' + (raff ? 1 : 0);
  if (!o.sonne) { if (k) k.remove(); return; }
  if (!k || k.getAttribute('data-k') !== key) {
    if (k) k.remove();
    stage.insertAdjacentHTML('beforeend', '<div class="w3d-ctl w3d-sonne" data-r="sonne" data-k="' + key + '"><button type="button" class="w3d-knopf" data-w3d="fahren"></button>' + (raff ? '<button type="button" class="w3d-knopf rund" data-w3d="wenden" aria-pressed="false" aria-label="Lamellen wenden" title="Lamellen wenden">' + WENDE_ICO + '</button>' : '') + '</div>');
    k = stage.querySelector('[data-r="sonne"]');
    stage.style.setProperty('--sonne-n', String(raff ? 2 : 1));
  }
  const unten = W3D_BEHANG.stand >= 0.999, f = k.querySelector('[data-w3d="fahren"]'), lab = unten ? 'Hochfahren' : 'Herunterfahren';
  if (f.getAttribute('data-l') !== lab) { f.innerHTML = PFEIL(unten) + '<span>' + lab + '</span>'; f.setAttribute('data-l', lab); f.setAttribute('aria-label', lab); }
  const wd = k.querySelector('[data-w3d="wenden"]'); if (wd) wd.setAttribute('aria-pressed', String(!!W3D_BEHANG.wend));
}
function w3dSonneFahren(stage, was) {
  const reg = W3DS[stage.id]; if (!reg) return;
  if (was === 'fahren') {
    /* Fahren: das Ziel kippt um, die Fahrt läuft bildweise aus dem Stand (w3dFahrt): Endschiene und Lamellen bewegen sich gemeinsam */
    W3D_BEHANG.stand = W3D_BEHANG.stand >= 0.999 ? 0 : 1;
    w3dFahrt(stage);
  } else {
    /* Wenden 0,6 s als Übergang (alle Lamellen zugleich); bei weniger Bewegung springen sie */
    W3D_BEHANG.wend = W3D_BEHANG.wend ? 0 : 1;
    stage.classList.remove('is-wende'); void stage.offsetWidth;
    if (!ruhig()) { stage.classList.add('is-wende'); clearTimeout(stage._ft); stage._ft = setTimeout(() => stage.classList.remove('is-wende'), 1000); }
    w3dLayout(stage, reg.w, reg.o);
  }
  w3dSonneKnoepfe(stage, reg.w, reg.o);
  if (window.Haptik) window.Haptik.tick();
}
/* Fahrt des Behangs: 1,8 s über den ganzen Weg (kürzere Wege entsprechend kürzer, mindestens 0,5 s), weich anlaufend und auslaufend.
   Je Bild wird nur der Sonnenschutz neu gelegt (w3dSonneNeu), ohne CSS-Übergang und ohne Übergang in der WebGL-Bühne (W3D_SOFORT):
   so hängen die Lamellen still, bis das Paket sie aufnimmt oder ablegt, und die Endschiene läuft nie voraus.
   Bei weniger Bewegung springt der Behang ans Ziel. Ein Wechsel der Bühne (neue Frage) bricht die Fahrt ab, der Stand bleibt. */
function w3dFahrt(stage) {
  const reg = W3DS[stage.id], B = W3D_BEHANG, von = B.pos == null ? B.stand : B.pos, zu = B.stand;
  if (FAHRT) { cancelAnimationFrame(FAHRT.raf); FAHRT.stage.classList.remove('is-fahrt'); FAHRT = null; }
  if (ruhig() || Math.abs(zu - von) < 0.001 || !reg) { B.pos = zu; if (reg) w3dLayout(stage, reg.w, reg.o); return; }
  const dauer = Math.max(500, 1800 * Math.abs(zu - von)), t0 = performance.now(), ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  stage.classList.add('is-fahrt');
  const schritt = (now) => {
    const f = Math.min(1, (now - t0) / dauer);
    B.pos = von + (zu - von) * ease(f);
    if (!document.body.contains(stage)) { FAHRT = null; B.pos = zu; return; }
    w3dSonneNeu(stage);
    if (f < 1) FAHRT.raf = requestAnimationFrame(schritt);
    /* is-fahrt bleibt bis zum nächsten Bild: so legen CSS-Modell und WebGL-Bühne auch die letzte Lage ohne Übergang (sonst gliche die
       Bühne den letzten Schritt mit 0,7 s an, wenn Bilder selten kommen) */
    else { FAHRT = null; B.pos = zu; requestAnimationFrame(() => { if (!FAHRT || FAHRT.stage !== stage) stage.classList.remove('is-fahrt'); }); }
  };
  FAHRT = { raf: requestAnimationFrame(schritt), stage: stage };
}
/* Nur Sonnenschutz außen und Sichtschutz innen neu legen (mit den Werten der letzten vollen Lage), ohne Übergänge */
function w3dSonneNeu(stage) {
  const a = stage._sonne; if (!a) return;
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), vorher = W3D_SOFORT; W3D_SOFORT = true;
  w3dSonne(stage, a.w, a.o, a.V, a.s, q); w3dInnen(stage, a.w, a.o, a.V, a.s, q);
  W3D_SOFORT = vorher;
}
/* Kamera drehen, zoomen und verschieben (Finger, Maus, Rad), Flügel antippen, Knöpfe am Modell */
function bindW3D(stage, getOpts) {
  if (!stage || stage.getAttribute('data-bound')) return;
  stage.setAttribute('data-bound', '1');
  const cur = (k, d) => { const v = parseFloat(stage.style.getPropertyValue(k)); return isNaN(v) ? d : v; };
  const ptr = new Map(); let geste = null, tipp = null, rafId = 0;
  const rel = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  const zoomAus = () => { const o = getOpts() || {}; return !!(o.rails || o.noZoom); };
  const scrollt = () => !stage.closest('.scr.fit') && !stage.classList.contains('is-zoom');
  /* Zwei Finger: Abstand und Mitte zu Beginn merken; ab dann folgt der Punkt unter der Anfangsmitte der aktuellen Mitte */
  const pinchStart = () => { const p = Array.from(ptr.values()), zm = w3dZoomZustand(stage); geste = { art: 'pinch', d0: Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) || 1, m0: [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2], z0: zm.z, x0: zm.x, y0: zm.y }; stage.classList.add('is-pinch'); };
  const pinchMove = () => {
    const p = Array.from(ptr.values()); if (p.length < 2 || !geste || geste.art !== 'pinch') return;
    const d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), m = [(p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2], zm = w3dZoomZustand(stage);
    const z = clamp(geste.z0 * d / geste.d0, 1, ZOOM_MAX), k = z / geste.z0;
    zm.z = z; zm.x = m[0] - (geste.m0[0] - geste.x0) * k; zm.y = m[1] - (geste.m0[1] - geste.y0) * k; w3dPanGrenze(stage, zm);
    if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; const r = W3DS[stage.id]; stage.classList.add('is-zooming'); if (r) w3dLayout(stage, r.w, r.o); w3dZoomZeigen(stage); });
  };
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.rail, .w3d-ctl, .w3d-ueber button, .fd-knopf')) return;
    if (e.button != null && e.button > 0) return;
    const o = getOpts() || {}, view = VIEWS[stage.getAttribute('data-view') || 'inside'];
    ptr.set(e.pointerId, rel(e));
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    if (ptr.size === 2 && !zoomAus()) { pinchStart(); return; }
    if (ptr.size > 1) return;
    const zm = w3dZoomZustand(stage), sx = e.clientX, sy = e.clientY, hit = e.target.closest ? e.target.closest('[data-sash]') : null;
    const rx0 = cur('--rx', view[0]), ry0 = cur('--ry', view[1]), x0 = zm.x, y0 = zm.y, nurQuer = e.pointerType === 'touch' && scrollt();
    /* WebGL-Bühne: die Flächen sind unsichtbar, getroffen wird über die Geometrie */
    geste = { art: 'eins', moved: false, glHit: !hit && window.Buehne3D && window.Buehne3D.aktiv(stage) ? window.Buehne3D.treffer(stage, sx, sy) : -1 };
    const g = geste;
    const move = (ev) => {
      if (ptr.has(ev.pointerId)) ptr.set(ev.pointerId, rel(ev));
      if (geste && geste.art === 'pinch') return pinchMove();
      if (geste !== g || ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!g.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      g.moved = true;
      if (zm.z > 1.001) { zm.x = x0 + dx; zm.y = y0 + dy; w3dPanGrenze(stage, zm); stage.classList.add('is-drag'); w3dZoomZeigen(stage); return; }
      stage.classList.add('is-drag');
      const ry = Math.max(view[1] - 40, Math.min(view[1] + 40, ry0 + dx * 0.35)), rx = nurQuer ? rx0 : Math.max(view[0] - 20, Math.min(view[0] + 20, rx0 - dy * 0.25));
      stage.style.setProperty('--rx', rx + 'deg'); stage.style.setProperty('--ry', ry + 'deg');
    };
    const up = (ev) => {
      ptr.delete(ev.pointerId);
      if (geste && geste.art === 'pinch') { if (ptr.size < 2) { stage.classList.remove('is-pinch', 'is-zooming'); geste = { art: 'nach', moved: true }; } if (ptr.size) return; }
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
      stage.classList.remove('is-drag');
      const war = geste; geste = null;
      if (ev.type === 'pointercancel' || !war || war.moved || war !== g) { tipp = null; return; }
      /* Doppeltipp: zweiter Tipp innerhalb von 320 ms nahe am ersten schaltet zwischen 1:1 und 2,5-fach */
      const jetzt = Date.now(), pos = rel(ev);
      if (!zoomAus() && tipp && jetzt - tipp.t < 320 && Math.hypot(pos[0] - tipp.p[0], pos[1] - tipp.p[1]) < 30) { tipp = null; const zz = w3dZoomZustand(stage); w3dZoomSetzen(stage, zz.z > 1.001 ? 1 : 2.5, pos[0], pos[1], true); return; }
      tipp = { t: jetzt, p: pos };
      if (o.onSash && (hit || g.glHit >= 0)) o.onSash(hit ? +hit.getAttribute('data-sash') : g.glHit);
    };
    stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  });
  /* Scrollbare Seiten: senkrecht wischen scrollt die Seite (touch-action: pan-y); zwei Finger und Verschieben im Zoom nicht */
  stage.addEventListener('touchmove', (e) => { if (e.cancelable && !zoomAus() && (e.touches.length > 1 || stage.classList.contains('is-zoom'))) e.preventDefault(); }, { passive: false });
  stage.addEventListener('wheel', (e) => {
    if (zoomAus()) return;
    const zm = w3dZoomZustand(stage);
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const p = rel(e); w3dZoomSetzen(stage, zm.z * Math.exp(-clamp(e.deltaY, -60, 60) * 0.012), p[0], p[1], false); }
    else if (zm.z > 1.001) { e.preventDefault(); zm.x -= e.deltaX; zm.y -= e.deltaY; w3dPanGrenze(stage, zm); w3dZoomAnim(stage, false); w3dZoomZeigen(stage); }
  }, { passive: false });
  stage.addEventListener('click', (e) => {
    const b = e.target.closest('[data-w3d]'); if (!b || !stage.contains(b)) return;
    e.preventDefault(); e.stopPropagation();
    const was = b.getAttribute('data-w3d'), zm = w3dZoomZustand(stage);
    if (was === 'plus') w3dZoomSetzen(stage, Math.min(ZOOM_MAX, zm.z * 1.6), 0, 0, true);
    else if (was === 'minus') w3dZoomSetzen(stage, zm.z / 1.6 < 1.15 ? 1 : zm.z / 1.6, 0, 0, true);
    else if (was === 'eins') w3dZoomSetzen(stage, 1, 0, 0, true);
    else if (was === 'fahren' || was === 'wenden') w3dSonneFahren(stage, was);
    else if (was === 'haus') hausAuf(stage);
  });
}
/* Kamera weich auf eine Ansicht fahren */
function w3dView(stage, v) { if (!stage || !v) return; stage.style.setProperty('--rx', v[0] + 'deg'); stage.style.setProperty('--ry', v[1] + 'deg'); }

/* ---------- KI im Hintergrund: die Einbausituation je Foto ----------
   Eine Anfrage je Foto. Die Aufträge liegen auf dem Server (functions/api/ki.js, Checkliste und Quellen in docs/KI.md):
   gelesen wird alles rund um die Maueröffnung, was der Fensterbauer außer den Maßen wissen muss; das alte Fenster nicht,
   es wird ausgebaut. „einbau“ für ein Fenster, das ersetzt wird, „wand“ für die neue Öffnung. */
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
  const str = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n || 160);
  const liste = (x, n, m) => (Array.isArray(x) ? x : []).map((t) => str(t, m)).filter(Boolean).slice(0, n);
  const zahl = (v) => (v === null || v === undefined || v === '' || !isFinite(+v) ? null : +v);
  /* Fachangaben als feste Werte (functions/api/ki.js): nur bekannte Werte, „unklar“ fällt weg */
  const FACH = { rollladen: ['einbau', 'aufsatz', 'vorbau', 'keiner'], anschlag: ['innen', 'aussen', 'ohne'], fassade: ['putz', 'klinker', 'wdvs', 'holz', 'sonstige'], fensterbank: ['naturstein', 'kunststoff', 'holz', 'fliesen', 'aluminium', 'klinker', 'faserzement', 'beton', 'keine'], bruestung: ['bodentief', 'niedrig', 'normal'], geschoss: ['kg', 'eg', 'og', 'dg'] };
  function readFach(f) {
    const o = {}; if (!f || typeof f !== 'object') return o;
    Object.keys(FACH).forEach((k) => { const v = String(f[k] == null ? '' : f[k]).toLowerCase().trim(); if (FACH[k].indexOf(v) >= 0) o[k] = v; });
    ['erreichbar', 'strom', 'geruest'].forEach((k) => { if (f[k] === true || f[k] === false) o[k] = f[k]; });
    return o;
  }
  /* Antwort der KI lesen: rows [Thema, Befund], chips für den Kunden, hints für Angebot und Montage, pruefen fürs Feinaufmaß,
     fach (feste Werte für den Fensterbauer), verh (Breite : Höhe des Elements laut Foto) */
  function readBefund(j, side) {
    if (!j || typeof j !== 'object') return null;
    if (j.foto_passt === false) return { ok: false, chips: [], rows: [], hints: liste(j.hinweise, 2, 220), pruefen: [], tilt: null, laib: null, conf: null, fach: {}, verh: null };
    const t = zahl(j.neigung_grad), l = zahl(j.laibung_mm), v = zahl(j.verhaeltnis);
    return {
      ok: true,
      chips: liste(j.chips, 6, 40),
      rows: (Array.isArray(j.rows) ? j.rows : []).filter((r) => Array.isArray(r) && r.length >= 2 && str(r[0]) && str(r[1])).map((r) => [str(r[0], 40), str(r[1], 180)]).slice(0, 14),
      hints: liste(j.hinweise, 4, 220),
      pruefen: liste(j.vor_ort, 4, 220),
      tilt: t === null ? null : Math.round(t * 10) / 10,
      laib: side === 'in' && l !== null && l > 0 ? Math.min(600, Math.round(l)) : null,
      conf: zahl(j.sicherheit),
      fach: readFach(j.fach),
      verh: v !== null && v >= 0.2 && v <= 5 ? Math.round(v * 100) / 100 : null
    };
  }
  /* file: das Foto, oder schon verkleinert ({ blob, w, h } aus shrink, wie es auch auf dem Gerät abgelegt wird) */
  async function analyze(file, side, signal, onPart, neu) {
    const img = file && file.blob ? file : await shrink(file), res = { w: img.w, h: img.h, befund: null, errs: {} };
    try {
      res.befund = readBefund(await sample.json('', { images: img.blob, signal: signal, aufgabe: neu ? 'wand' : 'einbau', seite: side, code: INST && S.betrieb ? S.betrieb.code : '' }), side); // Instanz: Code der Planung (functions/api/ki.js)
      if (!res.befund) res.errs.befund = 'error';
    } catch (e) {
      if (e && e.code === 'cancelled') throw e;
      res.errs.befund = e && e.code || 'error';
    }
    return res;
  }
  const ERR = { not_granted: 'Ohne deine Freigabe kann die KI die Fotos nicht ansehen.', rate_limited: 'Gerade laufen zu viele KI-Anfragen. Die Fotos werden später ausgewertet.', refused: 'Die KI hat dieses Foto nicht ausgewertet.', image_rejected: 'Dieses Bild konnte die KI nicht verarbeiten.', images_unavailable: 'In dieser Ansicht kann die KI keine Bilder ansehen.' };
  const errText = (code) => ERR[code] || 'Die KI-Auswertung hat nicht geklappt. Dein Aufmaß geht trotzdem weiter.';
  /* Beispielfotos (Führung, Prüfungen): feste Ergebnisse, so wie die KI die Einbausituation beschreibt */
  const DEMO = {
    in: { w: 1200, h: 1400, errs: {}, befund: { ok: true, tilt: 0.4, laib: 150, conf: 0.8,
      chips: ['Heizkörper darunter', 'Fensterbank Kunststoff', 'Laibung verputzt', 'Steckdose daneben'],
      rows: [['Rollladen', 'Innen kein Kasten zu sehen, außen vermutlich Vorbaukasten (siehe Außenfoto)'], ['Anschlag', 'Blendrahmen sitzt etwa 3 cm hinter der Innenkante, Innenanschlag nicht erkennbar'], ['Laibung', 'Glatt verputzt und gestrichen, keine Risse; nach dem Ausbau ist Beiputz nötig'], ['Fensterbank innen', 'Kunststoff, weiß, Überstand etwa 3 cm über dem Heizkörper, kann vermutlich bleiben'], ['Brüstung', 'Normale Brüstungshöhe, keine Absturzsicherung nötig'], ['Heizung', 'Plattenheizkörper direkt unter dem Fenster, Thermostat rechts'], ['Elektro', 'Steckdose und Lichtschalter rechts neben der Öffnung, außerhalb der Laibung'], ['Hindernisse', 'Gardinenleiste über dem Fenster, sonst frei zugänglich']],
      hints: ['Der Heizkörper ist beim Ausbau im Weg; die Fensterbank vorsichtig lösen oder vorher abnehmen.'],
      pruefen: ['Ist die Fensterbank unter dem Blendrahmen eingemörtelt?'], fach: { rollladen: 'keiner', anschlag: 'ohne', fensterbank: 'kunststoff', bruestung: 'normal', strom: true }, verh: 0.86 } },
    out: { w: 1200, h: 1400, errs: {}, befund: { ok: true, tilt: -0.3, laib: null, conf: 0.75,
      chips: ['Klinkerfassade', 'Vorbaurollladen', 'Fensterbank Aluminium', 'Erdgeschoss'],
      rows: [['Fassade', 'Klinker im Normalformat, vermutlich zweischalig mit Luftschicht'], ['Anschlag außen', 'Mauerwerk steht etwa 3 cm vor dem Blendrahmen (Außenanschlag)'], ['Sonnenschutz', 'Vorbaurollladen über der Öffnung, Führungsschienen seitlich in der Laibung'], ['Fensterbank außen', 'Aluminium mit Gefälle und Tropfkante, Überstand etwa 4 cm, Endstücke vorhanden'], ['Anschlüsse', 'Silikonfuge zur Fensterbank gerissen'], ['Sturz', 'Klinker-Rollschicht ohne Risse'], ['Zugang', 'Erdgeschoss, vom Boden erreichbar, kein Gerüst nötig'], ['Einbruchschutz', 'Leicht erreichbar, RC 2 empfehlen']],
      hints: ['Führungsschienen beim Ausbau lösen; der Vorbaukasten kann vermutlich bleiben.'],
      pruefen: ['Luftschicht oder Kerndämmung hinter dem Klinker klären, davon hängt der Anschluss ab.'], fach: { rollladen: 'vorbau', anschlag: 'aussen', fassade: 'klinker', fensterbank: 'aluminium', geschoss: 'eg', erreichbar: true, geruest: false }, verh: 0.86 } }
  };
  return { init: init, available: available, analyze: analyze, shrink: shrink, errText: errText, DEMO: DEMO };
})();

/* ---------- Zustand ---------- */
/* Adressen aus der aktuellen Seite: läuft so auf pages.dev und auf der eigenen Domain */
const APP_URL = location.href.split('#')[0].split('?')[0];
const PORTAL_URL = new URL('../', APP_URL).href;
const PORTAL_OPEN = PORTAL_URL;
const PORTAL_KURZ = PORTAL_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
const RATGEBER_URL = new URL('ratgeber/fenster-ausmessen/', PORTAL_URL).href, FB_URL = PORTAL_URL + '#fensterbauer';
const STORE = 'aufmass.v1';
/* ---------- Konfigurator-Instanz: eigene Domain eines Fensterbauers (docs/INSTANZEN.md, Bauplan Strang B) ----------
   window.KONFIG.instanz kommt vom Server (/config.js der Instanz); ohne INST ändert sich nichts. Mit INST ist die App immer im Modus
   Kundenlink (S.betrieb gesetzt, Kundenschutz NUR_EIGENES): kostenlos, ohne Konto, ohne Preise, ohne Führung und ohne Pilot-Weg.
   Website-Besucher bekommen ihren Code erst, wenn sie anfangen (POST /api/instanz/start); bis dahin hat S.betrieb keinen Code und
   Speichern, Zwischenstand, Fotos und Fortschritt tun nichts. Der Code der laufenden Planung steht in localStorage
   'instanz.<id8>.aktiv'; ein Code aus #k-… (Signature-Einladung, „auf anderem Gerät weitermachen“) hat Vorrang. Kontakt ist Pflicht,
   nach dem Senden kommen Bestätigung und „Meine Anfrage als PDF“; sobald die Bestätigung verlassen wird, bleiben auf dem Gerät nur
   Nummer, Datum und Betrieb (K1.16). Merkmale nur über INST.m (Pakete.oeffentlich), nie über den Namen des Pakets. */
const INST = window.KONFIG && window.KONFIG.instanz && typeof window.KONFIG.instanz === 'object' && /^[a-z0-9]{8}$/.test(String(window.KONFIG.instanz.id || '')) ? window.KONFIG.instanz : null;
const INST_M = INST ? INST.m || {} : {};
const INST_KEY = INST ? 'instanz.' + INST.id : '';
const INST_WEG = 'Gerade nicht erreichbar. Deine Planung bleibt auf diesem Gerät gespeichert, bitte gleich noch einmal.';
const instLesen = (k) => { try { return localStorage.getItem(INST_KEY + '.' + k) || ''; } catch (e) { return ''; } };
const instSchreiben = (k, v) => { try { if (v) localStorage.setItem(INST_KEY + '.' + k, v); else localStorage.removeItem(INST_KEY + '.' + k); } catch (e) { /* ohne Speicher */ } };
/* Website-Besucher (virtueller Link der Instanz) oder Einladung (Signature, Kontakt kennt der Betrieb schon) */
const instWebsite = () => !!(INST && S.betrieb && (S.betrieb.website || ['website', 'test', 'demo'].indexOf((LK_SERVER[S.betrieb.code] || {}).art) >= 0));
function instanzBetrieb(code) {
  return { code: /^[a-z0-9]{10}$/.test(String(code || '')) ? String(code) : '', name: INST.name || '', kunde: '', runde: 1, du: !!INST.du, hinweis: '', auftritt: null, website: true };
}
/* Profil der Startansicht: Auftritt vom Server, Firmenfarbe nur mit Merkmal farbe, Logo nur mit Merkmal logo; Telefon und E-Mail des
   Betriebs, wenn die Startansicht keine zeigt (wie die Seite „gerade nicht erreichbar“) */
function instProfil(roh) {
  const E = window.Einladung, p = E.profil(Object.assign({}, INST.auftritt || {}, roh || {})), k = INST.kontakt || {};
  p.col = INST_M.farbe ? E.hexFarbe(INST.farbe) || p.col : '';
  p.logoUrl = INST_M.logo ? String(INST.logo || '') : '';
  if (!p.tel && !p.mail) { p.tel = String(k.tel || '').slice(0, 40); p.mail = String(k.mail || '').slice(0, 120); }
  return p;
}
/* Ausgabe der Instanz für Einladung.html/kopf/kontakt/fuss */
function instOpt(o) {
  const st = INST.start && typeof INST.start === 'object' ? INST.start : {};
  return Object.assign({ kz: INST_M.kennzeichnung, website: instWebsite(), kopie: !!INST_M.kopieKunde, start: INST_M.startansicht ? st : {}, bilder: INST_M.fotos > 0 && Array.isArray(st.bilder) ? st.bilder : [], standardBild: true, ohneKopf: true }, o || {});
}
/* Code der Planung holen (einmal, auch bei Doppeltipp); danach gehört der Stand auf diesem Gerät zu diesem Code */
let INST_START = null;
function instanzStart() {
  if (!INST || !S.betrieb) return Promise.resolve(false);
  if (S.betrieb.code) return Promise.resolve(true);
  if (INST_START) return INST_START;
  INST_START = (async () => {
    try {
      const r = await fetch('/api/instanz/start', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: '{}' });
      const j = await r.json().catch(() => null);
      if (instZuPruefen(r, j)) return false;
      if (!r.ok || !j || !j.ok || !/^[a-z0-9]{10}$/.test(String(j.code || ''))) { toast((j && j.fehler) || INST_WEG); return false; }
      instanzCodeSetzen(j.code, j);
      return true;
    } catch (e) { toast(INST_WEG); return false; } finally { INST_START = null; }
  })();
  return INST_START;
}
function instanzCodeSetzen(code, j) {
  instSchreiben('aktiv', code);
  S.betrieb = Object.assign(instanzBetrieb(code), { name: (j && j.betrieb) || INST.name });
  LK_SERVER[code] = { auftritt: window.Einladung ? window.Einladung.profil(Object.assign({}, (j && j.auftritt) || INST.auftritt || {})) : null, du: j && typeof j.du === 'boolean' ? j.du : !!INST.du, hinweis: '', art: 'website' };
  clearTimeout(S.sync.timer); clearTimeout(S.sync.pruefTimer);
  const bekannt = S.sync.bekannt || [], geloescht = S.sync.geloescht || {};
  S.sync = syncNeu(); S.sync.geladen = true; S.sync.ok = !!SERVER.daten; S.sync.bekannt = bekannt; S.sync.geloescht = geloescht; // neu: nichts zu holen
  persist(); // was schon auf dem Gerät liegt (nach „still neu“), geht unter dem neuen Code zum Server
}
/* Der Server kennt den Code nicht mehr (Zwischenstand ohne Fenster nach 24 Stunden, ohne Änderung nach 30 Tagen weg): still neu
   beginnen; was auf diesem Gerät liegt, bleibt und gehört danach zum neuen Code */
function instanzStillNeu() {
  const alt = S.betrieb ? S.betrieb.code : '', hatDaten = S.windows.length > 0 || !!entwurfLesen();
  const entwurf = alt ? (() => { try { return localStorage.getItem('aufmass.k.' + alt + '.entwurf'); } catch (e) { return null; } })() : null;
  try { if (alt) { localStorage.removeItem('aufmass.k.' + alt); localStorage.removeItem('aufmass.k.' + alt + '.entwurf'); } } catch (e) { /* ok */ }
  if (instLesen('aktiv') === alt) instSchreiben('aktiv', '');
  S.betrieb = instanzBetrieb(''); S.linkZu = ''; S.linkZuText = ''; S.linkStatus = '';
  if (!hatDaten) { S.windows = []; render(); return; }
  instanzStart().then((ok) => { if (ok && entwurf) { try { localStorage.setItem(linkKey() + '.entwurf', entwurf); } catch (e) { /* ok */ } } render(); });
}
/* Liste der gesendeten Anfragen auf diesem Gerät: nur Nummer und Datum (K1.16) */
function instGesendetListe() { try { const l = JSON.parse(instLesen('gesendet') || '[]'); return Array.isArray(l) ? l.filter((x) => x && typeof x === 'object').slice(0, 10) : []; } catch (e) { return []; } }
function instGesendetMerken(nr, when, art) {
  const l = instGesendetListe().filter((x) => x.nr !== nr);
  l.unshift({ nr: String(nr || ''), when: Number(when) || Date.now(), test: art === 'test' });
  instSchreiben('gesendet', JSON.stringify(l.slice(0, 10)));
}
/* Nach dem Senden, sobald die Bestätigung verlassen ist: Fenster, Angaben, Kontakt, Fotos und Zwischenstand von diesem Gerät löschen;
   es bleiben Nummer, Datum und Betrieb (gerät geteilt, Kunde am fremden Rechner) */
function instanzKuerzen() {
  if (!INST || !S.betrieb || !S.sent || S.sent.kurz) return;
  const ids = new Set(); S.windows.forEach((w) => bilderVon(w).forEach((id) => ids.add(id))); bilderVon(S.win).forEach((id) => ids.add(id));
  if (ids.size) Fotos.weg(Array.from(ids));
  try { localStorage.removeItem(linkKey() + '.entwurf'); } catch (e) { /* ok */ }
  ['in', 'out'].forEach((k) => { const p = S.photos[k]; if (p && p.url && !p.demo) { try { URL.revokeObjectURL(p.url); } catch (e) { /* ok */ } } });
  S.sent = { when: S.sent.when, nr: S.sent.nr || '', runde: S.sent.runde || 1, art: S.sent.art || '', uebertragen: true, kurz: true, anderswo: !!S.sent.anderswo };
  S.windows = []; S.proj = Object.assign({}, PROJ0); S.win = baseWin(); S.editIdx = -1; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.nb = null; S.angelegt = 0;
  S.sync.bekannt = []; S.sync.geloescht = {};
  lokalSpeichern();
}
/* „Weitere Anfrage starten“: neuer Code, die gesendete bleibt beim Betrieb */
function instanzWeitere() {
  instanzKuerzen();
  const alt = S.betrieb && S.betrieb.code;
  if (alt) { try { localStorage.removeItem('aufmass.k.' + alt); } catch (e) { /* ok */ } }
  instSchreiben('aktiv', '');
  if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ } }
  S.betrieb = instanzBetrieb(''); loadLink();
  return instanzStart().then((ok) => { if (ok) newWin(); else go('home'); });
}
/* „Auf diesem Gerät vergessen“: auch Nummer und Datum weg */
function instanzVergessen() {
  instanzKuerzen();
  const alt = S.betrieb && S.betrieb.code;
  if (alt) { try { localStorage.removeItem('aufmass.k.' + alt); localStorage.removeItem('aufmass.k.' + alt + '.entwurf'); } catch (e) { /* ok */ } }
  instSchreiben('aktiv', ''); instSchreiben('gesendet', '');
  if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ } }
  S.betrieb = instanzBetrieb(''); loadLink(); S.instGeraet = false;
  go('home'); toast('Auf diesem Gerät vergessen.');
}
const PROJ0 = { gebaeude: 'efh', baujahr: '', total: '', zeit: '3m', budget: 'b0', foerd: false, foerdweg: '', name: '', ort: '', tel: '', mail: '', erreich: '' }; // erreich ohne Vorwahl: nur was der Kunde selbst tippt, steht auf dem Blatt
const S = {
  screen: 'home', dir: 'fwd', betrieb: null, windows: [], win: baseWin(), editIdx: -1,
  photos: { in: null, out: null }, ai: { in: null, out: null }, aiOk: null,
  mess: { step: 0, cur: '', msg: null, ack: false }, rest: { i: 0, cur: '', msg: null }, openSash: -1,
  selSash: 0, selBar: null, side: 'aussen', q: null, gloss: null, glossIndex: false, toast: '',
  proj: Object.assign({}, PROJ0),
  sent: null, angelegt: 0, stand: 0, projTs: 0, konto: { liste: null, abgelaufen: '' }, sichern: null,
  /* Zwischenstand beim Kundenlink (Server): fp = zuletzt gemerkter Stand, offen = noch nicht beim Server, ok = letzter Abgleich
     geklappt, p = laufender Versand */
  sync: syncNeu()
};
/* Uhr: Abstand der Uhr dieses Geräts zur Zeit des Servers (aus jeder Antwort des Zwischenstands), damit Zeitpunkte von Fenstern,
   Angaben und Löschungen vergleichbar sind, auch wenn die Uhr eines Geräts vor- oder nachgeht */
let UHR = (() => { try { return Number(localStorage.getItem('aufmass.uhr')) || 0; } catch (e) { return 0; } })();
const zeit = () => Date.now() + UHR;
function uhrStellen(serverJetzt, vorher, nachher) {
  const sj = Number(serverJetzt); if (!(sj > 0)) return;
  UHR = Math.round(sj - (vorher + nachher) / 2); if (!vorschau()) { try { localStorage.setItem('aufmass.uhr', String(UHR)); } catch (e) { /* ok */ } }
}
function syncNeu() { return { fp: '', pfp: '', offen: false, laeuft: false, wieder: false, timer: null, aus: false, voll: false, geladen: false, bekannt: [], geloescht: {}, ok: false, zuletzt: 0, p: null, pruefTimer: null, nochmal: 0 }; }
/* Vorschau für den Betrieb („Als Kunde öffnen“ im Portal, ?vorschau=1): zeigt den Link wie beim Kunden, liest und schreibt aber
   keinen Zwischenstand, speichert nichts im Browser, meldet kein Öffnen (die 60 Tage beginnen nicht) und sendet nichts. Gilt nur
   in einem Browser, in dem das Konto des Betriebs mit diesem Link liegt (Betriebsbereich, gleiche Adresse); bekommt ein Kunde die
   Adresse der Vorschau, arbeitet er ganz normal, und der Zusatz verschwindet aus der Adresse. */
const VORSCHAU_URL = (() => { try { return new URLSearchParams(location.search).get('vorschau') === '1'; } catch (e) { return false; } })();
let VORSCHAU = false;
function linkImBetrieb(code) { try { const o = JSON.parse(localStorage.getItem('aufmass.portal.v1') || 'null'), acc = (o && o.acc) || {}; return Object.keys(acc).some((k) => ((acc[k] || {}).links || []).some((l) => l && l.code === code)); } catch (e) { return false; } }
function vorschauPruefen(b) {
  VORSCHAU = VORSCHAU_URL && !!b && linkImBetrieb(b.code);
  if (VORSCHAU_URL && !VORSCHAU && b) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* ok */ } }
}
const vorschau = () => VORSCHAU && !!S.betrieb;
/* Kundenlink: eigenes Projekt je Code, getrennt vom eigenen Projekt; Senden geht einmal */
const linkKey = () => 'aufmass.k.' + (S.betrieb ? S.betrieb.code : '');
/* Passwörter nie im Browser speichern */
function kaufSicher() { return S.kauf ? Object.assign({}, S.kauf, { pw: '' }) : S.kauf; }
function lokalSpeichern() {
  const b = new Set(S.sync.bekannt || []); S.windows.forEach((w) => { if (w.wid) b.add(w.wid); }); S.sync.bekannt = Array.from(b).slice(-200);
  if (vorschau()) return false;
  if (S.betrieb && !S.betrieb.code) return false; // Instanz ohne Code: noch nichts angefangen
  try {
    if (S.betrieb) localStorage.setItem(linkKey(), JSON.stringify({ windows: S.windows, proj: S.proj, sent: S.sent, nb: S.nb || null, kauf: kaufSicher(), name: S.betrieb.name, angelegt: angelegt(), stand: S.stand || 0, projTs: S.projTs || 0, bekannt: S.sync.bekannt, geloescht: S.sync.geloescht, offen: !!S.sync.offen }));
    else {
      const daten = JSON.stringify({ windows: S.windows, proj: S.proj, kauf: kaufSicher(), teil: S.teil || null, angelegt: angelegt(), stand: S.stand || 0, projTs: S.projTs || 0, bekannt: S.sync.bekannt, geloescht: S.sync.geloescht, offen: !!S.sync.offen, voll: !!S.sync.voll });
      try { localStorage.setItem(STORE, daten); } catch (e) { platzMachen(); localStorage.setItem(STORE, daten); } // voll: zuerst beiseitegelegte Bilder anderer Aufmaße opfern
    }
    return true;
  } catch (e) { return false; } // ohne Speicher weiter
}
/* Speichern: im Browser und beim Kundenlink zusätzlich als Zwischenstand auf dem Server (kurz gesammelt; die Fotos gehen getrennt, fotosHochladen) */
function persist() {
  if (INST && S.betrieb && !S.betrieb.code) { if (S.windows.length) instanzStart(); return; } // Instanz: erst mit Code (instanzStart speichert dann)
  entwurfStand(); // auch als Gast: Stand und „offen“ merken, damit nach dem Sichern alles hochgeht
  lokalSpeichern();
  entwurfPlanen();
}
function normProj(p) { if (S.betrieb && !INST) p.erreich = ''; /* Instanz: die Website fragt danach (Kontakt) */ /* der Kundenlink fragt nicht nach der Erreichbarkeit; ältere Entwürfe tragen noch die Vorwahl */ if (p.zeit === 'sofort') p.zeit = 'asap'; if (p.zeit === 'offen') p.zeit = '12m'; if (p.gebaeude === 'altbau') p.gebaeude = 'efh'; return p; }
/* Ältere Aufmaße kennen nur roll (Rollladen): daraus wird der Sonnenschutz außen abgeleitet */
function altAngleichen(w) { if ((!w.sart || w.sart === 'keiner') && (w.roll === 'aufsatz' || w.roll === 'vorbau')) w.sart = 'rollladen'; else if ((!w.sart || w.sart === 'keiner') && w.roll === 'behalten') w.sart = 'behalten'; return w; }
function takeWindows(arr) {
  const jetzt = zeit(); let nachgetragen = false;
  S.windows = arr.map((x) => altAngleichen(Object.assign(baseWin(), x)));
  S.windows.forEach((x) => { (x.bars || []).forEach((b) => { const m = /^b(\d+)/.exec(String(b.id)); if (m && +m[1] >= BID) BID = +m[1] + 1; }); if (!x.wid) { x.wid = neueWid(); nachgetragen = true; } if (!(Number(x.t0) > 0)) { x.t0 = jetzt; nachgetragen = true; } x.aend = Number(x.aend) || 0; x.ts = Number(x.ts) || 0; });
  return nachgetragen;
}
function loadLink() {
  S.windows = []; S.proj = Object.assign({}, PROJ0); S.sent = null; S.kauf = null; S.editIdx = -1; S.win = baseWin();
  S.nb = null; S.angelegt = 0; S.stand = 0; S.projTs = 0; S.linkZu = ''; S.linkZuText = ''; S.linkStatus = ''; clearTimeout(S.sync.timer); clearTimeout(S.sync.pruefTimer);
  S.sync = syncNeu();
  let nach = false;
  try { const raw = vorschau() ? null : localStorage.getItem(linkKey()); const o = raw ? JSON.parse(raw) : null; if (o && Array.isArray(o.windows)) nach = takeWindows(o.windows); if (o && o.proj) normProj(Object.assign(S.proj, o.proj)); if (o && o.sent) S.sent = o.sent; if (o && o.kauf) S.kauf = o.kauf; if (o && o.nb) S.nb = o.nb; if (o) { S.angelegt = Number(o.angelegt) || 0; S.stand = Number(o.stand) || 0; S.sync.bekannt = Array.isArray(o.bekannt) ? o.bekannt.slice(-200) : []; S.sync.offen = !!o.offen; S.projTs = Number(o.projTs) || 0; if (o.geloescht && typeof o.geloescht === 'object') S.sync.geloescht = o.geloescht; else if (o.offen && Array.isArray(o.bekannt)) { const da = new Set(S.windows.map((w) => w.wid)); o.bekannt.forEach((id) => { if (id && !da.has(id)) S.sync.geloescht[id] = Number(o.stand) || zeit(); }); } } } catch (e) { /* ok */ }
  tiefeVorgabe(); // Planungstiefe des Betriebs (Link im Pilotbetrieb), solange der Kunde keine gewählt hat
  S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj); if (nach) lokalSpeichern(); // ältere Aufmaße: nachgetragene Kennungen gleich merken
  /* Der Betrieb hat um Nachbesserung gebeten (Runde im Link höher als die gesendete): wieder bearbeitbar, Angaben bleiben. Auch wenn
     eine frühere, zurückgezogene Anfrage derselben Runde hier noch liegt */
  const r = S.betrieb && S.betrieb.runde ? S.betrieb.runde : 1;
  if (r > 1 && (!S.sent || r > (S.sent.runde || 1)) && !(S.nb && S.nb.runde === r && !S.sent)) {
    if (!(S.nb && S.nb.runde === r)) S.nb = { runde: r, vorher: S.sent || null, teil: !S.windows.length };
    S.sent = null; persist();
  }
}
function loadOwn() { S.windows = []; S.proj = Object.assign({}, PROJ0); S.sent = null; S.kauf = null; S.editIdx = -1; S.win = baseWin(); S.angelegt = 0; S.stand = 0; S.projTs = 0; S.linkZu = ''; S.linkZuText = ''; S.nb = null; clearTimeout(S.sync.timer); clearTimeout(S.sync.pruefTimer); S.sync = syncNeu(); restore(); }
function restore() {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return;
    const o = JSON.parse(raw);
    const nach = o && Array.isArray(o.windows) ? takeWindows(o.windows) : false;
    if (o && o.proj) normProj(Object.assign(S.proj, o.proj));
    if (o && o.kauf) S.kauf = o.kauf;
    S.teil = o && o.teil ? o.teil : null;
    S.angelegt = o ? Number(o.angelegt) || 0 : 0;
    if (o) { S.stand = Number(o.stand) || 0; S.projTs = Number(o.projTs) || 0; S.sync.bekannt = Array.isArray(o.bekannt) ? o.bekannt.slice(-200) : []; if (o.geloescht && typeof o.geloescht === 'object') S.sync.geloescht = o.geloescht; S.sync.offen = o.offen === undefined ? S.windows.length > 0 : !!o.offen; S.sync.voll = !!o.voll; } // ältere Speicher: alles gilt als noch nicht gesichert
    S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj);
    if (nach) lokalSpeichern(); // sonst begänne die freie Woche älterer Fenster bei jedem Laden neu
  } catch (e) { /* ok */ }
}
/* Kundenlink: #k-<code>-<slug>.<b64 Betrieb>.<b64 Kunde>[.<b64 Profil>][~<Runde>]. Das Profil (Anrede, im Pilotbetrieb auch
   Ansprechpartner, Telefon, eigene Begrüßung, Hinweis der Nachbesserung) kam mit der Einladungsseite dazu (einladung.js linkTeil);
   Links ohne Profil gelten wie bisher (du, Name aus dem Link) */
function readHash() {
  const m = /^#k-([a-z0-9]{3,12})(?:-([A-Za-z0-9_]*))?(?:\.([A-Za-z0-9_-]+))?(?:\.([A-Za-z0-9_-]*))?(?:\.([A-Za-z0-9_-]+))?(?:~(\d{1,2}))?$/.exec(location.hash || '');
  if (!m) return null;
  const dec = (v) => { if (!v) return ''; try { const b = v.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); } catch (e) { return ''; } };
  const clean = (t) => String(t || '').replace(/[<>"]/g, '').trim().slice(0, 60);
  const pr = m[5] && window.Einladung ? window.Einladung.linkLesen(m[5]) : null;
  return { code: m[1].toLowerCase(), name: clean(dec(m[3]) || (m[2] || '').replace(/_/g, ' ')), kunde: clean(dec(m[4])), runde: m[6] ? +m[6] : 1, du: pr ? pr.du : undefined, hinweis: pr ? pr.hinweis : '', auftritt: pr ? pr.profil : null };
}
const slug = (t) => String(t || '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
/* ---------- Rendern ---------- */
const $app = () => document.getElementById('app');
let lastScreen = null, toastTimer = null;
/* Felder und Knöpfe: Ein Feld übernimmt seinen Wert schon beim Tippen. Neu gezeichnet wird nach dem Verlassen („change“) erst, wenn
   keine Maus und kein Finger mehr auf dem Bildschirm liegt und kein anderes Feld den Fokus hat. Sonst tauscht das Neuzeichnen den
   Knopf unter dem Finger aus und der erste Tipp auf „Weiter“, „Speichern“ oder „Senden“ geht verloren, bzw. das nächste Feld verliert
   die Tastatur. render() selbst erledigt ein ausstehendes Neuzeichnen. */
let DRUCK = 0, NACHZEICHNEN = false, nachzeichnenTimer = 0;
const textFeld = (el) => !!(el && el.matches && el.matches('textarea, select, input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="range"])') && $app().contains(el));
function nachAenderung() { NACHZEICHNEN = true; clearTimeout(nachzeichnenTimer); nachzeichnenTimer = setTimeout(nachzeichnen, 0); }
function nachzeichnen() {
  clearTimeout(nachzeichnenTimer);
  if (!NACHZEICHNEN) return;
  if (DRUCK && Date.now() - DRUCK < 4000) return; // gedrückt: nach dem Loslassen (der Tipp kommt vorher an)
  DRUCK = 0;
  if (textFeld(document.activeElement)) return; // ein anderes Feld ist dran: beim Verlassen nachholen (focusout)
  render();
}
/* Fokus übers Neuzeichnen retten: dasselbe Feld bzw. derselbe Knopf (gleiche Kennung oder gleiche data-Angaben), samt Schreibmarke */
const FOKUS_ATTR = ['data-act', 'data-in', 'data-f', 'data-v', 'data-k', 'data-i'];
function fokusMerken(root) {
  const el = document.activeElement;
  if (!el || el === document.body || !root.contains(el)) return null;
  const sel = el.id ? '#' + CSS.escape(el.id) : el.tagName.toLowerCase() + FOKUS_ATTR.filter((n) => el.hasAttribute(n)).map((n) => '[' + n + '="' + CSS.escape(el.getAttribute(n)) + '"]').join('');
  if (!el.id && sel.indexOf('[') < 0) return null;
  const f = { sel: sel, i: Math.max(0, Array.from(root.querySelectorAll(sel)).indexOf(el)), blatt: !!el.closest('.sheet') };
  try { if (typeof el.selectionStart === 'number') { f.s = el.selectionStart; f.e = el.selectionEnd; } } catch (e) { /* ohne Schreibmarke */ }
  return f;
}
function fokusZurueck(root, f) {
  const alle = root.querySelectorAll(f.sel), el = alle[f.i] || alle[0];
  if (!el || el === document.activeElement || el.disabled || el.closest('[hidden], [inert]') || (f.blatt && !el.closest('.sheet'))) return; // aus einem geschlossenen Blatt nicht auf einen gleichnamigen Knopf dahinter
  try { el.focus({ preventScroll: true }); if (f.s != null && el.setSelectionRange) el.setSelectionRange(f.s, f.e); } catch (e) { /* ok */ }
}
/* Modale Blätter (Übersicht, Notiz, Verlassen, Begriffe, Ohne Foto, Foto groß): Beim Öffnen kommt der Fokus ins Blatt (Überschrift mit
   tabindex=-1, sonst das erste Ziel), Tab bleibt im Blatt (keydown in boot), beim Schließen geht er an den Knopf zurück, der das
   Blatt geöffnet hat. Wechselt ein Blatt ins nächste (Übersicht → Verlassen), bleibt der erste Auslöser gemerkt */
let BLATT = null;
const fokusZiele = (el) => Array.from(el.querySelectorAll('button, [href], input:not([type="hidden"]), textarea, select, summary, [tabindex]:not([tabindex="-1"])')).filter((z) => !z.disabled && !z.hidden && z.offsetParent !== null && !z.closest('[hidden]'));
function blattFokus(root, vorher, neu) {
  const sh = root.querySelector('.sheet[aria-modal="true"]'), key = sh ? (sh.getAttribute('aria-labelledby') || sh.getAttribute('aria-label') || sh.className) : null;
  if (neu && !key) { BLATT = null; return; }
  if (key) {
    if (!BLATT || BLATT.key !== key) {
      BLATT = { key: key, ausloeser: BLATT ? BLATT.ausloeser : vorher };
      if (!sh.contains(document.activeElement)) { const ziel = sh.querySelector('h2[tabindex="-1"]') || fokusZiele(sh)[0]; if (ziel) try { ziel.focus({ preventScroll: true }); } catch (e) { /* ok */ } }
    }
    return;
  }
  if (BLATT) { const a = BLATT.ausloeser; BLATT = null; const da = document.activeElement; if (a && (!da || da === document.body || !root.contains(da))) fokusZurueck(root, a); }
}
function setW(patch) { Object.assign(S.win, patch); render(); }
function setP(patch) { Object.assign(S.proj, patch); persist(); render(); }
/* Kundenschutz: Wer über den Link eines Betriebs misst, bekommt von eeziframes weder das Aufmaßblatt noch einen Code, kann nichts
   kaufen und kein Konto anlegen. Diese Bildschirme gibt es im Link nicht; dort zeigt die App „Prüfen und senden“ (blatt). */
const NUR_EIGENES = { teilen: 1, datei: 1, kasse: 1, gekauft: 1, konto: 1, sichern: 1, meinkonto: 1 };
function go(screen, dir) {
  if (S.betrieb && NUR_EIGENES[screen]) screen = 'blatt';
  S.sendeFrage = false; // Rückfrage vor dem Senden gilt nur auf „Prüfen“
  if (screen === 'zeichnen' && !planFoto()) { toast('Erst ein Foto der Stelle'); screen = 'fotos'; }
  if (S.screen === 'zeichnen' && screen !== 'zeichnen' && S.win.plan && !S.win.plan.bild) planBildErzeugen(S.win).then(() => { if (S.editIdx >= 0) persist(); });
  if (screen === 'planmasse') planVorgabe(S.win);
  /* Einstieg merken: „Wünsche ändern“ bzw. „Maße ändern“ auf der Fensterseite. Zurück auf diesem Schritt (Knopf oder Taste des
     Browsers bzw. Telefons) führt dann zur Fensterseite zurück, nicht durch alle Messschritte (einstiegHier) */
  if (S.screen === 'fertig' && S.editIdx >= 0 && (screen === 'ergebnis' || screen === 'frage')) S.einstieg = { bei: screen, i: S.editIdx };
  else if (stepsFor(S.win).indexOf(screen) < 0) S.einstieg = null;
  S.dir = dir || 'fwd'; S.screen = screen; S.gloss = null; S.glossIndex = false; S.selBar = null; S.neuFrage = false; S.ohneFotoFrage = false; S.wohin = false; S.verlassen = null; S.fotoGross = null; S.notiz = null;
  if (screen === 'rest') { const first = REST.findIndex((r) => !num(S.win.mo[r.k])); S.rest = { i: first < 0 ? 4 : first, cur: '', msg: null, pad: false }; }
  if (screen !== 'frage') S.openSash = -1;
  /* Flügelzahl nach der Breite vorschlagen: Fenster bis 1 m einflügelig, ab 2 m dreiteilig; Balkontür ab 1,3 m zwei Flügel (Stulp) */
  const vorschlag = (art, ew) => (art === 'balkon' ? (ew >= 1300 ? '2s' : '1') : ew && ew < 1000 ? '1' : ew >= 2000 ? '3' : '2p');
  if (screen === 'frage' && !S.win.e_teilung && ((S.win.art || 'fenster') === 'fenster' || S.win.art === 'balkon')) { const ew = derive(S.win).elW || 0, t = vorschlag(S.win.art || 'fenster', ew); if (t !== S.win.teilung) { S.win.teilung = t; S.win.sashes = sashesFor(t); if (S.win.seiten) seitenAnwenden(S.win); S.win.bars = S.win.preset !== 'keine' && S.win.preset !== 'eigene' ? presetBars(S.win.preset, S.win.sashes.length) : S.win.bars.filter((b) => b.s < S.win.sashes.length); S.selSash = 0; } }
  render(true);
}
function toast(msg) { S.toast = msg; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = ''; render(); }, 1900 + Math.min(4000, Math.max(0, String(msg || '').length - 40) * 45)); } // längere Meldungen bleiben länger stehen (bis drei Zeilen)
function render(fresh) {
  if (NEU_LADEN && RUHIG.includes(S.screen)) { location.reload(); return; } // Anmeldung in einem anderen Tab geändert (siehe unten)
  NACHZEICHNEN = false; clearTimeout(nachzeichnenTimer);
  if (INST && S.sent && !S.sent.kurz && S.screen !== 'gesendet') instanzKuerzen(); // Bestätigung verlassen: nur Nummer und Datum bleiben
  const root = $app(), scroller = root.querySelector('.scroll'), keep = !fresh && scroller ? scroller.scrollTop : 0, fokus = fresh ? null : fokusMerken(root);
  const view = SCREENS[S.screen] ? SCREENS[S.screen]() : SCREENS.home();
  /* Angefangenes Fenster: „Fortsetzen“ auf der Startseite, über der Liste */
  /* Auf der Einladungsseite (Kundenlink, noch keine Liste) steht der Betrieb vorn: die Karte kommt direkt unter den Absender */
  if (S.screen === 'home' && view.html) { const ek = entwurfKarte(); if (ek) { const li = view.html.indexOf('<section class="sec liste"'), ki = view.html.indexOf('<p class="eyebrow kicker">'), ein = view.html.indexOf('ein-start-in'); view.html = li >= 0 ? view.html.slice(0, li) + ek + view.html.slice(li) : ein >= 0 && ki > ein ? view.html.slice(0, ki) + ek + view.html.slice(ki) : ek + view.html; } }
  const STEPS = stepsFor(S.win), si = STEPS.indexOf(S.screen), wiz = si >= 0;
  const qShare = S.screen === 'frage' && view.qpos ? view.qpos : 1;
  const title = wiz ? (S.editIdx >= 0 ? (S.win.name || artName(S.win)) : (istTuer(S.win) ? 'Neue Tür' : S.win.art === 'fest' ? 'Neue Verglasung' : 'Neues Fenster')) : ({ fertig: '', anfrage: 'Angaben', anfrage2: 'Angaben', anfrage3: 'Angaben', blatt: !S.betrieb ? 'Aufmaßblatt' : (S.sent ? (PILOT ? 'Senden' : 'Gesendet') : 'Prüfen'), gesendet: '', teilen: '', kasse: 'Kasse', konto: 'Kasse', sichern: 'Konto', meinkonto: 'Konto', linkanmelden: 'Konto', tour: 'Führung' }[S.screen] || '');
  const tourP = S.screen === 'tour' && S.tour ? (S.tour.i + 1) / TOUR.length : 0;
  const prevStage = root.querySelector('#w3d'), prevSig = prevStage ? prevStage.getAttribute('data-sig') : null, prevTop = prevStage ? prevStage.getBoundingClientRect().top : null;
  const prevCam = prevStage && prevStage.querySelector('.w3d-cam'), prevCamY = prevCam ? prevCam.getBoundingClientRect().top : null;
  const backLabel = view.back ? view.back[0] : '';
  let h = '<header class="hdr"><div class="hdr-row">';
  /* Logo: im eigenen Aufmaß ein Link zur Startseite der Website; im Kundenlink steht der Betrieb vorn (Einladungsseite), eeziframes klein unten */
  h += S.screen === 'home' ? (S.betrieb ? (INST ? instKopf() : '<span></span>') : '<a class="hdr-logo" href="' + PORTAL_URL + '" aria-label="eeziframes, zur Startseite">' + LOGO(30) + '<span class="hdr-name">' + WM() + '</span></a>')
    : (view.back ? '<button type="button" class="hdr-btn" data-act="' + (view.back[2] || 'back') + '">' + (view.back[1] === 'tour-ende' ? '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>' : '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>') + '<span>' + esc(backLabel) + '</span></button>' : INST && S.betrieb ? instKopf() : '<span></span>'); // Instanz: ohne Zurück (Bestätigung) Zeichen und Name
  h += '<span class="hdr-title">' + esc(title) + '</span>';
  /* rechts: Übersicht (Schritte, Fenster, Liste, Startseite) auf allen Bildschirmen außer der Startseite und der Führung, dazu die Begriffe */
  const wo = S.screen !== 'home' && S.screen !== 'tour';
  h += '<span class="hdr-r' + (wo ? ' zwei' : '') + '">' + (wo ? '<button type="button" class="hdr-btn hdr-wo" data-act="wohin" aria-label="Übersicht: Schritte, Fenster und Startseite"><svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true"><path d="M3.5 5h15M3.5 11h15M3.5 17h15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg><span>Übersicht</span></button>' : '') + '<button type="button" class="hdr-btn hdr-gl" data-act="gindex" aria-label="Begriffe"><svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 4.5C3 3.7 3.7 3 4.5 3H11v16H4.5c-.8 0-1.5.5-1.5 1.2zM19 4.5c0-.8-.7-1.5-1.5-1.5H11v16h6.5c.8 0 1.5.5 1.5 1.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg><span>Begriffe</span></button></span></div>';
  if (wiz) h += '<div class="prog"><div style="width: ' + ((si + qShare) / STEPS.length * 100) + '%"></div></div>';
  else if (tourP) h += '<div class="prog" role="progressbar" aria-label="Führung" aria-valuemin="1" aria-valuemax="' + TOUR.length + '" aria-valuenow="' + (S.tour.i + 1) + '"><div style="width: ' + (tourP * 100) + '%"></div></div>';
  h += '</header>';
  const recht = !view.fit && view.html.indexOf('foot-links recht') < 0 ? rechtLinks() : '';
  const band = INST && INST.vorschau && !view.fit ? '<div class="inst-vorschau" role="note"><b>Vorschau</b> – noch nicht öffentlich. Was hier gesendet wird, ist eine Testanfrage.</div>' : '';
  /* Die Leiste steht überall wie am Start: klein und mittig am Ende des Inhalts, nicht als Band am unteren Rand (inline: false hebt das auf) */
  if (view.bar && view.bar.inline !== false) view.bar.inline = true;
  const barH = !view.bar ? '' : '<div class="bb' + (view.bar.inline ? ' bb-inline' : '') + '">' + (view.bar.zurueck ? '<button type="button" class="btn ghost bb-zurueck" data-act="back" aria-label="' + esc('Zurück' + (backLabel ? ': ' + backLabel : '')) + '">' + PFEIL_L + '</button>' : '') + (view.bar.sec ? '<button type="button" class="btn ghost" data-act="' + view.bar.secAct + '">' + esc(view.bar.sec) + '</button>' : '') + '<button type="button" class="btn ' + (view.bar.ghost ? 'ghost' : 'primary') + '" data-act="' + view.bar.act + '"' + (view.bar.v ? ' data-v="' + view.bar.v + '"' : '') + (view.bar.dis ? ' disabled' : '') + '>' + view.bar.label + '</button></div>';
  h += '<div class="scroll' + (view.fit ? ' fit' : '') + (view.bar && view.bar.inline ? ' leiste-inline' : '') + '" style="padding-top: ' + (wiz || tourP ? 56 : 52) + 'px"><div class="scr' + (view.fit ? ' fit' : '') + (view.cls ? ' ' + view.cls : '') + (S.dir === 'back' ? ' is-back' : '') + '" data-screen="' + S.screen + '">' + band + view.html + (view.bar && view.bar.inline ? barH : '') + recht + '</div></div>';
  if (view.bar && !view.bar.inline) h += barH;
  h += sheetsHTML();
  if (S.toast) h += '<div class="toast" role="status">' + esc(S.toast) + '</div>';
  const reihenX = Array.from(root.querySelectorAll('.qswatches, .qcards.reihe')).map((r) => r.scrollLeft);
  root.innerHTML = h;
  /* Foto-Felder: Zeichnet die App neu, während die Kamera offen ist (Auswertung des ersten Fotos), kommt das neue Foto an einem abgelösten
     Feld an und erreicht den Zuhörer an #app nicht mehr. Darum hört jedes Feld auch selbst, aber nur, wenn es nicht mehr im Dokument steht */
  root.querySelectorAll('input[data-in="photo"]').forEach((el) => el.addEventListener('change', (e) => { if (!root.contains(el)) onInput(el, e); }));
  /* Gleiche Modellstruktur wie zuvor: die alte Bühne bleibt, alles Weitere morpht mit Übergängen */
  const ph = root.querySelector('#w3d');
  if (ph && prevStage && prevSig && ph.getAttribute('data-sig') === prevSig && ph.getAttribute('data-keep') !== '0') { prevStage.className = ph.className; prevStage.style.height = ph.style.height; ph.replaceWith(prevStage); prevStage.setAttribute('data-reused', '1'); }
  else { if (prevStage) { prevStage.removeAttribute('data-reused'); prevStage._abgang = performance.now(); } if (ph && !ph.firstChild && W3DS.w3d) ph.outerHTML = w3dHTML(W3DS.w3d.w, W3DS.w3d.o); }
  const sc = root.querySelector('.scroll'), neu = fresh || lastScreen !== S.screen;
  if (neu) { if (sc) sc.scrollTop = 0; } else if (sc) sc.scrollTop = keep;
  if (!neu) { const scr = root.querySelector('.scr'); if (scr) scr.style.animation = 'none'; }
  /* Schrittwechsel mit Modell: die Bühne steht still (sie bleibt oder geht nahtlos in die neue über), nur Titel, Auswahl und
     Knöpfe gleiten herein. Sonst rutschte das Modell bei jeder Frage mit und blendete aus und ein. */
  else if (prevStage) { const scr = root.querySelector('.scr'); if (scr && scr.querySelector('#w3d')) { scr.style.animation = 'none'; scr.classList.add('mit-buehne'); } }
  /* Steht die Bühne nach dem Wechsel höher oder tiefer (anderer Titel), gleitet sie dorthin statt zu springen */
  const neuStage = root.querySelector('#w3d');
  if (neuStage && prevTop != null && !ruhig() && neuStage.animate) { const d = prevTop - neuStage.getBoundingClientRect().top; if (Math.abs(d) > 0.5 && Math.abs(d) < 240) neuStage.animate([{ transform: 'translateY(' + d.toFixed(1) + 'px)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2, .7, .2, 1)' }); }
  /* Messen im Raum: Öffnet oder schließt das Blatt mit den Zifferntasten, wird die Bühne niedriger bzw. höher. Das Modell gleitet dann in
     die neue Mitte, statt mit ihr zu springen (es wird zugleich mit den Übergängen der Flächen kleiner bzw. größer) */
  if (neuStage === prevStage && prevCamY != null && !ruhig()) { const cam = neuStage.querySelector('.w3d-cam'), d = cam ? prevCamY - cam.getBoundingClientRect().top : 0; if (Math.abs(d) > 1 && cam.animate) cam.animate([{ translate: '0 ' + d.toFixed(1) + 'px' }, { translate: '0 0' }], { duration: 520, easing: 'cubic-bezier(.3, .7, .2, 1)' }); }
  root.querySelectorAll('.qswatches, .qcards.reihe').forEach((r, i) => {
    if (!neu && reihenX[i] != null) { r.scrollLeft = reihenX[i]; return; }
    const on = r.querySelector('[aria-pressed="true"]'); if (!on) return;
    const rr = r.getBoundingClientRect(), ro = on.getBoundingClientRect(); if (ro.right > rr.right - 24 || ro.left < rr.left + 8) r.scrollLeft += ro.left - rr.left - (rr.width - ro.width) / 2;
  });
  lastScreen = S.screen;
  if (fokus && !neu) fokusZurueck(root, fokus);
  blattFokus(root, fokus, neu);
  bindAfterRender();
  if (['teilen', 'blatt', 'gesendet', 'datei', 'gekauft'].includes(S.screen)) blattSchrift();
  /* Blöcke erscheinen nacheinander bzw. beim Scrollen; die wiederverwendete 3-D-Bühne bleibt, wie sie ist */
  if (neu && !view.fit && window.Reveal) { const scr = root.querySelector('.scr'); if (scr) window.Reveal.auf(Array.from(scr.children).filter((c) => !(c.classList.contains('w3d-stage') && c.getAttribute('data-reused') === '1')), sc); }
  if (window.Lottie) window.Lottie.auf(document.body);
  /* Startbild neigt sich leicht mit dem Scrollen der Liste */
  const hs = root.querySelector('.hero-scene'); if (hs && window.Scroll) window.Scroll.binden(hs, (p) => hs.style.setProperty('--sp', p.toFixed(3)), { wurzel: sc });
  feiern(root);
  entwurfMerken(); // das Fenster in Arbeit als Entwurf im Browser (übersteht Neuladen und Zurück)
  falleStellen(); // Zurück-Taste des Browsers bleibt in der App
}
/* Rückmeldung je Anlass, am Objekt statt daneben (Katalog in gemeinsam.js):
   masse: die Maßlinien am Modell zeichnen sich nacheinander, die vier Werte rasten ein
   fertig: der gezogene Haken, der Name setzt sich · gesendet/gekauft: der Haken, ein Ring läuft aus · pdf: die Dateikarte wird markiert */
function feiern(root) {
  if (!S._feier || !window.Feier) return;
  const art = S._feier; S._feier = null;
  const F = window.Feier, q = (sel) => root.querySelector(sel), qa = (sel) => Array.from(root.querySelectorAll(sel));
  if (window.Haptik && (art === 'masse' || art === 'fertig' || art === 'gesendet' || art === 'gekauft')) window.Haptik.ok();
  setTimeout(() => {
    if (art === 'masse') { F.linien(q('.w3d-stage')); qa('.ps-zahl b, .ps-el b').forEach((b, i) => setTimeout(() => F.einrasten(b), 320 + i * 90)); }
    else if (art === 'wert') { const f = q('.w3d-feldlage .fd-knopf'); if (f) F.einrasten(f); }
    else if (art === 'fertig') { F.haken(q('.center .eyebrow svg')); F.einrasten(q('.center h1')); }
    else if (art === 'gesendet' || art === 'gekauft') { F.puls(q('.okmark, .center svg')); }
    else if (art === 'pdf') { F.markieren(q('.datei-card')); }
    else if (art === 'loop') { F.markieren(q('.share-way.done')); }
  }, art === 'masse' ? 200 : 120);
}
/* ---------- Bausteine ---------- */
const ICON_I = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.7"></circle><path d="M11 10v5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><circle cx="11" cy="6.8" r="1.3" fill="currentColor"></circle></svg>';
const CHEV = '<svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true"><path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="var(--line2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="var(--ok)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
/* Genau ein Wort je Überschrift in Grün (GESTALTUNG.md, Schrift; wie akSatz im Betriebsbereich): das erste Hauptwort nach dem ersten Wort
   („Fotografiere die Stelle.“ → „Stelle.“, „Welche Farbe außen?“ → „Farbe“), sonst das erste Wort, wenn es kein Fragewort oder
   Begleiter ist („Code eingeben.“), sonst das längste Wort („Was planst du?“ → „planst“). Arbeitet auf fertigem HTML: nur der Text vor
   dem ersten Tag zählt (dahinter etwa das i der Frage); Satzzeichen gehören zum Wort. Schon ausgezeichnete Titel bleiben, wie sie sind */
const AK_NICHT = /^(was|wie|wo|wohin|wann|wer|welche[rsmn]?|dein[e]?[rsmn]?|ihr[e]?[rsmn]?|sie|du|dich|dir|es|noch|erst|alles|schon|zieh|der|die|das|den|dem|ein[e]?[rsmn]?|an|in|im|am|zum|zur|und|oder|mit|für|von|zu|auf|soll|werden|wird|ist|sind|kann|hier|so|ganz|kurz)$/i;
function akH(html) {
  const s = String(html == null ? '' : html); if (!s || s.indexOf('class="ak"') >= 0) return s;
  const cut = s.indexOf('<'), text = cut >= 0 ? s.slice(0, cut) : s, rest = cut >= 0 ? s.slice(cut) : '';
  const teile = text.split(/(\s+)/), idx = [], kern = (t) => t.replace(/&#?\w+;/g, '').replace(/[^\p{L}\p{N}-]/gu, '');
  teile.forEach((t, i) => { if (kern(t)) idx.push(i); });
  if (!idx.length) return s;
  const frei = (i) => !AK_NICHT.test(kern(teile[i]));
  let k = idx.slice(1).find((i) => /^\p{Lu}/u.test(kern(teile[i])) && frei(i));
  if (k == null && frei(idx[0])) k = idx[0];
  if (k == null) k = idx.filter(frei).sort((a, b) => kern(teile[b]).length - kern(teile[a]).length)[0];
  if (k == null) k = idx[idx.length - 1];
  teile[k] = '<span class="ak">' + teile[k] + '</span>';
  return teile.join('') + rest;
}
/* Kopf eines Bildschirms; tools: Knöpfe rechts neben der Eyebrow (Erklärung und Notiz, schrittTools); ein Wort des Titels in Grün (akH) */
function hd(eyebrow, h1, sub, cls, eyeCls, tools) { const eb = '<p class="eyebrow' + (eyeCls ? ' ' + eyeCls : '') + '">' + String(eyebrow).split(' · ').map((t, i, a) => '<span' + (t.length <= 22 ? ' class="nw"' : '') + '>' + esc(t) + (i < a.length - 1 ? ' ·' : '') + '</span>').join(' ') + '</p>'; /* umbrochen wird nur nach einem „·“ */ return '<div class="hd' + (cls ? ' ' + cls : '') + '">' + (tools ? '<div class="hd-zeile">' + eb + '<span class="hd-tools">' + tools + '</span></div>' : eb) + '<h1>' + akH(h1) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'; }
function secHead(title, g, sub) { return (title ? '<div class="sec-head"><h2 class="sec-title">' + esc(title) + '</h2>' + (g ? '<button type="button" class="link" data-act="gloss" data-k="' + g + '">' + ICON_I + 'Was heißt das?</button>' : '') + '</div>' : '') + (sub ? '<p class="sub" style="margin-top: -6px; padding: 0 6px">' + esc(sub) + '</p>' : ''); }
function cards(group, cur, field, icoFn, cols, target) {
  return '<div class="' + (cols === 3 ? 'grid3' : 'grid2') + '">' + OPT[group].map((o) => '<div class="opt"><button type="button" data-act="' + (target || 'setw') + '" data-f="' + field + '" data-v="' + o.k + '" aria-pressed="' + (String(cur) === String(o.k)) + '">' + (icoFn ? svgIcon(icoFn(o.k), cols === 3 ? 46 : 56) : '') + '<span class="lbl">' + esc(o.label) + '</span>' + (o.sub ? '<span class="sb">' + esc(o.sub) + '</span>' : '') + (o.price ? '<span class="pr">' + esc(o.price) + '</span>' : '') + '</button>' + (o.g ? '<button type="button" class="info" aria-label="Erklärung" data-act="gloss" data-k="' + o.g + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
function chips(group, cur, field, target) {
  return auswahl(OPT[group], 'data-act="' + (target || 'setw') + '" data-f="' + field + '"', (o) => String(cur) === String(o.k));
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
/* Steht die Bühne mit gleicher Struktur schon da, geht nur die leere Hülle in den neuen Bildschirm; render() setzt die alte Bühne
   wieder ein. Das spart je Tippen das Zerlegen und Gestalten von einigen hundert Elementen. */
function model(w, o) {
  const id = o.id || 'w3d';
  /* Zoom gilt je Bildschirm und Frage; in den Fragen kommen die Knöpfe am Sonnenschutz und die Fahrt zum Griff dazu */
  if (o.zkey == null) o.zkey = S.screen + '|' + (S.screen === 'frage' ? S.q : '');
  if (id === 'w3d' && S.screen === 'frage') Object.assign(o, w3dFrage(S.q, w, o));
  if (id === 'w3d' && (S.screen === 'frage' || S.screen === 'ergebnis') && !S.tour && o.haus == null) o.haus = true; // Zahnrad: Fassade des Hauses
  W3DS[id] = { w: w, o: o };
  if (id === 'w3d') { const alt = document.getElementById('w3d'); if (alt && alt.getAttribute('data-sig') === w3dSig(w, o)) return w3dHuelle(w, o) + '</div>'; }
  return w3dHTML(w, o);
}
/* Knöpfe Hoch-/Herunterfahren und Wenden bei allen Fragen zum Sonnenschutz außen (auch den Detailangaben), Fahrt der Kamera zum Griff
   bei allen Fragen zum Griff */
const W3D_SONNE_FRAGEN = ['sart', 'einbau', 'blende', 'sfarbe', 'antrieb', 'sfTeile', 'sfK', 'sfS', 'lamelle', 'fuehrung', 'panzer', 'schlitz', 'transp', 'bedien', 'sensor'];
const W3D_GRIFF_FRAGEN = ['griff', 'gf', 'rc', 'griffM', 'griffPos', 'kinder', 'stulpBed', 'stulp', 'hstPlus'];
function w3dFrage(q, w, o) {
  const r = {};
  if (o.sonne == null) { if (W3D_SONNE_FRAGEN.indexOf(q) >= 0 && sonneAktiv(w)) r.sonne = 'aussen'; else if ((q === 'iart' || q === 'ifarbe') && innenAktiv(w)) r.sonne = 'innen'; }
  if (o.fokus == null && W3D_GRIFF_FRAGEN.indexOf(q) >= 0 && w.art !== 'fest') r.fokus = q === 'rc' ? 'rc' : 'griff';
  return r;
}
/* Maße und Wünsche stehen nie in Listen, auch nicht nach dem Freischalten: dort nur Name, Position, Symbol und Stand (fensterStatus) */
const masseZeigen = () => !S.betrieb && FREI();
function winCard(x, i, live, hide) { const d = derive(x), tag = live ? 'button' : 'div', fest = aendStand(x).fest;
  /* nach dem Senden im Link: keine Maße mehr, die stehen im Aufmaßblatt */
  if (hide) { const anderswo = !!(S.sent && S.sent.anderswo); return '<div class="wincard sent"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + (anderswo ? 'Auf diesem Gerät' : PILOT ? 'Abgeschlossen' : 'Übermittelt') + (x.anzahl > 1 ? ' · ' + x.anzahl + ' Stück' : '') + (x.fotos ? ' · ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '') + '</span><span class="me">' + (anderswo ? 'Maßgeblich ist das Aufmaß, das angekommen ist' : 'Maße und Angaben stehen im Aufmaßblatt') + '</span></span></div>'; }
  /* Karte in der Übersicht: Nummer der Position am Bild, Name, Zeile mit Art, Geschoss, Stückzahl, Fotos und Notiz, darunter der Stand
     als Punkt mit Text (vollständig, Maße offen, Zahl der offenen Wünsche); Maße und Wünsche stehen nie in Listen, auch nicht ihre Namen */
  const st = fensterStand(x), di = [lab('art', x.art || 'fenster'), x.etage ? lab('etage', x.etage) : '', x.anzahl > 1 ? x.anzahl + ' Stück' : '', x.fotos ? x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '', Object.keys(x.notizen || {}).length ? 'mit Notiz' : '', fest ? 'fest' : ''].filter(Boolean).join(' · ');
  return '<' + tag + (live ? ' type="button"' : '') + ' class="wincard"' + (live ? ' data-act="open" data-i="' + i + '"' : '') + '><span class="ic"><b class="pos" aria-label="Position ' + (i + 1) + '">' + (i + 1) + '</b>' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + esc(di) + '</span><span class="st ' + st.k + '"><i aria-hidden="true"></i>' + esc(st.text) + '</span></span>' + (live ? CHEV : '') + '</' + tag + '>'; }
/* Startbild der App: Foto ohne Rahmen, das weich in den Grund ausläuft (app.css .hero-foto), mit den drei Schritten als Chips;
   das Foto liegt in web/bilder/foto/ (docs/BILDER.md) */
const FOTO_START = '<figure class="hero-foto"><img src="/bilder/foto/app-start.webp" width="1120" height="1400" alt="Drei Waschbären im Wohnzimmer: einer fotografiert mit dem Handy die Maueröffnung samt Zollstock, einer tippt auf dem Sofa seine Wünsche an, einer lehnt sich zufrieden zurück" fetchpriority="high" decoding="async"><div class="chips"><span class="chip haken">Fotografieren</span><span class="chip haken">Messen</span><span class="chip haken">Wünschen</span></div></figure>';
SCREENS.home = () => {
  if (S.betrieb) return linkHome();
  if (S.windows.length || angelegt() >= GRENZE.fenster) return homeAufmass(); // an der Grenze ohne Fenster: dort steht „Neues Aufmaß beginnen“
  const cardsH = '', betrieb = '';
  const html = (window.EinfBanner ? window.EinfBanner('kunde', { act: 'new' }) : '') + '<section class="hero start"><p class="eyebrow kicker">Fensterplanung, ganz <span class="mk" translate="no">eezi</span></p><h1>Fotografieren.<br>Messen.<br><span class="ak">Wünschen.</span></h1><p>Zwei Fotos, vier Maße mit dem Zollstock, und aus deinen Zahlen wächst dein Fenster als 3-D-Modell. Dein Fensterbauer bekommt alles fürs Angebot.</p>' +
    '<div class="cta stapel"><button type="button" class="btn primary" data-act="new">Fenster ausmessen<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost" data-act="tour-start">Führung starten</button><p class="cta-zeile">Zwei Minuten, ohne eigene Maße&nbsp;· <button type="button" class="ulink" data-act="gloss" data-k="referenz">Wie genau ist das?</button></p>' + (kontoBereit() ? '<p class="cta-zeile">' + (KS ? 'Angemeldet als ' + esc(KS.mail) + ' · <button type="button" class="ulink" data-act="go" data-v="meinkonto">Dein Konto</button>' : 'Schon ein Aufmaß gesichert? <button type="button" class="ulink" data-act="anmelden">Anmelden</button>') + '</p>' : '') + '</div>' +
    FOTO_START + '<div class="hero-scene">' + model(HERO_WIN, { id: 'w3d-hero', view: 'three', sway: true, cls: 'hero dims-all', stageH: 300, dims: ['hm', 'wm', 'eh', 'ew'], labels: { hm: '1.480 mm', wm: '1.370 mm', eh: '1.410 mm', ew: '1.230 mm' } }) + '</div></section>' + betrieb +
    '<section class="sec"><div class="sec-head"><h2 class="sec-title">Dein Projekt.</h2><span class="sub">' + S.windows.length + ' Fenster erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + cardsH + '<button type="button" class="dashed" data-act="new"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>' + (S.windows.length ? 'Weiteres Fenster' : 'Erstes Fenster ausmessen') + '</button></div></section>' + (S.windows.length ? dateiCard() : '') +
    '<section class="card erklaert"><p class="eyebrow kicker">So funktioniert\'s</p><h2 class="sec-title">Zollstock statt Rätselraten.</h2><div class="steps">' +
    '<div class="step"><span class="n">1</span><div><b>Fotografieren.</b><p>Innen und außen, das Handy gerade halten. Die KI liest daraus die Einbausituation: Rollladenkasten, Laibung, Fensterbänke, Fassade.</p></div></div>' +
    '<div class="step"><span class="n">2</span><div><b>Messen.</b><p>Vier Maße mit dem Zollstock, Schritt für Schritt erklärt. Mit jeder Zahl formt sich Öffnung und Fenster als Modell, dann ergänzt du die Ränder.</p></div></div>' +
    '<div class="step"><span class="n">3</span><div><b>Wünschen.</b><p>Flügel antippen, Sprossen ziehen, Farben innen und außen wählen. Jeder Fachbegriff mit Bild erklärt.</p></div></div></div>' +
    '<p class="nachsatz">Vor der Fertigung misst dein Fensterbauer einmal vor Ort nach, das <button type="button" class="ulink" data-act="gloss" data-k="feinaufmass">Feinaufmaß</button>.</p></section>' +
    '<div class="foot-links"><a class="link" href="' + RATGEBER_URL + '">Anleitung: Fenster ausmessen ›</a><a class="link" href="' + FB_URL + '">Sie sind Fensterbauer? ›</a><a class="link" href="' + PORTAL_URL + '">Zur Startseite ›</a></div>' + rechtLinks();
  return { html: html, bar: S.windows.length ? { label: FREI() ? 'Zum Aufmaßblatt' : 'Aufmaßblatt fertigstellen', act: 'go', v: FREI() ? 'teilen' : 'anfrage' } : null };
};
const PLUS = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>';
/* Stand des Aufmaßes in einem Satz */
function aufmassStand() {
  const n = S.windows.length, voll = S.windows.filter((x) => derive(x).complete).length;
  if (!n) return 'Gerade ist kein Fenster erfasst.';
  return n + ' Fenster erfasst' + (voll === n ? ', alle mit vollständigen Maßen.' : voll ? ', ' + voll + ' davon mit vollständigen Maßen.' : ', die Maße fehlen noch.');
}
/* „Weiteres Fenster“, solange die Grenze nicht erreicht ist; kurz davor ein Hinweis, an der Grenze die Erklärung */
function neuKnopf(label) {
  const rest = GRENZE.fenster - angelegt();
  if (rest <= 0) return '<div class="note warn grenze">' + esc(maxMsg()) + (S.betrieb ? '' : ' <button type="button" class="ulink" data-act="aufmass-neu">Neues Aufmaß beginnen</button>') + '</div>';
  return '<button type="button" class="dashed" data-act="new">' + PLUS + esc(label || 'Weiteres Fenster') + '</button>' + (rest <= 10 ? '<p class="sub grenze">Noch ' + rest + (rest === 1 ? ' neues Fenster' : ' neue Fenster') + ' möglich. Ein Aufmaß umfasst höchstens ' + GRENZE.fenster + ' Fenster, gelöschte zählen mit.</p>' : '');
}
/* Eigenes Aufmaß, schon angefangen: weiter, wo du warst. Die Liste steht oben, Erklärung und Führung weiter unten */
function homeAufmass() {
  const neu = S.neuFrage && kontoBereit() && KS ? '<div class="card neu-frage"><p class="eyebrow">Neues Aufmaß</p><b>Ein neues Aufmaß beginnen?</b><p class="sub">Dein bisheriges Aufmaß bleibt in deinem Konto, du findest es unter „Dein Konto“.</p><div class="pill-row"><button type="button" class="pill" data-act="aufmass-neu-ja">Neues Aufmaß beginnen</button><button type="button" class="pill" data-act="aufmass-neu-nein">Abbrechen</button></div></div>'
    : S.neuFrage ? '<div class="card neu-frage"><p class="eyebrow">Neues Aufmaß</p><b>Dieses Aufmaß auf diesem Gerät löschen?</b><p class="sub">Fenster, Angaben und die Freischaltung dieses Aufmaßes sind danach weg. Lade dein Aufmaßblatt vorher herunter, falls du es noch brauchst.</p><div class="pill-row"><button type="button" class="pill danger" data-act="aufmass-neu-ja">Löschen und neu beginnen</button><button type="button" class="pill" data-act="aufmass-neu-nein">Abbrechen</button></div></div>' : '';
  const html = uebersichtKopf() +
    '<section class="sec liste"><div class="liste-in">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' + neu +
    kontoKarte() +
    (S.windows.length ? dateiCard() : '') +
    '<section class="card erklaert"><p class="eyebrow kicker">So funktioniert\'s</p><h2 class="sec-title">Zollstock statt Rätselraten.</h2><div class="steps">' +
    '<div class="step"><span class="n">1</span><div><b>Fotografieren.</b><p>Innen und außen, das Handy gerade halten. Die KI liest daraus die Einbausituation.</p></div></div>' +
    '<div class="step"><span class="n">2</span><div><b>Messen.</b><p>Vier Maße mit dem Zollstock, Schritt für Schritt erklärt, dann die Ränder.</p></div></div>' +
    '<div class="step"><span class="n">3</span><div><b>Wünschen.</b><p>Flügel, Sprossen, Farben innen und außen, jeder Fachbegriff mit Bild erklärt.</p></div></div></div>' +
    '<p class="nachsatz">Ein Fenster in zwei Minuten ausprobieren, ohne eigene Maße: <button type="button" class="ulink" data-act="tour-start">Führung starten</button></p></section>' +
    '<div class="foot-links"><a class="link" href="' + RATGEBER_URL + '">Anleitung: Fenster ausmessen ›</a><a class="link" href="' + FB_URL + '">Sie sind Fensterbauer? ›</a><a class="link" href="' + PORTAL_URL + '">Zur Startseite ›</a></div>' + rechtLinks();
  return { html: html, bar: S.windows.length ? { label: FREI() ? 'Zum Aufmaßblatt' : 'Aufmaßblatt fertigstellen', act: 'go', v: FREI() ? 'teilen' : 'anfrage' } : null };
}
/* Eigenes Aufmaß: wo es gespeichert ist. Gast: nur in diesem Browser, mit „Aufmaß sichern“; mit Konto: gesichert, „Dein Konto“ */
function kontoKarte() {
  if (!kontoBereit()) return '<p class="sub center merk">Dein Aufmaß bleibt in diesem Browser gespeichert. Öffne eeziframes wieder hier, dann geht es weiter.</p>';
  if (KS && S.sync.voll) return '<div class="card merk-karte konto-karte gast"><p class="eyebrow">Nicht gesichert</p><p>' + esc(VOLL_TEXT) + '</p><div class="pill-row"><button type="button" class="pill" data-act="go" data-v="meinkonto">Dein Konto</button></div></div>';
  if (KS) {
    const n = (S.konto.liste || []).length;
    return '<div class="card merk-karte konto-karte"><p class="eyebrow">Gesichert</p><p>In deinem Konto <b class="mail">' + esc(KS.mail) + '</b>, auf jedem Gerät, mit deinen Fotos.</p><div class="pill-row"><button type="button" class="pill" data-act="go" data-v="meinkonto">' + (n > 1 ? 'Deine ' + n + ' Aufmaße' : 'Dein Konto') + '</button></div></div>';
  }
  const ab = S.konto.abgelaufen;
  return '<div class="card merk-karte konto-karte gast"><p class="eyebrow">' + (ab ? 'Bitte neu anmelden' : 'Nur auf diesem Gerät') + '</p><p>' + (ab ? 'Deine Anmeldung ist abgelaufen. Melde dich wieder an, dann wird dein Aufmaß weiter gesichert.' : 'Sichere dein Aufmaß mit deiner E-Mail-Adresse, dann geht es auf jedem Gerät weiter und nichts geht verloren. Kein Passwort.') + '</p><div class="pill-row"><button type="button" class="btn primary" data-act="' + (ab ? 'anmelden' : 'sichern') + '">' + (ab ? 'Anmelden' : 'Aufmaß sichern') + '</button></div></div>';
}
/* Hinweis im Kundenlink: jederzeit über den Link weitermachen (in der Anrede, die der Betrieb gewählt hat) */
function linkMerk(name, du) {
  const server = SERVER.daten && !S.sync.aus && S.sync.ok, bis = S.betrieb && S.betrieb.expires ? S.betrieb.expires : '', T = (sie, x) => (du === false ? sie : x);
  return '<div class="card merk-karte"><p class="eyebrow">Jederzeit weitermachen</p><p>' + T('Öffnen Sie einfach wieder den Link von ', 'Öffne einfach wieder den Link von ') + '<b>' + esc(name) + '</b>. ' + (server ? T('Ihre Angaben sind gespeichert, auch für ein anderes Gerät. Ihre Fotos sieht ', 'Deine Angaben sind gespeichert, auch für ein anderes Gerät. Deine Fotos sieht ') + esc(name) + T(' erst, wenn Sie senden.', ' erst, wenn du sendest.') : T('Ihre Angaben bleiben in diesem Browser gespeichert; öffnen Sie den Link später im selben Browser.', 'Deine Angaben bleiben in diesem Browser gespeichert; öffne den Link später im selben Browser.')) + (bis ? ' Der Link gilt bis ' + esc(bis) + '.' : '') + '</p></div>';
}
/* Nach dem Senden bleibt der Code, wie er abgeschickt wurde */
const curCode = () => (S.sent && S.sent.code) || packProject(S.windows, S.proj, S.betrieb);
const sentWhen = () => { try { const d = new Date(S.sent.when); return d.toLocaleDateString('de-DE') + ' um ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'; } catch (e) { return ''; } };
/* Startseite für Kunden, die über einen Kundenlink kommen; in der Vorschau des Betriebs mit Hinweis oben */
function linkHome() {
  const v = linkHomeInhalt();
  if (vorschau()) v.html = '<div class="note warn vorschau" role="note"><b>Vorschau für Ihren Betrieb.</b> So sieht Ihr Kunde den Link. Was Sie hier eingeben, wird weder gespeichert noch gesendet, und der Link gilt weiter als ungeöffnet.</div>' + v.html;
  return v;
}
/* Einladungsseite (Strang S4): Der Betrieb steht vorn, eeziframes klein als Übermittler. Aufbau, Texte und Gestaltung kommen aus
   einladung.js (dieselbe Seite zeigt der Betriebsbereich als Vorschau). Was der Betrieb eingestellt hat, kommt im Servermodus mit
   GET /api/link/:code (auftritt, du, hinweis), im Pilotbetrieb gekürzt aus dem Link (readHash); ältere Links ohne Angaben duzen und
   zeigen den Namen aus dem Link. Die Anrede gilt für diese Seite; die Messschritte der App duzen immer. */
const LK_SERVER = {}; // je Code, was der Server zuletzt gesagt hat (überlebt einen Wechsel der Runde im selben Tab)
/* Planungstiefe, die der Betrieb für seine Kunden vorgibt (Einladungsseite, einladung.js tiefe): gilt, solange der Kunde selbst keine
   gewählt hat; die Frage nach der Tiefe entfällt dann, die Pille bei jeder Frage ändert sie weiter. true, wenn gesetzt */
function tiefeVorgabe() {
  const t = S.betrieb ? (lkDaten().p || {}).tiefe : '';
  if (!t || !S.proj || S.proj.tiefe || ['kurz', 'normal', 'genau'].indexOf(t) < 0) return false;
  S.proj.tiefe = t; return true;
}
function lkDaten() {
  const b = S.betrieb || {}, s = LK_SERVER[b.code] || {}, E = window.Einladung;
  const du = typeof s.du === 'boolean' ? s.du : typeof b.du === 'boolean' ? b.du : true;
  if (INST) return { name: b.name || INST.name || 'Ihr Fensterbauer', kunde: b.kunde || '', du: du, p: instProfil(s.auftritt || b.auftritt), hinweis: s.hinweis !== undefined ? s.hinweis : b.hinweis || '', bis: b.expires || '' };
  return { name: b.name || (du ? 'Dein Fensterbauer' : 'Ihr Fensterbauer'), kunde: b.kunde || '', du: du, p: s.auftritt || b.auftritt || E.profil({}), hinweis: s.hinweis !== undefined ? s.hinweis : b.hinweis || '', bis: b.expires || '' };
}
function linkHomeInhalt() { return INST ? instHome() : linkHomeInhaltAlt(); }
/* I: Ausgabe einer Instanz (Einladung einer Signature-Instanz mit Nachbesserung, instHome); ohne I wie bisher */
function linkHomeInhaltAlt(I) {
  const E = window.Einladung, d = lkDaten(), name = d.name, du = d.du, T = (sie, x) => (du ? x : sie), n = S.windows.length, sent = !!S.sent;
  const kopf = (oben) => E.kopf({ name: name, p: d.p, oben: oben, unten: d.kunde ? 'für ' + d.kunde : '', instanz: I });
  const kontakt = () => E.kontakt({ name: name, p: d.p, du: du, bis: sent || S.linkZu ? '' : d.bis, instanz: I });
  const fuss = I ? '' : E.fuss({ name: name, du: du });
  const liste = (titel, karten) => '<section class="sec"><div class="sec-head"><h2 class="sec-title">' + titel + '</h2><span class="sub">' + n + (sent ? ' Fenster' : ' erfasst') + '</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + karten + '</div></section>';
  const pf = '<span class="pf" aria-hidden="true"></span>';
  if (sent) {
    const html = '<section class="hero lk"><div class="ein-start-in">' + kopf(PILOT ? 'Aufmaß für' : 'Gesendet an') + '<div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="84" height="84" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>' +
      (PILOT ? '<h1>Fast erledigt.</h1><p class="ein-lead">Abgeschlossen am ' + esc(sentWhen()) + '. ' + T('Schicken Sie ', 'Schick ') + esc(name) + T(' jetzt noch Ihren Aufmaß-Code, falls noch nicht geschehen. Erst damit kommt Ihr Aufmaß an.', ' jetzt noch deinen Aufmaß-Code, falls noch nicht geschehen. Erst damit kommt dein Aufmaß an.') + '</p><div class="ein-cta"><button type="button" class="btn primary" data-act="go" data-v="gesendet">Code senden' + pf + '</button></div>'
        : '<h1>' + (S.sent.anderswo ? 'Schon erledigt.' : 'Danke, erledigt.') + '</h1><p class="ein-lead">' + esc(name) + T(' hat Ihr Aufmaß seit ', ' hat dein Aufmaß seit ') + esc(sentWhen()) + T(' und meldet sich mit einem Angebot bei Ihnen.', ' und meldet sich mit einem Angebot bei dir.') + '</p>') + '</div></section>' +
      (S.sent.abweichend ? noteBox('Änderungen auf diesem Gerät sind nicht bei ' + esc(name) + T(' angekommen. Klären Sie sie bitte direkt mit ', ' angekommen. Kläre sie bitte direkt mit ') + esc(name) + '.', null, 'warn') : '') +
      (du ? dateiCard() : '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Eine Kopie für Sie?</p><b>Fragen Sie ' + esc(name) + '</b><small>Ihr Aufmaß gehört zu diesem Auftrag. ' + esc(name) + ' hat das komplette Aufmaßblatt als PDF und gibt es Ihnen gern mit dem Angebot.</small></div></div></div>') +
      liste(S.sent.anderswo ? 'Auf diesem Gerät.' : PILOT ? 'Abgeschlossen.' : 'Gesendet.', S.windows.map((x, i) => winCard(x, i, false, true)).join('')) +
      kontakt() + fuss + rechtLinks();
    return { html: html, bar: null };
  }
  if (S.linkZu && S.linkZu !== 'eingegangen') {
    const html3 = '<section class="hero lk"><div class="ein-start-in">' + kopf() + '<p class="eyebrow" style="color: var(--warn)">' + (S.linkZu === 'abgelaufen' ? 'Link abgelaufen' : S.linkZu === 'deaktiviert' ? 'Link deaktiviert' : 'Link nicht aktiv') + '</p><h1>Hier geht es gerade nicht weiter.</h1><p class="ein-lead">' + esc(S.linkZuText || T('Bitte melden Sie sich bei ', 'Bitte melde dich bei ') + name + '.') + '</p></div></section>' +
      (n ? liste(T('Ihre Fenster.', 'Deine Fenster.'), S.windows.map((x, i) => winCard(x, i, false)).join('')) : '') + kontakt() + fuss + rechtLinks();
    return { html: html3, bar: null };
  }
  if (S.nb) {
    const hin = d.hinweis ? '<div class="ein-hinweis"><p class="eyebrow">Darum bittet ' + esc(name) + '</p><p>' + esc(d.hinweis) + '</p></div>' : '';
    const html2 = '<section class="hero lk"><div class="ein-start-in">' + kopf() + '<p class="eyebrow" style="color: var(--warn)">Bitte noch einmal prüfen</p><h1>Fast fertig,<br>eine Runde noch.</h1><p class="ein-lead">' + esc(name) + T(' hat Ihr Aufmaß bekommen und bittet Sie, es noch einmal zu prüfen.', ' hat dein Aufmaß bekommen und bittet dich, es noch einmal zu prüfen.') + (d.hinweis ? ' ' : ' Was genau, steht in der Nachricht. ') + (n ? T('Ihre Angaben sind alle noch da: Tippen Sie ein Fenster an, ändern Sie, was nötig ist, und schicken Sie es erneut ab.', 'Deine Angaben sind alle noch da: Tipp ein Fenster an, ändere, was nötig ist, und schick es erneut ab.') : T('Auf diesem Gerät ist Ihr Aufmaß nicht gespeichert. Messen Sie die Fenster, um die es geht, bitte neu auf; ', 'Auf diesem Gerät ist dein Aufmaß nicht gespeichert. Miss die Fenster, um die es geht, bitte neu auf; ') + esc(name) + ' ergänzt sie im bisherigen Aufmaß.') + '</p>' + hin +
      '<div class="ein-cta"><button type="button" class="btn primary" data-act="' + (n ? 'go' : 'new') + '" data-v="anfrage">' + (n ? 'Prüfen und erneut senden' : 'Fenster neu ausmessen') + pf + '</button></div></div></section>' +
      '<section class="sec"><div class="sec-head"><h2 class="sec-title">' + T('Ihre Fenster.', 'Deine Fenster.') + '</h2><span class="sub">' + n + ' erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' + kontakt() + fuss + rechtLinks();
    return { html: html2, bar: null };
  }
  if (n || angelegt() >= GRENZE.fenster) {
    const html4 = '<div class="lk-kopf">' + E.kopf({ name: name, p: d.p, klein: true, unten: d.kunde ? 'für ' + d.kunde : '' }) + '</div>' + uebersichtKopf(T) +
      '<section class="sec liste"><div class="liste-in">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' +
      (vorschau() ? '' : linkMerk(name, du)) + kontakt() + fuss + rechtLinks();
    return { html: html4, bar: n ? { label: 'Weiter zum Absenden', act: 'go', v: 'anfrage' } : null };
  }
  const html = E.html({ name: name, kunde: d.kunde, du: du, p: d.p, bis: d.bis, server: !!SERVER.daten }) + rechtLinks();
  return { html: html, bar: null };
}
/* ---------- Start: die Stelle und das Element ----------
   Gestaltung „Bühne“ (25.10.2026): Oben die Stelle als Glasschalter (Ersetzen oder Neue Öffnung). Darunter schwebt das gewählte Element
   allein in 3-D auf einer dunklen Bühne (echtes Modell ohne Wand, o.frei), von oben angestrahlt, mit Schatten am Boden; bei der neuen
   Öffnung markiert ein grüner Ring am Boden den Platz. Darunter Name und Kurzbeschreibung, dann alle sechs Elemente als kleine Vorschau
   (das gewählte hell mit grüner Linie). Wechseln: Vorschau antippen oder auf der Bühne nach links oder rechts wischen (das Modell dreht
   sich mit dem Finger und hüpft beim Loslassen weiter). Das neue Element hüpft aus der Wischrichtung ins Bild (720 ms); bei „weniger
   Bewegung“ steht es sofort da (app.css). Der Weiter-Knopf steht im Inhalt, nicht am unteren Rand (bar.inline). */
const START_MASS = { fenster: [1230, 1410, 620], balkon: [1010, 2180, 0], fest: [1800, 1400, 620], hst: [2600, 2200, 0], psk: [2000, 2180, 0], fsw: [3600, 2200, 0] };
function startWin(w) {
  const m = START_MASS[w.art] || START_MASS.fenster;
  const v = Object.assign(baseWin(), { w: m[0], h: m[1], mo: { hm: m[1] + 70, hl: m[1] + 70, hr: m[1] + 70, wm: m[0] + 140, wt: m[0] + 140, wb: m[0] + 140 }, el: { h: m[1], w: m[0] }, bru: m[2], laib: 140, fa: w.fa, fi: w.fi, offen: kopie(w.offen || {}), material: w.material, neu: w.neu, hst: w.hst, fsw: w.fsw, bt: w.bt, psk: w.psk });
  artSetzen(v, w.art || 'fenster'); return v;
}
/* Kurze Namen: groß unter der Bühne, ganz kurz in der Vorschau-Reihe */
const ST_NAME = { fenster: ['Fenster', 'Fenster'], balkon: ['Balkontür', 'Balkontür'], fest: ['Festverglasung', 'Festverglasung'], hst: ['Hebe-Schiebe-Tür', 'Hebe-Schiebe'], psk: ['PSK-Tür', 'PSK-Tür'], fsw: ['Faltschiebewand', 'Faltschiebewand'] };
let stZuletzt = '', stRichtung = 0;
const stIdx = (k) => Math.max(0, OPT.art.findIndex((x) => x.k === k));
const stNachbar = (k, d) => OPT.art[(stIdx(k) + d + OPT.art.length) % OPT.art.length].k;
/* Die Stelle als Glasschalter: zwei Hälften, das helle Glas gleitet zur gewählten */
function startStelle(neu) {
  return '<div class="st-stelle' + (neu ? ' is-neu' : '') + '" role="group" aria-label="Die Stelle">' + OPT.situation.map((o) =>
    '<button type="button" class="qopt st-seg" data-act="situation" data-v="' + o.k + '" aria-pressed="' + ((o.k === 'neu') === neu) + '"><span class="lbl">' + esc(o.label) + '</span><span class="sb">' + esc(o.sub || '') + '</span></button>').join('') + '</div>';
}
function startBuehne(w, art, neu, hop) {
  return '<div class="st-buehne' + (neu ? ' is-neu' : '') + (hop ? ' is-hop' : '') + '" style="--d: ' + (hop < 0 ? -1 : 1) + '">' +
    '<div class="st-boden" aria-hidden="true"></div>' +
    '<div class="st-held">' + model(startWin(w), { id: 'w3d', view: 'three', sway: true, frei: true, noZoom: true, cls: 'st-schwebe ohne-erbe', stageH: 250, fitW: 0.62, fitH: 0.7 }) + '</div></div>';
}
/* Alle Elemente als kleine Vorschau unten, das gewählte markiert (grüne Linie, volle Helligkeit) */
function startReihe(w, art) {
  return '<div class="st-reihe" role="group" aria-label="Das Element">' + OPT.art.map((x) => {
    const v = startWin(Object.assign({}, w, { art: x.k }));
    return '<button type="button" class="qopt st-mini" data-act="art" data-v="' + x.k + '" aria-pressed="' + (x.k === art) + '" aria-label="' + esc(x.label) + '">' + svgIcon(miniWin(v), 48) + '<span class="lbl">' + esc(ST_NAME[x.k][1]) + '</span></button>';
  }).join('') + '</div>';
}
SCREENS.start = () => {
  const w = S.win, art = w.art || 'fenster', neu = !!w.neu, o = OPT.art.find((x) => x.k === art) || OPT.art[0], g = optG('art', o);
  /* Hüpfen nur, wenn sich das Element geändert hat: aus der Wischrichtung, sonst aus der Richtung in der Reihe */
  const altArt = lastScreen === 'start' ? stZuletzt : '', hop = altArt && altArt !== art ? (stRichtung || (stIdx(art) > stIdx(altArt) ? 1 : -1)) : 0;
  stZuletzt = art; stRichtung = 0;
  const html = hd('Schritt 1 von 6 · Start', 'Was planst du?', '', '', '', schrittTools('elementart')) +
    startBuehne(w, art, neu, hop) +
    '<div class="st-wahl' + (hop ? ' is-hop' : '') + '"><p class="st-name" aria-live="polite">' + esc(ST_NAME[art][0]) + '</p>' +
    '<p class="st-sub">' + esc(o.sub || '') + (g ? ' <button type="button" class="ulink" data-act="gloss" data-k="' + g + '" aria-label="' + esc('Erklärung: ' + o.label) + '">Was ist das?</button>' : '') + '</p></div>' +
    startReihe(w, art) + startStelle(neu) +
    (neu ? noteBox('Du fotografierst die Wand und ziehst das neue Element auf dem Foto an seinen Platz. Die Maße sind Wunschmaße; Sturz und Statik prüft der Fachbetrieb vor dem Durchbruch.', 'neuoeffnung', 'st-note') : '');
  return { html: html, back: ['Aufmaß', 'home'], bar: { label: 'Weiter zu den Fotos', act: 'go', v: 'fotos', zurueck: true, inline: true } };
};
/* Wischen auf der Bühne: das Element folgt dem Finger (und dreht sich dabei, bindW3D), ab 56 px oder einem schnellen Wisch hüpft es
   weiter; sonst federt es zurück. Ein Wisch löst danach keinen Tipp aus. */
function startWischen() {
  const b = document.querySelector('.scr[data-screen="start"] .st-buehne'), held = b && b.querySelector('.st-held');
  if (!b || !held || b._wisch) return; b._wisch = true;
  let g = null, gewischt = 0;
  const weiter = (d) => {
    stRichtung = d; gewischt = Date.now();
    const ziel = document.querySelector('.st-mini[data-v="' + stNachbar(S.win.art || 'fenster', d) + '"]');
    if (!ziel) return;
    if (ruhig()) { ziel.click(); return; }
    held.style.transition = 'transform 160ms cubic-bezier(.4, 0, 1, 1), opacity 160ms'; held.style.transform = 'translateX(' + (-d * 46) + '%) scale(.86)'; held.style.opacity = '0';
    setTimeout(() => { if (document.body.contains(ziel)) ziel.click(); }, 150);
  };
  b.addEventListener('pointerdown', (e) => {
    if (e.button != null && e.button > 0) return;
    g = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), dx: 0, an: false, aus: false };
    held.style.transition = 'none';
  });
  const move = (e) => {
    if (!g || e.pointerId !== g.id || g.aus) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.an) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { g.aus = true; return; } if (Math.abs(dx) < 8) return; g.an = true; }
    g.dx = dx; held.style.transform = 'translateX(' + (dx * 0.55).toFixed(1) + 'px)';
  };
  const up = (e) => {
    if (!g || e.pointerId !== g.id) return;
    const s = g; g = null;
    if (!s.an || e.type === 'pointercancel' && Math.abs(s.dx) < 56) { held.style.transition = ''; held.style.transform = ''; return; }
    const v = Math.abs(s.dx) / Math.max(1, performance.now() - s.t);
    if (Math.abs(s.dx) >= 56 || v > 0.5 && Math.abs(s.dx) > 24) { weiter(s.dx < 0 ? 1 : -1); return; }
    held.style.transition = 'transform 420ms cubic-bezier(.3, 1.5, .5, 1)'; held.style.transform = '';
    const st = document.getElementById('w3d'), v0 = VIEWS.three; if (st) w3dView(st, v0);
  };
  document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  /* Aufräumen, sobald die Bühne nicht mehr im Dokument steht */
  const weg = () => { if (!document.body.contains(b)) { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); document.removeEventListener('pointerdown', weg, true); } };
  document.addEventListener('pointerdown', weg, true);
  b.addEventListener('click', (e) => { if (e.isTrusted && Date.now() - gewischt < 450) { e.stopPropagation(); e.preventDefault(); } }, true);
  /* Pfeiltasten auf der Bühne und den Punkten */
  b.parentNode.addEventListener('keydown', (e) => { if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.target.closest && e.target.closest('.st-reihe, .st-buehne')) { e.preventDefault(); stRichtung = e.key === 'ArrowRight' ? 1 : -1; const z = document.querySelector('.st-mini[data-v="' + stNachbar(S.win.art || 'fenster', stRichtung) + '"]'); if (z) { z.click(); const n = document.querySelector('.st-mini[aria-pressed="true"]'); if (n) n.focus(); } } });
}
/* ---------- Fotos ---------- */
function photoTile(which) {
  const p = S.photos[which], a = S.ai[which], label = which === 'in' ? 'Von innen' : 'Von außen', demo = p && p.demo;
  let inner;
  if (!p) inner = '<span class="empty"><svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><path d="M8 15.5c0-1.9 1.6-3.5 3.5-3.5h4.2l2.4-4h7.8l2.4 4h4.2c1.9 0 3.5 1.6 3.5 3.5v16c0 1.9-1.6 3.5-3.5 3.5h-21C9.6 35 8 33.4 8 31.5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"></path><circle cx="22" cy="23" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"></circle></svg>' + label + '<br><small style="font-weight: 600; color: var(--muted)">' + 'empfohlen' + '</small></span>';
  else inner = '<img src="' + p.url + '" alt="' + label + '">';
  const ai = p ? (a && a.status === 'running' ? '<span class="ai-scan" data-lottie="fotos" data-loop="1" aria-hidden="true"></span><span class="ai"><span class="spin"></span>KI liest</span>' : a && a.status === 'done' ? '<span class="ai">' + '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>KI fertig</span>' : a && a.status === 'error' ? '<span class="ai">ohne KI</span>' : '') : '';
  /* Liegt ein Foto in der Kachel, öffnet Antippen die Großansicht (Zoom, neu aufnehmen, löschen); nur die leere Kachel startet die Kamera */
  if (p) return '<button type="button" class="tile" data-act="foto-gross" data-v="' + which + '" aria-label="' + esc(label + ': Foto groß ansehen') + '">' + inner + ai + '<span class="tag">' + CHECK + esc(label) + (demo ? ' · Beispiel' : '') + '</span><span class="tile-lupe" aria-hidden="true">' + LUPE_S + '</span></button>';
  return '<label class="tile"><input type="file" accept="image/*" capture="environment" data-in="photo" data-f="' + which + '">' + inner + ai + '</label>';
}
SCREENS.fotos = () => {
  const p = S.photos.in, tilt = p && S.ai.in && S.ai.in.befund && S.ai.in.befund.tilt != null ? S.ai.in.befund.tilt : null;
  const neu = !!S.win.neu, tuer = istTuer(S.win), ding = tuer ? 'die Tür' : S.win.art === 'fest' ? 'die Verglasung' : 'das Fenster';
  let level = '<div class="level"><span class="bubble"><span></span></span><span>Handy <b>gerade</b> halten, ' + (neu ? 'die ganze Stelle' : ding + ' ganz') + ' im Bild, etwas Wand drumherum.</span></div>';
  if (tilt != null) level = '<div class="level"><span class="bubble"><span style="animation: none; left: ' + Math.round(25 + Math.max(-20, Math.min(20, tilt * 4))) + 'px"></span></span><span>' + (Math.abs(tilt) <= 2.5 ? 'Dein Foto ist mit ' + String(Math.abs(tilt)).replace('.', ',') + '° fast waagerecht. Passt.' : 'Dein Foto ist etwa ' + String(Math.abs(tilt)).replace('.', ',') + '° schräg. Es geht, gerader wäre besser.') + '</span></div>';
  const kiNote = S.aiOk === false ? noteBox('Die KI-Auswertung der Fotos ist hier gerade nicht eingeschaltet. Das Aufmaß funktioniert trotzdem komplett, nur die Zusatzinfos aus den Fotos fehlen.', null, 'warn') : '';
  const html = hd('Schritt 2 von 6 · Fotos', neu ? 'Fotografiere die Stelle.' : 'Fotografiere ' + ding + '.', (neu ? 'Einmal von innen, einmal von außen: die ganze Wand, an die das neue Element soll, mit etwas Platz drumherum. Danach zeichnest du es auf dem Foto ein.' : 'Einmal von innen, einmal von außen. Die KI liest daraus die Einbausituation für deinen Fensterbauer: Rollladenkasten, Laibung, Fensterbänke, Fassade. Du musst nichts eintippen.') + (p || S.photos.out ? ' Tipp ein Foto an, um es groß anzusehen.' : ''), '', '', schrittTools('einbausituation')) +
    '<div class="tiles">' + photoTile('in') + photoTile('out') + '</div>' + level + kiNote;
  /* ohne Foto steht unten nur „Ohne Foto weiter“ (zweitrangig); mit dem ersten Foto wird daraus der Weg zum nächsten Schritt */
  const keins = !p && !S.photos.out;
  return { html: html, back: ['Start', 'start'], bar: keins ? { label: 'Ohne Foto weiter', act: 'ohne-foto', ghost: true, zurueck: true } : { label: neu ? 'Weiter zum Einzeichnen' : 'Weiter zum Messen', act: 'go', v: neu ? 'zeichnen' : 'messen', zurueck: true } };
};
/* Ohne Foto weiter: einmal ein Hinweis, warum ein Foto besser ist (abschaltbar, aufmass.ohnefoto.zu). Das Fenster merkt sich die Wahl
   (w.ohneFoto), damit der Fensterbauer in der Klärungsliste liest, dass er die Einbausituation vor Ort aufnehmen muss. Die neue
   Öffnung überspringt das Einzeichnen. */
const OHNE_FOTO_ZU = 'aufmass.ohnefoto.zu';
const ohneFotoZu = () => { try { return localStorage.getItem(OHNE_FOTO_ZU) === '1'; } catch (e) { return false; } };
function ohneFotoWeiter() { S.ohneFotoFrage = false; S.win.ohneFoto = true; go(S.win.neu ? 'planmasse' : 'messen'); }
function ohneFotoBlatt() {
  const neu = !!S.win.neu, punkte = neu
    ? ['Du zeichnest das neue Element auf dem Foto ein.', 'Die KI liest Wand, Leitungen und Fassade.', 'Dein Fensterbauer sieht vor dem Termin, wo es hin soll.']
    : ['Die KI liest Rollladenkasten, Laibung, Fensterbänke und Fassade.', 'Sie merkt, wenn Breite und Höhe vertauscht sind.', 'Dein Fensterbauer sieht die Stelle vor dem Termin.'];
  return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="ohne-foto-zu"></button><div class="sheet ofoto" role="dialog" aria-modal="true" aria-labelledby="ofoto-t"><div class="grip"></div>' +
    '<p class="eyebrow kicker" style="margin-top: 6px">Ohne Foto</p><h2 id="ofoto-t" style="margin: 8px 0 18px">' + akH('Mit Foto wird dein Aufmaß besser.') + '</h2>' +
    '<ul class="ofoto-liste">' + punkte.map((t) => '<li>' + CHECK + '<span>' + esc(t) + '</span></li>').join('') + '</ul>' +
    '<p class="ofoto-ohne">' + (neu ? 'Es geht auch ohne: Du gibst die Wunschmaße an, die Lage klärt dein Fensterbauer vor Ort.' : 'Es geht auch ohne: Dann nimmt dein Fensterbauer die Einbausituation vor Ort auf.') + '</p>' +
    '<label class="kcheck"><input type="checkbox" data-in="ohnefoto-zu"' + (ohneFotoZu() ? ' checked' : '') + '><span>Diesen Hinweis nicht mehr anzeigen</span></label>' +
    '<div class="ofoto-knoepfe"><label class="btn primary ofoto-foto"><input type="file" accept="image/*" capture="environment" data-in="photo" data-f="in">Foto machen</label><button type="button" class="btn ghost" data-act="ohne-foto-weiter">Ohne Foto weiter</button></div></div>';
}
/* ---------- Neue Öffnung, Schritt 3: das Element auf dem Foto einzeichnen ----------
   Vier Ecken auf dem Foto, wie beim Scannen eines Dokuments: Außen abgedunkelt, innen ein Raster, die Ecken als große Griffe.
   Beim Ziehen zeigt eine Lupe die Stelle unter dem Finger vergrößert. Die Ecken liegen normiert (0 bis 1) in w.plan.ecken. */
const PLAN_MASS = { fenster: [1230, 1480, 620], balkon: [1010, 2200, 0], fest: [1800, 1400, 620], hst: [2600, 2200, 0], psk: [2000, 2200, 0], fsw: [3600, 2200, 0] };
function planFoto() { const pl = S.win && S.win.plan; if (pl && pl.seite === 'out' && S.photos.out) return S.photos.out; return S.photos.in || S.photos.out || null; }
function planStart(w) {
  const p = planFoto(), m = PLAN_MASS[w.art] || PLAN_MASS.fenster, r = m[0] / m[1], bw = p && p.w || 3, bh = p && p.h || 4, tuer = istTuer(w);
  const wn = tuer ? 0.62 : 0.5, hn = Math.min(0.8, wn * bw / r / bh), cx = 0.5, cy = tuer ? 0.56 : 0.45;
  return { ecken: [[cx - wn / 2, cy - hn / 2], [cx + wn / 2, cy - hn / 2], [cx + wn / 2, cy + hn / 2], [cx - wn / 2, cy + hn / 2]], seite: S.photos.in ? 'in' : 'out', bild: '', bw: bw, bh: bh };
}
function planSicher(w) { if (!w.plan || !Array.isArray(w.plan.ecken) || w.plan.ecken.length !== 4) w.plan = planStart(w); return w.plan; }
/* Raster: Drittel-Linien zwischen gegenüberliegenden Kanten (für einen schiefen Vierer gut genug) */
function planRaster(P) {
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], L = [];
  [1 / 3, 2 / 3].forEach((t) => { L.push([lerp(P[0], P[1], t), lerp(P[3], P[2], t)]); L.push([lerp(P[0], P[3], t), lerp(P[1], P[2], t)]); });
  return L;
}
function zeichnenSVG(w, dw, dh) {
  const P = planSicher(w).ecken.map((e) => [e[0] * dw, e[1] * dh]), pts = P.map((p) => n1(p[0]) + ',' + n1(p[1])).join(' ');
  let h = '<svg class="zeich-svg" data-r="zsvg" viewBox="0 0 ' + n1(dw) + ' ' + n1(dh) + '" width="' + n1(dw) + '" height="' + n1(dh) + '" aria-label="Lage des Elements auf dem Foto">';
  h += '<path class="zdim" data-r="zdim" fill-rule="evenodd" d="M0 0H' + n1(dw) + 'V' + n1(dh) + 'H0Z M' + P.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z"></path>';
  h += '<g class="zgrid" data-r="zgrid">' + planRaster(P).map((l) => '<line x1="' + n1(l[0][0]) + '" y1="' + n1(l[0][1]) + '" x2="' + n1(l[1][0]) + '" y2="' + n1(l[1][1]) + '"></line>').join('') + '</g>';
  h += '<polygon class="zframe-halo" data-r="zhalo" points="' + pts + '"></polygon><polygon class="zframe" data-r="zframe" points="' + pts + '"></polygon>';
  P.forEach((p, i) => { h += '<g class="zcorner" data-c="' + i + '" data-r="zc-' + i + '" transform="translate(' + n1(p[0]) + ' ' + n1(p[1]) + ')"><circle class="hit" r="26"></circle><circle class="dot" r="11"></circle></g>'; });
  return h + '</svg>';
}
SCREENS.zeichnen = () => {
  const w = S.win, p = planFoto();
  if (!p) return { html: hd('Schritt 3 von 6 · Einzeichnen', 'Erst ein Foto.', 'Ohne Foto der Stelle lässt sich nichts einzeichnen.') + '<button type="button" class="btn primary" data-act="go" data-v="fotos" style="align-self: center">Zu den Fotos</button>', back: ['Fotos', 'fotos'] };
  const html = hd('Schritt 3 von 6 · Einzeichnen', 'Zieh es an seinen Platz.', 'Die vier Ecken dorthin ziehen, wo ' + (istTuer(w) ? 'die Tür' : w.art === 'fest' ? 'die Verglasung' : 'das Fenster') + ' hin soll, so wie beim Scannen eines Dokuments.', 'compact', '', schrittTools('neuoeffnung')) +
    '<div class="zeich" data-r="zeich"><img class="zeich-img" src="' + p.url + '" alt="" draggable="false"><div class="zeich-ov" data-r="zov"></div><div class="zlupe" data-r="zlupe" hidden></div><span class="w3d-hint zhint" data-r="zhint">Ecken ziehen · ' + (planSicher(w).seite === 'in' ? 'von innen' : 'von außen') + '</span></div>' +
    '<div class="qrow zrow"><button type="button" class="chip" data-act="plan-rect">Rechteck ausrichten</button><button type="button" class="chip" data-act="plan-reset">Zurücksetzen</button>' + (S.photos.in && S.photos.out ? '<button type="button" class="chip" data-act="plan-seite">' + (planSicher(w).seite === 'in' ? 'Auf dem Außenfoto' : 'Auf dem Innenfoto') + '</button>' : '') + '</div>' +
    '<div class="qnav"><button type="button" class="btn ghost" data-act="go" data-v="fotos" aria-label="Zurück zu den Fotos"><svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></button><button type="button" class="btn primary" data-act="go" data-v="planmasse">Weiter zu den Maßen</button></div>';
  return { html: html, back: ['Fotos', 'fotos'], fit: true };
};
/* Foto passend einpassen (object-fit: contain) und das SVG genau darüber legen */
function zeichnenLayout() {
  const box = document.querySelector('[data-r="zeich"]'), ov = document.querySelector('[data-r="zov"]'), w = S.win, p = planFoto();
  if (!box || !ov || !p) return;
  const W = box.clientWidth, H = box.clientHeight, bw = p.w || 3, bh = p.h || 4, k = Math.min(W / bw, H / bh), dw = bw * k, dh = bh * k, ox = (W - dw) / 2, oy = (H - dh) / 2;
  ov.style.left = px(ox); ov.style.top = px(oy); ov.style.width = px(dw); ov.style.height = px(dh);
  ov.innerHTML = zeichnenSVG(w, dw, dh);
  box._geo = { ox: ox, oy: oy, dw: dw, dh: dh };
}
function zeichnenUpdate(box) {
  const g = box._geo, P = S.win.plan.ecken.map((e) => [e[0] * g.dw, e[1] * g.dh]), q = (r) => box.querySelector('[data-r="' + r + '"]'), pts = P.map((p) => n1(p[0]) + ',' + n1(p[1])).join(' ');
  const dim = q('zdim'); if (dim) dim.setAttribute('d', 'M0 0H' + n1(g.dw) + 'V' + n1(g.dh) + 'H0Z M' + P.map((p) => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z');
  const grid = q('zgrid'); if (grid) Array.from(grid.children).forEach((ln, i) => { const l = planRaster(P)[i]; ln.setAttribute('x1', n1(l[0][0])); ln.setAttribute('y1', n1(l[0][1])); ln.setAttribute('x2', n1(l[1][0])); ln.setAttribute('y2', n1(l[1][1])); });
  ['zhalo', 'zframe'].forEach((r) => { const e = q(r); if (e) e.setAttribute('points', pts); });
  P.forEach((p, i) => { const c = q('zc-' + i); if (c) c.setAttribute('transform', 'translate(' + n1(p[0]) + ' ' + n1(p[1]) + ')'); });
}
function bindZeichnen() {
  const box = document.querySelector('[data-r="zeich"]');
  if (!box || box.getAttribute('data-bound')) return;
  box.setAttribute('data-bound', '1');
  zeichnenLayout();
  const lupe = box.querySelector('[data-r="zlupe"]'), p = planFoto(), Z = 2.6, LR = 48;
  box.addEventListener('pointerdown', (e) => {
    const c = e.target.closest ? e.target.closest('.zcorner') : null, g = box._geo;
    if (!c || !g || (e.button != null && e.button > 0)) return;
    e.preventDefault();
    const i = +c.getAttribute('data-c'), w = S.win, r = box.getBoundingClientRect();
    try { box.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    c.classList.add('is-drag'); if (window.Haptik) window.Haptik.tick();
    const setze = (ev) => {
      const x = clamp((ev.clientX - r.left - g.ox) / g.dw, 0, 1), y = clamp((ev.clientY - r.top - g.oy) / g.dh, 0, 1);
      w.plan.ecken[i] = [x, y]; zeichnenUpdate(box);
      if (lupe) {
        const pxl = x * g.dw, pyl = y * g.dh, oben = pyl - 120 > 0;
        lupe.hidden = false; lupe.style.backgroundImage = 'url(' + p.url + ')'; lupe.style.backgroundSize = px(g.dw * Z) + ' ' + px(g.dh * Z);
        lupe.style.backgroundPosition = px(-(pxl * Z - LR)) + ' ' + px(-(pyl * Z - LR));
        lupe.style.left = px(clamp(g.ox + pxl - LR, 4, box.clientWidth - 2 * LR - 4)); lupe.style.top = px(oben ? g.oy + pyl - 2 * LR - 26 : g.oy + pyl + 30);
      }
    };
    setze(e);
    const move = (ev) => setze(ev);
    const up = () => { box.removeEventListener('pointermove', move); box.removeEventListener('pointerup', up); box.removeEventListener('pointercancel', up); c.classList.remove('is-drag'); if (lupe) lupe.hidden = true; w.plan.bild = ''; };
    box.addEventListener('pointermove', move); box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  });
}
/* Aus den vier Ecken ein achsparalleles Rechteck machen: Mittelwerte der Kanten */
function planRechteck(w) {
  const P = planSicher(w).ecken, xl = (P[0][0] + P[3][0]) / 2, xr = (P[1][0] + P[2][0]) / 2, yo = (P[0][1] + P[1][1]) / 2, yu = (P[2][1] + P[3][1]) / 2;
  w.plan.ecken = [[xl, yo], [xr, yo], [xr, yu], [xl, yu]]; w.plan.bild = '';
}
/* Kleines Bild fürs Aufmaßblatt: Foto mit eingezeichneter Lage, längste Kante 720 px, bleibt auf dem Gerät */
function planBildErzeugen(w) {
  const p = planFoto(), pl = w.plan;
  if (!p || !pl) return Promise.resolve('');
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => {
      try {
        const k = Math.min(1, 720 / Math.max(im.naturalWidth, im.naturalHeight)), cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k);
        const c = cv.getContext('2d'); c.drawImage(im, 0, 0, cv.width, cv.height);
        const P = pl.ecken.map((e) => [e[0] * cv.width, e[1] * cv.height]);
        c.fillStyle = 'rgba(0, 0, 0, .32)'; c.beginPath(); c.rect(0, 0, cv.width, cv.height); c.moveTo(P[0][0], P[0][1]); for (let i = 3; i >= 1; i--) c.lineTo(P[i][0], P[i][1]); c.closePath(); c.fill('evenodd');
        c.beginPath(); P.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath();
        c.lineJoin = 'round'; c.lineWidth = 7; c.strokeStyle = 'rgba(255, 255, 255, .95)'; c.stroke(); c.lineWidth = 3.5; c.strokeStyle = '#0071e3'; c.stroke();
        pl.bild = cv.toDataURL('image/jpeg', 0.82); pl.bw = im.naturalWidth; pl.bh = im.naturalHeight;
      } catch (e) { pl.bild = ''; }
      res(pl.bild);
    };
    im.onerror = () => res('');
    im.src = p.url;
  });
}
/* ---------- Neue Öffnung, Schritt 4: Wunschmaße ---------- */
const FUGE = 15;
function planMasse(w, f, val) {
  const v = clamp(num(val), 300, 6000);
  if (f === 'w') { w.mo.wm = w.mo.wt = w.mo.wb = v; w.el.w = v - 2 * FUGE; w.w = w.el.w; }
  else if (f === 'h') { w.mo.hm = w.mo.hl = w.mo.hr = v; w.el.h = v - 2 * FUGE; w.h = w.el.h; }
  else if (f === 'bru') w.bru = clamp(num(val), 0, 2500);
  else if (f === 'wand') w.wand = clamp(num(val), 0, 1000);
}
function planVorgabe(w) {
  const m = PLAN_MASS[w.art] || PLAN_MASS.fenster, d = derive(w);
  if (!d.moW) planMasse(w, 'w', m[0]); if (!d.moH) planMasse(w, 'h', m[1]);
  if (w.bru === '' || w.bru == null) w.bru = istTuer(w) ? 0 : m[2];
}
SCREENS.planmasse = () => {
  const w = S.win; planVorgabe(w);
  const d = derive(w), tuer = istTuer(w), flaeche = d.moW * d.moH / 1e6;
  const row = (label, f, v, step, g, sub) => '<div class="row"><label><span class="lbl">' + esc(label) + (sub ? '<small class="sb">' + esc(sub) + '</small>' : '') + '</span><span class="val"><input type="text" inputmode="numeric" id="p-' + f + '" data-in="plan" data-f="' + f + '" value="' + (v === '' || v == null ? '' : esc(v)) + '"><span class="unit">mm</span></span></label>' + (g ? '<button type="button" class="ibtn" aria-label="Erklärung" data-act="gloss" data-k="' + g + '">' + ICON_I + '</button>' : '') + '<button type="button" class="rnd" aria-label="Weniger" data-act="plan-bump" data-f="' + f + '" data-v="' + (-step) + '">−</button><button type="button" class="rnd" aria-label="Mehr" data-act="plan-bump" data-f="' + f + '" data-v="' + step + '">+</button></div>';
  const warn = flaeche > (tuer ? 14 : w.art === 'fest' ? 9 : 5) ? noteBox('Sehr groß: ' + flaeche.toFixed(1).replace('.', ',') + ' m². Das geht, braucht aber einen kräftigen Sturz und meist eine Teilung. Dein Fensterbauer berät dazu.', null, 'warn') : '';
  const html = hd('Schritt 4 von 6 · Maße', 'Wie groß soll es werden?', 'Wunschmaße der Rohbauöffnung. Dein Fensterbauer prüft Sturz und Statik und legt das endgültige Maß fest.', '', '', schrittTools('rohbau')) +
    model(w, { id: 'w3d', view: 'result', sway: true, stageH: 280, fitW: 0.56, fitH: 0.6, dims: ['hm', 'wm', 'eh', 'ew'], labels: messLabels(), bg: photoBg(), cls: 'dims-all', hint: 'Orange: Rohbauöffnung · Blau: ' + elName() }) +
    '<div class="card"><p class="eyebrow">Wunschmaß Rohbauöffnung</p><div class="rows">' + row('Breite', 'w', d.moW, 50, 'rohbau') + row('Höhe', 'h', d.moH, 50, 'rohbau') + (tuer ? '' : row('Brüstungshöhe', 'bru', w.bru, 50, 'bruestung', 'Boden bis Unterkante Öffnung')) + row('Wandstärke', 'wand', w.wand, 10, 'wandstaerke', 'falls bekannt') + '</div>' +
    '<p class="sub">Das Element wird ' + FUGE + ' mm je Seite kleiner als die Öffnung: ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm.</p></div>' + warn +
    noteBox('Neue Öffnung in der Wand: Bei tragenden Wänden entscheidet die Statik über Sturz und Größe. Der Fachbetrieb bricht die Öffnung, setzt den Sturz und baut ein.', 'neuoeffnung');
  return { html: html, back: planFoto() ? ['Einzeichnen', 'zeichnen'] : ['Fotos', 'fotos'], bar: { label: 'Maße ansehen', act: 'go', v: 'ergebnis', zurueck: true } };
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
/* Zifferntasten: unten links „Zurück“ (Pfeil mit Wort: voriges Maß bzw. voriger Schritt), in der Mitte die 0, rechts Löschen; darunter „Weiter“ über die
   ganze Breite. Die Tasten sind bewusst kleiner als Knöpfe (42 px), damit das Modell mit der leuchtenden Messkante darüber groß bleibt */
function keypad(okLabel, zurueck, aus, ohneLeiste) {
  return '<div class="keypad" role="group" aria-label="Zifferntasten">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => '<button type="button" data-act="key" data-v="' + d + '">' + d + '</button>').join('') +
    '<span class="kp-leer" aria-hidden="true"></span><button type="button" data-act="key" data-v="0">0</button><button type="button" class="fn" data-act="key" data-v="del" aria-label="Letzte Ziffer löschen">' + KEY_DEL + '</button>' +
    (ohneLeiste ? '</div>' : '<div class="kp-leiste"><button type="button" class="kp-zurueck" data-act="key" data-v="zurueck" aria-label="' + esc(zurueck || 'Zurück') + '">' + PFEIL_L + '</button><button type="button" class="ok' + (aus ? ' aus' : '') + '" data-act="key" data-v="ok"' + (aus ? ' aria-disabled="true"' : '') + '>' + esc(okLabel || 'Weiter') + '</button></div></div>');
}
function numDisplay(cur, id) { return '<div class="num"><b id="' + id + '" class="' + (cur ? '' : 'empty') + '" aria-live="polite">' + (cur ? esc(thousand(cur)) : '0') + '</b><span class="cm" id="' + id + '-cm">' + cmTxt(cur) + '</span><span class="u">mm</span></div>'; }
function setNum(id, cur) { const b = document.getElementById(id), cm = document.getElementById(id + '-cm'); if (b) { b.textContent = cur ? thousand(cur) : '0'; b.classList.toggle('empty', !cur); } if (cm) cm.textContent = cmTxt(cur); }
/* Maße neu gedacht (docs/profis/2026-10-26-masse.md): Im Modell steht nur das Maß, das gerade dran ist, mit seinen beiden Enden und dem
   Eingabefeld auf der Linie; was schon gemessen ist, steht nicht mehr darüber. Übliche Maße je Element (Höhe v, Breite h, dazu ein Beispiel
   fürs leere Feld): nur ein Anhalt, damit Zentimeter auffallen. */
const UEBLICH = { fenster: { v: [500, 2400, 1250], h: [400, 3000, 1100] }, balkon: { v: [1900, 2600, 2150], h: [700, 1400, 900] }, fest: { v: [300, 3000, 1250], h: [300, 4000, 1500] }, hst: { v: [2000, 2700, 2250], h: [2000, 6000, 3500] }, psk: { v: [1900, 2600, 2150], h: [1400, 3500, 2000] }, fsw: { v: [2000, 2700, 2250], h: [1800, 6000, 3500] } };
const ueblich = (dir) => (UEBLICH[S.win.art] || UEBLICH.fenster)[dir];
const endenVon = (st) => (istTuer(S.win) && st.endenTuer ? st.endenTuer : st.enden);
/* Überschrift sagt, was dran ist: „Höhe der Öffnung.“ bzw. „Breite des Fensters.“ (Tür, Element), grün das Ding */
function messTitel(st) {
  const ding = st.who === 'mo' ? 'der Öffnung' : istTuer(S.win) ? 'der Tür' : S.win.art === 'fest' ? 'des Elements' : 'des Fensters', t = ding.split(' ');
  return (st.dir === 'v' ? 'Höhe ' : 'Breite ') + t[0] + ' <span class="ak">' + t[1] + '.</span>';
}
const massGut = (v) => v >= 250 && v <= 6000;
const cmFrage = (v, dir) => { const u = dir ? ueblich(dir) : null; return v > 0 && v * 10 <= 6000 && ((v < 250 && v * 10 >= 250) || (!!u && v < u[0] && v * 10 >= u[0])); };
const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"></path></svg>';
const ICON_HAKEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
/* Über dem Modell: oben links der Hinweis zum Anlegen, unten die Rückfrage (Zentimeter, Warnung, Fehler) mit ihrer Antwort */
function messUeber(chip) {
  return chip === 'nicht' ? '<span class="mu-chip">Nicht am Rahmen messen</span>' : chip === 'samt' ? '<span class="mu-chip">Rahmen außen, nicht Flügel</span>' : '';
}
/* Das Feld auf der Linie ist für Screenreader verborgen; den getippten Wert sagt diese Zeile an */
const wertVorlesen = (cur) => (num(cur) ? thousand(num(cur)) + ' Millimeter' : '');
function wertSetzen(cur) { const e = document.getElementById('mz-wert'); if (e) e.textContent = wertVorlesen(cur); }
/* Die Rückfrage nach Zentimetern kommt erst, wenn eine Weile nichts getippt wird: beim Tippen von 1.410 steht kurz 141 da */
let cmTimer = 0;
function cmSpaeter(st, v, dir, zeigen) { clearTimeout(cmTimer); st.cmLive = false; if (cmFrage(v, dir)) cmTimer = setTimeout(() => { st.cmLive = true; zeigen(); }, ruhig() ? 0 : 800); }
/* ---------- Messen im Raum (26.10.2026, Wunsch des Inhabers, Richtung „Licht im Raum“) ----------
   Das Modell steht über die ganze Höhe im dunklen Raum, Tageslicht fällt durchs Fenster (.raum-licht); über dem Modell steht nur die
   Überschrift. Unten Zurück, „Maß eingeben“ und Info (der Begriff „Wo genau?“). Die Zifferntasten kommen erst auf „Maß eingeben“ als
   Blatt von unten (.mess-pad): neben dem Feld „Bestätigen“, bei Zentimetern „Ja, … mm“, bei einer Warnung „Korrigieren“ und darunter
   „Stimmt so“. Nach dem Bestätigen steht der Wert auf der Linie (antippen ändert ihn), der Knopf heißt „Weiter zu …“. */
const messWert = (st) => num(st.who === 'mo' ? S.win.mo[st.k] : S.win.el[st.k]);
const restWert = (rest) => num(S.win.mo[rest.k]);
function messKopf(titel) { return '<div class="hd compact mess-kopf im-raum"><h1>' + akH(titel) + '</h1></div>'; }
function messDock(label, act, zur, g) {
  return '<div class="mess-dock">' +
    '<button type="button" class="md-rund" data-act="key" data-v="zurueck" aria-label="' + esc(zur) + '">' + PFEIL_L + '</button>' +
    '<button type="button" class="btn primary md-haupt" data-act="' + act + '">' + esc(label) + '<span class="pf" aria-hidden="true"></span></button>' +
    (g && GLOSS[g] ? '<button type="button" class="md-rund md-info" data-act="gloss" data-k="' + g + '" aria-label="Wo genau messen?">' + ICON_I + '</button>' : '') + '</div>';
}
/* Kopf des Blatts in drei Teilen (Feld, Knopf, Zeile), damit beim Tippen nur der geänderte Teil neu gezeichnet wird */
function padTeile(st, dir, pre, gleich) {
  const v = num(st.cur), m = st.msg, cm = m && m.cm ? m.cm / 10 : !m && st.cmLive && cmFrage(v, dir) ? v : 0;
  const bisher = pre === 'mess' ? messWert(MESS[S.mess.step]) : restWert(REST[S.rest.i]);
  const feld = v ? '<span class="mp-wert">' + esc(thousand(v)) + '</span><span class="mp-u">mm</span>' : '<span class="mp-ph">z. B. ' + esc(thousand(ueblich(dir)[2])) + '</span><span class="mp-u">mm</span>';
  let knopf = '', zeile = '';
  if (m && m.cls === 'warn') {
    knopf = '<button type="button" class="mp-ok" data-act="' + pre + '-neu">Korrigieren</button>';
    zeile = '<p class="mp-text warn" role="alert">' + esc(m.text) + '</p><button type="button" class="mp-zweit" data-act="' + pre + '-next" data-ack="1">Stimmt so</button>';
  } else if (cm) {
    knopf = '<button type="button" class="mp-ok" data-act="' + pre + '-cm" data-v="' + cm * 10 + '">Ja, ' + esc(thousand(cm * 10)) + '&nbsp;mm</button>';
    zeile = '<p class="mp-text"><b class="gross">Zollstock zeigt ' + esc(String(cm)) + '&nbsp;cm?</b><span>Bei ' + esc(String(cm)) + ',5&nbsp;cm: ' + esc(String(cm)) + '5 tippen</span></p>';
  } else if (v) {
    knopf = '<button type="button" class="mp-ok' + (massGut(v) ? '' : ' aus') + '" data-act="' + pre + '-next"' + (massGut(v) ? '' : ' aria-disabled="true"') + '>' + ICON_HAKEN + 'Bestätigen</button>';
    zeile = m ? '<p class="mp-text bad" role="alert">' + esc(m.text) + '</p>' : v > 6000 ? '<p class="mp-text bad" role="alert">Höchstens 6.000&nbsp;mm. Bitte in Millimetern.</p>' : massGut(v) ? '<p class="mp-text">= ' + String(Math.round(v) / 10).replace('.', ',') + '&nbsp;cm</p>' : '';
  } else if (bisher) zeile = '<p class="mp-text">Bisher: <b>' + esc(thousand(bisher)) + '&nbsp;mm</b></p><button type="button" class="mp-zweit" data-act="' + pre + '-zu">Behalten</button>';
  else zeile = gleich || '<p class="mp-text">In Millimetern: 125&nbsp;cm = 1.250&nbsp;mm</p>';
  return { feld: feld, knopf: knopf, zeile: zeile };
}
let PAD_NEU = false; // das Blatt kommt nur beim Öffnen von unten, nicht bei jedem Neuzeichnen
function messPad(st, dir, pre, gleich, who) {
  const t = padTeile(st, dir, pre, gleich), neu = PAD_NEU; PAD_NEU = false;
  return '<div class="mess-pad ' + (who || 'mo') + (neu ? ' kommt' : '') + '" id="mess-pad" role="group" aria-label="Maß eingeben"><button type="button" class="mp-griff" data-act="' + pre + '-zu" aria-label="Zifferntasten schließen"><span></span></button>' +
    '<div class="mp-reihe"><div class="mp-feld" id="mp-feld">' + t.feld + '</div><span class="mp-knopf' + (t.knopf ? ' kommt' : '') + '" id="mp-knopf">' + t.knopf + '</span></div>' +
    '<div class="mp-zeile" id="mp-zeile">' + t.zeile + '</div>' + keypad('', '', false, true) +
    '<span class="nur-vorlesen" id="mz-wert" aria-live="polite">' + wertVorlesen(st.cur) + '</span></div>';
}
/* Nur geänderte Teile neu zeichnen; der Knopf blendet nur ein, wenn er neu dazukommt (beim Tippen springt nichts) */
function padSetzen(st, dir, pre, gleich) {
  const t = padTeile(st, dir, pre, gleich);
  ['feld', 'knopf', 'zeile'].forEach((k) => {
    const e = document.getElementById('mp-' + k); if (!e) return;
    const alt = e._h != null ? e._h : e.innerHTML;
    if (alt !== t[k]) { e._h = t[k]; e.innerHTML = t[k]; if (k === 'knopf') { e.classList.remove('kommt'); if (!alt && t[k]) { void e.offsetWidth; e.classList.add('kommt'); } } }
  });
}
function messOpts(step, cur) {
  const k = dimKey(step), fertig = !S.mess.pad && !!messWert(step);
  return { id: 'w3d', view: 'three', sway: !cur, showEl: S.mess.step >= 1, dims: [k], active: k, labels: messLabels(), feld: { v: fertig ? messWert(step) : '', ph: ueblich(step.dir)[2], aus: !fertig, tipp: fertig, act: 'mess-auf' }, enden: endenVon(step), fitW: step.dir === 'v' ? 0.72 : 0.64, fitH: 0.62, noZoom: true, stageH: 'auto', bg: photoBg(), ueber: messUeber(step.chip), cls: 'raum-licht' };
}
function liveWin(step, cur) {
  const w = JSON.parse(JSON.stringify(S.win)), v = num(cur);
  if (v >= 250 && v <= 6000) { if (step.who === 'mo') w.mo[step.k] = v; else { w.el[step.k] = v; w[step.k] = v; } }
  return w;
}
SCREENS.messen = () => {
  const m = S.mess, step = MESS[m.step], fertig = !m.pad && !!messWert(step);
  const html = messKopf(messTitel(step)) + model(liveWin(step, m.cur), messOpts(step, m.cur)) +
    (m.pad ? messPad(m, step.dir, 'mess', '', step.who) : messDock(fertig ? (m.step < 3 ? 'Weiter zu Maß ' + (m.step + 2) : 'Weiter zu den Rändern') : 'Maß eingeben', fertig ? 'mess-weiter' : 'mess-auf', m.step ? 'Voriges Maß' : 'Zurück zu den Fotos', step.g));
  return { html: html, back: [m.step ? 'Zurück' : 'Fotos', m.step ? 'mess-prev' : 'fotos'], fit: true, cls: 'im-raum' + (m.pad ? ' mit-tasten' : '') };
};
function messInput(v) {
  const m = S.mess; m.cur = String(v).replace(/[^\d]/g, '').slice(0, 5);
  const step = MESS[m.step], stage = document.getElementById('w3d'), n = num(m.cur);
  if (stage) { const o = messOpts(step, m.cur); W3DS.w3d = { w: liveWin(step, m.cur), o: o }; w3dLayout(stage, W3DS.w3d.w, o); stage.classList.toggle('is-live', o.sway); }
  const kopf = () => padSetzen(m, step.dir, 'mess');
  kopf(); wertSetzen(m.cur);
  cmSpaeter(m, n, step.dir, () => { if (S.screen === 'messen' && S.mess === m) kopf(); });
}
/* Bestätigen: prüfen, speichern, Blatt zu; der Wert steht danach auf der Linie */
function messNext(ack) {
  const m = S.mess, step = MESS[m.step], vals = { hm: S.win.mo.hm, wm: S.win.mo.wm }, chk = checkValue(m.cur, step, vals);
  if (!chk.ok) { m.pad = true; m.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; if (window.Haptik) window.Haptik.fehler(); render(); return; }
  if (chk.warn && !ack) { m.pad = true; m.msg = { cls: 'warn', text: chk.warn }; render(); return; }
  const v = num(m.cur);
  if (step.who === 'mo') S.win.mo[step.k] = v; else { S.win.el[step.k] = v; S.win[step.k] = v; }
  m.msg = null; m.cur = String(v); m.cmLive = false; m.pad = false; clearTimeout(cmTimer); S._feier = 'wert';
  render();
}
function messWeiter() {
  const m = S.mess; m.pad = false; m.msg = null; m.cmLive = false; clearTimeout(cmTimer);
  if (m.step < 3) { m.step++; m.cur = String(messWert(MESS[m.step]) || ''); render(true); }
  else go('rest');
}
function messAuf() { const m = S.mess; PAD_NEU = !m.pad; m.pad = true; m.msg = null; m.cmLive = false; m.cur = ''; render(); }
function messZu() { const m = S.mess; clearTimeout(cmTimer); m.pad = false; m.msg = null; m.cmLive = false; m.cur = String(messWert(MESS[m.step]) || ''); render(); }
function messPrev() { const m = S.mess; if (m.pad) return messZu(); if (m.step > 0) { m.step--; const st = MESS[m.step]; m.cur = String(messWert(st) || ''); m.msg = null; S.dir = 'back'; render(true); } else go('fotos', 'back'); }
/* ---------- Ränder: die vier übrigen Maße der Öffnung, am Modell ---------- */
const restDir = (rest) => (rest.k[0] === 'h' ? 'v' : 'h');
/* „Wie Mitte“ als leiser Verweis und als Frage: Ein Tipp sagt „hier auch so gemessen“, nicht „übernimm das“ (Gremium, Datenqualität) */
const gleichHTML = (ref) => '<button type="button" class="mz-gleich" data-act="rest-same" data-v="' + num(ref) + '">Hier auch ' + thousand(ref) + '&nbsp;mm gemessen?</button>';
function restOpts(rest, cur) {
  if (!rest) return { id: 'w3d', view: 'three', sway: true, dims: ['hm', 'wm'].concat(REST.map((x) => x.k)), active: '', labels: messLabels(), stageH: 300, fitW: 0.7, fitH: 0.7, noZoom: true, bg: photoBg(), cls: 'dims-all ohne-schilder passt-buehne' };
  const fertig = !S.rest.pad && !!restWert(rest);
  return { id: 'w3d', view: 'three', sway: !cur, dims: [rest.k], active: rest.k, labels: messLabels(), feld: { v: fertig ? restWert(rest) : '', ph: ueblich(restDir(rest))[2], aus: !fertig, tipp: fertig, act: 'rest-auf' }, enden: endenVon(rest), fitW: restDir(rest) === 'v' ? 0.72 : 0.64, fitH: 0.62, noZoom: true, stageH: 'auto', bg: photoBg(), ueber: messUeber('nicht'), cls: 'raum-licht' };
}
/* „Passt.“ nach dem letzten Rand (26.10.2026): das Modell über die ganze Breite ohne Schilder, darunter groß das Maß, das zählt
   (Öffnung orange, Element blau), und je Richtung die drei Messungen; das kleinste trägt einen grünen Punkt */
function passtMasse(w, d) {
  const mo = w.mo, spalte = (titel, reihen) => {
    const vs = reihen.map((x) => num(x[1])), lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
    return '<div class="ps-sp"><p class="ps-lab">' + titel + '</p>' + reihen.map((x, i) => '<p class="ps-reihe' + (hi > lo && vs[i] === lo ? ' klein' : '') + '"><span>' + x[0] + '</span><i style="--l: ' + (hi > lo ? Math.round(56 + 44 * (vs[i] - lo) / (hi - lo)) : 100) + '%"></i><b>' + esc(thousand(vs[i])) + '</b></p>').join('') + '</div>';
  };
  const dev = Math.max(d.devW, d.devH);
  return '<section class="passt-masse">' +
    '<p class="ps-lab">Maueröffnung · Breite × Höhe</p><p class="ps-zahl"><b>' + esc(thousand(d.moW)) + ' × ' + esc(thousand(d.moH)) + '</b><span>mm</span></p>' +
    '<p class="ps-el"><span class="ps-lab">' + esc(artName(w)) + ' mit Rahmen</span><b>' + esc(thousand(d.elW)) + ' × ' + esc(thousand(d.elH)) + '</b><span>mm</span></p>' +
    '<div class="ps-drei"><h2>Dreimal gemessen, das kleinste zählt</h2><div class="ps-spalten">' + spalte('Breite', [['oben', mo.wt], ['Mitte', mo.wm], ['unten', mo.wb]]) + spalte('Höhe', [['links', mo.hl], ['Mitte', mo.hm], ['rechts', mo.hr]]) + '</div>' +
    '<p class="ps-fuss">' + (dev ? 'Höchstens ' + dev + '&nbsp;mm Unterschied, überhöht gezeichnet.' : 'Alle drei Maße sind gleich.') + '</p></div></section>';
}
SCREENS.rest = () => {
  const r = S.rest, rest = r.i < 4 ? REST[r.i] : null;
  if (!rest) {
    const d = derive(S.win), dev = Math.max(d.devW, d.devH);
    const html = '<div class="hd compact passt-kopf"><h1><span class="ak">Passt.</span></h1><p>' + (dev > 10 ? 'Bis ' + dev + '&nbsp;mm außer Winkel. Das kleinste Maß zählt.' : 'Deine Öffnung ist gerade.') + '</p></div>' + model(S.win, restOpts(null)) + passtMasse(S.win, d);
    return { html: html, back: ['Zurück', 'rest-prev'], cls: 'passt', bar: { label: 'Weiter zum Ergebnis<span class="pf" aria-hidden="true"></span>', act: 'go', v: 'ergebnis', zurueck: true } };
  }
  const fertig = !r.pad && !!restWert(rest), ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm;
  const html = messKopf(esc(rest.title) + '.') + model(S.win, restOpts(rest, r.cur)) +
    (r.pad ? messPad(r, restDir(rest), 'rest', gleichHTML(ref), 'mo') : messDock(fertig ? (r.i < 3 ? 'Weiter zu Rand ' + (r.i + 2) : 'Fertig') : 'Maß eingeben', fertig ? 'rest-weiter' : 'rest-auf', r.i ? 'Voriger Rand' : 'Zurück zum Messen', 'raender'));
  return { html: html, back: r.i ? ['Zurück', 'rest-prev'] : ['Messen', 'mess-back'], fit: true, cls: 'im-raum' + (r.pad ? ' mit-tasten' : '') };
};
/* Pfeil zurück bei den Rändern: voriger Rand mit seinem Wert, vom ersten Rand zurück zum letzten Maß */
function restPrev() {
  const r = S.rest;
  if (r.pad) return restZu();
  if (r.i > 0) { r.i--; r.cur = String(num(S.win.mo[REST[r.i].k]) || ''); r.msg = null; S.dir = 'back'; return render(true); }
  S.mess.step = 3; S.mess.pad = false; S.mess.cur = String(S.win.el[MESS[3].k] || ''); S.mess.msg = null; return go('messen', 'back');
}
function restInput(v) {
  const r = S.rest; r.cur = String(v).replace(/[^\d]/g, '').slice(0, 5);
  const rest = REST[r.i], stage = document.getElementById('w3d'), n = num(r.cur); if (!rest) return;
  if (stage) { const o = restOpts(rest, r.cur); W3DS.w3d = { w: S.win, o: o }; w3dLayout(stage, S.win, o); stage.classList.toggle('is-live', o.sway); }
  const ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm, kopf = () => padSetzen(r, restDir(rest), 'rest', gleichHTML(ref));
  kopf(); wertSetzen(r.cur);
  cmSpaeter(r, n, restDir(rest), () => { if (S.screen === 'rest' && S.rest === r) kopf(); });
}
function restNext(ack) {
  const r = S.rest, rest = REST[r.i], ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm, chk = checkRest(r.cur, ref);
  if (!chk.ok) { r.pad = true; r.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; if (window.Haptik) window.Haptik.fehler(); render(); return; }
  if (chk.warn && !ack) { r.pad = true; r.msg = { cls: 'warn', text: chk.warn }; render(); return; }
  S.win.mo[rest.k] = num(r.cur); r.cur = String(num(r.cur)); r.msg = null; r.cmLive = false; r.pad = false; clearTimeout(cmTimer); S._feier = 'wert';
  render();
}
function restWeiter() {
  const r = S.rest; r.pad = false; r.msg = null; r.cmLive = false; clearTimeout(cmTimer); r.i++;
  r.cur = r.i < 4 ? String(restWert(REST[r.i]) || '') : '';
  if (r.i >= 4) S._feier = 'masse';
  render(true);
}
function restAuf() { const r = S.rest; PAD_NEU = !r.pad; r.pad = true; r.msg = null; r.cmLive = false; r.cur = ''; render(); }
function restZu() { const r = S.rest; clearTimeout(cmTimer); r.pad = false; r.msg = null; r.cmLive = false; r.cur = String(restWert(REST[r.i]) || ''); render(); }
/* ---------- Ergebnis ---------- */
SCREENS.ergebnis = () => {
  const w = S.win, d = derive(w), ki = S.win.ki, neu = !!w.neu, en = artName(w);
  const tMo = neu ? 'Wunschmaß Rohbau' : 'kleinstes von 3', tEl = neu ? 'rechnerisch, mit Rahmen' : 'sichtbar mit Rahmen';
  const res = '<div class="card"><p class="eyebrow">Ergebnis</p><div class="result">' +
    '<div><span class="k">Maueröffnung Breite</span><span class="v" style="color: var(--mo)">' + thousand(d.moW) + '<small> mm</small></span><span class="tag" style="background: var(--mo-soft); color: var(--mo)">' + tMo + '</span></div>' +
    '<div><span class="k">Maueröffnung Höhe</span><span class="v" style="color: var(--mo); animation-delay: .1s">' + thousand(d.moH) + '<small> mm</small></span><span class="tag" style="background: var(--mo-soft); color: var(--mo)">' + tMo + '</span></div>' +
    '<div><span class="k">' + esc(en) + ' Breite</span><span class="v" style="color: var(--el); animation-delay: .2s">' + thousand(d.elW) + '<small> mm</small></span><span class="tag" style="background: var(--el-soft); color: var(--el)">' + tEl + '</span></div>' +
    '<div><span class="k">' + esc(en) + ' Höhe</span><span class="v" style="color: var(--el); animation-delay: .3s">' + thousand(d.elH) + '<small> mm</small></span><span class="tag" style="background: var(--el-soft); color: var(--el)">' + tEl + '</span></div></div>' +
    (!neu && (d.devW > 10 || d.devH > 10) ? '<p class="sub">Bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel, alle sechs Einzelmaße stehen im Aufmaßblatt.</p>' : '') + '</div>';
  /* Maße gegen das Foto: vertauscht oder stark abweichend? Dann fragen, bevor es weitergeht (nie bei der neuen Öffnung) */
  const mp = !neu && !w.massOk ? AW.massPruef(w) : null;
  const massHinweis = mp ? '<div class="msg warn mass-pruef" role="status">' + (mp.typ === 'tausch' ? 'Auf dem Foto ist ' + (istTuer(w) ? 'die Tür' : 'das Fenster') + ' eher ' + (mp.rk < 1 ? 'hoch als breit' : 'breit als hoch') + ', deine Maße sagen das Gegenteil. Breite und Höhe vertauscht?' : 'Das Foto wirkt anders proportioniert als deine Maße. Bitte miss noch einmal nach.') +
    '<div class="pill-row">' + (mp.typ === 'tausch' ? '<button type="button" class="pill" data-act="mass-tausch">Tauschen</button>' : '<button type="button" class="pill" data-act="mass-nach">Nachmessen</button>') + '<button type="button" class="pill" data-act="mass-ok">Stimmt so</button></div></div>' : '';
  /* Aus den Fotos: nur die Zahl, kein Inhalt (die Auswertung steht im Aufmaßblatt bzw. geht an den Betrieb) */
  const teaser = ki && ((ki.rows || []).length || (ki.chips || []).length) ? '<div class="teaser ki-zahl"><p class="eyebrow">Aus deinen Fotos</p><p class="sub">' + CHECK + '<span>' + esc(kiAnzahl(ki) + (S.betrieb ? ' gehen mit deinem Aufmaß an ' + (S.betrieb.name || 'deinen Fensterbauer') + '.' : ' stehen in deinem Aufmaßblatt.')) + '</span></p></div>'
    : (S.ai.in && S.ai.in.status === 'running' ? '<div class="teaser"><p class="eyebrow">Aus deinen Fotos</p><p class="sub" style="display: flex; align-items: center; gap: 10px"><span class="spin dark"></span>Die KI liest noch die Einbausituation aus den Fotos.</p></div>' : '');
  /* Im Modell nur die vier Hauptmaße zum Prüfen beim Messen; die Ränder stehen im Aufmaßblatt */
  const html = hd('Schritt 5 von 6 · Ergebnis', neu ? 'Dein Wunsch steht.' : 'Dein Aufmaß steht.', neu ? 'Rohbauöffnung und Element als Wunschmaße' + (w.plan && w.plan.bild ? ', die Lage auf deinem Foto' : '') + '. Das endgültige Maß legt der Fachbetrieb nach der Statik fest.' : 'Maueröffnung und ' + esc(elName()) + ', so wie der Fensterbauer sie fürs Angebot braucht.', '', '', schrittTools('rahmenmass')) + model(w, { id: 'w3d', view: 'result', sway: true, dims: ['hm', 'wm', 'eh', 'ew'], labels: messLabels(), stageH: 300, fitW: 0.56, fitH: 0.6, cls: 'dims-all', bg: photoBg(), hint: 'Zum Drehen ziehen' }) + res + massHinweis + teaser +
    (neu && w.plan && w.plan.bild ? '<div class="card plan-card"><p class="eyebrow">Lage auf deinem Foto</p><button type="button" class="plan-gross" data-act="foto-gross" data-v="plan" aria-label="Lage auf dem Foto groß ansehen"><img class="plan-bild" src="' + w.plan.bild + '" alt="Foto der Wand mit eingezeichneter Lage"><span class="tile-lupe" aria-hidden="true">' + LUPE_S + '</span></button><div class="pill-row"><button type="button" class="pill" data-act="go" data-v="zeichnen">Lage ändern</button><button type="button" class="pill" data-act="go" data-v="planmasse">Maße ändern</button></div></div>' : '') +
    '<details class="card fold"><summary><span>Falls zur Hand<small>Brüstungshöhe und Laibungstiefe, sonst beim Feinaufmaß</small></span></summary><div class="fold-body"><div class="rows">' + fieldRow('Brüstungshöhe', 'bru', 'mm', 10, 'bruestung') + fieldRow('Laibungstiefe innen', 'laib', 'mm', 5, 'laibung', ki && ki.laib && !w.e_laib ? 'KI-Schätzung' : '') + '</div></div></details>';
  /* über „Maße ändern“ geöffnet: oben „Fenster“ zur Übersicht aller Fenster (wie in den Wünschen), die Zurück-Taste zur Seite des Fensters */
  return { html: html, back: einstiegHier() ? ['Fenster', 'fertig', 'liste'] : neu ? ['Maße', 'planmasse'] : ['Ränder', 'rest'], cls: 'tight', bar: { label: istTuer(w) ? 'Weiter: Wunschtür' : 'Weiter: Wünsche', act: 'wuensche', zurueck: true } };
};

/* ---------- Wunschfenster: das Modell wird konfiguriert ---------- */
/* ---------- Zusammenfassung, Anfrage, Aufmaßblatt ---------- */
const MAL = ['keinmal', 'einmal', 'zweimal', 'dreimal', 'viermal'];
SCREENS.fertig = () => {
  const w = S.win, lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'deinen Fensterbauer') : '', gespeichert = S.windows[S.editIdx] || w;
  const st = aendStand(gespeichert), nz = Object.keys(gespeichert.notizen || {}).length;
  /* Nach dem Speichern keine Gesamtübersicht (Entscheidung des Inhabers): nur Symbol, Name, Position, Elementart und Stand. Maße,
     Wünsche und die Auswertung der Fotos stehen im Aufmaßblatt bzw. gehen an den Betrieb; hier gibt es nichts zum Abfotografieren */
  const zu = st.fest ? ' aria-disabled="true"' : '';
  const aend = st.fest ? noteBox(festText(st) + ' ' + (lk ? 'Änderungen klärst du direkt mit ' + esc(bn) + '.' : 'Brauchst du etwas anders, legst du es als neues Fenster an.'), null, 'warn')
    : !st.frei ? noteBox((st.kauf ? 'Seit dem Freischalten' : 'Seit dem ' + esc(datumKurz(st.bis))) + ' kannst du dieses Fenster noch ' + MAL[st.rest] + ' ändern. Jedes Speichern mit einer Änderung zählt.', null, 'warn')
    : st.inst ? '<p class="sub aend-frei">Bis zum Senden kannst du dieses Fenster beliebig ändern.</p>'
    : st.nb ? '<p class="sub aend-frei">Während der Nachbesserung kannst du dieses Fenster frei ändern, darum hat ' + esc(bn) + ' gebeten.</p>'
    : '<p class="sub aend-frei">Bis zum ' + esc(datumKurz(st.bis)) + ' kannst du dieses Fenster beliebig ändern, danach noch viermal.</p>';
  const angaben = 'Maße, Wünsche' + (nz ? ', deine ' + (nz === 1 ? 'Notiz' : nz + ' Notizen') : '') + ' und die Auswertung der Fotos';
  const html = '<div class="center fertig-kopf links"><span class="fertig-ic">' + svgIcon(miniWin(w), 84) + '</span><p class="eyebrow" style="color: var(--ok)">' + CHECK + ' Gespeichert · Position ' + (S.editIdx + 1) + '</p><h1 style="margin: 10px 0 0">' + esc(w.name || 'Fenster') + '</h1><p class="fertig-stand" style="margin: 8px 0 0">' + esc(lab('art', w.art || 'fenster') + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stück' : '') + ' · ' + fensterStatus(gespeichert)) + '</p></div>' +
    (kiLaeuftFuer(gespeichert) || kiLaeuftFuer(w) ? kiLaeuftKarte('Die KI liest noch die Einbausituation. Die Auswertung kommt von selbst zu diesem Fenster.') : '') +
    '<section class="card weiter-karte"><p class="eyebrow">Wie geht es weiter?</p><p>' + (lk ? 'Noch ein Fenster? Dann tipp auf „Weiteres Fenster“. Alles erfasst? Dann weiter zum Absenden.' : 'Noch ein Fenster? Dann tipp auf „Weiteres Fenster“. Alles erfasst? Dann weiter zu deinem Aufmaßblatt.') + '</p><p class="sub">' + esc(angaben) + (lk ? ' gehen mit deinem Aufmaß an ' + esc(bn) + '.' : ' stehen in deinem Aufmaßblatt.') + '</p></section>' + aend +
    '<div class="pill-row grid2"><button type="button" class="pill" data-act="go" data-v="ergebnis"' + zu + '>Maße ändern</button><button type="button" class="pill" data-act="wuensche"' + zu + '>Wünsche ändern</button><button type="button" class="pill" data-act="copywin">Kopieren</button><button type="button" class="pill danger" data-act="delwin">Löschen</button></div>' +
    /* Gezielt ein Thema nachschärfen: direkt zum Kapitel, in der gewählten Tiefe */
    (st.fest ? '' : '<div class="kap-sprung"><p class="qlabel">Direkt zu einem Thema</p><div class="kap-chips">' + KAPITEL.slice(1).map((k) => '<button type="button" class="chip" data-act="wuensche" data-v="' + k.k + '">' + esc(k.n) + '</button>').join('') + '</div></div>') +
    '<button type="button" class="pill voll" data-act="go" data-v="home">Alle Fenster ansehen (' + S.windows.length + ')</button>' +
    (lk ? '<p class="sub center" style="padding: 0 10px">' + (instWebsite() ? 'Gespeichert, auch für später: Öffne diese Seite wieder, dann geht es weiter.' : 'Gespeichert, auch für später: Über den Link von ' + esc(bn) + ' kommst du jederzeit zurück.') + '</p>' : '');
  return { html: html, back: ['Fenster', 'home'], bar: { label: lk ? 'Zum Absenden' : 'Zum Aufmaßblatt', act: 'go', v: 'anfrage', sec: 'Weiteres Fenster', secAct: 'new' } };
};
/* Anfrage: zwei kurze Seiten im Link, drei ohne Link (dann mit Kontakt) */
const anfrageHead = (step, lk) => lk ? 'Fast fertig · ' + step + ' von ' + (instWebsite() ? 3 : 2) : 'Fürs Angebot · ' + step + ' von 3'; // Instanz, Website: dazu der Kontakt
/* Was der gewählte Förderweg bedeutet (Quellen: BAFA, BEG EM; § 35c EStG mit ESanMV; docs/GESTALTUNG.md) */
const FOERD_HINWEIS = {
  bafa: '15 % Zuschuss vom BAFA. Ein Energieeffizienz-Experte begleitet den Antrag, gestellt wird er vor Beginn der Arbeiten; den Vertrag erst mit Förderklausel unterschreiben. Die Fenster müssen gut dämmen (Uw höchstens 0,95). Dein Fensterbauer plant das ein.',
  steuer: '20 % der Kosten über drei Jahre von der Steuer abziehen, wenn du selbst im Haus wohnst und es älter als zehn Jahre ist. Dein Fensterbauer stellt die Bescheinigung aus; die Fenster müssen gut dämmen (Uw höchstens 0,95).',
  offen: 'Dein Fensterbauer zeigt dir beide Wege: Zuschuss vom BAFA oder Steuerbonus. Für den Zuschuss muss der Antrag vor Beginn gestellt sein.'
};
/* Klärungsliste (Regeln in modell.js): was dein Fensterbauer mit dir klärt, bevor er anbietet */
const klaerListe = (windows, pr) => AW.klaerung(windows, pr);
SCREENS.anfrage = () => {
  const pr = S.proj, replaced = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0), lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'dein Fensterbauer') : 'der Fensterbauer';
  let html = hd(anfrageHead(1, lk), 'Noch kurz zum Haus.', 'Damit ' + esc(bn) + ' gut planen kann. Alles freiwillig.', '', '', schrittTools('angaben'));
  html += '<div class="sec">' + secHead('Gebäude', 'gebaeude') + chips('gebaeude', pr.gebaeude, 'gebaeude', 'setp') + '</div>';
  if (pr.gebaeude === 'denkmal') html += noteBox('Bei Denkmalschutz brauchst du meist eine Genehmigung. Material und Sprossen können vorgeschrieben sein.', 'echt', 'warn');
  html += '<div class="sec">' + secHead('Baujahr des Hauses', 'baujahr') + chips('baujahr', pr.baujahr, 'baujahr', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Fenster im ganzen Haus', 'lueftung', 'Du tauschst ' + replaced + ' davon.') + '<div class="rows"><div class="row"><label><span class="lbl">Insgesamt</span><span class="val"><input type="text" inputmode="numeric" id="p-total" data-in="p" data-f="total" value="' + esc(pr.total) + '" placeholder="z. B. 12"><span class="unit">Stück</span></span></label><button type="button" class="rnd" aria-label="Weniger" data-act="bumpp" data-v="-1">−</button><button type="button" class="rnd" aria-label="Mehr" data-act="bumpp" data-v="1">+</button></div></div></div>';
  if (num(pr.total) && replaced > num(pr.total) / 3) html += noteBox('Du tauschst ' + replaced + ' von ' + (num(pr.total) || 0) + ' Fenstern, mehr als ein Drittel. Dann ist ein Lüftungskonzept nach DIN 1946-6 erforderlich; darum kümmert sich dein Fensterbauer.', 'lueftung', 'warn');
  return { html: html, back: ['Aufmaß', 'home'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage2', zurueck: true } };
};
SCREENS.anfrage2 = () => {
  const pr = S.proj, lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'dein Fensterbauer') : '';
  const web = instWebsite(); // Instanz, Website: der Betrieb kennt den Kunden noch nicht, danach kommt der Kontakt
  let html = hd(anfrageHead(2, lk), 'Zeit und Budget.', lk && !web ? 'Freiwillig. Deine Kontaktdaten hat ' + esc(bn) + ' schon.' : 'Freiwillig, hilft beim Angebot.', '', '', schrittTools('zeitraum'));
  html += '<div class="sec">' + secHead('Wann soll es losgehen?', 'zeitraum') + chips('zeit', pr.zeit, 'zeit', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Budget', 'budget') + chips('budget', pr.budget, 'budget', 'setp') + '</div>';
  /* Förderweg früh klären: Er ändert das Angebot (Zielwerte, Energieeffizienz-Experte, Bescheinigung) */
  const fw = AW.foerdWeg(pr);
  html += '<div class="sec">' + secHead('Förderung', 'foerderung') + chips('foerdweg', fw, 'foerdweg', 'setp') + '</div>';
  if (FOERD_HINWEIS[fw]) html += noteBox(FOERD_HINWEIS[fw]);
  if (lk) { html += '<div class="sec">' + secHead('Nachricht an ' + bn, null, web ? 'Freiwillig, zum Beispiel was dir wichtig ist.' : 'Freiwillig, zum Beispiel wann du erreichbar bist.') + '<div class="rows">' + textRow('Nachricht', 'notiz', 'z. B. Rollladen im Bad klemmt', 'text', 'p') + '</div></div>'; return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: web ? { label: 'Weiter', act: 'go', v: 'anfrage3', zurueck: true } : { label: 'Prüfen und senden', act: 'go', v: 'blatt', zurueck: true } }; }
  return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage3', zurueck: true } };
};
SCREENS.anfrage3 = () => {
  if (instWebsite()) return instAnfrage3();
  const pr = S.proj;
  let html = hd(anfrageHead(3, false), 'Wie erreicht dich dein Fensterbauer?', 'Steht auf dem Aufmaßblatt, damit er sich mit dem Angebot melden kann. Alles freiwillig; das Blatt bekommt nur, wem du es gibst.', '', '', schrittTools('kontakt'));
  html += '<div class="sec"><div class="rows">' + textRow('Name', 'name', 'Vor- und Nachname', 'text', 'p') + textRow('PLZ und Ort', 'ort', 'z. B. 50667 Köln', 'text', 'p') + textRow('Telefon', 'tel', 'Für Rückfragen', 'tel', 'p') + textRow('E-Mail', 'mail', 'name@beispiel.de', 'email', 'p') + '</div></div>';
  html += '<div class="sec">' + secHead('Am besten erreichbar') + chips('erreich', pr.erreich, 'erreich', 'setp') + '</div>';
  return { html: html, back: ['Zurück', 'anfrage2'], cls: 'tight', bar: { label: 'Zum Aufmaßblatt', act: 'go', v: 'teilen', zurueck: true } };
};
function blattMarkdown(windows, pr) {
  const fw = AW.foerdWeg(pr), kl = klaerListe(windows, pr);
  const lines = ['# Aufmaßblatt · ' + (pr.name || '[Name]'), (pr.ort || '') + (pr.tel ? ' · ' + pr.tel : '') + (pr.mail ? ' · ' + pr.mail : ''), '', 'Gebäude: ' + lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '') + ' · Zeitraum: ' + lab('zeit', pr.zeit) + ' · Budget: ' + lab('budget', pr.budget) + (fw ? ' · Förderung: ' + lab('foerdweg', fw) : ''), ''];
  if (kl.length) { lines.push('## Noch zu klären'); kl.forEach((r) => lines.push('- **' + r.k + ':** ' + r.v)); lines.push(''); }
  windows.forEach((x, i) => {
    const d = derive(x);
    lines.push('## Pos. ' + (i + 1) + ' · ' + (x.name || 'Fenster') + ' · ' + (num(x.anzahl) || 1) + ' Stk.');
    lines.push('Maueröffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm · Fensterelement ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm', '');
    specRows(x).forEach((r) => lines.push('- **' + r.k + ':** ' + r.v));
    if (x.ki && ((x.ki.rows && x.ki.rows.length) || x.ki.fach)) { lines.push('', '### Einbausituation aus den Fotos (KI)'); AW.kiRows(x).forEach((r) => lines.push('- **' + r[0] + ':** ' + r[1])); }
    lines.push('');
  });
  lines.push('Erfasst mit eeziframes. Vor der Fertigung Feinaufmaß vor Ort.');
  return lines.join('\n');
}
SCREENS.blatt = () => {
  const lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'deinen Fensterbauer') : '', paid = !lk && FREI();
  if (!lk && !paid) return SCREENS.teilen();
  /* Freigeschaltet: Das Aufmaßblatt gibt es als PDF (Herunterladen, Teilen), eine Gesamtansicht in der App gibt es nicht */
  if (paid) return SCREENS.teilen();
  if (S.sent && PILOT) return SCREENS.gesendet();
  if (S.sent && INST) return instGesendet();
  if (S.sent) return { html: hd('Gesendet', 'Schon unterwegs.', esc(bn) + ' hat dein Aufmaß seit ' + esc(sentWhen()) + '.') + dateiCard(), back: ['Start', 'home'], bar: null };
  const voll = S.windows.filter((x) => derive(x).complete).length, fehlt = S.windows.length - voll;
  const html = hd('Prüfen', 'Alles vollständig?', 'Deine Fenster mit allen Maßen und Wünschen, dazu die Auswertung der Fotos, gehen nur an ' + esc(bn) + '. Tipp ein Fenster an, um es zu prüfen oder zu ändern.') +
    (fehlt ? '<div class="msg ' + (voll ? 'warn' : 'bad') + '">' + (voll ? fehlt + (fehlt === 1 ? ' Fenster hat' : ' Fenster haben') + ' noch keine vollständigen Maße. Du kannst trotzdem senden, ' + esc(bn) + ' sieht dann, was fehlt.' : (S.windows.length ? 'Noch kein Fenster ist vollständig gemessen. Tipp ein Fenster an und trag die fehlenden Maße nach.' : 'Noch kein Fenster erfasst.')) + '</div>' : '') +
    entwurfWarnung() +
    '<div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => checkCard(x, i)).join('') + '</div>' +
    (kiLaeuftFuer() ? kiLaeuftKarte('Die Auswertung der Fotos kommt gleich dazu. Wer jetzt sendet, wartet kurz, damit sie mitgeht.') : '') +
    (INST ? '<p class="sub" style="padding: 0 6px">Nach dem Senden bekommst du sofort eine Bestätigung' + (INST_M.kopieKunde ? ' und deine Anfrage als PDF' : '') + '. Ändern kannst du danach nur noch direkt mit ' + esc(bn) + '.</p>'
      : '<p class="sub" style="padding: 0 6px">Nach dem Absenden ist der Link erledigt. Ändern kannst du danach nur noch über ' + esc(bn) + '.</p>');
  return { html: html, back: ['Zurück', instWebsite() ? 'anfrage3' : 'anfrage2'], bar: { zurueck: true, label: S.kiWartet === 'senden' ? S.warteText || 'Einen Moment …' : (S.nb ? 'Erneut an ' : 'An ') + esc(bn) + ' senden', act: 'send', dis: !voll || S.kiWartet === 'senden' } };
};
/* Übersicht vor dem Senden: vollständig oder nicht, aber keine Maße und keine Wünsche zum Abfotografieren */
function checkCard(x, i) {
  const d = derive(x), n = num(x.anzahl) || 1, offen = AW.offenListe(AW.nachTiefe(x, S.proj)).length;
  return '<button type="button" class="wincard" data-act="open" data-i="' + i + '"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di"' + (d.complete ? '' : ' style="color: var(--bad)"') + '>' + (d.complete ? 'Maße vollständig' : 'Maße fehlen noch') + (x.fotos ? ', ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : ', ohne Fotos') + '</span><span class="me">' + esc([offen ? offen + (offen === 1 ? ' Wunsch offen, dein Fensterbauer berät dich' : ' Wünsche offen, dein Fensterbauer berät dich') : 'Wünsche vollständig', n > 1 ? n + ' Stück' : ''].filter(Boolean).join(' · ')) + '</span></span>' + CHEV + '</button>';
}
SCREENS.gesendet = () => {
  const name = S.betrieb ? (S.betrieb.name || 'Dein Fensterbauer') : 'Dein Fensterbauer', code = curCode();
  const wa = 'https://wa.me/?text=' + encodeURIComponent('Hallo ' + name + ', hier ist mein Übermittlungscode aus eeziframes:\n' + code);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px"><div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div><h1 style="margin: 4px 0 0">Gesendet.</h1><p style="margin: 0">' + esc(name) + ' hat jetzt deine Maße, die Auswertung der Fotos und deine Wünsche und meldet sich mit einem Angebot.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(name) + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard() +
    (S.sent && S.sent.uebertragen ? '' : '<details class="card proto"><summary><span><b>Nur im Prototyp: Übermittlung</b><small>Ohne Server kommt dein Aufmaß hier noch nicht von selbst an.</small></span></summary><p class="sub" style="color: var(--fg2)">Bitte schick ' + esc(name) + ' diesen Übermittlungscode, am einfachsten als Antwort in WhatsApp. Er funktioniert nur in diesem Projekt bei ' + esc(name) + '. Im fertigen eeziframes entfällt dieser Schritt.</p><div class="pill-row"><a class="pill" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp antworten ›</a><button type="button" class="pill" data-act="nachricht-kopieren">Nachricht kopieren</button></div></details>');
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home' } };
};
/* ---------- Eigenes Projekt: Messen ist kostenlos, das Aufmaßblatt kostet einmal (Paywall), danach PDF, Teilen und Code ----------
   Preis aus /config.js (preise.aufmass) bzw. vom Server (/api/status); 0 schaltet den Verkauf ab, dann ist das Blatt kostenlos.
   Mit Server (SERVER.zahlung) läuft die Zahlung über Stripe Checkout; ohne Server ist es ein gekennzeichneter Testkauf. */
const PREIS = () => { const p = (SERVER.preise && SERVER.preise.aufmass) != null ? SERVER.preise.aufmass : ((window.KONFIG || {}).preise || {}).aufmass; return typeof p === 'number' ? p : 7.99; };
const MWST = () => ((SERVER.preise && SERVER.preise.mwst) != null ? SERVER.preise.mwst : ((window.KONFIG || {}).preise || {}).mwst) !== false;
/* Einführungspreis: „Einführungspreis bis 17. November, danach 12,99 €“ (modell.js, vom Server über /api/status), danach leer */
const EINF = () => (window.Abrechnung && window.Abrechnung.einfText ? window.Abrechnung.einfText('aufmass') : '');
const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
const kauf = () => S.kauf || (S.kauf = { mail: '', agb: false, pay: '', widerruf: false, paid: false, err: {} });
/* Stand der AGB und Wortlaut der Zustimmung an der Kasse: vom Server (/api/status, functions/api/recht.js), ohne Server diese Fassung.
   Der Server nimmt einen Kauf nur mit genau dem Stand und Wortlaut an, den die Kasse gezeigt hat. */
const RECHT = () => Object.assign({ agb: '2026-10-16', zustimmung: 'Ich stimme ausdrücklich zu, dass eeziframes (Patrick Kies) vor Ablauf der Widerrufsfrist mit der Bereitstellung des Aufmaßblatts beginnt. Mir ist bekannt, dass ich durch diese Zustimmung mit Beginn der Bereitstellung mein Widerrufsrecht verliere.' }, SERVER.recht || {});
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const standDE = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); return m ? Number(m[3]) + '. ' + MONATE[Number(m[2]) - 1] + ' ' + m[1] : String(iso || ''); };
/* Zahlungsarten an der Kasse, wie der Server sie Stripe vorgibt (Variable ZAHLARTEN); sie stehen vor dem Kauf da (§ 312j Abs. 1 BGB) */
const ZAHLART_NAMEN = { card: 'Kredit- oder Debitkarte (auf passenden Geräten auch Apple Pay oder Google Pay)', paypal: 'PayPal', klarna: 'Klarna' };
function zahlartenText() { const z = (SERVER.zahlarten && SERVER.zahlarten.length ? SERVER.zahlarten : ['card']).map((x) => ZAHLART_NAMEN[x] || x); return z.length > 1 ? z.slice(0, -1).join(', ') + ' oder ' + z[z.length - 1] : z[0]; }
/* Die Haken an der Kasse gelten nur für diesen einen Kauf: beim Betreten der Kasse sind sie leer */
function kasseOeffnen() { const k = kauf(); k.bedingungen = false; k.widerruf = false; k.err = {}; persist(); go('kasse'); }
const neueKennung = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const kennung = () => { const k = kauf(); if (!k.kennung) { k.kennung = neueKennung(); lokalSpeichern(); } return k.kennung; };
function KUNDE_FREI() { return !(PREIS() > 0); }
const FREI = () => KUNDE_FREI() || !!(S.kauf && S.kauf.paid);
const LOCK = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"></rect><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"></path></svg>';
const FILE_IC = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M14 3v4h4M9 12h6M9 15.5h6M9 9h2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>';
const teilStand = () => S.teil || (S.teil = { betrieb: 0 });
const anzahlFenster = () => S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
/* Karte für Startseite und Gesendet-Seite */
function dateiCard() {
  const n = S.windows.length;
  if (INST && S.betrieb) return INST_M.kopieKunde ? '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Eine Kopie für dich</p><b>Deine Anfrage als PDF</b><small>Direkt nach dem Senden, mit allen Fenstern, Maßen, Wünschen und Fotos.</small></div></div></div>' : '';
  if (S.betrieb) { const bn = S.betrieb.name || 'dein Fensterbauer'; return '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Eine Kopie für dich?</p><b>Frag ' + esc(bn) + '</b><small>Dein Aufmaß gehört zu diesem Auftrag. ' + esc(bn) + ' hat das komplette Aufmaßblatt als PDF und gibt es dir gern mit dem Angebot.</small></div></div></div>'; }
  if (FREI()) return '<div class="card datei-card bought"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">' + (KUNDE_FREI() ? 'Für dich · kostenlos' : 'Freigeschaltet') + '</p><b>Dein Aufmaßblatt als PDF</b><small>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ', alle Maße, Fotoauswertung und Wünsche, mit Code für den Fensterbauer.</small></div></div><span class="row" style="display: flex; gap: 8px; flex: 0 0 auto"><button type="button" class="btn ghost" data-act="teil-pdf">Teilen</button><button type="button" class="btn ghost" data-act="k-dl">Herunterladen</button></span></div>';
  return '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Dein Aufmaßblatt · ' + euro(PREIS()) + '</p><b>Fertig gemessen? Dann freischalten.</b><small>Alle Maße, die Auswertung der Fotos und deine Wünsche als PDF, mit Code für jeden Fensterbauer. Einmal zahlen, für dieses Projekt.</small></div></div><button type="button" class="btn ghost" style="flex: 0 0 auto" data-act="go" data-v="teilen">Ansehen</button></div>';
}
/* Vorschau des Blatts vor dem Freischalten: Kopf und Übersicht echt, die Positionen dahinter verschwommen */
function blattVorschau() {
  const pr = S.proj, n = S.windows.length, nE = anzahlFenster();
  const zu = (v) => thousand(v).replace(/\d/g, '•'); // Stellen statt Zahlen: die Maße stehen erst im freigeschalteten Blatt
  const rows = S.windows.slice(0, 4).map((x, i) => { const d = derive(x); return '<tr><td><b>' + (i + 1) + '</b></td><td>' + esc(x.name || 'Fenster') + '</td><td>' + zu(d.moW) + ' × ' + zu(d.moH) + '</td><td>' + zu(d.elW) + ' × ' + zu(d.elH) + '</td></tr>'; }).join('') + (n > 4 ? '<tr><td colspan="4" style="color: #6e6e73">und ' + (n - 4) + ' weitere</td></tr>' : '');
  return '<div class="dv pw"><div class="dv-paper pw" aria-hidden="true"><div class="dv-band">' + LOGO(18) + WM() + '<span>Aufmaßblatt</span></div><div class="dv-in"><p class="dv-h">' + esc(pr.name || 'Dein Aufmaß') + '</p><p class="dv-s">' + n + (n === 1 ? ' Position' : ' Positionen') + ' · ' + nE + (nE === 1 ? ' Element' : ' Elemente') + ' · ' + esc(lab('gebaeude', pr.gebaeude)) + '</p><table class="dv-tab"><tr><th>Pos.</th><th>Raum</th><th>Öffnung</th><th>Element</th></tr>' + rows + '</table></div>' +
    '<div class="dv-blur"><div class="dv-sk"><i class="dh"></i><i class="dw"></i></div><div class="dv-lines"><i></i><i class="s"></i><i></i><i class="s"></i><i></i><i class="s"></i></div></div></div>' +
    '<button type="button" class="dv-lock bottom" data-act="k-start">' + LOCK + 'Freischalten · ' + euro(PREIS()) + '</button></div>';
}
SCREENS.teilen = () => {
  const n = anzahlFenster(), t = teilStand(), code = packProject(S.windows, S.proj, null);
  if (!FREI()) {
    const html = hd('Fertig gemessen', 'Dein Aufmaßblatt ist fertig.', n + (n === 1 ? ' Fenster' : ' Fenster') + ', alle acht Handmaße, die Auswertung der Fotos, deine Wünsche. Einmal freischalten, dann gehört es dir.') + entwurfWarnung() + blattVorschau() +
      '<div class="card"><div class="incl">' + ['Technische Zeichnung mit allen Maßen je Fenster', 'Auswertung der Fotos und deine Wünsche', 'Als PDF teilen, so oft du willst, an jeden Fensterbauer', 'Mit Code: Dein Fensterbauer übernimmt alles mit einem Klick', 'Gilt für dieses Projekt, auch wenn du später Fenster ergänzt (bis ' + GRENZE.fenster + ' je Aufmaß)'].map((x) => '<p>' + CHECK + '<span>' + esc(x) + '</span></p>').join('') + '</div>' +
      '<div class="price-row"><span><b>' + euro(PREIS()) + '</b><small>einmalig' + (MWST() ? ', inkl. MwSt.' : '') + '</small>' + (EINF() ? '<small class="einf">' + esc(EINF()) + '</small>' : '') + '</span><small class="sub">Messen, Fotos und 3-D-Modell bleiben kostenlos</small></div></div>' +
      (S.kauf && S.kauf.wartet ? '<p class="sub" style="padding: 0 6px"><b>Deine Zahlung ist unterwegs.</b> Sobald Stripe sie bestätigt, schaltet sich dein Blatt hier von selbst frei. Bitte nicht noch einmal bezahlen.</p>' : '<p class="sub" style="padding: 0 6px">Du kannst weitere Fenster messen, das Blatt wächst mit. Jedes Fenster kannst du eine Woche lang beliebig ändern; ab dem Freischalten zählt jede Änderung, viermal je Fenster.</p>');
    return { html: html, back: ['Zurück', 'anfrage3'], cls: 'tight', bar: { label: 'Freischalten · ' + euro(PREIS()), act: 'k-start' } };
  }
  const msg = 'Hallo, hier ist mein Fenster-Aufmaß aus eeziframes (' + n + ' Fenster): alle Maße, die Auswertung der Fotos und meine Wünsche. Den Code bitte bei eeziframes unter „Code vom Kunden einfügen“ einsetzen. Noch kein Zugang? Kostenlos anmelden, die ersten 3 Projekte sind frei: ' + PORTAL_URL + '\n\n' + code;
  const stand = t.betrieb ? 'Unterwegs zu deinem Fensterbauer. Du kannst das Blatt jederzeit weiteren Betrieben geben, es gehört dir.' : (KUNDE_FREI() ? 'Dein Aufmaßblatt ist vollständig und kostenlos.' : 'Freigeschaltet, für dieses Projekt.') + ' Gib es dem Fensterbauer, von dem du ein Angebot möchtest, gern auch mehreren.';
  const tick = (on) => '<span class="way-tick' + (on ? ' on' : '') + '">' + (on ? CHECK : '') + '</span>';
  const html = hd(KUNDE_FREI() ? 'Fertig gemessen' : 'Freigeschaltet', 'Dein Aufmaß, dein Blatt.', stand) +
    '<div class="card share-way' + (t.betrieb ? ' done' : '') + '"><div class="way-head">' + tick(t.betrieb) + '<div><p class="eyebrow">' + (t.betrieb ? 'Erledigt' : 'Schritt 1') + '</p><h2>An deinen Fensterbauer</h2></div></div><p class="sub" style="color: var(--fg2)">Schick ihm das Aufmaßblatt als PDF: Zeichnungen, alle Maße, die Auswertung der Fotos, deine Wünsche. Dafür braucht er kein eeziframes; auf Seite 2 steht, wie er es trotzdem mit einem Klick übernimmt.</p><div class="pill-row"><button type="button" class="btn primary" style="flex: 0 0 auto; padding: 0 22px" data-act="teil-pdf">PDF schicken</button></div><p class="sub" style="color: var(--muted); margin-top: 8px">Oder nur den Code, falls er eeziframes schon nutzt:</p><div class="pill-row"><a class="pill" href="https://wa.me/?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener" data-act="teil-mark" data-v="betrieb">WhatsApp ›</a><a class="pill" href="mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(msg) + '" data-act="teil-mark" data-v="betrieb">E-Mail</a><button type="button" class="pill" data-act="teil-copy" data-v="betrieb">Code kopieren</button></div></div>' +
    '<div class="card share-way"><p class="eyebrow">Für dich</p><h2>Als Datei behalten</h2><p class="sub" style="color: var(--fg2)">Dein komplettes Aufmaßblatt als PDF, für deine Unterlagen.' + (S.kauf && S.kauf.paid && S.kauf.mail ? ' Die Rechnung ist an ' + esc(S.kauf.mail) + ' unterwegs.' : '') + '</p><div class="pill-row"><button type="button" class="pill" data-act="k-dl">Herunterladen</button></div></div>' +
    '<div class="sec">' + secHead('Dein Aufmaß-Code', null, 'Steht auch auf Seite 2 der PDF. Falls Kopieren nicht klappt: Text markieren und kopieren.') + '<textarea class="copybox" id="code-box" readonly rows="3" aria-label="Aufmaß-Code">' + esc(code) + '</textarea></div>';
  return { html: html, back: ['Zurück', 'anfrage3'], bar: { label: 'Zurück zum Projekt', act: 'go', v: 'home', ghost: true } }; // Cream nur für „PDF schicken“
};
SCREENS.datei = () => SCREENS.teilen();
/* Kasse, Schritt 1: nur die E-Mail (Rechnung, Nachweis) und die Zustimmung */
SCREENS.konto = () => {
  const k = kauf(), e = k.err || {};
  const html = hd('Schritt 1 von 2', 'Wohin soll die Rechnung?', 'Kein Konto, kein Passwort. An diese Adresse gehen Rechnung und Nachweis, dein Blatt bleibt auf diesem Gerät.') +
    '<div class="card kform"><label class="kf' + (e.mail ? ' bad' : '') + '"><span>E-Mail</span><input type="email" id="k-mail" data-in="k" data-f="mail" value="' + esc(k.mail || '') + '" placeholder="name@beispiel.de" autocomplete="email" inputmode="email">' + (e.mail ? '<small>' + esc(e.mail) + '</small>' : '') + '</label>' +
    '</div>' +
    '<p class="sub" style="padding: 0 6px">Kein Newsletter, keine Weitergabe. Dein Aufmaß bleibt auf deinem Gerät. Den AGB stimmst du im nächsten Schritt zu.</p>';
  return { html: html, back: ['Zurück', 'teilen'], bar: { label: 'Weiter zur Zahlung', act: 'k-next' } };
};
/* Aufmaß sichern bzw. anmelden: E-Mail, dann der Code aus der E-Mail (kein Passwort) */
SCREENS.sichern = () => {
  const z = S.sichern || (S.sichern = { zweck: 'sichern', schritt: 1, mail: '', agb: false, code: '', err: {} }), e = z.err || {}, kauf1 = z.zweck === 'kauf';
  const kopf = z.zweck === 'anmelden' ? ['Anmelden', 'Weiter mit deinem Aufmaß.', 'Wir schicken dir einen Code an die E-Mail-Adresse, mit der du dein Aufmaß gesichert hast. Kein Passwort.']
    : kauf1 ? ['Schritt 1 von 2', 'Dein Aufmaß sichern.', 'Für das Aufmaßblatt brauchst du ein Konto: E-Mail-Adresse und Code, kein Passwort. So ist dein Blatt auf jedem Gerät da und geht nicht verloren.']
    : ['Aufmaß sichern', 'Auf jedem Gerät weitermachen.', 'Wir schicken dir einen Code per E-Mail. Kein Passwort, kein Newsletter. Deine Fotos kommen mit ins Konto, nur für dich.'];
  const zurueck = kauf1 ? 'teilen' : 'home';
  if (z.schritt === 2) {
    /* Wie viele Stellen der Code hat, stellt man bei Supabase ein (6 bis 10); die App nimmt jede dieser Längen. Ein Link statt Code
       (Vorlage ohne {{ .Token }}) öffnet sich in manchen Mail-Apps in einem anderen Browser, dort fehlt dann das Aufmaß dieses Browsers */
    const html = hd(kopf[0], 'Code eingeben.', 'Wir haben dir einen Code an <span class="mail">' + esc(z.mail) + '</span> geschickt. Er gilt eine Stunde.') +
      '<div class="card kform"><label class="kf' + (e.code ? ' bad' : '') + '"><span>Code aus der E-Mail</span><input type="text" id="s-code" data-in="s" data-f="code" value="' + esc(z.code || '') + '" placeholder="123456" inputmode="numeric" autocomplete="one-time-code" maxlength="10">' + (e.code ? '<small>' + esc(e.code) + '</small>' : '') + '</label></div>' +
      '<p class="sub" style="padding: 0 6px">Nichts angekommen? Schau im Spam-Ordner nach. <button type="button" class="ulink" data-act="sichern-neu">Neuen Code schicken</button> · <button type="button" class="ulink" data-act="sichern-zurueck">Andere E-Mail-Adresse</button></p>' +
      '<p class="sub link-statt-code" style="padding: 0 6px">' + (z.zweck === 'anmelden' ? 'Steht in der E-Mail ein Link statt eines Codes, tippe ihn einfach an.' : 'Steht in der E-Mail ein Link statt eines Codes, öffne ihn in diesem Browser: Dein Aufmaß liegt bisher nur hier.') + '</p>' +
      (z.zweck === 'anmelden' ? '<p class="sub" style="padding: 0 6px">Gibt es zu dieser Adresse noch kein Konto, kommt kein Code. Dann sichere zuerst ein Aufmaß, dabei legst du das Konto an.</p>' : '') +
      (SERVER.attrappe ? '<p class="sub" style="padding: 0 6px">Testbetrieb: Der Code ist 123456.</p>' : '');
    return { html: html, back: ['Zurück', zurueck], bar: { label: z.laeuft ? 'Einen Moment …' : kauf1 ? 'Weiter zur Zahlung' : 'Anmelden', act: 'sichern-pruefen', dis: !!z.laeuft } };
  }
  const html = hd(kopf[0], kopf[1], kopf[2]) +
    '<div class="card kform"><label class="kf' + (e.mail ? ' bad' : '') + '"><span>E-Mail</span><input type="email" id="s-mail" data-in="s" data-f="mail" value="' + esc(z.mail || '') + '" placeholder="name@beispiel.de" autocomplete="email" inputmode="email">' + (e.mail ? '<small>' + esc(e.mail) + '</small>' : '') + '</label>' +
    (z.zweck === 'anmelden' ? '' : '<label class="kcheck' + (e.agb ? ' bad' : '') + '"><input type="checkbox" data-in="sc" data-f="agb"' + (z.agb ? ' checked' : '') + '><span>Ich akzeptiere die <a class="ulink" href="/agb/" target="_blank" rel="noopener">AGB</a> von eeziframes.</span></label>' + (e.agb ? '<small class="kerr">' + esc(e.agb) + '</small>' : '')) + '</div>' +
    '<p class="sub" style="padding: 0 6px">' + (z.zweck === 'anmelden' ? 'Noch kein Konto? Dann sichere zuerst ein Aufmaß auf dem Gerät, auf dem du gemessen hast.' : 'Dein Aufmaß liegt dann auf unserem Server, nur für dich. Du kannst es und dein Konto jederzeit löschen. Wie wir deine Daten verarbeiten, steht in der <a class="ulink" href="' + esc((window.KONFIG || {}).datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutzerklärung</a>.') + '</p>';
  return { html: html, back: ['Zurück', zurueck], bar: { label: z.laeuft ? 'Einen Moment …' : 'Code schicken', act: 'sichern-code', dis: !!z.laeuft } };
};
/* Dein Konto: Aufmaße im Konto (öffnen, einzeln löschen), neues beginnen, abmelden, Konto löschen */
const MUELL = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10.5 11v5.5M13.5 11v5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
SCREENS.meinkonto = () => {
  if (!KS) return SCREENS.home();
  const liste = S.konto.liste || [], jetzt = S.kauf && S.kauf.kennung, frage = S.kontoFrage || '';
  const datum = (iso) => { const t = Date.parse(iso || ''); return t ? datumKurz(t) : ''; };
  const name = (a) => a.name || ('Aufmaß vom ' + datum(a.angelegt));
  const frageKarte = (b) => '<div class="card neu-frage"><p class="eyebrow">Bitte bestätigen</p><b>' + esc(b[0]) + '</b><p class="sub">' + esc(b[1]) + '</p><div class="pill-row"><button type="button" class="pill danger" data-act="' + b[2] + '"' + (b[4] ? ' data-k="' + esc(b[4]) + '"' : '') + '>' + esc(b[3]) + '</button><button type="button" class="pill" data-act="konto-frage" data-v="">Abbrechen</button></div></div>';
  const wegK = frage.indexOf('weg:') === 0 ? frage.slice(4) : '';
  const karten = liste.map((a) => '<div class="konto-zeile"><button type="button" class="wincard konto-aufmass" data-act="projekt-oeffnen" data-k="' + esc(a.kennung) + '"><span class="ic">' + FILE_IC + '</span><span class="tx"><span class="pos">' + (a.kennung === jetzt ? 'GERADE GEÖFFNET' : 'GEÄNDERT AM ' + esc(datum(a.geaendert))) + '</span><span class="ti">' + esc(name(a)) + '</span><span class="di">' + a.fenster + ' Fenster' + (a.bezahlt ? ' · freigeschaltet' : '') + '</span></span>' + CHEV + '</button>' +
    '<button type="button" class="konto-weg" data-act="konto-frage" data-v="weg:' + esc(a.kennung) + '" aria-label="' + esc(name(a)) + ' löschen">' + MUELL + '</button></div>' +
    (a.kennung === wegK ? frageKarte(['„' + name(a) + '“ löschen?', (a.kennung === jetzt ? 'Das Aufmaß wird aus deinem Konto und von diesem Gerät gelöscht.' : 'Das Aufmaß wird aus deinem Konto gelöscht, auf allen Geräten.') + (a.bezahlt ? ' Es ist freigeschaltet; mit dem Löschen ist auch das weg. Heruntergeladene Aufmaßblätter behältst du.' : '') + ' Das lässt sich nicht rückgängig machen.', 'aufmass-weg-ja', 'Aufmaß löschen', a.kennung]) : '')).join('');
  const bestaetigen = frage === 'abmelden' ? ['Abmelden?', 'Dein Aufmaß bleibt in deinem Konto, mit seinen Fotos. Auf diesem Gerät wird es entfernt; eingezeichnete Bilder der Lage, die nur hier liegen, gehen dabei verloren.', 'konto-abmelden-ja', 'Abmelden']
    : frage === 'loeschen' ? ['Konto löschen?', 'Dein Konto und alle Aufmaße darin werden gelöscht, auch auf diesem Gerät. Gekaufte Aufmaßblätter, die du heruntergeladen hast, behältst du. Das lässt sich nicht rückgängig machen.', 'konto-loeschen-ja', 'Konto löschen'] : null;
  const html = hd('Dein Konto', 'Alles gesichert.', 'Angemeldet als <b class="mail">' + esc(KS.mail) + '</b>. Deine Aufmaße sind mit ihren Fotos auf jedem Gerät da, auf dem du dich anmeldest.') +
    (S.sync.voll ? noteBox('Das geöffnete Aufmaß ist noch nicht gesichert: In deinem Konto haben ' + MAX_AUFMASSE + ' Aufmaße Platz. Lösche ein altes, dann kommt es hinein.', null, 'warn') : '') +
    '<section class="sec liste"><div class="sec-head"><h2 class="sec-title">Deine Aufmaße.</h2><span class="sub">' + liste.length + ' im Konto</span></div><div class="liste-in">' + (karten || '<p class="sub">Noch keines gesichert. Sobald du ein Fenster gespeichert hast, liegt dein Aufmaß hier.</p>') + '<button type="button" class="dashed" data-act="konto-neu">' + PLUS + 'Neues Aufmaß beginnen</button></div></section>' +
    (bestaetigen ? frageKarte(bestaetigen) : '') +
    '<div class="pill-row grid2"><button type="button" class="pill" data-act="konto-frage" data-v="abmelden">Abmelden</button><button type="button" class="pill danger" data-act="konto-frage" data-v="loeschen">Konto löschen</button></div>' +
    '<p class="sub center lk-note">In deinem Konto haben ' + MAX_AUFMASSE + ' Aufmaße Platz. Aufmaße, die du 12 Monate nicht änderst, löschen wir, freigeschaltete nach 3 Jahren.</p>' + rechtLinks();
  return { html: html, back: ['Aufmaß', 'home'], bar: null };
};
/* Anmeldelink, den dieser Browser nicht angefordert hat (oder für ein anderes Konto): erst fragen (kontoAusLink) */
SCREENS.linkanmelden = () => {
  const r = S.linkAnmeldung; if (!r) return SCREENS.home();
  const ungesichert = fremdOffen(r.mail), perLink = !r.zweck, hier = S.windows.length > 0 && !(S.kauf && S.kauf.konto);
  const kopf = perLink ? ['Anmeldelink', 'Mit diesem Konto anmelden?', 'Der Link meldet dich als <b class="mail">' + esc(r.mail) + '</b> an. Angefordert wurde er nicht in diesem Browser. Melde dich nur an, wenn das deine E-Mail-Adresse ist.']
    : ['Anmelden', 'Änderungen nicht gesichert.', 'Du meldest dich als <b class="mail">' + esc(r.mail) + '</b> an.'];
  const html = hd(kopf[0], kopf[1], kopf[2]) +
    (ungesichert ? noteBox('Auf diesem Gerät liegt ein Aufmaß aus dem Konto <b class="mail">' + esc(ungesichert) + '</b> mit Änderungen, die dort noch nicht angekommen sind. Mit der Anmeldung wird es von diesem Gerät entfernt; im Konto bleibt der zuletzt gesicherte Stand. Um die Änderungen zu sichern, melde dich zuerst mit dieser Adresse an.', null, 'warn')
      : KS ? '<p class="sub" style="padding: 0 6px">Gerade bist du als <b class="mail">' + esc(KS.mail) + '</b> angemeldet. Dein Aufmaß bleibt in diesem Konto; auf diesem Gerät öffnet sich dann das andere.</p>'
      : hier ? '<p class="sub" style="padding: 0 6px">Dein Aufmaß auf diesem Gerät wird dann in diesem Konto gesichert.</p>'
      /* Link in einem anderen Browser geöffnet (Mail-Apps machen das gern): Das angefangene Aufmaß liegt im Browser, in dem gemessen wurde */
      : perLink ? noteBox('Hast du dein Aufmaß in einem anderen Browser oder einer anderen App angefangen? Dann liegt es dort und noch nicht in deinem Konto. Geh am besten dorthin zurück und gib dort den Code aus der E-Mail ein, dann kommt es mit.', null, 'link-anderswo') : '');
  return { html: html, back: ['Abbrechen', 'home'], bar: { label: ungesichert ? 'Trotzdem anmelden' : 'Anmelden', act: 'link-anmelden-ja', sec: 'Nicht anmelden', secAct: 'link-anmelden-nein' } };
};
/* Kasse, Schritt 2: mit Server zu Stripe, ohne Server ein gekennzeichneter Testkauf */
SCREENS.kasse = () => {
  const k = kauf(), e = k.err || {}, n = S.windows.length, p = PREIS(), mwst = MWST() ? p - p / 1.19 : 0;
  if (!k.mail) return SCREENS.konto();
  const R = RECHT(), ds = esc((window.KONFIG || {}).datenschutz || '/datenschutz/');
  const html = hd('Schritt 2 von 2', 'Bezahlen.', 'Rechnung an ' + esc(k.mail)) +
    '<div class="card"><div class="order"><span><b>Aufmaßblatt als PDF</b><small>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ', einmalig, für dieses Projekt</small>' + (EINF() ? '<small class="einf">' + esc(EINF()) + '</small>' : '') + '</span><b>' + euro(p) + '</b></div>' + (MWST() ? '<div class="order sum"><span>darin 19 % MwSt.</span><span>' + euro(mwst) + '</span></div>' : '<div class="order sum"><span>umsatzsteuerfrei nach § 19 UStG</span><span></span></div>') + '</div>' +
    (SERVER.zahlung ? '<div class="card" style="gap: 6px"><p class="eyebrow">Zahlungsarten</p><p class="sub" style="color: var(--fg2); margin: 0">' + esc(zahlartenText()) + ', auf der sicheren Seite unseres Zahlungsdienstleisters Stripe. eeziframes sieht keine Kartendaten.</p></div>'
      : '<div class="sec">' + secHead('Zahlungsart') + '<div class="pay' + (e.pay ? ' bad' : '') + '">' + ['PayPal', 'Kreditkarte', 'Apple Pay', 'Google Pay'].map((x) => '<button type="button" class="chip" data-act="k-pay" data-v="' + x + '" aria-pressed="' + (k.pay === x) + '">' + x + '</button>').join('') + '</div>' + (e.pay ? '<small class="kerr">' + esc(e.pay) + '</small>' : '') + '</div>') +
    '<div class="card kform kasse-recht">' +
    '<label class="kcheck' + (e.bedingungen ? ' bad' : '') + '"><input type="checkbox" data-in="kc" data-f="bedingungen"' + (k.bedingungen ? ' checked' : '') + '><span>Ich akzeptiere die <a class="ulink" href="/agb/" target="_blank" rel="noopener">AGB</a> (Stand: ' + esc(standDE(R.agb)) + ').</span></label>' + (e.bedingungen ? '<small class="kerr">' + esc(e.bedingungen) + '</small>' : '') +
    '<label class="kcheck' + (e.widerruf ? ' bad' : '') + '"><input type="checkbox" data-in="kc" data-f="widerruf"' + (k.widerruf ? ' checked' : '') + '><span>' + esc(R.zustimmung) + '</span></label>' + (e.widerruf ? '<small class="kerr">' + esc(e.widerruf) + '</small>' : '') +
    '<p class="sub kasse-wr">Dein Widerrufsrecht: <a class="ulink" href="/agb/#widerrufsbelehrung" target="_blank" rel="noopener">Widerrufsbelehrung</a> und <a class="ulink" href="/agb/#widerrufsformular" target="_blank" rel="noopener">Muster-Widerrufsformular</a>. Wie wir deine Daten verarbeiten, steht in der <a class="ulink" href="' + ds + '" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p></div>' +
    (SERVER.zahlung ? (SERVER.attrappe ? '<p class="sub" style="padding: 0 6px">Testbetrieb: Die Kasse ist nachgestellt, es wird nichts abgebucht.</p>' : SERVER.testmodus ? '<p class="sub" style="padding: 0 6px"><b>Testbetrieb:</b> Stripe läuft im Testmodus, es wird nichts abgebucht. Zum Ausprobieren die Karte 4242 4242 4242 4242, ein Ablaufdatum in der Zukunft und eine beliebige Prüfziffer.</p>' : '') : '<p class="sub" style="padding: 0 6px"><b>Pilotphase: Testkauf.</b> Es wird nichts abgebucht, du bekommst das Blatt trotzdem.</p>');
  return { html: html, back: ['Zurück', kontoBereit() && KS ? 'teilen' : 'konto'], bar: { label: SERVER.zahlung ? 'Weiter zu Stripe · ' + euro(p) : 'Testkauf abschließen', act: 'k-buy' } };
};
SCREENS.gekauft = () => {
  const k = kauf();
  const html = '<div class="center" style="padding-top: 48px; display: flex; flex-direction: column; align-items: center; gap: 14px"><div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="96" height="96" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div><h1 style="margin: 8px 0 0">Freigeschaltet.</h1><p style="margin: 0">Dein Aufmaßblatt gehört dir.' + (k.mail ? ' Die Rechnung kommt an ' + esc(k.mail) + '.' : '') + '</p></div>' + dateiCard();
  return { html: html, bar: { label: 'Weiter: Blatt teilen', act: 'go', v: 'teilen' } };
};
/* Kauf über den Server: Kasse starten, nach der Rückkehr prüfen */
async function kaufStarten(nochmal) {
  const k = kauf();
  try {
    const R = RECHT(), mitKonto = kontoBereit() && KS, init = { method: 'POST', body: JSON.stringify({ mail: k.mail, kennung: kennung(), agb: k.bedingungen ? R.agb : '', zustimmung: k.widerruf ? R.zustimmung : '' }) };
    const r = mitKonto ? await kontoJson('/api/zahlung/start', init) : await fetch('/api/zahlung/start', Object.assign(init, { headers: { 'content-type': 'application/json', accept: 'application/json' } })).then((x) => x.json());
    if (r && r.anmelden) { SERVER.konten = true; return sichernStart('kauf'); } // Anmeldung abgelaufen oder kein Konto (auch wenn diese Seite noch von keinen Konten wusste)
    if (r && r.geloescht) return aufmassEntfernt();
    if (r && r.fremd) return aufmassFremd();
    if (r && r.sichern) { // noch nicht im Konto: einmal abgleichen und noch einmal versuchen
      SERVER.konten = true;
      const nicht = () => toast(S.sync.voll ? VOLL_TEXT : 'Dein Aufmaß ist noch nicht gesichert. Bitte gleich noch einmal.');
      if (nochmal || S.sync.voll) return nicht();
      S.sync.offen = true; const a = await entwurfAbgleichen();
      return a === 'fehler' ? nicht() : kaufStarten(true);
    }
    if (r && r.ok && r.schon) { await entwurfLaden(); return go(FREI() ? 'gekauft' : 'teilen'); } // schon freigeschaltet (anderes Gerät)
    /* AGB oder Wortlaut haben sich geändert, seit die Kasse geladen wurde: neue Fassung zeigen, noch einmal zustimmen lassen */
    if (r && r.neuLaden) { if (r.recht) SERVER.recht = r.recht; k.bedingungen = false; k.widerruf = false; k.err = {}; persist(); render(); return toast(r.fehler || 'Bitte stimme noch einmal zu.'); }
    if (r && r.zustimmung) { k.err = { bedingungen: k.bedingungen ? '' : 'Bitte stimme den AGB zu.', widerruf: k.widerruf ? '' : 'Für die sofortige Lieferung brauchen wir deine Zustimmung.' }; Object.keys(k.err).forEach((x) => { if (!k.err[x]) delete k.err[x]; }); return render(); }
    if (!r || !r.ok || !r.url) return toast(r && r.fehler ? r.fehler : 'Die Kasse ist gerade nicht erreichbar.');
    persist(); location.href = r.url;
  } catch (e) { toast('Die Kasse ist gerade nicht erreichbar.'); }
}
/* leise: beim Öffnen der App nach einer Zahlung sehen, die noch unterwegs war (wartet); ohne Meldung, solange sie es noch ist.
   Die Markierung „unterwegs“ fällt nur bei einer klaren Antwort des Servers weg, nicht bei einer Störung. */
async function kaufPruefen(session, leise) {
  const k = kauf();
  try {
    const antwort = await fetch('/api/zahlung/pruefen?session=' + encodeURIComponent(session) + '&kennung=' + encodeURIComponent(kennung()), { headers: { accept: 'application/json' } });
    const r = await antwort.json().catch(() => null);
    if (!antwort.ok || !r) throw new Error('Server');
    if (r.anderes && r.kennung) { // bezahlt für ein anderes Aufmaß (etwa in einem anderen Tab gewechselt): mit Konto dieses öffnen
      if (k.wartet === session) { k.wartet = ''; persist(); }
      if (KS && kontoBereit() && (await projektOeffnen(r.kennung, true)) && FREI()) { S._feier = 'gekauft'; return go('gekauft'); }
      if (leise) return render();
      toast('Diese Zahlung gehört zu einem anderen Aufmaß' + (KS ? ' in deinem Konto; dort ist es freigeschaltet.' : '.')); return go('teilen');
    }
    if (r.ok && r.bezahlt) { k.paid = true; k.when = Date.now(); k.session = session; k.token = r.token; k.wartet = ''; if (r.mail) k.mail = r.mail; S._feier = 'gekauft'; persist(); go('gekauft'); return; }
    if (r.wartet) { k.wartet = session; persist(); if (leise) return render(); toast('Deine Zahlung ist unterwegs. Sobald Stripe sie bestätigt, schaltet sich dein Blatt von selbst frei.'); go('teilen'); return; }
    if (k.wartet === session) { k.wartet = ''; persist(); toast('Die Zahlung ist nicht durchgegangen. Du kannst es jederzeit noch einmal versuchen.'); return go('teilen'); }
    if (leise) return render();
    toast('Die Zahlung ist noch nicht bestätigt. Falls du abgebrochen hast, kannst du es jederzeit noch einmal versuchen.'); go('teilen');
  } catch (e) { if (leise) return render(); toast('Die Zahlung konnte gerade nicht geprüft werden. Bitte gleich noch einmal.'); go('teilen'); }
}
/* ---------- Die Datei: PDF mit jsPDF, sonst eine HTML-Datei ---------- */
const fileBase = () => 'Aufmass-' + (slug(S.proj.name || (S.betrieb && S.betrieb.kunde) || '') || 'eeziframes');
/* Die PDF zeichnet /assets/blatt.js (gemeinsam mit dem Betriebsbereich). Zwei Ausgaben aus der App:
   'kunde' für die eigenen Unterlagen (Du), 'fensterbauer' so, wie es an einen Betrieb geht (Sie); beide mit der Seite für den Fensterbauer am Ende. */
const BLATT_H = { derive: derive, lab: lab, num: num, th: thousand, col: (k) => { const c = colorOf(k); return [c.name, c.code, c.solid || c.bg]; }, farbe: (w, seite) => { const c = rahmenFarbe(w, seite); return [c.name, c.code, c.solid || c.bg]; }, farbeZeile: farbZeile, griffFarbe: (w) => griffFarbe(w).name, orn: (k) => (ORN.find((o) => o.k === k) || ORN[0]).label, opening: openingText, sonne: sonneText, innen: innenText };
/* fotos: Kennung → { data, w, h } (fotosFuerBlatt); ohne stehen die Positionen ohne Fotos da */
function blattPDF(variante, fotos) {
  if (!window.Blatt) return null;
  return window.Blatt.pdf({ variante: S.betrieb ? 'fensterbauer' : (variante || 'kunde'), fenster: S.windows, projekt: S.proj, code: packProject(S.windows, S.proj, null), portalUrl: PORTAL_URL, portalKurz: PORTAL_KURZ, appKurz: PORTAL_KURZ + '/app/', qr: window.qrcode, h: BLATT_H, fotos: fotos || {} });
}
const blattSchrift = () => (window.Blatt ? window.Blatt.schrift() : Promise.resolve(false));
/* PDF direkt weitergeben: auf dem Telefon per Teilen-Menü (WhatsApp, Mail), sonst herunterladen */
async function pdfTeilen() {
  if (S.betrieb) return toast('Das Aufmaßblatt bekommst du von ' + (S.betrieb.name || 'deinem Fensterbauer'));
  if (!(await kiVorher('blatt'))) return;
  await blattSchrift();
  const pdf = blattPDF('fensterbauer', await fotosFuerBlatt(S.windows));
  if (pdf && navigator.canShare && typeof File === 'function') {
    try {
      const file = new File([pdf], fileBase() + '.pdf', { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mein Fenster-Aufmaß', text: 'Hallo, hier ist mein Fenster-Aufmaß aus eeziframes als PDF: alle Maße, die Auswertung der Fotos und meine Wünsche. Auf der letzten Seite steht, wie du es in eeziframes öffnest.' });
        teilMark('betrieb'); return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  await saveDatei('fensterbauer');
  toast('PDF gespeichert. Häng sie an deine Nachricht an deinen Fensterbauer.');
  teilMark('betrieb');
}
function teilMark(k) { const t = teilStand(); if (!t[k]) { t[k] = Date.now(); S._feier = 'loop'; persist(); setTimeout(() => render(), 150); } }
function blattFile() {
  const css = 'body{font:14px/1.45 -apple-system,system-ui,sans-serif;color:#1d1d1f;margin:32px auto;max-width:760px;padding:0 20px}h1{font-size:28px;margin:0 0 4px}.m{color:#6e6e73}.p{border-top:2px solid #1d1d1f;margin-top:20px;padding-top:12px}.p h2{font-size:17px;margin:0 0 6px}.g{display:grid;grid-template-columns:150px 1fr;gap:4px 12px}.g span:nth-child(odd){color:#6e6e73}h3{font-size:14px;margin:14px 0 6px}@media print{body{margin:0}}';
  const pr = S.proj, g = (rs) => '<div class="g">' + rs.map((r) => '<span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span>').join('') + '</div>', rowsH = (x) => g(specRows(x)) + (AW.kiRows(x).length ? '<h3>Bestand laut Fotos</h3>' + g(AW.kiRows(x).map((r) => ({ k: r[0], v: r[1] }))) : ''), kl = klaerListe(S.windows, pr);
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Aufmaßblatt</title><style>' + css + '</style></head><body><h1>Aufmaßblatt</h1><p class="m">' + esc([lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : ''), lab('zeit', pr.zeit), new Date().toLocaleDateString('de-DE')].join(' · ')) + '</p>' + (kl.length ? '<h3>Noch zu klären</h3>' + g(kl) : '') +
    S.windows.map((x, i) => { const d = derive(x); return '<div class="p"><h2>Pos. ' + (i + 1) + ' · ' + esc(x.name || 'Fenster') + '</h2><p class="m">Öffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' mm · Element ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm</p>' + rowsH(x) + '</div>'; }).join('') + '<p class="m" style="margin-top:24px">Erfasst mit eeziframes. Vor der Fertigung Feinaufmaß vor Ort.</p></body></html>';
}
/* variante 'kunde' (Standard, für die eigenen Unterlagen) oder 'fensterbauer' (so, wie es an einen Betrieb geht) */
async function saveDatei(variante) {
  if (S.betrieb) return toast('Das Aufmaßblatt bekommst du von ' + (S.betrieb.name || 'deinem Fensterbauer'));
  if (!FREI()) return go('teilen');
  if (!(await kiVorher('blatt'))) return;
  await blattSchrift();
  const fb = variante === 'fensterbauer', pdf = blattPDF(fb ? 'fensterbauer' : 'kunde', await fotosFuerBlatt(S.windows)), name = fileBase() + (fb ? '-fuer-Fensterbauer' : '') + (pdf ? '.pdf' : '.html'), data = pdf || blattFile();
  if (!DL && DLP) await DLP;
  if (DL) {
    try { await DL.save({ filename: name, data: data }); S._feier = 'pdf'; toast('Gespeichert'); }
    catch (e) { if (e && e.code === 'declined') return; if (e && (e.code === 'rejected_extension' || e.code === 'extension_not_enabled') && pdf) { try { await DL.save({ filename: fileBase() + '.txt', data: blattMarkdown(S.windows, S.proj) }); toast('Als Text gespeichert'); } catch (e2) { toast('Speichern hat nicht geklappt'); } return; } toast('Speichern hat nicht geklappt'); }
    return;
  }
  if (window.claude) return toast('Speichern ist in dieser Ansicht nicht möglich');
  try { const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/html' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); S._feier = 'pdf'; toast('Download gestartet'); }
  catch (e) { toast('Speichern geht hier nicht'); }
}

/* ---------- Wunschfenster als Fragen: eine Frage, das Modell darüber, die Antwort sofort sichtbar ----------
   Kapitel in fester Reihenfolge, vom Groben zum Feinen. Jede Frage hat eine Stufe: 1 das Wichtigste, 2 die üblichen Wünsche,
   3 alles im Detail. Wie tief gefragt wird, wählt der Kunde einmal je Projekt (S.proj.tiefe) und ändert es jederzeit. Was er
   nicht gefragt wird, macht der Fensterbauer nach seinem Standard: kein „offen“, kein Eintrag in der Klärungsliste. */
const KAPITEL = [{ k: 'vorweg', n: 'Lage' }, { k: 'aufbau', n: 'Aufbau' }, { k: 'material', n: 'Material & Farbe' }, { k: 'glas', n: 'Glas & Sprossen' }, { k: 'bedienung', n: 'Griff & Schutz' }, { k: 'sonne', n: 'Sonnenschutz' }, { k: 'bank', n: 'Einbau' }];
const KAP_I = {}; KAPITEL.forEach((k, i) => { KAP_I[k.k] = i; });
/* Kapitel und Stufe je Frage stehen in modell.js (AW.FRAGE), damit Klärungsliste, Betrieb und Blatt wissen, was bei welcher Tiefe
   gefragt wurde. Stufe 2 (sonst 1): was viele mögen, für ein erstes Angebot aber nicht braucht. Pflichtthemen (Lage, Absturz,
   Erreichbarkeit) sind Stufe 1 */
const QKAP = AW.FRAGE.kap;
const QSTUFE = AW.FRAGE.stufe;
/* Kurznamen für die Zeile „Mehr zu …“ */
const QKURZ = { ul: 'Unterlicht', richtung: 'Öffnung nach außen', boden: 'Fußboden', glasfn: 'Glas-Extras', orn: 'Ornamentglas', sprossen: 'Sprossen', spross: 'Sprossenart', aufseite: 'Sprossenseite', breite: 'Sprossenbreite', griff: 'Griff', griffA: 'Griff außen', gf: 'Griff-Farbe', einbau: 'Kasten', sfarbe: 'Farbe', iart: 'Sichtschutz innen', ifarbe: 'Farbe innen', fbi: 'Fensterbank innen', fba: 'Fensterbank außen', montage: 'Montage', ol: 'Oberlicht' };
const TIEFE = { kurz: 1, normal: 2, genau: 3 };
const TIEFEN = [
  { k: 'kurz', label: 'Das Wichtigste', kurz: 'Kurz', sub: 'den Rest nach Standard' },
  { k: 'normal', label: 'Die üblichen Wünsche', kurz: 'Üblich', sub: 'mit Griff, Sprossen, Kasten' },
  { k: 'genau', label: 'Alles im Detail', kurz: 'Alles', sub: 'auch Profil, Technik, Zubehör' }];
const tiefeStufe = () => TIEFE[S.proj && S.proj.tiefe] || 2;
/* Im Kundenlink steht der Betrieb mit Namen: „Standard von Fensterbau Brandt“; im eigenen Aufmaß „Standard des Fensterbauers“ */
const fbName = () => (S.betrieb && S.betrieb.name) || '';
const stdName = () => (fbName() ? 'Standard von ' + fbName() : 'Standard des Fensterbauers');
/* Rund und Dreieck sind fest verglast: keine Flügel, kein Ober- und Unterlicht */
const festForm = (f) => f === 'rund' || f === 'dreieck';
/* „Mehr zu …“: Kapitel, die der Kunde für dieses Fenster aufgeklappt hat (nur in dieser Sitzung) */
const MEHR = new WeakMap();
/* Fragen zu den Detailangaben (Register AW.DETAIL in modell.js). std: Text der Zeile „Standard des Fensterbauers“; ohne std steht
   die erste Option (k '') für den Standard. nach: Fragen, hinter denen sie steht (die erste vorhandene); vor: Frage, vor der sie steht;
   mass: Stufenregler für eine Zahl; kind: chips (Vorgabe), tupfen (Farben als Raster mit Namen), farbe (dazu „Alle Farben“ aus ral.js,
   Einstellungen in FW), mm (nur der Regler) */
const DETAIL_UI = {
  seiten: { t: 'Seitenteile dazu?', sub: 'Feste Glasfelder neben den Flügeln, im selben Rahmen.', nach: ['teilung'], g: 'seitenteil', kurz: 'Seitenteile', mass: { f: 'seitenB', t: 'Breite je Seitenteil', st: 'fest verglast', min: 250, max: 1200, schritt: 50, std: 400 } },
  kvd: { t: 'Erst kippen oder erst drehen?', sub: 'Bei Kipp vor Dreh kippt die erste Griffstellung. Das schützt Kinder.', nach: ['din-*', 'typ-*'], g: 'kvd', kurz: 'Kipp vor Dreh' },
  paneel: { t: 'Unten Glas oder Paneel?', sub: 'Ein gedämmtes Paneel unten schützt vor Blicken und Stößen.', nach: ['ol'], g: 'paneel', kurz: 'Paneel unten', mass: { f: 'paneelH', t: 'Höhe des Paneels', st: 'ab Unterkante Flügel', min: 200, max: 900, schritt: 50, std: 400 } },
  hstEck: { t: 'Gerade oder über Eck?', sub: 'Über Eck treffen zwei Türen ohne Pfosten zusammen. Das Modell zeigt eine Seite.', nach: ['hstr', 'hsts'], g: 'eckhst', kurz: 'Ecklösung' },
  fswAuf: { t: 'Faltet sie nach innen oder außen?', sub: 'Nach außen bleibt innen mehr Platz, nach innen steht das Paket geschützt.', nach: ['fsws'], std: 'nach Lage vor Ort', g: 'faltpaket', kurz: 'Faltrichtung' },
  holzart: { t: 'Welche Holzart?', sub: 'Bestimmt Maserung, Härte und Preis.', nach: ['material'], g: 'holzart', std: 'meist Kiefer oder Fichte', kurz: 'Holzart' },
  oberfl: { t: 'Welche Oberfläche?', sub: 'Wie sich Rahmen und Flügel anfühlen.', nach: ['fi'], std: 'meist glatt', g: 'oberflaeche', kurz: 'Oberfläche' },
  profil: { t: 'Welche Profilform?', sub: 'Die Kanten von Rahmen und Flügeln.', nach: ['fi'], g: 'profil', std: 'meist kantig', kurz: 'Profilform' },
  schmal: { t: 'Schmale Rahmenansicht?', sub: 'Schmalere Profile lassen mehr Licht herein.', nach: ['fi'], g: 'profil', std: 'die übliche Ansicht', kurz: 'Rahmenansicht', view: 'front' },
  dicht: { t: 'Welche Farbe haben die Dichtungen?', sub: 'Man sieht sie als schmalen Streifen rund ums Glas.', nach: ['fi'], kind: 'tupfen', g: 'dichtung', std: 'meist schwarz oder grau', kurz: 'Dichtung', lupe: true },
  sichtZone: { t: 'Wo soll satiniert sein?', sub: 'Unten blickdicht, oben klar: Licht und Ausblick bleiben.', nach: ['orn'], g: 'ornament', kurz: 'Satinierung' },
  ahFarbe: { t: 'Welche Farbe hat der Abstandhalter?', sub: 'Der Steg zwischen den Scheiben, sichtbar am Glasrand.', nach: ['sichtZone', 'orn', 'glasfn'], kind: 'tupfen', g: 'abstandhalter', std: 'meist schwarz', kurz: 'Abstandhalter', lupe: true },
  sprFarbe: { t: 'Welche Farbe haben die Sprossen?', nach: ['breite', 'aufseite', 'spross', 'sprossen'], kind: 'tupfen', g: 'sprossen', kurz: 'Sprossenfarbe', view: 'front' },
  griffM: { t: 'Welches Griffmodell?', nach: ['gf', 'griffA', 'griff'], std: 'der Standardgriff des Herstellers', g: 'griff', kurz: 'Griffmodell' },
  griffPos: { t: 'Wo sitzt der Griff?', sub: 'Tiefer ist gut erreichbar, höher außer Reichweite von Kindern.', nach: ['griffM', 'gf', 'griff'], g: 'griff', kurz: 'Griffhöhe' },
  kinder: { t: 'Eine Kindersicherung?', nach: ['griffPos', 'griffM', 'gf', 'griff'], g: 'kindersicherung', kurz: 'Kindersicherung' },
  stulpBed: { t: 'Wie öffnet der zweite Flügel?', sub: 'Der Flügel ohne Griff wird mit Hebeln oben und unten entriegelt.', nach: ['kinder', 'griffPos', 'gf', 'griff'], g: 'stulp', kurz: 'Stulpflügel' },
  hstPlus: { t: 'Extras für die Hebe-Schiebe-Tür?', sub: 'Mehrfachauswahl möglich.', nach: ['gf', 'griff'], g: 'softclose', kurz: 'Extras' },
  pskZwang: { t: 'Mit Zwangssteuerung?', sub: 'Der Flügel öffnet nur in der richtigen Reihenfolge, das schont den Beschlag.', nach: ['gf', 'griff'], g: 'zwang', kurz: 'Zwangssteuerung' },
  baender: { t: 'Bänder sichtbar oder verdeckt?', sub: 'Die Scharniere an der Bandseite.', nach: ['stulpBed', 'kinder', 'griffPos', 'griffM', 'gf', 'griff'], g: 'baender', std: 'meist sichtbar', kurz: 'Bänder' },
  oeffner: { t: 'Ein elektrischer Fensteröffner?', sub: 'Kippt das Fenster per Taster, App oder Sensor.', nach: ['baender', 'gf', 'griff'], g: 'oeffner', kurz: 'Fensteröffner' },
  luefter: { t: 'Ein Lüfter im Fenster?', sub: 'Lüftet auch geschlossen ein wenig, gegen Feuchte und Schimmel.', nach: ['oeffner', 'baender', 'stulpBed', 'kinder', 'gf', 'griffA', 'griff'], g: 'falzluefter', kurz: 'Lüfter' },
  kontakt: { t: 'Ein Alarmkontakt?', sub: 'Meldet der Alarmanlage, ob das Fenster offen oder verriegelt ist.', nach: ['rc'], g: 'alarmkontakt', kurz: 'Alarmkontakt' },
  gitter: { t: 'Ein Fenstergitter?', sub: 'Außen vor dem Fenster, oft im Keller oder Erdgeschoss.', nach: ['kontakt', 'rc'], g: 'fenstergitter', kurz: 'Fenstergitter', view: 'outside' },
  gelForm: { t: 'Wie sieht das Geländer aus?', nach: ['gitter', 'kontakt', 'rc'], std: 'meist senkrechte Stäbe', g: 'absturz', kurz: 'Geländer', view: 'outside' },
  gelFarbe: { t: 'Welche Farbe hat das Geländer?', nach: ['gelForm', 'gitter', 'kontakt', 'rc'], kind: 'farbe', std: 'meist wie der Rahmen', g: 'absturz', kurz: 'Farbe Geländer', view: 'outside' },
  sfTeile: { t: 'Kasten und Schienen in welcher Farbe?', sub: 'Wie der Behang wirkt ruhig, wie der Rahmen fällt am wenigsten auf.', nach: ['sfarbe', 'einbau', 'sart'], g: 'sfarbe', kurz: 'Farbe Kasten und Schienen', view: 'outside' },
  sfK: { t: 'Farbe von Kasten und Blende?', nach: ['sfTeile'], kind: 'farbe', std: 'wie der Behang', g: 'sfarbe', kurz: 'Farbe Kasten', view: 'outside' },
  sfS: { t: 'Farbe der Führungsschienen?', nach: ['sfK', 'sfTeile'], kind: 'farbe', std: 'wie der Behang', g: 'sfarbe', kurz: 'Farbe Schienen', view: 'outside' },
  klBauart: { t: 'Welche Klappläden?', sub: 'Lamellen lassen Luft durch, Füllungen dunkeln ganz ab.', nach: ['sart'], g: 'klappladen', std: 'meist Lamellen', kurz: 'Bauart', view: 'outside' },
  klFarbe: { t: 'Welche Farbe haben die Läden?', nach: ['klBauart', 'sart'], kind: 'farbe', std: 'nach Absprache', g: 'klappladen', kurz: 'Farbe Klappläden', view: 'outside' },
  lamelle: { t: 'Welche Lamellen?', sub: 'Z-Lamellen dunkeln besser ab, Flachlamellen wirken schlank.', nach: ['sfS', 'sfK', 'sfTeile', 'sfarbe'], g: 'raffstore', std: 'meist C-Lamelle, 80 mm', kurz: 'Lamellen', view: 'outside' },
  fuehrung: { t: 'Geführt in Schienen oder am Seil?', nach: ['lamelle'], std: 'meist Schienen', g: 'raffstore', kurz: 'Führung', view: 'outside' },
  blende: { t: 'Wie sieht die Blende des Kastens aus?', sub: 'Außen vor dem Aufsatzkasten: verputzt oder verblendet wie die Wand, oder eine Alu-Blende in der Farbe von Kasten und Schienen.', nach: ['einbau'], g: 'aufsatz', std: 'meist verputzt wie die Fassade', kurz: 'Blende', view: 'outside' },
  panzer: { t: 'Woraus ist der Panzer?', sub: 'Der Behang aus Stäben, der herunterfährt.', nach: ['sfS', 'sfK', 'sfTeile', 'sfarbe'], std: 'meist Kunststoff', g: 'rollladen', kurz: 'Rollladenpanzer', view: 'outside' },
  schlitz: { t: 'Mit Lichtschlitzen?', sub: 'Geschlossen kommt durch schmale Schlitze etwas Licht und Luft.', nach: ['panzer'], std: 'meist ohne', g: 'rollladen', kurz: 'Lichtschlitze', view: 'outside' },
  transp: { t: 'Wie durchsichtig ist das Gewebe?', nach: ['sfS', 'sfK', 'sfTeile', 'sfarbe'], g: 'screen', std: 'meist blendfrei', kurz: 'Screen-Gewebe', view: 'outside' },
  bedien: { t: 'Auf welcher Seite wird er bedient?', sub: 'Gurt, Kurbel oder Schalter, von innen gesehen.', nach: ['antrieb'], std: 'nach Lage vor Ort', g: 'antrieb', kurz: 'Bedienseite' },
  sensor: { t: 'Wie soll er gesteuert werden?', sub: 'Mehrfachauswahl möglich.', nach: ['bedien', 'antrieb'], g: 'sensor', kurz: 'Steuerung' },
  insFarbe: { t: 'Welche Farbe hat der Rahmen des Insektenschutzes?', nach: ['insekt'], kind: 'farbe', std: 'meist wie der Fensterrahmen', g: 'insekt', kurz: 'Farbe Insektenschutz', view: 'outside' },
  insGewebe: { t: 'Welches Gewebe?', nach: ['insFarbe', 'insekt'], g: 'insektgewebe', std: 'Standardgewebe, grau', kurz: 'Gewebe', view: 'outside' },
  fbiFarbe: { t: 'Welche Farbe hat die Fensterbank innen?', nach: ['fbi'], kind: 'tupfen', std: 'nach Muster vor Ort', g: 'fensterbank', kurz: 'Farbe der Bank innen', view: 'bankInnen' },
  fbaFarbe: { t: 'Welche Farbe hat die Fensterbank außen?', nach: ['fba'], kind: 'farbe', std: 'meist silber eloxiert', g: 'fensterbank', kurz: 'Farbe der Bank außen', view: 'bankAussen' },
  fbaTiefe: { t: 'Wie weit ragt sie heraus?', sub: 'Die Ausladung, vom Rahmen bis zur Tropfkante.', nach: ['fbaFarbe', 'fba'], kind: 'mm', g: 'fensterbank', std: 'passend zur Wand gemessen', kurz: 'Ausladung', view: 'bankAussen', mass: { f: 'fbaTiefe', t: 'Ausladung', st: 'vom Rahmen bis zur Tropfkante', min: 80, max: 400, schritt: 10, std: 160 } },
  fbaUeber: { t: 'Wie weit steht sie vor die Fassade?', sub: 'Der Überstand führt Regenwasser von der Wand weg.', nach: ['fbaTiefe', 'fbaFarbe', 'fba'], g: 'endkappen', std: 'meist 30 bis 40 mm', kurz: 'Überstand', view: 'bankAussen' },
  fbaKappe: { t: 'Welche Endkappen?', sub: 'Die seitlichen Abschlüsse der Fensterbank.', nach: ['fbaUeber', 'fbaTiefe', 'fbaFarbe', 'fba'], g: 'endkappen', std: 'passend zur Fassade', kurz: 'Endkappen', view: 'bankAussen' },
  leiste: { t: 'Abdeckleisten am Rahmen?', sub: 'Sie decken die Fuge zwischen Rahmen und Wand, statt sie zu verputzen.', vor: 'montage', g: 'abdeckleiste', kurz: 'Abdeckleisten', view: 'inside' }
};
const passt = (id, muster) => id === muster || (muster.slice(-1) === '*' && id.indexOf(muster.slice(0, -1)) === 0);
function detailFrage(w, dd) {
  const ui = DETAIL_UI[dd.k], v = w[dd.k], g = dd.g || dd.k, opts = OPT[g] || [];
  const hint = v === undefined || v === '' ? (ui.std ? stdName() : (opts[0] && opts[0].k === '' ? opts[0].label : '')) : (AW.detailText(w, dd) || (opts.find((o) => o.k === String(v)) || {}).label || '');
  return { id: dd.k, title: ui.t, sub: ui.sub || '', kind: ui.kind || (dd.mehr ? 'multi' : 'chips'), group: g, opts: opts, val: v === undefined ? '' : String(v), vals: dd.mehr ? (v || []).slice() : undefined, act: 'detail', f: dd.k, view: ui.view || 'inside', g: ui.g, lupe: !!ui.lupe, hint: hint, s: dd.s, kap: dd.kap, detail: true, kurz: ui.kurz || dd.n };
}
/* Erklärung je Frage (i-Knopf am Titel). Q_G_STATT ersetzt eine unpassende Zuordnung, Q_G füllt, wo eine Frage noch keine hat */
const Q_G_STATT = { typ: 'oeffnungsart', richtung: 'aussen', teilung: 'blendrahmen', glas: 'uwert', glasfn: 'glasextras', sart: 'sonnenschutz', griff: 'griff', fswg: 'faltpaket', felder: 'festverglasung' };
const Q_G = { lage: 'lage', absturz: 'absturz', design: 'design', din: 'dinlr', material: 'material', ol: 'oberlicht', ul: 'unterlicht', form: 'form', hsts: 'hst', hstr: 'schiebeseite', pskS: 'psk', pskR: 'schiebeseite', schwelle: 'schwelle', boden: 'fussboden', fswn: 'fsw', fsws: 'faltpaket', sprossen: 'sprossen', spross: 'sprossen', aufseite: 'auf', breite: 'sprossenbreite', fa: 'ral', fi: 'ral', orn: 'ornament', griffA: 'ziehgriff', gf: 'grifffarbe', rc: 'rc2', einbau: 'rollladen', sfarbe: 'ral', antrieb: 'antrieb', insekt: 'insekt', iart: 'innenschutz', ifarbe: 'innenschutz', fbi: 'fensterbank', fba: 'fensterbank', montage: 'montage', notiz: 'notizen', tiefe: 'tiefe' };
/* Erklärung je Option (i in Karten und Chips): OPT_G vor dem g in OPT, damit Fachbegriffe ihren eigenen Eintrag bekommen */
const OPT_G = { art: { fenster: 'oeffnungsart', fest: 'festverglasung', fsw: 'fsw' }, situation: { ersatz: 'ersatz', neu: 'neuoeffnung' }, typ: { F: 'fest', D: 'dreh', K: 'kipp', DK: 'dk' }, teilung: { '3': 'fest', '4': 'fest' }, material: { kunststoff: 'kunststoff', kunststoffalu: 'kunststoffalu', holz: 'holz', holzalu: 'holzalu', alu: 'alu' }, glasfn: { sonne: 'sonnenschutzglas', extraklar: 'glasarten', vogel: 'glasarten', selbstr: 'glasarten' }, sart: { rollladen: 'rollladen', raffstore: 'raffstore', screen: 'screen', klappladen: 'klappladen' }, einbau: { aufsatz: 'aufsatz', vorbau: 'vorbau', unterputz: 'unterputz' }, antrieb: { solar: 'antrieb' }, insekt: { rollo: 'insekt', pendel: 'insekt', schiebe: 'insekt' }, pskSchema: { C: 'psk' }, fbi: { werzalit: 'werzalit' }, rc: { basis: 'basisschutz', rc1: 'rc1n', rc2n: 'rcstufen', rc2: 'rc2', rc3: 'rcstufen' } };
const optG = (group, o) => ((OPT_G[group] || {})[o.k] || o.g || '');
/* Abschnitte der Wünsche sind die Kapitel (KAPITEL, QKAP): Leiste über der Frage, Eyebrow, Übersicht und „fertig“ zeigen nur ihre Namen */
const qAbschnitt = (q) => (KAPITEL[KAP_I[q.kap || QKAP[String(q.id).split('-')[0]]]] || KAPITEL[1]).n;
/* Die Fragen je Elementart, ganz (für Prüfungen und die Zählung je Tiefe); gezeigt wird qSichtbar.
   Fenster: Form, Flügel, Öffnung, Scharniere, Ober- und Unterlicht. Festverglasung: Form und Felder. Balkon-/Terrassentür: Flügel,
   Öffnung, Oberlicht, Schwelle, Fußboden. Hebe-Schiebe-Tür: Schema, Seite, Oberlicht, Schwelle. PSK-Tür: Teile, Seite. Faltschiebewand:
   Flügelzahl, Faltrichtung, Gehflügel, Oberlicht, Schwelle. Vorweg: Lage, Absturzsicherung (wenn nötig), Gestaltung wie ein anderes
   Fenster (wenn es schon welche gibt), Tiefe. Danach für alle: Material und Farbe, Glas und Sprossen, Griff und Sicherheit,
   Sonnen- und Insektenschutz, Fensterbank, Montage, Notiz. Detailangaben stehen bei ihrem Thema.
   offen: Schlüssel für „Weiß ich noch nicht“ (Wunschfragen); dann ist keine Option gedrückt, das Blatt zeigt „offen“. */
function qList(w) {
  const L = [], d = derive(w), art = w.art || 'fenster', tuer = istTuer(w), neu = !!w.neu, rund = festForm(w.form), ki = (w.ki && w.ki.fach) || {}, tief = tiefeStufe();
  const echt = w.sashes.filter((x) => !x.st).length;
  const ohne = (g) => (neu ? OPT[g].filter((o) => o.k !== 'behalten') : OPT[g]);
  const material = { id: 'material', title: 'Welches Material?', sub: 'Bestimmt Preis, Pflege und Profilbreite.', kind: 'cards', group: 'material', val: w.material, act: 'setw', f: 'material', ico: ICO.material, view: 'inside', offen: 'material' };
  /* Trapez und Dreieck erst bei „Alles im Detail“ (oder wenn schon gewählt): die fünf üblichen Formen passen in eine Reihe */
  const form = { id: 'form', title: 'Welche Form?', sub: 'Antippen zeigt die Form am Modell.', kind: 'formen', group: 'form', opts: OPT.form.filter((o) => tief >= 3 || (o.k !== 'trapez' && o.k !== 'dreieck') || o.k === w.form), val: w.form, act: 'form', ico: ICO.form, view: 'inside' };
  const schwelle = (o, act) => ({ id: 'schwelle', title: 'Welche Schwelle?', sub: 'Barrierefrei heißt ohne Schwelle, mit Rinne davor.', kind: 'cards', group: 'schwelle', val: o.schwelle, act: act, f: 'schwelle', ico: ICO.schwelle, view: 'bankInnen', g: 'schwelle', hint: lab('schwelle', o.schwelle), offen: 'schwelle' });
  const oberlicht = (sub, s) => ({ id: 'ol', title: 'Ein Oberlicht?', sub: sub, kind: 'chips', group: 'ol', val: w.ol ? w.olT : 'nein', act: 'ol-set', view: 'inside', g: 'oberlicht', s: s });
  /* Je Flügel Öffnungsart und Scharniere; Seitenteile sind fest und haben keine Frage */
  const fluegel = (typen) => {
    /* Stulp: die Bänder sitzen außen (links DIN links, rechts DIN rechts), gefragt wird nur, welcher Flügel zuerst aufgeht und wie */
    if (w.teilung === '2s' && echt === 2) {
      const g = Math.max(0, gehFluegel(w)), x = w.sashes[g];
      L.push({ id: 'stulp', title: 'Welcher Flügel geht zuerst auf?', sub: 'Nur er hat einen Griff. Der andere geht erst danach auf, über einen Hebel im Falz.', kind: 'chips', group: 'stulp', opts: [{ k: 'L', label: 'Der linke' }, { k: 'R', label: 'Der rechte' }], val: g === w.sashes.findIndex((y) => !y.st) ? 'L' : 'R', act: 'stulp', view: 'inside', g: 'stulp', hint: 'Von innen gesehen' });
      L.push({ id: 'typ-' + g, title: 'Wie öffnet er?', sub: 'Der Flügel mit dem Griff.', kind: 'cards', group: 'typ', opts: typen.filter((o) => o.k === 'D' || o.k === 'DK'), val: x.t, act: 'sash', f: 't', sash: g, ico: ICO.typ, view: 'inside', g: 'symbol', hint: 'Er schwingt so auf' });
      return;
    }
    let nr = 0;
    w.sashes.forEach((x, i) => {
      if (x.st) return; nr++;
      L.push({ id: 'typ-' + i, title: echt > 1 ? 'Wie öffnet Flügel ' + nr + '?' : 'Wie soll es aufgehen?', sub: echt > 1 ? 'Der markierte Flügel. Antippen wechselt.' : '', kind: 'cards', group: 'typ', opts: typen, val: x.t, act: 'sash', f: 't', sash: i, ico: ICO.typ, view: 'inside', g: 'symbol', hint: echt > 1 ? 'Flügel ' + nr + ' von ' + echt : 'Er schwingt so auf' });
      if (x.t === 'D' || x.t === 'DK') L.push({ id: 'din-' + i, title: echt > 1 ? 'Scharniere von Flügel ' + nr + '?' : 'Scharniere links oder rechts?', sub: 'Von innen gesehen. Der Griff sitzt gegenüber.', kind: 'chips', group: 'din', val: x.din, act: 'sash', f: 'din', sash: i, view: 'inside', g: 'dinlr', hint: 'Der Griff wandert mit' });
    });
  };
  /* Vorweg: Lage (mit Namen), Absturzsicherung, Gestaltung übernehmen, wie genau geplant wird */
  L.push({ id: 'lage', title: tuer ? 'Wo ist die Tür?' : art === 'fest' ? 'Wo ist die Verglasung?' : 'Wo ist das Fenster?', sub: 'Damit der Fensterbauer die Position zuordnen kann.', kind: 'lage', view: 'three' });
  /* Pflichtthema: im Obergeschoss bei niedriger Brüstung, bei Türen immer (außer mit Balkon davor) */
  if (AW.absturzFrage(w)) L.push(tuer
    ? { id: 'absturz', title: 'Führt die Tür auf einen Balkon oder eine Terrasse?', sub: 'Sonst braucht sie im ' + lab('etage', w.etage) + ' eine Absturzsicherung davor.', kind: 'cards', group: 'absturzTuer', val: w.absturz, act: 'absturz', ico: ICO.absturz, view: 'outside', g: 'absturz', offen: 'absturz', offenLabel: 'Weiß ich noch nicht', hint: 'Ansicht von außen' }
    : { id: 'absturz', title: 'Wie wird gegen Absturz gesichert?', sub: AW.bruDa(w) ? (num(w.bru) ? 'Brüstung ' + thousand(w.bru) + ' mm im ' + lab('etage', w.etage) : 'Bodentief im ' + lab('etage', w.etage)) + ': Unter 80 cm (über 12 m Höhe 90 cm) ist meist eine Absturzsicherung Pflicht.' : 'Laut Foto ist die Brüstung ' + (w.ki && w.ki.fach && w.ki.fach.bruestung === 'bodentief' ? 'bodentief' : 'niedrig') + '. Im ' + lab('etage', w.etage) + ' ist dann eine Absturzsicherung Pflicht.', kind: 'cards', group: 'absturz', val: w.absturz, act: 'absturz', ico: ICO.absturz, view: 'outside', g: 'absturz', offen: 'absturz', offenLabel: 'Weiß ich noch nicht', hint: 'Ansicht von außen' });
  /* Gestaltung übernehmen: Farben, Glas, Sprossen, Sonnenschutz wie bei einem schon gespeicherten Fenster */
  if (designListe().length) L.push({ id: 'design', title: 'Gestalten wie ein anderes Fenster?', sub: 'Übernimmt Material, Farben, Glas, Sprossen, Griff und Sonnenschutz. Maße und Flügel bleiben.', kind: 'design', view: 'three', hint: 'Antippen übernimmt' });
  L.push({ id: 'tiefe', title: 'Wie genau möchtest du planen?', sub: 'Den Rest macht ' + (fbName() || 'dein Fensterbauer') + ' nach seinem Standard. Oben bei jeder Frage änderbar.', kind: 'tiefe', view: 'three', hint: 'Jede Wahl zeigt das Modell' });
  /* Aufbau */
  if (art === 'fenster') {
    L.push(form);
    /* Runde Fenster und Dreiecke sind fest verglast: keine Fragen nach Flügeln, Öffnung, Scharnieren, Ober- und Unterlicht */
    if (!rund) {
      L.push({ id: 'teilung', title: 'Wie viele Flügel?', sub: w.e_teilung ? '' : 'Vorschlag nach deiner Breite von ' + thousand(d.elW) + ' mm.', kind: 'cards', group: 'teilung', opts: OPT.teilung.filter((o) => o.k !== '4' || tief >= 2 || w.teilung === '4'), val: w.teilung, act: 'teilung', ico: ICO.layout, view: 'inside', g: 'pfosten', hint: 'Zum Drehen ziehen' });
      fluegel(OPT.typ);
      L.push(oberlicht('Ein extra Feld über dem Fenster.'));
      L.push({ id: 'ul', title: 'Ein Unterlicht?', sub: 'Ein festes Feld unten, typisch hinter der Küchenzeile.', kind: 'ul', view: 'inside', g: 'unterlicht', hint: w.ul ? lab('ul', w.ulA) + ' · ' + thousand(w.ulH) + ' mm hoch' : 'Flügel bis zur Fensterbank' });
      L.push({ id: 'richtung', title: 'Öffnet nach innen oder außen?', kind: 'chips', group: 'richtung', val: w.richtung, act: 'setw', f: 'richtung', view: 'inside', g: 'symbol' });
    }
  } else if (art === 'balkon') {
    L.push({ id: 'teilung', title: 'Wie viele Flügel?', sub: w.e_teilung ? 'Zwei Flügel ohne Pfosten (Stulp) geben die ganze Breite frei.' : 'Vorschlag nach deiner Breite von ' + thousand(d.elW) + ' mm.', kind: 'cards', group: 'teilung', opts: OPT.teilung.filter((o) => o.k !== '3' && o.k !== '4'), val: w.teilung, act: 'teilung', ico: ICO.layout, view: 'inside', g: 'stulp', hint: 'Zum Drehen ziehen' });
    fluegel(OPT.typ.filter((o) => o.k !== 'K'));
    L.push(oberlicht('Ein extra Feld über der Tür.'));
    L.push(schwelle(w.bt, 'bt'));
    L.push({ id: 'boden', title: 'Und der Fußboden?', sub: 'Davon hängt ab, wie hoch die Schwelle sitzt.', kind: 'chips', group: 'boden', val: w.bt.boden, act: 'bt', f: 'boden', view: 'bankInnen', hint: lab('boden', w.bt.boden) });
  } else if (art === 'fest') {
    L.push(form);
    L.push({ id: 'felder', title: 'Wie viele Felder?', sub: 'Große Scheiben werden geteilt, ab etwa 2,5 m² je Feld.', kind: 'cards', group: 'felder', val: w.teilung, act: 'felder', ico: ICO.felder, view: 'inside', g: 'festverglasung', hint: 'Zum Drehen ziehen' });
  } else if (art === 'hst') {
    L.push({ id: 'hsts', title: 'Welches Schema?', sub: 'Welche Flügel schieben und welche fest stehen.', kind: 'cards', group: 'hstSchema', val: w.hst.schema, act: 'hst', f: 'schema', ico: ICO.hst, view: 'inside', g: 'hst', hint: 'Antippen zeigt, wie sie öffnet' });
    if (w.hst.schema === 'A' || w.hst.schema === 'A3') L.push({ id: 'hstr', title: 'Schiebeflügel links oder rechts?', sub: 'Von innen gesehen. Der feste Teil steht gegenüber.', kind: 'chips', group: 'hstRichtung', val: w.hst.richtung, act: 'hst', f: 'richtung', view: 'inside', hint: 'Von innen gesehen' });
    L.push(oberlicht('Ein festes Glasfeld über der Tür.', 2));
    L.push(schwelle(w.hst, 'hst'));
  } else if (art === 'psk') {
    L.push({ id: 'pskS', title: 'Wie viele Teile?', sub: 'Der Flügel kippt oder schiebt sich vor das feste Teil. PSK-Türen haben immer eine kleine Schwelle.', kind: 'cards', group: 'pskSchema', opts: OPT.pskSchema.filter((o) => o.k !== 'C' || tief >= 2 || w.psk.schema === 'C'), val: w.psk.schema, act: 'psk', f: 'schema', ico: ICO.psk, view: 'inside', g: 'psk', hint: 'Antippen zeigt, wie sie öffnet' });
    if (w.psk.schema !== 'C') L.push({ id: 'pskR', title: 'Schiebeflügel links oder rechts?', sub: 'Von innen gesehen. Der feste Teil steht daneben.', kind: 'chips', group: 'hstRichtung', val: w.psk.richtung, act: 'psk', f: 'richtung', view: 'inside', hint: 'Von innen gesehen' });
  } else if (art === 'fsw') {
    L.push({ id: 'fswn', title: 'Wie viele Flügel?', sub: 'Mehr Flügel heißt schmalere Flügel und ein größeres Paket.', kind: 'chips', group: 'fswN', val: String(w.fsw.n), act: 'fsw', f: 'n', view: 'inside', g: 'fsw', hint: w.fsw.n + ' Flügel · Antippen faltet' });
    L.push({ id: 'fsws', title: 'Wohin faltet sie?', sub: 'Auf welcher Seite das Paket steht, von innen gesehen.', kind: 'chips', group: 'fswSchema', val: w.fsw.schema, act: 'fsw', f: 'schema', view: 'inside', hint: lab('fswSchema', w.fsw.schema) });
    L.push({ id: 'fswg', title: 'Mit Gehflügel?', sub: 'Eine Tür für jeden Tag, ohne alles zu falten.', kind: 'geh', view: 'inside', g: 'fsw', hint: w.fsw.geh ? 'Gehflügel mit Griff' : 'Ohne Gehflügel' });
    L.push(oberlicht('Ein festes Glasfeld über der Faltwand.', 2));
    L.push(schwelle(w.fsw, 'fsw'));
  }
  /* Material & Farbe */
  L.push(material);
  L.push({ id: 'fa', title: 'Welche Farbe außen?', kind: 'color', side: 'aussen', view: 'outside', g: 'ral', hint: 'Ansicht von außen · ' + rahmenFarbe(w, 'aussen').name, offen: 'fa' });
  L.push({ id: 'fi', title: 'Und innen?', kind: 'color', side: 'innen', view: 'inside', g: 'ral', hint: 'Ansicht von innen · ' + rahmenFarbe(w, 'innen').name, offen: 'fi' });
  /* Glas & Sprossen */
  L.push({ id: 'glas', title: 'Welche Verglasung?', sub: 'Je kleiner der U-Wert, desto weniger Wärme geht verloren.', kind: 'cards', group: 'glas', val: w.glas, act: 'setw', f: 'glas', ico: ICO.glas, view: 'inside', g: 'uwert', lupe: true, hint: glasText(w), offen: 'glas' });
  /* Weißglas, Vogelschutz und selbstreinigendes Glas erst bei „Alles im Detail“ (oder wenn schon gewählt) */
  L.push({ id: 'glasfn', title: 'Extras fürs Glas?', sub: 'Mehrfachauswahl möglich.', kind: 'multi', group: 'glasfn', opts: OPT.glasfn.filter((o) => !o.detail || tief >= 3 || w.glasfn.indexOf(o.k) >= 0), vals: w.glasfn, act: 'glasfn', view: 'inside', lupe: true, hint: w.glasfn.length ? w.glasfn.map((g) => lab('glasfn', g)).join(' · ') : 'Ohne Extras', offen: 'glasfn' });
  if (w.glasfn.indexOf('sicht') >= 0) L.push({ id: 'orn', title: 'Welches Ornamentglas?', kind: 'orn', view: 'inside', g: 'ornament', hint: 'Sichtschutz: ' + (ORN.find((o) => o.k === w.orn) || ORN[0]).label });
  if (!tuer || art === 'balkon') {
    L.push({ id: 'sprossen', title: 'Sprossen?', sub: 'Mit + und − dazu, an den Reglern verschieben.', kind: 'bars', view: 'front' });
    if (w.bars.length) {
      L.push({ id: 'spross', title: 'Welche Sprossenart?', kind: 'cards', group: 'spross', val: w.spross, act: 'setw', f: 'spross', ico: ICO.spross, view: 'front', offen: 'spross' });
      if (w.spross === 'auf') L.push({ id: 'aufseite', title: 'Aufgesetzt wo?', kind: 'chips', group: 'aufseite', val: w.aufSeite, act: 'setw', f: 'aufSeite', view: 'outside', hint: 'Ansicht von außen' });
      L.push({ id: 'breite', title: 'Wie breit sollen sie sein?', kind: 'chips', group: 'breite', val: w.breite, act: 'setw', f: 'breite', view: 'front' });
    }
  }
  /* Griff & Schutz */
  if (art === 'fenster' || art === 'balkon') { if (!rund) L.push({ id: 'griff', title: art === 'balkon' ? 'Welcher Griff innen?' : 'Welcher Griff?', sub: 'Ohne Griff: verdeckt im Flügel oder elektrisch.', kind: 'cards', group: 'griff', val: w.griff, act: 'setw', f: 'griff', ico: ICO.griff, view: 'inside', hint: w.griff === 'ohne' ? 'Glatte Fläche, kein Griff' : '', offen: 'griff' }); }
  else if (art === 'hst') L.push({ id: 'griff', title: 'Welcher Griff?', sub: 'Der Hebegriff hebt den Flügel aus der Dichtung.', kind: 'cards', group: 'hstGriff', val: w.griff, act: 'setw', f: 'griff', ico: ICO.hgriff, view: 'inside', g: 'hst', offen: 'griff' });
  else if (art === 'fsw' || art === 'psk') L.push({ id: 'griff', title: art === 'psk' ? 'Welcher Griff?' : 'Welcher Griff am Gehflügel?', kind: 'cards', group: 'griff', opts: OPT.griff.filter((o) => o.k === 'standard' || o.k === 'abschliessbar'), val: w.griff, act: 'setw', f: 'griff', ico: ICO.griff, view: 'inside', offen: 'griff' });
  if (art === 'balkon') L.push({ id: 'griffA', title: 'Und außen?', sub: 'Mit Ziehgriff und Schnäpper ziehst du die Tür von außen zu.', kind: 'chips', group: 'griffA', val: w.bt.griffA, act: 'bt', f: 'griffA', view: 'outside', g: 'balkon', hint: 'Ansicht von außen', offen: 'griffA' });
  if (art !== 'fest' && !rund && w.griff !== 'ohne' && w.griff !== 'motor' && !istOffen(w, 'griff')) L.push({ id: 'gf', title: 'Welche Griff-Farbe?', kind: 'chips', group: 'gf', val: w.gf, act: 'setw', f: 'gf', view: 'inside', hint: 'Der Griff wechselt mit' });
  /* Statt der Stufen zuerst die Frage, die der Kunde beantworten kann: Ist es leicht erreichbar? Dann empfiehlt die Polizei RC2 */
  L.push({ id: 'rc', title: tuer ? 'Ist die Tür leicht erreichbar?' : 'Ist das Fenster leicht erreichbar?', sub: 'Zum Beispiel im Erdgeschoss, vom Balkon, Anbau oder Garagendach aus.' + (!w.erreichbar && typeof ki.erreichbar === 'boolean' ? ' Laut Außenfoto vermutlich ' + (ki.erreichbar ? 'ja.' : 'nein.') : ''), kind: 'rc', view: 'inside', g: 'rc2', lupe: AW.rcAb(w, 'rc2'), hint: { basis: 'Basis: normaler Beschlag', rc1: art === 'fest' ? 'RC1 N: Glas von innen verklotzt' : 'RC1 N: Pilzköpfe an den Seiten', rc2n: art === 'fest' ? 'RC2 N: Verglasung gesichert, ohne geprüftes Glas' : 'RC2 N: Pilzköpfe rundum, Griff abschließbar, ohne geprüftes Glas', rc2: art === 'fest' ? 'RC2: Sicherheitsglas, Verglasung gesichert' : 'RC2: Pilzköpfe rundum, Griff abschließbar, Sicherheitsglas', rc3: art === 'fest' ? 'RC3: stärkeres Sicherheitsglas' : 'RC3: Pilzköpfe rundum, stärkeres Sicherheitsglas' }[w.rc] || '', offen: 'rc' });
  /* Sonnenschutz außen, Insektenschutz, Sicht- und Blendschutz innen */
  L.push({ id: 'sart', title: 'Sonnenschutz außen?', sub: 'Hält die Hitze draußen, bevor sie ans Glas kommt.', kind: 'cards', group: 'sart', opts: ohne('sart'), val: w.sart, act: 'sart', ico: ICO.sonne, view: 'outside', g: 'raffstore', hint: 'Ansicht von außen · ' + lab('sart', w.sart), offen: 'sart' });
  if (w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen') {
    /* Der Kasten ist Sache des Fensterbauers: Vorschlag nach den Fotos, der Kunde darf wählen */
    const kasten = ki.rollladen && ki.rollladen !== 'keiner' ? 'Laut Foto vorhanden: ' + AW.lab('kasten', ki.rollladen) + '. ' : '';
    L.push({ id: 'einbau', title: 'Wo sitzt der Kasten?', sub: kasten + 'Unsicher? Dein Fensterbauer wählt den passenden.', kind: 'cards', group: 'einbau', val: w.roll, act: 'setw', f: 'roll', ico: ICO.einbau, view: 'outside', g: w.roll === 'vorbau' ? 'vorbau' : w.roll === 'unterputz' ? 'unterputz' : 'aufsatz', hint: 'Ansicht von außen', offen: 'einbau', offenLabel: 'Fensterbauer entscheidet', offenSub: 'nach den Fotos und vor Ort' });
    L.push({ id: 'sfarbe', title: 'Welche Farbe?', sub: w.sart === 'raffstore' ? 'Lamellen, Kasten und Schienen.' : w.sart === 'screen' ? 'Gewebe und Kasten.' : 'Panzer, Kasten und Führungsschienen.', kind: 'swatch', group: 'sfarbe', f: 'sfarbe', val: w.sfarbe, view: 'outside', hint: 'Ansicht von außen · ' + sonneName(w) });
    /* Gurt, Kurbel und Taster sieht man innen, das Solarmodul außen am Kasten */
    L.push({ id: 'antrieb', title: 'Wie wird er bedient?', sub: w.antrieb === 'motor' || w.antrieb === 'smart' ? (ki.strom === true ? 'Laut Foto liegt am Fenster schon Strom.' : 'Elektrisch braucht Strom am Fenster, das klärt dein Fensterbauer.') : w.antrieb === 'solar' ? 'Ein Solarmodul am Kasten lädt den Akku, ganz ohne Stromanschluss.' : '', kind: 'chips', group: 'antrieb', val: w.antrieb, act: 'setw', f: 'antrieb', view: w.antrieb === 'solar' ? 'outside' : 'inside', hint: (w.antrieb === 'solar' ? 'Ansicht von außen · ' : 'Ansicht von innen · ') + (lab('antrieb', w.antrieb) || 'Bedienung'), offen: 'antrieb' });
  }
  /* Insektenschutz je Element: Fenster mit Spann- oder Drehrahmen, Türen mit Pendeltür oder Schiebeanlage; Festverglasung braucht keinen */
  const insektOpts = art === 'fenster' ? ['keiner', 'spann', 'dreh', 'plissee', 'rollo'] : art === 'balkon' ? ['keiner', 'dreh', 'pendel', 'plissee', 'rollo'] : ['keiner', 'plissee', 'schiebe'];
  if (art !== 'fest') L.push({ id: 'insekt', title: 'Insektenschutz?', kind: 'cards', group: 'insekt', opts: OPT.insekt.filter((o) => insektOpts.indexOf(o.k) >= 0 || o.k === w.insekt), val: w.insekt, act: 'setw', f: 'insekt', ico: ICO.insekt, view: 'outside', g: 'insekt', hint: 'Ansicht von außen', offen: 'insekt' });
  L.push({ id: 'iart', title: 'Sicht- und Blendschutz innen?', sub: 'Rollo, Plissee oder Jalousie, gleich mitbestellt.', kind: 'cards', group: 'iart', val: w.iart, act: 'setw', f: 'iart', ico: ICO.innen, view: 'inside', g: 'innenschutz', hint: 'Ansicht von innen', offen: 'iart' });
  if (w.iart && w.iart !== 'keiner') L.push({ id: 'ifarbe', title: 'Welche Farbe innen?', kind: 'swatch', group: 'ifarbe', f: 'ifarbe', val: w.ifarbe, view: 'inside', hint: lab('iart', w.iart) + ' · ' + innenName(w) });
  /* Fensterbank & Einbau */
  if (!tuer && w.form !== 'rund') {
    L.push({ id: 'fbi', title: 'Fensterbank innen?', sub: ki.fbi ? 'Laut Foto: ' + AW.lab('bank', ki.fbi) + '.' : '', kind: 'chips', group: 'fbi', opts: ohne('fbi'), val: w.fbi, act: 'setw', f: 'fbi', view: 'bankInnen', g: 'fensterbank', hint: 'Fensterbank: ' + lab('fbi', w.fbi), offen: 'fbi' });
    L.push({ id: 'fba', title: 'Fensterbank außen?', sub: ki.fba ? 'Laut Foto: ' + AW.lab('bank', ki.fba) + '.' : '', kind: 'chips', group: 'fba', opts: ohne('fba'), val: w.fba, act: 'setw', f: 'fba', view: 'bankAussen', hint: 'Von außen · ' + (istOffen(w, 'fba') ? 'noch offen' : lab('fba', w.fba)), offen: 'fba' });
  }
  L.push({ id: 'montage', title: 'Was soll der Fensterbauer übernehmen?', kind: 'switches', view: 'three', offen: 'montage', offenLabel: 'Fensterbauer schlägt vor', offenSub: 'nach dem Termin vor Ort' });
  L.push({ id: 'notiz', title: 'Noch etwas für den Fensterbauer?', kind: 'text', view: 'three' });
  /* Kapitel und Stufe; dann die Detailangaben bei ihrem Thema einreihen */
  L.forEach((q) => { const k = q.id.split('-')[0]; q.kap = QKAP[k] || 'aufbau'; if (!q.s) q.s = QSTUFE[k] || 1; });
  const letzte = {};
  AW.DETAIL.forEach((dd) => {
    if (!DETAIL_UI[dd.k] || !AW.detailGilt(w, dd.k)) return;
    const q = detailFrage(w, dd), ui = DETAIL_UI[dd.k];
    let pos = ui.vor ? L.findIndex((x) => x.id === ui.vor) : -1;
    if (pos < 0) {
      const a = (ui.nach || []).find((m) => L.some((x) => passt(x.id, m))), key = a || 'kap:' + q.kap, ref = letzte[key] || a;
      if (ref) { L.forEach((x, j) => { if (passt(x.id, ref)) pos = j + 1; }); }
      else { pos = 0; L.forEach((x, j) => { if (KAP_I[x.kap] <= KAP_I[q.kap]) pos = j + 1; }); }
      letzte[key] = q.id;
    }
    L.splice(pos, 0, q);
  });
  /* „Weiß ich noch nicht“: keine Option gedrückt */
  L.forEach((q) => { if (q.offen && q.offen !== 'absturz' && istOffen(w, q.offen)) { q.val = '\u0000'; if (q.vals) q.vals = []; } });
  L.forEach((q) => { const b = q.id.split('-')[0]; q.g = Q_G_STATT[b] || q.g || Q_G[b] || ''; }); // jede Frage mit Erklärung
  return L;
}
/* Was der Kunde bei seiner Tiefe sieht: die Stufen bis zu seiner Tiefe, Kapitel, die er mit „Mehr zu …“ aufgeklappt hat, Detailangaben
   mit gewähltem Wert (damit keine Wahl unsichtbar wirkt) und die Frage, auf der er gerade steht. Die Tiefe selbst wird gefragt,
   solange im Projekt keine gewählt ist, oder wenn er sie oben bei einer Frage öffnet. */
function qSichtbar(w, alle) {
  const t = tiefeStufe(), mehr = MEHR.get(w) || {};
  return (alle || qList(w)).filter((q) => q.id === S.q || (q.id === 'tiefe' ? !(S.proj && S.proj.tiefe) : q.s <= t || mehr[q.kap] || (q.detail && w[q.f] !== undefined)));
}
function qCurrent() {
  const alle = qList(S.win), list = qSichtbar(S.win, alle);
  let i = list.findIndex((q) => q.id === S.q);
  if (i < 0) {
    /* Die Frage gibt es hier nicht (mehr): die nächste sichtbare danach, sonst die erste */
    const j = alle.findIndex((q) => q.id === S.q), k = j < 0 ? -1 : list.findIndex((q) => alle.indexOf(q) > j);
    i = j < 0 ? 0 : k < 0 ? list.length - 1 : k; S.q = list[i].id;
  }
  return { list: list, i: i, q: list[i], alle: alle };
}
/* Name des Fensters: Pflichtfeld in der Frage „Wo ist das Fenster?“ */
const nameDa = (w) => !!String((w && w.name) || '').trim();
function nameVerlangen() {
  S.nameFehler = true; S.q = 'lage'; S.dir = 'back';
  if (S.screen !== 'frage') go('frage'); else render(true);
  nachBild(() => { const f = document.getElementById('t-name'); if (f) f.focus(); }, 60);
}
function qStep(delta) {
  S.qMass = null;
  let c = qCurrent();
  if (delta > 0 && c.q.id === 'lage' && !nameDa(S.win)) return nameVerlangen();
  /* Tiefe: übergangen heißt „die üblichen Wünsche“; oben bei einer Frage geöffnet, geht es dorthin zurück (mit Weiter wie mit Zurück
     und der Zurück-Taste des Browsers) */
  if (c.q.id === 'tiefe') {
    if (!S.proj.tiefe) { S.proj.tiefe = 'normal'; persist(); }
    const zur = S.tiefeZurueck; S.tiefeZurueck = null;
    if (zur && zur !== 'tiefe') {
      /* Gibt es die Frage bei der neuen Tiefe nicht mehr: die erste sichtbare dahinter (wie qCurrent bei verschwundenen Fragen),
         sonst die letzte sichtbare; nie zurück an den Anfang der Wünsche */
      const alle = qList(S.win), sicht = qSichtbar(S.win, alle).filter((q) => q.id !== 'tiefe'), j = alle.findIndex((q) => q.id === zur);
      const z = sicht.find((q) => q.id === zur) || (j < 0 ? null : sicht.find((q) => alle.indexOf(q) > j) || sicht[sicht.length - 1]);
      if (z) { if (z.id !== zur) { S.openSash = z.sash != null ? z.sash : -1; if (z.sash != null) S.selSash = z.sash; } S.q = z.id; S.dir = delta < 0 ? 'back' : 'fwd'; return render(true); }
    }
    c = qCurrent();
  }
  const nx = c.list[c.i + delta];
  if (!nx) { if (delta > 0) return saveWin(); if (einstiegHier()) return zumEinstieg(); return go('ergebnis', 'back'); }
  S.q = nx.id; S.dir = delta < 0 ? 'back' : 'fwd'; S.selBar = null; S.qWunsch = false;
  S.openSash = nx.sash != null ? nx.sash : -1; if (nx.sash != null) S.selSash = nx.sash;
  render(true);
  if (nx.sash != null && nx.id.indexOf('typ-') === 0) nachBild(() => { if (S.q === nx.id) oeffnungZeigen(nx.sash); }, 200);
  if (nx.id === 'hsts' || nx.id === 'hstr' || nx.id === 'fswn' || nx.id === 'fsws' || nx.id === 'pskS' || nx.id === 'pskR') nachBild(() => { if (S.q === nx.id) tuerZeigen(); }, 240);
  if (nx.id === 'fswg') nachBild(() => { if (S.q !== nx.id) return; const i = S.win.sashes.findIndex((x) => x.t === 'P'); if (i >= 0) oeffnungZeigen(i, 'D'); }, 240);
}
function qOpt(q, o, pressed, inner) { return '<button type="button" class="qopt" data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : '') + ' data-v="' + o.k + '" aria-pressed="' + pressed + '">' + inner + '</button>'; }
/* Kompakte Kacheln: Symbol links, Name und eine kurze Zeile rechts, der Preis in dieser Zeile; die Info rechts als eigenes Ziel.
   Zwei Optionen stehen nebeneinander, vier als 2 × 2, drei als schmale Kacheln mit Symbol oben, mehr als vier als Reihe zum Wischen.
   Lange Wörter bekommen in der Anzeige weiche Trennstellen (TRENN), damit sie in schmalen Kacheln nicht überlaufen. */
const TRENN = { Abschließbar: 'Abschließ&shy;bar', Aufgesetzt: 'Auf&shy;gesetzt', Barrierefrei: 'Barriere&shy;frei', Bestehender: 'Beste&shy;hender', Drehrahmen: 'Dreh&shy;rahmen', Druckknopf: 'Druck&shy;knopf', Glasbrüstung: 'Glas&shy;brüstung', Glasteilend: 'Glas&shy;teilend', Innenliegend: 'Innen&shy;liegend', Sicherheitsglas: 'Sicherheits&shy;glas', Spannrahmen: 'Spann&shy;rahmen', französischer: 'franzö&shy;sischer' };
const trenn = (t) => esc(t).replace(/[A-Za-zÄÖÜäöüß]{10,}/g, (x) => TRENN[x] || x).replace(/(\d) bis (\d)/g, '$1&nbsp;bis&nbsp;$2').replace(/ ≈ /g, '&nbsp;≈&nbsp;');
function qCards(q) {
  const opts = q.opts || OPT[q.group], n = opts.length, form = n > 4 ? ' reihe' : n === 4 ? ' quad' : n === 3 ? ' drei' : '';
  return '<div class="qcards kompakt' + form + '">' + opts.map((o) => '<div class="qo">' + qOpt(q, o, String(o.k) === String(q.val), (q.ico ? svgIcon(q.ico(o.k), 28) : '') + '<span class="tx"><span class="lbl">' + trenn(o.label) + '</span>' + (o.sub ? '<span class="sb">' + trenn(o.sub) + '</span>' : '') + (o.price ? '<span class="pr">' + esc(o.price) + '</span>' : '') + '</span>') + (optG(q.group, o) ? '<button type="button" class="qinfo" aria-label="' + esc('Erklärung: ' + o.label) + '" data-act="gloss" data-k="' + optG(q.group, o) + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
/* Auswahl aus wenigen Optionen, eine Familie: 2–3 kurze Beschriftungen als Segmente, bis 4 kürzere als Raster gleich breiter Chips,
   sonst Zeilen mit Haken. Das Gewicht wechselt beim Auswählen nicht, damit nichts springt. */
const CHECK_S = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="var(--paper)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
/* Gruppe je Option (auch nach filter()), damit auswahl() die Erklärung einer Option findet */
const OPT_GRUPPE = new WeakMap(); Object.keys(OPT).forEach((g) => (OPT[g] || []).forEach((o) => OPT_GRUPPE.set(o, g)));
/* Breite einer Beschriftung in der Schrift der Chips (Inter 700, 15 px); ohne Canvas grob über die Zeichenzahl */
let MESS_CTX = null;
function textBreite(t) {
  try { if (!MESS_CTX) { MESS_CTX = document.createElement('canvas').getContext('2d'); MESS_CTX.font = '700 15px ' + getComputedStyle(document.body).fontFamily; } return MESS_CTX.measureText(t).width; } catch (e) { return String(t).length * 8.6; }
}
/* Platz für die Beschriftung in einem Chip mit i im Raster aus zwei Spalten: halbe Breite des Docks (16 px Rand, 8 px Abstand) minus
   Rand 2 × 2, links 10, rechts 40 fürs i und gegebenenfalls Symbol oder Tupfen samt Abstand */
const chipPlatz = (sym) => (Math.min(document.documentElement.clientWidth || 390, 640) - 32 - 8) / 2 - 4 - 10 - 40 - (sym ? 24 : 0);
function auswahl(opts, attrs, istGewaehlt) {
  const lang = Math.max.apply(null, opts.map((o) => o.label.length)), dots = opts.some((o) => o.bg);
  const knopf = (o, cls, inner) => '<button type="button" class="' + cls + '" ' + attrs + ' data-v="' + o.k + '" aria-pressed="' + istGewaehlt(o) + '">' + inner + '</button>';
  const punkt = (o) => (o.bg ? '<span class="dot" style="background: ' + o.bg + '"></span>' : o.ico ? '<span class="ci">' + o.ico + '</span>' : '');
  /* Fachbegriff in einer Option: eigener i-Knopf rechts in der Zeile bzw. im Chip (44 px), getrennt vom Antippen der Option */
  const gi = (o) => { const g = OPT_GRUPPE.get(o); return g ? optG(g, o) : ''; }, mitI = opts.some((o) => gi(o));
  const info = (o) => (gi(o) ? '<button type="button" class="qci-i" data-act="gloss" data-k="' + gi(o) + '" aria-label="' + esc('Erklärung: ' + o.label) + '">' + ICON_I + '</button>' : '');
    /* Segmente: bis 3 kurze, 4 sehr kurze (Geschoss) oder bis 6 Zahlen (Flügel der Faltwand) passen in eine Reihe; mit Fachbegriff (i) nicht */
    if (!dots && !mitI && ((opts.length <= 3 && lang <= 11) || (opts.length === 4 && lang <= 6) || (opts.length <= 6 && lang <= 2))) return '<div class="seg qseg">' + opts.map((o) => knopf(o, '', esc(o.label))).join('') + '</div>';
  /* Chips mit i nur, wenn jede Beschriftung bei dieser Breite ganz vor das i passt (kein Umbruch, kein Überlauf); sonst Zeilen */
  const passt = !mitI || opts.every((o) => textBreite(o.label) <= chipPlatz(!!(o.bg || o.ico)) - 2);
  if (opts.length <= 6 && lang <= 16 && passt) return '<div class="qchips grid2' + (mitI ? ' mit-i' : '') + '">' + opts.map((o) => (mitI ? '<div class="qci">' + knopf(o, 'chip', punkt(o) + '<span class="lb">' + esc(o.label) + '</span>') + info(o) + '</div>' : knopf(o, 'chip', punkt(o) + esc(o.label)))).join('') + '</div>';
  /* Zeilen ohne eigenen Begriff bekommen den Platz des i, damit die Haken untereinander stehen */
  return '<div class="qlist' + (mitI ? ' mit-i' : '') + '">' + opts.map((o) => (mitI ? '<div class="qli">' : '') + knopf(o, '', '<span class="tx">' + punkt(o) + esc(o.label) + '</span><span class="mark">' + CHECK_S + '</span>') + (mitI ? (info(o) || '<span class="qli-platz" aria-hidden="true"></span>') + '</div>' : '')).join('') + '</div>';
}
/* Formen: fünf Symbolkacheln in einer Reihe; Name und Kurzbeschreibung der gewählten Form darunter */
function qFormen(q) {
  const opts = q.opts || OPT.form, cur = opts.find((o) => o.k === q.val) || opts[0];
  return '<div class="qformen" role="group" aria-label="Form">' + opts.map((o) => '<button type="button" class="qf" data-act="form" data-v="' + o.k + '" aria-pressed="' + (o.k === cur.k) + '" aria-label="' + esc(o.label) + '" title="' + esc(o.label) + '">' + svgIcon(ICO.form(o.k), 54) + '</button>').join('') + '</div><p class="qcur"><b>' + esc(cur.label) + '</b> · ' + esc(cur.sub) + '</p>';
}
function qChips(q) {
  if (q.group === 'gf') return qGriffFarbe(q);
  /* Oberlicht: die Frage nennt es schon, die Antworten bleiben kurz und passen als Segmente in eine Reihe */
  const opts = q.opts || (q.group === 'ol' ? [{ k: 'nein', label: 'Nein' }, { k: 'K', label: 'Kippbar' }, { k: 'F', label: 'Fest' }] : OPT[q.group]);
  return auswahl(opts, 'data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : ''), (o) => String(o.k) === String(q.val));
}
function qMulti(q) {
  return auswahl(q.opts || OPT[q.group], 'data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : ''), (o) => q.vals.indexOf(o.k) >= 0) + (q.vals.length ? '' : '<p class="sub center">Nichts davon? Einfach weiter.</p>');
}
/* Tiefe: drei Zeilen mit der Zahl der Fragen, die es bei diesem Fenster wären; ohne Wahl gilt „die üblichen Wünsche“ */
function qTiefe(c) {
  const w = S.win, cur = (S.proj && S.proj.tiefe) || 'normal', alle = (c && c.alle) || qList(w);
  const zahl = (t) => alle.filter((q) => q.id !== 'tiefe' && (q.s <= t || (q.detail && w[q.f] !== undefined))).length;
  return '<div class="qlist qtiefen">' + TIEFEN.map((o) => '<button type="button" data-act="tiefe" data-v="' + o.k + '" aria-pressed="' + (cur === o.k) + '"><span class="tx"><b>' + esc(o.label) + '</b><small>' + esc(zahl(TIEFE[o.k]) + ' Fragen · ' + o.sub) + '</small></span><span class="mark">' + CHECK_S + '</span></button>').join('') + '</div>';
}
/* Farben einer Detailangabe im Stil der Farbwahl (S2): ein Raster mit Namen unter jedem Tupfen, „Wie der Rahmen“ in der Farbe des
   Rahmens. Mit RAL-Tönen (kind farbe, Einstellungen in FW): dazu DB 703 und Co., eine Farbe aus dem Farbblatt als eigener Tupfen
   (gedrückt, mit Nummer) und als letzte Zelle „Alle Farben“. Nichts gedrückt heißt Standard des Fensterbauers (die Zeile darunter). */
function qTupfen(q) {
  const w = S.win, feld = q.f, fw = FW[feld], v = w[feld], aktiv = v === undefined ? (q.opts[0] && q.opts[0].k === '' ? '' : null) : String(v), attrs = 'data-act="detail" data-f="' + feld + '"';
  const bg = (o) => (o.k === 'rahmen' || (o.k === '' && /Rahmen/.test(o.label)) ? rahmenFarbe(w, 'aussen').bg : o.bg) || 'var(--surface2)';
  const zelle = (k, farbe, name, label, an) => '<button type="button" class="qsw" ' + attrs + ' data-v="' + esc(k) + '" aria-pressed="' + an + '" aria-label="' + esc(label) + '"><span class="c" style="background: ' + farbe + '"></span><span class="n">' + esc(name) + '</span></button>';
  let h = q.opts.map((o) => zelle(o.k, bg(o), o.label, o.label, o.k === aktiv)).join('');
  if (fw) {
    const schnell = (fw.schnell || []).filter((k) => FARBE_K[k] && !q.opts.some((o) => o.k === k)), e = aktiv && !q.opts.some((o) => o.k === aktiv) && schnell.indexOf(aktiv) < 0 ? ralFarbe(aktiv) : null;
    h += schnell.map((k) => zelle(k, colorOf(k).bg, colorOf(k).code, colorOf(k).name + ', ' + colorOf(k).code, k === aktiv)).join('');
    if (e) h += zelle(e.key, e.bg, e.code || e.name, e.label || e.name, true);
    const zu = !!S.tour;
    h += '<button type="button" class="qsw fw-alle' + (zu ? ' gesperrt' : '') + '" data-farbblatt="' + feld + '" aria-label="' + esc('Alle Farben: ' + fw.titel + (zu ? ', in der Führung gesperrt' : '')) + '"' + (zu ? ' aria-disabled="true"' : '') + '><span class="c" aria-hidden="true">' + FW_LUPE + '</span><span class="n">Alle Farben</span>' + (zu ? '<span class="schloss" aria-hidden="true">' + LOCK_S + '</span>' : '') + '</button>';
  }
  return '<div class="qswatches fw-raster fw-5" role="group" aria-label="' + esc(q.kurz || q.title) + '">' + h + '</div>';
}
/* Zu einer Detailangabe: Stufenregler für ein Maß und die Zeile „Standard des Fensterbauers“ (gedrückt, solange nichts gewählt ist) */
function detailZusatz(q) {
  const w = S.win, ui = DETAIL_UI[q.f] || {}, m = ui.mass, v = w[q.f];
  let h = '';
  if (m && (q.kind === 'mm' || (v !== undefined && v !== ''))) {
    const std = q.kind === 'mm' && v === undefined, cur = num(w[m.f]) || m.std;
    h += '<div class="qsteps"><div class="qstep"><span class="t"><b>' + esc(m.t) + '</b><small>' + esc(m.st) + '</small></span><span class="stepper weit"><button type="button" data-act="detail-mm" data-f="' + m.f + '" data-v="' + (-m.schritt) + '" aria-label="Weniger"' + (cur > m.min ? '' : ' disabled') + '>−</button>' + massWert(m, std ? 'Standard' : thousand(cur) + ' mm') + '<button type="button" data-act="detail-mm" data-f="' + m.f + '" data-v="' + m.schritt + '" aria-label="Mehr"' + (cur < m.max ? '' : ' disabled') + '>+</button></span></div></div>';
  }
  if (ui.std) h += '<button type="button" class="qoffen qstd" data-act="detail" data-f="' + q.f + '" data-v="" aria-pressed="' + (v === undefined) + '"><span class="tx"><b>' + esc(stdName()) + '</b><small>' + esc(ui.std) + '</small></span><span class="mark">' + CHECK_S + '</span></button>';
  return h;
}
/* Am Ende eines Kapitels: was bei dieser Tiefe nicht gefragt wird, holt „Mehr zu …“ für dieses Fenster dazu */
function mehrZeile(c) {
  const q = c.q; if (q.kap === 'vorweg') return '';
  if (c.list.slice(c.i + 1).some((x) => x.kap === q.kap)) return '';
  const sicht = new Set(c.list), weg = c.alle.filter((x) => x.kap === q.kap && !sicht.has(x)); if (!weg.length) return '';
  const namen = []; weg.forEach((x) => { const t = x.kurz || QKURZ[x.id.split('-')[0]] || x.title; if (namen.indexOf(t) < 0) namen.push(t); });
  return '<button type="button" class="qmehr" data-act="kap-mehr" data-v="' + q.kap + '"><span class="tx"><b>Mehr zu ' + esc(KAPITEL[KAP_I[q.kap]].n) + '</b><small>' + esc(namen.slice(0, 3).join(', ') + (namen.length > 3 ? ' und ' + (namen.length - 3) + ' weitere' : '')) + '</small></span><span class="plus" aria-hidden="true">+</span></button>';
}
/* Oben bei jeder Frage: wie genau geplant wird, antippen öffnet die Wahl */
function tiefeKnopf(q) {
  if (q.id === 'tiefe') return '';
  const t = TIEFEN.find((o) => o.k === ((S.proj && S.proj.tiefe) || 'normal'));
  return '<button type="button" class="qtiefe" data-act="tiefe-zeigen" aria-label="Wie genau planen: ' + esc(t.label) + '. Ändern"><span>' + esc(t.kurz) + '<svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button>';
}
/* ---------- Farbwahl (S2): Rahmen außen und innen, Sonnenschutz, Innenschutz, Griff ----------
   Oben die gewählte Farbe groß mit Name und Nummer, darunter die beliebten als Raster (am Telefon ohne Wischen), dann „Alle Farben“:
   das Farbblatt mit Suche, Farbfamilien und allen RAL-Classic-Tönen, Holzdekoren und Sonderfarben (ral.js). Die eigene Angabe bleibt
   als Feld darunter. Gespeichert wird der Schlüssel aus ral.js ('1015', 'winch', 'db703'), eingetippte Farben wie bisher als Text. */
const FW = {
  fa: { titel: 'Farbe außen', wunsch: 'wunschA', beliebt: 'rahmen', offen: 'fa' },
  fi: { titel: 'Farbe innen', wunsch: 'wunschI', beliebt: 'rahmen', offen: 'fi' },
  sfarbe: { titel: 'Farbe des Sonnenschutzes', wunsch: 'wunschSf', beliebt: 'sonne', schnell: ['db703', '9007'] },
  ifarbe: { titel: 'Farbe innen', wunsch: 'wunschIf', beliebt: 'innen', schnell: [] },
  gf: { titel: 'Griff-Farbe', wunsch: 'wunschGf' },
  /* Detailangaben (#46) mit RAL-Tönen: gespeichert als Schlüssel aus ral.js im Feld selbst, ohne eigene Angabe (dafür die Notiz) */
  sfK: { titel: 'Farbe von Kasten und Blende', beliebt: 'sonne', schnell: ['db703', '9007'], detail: true },
  sfS: { titel: 'Farbe der Führungsschienen', beliebt: 'sonne', schnell: ['db703', '9007'], detail: true },
  klFarbe: { titel: 'Farbe der Klappläden', beliebt: 'rahmen', beliebtT: 'Beliebt bei Klappläden', detail: true },
  gelFarbe: { titel: 'Farbe des Geländers', beliebt: 'rahmen', beliebtT: 'Beliebt bei Geländern', schnell: ['db703'], detail: true },
  insFarbe: { titel: 'Farbe des Insektenschutzes', beliebt: 'rahmen', beliebtT: 'Beliebt bei Insektenschutz', detail: true },
  fbaFarbe: { titel: 'Farbe der Fensterbank außen', beliebt: 'sonne', beliebtT: 'Beliebt bei Fensterbänken', schnell: ['db703'], detail: true }
};
/* Auswahl einer Detailfarbe (OPT der Gruppe aus dem Register, sfK und sfS nutzen die Töne des Sonnenschutzes) */
const fwOpts = (feld) => { const d = AW.DETAIL.find((x) => x.k === feld); return OPT[(d && d.g) || feld] || []; };
const fwBeliebt = (g) => (window.RAL ? window.RAL.BELIEBT[g] || [] : COLORS.slice(0, 11).map((c) => c.k)).filter((k) => FARBE_K[k]);
/* Welcher Schlüssel gerade gilt (für die gedrückte Farbe); offen oder eingetippt ohne Eintrag → keiner */
function fwAktiv(feld) {
  const w = S.win;
  if (feld === 'fa' || feld === 'fi') {
    const innen = feld === 'fi'; if (rahmenFarbe(w, innen ? 'innen' : 'aussen').offen) return '';
    const f = farbLesen(innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA);
    return f ? f.key || '' : innen ? (w.gleich ? w.fa : w.fi) : w.fa;
  }
  const f = farbLesen(w[FW[feld].wunsch]);
  return f ? (feld === 'gf' ? '' : f.key || '') : w[feld];
}
/* Was oben groß steht: Name, Code und Zusätze (eigene Angabe, wie außen) */
function fwAnzeige(feld) {
  const w = S.win;
  if (feld === 'fa' || feld === 'fi') {
    const c = rahmenFarbe(w, feld === 'fi' ? 'innen' : 'aussen'), wie = feld === 'fi' && w.gleich ? 'wie außen' : '';
    if (c.offen) return { offen: true, name: 'Noch offen', zeile: ['im Modell neutral weiß', wie] };
    return { name: c.name, bg: c.bg, zeile: [c.code === 'eigene Farbe' ? '' : c.code, c.eigen ? 'eigene Angabe' : '', wie] };
  }
  if (FW[feld].detail) {
    const v = w[feld], o = fwOpts(feld).find((x) => x.k === v), e = o ? null : ralFarbe(v);
    if (v === undefined || v === '') return { offen: true, name: 'Standard', zeile: [(DETAIL_UI[feld] || {}).std || ''] };
    if (v === 'rahmen') { const c = rahmenFarbe(w, 'aussen'); return { name: 'Wie der Rahmen', bg: c.bg, zeile: [c.name] }; }
    return o ? { name: o.label, bg: o.bg, zeile: [] } : e ? { name: e.name, bg: e.bg, zeile: [e.code] } : { name: String(v), zeile: [] };
  }
  const wunsch = w[FW[feld].wunsch], f = farbLesen(wunsch);
  if (f) return { name: f.eintrag ? f.eintrag.name : f.name, bg: f.bg, zeile: [f.eintrag ? f.eintrag.code : '', 'eigene Angabe'] };
  const wz = wunsch ? 'Wunsch: ' + wunsch : '';
  if (feld === 'gf') { const o = OPT.gf.find((g) => g.k === w.gf) || OPT.gf[0]; return { name: o.label, bg: o.bg, zeile: [wz] }; }
  const e = behangRal(feld, w[feld]);
  if (e) return { name: e.name, bg: e.bg, zeile: [e.code, wz] };
  const o = OPT[feld].find((x) => x.k === w[feld]) || OPT[feld][0];
  return { name: o.label, bg: o.bg, zeile: [wz] };
}
function fwKopfInnen(feld) {
  const a = fwAnzeige(feld), z = a.zeile.filter(Boolean).join(' · ');
  return '<span class="fw-tupf' + (a.offen ? ' offen' : '') + '"' + (a.bg ? ' style="background: ' + a.bg + '"' : '') + ' aria-hidden="true"></span><span class="tx"><b>' + esc(a.name) + '</b>' + (z ? '<small>' + esc(z) + '</small>' : '') + '</span>';
}
const fwKopf = (feld, dazu) => '<div class="fw-zeile"><div class="qcur fw-cur" aria-live="polite">' + fwKopfInnen(feld) + '</div>' + (dazu || '') + '</div>';
/* Lange Farbnamen trennen, wo das Wort zusammengesetzt ist („Anthrazit-grau“, „Schoko-laden-braun“), statt mitten im Wort */
const fwTrenn = (name) => String(name).split(' ').map((t) => t.replace(/^(Perl|Leucht|Verkehrs|Signal|Pastell|Schoko|Ultra|Chrom|Rein)(?=[a-zäöüß]{3})/, '$1\u00ad').replace(/([a-zäöüß]{2,})(weiß|grau|braun|schwarz|blau|grün|rot|gelb|orange|violett|beige|rosa|lila|oliv|türkis|elfenbein|aluminium|magenta|gold|kupfer|enzian|brombeer|struktur|glimmer|laden|nacht|maus|raum|oxid|marin|hell|baum|eiche|chester|kiefer)$/, '$1\u00ad$2')).join(' ');
/* Eine Farbe wählen: wie bisher „color“ und „setw“, die eigene Angabe fällt weg, offen ist entschieden */
function fwSetzen(feld, key) {
  const w = S.win; S.offenVorText = null;
  if (feld === 'fa') { w.fa = key; w.wunschA = ''; entschieden(w, 'fa'); }
  else if (feld === 'fi') { w.fi = key; w.gleich = false; w.wunschI = ''; entschieden(w, 'fi'); }
  else if (FW[feld].detail) w[feld] = key;
  else { w[feld] = key; w[FW[feld].wunsch] = ''; entschieden(w, feld); }
}
const FW_LUPE = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="7.6" cy="7.6" r="5.2" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M11.5 11.5L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
/* Knopf zum Farbblatt; in der Führung gesperrt wie die übrigen besonderen Farben */
function fwBlattKnopf(feld, familie, text) {
  const dot = familie === 'holz' ? '<span class="dot" style="background: ' + (FARBE_K.goak || {}).bg + '"></span>' : '<span class="ci">' + FW_LUPE + '</span>';
  const zu = !!S.tour;
  return '<button type="button" class="chip' + (zu ? ' gesperrt' : '') + '" data-farbblatt="' + feld + '"' + (familie ? ' data-familie="' + familie + '"' : '') + (zu ? ' aria-disabled="true" aria-label="' + esc(text) + ', in der Führung gesperrt"' : '') + '>' + dot + esc(text) + (zu ? '<span class="schloss" aria-hidden="true">' + LOCK_S + '</span>' : '') + '</button>';
}
function fwTupfen(k, attrs, aktiv, text) {
  const c = colorOf(k);
  return '<button type="button" class="qsw" ' + attrs + ' data-v="' + esc(k) + '" aria-pressed="' + (k === aktiv) + '" aria-label="' + esc(c.label || c.name) + '"><span class="c" style="background: ' + c.bg + '"></span><span class="n">' + esc(text) + '</span></button>';
}
const FW_HINWEIS = '<p class="fw-hinweis">Am Bildschirm nur ungefähr: Es zählt das Farbmuster.</p>';
function qColor(q) {
  const w = S.win, side = q.side, feld = side === 'innen' ? 'fi' : 'fa', aktiv = fwAktiv(feld);
  const wie = side === 'innen' ? '<button type="button" class="chip" data-act="togglew" data-f="gleich" aria-pressed="' + w.gleich + '">Innen wie außen</button>' : '';
  let h = fwKopf(feld, wie);
  h += '<div class="qswatches fw-raster" role="group" aria-label="Beliebt bei Fenstern">' + fwBeliebt('rahmen').map((k) => fwTupfen(k, 'data-act="color" data-side="' + side + '"', aktiv, (colorOf(k).code || '').replace(/^RAL /, ''))).join('') + '</div>';
  h += '<div class="fw-mehr">' + fwBlattKnopf(feld, '', 'Alle Farben') + fwBlattKnopf(feld, 'holz', 'Holzdekore') + '</div>';
  return h + farbFeld(side === 'innen' ? 'wunschI' : 'wunschA') + FW_HINWEIS;
}
/* Maße in den Wünschen (Unterlicht, Seitenteile, Paneel, Ausladung der Fensterbank): Stufenregler; ein Tipp auf den Wert öffnet die
   Zifferntasten wie beim Messen (S.qMass). Sie stehen unten statt der Navigation, das Modell bleibt, wo es ist. */
const MASS_UL = { f: 'ulH', t: 'Höhe des Unterlichts', st: 'Unterkante Fenster bis Flügel', min: 200, max: 1200, schritt: 50, std: 400 };
const massCfg = (f) => (f === 'ulH' ? MASS_UL : /^teil:\d+$/.test(f) ? teilMassCfg(f) : Object.keys(DETAIL_UI).map((k) => DETAIL_UI[k].mass).find((m) => m && m.f === f) || null);
const massHinweis = (m) => thousand(m.min) + ' bis ' + thousand(m.max) + ' mm';
const massWert = (m, text) => '<button type="button" class="st-wert" data-act="mass-tasten" data-f="' + m.f + '" aria-label="' + esc(m.t + ': ' + text + '. Antippen zum Eintippen') + '">' + esc(text) + '</button>';
function massTasten(f) {
  const m = massCfg(f); if (!m || S.tour) return;
  S.qMass = { f: f, q: S.q, cur: '', msg: '' }; render();
  nachBild(() => { const e = document.getElementById('qm-ein'); if (e) e.focus({ preventScroll: true }); });
}
function massKey(k) {
  const st = S.qMass, m = massCfg(st.f), w = S.win;
  if (!m || k === 'zurueck') { S.qMass = null; return render(); } // Pfeil zurück: ohne Änderung zurück zur Frage
  if (k === 'ok') {
    if (!st.cur) { S.qMass = null; return render(); }
    const v = num(st.cur);
    if (v < m.min || v > m.max) { st.msg = 'Bitte zwischen ' + thousand(m.min) + ' und ' + thousand(m.max) + ' mm.'; if (window.Haptik) window.Haptik.fehler(); return render(); }
    if (/^teil:\d+$/.test(st.f)) teilMm(w, +st.f.slice(5), v); else w[st.f] = v;
    S.qMass = null; if (window.Haptik) window.Haptik.ok(); return render();
  }
  let cur = st.cur || '';
  if (k === 'del') cur = cur.slice(0, -1); else if (/^\d$/.test(k)) { if (cur.length >= 4 || (!cur && k === '0')) return; cur += k; } else return;
  st.cur = cur; st.msg = '';
  const b = document.getElementById('qm-num'); if (b) { b.textContent = cur ? thousand(num(cur)) : '0'; b.classList.toggle('empty', !cur); }
  const h = document.getElementById('qm-h'); if (h) { h.textContent = massHinweis(m); h.classList.remove('bad'); }
}
/* Unterlicht: Art als Chips, Höhe als Stufenregler in 5-cm-Schritten */
function qUnterlicht() {
  const w = S.win, cur = w.ul ? w.ulA : 'nein';
  /* Kurze Antworten als Segmente (die Frage sagt „Unterlicht“); Blatt und Modell nennen weiter OPT.ul */
  let h = auswahl([{ k: 'nein', label: 'Nein' }, { k: 'glas', label: 'Aus Glas' }, { k: 'paneel', label: 'Als Paneel' }], 'data-act="ul-set"', (o) => o.k === cur);
  if (w.ul) h += '<div class="qsteps"><div class="qstep"><span class="t"><b>Höhe des Unterlichts</b><small>Unterkante Fenster bis Flügel</small></span><span class="stepper weit"><button type="button" data-act="ulh" data-v="-50" aria-label="Niedriger"' + (num(w.ulH) > 200 ? '' : ' disabled') + '>−</button>' + massWert(MASS_UL, thousand(w.ulH) + ' mm') + '<button type="button" data-act="ulh" data-v="50" aria-label="Höher"' + (num(w.ulH) < 1200 ? '' : ' disabled') + '>+</button></span></div></div>';
  return h;
}
function qGeh() { const w = S.win; return '<div class="rows">' + switchRow('Gehflügel', 'Ein Flügel geht wie eine Tür auf', !!w.fsw.geh, 'geh', 'fsw', 'fsw') + '</div>'; }
/* Farben für Sonnenschutz außen und Sicht- und Blendschutz innen: die eigenen Töne, beim Sonnenschutz dazu DB 703 und Graualuminium,
   dann „Alle Farben“ mit den bei Rollladen und Raffstore üblichen oben */
function qSwatch(q) {
  const feld = q.f, aktiv = fwAktiv(feld), attrs = 'data-act="setw" data-f="' + feld + '"';
  const eigene = OPT[q.group].map((o) => '<button type="button" class="qsw" ' + attrs + ' data-v="' + o.k + '" aria-pressed="' + (o.k === aktiv) + '" aria-label="' + esc(o.label) + '"><span class="c" style="background: ' + o.bg + '"></span><span class="n">' + esc(o.label) + '</span></button>').join('');
  const dazu = (FW[feld].schnell || []).filter((k) => FARBE_K[k]).map((k) => fwTupfen(k, attrs, aktiv, colorOf(k).code)).join('');
  return fwKopf(feld) + '<div class="qswatches fw-raster fw-5" role="group" aria-label="' + esc(FW[feld].titel) + '">' + eigene + dazu + '</div>' +
    '<div class="fw-mehr">' + fwBlattKnopf(feld, '', 'Alle Farben') + '</div>' + farbFeld(feld === 'sfarbe' ? 'wunschSf' : 'wunschIf');
}
/* Griff: nur Oberflächen, die es an Griffen gibt; alles andere als Wunsch im Feld darunter */
function qGriffFarbe(q) {
  const aktiv = fwAktiv('gf');
  return fwKopf('gf') + '<div class="qswatches fw-raster fw-5" role="group" aria-label="Griff-Farbe">' + OPT.gf.map((o) => '<button type="button" class="qsw" data-act="setw" data-f="gf" data-v="' + o.k + '" aria-pressed="' + (o.k === aktiv) + '" aria-label="' + esc(o.label) + '"><span class="c" style="background: ' + o.bg + '"></span><span class="n">' + esc(o.label) + '</span></button>').join('') + '</div>' + farbFeld('wunschGf');
}
/* Ein Farbtupfen: der Name steht im Namen des Knopfs (und als Tooltip), sichtbar steht der gewählte unter der Reihe (.qcur) */
function qTupf(attrs, k, an, name, bg) { return '<button type="button" class="qsw" ' + attrs + ' data-v="' + k + '" aria-pressed="' + an + '" aria-label="' + esc(name) + '" title="' + esc(name) + '"><span class="c" style="background: ' + bg + '"></span></button>'; }
/* Eigene Farbe: ein Textfeld unter jeder Farbwahl. Erkennt RAL (z. B. 7021), DB 703, Holzdekore, Strukturen, Farbwörter und #hex;
   der Tupfen zeigt die erkannte Farbe, das Modell färbt sich schon beim Tippen. Platzhalter kurz, damit er am Telefon ganz zu lesen ist. */
const FARBFELD = { wunschA: 'Eigene Angabe, z. B. RAL 7021', wunschI: 'Eigene Angabe, z. B. Eiche', wunschGf: 'Wunsch, z. B. Messing matt', wunschSf: 'Eigene Angabe, z. B. DB 703', wunschIf: 'Eigene Angabe, z. B. Taupe' };
const FF_FELD = { wunschA: 'fa', wunschI: 'fi', wunschSf: 'sfarbe', wunschIf: 'ifarbe', wunschGf: 'gf' };
function farbInfo(t) { if (!String(t || '').trim()) return ''; const f = farbLesen(t); return f ? 'Erkannt: ' + f.name + '. So im Modell, der Fensterbauer bekommt genau diese Angabe.' : 'Nicht in der Farbliste. Dein Fensterbauer bekommt den Text und schlägt den nächstliegenden Ton vor.'; }
const FF_X = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
function farbFeld(f) {
  const v = S.win[f] || '', fx = farbLesen(v);
  return '<div class="farbfeld' + (v ? ' hat' : '') + (fx ? ' ok' : '') + '"><span class="ff-tupf" style="' + (fx ? 'background: ' + fx.bg : '') + '" aria-hidden="true"></span><input type="text" id="t-' + f + '" data-in="farbe" data-f="' + f + '" value="' + esc(v) + '" maxlength="60" placeholder="' + esc(FARBFELD[f] || 'Eigene Angabe') + '" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" aria-label="Eigene Farbe eingeben: Nummer, Name oder Beschreibung" aria-describedby="ffi-' + f + '">' +
    '<button type="button" class="ff-x" data-act="farbe-weg" data-f="' + f + '" aria-label="Eigene Farbe löschen"' + (v ? '' : ' hidden') + '>' + FF_X + '</button></div><p class="ff-info" id="ffi-' + f + '" aria-live="polite">' + esc(farbInfo(v)) + '</p>';
}
/* Beim Tippen: Tupfen, Hinweis und Modell nachziehen, ohne neu aufzubauen (Fokus und Cursor bleiben) */
function farbeLive(el, f) {
  const box = el.closest('.farbfeld'), fx = farbLesen(el.value);
  if (box) { box.classList.toggle('hat', !!el.value); box.classList.toggle('ok', !!fx); const t = box.querySelector('.ff-tupf'); if (t) t.style.background = fx ? fx.bg : ''; const x = box.querySelector('.ff-x'); if (x) x.hidden = !el.value; }
  const info = document.getElementById('ffi-' + f); if (info) info.textContent = farbInfo(el.value);
  /* Name der aktuellen Farbe und Auswahl in der Liste gleich mitziehen */
  const w = S.win, feld = FF_FELD[f], cur = document.querySelector('.qpanel .qcur');
  if (cur && feld) cur.innerHTML = fwKopfInnen(feld);
  if (feld) { const a = fwAktiv(feld); document.querySelectorAll('.qpanel .qsw[data-v]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === a))); }
  const ob = document.querySelector('.qpanel .qoffen'); if (ob && (f === 'wunschA' || f === 'wunschI')) ob.setAttribute('aria-pressed', String(istOffen(w, f === 'wunschA' ? 'fa' : 'fi')));
  const st = document.getElementById('w3d'), reg = W3DS.w3d; if (st && reg) { w3dPaint(st, w); w3dLayout(st, w, reg.o); }
}
/* ---------- Farbblatt „Alle Farben“ (S2) ----------
   Oben die gewählte Farbe groß mit Name und Nummer, darunter Suche (Nummer oder Name, tolerant gegen Tippfehler, „RAL“ darf fehlen)
   und die Farbfamilien als Chips; darunter das Raster aller Farben, beliebte zuerst. Das Blatt deckt nur den unteren Teil: Das Modell
   darüber zeigt jede Wahl sofort. Es liegt als eigenes Element neben #app, damit Suche, Fokus und Scrollstand beim Neuzeichnen der App
   bleiben, und schließt sich, sobald die Frage wechselt (Zurück, Weiter, Wechsel des Bildschirms). */
const FB = { feld: '', q: '', familie: '', such: '', el: null, wacht: null };
const fbKurz = (e) => (e.kurz != null ? e.kurz : e.nr || '');
function fbWahlHTML() {
  const a = fwAnzeige(FB.feld), z = a.zeile.filter(Boolean).join(' · ');
  return '<span class="fw-tupf gross' + (a.offen ? ' offen' : '') + '"' + (a.bg ? ' style="background: ' + a.bg + '"' : '') + ' aria-hidden="true"></span><span class="tx"><small id="fb-t">' + esc(FW[FB.feld].titel) + '</small><b>' + esc(a.name) + '</b>' + (z ? '<small>' + esc(z) + '</small>' : '') + '</span>';
}
function fbListeHTML() {
  const R = window.RAL, aktiv = fwAktiv(FB.feld), q = FB.such.trim(), cfg = FW[FB.feld];
  const knopf = (e) => { const k = fbKurz(e); return '<button type="button" class="fb-f' + (k ? '' : ' ohne') + '" data-fb="f" data-v="' + esc(e.key) + '" aria-pressed="' + (e.key === aktiv) + '" aria-label="' + esc(e.label + (e.art === 'holz' ? ', Holzdekor' : '')) + '"><span class="c" style="background: ' + e.bg + '"></span>' + (k ? '<span class="nr">' + esc(k) + '</span>' : '') + '<span class="nm">' + esc(fwTrenn(e.name)) + '</span></button>'; };
  const gruppe = (titel, liste) => (liste.length ? '<h3 class="fb-gr">' + esc(titel) + '</h3><div class="fb-raster">' + liste.map(knopf).join('') + '</div>' : '');
  if (q) {
    const t = R.suche(q);
    if (!t.length) return '<div class="fb-leer"><p><b>Keine Farbe zu „' + esc(q) + '“ gefunden.</b> Prüf die Nummer oder such nach dem Namen, etwa „Anthrazit“. ' + (cfg.wunsch ? 'Oder nimm deine Beschreibung so mit, dein Fensterbauer findet den Ton.</p><button type="button" class="btn ghost" data-fb="wunsch">Als eigene Angabe nehmen</button></div>' : 'Oder schreib den Ton in die Notiz zu dieser Frage, dein Fensterbauer findet ihn.</p></div>');
    return gruppe(t.length + ' Treffer', t);
  }
  if (FB.familie) { const f = R.FAMILIEN.find((x) => x.k === FB.familie); return gruppe(f ? f.label : '', R.liste.filter((e) => e.familie === FB.familie)); }
  const bel = R.BELIEBT[cfg.beliebt].concat(cfg.beliebt === 'rahmen' ? R.BELIEBT.rahmenMehr : []).map(R.eintrag).filter(Boolean);
  return gruppe(cfg.beliebtT || (cfg.beliebt === 'rahmen' ? 'Beliebt bei Fenstern' : cfg.beliebt === 'sonne' ? 'Beliebt bei Rollladen und Raffstore' : 'Beliebt für innen'), bel) + R.FAMILIEN.map((f) => gruppe(f.label, R.liste.filter((e) => e.familie === f.k))).join('');
}
const FB_HILFE = ['Frag deinen Fensterbauer nach dem Farbfächer. Er hat echte Muster, auch für Holzdekore.', 'Auf alten Rechnungen, Auftragsbestätigungen oder dem Etikett im Falz steht die Farbe oft als RAL-Nummer.', 'Soll es zur Haustür, zum Garagentor oder zur Dachrinne passen? Mach ein Foto davon, dein Fensterbauer bestimmt den Ton.', 'Unsicher? Beschreib die Farbe im Feld unter der Auswahl, etwa „wie die Haustür“, oder lass sie offen.'];
function fbHTML() {
  const R = window.RAL, fam = [{ k: '', label: 'Alle' }].concat(R.FAMILIEN), cfg = FW[FB.feld];
  return '<button type="button" class="fb-weg" data-fb="zu" tabindex="-1" aria-label="Farbwahl schließen"></button>' +
    '<div class="fb-blatt" tabindex="-1"><div class="fb-kopf"><div class="grip" aria-hidden="true"></div>' +
    '<div class="fb-wahl"><div class="fb-wahl-t" aria-live="polite">' + fbWahlHTML() + '</div><button type="button" class="btn primary small fb-fertig" data-fb="zu">Fertig</button></div>' +
    '<div class="fb-such">' + FW_LUPE + '<input type="search" id="fb-such" placeholder="Nummer oder Name, z. B. 7016" maxlength="40" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" aria-label="Farbe suchen: Nummer oder Name"><button type="button" class="ff-x" data-fb="leeren" aria-label="Suche löschen" hidden>' + FF_X + '</button></div>' +
    '<div class="fb-fam" role="group" aria-label="Farbfamilien">' + fam.map((f) => '<button type="button" class="chip" data-fb="fam" data-v="' + f.k + '" aria-pressed="' + (f.k === FB.familie) + '">' + (f.hex ? '<span class="dot" style="background: ' + (f.k === 'holz' ? R.holzBg(f.hex) : f.hex) + '"></span>' : '') + esc(f.label) + '</button>').join('') + '</div></div>' +
    '<details class="fb-hilfe"><summary>Woher kenne ich meine Farbe?</summary><ul>' + FB_HILFE.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul></details>' +
    '<p class="fw-hinweis">Farben am Bildschirm weichen vom echten Ton ab. Verbindlich ist das Farbmuster, das dir dein Fensterbauer vor der Bestellung zeigt.</p>' +
    '<div class="fb-liste">' + fbListeHTML() + '</div>' +
    (cfg.offen ? '<button type="button" class="qoffen" data-fb="offen" aria-pressed="' + istOffen(S.win, cfg.offen) + '"><span class="tx"><b>Weiß ich noch nicht</b><small>Dein Fensterbauer berät dich</small></span><span class="mark">' + CHECK_S + '</span></button>' : '') +
    (cfg.detail && (DETAIL_UI[FB.feld] || {}).std ? '<button type="button" class="qoffen qstd" data-fb="std" aria-pressed="' + (S.win[FB.feld] === undefined) + '"><span class="tx"><b>' + esc(stdName()) + '</b><small>' + esc(DETAIL_UI[FB.feld].std) + '</small></span><span class="mark">' + CHECK_S + '</span></button>' : '') + '</div>';
}
/* Liste neu (Suche, Familie) bzw. nur die Wahl oben und die gedrückte Farbe (nach dem Wählen) */
function fbNeu(oben) {
  const el = FB.el; if (!el) return;
  el.querySelector('.fb-liste').innerHTML = fbListeHTML();
  el.querySelectorAll('.fb-fam .chip').forEach((b) => b.setAttribute('aria-pressed', String(!FB.such.trim() && b.getAttribute('data-v') === FB.familie)));
  if (oben) { const bl = el.querySelector('.fb-blatt'), li = el.querySelector('.fb-liste'), kopf = el.querySelector('.fb-kopf'); if (bl.scrollTop > li.offsetTop - kopf.offsetHeight) bl.scrollTop = li.offsetTop - kopf.offsetHeight; }
}
function fbWahlNeu() {
  const el = FB.el; if (!el) return;
  el.querySelector('.fb-wahl-t').innerHTML = fbWahlHTML();
  const a = fwAktiv(FB.feld); el.querySelectorAll('.fb-f').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === a)));
  const ob = el.querySelector('.qoffen'); if (ob && FW[FB.feld].offen) ob.setAttribute('aria-pressed', String(istOffen(S.win, FW[FB.feld].offen)));
  const sb = el.querySelector('.qstd'); if (sb) sb.setAttribute('aria-pressed', String(S.win[FB.feld] === undefined));
}
function fbZu(fokus) {
  const el = FB.el; if (!el) return;
  FB.el = null; if (FB.wacht) { FB.wacht.disconnect(); FB.wacht = null; }
  el.remove();
  if (fokus) { const b = document.querySelector('#app [data-farbblatt="' + FB.feld + '"]'); if (b) b.focus({ preventScroll: true }); }
}
function fbAuf(feld, familie) {
  if (!FW[feld] || !window.RAL || !S.win) return;
  if (S.tour) return tourSchloss();
  fbZu(false);
  Object.assign(FB, { feld: feld, q: S.q, familie: familie || '', such: '' });
  const el = document.createElement('div');
  el.className = 'fb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'fb-t');
  el.innerHTML = fbHTML();
  document.body.appendChild(el); FB.el = el;
  const inp = el.querySelector('#fb-such'), x = el.querySelector('.fb-such .ff-x');
  el.addEventListener('click', (e) => {
    const b = e.target.closest ? e.target.closest('[data-fb]') : null; if (!b) return;
    const a = b.getAttribute('data-fb'), v = b.getAttribute('data-v') || '';
    if (a === 'zu') return fbZu(true);
    if (a === 'fam') { FB.familie = v; FB.such = ''; inp.value = ''; x.hidden = true; return fbNeu(true); }
    if (a === 'leeren') { FB.such = ''; inp.value = ''; x.hidden = true; fbNeu(true); return inp.focus(); }
    if (a === 'f') { fwSetzen(FB.feld, v); render(); return fbWahlNeu(); }
    if (a === 'offen') { offenSetzen(S.win, FW[FB.feld].offen, true); S.offenVorText = null; render(); return fbZu(true); }
    if (a === 'std') { delete S.win[FB.feld]; render(); return fbZu(true); }
    if (a === 'wunsch') {
      const f = FW[FB.feld].wunsch, t = FB.such.trim().slice(0, 60); S.win[f] = t;
      if (f === 'wunschI') S.win.gleich = false;
      if (t) entschieden(S.win, f);
      render(); return fbZu(false);
    }
  });
  inp.addEventListener('input', () => { FB.such = inp.value; x.hidden = !inp.value; fbNeu(true); });
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); if (document.activeElement === inp && inp.value) { inp.value = ''; FB.such = ''; x.hidden = true; return fbNeu(true); } return fbZu(true); }
    if (e.key !== 'Tab') return;
    /* Fokus bleibt im Blatt */
    const ziele = Array.from(el.querySelectorAll('button:not([tabindex="-1"]), input, summary')).filter((z) => !z.hidden && z.offsetParent !== null);
    if (!ziele.length) return;
    const i = ziele.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); ziele[ziele.length - 1].focus(); } else if (!e.shiftKey && i === ziele.length - 1) { e.preventDefault(); ziele[0].focus(); }
  });
  /* Wechselt die Frage oder der Bildschirm (Zurück, Weiter, Verlauf), geht das Blatt zu */
  if (window.MutationObserver) { FB.wacht = new MutationObserver(() => { if (FB.el && (S.screen !== 'frage' || S.q !== FB.q || !S.win)) fbZu(false); }); FB.wacht.observe($app(), { childList: true }); }
  el.querySelector('.fb-blatt').focus({ preventScroll: true });
}
/* ---------- Haus: Fassade und Farbe am Zahnrad der Bühne ----------
   Blatt von unten wie das Farbblatt: darüber bleibt das Modell sichtbar, die Kamera schaut von außen, jede Wahl färbt die Wand sofort
   (w3dPaint, ohne Neuzeichnen). Gewählt werden Art (Putz, Klinker, gedämmt, Holz) und Farbton; die eigene Wahl geht der KI aus dem
   Außenfoto vor (w.e_fassade) und steht im Blatt und beim Betrieb als Angabe des Kunden. Esc, Zurück-Taste, Tipp über dem Blatt und
   „Fertig“ schließen; ein Wechsel der Frage oder des Bildschirms schließt es mit. */
const HS = { el: null, q: '', screen: '', wacht: null };
function hausHTML() {
  const w = S.win, ki = (w.ki && w.ki.fach) || {}, art = w.fassade || 'putz', toene = fassadeTonListe(art), cur = w.fassadeFarbe, foto = ki.fassade && ki.fassade !== 'sonstige' ? AW.lab('fassade', ki.fassade) : '';
  const chips = '<div class="qchips grid2" role="group" aria-label="Art der Fassade">' + OPT.fassade.map((o) => '<button type="button" class="chip" data-hs="art" data-v="' + o.k + '" aria-pressed="' + (o.k === art) + '">' + esc(o.label) + '</button>').join('') + '</div>';
  const tupfen = '<div class="qswatches fw-raster" role="group" aria-label="Farbe der Fassade">' + toene.map((t) => '<button type="button" class="qsw" data-hs="farbe" data-v="' + t[0] + '" aria-pressed="' + (t[0] === cur) + '" aria-label="' + esc(t[1]) + '"><span class="c" style="background: ' + facadeBg(art, t[2]) + '"></span><span class="n">' + esc(t[1]) + '</span></button>').join('') + '</div>';
  const quelle = w.e_fassade ? 'Deine Angabe' + (foto ? ' · laut Außenfoto ' + foto : '') : foto ? 'Laut Außenfoto: ' + foto + '. Stimmt es nicht, tipp die richtige Art an.' : 'Noch keine Angabe: Das Modell zeigt Putz.';
  return '<button type="button" class="fb-weg" data-hs="zu" tabindex="-1" aria-label="Schließen"></button>' +
    '<div class="fb-blatt hs-blatt" tabindex="-1"><div class="fb-kopf"><div class="grip" aria-hidden="true"></div>' +
    '<div class="fb-wahl"><div class="fb-wahl-t hs-kopf"><p class="eyebrow kicker">Haus · Fassade</p><h2 id="hs-t">' + akH('Woraus ist die Wand?') + '</h2></div><button type="button" class="btn primary small" data-hs="zu">Fertig</button></div></div>' +
    '<p class="qcur hs-quelle" aria-live="polite">' + esc(quelle) + '</p>' + chips +
    '<p class="qlabel">Farbe</p>' + tupfen +
    (w.e_fassade ? '<div class="qrow"><button type="button" class="chip" data-hs="foto">' + (foto ? 'Wie auf dem Foto' : 'Zurück auf Putz') + '</button></div>' : '') +
    '<p class="fw-hinweis">Nur fürs Modell und als Hinweis an deinen Fensterbauer. Was er vor Ort sieht, zählt.</p></div>';
}
function hausNeu() { const el = HS.el; if (!el) return; const y = el.querySelector('.fb-blatt').scrollTop; el.innerHTML = hausHTML(); el.querySelector('.fb-blatt').scrollTop = y; }
/* Wand und Blende des Aufsatzkastens sofort umfärben, ohne die Frage neu zu zeichnen */
function hausMalen() { const st = document.getElementById('w3d'), reg = st && W3DS[st.id]; if (reg) w3dPaint(st, reg.w); }
function hausZu(fokus, ohneNeu) {
  const el = HS.el; if (!el) return;
  HS.el = null; if (HS.wacht) { HS.wacht.disconnect(); HS.wacht = null; }
  el.remove();
  if (!ohneNeu) render(); // Kamera und Hinweis der Frage zurück
  if (fokus) { const b = document.querySelector('#w3d [data-w3d="haus"]'); if (b) b.focus({ preventScroll: true }); }
}
function hausAuf(stage) {
  if (!S.win || S.tour) return;
  fbZu(false); hausZu(false, true);
  Object.assign(HS, { q: S.q, screen: S.screen });
  const el = document.createElement('div');
  el.className = 'fb fb-haus'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'hs-t');
  el.innerHTML = hausHTML();
  document.body.appendChild(el); HS.el = el;
  if (stage) {
    w3dView(stage, VIEWS.outside); // von außen sieht man die Wand; render() nach dem Schließen stellt die Ansicht der Frage wieder her
    /* Auf scrollbaren Bildschirmen (Ergebnis) rückt das Modell nach oben, damit es über dem Blatt ganz zu sehen ist */
    const sc = stage.closest('.scroll'); if (sc && !sc.classList.contains('fit')) sc.scrollTop += stage.getBoundingClientRect().top - sc.getBoundingClientRect().top - (parseFloat(getComputedStyle(sc).paddingTop) || 0) - 8; // unter der festen Kopfzeile
  }
  el.addEventListener('click', (e) => {
    const b = e.target.closest ? e.target.closest('[data-hs]') : null; if (!b) return;
    const a = b.getAttribute('data-hs'), v = b.getAttribute('data-v') || '', w = S.win;
    if (a === 'zu') return hausZu(true);
    if (a === 'art') { if (w.fassade !== v) { w.fassade = v; if (!fassadeTonListe(v).some((t) => t[0] === w.fassadeFarbe)) delete w.fassadeFarbe; } w.e_fassade = true; }
    else if (a === 'farbe') { if (w.fassadeFarbe === v) delete w.fassadeFarbe; else w.fassadeFarbe = v; w.e_fassade = true; }
    else if (a === 'foto') { delete w.e_fassade; delete w.fassadeFarbe; w.fassade = 'putz'; fachVerwerten(w); }
    else return;
    hausMalen(); hausNeu(); entwurfMerken();
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); return hausZu(true); }
    if (e.key !== 'Tab') return;
    const ziele = Array.from(el.querySelectorAll('button:not([tabindex="-1"])')).filter((z) => !z.hidden && z.offsetParent !== null);
    if (!ziele.length) return;
    const i = ziele.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); ziele[ziele.length - 1].focus(); } else if (!e.shiftKey && i === ziele.length - 1) { e.preventDefault(); ziele[0].focus(); }
  });
  if (window.MutationObserver) { HS.wacht = new MutationObserver(() => { if (HS.el && (S.screen !== HS.screen || S.q !== HS.q || !S.win)) hausZu(false, true); }); HS.wacht.observe($app(), { childList: true }); }
  el.querySelector('.fb-blatt').focus({ preventScroll: true });
}
document.addEventListener('click', (e) => {
  const b = e.target && e.target.closest ? e.target.closest('[data-farbblatt]') : null;
  if (!b) return;
  e.preventDefault();
  fbAuf(b.getAttribute('data-farbblatt'), b.getAttribute('data-familie') || '');
});
function qOrn() { const w = S.win, cur = ORN.find((o) => o.k === w.orn) || ORN[0]; return '<div class="qswatches">' + ORN.map((o) => qTupf('data-act="setw" data-f="orn"', o.k, w.orn === o.k, o.label, o.bg)).join('') + '</div><p class="qcur"><b>' + esc(cur.label) + '</b> · ' + esc(cur.sub) + '</p>'; }
/* Sprossen: in allen Flügeln gleich, Flügel 1 ist das Muster */
const barBase = (id) => String(id).replace(/s\d+$/, '');
/* ---------- Aufteilung mehrteiliger Elemente (Fenster, Balkontür, Festverglasung) ----------
   w.anteile = Prozent je Flügel bzw. Feld ohne Seitenteile (Summe 100, eine Nachkommastelle); fehlt sie, teilen sich alle die Breite
   gleich. Gilt im Modell (w3dCalc), in den Zeichnungen (winIco, modell.js) und im Blatt als „Aufteilung“ (AW.teilungText). Die Regeln
   (Gültigkeit, freie Breite) liegen in modell.js, damit Betrieb und Server dasselbe rechnen. */
const TEIL_MIN = 300; // mm je Flügel bzw. Feld
const teilFluegel = (w) => (w.sashes || []).filter((x) => !x.st);
const anteileGueltig = (w, n) => AW.anteileGueltig(w, n);
/* freie Breite für die Flügel (mm): lichte Rahmenbreite ohne Pfosten und Seitenteile; ohne Maße die Vorgabe des Modells */
const teilFrei = (w) => AW.teilFrei(w) || Math.max(2 * TEIL_MIN, w3dCalc(w, {}).sw.reduce((s, b, i) => s + (w.sashes[i].st ? 0 : b), 0));
/* Breiten (mm) der Flügel ohne Seitenteile */
function teilBreiten(w, frei) { const n = teilFluegel(w).length, a = anteileGueltig(w, n) ? w.anteile : null; return Array.from({ length: n }, (x, i) => (a ? frei * a[i] / 100 : frei / n)); }
/* Auf zwei Nachkommastellen runden (ein eingetipptes Maß bleibt auf den Millimeter), der letzte nimmt den Rest (Summe genau 100) */
const teilRunden = (a) => { const r = a.map((x) => Math.round(x * 100) / 100); r[r.length - 1] = Math.round((100 - r.slice(0, -1).reduce((s, x) => s + x, 0)) * 100) / 100; return r; };
const teilAnteile = (w, n) => (anteileGueltig(w, n) ? w.anteile.slice() : Array.from({ length: n }, () => 100 / n));
/* Pfosten j auf die Stelle pos (Prozent der freien Breite, von links) schieben: nur die beiden Nachbarn ändern sich */
function teilPfosten(w, j, pos) {
  const n = teilFluegel(w).length; if (n < 2 || !(j < n - 1)) return;
  const a = teilAnteile(w, n), minP = Math.min(45, 100 * TEIL_MIN / teilFrei(w));
  let cum = 0; for (let k = 0; k < j; k++) cum += a[k];
  const summe = a[j] + a[j + 1], p = clamp(pos - cum, minP, summe - minP);
  a[j] = p; a[j + 1] = summe - p;
  w.anteile = teilRunden(a);
}
/* Breite eines Flügels in mm (Zifferntasten): der Nachbar rechts (beim letzten: links) gibt oder nimmt die Differenz, die übrigen bleiben */
function teilMm(w, i, mm) {
  const n = teilFluegel(w).length; if (n < 2 || !(i < n)) return;
  const a = teilAnteile(w, n), frei = teilFrei(w), j = i < n - 1 ? i + 1 : i - 1, minP = Math.min(45, 100 * TEIL_MIN / frei), summe = a[i] + a[j];
  const p = clamp(mm / frei * 100, minP, summe - minP);
  a[i] = p; a[j] = summe - p;
  w.anteile = teilRunden(a);
}
const teilName = (w, i) => ((w.art === 'fest' || (teilFluegel(w)[i] || {}).t === 'F') ? 'Feld ' : 'Flügel ') + (i + 1);
const teilProzent = (p) => (Math.round(p * 10) / 10).toLocaleString('de-DE');
const teilWertHTML = (w, i, B, a) => '<b>' + thousand(Math.round(B[i])) + ' mm</b><small>' + esc(teilName(w, i)) + ' · ' + teilProzent(a[i]) + ' %</small>';
/* Zifferntasten für die Breite eines Flügels (massCfg: Schlüssel teil:<i>) */
function teilMassCfg(f) {
  const w = S.win, i = +f.slice(5), n = teilFluegel(w).length; if (!(i < n) || n < 2) return null;
  const frei = teilFrei(w);
  return { f: f, t: 'Breite ' + teilName(w, i), st: 'lichte Breite im Rahmen', min: TEIL_MIN, max: Math.max(TEIL_MIN, Math.round(frei - TEIL_MIN * (n - 1))), schritt: 10, std: Math.round(frei / n) };
}
/* Aufteilung in der Flügelfrage: je Pfosten ein Schieberegler zwischen den Nachbarn, darüber deren Breite in mm und Prozent (Tipp auf den
   Wert öffnet die Zifferntasten), darunter „Gleich verteilen“. Ziehen verformt das Modell sofort (onInput), Loslassen zeichnet neu. */
function qTeile(w) {
  const n = teilFluegel(w).length; if (n < 2) return '';
  const frei = teilFrei(w), B = teilBreiten(w, frei), a = teilAnteile(w, n), gleich = a.every((x) => Math.abs(x - 100 / n) < 0.15), minP = Math.min(45, 100 * TEIL_MIN / frei);
  let cum = 0; const pos = a.map((x) => (cum += x));
  const wert = (i) => '<button type="button" class="st-wert" data-act="mass-tasten" data-f="teil:' + i + '" aria-label="' + esc(teilName(w, i) + ': ' + thousand(Math.round(B[i])) + ' mm, ' + teilProzent(a[i]) + ' %. Antippen zum Eintippen') + '">' + teilWertHTML(w, i, B, a) + '</button>';
  let h = '<div class="qteile" data-n="' + n + '"><p class="qlabel">Aufteilung' + (gleich ? ' · alle gleich breit' : '') + '</p>';
  for (let j = 0; j < n - 1; j++) {
    /* Grenzen auf halbe Prozent gerundet: ein Regler rastet auf Schritte ab seinem Minimum ein, so bleibt 35 auch 35 */
    const lo = Math.ceil(((j ? pos[j - 1] : 0) + minP) * 2) / 2, hi = Math.floor((pos[j + 1] - minP) * 2) / 2;
    h += '<div class="qteil" data-j="' + j + '"><div class="qteil-k"><span class="l">' + wert(j) + '</span><span class="r">' + wert(j + 1) + '</span></div>' +
      '<input type="range" class="qteil-r" data-in="teil" data-f="' + j + '" min="' + lo.toFixed(1) + '" max="' + hi.toFixed(1) + '" step="0.5" value="' + pos[j].toFixed(1) + '" aria-label="' + esc((n > 2 ? 'Pfosten ' + (j + 1) + ': ' : '') + 'Breite von ' + teilName(w, j) + ' und ' + teilName(w, j + 1) + ' verschieben') + '"></div>';
  }
  h += '<div class="qrow">' + (gleich ? '<span class="sub">Zum Ändern den Regler ziehen oder eine Breite antippen.</span>' : '<button type="button" class="chip" data-act="teil-gleich">Gleich verteilen</button>') + '</div></div>';
  return h;
}
/* Beim Ziehen: Werte neben dem Regler und das Modell nachführen, ohne neu zu zeichnen */
function teilLive(el) {
  const w = S.win, j = +el.getAttribute('data-f'), frei = teilFrei(w), B = teilBreiten(w, frei), a = teilAnteile(w, B.length), row = el.closest('.qteil');
  if (row) { const l = row.querySelector('.l .st-wert'), r = row.querySelector('.r .st-wert'); if (l) l.innerHTML = teilWertHTML(w, j, B, a); if (r) r.innerHTML = teilWertHTML(w, j + 1, B, a); }
  const stage = document.getElementById('w3d'), reg = stage && W3DS[stage.id]; if (reg) w3dLayout(stage, reg.w, reg.o);
}
/* Seitenteile: feste Felder links und/oder rechts neben den Flügeln (x.st), Breite w.seitenB in mm */
function seitenAnwenden(w) {
  const innen = w.sashes.filter((x) => !x.st), l = w.seiten === 'links' || w.seiten === 'beide', r = w.seiten === 'rechts' || w.seiten === 'beide';
  w.sashes = (l ? [{ t: 'F', din: 'L', st: 1 }] : []).concat(innen, r ? [{ t: 'F', din: 'R', st: 1 }] : []);
  if (w.seiten && !num(w.seitenB)) w.seitenB = 400;
  if (!w.seiten) delete w.seitenB;
  mirrorBars(w);
}
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
function qSwitches() { const w = S.win; return '<div class="rows">' + (w.neu ? switchRow('Wanddurchbruch samt Sturz', 'Öffnung brechen, Sturz setzen, Statik klären', w.durchbruch, 'durchbruch', 'neuoeffnung') : switchRow('Altfenster ausbauen und entsorgen', '', w.demontage, 'demontage')) + switchRow('RAL-Montage', 'Luftdicht, gedämmt, schlagregendicht', w.ralm, 'ralm', 'ralmontage') + switchRow('Innenlaibung verputzen', '', w.putz, 'putz') + '</div>'; }
/* Lage: Raum, Geschoss (aus dem Außenfoto vorgeschlagen, bis der Kunde selbst wählt), Anzahl; im Obergeschoss die Brüstung, falls
   sie noch fehlt (davon hängt die Absturzsicherung ab) */
function qLage() {
  const w = S.win, f = (w.ki && w.ki.fach) || {}, ausFoto = !w.e_etage && f.geschoss && f.geschoss === w.etage, oben = (w.etage === 'og' || w.etage === 'dg') && !istTuer(w);
  /* Im OG und DG ohne Brüstungsmaß fragt die Lage danach; das Feld bleibt für dieses Fenster stehen, auch wenn schon etwas eingetragen ist */
  if (oben && !AW.bruDa(w)) S.lageBru = w;
  const obenOhneBru = oben && S.lageBru === w;
  /* Der Name ist Pflicht: Ohne ihn geht es nicht weiter (qStep, saveWin), damit jede Position im Blatt einen Namen hat */
  const nameFehlt = !!S.nameFehler && !nameDa(w);
  return '<div class="rows"><div class="trow pflicht' + (nameFehlt ? ' bad' : '') + '"><label for="t-name">Name des Fensters <span class="pfl">Pflichtfeld</span></label><input type="text" id="t-name" data-in="w" data-f="name" value="' + esc(w.name || '') + '" placeholder="z. B. Küche links" autocomplete="off" maxlength="50" required aria-required="true"' + (nameFehlt ? ' aria-invalid="true" aria-describedby="t-name-f"' : '') + '>' + (nameFehlt ? '<small id="t-name-f" class="trow-f">Bitte gib dem Fenster einen Namen, zum Beispiel Küche links. So findet der Fensterbauer es im Aufmaß wieder.</small>' : '') + '</div></div>' + chips('etage', w.etage, 'etage') +
    (ausFoto ? '<p class="qcur">Geschoss aus dem Außenfoto gelesen. Stimmt es nicht, tipp das richtige an.</p>' : '') +
    '<div class="rows">' + (obenOhneBru ? fieldRow('Brüstungshöhe', 'bru', 'mm', 10, 'absturz') : '') + fieldRow('Gleiche Fenster im Haus', 'anzahl', 'Stück', 1) + '</div>';
}
/* Erreichbarkeit zuerst (das weiß der Kunde), dann der Einbruchschutz mit der Empfehlung der Polizei; RC1 N nur noch, wenn schon gewählt */
function qRc() {
  const w = S.win, offen = istOffen(w, 'rc');
  let h = auswahl(OPT.erreichbar, 'data-act="erreichbar"', (o) => w.erreichbar === o.k);
  h += w.erreichbar === 'ja' ? '<p class="qcur">Die Polizei empfiehlt hier mindestens <b>RC2</b>: Pilzköpfe rundum, abschließbarer Griff, Sicherheitsglas.</p>' : w.erreichbar === 'nein' ? '<p class="qcur">Dann reicht meist der Basisschutz.</p>' : '';
  /* RC1 N nur, wenn ein älteres Aufmaß es hat; RC2 N und RC3 ab den üblichen Wünschen */
  const t = tiefeStufe(), opts = OPT.rc.filter((o) => (o.k !== 'rc1' || w.rc === 'rc1') && ((o.k !== 'rc2n' && o.k !== 'rc3') || t >= 2 || w.rc === o.k));
  h += '<p class="qlabel">Einbruchschutz</p>' + auswahl(opts, 'data-act="setw" data-f="rc"', (o) => !offen && w.rc === o.k);
  if (!offen && (w.rc === 'rc2n' || w.rc === 'rc3')) h += '<p class="qcur">' + (w.rc === 'rc2n' ? '<b>RC2 N</b>: Beschläge wie RC2, aber ohne geprüftes Sicherheitsglas. Günstiger, zählt für die Förderung nicht als einbruchhemmend.' : '<b>RC3</b>: hält auch stärkerem Werkzeug stand, mit dickerem Sicherheitsglas.') + '</p>';
  return h;
}
/* Gestaltung übernehmen: je gespeicherte Gestaltung eine Karte (gleiche zusammengefasst), mit Zeichnung, Räumen und den wichtigsten Angaben */
const DESIGN_FELDER = ['material', 'fa', 'fi', 'gleich', 'wunschA', 'wunschI', 'glas', 'glasfn', 'orn', 'spross', 'breite', 'aufSeite', 'griff', 'gf', 'wunschGf', 'rc', 'sart', 'roll', 'sfarbe', 'wunschSf', 'antrieb', 'iart', 'ifarbe', 'wunschIf', 'insekt', 'fbi', 'fba', 'ralm', 'putz'].concat(AW.DETAIL.filter((d) => d.design).map((d) => d.k));
const DESIGN_OFFEN = ['material', 'fa', 'fi', 'glas', 'glasfn', 'spross', 'griff', 'rc', 'sart', 'einbau', 'antrieb', 'insekt', 'iart', 'fbi', 'fba', 'montage'];
function designVon(w) {
  const o = {}; DESIGN_FELDER.forEach((k) => { o[k] = w[k]; });
  o.offen = DESIGN_OFFEN.filter((k) => w.offen && w.offen[k]);
  o.muster = (w.bars || []).filter((b) => b.s === 0).map((b) => b.d + Math.round(b.p * 1000)).sort().join(',');
  return stabil(o);
}
/* Gestaltung von src auf w: Werte, Sprossenmuster (auf die Flügelzahl von w gespiegelt) und offene Punkte; was zu w nicht passt
   (Griff einer Tür, „bleibt drin“ bei einer neuen Öffnung), wird angeglichen */
function designAnwenden(w, src) {
  DESIGN_FELDER.forEach((k) => { const v = src[k] === undefined ? baseWin()[k] : src[k]; if (v === undefined) delete w[k]; else w[k] = kopie(v); });
  const art = w.art || 'fenster';
  if (art === 'fest') w.griff = 'ohne';
  else if (art === 'hst') { if (!OPT.hstGriff.some((o) => o.k === w.griff)) w.griff = 'standard'; }
  else if (art === 'fsw' || art === 'psk') { if (w.griff !== 'abschliessbar') w.griff = 'standard'; }
  else if (w.griff === 'motor') w.griff = 'standard';
  if (w.neu) { if (w.sart === 'behalten') { w.sart = 'keiner'; w.roll = 'keiner'; } if (w.fbi === 'behalten') w.fbi = 'werzalit'; if (w.fba === 'behalten') w.fba = 'alu'; }
  if (w.teilung === '2s' && src.teilung === '2s') {
    const quelle = (src.sashes || []).filter((x) => !x.st); let k = 0;
    if (quelle.length === 2 && w.sashes.filter((x) => !x.st).length === 2) w.sashes = w.sashes.map((x) => { if (x.st) return x; const q = quelle[k++], o = Object.assign({}, x, { t: q.t }); if (q.steh) o.steh = true; else delete o.steh; return o; });
  }
  if (!istTuer(w) || art === 'balkon') { w.bars = (src.bars || []).filter((b) => b.s === 0).map((b) => ({ id: nid(), s: 0, d: b.d, p: b.p })); mirrorBars(w); w.preset = w.bars.length ? 'eigene' : 'keine'; }
  else { w.bars = []; w.preset = 'keine'; }
  const off = Object.assign({}, w.offen || {}); DESIGN_OFFEN.forEach((k) => { if (src.offen && src.offen[k]) off[k] = true; else delete off[k]; }); w.offen = off;
  return w;
}
function designListe() {
  const eigen = S.editIdx >= 0 && S.windows[S.editIdx] ? S.windows[S.editIdx].wid : null, gruppen = [];
  S.windows.forEach((x, i) => { if (eigen && x.wid === eigen) return; const key = designVon(x), g = gruppen.find((y) => y.key === key); if (g) { g.namen.push(x.name || 'Fenster ' + (i + 1)); g.src = x; g.i = i; } else gruppen.push({ key: key, src: x, i: i, namen: [x.name || 'Fenster ' + (i + 1)] }); });
  return gruppen.reverse().slice(0, 4).map((g) => { const src = g.src, n = g.namen.length; return { i: g.i, src: src, label: 'Wie ' + g.namen[0] + (n === 2 ? ' und ' + g.namen[1] : n > 2 ? ' und ' + (n - 1) + ' weitere' : ''), sub: [istOffen(src, 'material') ? 'Material offen' : lab('material', src.material), rahmenFarbe(src, 'aussen').name, src.bars.length ? lab('spross', src.spross) : '', src.sart && src.sart !== 'keiner' && !istOffen(src, 'sart') ? lab('sart', src.sart) : ''].filter(Boolean).join(' · ') }; });
}
function qDesign() {
  const w = S.win, L = designListe(), jetzt = designVon(w);
  /* Als übernommen gilt eine Karte erst, wenn sie in dieser Sitzung angetippt wurde (gleiche Vorgaben zweier Fenster zählen nicht) */
  const gewaehlt = S.designVorher ? L.find((d) => designVon(designAnwenden(kopie(w), d.src)) === jetzt) : null;
  return '<div class="qcards liste design">' + L.map((d) => '<div class="qo"><button type="button" class="qopt" data-act="design" data-v="' + d.i + '" aria-pressed="' + (d === gewaehlt) + '">' + svgIcon(miniWin(d.src), 44) + '<span class="tx"><span class="lbl">' + esc(d.label) + '</span><span class="sb">' + esc(d.sub) + '</span></span></button></div>').join('') + '</div>' +
    (gewaehlt ? '<div class="qrow"><span class="sub">Übernommen. Speichern oder einzeln anpassen.</span>' + (S.designVorher ? '<button type="button" class="chip" data-act="design-weg">Doch neu gestalten</button>' : '') + '</div>' : '<div class="qrow"><span class="sub">Lieber neu gestalten? Einfach weiter.</span></div>');
}
/* „Weiß ich noch nicht“ als eigene Antwort unter den Optionen; gedrückt, solange die Angabe offen ist */
function offenZeile(q) {
  const w = S.win, an = q.offen === 'absturz' ? !w.absturz : istOffen(w, q.offen);
  return '<button type="button" class="qoffen" data-act="offen" data-f="' + q.offen + '" aria-pressed="' + an + '"><span class="tx"><b>' + esc(q.offenLabel || 'Weiß ich noch nicht') + '</b><small>' + esc(q.offenSub || 'Dein Fensterbauer berät dich') + '</small></span><span class="mark">' + CHECK_S + '</span></button>';
}
function qText() { return '<div class="rows"><div class="trow"><span>Notiz für den Fensterbauer</span><textarea rows="3" id="t-notiz" data-in="w" data-f="notiz" placeholder="z. B. Fenster klemmt, Zugluft unten links">' + esc(S.win.notiz) + '</textarea></div></div>'; }
SCREENS.frage = () => {
  const c = qCurrent(), q = c.q, w = S.win, n = c.list.length, last = c.i === n - 1;
  /* Abschnitt statt Fragenzahl (die Zahl der Fragen wächst mit den Antworten): „Farbe · 1 von 2“, darüber die Leiste der Abschnitte */
  const abs = qAbschnitte(c), ab = abs.find((g) => g.jetzt) || abs[0], sec = ab ? ab.name : qAbschnitt(q);
  const leiste = '<nav class="qleiste" aria-label="Kapitel der Wünsche">' + abs.map((g) => '<button type="button" class="ql' + (g.fertig ? ' fertig' : '') + '" data-act="q-sprung" data-v="' + esc(g.id) + '" data-kap="' + g.k + '"' + (g.jetzt ? ' aria-current="step"' : '') + '>' + (g.fertig ? CHECK : '') + '<span>' + esc(g.name) + '</span></button>').join('') + '</nav>';
  let panel;
  if (q.kind === 'cards') panel = qCards(q); else if (q.kind === 'formen') panel = qFormen(q); else if (q.kind === 'chips') panel = qChips(q); else if (q.kind === 'multi') panel = qMulti(q); else if (q.kind === 'color') panel = qColor(q);
  else if (q.kind === 'orn') panel = qOrn(); else if (q.kind === 'bars') panel = qBars(); else if (q.kind === 'switches') panel = qSwitches(); else if (q.kind === 'lage') panel = qLage();
  else if (q.kind === 'ul') panel = qUnterlicht(); else if (q.kind === 'geh') panel = qGeh(); else if (q.kind === 'swatch') panel = qSwatch(q); else if (q.kind === 'rc') panel = qRc(); else if (q.kind === 'design') panel = qDesign();
  else if (q.kind === 'tiefe') panel = qTiefe(c); else if (q.kind === 'tupfen' || q.kind === 'farbe') panel = qTupfen(q); else if (q.kind === 'mm') panel = ''; else panel = qText();
  if (q.id === 'teilung' || q.id === 'felder') panel += qTeile(w); // Aufteilung bei zwei und mehr Flügeln bzw. Feldern
  if (q.offen) panel += offenZeile(q);
  if (q.detail) panel += detailZusatz(q);
  panel += mehrZeile(c);
  /* Gestaltung übernommen: gleich speichern oder die Fragen einzeln durchgehen */
  const designFertig = q.kind === 'design' && /aria-pressed="true"/.test(panel);
  const isSash = q.sash != null, selIdx = isSash ? q.sash : Math.min(S.selSash, w.sashes.length - 1);
  const view = q.id === 'sprossen' || q.kind === 'bars' ? 'front' : q.view;
  const stage = model(w, { id: 'w3d', view: view, sway: !isSash && q.kind !== 'bars', selectable: isSash, selSash: selIdx, openSash: isSash ? S.openSash : -1, symbols: isSash || q.id === 'richtung', rails: q.kind === 'bars', selBar: S.selBar, formen: q.id === 'form', lupe: !!q.lupe, stageH: 'auto', fitW: q.kind === 'bars' ? 0.76 : view === 'front' ? 0.9 : 0.8, fitH: q.kind === 'bars' ? 0.7 : view === 'front' ? 0.84 : 0.76, hint: q.kind === 'bars' ? '' : (q.hint || '') });
  /* Eyebrow „Kapitel · i von n“, rechts daneben die Tiefe (Pille) und die Notiz */
  const title = hd(sec + ' · ' + (c.i - ab.i0 + 1) + ' von ' + (ab.i1 - ab.i0 + 1), esc(q.title) + (q.g ? ' <button type="button" class="qg" aria-label="' + esc('Erklärung: ' + (GLOSS[q.g] ? GLOSS[q.g].s : q.title)) + '" data-act="gloss" data-k="' + q.g + '">' + ICON_I + '</button>' : ''), q.sub ? esc(q.sub) : '', 'compact', '', tiefeKnopf(q) + notizKnopf(notizOrt()));
  const sichern = istTuer(w) ? 'Tür speichern' : w.art === 'fest' ? 'Verglasung speichern' : 'Fenster speichern';
  /* Das Modell zuerst und immer gleich groß; Frage und Eingabe teilen sich darunter das Dock, das bei Bedarf in sich scrollt.
     Antippen zeichnet neu: dieselbe Frage behält die Stelle im Dock (gemerkt in S.qDock), eine neue Frage beginnt oben. */
  if (S.qDock && (S.qDock.q !== q.id || S.qDock.w !== w)) S.qDock = null;
  if (S.qMass && S.qMass.q !== q.id) S.qMass = null;
  const qm = S.qMass && massCfg(S.qMass.f);
  const dockY = S.qDock ? S.qDock.y : 0;
  queueMicrotask(() => { leisteZeigen(); const d = document.querySelector('.qdock'); if (!d) return; if (dockY) d.scrollTop = dockY; dockMehr(d); });
  /* Kapitelleiste (feste Höhe) über dem Modell, dann das Dock */
  if (qm) {
    const st = S.qMass;
    return { html: leiste + stage + '<div class="qdock qm-dock"><div class="qm-ein" id="qm-ein" tabindex="-1" role="group" aria-labelledby="qm-t qm-h"><span class="tx"><b id="qm-t">' + esc(qm.t) + '</b><small id="qm-h"' + (st.msg ? ' class="bad"' : '') + ' aria-live="polite">' + esc(st.msg || massHinweis(qm)) + '</small></span><span class="qm-num"><b id="qm-num"' + (st.cur ? '' : ' class="empty"') + ' aria-live="polite">' + (st.cur ? thousand(num(st.cur)) : '0') + '</b><span class="u">mm</span></span></div></div>' +
      keypad('Übernehmen', 'Zurück zur Frage, ohne Änderung'), back: ['Zurück', 'qprev'], fit: true, qpos: (c.i + 1) / n };
  }
  const html = leiste + stage + '<div class="qdock">' + title + '<div class="qpanel" data-q="' + q.id + '">' + panel + '</div></div>' + '<div class="qnav"><button type="button" class="btn ghost" data-act="qprev" aria-label="Zurück">' + '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>' +
    (designFertig ? '<button type="button" class="btn ghost anpassen" data-act="qnext">Anpassen</button><button type="button" class="btn primary" data-act="save">Speichern</button>' : '<button type="button" class="btn primary" data-act="qnext">' + (last ? sichern : 'Weiter') + '</button>') + '</div>';
  /* Oben „Fenster“: zur Übersicht aller Fenster (liste, mit Rückfrage bei ungespeicherten Änderungen); der Pfeil unten in der Leiste und die
     Zurück-Taste des Telefons gehen eine Frage zurück (qprev) */
  return { html: html, back: ['Fenster', 'qprev', 'liste'], fit: true, qpos: (c.i + 1) / n };
};
/* Kapitelleiste: das aktuelle Kapitel steht ganz sichtbar, möglichst mittig, links beginnt ein ganzer Chip (ohne Gleiten, die Leiste wird
   bei jedem Antippen neu gezeichnet) */
function leisteZeigen() {
  const l = document.querySelector('.qleiste'), a = l && l.querySelector('[aria-current]'); if (!a || l.scrollWidth <= l.clientWidth) return;
  const lr = l.getBoundingClientRect(), x = (el) => el.getBoundingClientRect().left - lr.left + l.scrollLeft, pad = parseFloat(getComputedStyle(l).paddingLeft) || 0, max = l.scrollWidth - l.clientWidth;
  const mitte = x(a) + a.offsetWidth / 2 - l.clientWidth / 2;
  /* Links steht ein ganzer Chip am Innenabstand: Kandidaten sind die Anfänge der Chips, das aktuelle Kapitel muss ganz zu sehen sein;
     davon der, der der Mitte am nächsten liegt. Am Ende der Leiste (nichts passt) bleibt die Mitte, den Rand blendet app.css aus */
  const ganz = (s) => x(a) - s >= pad - 1 && x(a) + a.offsetWidth - s <= l.clientWidth - pad + 1;
  const kand = Array.from(l.children).map((c) => x(c) - pad).filter((s) => s >= 0 && s <= max + 1 && ganz(s));
  l.scrollLeft = kand.length ? kand.reduce((b, s) => (Math.abs(s - mitte) < Math.abs(b - mitte) ? s : b)) : Math.max(0, Math.min(max, mitte));
}
/* Dock: Stelle merken und unten ausblenden, solange darunter noch etwas steht */
const dockMehr = (d) => { if (d) d.classList.toggle('mehr', d.scrollHeight - d.clientHeight - d.scrollTop > 8); };
/* Nach einer Wahl im Dock (eine Option mit aria-pressed, nicht „Weiß ich noch nicht“ oder der Standard): Steht unter dem Block noch etwas
   (die Empfehlung und die Stufen beim Einbruchschutz, die Höhe des Unterlichts, die Farbe nach der Art), rollt das Dock weich so weit, dass
   der angetippte Block oben steht und das Folgende zu sehen ist. Sonst tippt man „Weiter“, ohne die weiteren Eingaben je gesehen zu haben.
   Läuft nach dem Neuzeichnen (Mikrotask nach dem, der die Stelle im Dock wiederherstellt). */
function dockNachruecken(el, name) {
  if (S.screen !== 'frage' || !el.hasAttribute('aria-pressed') || el.classList.contains('qoffen') || !el.closest('.qdock')) return;
  const f = el.getAttribute('data-f'), v = el.getAttribute('data-v'), q = S.q;
  queueMicrotask(() => {
    const d = document.querySelector('.qdock'); if (!d || S.q !== q || S.qMass) return;
    const esc1 = (t) => (window.CSS && CSS.escape ? CSS.escape(t) : String(t).replace(/["\\]/g, '\\$&'));
    const neu = d.querySelector('[data-act="' + esc1(name) + '"]' + (f != null ? '[data-f="' + esc1(f) + '"]' : '') + (v != null ? '[data-v="' + esc1(v) + '"]' : ''));
    const block = neu && neu.closest('.qpanel > *'); if (!block || !block.nextElementSibling) return; // der letzte Block: nichts mehr darunter
    if (d.scrollHeight - d.clientHeight - d.scrollTop <= 8) return; // schon alles zu sehen
    const ziel = Math.max(0, Math.min(d.scrollTop + block.getBoundingClientRect().top - d.getBoundingClientRect().top - 4, d.scrollHeight - d.clientHeight));
    if (ziel <= d.scrollTop + 2) return;
    try { d.scrollTo({ top: ziel, behavior: ruhig() ? 'auto' : 'smooth' }); } catch (e) { d.scrollTop = ziel; }
  });
}
document.addEventListener('scroll', (e) => { const d = e.target; if (d && d.classList && d.classList.contains('qdock')) { S.qDock = { q: S.q, w: S.win, y: d.scrollTop }; dockMehr(d); } }, { capture: true, passive: true });
window.addEventListener('resize', () => dockMehr(document.querySelector('.qdock')), { passive: true });
/* Merkzettel für den Wechsel auf „Rund“: was vorher eingestellt war, kommt beim Wechsel zurück wieder (nur in dieser Sitzung) */
const VOR_RUND = new WeakMap();
/* Öffnung vorführen: der Flügel geht kurz auf und wieder zu, der Griff dreht mit; „Fest“ zeigt einen Glanz übers Glas.
   nur = 'D' zeigt nur das Drehen (bei der Frage nach den Scharnieren). Ruhig bei „weniger Bewegung“. */
const DEMO_MS = { D: 1600, K: 1400, DK: 2700, F: 1000, S: 3000, P: 1600, PS: 3000 };
/* Erst wenn das neue Bild gezeichnet ist (zwei Bildwechsel), dann nach kurzer Pause: so beginnt die Vorführung nie mitten im Aufbau */
function nachBild(fn, ms) { requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fn, ms || 0))); }
let demoTimer = null;
const ruhig = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
function oeffnungZeigen(i, nur) {
  const stage = document.getElementById('w3d'), sa = stage ? stage.querySelector('[data-r="sash-' + i + '"]') : null;
  if (!sa) return;
  if (ruhig()) return;
  let t = nur || sa.getAttribute('data-t') || 'F';
  if (t === 'X') return faltenZeigen();
  if (t === 'P') t = 'D';
  stage.querySelectorAll('.w3d-sash').forEach((x) => x.classList.remove('demo-D', 'demo-K', 'demo-DK', 'demo-F', 'demo-S', 'demo-PS'));
  void sa.offsetWidth;
  sa.classList.add('demo-' + t); stage.classList.add('is-vorf');
  clearTimeout(demoTimer);
  demoTimer = setTimeout(() => { sa.classList.remove('demo-' + t); stage.classList.remove('is-vorf'); if (t !== 'F' && window.Haptik) window.Haptik.tick(); }, DEMO_MS[t] || 1500);
}
/* Faltschiebewand vorführen: die Flügel falten sich wie eine Ziehharmonika zum Paket, Flügel für Flügel abwechselnd zum Raum
   und zurück zur Ebene; Position und Drehung je Bild gerechnet, danach stellt w3dLayout die Ruhelage wieder her. */
let faltTimer = 0;
function faltenZeigen() {
  const stage = document.getElementById('w3d'), reg = stage ? W3DS[stage.id] : null;
  if (!reg || reg.w.art !== 'fsw' || ruhig()) return;
  const w = reg.w, o = reg.o, q = (r) => stage.querySelector('[data-r="' + r + '"]');
  const V = w3dCalc(w, Object.assign({}, o, { stageW: stage.clientWidth || 358, stageH: stage.clientHeight || 360, zoom: w3dZ(stage, o) })), s = V.s;
  const sashW = V.sashW * s, n = w.sashes.length, schema = (w.fsw || {}).schema || 'links';
  const nl = schema === 'links' ? n : schema === 'rechts' ? 0 : Math.ceil(n / 2), aus = dg(w, 'fswAuf') && w.fswAuf === 'aussen' ? -1 : 1;
  /* Je Flügel eine Keyframe-Folge aus 27 Stützstellen der Scharnierbewegung (gerechnet, nicht geschätzt): Abstand zur Ruhelage
     in x, Tiefe für jeden zweiten Flügel, Drehung um die Kante zum Paket. Die Animation läuft im Compositor, nicht je Bild im Skript. */
  const D = 2600, N = 26, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), phase = (t) => (t < 0.42 ? ease(t / 0.42) : t < 0.58 ? 1 : ease((1 - t) / 0.42));
  const els = w.sashes.map((x, i) => q('sash-' + i));
  let css = '';
  els.forEach((el, i) => {
    const links = i < nl, k = links ? i : n - 1 - i;
    let kf = '';
    for (let j = 0; j <= N; j++) {
      const t = j / N, a = phase(t) * 78 * Math.PI / 180, dx = (links ? 1 : -1) * k * sashW * (Math.cos(a) - 1), dz = k % 2 ? aus * sashW * Math.sin(a) : 0, dreh = aus * (links ? (k % 2 ? 1 : -1) : (k % 2 ? -1 : 1)) * a * 180 / Math.PI;
      kf += n1(t * 100) + '% { transform: translate3d(' + px(dx) + ', 0px, ' + px(dz) + ') rotateY(' + n1(dreh) + 'deg) } ';
    }
    css += '@keyframes falt-' + i + ' { ' + kf + '} ';
  });
  let st = document.getElementById('falt-css'); if (!st) { st = document.createElement('style'); st.id = 'falt-css'; document.head.appendChild(st); }
  clearTimeout(faltTimer);
  els.forEach((el) => { if (el) el.style.animation = 'none'; });
  st.textContent = css;
  stage.classList.add('is-demo'); void stage.offsetWidth;
  els.forEach((el, i) => { if (!el) return; el.style.transformOrigin = i < nl ? '0 50%' : '100% 50%'; el.style.animation = 'falt-' + i + ' ' + D + 'ms linear both'; });
  faltTimer = setTimeout(() => { els.forEach((el) => { if (el) el.style.animation = ''; }); w3dLayout(stage, w, o); requestAnimationFrame(() => stage.classList.remove('is-demo')); if (window.Haptik) window.Haptik.tick(); }, D + 40);
}
/* Tür vorführen: Hebe-Schiebe schiebt den (ersten) Schiebeflügel, die Faltwand faltet */
function tuerZeigen() {
  const w = S.win; if (!w) return;
  if (w.art === 'fsw') return faltenZeigen();
  const i = w.sashes.findIndex((x) => x.t === 'S' || x.t === 'PS'); if (i >= 0) oeffnungZeigen(i);
}
/* Flügel im Modell antippen: springt zur Frage dieses Flügels */
function onSashTap(i) {
  if (S.screen !== 'frage') return;
  const c = qCurrent();
  S.selSash = i;
  if (c.q.sash != null && c.q.sash !== i) { const nx = c.list.find((q) => q.id === 'typ-' + i); if (nx) { S.q = nx.id; S.dir = i > c.q.sash ? 'fwd' : 'back'; } }
  S.openSash = i;
  render(true);
  nachBild(() => oeffnungZeigen(i), 60);
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

/* ---------- Glossar ---------- */
/* Glossar → Ratgeberseite zum Weiterlesen (nicht im Kundenlink eines Betriebs, dort bleibt der Kunde beim Aufmaß) */
const GLOSS_RG = { dinlr: '/ratgeber/din-links-rechts/', symbol: '/ratgeber/din-links-rechts/', bruestung: '/ratgeber/bruestungshoehe-fenster/', absturz: '/ratgeber/bruestungshoehe-fenster/', aufsatz: '/ratgeber/fenster-mit-rollladen-ausmessen/', vorbau: '/ratgeber/fenster-mit-rollladen-ausmessen/', rollladen: '/ratgeber/fenster-mit-rollladen-ausmessen/', balkon: '/ratgeber/balkontuer-ausmessen/', hst: '/ratgeber/balkontuer-ausmessen/', psk: '/ratgeber/balkontuer-ausmessen/', schwelle: '/ratgeber/balkontuer-ausmessen/', fussboden: '/ratgeber/balkontuer-ausmessen/', feinaufmass: '/ratgeber/bestellmass-fenster/', bestellmass: '/ratgeber/bestellmass-fenster/', ralmontage: '/ratgeber/ral-montage-fenster/', laibung: '/ratgeber/fenster-ausmessen/', anschlag: '/ratgeber/fenster-ausmessen/', 'oeffnung-hoehe': '/ratgeber/fenster-ausmessen/', 'element-hoehe': '/ratgeber/fenster-ausmessen/', 'oeffnung-breite': '/ratgeber/fenster-ausmessen/', 'element-breite': '/ratgeber/fenster-ausmessen/', raender: '/ratgeber/fenster-ausmessen/', lueftung: '/ratgeber/lueftungskonzept-fenstertausch/', foerderung: '/ratgeber/fenster-austauschen/', ersatz: '/ratgeber/fenster-austauschen/', uwert: '/ratgeber/uw-wert-fenster/', fensterbank: '/ratgeber/fensterbank-ausmessen/', material: '/ratgeber/fenster-material-vergleich/', kunststoff: '/ratgeber/fenster-material-vergleich/', kunststoffalu: '/ratgeber/fenster-material-vergleich/', holz: '/ratgeber/fenster-material-vergleich/', holzalu: '/ratgeber/fenster-material-vergleich/', alu: '/ratgeber/fenster-material-vergleich/', oeffnungsart: '/ratgeber/fenster-oeffnungsarten/', dreh: '/ratgeber/fenster-oeffnungsarten/', kipp: '/ratgeber/fenster-oeffnungsarten/', aufmassblatt: '/ratgeber/aufmassblatt-fenster/', budget: '/ratgeber/fenster-angebot-vergleichen/', montage: '/ratgeber/fenster-angebot-vergleichen/' };
const SHORT = Object.fromEntries(Object.keys(GLOSS).map((k) => [k, GLOSS[k].s]));
/* Erklärung je Schritt: der i-Knopf oben und „Zu diesem Schritt“ im Verzeichnis */
const SCHRITT_G = { start: ['elementart', 'ersatz', 'neuoeffnung'], fotos: ['einbausituation', 'referenz'], zeichnen: ['neuoeffnung', 'rohbau'], planmasse: ['rohbau', 'wandstaerke', 'bruestung'], rest: ['raender', 'laibung'], ergebnis: ['rahmenmass', 'bestellmass', 'bruestung', 'laibung'], fertig: ['feinaufmass', 'notizen'], anfrage: ['angaben', 'gebaeude', 'baujahr', 'lueftung'], anfrage2: ['zeitraum', 'budget', 'foerderung'], anfrage3: ['kontakt', 'aufmassblatt'], blatt: ['aufmassblatt', 'feinaufmass'], home: ['referenz', 'feinaufmass', 'notizen'] };
function glossBezug() {
  const k = [], dazu = (g) => { if (g && GLOSS[g] && k.indexOf(g) < 0) k.push(g); };
  if (S.screen === 'frage') { const q = qCurrent().q; dazu(q.g); (q.opts || OPT[q.group] || []).forEach((o) => dazu(optG(q.group, o))); if (q.offen) dazu('offen'); dazu('notizen'); }
  else if (S.screen === 'messen') { dazu(MESS[S.mess.step].g); dazu('rahmenmass'); dazu('referenz'); }
  else (SCHRITT_G[S.screen] || []).forEach(dazu);
  return k;
}
const XK = '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="var(--seg)"></circle><path d="M10.5 10.5l9 9M19.5 10.5l-9 9" fill="none" stroke="var(--muted)" stroke-width="2.2" stroke-linecap="round"></path></svg>';
const PFEIL_L = '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const LUPE_S = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"></circle><path d="M12.6 12.6L17 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>';
const glossZeile = (k) => { const G = GLOSS[k]; return '<button type="button" data-act="gloss" data-k="' + k + '" data-such="' + esc((G.s + ' ' + G.t + ' ' + G.x.join(' ') + ' ' + (G.tipp || '')).toLowerCase()) + '"><span><b>' + esc(G.s) + '</b><small>' + esc(G.t) + '</small></span>' + CHEV + '</button>'; };
function glossIndexBlatt() {
  const bezug = glossBezug(), such = S.glossSuche || '';
  return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet g-index" role="dialog" aria-modal="true" aria-labelledby="gi-t" style="padding-inline: 16px"><div class="grip"></div><div style="display: flex; justify-content: flex-end; margin-right: -4px"><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + XK + '</button></div><p class="eyebrow kicker">Begriffe</p><h2 id="gi-t" style="margin: 12px 0 18px">' + akH('Fachbegriffe, einfach erklärt.') + '</h2>' +
    '<label class="g-such"><span class="g-such-ic">' + LUPE_S + '</span><input type="search" id="g-such" data-in="gsuche" value="' + esc(such) + '" placeholder="Suchen, z. B. Laibung oder Raffstore" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" aria-label="Begriffe durchsuchen"></label>' +
    (bezug.length ? '<section class="g-gruppe g-bezug" data-g="bezug"><p class="eyebrow">Zu diesem Schritt</p><div class="gindex">' + bezug.map(glossZeile).join('') + '</div></section>' : '') +
    GLOSS_GRUPPEN.map((g) => '<section class="g-gruppe" data-g="1"><p class="eyebrow">' + esc(g[0]) + '</p><div class="gindex">' + g[1].map(glossZeile).join('') + '</div></section>').join('') +
    '<p class="sub g-leer" hidden>Dazu gibt es noch keinen Eintrag. Schreib deine Frage einfach in eine Notiz, dein Fensterbauer beantwortet sie.</p>' + rechtLinks() + '</div>';
}
/* Suche im Verzeichnis: blendet Zeilen und leere Gruppen aus, ohne neu zu zeichnen (Fokus und Tastatur bleiben) */
function glossFiltern(t) {
  S.glossSuche = t; const q = String(t || '').trim().toLowerCase(), blatt = document.querySelector('.g-index'); if (!blatt) return;
  let n = 0;
  blatt.querySelectorAll('.g-gruppe').forEach((g) => { let sichtbar = 0; g.querySelectorAll('.gindex > button').forEach((b) => { const an = !q || (b.getAttribute('data-such') || '').indexOf(q) >= 0; b.hidden = !an; if (an) sichtbar++; }); g.hidden = !sichtbar || (!!q && g.getAttribute('data-g') === 'bezug'); n += sichtbar; });
  const leer = blatt.querySelector('.g-leer'); if (leer) leer.hidden = n > 0;
}
function glossBlatt() {
  const G = GLOSS[S.gloss];
  return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet" role="dialog" aria-modal="true" aria-label="Begriffe: ' + esc(G.s) + '"><div class="grip"></div><div class="sheet-top"><button type="button" class="link" data-act="gindex">Alle Begriffe</button><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + XK + '</button></div><p class="eyebrow kicker" style="margin-top: 4px">Begriffe</p><h2 style="margin-top: 14px">' + akH(esc(G.t)) + '</h2><div class="ico' + (G.lottie ? ' ico-l' : '') + '"' + (G.lottie ? ' data-lottie="' + G.lottie + '" data-loop="1"' : '') + '><span class="lottie-still">' + svgIcon(G.ico(), 132) + '</span></div>' + G.x.map((x) => '<p class="x">' + esc(x) + '</p>').join('') +
    (G.tipp ? '<div class="g-tipp"><p class="eyebrow">Praxis-Tipp</p><p>' + esc(G.tipp) + '</p></div>' : '') +
    (G.see.length ? '<div class="see"><span>Siehe auch:</span>' + G.see.filter((k) => GLOSS[k]).map((k) => '<button type="button" class="ulink" style="min-height: 44px" data-act="gloss" data-k="' + k + '">' + esc(SHORT[k]) + '</button>').join('') + '</div>' : '') + (GLOSS_RG[S.gloss] && !S.betrieb ? '<p class="see"><a class="ulink" style="min-height: 44px" href="' + GLOSS_RG[S.gloss] + '" target="_blank" rel="noopener">Ausführlich im Ratgeber</a></p>' : '') + glossNotiz() + rechtLinks() + '</div>';
}
/* Beim Messen gibt es oben keinen Notiz-Knopf mehr (26.10.2026, nur die Überschrift über dem Modell): die Notiz steht im Info-Blatt */
function glossNotiz() {
  const ort = (S.screen === 'messen' || S.screen === 'rest') ? notizOrt() : null; if (!ort) return '';
  const da = !!notizText(ort);
  return '<p class="see"><button type="button" class="ulink" style="min-height: 44px" data-act="notiz-auf" data-v="' + ort[0] + ':' + esc(ort[1]) + '">' + (da ? 'Deine Notiz an den Fensterbauer ansehen' : 'Notiz an den Fensterbauer') + '</button></p>';
}
function sheetsHTML() {
  if (S.fotoGross) return fotoBlatt();
  if (S.notiz) return notizBlatt();
  if (S.verlassen) return verlassenBlatt();
  if (S.sendeFrage && S.screen === 'blatt') return sendeFrageBlatt();
  if (S.gloss && GLOSS[S.gloss]) return glossBlatt();
  if (S.glossIndex) return glossIndexBlatt();
  if (S.wohin) return wohinBlatt();
  if (S.ohneFotoFrage && S.screen === 'fotos') return ohneFotoBlatt();
  return '';
}

/* ---------- Notiz an jeder Stelle ----------
   Auf jedem Schritt und jeder Frage ein Knopf „Notiz“ (oben rechts neben der Erklärung): ein Blatt mit Textfeld, 500 Zeichen,
   Speichern und Löschen. Am Fenster als w.notizen[<stelle>], auf den Anfrage-Seiten als S.proj.notizen[<seite>] (Beschriftung und
   Reihenfolge: AW.notizStelle, AW.notizListe in modell.js). Die Notizen gehen mit dem Fenster in Zwischenstand, Code und Versand,
   zählen aber nicht als Änderung (aenderungFp). Wer das Blatt schließt, ohne zu speichern, verliert nichts: Der Text bleibt. */
const STIFT = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M13.4 3.6l3 3L7.2 15.8 3.6 16.4l.6-3.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M11.4 5.6l3 3" fill="none" stroke="currentColor" stroke-width="1.8"></path></svg>';
const NZ_DA = '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l3.8 3.8L16 6" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const NOTIZ_SCHRITT = { start: 'start', fotos: 'fotos', zeichnen: 'zeichnen', planmasse: 'planmasse', messen: 'messen', rest: 'raender', ergebnis: 'ergebnis' };
const NOTIZ_BEISPIEL = { start: 'z. B. Hier soll später eine Tür hin', fotos: 'z. B. Außen kommt man nur mit einer Leiter heran', zeichnen: 'z. B. Lieber etwas weiter links, wegen des Heizkörpers', planmasse: 'z. B. Die Wand ist etwa 36 cm dick', messen: 'z. B. Links ist der Putz ausgebrochen, das Maß ist unsicher', raender: 'z. B. Oben rechts ist die Öffnung schief', ergebnis: 'z. B. Der Heizkörper sitzt sehr dicht unter dem Fenster', fa: 'z. B. Farbe wie die Haustür', fi: 'z. B. Innen bitte wie die Türzargen', anfrage: 'z. B. Wir planen auch eine neue Haustür', anfrage2: 'z. B. Bitte nicht vor März', anfrage3: 'z. B. Am besten per WhatsApp erreichbar',
  /* Wünsche mit Detailtiefe (#46): Beispiele für die häufigsten Detailfragen */
  tiefe: 'z. B. Die Details möchte ich lieber vor Ort besprechen', stulp: 'z. B. Der linke Flügel wird fast nie geöffnet', seiten: 'z. B. Rechts nur so breit wie der Heizkörper', paneel: 'z. B. Unten steht ein Sofa vor der Tür',
  griffM: 'z. B. Wie die Türdrücker im Flur', griffPos: 'z. B. Unser Sohn ist drei, bitte außer Reichweite', kinder: 'z. B. Im Kinderzimmer bitte abschließbar', luefter: 'z. B. Im Bad beschlägt oft der Spiegel', kontakt: 'z. B. Die Alarmanlage ist von Telenot',
  gitter: 'z. B. Nur am Kellerfenster zum Garten', gelFarbe: 'z. B. Wie das Geländer am Balkon nebenan', sfTeile: 'z. B. Schienen bitte unauffällig', sfK: 'z. B. Wie die Dachrinne', sfS: 'z. B. Wie die Fensterrahmen',
  klFarbe: 'z. B. Wie die Haustür', lamelle: 'z. B. Im Schlafzimmer soll es ganz dunkel werden', sensor: 'z. B. Wir haben schon ein Smart Home von Homematic', insFarbe: 'z. B. Wie die Rahmen außen',
  fbaFarbe: 'z. B. Wie die Fensterbänke im Erdgeschoss', fbaTiefe: 'z. B. Die Fassade wird noch gedämmt', leiste: 'z. B. Innen bitte keine sichtbaren Leisten' };
const notizDarf = () => !(S.betrieb && (S.sent || (S.linkZu && S.linkZu !== 'eingegangen'))) && S.screen !== 'tour';
function notizOrt() {
  if (!notizDarf()) return null;
  if (S.screen === 'frage') { const q = qCurrent().q; return q.id === 'notiz' ? null : ['w', q.id]; }
  if (NOTIZ_SCHRITT[S.screen]) return ['w', NOTIZ_SCHRITT[S.screen]];
  if (/^anfrage[23]?$/.test(S.screen)) return ['p', S.screen];
  return null;
}
const notizZiel = (ort) => (ort[0] === 'p' ? S.proj : S.win);
const notizText = (ort) => (((notizZiel(ort) || {}).notizen) || {})[ort[1]] || '';
function notizKnopf(ort) {
  if (!ort) return '';
  const da = !!notizText(ort), stelle = AW.notizStelle(ort[1]);
  return '<button type="button" class="nz-knopf' + (da ? ' da' : '') + '" data-act="notiz-auf" data-v="' + ort[0] + ':' + esc(ort[1]) + '" aria-label="' + esc((da ? 'Deine Notiz zu „' : 'Notiz zu „') + stelle + (da ? '“ ansehen oder ändern' : '“ anfügen')) + '">' + (da ? NZ_DA : STIFT) + '<span>Notiz</span></button>';
}
/* Werkzeuge oben rechts in jedem Schritt: Erklärung (i) und Notiz */
function schrittTools(g) { return (g && GLOSS[g] ? '<button type="button" class="hd-i" data-act="gloss" data-k="' + g + '" aria-label="' + esc('Erklärung: ' + GLOSS[g].s) + '">' + ICON_I + '</button>' : '') + notizKnopf(notizOrt()); }
function notizBlatt() {
  const n = S.notiz, alt = notizText(n.ort), bn = S.betrieb ? (S.betrieb.name || 'deinen Fensterbauer') : 'deinen Fensterbauer';
  return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="notiz-zu"></button><div class="sheet nz-blatt" role="dialog" aria-modal="true" aria-labelledby="nz-t"><div class="grip"></div><div class="sheet-top"><span></span><button type="button" class="xbtn" aria-label="Schließen" data-act="notiz-zu">' + XK + '</button></div>' +
    '<p class="eyebrow kicker">Notiz · ' + esc(AW.notizStelle(n.ort[1])) + '</p><h2 id="nz-t" tabindex="-1">' + akH('Was soll dein Fensterbauer hier wissen?') + '</h2>' +
    '<p class="nz-sub">Deine Notiz geht mit dem Aufmaß an ' + esc(bn) + ' und steht dort genau an dieser Stelle.</p>' +
    '<textarea id="nz-text" data-in="notiz" rows="5" maxlength="' + AW.NOTIZ_MAX + '" placeholder="' + esc(NOTIZ_BEISPIEL[n.ort[1]] || 'z. B. Bitte hier noch einmal mit mir sprechen') + '" aria-label="' + esc('Deine Notiz zu ' + AW.notizStelle(n.ort[1])) + '" aria-describedby="nz-zahl">' + esc(n.text) + '</textarea>' +
    '<p class="nz-zahl" id="nz-zahl"><span>' + n.text.length + '</span> von ' + AW.NOTIZ_MAX + ' Zeichen</p>' +
    '<div class="nz-knoepfe"><button type="button" class="btn primary" data-act="notiz-sichern">Notiz speichern</button>' + (alt ? '<button type="button" class="btn ghost nz-weg" data-act="notiz-weg">Löschen</button>' : '') + '</div></div>';
}
function notizSetzen(ort, text) {
  text = String(text || '').replace(/\r\n?/g, '\n').trim().slice(0, AW.NOTIZ_MAX);
  const o = notizZiel(ort); if (!o) return false;
  const vorher = (o.notizen || {})[ort[1]] || '';
  if (vorher === text) return false;
  const nz = Object.assign({}, o.notizen || {}); if (text) nz[ort[1]] = text; else delete nz[ort[1]];
  o.notizen = nz;
  if (ort[0] === 'p') persist();
  return true;
}
function notizAuf(v) {
  const i = String(v || '').indexOf(':'), ort = i > 0 ? [v.slice(0, i), v.slice(i + 1)] : null;
  if (!ort || !notizDarf() || !linkOffen()) return;
  S.gloss = null; S.glossIndex = false; S.notiz = { ort: ort, text: notizText(ort) }; render();
  nachBild(() => { const t = document.getElementById('nz-text'); if (t) { t.focus(); try { t.setSelectionRange(t.value.length, t.value.length); } catch (e) { /* ok */ } } }, 30);
}
/* Schließen speichert mit (nichts geht verloren); „Löschen“ leert die Notiz */
function notizZu(art) {
  const n = S.notiz; if (!n) return;
  S.notiz = null;
  const geaendert = notizSetzen(n.ort, art === 'weg' ? '' : n.text);
  render();
  if (art === 'weg') toast('Notiz gelöscht'); else if (art === 'sichern' || geaendert) toast(notizText(n.ort) ? 'Notiz gespeichert' : 'Notiz entfernt');
}

/* ---------- Navigation ohne Sackgassen ----------
   Übersicht (Kopfzeile): Schritte dieses Fensters, Abschnitte der Wünsche, alle Fenster, Fensterliste und Startseite. Wer ein Fenster
   mit offenen Änderungen verlässt, wird gefragt (Speichern, Später weitermachen, Verwerfen, Abbrechen). Das Fenster in Arbeit liegt
   als Entwurf im Browser (eigenes Aufmaß: aufmass.entwurf.v1, Kundenlink: aufmass.k.<code>.entwurf) und übersteht Neuladen und
   Zurück; die Startseite bietet „Fortsetzen“ an. Die Zurück-Taste des Browsers oder Telefons geht einen Schritt zurück bzw.
   schließt zuerst ein offenes Blatt; erst auf der Startseite verlässt sie die App. */
const ENTWURF_EIGEN = 'aufmass.entwurf.v1';
const entwurfKey = () => (S.betrieb ? linkKey() + '.entwurf' : ENTWURF_EIGEN);
const imAssistenten = () => stepsFor(S.win).indexOf(S.screen) >= 0;
const einstiegHier = () => !!(S.einstieg && S.einstieg.i === S.editIdx && S.windows[S.editIdx] && S.screen === S.einstieg.bei && (S.screen !== 'frage' || qCurrent().i === 0));
const zumEinstieg = () => verlassen({ art: 'fenster', i: S.einstieg.i }); // mit Blatt „Noch nicht gespeichert“, wenn sich etwas geändert hat
const STEP_TITEL = { start: 'Start', fotos: 'Fotos', zeichnen: 'Einzeichnen', planmasse: 'Wunschmaße', messen: 'Messen', rest: 'Ränder', ergebnis: 'Ergebnis', frage: 'Wünsche' };
/* Vergleich mit dem gespeicherten Fenster: ohne die Auswertung der Fotos (kommt auch später an) und die Fotos selbst */
function vergleichFp(w) { const o = altAngleichen(Object.assign(baseWin(), w)); // fehlende Felder wie die Vorgabe (ältere Fenster)
  delete o.ki; delete o.fotos; delete o.bilder; delete o.ohneFoto; delete o.wid; delete o.t0; delete o.aend; delete o.ts; return fensterFp(o); }
const entwurfInhalt = (w) => !!(w && (nameDa(w) || bilderVon(w).length || w.ohneFoto || w.plan || MO_KEYS.some((k) => num(w.mo && w.mo[k])) || num(w.el && w.el.w) || num(w.el && w.el.h) || Object.keys(w.notizen || {}).length));
function fensterOffen() {
  if (!imAssistenten() || S.tour) return false;
  const g = S.editIdx >= 0 ? S.windows[S.editIdx] : null;
  return g ? vergleichFp(S.win) !== vergleichFp(g) : entwurfInhalt(S.win);
}
const entwurfDarf = () => !vorschau() && !S.tour && !(S.betrieb && (S.sent || (S.linkZu && S.linkZu !== 'eingegangen')));
let ENTWURF_T = 0;
function entwurfMerken() { clearTimeout(ENTWURF_T); ENTWURF_T = setTimeout(entwurfJetzt, 400); }
function entwurfJetzt() {
  clearTimeout(ENTWURF_T);
  if (!entwurfDarf() || !imAssistenten()) return;
  const g = S.editIdx >= 0 ? S.windows[S.editIdx] : null;
  if (g ? vergleichFp(S.win) === vergleichFp(g) : !entwurfInhalt(S.win)) { if (g) entwurfWeg(g.wid); return; }
  const w = Object.assign({}, S.win); if (w.plan && w.plan.bild) w.plan = Object.assign({}, w.plan, { bild: '' }); // das Bild der Lage entsteht neu aus Foto und Ecken
  const o = { v: 1, ts: Date.now(), kennung: S.betrieb ? '' : ((S.kauf && S.kauf.kennung) || ''), wid: g ? g.wid : '', screen: S.screen, q: S.q, mess: { step: S.mess.step, cur: S.mess.cur }, win: w,
    /* Wünsche: aufgeklappte Kapitel („Mehr zu …“), Rückweg von der Tiefe (Pille) und die Stelle im Dock */
    mehr: MEHR.get(S.win) || null, tz: S.q === 'tiefe' ? S.tiefeZurueck || null : null, dock: S.qDock && S.qDock.q === S.q && S.qDock.w === S.win ? Math.round(S.qDock.y) : 0 };
  try { localStorage.setItem(entwurfKey(), JSON.stringify(o)); } catch (e) { /* Speicher voll oder gesperrt: ohne Entwurf weiter */ }
}
/* Entwurf weg; mit wid nur, wenn er zu diesem Fenster gehört */
function entwurfWeg(wid) {
  try { if (wid) { const o = JSON.parse(localStorage.getItem(entwurfKey()) || 'null'); if (!o || o.wid !== wid) return; } localStorage.removeItem(entwurfKey()); } catch (e) { /* ok */ }
}
function entwurfLesen() {
  if (!entwurfDarf()) return null;
  let o = null; try { o = JSON.parse(localStorage.getItem(entwurfKey()) || 'null'); } catch (e) { o = null; }
  if (!o || o.v !== 1 || !o.win || typeof o.win !== 'object') return null;
  if (!S.betrieb && o.kennung && S.kauf && S.kauf.kennung && o.kennung !== S.kauf.kennung) { entwurfWeg(); return null; } // gehört zu einem anderen Aufmaß
  const g = o.wid ? S.windows.find((x) => x.wid === o.wid) : null, w = altAngleichen(Object.assign(baseWin(), o.win));
  if (g ? vergleichFp(w) === vergleichFp(g) : !entwurfInhalt(w)) { entwurfWeg(); return null; } // nichts Neues
  o.g = g || null; o.w = w;
  return o;
}
function entwurfStelle(o) {
  if (o.screen === 'frage') { const q = qList(o.w).find((x) => x.id === o.q); return 'Wünsche' + (q ? ', ' + AW.notizStelle(q.id) : ''); }
  return STEP_TITEL[o.screen] || 'Start';
}
const entwurfName = (o) => o.w.name || (o.g && o.g.name) || (istTuer(o.w) ? 'Neue Tür' : o.w.art === 'fest' ? 'Neue Verglasung' : 'Neues Fenster');
/* Vor dem Senden (Kundenlink) und vor der Kasse (eigenes Aufmaß): Was nur als Entwurf auf dem Gerät liegt, geht nicht mit */
function entwurfWarnung() {
  const o = entwurfLesen(); if (!o) return '';
  const name = entwurfName(o), an = S.betrieb ? ' nicht mit an ' + (S.betrieb.name || 'deinen Fensterbauer') : ' im Aufmaßblatt';
  const satz = o.g ? 'Deine Änderungen an „' + name + '“ sind nicht gespeichert. Erst speichern oder verwerfen, sonst ' + (S.betrieb ? 'gehen sie' : 'fehlen sie') + an + '.'
    : '„' + name + '“ ist angefangen und nicht gespeichert. Erst fertig machen oder verwerfen, sonst ' + (S.betrieb ? 'geht es' : 'fehlt es') + an + '.';
  return '<div class="msg warn ek-warn" role="status"><span>' + esc(satz) + '</span><div class="pill-row"><button type="button" class="pill" data-act="entwurf-weiter">Fortsetzen</button><button type="button" class="pill" data-act="entwurf-weg">Verwerfen</button></div></div>';
}
/* „Senden“ mit einem angefangenen Fenster: nachfragen, statt still ohne es zu senden (danach ist der Link erledigt) */
function sendeFrageBlatt() {
  const o = entwurfLesen(); if (!o) return '';
  const name = entwurfName(o), bn = (S.betrieb && S.betrieb.name) || 'deinen Fensterbauer';
  return '<button type="button" class="sheet-bg" aria-label="Abbrechen" data-act="sende-frage-zu"></button><div class="sheet verlassen" role="alertdialog" aria-modal="true" aria-labelledby="sf-t" aria-describedby="sf-s"><div class="grip"></div>' +
    '<p class="eyebrow kicker" style="margin-top: 6px">Nicht gespeichert</p><h2 id="sf-t" tabindex="-1">' + (o.g ? 'Änderungen an ' + esc(name) + ' <span class="ak">fehlen</span> noch' : esc(name) + ' <span class="ak">fehlt</span> noch') + '</h2>' +
    '<p class="vl-sub" id="sf-s">' + esc((o.g ? 'Deine Änderungen an „' + name + '“ liegen nur als Entwurf auf diesem Gerät.' : '„' + name + '“ ist angefangen und liegt nur als Entwurf auf diesem Gerät.') + (INST ? ' Nach dem Senden kommt ' : ' Nach dem Absenden ist der Link erledigt, dann kommt ') + (o.g ? 'nichts davon' : 'es nicht') + ' mehr zu ' + bn + '.') + '</p>' +
    '<div class="vl-knoepfe"><button type="button" class="btn primary" data-act="entwurf-weiter">Erst fertig machen</button><button type="button" class="btn ghost vl-weg" data-act="send-ohne">' + esc(o.g ? 'Ohne die Änderungen senden' : 'Ohne „' + name + '“ senden') + '</button><button type="button" class="link vl-ab" data-act="sende-frage-zu">Abbrechen</button></div></div>';
}
function entwurfKarte() {
  const o = entwurfLesen(); if (!o) return '';
  const name = entwurfName(o);
  return '<section class="card entwurf-karte" aria-label="Angefangenes Fenster"><p class="eyebrow kicker">' + (o.g ? 'Änderungen nicht gespeichert' : 'Angefangen') + '</p><div class="ek-zeile"><span class="ic">' + svgIcon(miniWin(o.w), 44) + '</span><span class="tx"><b>' + esc(name) + '</b><small>Weiter bei: ' + esc(entwurfStelle(o)) + '. Liegt auf diesem Gerät.</small></span></div>' +
    '<div class="ek-knoepfe"><button type="button" class="btn ghost" data-act="entwurf-weiter">Fortsetzen</button><button type="button" class="link ek-weg" data-act="entwurf-weg">Verwerfen</button></div></section>';
}
function entwurfFortsetzen() {
  const o = entwurfLesen(); if (!o) return render();
  if (!linkOffen()) return;
  const i = o.g ? S.windows.indexOf(o.g) : -1, w = o.w;
  if (i < 0) { delete w.wid; delete w.t0; delete w.aend; delete w.ts; }
  ['in', 'out'].forEach((k) => { const p = S.photos[k]; if (p && p.url && !p.demo) { try { URL.revokeObjectURL(p.url); } catch (e) { /* ok */ } } });
  S.win = w; S.editIdx = i; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.designVorher = null; S.nameFehler = false; S.selSash = 0; S.selBar = null; S.openSash = -1;
  S.q = o.q || null; S.mess = { step: clamp(num(o.mess && o.mess.step), 0, 3), cur: String((o.mess && o.mess.cur) || ''), msg: null, ack: false };
  if (o.mehr && typeof o.mehr === 'object') { const m = {}; Object.keys(o.mehr).forEach((k) => { if (KAP_I[k] != null && o.mehr[k]) m[k] = true; }); MEHR.set(w, m); }
  S.tiefeZurueck = typeof o.tz === 'string' ? o.tz : null; S.qDock = num(o.dock) > 0 && S.q ? { q: S.q, w: w, y: num(o.dock) } : null; S.qMass = null;
  fotosInKacheln(S.win, S.photos);
  const ziel = o.screen === 'zeichnen' ? 'fotos' : o.screen;
  go(stepsFor(w).indexOf(ziel) >= 0 ? ziel : 'start');
}
/* Wohin nach der Rückfrage: Fensterliste, ein anderes Fenster, eine Adresse */
function ziehen(z) {
  if (!z || z.art === 'home') { go('home', 'back'); return; }
  if (z.art === 'fenster') return fensterOeffnen(z.i);
  if (z.art === 'url') { location.href = z.url; }
}
function verlassen(z) {
  S.wohin = false;
  if (fensterOffen()) { entwurfJetzt(); S.verlassen = { ziel: z }; return render(); }
  return ziehen(z);
}
function verlassenBlatt() {
  const w = S.win, kann = nameDa(w), neu = !(S.editIdx >= 0 && S.windows[S.editIdx]);
  return '<button type="button" class="sheet-bg" aria-label="Abbrechen" data-act="verlassen-abbrechen"></button><div class="sheet verlassen" role="alertdialog" aria-modal="true" aria-labelledby="vl-t" aria-describedby="vl-s"><div class="grip"></div>' +
    '<p class="eyebrow kicker" style="margin-top: 6px">Noch nicht gespeichert</p><h2 id="vl-t" tabindex="-1">' + akH(neu ? 'Dein Fenster speichern?' : 'Deine Änderungen speichern?') + '</h2>' +
    '<p class="vl-sub" id="vl-s">' + (kann ? '' : 'Zum Speichern fehlt noch der Name des Fensters. ') + 'Lässt du ' + (neu ? 'es' : 'sie') + ' offen, bleibt ' + (neu ? 'es' : 'alles') + ' als Entwurf auf diesem Gerät, und du machst später weiter.</p>' +
    '<div class="vl-knoepfe">' + (kann ? '<button type="button" class="btn primary" data-act="verlassen-speichern">Speichern</button>' : '<button type="button" class="btn primary" data-act="verlassen-name">Namen eingeben</button>') +
    '<button type="button" class="btn ghost" data-act="verlassen-entwurf">Später weitermachen</button><button type="button" class="btn ghost vl-weg" data-act="verlassen-verwerfen">' + (neu ? 'Fenster verwerfen' : 'Änderungen verwerfen') + '</button><button type="button" class="link vl-ab" data-act="verlassen-abbrechen">Abbrechen</button></div></div>';
}
/* Gespeichertes Fenster öffnen (Liste, Übersicht) */
function fensterOeffnen(i) {
  if (S.betrieb && S.sent) return; if (!linkOffen()) return;
  if (!S.windows[i]) return go('home', 'back');
  S.win = altAngleichen(Object.assign(baseWin(), kopie(S.windows[i]))); S.editIdx = i; S.selSash = 0; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.designVorher = null; fotosInKacheln(S.win, S.photos); return go('fertig');
}
/* Stand eines Schritts für die Übersicht: erreichbar und erledigt */
function schrittStand(s, w) {
  const d = derive(w), vier = !!(num(w.mo.hm) && num(w.mo.wm) && num(w.el.h) && num(w.el.w)), masse = w.neu ? !!(d.moW && d.moH) : d.complete;
  const geht = { start: true, fotos: true, zeichnen: !!planFoto(), planmasse: true, messen: true, rest: vier, ergebnis: masse, frage: masse }[s];
  const fertig = { start: S.screen !== 'start' || S.editIdx >= 0, fotos: bilderVon(w).length > 0 || !!w.ohneFoto || (w.fotos || 0) > 0, zeichnen: !!w.plan, planmasse: masse, messen: vier, rest: MO_KEYS.every((k) => num(w.mo[k])), ergebnis: masse && S.screen === 'frage', frage: nameDa(w) && S.editIdx >= 0 }[s];
  return { geht: !!geht, fertig: !!fertig };
}
/* Kapitel der Wünsche (KAPITEL, QKAP): die sichtbaren Fragen je Kapitel, mit Stand (erledigt, jetzt); id ist die erste sichtbare Frage */
function qAbschnitte(c) {
  const out = [];
  c.list.forEach((q, i) => { const k = KAP_I[q.kap] != null ? q.kap : 'aufbau', g = out.length && out[out.length - 1].k === k ? out[out.length - 1] : null; if (g) g.i1 = i; else out.push({ k: k, name: qAbschnitt(q), i0: i, i1: i, id: q.id }); });
  out.forEach((g) => { g.jetzt = c.i >= g.i0 && c.i <= g.i1; g.fertig = c.i > g.i1; });
  return out;
}
function wohinBlatt() {
  const wiz = imAssistenten(), w = S.win, lk = !!S.betrieb, steps = stepsFor(w), elN = istTuer(w) ? 'Tür' : w.art === 'fest' ? 'Verglasung' : 'Fenster';
  const titel = wiz ? (w.name || (S.editIdx >= 0 ? 'Fenster ' + (S.editIdx + 1) : 'Neues ' + (elN === 'Tür' ? 'Element' : elN))) : 'Wohin möchtest du?';
  let h = '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="wohin-zu"></button><div class="sheet wohin" role="dialog" aria-modal="true" aria-labelledby="wo-t"><div class="grip"></div><div class="sheet-top"><span></span><button type="button" class="xbtn" aria-label="Schließen" data-act="wohin-zu">' + XK + '</button></div><p class="eyebrow kicker">Übersicht</p><h2 id="wo-t" tabindex="-1">' + akH(esc(titel)) + '</h2>';
  if (wiz) {
    h += '<p class="eyebrow wo-k">Schritte</p><div class="wo-schritte">' + steps.map((s, i) => { const st = schrittStand(s, w), jetzt = s === S.screen; return '<button type="button" class="wo-schritt' + (jetzt ? ' jetzt' : '') + (st.fertig ? ' fertig' : '') + '" data-act="wohin-schritt" data-v="' + s + '"' + (st.geht ? '' : ' aria-disabled="true"') + (jetzt ? ' aria-current="step"' : '') + '><span class="wo-n">' + (st.fertig && !jetzt ? CHECK : String(i + 1)) + '</span><span class="wo-l">' + esc(STEP_TITEL[s]) + '</span></button>'; }).join('') + '</div>';
    if (S.screen === 'frage') { const c = qCurrent(); h += '<p class="eyebrow wo-k">Wünsche</p><div class="wo-abschnitte">' + qAbschnitte(c).map((g) => '<button type="button" class="chip' + (g.fertig ? ' haken' : '') + '" data-act="q-sprung" data-v="' + esc(g.id) + '"' + (g.jetzt ? ' aria-current="true"' : '') + '>' + esc(g.name) + '</button>').join('') + '</div>'; }
  }
  if (S.windows.length) {
    h += '<p class="eyebrow wo-k">' + (lk ? 'Deine Fenster für ' + esc(S.betrieb.name || 'deinen Fensterbauer') : 'Deine Fenster') + ' · ' + S.windows.length + '</p><div class="gindex wo-fenster">' + S.windows.map((x, i) => '<button type="button" data-act="wohin-fenster" data-i="' + i + '"' + (wiz && i === S.editIdx ? ' aria-current="true"' : '') + '><span class="wo-ic">' + svgIcon(miniWin(x), 36) + '</span><span><b>' + esc(x.name || 'Fenster ' + (i + 1)) + '</b><small>' + esc('Pos. ' + (i + 1) + ' · ' + fensterStatus(x)) + (wiz && i === S.editIdx ? ' · gerade offen' : '') + '</small></span>' + CHEV + '</button>').join('') + '</div>';
  }
  h += '<div class="wo-knoepfe">' + (wiz && nameDa(w) && fensterOffen() ? '<button type="button" class="btn primary" data-act="wohin-speichern">Speichern und zur Liste</button>' : '') +
    '<button type="button" class="btn ghost" data-act="wohin-liste">' + (S.screen === 'home' ? 'Zur Liste' : INST ? 'Zur Startseite' : lk ? 'Zur Startseite des Aufmaßes' : 'Zur Fensterliste') + '</button>' +
    (lk ? '' : '<button type="button" class="link wo-web" data-act="wohin-web">Zur Startseite von eeziframes</button>') + '</div></div>';
  return h;
}
/* Status eines Fensters in Listen: nur vollständig oder offen, keine Angaben (die stehen im Aufmaßblatt) */
function fensterStatus(x) {
  const d = derive(x), n = AW.offenListe(AW.nachTiefe(x, S.proj)).length;
  return !d.complete || n ? (d.complete ? 'Maße vollständig' : 'Maße offen') + (n ? ', ' + n + (n === 1 ? ' Wunsch offen' : ' Wünsche offen') : '') : 'Vollständig';
}
/* Stand eines Fensters für die Übersicht: vollständig, Maße offen oder die Zahl der offenen Wünsche; welche es sind, steht nie in Listen (Entscheidung des Inhabers) */
function fensterStand(x) {
  const d = derive(x), offen = AW.offenListe(AW.nachTiefe(x, S.proj)), n = offen.length;
  if (!d.complete) return { k: 'masse', text: 'Maße offen' + (n ? ' · ' + n + (n === 1 ? ' Wunsch offen' : ' Wünsche offen') : '') };
  if (n) return { k: 'wunsch', text: n === 1 ? '1 Wunsch offen' : n + ' Wünsche offen' };
  return { k: 'voll', text: 'Vollständig' };
}
/* Kopf der Übersicht: „Deine Fenster.“ mit dem Stand in einem Satz und einem Balken (vollständige Fenster von allen), rechts „+ Fenster“;
   ohne Fenster der Satz aus aufmassStand. T: Sie-Form im Kundenlink */
function uebersichtKopf(T) {
  const F = T || ((sie, du) => du), n = S.windows.length;
  let stand = esc(aufmassStand());
  if (n) {
    const st = S.windows.map(fensterStand), voll = st.filter((s) => s.k === 'voll').length, masse = st.filter((s) => s.k === 'masse').length, wunsch = st.filter((s) => s.k === 'wunsch').length;
    const satz = voll === n ? (n === 1 ? F('Ihr Fenster ist vollständig.', 'Dein Fenster ist vollständig.') : 'Alle ' + n + ' Fenster sind vollständig.')
      : voll + ' von ' + n + ' vollständig' + (masse ? ' · ' + masse + ' ohne Maße' : '') + (wunsch ? ' · ' + wunsch + ' mit offenen Wünschen' : '');
    stand = '<span class="ueb-zeile">' + esc(satz) + '</span><span class="ueb-prog" role="progressbar" aria-label="Vollständige Fenster" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + voll + '"><i style="width: ' + Math.round(voll / n * 100) + '%"></i></span>';
  }
  const neu = n && neuMoeglich() && linkOffen() ? '<button type="button" class="pill hd-neu" data-act="new">' + PLUS + 'Fenster</button>' : '';
  return hd(F('Ihr Aufmaß', 'Dein Aufmaß'), F('Ihre Fenster.', 'Deine Fenster.'), stand, '', '', neu);
}
/* Browser- und Telefon-Zurück: ein Eintrag im Verlauf fängt die Zurück-Taste ab; die Adresse (auch #k-…) bleibt gleich. FALLE_URL ist
   die Adresse, an der die Falle steht: Ein Sprung zu einer anderen Adresse (Link im selben Tab, Hash) ist kein Zurück der App */
let FALLE_URL = '', FALLE_AUS = 0, VERLAUF = false;
function falleStellen() {
  if (!VERLAUF || Date.now() < FALLE_AUS) return;
  try { if (!(history.state && history.state.eezi === 1)) history.pushState({ eezi: 1 }, '', location.href); FALLE_URL = location.href; } catch (e) { /* ohne Verlauf */ }
}
function zurueckTaste() {
  /* Einwilligung der KI (gemeinsam.js) liegt über allem: Zurück schließt sie wie „Ohne KI weiter“, der Schritt darunter bleibt */
  const ki = document.querySelector('.fx-dialog .fx-nein'); if (ki) { ki.click(); return true; }
  if (FB.el) { fbZu(true); return true; } // Farbblatt „Alle Farben“ (S2)
  if (HS.el) { hausZu(true); return true; } // Blatt „Haus“ (Fassade)
  if (S.fotoGross) { S.fotoGross = null; render(); return true; }
  if (S.notiz) { notizZu(); return true; }
  if (S.verlassen) { S.verlassen = null; render(); return true; }
  if (S.sendeFrage) { S.sendeFrage = false; render(); return true; }
  if (S.gloss || S.glossIndex) { S.gloss = null; S.glossIndex = false; render(); return true; }
  if (S.wohin) { S.wohin = false; render(); return true; }
  if (S.ohneFotoFrage) { S.ohneFotoFrage = false; render(); return true; }
  if (S.qMass && S.screen === 'frage') { S.qMass = null; render(); return true; } // Zifferntasten in den Wünschen
  if (S.screen === 'messen' && S.mess && S.mess.pad) { messZu(); return true; } // Zifferntasten beim Messen: erst das Blatt zu
  if (S.screen === 'rest' && S.rest && S.rest.pad) { restZu(); return true; }
  if (S.screen === 'home' && !S.tour) return false;
  act('back', document.body);
  return true;
}
function verlaufBinden() {
  VERLAUF = true;
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.eezi === 1) { FALLE_URL = location.href; return; } // Vor auf die Falle: nichts zu tun
    if (location.href !== FALLE_URL) { FALLE_URL = location.href; return; } // andere Adresse: das erledigt hashchange
    if (zurueckTaste()) return falleStellen();
    FALLE_AUS = Date.now() + 1500; // auf der Startseite: die App wirklich verlassen
    try { history.back(); } catch (e) { /* ok */ }
  });
  falleStellen();
}
/* Esc schließt das oberste Blatt */
function escTaste() {
  if (HS.el) { hausZu(true); return true; }
  if (S.fotoGross) { S.fotoGross = null; render(); return true; }
  if (S.notiz) { notizZu(); return true; }
  if (S.verlassen) { S.verlassen = null; render(); return true; }
  if (S.sendeFrage) { S.sendeFrage = false; render(); return true; }
  if (S.gloss || S.glossIndex) { S.gloss = null; S.glossIndex = false; render(); return true; }
  if (S.wohin) { S.wohin = false; render(); return true; }
  if (S.ohneFotoFrage) { S.ohneFotoFrage = false; render(); return true; }
  if (S.qMass && S.screen === 'frage') { S.qMass = null; render(); return true; }
  if (S.screen === 'messen' && S.mess && S.mess.pad) { messZu(); return true; } // Zifferntasten beim Messen
  if (S.screen === 'rest' && S.rest && S.rest.pad) { restZu(); return true; }
  return false;
}

/* ---------- Foto groß ansehen: Zoom mit zwei Fingern, Doppeltipp, Knöpfe + und −, Verschieben ---------- */
function fotoBlatt() {
  const f = S.fotoGross, plan = f.seite === 'plan', p = plan ? null : S.photos[f.seite], src = plan ? (S.win.plan && S.win.plan.bild) : p && p.url;
  if (!src) return '';
  const titel = plan ? 'Lage auf deinem Foto' : f.seite === 'in' ? 'Foto von innen' : 'Foto von außen';
  return '<div class="fz" role="dialog" aria-modal="true" aria-label="' + esc(titel) + '"><div class="fz-kopf"><b>' + esc(titel) + '</b><button type="button" class="xbtn fz-x" aria-label="Schließen" data-act="foto-zu">' + XK + '</button></div>' +
    '<div class="fz-buehne" data-r="fz" aria-label="Zum Vergrößern zwei Finger spreizen oder doppelt tippen"><img class="fz-bild" src="' + src + '" alt="' + esc(titel) + '" draggable="false"></div>' +
    '<div class="fz-unten"><div class="fz-zoom" role="group" aria-label="Zoom"><button type="button" class="fz-k" data-act="foto-zoom" data-v="-1" aria-label="Verkleinern">−</button><span class="fz-wert" aria-live="polite">100 %</span><button type="button" class="fz-k" data-act="foto-zoom" data-v="1" aria-label="Vergrößern">+</button></div>' +
    (plan ? '<div class="pill-row fz-akt"><button type="button" class="pill" data-act="foto-lage">Lage ändern</button></div>'
      : '<div class="pill-row fz-akt"><label class="pill"><input type="file" accept="image/*" capture="environment" data-in="photo" data-f="' + f.seite + '">Neu aufnehmen</label>' + (notizDarf() ? '<button type="button" class="pill" data-act="foto-notiz">' + (notizText(['w', 'fotos']) ? NZ_DA : STIFT) + 'Notiz</button>' : '') + '<button type="button" class="pill danger" data-act="foto-weg">Löschen</button></div>') + '</div></div>';
}
const FZ_MAX = 4;
function fzSetzen(b, z, x, y, gleiten) {
  const img = b.querySelector('.fz-bild'), W = b.clientWidth, H = b.clientHeight; if (!img) return;
  z = clamp(z, 1, FZ_MAX); const mx = (z - 1) * W / 2, my = (z - 1) * H / 2; x = clamp(x, -mx, mx); y = clamp(y, -my, my);
  b._z = { z: z, x: x, y: y };
  img.style.transition = gleiten && !ruhig() ? 'transform var(--t2) var(--e-out)' : 'none';
  img.style.transform = 'translate(' + n1(x) + 'px, ' + n1(y) + 'px) scale(' + z.toFixed(3) + ')';
  const wert = document.querySelector('.fz-wert'); if (wert) wert.textContent = Math.round(z * 100) + ' %';
}
/* Zoom um einen Punkt (Pixel relativ zur Mitte der Bühne): der Punkt bleibt unter dem Finger */
function fzUm(b, z2, px0, py0, gleiten) { const s = b._z || { z: 1, x: 0, y: 0 }, k = clamp(z2, 1, FZ_MAX) / s.z; fzSetzen(b, s.z * k, px0 - (px0 - s.x) * k, py0 - (py0 - s.y) * k, gleiten); }
function fotoZoomKnopf(d) { const b = document.querySelector('[data-r="fz"]'); if (!b) return; const s = b._z || { z: 1 }; fzUm(b, d > 0 ? s.z * 1.6 : s.z / 1.6, 0, 0, true); }
function bindFotoZoom() {
  const b = document.querySelector('[data-r="fz"]'); if (!b || b.getAttribute('data-bound')) return;
  b.setAttribute('data-bound', '1'); fzSetzen(b, 1, 0, 0);
  const pts = new Map(); let start = null, letzterTipp = 0, tippPos = null;
  const mitte = (e) => { const r = b.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  const neuStart = () => { const s = b._z, a = Array.from(pts.values()); start = { z: s.z, x: s.x, y: s.y, a: a.map((p) => p.slice()), d: a.length > 1 ? Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]) : 0 }; };
  b.addEventListener('pointerdown', (e) => {
    if (e.button != null && e.button > 0) return;
    try { b.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    pts.set(e.pointerId, mitte(e)); neuStart();
    if (pts.size === 1) { const jetzt = Date.now(), m = mitte(e); if (jetzt - letzterTipp < 320 && tippPos && Math.hypot(m[0] - tippPos[0], m[1] - tippPos[1]) < 30) { const s = b._z; fzUm(b, s.z > 1.05 ? 1 : 2.5, m[0], m[1], true); letzterTipp = 0; neuStart(); } else { letzterTipp = jetzt; tippPos = m; } }
  });
  b.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId) || !start) return;
    pts.set(e.pointerId, mitte(e)); const a = Array.from(pts.values());
    if (a.length > 1 && start.d) { const d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]), cx = (a[0][0] + a[1][0]) / 2, cy = (a[0][1] + a[1][1]) / 2, c0x = (start.a[0][0] + start.a[1][0]) / 2, c0y = (start.a[0][1] + start.a[1][1]) / 2, z2 = clamp(start.z * d / start.d, 1, FZ_MAX), k = z2 / start.z; fzSetzen(b, z2, cx - (c0x - start.x) * k, cy - (c0y - start.y) * k); }
    else if (a.length === 1 && start.a.length === 1 && b._z.z > 1) fzSetzen(b, start.z, start.x + a[0][0] - start.a[0][0], start.y + a[0][1] - start.a[0][1]);
  });
  const ende = (e) => { pts.delete(e.pointerId); if (pts.size) neuStart(); else start = null; };
  b.addEventListener('pointerup', ende); b.addEventListener('pointercancel', ende);
  b.addEventListener('wheel', (e) => { e.preventDefault(); const m = mitte(e), s = b._z; fzUm(b, s.z * (e.deltaY < 0 ? 1.15 : 1 / 1.15), m[0], m[1]); }, { passive: false });
}
function fotoWeg() {
  const f = S.fotoGross; if (!f || f.seite === 'plan') return;
  const seite = f.seite, p = S.photos[seite], w = S.win, id = w.bilder && w.bilder[seite];
  if (p && p.url && !p.demo) { try { URL.revokeObjectURL(p.url); } catch (e) { /* ok */ } }
  S.photos[seite] = null; S.ai[seite] = null; S.fotoGross = null;
  if (w.bilder) { const b = Object.assign({}, w.bilder); delete b[seite]; w.bilder = Object.keys(b).length ? b : undefined; if (!w.bilder) delete w.bilder; }
  if (S.photos.in || S.photos.out) mergeKI(); else w.ki = null;
  w.fotos = (S.photos.in ? 1 : 0) + (S.photos.out ? 1 : 0);
  if (w.plan && w.plan.seite === seite) w.plan = null;
  if (id && !S.windows.some((x) => bilderVon(x).includes(id))) Fotos.weg([id]); // ein gespeichertes Fenster behält sein Foto, bis es neu gespeichert ist
  toast('Foto gelöscht');
}
/* ---------- Fotos und KI im Hintergrund ---------- */
let DL = null, DLP = null;
/* Grenzen gegen Mehrfachnutzung (sonst ließe sich ein Aufmaß für viele Häuser nutzen): je Aufmaß höchstens 50 angelegte Fenster,
   gelöschte zählen mit; je Fenster nach dem ersten Speichern 7 Tage freies Ändern, danach noch 4 gespeicherte Änderungen, dann ist
   es fest. Gleiche Fenster über „Anzahl“. Beim Kundenlink hält der Server dieselben Zähler (functions/api/entwurf.js), ein geleerter
   Browserspeicher setzt sie also nicht zurück. */
const GRENZE = { fenster: 50, freiTage: 7, aenderungen: 4 }, TAG_MS = 864e5;
const angelegt = () => Math.max(Number(S.angelegt) || 0, S.windows.length);
const neuMoeglich = () => angelegt() < GRENZE.fenster;
const maxMsg = () => 'Ein Aufmaß umfasst höchstens ' + GRENZE.fenster + ' Fenster, gelöschte zählen mit. Gleiche Fenster zählst du über „Anzahl“' + (instWebsite() ? '; für ein weiteres Haus startest du nach dem Senden eine weitere Anfrage.' : S.betrieb ? '; für ein weiteres Haus schickt dir ' + (S.betrieb.name || 'dein Fensterbauer') + ' gern einen eigenen Link.' : '; für ein weiteres Haus beginnst du ein neues Aufmaß.');
/* Stand der Änderungen an einem Fenster: frei (erste Woche, beim Kundenlink auch während einer Nachbesserung, um die der Betrieb
   gebeten hat), rest (Änderungen danach), fest */
function aendStand(w, jetzt) {
  jetzt = jetzt || zeit();
  if (INST && S.betrieb) return { frei: true, nb: false, bis: Infinity, kauf: false, n: Number(w && w.aend) || 0, rest: GRENZE.aenderungen, fest: false, inst: true }; // Instanz: keine Änderungszählung (functions/api/entwurf.js)
  const kaufAm = !S.betrieb && S.kauf && S.kauf.paid ? Number(S.kauf.when) || 0 : 0; // mit dem Kauf endet die freie Woche
  const t0 = Number(w && w.t0) || jetzt, woche = t0 + GRENZE.freiTage * TAG_MS, bis = kaufAm ? Math.min(woche, kaufAm) : woche, n = Number(w && w.aend) || 0;
  const nb = jetzt >= bis && !!(S.betrieb && S.nb), frei = jetzt < bis || nb;
  return { frei: frei, nb: nb, bis: bis, kauf: !!kaufAm && kaufAm <= woche, n: n, rest: Math.max(0, GRENZE.aenderungen - n), fest: !frei && n >= GRENZE.aenderungen };
}
/* Fingerabdruck eines Fensters ohne Zähler und ohne das abgeleitete Bild der Lage (gleiche Regel wie auf dem Server) */
const stabil = (v) => (Array.isArray(v) ? '[' + v.map(stabil).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v));
function fensterFp(w) { const o = Object.assign({}, w); delete o.wid; delete o.t0; delete o.aend; delete o.ts; if (o.plan && typeof o.plan === 'object') { o.plan = Object.assign({}, o.plan); delete o.plan.bild; delete o.plan.bw; delete o.plan.bh; } return stabil(o); }
/* Für die Zählung der Änderungen: ohne die Auswertung der Fotos, die Zahl der Fotos, ihre Kennungen, die Wahl „ohne Foto“ und die Notizen
   je Stelle. Eine Auswertung, die nach dem Speichern ankommt, ein neues Foto oder eine Notiz ist keine Änderung des Kunden (gleiche Regel
   wie auf dem Server) */
function aenderungFp(w) { const o = Object.assign({}, w); delete o.ki; delete o.fotos; delete o.bilder; delete o.ohneFoto; delete o.notizen; delete o.tiefe; return fensterFp(o); }
const neueWid = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const kopie = (o) => JSON.parse(JSON.stringify(o));
const datumKurz = (ms) => { try { return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return ''; } };
/* Darf das offene Fenster noch geändert werden? Sonst ein Hinweis */
/* Seit wann gezählt wird: nach der ersten Woche, oder seit dem Freischalten, wenn das früher war */
const festText = (st) => 'Dieses Fenster ist fest: Die vier Änderungen ' + (st && st.kauf ? 'seit dem Freischalten' : 'nach der ersten Woche') + ' sind aufgebraucht.';
function darfAendern() {
  const g = S.editIdx >= 0 ? S.windows[S.editIdx] : null, st = g ? aendStand(g) : null;
  if (!st || !st.fest) return true;
  toast(festText(st)); return false;
}
/* Kundenlink zu (abgelaufen, deaktiviert)? Dann nichts mehr ändern */
function linkOffen() { if (!S.betrieb || !S.linkZu || S.linkZu === 'eingegangen') return true; toast(S.linkZuText || (INST ? 'Diese Planung ist nicht mehr aktiv.' : 'Dieser Link ist nicht mehr aktiv.')); return false; }

/* ---------- Zwischenstand beim Kundenlink (Server) ----------
   Ohne Fotos und ohne das Bild der Lage. Der Server führt je Fenster zusammen (ts = letztes Speichern des Fensters gewinnt), die
   Angaben zum Haus nach dem neueren Stand (stand = letzte Änderung); die Zähler (angelegt, je Fenster t0 und aend) führt der Server
   und gibt sie zurück. Was hier geändert, aber noch nicht beim Server ist (offen), bleibt auch über das Schließen hinaus gemerkt und
   geht beim nächsten Öffnen hin. Fehlt die Tabelle auf dem Server (aus), bleibt alles im Browser. Antworten gelten nur für den
   Link, für den sie geholt wurden. */
/* Für den Zwischenstand nur Abweichungen vom Standard (wie beim Aufmaß-Code), dazu Kennung und Zähler, ohne Bild der Lage: So ändert
   eine neue App-Fassung mit neuen Feldern nichts an den Fenstern, und der Server zählt keine Änderung, die keiner gemacht hat */
function packFenster(w) {
  const base = baseWin(), o = {};
  Object.keys(w).forEach((k) => { if (NUR_APP[k] || JSON.stringify(w[k]) !== JSON.stringify(base[k])) o[k] = w[k]; });
  if (o.plan && typeof o.plan === 'object' && o.plan.bild) o.plan = Object.assign({}, o.plan, { bild: '', bw: 0, bh: 0 });
  return o;
}
const entwurfFp = () => stabil({ w: S.windows.map(packFenster), p: S.proj, a: angelegt() });
const inhaltFp = () => stabil({ w: S.windows.map(fensterFp), p: S.proj }); // nur Angaben, ohne Zähler
const entwurfAn = () => SERVER.daten && !S.sync.aus && !S.tour && (S.betrieb ? !!S.betrieb.code && !vorschau() && !S.sent && !(S.linkZu && S.linkZu !== 'eingegangen') : kontoAn());
/* Wohin der Zwischenstand geht: beim Kundenlink an den Link, beim eigenen Aufmaß mit Konto ins Konto (mit Anmeldung) */
function syncZiel() {
  if (S.betrieb) return { art: 'link', pfad: '/api/link/' + encodeURIComponent(S.betrieb.code) + '/entwurf' };
  return { art: 'konto', pfad: '/api/kunde/aufmass/' + encodeURIComponent(kennung()) };
}
function syncAbruf(ziel, init) {
  if (ziel.art === 'konto') return kontoAbruf(ziel.pfad, init);
  return fetch(ziel.pfad, Object.assign({}, init, { headers: Object.assign({ accept: 'application/json' }, init.body ? { 'content-type': 'application/json' } : {}) }));
}
function entwurfStand() {
  S.windows.forEach((w) => { if (!w.wid) w.wid = neueWid(); if (!(Number(w.t0) > 0)) w.t0 = zeit(); w.aend = Number(w.aend) || 0; }); // jedes Fenster mit Kennung (der Server zählt danach)
  const pfp = stabil(S.proj); if (pfp !== S.sync.pfp) { if (S.sync.pfp) S.projTs = zeit(); S.sync.pfp = pfp; } // Angaben zum Haus mit eigenem Zeitpunkt
  const fp = entwurfFp(); if (fp !== S.sync.fp) { S.sync.fp = fp; S.stand = zeit(); S.sync.offen = true; }
}
function entwurfPlanen(sofort) { if (!entwurfAn() || !S.sync.offen || !S.sync.geladen || S.sync.voll) return; clearTimeout(S.sync.timer); S.sync.timer = setTimeout(entwurfSenden, sofort ? 0 : 1200); } // voll: erst wieder, wenn im Konto Platz ist
/* Bilder der Lage, die nur auf diesem Gerät liegen, an gleich gebliebene Fenster hängen */
function bilderBehalten(neu) {
  const alt = new Map(S.windows.filter((w) => w.plan && w.plan.bild).map((w) => [w.wid, w.plan]));
  neu.forEach((w) => { const p = alt.get(w.wid); if (p && w.plan && !w.plan.bild && stabil(p.ecken) === stabil(w.plan.ecken)) w.plan = Object.assign({}, w.plan, { bild: p.bild, bw: p.bw, bh: p.bh }); });
  return neu;
}
function metaUebernehmen(m) {
  if (!m) return;
  S.angelegt = Math.max(Number(S.angelegt) || 0, Number(m.angelegt) || 0);
  S.windows.forEach((w) => { const f = (m.fenster || {})[w.wid]; if (!f) return; if (Number(f.t0) > 0) w.t0 = Number(f.t0); w.aend = Math.max(Number(w.aend) || 0, Number(f.aend) || 0); });
}
function entwurfAnnehmen(e) {
  const wid = S.editIdx >= 0 && S.windows[S.editIdx] ? S.windows[S.editIdx].wid : '';
  const alt = S.windows; takeWindows(e.windows || []); const neu = S.windows; S.windows = alt; S.windows = bilderBehalten(neu);
  if (e.proj && Object.keys(e.proj).length) { S.proj = normProj(Object.assign({}, PROJ0, e.proj)); S.projTs = Number(e.projTs) || S.projTs || 0; } // leere Angaben (nach dem Aufräumen) übernimmt die App nicht
  S.sync.pfp = stabil(S.proj);
  S.stand = Number(e.stand) || S.stand;
  S.windows.forEach((w) => { if (S.sync.geloescht[w.wid]) delete S.sync.geloescht[w.wid]; }); // wieder da: anderswo nach dem Löschen geändert
  if (wid) S.editIdx = S.windows.findIndex((w) => w.wid === wid);
}
/* Das Aufmaß ist schon beim Betrieb, gesendet von einem anderen Gerät, oder eine Nachbesserung wurde zurückgezogen: hier nichts mehr
   ändern. runde: die beim Betrieb liegende (so erkennt die App eine spätere Nachbesserung), seit: Eingang beim Betrieb, abweichend:
   hier liegen Änderungen, die nicht angekommen sind */
function schonEingegangen(runde, abweichend, seit) {
  const vorher = S.nb && S.nb.vorher;
  S.sent = { when: Number(seit) || (vorher && vorher.when) || Date.now(), code: (vorher && vorher.code) || '', runde: Number(runde) || (vorher && vorher.runde) || 1, uebertragen: true, anderswo: true, abweichend: !!abweichend };
  S.nb = null; clearTimeout(S.sync.timer); S.sync.offen = false; lokalSpeichern();
}
/* Weicht der Stand hier von dem ab, den dieses Gerät gesendet hat? Bekannt nur, wenn der gesendete Code hier liegt */
function weichtAb(gesendet) {
  const o = gesendet && gesendet.code ? unpackProject(gesendet.code) : null;
  return !!o && stabil(o.w.map(fensterFp)) !== stabil(S.windows.map(fensterFp));
}
function entwurfSenden(behalten) {
  if (!entwurfAn() || S.sync.voll) return Promise.resolve(false);
  if (S.sync.laeuft) { S.sync.wieder = true; return S.sync.p || Promise.resolve(false); }
  const sync = S.sync, ziel = syncZiel();
  sync.laeuft = true; sync.offen = false; clearTimeout(sync.timer);
  const k0 = !S.betrieb && S.kauf && S.kauf.paid && S.kauf.token ? { session: S.kauf.session || '', token: S.kauf.token } : null; // als Gast gekauft: Nachweis mit ins Konto
  const body = JSON.stringify(Object.assign({ windows: S.windows.map(packFenster), proj: S.proj, projTs: S.projTs || 0, stand: S.stand || zeit(), angelegt: angelegt(), bekannt: sync.bekannt || [], geloescht: sync.geloescht || {} }, k0 ? { kauf: k0 } : {})), fpGesendet = entwurfFp();
  sync.p = (async () => {
    let neuZeigen = false, weg = '';
    try {
      const t1 = Date.now(), res = await syncAbruf(ziel, { method: 'POST', body: body, keepalive: !!behalten && body.length < 60000 });
      const r = await res.json().catch(() => null);
      if (r) uhrStellen(r.jetzt, t1, Date.now());
      if (S.sync !== sync) return false; // inzwischen ein anderer Link oder das eigene Aufmaß
      if (instZuPruefen(res, r)) { sync.offen = true; sync.ok = false; lokalSpeichern(); }
      else if (r && r.ok && r.aus) sync.aus = true;
      else if (r && r.ok) {
        /* Zusammengeführten Stand übernehmen, außer hier wurde während der Anfrage weiter geändert: dann nichts überschreiben, sondern
           gleich noch einmal senden; die nächste Antwort bringt den Stand */
        if (r.entwurf && entwurfFp() === fpGesendet) { const vorher = inhaltFp(); entwurfAnnehmen(r.entwurf); neuZeigen = inhaltFp() !== vorher; }
        else if (r.entwurf) sync.wieder = true;
        metaUebernehmen(r.meta);
        if (r.zurueck && r.zurueck.length) toast('Ein Fenster war schon fest; die Änderung daran wurde nicht übernommen.');
        if (ziel.art === 'konto') { bezahltUebernehmen(r.bezahlt); kontoListeMerken(); if (KS) kauf().konto = KS.mail; } // erst jetzt gehört es zu diesem Konto
        sync.ok = true; sync.zuletzt = Date.now();
        if (!sync.wieder) { sync.fp = entwurfFp(); sync.offen = false; } // inzwischen weiter geändert: bleibt offen
        if (INST) setTimeout(fotosHochladen, 0); // Instanz: jetzt kennt der Server die Fenster, ihre Fotos dürfen hin
        lokalSpeichern();
      } else if (ziel.art === 'konto' && res.status === 410 && r && r.geloescht) weg = 'entfernt'; // auf einem anderen Gerät gelöscht
      else if (res.status === 410) {
        const zu = (r && r.zu) || 'abgelaufen';
        if (zu === 'eingegangen') schonEingegangen(r && r.runde, true, r && r.seit); else { S.linkZu = zu; S.linkZuText = (r && r.fehler) || ''; sync.offen = true; lokalSpeichern(); }
        neuZeigen = true;
      } else if (res.status === 409 && r && r.grenze) { sync.ok = true; toast(r.fehler); }
      else if (ziel.art === 'konto' && res.status === 403 && r && r.fremd) weg = 'fremd'; // gehört zu einem anderen Konto
      else if (ziel.art === 'konto' && res.status === 409 && r && r.verwaist) { const k = kauf(); k.kennung = neueKennung(); k.konto = ''; sync.offen = true; sync.wieder = true; lokalSpeichern(); } // die Anmeldung dazu gibt es nicht mehr: unter neuer Kennung sichern
      else if (ziel.art === 'konto' && res.status === 409 && r && r.voll) { sync.voll = true; sync.offen = true; lokalSpeichern(); toast(r.fehler); neuZeigen = true; } // Konto voll: bleibt hier, bis Platz ist
      else { sync.offen = true; sync.ok = false; lokalSpeichern(); }
    } catch (e) { if (S.sync === sync) { sync.offen = true; sync.ok = false; lokalSpeichern(); } }
    if (S.sync !== sync) return false;
    sync.laeuft = false; sync.p = null;
    if (weg) { if (weg === 'fremd') aufmassFremd(); else aufmassEntfernt(); return true; }
    if (neuZeigen && ['home', 'fertig', 'blatt', 'anfrage', 'anfrage2', 'anfrage3'].includes(S.screen)) render();
    if (sync.wieder) { sync.wieder = false; sync.offen = true; entwurfPlanen(); }
    return neuZeigen;
  })();
  return sync.p;
}
/* Vor dem Absenden: Offenes zum Server bringen, dann nachsehen, ob ein anderes Gerät inzwischen weitergemacht hat. true: der Stand
   hier hat sich dabei geändert, oder der Link ist inzwischen zu bzw. das Aufmaß schon beim Betrieb */
async function entwurfAbgleichen() {
  if (kontoAn() && !S.betrieb && S.sync.voll) return 'fehler'; // Konto voll: das Aufmaß hier ist nicht im Konto
  if (!entwurfAn()) return false;
  let anders = false;
  const hin = async () => { for (let i = 0; i < 3 && entwurfAn(); i++) { if (S.sync.p) anders = (await S.sync.p.catch(() => false)) || anders; else if (S.sync.offen) anders = (await entwurfSenden()) || anders; else break; } };
  const her = async () => { anders = (await entwurfLaden()) || anders; return !entwurfAn() || S.sync.aus || S.sync.ok; }; // false: Server nicht erreicht
  if (!S.sync.geladen && !(await her())) return 'fehler'; // noch nie abgeglichen (etwa nach einem Funkloch beim Öffnen)
  await hin();
  if (entwurfAn()) { if (!(await her())) return 'fehler'; await hin(); }
  if (entwurfAn() && S.sync.offen) return 'fehler'; // eigene Änderungen nicht hochgekommen: der Server konnte nicht zusammenführen
  return anders || !entwurfAn();
}
/* Beim Öffnen des Links und beim Zurückkehren in den Tab: Zwischenstand vom Server holen. Übernommen wird er, wenn hier nichts offen
   ist und der Server neuer ist (oder hier nichts liegt); sonst geht der Stand von hier hin und der Server führt zusammen */
async function entwurfLaden() {
  if (S.betrieb ? vorschau() : !kontoAn()) return false;
  const sync = S.sync, ziel = syncZiel();
  try {
    const t1 = Date.now(), res = await syncAbruf(ziel, { cache: 'no-store' });
    const r = await res.json().catch(() => null);
    if (r) uhrStellen(r.jetzt, t1, Date.now());
    if (S.sync !== sync) return false; // inzwischen ein anderer Link, ein anderes Aufmaß oder abgemeldet
    sync.zuletzt = Date.now();
    if (ziel.art === 'konto' && res.status === 403 && r && r.fremd) { aufmassFremd(); return true; }
    if (ziel.art === 'konto' && res.status === 410 && r && r.geloescht) { aufmassEntfernt(); return true; }
    if (ziel.art === 'konto' && res.status === 409 && r && r.verwaist) { const k = kauf(); k.kennung = neueKennung(); k.konto = ''; lokalSpeichern(); sync.geladen = true; sync.offen = true; entwurfPlanen(true); return false; }
    if (!r || !r.ok) { sync.geladen = true; sync.ok = false; return false; }
    if (r.aus) { sync.aus = true; sync.geladen = true; render(); return false; }
    if (ziel.art === 'konto') { bezahltUebernehmen(r.bezahlt); if (r.entwurf && KS) kauf().konto = KS.mail; }
    if (ziel.art === 'link' && r.expires && parseTag(r.expires) >= parseTag(S.betrieb.expires)) S.betrieb.expires = r.expires;
    if (ziel.art === 'link' && r.zu) { sync.geladen = true; if (r.zu === 'eingegangen' && !S.sent) schonEingegangen(r.runde, sync.offen || weichtAb(S.nb && S.nb.vorher), r.seit); else if (r.zu !== 'eingegangen') { S.linkZu = r.zu; S.linkZuText = r.zuText || ''; } render(); return true; }
    const e = r.entwurf, kennt = (r.meta && r.meta.fenster) || {}, unbekannt = S.windows.some((w) => w.wid && !kennt[w.wid]);
    const serverNeuer = !!e && (Number(e.stand) || 0) > (S.stand || 0), leer = !S.windows.length, vorher = inhaltFp(), erstes = !sync.ok;
    if (e && Array.isArray(e.windows) && !sync.offen && !(e.geleert && !leer) && (leer || (serverNeuer && !unbekannt))) { entwurfAnnehmen(e); if (S.nb && S.nb.teil && S.windows.length) S.nb.teil = false; }
    metaUebernehmen(r.meta);
    sync.fp = entwurfFp(); sync.ok = true; sync.geladen = true; lokalSpeichern();
    /* Hier Offenes, hier neuer, hier Fenster, die der Server nie gesehen hat, oder der Server wurde geleert: senden */
    if (S.windows.length && (sync.offen || unbekannt || !e || e.geleert || (S.stand || 0) > (Number(e.stand) || 0))) { if (!S.stand) S.stand = zeit(); sync.offen = true; entwurfPlanen(true); }
    const geaendert = inhaltFp() !== vorher;
    if (geaendert || erstes || S.screen === 'home') render(); // sonst nicht mitten in eine Eingabe hinein
    return geaendert;
  } catch (err) { if (S.sync === sync) { sync.geladen = true; sync.ok = false; } return false; }
}
const parseTag = (t) => { const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(t || '')); return m ? Date.UTC(+m[3], +m[2] - 1, +m[1]) : 0; };
/* Noch nicht Gesendetes beim Verlassen der Seite mitnehmen; nach einer Funkstille erneut versuchen; zurück im Tab nachsehen, ob ein
   anderes Gerät weitergemacht hat (höchstens alle 20 Sekunden) */
window.addEventListener('pagehide', () => { if (S.sync && S.sync.offen && entwurfAn() && S.sync.geladen) entwurfSenden(true); });
window.addEventListener('online', () => { fotosHochladen(); if (S.betrieb && SERVER.daten && S.sync && !S.sync.geladen) return linkPruefen(); if (!S.betrieb && kontoAn() && !S.sync.geladen) return entwurfLaden(); if (S.sync && S.sync.offen) entwurfPlanen(true); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !(S.betrieb || kontoAn())) return;
  fotosHochladen();
  if (S.betrieb && SERVER.daten && !S.sync.geladen) return linkPruefen(); // das erste Prüfen ist nicht durchgekommen
  if (!S.betrieb && S.sync.voll) return kontoListe(); // Konto voll: vielleicht inzwischen anderswo Platz gemacht
  if (!entwurfAn() || S.sync.laeuft) return;
  if (S.sync.offen) return entwurfPlanen(true);
  if (Date.now() - (S.sync.zuletzt || 0) > 20000) entwurfLaden();
});
/* ---------- Konto für Hauseigentümer (ohne Link eines Fensterbauers) ----------
   Gast: alles im Browser. „Aufmaß sichern“: E-Mail und Code (6 bis 10 Stellen), kein Passwort; danach liegt das Aufmaß im Konto
   (functions/api/eigene.js) und wird abgeglichen wie beim Kundenlink. Zum Freischalten ist das Konto Pflicht, der Kauf hängt dann am
   Aufmaß. Die Anmeldung bleibt in diesem Browser (aufmass.kunde, ohne Passwort). Abmelden nimmt das Aufmaß von diesem Gerät, im
   Konto bleibt es. Ohne Konten auf dem Server (SERVER.konten) bleibt alles wie für Gäste, gekauft wird dann ohne Konto. */
const KUNDE = 'aufmass.kunde', ANFRAGE = 'aufmass.kunde.anfrage', BILDER = 'aufmass.bilder.', MAX_AUFMASSE = 20;
const VOLL_TEXT = 'In deinem Konto haben ' + MAX_AUFMASSE + ' Aufmaße Platz. Dieses ist noch nicht gesichert: Lösche in „Dein Konto“ ein altes.';
function kontoLesen() { try { const o = JSON.parse(localStorage.getItem(KUNDE) || 'null'); return o && o.token ? o : null; } catch (e) { return null; } }
let KS = kontoLesen();
/* Eine angefangene Anmeldung gilt eine Stunde (kontoAusLink); danach räumt die App die gemerkte Adresse weg */
try { const a0 = JSON.parse(localStorage.getItem(ANFRAGE) || 'null'); if (a0 && Date.now() - (Number(a0.at) || 0) > 3600000) localStorage.removeItem(ANFRAGE); } catch (e) { /* ohne Speicher */ }
const kontoAn = () => !!(SERVER.konten && KS && KS.token && S.kauf && S.kauf.kennung);
const kontoBereit = () => !!(SERVER.konten && !S.betrieb && !vorschau());
function kontoMerken(s) {
  KS = s && s.token ? { token: s.token, refresh: s.refresh || '', mail: s.mail || '' } : null;
  const schreiben = () => { if (KS) localStorage.setItem(KUNDE, JSON.stringify(KS)); else localStorage.removeItem(KUNDE); };
  try { schreiben(); } catch (e) { platzMachen(); try { schreiben(); } catch (e2) { /* ok */ } } // ein nicht gemerktes Erneuerungstoken hieße beim nächsten Laden: abgemeldet
}
/* Anmeldung in einem anderen Tab: nur erneuert, dann übernehmen; an- oder abgemeldet oder ein anderes Konto, dann neu laden, damit
   Aufmaß und Anmeldung zusammenpassen (sonst schriebe dieser Tab ein Aufmaß zurück, das nicht mehr hierher gehört). Bis dahin sendet
   dieser Tab nichts mehr; neu geladen wird sofort, wenn er im Hintergrund ist oder nichts halb eingegeben ist, sonst danach.
   Ein Tab mit einem Kundenlink ist davon nicht betroffen (die Anmeldung wird beim Wechsel zum eigenen Aufmaß neu gelesen). */
let NEU_LADEN = false;
const RUHIG = ['home', 'meinkonto', 'sichern', 'linkanmelden', 'teilen', 'blatt', 'gekauft', 'kasse', 'konto'];
window.addEventListener('storage', (e) => {
  if (e.key !== KUNDE && e.key !== null) return;
  if (S.betrieb) return;
  const neu = kontoLesen();
  if (neu && KS && neu.mail === KS.mail) { KS = neu; return; }
  if (!neu && !KS) return;
  NEU_LADEN = true; clearTimeout(S.sync.timer); S.sync.aus = true;
  if (document.visibilityState === 'hidden' || RUHIG.includes(S.screen)) location.reload();
});
let erneuernLaeuft = null;
/* alt: das Token, mit dem es gerade nicht ging. Hat ein anderer Tab schon erneuert, gilt dessen Anmeldung: Ein zweimal benutztes
   Erneuerungstoken beendet Supabase sonst überall. Nur eine Ablehnung (401) beendet die Anmeldung hier, keine Störung (503) */
async function kontoErneuern(alt) {
  const frisch = kontoLesen();
  if (frisch && KS && frisch.mail !== KS.mail) return false; // in einem anderen Tab ein anderes Konto: nichts übernehmen, dieser Tab lädt neu
  if (frisch && frisch.token !== alt) { KS = frisch; return true; }
  if (!KS || !KS.refresh) return false;
  if (!erneuernLaeuft) erneuernLaeuft = (async () => {
    try {
      const r = await fetch('/api/kunde/erneuern', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ refresh: KS.refresh }) });
      const j = await r.json().catch(() => null);
      if (r.ok && j && j.ok && j.token) { kontoMerken({ token: j.token, refresh: j.refresh, mail: j.mail || KS.mail }); return true; }
      if (r.status === 401) {
        const nun = kontoLesen(); if (nun && nun.token !== alt && nun.mail === KS.mail) { KS = nun; return true; } // inzwischen anderswo erneuert
        S.konto.abgelaufen = KS.mail; kontoMerken(null); render(); // abgelaufen: das Aufmaß bleibt hier, gesichert wird erst nach neuem Anmelden
      }
      return false;
    } catch (e) { return false; }
  })();
  const ok = await erneuernLaeuft; erneuernLaeuft = null; return ok;
}
/* Abruf mit der Anmeldung; ist sie abgelaufen, einmal erneuern und noch einmal */
async function kontoAbruf(pfad, init) {
  init = init || {};
  const frisch = kontoLesen(); if (frisch && KS && frisch.mail === KS.mail) KS = frisch; // vielleicht in einem anderen Tab erneuert
  const tok = KS ? KS.token : '';
  const los = () => fetch(pfad, Object.assign({}, init, { headers: Object.assign({ accept: 'application/json' }, init.body ? { 'content-type': 'application/json' } : {}, KS ? { authorization: 'Bearer ' + KS.token } : {}) }));
  let res = await los();
  if (res.status === 401 && KS && (await kontoErneuern(tok))) res = await los();
  return res;
}
async function kontoJson(pfad, init) { try { const res = await kontoAbruf(pfad, init); const j = await res.json().catch(() => null); return Object.assign({ _status: res.status }, j || {}); } catch (e) { return { _status: 0, ok: false, fehler: 'Keine Verbindung. Bitte gleich noch einmal.' }; } }
/* Kauf aus dem Konto übernehmen (anderes Gerät, oder der Webhook war schneller) */
function bezahltUebernehmen(b) {
  if (!b || !b.token || S.betrieb) return;
  const k = kauf();
  if (k.paid && k.token === b.token) { if (b.at && k.when !== b.at) { k.when = b.at; lokalSpeichern(); } return; }
  k.paid = true; k.session = b.session || ''; k.token = b.token; k.when = Number(b.at) || Date.now(); k.wartet = ''; if (KS) { k.mail = KS.mail; k.agb = true; }
  lokalSpeichern(); render();
}
let listeZuletzt = 0;
function kontoListeMerken() { if (Date.now() - listeZuletzt > 30000) kontoListe(); }
async function kontoListe() {
  if (!KS) return null;
  listeZuletzt = Date.now();
  const r = await kontoJson('/api/kunde/aufmasse');
  if (r.ok) {
    S.konto.liste = r.aufmasse || []; if (r.aus) SERVER.konten = false;
    if (S.sync.voll && S.konto.liste.length < MAX_AUFMASSE) { S.sync.voll = false; S.sync.offen = true; entwurfPlanen(true); } // wieder Platz, etwa auf einem anderen Gerät gelöscht
    bilderWeg(null, new Set(S.konto.liste.map((a) => a.kennung).concat(S.kauf && S.kauf.kennung ? [S.kauf.kennung] : []))); // Bilder gelöschter oder abgelaufener Aufmaße
    if (['meinkonto', 'home'].includes(S.screen)) render();
  }
  return r.ok ? S.konto.liste : null;
}
/* Bilder der eingezeichneten Lage liegen nur auf diesem Gerät (nicht im Konto). Beim Wechsel des Aufmaßes kommen sie je Aufmaß
   beiseite und beim Zurückwechseln wieder an ihre Fenster (gleiche Kennung, gleiche Ecken) */
function bilderAblegen() {
  const k = S.kauf && S.kauf.kennung; if (!k || !KS) return true;
  const b = {}; S.windows.forEach((w) => { if (w.wid && w.plan && w.plan.bild) b[w.wid] = { bild: w.plan.bild, bw: w.plan.bw, bh: w.plan.bh, ecken: w.plan.ecken }; });
  try { localStorage.removeItem(STORE); } catch (e) { /* ok */ } // das Aufmaß ist im Konto; so liegen die Bilder nicht kurz doppelt im Speicher
  if (!Object.keys(b).length) return true;
  try { localStorage.setItem(BILDER + k, JSON.stringify({ konto: KS.mail, b: b })); return true; } catch (e) { return false; }
}
function bilderZurueck(k) {
  let o = null; try { o = JSON.parse(localStorage.getItem(BILDER + k) || 'null'); } catch (e) { o = null; }
  if (!o || !o.b || !KS || o.konto !== KS.mail) return;
  S.windows.forEach((w) => { const p = o.b[w.wid]; if (p && w.plan && !w.plan.bild && stabil(p.ecken) === stabil(w.plan.ecken)) w.plan = Object.assign({}, w.plan, { bild: p.bild, bw: p.bw, bh: p.bh }); });
  if (lokalSpeichern()) { try { localStorage.removeItem(BILDER + k); } catch (e) { /* ok */ } }
}
/* k: nur dieses Aufmaß; ohne k alle; behalten: Kennungen, deren Bilder bleiben (die Liste im Konto) */
function bilderWeg(k, behalten) {
  try {
    const mail = KS ? KS.mail : '';
    (k ? [BILDER + k] : Object.keys(localStorage).filter((x) => x.indexOf(BILDER) === 0)).forEach((x) => {
      if (behalten) { let o = null; try { o = JSON.parse(localStorage.getItem(x) || 'null'); } catch (e) { o = null; } if (o && o.konto === mail && behalten.has(x.slice(BILDER.length))) return; }
      localStorage.removeItem(x);
    });
  } catch (e) { /* ok */ }
}
/* Speicher voll: zuerst die beiseitegelegten Bilder anderer Aufmaße opfern (Anmeldung und offenes Aufmaß gehen vor) */
function platzMachen() { const k = S.kauf && S.kauf.kennung; try { Object.keys(localStorage).filter((x) => x.indexOf(BILDER) === 0 && x !== BILDER + k).forEach((x) => localStorage.removeItem(x)); } catch (e) { /* ok */ } }
/* Ein leeres Aufmaß mit neuer Kennung, mit Anmeldung gleich dem Konto zugeordnet */
function leeresAufmass() {
  clearTimeout(S.sync.timer); S.sync = syncNeu(); S.sync.geladen = true; S.sync.ok = true;
  S.windows = []; S.proj = Object.assign({}, PROJ0); S.projTs = 0; S.stand = 0; S.angelegt = 0; S.teil = null; S.editIdx = -1; S.win = baseWin(); S.neuFrage = false; S.kontoFrage = '';
  S.kauf = { kennung: neueKennung(), mail: KS ? KS.mail : '', agb: !!KS, pay: '', widerruf: false, paid: false, err: {} };
  S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj); lokalSpeichern(); entwurfWeg();
}
/* Das Aufmaß dieses Geräts wegnehmen: Speicher und Bilder der Lage weg, dann leer (alle: auch die Bilder anderer Aufmaße, etwa
   beim Wechsel des Kontos) */
function hierLeeren(alle) {
  const k = S.kauf && S.kauf.kennung;
  clearTimeout(S.sync.timer);
  try { localStorage.removeItem(STORE); localStorage.removeItem(ENTWURF_EIGEN); } catch (e) { /* ok */ }
  if (alle) bilderWeg(); else if (k) bilderWeg(k);
  loadOwn(); S.teil = null;
}
/* Danach: das neueste Aufmaß aus dem Konto öffnen, sonst ein leeres beginnen, und auf die Startseite (nicht mitten in einem Schritt
   oder der Kasse mit einem anderen Aufmaß stehen bleiben). Läuft gerade das Öffnen eines gewählten Aufmaßes, gilt das */
let OEFFNET = 0;
async function naechstesAufmass() {
  S.sichern = null; S.linkAnmeldung = null;
  if (OEFFNET) return;
  const l = KS ? await kontoListe() : null;
  if (l && l.length && (await projektOeffnen(l[0].kennung, true))) return go('home');
  if (KS) leeresAufmass();
  go('home');
}
/* Auf einem anderen Gerät gelöscht (oder mit dem Konto): auch hier weg */
function aufmassEntfernt() { fotosHierWeg(true); hierLeeren(); toast('Dieses Aufmaß wurde gelöscht, auch auf diesem Gerät.'); return naechstesAufmass(); }
/* Gehört zu einem anderen Konto (geteiltes Gerät): nicht in dieses Konto kopieren, sondern von diesem Gerät nehmen; im anderen Konto bleibt es */
function aufmassFremd() { fotosHierWeg(false); hierLeeren(); toast('Dieses Aufmaß gehört zu einem anderen Konto und wurde von diesem Gerät entfernt.'); return naechstesAufmass(); }
/* Ein Aufmaß aus dem Konto auf dieses Gerät holen (anderes Gerät, oder in „Dein Konto“ gewählt) */
async function projektOeffnen(k, still) {
  OEFFNET++;
  try { return await projektOeffnenJetzt(k, still); } finally { OEFFNET--; }
}
async function projektOeffnenJetzt(k, still) {
  if (!KS) return false;
  if (S.kauf && S.kauf.kennung === k && S.windows.length) { if (!still) go('home'); return true; }
  if (kontoAn() && (S.sync.offen || S.sync.p || S.sync.voll)) { const a = await entwurfAbgleichen(); if (a === 'fehler') { toast(S.sync.voll ? VOLL_TEXT : 'Dein aktuelles Aufmaß ist noch nicht gesichert. Bitte gleich noch einmal.'); return false; } }
  const r = await kontoJson('/api/kunde/aufmass/' + encodeURIComponent(k));
  if (r._status === 410) { bilderWeg(k); toast('Dieses Aufmaß wurde gelöscht.'); kontoListe(); return false; }
  if (!r.ok || !r.entwurf) { toast(r.fehler || 'Dieses Aufmaß ließ sich gerade nicht öffnen.'); return false; }
  const platz = bilderAblegen();
  clearTimeout(S.sync.timer); S.sync = syncNeu();
  S.windows = []; takeWindows(r.entwurf.windows || []);
  S.proj = normProj(Object.assign({}, PROJ0, r.entwurf.proj || {})); S.projTs = Number(r.entwurf.projTs) || 0; S.stand = Number(r.entwurf.stand) || 0;
  S.kauf = { kennung: k, mail: KS.mail, agb: true, konto: KS.mail, pay: '', widerruf: false, paid: false, err: {} }; S.teil = null; S.angelegt = 0; S.editIdx = -1; S.win = baseWin();
  bezahltUebernehmen(r.bezahlt); metaUebernehmen(r.meta);
  S.sync.geladen = true; S.sync.ok = true; S.sync.zuletzt = Date.now(); S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj); S.sync.bekannt = S.windows.map((w) => w.wid);
  lokalSpeichern(); bilderZurueck(k);
  const hinweis = platz ? 'Aufmaß geöffnet' : 'Aufmaß geöffnet. Für die Bilder der Lage im vorigen war auf diesem Gerät kein Platz.';
  if (!still) { go('home'); toast(hinweis); } else { render(); if (!platz) toast(hinweis); }
  return true;
}
/* Nach dem Anmelden: Aufmaß dieses Geräts ins Konto bringen, sonst das zuletzt bearbeitete aus dem Konto holen. Ein Aufmaß, das
   schon zu einem anderen Konto gehört (geteiltes Gerät), kommt nicht mit hinein. Gemeldet wird erst, was wirklich angekommen ist */
/* fremdOffen: hier liegt ein Aufmaß aus einem anderen Konto mit Änderungen, die dort noch nicht angekommen sind */
const fremdOffen = (mail) => (S.kauf && S.kauf.konto && S.kauf.konto !== mail && S.sync.offen ? S.kauf.konto : '');
async function nachAnmeldung(r, zweck, bestaetigt) {
  if (!bestaetigt && !r.aus && fremdOffen(r.mail)) { S.sichern = null; S.linkAnmeldung = Object.assign({}, r, { zweck: zweck }); return go('linkanmelden'); } // erst fragen: sonst gingen diese Änderungen verloren
  try { localStorage.removeItem(ANFRAGE); } catch (e) { /* ok */ }
  kontoMerken({ token: r.token, refresh: r.refresh, mail: r.mail }); S.konto.abgelaufen = ''; S.konto.liste = r.aufmasse || []; listeZuletzt = Date.now();
  if (r.aus) { SERVER.konten = false; toast('Konten sind gerade nicht verfügbar.'); return go('home'); }
  SERVER.konten = true;
  if (S.kauf && S.kauf.konto && S.kauf.konto !== r.mail) { fotosHierWeg(false); hierLeeren(true); } // gehört zu einem anderen Konto (dort ist es gesichert): nicht hineinkopieren
  const hier = S.windows.length > 0, imKonto = S.kauf && S.kauf.kennung && S.konto.liste.some((a) => a.kennung === S.kauf.kennung);
  let a = true;
  if (!hier && !imKonto && S.konto.liste.length) { await projektOeffnen(S.konto.liste[0].kennung, true); }
  else {
    const k = kauf(); kennung(); k.mail = KS.mail; k.agb = true;
    clearTimeout(S.sync.timer); const alt = S.sync; S.sync = syncNeu(); S.sync.bekannt = alt.bekannt || []; S.sync.geloescht = alt.geloescht || {};
    S.sync.offen = hier; if (hier && !S.stand) S.stand = zeit(); S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj); lokalSpeichern();
    const s0 = S.sync;
    await entwurfLaden(); // nicht im Konto: geht hoch; schon im Konto: wird zusammengeführt
    if (S.sync !== s0) { S.sichern = null; return; } // inzwischen gelöscht oder einem anderen Konto zugehörig: schon gemeldet
    if (hier && zweck !== 'kauf') a = await entwurfAbgleichen();
  }
  S.sichern = null;
  fotosHochladen(); // als Gast aufgenommene Fotos gehen jetzt ins Konto
  if (zweck === 'kauf') return kaufMitKonto();
  go('home');
  toast(S.sync.voll ? VOLL_TEXT : a === 'fehler' ? 'Angemeldet. Dein Aufmaß wird gesichert, sobald die Verbindung steht.' : zweck === 'anmelden' ? 'Angemeldet' : 'Gesichert, in deinem Konto.');
}
/* Anmeldelink aus der E-Mail: Supabase kommt mit #access_token=…&refresh_token=… zurück. Die Adresse wird gleich beim Start
   bereinigt (die Schlüssel sollen nicht im Verlauf bleiben), verarbeitet wird der Link, sobald klar ist, ob es Konten gibt */
function tokenAusAdresse() {
  const h = location.hash || '';
  if (!/access_token=|error_description=/.test(h)) return null;
  const q = new URLSearchParams(h.replace(/^#/, ''));
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ }
  return q.get('access_token') ? { token: q.get('access_token'), refresh: q.get('refresh_token') || '' } : { fehler: q.get('error_description') || 'Anmeldung fehlgeschlagen' };
}
let LINK_TOKEN = null;
/* Angemeldet wird ohne Rückfrage nur, wenn dieser Browser den Code für genau diese Adresse angefordert hat (in der letzten Stunde).
   Sonst könnte ein untergeschobener Link jemanden in ein fremdes Konto anmelden und sein Aufmaß dorthin bringen: Dann zeigt die App
   die Adresse des Kontos und fragt erst, ebenso vor einem Wechsel des Kontos */
async function kontoAusLink(t) {
  if (t.fehler) { toast('Der Anmeldelink ist abgelaufen oder schon benutzt. Bitte fordere einen neuen Code an.'); return render(); }
  try {
    const res = await fetch('/api/kunde/sitzung', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(t) });
    const r = await res.json().catch(() => null);
    if (!(r && r.ok)) { toast((r && r.fehler) || 'Die Anmeldung hat nicht geklappt. Bitte fordere einen neuen Code an.'); return render(); }
    let a = null; try { a = JSON.parse(localStorage.getItem(ANFRAGE) || 'null'); } catch (e) { a = null; }
    const erwartet = !!(a && a.mail === r.mail && Date.now() - (Number(a.at) || 0) < 3600000);
    if (KS && KS.mail === r.mail) return nachAnmeldung(r, 'anmelden'); // dasselbe Konto, nur frisch angemeldet
    if (!KS && erwartet) return nachAnmeldung(r, a.zweck || 'anmelden');
    S.linkAnmeldung = r; go('linkanmelden');
  } catch (e) { toast('Keine Verbindung. Bitte gleich noch einmal.'); render(); }
}
/* Nach der Rückfrage: ein anderes Konto zuerst sauber verlassen (Offenes sichern, Aufmaß von diesem Gerät nehmen) */
async function kontoWechseln(r) {
  if (KS && KS.mail !== r.mail && !(await abmeldenHier())) return go('home');
  return nachAnmeldung(r, r.zweck || 'anmelden', true);
}
/* Beim Start mit Anmeldung: Liste holen, das Aufmaß dieses Geräts abgleichen oder, wenn hier keines liegt, das letzte öffnen */
async function kontoStart() {
  const liste = await kontoListe();
  if (!KS) return render();
  if (S.kauf && S.kauf.konto && S.kauf.konto !== KS.mail) { fotosHierWeg(false); hierLeeren(true); } // gehört zu einem anderen Konto
  if (liste && !S.windows.length && !(S.kauf && S.kauf.kennung && liste.some((a) => a.kennung === S.kauf.kennung)) && liste.length) return projektOeffnen(liste[0].kennung, true);
  const k = kauf(); kennung(); k.mail = KS.mail; k.agb = true; lokalSpeichern();
  entwurfLaden();
  fotosHochladen();
}
/* Sichern-Ablauf: zweck 'sichern' (Gast sichert), 'anmelden' (anderes Gerät), 'kauf' (vor dem Freischalten) */
function sichernStart(zweck) { S.sichern = { zweck: zweck, schritt: 1, mail: S.konto.abgelaufen || (S.kauf && S.kauf.mail) || '', agb: zweck === 'anmelden', code: '', err: {}, laeuft: false }; go('sichern'); }
async function sichernCode() {
  const z = S.sichern; if (!z || z.laeuft) return;
  z.err = {}; z.mail = String(z.mail || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(z.mail)) z.err.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
  if (!z.agb) z.err.agb = 'Bitte zustimmen, sonst können wir dein Aufmaß nicht speichern.';
  if (Object.keys(z.err).length) return render();
  z.laeuft = true; render();
  try {
    const res = await fetch('/api/kunde/code', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ mail: z.mail, neu: z.zweck !== 'anmelden' }) });
    const r = await res.json().catch(() => null);
    z.laeuft = false;
    if (r && r.ok) { try { localStorage.setItem(ANFRAGE, JSON.stringify({ mail: z.mail, zweck: z.zweck, at: Date.now() })); } catch (e) { /* ok */ } z.schritt = 2; z.code = ''; z.err = {}; go('sichern'); return; } // der Link aus dieser E-Mail meldet ohne Rückfrage an
    z.err.mail = (r && r.fehler) || 'Der Code ließ sich gerade nicht verschicken.'; render();
  } catch (e) { z.laeuft = false; z.err.mail = 'Keine Verbindung. Bitte gleich noch einmal.'; render(); }
}
async function sichernPruefen() {
  const z = S.sichern; if (!z || z.laeuft) return;
  z.code = String(z.code || '').replace(/\D/g, ''); z.err = {};
  if (z.code.length < 6) { z.err.code = 'Bitte den Code aus der E-Mail eingeben.'; return render(); }
  z.laeuft = true; render();
  try {
    const res = await fetch('/api/kunde/anmelden', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ mail: z.mail, code: z.code }) });
    const r = await res.json().catch(() => null);
    z.laeuft = false;
    if (r && r.ok) return nachAnmeldung(r, z.zweck);
    z.err.code = (r && r.fehler) || 'Der Code stimmt nicht oder ist abgelaufen.'; render();
  } catch (e) { z.laeuft = false; z.err.code = 'Keine Verbindung. Bitte gleich noch einmal.'; render(); }
}
/* Freischalten mit Konto: erst abgleichen (der Kauf hängt am gesicherten Aufmaß), dann zur Kasse */
async function kaufMitKonto() {
  const k = kauf(); kennung(); k.mail = KS ? KS.mail : k.mail; k.agb = true; lokalSpeichern();
  if (S.sync.voll) { go('teilen'); return toast(VOLL_TEXT); }
  if (!S.sync.geladen || S.sync.offen || S.sync.p) { const a = await entwurfAbgleichen(); if (a === 'fehler') { go('teilen'); return toast(S.sync.voll ? VOLL_TEXT : 'Dein Aufmaß ist noch nicht gesichert. Bitte gleich noch einmal.'); } }
  if (FREI()) return go('gekauft');
  kasseOeffnen();
}
/* Abmelden auf diesem Gerät: Offenes noch sichern, dann Anmeldung, Aufmaß und Bilder der Lage von diesem Gerät nehmen. false: nicht
   gesichert, dann bleibt alles, wie es ist */
async function abmeldenHier() {
  if (S.sync.voll) { toast('Dein Konto ist voll, dieses Aufmaß ist noch nicht gesichert. Lösche zuerst in „Dein Konto“ ein altes, sonst geht es beim Abmelden verloren.'); return false; }
  if (kontoAn() && (S.sync.offen || S.sync.p)) { const a = await entwurfAbgleichen(); if (a === 'fehler') { toast('Dein Aufmaß ist noch nicht gesichert. Bitte gleich noch einmal, sonst gehen die letzten Änderungen verloren.'); return false; } }
  if (await fotosOffen()) await fotosAbwarten(15000); // Fotos noch ins Konto; was nicht ankommt, bleibt auf dem Gerät
  fotosHierWeg(false);
  kontoMerken(null); S.konto = { liste: null, abgelaufen: '' }; S.kontoFrage = '';
  try { localStorage.removeItem(STORE); } catch (e) { /* ok */ }
  bilderWeg(); loadOwn(); S.teil = null;
  return true;
}
async function kontoAbmelden() { if (await abmeldenHier()) { go('home'); toast('Abgemeldet. Dein Aufmaß bleibt im Konto.'); } }
/* Während des Löschens nichts mehr senden; ein laufender Versand darf erst fertig werden */
async function sendenAnhalten() { clearTimeout(S.sync.timer); S.sync.aus = true; if (S.sync.p) await S.sync.p.catch(() => false); }
async function kontoLoeschen() {
  await sendenAnhalten();
  const r = await kontoJson('/api/kunde/loeschen', { method: 'POST', body: '{}' });
  if (!r.ok) { S.sync.aus = false; entwurfPlanen(); return toast(r.fehler || 'Das hat gerade nicht geklappt. Bitte gleich noch einmal.'); }
  fotosHierWeg(true);
  kontoMerken(null); S.konto = { liste: null, abgelaufen: '' }; S.kontoFrage = '';
  try { localStorage.removeItem(STORE); } catch (e) { /* ok */ }
  bilderWeg(); loadOwn(); S.teil = null; go('home'); toast('Konto und Aufmaße gelöscht.');
}
/* Ein Aufmaß aus dem Konto löschen; das geöffnete auch von diesem Gerät. Ist das Konto voll, geht danach das Aufmaß hier hinein */
async function aufmassLoeschen(k) {
  if (!k || !KS) return;
  const offen = !!(S.kauf && S.kauf.kennung === k);
  if (offen) await sendenAnhalten();
  const r = await kontoJson('/api/kunde/aufmass/' + encodeURIComponent(k) + '/loeschen', { method: 'POST', body: '{}' });
  if (!r.ok) { if (offen) { S.sync.aus = false; entwurfPlanen(); } return toast(r.fehler || 'Das hat gerade nicht geklappt. Bitte gleich noch einmal.'); }
  S.konto.liste = r.aufmasse || []; S.kontoFrage = ''; bilderWeg(k);
  if (offen) {
    fotosHierWeg(true); hierLeeren();
    if (!(S.konto.liste.length && (await projektOeffnen(S.konto.liste[0].kennung, true)))) leeresAufmass();
    go('meinkonto'); return toast('Aufmaß gelöscht');
  }
  if (S.sync.voll) { S.sync.voll = false; S.sync.offen = true; entwurfPlanen(true); }
  render(); toast('Aufmaß gelöscht');
}
/* Neues Aufmaß mit Konto: das bisherige bleibt im Konto */
async function kontoNeuesAufmass() {
  if ((S.konto.liste || []).length >= MAX_AUFMASSE) return toast('In deinem Konto haben ' + MAX_AUFMASSE + ' Aufmaße Platz. Lösche zuerst ein altes.');
  if (S.sync.voll) return toast(VOLL_TEXT);
  if (kontoAn() && (S.sync.offen || S.sync.p)) { const a = await entwurfAbgleichen(); if (a === 'fehler') return toast('Dein Aufmaß ist noch nicht gesichert. Bitte gleich noch einmal.'); }
  const platz = bilderAblegen();
  leeresAufmass();
  go('home'); toast(platz ? 'Neues Aufmaß begonnen.' : 'Neues Aufmaß begonnen. Für die Bilder der Lage im vorigen war auf diesem Gerät kein Platz.');
}
/* Laufende KI-Auswertungen. Eine echte Auswertung dauert 15 bis 30 Sekunden; wer vorher speichert oder schon das nächste Fenster
   anlegt, darf die Antwort nicht verlieren. Jeder Auftrag gehört zur Bearbeitungskopie (z.win), für die fotografiert wurde. saveWin
   merkt sich an ihr die Kennung des gespeicherten Fensters (KI_ZIEL), und die Antwort wird dort nachgetragen. Abgebrochen wird nur,
   wenn für dasselbe Fenster und dieselbe Seite ein neues Foto kommt. Senden und das Aufmaßblatt warten kurz auf laufende Aufträge. */
const KI_LAEUFT = new Set();
const KI_ZIEL = new WeakMap();
function kiZielMerken(bearbeitet, wid) {
  if (!wid || !bearbeitet) return; // immer merken: ein Auftrag kann auch erst nach dem Speichern starten (Foto wird noch verkleinert)
  let s = KI_ZIEL.get(bearbeitet); if (!s) { s = new Set(); KI_ZIEL.set(bearbeitet, s); }
  s.add(wid);
}
/* Läuft für dieses Fenster (Bearbeitungskopie oder gespeichert) noch eine Auswertung? Ohne w: für ein gespeichertes Fenster dieses Aufmaßes */
function kiLaeuftFuer(w) {
  const wids = new Set(S.windows.map((x) => x.wid));
  return Array.from(KI_LAEUFT).some((j) => { const ziele = KI_ZIEL.get(j.win) || new Set(); return w ? j.win === w || (!!w.wid && ziele.has(w.wid)) : Array.from(ziele).some((id) => wids.has(id)); });
}
/* Antwort nach dem Speichern: ins gespeicherte Fenster (und in die offene Kopie desselben Fensters) übernehmen, mit neuem Zeitpunkt,
   damit der Server die Fassung mit Auswertung nimmt. Das zählt nicht als Änderung (aenderungFp) */
function kiNachtragen(z) {
  const ziele = KI_ZIEL.get(z.win); if (!ziele || !ziele.size || !z.win.ki) return false;
  const uebernehmen = (w) => { w.ki = kopie(z.win.ki); w.fotos = z.win.fotos; if (!w.neu && w.ki.laib && !w.e_laib && !num(w.laib)) w.laib = w.ki.laib; fachVerwerten(w); };
  let gespeichert = false;
  ziele.forEach((wid) => {
    const g = S.windows.find((w) => w.wid === wid);
    if (g) { uebernehmen(g); g.ts = zeit(); gespeichert = true; }
    if (S.win && S.win !== z.win && S.win.wid === wid) uebernehmen(S.win);
  });
  if (gespeichert) persist();
  return gespeichert;
}
let kiWarteListe = [];
function kiFertigMelden() { if (kiLaeuftFuer()) return; const l = kiWarteListe; kiWarteListe = []; l.forEach((f) => f()); }
/* Vor dem Senden und vor dem Aufmaßblatt: höchstens ms auf laufende Auswertungen warten; true, wenn nichts mehr läuft */
function kiAbwarten(ms) {
  if (!kiLaeuftFuer()) return Promise.resolve(true);
  return new Promise((fertig) => { const t = setTimeout(() => { kiWarteListe = kiWarteListe.filter((f) => f !== los); fertig(!kiLaeuftFuer()); }, ms || 45000); const los = () => { clearTimeout(t); fertig(true); }; kiWarteListe.push(los); });
}
/* Vor dem Senden an den Betrieb und vor dem Aufmaßblatt: Läuft noch eine Auswertung, kurz darauf warten, damit sie mitkommt.
   false nur, wenn schon gewartet wird (zweites Antippen); nach höchstens 45 Sekunden geht es auch ohne Auswertung weiter */
async function kiVorher(was) {
  const arbeit = fotoInArbeit(), ki = kiLaeuftFuer(), fotos = was === 'senden' ? await fotosOffen() : 0;
  if (!arbeit && !ki && !fotos) return true;
  if (S.kiWartet) return false;
  S.kiWartet = was;
  /* ein gerade aufgenommenes Foto wird noch verkleinert: danach beginnt seine Auswertung, und es kann hochgehen */
  if (arbeit) { S.warteText = 'Fotos werden vorbereitet …'; render(); await fotoArbeitAbwarten(15000); }
  if (kiLaeuftFuer()) {
    S.warteText = 'Fotos werden ausgewertet …'; render();
    toast(was === 'senden' ? 'Die Fotos werden gerade noch ausgewertet. Einen Moment, dann geht dein Aufmaß mit der Auswertung raus.' : 'Die Fotos werden gerade noch ausgewertet. Einen Moment, dann kommt die Auswertung mit ins Aufmaßblatt.');
    await kiAbwarten(45000);
  }
  /* beim Senden: erst, wenn die Fotos beim Server sind, sieht sie der Betrieb (fotos.js) */
  if (was === 'senden' && (await fotosOffen())) {
    S.warteText = 'Fotos werden übertragen …'; render();
    toast('Deine Fotos werden noch übertragen. Einen Moment, dann geht dein Aufmaß mit den Fotos raus.');
    if (!(await fotosAbwarten(60000))) toast('Nicht alle Fotos sind angekommen. Dein Aufmaß geht trotzdem raus, die fehlenden Fotos zeigt der Betrieb als nicht übertragen.');
  }
  S.kiWartet = ''; S.warteText = ''; render();
  return true;
}
/* ---------- Fotos: auf dem Gerät ablegen und zum Server bringen (functions/api/fotos.js) ----------
   Jedes Foto bekommt eine Kennung (b…), das Fenster nennt sie (w.bilder = { in, out }); die Bilder selbst stehen nie im Aufmaß oder im
   Code. Auf dem Gerät liegen die verkleinerten Fotos (wie für die KI, etwa 1,15 Megapixel) in IndexedDB („aufmass-fotos“), damit sie
   Speichern, Neuladen und das Aufmaßblatt überstehen. Zum Server gehen sie mit dem gespeicherten Fenster, sobald klar ist, wohin:
   beim Kundenlink zum Link (der Betrieb sieht sie mit dem eingegangenen Aufmaß), beim eigenen Aufmaß mit Konto ins Konto. Als Gast
   bleiben sie auf dem Gerät, bis das Aufmaß gesichert ist. Senden an den Betrieb wartet, bis alle angekommen sind (höchstens
   60 Sekunden). */
const Fotos = (function () {
  const NAME = 'aufmass-fotos', ABLAGE = 'fotos';
  let dbP = null;
  function db() {
    if (!dbP) dbP = new Promise((fertig) => {
      try {
        const r = indexedDB.open(NAME, 1);
        r.onupgradeneeded = () => { try { r.result.createObjectStore(ABLAGE); } catch (e) { /* schon da */ } };
        r.onsuccess = () => fertig(r.result); r.onerror = () => fertig(null); r.onblocked = () => fertig(null);
      } catch (e) { fertig(null); }
    });
    return dbP;
  }
  /* eine Transaktion; Ergebnis der Anfrage, die fn zurückgibt (sonst true), null ohne Speicher oder bei einem Fehler */
  async function tun(art, fn) {
    const d = await db(); if (!d) return null;
    return new Promise((fertig) => {
      try { const t = d.transaction(ABLAGE, art), r = fn(t.objectStore(ABLAGE)); t.oncomplete = () => fertig(r && 'result' in r ? r.result : true); t.onerror = () => fertig(null); t.onabort = () => fertig(null); }
      catch (e) { fertig(null); }
    });
  }
  return {
    neueId: () => 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
    ablegen: (id, blob, w, h) => tun('readwrite', (s) => s.put({ blob: blob, w: w, h: h, at: Date.now(), hoch: {} }, id)),
    holen: (id) => tun('readonly', (s) => s.get(id)),
    /* hochgeladen nach ziel (link:<code> bzw. konto:<kennung>) */
    vermerken: (id, ziel) => tun('readwrite', (s) => { const g = s.get(id); g.onsuccess = () => { const v = g.result; if (v) { v.hoch = Object.assign({}, v.hoch || {}); v.hoch[ziel] = Date.now(); s.put(v, id); } }; return null; }),
    weg: (ids) => tun('readwrite', (s) => { ids.forEach((id) => s.delete(id)); return null; }),
    alle: () => tun('readonly', (s) => s.getAllKeys())
  };
})();
const FOTO_ID = /^b[a-z0-9]{12,24}$/;
/* Fotos, die gerade verkleinert und abgelegt werden (onPhoto). Gehören sie zu einem gespeicherten Fenster, warten Senden und
   Aufmaßblatt darauf (kiVorher), und fotosOffen zählt sie mit */
const FOTO_ARBEIT = new Set();
const fotoInArbeit = () => FOTO_ARBEIT.size > 0 && Array.from(fotoIdsHier(true)).some((id) => FOTO_ARBEIT.has(id));
async function fotoArbeitAbwarten(ms) { const bis = Date.now() + (ms || 15000); while (fotoInArbeit() && Date.now() < bis) await new Promise((fertig) => setTimeout(fertig, 150)); }
const bilderVon = (w) => (w && w.bilder ? ['in', 'out'].map((k) => w.bilder[k]).filter((id) => FOTO_ID.test(String(id || ''))) : []);
const blobText = (blob) => new Promise((fertig) => { const fr = new FileReader(); fr.onload = () => fertig(String(fr.result || '')); fr.onerror = () => fertig(''); fr.readAsDataURL(blob); });
/* Wohin die Fotos dieses Aufmaßes gehen; null: nirgendwohin (Gast, Pilotphase, Vorschau des Betriebs, schon gesendet). Hoch gehen nur
   die Fotos gespeicherter Fenster: Ein verworfenes Fenster hinterlässt beim Server nichts, und mit dem gespeicherten Fenster gibt es
   dort einen Zwischenstand, mit dem das Aufräumen die Fotos eines nie gesendeten Links findet (zentrale.js) */
function fotoZiel() {
  if (S.tour || vorschau() || !SERVER.daten) return null;
  if (S.betrieb) {
    if (S.sent || (S.linkZu && S.linkZu !== 'eingegangen') || !S.betrieb.code) return null;
    const code = S.betrieb.code;
    return { schluessel: 'link:' + code, pfad: (id) => '/api/link/' + encodeURIComponent(code) + '/foto/' + id, abruf: (p, init) => fetch(p, init), nurGespeichert: true };
  }
  if (kontoAn()) { const k = S.kauf.kennung; return { schluessel: 'konto:' + k, pfad: (id) => '/api/kunde/aufmass/' + encodeURIComponent(k) + '/foto/' + id, abruf: kontoAbruf, lesbar: true, nurGespeichert: true }; }
  return null;
}
/* Kennungen der Fotos dieses Aufmaßes: gespeicherte Fenster, dazu (ohne nurGespeichert) das gerade bearbeitete */
function fotoIdsHier(nurGespeichert) { const s = new Set(); S.windows.forEach((w) => bilderVon(w).forEach((id) => s.add(id))); if (!nurGespeichert) bilderVon(S.win).forEach((id) => s.add(id)); return s; }
const FotoSync = { laeuft: false, nochmal: false, fehler: 0, timer: 0, fertig: [] };
/* Instanz: zu jedem Foto eine kleine Fassung <id>k (640 px, JPEG 0,7) fürs Aufmaßblatt im Worker (functions/api/blatt-server.js) */
async function kleineFassung(blob) {
  let u = ''; try { u = URL.createObjectURL(blob); } catch (e) { return ''; }
  try {
    const im = await new Promise((fertig, fehler) => { const i = new Image(); i.onload = () => fertig(i); i.onerror = fehler; i.src = u; });
    const f = Math.min(1, 640 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * f)), h = Math.max(1, Math.round(im.naturalHeight * f));
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
    const data = c.toDataURL('image/jpeg', 0.7);
    return /^data:image\/jpeg;base64,/.test(data) ? data.slice(data.indexOf(',') + 1) : '';
  } catch (e) { return ''; } finally { URL.revokeObjectURL(u); }
}
const fotoFassungen = (z) => (INST ? [['', z.schluessel], ['k', z.schluessel + ':k']] : [['', z.schluessel]]);
async function fotosHochladen() {
  if (FotoSync.laeuft) { FotoSync.nochmal = true; return; }
  const z = fotoZiel(); if (!z) return;
  FotoSync.laeuft = true; clearTimeout(FotoSync.timer);
  try {
    /* Instanz: Fotos nimmt der Server nur zu Fenstern, die im Zwischenstand stehen; also erst den Zwischenstand hinbringen */
    if (INST && entwurfAn()) { if (S.sync.p) await S.sync.p.catch(() => false); if (S.sync.offen && S.sync.geladen) await entwurfSenden(); }
    let spaeter = false;
    for (const id of fotoIdsHier(!!z.nurGespeichert)) {
      if (fotoZiel() === null || fotoZiel().schluessel !== z.schluessel) break; // inzwischen gesendet oder ein anderes Aufmaß
      const v = await Fotos.holen(id);
      if (!v || !v.blob) continue;
      for (const [zusatz, marke] of fotoFassungen(z)) {
        if (v.hoch && v.hoch[marke]) continue;
        const text = zusatz ? '' : await blobText(v.blob), bild = zusatz ? await kleineFassung(v.blob) : text.slice(text.indexOf(',') + 1);
        if (!bild) continue;
        const r = await z.abruf(z.pfad(id + zusatz), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ bild: bild }) });
        if (r.ok) { await Fotos.vermerken(id, marke); FotoSync.fehler = 0; continue; }
        if (INST && (r.status === 409 || r.status === 400) && S.sync && (S.sync.offen || S.sync.laeuft)) { spaeter = true; continue; } // Zwischenstand noch unterwegs
        if ([400, 403, 409, 410, 413].includes(r.status)) continue; // geht so nicht (Link zu, zu groß, voll): nicht endlos versuchen
        throw new Error('Foto nicht angekommen (' + r.status + ')');
      }
    }
    if (spaeter && (FotoSync.spaet = (FotoSync.spaet || 0) + 1) <= 20) FotoSync.timer = setTimeout(fotosHochladen, 1500); else if (!spaeter) FotoSync.spaet = 0; // höchstens 20-mal auf den Zwischenstand warten
  } catch (e) {
    FotoSync.fehler++;
    FotoSync.timer = setTimeout(fotosHochladen, Math.min(60000, 1500 * Math.pow(2, FotoSync.fehler))); // nach einer Störung später noch einmal
  } finally {
    FotoSync.laeuft = false;
    if (FotoSync.nochmal) { FotoSync.nochmal = false; fotosHochladen(); } else { const f = FotoSync.fertig; FotoSync.fertig = []; f.forEach((x) => x()); }
  }
}
/* Wie viele Fotos gespeicherter Fenster noch nicht beim Server sind */
async function fotosOffen() {
  const z = fotoZiel(); if (!z) return 0;
  let n = 0;
  for (const id of fotoIdsHier(true)) { if (FOTO_ARBEIT.has(id)) { n++; continue; } const v = await Fotos.holen(id); if (v && v.blob && fotoFassungen(z).some((f) => !(v.hoch && v.hoch[f[1]]))) n++; }
  return n;
}
async function fotosAbwarten(ms) {
  const bis = Date.now() + (ms || 60000);
  while (Date.now() < bis) {
    if (!(await fotosOffen())) return true;
    await new Promise((fertig) => { FotoSync.fertig.push(fertig); fotosHochladen(); setTimeout(fertig, 1500); });
  }
  return !(await fotosOffen());
}
/* Fürs PDF verkleinert: längste Kante höchstens 960 px, JPEG 0,8. Das Blatt zeigt die Fotos etwa 56 mm hoch; so bleibt die Datei
   auch mit vielen Fenstern klein genug für E-Mail und Messenger (das volle Foto gibt es im Betriebsbereich) */
async function pdfFoto(blob) {
  let u = ''; try { u = URL.createObjectURL(blob); } catch (e) { return null; }
  try {
    const im = await new Promise((fertig, fehler) => { const i = new Image(); i.onload = () => fertig(i); i.onerror = fehler; i.src = u; });
    const f = Math.min(1, 960 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * f)), h = Math.max(1, Math.round(im.naturalHeight * f));
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
    const data = c.toDataURL('image/jpeg', 0.8);
    return /^data:image\/jpeg/.test(data) ? { data: data, w: w, h: h } : null;
  } catch (e) { return null; } finally { URL.revokeObjectURL(u); }
}
/* Fürs Aufmaßblatt: Kennung → { data (JPEG als Data-URL), w, h }, vom Gerät, sonst aus dem Konto */
async function fotosFuerBlatt(wins) {
  const out = {}, z = fotoZiel();
  for (const w of wins || []) for (const id of bilderVon(w)) {
    if (out[id]) continue;
    let v = await Fotos.holen(id);
    if (!(v && v.blob) && z && z.lesbar) { try { const r = await z.abruf(z.pfad(id)); if (r.ok) { const blob = await r.blob(); const d = await new Promise((fertig) => { const u = URL.createObjectURL(blob), im = new Image(); im.onload = () => { fertig({ w: im.naturalWidth, h: im.naturalHeight }); URL.revokeObjectURL(u); }; im.onerror = () => { fertig(null); URL.revokeObjectURL(u); }; im.src = u; }); if (d) { v = { blob: blob, w: d.w, h: d.h }; Fotos.ablegen(id, blob, d.w, d.h).then(() => Fotos.vermerken(id, z.schluessel)); } } } catch (e) { /* ohne dieses Foto */ } }
    if (v && v.blob) { const p = await pdfFoto(v.blob); if (p) out[id] = p; }
  }
  return out;
}
/* Beim Öffnen eines gespeicherten Fensters: seine Fotos wieder in die Kacheln (vom Gerät, sonst aus dem Konto) */
async function fotosInKacheln(w, photos) {
  const z = fotoZiel();
  for (const seite of ['in', 'out']) {
    const id = w && w.bilder && w.bilder[seite]; if (!FOTO_ID.test(String(id || '')) || photos[seite]) continue;
    let v = await Fotos.holen(id);
    if (!(v && v.blob) && z && z.lesbar) { try { const r = await z.abruf(z.pfad(id)); if (r.ok) { const blob = await r.blob(); v = { blob: blob, w: 0, h: 0 }; } } catch (e) { /* ohne */ } }
    if (!(v && v.blob) || S.photos !== photos) continue;
    const url = URL.createObjectURL(v.blob), d = v.w && v.h ? { w: v.w, h: v.h } : await imageDims(url);
    photos[seite] = { url: url, file: null, w: d.w, h: d.h, demo: false, id: id };
  }
  if (S.photos === photos) render();
}
/* Aufräumen auf dem Gerät: Fotos, die kein Fenster in diesem Browser mehr nennt (eigenes Aufmaß, Kundenlinks): nach zwei Tagen, wenn
   sie beim Server liegen, sonst nach 30 Tagen (etwa ein Aufmaß, das ohne Netz gewechselt wurde) */
async function fotosLokalAufraeumen() {
  const ids = await Fotos.alle(); if (!ids || !ids.length) return;
  const genannt = new Set();
  try {
    Object.keys(localStorage).filter((k) => k === STORE || k === ENTWURF_EIGEN || k.indexOf('aufmass.k.') === 0).forEach((k) => { const o = JSON.parse(localStorage.getItem(k) || 'null'); ((o && o.windows) || []).concat(o && o.win ? [o.win] : []).forEach((w) => bilderVon(w).forEach((id) => genannt.add(id))); }); // auch der Entwurf (Fenster in Arbeit)
  } catch (e) { return; } // ohne lesbaren Speicher nichts löschen
  S.windows.forEach((w) => bilderVon(w).forEach((id) => genannt.add(id))); bilderVon(S.win).forEach((id) => genannt.add(id));
  const weg = [];
  for (const id of ids) { if (genannt.has(id)) continue; const v = await Fotos.holen(id), oben = !!(v && v.hoch && Object.keys(v.hoch).length); if (v && Date.now() - (Number(v.at) || 0) > (oben ? 2 : 30) * 864e5) weg.push(id); }
  if (weg.length) Fotos.weg(weg);
}
/* Fotos des geöffneten Aufmaßes von diesem Gerät nehmen: alle (Aufmaß gelöscht) oder nur, was im Konto liegt (abmelden, anderes
   Konto); der Rest bleibt fürs Aufräumen. Kennungen werden sofort gelesen, Aufrufer leeren danach das Aufmaß */
async function fotosHierWeg(alle) {
  const ids = Array.from(fotoIdsHier()), k = S.kauf && S.kauf.kennung, weg = [];
  for (const id of ids) { const v = alle ? null : await Fotos.holen(id); if (alle || (v && v.hoch && k && v.hoch['konto:' + k])) weg.push(id); }
  if (weg.length) await Fotos.weg(weg);
}
function imageDims(url) { return new Promise((res) => { const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => res({ w: 1200, h: 1600 }); im.src = url; }); }
async function onPhoto(which, file) {
  if (!file) return;
  /* alles für dieses Fenster festhalten: legt der Kunde währenddessen ein neues an, gehören Foto und Auswertung trotzdem hierher */
  const z0 = { ai: S.ai, win: S.win, photos: S.photos };
  if (z0.photos[which] && z0.photos[which].url && !z0.photos[which].demo) { try { URL.revokeObjectURL(z0.photos[which].url); } catch (e) { /* ok */ } }
  let url = ''; try { url = URL.createObjectURL(file); } catch (e) { url = ''; }
  if (!url) { url = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(''); fr.readAsDataURL(file); }); }
  const id = Fotos.neueId(); FOTO_ARBEIT.add(id);
  try {
    const d = await imageDims(url);
    const eintrag = z0.photos[which] = { url: url, file: file, w: d.w, h: d.h, demo: false, id: id };
    z0.ai[which] = { status: 'idle' };
    z0.win.bilder = Object.assign({}, z0.win.bilder || {}, { [which]: id });
    z0.win.fotos = (z0.photos.in ? 1 : 0) + (z0.photos.out ? 1 : 0);
    render();
    /* einmal verkleinern, für die KI und für die Ablage (Gerät, dann Server) */
    let klein = null; try { klein = await AI.shrink(file); } catch (e) { klein = null; }
    if (z0.photos[which] !== eintrag) return; // inzwischen neu fotografiert
    if (klein && klein.blob) { await Fotos.ablegen(id, klein.blob, klein.w, klein.h); fotosHochladen(); } // wurde das Fenster schon gespeichert, bevor das Foto abgelegt war, geht es jetzt hoch
    startAI(which, klein && klein.blob ? klein : file, z0); // trägt die Auswertung sofort ein (KI_LAEUFT), erst danach endet die Arbeit am Foto
  } finally { FOTO_ARBEIT.delete(id); }
}
async function startAI(which, file, z0) {
  const z = Object.assign({}, z0 || { ai: S.ai, win: S.win, photos: S.photos }, { which: which, ctrl: new AbortController() });
  /* dasselbe Fenster, dieselbe Seite: der alte Auftrag gilt nicht mehr */
  KI_LAEUFT.forEach((j) => { if (j.ai === z.ai && j.which === which) { j.ctrl.abort(); KI_LAEUFT.delete(j); } });
  KI_LAEUFT.add(z);
  let zeigen = false;
  try {
    const ok = await AI.init();
    S.aiOk = ok;
    if (z.ctrl.signal.aborted) return;
    if (!ok) { z.ai[which] = { status: 'error', code: 'unavailable' }; zeigen = true; return; }
    z.ai[which] = { status: 'running' }; render();
    const res = await AI.analyze(file, which, z.ctrl.signal, (part, r) => { if (z.ctrl.signal.aborted) return; z.ai[which] = Object.assign({ status: 'running' }, r); mergeKI(z); render(); }, !!z.win.neu);
    if (z.ctrl.signal.aborted) return;
    z.ai[which] = Object.assign({ status: 'done' }, res);
    if (res.errs.befund) { z.ai[which].status = 'error'; z.ai[which].code = res.errs.befund; }
    mergeKI(z);
    kiNachtragen(z);
    zeigen = true;
  } catch (e) {
    if (e && e.code === 'cancelled') return;
    z.ai[which] = { status: 'error', code: e && e.code || 'error' }; zeigen = true;
  } finally {
    KI_LAEUFT.delete(z); // erst austragen, dann zeichnen: sonst steht „liest noch“ weiter da
    if (zeigen) render();
    kiFertigMelden();
  }
}
/* Hinweis, solange die KI noch liest (nach dem Speichern, vor dem Senden) */
const kiLaeuftKarte = (satz) => '<div class="teaser ki-laeuft" role="status"><p class="eyebrow">Aus deinen Fotos</p><p class="sub" style="display: flex; align-items: center; gap: 10px"><span class="spin dark"></span>' + esc(satz) + '</p></div>';
/* Zahl der Angaben aus den Fotos: Befundzeilen, dazu die Fachangaben auf einen Blick */
const kiAnzahl = (ki) => { const n = ((ki && ki.rows) || []).length + (ki && ki.fach && Object.keys(ki.fach).length ? 1 : 0); return n + (n === 1 ? ' Angabe' : ' Angaben'); };
/* KI-Ergebnisse beider Fotos zu einer Sicht fürs Fenster zusammenführen.
   Übernommen werden nur Angaben zur Einbausituation; das alte Fenster bestimmt nichts am neuen (Material, Teilung wählt der Kunde).
   Dasselbe Thema innen und außen: außen bekommt den Zusatz „Außen:“. Die Laibungstiefe kommt nur vom Innenfoto. */
function mergeKI(z) {
  z = z || { ai: S.ai, win: S.win, photos: S.photos };
  const a = z.ai.in, b = z.ai.out, w = z.win;
  const fi = a && a.befund && a.befund.ok ? a.befund : null, fa = b && b.befund && b.befund.ok ? b.befund : null;
  const chips = [], rows = [], hints = [], pruefen = [], dazu = (liste, x) => { if (x && liste.indexOf(x) < 0) liste.push(x); };
  const innen = new Set((fi ? fi.rows : []).map((r) => r[0].toLowerCase()));
  [fi, fa].forEach((f, i) => {
    if (!f) return;
    f.chips.forEach((c) => { if (chips.length < 6) dazu(chips, c); });
    f.rows.forEach((r) => rows.push([i && innen.has(r[0].toLowerCase()) ? 'Außen: ' + r[0] : r[0], r[1]]));
    f.hints.forEach((t) => dazu(hints, t)); f.pruefen.forEach((t) => dazu(pruefen, t));
  });
  const fach = fachMischen(fi && fi.fach, fa && fa.fach), verh = (fi && fi.verh) || (fa && fa.verh) || null;
  w.ki = Object.assign({ auto: true, chips: chips, rows: rows, hints: hints.slice(0, 6), pruefen: pruefen.slice(0, 6), laib: fi ? fi.laib : null, tilt: fi ? fi.tilt : null }, Object.keys(fach).length ? { fach: fach } : {}, verh && !w.neu ? { verh: verh } : {});
  if (!w.neu && w.ki.laib && !w.e_laib && !num(w.laib)) w.laib = w.ki.laib;
  fachVerwerten(w);
  w.fotos = (z.photos.in ? 1 : 0) + (z.photos.out ? 1 : 0);
}
/* Fachangaben beider Fotos zusammenführen. Rollladenkasten: innen erkannter Einbau- oder Aufsatzkasten geht vor, sonst der Vorbaukasten
   von außen; Anschlag innen und außen getrennt; Fassade, Geschoss, Erreichbarkeit und Gerüst kommen von außen, Brüstung von innen */
function fachMischen(i, a) {
  i = i || {}; a = a || {};
  const f = {};
  const kasten = i.rollladen === 'einbau' || i.rollladen === 'aufsatz' ? i.rollladen : a.rollladen && a.rollladen !== 'keiner' ? a.rollladen : i.rollladen || a.rollladen;
  if (kasten) f.rollladen = kasten;
  if (i.anschlag === 'innen' || i.anschlag === 'ohne') f.anschlagI = i.anschlag;
  if (a.anschlag === 'aussen' || a.anschlag === 'ohne') f.anschlagA = a.anschlag;
  if (a.fassade) f.fassade = a.fassade;
  if (i.fensterbank) f.fbi = i.fensterbank;
  if (a.fensterbank) f.fba = a.fensterbank;
  if (i.bruestung) f.bruestung = i.bruestung;
  if (a.geschoss) f.geschoss = a.geschoss;
  ['erreichbar', 'geruest'].forEach((k) => { if (typeof a[k] === 'boolean') f[k] = a[k]; });
  if (i.strom === true || a.strom === true) f.strom = true; else if (i.strom === false || a.strom === false) f.strom = false;
  return f;
}
/* Was der Kunde nicht wissen muss, kommt aus den Fotos: Fassade fürs Modell, Anschlag fürs Blatt, das Geschoss als Vorschlag (bis er es selbst wählt) */
function fachVerwerten(w) {
  const f = w.ki && w.ki.fach; if (!f) return;
  if (f.fassade && f.fassade !== 'sonstige' && !w.e_fassade) w.fassade = f.fassade; // eigene Wahl am Modell (Zahnrad) geht vor
  if (f.anschlagI === 'innen') w.anschlag = 'innen'; else if (f.anschlagA === 'aussen') w.anschlag = 'aussen'; else if (f.anschlagI === 'ohne' || f.anschlagA === 'ohne') w.anschlag = 'ohne';
  if (f.geschoss && !w.e_etage) w.etage = f.geschoss;
}
/* Beispielfotos mit festen KI-Ergebnissen: nur noch für Prüfungen; im echten Aufmaß gibt es sie nicht (die Führung hat eigene) */
async function useDemo() {
  const [u1, u2] = await Promise.all([demoPhotoUrl('in'), demoPhotoUrl('out')]);
  S.photos.in = { url: u1, file: null, w: 1200, h: 1400, demo: true }; S.photos.out = { url: u2, file: null, w: 1200, h: 1400, demo: true };
  S.ai.in = { status: 'running' }; S.ai.out = { status: 'running' }; S.win.fotos = 2;
  render();
  setTimeout(() => { S.ai.in = Object.assign({ status: 'done' }, AI.DEMO.in); S.ai.out = Object.assign({ status: 'done' }, AI.DEMO.out); mergeKI(); render(); }, 1400);
}
function newWin() {
  /* laufende Auswertungen des vorigen Fensters laufen weiter (kiNachtragen); nur die Vorschaubilder kommen weg */
  ['in', 'out'].forEach((k) => { const p = S.photos[k]; if (p && p.url && !p.demo) { try { URL.revokeObjectURL(p.url); } catch (e) { /* ok */ } } });
  S.win = baseWin(); S.editIdx = -1; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.nameFehler = false;
  /* Keine Vorauswahl, wo eine Vorgabe Geld kostet: Farbe außen und Fensterbank außen starten offen, bis der Kunde wählt */
  S.win.offen = { fa: true, fba: true };
  S.mess = { step: 0, cur: '', msg: null, ack: false }; S.rest = { i: 0, cur: '', msg: null }; S.openSash = -1;
  S.selSash = 0; S.selBar = null; S.side = 'aussen'; S.designVorher = null;
  go('start');
}
/* Speichern: Neue Fenster zählen gegen die Grenze; nach der ersten Woche zählt jedes Speichern mit einer Änderung (höchstens vier).
   Gespeichert wird eine Kopie, bearbeitet wird immer eine eigene Kopie (S.win). */
function saveWin() {
  if (!nameDa(S.win)) return nameVerlangen(); // ohne Namen kein Speichern, auch nicht über „Speichern“ bei der Gestaltung
  S.designVorher = null; S.offenVorText = null; S.nameFehler = false;
  const jetzt = zeit(), w = Object.assign({}, S.win, { name: String(S.win.name).trim() });
  /* Tiefe je Fenster (AW.tiefeVon): die tiefste, mit der der Kunde dieses Fenster gespeichert hat; ändert er die Tiefe danach für ein
     anderes Fenster, bleibt hier, was er gefragt wurde. Zählt nicht als Änderung (aenderungFp) */
  const tp = S.proj && TIEFE[S.proj.tiefe] ? S.proj.tiefe : '';
  if (tp && !(TIEFE[w.tiefe] >= TIEFE[tp])) w.tiefe = tp;
  let hinweis = '';
  if (S.editIdx >= 0 && S.windows[S.editIdx]) {
    const alt = S.windows[S.editIdx], st = aendStand(alt, jetzt), anders = fensterFp(alt) !== fensterFp(w), zaehlt = aenderungFp(alt) !== aenderungFp(w);
    w.wid = alt.wid || neueWid(); w.t0 = Number(alt.t0) || jetzt; w.aend = Number(alt.aend) || 0; w.ts = anders ? jetzt : Number(alt.ts) || 0;
    if (zaehlt && st.fest) { toast(festText(st)); S.win = kopie(alt); return go('fertig'); }
    if (zaehlt && !st.frei) { w.aend += 1; const rest = GRENZE.aenderungen - w.aend; hinweis = rest > 0 ? 'Gespeichert. Dieses Fenster kannst du noch ' + MAL[rest] + ' ändern.' : 'Gespeichert. Das war die letzte Änderung an diesem Fenster.'; }
    S.windows[S.editIdx] = kopie(w);
  } else {
    if (!neuMoeglich()) { toast(maxMsg()); return go('home', 'back'); }
    w.wid = neueWid(); w.t0 = jetzt; w.aend = 0; w.ts = jetzt;
    S.angelegt = angelegt() + 1; S.windows.push(kopie(w)); S.editIdx = S.windows.length - 1; S._feier = 'fertig'; fortschritt('arbeit', 4);
  }
  const ziel = S.windows[S.editIdx];
  kiZielMerken(S.win, ziel.wid); // läuft die Auswertung noch, kommt ihre Antwort in dieses gespeicherte Fenster
  /* Das Bild der Lage entsteht erst aus Foto und Ecken; fehlt es, wird es für das gespeicherte Fenster nachgezogen */
  if (ziel.plan && !ziel.plan.bild && ziel.plan.ecken && planFoto()) planBildErzeugen(ziel).then((b) => { if (b && S.win && S.win.wid === ziel.wid && S.win.plan) { S.win.plan.bild = b; S.win.plan.bw = ziel.plan.bw; S.win.plan.bh = ziel.plan.bh; } lokalSpeichern(); });
  S.win = kopie(ziel); persist(); entwurfWeg(); go('fertig');
  fotosHochladen(); // die Fotos gehen mit dem gespeicherten Fenster zum Server (Link oder Konto)
  if (hinweis) toast(hinweis);
}
/* ---------- Sprossen: Einrasten auf Viertel, Drittel, Hälfte ---------- */
function snapP(p) { const pts = [0.25, 1 / 3, 0.5, 2 / 3, 0.75]; for (let i = 0; i < pts.length; i++) if (Math.abs(p - pts[i]) < 0.03) return pts[i]; return clamp(p, 0.06, 0.94); }
/* ---------- Offen statt Vorgabe ----------
   „Weiß ich noch nicht“ setzt den neutralen Wert (so zeigt das Modell nichts Gewähltes, Folgefragen wie die Farbe des Rollladens
   entfallen) und merkt die Angabe als offen. Jede Wahl danach entscheidet sie. */
const OFFEN_NEUTRAL = {
  material: () => ({ material: 'kunststoff' }), fa: () => ({ wunschA: '' }), fi: () => ({ wunschI: '', gleich: false }), glas: () => ({ glas: '3' }), glasfn: () => ({ glasfn: [] }),
  spross: () => ({ spross: 'wiener' }), griff: (w) => ({ griff: 'standard', wunschGf: '' }), rc: () => ({ rc: 'basis' }), sart: () => ({ sart: 'keiner', roll: 'keiner' }),
  antrieb: () => ({ antrieb: 'gurt' }), insekt: () => ({ insekt: 'keiner' }), iart: () => ({ iart: 'keiner', wunschIf: '' }), fbi: (w) => ({ fbi: w.neu ? 'werzalit' : 'behalten' }), fba: () => ({ fba: 'alu' })
};
function offenSetzen(w, k, an) {
  if (k === 'absturz') { if (an) w.absturz = ''; return; }
  const o = Object.assign({}, w.offen || {});
  if (an) { o[k] = true; Object.assign(w, OFFEN_NEUTRAL[k] ? OFFEN_NEUTRAL[k](w) : {}); if (k === 'griffA') w.bt = Object.assign({}, w.bt, { griffA: 'keiner' }); }
  else delete o[k];
  w.offen = o;
}
/* Aus welcher Wahl welche offene Angabe entschieden wird */
const ENTSCHEIDET = { roll: 'einbau', wunschA: 'fa', wunschI: 'fi', gleich: 'fi', wunschGf: 'griff', demontage: 'montage', durchbruch: 'montage', ralm: 'montage', putz: 'montage', orn: 'glasfn' };
function entschieden(w, f) { const k = ENTSCHEIDET[f] || f; if (w.offen && w.offen[k]) { const o = Object.assign({}, w.offen); delete o[k]; w.offen = o; } }
/* Eine eingetippte Farbe entscheidet; wird sie wieder gelöscht, ohne dass eine Farbe aus der Liste gewählt wurde, ist die Farbe wieder offen
   (sonst stünde still die Vorgabe im Blatt). Gemerkt nur für dieses Fenster und diese Sitzung. */
function offenMerken(w, f) { const k = ENTSCHEIDET[f]; if (k && w.offen && w.offen[k]) S.offenVorText = { w: w, f: f }; }
function offenZurueck(w, f) { const m = S.offenVorText; if (m && m.w === w && m.f === f && !String(w[f] || '').trim()) { offenSetzen(w, ENTSCHEIDET[f], true); S.offenVorText = null; } }
/* Breite und Höhe vertauscht: alle Maße der Öffnung und des Elements tauschen (Mitte, Ränder, Element) */
function masseTauschen(w) {
  const mo = w.mo || {}, t = (a, b) => { const x = mo[a]; mo[a] = mo[b]; mo[b] = x; };
  t('hm', 'wm'); t('hl', 'wt'); t('hr', 'wb');
  const el = w.el || {}, h = el.h; el.h = el.w; el.w = h; const hh = w.h; w.h = w.w; w.w = hh;
}
/* ---------- Aktionen ---------- */
const NUMF = { w: 1, h: 1, bru: 1, laib: 1, anzahl: 1, breite: 1 };
function act(name, el) {
  const v = el.getAttribute('data-v'), f = el.getAttribute('data-f'), w = S.win;
  const n = (x) => { const k = parseInt(x, 10); return isNaN(k) ? x : k; };
  /* In der Führung: Gesperrtes erklärt sich, alles, was das eigene Projekt verändern würde, bleibt aus */
  if (S.tour && S.screen === 'tour') {
    if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') return tourSchloss();
    if (!TOUR_DARF.test(name)) return;
  }
  switch (name) {
    case 'none': return;
    case 'tour-start': return tourStart();
    case 'tour-weiter': return tourGehe(S.tour ? S.tour.i + 1 : 0);
    case 'tour-zurueck': return tourGehe(S.tour ? S.tour.i - 1 : 0);
    case 'tour-ende': return tourEnde();
    case 'tour-eigen': return tourEnde(true);
    case 'tour-schloss': return tourSchloss();
    case 'tour-pdf': return tourPDF();
    case 'tour-nochmal': { const t = S.tour; if (!t) return; tourStopp(); t.mess = { k: 0, cur: '', fertig: false }; render(); nachBild(tourMessen, 300); return; }
    case 'tour-art': { if (!S.tour) return; if (v === S.win.art) return render(); const alt = S.win, nw = tourWin(v); ['fa', 'fi', 'material', 'glas', 'glasfn', 'sart', 'sfarbe', 'roll', 'ki'].forEach((k) => { nw[k] = alt[k]; }); S.win = nw; S.selSash = 0; S.openSash = -1; render(); if (tourArtTuer(v)) nachBild(tuerZeigen, 360); return; }
    case 'situation': { const neu = v === 'neu'; if (neu === !!w.neu) return render(); w.neu = neu; w.plan = null; if (neu) { w.demontage = false; if (w.sart === 'behalten') { w.sart = 'keiner'; w.roll = 'keiner'; } if (w.fbi === 'behalten') w.fbi = 'werzalit'; if (w.fba === 'behalten') w.fba = 'alu'; } else w.demontage = true; return render(); }
    case 'art': { if (v === w.art) return render(); artSetzen(w, v); S.selSash = 0; S.openSash = -1; return render(); }
    case 'felder': { w.e_teilung = true; w.teilung = v; delete w.anteile; w.sashes = festFelder(v === '2p' ? 2 : num(v)); mirrorBars(w); S.selSash = 0; S.selBar = null; return render(); }
    case 'ul-set': { w.ul = v !== 'nein'; if (v !== 'nein') w.ulA = v; return render(); }
    case 'ulh': { w.ulH = clamp(num(w.ulH) + n(v), 200, 1200); return render(); }
    case 'hst': { w.hst = Object.assign({}, w.hst, { [f]: v }); if (f === 'schwelle') entschieden(w, 'schwelle'); if (f !== 'schwelle') { w.sashes = hstFluegel(w.hst.schema, w.hst.richtung); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; } render(); if (f !== 'schwelle') nachBild(tuerZeigen, 120); return; }
    case 'fsw': { const o = Object.assign({}, w.fsw); if (f === 'geh') o.geh = !o.geh; else if (f === 'n') o.n = clamp(num(v), 2, 7); else o[f] = v; w.fsw = o; if (f === 'schwelle') entschieden(w, 'schwelle'); if (f !== 'schwelle') { w.sashes = fswFluegel(o.n, o.schema, o.geh); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; } render(); if (f === 'geh' && o.geh) { nachBild(() => { const i = w.sashes.findIndex((x) => x.t === 'P'); if (i >= 0) oeffnungZeigen(i, 'D'); }, 120); } else if (f !== 'schwelle') nachBild(tuerZeigen, 120); return; }
    case 'psk': { w.psk = Object.assign({}, w.psk, { [f]: v }); w.sashes = pskFluegel(w.psk.schema, w.psk.richtung); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; render(); nachBild(tuerZeigen, 120); return; }
    case 'bt': { w.bt = Object.assign({}, w.bt, { [f]: v }); entschieden(w, f); return render(); }
    case 'offen': { const k = f, an = k === 'glasfn' ? !(w.offen && w.offen[k]) : true; offenSetzen(w, k, an); if (an && (k === 'fba' || k === 'einbau')) w.offenWahl = Object.assign({}, w.offenWahl || {}, { [k]: 1 }); return render(); } // selbst getippt, kein Startwert (AW.nachTiefe)
    case 'tiefe': { S.proj.tiefe = v; persist(); return render(); }
    case 'tiefe-zeigen': { if (S.q !== 'tiefe') S.tiefeZurueck = S.q; S.q = 'tiefe'; S.dir = 'fwd'; return render(true); }
    case 'kap-mehr': {
      /* Die dazugeholten Fragen stehen meist vor der aktuellen (der Knopf sitzt an der letzten sichtbaren des Kapitels): weiter bei der
         ersten, die vorher nicht zu sehen war; „Weiter“ führt dann der Reihe nach durchs Kapitel */
      const vorher = new Set(qSichtbar(w).map((q) => q.id)), m = Object.assign({}, MEHR.get(w) || {}); m[v] = true; MEHR.set(w, m);
      const neu = qCurrent().list.find((q) => q.kap === v && !vorher.has(q.id)); if (neu) { S.q = neu.id; S.dir = 'fwd'; S.selBar = null; S.qWunsch = false; S.qMass = null; S.openSash = neu.sash != null ? neu.sash : -1; if (neu.sash != null) S.selSash = neu.sash; }
      return render(true);
    }
    case 'detail': {
      /* Detailangabe: '' heißt Standard des Fensterbauers (Wert weg); Mehrfachauswahl schaltet einzeln */
      const dd = AW.DETAIL.find((x) => x.k === f); if (!dd) return;
      if (dd.mehr && v !== '') { const a = (w[f] || []).slice(), i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); if (a.length) w[f] = a; else delete w[f]; }
      else if (v === '') delete w[f]; else w[f] = v;
      if (f === 'seiten') seitenAnwenden(w);
      if (f === 'paneel') { if (w.paneel === 'paneel') { if (!num(w.paneelH)) w.paneelH = 400; } else delete w.paneelH; }
      if (f === 'sfTeile' && w.sfTeile !== 'eigen') { delete w.sfK; delete w.sfS; }
      return render();
    }
    case 'detail-mm': {
      const m = Object.keys(DETAIL_UI).map((k) => DETAIL_UI[k].mass).find((x) => x && x.f === f); if (!m) return;
      w[f] = clamp((num(w[f]) || m.std) + n(v), m.min, m.max); return render();
    }
    case 'erreichbar': { w.erreichbar = v; return render(); }
    case 'absturz': { w.absturz = v; return render(); }
    case 'design': { const src = S.windows[+v]; if (!src) return; if (!S.designVorher) S.designVorher = designAnwenden(kopie(w), w); designAnwenden(w, src); S.selBar = null; render(); if (window.Haptik) window.Haptik.ok(); return; }
    case 'design-weg': { if (S.designVorher) designAnwenden(w, S.designVorher); S.designVorher = null; return render(); }
    case 'mass-tausch': { masseTauschen(w); w.massOk = false; toast('Breite und Höhe getauscht'); return render(); }
    case 'mass-ok': { w.massOk = true; return render(); }
    case 'mass-nach': { S.mess = { step: 0, cur: '', msg: null, ack: false }; return go('messen'); }
    case 'plan-rect': { planRechteck(w); const box = document.querySelector('[data-r="zeich"]'); if (box && box._geo) zeichnenUpdate(box); if (window.Haptik) window.Haptik.ok(); return; }
    case 'plan-reset': { w.plan = planStart(w); const box = document.querySelector('[data-r="zeich"]'); if (box && box._geo) zeichnenUpdate(box); return; }
    case 'plan-seite': { const pl = planSicher(w); pl.seite = pl.seite === 'in' && S.photos.out ? 'out' : 'in'; pl.bild = ''; return render(true); }
    case 'plan-bump': { const d = derive(w), cur = f === 'w' ? d.moW : f === 'h' ? d.moH : num(w[f]); planMasse(w, f, cur + n(v)); return render(); }
    case 'sart': {
      /* Neuer Rollladen, Raffstore oder Screen: den Kasten wählt erst einmal der Fensterbauer (nach den Fotos), der Kunde darf es selbst */
      const vorher = w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen';
      w.sart = v; entschieden(w, 'sart');
      if (v === 'keiner' || v === 'behalten') w.roll = v; else if (v === 'klappladen') w.roll = 'keiner'; else { if (w.roll !== 'vorbau' && w.roll !== 'unterputz') w.roll = 'aufsatz'; if (!vorher) w.offen = Object.assign({}, w.offen || {}, { einbau: true }); }
      return render();
    }
    case 'go': if (v === 'ergebnis' && S.screen === 'fertig' && (!darfAendern() || !linkOffen())) return; return go(v);
    /* Übersicht aller Fenster aus den Wünschen (Knopf oben links): bei ungespeicherten Änderungen erst das Blatt „Noch nicht gespeichert“ */
    case 'liste': { S.qMass = null; return verlassen({ art: 'home' }); }
    case 'back': { if (S.qMass && S.screen === 'frage') { S.qMass = null; return render(); } if (einstiegHier()) return zumEinstieg(); const view = SCREENS[S.screen] ? SCREENS[S.screen]() : null, b = view && view.back ? view.back[1] : 'home'; if (b === 'tour-ende') return tourEnde(); if (b === 'mess-prev') return messPrev(); if (b === 'rest-prev') return restPrev(); if (b === 'qprev') return qStep(-1); if (b === 'mess-back') { S.mess.step = 3; S.mess.pad = false; S.mess.msg = null; const st = MESS[3]; S.mess.cur = String(w.el[st.k] || ''); return go('messen', 'back'); } if (b === 'home' && imAssistenten()) return verlassen({ art: 'home' }); return go(b, 'back'); }
    case 'copywin': { if (!linkOffen()) return; if (!neuMoeglich()) return toast(maxMsg()); const c = Object.assign(baseWin(), kopie(w), { name: (w.name || 'Fenster') + ' (Kopie)', fotos: 0, ki: w.ki, wid: neueWid(), t0: zeit(), aend: 0, ts: zeit() }); S.angelegt = angelegt() + 1; S.windows.push(kopie(c)); S.editIdx = S.windows.length - 1; S.win = kopie(c); S.designVorher = null; persist(); toast('Kopiert, Maße prüfen'); return go('ergebnis'); }
    case 'new': if (INST && S.betrieb && S.sent) return instanzWeitere(); if (S.betrieb && S.sent) return toast('Schon gesendet. Änderungen bitte direkt mit ' + (S.betrieb.name || 'deinem Fensterbauer') + ' klären.'); if (!linkOffen()) return; if (!neuMoeglich()) return toast(maxMsg());
      if (INST && S.instZu) return go('home');
      if (INST && S.betrieb && !S.betrieb.code) return instanzStart().then((ok) => { if (ok) newWin(); }); // Instanz: der Code kommt mit dem ersten Fenster
      return newWin();
    case 'inst-weitere': return instanzWeitere();
    case 'inst-vergessen': return instanzVergessen();
    case 'inst-pdf': return anfragePdf();
    case 'inst-geraet': { S.instGeraet = !S.instGeraet; return render(); }
    case 'inst-link-kopieren': { const t = instWeiterLink(); try { navigator.clipboard.writeText(t).then(() => toast('Link kopiert.'), () => toast('Kopieren geht hier nicht. Bitte den Link markieren und kopieren.')); } catch (e) { toast('Kopieren geht hier nicht. Bitte den Link markieren und kopieren.'); } return; }
    case 'inst-link-teilen': { const t = instWeiterLink(); if (navigator.share) { navigator.share({ title: 'Fensterplanung bei ' + (INST.name || ''), url: t }).catch(() => {}); return; } return toast('Teilen geht hier nicht. Bitte den Link kopieren.'); }
    case 'kontakt-weiter': { const f = kontaktPruefen(); if (f.fehlt) { S.kontaktFehler = Object.assign(f, { alle: true }); render(); const el = document.querySelector('.trow.bad input'); if (el) try { el.focus(); } catch (e) { /* ok */ } return toast('Bitte noch Name und Telefon oder E-Mail angeben.'); } S.kontaktFehler = null; return go('blatt'); }
    case 'open': return fensterOeffnen(+el.getAttribute('data-i'));
    case 'delwin': { if (!linkOffen()) return; if (S.editIdx < 0 || !S.windows[S.editIdx]) { S.editIdx = -1; go('home', 'back'); return toast('Dieses Fenster gibt es nicht mehr.'); } const weg = S.windows[S.editIdx]; if (weg.wid) { S.sync.geloescht[weg.wid] = zeit(); const alle = Object.keys(S.sync.geloescht); if (alle.length > 200) alle.sort((a, b) => S.sync.geloescht[a] - S.sync.geloescht[b]).slice(0, alle.length - 200).forEach((k) => { delete S.sync.geloescht[k]; }); } S.angelegt = angelegt(); S.windows.splice(S.editIdx, 1); S.editIdx = -1; persist(); entwurfWeg(weg.wid); Fotos.weg(bilderVon(weg).filter((id) => !S.windows.some((x) => bilderVon(x).includes(id)))); toast('Fenster gelöscht'); return go('home', 'back'); }
    case 'aufmass-neu': { S.neuFrage = true; return render(); }
    case 'sichern': return sichernStart('sichern');
    case 'anmelden': return sichernStart('anmelden');
    case 'sichern-code': return sichernCode();
    case 'sichern-neu': { if (S.sichern) { S.sichern.schritt = 1; } return sichernCode(); }
    case 'sichern-zurueck': { if (S.sichern) { S.sichern.schritt = 1; S.sichern.err = {}; } return render(); }
    case 'sichern-pruefen': return sichernPruefen();
    case 'projekt-oeffnen': return projektOeffnen(el.getAttribute('data-k'));
    case 'konto-neu': return kontoNeuesAufmass();
    case 'konto-frage': { S.kontoFrage = v || ''; return render(); }
    case 'konto-abmelden-ja': return kontoAbmelden();
    case 'konto-loeschen-ja': return kontoLoeschen();
    case 'aufmass-weg-ja': return aufmassLoeschen(el.getAttribute('data-k'));
    case 'link-anmelden-ja': { const r = S.linkAnmeldung; S.linkAnmeldung = null; return r ? kontoWechseln(r) : go('home'); }
    case 'link-anmelden-nein': { S.linkAnmeldung = null; go('home'); return toast('Nicht angemeldet.'); }
    case 'aufmass-neu-nein': { S.neuFrage = false; return render(); }
    case 'aufmass-neu-ja': { if (S.betrieb) return; if (kontoBereit() && KS) return kontoNeuesAufmass(); S.neuFrage = false; fotosHierWeg(true); entwurfWeg(); try { localStorage.removeItem(STORE); } catch (e) { /* ok */ } loadOwn(); S.teil = null; toast('Neues Aufmaß begonnen'); return go('home'); }
    case 'gloss': { S.gloss = el.getAttribute('data-k'); S.glossIndex = false; return render(); }
    case 'gindex': { S.gloss = null; S.glossIndex = true; S.wohin = false; render(); if (S.glossSuche) glossFiltern(S.glossSuche); return; }
    case 'gclose': { S.gloss = null; S.glossIndex = false; return render(); }
    /* Notiz an der Stelle */
    case 'notiz-auf': return notizAuf(v);
    case 'notiz-sichern': return notizZu('sichern');
    case 'notiz-weg': return notizZu('weg');
    case 'notiz-zu': return notizZu();
    /* Übersicht und Verlassen */
    case 'wohin': { S.wohin = true; S.gloss = null; S.glossIndex = false; return render(); }
    case 'wohin-zu': { S.wohin = false; return render(); }
    case 'wohin-liste': return verlassen({ art: 'home' });
    case 'wohin-web': return verlassen({ art: 'url', url: PORTAL_URL });
    case 'wohin-fenster': { const i = +el.getAttribute('data-i'); S.wohin = false; if (imAssistenten() && i === S.editIdx) return render(); return verlassen({ art: 'fenster', i: i }); }
    case 'wohin-speichern': { S.wohin = false; saveWin(); if (S.screen === 'fertig') go('home', 'back'); return; }
    case 'wohin-schritt': {
      if (el.getAttribute('aria-disabled') === 'true') return toast(v === 'rest' ? 'Erst die vier Maße in der Mitte' : v === 'zeichnen' ? 'Erst ein Foto der Stelle' : 'Erst alle Maße messen');
      S.wohin = false; if (v === S.screen) return render();
      if (v === 'messen') { const k = MESS.findIndex((m) => !num(m.who === 'mo' ? w.mo[m.k] : w.el[m.k])); S.mess = { step: k < 0 ? 0 : k, cur: '', msg: null, ack: false }; if (k < 0) S.mess.cur = String(w.mo.hm || ''); }
      if (v === 'frage' && S.screen !== 'frage') { S.q = null; S.openSash = -1; S.designVorher = null; S.nameFehler = false; }
      return go(v, stepsFor(w).indexOf(v) < stepsFor(w).indexOf(S.screen) ? 'back' : 'fwd');
    }
    case 'q-sprung': { const c = qCurrent(), j = c.list.findIndex((q) => q.id === v); if (j < 0) return; if (j > c.i && c.q.id === 'lage' && !nameDa(w)) return nameVerlangen(); S.wohin = false; return qStep(j - c.i); }
    case 'verlassen-speichern': { const z = S.verlassen && S.verlassen.ziel; S.verlassen = null; saveWin(); if (S.screen === 'fertig' && z) ziehen(z); return; }
    case 'verlassen-entwurf': { const z = S.verlassen && S.verlassen.ziel; S.verlassen = null; entwurfJetzt(); return ziehen(z); }
    case 'verlassen-verwerfen': { const z = S.verlassen && S.verlassen.ziel, g = S.editIdx >= 0 ? S.windows[S.editIdx] : null; S.verlassen = null; entwurfWeg(); if (g) S.win = altAngleichen(Object.assign(baseWin(), kopie(g))); else { S.win = baseWin(); S.editIdx = -1; } ziehen(z); return toast(g ? 'Änderungen verworfen' : 'Fenster verworfen'); }
    case 'verlassen-name': { S.verlassen = null; return nameVerlangen(); }
    case 'verlassen-abbrechen': { S.verlassen = null; return render(); }
    case 'entwurf-weiter': S.sendeFrage = false; return entwurfFortsetzen();
    case 'entwurf-weg': { S.sendeFrage = false; entwurfWeg(); render(); return toast('Entwurf verworfen'); }
    case 'sende-frage-zu': S.sendeFrage = false; return render();
    case 'send-ohne': { S.sendeFrage = false; entwurfWeg(); render(); return act('send', el); }
    /* Foto groß */
    case 'foto-gross': { if (v === 'plan' ? !(w.plan && w.plan.bild) : !S.photos[v]) return; S.fotoGross = { seite: v }; return render(); }
    case 'foto-zu': { S.fotoGross = null; return render(); }
    case 'foto-zoom': return fotoZoomKnopf(n(v));
    case 'foto-weg': { fotoWeg(); return render(); }
    case 'foto-notiz': { S.fotoGross = null; return notizAuf('w:fotos'); }
    case 'foto-lage': { S.fotoGross = null; return go('zeichnen'); }
    case 'ohne-foto': { if (ohneFotoZu()) return ohneFotoWeiter(); S.ohneFotoFrage = true; return render(); }
    case 'ohne-foto-weiter': return ohneFotoWeiter();
    case 'ohne-foto-zu': { S.ohneFotoFrage = false; return render(); }
    case 'setw': { if (f === 'material') w.e_material = true; if (f === 'etage') w.e_etage = true; if (f === 'gf') w.wunschGf = ''; else if (f === 'sfarbe') w.wunschSf = ''; else if (f === 'ifarbe') w.wunschIf = ''; if (NUMF[f]) w[f] = n(v); else w[f] = v; entschieden(w, f); return render(); }
    case 'setp': { S.proj[f] = v; if (f === 'foerdweg') S.proj.foerd = v === 'bafa' || v === 'steuer'; persist(); return render(); }
    case 'togglew': { w[f] = !w[f]; entschieden(w, f); return render(); }
    case 'togglep': { S.proj[f] = !S.proj[f]; persist(); return render(); }
    case 'bump': { const leer = w[f] === '' || w[f] == null, cur = (leer && f === 'bru' ? 850 : num(w[f])) + n(v); w[f] = clamp(cur, f === 'anzahl' ? 1 : 0, 9999); if (f === 'laib') w.e_laib = true; return render(); }
    case 'bumpp': { S.proj.total = clamp(num(S.proj.total) + n(v), 1, 999); persist(); return render(); }
    case 'mess-next': return messNext(!!el.getAttribute('data-ack'));
    case 'mess-cm': { S.mess.cur = String(num(v)); S.mess.msg = null; return messNext(false); }
    case 'mess-auf': return messAuf();
    case 'mess-zu': return messZu();
    case 'mess-neu': { S.mess.msg = null; S.mess.cur = ''; return render(); }
    case 'mess-weiter': return messWeiter();
    case 'rest-auf': return restAuf();
    case 'rest-zu': return restZu();
    case 'rest-neu': { S.rest.msg = null; S.rest.cur = ''; return render(); }
    case 'rest-weiter': return restWeiter();
    case 'rest-next': return restNext(!!el.getAttribute('data-ack'));
    case 'rest-cm': { S.rest.cur = String(num(v)); S.rest.msg = null; return restNext(false); }
    case 'rest-same': { S.rest.cur = String(num(v) || ''); S.rest.msg = null; return restNext(true); }
    case 'key': return keyIn(v);
    case 'mass-tasten': return massTasten(f);
    case 'qnext': return qStep(1);
    case 'wuensche': {
      if (S.screen === 'fertig' && (!darfAendern() || !linkOffen())) return; S.q = null; S.openSash = -1; S.designVorher = null; S.nameFehler = false;
      if (v && KAP_I[v] != null) { const z = qSichtbar(w).find((q) => q.kap === v) || qList(w).find((q) => q.kap === v); if (z) S.q = z.id; }
      return go('frage');
    }
    case 'qprev': return qStep(-1);
    case 'qwunsch': { S.qWunsch = !S.qWunsch; render(); const t = document.getElementById('t-wunsch'); if (t && S.qWunsch) t.focus(); return; }
    case 'ol-set': { w.ol = v !== 'nein'; if (v !== 'nein') w.olT = v; return render(); }
    case 'stulp': {
      /* die beiden Flügel neu, Seitenteile (x.st) bleiben an ihrer Stelle */
      const typ = (w.sashes[gehFluegel(w)] || {}).t === 'D' ? 'D' : 'DK', fl = [v === 'L' ? { t: typ, din: 'L' } : { t: 'D', din: 'L', steh: true }, v === 'R' ? { t: typ, din: 'R' } : { t: 'D', din: 'R', steh: true }];
      let k = 0; w.sashes = w.sashes.map((x) => (x.st ? x : fl[k++] || x)); while (k < 2) w.sashes.push(fl[k++]);
      if (w.seiten) seitenAnwenden(w); else mirrorBars(w); // Seitenteile wieder außen, Sprossen in allen Feldern
      const g = gehFluegel(w); S.selSash = g; S.openSash = g; render(); nachBild(() => oeffnungZeigen(g)); return;
    }
    case 'sash': { const i = Math.min(S.selSash, w.sashes.length - 1); w.sashes = w.sashes.map((s, j) => (j === i ? Object.assign({}, s, { [f]: v }) : s)); S.openSash = i; render(); nachBild(() => oeffnungZeigen(i, f === 'din' ? 'D' : null)); return; }
    case 'sash-tap': return onSashTap(+v);
    case 'teil-gleich': { delete w.anteile; return render(); }
    case 'teilung': { w.e_teilung = true; const sashes = sashesFor(v); w.teilung = v; w.sashes = sashes; delete w.anteile; if (w.seiten) seitenAnwenden(w); mirrorBars(w); S.selSash = 0; S.selBar = null; S.openSash = -1; return render(); }
    case 'form': {
      if (v === w.form) return render();
      if (v !== 'rechteck' && w.seiten) { delete w.seiten; seitenAnwenden(w); }
      if (festForm(v)) {
        if (!festForm(w.form)) VOR_RUND.set(w, { teilung: w.teilung, sashes: w.sashes, ol: w.ol, olT: w.olT, bars: w.bars, preset: w.preset });
        const hatte = w.sashes.length > 1 || w.sashes[0].t !== 'F' || w.ol;
        w.form = v; w.teilung = '1'; w.sashes = [{ t: 'F', din: 'L' }]; w.ol = false; mirrorBars(w); S.selSash = 0;
        return hatte ? toast((v === 'rund' ? 'Runde Fenster' : 'Dreieckfenster') + ' sind fest verglast, ohne Flügel und Oberlicht') : render();
      }
      const vor = festForm(w.form) ? VOR_RUND.get(w) : null;
      w.form = v;
      if (vor) { Object.assign(w, { teilung: vor.teilung, sashes: vor.sashes, ol: vor.ol, olT: vor.olT, bars: vor.bars, preset: vor.preset }); VOR_RUND.delete(w); S.selSash = 0; return toast('Deine Flügel sind wieder da'); }
      return render();
    }
    case 'preset': { w.preset = v; w.bars = presetBars(v, w.sashes.length); mirrorBars(w); S.selBar = null; return render(); }
    case 'barcnt': { barCount(w, el.getAttribute('data-d'), +v); S.selBar = null; return render(); }
    case 'bareven': { ['v', 'h'].forEach((d) => { const cur = barsDir(w, d); setDir(w, d, evenP(cur.length).map((p, k) => ({ id: cur[k].id, p: p }))); }); return render(); }
    case 'clearbars': { w.bars = []; w.preset = 'keine'; S.selBar = null; return render(); }
    case 'side': { S.side = v; return render(); }
    case 'color': { const side = el.getAttribute('data-side') || S.side; S.offenVorText = null; if (side === 'innen') { w.fi = v; w.gleich = false; w.wunschI = ''; entschieden(w, 'fi'); } else { w.fa = v; w.wunschA = ''; entschieden(w, 'fa'); } return render(); }
    case 'farbe-weg': {
      /* Auch das Feld selbst leeren: Browser melden beim Neuaufbau für ein Feld mit Fokus noch „change“ mit dem alten Inhalt */
      const alt = document.getElementById('t-' + f); if (alt) alt.value = '';
      w[f] = ''; offenZurueck(w, f); render(); const i = document.getElementById('t-' + f); if (i) i.focus(); return;
    }
    case 'glasfn': { w.glasfn = w.glasfn.indexOf(v) >= 0 ? w.glasfn.filter((x) => x !== v) : w.glasfn.concat([v]); entschieden(w, 'glasfn'); return render(); }
    case 'save': return saveWin();
    case 'send': { if (vorschau()) return toast('Vorschau: Hier wird nichts gesendet.'); if (S.betrieb && S.sent) return go('gesendet'); if (!linkOffen()) return; if (!S.windows.some((x) => derive(x).complete)) return toast('Bitte erst ein Fenster vollständig messen'); if (S.betrieb && entwurfLesen()) { S.sendeFrage = true; return render(); }
      if (INST && S.instZu) return go('home');
      if (instWebsite() && kontaktPruefen().fehlt) { S.kontaktFehler = kontaktPruefen(); S.kontaktFehler.alle = true; toast('Bitte noch Name und Telefon oder E-Mail angeben.'); return go('anfrage3'); }
      if (INST) return (SERVER.daten ? Promise.resolve(true) : statusHolen()).then((da) => { if (!da) return toast('Gerade nicht erreichbar. Deine Planung bleibt gespeichert, bitte gleich noch einmal senden.'); if (S.instWeg) { S.instWeg = false; linkPruefen(); } return kiVorher('senden').then((weiter) => { if (weiter && !S.sent) return sendenServer(); }); });
      return kiVorher('senden').then((weiter) => { if (!weiter || (S.betrieb && S.sent)) return; if (SERVER.daten && S.betrieb) return sendenServer(); S.sent = { when: Date.now(), code: packProject(S.windows, S.proj, S.betrieb), runde: S.nb && S.nb.runde ? S.nb.runde : 1 }; S.nb = null; S._feier = 'gesendet'; persist(); go('gesendet'); }); }
    case 'copyblatt': return copyText(curCode(), 'code-box', 'Code kopiert');
    case 'teil-copy': { copyText(curCode(), 'code-box', 'Code kopiert'); return act('teil-mark', el); }
    case 'teil-mark': return teilMark('betrieb');
    case 'teil-pdf': return pdfTeilen();
    case 'k-start': { if (FREI()) return go('teilen'); if (SERVER.zahlung && kauf().wartet) return kaufPruefen(kauf().wartet); if (kontoBereit() && SERVER.zahlung) return KS ? kaufMitKonto() : sichernStart('kauf'); return kauf().mail ? kasseOeffnen() : go('konto'); }
    case 'k-next': { const k = kauf(); k.err = {}; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(k.mail || '').trim())) k.err.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.'; if (Object.keys(k.err).length) return render(); k.mail = k.mail.trim(); persist(); return kasseOeffnen(); }
    case 'k-pay': { const k = kauf(); k.pay = v; if (k.err) delete k.err.pay; return render(); }
    case 'k-buy': { const k = kauf(); k.err = {}; if (!SERVER.zahlung && !k.pay) k.err.pay = 'Bitte eine Zahlungsart wählen.'; if (!k.bedingungen) k.err.bedingungen = 'Bitte stimme den AGB zu.'; if (!k.widerruf) k.err.widerruf = 'Für die sofortige Lieferung brauchen wir deine Zustimmung.'; if (Object.keys(k.err).length) return render(); if (SERVER.zahlung) return kaufStarten(); k.paid = true; k.when = Date.now(); k.test = true; S._feier = 'gekauft'; persist(); return go('gekauft'); }
    case 'k-dl': return saveDatei();
    case 'ki-widerrufen': { if (window.FotoKI && window.FotoKI.widerrufen) window.FotoKI.widerrufen(); toast('Einwilligung widerrufen. Die KI wertet keine Fotos mehr aus; beim nächsten Foto fragt die App wieder.'); return render(); }
    case 'copycode': return copyText(curCode(), 'code-box', 'Code kopiert');
    case 'nachricht-kopieren': { const t = sendeText(); try { navigator.clipboard.writeText(t).then(() => toast('Nachricht kopiert. Jetzt in WhatsApp oder eine E-Mail einfügen.'), () => toast('Kopieren geht hier nicht. Bitte per WhatsApp oder E-Mail senden.')); } catch (e) { toast('Kopieren geht hier nicht. Bitte per WhatsApp oder E-Mail senden.'); } return; }
    case 'download': return saveDatei();
    default: return;
  }
}
const TOUR_DARF = /^(tour-[a-z]+|gloss|gindex|gclose|back|teilung|sash|felder|hst|fsw|psk|setw|color|sart|glasfn|situation|detail|none)$/;
/* Zifferntasten und Tastatur fürs Messen: kein Eingabefeld, keine Systemtastatur, nichts springt */
/* Haptik (gemeinsam.js): Tasten, Auswahl und Schalter tippen kurz; Fehler und fertige Schritte melden sich in feiern()/messNext() */
const TIPPT = /^(key|rest-same|qnext|qprev|new|send|gloss|q-|chip|seg|opt|sw|tile|pos|share|copy|k-pay|k-buy|situation|art|felder|ul|hst|fsw|sart|farbe|detail|tiefe|kap-mehr)/;
function tippen(name, el) { if (!window.Haptik) return; if (TIPPT.test(name) || el.matches('.chip, .seg > button, .qopt, .qlist > button, .qli > button[data-v], .qsw, .pill, .switch, .keypad button, .stepper button, .colors button')) window.Haptik.tick(); }
function keyIn(k) {
  if (S.qMass && S.screen === 'frage') return massKey(k);
  const rest = S.screen === 'rest', st = rest ? S.rest : S.mess;
  if (rest && !REST[st.i]) return; // „Passt.“: keine Eingabe mehr
  if (k === 'zurueck') return rest ? restPrev() : messPrev();
  /* Blatt zu: Enter heißt „Maß eingeben“ bzw. „Weiter“, eine Ziffer öffnet das Blatt und zählt schon */
  if (!st.pad) {
    if (k === 'del') return;
    const fertig = rest ? !!restWert(REST[st.i]) : !!messWert(MESS[st.step]);
    if (k === 'ok') return fertig ? (rest ? restWeiter() : messWeiter()) : (rest ? restAuf() : messAuf());
    if (rest) restAuf(); else messAuf();
  }
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
  try { await DL.save({ filename: 'Aufmass-' + (slug(S.proj.name) || 'eeziframes') + '.md', data: blattMarkdown(S.windows, S.proj) }); toast('Gespeichert'); }
  catch (e) { if (e && e.code !== 'declined') toast('Speichern hat nicht geklappt'); }
}
function onInput(el, ev) {
  const kind = el.getAttribute('data-in'), f = el.getAttribute('data-f');
  if (kind === 'notiz') { if (S.notiz) { S.notiz.text = String(el.value).slice(0, AW.NOTIZ_MAX); const z = document.querySelector('#nz-zahl span'); if (z) z.textContent = S.notiz.text.length; } return; }
  if (kind === 'gsuche') return glossFiltern(el.value);
  if (kind === 'mess') return messInput(el.value);
  if (kind === 'k') { const k = kauf(); k[f] = el.value; if (k.err && k.err[f]) { delete k.err[f]; const box = el.closest('.kf'); if (box) { box.classList.remove('bad'); const sm = box.querySelector('small'); if (sm) sm.remove(); } } return; }
  if (kind === 'kc') { const k = kauf(); k[f] = el.checked; if (k.err && k.err[f]) { delete k.err[f]; render(); } persist(); return; }
  if (kind === 's') { const z = S.sichern; if (!z) return; z[f] = el.value; if (z.err && z.err[f]) { delete z.err[f]; const box = el.closest('.kf'); if (box) { box.classList.remove('bad'); const sm = box.querySelector('small'); if (sm) sm.remove(); } } return; }
  if (kind === 'sc') { const z = S.sichern; if (!z) return; z[f] = el.checked; if (z.err && z.err[f]) { delete z.err[f]; render(); } return; }
  if (kind === 'teil') { teilPfosten(S.win, +f, parseFloat(el.value)); teilLive(el); if (ev.type === 'change') render(); return; } // Aufteilung: Regler
  if (kind === 'rest') return restInput(el.value);
  if (kind === 'farbe') { S.win[f] = String(el.value).slice(0, 60); if (f === 'wunschI' && S.win.wunschI.trim()) S.win.gleich = false; if (S.win[f].trim()) { offenMerken(S.win, f); entschieden(S.win, f); } else offenZurueck(S.win, f); farbeLive(el, f); if (ev.type === 'change') nachAenderung(); return; }
  if (kind === 'plan') { if (ev.type !== 'change') return; planMasse(S.win, f, String(el.value).replace(/\D/g, '')); return nachAenderung(); }
  /* Name des Fensters: bei jedem Tastendruck übernehmen, ohne neu zu zeichnen. So geht das Tippen auf „Weiter“ direkt nach der
     Eingabe nicht verloren (ein Neuzeichnen beim Verlassen des Felds würde den Knopf unter dem Finger austauschen). */
  if (kind === 'w' && f === 'name') {
    S.win.name = String(el.value).slice(0, 50);
    const box = el.closest('.trow');
    if (box && S.nameFehler && nameDa(S.win)) { box.classList.remove('bad'); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); const m = box.querySelector('.trow-f'); if (m) m.remove(); }
    return;
  }
  /* Übrige Felder des Fensters und der Angaben: beim Tippen übernehmen (nichts geht verloren, wenn die App zwischendurch neu zeichnet),
     neu gezeichnet wird erst nach dem Verlassen und ohne den Tipp auf den nächsten Knopf zu schlucken (nachAenderung) */
  if (kind === 'w' || kind === 'p') { feldUebernehmen(kind, f, el); if (ev.type === 'change') { if (kind === 'p') persist(); nachAenderung(); } return; }
  if (ev.type !== 'change') return;
  if (kind === 'ohnefoto-zu') { try { if (el.checked) localStorage.setItem(OHNE_FOTO_ZU, '1'); else localStorage.removeItem(OHNE_FOTO_ZU); } catch (e) { /* ohne Speicher */ } return; }
  if (kind === 'photo') { S.ohneFotoFrage = false; S.fotoGross = null; return onPhoto(f, el.files && el.files[0]); }
}
/* Tipp auf einen Knopf, während ein Feld noch den Fokus hat (Safari auf dem iPhone lässt es beim Tipp auf einen Knopf oft fokussiert,
   dann kommt kein „change“): den Wert vorher übernehmen, als hätte das Feld den Fokus abgegeben */
function feldAbschliessen() {
  const el = document.activeElement;
  if (textFeld(el) && /^(w|p|plan|farbe)$/.test(el.getAttribute('data-in') || '')) onInput(el, { type: 'change' });
}
function feldUebernehmen(kind, f, el) {
  if (kind === 'w') { if (NUMF[f]) { const v = parseInt(String(el.value).replace(/\D/g, ''), 10); S.win[f] = isNaN(v) ? '' : Math.min(v, 9999); if (f === 'laib') S.win.e_laib = true; } else S.win[f] = el.value; return; }
  S.proj[f] = f === 'total' ? (Math.min(parseInt(String(el.value).replace(/\D/g, ''), 10) || 0, 999) || '') : f === 'baujahr' ? el.value.replace(/\D/g, '').slice(0, 4) : el.value;
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
    if (window.Buehne3D) window.Buehne3D.an(stage);
    bindW3D(stage, () => { const r = W3DS[stage.id]; return r ? Object.assign({}, r.o, { onSash: r.o.selectable ? (i) => { if (S.screen === 'frage') onSashTap(i); else if (S.screen === 'tour') { S.selSash = i; S.openSash = i; render(); nachBild(() => { if (S.screen === 'tour') oeffnungZeigen(i); }, 60); } else { S.selSash = i; S.selBar = null; render(); } } : null }) : {}; });
  });
  document.querySelectorAll('.w3d-stage').forEach(bindRails);
  if (S.screen === 'start') startWischen();
  bindZeichnen();
  bindFotoZoom();
  if (S.screen === 'tour') tourSperren();
}
function relayoutAll() { document.querySelectorAll('.w3d-stage').forEach((stage) => { const reg = W3DS[stage.id]; if (reg) w3dLayout(stage, reg.w, reg.o); }); zeichnenLayout(); }
/* ---------- Führung: ausprobieren, ohne eigene Maße ----------
   Start über „Führung starten“ auf der Startseite der App oder über #fuehrung (Startseite des Portals).
   Die Führung arbeitet an einer Kopie: Fenster, Fotos und Auswahl werden beim Start beiseitegelegt und beim Beenden
   zurückgelegt, das eigene Projekt bleibt unberührt und wird nie gespeichert. Maße sind vorgegeben, einige Optionen
   tragen ein Schloss; Antippen erklärt kurz, warum. Je Schritt ein Fakt mit Quelle (Belege: docs/GESTALTUNG.md, Führung). */
const TOUR = ['start', 'fotos', 'messen', 'oeffnung', 'material', 'farbe', 'glas', 'sonne', 'blatt'];
const TOUR_NAME = { start: 'Element', fotos: 'Fotos', messen: 'Messen', oeffnung: 'Öffnung', material: 'Material', farbe: 'Farbe', glas: 'Glas', sonne: 'Sonnenschutz', blatt: 'Aufmaßblatt' };
const TOUR_MASS = { fenster: [1230, 1410, 620], balkon: [1010, 2180, 0], fest: [1800, 1400, 620], hst: [2600, 2200, 0], psk: [2000, 2180, 0], fsw: [3600, 2200, 0] };
/* Gesperrt je Schritt: Aktion → Werte. Das Übliche bleibt frei, gesperrt ist, was ein Fenster individuell macht. */
const TOUR_SPERRE = {
  start: { situation: ['neu'] },
  oeffnung: { teilung: ['3'], felder: ['3', '4'], hst: ['A3', 'D'], fsw: ['2', '6', '7'] },
  material: { setw: ['holzalu', 'alu'] },
  farbe: { color: ['9001', '7035', '7012', '8022', '6005', '5011', '3005', 'nuss', 'mahag'] },
  glas: { glasfn: ['schall', 'sonne'] },
  sonne: { sart: ['behalten', 'screen'], setw: ['hellgrau', 'braun', 'bronze', 'schwarz'] }
};
/* Gut zu wissen: z = Zahl, t = Satz dazu, mit = was das mit eeziframes heißt, q = Quelle (Langfassung mit Link in der Doku) */
const TOUR_FAKT = {
  start: { z: '2 bis 3', t: 'vergleichbare Angebote rät die Verbraucherzentrale vor einem Fenstertausch einzuholen.', mit: 'Du misst einmal und schickst dasselbe Aufmaßblatt an jeden Betrieb. So werden die Angebote vergleichbar.', q: 'Verbraucherzentrale NRW, Broschüre „Fenster“, 02/2025' },
  fotos: { z: '36 %', t: 'der Eigentümer finden es schwer, passende Handwerker zu finden.', mit: 'Mit Fotos, Maßen und Wünschen ist deine Anfrage für jeden Betrieb sofort kalkulierbar.', q: 'ImmoScout24, Umfrage unter 501 Eigentümern, 08/2025' },
  messen: { z: '9,9 Wochen', t: 'reichen die Aufträge im Ausbauhandwerk im Schnitt, zu dem Glaser, Tischler und Rollladenbauer gehören.', mit: 'Mit deinem Aufmaß rechnet ein Betrieb das erste Angebot ohne Termin vor Ort. Gemessen wird bei dir, wann es dir passt.', q: 'ZDH-Konjunkturbericht 1/2026' },
  oeffnung: { z: 'Mehr als 1/3', t: 'der Fenster getauscht? Dann ist nach DIN 1946-6 ein Lüftungskonzept erforderlich.', mit: 'eeziframes zählt mit und vermerkt es auf dem Aufmaßblatt, damit dein Fensterbauer es gleich einplant.', q: 'Energie-Fachberater, „Wann braucht man ein Lüftungskonzept bei der Sanierung?“' },
  material: { z: '598 bis 1.153 €', t: 'kostete ein 3-fach verglastes Fenster (1,3 × 1,3 m) mit Montage im Schnitt, von Kunststoff bis Aluminium, inklusive Mehrwertsteuer, Stand Herbst 2023.', mit: 'Du legst das Material fest, jeder Betrieb kalkuliert dasselbe.', q: 'VFF und Bundesverband Flachglas, Studie 01/2024' },
  farbe: { z: '87 %', t: 'der Handwerksbetriebe sagen: Kunden erwarten individuelle Angebote.', mit: 'Farbe nach RAL oder Dekor, Glas, Griff: Dein Fensterbauer weiß genau, was er anbieten soll.', q: 'Bitkom, Studie Digitalisierung des Handwerks, 01/2026' },
  glas: { z: '10 bis 20 %', t: 'Heizkosten sparen neue Fenster typischerweise; 3-fach-Glas statt alter Isolierverglasung lässt bis zu 60 % weniger Wärme durchs Fenster.', mit: 'Das Glas wählst du am Modell, mit dem U-Wert erklärt. Es steht genau so im Aufmaß.', q: 'Verbraucherzentrale Energieberatung, „Fenstertausch“, 03/2026' },
  sonne: { z: '15 %', t: 'Zuschuss zahlt das BAFA für neue Fenster; ein Energieeffizienz-Experte muss den Antrag begleiten.', mit: 'Im eigenen Aufmaß gibst du an, dass du Förderung nutzen willst. Dein Fensterbauer klärt die Voraussetzungen.', q: 'BAFA, BEG Einzelmaßnahmen, Stand 10/2026' },
  blatt: { z: '68 %', t: 'der Handwerksbetriebe verschicken Angebote schon digital.', mit: 'Dein Aufmaß kommt als PDF mit Code: Ein Betrieb mit eeziframes übernimmt es mit einem Klick, jeder andere liest es wie ein Aufmaßblatt vom Termin.', q: 'Bitkom, Studie Digitalisierung des Handwerks, 01/2026' }
};
const LOCK_S = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor"></rect><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"></path></svg>';
const KI_OK = '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const tourArtTuer = (art) => art === 'hst' || art === 'fsw' || art === 'balkon' || art === 'psk';
/* Das Element der Führung: plausible Maße je Art, alle acht Handmaße da, eine Farbe, die im Modell gut zu sehen ist */
function tourWin(art) {
  const m = TOUR_MASS[art] || TOUR_MASS.fenster, oH = m[1] + 70, oW = m[0] + 140;
  const w = Object.assign(baseWin(), { name: tourArtTuer(art) ? 'Terrasse' : 'Wohnzimmer', w: m[0], h: m[1], mo: { hm: oH, hl: oH, hr: oH, wm: oW, wt: oW, wb: oW }, el: { w: m[0], h: m[1] }, bru: m[2], laib: 150, fotos: 2, e_material: true, fa: '7016', fi: '9016', fbi: 'werzalit', quelle: 'fuehrung' });
  artSetzen(w, art); w.e_teilung = true;
  return w;
}
function tourStart() {
  if (S.betrieb) return;
  if (S.tour) return go('tour');
  S.tour = { i: 0, von: S.screen && S.screen !== 'tour' ? S.screen : 'home', alt: { win: S.win, editIdx: S.editIdx, photos: S.photos, ai: S.ai, selSash: S.selSash, openSash: S.openSash, selBar: S.selBar, side: S.side }, mess: null };
  S.tour.fotoP = Promise.all([demoPhotoUrl('in'), demoPhotoUrl('out')]);
  S.win = tourWin('fenster'); S.editIdx = -1; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.selSash = 0; S.openSash = -1; S.selBar = null;
  go('tour');
}
function tourStopp() { const t = S.tour; if (t) clearTimeout(t.timer); }
/* weiter = danach gleich ein eigenes Fenster; still = ohne neu zu zeichnen (der Aufrufer übernimmt) */
function tourEnde(weiter, still) {
  const t = S.tour; if (!t) return;
  tourStopp();
  Object.assign(S, t.alt); S.tour = null; S.gloss = null; S.glossIndex = false;
  if (location.hash === '#fuehrung') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ } }
  if (still) return;
  if (weiter) return act('new', document.body);
  go(SCREENS[t.von] && t.von !== 'tour' ? t.von : 'home', 'back');
}
function tourGehe(i) {
  const t = S.tour; if (!t) return;
  tourStopp();
  if (i < 0) return tourEnde();
  if (i >= TOUR.length) return tourEnde(true);
  const vor = t.i, id = TOUR[i]; t.i = i;
  S.openSash = -1; S.selBar = null; S.gloss = null; S.glossIndex = false;
  if (id === 'messen') t.mess = { k: 0, cur: '', fertig: !!t.messGesehen || ruhig() };
  /* Beim ersten Besuch steht der Raffstore schon da, mit Farbe: so ist zu sehen, was die Wahl bewirkt */
  if (id === 'sonne' && !t.sonne) { t.sonne = 1; if (S.win.sart === 'keiner') Object.assign(S.win, { sart: 'raffstore', roll: 'aufsatz', sfarbe: 'anthrazit' }); }
  if (id === 'blatt') blattSchrift();
  S.dir = i < vor ? 'back' : 'fwd';
  render(true);
  if (id === 'fotos') tourFotos();
  if (id === 'messen' && !t.mess.fertig) nachBild(tourMessen, 450);
  if (id === 'oeffnung') nachBild(tourVorfuehren, 320);
}
/* Fotos: die Beispielbilder, dann liest die KI (nachgestellt, mit festen Ergebnissen) */
function tourFotos() {
  const t = S.tour; if (!t || t.fotoLauf) return; t.fotoLauf = 1;
  t.fotoP.then((u) => {
    if (S.tour !== t) return;
    S.photos = { in: { url: u[0], file: null, w: 1200, h: 1400, demo: true }, out: { url: u[1], file: null, w: 1200, h: 1400, demo: true } };
    S.ai = { in: { status: 'running' }, out: { status: 'running' } };
    if (S.screen === 'tour') render();
    setTimeout(() => {
      if (S.tour !== t) return;
      S.ai = { in: Object.assign({ status: 'done' }, AI.DEMO.in), out: Object.assign({ status: 'done' }, AI.DEMO.out) }; mergeKI();
      if (S.screen === 'tour') render();
    }, ruhig() ? 0 : 1600);
  });
}
/* Messen: die vier Maße tippen sich selbst ein, Maßlinie für Maßlinie; die Tasten sind gesperrt */
function tourMessen() {
  const t = S.tour; if (!t || TOUR[t.i] !== 'messen' || !t.mess || t.mess.fertig) return;
  const m = t.mess;
  const schritt = () => {
    if (S.tour !== t || TOUR[t.i] !== 'messen' || S.screen !== 'tour') return;
    const st = MESS[m.k];
    if (!st) { m.fertig = true; t.messGesehen = true; S._feier = 'masse'; return render(); }
    const ziel = String(st.who === 'mo' ? num(S.win.mo[st.k]) : num(S.win.el[st.k]));
    if (m.cur.length < ziel.length) {
      m.cur = ziel.slice(0, m.cur.length + 1); setNum('tour-num', m.cur);
      const r = W3DS.w3d, stg = document.getElementById('w3d'); if (r && r.o.feld && stg) { r.o.feld = { v: m.cur, ph: r.o.feld.ph }; w3dLayout(stg, r.w, r.o); }
      t.timer = setTimeout(schritt, 115); return;
    }
    t.timer = setTimeout(() => { m.k++; m.cur = ''; if (MESS[m.k]) render(); t.timer = setTimeout(schritt, 240); }, 620);
  };
  schritt();
}
function tourVorfuehren() {
  const t = S.tour; if (!t || TOUR[t.i] !== 'oeffnung') return;
  const art = S.win.art || 'fenster';
  if (art === 'hst' || art === 'fsw' || art === 'psk') tuerZeigen(); else oeffnungZeigen(Math.min(S.selSash, S.win.sashes.length - 1));
}
function tourSchloss() { toast('In der Führung gesperrt. Im eigenen Aufmaß wählst du frei.'); }
/* Gesperrtes kennzeichnen: grau, mit Schloss, für Screenreader benannt; das Eingabefeld für eigene Farben ist aus */
function tourSperren() {
  const t = S.tour, scr = document.querySelector('.scr[data-screen="tour"]'); if (!t || !scr) return;
  const sp = TOUR_SPERRE[TOUR[t.i]] || {};
  scr.querySelectorAll('[data-act]').forEach((el) => {
    const a = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    if (!sp[a] || sp[a].indexOf(v) < 0 || el.classList.contains('gesperrt')) return;
    el.classList.add('gesperrt'); el.setAttribute('aria-disabled', 'true'); el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', (el.getAttribute('aria-label') || el.textContent.replace(/\s+/g, ' ').trim()) + ', in der Führung gesperrt');
    el.insertAdjacentHTML('beforeend', '<span class="schloss" aria-hidden="true">' + LOCK_S + '</span>');
  });
  scr.querySelectorAll('.farbfeld').forEach((box) => {
    const inp = box.querySelector('input'); if (!inp || inp.disabled) return;
    inp.disabled = true; inp.value = ''; inp.placeholder = 'Eigene Farbe: im eigenen Aufmaß frei'; inp.setAttribute('aria-label', 'Eigene Farbe, in der Führung gesperrt');
    box.classList.add('gesperrt'); box.querySelector('.ff-tupf').innerHTML = LOCK_S;
  });
  scr.querySelectorAll('.tour-sperre .keypad button').forEach((b) => { b.disabled = true; b.tabIndex = -1; });
}
/* Gut zu wissen: eine Zahl, ein Satz, was das mit eeziframes heißt, die Quelle */
function tourFakt(id) {
  const f = TOUR_FAKT[id]; if (!f) return '';
  return '<aside class="tour-fakt" aria-label="Gut zu wissen"><p class="eyebrow">Gut zu wissen</p><p class="tf-satz"><b>' + esc(f.z) + '</b> ' + esc(f.t).replace(/ %/g, '&nbsp;%') + '</p><p class="tf-mit"><span>Mit eeziframes:</span> ' + esc(f.mit).replace(/ %/g, '&nbsp;%') + '</p><p class="tf-q">Quelle: ' + esc(f.q) + '</p></aside>';
}
/* Kleine Zeichnung fürs Vorschaublatt: Ansicht von innen, Breite × Höhe in mm */
function tourZeichnung(w) {
  const d = derive(w), a = (d.elW || 1) / (d.elH || 1), mw = 54, mh = 46, bw = a >= mw / mh ? mw : mh * a, bh = a >= mw / mh ? mw / a : mh, bx = 30 + (mw - bw) / 2, by = 6 + (mh - bh) / 2;
  const fc = rahmenFarbe(w, 'innen').solid, ink = '#1d1d1f';
  const vk = n1(bx - 8), hy = n1(by + bh + 9);
  return '<svg viewBox="0 0 100 70" aria-hidden="true">' + svgPaths(winIco(w, bx, by, bw, bh, fc)) +
    '<path d="M' + vk + ' ' + n1(by) + 'V' + n1(by + bh) + 'M' + n1(bx - 10) + ' ' + n1(by) + 'H' + n1(bx - 6) + 'M' + n1(bx - 10) + ' ' + n1(by + bh) + 'H' + n1(bx - 6) + '" stroke="' + ink + '" stroke-width=".5" fill="none"></path>' +
    '<path d="M' + n1(bx) + ' ' + hy + 'H' + n1(bx + bw) + 'M' + n1(bx) + ' ' + n1(by + bh + 7) + 'V' + n1(by + bh + 11) + 'M' + n1(bx + bw) + ' ' + n1(by + bh + 7) + 'V' + n1(by + bh + 11) + '" stroke="' + ink + '" stroke-width=".5" fill="none"></path>' +
    '<text x="' + n1(bx + bw / 2) + '" y="' + n1(by + bh + 7.6) + '" text-anchor="middle" font-size="4.6" font-weight="800" fill="' + ink + '">' + thousand(d.elW) + '</text>' +
    '<text x="' + vk + '" y="' + n1(by + bh / 2) + '" text-anchor="middle" font-size="4.6" font-weight="800" fill="' + ink + '" transform="rotate(-90 ' + n1(bx - 9.6) + ' ' + n1(by + bh / 2) + ')">' + thousand(d.elH) + '</text></svg>';
}
/* Das Aufmaßblatt in klein: Seite 1 so aufgebaut wie die PDF (Weg, Eckdaten, Box für den Fensterbauer, Position 1), Seite 2 dahinter */
function tourBlatt() {
  const w = S.win, ok = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7.4l2.6 2.6 5.4-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  const weg = [['Fotos', 1], ['Maße', 1], ['Wünsche', 1], ['Blatt', 1], ['Senden', 0]];
  return '<div class="tb" role="img" aria-label="Vorschau: Seite 1 des Aufmaßblatts. Oben der Weg, vier von fünf Schritten erledigt, daneben die Box für den Fensterbauer, darunter beginnt Position 1 mit Zeichnung. Dahinter Seite 2.">' +
    '<div class="tb-stapel"><div class="tb-blatt tb-hinten" aria-hidden="true"></div><div class="tb-blatt" aria-hidden="true">' +
    '<div class="tb-band">' + LOGO(18) + WM() + '<span>AM-BEISPIEL</span></div><div class="tb-in">' +
    '<p class="tb-eb">Dein Fenster-Aufmaß</p><p class="tb-t">Familie Muster.</p>' +
    '<p class="tb-eb">Dein Weg · 4 von 5 erledigt</p><ol class="tb-weg">' + weg.map((s) => '<li class="' + (s[1] ? 'ok' : 'jetzt') + '"><i>' + (s[1] ? ok : '') + '</i><span>' + s[0] + '</span></li>').join('') + '</ol>' +
    '<div class="tb-boxen"><div class="tb-box"><p class="tb-eb">Eckdaten</p><p>Einfamilienhaus</p><p>Förderung gewünscht</p></div><div class="tb-box tb-fb"><p class="tb-eb">Für den Fensterbauer</p><p>Maße in mm</p><p>Code auf Seite 2</p></div></div>' +
    '<div class="tb-pos"><p class="tb-eb">Pos. 1 · ' + esc(w.name || 'Fenster') + '</p><div class="tb-zeich">' + tourZeichnung(w) + '</div><p class="tb-m">' + esc(lab('art', w.art || 'fenster') + ' · ' + lab('material', w.material) + ' · ' + rahmenFarbe(w, 'aussen').name) + '</p></div>' +
    '</div><span class="tb-stempel">Beispiel</span></div></div></div>';
}
SCREENS.tour = () => {
  const t = S.tour; if (!t) return SCREENS.home();
  const id = TOUR[t.i], n = TOUR.length, w = S.win, art = w.art || 'fenster', letzte = t.i === n - 1;
  const kopf = (titel, sub) => hd('Führung · ' + (t.i + 1) + ' von ' + n + ' · ' + TOUR_NAME[id], titel, sub, 'compact');
  const modell = (o) => model(w, Object.assign({ id: 'w3d', view: 'inside', sway: true, stageH: 270, fitW: 0.66, fitH: 0.72 }, o));
  let html = '';
  if (id === 'start') {
    const o = OPT.art.find((x) => x.k === art) || OPT.art[0];
    html = kopf('Was möchtest du planen?', 'Such dir ein Element aus. Die Maße sind vorgegeben, manches ist gesperrt: So siehst du in zwei Minuten jeden Schritt.') +
      modell({ view: 'three', stageH: 250, fitW: 0.76, fitH: 0.7, hint: o.label + (tourArtTuer(art) ? ' · bodentief' : '') }) +
      '<div class="qpanel"><div class="qcards quad" role="group" aria-label="Element">' + OPT.art.map((x) => '<div class="qo"><button type="button" class="qopt" data-act="tour-art" data-v="' + x.k + '" aria-pressed="' + (x.k === art) + '">' + svgIcon(ICO.art(x.k), 44) + '<span class="tx"><span class="lbl">' + esc(x.label) + '</span><span class="sb">' + esc(x.sub) + '</span></span></button></div>').join('') + '</div>' +
      auswahl(OPT.situation, 'data-act="situation"', (x) => x.k === 'ersatz') + '</div>';
  } else if (id === 'fotos') {
    const kachel = (k, label) => { const p = S.photos[k], a = S.ai[k]; return '<div class="tile">' + (p ? '<img src="' + p.url + '" alt="' + label + ', Beispielfoto">' : '<span class="empty"><span class="spin dark"></span>' + label + '</span>') + (a && a.status === 'running' ? '<span class="ai-scan" data-lottie="fotos" data-loop="1" aria-hidden="true"></span><span class="ai"><span class="spin"></span>KI liest</span>' : a && a.status === 'done' ? '<span class="ai">' + KI_OK + 'KI fertig</span>' : '') + (p ? '<span class="tag">' + CHECK + esc(label) + '</span>' : '') + '</div>'; };
    const ki = w.ki && w.ki.chips && w.ki.chips.length && S.ai.in && S.ai.in.status === 'done';
    html = kopf('Zwei Fotos, die KI liest mit.', 'Einmal innen, einmal außen. Die KI liest die Einbausituation: Rollladenkasten, Anschlag, Laibung, Fensterbänke, Fassade. Hier mit Beispielfotos, die Kamera bleibt aus.') +
      '<div class="tiles">' + kachel('in', 'Von innen') + kachel('out', 'Von außen') + '</div>' +
      (ki ? '<div class="teaser"><p class="eyebrow">Aus den Fotos gelesen · ' + kiAnzahl(w.ki) + ' fürs Aufmaßblatt</p><div class="chips">' + w.ki.chips.map((c) => '<span class="chip">' + esc(c) + '</span>').join('') + '</div></div>'
        : '<div class="teaser"><p class="eyebrow">Aus den Fotos</p><p class="sub" style="display: flex; align-items: center; gap: 10px"><span class="spin dark"></span>Die KI liest die Einbausituation.</p></div>');
  } else if (id === 'messen') {
    const m = t.mess || (t.mess = { k: 0, cur: '', fertig: true }), d = derive(w);
    if (m.fertig) {
      html = kopf('Vier Maße, das Modell wächst mit.', 'So misst du später selbst, Schritt für Schritt erklärt. In der Führung sind die Werte vorgegeben.') +
        modell({ view: 'three', dims: ['hm', 'wm', 'eh', 'ew'], labels: messLabels(), cls: 'dims-all', hint: 'Orange: Maueröffnung · Blau: ' + elName() }) +
        '<div class="mess-in"><p class="eyebrow" style="color: var(--ok)">Alle Maße da</p><div class="done-list"><div><small>Öffnung Breite</small><b>' + thousand(d.moW) + ' mm</b></div><div><small>Öffnung Höhe</small><b>' + thousand(d.moH) + ' mm</b></div><div><small>' + esc(artName(w)) + ' Breite</small><b>' + thousand(d.elW) + ' mm</b></div><div><small>' + esc(artName(w)) + ' Höhe</small><b>' + thousand(d.elH) + ' mm</b></div></div>' +
        '<div class="msg ok">' + CHECK + '<span>Danach misst du die Ränder der Öffnung. Von drei Breiten und drei Höhen zählt das kleinste Maß, wie beim Fensterbauer.</span></div></div>' +
        '<div class="qrow"><button type="button" class="chip" data-act="tour-nochmal">Nochmal zeigen</button></div>';
    } else {
      const st = MESS[m.k], k = dimKey(st), labels = messLabels();
      html = kopf('Maß ' + (m.k + 1) + ' von 4 · ' + (st.who === 'mo' ? 'Maueröffnung' : elName()), 'Zollstock anlegen, Zahl eintippen, das Modell zieht die Maßlinie. Hier tippt sich das Maß selbst ein.') +
        modell({ view: 'three', showEl: m.k >= 1, dims: [k], active: k, labels: labels, feld: { v: m.cur, ph: ueblich(st.dir)[2] }, enden: endenVon(st), fitW: 0.6, fitH: 0.6, noZoom: true }) +
        '<div class="ask ' + st.who + '"><p class="q"><span>' + esc(tuerText(st.short)) + '</span><span class="badge">' + LOCK_S + 'vorgegeben</span></p><p class="how">' + esc(tuerText(st.text)) + '</p>' + numDisplay(m.cur, 'tour-num') + '</div>' +
        '<div class="tour-sperre">' + keypad('Weiter') + '<button type="button" class="ts-deckel" data-act="tour-schloss"><span>' + LOCK_S + 'Maße sind in der Führung vorgegeben</span></button></div>';
    }
  } else if (id === 'oeffnung') {
    if (art === 'fenster' || art === 'balkon') {
      const i = Math.min(S.selSash, w.sashes.length - 1), x = w.sashes[i], k = w.sashes.length, bt = art === 'balkon';
      html = kopf(k > 1 ? 'Wie öffnet Flügel ' + (i + 1) + '?' : 'Wie soll es aufgehen?', k > 1 ? 'Flügel im Modell antippen, dann die Öffnungsart wählen. Der Flügel zeigt sie sofort.' : 'Öffnungsart wählen, der Flügel zeigt sie sofort.') +
        modell({ selectable: k > 1, selSash: i, openSash: S.openSash, symbols: true, sway: false, hint: k > 1 ? 'Flügel ' + (i + 1) + ' von ' + k + ' · antippen wechselt' : 'Er schwingt so auf' }) +
        '<div class="qpanel">' + auswahl(bt ? [{ k: '1', label: '1 Flügel' }, { k: '2s', label: '2 Flügel' }] : [{ k: '1', label: '1 Flügel' }, { k: '2p', label: '2 Flügel' }, { k: '3', label: '3 Flügel' }], 'data-act="teilung"', (o) => o.k === w.teilung) + qCards({ group: 'typ', opts: bt ? OPT.typ.filter((o) => o.k !== 'K') : null, act: 'sash', f: 't', val: x.t, ico: ICO.typ }) + '</div>';
    } else if (art === 'psk') {
      html = kopf('Wie viele Teile?', 'Der Flügel kippt zum Lüften oder schiebt sich vor das feste Teil. Antippen zeigt, wie sie öffnet.') + modell({ hint: lab('pskSchema', w.psk.schema) + ' · antippen schiebt' }) +
        '<div class="qpanel">' + qCards({ group: 'pskSchema', act: 'psk', f: 'schema', val: w.psk.schema, ico: ICO.psk }) + '</div>';
    } else if (art === 'fest') {
      html = kopf('Wie viele Felder?', 'Große Scheiben werden geteilt, ab etwa 2,5 m² je Feld.') + modell({ hint: w.sashes.length + (w.sashes.length === 1 ? ' Feld' : ' Felder') + ' · fest verglast' }) +
        '<div class="qpanel">' + qCards({ group: 'felder', act: 'felder', val: w.teilung, ico: ICO.felder }) + '</div>';
    } else if (art === 'hst') {
      html = kopf('Welches Schema?', 'Welche Flügel schieben und welche fest stehen. Antippen zeigt, wie sie öffnet.') + modell({ hint: lab('hstSchema', w.hst.schema) + ' · antippen schiebt' }) +
        '<div class="qpanel">' + qCards({ group: 'hstSchema', act: 'hst', f: 'schema', val: w.hst.schema, ico: ICO.hst }) + '</div>';
    } else {
      html = kopf('Wie viele Flügel?', 'Mehr Flügel heißt schmalere Flügel und ein größeres Paket. Antippen faltet sie.') + modell({ hint: w.fsw.n + ' Flügel · ' + lab('fswSchema', w.fsw.schema) }) +
        '<div class="qpanel">' + qChips({ group: 'fswN', act: 'fsw', f: 'n', val: String(w.fsw.n) }) + '</div>';
    }
  } else if (id === 'material') {
    html = kopf('Welches Material?', 'Bestimmt Preis, Pflege und Profilbreite.') + modell({ hint: lab('material', w.material) }) +
      '<div class="qpanel">' + qCards({ group: 'material', act: 'setw', f: 'material', val: w.material, ico: ICO.material }) + '</div>';
  } else if (id === 'farbe') {
    html = kopf('Welche Farbe außen?', 'Nach RAL oder als Holzdekor; im eigenen Aufmaß auch als freie Angabe.') + modell({ view: 'outside', hint: 'Ansicht von außen · ' + rahmenFarbe(w, 'aussen').name }) +
      '<div class="qpanel">' + qColor({ side: 'aussen' }) + '</div>';
  } else if (id === 'glas') {
    html = kopf('Welche Verglasung?', 'Je kleiner der U-Wert, desto weniger Wärme geht verloren.') + modell({ lupe: true, hint: glasText(w) }) +
      '<div class="qpanel">' + qCards({ group: 'glas', act: 'setw', f: 'glas', val: w.glas, ico: ICO.glas }) + qMulti({ group: 'glasfn', act: 'glasfn', vals: w.glasfn }) + '</div>';
  } else if (id === 'sonne') {
    const kasten = w.sart === 'rollladen' || w.sart === 'raffstore';
    html = kopf('Sonnenschutz außen?', 'Rollladen oder Raffstore gleich mitbestellen, in deiner Farbe.') + modell({ view: 'outside', hint: 'Ansicht von außen · ' + lab('sart', w.sart) + (kasten ? ' · ' + sonneName(w) : '') }) +
      '<div class="qpanel">' + qCards({ group: 'sart', act: 'sart', val: w.sart, ico: ICO.sonne }) + (kasten ? qSwatch({ group: 'sfarbe', f: 'sfarbe', val: w.sfarbe }) : '') + '</div>';
  } else {
    const preis = KUNDE_FREI() ? 'Messen, Fotos und das Aufmaßblatt sind kostenlos.' : 'Messen, Fotos und 3-D-Modell sind kostenlos. Das fertige Aufmaßblatt kostet einmalig ' + euro(PREIS()) + (MWST() ? ' inkl. MwSt.' : '') + ', egal an wie viele Fensterbauer es geht.';
    const av = (x) => '<span class="av" aria-hidden="true">' + x + '</span>';
    html = kopf('Fertig. Das war eezi.', 'So sieht dein Aufmaßblatt aus, das an Fensterbauer geht. Seite 1 beginnt schon mit deinem Fenster.') + tourBlatt() +
      '<div class="card tour-senden"><p class="eyebrow">Und dann</p><h2 class="sec-title">An beliebig viele Fensterbauer.</h2><p class="sub">Ein Aufmaß, so viele Angebote, wie du möchtest. Du schickst das Blatt per WhatsApp oder E-Mail. Jeder Betrieb kann es lesen; mit eeziframes übernimmt er alles per Code.</p>' +
      '<ul class="ts-ziele">' + [['A', 'Fensterbauer im Ort'], ['B', 'Empfehlung von Nachbarn'], ['C', 'Betrieb mit eeziframes']].map((x) => '<li>' + av(x[0]) + '<span><b>' + esc(x[1]) + '</b><small>Aufmaßblatt geschickt</small></span>' + CHECK + '</li>').join('') + '<li class="mehr">' + av('+') + '<span><b>So viele, wie du möchtest</b><small>ein Aufmaß, beliebig viele Angebote</small></span></li></ul>' +
      '<p class="sub">' + esc(preis) + '</p><div class="pill-row"><button type="button" class="pill" data-act="tour-pdf">Beispiel als PDF ansehen</button></div></div>';
  }
  html += tourFakt(id);
  return { html: html, back: ['Beenden', 'tour-ende'], cls: 'tour', bar: { label: letzte ? 'Eigenes Fenster ausmessen' : 'Weiter', act: letzte ? 'tour-eigen' : 'tour-weiter', sec: t.i ? 'Zurück' : null, secAct: 'tour-zurueck' } };
};
/* Die echte PDF fürs Beispiel: Wasserzeichen „Beispiel“, ohne Aufmaß-Code */
async function tourPDF() {
  if (!S.tour) return;
  if (!window.Blatt) return toast('Die PDF lädt noch, gleich noch einmal.');
  await blattSchrift();
  const pdf = window.Blatt.pdf({ variante: 'kunde', beispiel: true, fenster: [S.win], projekt: Object.assign({}, PROJ0, { name: 'Familie Muster', ort: '12345 Musterstadt', total: 9, foerd: true, foerdweg: 'bafa' }), code: '', portalUrl: PORTAL_URL, portalKurz: PORTAL_KURZ, appKurz: PORTAL_KURZ + '/app/', qr: window.qrcode, h: BLATT_H });
  if (!pdf) return toast('Die PDF lässt sich hier gerade nicht erzeugen.');
  return dateiSpeichern(pdf, 'eeziframes-Beispiel-Aufmass.pdf');
}
/* Eine fertige Datei weitergeben: über die Downloads-Schnittstelle der Vorschau, sonst als Download im Browser */
async function dateiSpeichern(data, name) {
  if (!DL && DLP) await DLP;
  if (DL) { try { await DL.save({ filename: name, data: data }); toast('Gespeichert'); return true; } catch (e) { if (!(e && e.code === 'declined')) toast('Speichern hat nicht geklappt'); return false; } }
  if (window.claude) { toast('Speichern ist in dieser Ansicht nicht möglich'); return false; }
  try { const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Download gestartet'); return true; }
  catch (e) { toast('Speichern geht hier nicht'); return false; }
}
function boot() {
  LINK_TOKEN = tokenAusAdresse(); // Anmeldelink: Schlüssel gleich aus Adresse und Verlauf nehmen, verarbeitet wird er in serverStart
  /* Einstieg von der Website (#ausmessen): den Anker gleich aus der Adresse nehmen, bevor verlaufBinden die Falle stellt (sonst bliebe er im Verlauf und jeder Neuladen begänne wieder ein Fenster) */
  const ausmessen = location.hash === '#ausmessen';
  if (ausmessen) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ } }
  restore();
  S.betrieb = readHash();
  /* Instanz: ohne #k-… die laufende Planung dieses Geräts (oder noch keine, dann kommt der Code beim ersten Fenster) */
  if (INST && S.betrieb && !S.betrieb.name) S.betrieb.name = INST.name || '';
  if (INST && !S.betrieb) S.betrieb = instanzBetrieb(instLesen('aktiv'));
  vorschauPruefen(S.betrieb);
  if (S.betrieb) loadLink();
  window.addEventListener('hashchange', () => {
    if (/access_token=|error_description=/.test(location.hash || '')) { const t = tokenAusAdresse(); if (t && kontoBereit()) kontoAusLink(t); else if (t) toast('Die Anmeldung ist hier gerade nicht möglich.'); return; } // Anmeldelink im offenen Tab
    const fuehrung = location.hash === '#fuehrung';
    if (S.tour && !fuehrung) tourEnde(false, true);
    const b = readHash(), was = S.betrieb ? S.betrieb.code : '', now = b ? b.code : '';
    if (was === now) { const neueRunde = !!(b && S.betrieb && (b.runde || 1) !== (S.betrieb.runde || 1)); if (b) S.betrieb = INST ? Object.assign(b, { name: b.name || S.betrieb.name, website: !!S.betrieb.website }) : b; if (neueRunde) { loadLink(); S.screen = 'home'; render(true); if (SERVER.daten) linkPruefen(); return; } if (fuehrung) return tourStart(); return render(); } // andere Runde (Nachbesserungs-Link im selben Tab): neu laden
    if (INST && b && !b.name) b.name = INST.name || '';
    S.betrieb = b || (INST ? instanzBetrieb(instLesen('aktiv')) : null); vorschauPruefen(S.betrieb); if (S.betrieb) loadLink(); else { KS = kontoLesen(); loadOwn(); } S.screen = 'home'; render(true); // Instanz: nie das eigene Aufmaß
    if (S.betrieb && S.betrieb.code && SERVER.daten) linkPruefen();
    if (fuehrung) tourStart();
  });
  const root = $app();
  root.addEventListener('click', (e) => { const el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el || el.disabled) return; const name = el.getAttribute('data-act'); if (name === 'none') return; if (el.tagName !== 'A') e.preventDefault(); feldAbschliessen(); tippen(name, el); act(name, el); dockNachruecken(el, name); });
  /* Erster Tipp zählt (siehe nachAenderung): solange Maus oder Finger unten sind, wartet das Neuzeichnen nach einem Feld */
  document.addEventListener('mousedown', () => { DRUCK = Date.now(); }, true);
  document.addEventListener('mouseup', () => { if (DRUCK) setTimeout(() => { DRUCK = 0; nachzeichnen(); }, 0); }, true);
  root.addEventListener('focusout', () => { if (NACHZEICHNEN) { clearTimeout(nachzeichnenTimer); nachzeichnenTimer = setTimeout(nachzeichnen, 0); } });
  /* ✕ an der eigenen Farbe: den Fokus im Feld lassen, sonst baut das „change“ beim Verlassen die Seite neu und der Tipp geht ins Leere */
  root.addEventListener('mousedown', (e) => { if (e.target.closest && e.target.closest('.ff-x')) e.preventDefault(); });
  root.addEventListener('input', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
  root.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (e.defaultPrevented || escTaste())) { e.preventDefault(); return; } // schon erledigt (KI-Einwilligung, Farbblatt): nicht noch ein Blatt darunter schließen
    /* Tab bleibt im offenen Blatt (das Farbblatt hat seine eigene Falle) */
    if (e.key === 'Tab' && !FB.el) { const sh = $app().querySelector('.sheet[aria-modal="true"]'), z = sh ? fokusZiele(sh) : []; if (z.length) { const i = z.indexOf(document.activeElement); if (e.shiftKey ? i <= 0 : (i < 0 || i === z.length - 1)) { e.preventDefault(); (e.shiftKey ? z[z.length - 1] : z[0]).focus(); } } return; }
    if (S.notiz || S.gloss || S.glossIndex || S.wohin || S.verlassen || S.fotoGross) return;
    if (S.screen !== 'messen' && S.screen !== 'rest' && !(S.screen === 'frage' && S.qMass)) return;
    const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^\d$/.test(e.key)) { e.preventDefault(); keyIn(e.key); } else if (e.key === 'Backspace') { e.preventDefault(); keyIn('del'); } else if (e.key === 'Enter') { e.preventDefault(); keyIn('ok'); }
  });
  window.addEventListener('resize', relayoutAll);
  verlaufBinden(); // Zurück-Taste des Browsers bleibt in der App
  render(true);
  if (location.hash === '#fuehrung' && !S.betrieb) tourStart();
  /* Einstieg von der Website („Jetzt ausmessen“, /app/#ausmessen): gleich der erste Schritt statt der Startseite der App; ein angefangenes
     Fenster wird fortgesetzt, ein Kundenlink hat Vorrang */
  else if (ausmessen && !S.betrieb) { if (KS) { EINSTIEG_NEU = true; setTimeout(einstiegNach, 8000); } else einstiegNeu(); }
  serverStart();
  AI.init().then((ok) => { S.aiOk = ok; if (S.screen === 'fotos') render(); });
  DLP = (async () => { try { DL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { DL = null; } return DL; })();
}
/* Einstieg #ausmessen: ein angefangenes Fenster wird fortgesetzt, sonst beginnt ein neues. Mit gemerkter Anmeldung (KS) erst, nachdem
   serverStart das Konto geprüft und kontoStart das zuletzt bearbeitete Aufmaß geladen hat (das setzt S.win zurück und würde ein gerade
   begonnenes Fenster verwerfen); kommt der Server nicht, spätestens nach 8 s */
let EINSTIEG_NEU = false;
function einstiegNeu() { EINSTIEG_NEU = false; if (S.betrieb || S.tour) return; if (entwurfLesen()) entwurfFortsetzen(); else act('new', document.body); }
const einstiegNach = () => { if (EINSTIEG_NEU) einstiegNeu(); };
/* ---------- eeziframes im Netz: Pilotphase ohne Server ----------
   Solange kein Backend läuft, zeigt die App nur, was wirklich passiert:
   „Gesendet“ erst mit dem Code, keine Scheinzahlung, die Datei ist kostenlos.
   Schalter: window.KONFIG.pilot in /config.js */
let PILOT = !!(window.KONFIG && window.KONFIG.pilot);
const SERVER = { daten: false, zahlung: false, konten: false, attrappe: false, testmodus: false, preise: null, zahlarten: null, recht: null };
const LOGO = (px) => (window.Logo ? window.Logo.svg(px) : '');
const WM = () => (window.Marke ? window.Marke.wort() : 'eeziframes');
/* Rechtslinks unter jedem Bildschirm (render hängt sie an, wo sie fehlen; Messbildschirme ohne Platz zeigen sie im Glossar-Blatt):
   „Vertrag widerrufen“ zuerst und als Knopf (§ 356a BGB), dazu der Widerruf der KI-Einwilligung, sobald sie erteilt ist (Art. 7 Abs. 3
   DSGVO: so einfach wie die Erteilung) */
function rechtLinks(ohneKz) {
  const C = window.KONFIG || {}, ki = window.FotoKI && window.FotoKI.eingewilligt && window.FotoKI.eingewilligt();
  /* Instanz: Impressum und Datenschutz des Betriebs, KI-Widerruf; kein Vertrag mit dem Endkunden (ohne Widerruf, AGB, Cookies),
     darunter die Kennzeichnung des Pakets (ohneKz: die Seite trägt sie schon) */
  if (INST) return '<div class="foot-links recht inst"><a class="link" href="' + esc(C.impressum || '/impressum/') + '" target="_blank" rel="noopener">Impressum</a><a class="link" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a>' + (ki ? '<button type="button" class="link" data-act="ki-widerrufen">KI-Einwilligung widerrufen</button>' : '') + '</div>' +
    (ohneKz || !window.Einladung ? '' : window.Einladung.kennzeichnung(INST_M.kennzeichnung));
  return '<div class="foot-links recht"><a class="link widerruf" href="/widerruf/" target="_blank" rel="noopener">Vertrag widerrufen</a><a class="link" href="/agb/" target="_blank" rel="noopener">AGB</a><a class="link" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a><a class="link" href="/cookies/" target="_blank" rel="noopener">Cookies</a><a class="link" href="' + esc(C.impressum || '/impressum/') + '" target="_blank" rel="noopener">Impressum</a>' + (ki ? '<button type="button" class="link" data-act="ki-widerrufen">KI-Einwilligung widerrufen</button>' : '') + '</div>';
}
const SEND_IC = '<div class="okmark-l" data-lottie="senden"><span class="lottie-still"><svg class="okmark send" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--accent-soft)"></circle><path d="M17 31l29-12-9 28-7-10z" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linejoin="round"></path><path d="M30 37l16-18" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linecap="round"></path></svg></span></div>';
/* Versand im Kundenlink: der Code geht per WhatsApp oder E-Mail an den Betrieb */
function sendeText() {
  const bn = S.betrieb && S.betrieb.name ? S.betrieb.name : '', n = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0);
  if (!S.betrieb || !PILOT) return 'Hallo ' + (bn || 'zusammen') + ', hier ist mein Übermittlungscode aus eeziframes:\n' + curCode();
  return 'Hallo' + (bn ? ' ' + bn : '') + ', hier ist mein Fenster-Aufmaß aus eeziframes (' + n + ' Fenster). Bitte bei eeziframes unter „Code vom Kunden einfügen“ einsetzen:\n' + curCode();
}
/* ---------- Konfigurator-Instanz: Kopf, Startseite, Kontakt, Bestätigung, PDF-Kopie (Bauplan Strang B) ---------- */
/* Kopf auf der Startseite: Zeichen (Logo oder Initiale) und Name des Betriebs */
function instKopf() {
  const d = lkDaten(), E = window.Einladung;
  return '<span class="hdr-inst">' + (E ? E.zeichen(d.name, d.p, 'klein') : '') + '<span class="hdr-name">' + esc(d.name) + '</span></span>';
}
/* Kontakt auf der Website einer Instanz: Name (mindestens 2 Zeichen) und Telefon (mindestens 6 Ziffern) oder E-Mail, dieselbe Regel
   wie der Server (Instanzregeln.telOk/mailOk, functions/api/konten.js); ein angefangenes, falsches Feld zählt als Fehler */
const telOkI = (t) => String(t || '').replace(/\D/g, '').length >= 6;
const mailOkI = (m) => { const s = String(m || '').trim(); return /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(s) && !/\.invalid$/i.test(s); };
function kontaktPruefen() {
  const p = S.proj || {}, name = String(p.name || '').replace(/\s+/g, ' ').trim(), tel = String(p.tel || '').trim(), mail = String(p.mail || '').trim(), f = {};
  if (name.length < 2) f.name = 'Bitte deinen Namen angeben.';
  if (tel && !telOkI(tel)) f.tel = 'Bitte eine Telefonnummer mit mindestens 6 Ziffern eingeben.';
  if (mail && !mailOkI(mail)) f.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
  if (!f.tel && !f.mail && !telOkI(tel) && !mailOkI(mail)) f.weg = 'Bitte eine Telefonnummer oder E-Mail-Adresse angeben.';
  f.fehlt = !!(f.name || f.tel || f.mail || f.weg);
  return f;
}
/* fehler: Text unter dem Feld; true markiert das Feld nur (der Text steht beim Nachbarfeld, „Telefon oder E-Mail“) */
function kontaktFeld(label, field, ph, mode, auto, fehler, pflicht) {
  const v = S.proj[field], id = 't-' + field;
  if (fehler === true) return '<div class="trow bad"><span>' + esc(label) + '</span><input type="' + (mode === 'email' ? 'email' : mode === 'tel' ? 'tel' : 'text') + '" id="' + id + '" inputmode="' + (mode || 'text') + '" autocomplete="' + auto + '" data-in="p" data-f="' + field + '" value="' + esc(v || '') + '" placeholder="' + esc(ph || '') + '" aria-invalid="true" aria-describedby="t-mail-f"></div>';
  return '<div class="trow' + (fehler ? ' bad' : '') + '"><span>' + esc(label) + (pflicht ? '<i class="pfl" aria-hidden="true"> *</i>' : '') + '</span><input type="' + (mode === 'email' ? 'email' : mode === 'tel' ? 'tel' : 'text') + '" id="' + id + '" inputmode="' + (mode || 'text') + '" autocomplete="' + auto + '" data-in="p" data-f="' + field + '" value="' + esc(v || '') + '" placeholder="' + esc(ph || '') + '"' + (fehler ? ' aria-invalid="true" aria-describedby="' + id + '-f"' : '') + (pflicht ? ' aria-required="true"' : '') + '>' + (fehler ? '<small class="trow-f" id="' + id + '-f">' + esc(fehler) + '</small>' : '') + '</div>';
}
function instAnfrage3() {
  const pr = S.proj, d = lkDaten(), bn = d.name, C = window.KONFIG || {};
  const f = S.kontaktFehler ? Object.assign(kontaktPruefen(), { alle: true }) : {};
  let html = hd(anfrageHead(3, true), 'Wie erreicht dich ' + esc(bn) + '?', 'Name und Telefon oder E-Mail brauchen wir, damit ' + esc(bn) + ' sich mit dem Angebot melden kann. Deine Angaben gehen nur an ' + esc(bn) + '; mehr dazu im <a class="ulink" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a>.', '', '', schrittTools('kontakt'));
  html += '<div class="sec"><div class="rows kontakt-felder">' + kontaktFeld('Name', 'name', 'Vor- und Nachname', 'text', 'name', f.name, true) + kontaktFeld('Telefon', 'tel', 'Für Rückfragen', 'tel', 'tel', f.tel || !!f.weg, false) + kontaktFeld('E-Mail', 'mail', 'name@beispiel.de', 'email', 'email', f.mail || f.weg, false) + kontaktFeld('PLZ und Ort', 'ort', 'z. B. 50667 Köln', 'text', 'postal-code address-level2', '', false) + '</div>' +
    '<p class="sub kontakt-hinweis">* Pflicht. Dazu Telefon oder E-Mail, eins genügt.</p></div>';
  html += '<div class="sec">' + secHead('Wann am besten erreichbar?', null, 'Freiwillig.') + chips('erreich', pr.erreich, 'erreich', 'setp') + '</div>';
  return { html: html, back: ['Zurück', 'anfrage2'], cls: 'tight', bar: { label: 'Prüfen und senden', act: 'kontakt-weiter', zurueck: true } };
}
/* „Auf anderem Gerät weitermachen“: dieselbe Planung über https://<host>/#k-<code> */
const instWeiterLink = () => location.origin + '/#k-' + (S.betrieb ? S.betrieb.code : '');
function instWeiterKarte(du) {
  const T = (sie, x) => (du ? x : sie), mit = SERVER.daten && S.betrieb && S.betrieb.code && !S.sync.aus;
  let h = '<div class="card merk-karte inst-weiter"><p class="eyebrow">Jederzeit weitermachen</p><p>' + T('Ihre Planung ist auf diesem Gerät gespeichert. Öffnen Sie diese Seite einfach wieder, dann geht es weiter.', 'Deine Planung ist auf diesem Gerät gespeichert. Öffne diese Seite einfach wieder, dann geht es weiter.') + '</p>';
  if (mit) {
    h += '<div class="pill-row"><button type="button" class="pill" data-act="inst-geraet" aria-expanded="' + !!S.instGeraet + '">Auf anderem Gerät weitermachen</button></div>';
    if (S.instGeraet) h += '<div class="inst-link"><input type="text" readonly value="' + esc(instWeiterLink()) + '" aria-label="Link zu dieser Planung"><div class="pill-row"><button type="button" class="pill" data-act="inst-link-kopieren">Link kopieren</button>' + (navigator.share ? '<button type="button" class="pill" data-act="inst-link-teilen">Teilen</button>' : '') + '</div><p class="sub">' + T('Wer diesen Link hat, sieht Ihre Planung. Geben Sie ihn nur an Personen weiter, denen Sie vertrauen.', 'Wer diesen Link hat, sieht deine Planung. Gib ihn nur an Personen weiter, denen du vertraust.') + '</p></div>';
  }
  return h + '</div>';
}
/* Startseite einer Instanz in allen Zuständen (erste Seite, Liste, gesendet, Planung nicht mehr da, Nachbesserung einer Einladung) */
function instHome() {
  const E = window.Einladung, d = lkDaten(), name = d.name, du = d.du, T = (sie, x) => (du ? x : sie), n = S.windows.length, web = instWebsite(), I = instOpt({ ohneKopf: web }), p = d.p;
  const weg = S.instWeg ? noteBox(T('Gerade nicht erreichbar. Ihre Planung bleibt auf diesem Gerät gespeichert; gesendet wird, sobald die Verbindung wieder steht.', 'Gerade nicht erreichbar. Deine Planung bleibt auf diesem Gerät gespeichert; gesendet wird, sobald die Verbindung wieder steht.'), null, 'warn inst-weg') : '';
  const kontakt = () => E.kontakt({ name: name, p: p, du: du, bis: web || S.sent || S.linkZu ? '' : d.bis, instanz: I });
  const pf = '<span class="pf" aria-hidden="true"></span>', ok = '<div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="84" height="84" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>';
  const liste = instGesendetListe();
  if (S.instZu && !S.sent) return instZuSeite();
  if (S.sent) {
    const test = S.sent.art === 'test';
    const html = '<section class="hero lk"><div class="ein-start-in">' + ok + '<p class="eyebrow kicker">' + (test ? 'Testanfrage ' : 'Anfrage ') + esc(S.sent.nr || '') + '</p><h1>' + (S.sent.anderswo ? 'Schon <span class="ak">gesendet</span>.' : 'Danke, <span class="ak">gesendet</span>.') + '</h1>' +
      '<p class="ein-lead">' + esc(name) + T(' hat Ihre Anfrage seit ', ' hat deine Anfrage seit ') + esc(sentWhen()) + T(' und meldet sich bei Ihnen.', ' und meldet sich bei dir.') + '</p>' +
      '<div class="ein-cta"><button type="button" class="btn primary" data-act="inst-weitere">Weitere Anfrage starten' + pf + '</button></div></div></section>' + weg +
      '<section class="card inst-geraet-karte"><p class="eyebrow">Auf diesem Gerät</p><p>' + T('Hier sind nur Nummer und Datum Ihrer Anfrage gespeichert; Maße, Fotos und Kontaktdaten sind von diesem Gerät gelöscht.', 'Hier sind nur Nummer und Datum deiner Anfrage gespeichert; Maße, Fotos und Kontaktdaten sind von diesem Gerät gelöscht.') + '</p><div class="pill-row"><button type="button" class="pill" data-act="inst-vergessen">Auf diesem Gerät vergessen</button></div></section>' +
      kontakt() + rechtLinks();
    return { html: html, bar: null };
  }
  if (S.linkZu && S.linkZu !== 'eingegangen') {
    const html = '<section class="hero lk"><div class="ein-start-in">' + (web ? '' : E.kopf({ name: name, p: p, instanz: I })) + '<p class="eyebrow" style="color: var(--warn)">' + (S.linkZu === 'abgelaufen' ? 'Abgelaufen' : 'Nicht mehr aktiv') + '</p><h1>Hier geht es gerade nicht weiter.</h1><p class="ein-lead">' + esc(S.linkZuText || T('Bitte melden Sie sich bei ', 'Bitte melde dich bei ') + name + '.') + '</p>' +
      '<div class="ein-cta"><button type="button" class="btn primary" data-act="inst-weitere">Neue Planung beginnen' + pf + '</button></div></div></section>' + kontakt() + rechtLinks();
    return { html: html, bar: null };
  }
  if (S.nb) return linkHomeInhaltAlt(I);
  if (n || angelegt() >= GRENZE.fenster) {
    const html = weg + (web ? '' : '<div class="lk-kopf">' + E.kopf({ name: name, p: p, klein: true, unten: d.kunde ? 'für ' + d.kunde : '', instanz: I }) + '</div>') + uebersichtKopf(T) +
      '<section class="sec liste"><div class="liste-in">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' +
      (vorschau() ? '' : web ? instWeiterKarte(du) : linkMerk(name, du)) + kontakt() + rechtLinks();
    return { html: html, bar: n ? { label: 'Weiter zum Absenden', act: 'go', v: 'anfrage' } : null };
  }
  const frueher = web && liste.length ? '<section class="card inst-frueher"><p class="eyebrow">' + T('Ihre Anfragen auf diesem Gerät', 'Deine Anfragen auf diesem Gerät') + '</p><ul class="inst-nr">' + liste.slice(0, 5).map((x) => { let t = ''; try { t = new Date(x.when).toLocaleDateString('de-DE'); } catch (e) { t = ''; } return '<li><b>' + esc((x.test ? 'Testanfrage ' : 'Anfrage ') + x.nr) + '</b><span>' + esc(t ? 'gesendet am ' + t : 'gesendet') + '</span></li>'; }).join('') + '</ul><div class="pill-row"><button type="button" class="pill" data-act="inst-vergessen">Auf diesem Gerät vergessen</button></div></section>' : '';
  const html = weg + E.html({ name: name, kunde: d.kunde, du: du, p: p, bis: web ? '' : d.bis, server: !!SERVER.daten, instanz: I }) + frueher + rechtLinks(true);
  return { html: html, bar: null };
}
/* Die Instanz ist inzwischen pausiert, beendet oder wieder in Vorbereitung (Antwort der API, Status-Matrix §2.7), während die App offen
   ist: wie die Seiten des Servers, in der Marke des Betriebs, mit Kontakt; die Planung bleibt auf dem Gerät */
function instZuPruefen(res, j) {
  if (!INST || !res || !j || (res.status !== 503 && res.status !== 410)) return false;
  const st = String(j.status || '');
  if (['pausiert', 'beendet', 'einrichtung'].indexOf(st) < 0) return false;
  if (S.instZu !== st) { S.instZu = st; if (S.screen !== 'home') go('home', 'back'); else render(); }
  return true;
}
function instZuSeite() {
  const E = window.Einladung, d = lkDaten(), name = d.name, du = d.du, T = (sie, x) => (du ? x : sie), st = S.instZu, n = S.windows.length;
  const t = st === 'pausiert' ? ['Gerade nicht erreichbar', 'Der Fensterplaner ist gerade nicht erreichbar.', esc(name) + T(' nimmt über diese Seite gerade keine Anfragen an. Für Ihre Anfrage erreichen Sie uns direkt.', ' nimmt über diese Seite gerade keine Anfragen an. Für deine Anfrage erreichst du uns direkt.')]
    : st === 'einrichtung' ? ['In Vorbereitung', 'Hier entsteht gerade etwas.', T('Dieser Fensterplaner ist bald für Sie da. Bitte schauen Sie später noch einmal vorbei.', 'Dieser Fensterplaner ist bald für dich da. Bitte schau später noch einmal vorbei.')]
      : ['Nicht mehr verfügbar', 'Diesen Fensterplaner gibt es nicht mehr.', T('Für Ihre Anfrage erreichen Sie ', 'Für deine Anfrage erreichst du ') + esc(name) + ' direkt.'];
  const html = '<section class="hero lk"><div class="ein-start-in"><p class="eyebrow" style="color: var(--warn)">' + t[0] + '</p><h1>' + t[1] + '</h1><p class="ein-lead">' + t[2] + (n ? ' ' + T('Ihre Planung bleibt auf diesem Gerät gespeichert.', 'Deine Planung bleibt auf diesem Gerät gespeichert.') : '') + '</p></div></section>' +
    (E ? E.kontakt({ name: name, p: d.p, du: du, instanz: instOpt() }) : '') + rechtLinks();
  return { html: html, bar: null };
}
/* Bestätigung nach dem Senden: Nummer, „<Name> meldet sich“, Kontaktkarte, „Meine Anfrage als PDF“ (Merkmal kopieKunde), weitere Anfrage,
   vergessen. Verlässt der Kunde sie, bleiben nur Nummer und Datum (render → instanzKuerzen) */
function instGesendet() {
  if (!S.sent || S.sent.kurz) return instHome();
  const E = window.Einladung, d = lkDaten(), name = d.name, du = d.du, T = (sie, x) => (du ? x : sie), test = S.sent.art === 'test', web = instWebsite();
  const ok = '<div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>';
  const html = '<section class="inst-danke"><div class="ein-start-in">' + ok + '<p class="eyebrow kicker">' + (test ? 'Testanfrage ' : 'Anfrage ') + '<span class="inst-nr-wert">' + esc(S.sent.nr || '') + '</span></p><h1>Danke, <span class="ak">gesendet</span>.</h1>' +
      '<p class="ein-lead">' + esc(name) + T(' hat jetzt Ihre Maße, Fotos und Wünsche und meldet sich bei Ihnen.', ' hat jetzt deine Maße, Fotos und Wünsche und meldet sich bei dir.') + '</p></div></section>' +
    (test ? noteBox('Vorschau: Das war eine Testanfrage. Sie geht mit „[Test]“ im Betreff an den Betrieb, zählt nicht mit und ist nach einem Tag gelöscht.', null, 'warn') : '') +
    (INST_M.kopieKunde ? '<section class="card inst-pdf"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">' + T('Für Ihre Unterlagen', 'Für deine Unterlagen') + '</p><b>' + T('Ihre Anfrage als PDF', 'Deine Anfrage als PDF') + '</b><small>' + T('Alle Fenster mit Maßen, Wünschen und Fotos, dazu Ihre Angaben. Nur jetzt: Danach löschen wir die Planung von diesem Gerät.', 'Alle Fenster mit Maßen, Wünschen und Fotos, dazu deine Angaben. Nur jetzt: Danach löschen wir die Planung von diesem Gerät.') + '</small></div></div><div class="pill-row"><button type="button" class="btn primary" data-act="inst-pdf"' + (S.pdfLaeuft ? ' disabled' : '') + '>' + (S.pdfLaeuft ? 'PDF entsteht …' : 'Meine Anfrage als PDF') + '</button></div></section>' : '') +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(name) + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    (E ? E.kontakt({ name: name, p: d.p, du: du, instanz: instOpt({ website: web }) }) : '') +
    '<section class="card inst-geraet-karte"><p class="eyebrow">Auf diesem Gerät</p><p>' + T('Sobald Sie diese Seite verlassen, löschen wir Maße, Fotos und Kontaktdaten von diesem Gerät. Es bleiben nur Nummer und Datum Ihrer Anfrage.', 'Sobald du diese Seite verlässt, löschen wir Maße, Fotos und Kontaktdaten von diesem Gerät. Es bleiben nur Nummer und Datum deiner Anfrage.') + '</p><div class="pill-row"><button type="button" class="pill" data-act="inst-weitere">Weitere Anfrage starten</button><button type="button" class="pill" data-act="inst-vergessen">Auf diesem Gerät vergessen</button></div></section>';
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home', ghost: true } };
}
/* Logo der Instanz fürs PDF: Bild von /marke/<v>/logo.png als Data-URL mit Maßen */
async function logoFuerBlatt(url) {
  try {
    const r = await fetch(url, { cache: 'force-cache' }); if (!r.ok) return null;
    const blob = await r.blob(), data = await blobText(blob);
    if (!/^data:image\/(png|jpeg|webp);base64,/.test(data)) return null;
    const g = await new Promise((fertig) => { const i = new Image(); i.onload = () => fertig({ w: i.naturalWidth, h: i.naturalHeight }); i.onerror = () => fertig(null); i.src = data; });
    return g && g.w > 0 ? { data: data, w: g.w, h: g.h, grund: (lkDaten().p || {}).grund === 'dunkel' ? 'dunkel' : 'hell' } : null;
  } catch (e) { return null; }
}
/* „Meine Anfrage als PDF“: Blatt.pdf in der Variante anfrage (Marke der Instanz, ohne Bestellmaß und Werbung), Kennzeichnung nach Paket */
async function anfragePdf() {
  if (!INST || !S.sent || S.sent.kurz || !INST_M.kopieKunde) return toast('Die Kopie gibt es nur direkt nach dem Senden.');
  if (S.pdfLaeuft) return;
  S.pdfLaeuft = true; render();
  try {
    await blattSchrift();
    const d = lkDaten(), pr = S.proj, fotos = await fotosFuerBlatt(S.windows), logo = INST_M.logo && INST.logo ? await logoFuerBlatt(INST.logo) : null;
    const marke = { name: d.name, host: location.host || INST.host || '' }; if (logo) marke.logo = logo; if (INST_M.farbe && INST.farbe) marke.farbe = INST.farbe;
    const kunde = { name: pr.name || '', kontakt: pr.tel || pr.mail || '', adresse: pr.ort || '', mehr: AW.kundeKontakt({ kontakt: pr.tel || pr.mail || '', aufmass: { proj: pr } }) };
    const pdf = window.Blatt ? window.Blatt.pdf({ variante: 'anfrage', kennzeichnung: INST_M.pdfKennzeichnung || INST_M.kennzeichnung, marke: marke, nr: S.sent.nr || '', sie: !d.du, fenster: S.windows, projekt: pr, kunde: kunde, fotos: fotos, h: BLATT_H }) : null;
    if (!pdf) { toast('Die PDF lässt sich hier gerade nicht erzeugen.'); return; }
    await dateiSpeichern(pdf, 'Anfrage-' + (String(S.sent.nr || '').replace(/[^A-Za-z0-9-]/g, '') || 'Fenster') + '.pdf');
  } catch (e) { toast('Die PDF lässt sich hier gerade nicht erzeugen.'); }
  finally { S.pdfLaeuft = false; render(); }
}
const gesendetOrig = SCREENS.gesendet;
SCREENS.gesendet = () => {
  if (INST && S.betrieb) return instGesendet();
  if (!PILOT) return gesendetOrig();
  const bn = S.betrieb && S.betrieb.name ? S.betrieb.name : '', dat = bn || 'deinem Fensterbauer', nom = bn || 'dein Fensterbauer';
  const text = sendeText();
  const wa = 'https://wa.me/?text=' + encodeURIComponent(text), mail = 'mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(text);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px">' + SEND_IC +
    '<h1 style="margin: 4px 0 0">' + akH('Jetzt abschicken.') + '</h1>' +
    '<p style="margin: 0">Dein Aufmaß ist fertig. Schick es ' + esc(dat) + ' jetzt, am einfachsten per WhatsApp. Erst damit hat ' + esc(nom) + ' deine Maße und Wünsche.</p></div>' +
    /* Kein Code zum Ansehen (Wunsch des Inhabers: keine Gesamtübersicht, nichts zum Abfotografieren): Er steckt nur in der Nachricht,
       die WhatsApp bzw. das E-Mail-Programm fertig vorbereitet. Kopieren nur als Notweg, ohne den Text zu zeigen */
    '<div class="card send-card" style="gap: 12px"><p class="eyebrow">Senden</p><div class="pill-row send-row"><a class="btn primary" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp senden</a><a class="btn ghost" href="' + mail + '">Per E-Mail senden</a></div>' +
    '<div class="pill-row"><button type="button" class="pill" data-act="nachricht-kopieren">Nachricht kopieren</button></div>' +
    '<p class="sub">Pilotphase: eeziframes überträgt dein Aufmaß noch nicht von selbst. Die Nachricht enthält dein Aufmaß als Code für ' + esc(dat) + ', mit allen Maßen, deinen Wünschen und der Auswertung der Fotos; die Fotos selbst sind nicht dabei.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(bn || 'deinem Fensterbauer') + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard();
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home', ghost: true } };
};
/* ---------- Server (Stufe 2): /api/status sagt, was eingerichtet ist ----------
   daten:   Aufmaße gehen direkt an den Betrieb, ohne Code-Umweg; der Link wird beim Öffnen geprüft
   zahlung: das Aufmaßblatt wird über Stripe bezahlt */
async function statusHolen() {
  try { const r = await fetch('/api/status', { headers: { accept: 'application/json' }, cache: 'no-store' }); const j = r.ok ? await r.json() : null; if (j && j.ok) { SERVER.daten = !!j.daten; SERVER.konten = !!j.konten; SERVER.zahlung = !!j.zahlung; SERVER.attrappe = !!j.attrappe; SERVER.testmodus = !!j.testmodus; SERVER.preise = j.preise || null; if (window.Abrechnung && window.Abrechnung.setEinfuehrung) window.Abrechnung.setEinfuehrung(j.einfuehrung || null); SERVER.zahlarten = Array.isArray(j.zahlarten) ? j.zahlarten : null; SERVER.recht = j.recht || null; } } catch (e) { /* ohne Server weiter */ }
  return SERVER.daten;
}
async function serverStart() {
  await statusHolen();
  /* Instanz: nie der Pilot-Weg (Code per WhatsApp an eeziframes); ohne Antwort des Servers bleibt die Planung auf dem Gerät, gesendet
     wird, sobald er wieder antwortet */
  PILOT = INST ? false : !SERVER.daten;
  if (INST && !SERVER.daten) { S.instWeg = true; render(); }
  setTimeout(() => { fotosHochladen(); fotosLokalAufraeumen(); }, 4000); // liegengebliebene Fotos nachschicken, Überholtes auf dem Gerät wegräumen
  if (SERVER.daten) document.querySelectorAll('.fx-pilot').forEach((e) => e.remove());
  const q = new URLSearchParams(location.search), bezahlt = q.get('bezahlt'), t = LINK_TOKEN; LINK_TOKEN = null;
  /* Anmeldung (Link aus der E-Mail oder gemerkte Anmeldung), auch nach einer Zahlung */
  const konto = async (gerendert) => {
    if (kontoBereit()) { if (t) return Promise.resolve(kontoAusLink(t)).then(einstiegNach, einstiegNach); if (KS) return kontoStart().then(einstiegNach, einstiegNach); }
    else if (t) toast('Die Anmeldung ist hier gerade nicht möglich. Bitte versuche es gleich noch einmal.');
    if (!gerendert) render();
    einstiegNach(); // Einstieg #ausmessen mit gemerkter Anmeldung, aber ohne Konten auf dem Server
  };
  if (bezahlt) { history.replaceState(null, '', location.pathname + location.hash); if (!S.betrieb) { await kaufPruefen(bezahlt); return konto(true); } }
  if (SERVER.zahlung && !S.betrieb && S.kauf && S.kauf.wartet && !S.kauf.paid) { await kaufPruefen(S.kauf.wartet, true); return konto(true); }
  if (SERVER.daten && S.betrieb) linkPruefen();
  return konto(false);
}
/* Im Kundenlink: Stand beim Betrieb nachsehen (Name, Runde, abgelaufen) und melden, dass der Link geöffnet wurde. Nur „gibt es
   nicht“ (404) schließt den Link; ein Serverfehler oder die Bremse lassen weiterarbeiten. In der Vorschau des Betriebs: nur lesen */
async function linkPruefen() {
  if (!S.betrieb || !S.betrieb.code) return;
  const code = S.betrieb.code, sync = S.sync;
  clearTimeout(sync.pruefTimer);
  try {
    const t1 = Date.now(), res = await fetch('/api/link/' + encodeURIComponent(code), { headers: { accept: 'application/json' } });
    const r = await res.json().catch(() => null);
    if (r) uhrStellen(r.jetzt, t1, Date.now());
    if (!S.betrieb || S.betrieb.code !== code) return;
    if (res.status === 404 && INST && S.betrieb.website && !S.sent) return instanzStillNeu(); // Planung der Website verfallen: still neu
    if (res.status === 404) { S.linkStatus = 'fehlt'; if (!S.sent) { S.linkZu = 'fehlt'; S.linkZuText = INST ? 'Diese Planung gibt es hier nicht (mehr). Du kannst gleich eine neue beginnen.' : (r && r.fehler) || 'Diesen Link gibt es nicht (mehr). Bitte melde dich bei deinem Fensterbauer.'; } return render(); }
    if (instZuPruefen(res, r)) return; // Instanz inzwischen pausiert, beendet oder wieder in Vorbereitung
    if (!r || !r.ok) { if (!vorschau()) entwurfLaden(); return; }
    S.betrieb.name = r.betrieb || S.betrieb.name; S.betrieb.kunde = r.kunde || S.betrieb.kunde; S.linkStatus = r.status; if (r.expires) S.betrieb.expires = r.expires;
    /* Einladungsseite: Profil des Betriebs, Anrede des Projekts und der Hinweis einer offenen Nachbesserung (einladung.js prüft alles) */
    LK_SERVER[code] = { auftritt: window.Einladung ? window.Einladung.profil(Object.assign({ ap: r.ap }, r.auftritt || {})) : null, du: typeof r.du === 'boolean' ? r.du : undefined, hinweis: String(r.hinweis || '').slice(0, 300), art: String(r.art || '') };
    /* Instanz: eine Planung der Website (auch über „auf anderem Gerät weitermachen“) ist ab jetzt die laufende dieses Geräts; die Adresse
       verliert den Code, damit er nicht aus Versehen weitergegeben wird */
    if (INST && instWebsite()) {
      S.betrieb.website = true; S.betrieb.name = r.betrieb || S.betrieb.name;
      if (!S.sent && r.zu !== 'eingegangen') instSchreiben('aktiv', code);
      if (/^#k-/.test(location.hash || '')) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ok */ } }
    }
    if (INST && r.nr && S.sent && !S.sent.nr) S.sent.nr = String(r.nr);
    if (!vorschau() && tiefeVorgabe()) persist();
    if (r.zu === 'eingegangen' && !S.sent) schonEingegangen(r.runde, S.sync.offen || weichtAb(S.nb && S.nb.vorher), r.seit);
    if (r.zu === 'abgelaufen' || r.zu === 'deaktiviert') { S.linkZu = r.zu; S.linkZuText = r.zuText || ''; }
    /* geöffnet melden: beim ersten Öffnen beginnen die 60 Tage, die neue Frist kommt zurück */
    if (!S.sent && !S.linkZu && !instWebsite()) fortschritt('geoeffnet'); // Planungen der Website melden nichts (virtueller Link)
    render();
    entwurfLaden();
  } catch (e) {
    /* kein Netz: gleich noch einmal (dazu zurück im Tab oder wieder online), bis der Link einmal geprüft ist */
    if (S.sync === sync && !sync.geladen) { sync.nochmal = Math.min(60000, (sync.nochmal || 2500) * 2); sync.pruefTimer = setTimeout(() => { if (S.sync === sync && !sync.geladen) linkPruefen(); }, sync.nochmal); }
  }
}
function fortschritt(stufe, k) {
  if (!SERVER.daten || !S.betrieb || !S.betrieb.code || vorschau() || instWebsite()) return;
  const code = S.betrieb.code;
  try { fetch('/api/link/' + encodeURIComponent(code) + '/fortschritt', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ stufe: stufe, k: k || 0 }) }).then((r) => r.json()).then((j) => { if (j && j.expires && S.betrieb && S.betrieb.code === code && j.expires !== S.betrieb.expires) { S.betrieb.expires = j.expires; if (S.screen === 'home') render(); } }).catch(() => {}); } catch (e) { /* ok */ }
}
/* Aufmaß direkt an den Betrieb schicken; schlägt es fehl, bleibt der Code-Weg. Vorher den Zwischenstand abgleichen: Hat ein anderes
   Gerät inzwischen etwas geändert, zeigt die App erst den neuen Stand. Mit dabei die Zähler je Fenster (wm), damit der Server die
   Grenze prüft und den Zwischenstand auf den gesendeten Stand setzt */
async function sendenServer() {
  if (vorschau()) return toast('Vorschau: Hier wird nichts gesendet.');
  const code0 = S.betrieb.code;
  toast('Wird gesendet …');
  const abgleich = await entwurfAbgleichen();
  if (abgleich === 'fehler') { if (S.betrieb && S.betrieb.code === code0) toast('Keine Verbindung. Bitte gleich noch einmal senden.'); return; }
  if (abgleich) {
    if (!S.betrieb || S.betrieb.code !== code0) return;
    if (S.sent) { go('home'); return toast('Dein Aufmaß ist schon bei ' + (S.betrieb.name || 'deinem Fensterbauer') + '.'); }
    if (S.linkZu && S.linkZu !== 'eingegangen') { go('home'); return toast(S.linkZuText || (INST ? 'Diese Planung ist nicht mehr aktiv.' : 'Dieser Link ist nicht mehr aktiv.')); }
    render(); return toast('Dein Aufmaß wurde mit einem anderen Gerät abgeglichen. Bitte kurz prüfen und noch einmal senden.');
  }
  if (!S.betrieb || S.betrieb.code !== code0 || S.sent) return;
  const o = JSON.parse(JSON.stringify(unpackProject(packProject(S.windows, S.proj, S.betrieb))));
  o.wm = S.windows.map((w) => ({ wid: w.wid || '', t0: Number(w.t0) || 0, aend: Number(w.aend) || 0, ts: Number(w.ts) || 0 })); o.stand = S.stand || 0; o.projTs = S.projTs || 0;
  try {
    const res = await fetch('/api/aufmass', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(o) }), r = await res.json().catch(() => null);
    if (instZuPruefen(res, r)) return toast(r.fehler || 'Der Fensterplaner nimmt gerade keine Anfragen an.');
    if (!S.betrieb || S.betrieb.code !== code0) return;
    if (r && !r.ok && r.zu === 'eingegangen') { schonEingegangen(r.runde, true, r.seit); go('home'); return toast(r.fehler); } // schon da (anderes Gerät)
    if (r && !r.ok && r.abgleichen) { S.sync.offen = true; await entwurfSenden(); if (!S.betrieb || S.betrieb.code !== code0) return; render(); return toast(r.fehler); } // anderes Gerät war schneller: zusammenführen, prüfen lassen
    if (r && !r.ok && r.kontakt && INST) { S.kontaktFehler = kontaktPruefen(); S.kontaktFehler.alle = true; go('anfrage3'); return toast(r.fehler); } // Instanz: Kontakt ist Pflicht (Server prüft dasselbe)
    if (!r || !r.ok) return toast(r && r.fehler ? r.fehler : 'Senden hat nicht geklappt. Bitte gleich noch einmal.');
    clearTimeout(S.sync.timer); S.sync.offen = false;
    S.sent = { when: Date.now(), code: packProject(S.windows, S.proj, S.betrieb), runde: S.nb && S.nb.runde ? S.nb.runde : 1, uebertragen: true }; S.nb = null; S._feier = 'gesendet'; S.toast = ''; clearTimeout(toastTimer);
    if (INST) { S.sent.nr = String(r.nr || ''); S.sent.art = String(r.art || ''); instGesendetMerken(S.sent.nr, S.sent.when, S.sent.art); }
    persist(); go('gesendet');
  } catch (e) { toast('Keine Verbindung. Bitte gleich noch einmal.'); }
}
boot();


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
  fc = fc || FR; const o = [], da = c.richtung === 'aussen' ? '3 2' : undefined, art = c.art || 'fenster', tuer = art === 'hst' || art === 'fsw' || art === 'balkon' || art === 'psk';
  o.push(P(R(bx, by, bw, bh, 1.2), fc, INK, 1.3));
  const f = Math.max(2, bw * 0.06); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
  if (c.ol) { const oh = ih * 0.27; o.push(P(R(ix, iy, iw, oh), GL, INK, 0.7)); o.push(...sym(ix, iy, iw, oh, c.olT || 'K', 'L', da, INK, 0.7)); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
  /* Unterlicht: festes Feld unten, Glas oder Paneel */
  if (c.ul && art === 'fenster') { const uh = Math.min(ih * 0.5, Math.max(ih * 0.18, ih * (num(c.ulH) || 400) / ((num(c.el && c.el.h) || num(c.h) || 1400)))); o.push(P(R(ix, iy + ih - uh, iw, uh), c.ulA === 'paneel' ? '#c9c9c6' : GL, INK, 0.7)); ih -= uh + f * 0.7; }
  const n = c.sashes.length, gap = c.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
  c.sashes.forEach((s, i) => {
    const sx = ix + i * (sw + gap), fest = s.t === 'F' || art === 'fest', g = fest ? 0 : Math.max(1.5, sw * 0.09);
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
    if (k === 'A3') { pf(6, 16); pf(24, 16); sf(42, 16); } else { pf(6, 25); sf(33, 25); }
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
    else o.push(P(R(28, 12, 8, 42), FR, INK, 1.1));
    o.push(P(L([32, k === 'aufsatz' ? 25 : k === 'behalten' ? 22 : 14], [32, 52]), 'none', '#5b9bd5', 1.6));
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
  form: [{ k: 'rechteck', label: 'Rechteck', sub: 'der Standard' }, { k: 'rundbogen', label: 'Rundbogen', sub: 'Halbkreis oben' }, { k: 'segment', label: 'Segmentbogen', sub: 'flacher Bogen oben' }, { k: 'schraeg', label: 'Schräg', sub: 'eine Seite höher' }, { k: 'rund', label: 'Rund', sub: 'fest verglast, ohne Flügel' }],
  teilung: [{ k: '1', label: '1 Flügel', sub: 'einteilig' }, { k: '2p', label: '2 Flügel', sub: 'mit Pfosten', g: 'pfosten' }, { k: '2s', label: '2 Flügel', sub: 'Stulp, ohne Pfosten', g: 'stulp' }, { k: '3', label: '3 Flügel', sub: 'Mitte fest' }],
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
    { k: 'sonne', label: 'Sonnenschutz', ico: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' }],
  griff: [{ k: 'standard', label: 'Standard' }, { k: 'abschliessbar', label: 'Abschließbar' }, { k: 'druckknopf', label: 'Druckknopf' }, { k: 'ohne', label: 'Ohne Griff', sub: 'verdeckt oder elektrisch' }],
  hstGriff: [{ k: 'standard', label: 'Hebegriff' }, { k: 'abschliessbar', label: 'Abschließbar' }, { k: 'motor', label: 'Elektrisch', sub: 'per Taster oder App' }],
  gf: [{ k: 'weiss', label: 'Weiß', bg: '#f4f4f2' }, { k: 'silber', label: 'Silber', bg: '#c9ccd0' }, { k: 'edelstahl', label: 'Edelstahl', bg: 'linear-gradient(135deg, #eceef0, #a7abb0)' }, { k: 'titan', label: 'Titan', bg: '#8b8d8f' }, { k: 'schwarz', label: 'Schwarz', bg: '#1d1d1f' }],
  rc: [{ k: 'basis', label: 'Basisschutz' }, { k: 'rc1', label: 'RC1 N' }, { k: 'rc2', label: 'RC2' }],
  erreichbar: [{ k: 'ja', label: 'Ja, leicht' }, { k: 'nein', label: 'Nein' }],
  absturz: [{ k: 'balkon', label: 'Balkon davor', sub: 'dann keine nötig' }, { k: 'gelaender', label: 'Geländer außen', sub: 'französischer Balkon' }, { k: 'glas', label: 'Glasbrüstung', sub: 'Glas in der Laibung' }, { k: 'fest', label: 'Unten fest', sub: 'Sicherheitsglas' }],
  absturzTuer: [{ k: 'balkon', label: 'Ja, Balkon', sub: 'oder Terrasse davor' }, { k: 'gelaender', label: 'Nein, Geländer', sub: 'französischer Balkon' }, { k: 'glas', label: 'Nein, Glas', sub: 'Glasbrüstung davor' }],
  griffA: [{ k: 'keiner', label: 'Kein Griff außen' }, { k: 'ziehgriff', label: 'Ziehgriff mit Schnäpper' }, { k: 'abschliessbar', label: 'Abschließbar, mit Schlüssel' }],
  boden: [{ k: 'bleibt', label: 'Bleibt, wie er ist' }, { k: 'neu', label: 'Wird erneuert' }],
  pskSchema: [{ k: 'A', label: '2-teilig', sub: '1 schiebt vor 1 festem' }, { k: 'A3', label: '3-teilig', sub: '1 schiebt vor 2 festen' }],
  foerdweg: [{ k: 'bafa', label: 'BAFA-Zuschuss' }, { k: 'steuer', label: 'Steuerbonus' }, { k: 'keine', label: 'Keine' }, { k: 'offen', label: 'Noch offen' }],
  roll: [{ k: 'keiner', label: 'Keiner' }, { k: 'behalten', label: 'Bestehender', sub: 'bleibt drin' }, { k: 'aufsatz', label: 'Aufsatz', sub: 'neu, auf dem Fenster', g: 'aufsatz' }, { k: 'vorbau', label: 'Vorbau', sub: 'neu, außen davor', g: 'vorbau' }],
  antrieb: [{ k: 'gurt', label: 'Gurt' }, { k: 'kurbel', label: 'Kurbel' }, { k: 'motor', label: 'Elektrisch' }, { k: 'smart', label: 'Smart Home' }],
  art: [{ k: 'fenster', label: 'Fenster', sub: 'Dreh, Kipp, fest' }, { k: 'balkon', label: 'Balkon- oder Terrassentür', sub: 'geht auf wie ein Fenster', g: 'balkon' }, { k: 'fest', label: 'Festverglasung', sub: 'großflächig, ohne Griff' }, { k: 'hst', label: 'Hebe-Schiebe-Tür', sub: 'bodentief, schiebt', g: 'hst' }, { k: 'psk', label: 'PSK-Tür', sub: 'schiebt und kippt, meist günstiger', g: 'psk' }, { k: 'fsw', label: 'Faltschiebewand', sub: 'ganz zu öffnen' }],
  situation: [{ k: 'ersatz', label: 'Fenster ersetzen', sub: 'Dort ist schon eins' }, { k: 'neu', label: 'Neue Öffnung', sub: 'Dort war noch keins' }],
  felder: [{ k: '1', label: '1 Feld' }, { k: '2p', label: '2 Felder' }, { k: '3', label: '3 Felder' }, { k: '4', label: '4 Felder' }],
  ul: [{ k: 'nein', label: 'Kein Unterlicht' }, { k: 'glas', label: 'Unterlicht aus Glas', sub: 'fest verglast' }, { k: 'paneel', label: 'Unterlicht als Paneel', sub: 'geschlossen, gedämmt' }],
  hstSchema: [{ k: 'A', label: 'Schema A', sub: '1 schiebt vor 1 festem' }, { k: 'A3', label: '3-teilig', sub: '1 schiebt vor 2 festen' }, { k: 'C', label: 'Schema C', sub: '2 schieben mittig' }, { k: 'D', label: 'Schema D', sub: '2 schieben, Mitte zu' }],
  hstRichtung: [{ k: 'L', label: 'Schiebeflügel links' }, { k: 'R', label: 'Schiebeflügel rechts' }],
  schwelle: [{ k: 'flach', label: 'Flache Schwelle', sub: 'ca. 20 mm' }, { k: 'null', label: 'Barrierefrei', sub: 'ohne Schwelle' }, { k: 'standard', label: 'Standard', sub: 'mit Anschlag' }],
  fswN: [{ k: '2', label: '2' }, { k: '3', label: '3' }, { k: '4', label: '4' }, { k: '5', label: '5' }, { k: '6', label: '6' }, { k: '7', label: '7' }],
  fswSchema: [{ k: 'links', label: 'Paket links' }, { k: 'rechts', label: 'Paket rechts' }, { k: 'geteilt', label: 'Beide Seiten' }],
  sart: [{ k: 'keiner', label: 'Keiner' }, { k: 'behalten', label: 'Bestehender', sub: 'bleibt dran' }, { k: 'rollladen', label: 'Rollladen', sub: 'dunkelt ab' }, { k: 'raffstore', label: 'Raffstore', sub: 'Lamellen, stellbar' }, { k: 'screen', label: 'Screen', sub: 'Textil, Durchblick' }],
  einbau: [{ k: 'aufsatz', label: 'Aufsatz', sub: 'Kasten auf dem Element' }, { k: 'vorbau', label: 'Vorbau', sub: 'Kasten außen davor' }],
  sfarbe: [{ k: 'silber', label: 'Silber', bg: 'linear-gradient(180deg, #d9dde1, #aeb4ba)' }, { k: 'weiss', label: 'Weiß', bg: '#f1f0ea' }, { k: 'hellgrau', label: 'Hellgrau', bg: '#cbd0cc' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#383e42' }, { k: 'braun', label: 'Braun', bg: '#5a4030' }, { k: 'bronze', label: 'Bronze', bg: 'linear-gradient(180deg, #a07a52, #6e4f32)' }, { k: 'schwarz', label: 'Schwarz', bg: '#141516' }],
  iart: [{ k: 'keiner', label: 'Keiner' }, { k: 'rollo', label: 'Rollo', sub: 'Stoff, rollt auf' }, { k: 'plissee', label: 'Plissee', sub: 'gefaltet, schiebt' }, { k: 'jalousie', label: 'Jalousie', sub: 'Lamellen innen' }],
  ifarbe: [{ k: 'weiss', label: 'Weiß', bg: '#f4f2ec' }, { k: 'creme', label: 'Creme', bg: '#e8dcc4' }, { k: 'grau', label: 'Grau', bg: '#9ea3a6' }, { k: 'anthrazit', label: 'Anthrazit', bg: '#3b4044' }, { k: 'blau', label: 'Blau', bg: '#3f5f86' }, { k: 'gruen', label: 'Salbei', bg: '#7f9a7c' }, { k: 'terra', label: 'Terracotta', bg: '#b56a48' }],
  insekt: [{ k: 'keiner', label: 'Keiner' }, { k: 'spann', label: 'Spannrahmen' }, { k: 'dreh', label: 'Drehrahmen' }, { k: 'plissee', label: 'Plissee' }],
  fbi: [{ k: 'behalten', label: 'Behalten' }, { k: 'werzalit', label: 'Werzalit' }, { k: 'stein', label: 'Naturstein' }, { k: 'holz', label: 'Holz' }],
  fba: [{ k: 'behalten', label: 'Behalten' }, { k: 'alu', label: 'Aluminium' }, { k: 'stein', label: 'Naturstein' }],
  gebaeude: [{ k: 'efh', label: 'Einfamilienhaus' }, { k: 'dh', label: 'Doppelhaushälfte' }, { k: 'rh', label: 'Reihenhaus' }, { k: 'mfh', label: 'Mehrfamilienhaus' }, { k: 'etw', label: 'Eigentumswohnung' }, { k: 'denkmal', label: 'Denkmalschutz' }],
  zeit: [{ k: 'asap', label: 'So bald wie möglich' }, { k: '3m', label: 'In 1 bis 3 Monaten' }, { k: '6m', label: 'In 3 bis 6 Monaten' }, { k: '12m', label: 'Später, erst Angebote' }],
  budget: [{ k: 'b1', label: 'bis 5.000 €' }, { k: 'b2', label: '5.000 bis 10.000 €' }, { k: 'b3', label: '10.000 bis 20.000 €' }, { k: 'b4', label: 'über 20.000 €' }, { k: 'b0', label: 'Weiß ich noch nicht' }],
  erreich: [{ k: 'vm', label: 'Vormittags' }, { k: 'nm', label: 'Nachmittags' }, { k: 'ab', label: 'Abends' }],
  baujahr: [{ k: 'vor 1978', label: 'vor 1978' }, { k: '1978 bis 1995', label: '1978 bis 1995' }, { k: '1995 bis 2010', label: '1995 bis 2010' }, { k: 'nach 2010', label: 'nach 2010' }, { k: '', label: 'Weiß ich nicht' }]
};
const TYPNAME = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp', S: 'Schiebeflügel', X: 'Faltflügel', P: 'Gehflügel', PS: 'PSK-Flügel' };
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
  bruestung: { t: 'Was ist die Brüstungshöhe?', x: ['Der Abstand vom fertigen Fußboden bis zur Unterkante der Fensteröffnung. Bei sehr tiefen Fenstern kann eine Absturzsicherung vorgeschrieben sein.'], ico: () => [P(R(4, 58, 56, 3), INK), P(R(16, 6, 28, 30, 1), FR, INK, 1.3), P(R(19, 9, 22, 24), GL, INK, 0.6), P(L([52, 37], [52, 57]), 'none', '#d4502b', 1.6), P(L([49, 37], [55, 37]), 'none', '#d4502b', 1.4), P(L([49, 57], [55, 57]), 'none', '#d4502b', 1.4)], see: ['absturz', 'rahmenmass'] },
  rahmenmass: { lottie: 'messen', t: 'Maueröffnung oder Fensterelement?', x: ['Die Maueröffnung ist das Loch in der Wand, gemessen von Laibung zu Laibung. Das Fensterelement ist das Fenster selbst mit seinem Rahmen, so wie du es siehst.', 'Beides brauchst du fürs Angebot. Das neue Fenster wird etwas kleiner als die Öffnung, damit Platz für Dämmung und Abdichtung bleibt. Das Bestellmaß legt dein Fensterbauer beim Feinaufmaß fest.'], ico: () => [P(R(6, 6, 52, 52), WALL, INK, 0.8), P(R(13, 13, 38, 38), '#f5f5f7', INK, 0.8, '3 2'), P(R(16, 16, 32, 32, 1), FR, INK, 1.3), P(R(20, 20, 24, 24), GL, INK, 0.6)], see: ['anschlag', 'feinaufmass'] },
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
  lueftung: { t: 'Brauche ich ein Lüftungskonzept?', x: ['Neue Fenster sind sehr dicht. Wird mehr als ein Drittel der Fenster getauscht, ist nach der Norm DIN 1946-6 ein Lüftungskonzept erforderlich. Es zeigt, ob zusätzlich gelüftet werden muss, damit kein Schimmel entsteht.', 'Oft reichen kleine Lüfter im Fensterfalz. Um das Konzept kümmert sich dein Fensterbauer.'], ico: () => [P(R(16, 8, 32, 48, 1.2), FR, INK, 1.3), P(R(20, 12, 24, 40), GL, INK, 0.6), P('M4 20c4-3 8 3 12 0M4 30c4-3 8 3 12 0M48 34c4-3 8 3 12 0M48 44c4-3 8 3 12 0', 'none', '#5b9bd5', 1.8)], see: ['ralmontage'] },
  referenz: { lottie: 'messen', t: 'Wie genau ist das Aufmaß?', x: ['Du misst mit dem Zollstock, die App führt dich: erst die Maueröffnung, dann das Fensterelement, jeweils senkrecht und waagerecht in der Mitte, danach die Ränder.', 'Das kleinste von drei Maßen zählt, so wie es der Fensterbauer auch macht. Die Fotos liefern ihm dazu die Einbausituation: Rollladenkasten, Anschlag, Laibung, Fensterbänke, Fassade und Zugang.'], ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['feinaufmass', 'rahmenmass'] },
  feinaufmass: { t: 'Was ist ein Feinaufmaß?', x: ['Bevor dein Fenster produziert wird, misst der Fensterbauer vor Ort noch einmal genau nach. Dein Aufmaß ersetzt den ersten Termin und reicht fürs Angebot, nicht aber diese Endkontrolle.'], ico: () => [P('M6 50l12-30 4 1.6-12 30zM22 21l14 26 3.6-2-14-26zM39.6 45l12-30 3.6 1.6-12 30z', '#f2d27a', INK, 1.1), P(C(20, 21, 1.6), INK), P(C(38, 46, 1.6), INK)], see: ['referenz', 'rahmenmass'] },
  unterlicht: { t: 'Was ist ein Unterlicht?', x: ['Ein festes Feld unter den Flügeln, als Glas oder als gedämmtes Paneel. Typisch in Küchen: Die Arbeitsplatte steht vor dem Fenster, der Flügel beginnt erst darüber und lässt sich trotzdem öffnen.', 'Die Höhe richtet sich nach Arbeitsplatte oder Brüstung, meist 30 bis 60 cm.'], ico: () => ICO.ul('glas'), see: ['oberlicht', 'fest'] },
  festverglasung: { t: 'Was ist eine Festverglasung?', x: ['Glas direkt im Blendrahmen, ohne Flügel und ohne Griff. Dadurch schmalere Ansichten, mehr Licht und weniger Kosten. Zum Lüften braucht es daneben ein Fenster, das aufgeht.', 'Großflächige Festverglasungen werden in Feldern geteilt, weil Scheiben ab etwa 2,5 m² schwer und teuer werden.'], ico: () => ICO.art('fest'), see: ['fest', 'pfosten'] },
  hst: { t: 'Was ist eine Hebe-Schiebe-Tür?', x: ['Eine bodentiefe Tür, bei der ein großer Flügel per Hebegriff angehoben und zur Seite geschoben wird. Die Öffnung bleibt frei, nichts schwenkt in den Raum.', 'Schema A: ein Schiebeflügel vor einem festen Teil. Schema C: zwei Schiebeflügel öffnen in der Mitte. Flache Schwellen ab 20 mm, barrierefrei nach DIN 18040 ohne Schwelle.'], ico: () => ICO.art('hst'), see: ['fsw', 'schwelle'] },
  fsw: { t: 'Was ist eine Faltschiebewand?', x: ['Mehrere Flügel hängen in einer Laufschiene und falten sich wie eine Ziehharmonika zu einem Paket an der Seite. So öffnet sich die ganze Wand.', 'Ein Gehflügel geht wie eine normale Tür auf, ohne dass alles gefaltet werden muss. Ab drei Flügeln sinnvoll, bis etwa sieben üblich.'], ico: () => ICO.art('fsw'), see: ['hst', 'schwelle'] },
  schwelle: { t: 'Welche Schwelle?', x: ['Flache Schwellen von etwa 20 mm gelten als barrierearm. Barrierefrei nach DIN 18040 heißt ohne Schwelle, das braucht außen eine Entwässerungsrinne.', 'Standardschwellen mit Anschlag dichten am besten und sind bei Wetterseiten die sichere Wahl.'], ico: () => ICO.schwelle('flach'), see: ['hst', 'fsw'] },
  raffstore: { t: 'Was ist ein Raffstore?', x: ['Eine Außenjalousie aus Aluminium-Lamellen. Die Lamellen lassen sich kippen: Schatten oben, Durchblick unten. Hält die Hitze draußen, bevor sie ans Glas kommt.', 'Lamellenfarben wie Silber, Anthrazit oder Bronze; Kasten als Aufsatz auf dem Element oder vorgebaut.'], ico: () => ICO.sonne('raffstore'), see: ['screen', 'aufsatz', 'vorbau'] },
  screen: { t: 'Was ist ein Screen?', x: ['Ein textiler Sonnenschutz außen, der wie ein Rollo herunterfährt. Das Gewebe lässt Durchblick nach außen, hält aber Hitze und Blicke ab. Mit Führungsschienen (ZIP) auch windstabil.'], ico: () => ICO.sonne('screen'), see: ['raffstore'] },
  innenschutz: { t: 'Rollo, Plissee oder Jalousie innen?', x: ['Innenliegender Sonnen- und Sichtschutz, in Stoff oder Aluminium. Rollos rollen auf, Plissees falten sich und lassen sich von oben und unten verschieben, Jalousien haben kippbare Lamellen.', 'Gegen Hitze hilft außen mehr als innen; innen geht es um Blendung und Sichtschutz.'], ico: () => ICO.innen('rollo'), see: ['raffstore'] },
  neuoeffnung: { t: 'Neue Öffnung in der Wand', x: ['Wo noch kein Fenster ist, braucht die Wand einen Durchbruch mit Sturz. Bei tragenden Wänden muss ein Statiker oder der Fensterbauer mit seinem Bauunternehmen prüfen, was geht.', 'Du markierst die gewünschte Lage auf dem Foto und gibst die Wunschgröße an. Das Rohbaumaß legt am Ende der Fachbetrieb fest.'], ico: () => ICO.situation('neu'), see: ['referenz', 'feinaufmass'] },
  balkon: { t: 'Was ist eine Balkon- oder Terrassentür?', x: ['Eine Tür, die aufgeht wie ein Fenster: drehen zum Durchgehen, kippen zum Lüften. Unten sitzt eine Schwelle statt der Fensterbank.', 'Damit sie von außen zugeht, gibt es einen Ziehgriff mit Schnäpper. Mit Schloss lässt sie sich auch von außen abschließen.'], ico: () => ICO.art('balkon'), see: ['schwelle', 'psk'] },
  psk: { t: 'Was ist eine PSK-Tür?', x: ['Parallel-Schiebe-Kipp: Der Flügel kippt zum Lüften. Zum Öffnen stellt er sich parallel ab und schiebt sich vor das feste Teil.', 'Meist deutlich günstiger als eine Hebe-Schiebe-Tür. Dafür sind die Flügel kleiner, und unten ist immer eine Schwelle.'], ico: () => ICO.art('psk'), see: ['hst', 'schwelle'] },
  absturz: { t: 'Wann braucht es eine Absturzsicherung?', x: ['Die Bauordnungen der meisten Länder verlangen Fensterbrüstungen von mindestens 80 cm, bei mehr als 12 m Absturzhöhe 90 cm. Ist sie niedriger, braucht das Fenster eine Absturzsicherung; bei bodentiefen Fenstern und Türen ohne Balkon davor immer.', 'Möglich sind ein Geländer außen (französischer Balkon), Glas in der Laibung oder ein unten fest verglastes Feld aus Sicherheitsglas.'], ico: () => ICO.absturz('gelaender'), see: ['bruestung', 'vsg'] },
  foerderung: { t: 'BAFA-Zuschuss oder Steuerbonus?', x: ['BAFA: 15 % Zuschuss für neue Fenster und Außentüren. Ein Energieeffizienz-Experte muss den Antrag begleiten, gestellt wird er vor Beginn der Arbeiten. Den Vertrag erst mit Förderklausel unterschreiben.', 'Steuerbonus: 20 % der Kosten über drei Jahre von der Steuer abziehen, für selbst bewohnte Häuser, die älter als zehn Jahre sind. Der Fachbetrieb stellt eine Bescheinigung nach amtlichem Muster aus.', 'Beides gilt nur, wenn die Fenster gut dämmen: Uw höchstens 0,95, mit Einbruchschutz RC2 oder barrierearmer Schwelle höchstens 1,1. Für dieselben Fenster gibt es nur eins von beiden.'], ico: () => [...ICO.glas('3'), P(C(52, 14, 9), '#f2d27a', INK, 1.1), P(L([52, 9], [52, 19]) + L([49.5, 11], [54.5, 11]) + L([49.5, 17], [54.5, 17]), 'none', INK, 1.1)], see: ['uwert', 'lueftung'] }
};
const GLOSS_ORDER = ['referenz', 'feinaufmass', 'neuoeffnung', 'rahmenmass', 'bruestung', 'absturz', 'laibung', 'anschlag', 'dinlr', 'symbol', 'dk', 'kipp', 'fest', 'festverglasung', 'oberlicht', 'unterlicht', 'balkon', 'hst', 'psk', 'fsw', 'schwelle', 'pfosten', 'stulp', 'wiener', 'szr', 'auf', 'echt', 'uwert', 'schall', 'vsg', 'ornament', 'rc2', 'ral', 'aufsatz', 'vorbau', 'insekt', 'fensterbank', 'ralmontage', 'lueftung', 'foerderung', 'raffstore', 'screen', 'innenschutz'];
/* ---------- Fenster-Modell ---------- */
let BID = 1;
const nid = () => 'b' + (BID++);
function sashesFor(k) {
  if (k === '1') return [{ t: 'DK', din: 'L' }];
  if (k === '2s') return [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }];
  if (k === '3') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'DK', din: 'R' }];
  if (k === '4') return [{ t: 'F', din: 'L' }, { t: 'F', din: 'L' }, { t: 'F', din: 'R' }, { t: 'F', din: 'R' }];
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
/* Faltschiebewand: n Faltflügel, der Gehflügel (Tür im Alltag) steht am Ende gegenüber dem Paket */
function fswFluegel(n, schema, geh) {
  n = Math.max(2, Math.min(7, num(n) || 3));
  const out = Array.from({ length: n }, (x, i) => ({ t: 'X', din: schema === 'rechts' ? 'R' : 'L' }));
  if (geh && n > 1) { const i = schema === 'rechts' ? 0 : n - 1; out[i] = { t: 'P', din: schema === 'rechts' ? 'R' : 'L' }; }
  return out;
}
/* PSK-Tür: A = Schiebeflügel (kippbar) vor einem Festteil, A3 = vor zwei Festteilen; richtung = Seite, auf der der Flügel geschlossen steht */
function pskFluegel(schema, richtung) {
  const S = { t: 'PS', din: richtung }, F = { t: 'F', din: richtung };
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
  w.e_teilung = art !== 'fenster' && art !== 'balkon'; w.bars = []; w.preset = 'keine';
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
    demontage: true, durchbruch: true, ralm: true, putz: true, notiz: '', ki: null, tilt: null, fotos: 0, quelle: 'hand' };
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
const colorOf = (k) => COLORS.find((c) => c.k === k) || COLORS[0];
/* Eigene Farben: eingetippt und erkannt (gemeinsam.js, Farbtext) → so im Modell, in der Zeichnung und im Aufmaßblatt.
   Nicht erkannt → die gewählte Farbe aus der Liste bleibt, der Text geht als Wunsch an den Fensterbauer. */
const farbLesen = (t) => (t && window.Farbtext ? window.Farbtext.lesen(t) : null);
const mischHex = (hex, ziel, t) => (window.Farbtext ? window.Farbtext.mischen(hex, ziel, t) : hex);
/* Noch nicht entschieden (Weiß ich noch nicht, oder die Frage ohne Vorauswahl übergangen): das Modell zeigt neutral Weiß, das Blatt „offen“ */
const FARBE_OFFEN = { k: 'offen', name: 'Farbe offen', code: 'bitte beraten', bg: '#f1f0ea', solid: '#f1f0ea', offen: true };
const farbeOffen = (w, seite) => !!(w.offen && (seite === 'innen' ? (w.gleich ? w.offen.fa : w.offen.fi) : w.offen.fa));
function rahmenFarbe(w, seite) {
  if (farbeOffen(w, seite)) return FARBE_OFFEN;
  const innen = seite === 'innen', t = innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA, k = innen ? (w.gleich ? w.fa : w.fi) : w.fa, f = farbLesen(t);
  if (!f) return colorOf(k);
  return COLORS.find((x) => x.k === f.key) || { k: 'eigen', name: f.name, code: f.code ? 'RAL ' + f.code : f.holz ? 'Holzdekor' : 'eigene Farbe', bg: f.bg, solid: f.hex, eigen: true };
}
function farbZeile(w, seite) {
  if (farbeOffen(w, seite)) return AW.OFFEN_TEXT;
  const innen = seite === 'innen', t = (innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA) || '', c = rahmenFarbe(w, seite);
  if (t && farbLesen(t)) return c.name + (c.code && c.name.indexOf(c.code) < 0 ? ' (' + c.code + ')' : '') + ', eigene Angabe';
  return c.name + ' (' + c.code + ')' + (t ? ', Wunsch: ' + t : '');
}
function griffFarbe(w) { const f = farbLesen(w.wunschGf); if (f) return { bg: f.hex, name: f.name, eigen: true }; const o = OPT.gf.find((g) => g.k === w.gf) || OPT.gf[0]; return { bg: o.bg, name: o.label + (w.wunschGf ? ', Wunsch: ' + w.wunschGf : '') }; }
function sonneFarbeW(w) { const f = farbLesen(w.wunschSf); return f ? [f.hex, mischHex(f.hex, '#000000', 0.32), mischHex(f.hex, '#ffffff', 0.28)] : sonneFarbe(w.sfarbe); }
function innenFarbeW(w) { const f = farbLesen(w.wunschIf); return f ? [f.hex, mischHex(f.hex, '#000000', 0.22), mischHex(f.hex, '#ffffff', 0.3)] : innenFarbe(w.ifarbe); }
const sonneName = (w) => { const f = farbLesen(w.wunschSf); return f ? f.name : (lab('sfarbe', w.sfarbe) || '') + (w.wunschSf ? ', Wunsch: ' + w.wunschSf : ''); };
const innenName = (w) => { const f = farbLesen(w.wunschIf); return f ? f.name : (lab('ifarbe', w.ifarbe) || '') + (w.wunschIf ? ', Wunsch: ' + w.wunschIf : ''); };
const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
/* Einstellungen der Tür je Art (Schwelle usw.) */
const tuerCfg = (w) => (w.art === 'hst' ? w.hst : w.art === 'fsw' ? w.fsw : w.art === 'psk' ? w.psk : w.art === 'balkon' ? w.bt : null) || {};
const schwelleText = (k) => ({ flach: 'flache Schwelle', null: 'barrierefrei ohne Schwelle', standard: 'Standardschwelle' }[k] || 'flache Schwelle');
/* Gehflügel der Balkontür: der erste Dreh-Kipp-Flügel, sonst der erste Drehflügel */
const gehFluegel = (w) => { const dk = w.sashes.findIndex((x) => x.t === 'DK'); return dk >= 0 ? dk : w.sashes.findIndex((x) => x.t === 'D'); };
/* Offen statt Vorgabe (Regeln in modell.js): istOffen prüft auch, ob die Angabe zum Element gehört */
const OT = 'offen, bitte beraten';
const istOffen = (w, k) => AW.istOffen(w, k);
const ov = (w, k, text) => (istOffen(w, k) ? OT : text);
function openingText(w) {
  if (w.art === 'fest') return w.sashes.length + (w.sashes.length === 1 ? ' Feld' : ' Felder') + ', fest verglast, ohne Griff';
  if (w.art === 'hst') { const h = w.hst || {}; return 'Hebe-Schiebe-Tür ' + lab('hstSchema', h.schema) + (h.schema === 'A' || h.schema === 'A3' ? ', Schiebeflügel ' + (h.richtung === 'L' ? 'links' : 'rechts') : '') + ', ' + ov(w, 'schwelle', schwelleText(h.schwelle)); }
  if (w.art === 'fsw') { const f = w.fsw || {}; return 'Faltschiebewand, ' + w.sashes.length + ' Flügel, ' + lab('fswSchema', f.schema) + (f.geh ? ', mit Gehflügel' : ', ohne Gehflügel') + ', ' + ov(w, 'schwelle', schwelleText(f.schwelle)); }
  if (w.art === 'psk') { const p = w.psk || {}; return 'PSK-Tür ' + lab('pskSchema', p.schema) + ', Schiebeflügel ' + (p.richtung === 'L' ? 'links' : 'rechts') + ', kippbar, mit Schwelle'; }
  const s = w.sashes.map((x) => TYPNAME[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ');
  if (w.art === 'balkon') return 'Balkontür, ' + (w.ol ? lab('olT', w.olT) + ' · ' : '') + s + ', ' + ov(w, 'schwelle', schwelleText((w.bt || {}).schwelle));
  return (w.ol ? lab('olT', w.olT) + ' · ' : '') + s + (w.ul ? ' · ' + lab('ul', w.ulA) + ' ' + thousand(w.ulH) + ' mm' : '');
}
/* Sonnenschutz außen in Worten */
function sonneText(w) {
  if (istOffen(w, 'sart')) return OT;
  const a = w.sart && w.sart !== 'keiner' ? w.sart : (w.roll === 'aufsatz' || w.roll === 'vorbau' ? 'rollladen' : w.roll === 'behalten' ? 'behalten' : 'keiner');
  if (a === 'keiner') return 'Keiner';
  if (a === 'behalten') return 'Bestehender bleibt';
  return lab('sart', a) + (a === 'screen' ? '' : ', ' + (istOffen(w, 'einbau') ? 'Kasten nach Wahl des Fensterbauers' : lab('einbau', w.roll === 'vorbau' ? 'vorbau' : 'aufsatz'))) + ', ' + sonneName(w) + ', ' + (istOffen(w, 'antrieb') ? 'Antrieb offen' : lab('antrieb', w.antrieb));
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
    { k: 'Einbau', v: w.neu ? 'Neue Öffnung: ' + (AW.ohneFotos(w) ? 'ohne Foto, Lage nicht eingezeichnet' : 'Lage vom Kunden auf dem Foto eingezeichnet') + ', Maße sind Wunschmaße. Sturz und Statik vor dem Durchbruch prüfen.' : AW.ohneFotos(w) ? 'Ohne Fotos erfasst, Einbausituation und Feinaufmaß vor Ort' : 'Anschlag und Fassade laut Fotos, Feinaufmaß vor Ort' },
    { k: 'Element', v: lab('art', w.art || 'fenster') },
    { k: 'Öffnung', v: openingText(w) + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ', öffnet nach außen' : '') },
    { k: 'Form', v: lab('form', w.form) + ', ' + (istOffen(w, 'material') ? 'Material ' + OT : lab('material', w.material)) },
    { k: 'Farbe', v: 'außen ' + farbZeile(w, 'aussen') + ', innen ' + (w.gleich ? 'wie außen' : farbZeile(w, 'innen')) },
    { k: 'Glas', v: ov(w, 'glas', lab('glas', w.glas)) + (istOffen(w, 'glasfn') ? ', Extras ' + OT : w.glasfn.length ? ', ' + w.glasfn.map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + (ORN.find((o) => o.k === w.orn) || ORN[0]).label + ')' : '')).join(', ') : '') },
    { k: 'Sprossen', v: w.bars.length ? ov(w, 'spross', lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite).toLowerCase() + ')' : '')) + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'Keine' },
    { k: 'Griff', v: griffText(w) },
    { k: 'Einbruchschutz', v: AW.rcText(w) }
  ];
  if (AW.absturzFrage(w)) rows.push({ k: 'Absturzsicherung', v: AW.absturzText(w) });
  if (z) rows.push({ k: 'Förderwert', v: AW.uwText(z) + ', ' + lab('foerdweg', AW.foerdWeg(S.proj)) });
  rows.push({ k: 'Sonnenschutz', v: 'außen: ' + sonneText(w) + ' · innen: ' + innenText(w) + ' · Insektenschutz: ' + ov(w, 'insekt', lab('insekt', w.insekt)) });
  rows.push(istTuer(w) ? { k: 'Schwelle', v: w.art === 'psk' ? 'Mit Schwelle (PSK)' : ov(w, 'schwelle', lab('schwelle', tuerCfg(w).schwelle)) + (w.art === 'balkon' ? ', Fußboden ' + ((w.bt || {}).boden === 'neu' ? 'wird erneuert' : 'bleibt') : '') } : { k: 'Fensterbank', v: 'innen ' + ov(w, 'fbi', lab('fbi', w.fbi)) + ', außen ' + ov(w, 'fba', lab('fba', w.fba)) });
  rows.push({ k: 'Montage', v: istOffen(w, 'montage') ? 'Nach Vorschlag des Fensterbauers' : [w.neu ? (w.durchbruch ? 'Wanddurchbruch samt Sturz' : '') : (w.demontage ? 'Altfenster ausbauen und entsorgen' : ''), w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'Nur Lieferung' });
  if (w.notiz) rows.push({ k: 'Notiz', v: w.notiz });
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
/* Kamera für einen geöffneten Flügel: von der Griffseite aus sieht man ihn aufschwingen */
function openView(x, base) { if (!x) return base; if (x.t === 'S' || x.t === 'X') return base; if (x.t === 'K') return [base[0] - 6, base[1]]; return [base[0], x.din === 'L' ? -30 : 30]; }
function w3dCalc(w, o) {
  o = o || {};
  const d = derive(w), haveMo = !!(d.moW && d.moH), moW = d.moW || o.moW || 1250, moH = d.moH || o.moH || 1480;
  const elW = d.elW || Math.round(moW - 60), elH = d.elH || Math.round(moH - 40);
  /* Türen: tieferer Blendrahmen mit zwei Laufebenen (Hebe-Schiebe) bzw. Laufschiene (Falt, PSK), unten die Schwelle statt des Rahmenprofils.
     Die Balkontür hat Fensterprofile (gleiche Tiefe, Pfosten zwischen zwei Flügeln), steht aber wie jede Tür auf dem Boden */
  const tuer = istTuer(w), art = w.art || 'fenster', fd = art === 'hst' ? 170 : art === 'balkon' ? W3D.FD : tuer ? 90 : W3D.FD;
  const schw = tuer ? tuerCfg(w).schwelle : '', pfB = tuer ? (schw === 'null' ? 16 : schw === 'standard' ? 62 : 28) : W3D.PF;
  const laib = num(w.laib) || (w.ki && w.ki.laib) || 140, T = laib + fd + W3D.OUTD;
  const sw = o.stageW || 358, sh = o.stageH || 360;
  const s = o.s || Math.min(sw * (o.fitW || 0.64) / moW, sh * (o.fitH || 0.7) / moH);
  const n = Math.max(1, w.sashes.length), pf = W3D.PF, sf = W3D.SF, mul = tuer && art !== 'balkon' ? 0 : w.teilung === '2s' ? 8 : W3D.MUL;
  const innerW = elW - 2 * pf, innerH = elH - pf - pfB, olH = w.ol ? Math.round(Math.min(innerH * 0.6, Math.max(innerH * 0.26, formSenke(w.form, innerW, innerH)))) : 0;
  const ulH = w.ul && art === 'fenster' && w.form !== 'rund' ? Math.round(clamp(num(w.ulH) || 400, 200, Math.max(200, (innerH - olH) * 0.55))) : 0;
  const sashH = innerH - (olH ? olH + mul : 0) - (ulH ? ulH + W3D.MUL : 0), sashW = (innerW - mul * (n - 1)) / n;
  return { s: s, moW: moW, moH: moH, elW: elW, elH: elH, laib: laib, T: T, fd: fd, pfB: pfB, tuer: tuer, art: art, n: n, pf: pf, sf: sf, mul: mul, innerW: innerW, innerH: innerH, olH: olH, ulH: ulH, sashH: sashH, sashW: sashW, haveMo: haveMo, haveEl: !!(d.elW && d.elH),
    x0: -elW / 2, y0: moH / 2 - elH, wallW: moW + W3D.MARGIN_W, wallH: moH + W3D.MARGIN_H, showEl: o.showEl !== false, dims: o.dims || [], active: o.active || '' };
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
function formSenke(form, b, h) { return form === 'rundbogen' ? Math.min(b / 2, h * 0.8) : form === 'segment' ? Math.min(b * 0.15, h * 0.35) : form === 'schraeg' ? h * 0.42 : 0; }
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
  for (let k = 0; k <= FORM_O; k++) { const x = form === 'rundbogen' ? cx - (bw / 2) * Math.cos(Math.PI * k / FORM_O) : bx + bw * k / FORM_O; pts.push([x, top(x)]); }
  for (let k = 0; k <= FORM_U; k++) pts.push([bx + bw - bw * k / FORM_U, by + bh]);
  return { xl: bx, xr: bx + bw, top: top, bot: () => by + bh, pts: pts, rund: false };
}
/* Rechteck (x, y, b, h) geschnitten mit einer Form: oben J Punkte (links nach rechts), unten J Punkte (zurück). x ist kosinusverteilt,
   so liegen die Punkte dort dicht, wo ein Bogen steil wird; beim Kreis ergibt das genau gleiche Winkelschritte. */
function formSchnitt(g, x, y, b, h, J) {
  const xa = Math.max(x, g.xl), xb = Math.min(x + b, g.xr), o = [], u = [];
  for (let j = 0; j < J; j++) {
    const xx = xa + (xb - xa) * (1 - Math.cos(Math.PI * j / (J - 1))) / 2, yt = Math.min(y + h, Math.max(y, g.top(xx))), yb = Math.max(yt, Math.min(y + h, g.bot(xx)));
    o.push([xx, yt]); u.unshift([xx, yb]);
  }
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
function facadeBg(k) {
  if (k === 'klinker') return 'repeating-linear-gradient(0deg, #b85c42 0 18px, #bfb6a9 18px 21px), repeating-linear-gradient(90deg, transparent 0 38px, #bfb6a9 38px 41px)';
  if (k === 'holz') return 'repeating-linear-gradient(90deg, #a67a4e 0 26px, #8f6540 26px 28px)';
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
const sonneAktiv = (w) => (w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen') && (w.roll === 'aufsatz' || w.roll === 'vorbau');
const innenAktiv = (w) => !!w.iart && w.iart !== 'keiner';
/* Behang außen: Rollladenpanzer (Lamellen 40 mm), Raffstore (gekantete Lamellen 80 mm), Screen (Gewebe, durchscheinend) */
function behangBg(w, s) {
  const c = sonneFarbeW(w), F = c[0], D = c[1], L = c[2];
  if (w.sart === 'raffstore') return 'repeating-linear-gradient(180deg, ' + D + ' 0 ' + px(14 * s) + ', ' + F + ' ' + px(14 * s) + ' ' + px(50 * s) + ', ' + L + ' ' + px(50 * s) + ' ' + px(62 * s) + ', ' + F + ' ' + px(62 * s) + ' ' + px(80 * s) + ')';
  if (w.sart === 'screen') return 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .16) 0 1px, transparent 1px ' + px(Math.max(2.5, 18 * s)) + '), repeating-linear-gradient(180deg, rgba(0, 0, 0, .08) 0 1px, transparent 1px ' + px(Math.max(2.5, 18 * s)) + '), ' + F;
  return 'repeating-linear-gradient(180deg, ' + L + ' 0 ' + px(2 * s + 0.6) + ', ' + F + ' ' + px(2 * s + 0.6) + ' ' + px(34 * s) + ', ' + D + ' ' + px(34 * s) + ' ' + px(40 * s) + ')';
}
/* Innen: Rollo (Stoff), Plissee (Falten 20 mm), Jalousie (Lamellen 25 mm mit Lichtspalt) */
function innenBg(w, s) {
  const c = innenFarbeW(w), F = c[0], D = c[1], L = c[2];
  if (w.iart === 'plissee') return 'repeating-linear-gradient(180deg, ' + L + ' 0 ' + px(10 * s) + ', ' + D + ' ' + px(10 * s) + ' ' + px(20 * s) + ')';
  if (w.iart === 'jalousie') return 'repeating-linear-gradient(180deg, ' + D + ' 0 ' + px(3 * s) + ', ' + F + ' ' + px(3 * s) + ' ' + px(19 * s) + ', transparent ' + px(19 * s) + ' ' + px(25 * s) + ')';
  return 'linear-gradient(90deg, ' + F + ', ' + L + ' 50%, ' + F + ')';
}
function barBg(w, fcol, side) {
  if (w.spross === 'szr') return 'linear-gradient(180deg, #d9d9d6, #bdbdb9)';
  if (w.spross === 'echt') return fcol.bg;
  if (w.spross === 'auf' && w.aufSeite && w.aufSeite !== 'beide' && w.aufSeite !== side) return 'transparent';
  return fcol.bg;
}
/* Öffnendes Element der Bühne: Klassen, Signatur, Höhe, Blickwinkel */
function w3dHuelle(w, o) {
  const view = VIEWS[o.view || 'inside'], G = w3dGeformt(w, o);
  return '<div class="w3d-stage' + (o.sway ? ' is-live' : '') + (o.symbols ? ' show-sym' : '') + (o.cls ? ' ' + o.cls : '') + '" id="' + (o.id || 'w3d') + '" data-struct="' + (G ? 'g' : 'e') + '" data-sig="' + esc(w3dSig(w, o)) + '" style="' + (o.stageH === 'auto' ? '' : 'height: ' + (o.stageH || 360) + 'px; ') + '--rx: ' + view[0] + 'deg; --ry: ' + view[1] + 'deg" data-view="' + (o.view || 'inside') + '">';
}
/* Struktur einmal bauen; die Geometrie setzt w3dLayout */
function w3dHTML(w, o) {
  o = o || {};
  const V = w3dCalc(w, o), view = VIEWS[o.view || 'inside'], fin = rahmenFarbe(w, 'innen'), fout = rahmenFarbe(w, 'aussen'), hcol = griffFarbe(w).bg;
  const faceEl = (role, cls, extra) => '<div class="w3d-f ' + cls + '" data-r="' + role + '"' + (extra || '') + '></div>';
  const G = w3dGeformt(w, o);
  let h = w3dHuelle(w, o) + (o.bg ? '<div class="w3d-bg" style="background-image: url(' + o.bg + ')"></div>' : '') + '<div class="w3d-cam"><div class="w3d-sway"><div class="w3d-world">';
  h += faceEl('wall-in', 'w3d-wall-in'); h += faceEl('wall-out', 'w3d-wall-out', ' style="background: ' + facadeBg(w.fassade) + '"');
  if (G) { for (let k = 0; k < FORM_O + FORM_U + 2; k++) h += faceEl('rs-' + k, 'w3d-rev w3d-rs'); }
  else h += faceEl('rev-t', 'w3d-rev w3d-rev-t') + faceEl('rev-b', 'w3d-rev w3d-rev-b') + faceEl('rev-l', 'w3d-rev w3d-rev-l') + faceEl('rev-r', 'w3d-rev w3d-rev-r');
  /* Türen stehen auf dem Boden: Raumboden innen, Terrasse außen */
  if (V.tuer) h += faceEl('floor-in', 'w3d-floor w3d-floor-in') + faceEl('floor-out', 'w3d-floor w3d-floor-out');
  const bi = bank(w.fbi, 'innen'), ba = bank(w.fba, 'aussen');
  h += faceEl('sill-t', 'w3d-sill', ' style="background: ' + bi.oben + '"') + faceEl('sill-f', 'w3d-sill w3d-sill-f', ' style="background: ' + bi.stirn + '"') + faceEl('sill-l', 'w3d-sill w3d-sill-e', ' style="background: ' + bi.stirn + '"') + faceEl('sill-r', 'w3d-sill w3d-sill-e', ' style="background: ' + bi.stirn + '"');
  h += faceEl('sa-t1', 'w3d-sill', ' style="background: ' + ba.oben + '"') + faceEl('sa-t2', 'w3d-sill', ' style="background: ' + ba.oben + '"') + faceEl('sa-f', 'w3d-sill w3d-sill-f', ' style="background: ' + ba.stirn + '"');
  h += '<div class="w3d-el' + (V.showEl ? '' : ' is-hidden') + '" data-r="el">';
  h += faceEl('el-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('el-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
  h += faceEl('fuge', 'w3d-fuge'); // Einbaufuge rundum, sonst sieht man zwischen Rahmen und Laibung ins Leere
  if (!G) ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('el-side-' + k, 'w3d-frame w3d-side', ' style="background-color: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
  if (w.ol) h += faceEl('ol-front', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('ol-glass', 'w3d-glass') + faceEl('ol-back', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"') + faceEl('kf', 'w3d-frame', ' style="background: ' + fin.bg + '"') + faceEl('kfb', 'w3d-frame w3d-back', ' style="background: ' + fout.bg + '"');
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
    h += faceEl('sf-out-' + i, 'w3d-frame w3d-sf w3d-back', ' style="background: ' + fout.bg + '"');
    ['l', 'r', 't', 'b'].forEach((k) => { h += faceEl('sfe-' + k + '-' + i, 'w3d-frame w3d-side w3d-sfe', ' style="background-color: ' + (k === 'l' || k === 'r' ? fout.solid : fin.solid) + '"'); });
    h += '<div class="w3d-handle" data-r="handle-' + i + '" style="background: ' + hcol + '"></div>';
    /* Balkontür: Griff außen (Ziehgriff mit Schnäpper oder abschließbar) auf der Außenseite des Gehflügels */
    if (w.art === 'balkon') h += '<div class="w3d-griffa" data-r="ga-' + i + '" style="background: ' + hcol + '"></div>';
    h += '<div class="w3d-selring" data-r="ring-' + i + '"></div>';
    h += '</div>';
  });
  h += '</div>';
  if (w.roll === 'vorbau' || w.roll === 'aufsatz') h += faceEl('roll-f', 'w3d-roll') + faceEl('roll-b', 'w3d-roll w3d-roll-b') + faceEl('roll-t', 'w3d-roll w3d-roll-t') + faceEl('roll-l', 'w3d-roll w3d-roll-s') + faceEl('roll-r', 'w3d-roll w3d-roll-s');
  /* Sonnenschutz außen: Behang halb herabgelassen, Endleiste unten; innen: Rollo, Plissee oder Jalousie vor dem Glas */
  if (sonneAktiv(w)) h += faceEl('behang', 'w3d-behang') + faceEl('behang-u', 'w3d-behang-u');
  if (innenAktiv(w)) h += faceEl('innen-k', 'w3d-innen-k') + faceEl('innen', 'w3d-innen') + faceEl('innen-u', 'w3d-innen-u');
  if (w.insekt && w.insekt !== 'keiner') h += faceEl('mesh', 'w3d-mesh');
  (V.dims || []).forEach((k) => { h += dimHTML(k, V.active === k); });
  h += '</div></div></div>';
  h += '<span class="w3d-hint" data-r="hint"' + (o.hint ? '' : ' hidden') + '>' + esc(o.hint || '') + '</span>';
  if (o.lupe) h += '<div class="w3d-lupe" data-r="lupe" data-k="' + esc(glasLupeKey(w)) + '">' + glasLupe(w) + '</div>';
  h += '<div class="rail rail-h" data-rail="v" hidden></div><div class="rail rail-v" data-rail="h" hidden></div>';
  return h + '</div>';
}
const dimHTML = (k, active) => '<div class="w3d-dim ' + (k[0] === 'e' ? 'el' : 'mo') + (active ? ' is-active' : '') + '" data-r="dim-' + k + '" data-dim="' + k + '"><span class="w3d-dim-line"></span><span class="w3d-dim-cap a"></span><span class="w3d-dim-cap b"></span><span class="w3d-dim-lab" data-r="lab-' + k + '"></span></div>';
function symPaths(w, x) {
  if (x.t === 'X') return '';
  if (x.t === 'PS') return symPaths(w, { t: 'S', din: x.din }) + symPaths(w, { t: 'K', din: x.din });
  if (x.t === 'S') { const d = x.din === 'L' ? 1 : -1, a = 50 - d * 26, b = 50 + d * 26; return '<path d="M' + a + ' 56H' + b + 'M' + (b - d * 7) + ' 49L' + b + ' 56L' + (b - d * 7) + ' 63" fill="none" stroke="rgba(29,29,31,.45)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'; }
  return sym(0, 0, 100, 100, x.t === 'P' ? 'D' : x.t, x.din, w.richtung === 'aussen' ? '5 4' : undefined, 'rgba(29,29,31,.45)', 1).map((p) => '<path d="' + p.d + '" fill="none" stroke="' + p.s + '" stroke-width="1.2"' + (p.da ? ' stroke-dasharray="' + p.da + '"' : '') + ' vector-effect="non-scaling-stroke"></path>').join(''); }
/* Lupe: Schnitt durch die Unterkante des Flügels, groß genug zum Lesen. Links Raum, rechts außen. Zeigt Scheibenzahl,
   Abstandhalter, Gasfüllung, Glasleiste und Dichtungen; Schallschutz (dickere Außenscheibe), Sicherheitsglas (Folie im Verbund),
   Sonnenschutz (Beschichtung innen auf der Außenscheibe), Sichtschutz (raue Raumseite). */
function glasLupe(w) {
  const fn = w.glasfn || [], drei = w.glas !== '2', vsg = fn.indexOf('vsg') >= 0 || w.rc === 'rc2', schall = fn.indexOf('schall') >= 0, sonne = fn.indexOf('sonne') >= 0, sicht = fn.indexOf('sicht') >= 0;
  const sch = [{ d: schall ? 8 : 5, schicht: sonne }]; if (drei) sch.push({ d: 5 }); sch.push({ d: vsg ? 8 : 5, folie: vsg, matt: sicht });
  const zw = drei ? 12 : 17, breit = sch.reduce((a, x) => a + x.d, 0) + zw * (sch.length - 1), xr = 52 + breit / 2;
  const R = (x, y, b, h, f, extra) => '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(b) + '" height="' + n1(h) + '" fill="' + f + '"' + (extra || '') + '/>';
  let h = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="lupe-k"><circle cx="50" cy="50" r="46"/></clipPath>' +
    '<pattern id="lupe-m" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><circle cx="1.1" cy="1.1" r=".55" fill="#ffffff"/></pattern></defs><g clip-path="url(#lupe-k)">';
  h += R(0, 0, 100, 100, '#3b3733') + R(52, 0, 48, 100, '#232a31');
  /* Glaspaket von außen (rechts) nach innen */
  let x = xr; const lagen = [];
  sch.forEach((g, k) => { x -= g.d; lagen.push([x, g]); if (k < sch.length - 1) { x -= zw; lagen.push([x, null]); } });
  lagen.forEach((l) => {
    const gx = l[0], g = l[1];
    if (!g) { h += R(gx, -2, zw, 72, 'rgba(150, 196, 236, .32)') + R(gx + 1.2, 60, zw - 2.4, 8, '#4d545c', ' rx="1"') + R(gx + 2.6, 61.6, zw - 5.2, 1.4, 'rgba(255, 255, 255, .45)') + R(gx + 0.6, 68, zw - 1.2, 3.4, '#1f2226'); return; }
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
  h += R(xi - 10, 54, 10, 14, '#ffffff', ' rx="1.4" stroke="#6a7178" stroke-width="1.1"') + R(xi - 2.6, 50, 2.6, 6, '#1f2226', ' rx="1"') + R(xr, 50, 2.6, 6, '#1f2226', ' rx="1"');
  if (schall) h += '<path d="M83 33c3.4 3.4 3.4 10.6 0 14M79 36c1.8 1.8 1.8 6.2 0 8" fill="none" stroke="#4f7fae" stroke-width="1.8" stroke-linecap="round"/>';
  if (sonne) h += '<circle cx="77" cy="20" r="4" fill="#e2a93b"/><path d="M77 12.8v1.8M77 25.4v1.8M69.8 20h1.8M82.4 20h1.8M71.9 14.9l1.2 1.2M80.9 23.9l1.2 1.2M71.9 25.1l1.2-1.2M80.9 16.1l1.2-1.2" stroke="#e2a93b" stroke-width="1.3" stroke-linecap="round"/>';
  h += '</g><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(243, 242, 238, .5)" stroke-width="1.6"/></svg>';
  return h;
}
const glasLupeKey = (w) => [w.glas, (w.glasfn || []).join(','), w.rc].join('|');
const glasText = (w) => (w.glas === '2' ? '2 Scheiben · Ug ≈ 1,1' : '3 Scheiben · Ug ≈ 0,5 bis 0,7');
/* Struktur-Signatur: solange sie gleich bleibt, wird die Bühne weiterverwendet und alles morpht mit Übergängen */
function w3dSig(w, o) { o = o || {}; const V = w3dCalc(w, o); return [o.id || 'w3d', w.art || 'fenster', w3dGeformt(w, o) ? 'g' : 'e', w.sashes.length, w.ol ? 1 : 0, w.roll === 'vorbau' || w.roll === 'aufsatz' ? 1 : 0, w.insekt && w.insekt !== 'keiner' ? 1 : 0, w.bars.map((b) => b.id).join(','), o.bg ? 1 : 0, V.tuer ? 't' : 'f', V.ulH ? 1 : 0, sonneAktiv(w) ? 1 : 0, innenAktiv(w) ? 1 : 0].join('|'); }
/* Farben und Materialien auf die Flächen schreiben (mit Übergang, wenn sich etwas ändert) */
function w3dPaint(stage, w) {
  /* Nur schreiben, was sich geändert hat (der Vergleich mit dem gelesenen Stil schlägt bei Verläufen immer fehl) */
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), bg = (r, v) => { const el = q(r); if (el && el._bg !== v) { el._bg = v; el.style.background = v; } }, bgc = (r, v) => { const el = q(r); if (el && el._bg !== v) { el._bg = v; el.style.backgroundColor = v; } };
  const fin = rahmenFarbe(w, 'innen'), fout = rahmenFarbe(w, 'aussen'), hcol = griffFarbe(w).bg;
  stage.classList.toggle('glas-sonne', w.glasfn.indexOf('sonne') >= 0); stage.classList.toggle('glas-sicht', w.glasfn.indexOf('sicht') >= 0);
  stage._orn = (ORN.find((o) => o.k === w.orn) || ORN[0]).bg; stage.style.setProperty('--orn', stage._orn); stage.setAttribute('data-scheiben', w.glas === '2' ? '2' : '3');
  stage.classList.toggle('mit-schloss', w.rc === 'rc2' || w.griff === 'abschliessbar');
  const bi = bank(w.fbi, 'innen'), ba = bank(w.fba, 'aussen');
  bg('wall-out', facadeBg(w.fassade)); bg('sill-t', bi.oben); bg('sill-f', bi.stirn); bg('sill-l', bi.stirn); bg('sill-r', bi.stirn); bg('sa-t1', ba.oben); bg('sa-t2', ba.oben); bg('sa-f', ba.stirn);
  bg('el-front', fin.bg); bg('el-back', fout.bg); bgc('el-side-l', fout.solid); bgc('el-side-r', fout.solid); bgc('el-side-t', fin.solid); bgc('el-side-b', fin.solid);
  bg('ol-front', fin.bg); bg('ol-back', fout.bg); bg('kf', fin.bg); bg('kfb', fout.bg);
  bg('ul-front', fin.bg); bg('ul-back', fout.bg); bg('kfu', fin.bg); bg('kfub', fout.bg);
  const paneel = w.ul && w.ulA === 'paneel', ug = q('ul-glass'), upb = q('ul-pan-b');
  if (ug) { ug.classList.toggle('w3d-glass', !paneel); ug.classList.toggle('w3d-paneel', paneel); ug._bg = paneel ? fin.solid : ''; ug.style.background = ug._bg; }
  if (upb) { upb._bg = fout.solid; upb.style.background = upb._bg; upb.style.opacity = paneel ? '' : '0'; }
  if (sonneAktiv(w)) { const c = sonneFarbeW(w); bg('roll-f', 'linear-gradient(180deg, ' + c[2] + ', ' + c[0] + ' 30%, ' + c[1] + ')'); bg('roll-b', c[1]); bg('roll-t', c[2]); bg('roll-l', c[0]); bg('roll-r', c[0]); }
  else { bg('roll-f', ''); bg('roll-b', ''); bg('roll-t', ''); bg('roll-l', ''); bg('roll-r', ''); }
  w.sashes.forEach((x, i) => {
    bg('mul-' + i, fin.bg); bg('mulb-' + i, fout.bg); bg('sf-in-' + i, fin.bg); bg('sf-out-' + i, fout.bg); bg('handle-' + i, hcol); bg('ga-' + i, hcol);
    bgc('sfe-l-' + i, fout.solid); bgc('sfe-r-' + i, fout.solid); bgc('sfe-t-' + i, fin.solid); bgc('sfe-b-' + i, fin.solid);
    const sash = q('sash-' + i); if (sash) { sash.classList.toggle('is-fixed', x.t === 'F' || x.t === 'X'); sash.classList.toggle('is-schiebe', x.t === 'S'); sash.setAttribute('data-t', x.t); sash.setAttribute('data-din', x.din); sash.style.setProperty('--sdir', x.din === 'L' ? '1' : '-1'); }
    const sv = q('sym-' + i); if (sv) { const p = symPaths(w, x); if (sv.getAttribute('data-k') !== x.t + x.din + w.richtung) { sv.innerHTML = p; sv.setAttribute('data-k', x.t + x.din + w.richtung); } }
  });
  w.bars.forEach((b) => { const be = q('bar-' + b.id); if (be) { be._bi = barBg(w, fin, 'innen'); be._bo = barBg(w, fout, 'aussen'); be._art = holzig(fin) && w.spross !== 'szr' ? 'holz' : ''; be._arto = holzig(fout) && w.spross !== 'szr' ? 'holz' : ''; be.style.setProperty('--bi', be._bi); be.style.setProperty('--bo', be._bo); } });
  w3dOberflaeche(stage, w, fin, fout);
}
/* Oberflächen für die WebGL-Bühne (buehne.js): Holzdekor mit Maserung, Fensterbänke aus Naturstein, Holz und Aluminium,
   Fassade als Klinker, Holz, Putz oder WDVS. Das CSS-Modell zeigt weiter die Verläufe aus BANK, WOOD und facadeBg. */
const holzig = (c) => !!(c && /Holzdekor/.test(c.code || ''));
const BANK_ART = { stein: 'granit', holz: 'holz', alu: 'alu' };
const FASSADE_ART = { klinker: 'klinker', holz: 'holzfassade', wdvs: 'putzfein' };
function w3dOberflaeche(stage, w, fin, fout) {
  const setz = (r, k) => { const el = stage.querySelector('[data-r="' + r + '"]'); if (el) el._art = k; };
  const hi = holzig(fin) ? 'holz' : '', ha = holzig(fout) ? 'holz' : '';
  ['el-front', 'ol-front', 'kf', 'ul-front', 'kfu', 'el-side-t', 'el-side-b'].forEach((r) => setz(r, hi));
  ['el-back', 'ol-back', 'kfb', 'ul-back', 'kfub', 'el-side-l', 'el-side-r', 'ul-pan-b'].forEach((r) => setz(r, ha));
  setz('ul-glass', w.ul && w.ulA === 'paneel' ? hi : '');
  w.sashes.forEach((x, i) => { ['mul-', 'sf-in-', 'sfe-t-', 'sfe-b-'].forEach((r) => setz(r + i, hi)); ['mulb-', 'sf-out-', 'sfe-l-', 'sfe-r-'].forEach((r) => setz(r + i, ha)); });
  const bi = BANK_ART[w.fbi] || '', ba = w.fba === 'alu' ? 'alu' : '';
  ['sill-t', 'sill-f', 'sill-l', 'sill-r'].forEach((r) => setz(r, bi)); ['sa-t1', 'sa-t2', 'sa-f'].forEach((r) => setz(r, ba));
  setz('wall-out', FASSADE_ART[w.fassade] || 'putz');
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
  let lupe = stage.querySelector('[data-r="lupe"]');
  if (o.lupe) { const key = glasLupeKey(w); if (!lupe) { stage.insertAdjacentHTML('beforeend', '<div class="w3d-lupe" data-r="lupe"></div>'); lupe = stage.querySelector('[data-r="lupe"]'); } if (lupe.getAttribute('data-k') !== key) { lupe.innerHTML = glasLupe(w); lupe.setAttribute('data-k', key); if (window.Feier) window.Feier.einrasten(lupe); } }
  else if (lupe) lupe.remove();
  stage.querySelectorAll('.w3d-sash').forEach((sa) => { sa.classList.toggle('is-sel', !!o.selectable && +sa.getAttribute('data-sash') === o.selSash); });
  stage.querySelectorAll('.w3d-bar').forEach((b) => { b.classList.toggle('is-edit', !!o.editBars); b.classList.toggle('is-sel', !!o.editBars && b.getAttribute('data-bar') === o.selBar); });
  ensureDims(stage, o); w3dPaint(stage, w);
  const V = w3dLayout(stage, w, o, gr); layoutRails(stage, w, o, gr); stage._s = V ? V.s : 0.15;
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
  const V = w3dCalc(w, Object.assign({}, o, { stageW: gr ? gr[0] : stage.clientWidth || 358, stageH: gr ? gr[1] : stage.clientHeight || 360 })), s = V.s;
  const q = (r) => stage.querySelector('[data-r="' + r + '"]'), G = stage.getAttribute('data-struct') === 'g', form = G ? (w.form || 'rechteck') : 'rechteck';
  const moW = V.moW * s, moH = V.moH * s, T = V.T * s, d = V.laib * s, fd = V.fd * s, sd = W3D.FD * s, wallW = V.wallW * s, wallH = V.wallH * s, tuer = V.tuer;
  const gO = G ? formGeo(form, -moW / 2, -moH / 2, moW, moH) : null;
  W3D_SOFORT = stage.classList.contains('no-anim') || ruhig();
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
  const OVA = 50 * s, SXA = 30 * s, LIP = (w.fba === 'alu' ? 40 : 30) * s, NG = 7 * Math.PI / 180, bwA = moW + 2 * SXA, bxA = -moW / 2 - SXA;
  face(q('sa-t1'), moW, Math.max(0, T - d - fd), -moW / 2, yB, -d - fd, 'rotateX(-90deg)', '0 0');
  face(q('sa-t2'), bwA, OVA / Math.cos(NG), bxA, yB, -T, 'rotateX(' + n1(-90 + 7) + 'deg)', '0 0');
  face(q('sa-f'), bwA, LIP, bxA, yB + OVA * Math.tan(NG), -T - OVA, 'rotateY(180deg)', '50% 50%');
  ['sill-t', 'sill-f', 'sill-l', 'sill-r', 'sa-t1', 'sa-t2', 'sa-f'].forEach((r) => { const e = q(r); if (e) e.style.opacity = ohneBank ? '0' : ''; });
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
  const olH = V.olH * s, sashTop = iy + (olH ? olH + mul : 0), sashH = V.sashH * s, sashW = V.sashW * s;
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
    face(q('kf'), iw, mul, ix, iy + olH, z0, '', '0 0');
    face(q('kfb'), iw, mul, ix, iy + olH, z0 - fd, 'rotateY(180deg)', '50% 50%');
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
    const mx = ix + (i + 1) * sashW + i * mul, c = G ? formSchnitt(gI, mx, sashTop, mul, sashH, 3) : null;
    face(q('mul-' + i), mul, sashH, mx, sashTop, z0, '', '0 0', c ? polyClip(c, mx, sashTop, mul, sashH) : null);
    face(q('mulb-' + i), mul, sashH, mx, sashTop, z0 - fd, 'rotateY(180deg)', '50% 50%', c ? polyClip(c, mx, sashTop, mul, sashH, mul) : null);
  }
  w.sashes.forEach((x, i) => {
    /* Hebe-Schiebe-Tür: das Festteil sitzt in der äußeren Laufebene mit eigenem Profil, der Schiebeflügel innen davor */
    const sash = q('sash-' + i), fixed = x.t === 'F', hstFest = fixed && V.art === 'hst', ssf = hstFest ? sf * 0.75 : fixed ? 3 : sf, left = ix + i * (sashW + mul), zS = hstFest ? -(fd - sd) : 0;
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
    /* Einbruchschutz: Pilzköpfe auf dem Flügelrahmen (sonst unsichtbar im Falz, hier gezeigt). RC1 N an den Seiten, RC2 rundum */
    const pz = fixed || x.t === 'X' ? 0 : w.rc === 'rc2' ? 8 : w.rc === 'rc1' ? 4 : 0, dm = Math.max(6, 34 * s), c = sf / 2;
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
    /* Griff: der Drehpunkt sitzt auf halber Höhe, der Hebel hängt nach unten; bei Formen innerhalb der Glasfläche */
    const hd = q('handle-' + i);
    if (hd) {
      const hl = 135 * s, hw = Math.max(5, 22 * s);
      hd.style.transform = 'none';
      if (x.t === 'S') {
        /* Hebegriff: lang, auf der Schließseite, Mitte etwa 1.050 mm über dem Boden */
        const hhl = 320 * s, hhw = Math.max(6, 30 * s), hx = x.din === 'L' ? sf / 2 - hhw / 2 : sashW - sf / 2 - hhw / 2, ym = Math.max(hhl, Math.min(sashH - 180 * s, sashH - 1050 * s + hhl / 2));
        hd.style.width = px(hhw); hd.style.height = px(hhl); hd.style.transformOrigin = '50% 50%';
        hd.style.translate = px(hx) + ' ' + px(ym - hhl) + ' 6px';
        w3dWerte(hd, '_h', { w: hhw, h: hhl, tx: hx, ty: ym - hhl, tz: 6, ox: hhw / 2, oy: hhl / 2 });
      } else if (x.t === 'PS') {
        /* PSK: Griff wie am Fenster, auf der Schließseite, etwa 1.050 mm über dem Boden */
        const hx = x.din === 'L' ? sf / 2 - hw / 2 : sashW - sf / 2 - hw / 2, ym = Math.max(hw, Math.min(sashH - hl - sf, sashH - 1050 * s));
        hd.style.width = px(hw); hd.style.height = px(hl); hd.style.transformOrigin = '50% ' + px(hw / 2);
        hd.style.translate = px(hx) + ' ' + px(ym - hw / 2) + ' 5px';
        w3dWerte(hd, '_h', { w: hw, h: hl, tx: hx, ty: ym - hw / 2, tz: 5, ox: hw / 2, oy: hw / 2 });
      } else if (x.t === 'K') {
        const yt = G ? Math.max(0, gI.top(left + sashW / 2) - sashTop) : 0;
        hd.style.width = px(hl); hd.style.height = px(hw); hd.style.transformOrigin = '50% 50%';
        hd.style.translate = px(sashW / 2 - hl / 2) + ' ' + px(yt + Math.max(2, sf / 2 - hw / 2)) + ' 5px';
        w3dWerte(hd, '_h', { w: hl, h: hw, tx: sashW / 2 - hl / 2, ty: yt + Math.max(2, sf / 2 - hw / 2), tz: 5, ox: hl / 2, oy: hw / 2 });
      } else {
        const hx = x.din === 'L' ? sashW - sf / 2 - hw / 2 : sf / 2 - hw / 2, xw = left + hx + hw / 2;
        const yt = G ? Math.max(0, gI.top(xw) - sashTop) : 0, yb = G ? Math.min(sashH, gI.bot(xw) - sashTop) : sashH;
        const ym = Math.max(yt + hw, Math.min(sashH / 2, yb - hl - sf / 2));
        hd.style.width = px(hw); hd.style.height = px(hl); hd.style.transformOrigin = '50% ' + px(hw / 2);
        hd.style.translate = px(hx) + ' ' + px(ym - hw / 2) + ' 5px';
        w3dWerte(hd, '_h', { w: hw, h: hl, tx: hx, ty: ym - hw / 2, tz: 5, ox: hw / 2, oy: hw / 2 });
      }
    }
    /* Griff außen der Balkontür: am Gehflügel, auf der Griffseite, außen vor dem Flügelrahmen */
    const ga = q('ga-' + i);
    if (ga) {
      const cfg = w.bt || {}, an = w.art === 'balkon' && i === gehFluegel(w) && cfg.griffA && cfg.griffA !== 'keiner', zg = cfg.griffA === 'ziehgriff';
      const gw2 = Math.max(4, (zg ? 26 : 22) * s), gh2 = (zg ? 300 : 140) * s, hx2 = x.din === 'L' ? sashW - sf / 2 - gw2 / 2 : sf / 2 - gw2 / 2, ym2 = Math.max(0, Math.min(sashH - gh2, sashH - 1050 * s - gh2 / 2));
      ga.style.width = px(gw2); ga.style.height = px(gh2); ga.style.transform = 'translate3d(' + px(hx2) + ', ' + px(ym2) + ', ' + px(-sd - 5) + ')'; ga.style.opacity = an ? '1' : '0';
      w3dWerte(ga, '_g', { w: gw2, h: gh2, tx: hx2, ty: ym2, tz: -sd - 5, op: an ? 1 : 0 });
    }
    w.bars.filter((b) => b.s === i).forEach((b) => { w3dBarPos(q('bar-' + b.id), b, Math.max(2, w.breite * s)); });
  });
  if (q('roll-f')) { const rh = 180 * s, rz = w.roll === 'vorbau' ? -T - 140 * s : -T, bw = moW + 80 * s, bx = -moW / 2 - 40 * s, by = -moH / 2 - rh, dp = -rz - T + 1; face(q('roll-f'), bw, rh, bx, by, rz, 'rotateY(180deg)', '50% 50%'); face(q('roll-b'), bw, dp, bx, -moH / 2, -T, 'rotateX(-90deg)', '0 0'); face(q('roll-t'), bw, dp, bx, by, -T, 'rotateX(-90deg)', '0 0'); face(q('roll-l'), dp, rh, bx, by, -T, 'rotateY(90deg)', '0 0'); face(q('roll-r'), dp, rh, bx + bw, by, -T, 'rotateY(90deg)', '0 0'); }
  if (q('mesh')) face(q('mesh'), iw, ih, ix, iy, z0 - fd - 6 * s, '', '0 0', G ? polyClip(gI.pts, ix, iy, iw, ih) : null);
  /* Sonnenschutz außen: Behang zu 42 % herabgelassen, in der Ebene vor dem Rahmen (Aufsatz) bzw. vor der Fassade (Vorbau) */
  const bh = q('behang');
  if (bh) {
    const zb = w.roll === 'vorbau' ? -T - 70 * s : -T + 2, bwB = moW + 20 * s, bxB = -moW / 2 - 10 * s, hB = moH * 0.42, uH = Math.max(3, 36 * s), c = sonneFarbeW(w);
    face(bh, bwB, hB, bxB, -moH / 2, zb, '', '0 0'); bh._bg = behangBg(w, s); bh.style.background = bh._bg; bh.style.opacity = w.sart === 'screen' ? '.86' : '';
    face(q('behang-u'), bwB, uH, bxB, -moH / 2 + hB, zb + 0.4, '', '0 0'); const bu = q('behang-u'); if (bu) { bu._bg = 'linear-gradient(180deg, ' + c[2] + ', ' + c[1] + ')'; bu.style.background = bu._bg; }
  }
  /* Sichtschutz innen: Kassette oben, Behang zu 38 % herab, Endleiste; vor dem Rahmen auf der Raumseite */
  const inn = q('innen');
  if (inn) {
    const zi = z0 + 24 * s, bwI2 = iw + 12 * s, bxI2 = ix - 6 * s, kH = Math.max(3, (w.iart === 'rollo' ? 58 : 36) * s), hI = ih * 0.38, c = innenFarbeW(w);
    face(q('innen-k'), bwI2, kH, bxI2, iy - kH, zi, '', '0 0'); const ik = q('innen-k'); if (ik) { ik._bg = 'linear-gradient(180deg, ' + c[2] + ', ' + c[1] + ')'; ik.style.background = ik._bg; }
    face(inn, bwI2, hI, bxI2, iy, zi - 0.4, '', '0 0'); inn._bg = innenBg(w, s); inn.style.background = inn._bg; inn.style.boxShadow = w.iart === 'jalousie' ? 'none' : '';
    face(q('innen-u'), bwI2, Math.max(2, 14 * s), bxI2, iy + hI, zi, '', '0 0'); const iu = q('innen-u'); if (iu) { iu._bg = c[1]; iu.style.background = iu._bg; }
  }
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
  stage._v = { d: d, fd: fd, T: T, s: s, moW: moW, moH: moH };
  W3D_SOFORT = false;
  return V;
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
  const x0 = V.x0 * s, y0 = V.y0 * s, pf = V.pf * s, sf = V.sf * s, mul = V.mul * s, olH = V.olH * s, sashTop = y0 + pf + (olH ? olH + mul : 0), sashW = V.sashW * s, sashH = V.sashH * s;
  const proj = (x, y) => [cx + x * f, oy + (cy + y - oy) * f];
  return { s: s, sashes: w.sashes.map((x, i) => { const ssf = x.t === 'F' ? 3 : sf, left = x0 + pf + i * (sashW + mul) + ssf, top = sashTop + ssf, a = proj(left, top), b = proj(left + sashW - 2 * ssf, top + sashH - 2 * ssf); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; }) };
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
    /* WebGL-Bühne: die Flächen sind unsichtbar, getroffen wird über die Geometrie */
    const glHit = !hit && window.Buehne3D && window.Buehne3D.aktiv(stage) ? window.Buehne3D.treffer(stage, sx, sy) : -1;
    let moved = false;
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    const move = (ev) => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return; moved = true; stage.classList.add('is-drag'); ry = Math.max(view[1] - 40, Math.min(view[1] + 40, ry0 + dx * 0.35)); rx = Math.max(view[0] - 20, Math.min(view[0] + 20, rx0 - dy * 0.25)); stage.style.setProperty('--rx', rx + 'deg'); stage.style.setProperty('--ry', ry + 'deg'); };
    const up = (ev) => {
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
      stage.classList.remove('is-drag');
      if (!moved && o.onSash && (hit || glHit >= 0)) o.onSash(hit ? +hit.getAttribute('data-sash') : glHit);
    };
    stage.addEventListener('pointermove', move); stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
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
      res.befund = readBefund(await sample.json('', { images: img.blob, signal: signal, aufgabe: neu ? 'wand' : 'einbau', seite: side }), side);
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
const PROJ0 = { gebaeude: 'efh', baujahr: '', total: '', zeit: '3m', budget: 'b0', foerd: false, foerdweg: '', name: '', ort: '', tel: '', mail: '', erreich: 'nm' };
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
  entwurfStand(); // auch als Gast: Stand und „offen“ merken, damit nach dem Sichern alles hochgeht
  lokalSpeichern();
  entwurfPlanen();
}
function normProj(p) { if (p.zeit === 'sofort') p.zeit = 'asap'; if (p.zeit === 'offen') p.zeit = '12m'; if (p.gebaeude === 'altbau') p.gebaeude = 'efh'; return p; }
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
function readHash() {
  const m = /^#k-([a-z0-9]{3,12})(?:-([A-Za-z0-9_]*))?(?:\.([A-Za-z0-9_-]+))?(?:\.([A-Za-z0-9_-]+))?(?:~(\d{1,2}))?$/.exec(location.hash || '');
  if (!m) return null;
  const dec = (v) => { if (!v) return ''; try { const b = v.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); } catch (e) { return ''; } };
  const clean = (t) => String(t || '').replace(/[<>"]/g, '').trim().slice(0, 60);
  return { code: m[1].toLowerCase(), name: clean(dec(m[3]) || (m[2] || '').replace(/_/g, ' ')), kunde: clean(dec(m[4])), runde: m[5] ? +m[5] : 1 };
}
const slug = (t) => String(t || '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
/* ---------- Rendern ---------- */
const $app = () => document.getElementById('app');
let lastScreen = null, toastTimer = null;
function setW(patch) { Object.assign(S.win, patch); render(); }
function setP(patch) { Object.assign(S.proj, patch); persist(); render(); }
/* Kundenschutz: Wer über den Link eines Betriebs misst, bekommt von eeziframes weder das Aufmaßblatt noch einen Code, kann nichts
   kaufen und kein Konto anlegen. Diese Bildschirme gibt es im Link nicht; dort zeigt die App „Prüfen und senden“ (blatt). */
const NUR_EIGENES = { teilen: 1, datei: 1, kasse: 1, gekauft: 1, konto: 1, sichern: 1, meinkonto: 1 };
function go(screen, dir) {
  if (S.betrieb && NUR_EIGENES[screen]) screen = 'blatt';
  if (screen === 'zeichnen' && !planFoto()) { toast('Erst ein Foto der Stelle'); screen = 'fotos'; }
  if (S.screen === 'zeichnen' && screen !== 'zeichnen' && S.win.plan && !S.win.plan.bild) planBildErzeugen(S.win).then(() => { if (S.editIdx >= 0) persist(); });
  if (screen === 'planmasse') planVorgabe(S.win);
  S.dir = dir || 'fwd'; S.screen = screen; S.gloss = null; S.glossIndex = false; S.selBar = null; S.neuFrage = false; S.ohneFotoFrage = false;
  if (screen === 'rest') { const first = REST.findIndex((r) => !num(S.win.mo[r.k])); S.rest = { i: first < 0 ? 4 : first, cur: '', msg: null }; }
  if (screen !== 'frage') S.openSash = -1;
  /* Flügelzahl nach der Breite vorschlagen: Fenster bis 1 m einflügelig, ab 2 m dreiteilig; Balkontür ab 1,3 m zwei Flügel (Stulp) */
  const vorschlag = (art, ew) => (art === 'balkon' ? (ew >= 1300 ? '2s' : '1') : ew && ew < 1000 ? '1' : ew >= 2000 ? '3' : '2p');
  if (screen === 'frage' && !S.win.e_teilung && ((S.win.art || 'fenster') === 'fenster' || S.win.art === 'balkon')) { const ew = derive(S.win).elW || 0, t = vorschlag(S.win.art || 'fenster', ew); if (t !== S.win.teilung) { S.win.teilung = t; S.win.sashes = sashesFor(t); S.win.bars = S.win.preset !== 'keine' && S.win.preset !== 'eigene' ? presetBars(S.win.preset, S.win.sashes.length) : S.win.bars.filter((b) => b.s < S.win.sashes.length); S.selSash = 0; } }
  render(true);
}
function toast(msg) { S.toast = msg; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { S.toast = ''; render(); }, 1900 + Math.min(4000, Math.max(0, String(msg || '').length - 40) * 45)); } // längere Meldungen bleiben länger stehen (bis drei Zeilen)
function render(fresh) {
  if (NEU_LADEN && RUHIG.includes(S.screen)) { location.reload(); return; } // Anmeldung in einem anderen Tab geändert (siehe unten)
  const root = $app(), scroller = root.querySelector('.scroll'), keep = !fresh && scroller ? scroller.scrollTop : 0;
  const view = SCREENS[S.screen] ? SCREENS[S.screen]() : SCREENS.home();
  const STEPS = stepsFor(S.win), si = STEPS.indexOf(S.screen), wiz = si >= 0;
  const qShare = S.screen === 'frage' && view.qpos ? view.qpos : 1;
  const title = wiz ? (S.editIdx >= 0 ? (S.win.name || artName(S.win)) : (istTuer(S.win) ? 'Neue Tür' : S.win.art === 'fest' ? 'Neue Verglasung' : 'Neues Fenster')) : ({ fertig: 'Fenster', anfrage: 'Angaben', anfrage2: 'Angaben', anfrage3: 'Angaben', blatt: !S.betrieb ? 'Aufmaßblatt' : (S.sent ? (PILOT ? 'Senden' : 'Gesendet') : 'Prüfen'), gesendet: '', teilen: '', kasse: 'Kasse', konto: 'Kasse', sichern: 'Konto', meinkonto: 'Konto', linkanmelden: 'Konto', tour: 'Führung' }[S.screen] || '');
  const tourP = S.screen === 'tour' && S.tour ? (S.tour.i + 1) / TOUR.length : 0;
  const prevStage = root.querySelector('#w3d'), prevSig = prevStage ? prevStage.getAttribute('data-sig') : null;
  const backLabel = view.back ? view.back[0] : '';
  let h = '<header class="hdr"><div class="hdr-row">';
  h += S.screen === 'home' ? '<div class="hdr-logo">' + LOGO(30) + '<span class="hdr-name">' + WM() + '</span></div>'
    : (view.back ? '<button type="button" class="hdr-btn" data-act="back">' + (view.back[1] === 'tour-ende' ? '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path></svg>' : '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>') + '<span>' + esc(backLabel) + '</span></button>' : '<span></span>');
  h += '<span class="hdr-title">' + esc(title) + '</span>';
  h += '<button type="button" class="hdr-btn" data-act="gindex"><svg width="20" height="20" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 4.5C3 3.7 3.7 3 4.5 3H11v16H4.5c-.8 0-1.5.5-1.5 1.2zM19 4.5c0-.8-.7-1.5-1.5-1.5H11v16h6.5c.8 0 1.5.5 1.5 1.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg><span>Begriffe</span></button></div>';
  if (wiz) h += '<div class="prog"><div style="width: ' + ((si + qShare) / STEPS.length * 100) + '%"></div></div>';
  else if (tourP) h += '<div class="prog" role="progressbar" aria-label="Führung" aria-valuemin="1" aria-valuemax="' + TOUR.length + '" aria-valuenow="' + (S.tour.i + 1) + '"><div style="width: ' + (tourP * 100) + '%"></div></div>';
  h += '</header>';
  const recht = !view.fit && view.html.indexOf('foot-links recht') < 0 ? rechtLinks() : '';
  h += '<div class="scroll' + (view.fit ? ' fit' : '') + '" style="padding-top: ' + (wiz || tourP ? 56 : 52) + 'px"><div class="scr' + (view.fit ? ' fit' : '') + (view.cls ? ' ' + view.cls : '') + (S.dir === 'back' ? ' is-back' : '') + '" data-screen="' + S.screen + '">' + view.html + recht + '</div></div>';
  if (view.bar) h += '<div class="bb">' + (view.bar.sec ? '<button type="button" class="btn ghost" data-act="' + view.bar.secAct + '">' + esc(view.bar.sec) + '</button>' : '') + '<button type="button" class="btn ' + (view.bar.ghost ? 'ghost' : 'primary') + '" data-act="' + view.bar.act + '"' + (view.bar.v ? ' data-v="' + view.bar.v + '"' : '') + (view.bar.dis ? ' disabled' : '') + '>' + view.bar.label + '</button></div>';
  h += sheetsHTML();
  if (S.toast) h += '<div class="toast" role="status">' + esc(S.toast) + '</div>';
  const reihenX = Array.from(root.querySelectorAll('.qswatches, .qcards.reihe')).map((r) => r.scrollLeft);
  root.innerHTML = h;
  /* Gleiche Modellstruktur wie zuvor: die alte Bühne bleibt, alles Weitere morpht mit Übergängen */
  const ph = root.querySelector('#w3d');
  if (ph && prevStage && prevSig && ph.getAttribute('data-sig') === prevSig && ph.getAttribute('data-keep') !== '0') { prevStage.className = ph.className; prevStage.style.height = ph.style.height; ph.replaceWith(prevStage); prevStage.setAttribute('data-reused', '1'); }
  else { if (prevStage) prevStage.removeAttribute('data-reused'); if (ph && !ph.firstChild && W3DS.w3d) ph.outerHTML = w3dHTML(W3DS.w3d.w, W3DS.w3d.o); }
  const sc = root.querySelector('.scroll'), neu = fresh || lastScreen !== S.screen;
  if (neu) { if (sc) sc.scrollTop = 0; } else if (sc) sc.scrollTop = keep;
  if (!neu) { const scr = root.querySelector('.scr'); if (scr) scr.style.animation = 'none'; }
  root.querySelectorAll('.qswatches, .qcards.reihe').forEach((r, i) => {
    if (!neu && reihenX[i] != null) { r.scrollLeft = reihenX[i]; return; }
    const on = r.querySelector('[aria-pressed="true"]'); if (!on) return;
    const rr = r.getBoundingClientRect(), ro = on.getBoundingClientRect(); if (ro.right > rr.right - 24 || ro.left < rr.left + 8) r.scrollLeft += ro.left - rr.left - (rr.width - ro.width) / 2;
  });
  lastScreen = S.screen;
  bindAfterRender();
  if (['teilen', 'blatt', 'gesendet', 'datei', 'gekauft'].includes(S.screen)) blattSchrift();
  /* Blöcke erscheinen nacheinander bzw. beim Scrollen; die wiederverwendete 3-D-Bühne bleibt, wie sie ist */
  if (neu && !view.fit && window.Reveal) { const scr = root.querySelector('.scr'); if (scr) window.Reveal.auf(Array.from(scr.children).filter((c) => !(c.classList.contains('w3d-stage') && c.getAttribute('data-reused') === '1')), sc); }
  if (window.Lottie) window.Lottie.auf(document.body);
  /* Startbild neigt sich leicht mit dem Scrollen der Liste */
  const hs = root.querySelector('.hero-scene'); if (hs && window.Scroll) window.Scroll.binden(hs, (p) => hs.style.setProperty('--sp', p.toFixed(3)), { wurzel: sc });
  feiern(root);
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
    if (art === 'masse') { F.linien(q('.w3d-stage')); qa('.done-list b').forEach((b, i) => setTimeout(() => F.einrasten(b), 320 + i * 90)); }
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
function hd(eyebrow, h1, sub, cls, eyeCls) { return '<div class="hd' + (cls ? ' ' + cls : '') + '"><p class="eyebrow' + (eyeCls ? ' ' + eyeCls : '') + '">' + esc(eyebrow) + '</p><h1>' + h1 + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>'; }
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
  const id = o.id || 'w3d'; W3DS[id] = { w: w, o: o };
  if (id === 'w3d') { const alt = document.getElementById('w3d'); if (alt && alt.getAttribute('data-sig') === w3dSig(w, o)) return w3dHuelle(w, o) + '</div>'; }
  return w3dHTML(w, o);
}
/* Maße in Listen erst nach dem Freischalten (eigenes Aufmaß); beim Kundenlink bekommt sie der Betrieb, vorher nur „vollständig“ */
const masseZeigen = () => !S.betrieb && FREI();
function winCard(x, i, live, hide) { const d = derive(x), tag = live ? 'button' : 'div', fest = aendStand(x).fest;
  /* nach dem Senden im Link: keine Maße mehr, die stehen im Aufmaßblatt */
  if (hide) { const anderswo = !!(S.sent && S.sent.anderswo); return '<div class="wincard sent"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + (anderswo ? 'Auf diesem Gerät' : PILOT ? 'Abgeschlossen' : 'Übermittelt') + (x.anzahl > 1 ? ' · ' + x.anzahl + ' Stück' : '') + (x.fotos ? ' · ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '') + '</span><span class="me">' + (anderswo ? 'Maßgeblich ist das Aufmaß, das angekommen ist' : 'Maße und Angaben stehen im Aufmaßblatt') + '</span></span></div>'; }
  return '<' + tag + (live ? ' type="button"' : '') + ' class="wincard"' + (live ? ' data-act="open" data-i="' + i + '"' : '') + '><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di">' + (masseZeigen() && d.elW && d.elH ? thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm' : d.complete ? 'Maße vollständig' : 'Maße offen') + (x.anzahl > 1 ? ' · ' + x.anzahl + ' Stück' : '') + ' · ' + x.sashes.map((z) => TYPNAME[z.t]).filter((t, k, a) => a.indexOf(t) === k).join(' · ') + '</span><span class="me">' + esc(rahmenFarbe(x, 'aussen').name + ' · ' + (istOffen(x, 'glas') ? 'Glas offen' : lab('glas', x.glas) + '-Glas') + (x.fotos ? ' · ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : '') + (fest ? ' · fest' : '')) + '</span></span>' + (live ? CHEV : '') + '</' + tag + '>'; }
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
    '<div class="foot-links"><a class="link" href="' + RATGEBER_URL + '">Anleitung: Fenster ausmessen ›</a><a class="link" href="' + FB_URL + '">Sie sind Fensterbauer? ›</a></div>' + rechtLinks();
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
  const html = hd('Dein Aufmaß', 'Weiter, wo du warst.', esc(aufmassStand())) +
    '<section class="sec liste"><div class="sec-head"><h2 class="sec-title">Deine Fenster.</h2><span class="sub">' + S.windows.length + ' erfasst</span></div><div class="liste-in">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' + neu +
    kontoKarte() +
    (S.windows.length ? dateiCard() : '') +
    '<section class="card erklaert"><p class="eyebrow kicker">So funktioniert\'s</p><h2 class="sec-title">Zollstock statt Rätselraten.</h2><div class="steps">' +
    '<div class="step"><span class="n">1</span><div><b>Fotografieren.</b><p>Innen und außen, das Handy gerade halten. Die KI liest daraus die Einbausituation.</p></div></div>' +
    '<div class="step"><span class="n">2</span><div><b>Messen.</b><p>Vier Maße mit dem Zollstock, Schritt für Schritt erklärt, dann die Ränder.</p></div></div>' +
    '<div class="step"><span class="n">3</span><div><b>Wünschen.</b><p>Flügel, Sprossen, Farben innen und außen, jeder Fachbegriff mit Bild erklärt.</p></div></div></div>' +
    '<p class="nachsatz">Ein Fenster in zwei Minuten ausprobieren, ohne eigene Maße: <button type="button" class="ulink" data-act="tour-start">Führung starten</button></p></section>' +
    '<div class="foot-links"><a class="link" href="' + RATGEBER_URL + '">Anleitung: Fenster ausmessen ›</a><a class="link" href="' + FB_URL + '">Sie sind Fensterbauer? ›</a></div>' + rechtLinks();
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
/* Hinweis im Kundenlink: jederzeit über den Link weitermachen */
function linkMerk(name) {
  const server = SERVER.daten && !S.sync.aus && S.sync.ok, bis = S.betrieb && S.betrieb.expires ? S.betrieb.expires : '';
  return '<div class="card merk-karte"><p class="eyebrow">Jederzeit weitermachen</p><p>Öffne einfach wieder den Link von <b>' + esc(name) + '</b>. ' + (server ? 'Deine Angaben sind gespeichert, auch für ein anderes Gerät. Deine Fotos sieht ' + esc(name) + ' erst, wenn du sendest.' : 'Deine Angaben bleiben in diesem Browser gespeichert; öffne den Link später im selben Browser.') + (bis ? ' Der Link gilt bis ' + esc(bis) + '.' : '') + '</p></div>';
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
function linkHomeInhalt() {
  const name = S.betrieb.name || 'Dein Fensterbauer', ini = esc((name.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '') || 'F').slice(0, 1).toUpperCase()), n = S.windows.length, sent = !!S.sent, kd = S.betrieb.kunde;
  const head = '<div class="lk-from"><span class="lk-av">' + ini + '</span><span><small>' + (sent ? (PILOT ? 'Aufmaß für' : 'Gesendet an') : 'Persönliche Anfrage von') + '</small><b>' + esc(name) + '</b></span></div>' + (kd && !sent ? '<p class="lk-for">für ' + esc(kd) + '</p>' : '');
  const steps = (a, b, c) => '<section class="card" style="gap: 18px"><p class="eyebrow">' + a + '</p><div class="steps">' + b.map((x, i) => '<div class="step"><span class="n">' + (i + 1) + '</span><div><b>' + x[0] + '</b><p>' + x[1] + '</p></div></div>').join('') + '</div></section>' + (c || '');
  if (sent) {
    const html = '<section class="hero lk">' + head + '<div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="84" height="84" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div>' + (PILOT ? '<h1>Fast erledigt.</h1><p>Abgeschlossen am ' + esc(sentWhen()) + '. Schick ' + esc(name) + ' jetzt noch deinen Aufmaß-Code, falls noch nicht geschehen. Erst damit kommt dein Aufmaß an.</p><div class="cta"><button type="button" class="btn primary" data-act="go" data-v="gesendet">Code senden</button></div></section>' : '<h1>' + (S.sent.anderswo ? 'Schon erledigt.' : 'Danke, erledigt.') + '</h1><p>' + esc(name) + ' hat dein Aufmaß seit ' + esc(sentWhen()) + ' und meldet sich mit einem Angebot.</p></section>') +
      (S.sent.abweichend ? noteBox('Änderungen auf diesem Gerät sind nicht bei ' + esc(name) + ' angekommen. Kläre sie bitte direkt mit ' + esc(name) + '.', null, 'warn') : '') +
      dateiCard() +
      '<section class="sec"><div class="sec-head"><h2 class="sec-title">' + (S.sent.anderswo ? 'Auf diesem Gerät.' : PILOT ? 'Abgeschlossen.' : 'Gesendet.') + '</h2><span class="sub">' + n + (n === 1 ? ' Fenster' : ' Fenster') + '</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, false, true)).join('') + '</div></section>' +
      '<p class="sub center lk-note">Fragen und Änderungen klärst du direkt mit ' + esc(name) + '.</p>' + rechtLinks();
    return { html: html, bar: null };
  }
  if (S.linkZu && S.linkZu !== 'eingegangen') {
    const html3 = '<section class="hero lk">' + head + '<p class="eyebrow" style="color: var(--warn)">' + (S.linkZu === 'abgelaufen' ? 'Link abgelaufen' : S.linkZu === 'deaktiviert' ? 'Link deaktiviert' : 'Link nicht aktiv') + '</p><h1>Hier geht es gerade nicht weiter.</h1><p>' + esc(S.linkZuText || 'Bitte melde dich bei ' + name + '.') + '</p></section>' +
      (n ? '<section class="sec"><div class="sec-head"><h2 class="sec-title">Deine Fenster.</h2><span class="sub">' + n + ' erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, false)).join('') + '</div></section>' : '') + rechtLinks();
    return { html: html3, bar: null };
  }
  if (S.nb) {
    const html2 = '<section class="hero lk">' + head + '<p class="eyebrow" style="color: var(--warn)">Bitte noch einmal prüfen</p><h1>Fast fertig,<br>eine Runde noch.</h1><p>' + esc(name) + ' hat dein Aufmaß bekommen und bittet dich, es noch einmal zu prüfen. Was genau, steht in der Nachricht. ' + (n ? 'Deine Angaben sind alle noch da: Tipp ein Fenster an, ändere, was nötig ist, und schick es erneut ab.' : 'Auf diesem Gerät ist dein Aufmaß nicht gespeichert. Miss die Fenster, um die es geht, bitte neu auf; ' + esc(name) + ' ergänzt sie im bisherigen Aufmaß.') + '</p>' +
      '<div class="cta"><button type="button" class="btn primary" data-act="' + (n ? 'go' : 'new') + '" data-v="anfrage">' + (n ? 'Prüfen und erneut senden' : 'Fenster neu ausmessen') + '</button></div></section>' +
      '<section class="sec"><div class="sec-head"><h2 class="sec-title">Deine Fenster.</h2><span class="sub">' + n + ' erfasst</span></div><div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' + rechtLinks();
    return { html: html2, bar: null };
  }
  if (n || angelegt() >= GRENZE.fenster) {
    const html4 = '<div class="lk-kopf">' + head + '</div>' + hd('Dein Aufmaß', 'Weiter, wo du warst.', esc(aufmassStand())) +
      '<section class="sec liste"><div class="sec-head"><h2 class="sec-title">Deine Fenster.</h2><span class="sub">' + n + ' erfasst</span></div><div class="liste-in">' + S.windows.map((x, i) => winCard(x, i, true)).join('') + neuKnopf() + '</div></section>' +
      (vorschau() ? '' : linkMerk(name)) +
      '<p class="sub center lk-note">Deine Angaben gehen nur an ' + esc(name) + ', sonst an niemanden.</p>' + rechtLinks();
    return { html: html4, bar: n ? { label: 'Weiter zum Absenden', act: 'go', v: 'anfrage' } : null };
  }
  const html = '<section class="hero lk">' + head + '<p class="eyebrow">Fenster-Aufmaß, geführt</p><h1>Deine Fenster.<br>Deine Maße.</h1><p>' + esc(name) + ' braucht für dein Angebot die Maße deiner Fenster. Zwei Fotos und vier Maße je Fenster, jeder Schritt erklärt. Ein Konto brauchst du nicht. Du musst nicht alles auf einmal machen: Über diesen Link kommst du jederzeit zurück.</p>' +
    '<div class="cta"><button type="button" class="btn primary" data-act="new">Erstes Fenster ausmessen</button><button type="button" class="link" data-act="gloss" data-k="referenz">Wie genau ist das? ›</button></div>' +
    '<div class="hero-scene">' + model(HERO_WIN, { id: 'w3d-hero', view: 'three', sway: true, cls: 'hero dims-all', stageH: 250, dims: ['hm', 'wm', 'eh', 'ew'], labels: { hm: '1.480 mm', wm: '1.370 mm', eh: '1.410 mm', ew: '1.230 mm' } }) + '</div></section>' +
    '<p class="sub center lk-note">Deine Angaben gehen nur an ' + esc(name) + ', sonst an niemanden.</p>' + rechtLinks();
  return { html: html, bar: null };
}
/* ---------- Start: die Stelle und das Element ---------- */
/* Vorschau fürs Startbild: ein typisches Element je Art mit plausiblen Maßen, in den Farben und Einstellungen des Kunden */
const START_MASS = { fenster: [1230, 1410, 620], balkon: [1010, 2180, 0], fest: [1800, 1400, 620], hst: [2600, 2200, 0], psk: [2000, 2180, 0], fsw: [3600, 2200, 0] };
function startWin(w) {
  const m = START_MASS[w.art] || START_MASS.fenster;
  const v = Object.assign(baseWin(), { w: m[0], h: m[1], mo: { hm: m[1] + 70, hl: m[1] + 70, hr: m[1] + 70, wm: m[0] + 140, wt: m[0] + 140, wb: m[0] + 140 }, el: { h: m[1], w: m[0] }, bru: m[2], laib: 140, fa: w.fa, fi: w.fi, offen: kopie(w.offen || {}), material: w.material, neu: w.neu, hst: w.hst, fsw: w.fsw, bt: w.bt, psk: w.psk });
  artSetzen(v, w.art || 'fenster'); return v;
}
function startKarten(group, cur, act, cls) {
  return '<div class="qcards' + (cls ? ' ' + cls : '') + '" role="group">' + OPT[group].map((o) => '<div class="qo"><button type="button" class="qopt" data-act="' + act + '" data-v="' + o.k + '" aria-pressed="' + (o.k === cur) + '">' + svgIcon(ICO[group](o.k), 44) + '<span class="tx"><span class="lbl">' + esc(o.label) + '</span>' + (o.sub ? '<span class="sb">' + esc(o.sub) + '</span>' : '') + '</span></button>' + (o.g ? '<button type="button" class="qinfo" aria-label="Erklärung" data-act="gloss" data-k="' + o.g + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
SCREENS.start = () => {
  const w = S.win, art = w.art || 'fenster', o = OPT.art.find((x) => x.k === art) || OPT.art[0];
  const html = hd('Schritt 1 von 6 · Start', 'Was planst du?', 'Zwei Angaben, dann führt dich die App passend durch Fotos, Maße und Wünsche.') +
    '<div class="qgroup"><p class="eyebrow">Die Stelle</p>' + startKarten('situation', w.neu ? 'neu' : 'ersatz', 'situation') +
    (w.neu ? noteBox('Du fotografierst die Wand und ziehst das neue Element auf dem Foto an seinen Platz. Die Maße sind Wunschmaße; Sturz und Statik prüft der Fachbetrieb vor dem Durchbruch.', 'neuoeffnung') : '') + '</div>' +
    '<div class="qgroup"><p class="eyebrow">Das Element</p>' + startKarten('art', art, 'art', 'liste') + '</div>' +
    model(startWin(w), { id: 'w3d', view: 'three', sway: true, stageH: 230, fitW: 0.76, fitH: 0.7, hint: o.label + (istTuer(w) ? ' · bodentief' : '') });
  return { html: html, back: ['Aufmaß', 'home'], bar: { label: 'Weiter zu den Fotos', act: 'go', v: 'fotos' } };
};
/* ---------- Fotos ---------- */
function photoTile(which) {
  const p = S.photos[which], a = S.ai[which], label = which === 'in' ? 'Von innen' : 'Von außen', demo = p && p.demo;
  let inner;
  if (!p) inner = '<span class="empty"><svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true"><path d="M8 15.5c0-1.9 1.6-3.5 3.5-3.5h4.2l2.4-4h7.8l2.4 4h4.2c1.9 0 3.5 1.6 3.5 3.5v16c0 1.9-1.6 3.5-3.5 3.5h-21C9.6 35 8 33.4 8 31.5z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"></path><circle cx="22" cy="23" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"></circle></svg>' + label + '<br><small style="font-weight: 600; color: var(--muted)">' + 'empfohlen' + '</small></span>';
  else inner = '<img src="' + p.url + '" alt="' + label + '">';
  const ai = p ? (a && a.status === 'running' ? '<span class="ai-scan" data-lottie="fotos" data-loop="1" aria-hidden="true"></span><span class="ai"><span class="spin"></span>KI liest</span>' : a && a.status === 'done' ? '<span class="ai">' + '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>KI fertig</span>' : a && a.status === 'error' ? '<span class="ai">ohne KI</span>' : '') : '';
  return '<label class="tile"><input type="file" accept="image/*" capture="environment" data-in="photo" data-f="' + which + '">' + inner + ai + (p ? '<span class="tag">' + CHECK + esc(label) + (demo ? ' · Beispiel' : '') + '</span>' : '') + '</label>';
}
SCREENS.fotos = () => {
  const p = S.photos.in, tilt = p && S.ai.in && S.ai.in.befund && S.ai.in.befund.tilt != null ? S.ai.in.befund.tilt : null;
  const neu = !!S.win.neu, tuer = istTuer(S.win), ding = tuer ? 'die Tür' : S.win.art === 'fest' ? 'die Verglasung' : 'das Fenster';
  let level = '<div class="level"><span class="bubble"><span></span></span><span>Handy <b>gerade</b> halten, ' + (neu ? 'die ganze Stelle' : ding + ' ganz') + ' im Bild, etwas Wand drumherum.</span></div>';
  if (tilt != null) level = '<div class="level"><span class="bubble"><span style="animation: none; left: ' + Math.round(25 + Math.max(-20, Math.min(20, tilt * 4))) + 'px"></span></span><span>' + (Math.abs(tilt) <= 2.5 ? 'Dein Foto ist mit ' + String(Math.abs(tilt)).replace('.', ',') + '° fast waagerecht. Passt.' : 'Dein Foto ist etwa ' + String(Math.abs(tilt)).replace('.', ',') + '° schräg. Es geht, gerader wäre besser.') + '</span></div>';
  const kiNote = S.aiOk === false ? noteBox('Die KI-Auswertung der Fotos ist hier gerade nicht eingeschaltet. Das Aufmaß funktioniert trotzdem komplett, nur die Zusatzinfos aus den Fotos fehlen.', null, 'warn') : '';
  const html = hd('Schritt 2 von 6 · Fotos', neu ? 'Fotografiere die Stelle.' : 'Fotografiere ' + ding + '.', neu ? 'Einmal von innen, einmal von außen: die ganze Wand, an die das neue Element soll, mit etwas Platz drumherum. Danach zeichnest du es auf dem Foto ein.' : 'Einmal von innen, einmal von außen. Die KI liest daraus die Einbausituation für deinen Fensterbauer: Rollladenkasten, Laibung, Fensterbänke, Fassade. Du musst nichts eintippen.') +
    '<div class="tiles">' + photoTile('in') + photoTile('out') + '</div>' + level + kiNote +
    (!p && !S.photos.out && !S.betrieb ? '<button type="button" class="link" style="align-self: center" data-act="tour-start">Nur mal ansehen? Führung mit Beispielfotos</button>' : '');
  /* ohne Foto steht unten nur „Ohne Foto weiter“ (zweitrangig); mit dem ersten Foto wird daraus der Weg zum nächsten Schritt */
  const keins = !p && !S.photos.out;
  return { html: html, back: ['Start', 'start'], bar: keins ? { label: 'Ohne Foto weiter', act: 'ohne-foto', ghost: true } : { label: neu ? 'Weiter zum Einzeichnen' : 'Weiter zum Messen', act: 'go', v: neu ? 'zeichnen' : 'messen' } };
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
    '<p class="eyebrow" style="text-align: center; margin-top: 6px">Ohne Foto</p><h2 id="ofoto-t" style="margin: 8px 0 18px">Mit Foto wird dein Aufmaß besser.</h2>' +
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
  const html = hd('Schritt 3 von 6 · Einzeichnen', 'Zieh es an seinen Platz.', 'Die vier Ecken dorthin ziehen, wo ' + (istTuer(w) ? 'die Tür' : w.art === 'fest' ? 'die Verglasung' : 'das Fenster') + ' hin soll, so wie beim Scannen eines Dokuments.', 'compact') +
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
  const html = hd('Schritt 4 von 6 · Maße', 'Wie groß soll es werden?', 'Wunschmaße der Rohbauöffnung. Dein Fensterbauer prüft Sturz und Statik und legt das endgültige Maß fest.') +
    model(w, { id: 'w3d', view: 'result', sway: true, stageH: 280, fitW: 0.56, fitH: 0.6, dims: ['hm', 'wm', 'eh', 'ew'], labels: messLabels(), bg: photoBg(), cls: 'dims-all', hint: 'Rot: Rohbauöffnung · Blau: Element' }) +
    '<div class="card"><p class="eyebrow">Wunschmaß Rohbauöffnung</p><div class="rows">' + row('Breite', 'w', d.moW, 50, 'rahmenmass') + row('Höhe', 'h', d.moH, 50) + (tuer ? '' : row('Brüstungshöhe', 'bru', w.bru, 50, 'bruestung', 'Boden bis Unterkante Öffnung')) + row('Wandstärke', 'wand', w.wand, 10, 'laibung', 'falls bekannt') + '</div>' +
    '<p class="sub">Das Element wird ' + FUGE + ' mm je Seite kleiner als die Öffnung: ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm.</p></div>' + warn +
    noteBox('Neue Öffnung in der Wand: Bei tragenden Wänden entscheidet die Statik über Sturz und Größe. Der Fachbetrieb bricht die Öffnung, setzt den Sturz und baut ein.', 'neuoeffnung');
  return { html: html, back: planFoto() ? ['Einzeichnen', 'zeichnen'] : ['Fotos', 'fotos'], bar: { label: 'Weiter zum Ergebnis', act: 'go', v: 'ergebnis' } };
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
  return { id: 'w3d', view: 'three', sway: true, showEl: S.mess.step >= 1, dims: dims, active: k, labels: labels, stageH: 'auto', bg: photoBg(), hint: step.who === 'mo' ? 'Rot: Maueröffnung' : 'Blau: ' + elName() };
}
function liveWin(step, cur) {
  const w = JSON.parse(JSON.stringify(S.win)), v = num(cur);
  if (v >= 250 && v <= 6000) { if (step.who === 'mo') w.mo[step.k] = v; else { w.el[step.k] = v; w[step.k] = v; } }
  return w;
}
SCREENS.messen = () => {
  const m = S.mess, step = MESS[m.step];
  const msg = m.msg ? '<div class="msg ' + m.msg.cls + '">' + esc(m.msg.text) + (m.msg.cm ? '<button type="button" class="pill" data-act="mess-cm" data-v="' + m.msg.cm + '">Ja, ' + thousand(m.msg.cm) + ' mm</button>' : '') + (m.msg.cls === 'warn' ? '<button type="button" class="pill" data-act="mess-next" data-ack="1">Stimmt so, weiter</button>' : '') + '</div>' : '';
  const html = hd('Maß ' + (m.step + 1) + ' von 4 · ' + (step.who === 'mo' ? 'Maueröffnung' : elName()), esc(step.dir === 'v' ? 'Höhe in der Mitte.' : 'Breite in der Mitte.'), '', 'compact', step.who) +
    model(liveWin(step, m.cur), messOpts(step, m.cur)) +
    '<div class="ask ' + step.who + '"><p class="q"><span>' + esc(tuerText(step.short)) + '</span><button type="button" class="pill" data-act="gloss" data-k="rahmenmass">Wo genau?</button></p><p class="how">' + esc(tuerText(step.text)) + '</p>' + numDisplay(m.cur, 'mess-num') + msg + '</div>' +
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
  if (!chk.ok) { m.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; if (window.Haptik) window.Haptik.fehler(); render(); return; }
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
    body = '<div class="ask mo"><p class="q"><span>' + esc(rest.title) + '</span><button type="button" class="pill mo" data-act="rest-same" data-v="' + num(ref) + '">Wie Mitte · ' + thousand(ref) + '</button></p><p class="how">' + esc(tuerText(rest.text)) + '</p>' + numDisplay(r.cur, 'rest-num') + msg + '</div>' + keypad(r.i < 3 ? 'Weiter' : 'Fertig');
  } else {
    body = '<div class="mess-in"><p class="eyebrow" style="color: var(--ok)">Alle Maße da</p><div class="done-list"><div><small>Öffnung Breite</small><b>' + thousand(d.moW) + ' mm</b></div><div><small>Öffnung Höhe</small><b>' + thousand(d.moH) + ' mm</b></div><div><small>' + esc(artName(S.win)) + ' Breite</small><b>' + thousand(d.elW) + ' mm</b></div><div><small>' + esc(artName(S.win)) + ' Höhe</small><b>' + thousand(d.elH) + ' mm</b></div></div>' + (d.devW > 10 || d.devH > 10 ? '<div class="msg warn">Die Öffnung ist bis zu ' + Math.max(d.devW, d.devH) + ' mm außer Winkel. Das kleinste Maß zählt, so wie es der Fensterbauer auch macht.</div>' : '<div class="msg ok">' + CHECK + '<span>Die Öffnung ist gerade, alle Maße liegen nah beieinander.</span></div>') + '</div>';
  }
  const html = hd(rest ? 'Rand ' + (r.i + 1) + ' von 4 · Maueröffnung' : 'Ränder · Maueröffnung', rest ? esc(rest.title) + '.' : 'Passt.', rest ? '' : 'Alle sechs Maße der Öffnung und beide Maße des Elements sind drin.', 'compact', rest ? 'mo' : '') + stage + body;
  return { html: html, back: ['Messen', 'mess-back'], fit: !!rest, bar: rest ? null : { label: 'Weiter zum Ergebnis', act: 'go', v: 'ergebnis' } };
};
function restInput(v) {
  S.rest.cur = String(v).replace(/[^\d]/g, '').slice(0, 5);
  setNum('rest-num', S.rest.cur);
  const rest = REST[S.rest.i], lab = rest ? document.querySelector('[data-r="lab-' + rest.k + '"]') : null; if (lab) lab.textContent = num(S.rest.cur) ? thousand(S.rest.cur) + ' mm' : '?';
}
function restNext(ack) {
  const r = S.rest, rest = REST[r.i], ref = rest.k[0] === 'h' ? S.win.mo.hm : S.win.mo.wm, chk = checkRest(r.cur, ref);
  if (!chk.ok) { r.msg = { cls: 'bad', text: chk.msg, cm: chk.cm }; if (window.Haptik) window.Haptik.fehler(); render(); return; }
  if (chk.warn && !ack) { r.msg = { cls: 'warn', text: chk.warn }; render(); return; }
  S.win.mo[rest.k] = num(r.cur); r.cur = ''; r.msg = null; r.i++;
  if (r.i >= 4) S._feier = 'masse';
  render();
}
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
  const teaser = ki && (ki.chips || []).length ? '<div class="teaser"><p class="eyebrow">Aus deinen Fotos gelesen · ' + kiAnzahl(ki) + ' fürs Aufmaßblatt</p><div class="chips">' + ki.chips.map((c) => '<span class="chip">' + esc(c) + '</span>').join('') + '</div></div>'
    : (S.ai.in && S.ai.in.status === 'running' ? '<div class="teaser"><p class="eyebrow">Aus deinen Fotos</p><p class="sub" style="display: flex; align-items: center; gap: 10px"><span class="spin dark"></span>Die KI liest noch die Einbausituation aus den Fotos.</p></div>' : '');
  const html = hd('Schritt 5 von 6 · Ergebnis', neu ? 'Dein Wunsch steht.' : 'Dein Aufmaß steht.', neu ? 'Rohbauöffnung und Element als Wunschmaße' + (w.plan && w.plan.bild ? ', die Lage auf deinem Foto' : '') + '. Das endgültige Maß legt der Fachbetrieb nach der Statik fest.' : 'Maueröffnung und ' + esc(elName()) + ', so wie der Fensterbauer sie fürs Angebot braucht.') + model(w, { id: 'w3d', view: 'result', sway: true, dims: ['hl', 'hm', 'hr', 'wt', 'wm', 'wb', 'eh', 'ew'], labels: messLabels(), stageH: 300, fitW: 0.56, fitH: 0.6, cls: 'dims-all', bg: photoBg(), hint: 'Zum Drehen ziehen' }) + res + massHinweis + teaser +
    (neu && w.plan && w.plan.bild ? '<div class="card plan-card"><p class="eyebrow">Lage auf deinem Foto</p><img class="plan-bild" src="' + w.plan.bild + '" alt="Foto der Wand mit eingezeichneter Lage"><div class="pill-row"><button type="button" class="pill" data-act="go" data-v="zeichnen">Lage ändern</button><button type="button" class="pill" data-act="go" data-v="planmasse">Maße ändern</button></div></div>' : '') +
    '<details class="card fold"><summary><span>Falls zur Hand<small>Brüstungshöhe und Laibungstiefe, sonst beim Feinaufmaß</small></span></summary><div class="fold-body"><div class="rows">' + fieldRow('Brüstungshöhe', 'bru', 'mm', 10, 'bruestung') + fieldRow('Laibungstiefe innen', 'laib', 'mm', 5, 'laibung', ki && ki.laib && !w.e_laib ? 'KI-Schätzung' : '') + '</div></div></details>';
  return { html: html, back: neu ? ['Maße', 'planmasse'] : ['Ränder', 'rest'], cls: 'tight', bar: { label: istTuer(w) ? 'Weiter: Wunschtür' : 'Weiter: Wünsche', act: 'wuensche' } };
};

/* ---------- Wunschfenster: das Modell wird konfiguriert ---------- */
/* ---------- Zusammenfassung, Anfrage, Aufmaßblatt ---------- */
const MAL = ['keinmal', 'einmal', 'zweimal', 'dreimal', 'viermal'];
SCREENS.fertig = () => {
  const w = S.win, d = derive(w), lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'deinen Fensterbauer') : '', offen = masseZeigen(), gespeichert = S.windows[S.editIdx] || w;
  const facts = [offen ? thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm' : '', w.sashes.map((z) => TYPNAME[z.t]).filter((t, i, a) => a.indexOf(t) === i).join(' · '), istOffen(w, 'material') ? 'Material offen' : lab('material', w.material), rahmenFarbe(w, 'aussen').name, (num(w.anzahl) || 1) > 1 ? w.anzahl + ' Stück' : ''].filter(Boolean);
  const kiN = w.ki ? ((w.ki.rows || []).length + (AW.fachZeile(w) ? 1 : 0)) : 0, st = aendStand(gespeichert);
  /* Die geordnete Übersicht mit allen Angaben gibt es erst nach dem Freischalten (beim Kundenlink bekommt sie der Betrieb) */
  const alle = offen ? '<details class="card fold"><summary><span>Alle Angaben<small>' + specRows(w).length + ' Zeilen' + (kiN ? ', dazu ' + kiN + ' aus den Fotos' : '') + '</small></span></summary><div class="fold-body"><div class="kv">' + specRows(w).map((r) => '<div><span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span></div>').join('') + '</div>' +
    (kiN ? '<p class="eyebrow">Einbausituation aus den Fotos</p><dl class="facts">' + AW.kiRows(w).map((r) => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl>' : '') + '</div></details>'
    : '<div class="card datei-card zu-karte"><div class="dc-row"><span class="dc-ic">' + LOCK + '</span><div><p class="eyebrow">Alle Angaben · ' + specRows(w).length + (kiN ? ' + ' + kiN + ' aus den Fotos' : '') + '</p><b>' + (lk ? 'Gehen mit deinem Aufmaß an ' + esc(bn) : 'Stehen in deinem Aufmaßblatt') + '</b><small>' + (lk ? esc(bn) + ' bekommt jedes Fenster mit Zeichnung, allen Maßen, deinen Wünschen und der Auswertung der Fotos.' : 'Mit Zeichnung, allen Maßen, deinen Wünschen und der Auswertung der Fotos. Einmal freischalten, für dieses Projekt.') + '</small></div></div>' + (lk ? '' : '<button type="button" class="btn primary" style="flex: 0 0 auto" data-act="k-start">Freischalten</button>') + '</div>';
  const zu = st.fest ? ' aria-disabled="true"' : '';
  const aend = st.fest ? noteBox(festText(st) + ' ' + (lk ? 'Änderungen klärst du direkt mit ' + esc(bn) + '.' : 'Brauchst du etwas anders, legst du es als neues Fenster an.'), null, 'warn')
    : !st.frei ? noteBox((st.kauf ? 'Seit dem Freischalten' : 'Seit dem ' + esc(datumKurz(st.bis))) + ' kannst du dieses Fenster noch ' + MAL[st.rest] + ' ändern. Jedes Speichern mit einer Änderung zählt.', null, 'warn')
    : st.nb ? '<p class="sub center aend-frei">Während der Nachbesserung kannst du dieses Fenster frei ändern, darum hat ' + esc(bn) + ' gebeten.</p>'
    : '<p class="sub center aend-frei">Bis zum ' + esc(datumKurz(st.bis)) + ' kannst du dieses Fenster beliebig ändern, danach noch viermal.</p>';
  const html = model(w, { id: 'w3d', view: 'three', sway: true, stageH: 210, hint: 'Pos. ' + (S.editIdx + 1) }) + '<div class="center"><p class="eyebrow" style="color: var(--ok)">' + CHECK + ' Gespeichert · Position ' + (S.editIdx + 1) + '</p><h1 style="margin: 10px 0 0">' + esc(w.name || 'Fenster') + '</h1><p style="margin: 8px 0 0">' + esc(facts.join(' · ')) + '</p></div>' +
    (kiLaeuftFuer(gespeichert) || kiLaeuftFuer(w) ? kiLaeuftKarte('Die KI liest noch die Einbausituation. Die Auswertung kommt von selbst zu diesem Fenster.') : '') + alle + aend +
    '<div class="pill-row grid2"><button type="button" class="pill" data-act="go" data-v="ergebnis"' + zu + '>Maße ändern</button><button type="button" class="pill" data-act="wuensche"' + zu + '>Wünsche ändern</button><button type="button" class="pill" data-act="copywin">Kopieren</button><button type="button" class="pill danger" data-act="delwin">Löschen</button></div>' +
    '<button type="button" class="pill voll" data-act="go" data-v="home">Alle Fenster ansehen (' + S.windows.length + ')</button>' +
    '<p class="sub center" style="padding: 0 10px">' + (lk ? 'Gespeichert, auch für später: Über den Link von ' + esc(bn) + ' kommst du jederzeit zurück.' : 'Noch ein Fenster? Oder weiter zum Aufmaßblatt.') + '</p>';
  return { html: html, back: ['Aufmaß', 'home'], bar: { label: lk ? 'Zum Absenden' : 'Zum Aufmaßblatt', act: 'go', v: 'anfrage', sec: 'Weiteres Fenster', secAct: 'new' } };
};
/* Anfrage: zwei kurze Seiten im Link, drei ohne Link (dann mit Kontakt) */
const anfrageHead = (step, lk) => lk ? 'Fast fertig · ' + step + ' von 2' : 'Fürs Angebot · ' + step + ' von 3';
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
  let html = hd(anfrageHead(1, lk), 'Noch kurz zum Haus.', 'Damit ' + esc(bn) + ' gut planen kann. Alles freiwillig.');
  html += '<div class="sec">' + secHead('Gebäude') + chips('gebaeude', pr.gebaeude, 'gebaeude', 'setp') + '</div>';
  if (pr.gebaeude === 'denkmal') html += noteBox('Bei Denkmalschutz brauchst du meist eine Genehmigung. Material und Sprossen können vorgeschrieben sein.', 'echt', 'warn');
  html += '<div class="sec">' + secHead('Baujahr des Hauses') + chips('baujahr', pr.baujahr, 'baujahr', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Fenster im ganzen Haus', null, 'Du tauschst ' + replaced + ' davon.') + '<div class="rows"><div class="row"><label><span class="lbl">Insgesamt</span><span class="val"><input type="text" inputmode="numeric" id="p-total" data-in="p" data-f="total" value="' + esc(pr.total) + '" placeholder="z. B. 12"><span class="unit">Stück</span></span></label><button type="button" class="rnd" aria-label="Weniger" data-act="bumpp" data-v="-1">−</button><button type="button" class="rnd" aria-label="Mehr" data-act="bumpp" data-v="1">+</button></div></div></div>';
  if (num(pr.total) && replaced > num(pr.total) / 3) html += noteBox('Du tauschst ' + replaced + ' von ' + (num(pr.total) || 0) + ' Fenstern, mehr als ein Drittel. Dann ist ein Lüftungskonzept nach DIN 1946-6 erforderlich; darum kümmert sich dein Fensterbauer.', 'lueftung', 'warn');
  return { html: html, back: ['Aufmaß', 'home'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage2' } };
};
SCREENS.anfrage2 = () => {
  const pr = S.proj, lk = !!S.betrieb, bn = lk ? (S.betrieb.name || 'dein Fensterbauer') : '';
  let html = hd(anfrageHead(2, lk), 'Zeit und Budget.', lk ? 'Freiwillig. Deine Kontaktdaten hat ' + esc(bn) + ' schon.' : 'Freiwillig, hilft beim Angebot.');
  html += '<div class="sec">' + secHead('Wann soll es losgehen?') + chips('zeit', pr.zeit, 'zeit', 'setp') + '</div>';
  html += '<div class="sec">' + secHead('Budget') + chips('budget', pr.budget, 'budget', 'setp') + '</div>';
  /* Förderweg früh klären: Er ändert das Angebot (Zielwerte, Energieeffizienz-Experte, Bescheinigung) */
  const fw = AW.foerdWeg(pr);
  html += '<div class="sec">' + secHead('Förderung', 'foerderung') + chips('foerdweg', fw, 'foerdweg', 'setp') + '</div>';
  if (FOERD_HINWEIS[fw]) html += noteBox(FOERD_HINWEIS[fw]);
  if (lk) { html += '<div class="sec">' + secHead('Nachricht an ' + bn, null, 'Freiwillig, zum Beispiel wann du erreichbar bist.') + '<div class="rows">' + textRow('Nachricht', 'notiz', 'z. B. Rollladen im Bad klemmt', 'text', 'p') + '</div></div>'; return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: { label: 'Prüfen und senden', act: 'go', v: 'blatt' } }; }
  return { html: html, back: ['Haus', 'anfrage'], cls: 'tight', bar: { label: 'Weiter', act: 'go', v: 'anfrage3' } };
};
SCREENS.anfrage3 = () => {
  const pr = S.proj;
  let html = hd(anfrageHead(3, false), 'Wie erreicht dich dein Fensterbauer?', 'Steht auf dem Aufmaßblatt, damit er sich mit dem Angebot melden kann. Alles freiwillig; das Blatt bekommt nur, wem du es gibst.');
  html += '<div class="sec"><div class="rows">' + textRow('Name', 'name', 'Vor- und Nachname', 'text', 'p') + textRow('PLZ und Ort', 'ort', 'z. B. 50667 Köln', 'text', 'p') + textRow('Telefon', 'tel', 'Für Rückfragen', 'tel', 'p') + textRow('E-Mail', 'mail', 'name@beispiel.de', 'email', 'p') + '</div></div>';
  html += '<div class="sec">' + secHead('Am besten erreichbar') + chips('erreich', pr.erreich, 'erreich', 'setp') + '</div>';
  return { html: html, back: ['Zurück', 'anfrage2'], cls: 'tight', bar: { label: 'Zum Aufmaßblatt', act: 'go', v: 'teilen' } };
};
function blattHTML(windows, pr, opts) {
  opts = opts || {};
  let today = ''; try { today = new Date(opts.date || Date.now()).toLocaleDateString('de-DE'); } catch (e) { today = ''; }
  const replaced = windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0), fw = AW.foerdWeg(pr);
  const proj = [['Gebäude', lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')], ['Zeitraum', lab('zeit', pr.zeit)], ['Budget', lab('budget', pr.budget)], ['Förderung', fw ? lab('foerdweg', fw) : 'keine Angabe'], ['Lüftung', !num(pr.total) ? replaced + ' Fenster, Zahl im Haus nicht angegeben' : replaced > num(pr.total) / 3 ? 'Lüftungskonzept erforderlich (' + replaced + ' von ' + pr.total + ' Fenstern)' : replaced + ' von ' + pr.total + ' Fenstern']];
  const kl = klaerListe(windows, pr);
  let h = '<div class="sheet-paper"><div class="paper-head"><div style="min-width: 0"><p class="eyebrow">Aufmaßblatt</p><p style="margin: 4px 0 0; font-size: 24px; font-weight: 900; letter-spacing: -.02em">' + esc(pr.name || 'Ohne Namen') + '</p>' + ([pr.ort, pr.tel].filter(Boolean).length ? '<p style="margin: 2px 0 0; font-size: 13px; color: var(--muted)">' + esc([pr.ort, pr.tel].filter(Boolean).join(' · ')) + '</p>' : '') + '</div><div style="text-align: right; flex: 0 0 auto"><p style="margin: 0; font-size: 13px; color: var(--muted)">' + (opts.betrieb ? 'An ' + esc(opts.betrieb) : 'Erfasst mit eeziframes') + '</p><p style="margin: 2px 0 0; font-size: 13px; font-weight: 700">' + esc(today) + '</p></div></div>';
  h += '<div class="paper-grid">' + proj.map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>';
  if (kl.length) h += '<div class="paper-klaer"><p class="eyebrow">Noch zu klären · ' + kl.length + '</p><div class="paper-grid">' + kl.map((r) => '<span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span>').join('') + '</div></div>';
  windows.forEach((x, i) => {
    const d = derive(x), rows = specRows(x), ki = x.ki;
    h += '<div class="paper-pos"><div class="ph">' + svgIcon(miniWin(x), 54) + '<div class="t"><p class="eyebrow">Pos. ' + (i + 1) + ' · ' + (num(x.anzahl) || 1) + ' Stk.</p><p style="margin: 2px 0 0; font-size: 17px; font-weight: 800">' + esc(x.name || 'Fenster ' + (i + 1)) + '</p><p style="margin: 2px 0 0; font-size: 15px; font-weight: 700">Öffnung ' + thousand(d.moW) + ' × ' + thousand(d.moH) + ' · Element ' + thousand(d.elW) + ' × ' + thousand(d.elH) + ' mm</p></div><span class="badge ' + (d.complete ? 'ok' : 'warn') + '" style="flex: 0 0 auto">' + (d.complete ? 'Handmaß, 8 Werte' : 'Maße offen') + '</span></div>';
    h += '<div class="paper-grid">' + rows.map((r) => '<span>' + esc(r.k) + '</span><span>' + esc(r.v) + '</span>').join('') + '</div>';
    const fz = AW.fachZeile(x), mz = AW.massZeile(x);
    if (ki && ((ki.rows && ki.rows.length) || fz)) h += '<p class="eyebrow" style="margin-top: 4px">Einbausituation (KI, ' + (x.fotos || 0) + (x.fotos === 1 ? ' Foto' : ' Fotos') + ')</p><div class="paper-grid">' + (fz ? '<span>Auf einen Blick</span><span>' + esc(fz) + '</span>' : '') + (mz ? '<span>Maße und Foto</span><span>' + esc(mz) + '</span>' : '') + (ki.rows || []).map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + (ki.hints && ki.hints.length ? '<span>Hinweise</span><span>' + ki.hints.map(esc).join(' ') + '</span>' : '') + '</div>';
    h += '</div>';
  });
  h += '<div style="display: flex; justify-content: space-between; gap: 12px; padding-top: 12px; border-top: 2px solid var(--fg); font-size: 13px"><span style="font-weight: 800">' + windows.length + ' Positionen · ' + replaced + ' Elemente</span><span style="color: var(--muted)">Vor Fertigung: Feinaufmaß</span></div></div>';
  return h;
}
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
  if (paid) {
    const html = hd(KUNDE_FREI() ? 'Dein Aufmaß' : 'Freigeschaltet', 'Dein Aufmaßblatt.', 'Dein Aufmaß, sortiert wie beim Fensterbauer. Die PDF mit Zeichnungen bekommst du über „Herunterladen“.') + blattHTML(S.windows, S.proj, { betrieb: lk ? bn : '' });
    return { html: html, back: [lk ? 'Start' : 'Zurück', lk ? 'home' : 'teilen'], bar: { label: 'Herunterladen', act: 'k-dl' } };
  }
  if (S.sent && PILOT) return SCREENS.gesendet();
  if (S.sent) return { html: hd('Gesendet', 'Schon unterwegs.', esc(bn) + ' hat dein Aufmaß seit ' + esc(sentWhen()) + '.') + dateiCard(), back: ['Start', 'home'], bar: null };
  const pr = S.proj, items = [['Gebäude', lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')], ['Zeitraum', lab('zeit', pr.zeit)], ['Budget', lab('budget', pr.budget)]].concat(pr.notiz ? [['Nachricht', pr.notiz]] : []);
  const voll = S.windows.filter((x) => derive(x).complete).length, fehlt = S.windows.length - voll;
  const html = hd('Prüfen', 'Alles vollständig?', 'Deine Fenster mit allen Maßen und Wünschen, dazu die Auswertung der Fotos, gehen nur an ' + esc(bn) + '. Tipp ein Fenster an, um es zu prüfen oder zu ändern.') +
    (fehlt ? '<div class="msg ' + (voll ? 'warn' : 'bad') + '">' + (voll ? fehlt + (fehlt === 1 ? ' Fenster hat' : ' Fenster haben') + ' noch keine vollständigen Maße. Du kannst trotzdem senden, ' + esc(bn) + ' sieht dann, was fehlt.' : (S.windows.length ? 'Noch kein Fenster ist vollständig gemessen. Tipp ein Fenster an und trag die fehlenden Maße nach.' : 'Noch kein Fenster erfasst.')) + '</div>' : '') +
    '<div style="display: flex; flex-direction: column; gap: 10px">' + S.windows.map((x, i) => checkCard(x, i)).join('') + '</div>' +
    '<div class="kv">' + items.map((r) => '<div><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') + '</div>' +
    (kiLaeuftFuer() ? kiLaeuftKarte('Die Auswertung der Fotos kommt gleich dazu. Wer jetzt sendet, wartet kurz, damit sie mitgeht.') : '') +
    '<p class="sub" style="padding: 0 6px">Nach dem Absenden ist der Link erledigt. Ändern kannst du danach nur noch über ' + esc(bn) + '.</p>';
  return { html: html, back: ['Zurück', 'anfrage2'], bar: { label: S.kiWartet === 'senden' ? S.warteText || 'Einen Moment …' : (S.nb ? 'Erneut an ' : 'An ') + bn + ' senden', act: 'send', dis: !voll || S.kiWartet === 'senden' } };
};
/* Übersicht vor dem Senden: vollständig oder nicht, aber keine Maßliste zum Abfotografieren */
function checkCard(x, i) {
  const d = derive(x), n = num(x.anzahl) || 1, typ = x.sashes.map((z) => TYPNAME[z.t]).filter((t, k, a) => a.indexOf(t) === k).join(' · ');
  return '<button type="button" class="wincard" data-act="open" data-i="' + i + '"><span class="ic">' + svgIcon(miniWin(x), 56) + '</span><span class="tx"><span class="pos">POS. ' + (i + 1) + '</span><span class="ti">' + esc(x.name || 'Fenster ' + (i + 1)) + '</span><span class="di"' + (d.complete ? '' : ' style="color: var(--bad)"') + '>' + (d.complete ? 'Vollständig: 8 Maße' : 'Maße fehlen noch') + (x.fotos ? ', ' + x.fotos + (x.fotos === 1 ? ' Foto' : ' Fotos') : ', ohne Fotos') + '</span><span class="me">' + esc([typ, istOffen(x, 'material') ? 'Material offen' : lab('material', x.material), n > 1 ? n + ' Stück' : ''].filter(Boolean).join(' · ')) + '</span></span>' + CHEV + '</button>';
}
SCREENS.gesendet = () => {
  const name = S.betrieb ? (S.betrieb.name || 'Dein Fensterbauer') : 'Dein Fensterbauer', code = curCode();
  const wa = 'https://wa.me/?text=' + encodeURIComponent('Hallo ' + name + ', hier ist mein Übermittlungscode aus eeziframes:\n' + code);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px"><div class="okmark-l" data-lottie="fertig"><span class="lottie-still"><svg class="okmark" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--ok-soft)"></circle><path class="tick" d="M19 33l9 9 18-20" fill="none" stroke="var(--ok)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div><h1 style="margin: 4px 0 0">Gesendet.</h1><p style="margin: 0">' + esc(name) + ' hat jetzt deine Maße, die Auswertung der Fotos und deine Wünsche und meldet sich mit einem Angebot.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(name) + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard() +
    (S.sent && S.sent.uebertragen ? '' : '<details class="card proto"><summary><span><b>Nur im Prototyp: Übermittlung</b><small>Ohne Server kommt dein Aufmaß hier noch nicht von selbst an.</small></span></summary><p class="sub" style="color: var(--fg2)">Bitte schick ' + esc(name) + ' diesen Übermittlungscode, am einfachsten als Antwort in WhatsApp. Er funktioniert nur in diesem Projekt bei ' + esc(name) + '. Im fertigen eeziframes entfällt dieser Schritt.</p><textarea class="copybox" id="code-box" readonly rows="3" aria-label="Übermittlungscode">' + esc(code) + '</textarea><div class="pill-row"><button type="button" class="pill" data-act="copyblatt">Code kopieren</button><a class="pill" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp antworten ›</a></div></details>');
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
  if (S.betrieb) { const bn = S.betrieb.name || 'dein Fensterbauer'; return '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Eine Kopie für dich?</p><b>Frag ' + esc(bn) + '</b><small>Dein Aufmaß gehört zu diesem Auftrag. ' + esc(bn) + ' hat das komplette Aufmaßblatt als PDF und gibt es dir gern mit dem Angebot.</small></div></div></div>'; }
  if (FREI()) return '<div class="card datei-card bought"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">' + (KUNDE_FREI() ? 'Für dich · kostenlos' : 'Freigeschaltet') + '</p><b>Dein Aufmaßblatt als PDF</b><small>' + n + (n === 1 ? ' Fenster' : ' Fenster') + ', alle Maße, Fotoauswertung und Wünsche, mit Code für den Fensterbauer.</small></div></div><span class="row" style="display: flex; gap: 8px; flex: 0 0 auto"><button type="button" class="btn ghost" data-act="teil-pdf">Teilen</button><button type="button" class="btn primary" data-act="k-dl">Herunterladen</button></span></div>';
  return '<div class="card datei-card"><div class="dc-row"><span class="dc-ic">' + FILE_IC + '</span><div><p class="eyebrow">Dein Aufmaßblatt · ' + euro(PREIS()) + '</p><b>Fertig gemessen? Dann freischalten.</b><small>Alle Maße, die Auswertung der Fotos und deine Wünsche als PDF, mit Code für jeden Fensterbauer. Einmal zahlen, für dieses Projekt.</small></div></div><button type="button" class="btn primary" style="flex: 0 0 auto" data-act="go" data-v="teilen">Ansehen</button></div>';
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
    const html = hd('Fertig gemessen', 'Dein Aufmaßblatt ist fertig.', n + (n === 1 ? ' Fenster' : ' Fenster') + ', alle acht Handmaße, die Auswertung der Fotos, deine Wünsche. Einmal freischalten, dann gehört es dir.') + blattVorschau() +
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
    '<div class="card share-way"><p class="eyebrow">Für dich</p><h2>Als Datei behalten</h2><p class="sub" style="color: var(--fg2)">Dein komplettes Aufmaßblatt als PDF, für deine Unterlagen.' + (S.kauf && S.kauf.paid && S.kauf.mail ? ' Die Rechnung ist an ' + esc(S.kauf.mail) + ' unterwegs.' : '') + '</p><div class="pill-row"><button type="button" class="pill" data-act="k-dl">Herunterladen</button><button type="button" class="pill" data-act="go" data-v="blatt">Ansehen</button></div></div>' +
    '<div class="sec">' + secHead('Dein Aufmaß-Code', null, 'Steht auch auf Seite 2 der PDF. Falls Kopieren nicht klappt: Text markieren und kopieren.') + '<textarea class="copybox" id="code-box" readonly rows="3" aria-label="Aufmaß-Code">' + esc(code) + '</textarea></div>';
  return { html: html, back: ['Zurück', 'anfrage3'], bar: { label: 'Zurück zum Projekt', act: 'go', v: 'home' } };
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

/* ---------- Wunschfenster als Fragen: eine Frage, das Modell darüber, die Antwort sofort sichtbar ---------- */
const QSEC = { lage: 'Lage', absturz: 'Lage', design: 'Gestaltung', teilung: 'Fenster', typ: 'Fenster', din: 'Fenster', material: 'Fenster', ol: 'Fenster', ul: 'Fenster', form: 'Fenster', richtung: 'Fenster', felder: 'Fenster', hsts: 'Fenster', hstr: 'Fenster', pskS: 'Fenster', pskR: 'Fenster', schwelle: 'Fenster', boden: 'Fenster', fswn: 'Fenster', fsws: 'Fenster', fswg: 'Fenster', sprossen: 'Sprossen', spross: 'Sprossen', aufseite: 'Sprossen', breite: 'Sprossen', fa: 'Farbe & Glas', fi: 'Farbe & Glas', glas: 'Farbe & Glas', glasfn: 'Farbe & Glas', orn: 'Farbe & Glas', griff: 'Farbe & Glas', griffA: 'Farbe & Glas', gf: 'Farbe & Glas', rc: 'Sicherheit', sart: 'Sonnenschutz', einbau: 'Sonnenschutz', sfarbe: 'Sonnenschutz', antrieb: 'Sonnenschutz', iart: 'Sonnenschutz', ifarbe: 'Sonnenschutz', insekt: 'Extras', fbi: 'Extras', fba: 'Extras', montage: 'Extras', notiz: 'Extras' };
/* Die Fragen je Elementart. Fenster: Flügel, Öffnung, Scharniere, Ober- und Unterlicht, Form. Festverglasung: Felder und Form.
   Balkon-/Terrassentür: Flügel, Öffnung, Oberlicht, Schwelle, Fußboden, Griff außen. Hebe-Schiebe-Tür: Schema, Seite, Schwelle.
   PSK-Tür: Teile, Seite. Faltschiebewand: Flügelzahl, Faltrichtung, Gehflügel, Schwelle. Vorweg: Lage, Absturzsicherung (wenn nötig),
   Gestaltung wie ein anderes Fenster (wenn es schon welche gibt). Danach für alle: Farbe, Glas, Griff, Erreichbarkeit und Einbruchschutz,
   Sonnenschutz außen und innen, Insektenschutz, Fensterbank bzw. nichts bei Türen, Montage, Notiz.
   offen: Schlüssel für „Weiß ich noch nicht“ (Wunschfragen); dann ist keine Option gedrückt, das Blatt zeigt „offen“. */
function qList(w) {
  const L = [], d = derive(w), n = w.sashes.length, art = w.art || 'fenster', tuer = istTuer(w), neu = !!w.neu, rund = w.form === 'rund', ki = (w.ki && w.ki.fach) || {};
  const ohne = (g) => (neu ? OPT[g].filter((o) => o.k !== 'behalten') : OPT[g]);
  const material = { id: 'material', title: 'Welches Material?', sub: 'Bestimmt Preis, Pflege und Profilbreite.', kind: 'cards', group: 'material', val: w.material, act: 'setw', f: 'material', ico: ICO.material, view: 'inside', offen: 'material' };
  const form = { id: 'form', title: 'Welche Form?', sub: 'Antippen zeigt die Form am Modell.', kind: 'formen', group: 'form', val: w.form, act: 'form', ico: ICO.form, view: 'inside' };
  const schwelle = (o, act) => ({ id: 'schwelle', title: 'Welche Schwelle?', sub: 'Barrierefrei heißt ohne Schwelle, mit Rinne davor.', kind: 'cards', group: 'schwelle', val: o.schwelle, act: act, f: 'schwelle', ico: ICO.schwelle, view: 'bankInnen', g: 'schwelle', hint: lab('schwelle', o.schwelle), offen: 'schwelle' });
  const fluegel = (typen) => w.sashes.forEach((x, i) => {
    L.push({ id: 'typ-' + i, title: n > 1 ? 'Wie öffnet Flügel ' + (i + 1) + '?' : 'Wie soll es aufgehen?', sub: n > 1 ? 'Der markierte Flügel. Antippen wechselt.' : '', kind: 'cards', group: 'typ', opts: typen, val: x.t, act: 'sash', f: 't', sash: i, ico: ICO.typ, view: 'inside', g: 'symbol', hint: n > 1 ? 'Flügel ' + (i + 1) + ' von ' + n : 'Er schwingt so auf' });
    if (x.t === 'D' || x.t === 'DK') L.push({ id: 'din-' + i, title: n > 1 ? 'Scharniere von Flügel ' + (i + 1) + '?' : 'Scharniere links oder rechts?', sub: 'Von innen gesehen. Der Griff sitzt gegenüber.', kind: 'chips', group: 'din', val: x.din, act: 'sash', f: 'din', sash: i, view: 'inside', g: 'dinlr', hint: 'Der Griff wandert mit' });
  });
  L.push({ id: 'lage', title: tuer ? 'Wo ist die Tür?' : art === 'fest' ? 'Wo ist die Verglasung?' : 'Wo ist das Fenster?', sub: 'Damit der Fensterbauer die Position zuordnen kann.', kind: 'lage', view: 'three' });
  /* Pflichtthema: im Obergeschoss bei niedriger Brüstung, bei Türen immer (außer mit Balkon davor) */
  if (AW.absturzFrage(w)) L.push(tuer
    ? { id: 'absturz', title: 'Führt die Tür auf einen Balkon oder eine Terrasse?', sub: 'Sonst braucht sie im ' + lab('etage', w.etage) + ' eine Absturzsicherung davor.', kind: 'cards', group: 'absturzTuer', val: w.absturz, act: 'absturz', ico: ICO.absturz, view: 'outside', g: 'absturz', offen: 'absturz', offenLabel: 'Weiß ich noch nicht', hint: 'Ansicht von außen' }
    : { id: 'absturz', title: 'Wie wird gegen Absturz gesichert?', sub: AW.bruDa(w) ? (num(w.bru) ? 'Brüstung ' + thousand(w.bru) + ' mm im ' + lab('etage', w.etage) : 'Bodentief im ' + lab('etage', w.etage)) + ': Unter 80 cm (über 12 m Höhe 90 cm) ist meist eine Absturzsicherung Pflicht.' : 'Laut Foto ist die Brüstung ' + (w.ki && w.ki.fach && w.ki.fach.bruestung === 'bodentief' ? 'bodentief' : 'niedrig') + '. Im ' + lab('etage', w.etage) + ' ist dann eine Absturzsicherung Pflicht.', kind: 'cards', group: 'absturz', val: w.absturz, act: 'absturz', ico: ICO.absturz, view: 'outside', g: 'absturz', offen: 'absturz', offenLabel: 'Weiß ich noch nicht', hint: 'Ansicht von außen' });
  /* Gestaltung übernehmen: Farben, Glas, Sprossen, Sonnenschutz wie bei einem schon gespeicherten Fenster */
  if (designListe().length) L.push({ id: 'design', title: 'Gestalten wie ein anderes Fenster?', sub: 'Übernimmt Material, Farben, Glas, Sprossen, Griff und Sonnenschutz. Maße und Flügel bleiben.', kind: 'design', view: 'three', hint: 'Antippen übernimmt' });
  if (art === 'fenster') {
    /* Runde Fenster sind fest verglast: keine Fragen nach Flügeln, Öffnung, Scharnieren, Ober- und Unterlicht */
    if (!rund) L.push({ id: 'teilung', title: 'Wie viele Flügel?', sub: w.e_teilung ? '' : 'Vorschlag nach deiner Breite von ' + thousand(d.elW) + ' mm.', kind: 'cards', group: 'teilung', val: w.teilung, act: 'teilung', ico: ICO.layout, view: 'inside', g: 'pfosten', hint: 'Zum Drehen ziehen' });
    if (!rund) fluegel(OPT.typ);
    L.push(material);
    if (!rund) L.push({ id: 'ol', title: 'Ein Oberlicht?', sub: 'Ein extra Feld über dem Fenster.', kind: 'chips', group: 'ol', val: w.ol ? w.olT : 'nein', act: 'ol-set', view: 'inside', g: 'oberlicht' });
    if (!rund) L.push({ id: 'ul', title: 'Ein Unterlicht?', sub: 'Ein festes Feld unten, typisch hinter der Küchenzeile.', kind: 'ul', view: 'inside', g: 'unterlicht', hint: w.ul ? lab('ul', w.ulA) + ' · ' + thousand(w.ulH) + ' mm hoch' : 'Flügel bis zur Fensterbank' });
    L.push(form);
    L.push({ id: 'richtung', title: 'Öffnet nach innen oder außen?', kind: 'chips', group: 'richtung', val: w.richtung, act: 'setw', f: 'richtung', view: 'inside', g: 'symbol' });
  } else if (art === 'balkon') {
    L.push({ id: 'teilung', title: 'Wie viele Flügel?', sub: w.e_teilung ? 'Zwei Flügel ohne Pfosten (Stulp) geben die ganze Breite frei.' : 'Vorschlag nach deiner Breite von ' + thousand(d.elW) + ' mm.', kind: 'cards', group: 'teilung', opts: OPT.teilung.filter((o) => o.k !== '3'), val: w.teilung, act: 'teilung', ico: ICO.layout, view: 'inside', g: 'stulp', hint: 'Zum Drehen ziehen' });
    fluegel(OPT.typ.filter((o) => o.k !== 'K'));
    L.push(material);
    L.push({ id: 'ol', title: 'Ein Oberlicht?', sub: 'Ein extra Feld über der Tür.', kind: 'chips', group: 'ol', val: w.ol ? w.olT : 'nein', act: 'ol-set', view: 'inside', g: 'oberlicht' });
    L.push(schwelle(w.bt, 'bt'));
    L.push({ id: 'boden', title: 'Und der Fußboden?', sub: 'Davon hängt ab, wie hoch die Schwelle sitzt.', kind: 'chips', group: 'boden', val: w.bt.boden, act: 'bt', f: 'boden', view: 'bankInnen', hint: lab('boden', w.bt.boden) });
  } else if (art === 'fest') {
    L.push({ id: 'felder', title: 'Wie viele Felder?', sub: 'Große Scheiben werden geteilt, ab etwa 2,5 m² je Feld.', kind: 'cards', group: 'felder', val: w.teilung, act: 'felder', ico: ICO.felder, view: 'inside', g: 'festverglasung', hint: 'Zum Drehen ziehen' });
    L.push(material);
    L.push(form);
  } else if (art === 'hst') {
    L.push({ id: 'hsts', title: 'Welches Schema?', sub: 'Welche Flügel schieben und welche fest stehen.', kind: 'cards', group: 'hstSchema', val: w.hst.schema, act: 'hst', f: 'schema', ico: ICO.hst, view: 'inside', g: 'hst', hint: 'Antippen zeigt, wie sie öffnet' });
    if (w.hst.schema === 'A' || w.hst.schema === 'A3') L.push({ id: 'hstr', title: 'Schiebeflügel links oder rechts?', sub: 'Von innen gesehen. Der feste Teil steht gegenüber.', kind: 'chips', group: 'hstRichtung', val: w.hst.richtung, act: 'hst', f: 'richtung', view: 'inside', hint: 'Von innen gesehen' });
    L.push(schwelle(w.hst, 'hst'));
    L.push(material);
  } else if (art === 'psk') {
    L.push({ id: 'pskS', title: 'Wie viele Teile?', sub: 'Der Flügel kippt oder schiebt sich vor das feste Teil. PSK-Türen haben immer eine kleine Schwelle.', kind: 'cards', group: 'pskSchema', val: w.psk.schema, act: 'psk', f: 'schema', ico: ICO.psk, view: 'inside', g: 'psk', hint: 'Antippen zeigt, wie sie öffnet' });
    L.push({ id: 'pskR', title: 'Schiebeflügel links oder rechts?', sub: 'Von innen gesehen. Der feste Teil steht daneben.', kind: 'chips', group: 'hstRichtung', val: w.psk.richtung, act: 'psk', f: 'richtung', view: 'inside', hint: 'Von innen gesehen' });
    L.push(material);
  } else if (art === 'fsw') {
    L.push({ id: 'fswn', title: 'Wie viele Flügel?', sub: 'Mehr Flügel heißt schmalere Flügel und ein größeres Paket.', kind: 'chips', group: 'fswN', val: String(w.fsw.n), act: 'fsw', f: 'n', view: 'inside', g: 'fsw', hint: w.fsw.n + ' Flügel · Antippen faltet' });
    L.push({ id: 'fsws', title: 'Wohin faltet sie?', sub: 'Auf welcher Seite das Paket steht, von innen gesehen.', kind: 'chips', group: 'fswSchema', val: w.fsw.schema, act: 'fsw', f: 'schema', view: 'inside', hint: lab('fswSchema', w.fsw.schema) });
    L.push({ id: 'fswg', title: 'Mit Gehflügel?', sub: 'Eine Tür für jeden Tag, ohne alles zu falten.', kind: 'geh', view: 'inside', g: 'fsw', hint: w.fsw.geh ? 'Gehflügel mit Griff' : 'Ohne Gehflügel' });
    L.push(schwelle(w.fsw, 'fsw'));
    L.push(material);
  }
  if (!tuer || art === 'balkon') {
    L.push({ id: 'sprossen', title: 'Sprossen?', sub: 'Mit + und − dazu, an den Reglern verschieben.', kind: 'bars', view: 'front' });
    if (w.bars.length) {
      L.push({ id: 'spross', title: 'Welche Sprossenart?', kind: 'cards', group: 'spross', val: w.spross, act: 'setw', f: 'spross', ico: ICO.spross, view: 'front', offen: 'spross' });
      if (w.spross === 'auf') L.push({ id: 'aufseite', title: 'Aufgesetzt wo?', kind: 'chips', group: 'aufseite', val: w.aufSeite, act: 'setw', f: 'aufSeite', view: 'outside', hint: 'Ansicht von außen' });
      L.push({ id: 'breite', title: 'Wie breit sollen sie sein?', kind: 'chips', group: 'breite', val: w.breite, act: 'setw', f: 'breite', view: 'front' });
    }
  }
  L.push({ id: 'fa', title: 'Welche Farbe außen?', kind: 'color', side: 'aussen', view: 'outside', g: 'ral', hint: 'Ansicht von außen', offen: 'fa' });
  L.push({ id: 'fi', title: 'Und innen?', kind: 'color', side: 'innen', view: 'inside', g: 'ral', hint: 'Ansicht von innen', offen: 'fi' });
  L.push({ id: 'glas', title: 'Welche Verglasung?', sub: 'Je kleiner der U-Wert, desto weniger Wärme geht verloren.', kind: 'cards', group: 'glas', val: w.glas, act: 'setw', f: 'glas', ico: ICO.glas, view: 'inside', g: 'uwert', lupe: true, hint: glasText(w), offen: 'glas' });
  L.push({ id: 'glasfn', title: 'Extras fürs Glas?', sub: 'Mehrfachauswahl möglich.', kind: 'multi', group: 'glasfn', vals: w.glasfn, act: 'glasfn', view: 'inside', lupe: true, hint: w.glasfn.length ? w.glasfn.map((g) => lab('glasfn', g)).join(' · ') : 'Ohne Extras', offen: 'glasfn' });
  if (w.glasfn.indexOf('sicht') >= 0) L.push({ id: 'orn', title: 'Welches Ornamentglas?', kind: 'orn', view: 'inside', g: 'ornament', hint: 'Sichtschutz: ' + (ORN.find((o) => o.k === w.orn) || ORN[0]).label });
  if (art === 'fenster' || art === 'balkon') L.push({ id: 'griff', title: art === 'balkon' ? 'Welcher Griff innen?' : 'Welcher Griff?', sub: 'Ohne Griff: verdeckt im Flügel oder elektrisch.', kind: 'cards', group: 'griff', val: w.griff, act: 'setw', f: 'griff', ico: ICO.griff, view: 'inside', hint: w.griff === 'ohne' ? 'Glatte Fläche, kein Griff' : '', offen: 'griff' });
  else if (art === 'hst') L.push({ id: 'griff', title: 'Welcher Griff?', sub: 'Der Hebegriff hebt den Flügel aus der Dichtung.', kind: 'cards', group: 'hstGriff', val: w.griff, act: 'setw', f: 'griff', ico: ICO.hgriff, view: 'inside', g: 'hst', offen: 'griff' });
  else if (art === 'fsw' || art === 'psk') L.push({ id: 'griff', title: art === 'psk' ? 'Welcher Griff?' : 'Welcher Griff am Gehflügel?', kind: 'cards', group: 'griff', opts: OPT.griff.filter((o) => o.k === 'standard' || o.k === 'abschliessbar'), val: w.griff, act: 'setw', f: 'griff', ico: ICO.griff, view: 'inside', offen: 'griff' });
  if (art === 'balkon') L.push({ id: 'griffA', title: 'Und außen?', sub: 'Mit Ziehgriff und Schnäpper ziehst du die Tür von außen zu.', kind: 'chips', group: 'griffA', val: w.bt.griffA, act: 'bt', f: 'griffA', view: 'outside', g: 'balkon', hint: 'Ansicht von außen', offen: 'griffA' });
  if (art !== 'fest' && w.griff !== 'ohne' && w.griff !== 'motor' && !istOffen(w, 'griff')) L.push({ id: 'gf', title: 'Welche Griff-Farbe?', kind: 'chips', group: 'gf', val: w.gf, act: 'setw', f: 'gf', view: 'inside', hint: 'Der Griff wechselt mit' });
  /* Statt der Stufen zuerst die Frage, die der Kunde beantworten kann: Ist es leicht erreichbar? Dann empfiehlt die Polizei RC2 */
  L.push({ id: 'rc', title: tuer ? 'Ist die Tür leicht erreichbar?' : 'Ist das Fenster leicht erreichbar?', sub: 'Zum Beispiel im Erdgeschoss, vom Balkon, Anbau oder Garagendach aus.' + (!w.erreichbar && typeof ki.erreichbar === 'boolean' ? ' Laut Außenfoto vermutlich ' + (ki.erreichbar ? 'ja.' : 'nein.') : ''), kind: 'rc', view: 'inside', g: 'rc2', lupe: w.rc === 'rc2', hint: { basis: 'Basis: normaler Beschlag', rc1: art === 'fest' ? 'RC1 N: Glas von innen verklotzt' : 'RC1 N: Pilzköpfe an den Seiten', rc2: art === 'fest' ? 'RC2: Sicherheitsglas, Verglasung gesichert' : 'RC2: Pilzköpfe rundum, Griff abschließbar, Sicherheitsglas' }[w.rc] || '', offen: 'rc' });
  L.push({ id: 'sart', title: 'Sonnenschutz außen?', sub: 'Hält die Hitze draußen, bevor sie ans Glas kommt.', kind: 'cards', group: 'sart', opts: ohne('sart'), val: w.sart, act: 'sart', ico: ICO.sonne, view: 'outside', g: 'raffstore', hint: 'Ansicht von außen · ' + lab('sart', w.sart), offen: 'sart' });
  if (w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen') {
    /* Der Kasten ist Sache des Fensterbauers: Vorschlag nach den Fotos, der Kunde darf wählen */
    const kasten = ki.rollladen && ki.rollladen !== 'keiner' ? 'Laut Foto vorhanden: ' + AW.lab('kasten', ki.rollladen) + '. ' : '';
    L.push({ id: 'einbau', title: 'Wo sitzt der Kasten?', sub: kasten + 'Unsicher? Dein Fensterbauer wählt den passenden.', kind: 'cards', group: 'einbau', val: w.roll, act: 'setw', f: 'roll', ico: ICO.einbau, view: 'outside', g: w.roll === 'vorbau' ? 'vorbau' : 'aufsatz', hint: 'Ansicht von außen', offen: 'einbau', offenLabel: 'Fensterbauer entscheidet', offenSub: 'nach den Fotos und vor Ort' });
    L.push({ id: 'sfarbe', title: 'Welche Farbe?', sub: w.sart === 'raffstore' ? 'Lamellen, Kasten und Schienen.' : w.sart === 'screen' ? 'Gewebe und Kasten.' : 'Panzer, Kasten und Führungsschienen.', kind: 'swatch', group: 'sfarbe', f: 'sfarbe', val: w.sfarbe, view: 'outside', hint: 'Ansicht von außen · ' + sonneName(w) });
    L.push({ id: 'antrieb', title: 'Wie wird er bedient?', sub: w.antrieb === 'motor' || w.antrieb === 'smart' ? (ki.strom === true ? 'Laut Foto liegt am Fenster schon Strom.' : 'Elektrisch braucht Strom am Fenster, das klärt dein Fensterbauer.') : '', kind: 'chips', group: 'antrieb', val: w.antrieb, act: 'setw', f: 'antrieb', view: 'outside', hint: 'Ansicht von außen', offen: 'antrieb' });
  }
  L.push({ id: 'insekt', title: 'Insektenschutz?', kind: 'cards', group: 'insekt', val: w.insekt, act: 'setw', f: 'insekt', ico: ICO.insekt, view: 'outside', g: 'insekt', hint: 'Ansicht von außen', offen: 'insekt' });
  L.push({ id: 'iart', title: 'Sicht- und Blendschutz innen?', sub: 'Rollo, Plissee oder Jalousie, gleich mitbestellt.', kind: 'cards', group: 'iart', val: w.iart, act: 'setw', f: 'iart', ico: ICO.innen, view: 'inside', g: 'innenschutz', hint: 'Ansicht von innen', offen: 'iart' });
  if (w.iart && w.iart !== 'keiner') L.push({ id: 'ifarbe', title: 'Welche Farbe innen?', kind: 'swatch', group: 'ifarbe', f: 'ifarbe', val: w.ifarbe, view: 'inside', hint: lab('iart', w.iart) + ' · ' + innenName(w) });
  if (!tuer && !rund) {
    L.push({ id: 'fbi', title: 'Fensterbank innen?', sub: ki.fbi ? 'Laut Foto: ' + AW.lab('bank', ki.fbi) + '.' : '', kind: 'chips', group: 'fbi', opts: ohne('fbi'), val: w.fbi, act: 'setw', f: 'fbi', view: 'bankInnen', g: 'fensterbank', hint: 'Fensterbank: ' + lab('fbi', w.fbi), offen: 'fbi' });
    L.push({ id: 'fba', title: 'Fensterbank außen?', sub: ki.fba ? 'Laut Foto: ' + AW.lab('bank', ki.fba) + '.' : '', kind: 'chips', group: 'fba', opts: ohne('fba'), val: w.fba, act: 'setw', f: 'fba', view: 'bankAussen', hint: 'Von außen · ' + (istOffen(w, 'fba') ? 'noch offen' : lab('fba', w.fba)), offen: 'fba' });
  }
  L.push({ id: 'montage', title: 'Was soll der Fensterbauer übernehmen?', kind: 'switches', view: 'three', offen: 'montage', offenLabel: 'Fensterbauer schlägt vor', offenSub: 'nach dem Termin vor Ort' });
  L.push({ id: 'notiz', title: 'Noch etwas für den Fensterbauer?', kind: 'text', view: 'three' });
  /* „Weiß ich noch nicht“: keine Option gedrückt */
  L.forEach((q) => { if (q.offen && q.offen !== 'absturz' && istOffen(w, q.offen)) { q.val = '\u0000'; if (q.vals) q.vals = []; } });
  return L;
}
function qCurrent() { const list = qList(S.win); let i = list.findIndex((q) => q.id === S.q); if (i < 0) { i = 0; S.q = list[0].id; } return { list: list, i: i, q: list[i] }; }
/* Name des Fensters: Pflichtfeld in der Frage „Wo ist das Fenster?“ */
const nameDa = (w) => !!String((w && w.name) || '').trim();
function nameVerlangen() {
  S.nameFehler = true; S.q = 'lage'; S.dir = 'back';
  if (S.screen !== 'frage') go('frage'); else render(true);
  nachBild(() => { const f = document.getElementById('t-name'); if (f) f.focus(); }, 60);
}
function qStep(delta) {
  const c = qCurrent(), nx = c.list[c.i + delta];
  if (delta > 0 && c.q.id === 'lage' && !nameDa(S.win)) return nameVerlangen();
  if (!nx) { if (delta > 0) return saveWin(); return go('ergebnis', 'back'); }
  S.q = nx.id; S.dir = delta < 0 ? 'back' : 'fwd'; S.selBar = null; S.qWunsch = false;
  S.openSash = nx.sash != null ? nx.sash : -1; if (nx.sash != null) S.selSash = nx.sash;
  render(true);
  if (nx.sash != null && nx.id.indexOf('typ-') === 0) nachBild(() => { if (S.q === nx.id) oeffnungZeigen(nx.sash); }, 200);
  if (nx.id === 'hsts' || nx.id === 'hstr' || nx.id === 'fswn' || nx.id === 'fsws' || nx.id === 'pskS' || nx.id === 'pskR') nachBild(() => { if (S.q === nx.id) tuerZeigen(); }, 240);
  if (nx.id === 'fswg') nachBild(() => { if (S.q !== nx.id) return; const i = S.win.sashes.findIndex((x) => x.t === 'P'); if (i >= 0) oeffnungZeigen(i, 'D'); }, 240);
}
function qOpt(q, o, pressed, inner) { return '<button type="button" class="qopt" data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : '') + ' data-v="' + o.k + '" aria-pressed="' + pressed + '">' + inner + '</button>'; }
function qCards(q) {
  const opts = q.opts || OPT[q.group], scroll = opts.length > 4;
  return '<div class="qcards' + (scroll ? ' reihe' : opts.length === 4 ? ' quad' : '') + '">' + opts.map((o) => '<div class="qo">' + qOpt(q, o, String(o.k) === String(q.val), (q.ico ? svgIcon(q.ico(o.k), 44) : '') + '<span class="tx"><span class="lbl">' + esc(o.label) + '</span>' + (o.sub ? '<span class="sb">' + esc(o.sub) + '</span>' : '') + (o.price ? '<span class="pr">' + esc(o.price) + '</span>' : '') + '</span>') + (o.g ? '<button type="button" class="qinfo" aria-label="Erklärung" data-act="gloss" data-k="' + o.g + '">' + ICON_I + '</button>' : '') + '</div>').join('') + '</div>';
}
/* Auswahl aus wenigen Optionen, eine Familie: 2–3 kurze Beschriftungen als Segmente, bis 4 kürzere als Raster gleich breiter Chips,
   sonst Zeilen mit Haken. Das Gewicht wechselt beim Auswählen nicht, damit nichts springt. */
const CHECK_S = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="var(--paper)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
function auswahl(opts, attrs, istGewaehlt) {
  const lang = Math.max.apply(null, opts.map((o) => o.label.length)), dots = opts.some((o) => o.bg);
  const knopf = (o, cls, inner) => '<button type="button" class="' + cls + '" ' + attrs + ' data-v="' + o.k + '" aria-pressed="' + istGewaehlt(o) + '">' + inner + '</button>';
  const punkt = (o) => (o.bg ? '<span class="dot" style="background: ' + o.bg + '"></span>' : o.ico ? '<span class="ci">' + o.ico + '</span>' : '');
  if (opts.length <= 3 && lang <= 11 && !dots) return '<div class="seg qseg">' + opts.map((o) => knopf(o, '', esc(o.label))).join('') + '</div>';
  if (opts.length <= 6 && lang <= 16) return '<div class="qchips grid2">' + opts.map((o) => knopf(o, 'chip', punkt(o) + esc(o.label))).join('') + '</div>';
  return '<div class="qlist">' + opts.map((o) => knopf(o, '', '<span class="tx">' + punkt(o) + esc(o.label) + '</span><span class="mark">' + CHECK_S + '</span>')).join('') + '</div>';
}
/* Formen: fünf Symbolkacheln in einer Reihe; Name und Kurzbeschreibung der gewählten Form darunter */
function qFormen(q) {
  const opts = OPT.form, cur = opts.find((o) => o.k === q.val) || opts[0];
  return '<div class="qformen" role="group" aria-label="Form">' + opts.map((o) => '<button type="button" class="qf" data-act="form" data-v="' + o.k + '" aria-pressed="' + (o.k === cur.k) + '" aria-label="' + esc(o.label) + '" title="' + esc(o.label) + '">' + svgIcon(ICO.form(o.k), 54) + '</button>').join('') + '</div><p class="qcur"><b>' + esc(cur.label) + '</b> · ' + esc(cur.sub) + '</p>';
}
function qChips(q) {
  const opts = q.opts || (q.group === 'ol' ? [{ k: 'nein', label: 'Kein Oberlicht' }, { k: 'K', label: 'Oberlicht, kippbar' }, { k: 'F', label: 'Oberlicht, fest' }] : OPT[q.group]);
  const eigen = q.group === 'gf' && farbLesen(S.win.wunschGf);
  return auswahl(opts, 'data-act="' + q.act + '"' + (q.f ? ' data-f="' + q.f + '"' : ''), (o) => !eigen && String(o.k) === String(q.val)) + (q.group === 'gf' ? farbFeld('wunschGf') : '');
}
function qMulti(q) {
  return auswahl(OPT[q.group], 'data-act="' + q.act + '"', (o) => q.vals.indexOf(o.k) >= 0) + (q.vals.length ? '' : '<p class="sub center">Nichts davon? Einfach weiter.</p>');
}
function qColor(q) {
  const w = S.win, side = q.side, cur = side === 'innen' ? (w.gleich ? w.fa : w.fi) : w.fa, wunsch = side === 'innen' ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA, eigen = farbLesen(wunsch), c = rahmenFarbe(w, side);
  const aktiv = c.offen ? '' : eigen ? (COLORS.some((x) => x.k === eigen.key) ? eigen.key : '') : cur;
  let h = '<div class="qswatches">' + COLORS.map((x) => '<button type="button" class="qsw" data-act="color" data-side="' + side + '" data-v="' + x.k + '" aria-pressed="' + (x.k === aktiv) + '" aria-label="' + esc(x.name) + '"><span class="c" style="background: ' + x.bg + '"></span><span class="n">' + esc(x.name).replace(/^(Verkehrs|Anthrazit|Schwarz|Basalt)(weiß|grau|braun)$/, '$1&shy;$2') + '</span></button>').join('') + '</div>';
  h += c.offen ? '<p class="qcur"><b>Noch offen</b> · im Modell neutral weiß' + (side === 'innen' && w.gleich ? ' · wie außen' : '') + '</p>' : '<p class="qcur"><b>' + esc(c.name) + '</b> · ' + esc(c.eigen ? 'eigene Farbe' : c.code) + (side === 'innen' && w.gleich ? ' · wie außen' : '') + '</p>';
  if (side === 'innen') h += '<div class="qrow"><button type="button" class="chip" data-act="togglew" data-f="gleich" aria-pressed="' + w.gleich + '">Innen wie außen</button></div>';
  return h + farbFeld(side === 'innen' ? 'wunschI' : 'wunschA');
}
/* Unterlicht: Art als Chips, Höhe als Stufenregler in 5-cm-Schritten */
function qUnterlicht() {
  const w = S.win, cur = w.ul ? w.ulA : 'nein';
  let h = auswahl(OPT.ul, 'data-act="ul-set"', (o) => o.k === cur);
  if (w.ul) h += '<div class="qsteps"><div class="qstep"><span class="t"><b>Höhe des Unterlichts</b><small>Unterkante Fenster bis Flügel</small></span><span class="stepper weit"><button type="button" data-act="ulh" data-v="-50" aria-label="Niedriger"' + (num(w.ulH) > 200 ? '' : ' disabled') + '>−</button><b>' + thousand(w.ulH) + ' mm</b><button type="button" data-act="ulh" data-v="50" aria-label="Höher"' + (num(w.ulH) < 1200 ? '' : ' disabled') + '>+</button></span></div></div>';
  return h;
}
function qGeh() { const w = S.win; return '<div class="rows">' + switchRow('Gehflügel', 'Ein Flügel geht wie eine Tür auf', !!w.fsw.geh, 'geh', 'fsw', 'fsw') + '</div>'; }
/* Farbfelder für Sonnenschutz außen und innen */
function qSwatch(q) {
  const opts = OPT[q.group], cur = opts.find((o) => o.k === q.val) || opts[0], ff = q.f === 'sfarbe' ? 'wunschSf' : 'wunschIf', eigen = farbLesen(S.win[ff]);
  return '<div class="qswatches">' + opts.map((o) => '<button type="button" class="qsw" data-act="setw" data-f="' + q.f + '" data-v="' + o.k + '" aria-pressed="' + (!eigen && o.k === cur.k) + '" aria-label="' + esc(o.label) + '"><span class="c" style="background: ' + o.bg + '"></span><span class="n">' + esc(o.label) + '</span></button>').join('') + '</div><p class="qcur"><b>' + esc(eigen ? eigen.name : cur.label) + '</b>' + (eigen ? ' · eigene Farbe' : '') + '</p>' + farbFeld(ff);
}
/* Eigene Farbe: ein Textfeld unter jeder Farbwahl. Erkennt RAL (z. B. 7021), DB 703, Holzdekore, Farbwörter und #hex;
   der Tupfen zeigt die erkannte Farbe, das Modell färbt sich schon beim Tippen. */
const FARBFELD = { wunschA: 'z. B. RAL 7021 oder DB 703', wunschI: 'z. B. RAL 9001 oder Eiche', wunschGf: 'z. B. Messing oder RAL 9005', wunschSf: 'z. B. RAL 7016 oder DB 703', wunschIf: 'z. B. Sand, Taupe oder RAL 1015' };
function farbInfo(t) { if (!String(t || '').trim()) return ''; const f = farbLesen(t); return f ? 'Erkannt: ' + f.name + '. So im Modell, der Fensterbauer bekommt genau diese Angabe.' : 'Nicht in der Farbliste. Dein Fensterbauer bekommt den Text und schlägt den nächstliegenden Ton vor.'; }
const FF_X = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';
function farbFeld(f) {
  const v = S.win[f] || '', fx = farbLesen(v);
  return '<div class="farbfeld' + (v ? ' hat' : '') + (fx ? ' ok' : '') + '"><span class="ff-tupf" style="' + (fx ? 'background: ' + fx.bg : '') + '" aria-hidden="true"></span><input type="text" id="t-' + f + '" data-in="farbe" data-f="' + f + '" value="' + esc(v) + '" maxlength="60" placeholder="Eigene Farbe, ' + esc(FARBFELD[f] || '') + '" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done" aria-label="Eigene Farbe eingeben" aria-describedby="ffi-' + f + '">' +
    '<button type="button" class="ff-x" data-act="farbe-weg" data-f="' + f + '" aria-label="Eigene Farbe löschen"' + (v ? '' : ' hidden') + '>' + FF_X + '</button></div><p class="ff-info" id="ffi-' + f + '" aria-live="polite">' + esc(farbInfo(v)) + '</p>';
}
/* Beim Tippen: Tupfen, Hinweis und Modell nachziehen, ohne neu aufzubauen (Fokus und Cursor bleiben) */
function farbeLive(el, f) {
  const box = el.closest('.farbfeld'), fx = farbLesen(el.value);
  if (box) { box.classList.toggle('hat', !!el.value); box.classList.toggle('ok', !!fx); const t = box.querySelector('.ff-tupf'); if (t) t.style.background = fx ? fx.bg : ''; const x = box.querySelector('.ff-x'); if (x) x.hidden = !el.value; }
  const info = document.getElementById('ffi-' + f); if (info) info.textContent = farbInfo(el.value);
  /* Name der aktuellen Farbe und Auswahl in der Liste gleich mitziehen */
  const w = S.win, cur = document.querySelector('.qpanel .qcur');
  if (cur && (f === 'wunschA' || f === 'wunschI')) { const c = rahmenFarbe(w, f === 'wunschI' ? 'innen' : 'aussen'); cur.innerHTML = '<b>' + esc(c.name) + '</b> · ' + esc(c.eigen ? 'eigene Farbe' : c.code); }
  else if (cur && (f === 'wunschSf' || f === 'wunschIf')) cur.innerHTML = '<b>' + esc(f === 'wunschSf' ? sonneName(w) : innenName(w)) + '</b>' + (fx ? ' · eigene Farbe' : '');
  if (fx) document.querySelectorAll('.qpanel .qsw[aria-pressed="true"], .qpanel .chip[data-f="gf"][aria-pressed="true"]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  const ob = document.querySelector('.qpanel .qoffen'); if (ob && (f === 'wunschA' || f === 'wunschI')) ob.setAttribute('aria-pressed', String(istOffen(w, f === 'wunschA' ? 'fa' : 'fi')));
  const st = document.getElementById('w3d'), reg = W3DS.w3d; if (st && reg) { w3dPaint(st, w); w3dLayout(st, w, reg.o); }
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
  h += '<p class="qlabel">Einbruchschutz</p>' + auswahl(OPT.rc.filter((o) => o.k !== 'rc1' || w.rc === 'rc1'), 'data-act="setw" data-f="rc"', (o) => !offen && w.rc === o.k);
  return h;
}
/* Gestaltung übernehmen: je gespeicherte Gestaltung eine Karte (gleiche zusammengefasst), mit Zeichnung, Räumen und den wichtigsten Angaben */
const DESIGN_FELDER = ['material', 'fa', 'fi', 'gleich', 'wunschA', 'wunschI', 'glas', 'glasfn', 'orn', 'spross', 'breite', 'aufSeite', 'griff', 'gf', 'wunschGf', 'rc', 'sart', 'roll', 'sfarbe', 'wunschSf', 'antrieb', 'iart', 'ifarbe', 'wunschIf', 'insekt', 'fbi', 'fba', 'ralm', 'putz'];
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
  DESIGN_FELDER.forEach((k) => { w[k] = kopie(src[k] === undefined ? baseWin()[k] : src[k]); });
  const art = w.art || 'fenster';
  if (art === 'fest') w.griff = 'ohne';
  else if (art === 'hst') { if (!OPT.hstGriff.some((o) => o.k === w.griff)) w.griff = 'standard'; }
  else if (art === 'fsw' || art === 'psk') { if (w.griff !== 'abschliessbar') w.griff = 'standard'; }
  else if (w.griff === 'motor') w.griff = 'standard';
  if (w.neu) { if (w.sart === 'behalten') { w.sart = 'keiner'; w.roll = 'keiner'; } if (w.fbi === 'behalten') w.fbi = 'werzalit'; if (w.fba === 'behalten') w.fba = 'alu'; }
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
  const sec0 = QSEC[q.id.split('-')[0]] || 'Fenster', sec = sec0 === 'Fenster' ? (istTuer(w) ? 'Tür' : w.art === 'fest' ? 'Verglasung' : 'Fenster') : sec0;
  let panel;
  if (q.kind === 'cards') panel = qCards(q); else if (q.kind === 'formen') panel = qFormen(q); else if (q.kind === 'chips') panel = qChips(q); else if (q.kind === 'multi') panel = qMulti(q); else if (q.kind === 'color') panel = qColor(q);
  else if (q.kind === 'orn') panel = qOrn(); else if (q.kind === 'bars') panel = qBars(); else if (q.kind === 'switches') panel = qSwitches(); else if (q.kind === 'lage') panel = qLage();
  else if (q.kind === 'ul') panel = qUnterlicht(); else if (q.kind === 'geh') panel = qGeh(); else if (q.kind === 'swatch') panel = qSwatch(q); else if (q.kind === 'rc') panel = qRc(); else if (q.kind === 'design') panel = qDesign(); else panel = qText();
  if (q.offen) panel += offenZeile(q);
  /* Gestaltung übernommen: gleich speichern oder die Fragen einzeln durchgehen */
  const designFertig = q.kind === 'design' && /aria-pressed="true"/.test(panel);
  const isSash = q.sash != null, selIdx = isSash ? q.sash : Math.min(S.selSash, w.sashes.length - 1);
  const view = q.id === 'sprossen' || q.kind === 'bars' ? 'front' : q.view;
  const stage = model(w, { id: 'w3d', view: view, sway: !isSash && q.kind !== 'bars', selectable: isSash, selSash: selIdx, openSash: isSash ? S.openSash : -1, symbols: isSash || q.id === 'richtung', rails: q.kind === 'bars', selBar: S.selBar, formen: q.id === 'form', lupe: !!q.lupe, stageH: 'auto', fitW: q.kind === 'bars' ? 0.72 : view === 'front' ? 0.88 : 0.66, fitH: q.kind === 'bars' ? 0.66 : view === 'front' ? 0.82 : 0.72, hint: q.kind === 'bars' ? '' : (q.hint || '') });
  const title = hd('Frage ' + (c.i + 1) + ' von ' + n + ' · ' + sec, esc(q.title) + (q.g ? ' <button type="button" class="qg" aria-label="Erklärung" data-act="gloss" data-k="' + q.g + '">' + ICON_I + '</button>' : ''), q.sub ? esc(q.sub) : '', 'compact');
  const sichern = istTuer(w) ? 'Tür speichern' : w.art === 'fest' ? 'Verglasung speichern' : 'Fenster speichern';
  const html = title + stage + '<div class="qpanel" data-q="' + q.id + '">' + panel + '</div>' + '<div class="qnav"><button type="button" class="btn ghost" data-act="qprev" aria-label="Zurück">' + '<svg width="11" height="19" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>' +
    (designFertig ? '<button type="button" class="btn ghost anpassen" data-act="qnext">Anpassen</button><button type="button" class="btn primary" data-act="save">Speichern</button>' : '<button type="button" class="btn primary" data-act="qnext">' + (last ? sichern : 'Weiter') + '</button>') + '</div>';
  return { html: html, back: [c.i ? 'Zurück' : 'Ergebnis', 'qprev'], fit: true, qpos: (c.i + 1) / n };
};
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
  const V = w3dCalc(w, Object.assign({}, o, { stageW: stage.clientWidth || 358, stageH: stage.clientHeight || 360 })), s = V.s;
  const sashW = V.sashW * s, n = w.sashes.length, schema = (w.fsw || {}).schema || 'links';
  const nl = schema === 'links' ? n : schema === 'rechts' ? 0 : Math.ceil(n / 2);
  /* Je Flügel eine Keyframe-Folge aus 27 Stützstellen der Scharnierbewegung (gerechnet, nicht geschätzt): Abstand zur Ruhelage
     in x, Tiefe für jeden zweiten Flügel, Drehung um die Kante zum Paket. Die Animation läuft im Compositor, nicht je Bild im Skript. */
  const D = 2600, N = 26, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), phase = (t) => (t < 0.42 ? ease(t / 0.42) : t < 0.58 ? 1 : ease((1 - t) / 0.42));
  const els = w.sashes.map((x, i) => q('sash-' + i));
  let css = '';
  els.forEach((el, i) => {
    const links = i < nl, k = links ? i : n - 1 - i;
    let kf = '';
    for (let j = 0; j <= N; j++) {
      const t = j / N, a = phase(t) * 78 * Math.PI / 180, dx = (links ? 1 : -1) * k * sashW * (Math.cos(a) - 1), dz = k % 2 ? sashW * Math.sin(a) : 0, dreh = (links ? (k % 2 ? 1 : -1) : (k % 2 ? -1 : 1)) * a * 180 / Math.PI;
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
const GLOSS_RG = { dinlr: '/ratgeber/din-links-rechts/', symbol: '/ratgeber/din-links-rechts/', bruestung: '/ratgeber/bruestungshoehe-fenster/', absturz: '/ratgeber/bruestungshoehe-fenster/', aufsatz: '/ratgeber/fenster-mit-rollladen-ausmessen/', vorbau: '/ratgeber/fenster-mit-rollladen-ausmessen/', balkon: '/ratgeber/balkontuer-ausmessen/', hst: '/ratgeber/balkontuer-ausmessen/', psk: '/ratgeber/balkontuer-ausmessen/', schwelle: '/ratgeber/balkontuer-ausmessen/', feinaufmass: '/ratgeber/bestellmass-fenster/', ralmontage: '/ratgeber/ral-montage-fenster/', laibung: '/ratgeber/fenster-ausmessen/', anschlag: '/ratgeber/fenster-ausmessen/', lueftung: '/ratgeber/lueftungskonzept-fenstertausch/', foerderung: '/ratgeber/fenster-austauschen/', uwert: '/ratgeber/uw-wert-fenster/', fensterbank: '/ratgeber/fensterbank-ausmessen/' };
const SHORT = { unterlicht: 'Unterlicht', festverglasung: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', fsw: 'Faltschiebewand', balkon: 'Balkon- und Terrassentür', psk: 'PSK-Tür', absturz: 'Absturzsicherung', foerderung: 'Förderung', schwelle: 'Schwelle', raffstore: 'Raffstore', screen: 'Screen', innenschutz: 'Rollo, Plissee, Jalousie', neuoeffnung: 'Neue Öffnung', dinlr: 'DIN links/rechts', symbol: 'Öffnungssymbole', dk: 'Dreh-Kipp', fest: 'Festverglasung', kipp: 'Kippfenster', stulp: 'Stulpfenster', pfosten: 'Pfosten', oberlicht: 'Oberlicht', anschlag: 'Maueranschlag', laibung: 'Laibung', bruestung: 'Brüstungshöhe', rahmenmass: 'Öffnung und Element', wiener: 'Wiener Sprosse', szr: 'Innenliegende Sprossen', auf: 'Aufgesetzte Sprossen', echt: 'Glasteilende Sprossen', uwert: 'U-Wert', schall: 'Schallschutzglas', vsg: 'Sicherheitsglas', ornament: 'Ornamentglas', rc2: 'RC2', aufsatz: 'Aufsatzrollladen', vorbau: 'Vorbaurollladen', insekt: 'Insektenschutz', ralmontage: 'RAL-Montage', fensterbank: 'Fensterbank', ral: 'RAL-Farben', lueftung: 'Lüftungskonzept', referenz: 'Genauigkeit', feinaufmass: 'Feinaufmaß' };
function sheetsHTML() {
  const X = '<svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="var(--seg)"></circle><path d="M10.5 10.5l9 9M19.5 10.5l-9 9" fill="none" stroke="var(--muted)" stroke-width="2.2" stroke-linecap="round"></path></svg>';
  if (S.ohneFotoFrage && S.screen === 'fotos') return ohneFotoBlatt();
  if (S.gloss && GLOSS[S.gloss]) {
    const G = GLOSS[S.gloss];
    return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet" role="dialog" aria-label="Glossar"><div class="grip"></div><div class="sheet-top"><button type="button" class="link" data-act="gindex">Alle Begriffe</button><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + X + '</button></div><p class="eyebrow" style="text-align: center; margin-top: 4px">Glossar</p><h2 style="margin-top: 14px">' + esc(G.t) + '</h2><div class="ico' + (G.lottie ? ' ico-l' : '') + '"' + (G.lottie ? ' data-lottie="' + G.lottie + '" data-loop="1"' : '') + '><span class="lottie-still">' + svgIcon(G.ico(), 132) + '</span></div>' + G.x.map((x) => '<p class="x">' + esc(x) + '</p>').join('') + (G.see.length ? '<div class="see"><span>Siehe auch:</span>' + G.see.map((k) => '<button type="button" class="ulink" style="min-height: 44px" data-act="gloss" data-k="' + k + '">' + esc(SHORT[k]) + '</button>').join('') + '</div>' : '') + (GLOSS_RG[S.gloss] && !S.betrieb ? '<p class="see"><a class="ulink" style="min-height: 44px" href="' + GLOSS_RG[S.gloss] + '" target="_blank" rel="noopener">Ausführlich im Ratgeber</a></p>' : '') + rechtLinks() + '</div>';
  }
  if (S.glossIndex) return '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="gclose"></button><div class="sheet" role="dialog" aria-label="Alle Begriffe" style="padding-inline: 16px"><div class="grip"></div><div style="display: flex; justify-content: flex-end; margin-right: -4px"><button type="button" class="xbtn" aria-label="Schließen" data-act="gclose">' + X + '</button></div><p class="eyebrow" style="text-align: center">Glossar</p><h2 style="margin: 12px 0 20px">Fachbegriffe, einfach erklärt.</h2><div class="gindex">' + GLOSS_ORDER.map((k) => '<button type="button" data-act="gloss" data-k="' + k + '"><span><b>' + esc(SHORT[k]) + '</b><small>' + esc(GLOSS[k].t) + '</small></span>' + CHEV + '</button>').join('') + '</div>' + rechtLinks() + '</div>';
  return '';
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
const maxMsg = () => 'Ein Aufmaß umfasst höchstens ' + GRENZE.fenster + ' Fenster, gelöschte zählen mit. Gleiche Fenster zählst du über „Anzahl“' + (S.betrieb ? '; für ein weiteres Haus schickt dir ' + (S.betrieb.name || 'dein Fensterbauer') + ' gern einen eigenen Link.' : '; für ein weiteres Haus beginnst du ein neues Aufmaß.');
/* Stand der Änderungen an einem Fenster: frei (erste Woche, beim Kundenlink auch während einer Nachbesserung, um die der Betrieb
   gebeten hat), rest (Änderungen danach), fest */
function aendStand(w, jetzt) {
  jetzt = jetzt || zeit();
  const kaufAm = !S.betrieb && S.kauf && S.kauf.paid ? Number(S.kauf.when) || 0 : 0; // mit dem Kauf endet die freie Woche
  const t0 = Number(w && w.t0) || jetzt, woche = t0 + GRENZE.freiTage * TAG_MS, bis = kaufAm ? Math.min(woche, kaufAm) : woche, n = Number(w && w.aend) || 0;
  const nb = jetzt >= bis && !!(S.betrieb && S.nb), frei = jetzt < bis || nb;
  return { frei: frei, nb: nb, bis: bis, kauf: !!kaufAm && kaufAm <= woche, n: n, rest: Math.max(0, GRENZE.aenderungen - n), fest: !frei && n >= GRENZE.aenderungen };
}
/* Fingerabdruck eines Fensters ohne Zähler und ohne das abgeleitete Bild der Lage (gleiche Regel wie auf dem Server) */
const stabil = (v) => (Array.isArray(v) ? '[' + v.map(stabil).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v));
function fensterFp(w) { const o = Object.assign({}, w); delete o.wid; delete o.t0; delete o.aend; delete o.ts; if (o.plan && typeof o.plan === 'object') { o.plan = Object.assign({}, o.plan); delete o.plan.bild; delete o.plan.bw; delete o.plan.bh; } return stabil(o); }
/* Für die Zählung der Änderungen: ohne die Auswertung der Fotos, die Zahl der Fotos, ihre Kennungen und die Wahl „ohne Foto“. Eine
   Auswertung, die nach dem Speichern ankommt, oder ein neues Foto ist keine Änderung des Kunden (gleiche Regel wie auf dem Server) */
function aenderungFp(w) { const o = Object.assign({}, w); delete o.ki; delete o.fotos; delete o.bilder; delete o.ohneFoto; return fensterFp(o); }
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
function linkOffen() { if (!S.betrieb || !S.linkZu || S.linkZu === 'eingegangen') return true; toast(S.linkZuText || 'Dieser Link ist nicht mehr aktiv.'); return false; }

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
const entwurfAn = () => SERVER.daten && !S.sync.aus && !S.tour && (S.betrieb ? !vorschau() && !S.sent && !(S.linkZu && S.linkZu !== 'eingegangen') : kontoAn());
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
      if (r && r.ok && r.aus) sync.aus = true;
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
  S.sync.fp = entwurfFp(); S.sync.pfp = stabil(S.proj); lokalSpeichern();
}
/* Das Aufmaß dieses Geräts wegnehmen: Speicher und Bilder der Lage weg, dann leer (alle: auch die Bilder anderer Aufmaße, etwa
   beim Wechsel des Kontos) */
function hierLeeren(alle) {
  const k = S.kauf && S.kauf.kennung;
  clearTimeout(S.sync.timer);
  try { localStorage.removeItem(STORE); } catch (e) { /* ok */ }
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
    if (S.sent || (S.linkZu && S.linkZu !== 'eingegangen')) return null;
    const code = S.betrieb.code;
    return { schluessel: 'link:' + code, pfad: (id) => '/api/link/' + encodeURIComponent(code) + '/foto/' + id, abruf: (p, init) => fetch(p, init), nurGespeichert: true };
  }
  if (kontoAn()) { const k = S.kauf.kennung; return { schluessel: 'konto:' + k, pfad: (id) => '/api/kunde/aufmass/' + encodeURIComponent(k) + '/foto/' + id, abruf: kontoAbruf, lesbar: true, nurGespeichert: true }; }
  return null;
}
/* Kennungen der Fotos dieses Aufmaßes: gespeicherte Fenster, dazu (ohne nurGespeichert) das gerade bearbeitete */
function fotoIdsHier(nurGespeichert) { const s = new Set(); S.windows.forEach((w) => bilderVon(w).forEach((id) => s.add(id))); if (!nurGespeichert) bilderVon(S.win).forEach((id) => s.add(id)); return s; }
const FotoSync = { laeuft: false, nochmal: false, fehler: 0, timer: 0, fertig: [] };
async function fotosHochladen() {
  if (FotoSync.laeuft) { FotoSync.nochmal = true; return; }
  const z = fotoZiel(); if (!z) return;
  FotoSync.laeuft = true; clearTimeout(FotoSync.timer);
  try {
    for (const id of fotoIdsHier(!!z.nurGespeichert)) {
      if (fotoZiel() === null || fotoZiel().schluessel !== z.schluessel) break; // inzwischen gesendet oder ein anderes Aufmaß
      const v = await Fotos.holen(id);
      if (!v || !v.blob || (v.hoch && v.hoch[z.schluessel])) continue;
      const text = await blobText(v.blob), bild = text.slice(text.indexOf(',') + 1);
      if (!bild) continue;
      const r = await z.abruf(z.pfad(id), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ bild: bild }) });
      if (r.ok) { await Fotos.vermerken(id, z.schluessel); FotoSync.fehler = 0; continue; }
      if ([400, 403, 409, 410, 413].includes(r.status)) continue; // geht so nicht (Link zu, zu groß, voll): nicht endlos versuchen
      throw new Error('Foto nicht angekommen (' + r.status + ')');
    }
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
  for (const id of fotoIdsHier(true)) { if (FOTO_ARBEIT.has(id)) { n++; continue; } const v = await Fotos.holen(id); if (v && v.blob && !(v.hoch && v.hoch[z.schluessel])) n++; }
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
    Object.keys(localStorage).filter((k) => k === STORE || k.indexOf('aufmass.k.') === 0).forEach((k) => { const o = JSON.parse(localStorage.getItem(k) || 'null'); ((o && o.windows) || []).forEach((w) => bilderVon(w).forEach((id) => genannt.add(id))); });
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
  if (f.fassade && f.fassade !== 'sonstige') w.fassade = f.fassade;
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
  S.win = kopie(ziel); persist(); go('fertig');
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
    case 'felder': { w.e_teilung = true; w.teilung = v; w.sashes = festFelder(v === '2p' ? 2 : num(v)); mirrorBars(w); S.selSash = 0; S.selBar = null; return render(); }
    case 'ul-set': { w.ul = v !== 'nein'; if (v !== 'nein') w.ulA = v; return render(); }
    case 'ulh': { w.ulH = clamp(num(w.ulH) + n(v), 200, 1200); return render(); }
    case 'hst': { w.hst = Object.assign({}, w.hst, { [f]: v }); if (f === 'schwelle') entschieden(w, 'schwelle'); if (f !== 'schwelle') { w.sashes = hstFluegel(w.hst.schema, w.hst.richtung); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; } render(); if (f !== 'schwelle') nachBild(tuerZeigen, 120); return; }
    case 'fsw': { const o = Object.assign({}, w.fsw); if (f === 'geh') o.geh = !o.geh; else if (f === 'n') o.n = clamp(num(v), 2, 7); else o[f] = v; w.fsw = o; if (f === 'schwelle') entschieden(w, 'schwelle'); if (f !== 'schwelle') { w.sashes = fswFluegel(o.n, o.schema, o.geh); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; } render(); if (f === 'geh' && o.geh) { nachBild(() => { const i = w.sashes.findIndex((x) => x.t === 'P'); if (i >= 0) oeffnungZeigen(i, 'D'); }, 120); } else if (f !== 'schwelle') nachBild(tuerZeigen, 120); return; }
    case 'psk': { w.psk = Object.assign({}, w.psk, { [f]: v }); w.sashes = pskFluegel(w.psk.schema, w.psk.richtung); w.teilung = String(w.sashes.length); mirrorBars(w); S.selSash = 0; render(); nachBild(tuerZeigen, 120); return; }
    case 'bt': { w.bt = Object.assign({}, w.bt, { [f]: v }); entschieden(w, f); return render(); }
    case 'offen': { const k = f, an = k === 'glasfn' ? !(w.offen && w.offen[k]) : true; offenSetzen(w, k, an); return render(); }
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
      if (v === 'keiner' || v === 'behalten') w.roll = v; else { if (w.roll !== 'vorbau') w.roll = 'aufsatz'; if (!vorher) w.offen = Object.assign({}, w.offen || {}, { einbau: true }); }
      return render();
    }
    case 'go': if (v === 'ergebnis' && S.screen === 'fertig' && (!darfAendern() || !linkOffen())) return; return go(v);
    case 'back': { const view = SCREENS[S.screen] ? SCREENS[S.screen]() : null, b = view && view.back ? view.back[1] : 'home'; if (b === 'tour-ende') return tourEnde(); if (b === 'mess-prev') return messPrev(); if (b === 'qprev') return qStep(-1); if (b === 'mess-back') { S.mess.step = 3; const st = MESS[3]; S.mess.cur = String(w.el[st.k] || ''); return go('messen', 'back'); } return go(b, 'back'); }
    case 'copywin': { if (!linkOffen()) return; if (!neuMoeglich()) return toast(maxMsg()); const c = Object.assign(baseWin(), kopie(w), { name: (w.name || 'Fenster') + ' (Kopie)', fotos: 0, ki: w.ki, wid: neueWid(), t0: zeit(), aend: 0, ts: zeit() }); S.angelegt = angelegt() + 1; S.windows.push(kopie(c)); S.editIdx = S.windows.length - 1; S.win = kopie(c); S.designVorher = null; persist(); toast('Kopiert, Maße prüfen'); return go('ergebnis'); }
    case 'new': if (S.betrieb && S.sent) return toast('Schon gesendet. Änderungen bitte direkt mit ' + (S.betrieb.name || 'deinem Fensterbauer') + ' klären.'); if (!linkOffen()) return; if (!neuMoeglich()) return toast(maxMsg()); return newWin();
    case 'open': { if (S.betrieb && S.sent) return; if (!linkOffen()) return; const i = +el.getAttribute('data-i'); S.win = altAngleichen(Object.assign(baseWin(), kopie(S.windows[i]))); S.editIdx = i; S.selSash = 0; S.photos = { in: null, out: null }; S.ai = { in: null, out: null }; S.designVorher = null; fotosInKacheln(S.win, S.photos); return go('fertig'); }
    case 'delwin': { if (!linkOffen()) return; if (S.editIdx < 0 || !S.windows[S.editIdx]) { S.editIdx = -1; go('home', 'back'); return toast('Dieses Fenster gibt es nicht mehr.'); } const weg = S.windows[S.editIdx]; if (weg.wid) { S.sync.geloescht[weg.wid] = zeit(); const alle = Object.keys(S.sync.geloescht); if (alle.length > 200) alle.sort((a, b) => S.sync.geloescht[a] - S.sync.geloescht[b]).slice(0, alle.length - 200).forEach((k) => { delete S.sync.geloescht[k]; }); } S.angelegt = angelegt(); S.windows.splice(S.editIdx, 1); S.editIdx = -1; persist(); Fotos.weg(bilderVon(weg).filter((id) => !S.windows.some((x) => bilderVon(x).includes(id)))); toast('Fenster gelöscht'); return go('home', 'back'); }
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
    case 'aufmass-neu-ja': { if (S.betrieb) return; if (kontoBereit() && KS) return kontoNeuesAufmass(); S.neuFrage = false; fotosHierWeg(true); try { localStorage.removeItem(STORE); } catch (e) { /* ok */ } loadOwn(); S.teil = null; toast('Neues Aufmaß begonnen'); return go('home'); }
    case 'gloss': { S.gloss = el.getAttribute('data-k'); S.glossIndex = false; return render(); }
    case 'gindex': { S.gloss = null; S.glossIndex = true; return render(); }
    case 'gclose': { S.gloss = null; S.glossIndex = false; return render(); }
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
    case 'mess-cm': { messInput(v); S.mess.msg = null; return render(); }
    case 'rest-next': return restNext(!!el.getAttribute('data-ack'));
    case 'rest-cm': { restInput(v); S.rest.msg = null; return render(); }
    case 'rest-same': { S.rest.cur = String(num(v) || ''); S.rest.msg = null; return restNext(true); }
    case 'key': return keyIn(v);
    case 'qnext': return qStep(1);
    case 'wuensche': { if (S.screen === 'fertig' && (!darfAendern() || !linkOffen())) return; S.q = null; S.openSash = -1; S.designVorher = null; S.nameFehler = false; return go('frage'); }
    case 'qprev': return qStep(-1);
    case 'qwunsch': { S.qWunsch = !S.qWunsch; render(); const t = document.getElementById('t-wunsch'); if (t && S.qWunsch) t.focus(); return; }
    case 'ol-set': { w.ol = v !== 'nein'; if (v !== 'nein') w.olT = v; return render(); }
    case 'sash': { const i = Math.min(S.selSash, w.sashes.length - 1); w.sashes = w.sashes.map((s, j) => (j === i ? Object.assign({}, s, { [f]: v }) : s)); S.openSash = i; render(); nachBild(() => oeffnungZeigen(i, f === 'din' ? 'D' : null)); return; }
    case 'sash-tap': return onSashTap(+v);
    case 'teilung': { w.e_teilung = true; const sashes = sashesFor(v); w.teilung = v; w.sashes = sashes; mirrorBars(w); S.selSash = 0; S.selBar = null; S.openSash = -1; return render(); }
    case 'form': {
      if (v === w.form) return render();
      if (v === 'rund') {
        VOR_RUND.set(w, { teilung: w.teilung, sashes: w.sashes, ol: w.ol, olT: w.olT, bars: w.bars, preset: w.preset });
        const hatte = w.sashes.length > 1 || w.sashes[0].t !== 'F' || w.ol;
        w.form = v; w.teilung = '1'; w.sashes = [{ t: 'F', din: 'L' }]; w.ol = false; mirrorBars(w); S.selSash = 0;
        return hatte ? toast('Runde Fenster sind fest verglast, ohne Flügel und Oberlicht') : render();
      }
      const vor = w.form === 'rund' ? VOR_RUND.get(w) : null;
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
    case 'send': { if (vorschau()) return toast('Vorschau: Hier wird nichts gesendet.'); if (S.betrieb && S.sent) return go('gesendet'); if (!linkOffen()) return; if (!S.windows.some((x) => derive(x).complete)) return toast('Bitte erst ein Fenster vollständig messen'); return kiVorher('senden').then((weiter) => { if (!weiter || (S.betrieb && S.sent)) return; if (SERVER.daten && S.betrieb) return sendenServer(); S.sent = { when: Date.now(), code: packProject(S.windows, S.proj, S.betrieb), runde: S.nb && S.nb.runde ? S.nb.runde : 1 }; S.nb = null; S._feier = 'gesendet'; persist(); go('gesendet'); }); }
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
    case 'download': return saveDatei();
    default: return;
  }
}
const TOUR_DARF = /^(tour-[a-z]+|gloss|gindex|gclose|back|teilung|sash|felder|hst|fsw|psk|setw|color|sart|glasfn|situation|none)$/;
/* Zifferntasten und Tastatur fürs Messen: kein Eingabefeld, keine Systemtastatur, nichts springt */
/* Haptik (gemeinsam.js): Tasten, Auswahl und Schalter tippen kurz; Fehler und fertige Schritte melden sich in feiern()/messNext() */
const TIPPT = /^(key|rest-same|qnext|qprev|new|send|gloss|q-|chip|seg|opt|sw|tile|pos|share|copy|k-pay|k-buy|situation|art|felder|ul|hst|fsw|sart|farbe)/;
function tippen(name, el) { if (!window.Haptik) return; if (TIPPT.test(name) || el.matches('.chip, .seg > button, .qopt, .qlist > button, .qsw, .pill, .switch, .keypad button, .stepper button, .colors button')) window.Haptik.tick(); }
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
  try { await DL.save({ filename: 'Aufmass-' + (slug(S.proj.name) || 'eeziframes') + '.md', data: blattMarkdown(S.windows, S.proj) }); toast('Gespeichert'); }
  catch (e) { if (e && e.code !== 'declined') toast('Speichern hat nicht geklappt'); }
}
function onInput(el, ev) {
  const kind = el.getAttribute('data-in'), f = el.getAttribute('data-f');
  if (kind === 'mess') return messInput(el.value);
  if (kind === 'k') { const k = kauf(); k[f] = el.value; if (k.err && k.err[f]) { delete k.err[f]; const box = el.closest('.kf'); if (box) { box.classList.remove('bad'); const sm = box.querySelector('small'); if (sm) sm.remove(); } } return; }
  if (kind === 'kc') { const k = kauf(); k[f] = el.checked; if (k.err && k.err[f]) { delete k.err[f]; render(); } persist(); return; }
  if (kind === 's') { const z = S.sichern; if (!z) return; z[f] = el.value; if (z.err && z.err[f]) { delete z.err[f]; const box = el.closest('.kf'); if (box) { box.classList.remove('bad'); const sm = box.querySelector('small'); if (sm) sm.remove(); } } return; }
  if (kind === 'sc') { const z = S.sichern; if (!z) return; z[f] = el.checked; if (z.err && z.err[f]) { delete z.err[f]; render(); } return; }
  if (kind === 'rest') return restInput(el.value);
  if (kind === 'farbe') { S.win[f] = String(el.value).slice(0, 60); if (f === 'wunschI' && S.win.wunschI.trim()) S.win.gleich = false; if (S.win[f].trim()) { offenMerken(S.win, f); entschieden(S.win, f); } else offenZurueck(S.win, f); farbeLive(el, f); if (ev.type === 'change') render(); return; }
  if (kind === 'plan') { if (ev.type !== 'change') return; planMasse(S.win, f, String(el.value).replace(/\D/g, '')); return render(); }
  /* Name des Fensters: bei jedem Tastendruck übernehmen, ohne neu zu zeichnen. So geht das Tippen auf „Weiter“ direkt nach der
     Eingabe nicht verloren (ein Neuzeichnen beim Verlassen des Felds würde den Knopf unter dem Finger austauschen). */
  if (kind === 'w' && f === 'name') {
    S.win.name = String(el.value).slice(0, 50);
    const box = el.closest('.trow');
    if (box && S.nameFehler && nameDa(S.win)) { box.classList.remove('bad'); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); const m = box.querySelector('.trow-f'); if (m) m.remove(); }
    return;
  }
  if (ev.type !== 'change') return;
  if (kind === 'ohnefoto-zu') { try { if (el.checked) localStorage.setItem(OHNE_FOTO_ZU, '1'); else localStorage.removeItem(OHNE_FOTO_ZU); } catch (e) { /* ohne Speicher */ } return; }
  if (kind === 'photo') { S.ohneFotoFrage = false; return onPhoto(f, el.files && el.files[0]); }
  if (kind === 'w') { if (NUMF[f]) { const v = parseInt(String(el.value).replace(/\D/g, ''), 10); S.win[f] = isNaN(v) ? '' : Math.min(v, 9999); if (f === 'laib') S.win.e_laib = true; } else S.win[f] = el.value; return render(); }
  if (kind === 'p') { S.proj[f] = f === 'total' ? (Math.min(parseInt(String(el.value).replace(/\D/g, ''), 10) || 0, 999) || '') : f === 'baujahr' ? el.value.replace(/\D/g, '').slice(0, 4) : el.value; persist(); return render(); }
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
  bindZeichnen();
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
      const lb = document.querySelector('#w3d [data-r="lab-' + dimKey(st) + '"]'); if (lb) lb.textContent = thousand(m.cur) + ' mm';
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
    '<div class="tb-boxen"><div class="tb-box"><p class="tb-eb">Eckdaten</p><p>Einfamilienhaus</p><p>Förderung gewünscht</p></div><div class="tb-box fb"><p class="tb-eb">Für den Fensterbauer</p><p>Maße in mm</p><p>Code auf Seite 2</p></div></div>' +
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
        modell({ view: 'three', dims: ['hm', 'wm', 'eh', 'ew'], labels: messLabels(), cls: 'dims-all', hint: 'Rot: Maueröffnung · Blau: ' + elName() }) +
        '<div class="mess-in"><p class="eyebrow" style="color: var(--ok)">Alle Maße da</p><div class="done-list"><div><small>Öffnung Breite</small><b>' + thousand(d.moW) + ' mm</b></div><div><small>Öffnung Höhe</small><b>' + thousand(d.moH) + ' mm</b></div><div><small>' + esc(artName(w)) + ' Breite</small><b>' + thousand(d.elW) + ' mm</b></div><div><small>' + esc(artName(w)) + ' Höhe</small><b>' + thousand(d.elH) + ' mm</b></div></div>' +
        '<div class="msg ok">' + CHECK + '<span>Danach misst du die Ränder der Öffnung. Von drei Breiten und drei Höhen zählt das kleinste Maß, wie beim Fensterbauer.</span></div></div>' +
        '<div class="qrow"><button type="button" class="chip" data-act="tour-nochmal">Nochmal zeigen</button></div>';
    } else {
      const st = MESS[m.k], k = dimKey(st), labels = messLabels();
      labels[k] = num(m.cur) ? thousand(m.cur) + ' mm' : '?';
      html = kopf('Maß ' + (m.k + 1) + ' von 4 · ' + (st.who === 'mo' ? 'Maueröffnung' : elName()), 'Zollstock anlegen, Zahl eintippen, das Modell zieht die Maßlinie. Hier tippt sich das Maß selbst ein.') +
        modell({ view: 'three', showEl: m.k >= 1, dims: MESS.slice(0, m.k + 1).map(dimKey), active: k, labels: labels, hint: st.who === 'mo' ? 'Rot: Maueröffnung' : 'Blau: ' + elName() }) +
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
  restore();
  S.betrieb = readHash();
  vorschauPruefen(S.betrieb);
  if (S.betrieb) loadLink();
  window.addEventListener('hashchange', () => {
    if (/access_token=|error_description=/.test(location.hash || '')) { const t = tokenAusAdresse(); if (t && kontoBereit()) kontoAusLink(t); else if (t) toast('Die Anmeldung ist hier gerade nicht möglich.'); return; } // Anmeldelink im offenen Tab
    const fuehrung = location.hash === '#fuehrung';
    if (S.tour && !fuehrung) tourEnde(false, true);
    const b = readHash(), was = S.betrieb ? S.betrieb.code : '', now = b ? b.code : '';
    if (was === now) { const neueRunde = !!(b && S.betrieb && (b.runde || 1) !== (S.betrieb.runde || 1)); if (b) S.betrieb = b; if (neueRunde) { loadLink(); S.screen = 'home'; render(true); if (SERVER.daten) linkPruefen(); return; } if (fuehrung) return tourStart(); return render(); } // andere Runde (Nachbesserungs-Link im selben Tab): neu laden
    S.betrieb = b; vorschauPruefen(b); if (b) loadLink(); else { KS = kontoLesen(); loadOwn(); } S.screen = 'home'; render(true);
    if (b && SERVER.daten) linkPruefen();
    if (fuehrung) tourStart();
  });
  const root = $app();
  root.addEventListener('click', (e) => { const el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el || el.disabled) return; const name = el.getAttribute('data-act'); if (name === 'none') return; if (el.tagName !== 'A') e.preventDefault(); tippen(name, el); act(name, el); });
  /* ✕ an der eigenen Farbe: den Fokus im Feld lassen, sonst baut das „change“ beim Verlassen die Seite neu und der Tipp geht ins Leere */
  root.addEventListener('mousedown', (e) => { if (e.target.closest && e.target.closest('.ff-x')) e.preventDefault(); });
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
  if (location.hash === '#fuehrung' && !S.betrieb) tourStart();
  serverStart();
  AI.init().then((ok) => { S.aiOk = ok; if (S.screen === 'fotos') render(); });
  DLP = (async () => { try { DL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { DL = null; } return DL; })();
}
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
function rechtLinks() {
  const C = window.KONFIG || {}, ki = window.FotoKI && window.FotoKI.eingewilligt && window.FotoKI.eingewilligt();
  return '<div class="foot-links recht"><a class="link widerruf" href="/widerruf/" target="_blank" rel="noopener">Vertrag widerrufen</a><a class="link" href="/agb/" target="_blank" rel="noopener">AGB</a><a class="link" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a><a class="link" href="/cookies/" target="_blank" rel="noopener">Cookies</a><a class="link" href="' + esc(C.impressum || '/impressum/') + '" target="_blank" rel="noopener">Impressum</a>' + (ki ? '<button type="button" class="link" data-act="ki-widerrufen">KI-Einwilligung widerrufen</button>' : '') + '</div>';
}
const SEND_IC = '<div class="okmark-l" data-lottie="senden"><span class="lottie-still"><svg class="okmark send" viewBox="0 0 64 64" width="78" height="78" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="var(--accent-soft)"></circle><path d="M17 31l29-12-9 28-7-10z" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linejoin="round"></path><path d="M30 37l16-18" fill="none" stroke="var(--accent)" stroke-width="3.4" stroke-linecap="round"></path></svg></span></div>';
/* Versand im Kundenlink: der Code geht per WhatsApp oder E-Mail an den Betrieb */
const gesendetOrig = SCREENS.gesendet;
SCREENS.gesendet = () => {
  if (!PILOT) return gesendetOrig();
  const bn = S.betrieb && S.betrieb.name ? S.betrieb.name : '', dat = bn || 'deinem Fensterbauer', nom = bn || 'dein Fensterbauer';
  const n = S.windows.reduce((a, x) => a + (num(x.anzahl) || 1), 0), code = curCode();
  const text = 'Hallo' + (bn ? ' ' + bn : '') + ', hier ist mein Fenster-Aufmaß aus eeziframes (' + n + ' Fenster). Bitte bei eeziframes unter „Code vom Kunden einfügen“ einsetzen:\n' + code;
  const wa = 'https://wa.me/?text=' + encodeURIComponent(text), mail = 'mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(text);
  const html = '<div class="center" style="padding-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px">' + SEND_IC +
    '<h1 style="margin: 4px 0 0">Jetzt abschicken.</h1>' +
    '<p style="margin: 0">Dein Aufmaß ist fertig. Schick ' + esc(dat) + ' jetzt den Aufmaß-Code, am einfachsten per WhatsApp. Erst damit hat ' + esc(nom) + ' deine Maße und Wünsche.</p></div>' +
    '<div class="card send-card" style="gap: 12px"><p class="eyebrow">Senden</p><div class="pill-row send-row"><a class="btn primary" href="' + wa + '" target="_blank" rel="noopener">Per WhatsApp senden</a><a class="btn ghost" href="' + mail + '">Per E-Mail senden</a></div>' +
    '<textarea class="copybox" id="code-box" readonly rows="3" aria-label="Aufmaß-Code">' + esc(code) + '</textarea><div class="pill-row"><button type="button" class="pill" data-act="copyblatt">Code kopieren</button></div>' +
    '<p class="sub">Pilotphase: eeziframes überträgt dein Aufmaß noch nicht von selbst. Der Code enthält alle Maße, deine Wünsche und die Auswertung der Fotos, die Fotos selbst nicht; die stehen im Aufmaßblatt.</p></div>' +
    '<div class="card" style="gap: 12px"><p class="eyebrow">So geht\'s weiter</p><div class="steps mini"><div class="step"><span class="n">1</span><div><b>Angebot</b><p>von ' + esc(bn || 'deinem Fensterbauer') + '</p></div></div><div class="step"><span class="n">2</span><div><b>Feinaufmaß</b><p>ein Termin vor Ort</p></div></div><div class="step"><span class="n">3</span><div><b>Fertigung und Einbau</b><p>Termin nach Absprache</p></div></div></div></div>' +
    dateiCard();
  return { html: html, cls: 'tight', bar: { label: 'Fertig', act: 'go', v: 'home' } };
};
/* ---------- Server (Stufe 2): /api/status sagt, was eingerichtet ist ----------
   daten:   Aufmaße gehen direkt an den Betrieb, ohne Code-Umweg; der Link wird beim Öffnen geprüft
   zahlung: das Aufmaßblatt wird über Stripe bezahlt */
async function serverStart() {
  try { const r = await fetch('/api/status', { headers: { accept: 'application/json' }, cache: 'no-store' }); const j = r.ok ? await r.json() : null; if (j && j.ok) { SERVER.daten = !!j.daten; SERVER.konten = !!j.konten; SERVER.zahlung = !!j.zahlung; SERVER.attrappe = !!j.attrappe; SERVER.testmodus = !!j.testmodus; SERVER.preise = j.preise || null; if (window.Abrechnung && window.Abrechnung.setEinfuehrung) window.Abrechnung.setEinfuehrung(j.einfuehrung || null); SERVER.zahlarten = Array.isArray(j.zahlarten) ? j.zahlarten : null; SERVER.recht = j.recht || null; } } catch (e) { /* ohne Server weiter */ }
  PILOT = !SERVER.daten;
  setTimeout(() => { fotosHochladen(); fotosLokalAufraeumen(); }, 4000); // liegengebliebene Fotos nachschicken, Überholtes auf dem Gerät wegräumen
  if (SERVER.daten) document.querySelectorAll('.fx-pilot').forEach((e) => e.remove());
  const q = new URLSearchParams(location.search), bezahlt = q.get('bezahlt'), t = LINK_TOKEN; LINK_TOKEN = null;
  /* Anmeldung (Link aus der E-Mail oder gemerkte Anmeldung), auch nach einer Zahlung */
  const konto = async (gerendert) => {
    if (kontoBereit()) { if (t) return kontoAusLink(t); if (KS) return kontoStart(); }
    else if (t) toast('Die Anmeldung ist hier gerade nicht möglich. Bitte versuche es gleich noch einmal.');
    if (!gerendert) render();
  };
  if (bezahlt) { history.replaceState(null, '', location.pathname + location.hash); if (!S.betrieb) { await kaufPruefen(bezahlt); return konto(true); } }
  if (SERVER.zahlung && !S.betrieb && S.kauf && S.kauf.wartet && !S.kauf.paid) { await kaufPruefen(S.kauf.wartet, true); return konto(true); }
  if (SERVER.daten && S.betrieb) linkPruefen();
  return konto(false);
}
/* Im Kundenlink: Stand beim Betrieb nachsehen (Name, Runde, abgelaufen) und melden, dass der Link geöffnet wurde. Nur „gibt es
   nicht“ (404) schließt den Link; ein Serverfehler oder die Bremse lassen weiterarbeiten. In der Vorschau des Betriebs: nur lesen */
async function linkPruefen() {
  if (!S.betrieb) return;
  const code = S.betrieb.code, sync = S.sync;
  clearTimeout(sync.pruefTimer);
  try {
    const t1 = Date.now(), res = await fetch('/api/link/' + encodeURIComponent(code), { headers: { accept: 'application/json' } });
    const r = await res.json().catch(() => null);
    if (r) uhrStellen(r.jetzt, t1, Date.now());
    if (!S.betrieb || S.betrieb.code !== code) return;
    if (res.status === 404) { S.linkStatus = 'fehlt'; if (!S.sent) { S.linkZu = 'fehlt'; S.linkZuText = (r && r.fehler) || 'Diesen Link gibt es nicht (mehr). Bitte melde dich bei deinem Fensterbauer.'; } return render(); }
    if (!r || !r.ok) { if (!vorschau()) entwurfLaden(); return; }
    S.betrieb.name = r.betrieb || S.betrieb.name; S.betrieb.kunde = r.kunde || S.betrieb.kunde; S.linkStatus = r.status; if (r.expires) S.betrieb.expires = r.expires;
    if (r.zu === 'eingegangen' && !S.sent) schonEingegangen(r.runde, S.sync.offen || weichtAb(S.nb && S.nb.vorher), r.seit);
    if (r.zu === 'abgelaufen' || r.zu === 'deaktiviert') { S.linkZu = r.zu; S.linkZuText = r.zuText || ''; }
    /* geöffnet melden: beim ersten Öffnen beginnen die 60 Tage, die neue Frist kommt zurück */
    if (!S.sent && !S.linkZu) fortschritt('geoeffnet');
    render();
    entwurfLaden();
  } catch (e) {
    /* kein Netz: gleich noch einmal (dazu zurück im Tab oder wieder online), bis der Link einmal geprüft ist */
    if (S.sync === sync && !sync.geladen) { sync.nochmal = Math.min(60000, (sync.nochmal || 2500) * 2); sync.pruefTimer = setTimeout(() => { if (S.sync === sync && !sync.geladen) linkPruefen(); }, sync.nochmal); }
  }
}
function fortschritt(stufe, k) {
  if (!SERVER.daten || !S.betrieb || vorschau()) return;
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
    if (S.linkZu && S.linkZu !== 'eingegangen') { go('home'); return toast(S.linkZuText || 'Dieser Link ist nicht mehr aktiv.'); }
    render(); return toast('Dein Aufmaß wurde mit einem anderen Gerät abgeglichen. Bitte kurz prüfen und noch einmal senden.');
  }
  if (!S.betrieb || S.betrieb.code !== code0 || S.sent) return;
  const o = JSON.parse(JSON.stringify(unpackProject(packProject(S.windows, S.proj, S.betrieb))));
  o.wm = S.windows.map((w) => ({ wid: w.wid || '', t0: Number(w.t0) || 0, aend: Number(w.aend) || 0, ts: Number(w.ts) || 0 })); o.stand = S.stand || 0; o.projTs = S.projTs || 0;
  try {
    const r = await fetch('/api/aufmass', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(o) }).then((x) => x.json());
    if (!S.betrieb || S.betrieb.code !== code0) return;
    if (r && !r.ok && r.zu === 'eingegangen') { schonEingegangen(r.runde, true, r.seit); go('home'); return toast(r.fehler); } // schon da (anderes Gerät)
    if (r && !r.ok && r.abgleichen) { S.sync.offen = true; await entwurfSenden(); if (!S.betrieb || S.betrieb.code !== code0) return; render(); return toast(r.fehler); } // anderes Gerät war schneller: zusammenführen, prüfen lassen
    if (!r || !r.ok) return toast(r && r.fehler ? r.fehler : 'Senden hat nicht geklappt. Bitte gleich noch einmal.');
    clearTimeout(S.sync.timer); S.sync.offen = false;
    S.sent = { when: Date.now(), code: packProject(S.windows, S.proj, S.betrieb), runde: S.nb && S.nb.runde ? S.nb.runde : 1, uebertragen: true }; S.nb = null; S._feier = 'gesendet'; S.toast = ''; clearTimeout(toastTimer); persist(); go('gesendet');
  } catch (e) { toast('Keine Verbindung. Bitte gleich noch einmal.'); }
}
boot();


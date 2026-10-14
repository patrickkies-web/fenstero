'use strict';
/* Fensterino · Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben
   Blatt.pdf(e)      -> Blob (null, wenn jsPDF fehlt)
   Blatt.schrift()   -> Promise; lädt die eingebettete Schrift (blatt-schrift.js) einmal nach, danach sofort

   e = {
     variante: 'kunde' | 'fensterbauer' | 'betrieb',
        kunde:        das Blatt des Hauseigentümers für seine Unterlagen (Du), mit Seite für den Fensterbauer am Ende
        fensterbauer: dasselbe Aufmaß, so wie es der Hauseigentümer einem Betrieb schickt (Sie), mit Seite für den Fensterbauer
        betrieb:      aus dem Betriebsbereich, in den Farben des Betriebs, mit Bestellmaß-Vorschlag, ohne Werbung
     fenster: [Fenster wie in der App], projekt: { name, ort, tel, mail, erreich, gebaeude, baujahr, total, zeit, budget, foerd, notiz },
     kunde: { name, kontakt, adresse } (betrieb), betrieb: { name, col, abzug: { seite, oben }, nr, eingegangen } (betrieb),
     code, portalUrl, portalKurz, appKurz, qr: window.qrcode (für die Seite an den Fensterbauer),
     h: { derive(w), lab(gruppe, key), col(key) -> [Name, Code, Hex], orn(key), th(mm), num(v) }
   } */
window.Blatt = (() => {
  const W = 210, H = 297, M = 14, CW = W - 2 * M, BOTTOM = H - 16;
  const INK = '#1d1d1f', GREY = '#6e6e73', LINE = '#d9d9de', PAPER = '#f5f5f7', ACC = '#0071e3', MO = '#d4502b', EL = '#0071e3', OK = '#1f7a3d', WARN = '#a85a00', GLASS = '#d6e6f4', WALL = '#efece6', LAIB = '#ddd7cc', LAIB2 = '#cfc8bb';
  const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); const n = m ? parseInt(m[1], 16) : 0; return [n >> 16, (n >> 8) & 255, n & 255]; };
  const t = (s) => (Array.isArray(s) ? s.map(t) : String(s == null ? '' : s).replace(/[  ]/g, ' '));
  const TYP = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp' };
  const ERREICH = { vm: 'vormittags', nm: 'nachmittags', ab: 'abends' };
  const BASIS = document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[^/]*$/, '') : '/assets/';
  let ladePromise = null;
  function schrift() {
    if (window.BlattSchrift) return Promise.resolve(true);
    if (ladePromise) return ladePromise;
    ladePromise = new Promise((res) => {
      const s = document.createElement('script'); s.src = BASIS + 'blatt-schrift.js'; s.async = true;
      s.onload = () => res(!!window.BlattSchrift); s.onerror = () => { ladePromise = null; res(false); };
      document.head.appendChild(s);
    });
    return ladePromise;
  }

  function pdf(e) {
    const J = window.jspdf && window.jspdf.jsPDF; if (!J) return null;
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const h = e.h, V = e.variante || 'kunde', wins = e.fenster || [], pr = e.projekt || {}, kd = e.kunde || {}, bt = e.betrieb || {}, ab = bt.abzug || { seite: 15, oben: 15 };
    const BRAND = V === 'betrieb' ? (bt.col || ACC) : '#000000';
    const sie = V !== 'kunde';
    /* Schrift: Maven Pro, wenn geladen, sonst Helvetica */
    const F = window.BlattSchrift ? (() => {
      try {
        doc.addFileToVFS('MavenPro-Black.ttf', window.BlattSchrift.black); doc.addFont('MavenPro-Black.ttf', 'MavenBlack', 'normal');
        doc.addFileToVFS('MavenPro-Bold.ttf', window.BlattSchrift.bold); doc.addFont('MavenPro-Bold.ttf', 'MavenBold', 'normal');
        doc.addFileToVFS('MavenPro-Medium.ttf', window.BlattSchrift.medium); doc.addFont('MavenPro-Medium.ttf', 'MavenMedium', 'normal');
        return { black: ['MavenBlack', 'normal'], bold: ['MavenBold', 'normal'], normal: ['MavenMedium', 'normal'], mono: ['courier', 'normal'] };
      } catch (err) { return null; }
    })() : null;
    const FONTS = F || { black: ['helvetica', 'bold'], bold: ['helvetica', 'bold'], normal: ['helvetica', 'normal'], mono: ['courier', 'normal'] };
    const font = (k, size, color) => { const f = FONTS[k] || FONTS.normal; doc.setFont(f[0], f[1]); if (size) doc.setFontSize(size); if (color) doc.setTextColor.apply(doc, rgb(color)); };
    const fill = (c) => doc.setFillColor.apply(doc, rgb(c)), stroke = (c) => doc.setDrawColor.apply(doc, rgb(c));
    const tw = (s) => doc.getTextWidth(t(s));
    const wrap = (s, w) => doc.splitTextToSize(t(s), w);
    const txt = (s, x, y, o) => doc.text(t(s), x, y, o);
    const alpha = (a) => { try { doc.setGState(new doc.GState({ opacity: a })); } catch (err) { /* ohne Transparenz */ } };
    const rr = (x, y, w, h2, r, mode) => doc.roundedRect(x, y, w, h2, r, r, mode || 'F');
    const dash = (on) => { try { doc.setLineDashPattern(on ? [1.1, 0.9] : [], 0); } catch (err) { /* ok */ } };
    const num = h.num, th = h.th;
    const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), nF = wins.reduce((a, x) => a + (num(x.fotos) || 0), 0);
    const komplett = wins.length > 0 && wins.every((x) => { const d = h.derive(x); return d.moW && d.moH && d.elW && d.elH; });
    const heute = (() => { try { return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (err) { return ''; } })();
    const titelName = V === 'betrieb' ? (kd.name || 'Kunde') : (pr.name || '');
    const laufTitel = (V === 'betrieb' ? 'Aufmaß · ' : 'Aufmaßblatt · ') + (titelName || (V === 'kunde' ? 'Dein Aufmaß' : 'Fenster-Aufmaß'));
    const initial = (name) => (String(name || 'F').replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F');

    /* ---------- Seitenrahmen ---------- */
    let y = 0;
    /* Das Zeichen: Kachel mit Fenster (auf dunklem Band weiße Kachel, sonst schwarze) */
    function marke(x, y0, s, hell) {
      const k = hell ? '#ffffff' : '#000000', f = hell ? '#000000' : '#ffffff';
      fill(k); rr(x, y0, s, s, s * 0.24);
      const px = x + s * 0.2, py = y0 + s * 0.17, pw = s * 0.6, ph = s * 0.58;
      fill(f); rr(px, py, pw, ph, s * 0.03);
      fill(k); const g = s * 0.065, cw = (pw - 3 * g) / 2, ch = (ph - 3 * g) / 2;
      doc.rect(px + g, py + g, cw, ch, 'F'); doc.rect(px + 2 * g + cw, py + g, cw, ch, 'F'); doc.rect(px + g, py + 2 * g + ch, cw, ch, 'F'); doc.rect(px + 2 * g + cw, py + 2 * g + ch, cw, ch, 'F');
      fill(f); doc.rect(x + s * 0.15, y0 + s * 0.8, s * 0.7, s * 0.045, 'F');
    }
    const kopfband = (gross) => {
      const bh = gross ? 24 : 9;
      fill(BRAND); doc.rect(0, 0, W, bh, 'F');
      if (V === 'betrieb') {
        const r = gross ? 6.5 : 2.8, cx = M + r, cy = bh / 2;
        fill('#ffffff'); doc.circle(cx, cy, r, 'F');
        font('black', gross ? 13 : 6, BRAND); txt(initial(bt.name), cx, cy + (gross ? 4.6 : 2.1), { align: 'center' });
        font('bold', gross ? 15 : 8, '#ffffff'); txt(bt.name || 'Betrieb', cx + r + (gross ? 5 : 2.5), cy + (gross ? 5.2 : 2.8));
        font('normal', gross ? 8 : 6.5, '#ffffff'); alpha(0.8); txt(gross ? 'Aufmaß · erfasst vom Kunden mit Fensterino' : laufTitel, W - M, cy + (gross ? 1 : 2.3), { align: 'right' }); alpha(1);
        if (gross) { font('normal', 8, '#ffffff'); alpha(0.8); txt([bt.nr, bt.eingegangen ? 'eingegangen ' + bt.eingegangen : heute].filter(Boolean).join(' · '), W - M, cy + 6, { align: 'right' }); alpha(1); }
      } else {
        marke(M, gross ? 5 : 1.6, gross ? 14 : 5.8, true);
        font('black', gross ? 16 : 8, '#ffffff'); txt('Fensterino', M + (gross ? 19 : 7.8), gross ? 17.2 : 6.6);
        font('normal', gross ? 8 : 6.5, '#ffffff'); alpha(0.78);
        if (gross) { txt('AUFMASSBLATT', W - M, 10, { align: 'right', charSpace: 0.6 }); txt(heute, W - M, 15.5, { align: 'right' }); }
        else txt(laufTitel, W - M, 6.3, { align: 'right' });
        alpha(1);
      }
      doc.setTextColor.apply(doc, rgb(INK));
      return bh;
    };
    const neueSeite = () => { doc.addPage(); y = kopfband(false) + 10; };
    const platz = (h2) => { if (y + h2 > BOTTOM) neueSeite(); };
    const fuss = () => {
      const n = doc.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        stroke(LINE); doc.setLineWidth(0.25); doc.line(M, H - 11.5, W - M, H - 11.5);
        font('normal', 7.2, GREY);
        txt(V === 'betrieb' ? 'Erstellt mit Fensterino für ' + (bt.name || 'Ihren Betrieb') + ' · ' + (e.portalKurz || 'fensterino.com') + ' · Vor der Fertigung Feinaufmaß vor Ort.' : 'Erstellt mit Fensterino · ' + (e.portalKurz || 'fensterino.com') + ' · Vor der Fertigung Feinaufmaß vor Ort.', M, H - 7.2);
        txt('Seite ' + i + ' von ' + n, W - M, H - 7.2, { align: 'right' });
      }
    };

    /* ---------- Bausteine ---------- */
    const eyebrow = (s, x, y0, color) => { font('bold', 7, color || ACC); txt(String(s).toUpperCase(), x, y0, { charSpace: 0.5 }); };
    const pille = (s, cx, cy, color, size) => { font('bold', size || 6.6); const w = tw(s) + 3.4, hh = (size || 6.6) * 0.62; fill(color); rr(cx - w / 2, cy - hh / 2, w, hh, hh / 2); doc.setTextColor(255, 255, 255); txt(s, cx, cy + hh * 0.33, { align: 'center' }); return w; };
    const chip = (s, x, y0, bg, fg, size) => { font('bold', size || 7.5); const w = tw(s) + 5, hh = (size || 7.5) * 0.8; fill(bg); rr(x, y0, w, hh, hh / 2); doc.setTextColor.apply(doc, rgb(fg)); txt(s, x + 2.5, y0 + hh * 0.7); return w; };
    const swatch = (hex, x, cy, r) => { fill(hex); stroke(LINE); doc.setLineWidth(0.25); doc.circle(x, cy, r || 1.6, 'FD'); };
    /* Maßlinie mit Endstrichen und Beschriftung in einer Pille */
    function mass(x1, y1, x2, y2, label, color, gestrichelt, pillOffset) {
      stroke(color); doc.setLineWidth(0.35); dash(!!gestrichelt);
      doc.line(x1, y1, x2, y2); dash(false);
      const horiz = Math.abs(y2 - y1) < 0.01, tick = 1.4;
      if (horiz) { doc.line(x1, y1 - tick, x1, y1 + tick); doc.line(x2, y2 - tick, x2, y2 + tick); }
      else { doc.line(x1 - tick, y1, x1 + tick, y1); doc.line(x2 - tick, y2, x2 + tick, y2); }
      if (label) pille(label, (x1 + x2) / 2 + (pillOffset ? pillOffset[0] : 0), (y1 + y2) / 2 + (pillOffset ? pillOffset[1] : 0), color, 6.4);
    }
    /* Die Fensterzeichnung: Wand, Maueröffnung mit Laibung, Element mit Flügeln, Symbole, Sprossen, Griffe, Fensterbank; dazu die Maße */
    function zeichnung(w, bx, by, bw, bh, alle) {
      const d = h.derive(w), mo = w.mo || {};
      const moW = d.moW || (d.elW ? d.elW + 80 : 1200), moH = d.moH || (d.elH ? d.elH + 70 : 1400);
      const elW = d.elW || moW - 80, elH = d.elH || moH - 70, bru = num(w.bru);
      const randL = alle ? (bru ? 27 : 17) : 16, randR = alle ? 27 : 17, randO = alle ? 16 : 13, randU = alle ? (bru ? 25 : 13) : 14;
      const innenW = bw - randL - randR, innenH = bh - randO - randU;
      const s = Math.min(innenW / moW, innenH / moH);
      const ow = moW * s, oh = moH * s, ox = bx + randL + (innenW - ow) / 2, oy = by + randO + (innenH - oh) / 2;
      /* Wand um die Öffnung, dann die Öffnung mit Laibung */
      const wr = Math.min(10, ow * 0.1, oh * 0.1);
      fill(WALL); doc.rect(ox - wr, oy - wr, ow + 2 * wr, oh + 2 * wr, 'F');
      fill(LAIB); stroke(INK); doc.setLineWidth(0.4); doc.rect(ox, oy, ow, oh, 'FD');
      const lt = Math.max(1, Math.min(ow, oh) * 0.045); fill(LAIB2); doc.rect(ox, oy, ow, lt, 'F'); doc.rect(ox, oy, lt, oh, 'F');
      /* Element: mittig, unten auf der Fensterbank */
      const ew = Math.min(elW, moW * 0.985) * s, eh = Math.min(elH, moH * 0.985) * s, ex = ox + (ow - ew) / 2, ey = oy + oh - eh - lt * 0.5;
      const fc = h.col(w.fa)[2], f = Math.max(1.1, ew * 0.055);
      fill(fc); stroke(INK); doc.setLineWidth(0.45); doc.rect(ex, ey, ew, eh, 'FD');
      let ix = ex + f, iy = ey + f; const iw = ew - 2 * f; let ih = eh - 2 * f;
      const da = w.richtung === 'aussen';
      const glas = (gx, gy, gw, gh) => { fill(GLASS); doc.rect(gx, gy, gw, gh, 'F'); alpha(0.55); fill('#ffffff'); doc.triangle(gx, gy + gh, gx, gy + gh * 0.4, gx + gw * 0.6, gy, 'F'); alpha(1); stroke(INK); doc.setLineWidth(0.25); doc.rect(gx, gy, gw, gh, 'S'); };
      const symbol = (gx, gy, gw, gh, typ, din) => {
        stroke(INK); doc.setLineWidth(0.3); alpha(0.5); dash(da);
        if (typ === 'D' || typ === 'DK') { if (din === 'L') { doc.line(gx, gy, gx + gw, gy + gh / 2); doc.line(gx, gy + gh, gx + gw, gy + gh / 2); } else { doc.line(gx + gw, gy, gx, gy + gh / 2); doc.line(gx + gw, gy + gh, gx, gy + gh / 2); } }
        if (typ === 'K' || typ === 'DK') { doc.line(gx, gy + gh, gx + gw / 2, gy); doc.line(gx + gw, gy + gh, gx + gw / 2, gy); }
        dash(false); alpha(1);
      };
      if (w.ol) { const oh2 = ih * 0.26; glas(ix, iy, iw, oh2); symbol(ix, iy, iw, oh2, w.olT || 'K', 'L'); iy += oh2 + f * 0.7; ih -= oh2 + f * 0.7; }
      const S = w.sashes && w.sashes.length ? w.sashes : [{ t: 'DK', din: 'L' }], n = S.length, gap = w.teilung === '2s' ? f * 0.3 : f * 0.85, sw = (iw - gap * (n - 1)) / n;
      S.forEach((sa, i) => {
        const sx = ix + i * (sw + gap), g = sa.t === 'F' ? 0 : Math.max(0.9, sw * 0.085);
        if (sa.t !== 'F') { fill(fc); stroke(INK); doc.setLineWidth(0.3); doc.rect(sx, iy, sw, ih, 'FD'); }
        const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
        glas(gx, gy, gw, gh);
        (w.bars || []).filter((b) => b.s === i).forEach((b) => { stroke(fc === '#f1f0ea' ? '#b9b4a8' : fc); doc.setLineWidth(Math.max(0.5, gw * 0.035)); if (b.d === 'v') doc.line(gx + gw * b.p, gy, gx + gw * b.p, gy + gh); else doc.line(gx, gy + gh * b.p, gx + gw, gy + gh * b.p); });
        symbol(gx, gy, gw, gh, sa.t, sa.din);
        if (sa.t === 'D' || sa.t === 'DK') { const hx = sa.din === 'L' ? sx + sw - g * 0.5 : sx + g * 0.5, hl = Math.min(ih * 0.16, 9), hw = Math.max(0.8, g * 0.7); fill('#4a4a4f'); rr(hx - hw / 2, iy + ih / 2 - hl / 2, hw, hl, hw / 2); }
        if (sa.t === 'K') { const hl = Math.min(sw * 0.16, 9), hw = Math.max(0.8, g * 0.7); fill('#4a4a4f'); rr(sx + sw / 2 - hl / 2, iy + g * 0.2, hl, hw, hw / 2); }
      });
      /* Fensterbank */
      const fb = h.lab('fba', w.fba); fill(fb === 'Naturstein' ? '#cfc8bb' : '#c9ccd0'); stroke(INK); doc.setLineWidth(0.3); doc.rect(ox - ow * 0.025, oy + oh - lt * 0.5, ow * 1.05, lt * 0.5 + 1, 'FD');
      if (!alle) {
        /* Vier Maße wie im Startbild der App */
        if (d.moH) mass(ox - 7, oy, ox - 7, oy + oh, th(d.moH) + ' mm', MO);
        if (d.moW) mass(ox, oy + oh + 7.5, ox + ow, oy + oh + 7.5, th(d.moW) + ' mm', MO);
        if (d.elH) mass(ex + ew + 7, ey, ex + ew + 7, ey + eh, th(d.elH) + ' mm', EL);
        if (d.elW) mass(ex, ey - 6.5, ex + ew, ey - 6.5, th(d.elW) + ' mm', EL);
        return;
      }
      /* Alle acht Handmaße: Breiten oben, Mitte, unten; Höhen links, Mitte, rechts; Element Breite und Höhe */
      const L = (k) => (num(mo[k]) ? th(mo[k]) : '–');
      mass(ox, oy - 5.5, ox + ow, oy - 5.5, 'oben ' + L('wt'), MO);
      mass(ox, oy + oh + 6.5, ox + ow, oy + oh + 6.5, 'unten ' + L('wb'), MO);
      mass(ox + lt, oy + oh / 2, ox + ow - lt, oy + oh / 2, 'Mitte ' + L('wm'), MO, true, [0, 4.5]);
      mass(ox - 6.5, oy, ox - 6.5, oy + oh, 'links ' + L('hl'), MO, false, [0, -oh * 0.22]);
      mass(ox + ow + 6.5, oy, ox + ow + 6.5, oy + oh, 'rechts ' + L('hr'), MO, false, [0, -oh * 0.22]);
      mass(ox + ow / 2, oy + lt, ox + ow / 2, oy + oh - lt, 'Mitte ' + L('hm'), MO, true, [0, -oh * 0.24]);
      if (d.elW) mass(ex, oy - 12.5, ex + ew, oy - 12.5, 'Element ' + th(d.elW), EL);
      if (d.elH) mass(ox + ow + 16, ey, ox + ow + 16, ey + eh, 'Element ' + th(d.elH), EL, false, [0, eh * 0.22]);
      if (bru) {
        const fy = Math.min(oy + oh + 21, oy + oh + bru * s), flx = ox - 22, frx = ox + ow + 10;
        stroke(INK); doc.setLineWidth(0.6); doc.line(flx, fy, frx, fy);
        stroke(GREY); doc.setLineWidth(0.3); for (let hx = flx + 2; hx < frx; hx += 4) doc.line(hx, fy, hx - 2, fy + 2);
        mass(ox - 16, oy + oh, ox - 16, fy, 'Brüstung ' + th(bru), INK);
        font('normal', 6, GREY); txt('Fußboden', frx - 1, fy + 4.4, { align: 'right' });
      }
    }
    /* Kleines Fenster für Tabellen */
    function mini(w, x, y0, s) {
      const d = h.derive(w), a = (d.elW || 1000) / (d.elH || 1200), bw = a >= 1 ? s : s * a, bh = a >= 1 ? s / a : s;
      ansicht(w, x + (s - bw) / 2, y0 + (s - bh) / 2, bw, bh);
    }
    /* Fenster in gegebener Größe: Rahmen, Flügel, Oberlicht */
    function ansicht(w, bx, by, bw, bh) {
      const fc = h.col(w.fa)[2];
      fill(fc); stroke(INK); doc.setLineWidth(0.3); doc.rect(bx, by, bw, bh, 'FD');
      const f = Math.max(0.5, bw * 0.08); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
      if (w.ol) { const oh = ih * 0.26; fill(GLASS); doc.rect(ix, iy, iw, oh, 'FD'); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
      const S = w.sashes && w.sashes.length ? w.sashes : [{ t: 'DK' }], n = S.length, gap = w.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
      S.forEach((sa, i) => { fill(GLASS); doc.setLineWidth(0.2); doc.rect(ix + i * (sw + gap), iy, sw, ih, 'FD'); });
    }
    const teilungText = (w) => { const n = (w.sashes || []).length || 1; return n + ' Flügel' + (w.teilung === '2s' ? ', Stulp' : w.teilung === '2p' ? ', mit Pfosten' : w.teilung === '3' ? ', Mitte fest' : '') + (w.ol ? ', ' + (h.lab('olT', w.olT) || 'Oberlicht') : ''); };
    const oeffnungText = (w) => (w.sashes || []).map((x) => TYP[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ') + (w.richtung === 'aussen' ? ' · nach außen' : '');
    const bestell = (w) => { const d = h.derive(w); return d.moW && d.moH ? th(d.moW - 2 * ab.seite) + ' × ' + th(d.moH - ab.oben) + ' mm' : '–'; };
    const farbe = (k) => h.col(k);
    /* Karte mit Titel und Zeilen [Begriff, Wert, { swatch, bold, col }]; opt.lw = Breite der Begriffsspalte, opt.spalten = 2 für zwei Spalten */
    function zeilenH(rows, w, opt) {
      const lw = opt.lw || 26; let hh = 0;
      rows.forEach((r) => { font('normal', opt.fs || 8); const v = wrap(r[1], w - lw - 4 - (r[2] && r[2].swatch ? 5.5 : 0)); font('normal', (opt.fs || 8) - 0.6); const k = wrap(r[0], lw - 2); hh += Math.max(v.length, k.length, 1) * ((opt.fs || 8) * 0.46) + 1.5; });
      return hh;
    }
    function karteH(rows, w, titel, opt) {
      opt = opt || {};
      if (opt.spalten === 2) { const m = Math.ceil(rows.length / 2), cw2 = (w - 8) / 2 - 2; return (titel ? 9 : 4) + Math.max(zeilenH(rows.slice(0, m), cw2, opt), zeilenH(rows.slice(m), cw2, opt)) + 3; }
      return (titel ? 9 : 4) + zeilenH(rows, w - 8, opt) + 3;
    }
    function zeilen(rows, x, y0, w, opt) {
      const lw = opt.lw || 26, fs = opt.fs || 8; let yy = y0;
      rows.forEach((r) => {
        font('normal', fs - 0.6, GREY); const kl = wrap(r[0], lw - 2); txt(kl, x, yy + 3);
        let vx = x + lw; if (r[2] && r[2].swatch) { swatch(r[2].swatch, vx + 1.8, yy + 2, 1.7); vx += 5.5; }
        font(r[2] && r[2].bold ? 'bold' : 'normal', fs, r[2] && r[2].col ? r[2].col : INK); const v = wrap(r[1], w - (vx - x)); txt(v, vx, yy + 3);
        yy += Math.max(v.length, kl.length, 1) * (fs * 0.46) + 1.5;
      });
      return yy - y0;
    }
    function karte(x, y0, w, titel, rows, opt) {
      opt = opt || {};
      const hh = karteH(rows, w, titel, opt);
      fill(opt.bg || '#ffffff'); stroke(opt.rand || LINE); doc.setLineWidth(0.3); rr(x, y0, w, hh, 3, 'FD');
      let yy = y0 + 5.2;
      if (titel) { eyebrow(titel, x + 4, yy, opt.titelCol || GREY); yy += 5.2; }
      if (opt.spalten === 2) { const m = Math.ceil(rows.length / 2), cw2 = (w - 8) / 2 - 2; zeilen(rows.slice(0, m), x + 4, yy, cw2, opt); zeilen(rows.slice(m), x + 4 + cw2 + 4, yy, cw2, opt); }
      else zeilen(rows, x + 4, yy, w - 8, opt);
      return hh;
    }
    function sektion(titel, sub) { platz(16); font('black', 16, INK); txt(titel, M, y); if (sub) { font('normal', 8.5, GREY); txt(sub, W - M, y, { align: 'right' }); } stroke(INK); doc.setLineWidth(0.5); doc.line(M, y + 3, W - M, y + 3); y += 10; }
    /* Kachel mit Symbol, Titel und Text */
    const kachel = (x, y0, w, hh, titel, text, ico, col) => {
      fill('#ffffff'); stroke(LINE); doc.setLineWidth(0.3); rr(x, y0, w, hh, 3, 'FD');
      fill(col); alpha(0.12); doc.circle(x + 9, y0 + 9, 5.5, 'F'); alpha(1);
      ico(x + 9, y0 + 9);
      font('bold', 9.5, INK); const tl = wrap(titel, w - 20); txt(tl, x + 17, y0 + 8.4);
      font('normal', 7.4, GREY); txt(wrap(text, w - 21), x + 17, y0 + 13.2 + (tl.length - 1) * 4, { lineHeightFactor: 1.25 });
    };
    const icoRuler = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.6); rr(ix - 4, iy - 1.6, 8, 3.2, 0.6, 'S'); for (let k = -2.4; k <= 2.4; k += 1.6) doc.line(ix + k, iy - 1.6, ix + k, iy - 0.4); };
    const icoCam = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.6); rr(ix - 4, iy - 2.4, 8, 5.4, 1, 'S'); doc.circle(ix, iy + 0.4, 1.5, 'S'); doc.line(ix - 1.5, iy - 2.4, ix - 0.8, iy - 3.4); doc.line(ix + 1.5, iy - 2.4, ix + 0.8, iy - 3.4); };
    const icoWish = () => (ix, iy) => { swatch('#383e42', ix - 2.6, iy - 0.8, 1.5); swatch('#f1f0ea', ix + 0.4, iy - 1.6, 1.5); swatch(GLASS, ix + 1.6, iy + 1.6, 1.5); };
    const icoBest = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.6); doc.rect(ix - 3.6, iy - 3, 7.2, 6, 'S'); dash(true); doc.rect(ix - 2.4, iy - 1.8, 4.8, 3.6, 'S'); dash(false); };
    const icoLink = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.7); doc.lines([[3.2, -3.2], [4, 4], [-3.2, 3.2]], ix - 5.2, iy + 1.2, [1, 1], 'S', false); doc.line(ix - 1, iy - 1, ix + 2.2, iy + 2.2); };
    const icoCube = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.6); doc.lines([[3.6, -2], [3.6, 2], [0, 4.2], [-3.6, 2], [-3.6, -2], [0, -4.2]], ix - 3.6, iy - 2.1, [1, 1], 'S', true); doc.line(ix - 3.6, iy - 2.1, ix, iy); doc.line(ix + 3.6, iy - 2.1, ix, iy); doc.line(ix, iy, ix, iy + 4.2); };
    const icoLoop = (col) => (ix, iy) => { stroke(col); doc.setLineWidth(0.7); doc.circle(ix, iy, 3.3, 'S'); fill('#ffffff'); doc.rect(ix - 4, iy - 4.2, 3.2, 3.2, 'F'); fill(col); doc.triangle(ix - 1.4, iy - 3.4, ix - 1.4, iy - 1.2, ix + 0.6, iy - 2.3, 'F'); };
    const schritte = (x, y0, w, liste) => liste.forEach((st, i) => { const sx = x + i * (w / liste.length); fill(INK); doc.circle(sx + 4, y0 + 4, 4, 'F'); font('black', 9, '#ffffff'); txt(String(i + 1), sx + 4, y0 + 5.4, { align: 'center' }); font('bold', 9, INK); txt(st[0], sx + 11, y0 + 3.6); font('normal', 7.4, GREY); txt(wrap(st[1], w / liste.length - 14), sx + 11, y0 + 7.6); });

    /* ---------- Seite 1: Deckblatt ---------- */
    y = kopfband(true) + 12;
    const gebText = [h.lab('gebaeude', pr.gebaeude), pr.baujahr ? 'Baujahr ' + pr.baujahr : ''].filter(Boolean).join(', ');
    if (V === 'betrieb') {
      eyebrow('Aufmaß vom Kunden · fürs Angebot', M, y, BRAND); y += 8;
      font('black', 30, INK); txt(kd.name || 'Kunde', M, y + 2); y += 10;
      font('normal', 11, GREY); txt([kd.adresse, gebText].filter(Boolean).join(' · ') || 'Objekt ohne Adresse', M, y + 2); y += 11;
    } else {
      eyebrow(V === 'kunde' ? 'Dein Fenster-Aufmaß' : 'Fenster-Aufmaß Ihres Kunden', M, y); y += 8;
      font('black', 30, INK); txt(V === 'kunde' ? (pr.name ? pr.name + '.' : 'Dein Aufmaß.') : (pr.name || 'Aufmaß für Ihr Angebot') + '.', M, y + 2); y += 10;
      font('normal', 11, GREY); txt([pr.ort, gebText].filter(Boolean).join(' · ') || 'Selbst gemessen, Schritt für Schritt geführt', M, y + 2); y += 11;
    }
    let cx = M;
    [[wins.length + (wins.length === 1 ? ' Position' : ' Positionen'), INK, '#ffffff'], [nE + (nE === 1 ? ' Element' : ' Elemente'), PAPER, INK], [nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ' ausgewertet' : 'ohne Fotos', PAPER, INK], [komplett ? '8 Handmaße je Fenster' : 'Maße teilweise offen', komplett ? '#e8f5ec' : '#fff4e5', komplett ? OK : WARN]].forEach((c) => { cx += chip(c[0], cx, y, c[1], c[2], 8) + 2.5; });
    y += 11;
    /* Großes Bild links, daneben drei Kacheln: was drinsteckt */
    const heroW = 116, heroH = 112, kx = M + heroW + 5, kw0 = CW - heroW - 5;
    fill(PAPER); rr(M, y, heroW, heroH, 5);
    if (wins.length) {
      const w0 = wins[0]; zeichnung(w0, M + 2, y + 5, heroW - 4, heroH - 16, false);
      font('bold', 8.6, INK); txt('Pos. 1 · ' + (w0.name || 'Fenster'), M + 6, y + heroH - 8.2);
      font('normal', 7.2, GREY); txt(wrap([teilungText(w0), oeffnungText(w0).split(' · ')[0], h.lab('material', w0.material), 'außen ' + farbe(w0.fa)[0]].filter(Boolean).join(' · '), heroW - 12)[0], M + 6, y + heroH - 4.2);
      font('normal', 6.6, GREY); const l1 = 'Maueröffnung', l2 = 'Element'; txt(l1, M + heroW - 5, y + 5.6, { align: 'right' }); swatch(MO, M + heroW - 5 - tw(l1) - 3, y + 4.7, 1.3); txt(l2, M + heroW - 5 - tw(l1) - 8, y + 5.6, { align: 'right' }); swatch(EL, M + heroW - 5 - tw(l1) - 8 - tw(l2) - 3, y + 4.7, 1.3);
    } else { font('normal', 10, GREY); txt('Noch kein Fenster erfasst.', M + heroW / 2, y + heroH / 2, { align: 'center' }); }
    const icoCol = V === 'betrieb' ? BRAND : ACC, kh0 = (heroH - 10) / 3;
    const tiles = V === 'betrieb'
      ? [['8 Handmaße je Fenster', 'Drei Breiten und drei Höhen der Öffnung, das kleinste zählt, dazu das Element mit Rahmen.', icoRuler(icoCol)], ['Bestellmaß-Vorschlag', 'Öffnung minus ' + ab.seite + ' mm je Seite und ' + ab.oben + ' mm oben, bei jeder Position. Verbindlich bleibt Ihr Feinaufmaß.', icoBest(icoCol)], ['Fotos und Wünsche', (nF ? nF + ' Fotos von der KI ausgewertet: Bestand, Zustand, Rollladen. ' : '') + 'Dazu Material, Farbe, Glas und Montage.', icoCam(icoCol)]]
      : [['8 Handmaße je Fenster', 'Drei Breiten, drei Höhen, dazu das Element mit Rahmen. Das kleinste Maß zählt, wie beim Profi.', icoRuler(icoCol)], [nF ? 'Fotos ausgewertet' : 'Fotos', nF ? 'Material, Zustand, Rollladen und Fensterbank, von der KI aus ' + nF + (nF === 1 ? ' Foto' : ' Fotos') + ' gelesen.' : 'Ohne Fotos gemessen. Bestand und Zustand klärt das Feinaufmaß.', icoCam(icoCol)], [sie ? 'Wünsche des Kunden' : 'Deine Wünsche', 'Teilung, Material, Farben innen und außen, Glas, Sprossen, Rollladen und Montage.', icoWish()]];
    tiles.forEach((tl, k) => kachel(kx, y + k * (kh0 + 5), kw0, kh0, tl[0], tl[1], tl[2], icoCol));
    const kw = (CW - 8) / 3;
    y += heroH + 7;
    /* Kontakt und Eckdaten */
    const kontakt = V === 'betrieb' ? [['Kontakt', kd.kontakt || '–'], ['Objekt', kd.adresse || '–']] : [['Name', pr.name || '–'], ['Ort', pr.ort || '–'], ['Telefon', pr.tel || '–'], ['E-Mail', pr.mail || '–'], ['Erreichbar', ERREICH[pr.erreich] || '–']].filter((r) => sie || r[1] !== '–');
    const eck = [['Gebäude', gebText || '–'], ['Fenster im Haus', num(pr.total) ? nE + ' von ' + pr.total + (nE > num(pr.total) / 3 ? ' · Lüftungskonzept prüfen (DIN 1946-6)' : '') : '–'], ['Zeitraum', h.lab('zeit', pr.zeit) || '–'], ['Budget', (h.lab('budget', pr.budget) || '–') + (pr.foerd ? ' · Förderung gewünscht' : '')]].concat(pr.notiz ? [['Nachricht', '„' + pr.notiz + '“']] : []);
    const halb = (CW - 5) / 2;
    const hk = kontakt.length ? karte(M, y, halb, sie ? (V === 'betrieb' ? 'Ihr Kunde' : 'So erreichen Sie den Kunden') : 'Deine Kontaktdaten fürs Angebot', kontakt, V === 'fensterbauer' ? { lw: 24, rand: ACC, titelCol: ACC } : { lw: 24 }) : 0;
    const he = karte(M + halb + 5, y, halb, 'Eckdaten zum Projekt', eck, { lw: 26 });
    y += Math.max(hk, he) + 6;
    if (V !== 'betrieb' && y + 18 <= BOTTOM) {
      eyebrow('So geht es weiter', M, y, GREY); y += 5;
      schritte(M, y, CW, sie ? [['Angebot', 'auf Grundlage dieses Blatts'], ['Feinaufmaß', 'ein Termin vor Ort, vor der Fertigung'], ['Fertigung und Einbau', 'nach Absprache']] : [['Angebot', 'dein Fensterbauer rechnet mit diesem Blatt'], ['Feinaufmaß', 'ein Termin vor Ort, vor der Fertigung'], ['Fertigung und Einbau', 'Termin nach Absprache']]);
      y += 16;
    }

    /* ---------- Übersicht ---------- */
    neueSeite();
    sektion('Übersicht', wins.length + (wins.length === 1 ? ' Position' : ' Positionen') + ' · ' + nE + (nE === 1 ? ' Element' : ' Elemente') + (V === 'betrieb' ? ' · Bestellmaß = Öffnung minus Abzug' : ' · alle Maße in mm'));
    const cols = V === 'betrieb' ? [['Pos.', 9], ['Fenster', 40], ['Öffnung', 23], ['Element', 23], ['Bestellmaß', 24], ['Öffnungsart', 27], ['Material · Farbe', 26], ['Stk.', 10]] : [['Pos.', 9], ['Fenster', 44], ['Öffnung', 25], ['Element', 25], ['Öffnungsart', 29], ['Material · Farbe', 29], ['Glas', 13], ['Stk.', 8]];
    const colX = []; let ax = M; cols.forEach((c) => { colX.push(ax); ax += c[1]; });
    const tabKopf = () => { font('bold', 6.8, GREY); cols.forEach((c, i) => txt(c[0].toUpperCase(), colX[i] + (i === cols.length - 1 ? c[1] - 1 : 0), y, { align: i === cols.length - 1 ? 'right' : 'left', charSpace: 0.3 })); y += 2; stroke(INK); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 1; };
    tabKopf();
    wins.forEach((w, i) => {
      const d = h.derive(w), fa = farbe(w.fa), fIdx = V === 'betrieb' ? 6 : 5;
      font('normal', 7.8);
      const cells = V === 'betrieb'
        ? [String(i + 1), '', (d.moW ? th(d.moW) + ' × ' + th(d.moH) : '–'), (d.elW ? th(d.elW) + ' × ' + th(d.elH) : '–'), bestell(w).replace(' mm', ''), oeffnungText(w), (h.lab('material', w.material) || 'Kunststoff') + ', ' + fa[0], String(num(w.anzahl) || 1)]
        : [String(i + 1), '', (d.moW ? th(d.moW) + ' × ' + th(d.moH) : '–'), (d.elW ? th(d.elW) + ' × ' + th(d.elH) : '–'), oeffnungText(w), (h.lab('material', w.material) || 'Kunststoff') + ', ' + fa[0], h.lab('glas', w.glas) || '3-fach', String(num(w.anzahl) || 1)];
      const lines = cells.map((c, k) => wrap(c, cols[k][1] - (k === fIdx ? 7 : 3)));
      const rh = Math.max(12, Math.max.apply(null, lines.map((l) => l.length)) * 3.5 + 5);
      if (y + rh > BOTTOM) { neueSeite(); tabKopf(); }
      if (i % 2 === 0) { fill('#fafafa'); doc.rect(M, y, CW, rh, 'F'); }
      const ty = y + rh / 2 + 1.2;
      font('black', 9, INK); txt(String(i + 1), colX[0] + 1, ty);
      mini(w, colX[1], y + (rh - 8.5) / 2, 8.5);
      font('bold', 8, INK); txt(wrap(w.name || 'Fenster', cols[1][1] - 13)[0], colX[1] + 11, ty - 1.6);
      font('normal', 6.6, GREY); txt([h.lab('etage', w.etage) || 'EG', num(w.bru) ? 'Brüstung ' + th(w.bru) : '', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : ''].filter(Boolean).join(' · '), colX[1] + 11, ty + 2);
      cells.forEach((c, k) => {
        if (k < 2) return;
        const bold = (V === 'betrieb' && k === 4) || k === 2, last = k === cells.length - 1, ly = ty - (lines[k].length - 1) * 1.75;
        font(bold ? 'bold' : 'normal', 7.8, V === 'betrieb' && k === 4 ? BRAND : k === 2 ? MO : INK);
        if (k === fIdx) { swatch(fa[2], colX[k] + 1.6, ty - 1, 1.5); txt(lines[k], colX[k] + 4.4, ly); }
        else txt(lines[k], colX[k] + (last ? cols[k][1] - 1 : 0), ly, { align: last ? 'right' : 'left' });
      });
      y += rh; stroke(LINE); doc.setLineWidth(0.2); doc.line(M, y, W - M, y);
    });
    y += 4;
    font('normal', 6.9, GREY); const legende = wrap('Maueröffnung: von drei Breiten und drei Höhen zählt das kleinste Maß; Abweichungen stehen bei der Position. Element: das sichtbare Fenster mit Rahmen. Öffnungssymbole: Linien beginnen an der Bandseite, die Spitze zeigt zum Griff; Dreieck mit Spitze oben = Kipp. ' + (V === 'betrieb' ? 'Bestellmaß: Vorschlag aus Ihrem Abzug, verbindlich bleibt Ihr Feinaufmaß.' : 'Das Bestellmaß legt der Fensterbauer beim Feinaufmaß fest.'), CW); txt(legende, M, y + 2.5); y += legende.length * 3.1 + 8;
    /* Ausstattung und Zahlen auf einen Blick */
    const gleich = (fn, sonst) => { const v = wins.map(fn); return v.length && v.every((x) => x === v[0]) ? v[0] : (sonst || 'unterschiedlich, siehe Positionen'); };
    const flaeche = wins.reduce((a, x) => { const d = h.derive(x); return a + (d.elW && d.elH ? d.elW * d.elH / 1e6 * (num(x.anzahl) || 1) : 0); }, 0);
    const groesste = wins.reduce((best, x) => { const d = h.derive(x); return !best || d.elW * d.elH > best.a ? { a: d.elW * d.elH, n: x.name || 'Fenster', d: d } : best; }, null);
    const etagen = wins.map((x) => h.lab('etage', x.etage) || 'EG').filter((v, i, a) => a.indexOf(v) === i).join(', ');
    const ausst = [['Material', gleich((x) => h.lab('material', x.material) || 'Kunststoff')], ['Farbe außen', gleich((x) => farbe(x.fa)[0] + ' (' + farbe(x.fa)[1] + ')')], ['Farbe innen', gleich((x) => farbe(x.gleich ? x.fa : x.fi)[0])], ['Glas', gleich((x) => (h.lab('glas', x.glas) || '3-fach') + ((x.glasfn || []).length ? ', ' + x.glasfn.map((g) => h.lab('glasfn', g)).join(', ') : ''))], ['Sprossen', gleich((x) => ((x.bars || []).length ? h.lab('spross', x.spross) : 'keine'))], ['Rollladen', gleich((x) => (h.lab('roll', x.roll) || 'keiner') + (x.roll === 'aufsatz' || x.roll === 'vorbau' ? ', ' + h.lab('antrieb', x.antrieb) : ''))], ['Insektenschutz', gleich((x) => h.lab('insekt', x.insekt) || 'keiner')], ['Fensterbank', gleich((x) => 'innen ' + (h.lab('fbi', x.fbi) || 'behalten') + ', außen ' + (h.lab('fba', x.fba) || 'behalten'))], ['Montage', gleich((x) => [x.demontage ? 'Ausbau und Entsorgung' : '', x.ralm ? 'RAL-Montage' : '', x.putz ? 'Laibung verputzen' : ''].filter(Boolean).join(', ') || 'nur Lieferung')]];
    const zahlen = [['Positionen', String(wins.length)], ['Elemente', String(nE)], ['Fensterfläche', flaeche ? 'etwa ' + flaeche.toFixed(1).replace('.', ',') + ' m² (Element, alle Stück)' : '–'], ['Größtes Fenster', groesste && groesste.d.elW ? groesste.n + ', ' + th(groesste.d.elW) + ' × ' + th(groesste.d.elH) + ' mm' : '–'], ['Geschosse', etagen || '–'], ['Fotos', nF ? nF + ', von der KI ausgewertet' : 'keine'], ['Maße', komplett ? 'alle 8 Handmaße je Fenster' : wins.filter((x) => { const d = h.derive(x); return !(d.moW && d.elW); }).length + ' Position(en) ohne vollständige Maße', { col: komplett ? OK : WARN, bold: true }]].concat(V === 'betrieb' ? [['Ihr Abzug', ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben']] : []);
    const ha = karteH(ausst, halb, 'x', { lw: 26 }), hz = karteH(zahlen, halb, 'x', { lw: 28 });
    platz(Math.max(ha, hz));
    karte(M, y, halb, 'Ausstattung im Überblick', ausst, { lw: 26 }); karte(M + halb + 5, y, halb, 'Zahlen', zahlen, { lw: 28 });
    y += Math.max(ha, hz) + 6;
    /* Alle Fenster im selben Maßstab */
    if (wins.length > 1) {
      const maxH = wins.reduce((a, x) => Math.max(a, h.derive(x).elH || 1200), 0), maxW = wins.reduce((a, x) => Math.max(a, h.derive(x).elW || 1000), 0);
      const perRow = Math.min(wins.length, 6), slot = (CW - 8) / perRow, zeilenN = Math.ceil(wins.length / perRow), sc = Math.min(34 / maxH, (slot - 10) / maxW), rowH = maxH * sc + 16;
      const gh = 12 + zeilenN * rowH + 2;
      platz(gh);
      fill('#ffffff'); stroke(LINE); doc.setLineWidth(0.3); rr(M, y, CW, gh, 3, 'FD');
      eyebrow('Alle Fenster im selben Maßstab', M + 4, y + 5.2, GREY);
      wins.forEach((w, i) => {
        const d = h.derive(w), ww = (d.elW || 1000) * sc, wh = (d.elH || 1200) * sc, r = Math.floor(i / perRow), c = i % perRow;
        const cx0 = M + 4 + c * slot + slot / 2, base = y + 10 + r * rowH + maxH * sc;
        ansicht(w, cx0 - ww / 2, base - wh, ww, wh);
        font('bold', 7, INK); txt(wrap((i + 1) + ' · ' + (w.name || 'Fenster'), slot - 4)[0], cx0, base + 4.2, { align: 'center' });
        font('normal', 6.4, GREY); txt(d.elW ? th(d.elW) + ' × ' + th(d.elH) + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stk.' : '') : 'Maße offen', cx0, base + 7.6, { align: 'center' });
      });
      y += gh + 6;
    }

    /* ---------- Je Position eine Seite ---------- */
    wins.forEach((w, i) => {
      neueSeite();
      const d = h.derive(w), fa = farbe(w.fa), fi = farbe(w.gleich ? w.fa : w.fi), n = num(w.anzahl) || 1;
      /* Kopf */
      fill(INK); rr(M, y - 7, 13, 13, 3); font('black', 11, '#ffffff'); txt(String(i + 1), M + 6.5, y + 0.6, { align: 'center' });
      font('black', 21, INK); txt(w.name || 'Fenster ' + (i + 1), M + 17, y + 0.5);
      font('normal', 8.8, GREY); txt([h.lab('etage', w.etage) || 'EG', n > 1 ? n + ' Stück' : '1 Stück', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : 'ohne Fotos', d.moW && d.elW ? 'alle 8 Handmaße' : 'Maße unvollständig'].join(' · '), M + 17, y + 6.5);
      if (V === 'betrieb') {
        fill(BRAND); rr(W - M - 64, y - 8, 64, 17, 3); font('bold', 6.3, '#ffffff'); alpha(0.85); txt('BESTELLMASS-VORSCHLAG', W - M - 60, y - 3.4, { charSpace: 0.4 }); alpha(1); font('black', 12.5, '#ffffff'); txt(bestell(w), W - M - 60, y + 3.2);
        font('normal', 6.2, '#ffffff'); alpha(0.85); txt('Öffnung minus ' + ab.seite + ' mm je Seite, minus ' + ab.oben + ' mm oben', W - M - 60, y + 7); alpha(1);
      } else if (d.moW && d.moH) {
        font('bold', 6.3, GREY); txt('MAUERÖFFNUNG', W - M, y - 3.4, { align: 'right', charSpace: 0.4 }); font('black', 12.5, MO); txt(th(d.moW) + ' × ' + th(d.moH) + ' mm', W - M, y + 3.2, { align: 'right' });
        font('normal', 6.6, GREY); txt('Element ' + th(d.elW) + ' × ' + th(d.elH) + ' mm', W - M, y + 7.4, { align: 'right' });
      }
      y += 13;
      /* Zeichnung über die volle Breite */
      const zh = 100; fill(PAPER); rr(M, y, CW, zh, 4);
      zeichnung(w, M + 2, y + 1, CW - 4, zh - 8, true);
      font('normal', 6.6, GREY); swatch(MO, M + 6, y + zh - 4.4, 1.4); txt('Maueröffnung, von Hand, in mm', M + 9, y + zh - 3.4); swatch(EL, M + 52, y + zh - 4.4, 1.4); txt('Fensterelement mit Rahmen', M + 55, y + zh - 3.4);
      const hinweise = [w.richtung === 'aussen' ? 'gestrichelt: öffnet nach außen' : '', num(w.laib) ? 'Laibung innen ' + th(w.laib) + ' mm' : '', h.lab('anschlag', w.anschlag) && w.anschlag !== 'ohne' ? h.lab('anschlag', w.anschlag) : ''].filter(Boolean).join(' · ');
      if (hinweise) txt(hinweise, W - M - 6, y + zh - 3.4, { align: 'right' });
      if (d.devW > 5 || d.devH > 5) { font('bold', 6.6, WARN); txt('bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel, das kleinste Maß zählt', M + 96, y + zh - 3.4); }
      y += zh + 5;
      /* Drei Karten nebeneinander */
      const masse = [['Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' : 'noch nicht gemessen', { bold: true, col: MO }], ['Breiten', 'oben ' + th(w.mo && w.mo.wt) + ' · Mitte ' + th(w.mo && w.mo.wm) + ' · unten ' + th(w.mo && w.mo.wb)], ['Höhen', 'links ' + th(w.mo && w.mo.hl) + ' · Mitte ' + th(w.mo && w.mo.hm) + ' · rechts ' + th(w.mo && w.mo.hr)], ['Außer Winkel', d.devW > 5 || d.devH > 5 ? 'bis ' + Math.max(d.devW, d.devH) + ' mm, kleinstes zählt' : 'unter 5 mm'], ['Element', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm, mit Rahmen' : 'noch nicht gemessen', { bold: true, col: EL }], ['Brüstung', num(w.bru) ? th(w.bru) + ' mm' : '–'], ['Laibung innen', num(w.laib) ? th(w.laib) + ' mm' : '–']].concat(V === 'betrieb' ? [['Bestellmaß', bestell(w), { bold: true, col: BRAND }]] : []);
      const ausf = [['Teilung', teilungText(w)], ['Öffnung', oeffnungText(w)], ['Form', h.lab('form', w.form) || 'Rechteck'], ['Material', h.lab('material', w.material) || 'Kunststoff'], ['Farbe außen', fa[0] + ' (' + fa[1] + ')' + (w.wunschA ? ', Wunsch: ' + w.wunschA : ''), { swatch: fa[2] }], ['Farbe innen', fi[0] + ' (' + fi[1] + ')' + (w.wunschI && !w.gleich ? ', Wunsch: ' + w.wunschI : ''), { swatch: fi[2] }], ['Glas', (h.lab('glas', w.glas) || '3-fach') + ((w.glasfn || []).length ? ', ' + w.glasfn.map((g) => h.lab('glasfn', g) + (g === 'sicht' ? ' (' + h.orn(w.orn) + ')' : '')).join(', ') : '')], ['Sprossen', (w.bars || []).length ? h.lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + h.lab('aufseite', w.aufSeite) + ')' : '') + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'keine'], ['Griff', (h.lab('griff', w.griff) || 'Standard') + ', ' + (h.lab('gf', w.gf) || 'weiß')], ['Einbruchschutz', h.lab('rc', w.rc) || 'Basisschutz']];
      const extras = [['Rollladen', (h.lab('roll', w.roll) || 'keiner') + (w.roll === 'aufsatz' || w.roll === 'vorbau' ? ', ' + h.lab('antrieb', w.antrieb) : '')], ['Insektenschutz', h.lab('insekt', w.insekt) || 'keiner'], ['Fensterbank innen', h.lab('fbi', w.fbi) || 'behalten'], ['Fensterbank außen', h.lab('fba', w.fba) || 'behalten'], ['Montage', [w.demontage ? 'Altfenster ausbauen und entsorgen' : '', w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'nur Lieferung']];
      const cw3 = (CW - 8) / 3, o3 = { lw: 20, fs: 7.6 }, karten = [['Maße', masse], ['Ausführung', ausf], ['Extras', extras]];
      const hs = karten.map((k) => karteH(k[1], cw3, k[0], o3)), hmax = Math.max.apply(null, hs);
      platz(Math.min(hmax, 40));
      karten.forEach((k, j) => { const x = M + j * (cw3 + 4); karte(x, y, cw3, k[0], k[1], o3); });
      y += hmax + 5;
      /* Aus den Fotos */
      const ki = w.ki && w.ki.rows ? w.ki.rows : [], hints = w.ki && w.ki.hints ? w.ki.hints : [];
      if (ki.length || hints.length) {
        const rows = ki.map((r) => [r[0], r[1]]).concat(hints.map((hh2, k) => ['Hinweis ' + (k + 1), hh2, { bold: true, col: WARN }]));
        const titel = 'Aus den Fotos (KI, ' + (w.fotos || 0) + (w.fotos === 1 ? ' Foto' : ' Fotos') + ')', o2 = { lw: 24, fs: 7.6, spalten: 2, bg: '#eef5fd', rand: '#cfe0f5', titelCol: ACC };
        const kh = karteH(rows, CW, titel, o2);
        if (y + kh > BOTTOM && y + 30 < BOTTOM && rows.length > 3) {
          /* geteilt: so viele Zeilen wie passen, der Rest auf der nächsten Seite */
          let teil = [], rest = rows.slice();
          while (rest.length > 1 && y + karteH(teil.concat([rest[0]]), CW, titel, o2) <= BOTTOM) teil.push(rest.shift());
          if (teil.length) { karte(M, y, CW, titel, teil, o2); y += karteH(teil, CW, titel, o2) + 4; }
          neueSeite(); karte(M, y, CW, 'Aus den Fotos (KI), Fortsetzung', rest, o2); y += karteH(rest, CW, 'x', o2) + 4;
        } else { platz(kh); karte(M, y, CW, titel, rows, o2); y += kh + 4; }
      }
      if (w.notiz) { const rows = [[sie ? 'Notiz des Kunden' : 'Deine Notiz', '„' + w.notiz + '“']]; platz(karteH(rows, CW, '', { lw: 26 })); karte(M, y, CW, '', rows, { lw: 26, bg: '#fffbe8', rand: '#f2e2a4' }); y += karteH(rows, CW, '', { lw: 26 }) + 4; }
    });

    /* ---------- Letzte Seite: für den Fensterbauer (nicht im Betriebsbereich) ---------- */
    if (V !== 'betrieb') {
      neueSeite();
      const url = (e.portalUrl || '') + '?von=pdf';
      fill(INK); rr(M, y - 4, CW, 40, 5);
      marke(M + 6, y + 1, 12, true);
      font('black', 18, '#ffffff'); txt('Dieses Aufmaß in Ihrem Fensterino-Konto.', M + 22, y + 6.5);
      font('normal', 8.6, '#ffffff'); alpha(0.85); txt(wrap('Für Fensterbauer: Mit dem Code auf dieser Seite holen Sie das Aufmaß in Ihr Konto, als Projekt mit Positionen zum Bearbeiten, 3-D-Ansicht, Bestellmaß-Vorschlag und PDF mit Ihrem Logo. Dauert eine Minute und kostet nichts: Die ersten 3 Projekte sind frei.', CW - 30), M + 22, y + 13, { lineHeightFactor: 1.3 });
      font('bold', 7.2, '#ffffff'); txt('Fensterino · Fenster aufmessen. Selbst. Richtig. · ' + (e.portalKurz || 'fensterino.com'), M + 22, y + 31.5); alpha(1);
      y += 43;
      kachel(M, y, kw, 32, 'Link statt Anfahrt', 'Schicken Sie Ihren nächsten Kunden einen Aufmaß-Link, einzeln oder als Liste. Er misst selbst, Sie bekommen alles fürs Angebot.', icoLink(ACC), ACC);
      kachel(M + kw + 4, y, kw, 32, 'Alles sortiert, mit 3-D', 'Positionen zum Bearbeiten, Bestellmaß nach Ihrem Abzug, Fotoauswertung, PDF mit Ihrem Logo.', icoCube(ACC), ACC);
      kachel(M + 2 * (kw + 4), y, kw, 32, 'Nachbesserung kostenlos', 'Stimmt ein Maß nicht, fragen Sie nach. Ihr Kunde ändert nur das Nötige, ohne neue Kosten.', icoLoop(ACC), ACC);
      y += 40;
      const qrS = 34, qrX = W - M - qrS;
      [['Kostenlos registrieren', e.portalKurz || 'fensterino.com'], ['„Code vom Kunden einfügen“', 'den Code unten einsetzen, Leerzeichen und Umbrüche stören nicht'], ['Projekt ist da', 'Positionen, 3-D, Bestellmaß, Nachbesserung per Link']].forEach((st, k) => { fill(INK); doc.circle(M + 4, y + 4 + k * 12, 4, 'F'); font('black', 9, '#ffffff'); txt(String(k + 1), M + 4, y + 5.4 + k * 12, { align: 'center' }); font('bold', 9.5, INK); txt(st[0], M + 11, y + 3.6 + k * 12); font('normal', 7.6, GREY); txt(st[1], M + 11, y + 7.8 + k * 12); });
      try {
        if (e.qr) {
          const q = e.qr(0, 'M'); q.addData(url); q.make();
          const nq = q.getModuleCount(), cell = qrS / (nq + 2), x0 = qrX + cell, y0 = y - 2 + cell;
          fill('#ffffff'); stroke(LINE); doc.setLineWidth(0.3); rr(qrX - 2, y - 4, qrS + 4, qrS + 4, 2, 'FD'); fill('#000000');
          for (let r = 0; r < nq; r++) for (let c = 0; c < nq; c++) if (q.isDark(r, c)) doc.rect(x0 + c * cell, y0 + r * cell, cell + 0.02, cell + 0.02, 'F');
          doc.link(qrX - 2, y - 4, qrS + 4, qrS + 4, { url: url });
          font('normal', 6.8, GREY); txt('Scannen: Anmeldung', qrX + qrS / 2, y + qrS + 4.5, { align: 'center' });
        }
      } catch (err) { /* ohne QR weiter */ }
      y += 42;
      font('bold', 8.5, INK); txt('3 Projekte kostenlos, danach 9 € netto je Projekt mit eingegangenem Aufmaß. Nachbesserungen inklusive. Keine Grundgebühr.', M, y); y += 6;
      font('normal', 7.4, GREY); const eig = wrap(V === 'kunde' ? 'Für dich: Dieses Blatt ist vollständig und gehört dir. Gib es jedem Fensterbauer, von dem du ein Angebot möchtest. Fensterino für Hauseigentümer: ' + (e.appKurz || '') : 'Für den Eigentümer: Dieses Blatt ist vollständig und gehört Ihnen. Geben Sie es jedem Fensterbauer, von dem Sie ein Angebot möchten. Fensterino für Hauseigentümer: ' + (e.appKurz || ''), CW); txt(eig, M, y); y += eig.length * 3.2 + 5;
      /* Der Code: Courier, damit er sich aus jedem PDF-Programm sauber kopieren lässt */
      if (e.code) {
        font('mono', 6.6); const zeilen2 = doc.splitTextToSize(e.code, CW - 8);
        let k = 0, erster = true;
        while (k < zeilen2.length) {
          const frei = Math.floor((BOTTOM - y - (erster ? 12 : 8)) / 2.85);
          if (frei < 4) { neueSeite(); continue; }
          const teil = zeilen2.slice(k, k + frei), hh = teil.length * 2.85 + (erster ? 12 : 8);
          fill(PAPER); rr(M, y, CW, hh, 3);
          if (erster) eyebrow('Aufmaß-Code für Fensterino', M + 4, y + 5.2, INK);
          font('mono', 6.6, '#3a3a3f'); let cy2 = y + (erster ? 10.4 : 6);
          teil.forEach((z) => { txt(z, M + 4, cy2); cy2 += 2.85; });
          y += hh + 3; k += teil.length; erster = false;
        }
      }
    }
    fuss();
    return doc.output('blob');
  }
  return { pdf: pdf, schrift: schrift };
})();

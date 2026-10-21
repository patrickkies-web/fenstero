'use strict';
/* eeziframes · Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben
   Blatt.pdf(e)      -> Blob (null, wenn jsPDF fehlt)
   Blatt.schrift()   -> Promise; lädt vor dem ersten Blatt jsPDF, den QR-Code und die eingebettete Schrift (blatt-schrift.js) einmal nach,
                        danach sofort; vor jedem Blatt.pdf() abwarten

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
  const W = 210, H = 297, M = 14, RM = 18, XR = W - RM, CW = XR - M, BOTTOM = H - 16, STREIFEN = 8;
  const INK = '#1d1d1f', INK2 = '#3a3a3f', GREY = '#5f5f64', MO_T = '#b3401e', LINE = '#d9d9de', PAPER = '#f5f5f7', ACC = '#0071e3', MO = '#d4502b', EL = '#0071e3', OK = '#1f7a3d', WARN = '#a85a00', GLASS = '#d6e6f4', WALL = '#efece6', LAIB = '#ddd7cc', LAIB2 = '#cfc8bb';
  const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); const n = m ? parseInt(m[1], 16) : 0; return [n >> 16, (n >> 8) & 255, n & 255]; };
  const t = (s) => (Array.isArray(s) ? s.map(t) : String(s == null ? '' : s).replace(/[  ]/g, ' '));
  const TYP = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp', S: 'Schiebeflügel', X: 'Faltflügel', P: 'Gehflügel', PS: 'PSK-Flügel' };
  const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
  const tuerCfg = (w) => (w.art === 'hst' ? w.hst : w.art === 'fsw' ? w.fsw : w.art === 'psk' ? w.psk : w.art === 'balkon' ? w.bt : null) || {};
  const ARTNAME = { fenster: 'Fenster', balkon: 'Balkontür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
  /* Gemeinsame Regeln (modell.js): offene Wünsche, Pflichtthemen, Förderwerte, Klärungsliste, Fachangaben der KI */
  const A = () => window.AW || null;
  const OT = 'offen, bitte beraten';
  const offen = (w, k) => { const a = A(); return a ? a.istOffen(w, k) : !!(w.offen && w.offen[k]); };
  const ERREICH = { vm: 'vormittags', nm: 'nachmittags', ab: 'abends' };
  const BASIS = document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[^/]*$/, '') : '/assets/';
  /* jsPDF (etwa 360 KB) und der QR-Code kommen erst mit dem ersten Blatt, nicht mit der Seite: Startseite und App laden schneller */
  const VENDOR = BASIS.replace(/assets\/$/, 'vendor/');
  const geladen = {};
  const skript = (src, da) => {
    if (da()) return Promise.resolve(true);
    if (geladen[src]) return geladen[src];
    return (geladen[src] = new Promise((res) => {
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = () => res(!!da()); s.onerror = () => { delete geladen[src]; s.remove(); res(false); };
      document.head.appendChild(s);
    }));
  };
  function schrift() {
    return Promise.all([
      skript(VENDOR + 'jspdf.umd.min.js', () => !!(window.jspdf && window.jspdf.jsPDF)),
      skript(VENDOR + 'qrcode.js', () => typeof window.qrcode === 'function'),
      skript(BASIS + 'blatt-schrift.js', () => !!window.BlattSchrift)
    ]).then((r) => r[2]);
  }

  function pdf(e) {
    const J = window.jspdf && window.jspdf.jsPDF; if (!J) return null;
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const h = e.h, V = e.variante || 'kunde', wins = e.fenster || [], pr = e.projekt || {}, kd = e.kunde || {}, bt = e.betrieb || {}, ab = bt.abzug || { seite: 15, oben: 15 };
    const BRAND = V === 'betrieb' ? (bt.col || ACC) : '#000000';
    const sie = V !== 'kunde';
    /* Adresse der Website: die, unter der eeziframes gerade läuft (nach einem Domainwechsel stimmt sie von selbst) */
    const HOST = e.portalKurz || (typeof location !== 'undefined' && location.host) || 'eeziframes';
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
    /* Beschriftungen: ein langes zusammengesetztes Wort, das nicht in die Spalte passt, an der Fuge trennen statt mitten im Wort */
    const FUGE = { Absturzsicherung: 'Absturz', Einbruchschutz: 'Einbruch', Insektenschutz: 'Insekten', Sonnenschutz: 'Sonnen', Fensterbank: 'Fenster', Förderwert: 'Förder', Insektenschutzgewebe: 'Insekten', Rollladenpanzer: 'Rollladen', Kindersicherung: 'Kinder', Abstandhalter: 'Abstand', Fensteröffner: 'Fenster', Rahmenansicht: 'Rahmen', Abdeckleisten: 'Abdeck', Lichtschlitze: 'Licht', Fenstergitter: 'Fenster' };
    const wrapK = (s, w) => wrap(String(s).split(' ').map((wd) => (FUGE[wd] && tw(wd) > w ? FUGE[wd] + '-\n' + wd.slice(FUGE[wd].length) : wd)).join(' '), w);
    const txt = (s, x, y, o) => doc.text(t(s), x, y, o);
    /* Marke: immer klein, auch in Versalzeilen; Wortmarke „eezi“ in Black, „frames“ in Medium */
    const VERSAL = (s) => String(s).split(/(eeziframes|eezi)/).map((x, i) => (i % 2 ? x : x.toUpperCase())).join('');
    const wortmarke = (x, y0, size, col) => { font('black', size, col); txt('eezi', x, y0); const w1 = tw('eezi'); font('normal', size, col); txt('frames', x + w1, y0); return w1 + tw('frames'); };
    const alpha = (a) => { try { doc.setGState(new doc.GState({ opacity: a })); } catch (err) { /* ohne Transparenz */ } };
    const rr = (x, y, w, h2, r, mode) => doc.roundedRect(x, y, w, h2, r, r, mode || 'F');
    const dash = (on) => { try { doc.setLineDashPattern(on ? [1.1, 0.9] : [], 0); } catch (err) { /* ok */ } };
    const num = h.num, th = h.th;
    const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), nF = wins.reduce((a, x) => a + (num(x.fotos) || 0), 0);
    /* „ausgewertet“ nur, wo die Auswertung auch im Blatt steht (Befund oder Fachangaben); sonst ehrlich nur die Zahl der Fotos */
    const nA = wins.reduce((a, x) => a + (x.ki && ((x.ki.rows || []).length || (x.ki.fach && Object.keys(x.ki.fach).length)) ? num(x.fotos) || 0 : 0), 0);
    const fotoText = !nF ? 'ohne Fotos' : nA === nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ' ausgewertet' : nA ? nA + ' von ' + nF + ' Fotos ausgewertet' : nF + (nF === 1 ? ' Foto' : ' Fotos');
    const komplett = wins.length > 0 && wins.every((x) => { const d = h.derive(x); return d.moW && d.moH && d.elW && d.elH; });
    const heute = (() => { try { return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (err) { return ''; } })();
    const titelName = V === 'betrieb' ? (kd.name || 'Kunde') : (pr.name || '');
    const laufTitel = (V === 'betrieb' ? 'Aufmaß · ' : 'Aufmaßblatt · ') + (titelName || (V === 'kunde' ? 'Dein Aufmaß' : 'Fenster-Aufmaß'));
    const initial = (name) => (String(name || 'F').replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F');
    /* Kennung des Aufmaßes: kurz, aus dem Code gebildet, steht auf jeder Seite (eine einzelne Seite bleibt zuordenbar) */
    const kennung = e.beispiel ? 'AM-BEISPIEL' : V === 'betrieb' && bt.nr ? String(bt.nr) : (() => { const q = String(e.code || (pr.name || '') + heute + wins.length); let a = 2166136261; for (let i = 0; i < q.length; i++) { a ^= q.charCodeAt(i); a = Math.imul(a, 16777619); } const Z = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let o = ''; for (let i = 0; i < 6; i++) o += Z[(a >>> (i * 5)) & 31]; return 'AM-' + o; })();
    try { doc.setDocumentProperties({ title: laufTitel, subject: 'Fenster-Aufmaß ' + kennung + (titelName ? ' · ' + titelName : ''), author: V === 'betrieb' ? (bt.name || 'eeziframes') : 'eeziframes', keywords: 'Aufmaß, Fenster, Maße in mm, ' + kennung, creator: 'eeziframes' }); doc.setLanguage('de-DE'); if (doc.viewerPreferences) doc.viewerPreferences({ DisplayDocTitle: true }); } catch (err) { /* ohne Eigenschaften weiter */ }

    /* ---------- Seitenrahmen ---------- */
    let y = 0;
    /* Das Zeichen: Licht fällt durch ein Fenster in einen dunklen Raum. Dieselben Punkte wie im SVG (scripts/logo-setzen.py,
       Raster 64); der Lichtstreifen endet unten links an der Rundung der Kachel. Auf dunklem Band weiße Kachel, sonst schwarze. */
    const ZEICHEN = (() => {
      const strahl = [[44.2, 41], [55.9, 43.3], [11.7, 64], [10, 64]];
      for (let i = 1; i <= 8; i++) { const a = Math.PI / 2 + (Math.PI / 2) * i / 8; strahl.push([10 + 10 * Math.cos(a), 54 + 10 * Math.sin(a)]); }
      return [[[26.4, 12.2], [44.4, 19.7], [56.3, 15.3], [42, 6.6]], [[45, 22], [57, 17.6], [57, 41.9], [45, 39.8]], strahl];
    })();
    function marke(x, y0, s, hell) {
      const u = s / 64;
      fill(hell ? '#ffffff' : '#000000'); rr(x, y0, s, s, 10 * u);
      fill(hell ? '#000000' : '#ffffff');
      ZEICHEN.forEach((pts) => doc.lines(pts.slice(1).map((p, i) => [(p[0] - pts[i][0]) * u, (p[1] - pts[i][1]) * u]), x + pts[0][0] * u, y0 + pts[0][1] * u, [1, 1], 'F', true));
    }
    const kopfband = (gross) => {
      const bh = gross ? 24 : 9;
      fill(BRAND); doc.rect(0, 0, W, bh, 'F');
      if (V === 'betrieb') {
        const r = gross ? 6.5 : 2.8, cx = M + r, cy = bh / 2;
        fill('#ffffff'); doc.circle(cx, cy, r, 'F');
        font('black', gross ? 13 : 6, BRAND); txt(initial(bt.name), cx, cy + (gross ? 4.6 : 2.1), { align: 'center' });
        font('bold', gross ? 15 : 8, '#ffffff'); txt(bt.name || 'Betrieb', cx + r + (gross ? 5 : 2.5), cy + (gross ? 5.2 : 2.8));
        font('normal', gross ? 8 : 6.8, '#ffffff'); alpha(0.85); txt(gross ? 'Aufmaß · erfasst vom Kunden mit eeziframes' : laufTitel + ' · ' + kennung, XR, cy + (gross ? 1 : 2.3), { align: 'right' }); alpha(1);
        if (gross) { font('normal', 8, '#ffffff'); alpha(0.8); txt([bt.nr, bt.eingegangen ? 'eingegangen ' + bt.eingegangen : heute].filter(Boolean).join(' · '), XR, cy + 6, { align: 'right' }); alpha(1); }
      } else {
        marke(M, gross ? 5 : 1.6, gross ? 14 : 5.8, true);
        wortmarke(M + (gross ? 19 : 7.8), gross ? 17.2 : 6.6, gross ? 16 : 8, '#ffffff');
        font('normal', gross ? 8 : 6.5, '#ffffff'); alpha(0.78);
        if (gross) { txt('AUFMASSBLATT · ' + kennung, XR, 10, { align: 'right', charSpace: 0.6 }); txt(heute, XR, 15.5, { align: 'right' }); }
        else txt(laufTitel + ' · ' + heute + ' · ' + kennung, XR, 6.3, { align: 'right' });
        alpha(1);
      }
      doc.setTextColor.apply(doc, rgb(INK));
      return bh;
    };
    const neueSeite = () => { doc.addPage(); y = kopfband(false) + 10; };
    const EIGENE = V !== 'betrieb', EIGENE_H = 46;
    const seiteNr = () => doc.getCurrentPageInfo().pageNumber;
    const unten = () => (EIGENE && seiteNr() === 2 ? BOTTOM - EIGENE_H - 6 : BOTTOM);
    const platz = (h2) => { if (y + h2 > unten()) neueSeite(); };
    let codeSeite = 2, fbBox = null;
    /* Senkrechter Markenstreifen am rechten Rand jeder Seite: Werbung, die nicht abtrennbar ist */
    const streifen = (bandH) => {
      const x0 = W - STREIFEN, y0 = bandH, y1 = H - 12, len = y1 - y0;
      fill(BRAND); doc.rect(x0, y0, STREIFEN, len, 'F');
      const text = V === 'betrieb'
        ? String(bt.name || 'Betrieb').toUpperCase() + '  ·  Aufmaß Ihres Kunden  ·  erstellt mit eeziframes  ·  ' + HOST
        : 'eeziframes  ·  Fenster ausmessen. Selbst. eezi.  ·  ' + HOST + '  ·  Für Fensterbauer: Aufmaß per Code in Ihr Konto holen, Seite ' + codeSeite + '  ·  3 Projekte kostenlos';
      let size = 6.8; font('bold', size, '#ffffff');
      while (tw(text) > len - 16 && size > 5.2) { size -= 0.2; font('bold', size, '#ffffff'); }
      const tl = tw(text), ty = y1 - 9 - (len - 16 - tl) / 2;
      txt(text, x0 + STREIFEN / 2 + size * 0.12, ty, { angle: 90 });
      marke(x0 + 1.2, y1 - 7.2, STREIFEN - 2.4, true);
    };
    /* Beispiel aus der Führung: schräg „Beispiel“ über jeder Seite, damit es nicht als echtes Aufmaß durchgeht */
    const wasserzeichen = () => {
      const a = 34 * Math.PI / 180, s = 'BEISPIEL';
      font('black', 96, '#b42318'); alpha(0.07);
      const l = tw(s), cxw = W / 2, cyw = H / 2 + 12;
      txt(s, cxw - Math.cos(a) * l / 2, cyw + Math.sin(a) * l / 2, { angle: 34 });
      alpha(1);
    };
    const fuss = () => {
      const n = doc.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        stroke(LINE); doc.setLineWidth(0.25); doc.line(M, H - 11.5, XR, H - 11.5);
        font('normal', 7.2, GREY);
        txt(V === 'betrieb' ? 'Erstellt mit eeziframes für ' + (bt.name || 'Ihren Betrieb') + ' · ' + HOST + ' · Vor der Fertigung Feinaufmaß vor Ort.' : 'Erstellt mit eeziframes · ' + HOST + ' · Vor der Fertigung Feinaufmaß vor Ort.', M, H - 7.2);
        txt(kennung + ' · Seite ' + i + ' von ' + n, XR, H - 7.2, { align: 'right' });
        streifen(i === 1 ? 24 : 9);
        if (i === 2 && EIGENE) eigeneKunden(BOTTOM - EIGENE_H);
        if (e.beispiel) wasserzeichen();
      }
      if (fbBox) { doc.setPage(1); fbBox(); }
    };
    /* QR-Code zur Anmeldung (?von=pdf), weiß hinterlegt und anklickbar */
    const QR_URL = (e.portalUrl || '') + '?von=pdf';
    function qr(x, y0, size) {
      try {
        if (!e.qr) return false;
        const q = e.qr(0, 'M'); q.addData(QR_URL); q.make();
        const nq = q.getModuleCount(), cell = size / (nq + 8), x0 = x + 4 * cell, yy = y0 + 4 * cell;
        fill('#ffffff'); rr(x, y0, size, size, 1.2); fill('#000000');
        for (let r = 0; r < nq; r++) for (let c = 0; c < nq; c++) if (q.isDark(r, c)) doc.rect(x0 + c * cell, yy + r * cell, cell + 0.02, cell + 0.02, 'F');
        doc.link(x, y0, size, size, { url: QR_URL });
        return true;
      } catch (err) { return false; }
    }
    /* ---------- Bausteine ---------- */
    const eyebrow = (s, x, y0, color) => { font('bold', 7, color || ACC); txt(VERSAL(s), x, y0, { charSpace: 0.5 }); };
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
      if (label) pille(label, (x1 + x2) / 2 + (pillOffset ? pillOffset[0] : 0), (y1 + y2) / 2 + (pillOffset ? pillOffset[1] : 0), color === MO ? MO_T : color, 8.2);
    }
    /* Die Fensterzeichnung: Wand, Maueröffnung mit Laibung, Element mit Flügeln, Symbole, Sprossen, Griffe, Fensterbank; dazu die Maße */
    function zeichnung(w, bx, by, bw, bh, alle) {
      const d = h.derive(w), mo = w.mo || {};
      const moW = d.moW || (d.elW ? d.elW + 80 : 1200), moH = d.moH || (d.elH ? d.elH + 70 : 1400);
      const elW = d.elW || moW - 80, elH = d.elH || moH - 70, tuer = istTuer(w), art = w.art || 'fenster', bru = tuer ? 0 : num(w.bru);
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
      const fc = (h.farbe ? h.farbe(w, 'aussen') : h.col(w.fa))[2], f = Math.max(1.1, ew * 0.055);
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
      /* Unterlicht: festes Feld unten, Glas oder Paneel */
      if (w.ul && art === 'fenster') { const uh = Math.min(ih * 0.5, Math.max(ih * 0.18, ih * (num(w.ulH) || 400) / (elH || 1400))); if (w.ulA === 'paneel') { fill('#c9c9c6'); stroke(INK); doc.setLineWidth(0.25); doc.rect(ix, iy + ih - uh, iw, uh, 'FD'); } else glas(ix, iy + ih - uh, iw, uh); ih -= uh + f * 0.7; }
      const S = w.sashes && w.sashes.length ? w.sashes : [{ t: 'DK', din: 'L' }], n = S.length, gap = tuer ? f * 0.2 : w.teilung === '2s' ? f * 0.3 : f * 0.85, sw = (iw - gap * (n - 1)) / n;
      S.forEach((sa, i) => {
        const fest = sa.t === 'F' || art === 'fest', sx = ix + i * (sw + gap), g = fest && art !== 'hst' ? 0 : Math.max(0.9, sw * (fest ? 0.06 : 0.085));
        if (!fest || art === 'hst') { fill(fc); stroke(INK); doc.setLineWidth(0.3); doc.rect(sx, iy, sw, ih, 'FD'); }
        const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
        glas(gx, gy, gw, gh);
        (w.bars || []).filter((b) => b.s === i).forEach((b) => { stroke(fc === '#f1f0ea' ? '#b9b4a8' : fc); doc.setLineWidth(Math.max(0.5, gw * 0.035)); if (b.d === 'v') doc.line(gx + gw * b.p, gy, gx + gw * b.p, gy + gh); else doc.line(gx, gy + gh * b.p, gx + gw, gy + gh * b.p); });
        if (sa.t === 'S' || sa.t === 'PS') { const dir = sa.din === 'L' ? 1 : -1, cx = gx + gw / 2, cy = gy + gh * 0.6, al = gw * 0.22; stroke(INK); doc.setLineWidth(0.35); alpha(0.6); doc.line(cx - dir * al, cy, cx + dir * al, cy); doc.line(cx + dir * al, cy, cx + dir * al - dir * 1.6, cy - 1.4); doc.line(cx + dir * al, cy, cx + dir * al - dir * 1.6, cy + 1.4); alpha(1); if (sa.t === 'PS') symbol(gx, gy, gw, gh, 'K', sa.din); }
        else if (sa.t !== 'X') symbol(gx, gy, gw, gh, sa.t === 'P' ? 'D' : sa.t, sa.din);
        if (sa.t === 'D' || sa.t === 'DK' || sa.t === 'P') { const hx = sa.din === 'L' ? sx + sw - g * 0.5 : sx + g * 0.5, hl = Math.min(ih * 0.16, 9), hw = Math.max(0.8, g * 0.7); fill('#4a4a4f'); rr(hx - hw / 2, iy + ih / 2 - hl / 2, hw, hl, hw / 2); }
        if (sa.t === 'S' || sa.t === 'PS') { const hx = sa.din === 'L' ? sx + g * 0.5 : sx + sw - g * 0.5, hl = Math.min(ih * (sa.t === 'PS' ? 0.12 : 0.2), sa.t === 'PS' ? 8 : 12), hw = Math.max(0.9, g * 0.8); fill('#4a4a4f'); rr(hx - hw / 2, iy + ih * 0.52 - hl / 2, hw, hl, hw / 2); }
        if (sa.t === 'K') { const hl = Math.min(sw * 0.16, 9), hw = Math.max(0.8, g * 0.7); fill('#4a4a4f'); rr(sx + sw / 2 - hl / 2, iy + g * 0.2, hl, hw, hw / 2); }
      });
      if (tuer) {
        /* Schwelle und Fußboden statt Fensterbank */
        fill('#c9ccd0'); stroke(INK); doc.setLineWidth(0.3); doc.rect(ex, ey + eh - Math.max(0.8, f * 0.5), ew, Math.max(0.8, f * 0.5), 'FD');
        stroke(INK); doc.setLineWidth(0.6); doc.line(ox - wr - 4, oy + oh, ox + ow + wr + 4, oy + oh);
        stroke(GREY); doc.setLineWidth(0.3); for (let hx = ox - wr - 2; hx < ox + ow + wr + 4; hx += 4) doc.line(hx, oy + oh, hx - 2, oy + oh + 2);
        font('normal', 7.4, GREY); txt('Fußboden', ox + ow + wr + 3, oy + oh + 4.8, { align: 'right' });
      } else {
        /* Fensterbank */
        const fb = h.lab('fba', w.fba); fill(fb === 'Naturstein' ? '#cfc8bb' : '#c9ccd0'); stroke(INK); doc.setLineWidth(0.3); doc.rect(ox - ow * 0.025, oy + oh - lt * 0.5, ow * 1.05, lt * 0.5 + 1, 'FD');
      }
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
        font('normal', 7.4, GREY); txt('Fußboden', frx - 1, fy + 4.8, { align: 'right' });
      }
    }
    /* Kleines Fenster für Tabellen */
    function mini(w, x, y0, s) {
      const d = h.derive(w), a = (d.elW || 1000) / (d.elH || 1200), bw = a >= 1 ? s : s * a, bh = a >= 1 ? s / a : s;
      ansicht(w, x + (s - bw) / 2, y0 + (s - bh) / 2, bw, bh);
    }
    /* Fenster in gegebener Größe: Rahmen, Flügel, Oberlicht */
    function ansicht(w, bx, by, bw, bh) {
      const fc = (h.farbe ? h.farbe(w, 'aussen') : h.col(w.fa))[2];
      fill(fc); stroke(INK); doc.setLineWidth(0.3); doc.rect(bx, by, bw, bh, 'FD');
      const f = Math.max(0.5, bw * 0.08); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
      if (w.ol) { const oh = ih * 0.26; fill(GLASS); doc.rect(ix, iy, iw, oh, 'FD'); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
      const S = w.sashes && w.sashes.length ? w.sashes : [{ t: 'DK' }], n = S.length, gap = w.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
      S.forEach((sa, i) => { fill(GLASS); doc.setLineWidth(0.2); doc.rect(ix + i * (sw + gap), iy, sw, ih, 'FD'); });
    }
    const teilungText = (w) => {
      /* Seitenteile zählen nicht als Flügel, sie stehen dahinter */
      const st = (w.sashes || []).filter((x) => x.st).length, n = ((w.sashes || []).length - st) || 1, art = w.art || 'fenster';
      const seiten = st ? ', ' + (st === 2 ? '2 Seitenteile' : 'Seitenteil ' + (w.seiten === 'links' ? 'links' : 'rechts')) + (num(w.seitenB) ? ' je ' + th(w.seitenB) + ' mm' : '') : '';
      if (art === 'fest') return n + (n === 1 ? ' Feld' : ' Felder') + ', fest verglast';
      const ol = w.ol ? ', ' + (h.lab('olT', w.olT) || 'Oberlicht') : '';
      if (art === 'hst') return 'Hebe-Schiebe-Tür, ' + n + (n === 1 ? ' Teil' : ' Teile') + ', ' + (h.lab('hstSchema', (w.hst || {}).schema) || 'Schema A').split(' (')[0] + ol;
      if (art === 'fsw') return 'Faltschiebewand, ' + n + ' Flügel, ' + (h.lab('fswSchema', (w.fsw || {}).schema) || 'Paket links') + ol;
      if (art === 'psk') return 'PSK-Tür, ' + n + ' Teile, ' + ((w.psk || {}).schema === 'C' ? '2 Schiebeflügel mittig' : (w.psk || {}).richtung === 'L' ? 'Schiebeflügel links' : 'Schiebeflügel rechts');
      if (art === 'balkon') return 'Balkontür, ' + n + ' Flügel' + (w.teilung === '2s' ? ', Stulp' : w.teilung === '2p' ? ', mit Pfosten' : '') + seiten + ol + (w.paneel === 'paneel' ? ', unten Paneel' : '');
      return n + ' Flügel' + (w.teilung === '2s' ? ', Stulp' : w.teilung === '2p' ? ', mit Pfosten' : w.teilung === '3' || w.teilung === '4' ? ', Mitte fest' : '') + seiten + ol + (w.ul ? ', ' + (h.lab('ul', w.ulA) || 'Unterlicht') + ' ' + th(w.ulH) + ' mm' : '');
    };
    const oeffnungText = (w) => (h.opening ? h.opening(w) : (w.sashes || []).map((x) => TYP[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ')) + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ' · nach außen' : '');
    const sonneText = (w) => (h.sonne ? h.sonne(w) : (h.lab('roll', w.roll) || 'keiner') + (w.roll === 'aufsatz' || w.roll === 'vorbau' ? ', ' + h.lab('antrieb', w.antrieb) : ''));
    const innenText = (w) => (h.innen ? h.innen(w) : (!w.iart || w.iart === 'keiner' ? 'keiner' : (h.lab('iart', w.iart) || w.iart) + ', ' + (h.lab('ifarbe', w.ifarbe) || '')));
    const griffText = (w) => (w.art === 'fest' ? 'ohne Griff' : offen(w, 'griff') ? OT : (w.art === 'hst' ? (h.lab('hstGriff', w.griff) || 'Hebegriff') : (h.lab('griff', w.griff) || 'Standard')) + (w.griff === 'ohne' || w.griff === 'motor' ? '' : ', ' + (h.griffFarbe ? h.griffFarbe(w) : (h.lab('gf', w.gf) || 'weiß') + (w.wunschGf ? ', Wunsch: ' + w.wunschGf : '')))) + (w.art === 'balkon' ? '; außen ' + (offen(w, 'griffA') ? OT : h.lab('griffA', (w.bt || {}).griffA) || 'kein Griff') : '');
    const rahmen = (w, seite) => (h.farbe ? h.farbe(w, seite) : farbe(seite === 'innen' ? (w.gleich ? w.fa : w.fi) : w.fa));
    const montageText = (w) => (offen(w, 'montage') ? 'nach Vorschlag des Fensterbauers' : [w.neu ? (w.durchbruch !== false ? 'Wanddurchbruch samt Sturz' : '') : (w.demontage ? 'Altfenster ausbauen und entsorgen' : ''), w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'nur Lieferung');
    /* Schwelle bzw. Fensterbank in Worten, offen berücksichtigt */
    const schwelleText = (w) => (w.art === 'psk' ? 'mit Schwelle (PSK)' : offen(w, 'schwelle') ? OT : h.lab('schwelle', tuerCfg(w).schwelle) || 'flache Schwelle');
    const bankText = (w, k) => (offen(w, k) ? OT : h.lab(k, w[k]) || 'behalten');
    const rcText = (w) => { const a = A(); return a ? a.rcText(w) : h.lab('rc', w.rc) || 'Basisschutz'; };
    const bestell = (w) => { const d = h.derive(w); return d.moW && d.moH ? th(d.moW - 2 * ab.seite) + ' × ' + th(d.moH - ab.oben) + ' mm' : '–'; };
    const farbe = (k) => h.col(k);
    /* Karte mit Titel und Zeilen [Begriff, Wert, { swatch, bold, col }]; opt.lw = Breite der Begriffsspalte, opt.spalten = 2 für zwei Spalten */
    function zeilenH(rows, w, opt) {
      const lw = opt.lw || 26; let hh = 0;
      rows.forEach((r) => { font('normal', opt.fs || 8); const v = wrap(r[1], w - lw - 4 - (r[2] && r[2].swatch ? 5.5 : 0)); font('normal', (opt.fs || 8) - 0.6); const k = wrapK(r[0], lw - 2); hh += Math.max(v.length, k.length, 1) * ((opt.fs || 8) * 0.46) + 1.5; });
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
        font('normal', fs - 0.6, GREY); const kl = wrapK(r[0], lw - 2); txt(kl, x, yy + 3);
        let vx = x + lw; if (r[2] && r[2].swatch) { swatch(r[2].swatch, vx + 1.8, yy + 2, 1.7); vx += 5.5; }
        font(r[2] && r[2].bold ? 'bold' : 'normal', fs, r[2] && r[2].col ? r[2].col : INK); const v = wrap(r[1], w - (vx - x)); txt(v, vx, yy + 3);
        yy += Math.max(v.length, kl.length, 1) * (fs * 0.46) + 1.5;
      });
      return yy - y0;
    }
    function karte(x, y0, w, titel, rows, opt) {
      opt = opt || {};
      const hh = Math.max(opt.minH || 0, karteH(rows, w, titel, opt));
      fill(opt.bg || '#ffffff'); stroke(opt.rand || LINE); doc.setLineWidth(0.3); rr(x, y0, w, hh, 3, 'FD');
      let yy = y0 + 5.2;
      if (titel) { eyebrow(titel, x + 4, yy, opt.titelCol || GREY); yy += 5.2; }
      if (opt.spalten === 2) { const m = Math.ceil(rows.length / 2), cw2 = (w - 8) / 2 - 2; zeilen(rows.slice(0, m), x + 4, yy, cw2, opt); zeilen(rows.slice(m), x + 4 + cw2 + 4, yy, cw2, opt); }
      else zeilen(rows, x + 4, yy, w - 8, opt);
      return hh;
    }
    function sektion(titel, sub) { platz(16); font('black', 16, INK); txt(titel, M, y); if (sub) { font('normal', 8.5, GREY); txt(sub, XR, y, { align: 'right' }); } stroke(INK); doc.setLineWidth(0.5); doc.line(M, y + 3, XR, y + 3); y += 10; }
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

    /* ---------- Aufbau nach Leserichtung (Begründung und Quellen: docs/GESTALTUNG.md, Abschnitt Aufmaßblatt) ----------
       Seite 1: Kopf mit Kennung, eine Zeile Zusammenfassung, der Weg (was schon erledigt ist, der eine nächste Schritt),
       daran angeschlossen die Box für den Fensterbauer, dann beginnt Position 1 – Seite 1 lässt sich nicht weglassen.
       Seite 2 unten: eeziframes für die eigenen Kunden des Fensterbauers. Danach je Position eine Seite, am Ende Überblick und Code. */
    const FS = 8.4;
    y = kopfband(true) + 11;
    const gebText = [h.lab('gebaeude', pr.gebaeude), pr.baujahr ? 'Baujahr ' + pr.baujahr : ''].filter(Boolean).join(', ');
    if (V === 'betrieb') {
      eyebrow('Aufmaß vom Kunden · fürs Angebot', M, y, BRAND); y += 8;
      font('black', 26, INK); txt(kd.name || 'Kunde', M, y + 2); y += 9;
      font('normal', 10.5, INK2); txt([kd.adresse, gebText].filter(Boolean).join(' · ') || 'Objekt ohne Adresse', M, y + 2); y += 9;
    } else {
      eyebrow(V === 'kunde' ? 'Dein Fenster-Aufmaß' : 'Fenster-Aufmaß Ihres Kunden', M, y); y += 8;
      font('black', 26, INK); txt(V === 'kunde' ? (pr.name ? pr.name + '.' : 'Dein Aufmaß.') : (pr.name || 'Aufmaß für Ihr Angebot') + '.', M, y + 2); y += 9;
      font('normal', 10.5, INK2); txt([pr.ort, gebText].filter(Boolean).join(' · ') || 'Selbst gemessen, Schritt für Schritt geführt', M, y + 2); y += 9;
    }
    /* Eine Zeile Zusammenfassung: Umfang und Vollständigkeit */
    let cx = M;
    [[wins.length + (wins.length === 1 ? ' Position' : ' Positionen'), INK, '#ffffff'], [nE + (nE === 1 ? ' Element' : ' Elemente'), PAPER, INK], [fotoText, PAPER, INK], [komplett ? 'alle Maße vollständig' : 'Maße teilweise offen', komplett ? '#e8f5ec' : '#fff4e5', komplett ? OK : WARN], ['alle Maße in mm', PAPER, INK]].forEach((c) => { cx += chip(c[0], cx, y, c[1], c[2], 8) + 2.5; });
    y += 12;
    const kontaktZ = [['Name', pr.name || '–'], ['Ort', pr.ort || '–'], ['Telefon', pr.tel || '–'], ['E-Mail', pr.mail || '–'], ['Erreichbar', ERREICH[pr.erreich] || '–']].filter((r) => r[1] !== '–');
    /* Die Nachricht steht auf Seite 1 höchstens dreizeilig, damit Position 1 dort in jedem Fall Platz hat; ist sie länger, steht sie vollständig nach Position 1 */
    const ekWert = (V !== 'betrieb' ? CW - 82 - 5 : (CW - 5) / 2) - 8 - (V !== 'betrieb' ? 25 : 26) - 4;
    let nachricht = pr.notiz ? '„' + pr.notiz + '“' : '', nachrichtLang = false;
    if (nachricht) {
      font('normal', FS);
      if (wrap(nachricht, ekWert).length > 3) {
        const anhang = ' …“ (vollständig nach Pos. 1)';
        let s = wrap(nachricht, ekWert).slice(0, 3).join(' ');
        while (s.length > 1 && wrap(s + anhang, ekWert).length > 3) s = s.replace(/\s*\S+$/, '');
        nachricht = s.replace(/[\s,.;:–-]+$/, '') + anhang; nachrichtLang = true;
      }
    }
    const fw = A() ? A().foerdWeg(pr) : (pr.foerd ? 'offen' : '');
    /* Klärungsliste: oben als eine Zeile (höchstens drei Zeilen hoch, damit Position 1 auf Seite 1 bleibt), ausführlich nach Position 1 */
    const klAlle = A() && A().klaerung ? A().klaerung(wins, pr).map((r) => [r.k, r.v, r.art === 'pflicht' ? { bold: true } : null]) : [];
    let klKurz = '';
    if (klAlle.length) {
      font('bold', FS);
      const teile = A().klaerKurz(wins, pr), zeilenMax = nachricht ? 3 : 4;
      let n = teile.length; const txt = (k) => teile.slice(0, k).join(', ') + (k < teile.length ? ' und ' + (teile.length - k) + ' weitere' : '') + ' · Einzelheiten nach Pos. 1';
      while (n > 1 && wrap(txt(n), ekWert).length > zeilenMax) n--;
      klKurz = txt(n);
    }
    const eck = [['Gebäude', gebText || '–'], ['Fenster im Haus', num(pr.total) ? nE + ' von ' + pr.total + (nE > num(pr.total) / 3 ? ' · Lüftungskonzept erforderlich (DIN 1946-6)' : '') : '–'], ['Zeitraum', h.lab('zeit', pr.zeit) || '–'], ['Budget', (h.lab('budget', pr.budget) || '–') + (fw && fw !== 'keine' ? ' · Förderung: ' + (h.lab('foerdweg', fw) || fw) : '')]].concat(klKurz ? [['Zu klären', klKurz, { bold: true, col: WARN }]] : [], nachricht ? [['Nachricht', nachricht]] : []);
    if (V !== 'betrieb') {
      /* Der Weg: vier Schritte erledigt (Haken und Wort), der fünfte ist der nächste. Ehrlich gezählt: fehlt etwas, steht es offen da. */
      const fertigF = komplett, wegS = [
        { t: 'Fotografiert', d: nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ', von der KI gelesen' : 'ohne Fotos', ok: nF > 0 },
        { t: 'Gemessen', d: fertigF ? '8 Maße je Fenster, von Hand' : 'Maße teilweise offen', ok: fertigF },
        { t: 'Wünsche festgelegt', d: 'Teilung, Farbe, Glas, Extras', ok: wins.length > 0 },
        { t: 'Aufmaßblatt erstellt', d: 'am ' + heute, ok: true },
        { t: V === 'kunde' ? 'Jetzt senden' : 'Ihr Schritt: Angebot', d: V === 'kunde' ? 'an beliebig viele Fensterbauer, Angebote vergleichen' : 'auf Grundlage dieses Blatts', jetzt: true }
      ];
      const erledigt = wegS.filter((x) => x.ok).length, sw5 = CW / 5, r5 = 3.6, wy = y + 9;
      eyebrow((V === 'kunde' ? 'Dein Weg zu neuen Fenstern' : 'Was Ihr Kunde schon erledigt hat') + ' · ' + erledigt + ' von 5 Schritten erledigt', M, y + 1, INK2);
      wegS.forEach((x, i) => { if (i === 4) return; const x1 = M + i * sw5 + 2 * r5 + 1.5, x2 = M + (i + 1) * sw5 - 1.5; stroke(x.ok && (wegS[i + 1].ok || wegS[i + 1].jetzt) ? OK : LINE); doc.setLineWidth(0.7); dash(i === 3); doc.line(x1, wy, x2, wy); dash(false); });
      wegS.forEach((x, i) => {
        const x0 = M + i * sw5, mx = x0 + r5;
        if (x.jetzt) { fill('#ffffff'); stroke(INK); doc.setLineWidth(0.9); doc.circle(mx, wy, r5, 'FD'); fill(INK); doc.circle(mx, wy, 1.4, 'F'); }
        else if (x.ok) { fill(OK); doc.circle(mx, wy, r5, 'F'); stroke('#ffffff'); doc.setLineWidth(0.8); doc.lines([[1.2, 1.3], [2.4, -2.8]], mx - 1.7, wy + 0.1, [1, 1], 'S', false); }
        else { fill('#ffffff'); stroke(WARN); doc.setLineWidth(0.8); doc.circle(mx, wy, r5, 'FD'); font('black', 8, WARN); txt('!', mx, wy + 2.8, { align: 'center' }); }
        font('bold', 9, INK); txt(wrap(x.t, sw5 - 3)[0], x0, wy + 9);
        font('normal', 7.8, x.ok || x.jetzt ? INK2 : WARN); txt(wrap((x.ok ? 'Erledigt · ' : x.jetzt ? '' : 'Offen · ') + x.d, sw5 - 4).slice(0, 2), x0, wy + 13, { lineHeightFactor: 1.2 });
      });
      y = wy + 22;
      /* Links Eckdaten, rechts die Box für den Fensterbauer, mit einer Spitze am letzten Schritt angeschlossen */
      const fbW = 82, ekW = CW - fbW - 5, fbX = XR - fbW, oFb = { lw: 19, fs: 8 }, oEk = { lw: 25, fs: FS };
      const fbZeilen = (seite) => kontaktZ.concat([['Maße', 'in mm, Breite × Höhe, Ansicht von innen; Maueröffnung: kleinstes von drei Maßen'], ['Digital', '„Code vom Kunden einfügen“ in eeziframes, Code auf Seite ' + seite + '; die ersten 3 Projekte sind frei'], ['Danach', 'Angebot, vor der Fertigung Feinaufmaß vor Ort']]);
      const fbTitel = V === 'kunde' ? 'Für deinen Fensterbauer' : 'Für Sie als Fensterbauer';
      const hFb = karteH(fbZeilen(99), fbW, fbTitel, oFb), hEk = karteH(eck, ekW, 'x', oEk), hb = Math.max(hFb, hEk);
      karte(M, y, ekW, 'Eckdaten zum Projekt', eck, Object.assign({ minH: hb }, oEk));
      const by0 = y, sx = M + 4 * sw5 + r5;
      fbBox = () => {
        fill('#ffffff'); stroke(INK); doc.setLineWidth(0.4); rr(fbX, by0, fbW, hb, 3, 'FD');
        /* Spitze zum Schritt „an den Fensterbauer“ */
        fill('#ffffff'); doc.triangle(sx - 2.6, by0 + 0.25, sx + 2.6, by0 + 0.25, sx, by0 - 2.8, 'F'); stroke(INK); doc.line(sx - 2.6, by0, sx, by0 - 2.8); doc.line(sx, by0 - 2.8, sx + 2.6, by0);
        let yy = by0 + 5.2; eyebrow(fbTitel, fbX + 4, yy, INK); yy += 5.2;
        zeilen(fbZeilen(codeSeite), fbX + 4, yy, fbW - 8, oFb);
      };
      y += hb + 7;
    } else {
      const halb = (CW - 5) / 2, oB = { lw: 24, fs: FS };
      const kb = [['Kontakt', kd.kontakt || '–'], ['Objekt', kd.adresse || '–']];
      const hk = karte(M, y, halb, 'Ihr Kunde', kb, oB), he = karte(M + halb + 5, y, halb, 'Eckdaten zum Projekt', eck, { lw: 26, fs: FS });
      y += Math.max(hk, he) + 7;
    }

    const klTitel = V === 'kunde' ? 'Noch zu klären, dein Fensterbauer berät dich' : 'Mit dem Kunden zu klären', oKl = { lw: 30, fs: 8, bg: '#fff8eb', rand: '#efd9ad', titelCol: WARN };

    /* ---------- Positionen: Position 1 beginnt auf Seite 1 ---------- */
    /* Karte über die volle Breite; muss sie geteilt werden, gehen mindestens zwei Zeilen auf die nächste Seite, nie eine allein */
    function teilbar(rows, titel, titel2, o, hh) {
      if (y + hh > unten() && y + 30 < unten() && rows.length > 3) {
        let teil = [], rest = rows.slice();
        while (rest.length > 1 && y + karteH(teil.concat([rest[0]]), CW, titel, o) <= unten()) teil.push(rest.shift());
        if (rest.length < 2 && teil.length > 2) rest.unshift(teil.pop());
        if (teil.length) { karte(M, y, CW, titel, teil, o); y += karteH(teil, CW, titel, o) + 4; }
        neueSeite(); karte(M, y, CW, titel2, rest, o); y += karteH(rest, CW, 'x', o) + 4;
      } else { platz(hh); karte(M, y, CW, titel, rows, o); y += hh + 4; }
    }
    function position(w, i) {
      const d = h.derive(w), fa = rahmen(w, 'aussen'), fi = rahmen(w, 'innen'), n = num(w.anzahl) || 1;
      platz(70);
      /* Kopf wie eine Zeile im Lieferschein: Nummer, Raum, Art, Öffnung, Element */
      y += 7;
      fill(INK); rr(M, y - 7, 13, 13, 3); font('black', 11, '#ffffff'); txt(String(i + 1), M + 6.5, y + 0.6, { align: 'center' });
      font('black', 19, INK); txt(wrap(w.name || (ARTNAME[w.art] || 'Fenster') + ' ' + (i + 1), CW - 90)[0], M + 17, y + 0.4);
      /* Datenzeile: so viele Angaben, wie ganz hineinpassen (nach Wichtigkeit geordnet), nie mitten im Wort abgeschnitten */
      font('normal', 8.8, INK2);
      let datenZ = '', voll = false;
      [ARTNAME[w.art] || 'Fenster', oeffnungText(w).split(' · ').slice(0, 2).join(' · '), h.lab('etage', w.etage) || 'EG', n > 1 ? n + ' Stück' : '1 Stück', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : 'ohne Fotos', w.neu ? 'Neue Öffnung, Wunschmaße' : d.moW && d.elW ? 'alle 8 Handmaße' : 'Maße unvollständig'].forEach((teil) => { if (voll) return; const z = datenZ ? datenZ + ' · ' + teil : teil; if (tw(z) <= CW - 88) datenZ = z; else voll = true; });
      txt(datenZ, M + 17, y + 6.4);
      if (V === 'betrieb') {
        fill(BRAND); rr(XR - 66, y - 8, 66, 18, 3); font('bold', 6.8, '#ffffff'); alpha(0.9); txt('BESTELLMASS-VORSCHLAG', XR - 62, y - 3.2, { charSpace: 0.4 }); alpha(1); font('black', 12.5, '#ffffff'); txt(bestell(w), XR - 62, y + 3.4);
        font('normal', 6.8, '#ffffff'); alpha(0.9); txt('Öffnung minus ' + ab.seite + ' mm je Seite, minus ' + ab.oben + ' mm oben', XR - 62, y + 7.6); alpha(1);
      } else if (d.moW && d.moH) {
        font('bold', 7, INK2); txt(w.neu ? 'ROHBAUÖFFNUNG' : 'MAUERÖFFNUNG', XR, y - 3.4, { align: 'right', charSpace: 0.4 }); font('black', 12.5, MO_T); txt(th(d.moW) + ' × ' + th(d.moH) + ' mm', XR, y + 3.2, { align: 'right' });
        font('normal', 8.4, INK2); txt('Element ' + th(d.elW) + ' × ' + th(d.elH) + ' mm', XR, y + 7.6, { align: 'right' });
      }
      y += 13;
      /* Was unter der Zeichnung folgt, wird vorab gemessen: Karten, Lage auf dem Foto, KI, Notiz */
      const masse = [[w.neu ? 'Rohbauöffnung' : 'Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' + (w.neu ? ' (Wunsch)' : '') : 'noch nicht gemessen', { bold: true, col: MO_T }], ['Breiten', 'oben ' + th(w.mo && w.mo.wt) + ' · Mitte ' + th(w.mo && w.mo.wm) + ' · unten ' + th(w.mo && w.mo.wb)], ['Höhen', 'links ' + th(w.mo && w.mo.hl) + ' · Mitte ' + th(w.mo && w.mo.hm) + ' · rechts ' + th(w.mo && w.mo.hr)], w.neu ? ['Maßart', 'Wunschmaß des Kunden, Rohbau nach Statik'] : ['Außer Winkel', d.devW > 5 || d.devH > 5 ? 'bis ' + Math.max(d.devW, d.devH) + ' mm, kleinstes zählt' : 'unter 5 mm'], ['Element', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm, mit Rahmen' : 'noch nicht gemessen', { bold: true, col: EL }], ['Brüstung', num(w.bru) ? th(w.bru) + ' mm' : '–'], ['Laibung innen', num(w.laib) ? th(w.laib) + ' mm' : '–']].concat(V === 'betrieb' ? [['Bestellmaß', bestell(w), { bold: true, col: BRAND }]] : []);
      const OFF = { col: WARN };
      const glasT = (offen(w, 'glas') ? OT : h.lab('glas', w.glas) || '3-fach') + (offen(w, 'glasfn') ? ', Extras offen' : (w.glasfn || []).length ? ', ' + w.glasfn.map((g) => h.lab('glasfn', g) + (g === 'sicht' ? ' (' + h.orn(w.orn) + ')' : '')).join(', ') : '');
      const ausf = [['Element', ARTNAME[w.art] || 'Fenster'], ['Teilung', teilungText(w)], ['Öffnung', oeffnungText(w)], ['Form', h.lab('form', w.form) || 'Rechteck'], ['Material', offen(w, 'material') ? OT : h.lab('material', w.material) || 'Kunststoff', offen(w, 'material') ? OFF : null], ['Farbe außen', h.farbeZeile ? h.farbeZeile(w, 'aussen') : fa[0] + ' (' + fa[1] + ')' + (w.wunschA ? ', Wunsch: ' + w.wunschA : ''), { swatch: fa[2] }], ['Farbe innen', w.gleich ? fi[0] + ', wie außen' : h.farbeZeile ? h.farbeZeile(w, 'innen') : fi[0] + ' (' + fi[1] + ')' + (w.wunschI ? ', Wunsch: ' + w.wunschI : ''), { swatch: fi[2] }], ['Glas', glasT, offen(w, 'glas') || offen(w, 'glasfn') ? OFF : null], ['Sprossen', (w.bars || []).length ? (offen(w, 'spross') ? 'Art offen' : h.lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + h.lab('aufseite', w.aufSeite) + ')' : '')) + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'keine'], ['Griff', griffText(w)], ['Einbruchschutz', rcText(w)]]
        .concat(A() && A().absturzFrage(w) ? [['Absturzsicherung', A().absturzText(w), w.absturz ? null : OFF]] : [], A() && A().uwZiel(w, pr) ? [['Förderwert', A().uwText(A().uwZiel(w, pr)), { bold: true }]] : []);
      const extras = [['Sonnenschutz außen', sonneText(w)], ['Sonnenschutz innen', innenText(w)], ['Insektenschutz', offen(w, 'insekt') ? OT : h.lab('insekt', w.insekt) || 'keiner']].concat(istTuer(w) ? [['Schwelle', schwelleText(w)]].concat(w.art === 'balkon' ? [['Fußboden', (w.bt || {}).boden === 'neu' ? 'wird erneuert' : 'bleibt, wie er ist']] : []) : [['Fensterbank innen', bankText(w, 'fbi'), offen(w, 'fbi') ? OFF : null], ['Fensterbank außen', bankText(w, 'fba'), offen(w, 'fba') ? OFF : null]]).concat([['Montage', montageText(w)]]);
      const cw3 = (CW - 8) / 3, o3 = { lw: 21, fs: 8.2 }, karten = [['Maße', masse], ['Ausführung', ausf], ['Extras', extras]];
      const hs = karten.map((k) => karteH(k[1], cw3, k[0], o3)), hmax = Math.max.apply(null, hs);
      const mitBild = !!(w.neu && w.plan && w.plan.bild && /^data:image\/jpeg/.test(w.plan.bild));
      const bw0 = mitBild ? w.plan.bw || 3 : 3, bh0 = mitBild ? w.plan.bh || 4 : 4, iw2 = Math.min(CW - 8, 78 * bw0 / bh0), ih2 = iw2 * bh0 / bw0, bildH = ih2 + 14;
      /* Einbausituation aus den Fotos: Befunde, Hinweise für Angebot und Montage, Prüfpunkte fürs Feinaufmaß */
      const ki = w.ki && w.ki.rows ? w.ki.rows : [], hints = w.ki && w.ki.hints ? w.ki.hints : [], pruefen = w.ki && w.ki.pruefen ? w.ki.pruefen : [];
      const fz = A() ? A().fachZeile(w) : '', mz = A() ? A().massZeile(w) : '', mp = A() ? A().massPruef(w) : null;
      const kiRows = (fz ? [['Auf einen Blick', fz, { bold: true }]] : []).concat(mz ? [['Maße und Foto', mz, mp ? { bold: true, col: WARN } : null]] : [], ki.map((r) => [r[0], r[1]]), hints.map((hh2, k) => ['Hinweis ' + (k + 1), hh2, { bold: true, col: WARN }]), pruefen.map((t) => ['Vor Ort prüfen', t]));
      const kiTitel = 'Einbausituation aus den Fotos (KI, ' + (w.fotos || 0) + (w.fotos === 1 ? ' Foto' : ' Fotos') + ')', o2 = { lw: 25, fs: 8.2, spalten: 2, bg: '#eef5fd', rand: '#cfe0f5', titelCol: '#0a5bb5' };
      const kiH = kiRows.length ? karteH(kiRows, CW, kiTitel, o2) : 0;
      /* Weitere Ausstattung: nur die Detailangaben, die gewählt sind (sonst gilt der Standard des Fensterbauers), zweispaltig und teilbar */
      const detRows = A() && A().detailRows ? A().detailRows(w) : [], detTitel = 'Weitere Ausstattung', oD = { lw: 34, fs: 8.2, spalten: 2 };
      const detH = detRows.length ? karteH(detRows, CW, detTitel, oD) : 0;
      const notizRows = w.notiz ? [[sie ? 'Notiz des Kunden' : 'Deine Notiz', '„' + w.notiz + '“']] : [], oN = { lw: 26, fs: FS, bg: '#fffbe8', rand: '#f2e2a4' };
      const notizH = notizRows.length ? karteH(notizRows, CW, '', oN) : 0;
      /* Fotos des Kunden (innen, außen), so wie sie angekommen sind: nebeneinander, gleich hoch (e.fotos: Kennung → { data, w, h }) */
      const fotos = ['in', 'out'].map((s2) => ({ s: s2, f: w.bilder && e.fotos ? e.fotos[w.bilder[s2]] : null })).filter((x) => x.f && /^data:image\/jpeg/.test(String(x.f.data || '')) && x.f.w > 0 && x.f.h > 0);
      const FH = 56, fotoH = fotos.length ? FH + 15 : 0;
      let nach = hmax, luecke = 5;
      if (detH) { nach += luecke + detH; luecke = 4; }
      if (mitBild) { nach += luecke + bildH + 2; luecke = 4; }
      if (fotoH) { nach += luecke + fotoH; luecke = 4; }
      if (kiH) { nach += luecke + kiH; luecke = 4; }
      if (notizH) nach += luecke + notizH;
      /* Zeichnung über die volle Breite, so hoch wie Platz ist (78 bis 108 mm, auf Seite 1 notfalls 64 mm, damit sie nie in den Fuß ragt).
         Passt die ganze Position mit einer kleineren Zeichnung auf die Seite, wird die Zeichnung kleiner, statt einen Rest allein auf die nächste Seite zu schieben. */
      const minZ = seiteNr() === 1 ? 64 : 78, ganz = unten() - y - 5 - nach;
      let zh = Math.max(minZ, Math.min(108, unten() - y - 4));
      if (ganz < zh && ganz >= minZ) zh = ganz;
      fill(PAPER); rr(M, y, CW, zh, 4);
      font('normal', 7.4, INK2); txt('Alle Maße in mm · Breite × Höhe · Ansicht von innen', M + 5, y + 5.2);
      zeichnung(w, M + 2, y + 3, CW - 4, zh - 10, true);
      font('normal', 7.4, INK2); swatch(MO, M + 6, y + zh - 4.4, 1.4); txt(w.neu ? 'Rohbauöffnung, Wunschmaß' : 'Maueröffnung, von Hand', M + 9, y + zh - 3.4); swatch(EL, M + 52, y + zh - 4.4, 1.4); txt((istTuer(w) ? 'Türelement' : 'Element') + ' mit Rahmen (Beschriftung „Element“)', M + 55, y + zh - 3.4);
      const hinweise = [w.neu ? 'Sturz und Statik prüfen' : '', w.richtung === 'aussen' && !istTuer(w) ? 'gestrichelt: öffnet nach außen' : '', num(w.laib) ? 'Laibung ' + th(w.laib) : '', num(w.wand) ? 'Wand ' + th(w.wand) : '', h.lab('anschlag', w.anschlag) && w.anschlag !== 'ohne' ? h.lab('anschlag', w.anschlag) : ''].filter(Boolean).join(' · ');
      if (hinweise) txt(hinweise, XR - 6, y + 5.2, { align: 'right' });
      if (d.devW > 5 || d.devH > 5) { font('bold', 7.4, WARN); txt('bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel, das kleinste Maß zählt', XR - 6, y + zh - 3.4, { align: 'right' }); }
      y += zh + 5;
      /* Drei Karten nebeneinander */
      platz(hmax);
      karten.forEach((k, j) => { const x = M + j * (cw3 + 4); karte(x, y, cw3, k[0], k[1], o3); });
      y += hmax + 5;
      if (detRows.length) teilbar(detRows, detTitel, 'Weitere Ausstattung, Fortsetzung', oD, detH);
      /* Neue Öffnung: das Foto mit der eingezeichneten Lage */
      if (mitBild) {
        platz(bildH + 2);
        fill(PAPER); rr(M, y, CW, bildH, 4);
        font('bold', 7, INK2); txt('LAGE AUF DEM FOTO', M + 5, y + 5.2, { charSpace: 0.4 }); font('normal', 7.6, INK2); txt((sie ? 'vom Kunden' : 'von dir') + ' eingezeichnet, Foto ' + (w.plan.seite === 'out' ? 'von außen' : 'von innen'), XR - 5, y + 5.2, { align: 'right' });
        try { doc.addImage(w.plan.bild, 'JPEG', M + (CW - iw2) / 2, y + 8.5, iw2, ih2); } catch (err) { /* ohne Bild weiter */ }
        y += bildH + 4;
      }
      if (fotos.length) {
        platz(fotoH + 2);
        fill(PAPER); rr(M, y, CW, fotoH, 4);
        font('bold', 7, INK2); txt(sie ? 'FOTOS DES KUNDEN' : 'DEINE FOTOS', M + 5, y + 5.2, { charSpace: 0.4 }); font('normal', 7.6, INK2); txt(kiRows.length ? 'daraus die Einbausituation unten' : sie ? 'vom Kunden aufgenommen' : 'von dir aufgenommen', XR - 5, y + 5.2, { align: 'right' });
        const zw = (CW - 16) / 2;
        fotos.forEach((x, k) => {
          const fx = M + 5 + k * (zw + 6), r = x.f.w / x.f.h; let iw = zw, ih = iw / r; if (ih > FH) { ih = FH; iw = ih * r; }
          try { doc.addImage(x.f.data, 'JPEG', fx + (zw - iw) / 2, y + 8.5 + (FH - ih) / 2, iw, ih); } catch (err) { /* ohne Bild weiter */ }
          font('bold', 7.2, INK2); txt(x.s === 'in' ? 'Von innen' : 'Von außen', fx + zw / 2, y + 8.5 + FH + 4.4, { align: 'center' });
        });
        y += fotoH + 4;
      }
      /* Aus den Fotos */
      if (kiRows.length) teilbar(kiRows, kiTitel, 'Einbausituation (KI), Fortsetzung', o2, kiH);
      if (notizRows.length) { platz(notizH); karte(M, y, CW, '', notizRows, oN); y += notizH + 4; }
    }

    /* ---------- Überblick (ab zwei Positionen): Tabelle, Ausstattung, alle im selben Maßstab ---------- */
    const cols = V === 'betrieb' ? [['Pos.', 9], ['Fenster', 34], ['Öffnung', 23], ['Element', 23], ['Bestellmaß', 24], ['Öffnungsart', 27], ['Farbe außen', 28], ['Stk.', 10]] : [['Pos.', 9], ['Fenster', 40], ['Öffnung', 25], ['Element', 25], ['Öffnungsart', 28], ['Farbe außen', 30], ['Glas', 13], ['Stk.', 8]];
    const colX = []; let ax = M; cols.forEach((c) => { colX.push(ax); ax += c[1]; });
    const zellen = (w) => { const d = h.derive(w), fa = rahmen(w, 'aussen'); return V === 'betrieb'
      ? [String(0), '', (d.moW ? th(d.moW) + ' × ' + th(d.moH) : '–'), (d.elW ? th(d.elW) + ' × ' + th(d.elH) : '–'), bestell(w).replace(' mm', ''), oeffnungText(w), fa[0], String(num(w.anzahl) || 1)]
      : [String(0), '', (d.moW ? th(d.moW) + ' × ' + th(d.moH) : '–'), (d.elW ? th(d.elW) + ' × ' + th(d.elH) : '–'), oeffnungText(w), fa[0], offen(w, 'glas') ? 'offen' : h.lab('glas', w.glas) || '3-fach', String(num(w.anzahl) || 1)]; };
    const fIdx = V === 'betrieb' ? 6 : 5;
    const zeileH = (w) => { font('normal', 8.2); const lines = zellen(w).map((c, k) => wrap(c, cols[k][1] - (k === fIdx ? 7 : 3))); return Math.max(12, Math.max.apply(null, lines.map((l) => l.length)) * 3.6 + 5); };
    const legendeText = 'Maueröffnung: von drei Breiten und drei Höhen zählt das kleinste Maß; Abweichungen stehen bei der Position. Element: das sichtbare Fenster mit Rahmen. Öffnungssymbole: Linien beginnen an der Bandseite, die Spitze zeigt zum Griff; Dreieck mit Spitze oben = Kipp. ' + (V === 'betrieb' ? 'Bestellmaß: Vorschlag aus Ihrem Abzug, verbindlich bleibt Ihr Feinaufmaß.' : 'Das Bestellmaß legt der Fensterbauer beim Feinaufmaß fest.');
    const uebersichtH = () => { font('normal', 7.6); return 13 + wins.reduce((a, w) => a + zeileH(w), 0) + 4 + wrap(legendeText, CW).length * 3.3 + 8; };
    function uebersicht() {
      sektion('Übersicht', wins.length + ' Positionen · ' + nE + (nE === 1 ? ' Element' : ' Elemente') + (V === 'betrieb' ? ' · Bestellmaß = Öffnung minus Abzug' : ' · alle Maße in mm'));
      const tabKopf = () => { font('bold', 7.2, INK2); cols.forEach((c, k) => txt(c[0].toUpperCase(), colX[k] + (k === cols.length - 1 ? c[1] - 1 : 0), y, { align: k === cols.length - 1 ? 'right' : 'left', charSpace: 0.3 })); y += 2; stroke(INK); doc.setLineWidth(0.5); doc.line(M, y, XR, y); y += 1; };
      tabKopf();
      wins.forEach((w, i) => {
        const fa = rahmen(w, 'aussen'), cells = zellen(w); cells[0] = String(i + 1);
        font('normal', 8.2); const lines = cells.map((c, k) => wrap(c, cols[k][1] - (k === fIdx ? 7 : 3))), rh = zeileH(w);
        if (y + rh > unten()) { neueSeite(); tabKopf(); }
        if (i % 2 === 0) { fill('#fafafa'); doc.rect(M, y, CW, rh, 'F'); }
        const ty = y + rh / 2 + 1.2;
        font('black', 9.4, INK); txt(String(i + 1), colX[0] + 1, ty);
        mini(w, colX[1], y + (rh - 8.5) / 2, 8.5);
        font('bold', 8.4, INK); txt(wrap(w.name || 'Fenster', cols[1][1] - 13)[0], colX[1] + 11, ty - 1.6);
        font('normal', 7.2, INK2); txt([h.lab('etage', w.etage) || 'EG', num(w.bru) ? 'Brüstung ' + th(w.bru) : '', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : ''].filter(Boolean).join(' · '), colX[1] + 11, ty + 2.2);
        cells.forEach((c, k) => {
          if (k < 2) return;
          const bold = (V === 'betrieb' && k === 4) || k === 2, last = k === cells.length - 1, ly = ty - (lines[k].length - 1) * 1.8;
          font(bold ? 'bold' : 'normal', 8.2, V === 'betrieb' && k === 4 ? BRAND : k === 2 ? MO_T : INK);
          if (k === fIdx) { swatch(fa[2], colX[k] + 1.6, ty - 1, 1.5); txt(lines[k], colX[k] + 4.4, ly); }
          else txt(lines[k], colX[k] + (last ? cols[k][1] - 1 : 0), ly, { align: last ? 'right' : 'left' });
        });
        y += rh; stroke(LINE); doc.setLineWidth(0.2); doc.line(M, y, XR, y);
      });
      y += 4;
      font('normal', 7.6, INK2); const lg = wrap(legendeText, CW); txt(lg, M, y + 2.5, { lineHeightFactor: 1.25 }); y += lg.length * 3.3 + 8;
    }
    function ausstattung() {
      const halb = (CW - 5) / 2;
      const gleich = (fn, sonst) => { const v = wins.map(fn); return v.length && v.every((x) => x === v[0]) ? v[0] : (sonst || 'unterschiedlich, siehe Positionen'); };
      const flaeche = wins.reduce((a, x) => { const d = h.derive(x); return a + (d.elW && d.elH ? d.elW * d.elH / 1e6 * (num(x.anzahl) || 1) : 0); }, 0);
      const groesste = wins.reduce((best, x) => { const d = h.derive(x); return !best || d.elW * d.elH > best.a ? { a: d.elW * d.elH, n: x.name || 'Fenster', d: d } : best; }, null);
      const etagen = wins.map((x) => h.lab('etage', x.etage) || 'EG').filter((v, k, a) => a.indexOf(v) === k).join(', ');
      const ausst = [['Material', gleich((x) => (offen(x, 'material') ? 'offen' : h.lab('material', x.material) || 'Kunststoff'))], ['Farbe außen', gleich((x) => rahmen(x, 'aussen')[0] + (rahmen(x, 'aussen')[0].indexOf(rahmen(x, 'aussen')[1]) < 0 ? ' (' + rahmen(x, 'aussen')[1] + ')' : ''))], ['Farbe innen', gleich((x) => rahmen(x, 'innen')[0])], ['Glas', gleich((x) => (offen(x, 'glas') ? 'offen' : h.lab('glas', x.glas) || '3-fach') + (offen(x, 'glasfn') ? ', Extras offen' : (x.glasfn || []).length ? ', ' + x.glasfn.map((g) => h.lab('glasfn', g)).join(', ') : ''))], ['Sprossen', gleich((x) => ((x.bars || []).length ? (offen(x, 'spross') ? 'Art offen' : h.lab('spross', x.spross)) : 'keine'))], ['Sonnenschutz außen', gleich((x) => sonneText(x))], ['Sonnenschutz innen', gleich((x) => innenText(x))], ['Insektenschutz', gleich((x) => (offen(x, 'insekt') ? 'offen' : h.lab('insekt', x.insekt) || 'keiner'))], ['Fensterbank', gleich((x) => (istTuer(x) ? 'Tür, Schwelle ' + schwelleText(x) : 'innen ' + bankText(x, 'fbi') + ', außen ' + bankText(x, 'fba')))], ['Montage', gleich((x) => montageText(x))]];
      const zahlen = [['Positionen', String(wins.length)], ['Elemente', String(nE)], ['Fensterfläche', flaeche ? 'etwa ' + flaeche.toFixed(1).replace('.', ',') + ' m² (Element, alle Stück)' : '–'], ['Größtes Element', groesste && groesste.d.elW ? groesste.n + ', ' + th(groesste.d.elW) + ' × ' + th(groesste.d.elH) + ' mm' : '–'], ['Geschosse', etagen || '–'], ['Fotos', nF ? nF + ', von der KI ausgewertet' : 'keine'], ['Maße', komplett ? 'alle 8 Handmaße je Fenster' : wins.filter((x) => { const d = h.derive(x); return !(d.moW && d.elW); }).length + ' Position(en) ohne vollständige Maße', { col: komplett ? OK : WARN, bold: true }]].concat(V === 'betrieb' ? [['Ihr Abzug', ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben']] : []);
      const oA = { lw: 27, fs: FS }, oZ = { lw: 28, fs: FS }, ha = karteH(ausst, halb, 'x', oA), hz = karteH(zahlen, halb, 'x', oZ);
      platz(Math.max(ha, hz));
      karte(M, y, halb, 'Ausstattung im Überblick', ausst, oA); karte(M + halb + 5, y, halb, 'Zahlen', zahlen, oZ);
      y += Math.max(ha, hz) + 6;
    }
    /* Alle Elemente im selben Maßstab */
    const massstabMasse = () => { const maxH = wins.reduce((a, x) => Math.max(a, h.derive(x).elH || 1200), 0), maxW = wins.reduce((a, x) => Math.max(a, h.derive(x).elW || 1000), 0), perRow = Math.min(wins.length, 6), slot = (CW - 8) / perRow, zeilenN = Math.ceil(wins.length / perRow), sc = Math.min(30 / maxH, (slot - 10) / maxW), rowH = maxH * sc + 17; return { maxH: maxH, perRow: perRow, slot: slot, sc: sc, rowH: rowH, gh: 12 + zeilenN * rowH + 2 }; };
    const massstabH = () => massstabMasse().gh + 6;
    function massstab() {
      const mm = massstabMasse(), maxH = mm.maxH, perRow = mm.perRow, slot = mm.slot, sc = mm.sc, rowH = mm.rowH, gh = mm.gh;
      platz(gh);
      fill('#ffffff'); stroke(LINE); doc.setLineWidth(0.3); rr(M, y, CW, gh, 3, 'FD');
      eyebrow('Alle Elemente im selben Maßstab', M + 4, y + 5.2, INK2);
      wins.forEach((w, k) => {
        const d = h.derive(w), ww = (d.elW || 1000) * sc, wh = (d.elH || 1200) * sc, r = Math.floor(k / perRow), c = k % perRow;
        const cx0 = M + 4 + c * slot + slot / 2, base = y + 10 + r * rowH + maxH * sc;
        ansicht(w, cx0 - ww / 2, base - wh, ww, wh);
        font('bold', 7.6, INK); txt(wrap((k + 1) + ' · ' + (w.name || 'Fenster'), slot - 4)[0], cx0, base + 4.4, { align: 'center' });
        font('normal', 7.2, INK2); txt(d.elW ? th(d.elW) + ' × ' + th(d.elH) + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stk.' : '') : 'Maße offen', cx0, base + 8, { align: 'center' });
      });
      y += gh + 6;
    }
    /* Aufmaß-Code mit der Anleitung zum Übernehmen (für Fensterbauer, die eeziframes nutzen möchten) */
    function codeTeil() {
      if (!e.code && !e.beispiel) return;
      platz(70);
      codeSeite = seiteNr();
      sektion('Aufmaß digital übernehmen', 'für Fensterbauer, kostenlos bis 3 Projekte');
      const qs = 28, qx = XR - qs;
      [['Kostenlos registrieren', HOST + ' oder den QR-Code scannen'], ['„Code vom Kunden einfügen“', 'den Aufmaß-Code unten einsetzen, Leerzeichen und Umbrüche stören nicht'], ['Projekt ist da', 'mit Positionen, 3-D-Ansicht und Bestellmaß nach Ihrem Abzug']].forEach((st, k) => { fill(INK); doc.circle(M + 4, y + 4 + k * 10.5, 4, 'F'); font('black', 9, '#ffffff'); txt(String(k + 1), M + 4, y + 5.4 + k * 10.5, { align: 'center' }); font('bold', 9.2, INK); txt(st[0], M + 11, y + 3.4 + k * 10.5); font('normal', 8, INK2); txt(st[1], M + 11, y + 7.6 + k * 10.5); });
      qr(qx, y - 2, qs); font('normal', 7.2, INK2); txt('Scannen: Anmeldung', qx + qs / 2, y + qs + 2, { align: 'center' });
      y += 36;
      if (!e.code) { fill(PAPER); rr(M, y, CW, 17, 3); eyebrow('Aufmaß-Code für eeziframes', M + 4, y + 5.6, INK); font('normal', 8.2, INK2); txt('Im echten Aufmaßblatt steht hier der Aufmaß-Code. In diesem Beispiel bleibt er leer.', M + 4, y + 11.6); y += 20; return; }
      /* Courier, damit sich der Code aus jedem PDF-Programm sauber kopieren lässt */
      font('mono', 6.2); const zeilen2 = doc.splitTextToSize(e.code, CW - 8), zh2 = 2.7;
      let k = 0, erster = true;
      while (k < zeilen2.length) {
        const frei = Math.floor((unten() - y - (erster ? 12 : 8)) / zh2);
        if (frei < 6) { neueSeite(); continue; }
        const teil = zeilen2.slice(k, k + frei), hh = teil.length * zh2 + (erster ? 12 : 8);
        fill(PAPER); rr(M, y, CW, hh, 3);
        if (erster) { eyebrow('Aufmaß-Code für eeziframes', M + 4, y + 5.2, INK); font('normal', 7.2, INK2); txt('Enthält Maße, Wünsche und Fotoauswertung aller Positionen. Als Text markieren und kopieren.', XR - 4, y + 5.2, { align: 'right' }); }
        font('mono', 6.2, '#3a3a3f'); let cy2 = y + (erster ? 10.6 : 6);
        teil.forEach((z) => { txt(z, M + 4, cy2); cy2 += zh2; });
        y += hh + 3; k += teil.length; erster = false;
      }
    }
    /* Seite 2 unten, für Fensterbauer: eeziframes für die eigenen Kunden. Gestaltet wie normaler Inhalt, nicht wie Werbung. */
    function eigeneKunden(y0) {
      fill(PAPER); stroke(LINE); doc.setLineWidth(0.3); rr(M, y0, CW, EIGENE_H, 3.5, 'FD');
      const qs = 25, qx = XR - qs - 5, qy = y0 + 5, tx = M + 5, tw2 = qx - tx - 6;
      eyebrow('Für Fensterbauer · Aufmaße Ihrer eigenen Kunden', tx, y0 + 6.6, INK);
      font('black', 11.5, INK); const t1 = wrap('Ihre Kunden messen selbst. Sie fahren erst zum Feinaufmaß.', tw2); txt(t1, tx, y0 + 12.8, { lineHeightFactor: 1.1 });
      let yy = y0 + 12.8 + t1.length * 4.6 + 0.6;
      font('normal', 8, INK2); const t2 = wrap('Projekt in eeziframes anlegen, Aufmaß-Link per WhatsApp oder E-Mail schicken. Zurück kommt ein Aufmaß wie dieses: 8 Maße je Fenster, Fotos mit Auswertung, alle Wünsche, Bestellmaß nach Ihrem Abzug, das Blatt mit Ihrem Logo.', tw2); txt(t2, tx, yy, { lineHeightFactor: 1.22 }); yy += t2.length * 3.45 + 1.6;
      font('bold', 8, INK); txt('3 Projekte kostenlos · danach 9 € netto je Projekt mit eingegangenem Aufmaß · keine Grundgebühr', tx, yy); yy += 4.2;
      font('normal', 7, GREY); txt(wrap('Zum Vergleich: Eine Meisterstunde kostet im Schnitt 65,14 € netto (Preisatlas Handwerk 2024).', tw2)[0], tx, yy);
      qr(qx, qy, qs); font('normal', 7, INK2); txt('Scannen: Projekt anlegen', qx + qs / 2, qy + qs + 3.4, { align: 'center' }); font('bold', 7, INK); txt(HOST, qx + qs / 2, qy + qs + 6.8, { align: 'center' });
    }

    if (wins.length) position(wins[0], 0);
    else { font('normal', 10, GREY); txt('Noch kein Fenster erfasst.', M, y + 6); y += 12; }
    /* Klärungsliste nach Position 1: passt sie nicht mehr auf diese Seite, aber auf eine neue, dorthin; ist sie länger als eine Seite,
       wird sie geteilt (nie eine Zeile allein, Titel „Fortsetzung“) */
    if (klAlle.length) {
      const frisch = BOTTOM - 19, ganz = karteH(klAlle, CW, klTitel, oKl);
      let rest = klAlle.slice(), titel = klTitel;
      if (y + ganz > unten() && (ganz <= frisch || unten() - y < 40)) neueSeite();
      while (rest.length) {
        const teil = [];
        while (rest.length && y + karteH(teil.concat([rest[0]]), CW, titel, oKl) <= unten()) teil.push(rest.shift());
        if (rest.length === 1 && teil.length > 2) rest.unshift(teil.pop());
        if (!teil.length) teil.push(rest.shift());
        const hk2 = karteH(teil, CW, titel, oKl); karte(M, y, CW, titel, teil, oKl); y += hk2 + 4;
        titel = klTitel + ', Fortsetzung';
        if (rest.length) neueSeite();
      }
    }
    /* Lange Nachricht: auf Seite 1 gekürzt, hier vollständig */
    if (nachrichtLang) { const rows = [[sie ? 'Nachricht des Kunden' : 'Deine Nachricht', '„' + pr.notiz + '“']], oM = { lw: 26, fs: FS, bg: '#fffbe8', rand: '#f2e2a4' }, hM = karteH(rows, CW, '', oM); platz(hM); karte(M, y, CW, '', rows, oM); y += hM + 4; }
    /* Seite 2 gibt es immer (unten steht die Box für Fensterbauer); passt der Überblick noch darüber, steht er dort */
    if (EIGENE && doc.getNumberOfPages() < 2) neueSeite();
    let ueberblickDa = false;
    /* Was auf der Seite nach Position 1 noch Platz hat (Seite 2 über der Box, oder die Seite mit der Klärungsliste):
       zuerst die Übersicht, sonst alle Elemente im selben Maßstab. Position 2 beginnt danach auf einer neuen Seite. */
    let massstabDa = false;
    if (wins.length > 1 && seiteNr() >= 2) {
      /* Abstand zur Karte darüber: die Überschrift steht auf der Grundlinie y */
      if (y + 7 + uebersichtH() <= unten()) { y += 7; uebersicht(); ueberblickDa = true; }
      if (y + massstabH() <= unten()) { massstab(); massstabDa = true; }
    }
    wins.slice(1).forEach((w, k) => { neueSeite(); position(w, k + 1); });
    if (wins.length > 1) { if (!ueberblickDa) { neueSeite(); uebersicht(); } ausstattung(); if (!massstabDa) massstab(); }
    if (EIGENE) { if (seiteNr() < 3 || y + 80 > unten()) neueSeite(); codeTeil(); }

    fuss();
    return doc.output('blob');
  }
  return { pdf: pdf, schrift: schrift };
})();

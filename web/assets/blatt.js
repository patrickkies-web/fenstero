'use strict';
/* eeziframes · Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben
   Blatt.pdf(e)      -> Blob (null, wenn jsPDF oder das Modell fehlt)
   Blatt.schrift()   -> Promise; lädt vor dem ersten Blatt jsPDF, den QR-Code und die eingebettete Schrift (blatt-schrift.js) einmal nach,
                        danach sofort; vor jedem Blatt.pdf() abwarten

   e = {
     variante: 'kunde' | 'fensterbauer' | 'betrieb',
        kunde:        das Blatt des Hauseigentümers für seine Unterlagen (Du), mit Seite für den Fensterbauer am Ende
        fensterbauer: dasselbe Aufmaß, so wie es der Hauseigentümer einem Betrieb schickt (Sie), mit Seite für den Fensterbauer
        betrieb:      aus dem Betriebsbereich, mit Namen und Logo des Betriebs, Bestellmaß-Vorschlag und Stand der Klärungsliste, ohne Werbung
     fenster: [Fenster wie in der App], projekt: { name, ort, tel, mail, erreich, gebaeude, baujahr, total, zeit, budget, foerd, foerdweg, notiz, notizen },
     kunde: { name, kontakt, adresse, mehr: [[Beschriftung, Wert]] (vom Kunden eingetragen: Telefon, E-Mail, Erreichbar) } (betrieb), betrieb: { name, logo: { data, w, h, grund }, abzug: { seite, oben, unten, untenT }, nr, eingegangen } (betrieb),
     klaerung: [Punkte aus AW.klaerung] (betrieb, sonst gerechnet), klaerStand: { id: { ok, notiz, wann } } (betrieb),
     code, portalUrl, portalKurz, qr: window.qrcode (für die Seite an den Fensterbauer), fotos: { Kennung: { data, w, h } }, beispiel,
     h: { derive(w), lab(gruppe, key), … } (ältere Aufrufer; gerechnet wird mit window.AW aus modell.js)
   }
   Gestaltung (docs/GESTALTUNG.md, Aufmaßblatt): weißes Papier, Tinte #161616, Kopfband in der Farbe der Bühne #161616 mit Namen und
   Logo des Betriebs bzw. der Marke, Inter 500/700/800, Kicker in Versalien, grüne Haken, Chips mit Rand, Karten mit Rand ohne Fläche,
   Orange und Blau nur in der Zeichnung. Aufbau: Seite 1 Übersicht und Klärungsliste, danach je Position eine Seite (Zeichnung mit
   Maßketten aus AW.plan, Maße, Wünsche, Einbausituation, Fotos), am Ende Überblick, Tabelle und (für Hauseigentümer) der Aufmaß-Code. */
window.Blatt = (() => {
  const W = 210, H = 297, M = 14, BOTTOM = H - 16;
  /* Druckpalette */
  const INK = '#161616', INK2 = '#3a3a3f', GREY = '#68686d', LINE = '#d9d9de', BUEHNE = '#161616', HELL = '#f1f0ea', HELL2 = '#b9b8b3', GRUEN = '#8fd694', GRUEN_T = '#2e7d3a', WARN = '#a85a00', WARN_P = '#f0b35a', MO_T = '#b3401e', EL_T = '#3d63c9', MO = '#ff8a5b', EL = '#7aa2ff', GLASS = '#d6e6f4';
  const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); const n = m ? parseInt(m[1], 16) : 0; return [n >> 16, (n >> 8) & 255, n & 255]; };
  /* Zeichen, die Inter im eingebetteten Ausschnitt nicht hat, werden ersetzt */
  const t = (s) => (Array.isArray(s) ? s.map(t) : String(s == null ? '' : s).replace(/[    ]/g, ' ').replace(/[‐‑‒]/g, '-').replace(/­/g, '').replace(/≥/g, 'ab ').replace(/≤/g, 'bis ').replace(/[←-↓]/g, '-').replace(/✓/g, ''));
  const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
  const ARTNAME = { fenster: 'Fenster', balkon: 'Balkontür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
  const A = () => window.AW || null;
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
    const J = window.jspdf && window.jspdf.jsPDF, AW = A(); if (!J || !AW) return null;
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const V = e.variante || 'kunde', wins = e.fenster || [], pr = e.projekt || {}, kd = e.kunde || {}, bt = e.betrieb || {}, ab = AW.abzugVon(bt.abzug);
    const sie = V !== 'kunde', EIGENE = V !== 'betrieb', STREIFEN = EIGENE ? 8 : 0, XR = W - (EIGENE ? 18 : 14), CW = XR - M;
    /* Adresse der Website: die, unter der eeziframes gerade läuft (nach einem Domainwechsel stimmt sie von selbst) */
    const HOST = e.portalKurz || (typeof location !== 'undefined' && location.host) || 'eeziframes';
    /* Schrift: Inter wie auf der Website (500 Text, 700 Listen, 800 Überschriften), sonst Helvetica */
    const F = window.BlattSchrift && window.BlattSchrift.medium ? (() => {
      try {
        doc.addFileToVFS('Inter-Medium.ttf', window.BlattSchrift.medium); doc.addFont('Inter-Medium.ttf', 'InterMedium', 'normal');
        doc.addFileToVFS('Inter-Bold.ttf', window.BlattSchrift.bold); doc.addFont('Inter-Bold.ttf', 'InterBold', 'normal');
        doc.addFileToVFS('Inter-ExtraBold.ttf', window.BlattSchrift.extra); doc.addFont('Inter-ExtraBold.ttf', 'InterExtraBold', 'normal');
        return { extra: ['InterExtraBold', 'normal'], bold: ['InterBold', 'normal'], normal: ['InterMedium', 'normal'], mono: ['courier', 'normal'] };
      } catch (err) { return null; }
    })() : null;
    const FONTS = F || { extra: ['helvetica', 'bold'], bold: ['helvetica', 'bold'], normal: ['helvetica', 'normal'], mono: ['courier', 'normal'] };
    const font = (k, size, color) => { const f = FONTS[k] || FONTS.normal; doc.setFont(f[0], f[1]); if (size) doc.setFontSize(size); if (color) doc.setTextColor.apply(doc, rgb(color)); };
    const fill = (c) => doc.setFillColor.apply(doc, rgb(c)), stroke = (c) => doc.setDrawColor.apply(doc, rgb(c));
    const tw = (s) => doc.getTextWidth(t(s));
    const wrap = (s, w) => doc.splitTextToSize(t(s), Math.max(4, w));
    /* Beschriftungen: ein langes zusammengesetztes Wort, das nicht in die Spalte passt, an der Fuge trennen statt mitten im Wort */
    const FUGE = { Absturzsicherung: 'Absturz', Einbruchschutz: 'Einbruch', Insektenschutz: 'Insekten', Sonnenschutz: 'Sonnen', Fensterbank: 'Fenster', Förderwert: 'Förder', Maueröffnung: 'Mauer', Rohbauöffnung: 'Rohbau', Fensterbänke: 'Fenster', Insektenschutzgewebe: 'Insekten', Rollladenpanzer: 'Rollladen', Kindersicherung: 'Kinder', Abstandhalter: 'Abstand', Fensteröffner: 'Fenster', Rahmenansicht: 'Rahmen', Abdeckleisten: 'Abdeck', Lichtschlitze: 'Licht', Fenstergitter: 'Fenster' };
    const wrapK = (s, w) => wrap(String(s).split(' ').map((wd) => (FUGE[wd] && tw(wd) > w ? FUGE[wd] + '-\n' + wd.slice(FUGE[wd].length) : wd)).join(' '), w);
    const txt = (s, x, y0, o) => doc.text(t(s), x, y0, o);
    /* Marke: immer klein, auch in Versalzeilen; Wortmarke „eezi“ in ExtraBold, „frames“ in Medium */
    const VERSAL = (s) => String(s).split(/(eeziframes|eezi)/).map((x, i) => (i % 2 ? x : x.toUpperCase())).join('');
    const wortmarke = (x, y0, size, col) => { font('extra', size, col); txt('eezi', x, y0); const w1 = tw('eezi'); font('normal', size, col); txt('frames', x + w1, y0); return w1 + tw('frames'); };
    const alpha = (a) => { try { doc.setGState(new doc.GState({ opacity: a })); } catch (err) { /* ohne Transparenz */ } };
    const rr = (x, y0, w, h2, r, mode) => doc.roundedRect(x, y0, w, h2, r, r, mode || 'F');
    const dash = (d) => { try { doc.setLineDashPattern(d || [], 0); } catch (err) { /* ok */ } };
    const num = AW.num, th = AW.th;
    const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), nF = wins.reduce((a, x) => a + (num(x.fotos) || 0), 0);
    /* „ausgewertet“ nur, wo die Auswertung auch im Blatt steht (Befund oder Fachangaben); sonst ehrlich nur die Zahl der Fotos */
    const nA = wins.reduce((a, x) => a + (x.ki && ((x.ki.rows || []).length || (x.ki.fach && Object.keys(x.ki.fach).length)) ? num(x.fotos) || 0 : 0), 0);
    const fotoText = !nF ? 'ohne Fotos' : nA === nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ' ausgewertet' : nA ? nA + ' von ' + nF + ' Fotos ausgewertet' : nF + (nF === 1 ? ' Foto' : ' Fotos');
    const komplett = wins.length > 0 && wins.every((x) => !AW.massLuecken(x).length);
    const heute = (() => { try { return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (err) { return ''; } })();
    const titelName = V === 'betrieb' ? (kd.name || 'Kunde') : (pr.name || '');
    const laufTitel = (V === 'betrieb' ? 'Aufmaß · ' : 'Aufmaßblatt · ') + (titelName || (V === 'kunde' ? 'Dein Aufmaß' : 'Fenster-Aufmaß'));
    const initial = (name) => (String(name || 'F').replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F');
    /* Kennung des Aufmaßes: kurz, aus dem Code gebildet, steht auf jeder Seite (eine einzelne Seite bleibt zuordenbar) */
    const kennung = e.beispiel ? 'AM-BEISPIEL' : V === 'betrieb' && bt.nr ? String(bt.nr) : (() => { const q = String(e.code || (pr.name || '') + heute + wins.length); let a = 2166136261; for (let i = 0; i < q.length; i++) { a ^= q.charCodeAt(i); a = Math.imul(a, 16777619); } const Z = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let o = ''; for (let i = 0; i < 6; i++) o += Z[(a >>> (i * 5)) & 31]; return 'AM-' + o; })();
    try { doc.setDocumentProperties({ title: laufTitel, subject: 'Fenster-Aufmaß ' + kennung + (titelName ? ' · ' + titelName : ''), author: V === 'betrieb' ? (bt.name || 'eeziframes') : 'eeziframes', keywords: 'Aufmaß, Fenster, Maße in mm, ' + kennung, creator: 'eeziframes' }); doc.setLanguage('de-DE'); if (doc.viewerPreferences) doc.viewerPreferences({ DisplayDocTitle: true }); } catch (err) { /* ohne Eigenschaften weiter */ }
    const kl = Array.isArray(e.klaerung) ? e.klaerung : AW.klaerung(wins, pr), stand = e.klaerStand || {}, geklaert = (r) => !!(stand[r.id] && stand[r.id].ok);

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
    /* Logo des Betriebs (aus dem Betriebskonto) auf dem dunklen Band: dunkle Logos auf hellem Feld, helle direkt; ohne Logo die Initiale */
    const logoFmt = (d) => (/^data:image\/png/i.test(d) ? 'PNG' : /^data:image\/jpe?g/i.test(d) ? 'JPEG' : '');
    function betriebZeichen(x, cy, hoehe) {
      const lg = bt.logo && bt.logo.data && logoFmt(bt.logo.data) && bt.logo.w > 0 && bt.logo.h > 0 ? bt.logo : null;
      if (lg) {
        const r = lg.w / lg.h, hh = hoehe, ww = Math.min(hoehe * 3.6, hh * r), h2 = ww / r, pad = lg.grund === 'dunkel' ? 0 : hoehe * 0.12, padX = pad * 1.6;
        if (pad) { fill('#ffffff'); rr(x, cy - h2 / 2 - pad, ww + 2 * padX, h2 + 2 * pad, Math.min(2.4, hoehe * 0.2)); }
        try { doc.addImage(lg.data, logoFmt(lg.data), x + padX, cy - h2 / 2, ww, h2); return ww + 2 * padX; } catch (err) { /* ohne Logo weiter */ }
      }
      const r = hoehe / 2; fill(HELL); doc.circle(x + r, cy, r, 'F'); font('extra', hoehe * 1.55, BUEHNE); txt(initial(bt.name), x + r, cy + hoehe * 0.19, { align: 'center' });
      return hoehe;
    }
    const kopfband = (gross) => {
      const bh = gross ? 28 : 11;
      fill(BUEHNE); doc.rect(0, 0, W, bh, 'F');
      if (V === 'betrieb') {
        const zw = betriebZeichen(M, bh / 2, gross ? 14 : 6.4), nx = M + zw + (gross ? 5 : 3);
        /* rechts Kennung und Eingang; links bleibt nur der Platz bis dorthin, damit ein breites Logo nichts überdeckt */
        const kicker = VERSAL('Aufmaß · ' + kennung), stand = [bt.eingegangen ? 'eingegangen ' + bt.eingegangen : '', heute].filter(Boolean).join(' · ');
        let rw = 70;
        if (gross) { font('bold', 7.2); rw = tw(kicker) + kicker.length * 0.55; font('normal', 8); rw = Math.max(rw, tw(stand)) + 6; }
        const frei = XR - nx - rw;
        const bname = bt.name || 'Ihr Betrieb'; let gn = gross ? 15 : 8.6; font('extra', gn, '#ffffff');
        while (gn > (gross ? 10.5 : 7) && tw(bname) > frei) { gn -= 0.5; font('extra', gn); } // langer Name neben breitem Logo: kleiner statt abgeschnitten
        txt(wrap(bname, frei)[0], nx, bh / 2 + (gross ? -0.6 : 1.1));
        if (gross) { font('normal', 7.6, HELL2); const sub = 'Aufmaß Ihres Kunden · übermittelt mit eeziframes'; txt(tw(sub) <= frei ? sub : wrap('Übermittelt mit eeziframes', frei)[0], nx, bh / 2 + 5); }
        if (gross) { font('bold', 7.2, GRUEN); txt(kicker, XR, bh / 2 - 1.6, { align: 'right', charSpace: 0.55 }); font('normal', 8, HELL2); txt(stand, XR, bh / 2 + 4, { align: 'right' }); }
        else { font('normal', 6.8, HELL2); txt(laufTitel + ' · ' + kennung, XR, bh / 2 + 1.1, { align: 'right' }); }
      } else {
        marke(M, gross ? 7 : 2.6, gross ? 14 : 5.8, true);
        wortmarke(M + (gross ? 19 : 7.8), gross ? 17 : 7.1, gross ? 16 : 8, '#ffffff');
        if (gross) { font('bold', 7.2, GRUEN); txt('AUFMASSBLATT · ' + kennung, XR, 12, { align: 'right', charSpace: 0.55 }); font('normal', 8, HELL2); txt(heute, XR, 17.5, { align: 'right' }); }
        else { font('normal', 6.6, HELL2); txt(laufTitel + ' · ' + heute + ' · ' + kennung, XR, 7, { align: 'right' }); }
      }
      doc.setTextColor.apply(doc, rgb(INK));
      return bh;
    };
    const neueSeite = () => { doc.addPage(); y = kopfband(false) + 9; };
    const seiteNr = () => doc.getCurrentPageInfo().pageNumber;
    const unten = () => BOTTOM;
    const platz = (h2) => { if (y + h2 > unten()) { neueSeite(); return true; } return false; };
    let codeSeite = 0, fbBox = null;
    /* Senkrechter Markenstreifen am rechten Rand (nur in den Blättern der Hauseigentümer): Hinweis, der sich nicht abtrennen lässt */
    const streifen = (bandH) => {
      if (!STREIFEN) return;
      const x0 = W - STREIFEN, y0 = bandH, y1 = H - 12, len = y1 - y0;
      fill(BUEHNE); doc.rect(x0, y0, STREIFEN, len, 'F');
      const text = 'eeziframes  ·  Fenster ausmessen. Selbst. eezi.  ·  ' + HOST + '  ·  Für Fensterbauer: Aufmaß per Code in Ihr Konto holen' + (codeSeite ? ', Seite ' + codeSeite : '') + '  ·  3 Projekte kostenlos';
      let size = 6.8; font('bold', size, HELL);
      while (tw(text) > len - 16 && size > 5.2) { size -= 0.2; font('bold', size, HELL); }
      const tl = tw(text), ty = y1 - 9 - (len - 16 - tl) / 2;
      txt(text, x0 + STREIFEN / 2 + size * 0.12, ty, { angle: 90 });
      marke(x0 + 1.2, y1 - 7.2, STREIFEN - 2.4, true);
    };
    /* Beispiel aus der Führung: schräg „Beispiel“ über jeder Seite, damit es nicht als echtes Aufmaß durchgeht */
    const wasserzeichen = () => {
      const a = 34 * Math.PI / 180, s = 'BEISPIEL';
      font('extra', 96, '#b42318'); alpha(0.07);
      const l = tw(s), cxw = W / 2, cyw = H / 2 + 12;
      txt(s, cxw - Math.cos(a) * l / 2, cyw + Math.sin(a) * l / 2, { angle: 34 });
      alpha(1);
    };
    /* Fußzeile links: nur so lang, wie neben der Seitenzahl Platz ist; erst fällt der Zusatz weg, dann der Host, zuletzt wird der Name gekürzt */
    const fussLinks = (frei) => {
      const name = String(bt.name || 'Ihr Betrieb').replace(/\s+/g, ' ').trim(), passt = (x) => tw(x) <= frei;
      const varianten = V === 'betrieb'
        ? [[name, 'Aufmaß übermittelt mit eeziframes', HOST, 'Vor der Fertigung Feinaufmaß vor Ort.'], [name, 'Aufmaß übermittelt mit eeziframes', HOST], [name, 'übermittelt mit eeziframes'], [name]]
        : [['Erstellt mit eeziframes', HOST, 'Vor der Fertigung Feinaufmaß vor Ort.'], ['Erstellt mit eeziframes', HOST], ['Erstellt mit eeziframes']];
      for (let k = 0; k < varianten.length; k++) { const s2 = varianten[k].join(' · '); if (passt(s2)) return s2; }
      let kurz = name; while (kurz.length > 1 && !passt(kurz + '...')) kurz = kurz.slice(0, -1);
      return kurz.trim() + '...';
    };
    const fuss = () => {
      const n = doc.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        stroke(LINE); doc.setLineWidth(0.25); doc.line(M, H - 11.5, XR, H - 11.5);
        font('normal', 7.2, GREY);
        const rechts = kennung + ' · Seite ' + i + ' von ' + n;
        txt(fussLinks(XR - M - tw(rechts) - 4), M, H - 7.2);
        txt(rechts, XR, H - 7.2, { align: 'right' });
        streifen(i === 1 ? 28 : 11);
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
    const kicker = (s, x, y0, color, o) => { font('bold', (o && o.size) || 7.2, color || GRUEN_T); txt(VERSAL(s), x, y0, Object.assign({ charSpace: 0.55 }, o && o.align ? { align: o.align } : {})); };
    /* Haken: grüner Kreis mit dunklem Haken (wie die Haken-Chips der Website) */
    const haken = (cx, cy, r) => { fill(GRUEN); doc.circle(cx, cy, r, 'F'); stroke(INK); doc.setLineWidth(Math.max(0.25, r * 0.28)); doc.lines([[r * 0.38, r * 0.4], [r * 0.72, -r * 0.82]], cx - r * 0.5, cy + r * 0.02, [1, 1], 'S', false); };
    const punkt = (cx, cy, r, c) => { fill(c || WARN_P); doc.circle(cx, cy, r, 'F'); };
    /* Chip: Pille mit Rand; art 'ok' mit Haken, 'warn' mit Punkt */
    const chip = (s, x, y0, art, size) => {
      size = size || 7.6; font('bold', size); const hh = size * 0.84, ic = art ? hh * 0.62 : 0, w = tw(s) + 5 + ic;
      stroke(LINE); doc.setLineWidth(0.35); fill('#ffffff'); rr(x, y0, w, hh, hh / 2, 'FD');
      if (art === 'ok') haken(x + 2.5 + ic / 2 - 0.3, y0 + hh / 2, ic * 0.42); else if (art === 'warn') punkt(x + 2.5 + ic / 2 - 0.3, y0 + hh / 2, ic * 0.28);
      doc.setTextColor.apply(doc, rgb(INK)); txt(s, x + 2.5 + ic, y0 + hh * 0.68); return w;
    };
    const swatch = (hex, x, cy, r) => { fill(hex); stroke(LINE); doc.setLineWidth(0.25); doc.circle(x, cy, r || 1.6, 'FD'); };
    /* Karte: weiß, Rand wie die Karten der Website (2 px), optional ein Strich links in Warnfarbe */
    const karteRand = (x, y0, w, h2, o) => { o = o || {}; stroke(o.rand || LINE); doc.setLineWidth(o.dick || 0.5); fill('#ffffff'); rr(x, y0, w, h2, 2.6, 'FD'); if (o.strich) { fill(o.strich); doc.rect(x + 0.25, y0 + 2.2, 1.1, h2 - 4.4, 'F'); } };
    /* Zeilen [Begriff, Wert, { swatch, bold, col, offen }], Begriffsspalte lw */
    const ZL = (fs) => fs * 0.44;
    function zeilenH(rows, w, o) { const lw = o.lw || 26, fs = o.fs || 8; let hh = 0; rows.forEach((r) => { font('normal', fs); const v = wrap(r[1], w - lw - (r[2] && (r[2].swatch || r[2].offen) ? 4.5 : 0)); font('normal', fs - 0.6); const k = wrapK(r[0], lw - 2); hh += Math.max(v.length, k.length, 1) * ZL(fs) + 1.3; }); return hh; }
    function zeilen(rows, x, y0, w, o) {
      const lw = o.lw || 26, fs = o.fs || 8; let yy = y0;
      rows.forEach((r) => {
        const x2 = r[2] || {};
        font('normal', fs - 0.6, GREY); const kl2 = wrapK(r[0], lw - 2); txt(kl2, x, yy + 3);
        let vx = x + lw;
        if (x2.swatch) { swatch(x2.swatch, vx + 1.7, yy + 2, 1.6); vx += 4.5; } else if (x2.offen) { punkt(vx + 1.2, yy + 2, 0.95); vx += 4.5; }
        font(x2.bold || x2.offen ? 'bold' : 'normal', fs, x2.col || (x2.offen ? WARN : INK)); const v = wrap(r[1], w - (vx - x)); txt(v, vx, yy + 3);
        yy += Math.max(v.length, kl2.length, 1) * ZL(fs) + 1.3;
      });
      return yy - y0;
    }
    /* Notiz des Kunden: Zitat mit Strich links, Stelle darüber */
    const notizH = (n, w) => { font('normal', 8); return 3.6 + wrap('„' + n[1] + '“', w - 5).length * ZL(8) + 1.6; };
    function notiz(n, x, y0, w) {
      const hh = notizH(n, w); fill(INK); doc.rect(x, y0 + 0.6, 0.7, hh - 1.8, 'F');
      font('bold', 6.8, GREY); txt(VERSAL(n[2] === 'notiz' ? (sie ? 'Notiz des Kunden' : 'Deine Notiz') : (sie ? 'Notiz des Kunden zu ' : 'Deine Notiz zu ') + n[0]), x + 3, y0 + 2.4, { charSpace: 0.3 });
      font('normal', 8, INK); txt(wrap('„' + n[1] + '“', w - 5), x + 3, y0 + 5.8); return hh;
    }
    /* Überschrift eines Abschnitts: Kicker, Überschrift mit Punkt, Linie */
    function sektion(k, titel, rechts) { platz(18); kicker(k, M, y); y += 7; font('extra', 15, INK); txt(titel, M, y); if (rechts) { font('normal', 8.4, GREY); txt(rechts, XR, y, { align: 'right' }); } stroke(INK); doc.setLineWidth(0.5); doc.line(M, y + 2.6, XR, y + 2.6); y += 8; }

    /* ---------- Zeichnung aus modell.js (AW.plan): dieselben Teile wie im Betriebsbereich, hier mit jsPDF ---------- */
    function planZeichnen(pl, x0, y0) {
      pl.teile.forEach((p) => {
        if (p.t === 'poly') {
          if (p.o != null && p.o < 1) alpha(p.o);
          const mode = p.f && p.s ? 'FD' : p.f ? 'F' : 'S';
          if (p.f) fill(p.f); if (p.s) { stroke(p.s); doc.setLineWidth(Math.max(0.05, p.w)); } dash(p.d);
          if (p.r) rr(x0 + p.p[0][0], y0 + p.p[0][1], p.p[1][0] - p.p[0][0], p.p[2][1] - p.p[1][1], p.r, mode);
          else doc.lines(p.p.slice(1).map((q, k) => [q[0] - p.p[k][0], q[1] - p.p[k][1]]), x0 + p.p[0][0], y0 + p.p[0][1], [1, 1], mode, true);
          dash(null); if (p.o != null && p.o < 1) alpha(1);
        } else if (p.t === 'line') {
          if (p.o != null && p.o < 1) alpha(p.o);
          stroke(p.s); doc.setLineWidth(Math.max(0.05, p.w)); dash(p.d);
          doc.line(x0 + p.p[0][0], y0 + p.p[0][1], x0 + p.p[1][0], y0 + p.p[1][1]);
          dash(null); if (p.o != null && p.o < 1) alpha(1);
        } else if (p.t === 'text') {
          font(p.b >= 800 ? 'extra' : p.b >= 700 ? 'bold' : 'normal', p.g / 0.3528, p.c);
          const w2 = tw(p.s), x = x0 + p.x, yy = y0 + p.y, versatz = p.g * 0.36;
          if (p.bg) { const bw = w2 + p.g * 0.6, bh = p.g * 1.25; fill(p.bg); if (p.r) rr(x - bh / 2, yy - bw / 2, bh, bw, bh / 2); else rr(x - bw / 2, yy - bh / 2, bw, bh, bh / 2); }
          if (p.r) txt(p.s, x + versatz, yy + w2 / 2, { angle: 90 });
          else txt(p.s, p.a === 'middle' ? x - w2 / 2 : p.a === 'end' ? x - w2 : x, yy + versatz);
        }
      });
    }
    /* Kleines Fenster für Tabellen: nur das Element, in den Rahmen s × s eingepasst */
    function mini(w, x, y0, s) { const pl = AW.plan(w, { nurElement: true, b: s, h: s, fs: 1.4 }); planZeichnen(pl, x, y0 + (s - pl.h) / 2); }
    const oeffnungText = (w) => AW.opening(w) + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ' · nach außen' : '');
    const offen = (w, k) => AW.istOffen(w, k);
    const OT = AW.OFFEN_TEXT;

    /* ---------- Seite 1: Übersicht ---------- */
    const FS = 8.4;
    y = kopfband(true) + 10;
    const gebText = [AW.lab('gebaeude', pr.gebaeude), pr.baujahr ? 'Baujahr ' + pr.baujahr : ''].filter(Boolean).join(', ');
    if (V === 'betrieb') {
      kicker('Aufmaß vom Kunden · fürs Angebot', M, y); y += 9;
      font('extra', 24, INK); txt(wrap((kd.name || 'Kunde') + '.', CW)[0], M, y); y += 7;
      font('normal', 10, INK2); txt(wrap([kd.adresse, gebText].filter(Boolean).join(' · ') || 'Objekt ohne Adresse', CW)[0], M, y); y += 6;
    } else {
      kicker(V === 'kunde' ? 'Dein Fenster-Aufmaß' : 'Fenster-Aufmaß Ihres Kunden', M, y); y += 9;
      font('extra', 24, INK); txt(wrap(V === 'kunde' ? (pr.name ? pr.name + '.' : 'Dein Aufmaß.') : (pr.name || 'Aufmaß für Ihr Angebot') + '.', CW)[0], M, y); y += 7;
      font('normal', 10, INK2); txt(wrap([pr.ort, gebText].filter(Boolean).join(' · ') || 'Selbst gemessen, Schritt für Schritt geführt', CW)[0], M, y); y += 6;
    }
    /* Eine Zeile Zusammenfassung: Umfang und Vollständigkeit, als Chips mit Haken */
    let cx = M;
    [[wins.length + (wins.length === 1 ? ' Position' : ' Positionen'), 'ok'], [nE + (nE === 1 ? ' Element' : ' Elemente'), 'ok'], [fotoText, nF ? 'ok' : 'warn'], [komplett ? 'alle Maße vollständig' : 'Maße teilweise offen', komplett ? 'ok' : 'warn'], ['alle Maße in mm', '']].forEach((c) => { const w2 = chip(c[0], cx, y, c[1]); cx += w2 + 2.2; });
    y += 12;
    const fw = AW.foerdWeg(pr), tot = num(pr.total);
    const eck = [['Gebäude', gebText || '–'], ['Fenster im Haus', tot ? nE + ' von ' + tot + ' werden getauscht' : 'nicht angegeben'], ['Zeitraum', AW.lab('zeit', pr.zeit) || '–'], ['Budget', AW.lab('budget', pr.budget) || '–'], ['Förderung', fw && fw !== 'keine' ? AW.lab('foerdweg', fw) || fw : 'keine Angabe']];
    const kontaktZ = [['Name', pr.name || '–'], ['Ort', pr.ort || '–'], ['Telefon', pr.tel || '–'], ['E-Mail', pr.mail || '–'], ['Erreichbar', ERREICH[pr.erreich] || '–']].filter((r) => r[1] !== '–');
    if (V !== 'betrieb') {
      /* Der Weg: vier Schritte erledigt (Haken und Wort), der fünfte ist der nächste. Ehrlich gezählt: fehlt etwas, steht es offen da. */
      const wegS = [
        { t: 'Fotografiert', d: nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ', von der KI gelesen' : 'ohne Fotos', ok: nF > 0 },
        { t: 'Gemessen', d: komplett ? '8 Maße je Fenster, von Hand' : 'Maße teilweise offen', ok: komplett },
        { t: 'Wünsche festgelegt', d: 'Teilung, Farbe, Glas, Extras', ok: wins.length > 0 },
        { t: 'Aufmaßblatt erstellt', d: 'am ' + heute, ok: true },
        { t: V === 'kunde' ? 'Jetzt senden' : 'Ihr Schritt: Angebot', d: V === 'kunde' ? 'an beliebig viele Fensterbauer, Angebote vergleichen' : 'auf Grundlage dieses Blatts', jetzt: true }
      ];
      const erledigt = wegS.filter((x) => x.ok).length, sw5 = CW / 5, r5 = 3.4, wy = y + 8;
      kicker((V === 'kunde' ? 'Dein Weg zu neuen Fenstern' : 'Was Ihr Kunde schon erledigt hat') + ' · ' + erledigt + ' von 5 Schritten erledigt', M, y + 1, INK2);
      wegS.forEach((x, i) => { if (i === 4) return; const x1 = M + i * sw5 + 2 * r5 + 1.5, x2 = M + (i + 1) * sw5 - 1.5; stroke(x.ok && (wegS[i + 1].ok || wegS[i + 1].jetzt) ? INK : LINE); doc.setLineWidth(0.6); dash(i === 3 ? [1.1, 0.9] : null); doc.line(x1, wy, x2, wy); dash(null); });
      wegS.forEach((x, i) => {
        const x0 = M + i * sw5, mx = x0 + r5;
        if (x.jetzt) { fill('#ffffff'); stroke(INK); doc.setLineWidth(0.9); doc.circle(mx, wy, r5, 'FD'); fill(INK); doc.circle(mx, wy, 1.3, 'F'); }
        else if (x.ok) haken(mx, wy, r5);
        else { fill('#ffffff'); stroke(WARN); doc.setLineWidth(0.8); doc.circle(mx, wy, r5, 'FD'); font('extra', 8, WARN); txt('!', mx, wy + 2.8, { align: 'center' }); }
        font('bold', 9, INK); txt(wrap(x.t, sw5 - 3)[0], x0, wy + 9);
        font('normal', 7.8, x.ok || x.jetzt ? INK2 : WARN); txt(wrap((x.ok ? 'Erledigt · ' : x.jetzt ? '' : 'Offen · ') + x.d, sw5 - 4).slice(0, 2), x0, wy + 13, { lineHeightFactor: 1.2 });
      });
      y = wy + 21;
      /* Links Eckdaten, rechts die Box für den Fensterbauer, mit einer Spitze am letzten Schritt angeschlossen */
      const fbW = 82, ekW = CW - fbW - 5, fbX = XR - fbW, oFb = { lw: 19, fs: 8 }, oEk = { lw: 25, fs: FS };
      const fbZeilen = (seite) => kontaktZ.concat([['Maße', 'in mm, Breite × Höhe, Ansicht von innen; Maueröffnung: kleinstes von drei Maßen'], ['Digital', '„Code vom Kunden einfügen“ in eeziframes, Code auf Seite ' + seite + '; die ersten 3 Projekte sind frei'], ['Danach', 'Angebot, vor der Fertigung Feinaufmaß vor Ort']]);
      const fbTitel = V === 'kunde' ? 'Für deinen Fensterbauer' : 'Für Sie als Fensterbauer';
      const hFb = 11 + zeilenH(fbZeilen(99), fbW - 8, oFb) + 3, hEk = 11 + zeilenH(eck, ekW - 8, oEk) + 3, hb = Math.max(hFb, hEk);
      karteRand(M, y, ekW, hb); kicker('Eckdaten zum Projekt', M + 4, y + 6, GREY); zeilen(eck, M + 4, y + 9, ekW - 8, oEk);
      const by0 = y, sx = M + 4 * sw5 + r5;
      fbBox = () => {
        karteRand(fbX, by0, fbW, hb, { rand: INK, dick: 0.5 });
        /* Spitze zum Schritt „an den Fensterbauer“ */
        fill('#ffffff'); doc.triangle(sx - 2.6, by0 + 0.25, sx + 2.6, by0 + 0.25, sx, by0 - 2.8, 'F'); stroke(INK); doc.setLineWidth(0.5); doc.line(sx - 2.6, by0, sx, by0 - 2.8); doc.line(sx, by0 - 2.8, sx + 2.6, by0);
        kicker(fbTitel, fbX + 4, by0 + 6, INK); zeilen(fbZeilen(codeSeite || 99), fbX + 4, by0 + 9, fbW - 8, oFb);
      };
      y += hb + 9;
    } else {
      /* Ihr Kunde und Eckdaten nebeneinander, dann die Übersicht aller Positionen mit Bestellmaß */
      const halb = (CW - 5) / 2, oB = { lw: 22, fs: FS }, kb = [['Kunde', kd.name || '–'], ['Kontakt', kd.kontakt || '–']].concat((Array.isArray(kd.mehr) ? kd.mehr : []).filter((r) => r && r[1]).slice(0, 3).map((r) => [String(r[0]), String(r[1])]), [['Objekt', kd.adresse || '–']]);
      const hk = 11 + zeilenH(kb, halb - 8, oB) + 3, he = 11 + zeilenH(eck, halb - 8, { lw: 26, fs: FS }) + 3, hm = Math.max(hk, he);
      karteRand(M, y, halb, hm); kicker('Ihr Kunde', M + 4, y + 6, GREY); zeilen(kb, M + 4, y + 9, halb - 8, oB);
      karteRand(M + halb + 5, y, halb, hm); kicker('Eckdaten zum Projekt', M + halb + 9, y + 6, GREY); zeilen(eck, M + halb + 9, y + 9, halb - 8, { lw: 26, fs: FS });
      y += hm + 9;
      uebersichtKurz();
    }

    /* Übersicht für den Betrieb auf Seite 1: Pos., Zeichnung, Fenster, Öffnung, Element, Bestellmaß, Stück */
    function uebersichtKurz() {
      sektion(wins.length + (wins.length === 1 ? ' Position' : ' Positionen') + ' · ' + nE + (nE === 1 ? ' Element' : ' Elemente') + ' · mit Bestellmaß', 'Übersicht.', 'Maße in mm · Breite × Höhe');
      const cols = [['Pos.', 9], ['', 12], ['Fenster', CW - 9 - 12 - 26 - 26 - 34 - 10], ['Öffnung', 26], ['Element', 26], ['Bestellmaß', 34], ['Stk.', 10]];
      const cX = []; let ax = M; cols.forEach((c) => { cX.push(ax); ax += c[1]; });
      const kopf = () => { font('bold', 6.8, GREY); cols.forEach((c, k) => { if (c[0]) txt(VERSAL(c[0]), cX[k] + (k === cols.length - 1 ? c[1] - 1 : 0), y, { align: k === cols.length - 1 ? 'right' : 'left', charSpace: 0.3 }); }); y += 2; stroke(INK); doc.setLineWidth(0.4); doc.line(M, y, XR, y); y += 0.5; };
      kopf();
      wins.forEach((w, i) => {
        const d = AW.derive(w), b = AW.bestellmass(w, ab), rh = 12;
        if (y + rh > unten()) { neueSeite(); kopf(); }
        const ty = y + rh / 2 + 1.2;
        font('extra', 9.4, INK); txt(String(i + 1), cX[0] + 1, ty);
        mini(w, cX[1], y + 1.5, 9);
        font('bold', 8.6, INK); txt(wrap(w.name || 'Fenster', cols[2][1] - 3)[0], cX[2], ty - 1.6);
        font('normal', 7.2, INK2); txt(wrap([ARTNAME[w.art] || 'Fenster', AW.lab('etage', w.etage) || 'EG', (w.sashes || []).length && (w.art || 'fenster') === 'fenster' ? w.sashes.length + ' Flügel' : ''].filter(Boolean).join(' · '), cols[2][1] - 3)[0], cX[2], ty + 2.4);
        font('normal', 8.4, INK2); txt(d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) : '–', cX[3], ty); txt(d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) : '–', cX[4], ty);
        font('extra', 9, INK); txt(b ? th(b.b) + ' × ' + th(b.h) : '–', cX[5], ty); if (b && b.warn.length) { punkt(cX[5] + tw(th(b.b) + ' × ' + th(b.h)) + 2, ty - 1.1, 0.9); }
        font('normal', 8.4, INK); txt(String(num(w.anzahl) || 1), XR - 1, ty, { align: 'right' });
        y += rh; stroke(LINE); doc.setLineWidth(0.2); doc.line(M, y, XR, y);
      });
      font('normal', 7.4, GREY); const lg = wrap('Bestellmaß: Ihr Abzug von der Maueröffnung (' + ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben' + (ab.unten ? ', ' + ab.unten + ' mm unten bei Fenstern' : '') + (ab.untenT ? ', ' + ab.untenT + ' mm unten bei Türen' : '') + '). Punkt: vor Ort prüfen, Hinweis bei der Position. Verbindlich bleibt Ihr Feinaufmaß.', CW);
      txt(lg, M, y + 4, { lineHeightFactor: 1.25 }); y += 4 + lg.length * 3.2 + 6;
    }

    /* ---------- Klärungsliste: nach Gruppen, je Punkt Position, was, warum; im Betrieb mit Stand ---------- */
    const klTitel = V === 'kunde' ? 'Noch zu klären, dein Fensterbauer berät dich' : 'Mit dem Kunden zu klären';
    /* Ein Punkt als Tabellenzeile: Kästchen (geklärt: grüner Haken), links die Position, rechts was zu klären ist und warum */
    const KL_K = 38;
    function klaerPunktH(r, w) {
      const vw = w - KL_K - 8;
      font('bold', 7.6); const k = wrap(r.k, KL_K - 2).length; font(r.gruppe === 'pflicht' ? 'bold' : 'normal', 8.4); const v = wrap(r.v, vw).length; font('normal', 7.2); const g = r.warum ? wrap(r.warum, vw).length : 0;
      const nz = stand[r.id] && stand[r.id].notiz ? (font('normal', 7.6), wrap('Ihre Notiz: ' + stand[r.id].notiz, vw).length) : 0;
      return 1.2 + Math.max(k * 3.2, v * 3.65 + g * 3.05 + nz * 3.3 + (geklaert(r) ? 3.2 : 0)) + 2;
    }
    function klaerPunkt(r, x, y0, w) {
      const ok = geklaert(r), vx = x + 8 + KL_K, vw = w - KL_K - 8;
      if (ok) haken(x + 2, y0 + 3.1, 2); else { stroke(INK2); doc.setLineWidth(0.35); fill('#ffffff'); rr(x, y0 + 1.1, 4, 4, 0.8, 'FD'); }
      font('bold', 7.6, INK2); txt(wrap(r.k, KL_K - 2), x + 7, y0 + 4, { lineHeightFactor: 1.15 });
      let yy = y0 + 4;
      font(r.gruppe === 'pflicht' ? 'bold' : 'normal', 8.4, ok ? GREY : INK); const v = wrap(r.v, vw); txt(v, vx, yy, { lineHeightFactor: 1.25 }); yy += v.length * 3.65;
      if (r.warum) { font('normal', 7.2, GREY); const g = wrap(r.warum, vw); txt(g, vx, yy - 0.4, { lineHeightFactor: 1.2 }); yy += g.length * 3.05; }
      if (ok) { font('bold', 7.2, GRUEN_T); txt('geklärt' + (stand[r.id].wann ? ', ' + stand[r.id].wann : ''), vx, yy - 0.2); yy += 3.2; }
      if (stand[r.id] && stand[r.id].notiz) { font('normal', 7.6, INK2); txt(wrap('Ihre Notiz: ' + stand[r.id].notiz, vw), vx, yy - 0.2); }
    }
    function klaerListe() {
      if (!kl.length) {
        platz(22); kicker(klTitel, M, y); y += 4; karteRand(M, y, CW, 12); haken(M + 6, y + 6, 2.2); font('normal', 8.6, INK2); txt('Nichts offen: keine Pflichtthemen, keine offenen Wünsche, keine Hinweise aus den Fotos.', M + 11, y + 7.2); y += 18; return;
      }
      const iw = CW - 18, gruppen = AW.klaerGruppen(kl), n = kl.filter(geklaert).length;
      let titel = klTitel, start = null;
      const kopf = (fort) => { kicker(fort ? titel + ', Fortsetzung' : titel, M, y, WARN); font('normal', 8, GREY); txt(V === 'betrieb' ? n + ' von ' + kl.length + ' geklärt' : kl.length + (kl.length === 1 ? ' Punkt' : ' Punkte'), XR, y, { align: 'right' }); y += 3.5; start = y; y += 3; };
      const schliessen = () => { karteRand(M, start, CW, y - start + 1, { strich: WARN_P }); };
      /* Karte zuerst messen und zeichnen, dann den Inhalt darüber: so bleibt der Rand unter dem Text */
      const zeichnen = [];
      const flush = () => { schliessen(); zeichnen.forEach((f) => f()); zeichnen.length = 0; };
      if (y + 30 > unten()) neueSeite();
      kopf(false);
      gruppen.forEach((g) => {
        const gh = 6.5;
        g.punkte.forEach((r, k) => {
          const ph = klaerPunktH(r, iw) + (k === 0 ? gh : 0);
          if (y + ph > unten() - 2) { flush(); neueSeite(); kopf(true); }
          if (k === 0 || zeichnen.length === 0) { const yy = y; zeichnen.push(() => { font('bold', 6.8, GREY); txt(VERSAL(g.titel) + '  ·  ' + g.punkte.length, M + 6, yy + 3.6, { charSpace: 0.4 }); }); y += gh; }
          const yy = y; zeichnen.push(() => klaerPunkt(r, M + 6, yy, iw)); y += klaerPunktH(r, iw);
        });
        y += 1.5;
      });
      flush(); y += 7;
    }
    klaerListe();

    /* ---------- Je Position eine Seite: Kopf, Zeichnung mit Maßen, Maße, Wünsche in Gruppen, Einbausituation, Fotos ---------- */
    function masseZeilen(w) {
      const d = AW.derive(w), mo = w.mo || {}, L = (k) => (num(mo[k]) ? th(mo[k]) : '–'), luecken = AW.massLuecken(w), dev = Math.max(d.devW, d.devH);
      return [[w.neu ? 'Rohbauöffnung' : 'Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' + (w.neu ? ', Wunsch' : ', kleinstes') : 'nicht gemessen', d.moW && d.moH ? { bold: true, col: MO_T } : { offen: true }]]
        .concat(w.neu ? [] : [['Breiten', 'oben ' + L('wt') + ' · Mitte ' + L('wm') + ' · unten ' + L('wb'), /Breite/.test(luecken.join()) ? { offen: true } : null], ['Höhen', 'links ' + L('hl') + ' · Mitte ' + L('hm') + ' · rechts ' + L('hr'), /Höhe/.test(luecken.join()) ? { offen: true } : null]],
          !w.neu ? [['Außer Winkel', dev > 5 ? 'bis ' + dev + ' mm, das kleinste Maß zählt' : 'unter 5 mm', dev > 10 ? { offen: true } : null]] : [],
          [[istTuer(w) ? 'Türelement' : 'Element', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm mit Rahmen' : 'nicht gemessen', d.elW && d.elH ? { bold: true, col: EL_T } : { offen: true }],
            ['Brüstung', istTuer(w) ? 'bodentief' : AW.bruDa(w) ? (num(w.bru) ? th(w.bru) + ' mm' : 'bodentief') : '–'], ['Laibung innen', num(w.laib) ? th(w.laib) + ' mm' : '–'], ['Lage', (AW.lab('etage', w.etage) || 'EG') + (num(w.wand) ? ', Wand ' + th(w.wand) + ' mm' : '')],
            ['Einbau', w.neu ? 'neue Öffnung, Wunschmaße' : 'Austausch' + (AW.ohneFotos(w) ? ', ohne Fotos' : '')]]);
    }
    function position(w, i) {
      neueSeite();
      const d = AW.derive(w), n = num(w.anzahl) || 1, b = AW.bestellmass(w, ab), Wn = AW.wuensche(w, pr), name = w.name || (ARTNAME[w.art] || 'Fenster') + ' ' + (i + 1);
      const fort = () => { neueSeite(); font('bold', 9, INK2); txt('Pos. ' + (i + 1) + ' · ' + name + ', Fortsetzung', M, y); y += 6; };
      const platzP = (h2) => { if (y + h2 > unten()) fort(); };
      /* Kopf wie eine Zeile im Lieferschein: Nummer, Raum, Art, Öffnung; rechts dunkel hervorgehoben das Bestellmaß bzw. die Maueröffnung */
      fill(INK); rr(M, y - 1, 12, 12, 2.4); font('extra', 12, '#ffffff'); txt(String(i + 1), M + 6, y + 7.2, { align: 'center' });
      const boxW = 64;
      font('extra', 17, INK); txt(wrap(name, CW - boxW - 22)[0], M + 16, y + 5);
      font('normal', 8.4, INK2);
      let datenZ = '', voll = false;
      [ARTNAME[w.art] || 'Fenster', oeffnungText(w).split(' · ').slice(0, 2).join(' · '), AW.lab('etage', w.etage) || 'EG', n + ' Stück', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : 'ohne Fotos'].forEach((teil) => { if (voll) return; const z = datenZ ? datenZ + ' · ' + teil : teil; if (tw(z) <= CW - boxW - 22) datenZ = z; else voll = true; });
      txt(datenZ, M + 16, y + 10);
      fill(BUEHNE); rr(XR - boxW, y - 2, boxW, 15, 2.6);
      if (V === 'betrieb') { kicker('Bestellmaß-Vorschlag', XR - boxW + 4, y + 2.4, GRUEN, { size: 6.6 }); font('extra', 12.5, '#ffffff'); txt(b ? b.text : '–', XR - boxW + 4, y + 8.4); font('normal', 6.4, HELL2); txt(wrap(b ? b.formel : 'ohne Maueröffnung kein Vorschlag', boxW - 8)[0], XR - boxW + 4, y + 11.6); }
      else { kicker(w.neu ? 'Rohbauöffnung' : 'Maueröffnung', XR - boxW + 4, y + 2.4, GRUEN, { size: 6.6 }); font('extra', 12.5, '#ffffff'); txt(d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' : 'nicht gemessen', XR - boxW + 4, y + 8.4); font('normal', 6.6, HELL2); txt('Element ' + (d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm' : 'nicht gemessen'), XR - boxW + 4, y + 11.6); }
      y += 17;
      /* Was bei dieser Position zu klären ist: in einer Zeile, Einzelheiten in der Liste vorn */
      const hier = kl.filter((r) => r.pos === i || (Array.isArray(r.pos) && r.pos.indexOf(i) >= 0)).filter((r) => !geklaert(r));
      if (hier.length) {
        const namen = hier.map((r) => r.kurz || 'offene Wünsche').filter((x, k, a) => a.indexOf(x) === k);
        font('bold', 8, WARN); const z = wrap('Zu klären: ' + namen.join(', ') + ' (Einzelheiten in der Liste vorn)', CW - 5);
        punkt(M + 1.2, y - 1, 1); txt(z, M + 4, y); y += z.length * 3.6 + 2.5;
      }
      /* Erst messen, was nach der Zeichnung kommt (Wünsche, Gruppen, Einbausituation, Fotos), damit die Position auf ihre Seite passt:
         die Zeichnung wird so hoch, wie Platz bleibt (72 bis 118 mm); reicht auch das nicht, geht der Rest auf die nächste Seite */
      const zw = Math.round(CW * 0.6), rx = M + zw + 5, rw = CW - zw - 5, oM = { lw: 21, fs: 7.8 };
      const mz = masseZeilen(w), bWarn = V === 'betrieb' && b && b.warnText ? b.warnText : '', notM = Wn.notizen.masse;
      const mH = 10 + zeilenH(mz, rw - 8, oM) + (bWarn ? (font('normal', 7.6), wrap(bWarn, rw - 12).length * 3.4 + 3) : 0) + notM.reduce((s2, x) => s2 + notizH(x, rw - 8) + 1, 0) + 2;
      font('bold', 10.4); const satz = wrap(Wn.satz + '.', CW), allg = Wn.notizen.allgemein;
      const wH = 5.5 + satz.length * 4.6 + (Wn.offen.length ? 9 : 0) + allg.reduce((s2, x) => s2 + notizH(x, CW) + 1.5, 0) + 2;
      const sp = (CW - 6) / 2, oG = { lw: 23, fs: 8 };
      const gRows = (g) => g.zeilen.map((z) => [z.k, z.t, z.offen ? { offen: true } : z.hex ? { swatch: z.hex } : null]);
      const gH = (g) => 6 + zeilenH(gRows(g), sp, oG) + g.notizen.reduce((s2, x) => s2 + notizH(x, sp) + 1, 0) + 2.4;
      const G = Wn.gruppen, hs = G.map(gH), sum = (a, b2) => hs.slice(a, b2).reduce((s2, x) => s2 + x, 0);
      let teil = 1, best = Infinity; for (let k = 1; k < G.length; k++) { const m2 = Math.max(sum(0, k), sum(k, G.length)); if (m2 < best) { best = m2; teil = k; } }
      const kiR = AW.kiRows(w).map((r) => [r[0], r[1], r[0] === 'Hinweis' || r[0] === 'Vor Ort prüfen' || (r[0] === 'Maße und Foto' && AW.massPruef(w)) ? { offen: true } : r[0] === 'Auf einen Blick' ? { bold: true } : null]);
      const fotos = ['in', 'out'].map((s2) => ({ s: s2, f: w.bilder && e.fotos ? e.fotos[w.bilder[s2]] : null })).filter((x) => x.f && /^data:image\/jpeg/.test(String(x.f.data || '')) && x.f.w > 0 && x.f.h > 0);
      const nzF = Wn.notizen.fotos, mitBild = !!(w.neu && w.plan && w.plan.bild && /^data:image\/jpeg/.test(w.plan.bild)), oK = { lw: 24, fs: 7.6 };
      const half = Math.ceil(kiR.length / 2), lsp = [kiR.slice(0, half), kiR.slice(half)], kH = kiR.length ? Math.max(zeilenH(lsp[0], sp, oK), zeilenH(lsp[1], sp, oK)) : 0;
      const FH = 48, kiBlock = (kiR.length ? 6 + kH + 3 : 0) + nzF.reduce((s2, x) => s2 + notizH(x, CW) + 1.5, 0) + (fotos.length ? FH + 12 + (kiR.length ? 0 : 6) : 0);
      const bw0 = mitBild ? w.plan.bw || 3 : 3, bh0 = mitBild ? w.plan.bh || 4 : 4, iw2 = Math.min(CW - 8, 64 * bw0 / bh0), ih2 = iw2 * bh0 / bw0, bildH = mitBild ? ih2 + 12 : 0;
      const rest = wH + best + 3 + kiBlock + bildH, ziel = unten() - y - 7 - rest;
      /* Passt alles nicht einmal mit kleiner Zeichnung, geht die Einbausituation geschlossen auf die nächste Seite und die Zeichnung bleibt groß */
      const ohneKi = unten() - y - 7 - (rest - kiBlock - bildH), kiWeiter = ziel < 72 && (kiBlock + bildH) > 0;
      const zMax = !kiWeiter ? Math.max(72, Math.min(118, ziel)) : Math.max(84, Math.min(118, ohneKi)), pl = AW.plan(w, { b: zw - 6, h: zMax - 13, fs: 3 }), zh = Math.max(pl.h + 13, mH);
      /* Zeichnung links, Maße rechts */
      platzP(zh);
      karteRand(M, y, zw, zh);
      planZeichnen(pl, M + 3, y + 3 + Math.max(0, (zh - 13 - pl.h) / 2));
      /* Legende mit Wort, Farbe nie allein */
      const ly = y + zh - 3.6, moL = w.neu ? 'Rohbauöffnung, Wunschmaß' : 'Maueröffnung, von Hand'; font('normal', 7, INK2);
      fill(MO); doc.rect(M + 4, ly - 1.6, 5, 0.9, 'F'); txt(moL, M + 10.5, ly);
      const lx2 = M + 10.5 + tw(moL) + 5; fill(EL); doc.rect(lx2, ly - 1.6, 5, 0.9, 'F'); txt('Element', lx2 + 6.5, ly);
      txt('Ansicht von innen · mm' + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ' · gestrichelt: nach außen' : ''), M + zw - 4, ly, { align: 'right' });
      karteRand(rx, y, rw, zh); kicker('Maße von Hand', rx + 4, y + 6, GREY);
      let ry = y + 9 + zeilen(mz, rx + 4, y + 9, rw - 8, oM);
      if (bWarn) { punkt(rx + 5.2, ry + 2.2, 1); font('normal', 7.6, WARN); const wl = wrap(bWarn, rw - 12); txt(wl, rx + 8, ry + 3); ry += wl.length * 3.4 + 3; }
      notM.forEach((x) => { ry += notiz(x, rx + 4, ry + 1, rw - 8) + 1; });
      y += zh + 7;
      /* Wünsche des Kunden: ein Satz, offene Punkte, dann die Gruppen in zwei Spalten */
      platzP(wH + Math.min(best, 40));
      kicker(sie ? 'Wünsche des Kunden' : 'Deine Wünsche', M, y); y += 5.5;
      font('bold', 10.4, INK); txt(satz, M, y, { lineHeightFactor: 1.25 }); y += satz.length * 4.6;
      if (Wn.offen.length) { let ox = M; font('bold', 6.8, GREY); txt('NOCH OFFEN', ox, y + 3.6, { charSpace: 0.4 }); ox += tw('NOCH OFFEN') + 8; Wn.offen.forEach((x) => { font('bold', 7.2); const cw2 = tw(x) + 9; if (ox + cw2 > XR) { y += 7; ox = M; } ox += chip(x, ox, y, 'warn', 7.2) + 2; }); y += 9; }
      allg.forEach((x) => { platzP(notizH(x, CW)); y += notiz(x, M, y, CW) + 1.5; });
      y += 2;
      function gruppe(g, x, y0, w2) {
        font('bold', 6.8, GREY); txt(VERSAL(g.titel), x, y0 + 3.2, { charSpace: 0.4 }); stroke(LINE); doc.setLineWidth(0.25); doc.line(x, y0 + 4.6, x + w2, y0 + 4.6);
        let yy = y0 + 5.4 + zeilen(gRows(g), x, y0 + 5.4, w2, oG);
        g.notizen.forEach((x2) => { yy += notiz(x2, x, yy + 1, w2) + 1; });
      }
      if (y + best > unten()) {
        /* passt nicht mehr nebeneinander: Gruppe für Gruppe weiter, nie eine Gruppe geteilt */
        G.forEach((g) => { platzP(gH(g)); gruppe(g, M, y, CW); y += gH(g); });
      } else {
        let hl = 0, hr = 0;
        G.slice(0, teil).forEach((g) => { gruppe(g, M, y + hl, sp); hl += gH(g); });
        G.slice(teil).forEach((g) => { gruppe(g, M + sp + 6, y + hr, sp); hr += gH(g); });
        stroke(LINE); doc.setLineWidth(0.25); doc.line(M + sp + 3, y + 1, M + sp + 3, y + Math.max(hl, hr) - 3);
        y += Math.max(hl, hr);
      }
      y += 3;
      /* Einbausituation aus den Fotos: Befund der KI zweispaltig, Hinweise und Prüfpunkte markiert, darunter die Fotos */
      const kiTitel = 'Einbausituation aus den Fotos' + (w.ki ? ' (KI, ' + (w.fotos || 0) + (w.fotos === 1 ? ' Foto)' : ' Fotos)') : '');
      if (kiWeiter && kiBlock > 0 && y + 6 + Math.min(kH, 30) + (fotos.length ? FH + 12 : 0) > unten()) fort();
      if (kiR.length) {
        if (y + 6 + kH > unten()) {
          /* passt der Befund nicht mehr, geht er ganz auf die nächste Seite, einspaltig bei Bedarf über mehrere */
          fort(); kicker(kiTitel, M, y + 3, GREY); y += 6;
          if (y + kH > unten()) kiR.forEach((r) => { const hh = zeilenH([r], CW, oK); platzP(hh); zeilen([r], M, y, CW, oK); y += hh; });
          else { zeilen(lsp[0], M, y, sp, oK); zeilen(lsp[1], M + sp + 6, y, sp, oK); y += kH; }
        } else { kicker(kiTitel, M, y + 3, GREY); y += 6; zeilen(lsp[0], M, y, sp, oK); zeilen(lsp[1], M + sp + 6, y, sp, oK); y += kH; }
        y += 3;
      }
      nzF.forEach((x) => { platzP(notizH(x, CW)); y += notiz(x, M, y, CW) + 1.5; });
      if (fotos.length) {
        platzP(FH + 12 + (kiR.length ? 0 : 6));
        if (!kiR.length) { kicker(kiTitel, M, y + 3, GREY); y += 6; }
        const zb = (CW - 6) / 2;
        fotos.forEach((x, k) => {
          const fx = M + k * (zb + 6), r = x.f.w / x.f.h; let iw = zb - 3, ih = iw / r; if (ih > FH) { ih = FH; iw = ih * r; }
          stroke(LINE); doc.setLineWidth(0.5); rr(fx, y, zb, FH + 8, 2.6, 'S');
          try { doc.addImage(x.f.data, 'JPEG', fx + (zb - iw) / 2, y + 1.5 + (FH - ih) / 2, iw, ih); } catch (err) { /* ohne Bild weiter */ }
          font('bold', 7.2, INK2); txt(x.s === 'in' ? 'Von innen' : 'Von außen', fx + zb / 2, y + FH + 5.6, { align: 'center' });
        });
        y += FH + 12;
      }
      if (mitBild) {
        platzP(bildH);
        kicker('Lage auf dem Foto, ' + (sie ? 'vom Kunden' : 'von dir') + ' eingezeichnet', M, y + 3, GREY); y += 5;
        try { doc.addImage(w.plan.bild, 'JPEG', M + (CW - iw2) / 2, y, iw2, ih2); } catch (err) { /* ohne Bild weiter */ }
        y += ih2 + 5;
      }
    }

    /* ---------- Überblick am Ende (ab zwei Positionen): Tabelle, Ausstattung, Zahlen, alle im selben Maßstab ---------- */
    const legendeText = 'Maueröffnung: von drei Breiten und drei Höhen zählt das kleinste Maß; Abweichungen stehen bei der Position. Element: das sichtbare Fenster mit Rahmen. Öffnungssymbole: Linien beginnen an der Bandseite, die Spitze zeigt zum Griff; Dreieck mit Spitze oben = Kipp; F = fest. ' + (V === 'betrieb' ? 'Bestellmaß: Vorschlag aus Ihrem Abzug, verbindlich bleibt Ihr Feinaufmaß.' : 'Das Bestellmaß legt der Fensterbauer beim Feinaufmaß fest.');
    function tabelle() {
      sektion(wins.length + ' Positionen · ' + nE + (nE === 1 ? ' Element' : ' Elemente'), 'Übersicht.', 'alle Maße in mm');
      const cols = [['Pos.', 9], ['Fenster', CW - 9 - 23 - 23 - 31 - 30 - 13 - 8], ['Öffnung', 23], ['Element', 23], ['Öffnungsart', 31], ['Farbe außen', 30], ['Glas', 13], ['Stk.', 8]];
      const colX = []; let ax = M; cols.forEach((c) => { colX.push(ax); ax += c[1]; });
      const zellen = (w) => { const d = AW.derive(w); return ['', '', d.moW ? th(d.moW) + ' × ' + th(d.moH) : '–', d.elW ? th(d.elW) + ' × ' + th(d.elH) : '–', oeffnungText(w), AW.farbe(w, 'aussen')[0], offen(w, 'glas') ? 'offen' : AW.lab('glas', w.glas) || '3-fach', String(num(w.anzahl) || 1)]; };
      const zeileH = (w) => { font('normal', 8); const lines = zellen(w).map((c, k) => wrap(c, cols[k][1] - (k === 5 ? 6 : 3))); return Math.max(12, Math.max.apply(null, lines.map((l) => l.length)) * 3.5 + 5); };
      const tabKopf = () => { font('bold', 6.8, GREY); cols.forEach((c, k) => txt(VERSAL(c[0]), colX[k] + (k === cols.length - 1 ? c[1] - 1 : 0), y, { align: k === cols.length - 1 ? 'right' : 'left', charSpace: 0.3 })); y += 2; stroke(INK); doc.setLineWidth(0.4); doc.line(M, y, XR, y); y += 0.5; };
      tabKopf();
      wins.forEach((w, i) => {
        const fa = AW.farbe(w, 'aussen'), cells = zellen(w), rh = zeileH(w);
        font('normal', 8); const lines = cells.map((c, k) => wrap(c, cols[k][1] - (k === 5 ? 6 : 3)));
        if (y + rh > unten()) { neueSeite(); tabKopf(); }
        const ty = y + rh / 2 + 1.2;
        font('extra', 9.4, INK); txt(String(i + 1), colX[0] + 1, ty);
        mini(w, colX[1], y + (rh - 8.5) / 2, 8.5);
        font('bold', 8.2, INK); txt(wrap(w.name || 'Fenster', cols[1][1] - 13)[0], colX[1] + 11, ty - 1.6);
        font('normal', 7, INK2); txt(wrap([AW.lab('etage', w.etage) || 'EG', num(w.bru) ? 'Brüstung ' + th(w.bru) : '', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : ''].filter(Boolean).join(' · '), cols[1][1] - 13)[0], colX[1] + 11, ty + 2.2);
        cells.forEach((c, k) => {
          if (k < 2) return;
          const last = k === cells.length - 1, ly = ty - (lines[k].length - 1) * 1.75;
          font(k === 2 ? 'bold' : 'normal', 8, k === 2 ? MO_T : (k === 6 && c === 'offen') ? WARN : INK);
          if (k === 5) { if (offen(w, 'fa')) { punkt(colX[k] + 1.6, ty - 1, 1); font('bold', 8, WARN); txt('offen', colX[k] + 4.4, ty); } else { swatch(fa[2], colX[k] + 1.6, ty - 1, 1.5); txt(lines[k], colX[k] + 4.4, ly); } }
          else txt(lines[k], colX[k] + (last ? cols[k][1] - 1 : 0), ly, { align: last ? 'right' : 'left' });
        });
        y += rh; stroke(LINE); doc.setLineWidth(0.2); doc.line(M, y, XR, y);
      });
      y += 4;
      font('normal', 7.4, INK2); const lg = wrap(legendeText, CW); txt(lg, M, y + 2.5, { lineHeightFactor: 1.25 }); y += lg.length * 3.2 + 8;
    }
    function ausstattung() {
      const halb = (CW - 5) / 2;
      const gleich = (fn, sonst) => { const v = wins.map(fn); return v.length && v.every((x) => x === v[0]) ? v[0] : (sonst || 'unterschiedlich, siehe Positionen'); };
      const flaeche = wins.reduce((a, x) => { const d = AW.derive(x); return a + (d.elW && d.elH ? d.elW * d.elH / 1e6 * (num(x.anzahl) || 1) : 0); }, 0);
      const groesste = wins.reduce((best, x) => { const d = AW.derive(x); return !best || d.elW * d.elH > best.a ? { a: d.elW * d.elH, n: x.name || 'Fenster', d: d } : best; }, null);
      const etagen = wins.map((x) => AW.lab('etage', x.etage) || 'EG').filter((v, k, a) => a.indexOf(v) === k).join(', ');
      const ausst = [['Material', gleich((x) => (offen(x, 'material') ? 'offen' : AW.lab('material', x.material) || 'Kunststoff'))], ['Farbe außen', gleich((x) => (AW.istOffen(x, 'fa') ? 'offen' : AW.farbe(x, 'aussen')[0]))], ['Farbe innen', gleich((x) => AW.farbe(x, 'innen')[0])], ['Glas', gleich((x) => (offen(x, 'glas') ? 'offen' : AW.lab('glas', x.glas) || '3-fach') + (offen(x, 'glasfn') ? ', Extras offen' : (x.glasfn || []).length ? ', ' + x.glasfn.map((g) => AW.lab('glasfn', g)).join(', ') : ''))], ['Sprossen', gleich((x) => ((x.bars || []).length ? (offen(x, 'spross') ? 'Art offen' : AW.lab('spross', x.spross)) : 'keine'))], ['Sonnenschutz außen', gleich((x) => (offen(x, 'sart') ? 'offen' : AW.sonne(x)))], ['Sonnenschutz innen', gleich((x) => (offen(x, 'iart') ? 'offen' : AW.innen(x)))], ['Insektenschutz', gleich((x) => (offen(x, 'insekt') ? 'offen' : AW.lab('insekt', x.insekt) || 'keiner'))], ['Montage', gleich((x) => AW.montageText(x))]];
      const zahlen = [['Positionen', String(wins.length)], ['Elemente', String(nE)], ['Fensterfläche', flaeche ? 'etwa ' + flaeche.toFixed(1).replace('.', ',') + ' m² (Element, alle Stück)' : '–'], ['Größtes Element', groesste && groesste.d.elW ? groesste.n + ', ' + th(groesste.d.elW) + ' × ' + th(groesste.d.elH) + ' mm' : '–'], ['Geschosse', etagen || '–'], ['Fotos', nF ? nF + (nA ? ', von der KI ausgewertet' : '') : 'keine'], ['Maße', komplett ? 'alle 8 Handmaße je Fenster' : wins.filter((x) => AW.massLuecken(x).length).length + ' Position(en) mit Lücken', komplett ? null : { offen: true }]].concat(V === 'betrieb' ? [['Ihr Abzug', ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben' + (ab.unten ? ', ' + ab.unten + ' mm unten (Fenster)' : '') + (ab.untenT ? ', ' + ab.untenT + ' mm unten (Türen)' : '')]] : []);
      const oA = { lw: 27, fs: FS }, oZ = { lw: 28, fs: FS }, ha = 11 + zeilenH(ausst, halb - 8, oA) + 3, hz = 11 + zeilenH(zahlen, halb - 8, oZ) + 3, hh = Math.max(ha, hz);
      platz(hh);
      karteRand(M, y, halb, hh); kicker('Ausstattung im Überblick', M + 4, y + 6, GREY); zeilen(ausst, M + 4, y + 9, halb - 8, oA);
      karteRand(M + halb + 5, y, halb, hh); kicker('Zahlen', M + halb + 9, y + 6, GREY); zeilen(zahlen, M + halb + 9, y + 9, halb - 8, oZ);
      y += hh + 7;
    }
    /* Alle Elemente im selben Maßstab */
    function massstab() {
      const maxH = wins.reduce((a, x) => Math.max(a, AW.derive(x).elH || 1200), 0), maxW = wins.reduce((a, x) => Math.max(a, AW.derive(x).elW || 1000), 0), perRow = Math.min(wins.length, 6), slot = (CW - 8) / perRow, zeilenN = Math.ceil(wins.length / perRow), sc = Math.min(30 / maxH, (slot - 10) / maxW), rowH = maxH * sc + 17, gh = 12 + zeilenN * rowH + 2;
      platz(gh);
      karteRand(M, y, CW, gh); kicker('Alle Elemente im selben Maßstab', M + 4, y + 6, GREY);
      wins.forEach((w, k) => {
        const d = AW.derive(w), ww = (d.elW || 1000) * sc, wh = (d.elH || 1200) * sc, r = Math.floor(k / perRow), c = k % perRow;
        const cx0 = M + 4 + c * slot + slot / 2, base = y + 10 + r * rowH + maxH * sc;
        const pl = AW.plan(w, { nurElement: true, b: ww, h: wh, fs: 1.4 }); planZeichnen(pl, cx0 - ww / 2, base - pl.h);
        font('bold', 7.4, INK); txt(wrap((k + 1) + ' · ' + (w.name || 'Fenster'), slot - 4)[0], cx0, base + 4.4, { align: 'center' });
        font('normal', 7, INK2); txt(d.elW ? th(d.elW) + ' × ' + th(d.elH) + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stk.' : '') : 'Maße offen', cx0, base + 8, { align: 'center' });
      });
      y += gh + 6;
    }
    /* Aufmaß-Code mit der Anleitung zum Übernehmen (für Fensterbauer, die eeziframes nutzen möchten) */
    function codeTeil() {
      if (!e.code && !e.beispiel) return;
      platz(70);
      codeSeite = seiteNr();
      sektion('Für Fensterbauer · kostenlos bis 3 Projekte', 'Aufmaß digital übernehmen.');
      const qs = 28, qx = XR - qs;
      [['Kostenlos registrieren', HOST + ' oder den QR-Code scannen'], ['„Code vom Kunden einfügen“', 'den Aufmaß-Code unten einsetzen, Leerzeichen und Umbrüche stören nicht'], ['Projekt ist da', 'je Position mit Zeichnung, Klärungsliste und Bestellmaß nach Ihrem Abzug']].forEach((st, k) => { fill(INK); doc.circle(M + 4, y + 4 + k * 10.5, 4, 'F'); font('extra', 9, '#ffffff'); txt(String(k + 1), M + 4, y + 5.4 + k * 10.5, { align: 'center' }); font('bold', 9.2, INK); txt(st[0], M + 11, y + 3.4 + k * 10.5); font('normal', 8, INK2); txt(st[1], M + 11, y + 7.6 + k * 10.5); });
      qr(qx, y - 2, qs); font('normal', 7.2, INK2); txt('Scannen: Anmeldung', qx + qs / 2, y + qs + 2, { align: 'center' });
      y += 36;
      if (!e.code) { karteRand(M, y, CW, 17); kicker('Aufmaß-Code für eeziframes', M + 4, y + 6, INK); font('normal', 8.2, INK2); txt('Im echten Aufmaßblatt steht hier der Aufmaß-Code. In diesem Beispiel bleibt er leer.', M + 4, y + 12); y += 21; return; }
      /* Courier, damit sich der Code aus jedem PDF-Programm sauber kopieren lässt */
      font('mono', 6.2); const zeilen2 = doc.splitTextToSize(e.code, CW - 8), zh2 = 2.7;
      let k = 0, erster = true;
      while (k < zeilen2.length) {
        const frei = Math.floor((unten() - y - (erster ? 12 : 8)) / zh2);
        if (frei < 6) { neueSeite(); continue; }
        const teil = zeilen2.slice(k, k + frei), hh = teil.length * zh2 + (erster ? 12 : 8);
        karteRand(M, y, CW, hh);
        if (erster) { kicker('Aufmaß-Code für eeziframes', M + 4, y + 5.6, INK); font('normal', 7.2, INK2); txt('Maße, Wünsche und Fotoauswertung aller Positionen; als Text markieren und kopieren.', XR - 4, y + 5.6, { align: 'right' }); }
        font('mono', 6.2, '#3a3a3f'); let cy2 = y + (erster ? 10.6 : 6);
        teil.forEach((z) => { txt(z, M + 4, cy2); cy2 += zh2; });
        y += hh + 3; k += teil.length; erster = false;
      }
    }
    /* Für Fensterbauer: eeziframes für die eigenen Kunden. Gestaltet wie normaler Inhalt, nicht wie Werbung. */
    const EIGENE_H = 46;
    function eigeneKunden() {
      platz(EIGENE_H + 4);
      const y0 = y;
      karteRand(M, y0, CW, EIGENE_H);
      const qs = 25, qx = XR - qs - 5, qy = y0 + 5, tx = M + 5, tw2 = qx - tx - 6;
      kicker('Für Fensterbauer · Aufmaße Ihrer eigenen Kunden', tx, y0 + 6.6, GRUEN_T);
      font('extra', 11.5, INK); const t1 = wrap('Ihre Kunden messen selbst. Sie fahren erst zum Feinaufmaß.', tw2); txt(t1, tx, y0 + 12.8, { lineHeightFactor: 1.1 });
      let yy = y0 + 12.8 + t1.length * 4.6 + 0.6;
      font('normal', 8, INK2); const t2 = wrap('Projekt in eeziframes anlegen, Aufmaß-Link per WhatsApp oder E-Mail schicken. Zurück kommt ein Aufmaß wie dieses: 8 Maße je Fenster, Fotos mit Auswertung, alle Wünsche, Bestellmaß nach Ihrem Abzug, das Blatt mit Ihrem Logo.', tw2); txt(t2, tx, yy, { lineHeightFactor: 1.22 }); yy += t2.length * 3.45 + 1.6;
      font('bold', 8, INK); txt('3 Projekte kostenlos · danach 9 € netto je Projekt mit eingegangenem Aufmaß · keine Grundgebühr', tx, yy); yy += 4.2;
      font('normal', 7, GREY); txt(wrap('Zum Vergleich: Eine Meisterstunde kostet im Schnitt 65,14 € netto (Preisatlas Handwerk 2024).', tw2)[0], tx, yy);
      qr(qx, qy, qs); font('normal', 7, INK2); txt('Scannen: Projekt anlegen', qx + qs / 2, qy + qs + 3.4, { align: 'center' }); font('bold', 7, INK); txt(HOST, qx + qs / 2, qy + qs + 6.8, { align: 'center' });
      y += EIGENE_H + 6;
    }

    if (wins.length) wins.forEach((w, i) => position(w, i));
    else { font('normal', 10, GREY); txt('Noch kein Fenster erfasst.', M, y + 6); y += 12; }
    if (wins.length > 1) { neueSeite(); if (EIGENE) tabelle(); ausstattung(); massstab(); }
    if (EIGENE) { if (wins.length <= 1 || y + 90 > unten()) neueSeite(); codeTeil(); eigeneKunden(); }

    fuss();
    return doc.output('blob');
  }
  return { pdf: pdf, schrift: schrift };
})();

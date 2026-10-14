/* Fensterino · Modell und Abrechnung, gemeinsam für Betriebsbereich (Browser) und Server (Cloudflare Worker)
   window.AW          Fenster-Modell: Felder, Beschriftungen, Ableitungen, Zeichnung als SVG
   window.Abrechnung  Regeln: Tarife, Buchung je Projekt, Kontingente, Nachbesserung, Code-Eingang, Projekte anlegen
   Keine Oberfläche, kein Speicher: Alle Funktionen arbeiten auf einem Konto-Objekt a = { konto, pay, freeUsed, freeQuota, dupOf, downgrade, book, links, notif, abzug, ... }
   und geben zurück, was passiert ist. Im Browser speichert der Betriebsbereich, auf dem Server die Datenbank. */
(function (root, factory) {
  const api = factory();
  root.AW = api.AW; root.Abrechnung = api.Abrechnung;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
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

  /* ---------- Abrechnung ---------- */
  const Abrechnung = (() => {
    /* Preise netto für Betriebe, brutto für Hauseigentümer; aus /config.js bzw. vom Server (/api/status) überschreibbar */
    const PREISE0 = { aufmass: 7.99, projekt: 9, frei: 3, abo: { grund: 49, inkl: 10, extra: 5 }, plus: 79, mwst: true, freiTage: 14 };
    let PREISE = JSON.parse(JSON.stringify(PREISE0));
    if (typeof window !== 'undefined' && window.KONFIG && window.KONFIG.preise) PREISE = Object.assign({}, PREISE, window.KONFIG.preise, { abo: Object.assign({}, PREISE.abo, window.KONFIG.preise.abo || {}) });
    function setPreise(p) { if (!p) return PREISE; PREISE = Object.assign({}, PREISE, p, { abo: Object.assign({}, PREISE.abo, p.abo || {}) }); return PREISE; }
    const preise = () => PREISE;
    const RANG = { service: 0, abo: 1, plus: 2 };
    const PLAN_NAME = { service: 'Start', abo: 'Abo 10', plus: 'Plus' };
    const planName = (k) => PLAN_NAME[k] || PLAN_NAME.service;
    const konto = (a) => (RANG[a.konto] !== undefined ? a.konto : 'service');
    const NB_MAX = 2, NB_TAGE = 30;
    const two = (n) => String(n).padStart(2, '0');
    const d0 = (now) => new Date(now || Date.now());
    const monthKey = (now) => { const d = d0(now); return d.getFullYear() + '-' + two(d.getMonth() + 1); };
    const monthLabel = (now) => d0(now).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const monthEnd = (now) => { const d = d0(now), e = new Date(d.getFullYear(), d.getMonth() + 1, 0); return two(e.getDate()) + '.' + two(e.getMonth() + 1) + '.' + e.getFullYear(); };
    const stamp = (now) => { const d = d0(now); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '., ' + two(d.getHours()) + ':' + two(d.getMinutes()); };
    const datum = (now) => { const d = d0(now); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); };
    const dateIn = (days, now) => { const d = d0(now); d.setDate(d.getDate() + days); return datum(d.getTime()); };
    const parseDE = (s) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59) : null; };
    const hashN = (s) => String(s).split('').reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7);
    const nW = (n, one, many) => n + ' ' + (n === 1 ? one : many);
    const newCode = () => Math.random().toString(36).slice(2, 7).replace(/[^a-z0-9]/g, 'x').padEnd(5, '7');
    const newId = (p) => (p || 'l') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    function nextNr(a, now) { const y = d0(now).getFullYear(), mx = (a.links || []).reduce((m, l) => { const k = /-(\d+)$/.exec(l.nr || ''); return k ? Math.max(m, +k[1]) : m; }, 0); return 'P-' + y + '-' + String(mx + 1).padStart(3, '0'); }
    const normTel = (t) => { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && d.length > 10) d = '0' + d.slice(2); return d; };
    const normFirma = (n) => String(n || '').toLowerCase().replace(/\b(gmbh|ug|gbr|kg|ohg|e\.?\s?k\.?|inh\.?|&\s?co\.?)\b/g, '').replace(/[^a-z0-9äöüß]/g, '');

    /* ---------- Aufmaß-Code aus der App lesen ---------- */
    function unpack(code) {
      try {
        const m = /(?:AM1|ZF1|FE1|LM1)\.([A-Za-z0-9_-]+)/.exec(String(code || '').replace(/\s+/g, '')); if (!m) return null;
        const b = m[1].replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const text = new TextDecoder().decode(bytes), ende = text.lastIndexOf('}'); const o = JSON.parse(ende > 0 ? text.slice(0, ende + 1) : text);
        return o && Array.isArray(o.w) ? o : null;
      } catch (e) { return null; }
    }
    /* Fenster aus der App vollständig übernehmen: gleiche Felder, fehlende Werte sind App-Standard */
    const fromApp = (w) => AW.mk(Object.assign({}, w, { name: w.name || 'Fenster' }));
    function fingerprint(o) { try { return hashN(JSON.stringify([o.w, o.p])); } catch (e) { return 0; } }
    function fromAppProj(p) { p = p || {}; return { gebaeude: p.gebaeude || '', baujahr: p.baujahr || '', total: AW.num(p.total) || 0, zeit: p.zeit || '', budget: p.budget || '', foerd: !!p.foerd, notiz: String(p.notiz || '').replace(/\s+/g, ' ').trim().slice(0, 600) }; }
    const aufmassOf = (wins, proj) => ({ windows: wins, proj: proj, fotos: wins.reduce((s, w) => s + (w.fotos || 0), 0), elemente: wins.reduce((s, w) => s + (AW.num(w.anzahl) || 1), 0) });

    /* ---------- Buchungen ----------
       1. Gebucht wird beim ersten Eingang je Projekt, zum Tarif, der in diesem Moment gilt; Nachbesserungen im selben Projekt kosten nichts. Eine Buchung wird nie geändert oder gelöscht.
       2. Start: die ersten 3 Projekte je Betrieb frei (zählt über die Buchungen), danach 9 € je Projekt, nur mit Zahlungsart.
       3. Abo 10: 49 € im Monat, 10 Projekte im Kalendermonat inklusive, jedes weitere 5 €. Plus: 79 € im Monat, unbegrenzt.
       4. Ohne Zahlungsart bleibt ein kostenpflichtiges Aufmaß gesperrt: es kommt an, wird gespeichert, die Maße bleiben verborgen, bis eine Zahlungsart da ist. */
    const freeQuota = (a) => (a.freeQuota != null ? a.freeQuota : PREISE.frei);
    function ledger(a) {
      if (!a.book) { a.book = []; a.freeUsed = 0; (a.links || []).slice().reverse().filter((l) => l.status === 'eingegangen' && !l.demo).forEach((l) => { l.locked = !bookAufmass(a, l); }); }
      return a.book;
    }
    const freeLeft = (a) => { ledger(a); return Math.max(0, freeQuota(a) - (a.freeUsed || 0)); };
    const lockedLinks = (a) => (a.links || []).filter((l) => l.status === 'eingegangen' && l.locked && !l.demo);
    const aboGenutzt = (a, now) => { const k = monthKey(now); return ledger(a).filter((b) => b.kind === 'aufmass' && b.inkl && b.month === k).length; };
    const aboFrei = (a, now) => Math.max(0, PREISE.abo.inkl - aboGenutzt(a, now));
    function bookAufmass(a, l, extra, now) {
      const book = a.book || (a.book = []), ref = extra ? l.id + '#' + extra : l.id;
      if (book.some((b) => b.kind === 'aufmass' && b.ref === ref)) return true;
      const am = l.aufmass || {}, sub = [((l.log || {}).eingegangen || stamp(now)), l.nr, am.windows ? nW(am.windows.length, 'Position', 'Positionen') : '', extra ? 'anderes Aufmaß in Runde ' + extra : ''].filter(Boolean).join(' · ');
      let betrag = 0, badge, inkl = false;
      const k = konto(a);
      if (k === 'plus') badge = 'inklusive (Plus)';
      else if (k === 'abo') {
        const genutzt = aboGenutzt(a, now);
        if (genutzt < PREISE.abo.inkl) { badge = 'inklusive (Abo, ' + (genutzt + 1) + ' von ' + PREISE.abo.inkl + ')'; inkl = true; }
        else if (a.pay) { betrag = PREISE.abo.extra; badge = 'nächste Rechnung, über dem Kontingent'; }
        else return false;
      } else if (freeQuota(a) - (a.freeUsed || 0) > 0) { a.freeUsed = (a.freeUsed || 0) + 1; badge = 'kostenlos, ' + a.freeUsed + ' von ' + freeQuota(a); }
      else if (a.pay) { betrag = PREISE.projekt; badge = 'nächste Rechnung'; }
      else return false;
      book.unshift({ id: newId('b'), kind: 'aufmass', ref: ref, when: stamp(now), month: monthKey(now), text: 'Aufmaß · ' + l.kunde, sub: sub, betrag: betrag, badge: badge, status: 'offen', inkl: inkl });
      return true;
    }
    /* Ein Aufmaß kommt an: speichern, buchen oder sperren; Rückgabe sagt, ob es sichtbar ist, und was dem Betrieb gemeldet wird */
    function receiveAufmass(a, l, aufmass, via, now) {
      ledger(a);
      l.status = 'eingegangen'; l.progress = 4; l.via = l.via || via || 'Code'; l.log = l.log || {}; l.log.eingegangen = stamp(now); l.eingegangenAt = now || Date.now(); l.aufmass = aufmass; l.stage = 'neu'; l.runde = l.runde || 1;
      l.locked = l.demo ? false : !bookAufmass(a, l, null, now);
      const size = nW(aufmass.windows.length, 'Position', 'Positionen') + ' mit ' + nW(aufmass.fotos || 0, 'Foto', 'Fotos');
      return { ok: !l.locked, notif: l.locked ? { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. Zum Ansehen eine Zahlungsart hinterlegen; Ihre kostenlosen Aufmaße sind verbraucht.', to: ['link', l.id] } : { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. ' + (l.nr || ''), to: ['link', l.id] } };
    }
    /* Nach Zahlungsart oder Tarifwechsel: wartende Aufmaße freischalten, ältestes zuerst */
    function unlockWaiting(a, now) { let n = 0; lockedLinks(a).slice().reverse().forEach((l) => { if (bookAufmass(a, l, null, now)) { l.locked = false; n++; } }); return n; }
    function bookPlan(a, k, now) {
      const key = monthKey(now), preis = k === 'plus' ? PREISE.plus : PREISE.abo.grund;
      const schon = ledger(a).filter((b) => (b.kind === 'plus' || b.kind === 'abo') && b.month === key);
      if (!schon.length) { a.book.unshift({ id: newId('p'), kind: k, month: key, when: stamp(now), text: planName(k) + ' · ' + monthLabel(now), sub: 'monatlich, bis ' + monthEnd(now) + ', monatlich kündbar', betrag: preis, badge: 'nächste Rechnung', status: 'offen' }); return; }
      /* im selben Monat von Abo 10 auf Plus: nur der Aufpreis */
      if (k === 'plus' && !schon.some((b) => b.kind === 'plus')) a.book.unshift({ id: newId('p'), kind: 'plus', month: key, when: stamp(now), text: 'Plus · ' + monthLabel(now) + ', Aufpreis', sub: 'Wechsel von Abo 10, bis ' + monthEnd(now), betrag: Math.max(0, PREISE.plus - PREISE.abo.grund), badge: 'nächste Rechnung', status: 'offen' });
    }
    /* Tarif wechseln: nach oben sofort (Monat wird gebucht), nach unten zum Monatsende vorgemerkt. Rückgabe: was passiert ist */
    function planWechsel(a, k, now) {
      const alt = konto(a); k = RANG[k] !== undefined ? k : 'service';
      if (k === alt) { if (a.downgrade) { a.downgrade = null; return { art: 'bleibt', msg: planName(k) + ' läuft weiter' }; } return { art: 'gleich', msg: planName(k) + ' ist schon Ihr Tarif' }; }
      if (RANG[k] > RANG[alt]) {
        if (!a.pay && k !== 'service') return { art: 'zahlungsart', msg: 'Für ' + planName(k) + ' brauchen wir eine Zahlungsart.' };
        const key = monthKey(now), aufpreis = k === 'plus' && ledger(a).some((b) => b.kind === 'abo' && b.month === key) && !ledger(a).some((b) => b.kind === 'plus' && b.month === key);
        a.konto = k; a.downgrade = null; bookPlan(a, k, now); const n = unlockWaiting(a, now);
        return { art: 'aktiv', n: n, msg: planName(k) + ' aktiv, ' + (aufpreis ? 'Aufpreis ' + (PREISE.plus - PREISE.abo.grund) : (k === 'plus' ? PREISE.plus : PREISE.abo.grund)) + ' € für ' + monthLabel(now) + (n ? '. ' + nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : '') };
      }
      a.downgrade = { to: k, at: monthEnd(now) };
      return { art: 'vorgemerkt', msg: 'Vorgemerkt: ' + planName(alt) + ' läuft bis ' + monthEnd(now) + ', danach ' + planName(k) };
    }
    /* Beim Start und einmal pro Minute: was die Zeit erledigt. Rückgabe: Meldungen für den Betrieb */
    function tickKonto(a, now) {
      now = now || Date.now(); const out = []; let dirty = false;
      if (a.downgrade) { const d = parseDE(a.downgrade.at); if (d && now > d.getTime()) { const alt = konto(a); a.konto = a.downgrade.to; a.downgrade = null; dirty = true; out.push({ t: 'Tarif gewechselt', s: planName(alt) + ' ist ausgelaufen, wie vorgemerkt. Jetzt: ' + planName(konto(a)) + '.', to: ['abrechnung'] }); } }
      if ((konto(a) === 'plus' || konto(a) === 'abo') && a.pay && !ledger(a).some((b) => (b.kind === 'plus' || b.kind === 'abo') && b.month === monthKey(now))) { bookPlan(a, konto(a), now); dirty = true; }
      (a.links || []).forEach((l) => { if (['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)) { const d = parseDE(l.expires); if (d && now > d.getTime()) { l.status = 'abgelaufen'; l.log = l.log || {}; l.log.abgelaufen = l.expires; dirty = true; } } });
      return { dirty: dirty, notifs: out };
    }

    /* ---------- Nachbesserung: gleiche Position = gleicher Name oder gleiche Maße (±3 %). Ohne jede Überschneidung ist es ein anderes Aufmaß. ---------- */
    const nahMm = (x, y) => x && y && Math.abs(x - y) <= Math.max(30, 0.03 * Math.max(x, y));
    function passt(alt, neu) { const da = AW.derive(alt), dn = AW.derive(neu); return (!!neu.name && !!alt.name && neu.name.trim().toLowerCase() === alt.name.trim().toLowerCase()) || (nahMm(dn.elW || dn.moW, da.elW || da.moW) && nahMm(dn.elH || dn.moH, da.elH || da.moH)); }
    function ueberschneidung(alt, neu) { const A0 = (alt && alt.windows) || [], N0 = (neu && neu.windows) || []; if (!A0.length || !N0.length) return 1; return N0.filter((n) => A0.some((x) => passt(x, n))).length / N0.length; }
    function nbMoeglich(l, now) {
      if (!l || l.status !== 'eingegangen' || l.locked || l.demo) return '';
      if ((l.runde || 1) > NB_MAX) return 'Zwei Nachbesserungen sind das Maximum. Für mehr legen Sie ein neues Projekt an.';
      if (l.eingegangenAt && (now || Date.now()) - l.eingegangenAt > NB_TAGE * 864e5) return 'Eine Nachbesserung ist bis ' + NB_TAGE + ' Tage nach dem Eingang möglich.';
      return 'ok';
    }
    function nbAnfragen(l, hinweis, now) {
      const ok = nbMoeglich(l, now); if (ok !== 'ok') return { ok: false, msg: ok || 'Keine Nachbesserung möglich.' };
      l.nb = { runde: (l.runde || 1) + 1, hinweis: String(hinweis || '').trim().slice(0, 300), when: stamp(now), offen: true };
      l.msg = ''; l.expires = dateIn(PREISE.freiTage || 14, now); l.log = l.log || {}; l.log.nbangefragt = stamp(now);
      return { ok: true, msg: 'Nachbesserung angefragt. Jetzt den Link noch einmal an ' + l.kunde + ' schicken.' };
    }
    function nbZurueck(l) { if (l && l.nb) { l.nb.offen = false; l.msg = ''; } return { ok: true, msg: 'Nachbesserung zurückgezogen. Das bisherige Aufmaß bleibt.' }; }

    /* ---------- Projekte anlegen ---------- */
    function neuesProjekt(a, f, now) {
      f = f || {}; const days = [7, 14, 30].includes(+f.days) ? +f.days : 14, codes = (a.links || []).map((l) => l.code);
      let code = newCode(); while (codes.includes(code)) code = newCode();
      const l = { id: newId('l'), code: code, nr: nextNr(a, now), kunde: String(f.kunde || '').trim().slice(0, 60), kontakt: String(f.kontakt || '').trim().slice(0, 80), adresse: String(f.adresse || '').trim().slice(0, 120), geb: String(f.geb || '').slice(0, 20), fz: String(f.fz || '').slice(0, 20), plan: Array.isArray(f.plan) ? f.plan.slice(0, 8).map((x) => String(x).slice(0, 30)) : [], note: String(f.note || '').trim().slice(0, 600), created: datum(now), days: days, expires: dateIn(days, now), status: 'erstellt', progress: 0, via: '', du: !!f.du, log: { erstellt: stamp(now) } };
      if (l.kunde.length < 2) return { ok: false, msg: 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.' };
      a.links = a.links || []; a.links.unshift(l);
      return { ok: true, l: l };
    }
    function listeProjekte(a, text, du, now) {
      const zeilen = String(text || '').split(/\n+/).map((z) => z.trim()).filter(Boolean).slice(0, 50), neu = [];
      zeilen.forEach((z) => { const teile = z.split(/[;,\t]/).map((t) => t.trim()).filter(Boolean); const kunde = teile[0] || '', kontakt = teile.slice(1).find((t) => /@/.test(t) || t.replace(/\D/g, '').length >= 6) || ''; if (kunde.length < 2) return; const r = neuesProjekt(a, { kunde: kunde, kontakt: kontakt, plan: ['Fenster'], note: 'aus Einladungsliste', days: 14, du: du }, now); if (r.ok) neu.push(r.l); });
      return neu;
    }
    /* Markierungen am Projekt: gesendet, Anrede, Laufzeit, Stand, Notizen, deaktivieren */
    function projektAendern(l, p, now) {
      if (!l) return { ok: false, msg: 'Projekt nicht gefunden.' };
      if (p.gesendet && l.status === 'erstellt') { l.status = 'gesendet'; l.via = String(p.via || 'Link').slice(0, 30); l.log = l.log || {}; l.log.gesendet = stamp(now); }
      if (p.du !== undefined) { l.du = !!p.du; l.msg = ''; }
      if (p.days && [7, 14, 30].includes(+p.days)) { l.days = +p.days; l.expires = dateIn(+p.days, now); }
      if (p.stage && ['neu', 'angebot', 'termin', 'auftrag', 'verloren'].includes(p.stage)) l.stage = p.stage;
      if (p.note !== undefined) l.note = String(p.note).slice(0, 600);
      if (p.memo !== undefined) l.memo = String(p.memo).slice(0, 600);
      if (p.msg !== undefined) l.msg = String(p.msg).slice(0, 1500);
      if (p.seen) l.seen = true;
      if (p.deaktivieren) { if (l.status === 'eingegangen') return { ok: false, msg: 'Ein eingegangenes Aufmaß bleibt im Projekt und in der Abrechnung' }; l.status = 'deaktiviert'; }
      if (p.nb) return nbAnfragen(l, p.nb.hinweis, now);
      if (p.nbZurueck) return nbZurueck(l);
      return { ok: true };
    }

    /* ---------- Eingang eines Aufmaß-Codes (aus der App direkt oder eingefügt): neues Projekt, Nachbesserung oder Teil-Nachbesserung ---------- */
    function importCode(a, o, now, via) {
      now = now || Date.now(); a.links = a.links || [];
      if (!o || !Array.isArray(o.w)) return { ok: false, art: 'fehler', msg: 'Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.' };
      let l = o.b ? a.links.find((x) => x.code === o.b) : null;
      if (o.b && !l) return { ok: false, art: 'fremd', msg: 'Dieser Code gehört zu keinem Ihrer Projekte.' };
      if (l && l.status === 'eingegangen' && !(l.nb && l.nb.offen && (o.r || 1) >= l.nb.runde)) return { ok: false, art: 'schon', l: l, msg: l.nb && l.nb.offen ? 'Dieser Code ist noch die alte Fassung. Der Kunde muss das Aufmaß über den Nachbesserungs-Link erneut abschicken.' : 'Dieses Aufmaß ist schon eingegangen. Für eine Korrektur fragen Sie im Projekt eine Nachbesserung an.' };
      if (l && l.status === 'eingegangen') {
        const fp2 = fingerprint(o), wins2 = (o.w || []).map(fromApp), am2 = aufmassOf(wins2, fromAppProj(o.p || {})); am2.fp = fp2;
        const q = ueberschneidung(l.aufmass, am2), neu = q === 0, gleich = !!(l.aufmass && l.aufmass.fp === fp2);
        (l.vorher = l.vorher || []).push({ runde: l.runde || 1, when: (l.log || {}).eingegangen || '', aufmass: l.aufmass });
        /* Kunde ohne gespeicherte Angaben (anderes Gerät) schickt nur die betroffenen Fenster: passende Positionen ersetzen, übrige behalten */
        if (o.m && !neu && l.aufmass && l.aufmass.windows) { const alt = l.aufmass.windows, rest = alt.filter((x) => !wins2.some((w) => passt(x, w))); am2.windows = rest.concat(wins2); am2.fotos = am2.windows.reduce((s2, w) => s2 + (w.fotos || 0), 0); am2.elemente = am2.windows.reduce((s2, w) => s2 + (AW.num(w.anzahl) || 1), 0); am2.proj = Object.assign({}, l.aufmass.proj || {}, am2.proj || {}); }
        l.aufmass = am2; l.runde = l.nb.runde; l.nb.offen = false; l.nb.fertig = stamp(now); l.log = l.log || {}; l.log.nachbesserung = stamp(now); l.seen = false; l.stage = l.stage === 'verloren' ? 'neu' : l.stage;
        if (neu) { l.locked = !bookAufmass(a, l, l.runde, now); return { ok: true, art: 'nb-neu', l: l, feier: 'eingang', msg: 'Übernommen. Das ist ein anderes Aufmaß, es wurde als neues gebucht.', notif: { t: 'Anderes Aufmaß in Projekt ' + (l.nr || ''), s: 'Die Nachbesserung hat keine Position mit dem bisherigen Aufmaß gemeinsam und wurde wie ein neues Aufmaß gebucht.', to: ['link', l.id] } }; }
        return { ok: true, art: 'nb', l: l, feier: 'eingang', msg: gleich ? 'Nachbesserung übernommen, der Kunde hat nichts geändert. Nichts berechnet.' : (o.m ? 'Nachbesserung ergänzt, nichts berechnet: ' : 'Nachbesserung übernommen, nichts berechnet: ') + l.kunde, notif: { t: 'Nachbesserung eingegangen: ' + l.kunde, s: nW(wins2.length, 'Position', 'Positionen') + ', Runde ' + l.runde + '. Nichts berechnet.', to: ['link', l.id] } };
      }
      if (l && l.status === 'deaktiviert') return { ok: false, art: 'deaktiviert', l: l, msg: 'Dieser Link wurde deaktiviert. Für ein neues Aufmaß legen Sie ein neues Projekt an.' };
      const fp = fingerprint(o), schon = a.links.find((x) => x.aufmass && x.aufmass.fp === fp);
      if (schon) return { ok: false, art: 'doppelt', l: schon, msg: 'Dieses Aufmaß ist schon da: ' + schon.kunde };
      const war = l && l.status === 'abgelaufen', wins = (o.w || []).map(fromApp), p = o.p || {};
      if (!l) { l = { id: newId('l'), code: newCode(), nr: nextNr(a, now), kunde: String(p.name || 'Kunde ohne Projekt').slice(0, 60), kontakt: String(p.tel || p.mail || '').slice(0, 80), adresse: String(p.ort || '').slice(0, 120), geb: '', fz: '', plan: [], note: 'direkt vom Kunden, per Code übernommen', created: datum(now), expires: dateIn(14, now), status: 'gesendet', progress: 0, via: 'Code', du: false, log: { erstellt: stamp(now), gesendet: stamp(now) } }; a.links.unshift(l); }
      l.seen = false; l.log = l.log || {}; l.log.gesendet = l.log.gesendet || stamp(now); l.log.geoeffnet = l.log.geoeffnet || stamp(now); l.log.arbeit = l.log.arbeit || stamp(now);
      const am = aufmassOf(wins, fromAppProj(p)); am.fp = fp;
      const r = receiveAufmass(a, l, am, via || 'Code', now);
      return { ok: true, art: 'neu', l: l, feier: r.ok ? 'eingang' : '', locked: !r.ok, notif: r.notif, msg: r.ok ? (war ? 'Link war abgelaufen, Aufmaß trotzdem übernommen: ' : 'Aufmaß übernommen: ') + l.kunde : 'Aufmaß übernommen. Zum Ansehen Zahlungsart hinterlegen' };
    }
    /* Fortschritt aus der App (Link geöffnet, misst): ohne Buchung */
    function fortschritt(l, stufe, k, now) {
      if (!l || ['eingegangen', 'deaktiviert', 'abgelaufen'].includes(l.status)) return false;
      l.log = l.log || {};
      if (stufe === 'geoeffnet' && ['erstellt', 'gesendet'].includes(l.status)) { l.status = 'geoeffnet'; l.log.geoeffnet = stamp(now); return true; }
      if (stufe === 'arbeit') { if (l.status !== 'arbeit') { l.status = 'arbeit'; l.log.arbeit = stamp(now); } l.progress = Math.max(l.progress || 0, Math.min(4, +k || 0)); return true; }
      return false;
    }

    return { preise: preise, setPreise: setPreise, planName: planName, konto: konto, RANG: RANG, NB_MAX: NB_MAX, NB_TAGE: NB_TAGE, monthKey: monthKey, monthLabel: monthLabel, monthEnd: monthEnd, stamp: stamp, datum: datum, dateIn: dateIn, parseDE: parseDE, hashN: hashN, nW: nW, newCode: newCode, newId: newId, nextNr: nextNr, normTel: normTel, normFirma: normFirma,
      unpack: unpack, fromApp: fromApp, fingerprint: fingerprint, fromAppProj: fromAppProj, aufmassOf: aufmassOf,
      freeQuota: freeQuota, ledger: ledger, freeLeft: freeLeft, lockedLinks: lockedLinks, aboGenutzt: aboGenutzt, aboFrei: aboFrei, bookAufmass: bookAufmass, receiveAufmass: receiveAufmass, unlockWaiting: unlockWaiting, bookPlan: bookPlan, planWechsel: planWechsel, tickKonto: tickKonto,
      passt: passt, ueberschneidung: ueberschneidung, nbMoeglich: nbMoeglich, nbAnfragen: nbAnfragen, nbZurueck: nbZurueck, neuesProjekt: neuesProjekt, listeProjekte: listeProjekte, projektAendern: projektAendern, importCode: importCode, fortschritt: fortschritt };
  })();

  return { AW: AW, Abrechnung: Abrechnung };
});

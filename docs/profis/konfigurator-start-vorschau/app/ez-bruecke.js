/* Bühnenfenster der Vorschau: die echte App (assets/app.js, buehne.js, modell.js, unverändert) läuft in diesem Fenster; sichtbar ist nur
   ihre 3-D-Bühne mit Drehen, Zoom, Reglern und Hinweisen. Die Vorschau (wuensche.js) setzt das Fenster aus Schritt 1 bis 5, liest die
   laufende Frage (Texte, Optionen, Stand) und tippt in der App; jede Änderung meldet das Fenster über ezBuehne.beiAenderung.
   Korrektur des Inhabers, 27.10.2026: Detailtiefe, Bewegung und jede Wahl wie im Konfigurator, keine Standbilder. */
(function () {
  'use strict';
  var d = document;
  /* Zeichnungen der App als Strichzeichnung (wie werkzeuge/wuensche-daten.py): Flächen leer, Glas getönt, Striche 1,8 / 1,2 / 1 */
  function strich(svg) {
    if (!svg) return '';
    svg = svg.replace(/ width="\d+" height="\d+"/, '');
    svg = svg.replace(/fill="([^"]*)"/g, function (m, v) { v = v.toLowerCase(); if (v === 'none') return 'fill="none"'; if (/^#(d6e6f4|cfe0f0|dbe8f5|e3eef8)$/.test(v)) return 'fill="currentColor" fill-opacity=".12"'; if (/^#(ffffff|fff|f5f5f7|fafafa|f2f2f4)$/.test(v)) return 'fill="none"'; return 'fill="currentColor" fill-opacity=".22"'; });
    svg = svg.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
    return svg.replace(/stroke-width="([\d.]+)"/g, function (m, w) { w = parseFloat(w); return 'stroke-width="' + (w >= 1.2 ? 1.8 : w >= 0.8 ? 1.2 : 1) + '" vector-effect="non-scaling-stroke"'; });
  }
  /* Die laufende Frage, wie werkzeuge/wunsch-render.mjs sie liest */
  function lesen() {
  const s = document.querySelector('.scr'), t = (e) => (e ? e.textContent.replace(/\s+/g, ' ').trim() : ''), ar = (e, a) => (e ? e.getAttribute(a) : null);
  const h1 = s.querySelector('h1'), h1c = h1 ? h1.cloneNode(true) : null; if (h1c) h1c.querySelectorAll('button').forEach((b) => b.remove());
  const qg = h1 ? h1.querySelector('.qg, .lg-i') : null, panel = s.querySelector('.qpanel'), st = document.getElementById('w3d');
  const info = (el) => { const i = el && el.querySelector('.qinfo, .qci-i, .ibtn'); return i ? { k: ar(i, 'data-k'), label: ar(i, 'aria-label') } : null; };
  const bloecke = [];
  if (panel) [...panel.children].forEach((el) => {
    const c = el.className || '';
    /* Formen: Symbolknöpfe .qf statt Karten .qo (vorher leer ausgelesen) */
    if (/qformen/.test(c)) bloecke.push({ typ: 'karten', cls: c, opts: [...el.querySelectorAll('.qf')].map((b) => ({ act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: ar(b, 'aria-label'), sb: '', pr: '', an: ar(b, 'aria-pressed') === 'true', info: null, ico: (b.querySelector('svg') || {}).outerHTML || '' })) });
    else if (/qcards|qformen|formen/.test(c) || el.querySelector(':scope > .qo')) bloecke.push({ typ: 'karten', cls: c, opts: [...el.querySelectorAll('.qo')].map((o) => { const b = o.querySelector('.qopt'); return { act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b.querySelector('.lbl')) || ar(b, 'aria-label') || t(b), sb: t(b.querySelector('.sb')), pr: t(b.querySelector('.pr')), an: ar(b, 'aria-pressed') === 'true', info: info(o), ico: b.querySelector('svg') ? b.querySelector('svg').outerHTML : '' }; }) });
    else if (/qswatches/.test(c)) bloecke.push({ typ: 'tupfen', label: ar(el, 'aria-label'), opts: [...el.querySelectorAll('.qsw')].map((b) => ({ act: ar(b, 'data-act'), side: ar(b, 'data-side'), v: ar(b, 'data-v'), name: ar(b, 'aria-label'), farbe: (b.querySelector('.c') || {}).style ? b.querySelector('.c').style.background : '', an: ar(b, 'aria-pressed') === 'true' })) });
    else if (/fw-zeile/.test(c)) bloecke.push({ typ: 'aktuell', b: t(el.querySelector('b')), small: t(el.querySelector('small')), aktion: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b) })) });
    /* Liste ohne Begriffe: die Knöpfe stehen direkt in .qlist (vorher leer ausgelesen, z. B. „Öffnet nach innen oder außen?“) */
    else if (/qlist/.test(c)) bloecke.push({ typ: 'liste', multi: /mehrfach/i.test(t(s.querySelector('.hd > p:not(.eyebrow)'))), opts: [...(el.querySelector('.qli') ? el.querySelectorAll('.qli') : el.querySelectorAll(':scope > button'))].map((o) => { const b = o.matches('button') ? o : o.querySelector('button:not(.qci-i)'); return { act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true', info: info(o), ico: b.querySelector('svg') ? b.querySelector('svg').outerHTML : '' }; }) });
    else if (/qsteps/.test(c)) bloecke.push({ typ: 'zaehler', opts: [...el.querySelectorAll('.qstep')].map((o) => ({ b: t(o.querySelector('.t b')), small: t(o.querySelector('.t small')), wert: t(o.querySelector('.stepper b')), d: ar(o.querySelector('button'), 'data-d'), act: ar(o.querySelector('button'), 'data-act') })) });
    else if (/seg/.test(c)) bloecke.push({ typ: 'segment', opts: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true' })) });
    else if (/qchips/.test(c)) bloecke.push({ typ: 'chips', cls: c, opts: [...el.querySelectorAll('.chip')].map((b) => ({ act: ar(b, 'data-act'), f: ar(b, 'data-f'), v: ar(b, 'data-v'), lbl: t(b), an: ar(b, 'aria-pressed') === 'true', info: info(b.parentNode) })) });
    else if (/qlabel/.test(c)) bloecke.push({ typ: 'label', text: t(el) });
    else if (/^rows/.test(c)) bloecke.push({ typ: 'zeilen', opts: [...el.children].map((r) => r.classList.contains('sw-row') ? { art: 'schalter', b: t(r.querySelector('.t b')), small: t(r.querySelector('.t small')), f: ar(r.querySelector('.switch'), 'data-f'), an: ar(r.querySelector('.switch'), 'aria-checked') === 'true', info: info(r) } : r.classList.contains('trow') ? { art: 'text', label: t(r.querySelector('span')), ph: ar(r.querySelector('textarea, input'), 'placeholder'), f: ar(r.querySelector('textarea, input'), 'data-f') } : { art: 'sonst', text: t(r) }) });
    else if (/qrow/.test(c)) bloecke.push({ typ: 'hinweise', texts: [...el.children].map((x) => t(x)).filter(Boolean) });
    else if (/qoffen/.test(c)) bloecke.push({ typ: 'offen', f: ar(el, 'data-f'), b: t(el.querySelector('b')), small: t(el.querySelector('small')), an: ar(el, 'aria-pressed') === 'true' });
    else if (/qmehr/.test(c)) bloecke.push({ typ: 'mehr', v: ar(el, 'data-v'), b: t(el.querySelector('b')), small: t(el.querySelector('small')) });
    else if (/qcur/.test(c)) bloecke.push({ typ: 'aktuell', b: t(el), small: '' });
    else if (/qteile/.test(c)) bloecke.push({ typ: 'aufteilung', titel: t(el.querySelector('.qlabel')), werte: [...el.querySelectorAll('.st-wert')].map((x) => ({ b: t(x.querySelector('b')), small: t(x.querySelector('small')), label: ar(x, 'aria-label') })), regler: ar(el.querySelector('input[type="range"]'), 'aria-label'), hinweis: t(el.querySelector('.qrow')) });
    else if (/fw-mehr/.test(c)) bloecke.push({ typ: 'knoepfe', opts: [...el.querySelectorAll('button')].map((b) => ({ act: ar(b, 'data-act'), v: ar(b, 'data-v'), lbl: t(b) })) });
    else if (/fw-hinweis|sub/.test(c)) bloecke.push({ typ: 'hinweis', text: t(el) });
    else if (/farbfeld|ff-info/.test(c) && !t(el)) { /* leer, nur für „Alle Farben“ */ }
    else bloecke.push({ typ: 'sonst', cls: c, text: t(el).slice(0, 300) });
  });
  return {
    id: ar(panel, 'data-q') || (s.querySelector('.lg-haus') ? 'lage' : s.querySelector('.lp-raster') ? 'tiefe' : ''),
    kap: t(s.querySelector('.ql[aria-current]')), kapitel: [...s.querySelectorAll('.ql')].map((b) => ({ v: ar(b, 'data-v'), kap: ar(b, 'data-kap'), n: t(b), fertig: b.classList.contains('fertig') })),
    eyebrow: t(s.querySelector('.eyebrow')), tiefe: t(s.querySelector('.qtiefe')), h1: h1c ? h1c.innerHTML.replace(/<span class="ak">(.*?)<\/span>/g, '<em>$1</em>').replace(/\s+/g, ' ').trim() : '',
    gloss: qg ? { k: ar(qg, 'data-k'), label: ar(qg, 'aria-label') } : null, sub: t(s.querySelector('.qdock .hd > p:not(.eyebrow), .hd > p:not(.eyebrow)')), notiz: ar(s.querySelector('.nz-knopf'), 'aria-label'),
    hint: t(st && st.querySelector('.w3d-hint')), rx: st ? st.style.getPropertyValue('--rx') : '', ry: st ? st.style.getPropertyValue('--ry') : '', weiter: t(s.querySelector('[data-act="qnext"]')), bloecke: bloecke
  };
}
  function frage() {
    var q = lesen();
    q.bloecke.forEach(function (b, n) {
      var el = block(n), els = el ? optionen(el) : [];
      (b.opts || []).forEach(function (o, j) {
        if (o.ico) o.ico = strich(o.ico);
        /* Materialtupfen der App (z. B. Fensterbank: Werzalit, Naturstein, Holz) */
        var k = els[j], dot = k && !o.farbe ? k.querySelector('[style*="background"]') : null; if (dot) o.farbe = dot.style.background || dot.style.backgroundColor;
      });
      /* Regler der Aufteilung und Textfelder: Wertebereich und Stand der App */
      if (el && b.typ === 'aufteilung') { var r = el.querySelector('input[type="range"]'); if (r) { b.min = +r.min; b.max = +r.max; b.step = +r.step || 1; b.p = +r.value; b.regler = r.getAttribute('aria-label') || b.regler; } }
      if (el && b.typ === 'zeilen') { var ta = el.querySelectorAll('textarea'), ti = 0; (b.opts || []).forEach(function (o) { if (o.art === 'text' && ta[ti]) { o.wert = ta[ti].value; ti++; } }); }
    });
    var c = qCurrent(), sicht = c.list.filter(function (x) { return x.id !== 'lage' && x.id !== 'tiefe'; });
    q.pos = sicht.findIndex(function (x) { return x.id === c.q.id; }); q.anzahl = sicht.length; q.liste = sicht.map(function (x) { return { id: x.id, kap: x.kap }; });
    q.letzte = q.pos === sicht.length - 1; q.offen = Object.keys(S.win.offen || {}).filter(function (k) { return S.win.offen[k]; }).length;
    return q;
  }
  /* Bedienelemente eines Blocks in derselben Reihenfolge, in der lesen() sie liest */
  function optionen(el) {
    var c = el.className || '';
    if (/qformen/.test(c)) return [].slice.call(el.querySelectorAll('.qf'));
    if (el.querySelector(':scope > .qo') || /qcards/.test(c)) return [].slice.call(el.querySelectorAll('.qo')).map(function (o) { return o.querySelector('.qopt') || o.querySelector('button'); });
    if (/qswatches/.test(c)) return [].slice.call(el.querySelectorAll('.qsw'));
    if (/qlist/.test(c)) return el.querySelector('.qli') ? [].slice.call(el.querySelectorAll('.qli')).map(function (o) { return o.querySelector('button:not(.qci-i)'); }) : [].slice.call(el.querySelectorAll(':scope > button'));
    if (/qchips/.test(c)) return [].slice.call(el.querySelectorAll('.chip'));
    if (/seg/.test(c)) return [].slice.call(el.querySelectorAll('button'));
    return [];
  }
  function block(n) { var p = d.querySelector('.qpanel'); return p ? p.children[n] : null; }
  function ersteFrage() { var c = qCurrent(), e = c.list.find(function (x) { return x.id !== 'lage' && x.id !== 'tiefe'; }); return e ? e.id : null; }
  var hoerer = [], t = 0;
  function melden() { clearTimeout(t); t = setTimeout(function () { hoerer.forEach(function (f) { try { f(); } catch (e) { /* weiter */ } }); }, 40); }
  window.ezBuehne = {
    /* Fenster aus der Vorschau: Art, Lage, Maße; dann die Frage (Standard: die erste nach Lage und Tiefe) */
    setze: function (o) {
      var w = baseWin(); artSetzen(w, o.art || 'fenster');
      w.name = o.name || ''; w.etage = o.etage || 'eg'; w.bru = o.bru || ''; w.mo = Object.assign(w.mo, o.mo || {}); w.el = Object.assign(w.el, o.el || {});
      S.win = w; S.editIdx = -1; S.proj.tiefe = o.tiefe || 'normal'; S.openSash = -1; S.selSash = 0;
      S.q = o.q || null; go('frage');
      if (!o.q) { var e = ersteFrage(); if (e) { S.q = e; render(true); } }
    },
    erste: function () { var e = ersteFrage(); if (e) { S.q = e; S.dir = 'fwd'; S.openSash = -1; render(true); } },
    /* Block n der Frage bedienen: art opt (Option j), offen, mehr, schalter (Zeile j), stufe (Zeile j, Richtung r), text/regler (Wert) */
    bedien: function (n, art, j, r) {
      var el = block(n), ziel = null; if (!el) return false;
      if (art === 'opt') ziel = optionen(el)[j];
      else if (art === 'offen' || art === 'mehr') ziel = el.matches('button, [data-act]') ? el : el.querySelector('button, [data-act]');
      else if (art === 'schalter') { var z = el.children[j]; ziel = z && z.querySelector('.switch, [role="switch"], input[type="checkbox"]'); }
      else if (art === 'stufe') { var row = el.querySelectorAll('.qstep')[j], bs = row ? row.querySelectorAll('button') : []; ziel = bs.length ? (r < 0 ? bs[0] : bs[bs.length - 1]) : null; }
      else if (art === 'text' || art === 'regler') { var f = el.querySelector(art === 'text' ? 'textarea' : 'input[type="range"]'); if (!f) return false; f.value = j; f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); return true; }
      if (!ziel) return false; ziel.click(); return true;
    },
    lage: function (o) { ['name', 'etage', 'bru'].forEach(function (k) { if (k in o) S.win[k] = o[k]; }); },
    tiefe: function (v) { S.proj.tiefe = v; render(true); },
    frage: frage,
    zu: function (id) { S.q = id; S.dir = 'fwd'; render(true); },
    weiter: function () { var c = qCurrent(); if (c.i >= c.list.length - 1) return false; act('qnext', d.body); return true; },
    zurueck: function () { var c = qCurrent(), erste = c.list.findIndex(function (x) { return x.id !== 'lage' && x.id !== 'tiefe'; }); if (c.i <= erste) return false; act('qprev', d.body); return true; },
    /* Tippen auf ein Bedienelement der App im Antwortfeld (Auswahl, Zähler, Schalter); Wert eines Felds über data-in */
    tippe: function (sel) { var el = d.querySelector('.qpanel ' + sel) || d.querySelector(sel); if (!el) return false; el.click(); return true; },
    eingabe: function (sel, wert) { var el = d.querySelector(sel); if (!el) return false; el.value = wert; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); return true; },
    gloss: function (k) { var g = (typeof GLOSS !== 'undefined' && GLOSS[k]) || null; return g ? { t: g.t, x: g.x, tipp: g.tipp, s: g.s } : null; },
    beiAenderung: function (f) { hoerer.push(f); },
    /* Blätter der App (Haus: Fassade und Farbe, Farbkarte) hängen am body; offen heißt: das Bühnenfenster braucht den ganzen Schirm */
    blattOffen: function () { return !!d.querySelector('body > .fb'); },
    stand: function () { return { screen: S.screen, q: S.q, tiefe: S.proj.tiefe, win: JSON.parse(JSON.stringify(S.win)) }; }
  };
  new MutationObserver(melden).observe(d.getElementById('app'), { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'class'] });
  new MutationObserver(melden).observe(d.body, { childList: true });
  window.dispatchEvent(new Event('ez-buehne-bereit'));
})();

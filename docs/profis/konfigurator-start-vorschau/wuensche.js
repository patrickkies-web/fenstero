/* Schritt 6 „Wünsche“ der Vorschau.
   1) Kapitel „Lage“ („Wo ist das Fenster?“, „Wie genau möchtest du planen?“) wie in der App (lageDna, tiefeDna, lgZeigen, lpZeigen in
      web/assets/app.js; vom Inhaber angenommen und online, Knöpfe und Richtung fix), hier nur in Kopf, Kapitelband und Fuß der Vorschau.
   2) Die Fragen der Kapitel Aufbau bis Einbau, neu nach der DNA: Bühne mit dem Modell der App in der Ansicht der Frage (je Option ein
      eigenes Bild, so zeigt das Modell die Wahl), darunter Kapitel und Stelle, die Frage mit Erklärung und Notiz, die Antworten (Auswahl
      auf Anthrazit-Kacheln, Eingaben auf Weiß), unten zurück und eine Pille. Inhalte aus wuensche-daten.js (aus der App ausgelesen). */
(function () {
  'use strict';
  var V = window.ezVorschau, D = window.EZ_WUENSCHE; if (!V || !D) return;
  var d = document, $ = function (id) { return d.getElementById(id); };
  var folie = d.querySelector('.ez-folie[data-folie="wuensche"]'); if (!folie) return;
  var dna = $('wz-dna'), schritte = {}; folie.querySelectorAll('.ez-wz-schritt').forEach(function (s) { schritte[s.getAttribute('data-schritt')] = s; });
  var F = V.fenster; F.name = F.name || ''; F.etage = F.etage || 'eg'; F.ogNr = F.ogNr || 0; F.anzahl = F.anzahl || 1; F.bru = F.bru == null ? '' : F.bru; F.tiefe = F.tiefe || 'normal'; F.wahl = F.wahl || {}; F.notizen = F.notizen || {};
  var stand = { schritt: 'lage', i: 0 }, NB = ' ';
  var weiterWort = $('wz-weiter-wort'), grund = $('wz-grund');
  var ESC = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var I_SVG = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="4" r="1.3"/><rect x="7" y="6.5" width="2" height="6.5" rx="1"/></svg>';
  var HAKEN = '<span class="ez-wz-haken" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l2.6 2.6L11 4.6"/></svg></span>';

  /* ---------- Kapitelband: das laufende Kapitel benannt, die übrigen als Punkte; Tippen öffnet „Direkt zu einem Thema“ ---------- */
  var KAP = D.kapitel, KAP_I = {}; KAP.forEach(function (k, n) { KAP_I[k.k] = n; });
  function kapVon() { if (stand.schritt !== 'frage') return 0; var q = D.fragen[stand.i]; var n = KAP.findIndex(function (k) { return k.n === q.kap; }); return n < 0 ? 1 : n; }
  function bandSetzen() {
    var ki = kapVon(), band = $('wz-band');
    $('wz-band-name').textContent = KAP[ki].n; $('wz-band-nr').textContent = (ki + 1) + ' von ' + KAP.length;
    band.querySelectorAll('.lg-band i').forEach(function (p, n) { p.className = n === ki ? 'ist' : n < ki ? 'fertig' : ''; });
    band.setAttribute('aria-label', 'Kapitel ' + (ki + 1) + ' von ' + KAP.length + ': ' + KAP[ki].n.replace(' & ', ' und ') + '. Direkt zu einem Thema');
  }
  var kapBogen = $('wz-kapitel');
  V.bogenBinden(kapBogen, null);
  $('wz-band').addEventListener('click', function () {
    var ki = kapVon();
    $('wz-kapitel-liste').innerHTML = KAP.map(function (k, n) { return '<button type="button" data-kap="' + n + '"' + (n === ki ? ' aria-current="step"' : '') + '>' + ESC(k.n) + '<small>' + (n < ki ? 'erledigt' : n === ki ? 'jetzt' : '') + '</small></button>'; }).join('');
    V.bogenZeigen(kapBogen, $('wz-band'), true);
  });
  $('wz-kapitel-liste').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-kap]'); if (!b) return;
    var k = KAP[+b.getAttribute('data-kap')]; V.bogenZeigen(kapBogen, $('wz-band'), false);
    if (k.v === 'lage') return zeigeSchritt('lage', -1);
    var i = D.fragen.findIndex(function (q) { return q.id === k.v; }); if (i >= 0) { stand.i = i; zeigeSchritt('frage', i > stand.i ? 1 : -1); }
  });

  /* ---------- Lage (Port von lgZeigen und lgAct der App) ---------- */
  var LG_STOCK = { dg: { y: 71, w: 44, name: 'Dachgeschoss' }, og: { y: 116, w: 56, name: 'Obergeschoss' }, eg: { y: 166, w: 56, name: 'Erdgeschoss' }, kg: { y: 212, w: 42, name: 'Kellergeschoss' } };
  var LG_RAEUME = ['Wohnzimmer', 'Küche', 'Bad', 'Schlafzimmer', 'Kinderzimmer', 'Flur', 'Arbeitszimmer'];
  var LG_GRUND = { name: 'Gib dem Raum einen Namen, dann geht es weiter.', bru: 'Trag die Brüstung ein oder tippe auf „bodentief“.' };
  var lgSchritt = schritte.lage, lgQ = function (s) { return lgSchritt.querySelector(s); }, lgQA = function (s) { return lgSchritt.querySelectorAll(s); };
  var bruDa = function () { return F.bru !== '' && F.bru != null && String(F.bru).trim() !== ''; };
  var lgOben = function () { return (F.etage === 'og' || F.etage === 'dg') && !V.istTuer(); };
  var lgFehlt = function () { return !String(F.name || '').trim() ? 'name' : lgOben() && !bruDa() ? 'bru' : ''; };
  var lgGrundJetzt = '';
  function lgMass() { var b = lgQ('.lg-buehne'); if (b && b.clientWidth) b.style.setProperty('--lg-s', Math.min(1, b.clientWidth / 358).toFixed(4)); }
  function lgZeigen() {
    var s = LG_STOCK[F.etage] ? F.etage : 'eg', st = LG_STOCK[s], fh = st.w * 420 / 412;
    var fe = lgQ('.lg-fenster'); if (fe) { fe.style.width = st.w + 'px'; fe.style.transform = 'translateY(' + (st.y - fh / 2 - 2).toFixed(1) + 'px)'; }
    var et = lgQ('.lg-etikett'); if (et) et.style.transform = 'translateY(' + (st.y - 19) + 'px)';
    var sr = lgQ('.lg-strich'); if (sr) sr.style.transform = 'translateY(' + st.y + 'px)';
    var gl = lgQ('.lg-glut'); if (gl) gl.style.transform = 'translateY(' + (st.y - 66) + 'px)';
    lgQA('.lg-haus .schnitt').forEach(function (p) { p.classList.toggle('frei', p.getAttribute('data-s') === s); });
    lgQA('[data-act="lg-stock"]').forEach(function (b) { if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === s)); });
    lgQA('.lg-haus text[data-t]').forEach(function (t) { var k = t.getAttribute('data-t'); t.setAttribute('class', k === s ? 'ist' : ''); if (k === 'og') t.textContent = s === 'og' && F.ogNr > 0 ? F.ogNr + '. OG' : 'OG'; });
    lgQA('[data-act="lg-og"]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-v') === (F.ogNr || 1))); });
    var stx = lgQ('.lg-stocktext'); if (stx) stx.textContent = s === 'og' && F.ogNr > 0 ? F.ogNr + '. Obergeschoss' : st.name;
    dna.setAttribute('data-stock', s); dna.toggleAttribute('data-oben', lgOben());
    var t = String(F.name || '').trim(), en = lgQ('.lg-et-name'); if (en) { en.textContent = t || 'Raum?'; en.classList.toggle('leer', !t); }
    var tief = bruDa() && !V.num(F.bru), bo = lgQ('.lg-boden'); if (bo) bo.setAttribute('aria-pressed', String(tief));
    var mm = $('lg-bru-mm'); if (mm) mm.textContent = tief ? 'Bodentief: ' + (V.istTuer() ? 'Die Tür' : 'Das Fenster') + ' reicht bis zum Boden.' : V.num(F.bru) ? '=' + NB + V.tausend(V.num(F.bru)) + ' mm' : '';
    var wa = lgQ('.lg-warn'); if (wa) wa.hidden = !(lgOben() && bruDa() && V.num(F.bru) < 800);
    var a = Math.max(1, V.num(F.anzahl) || 1), o = lgQ('.lg-zahl output'); if (o && o.textContent !== String(a)) o.textContent = String(a);
    var mi = lgQ('[data-act="lg-anzahl"][data-v="-1"]'); if (mi) mi.disabled = a <= 1;
    var pl = lgQ('[data-act="lg-anzahl"][data-v="1"]'); if (pl) pl.disabled = a >= 30;
    var re = lgQ('.lg-reihe'); if (re) { var h = '', i; for (i = 0; i < Math.min(a, 12); i++) h += '<i class="ist"></i>'; for (i = a; i < Math.min(a + 3, 12); i++) h += '<i></i>'; re.innerHTML = h; }
    lgGrund();
  }
  /* Grundzeile über „Weiter“ und Markierung am Feld: erst nach einem Tipp auf „Weiter“, solange es noch fehlt */
  function lgGrund() {
    var fehlt = lgFehlt(), g = lgGrundJetzt && lgGrundJetzt === fehlt ? fehlt : '';
    if (!g) lgGrundJetzt = '';
    grund.hidden = !(g && stand.schritt === 'lage'); grund.textContent = g ? LG_GRUND[g] : '';
    var nf = lgQ('.lg-name-feld'), bf = lgQ('.lg-bru-feld'); if (nf) nf.classList.toggle('lg-markiert', g === 'name'); if (bf) bf.classList.toggle('lg-markiert', g === 'bru');
    [[$('t-name'), 'name'], [$('f-bru'), 'bru']].forEach(function (x) { var el = x[0]; if (!el) return; if (g === x[1]) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'wz-grund' + (x[1] === 'bru' ? ' lg-bru-mm' : '')); } else { el.removeAttribute('aria-invalid'); if (x[1] === 'bru') el.setAttribute('aria-describedby', 'lg-bru-mm'); else el.removeAttribute('aria-describedby'); } });
  }
  function lgRasten(o) { if (!o || V.ruhig()) return; o.classList.remove('rastet'); void o.offsetWidth; o.classList.add('rastet'); setTimeout(function () { o.classList.remove('rastet'); }, 140); }
  lgSchritt.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    if (act === 'lg-stock') { if (!LG_STOCK[v]) return; F.etage = v; if (v === 'og') { if (!(F.ogNr > 0)) F.ogNr = 1; } else F.ogNr = 0; }
    else if (act === 'lg-og') F.ogNr = Math.max(1, Math.min(3, parseInt(v, 10) || 1));
    else if (act === 'lg-raum') {
      var rest = String(F.name || '').trim();
      LG_RAEUME.forEach(function (r) { if (rest.toLocaleLowerCase('de').indexOf(r.toLocaleLowerCase('de')) === 0) rest = rest.slice(r.length).trim(); });
      F.name = (v + (rest ? ' ' + rest : '')).slice(0, 50);
      var i = $('t-name'); if (i) { i.value = F.name; i.focus({ preventScroll: true }); try { i.setSelectionRange(i.value.length, i.value.length); } catch (x) { /* ältere Browser */ } }
    }
    else if (act === 'lg-boden') { var an = !(bruDa() && !V.num(F.bru)); F.bru = an ? 0 : ''; var bi = $('f-bru'); if (bi) bi.value = ''; }
    else if (act === 'lg-anzahl') { F.anzahl = Math.max(1, Math.min(30, (V.num(F.anzahl) || 1) + (parseInt(v, 10) || 0))); lgRasten(lgQ('.lg-zahl output')); }
    else if (act === 'gloss') return erklaeren(el.getAttribute('data-k'), el);
    else if (act === 'notiz-auf') return V.status('In der App öffnet sich hier die Notiz zu dieser Frage.');
    else return;
    lgZeigen();
  });
  var nameFeld = $('t-name'); if (nameFeld) nameFeld.addEventListener('input', function () { F.name = nameFeld.value.slice(0, 50); lgZeigen(); });
  var bruFeld = $('f-bru'); if (bruFeld) bruFeld.addEventListener('input', function () { var z = String(bruFeld.value).replace(/\D/g, '').slice(0, 3); if (z !== bruFeld.value) bruFeld.value = z; F.bru = z === '' ? '' : Math.min(9999, parseInt(z, 10) * 10); lgZeigen(); });

  /* ---------- Wie genau planen (Port von lpZeigen; Zahlen je Stufe aus der App) ---------- */
  var tfSchritt = schritte.tiefe, tfQ = function (s) { return tfSchritt.querySelector(s); };
  var TIEFE_NAME = { kurz: 'Kurz', normal: 'Üblich', genau: 'Alles' };
  function tfZeigen(rasten) {
    var t = D.tiefe[F.tiefe] ? F.tiefe : 'normal', z = D.tiefe[t], alle = (+z.n) + (+z.rest);
    tfSchritt.querySelectorAll('.lp-reihe').forEach(function (row, r) { var c = z.reihen[r] ? z.reihen[r].ja : 0; row.querySelectorAll('i').forEach(function (p, i) { p.classList.toggle('ja', i < c); }); });
    var zn = tfQ('.lp-n'); if (zn) { zn.textContent = z.n; if (rasten) lgRasten(zn); }
    var zr = tfQ('.lp-rest'); if (zr) zr.textContent = z.rest;
    var g = tfQ('.lp-glut'); if (g) g.style.transform = 'scaleX(' + (0.35 + 0.65 * z.n / alle).toFixed(3) + ')';
    var so = tfQ('.lp-sonne'); if (so) so.style.transform = 'scale(' + Math.min(z.rest / alle * 1.6, 0.35 + 0.65 * z.n / alle).toFixed(3) + ')';
    var nm = tfQ('.lp-name'); if (nm) nm.textContent = z.name;
    var sz = tfQ('.lp-satz'); if (sz) sz.textContent = z.satz;
    var sr = tfQ('.lp-sr'); if (sr) sr.textContent = z.n + ' von ' + alle + ' Fragen wählst du selbst, den Rest plant dein Fensterbauer.';
    tfSchritt.querySelectorAll('[data-act="tiefe"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === t)); });
    $('wz-tiefe-name').textContent = TIEFE_NAME[t]; $('wz-tiefe').setAttribute('aria-label', 'Wie genau planen: ' + z.name + '. Ändern');
  }
  tfSchritt.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'tiefe') { F.tiefe = el.getAttribute('data-v'); tfZeigen(true); }
    else if (act === 'gloss') erklaeren(el.getAttribute('data-k'), el);
    else if (act === 'notiz-auf') V.status('In der App öffnet sich hier die Notiz zu dieser Frage.');
  });

  /* ---------- Erklärungen (GLOSS der App) ---------- */
  var erkl = $('wz-erkl'); V.bogenBinden(erkl, null);
  function erklaeren(k, knopf) {
    var gl = D.gloss[k]; if (!gl) return V.status('Zu diesem Begriff gibt es in der App eine Erklärung.');
    $('wz-erkl-titel').textContent = gl.t;
    $('wz-erkl-text').innerHTML = gl.x.map(function (t) { return '<p>' + ESC(t) + '</p>'; }).join('') + (gl.tipp ? '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + ESC(gl.tipp) + '</p>' : '');
    V.bogenZeigen(erkl, knopf, true);
  }

  /* ---------- Fragen ---------- */
  var antwort = $('wz-antwort'), bildA = $('wz-bild-a'), bildB = $('wz-bild-b'), blendT = 0;
  /* Folgefragen wie in der App: bei einem Flügel entfallen die Fragen zu Flügel 2 und „Erst kippen oder erst drehen?“ */
  function gilt(q) {
    var t = F.wahl.teilung;
    if (t && t.v === '1' && (/-1$/.test(q.id) || q.id === 'kvd')) return false;
    return true;
  }
  function liste() { return D.fragen.map(function (q, i) { return i; }).filter(function (i) { return gilt(D.fragen[i]); }); }
  function stelle(q) {
    /* „Aufbau · 4 von 11“: gezählt in der gültigen Liste des Kapitels */
    var L = liste().map(function (i) { return D.fragen[i]; }).filter(function (x) { return x.kap === q.kap; });
    return q.kap + ' · ' + (L.indexOf(q) + 1) + ' von ' + L.length;
  }
  function wahlVon(q, b) { var w = F.wahl[q.id + ':' + (b.typ || '')]; return w; }
  function bildZeigen(src, blenden) {
    if (!src) return;
    var an = bildA.classList.contains('ist-an') ? bildA : bildB, aus = an === bildA ? bildB : bildA;
    if (an.getAttribute('src') === src.src) return;
    if (!blenden || V.ruhig()) { an.src = src.src; return; }
    clearTimeout(blendT); aus.src = src.src;
    var los = function () { aus.classList.add('blendet', 'ist-an'); an.classList.add('blendet'); an.classList.remove('ist-an'); blendT = setTimeout(function () { aus.classList.remove('blendet'); an.classList.remove('blendet'); }, 240); };
    if (aus.decode) aus.decode().then(los, los); else los();
  }
  function ico(o) { return o.ico ? '<span class="ez-wz-kachel__ico" aria-hidden="true">' + o.ico + '</span>' : ''; }
  function infoKnopf(o, hell) { return o.info && o.info.k ? '<button type="button" class="ez-wz-info" data-gloss="' + ESC(o.info.k) + '" aria-label="' + ESC(o.info.label || 'Erklärung') + '">' + I_SVG + '</button>' : ''; }
  function blockHtml(q, b, n) {
    var id = q.id + ':' + n, w = F.wahl[id];
    var an = function (o, j) { return w ? (Array.isArray(w.v) ? w.v.indexOf(o.v) >= 0 : w.v === o.v) : !!o.an; };
    if (b.typ === 'karten') {
      var lang = b.opts.some(function (o) { return o.lbl.length > 9 || (o.info && !o.ico && o.lbl.length > 6); }), spalten = b.opts.length === 2 || b.opts.length === 4 || lang ? 2 : 3;
      return '<div class="ez-wz-kacheln" role="group" data-spalten="' + spalten + '" data-block="' + n + '">' + b.opts.map(function (o, j) {
        return '<div class="ez-wz-opt"><button type="button" class="ez-wz-kachel' + (o.info ? ' ez-wz-kachel--info' : '') + (o.ico ? ' ez-wz-kachel--ico' : '') + '" data-o="' + j + '" aria-pressed="' + an(o, j) + '">' + ico(o) + '<span class="ez-wz-kachel__lbl">' + ESC(o.lbl.replace(/(\d) /g, '$1\u00a0')) + '</span>' + (o.sb ? '<span class="ez-wz-kachel__sb">' + ESC(o.sb) + '</span>' : '') + (o.pr ? '<span class="ez-wz-kachel__pr">' + ESC(o.pr) + '</span>' : '') + '</button>' + infoKnopf(o) + '</div>';
      }).join('') + '</div>';
    }
    if (b.typ === 'segment' || b.typ === 'chips') {
      var gitter = b.opts.length > 3 || b.opts.some(function (o) { return o.lbl.length > 14; });
      return '<div class="ez-wz-karte"><div class="ez-wz-umschalter' + (gitter ? ' ez-wz-umschalter--gitter' : '') + '" role="group" data-block="' + n + '">' + b.opts.map(function (o, j) {
        return '<span class="ez-wz-zelle' + (o.info ? ' mit-info' : '') + '"><button type="button" data-o="' + j + '" aria-pressed="' + an(o, j) + '">' + ESC(o.lbl) + '</button>' + infoKnopf(o) + '</span>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'liste') {
      return '<div class="ez-wz-karte"><div class="ez-wz-liste" role="group" data-block="' + n + '" data-multi="' + (b.multi ? 1 : 0) + '">' + b.opts.map(function (o, j) {
        return '<div class="ez-wz-reihe"><button type="button" class="ez-wz-wahl" data-o="' + j + '" aria-pressed="' + an(o, j) + '"><span>' + ESC(o.lbl) + '</span>' + HAKEN + '</button>' + infoKnopf(o) + '</div>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'tupfen') {
      var cur = w ? b.opts.find(function (o) { return o.v === w.v; }) : b.opts.find(function (o) { return o.an; });
      return '<div class="ez-wz-farben" data-block="' + n + '"><div class="ez-wz-jetzt" aria-live="polite">' + (cur ? '<span class="ez-wz-tupf" style="background:' + ESC(cur.farbe) + '"></span><span><b>' + ESC(cur.name.replace(/^RAL \d+ /, '')) + '</b><small>' + ESC(cur.name.match(/^RAL \d+/) ? cur.name.match(/^RAL \d+/)[0] : '') + '</small></span>' : '<span class="ez-wz-tupf ez-wz-tupf--offen"></span><span><b>' + ESC(q._jetzt ? q._jetzt.b : 'Noch offen') + '</b><small>' + ESC(q._jetzt ? q._jetzt.small : '') + '</small></span>') + '</div>' +
        '<div class="ez-wz-tupfen" role="group" aria-label="' + ESC(b.label || 'Farben') + '">' + b.opts.map(function (o, j) {
          return '<button type="button" data-o="' + j + '" aria-pressed="' + an(o, j) + '" aria-label="' + ESC(o.name) + '"><span class="ez-wz-tupf" style="background:' + ESC(o.farbe) + '"></span>' + ESC(o.v) + '</button>';
        }).join('') + '</div></div>';
    }
    if (b.typ === 'zaehler') {
      return '<div class="ez-wz-karte"><div class="ez-wz-liste" data-block="' + n + '">' + b.opts.map(function (o, j) {
        var wert = w && w.z ? w.z[j] : V.num(o.wert);
        return '<div class="ez-wz-reihe"><span class="ez-wz-wahl" style="flex:1"><span><b>' + ESC(o.b) + '</b><small>' + ESC(o.small) + '</small></span></span><span class="ez-wz-stepper"><button type="button" data-z="' + j + '" data-d="-1" aria-label="' + ESC(o.b) + ': weniger"' + (wert <= 0 ? ' disabled' : '') + '>−</button><output aria-live="polite">' + wert + '</output><button type="button" data-z="' + j + '" data-d="1" aria-label="' + ESC(o.b) + ': mehr">+</button></span></div>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'zeilen') {
      return '<div class="ez-wz-karte"><div class="ez-wz-liste" data-block="' + n + '">' + b.opts.map(function (o, j) {
        if (o.art === 'schalter') { var ein = w && w.s ? w.s[j] : o.an; return '<div class="ez-wz-reihe"><span class="ez-wz-wahl" style="flex:1"><span><b>' + ESC(o.b) + '</b>' + (o.small ? '<small>' + ESC(o.small) + '</small>' : '') + '</span></span>' + infoKnopf(o) + '<button type="button" class="ez-wz-schalter" role="switch" data-s="' + j + '" aria-checked="' + !!ein + '" aria-label="' + ESC(o.b) + '"></button></div>'; }
        if (o.art === 'text') return '<label class="dna-label" for="wz-text-' + j + '">' + ESC(o.label) + '</label><textarea class="ez-wz-text" id="wz-text-' + j + '" rows="3" data-t="' + j + '" placeholder="' + ESC(o.ph || '') + '">' + ESC(w && w.t ? w.t : '') + '</textarea>';
        return '<p class="ez-wz-hinweis">' + ESC(o.text) + '</p>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'aufteilung') {
      var p = w && w.p ? w.p : 50, br = (V.werte().elW || 0), tl = function (x) { return Math.round(br * x / 100 - 0) ; };
      return '<div class="ez-wz-karte ez-wz-teile" data-block="' + n + '"><p class="dna-label">' + ESC(b.titel) + '</p><div class="ez-wz-teile__werte">' + b.werte.map(function (x, j) { return '<button type="button" aria-label="' + ESC(x.label) + '"><b>' + ESC(x.b) + '</b><small>' + ESC(x.small) + '</small></button>'; }).join('') + '</div><input type="range" class="ez-wz-regler" min="30.5" max="69.5" step="0.5" value="' + p + '" style="--p:' + ((p - 30.5) / 39 * 100).toFixed(1) + '%" aria-label="' + ESC(b.regler || 'Breite verschieben') + '"><p class="ez-wz-hinweis">' + ESC(b.hinweis) + '</p></div>';
    }
    if (b.typ === 'offen') { var off = w ? !!w.an : b.an; return '<button type="button" class="ez-wz-leise" data-block="' + n + '" data-offen="1" aria-pressed="' + off + '"><span><b>' + ESC(b.b) + '</b><small>' + ESC(b.small) + '</small></span>' + HAKEN + '</button>'; }
    if (b.typ === 'mehr') return '<button type="button" class="ez-wz-leise" data-mehr="' + ESC(b.v) + '"><span><b>' + ESC(b.b) + '</b><small>' + ESC(b.small) + '</small></span><span class="ez-wz-plus" aria-hidden="true">+</span></button>';
    if (b.typ === 'knoepfe') return '<div class="ez-wz-knoepfe">' + b.opts.map(function (o) { return '<button type="button" class="ez-wz-umriss" data-alle="' + ESC(o.lbl) + '">' + ESC(o.lbl) + '</button>'; }).join('') + '</div>';
    if (b.typ === 'label') return '<p class="ez-wz-hinweis" style="margin-top:4px;color:var(--weiss);font-weight:500">' + ESC(b.text) + '</p>';
    if (b.typ === 'hinweis') return '<p class="ez-wz-hinweis">' + ESC(b.text) + '</p>';
    if (b.typ === 'hinweise') return b.texts.map(function (t) { return '<p class="ez-wz-hinweis">' + ESC(t) + '</p>'; }).join('');
    if (b.typ === 'aktuell') { q._jetzt = b; return q.bloecke.some(function (x) { return x.typ === 'tupfen'; }) ? '' : '<p class="ez-wz-hinweis"><b style="color:var(--weiss);font-weight:500">' + ESC(b.b) + '</b>' + (b.small ? ' · ' + ESC(b.small) : '') + '</p>'; }
    return '';
  }
  function frageZeigen(richtung) {
    var q = D.fragen[stand.i];
    $('wz-pos').textContent = stelle(q);
    var h1 = q.h1, rein = h1.replace(/<em>.*?<\/em>/g, '').replace(/[\s?.!]/g, ''); if (!rein) h1 = h1.replace(/<\/?em>/g, '');
    var h1El = $('wz-h1'); h1El.innerHTML = h1; h1El.classList.toggle('ez-wz-lang', h1El.textContent.length > 30); $('wz-sub').textContent = q.sub || '';
    var ik = $('wz-i'); ik.hidden = !(q.gloss && q.gloss.k); if (q.gloss) { ik.setAttribute('data-gloss', q.gloss.k); ik.setAttribute('aria-label', q.gloss.label || 'Erklärung'); }
    $('wz-notiz').setAttribute('aria-label', q.notiz || 'Notiz');
    /* Die Vorschau hat die Wünsche der App für das Fenster; bei einem anderen Element sagt der Chip das offen */
    var hint = $('wz-hint'), ht = q.hint && !/drehen/i.test(q.hint) ? q.hint : ''; if (V.art() !== 'fenster') ht = 'Vorschau am Fenster' + (ht ? ' · ' + ht : '');
    hint.hidden = !ht; hint.textContent = ht;
    q._jetzt = null; q.bloecke.forEach(function (b) { if (b.typ === 'aktuell') q._jetzt = b; });
    antwort.innerHTML = q.bloecke.map(function (b, n) { return blockHtml(q, b, n); }).join('');
    /* Bild: das der gewählten Option, sonst das der Frage */
    bildZeigen(gewaehltesBild(q) || q.bild, false);
    $('wz-bildtext').textContent = 'Modell deines Fensters, ' + (q.hint ? q.hint + ', ' : '') + 'zur Frage: ' + $('wz-h1').textContent;
    var L = liste(), letzt = L[L.length - 1] === stand.i;
    weiterWort.textContent = letzt ? (V.istTuer() ? 'Tür speichern' : V.art() === 'fest' ? 'Verglasung speichern' : 'Fenster speichern') : 'Weiter';
    if (richtung && !V.ruhig()) { antwort.classList.remove('ez-wz-kommt'); void antwort.offsetWidth; antwort.classList.add('ez-wz-kommt'); }
  }
  function gewaehltesBild(q) {
    var src = null;
    q.bloecke.forEach(function (b, n) {
      if (!b.opts || ['karten', 'segment', 'chips', 'tupfen'].indexOf(b.typ) < 0) return;
      var w = F.wahl[q.id + ':' + n], o = w ? b.opts.find(function (x) { return x.v === w.v; }) : b.opts.find(function (x) { return x.an; });
      if (o && o.bild) src = o.bild;
    });
    return src;
  }
  antwort.addEventListener('click', function (e) {
    var q = D.fragen[stand.i], t = e.target;
    var gl = t.closest('[data-gloss]'); if (gl) return erklaeren(gl.getAttribute('data-gloss'), gl);
    var m = t.closest('[data-mehr]'); if (m) return V.status('In der App kommen hier die Detailfragen dazu: ' + m.querySelector('small').textContent + '.');
    var al = t.closest('[data-alle]'); if (al) return V.status('In der App öffnet „' + al.getAttribute('data-alle') + '“ die ganze Farbkarte.');
    var blockEl = t.closest('[data-block]'); if (!blockEl) return;
    var n = +blockEl.getAttribute('data-block'), b = q.bloecke[n], id = q.id + ':' + n;
    if (blockEl.hasAttribute('data-offen')) { var an = blockEl.getAttribute('aria-pressed') !== 'true'; F.wahl[id] = { an: an }; blockEl.setAttribute('aria-pressed', String(an)); return; }
    var z = t.closest('[data-z]');
    if (z) {
      var zw = F.wahl[id] || { z: b.opts.map(function (o) { return V.num(o.wert); }) }, j = +z.getAttribute('data-z'); zw.z[j] = Math.max(0, Math.min(9, zw.z[j] + (+z.getAttribute('data-d')))); F.wahl[id] = zw;
      var row = z.closest('.ez-wz-reihe'); row.querySelector('output').textContent = zw.z[j]; row.querySelector('[data-d="-1"]').disabled = zw.z[j] <= 0; return;
    }
    var sw = t.closest('[data-s]');
    if (sw) { var sv = F.wahl[id] || { s: b.opts.map(function (o) { return !!o.an; }) }, k = +sw.getAttribute('data-s'); sv.s[k] = !sv.s[k]; F.wahl[id] = sv; sw.setAttribute('aria-checked', String(sv.s[k])); return; }
    var ob = t.closest('[data-o]'); if (!ob) return;
    var o = b.opts[+ob.getAttribute('data-o')];
    if (b.typ === 'liste' && b.multi) {
      var mv = F.wahl[id] || { v: b.opts.filter(function (x) { return x.an; }).map(function (x) { return x.v; }) }, pos = mv.v.indexOf(o.v);
      if (pos >= 0) mv.v.splice(pos, 1); else mv.v.push(o.v); F.wahl[id] = mv; ob.setAttribute('aria-pressed', String(pos < 0)); return;
    }
    F.wahl[id] = { v: o.v }; if (q.id === 'teilung') F.wahl.teilung = { v: o.v };
    blockEl.querySelectorAll('[data-o]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === ob)); });
    blockEl.querySelectorAll('.ez-wz-zelle').forEach(function (z) { z.classList.toggle('ist-an', z.contains(ob)); });
    /* Eine Wahl hebt „Weiß ich noch nicht“ auf, wie in der App */
    var offen = antwort.querySelector('[data-offen]'); if (offen && offen.getAttribute('aria-pressed') === 'true') { offen.setAttribute('aria-pressed', 'false'); F.wahl[q.id + ':' + offen.getAttribute('data-block')] = { an: false }; }
    if (b.typ === 'tupfen') { var jt = blockEl.querySelector('.ez-wz-jetzt'); jt.innerHTML = '<span class="ez-wz-tupf" style="background:' + ESC(o.farbe) + '"></span><span><b>' + ESC(o.name.replace(/^RAL \d+ /, '')) + '</b><small>' + ESC((o.name.match(/^RAL \d+/) || [''])[0]) + '</small></span>'; }
    if (o.bild) bildZeigen(o.bild, true);
    V.status(o.lbl || o.name || '');
  });
  antwort.addEventListener('input', function (e) {
    var t = e.target, q = D.fragen[stand.i], blockEl = t.closest('[data-block]'); if (!blockEl) return;
    var id = q.id + ':' + blockEl.getAttribute('data-block');
    if (t.classList.contains('ez-wz-regler')) { var p = +t.value; F.wahl[id] = { p: p }; t.style.setProperty('--p', ((p - 30.5) / 39 * 100).toFixed(1) + '%'); var br = V.werte().elW || 0, aussen = 2 * 98, frei = br - aussen; var w1 = Math.round(frei * p / 100), w2 = Math.round(frei - w1); var vs = blockEl.querySelectorAll('.ez-wz-teile__werte button'); if (frei > 0 && vs.length === 2) { vs[0].querySelector('b').textContent = V.tausend(w1) + NB + 'mm'; vs[0].querySelector('small').textContent = 'Flügel 1 · ' + Math.round(p) + ' %'; vs[1].querySelector('b').textContent = V.tausend(w2) + NB + 'mm'; vs[1].querySelector('small').textContent = 'Flügel 2 · ' + Math.round(100 - p) + ' %'; } }
    if (t.classList.contains('ez-wz-text')) F.wahl[id] = { t: t.value };
  });
  $('wz-i').addEventListener('click', function () { erklaeren(this.getAttribute('data-gloss'), this); });
  $('wz-notiz').addEventListener('click', function () { V.status('In der App öffnet sich hier die Notiz zu dieser Frage.'); });
  $('wz-tiefe').addEventListener('click', function () { zeigeSchritt('tiefe', -1); });

  /* ---------- Schritte und Fuß ---------- */
  function zeigeSchritt(name, richtung) {
    stand.schritt = name;
    Object.keys(schritte).forEach(function (k) { schritte[k].hidden = k !== name; });
    var fr = name === 'frage';
    bandSetzen();
    if (name === 'lage') { requestAnimationFrame(function () { lgMass(); dna.classList.add('lg-still'); lgZeigen(); void dna.offsetWidth; requestAnimationFrame(function () { dna.classList.remove('lg-still'); }); }); weiterWort.textContent = 'Weiter'; }
    else if (name === 'tiefe') { dna.classList.add('lg-still'); tfZeigen(false); requestAnimationFrame(function () { dna.classList.remove('lg-still'); }); weiterWort.textContent = 'Weiter'; grund.hidden = true; }
    else { grund.hidden = true; frageZeigen(richtung); }
    var zur = name === 'lage' ? 'Zurück zum Ergebnis' : 'Zurück';
    $('wz-zurueck').setAttribute('aria-label', zur); folie.querySelector('[data-wz-zurueck]').setAttribute('aria-label', zur);
    if (richtung) { var app = d.getElementById('app'); if (app && app.scrollHeight > app.clientHeight) app.scrollTop = 0; window.scrollTo(0, 0); }
    var h = (fr ? schritte.frage : schritte[name]).querySelector('h1'); if (h && richtung) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (richtung && !V.ruhig()) { var ziel = fr ? schritte.frage : schritte[name]; ziel.classList.remove('ez-wz-kommt'); void ziel.offsetWidth; ziel.classList.add('ez-wz-kommt'); }
    if (fr) { var q = D.fragen[stand.i]; V.status(stelle(q) + ': ' + $('wz-h1').textContent); vorladen(); }
  }
  /* Bilder der nächsten Frage im Leerlauf laden (keine lazy-Bilder, aber auch nicht alle auf einmal) */
  function vorladen() { var L = liste(), k = L.indexOf(stand.i), n = L[k + 1]; if (n == null) return; var q = D.fragen[n]; if (q.bild) { var im = new Image(); im.decoding = 'async'; im.src = q.bild.src; } }
  function weiter() {
    if (stand.schritt === 'lage') { var f = lgFehlt(); if (f) { lgGrundJetzt = f; lgGrund(); var el = $(f === 'name' ? 't-name' : 'f-bru'); if (el) { el.focus({ preventScroll: true }); var box = el.closest('.lg-feld'); if (box && box.scrollIntoView) box.scrollIntoView({ block: 'center', behavior: V.ruhig() ? 'auto' : 'smooth' }); } return; } V.fenster.name = F.name; return zeigeSchritt('tiefe', 1); }
    if (stand.schritt === 'tiefe') { var L0 = liste(); if (stand.i < L0[0]) stand.i = L0[0]; return zeigeSchritt('frage', 1); }
    var L = liste(), k = L.indexOf(stand.i);
    if (k < L.length - 1) { stand.i = L[k + 1]; return zeigeSchritt('frage', 1); }
    F.offen = offenZaehlen();
    V.status((V.istTuer() ? 'Tür' : 'Fenster') + ' gespeichert.');
    if (d.querySelector('.ez-folie[data-folie="fertig"]')) V.zeigeFolie('fertig', 1);
  }
  function zurueck() {
    if (stand.schritt === 'lage') return V.zeigeFolie('ergebnis', -1);
    if (stand.schritt === 'tiefe') return zeigeSchritt('lage', -1);
    var L = liste(), k = L.indexOf(stand.i);
    if (k > 0) { stand.i = L[k - 1]; return zeigeSchritt('frage', -1); }
    zeigeSchritt('tiefe', -1);
  }
  $('wz-weiter').addEventListener('click', weiter);
  $('wz-zurueck').addEventListener('click', zurueck);
  folie.querySelector('[data-wz-zurueck]').addEventListener('click', zurueck);
  /* Enter am Rechner wie „Weiter“ (nicht in Feldern und nicht auf Knöpfen) */
  d.addEventListener('keydown', function (e) {
    if (folie.hidden || e.altKey || e.ctrlKey || e.metaKey || e.key !== 'Enter') return;
    var t = e.target; if (t && (t.tagName === 'TEXTAREA' || (t.closest && t.closest('button, a, .ez-bogen:not([hidden])')))) return;
    if (t && t.tagName === 'INPUT') { t.blur(); }
    e.preventDefault(); if (!e.repeat) weiter();
  });
  window.addEventListener('resize', function () { if (!folie.hidden && stand.schritt === 'lage') lgMass(); });
  /* Sprung aus „Gespeichert“ (Direkt zu einem Thema): Kapitel der App, z. B. „aufbau“ */
  V.anmelden('wuensche', function (richtung) {
    var sp = F.sprung; F.sprung = null;
    if (sp) { var k = KAP.find(function (x) { return x.k === sp; }); if (k && k.v === 'lage') stand.schritt = 'lage'; else if (k) { var i = D.fragen.findIndex(function (q) { return q.id === k.v; }); if (i >= 0) { stand.i = i; stand.schritt = 'frage'; } } }
    zeigeSchritt(stand.schritt, richtung || 0);
  });
  /* Offene Wünsche für „Gespeichert“ (Stand): Fragen, bei denen „Weiß ich noch nicht“ gilt */
  function offenZaehlen() {
    var n = 0; liste().forEach(function (i) { var q = D.fragen[i]; q.bloecke.forEach(function (b, k) { if (b.typ !== 'offen') return; var w = F.wahl[q.id + ':' + k]; if (w ? w.an : b.an) n++; }); });
    return n;
  }
})();

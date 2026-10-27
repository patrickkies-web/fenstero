/* Schritt 6 „Wünsche“ der Vorschau.
   1) Kapitel „Lage“ („Wo ist das Fenster?“, „Wie genau möchtest du planen?“) wie in der App (lageDna, tiefeDna, lgZeigen, lpZeigen in
      web/assets/app.js; vom Inhaber angenommen und online, Knöpfe und Richtung fix), hier nur in Kopf, Kapitelband und Fuß der Vorschau.
   2) Die Fragen der Kapitel Aufbau bis Einbau, neu nach der DNA: auf der Bühne die echte App (app/buehne.html: app.js, buehne.js,
      modell.js unverändert) mit ihrem 3-D-Modell, Drehen, Zoom, Reglern und Hinweisen; darunter Kapitel und Stelle, die Frage mit
      Erklärung und Notiz, die Antworten (Auswahl auf Anthrazit-Kacheln, Eingaben auf Weiß), unten zurück und eine Pille. Fragen, Texte,
      Optionen und Stand liest die Folie live aus der App, jeder Tipp geht an die App (Korrektur des Inhabers, 27.10.2026: Detailtiefe,
      Bewegung und jede Wahl wie im Konfigurator). Bis das Fenster bereit ist, steht das Bild der Frage aus wuensche-daten.js da. */
(function () {
  'use strict';
  var V = window.ezVorschau, D = window.EZ_WUENSCHE; if (!V || !D) return;
  var d = document, $ = function (id) { return d.getElementById(id); };
  var folie = d.querySelector('.ez-folie[data-folie="wuensche"]'); if (!folie) return;
  var dna = $('wz-dna'), schritte = {}; folie.querySelectorAll('.ez-wz-schritt').forEach(function (s) { schritte[s.getAttribute('data-schritt')] = s; });
  var F = V.fenster; F.name = F.name || ''; F.etage = F.etage || 'eg'; F.ogNr = F.ogNr || 0; F.anzahl = F.anzahl || 1; F.bru = F.bru == null ? '' : F.bru; F.tiefe = F.tiefe || 'normal'; F.wahl = F.wahl || {}; F.notizen = F.notizen || {};
  var stand = { schritt: 'lage', i: 0 }, NB = ' ';
  var weiterWort = $('wz-weiter-wort'), grund = $('wz-grund');
  /* Geschützte Leerzeichen (Typografie 7): Zahl und Einheit, „≈ 0,5“, „z. B.“, „RAL 7016“, „RC2 N“ bleiben zusammen */
  var NBT = function (t) { return String(t == null ? '' : t).replace(/(\d) (?=(mm|cm|dB|%|€|weitere)(?![\wäöüß]))/g, '$1\u00a0').replace(/≈ /g, '≈\u00a0').replace(/z\. B\./g, 'z.\u00a0B.').replace(/\b(RAL|RC\d) (?=[\dN])/g, '$1\u00a0'); };
  var ESC = function (t) { return NBT(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var I_SVG = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="4" r="1.3"/><rect x="7" y="6.5" width="2" height="6.5" rx="1"/></svg>';
  /* Einfachwahl in Listen: Punkt (aktiv); Haken nur für Mehrfachwahl und An/Aus (Zeichen 1) */
  var PUNKT = '<span class="ez-wz-punkt" aria-hidden="true"></span>';
  var HAKEN = '<span class="ez-wz-haken" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l2.6 2.6L11 4.6"/></svg></span>';

  /* ---------- Kapitelband: das laufende Kapitel benannt, die übrigen als Punkte; Tippen öffnet „Direkt zu einem Thema“ ---------- */
  var KAP = D.kapitel, KAP_I = {}; KAP.forEach(function (k, n) { KAP_I[k.k] = n; });
  function kapVon() { if (stand.schritt !== 'frage') return 0; var q = aktuelle(); var n = KAP.findIndex(function (k) { return k.n === q.kap; }); return n < 0 ? 1 : n; }
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
    $('wz-kapitel-liste').innerHTML = KAP.map(function (k, n) { return '<button type="button" data-kap="' + n + '"' + (n === ki ? ' aria-current="step"' : '') + '><i class="' + (n < ki ? 'fertig' : n === ki ? 'ist' : '') + '" aria-hidden="true"></i>' + ESC(k.n) + '<small>' + (n < ki ? 'erledigt' : n === ki ? 'jetzt' : '') + '</small></button>'; }).join('');
    V.bogenZeigen(kapBogen, $('wz-band'), true);
  });
  $('wz-kapitel-liste').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-kap]'); if (!b) return;
    var k = KAP[+b.getAttribute('data-kap')]; V.bogenZeigen(kapBogen, $('wz-band'), false);
    if (k.v === 'lage') return zeigeSchritt('lage', -1);
    if (B) { richtungNext = 1; B.zu(k.v); if (stand.schritt !== 'frage') zeigeSchritt('frage', 1); return; }
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
    $('wz-tiefe-name').textContent = 'Fragen: ' + TIEFE_NAME[t]; /* Gremium K: „Üblich“ allein las niemand als Zahl der Fragen */ $('wz-tiefe').setAttribute('aria-label', 'Wie genau planen: ' + z.name + '. Ändern');
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
    var gl = (B && B.gloss(k)) || D.gloss[k]; if (!gl) return V.status('Zu diesem Begriff gibt es in der App eine Erklärung.');
    $('wz-erkl-titel').textContent = gl.t;
    $('wz-erkl-text').innerHTML = gl.x.map(function (t) { return '<p>' + ESC(t) + '</p>'; }).join('') + (gl.tipp ? '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + ESC(gl.tipp) + '</p>' : '');
    V.bogenZeigen(erkl, knopf, true);
  }

  /* ---------- Bühne: die echte App im Bühnenfenster ---------- */
  var buehne = $('wz-buehne'), rahmen = null, B = null, LQ = null, richtungNext = 0;
  function appLaden() {
    if (rahmen) return;
    rahmen = d.createElement('iframe'); rahmen.className = 'ez-wz-app'; rahmen.id = 'wz-app'; rahmen.title = '3-D-Modell deines Fensters: mit dem Finger drehen, Knöpfe für Zoom und Ansicht';
    rahmen.addEventListener('load', function () {
      /* Lädt das Bühnenfenster nicht (Fehlerseite, fremder Ursprung), bleiben die Bilder der Fragen stehen */
      var w = rahmen.contentWindow, los = function () { if (B || !w.ezBuehne) return; B = w.ezBuehne; anfangen(); };
      try { if (w.ezBuehne) los(); else w.addEventListener('ez-buehne-bereit', los); } catch (e) { /* ohne Bühnenfenster weiter */ }
    });
    rahmen.src = 'app/buehne.html'; buehne.insertBefore(rahmen, buehne.firstChild);
  }
  function masse() { var m = V.masse ? V.masse() : {}; return { mo: { hm: m.hm, hl: m.hl, hr: m.hr, wm: m.wm, wt: m.wt, wb: m.wb }, el: { h: m.h, w: m.w } }; }
  /* Stand, mit dem das Bühnenfenster gesetzt wurde: ändern sich Art oder Maße danach (zurück zu Schritt 1 bis 4), wird neu gesetzt,
     bei gleicher Art mit den Wünschen von vorher */
  var gesetzt = null;
  function standJetzt() { return JSON.stringify([V.art(), masse()]); }
  function nachsetzen() {
    if (!B || gesetzt === standJetzt()) return;
    var m = masse(), gleich = gesetzt && JSON.parse(gesetzt)[0] === V.art();
    B.setze({ art: V.art(), name: F.name, etage: F.etage, bru: F.bru, mo: m.mo, el: m.el, tiefe: F.tiefe, win: gleich && F.appWin ? F.appWin : null, q: stand.schritt === 'frage' && LQ ? LQ.id : null });
    gesetzt = standJetzt(); LQ = null;
  }
  function anfangen() {
    var m = masse(), sq = stand.schritt === 'frage' ? (D.fragen[stand.i] || {}).id : null;
    B.setze({ art: V.art(), name: F.name, etage: F.etage, bru: F.bru, mo: m.mo, el: m.el, tiefe: F.tiefe, q: sq }); gesetzt = standJetzt();
    B.beiAenderung(liveNeu);
    buehne.classList.add('ist-live');
    if (stand.schritt === 'frage') liveNeu();
  }
  /* Jede Änderung in der App (Tipp hier, Tipp auf der Bühne, Weiter, Zurück): Frage neu lesen; neue Frage einfahren, sonst nur die Antworten */
  /* Ein Blatt der App (Haus, Farbkarte) bekommt den ganzen Schirm des Geräts, wie in der App; danach zurück in die Bühne */
  function blattRahmen() {
    var offen = !!(B && B.blattOffen && B.blattOffen()); if (offen === rahmen.classList.contains('ist-gross')) return;
    rahmen.classList.toggle('ist-gross', offen); folie.classList.toggle('ist-blatt', offen);
    if (offen) { var r = d.getElementById('app').getBoundingClientRect(), top = Math.max(0, r.top); rahmen.style.cssText = 'left:' + r.left + 'px;top:' + top + 'px;width:' + r.width + 'px;height:' + (Math.min(r.bottom, window.innerHeight) - top) + 'px'; }
    else rahmen.style.cssText = '';
  }
  function liveNeu() {
    if (rahmen && B) blattRahmen();
    if (!B || stand.schritt !== 'frage' || folie.hidden) return;
    var q; try { q = B.frage(); } catch (e) { return; }
    if (!q || !q.id || q.id === 'lage' || q.id === 'tiefe') return;
    var neu = !LQ || LQ.id !== q.id; LQ = q;
    /* Stand der Wahl merken: ändern sich danach die Maße, setzt nachsetzen() das Fenster mit dieser Wahl neu */
    try { F.appWin = B.stand().win; } catch (e) { /* weiter */ }
    if (neu) { frageZeigen(richtungNext); if (richtungNext) { var app = d.getElementById('app'); if (app) app.scrollTop = 0; window.scrollTo(0, 0); } folgeSchritt(richtungNext); } else antwortSetzen(q);
    richtungNext = 0; bandSetzen();
  }
  function aktuelle() { return B && LQ ? LQ : D.fragen[stand.i]; }

  /* ---------- Fragen ---------- */
  var antwort = $('wz-antwort'), bildA = $('wz-bild-a'), bildB = $('wz-bild-b'), blendT = 0;
  /* Ohne Bühnenfenster: Folgefragen wie in der App (bei einem Flügel entfallen Flügel 2 und „Erst kippen oder erst drehen?“) */
  function gilt(q) { var t = F.wahl.teilung; return !(t && t.v === '1' && (/-1$/.test(q.id) || q.id === 'kvd')); }
  function liste() { return D.fragen.map(function (q, i) { return i; }).filter(function (i) { return gilt(D.fragen[i]); }); }
  /* „Frage 1 von 11“ (Gremium: das Kapitel steht schon im Band) */
  function stelle(q) {
    if (B && LQ && q === LQ) { var m = String(q.eyebrow || '').match(/(\d+)\s*von\s*(\d+)/); return m ? 'Frage ' + m[1] + ' von ' + m[2] : q.eyebrow; }
    var L = liste().map(function (i) { return D.fragen[i]; }).filter(function (x) { return x.kap === q.kap; });
    return 'Frage ' + (L.indexOf(q) + 1) + ' von ' + L.length;
  }
  function bildZeigen(src, blenden) {
    if (!src) return;
    var an = bildA.classList.contains('ist-an') ? bildA : bildB, aus = an === bildA ? bildB : bildA;
    if (an.getAttribute('src') === src.src) return;
    if (blendT) { clearTimeout(blendT); blendT = 0; an.classList.remove('blendet'); aus.classList.remove('blendet', 'ist-an'); void aus.offsetWidth; }
    if (!blenden || V.ruhig()) { an.src = src.src; return; }
    aus.src = src.src;
    var los = function () { aus.classList.add('blendet', 'ist-an'); an.classList.add('blendet'); an.classList.remove('ist-an'); blendT = setTimeout(function () { blendT = 0; aus.classList.remove('blendet'); an.classList.remove('blendet'); }, 240); };
    if (aus.decode) aus.decode().then(los, los); else los();
  }
  /* Zeichnungen ohne Hauptstrich (Sonnenschutz: Keiner, Bestehender, Rollladen, Screen, Klappläden): Kasten und Rahmen, die ersten drei
     Striche, in 1,8 wie in allen anderen Gruppen (Zeichen 4) */
  function hauptstrich(svg) {
    if (!svg || /stroke-width="1\.8"/.test(svg)) return svg;
    var n = 0; return svg.replace(/stroke-width="1\.2"/g, function (m) { return ++n <= 3 ? 'stroke-width="1.8"' : m; });
  }
  function ico(o) { return o.ico ? '<span class="ez-wz-kachel__ico" aria-hidden="true">' + hauptstrich(o.ico) + '</span>' : ''; }
  function tupf(o) { return o.farbe ? '<span class="ez-wz-tupf ez-wz-tupf--klein" style="background:' + ESC(o.farbe) + '" aria-hidden="true"></span>' : ''; }
  function infoKnopf(o) { return o.info && o.info.k ? '<button type="button" class="ez-wz-info" data-gloss="' + ESC(o.info.k) + '" aria-label="' + ESC(o.info.label || 'Erklärung') + '">' + I_SVG + '</button>' : ''; }
  /* Vorlesen (UX 4): Einfachwahl als Radiogruppe mit dem Titel als Namen, Mehrfachwahl als Kästchen; die gewählte Option (sonst die erste)
     ist der Tab-Halt, Pfeiltasten wählen die Nachbarn */
  function radios(opts, an) { var erste = opts.findIndex(an); if (erste < 0) erste = 0; return function (o, j) { var ist = an(o); return ' role="radio" aria-checked="' + ist + '" tabindex="' + (j === erste ? 0 : -1) + '"'; }; }
  function gruppe(rolle) { return ' role="' + rolle + '" aria-labelledby="wz-h1"'; }
  /* Gewählt: live der Stand der App; ohne Bühnenfenster die Wahl der Vorschau */
  function istAn(q, n, o) {
    if (B && LQ && q === LQ) return !!o.an;
    var w = F.wahl[q.id + ':' + n]; return w ? (Array.isArray(w.v) ? w.v.indexOf(o.v) >= 0 : w.v === o.v) : !!o.an;
  }
  /* „1.180 mm“: Zahl groß, Einheit klein daneben (G3) */
  function zahlKlein(t) { var m = String(t || '').match(/^(.*?\d)\s*(mm|cm|%)$/); return m ? ESC(m[1]) + '<span class="ez-wz-einheit">' + NB + m[2] + '</span>' : ESC(t); }
  /* i direkt hinter dem letzten Wort (Zeichen 2, Typografie 4): letztes Wort und i brechen nicht auseinander */
  function mitI(html, knopf) {
    if (!knopf) return html;
    var m = html.match(/^([\s\S]*\s)(\S+)$/); return (m ? m[1] : '') + '<span class="ez-wz-nb">' + (m ? m[2] : html) + knopf + '</span>';
  }
  function blockHtml(q, b, n) {
    var w = F.wahl[q.id + ':' + n], live = !!(B && LQ && q === LQ);
    var an = function (o) { return istAn(q, n, o); };
    if (b.typ === 'karten') {
      var lang = b.opts.some(function (o) { return o.lbl.length > 9 || (o.info && !o.ico && o.lbl.length > 6); }), spalten = b.opts.length === 2 || b.opts.length === 4 || lang ? 2 : 3;
      var rk = radios(b.opts, an);
      return '<div class="ez-wz-kacheln"' + gruppe('radiogroup') + ' data-spalten="' + spalten + '" data-block="' + n + '">' + b.opts.map(function (o, j) {
        return '<div class="ez-wz-opt"><button type="button" class="ez-wz-kachel' + (o.info ? ' ez-wz-kachel--info' : '') + (o.ico ? ' ez-wz-kachel--ico' : '') + '" data-o="' + j + '"' + rk(o, j) + '>' + ico(o) + '<span class="ez-wz-kachel__lbl">' + ESC(o.lbl.replace(/(\d) /g, '$1 ')) + '</span>' + (o.sb ? '<span class="ez-wz-kachel__sb">' + ESC(o.sb) + '</span>' : '') + (o.pr ? '<span class="ez-wz-kachel__pr">' + ESC(o.pr) + '</span>' : '') + '</button>' + infoKnopf(o) + '</div>';
      }).join('') + '</div>';
    }
    if (b.typ === 'segment' || b.typ === 'chips') {
      var gitter = b.opts.length > 3 || b.opts.some(function (o) { return o.lbl.length > 14; });
      var ru = radios(b.opts, an);
      return '<div class="ez-wz-karte"><div class="ez-wz-umschalter' + (gitter ? ' ez-wz-umschalter--gitter' : '') + '"' + gruppe('radiogroup') + ' data-block="' + n + '">' + b.opts.map(function (o, j) {
        return '<span class="ez-wz-zelle' + (o.info ? ' mit-info' : '') + (an(o) ? ' ist-an' : '') + '"><button type="button" data-o="' + j + '"' + ru(o, j) + '>' + tupf(o) + ESC(o.lbl) + '</button>' + infoKnopf(o) + '</span>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'liste') {
      var rl = b.multi ? function (o) { return ' role="checkbox" aria-checked="' + an(o) + '"'; } : radios(b.opts, an);
      return '<div class="ez-wz-karte"><div class="ez-wz-liste"' + gruppe(b.multi ? 'group' : 'radiogroup') + ' data-block="' + n + '" data-multi="' + (b.multi ? 1 : 0) + '">' + b.opts.map(function (o, j) {
        return '<div class="ez-wz-reihe ez-wz-reihe--wahl"><button type="button" class="ez-wz-wahl" data-o="' + j + '"' + rl(o, j) + '><span>' + tupf(o) + ESC(o.lbl) + '</span></button>' + infoKnopf(o) + (b.multi ? HAKEN : PUNKT) + '</div>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'tupfen') {
      var rt = radios(b.opts, an), cur = live ? b.opts.find(function (o) { return o.an; }) : w ? b.opts.find(function (o) { return o.v === w.v; }) : b.opts.find(function (o) { return o.an; });
      return '<div class="ez-wz-farben" data-block="' + n + '"><div class="ez-wz-jetzt" aria-live="polite">' + (cur ? '<span class="ez-wz-tupf" style="background:' + ESC(cur.farbe) + '"></span><span><b>' + ESC(cur.name.replace(/^RAL \d+ /, '')) + '</b><small>' + ESC(cur.name.match(/^RAL \d+/) ? cur.name.match(/^RAL \d+/)[0] : '') + '</small></span>' : '<span class="ez-wz-tupf ez-wz-tupf--offen"></span><span><b>' + ESC(q._jetzt ? q._jetzt.b : 'Noch offen') + '</b><small>' + ESC(q._jetzt ? q._jetzt.small : '') + '</small></span>') + '</div>' +
        '<div class="ez-wz-tupfen" role="radiogroup" aria-label="' + ESC(b.label || 'Farben') + '">' + b.opts.map(function (o, j) {
          return '<button type="button" data-o="' + j + '"' + rt(o, j) + ' aria-label="' + ESC(o.name) + '"><span class="ez-wz-tupf" style="background:' + ESC(o.farbe) + '"></span>' + ESC(/^RAL \d+/.test(o.name) ? o.v : o.name) + '</button>';
        }).join('') + '</div></div>';
    }
    if (b.typ === 'zaehler') {
      return '<div class="ez-wz-karte"><div class="ez-wz-liste" data-block="' + n + '">' + b.opts.map(function (o, j) {
        var wert = !live && w && w.z ? w.z[j] : V.num(o.wert);
        return '<div class="ez-wz-reihe"><span class="ez-wz-wahl" style="flex:1"><span><b>' + ESC(o.b) + '</b><small>' + ESC(o.small) + '</small></span></span><span class="ez-wz-stepper"><button type="button" data-z="' + j + '" data-d="-1" aria-label="' + ESC(o.b) + ': weniger"' + (wert <= 0 ? ' disabled' : '') + '>−</button><output aria-live="polite">' + wert + '</output><button type="button" data-z="' + j + '" data-d="1" aria-label="' + ESC(o.b) + ': mehr">+</button></span></div>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'zeilen') {
      return '<div class="ez-wz-karte"><div class="ez-wz-liste" data-block="' + n + '">' + b.opts.map(function (o, j) {
        if (o.art === 'schalter') { var ein = !live && w && w.s ? w.s[j] : o.an; return '<div class="ez-wz-reihe"><span class="ez-wz-wahl" style="flex:1"><span><b>' + mitI(ESC(o.b), infoKnopf(o)) + '</b>' + (o.small ? '<small>' + ESC(o.small) + '</small>' : '') + '</span></span><button type="button" class="ez-wz-schalter" role="switch" data-s="' + j + '" aria-checked="' + !!ein + '" aria-label="' + ESC(o.b) + '"></button></div>'; }
        if (o.art === 'text') return '<label class="dna-label" for="wz-text-' + j + '">' + ESC(o.label) + '</label><textarea class="ez-wz-text" id="wz-text-' + j + '" rows="3" data-t="' + j + '" placeholder="' + ESC(o.ph || '') + '">' + ESC(live ? (o.wert || '') : w && w.t ? w.t : '') + '</textarea>';
        return '<p class="ez-wz-hinweis">' + ESC(o.text) + '</p>';
      }).join('') + '</div></div>';
    }
    if (b.typ === 'aufteilung') {
      var p = !live && w && w.p ? w.p : (b.p || 50);
      return '<div class="ez-wz-karte ez-wz-teile" data-block="' + n + '"><p class="dna-label">' + ESC(b.titel) + '</p><div class="ez-wz-teile__werte">' + b.werte.map(function (x, j) { return '<button type="button" data-breite="' + j + '" aria-label="' + ESC(x.label) + '"><b>' + zahlKlein(x.b) + '</b><small>' + ESC(x.small) + '</small></button>'; }).join('') + '</div><input type="range" class="ez-wz-regler" min="' + (b.min || 30.5) + '" max="' + (b.max || 69.5) + '" step="' + (b.step || 0.5) + '" value="' + p + '" style="--p:' + ((p - (b.min || 30.5)) / ((b.max || 69.5) - (b.min || 30.5)) * 100).toFixed(1) + '%" aria-label="' + ESC(b.regler || 'Breite verschieben') + '"><p class="ez-wz-hinweis">' + ESC(b.hinweis) + '</p></div>';
    }
    if (b.typ === 'offen') { var off = live ? !!b.an : w ? !!w.an : b.an; return '<button type="button" class="ez-wz-leise ez-wz-offen" data-block="' + n + '" data-offen="1" aria-pressed="' + off + '"><span><b>' + ESC(b.b) + '</b><small>' + ESC(b.small) + '</small></span>' + HAKEN + '</button>'; }
    if (b.typ === 'mehr') return '<button type="button" class="ez-wz-leise" data-block="' + n + '" data-mehr="' + ESC(b.v) + '"><span><b>' + ESC(b.b) + '</b><small>' + ESC(b.small) + '</small></span><span class="ez-wz-plus" aria-hidden="true">+</span></button>';
    if (b.typ === 'knoepfe') return '<div class="ez-wz-knoepfe">' + b.opts.map(function (o) { return '<button type="button" class="ez-wz-umriss" data-alle="' + ESC(o.lbl) + '">' + ESC(o.lbl) + '</button>'; }).join('') + '</div>';
    if (b.typ === 'label') return '<p class="dna-label ez-wz-zwischen">' + ESC(b.text) + '</p>';
    if (b.typ === 'hinweis') return '<p class="ez-wz-hinweis">' + ESC(b.text) + '</p>';
    if (b.typ === 'hinweise') return b.texts.map(function (t) { return '<p class="ez-wz-hinweis">' + ESC(t) + '</p>'; }).join('');
    if (b.typ === 'aktuell') { q._jetzt = b; return q.bloecke.some(function (x) { return x.typ === 'tupfen'; }) ? '' : '<p class="ez-wz-hinweis"><b style="color:var(--weiss);font-weight:500">' + ESC(b.b) + '</b>' + (b.small ? ' · ' + ESC(b.small) : '') + '</p>'; }
    return '';
  }
  /* Titel: das gefragte Wort weiß, der Rest grau; „innen“ und „außen“ immer weiß (Gremium K und F). Je Titel ein weißer Abschnitt:
     steht „innen“ oder „außen“ im Titel, reicht er vom ersten bis zum letzten dieser Wörter, mit dem Wort der App, wenn es direkt davor
     steht („Welche Farbe außen?“, „Öffnet nach innen oder außen?“); das Satzzeichen gehört dazu (Typografie 2 und 3) */
  function titelHtml(h1) {
    h1 = NBT(h1);
    var rein = h1.replace(/<em>.*?<\/em>/g, '').replace(/[\s?.!]/g, ''); if (!rein) return h1.replace(/<\/?em>/g, '');
    var t = h1.replace(/(^|\s)(innen|außen)(?=[\s?.!<]|$)/g, '$1<em>$2</em>').replace(/<\/em>(\s+)<em>/g, '$1');
    var sek = [], m, r = /<em>([\s\S]*?)<\/em>/g; while ((m = r.exec(t))) if (/(^|\s)(innen|außen)/.test(m[1])) sek.push({ a: m.index, z: r.lastIndex });
    if (sek.length) { var A = sek[0].a, Z = sek[sek.length - 1].z, ohne = function (x) { return x.replace(/<\/?em>/g, ''); }; t = ohne(t.slice(0, A)) + '<em>' + ohne(t.slice(A, Z)) + '</em>' + ohne(t.slice(Z)); }
    return t.replace(/<\/em>\s(\d+)/g, '\u00a0$1</em>').replace(/<\/em>([?.!])/g, '$1</em>');
  }
  /* Das i hängt am letzten Wort des Titels (wie .lg-i in der Lage der App) */
  function titelMitI(h1El, q) {
    if (!(q.gloss && q.gloss.k)) return;
    var knopf = d.createElement('button'); knopf.type = 'button'; knopf.className = 'ez-i ez-wz-i'; knopf.id = 'wz-i';
    knopf.setAttribute('data-gloss', q.gloss.k); knopf.setAttribute('aria-label', q.gloss.label || 'Erklärung'); knopf.setAttribute('aria-expanded', 'false'); knopf.setAttribute('aria-controls', 'wz-erkl'); knopf.innerHTML = I_SVG;
    var w = d.createTreeWalker(h1El, NodeFilter.SHOW_TEXT), letzt = null; while (w.nextNode()) if (w.currentNode.nodeValue.trim()) letzt = w.currentNode;
    if (!letzt) return h1El.appendChild(knopf);
    var v = letzt.nodeValue.replace(/\s+$/, ''), k = Math.max(v.lastIndexOf(' '), -1), wort = d.createElement('span'); wort.className = 'ez-wz-nb';
    var rest = letzt.splitText(k + 1); letzt.parentNode.insertBefore(wort, rest); wort.appendChild(rest); wort.appendChild(knopf);
  }
  /* Gleiche Frage: Elemente bleiben, nur Attribute, Texte und Werte gleichen sich an; so laufen Ring, Licht und Rückfedern weiter */
  function angleichen(alt, neu) {
    var ak = alt.childNodes, nk = Array.prototype.slice.call(neu.childNodes), i;
    if (ak.length !== nk.length) { alt.replaceChildren.apply(alt, nk); return; }
    for (i = 0; i < nk.length; i++) {
      var a = ak[i], b = nk[i];
      if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { alt.replaceChild(b, a); continue; }
      if (a.nodeType === 3) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; continue; }
      if (a.nodeType !== 1) continue;
      var j, at; for (j = a.attributes.length - 1; j >= 0; j--) { at = a.attributes[j].name; if (!b.hasAttribute(at)) a.removeAttribute(at); }
      for (j = 0; j < b.attributes.length; j++) { at = b.attributes[j]; if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value); }
      if (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT') { var wert = a.tagName === 'TEXTAREA' ? b.value : b.getAttribute('value'); if (d.activeElement !== a && wert != null && a.value !== wert) a.value = wert; continue; }
      if (a.tagName === 'svg') { if (a.innerHTML !== b.innerHTML) alt.replaceChild(b, a); continue; }
      angleichen(a, b);
    }
  }
  /* Antworten neu zeichnen, den Fokus behalten (live nach jedem Tipp) */
  function antwortSetzen(q) {
    var f = d.activeElement, merk = f && antwort.contains(f) ? { b: f.closest('[data-block]') ? f.closest('[data-block]').getAttribute('data-block') : null, o: f.getAttribute('data-o'), z: f.getAttribute('data-z'), dd: f.getAttribute('data-d'), s: f.getAttribute('data-s'), t: f.tagName === 'TEXTAREA' || f.type === 'range' } : null;
    if (merk && merk.t) return; /* beim Tippen in ein Feld nicht neu zeichnen */
    q._jetzt = null; q.bloecke.forEach(function (b) { if (b.typ === 'aktuell') q._jetzt = b; });
    var html = q.bloecke.map(function (b, n) { return blockHtml(q, b, n); }).join('');
    if (antwort._q === q.id && antwort.firstChild) { var t = d.createElement('div'); t.innerHTML = html; angleichen(antwort, t); }
    else antwort.innerHTML = html;
    antwort._q = q.id;
    if (merk && merk.b != null) {
      var sel = '[data-block="' + merk.b + '"]', z = antwort.querySelector(sel); if (!z) return;
      var ziel = merk.o != null ? z.querySelector('[data-o="' + merk.o + '"]') : merk.z != null ? z.querySelector('[data-z="' + merk.z + '"][data-d="' + merk.dd + '"]') : merk.s != null ? z.querySelector('[data-s="' + merk.s + '"]') : z.matches('button') ? z : null;
      if (ziel) ziel.focus({ preventScroll: true });
    }
  }
  function frageZeigen(richtung) {
    var q = aktuelle(); if (!q) return;
    $('wz-pos').textContent = stelle(q);
    var h1El = $('wz-h1'); h1El.innerHTML = titelHtml(q.h1); titelMitI(h1El, q); $('wz-sub').textContent = NBT(q.sub || '');
    /* Auf der Notizfrage ist das Feld schon die Notiz (Gremium G und K) */
    var nz = $('wz-notiz'); nz.hidden = q.id === 'notiz'; nz.setAttribute('aria-label', q.notiz || 'Notiz');
    /* Hinweis der Bühne: live zeigt ihn die App selbst; sonst der ausgelesene */
    var hint = $('wz-hint'), ht = B ? '' : q.hint && !/drehen/i.test(q.hint) ? q.hint : ''; hint.hidden = !ht; hint.textContent = ht;
    /* Schritt-Chip ohne Endzahl, der Ring zeigt den Anteil der Fragen (Gremium: „Schritt 6 von 6“ las sich wie „fertig“) */
    var L = B && LQ ? null : liste(), pos = B && LQ ? q.pos : L.indexOf(stand.i), an = B && LQ ? q.anzahl : L.length;
    var ring = buehne.querySelector('.ez-glaschip .ez-ring'); if (ring) ring.style.setProperty('--anteil', Math.max(0.04, (pos + 1) / Math.max(1, an)).toFixed(3));
    antwortSetzen(q);
    if (!B) { bildZeigen(gewaehltesBild(q) || q.bild, false); optBilderLaden(q); }
    $('wz-bildtext').textContent = (B ? '3-D-Modell deines Fensters aus der App, drehbar' : 'Modell deines Fensters') + ', zur Frage: ' + $('wz-h1').textContent;
    var letzt = B && LQ ? q.letzte : L[L.length - 1] === stand.i;
    weiterWort.textContent = letzt ? (V.istTuer() ? 'Tür speichern' : V.art() === 'fest' ? 'Verglasung speichern' : 'Fenster speichern') : 'Weiter';
  }
  /* Ohne Bühnenfenster: die Bilder der Optionen im Leerlauf laden, damit die Überblendung beim Tipp sofort beginnt (Vorlagen FE 4) */
  function optBilderLaden(q) {
    var los = function () { (q.bloecke || []).forEach(function (b) { (b.opts || []).forEach(function (o) { if (!o.bild || optBilderLaden[o.bild.src]) return; var im = new Image(); im.decoding = 'async'; im.src = o.bild.src; optBilderLaden[o.bild.src] = im; if (im.decode) im.decode().catch(function () {}); }); }); };
    if (window.requestIdleCallback) requestIdleCallback(los, { timeout: 1200 }); else setTimeout(los, 300);
  }
  function gewaehltesBild(q) {
    var src = null;
    (q.bloecke || []).forEach(function (b, n) {
      if (!b.opts || ['karten', 'segment', 'chips', 'tupfen', 'liste'].indexOf(b.typ) < 0) return;
      var w = F.wahl[q.id + ':' + n], o = w ? b.opts.find(function (x) { return x.v === w.v; }) : b.opts.find(function (x) { return x.an; });
      if (o && o.bild) src = o.bild;
    });
    return src;
  }
  /* Nach jedem Wechsel sind die Antworten 450 ms taub für Zeigerklicks: ein Doppeltipp auf Weiter oder Zurück wählt nichts (UX 2) */
  antwort.addEventListener('click', function (e) { if (e.detail !== 0 && Date.now() < schrittBis) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  function wahlSetzen(el, an) { el.setAttribute(el.hasAttribute('aria-checked') ? 'aria-checked' : 'aria-pressed', String(an)); if (el.getAttribute('role') === 'radio') el.tabIndex = an ? 0 : -1; }
  /* Pfeiltasten in einer Radiogruppe wählen die Nachbarn, wie bei Schritt 1 */
  antwort.addEventListener('keydown', function (e) {
    var r = e.target.closest && e.target.closest('[role="radio"]'); if (!r) return;
    var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!dir) return;
    e.preventDefault();
    var alle = Array.prototype.slice.call(r.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]')), nb = alle[(alle.indexOf(r) + dir + alle.length) % alle.length];
    nb.focus({ preventScroll: false }); nb.click();
  });
  antwort.addEventListener('click', function (e) {
    var q = aktuelle(), t = e.target, live = !!(B && LQ && q === LQ);
    var gl = t.closest('[data-gloss]'); if (gl) return erklaeren(gl.getAttribute('data-gloss'), gl);
    var al = t.closest('[data-alle]'); if (al) return V.status('In der App öffnet „' + al.getAttribute('data-alle') + '“ die ganze Farbkarte.');
    if (t.closest('[data-breite]')) return V.status('In der App öffnet sich hier die Eingabe der Breite.');
    var blockEl = t.closest('[data-block]'); if (!blockEl) return;
    var n = +blockEl.getAttribute('data-block'), b = q.bloecke[n], id = q.id + ':' + n;
    if (live) {
      /* Live: die App entscheidet und zeichnet; die Folie liest danach neu (liveNeu) */
      if (blockEl.hasAttribute('data-offen')) return B.bedien(n, 'offen');
      if (blockEl.hasAttribute('data-mehr')) return B.bedien(n, 'mehr');
      var lz = t.closest('[data-z]'); if (lz) return B.bedien(n, 'stufe', +lz.getAttribute('data-z'), +lz.getAttribute('data-d'));
      var ls = t.closest('[data-s]'); if (ls) return B.bedien(n, 'schalter', +ls.getAttribute('data-s'));
      var lo = t.closest('[data-o]'); if (!lo) return;
      /* Der Ring steht im nächsten Bild, die App rechnet erst danach (Vorlagen FE 2) */
      if (lo.getAttribute('role') === 'radio') { blockEl.querySelectorAll('[data-o]').forEach(function (x) { wahlSetzen(x, x === lo); }); blockEl.querySelectorAll('.ez-wz-zelle').forEach(function (zz) { zz.classList.toggle('ist-an', zz.contains(lo)); }); }
      else wahlSetzen(lo, (lo.getAttribute('aria-checked') || lo.getAttribute('aria-pressed')) !== 'true');
      var jo = +lo.getAttribute('data-o'); requestAnimationFrame(function () { setTimeout(function () { B.bedien(n, 'opt', jo); }, 0); }); return;
    }
    var m = t.closest('[data-mehr]'); if (m) return V.status('In der App kommen hier die Detailfragen dazu: ' + m.querySelector('small').textContent + '.');
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
      if (pos >= 0) mv.v.splice(pos, 1); else mv.v.push(o.v); F.wahl[id] = mv; wahlSetzen(ob, pos < 0); return;
    }
    F.wahl[id] = { v: o.v }; if (q.id === 'teilung') F.wahl.teilung = { v: o.v };
    blockEl.querySelectorAll('[data-o]').forEach(function (x) { wahlSetzen(x, x === ob); });
    blockEl.querySelectorAll('.ez-wz-zelle').forEach(function (zz) { zz.classList.toggle('ist-an', zz.contains(ob)); });
    var offen = antwort.querySelector('[data-offen]'); if (offen && offen.getAttribute('aria-pressed') === 'true') { offen.setAttribute('aria-pressed', 'false'); F.wahl[q.id + ':' + offen.getAttribute('data-block')] = { an: false }; }
    if (b.typ === 'tupfen') { var jt = blockEl.querySelector('.ez-wz-jetzt'); jt.innerHTML = '<span class="ez-wz-tupf" style="background:' + ESC(o.farbe) + '"></span><span><b>' + ESC(o.name.replace(/^RAL \d+ /, '')) + '</b><small>' + ESC((o.name.match(/^RAL \d+/) || [''])[0]) + '</small></span>'; }
    if (o.bild) bildZeigen(o.bild, true);
  });
  antwort.addEventListener('input', function (e) {
    var t = e.target, q = aktuelle(), blockEl = t.closest('[data-block]'); if (!blockEl) return;
    var n = +blockEl.getAttribute('data-block'), id = q.id + ':' + n, live = !!(B && LQ && q === LQ);
    if (t.classList.contains('ez-wz-regler')) {
      t.style.setProperty('--p', ((+t.value - +t.min) / (+t.max - +t.min) * 100).toFixed(1) + '%');
      if (live) return B.bedien(n, 'regler', t.value);
      var p = +t.value; F.wahl[id] = { p: p }; var br = V.werte().elW || 0, frei = br - 2 * 98, w1 = Math.round(frei * p / 100), w2 = Math.round(frei - w1), vs = blockEl.querySelectorAll('.ez-wz-teile__werte button');
      if (frei > 0 && vs.length === 2) { vs[0].querySelector('b').innerHTML = zahlKlein(V.tausend(w1) + NB + 'mm'); vs[0].querySelector('small').textContent = 'Flügel 1 · ' + Math.round(p) + ' %'; vs[1].querySelector('b').innerHTML = zahlKlein(V.tausend(w2) + NB + 'mm'); vs[1].querySelector('small').textContent = 'Flügel 2 · ' + Math.round(100 - p) + ' %'; }
    }
    if (t.classList.contains('ez-wz-text')) { if (live) B.bedien(n, 'text', t.value); else F.wahl[id] = { t: t.value }; }
  });
  /* Nach dem Ziehen am Regler oder dem Verlassen des Felds den Stand der App übernehmen (Werte in mm) */
  antwort.addEventListener('change', function () { if (B && LQ) { var f = d.activeElement; if (f && f.blur && (f.type === 'range')) f.blur(); liveNeu(); } });
  $('wz-h1').addEventListener('click', function (e) { var k = e.target.closest('#wz-i'); if (k) erklaeren(k.getAttribute('data-gloss'), k); });
  $('wz-notiz').addEventListener('click', function () { V.status('In der App öffnet sich hier die Notiz zu dieser Frage.'); });
  $('wz-tiefe').addEventListener('click', function () { zeigeSchritt('tiefe', -1); });

  /* ---------- Schritte und Fuß ---------- */
  /* Nach jedem Schritt ist die Pille 450 ms taub für Zeigerklicks (Doppeltipp, UX 1); Tastatur gleitet nicht (Bewegung 4) */
  var schrittBis = 0, tastatur = function () { return V.tastatur ? V.tastatur() : false; };
  function zeigeSchritt(name, richtung) {
    stand.schritt = name; if (richtung) schrittBis = Date.now() + 450;
    Object.keys(schritte).forEach(function (k) { schritte[k].hidden = k !== name; });
    var fr = name === 'frage';
    bandSetzen();
    if (name === 'lage') { requestAnimationFrame(function () { lgMass(); dna.classList.add('lg-still'); lgZeigen(); void dna.offsetWidth; requestAnimationFrame(function () { dna.classList.remove('lg-still'); }); }); weiterWort.textContent = 'Weiter'; }
    else if (name === 'tiefe') { dna.classList.add('lg-still'); tfZeigen(false); requestAnimationFrame(function () { dna.classList.remove('lg-still'); }); weiterWort.textContent = 'Weiter'; grund.hidden = true; }
    else { grund.hidden = true; if (B) { LQ = null; richtungNext = richtung; liveNeu(); if (LQ) { vorladen(); return kopfZurueck(name); } } frageZeigen(richtung); }
    kopfZurueck(name);
    if (richtung) { var app = d.getElementById('app'); if (app) app.scrollTop = 0; window.scrollTo(0, 0); }
    folgeSchritt(richtung);
    vorladen();
  }
  function kopfZurueck(name) { var zur = name === 'lage' ? 'Zurück zum Ergebnis' : 'Zurück'; $('wz-zurueck').setAttribute('aria-label', zur); folie.querySelector('[data-wz-zurueck]').setAttribute('aria-label', zur); }
  /* Fokus, Einfahren und Ansage nach einem Wechsel (auch, wenn die App die nächste Frage meldet) */
  function folgeSchritt(richtung) {
    var name = stand.schritt, fr = name === 'frage';
    var h = (fr ? schritte.frage : schritte[name]).querySelector('h1'); if (h && richtung) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (richtung && !V.ruhig() && !tastatur()) (fr ? [schritte.frage.querySelector('.ez-frage'), antwort] : [schritte[name]]).forEach(function (el) { if (el.animate) el.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 160, easing: 'cubic-bezier(.16,1,.3,1)' }); });
  }
  /* Ohne Bühnenfenster: Bilder der nächsten Frage im Leerlauf laden */
  function vorladen() { if (B) return; var L = liste(), k = stand.schritt === 'frage' ? L.indexOf(stand.i) : -1, n = L[k + 1]; if (n == null) return; var q = D.fragen[n]; if (q.bild) { var im = new Image(); im.decoding = 'async'; im.src = q.bild.src; vorladen.im = im; if (im.decode) im.decode().catch(function () {}); } }
  function speichern() {
    F.offen = B && LQ ? LQ.offen : offenZaehlen();
    V.status((V.istTuer() ? 'Tür' : 'Fenster') + ' gespeichert.');
    if (d.querySelector('.ez-folie[data-folie="fertig"]')) V.zeigeFolie('fertig', 1);
  }
  function weiter() {
    if (stand.schritt === 'lage') { var f = lgFehlt(); if (f) { lgGrundJetzt = f; lgGrund(); var el = $(f === 'name' ? 't-name' : 'f-bru'); if (el) { el.focus({ preventScroll: true }); var box = el.closest('.lg-feld'); if (box && box.scrollIntoView) box.scrollIntoView({ block: 'center', behavior: V.ruhig() || tastatur() ? 'auto' : 'smooth' }); } return; } V.fenster.name = F.name; if (B) B.lage({ name: F.name, etage: F.etage, bru: F.bru }); return zeigeSchritt('tiefe', 1); }
    if (stand.schritt === 'tiefe') {
      if (B) { B.lage({ name: F.name, etage: F.etage, bru: F.bru }); B.tiefe(F.tiefe); B.erste(); return zeigeSchritt('frage', 1); }
      var L0 = liste(); if (stand.i < L0[0]) stand.i = L0[0]; return zeigeSchritt('frage', 1);
    }
    if (B && LQ) { schrittBis = Date.now() + 450; richtungNext = 1; if (!B.weiter()) { richtungNext = 0; speichern(); } return; }
    var L = liste(), k = L.indexOf(stand.i);
    if (k < L.length - 1) { stand.i = L[k + 1]; return zeigeSchritt('frage', 1); }
    speichern();
  }
  function zurueck() {
    if (stand.schritt === 'lage') return V.zeigeFolie('ergebnis', -1);
    if (stand.schritt === 'tiefe') return zeigeSchritt('lage', -1);
    if (B && LQ) { schrittBis = Date.now() + 450; richtungNext = -1; if (!B.zurueck()) { richtungNext = 0; zeigeSchritt('tiefe', -1); } return; }
    var L = liste(), k = L.indexOf(stand.i);
    if (k > 0) { stand.i = L[k - 1]; return zeigeSchritt('frage', -1); }
    zeigeSchritt('tiefe', -1);
  }
  $('wz-weiter').addEventListener('click', function (e) { if (e.detail !== 0 && Date.now() < schrittBis) return; weiter(); });
  var zurueckKlick = function (e) { if (e.detail !== 0 && Date.now() < schrittBis) return; zurueck(); };
  $('wz-zurueck').addEventListener('click', zurueckKlick);
  folie.querySelector('[data-wz-zurueck]').addEventListener('click', zurueckKlick);
  /* Enter am Rechner wie „Weiter“ (nicht in Feldern und nicht auf Knöpfen) */
  d.addEventListener('keydown', function (e) {
    if (folie.hidden || e.altKey || e.ctrlKey || e.metaKey || e.key !== 'Enter') return;
    var t = e.target; if (t && (t.tagName === 'TEXTAREA' || (t.closest && t.closest('button, a, .ez-bogen:not([hidden])')))) return;
    if (t && t.tagName === 'INPUT') { t.blur(); }
    e.preventDefault(); if (!e.repeat) weiter();
  });
  window.addEventListener('resize', function () { if (!folie.hidden && stand.schritt === 'lage') lgMass(); });
  /* Sprung aus „Gespeichert“ (Direkt zu einem Thema): Kapitel der App, z. B. „aufbau“ */
  /* Das Bühnenfenster lädt schon im Leerlauf des Ergebnisses, damit die Wünsche ohne Warten beginnen (Vorlagen FE 3) */
  var ergF = d.querySelector('.ez-folie[data-folie="ergebnis"]');
  if (ergF && window.MutationObserver) new MutationObserver(function () {
    if (ergF.hidden || rahmen) return;
    if (window.requestIdleCallback) requestIdleCallback(function () { if (!ergF.hidden) appLaden(); }, { timeout: 4000 }); else setTimeout(function () { if (!ergF.hidden) appLaden(); }, 2000);
  }).observe(ergF, { attributes: true, attributeFilter: ['hidden'] });
  V.anmelden('wuensche', function (richtung) {
    appLaden(); nachsetzen();
    var sp = F.sprung; F.sprung = null;
    if (sp) { var k = KAP.find(function (x) { return x.k === sp; }); if (k && k.v === 'lage') stand.schritt = 'lage'; else if (k) { if (B) { B.zu(k.v); stand.schritt = 'frage'; } else { var i = D.fragen.findIndex(function (q) { return q.id === k.v; }); if (i >= 0) { stand.i = i; stand.schritt = 'frage'; } } } }
    zeigeSchritt(stand.schritt, richtung || 0);
  });
  /* Offene Wünsche für „Gespeichert“ (Stand): Fragen, bei denen „Weiß ich noch nicht“ gilt */
  function offenZaehlen() {
    var n = 0; liste().forEach(function (i) { var q = D.fragen[i]; q.bloecke.forEach(function (b, k) { if (b.typ !== 'offen') return; var w = F.wahl[q.id + ':' + k]; if (w ? w.an : b.an) n++; }); });
    return n;
  }
})();

/* @ds-bundle: {"format":4,"namespace":"DNA","components":[{"name":"Kennzahl"},{"name":"Leuchtkachel"},{"name":"Pille"},{"name":"BildImSatz"},{"name":"Etikett"},{"name":"Punktraster"},{"name":"Stufendiagramm"},{"name":"Skala"},{"name":"Geraetebuehne"},{"name":"Bento"},{"name":"Schriftfenster"},{"name":"Schritte"},{"name":"Szenen"},{"name":"Auftritt"}]} */
/* Design-DNA – Bewegung und Verhalten der Bausteine, ohne Bibliotheken.
   Alles startet von selbst über data-Attribute; DNA.start(wurzel) startet nachgeladene Teile. */
(function () {
  'use strict';
  var w = window, d = document;

  function reduziert() { return !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function q(wurzel, sel) { return Array.prototype.slice.call((wurzel || d).querySelectorAll(sel)); }
  function einmal(el, name) { var k = 'dnaBereit' + name; if (el.dataset[k]) return false; el.dataset[k] = '1'; return true; }
  function klemme(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function sichtbar(el, cb, schwelle) {
    if (!('IntersectionObserver' in w)) { cb(); return; }
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); cb(); } });
    }, { threshold: schwelle == null ? 0.25 : schwelle, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
  }

  /* Fortschritt eines Elements durch den Bildschirm: 0 = taucht unten auf, 1 = verlässt oben */
  function fortschritt(el) {
    var r = el.getBoundingClientRect(), h = w.innerHeight || 1;
    return klemme((h - r.top) / (h + r.height), 0, 1);
  }

  var scrollTeile = [], geplant = false;
  function tick() { geplant = false; scrollTeile.forEach(function (f) { f(); }); }
  function plane() { if (!geplant) { geplant = true; w.requestAnimationFrame(tick); } }
  w.addEventListener('scroll', plane, { passive: true });
  w.addEventListener('resize', plane);

  /* ---------- Auftritt aus der Unschärfe, Überschrift Wort für Wort ---------- */
  function woerter(el) {
    if (!einmal(el, 'Woerter')) return;
    var i = parseInt(el.getAttribute('data-dna-woerter') || '0', 10) || 0;
    (function gehe(knoten) {
      Array.prototype.slice.call(knoten.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(t)); return; }
            var s = d.createElement('span');
            s.className = 'dna-wort'; s.setAttribute('data-dna-auftritt', ''); s.style.setProperty('--i', i++); s.textContent = t;
            frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          if (n.classList.contains('dna-satz__bild') || n.classList.contains('dna-satz__zeichen')) {
            n.setAttribute('data-dna-auftritt', ''); n.style.setProperty('--i', i++);
          } else { gehe(n); }
        }
      });
    })(el);
  }

  function auftritt(wurzel) {
    q(wurzel, '[data-dna-auftritt]').forEach(function (el) {
      if (!einmal(el, 'Auftritt')) return;
      if (reduziert()) { el.classList.add('ist-da'); return; }
      sichtbar(el, function () { el.classList.add('ist-da'); }, 0.05);
    });
  }

  /* ---------- Zahl rollt einmal auf ihren Endwert (Endwert steht immer im HTML) ---------- */
  function zahlRolle(el) {
    if (!einmal(el, 'Zahl')) return;
    var text = el.textContent.trim();
    var ziel = parseFloat(text.replace(/\./g, '').replace(',', '.'));
    if (isNaN(ziel) || reduziert()) return;
    var stellen = (text.split(',')[1] || '').length;
    var fmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
    var von = parseFloat(el.getAttribute('data-von') || '0');
    sichtbar(el, function () {
      var t0 = null, dauer = 700;
      function bild(t) {
        if (t0 === null) t0 = t;
        var p = klemme((t - t0) / dauer, 0, 1), e = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt.format(von + (ziel - von) * e);
        if (p < 1) w.requestAnimationFrame(bild); else el.textContent = text;
      }
      w.requestAnimationFrame(bild);
    }, 0.4);
  }

  /* ---------- Punktraster: Punkte füllen sich nacheinander ---------- */
  function punkte(el) {
    if (!einmal(el, 'Punkte')) return;
    var werte = (el.getAttribute('data-werte') || '').split(',').map(Number);
    var hoehe = parseInt(el.getAttribute('data-hoehe'), 10) || Math.max.apply(null, werte);
    var markiert = (el.getAttribute('data-markiert') || '').split(',').filter(Boolean).map(Number);
    var alle = [];
    el.innerHTML = '';
    werte.forEach(function (v, s) {
      var sp = d.createElement('div');
      sp.className = 'dna-punkte__spalte' + (markiert.indexOf(s) > -1 ? ' ist-markiert' : '');
      for (var r = 0; r < hoehe; r++) {
        var p = d.createElement('span'); p.className = 'dna-punkte__punkt';
        if (r < v) alle.push({ p: p, s: s, r: r });
        sp.appendChild(p);
      }
      el.appendChild(sp);
    });
    el.setAttribute('role', 'img');
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Werte: ' + werte.join(', '));
    function fuellen() {
      alle.forEach(function (o) {
        if (reduziert()) { o.p.classList.add('ist-voll'); return; }
        setTimeout(function () { o.p.classList.add('ist-voll'); }, o.s * 45 + o.r * 22);
      });
    }
    if (reduziert()) fuellen(); else sichtbar(el, fuellen, 0.3);
  }

  /* ---------- Stufendiagramm mit gestrichelter Linie und Schraffur ---------- */
  var zaehler = 0;
  function stufen(el) {
    if (!einmal(el, 'Stufen')) return;
    var werte = (el.getAttribute('data-werte') || '').split(',').map(Number);
    var markiert = (el.getAttribute('data-markiert') || '').split(',').filter(Boolean).map(Number);
    var achse = (el.getAttribute('data-achse') || '').split(',').filter(Boolean);
    var B = 320, oben = 10, unten = 108, n = werte.length, sw = B / n, kasten = 24;
    var max = Math.max.apply(null, werte), min = Math.min.apply(null, werte);
    function y(v) { return Math.round(unten - kasten - (v - min) / ((max - min) || 1) * (unten - kasten - oben)); }
    var id = 'dna-schraffur-' + (++zaehler), teile = [], pfad = '', punkteSvg = '';
    werte.forEach(function (v, i) {
      var x0 = Math.round(i * sw), x1 = Math.round((i + 1) * sw), yy = y(v);
      pfad += (i === 0 ? 'M' + x0 + ',' + yy : 'V' + yy) + 'H' + x1;
      punkteSvg += '<circle class="stufen-punkt stufen-feld" cx="' + x0 + '" cy="' + yy + '" r="2.4"/>';
      teile.push('<rect class="stufen-kontur stufen-feld" x="' + (x0 + 4) + '" y="' + (yy + 6) + '" width="' + (sw - 8) + '" height="' + kasten + '" rx="2"/>');
      if (markiert.indexOf(i) > -1) teile.push('<rect class="stufen-feld" fill="url(#' + id + ')" x="' + (x0 + 4) + '" y="' + (yy + 6) + '" width="' + (sw - 8) + '" height="' + kasten + '" rx="2"/>');
    });
    var beschriftung = achse.map(function (t, i) {
      var x = achse.length > 1 ? i * (B / (achse.length - 1)) : 0;
      var anker = i === 0 ? 'start' : (i === achse.length - 1 ? 'end' : 'middle');
      return '<text class="stufen-achse" x="' + x + '" y="140" text-anchor="' + anker + '">' + t + '</text>';
    }).join('');
    el.innerHTML = '<svg viewBox="0 0 ' + B + ' 150" role="img" aria-label="' + (el.getAttribute('aria-label') || 'Verlauf') + '">' +
      '<defs><pattern id="' + id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="stufen-schraffur-linie" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>' +
      teile.join('') + '<path class="stufen-linie stufen-zeichnung" d="' + pfad + '"/>' + punkteSvg + beschriftung + '</svg>';
    if (reduziert()) el.classList.add('ist-da'); else sichtbar(el, function () { el.classList.add('ist-da'); }, 0.35);
  }

  /* ---------- Skala: ziehen, Zahl rastet ein, Leuchten folgt dem Wert ---------- */
  function skala(el) {
    if (!einmal(el, 'Skala')) return;
    var min = parseFloat(el.getAttribute('data-min') || '0'), max = parseFloat(el.getAttribute('data-max') || '100');
    var schritt = parseFloat(el.getAttribute('data-schritt') || '10');
    var band = el.querySelector('.dna-skala__band'), fenster = el.querySelector('.dna-skala__fenster');
    var input = el.querySelector('input[type="range"]'), anzeige = el.querySelector('[data-skala-wert]');
    var zielSel = el.getAttribute('data-ziel'), ziel = zielSel ? d.querySelector(zielSel) : null;
    var einheit = el.getAttribute('data-einheit') || '';
    var fmt = new Intl.NumberFormat('de-DE');
    band.style.setProperty('--dna-schritt', schritt + 'px');
    band.style.width = ((max - min) * schritt + 2) + 'px';
    var wert = parseFloat(el.getAttribute('data-wert') || String(min));
    function zeige(roh) {
      var v = Math.round(klemme(roh, min, max));
      band.style.transform = 'translate3d(' + (-(klemme(roh, min, max) - min) * schritt) + 'px,0,0)';
      if (anzeige) anzeige.textContent = fmt.format(v);
      if (ziel) ziel.style.setProperty('--wert', ((v - min) / ((max - min) || 1)).toFixed(3));
      return v;
    }
    function setze(v) {
      wert = zeige(v);
      if (input) { input.value = wert; input.setAttribute('aria-valuetext', fmt.format(wert) + (einheit ? ' ' + einheit : '')); }
      el.dispatchEvent(new CustomEvent('dna-wert', { detail: wert }));
    }
    if (input) {
      input.min = min; input.max = max; input.step = 1;
      input.addEventListener('input', function () { setze(parseFloat(input.value)); });
    }
    var zug = null;
    fenster.addEventListener('pointerdown', function (e) {
      zug = { x: e.clientX, v: wert }; el.classList.add('ist-gezogen');
      if (fenster.setPointerCapture) fenster.setPointerCapture(e.pointerId);
    });
    fenster.addEventListener('pointermove', function (e) {
      if (!zug) return;
      zeige(zug.v - (e.clientX - zug.x) / schritt);
    });
    function ende(e) {
      if (!zug) return;
      var roh = zug.v - ((e && e.clientX != null ? e.clientX : zug.x) - zug.x) / schritt;
      zug = null; el.classList.remove('ist-gezogen'); setze(roh);
    }
    fenster.addEventListener('pointerup', ende);
    fenster.addEventListener('pointercancel', function () { zug = null; el.classList.remove('ist-gezogen'); setze(wert); });
    fenster.addEventListener('click', function () { if (input) input.focus({ preventScroll: true }); });
    setze(wert);
  }

  /* ---------- FLIP: Kacheln gleiten in ihre neue Größe ---------- */
  function flip(kacheln, aenderung) {
    if (reduziert()) { aenderung(); return; }
    var vorher = kacheln.map(function (k) { return k.getBoundingClientRect(); });
    aenderung();
    kacheln.forEach(function (k, i) {
      var a = vorher[i], b = k.getBoundingClientRect();
      if (!b.width || !b.height) return;
      var dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;
      var opt = { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)' };
      k.animate([{ transformOrigin: '0 0', transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')' }, { transformOrigin: '0 0', transform: 'none' }], opt);
      var innen = k.firstElementChild;
      if (innen) innen.animate([{ transformOrigin: '0 0', transform: 'scale(' + (1 / sx) + ',' + (1 / sy) + ')' }, { transformOrigin: '0 0', transform: 'none' }], opt);
    });
  }

  /* ---------- Lebendes Bento-Raster: die große Kachel wandert mit dem Scrollen ---------- */
  function bento(el) {
    if (!einmal(el, 'Bento')) return;
    var kandidaten = q(el, '[data-dna-wechsel]');
    if (kandidaten.length < 2 || reduziert()) return;
    var klasse = 'dna-bento__kachel--' + (el.getAttribute('data-groesse') || 'hoch');
    var stand = Math.max(0, kandidaten.findIndex(function (k) { return k.classList.contains(klasse); }));
    var kacheln = Array.prototype.slice.call(el.children);
    scrollTeile.push(function () {
      var p = fortschritt(el);
      var neu = klemme(Math.floor((p - .3) / .4 * kandidaten.length), 0, kandidaten.length - 1);
      if (neu === stand) return;
      flip(kacheln, function () { kandidaten[stand].classList.remove(klasse); kandidaten[neu].classList.add(klasse); });
      stand = neu;
    });
  }

  /* ---------- Schriftfenster: das Riesenwort fährt mit dem Scrollen seitlich ---------- */
  function maske(el) {
    if (!einmal(el, 'Maske')) return;
    var wort = el.querySelector('.dna-maske__wort');
    if (!wort || reduziert()) return;
    scrollTeile.push(function () {
      var p = fortschritt(el), weg = Math.max(0, wort.scrollWidth - el.clientWidth);
      wort.style.setProperty('--dna-fahrt', (-p * weg).toFixed(1) + 'px');
      wort.style.setProperty('--dna-bild-x', (p * 100).toFixed(1) + '%');
    });
  }

  /* ---------- Teile treten aus der Fläche: Weg folgt dem Scrollen ---------- */
  function heraustreten(el) {
    if (!einmal(el, 'Heraus')) return;
    var bezug = el.closest('[data-dna-bezug]') || el.parentElement;
    var x = parseFloat(el.getAttribute('data-x') || '0'), y = parseFloat(el.getAttribute('data-y') || '0');
    var basis = parseFloat(el.getAttribute('data-basis') || '0.45');
    function setze(p) {
      var t = klemme(basis + p, 0, 1);
      el.style.transform = 'translate3d(' + (x * t).toFixed(1) + 'px,' + (y * t).toFixed(1) + 'px,0) scale(' + (1 + .05 * t).toFixed(3) + ')';
    }
    if (reduziert()) { setze(.55); return; }
    scrollTeile.push(function () { setze((fortschritt(bezug) - .35) * 1.2); });
  }

  /* ---------- Anker: Linien zeichnen sich, dann erscheinen die Etiketten ---------- */
  function anker(el) {
    if (!einmal(el, 'Anker')) return;
    if (reduziert()) { el.classList.add('ist-da'); return; }
    sichtbar(el, function () { el.classList.add('ist-da'); }, 0.35);
  }

  /* ---------- Szenen: nächster Abschnitt schiebt sich wie ein Vorhang darüber ---------- */
  function vorhang() {
    function ordne() {
      q(d, '.dna-szene').forEach(function (s) {
        s.style.setProperty('--dna-szene-oben', Math.min(0, (w.innerHeight || 0) - s.offsetHeight) + 'px');
      });
    }
    ordne();
    w.addEventListener('resize', ordne);
    w.addEventListener('load', ordne);
  }

  function start(wurzel) {
    wurzel = wurzel || d;
    q(wurzel, '[data-dna-woerter]').forEach(woerter);
    auftritt(wurzel);
    q(wurzel, '[data-dna="zahl"]').forEach(zahlRolle);
    q(wurzel, '[data-dna="punkte"]').forEach(punkte);
    q(wurzel, '[data-dna="stufen"]').forEach(stufen);
    q(wurzel, '[data-dna="skala"]').forEach(skala);
    q(wurzel, '[data-dna="bento"]').forEach(bento);
    q(wurzel, '[data-dna="maske"]').forEach(maske);
    q(wurzel, '[data-dna="heraustreten"]').forEach(heraustreten);
    q(wurzel, '[data-dna="anker"]').forEach(anker);
    if (q(wurzel, '.dna-szene').length) vorhang();
    plane();
  }

  w.DNA = { start: start, flip: flip, fortschritt: fortschritt, reduziert: reduziert };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', function () { start(); }); else start();
})();

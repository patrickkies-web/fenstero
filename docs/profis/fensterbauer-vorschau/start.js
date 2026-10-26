/* Seite für Fensterbauer (Vorschau Design-DNA): Leiste beim Hochscrollen, Stationen folgen den Stufen, Paket aus den Karten vorwählen,
   Anfrage an /api/partner/frage. Die Bausteine selbst startet dna/bundle.js. */
(function () {
  'use strict';
  var w = window, d = document;
  var reduziert = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Vorhang ohne Sprung: Die Szenen rechnen mit der größten Bildschirmhöhe dieser Ausrichtung, damit die ein- und ausfahrende
     Adressleiste des Browsers die klebende Kante nicht verschiebt (bundle.js liest innerHeight bei jedem resize) */
  (function () {
    var hoechste = w.innerHeight, breite = w.innerWidth, merker;
    try { Object.defineProperty(w, 'innerHeight', { configurable: true, get: function () { return hoechste; } }); } catch (e) { return; }
    w.addEventListener('resize', function () {
      clearTimeout(merker);
      merker = setTimeout(function () {
        var h = w.document.documentElement.clientHeight, b = w.innerWidth;
        if (b !== breite) { breite = b; hoechste = h; } else if (h > hoechste) { hoechste = h; }
      }, 150);
    });
  })();

  /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite */
  var leiste = d.querySelector('.ez-leiste'), kopf = d.querySelector('.ez-kopf');
  if (leiste) {
    var letzte = w.scrollY || 0, hoch = 0, runter = 0, geplant = false, grenze = 160;
    function messeGrenze() { if (kopf) grenze = kopf.getBoundingClientRect().bottom + (w.scrollY || 0); }
    messeGrenze(); w.addEventListener('resize', messeGrenze); w.addEventListener('load', messeGrenze);
    function pruefe() {
      geplant = false;
      var y = w.scrollY || 0;
      if (y < letzte) { hoch += letzte - y; runter = 0; } else if (y > letzte) { runter += y - letzte; if (runter > 24) hoch = 0; }
      leiste.classList.toggle('ist-da', y > grenze && hoch > 24);
      letzte = y;
    }
    w.addEventListener('scroll', function () { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, { passive: true });
  }

  /* Stationen: die Stufe in der Bildschirmmitte ist „aktiv“, davor „fertig“, danach „offen“ */
  var stufen = Array.prototype.slice.call(d.querySelectorAll('.ez-stufe'));
  var stationen = Array.prototype.slice.call(d.querySelectorAll('.ez-schritte li'));
  function setze(aktiv) {
    stationen.forEach(function (li, i) { li.setAttribute('data-zustand', i < aktiv ? 'fertig' : i === aktiv ? 'aktiv' : 'offen'); });
  }
  if (stufen.length && stationen.length && 'IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) setze(stufen.indexOf(e.target)); });
    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
    stufen.forEach(function (s) { io.observe(s); });
  }
  stationen.forEach(function (li, i) {
    var a = li.querySelector('a'); if (!a) return;
    a.addEventListener('click', function (e) { if (stufen[i]) { e.preventDefault(); stufen[i].scrollIntoView({ behavior: (reduziert || e.detail === 0) ? 'auto' : 'smooth', block: 'center' }); } });
  });

  /* Fokus unter dem Vorhang: liegt das fokussierte Element verdeckt, in die Mitte holen (WCAG 2.4.11) */
  d.addEventListener('focusin', function (e) {
    var el = e.target; if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect(); if (!r.width) return;
    var x = Math.min(Math.max(r.left + r.width / 2, 0), w.innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), w.innerHeight - 1);
    var oben = d.elementFromPoint(x, y);
    if (oben && !el.contains(oben) && !oben.contains(el)) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });

  /* Anfrage: Paket aus den Karten vorwählen, Pflichtfelder prüfen, als JSON an /api/partner/frage (ohne JavaScript schickt der Browser das Formular) */
  var form = d.querySelector('#anfrage-form');
  if (form) {
    var radios = Array.prototype.slice.call(form.querySelectorAll('.ez-radios input'));
    function zeigeWahl() { radios.forEach(function (r) { r.parentNode.setAttribute('aria-pressed', r.checked ? 'true' : 'false'); }); }
    radios.forEach(function (r) { r.addEventListener('change', zeigeWahl); });
    zeigeWahl();
    Array.prototype.slice.call(d.querySelectorAll('[data-paket]')).forEach(function (a) {
      a.addEventListener('click', function () {
        var wert = a.getAttribute('data-paket');
        radios.forEach(function (r) { r.checked = r.value === wert; });
        zeigeWahl();
      });
    });
    var vormerken = d.querySelector('[data-vormerken]'), text = form.querySelector('#f-text');
    if (vormerken && text) vormerken.addEventListener('click', function () { if (!text.value.trim()) text.value = 'Ich interessiere mich für zusätzliche Anfragen aus meiner Nähe.'; });

    var fehler = form.querySelector('.ez-form__fehler'), meldung = form.querySelector('.ez-form__meldung'), knopf = form.querySelector('button[type="submit"]');
    var FEHLER_TEXT = fehler ? fehler.textContent : '';
    function sagFehler(t) { if (!fehler) return; fehler.textContent = t || FEHLER_TEXT; fehler.hidden = false; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var erste = null;
      Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]')).forEach(function (f) {
        var ok = f.checkValidity();
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !erste) erste = f;
      });
      if (erste) { sagFehler(FEHLER_TEXT); erste.focus(); return; }
      if (fehler) fehler.hidden = true;
      var daten = {};
      new FormData(form).forEach(function (v, k) { daten[k] = String(v); });
      if (knopf) { knopf.disabled = true; knopf.setAttribute('aria-busy', 'true'); }
      fetch(form.getAttribute('action'), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(daten), credentials: 'same-origin' })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: r.ok, j: null }; }); })
        .then(function (x) {
          if (x.ok) {
            form.reset(); zeigeWahl();
            if (meldung) meldung.textContent = 'Danke, Ihre Frage ist da. Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.';
          } else {
            var felder = x.j && x.j.felder;
            sagFehler(felder ? Object.keys(felder).map(function (n) { return felder[n]; }).join(' ') : (x.j && x.j.fehler) || 'Ihre Frage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal.');
          }
        })
        .catch(function () { sagFehler('Keine Verbindung. Bitte versuchen Sie es gleich noch einmal.'); })
        .then(function () { if (knopf) { knopf.disabled = false; knopf.removeAttribute('aria-busy'); } });
    });
  }
})();

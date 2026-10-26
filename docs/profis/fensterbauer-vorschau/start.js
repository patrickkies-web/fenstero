/* Seite für Fensterbauer (Vorschau Design-DNA): Leiste beim Hochscrollen, Stationen folgen den Stufen, Vergleich am Schreibtisch offen,
   Paket aus den Karten vorwählen, Anfrage an /api/partner/frage mit Fehlern je Feld. Die Bausteine selbst startet dna/bundle.js. */
(function () {
  'use strict';
  var w = window, d = document;
  var reduziertAbfrage = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduziert() { return !!(reduziertAbfrage && reduziertAbfrage.matches); }

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

  /* Wortebenen nach dem Auftritt freigeben */
  d.addEventListener('transitionend', function (e) { if (e.target.classList && e.target.classList.contains('dna-wort')) e.target.style.willChange = 'auto'; });

  /* Stationen: die Stufe in der Bildschirmmitte ist „aktiv“, davor „fertig“, danach „offen“ */
  var stufen = Array.prototype.slice.call(d.querySelectorAll('.ez-stufe'));
  var stationen = Array.prototype.slice.call(d.querySelectorAll('.ez-schritte li'));
  function setze(aktiv) {
    stationen.forEach(function (li, i) {
      li.setAttribute('data-zustand', i < aktiv ? 'fertig' : i === aktiv ? 'aktiv' : 'offen');
      if (i === aktiv) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }
  if (stufen.length && stationen.length && 'IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) setze(stufen.indexOf(e.target)); });
    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
    stufen.forEach(function (s) { io.observe(s); });
  }
  stationen.forEach(function (li, i) {
    var a = li.querySelector('a'); if (!a) return;
    a.addEventListener('click', function (e) { if (stufen[i]) { e.preventDefault(); stufen[i].scrollIntoView({ behavior: (reduziert() || e.detail === 0) ? 'auto' : 'smooth', block: 'center' }); } });
  });

  /* Vergleich der Merkmale: am Schreibtisch offen, am Telefon zum Aufklappen */
  var vergleich = d.querySelector('#vergleich');
  if (vergleich && w.matchMedia && w.matchMedia('(min-width: 900px)').matches) vergleich.open = true;

  /* Fokus unter dem Vorhang: liegt das fokussierte Element verdeckt, in die Mitte holen (WCAG 2.4.11) */
  d.addEventListener('focusin', function (e) {
    var el = e.target; if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect(); if (!r.width) return;
    var x = Math.min(Math.max(r.left + r.width / 2, 0), w.innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), w.innerHeight - 1);
    var oben = d.elementFromPoint(x, y);
    if (oben && !el.contains(oben) && !oben.contains(el)) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });

  /* Anfrage: Paket aus den Karten vorwählen, Pflichtfelder je Feld prüfen, als JSON an /api/partner/frage
     (ohne JavaScript prüft der Browser und schickt das Formular selbst) */
  var form = d.querySelector('#anfrage-form');
  if (form) {
    form.setAttribute('novalidate', '');
    var radios = Array.prototype.slice.call(form.querySelectorAll('.ez-radios input'));
    function zeigeWahl() { radios.forEach(function (r) { r.parentNode.classList.toggle('ist-wahl', r.checked); }); }
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

    var fehler = form.querySelector('.ez-form__fehler'), meldung = form.querySelector('.ez-form__meldung'), knopf = form.querySelector('button[type="submit"]'), knopftext = form.querySelector('.ez-form__knopftext');
    var FEHLER_TEXT = fehler ? fehler.textContent : '', laeuft = false;
    var TEXTE = { 'f-name': 'Bitte Ihren Namen angeben.', 'f-mail': 'Bitte eine gültige E-Mail-Adresse angeben, z. B. name@betrieb.de.' };
    function feldFehler(f, text) {
      var ziel = d.getElementById(f.id + '-fehler');
      f.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (ziel) { ziel.textContent = text || ''; ziel.classList.toggle('ist-da', !!text); }
    }
    function sagFehler(t, fokus) { if (!fehler) return; fehler.textContent = t || FEHLER_TEXT; fehler.hidden = false; if (fokus) fehler.focus(); }
    Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]')).forEach(function (f) {
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true' && f.checkValidity()) feldFehler(f, ''); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (laeuft) return;
      var erste = null;
      Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]')).forEach(function (f) {
        var ok = f.checkValidity();
        feldFehler(f, ok ? '' : (TEXTE[f.id] || 'Bitte prüfen Sie diese Angabe.'));
        if (!ok && !erste) erste = f;
      });
      if (erste) { sagFehler(FEHLER_TEXT, false); erste.focus(); return; }
      if (fehler) fehler.hidden = true;
      var daten = {};
      new FormData(form).forEach(function (v, k) { daten[k] = String(v); });
      laeuft = true; form.classList.add('ist-busy');
      if (knopf) knopf.setAttribute('aria-busy', 'true');
      if (knopftext) knopftext.textContent = 'Wird gesendet …';
      fetch(form.getAttribute('action'), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(daten), credentials: 'same-origin' })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: r.ok, j: null }; }); })
        .then(function (x) {
          if (x.ok) {
            form.reset(); zeigeWahl();
            form.classList.add('ist-gesendet');
            if (meldung) { meldung.textContent = 'Danke, Ihre Anfrage ist da. Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.'; meldung.focus(); }
          } else {
            var felder = x.j && x.j.felder;
            sagFehler(felder ? Object.keys(felder).map(function (n) { return felder[n]; }).join(' ') : (x.j && x.j.fehler) || 'Ihre Anfrage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal.', true);
          }
        })
        .catch(function () { sagFehler('Keine Verbindung. Bitte versuchen Sie es gleich noch einmal.', true); })
        .then(function () { laeuft = false; form.classList.remove('ist-busy'); if (knopf) knopf.removeAttribute('aria-busy'); if (knopftext) knopftext.textContent = 'Anfrage senden'; });
    });
  }
})();

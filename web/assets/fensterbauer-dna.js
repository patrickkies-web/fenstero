/* Seite für Fensterbauer (/fuer-fensterbauer/, Design-DNA seit 26.10.2026; Vorschau docs/profis/fensterbauer-vorschau/), auch eingebettet
   auf der Startseite (Ansicht Fensterbauer: portal.js nimmt den Rahmen .fb und ruft FbSeite.auf(rahmen, { eingebettet: true })).
   Auf der eigenen Seite startet die Datei selbst; ein neuer Start beendet den vorigen (AbortController). Die Bausteine der DNA
   (Auftritt, Anker, Vorhang) startet dna/bundle.js von selbst, eingebettet ruft auf() DNA.start(rahmen) nach.
   Das Anfrageformular schickt als JSON an POST /api/auftrag/frage (Felder wie functions/auftrag/index.js: name, firma, mail, tel, paket,
   text, Honigtopf fax); ohne JavaScript geht es als normales Formular ab und endet auf der Dankesseite des Servers. */
(function () {
  'use strict';
  var w = window, d = document, lauf = null, stabil = false;
  var reduziertAbfrage = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduziert() { return !!(reduziertAbfrage && reduziertAbfrage.matches); }
  function breit() { return !!(w.matchMedia && w.matchMedia('(min-width: 900px)').matches); }

  /* Vorhang ohne Sprung: Die Szenen rechnen mit der größten Bildschirmhöhe dieser Ausrichtung, damit die ein- und
     ausfahrende Adressleiste des Browsers die klebende Kante nicht verschiebt (bundle.js liest innerHeight bei jedem resize); gelesen wird
     der echte Getter, nicht clientHeight (den hält iOS Safari auf der kleinen Höhe) */
  function stabilisieren() {
    if (stabil) return;
    stabil = true;
    var echt = Object.getOwnPropertyDescriptor(w, 'innerHeight') || Object.getOwnPropertyDescriptor(Window.prototype, 'innerHeight');
    if (!echt || !echt.get) return;
    var lies = function () { return echt.get.call(w); };
    var hoechste = lies(), breite = w.innerWidth, merker;
    try { Object.defineProperty(w, 'innerHeight', { configurable: true, get: function () { return Math.max(hoechste, lies()); } }); } catch (e) { return; }
    w.addEventListener('resize', function () {
      clearTimeout(merker);
      merker = setTimeout(function () { var h = lies(), b = w.innerWidth; if (b !== breite) { breite = b; hoechste = h; } else if (h > hoechste) hoechste = h; }, 150);
    });
  }

  function auf(rahmen, opt) {
    if (!rahmen || rahmen.dataset.fbAn === '1') return;
    if (lauf) lauf.ctl.abort();
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    lauf = { ctl: ctl || { abort: function () {} }, rahmen: rahmen };
    rahmen.dataset.fbAn = '1';
    opt = opt || {};
    var eingebettet = !!opt.eingebettet;
    var sig = ctl ? { signal: ctl.signal } : {}, sigPassiv = ctl ? { signal: ctl.signal, passive: true } : { passive: true };
    var lebt = function () { return rahmen.isConnected && !(ctl && ctl.signal.aborted); };
    var beiEnde = function (fn) { if (ctl) ctl.signal.addEventListener('abort', fn, { once: true }); };
    var $ = function (s) { return rahmen.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(rahmen.querySelectorAll(s)); };
    d.documentElement.classList.add('ez-js');
    stabilisieren();
    if (eingebettet) {
      /* im Portal: der Umschalter bleibt in der Ansicht (Hash), die Bausteine der DNA starten für den nachgeladenen Rahmen */
      rahmen.classList.add('eingebettet');
      $$('.ez-ansicht a[aria-current]').forEach(function (a) { a.setAttribute('href', '/fensterbauer'); });
      if (w.DNA && w.DNA.start) w.DNA.start(rahmen);
    }

    /* Vorhang: ändert eine Szene ihre Höhe (Vergleichstabelle auf, Schriften geladen), rechnet bundle.js die klebende Kante neu (es hört auf resize) */
    if ('ResizeObserver' in w) {
      var ro = new ResizeObserver(function () { if (lebt()) w.dispatchEvent(new Event('resize')); });
      $$('.dna-szene').forEach(function (s) { ro.observe(s); });
      beiEnde(function () { ro.disconnect(); });
    }

    /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite. Die Grenze wird ohne den
       Versatz der klebenden Szene gemessen (Kopfunterkante relativ zur Szene plus Flusslage des Rahmens) */
    var leiste = $('.ez-leiste'), kopf = $('.ez-kopf'), szene1 = kopf ? kopf.closest('.dna-szene') : null;
    if (leiste) {
      var letzte = w.scrollY || 0, hoch = 0, runter = 0, geplant = false, grenze = 160;
      var messeGrenze = function () {
        if (!kopf) return;
        var r = rahmen.getBoundingClientRect(), k = kopf.getBoundingClientRect(), s = szene1 ? szene1.getBoundingClientRect() : r;
        grenze = r.top + (w.scrollY || 0) + (k.bottom - s.top);
      };
      messeGrenze(); w.addEventListener('resize', messeGrenze, sig); w.addEventListener('load', messeGrenze, sig);
      var pruefe = function () {
        geplant = false; if (!lebt()) return;
        var y = w.scrollY || 0;
        if (y < letzte) { hoch += letzte - y; runter = 0; } else if (y > letzte) { runter += y - letzte; if (runter > 24) hoch = 0; }
        leiste.classList.toggle('ist-da', y > grenze && hoch > 24);
        letzte = y;
      };
      w.addEventListener('scroll', function () { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, sigPassiv);
    }

    /* Wortebenen nach dem Auftritt freigeben */
    rahmen.addEventListener('transitionend', function (e) { if (e.target.classList && e.target.classList.contains('dna-wort')) e.target.style.willChange = 'auto'; }, sig);

    /* Stationen (ab 900 px sichtbar): die Stufe, die der Bildschirmmitte am nächsten liegt, ist „aktiv“, davor „fertig“, danach „offen“ */
    var stufen = $$('.ez-stufe'), stationen = $$('.ez-schritte li');
    function setze(aktiv) {
      stationen.forEach(function (li, i) {
        li.setAttribute('data-zustand', i < aktiv ? 'fertig' : i === aktiv ? 'aktiv' : 'offen');
        if (i === aktiv) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
    }
    if (stufen.length && stationen.length && 'IntersectionObserver' in w) {
      var io = new IntersectionObserver(function () {
        if (!lebt() || !breit()) return;
        var h = d.documentElement.clientHeight || w.innerHeight, mitte = h / 2, best = -1, abstand = Infinity;
        stufen.forEach(function (s, i) {
          var r = s.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
          var a = Math.abs((r.top + r.bottom) / 2 - mitte); if (a < abstand) { abstand = a; best = i; }
        });
        if (best >= 0) setze(best);
      }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
      stufen.forEach(function (s) { io.observe(s); });
      beiEnde(function () { io.disconnect(); });
    }
    if (!eingebettet) stationen.forEach(function (li, i) {
      var a = li.querySelector('a'); if (!a) return;
      a.addEventListener('click', function (e) { if (stufen[i]) { e.preventDefault(); stufen[i].scrollIntoView({ behavior: (reduziert() || e.detail === 0) ? 'auto' : 'smooth', block: 'center' }); } }, sig);
    });

    /* Vergleich der Merkmale: am Schreibtisch offen, am Telefon zum Aufklappen */
    var vergleich = $('.ez-vergleich-auf');
    if (vergleich && breit()) vergleich.open = true;

    if (!eingebettet) {
      /* Sprungmarken mit der Maus: nie tiefer, als die Szene des Ziels reicht, sonst deckt die nächste Szene das Ziel (etwa das Formular am
         Ende der Pakete) schon zu, bevor es im Bild ist. Tastatur und Stationen behalten ihren eigenen Weg */
      var szenen = $$('.dna-szene');
      var flussOben = function (szene) { var el = szene.parentNode, y = el.getBoundingClientRect().top + (w.scrollY || 0); for (var i = 0; i < szenen.length && szenen[i] !== szene; i++) y += szenen[i].offsetHeight; return y; };
      rahmen.addEventListener('click', function (e) {
        if (e.detail === 0 || e.defaultPrevented) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null; if (!a || a.closest('.ez-schritte')) return;
        var id = a.getAttribute('href').slice(1), ziel = id ? d.getElementById(id) : null; if (!ziel) return;
        var szene = ziel.closest('.dna-szene'); if (!szene || szenen.indexOf(szene) < 0) return;
        var sOben = flussOben(szene), oben = sOben + (ziel.getBoundingClientRect().top - szene.getBoundingClientRect().top) - 16;
        var y = Math.max(0, Math.min(oben, sOben + szene.offsetHeight - w.innerHeight));
        e.preventDefault();
        try { history.pushState(null, '', '#' + id); } catch (x) { /* ohne Adresse weiter */ }
        w.scrollTo({ top: y, behavior: reduziert() ? 'auto' : 'smooth' });
      }, sig);
    }

    /* Fokus unter dem Vorhang: liegt ein bedienbares Element fokussiert und verdeckt, in die Mitte holen (WCAG 2.4.11); Sprungziele mit
       tabindex -1 (ganze Abschnitte, die portal.js nach dem Sprung fokussiert) bleiben, wo der Sprung sie hingesetzt hat */
    d.addEventListener('focusin', function (e) {
      var el = e.target; if (!el || !el.getBoundingClientRect || !rahmen.contains(el) || !el.matches('a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')) return;
      var r = el.getBoundingClientRect(); if (!r.width) return;
      var x = Math.min(Math.max(r.left + r.width / 2, 0), w.innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), d.documentElement.clientHeight - 1);
      var oben = d.elementFromPoint(x, y);
      if (oben && !el.contains(oben) && !oben.contains(el)) el.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, sig);

    /* Anfrage: Paket aus den Karten vorwählen, Pflichtfelder je Feld prüfen, als JSON an /api/auftrag/frage
       (ohne JavaScript prüft der Browser und schickt das Formular selbst) */
    var form = $('#anfrage-form');
    if (form) {
      form.setAttribute('novalidate', '');
      var radios = Array.prototype.slice.call(form.querySelectorAll('.ez-radios input'));
      var zeigeWahl = function () { radios.forEach(function (r) { r.parentNode.classList.toggle('ist-wahl', r.checked); }); };
      radios.forEach(function (r) { r.addEventListener('change', zeigeWahl, sig); });
      zeigeWahl();
      $$('[data-paket]').forEach(function (a) {
        a.addEventListener('click', function () {
          var wert = a.getAttribute('data-paket');
          radios.forEach(function (r) { r.checked = r.value === wert; });
          zeigeWahl();
        }, sig);
      });
      var vormerken = $('[data-vormerken]'), text = form.querySelector('#f-text');
      if (vormerken && text) vormerken.addEventListener('click', function () { if (!text.value.trim()) text.value = 'Ich interessiere mich für zusätzliche Anfragen aus meiner Nähe.'; }, sig);

      var fehler = form.querySelector('.ez-form__fehler'), meldung = form.querySelector('.ez-form__meldung'), knopf = form.querySelector('button[type="submit"]'), knopftext = form.querySelector('.ez-form__knopftext');
      var FEHLER_TEXT = fehler ? fehler.textContent : '', KNOPF_TEXT = knopftext ? knopftext.textContent : '', laeuft = false;
      var TEXTE = { 'f-name': 'Bitte Ihren Namen angeben.', 'f-mail': 'Bitte eine gültige E-Mail-Adresse angeben, z. B. name@betrieb.de.' };
      var pflicht = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));
      function feldFehler(f, t) {
        var ziel = f.id ? form.querySelector('#' + f.id + '-fehler') : null;
        f.setAttribute('aria-invalid', t ? 'true' : 'false');
        if (ziel) { ziel.textContent = t || ''; ziel.classList.toggle('ist-da', !!t); }
      }
      function sagFehler(t, fokus) { if (!fehler) return; fehler.textContent = t || FEHLER_TEXT; fehler.hidden = false; if (fokus) fehler.focus(); }
      pflicht.forEach(function (f) { f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true' && f.checkValidity()) feldFehler(f, ''); }, sig); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (laeuft) return;
        var erste = null;
        pflicht.forEach(function (f) {
          var ok = f.checkValidity();
          feldFehler(f, ok ? '' : (TEXTE[f.id] || 'Bitte prüfen Sie diese Angabe.'));
          if (!ok && !erste) erste = f;
        });
        if (erste) { sagFehler(FEHLER_TEXT, false); erste.focus(); return; }
        if (fehler) fehler.hidden = true;
        var daten = {};
        new FormData(form).forEach(function (v, k) { daten[k] = String(v); });
        laeuft = true;
        if (knopf) knopf.setAttribute('aria-busy', 'true');
        if (knopftext) knopftext.textContent = 'Wird gesendet …';
        var optionen = { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(daten), credentials: 'same-origin' };
        if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) optionen.signal = AbortSignal.timeout(15000);
        fetch(form.getAttribute('action'), optionen)
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: r.ok, j: null }; }); })
          .then(function (x) {
            if (x.ok) {
              form.reset(); zeigeWahl();
              form.classList.add('ist-gesendet');
              if (meldung) { meldung.textContent = 'Danke, Ihre Frage ist da. Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.'; meldung.focus(); }
            } else {
              var felder = x.j && x.j.felder;
              sagFehler(felder ? Object.keys(felder).map(function (n) { return felder[n]; }).join(' ') : (x.j && x.j.fehler) || 'Ihre Frage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal.', true);
            }
          })
          .catch(function () { sagFehler('Keine Verbindung. Bitte versuchen Sie es gleich noch einmal.', true); })
          .then(function () { laeuft = false; if (knopf) knopf.removeAttribute('aria-busy'); if (knopftext) knopftext.textContent = KNOPF_TEXT; });
      }, sig);
    }
  }

  w.FbSeite = { auf: auf };
  /* Auf der eigenen Seite (und in der Vorschau) von selbst starten; auf der Startseite (body[data-seite="portal"]) startet portal.js */
  if (!d.body || d.body.getAttribute('data-seite') !== 'portal') {
    var start = function () { auf(d.querySelector('.fb'), {}); };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  }
})();

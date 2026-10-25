/* eeziframes · Seite für Fensterbauer (/fuer-fensterbauer/), auch eingebettet auf der Startseite (Ansicht „Fensterbauer“, portal.js).
   Entstanden aus den Skripten der Vorschau vom 24.10.2026 (teil-01 bis teil-11). Alles läuft in einem Rahmen (.fb) und startet über
   FbSeite.auf(rahmen, { eingebettet }): auf der eigenen Seite von selbst (body.fb-seite), auf der Startseite durch portal.js nach jedem
   Aufbau. Ein neuer Start beendet den vorigen (Ereignisse, Schleifen), damit beim Neuaufbau der Startseite nichts doppelt läuft.
   Das Anfrageformular schickt an POST /api/partner/frage (Felder wie functions/api/partner.js frageAnnehmen: name, firma, mail, tel,
   paket, text, Honigtopf fax). Ohne JavaScript geht es als normales Formular ab und endet auf der Dankesseite des Servers. */
(function () {
  'use strict';
  var lauf = null; // { ctl, rahmen } des laufenden Starts

  function auf(rahmen, opt) {
    if (!rahmen || rahmen.dataset.fbAn === '1') return;
    if (lauf) lauf.ctl.abort();
    var ctl = typeof AbortController === 'function' ? new AbortController() : { signal: undefined, abort: function () { this.aus = true; } };
    lauf = { ctl: ctl, rahmen: rahmen };
    rahmen.dataset.fbAn = '1';
    opt = opt || {};
    if (opt.eingebettet) rahmen.classList.add('eingebettet');
    var X = {
      rahmen: rahmen,
      eingebettet: !!opt.eingebettet,
      sig: ctl.signal ? { signal: ctl.signal } : undefined,
      sigPassiv: ctl.signal ? { signal: ctl.signal, passive: true } : { passive: true },
      lebt: function () { return rahmen.isConnected && !(ctl.signal ? ctl.signal.aborted : ctl.aus); },
      $: function (s) { return rahmen.querySelector(s); },
      $$: function (s) { return rahmen.querySelectorAll(s); },
      ruhig: mq('(prefers-reduced-motion: reduce)')
    };
    TEILE.forEach(function (t) { try { t(X); } catch (e) { if (window.console) console.error('Fensterbauer-Seite:', e); } });
  }
  function mq(q) { try { return matchMedia(q).matches; } catch (e) { return false; } }
  /* Scroll und Größe: ein Takt je Bild, nur solange der Rahmen lebt */
  function beimRollen(X, fn, mitGroesse) {
    var tick = false;
    var los = function () { if (!X.lebt()) return; if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; if (X.lebt()) fn(); }); } };
    addEventListener('scroll', los, X.sigPassiv);
    if (mitGroesse) addEventListener('resize', los, X.sig);
  }
  function einmalSichtbar(X, el, cls, rand, ziel) {
    if (!el || X.ruhig || !('IntersectionObserver' in window)) return;
    el.classList.add(cls);
    new IntersectionObserver(function (e, o) { if (!e[0].isIntersecting) return; el.classList.remove(cls); o.disconnect(); }, { rootMargin: rand }).observe(ziel || el);
  }

  var TEILE = [
    /* ---- Bühne: Punkte-Welle, Tiefe mit dem Zeiger, Magnet-Knopf, sanfte Parallaxe ---- */
    function (X) {
      var buehne = X.rahmen.querySelector('#hero'); if (!buehne) return;
      var motiv = buehne.querySelector('.motiv');
      document.addEventListener('touchstart', function () {}, X.sigPassiv); // :active auf iOS
      var feinZeiger = mq('(hover: hover) and (pointer: fine)');
      var info = buehne.querySelector('.beweis');
      var cv = buehne.querySelector('.punkte'), ctx = cv && cv.getContext ? cv.getContext('2d') : null;
      if (!ctx) return;
      var W = 0, H = 0, sichtbar = true, laeuft = false;
      function groesse() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = cv.clientWidth; H = cv.clientHeight;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function welle(t) {
        ctx.clearRect(0, 0, W, H);
        var breit = W >= 1000;
        var COLS = breit ? 72 : 40, ROWS = breit ? 26 : 20;
        var cx = W * (breit ? 0.34 : 0.5), cy = H * (breit ? 0.6 : 0.5);
        var spanX = W * (breit ? 1.1 : 1.5), spanY = H * (breit ? 0.42 : 0.3), amp = breit ? 46 : 28;
        for (var r = 0; r < ROWS; r++) {
          var z = r / (ROWS - 1), tiefe = 0.3 + 0.7 * z;
          for (var c = 0; c < COLS; c++) {
            var x = c / (COLS - 1) - 0.5;
            var y = Math.sin(x * 7 + t * 0.0007 + z * 3) * Math.cos(z * 4.5 - t * 0.0005) * amp;
            var sx = cx + x * spanX * tiefe;
            var sy = cy + (z * z - 0.25) * spanY - y * tiefe;
            var s = 0.7 + 1.3 * z;
            var a = 0.04 + 0.26 * z * (0.6 + 0.4 * Math.sin(x * 9 + t * 0.001));
            ctx.fillStyle = 'rgba(243,242,238,' + Math.min(1, a).toFixed(3) + ')';
            ctx.fillRect(sx, sy, s, s);
          }
        }
      }
      function schleife(t) {
        if (!sichtbar || document.hidden || !X.lebt()) { laeuft = false; return; }
        welle(t);
        requestAnimationFrame(schleife);
      }
      function starten() { if (!laeuft && !X.ruhig && X.lebt()) { laeuft = true; requestAnimationFrame(schleife); } }
      groesse();
      welle(0);
      if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { if (!X.lebt()) { ro.disconnect(); return; } groesse(); welle(performance.now()); }); ro.observe(cv); }
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; if (sichtbar) starten(); }).observe(buehne);
      document.addEventListener('visibilitychange', starten, X.sig);
      starten();
      if (X.ruhig) return;

      if (feinZeiger) {
        var ebenen = [
          { el: motiv.querySelector('.motiv-ebene'), k: -14 },
          { el: buehne.querySelector('.riesenwort'), k: 10 },
          { el: info, k: 6 },
          { el: cv, k: 6 }
        ].filter(function (l) { return l.el; });
        var ziel = { x: 0, y: 0 }, ist = { x: 0, y: 0 }, federLaeuft = false;
        var feder = function () {
          if (!X.lebt()) { federLaeuft = false; return; }
          ist.x += (ziel.x - ist.x) * 0.07;
          ist.y += (ziel.y - ist.y) * 0.07;
          ebenen.forEach(function (l) { l.el.style.translate = (ist.x * l.k).toFixed(2) + 'px ' + (ist.y * l.k * 0.6).toFixed(2) + 'px'; });
          if (Math.abs(ziel.x - ist.x) + Math.abs(ziel.y - ist.y) > 0.0005) requestAnimationFrame(feder); else federLaeuft = false;
        };
        var federLos = function () { if (!federLaeuft) { federLaeuft = true; requestAnimationFrame(feder); } };
        buehne.addEventListener('pointermove', function (e) {
          var r = buehne.getBoundingClientRect();
          ziel.x = (e.clientX - r.left) / r.width - 0.5;
          ziel.y = (e.clientY - r.top) / r.height - 0.5;
          federLos();
        });
        buehne.addEventListener('pointerleave', function () { ziel.x = 0; ziel.y = 0; federLos(); });

        X.$$('[data-magnet]').forEach(function (k) {
          var mz = { x: 0, y: 0 }, mi = { x: 0, y: 0 }, aktivM = false;
          k.addEventListener('pointermove', function (e) {
            var r = k.getBoundingClientRect();
            mz.x = (e.clientX - r.left - r.width / 2) * 0.18;
            mz.y = (e.clientY - r.top - r.height / 2) * 0.3;
            if (!aktivM) { aktivM = true; requestAnimationFrame(magnet); }
          });
          k.addEventListener('pointerleave', function () { mz.x = 0; mz.y = 0; });
          function magnet() {
            mi.x += (mz.x - mi.x) * 0.15; mi.y += (mz.y - mi.y) * 0.15;
            k.style.translate = mi.x.toFixed(2) + 'px ' + mi.y.toFixed(2) + 'px';
            if (X.lebt() && (Math.abs(mi.x - mz.x) + Math.abs(mi.y - mz.y) > 0.05 || mz.x || mz.y)) requestAnimationFrame(magnet);
            else { aktivM = false; k.style.translate = ''; }
          }
        });
      }
      /* Scroll: nur sanfte Parallaxe der Szene (gemessen ab der Oberkante der Bühne, auch eingebettet unter der Kopfzeile) */
      beimRollen(X, function () {
        var weg = Math.max(0, -buehne.getBoundingClientRect().top);
        motiv.style.translate = '0 ' + (Math.min(weg, buehne.offsetHeight) * 0.18).toFixed(1) + 'px';
      });
    },

    /* ---- Laufbänder: Inhalte verdoppeln, gegenläufig bewegen, bei Hover/Fokus/Knopf weich anhalten ---- */
    function (X) {
      var band = X.$('.band'); if (!band) return;
      var baender = band.querySelectorAll('.laufband');
      baender.forEach(function (lb) {
        var spur = lb.querySelector('.spur');
        Array.prototype.slice.call(spur.children).forEach(function (li) {
          var k = li.cloneNode(true);
          k.setAttribute('aria-hidden', 'true');
          k.setAttribute('data-klon', '');
          k.querySelectorAll('a, button').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
          spur.appendChild(k);
        });
        if (!X.ruhig) lb.classList.add('bereit');
      });
      var knopf = band.querySelector('.band-pause');
      if (!X.ruhig && knopf) {
        knopf.hidden = false;
        knopf.addEventListener('click', function () {
          var an = !band.classList.contains('pausiert');
          band.classList.toggle('pausiert', an);
          knopf.setAttribute('aria-pressed', String(an));
          knopf.setAttribute('aria-label', an ? 'Laufbänder fortsetzen' : 'Laufbänder anhalten');
        });
      }
      var sichtbar = true;
      if ('IntersectionObserver' in window && !X.ruhig) {
        einmalSichtbar(X, band, 'wartet', '0px 0px -15% 0px');
        new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; los(); }).observe(band);
      }
      if (X.ruhig || !document.timeline) return;
      band.classList.add('weich');
      var laeufe = [];
      baender.forEach(function (lb) {
        var spur = lb.querySelector('.spur'), a = spur.getAnimations ? spur.getAnimations()[0] : null;
        if (!a) return;
        var l = { a: a, rate: 1, halt: false };
        laeufe.push(l);
        lb.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { l.halt = true; los(); } });
        lb.addEventListener('pointerleave', function () { l.halt = false; los(); });
        lb.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { l.halt = true; los(); } });
        lb.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') setTimeout(function () { l.halt = false; los(); }, 1200); });
        lb.addEventListener('focusin', function () { l.halt = true; los(); });
        lb.addEventListener('focusout', function () { l.halt = false; los(); });
      });
      if (knopf) knopf.addEventListener('click', function () { los(); });
      document.addEventListener('visibilitychange', function () { los(); }, X.sig);
      /* Die Rate läuft weich auf ihr Ziel; ist es erreicht, ruht die Schleife bis zum nächsten Anlass */
      var laeuft = false;
      function los() { if (laeufe && !laeuft && X.lebt()) { laeuft = true; requestAnimationFrame(tick); } }
      function tick() {
        if (!X.lebt()) { laeuft = false; return; }
        var pause = band.classList.contains('pausiert') || !sichtbar || document.hidden, offen = false;
        laeufe.forEach(function (l) {
          var ziel = (pause || l.halt) ? 0 : 1;
          l.rate += (ziel - l.rate) * 0.08;
          if (Math.abs(ziel - l.rate) < 0.002) l.rate = ziel; else offen = true;
          if (l.a.playbackRate !== l.rate) l.a.playbackRate = l.rate;
        });
        if (offen) requestAnimationFrame(tick); else laeuft = false;
      }
      los();
    },

    /* ---- Geräte (ausgeblendet, bis echte Bildschirme da sind): Deckel öffnet sich, Telefon fährt dazu ---- */
    function (X) {
      var sek = X.$('.geraete'); if (!sek || sek.hidden || X.ruhig) return;
      var szene = sek.querySelector('.geraete-szene');
      einmalSichtbar(X, sek, 'wartet', '0px 0px -20% 0px');
      function e(x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3); }
      function rollen() {
        var r = szene.getBoundingClientRect(), vh = innerHeight;
        var p = (vh - r.top) / (vh - (vh * 0.55 - r.height / 2));
        szene.style.setProperty('--oeffnen', e(p * 1.15).toFixed(3));
        szene.style.setProperty('--telefon', e(p * 1.15 - 0.25).toFixed(3));
      }
      beimRollen(X, rollen, true);
      rollen();
    },

    /* ---- Pakete: Auswahl steuert die große Vorschau ---- */
    function (X) {
      var pk = X.$('.pk'); if (!pk) return;
      var namen = ['EEZI Essential', 'EEZI Essential Plus', 'EEZI Signature'];
      var texte = ['eeziframes-Design mit Ihrem Namen, unten der Hinweis „Powered by EEZIframes“.',
                   'Ihr Logo, Ihre Firmenfarbe, bis zu 6 Fotos Ihres Betriebs und eine eigene Startseite.',
                   'Wie Essential Plus, ohne eeziframes-Hinweis. Dazu ein Dashboard mit Einladungslinks und Fortschritt.'];
      var vtext = pk.querySelector('[data-vorschau-text]');
      var karten = pk.querySelectorAll('.pk-karte'), tabs = pk.querySelectorAll('.pk-tab');
      var mocks = pk.querySelectorAll('.mock'), name = pk.querySelector('[data-paket-name]');
      var tablist = pk.querySelector('.pk-tabs'), aktiv = 0, adresse = pk.querySelector('[data-adresse]');
      function waehle(i, fokus) {
        aktiv = i;
        karten.forEach(function (k, n) {
          k.classList.toggle('ist-aktiv', n === i);
          k.querySelector('.pk-wahl').setAttribute('aria-pressed', String(n === i));
        });
        tabs.forEach(function (t, n) { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
        if (fokus) tabs[i].focus();
        if (tablist) tablist.style.setProperty('--i', i);
        mocks.forEach(function (m, n) { m.classList.toggle('ist-aktiv', n === i); });
        pk.querySelectorAll('.pins').forEach(function (p) { p.classList.toggle('ist-aktiv', +p.dataset.paket === i); });
        if (adresse && mocks[i]) adresse.textContent = mocks[i].getAttribute('data-adresse');
        if (name) name.textContent = namen[i];
        if (vtext) vtext.textContent = texte[i];
      }
      karten.forEach(function (k) {
        k.addEventListener('click', function (e) { if (e.target.closest('.pk-cta')) return; waehle(+k.dataset.paket); });
      });
      tabs.forEach(function (t) {
        t.addEventListener('click', function () { waehle(+t.dataset.paket); });
        t.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') { e.preventDefault(); waehle((aktiv + 1) % 3, true); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); waehle((aktiv + 2) % 3, true); }
        });
      });
      waehle(1);
      einmalSichtbar(X, pk, 'wartet', '0px 0px -15% 0px');
    },

    /* ---- So funktioniert es: Linie wächst mit dem Scrollen, erreichte Schritte werden markiert ---- */
    function (X) {
      var sek = X.$('.ablauf'); if (!sek) return;
      var liste = sek.querySelector('.schritte'), schritte = sek.querySelectorAll('.schritt'), blatt = X.$('.blatt');
      if (X.ruhig) { schritte.forEach(function (s) { s.classList.add('erreicht'); }); return; }
      var breit = function () { return innerWidth >= 1024; };
      einmalSichtbar(X, sek, 'wartet', '0px 0px -20% 0px');
      einmalSichtbar(X, blatt, 'wartet', '0px 0px -25% 0px');
      function rollen() {
        var r = liste.getBoundingClientRect(), vh = innerHeight, p;
        if (breit()) p = (vh * 0.85 - r.top) / (vh * 0.45);
        else p = (vh * 0.7 - r.top) / r.height;
        p = Math.min(1, Math.max(0, p));
        liste.style.setProperty('--fortschritt', p.toFixed(3));
        var n = schritte.length;
        schritte.forEach(function (s, i) { if (p >= (breit() ? i / (n - 1) : i / n) - 0.001) s.classList.add('erreicht'); });
      }
      beimRollen(X, rollen, true);
      rollen();
    },

    /* ---- Anfrage: Paket aus den Karten vorwählen, prüfen, an /api/partner/frage senden ---- */
    function (X) {
      var form = X.$('#anfrage-form'); if (!form) return;
      var werte = ['essential', 'plus', 'signature'];
      X.$$('[data-paket-wahl]').forEach(function (a) {
        a.addEventListener('click', function () {
          var r = form.querySelector('input[name="paket"][value="' + werte[+a.dataset.paketWahl] + '"]');
          if (r) r.checked = true;
        });
      });
      var fehler = form.querySelector('.f-fehler'), danke = form.querySelector('.f-danke'), knopf = form.querySelector('button[type="submit"]');
      var FEHLER_TEXT = fehler ? fehler.textContent : '';
      var feld = function (n) { return form.querySelector('[name="' + n + '"]'); };
      function pruefen() {
        var regeln = { name: function (v) { return v.length >= 2; }, mail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } };
        var erste = null;
        Object.keys(regeln).forEach(function (n) {
          var f = feld(n); if (!f) return;
          var ok = regeln[n](f.value.trim());
          f.setAttribute('aria-invalid', ok ? 'false' : 'true');
          if (!ok && !erste) erste = f;
        });
        return erste;
      }
      function meldung(text) { if (!fehler) return; fehler.textContent = text || FEHLER_TEXT; fehler.hidden = false; }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var erste = pruefen();
        if (erste) { meldung(FEHLER_TEXT); erste.focus(); return; }
        if (fehler) fehler.hidden = true;
        var d = {};
        new FormData(form).forEach(function (v, k) { d[k] = String(v); });
        if (!String(d.text || '').trim()) d.text = '';
        knopf.disabled = true; form.setAttribute('aria-busy', 'true');
        fetch(form.getAttribute('action'), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(d), credentials: 'same-origin' })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { r: r, j: j }; }); })
          .then(function (x) {
            if (x.r.ok && x.j && x.j.ok) {
              form.querySelectorAll('.f-pakete, .f-reihe, .feld, .f-fuss, .f-fehler').forEach(function (el) { el.hidden = true; });
              danke.hidden = false;
              danke.setAttribute('tabindex', '-1');
              try { danke.focus({ preventScroll: true }); } catch (y) { danke.focus(); }
              return;
            }
            var felder = (x.j && x.j.felder) || null;
            if (felder) {
              var erst = null;
              Object.keys(felder).forEach(function (n) { var f = feld(n); if (f) { f.setAttribute('aria-invalid', 'true'); if (!erst) erst = f; } });
              meldung(Object.keys(felder).map(function (n) { return felder[n]; }).join(' '));
              if (erst) erst.focus();
            } else meldung((x.j && x.j.fehler) || 'Ihre Frage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal.');
          })
          .catch(function () { meldung('Keine Verbindung. Bitte versuchen Sie es gleich noch einmal.'); })
          .then(function () { knopf.disabled = false; form.removeAttribute('aria-busy'); });
      });
      form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });
    },

    /* ---- Einladung unten: erscheint nach „Ihre Adresse“, wechselt ab den Paketen zu „Paket anfragen“, weicht Formular und Fuß ---- */
    function (X) {
      var bar = X.$('.dock'); if (!bar) return;
      var weg = X.$('.weg'), hero = X.$('#hero'), probierKarte = X.$('.probieren');
      var pakete = X.$('#pakete'), anfrage = X.$('#bestellen'), schluss = X.$('#abschluss');
      /* eingebettet ist die Fußzeile der Seite ausgeblendet; dann gilt die der Startseite */
      var fussVon = function () { var f = X.$('.fuss'); return f && f.offsetParent ? f : document.querySelector('footer.foot'); };
      var zu = false; try { zu = sessionStorage.getItem('einladung-zu') === '1'; } catch (e) { /* ohne Speicher */ }
      var gesehen = false, erstes = true;
      function setzen(ph) {
        if (bar.dataset.phase === ph) return;
        bar.dataset.phase = ph;
        bar.setAttribute('aria-hidden', String(ph === 'aus'));
        bar.querySelectorAll('.dock-phase').forEach(function (p) {
          var an = p.classList.contains('dock-' + ph);
          p.setAttribute('aria-hidden', String(!an));
          p.querySelectorAll('a, button').forEach(function (k) { k.tabIndex = an ? 0 : -1; });
        });
        if (ph === 'testen' && erstes) { erstes = false; bar.classList.add('lockt'); setTimeout(function () { bar.classList.remove('lockt'); }, 3600); }
      }
      function pruefen() {
        var vh = innerHeight;
        if (weg && weg.getBoundingClientRect().bottom < vh * 0.55) gesehen = true;
        var heroDa = hero ? hero.getBoundingClientRect().bottom > vh * 0.3 : false;
        var imBlick = function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.top < vh * 0.85 && r.bottom > 0; };
        var ende = imBlick(anfrage) || imBlick(schluss);
        var fuss = fussVon(), fussDa = fuss ? fuss.getBoundingClientRect().top < vh : false;
        var beiPaketen = pakete ? pakete.getBoundingClientRect().top < vh * 0.5 : false;
        var pr = probierKarte ? probierKarte.getBoundingClientRect() : null;
        var karteDa = pr && pr.top < vh && pr.bottom > 0;
        var ph = 'aus';
        if (!heroDa && !ende && !fussDa) {
          if (beiPaketen) ph = 'anfragen';
          else if (gesehen && !zu && !karteDa) ph = 'testen';
        }
        setzen(ph);
      }
      var zuKnopf = bar.querySelector('.dock-zu');
      if (zuKnopf) zuKnopf.addEventListener('click', function () { zu = true; try { sessionStorage.setItem('einladung-zu', '1'); } catch (e) { /* ohne Speicher */ } pruefen(); });
      beimRollen(X, pruefen, true);
      pruefen();
    },

    /* ---- Ihre Adresse: „Fenster planen“, Linie, Konfigurator (einmal) ---- */
    function (X) {
      var sek = X.$('#die-idee'); if (!sek) return;
      einmalSichtbar(X, sek, 'wartet', '0px 0px -30% 0px', sek.querySelector('.weg'));
    },

    /* ---- Nähe: Empfehlung, Knopf, Anfrage beim Betrieb (einmal); „Interesse vormerken“ füllt das Formular vor ---- */
    function (X) {
      var sek = X.$('#naehe'); if (!sek) return;
      einmalSichtbar(X, sek, 'wartet', '0px 0px -30% 0px', sek.querySelector('.nah-bild'));
      var link = sek.querySelector('[data-interesse]'), feld = X.$('#f-text');
      if (link && feld) link.addEventListener('click', function () {
        if (!feld.value.trim()) feld.value = 'Ich interessiere mich für zusätzliche Anfragen aus meiner Nähe.';
      });
    },

    /* ---- Einheitliches Einblenden der ruhigen Abschnitte (600 ms, 24 px, 0,98 → 1) ---- */
    function (X) {
      if (X.ruhig || !('IntersectionObserver' in window)) return;
      var ziele = X.$$('.hint-kopf, .hint-karte, .schutz, .schluss-karte, .alternativen, .nah-text, .livegang-kopf, .lg-liste, .faq-kopf, .faq-liste, .anfrage-info, .formular, .wissen-innen');
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -12% 0px' });
      ziele.forEach(function (el) { el.classList.add('ein-blende'); io.observe(el); });
    },

    /* ---- 03: ein Punkt ist offen, das Aufmaßblatt markiert die Stelle, die Szene schwebt leicht ---- */
    function (X) {
      var teile = X.$$('.teil'), szene = X.$('.szene');
      if (!teile.length || !szene) return;
      var hinweis = szene.querySelector('[data-blatt-hinweis]');
      var texte = ['Seite 1, Spalte Öffnung', 'Seite 1, Spalte Element', 'Seite 1, Fotos ausgewertet', 'Seite 1, Fenster und Flügel', 'je Position auf den Folgeseiten', 'je Position auf den Folgeseiten', 'am Ende jeder Position'];
      function markieren() {
        var offen = X.$('.teil[open]'), k = offen ? offen.dataset.teil : null;
        szene.querySelectorAll('[data-teil]').forEach(function (el) { el.classList.toggle('hell', el.dataset.teil === k); });
        if (hinweis) hinweis.textContent = k === null ? '' : texte[+k];
      }
      teile.forEach(function (t) {
        t.addEventListener('toggle', function () {
          if (t.open) teile.forEach(function (o) { if (o !== t && o.open) o.open = false; });
          markieren();
        });
      });
      markieren();
      if (X.ruhig) return;
      function schweben() {
        var r = szene.getBoundingClientRect(), vh = innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        szene.style.setProperty('--sp', p.toFixed(3));
      }
      beimRollen(X, schweben);
      schweben();
    }
  ];

  window.FbSeite = { auf: auf };
  /* eigene Seite: von selbst starten */
  function selbst() { if (document.body && document.body.classList.contains('fb-seite')) auf(document.querySelector('.fb'), {}); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', selbst, { once: true }); else selbst();
})();

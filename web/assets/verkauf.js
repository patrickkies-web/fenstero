/* eeziframes · Verkaufsseite der Konfigurator-Pakete (/fuer-fensterbauer/): Anfrageformular ohne Neuladen, Paket aus der Karte übernehmen;
   unten die Bewegung der Landingpage (Reveal, Kennzahlen mit Ring, Scroll-Bühne, Zeichen in Schleife, Zeitleiste, Meldungskarten auf
   dem Startbild) mit den Hilfen aus gemeinsam.js. Alles hängt an window.Verkauf.auf(wurzel, o). Die statische Seite ruft es am Ende dieser Datei mit document auf; die
   Startseite (portal.js, Ansicht „Fensterbauer“) bettet denselben Inhalt ein und ruft auf(behälter) nach jedem Aufbau, darum beziehen
   sich alle Abfragen auf die Wurzel, Zuhörer werden je Element nur einmal gebunden und Beobachter je Aufruf neu angelegt. o.still = true
   beim Neuaufbau desselben Bildschirms: Was im Bild steht, erscheint und läuft nicht noch einmal; was unterhalb wartet, bewegt sich beim
   Scrollen wie beim ersten Mal.
   Ohne JavaScript schickt das Formular ganz normal ab (POST /api/partner/frage als Formular; der Server antwortet mit einer eigenen
   Seite). Mit JavaScript dieselbe Route als JSON: Fehler stehen am Feld (aria-invalid, Text darunter), der Dank ersetzt das Formular.
   Felder und Regeln wie functions/api/partner.js (frageAnnehmen): Name ab 2 Zeichen, gültige E-Mail, Frage ab 3 Zeichen; „fax“ ist
   der Honigtopf. */
(function () {
  'use strict';
  var MAIL = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;
  function ruhig() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  var kannIO = 'IntersectionObserver' in window;

  /* ---------- Anfrageformular ---------- */
  function formular(wurzel) {
    var form = wurzel.querySelector('form[data-vk-frage]');
    if (!form || form.__vkAn) return;
    form.__vkAn = true;
    form.setAttribute('novalidate', '');
    var meldung = form.querySelector('.vk-meldung'), knopf = form.querySelector('button[type="submit"]');

    /* „… anfragen“ in einer Paketkarte: Paket im Formular vorwählen (ein Zuhörer je Wurzel, das Formular wird darin gesucht, weil die
       Einbettung es bei jedem Aufbau neu erzeugt) */
    if (!wurzel.__vkPaket) {
      wurzel.__vkPaket = true;
      wurzel.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[data-paket]') : null;
        if (!a) return;
        var f = wurzel.querySelector('form[data-vk-frage]'), s = f ? f.querySelector('select[name="paket"]') : null;
        if (s) s.value = a.getAttribute('data-paket');
      });
    }

    function aufraeumen() {
      Array.prototype.forEach.call(form.querySelectorAll('.vk-fehler'), function (x) { x.parentNode.removeChild(x); });
      Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (x) { x.removeAttribute('aria-invalid'); x.removeAttribute('aria-describedby'); });
      meldung.textContent = '';
    }
    function fehlerZeigen(felder) {
      var erstes = null;
      Object.keys(felder).forEach(function (name) {
        var feld = form.querySelector('[name="' + name + '"]');
        if (!feld) return;
        var p = document.createElement('p');
        p.className = 'vk-fehler'; p.id = 'vk-fehler-' + name; p.textContent = felder[name];
        feld.setAttribute('aria-invalid', 'true'); feld.setAttribute('aria-describedby', p.id);
        feld.parentNode.appendChild(p);
        if (!erstes) erstes = feld;
      });
      if (erstes) erstes.focus();
      else meldung.textContent = 'Bitte prüfen Sie Ihre Angaben.';
    }
    function pruefen(d) {
      var f = {};
      if (String(d.name || '').trim().length < 2) f.name = 'Bitte Ihren Namen eingeben.';
      if (!MAIL.test(String(d.mail || '').trim())) f.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
      if (String(d.text || '').trim().length < 3) f.text = 'Bitte schreiben Sie kurz Ihre Frage.';
      return f;
    }
    function danke() {
      form.innerHTML = '<p class="vk-danke" role="status" tabindex="-1"><b>Danke, Ihre Frage ist da.</b> Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.</p>';
      var p = form.querySelector('.vk-danke');
      if (p) p.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      aufraeumen();
      var d = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) d[el.name] = el.value; });
      var f = pruefen(d);
      if (Object.keys(f).length) return fehlerZeigen(f);
      knopf.disabled = true; meldung.textContent = 'Wird gesendet …';
      fetch(form.getAttribute('action'), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(d), credentials: 'same-origin' })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j || {} }; }); })
        .then(function (x) {
          knopf.disabled = false;
          if (x.status === 200 && x.j.ok) return danke();
          meldung.textContent = '';
          if (x.j.felder) return fehlerZeigen(x.j.felder);
          meldung.textContent = x.j.fehler || 'Ihre Frage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal oder schreiben Sie uns eine E-Mail (Adresse im Impressum).';
        })
        .catch(function () {
          knopf.disabled = false;
          meldung.textContent = 'Keine Verbindung. Bitte versuchen Sie es gleich noch einmal; Ihre Angaben bleiben stehen.';
        });
    });
  }

  /* ---------- Bewegung der Landingpage (23.10.2026) ----------
     Hilfen aus gemeinsam.js (Reveal, Scroll, Lottie, Feier); fehlt eine, bleibt die Seite so, wie sie ohne JavaScript ist: alles
     sichtbar, Zahlen stehen, Standbilder, Zeitleiste voll. Bei „weniger Bewegung“ läuft nichts.
     - Reveal: Karten und Blöcke erscheinen, wenn sie ins Bild kommen (Katalog 1), je Gruppe gestaffelt (--rv)
     - Kennzahlen: laufen einmal von 0 hoch, der Ring um die Zahl füllt sich im selben Takt, dann Einrasten (Katalog 5 und 6)
     - Zeichen: alle mit data-lottie laufen als Schleife (data-loop="1"); gemeinsam.js spielt nur, was im Bild ist, und pausiert draußen
     - Bühne „So funktioniert es“: Scroll.binden über den Block liefert --sp; der aktive Schritt ist die Karte, deren Mitte der
       Bildschirmmitte am nächsten liegt (data-schritt auf .vk-buehne, verkauf.css blendet die Bildschirme über); verlassene
       Bildschirme fallen aus dem Fluss, darum laufen nur die Zeichen des gezeigten
     - Zeitleiste des Ablaufs: die Linie füllt sich scrollgebunden (Katalog 9), erreichte Schritte werden grün und ihr Symbol gezogen
     - „konfigurator“ und „farbwechsel“ (Gruppe B): spielen erst, wenn der Behälter data-lottie trägt (bis die Datei da ist, steht er
       mit data-lottie-bald, damit kein Aufruf ins Leere geht und die Prüfsuite keinen 404 meldet)
     Die Beobachter des vorigen Aufrufs werden gelöst, damit ein Neuaufbau kein zweites Hochlaufen startet. */
  var beobachter = [];
  function beobachten(io) { beobachter.push(io); return io; }

  /* Kennzahlen: von 0 bis zur Zahl in 1400 ms (Kurve wie countUp der Startseite), der Ring füllt sich mit (pathLength 100), dann Einrasten */
  function hochlaufen(b) {
    var zu = parseInt(b.getAttribute('data-zahl'), 10) || 0, t0 = performance.now(), dauer = 1400;
    var zahl = b.closest('.vk-zahl'), ring = zahl ? zahl.querySelector('.vk-ring-lauf') : null;
    (function schritt(t) {
      var k = Math.min(1, (t - t0) / dauer), e = 1 - Math.pow(1 - k, 3);
      b.textContent = String(Math.round(zu * e));
      if (ring) ring.style.strokeDashoffset = String(100 - 100 * e);
      if (k < 1) requestAnimationFrame(schritt);
      else { b.textContent = String(zu); if (ring) ring.style.strokeDashoffset = '0'; if (window.Feier) window.Feier.einrasten(b); }
    })(t0);
  }

  /* Bühne: welcher Schritt zu sehen ist. Die Bildschirme (data-schirm) blenden über (.vk-an, 220 ms); der verlassene fällt danach aus dem
     Fluss (.vk-da weg, display: none), damit seine Zeichen für gemeinsam.js nicht mehr im Bild sind und von selbst pausieren; nur die
     Zeichen des gezeigten Bildschirms laufen. */
  function schrittSetzen(buehne, n) {
    if (buehne.getAttribute('data-schritt') === String(n)) return;
    buehne.setAttribute('data-schritt', String(n));
    Array.prototype.forEach.call(buehne.querySelectorAll('[data-schirm]'), function (s) {
      if (s.getAttribute('data-schirm') === String(n)) { s.classList.add('vk-da'); void s.offsetWidth; s.classList.add('vk-an'); return; }
      s.classList.remove('vk-an');
      if (s.classList.contains('vk-da')) setTimeout(function () { if (!s.classList.contains('vk-an')) s.classList.remove('vk-da'); }, ruhig() ? 0 : 260);
    });
  }
  function schrittRechnen(buehne) {
    var mitte = window.innerHeight / 2, best = 1, abstand = Infinity;
    Array.prototype.forEach.call(buehne.querySelectorAll('.vk-schritte > li'), function (li, i) {
      var r = li.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mitte);
      if (d < abstand) { abstand = d; best = i + 1; }
    });
    schrittSetzen(buehne, best);
  }
  var buehneRuhig = null;
  function buehne(wurzel) {
    var b = wurzel.querySelector('.vk-buehne');
    if (!b) return;
    if (window.Scroll && !ruhig()) {
      window.Scroll.binden(b, function (p) { b.style.setProperty('--sp', p.toFixed(3)); schrittRechnen(b); });
    } else {
      /* ohne Scroll-Hilfe oder bei „weniger Bewegung“: der Bildschirm wechselt hart (Standbilder); ein Zuhörer für alle Aufrufe */
      buehneRuhig = b;
      if (!window.__vkBuehneHorcht) {
        window.__vkBuehneHorcht = true;
        window.addEventListener('scroll', function () { if (buehneRuhig && document.body.contains(buehneRuhig)) schrittRechnen(buehneRuhig); }, { passive: true });
      }
      schrittRechnen(b);
    }
    /* Flieger, Puls und Konfetti (CSS) laufen nur, solange die Bühne im Bild ist */
    if (kannIO) { var io = beobachten(new IntersectionObserver(function (es) { es.forEach(function (e) { b.classList.toggle('vk-im-bild', e.isIntersecting); }); }, { threshold: 0 })); io.observe(b); }
    else b.classList.add('vk-im-bild');
  }

  /* Startbild: Meldungskarten (.vk-eingang in figure.vk-hero-foto) trudeln ein, als legten gerade Kunden ihre Projekte an. Ohne
     JavaScript stehen alle drei (CSS); hier bekommt der Behälter .vk-lauf, dann je Runde (etwa 9 s): Karte für Karte von rechts (.vk-da,
     ab 300 ms, 700 ms Abstand), gut 5 s stehen, gemeinsam ausblenden (.vk-weg, 400 ms), kurze Pause, von vorn. Läuft nur, solange die
     figure im Bild ist (Beobachter je Aufruf, wie die Bühne); außerhalb stehen die Timer und die Karten sind leer. still (Neuaufbau
     desselben Bildschirms, die Einbettung baut das Startbild neu) und das Bild steht schon im Bild: Die Karten, die im alten Behälter
     standen, stehen sofort wieder (kein Überblenden), die Runde läuft mit den übrigen weiter; ohne alten Stand stehen alle drei.
     Bei „weniger Bewegung“ bleibt alles stehen (kein .vk-lauf). */
  var letzterEingang = null;
  function meldungen(wurzel, still) {
    var box = wurzel.querySelector('.vk-hero-foto .vk-eingang');
    if (!box || box.__vkAn || ruhig()) return;
    box.__vkAn = true;
    var fig = box.closest('.vk-hero-foto'), karten = Array.prototype.slice.call(box.querySelectorAll('.vk-nachricht')), timer = [];
    var vorher = letzterEingang; letzterEingang = box;
    function spaeter(f, ms) { timer.push(setTimeout(function () { if (document.body.contains(box)) f(); }, ms)); }
    function leer() { timer.forEach(clearTimeout); timer = []; karten.forEach(function (k) { k.classList.remove('vk-da', 'vk-weg'); }); }
    /* eine Runde; die ersten `ab` Karten stehen sofort, die übrigen trudeln ein */
    function runde(ab) {
      leer();
      karten.forEach(function (k, i) {
        if (i < ab) k.classList.add('vk-da');
        else spaeter(function () { k.classList.add('vk-da'); }, 300 + (i - ab) * 700);
      });
      var t = ab < karten.length ? 300 + (karten.length - 1 - ab) * 700 + 320 : 0;
      spaeter(function () { karten.forEach(function (k) { k.classList.add('vk-weg'); }); }, t + 5000);
      spaeter(function () { runde(0); }, t + 7000);
    }
    var r = fig.getBoundingClientRect(), sofort = !!still && r.top < window.innerHeight && r.bottom > 0;
    var ab = !sofort ? 0 : vorher ? vorher.querySelectorAll('.vk-da:not(.vk-weg)').length : karten.length;
    box.classList.add('vk-lauf');
    karten.forEach(function (k, i) { if (i < ab) k.classList.add('vk-da'); });
    if (kannIO) {
      var erst = true;
      var io = beobachten(new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) runde(erst ? ab : 0);
          else leer();
          erst = false;
        });
      }, { threshold: 0 }));
      io.observe(fig);
    } else runde(ab);
  }

  function bewegung(wurzel, still) {
    beobachter.forEach(function (b) { b.disconnect(); }); beobachter = [];
    /* Neuaufbau desselben Bildschirms (still): Was im Bild steht oder schon vorbei ist, bleibt, wie es ist (kein Flackern); was noch
       unter dem Bildrand wartet, bewegt sich beim Scrollen wie beim ersten Mal. Die Startseite baut sich kurz nach dem Laden einmal neu
       auf (Serverstatus), die Bewegung der noch ungesehenen Abschnitte darf dabei nicht verloren gehen. */
    var unten = function (el) { return !still || el.getBoundingClientRect().top >= window.innerHeight; };

    /* Erscheinen beim Scrollen: gemeinsam.js setzt .rev (unsichtbar) und .in (sichtbar); ohne Beobachter sofort sichtbar. Gestaffelt wird
       je Gruppe (Karten einer Reihe, Punkte einer Liste): --rv zählt in der Gruppe, Reveal selbst staffelt nur, was beim Aufbau im Bild ist */
    if (window.Reveal) {
      var liste = Array.prototype.filter.call(wurzel.querySelectorAll('.vk-zahl, .vk-punkte > li, .vk-schritte > li, .vk-inhalt > li, .vk-anfrage .vk-blatt, .vk-band > *, .vk-vorspann, .vk-paket, .vk-ablauf > li, .vk-demos > .rg-karte, .vk-bestellen > *, .vk-wissen > .rg-karte'), unten);
      window.Reveal.auf(liste);
      if (!ruhig()) Array.prototype.forEach.call(wurzel.querySelectorAll('.vk-zahlen, .vk-punkte, .vk-inhalt, .vk-pakete, .vk-ablauf, .vk-wissen, .vk-demos'), function (gruppe) {
        var k = 0;
        Array.prototype.forEach.call(gruppe.children, function (el) { if (el.classList.contains('rev') && el.getBoundingClientRect().top >= window.innerHeight) el.style.setProperty('--rv', String(Math.min(k++, 6))); });
      });
    }

    var zahlen = Array.prototype.filter.call(wurzel.querySelectorAll('.vk-zahl b[data-zahl]'), unten);
    if (zahlen.length && kannIO && !ruhig()) {
      var zio = beobachten(new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; zio.unobserve(e.target); hochlaufen(e.target); }); }, { threshold: 0.6 }));
      zahlen.forEach(function (b) { b.textContent = '0'; var z = b.closest('.vk-zahl'), r = z ? z.querySelector('.vk-ring-lauf') : null; if (r) r.style.strokeDashoffset = '100'; zio.observe(b); });
    }

    /* alle Zeichen mit data-lottie (Schrittkarten, Bühne, Paketkarten): Schleifen, die gemeinsam.js nur im Bild spielt; ein schon
       gestartetes Element überspringt Lottie selbst */
    if (window.Lottie) window.Lottie.auf(wurzel);
    buehne(wurzel);
    meldungen(wurzel, still);

    /* Zeitleiste: --sp von 0 (Liste kommt unten herein) bis 1 (Liste steht zu zwei Dritteln im Bild); Schritte, deren Symbol die gefüllte
       Linie erreicht hat, bekommen .vk-an (Symbol wird gezogen, verkauf.css). Linie: 30 px unter dem Rand der Liste bis 50 px über dem
       Ende, die Symbolmitte liegt 26 px unter dem Rand des Schritts. Ohne Scroll-Bindung oder bei „weniger Bewegung“: voll und alle
       erreicht. Eine alte Bindung löst Scroll selbst, sobald ihr Element nicht mehr im Dokument ist. */
    var ablauf = wurzel.querySelector('.vk-ablauf');
    if (ablauf) {
      var schritte = Array.prototype.slice.call(ablauf.children);
      var voll = function () { ablauf.style.setProperty('--sp', '1'); schritte.forEach(function (x) { x.classList.add('vk-an'); }); };
      if (!window.Scroll || ruhig()) voll();
      else window.Scroll.binden(ablauf, function (p) {
        ablauf.style.setProperty('--sp', p.toFixed(3));
        var r = ablauf.getBoundingClientRect(), ende = r.top + 30 + (r.height - 80) * p;
        schritte.forEach(function (x) { x.classList.toggle('vk-an', x.getBoundingClientRect().top + 26 <= ende + 1); });
      }, { von: 0.9, bis: 0.6 });
    }
  }

  window.Verkauf = {
    /* wurzel: document (statische Seite) oder der Behälter der Einbettung; o.still: Neuaufbau ohne Bewegung */
    auf: function (wurzel, o) {
      wurzel = wurzel || document;
      formular(wurzel);
      bewegung(wurzel, !!(o && o.still));
    }
  };
  /* die statische Verkaufsseite (body.vk-seite) startet sich selbst; auf der Startseite ruft portal.js auf(behälter) */
  if (document.body && document.body.classList.contains('vk-seite')) window.Verkauf.auf(document);
})();

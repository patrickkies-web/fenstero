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
     - Startbild: Tiefe beim Scrollen und der Stapel der Meldungen (startbild)
     - Leisten unter dem Startbild: schweben in Dauerschleife, Scrollen schiebt mit (leisten)
     - Pakete: am Telefon eine Reihe zum Wischen mit der Beispielseite darunter (pakete)
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

  /* Bühne: welcher Schritt zu sehen ist. Die Bildschirme (data-schirm) blenden über (.vk-an, 220 ms); der verlassene fällt danach aus dem
     Fluss (.vk-da weg, display: none), damit seine Zeichen für gemeinsam.js nicht mehr im Bild sind und von selbst pausieren; nur die
     Zeichen des gezeigten Bildschirms laufen. */
  function schrittSetzen(buehne, n) {
    if (buehne.getAttribute('data-schritt') === String(n)) return;
    buehne.setAttribute('data-schritt', String(n));
    Array.prototype.forEach.call(buehne.querySelectorAll('[data-schirm]'), function (s) {
      if (s.getAttribute('data-schirm') === String(n)) { s.classList.remove('vk-weg'); s.classList.add('vk-da'); void s.offsetWidth; s.classList.add('vk-an'); return; }
      if (s.classList.contains('vk-an')) s.classList.add('vk-weg');
      s.classList.remove('vk-an');
      if (s.classList.contains('vk-da')) setTimeout(function () { if (!s.classList.contains('vk-an')) s.classList.remove('vk-da', 'vk-weg'); }, ruhig() ? 0 : 340);
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

  /* ---------- Halt-Knopf (WCAG 2.2.2) ----------
     Was länger als 5 s von selbst läuft (Leisten samt Schub, Meldungen, Staub, Wiegen, Lottie-Zeichen, Puls, Flug), hält ein Knopf an;
     es gibt ihn im Startbild an der Meldung und an Leiste 1, beide schalten dasselbe. Die Wahl gilt für die ganze Seite (html.vk-halt,
     verkauf.css) und bleibt gespeichert (localStorage vk.halt), auch in der Einbettung. Bei „weniger Bewegung“ läuft nichts, dann
     bleibt der Knopf verborgen. */
  var HALT = 'vk.halt', halt = false, haltHoerer = [];
  try { halt = localStorage.getItem(HALT) === '1'; } catch (e) { /* ok */ }
  function haltSetzen(an) {
    halt = !!an;
    try { if (halt) localStorage.setItem(HALT, '1'); else localStorage.removeItem(HALT); } catch (e) { /* ok */ }
    document.documentElement.classList.toggle('vk-halt', halt);
    Array.prototype.forEach.call(document.querySelectorAll('.vk-halt'), function (b) { b.setAttribute('aria-pressed', String(halt)); });
    if (window.Lottie && window.Lottie.halten) window.Lottie.halten(halt);
    haltHoerer.forEach(function (f) { try { f(halt); } catch (e) { /* ok */ } });
  }
  function haltKnoepfe(wurzel) {
    if (ruhig()) return;
    document.documentElement.classList.toggle('vk-halt', halt);
    if (halt && window.Lottie && window.Lottie.halten) window.Lottie.halten(true);
    Array.prototype.forEach.call(wurzel.querySelectorAll('.vk-halt'), function (b) {
      b.hidden = false;
      b.setAttribute('aria-pressed', String(halt));
      if (b.__vkAn) return;
      b.__vkAn = true;
      b.addEventListener('click', function () { haltSetzen(!halt); });
    });
  }

  /* ---------- Startbild ----------
     Auftritt nach dem Zeitplan des Kopfs (Designrichtung 3.5; verkauf.css, .vk-auftritt): Foto 0 ms, Kicker 100, die drei Zeilen der
     Überschrift aus der Maske 180/260/340, Chips ab 500, Pille 660, erste Meldung 900, Maßlinie 1500, Licht und Staub 2400. Die
     Meldungen fallen einmal nacheinander ein (alle 4,8 s, eine Runde), danach steht vorn „Neue Anfrage“ wie ohne JavaScript; die Zeiten
     altern mit. Tiefe: --py (0 beim Laden, wächst mit dem Weg, den die Figur nach oben wandert) schiebt das Foto etwas langsamer als die
     Seite und die Meldung etwas schneller. Beim Neuaufbau (still) und bei „weniger Bewegung“ steht alles fertig. */
  var ZEITEN = ['gerade eben', 'vor 4 Min.', 'vor 11 Min.'];
  function startbild(wurzel, still) {
    var fig = wurzel.querySelector('.vk-hero-foto'), hero = wurzel.querySelector('.vk-hero');
    if (!fig || fig.__vkAn) return;
    fig.__vkAn = true;
    var bewegt = !ruhig() && !still;
    if (hero && bewegt) hero.classList.add('vk-auftritt');
    if (window.Scroll && !ruhig()) {
      var p0 = null;
      window.Scroll.binden(fig, function (p) { if (p0 === null) p0 = p; fig.style.setProperty('--py', Math.max(0, p - p0).toFixed(4)); });
    }
    bullauge(fig, bewegt);
    var stapel = fig.querySelector('.vk-stapel');
    if (!stapel || !bewegt) return;
    /* Reihenfolge des Einfallens: die hinterste zuerst, so steht am Ende die vordere des HTML vorn */
    var karten = Array.prototype.slice.call(stapel.querySelectorAll('.vk-nachricht')), folge = karten.slice().reverse(), gezeigt = [], n = 0, uhr = null, faellig = 0, rest = 0;
    karten.forEach(function (k) { k.setAttribute('data-pos', 'neu'); });
    function setzen() { gezeigt.forEach(function (k, i) { k.setAttribute('data-pos', String(i)); var z = k.querySelector('small'); if (z) z.textContent = ZEITEN[i] || ''; }); }
    function einfallen() {
      uhr = null;
      if (!document.body.contains(stapel)) return;
      var k = folge[n++];
      gezeigt.unshift(k);
      void k.offsetWidth;
      requestAnimationFrame(function () { requestAnimationFrame(setzen); });
      if (n < folge.length) planen(4800);
    }
    function planen(ms) { faellig = performance.now() + ms; if (!halt) uhr = setTimeout(einfallen, ms); else rest = ms; }
    haltHoerer.push(function (an) {
      if (!document.body.contains(stapel) || n >= folge.length) return;
      if (an && uhr) { clearTimeout(uhr); uhr = null; rest = Math.max(0, faellig - performance.now()); }
      else if (!an && !uhr) planen(rest || 600);
    });
    planen(900);
  }

  /* ---------- Licht, Staub und Maßlinie am Bullauge ----------
     Das Foto liegt mit seinem Seitenverhältnis in .vk-hero-zoom; punkt() rechnet einen Bildpunkt des Originals (1122 × 1402) in die Lage
     darin um (auch für object-fit: cover, falls die Einbettung es so zeigt). ERDE ist der Blick durchs Bullauge. Daraus: --lx/--ly für
     die Mitte des Halos, Lage und Höhe der Maßlinie (am rechten Rand des Ausblicks, rechts vom Zollstock; passt sie nicht hinein, bleibt
     sie weg) und Staub im Lichtkegel zwischen Bullauge und Astronaut (x 760–1090, y 150–700, nie unter der Meldung). Die Maßlinie
     zeichnet sich einmal ab 1,5 s in 900 ms, der Wert läuft mit; bis dahin ist sie verborgen (.vk-wartet), so springt nichts zurück.
     Licht und Staub kommen bei 2,4 s (.vk-hell). Außerhalb des Bildes ruht der Staub (.vk-aus). */
  var ERDE = { x0: 981, y0: 142, x1: 1119, y1: 526 };
  function bullauge(fig, bewegt) {
    var img = fig.querySelector('.vk-hero-zoom img'), licht = fig.querySelector('.vk-licht'), staub = fig.querySelector('.vk-staub'), mass = fig.querySelector('.vk-mass');
    if (!img) return;
    var gezeichnet = !bewegt, t0 = performance.now();
    if (mass && bewegt) mass.classList.add('vk-wartet');
    if (bewegt) setTimeout(function () { fig.classList.add('vk-hell'); }, 2400); else fig.classList.add('vk-hell');
    function punkt(ix, iy) {
      var W = img.clientWidth, H = img.clientHeight, nw = img.naturalWidth || 1122, nh = img.naturalHeight || 1402;
      var k = Math.max(W / nw, H / nh), op = (getComputedStyle(img).objectPosition || '50% 50%').split(' ');
      var ox = (W - nw * k) * (parseFloat(op[0]) / 100), oy = (H - nh * k) * (parseFloat(op[1] || op[0]) / 100);
      return { x: ox + ix * k, y: oy + iy * k, W: W, H: H };
    }
    function legen() {
      if (!document.body.contains(fig)) { window.removeEventListener('resize', legen); return; }
      if (!img.clientWidth) return;
      var a = punkt(ERDE.x0, ERDE.y0), b = punkt(ERDE.x1, ERDE.y1);
      if (licht) { licht.style.setProperty('--lx', ((a.x + Math.min(b.x, a.W)) / 2).toFixed(1) + 'px'); licht.style.setProperty('--ly', ((a.y + b.y) / 2).toFixed(1) + 'px'); }
      if (mass) {
        var sichtbar = fig.getBoundingClientRect().right - img.getBoundingClientRect().left, x = Math.min(b.x - 20, a.W - 16, sichtbar - 16);
        mass.style.setProperty('--mx', x.toFixed(1) + 'px');
        mass.style.setProperty('--my', a.y.toFixed(1) + 'px');
        mass.style.setProperty('--mh', (b.y - a.y).toFixed(1) + 'px');
        mass.classList.toggle('vk-da', x - a.x >= 12);
      }
      if (staub && !staub.firstChild && !ruhig()) {
        var p1 = punkt(760, 150), p2 = punkt(1090, 700), w = p1.W || 1, h = p1.H || 1;
        for (var n = 0; n < 22; n++) {
          var t = document.createElement('i'), r = Math.random;
          var x0 = (p1.x + (p2.x - p1.x) * r()) / w * 100, y0 = (p1.y + (p2.y - p1.y) * Math.pow(r(), 1.2)) / h * 100;
          t.style.cssText = '--s:' + (1 + r() * 1.6).toFixed(1) + 'px;--o:' + (0.2 + r() * 0.4).toFixed(2) + ';--d:' + (9 + r() * 8).toFixed(1) + 's;--v:-' + (r() * 9).toFixed(1) +
            's;--dx:' + Math.round(-12 + r() * 24) + 'px;--dy:' + Math.round(-14 + r() * 18) + 'px;left:' + x0.toFixed(1) + '%;top:' + y0.toFixed(1) + '%';
          staub.appendChild(t);
        }
      }
    }
    function zeichnen() {
      if (gezeichnet || !mass || !mass.classList.contains('vk-da') || !document.body.contains(fig)) return;
      gezeichnet = true;
      var zahl = mass.querySelector('.vk-mass-wert b'), start = 0, D = 900, ende = zahl ? zahl.textContent : '';
      function setz(z, e, w) { mass.style.setProperty('--mz', z); mass.style.setProperty('--me', e); mass.style.setProperty('--mw', w); }
      setz('0', '0', '0');
      mass.classList.remove('vk-wartet');
      requestAnimationFrame(function schritt(t) {
        if (!start) start = t;
        var q = Math.min(1, (t - start) / D), e = 1 - Math.pow(1 - q, 3);
        setz(e.toFixed(3), q >= 1 ? '1' : '0', Math.min(1, q * 3).toFixed(3));
        if (zahl) zahl.textContent = q >= 1 ? ende : Math.round(1200 * e).toLocaleString('de-DE');
        if (q < 1) requestAnimationFrame(schritt);
        else ['--mz', '--me', '--mw'].forEach(function (v) { mass.style.removeProperty(v); });
      });
    }
    function spaeter() { setTimeout(function () { if (!fig.classList.contains('vk-aus')) zeichnen(); }, Math.max(0, 1500 - (performance.now() - t0))); }
    function bereit() { legen(); if (bewegt) spaeter(); }
    if (img.complete && img.naturalWidth) bereit(); else img.addEventListener('load', bereit, { once: true });
    window.addEventListener('resize', legen);
    if (kannIO) {
      var io = beobachten(new IntersectionObserver(function (es) {
        es.forEach(function (e) { fig.classList.toggle('vk-aus', !e.isIntersecting); if (e.isIntersecting && img.naturalWidth && bewegt) spaeter(); });
      }, { threshold: 0 }));
      io.observe(fig);
    }
  }

  /* ---------- Leisten unter dem Startbild ----------
     Je Leiste (data-vk-leiste="rechts" | "links") eine Spur mit dem Satz der Einträge, geklont, bis die Spur die Breite der Leiste und
     einen Satz mehr deckt (Klone aria-hidden). Eine gemeinsame Schleife läuft nur, solange eine Leiste im Bild ist: Grundgeschwindigkeit
     30 px/s in der Richtung der Leiste, dazu ein Schub aus dem Bildlauf (Faktor 0,42 auf die Geschwindigkeit, höchstens 120 px/s;
     abwärts in ihre Richtung, aufwärts zurück), der weich einsetzt und in 600 ms abklingt. Mit der Maus über der Leiste fällt die
     Grundgeschwindigkeit auf ein Viertel; der Halt-Knopf hält die Spur ganz an. Je
     Eintrag --l (1 in der Mitte, zu den Rändern 0) für die Helligkeit; die Lagen der Einträge werden einmal gemessen (und nach einer
     Größenänderung), in der Schleife wird nur gerechnet und geschrieben. Die zweite Leiste lässt ihre Zahlen einmal einrollen (.vk-da),
     wenn sie ins Bild kommt. Bei „weniger Bewegung“: keine Schleife, die Leiste steht (.vk-still) und lässt sich schieben. */
  var LEISTEN = [], leisteLauf = 0, leisteT = 0, leisteY = 0, leisteMass = 0;
  function leisteMessen(L) {
    var satz = L.saetze[0];
    L.breite = satz.offsetWidth; L.w = L.el.clientWidth;
    while (L.breite > 0 && L.saetze.length * L.breite < L.w + L.breite * 1.1) {
      var k = satz.cloneNode(true); k.setAttribute('aria-hidden', 'true'); L.spur.appendChild(k); L.saetze.push(k);
    }
    L.eintraege = [];
    L.saetze.forEach(function (s) { Array.prototype.forEach.call(s.children, function (li, i) { li.style.setProperty('--i', String(i)); L.eintraege.push({ el: li, x: li.offsetLeft, b: li.offsetWidth }); }); });
  }
  function leisteSchritt(t) {
    leisteLauf = 0;
    if (halt) { leisteT = 0; return; }
    var dt = leisteT ? Math.min(0.064, (t - leisteT) / 1000) : 0;
    leisteT = t;
    var y = window.pageYOffset || 0, dy = y - leisteY;
    leisteY = y;
    if (Math.abs(dy) > 600) dy = 0; // Sprung (Anker, Neuladen): kein Schub
    var weiter = false;
    LEISTEN = LEISTEN.filter(function (L) { return document.body.contains(L.el); });
    LEISTEN.forEach(function (L) {
      if (!L.sichtbar || !L.breite) return;
      weiter = true;
      L.halt += ((L.maus ? 0.75 : 0) - L.halt) * Math.min(1, dt * 4);
      /* Schub aus dem Bildlauf: höchstens 120 px/s dazu, weich an und in 600 ms wieder abgeklungen; angehalten steht die Spur */
      var soll = dt > 0 ? Math.max(-120, Math.min(120, dy / dt * 0.42)) : 0;
      L.schub += (soll - L.schub) * (1 - Math.exp(-dt / (Math.abs(soll) > Math.abs(L.schub) ? 0.12 : 0.2)));
      if (!halt) L.pos += L.dir * (30 * (1 - L.halt) + L.schub) * dt;
      var m = ((L.pos % L.breite) + L.breite) % L.breite, tx = m - L.breite, mitte = L.w / 2;
      L.spur.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,0,0)';
      for (var i = 0; i < L.eintraege.length; i++) {
        var e = L.eintraege[i], c = e.x + e.b / 2 + tx;
        if (c < -e.b || c > L.w + e.b) continue;
        var ds = Math.max(-1, Math.min(1, (c - mitte) / mitte)), d = Math.abs(ds);
        e.el.style.setProperty('--l', (1 - d * d).toFixed(2));
        e.el.style.setProperty('--d', ds.toFixed(3));
        e.el.style.setProperty('--a', (d * d).toFixed(3));
      }
    });
    if (weiter) leisteLauf = requestAnimationFrame(leisteSchritt);
    else leisteT = 0;
  }
  function leisteStart() { if (!leisteLauf) { leisteY = window.pageYOffset || 0; leisteT = 0; leisteLauf = requestAnimationFrame(leisteSchritt); } }
  haltHoerer.push(function (an) { if (!an && LEISTEN.length) leisteStart(); });
  function leisten(wurzel) {
    Array.prototype.forEach.call(wurzel.querySelectorAll('[data-vk-leiste]'), function (el) {
      if (el.__vkAn) return;
      el.__vkAn = true;
      var spur = el.querySelector('.vk-leiste-spur'), satz = spur && spur.querySelector('.vk-leiste-satz');
      if (!satz) return;
      var zahlen = el.classList.contains('vk-leiste-b');
      if (ruhig()) { el.classList.add('vk-still'); if (zahlen) el.classList.add('vk-da'); return; }
      var L = { el: el, spur: spur, saetze: [satz], dir: el.getAttribute('data-vk-leiste') === 'rechts' ? 1 : -1, pos: 0, schub: 0, halt: 0, maus: false, sichtbar: !kannIO, breite: 0, w: 0, eintraege: [] };
      leisteMessen(L);
      LEISTEN.push(L);
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') L.maus = true; });
      el.addEventListener('pointerleave', function () { L.maus = false; });
      if (kannIO) {
        var io = beobachten(new IntersectionObserver(function (es) {
          es.forEach(function (e) { L.sichtbar = e.isIntersecting; if (e.isIntersecting) { if (zahlen) el.classList.add('vk-da'); leisteStart(); } });
        }, { threshold: 0 }));
        io.observe(el);
      } else { if (zahlen) el.classList.add('vk-da'); leisteStart(); }
    });
    if (!leisteMass) {
      leisteMass = 1;
      var warte = null;
      window.addEventListener('resize', function () { clearTimeout(warte); warte = setTimeout(function () { LEISTEN.forEach(leisteMessen); }, 150); });
      /* Schriften nachgeladen: Breiten neu messen */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { LEISTEN.forEach(leisteMessen); });
    }
  }

  /* ---------- Paketreihe am Telefon ----------
     Bis 760 px ist .vk-pakete eine Reihe mit Einrasten (verkauf.css); Karte und Beispielseite sind ein Stück, Wischen im Bild bewegt die
     Pakete mit. Hier: Start beim empfohlenen Paket (data-start, beim Neuaufbau der Einbettung das zuletzt gezeigte), je Karte --d (Abstand
     zur Mitte in Karten) und --a (|d| bis 1) für Zurücktreten und Gegenlauf der Skizze, in der Leiste darunter --p für den Zeiger und
     aria-current für den Namen. Ein Tipp auf einen Namen rollt sanft zur Karte (ohne die Seite zu bewegen; der Klick geht nicht an
     portal.js weiter). Einmal, wenn die Reihe zur Hälfte im Bild steht und noch niemand gewischt hat, laufen die Karten einmal ein Stück
     nach links und federn zurück (.vk-wischen, verkauf.css): so sieht man, dass sie sich wischen lässt. „Leistungen ansehen“ klappt die
     Listen aller drei Karten zugleich auf. */
  var paketIndex = null;
  function pakete(wurzel) {
    var box = wurzel.querySelector('[data-vk-pakete]');
    if (!box || box.__vkAn) return;
    box.__vkAn = true;
    var karten = Array.prototype.slice.call(box.querySelectorAll('.vk-paket'));
    var nav = wurzel.querySelector('.vk-pakete-nav'), links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[data-i]')) : [];
    var mq = window.matchMedia ? window.matchMedia('(max-width: 760px)') : { matches: false };
    var start = parseInt(box.getAttribute('data-start'), 10) || 0, aktiv = -1, tick = false, beruehrt = false;
    var mehr = Array.prototype.slice.call(box.querySelectorAll('.vk-mehr'));
    mehr.forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () {
        var auf = !box.classList.contains('vk-offen');
        box.classList.toggle('vk-offen', auf);
        mehr.forEach(function (x) { x.setAttribute('aria-expanded', String(auf)); x.textContent = auf ? 'Leistungen ausblenden' : 'Leistungen ansehen'; });
      });
    });
    if (!karten.length) return;
    function schritt() { return karten.length > 1 ? karten[1].offsetLeft - karten[0].offsetLeft : 1; }
    function rechnen() {
      tick = false;
      if (!document.body.contains(box)) return; // Einbettung neu aufgebaut: diese Reihe gibt es nicht mehr
      if (!mq.matches) { karten.forEach(function (k) { k.style.removeProperty('--a'); k.style.removeProperty('--d'); }); return; }
      var st = schritt() || 1, mitte = box.scrollLeft + box.clientWidth / 2;
      karten.forEach(function (k) {
        var d = (k.offsetLeft + k.offsetWidth / 2 - mitte) / st;
        k.style.setProperty('--d', d.toFixed(3));
        k.style.setProperty('--a', Math.min(1, Math.abs(d)).toFixed(3));
      });
      var p = Math.max(0, Math.min(karten.length - 1, (mitte - karten[0].offsetLeft - karten[0].offsetWidth / 2) / st)), i = Math.round(p);
      if (nav) nav.style.setProperty('--p', p.toFixed(3));
      if (i !== aktiv) { aktiv = i; paketIndex = i; links.forEach(function (a, j) { a.setAttribute('aria-current', j === i ? 'true' : 'false'); }); }
    }
    function anstossen() { if (!tick) { tick = true; requestAnimationFrame(rechnen); } }
    function zu(i, sanft) {
      var k = karten[i];
      if (k) box.scrollTo({ left: k.offsetLeft + k.offsetWidth / 2 - box.clientWidth / 2, behavior: sanft && !ruhig() ? 'smooth' : 'auto' });
    }
    box.addEventListener('scroll', anstossen, { passive: true });
    window.addEventListener('resize', anstossen);
    ['pointerdown', 'touchstart', 'wheel'].forEach(function (n) { box.addEventListener(n, function () { beruehrt = true; }, { passive: true }); });
    links.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); beruehrt = true; zu(parseInt(a.getAttribute('data-i'), 10) || 0, true); });
    });
    if (mq.matches) zu(paketIndex !== null ? paketIndex : start, false);
    rechnen();
    var wechsel = function () { if (!document.body.contains(box)) return; if (mq.matches) zu(aktiv >= 0 ? aktiv : start, false); anstossen(); };
    if (mq.addEventListener) mq.addEventListener('change', wechsel); else if (mq.addListener) mq.addListener(wechsel);
    if (kannIO && !ruhig()) {
      var hio = beobachten(new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting || !mq.matches) return;
          hio.disconnect();
          if (beruehrt) return;
          setTimeout(function () {
            if (beruehrt || !document.body.contains(box)) return;
            box.classList.add('vk-wischen');
            setTimeout(function () { box.classList.remove('vk-wischen'); }, 1200);
          }, 450);
        });
      }, { threshold: 0.55 }));
      hio.observe(box);
    }
  }

  /* ---------- Zahlenkacheln (Einigung A2) ----------
     Der Endwert steht immer im HTML, nichts zählt hoch. Jede Ziffer liegt in einer Maske (.vk-ziffer); kommt die Kachel zu 15 % ins Bild,
     rollen die Ziffern von unten herein (600 ms, je Ziffer 30 ms später), Komma, Punkt und Einheit stehen. Liegt die Kachel beim Aufruf
     unter dem Bildrand, warten die Ziffern in ihrer Maske (.vk-wartet); steht sie schon im Bild, bleibt die Zahl einfach stehen. Bei
     „weniger Bewegung“ und ohne Beobachter rollt nichts. */
  function zahlen(wurzel) {
    if (ruhig() || !kannIO) return;
    Array.prototype.forEach.call(wurzel.querySelectorAll('[data-zahl]'), function (el) {
      if (el.__vkAn) return;
      el.__vkAn = true;
      var z = 0, kachel = el.closest('li') || el;
      if (kachel.getBoundingClientRect().top < window.innerHeight) return;
      el.innerHTML = el.textContent.replace(/\d/g, function (d) { return '<span class="vk-ziffer"><span style="--z:' + (z++) + '">' + d + '</span></span>'; });
      el.classList.add('vk-wartet');
      var io = beobachten(new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (!e.isIntersecting) return; io.disconnect(); el.classList.remove('vk-wartet'); el.classList.add('vk-rollt'); });
      }, { threshold: 0.15 }));
      io.observe(kachel);
    });
  }

  /* ---------- Szene „Was in jeder Anfrage steht“ ----------
     --sp von 0 (Szene kommt unten herein) bis 1 (oben hinaus): Aufmaßblatt und die kleinen Karten laufen leicht gegeneinander. */
  function szene(wurzel) {
    var sz = wurzel.querySelector('.vk-szene');
    if (!sz || sz.__vkAn || !window.Scroll || ruhig()) return;
    sz.__vkAn = true;
    window.Scroll.binden(sz, function (p) { sz.style.setProperty('--sp', p.toFixed(3)); });
  }

  /* ---------- Lesefortschritt im Kopf der statischen Seite ----------
     Der Maßstab an der Unterkante der Kopfzeile füllt sich grün mit dem Weg durch die Seite (--k von 0 bis 1). */
  var kopfAn = false;
  function fortschritt(wurzel) {
    if (kopfAn || wurzel !== document) return;
    var kopf = document.querySelector('.vk-seite .rg-kopf');
    if (!kopf) return;
    kopfAn = true;
    var tick = false;
    function rechnen() {
      tick = false;
      var d = document.documentElement, k = (window.pageYOffset || 0) / Math.max(1, d.scrollHeight - window.innerHeight);
      kopf.style.setProperty('--k', Math.max(0, Math.min(1, k)).toFixed(4));
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(rechnen); } }, { passive: true });
    window.addEventListener('resize', rechnen);
    rechnen();
  }

  /* ---------- Auftritt der Abschnitte (Zeitplan Abschnitt, Einigung E2) ----------
     Einmal, wenn 15 % im Bild sind: Haarlinie (600 ms), Nummer (80, 320), Überschrift aus der Maske (120, 600), Lesetext (280, 600); die
     Karten erscheinen über Reveal. Was beim Aufruf schon im Bild steht oder vorbei ist, bleibt, wie es ist. */
  function abschnitte(wurzel, unten) {
    if (ruhig() || !kannIO) return;
    var io = beobachten(new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; io.unobserve(e.target); e.target.classList.remove('vk-vor'); e.target.classList.add('vk-auf'); });
    }, { threshold: 0.15 }));
    Array.prototype.forEach.call(wurzel.querySelectorAll('.vk-teil, .vk-band'), function (t) {
      if (t.__vkAuf || !unten(t) || t.getBoundingClientRect().top < window.innerHeight * 0.85) return;
      t.__vkAuf = true;
      t.classList.add('vk-vor');
      io.observe(t);
    });
  }

  /* ---------- Tiefenwechsel (Designrichtung 3.5) ----------
     Im letzten Fünftel seines Wegs durchs Bild tritt das Medium zurück: auf 0,97 und Deckkraft 0,5 (Foto im Band, Aufmaßblatt der Szene). */
  function tiefe(wurzel) {
    if (!window.Scroll || ruhig()) return;
    Array.prototype.forEach.call(wurzel.querySelectorAll('.vk-band > .foto-karte img, .vk-szene .vk-mk-rahmen'), function (el) {
      if (el.__vkTiefe) return;
      el.__vkTiefe = true;
      window.Scroll.binden(el, function (p) { var t = Math.max(0, (p - 0.8) / 0.2); el.style.scale = t ? (1 - 0.03 * t).toFixed(4) : ''; el.style.opacity = t ? (1 - 0.5 * t).toFixed(3) : ''; });
    });
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
      var liste = Array.prototype.filter.call(wurzel.querySelectorAll('.vk-punkte > li, .vk-schritte > li, .vk-inhalt > li, .vk-anfrage .vk-szene, .vk-anfrage .vk-blatt, .vk-band > :not(ul), .vk-gruende > li, .vk-zusagen > li, .vk-vorspann, .vk-pakete, .vk-ablauf > li, .vk-demos > .rg-karte, .vk-bestellen > *, .vk-wissen > .rg-karte'), unten);
      /* versetzt wird nur je Zeile: was beim Scrollen hereinkommt, erscheint ohne Staffel, so kommt eine Reihe zusammen */
      window.Reveal.auf(liste);
    }
    abschnitte(wurzel, unten);
    tiefe(wurzel);

    /* alle Zeichen mit data-lottie (Schrittkarten, Bühne, Paketkarten): Schleifen, die gemeinsam.js nur im Bild spielt; ein schon
       gestartetes Element überspringt Lottie selbst */
    if (window.Lottie) window.Lottie.auf(wurzel);
    buehne(wurzel);
    haltKnoepfe(wurzel);
    startbild(wurzel, still);
    leisten(wurzel);
    pakete(wurzel);
    zahlen(wurzel);
    szene(wurzel);
    fortschritt(wurzel);

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

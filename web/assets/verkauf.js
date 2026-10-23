/* eeziframes · Verkaufsseite der Konfigurator-Pakete (/fuer-fensterbauer/): Anfrageformular ohne Neuladen, Paket aus der Karte übernehmen;
   unten die Bewegung der Landingpage (Reveal, Kennzahlen, Zeichen, Zeitleiste) mit den Hilfen aus gemeinsam.js.
   Ohne JavaScript schickt das Formular ganz normal ab (POST /api/partner/frage als Formular; der Server antwortet mit einer eigenen
   Seite). Mit JavaScript dieselbe Route als JSON: Fehler stehen am Feld (aria-invalid, Text darunter), der Dank ersetzt das Formular.
   Felder und Regeln wie functions/api/partner.js (frageAnnehmen): Name ab 2 Zeichen, gültige E-Mail, Frage ab 3 Zeichen; „fax“ ist
   der Honigtopf. */
(function () {
  'use strict';
  var form = document.querySelector('form[data-vk-frage]');
  if (!form) return;
  form.setAttribute('novalidate', '');
  var meldung = form.querySelector('.vk-meldung'), knopf = form.querySelector('button[type="submit"]');
  var MAIL = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;

  /* „… anfragen“ in einer Paketkarte: Paket im Formular vorwählen */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-paket]') : null;
    if (!a) return;
    var s = form.querySelector('select[name="paket"]');
    if (s) s.value = a.getAttribute('data-paket');
  });

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
})();

/* ---------- Bewegung der Landingpage (23.10.2026) ----------
   Hilfen aus gemeinsam.js (Reveal, Scroll, Lottie, Feier); fehlt eine, bleibt die Seite so, wie sie ohne JavaScript ist: alles
   sichtbar, Zahlen stehen, Standbilder, Zeitleiste voll. Bei „weniger Bewegung“ läuft nichts.
   - Reveal: Karten und Blöcke erscheinen, wenn sie ins Bild kommen (Katalog 1)
   - Kennzahlen: laufen einmal von 0 hoch und rasten ein (Katalog 5 und 6)
   - Zeichen der Schrittkarten: spielen nacheinander, nie zwei zugleich (Regel der Bewegtbilder); das erste Zeichen ist ein Standbild
   - Zeitleiste des Ablaufs: die Linie füllt sich scrollgebunden (Katalog 9), erreichte Schritte werden grün
   - „marke“ (Gruppe B, /assets/lottie/marke.json): spielt erst, wenn der Behälter data-lottie trägt (bis die Datei da ist, steht er
     mit data-lottie-bald, damit kein Aufruf ins Leere geht und die Prüfsuite keinen 404 meldet) */
(function () {
  'use strict';
  function ruhig() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  var kannIO = 'IntersectionObserver' in window;

  /* Erscheinen beim Scrollen: gemeinsam.js setzt .rev (unsichtbar) und .in (sichtbar); ohne Beobachter sofort sichtbar */
  if (window.Reveal) {
    window.Reveal.auf(document.querySelectorAll('.vk-zahl, .vk-punkte > li, .vk-schritte > li, .vk-inhalt > li, .vk-blatt, .vk-band > *, .vk-vorspann, .vk-paket, .vk-ablauf > li, .vk-demos > .rg-karte, .vk-bestellen > *, .vk-wissen > .rg-karte'));
  }

  /* Kennzahlen: von 0 bis zur Zahl in 750 ms (Kurve wie countUp der Startseite), dann Einrasten */
  function hochlaufen(b) {
    var zu = parseInt(b.getAttribute('data-zahl'), 10) || 0, t0 = performance.now(), dauer = 750;
    (function schritt(t) {
      var k = Math.min(1, (t - t0) / dauer), e = 1 - Math.pow(1 - k, 3);
      b.textContent = String(Math.round(zu * e));
      if (k < 1) requestAnimationFrame(schritt); else { b.textContent = String(zu); if (window.Feier) window.Feier.einrasten(b); }
    })(t0);
  }
  var zahlen = document.querySelectorAll('.vk-zahl b[data-zahl]');
  if (zahlen.length && kannIO && !ruhig()) {
    var zio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; zio.unobserve(e.target); hochlaufen(e.target); }); }, { threshold: 0.6 });
    Array.prototype.forEach.call(zahlen, function (b) { b.textContent = '0'; zio.observe(b); });
  }

  /* Schrittkarten: die Zeichen der Reihe nach, jedes einmal; das nächste beginnt, wenn das vorige fertig ist (oder nach 6 s, falls
     es außerhalb des Bildes pausiert). Bei „weniger Bewegung“ zeigt Lottie.spielen selbst das Endbild. */
  function kette(karten, i) {
    if (i >= karten.length) return;
    var k = karten[i], weiter = false;
    var naechste = function () { if (weiter) return; weiter = true; kette(karten, i + 1); };
    window.Lottie.spielen(k, k.getAttribute('data-zeichen'), {}).then(function (an) {
      if (!an || ruhig()) { setTimeout(naechste, an ? 0 : 800); return; }
      an.addEventListener('complete', naechste);
      setTimeout(naechste, 6000);
    });
  }
  var karten = Array.prototype.slice.call(document.querySelectorAll('.vk-schritte [data-zeichen]'));
  if (karten.length && window.Lottie) {
    if (kannIO && !ruhig()) {
      var kio = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { kio.disconnect(); kette(karten, 0); } }, { threshold: 0.3 });
      kio.observe(karten[0]);
    } else kette(karten, 0);
  }
  /* alles mit data-lottie (das Zeichen „marke“, sobald freigeschaltet) */
  if (window.Lottie) window.Lottie.auf(document);

  /* Zeitleiste: --sp von 0 (Liste kommt unten herein) bis 1 (Liste steht zu zwei Dritteln im Bild); Schritte, die die gefüllte Linie
     erreicht hat, bekommen .vk-an. Ohne Scroll-Bindung oder bei „weniger Bewegung“: voll und alle erreicht. */
  var ablauf = document.querySelector('.vk-ablauf');
  if (ablauf) {
    var schritte = Array.prototype.slice.call(ablauf.children);
    var voll = function () { ablauf.style.setProperty('--sp', '1'); schritte.forEach(function (x) { x.classList.add('vk-an'); }); };
    if (!window.Scroll || ruhig()) voll();
    else window.Scroll.binden(ablauf, function (p) {
      ablauf.style.setProperty('--sp', p.toFixed(3));
      var r = ablauf.getBoundingClientRect(), ende = r.top + 20 + (r.height - 56) * p;
      schritte.forEach(function (x) { x.classList.toggle('vk-an', x.getBoundingClientRect().top + 16 <= ende + 1); });
    }, { von: 0.9, bis: 0.6 });
  }
})();

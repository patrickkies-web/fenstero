/* eeziframes · Verkaufsseite der Konfigurator-Pakete (/fuer-fensterbauer/): Anfrageformular ohne Neuladen, Paket aus der Karte übernehmen.
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

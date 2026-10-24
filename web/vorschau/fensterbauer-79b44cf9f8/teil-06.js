/* Anfrage: Paket aus den Karten vorwählen, Formular prüfen (Vorschau ohne Versand) */
(function () {
  var form = document.getElementById('anfrage-form'); if (!form) return;
  var werte = ['essential', 'plus', 'signature'];
  document.querySelectorAll('[data-paket-wahl]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = form.querySelector('input[name="paket"][value="' + werte[+a.dataset.paketWahl] + '"]');
      if (r) r.checked = true;
    });
  });
  var fehler = form.querySelector('.f-fehler'), danke = form.querySelector('.f-danke');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var erste = null;
    form.querySelectorAll('[required]').forEach(function (f) {
      var ok = f.value.trim() !== '' && (f.type !== 'email' || /.+@.+\..+/.test(f.value));
      f.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok && !erste) erste = f;
    });
    fehler.hidden = !erste;
    if (erste) { erste.focus(); return; }
    danke.hidden = false;
  });
  form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });
})();

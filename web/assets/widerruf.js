/* eeziframes · Widerrufsfunktion (/widerruf/, § 356a BGB): „Widerruf bestätigen“ schickt Name, Vertrag und E-Mail an /api/widerruf.
   Der Server bestätigt den Eingang per E-Mail; die Seite zeigt dieselbe Bestätigung mit Datum und Uhrzeit. Ohne JavaScript schickt
   der Browser das Formular selbst (method="post"), dann antwortet der Server mit der Bestätigungsseite (functions/api/widerruf.js). */
(function () {
  'use strict';
  var form = document.getElementById('widerruf'), ok = document.getElementById('widerruf-ok');
  if (!form || !ok) return;
  var knopf = document.getElementById('wr-senden'), allg = document.getElementById('wr-fehler');
  var FELDER = ['name', 'vertrag', 'mail'];
  function setze(id, text) { var e = document.getElementById(id); if (e) e.textContent = text; }
  function feldFehler(f, text) {
    var box = document.getElementById('wr-' + f + '-f'), feld = form.elements[f];
    if (!box || !feld) return;
    box.textContent = text || ''; box.hidden = !text;
    if (text) feld.setAttribute('aria-invalid', 'true'); else feld.removeAttribute('aria-invalid');
  }
  function aufraeumen() { FELDER.forEach(function (f) { feldFehler(f, ''); }); allg.hidden = true; allg.textContent = ''; }
  function pruefen(d) {
    var f = {};
    if (!d.name) f.name = 'Bitte Ihren Namen angeben.';
    if (!d.vertrag) f.vertrag = 'Bitte angeben, welchen Vertrag Sie widerrufen.';
    if (!/^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(d.mail)) f.mail = 'Bitte eine gültige E-Mail-Adresse angeben, an die wir die Bestätigung schicken.';
    return f;
  }
  form.addEventListener('input', function (e) { if (e.target && e.target.name) feldFehler(e.target.name, ''); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    aufraeumen();
    var d = { name: form.elements.name.value.trim(), vertrag: form.elements.vertrag.value.trim(), mail: form.elements.mail.value.trim() };
    var f = pruefen(d), erstes = FELDER.filter(function (x) { return f[x]; })[0];
    if (erstes) { FELDER.forEach(function (x) { feldFehler(x, f[x]); }); form.elements[erstes].focus(); return; }
    knopf.disabled = true; knopf.textContent = 'Wird gesendet …';
    fetch('/api/widerruf', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (j) {
        if (!j || !j.ok) {
          var fs = (j && j.felder) || {};
          FELDER.forEach(function (x) { feldFehler(x, fs[x]); });
          if (!Object.keys(fs).length) { allg.textContent = (j && j.fehler) || 'Das hat nicht geklappt. Bitte noch einmal oder per E-Mail.'; allg.hidden = false; }
          knopf.disabled = false; knopf.textContent = 'Widerruf bestätigen';
          return;
        }
        setze('wr-ok-zeit', j.zeit || '');
        setze('wr-ok-vertrag', j.inhalt.vertrag);
        setze('wr-ok-name', j.inhalt.name);
        setze('wr-ok-mail', j.inhalt.mail);
        setze('wr-ok-post', j.bestaetigt ? 'Eine Eingangsbestätigung mit diesen Angaben haben wir an ' + j.an + ' geschickt.' : 'Die Eingangsbestätigung per E-Mail senden wir Ihnen, sobald unser E-Mail-Versand wieder erreichbar ist. Diese Seite können Sie zusätzlich speichern oder ausdrucken.');
        form.hidden = true; ok.hidden = false;
        ok.setAttribute('tabindex', '-1'); ok.focus();
      })
      .catch(function () {
        allg.textContent = 'Keine Verbindung. Bitte noch einmal oder per E-Mail.'; allg.hidden = false;
        knopf.disabled = false; knopf.textContent = 'Widerruf bestätigen';
      });
  });
})();

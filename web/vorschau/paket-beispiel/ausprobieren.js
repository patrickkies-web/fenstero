/* Testansicht für Fensterbauer auf der Beispielseite von Fensterbau Brandt (28.10.2026, Wunsch des Inhabers): „Selbst ausprobieren“ auf
   der Seite für Fensterbauer öffnet <paket>.html?ausprobieren. Beim Ankommen liegt die Seite abgedunkelt im Hintergrund, davor ein
   Kästchen: Diese Landingpage gestalten wir auf Wunsch mit, angepasst mit seinen Bildern, seinem Logo, seinen Farben und Texten;
   „Fenster planen“ auf der Seite oder gleich „Fenster konfigurieren“ im Kästchen spielt den Besuch seines Kunden durch (Inhaber,
   28.10.2026, nachmittags). Einmal je Tab; die Seite zeigt den Weg „Über die Website“ (der Kunde
   kommt von der Website des Betriebs, nicht mit einem Einladungslink). Nur in den Seiten unter web/vorschau/paket-beispiel/
   (docs/profis/werkzeuge/paketvorlagen.py --web kopiert diese Datei als ausprobieren.js). */
(function () {
  'use strict';
  var w = window, d = document;
  var q = ''; try { q = new URLSearchParams(w.location.search).has('ausprobieren') ? 'ja' : ''; } catch (e) { q = ''; }
  if (!q) return;
  var wurzel = d.querySelector('main.ez'), paket = (wurzel && wurzel.getAttribute('data-paket')) || 'signature';
  /* Der Kunde kommt über die Website des Betriebs */
  if (wurzel) {
    wurzel.setAttribute('data-modus', 'website');
    Array.prototype.forEach.call(d.querySelectorAll('.ez-modus input[name="ez-modus"]'), function (r) { r.checked = r.value === 'website'; });
  }
  /* Paketwechsel in der Muster-Leiste bleibt in der Testansicht */
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ml__pakete a'), function (a) {
    var h = a.getAttribute('href') || '';
    if (h && h.indexOf('?') < 0) a.setAttribute('href', h.replace(/(#.*)?$/, '?ausprobieren$1'));
  });
  var gesehen = false; try { gesehen = w.sessionStorage.getItem('ez-ausprobieren') === '1'; } catch (e) { gesehen = false; }
  if (gesehen) return;
  var namen = { essential: 'Essential', plus: 'Plus', signature: 'Signature' };
  var dlg = d.createElement('dialog');
  dlg.className = 'ez-probe';
  dlg.setAttribute('aria-labelledby', 'ez-probe-t');
  dlg.setAttribute('aria-describedby', 'ez-probe-s');
  dlg.innerHTML =
    '<div class="ez-probe__karte">' +
      '<span class="ez-probe__etikett">Vorschau für Fensterbauer</span>' +
      '<h2 id="ez-probe-t" tabindex="-1">So sieht Ihre Seite aus. <span>Im Paket ' + (namen[paket] || 'Signature') + '.</span></h2>' +
      '<p id="ez-probe-s">Diese Landingpage gestalten wir auf Wunsch mit Ihnen, mit Ihren Bildern, Ihrem Logo, Ihren Farben und Ihren Texten. ' +
        'Fensterbau Brandt ist ein erfundener Betrieb.</p>' +
      '<p>Auf der Seite startet „Fenster planen“ den Konfigurator, so wie bei Ihren Kunden. Oder Sie konfigurieren gleich hier. Gesendet wird nichts.</p>' +
      '<div class="ez-probe__knoepfe">' +
        '<a class="ez-probe__pille" href="/app/?ausprobieren=' + paket + '">Fenster konfigurieren<span class="ez-probe__pfeil" aria-hidden="true">' +
          '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h10M8 3l4 4-4 4"/></svg></span></a>' +
        '<button type="button" class="ez-probe__leise" data-zu>Seite ansehen</button>' +
      '</div>' +
    '</div>';
  d.body.appendChild(dlg);
  var zu = function () {
    try { w.sessionStorage.setItem('ez-ausprobieren', '1'); } catch (e) { /* ok */ }
    if (dlg.open) dlg.close();
  };
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || (e.target.closest && e.target.closest('[data-zu]'))) zu(); // Tipp neben das Kästchen oder auf „Seite ansehen“
  });
  dlg.addEventListener('close', function () { try { w.sessionStorage.setItem('ez-ausprobieren', '1'); } catch (e) { /* ok */ } dlg.remove(); });
  if (typeof dlg.showModal === 'function') {
    dlg.showModal();
    var t = d.getElementById('ez-probe-t'); if (t) t.focus({ preventScroll: true });
  } else dlg.setAttribute('open', '');
})();

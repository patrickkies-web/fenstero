/* 03: Ein Punkt ist offen; das echte Aufmaßblatt markiert die passende Stelle; die Szene schwebt leicht mit dem Scrollen */
(function () {
  var teile = document.querySelectorAll('.teil'), szene = document.querySelector('.szene');
  if (!teile.length || !szene) return;
  var hinweis = szene.querySelector('[data-blatt-hinweis]');
  var texte = ['Seite 1, Spalte Öffnung', 'Seite 1, Spalte Element', 'Seite 1, Fotos ausgewertet', 'Seite 1, Fenster und Flügel', 'je Position auf den Folgeseiten', 'je Position auf den Folgeseiten', 'am Ende jeder Position'];
  function markieren() {
    var offen = document.querySelector('.teil[open]'), k = offen ? offen.dataset.teil : null;
    szene.querySelectorAll('[data-teil]').forEach(function (el) { el.classList.toggle('hell', el.dataset.teil === k); });
    hinweis.textContent = k === null ? '' : texte[+k];
  }
  teile.forEach(function (t) {
    t.addEventListener('toggle', function () {
      if (t.open) teile.forEach(function (o) { if (o !== t && o.open) o.open = false; });
      markieren();
    });
  });
  markieren();
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (ruhig) return;
  var tick = false;
  function schweben() {
    tick = false;
    var r = szene.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    szene.style.setProperty('--sp', p.toFixed(3));
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(schweben); } }, { passive: true });
  schweben();
})();

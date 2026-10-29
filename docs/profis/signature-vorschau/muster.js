/* Muster-Leiste der Paket-Vorlagen: Schalter „Etiketten“ und Paketwechsel an derselben Stelle der Seite. Nur in den Vorlagen für
   Fensterbauer; beim echten Betrieb fehlen Leiste und Skript. Quelle: docs/profis/werkzeuge/muster-leiste.js, kopiert in jede Vorlage. */
(function () {
  'use strict';
  var w = window, d = document, wurzel = d.querySelector('.ez');
  /* Etiketten an und aus; anfangs aus, die Wahl bleibt auf diesem Gerät (nur eine Vorliebe) */
  var schalter = d.getElementById('muster-schalter');
  if (schalter && wurzel) {
    var setze = function (an) { wurzel.classList.toggle('ist-muster', an); schalter.setAttribute('aria-pressed', an ? 'true' : 'false'); };
    try { if (w.localStorage.getItem('ez-muster') === 'an') setze(true); } catch (e) {}
    schalter.addEventListener('click', function () {
      var an = schalter.getAttribute('aria-pressed') !== 'true';
      setze(an);
      try { w.localStorage.setItem('ez-muster', an ? 'an' : 'aus'); } catch (e) {}
    });
  }
  /* Paketwechsel: man landet an derselben Stelle (die Szene in der Bildschirmmitte), und die Zielseite weiß, woher man kommt
     (Signature zeigt dann zuerst den Website-Zustand, damit der Vergleich gleich ist) */
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ml__pakete a'), function (a) {
    a.addEventListener('click', function () {
      if (a.getAttribute('aria-current')) return;
      var mitte = (w.innerHeight || 0) / 2, ziel = '';
      Array.prototype.forEach.call(d.querySelectorAll('.dna-szene[id]'), function (s) { if (s.getBoundingClientRect().top <= mitte) ziel = s.id; });
      try { w.sessionStorage.setItem('ez-von', (wurzel && wurzel.getAttribute('data-paket')) || ''); } catch (e) {}
      var basis = a.getAttribute('href').split('#')[0];
      a.setAttribute('href', ziel && (w.scrollY || 0) > 40 ? basis + '#' + ziel : basis);
    });
  });
})();

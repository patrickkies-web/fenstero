/* Startseite eeziframes (Vorschau Design-DNA): Leiste beim Hochscrollen, Stationen folgen den Stufen. Die Bausteine selbst startet dna/bundle.js. */
(function () {
  'use strict';
  var w = window, d = document;
  var reduziert = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite */
  var leiste = d.querySelector('.ez-leiste'), kopf = d.querySelector('.ez-kopf');
  if (leiste) {
    var letzte = w.scrollY || 0, hoch = 0, geplant = false, grenze = 160;
    function messeGrenze() { if (kopf) grenze = kopf.getBoundingClientRect().bottom + (w.scrollY || 0); }
    messeGrenze(); w.addEventListener('resize', messeGrenze); w.addEventListener('load', messeGrenze);
    function pruefe() {
      geplant = false;
      var y = w.scrollY || 0;
      if (y < letzte) hoch += letzte - y; else if (y > letzte) hoch = 0;
      leiste.classList.toggle('ist-da', y > grenze && hoch > 24);
      letzte = y;
    }
    w.addEventListener('scroll', function () { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, { passive: true });
  }

  /* Stationen: die Stufe in der Bildschirmmitte ist „aktiv“, davor „fertig“, danach „offen“ */
  var stufen = Array.prototype.slice.call(d.querySelectorAll('.ez-stufe'));
  var stationen = Array.prototype.slice.call(d.querySelectorAll('.ez-schritte li'));
  function setze(aktiv) {
    stationen.forEach(function (li, i) { li.setAttribute('data-zustand', i < aktiv ? 'fertig' : i === aktiv ? 'aktiv' : 'offen'); });
  }
  if (stufen.length && stationen.length && 'IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { if (e.isIntersecting) setze(stufen.indexOf(e.target)); });
    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
    stufen.forEach(function (s) { io.observe(s); });
  }

  /* Stationen anklickbar: springen zur Stufe */
  stationen.forEach(function (li, i) {
    li.setAttribute('tabindex', '0'); li.setAttribute('role', 'link');
    function geh() { if (stufen[i]) stufen[i].scrollIntoView({ behavior: reduziert ? 'auto' : 'smooth', block: 'center' }); }
    li.addEventListener('click', geh);
    li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); geh(); } });
  });
})();

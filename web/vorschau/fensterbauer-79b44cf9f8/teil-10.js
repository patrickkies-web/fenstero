/* Einheitliches Einblenden: Kopf und Inhalt der ruhigen Abschnitte blenden einmal auf (600 ms, 24 px, 0,98 → 1) */
(function () {
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (ruhig || !('IntersectionObserver' in window)) return;
  var ziele = document.querySelectorAll('.hint-kopf, .hint-karte, .schutz, .schluss-karte, .alternativen, .nah-text, .livegang-kopf, .lg-liste, .faq-kopf, .faq-liste, .anfrage-info, .formular, .wissen-innen');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  ziele.forEach(function (el) { el.classList.add('ein-blende'); io.observe(el); });
})();

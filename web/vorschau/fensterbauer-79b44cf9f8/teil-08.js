/* Ihre Adresse: Klick auf „Fenster planen“, Linie zeichnet sich, Konfigurator erscheint (einmal) */
(function () {
  var sek = document.getElementById('die-idee'); if (!sek) return;
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (ruhig || !('IntersectionObserver' in window)) return;
  sek.classList.add('wartet');
  new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { sek.classList.remove('wartet'); o.disconnect(); } }, { rootMargin: '0px 0px -30% 0px' }).observe(sek.querySelector('.weg'));
})();

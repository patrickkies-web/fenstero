/* So funktioniert es: Linie wächst mit dem Scrollen, erreichte Schritte werden markiert */
(function () {
  var sek = document.querySelector('.ablauf'); if (!sek) return;
  var liste = sek.querySelector('.schritte'), schritte = sek.querySelectorAll('.schritt'), blatt = document.querySelector('.blatt');
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (ruhig) { schritte.forEach(function (s) { s.classList.add('erreicht'); }); return; }
  var breit = function () { return innerWidth >= 1024; };
  if ('IntersectionObserver' in window) {
    sek.classList.add('wartet');
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { sek.classList.remove('wartet'); o.disconnect(); } }, { rootMargin: '0px 0px -20% 0px' }).observe(sek);
    if (blatt) {
    blatt.classList.add('wartet');
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { blatt.classList.remove('wartet'); o.disconnect(); } }, { rootMargin: '0px 0px -25% 0px' }).observe(blatt);
    }
  }
  var tick = false;
  function rollen() {
    tick = false;
    var r = liste.getBoundingClientRect(), vh = innerHeight, p;
    if (breit()) p = (vh * 0.85 - r.top) / (vh * 0.45);
    else p = (vh * 0.7 - r.top) / r.height;
    p = Math.min(1, Math.max(0, p));
    liste.style.setProperty('--fortschritt', p.toFixed(3));
    var n = schritte.length;
    schritte.forEach(function (s, i) { if (p >= (breit() ? i / (n - 1) : i / n) - 0.001) s.classList.add('erreicht'); });
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(rollen); } }, { passive: true });
  addEventListener('resize', rollen);
  rollen();
})();

/* Geräte: Deckel öffnet sich und Telefon fährt dazu, während der Abschnitt ins Bild kommt (ohne Anheften) */
(function () {
  var sek = document.querySelector('.geraete'); if (!sek) return;
  var szene = sek.querySelector('.geraete-szene');
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (ruhig) return;
  if ('IntersectionObserver' in window) {
    sek.classList.add('wartet');
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting) return;
      sek.classList.remove('wartet'); o.disconnect();
    }, { rootMargin: '0px 0px -20% 0px' }).observe(sek);
  }
  var tick = false;
  function e(x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3); }
  function rollen() {
    tick = false;
    var r = szene.getBoundingClientRect(), vh = innerHeight;
    /* 0, wenn die Szene unten ins Bild kommt; 1, wenn ihre Mitte bei 55 % der Bildschirmhöhe steht */
    var p = (vh - r.top) / (vh - (vh * 0.55 - r.height / 2));
    szene.style.setProperty('--oeffnen', e(p * 1.15).toFixed(3));
    szene.style.setProperty('--telefon', e(p * 1.15 - 0.25).toFixed(3));
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(rollen); } }, { passive: true });
  addEventListener('resize', rollen);
  rollen();
})();

/* Nähe: Empfehlung erscheint, Knopf wird getippt, Anfrage kommt beim Betrieb an (einmal); „Interesse vormerken“ füllt das Formular vor */
(function () {
  var sek = document.getElementById('naehe'); if (!sek) return;
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (!ruhig && 'IntersectionObserver' in window) {
    sek.classList.add('wartet');
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { sek.classList.remove('wartet'); o.disconnect(); } }, { rootMargin: '0px 0px -30% 0px' }).observe(sek.querySelector('.nah-bild'));
  }
  var link = sek.querySelector('[data-interesse]'), feld = document.getElementById('f-text');
  if (link && feld) link.addEventListener('click', function () {
    if (!feld.value.trim()) feld.value = 'Ich interessiere mich für zusätzliche Anfragen aus meiner Nähe.';
  });
})();

/* Laufbänder: Inhalte verdoppeln, gegenläufig bewegen, bei Hover/Fokus/Knopf anhalten */
(function () {
  var band = document.querySelector('.band');
  if (!band) return;
  var ruhig = false;
  try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var baender = band.querySelectorAll('.laufband');
  baender.forEach(function (lb) {
    var spur = lb.querySelector('.spur');
    Array.prototype.slice.call(spur.children).forEach(function (li) {
      var k = li.cloneNode(true);
      k.setAttribute('aria-hidden', 'true');
      k.setAttribute('data-klon', '');
      k.querySelectorAll('a, button').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
      spur.appendChild(k);
    });
    if (!ruhig) lb.classList.add('bereit');
  });

  var knopf = band.querySelector('.band-pause');
  if (!ruhig) {
    knopf.hidden = false;
    knopf.addEventListener('click', function () {
      var an = !band.classList.contains('pausiert');
      band.classList.toggle('pausiert', an);
      knopf.setAttribute('aria-pressed', String(an));
      knopf.setAttribute('aria-label', an ? 'Laufbänder fortsetzen' : 'Laufbänder anhalten');
    });
  }

  /* Einblenden, sobald der Abschnitt sichtbar wird */
  var sichtbar = true;
  if ('IntersectionObserver' in window && !ruhig) {
    band.classList.add('wartet');
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting) return;
      band.classList.remove('wartet');
      o.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' }).observe(band);
    new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; }).observe(band);
  }

  /* Weich anhalten: Rate läuft auf 0 statt hart zu stoppen (Hover, Fokus, Finger halten, Knopf) */
  if (!ruhig && document.timeline) {
    band.classList.add('weich');
    var laeufe = [];
    baender.forEach(function (lb) {
      var a = lb.querySelector('.spur').getAnimations()[0];
      if (!a) return;
      var l = { a: a, rate: 1, halt: false };
      laeufe.push(l);
      lb.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') l.halt = true; });
      lb.addEventListener('pointerleave', function () { l.halt = false; });
      lb.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') l.halt = true; });
      lb.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') setTimeout(function () { l.halt = false; }, 1200); });
      lb.addEventListener('focusin', function () { l.halt = true; });
      lb.addEventListener('focusout', function () { l.halt = false; });
    });
    (function tick() {
      var pause = band.classList.contains('pausiert') || !sichtbar || document.hidden;
      laeufe.forEach(function (l) {
        var ziel = (pause || l.halt) ? 0 : 1;
        l.rate += (ziel - l.rate) * 0.08;
        if (Math.abs(ziel - l.rate) < 0.002) l.rate = ziel;
        if (l.a.playbackRate !== l.rate) l.a.playbackRate = l.rate;
      });
      requestAnimationFrame(tick);
    })();
  }
})();
